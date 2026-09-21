# Terminal AI Enhancement Design

**Date:** 2026-05-19
**Status:** Approved
**Project:** HPClaw — AI-Powered HPC Cluster Terminal

## Overview

Enhance the cluster terminal with two AI-powered features:

1. **Command autocomplete** — Real-time AI suggestions for complex Linux commands (find, grep, sed, awk) with ghost text + dropdown with explanations
2. **One-click error analysis** — Select terminal output, send to AI via floating toolbar, receive fix suggestions

## Architecture

### Approach: Hybrid (React overlays + xterm integration)

- Ghost text rendered as a React overlay div positioned at estimated cursor coordinates — avoids writing to the remote SSH terminal stream
- Dropdown and floating toolbar also as React overlays for rich interaction
- Cursor position estimated from terminal metrics (rows/cols, font size) and user input tracking
- Shared state via React context, AI calls through existing API proxy pattern
- Command buffer tracked client-side by intercepting socket emit calls for user-typed characters since last Enter

### Component Tree

```
App.tsx
├── TerminalAI.tsx          ← NEW: Wraps Terminal + AI features
│   ├── Terminal.tsx        (existing, enhanced with command buffer tracking)
│   ├── CommandSuggest.tsx  ← NEW: Ghost text overlay + Dropdown
│   └── FloatingToolbar.tsx ← NEW: Appears on terminal text selection
├── AIChat.tsx              (existing, receives error analysis context)
└── ...
```

### New Components

| Component | Responsibility |
|-----------|---------------|
| `TerminalAI.tsx` | Thin wrapper. Manages command buffer (intercepts socket emits to track chars since last Enter), cursor position estimate (inferred from terminal rows/cols and input stream), selection content. Bridges between Terminal events and AI overlays. Reuses existing AI config from AIChat context. |
| `CommandSuggest.tsx` | Double-mode autocomplete. Ghost text as CSS overlay (dimmed, positioned near cursor line). Below it, Tailwind-styled dropdown with up to 5 alternatives, each with explanation. |
| `FloatingToolbar.tsx` | Appears when text selected in terminal. "发送给 AI" and "分析报错" buttons. Anchors near selection, auto-adjusts direction if near viewport edge. |

### Server Additions

| Endpoint | Purpose |
|----------|---------|
| `POST /api/ai/autocomplete` | Lightweight, non-streaming, <2s timeout. Receives command prefix + cwd + skill context. Returns ranked suggestions with explanations. |
| `POST /api/ai/analyze-output` | Receives selected terminal output. Returns diagnosis + fix suggestion. Can stream into AIChat or return inline. |

## Data Flow

### Flow 1: Command Autocomplete

1. User types in terminal → `term.onData()` captures input → updates `commandBuffer` in TerminalAI state
2. Debounced 300ms → `POST /api/ai/autocomplete` with `{ command, cwd, skillContext }`
3. AI returns `[{ completion, explanation }, ...]` (up to 5 items)
4. CommandSuggest renders:
   - Ghost text (dimmed) at cursor position showing top completion
   - Dropdown below with all suggestions, each showing command + explanation
5. Tab → accepts ghost text, sends to terminal; ←→↑↓ → navigate; Enter → select; Esc → dismiss
6. Esc or unmatching keystroke → clears all suggestions

**AI Prompt Design** (autocomplete):
```
System: You are a Linux command autocomplete engine. Given a partial command, suggest up to 5 completions. For each, provide a short Chinese explanation (≤30 chars). Focus on find, grep, sed, awk, and HPC cluster commands (bsub, bjobs, module, etc.). Return JSON only.
User: Command: {command} | CWD: {cwd} | Recent commands: {history}
```

### Flow 2: Error Analysis

1. User selects terminal text → xterm fires `onSelectionChange` → TerminalAI detects non-empty
2. After 200ms debounce → FloatingToolbar appears near selection end
3. User clicks "分析报错" → AIChat receives pre-formatted message:
   ```
   [System] 用户遇到了以下终端报错，请分析原因并给出修复建议：
   {selected_text}
   上下文：HPC 集群终端，当前目录 {cwd}
   ```
