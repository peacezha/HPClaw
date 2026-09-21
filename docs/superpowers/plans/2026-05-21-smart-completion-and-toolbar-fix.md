# Smart Completion & Toolbar Fix — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix three terminal AI issues: smart completion stop, floating toolbar regression, and process self-kill prevention.

**Architecture:** Three independent fixes touching commandIndex.ts (completion logic), TerminalAI.tsx/CommandSuggest.tsx (completion UI gating), FloatingToolbar.tsx (CSS fix), Terminal.tsx (null guard), and settings.local.json (PID fix). No new files created.

**Tech Stack:** React 19, TypeScript, xterm 5.3, motion/react 12, Tailwind CSS v4

**Note:** Project has no git repository. Skip commit steps.

---

### Task 1: Fix Self-Kill — Replace Hardcoded PIDs in settings.local.json

**Files:**
- Modify: `.claude/settings.local.json`

- [ ] **Step 1: Replace hardcoded PID rules with imagename-based filtering**

Replace each `"Bash(taskkill //F //PID <number>)"` line in the `permissions.allow` array with a safer filter-based alternative:

```
"Bash(taskkill //F //FI \"IMAGENAME eq node.exe\" //FI \"WINDOWTITLE eq *tsx*server*\")"
```

Also replace `"Bash(taskkill //F //PID 42284)"`, `"Bash(taskkill //F //PID 31396)"`, `"Bash(taskkill //F //PID 39368)"`, `"Bash(taskkill //F //PID 33516)"` — remove all hardcoded PID entries. If the user needs to kill a specific port, use:

```
"Bash(for /f \"tokens=5\" %a in ('netstat -ano ^| findstr :3003') do @taskkill //F //PID %a 2>nul)"
```

**Rationale:** `//FI "IMAGENAME eq node.exe"` filters by process name, `//FI "WINDOWTITLE eq *tsx*server*"` further filters to server windows only. The port-based variant uses `netstat` to dynamically discover which PID is listening on port 3003, avoiding stale PIDs.

---

### Task 2: Add `isCommandComplete()` to commandIndex.ts

**Files:**
- Modify: `src/services/commandIndex.ts`

- [ ] **Step 1: Add the `isCommandComplete()` function at end of file (after line 769)**

```typescript
/**
 * Returns true when the command line is complete — no valid next token
 * can be predicted by the grammar. A complete command has:
 * - A recognized base command with grammar
 * - All required subcommands/flags/values are satisfied
 * - No pending value expected for the last flag
 * - OR the command has no grammar at all (unknown command → let shell handle it)
 *
 * When complete: Tab passes through to terminal for native shell completion.
 * When incomplete: Tab accepts the AI suggestion.
 */
export function isCommandComplete(input: string): boolean {
  const ctx = parseLocalContext(input);
  // No grammar for this command → let shell handle Tab
  if (!ctx.cmd || !GRAMMAR[ctx.cmd]) return true;
  // Still typing subcommand name
  if (ctx.stage === "subcommand") return false;
  // Flag with active partial (user is typing a flag)
  if (ctx.stage === "flag" && ctx.partial) return false;
  // Expecting a value for a flag
  if (ctx.stage === "value") return false;
  // Basic command name being typed
  if (ctx.stage === "command") return false;
  // flag with no partial (trailing space), unknown → complete
  return true;
}
```

- [ ] **Step 2: Verify the function compiles**

Run: `npx tsc --noEmit src/services/commandIndex.ts`

---

### Task 3: Gate Suggestions on Completeness in TerminalAI.tsx

**Files:**
- Modify: `src/components/TerminalAI.tsx`

- [ ] **Step 1: Add import for isCommandComplete (line 6)**

Change the import from `'../services/aiTerminal'` to also import from commandIndex:

```typescript
import { requestAutocomplete, cancelAutocomplete, Suggestion } from '../services/aiTerminal';
import { isCommandComplete } from '../services/commandIndex';
```

- [ ] **Step 2: Add `commandComplete` state and update it in handleCommandInput**

After the `cursorPixel` state (line 35), add:

```typescript
const [commandComplete, setCommandComplete] = useState(false);
```

In `handleCommandInput` (line 45), after triggering autocomplete, add the completeness check. Inside the callback, after line 89 (`requestAutocomplete(...)`):

```typescript
// Check completeness after autocomplete trigger
setCommandComplete(isCommandComplete(next));
```

Also update the Enter/escape reset paths (lines 51-54 and 54-57) to also reset `commandComplete`:

At line 53, after `setSuggestions([]);`, add:
```typescript
setCommandComplete(false);
```

At line 59, after `setSuggestions([]);`, add:
```typescript
setCommandComplete(false);
```

At line 67 (tab check), add a reset:
Actually, let me be more precise. The key change is:

1. After `setCommandComplete(isCommandComplete(next));` is added — also add dedup logic: when suggestions come back from local/AI, filter out any suggestion whose `completion` exactly equals the current buffer:

In the `requestAutocomplete` call (line 85-89), wrap the `onSuggestions` callback:

```typescript
requestAutocomplete(
  next,
  (sugs) => {
    const filtered = sugs.filter(s => s.completion !== next);
    setSuggestions(filtered);
  },
  () => setSuggestions([]),
);
```

