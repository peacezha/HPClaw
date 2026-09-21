# Terminal AI Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add AI-powered command autocomplete (ghost text + dropdown with explanations) and one-click error analysis (floating toolbar on text selection) to the HPC cluster terminal.

**Architecture:** Hybrid approach — ghost text/dropdown/toolbar as React overlays positioned over xterm.js terminal. Command buffer tracked client-side by intercepting socket emits. AI calls through new server proxy endpoints (`/api/ai/autocomplete`, `/api/ai/analyze-output`). AI config read from localStorage (same keys AIChat uses). Cursor position estimated from xterm buffer metrics.

**Tech Stack:** React 19 + TypeScript + xterm.js 5.x + Socket.IO + Express + Tailwind CSS v4

---

### Task 1: Create AI Terminal Service

**Files:**
- Create: `src/services/aiTerminal.ts`

This service handles debounced autocomplete API calls, caching, and error analysis.

- [ ] **Step 1: Create the service file**

```typescript
// src/services/aiTerminal.ts

export interface Suggestion {
  completion: string;
  explanation: string;
}

interface CacheEntry {
  suggestions: Suggestion[];
  timestamp: number;
}

const CACHE_TTL = 60000; // 1 minute
const cache = new Map<string, CacheEntry>();

function getAiConfig() {
  return {
    provider: localStorage.getItem('ai_provider') || 'deepseek',
    model: localStorage.getItem('ai_model') || 'deepseek-chat',
    apiKey: localStorage.getItem('ai_api_key') || '',
  };
}

// ─── Autocomplete (debounced, cached, abortable) ────────────────────

let autocompleteController: AbortController | null = null;
let autocompleteTimer: ReturnType<typeof setTimeout> | null = null;

export function requestAutocomplete(
  command: string,
  onSuggestions: (suggestions: Suggestion[]) => void,
  onClear: () => void,
): void {
  // Cancel previous
  if (autocompleteTimer) clearTimeout(autocompleteTimer);
  if (autocompleteController) autocompleteController.abort();

  // Too short — skip
  if (command.trim().length < 3) {
    onClear();
    return;
  }

  // Check cache
  const cached = cache.get(command);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    if (cached.suggestions.length > 0) {
      onSuggestions(cached.suggestions);
    } else {
      onClear();
    }
    return;
  }

  // Debounce 300ms
  autocompleteTimer = setTimeout(async () => {
    const { provider, model, apiKey } = getAiConfig();
    if (!apiKey) { onClear(); return; }

    autocompleteController = new AbortController();

    try {
      const res = await fetch('/api/ai/autocomplete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, provider, model, apiKey }),
        signal: autocompleteController.signal,
      });

      if (!res.ok) { onClear(); return; }

      const data = await res.json();
      if (data.suggestions && data.suggestions.length > 0) {
        cache.set(command, { suggestions: data.suggestions, timestamp: Date.now() });
        onSuggestions(data.suggestions);
      } else {
        // Cache empty result too (avoid re-requesting bad prefixes)
        cache.set(command, { suggestions: [], timestamp: Date.now() });
        onClear();
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.log('[AITerminal] Autocomplete failed:', err.message);
      }
      onClear();
    }
  }, 300);
}

export function cancelAutocomplete(): void {
  if (autocompleteTimer) clearTimeout(autocompleteTimer);
  if (autocompleteController) autocompleteController.abort();
  autocompleteController = null;
}

// ─── Error Analysis ─────────────────────────────────────────────────

export async function analyzeTerminalOutput(
  selectedText: string,
): Promise<string> {
  const { provider, model, apiKey } = getAiConfig();
  if (!apiKey) return '请先在 AI 助理中配置 API Key';

  const text = selectedText.length > 5000
    ? selectedText.slice(0, 5000) + '\n...[truncated]'
    : selectedText;

  const res = await fetch('/api/ai/analyze-output', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, provider, model, apiKey }),
  });

  if (!res.ok) {
    throw new Error('分析请求失败');
  }

  const data = await res.json();
  return data.analysis || data.choices?.[0]?.message?.content || '无法分析该输出';
}
```

