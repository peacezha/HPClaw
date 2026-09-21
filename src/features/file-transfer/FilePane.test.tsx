// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import FilePane, { createDroppedTransfer, planClipboardMoves } from './FilePane';
import type { FilePaneAdapter } from './FilePane';
import { LOCAL_DRIVES_ROOT } from './localDrives';
import type { FileEntry, FileSide } from '@/shared/fileTransfer';
import type { PaneState } from './controller';

afterEach(cleanup);

// ── Factory helpers ────────────────────────────────────────────────

function createMockAdapter(overrides?: Partial<FilePaneAdapter>): FilePaneAdapter {
  return {
    side: 'local',
    list: vi.fn(),
    mkdir: vi.fn(),
    createFile: vi.fn(),
    rename: vi.fn(),
    removePreview: vi.fn(),
    remove: vi.fn(),
    ...overrides,
  };
}

function createPaneState(overrides?: Partial<PaneState>): PaneState {
  return {
    path: '/home/user',
    entries: [],
    selected: new Set<string>(),
    loading: false,
    error: undefined,
    ...overrides,
  };
}

const fileEntries: FileEntry[] = [
  { name: 'documents', path: '/home/user/documents', kind: 'directory', size: 4096, modifiedAt: 200_000 },
  { name: 'b_files', path: '/home/user/b_files', kind: 'directory', size: 4096, modifiedAt: 100_000 },
  { name: 'a_notes.txt', path: '/home/user/a_notes.txt', kind: 'file', size: 500, modifiedAt: 300_000 },
  { name: 'z_data.bin', path: '/home/user/z_data.bin', kind: 'file', size: 1_000_000, modifiedAt: 400_000 },
];

function getDataRowIds(): string[] {
  return screen.getAllByRole('row').slice(1).map(r =>
    r.getAttribute('data-testid') ?? '',
  );
}

// ── Pure logic: createDroppedTransfer ──────────────────────────────

describe('createDroppedTransfer', () => {
  it('maps a local drop onto the current remote directory without changing either pane path', () => {
    const transfer = createDroppedTransfer({
      sourceSide: 'local',
      sourcePaths: ['D:\\Bio\\reads.fastq.gz'],
      targetSide: 'remote',
      targetPath: '/home/lin/data',
      profileId: 'p1',
    });
    expect(transfer).toMatchObject({
      direction: 'upload',
      localPath: 'D:\\Bio\\reads.fastq.gz',
      remotePath: '/home/lin/data/reads.fastq.gz',
      profileId: 'p1',
    });
  });

  it('returns null when source and target sides are the same', () => {
    const transfer = createDroppedTransfer({
      sourceSide: 'local',
      sourcePaths: ['D:\\a.txt'],
      targetSide: 'local',
      targetPath: 'C:\\target',
      profileId: 'p1',
    });
    expect(transfer).toBeNull();
  });

  it('returns null for empty source paths', () => {
    const transfer = createDroppedTransfer({
      sourceSide: 'remote',
      sourcePaths: [],
      targetSide: 'local',
      targetPath: 'C:\\target',
      profileId: 'p1',
    });
    expect(transfer).toBeNull();
  });

  it('maps a remote drop onto local as download', () => {
    const transfer = createDroppedTransfer({
      sourceSide: 'remote',
      sourcePaths: ['/home/data/results.txt'],
      targetSide: 'local',
      targetPath: 'C:\\Users\\downloads',
      profileId: 'p1',
    });
    expect(transfer).toMatchObject({
      direction: 'download',
      remotePath: '/home/data/results.txt',
      localPath: 'C:\\Users\\downloads\\results.txt',
      profileId: 'p1',
    });
  });
});

// ── Component tests ───────────────────────────────────────────────

