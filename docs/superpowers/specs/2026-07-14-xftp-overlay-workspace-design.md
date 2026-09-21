# HPClaw Xftp-Style Overlay Workspace Design

## Goal

Create a clean, complete development copy of HPClaw under `E:\0612hpclaw\0714`, then add a desktop-first, Xftp-style local/cluster file workspace without changing the layout or lifecycle of the existing HPClaw terminal, AI assistant, file sidebar, or conversation UI.

The new workspace opens from a dedicated right-edge button and slides over the existing application as a large overlay drawer. It provides saved host management, a local/remote dual-pane file browser, a persistent transfer queue, and advanced SFTP operations.

## Confirmed Product Decisions

- The target is the Electron desktop application on Windows.
- The workspace uses an Xftp-style local/remote dual-pane layout.
- Multiple host profiles may be saved, but only one cluster is connected at a time.
- Credentials and TOTP secrets are encrypted with Electron `safeStorage`.
- A single authenticated `ssh2` connection supplies the interactive shell, command execution, and SFTP channels.
- The existing main application layout remains mounted and unchanged.
- A right-edge button opens the file workspace as an overlay drawer covering approximately 90% of the application width.
- Closing the drawer does not stop active transfers.
- The first release includes advanced transfer, search, permission, checksum, and directory synchronization capabilities.
- `0714` is a clean development copy. It includes all current source, documentation, Electron configuration, and uncommitted source changes, but excludes dependencies, generated builds, caches, logs, temporary files, credentials, and the source repository's `.git` directory.
- Dependencies, builds, and the Windows portable executable are regenerated inside `0714`.

## Current System Constraints

HPClaw currently uses:

- React 19, Vite, and Tailwind CSS for the renderer.
- Express and Socket.IO for the local backend.
- An OpenSSH child process for the terminal.
- SSH shell commands and Base64 conversion for file operations.
- A narrow right-side `FileManager` panel for remote file browsing.
- Browser storage for connection fields and remembered credentials.
- Electron as a desktop shell that starts the local backend and loads it over localhost.

The current file layer is sufficient for small remote operations but does not provide native local browsing, persistent host profiles, transfer progress, reliable pause/resume, atomic upload completion, synchronization planning, or a professional transfer queue. Large transfers may also require whole-file buffering or repeated SSH authentication.

## Scope

### Included

- Clean project copy and rebuilt Electron deliverables under `0714`.
- Encrypted host profile management with grouping, favorites, search, and connection status.
- First-use SSH host fingerprint confirmation and mismatch blocking.
- Unified `ssh2` session for shell, command, and SFTP channels.
- Local Windows file system browsing through a context-isolated Electron preload API.
- Remote SFTP directory browsing.
- Resizable local and remote panes with path breadcrumbs, favorites, drive selection, sortable metadata columns, multi-select, keyboard navigation, context menus, and drag/drop transfer.
- Upload, download, pause, resume, cancel, retry, concurrency control, bandwidth limiting, conflict policies, and persisted queue state.
- File and directory creation, rename, move, copy, local recycle-bin deletion, guarded remote deletion, and remote permission editing.
- Text and image preview.
- Remote search with cancellation and bounded result streaming.
- Optional SHA-256 verification in addition to the default size verification.
- Directory comparison and synchronization with a mandatory dry-run plan.
- Overlay drawer, maximized mode, progress badge, and activity-aware close/exit prompts.
- Automated and manual verification proportional to the refactor risk.

### Excluded

- Concurrent connections to multiple clusters.
- Cluster-to-cluster transfer.
- Silent or unattended target deletion during synchronization.
- Cloud storage providers or non-SFTP protocols.
- Credential fallback to plaintext if Electron encryption is unavailable.
- A redesign of the existing terminal, AI assistant, conversation history, or current narrow remote file panel.

## User Experience

### Closed State

The existing HPClaw application renders exactly as it does before this feature. A narrow icon button labeled by tooltip as `文件传输` is fixed to the right edge near the vertical center. Its position may be dragged and is remembered locally.

When no transfer is active, the button shows the file-transfer icon. While transfers are active, it also shows a compact progress badge. Failed or paused work uses a distinct status indicator. Clicking the button opens the overlay.

### Open State

The workspace slides in from the right and covers about 90% of the application width. A scrim covers the visible portion of the existing application. The underlying React tree remains mounted, so the terminal socket, xterm instance, AI conversation, and existing side panels retain their state.

The drawer can be closed with its close icon, the scrim, or `Escape`. A maximize control expands the workspace to the full application content area. Closing the drawer does not cancel or pause transfers.

### Workspace Layout

The workspace contains:

1. A compact header with the active host, SFTP status, latency, maximize, and close controls.
2. A host manager on the left with groups, favorites, search, add/edit actions, and online state.
3. A command toolbar using familiar icons for upload, download, create, rename, delete, refresh, synchronize, permissions, and search.
4. A resizable dual-pane area with the local Windows file system on the left and the active cluster on the right.
5. A resizable transfer queue at the bottom with active, completed, and failed views.

