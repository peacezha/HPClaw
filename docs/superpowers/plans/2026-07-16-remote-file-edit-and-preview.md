# Remote File Edit and Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Open remote files with the Windows default application, automatically overwrite-sync saved changes to the cluster, and provide a separate in-app right-click preview with `head -20` for text files at least 100 MB.

**Architecture:** `FilePane` emits explicit open and preview intents instead of rendering bytes itself. A focused Electron edit-session service owns safe cache paths, default-app launch, dirty detection, and renderer events; `FileTransferWorkspace` reuses the existing transfer queue for the download and overwrite upload phases. A shared preview classifier drives bounded local/remote reads and focused React renderers for images, PDF, DOCX, worksheets, Markdown, and text.

**Tech Stack:** Electron IPC, React 19, TypeScript, existing Express/SFTP transfer engine, Vitest/Testing Library, `pdfjs-dist`, `docx-preview`, `xlsx`, `react-markdown`.

---

## File map

- Create `shared/filePreview.ts`: preview kinds, limits, request/response contracts, and deterministic type classification.
- Create `shared/filePreview.test.ts`: type and 100 MB boundary tests.
- Create `electron/remote-edit-sessions.cjs`: safe cache allocation, default-app launch, hashing, file watching, and session persistence.
- Create `electron/remote-edit-sessions.test.ts`: edit-session lifecycle tests with injected filesystem/launcher/timers.
- Modify `electron/main.cjs`, `electron/preload.cjs`, `src/types/desktop.d.ts`: expose local open and remote edit-session IPC.
- Modify `electron/local-files.cjs`, `electron/local-files.test.ts`: return normalized preview payloads and stream `head -20`.
- Modify `server/files/sftpFileService.ts`, `server/files/sftpFileService.test.ts`: bounded binary/text/head reads.
- Modify `server/files/registerFileRoutes.ts`, `server/files/registerFileRoutes.test.ts`: typed preview API with server-owned limits.
- Modify `src/features/file-transfer/api.ts`: preview request mode and payload types.
- Modify `src/features/file-transfer/FilePane.tsx`, `FilePane.test.tsx`, `LocalFilePane.tsx`, `RemoteFilePane.tsx`: split directory navigation, system open, and right-click preview intents.
- Create `src/features/file-transfer/editSessionController.ts`, `editSessionController.test.ts`: pure mapping between edit sessions and download/upload transfer tasks.
- Modify `src/features/file-transfer/FileTransferWorkspace.tsx`: orchestrate queue completion, Electron events, overwrite upload, retry, and preview selection.
- Replace `src/features/file-transfer/FilePreview.tsx`; create `FilePreview.test.tsx` and `previewRenderers.tsx`: unified read-only preview UI.
- Modify `src/features/file-transfer/fileTransfer.css`: preview reader and edit-session status styles.
- Modify `package.json`, `package-lock.json`: add reader dependencies.
- Modify `README.md`, `docs/XFTP_WORKSPACE.md`: document open/edit/sync and preview behavior.

### Task 1: Shared preview policy and payload contract

**Files:**
- Create: `shared/filePreview.ts`
- Create: `shared/filePreview.test.ts`

- [ ] **Step 1: Write failing classifier tests**

```ts
import { describe, expect, it } from 'vitest';
import { LARGE_TEXT_BYTES, classifyPreview } from './filePreview';

describe('classifyPreview', () => {
  it.each([
    ['plot.PNG', 'image'], ['paper.pdf', 'pdf'], ['paper.docx', 'docx'],
    ['matrix.xlsx', 'sheet'], ['table.csv', 'sheet'], ['README.md', 'markdown'],
    ['run.log', 'text'], ['sample.fa', 'text'],
  ])('maps %s to %s', (name, kind) => {
    expect(classifyPreview(name, 12).kind).toBe(kind);
  });

  it('uses head mode at the exact 100 MiB boundary for line text', () => {
    expect(classifyPreview('reads.fasta', LARGE_TEXT_BYTES)).toMatchObject({ kind: 'text', mode: 'head', lineLimit: 20 });
  });

  it('does not apply head mode to large binary documents', () => {
    expect(classifyPreview('paper.pdf', LARGE_TEXT_BYTES).mode).toBe('unsupported');
  });
});
```

- [ ] **Step 2: Run the test and confirm the missing module failure**

Run: `npx vitest run shared/filePreview.test.ts`

