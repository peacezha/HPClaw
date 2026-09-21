// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor, within } from '@testing-library/react';
import ClusterFileTree from './ClusterFileTree';
import type { FileEntry } from '@/shared/fileTransfer';
import {
  copyRemote,
  listRemoteFiles,
  removePreviewRemote,
  removeRemote,
  renameRemote,
  statRemote,
} from '../features/file-transfer/api';

vi.mock('../features/file-transfer/api', () => ({
  listRemoteFiles: vi.fn(async () => ({
    entries: [
      { name: 'refs', path: '/home/u/refs', kind: 'directory', size: 4096, modifiedAt: 0 },
      { name: 'genes.gtf', path: '/home/u/genes.gtf', kind: 'file', size: 100, modifiedAt: 0 },
    ],
  })),
  renameRemote: vi.fn(async () => ({ ok: true })),
  copyRemote: vi.fn(async () => ({ paths: [] })),
  removeRemote: vi.fn(async () => ({ removed: 1 })),
  removePreviewRemote: vi.fn(async () => ({ entries: [], total: 1, recursive: true })),
  statRemote: vi.fn(),
  walkRemote: vi.fn(),
  enqueueTransfer: vi.fn(),
}));

// 预览组件内部会发起预览请求，树菜单测试只关心它是否被打开
vi.mock('../features/file-transfer/FilePreview', () => ({
  default: ({ file }: { file: FileEntry }) => (
    <div data-testid="file-preview-mock">{file.path}</div>
  ),
}));

afterEach(cleanup);

beforeEach(() => {
  vi.clearAllMocks();
});

function renderTree(props: {
  pickKind?: 'file' | 'folder' | 'any';
  selectedPath?: string | null;
  onSelect?: (entry: FileEntry) => void;
  onConfirmPick?: (path: string) => void;
  onCancelPick?: () => void;
}) {
  return render(
    <ClusterFileTree
      sessionId="s1"
      home="/home/u"
      pickMode
      selectedPath={props.selectedPath ?? null}
      onSelect={props.onSelect ?? (() => {})}
      pickKind={props.pickKind}
      onConfirmPick={props.onConfirmPick ?? (() => {})}
      onCancelPick={props.onCancelPick ?? (() => {})}
    />,
  );
}

function renderFileTree(props?: { onSelect?: (entry: FileEntry) => void }) {
  return render(
    <ClusterFileTree
      sessionId="s1"
      home="/home/u"
      selectedPath={null}
      onSelect={props?.onSelect ?? (() => {})}
    />,
  );
}

async function openMenuOn(name: string) {
  fireEvent.contextMenu(await screen.findByText(name));
  return screen.findByTestId('tree-context-menu');
}

describe('ClusterFileTree 路径选取模式', () => {
  it('pickKind=file：选中文件可确认并回传文件路径；选中目录不可确认', async () => {
    const onSelect = vi.fn();
    const onConfirmPick = vi.fn();
    const { rerender } = renderTree({ pickKind: 'file', onSelect, onConfirmPick });

    // 未选中时给出选文件提示，确认禁用
    expect(await screen.findByText('genes.gtf')).toBeInTheDocument();
    expect(screen.getByText('请选择一个文件')).toBeInTheDocument();
    expect(screen.getByText('选择此文件')).toBeDisabled();

    // 单击文件行 → 通知父级选中；父级回传 selectedPath 后可确认
    fireEvent.click(screen.getByText('genes.gtf'));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ path: '/home/u/genes.gtf' }));

    rerender(
      <ClusterFileTree
        sessionId="s1" home="/home/u" pickMode pickKind="file"
        selectedPath="/home/u/genes.gtf" onSelect={onSelect} onConfirmPick={onConfirmPick}
      />,
    );
    const confirm = screen.getByText('选择此文件');
    expect(confirm).toBeEnabled();
    fireEvent.click(confirm);
    expect(onConfirmPick).toHaveBeenCalledWith('/home/u/genes.gtf');

    // 选中目录时不允许按文件确认
    rerender(
      <ClusterFileTree
        sessionId="s1" home="/home/u" pickMode pickKind="file"
        selectedPath="/home/u/refs" onSelect={onSelect} onConfirmPick={onConfirmPick}
      />,
    );
    expect(screen.getByText('选择此文件')).toBeDisabled();
  });

  it('pickKind=any：文件或目录均可确认', async () => {
    const onConfirmPick = vi.fn();
    renderTree({ pickKind: 'any', selectedPath: '/home/u/genes.gtf', onConfirmPick });
    expect(await screen.findByText('genes.gtf')).toBeInTheDocument();

    fireEvent.click(screen.getByText('选择选中项'));
    expect(onConfirmPick).toHaveBeenCalledWith('/home/u/genes.gtf');
  });

  it('pickKind=folder（默认）：选中文件时回传其所在目录（旧行为保持）', async () => {
    const onConfirmPick = vi.fn();
    renderTree({ selectedPath: '/home/u/genes.gtf', onConfirmPick });
    expect(await screen.findByText('genes.gtf')).toBeInTheDocument();

    const confirm = screen.getByText('选择此目录');
    expect(confirm).toBeEnabled();
    fireEvent.click(confirm);
    expect(onConfirmPick).toHaveBeenCalledWith('/home/u');
  });

  it('选取模式下右键不弹文件操作菜单', async () => {
    renderTree({});
    fireEvent.contextMenu(await screen.findByText('genes.gtf'));
    expect(screen.queryByTestId('tree-context-menu')).toBeNull();
  });
});