The existing HPClaw terminal and AI are not duplicated inside this overlay. They remain in the underlying main application and become visible again when the overlay closes.

### Host Profiles

Each profile stores:

- Stable profile ID.
- Display name and optional group.
- Host, port, and username.
- Optional default local and remote directories.
- Favorite state and last-used timestamp.
- Encrypted password and encrypted TOTP secret when the user enables credential saving.
- Trusted SSH host-key algorithm and fingerprint.

Only profile metadata is available to the renderer. Passwords and TOTP secrets remain in the Electron main process and are never returned through the preload bridge.

## Architecture

### Electron Main Process

The Electron main process owns desktop-only trust boundaries:

- `HostProfileStore` reads and writes profile metadata under Electron `userData` and encrypts secret fields with `safeStorage`.
- `LocalFileService` exposes narrowly scoped IPC methods for drive enumeration, directory listing, metadata, create, rename, recycle-bin delete, preview, and cancellable search.
- `DesktopConnectionBroker` decrypts the selected profile, generates the TOTP code, and calls a protected backend connection endpoint.
- The preload script exposes an explicit typed API through `contextBridge`; it does not expose Node primitives or arbitrary IPC invocation.

The Electron main process starts the backend with a random per-launch desktop token in an environment variable. Internal connection endpoints require that token and remain bound to `127.0.0.1`.

### Backend SSH Session

The backend replaces the OpenSSH process session with a focused `ClusterSession` built on the existing `ssh2` dependency. A successful connection owns:

- One authenticated `ssh2.Client`.
- One interactive shell stream for xterm and Socket.IO.
- One SFTP channel manager for file operations.
- An exec channel queue for bounded commands such as checksum, remote search, and environment probes.
- Connection state, reconnect policy, heartbeat, and a random session ID.

Password and keyboard-interactive authentication support password-plus-TOTP prompts. A first-use host key requires explicit confirmation. A changed key blocks the connection until the user reviews and replaces the stored fingerprint.

The renderer receives only the random session ID. HTTP and Socket.IO requests attach it explicitly. The backend never writes passwords, TOTP codes, or temporary credential files to disk.

### Renderer Feature Boundary

The new UI is a self-contained feature with focused units:

- `FileTransferLauncher`: right-edge launcher and progress badge.
- `FileTransferDrawer`: overlay lifecycle, scrim, maximize state, and activity-aware closing.
- `HostManager`: profile list, grouping, search, connection dialog, and fingerprint confirmation.
- `FilePane`: shared file-table behavior for local and remote adapters.
- `LocalFilePane` and `RemoteFilePane`: source-specific navigation and operations.
- `TransferQueue`: task table, progress, pause/resume/cancel/retry, and history filters.
- `ConflictDialog`: per-task and queue-wide conflict policies.
- `SyncPlanner`: local/remote comparison and dry-run review.
- `FilePreview`: bounded text and image preview.

Shared state belongs in a feature controller or reducer rather than `App.tsx`. `App.tsx` only mounts the launcher and drawer and supplies the active SSH session state.

### Transfer Engine

The backend `TransferEngine` uses Node streams and SFTP streams. Files are never loaded wholly into renderer or backend memory.

Each transfer task contains:

- Stable task ID and direction.
- Local and remote paths.
- Total size, transferred offset, and current rate.
- State: queued, running, paused, retrying, completed, failed, or cancelled.
- Conflict strategy and verification mode.
- Retry count and a user-facing error record.

Uploads write to a task-specific temporary remote name. On completion, the engine verifies the transfer and atomically renames the temporary file to the destination. Downloads follow the equivalent pattern with a local temporary file.

Pause closes the active streams without removing partial data. Resume verifies the partial length and continues from the correct SFTP offset. Queue state persists under Electron `userData` without credentials. After application restart, incomplete tasks return as paused and can resume after reconnecting to the matching host profile.

Default concurrency is two tasks and is configurable from one to four. Optional bandwidth limiting uses a throttled stream. Size verification is the default because it avoids rereading very large datasets; SHA-256 verification is available per task or as a user preference.

## Operations And Safety

### File Operations

- Local listing and mutations use Electron IPC.
- Remote listing, metadata, create, rename, move, copy, remove, and chmod use SFTP where supported.
- Remote search runs a bounded, cancellable command channel and streams normalized results.
- Preview reads only a bounded prefix for text and enforces a configurable maximum for images.
- Local delete uses the Windows recycle bin through Electron.
- Remote non-empty directory deletion requires an impact summary and explicit confirmation.
- Root, home-root, drive-root, empty, and unresolved paths are protected from destructive operations.

### Synchronization

Synchronization always begins with a comparison plan. The plan identifies uploads, downloads, conflicts, skipped entries, and optional deletions. No mutation occurs until the user confirms the plan.

Target deletion is disabled by default. Enabling it requires a second explicit confirmation showing the number of affected paths. A stopped or failed sync leaves completed atomic file transfers intact and uncompleted tasks resumable.