Expected: FAIL because `shared/filePreview.ts` does not exist.

- [ ] **Step 3: Implement contracts and deterministic classification**

```ts
export const LARGE_TEXT_BYTES = 100 * 1024 * 1024;
export const HEAD_LINE_LIMIT = 20;
export const HEAD_SCAN_BYTES = 256 * 1024;

export type PreviewKind = 'image' | 'pdf' | 'docx' | 'sheet' | 'markdown' | 'text' | 'unsupported';
export type PreviewMode = 'binary' | 'text' | 'head' | 'unsupported';

export interface PreviewDescriptor {
  kind: PreviewKind;
  mode: PreviewMode;
  mime: string;
  maxBytes: number;
  lineLimit?: number;
  reason?: string;
}

export interface FilePreviewPayload {
  path: string;
  encoding: 'base64' | 'utf8';
  content: string;
  bytesRead: number;
  totalSize: number;
  truncated: boolean;
  lineLimit?: number;
}

export function classifyPreview(name: string, size: number): PreviewDescriptor {
  const extension = name.toLowerCase().split('.').pop() ?? '';
  const groups: Array<[PreviewKind, string[], string, number]> = [
    ['image', ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg', 'ico'], 'image/*', 25 * 1024 * 1024],
    ['pdf', ['pdf'], 'application/pdf', 50 * 1024 * 1024],
    ['docx', ['docx'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 25 * 1024 * 1024],
    ['sheet', ['xlsx', 'xls'], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 25 * 1024 * 1024],
    ['sheet', ['csv', 'tsv'], 'text/csv', 2 * 1024 * 1024],
    ['markdown', ['md', 'markdown'], 'text/markdown', 2 * 1024 * 1024],
    ['text', ['txt', 'log', 'fa', 'fasta', 'fq', 'fastq', 'sam', 'vcf', 'gff', 'gtf', 'bed', 'json', 'xml', 'yaml', 'yml', 'py', 'js', 'ts', 'tsx', 'sh', 'r'], 'text/plain', 2 * 1024 * 1024],
  ];
  const match = groups.find(([, extensions]) => extensions.includes(extension));
  if (!match) return { kind: 'unsupported', mode: 'unsupported', mime: 'application/octet-stream', maxBytes: 0, reason: '暂不支持应用内预览' };
  const [kind, , mime, maxBytes] = match;
  const lineText = kind === 'text' || kind === 'markdown' || (kind === 'sheet' && ['csv', 'tsv'].includes(extension));
  if (lineText && size >= LARGE_TEXT_BYTES) return { kind: kind === 'sheet' ? 'text' : kind, mode: 'head', mime, maxBytes: HEAD_SCAN_BYTES, lineLimit: HEAD_LINE_LIMIT };
  if (!lineText && size > maxBytes) return { kind: 'unsupported', mode: 'unsupported', mime, maxBytes: 0, reason: '文件过大，请使用“打开并编辑”' };
  return { kind, mode: lineText ? 'text' : 'binary', mime, maxBytes };
}
```

Use fixed binary limits: images 25 MiB, PDF 50 MiB, DOCX 25 MiB, sheets 25 MiB; normal text and Markdown read at most 2 MiB.

- [ ] **Step 4: Run the shared tests**

Run: `npx vitest run shared/filePreview.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit the shared policy**

```bash
git add hpclaw_v1/shared/filePreview.ts hpclaw_v1/shared/filePreview.test.ts
git commit -m "feat: define file preview policy"
```

### Task 2: Bounded local and remote preview reads

**Files:**
- Modify: `electron/local-files.cjs`
- Modify: `electron/local-files.test.ts`
- Modify: `server/files/sftpFileService.ts`
- Modify: `server/files/sftpFileService.test.ts`
- Modify: `server/files/registerFileRoutes.ts`
- Modify: `server/files/registerFileRoutes.test.ts`
- Modify: `src/features/file-transfer/api.ts`
- Modify: `src/types/desktop.d.ts`

- [ ] **Step 1: Add failing `head -20` and payload tests**

Add tests that create 30 newline-delimited records, request `{ mode: 'head', maxBytes: 256 * 1024, lineLimit: 20 }`, and assert exactly lines 1–20, `truncated: true`, `lineLimit: 20`, and a read smaller than the source. Add an SFTP `PassThrough` equivalent and a route test asserting an untrusted client cannot raise the server limit.

```ts
expect(result.content.split('\n')).toHaveLength(20);
expect(result).toMatchObject({ encoding: 'utf8', truncated: true, lineLimit: 20 });
expect(service.readPreview).toHaveBeenCalledWith('/home/lin/reads.fa', expect.objectContaining({ mode: 'head', lineLimit: 20 }));
```

- [ ] **Step 2: Run focused tests and confirm current APIs fail**

Run: `npx vitest run electron/local-files.test.ts server/files/sftpFileService.test.ts server/files/registerFileRoutes.test.ts`

Expected: FAIL because `readPreview` only accepts a byte count and returns a `Buffer`.

- [ ] **Step 3: Implement one bounded stream collector**

Add a TypeScript implementation for SFTP and the equivalent CommonJS implementation for Electron:

```ts
export interface PreviewReadOptions {
  mode: 'binary' | 'text' | 'head';
  maxBytes: number;
  lineLimit?: number;
}

