# HPClaw Responsive Desktop UI Design

## Status

Approved in the design review on 2026-07-16.

## Goal

Rework the HPClaw Electron renderer into a responsive, professional HPC workstation UI while preserving the existing terminal, AI, file management, transfer, authentication, and backend behavior.

The application must support frequent parallel use of the terminal, AI assistant, and file resources. It must remain usable from compact windows through high-resolution full-screen displays, add application and terminal theme controls, and deliver a freshly packaged Windows executable under `E:\0612hpclaw\0714\HPClaw-x64`.

## Confirmed Product Decisions

- The implementation approach is a responsive workbench refactor, not a CSS-only cleanup or a full product rewrite.
- The full UI is in scope: login, main workbench, AI, resource panels, settings, file transfer workspace, previews, dialogs, loading states, empty states, and errors.
- Wide windows use an AI / terminal / resource three-column workbench.
- The right resource area uses a vertical activity rail for preview, files, history, transfers, and search.
- Compact windows keep the terminal as the main surface and open AI or resources as overlay drawers.
- Medium windows keep the terminal plus one docked side panel at a time.
- Panel widths and open states are adjustable and persisted.
- The AI panel remembers its last state; it is expanded on first use.
- Information density is balanced rather than maximally compact or spacious.
- The visual language is a modern professional workstation while retaining HPClaw identity and technical character.
- The application provides light, dark, and system theme modes. System mode is the default, manual overrides persist, and system changes are observed while system mode is active.
- The terminal theme is independent: light, dark, or follow application theme.
- AI responses expose compact file, image, and table resource links. The application does not open a preview merely because a response contains a link.
- Clicking an AI resource link opens the corresponding preview in the right resource area and selects the appropriate renderer.
- A preview can expand from the side panel into a large right-sliding workspace without reloading the content.

## Current System Context

HPClaw currently uses React 19, Vite, Tailwind CSS 4, Electron, Express, Socket.IO, xterm, Lucide icons, and Motion. The main renderer composition is concentrated in `src/App.tsx`. It currently combines a fixed 420 px AI sidebar, a central terminal, a fixed 340 px files/history sidebar, an AI drawer, and a separate file-transfer drawer.

The repository already contains useful preview infrastructure:

- `RichContentMessage` extracts resource paths from AI output.
- `ContentFetcher` reads remote content through existing APIs.
- `RendererRegistry` selects image, table, code, FASTA, log, and generic renderers.
- `FilePreview` and the file-transfer feature provide local and remote preview paths.
- `uiPrefs` persists the existing AI panel mode.

The redesign reuses these capabilities. It does not replace SSH, terminal, AI, transfer, or file APIs.

## Scope

### Included

- Responsive application shell and resize constraints.
- Persisted panel size, visibility, active resource view, theme, terminal theme, and preview mode preferences.
- Vertical resource activity rail.
- Shared preview controller and preview surface.
- AI resource links that open the shared preview.
- Side-panel and sliding-workspace preview modes.
- Light and dark application themes plus independent terminal themes.
- Unified settings center.
- Layout and styling updates for every visible application surface.
- Focus, keyboard, loading, empty, error, and confirmation states.
- Automated responsive, component, integration, build, and packaging verification.
- A rebuilt Electron deliverable copied into `E:\0612hpclaw\0714\HPClaw-x64` without modifying its existing backup directory.

### Excluded

- New SSH, transfer, AI provider, or cluster-management capabilities unrelated to the UI.
- Changes to server authentication semantics or credential storage.
- Automatic preview popups when an AI response completes.
- Unbounded whole-file loading for large files.
- Concurrent display of multiple modal workspaces.
- A new third-party design system or a rewrite of the renderer in another framework.

## Responsive Workbench

Responsive behavior is based on available application content width rather than monitor model.

### Wide State

At 1440 px and above, the default layout contains:

1. AI assistant on the left, initially about 28% wide and constrained to 300-520 px.
2. Terminal in the center, with a minimum useful width of 520 px.
3. Resource area on the right, initially about 27-31% wide and constrained to 300-520 px.

Two keyboard-accessible splitters allow the user to resize the panels. Dragging clamps dimensions to safe minimums and maximums. Double-clicking a splitter restores the default proportions.

### Medium State

Between 1100 and 1439 px, the terminal remains visible and one side panel may be docked. AI and resources are mutually exclusive in the docked slot. Switching panels preserves the hidden component's application state and the user's stored wide-screen widths.

### Compact State

Below 1100 px, the terminal fills the content area. AI and resources open as overlay drawers. The drawer supports close button, `Escape`, and scrim close, restores focus to the launcher, and does not unmount terminal, AI, or transfer state.

The thresholds are design defaults. During implementation they may move slightly if browser and Electron measurements show that a minimum-width contract cannot be met, but all tested target widths must retain the stated wide, medium, and compact behavior.

## Resource Activity Rail

