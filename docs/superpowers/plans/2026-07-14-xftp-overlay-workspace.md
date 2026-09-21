# HPClaw Xftp-Style Overlay Workspace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create `E:\0612hpclaw\0714` as a clean HPClaw development copy and add an Electron-first, encrypted-host, single-session SSH/SFTP file-transfer workspace that slides over the unchanged main UI.

**Architecture:** Electron main owns encrypted profiles and local Windows file access; the local Express backend owns one `ssh2` client per active cluster and exposes shell, SFTP, exec, and transfer services through a random session ID. The renderer lazy-loads a right-side overlay containing host management, local/remote panes, advanced file operations, and a persistent transfer queue while leaving the current terminal and AI component tree mounted.

**Tech Stack:** TypeScript, React 19, Vite, Tailwind CSS, Electron, Electron `safeStorage`, `ssh2`, Express, Socket.IO, Node streams, Vitest, Testing Library, jsdom.

---

## Delivery Phases

This plan keeps one ordered execution document but produces four independently testable phases:

1. Clean copy and unified SSH/SFTP session.
2. Remote file and transfer services.
3. Electron secure profiles and local file bridge.
4. Overlay UI, advanced workflows, packaging, and visual verification.

All implementation commands after Task 1 run from `E:\0612hpclaw\0714`.

## File Structure

### Shared Contracts

- Create `shared/fileTransfer.ts`: renderer/backend contracts for profiles, entries, sessions, transfer tasks, conflict policies, search, and sync plans.
- Create `shared/fileTransfer.test.ts`: contract helper and state-transition tests.

### Backend

- Create `server/cluster/clusterSession.ts`: one authenticated `ssh2` client with shell, exec, SFTP, fingerprint validation, and lifecycle events.
- Create `server/cluster/clusterSession.test.ts`: fake-client tests for MFA, shell, SFTP, and disconnect behavior.
- Create `server/cluster/sessionRegistry.ts`: random session IDs and one-active-session lifecycle.
- Create `server/cluster/sessionRegistry.test.ts`: replacement and lookup tests.
- Create `server/cluster/sessionRequest.ts`: resolve a session from cookie, header, or Socket.IO auth.
- Create `server/cluster/sessionRequest.test.ts`: rejects unknown session IDs.
- Create `server/files/pathSafety.ts`: local/remote path validation and destructive-root guards.
- Create `server/files/pathSafety.test.ts`: Windows, POSIX, home-root, traversal, and empty-path cases.
- Create `server/files/sftpFileService.ts`: promisified remote list/stat/mkdir/rename/remove/chmod/preview/search methods.
- Create `server/files/sftpFileService.test.ts`: fake-SFTP behavior and metadata normalization.
- Create `server/files/registerFileRoutes.ts`: remote file REST routes backed by `sftpFileService`.
- Create `server/transfers/transferEngine.ts`: stream-based upload/download, atomic temporary names, pause/resume, retry, rate/progress, verification, and queue persistence.
- Create `server/transfers/transferEngine.test.ts`: partial-file, offset, pause, retry, atomic rename, and checksum tests.
- Create `server/transfers/transferStore.ts`: JSON persistence for non-secret queue state.
- Create `server/transfers/transferStore.test.ts`: restart restoration tests.
- Create `server/transfers/registerTransferRoutes.ts`: enqueue/control/list/sync endpoints.
- Modify `server.ts`: compose the new session, file, and transfer modules; preserve AI and conversation routes.
- Modify `server/socketSession.ts`: resolve session IDs from all supported request sources.
- Modify `server/socketSession.test.ts`: cover header and auth resolution.
- Remove obsolete OpenSSH/ASKPASS file-transfer helpers only after the unified session tests pass.

### Electron

- Create `electron/profile-store.cjs`: `safeStorage`-backed host profile persistence.
- Create `electron/profile-store.test.ts`: encrypted-at-rest and unavailable-encryption behavior.
- Create `electron/local-files.cjs`: drive/list/stat/create/rename/recycle/search/preview methods with path guards.
- Create `electron/local-files.test.ts`: temporary-directory operation tests.
- Create `electron/preload.cjs`: explicit context-bridge API.
- Create `electron/totp.cjs`: Node HMAC-SHA1 TOTP generation without exposing the secret.
- Create `electron/totp.test.ts`: RFC 6238 vector tests.
- Modify `electron/main.cjs`: preload setup, IPC registration, random backend token, secure connection broker, and activity-aware shutdown.
- Modify `scripts/build-electron-server.mjs`: retain new backend modules in the bundle.
- Modify `package.json` and `package-lock.json`: renderer test dependencies and preload/package entries.

### Renderer

- Create `src/types/desktop.d.ts`: typed `window.hpclawDesktop` API.
- Create `src/features/file-transfer/api.ts`: session-aware remote and transfer HTTP client.
- Create `src/features/file-transfer/controller.ts`: drawer, connection, pane, selection, and queue reducer.
- Create `src/features/file-transfer/controller.test.ts`: deterministic state tests.
- Create `src/features/file-transfer/FileTransferLauncher.tsx`: fixed edge launcher and progress badge.
- Create `src/features/file-transfer/FileTransferDrawer.tsx`: lazy overlay shell, scrim, focus, close, and maximize behavior.
- Create `src/features/file-transfer/FileTransferDrawer.test.tsx`: overlay and underlying-state tests.
- Create `src/features/file-transfer/FileTransferWorkspace.tsx`: feature composition, Socket.IO subscriptions, and local/remote/queue wiring.
- Create `src/features/file-transfer/HostManager.tsx`: profile list, edit/connect dialog, and fingerprint confirmation.
- Create `src/features/file-transfer/FilePane.tsx`: shared table, sorting, selection, keyboard, drag/drop, and context menu.
- Create `src/features/file-transfer/LocalFilePane.tsx`: Electron local adapter.
- Create `src/features/file-transfer/RemoteFilePane.tsx`: backend SFTP adapter.
- Create `src/features/file-transfer/TransferQueue.tsx`: task controls and filters.
- Create `src/features/file-transfer/ConflictDialog.tsx`: once/queue-wide conflict resolution.
- Create `src/features/file-transfer/SearchPanel.tsx`: cancellable local/remote search.
- Create `src/features/file-transfer/SyncPlanner.tsx`: dry-run comparison and guarded deletion opt-in.
- Create `src/features/file-transfer/FilePreview.tsx`: bounded text and image preview.
- Create `src/features/file-transfer/fileTransfer.css`: stable drawer, pane, table, splitter, queue, and responsive dimensions.
- Create `src/features/file-transfer/testFixtures.ts`: reusable renderer fixtures.
- Modify `src/App.tsx`: mount only the lazy launcher/drawer boundary and pass current connection state.
- Modify `src/index.css`: small global overlay z-index and reduced-motion integration only.
- Modify `src/components/LoginForm.tsx`: use secure desktop profiles when the Electron bridge exists while preserving web fallback.
- Modify `src/services/totpStorage.ts`: stop storing desktop credentials in browser storage; retain web-only fallback.

### Documentation And Delivery

- Create `docs/XFTP_WORKSPACE.md`: host security, transfer, sync, recovery, and troubleshooting guide.
- Modify `README.md`: document the overlay launcher and desktop profile behavior.
- Produce `release/HPClaw-0.0.0-x64.exe` from the `0714` copy.

## Task 1: Create The Clean `0714` Copy And Record The Baseline

**Files:**
- Create: `E:\0612hpclaw\0714\` from the approved source snapshot.
- Create temporarily: `E:\0612hpclaw\0714\.git\` for implementation checkpoints; remove it in Task 13 so the delivered copy contains no nested history.
- Modify: `E:\0612hpclaw\.git\info\exclude` to ignore `/0714/` in the source repository without changing the shared `.gitignore`.

- [ ] **Step 1: Copy the approved source snapshot with generated and sensitive paths excluded**

Run from `E:\0612hpclaw`:

```powershell
$source = (Resolve-Path '.').Path
$target = Join-Path $source '0714'
if (Test-Path -LiteralPath $target) { throw "Target already exists: $target" }
New-Item -ItemType Directory -Path $target | Out-Null