async function collectPreview(stream: AsyncIterable<Buffer>, options: PreviewReadOptions): Promise<{ buffer: Buffer; truncated: boolean }> {
  const chunks: Buffer[] = [];
  let bytes = 0;
  let lines = 0;
  let stopped = false;
  for await (const chunkValue of stream) {
    const chunk = Buffer.from(chunkValue);
    const remaining = options.maxBytes - bytes;
    if (remaining <= 0) { stopped = true; break; }
    const limited = chunk.subarray(0, remaining);
    if (options.mode !== 'head') {
      chunks.push(limited); bytes += limited.length;
      if (limited.length < chunk.length) stopped = true;
      continue;
    }
    let end = limited.length;
    for (let index = 0; index < limited.length; index += 1) {
      if (limited[index] === 10 && ++lines === (options.lineLimit ?? 20)) {
        end = index + 1; stopped = true; break;
      }
    }
    chunks.push(limited.subarray(0, end)); bytes += end;
    if (stopped) break;
  }
  return { buffer: Buffer.concat(chunks, bytes), truncated: stopped };
}
```

`readPreview(path, options)` must stat the file, return `totalSize`, decode text with `TextDecoder('utf-8', { fatal: false })`, and base64-encode binary payloads. Route query parameters accept only `mode`, while kind/limits are recomputed from the remote filename and stat size using `classifyPreview`.

- [ ] **Step 4: Normalize Electron IPC and remote API**

```ts
preview(targetPath: string, descriptor: PreviewDescriptor): Promise<FilePreviewPayload>;

export async function previewRemote(
  sessionId: string,
  remotePath: string,
  descriptor: PreviewDescriptor,
  signal?: AbortSignal,
): Promise<FilePreviewPayload>;
```

Remote `fetch` receives `signal`; the route rejects `unsupported` descriptors with HTTP 415.

- [ ] **Step 5: Run focused tests**

Run: `npx vitest run electron/local-files.test.ts server/files/sftpFileService.test.ts server/files/registerFileRoutes.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit bounded preview reads**

```bash
git add hpclaw_v1/electron/local-files.cjs hpclaw_v1/electron/local-files.test.ts hpclaw_v1/server/files/sftpFileService.ts hpclaw_v1/server/files/sftpFileService.test.ts hpclaw_v1/server/files/registerFileRoutes.ts hpclaw_v1/server/files/registerFileRoutes.test.ts hpclaw_v1/src/features/file-transfer/api.ts hpclaw_v1/src/types/desktop.d.ts
git commit -m "feat: add bounded file preview reads"
```

### Task 3: Electron managed edit-session service

**Files:**
- Create: `electron/remote-edit-sessions.cjs`
- Create: `electron/remote-edit-sessions.test.ts`
- Modify: `electron/main.cjs`
- Modify: `electron/preload.cjs`
- Modify: `src/types/desktop.d.ts`

- [ ] **Step 1: Write failing lifecycle tests**

Cover cache containment, same remote-path reuse, default-app launch failure, dirty event debounce, fingerprint de-duplication, close event, retained failed sessions, and local system open.

```ts
const session = await manager.prepare({ profileId: 'p1', sshSessionId: 's1', remotePath: '/work/a.docx', fileName: 'a.docx' });
expect(path.dirname(session.localPath)).toContain(path.join(root, 'remote-edit-sessions'));
expect(await manager.prepare({ profileId: 'p1', sshSessionId: 's1', remotePath: '/work/a.docx', fileName: 'a.docx' })).toMatchObject({ id: session.id });
await manager.open(session.id);
expect(launcher).toHaveBeenCalledWith(session.localPath);
```