- [ ] **Step 2: Verify the file compiles**

Run: `npx tsc --noEmit src/services/aiTerminal.ts`

Expected: No errors (may need to adjust if TypeScript config differs)

---

### Task 2: Enhance Terminal.tsx with Callbacks and Cursor Position

**Files:**
- Modify: `src/components/Terminal.tsx`

Add `onCommandInput`, `onSelectionChange` callbacks to props. Add `getCursorPosition` and `getTerminalElement` to `TerminalHandle`.

- [ ] **Step 1: Update the TerminalHandle interface**

Edit `src/components/Terminal.tsx`:

```typescript
export interface TerminalHandle {
  executeCommand: (cmd: string, waitAndCapture?: boolean) => Promise<string>;
  getSocket: () => Socket | null;
  writeToTerminal: (data: string) => void;
  getCursorPosition: () => { x: number; y: number } | null;
  getTerminalElement: () => HTMLDivElement | null;
}
```

- [ ] **Step 2: Add new props to the Props interface**

```typescript
interface Props {
  isSidebarOpen: boolean;
  isLoggedIn: boolean;
  onSocketReady: (socket: Socket) => void;
  onCommandInput?: (data: string) => void;
  onTerminalSelection?: (text: string) => void;
}
```

- [ ] **Step 3: Update the component destructuring to include new props**

```typescript
function TerminalComponent({ isSidebarOpen, isLoggedIn, onSocketReady, onCommandInput, onTerminalSelection }, ref) {
```

- [ ] **Step 4: Add cursor position and terminal element to useImperativeHandle**

After the `writeToTerminal` entry, add:

```typescript
getCursorPosition: () => {
  const term = xtermRef.current;
  if (!term) return null;
  return {
    x: term.buffer.active.cursorX,
    y: term.buffer.active.cursorY,
  };
},
getTerminalElement: () => terminalRef.current,
```

- [ ] **Step 5: Update the `term.onData` handler to call `onCommandInput`**

Replace this line (around line 155 in the original):
```typescript
term.onData((data) => socket.emit('data', data));
```

With:
```typescript
term.onData((data) => {
  socket.emit('data', data);
  if (onCommandInput) onCommandInput(data);
});
```

- [ ] **Step 6: Add `onSelectionChange` handler in the `initTerminal` function**

Add this after the `term.onData` line:

```typescript
term.onSelectionChange(() => {
  if (onTerminalSelection) {
    const sel = term.getSelection();
    onTerminalSelection(sel || '');
  }
});
```

- [ ] **Step 7: Verify TypeScript compilation**

Run: `npx tsc --noEmit`

Expected: No new errors from Terminal.tsx changes.

---

### Task 3: Create FloatingToolbar Component

**Files:**
- Create: `src/components/FloatingToolbar.tsx`

- [ ] **Step 1: Create the FloatingToolbar component**

```typescript
// src/components/FloatingToolbar.tsx
import { useEffect, useRef } from 'react';
import { AlertCircle, Send } from 'lucide-react';

interface FloatingToolbarProps {
  visible: boolean;
  selectedText: string;
  onSendToAI: (text: string) => void;
  onAnalyzeError: (text: string) => void;
  onDismiss: () => void;
}

export default function FloatingToolbar({
  visible,
  selectedText,
  onSendToAI,
  onAnalyzeError,
  onDismiss,
}: FloatingToolbarProps) {
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Click outside to dismiss
  useEffect(() => {
    if (!visible) return;
    const handleClick = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        onDismiss();
      }
    };
    // Delay to avoid catching the selection click itself
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClick);
    }, 100);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [visible, onDismiss]);

  // Esc to dismiss
  useEffect(() => {
    if (!visible) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [visible, onDismiss]);

  if (!visible || !selectedText) return null;

  return (
    <div
      ref={toolbarRef}
      className="absolute z-50 flex items-center gap-1 bg-scholar-800 border border-scholar-600 rounded-lg shadow-xl px-2 py-1.5 animate-in fade-in zoom-in-95"
      style={{
        top: '8px',
        right: '8px',
      }}
    >
      <button
        onClick={() => { onSendToAI(selectedText); onDismiss(); }}
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-scholar-200 hover:text-white hover:bg-scholar-700 rounded transition-colors"
        title="发送选中内容给 AI"
      >
        <Send className="w-3 h-3" />
        发送给 AI
      </button>
      <button
        onClick={() => { onAnalyzeError(selectedText); onDismiss(); }}
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-accent hover:text-accent-light hover:bg-scholar-700 rounded transition-colors"
        title="AI 分析报错"
      >
        <AlertCircle className="w-3 h-3" />
        分析报错
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`

