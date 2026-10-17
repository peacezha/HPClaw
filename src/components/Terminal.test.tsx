// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup, act } from '@testing-library/react';
import { Terminal } from 'xterm';
import { io, type Socket } from 'socket.io-client';
import TerminalComponent, { createTerminalKeyHandler } from './Terminal';

afterEach(() => {
  delete (window as any).traceDesktop;
});

// 与组件内接线一致：xtermRef.current 与 attachCustomKeyEventHandler 的
// term 是同一个实例，socket 独立；剪贴板走 traceDesktop 通道。
function createKeyHandler(options?: { selection?: string; xtermAvailable?: boolean }) {
  const term = {
    hasSelection: vi.fn(() => Boolean(options?.selection)),
    getSelection: vi.fn(() => options?.selection ?? ''),
    paste: vi.fn(),
  };
  const socket = { emit: vi.fn() };
  const clipboard = {
    readText: vi.fn(async () => 'clipboard-content'),
    writeText: vi.fn(async (_text: string) => {}),
  };
  (window as any).traceDesktop = { clipboard };

  const handler = createTerminalKeyHandler({
    term: term as unknown as Terminal,
    getXterm: () =>
      options?.xtermAvailable === false ? null : (term as unknown as Terminal),
    getSocket: () => socket as unknown as Socket,
  });
  return { handler, term, socket, clipboard };
}

// 粘贴走 clipboard.readText().then(...)，等一个宏任务让回调落地
const flushPaste = () => new Promise(resolve => setTimeout(resolve, 0));