describe('FilePane', () => {
  let adapter: FilePaneAdapter;
  let onNavigate: ReturnType<typeof vi.fn>;
  let onSelect: ReturnType<typeof vi.fn>;
  let onDeselectAll: ReturnType<typeof vi.fn>;
  let onDrop: ReturnType<typeof vi.fn>;
  let onOpenFile: ReturnType<typeof vi.fn>;
  let onPreviewFile: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    window.localStorage.clear();
    adapter = createMockAdapter({
      side: 'remote' as FileSide,
      list: vi.fn().mockResolvedValue(fileEntries),
    });
    onNavigate = vi.fn();
    onSelect = vi.fn();
    onDeselectAll = vi.fn();
    onDrop = vi.fn();
    onOpenFile = vi.fn();
    onPreviewFile = vi.fn();
  });

  function renderPane(paneStateOverrides?: Partial<PaneState>) {
    const paneState = createPaneState(paneStateOverrides);
    return render(
      <FilePane
        adapter={adapter}
        paneState={paneState}
        onNavigate={onNavigate}
        onSelect={onSelect}
        onDeselectAll={onDeselectAll}
        onDrop={onDrop}
        onOpenFile={onOpenFile}
        onPreviewFile={onPreviewFile}
      />,
    );
  }

  it('renders a structured API error as text instead of crashing React', () => {
    renderPane({
      error: {
        code: 'SSH_SESSION_REQUIRED',
        message: '集群会话已失效，请重新连接',
      } as unknown as string,
    });

    expect(screen.getByText('集群会话已失效，请重新连接')).toBeInTheDocument();
  });

  it('falls back to this cluster home when its remembered path is denied', async () => {
    adapter = createMockAdapter({
      side: 'remote',
      list: vi.fn().mockRejectedValue({
        error: { code: 'EACCES', message: 'Permission denied' },
      }),
    });
    render(
      <FilePane
        adapter={adapter}
        endpointId="cluster-b"
        fallbackPath="/home/bob"
        paneState={createPaneState({ path: '/home/alice/private' })}
        onNavigate={onNavigate}
        onSelect={onSelect}
        onDeselectAll={onDeselectAll}
        onDrop={onDrop}
        onOpenFile={onOpenFile}
        onPreviewFile={onPreviewFile}
      />,
    );

    await waitFor(() => expect(onNavigate).toHaveBeenCalledWith(
      '/home/bob',
      [],
      true,
      undefined,
    ));
    expect(onNavigate).not.toHaveBeenCalledWith(
      '/home/alice/private',
      [],
      false,
      'Permission denied',
    );
  });

  // ── Test 1a: single-click directory navigates in cluster mode ─────

  it('single-clicking a directory navigates when folderClickNavigates is enabled', () => {
    render(
      <FilePane
        adapter={adapter}
        paneState={createPaneState({ entries: fileEntries })}
        onNavigate={onNavigate}
        onSelect={onSelect}
        onDeselectAll={onDeselectAll}
        onDrop={onDrop}
        onOpenFile={onOpenFile}
        onPreviewFile={onPreviewFile}
        folderClickNavigates
      />,
    );

    const dirRow = screen.getByTestId('file-row-documents');
    fireEvent.click(dirRow);

    expect(onNavigate).toHaveBeenCalledWith(
      '/home/user/documents',
      [],
      true,
      undefined,
    );
    expect(onSelect).not.toHaveBeenCalled();
  });

  // ── Test 2: directory-first sorting ────────────────────────────

  it('renders entries with directory-first sorting', () => {
    renderPane({ entries: fileEntries });

    // With the default sort by name ascending:
    // Dirs: b_files, documents  (b before d)
    // Files: a_notes.txt, z_data.bin
    const rowNames = getDataRowIds();
    expect(rowNames[0]).toContain('b_files');
    expect(rowNames[1]).toContain('documents');
    expect(rowNames[2]).toContain('a_notes.txt');
    expect(rowNames[3]).toContain('z_data.bin');
  });

  // ── Test 3: column sort toggle ─────────────────────────────────

  it('clicking a sortable column header toggles sort direction', () => {
    renderPane({ entries: fileEntries });

    // Click "大小" (Size) header to sort by size ascending.
    // Use getByRole with name matching to find the <th> element.
    const sizeHeader = screen.getByRole('columnheader', { name: /大小/ });
    fireEvent.click(sizeHeader);

    // After clicking, rows should be sorted by size ascending
    let rowNames = getDataRowIds();
    // Dirs have same size, maintain original order: documents, b_files
    // Files sorted by size asc: a_notes.txt (500), z_data.bin (1e6)
    expect(rowNames[0]).toContain('documents');
    expect(rowNames[1]).toContain('b_files');
    expect(rowNames[2]).toContain('a_notes.txt');
    expect(rowNames[3]).toContain('z_data.bin');

    // Click again to sort descending
    const sizeHeaderAgain = screen.getByRole('columnheader', { name: /大小/ });
    fireEvent.click(sizeHeaderAgain);

    rowNames = getDataRowIds();
    // Dirs have same size, maintain original order: documents, b_files
    // Files: z_data.bin (1e6), a_notes.txt (500)
    expect(rowNames[0]).toContain('documents');
    expect(rowNames[1]).toContain('b_files');
    expect(rowNames[2]).toContain('z_data.bin');
    expect(rowNames[3]).toContain('a_notes.txt');
  });

  it('lets users resize columns and exposes the complete filename', () => {
    const longName = 'analysis_generated_result_with_same_prefix_000123.fastq.gz';
    renderPane({
      entries: [{
        name: longName,
        path: `/home/user/${longName}`,
        kind: 'file',
        size: 1024,
        modifiedAt: 500_000,
      }],
    });

    const nameColumn = screen.getByTestId('file-column-name');
    expect(nameColumn).toHaveStyle({ width: '340px' });

    const resizer = screen.getByTestId('column-resizer-name');
    fireEvent.pointerDown(resizer, { clientX: 340, pointerId: 1 });
    fireEvent.pointerMove(window, { clientX: 540, pointerId: 1 });
    fireEvent.pointerUp(window, { clientX: 540, pointerId: 1 });

    expect(nameColumn).toHaveStyle({ width: '540px' });
    expect(screen.getByText(longName).closest('td')).toHaveAttribute('title', longName);
    expect(JSON.parse(
      window.localStorage.getItem('hpclaw:file-table-column-widths:v1:remote') || '{}',
    )).toMatchObject({ name: 540 });
  });

  it('supports keyboard resizing and restores a column default on double-click', () => {
    renderPane({ entries: fileEntries });

    const dateColumn = screen.getByTestId('file-column-date');
    const resizer = screen.getByTestId('column-resizer-date');
    fireEvent.keyDown(resizer, { key: 'ArrowRight' });
    expect(dateColumn).toHaveStyle({ width: '176px' });

    fireEvent.doubleClick(resizer);
    expect(dateColumn).toHaveStyle({ width: '156px' });
  });

  // ── Test 4: double-click directory navigates ───────────────────

  it('double-clicking a directory calls onNavigate', () => {
    renderPane({ entries: fileEntries });

    const dirRow = screen.getByTestId('file-row-documents');
    fireEvent.doubleClick(dirRow);

    // onNavigate should be called with the directory's path and loading
    expect(onNavigate).toHaveBeenCalledWith(
      '/home/user/documents',
      [],
      true,
      undefined,
    );
  });

  it('double-clicking a file requests opening it instead of previewing it', () => {
    renderPane({ entries: fileEntries });

    fireEvent.doubleClick(screen.getByTestId('file-row-a_notes.txt'));

    expect(onOpenFile).toHaveBeenCalledWith(expect.objectContaining({
      name: 'a_notes.txt',
      path: '/home/user/a_notes.txt',
    }));
    expect(onPreviewFile).not.toHaveBeenCalled();
  });

  it('pick mode: double-clicking a file confirms the pick instead of opening or previewing it', () => {
    const onFileDoubleClick = vi.fn();
    render(
      <FilePane
        adapter={adapter}
        paneState={createPaneState({ entries: fileEntries })}
        onNavigate={onNavigate}
        onSelect={onSelect}
        onDeselectAll={onDeselectAll}
        onDrop={onDrop}
        onOpenFile={onOpenFile}
        onPreviewFile={onPreviewFile}
        onFileDoubleClick={onFileDoubleClick}
      />,
    );

    fireEvent.doubleClick(screen.getByTestId('file-row-a_notes.txt'));

    expect(onFileDoubleClick).toHaveBeenCalledWith(expect.objectContaining({
      path: '/home/user/a_notes.txt',
    }));
    expect(onOpenFile).not.toHaveBeenCalled();
    expect(onPreviewFile).not.toHaveBeenCalled();
  });

  it('pick mode: double-clicking a directory still navigates into it', () => {
    const onFileDoubleClick = vi.fn();
    render(
      <FilePane
        adapter={adapter}
        paneState={createPaneState({ entries: fileEntries })}
        onNavigate={onNavigate}
        onSelect={onSelect}
        onDeselectAll={onDeselectAll}
        onDrop={onDrop}
        onOpenFile={onOpenFile}
        onPreviewFile={onPreviewFile}
        onFileDoubleClick={onFileDoubleClick}
      />,
    );

    fireEvent.doubleClick(screen.getByTestId('file-row-documents'));

    expect(onNavigate).toHaveBeenCalledWith(
      '/home/user/documents',
      [],
      true,
      undefined,
    );
    expect(onFileDoubleClick).not.toHaveBeenCalled();
  });

  it('keeps preview as a separate right-click action', () => {
    renderPane({ entries: fileEntries });

    fireEvent.contextMenu(screen.getByTestId('file-row-a_notes.txt'));
    fireEvent.click(screen.getByRole('menuitem', { name: '预览' }));

    expect(onPreviewFile).toHaveBeenCalledWith(expect.objectContaining({
      name: 'a_notes.txt',
    }));
    expect(onOpenFile).not.toHaveBeenCalled();
  });

  it('offers an explicit open-and-edit right-click action', () => {
    renderPane({ entries: fileEntries });

    fireEvent.contextMenu(screen.getByTestId('file-row-a_notes.txt'));
    fireEvent.click(screen.getByRole('menuitem', { name: '打开并编辑' }));

    expect(onOpenFile).toHaveBeenCalledWith(expect.objectContaining({
      name: 'a_notes.txt',
    }));
  });

  it('clamps the context menu upward when right-clicking near the viewport bottom', () => {
    // jsdom 中元素实测尺寸为 0：模拟 200×300 的菜单；jsdom 视口 1024×768
    const rectSpy = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      width: 200, height: 300, top: 0, left: 0, right: 200, bottom: 300, x: 0, y: 0,
    } as DOMRect);
    try {
      renderPane({ entries: fileEntries });

      fireEvent.contextMenu(screen.getByTestId('file-row-a_notes.txt'), { clientX: 100, clientY: 700 });

      const menu = screen.getByTestId('context-menu');
      // 700 + 300 超出视口底 → 向上展开：top = 700 - 300；左侧未溢出保持原位
      expect(menu.style.top).toBe('400px');
      expect(menu.style.left).toBe('100px');
    } finally {
      rectSpy.mockRestore();
    }
  });

  it('copies selected files and pastes into a right-clicked folder', () => {
    const onCopyFiles = vi.fn();
    const onPasteFiles = vi.fn().mockResolvedValue(undefined);
    render(
      <FilePane
        adapter={adapter}
        paneState={createPaneState({
          entries: fileEntries,
          selected: new Set([
            '/home/user/a_notes.txt',
            '/home/user/z_data.bin',
          ]),
        })}
        onNavigate={onNavigate}
        onSelect={onSelect}
        onDeselectAll={onDeselectAll}
        onDrop={onDrop}
        onCopyFiles={onCopyFiles}
        onPasteFiles={onPasteFiles}
        clipboardAvailable
        onOpenFile={onOpenFile}
        onPreviewFile={onPreviewFile}
      />,
    );

    fireEvent.contextMenu(screen.getByTestId('file-row-a_notes.txt'));
    fireEvent.click(screen.getByRole('menuitem', { name: '复制' }));
    expect(onCopyFiles).toHaveBeenCalledWith([
      '/home/user/a_notes.txt',
      '/home/user/z_data.bin',
    ]);

    fireEvent.contextMenu(screen.getByTestId('file-row-documents'));
    fireEvent.click(screen.getByRole('menuitem', { name: '粘贴' }));
    expect(onPasteFiles).toHaveBeenCalledWith('/home/user/documents');
  });

  it('moves files into a child folder when dropped inside the same pane', async () => {
    const dataTransfer = {
      effectAllowed: 'all',
      dropEffect: 'move',
      setData: vi.fn(),
      getData: vi.fn().mockReturnValue(JSON.stringify({
        sourceSide: 'remote',
        sourcePaths: ['/home/user/a_notes.txt'],
      })),
    };
    renderPane({ entries: fileEntries });

    fireEvent.drop(screen.getByTestId('file-row-documents'), { dataTransfer });

    await waitFor(() => expect(adapter.rename).toHaveBeenCalledWith(
      '/home/user/a_notes.txt',
      '/home/user/documents/a_notes.txt',
    ));
    expect(onDrop).not.toHaveBeenCalled();
  });

  it('routes a cross-pane drop directly into the target child folder', () => {
    const dataTransfer = {
      effectAllowed: 'all',
      dropEffect: 'move',
      setData: vi.fn(),
      getData: vi.fn().mockReturnValue(JSON.stringify({
        sourceSide: 'local',
        sourcePaths: ['C:\\data\\reads.fastq.gz'],
      })),
    };
    renderPane({ entries: fileEntries });

    fireEvent.drop(screen.getByTestId('file-row-documents'), { dataTransfer });

    expect(onDrop).toHaveBeenCalledWith(
      ['C:\\data\\reads.fastq.gz'],
      '/home/user/documents',
      'local',
    );
  });

  it('distinguishes two remote cluster endpoints during a drop', () => {
    const dataTransfer = {
      effectAllowed: 'all',
      dropEffect: 'move',
      setData: vi.fn(),
      getData: vi.fn().mockReturnValue(JSON.stringify({
        sourceSide: 'remote',
        sourceEndpoint: 'cluster-a',
        sourcePaths: ['/home/a/result.txt'],
      })),
    };
    render(
      <FilePane
        adapter={adapter}
        endpointId="cluster-b"
        paneState={createPaneState({ entries: fileEntries })}
        onNavigate={onNavigate}
        onSelect={onSelect}
        onDeselectAll={onDeselectAll}
        onDrop={onDrop}
        onOpenFile={onOpenFile}
        onPreviewFile={onPreviewFile}
      />,
    );

    fireEvent.drop(screen.getByTestId('file-row-documents'), { dataTransfer });
    expect(onDrop).toHaveBeenCalledWith(
      ['/home/a/result.txt'],
      '/home/user/documents',
      'remote',
    );
    expect(adapter.rename).not.toHaveBeenCalled();
  });

  // ── Test 5: address bar（地址只显示在输入栏，不再渲染面包屑段）──

  it('address input shows the current path without breadcrumb duplication', () => {
    renderPane({ path: '/home/user/documents', entries: fileEntries });

    const input = screen.getByTestId('address-input') as HTMLInputElement;
    expect(input.value).toBe('/home/user/documents');
    // 面包屑段已移除，避免与输入栏重复显示地址
    expect(screen.queryByRole('button', { name: 'home' })).toBeNull();
  });

  // ── Test 6: empty state ────────────────────────────────────────

  it('renders empty state when there are no entries', () => {
    renderPane({ entries: [], loading: false, error: undefined });

    expect(screen.getByTestId('empty-state')).toBeTruthy();
    expect(screen.getByText('此目录为空')).toBeTruthy();
  });

  // ── Test 7: error state ────────────────────────────────────────

  it('renders error state when there is an error', () => {
    renderPane({ entries: [], loading: false, error: '连接失败' });

    expect(screen.getByTestId('error-state')).toBeTruthy();
    expect(screen.getByText('连接失败')).toBeTruthy();
  });

  // ── Test 8: loading state ──────────────────────────────────────

  it('shows loading spinner while fetching', () => {
    renderPane({ entries: [], loading: true, error: undefined });

    expect(screen.getByTestId('loading-state')).toBeTruthy();
  });

  // ── Test 9: local drives root（此电脑层级）────────────────────

  describe('local drives root', () => {
    function renderLocalPane(paneStateOverrides?: Partial<PaneState>) {
      const localAdapter = createMockAdapter({
        side: 'local' as FileSide,
        list: vi.fn().mockResolvedValue([]),
      });
      return render(
        <FilePane
          adapter={localAdapter}
          paneState={createPaneState(paneStateOverrides)}
          onNavigate={onNavigate}
          onSelect={onSelect}
          onDeselectAll={onDeselectAll}
          onDrop={onDrop}
          onOpenFile={onOpenFile}
          onPreviewFile={onPreviewFile}
        />,
      );
    }

    it('navigates from a drive root up to the drives list', () => {
      renderLocalPane({ path: 'C:\\' });

      fireEvent.click(screen.getByLabelText('上级目录'));

      expect(onNavigate).toHaveBeenCalledWith(LOCAL_DRIVES_ROOT, [], true, undefined);
    });

    it('navigates from a nested Windows path up to its drive root', () => {
      renderLocalPane({ path: 'C:\\Users' });

      fireEvent.click(screen.getByLabelText('上级目录'));

      expect(onNavigate).toHaveBeenCalledWith('C:\\', [], true, undefined);
    });

    it('has no parent button and disables creation buttons at the drives root', () => {
      renderLocalPane({ path: LOCAL_DRIVES_ROOT });

      expect(screen.queryByLabelText('上级目录')).toBeNull();
      expect(screen.getByLabelText('新建文件夹')).toBeDisabled();
      expect(screen.getByLabelText('新建文件')).toBeDisabled();
    });

    it('keeps creation buttons enabled in a real directory', () => {
      renderLocalPane({ path: 'C:\\Users' });

      expect(screen.getByLabelText('新建文件夹')).toBeEnabled();
      expect(screen.getByLabelText('新建文件')).toBeEnabled();
    });
  });

  // ── 剪切：右键菜单 + Ctrl+C/X/V 快捷键 ─────────────────────────

  function renderClipboardPane(overrides?: {
    selected?: Set<string>;
    onCopyFiles?: ReturnType<typeof vi.fn>;
    onCutFiles?: ReturnType<typeof vi.fn>;
    onPasteFiles?: ReturnType<typeof vi.fn>;
    clipboardAvailable?: boolean;
  }) {
    return render(
      <FilePane
        adapter={adapter}
        paneState={createPaneState({
          entries: fileEntries,
          selected: overrides?.selected ?? new Set(['/home/user/a_notes.txt']),
        })}
        onNavigate={onNavigate}
        onSelect={onSelect}
        onDeselectAll={onDeselectAll}
        onDrop={onDrop}
        onCopyFiles={overrides?.onCopyFiles ?? vi.fn()}
        onCutFiles={overrides?.onCutFiles ?? vi.fn()}
        onPasteFiles={overrides?.onPasteFiles ?? vi.fn().mockResolvedValue(undefined)}
        clipboardAvailable={overrides?.clipboardAvailable ?? true}
        onOpenFile={onOpenFile}
        onPreviewFile={onPreviewFile}
      />,
    );
  }

  it('offers a cut right-click action that reports the selected files', () => {
    const onCutFiles = vi.fn();
    renderClipboardPane({
      onCutFiles,
      selected: new Set(['/home/user/a_notes.txt', '/home/user/z_data.bin']),
    });

    fireEvent.contextMenu(screen.getByTestId('file-row-a_notes.txt'));
    fireEvent.click(screen.getByRole('menuitem', { name: '剪切' }));

    expect(onCutFiles).toHaveBeenCalledWith([
      '/home/user/a_notes.txt',
      '/home/user/z_data.bin',
    ]);
  });

  it('routes Ctrl+C / Ctrl+X / Ctrl+V to the clipboard handlers', () => {
    const onCopyFiles = vi.fn();
    const onCutFiles = vi.fn();
    const onPasteFiles = vi.fn().mockResolvedValue(undefined);
    renderClipboardPane({ onCopyFiles, onCutFiles, onPasteFiles });

    fireEvent.keyDown(window, { key: 'c', ctrlKey: true });
    expect(onCopyFiles).toHaveBeenCalledWith(['/home/user/a_notes.txt']);

    fireEvent.keyDown(window, { key: 'x', ctrlKey: true });
    expect(onCutFiles).toHaveBeenCalledWith(['/home/user/a_notes.txt']);

    // Ctrl+V 粘贴到当前目录（pane path）
    fireEvent.keyDown(window, { key: 'v', ctrlKey: true });
    expect(onPasteFiles).toHaveBeenCalledWith('/home/user');
  });

  it('ignores clipboard shortcuts while typing in an input', () => {
    const onCopyFiles = vi.fn();
    renderClipboardPane({ onCopyFiles });

    fireEvent.keyDown(screen.getByTestId('address-input'), { key: 'c', ctrlKey: true });

    expect(onCopyFiles).not.toHaveBeenCalled();
  });
});

// ── planClipboardMoves：剪切粘贴的移动目标规划 ─────────────────────

describe('planClipboardMoves', () => {
  it('maps every cut source into the target directory', () => {
    expect(planClipboardMoves(['/a/b.txt', '/a/dir'], '/c')).toEqual([
      { from: '/a/b.txt', to: '/c/b.txt' },
      { from: '/a/dir', to: '/c/dir' },
    ]);
  });

  it('keeps Windows path separators and compares case-insensitively', () => {
    expect(planClipboardMoves(['C:\\Data\\reads.fastq'], 'D:\\out')).toEqual([
      { from: 'C:\\Data\\reads.fastq', to: 'D:\\out\\reads.fastq' },
    ]);
    // 同一路径不同写法 → 原地移动，跳过
    expect(planClipboardMoves(['C:\\Data\\x.txt'], 'c:\\data')).toEqual([]);
  });

  it('skips no-op moves and moves into own subtree', () => {
    // 原地剪切粘贴 → 跳过
    expect(planClipboardMoves(['/a/b.txt'], '/a')).toEqual([]);
    // 目录移入自身子目录 → 跳过
    expect(planClipboardMoves(['/a/dir'], '/a/dir/sub')).toEqual([]);
  });
});