Expected: No errors.

---

### Task 4: Create CommandSuggest Component

**Files:**
- Create: `src/components/CommandSuggest.tsx`

- [ ] **Step 1: Create the CommandSuggest component**

```typescript
// src/components/CommandSuggest.tsx
import { useEffect, useRef, useState, useCallback } from 'react';
import { Suggestion } from '../services/aiTerminal';

interface CommandSuggestProps {
  suggestions: Suggestion[];
  cursorPixelX: number;
  cursorPixelY: number;
  lineHeight: number;
  charWidth: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onAccept: (completion: string) => void;
  onDismiss: () => void;
}

export default function CommandSuggest({
  suggestions,
  cursorPixelX,
  cursorPixelY,
  lineHeight,
  charWidth,
  containerRef,
  onAccept,
  onDismiss,
}: CommandSuggestProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Reset active index when suggestions change
  useEffect(() => {
    setActiveIndex(0);
  }, [suggestions]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      e.stopPropagation();
      if (suggestions[activeIndex]) {
        onAccept(suggestions[activeIndex].completion);
      }
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      onDismiss();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      e.stopPropagation();
      setActiveIndex(prev => Math.min(prev + 1, suggestions.length - 1));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      e.stopPropagation();
      setActiveIndex(prev => Math.max(prev - 1, 0));
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      if (suggestions[activeIndex]) {
        onAccept(suggestions[activeIndex].completion);
      }
      return;
    }
    // Any other typing key — dismiss
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      onDismiss();
    }
  }, [suggestions, activeIndex, onAccept, onDismiss]);

  useEffect(() => {
    if (suggestions.length === 0) return;
    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [handleKeyDown, suggestions.length]);

  if (suggestions.length === 0) return null;

  // Calculate ghost text position (in pixels relative to container)
  const ghostX = cursorPixelX;
  const ghostY = cursorPixelY;

  const topSuggestion = suggestions[0];

  // Detect dangerous commands for red warning
  const isDangerous = (completion: string) =>
    /\b(rm\s|delete|rmdir|kill\s-9|fdisk|dd\sif|mkfs\.|:\(\)|chmod\s777)/i.test(completion);

  return (
    <>
      {/* Ghost text overlay */}
      <div
        className="absolute pointer-events-none z-40 select-none"
        style={{
          left: `${ghostX}px`,
          top: `${ghostY}px`,
          height: `${lineHeight}px`,
          lineHeight: `${lineHeight}px`,
        }}
      >
        <span
          className="font-mono opacity-40"
          style={{ fontSize: '14px', color: '#64748b' }}
        >
          {topSuggestion.completion}
        </span>
      </div>

      {/* Dropdown */}
      <div
        ref={dropdownRef}
        className="absolute z-50 bg-scholar-800 border border-scholar-600 rounded-lg shadow-2xl overflow-hidden min-w-[300px]"
        style={{
          left: `${ghostX}px`,
          top: `${ghostY + lineHeight + 4}px`,
          maxWidth: '520px',
        }}
      >
        {suggestions.map((s, i) => {
          const danger = isDangerous(s.completion);
          return (
            <div
              key={i}
              className={`px-3 py-2 cursor-pointer font-mono text-xs border-b border-scholar-700/50 last:border-b-0 transition-colors ${
                i === activeIndex
                  ? 'bg-accent/20'
                  : 'hover:bg-scholar-700'
              }`}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => onAccept(s.completion)}
            >
              <div className={i === activeIndex ? 'text-green-300' : 'text-scholar-200'}>
                {i === activeIndex ? '▶ ' : '  '}{s.completion}
              </div>
              <div className={`text-[11px] mt-0.5 ml-4 ${danger ? 'text-red-400' : 'text-scholar-400'}`}>
                {danger ? '⚠ ' : ''}{s.explanation}
              </div>
            </div>
          );
        })}

        {/* Footer hint */}
        <div className="px-3 py-1.5 text-[10px] text-scholar-500 bg-scholar-900/50 border-t border-scholar-700/30 flex gap-3">
          <span>Tab 补全</span>
          <span>↑↓ 浏览</span>
          <span>Esc 关闭</span>
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`