$excludedDirs = @(
  (Join-Path $source '.git'),
  (Join-Path $source '0714'),
  (Join-Path $source 'node_modules'),
  (Join-Path $source 'dist'),
  (Join-Path $source 'dist-electron'),
  (Join-Path $source 'release'),
  (Join-Path $source 'render_out'),
  (Join-Path $source 'tmp'),
  (Join-Path $source 'tmp_skills_repo'),
  (Join-Path $source 'uploads'),
  (Join-Path $source 'conversations'),
  (Join-Path $source '.superpowers\brainstorm')
)

& robocopy $source $target /E /COPY:DAT /DCOPY:DAT /R:2 /W:1 /XD $excludedDirs /XF '.env' '.creds_*.json' '*.log' 'release.zip'
if ($LASTEXITCODE -gt 7) { throw "robocopy failed with exit code $LASTEXITCODE" }
```

Expected: `0714\package.json`, `0714\src`, `0714\server`, `0714\electron`, and the approved spec/plan exist; excluded runtime paths do not.

- [ ] **Step 2: Keep the nested delivery folder out of the source repository status**

Add exactly this line to `E:\0612hpclaw\.git\info\exclude`:

```gitignore
/0714/
```

Run: `git status --short`
Expected: no `?? 0714/` entry, and all pre-existing source modifications remain unchanged.

- [ ] **Step 3: Initialize temporary checkpoints and install deterministic dependencies**

Run:

```powershell
Set-Location E:\0612hpclaw\0714
git init -b codex/0714-xftp
git add .
git commit -m "chore: snapshot clean 0714 baseline"
npm ci
npm install --save-dev @testing-library/react @testing-library/jest-dom jsdom
```

Expected: the clean baseline is committed; dependency installation succeeds without copying the old `node_modules`.

- [ ] **Step 4: Verify the copied baseline**

Run:

```powershell
npm test
npm run lint
npm run build
```

Expected: 31 test files and 95 tests pass before adding new tests; type checking and Vite build pass. Record any dependency-only count change before continuing.

- [ ] **Step 5: Commit test tooling**

```powershell
git add package.json package-lock.json
git commit -m "test: add renderer test environment"
```

## Task 2: Add Shared Contracts And Path Safety

**Files:**
- Create: `shared/fileTransfer.ts`
- Create: `shared/fileTransfer.test.ts`
- Create: `server/files/pathSafety.ts`
- Create: `server/files/pathSafety.test.ts`

- [ ] **Step 1: Write failing contract and path-safety tests**

```ts
import { describe, expect, it } from 'vitest';
import { canTransitionTransfer, makeTemporaryTransferName } from './fileTransfer';

describe('transfer contracts', () => {
  it('allows pause and resume but never resumes a completed task', () => {
    expect(canTransitionTransfer('running', 'paused')).toBe(true);
    expect(canTransitionTransfer('paused', 'queued')).toBe(true);
    expect(canTransitionTransfer('completed', 'queued')).toBe(false);
  });

  it('uses a hidden task-specific temporary name', () => {
    expect(makeTemporaryTransferName('/data/a.fastq.gz', 'task-7'))
      .toBe('/data/.a.fastq.gz.hpclaw-task-7.part');
  });
});
```

```ts
import { describe, expect, it } from 'vitest';
import { assertSafeLocalPath, assertSafeRemoteMutation } from './pathSafety';

describe('path safety', () => {
  it('accepts normal paths and rejects destructive roots', () => {
    expect(assertSafeLocalPath('D:\\BioProject\\reads.fastq.gz')).toBe('D:\\BioProject\\reads.fastq.gz');
    expect(assertSafeRemoteMutation('/home/lin/project/file.txt', '/home/lin')).toBe('/home/lin/project/file.txt');
    expect(() => assertSafeRemoteMutation('/', '/home/lin')).toThrow('protected remote path');
    expect(() => assertSafeRemoteMutation('/home/lin', '/home/lin')).toThrow('protected remote path');
    expect(() => assertSafeLocalPath('')).toThrow('path is required');
  });
});
```

- [ ] **Step 2: Run the focused tests and verify failure**

Run: `npm test -- shared/fileTransfer.test.ts server/files/pathSafety.test.ts`
Expected: FAIL because both modules are missing.

- [ ] **Step 3: Implement the shared contracts**

```ts
export type ConnectionState = 'disconnected' | 'connecting' | 'awaiting-fingerprint' | 'authenticating' | 'connected' | 'reconnecting' | 'failed';
export type FileSide = 'local' | 'remote';
export type EntryKind = 'file' | 'directory' | 'symlink';
export type TransferDirection = 'upload' | 'download';
export type TransferState = 'queued' | 'running' | 'paused' | 'retrying' | 'completed' | 'failed' | 'cancelled';
export type ConflictPolicy = 'ask' | 'overwrite' | 'resume' | 'skip' | 'rename';
export type VerificationMode = 'size' | 'sha256';

export interface FileEntry {
  name: string;
  path: string;
  kind: EntryKind;
  size: number;
  modifiedAt: number;
  permissions?: number;
  owner?: string;
  group?: string;
}

export interface HostProfileMetadata {
  id: string;
  name: string;
  group: string;
  host: string;
  port: number;
  username: string;
  favorite: boolean;
  defaultLocalPath?: string;
  defaultRemotePath?: string;
  fingerprint?: string;
  hasSavedPassword: boolean;
  hasSavedTotp: boolean;
  lastUsedAt?: number;
}

export interface TransferTask {
  id: string;
  profileId: string;
  sessionId?: string;
  direction: TransferDirection;
  localPath: string;
  remotePath: string;
  temporaryPath: string;
  totalBytes: number;
  transferredBytes: number;
  bytesPerSecond: number;
  state: TransferState;
  conflictPolicy: ConflictPolicy;
  verificationMode: VerificationMode;
  retryCount: number;
  error?: string;
  createdAt: number;
  updatedAt: number;
}

const allowed: Record<TransferState, TransferState[]> = {
  queued: ['running', 'paused', 'cancelled'],
  running: ['paused', 'retrying', 'completed', 'failed', 'cancelled'],
  paused: ['queued', 'cancelled'],
  retrying: ['running', 'paused', 'failed', 'cancelled'],
  completed: [],
  failed: ['queued', 'cancelled'],
  cancelled: [],
};

export function canTransitionTransfer(from: TransferState, to: TransferState): boolean {
  return allowed[from].includes(to);
}

export function makeTemporaryTransferName(targetPath: string, taskId: string): string {
  const separator = targetPath.includes('\\') ? '\\' : '/';
  const parts = targetPath.split(separator);
  const name = parts.pop() || 'transfer';
  return [...parts, `.${name}.hpclaw-${taskId}.part`].join(separator);
}
```

- [ ] **Step 4: Implement path guards with `node:path` rather than string replacement**

```ts
import path from 'node:path';

export function assertSafeLocalPath(input: string): string {
  if (!input.trim()) throw new Error('path is required');
  if (input.includes('\0')) throw new Error('path contains a null byte');
  return path.win32.normalize(input);
}

export function assertSafeRemotePath(input: string): string {
  if (!input.trim()) throw new Error('path is required');
  if (input.includes('\0')) throw new Error('path contains a null byte');
  const normalized = path.posix.normalize(input);
  if (!normalized.startsWith('/')) throw new Error('remote path must be absolute');
  return normalized;
}

