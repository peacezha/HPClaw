# AI 面板抽屉模式 + 输入框自动增高 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** AI 助理面板支持"覆盖式抽屉（默认）/ 并排侧边栏"两种显示模式（localStorage 持久化、AI 设置面板中切换），并把单行聊天输入框改为自动增高的多行 textarea（Enter 发送、Shift+Enter 换行）。

**Architecture:** 新建 `AIDrawer` 组件，完全仿照现有 `FileTransferDrawer`（portal + 遮罩 + fixed 定位 + CSS 滑入动画），方向镜像为左侧。`App.tsx` 依据 `uiPrefs` 服务（新建，仿 `aiProfile.ts` 的 localStorage 模式）决定把 `AIChat` 渲染进抽屉还是现有侧边栏。输入框按键判定抽成纯函数便于测试。

**Tech Stack:** React 18 + TypeScript + Tailwind v4 + framer-motion（motion/react）+ vitest（jsdom + @testing-library/react）。工作目录：`E:\0612hpclaw\0714`（独立 git 仓库，分支 `codex/0714-xftp`）。测试命令 `npm test`（vitest run），类型检查 `npm run lint`（tsc --noEmit）。

**对应设计文档：** `docs/superpowers/specs/2026-07-15-ai-drawer-mode-design.md`

---

## 文件结构总览

| 文件 | 操作 | 职责 |
|---|---|---|
| `src/services/uiPrefs.ts` | 新建 | UI 偏好（AI 面板显示模式）localStorage 读写 + 变更事件 |
| `src/services/uiPrefs.test.ts` | 新建 | uiPrefs 单测 |
| `src/services/chatInputKeys.ts` | 新建 | 聊天输入框按键判定纯函数 |
| `src/services/chatInputKeys.test.ts` | 新建 | 按键判定单测 |
| `src/components/aiDrawer.css` | 新建 | AI 抽屉覆盖层样式（左侧镜像版 fileTransfer.css overlay 部分） |
| `src/components/AIDrawer.tsx` | 新建 | AI 抽屉组件（portal + 遮罩 + Esc + 最大化） |
| `src/components/AIDrawer.test.tsx` | 新建 | AIDrawer 单测 |
| `src/components/AIChat.tsx` | 修改 | ① 输入框改 textarea 自动增高（859-865、903-905、1251-1272 行附近）② 设置面板加显示模式切换（1021 行前） |
| `src/App.tsx` | 修改 | 按模式渲染 AIChat 到侧边栏或抽屉（304-332、395-407 行附近） |

---

### Task 1: uiPrefs 服务（localStorage 持久化）

**Files:**
- Create: `src/services/uiPrefs.ts`
- Test: `src/services/uiPrefs.test.ts`

- [ ] **Step 1.1: 写失败测试**

创建 `src/services/uiPrefs.test.ts`：

```ts
// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadUIPrefs, saveUIPrefs, UI_PREFS_CHANGE_EVENT } from './uiPrefs';

beforeEach(() => {
  localStorage.clear();
});

describe('uiPrefs', () => {
  it('defaults to drawer mode when nothing is stored', () => {
    expect(loadUIPrefs()).toEqual({ aiPanelMode: 'drawer' });
  });

  it('round-trips saved prefs', () => {
    saveUIPrefs({ aiPanelMode: 'sidebar' });
    expect(loadUIPrefs()).toEqual({ aiPanelMode: 'sidebar' });
  });

  it('falls back to drawer on corrupted JSON', () => {
    localStorage.setItem('hpclaw_ui_prefs', '{not-json');
    expect(loadUIPrefs()).toEqual({ aiPanelMode: 'drawer' });
  });

  it('falls back to drawer on invalid mode value', () => {
    localStorage.setItem('hpclaw_ui_prefs', JSON.stringify({ aiPanelMode: 'bogus' }));
    expect(loadUIPrefs()).toEqual({ aiPanelMode: 'drawer' });
  });

  it('dispatches change event on save', () => {
    const handler = vi.fn();
    window.addEventListener(UI_PREFS_CHANGE_EVENT, handler);
    saveUIPrefs({ aiPanelMode: 'sidebar' });
    expect(handler).toHaveBeenCalledOnce();
    window.removeEventListener(UI_PREFS_CHANGE_EVENT, handler);
  });
});
```