describe('ClusterFileTree 右键菜单', () => {
  it('右键文件条目弹出常用操作菜单', async () => {
    renderFileTree();
    const menu = await openMenuOn('genes.gtf');
    for (const label of ['打开', '复制', '剪切', '粘贴', '复制路径', '重命名', '下载到本地', '删除']) {
      expect(within(menu).getByRole('menuitem', { name: label })).toBeInTheDocument();
    }
    // 无剪贴板时粘贴禁用；无桌面桥时下载禁用
    expect(within(menu).getByRole('menuitem', { name: '粘贴' })).toBeDisabled();
    expect(within(menu).getByRole('menuitem', { name: '下载到本地' })).toBeDisabled();
  });

  it('“打开”文件触发预览浮层', async () => {
    renderFileTree();
    const menu = await openMenuOn('genes.gtf');
    fireEvent.click(within(menu).getByRole('menuitem', { name: '打开' }));
    expect(await screen.findByTestId('file-preview-mock')).toHaveTextContent('/home/u/genes.gtf');
  });

  it('复制路径写入系统剪贴板', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
    renderFileTree();
    const menu = await openMenuOn('genes.gtf');
    fireEvent.click(within(menu).getByRole('menuitem', { name: '复制路径' }));
    expect(writeText).toHaveBeenCalledWith('/home/u/genes.gtf');
  });

  it('复制后粘贴到目录条目走 copyRemote 并刷新目录', async () => {
    renderFileTree();
    let menu = await openMenuOn('genes.gtf');
    fireEvent.click(within(menu).getByRole('menuitem', { name: '复制' }));

    menu = await openMenuOn('refs');
    fireEvent.click(within(menu).getByRole('menuitem', { name: '粘贴' }));

    await waitFor(() => expect(copyRemote).toHaveBeenCalledWith(
      's1',
      ['/home/u/genes.gtf'],
      '/home/u/refs',
    ));
    expect(renameRemote).not.toHaveBeenCalled();
    // 初始加载一次 + 粘贴后强制刷新目标目录一次
    await waitFor(() => expect(listRemoteFiles).toHaveBeenCalledWith('s1', '/home/u/refs'));
  });

  it('剪切后粘贴到目录条目走 renameRemote 移动', async () => {
    renderFileTree();
    let menu = await openMenuOn('genes.gtf');
    fireEvent.click(within(menu).getByRole('menuitem', { name: '剪切' }));

    menu = await openMenuOn('refs');
    fireEvent.click(within(menu).getByRole('menuitem', { name: '粘贴' }));

    await waitFor(() => expect(renameRemote).toHaveBeenCalledWith(
      's1',
      '/home/u/genes.gtf',
      '/home/u/refs/genes.gtf',
    ));
    expect(copyRemote).not.toHaveBeenCalled();
  });

  it('重命名通过行内输入提交并调用 renameRemote', async () => {
    renderFileTree();
    const menu = await openMenuOn('genes.gtf');
    fireEvent.click(within(menu).getByRole('menuitem', { name: '重命名' }));

    const input = await screen.findByTestId('tree-rename-input');
    fireEvent.change(input, { target: { value: 'renamed.gtf' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => expect(renameRemote).toHaveBeenCalledWith(
      's1',
      '/home/u/genes.gtf',
      '/home/u/renamed.gtf',
    ));
  });

  it('删除需确认，确认后调用 removeRemote', async () => {
    renderFileTree();
    const menu = await openMenuOn('genes.gtf');
    fireEvent.click(within(menu).getByRole('menuitem', { name: '删除' }));

    const dialog = await screen.findByTestId('tree-delete-confirm-dialog');
    expect(removePreviewRemote).toHaveBeenCalledWith('s1', '/home/u/genes.gtf', true);
    fireEvent.click(within(dialog).getByRole('button', { name: '删除' }));

    await waitFor(() => expect(removeRemote).toHaveBeenCalledWith('s1', '/home/u/genes.gtf', true));
  });

  it('视图根（家目录）不显示剪切/重命名/删除', async () => {
    renderFileTree();
    const menu = await openMenuOn('u');
    expect(within(menu).queryByRole('menuitem', { name: '剪切' })).toBeNull();
    expect(within(menu).queryByRole('menuitem', { name: '重命名' })).toBeNull();
    expect(within(menu).queryByRole('menuitem', { name: '删除' })).toBeNull();
    expect(within(menu).getByRole('menuitem', { name: '复制路径' })).toBeInTheDocument();
  });
});

describe('ClusterFileTree 地址栏跳转', () => {
  beforeEach(() => {
    (window as any).HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  function mockStat(entry: FileEntry | Error) {
    (statRemote as ReturnType<typeof vi.fn>).mockImplementation(async () => {
      if (entry instanceof Error) throw entry;
      return { entry };
    });
  }

  it('输入嵌套目录路径回车跳转：stat 探测、逐级加载、选中目标目录', async () => {
    const dirEntry: FileEntry = { name: 'refs', path: '/home/u/refs', kind: 'directory', size: 4096, modifiedAt: 0 };
    mockStat(dirEntry);
    const onSelect = vi.fn();
    renderFileTree({ onSelect });
    await screen.findByText('refs');

    const input = screen.getByLabelText('输入路径，回车跳转');
    fireEvent.change(input, { target: { value: '/home/u/refs' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => expect(onSelect).toHaveBeenCalledWith(dirEntry));
    expect(statRemote).toHaveBeenCalledWith('s1', '/home/u/refs');
    await waitFor(() => expect((listRemoteFiles as ReturnType<typeof vi.fn>).mock.calls.some(c => c[1] === '/home/u/refs')).toBe(true));
  });

  it('输入文件路径跳转：选中该文件本身', async () => {
    const fileEntry: FileEntry = { name: 'genes.gtf', path: '/home/u/genes.gtf', kind: 'file', size: 100, modifiedAt: 0 };
    mockStat(fileEntry);
    const onSelect = vi.fn();
    renderFileTree({ onSelect });
    await screen.findByText('refs');

    const input = screen.getByLabelText('输入路径，回车跳转');
    fireEvent.change(input, { target: { value: '/home/u/genes.gtf' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => expect(onSelect).toHaveBeenCalledWith(fileEntry));
  });

  it('支持 ~ 前缀按家目录解析', async () => {
    const dirEntry: FileEntry = { name: 'refs', path: '/home/u/refs', kind: 'directory', size: 4096, modifiedAt: 0 };
    mockStat(dirEntry);
    const onSelect = vi.fn();
    renderFileTree({ onSelect });
    await screen.findByText('refs');

    const input = screen.getByLabelText('输入路径，回车跳转');
    fireEvent.change(input, { target: { value: '~/refs' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => expect(statRemote).toHaveBeenCalledWith('s1', '/home/u/refs'));
    await waitFor(() => expect(onSelect).toHaveBeenCalledWith(dirEntry));
  });

  it('路径不存在时显示错误', async () => {
    mockStat(new Error('No such file'));
    renderFileTree();
    await screen.findByText('refs');

    const input = screen.getByLabelText('输入路径，回车跳转');
    fireEvent.change(input, { target: { value: '/home/u/missing' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => expect(screen.getByText(/跳转失败|路径不存在/)).toBeTruthy());
  });

  it('目标在家目录之外时给出提示且不发起 stat', async () => {
    const onSelect = vi.fn();
    renderFileTree({ onSelect });
    await screen.findByText('refs');

    const input = screen.getByLabelText('输入路径，回车跳转');
    fireEvent.change(input, { target: { value: '/etc/hosts' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => expect(screen.getByText(/不在当前根目录/)).toBeTruthy());
    expect(statRemote).not.toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled();
  });
});
