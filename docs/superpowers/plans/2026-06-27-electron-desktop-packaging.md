# HPClaw Electron Desktop Packaging Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Windows Electron desktop package so `HPClaw.exe` opens HPClaw in an independent desktop window and automatically starts the existing backend.

**Architecture:** Keep HPClaw's existing Express, Socket.IO, SSH, and Vite production architecture. Add a small Electron main process that starts a bundled backend server on localhost, waits for it to respond, then opens a `BrowserWindow`. Add path helpers so packaged runtime writes go to a writable data directory while static assets and bundled skills remain app resources.

**Tech Stack:** Electron, electron-builder, esbuild, Node child processes, Express, React/Vite, Vitest.

---

## File Structure

- Create `server/paths.ts`: centralizes app root, static root, data root, and runtime path helpers.
- Create `server/paths.test.ts`: verifies environment-controlled path resolution.
- Modify `server.ts`: replace direct `process.cwd()` path use with `server/paths.ts`; generate runtime askpass scripts in the writable data root; dynamically import Vite only in development; serve production `dist` from the static root.
- Modify `server/ai/contextBuilder.ts`: use the same path helpers for skill directories.
- Modify `server/ai/agentRunner.ts`: use the same path helpers for fallback skill directories.
- Create `electron/main.cjs`: starts the backend child process, chooses a local port, waits for readiness, opens the desktop window, and cleans up on exit.
- Create `scripts/build-electron-server.mjs`: bundles the production backend to `dist-electron/server.js`.
- Modify `package.json`: add Electron entry, npm scripts, dev dependencies, and electron-builder configuration.
- Modify `.gitignore`: ignore `dist-electron/` and `release/`.

## Task 1: Runtime Path Helpers

**Files:**
- Create: `server/paths.ts`
- Create: `server/paths.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
import path from 'path';
import { afterEach, describe, expect, it } from 'vitest';

const originalEnv = { ...process.env };

async function loadPaths() {
  return import(`./paths?case=${Math.random()}`);
}

afterEach(() => {
  process.env = { ...originalEnv };
});

describe('server path helpers', () => {
  it('uses cwd for all roots by default', async () => {
    delete process.env.HPCLAW_APP_ROOT;
    delete process.env.HPCLAW_STATIC_ROOT;
    delete process.env.HPCLAW_DATA_ROOT;

    const paths = await loadPaths();

    expect(paths.APP_ROOT).toBe(process.cwd());
    expect(paths.STATIC_ROOT).toBe(process.cwd());
    expect(paths.DATA_ROOT).toBe(process.cwd());
    expect(paths.appPath('lsf_skills')).toBe(path.join(process.cwd(), 'lsf_skills'));
    expect(paths.staticPath('dist')).toBe(path.join(process.cwd(), 'dist'));
    expect(paths.dataPath('uploads')).toBe(path.join(process.cwd(), 'uploads'));
  });

  it('allows Electron to split app, static, and data roots', async () => {
    process.env.HPCLAW_APP_ROOT = 'C:/Program Files/HPClaw/resources/app.asar';
    process.env.HPCLAW_STATIC_ROOT = 'C:/Program Files/HPClaw/resources/app.asar';
    process.env.HPCLAW_DATA_ROOT = 'C:/Users/example/AppData/Roaming/HPClaw/runtime';

    const paths = await loadPaths();

    expect(paths.appPath('lsf_skills')).toBe(path.resolve('C:/Program Files/HPClaw/resources/app.asar', 'lsf_skills'));
    expect(paths.staticPath('dist')).toBe(path.resolve('C:/Program Files/HPClaw/resources/app.asar', 'dist'));
    expect(paths.dataPath('skills')).toBe(path.resolve('C:/Users/example/AppData/Roaming/HPClaw/runtime', 'skills'));
  });
});
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run: `npm test -- server/paths.test.ts`

Expected: FAIL because `server/paths.ts` does not exist.

- [ ] **Step 3: Add the path helper implementation**

```ts
import fs from 'fs';
import path from 'path';

function resolveRoot(value: string | undefined, fallback: string): string {
  return path.resolve(value || fallback);
}

export const APP_ROOT = resolveRoot(process.env.HPCLAW_APP_ROOT, process.cwd());
export const STATIC_ROOT = resolveRoot(process.env.HPCLAW_STATIC_ROOT, APP_ROOT);
export const DATA_ROOT = resolveRoot(process.env.HPCLAW_DATA_ROOT, APP_ROOT);