- [ ] **Step 1.2: 运行确认失败**

Run: `npx vitest run src/services/uiPrefs.test.ts --pool threads --maxWorkers 1 --minWorkers 1`
Expected: FAIL —— `Cannot find module './uiPrefs'`（或等价的导入错误）

- [ ] **Step 1.3: 最小实现**

创建 `src/services/uiPrefs.ts`：

```ts
export type AIPanelMode = 'drawer' | 'sidebar';

export interface UIPrefs {
  aiPanelMode: AIPanelMode;
}

const STORAGE_KEY = 'hpclaw_ui_prefs';
export const UI_PREFS_CHANGE_EVENT = 'hpclaw-ui-prefs-change';

function normalizeUIPrefs(input: unknown): UIPrefs {
  const mode = (input as { aiPanelMode?: unknown } | null | undefined)?.aiPanelMode;
  return { aiPanelMode: mode === 'sidebar' ? 'sidebar' : 'drawer' };
}

export function loadUIPrefs(): UIPrefs {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return normalizeUIPrefs(JSON.parse(stored));
  } catch {
    // Fall through to default.
  }
  return { aiPanelMode: 'drawer' };
}

export function saveUIPrefs(prefs: UIPrefs): UIPrefs {
  const normalized = normalizeUIPrefs(prefs);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  window.dispatchEvent(new CustomEvent(UI_PREFS_CHANGE_EVENT, { detail: normalized }));
  return normalized;
}
```

- [ ] **Step 1.4: 运行确认通过**

Run: `npx vitest run src/services/uiPrefs.test.ts --pool threads --maxWorkers 1 --minWorkers 1`
Expected: PASS（5 个测试）

- [ ] **Step 1.5: 提交**

```bash
git add src/services/uiPrefs.ts src/services/uiPrefs.test.ts
git commit -m "feat: add uiPrefs service for AI panel display mode"
```

---

### Task 2: 输入框按键判定纯函数

**Files:**
- Create: `src/services/chatInputKeys.ts`
- Test: `src/services/chatInputKeys.test.ts`

- [ ] **Step 2.1: 写失败测试**

创建 `src/services/chatInputKeys.test.ts`：

```ts
import { describe, it, expect } from 'vitest';
import { shouldSubmitOnKey } from './chatInputKeys';

describe('shouldSubmitOnKey', () => {
  it('submits on plain Enter', () => {
    expect(shouldSubmitOnKey({ key: 'Enter', shiftKey: false })).toBe(true);
  });

  it('does not submit on Shift+Enter (newline)', () => {
    expect(shouldSubmitOnKey({ key: 'Enter', shiftKey: true })).toBe(false);
  });

  it('does not submit while IME composition is active', () => {
    expect(shouldSubmitOnKey({ key: 'Enter', shiftKey: false, isComposing: true })).toBe(false);
  });

  it('does not submit on other keys', () => {
    expect(shouldSubmitOnKey({ key: 'a', shiftKey: false })).toBe(false);
  });
});
```

- [ ] **Step 2.2: 运行确认失败**

Run: `npx vitest run src/services/chatInputKeys.test.ts --pool threads --maxWorkers 1 --minWorkers 1`
Expected: FAIL —— `Cannot find module './chatInputKeys'`

- [ ] **Step 2.3: 最小实现**

创建 `src/services/chatInputKeys.ts`：

```ts
export interface ChatKeyEventLike {
  key: string;
  shiftKey: boolean;
  isComposing?: boolean;
}

/** Enter 发送；Shift+Enter 换行；中文输入法组合期间（isComposing）不发送。 */
export function shouldSubmitOnKey(e: ChatKeyEventLike): boolean {
  return e.key === 'Enter' && !e.shiftKey && !e.isComposing;
}
```

- [ ] **Step 2.4: 运行确认通过**

