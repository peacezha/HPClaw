// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act, within } from '@testing-library/react';
import { createRef, forwardRef, useImperativeHandle } from 'react';
import TerminalAI from './TerminalAI';
import type { TerminalHandle } from './Terminal';

// ─── Mock 终端层：不启动真实 xterm/socket，只暴露命令式 handle 与回调 props ───
const terminalMocks = vi.hoisted(() => ({
  handle: {
    executeCommand: vi.fn(async () => ''),
    getSocket: vi.fn(() => null),
    writeToTerminal: vi.fn(),
    pasteText: vi.fn(),
    selectAll: vi.fn(),
    clearScreen: vi.fn(),
    getCursorPosition: vi.fn(() => null),
    getTerminalElement: vi.fn(() => null),
    focus: vi.fn(),
  },
  // TerminalAI 传给 Terminal 的 props（onTerminalSelection 等），测试直接回调
  props: {} as Record<string, any>,
}));

vi.mock('./Terminal', () => ({
  default: forwardRef(function TerminalStub(props: Record<string, any>, ref: React.Ref<TerminalHandle>) {
    terminalMocks.props = props;
    useImperativeHandle(ref, () => terminalMocks.handle);
    return <div data-testid="terminal-stub" />;
  }),
}));

// CommandSuggest 依赖 LocaleProvider，本测试不关心补全下拉，置空
vi.mock('./CommandSuggest', () => ({ default: () => null }));
// 补全服务不真正发请求
vi.mock('../services/aiTerminal', () => ({
  requestAutocomplete: vi.fn(),
  cancelAutocomplete: vi.fn(),
}));

const clipboard = {
  writeText: vi.fn(async (_text: string) => {}),
  readText: vi.fn(async () => 'echo pasted'),
};

function renderTerminalAI() {
  const terminalRef = createRef<TerminalHandle>();
  const utils = render(
    <TerminalAI
      isSidebarOpen={false}
      isLoggedIn
      sshSessionId="sess-1"
      onSocketReady={() => {}}
      onAnalyzeError={vi.fn()}
      onSendToAI={vi.fn()}
      terminalRef={terminalRef}
    />,
  );
  const root = utils.container.firstElementChild as HTMLElement;
  return { terminalRef, root, ...utils };
}

/** 模拟用户在终端划选了一段文字 */
function simulateSelection(text: string) {
  act(() => {
    terminalMocks.props.onTerminalSelection(text, 10, 1);
  });
}

function openContextMenu(root: HTMLElement) {
  fireEvent.contextMenu(root, { clientX: 120, clientY: 200 });
  return screen.getByTestId('terminal-context-menu');
}

beforeEach(() => {
  vi.clearAllMocks();
  window.localStorage.clear();
  (window as any).hpclawDesktop = { clipboard };
});

afterEach(() => {
  cleanup();
  delete (window as any).hpclawDesktop;
});

describe('TerminalAI 右键菜单', () => {
  it('右键弹出菜单：复制（无选区禁用）/粘贴/全选/清屏 + AI 辅助开关', () => {
    const { root } = renderTerminalAI();
    const menu = openContextMenu(root);
    expect(within(menu).getByText('复制').closest('button')).toHaveProperty('disabled', true);
    expect(within(menu).getByText('粘贴')).toBeTruthy();
    expect(within(menu).getByText('全选')).toBeTruthy();
    expect(within(menu).getByText('清屏')).toBeTruthy();
    expect(within(menu).getByText('AI 辅助').closest('button')!.getAttribute('aria-pressed')).toBe('false');
  });

  it('复制：把当前选区写入剪贴板并关闭菜单', () => {
    const { root } = renderTerminalAI();
    simulateSelection('hello world');
    const menu = openContextMenu(root);
    const copyItem = within(menu).getByText('复制').closest('button')!;
    expect(copyItem).toHaveProperty('disabled', false);

    fireEvent.click(copyItem);
    expect(clipboard.writeText).toHaveBeenCalledWith('hello world');
    expect(screen.queryByTestId('terminal-context-menu')).toBeNull();
  });

  it('粘贴：读剪贴板后走 xterm paste 通道', async () => {
    const { root } = renderTerminalAI();
    const menu = openContextMenu(root);
    fireEvent.click(within(menu).getByText('粘贴'));

    await act(async () => {});
    expect(clipboard.readText).toHaveBeenCalledTimes(1);
    expect(terminalMocks.handle.pasteText).toHaveBeenCalledWith('echo pasted');
  });

  it('全选 / 清屏：调用终端 handle 对应能力', () => {
    const { root } = renderTerminalAI();
    let menu = openContextMenu(root);
    fireEvent.click(within(menu).getByText('全选'));
    expect(terminalMocks.handle.selectAll).toHaveBeenCalledTimes(1);

    menu = openContextMenu(root);
    fireEvent.click(within(menu).getByText('清屏'));
    expect(terminalMocks.handle.clearScreen).toHaveBeenCalledTimes(1);
  });

  it('外点与 Esc 都能关闭菜单', () => {
    const { root } = renderTerminalAI();
    openContextMenu(root);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByTestId('terminal-context-menu')).toBeNull();

    openContextMenu(root);
    fireEvent.click(document.body);
    expect(screen.queryByTestId('terminal-context-menu')).toBeNull();
  });
});

describe('TerminalAI 划词 AI 辅助', () => {
  it('默认关闭：划选不弹小窗', () => {
    renderTerminalAI();
    simulateSelection('输出位于 /public/home/u/project 目录下');
    expect(screen.queryByTestId('terminal-assist-panel')).toBeNull();
  });

  it('开关开启后保持菜单展开并持久化；划选即弹小窗，可一键 cd', () => {
    const { root } = renderTerminalAI();
    const menu = openContextMenu(root);
    const toggle = within(menu).getByText('AI 辅助').closest('button')!;
    fireEvent.click(toggle);

    // 菜单保持展开，勾选态更新，开关持久化
    expect(screen.getByTestId('terminal-context-menu')).toBeTruthy();
    expect(toggle.getAttribute('aria-pressed')).toBe('true');
    expect(window.localStorage.getItem('hpclaw_terminal_assist')).toBe('1');

    fireEvent.keyDown(document, { key: 'Escape' }); // 收起菜单再划选
    simulateSelection('输出位于 /public/home/u/project 目录下');

    const panel = screen.getByTestId('terminal-assist-panel');
    expect(within(panel).getByText('检测到路径')).toBeTruthy();
    fireEvent.click(within(panel).getByText('进入该目录'));
    expect(terminalMocks.handle.executeCommand).toHaveBeenCalledWith('cd "/public/home/u/project"', false, false);
    // 执行后小窗关闭，焦点还给终端
    expect(screen.queryByTestId('terminal-assist-panel')).toBeNull();
    expect(terminalMocks.handle.focus).toHaveBeenCalled();
  });

  it('关闭开关后：小窗立即收起，再划选也不弹', () => {
    const { root } = renderTerminalAI();
    let menu = openContextMenu(root);
    fireEvent.click(within(menu).getByText('AI 辅助'));
    simulateSelection('582301');
    expect(screen.getByTestId('terminal-assist-panel')).toBeTruthy();

    menu = openContextMenu(root);
    fireEvent.click(within(menu).getByText('AI 辅助'));
    expect(window.localStorage.getItem('hpclaw_terminal_assist')).toBe('0');
    expect(screen.queryByTestId('terminal-assist-panel')).toBeNull();

    fireEvent.keyDown(document, { key: 'Escape' });
    simulateSelection('582301');
    expect(screen.queryByTestId('terminal-assist-panel')).toBeNull();
  });
});
