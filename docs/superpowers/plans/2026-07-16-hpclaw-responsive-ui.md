# HPClaw Responsive Desktop UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild HPClaw's Electron renderer as a responsive, themeable workstation where AI resource links open typed previews in a right-side panel that can expand into a large sliding workspace.

**Architecture:** Preserve terminal, AI, SSH, file, transfer, and backend behavior while extracting renderer UI state into a versioned preference service, theme provider, responsive shell, resource activity panel, and shared source-aware preview controller. Keep AI, terminal, and preview subtrees mounted across layout changes so drafts, terminal sessions, zoom, table state, and scroll positions survive mode switches.

**Tech Stack:** React 19, TypeScript 5.8, Vite 6, Tailwind CSS 4, Electron 42, Vitest 3, Testing Library, Motion, Lucide React, xterm, Socket.IO.

---

## File Structure

### New Files

- `src/services/theme.ts` - resolves application and terminal palettes.
- `src/services/theme.test.ts` - pure theme-resolution tests.
- `src/components/theme/ThemeProvider.tsx` - applies theme attributes and tracks system changes.
- `src/components/theme/ThemeProvider.test.tsx` - provider and persistence tests.
- `src/components/workbench/layout.ts` - breakpoint and panel-width calculations.
- `src/components/workbench/layout.test.ts` - mode and clamp tests.
- `src/components/workbench/PanelSplitter.tsx` - accessible pointer/keyboard splitter.
- `src/components/workbench/PanelSplitter.test.tsx` - splitter interaction tests.
- `src/components/workbench/ResponsiveAppShell.tsx` - stable wide/medium/compact shell.
- `src/components/workbench/ResponsiveAppShell.test.tsx` - layout and mount-continuity tests.
- `src/components/workbench/DrawerHost.tsx` - single top-layer overlay host.
- `src/components/workbench/DrawerHost.test.tsx` - Escape, scrim, and focus tests.
- `src/components/workbench/workbench.css` - shell, splitter, drawer, and breakpoint styles.
- `src/features/resource-preview/types.ts` - resource and preview contracts.
- `src/features/resource-preview/resourceLoaders.ts` - cluster, transfer-local, and transfer-remote loaders.
- `src/features/resource-preview/resourceLoaders.test.ts` - source-routing and content-conversion tests.
- `src/features/resource-preview/previewReducer.ts` - deterministic preview transitions.
- `src/features/resource-preview/previewReducer.test.ts` - request, error, and mode tests.
- `src/features/resource-preview/useResourcePreview.ts` - cancellation and shared loaded-content lifecycle.
- `src/features/resource-preview/useResourcePreview.test.tsx` - stale-request and no-refetch tests.
- `src/features/resource-preview/PreviewSurface.tsx` - registry-backed preview states.
- `src/features/resource-preview/ResourcePreviewHost.tsx` - panel/workspace presentation of one surface.
- `src/features/resource-preview/ResourcePreviewHost.test.tsx` - expansion continuity tests.
- `src/features/resource-preview/resourcePreview.css` - panel and large sliding-workspace styles.
- `src/components/rich-content/ResourceLink.tsx` - compact typed AI resource link.
- `src/components/rich-content/RichContentMessage.test.tsx` - extraction and click tests.
- `src/components/AIChat.ui.test.tsx` - resource callback and centralized-settings tests.
- `src/components/resources/ResourceActivityRail.tsx` - Preview, Files, History, Transfers, Search rail.
- `src/components/resources/ResourceActivityRail.test.tsx` - selection, badge, and tooltip tests.
- `src/components/resources/ResourcePanel.tsx` - active resource-view composition.
- `src/components/resources/ResourcePanel.test.tsx` - stable view composition tests.
- `src/components/resources/TransferQueuePanel.tsx` - compact backend-backed transfer queue.
- `src/components/resources/TransferQueuePanel.test.tsx` - load, socket update, and retry tests.
- `src/components/resources/ResourceSearchPanel.tsx` - remote resource search.
- `src/components/resources/ResourceSearchPanel.test.tsx` - query, error, and open tests.
- `src/components/resources/resources.css` - activity rail and resource-panel styles.
- `src/components/settings/SettingsCenter.tsx` - categorized global settings.
- `src/components/settings/SettingsCenter.test.tsx` - UI, AI, terminal, and transfer settings tests.
- `src/components/settings/settings.css` - responsive settings layout.
- `src/components/Header.test.tsx` - workbench command tests.
- `src/components/LoginForm.test.tsx` - login layout and progressive-auth tests.
- `src/components/Terminal.theme.test.tsx` - terminal palette updates without recreation.
- `src/App.ui.test.tsx` - renderer integration test for AI-linked preview.
- `src/features/file-transfer/FileTransferWorkspace.test.tsx` - compact pane switching and preview routing.
- `electron/window-options.cjs` - testable BrowserWindow defaults.
- `electron/window-options.test.ts` - compact-window contract.

### Modified Files

- `src/services/uiPrefs.ts` and `src/services/uiPrefs.test.ts` - versioned schema, migration, and patch updates.
- `src/index.css` - semantic light/dark tokens and shared controls.
- `src/main.tsx` - mount `ThemeProvider`.
- `src/App.tsx` - compose shell, activity panel, preview, settings, and overlays.
- `src/components/Header.tsx` - compact commands and settings/theme entry points.
- `src/components/LoginForm.tsx` - responsive connection form.
- `src/components/AIChat.tsx` - remove embedded global settings and forward link clicks.
- `src/components/rich-content/RichContentMessage.tsx` - replace eager cards with links.
- `src/components/rich-content/*Card.tsx` - semantic, workspace-safe renderer styling.
- `src/components/FileManager.tsx` - route file opens through shared preview.
- `src/components/ConversationList.tsx` - semantic resource-panel styling.
- `src/components/Terminal.tsx` - independent resolved terminal palette.
- `src/components/TerminalAI.tsx` - responsive terminal framing.
- `src/features/file-transfer/controller.ts` - export transfer summary calculation.
- `src/features/file-transfer/TransferQueue.tsx` - compact queue variant.
- `src/features/file-transfer/FilePane.tsx` - route file previews through shared preview.
- `src/features/file-transfer/LocalFilePane.tsx` and `RemoteFilePane.tsx` - forward preview callbacks.
- `src/features/file-transfer/FileTransferWorkspace.tsx` - responsive pane mode and shared preview.
- `src/features/file-transfer/FileTransferDrawer.tsx` and `fileTransfer.css` - unified overlay and breakpoints.
- `electron/main.cjs` - use testable window options and lower minimum size.