4. If AI chat sidebar is closed, auto-opens it
5. AI streams response → user sees diagnosis + fix in AIChat sidebar

### Key Timing

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Autocomplete debounce | 300ms | Balance responsiveness with API efficiency |
| Autocomplete API timeout | 2s | Fail silently — don't block typing |
| Min command length | 3 chars | Skip autocomplete for "ls", "cd", etc. |
| Suggestion cache | Per command prefix | Same prefix → reuse cached result |
| Floating toolbar delay | 200ms | Debounce selection events, prevent jitter |
| Rate limit | 20 req/min per session | Prevent API abuse |
| Max command input | 500 chars | Autocomplete input cap |
| Max selected output | 5000 chars | Analysis input cap (truncate with note) |

## Error Handling & Edge Cases

### Autocomplete

- **API timeout/network error**: Fail silently. No ghost text, no dropdown, no error message. Log to console.
- **Rapid typing**: Debounce + AbortController. Only last typed command's suggestion renders.
- **Empty suggestions**: Simply don't render. No "no suggestions" UI.
- **Terminal resize**: Close dropdown, clear ghost text. Recalculate on next input.
- **Mid-command editing** (arrow keys, Home): Cancel current suggestions. Re-trigger on next keystroke.
- **Pasted commands** (>200 chars or multi-line): Skip autocomplete entirely.

### FloatingToolbar

- **Huge selections** (>5000 chars): Truncate to 5000 + "...[truncated]".
- **Selection cleared**: Fade out toolbar (150ms). Don't keep stale toolbar.
- **Toolbar near viewport edge**: Auto-flip position above/below selection.
- **AI chat not open**: Auto-opens sidebar when "分析报错" clicked.
- **Socket disconnected**: Both features degrade gracefully. Terminal remains fully functional.

### Server Safeguards

- Rate limiting: 20 req/min per session
- Request size caps enforced server-side
- API key required in session
- Autocomplete uses isolated system prompt (no chat context leakage)

## Testing

### Manual Verification Checklist

1. Type "find . -name" → ghost text + dropdown appear → Tab to accept
2. Arrow keys navigate dropdown → Enter selects
3. Esc dismisses all suggestions
4. "ls" → no suggestions (<3 chars)
5. Select error text → toolbar appears → click "分析报错" → AI chat opens with analysis
6. Click outside → toolbar dismisses. Re-select → toolbar reappears.
7. Resize window while dropdown open → artifacts cleared
8. Kill SSH → terminal functional, autocomplete silently stops
9. Regression: verify existing features (terminal I/O, file manager, AI chat, conversations) all work

### Why Not Automated Tests

- xterm.js is canvas/DOM hybrid — headless test support is fragile
- SSH terminal state depends on live cluster connection
- AI responses are non-deterministic
- Manual checklist covers all critical paths

### Pre-Merge Gate

- [ ] Normal terminal I/O works
- [ ] Existing features regression-free
- [ ] Autocomplete: trigger, navigate, accept, dismiss
- [ ] Error analysis: select, toolbar, send, see response
- [ ] Edge cases: resize, disconnect, empty selection, rapid typing
- [ ] No console errors
- [ ] No server crashes

## Files Changed

| File | Change |
|------|--------|
| `src/components/Terminal.tsx` | Add command buffer tracking, selection change events, expose via callbacks |
| `src/components/TerminalAI.tsx` | **NEW** — Wrapper component, shared AI state |
| `src/components/CommandSuggest.tsx` | **NEW** — Ghost text + dropdown overlay |
| `src/components/FloatingToolbar.tsx` | **NEW** — Selection toolbar |
| `src/services/aiTerminal.ts` | **NEW** — AITerminalService (debounce, cache, API calls) |
| `src/App.tsx` | Wire TerminalAI instead of Terminal, pass AI config |
| `server.ts` | Add `/api/ai/autocomplete`, `/api/ai/analyze-output` endpoints |