export function appPath(...segments: string[]): string {
  return path.join(APP_ROOT, ...segments);
}

export function staticPath(...segments: string[]): string {
  return path.join(STATIC_ROOT, ...segments);
}

export function dataPath(...segments: string[]): string {
  return path.join(DATA_ROOT, ...segments);
}

export function ensureDir(dir: string): string {
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}
```

- [ ] **Step 4: Run the focused test and confirm it passes**

Run: `npm test -- server/paths.test.ts`

Expected: PASS.

## Task 2: Package-Safe Backend Startup

**Files:**
- Modify: `server.ts`
- Modify: `server/ai/contextBuilder.ts`
- Modify: `server/ai/agentRunner.ts`

- [ ] **Step 1: Update server path usage**

In `server.ts`, import the path helpers:

```ts
import { appPath, dataPath, ensureDir, staticPath } from "./server/paths";
```

Replace the current root constants with:

```ts
const PORT = parseInt(process.env.PORT || "3003");
const RUNTIME_DIR = ensureDir(dataPath("runtime"));
const SKILLS_DIR = ensureDir(dataPath("skills"));
const LSF_SKILL_DIR = appPath("lsf_skills");
const CONVERSATIONS_DIR = ensureDir(dataPath("conversations"));
```

Replace the upload middleware with:

```ts
const upload = multer({ dest: ensureDir(dataPath("uploads")) });
```

Replace SSH runtime file paths with:

```ts
const controlPath = path.join(RUNTIME_DIR, `.ssh_mux_${sessionId}`);
const credsFile = path.join(RUNTIME_DIR, `.creds_${sessionId}.json`);
```

Replace production static serving with:

```ts
const distPath = staticPath("dist");
app.use(express.static(distPath));
app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));
```

- [ ] **Step 2: Make Vite development-only**

Remove the top-level Vite import:

```ts
import { createServer as createViteServer } from "vite";
```

Inside the development branch, load it dynamically:

```ts
const { createServer: createViteServer } = await import("vite");
const vite = await createViteServer({
  server: { middlewareMode: true, hmr: false },
  appType: "spa",
});
app.use(vite.middlewares);
```

- [ ] **Step 3: Generate askpass scripts in the runtime directory**

Replace the existing `ASKPASS_SCRIPT` block with code that writes both the JavaScript helper and platform wrapper to `RUNTIME_DIR`:

```ts
const ASKPASS_JS_SCRIPT = path.join(RUNTIME_DIR, `hpclaw-askpass-${process.pid}.cjs`);
const ASKPASS_SCRIPT = process.platform === 'win32'
  ? path.join(RUNTIME_DIR, `hpclaw-askpass-${process.pid}.cmd`)
  : path.join(RUNTIME_DIR, `hpclaw-askpass-${process.pid}.sh`);

const askpassJs = [
  'const fs = require("fs");',
  'const prompt = process.argv[2] || "";',
  'const text = String(prompt).toLowerCase();',
  'const file = process.env.CREDS_FILE;',
  'if (!file || !fs.existsSync(file)) { console.log(""); process.exit(0); }',
  'const creds = JSON.parse(fs.readFileSync(file, "utf8"));',
  'if (/verification|code|token|mfa|otp/.test(text)) console.log(creds.verificationCode || creds.password || "");',
  'else if (/password|passphrase/.test(text)) console.log(creds.password || creds.verificationCode || "");',
  'else console.log(creds.verificationCode || creds.password || "");',
].join('\n') + '\n';

try {
  fs.writeFileSync(ASKPASS_JS_SCRIPT, askpassJs);
  if (process.platform === 'win32') {
    const nodeExecutable = process.env.HPCLAW_NODE_EXECUTABLE || process.execPath;
    fs.writeFileSync(
      ASKPASS_SCRIPT,
      `@echo off\r\nset ELECTRON_RUN_AS_NODE=1\r\n"${nodeExecutable}" "${ASKPASS_JS_SCRIPT}" %*\r\n`
    );
  } else {
    fs.writeFileSync(ASKPASS_SCRIPT, `#!${process.execPath}\n${askpassJs}`, { mode: 0o755 });
  }
} catch (err: any) {
  console.error('[askpass] Failed to write askpass runtime scripts:', err?.message || err);
}
```

- [ ] **Step 4: Update skill fallback paths**

In `server/ai/contextBuilder.ts`, import helpers and replace `process.cwd()` skill paths:

```ts
import { appPath, dataPath } from '../paths';