---

### Task 1: Version the UI preference schema

**Files:**
- Modify: `src/services/uiPrefs.ts`
- Modify: `src/services/uiPrefs.test.ts`

- [ ] **Step 1: Write failing migration and patch-update tests**

```ts
it('migrates the legacy AI-only preference', () => {
  localStorage.setItem('hpclaw_ui_prefs', JSON.stringify({ aiPanelMode: 'sidebar' }));
  expect(loadUIPrefs()).toMatchObject({ version: 2, aiPanelMode: 'sidebar', appTheme: 'system' });
});

it('patches one field without discarding persisted widths', () => {
  saveUIPrefs({ leftWidth: 416, rightWidth: 392 });
  saveUIPrefs({ appTheme: 'dark' });
  expect(loadUIPrefs()).toMatchObject({ leftWidth: 416, rightWidth: 392, appTheme: 'dark' });
});
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `npx vitest run src/services/uiPrefs.test.ts --pool threads --maxWorkers 1 --minWorkers 1`

Expected: FAIL because the current schema only stores `aiPanelMode` and `saveUIPrefs` requires a complete object.

- [ ] **Step 3: Implement the versioned schema and clamped normalization**

```ts
export type AIPanelMode = 'drawer' | 'sidebar';
export type AppThemePreference = 'system' | 'light' | 'dark';
export type TerminalThemePreference = 'follow-app' | 'light' | 'dark';
export type ResourceView = 'preview' | 'files' | 'history' | 'transfers' | 'search';
export type PreviewMode = 'panel' | 'workspace';

export interface UIPrefs {
  version: 2;
  aiPanelMode: AIPanelMode;
  appTheme: AppThemePreference;
  terminalTheme: TerminalThemePreference;
  aiOpen: boolean;
  resourceOpen: boolean;
  leftWidth: number;
  rightWidth: number;
  activeResourceView: ResourceView;
  previewMode: PreviewMode;
}

export const DEFAULT_UI_PREFS: UIPrefs = {
  version: 2,
  aiPanelMode: 'sidebar',
  appTheme: 'system',
  terminalTheme: 'follow-app',
  aiOpen: true,
  resourceOpen: true,
  leftWidth: 380,
  rightWidth: 380,
  activeResourceView: 'files',
  previewMode: 'panel',
};

const clampWidth = (value: unknown, fallback: number) =>
  typeof value === 'number' && Number.isFinite(value)
    ? Math.min(520, Math.max(300, Math.round(value)))
    : fallback;

export function saveUIPrefs(patch: Partial<UIPrefs>): UIPrefs {
  const normalized = normalizeUIPrefs({ ...loadUIPrefs(), ...patch, version: 2 });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  window.dispatchEvent(new CustomEvent(UI_PREFS_CHANGE_EVENT, { detail: normalized }));
  return normalized;
}
```

Implement explicit allow-list normalizers for every union field; malformed JSON and unknown values must fall back field-by-field to `DEFAULT_UI_PREFS`.

- [ ] **Step 4: Verify and commit**

Run: `npx vitest run src/services/uiPrefs.test.ts --pool threads --maxWorkers 1 --minWorkers 1 && npm run lint`

Expected: PASS and no TypeScript errors.

```powershell
git add src/services/uiPrefs.ts src/services/uiPrefs.test.ts
git commit -m "feat: version desktop UI preferences"
```

---

### Task 2: Add app and terminal theme resolution

**Files:**
- Create: `src/services/theme.ts`
- Create: `src/services/theme.test.ts`
- Create: `src/components/theme/ThemeProvider.tsx`
- Create: `src/components/theme/ThemeProvider.test.tsx`
- Modify: `src/main.tsx`

- [ ] **Step 1: Write failing pure and provider tests**

```ts
expect(resolveAppTheme('system', true)).toBe('dark');
expect(resolveAppTheme('system', false)).toBe('light');
expect(resolveTerminalTheme('follow-app', 'light')).toBe('light');
expect(resolveTerminalTheme('dark', 'light')).toBe('dark');
```

The provider test must assert `document.documentElement.dataset.theme`, persistence after `setAppTheme('dark')`, and live updates from a mocked `matchMedia('(prefers-color-scheme: dark)')` listener.

- [ ] **Step 2: Confirm RED**

Run: `npx vitest run src/services/theme.test.ts src/components/theme/ThemeProvider.test.tsx --pool threads --maxWorkers 1 --minWorkers 1`

Expected: FAIL because the theme modules do not exist.

- [ ] **Step 3: Implement resolvers and provider**

```ts
export type ResolvedTheme = 'light' | 'dark';

export const resolveAppTheme = (preference: AppThemePreference, systemDark: boolean): ResolvedTheme =>
  preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;

export const resolveTerminalTheme = (
  preference: TerminalThemePreference,
  appTheme: ResolvedTheme,
): ResolvedTheme => preference === 'follow-app' ? appTheme : preference;
```

```tsx
interface ThemeContextValue {
  prefs: UIPrefs;
  resolvedTheme: ResolvedTheme;
  resolvedTerminalTheme: ResolvedTheme;
  setAppTheme: (theme: AppThemePreference) => void;
  setTerminalTheme: (theme: TerminalThemePreference) => void;
}
```

`ThemeProvider` must own one `UIPrefs` snapshot, listen to both `UI_PREFS_CHANGE_EVENT` and the system media query, set `data-theme`, and expose `useTheme()`. Wrap `<App />` with it in `main.tsx`.

- [ ] **Step 4: Verify and commit**

Run: `npx vitest run src/services/theme.test.ts src/components/theme/ThemeProvider.test.tsx --pool threads --maxWorkers 1 --minWorkers 1 && npm run lint`

```powershell
git add src/services/theme.ts src/services/theme.test.ts src/components/theme src/main.tsx
git commit -m "feat: add system aware desktop themes"
```

---

### Task 3: Define responsive layout rules and splitters

**Files:**
- Create: `src/components/workbench/layout.ts`
- Create: `src/components/workbench/layout.test.ts`
- Create: `src/components/workbench/PanelSplitter.tsx`
- Create: `src/components/workbench/PanelSplitter.test.tsx`

- [ ] **Step 1: Write failing breakpoint and clamp tests**

```ts
it.each([[1440, 'wide'], [1366, 'medium'], [1100, 'medium'], [1099, 'compact'], [760, 'compact']] as const)(
  'maps %i to %s',
  (width, expected) => expect(getLayoutMode(width)).toBe(expected),
);