The right work area uses a narrow vertical activity rail with Lucide icons and tooltips for:

- Preview.
- Remote files.
- Conversation history.
- Transfer queue.
- Search.

Only one resource view is active at a time. The rail displays semantic badges for active transfers, failed work, and search activity. Text labels remain available through tooltips and accessibility names; the content header includes the active view's literal title.

The full dual-pane file-transfer workspace remains a large sliding workspace because host management, two file panes, and the persistent transfer queue require more width than a normal resource panel.

## AI-Linked Preview Experience

`RichContentMessage` changes from eagerly embedding fetched preview cards to rendering compact resource links. Each link contains the detected type icon, file name, optional size or availability, and an open affordance.

When the user clicks a resource link:

1. The link calls `openPreview` with a stable resource descriptor containing path, source, and detected type hint.
2. The resource activity rail opens and activates Preview.
3. The preview surface immediately renders a loading skeleton.
4. Any older in-flight preview request is aborted.
5. Existing file-read APIs fetch bounded content and metadata.
6. `RendererRegistry` selects the image, table, text, code, FASTA, log, or generic renderer.
7. The result appears in the right panel.

The application never opens the preview automatically on AI response completion. This prevents unsolicited layout changes while the user is typing or watching terminal output.

### Preview Modes

The preview has two presentation modes that share one resource and one loaded result:

- **Panel mode:** used for quick inspection beside the terminal and AI conversation.
- **Workspace mode:** a right-sliding surface covering about 88-92% of the content area for large images, wide tables, long text, code, and detailed file inspection.

Expanding or collapsing moves the same `PreviewSurface` between containers. It preserves image zoom, table selection, scroll position, and the active resource. It must not repeat the file request solely because the presentation mode changed.

## Component Architecture

### `ResponsiveAppShell`

Owns wide, medium, and compact layout composition. It receives panel content as children and does not own terminal, AI, or file business state.

### `ResizablePane` and Splitters

Provide pointer and keyboard resizing, safe dimension clamps, default-size restoration, and accessible separator semantics. Splitter behavior is isolated from individual panel implementations.

### `ResourceActivityRail`

Selects preview, files, history, transfers, or search and renders status badges. It is usable in a docked resource panel and an overlay resource drawer.

### `ResourcePreviewController`

Owns the preview resource descriptor, loading result, request cancellation, renderer type, error, and panel/workspace presentation mode. It exposes a small `openPreview`, `closePreview`, `expandPreview`, and `collapsePreview` contract to AI and file feature callers.

### `PreviewSurface`

Renders loading, success, unsupported, and error states through `RendererRegistry`. It is presentation-mode agnostic and is shared by the panel and sliding workspace.

### `DrawerHost`

Coordinates overlay drawers and large workspaces so AI, preview, and file transfer do not create competing scrims, `Escape` handlers, focus traps, or z-index layers. Only the top overlay responds to dismiss actions.

### `ThemeController`

Resolves `system`, `light`, or `dark`, listens for Windows theme changes when appropriate, sets a root data attribute, and provides the resolved theme to the terminal theme adapter.

### `UIPreferencesStore`

Extends the existing `uiPrefs` service with a versioned schema. It persists:

- Application theme preference.
- Terminal theme preference.
- AI panel mode and open state.
- Wide-screen panel widths.
- Active resource view and resource panel state.
- Last preview presentation mode.

Corrupt or outdated data is migrated or replaced with safe defaults.

## Visual System

The application uses semantic CSS custom properties as the source of truth for surfaces, text, borders, focus, accent, success, warning, and error colors. Existing Tailwind utility usage may remain, but scholar palette utilities used by edited components must resolve through semantic tokens rather than fixed dark-only colors.

### Color

- Light mode uses white and cool neutral-gray surfaces.
- Dark mode uses neutral graphite surfaces rather than a blue-only palette.
- Cyan/teal is reserved for selection, focus, links, and primary interaction.
- Green, amber, and red communicate success, warning, and failure with accompanying icons or text.
- Terminal palettes are separate from application surface tokens.

### Density and Sizing

- Application toolbar: approximately 44 px.
- Panel headers: approximately 36 px.
- Inputs and command buttons: 32-36 px.
- Icon buttons have stable square dimensions.
- Content spacing uses an 8-12 px rhythm.
- Fixed-format boards, tables, toolbars, splitters, and activity rails have stable constraints so hover, badges, and loading states do not shift layout.

### Typography and Controls

The UI uses the Windows/system sans-serif stack. Paths, commands, code, and terminal content use a monospace stack. Letter spacing remains zero.

Lucide icons are used for familiar commands. Tooltips and accessible names describe icon-only controls. Segmented controls represent theme or panel modes, switches represent binary settings, and color swatches represent terminal palettes. Panels and controls use restrained radii no greater than 8 px.

## Screen-Specific Design

### Login