- [ ] **Step 2: Run the test and confirm the module is missing**

Run: `npx vitest run electron/remote-edit-sessions.test.ts`

Expected: FAIL because `remote-edit-sessions.cjs` does not exist.

- [ ] **Step 3: Implement the injected session manager**

```js
function createRemoteEditSessionManager({ root, fs, watch, hashFile, launch, emit, debounceMs = 800 }) {
  const sessions = new Map();
  const watchers = new Map();
  async function prepare(metadata) {
    const existing = [...sessions.values()].find(item => item.profileId === metadata.profileId && item.remotePath === metadata.remotePath && item.state !== 'synced');
    if (existing) return { ...existing };
    const id = crypto.randomUUID();
    const directory = path.join(root, 'remote-edit-sessions', id);
    await fs.mkdir(directory, { recursive: true });
    const session = { ...metadata, id, localPath: path.join(directory, path.basename(metadata.fileName)), state: 'downloading', dirty: false };
    sessions.set(id, session);
    await persistSessions(root, fs, sessions);
    return { ...session };
  }
  async function update(id, patch) {
    const current = sessions.get(id);
    if (!current) throw new Error(`Unknown remote edit session: ${id}`);
    const next = { ...current, ...patch };
    sessions.set(id, next);
    await persistSessions(root, fs, sessions);
    emit('changed', { ...next });
    return { ...next };
  }
  return {
    prepare,
    markDownloaded: id => update(id, { state: 'opening' }),
    markUploading: (id, fingerprint) => update(id, { state: 'uploading', lastLocalFingerprint: fingerprint, dirty: true }),
    markSynced: (id, fingerprint) => update(id, { state: 'synced', lastUploadedFingerprint: fingerprint, dirty: false, error: undefined }),
    markFailed: (id, error) => update(id, { state: 'failed', error, dirty: true }),
    list: () => [...sessions.values()].map(item => ({ ...item })),
    retry: id => update(id, { state: 'editing', error: undefined }),
    dispose: () => { for (const watcher of watchers.values()) watcher.close(); watchers.clear(); },
    async open(id) {
      const session = await update(id, { state: 'editing' });
      watchers.set(id, watchStableFile(session.localPath, debounceMs, async () => {
        const fingerprint = await hashFile(session.localPath);
        if (fingerprint !== sessions.get(id).lastUploadedFingerprint) emit('dirty', { ...sessions.get(id), dirty: true, lastLocalFingerprint: fingerprint });
      }));
      launch(session.localPath).then(() => emit('closed', { ...sessions.get(id) })).catch(error => update(id, { state: 'failed', error: error.message }));
      return session;
    },
  };
}

async function persistSessions(root, fs, sessions) {
  const directory = path.join(root, 'remote-edit-sessions');
  await fs.mkdir(directory, { recursive: true });
  const target = path.join(directory, 'sessions.json');
  const temporary = `${target}.tmp`;
  await fs.writeFile(temporary, JSON.stringify([...sessions.values()], null, 2), 'utf8');
  await fs.rename(temporary, target);
}

function watchStableFile(filePath, debounceMs, onStable) {
  let timer;
  const watcher = watch(filePath, () => {
    clearTimeout(timer);
    timer = setTimeout(() => void onStable(), debounceMs);
  });
  return { close() { clearTimeout(timer); watcher.close(); } };
}
```

Sanitize the display filename with `path.basename`, generate the directory with `crypto.randomUUID`, persist `sessions.json` atomically, and never delete a dirty/failed/unsynced cache. Emit `dirty`, `closed`, and `error` events with the complete public session.

- [ ] **Step 4: Register IPC and bridge APIs**

```js
remoteEdits: {
  prepare: (metadata) => ipcRenderer.invoke('hpclaw:remoteEdits:prepare', metadata),
  markDownloaded: (id) => ipcRenderer.invoke('hpclaw:remoteEdits:markDownloaded', id),
  open: (id) => ipcRenderer.invoke('hpclaw:remoteEdits:open', id),
  markUploading: (id, fingerprint) => ipcRenderer.invoke('hpclaw:remoteEdits:markUploading', id, fingerprint),
  markSynced: (id, fingerprint) => ipcRenderer.invoke('hpclaw:remoteEdits:markSynced', id, fingerprint),
  markFailed: (id, error) => ipcRenderer.invoke('hpclaw:remoteEdits:markFailed', id, error),
  list: () => ipcRenderer.invoke('hpclaw:remoteEdits:list'),
  onChanged: (callback) => {
    const handler = (_event, change) => callback(change);
    ipcRenderer.on('hpclaw:remoteEdits:changed', handler);
    return () => ipcRenderer.removeListener('hpclaw:remoteEdits:changed', handler);
  },
},
localFiles: { open: (path) => ipcRenderer.invoke('hpclaw:localFiles:open', path) }
```