const skillsDir = dataPath('skills');
const lsfSkillDir = appPath('lsf_skills');
```

In `server/ai/agentRunner.ts`, import helpers and replace fallback skill paths:

```ts
import { appPath, dataPath } from '../paths';

const skillsDir = ctx.skillsDir || dataPath('skills');
const lsfSkillDir = ctx.lsfSkillDir || appPath('lsf_skills');
```

- [ ] **Step 5: Run backend type and unit checks**

Run: `npm run lint`

Expected: PASS.

Run: `npm test -- server/paths.test.ts server/ai/contextBuilder.test.ts server/ai/agentRunner.test.ts`

Expected: PASS.

## Task 3: Electron Desktop Shell

**Files:**
- Create: `electron/main.cjs`

- [ ] **Step 1: Create the Electron main process**

```js
const { app, BrowserWindow, dialog } = require('electron');
const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');
const net = require('net');
const path = require('path');

let backendProcess = null;
let mainWindow = null;

function canListen(port) {
  return new Promise(resolve => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => server.close(() => resolve(true)));
    server.listen(port, '127.0.0.1');
  });
}

async function choosePort(startPort) {
  for (let port = startPort; port < startPort + 50; port += 1) {
    if (await canListen(port)) return port;
  }
  throw new Error(`No available localhost port from ${startPort} to ${startPort + 49}`);
}

function waitForServer(url, timeoutMs = 45000) {
  const startedAt = Date.now();
  return new Promise((resolve, reject) => {
    const attempt = () => {
      const req = http.get(url, res => {
        res.resume();
        resolve();
      });
      req.on('error', err => {
        if (Date.now() - startedAt > timeoutMs) {
          reject(new Error(`Backend did not respond at ${url}: ${err.message}`));
          return;
        }
        setTimeout(attempt, 300);
      });
      req.setTimeout(2000, () => req.destroy(new Error('request timeout')));
    };
    attempt();
  });
}

function appendLog(logFile, chunk) {
  fs.appendFileSync(logFile, chunk);
}

function startBackend(port) {
  const appRoot = app.getAppPath();
  const dataRoot = path.join(app.getPath('userData'), 'runtime');
  fs.mkdirSync(dataRoot, { recursive: true });

  const logFile = path.join(dataRoot, 'hpclaw-server.log');
  const env = {
    ...process.env,
    NODE_ENV: app.isPackaged ? 'production' : 'development',
    PORT: String(port),
    HPCLAW_APP_ROOT: appRoot,
    HPCLAW_STATIC_ROOT: appRoot,
    HPCLAW_DATA_ROOT: dataRoot,
    HPCLAW_NODE_EXECUTABLE: process.execPath,
  };

  let command;
  let args;
  let options = { cwd: appRoot, env, windowsHide: true };

  if (app.isPackaged) {
    command = process.execPath;
    args = [path.join(appRoot, 'dist-electron', 'server.js')];
    env.ELECTRON_RUN_AS_NODE = '1';
  } else if (process.platform === 'win32') {
    command = 'cmd.exe';
    args = ['/c', path.join(appRoot, 'node_modules', '.bin', 'tsx.cmd'), 'server.ts'];
  } else {
    command = path.join(appRoot, 'node_modules', '.bin', 'tsx');
    args = ['server.ts'];
  }

  fs.writeFileSync(logFile, `[electron] starting backend: ${command} ${args.join(' ')}\n`);
  backendProcess = spawn(command, args, options);
  backendProcess.stdout.on('data', chunk => appendLog(logFile, chunk));
  backendProcess.stderr.on('data', chunk => appendLog(logFile, chunk));
  backendProcess.on('exit', (code, signal) => {
    appendLog(logFile, `[electron] backend exited code=${code} signal=${signal}\n`);
  });

  return { logFile };
}