expect(clampWorkbenchWidths(1440, 520, 520)).toEqual({ left: 454, right: 454 });
expect(clampWorkbenchWidths(1920, 280, 620)).toEqual({ left: 300, right: 520 });
```

- [ ] **Step 2: Implement exact layout contracts**

```ts
export type LayoutMode = 'wide' | 'medium' | 'compact';
export const WIDE_MIN = 1440;
export const MEDIUM_MIN = 1100;
export const SIDE_PANEL_MIN = 300;
export const SIDE_PANEL_MAX = 520;
export const TERMINAL_MIN = 520;
export const SPLITTER_TOTAL = 12;

export const getLayoutMode = (width: number): LayoutMode =>
  width >= WIDE_MIN ? 'wide' : width >= MEDIUM_MIN ? 'medium' : 'compact';
```

`clampWorkbenchWidths` must reserve `TERMINAL_MIN + SPLITTER_TOTAL`, clamp both side widths, and split overflow evenly.

- [ ] **Step 3: Write and implement accessible splitter tests**

Test Arrow keys (16 px), Shift+Arrow keys (64 px), pointer drag, pointer cleanup, and double-click reset. Render a `role="separator"`, `aria-orientation="vertical"`, focus ring, and `touch-action: none`.

```tsx
<PanelSplitter
  label="调整 AI 面板宽度"
  onDelta={delta => setWidths(current => ({ ...current, left: current.left + delta }))}
  onReset={() => setWidths(current => ({ ...current, left: 380 }))}
/>
```

- [ ] **Step 4: Verify and commit**

Run: `npx vitest run src/components/workbench/layout.test.ts src/components/workbench/PanelSplitter.test.tsx --pool threads --maxWorkers 1 --minWorkers 1 && npm run lint`

```powershell
git add src/components/workbench/layout.ts src/components/workbench/layout.test.ts src/components/workbench/PanelSplitter.tsx src/components/workbench/PanelSplitter.test.tsx
git commit -m "feat: add responsive workbench layout rules"
```

---

### Task 4: Build the stable shell and one overlay host

**Files:**
- Create: `src/components/workbench/ResponsiveAppShell.tsx`
- Create: `src/components/workbench/ResponsiveAppShell.test.tsx`
- Create: `src/components/workbench/DrawerHost.tsx`
- Create: `src/components/workbench/DrawerHost.test.tsx`
- Create: `src/components/workbench/workbench.css`

- [ ] **Step 1: Write failing layout and mount-continuity tests**

Render at 1440, 1366, 1100, 1024, and 760 px. Assert `data-mode`, visible panes, active medium/compact dock, and that a typed uncontrolled AI input retains its value after rerendering from wide to compact.

```tsx
<ResponsiveAppShell
  width={width}
  header={<div>Header</div>}
  left={<input aria-label="AI draft" defaultValue="" />}
  center={<div>Terminal</div>}
  right={<div>Resources</div>}
  leftPresentation="sidebar"
  leftOpen
  rightOpen
  activeDock="right"
  leftWidth={380}
  rightWidth={380}
  onLeftOpenChange={vi.fn()}
  onRightOpenChange={vi.fn()}
  onActiveDockChange={vi.fn()}
  onWidthsChange={vi.fn()}
/>
```

- [ ] **Step 2: Implement a stable three-pane DOM**

Never conditionally unmount `left`, `center`, or `right`. Use `data-mode`, `data-open`, `aria-hidden`, `inert`, CSS grid columns, transforms, and z-index to present them:

- wide: AI / terminal / resource, both splitters available;
- medium: terminal plus exactly one docked side panel selected by `activeDock`;
- compact: terminal full-width; AI and resources become mutually exclusive overlay drawers.

When `leftPresentation="drawer"`, keep the same AI DOM node but give it overlay positioning at every breakpoint. When it is `sidebar`, use the responsive wide/docked/compact behavior above. This preserves the existing user-selectable AI panel mode without duplicating `AIChat`.

Use `ResizeObserver` in `App` to supply shell width; do not use viewport-width reads during render.

- [ ] **Step 3: Write failing overlay-host tests**

Assert only the active overlay is interactive, Escape closes the top overlay, scrim click closes it, and focus returns to the trigger. Use this union:

```ts
export type OverlayState =
  | { kind: 'none' }
  | { kind: 'ai' }
  | { kind: 'resources' }
  | { kind: 'settings' }
  | { kind: 'file-transfer'; maximized: boolean }
  | { kind: 'resource-workspace' };
```

- [ ] **Step 4: Implement `DrawerHost` and CSS**

Use a portal to `document.body`, `role="dialog"`, an accessible label, one scrim, and a single stacking scale. For `ai`, `resources`, and `resource-workspace`, `DrawerHost` renders the scrim and coordinates dismissal/focus while the already-mounted shell pane raises itself with fixed positioning. This avoids moving stateful panes through a portal. The resource workspace must use `width: clamp(680px, 90vw, 1600px)` on wide/medium and `width: 100vw` in compact mode.

- [ ] **Step 5: Verify and commit**

Run: `npx vitest run src/components/workbench/ResponsiveAppShell.test.tsx src/components/workbench/DrawerHost.test.tsx --pool threads --maxWorkers 1 --minWorkers 1 && npm run lint`

```powershell
git add src/components/workbench
git commit -m "feat: add stable responsive application shell"
```

---

### Task 5: Implement the shared source-aware preview controller

**Files:**
- Create: `src/features/resource-preview/types.ts`
- Create: `src/features/resource-preview/resourceLoaders.ts`
- Create: `src/features/resource-preview/resourceLoaders.test.ts`
- Create: `src/features/resource-preview/previewReducer.ts`
- Create: `src/features/resource-preview/previewReducer.test.ts`
- Create: `src/features/resource-preview/useResourcePreview.ts`
- Create: `src/features/resource-preview/useResourcePreview.test.tsx`

- [ ] **Step 1: Define the stable contracts**

```ts
export type ResourceChannel = 'cluster' | 'transfer-local' | 'transfer-remote';
export type ResourceOrigin = 'ai' | 'files' | 'search' | 'transfer';