Expected: No errors from CommandSuggest.tsx.

---

### Task 5: Create TerminalAI Wrapper Component

**Files:**
- Create: `src/components/TerminalAI.tsx`

- [ ] **Step 1: Create the TerminalAI wrapper**

```typescript
// src/components/TerminalAI.tsx
import { useRef, useState, useCallback, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import TerminalComponent, { TerminalHandle } from './Terminal';
import CommandSuggest from './CommandSuggest';
import FloatingToolbar from './FloatingToolbar';
import { requestAutocomplete, cancelAutocomplete, Suggestion } from '../services/aiTerminal';

interface TerminalAIProps {
  isSidebarOpen: boolean;
  isLoggedIn: boolean;
  onSocketReady: (socket: Socket) => void;
  onAnalyzeError?: (selectedText: string) => void;
  onSendToAI?: (selectedText: string) => void;
  terminalRef: React.RefObject<TerminalHandle | null>;
}

// Escape sequence regex for arrow keys, home, end, etc.
const ESCAPE_SEQ = /^\x1b/;
const BACKSPACE = '\x7f';

export default function TerminalAI({
  isSidebarOpen,
  isLoggedIn,
  onSocketReady,
  onAnalyzeError,
  onSendToAI,
  terminalRef,
}: TerminalAIProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // ─── Command buffer for autocomplete ──────────────────────────────
  const [commandBuffer, setCommandBuffer] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [cursorPixel, setCursorPixel] = useState({ x: 0, y: 0 });
  const lineHeight = 21; // 14px font * ~1.5
  const charWidth = 8.4; // 14px * ~0.6

  // ─── Selection state for toolbar ──────────────────────────────────
  const [selectedText, setSelectedText] = useState('');
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const toolbarTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Handle command input from terminal ───────────────────────────
  const handleCommandInput = useCallback((data: string) => {
    setCommandBuffer(prev => {
      let next = prev;

      // If data contains Enter, reset buffer
      if (data.includes('\r') || data.includes('\n')) {
        cancelAutocomplete();
        setSuggestions([]);
        return '';
      }

      // Skip escape sequences (arrow keys, etc.)
      if (ESCAPE_SEQ.test(data)) {
        cancelAutocomplete();
        setSuggestions([]);
        return ''; // Reset — user is navigating history or moving cursor
      }

      // Skip tab when no suggestions
      if (data === '\t') {
        return prev;
      }

      // Paste detection: multi-char or too large
      if (data.length > 1 || data.length > 200) {
        cancelAutocomplete();
        setSuggestions([]);
        return '';
      }

      // Backspace
      if (data === BACKSPACE) {
        next = prev.slice(0, -1);
      } else if (data.length === 1) {
        next = prev + data;
      }

      // Trigger autocomplete
      if (next.trim().length >= 3) {
        updateCursorPosition();
        requestAutocomplete(
          next,
          (sugs) => setSuggestions(sugs),
          () => setSuggestions([]),
        );
      } else {
        cancelAutocomplete();
        setSuggestions([]);
      }

      return next;
    });
  }, []);

  // ─── Update cursor pixel position from xterm buffer ───────────────
  const updateCursorPosition = useCallback(() => {
    const term = terminalRef.current;
    const container = containerRef.current;
    if (!term || !container) return;

    const pos = term.getCursorPosition();
    if (!pos) return;

    // xterm buffer cursor is relative to viewport
    // Convert grid (x,y) to pixels relative to container
    const paddingX = 16; // p-2 = 8px, plus internal xterm padding
    const paddingY = 16;
    setCursorPixel({
      x: pos.x * charWidth + paddingX,
      y: pos.y * lineHeight + paddingY,
    });
  }, [charWidth, lineHeight]);

  // ─── Handle selection changes ─────────────────────────────────────
  const handleSelection = useCallback((text: string) => {
    setSelectedText(text);

    if (toolbarTimerRef.current) clearTimeout(toolbarTimerRef.current);

    if (text && text.trim().length > 0) {
      toolbarTimerRef.current = setTimeout(() => {
        setToolbarVisible(true);
      }, 200);
    } else {
      setToolbarVisible(false);
    }
  }, []);

  // ─── Accept autocomplete suggestion ────────────────────────────────
  const handleAcceptSuggestion = useCallback((completion: string) => {
    const socket = terminalRef.current?.getSocket();
    if (socket && socket.connected) {
      socket.emit('data', completion);
    }
    setSuggestions([]);
    setCommandBuffer('');
    cancelAutocomplete();
  }, []);

  // ─── Dismiss suggestions ──────────────────────────────────────────
  const handleDismissSuggestions = useCallback(() => {
    setSuggestions([]);
    cancelAutocomplete();
  }, []);

  // ─── Error analysis handlers ──────────────────────────────────────
  const handleAnalyzeError = useCallback((text: string) => {
    if (onAnalyzeError) onAnalyzeError(text);
  }, [onAnalyzeError]);

  const handleSendToAI = useCallback((text: string) => {
    if (onSendToAI) onSendToAI(text);
  }, [onSendToAI]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAutocomplete();
      if (toolbarTimerRef.current) clearTimeout(toolbarTimerRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="flex-1 border border-scholar-700 rounded-xl overflow-hidden shadow-2xl bg-[#09090b] relative">
      <TerminalComponent
        ref={terminalRef}
        isSidebarOpen={isSidebarOpen}
        isLoggedIn={isLoggedIn}
        onSocketReady={onSocketReady}
        onCommandInput={handleCommandInput}
        onTerminalSelection={handleSelection}
      />

      {/* AI overlays — absolutely positioned over terminal */}
      <CommandSuggest
        suggestions={suggestions}
        cursorPixelX={cursorPixel.x}
        cursorPixelY={cursorPixel.y}
        lineHeight={lineHeight}
        charWidth={charWidth}
        containerRef={containerRef}
        onAccept={handleAcceptSuggestion}
        onDismiss={handleDismissSuggestions}
      />

      <FloatingToolbar
        visible={toolbarVisible}
        selectedText={selectedText}
        onSendToAI={handleSendToAI}
        onAnalyzeError={handleAnalyzeError}
        onDismiss={() => setToolbarVisible(false)}
      />
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`