export function assertSafeRemoteMutation(input: string, home: string): string {
  const normalized = assertSafeRemotePath(input);
  const protectedPaths = new Set(['/', '/home', path.posix.normalize(home)]);
  if (protectedPaths.has(normalized)) throw new Error(`protected remote path: ${normalized}`);
  return normalized;
}
```

- [ ] **Step 5: Run tests and commit**

Run: `npm test -- shared/fileTransfer.test.ts server/files/pathSafety.test.ts`
Expected: PASS.

```powershell
git add shared/fileTransfer.ts shared/fileTransfer.test.ts server/files/pathSafety.ts server/files/pathSafety.test.ts
git commit -m "feat: define file transfer contracts and path guards"
```

## Task 3: Build The Unified `ssh2` Cluster Session

**Files:**
- Create: `server/cluster/clusterSession.ts`
- Create: `server/cluster/clusterSession.test.ts`
- Create: `server/cluster/sessionRegistry.ts`
- Create: `server/cluster/sessionRegistry.test.ts`

- [ ] **Step 1: Write failing tests with an injected fake SSH client**

```ts
import { EventEmitter } from 'node:events';
import { describe, expect, it, vi } from 'vitest';
import { ClusterSession } from './clusterSession';

class FakeClient extends EventEmitter {
  connectOptions: any;
  connect(options: any) { this.connectOptions = options; queueMicrotask(() => this.emit('ready')); }
  shell(_options: any, callback: any) { callback(null, Object.assign(new EventEmitter(), { write: vi.fn(), setWindow: vi.fn(), end: vi.fn() })); }
  sftp(callback: any) { callback(null, { readdir: vi.fn() }); }
  exec(_command: string, callback: any) { callback(null, new EventEmitter()); }
  end = vi.fn();
}

describe('ClusterSession', () => {
  it('answers password and TOTP keyboard-interactive prompts and opens one shared client', async () => {
    const client = new FakeClient();
    const session = new ClusterSession(() => client as any);
    await session.connect({ host: 'hpc.test', port: 22, username: 'lin', password: 'secret', verificationCode: '123456' }, async () => true);

    const finish = vi.fn();
    client.emit('keyboard-interactive', '', '', '', [{ prompt: 'Password:' }, { prompt: 'Verification code:' }], finish);
    expect(finish).toHaveBeenCalledWith(['secret', '123456']);
    expect(session.state).toBe('connected');
  });
});
```

Registry test:

```ts
import { describe, expect, it, vi } from 'vitest';
import { SessionRegistry } from './sessionRegistry';

it('closes the previous session when a new single active session is registered', () => {
  const first = { close: vi.fn() } as any;
  const second = { close: vi.fn() } as any;
  const registry = new SessionRegistry();
  registry.register('first', first);
  registry.register('second', second);
  expect(first.close).toHaveBeenCalledOnce();
  expect(registry.get('second')).toBe(second);
});
```

- [ ] **Step 2: Run tests and verify failure**

Run: `npm test -- server/cluster/clusterSession.test.ts server/cluster/sessionRegistry.test.ts`
Expected: FAIL because the modules are missing.

- [ ] **Step 3: Implement a single-client session with explicit shell, SFTP, exec, resize, and close methods**

Use this public contract in `clusterSession.ts`:

```ts
import { EventEmitter } from 'node:events';
import { Client, type ClientChannel, type ConnectConfig, type SFTPWrapper } from 'ssh2';
import type { ConnectionState } from '../../shared/fileTransfer';

export interface ClusterCredentials {
  host: string;
  port: number;
  username: string;
  password: string;
  verificationCode: string;
  expectedFingerprint?: string;
}

export class ClusterSession extends EventEmitter {
  state: ConnectionState = 'disconnected';
  shell?: ClientChannel;
  sftp?: SFTPWrapper;
  private client?: Client;

  constructor(private readonly createClient: () => Client = () => new Client()) { super(); }

  async connect(credentials: ClusterCredentials, trustFingerprint: (fingerprint: string) => Promise<boolean>): Promise<void> {
    this.state = 'connecting';
    const client = this.createClient();
    this.client = client;

    await new Promise<void>((resolve, reject) => {
      let settled = false;
      const fail = (error: Error) => { if (!settled) { settled = true; this.state = 'failed'; reject(error); } };
      client.once('error', fail);
      client.on('keyboard-interactive', (_name, _instructions, _lang, prompts, finish) => {
        finish(prompts.map(prompt => /verification|code|token|mfa|otp/i.test(prompt.prompt)
          ? credentials.verificationCode
          : credentials.password));
      });
      client.once('ready', () => {
        if (settled) return;
        settled = true;
        this.state = 'connected';
        client.on('close', () => { this.state = 'disconnected'; this.emit('disconnected'); });
        resolve();
      });

      const config: ConnectConfig = {
        host: credentials.host,
        port: credentials.port,
        username: credentials.username,
        password: credentials.password,
        tryKeyboard: true,
        readyTimeout: 60_000,
        keepaliveInterval: 15_000,
        keepaliveCountMax: 3,
        hostHash: 'sha256',
        hostVerifier: (fingerprint, callback) => {
          this.state = 'awaiting-fingerprint';
          const accepted = credentials.expectedFingerprint === fingerprint
            ? Promise.resolve(true)
            : trustFingerprint(fingerprint);
          accepted.then(callback, () => callback(false));
        },
      };
      this.state = 'authenticating';
      client.connect(config);
    });

    this.shell = await new Promise<ClientChannel>((resolve, reject) => {
      client.shell({ term: 'xterm-256color', cols: 120, rows: 36 }, (error, stream) => error ? reject(error) : resolve(stream));
    });
    this.sftp = await new Promise<SFTPWrapper>((resolve, reject) => {
      client.sftp((error, sftp) => error ? reject(error) : resolve(sftp));
    });
  }

  write(data: string | Buffer) { if (!this.shell) throw new Error('shell is not ready'); this.shell.write(data); }
  resize(cols: number, rows: number) { this.shell?.setWindow(rows, cols, 0, 0); }
  getSftp(): SFTPWrapper {
    if (this.state !== 'connected' || !this.sftp) throw new Error('SFTP is not ready');
    return this.sftp;
  }

  exec(command: string, timeoutMs = 30_000): Promise<string> {
    const client = this.client;
    if (this.state !== 'connected' || !client) return Promise.reject(new Error('SSH is not connected'));
    return new Promise((resolve, reject) => {
      client.exec(command, (error, stream) => {
        if (error) return reject(error);
        const stdout: Buffer[] = [];
        const stderr: Buffer[] = [];
        let settled = false;
        const timer = setTimeout(() => {
          if (settled) return;
          settled = true;
          stream.close();
          reject(new Error(`Command timed out after ${timeoutMs} ms`));
        }, timeoutMs);
        stream.on('data', chunk => stdout.push(Buffer.from(chunk)));
        stream.stderr.on('data', chunk => stderr.push(Buffer.from(chunk)));
        stream.on('close', (code: number) => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          const errorText = Buffer.concat(stderr).toString('utf8').trim();
          if (code === 0) resolve(Buffer.concat(stdout).toString('utf8'));
          else reject(new Error(errorText || `Remote command exited with ${code}`));
        });
      });
    });
  }

  close() { this.shell?.end(); this.client?.end(); this.state = 'disconnected'; }
}
```

- [ ] **Step 4: Implement the one-active-session registry with cryptographic IDs**

```ts
import { randomUUID } from 'node:crypto';
import type { ClusterSession } from './clusterSession';

export class SessionRegistry {
  private sessions = new Map<string, ClusterSession>();

  createId(): string { return randomUUID(); }

  register(id: string, session: ClusterSession): void {
    for (const [existingId, existing] of this.sessions) {
      if (existingId !== id) { existing.close(); this.sessions.delete(existingId); }
    }
    this.sessions.set(id, session);
  }