export interface PreviewResource {
  path: string;
  name: string;
  channel: ResourceChannel;
  origin: ResourceOrigin;
  sessionId?: string;
  size?: number;
  typeHint?: RendererType;
}

export interface PreviewState {
  status: 'idle' | 'loading' | 'ready' | 'unsupported' | 'error';
  mode: PreviewMode;
  resource: PreviewResource | null;
  content: CardContent | null;
  error: string | null;
  requestId: number;
}
```

- [ ] **Step 2: Write failing source-routing tests**

Mock `fetchFileContent`, `previewRemote`, and `window.hpclawDesktop.localFiles.preview`. Assert cluster, remote-transfer, and local-transfer resources call only their matching loader. Assert base64/text results convert to `CardContent` with `detectFileType(path)` and original size.

- [ ] **Step 3: Implement source-aware loading**

```ts
export async function loadResource(resource: PreviewResource, signal: AbortSignal): Promise<CardContent> {
  if (resource.channel === 'cluster') return fetchFileContent(resource.path, signal);
  const result = resource.channel === 'transfer-remote'
    ? await previewRemote(requireSession(resource), resource.path)
    : await window.hpclawDesktop!.localFiles.preview(resource.path, previewLimit(resource));
  if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
  const type = resource.typeHint ?? detectFileType(resource.path);
  return {
    type,
    filePath: resource.path,
    fileName: resource.name,
    content: decodePreviewContent(type, result.encoding, result.content),
    metadata: { size: result.size, mime: mimeFor(resource.path) },
  };
}
```

`requireSession`, `previewLimit`, `mimeFor`, and `decodePreviewContent` must be total functions with tests; do not silently fall back from remote to local loading. Preserve base64 for `image` and `pdf`; decode base64 to UTF-8 for table, code, FASTA, VCF, and log content.

Before loading, enforce 1 MiB for text-like resources and 20 MiB for images when `resource.size` is known. Throw a typed `UnsupportedResourceError` so the reducer enters `unsupported`; network, permission, missing-file, and disconnected failures enter `error` with their actionable message.

- [ ] **Step 4: Write reducer and hook tests**

Cover open/loading/ready/error/close, stale request rejection, AbortController cleanup, retry, and panel/workspace mode changes. The critical assertion is that `setMode('workspace')` does not call `loadResource` again and preserves the same `CardContent` object identity.

- [ ] **Step 5: Implement reducer and hook**

```ts
const openPreview = useCallback((resource: PreviewResource) => {
  abortRef.current?.abort();
  const controller = new AbortController();
  abortRef.current = controller;
  const requestId = ++requestRef.current;
  dispatch({ type: 'open', resource, requestId });
  loadResource(resource, controller.signal).then(
    content => dispatch({ type: 'resolved', requestId, content }),
    error => {
      if (error?.name !== 'AbortError') dispatch({ type: 'rejected', requestId, error: messageOf(error) });
    },
  );
}, []);
```

Expose `{ state, openPreview, closePreview, retry, setMode }`. Persist mode through `saveUIPrefs`, but reset a newly opened resource to panel mode.

- [ ] **Step 6: Verify and commit**

Run: `npx vitest run src/features/resource-preview --pool threads --maxWorkers 1 --minWorkers 1 && npm run lint`

```powershell
git add src/features/resource-preview/types.ts src/features/resource-preview/resourceLoaders.ts src/features/resource-preview/resourceLoaders.test.ts src/features/resource-preview/previewReducer.ts src/features/resource-preview/previewReducer.test.ts src/features/resource-preview/useResourcePreview.ts src/features/resource-preview/useResourcePreview.test.tsx
git commit -m "feat: add shared resource preview controller"
```

---

### Task 6: Render one preview surface as panel or large workspace

**Files:**
- Create: `src/features/resource-preview/PreviewSurface.tsx`
- Create: `src/features/resource-preview/ResourcePreviewHost.tsx`
- Create: `src/features/resource-preview/ResourcePreviewHost.test.tsx`
- Create: `src/features/resource-preview/resourcePreview.css`
- Modify: `src/components/rich-content/ImageCard.tsx`
- Modify: `src/components/rich-content/TableCard.tsx`
- Modify: `src/components/rich-content/CodeCard.tsx`
- Modify: `src/components/rich-content/FastaCard.tsx`
- Modify: `src/components/rich-content/GenericCard.tsx`

- [ ] **Step 1: Write failing state and continuity tests**

Assert idle, loading, error/retry, unsupported, and registry-rendered states. Add a test renderer with an uncontrolled zoom input, switch panel -> workspace -> panel, and assert both node identity and zoom value are unchanged.

- [ ] **Step 2: Implement the single mounted surface**

```tsx
const entry = state.content ? RendererRegistry.get(state.content.type) : undefined;
const Renderer = entry?.component;