describe('createTerminalKeyHandler', () => {
  it('handles Caps Lock copy while preserving Ctrl+C interrupt without a selection', () => {
    const selected = createKeyHandler({ selection: 'text' });
    const event = new KeyboardEvent('keydown', { key: 'C', ctrlKey: true, cancelable: true });
    expect(selected.handler(event)).toBe(false);
    expect(event.defaultPrevented).toBe(true);
    expect(selected.clipboard.writeText).toHaveBeenCalledWith('text');
    expect(createKeyHandler().handler(new KeyboardEvent('keydown', { key: 'C', ctrlKey: true }))).toBe(true);
  });
  it('uses native browser paste even when the permission-gated Clipboard API exists', () => {
    const { handler, term } = createKeyHandler();
    delete window.traceDesktop;
    const readText = vi.fn();
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { readText } });
    const event = new KeyboardEvent('keydown', { key: 'v', ctrlKey: true, cancelable: true });
    expect(handler(event)).toBe(true);
    expect(event.defaultPrevented).toBe(false);
    expect(readText).not.toHaveBeenCalled();
    expect(term.paste).not.toHaveBeenCalled();
    delete (navigator as any).clipboard;
  });
  it('supports Mac Command+C and Command+V without duplicate paste', async () => {
    const { handler, term, clipboard } = createKeyHandler({ selection: 'selected' });
    expect(handler(new KeyboardEvent('keydown', { key: 'c', metaKey: true }))).toBe(false);
    expect(clipboard.writeText).toHaveBeenCalledWith('selected');
    expect(handler(new KeyboardEvent('keydown', { key: 'v', metaKey: true }))).toBe(false);
    expect(handler(new KeyboardEvent('keyup', { key: 'v', metaKey: true }))).toBe(true);
    await flushPaste();
    expect(term.paste).toHaveBeenCalledTimes(1);
  });

  it('leaves paste to the browser when an HTTP page has no Clipboard API', () => {
    const { handler, clipboard } = createKeyHandler();
    delete (window as any).traceDesktop;
    expect(handler(new KeyboardEvent('keydown', { key: 'v', ctrlKey: true }))).toBe(true);
    expect(clipboard.readText).not.toHaveBeenCalled();
  });

  it('pastes exactly once when both keydown and keyup of Ctrl+V reach the handler', async () => {
    const { handler, term, clipboard } = createKeyHandler();

    expect(handler(new KeyboardEvent('keydown', { key: 'v', ctrlKey: true }))).toBe(false);
    // 按住 Ctrl 先松 V：xterm 对 keyup 也会回调同一处理器，不得二次粘贴
    expect(handler(new KeyboardEvent('keyup', { key: 'v', ctrlKey: true }))).toBe(true);

    await flushPaste();
    expect(clipboard.readText).toHaveBeenCalledTimes(1);
    expect(term.paste).toHaveBeenCalledTimes(1);
    expect(term.paste).toHaveBeenCalledWith('clipboard-content');
  });

  it('copies the selection on Ctrl+C keydown and does not copy again on keyup', () => {
    const { handler, clipboard } = createKeyHandler({ selection: 'ls -la' });

    expect(handler(new KeyboardEvent('keydown', { key: 'c', ctrlKey: true }))).toBe(false);
    expect(handler(new KeyboardEvent('keyup', { key: 'c', ctrlKey: true }))).toBe(true);

    expect(clipboard.writeText).toHaveBeenCalledTimes(1);
    expect(clipboard.writeText).toHaveBeenCalledWith('ls -la');
  });

  it('copies on Ctrl+Shift+C keydown', () => {
    const { handler, clipboard } = createKeyHandler({ selection: 'data' });

    expect(
      handler(new KeyboardEvent('keydown', { key: 'C', ctrlKey: true, shiftKey: true })),
    ).toBe(false);
    expect(clipboard.writeText).toHaveBeenCalledTimes(1);
    expect(clipboard.writeText).toHaveBeenCalledWith('data');
  });

  it('lets Ctrl+C pass through to xterm when there is no selection', () => {
    const { handler, clipboard } = createKeyHandler();

    expect(handler(new KeyboardEvent('keydown', { key: 'c', ctrlKey: true }))).toBe(true);
    expect(clipboard.writeText).not.toHaveBeenCalled();
  });

  it('ignores auto-repeated Ctrl+V keydown so a long press pastes once', async () => {
    const { handler, term, clipboard } = createKeyHandler();

    expect(handler(new KeyboardEvent('keydown', { key: 'v', ctrlKey: true }))).toBe(false);
    expect(
      handler(new KeyboardEvent('keydown', { key: 'v', ctrlKey: true, repeat: true })),
    ).toBe(false);

    await flushPaste();
    expect(clipboard.readText).toHaveBeenCalledTimes(1);
    expect(term.paste).toHaveBeenCalledTimes(1);
  });

  it('falls back to the socket when the xterm instance is gone', async () => {
    const { handler, term, socket } = createKeyHandler({ xtermAvailable: false });

    handler(new KeyboardEvent('keydown', { key: 'v', ctrlKey: true }));

    await flushPaste();
    expect(term.paste).not.toHaveBeenCalled();
    expect(socket.emit).toHaveBeenCalledWith('data', 'clipboard-content');
  });
});

// ─── 组件级：容器尺寸观察（作业面板开合/断点跳变 refit）与 0 尺寸延迟 init ───
// xterm / FitAddon / socket.io 全部 mock，jsdom 不提供 ResizeObserver，自带可控 mock。
// 容器尺寸用 Object.defineProperty 直接 stub clientWidth/clientHeight。

const terminalMocks = vi.hoisted(() => ({
  fit: vi.fn(),
  socket: {
    on: vi.fn(),
    emit: vi.fn(),
    disconnect: vi.fn(),
    connect: vi.fn(),
    connected: true,
  },
}));

vi.mock('xterm', () => ({
  Terminal: vi.fn().mockImplementation(() => ({
    cols: 80,
    rows: 24,
    loadAddon: vi.fn(),
    open: vi.fn(),
    write: vi.fn(),
    writeln: vi.fn(),
    dispose: vi.fn(),
    focus: vi.fn(),
    onData: vi.fn(),
    onSelectionChange: vi.fn(),
    attachCustomKeyEventHandler: vi.fn(),
    registerLinkProvider: vi.fn(),
    hasSelection: vi.fn(() => false),
    getSelection: vi.fn(() => ''),
    buffer: { active: { cursorY: 0, cursorX: 0, baseY: 0 } },
  })),
}));