function createWindow(url) {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1100,
    minHeight: 720,
    title: 'HPClaw',
    backgroundColor: '#0f172a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL(url);
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function stopBackend() {
  if (backendProcess && !backendProcess.killed) {
    backendProcess.kill();
  }
  backendProcess = null;
}

async function boot() {
  const port = await choosePort(Number(process.env.PORT || 3003));
  const url = `http://127.0.0.1:${port}`;
  const { logFile } = startBackend(port);

  try {
    await waitForServer(url);
    createWindow(url);
  } catch (err) {
    stopBackend();
    dialog.showErrorBox('HPClaw failed to start', `${err.message}\n\nLog file:\n${logFile}`);
    app.quit();
  }
}

app.whenReady().then(boot);

app.on('window-all-closed', () => {
  stopBackend();
  app.quit();
});

app.on('before-quit', stopBackend);
```

- [ ] **Step 2: Run the desktop shell in development**

Run: `npx electron .`

Expected: Electron opens a desktop window, starts the backend in development mode, and loads HPClaw at localhost.

## Task 4: Backend Bundle And Packaging Scripts

**Files:**
- Create: `scripts/build-electron-server.mjs`
- Modify: `package.json`
- Modify: `.gitignore`

- [ ] **Step 1: Add the backend bundle script**

```js
import { build } from 'esbuild';
import { rm } from 'fs/promises';

await rm('dist-electron', { recursive: true, force: true });

await build({
  entryPoints: ['server.ts'],
  outfile: 'dist-electron/server.js',
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node22',
  sourcemap: false,
  define: {
    'process.env.NODE_ENV': '"production"',
  },
});
```

- [ ] **Step 2: Update package metadata and scripts**

Add or update these `package.json` fields:

```json
{
  "name": "hpclaw",
  "productName": "HPClaw",
  "main": "electron/main.cjs",
  "scripts": {
    "dev": "tsx server.ts",
    "start": "NODE_ENV=production tsx server.ts",
    "build": "vite build",
    "build:electron-server": "node scripts/build-electron-server.mjs",
    "electron:dev": "electron .",
    "electron:dist": "npm run build && npm run build:electron-server && electron-builder --win portable",
    "preview": "vite preview",
    "clean": "rm -rf dist dist-electron release",
    "lint": "tsc --noEmit",
    "test": "vitest run --pool threads --maxWorkers 1 --minWorkers 1"
  },
  "build": {
    "appId": "com.hpclaw.desktop",
    "productName": "HPClaw",
    "directories": {
      "output": "release"
    },
    "files": [
      "dist/**/*",
      "dist-electron/**/*",
      "electron/**/*",
      "lsf_skills/**/*",
      "package.json"
    ],
    "asar": true,
    "win": {
      "target": [
        {
          "target": "portable",
          "arch": [
            "x64"
          ]
        }
      ],
      "artifactName": "${productName}-${version}-${arch}.${ext}"
    }
  }
}
```

Add dev dependencies with npm:

```bash
npm install --save-dev electron electron-builder esbuild
```

- [ ] **Step 3: Ignore generated desktop artifacts**

Add these lines to `.gitignore`:

```gitignore
dist-electron/
release/
```

- [ ] **Step 4: Verify backend bundling**

Run: `npm run build:electron-server`

Expected: PASS and `dist-electron/server.js` exists.

- [ ] **Step 5: Verify frontend build**

Run: `npm run build`

Expected: PASS and `dist/index.html` exists.

- [ ] **Step 6: Build the portable exe**

Run: `npm run electron:dist`

Expected: PASS and a portable Windows exe appears under `release/`.

## Task 5: Final Verification

**Files:**
- No planned source changes unless verification exposes a defect.

- [ ] **Step 1: Run the full test suite**

Run: `npm test`

Expected: PASS.

- [ ] **Step 2: Run type checking**

Run: `npm run lint`

Expected: PASS.

- [ ] **Step 3: Run production build**

Run: `npm run build`

Expected: PASS.

- [ ] **Step 4: Run packaged build**

Run: `npm run electron:dist`

Expected: PASS and `release/HPClaw-0.0.0-x64.exe` exists.

- [ ] **Step 5: Smoke test the generated exe**

Run the exe from `release/`.

Expected: A desktop HPClaw window opens, the backend writes `hpclaw-server.log` under Electron user data, the login UI loads, and closing the window stops the backend process.

## Self-Review

- Spec coverage: The plan covers Electron shell, backend auto-start, static `dist` serving, writable data root, port selection, error dialog, scripts, and exe output.
- Placeholder scan: No `TBD`, `TODO`, or unspecified implementation steps remain.
- Type consistency: Path helper function names are consistent across tests and implementation steps: `appPath`, `staticPath`, `dataPath`, and `ensureDir`.