return (
  <section className="preview-surface" aria-label="资源预览">
    <PreviewToolbar resource={state.resource} mode={state.mode} onModeChange={onModeChange} onClose={onClose} />
    <div className="preview-surface__body">
      {state.status === 'loading' && <PreviewLoading />}
      {state.status === 'error' && <PreviewError message={state.error!} onRetry={onRetry} />}
      {state.status === 'ready' && Renderer && <Renderer content={state.content!} />}
      {state.status === 'unsupported' && <UnsupportedPreview resource={state.resource!} />}
    </div>
  </section>
);
```

Import `RendererRegistry` from `@/components/rich-content` so the barrel's existing renderer registrations run before lookup; do not import the bare registry module in this surface.

`ResourcePreviewHost` must render this one `PreviewSurface` exactly once and change only wrapper class/data attributes for panel vs workspace.

`PreviewToolbar` always offers Copy Path, panel/workspace toggle, and Close. It offers Download only for channels with a valid download action supplied by the caller. The workspace wrapper becomes `position: fixed` above the shared scrim; it is never reparented or portaled.

- [ ] **Step 3: Apply explicit renderer container rules**

Use these exact shared classes in all card renderers:

| Element | Class | Contract |
|---|---|---|
| root | `preview-renderer` | `height:100%; min-width:0; display:flex; flex-direction:column` |
| toolbar | `preview-renderer__toolbar` | fixed 36 px, filename truncates |
| content | `preview-renderer__content` | `flex:1; min-height:0; overflow:auto` |
| image | `preview-renderer__image` | contain, centered, checkerboard only in image area |
| table | `preview-renderer__table` | sticky header, horizontal scroll, 32 px rows |
| code/FASTA | `preview-renderer__code` | monospace, selectable, no forced wrapping |

- [ ] **Step 4: Make renderer controls source-safe and stateful**

Remove renderer-level cluster-only download URLs and duplicate expand buttons; `PreviewToolbar` owns those actions. `ImageCard` must prefer `content.content` as a `data:${mime};base64,...` URL and use `/api/files/view` only when content is empty. Add 25-400% zoom plus Fit controls. `TableCard` must keep paging, row selection, and horizontal scroll inside the mounted component. Add tests that exercise actual image zoom and table selection before panel/workspace switching.

- [ ] **Step 5: Implement workspace sizing and motion**

Panel mode fills the right pane. Workspace mode uses the overlay host at 88-92% viewport width, honors `prefers-reduced-motion`, and never remounts or refetches content.

- [ ] **Step 6: Verify and commit**

Run: `npx vitest run src/features/resource-preview/ResourcePreviewHost.test.tsx src/components/rich-content/FileTypeDetector.test.ts src/components/rich-content/FilePathExtractor.test.ts --pool threads --maxWorkers 1 --minWorkers 1 && npm run lint`

```powershell
git add src/features/resource-preview/PreviewSurface.tsx src/features/resource-preview/ResourcePreviewHost.tsx src/features/resource-preview/ResourcePreviewHost.test.tsx src/features/resource-preview/resourcePreview.css src/components/rich-content/ImageCard.tsx src/components/rich-content/TableCard.tsx src/components/rich-content/CodeCard.tsx src/components/rich-content/FastaCard.tsx src/components/rich-content/GenericCard.tsx
git commit -m "feat: add panel and workspace resource preview"
```

---

### Task 7: Replace eager AI cards with clickable resource links

**Files:**
- Create: `src/components/rich-content/ResourceLink.tsx`
- Create: `src/components/rich-content/RichContentMessage.test.tsx`
- Create: `src/components/AIChat.ui.test.tsx`
- Modify: `src/components/rich-content/RichContentMessage.tsx`
- Modify: `src/components/AIChat.tsx`

- [ ] **Step 1: Write the failing interaction test**

```tsx
it('opens only the resource the user clicks', () => {
  const onOpenResource = vi.fn();
  render(
    <RichContentMessage onOpenResource={onOpenResource}>
      {'结果见 /home/user/plot.png 和 /home/user/summary.tsv'}
    </RichContentMessage>,
  );
  expect(fetch).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: /plot\.png/ }));
  expect(onOpenResource).toHaveBeenCalledOnce();
  expect(onOpenResource.mock.calls[0][0]).toMatchObject({
    path: '/home/user/plot.png', channel: 'cluster', origin: 'ai', typeHint: 'image',
  });
});
```

- [ ] **Step 2: Implement typed links without eager fetching**

```tsx
export function ResourceLink({ path, onOpen }: { path: string; onOpen: (resource: PreviewResource) => void }) {
  const type = detectFileType(path);
  const name = path.split('/').pop() || path;
  return (
    <button
      type="button"
      className="resource-link"
      onClick={() => onOpen({ path, name, channel: 'cluster', origin: 'ai', typeHint: type })}
      aria-label={`预览 ${name}`}
      title={path}
    >
      <ResourceTypeIcon type={type} />
      <span>{name}</span>
    </button>
  );
}
```

Use `Image`, `Table2`, `FileCode2`, and `File` from Lucide. `RichContentMessage` extracts, deduplicates, and renders at most five paths. Remove its `useEffect`, loading state, `RendererRegistry`, and `fetchFileContent` usage.

- [ ] **Step 3: Thread the callback through AI messages**

Add `onOpenResource?: (resource: PreviewResource) => void` to `AIChatProps` and the internal `MessageBubble` props. Pass it only to assistant-message `RichContentMessage`. Remove `extractOutputFiles`, the duplicate Detected Files block, and imports that become unused; download is available from the preview toolbar. Add a focused `AIChat.ui.test.tsx` assertion that the callback is forwarded for assistant links and not user-message paths.

- [ ] **Step 4: Verify no automatic preview**

Run: `npx vitest run src/components/rich-content/RichContentMessage.test.tsx src/components/AIChat.ui.test.tsx --pool threads --maxWorkers 1 --minWorkers 1 && npm run lint`

Expected: links render with no content request; exactly one preview callback occurs after a click.

```powershell
git add src/components/rich-content/ResourceLink.tsx src/components/rich-content/RichContentMessage.tsx src/components/rich-content/RichContentMessage.test.tsx src/components/AIChat.tsx src/components/AIChat.ui.test.tsx
git commit -m "feat: open AI resources through preview links"
```

---

### Task 8: Build the resource rail, queue, search, and panel

**Files:**
- Create: `src/components/resources/ResourceActivityRail.tsx`
- Create: `src/components/resources/ResourceActivityRail.test.tsx`
- Create: `src/components/resources/ResourcePanel.tsx`
- Create: `src/components/resources/ResourcePanel.test.tsx`
- Create: `src/components/resources/TransferQueuePanel.tsx`
- Create: `src/components/resources/TransferQueuePanel.test.tsx`
- Create: `src/components/resources/ResourceSearchPanel.tsx`
- Create: `src/components/resources/ResourceSearchPanel.test.tsx`
- Create: `src/components/resources/resources.css`

- [ ] **Step 1: Write failing rail tests**

Use the exact ordered views `preview`, `files`, `history`, `transfers`, `search`. Assert icon buttons have labels/tooltips, active state uses `aria-pressed`, failed transfers render a numeric badge, and keyboard activation calls `onSelect`.

```ts
export const RESOURCE_ITEMS = [
  ['preview', '预览', Eye],
  ['files', '文件', FolderTree],
  ['history', '历史', History],
  ['transfers', '传输', ArrowLeftRight],
  ['search', '搜索', Search],
] as const;
```

- [ ] **Step 2: Write failing transfer queue tests**

Mock `listTransfers`, socket `transfer:updated`, and `retryTransfer`. Assert initial restore, live replacement, failed badge summary, empty state, retry, pause/resume, and cancel.

- [ ] **Step 3: Implement `TransferQueuePanel`**

Reuse `TransferQueue` and `computeTransferSummary`; do not create a second task-row implementation. On mount call `listTransfers(sessionId)`, then subscribe/unsubscribe to socket updates. Keep server calls in `src/features/file-transfer/api.ts`.

- [ ] **Step 4: Write failing search tests and implement search**

Debounce by 250 ms, require two characters, abort or ignore stale responses, and call:

```ts
const result = await searchRemote(sessionId, '.', query.trim());
onOpenResource({
  path: entry.path,
  name: entry.name,
  channel: 'cluster',
  origin: 'search',
  size: entry.size,
  typeHint: detectFileType(entry.path),
});
```

Display a clear loading state, zero-results state, truncated-results notice, and retryable error.

- [ ] **Step 5: Compose `ResourcePanel`**

Render the rail and all view bodies in stable keyed containers. Preview uses `ResourcePreviewHost`; Files uses `FileManager`; History uses `ConversationList`; Transfers and Search use the new components. Only the selected body is visible/interactive. `ResourcePanel.test.tsx` switches through all five views and proves an uncontrolled value in the preview body survives view changes.

- [ ] **Step 6: Verify and commit**

Run: `npx vitest run src/components/resources --pool threads --maxWorkers 1 --minWorkers 1 && npm run lint`

```powershell
git add src/components/resources
git commit -m "feat: add unified resource activity panel"
```

---

### Task 9: Centralize application settings

**Files:**
- Create: `src/components/settings/SettingsCenter.tsx`
- Create: `src/components/settings/SettingsCenter.test.tsx`
- Create: `src/components/settings/settings.css`
- Modify: `src/components/Header.tsx`
- Create: `src/components/Header.test.tsx`
- Modify: `src/components/AIChat.tsx`
- Modify: `src/components/AIChat.ui.test.tsx`

- [ ] **Step 1: Write failing categorized-settings tests**

Assert these categories and controls:

| Category | Controls |
|---|---|
| Interface | system/light/dark segmented control; AI sidebar/drawer mode |
| AI Model | provider, model, API key, custom base URL |
| Terminal | follow app/light/dark segmented control |
| File Transfer | concurrency 1-4; optional bandwidth limit |
| Connection & Security | current host/user and credential-storage status, read-only |

Assert theme and UI controls call `saveUIPrefs`, AI save calls `saveAIProfile`, and transfer save calls `updateTransferSettings(sessionId, settings)` only when connected. Derive the read-only credential-storage label from runtime capability: Electron desktop reports system-encrypted profile storage; browser development mode reports browser development storage. Do not claim encrypted storage when `window.hpclawDesktop` is absent.

- [ ] **Step 2: Implement transactional form behavior**

Open with snapshots from `loadUIPrefs()` and `loadAIProfile()`. Cancel discards unsaved form edits. Save validates concurrency and bandwidth, persists all sections, dispatches existing change events, and closes only after the async transfer settings request succeeds. Never display stored passwords or host private keys.

- [ ] **Step 3: Simplify header commands**

Use Lucide icon buttons for AI, resources, theme, settings, and disconnect; retain the AI cluster-control toggle. At compact widths move secondary commands into one `Menu` button while keeping AI and resource toggles visible. Every icon has `aria-label` and `title`.

- [ ] **Step 4: Remove the duplicate AI settings state**

Replace the duplicated post-setup AI profile state with the existing `useAiProfile()` hook so `hpclaw-ai-profile-change` refreshes runtime requests. Add `onOpenSettings` to `AIChatProps`; the gear invokes it. Delete `showSettings`, `panelMode`, their settings markup, and their now-unused preference imports. Preserve the first-run API-key setup and save it through `setProfile` because the user cannot chat before configuration.

- [ ] **Step 5: Verify and commit**

Run: `npx vitest run src/components/settings/SettingsCenter.test.tsx src/components/Header.test.tsx src/components/AIChat.ui.test.tsx --pool threads --maxWorkers 1 --minWorkers 1 && npm run lint`

```powershell
git add src/components/settings src/components/Header.tsx src/components/Header.test.tsx src/components/AIChat.tsx
git commit -m "feat: centralize desktop settings"
```

---

### Task 10: Integrate file transfer with the shared preview and compact layout

**Files:**
- Modify: `src/features/file-transfer/controller.ts`
- Modify: `src/features/file-transfer/controller.test.ts`
- Modify: `src/features/file-transfer/TransferQueue.tsx`
- Modify: `src/features/file-transfer/TransferQueue.test.tsx`
- Modify: `src/features/file-transfer/FilePane.tsx`
- Modify: `src/features/file-transfer/FilePane.test.tsx`
- Modify: `src/features/file-transfer/LocalFilePane.tsx`
- Modify: `src/features/file-transfer/RemoteFilePane.tsx`
- Modify: `src/features/file-transfer/FileTransferWorkspace.tsx`
- Create: `src/features/file-transfer/FileTransferWorkspace.test.tsx`
- Modify: `src/features/file-transfer/FileTransferDrawer.tsx`
- Modify: `src/features/file-transfer/fileTransfer.css`

- [ ] **Step 1: Export and test summary reuse**

Rename `computeSummary` to exported `computeTransferSummary`. Preserve reducer behavior and add direct tests for queued/running, failed, completed, and zero-byte tasks.

- [ ] **Step 2: Add a compact queue variant**

```ts
export interface TransferQueueProps {
  tasks: TransferTask[];
  compact?: boolean;
  onPause: (task: TransferTask) => void;
  onResume: (task: TransferTask) => void;
  onCancel: (task: TransferTask) => void;
  onRetry: (task: TransferTask) => void;
}
```

In compact mode hide secondary timestamps and paths visually while retaining them in the row tooltip and accessible name.

- [ ] **Step 3: Replace local preview dialogs with preview descriptors**

Add `onPreview?: (resource: PreviewResource) => void` and `previewSessionId?: string` to `FilePaneProps`. `RemoteFilePane` passes its active session and `LocalFilePane` leaves it undefined. On file double-click/context preview call:

```ts
onPreview?.({
  path: entry.path,
  name: entry.name,
  channel: adapter.side === 'local' ? 'transfer-local' : 'transfer-remote',
  origin: 'transfer',
  sessionId: adapter.side === 'remote' ? previewSessionId : undefined,
  size: entry.size,
  typeHint: detectFileType(entry.path),
});
```

Delete `previewContent` state and the `FilePreview` modal from the workspace after tests prove local and remote descriptors.

- [ ] **Step 4: Implement compact file-transfer pane switching**

At widths below 900 px render a Local/Remote segmented control and show one pane at a time; keep both pane components mounted. Above 900 px show both. Keep host manager 180 px on wide screens and collapse it to a toolbar selector below 1100 px. Transfer queue remains visible below the file panes.

- [ ] **Step 5: Unify overlay behavior**

Make `FileTransferDrawer` render its content shell without creating a second portal/scrim when placed inside `DrawerHost`. Escape, maximization, and focus return must remain owned by `DrawerHost`.

- [ ] **Step 6: Verify and commit**

Run: `npx vitest run src/features/file-transfer --pool threads --maxWorkers 1 --minWorkers 1 && npm run lint`

```powershell
git add src/features/file-transfer
git commit -m "feat: unify responsive file transfer previews"
```

---

### Task 11: Compose the workbench in `App`

**Files:**
- Modify: `src/App.tsx`
- Create: `src/App.ui.test.tsx`
- Modify: `src/components/FileManager.tsx`

- [ ] **Step 1: Write the failing AI-link integration test**

Mock login state, terminal, socket, conversations, and file content. Render `App`, expose an assistant response containing `/home/user/report.tsv`, and assert:

1. no preview request occurs before click;
2. clicking `预览 report.tsv` selects the right `preview` view and opens the resource pane;
3. the table renderer appears after the request resolves;
4. expanding and collapsing does not issue a second request.

- [ ] **Step 2: Replace scattered panel state with preference-backed state**

Use one `UIPrefs` snapshot and one overlay union. Subscribe once to `UI_PREFS_CHANGE_EVENT`. Persist panel visibility, widths, active resource view, and preview mode. Keep conversation and terminal behavior unchanged.

```ts
const handleOpenResource = useCallback((resource: PreviewResource) => {
  preview.openPreview(resource);
  saveUIPrefs({ resourceOpen: true, activeResourceView: 'preview', previewMode: 'panel' });
  setActiveDock('right');
  setOverlay({ kind: 'none' });
}, [preview.openPreview]);
```

- [ ] **Step 3: Compose stable child elements**

Pass the same memoized AI, terminal, and resource React elements to `ResponsiveAppShell`. Set `leftPresentation` from `prefs.aiPanelMode`; in drawer mode or compact layout, opening AI selects the `ai` overlay without reparenting it. Compact resources use the `resources` overlay the same way. `FileManager.onFileSelect`, AI links, resource search, and file transfer all call `handleOpenResource`. Settings and file transfer render through `DrawerHost`. In workspace mode `DrawerHost` supplies only the scrim/focus boundary while the existing `ResourcePreviewHost` switches to its fixed workspace class, so the `PreviewSurface` DOM node stays identical.

- [ ] **Step 4: Add resize persistence**

Throttle splitter persistence to at most once per animation frame. Clamp with `clampWorkbenchWidths` on container resize and save final widths on pointer-up/keyboard change.

- [ ] **Step 5: Verify and commit**

Run: `npx vitest run src/App.ui.test.tsx --pool threads --maxWorkers 1 --minWorkers 1 && npm run lint`

```powershell
git add src/App.tsx src/App.ui.test.tsx src/components/FileManager.tsx
git commit -m "feat: compose responsive HPClaw workbench"
```

---

### Task 12: Apply the visual system across every screen

**Files:**
- Modify: `src/index.css`
- Modify: `src/components/LoginForm.tsx`
- Create: `src/components/LoginForm.test.tsx`
- Modify: `src/components/Header.tsx`
- Modify: `src/components/AIChat.tsx`
- Modify: `src/components/FileManager.tsx`
- Modify: `src/components/ConversationList.tsx`
- Modify: `src/components/Terminal.tsx`
- Create: `src/components/Terminal.theme.test.tsx`
- Modify: `src/components/TerminalAI.tsx`
- Modify: `src/features/file-transfer/fileTransfer.css`

- [ ] **Step 1: Define semantic tokens and remove remote font dependency**

```css
:root {
  color-scheme: light;
  --bg-app: #f4f6f8;
  --bg-surface: #ffffff;
  --bg-subtle: #eef1f4;
  --border: #d5dbe1;
  --text: #18212a;
  --text-muted: #5d6975;
  --accent: #087f8c;
  --accent-hover: #066b76;
  --success: #23845b;
  --warning: #b26a00;
  --danger: #c63f45;
  --terminal-bg: #101419;
}