  get(id: string | undefined): ClusterSession | undefined { return id ? this.sessions.get(id) : undefined; }
  remove(id: string): void { this.sessions.get(id)?.close(); this.sessions.delete(id); }
  has(id: string): boolean { return this.sessions.has(id); }
}
```

- [ ] **Step 5: Run tests and commit**

Run: `npm test -- server/cluster/clusterSession.test.ts server/cluster/sessionRegistry.test.ts`
Expected: PASS, including timeout and disconnect tests added before commit.

```powershell
git add server/cluster
git commit -m "feat: add unified ssh2 cluster session"
```

## Task 4: Integrate Login, Terminal Socket, And AI Command Execution

**Files:**
- Create: `server/cluster/sessionRequest.ts`
- Create: `server/cluster/sessionRequest.test.ts`
- Modify: `server.ts`
- Modify: `server/socketSession.ts`
- Modify: `server/socketSession.test.ts`
- Modify: `src/components/Terminal.tsx`

- [ ] **Step 1: Write failing session-resolution tests**

```ts
import { describe, expect, it } from 'vitest';
import { resolveRequestSessionId } from './sessionRequest';

it('accepts an active explicit session header and rejects unknown values', () => {
  const has = (id: string) => id === 'active';
  expect(resolveRequestSessionId({ cookie: undefined, header: 'active', auth: undefined }, has)).toBe('active');
  expect(resolveRequestSessionId({ cookie: undefined, header: 'stale', auth: undefined }, has)).toBeUndefined();
});
```

- [ ] **Step 2: Run the focused tests and verify failure**

Run: `npm test -- server/cluster/sessionRequest.test.ts server/socketSession.test.ts`
Expected: FAIL for the new header resolution case.

- [ ] **Step 3: Implement one resolver and use it for HTTP and Socket.IO**

```ts
export function resolveRequestSessionId(
  values: { cookie: unknown; header: unknown; auth: unknown },
  hasSession: (id: string) => boolean,
): string | undefined {
  for (const value of [values.cookie, values.header, values.auth]) {
    if (typeof value === 'string' && hasSession(value)) return value;
  }
  return undefined;
}
```

In `server.ts`, replace the OpenSSH process creation in `/api/login` with `ClusterSession.connect`, register the new session, set `req.session.sshSessionId`, and return `{ success: true, sessionId, fingerprint }`. Add a desktop-only `/api/desktop/connect` route that checks `req.get('X-HPClaw-Desktop-Token')` with `timingSafeEqual` before accepting decrypted credentials from Electron main.

The first connection must not silently trust a host. `ClusterSession` captures the SHA-256 fingerprint seen by `hostVerifier`. If no expected fingerprint exists, return HTTP `428` with `{ code: 'HOST_FINGERPRINT_REQUIRED', fingerprint }`. If it differs from the stored value, return HTTP `409` with `{ code: 'HOST_FINGERPRINT_MISMATCH', expected, actual }`. The renderer confirms or replaces trust through Electron profile IPC and retries with the exact stored fingerprint.

Change Socket.IO handlers to:

```ts
socket.on('data', (data: string) => session.write(data));
socket.on('resize', (cols: number, rows: number) => session.resize(cols, rows));
session.shell?.on('data', (data: Buffer) => socket.emit('data', data.toString('utf8')));
```

Route AI command execution through `session.exec(command, timeoutMs)` instead of terminal markers. Keep the existing `executeCommand` response contract so `AIChat` does not need a simultaneous refactor.

On `ssh2` close, emit `cluster:reauth-required` with the profile ID and pause active transfer streams. The renderer retries secure `profiles.connect(profileId)` after `1s`, `2s`, and `5s`; Electron main generates a fresh TOTP for every attempt. After three failures, remain disconnected and require the user to click reconnect. Never replay shell commands.

- [ ] **Step 4: Remove terminal marker filtering only after backend exec isolation works**

In `src/components/Terminal.tsx`, replace the marker buffer in `socket.on('data')` with:

```ts
socket.on('data', (data: string) => {
  term.write(data);
  if (captureRef.current.active) captureRef.current.buffer += data;
});
```

Retain the existing command-capture behavior for user-triggered terminal commands. Backend AI/file commands no longer traverse the shell stream.

- [ ] **Step 5: Run regression tests and commit**

Run:

```powershell
npm test -- server/cluster server/socketSession.test.ts server/ai/agentRunner.test.ts server/sshCommandSafety.test.ts
npm run lint
```

Expected: PASS; a login unit test proves password-plus-TOTP prompts are answered once.

```powershell
git add server.ts server/cluster server/socketSession.ts server/socketSession.test.ts src/components/Terminal.tsx
git commit -m "refactor: route terminal and commands through one ssh2 session"
```

## Task 5: Add The Remote SFTP File Service

**Files:**
- Create: `server/files/sftpFileService.ts`
- Create: `server/files/sftpFileService.test.ts`
- Create: `server/files/registerFileRoutes.ts`
- Modify: `server.ts`

- [ ] **Step 1: Write failing fake-SFTP tests for metadata and guarded operations**

```ts
import { describe, expect, it, vi } from 'vitest';
import { SftpFileService } from './sftpFileService';

it('normalizes readdir output and sorts directories first', async () => {
  const sftp = { readdir: vi.fn((_path, cb) => cb(null, [
    { filename: 'b.txt', longname: '-rw-r--r--', attrs: { size: 8, mtime: 20, mode: 0o100644 } },
    { filename: 'analysis', longname: 'drwxr-xr-x', attrs: { size: 0, mtime: 10, mode: 0o40755 } },
  ])) } as any;
  const service = new SftpFileService(sftp, '/home/lin');
  const entries = await service.list('/home/lin');
  expect(entries.map(entry => entry.name)).toEqual(['analysis', 'b.txt']);
  expect(entries[0].kind).toBe('directory');
});
```

Add these concrete operation assertions to the same fake-SFTP suite:

```ts
it('delegates mutations only after path validation', async () => {
  const sftp = {
    mkdir: vi.fn((_path, cb) => cb()),
    rename: vi.fn((_from, _to, cb) => cb()),
    chmod: vi.fn((_path, _mode, cb) => cb()),
    unlink: vi.fn((_path, cb) => cb()),
  } as any;
  const service = new SftpFileService(sftp, '/home/lin');
  await service.mkdir('/home/lin/new');
  await service.rename('/home/lin/a', '/home/lin/b');
  await service.chmod('/home/lin/b', 0o640);
  expect(sftp.mkdir).toHaveBeenCalledWith('/home/lin/new', expect.any(Function));
  expect(sftp.rename).toHaveBeenCalledWith('/home/lin/a', '/home/lin/b', expect.any(Function));
  expect(sftp.chmod).toHaveBeenCalledWith('/home/lin/b', 0o640, expect.any(Function));
  await expect(service.remove('/home/lin', true)).rejects.toThrow('protected remote path');
});
```

- [ ] **Step 2: Run the focused test and verify failure**

Run: `npm test -- server/files/sftpFileService.test.ts`
Expected: FAIL because the service is missing.

- [ ] **Step 3: Implement promisified SFTP operations**

The service public API must be:

```ts
export class SftpFileService {
  constructor(private readonly sftp: SFTPWrapper, private readonly home: string, private readonly exec?: (command: string, timeout?: number) => Promise<string>) {}
  list(remotePath: string): Promise<FileEntry[]>;
  stat(remotePath: string): Promise<FileEntry>;
  mkdir(remotePath: string): Promise<void>;
  rename(from: string, to: string): Promise<void>;
  remove(remotePath: string, recursive: boolean): Promise<{ removed: number }>;
  chmod(remotePath: string, mode: number): Promise<void>;
  readPreview(remotePath: string, maxBytes: number): Promise<Buffer>;
  search(root: string, query: string, signal: AbortSignal): AsyncGenerator<FileEntry[]>;
}
```

Wrap callback APIs in private Promise helpers. Use `assertSafeRemotePath` on reads and `assertSafeRemoteMutation` on changes. Never build a shell search command with unquoted user input; encode the query as a positional argument to `find` or reject bytes outside the allowed filename pattern.

- [ ] **Step 4: Register session-aware routes**

`registerFileRoutes.ts` registers:

```text
GET    /api/remote/files?path=
GET    /api/remote/stat?path=
POST   /api/remote/mkdir
POST   /api/remote/rename
POST   /api/remote/remove/preview
POST   /api/remote/remove
POST   /api/remote/chmod
GET    /api/remote/preview?path=
GET    /api/remote/search?root=&query=
```

Every route resolves `X-SSH-Session-Id`, obtains the current session's SFTP channel, returns normalized JSON errors, and sets bounded preview/search limits.

- [ ] **Step 5: Run tests and commit**

Run: `npm test -- server/files server/cluster`
Expected: PASS.

```powershell
git add server/files server.ts
git commit -m "feat: add guarded remote sftp file service"
```

## Task 6: Build The Persistent Transfer Engine

**Files:**
- Create: `server/transfers/transferStore.ts`
- Create: `server/transfers/transferStore.test.ts`
- Create: `server/transfers/transferEngine.ts`
- Create: `server/transfers/transferEngine.test.ts`
- Create: `server/transfers/registerTransferRoutes.ts`
- Modify: `server.ts`

- [ ] **Step 1: Write failing persistence and resume tests**

```ts
import { describe, expect, it } from 'vitest';
import { normalizeRestoredTasks } from './transferStore';