Run: `npx vitest run src/services/chatInputKeys.test.ts --pool threads --maxWorkers 1 --minWorkers 1`
Expected: PASS（4 个测试）

- [ ] **Step 2.5: 提交**

```bash
git add src/services/chatInputKeys.ts src/services/chatInputKeys.test.ts
git commit -m "feat: add chat input key handling helper"
```

---

### Task 3: AIChat 输入框改为自动增高 textarea

**Files:**
- Modify: `src/components/AIChat.tsx`（三处：约 859-865 行 `handleSubmit`、约 903-905 行 `handleInputChange`、约 1251-1258 行输入框 JSX）

无新增单测（按键逻辑已在 Task 2 覆盖；DOM 高度测量 jsdom 不支持，留给 Task 7 手工验证）。改完跑全量测试防回归。

- [ ] **Step 3.1: 添加 import**

在 `AIChat.tsx` 顶部 import 区（第 12 行 `import { PROVIDER_MODELS, ... } from '../services/aiProfile';` 之后）添加：

```ts
import { shouldSubmitOnKey } from '../services/chatInputKeys';
```

- [ ] **Step 3.2: 重构 handleSubmit 并添加高度控制**

找到（约 859-865 行）：

```ts
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userText = inputValue.trim();
    if (!userText) return;
    setInputValue('');
    await submitToAI(userText, { appendUserMessage: true });
  };
```

替换为：