:root[data-theme='dark'] {
  color-scheme: dark;
  --bg-app: #15191d;
  --bg-surface: #1c2227;
  --bg-subtle: #242b31;
  --border: #343d45;
  --text: #edf1f4;
  --text-muted: #9ca8b2;
  --accent: #31a9b5;
  --accent-hover: #51bbc5;
  --success: #4cb782;
  --warning: #d49a3a;
  --danger: #e06c72;
  --terminal-bg: #0e1114;
}
```

Use the local system stack `Inter, "Segoe UI", "Microsoft YaHei UI", sans-serif`; remove any Google Fonts import. Keep border radii at 4-8 px and letter spacing at zero.

- [ ] **Step 2: Add failing login and header layout tests**

Login tests cover connection grouping, optional TOTP reveal, visible validation/error region, loading lockout, and 760x600-safe structure. Header tests cover truncation of long `username@host:port`, command labels, and compact menu access.

- [ ] **Step 3: Restyle all surfaces with semantic classes**

Replace direct `scholar-*` colors in the touched screen components with semantic classes/tokens. Use a dense 44 px header, 32-36 px toolbars, 36 px inputs, 32 px table rows, 8/12/16 px spacing, and one-pixel separators. Do not introduce decorative cards, gradients, or large marketing headings.

- [ ] **Step 4: Apply independent terminal palettes**

```ts
const TERMINAL_THEMES = {
  dark: { background: '#0e1114', foreground: '#d7dde2', cursor: '#31a9b5', selectionBackground: '#31545a' },
  light: { background: '#fbfcfd', foreground: '#1c252d', cursor: '#087f8c', selectionBackground: '#b9dfe3' },
} as const;