it('restores incomplete work as paused without credentials or session ids', () => {
  const [task] = normalizeRestoredTasks([{ id: 't1', state: 'running', sessionId: 'old', transferredBytes: 42 } as any]);
  expect(task.state).toBe('paused');
  expect(task.sessionId).toBeUndefined();
  expect(JSON.stringify(task)).not.toContain('password');
});
```

```ts
import { Readable, Writable } from 'node:stream';
import { vi } from 'vitest';

it('resumes an upload at the confirmed remote temporary-file size and atomically renames it', async () => {
  const calls: string[] = [];
  const adapter = {
    remoteSize: vi.fn(async () => 1024),
    openLocalRead: vi.fn((_path: string, offset: number) => {
      expect(offset).toBe(1024);
      return Readable.from(Buffer.alloc(3072));
    }),
    openRemoteWrite: vi.fn((_path: string, offset: number) => {
      expect(offset).toBe(1024);
      return new Writable({ write(_chunk, _encoding, callback) { callback(); } });
    }),
    verify: vi.fn(async () => { calls.push('verify'); }),
    rename: vi.fn(async () => { calls.push('rename'); }),
  } as any;
  const engine = new TransferEngine(adapter, { concurrency: 1, emit: () => {} });
  const task = engine.enqueue({
    profileId: 'p1', direction: 'upload', localPath: 'D:\\a.bin', remotePath: '/data/a.bin',
    temporaryPath: '/data/.a.bin.hpclaw-t1.part', totalBytes: 4096, transferredBytes: 1024,
    conflictPolicy: 'resume', verificationMode: 'size', retryCount: 0,
  });
  await engine.resume(task.id, 'session-1');
  await engine.waitForIdle();
  expect(calls).toEqual(['verify', 'rename']);
  expect(engine.list()[0].state).toBe('completed');
});

it.each([
  ['size mismatch', 'failed'],
  ['checksum mismatch', 'failed'],
  ['permission denied', 'failed'],
])('does not mark %s as complete', async (message, expectedState) => {
  const engine = makeFailingEngine(new Error(message));
  const task = enqueueFixture(engine);
  await engine.resume(task.id, 'session-1');
  await engine.waitForIdle();
  expect(engine.list()[0].state).toBe(expectedState);
});

function makeFailingEngine(error: Error) {
  const adapter = {
    remoteSize: async () => 0,
    openLocalRead: () => Readable.from(Buffer.alloc(1)),
    openRemoteWrite: () => new Writable({ write(_chunk, _encoding, callback) { callback(); } }),
    verify: async () => { throw error; },
    rename: vi.fn(),
  } as any;
  return new TransferEngine(adapter, { concurrency: 1, emit: () => {} });
}

function enqueueFixture(engine: TransferEngine) {
  return engine.enqueue({
    profileId: 'p1', direction: 'upload', localPath: 'D:\\a.bin', remotePath: '/data/a.bin',
    temporaryPath: '/data/.a.bin.hpclaw-fixture.part', totalBytes: 1, transferredBytes: 0,
    conflictPolicy: 'overwrite', verificationMode: 'size', retryCount: 0,
  });
}
```

- [ ] **Step 2: Run the focused tests and verify failure**

Run: `npm test -- server/transfers`
Expected: FAIL because transfer modules are missing.

- [ ] **Step 3: Implement queue persistence**

```ts
export function normalizeRestoredTasks(tasks: TransferTask[]): TransferTask[] {
  return tasks.map(task => ({
    ...task,
    sessionId: undefined,
    state: ['completed', 'failed', 'cancelled'].includes(task.state) ? task.state : 'paused',
    bytesPerSecond: 0,
  }));
}
```

`TransferStore` writes with `fs.promises.writeFile` to a sibling temporary JSON file and atomically renames it. Persist only `TransferTask` fields from the shared contract.

- [ ] **Step 4: Implement stream-based task control**

The engine public API must be:

```ts
export class TransferEngine {
  enqueue(input: Omit<TransferTask, 'id' | 'state' | 'createdAt' | 'updatedAt' | 'bytesPerSecond'>): TransferTask;
  list(): TransferTask[];
  pause(id: string): Promise<void>;
  resume(id: string, sessionId: string): Promise<void>;
  cancel(id: string): Promise<void>;
  retry(id: string, sessionId: string): Promise<void>;
  setConcurrency(value: 1 | 2 | 3 | 4): void;
  setBandwidthLimit(bytesPerSecond: number | null): void;
  waitForIdle(): Promise<void>;
  shutdown(): Promise<void>;
}
```

Use `stream.pipeline` for local/SFTP streams. Store an `AbortController` per running task. Emit `transfer:updated` after throttled progress intervals and immediately on state changes. Upload/download to `makeTemporaryTransferName`, verify size or SHA-256, then rename atomically. Retry network failures at most three times; never retry authentication, permission, conflict, or checksum errors automatically.

- [ ] **Step 5: Register routes and Socket.IO events**

Routes:

```text
GET    /api/transfers
POST   /api/transfers
POST   /api/transfers/:id/pause
POST   /api/transfers/:id/resume
POST   /api/transfers/:id/cancel
POST   /api/transfers/:id/retry
PUT    /api/transfers/settings
```

Broadcast `transfer:updated`, `transfer:removed`, and `transfer:summary` through the existing Socket.IO server. All mutations require the active SSH session ID and matching `profileId`.

- [ ] **Step 6: Run tests and commit**

Run: `npm test -- server/transfers server/files server/cluster`
Expected: PASS with no whole-file `readFile` or Base64 conversion in transfer code.

```powershell
git add server/transfers server.ts shared/fileTransfer.ts
git commit -m "feat: add persistent resumable transfer engine"
```

## Task 7: Add Encrypted Profiles, TOTP, And The Local File Bridge

**Files:**
- Create: `electron/profile-store.cjs`
- Create: `electron/profile-store.test.ts`
- Create: `electron/totp.cjs`
- Create: `electron/totp.test.ts`
- Create: `electron/local-files.cjs`
- Create: `electron/local-files.test.ts`
- Create: `electron/preload.cjs`
- Modify: `electron/main.cjs`
- Modify: `package.json`

- [ ] **Step 1: Write failing profile encryption and TOTP tests**

```ts
import { describe, expect, it } from 'vitest';
import { createProfileStore } from './profile-store.cjs';

function createMemoryFiles() {
  let value = '';
  return {
    read: async () => value,
    writeAtomic: async (_path: string, next: string) => { value = next; },
    text: () => value,
  };
}