Expected: No errors.

---

### Task 6: Wire TerminalAI in App.tsx

**Files:**
- Modify: `src/App.tsx`

Replace `TerminalComponent` import and usage with `TerminalAI`, add `onAnalyzeError` and `onSendToAI` handlers.

- [ ] **Step 1: Update the import**

Replace:
```typescript
import TerminalComponent, { TerminalHandle } from './components/Terminal';
```
With:
```typescript
import TerminalAI from './components/TerminalAI';
import { TerminalHandle } from './components/Terminal';
```

- [ ] **Step 2: Add analyze/send-to-AI handlers before the render section**

Add these callbacks after the `handleToggleRightPanel` function (around line 193):

```typescript
const handleAnalyzeError = useCallback((selectedText: string) => {
  const text = selectedText.length > 5000
    ? selectedText.slice(0, 5000) + '\n...[truncated]'
    : selectedText;
  const msg: Message = {
    role: 'user',
    content: `我在终端遇到了以下终端输出，请分析并给出建议：\n\`\`\`\n${text}\n\`\`\`\n（当前在 HPC 集群终端中操作）`,
  };
  setMessages(prev => [...prev, msg]);
  setIsSidebarOpen(true);
}, []);

const handleSendToAI = useCallback((selectedText: string) => {
  const text = selectedText.length > 5000
    ? selectedText.slice(0, 5000) + '\n...[truncated]'
    : selectedText;
  const msg: Message = {
    role: 'user',
    content: `终端输出内容：\n\`\`\`\n${text}\n\`\`\``,
  };
  setMessages(prev => [...prev, msg]);
  setIsSidebarOpen(true);
}, []);
```

- [ ] **Step 3: Replace the TerminalComponent JSX with TerminalAI**

Replace this block (original App.tsx lines 266-281):
```tsx
<TerminalComponent
  ref={terminalRef}
  isSidebarOpen={isSidebarOpen}
  isLoggedIn={isLoggedIn}
  onSocketReady={(sock) => setSocket(sock)}