vi.mock('@xterm/addon-fit', () => ({
  FitAddon: vi.fn().mockImplementation(() => ({ fit: terminalMocks.fit })),
}));

vi.mock('socket.io-client', () => ({
  io: vi.fn(() => terminalMocks.socket),
}));

class MockResizeObserver {
  static instances: MockResizeObserver[] = [];
  callback: ResizeObserverCallback;
  observed: Element[] = [];
  disconnected = false;
  constructor(cb: ResizeObserverCallback) {
    this.callback = cb;
    MockResizeObserver.instances.push(this);
  }
  observe(el: Element) { this.observed.push(el); }
  unobserve() { /* noop */ }
  disconnect() { this.disconnected = true; }
  /** 手动派发一次尺寸变化回调（entry 内容不被组件使用） */
  trigger() {
    if (this.disconnected) return;
    this.callback([], this as unknown as ResizeObserver);
  }
}

function setContainerSize(el: Element, width: number, height: number) {
  Object.defineProperty(el, 'clientWidth', { configurable: true, value: width });
  Object.defineProperty(el, 'clientHeight', { configurable: true, value: height });
}

function renderTerminal() {
  return render(
    <TerminalComponent
      isSidebarOpen={false}
      isLoggedIn
      sshSessionId="sess-test"
      onSocketReady={() => {}}
    />,
  );
}

/** 终端 xterm 挂载点（组件内 terminalRef 对应的 div） */
function getTermEl(container: HTMLElement): HTMLElement {
  const el = container.querySelector('div.absolute.inset-2');
  if (!el) throw new Error('terminal container not found');
  return el as HTMLElement;
}