The real launcher uses a hidden PowerShell `Start-Process -FilePath <literal> -PassThru -Wait` helper on Windows and `shell.openPath` fallback. Its resolved/error result emits the close/failure event; the watcher remains the correctness fallback when an associated app reuses an existing process.

- [ ] **Step 5: Run Electron tests**

Run: `npx vitest run electron/remote-edit-sessions.test.ts electron/local-files.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit the Electron session layer**

```bash
git add hpclaw_v1/electron/remote-edit-sessions.cjs hpclaw_v1/electron/remote-edit-sessions.test.ts hpclaw_v1/electron/main.cjs hpclaw_v1/electron/preload.cjs hpclaw_v1/src/types/desktop.d.ts
git commit -m "feat: manage external remote file edits"
```

### Task 4: Split file-pane open and preview intents

**Files:**
- Modify: `src/features/file-transfer/FilePane.tsx`
- Modify: `src/features/file-transfer/FilePane.test.tsx`
- Modify: `src/features/file-transfer/LocalFilePane.tsx`
- Modify: `src/features/file-transfer/RemoteFilePane.tsx`

- [ ] **Step 1: Add failing interaction tests**

```tsx
const onOpenFile = vi.fn();
const onPreviewFile = vi.fn();
render(<FilePane {...fixtureProps} onOpenFile={onOpenFile} onPreviewFile={onPreviewFile} />);
fireEvent.doubleClick(screen.getByTestId('file-row-report.docx'));
expect(onOpenFile).toHaveBeenCalledWith(expect.objectContaining({ name: 'report.docx' }));
fireEvent.contextMenu(screen.getByTestId('file-row-report.docx'));
fireEvent.click(screen.getByRole('menuitem', { name: '预览' }));
expect(onPreviewFile).toHaveBeenCalledWith(expect.objectContaining({ name: 'report.docx' }));
```

Also assert directory double-click still navigates and never calls either file callback.

- [ ] **Step 2: Run the component test and confirm prop failures**

Run: `npx vitest run src/features/file-transfer/FilePane.test.tsx`

Expected: FAIL because the callbacks do not exist and preview still renders inside `FilePane`.

- [ ] **Step 3: Replace adapter preview with explicit callbacks**

```ts
export interface FileOpenHandlers {
  onOpenFile(entry: FileEntry): void;
  onPreviewFile(entry: FileEntry): void;
}

const handleDoubleClick = (entry: FileEntry) => {
  if (entry.kind === 'directory') onNavigate(entry.path, [], true, undefined);
  else onOpenFile(entry);
};
```

Remove `PreviewResult`, `FilePaneAdapter.preview`, `previewContent`, and the legacy dialog. Add separate context items with `ExternalLink` for “打开并编辑” and `Eye` for “预览”.

- [ ] **Step 4: Run the component tests**

Run: `npx vitest run src/features/file-transfer/FilePane.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit interaction separation**

```bash
git add hpclaw_v1/src/features/file-transfer/FilePane.tsx hpclaw_v1/src/features/file-transfer/FilePane.test.tsx hpclaw_v1/src/features/file-transfer/LocalFilePane.tsx hpclaw_v1/src/features/file-transfer/RemoteFilePane.tsx
git commit -m "feat: split file open and preview actions"
```

### Task 5: Orchestrate remote download, external edit, and overwrite upload

**Files:**
- Create: `src/features/file-transfer/editSessionController.ts`
- Create: `src/features/file-transfer/editSessionController.test.ts`
- Modify: `src/features/file-transfer/FileTransferWorkspace.tsx`
- Modify: `src/features/file-transfer/FileTransferDrawer.test.tsx`

- [ ] **Step 1: Write failing pure orchestration tests**