/>
```

With:
```tsx
<TerminalAI
  terminalRef={terminalRef}
  isSidebarOpen={isSidebarOpen}
  isLoggedIn={isLoggedIn}
  onSocketReady={(sock) => setSocket(sock)}
  onAnalyzeError={handleAnalyzeError}
  onSendToAI={handleSendToAI}
/>
```

`terminalRef` in App.tsx is already declared as `const terminalRef = useRef<TerminalHandle>(null);` (line 29 of original). TerminalAI passes it through to TerminalComponent, so `executeCommand` continues to work unchanged.

- [ ] **Step 4: Verify TypeScript compilation**

Run: `npx tsc --noEmit`

Expected: No errors.

---

### Task 7: Add Server Endpoints

**Files:**
- Modify: `server.ts`

Add `/api/ai/autocomplete` and `/api/ai/analyze-output` endpoints.

- [ ] **Step 1: Add rate limiter for autocomplete**

Add this after the OBSERVATIONS array declaration (around line 1057):

```typescript
// ─── Rate limiter ──────────────────────────────────────────────────
const rateLimits = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(sessionId: string, maxPerMinute: number = 20): boolean {
  const now = Date.now();
  let entry = rateLimits.get(sessionId);
  if (!entry || now > entry.resetAt) {
    rateLimits.set(sessionId, { count: 1, resetAt: now + 60000 });
    return true;
  }
  if (entry.count >= maxPerMinute) return false;
  entry.count++;
  return true;
}
```

- [ ] **Step 2: Add `/api/ai/autocomplete` endpoint**

Add this after the `/api/ai/stream` route block (around line 569):

```typescript
// ══════════════════════════════════════════════════════════════════
//  AI AUTOCOMPLETE — Fast command suggestions
// ══════════════════════════════════════════════════════════════════

