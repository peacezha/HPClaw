# Smart Completion & Toolbar Fix — Design Spec

Date: 2026-05-20

## Overview

Three related fixes for the HPClaw terminal AI experience:
1. Smart completion stop — don't suggest when command is already complete
2. Floating toolbar regression — re-enable AI action buttons on text selection
3. Process self-kill — prevent taskkill from terminating the Claude Code process itself

---

## 1. Smart Completion Stop

### Problem

Autocomplete triggers on any input >= 2 characters (TerminalAI.tsx:83). It never considers whether the command is "complete" — e.g., `ls -la` still shows ghost text and a dropdown suggesting the same command. Completing already-complete commands is noisy and confusing.

### Design

**Decision rule**: A command is "complete" when the context-aware grammar can no longer predict a valid next token.

The existing `parseLocalContext()` (commandIndex.ts:679) already classifies the cursor state into stages:

| Stage | Meaning | Action |
|-------|---------|--------|
| `command` | Typing the base command name | Show suggestions, Tab accepts |
| `subcommand` | Need a subcommand (e.g. after `samtools`) | Show suggestions, Tab accepts |
| `flag` + partial | Typing a flag prefix | Show suggestions, Tab accepts |
| `value` | A flag expects a value | Show suggestions, Tab accepts |
| `flag` + no partial (ends with space) | After a flag, nothing typed yet | **No dropdown**, Tab → shell |
| `unknown` | No grammar match for this command | **No dropdown**, Tab → shell |

**New function** `isCommandComplete(input: string): boolean`:
- Returns `true` when `suggestByContext()` returns empty AND there are no pending flag values
- Returns `false` when there are still valid next tokens to suggest

**Dedup**: If the top suggestion's completion text exactly equals the input buffer, remove it (don't suggest what the user already typed).

**Tab behavior change** (CommandSuggest.tsx:83-89):
- When `isCommandComplete`: do NOT install the keydown listener → Tab passes through to xterm for native shell completion
- When `!isCommandComplete`: current behavior unchanged (Tab accepts suggestion)

### Files changed

- `src/services/commandIndex.ts` — add `isCommandComplete()` export
- `src/components/TerminalAI.tsx` — call `isCommandComplete()` to gate `CommandSuggest` rendering; dedup top suggestion
- `src/components/CommandSuggest.tsx` — conditional Tab prevention based on completeness prop

---

## 2. Floating Toolbar Regression

### Problem

The `FloatingToolbar` component (floating "Send to AI" / "Analyze Error" buttons on text selection) stopped appearing. The component logic is intact; the root cause is CSS.

### Root cause

`FloatingToolbar.tsx:90` uses Tailwind classes `animate-in fade-in zoom-in-95`. These classes come from the `tailwindcss-animate` plugin for Tailwind v3. The project uses Tailwind v4 (`@import "tailwindcss"` in index.css:2), which does not include these utilities. The classes generate no CSS and produce no animation — but critically, in some Tailwind v3→v4 migration scenarios, unresolved animation classes can cause the element to render with computed opacity 0.

### Fix

Replace the broken Tailwind animation classes with `motion/react` (already a project dependency, used throughout App.tsx and AIChat.tsx).

**Before** (FloatingToolbar.tsx:88-94):
```tsx
<div
  ref={toolbarRef}
  className="absolute z-50 flex items-center gap-1 bg-scholar-800 border border-scholar-600 rounded-lg shadow-xl px-2 py-1.5 animate-in fade-in zoom-in-95"
  style={{ top, left }}
>
```

**After**:
```tsx
<motion.div
  ref={toolbarRef}
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.15 }}
  className="absolute z-50 flex items-center gap-1 bg-scholar-800 border border-scholar-600 rounded-lg shadow-xl px-2 py-1.5"
  style={{ top, left }}
>
```

Import `motion` from `motion/react` instead of using a plain `<div>`.

### Additional safeguard

Add null-check for `getSelectionPosition()` return value in Terminal.tsx:176 — xterm v5 may return `undefined` for the selection position in some edge cases (e.g. programmatic selection clear).

### Files changed

- `src/components/FloatingToolbar.tsx` — replace animation classes with motion/react; change root element from `<div>` to `<motion.div>`
- `src/components/Terminal.tsx` — add undefined guard for `getSelectionPosition()`

---

## 3. Process Self-Kill Prevention

### Problem

`.claude/settings.local.json` contains hardcoded PIDs in permission rules:
```
"Bash(taskkill //F //PID 42284)"
"Bash(taskkill //F //PID 31396)"
"Bash(taskkill //F //PID 39368)"
"Bash(taskkill //F //PID 33516)"
```

When Claude Code executes `taskkill` with a PID that matches its own process (or ancestor), it terminates itself mid-operation.

### Fix

Replace hardcoded-PID rules with imagename-based filtering or dynamic PID discovery:

```
"Bash(taskkill //F //FI \"IMAGENAME eq node.exe\" //FI \"WINDOWTITLE eq *tsx*server*\")"  
"Bash(for /f \"tokens=2\" %i in (' netstat -ano ^| findstr :3003 ') do @taskkill //F //PID %i 2>nul)"
```

Also ensure no PID in the list matches Claude Code's own PID range.

### Files changed

- `.claude/settings.local.json` — replace hardcoded PID rules with safer alternatives

---

## Verification

1. **Completion stop**: Type `ls -la` → no ghost text or dropdown appears. Type `bsub -` → flags dropdown appears. Press Tab on complete command → shell native completion works.
2. **Toolbar**: Select error text in terminal → floating toolbar appears near selection with "发送给 AI" and "分析报错" buttons. Click outside → toolbar dismisses.
3. **Self-kill**: Run `taskkill` commands via permissioned Bash → Claude Code does not terminate itself.