```ts
const download = createEditDownloadTask(session, file, profileId);
expect(download).toMatchObject({ direction: 'download', localPath: session.localPath, remotePath: file.path, conflictPolicy: 'overwrite' });
const upload = createEditUploadTask(session, file.size, profileId);
expect(upload).toMatchObject({ direction: 'upload', localPath: session.localPath, remotePath: session.remotePath, conflictPolicy: 'overwrite' });
expect(nextEditAction(session, { ...download, state: 'completed' })).toEqual({ type: 'open', sessionId: session.id });
```

- [ ] **Step 2: Run tests and confirm helpers are missing**

Run: `npx vitest run src/features/file-transfer/editSessionController.test.ts`

Expected: FAIL because `editSessionController.ts` does not exist.

- [ ] **Step 3: Implement pure task builders and transition mapping**

```ts
export function createEditDownloadTask(session: RemoteEditSession, file: FileEntry, profileId: string): TransferInput {
  return { profileId, sessionId: session.sshSessionId, direction: 'download', localPath: session.localPath, remotePath: file.path, temporaryPath: makeTemporaryTransferName(session.localPath, crypto.randomUUID(), 'local'), totalBytes: file.size, transferredBytes: 0, conflictPolicy: 'overwrite', verificationMode: 'size', retryCount: 0 };
}
export function createEditUploadTask(session: RemoteEditSession, size: number, profileId: string): TransferInput {
  return { profileId, sessionId: session.sshSessionId, direction: 'upload', localPath: session.localPath, remotePath: session.remotePath, temporaryPath: makeTemporaryTransferName(session.remotePath, crypto.randomUUID(), 'remote'), totalBytes: size, transferredBytes: 0, conflictPolicy: 'overwrite', verificationMode: 'size', retryCount: 0 };
}
export function nextEditAction(session: RemoteEditSession, task: TransferTask): EditAction | null {
  if (task.state === 'failed') return { type: 'failed', sessionId: session.id, error: task.error ?? '传输失败' };
  if (task.state !== 'completed') return null;
  return task.direction === 'download' ? { type: 'open', sessionId: session.id } : { type: 'synced', sessionId: session.id, fingerprint: session.lastLocalFingerprint ?? '' };
}
```

- [ ] **Step 4: Wire workspace effects**

`handleLocalOpen` calls `window.hpclawDesktop.localFiles.open`. `handleRemoteOpen` calls `remoteEdits.prepare`, enqueues the download, and stores task-to-edit-session links. Socket `transfer:updated` completion calls `markDownloaded` then `open`; `dirty`/`closed` events hash-de-duplicate and enqueue a single overwrite upload; upload completion calls `markSynced`; failure calls `markFailed` and leaves cache intact.

Render a compact session strip with buttons:

```tsx
<button onClick={() => retryEditUpload(session.id)}>重试上传</button>
<button onClick={() => window.hpclawDesktop?.localFiles.open(session.localPath)}>打开本地副本</button>
```

- [ ] **Step 5: Add workspace integration tests**

Mock desktop IPC and `enqueueTransfer`; assert remote double-click queues download, completion opens, dirty event queues one upload with `overwrite`, duplicate dirty fingerprint does not queue another upload, and upload failure exposes retry.

- [ ] **Step 6: Run orchestration tests**

Run: `npx vitest run src/features/file-transfer/editSessionController.test.ts src/features/file-transfer/FileTransferDrawer.test.tsx`

Expected: PASS.

- [ ] **Step 7: Commit edit orchestration**

```bash
git add hpclaw_v1/src/features/file-transfer/editSessionController.ts hpclaw_v1/src/features/file-transfer/editSessionController.test.ts hpclaw_v1/src/features/file-transfer/FileTransferWorkspace.tsx hpclaw_v1/src/features/file-transfer/FileTransferDrawer.test.tsx
git commit -m "feat: sync external edits to remote files"
```

### Task 6: Build the unified right-click preview readers

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `src/features/file-transfer/previewRenderers.tsx`
- Replace: `src/features/file-transfer/FilePreview.tsx`
- Create: `src/features/file-transfer/FilePreview.test.tsx`
- Modify: `src/features/file-transfer/FileTransferWorkspace.tsx`
- Modify: `src/features/file-transfer/fileTransfer.css`

- [ ] **Step 1: Install reader libraries**

Run: `npm install pdfjs-dist docx-preview xlsx`

Expected: dependencies and lockfile update successfully.

- [ ] **Step 2: Write failing reader-selection tests**

Mock local/remote preview payloads and assert image data URLs, Markdown headings, text line numbers plus “仅预览 head -20”, worksheet tab names, DOCX render invocation, PDF page controls, unsupported fallback, and aborted stale requests.