app.post("/api/ai/autocomplete", async (req, res) => {
  const { command, provider, model, apiKey } = req.body;
  if (!apiKey) return res.status(400).json({ error: "Missing API Key" });
  if (!command || command.length > 500) return res.status(400).json({ error: "Invalid command" });

  const sessionId = (req.session as any)?.sshSessionId;
  if (sessionId && !checkRateLimit(sessionId, 20)) {
    return res.status(429).json({ error: "Too many requests" });
  }

  const systemPrompt = `You are a Linux command autocomplete engine. Given a partial command, suggest up to 5 completions. For each, provide a short Chinese explanation (≤30 chars). Focus on find, grep, sed, awk, and HPC cluster commands (bsub, bjobs, bqueues, module, sbatch, squeue, scancel, sacct). Return ONLY valid JSON: {"suggestions":[{"completion":"...","explanation":"..."}]}. If unsure, return {"suggestions":[]}.`;

  try {
    if (provider === "gemini") {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: model || "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: `Command: ${command}` }] }],
        config: { systemInstruction: systemPrompt, temperature: 0.0 },
      });
      try {
        const text = response.text || "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { suggestions: [] };
        return res.json(parsed);
      } catch {
        return res.json({ suggestions: [] });
      }
    } else {
      let apiUrl = "";
      if (provider === "openai") apiUrl = "https://api.openai.com/v1/chat/completions";
      else if (provider === "grok") apiUrl = "https://api.x.ai/v1/chat/completions";
      else if (provider === "kimi") apiUrl = "https://api.moonshot.cn/v1/chat/completions";
      else apiUrl = "https://api.deepseek.com/chat/completions";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Command: ${command}` },
          ],
          temperature: 0.0,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        console.error(`[Autocomplete] ${provider} error: ${response.status}`);
        return res.json({ suggestions: [] });
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "";
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { suggestions: [] };
        res.json(parsed);
      } catch {
        res.json({ suggestions: [] });
      }
    }
  } catch (err: any) {
    console.error("[Autocomplete] Error:", err.message);
    res.json({ suggestions: [] }); // Always return valid JSON even on error
  }
});
```

- [ ] **Step 3: Add `/api/ai/analyze-output` endpoint**

Add this after the autocomplete endpoint:

```typescript
// ══════════════════════════════════════════════════════════════════
//  AI ANALYZE OUTPUT — Error analysis for terminal output
// ══════════════════════════════════════════════════════════════════

app.post("/api/ai/analyze-output", async (req, res) => {
  const { text, provider, model, apiKey } = req.body;
  if (!apiKey) return res.status(400).json({ error: "Missing API Key" });
  if (!text) return res.status(400).json({ error: "Missing text" });

  const safeText = text.slice(0, 5000);
  const messages = [
    { role: "system", content: "你是一个 HPC 集群和 Linux 终端专家。用户选中了终端输出，请分析其中可能存在的错误、异常或问题，并给出具体的修复建议。如果内容看起来正常，也请简要说明。" },
    { role: "user", content: `终端输出内容：\n\`\`\`\n${safeText}\n\`\`\`` },
  ];

  try {
    if (provider === "gemini") {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: model || "gemini-3.1-pro-preview",
        contents: messages.map(m => ({ role: m.role === "system" ? "user" : "user", parts: [{ text: m.content }] })),
        config: { systemInstruction: messages[0].content, temperature: 0.1 },
      });
      return res.json({ analysis: response.text });
    } else {
      let apiUrl = "";
      if (provider === "openai") apiUrl = "https://api.openai.com/v1/chat/completions";
      else if (provider === "grok") apiUrl = "https://api.x.ai/v1/chat/completions";
      else if (provider === "kimi") apiUrl = "https://api.moonshot.cn/v1/chat/completions";
      else apiUrl = "https://api.deepseek.com/chat/completions";

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model, messages, temperature: 0.1 }),
      });

      if (!response.ok) throw new Error(`${provider} error: ${response.status}`);
      const data = await response.json();
      res.json({ analysis: data.choices?.[0]?.message?.content || "无法分析" });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
```

- [ ] **Step 4: Verify server compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

---

### Task 8: Build and Verification

**Files:**
- All above files

- [ ] **Step 1: Build the frontend**

Run: `npm run build`

Expected: Build succeeds without errors.

- [ ] **Step 2: Start the dev server**

Run: `npm run dev`

Expected: Server starts on port 3003.

- [ ] **Step 3: Manual verification checklist**

Open `http://localhost:3003` and verify:

1. **Login**: Enter cluster credentials, connect successfully, terminal works
2. **Basic autocomplete**: Type `find . -name "*.log"` wait 300ms → ghost text + dropdown appear → Tab to accept
3. **Arrow key navigation**: Dropdown visible → ↓ to select → Enter accepts
4. **Esc dismisses**: Ghost text visible → Esc → all cleared
5. **Short commands**: Type `ls` → no suggestions (under 3 chars)
6. **Selection → toolbar**: Select error text in terminal → floating toolbar appears at top-right → click "分析报错" → AI chat auto-opens with analysis
7. **Send to AI**: Select text → click "发送给 AI" → AI chat opens with content
8. **Toolbar dismiss**: Click outside terminal → toolbar fades. Re-select → reappears.
9. **Resize**: Resize window while dropdown open → artifacts cleared
10. **Existing features**: Verify AI chat, file manager, results panel, conversation history, skill panel all work
11. **No console errors**: Check browser DevTools console
12. **No server crashes**: Check server terminal output

- [ ] **Step 4: Fix any issues found during verification**

---