The first screen remains the actual cluster connection form. HPClaw is clearly branded, while connection fields are grouped into host/port, username/password, and progressively disclosed optional TOTP settings. Authentication errors appear beside the form, and host-fingerprint confirmation remains a separate explicit trust step. Narrow windows switch to a single-column form.

### Main Header

The header shows HPClaw, current cluster identity, connection status, theme control, settings, panel launchers, and logout. Low-frequency actions move into menus when width is limited. Command buttons use icons and tooltips rather than long labels.

### AI

AI conversation, toolbar, settings access, message list, streaming state, and composer follow the shared spacing and theme system. Global settings no longer live inside the conversation flow. AI resource links use the shared preview controller.

### Settings Center

Settings use category navigation for Interface, AI Model, Terminal, File Transfer, and Connection/Security. The content area uses proper switches, segmented controls, menus, and color swatches. Save feedback is explicit, and settings that apply immediately do so without closing the surface.

### File Transfer

The sliding workspace has a stable header, host manager, local pane, remote pane, and bottom transfer queue. Pane splitters remain usable at supported widths. At smaller widths, low-priority metadata columns hide before controls or names overflow. The queue remains visible and resizable.

### Dialogs and Feedback

Dialogs use one focus and layering model. Destructive actions show specific impact. Loading uses stable skeletons; empty states state the next available action; errors retain the actionable cause and a retry path; short-lived confirmations use nonblocking status notifications.

## Error Handling

- A preview opens its skeleton before network work begins.
- Opening another resource aborts the old request and ignores stale completion.
- Missing, moved, inaccessible, disconnected, too-large, and unsupported resources produce distinct preview states.
- A preview failure remains local to the preview surface and does not replace the AI conversation or terminal.
- Recovery actions include retry, copy path, open containing folder, or download when supported.
- Image and table previews enforce bounded content limits; oversized resources show metadata and an explicit load or download action.
- Theme and preference failures fall back to defaults without blocking startup.
- Splitters clamp values and recover from impossible persisted dimensions.
- Drawer dismissal operates only on the top overlay and restores focus to its launcher.

## Testing Strategy

### Unit Tests

- Theme resolution, system-theme changes, and terminal-theme independence.
- Preference schema migration, corrupt storage fallback, and persisted layout restoration.
- Panel dimension clamping and responsive mode selection.
- AI resource extraction, link rendering, type hints, and duplicate suppression.
- Preview controller loading, cancellation, stale-response rejection, errors, and mode changes.
- Renderer selection for images, tables, text, code, logs, bioinformatics files, and unsupported files.

### Component Tests

- Clicking an AI resource link opens the resource area and activates Preview.
- Image, table, and text links select the correct preview renderer.
- Switching links aborts the previous request.
- Expanding and collapsing keeps the loaded resource and interaction state.
- Activity-rail selection, badges, tooltips, and keyboard navigation.
- Splitter pointer and keyboard behavior.
- Settings theme and terminal-theme controls.
- Drawer `Escape`, scrim, focus restoration, and top-layer behavior.

### Integration and Responsive Tests

- Login, settings save, terminal, AI, files, transfer queue, preview, and error recovery workflows.
- Target widths include 1920, 1440, 1366, 1100, 1024, and a narrower supported compact width.
- At each target, verify no incoherent overlap, unexpected horizontal page scroll, clipped control labels, or unreachable actions.
- Light and dark screenshots verify contrast, hierarchy, and stable geometry.
- Terminal and transfer state remain alive while panels collapse or previews expand.

### Build and Desktop Verification

- Run TypeScript checks and the full Vitest suite.
- Build the Vite renderer and Electron backend bundle.
- Package the Windows portable application.
- Launch the packaged executable and verify login, theme persistence, responsive panel behavior, AI-linked preview, preview expansion, settings, file-transfer workspace, and clean shutdown.

Automated and manual checks use fixtures or authorized test data; real cluster credentials are not embedded in tests or documentation.

## Acceptance Criteria

1. Every visible surface supports light and dark application themes with readable contrast.
2. Terminal theme selection is independent and persisted.
3. Wide, medium, and compact workbench states behave as specified without overlap or inaccessible controls.
4. User panel widths and open states restore after restart and recover safely on smaller windows.
5. Clicking a resource link in an AI reply opens the matching right-side preview; merely receiving the reply does not.
6. Image, table, text, code, log, and supported bioinformatics resources use the correct renderer.
7. Side-panel and sliding-workspace modes share loaded content and preserve interaction state.
8. Terminal, AI conversation, and active transfers remain mounted and connected across layout and overlay changes.
9. Login, settings, resource views, file transfer, dialogs, and feedback states use the shared visual and interaction rules.
10. TypeScript, tests, production builds, Electron packaging, responsive screenshots, and packaged-EXE smoke checks pass.
11. The final rebuilt application is available under `E:\0612hpclaw\0714\HPClaw-x64`, while the existing backup directory and unrelated user changes remain untouched.