```tsx
expect(await screen.findByRole('img', { name: 'plot.png' })).toBeInTheDocument();
expect(await screen.findByRole('heading', { name: 'Results' })).toBeInTheDocument();
expect(await screen.findByText('仅预览 head -20')).toBeInTheDocument();
```

- [ ] **Step 3: Run tests and confirm missing readers**

Run: `npx vitest run src/features/file-transfer/FilePreview.test.tsx`

Expected: FAIL because the unified readers are not implemented.

- [ ] **Step 4: Implement focused reader components**

```tsx
function useObjectUrl(bytes: Uint8Array, mime: string): string {
  const [url, setUrl] = useState('');
  useEffect(() => {
    const next = URL.createObjectURL(new Blob([bytes], { type: mime }));
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [bytes, mime]);
  return url;
}

export function ImagePreview({ bytes, mime, name }: BinaryProps) {
  const url = useObjectUrl(bytes, mime);
  return <img src={url} alt={name} className="preview-image" />;
}
export function MarkdownPreview({ text }: TextProps) { return <ReactMarkdown>{text}</ReactMarkdown>; }
export function TextPreview({ text, lineLimit, truncated }: TextProps) {
  const lines = text.replace(/\n$/, '').split('\n');
  return <div>{truncated && lineLimit && <div className="preview-truncated">仅预览 head -{lineLimit}</div>}<ol className="preview-lines">{lines.map((line, index) => <li key={index}><code>{line || ' '}</code></li>)}</ol></div>;
}
```

Implement the remaining readers with these concrete library calls and state transitions:

```tsx
export function DocxPreview({ bytes }: BinaryProps) {
  const host = useRef<HTMLDivElement>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!host.current) return;
    host.current.replaceChildren();
    void renderAsync(bytes.buffer, host.current, undefined, { inWrapper: true })
      .catch(cause => setError(cause instanceof Error ? cause.message : String(cause)));
  }, [bytes]);
  return error ? <PreviewError message={error} /> : <div ref={host} className="preview-docx" />;
}

export function SheetPreview({ bytes, text, name }: SheetProps) {
  const workbook = useMemo(() => read(text ?? bytes, { type: text === undefined ? 'array' : 'string' }), [bytes, text]);
  const [active, setActive] = useState(workbook.SheetNames[0] ?? '');
  const rows = useMemo(() => active ? utils.sheet_to_json<unknown[]>(workbook.Sheets[active], { header: 1, raw: false }).slice(0, 2000).map(row => row.slice(0, 200)) : [], [workbook, active]);
  return <div className="preview-sheet"><div role="tablist">{workbook.SheetNames.map(sheet => <button role="tab" aria-selected={sheet === active} onClick={() => setActive(sheet)} key={sheet}>{sheet}</button>)}</div><table><tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, columnIndex) => <td key={columnIndex}>{String(cell ?? '')}</td>)}</tr>)}</tbody></table></div>;
}

export function PdfPreview({ bytes }: BinaryProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [document, setDocument] = useState<PDFDocumentProxy | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  useEffect(() => { const task = getDocument({ data: bytes }); void task.promise.then(setDocument); return () => void task.destroy(); }, [bytes]);
  useEffect(() => {
    if (!document || !canvas.current) return;
    let renderTask: RenderTask | undefined;
    void document.getPage(pageNumber).then(page => {
      const viewport = page.getViewport({ scale: 1.25 });
      const context = canvas.current!.getContext('2d')!;
      canvas.current!.width = viewport.width;
      canvas.current!.height = viewport.height;
      renderTask = page.render({ canvasContext: context, viewport });
      return renderTask.promise;
    });
    return () => renderTask?.cancel();
  }, [document, pageNumber]);
  return <div className="preview-pdf"><button disabled={pageNumber === 1} onClick={() => setPageNumber(value => value - 1)}>上一页</button><span>{pageNumber} / {document?.numPages ?? 0}</span><button disabled={!document || pageNumber === document.numPages} onClick={() => setPageNumber(value => value + 1)}>下一页</button><canvas ref={canvas} /></div>;
}
```

`PreviewError` is a local component returning `<div role="alert" className="preview-error">{message}</div>`.

Configure the PDF worker from `pdfjs-dist`, render one page at a time to canvas, cap spreadsheet DOM to 2,000 rows × 200 columns, and clean up object URLs/canvas work on unmount.

