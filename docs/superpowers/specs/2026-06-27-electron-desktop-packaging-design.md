# HPClaw Electron Desktop Packaging Design

## Goal

Package HPClaw as a Windows desktop application so a user can double-click `HPClaw.exe` and work inside an independent desktop window. The application should start the existing HPClaw local server automatically and load the UI without requiring the user to open a browser.

## Current Context

HPClaw is a React/Vite frontend with a TypeScript Express and Socket.IO backend. The current server entry is `server.ts`. In development it mounts Vite middleware, and in production it serves the built frontend from `dist`. Runtime data is currently rooted at `process.cwd()` for folders and files such as `skills`, `lsf_skills`, `conversations`, `uploads`, SSH control sockets, and temporary credential files.

## Chosen Approach

Use Electron rather than Tauri for the first desktop package.

Electron fits the current architecture because HPClaw already depends on Node APIs, Express, Socket.IO, SSH process spawning, and filesystem-backed runtime folders. Tauri would create a smaller executable, but it would require a Node sidecar or a backend rewrite, which adds avoidable packaging risk.

## Architecture

The desktop package will add a small Electron shell around the existing app:

- `electron/main.ts` creates the desktop window.
- The Electron main process starts the HPClaw backend as a local child process.
- The backend runs in production mode and serves the existing Vite build from `dist`.
- The Electron window loads the local server URL, defaulting to `http://127.0.0.1:3003`.
- The app continues to use the existing Express routes, Socket.IO channels, SSH login flow, and AI settings.

The first implementation should avoid large business-code refactors. Any server changes should be limited to packaging-safe path handling and startup behavior.

## Runtime Files

Packaged read-only assets should include:

- `dist`
- compiled backend code
- `server`
- `shared`
- `lsf_skills`
- required production dependencies

Writable runtime data should not be stored inside the packaged application archive. The Electron package should direct mutable data to a writable app data location or a predictable unpacked runtime folder. This includes:

- `skills`
- `uploads`
- `conversations`
- `.creds_*.json`
- `.ssh_mux_*`
- generated skill indexes and temporary files

The implementation should introduce an app root or data root environment variable if needed, so the existing server can resolve writable paths consistently when launched from Electron.

## Startup Flow

1. User launches `HPClaw.exe`.
2. Electron selects an available localhost port, using `3003` by default when free.
3. Electron starts the HPClaw backend with `NODE_ENV=production` and the selected `PORT`.
4. Electron waits until the backend responds.
5. Electron opens a desktop window pointed at the local server URL.
6. When the desktop window closes, Electron stops the backend child process.

## Error Handling

If the backend fails to start, Electron should show a clear error dialog with the failing command, exit code, and log location.

If port `3003` is already occupied, Electron should retry with another local port and pass that port to the backend.

If required external tools are missing, especially `ssh` on Windows `PATH`, the app should preserve the current application behavior and surface a useful login or connection error.

## Packaging

Use a standard Electron packaging tool such as `electron-builder` or Electron Forge. The recommended first pass is `electron-builder` because it can produce a Windows `.exe` installer or portable executable from the existing npm workflow.

Expected npm scripts:

- `build`: build the Vite frontend
- backend build script: compile TypeScript backend/Electron files to JavaScript
- `electron:dev`: run the desktop shell against local code
- `electron:dist`: build frontend, compile backend/Electron files, then produce Windows exe output

## Testing And Verification

Verification should cover:

- TypeScript check with the existing lint script.
- Unit tests with the existing Vitest suite.
- Frontend production build.
- Electron desktop smoke test: app window opens and reaches the HPClaw UI.
- Packaged exe smoke test when the packaging tool is available locally.

Manual smoke testing should confirm:

- Desktop window opens without a separate browser.
- Backend logs show the selected local URL.
- Static assets load from `dist`.
- Socket.IO connects.
- SSH login page still appears.
- Closing the window stops the backend process.

## Non-Goals

- Rewriting HPClaw as a native Rust/Tauri backend.
- Removing the existing browser-based deployment mode.
- Changing the AI provider workflow or SSH session behavior.
- Shipping API keys inside the exe.