useEffect(() => {
  if (terminalRef.current) terminalRef.current.options.theme = TERMINAL_THEMES[resolvedTerminalTheme];
}, [resolvedTerminalTheme]);
```

Theme changes must not recreate the xterm instance or SSH socket.

`Terminal.theme.test.tsx` mocks xterm once, changes `resolvedTerminalTheme`, and asserts the same terminal object receives new `options.theme` values without a second constructor call.

- [ ] **Step 5: Add consistent feedback states**

Use inline, actionable error blocks for login, preview, search, AI, and transfer failures; skeleton/spinner only inside the loading region; disabled buttons while saving; and focus-visible outlines on every interactive element. Confirm dialog text must state the affected resource or transfer.

- [ ] **Step 6: Verify and commit**

Run: `npx vitest run src/components/LoginForm.test.tsx src/components/Header.test.tsx src/components/Terminal.theme.test.tsx --pool threads --maxWorkers 1 --minWorkers 1 && npm run lint`

```powershell
git add src/index.css src/components/LoginForm.tsx src/components/LoginForm.test.tsx src/components/Header.tsx src/components/AIChat.tsx src/components/FileManager.tsx src/components/ConversationList.tsx src/components/Terminal.tsx src/components/Terminal.theme.test.tsx src/components/TerminalAI.tsx src/features/file-transfer/fileTransfer.css
git commit -m "style: apply responsive desktop visual system"
```

---

### Task 13: Permit compact Electron windows

**Files:**
- Create: `electron/window-options.cjs`
- Create: `electron/window-options.test.ts`
- Modify: `electron/main.cjs`

- [ ] **Step 1: Write the failing window-contract test**

```ts
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { MAIN_WINDOW_OPTIONS } = require('./window-options.cjs');