- [ ] **Step 5: Replace `FilePreview` loading and dispatch**

Compute `descriptor = classifyPreview(file.name, file.size)`, load through local IPC or `previewRemote`, abort on close/file change, decode base64 once, and dispatch on `descriptor.kind`. Unsupported content includes an “打开并编辑” callback.

- [ ] **Step 6: Add responsive reader styles**

Make the dialog `min(92vw, 1200px)` by `min(88vh, 900px)`, keep metadata compact, allow document/table scrolling, and provide visible focus/disabled states for paging, sheet tabs, zoom, and close controls.

- [ ] **Step 7: Run reader tests**

Run: `npx vitest run src/features/file-transfer/FilePreview.test.tsx shared/filePreview.test.ts`

Expected: PASS.

- [ ] **Step 8: Commit preview readers**

```bash
git add hpclaw_v1/package.json hpclaw_v1/package-lock.json hpclaw_v1/src/features/file-transfer/previewRenderers.tsx hpclaw_v1/src/features/file-transfer/FilePreview.tsx hpclaw_v1/src/features/file-transfer/FilePreview.test.tsx hpclaw_v1/src/features/file-transfer/FileTransferWorkspace.tsx hpclaw_v1/src/features/file-transfer/fileTransfer.css
git commit -m "feat: add rich right-click file previews"
```

### Task 7: Protect unsynced edits on application close

**Files:**
- Modify: `electron/main.cjs`
- Modify: `electron/remote-edit-sessions.cjs`
- Modify: `electron/remote-edit-sessions.test.ts`

- [ ] **Step 1: Add failing close-guard tests**

```ts
expect(manager.hasUnsynced()).toBe(true);
manager.markSynced(session.id, fingerprint);
expect(manager.hasUnsynced()).toBe(false);
```

Test that `promptBeforeClose` reports both active transfers and unsynced edit-session count and that forced close never invokes cache cleanup.

- [ ] **Step 2: Run Electron tests and confirm failure**

Run: `npx vitest run electron/remote-edit-sessions.test.ts`

Expected: FAIL because `hasUnsynced` and combined close guarding do not exist.

- [ ] **Step 3: Implement combined close protection**

```js
const unsynced = remoteEditSessionManager.list().filter(session => session.dirty && session.lastLocalFingerprint !== session.lastUploadedFingerprint);
```

Show “仍有 N 个远程文件修改未同步，强制关闭不会删除本地恢复副本。” and preserve the cache directory across shutdown.

- [ ] **Step 4: Run close-guard tests**

Run: `npx vitest run electron/remote-edit-sessions.test.ts electron/profile-store.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit close protection**

```bash
git add hpclaw_v1/electron/main.cjs hpclaw_v1/electron/remote-edit-sessions.cjs hpclaw_v1/electron/remote-edit-sessions.test.ts
git commit -m "feat: protect unsynced remote edits"
```

### Task 8: Documentation and full verification

**Files:**
- Modify: `README.md`
- Modify: `docs/XFTP_WORKSPACE.md`

- [ ] **Step 1: Document exact user behavior**

Document: remote double-click downloads and opens externally; save/close auto-overwrites the original path; failures retain cache and expose retry; local double-click only opens; right-click preview is read-only; large line text uses `head -20`.

- [ ] **Step 2: Run formatting and type verification**

Run: `npm run lint`

Expected: exit 0 with no TypeScript errors.

- [ ] **Step 3: Run the full test suite**

Run: `npm test`

Expected: all Vitest files pass.

- [ ] **Step 4: Build production assets**

Run: `npm run build`

Expected: Vite build completes and emits `dist` without errors.

- [ ] **Step 5: Run Electron server packaging check**

Run: `npm run build:electron-server`

Expected: `dist-electron/server.cjs` is generated without errors.

- [ ] **Step 6: Perform manual desktop smoke checks**

Run: `npm run electron:dev`

Verify one local default-open, one remote DOCX download/edit/save/close/overwrite cycle, one deliberate upload failure with retained local copy and retry, image/PDF/DOCX/XLSX/Markdown previews, and a synthetic 100 MiB FASTA preview showing exactly 20 lines.

- [ ] **Step 7: Commit documentation**

```bash
git add hpclaw_v1/README.md hpclaw_v1/docs/XFTP_WORKSPACE.md
git commit -m "docs: explain remote file edit sessions"
```