it('stores encrypted secrets and returns metadata without plaintext', async () => {
  const files = createMemoryFiles();
  const safeStorage = { isEncryptionAvailable: () => true, encryptString: (value: string) => Buffer.from(`enc:${value}`), decryptString: (value: Buffer) => value.toString().slice(4) };
  const store = createProfileStore({ safeStorage, files, filePath: 'profiles.json' });
  await store.save({ id: 'p1', name: 'NCPGR', host: 'hpc.test', port: 22, username: 'lin', password: 'secret', totpSecret: 'JBSWY3DPEHPK3PXP' });
  expect(files.text()).not.toContain('secret');
  expect(store.list()[0]).toMatchObject({ id: 'p1', hasSavedPassword: true, hasSavedTotp: true });
});
```

Use the RFC 6238 SHA-1 vector in `totp.test.ts` with an injected timestamp.

- [ ] **Step 2: Run tests and verify failure**

Run: `npm test -- electron/profile-store.test.ts electron/totp.test.ts electron/local-files.test.ts`
Expected: FAIL because the modules are missing.

- [ ] **Step 3: Implement `safeStorage` profile persistence**

`profile-store.cjs` exports `createProfileStore({ safeStorage, files, filePath })`. It stores metadata plus Base64-encoded encrypted buffers. `list()` strips encrypted fields. `getCredentials(id)` decrypts only inside Electron main. If `safeStorage.isEncryptionAvailable()` is false, `save` rejects attempts to persist non-empty secrets with `Secure credential storage is unavailable`.

- [ ] **Step 4: Implement Node TOTP and local file operations**

`totp.cjs` uses `crypto.createHmac('sha1', key)` and exports:

```js
const crypto = require('node:crypto');

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
function decodeBase32(secret) {
  let bits = '';
  for (const char of secret.toUpperCase().replace(/=|\s/g, '')) {
    const value = alphabet.indexOf(char);
    if (value < 0) throw new Error(`Invalid Base32 character: ${char}`);
    bits += value.toString(2).padStart(5, '0');
  }
  const bytes = [];
  for (let offset = 0; offset + 8 <= bits.length; offset += 8) bytes.push(parseInt(bits.slice(offset, offset + 8), 2));
  return Buffer.from(bytes);
}

function generateTotp(secret, timestamp = Date.now(), period = 30, digits = 6) {
  const counter = BigInt(Math.floor(timestamp / 1000 / period));
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigUInt64BE(counter);
  const digest = crypto.createHmac('sha1', decodeBase32(secret)).update(counterBuffer).digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const binary = digest.readUInt32BE(offset) & 0x7fffffff;
  return String(binary % (10 ** digits)).padStart(digits, '0');
}
module.exports = { generateTotp };
```

`local-files.cjs` exports a dependency-injected service with:

```js
listDrives();
list(directoryPath);
stat(targetPath);
mkdir(targetPath);
rename(from, to);
trash(targetPath);
readPreview(targetPath, maxBytes);
search(root, query, signal);
```

Normalize every path with `path.win32`, reject null bytes and unresolved paths, use `shell.trashItem` for deletion, cap text preview at 1 MiB and image preview at 20 MiB, and stream search results in batches.

- [ ] **Step 5: Add a strict preload API and main-process handlers**

`preload.cjs` exposes only:

```js
contextBridge.exposeInMainWorld('hpclawDesktop', {
  profiles: { list, save, remove, trustFingerprint, connect },
  localFiles: { listDrives, list, stat, mkdir, rename, trash, preview, search, cancelSearch },
  app: { onBeforeCloseDecision },
});
```

In `main.cjs`, set `preload: path.join(__dirname, 'preload.cjs')`, generate `crypto.randomBytes(32).toString('hex')` as `HPCLAW_DESKTOP_TOKEN`, register IPC handlers, decrypt secrets only inside the connect handler, generate TOTP, and call `/api/desktop/connect` with the token. Return only session/profile/fingerprint metadata to the renderer.

- [ ] **Step 6: Run tests and commit**

Run:

```powershell
npm test -- electron
npm run lint
```

Expected: PASS; serialized fixture data contains no password or TOTP secret.

```powershell
git add electron package.json package-lock.json
git commit -m "feat: add encrypted desktop profiles and local file bridge"
```

## Task 8: Add Renderer API And State Controller

**Files:**
- Create: `src/types/desktop.d.ts`
- Create: `src/features/file-transfer/api.ts`
- Create: `src/features/file-transfer/controller.ts`
- Create: `src/features/file-transfer/controller.test.ts`
- Create: `src/features/file-transfer/testFixtures.ts`

- [ ] **Step 1: Write failing controller tests**

```ts
import { describe, expect, it } from 'vitest';
import { initialFileTransferState, reduceFileTransfer } from './controller';

it('opens as an overlay, retains active transfers when closed, and exposes badge progress', () => {
  const task = {
    id: 't1', profileId: 'p1', direction: 'upload', localPath: 'D:\\a', remotePath: '/a',
    temporaryPath: '/.a.part', totalBytes: 100, transferredBytes: 50, bytesPerSecond: 10,
    state: 'running', conflictPolicy: 'ask', verificationMode: 'size', retryCount: 0,
    createdAt: 1, updatedAt: 1,
  } as const;
  let state = reduceFileTransfer(initialFileTransferState, { type: 'drawer/open' });
  state = reduceFileTransfer(state, { type: 'transfer/upsert', task });
  state = reduceFileTransfer(state, { type: 'drawer/close' });
  expect(state.drawerOpen).toBe(false);
  expect(state.transfers.t1.state).toBe('running');
  expect(state.summary.progress).toBe(0.5);
});
```

Use table-driven reducer assertions for `profile/connected`, `pane/navigate`, `pane/select`, `conflict/open`, and `queue/restored`; each assertion starts from `initialFileTransferState` and verifies only the named state slice changes.

- [ ] **Step 2: Run test and verify failure**

Run: `npm test -- src/features/file-transfer/controller.test.ts`
Expected: FAIL because the feature modules are missing.

- [ ] **Step 3: Define the desktop bridge and session-aware API**

`desktop.d.ts` mirrors the preload methods exactly. `api.ts` defines one `request` helper that always includes:

```ts
headers: {
  'Content-Type': 'application/json',
  'X-SSH-Session-Id': sessionId,
}
```

Expose typed methods for remote listing/mutations/preview/search and transfer enqueue/control/settings.

- [ ] **Step 4: Implement a pure reducer/controller**

Keep React-independent state for:

```ts
interface FileTransferState {
  drawerOpen: boolean;
  maximized: boolean;
  activeProfileId: string | null;
  sessionId: string | null;
  connectionState: ConnectionState;
  local: PaneState;
  remote: PaneState;
  transfers: Record<string, TransferTask>;
  summary: { active: number; failed: number; progress: number };
  conflict: ConflictRequest | null;
}
```

Reducer actions are exhaustive and never cancel tasks in response to `drawer/close`.

- [ ] **Step 5: Run tests and commit**

Run: `npm test -- src/features/file-transfer/controller.test.ts`
Expected: PASS.

```powershell
git add src/types src/features/file-transfer
git commit -m "feat: add file transfer renderer contracts and controller"
```

## Task 9: Build The Edge Launcher, Overlay Shell, And Host Manager

**Files:**
- Create: `src/features/file-transfer/FileTransferLauncher.tsx`
- Create: `src/features/file-transfer/FileTransferDrawer.tsx`
- Create: `src/features/file-transfer/FileTransferDrawer.test.tsx`
- Create: `src/features/file-transfer/FileTransferWorkspace.tsx`
- Create: `src/features/file-transfer/HostManager.tsx`
- Create: `src/features/file-transfer/fileTransfer.css`
- Modify: `src/App.tsx`
- Modify: `src/index.css`
- Modify: `src/components/LoginForm.tsx`
- Modify: `src/services/totpStorage.ts`

- [ ] **Step 1: Write failing overlay behavior tests**

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import FileTransferDrawer from './FileTransferDrawer';

it('renders above mounted app content and closes on Escape without cancelling work', () => {
  const onClose = vi.fn();
  const onCancelTransfers = vi.fn();
  render(<FileTransferDrawer open onClose={onClose} onCancelTransfers={onCancelTransfers}><div>Workspace</div></FileTransferDrawer>);
  expect(screen.getByRole('dialog', { name: '文件传输工作区' })).toBeTruthy();
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(onClose).toHaveBeenCalledOnce();
  expect(onCancelTransfers).not.toHaveBeenCalled();
});
```