## Connection And Data Flow

1. The user opens the drawer and selects a host profile.
2. The renderer invokes `DesktopConnectionBroker` with the profile ID and any one-time manual code.
3. Electron decrypts the stored secret, generates a TOTP code when configured, and calls the backend's protected desktop connection endpoint.
4. The backend validates or requests confirmation of the host fingerprint, authenticates once, opens the shell, and initializes SFTP.
5. The backend returns a random session ID and connection metadata. Secrets are discarded from request scope after authentication.
6. Terminal Socket.IO, AI command execution, remote file operations, and transfer tasks reference the same session.
7. Transfer progress and connection changes are pushed to the renderer over Socket.IO.
8. Local directory metadata continues to flow through the preload IPC bridge; transfer requests pass validated local paths to the local backend transfer engine.

## Error Handling And Recovery

- Connection states are explicit: disconnected, connecting, awaiting fingerprint confirmation, authenticating, connected, reconnecting, and failed.
- User-facing failures preserve the actionable cause for DNS, timeout, authentication, host-key, permission, disk-space, and checksum errors.
- On disconnect, active transfers pause immediately. Terminal commands are never replayed automatically.
- Reconnection uses bounded exponential backoff. Successful reconnection restores directory views and enables resumable tasks. The terminal opens a fresh shell and displays a visible disconnect boundary.
- A failed transfer does not block unrelated queued tasks. The user can retry, skip, cancel, or inspect its log.
- Conflict choices are overwrite, resume, skip, or automatically rename. A choice may apply only to the current task or to the remaining queue.
- If `safeStorage` is unavailable, saved-secret controls are disabled and credentials remain session-only.
- Closing the drawer keeps tasks running. Switching host or exiting with active work prompts for background continuation, pause-and-exit, or cancellation as applicable.

## Testing Strategy

### Unit Tests

- Host profile serialization and encrypted-store adapter behavior.
- Local and remote path normalization and destructive-path guards.
- SSH host-key trust and mismatch decisions.
- Connection state transitions and reconnect backoff.
- Transfer task reducer, progress calculation, rate limiting, conflict policy, resume offset, and retry rules.
- Synchronization diff planning and deletion opt-in.

### Integration Tests

- A replaceable SSH/SFTP adapter simulates authentication, shell creation, directory operations, partial transfer, disconnect, resume, and checksum failure.
- Backend tests verify that shell, exec, and SFTP use one `ClusterSession` and that session IDs protect APIs.
- Electron tests mock `safeStorage`, preload IPC handlers, drive enumeration, recycle-bin deletion, and persisted queue restoration.
- Renderer tests cover launcher, overlay lifecycle, keyboard closing, progress badges, pane navigation, drag/drop, conflict UI, and error states.

### End-To-End And Packaging Tests

- Screenshot comparison confirms the existing main structure is unchanged while the drawer is closed.
- The drawer opens as an overlay without resizing or unmounting the terminal and AI areas.
- A controlled test server exercises upload, download, pause/resume, rename, chmod, search, preview, synchronization dry-run, disconnect, and recovery.
- Full Vitest, TypeScript, Vite build, Electron backend bundle, and Electron portable packaging commands pass inside `0714`.
- The generated Windows executable launches, opens the HPClaw login UI, opens and closes the overlay, persists encrypted profiles, and shuts down its backend process on exit.

Real cluster credentials are excluded from automated tests. Manual real-cluster verification is limited to credentials and operations explicitly authorized by the user.

## Acceptance Criteria

1. `E:\0612hpclaw\0714` contains a clean, buildable copy of the current project and its current source modifications, without old dependencies, generated output, logs, temporary files, credentials, or nested Git history.
2. The original source tree outside `0714` is not functionally modified by the implementation.
3. With the file workspace closed, the existing HPClaw layout and component state are unchanged apart from the right-edge launcher.
4. The launcher opens a right-side overlay drawer, and closing it preserves the underlying terminal and AI state.
5. Saved host secrets are encrypted with `safeStorage` and are unavailable to the renderer.
6. One `ssh2` authentication supplies terminal, command, and SFTP channels, including password-plus-TOTP keyboard-interactive authentication.
7. Local and remote panes support the included navigation and file operations without whole-file buffering.
8. Transfers expose progress, pause/resume, retry, cancellation, conflict policy, atomic completion, optional checksum, and restart recovery.
9. Remote search, permissions, preview, comparison, and synchronization dry-run work with the defined safety guards.
10. Automated verification, production builds, Electron packaging, and desktop smoke testing pass in `0714`.

## Delivery Structure

The implementation is performed only after this specification and its implementation plan are approved. The final `0714` directory contains:

- The complete clean source copy.
- Updated tests and documentation.
- Reinstalled dependencies used for verification.
- Fresh frontend and Electron backend builds.
- A newly generated Windows portable executable under `0714\release`.

The original project remains available as the untouched reference implementation and is not deleted or replaced.