describe('TerminalComponent 容器尺寸观察', () => {
  beforeEach(() => {
    MockResizeObserver.instances = [];
    vi.stubGlobal('ResizeObserver', MockResizeObserver);
    // jsdom 的 rAF 走真实计时器，与 fake timers 混用不可控；统一走 setTimeout(0)
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => setTimeout(() => cb(0), 0));
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('0 尺寸（hidden）容器不 init，首次非零尺寸时才初始化并同步 pty 尺寸', async () => {
    vi.useFakeTimers();
    const { container } = renderTerminal();
    const termEl = getTermEl(container);
    setContainerSize(termEl, 0, 0);

    // 100ms init 计时 + rAF 重试后尺寸仍为 0 → 挂 ResizeObserver 等待，不 init
    await act(async () => { vi.advanceTimersByTime(200); });
    expect(vi.mocked(io)).not.toHaveBeenCalled();
    expect(terminalMocks.fit).not.toHaveBeenCalled();
    expect(MockResizeObserver.instances).toHaveLength(1);
    expect(MockResizeObserver.instances[0].observed).toContain(termEl);

    // 容器恢复非零尺寸 → observer 触发 init，随后 observer 自 disconnect
    setContainerSize(termEl, 800, 400);
    await act(async () => { MockResizeObserver.instances[0].trigger(); });
    expect(vi.mocked(io)).toHaveBeenCalledTimes(1);
    expect(terminalMocks.fit).toHaveBeenCalled();
    expect(MockResizeObserver.instances[0].disconnected).toBe(true);

    // init 后的 setTimeout(doResize, 100) 会同步一次远端 pty 尺寸
    terminalMocks.socket.emit.mockClear();
    await act(async () => { vi.advanceTimersByTime(150); });
    expect(terminalMocks.socket.emit).toHaveBeenCalledWith('resize', 80, 24);
  });

  it('容器尺寸变化（作业面板开合）时防抖 fit 并 emit resize；0 尺寸回调跳过', async () => {
    vi.useFakeTimers();
    const { container } = renderTerminal();
    const termEl = getTermEl(container);
    setContainerSize(termEl, 800, 400);

    // 非零尺寸 → 100ms 后直接 init；一并消化 init 后的 doResize/isActive 等计时器
    await act(async () => { vi.advanceTimersByTime(1000); });
    expect(vi.mocked(io)).toHaveBeenCalledTimes(1);
    // 无需 init 观察者，只有 init 后挂上的容器观察者（观察外层容器 div）
    expect(MockResizeObserver.instances).toHaveLength(1);
    const containerObserver = MockResizeObserver.instances[0];
    expect(containerObserver.observed).toContain(termEl.parentElement);

    terminalMocks.fit.mockClear();
    terminalMocks.socket.emit.mockClear();

    // 模拟作业面板打开挤压容器宽度 → 观察者回调 → ~120ms 防抖后 fit + emit resize
    setContainerSize(termEl, 460, 400);
    await act(async () => { containerObserver.trigger(); });
    await act(async () => { vi.advanceTimersByTime(100); });
    expect(terminalMocks.fit).not.toHaveBeenCalled(); // 防抖窗口内不 fit
    await act(async () => { vi.advanceTimersByTime(30); });
    expect(terminalMocks.fit).toHaveBeenCalledTimes(1);
    expect(terminalMocks.socket.emit).toHaveBeenCalledWith('resize', 80, 24);

    // hidden 保活容器（0 尺寸）回调：跳过 fit 与 resize 上报
    terminalMocks.fit.mockClear();
    terminalMocks.socket.emit.mockClear();
    setContainerSize(termEl, 0, 0);
    await act(async () => { containerObserver.trigger(); });
    await act(async () => { vi.advanceTimersByTime(500); });
    expect(terminalMocks.fit).not.toHaveBeenCalled();
    expect(terminalMocks.socket.emit).not.toHaveBeenCalled();
  });
});

// ─── shell:ready 焦点策略：自动重连不得从聊天输入框抢焦点 ───
// jsdom 不支持 contenteditable（isContentEditable 恒 undefined），只覆盖 input/textarea。
describe('TerminalComponent shell:ready 焦点策略', () => {
  beforeEach(() => {
    MockResizeObserver.instances = [];
    vi.stubGlobal('ResizeObserver', MockResizeObserver);
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => setTimeout(() => cb(0), 0));
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  async function initTerminalAndGetShellReady() {
    vi.useFakeTimers();
    const utils = renderTerminal();
    setContainerSize(getTermEl(utils.container), 800, 400);
    await act(async () => { vi.advanceTimersByTime(1000); });
    expect(vi.mocked(io)).toHaveBeenCalledTimes(1);
    const shellReady = terminalMocks.socket.on.mock.calls.find(call => call[0] === 'shell:ready')?.[1] as (() => void) | undefined;
    expect(shellReady).toBeTypeOf('function');
    return { ...utils, shellReady: shellReady! };
  }

  /** 组件内创建的 xterm 实例（mock 构造器的第一次产物） */
  function xtermInstance(): { focus: ReturnType<typeof vi.fn> } {
    const results = vi.mocked(Terminal).mock.results;
    return results[results.length - 1].value as { focus: ReturnType<typeof vi.fn> };
  }

  it('焦点在 textarea（聊天输入框）时 shell:ready 不抢焦点；焦点离开后恢复聚焦终端', async () => {
    const { shellReady } = await initTerminalAndGetShellReady();
    const term = xtermInstance();
    term.focus.mockClear();

    const textarea = document.body.appendChild(document.createElement('textarea'));
    textarea.focus();
    expect(document.activeElement).toBe(textarea);
    act(() => shellReady());
    expect(term.focus).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(textarea);

    textarea.remove();
    act(() => shellReady());
    expect(term.focus).toHaveBeenCalledTimes(1);
  });

  it('焦点在 input 元素上时 shell:ready 不抢焦点', async () => {
    const { shellReady } = await initTerminalAndGetShellReady();
    const term = xtermInstance();
    term.focus.mockClear();

    const input = document.body.appendChild(document.createElement('input'));
    input.focus();
    act(() => shellReady());
    expect(term.focus).not.toHaveBeenCalled();
    input.remove();
  });
});