expect(MAIN_WINDOW_OPTIONS).toMatchObject({
  width: 1440,
  height: 920,
  minWidth: 760,
  minHeight: 600,
});
```

- [ ] **Step 2: Extract and use the options**

```js
// electron/window-options.cjs
const MAIN_WINDOW_OPTIONS = Object.freeze({
  width: 1440,
  height: 920,
  minWidth: 760,
  minHeight: 600,
  backgroundColor: '#15191d',
  show: false,
});
module.exports = { MAIN_WINDOW_OPTIONS };
```

Spread these options into `new BrowserWindow` before the existing `webPreferences`. Show the window on `ready-to-show`; retain current preload, isolation, backend, and security settings unchanged.

- [ ] **Step 3: Verify and commit**

Run: `npx vitest run electron/window-options.test.ts --pool threads --maxWorkers 1 --minWorkers 1 && npm run lint && npm run build:electron-server`

```powershell
git add electron/window-options.cjs electron/window-options.test.ts electron/main.cjs
git commit -m "feat: support compact desktop window sizes"
```

---

### Task 14: Full regression, visual QA, and packaged EXE handoff

**Files:**
- Modify only when a verification failure identifies a scoped defect.
- Produce: `release/HPClaw-0.0.0-x64.exe`
- Replace after validation: `HPClaw-x64/`

- [ ] **Step 1: Run the complete automated gate**

```powershell
npm run lint
npm test
npm run build
npm run build:electron-server
```

Expected: all commands exit 0. Record test counts and build artifact sizes in the implementation handoff.

- [ ] **Step 2: Run browser visual QA with the bundled browser skill**

Start the development server on an available localhost port. Capture and inspect light and dark screenshots at:

- 1920x1080 and 1440x900: three-column wide layout;
- 1366x768 and 1100x720: terminal plus one docked panel;
- 1024x700 and 760x600: full terminal plus overlay drawers.

For each viewport verify zero document-level horizontal scroll, no clipped labels, 520 px terminal minimum where applicable, keyboard focus visibility, and no overlap between header, panes, rail, dialogs, or transfer controls.

- [ ] **Step 3: Exercise the required interaction matrix**

1. Log in and confirm terminal connection survives theme and layout changes.
2. Open/close AI and each resource rail view.
3. Click an AI image link, table link, and text/code link; verify no automatic open before clicking.
4. Expand preview to the large workspace and collapse it; verify zoom/scroll/table state and no second network request.
5. Open settings, save each category, restart the renderer, and verify persistence.
6. Open file transfer at wide and compact sizes; switch Local/Remote, preview both source types, and operate pause/resume/retry/cancel.
7. Trigger login, preview, search, AI, and transfer errors and verify recovery actions.

- [ ] **Step 4: Build and smoke-test the portable application**

Run: `npm run electron:dist`

Use the Windows computer-control skill to launch `release/HPClaw-0.0.0-x64.exe`, resize to 760x600 and 1440x900, open settings and panels, and inspect the Electron/backend logs for uncaught errors.

- [ ] **Step 5: Stage the unpacked build without destructive deletion**

Resolve and verify all paths are inside `E:\0612hpclaw\0714`. Copy `release\win-unpacked` to a unique sibling staging directory, launch the staged EXE once, then rename the existing `HPClaw-x64` to a timestamped backup and atomically rename staging to `HPClaw-x64`. Do not recursively delete the existing target.

- [ ] **Step 6: Final clean-state audit**

Run:

```powershell
git status --short
git log --oneline -14
Get-Item release\HPClaw-0.0.0-x64.exe
Get-Item HPClaw-x64\HPClaw.exe
```

Expected: only pre-existing user changes remain unstaged; the portable EXE and unpacked target both exist; implementation commits are ordered task-by-task. Report the backup path, artifact paths, test results, and any residual risk.

---

## Acceptance Traceability

| Approved requirement | Implemented and verified by |
|---|---|
| Wide three-column, medium two-pane, compact drawers | Tasks 3, 4, 11, 14 |
| Draggable persisted widths | Tasks 1, 3, 11 |
| System/light/dark app theme and independent terminal theme | Tasks 2, 9, 12 |
| AI links open preview only after click | Tasks 7, 11, 14 |
| Image, table, code, and file preview | Tasks 5, 6, 10 |
| Panel and 88-92% sliding workspace without state loss | Tasks 4, 5, 6, 11 |
| Right Preview/Files/History/Transfers/Search rail | Task 8 |
| Central settings and preserved first-run AI setup | Tasks 7, 9 |
| Responsive file transfer | Tasks 8, 10, 14 |
| Login, dialogs, errors, and focus states | Tasks 4, 12, 14 |
| Rebuilt EXE under `HPClaw-x64` | Tasks 13, 14 |