And in the enter (line 50-54) and escape reset (line 57-60) paths, also reset `commandComplete`:

After `setSuggestions([])` at line 52, add: `setCommandComplete(false);`
After `setSuggestions([])` at line 59, add: `setCommandComplete(false);`

- [ ] **Step 3: Pass `commandComplete` to CommandSuggest**

At the CommandSuggest render (line 219-228), add the prop:

```typescript
<CommandSuggest
  suggestions={suggestions}
  cursorPixelX={cursorPixel.x}
  cursorPixelY={cursorPixel.y}
  lineHeight={lineHeight}
  charWidth={charWidth}
  containerRef={containerRef}
  onAccept={handleAcceptSuggestion}
  onDismiss={handleDismissSuggestions}
  commandComplete={commandComplete}
/>
```

---

### Task 4: Update CommandSuggest for Conditional Tab Behavior

**Files:**
- Modify: `src/components/CommandSuggest.tsx`

- [ ] **Step 1: Add `commandComplete` to the props interface (line 3-13)**

```typescript
interface CommandSuggestProps {
  suggestions: Suggestion[];
  cursorPixelX: number;
  cursorPixelY: number;
  lineHeight: number;
  charWidth: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onAccept: (completion: string) => void;
  onDismiss: () => void;
  commandComplete?: boolean; // NEW
}
```

- [ ] **Step 2: Destructure the new prop (line 15-24)**

```typescript
export default function CommandSuggest({
  suggestions,
  cursorPixelX,
  cursorPixelY,
  lineHeight,
  charWidth,
  containerRef,
  onAccept,
  onDismiss,
  commandComplete = false,  // NEW
}: CommandSuggestProps) {
```

- [ ] **Step 3: Don't render when command is complete (after line 129)**

Change line 129 from:
```typescript
if (suggestions.length === 0) return null;
```

To:
```typescript
if (suggestions.length === 0 || commandComplete) return null;
```

- [ ] **Step 4: Skip Tab preventDefault when command is complete (line 82-89)**

Change the Tab handler:
```typescript
if (e.key === 'Tab') {
  if (commandComplete) return; // Let Tab pass through to shell
  e.preventDefault();
  e.stopPropagation();
  if (suggestions[activeIndex]) {
    onAccept(suggestions[activeIndex].completion);
  }
  return;
}
```

---

### Task 5: Fix FloatingToolbar — Replace Broken CSS with motion/react

**Files:**
- Modify: `src/components/FloatingToolbar.tsx`

- [ ] **Step 1: Add motion import (line 1)**

```typescript
import { useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, Send } from 'lucide-react';
```

- [ ] **Step 2: Convert root div to motion.div (lines 85-113)**

Replace:
```tsx
if (!visible || !selectedText) return null;

return (
  <div
    ref={toolbarRef}
    className="absolute z-50 flex items-center gap-1 bg-scholar-800 border border-scholar-600 rounded-lg shadow-xl px-2 py-1.5 animate-in fade-in zoom-in-95"
    style={{
      top: `${position.top}px`,
      left: `${position.left}px`,
    }}
  >
```

With:
```tsx
if (!visible || !selectedText) return null;

return (
  <motion.div
    ref={toolbarRef}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.15 }}
    className="absolute z-50 flex items-center gap-1 bg-scholar-800 border border-scholar-600 rounded-lg shadow-xl px-2 py-1.5"
    style={{
      top: `${position.top}px`,
      left: `${position.left}px`,
    }}
  >
```

And change the closing `</div>` to `</motion.div>`.

---

### Task 6: Add null guard for getSelectionPosition in Terminal.tsx

**Files:**
- Modify: `src/components/Terminal.tsx`

- [ ] **Step 1: Guard getSelectionPosition return value (lines 173-183)**

Replace:
```typescript
term.onSelectionChange(() => {
  if (onTerminalSelection) {
    const sel = term.getSelection();
    const pos = term.getSelectionPosition();
    onTerminalSelection(
      sel || '',
      pos?.end?.x ?? 0,
      pos?.end?.y ?? 0,
    );
  }
});
```

With:
```typescript
term.onSelectionChange(() => {
  if (onTerminalSelection) {
    const sel = term.getSelection();
    const pos = term.getSelectionPosition();
    if (!pos || !pos.end) {
      onTerminalSelection(sel || '', 0, 0);
    } else {
      onTerminalSelection(sel || '', pos.end.x, pos.end.y);
    }
  }
});
```

---

### Task 7: Build and Verify

- [ ] **Step 1: Type check the project**

Run: `npx tsc --noEmit`
Expected: No type errors.

- [ ] **Step 2: Build the frontend**

Run: `npx vite build`
Expected: Build succeeds.

- [ ] **Step 3: Manual verification checklist**

1. **Completion stop**: Type `ls -la` in terminal → no ghost text, no dropdown. Type `bsub -q ` → dropdown with queue names appears. Type `samtools ` → subcommand suggestions appear.
2. **Tab passthrough**: On a complete command, press Tab → shell native completion works (not intercepted by CommandSuggest).
3. **Toolbar**: Select text in terminal → floating toolbar appears with "发送给 AI" and "分析报错" buttons. Click outside → dismisses.
4. **Self-kill**: Verify `.claude/settings.local.json` no longer contains hardcoded PIDs.