The same test file must render a launcher fixture with two active tasks, click the scrim and maximize controls by accessible name, verify focus returns to the launcher, and assert a `data-testid="underlying-terminal"` sentinel remains in the document before, during, and after the overlay.

- [ ] **Step 2: Run the component test and verify failure**

Run: `npx vitest run --environment jsdom src/features/file-transfer/FileTransferDrawer.test.tsx`
Expected: FAIL because components are missing.

- [ ] **Step 3: Implement stable overlay dimensions and lazy loading**

In `App.tsx`:

```tsx
const FileTransferWorkspace = React.lazy(() => import('./features/file-transfer/FileTransferWorkspace'));
```

Mount the launcher inside the logged-in root but outside the current `Header`/main flex tracks. Render the workspace in a portal to `document.body`. Closed state must not change any current grid/flex classes.

Required CSS:

```css
.file-transfer-overlay { position: fixed; inset: 0; z-index: 30; }
.file-transfer-scrim { position: absolute; inset: 0; background: rgb(0 0 0 / 0.52); }
.file-transfer-drawer { position: absolute; inset-block: 0; right: 0; width: min(90vw, 1680px); min-width: 980px; background: #f7f8f9; transform: translateX(0); }
.file-transfer-drawer[data-maximized="true"] { width: 100vw; }
.file-transfer-launcher { position: fixed; right: 0; top: var(--launcher-y, 46%); z-index: 20; width: 36px; min-height: 88px; }
```

At viewport widths below 1100px, the drawer uses `width: 100vw; min-width: 0`; pane tables scroll horizontally without overlapping.

- [ ] **Step 4: Implement host manager and secure desktop login integration**

`HostManager` lists metadata from `window.hpclawDesktop.profiles.list()`, supports create/edit/remove, connects by profile ID, and shows a fingerprint confirmation dialog. It never receives encrypted strings or decrypted credentials.

On first use, the dialog displays the exact SHA-256 fingerprint returned with `HOST_FINGERPRINT_REQUIRED`; accepting calls `profiles.trustFingerprint(profileId, fingerprint)` and retries. A mismatch dialog shows both values and requires the explicit command `Replace trusted fingerprint`; closing the dialog leaves the cluster disconnected.

`LoginForm` detects `window.hpclawDesktop`; desktop remember-password/TOTP controls call profile APIs and stop calling `savePassword`/`storeSecret`. Preserve current browser behavior when the bridge is absent.

- [ ] **Step 5: Run tests and commit**

Run:

```powershell
npx vitest run --environment jsdom src/features/file-transfer/FileTransferDrawer.test.tsx
npm run lint
npm run build
```

Expected: PASS; Vite output contains a separate lazy file-transfer chunk.

```powershell
git add src/App.tsx src/index.css src/components/LoginForm.tsx src/services/totpStorage.ts src/features/file-transfer src/types/desktop.d.ts
git commit -m "feat: add xftp overlay launcher and secure host manager"
```

## Task 10: Build Local And Remote File Panes

**Files:**
- Create: `src/features/file-transfer/FilePane.tsx`
- Create: `src/features/file-transfer/LocalFilePane.tsx`
- Create: `src/features/file-transfer/RemoteFilePane.tsx`
- Create: `src/features/file-transfer/FilePane.test.tsx`
- Create: `src/features/file-transfer/ConflictDialog.tsx`
- Modify: `src/features/file-transfer/FileTransferWorkspace.tsx`
- Modify: `src/features/file-transfer/fileTransfer.css`

- [ ] **Step 1: Write failing pane interaction tests**

```tsx
import { createDroppedTransfer } from './FilePane';

it('maps a local drop onto the current remote directory without changing either pane path', () => {
  const transfer = createDroppedTransfer({
    sourceSide: 'local', sourcePaths: ['D:\\Bio\\reads.fastq.gz'],
    targetSide: 'remote', targetPath: '/home/lin/data', profileId: 'p1',
  });
  expect(transfer).toMatchObject({
    direction: 'upload', localPath: 'D:\\Bio\\reads.fastq.gz',
    remotePath: '/home/lin/data/reads.fastq.gz', profileId: 'p1',
  });
});
```

The component suite must also exercise Ctrl and Shift selection with three fixture rows, click sortable column headers twice, navigate a breadcrumb, and verify create/rename/delete/conflict commands invoke the adapter method matching their visible menu label.

- [ ] **Step 2: Run tests and verify failure**

Run: `npx vitest run --environment jsdom src/features/file-transfer/FilePane.test.tsx`
Expected: FAIL because pane components are missing.

- [ ] **Step 3: Implement a shared accessible file table**

`FilePane` accepts a `FilePaneAdapter`:

```ts
interface FilePaneAdapter {
  side: FileSide;
  list(path: string, signal: AbortSignal): Promise<FileEntry[]>;
  mkdir(path: string): Promise<void>;
  rename(from: string, to: string): Promise<void>;
  removePreview(paths: string[]): Promise<RemovePreview>;
  remove(paths: string[]): Promise<void>;
  preview(path: string): Promise<PreviewResult>;
}
```

Use a semantic table/grid with fixed columns and stable row height. Directory double-click navigates; file double-click previews. Use Lucide icons and tooltips for icon-only actions. Right-click opens commands matching toolbar actions.

- [ ] **Step 4: Implement local and remote adapters and drag/drop transfer creation**

`LocalFilePane` calls the preload bridge. `RemoteFilePane` calls `api.ts`. Dragging across panes creates upload/download tasks; dragging within a pane requests move only after explicit confirmation when overwrite is possible.

- [ ] **Step 5: Run tests and commit**

Run:

```powershell
npx vitest run --environment jsdom src/features/file-transfer/FilePane.test.tsx
npm test -- server/files
npm run lint
```

Expected: PASS.

```powershell
git add src/features/file-transfer
git commit -m "feat: add local and remote dual file panes"
```

## Task 11: Add Queue UI, Search, Preview, Permissions, And Sync Planning

**Files:**
- Create: `src/features/file-transfer/TransferQueue.tsx`
- Create: `src/features/file-transfer/TransferQueue.test.tsx`
- Create: `src/features/file-transfer/SearchPanel.tsx`
- Create: `src/features/file-transfer/SyncPlanner.tsx`
- Create: `src/features/file-transfer/syncPlanner.ts`
- Create: `src/features/file-transfer/syncPlanner.test.ts`
- Create: `src/features/file-transfer/FilePreview.tsx`
- Modify: `src/features/file-transfer/FileTransferWorkspace.tsx`
- Modify: `src/features/file-transfer/fileTransfer.css`
- Modify: `server/files/registerFileRoutes.ts`

- [ ] **Step 1: Write failing queue and sync tests**

```ts
import { describe, expect, it } from 'vitest';
import { buildSyncPlan } from './syncPlanner';

it('never includes target deletion unless deletion is explicitly enabled', () => {
  const source = [{ name: 'a.txt', path: '/src/a.txt', kind: 'file', size: 10, modifiedAt: 100 }] as const;
  const target = [
    { name: 'a.txt', path: '/dst/a.txt', kind: 'file', size: 10, modifiedAt: 100 },
    { name: 'extra.txt', path: '/dst/extra.txt', kind: 'file', size: 20, modifiedAt: 100 },
  ] as const;
  expect(buildSyncPlan(source, target, { deleteExtraneous: false }).actions.map(a => a.kind)).not.toContain('delete');
  expect(buildSyncPlan(source, target, { deleteExtraneous: true }).actions).toContainEqual(expect.objectContaining({ kind: 'delete', path: '/dst/extra.txt' }));
});
```

Queue component tests verify pause, resume, cancel, retry, clear completed, filter counts, progress rate, ETA, and closed-drawer continuation.

- [ ] **Step 2: Run tests and verify failure**

Run:

```powershell
npm test -- src/features/file-transfer/syncPlanner.test.ts
npx vitest run --environment jsdom src/features/file-transfer/TransferQueue.test.tsx
```

Expected: FAIL because the modules are missing.