```ts
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  const resetChatInputHeight = () => {
    const el = chatInputRef.current;
    if (el) el.style.height = 'auto';
  };

  // 自动增高：上限 192px（约 8 行），超出后内部滚动
  const autoResizeChatInput = () => {
    const el = chatInputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 192)}px`;
  };

  const submitChatInput = async () => {
    const userText = inputValue.trim();
    if (!userText || isChatInputDisabled) return;
    setInputValue('');
    resetChatInputHeight();
    await submitToAI(userText, { appendUserMessage: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitChatInput();
  };
```

注意：`isChatInputDisabled` 定义在约 907 行（`const isChatInputDisabled = shouldDisableChatInput(...)`），位于 `handleSubmit` 之后。`submitChatInput` 是在事件回调中才执行的闭包，运行时取值没有问题；但若 `tsc` 报"块级作用域变量在声明前使用"，把 `const isChatInputDisabled = ...` 一行上移到 `handleSubmit` 定义之前即可。

- [ ] **Step 3.3: 修改 handleInputChange**

找到（约 903-905 行）：

```ts
  const handleInputChange = (val: string) => {
    setInputValue(val);
  };
```

替换为：

```ts
  const handleInputChange = (val: string) => {
    setInputValue(val);
    autoResizeChatInput();
  };
```

- [ ] **Step 3.4: 替换输入框 JSX**

找到（约 1251-1259 行）：

```tsx
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={e => handleInputChange(e.target.value)}
                placeholder={isAgentMode ? '输入任务描述...' : '输入命令需求...'}
                className="flex-1 bg-scholar-950 border border-scholar-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                disabled={isChatInputDisabled}
              />
```

替换为（form 加 `items-end` 让按钮在输入框增高时贴底；textarea 禁用手动拖拽调整）：

```tsx
            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              <textarea
                ref={chatInputRef}
                rows={1}
                value={inputValue}
                onChange={e => handleInputChange(e.target.value)}
                onKeyDown={e => {
                  if (shouldSubmitOnKey({ key: e.key, shiftKey: e.shiftKey, isComposing: e.nativeEvent.isComposing })) {
                    e.preventDefault();
                    void submitChatInput();
                  }
                }}
                placeholder={isAgentMode ? '输入任务描述...' : '输入命令需求...'}
                className="flex-1 bg-scholar-950 border border-scholar-600 rounded-lg px-3 py-2 text-sm leading-5 resize-none overflow-y-auto max-h-48 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                disabled={isChatInputDisabled}
              />
```

（后面的停止按钮、发送按钮 JSX 保持不变。）

- [ ] **Step 3.5: 类型检查 + 全量测试**

Run: `npm run lint && npm test`
Expected: tsc 无错误，全部测试 PASS

- [ ] **Step 3.6: 提交**

```bash
git add src/components/AIChat.tsx
git commit -m "feat: auto-growing chat textarea with Enter-to-send, Shift+Enter newline"
```

---

### Task 4: AIDrawer 组件 + 样式

**Files:**
- Create: `src/components/aiDrawer.css`
- Create: `src/components/AIDrawer.tsx`
- Test: `src/components/AIDrawer.test.tsx`

- [ ] **Step 4.1: 写失败测试**

创建 `src/components/AIDrawer.test.tsx`（仿 `src/features/file-transfer/FileTransferDrawer.test.tsx`）：

```tsx
// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import AIDrawer from './AIDrawer';

afterEach(cleanup);

describe('AIDrawer', () => {
  it('renders dialog when open and closes on Escape', () => {
    const onClose = vi.fn();
    render(
      <AIDrawer open onClose={onClose}>
        <div>Chat</div>
      </AIDrawer>,
    );
    expect(screen.getByRole('dialog', { name: 'AI 助理' })).toBeTruthy();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('renders nothing when closed', () => {
    render(
      <AIDrawer open={false} onClose={() => {}}>
        <div>Chat</div>
      </AIDrawer>,
    );
    expect(screen.queryByRole('dialog', { name: 'AI 助理' })).toBeNull();
  });

  it('closes on scrim click', () => {
    const onClose = vi.fn();
    render(
      <AIDrawer open onClose={onClose}>
        <div>Chat</div>
      </AIDrawer>,
    );
    fireEvent.click(document.querySelector('.ai-drawer-scrim')!);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('toggles maximize via header button', () => {
    const onToggleMaximize = vi.fn();
    render(
      <AIDrawer open maximized={false} onClose={() => {}} onToggleMaximize={onToggleMaximize}>
        <div>Chat</div>
      </AIDrawer>,
    );
    fireEvent.click(screen.getByRole('button', { name: '最大化' }));
    expect(onToggleMaximize).toHaveBeenCalledOnce();
  });

  it('keeps underlying content mounted while overlay is open', () => {
    render(
      <div>
        <div data-testid="underlying-terminal">Terminal</div>
        <AIDrawer open onClose={() => {}}>
          <div>Chat</div>
        </AIDrawer>
      </div>,
    );
    expect(screen.getByTestId('underlying-terminal')).toBeTruthy();
    expect(screen.getByRole('dialog', { name: 'AI 助理' })).toBeTruthy();
  });
});
```

- [ ] **Step 4.2: 运行确认失败**

Run: `npx vitest run src/components/AIDrawer.test.tsx --pool threads --maxWorkers 1 --minWorkers 1`
Expected: FAIL —— `Cannot find module './AIDrawer'`

- [ ] **Step 4.3: 创建样式文件**

创建 `src/components/aiDrawer.css`（镜像 `fileTransfer.css` 的 overlay 段，改为左侧、阴影朝右）：

```css
/* ── AI Drawer Overlay (slides in from the left) ─────────────── */
.ai-drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: 30;
  display: flex;
}

.ai-drawer-scrim {
  position: absolute;
  inset: 0;
  background: rgb(0 0 0 / 0.52);
}

.ai-drawer {
  position: absolute;
  inset-block: 0;
  left: 0;
  width: min(90vw, 1680px);
  background: #141f30; /* scholar-900 */
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 24px rgb(0 0 0 / 0.4);
  transform: translateX(0);
  transition: transform 0.25s ease;
}

.ai-drawer[data-maximized="true"] {
  width: 100vw;
}

.ai-drawer:not([data-open="true"]) {
  transform: translateX(-100%);
}

/* Responsive: at < 1100px, drawer takes full width */
@media (max-width: 1100px) {
  .ai-drawer {
    width: 100vw;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .ai-drawer {
    transition: none;
  }
}
```

- [ ] **Step 4.4: 创建 AIDrawer 组件**

创建 `src/components/AIDrawer.tsx`（仿 `FileTransferDrawer.tsx`）：

```tsx
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import './aiDrawer.css';

interface AIDrawerProps {
  open: boolean;
  maximized?: boolean;
  onClose: () => void;
  onToggleMaximize?: () => void;
  children: React.ReactNode;
}

export default function AIDrawer({
  open,
  maximized = false,
  onClose,
  onToggleMaximize,
  children,
}: AIDrawerProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="ai-drawer-overlay" role="dialog" aria-label="AI 助理">
      <div className="ai-drawer-scrim" onClick={onClose} />
      <div className="ai-drawer" data-open={open} data-maximized={maximized}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-scholar-700 shrink-0">
          <h2 className="text-sm font-semibold text-scholar-100">AI 助理</h2>
          <div className="flex items-center gap-2">
            {onToggleMaximize && (
              <button
                type="button"
                onClick={onToggleMaximize}
                className="text-scholar-400 hover:text-scholar-200 transition-colors p-1 rounded"
                aria-label={maximized ? '还原' : '最大化'}
              >
                {maximized ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-scholar-400 hover:text-scholar-200 transition-colors p-1 rounded"
              aria-label="关闭"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
```

- [ ] **Step 4.5: 运行确认通过**

Run: `npx vitest run src/components/AIDrawer.test.tsx --pool threads --maxWorkers 1 --minWorkers 1`
Expected: PASS（5 个测试）

- [ ] **Step 4.6: 提交**

```bash
git add src/components/AIDrawer.tsx src/components/AIDrawer.test.tsx src/components/aiDrawer.css
git commit -m "feat: add AIDrawer overlay component (left-side drawer)"
```

---

### Task 5: App.tsx 按模式渲染 AI 面板

**Files:**
- Modify: `src/App.tsx`（import 区约 1-16 行、Panel State 约 39-45 行、渲染区约 304-332 与 395-407 行）

- [ ] **Step 5.1: 添加 import**

在 `src/App.tsx` 第 13 行 `import FileTransferLauncher ...` 之后添加：

```ts
import AIDrawer from './components/AIDrawer';
import { loadUIPrefs, UI_PREFS_CHANGE_EVENT, type AIPanelMode } from './services/uiPrefs';
```

- [ ] **Step 5.2: 添加模式 state 与事件监听**

在 Panel State 区（第 44-45 行 `fileTransferOpen` / `fileTransferMaximized` 之后）添加：

```ts
  const [aiPanelMode, setAiPanelMode] = useState<AIPanelMode>(() => loadUIPrefs().aiPanelMode);
  const [aiDrawerMaximized, setAiDrawerMaximized] = useState(false);

  // AI 面板显示模式：跟随设置面板里的切换即时生效
  useEffect(() => {
    const handler = () => setAiPanelMode(loadUIPrefs().aiPanelMode);
    window.addEventListener(UI_PREFS_CHANGE_EVENT, handler);
    return () => window.removeEventListener(UI_PREFS_CHANGE_EVENT, handler);
  }, []);
```

- [ ] **Step 5.3: 提取共享的 AIChat 元素并按模式渲染**

在 return 语句之前（`const showRightPanel = activeRightPanel !== null;` 附近，约 285 行）添加共享元素，避免两个渲染分支重复 12 个 props：

```tsx
  const aiChatElement = (
    <AIChat
      isOpen={isSidebarOpen}
      executeCommand={executeCommand}
      socket={socket}
      onSkillsChange={() => {}}
      messages={messages}
      onMessagesChange={setMessages}
      onNewChat={handleNewConversation}
      onSaveToCluster={handleSaveToCluster}
      triggerAI={triggerAI}
      quickTriggerAI={quickTriggerAI}
      aiClusterControl={aiClusterControl}
      activeConversationId={activeConversationId}
      loadingConversationId={loadingConversationId}
    />
  );
```

把现有左侧侧边栏渲染块（约 305-332 行）：

```tsx
        {/* ── Left: AI Chat Sidebar ── */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 420, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full border-r border-scholar-700 flex flex-col shrink-0 overflow-hidden"
            >
              <AIChat
                isOpen={isSidebarOpen}
                ...（原有 12 个 props）...
              />
            </motion.div>
          )}
        </AnimatePresence>
```

替换为（仅 sidebar 模式走此分支，内部改用共享元素）：

```tsx
        {/* ── Left: AI Chat Sidebar (sidebar mode only) ── */}
        {aiPanelMode === 'sidebar' && (
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 420, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-full border-r border-scholar-700 flex flex-col shrink-0 overflow-hidden"
              >
                {aiChatElement}
              </motion.div>
            )}
          </AnimatePresence>
        )}
```

- [ ] **Step 5.4: 添加抽屉模式渲染**

在文件传输抽屉渲染块（约 395-407 行 `{fileTransferOpen && (...)}`）之后、根 div 收尾 `</div>` 之前添加：

```tsx
      {/* ── AI Drawer (drawer mode, overlay) ── */}
      {aiPanelMode === 'drawer' && (
        <AIDrawer
          open={isSidebarOpen}
          maximized={aiDrawerMaximized}
          onClose={() => setIsSidebarOpen(false)}
          onToggleMaximize={() => setAiDrawerMaximized(prev => !prev)}
        >
          {aiChatElement}
        </AIDrawer>
      )}
```

说明：左边缘的 ChevronRight 唤起按钮（约 336-345 行）条件是 `!isSidebarOpen`，两种模式共用，无需改动；终端"分析错误/发送到 AI"回调调用 `setIsSidebarOpen(true)`，两种模式下都会弹出面板，也无需改动。

- [ ] **Step 5.5: 类型检查 + 全量测试**

Run: `npm run lint && npm test`
Expected: tsc 无错误，全部测试 PASS

- [ ] **Step 5.6: 提交**

```bash
git add src/App.tsx
git commit -m "feat: render AI panel as overlay drawer or sidebar based on uiPrefs"
```

---

### Task 6: AI 设置面板加显示模式切换

**Files:**
- Modify: `src/components/AIChat.tsx`（import 区、state 区约 295-297 行、设置面板约 1021 行"保存"按钮之前）

- [ ] **Step 6.1: 添加 import 与 state**

在 Task 3 加过的 import 行旁边添加：

```ts
import { loadUIPrefs, saveUIPrefs, type AIPanelMode } from '../services/uiPrefs';
```

在 state 区（约 295 行 `const [showSettings, setShowSettings] = useState(false);` 之后）添加：

```ts
  const [panelMode, setPanelMode] = useState<AIPanelMode>(() => loadUIPrefs().aiPanelMode);
```

- [ ] **Step 6.2: 在设置面板添加分段切换控件**

在设置面板中"保存"按钮（约 1021-1029 行，`onClick={() => { persistAiProfile(); setShowSettings(false); }}` 的那个 `<button>`）**之前**插入：

```tsx
          <div>
            <label className="block text-xs text-scholar-300 mb-1">AI 面板显示方式</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setPanelMode('drawer'); saveUIPrefs({ aiPanelMode: 'drawer' }); }}
                className={`flex-1 py-1.5 rounded text-xs border transition-colors ${
                  panelMode === 'drawer'
                    ? 'bg-accent/20 text-accent border-accent/30'
                    : 'bg-scholar-950 text-scholar-300 border-scholar-600 hover:text-scholar-100'
                }`}
              >
                抽屉（覆盖终端）
              </button>
              <button
                type="button"
                onClick={() => { setPanelMode('sidebar'); saveUIPrefs({ aiPanelMode: 'sidebar' }); }}
                className={`flex-1 py-1.5 rounded text-xs border transition-colors ${
                  panelMode === 'sidebar'
                    ? 'bg-accent/20 text-accent border-accent/30'
                    : 'bg-scholar-950 text-scholar-300 border-scholar-600 hover:text-scholar-100'
                }`}
              >
                侧边栏（并排）
              </button>
            </div>
          </div>
```

已知取舍（设计文档已确认）：点击即保存并立即生效；切换会导致 `AIChat` 在新容器中重新挂载，设置面板随之收起、未发送的输入草稿清空 —— 可接受，对话历史保存在 App 层不受影响。

- [ ] **Step 6.3: 类型检查 + 全量测试**

Run: `npm run lint && npm test`
Expected: tsc 无错误，全部测试 PASS

- [ ] **Step 6.4: 提交**

```bash
git add src/components/AIChat.tsx
git commit -m "feat: add AI panel display mode toggle in settings"
```

---

### Task 7: 手工验证、打包并替换 HPClaw-x64

**Files:**
- 无源码改动；产出 `release/win-unpacked/` 并同步到 `HPClaw-x64/`

- [ ] **Step 7.1: 全量回归**

Run: `npm run lint && npm test`
Expected: 全绿

- [ ] **Step 7.2: 开发模式手工验证（web 模式即可验证全部 UI 行为）**

Run: `npm run dev`（tsx server.ts，浏览器打开其输出的本地地址）

验证清单：
1. 登录后默认抽屉模式：点左边缘 ChevronRight → AI 抽屉从左滑出覆盖约 90% 宽度，终端仍在其下方保持挂载
2. 遮罩点击、Esc、右上角 X 均可关闭；最大化按钮占满全宽、再点还原
3. 输入框：输入多行内容自动增高（约 8 行封顶后内部滚动）；Enter 发送、Shift+Enter 换行；中文输入法选词回车不误发；发送后高度复位
4. AI 设置面板 → 切到"侧边栏（并排）"：面板立即变回并排模式；刷新页面后仍是侧边栏（localStorage 生效）；再切回抽屉
5. 终端选中文本 →"发送到 AI"：两种模式下面板均自动弹出
6. 文件传输抽屉与 AI 抽屉互不影响，各自 Esc 只关自己

如发现问题：用 superpowers:systematic-debugging 流程修复后重跑本清单。

- [ ] **Step 7.3: 打包**

先确认正在运行的 HPClaw.exe 已关闭（否则文件被占用无法替换）。

Run: `npm run electron:dist`
Expected: 成功结束，产出 `release/win-unpacked/`（含 HPClaw.exe）

- [ ] **Step 7.4: 备份并替换 HPClaw-x64**

```bash
cd "E:/0612hpclaw/0714"
mv HPClaw-x64 "HPClaw-x64-backup-$(date +%Y%m%d-%H%M%S)"
mkdir HPClaw-x64
cp -r release/win-unpacked/. HPClaw-x64/
```

（`HPClaw-x64*` 未被 git 跟踪且已在忽略列表，旧备份目录 `HPClaw-x64-backup-20260715-162650` 不动。）

- [ ] **Step 7.5: 打包产物冒烟验证**

启动 `HPClaw-x64/HPClaw.exe`，重跑 Step 7.2 验证清单中的 1、3、4 三项。
Expected: 行为与 dev 模式一致

- [ ] **Step 7.6: 收尾提交（如有计划文档勾选更新）**

```bash
git add docs/superpowers/plans/2026-07-15-ai-drawer-mode.md
git commit -m "docs: mark AI drawer mode plan complete"
```

---

## 自查记录

- **规格覆盖**：抽屉组件/方向/宽度/最大化（Task 4）、模式持久化与默认抽屉（Task 1）、设置入口（Task 6）、App 集成与终端触发（Task 5）、textarea 自动增高与按键（Task 2/3）、消息换行渲染（现有 `whitespace-pre-wrap break-words`，AIChat.tsx:236，无需改动）、测试策略与交付（各 Task + Task 7）—— 无缺口。
- **占位符**：无 TBD/TODO；所有代码步骤均含完整代码。
- **类型一致性**：`AIPanelMode`/`UIPrefs`/`UI_PREFS_CHANGE_EVENT`（Task 1 定义，Task 5/6 引用）、`shouldSubmitOnKey`（Task 2 定义，Task 3 引用）、`AIDrawer` props（Task 4 定义，Task 5 引用）已核对一致。
