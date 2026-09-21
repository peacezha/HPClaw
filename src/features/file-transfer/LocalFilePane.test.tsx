// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { useCallback, useState } from 'react';
import LocalFilePane from './LocalFilePane';
import { LOCAL_DRIVES_ROOT } from './localDrives';
import { mockHpclawDesktop } from './testFixtures';
import type { PaneState } from './controller';
import type { FileEntry } from '@/shared/fileTransfer';

afterEach(cleanup);

function createPaneState(overrides?: Partial<PaneState>): PaneState {
  return {
    path: LOCAL_DRIVES_ROOT,
    entries: [],
    selected: new Set<string>(),
    loading: false,
    error: undefined,
    ...overrides,
  };
}

type NavigateSpy = ReturnType<typeof vi.fn>;

/** 模拟工作区的受控 pane：onNavigate 的结果回灌进 paneState。 */
function Harness({ onNavigate }: { onNavigate: NavigateSpy }) {
  const [pane, setPane] = useState<PaneState>(createPaneState());
  // 回调引用必须稳定：FilePane 的加载 effect 依赖 onNavigate 链路，
  // 每次渲染重建会导致 effect 反复触发形成死循环
  const handleNavigate = useCallback(
    (path: string, entries: FileEntry[], loading?: boolean, error?: string) => {
      onNavigate(path, entries, loading, error);
      setPane((prev) => ({ ...prev, path, entries, loading: Boolean(loading), error }));
    },
    [onNavigate],
  );
  return (
    <LocalFilePane
      paneState={pane}
      onNavigate={handleNavigate}
      onSelect={() => {}}
      onDeselectAll={() => {}}
      onDrop={() => {}}
      onOpenFile={() => {}}
      onPreviewFile={() => {}}
    />
  );
}

describe('LocalFilePane drives root', () => {
  let listDrives: ReturnType<typeof vi.fn>;
  let list: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    window.localStorage.clear();
    listDrives = vi.fn().mockResolvedValue(['C:\\', 'D:\\']);
    list = vi.fn().mockResolvedValue([]);
    const desktop = mockHpclawDesktop();
    desktop.localFiles.listDrives = listDrives;
    desktop.localFiles.list = list;
    window.hpclawDesktop = desktop;
  });

  afterEach(() => {
    delete window.hpclawDesktop;
  });

  it('lists drives as directory entries instead of calling list at the drives root', async () => {
    const onNavigate = vi.fn();
    render(<Harness onNavigate={onNavigate} />);

    // 盘符以目录条目形式展示，双击即可进入
    expect(await screen.findByTestId('file-row-C:\\')).toBeInTheDocument();
    expect(screen.getByTestId('file-row-D:\\')).toBeInTheDocument();
    expect(listDrives).toHaveBeenCalledTimes(1);
    expect(list).not.toHaveBeenCalled();
    expect(onNavigate).toHaveBeenCalledWith(
      LOCAL_DRIVES_ROOT,
      [
        { name: 'C:\\', path: 'C:\\', kind: 'directory', size: 0, modifiedAt: 0 },
        { name: 'D:\\', path: 'D:\\', kind: 'directory', size: 0, modifiedAt: 0 },
      ],
      false,
      undefined,
    );
  });

  it('double-clicking a drive navigates into it', async () => {
    const onNavigate = vi.fn();
    render(<Harness onNavigate={onNavigate} />);

    fireEvent.doubleClick(await screen.findByTestId('file-row-D:\\'));

    expect(onNavigate).toHaveBeenCalledWith('D:\\', [], true, undefined);
  });
});