- [ ] **Step 3: Implement queue and progress subscription**

Subscribe to Socket.IO `transfer:updated` and dispatch tasks into the reducer. Queue rows have fixed tracks for direction, source, destination, bytes, progress/rate/ETA, state, and icon actions. Collapsing the queue keeps a 32px status strip visible.

- [ ] **Step 4: Implement advanced workflows with explicit limits**

- Search: cancel previous search on query/path change; stream batches; cap visible results at 5,000 with a truncation message.
- Preview: text cap 1 MiB; image cap 20 MiB; unsupported/large files show metadata and download action.
- Permissions: octal input plus owner/group/other checkboxes; validate `0o000` through `0o777` before `/chmod`.
- Sync: compare relative path, kind, size, and modified time; show upload/download/conflict/skip/delete counts; require confirmation before enqueue; deletion off by default and protected by a second checkbox and dialog.
- Verification: size is default; SHA-256 appears as a per-task or queue setting with an I/O cost note.

- [ ] **Step 5: Run tests and commit**

Run:

```powershell
npm test -- src/features/file-transfer server/files server/transfers
npx vitest run --environment jsdom src/features/file-transfer/TransferQueue.test.tsx src/features/file-transfer/FilePane.test.tsx src/features/file-transfer/FileTransferDrawer.test.tsx
npm run lint
```

Expected: PASS.

```powershell
git add src/features/file-transfer server/files/registerFileRoutes.ts
git commit -m "feat: add advanced transfer and synchronization workflows"
```

## Task 12: Remove Legacy Transfer Paths And Complete Documentation

**Files:**
- Modify: `server.ts`
- Delete when unreferenced: `server/loginSsh.ts`
- Delete when unreferenced: `server/loginSsh.test.ts`
- Delete when unreferenced: `askpass.js`
- Delete when unreferenced: `askpass.cjs`
- Delete when unreferenced: `askpass.cmd`
- Delete when unreferenced: `test-askpass.cjs`
- Modify: `package.json`
- Modify: `README.md`
- Create: `docs/XFTP_WORKSPACE.md`

- [ ] **Step 1: Prove the old implementations are unused**

Run:

```powershell
rg -n "buildTerminalSshArgs|ASKPASS|runViaSSH|runSshNoPty|downloadViaControlMaster|uploadViaControlMaster|base64.*remote" server.ts server src electron
```

Expected: no production reference remains. If a match is still used by AI or conversation code, migrate that call to `ClusterSession.exec` before deleting anything.

- [ ] **Step 2: Remove obsolete helpers and credentials-on-disk behavior**

Delete only the listed files after Step 1 is clean. Remove `.creds_*` and `.ssh_mux_*` creation/cleanup blocks from `server.ts`. Keep web `/api/login`, now backed by `ClusterSession`, so non-Electron development remains usable without saved desktop profiles.

- [ ] **Step 3: Document exact user workflows**

`docs/XFTP_WORKSPACE.md` must include:

```markdown
# File Transfer Workspace

## Open And Close
## Add And Trust A Host
## Browse Local And Remote Files
## Upload, Download, Pause, And Resume
## Resolve Conflicts
## Verify Transfers
## Search And Preview
## Change Remote Permissions
## Compare And Synchronize Directories
## Recover After Disconnect Or Restart
## Credential And Host-Key Security
## Troubleshooting
```

Update README features and desktop instructions without removing current terminal/AI documentation.

- [ ] **Step 4: Run the complete automated suite and commit**

Run:

```powershell
npm test
npm run lint
npm run build
npm run build:electron-server
```

Expected: all commands pass; no ASKPASS or Base64 transfer helper appears in the bundled server source map/output strings.

```powershell
git add -A
git commit -m "refactor: remove legacy ssh file transfer paths"
```

## Task 13: Package, Visually Verify, And Finalize The Clean Delivery

**Files:**
- Create: `release/HPClaw-0.0.0-x64.exe`
- Finalize: `E:\0612hpclaw\0714`
- Remove: temporary `E:\0612hpclaw\0714\.git`

- [ ] **Step 1: Build the Windows portable application**

Run:

```powershell
npm run electron:dist
Get-Item release\HPClaw-0.0.0-x64.exe | Select-Object FullName,Length,LastWriteTime
```

Expected: packaging passes and the executable exists with non-zero size.

- [ ] **Step 2: Start the development desktop app and run functional smoke checks**

Run: `npm run electron:dev`

Verify:

- The existing login/main layout still renders.
- The right-edge launcher opens a covering drawer without resizing or unmounting the terminal/AI layout.
- Escape, scrim, close, maximize, and progress badge work.
- An encrypted test profile can be created and reopened; its plaintext password/TOTP does not appear under Electron `userData`.
- Local drives and directories browse correctly.
- A controlled SSH/SFTP test server can list, upload, download, pause/resume, rename, chmod, search, preview, and generate a sync dry-run.
- Disconnect pauses work; reconnect resumes the partial task.

- [ ] **Step 3: Perform browser-assisted visual QA at desktop and constrained sizes**

Use the in-app Browser skill against the development URL. Capture screenshots at `1440x920`, `1100x720`, and a narrow fallback viewport. Check:

- No overlap among launcher, header, current side panels, drawer, panes, queue, dialogs, and tooltips.
- Drawer closed screenshots differ from the baseline only by the edge launcher.
- Long Windows and POSIX paths truncate without changing toolbar or table dimensions.
- Both panes retain at least 320px at desktop width and become horizontally scrollable at narrow width.
- Text, empty, loading, error, disconnected, fingerprint, conflict, and active-transfer states are visible and coherent.
- Reduced-motion mode disables sliding animation without hiding content.

- [ ] **Step 4: Run final verification from a fresh process**

Run:

```powershell
npm test
npm run lint
npm run build
npm run build:electron-server
npm run electron:dist
```

Expected: all commands exit `0`. Do not rely on output from an earlier task.

- [ ] **Step 5: Remove only the temporary implementation repository**

Before removal, verify the target exactly:

```powershell
$target = (Resolve-Path 'E:\0612hpclaw\0714\.git').Path
if ($target -ne 'E:\0612hpclaw\0714\.git') { throw "Refusing unexpected target: $target" }
Remove-Item -LiteralPath $target -Recurse -Force
Test-Path 'E:\0612hpclaw\0714\.git'
```

Expected: `False`. The source project `.git` at `E:\0612hpclaw\.git` remains untouched.

- [ ] **Step 6: Inspect final delivery contents**

Run:

```powershell
Get-ChildItem E:\0612hpclaw\0714 -Force | Select-Object Name,Mode
Get-Item E:\0612hpclaw\0714\release\HPClaw-0.0.0-x64.exe | Select-Object FullName,Length
git -C E:\0612hpclaw status --short
```

Expected: `0714` contains source, tests, docs, installed dependencies, fresh builds, and the portable EXE; it contains no `.git`, copied credentials, old logs, or nested `0714`; source status shows only the user's pre-existing changes and committed design/plan documents.

## Self-Review

- Spec coverage: Tasks 1-13 cover the clean copy, encrypted profiles, local file IPC, one `ssh2` session, overlay interaction, dual panes, transfer persistence/resume, advanced operations, error recovery, automated tests, visual QA, and Electron packaging.
- Dependency order: shared contracts and safety precede the SSH session; the SSH session precedes SFTP and transfers; Electron services precede renderer integration; backend and renderer converge before packaging.
- Type consistency: `ConnectionState`, `FileEntry`, `HostProfileMetadata`, `TransferTask`, `ConflictPolicy`, and `VerificationMode` are defined once in `shared/fileTransfer.ts` and reused across later tasks.
- Security consistency: renderer APIs receive only profile metadata and session IDs; secrets stay in Electron main; the backend desktop route requires the random desktop token; path guards precede all mutation routes.
- Delivery consistency: implementation checkpoints use a fresh temporary repository inside `0714`; Task 13 removes only that temporary `.git` after all verification, satisfying the clean-copy requirement.
