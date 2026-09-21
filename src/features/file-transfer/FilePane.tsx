import { Fragment, memo, useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Folder,
  File,
  Link,
  Trash2,
  Pencil,
  FolderPlus,
  FilePlus,
  RefreshCw,
  Copy,
  Eye,
  Loader2,
  AlertTriangle,
  Inbox,
  ArrowUp,
  Upload,
  Download,
  ExternalLink,
  ClipboardPaste,
  HardDrive,
  Scissors,
} from 'lucide-react';
import type { FileEntry, FileSide, TransferTask, TransferDirection } from '@/shared/fileTransfer';
import type { PaneState } from './controller';
import { LOCAL_DRIVES_ROOT, isLocalDrivesRoot, isWindowsDriveRoot } from './localDrives';
import { isPermissionDeniedError, toDisplayError } from '../../utils/displayError';
import { useContextMenuPosition } from '../../components/useContextMenuPosition';

// ---- Types ----

export interface RemovePreview {
  entries: FileEntry[];
  total: number;
  recursive?: boolean;
}

export interface FilePaneAdapter {
  side: FileSide;
  list(path: string, signal: AbortSignal): Promise<FileEntry[]>;
  mkdir(path: string): Promise<void>;
  createFile(path: string): Promise<void>;
  rename(from: string, to: string): Promise<void>;
  removePreview(paths: string[]): Promise<RemovePreview>;
  remove(paths: string[]): Promise<void>;
}

export interface FilePaneProps {
  adapter: FilePaneAdapter;
  paneState: PaneState;
  onNavigate: (
    path: string,
    entries: FileEntry[],
    loading?: boolean,
    error?: string,
  ) => void;
  onSelect: (paths: string[]) => void;
  onDeselectAll: () => void;
  onDrop: (sourcePaths: string[], targetPath: string, sourceSide: FileSide) => void;
  onTransfer?: (paths: string[]) => void;
  onCopyFiles?: (paths: string[]) => void;
  onCutFiles?: (paths: string[]) => void;
  onPasteFiles?: (targetDirectory: string) => void | Promise<void>;
  clipboardAvailable?: boolean;
  onCreateFolder?: () => void;
  onOpenFile: (entry: FileEntry) => void;
  onPreviewFile: (entry: FileEntry) => void;
  /** 覆盖双击文件的默认行为（默认调用 onOpenFile）；路径选取模式用来直接确认选取 */
  onFileDoubleClick?: (entry: FileEntry) => void;
  readOnly?: boolean;
  /** 单击文件夹时直接进入该目录（用于远程/集群面板） */
  folderClickNavigates?: boolean;
  /** 外部事件（如传输完成）触发当前目录重新读取。 */
  refreshToken?: number;
  /** 具体端点身份；用于区分两个都属于 remote 的不同集群。 */
  endpointId?: string;
  /** 保存的历史目录失去权限时，自动回到该端点自己的 home。 */
  fallbackPath?: string;
}

type FileTableColumn = 'name' | 'size' | 'date' | 'permissions';
type FileTableColumnWidths = Record<FileTableColumn, number>;

const DEFAULT_COLUMN_WIDTHS: FileTableColumnWidths = {
  name: 340,
  size: 92,
  date: 156,
  permissions: 108,
};

const MIN_COLUMN_WIDTHS: FileTableColumnWidths = {
  name: 180,
  size: 72,
  date: 120,
  permissions: 82,
};

const MAX_COLUMN_WIDTH = 2000;
const COLUMN_WIDTH_STORAGE_PREFIX = 'hpclaw:file-table-column-widths:v1:';

function clampColumnWidth(column: FileTableColumn, width: number): number {
  if (!Number.isFinite(width)) return DEFAULT_COLUMN_WIDTHS[column];
  return Math.min(
    MAX_COLUMN_WIDTH,
    Math.max(MIN_COLUMN_WIDTHS[column], Math.round(width)),
  );
}

function readStoredColumnWidths(side: FileSide): FileTableColumnWidths {
  if (typeof window === 'undefined') return { ...DEFAULT_COLUMN_WIDTHS };

  try {
    const raw = window.localStorage.getItem(`${COLUMN_WIDTH_STORAGE_PREFIX}${side}`);
    if (!raw) return { ...DEFAULT_COLUMN_WIDTHS };
    const stored = JSON.parse(raw) as Partial<FileTableColumnWidths>;
    return {
      name: clampColumnWidth('name', Number(stored.name)),
      size: clampColumnWidth('size', Number(stored.size)),
      date: clampColumnWidth('date', Number(stored.date)),
      permissions: clampColumnWidth('permissions', Number(stored.permissions)),
    };
  } catch {
    return { ...DEFAULT_COLUMN_WIDTHS };
  }
}

// ---- Helpers ----

function formatSize(bytes: number): string {
  if (bytes === 0) return '-';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

function formatDate(ms: number): string {
  if (!ms) return '-';
  const d = new Date(ms);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatPermissions(mode?: number): string {
  if (mode === undefined) return '-';
  const perm = mode & 0o777;
  const r = (n: number) => (perm & n ? 'r' : '-');
  const w = (n: number) => (perm & n ? 'w' : '-');
  const x = (n: number) => (perm & n ? 'x' : '-');
  return `${r(0o400)}${w(0o200)}${x(0o100)}${r(0o040)}${w(0o020)}${x(0o010)}${r(0o004)}${w(0o002)}${x(0o001)}`;
}

function getPathSegments(path: string): { name: string; fullPath: string }[] {
  if (!path) return [];
  const isWindows = /^[A-Za-z]:\\/.test(path) || path.includes('\\');

  if (isWindows) {
    const parts = path.split('\\').filter(Boolean);
    const segments: { name: string; fullPath: string }[] = [];
    let accumulated = '';
    for (let i = 0; i < parts.length; i++) {
      if (i === 0) {
        accumulated = parts[i] + '\\';
        segments.push({ name: parts[i] + '\\', fullPath: accumulated });
      } else {
        accumulated += parts[i] + '\\';
        segments.push({ name: parts[i], fullPath: accumulated.replace(/\\$/, '') });
      }
    }
    return segments;
  }

  // Unix / remote path
  if (!path.startsWith('/')) return [];
  if (path === '/') return [{ name: '/', fullPath: '/' }];

  const parts = path.split('/').filter(Boolean);
  const segments: { name: string; fullPath: string }[] = [
    { name: '/', fullPath: '/' },
  ];
  let accumulated = '/';
  for (const part of parts) {
    accumulated += part + '/';
    segments.push({
      name: part,
      fullPath: accumulated.replace(/\/$/, '') || '/',
    });
  }
  return segments;
}

function getParentPath(currentPath: string): string | null {
  if (!currentPath) return null;
  // 盘符列表层级（此电脑）已是最顶层
  if (isLocalDrivesRoot(currentPath)) return null;
  // Windows 盘符根（如 C:\ 或 C:/）的上一级是盘符列表
  if (isWindowsDriveRoot(currentPath)) return LOCAL_DRIVES_ROOT;
  // Unix path
  if (currentPath.startsWith('/')) {
    if (currentPath === '/') return null;
    const parent = currentPath.replace(/\/[^/]+$/, '') || '/';
    return parent;
  }
  // Windows path (e.g. C:\Users\Admin)
  if (/^[A-Za-z]:\\/.test(currentPath)) {
    const parent = currentPath.replace(/\\[^\\]+$/, '');
    if (parent.endsWith(':')) return parent + '\\';
    return parent;
  }
  return null;
}

function pathSeparator(filePath: string): '/' | '\\' {
  return filePath.includes('\\') ? '\\' : '/';
}

function pathBaseName(filePath: string): string {
  return filePath.replace(/[/\\]+$/, '').split(/[/\\]/).pop() || '';
}

function joinFilePath(directory: string, name: string): string {
  const separator = pathSeparator(directory);
  return `${directory.replace(/[/\\]+$/, '')}${separator}${name}`;
}

function comparablePath(filePath: string): string {
  const windows = filePath.includes('\\') || /^[A-Za-z]:/.test(filePath);
  const normalized = filePath.replace(/[\\/]+/g, '/').replace(/\/$/, '');
  return windows ? normalized.toLowerCase() : normalized;
}

function cannotMoveInto(sourcePath: string, targetDirectory: string): boolean {
  const source = comparablePath(sourcePath);
  const target = comparablePath(targetDirectory);
  return target === source || target.startsWith(`${source}/`);
}

/** 剪切粘贴的移动计划：为每个源计算目标路径，跳过原地移动与"移入自身子目录" */
export function planClipboardMoves(
  paths: string[],
  targetDirectory: string,
): { from: string; to: string }[] {
  return paths
    .map((from) => ({ from, to: joinFilePath(targetDirectory, pathBaseName(from)) }))
    .filter(
      (move) =>
        comparablePath(move.from) !== comparablePath(move.to) &&
        !cannotMoveInto(move.from, targetDirectory),
    );
}

export function createDroppedTransfer(params: {
  sourceSide: FileSide;
  sourcePaths: string[];
  targetSide: FileSide;
  targetPath: string;
  profileId: string;
}): Omit<
  TransferTask,
  'id' | 'state' | 'createdAt' | 'updatedAt' | 'bytesPerSecond'
> | null {
  const { sourceSide, sourcePaths, targetSide, targetPath, profileId } = params;

  if (sourceSide === targetSide) return null;
  if (sourcePaths.length === 0) return null;

  const sourcePath = sourcePaths[0];
  const sourceName = sourcePath.split(/[/\\]/).pop() || '';
  const direction: TransferDirection =
    sourceSide === 'local' ? 'upload' : 'download';

  let localPath: string;
  let remotePath: string;

  if (direction === 'upload') {
    localPath = sourcePath;
    remotePath =
      targetPath + (targetPath.endsWith('/') ? '' : '/') + sourceName;
  } else {
    remotePath = sourcePath;
    localPath =
      targetPath + (targetPath.endsWith('\\') ? '' : '\\') + sourceName;
  }

  return {
    profileId,
    direction,
    localPath,
    remotePath,
    temporaryPath: '',
    totalBytes: 0,
    transferredBytes: 0,
    conflictPolicy: 'ask',
    verificationMode: 'size',
    retryCount: 0,
  };
}

// ---- File Entry Icon ----

function FileEntryIcon({ kind, path }: { kind: string; path: string }) {
  // 盘符条目（此电脑层级下的 C:\ 等）用硬盘图标区分普通文件夹
  if (isWindowsDriveRoot(path)) {
    return <HardDrive className="w-4 h-4 text-amber-400 shrink-0" />;
  }
  switch (kind) {
    case 'directory':
      return <Folder className="w-4 h-4 text-amber-400 shrink-0" />;
    case 'symlink':
      return <Link className="w-4 h-4 text-cyan-400 shrink-0" />;
    default:
      return <File className="w-4 h-4 text-scholar-400 shrink-0" />;
  }
}

// ---- File Row（memo 化：选择/列宽变化时仅受影响的行重渲染）----

interface FileRowProps {
  entry: FileEntry;
  index: number;
  selected: boolean;
  isRenaming: boolean;
  renameValue: string;
  renameInputRef: React.RefObject<HTMLInputElement | null>;
  onRenameValueChange: (value: string) => void;
  onRenameSubmit: () => void;
  onRenameCancel: () => void;
  onRowClick: (e: React.MouseEvent, entry: FileEntry, index: number) => void;
  onRowDoubleClick: (entry: FileEntry) => void;
  onRowContextMenu: (e: React.MouseEvent, entry: FileEntry) => void;
  onRowDragStart: (e: React.DragEvent, entry: FileEntry) => void;
  dropTarget: boolean;
  onRowDragOver: (e: React.DragEvent, entry: FileEntry) => void;
  onRowDragLeave: (e: React.DragEvent, entry: FileEntry) => void;
  onRowDrop: (e: React.DragEvent, entry: FileEntry) => void;
}

// props 全部为原始值或稳定引用；行内事件处理器在行组件内部从 entry 派生，
// 数千文件的目录中切换选择时只有选中态变化的两行重渲染
const FileRow = memo(function FileRow({
  entry,
  index,
  selected,
  isRenaming,
  renameValue,
  renameInputRef,
  onRenameValueChange,
  onRenameSubmit,
  onRenameCancel,
  onRowClick,
  onRowDoubleClick,
  onRowContextMenu,
  onRowDragStart,
  dropTarget,
  onRowDragOver,
  onRowDragLeave,
  onRowDrop,
}: FileRowProps) {
  return (
    <tr
      data-selected={selected}
      data-drop-target={dropTarget}
      data-testid={`file-row-${entry.name}`}
      draggable={!isRenaming}
      onDragStart={(e) => onRowDragStart(e, entry)}
      onDragOver={(e) => onRowDragOver(e, entry)}
      onDragLeave={(e) => onRowDragLeave(e, entry)}
      onDrop={(e) => onRowDrop(e, entry)}
      onClick={(e) => onRowClick(e, entry, index)}
      onDoubleClick={() => onRowDoubleClick(entry)}
      onContextMenu={(e) => onRowContextMenu(e, entry)}
    >
      <td className="file-transfer-name-cell" title={entry.name}>
        <div className="file-transfer-name-content">
          <FileEntryIcon kind={entry.kind} path={entry.path} />
          {isRenaming ? (
            <input
              ref={renameInputRef}
              className="file-transfer-inline-input"
              value={renameValue}
              onChange={(e) => onRenameValueChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onRenameSubmit();
                if (e.key === 'Escape') onRenameCancel();
              }}
              onBlur={onRenameSubmit}
              data-testid="rename-input"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="file-transfer-name-text">{entry.name}</span>
          )}
        </div>
      </td>
      <td className="file-transfer-size-cell">
        {entry.kind === 'directory'
          ? '-'
          : formatSize(entry.size)}
      </td>
      <td className="file-transfer-date-cell">
        {formatDate(entry.modifiedAt)}
      </td>
      <td className="file-transfer-perm-cell">
        {formatPermissions(entry.permissions)}
      </td>
    </tr>
  );
});

// ---- Component ----

export default function FilePane({
  adapter,
  paneState,
  onNavigate,
  onSelect,
  onDeselectAll,
  onDrop,
  onTransfer,
  onCopyFiles,
  onCutFiles,
  onPasteFiles,
  clipboardAvailable = false,
  onOpenFile,
  onPreviewFile,
  onFileDoubleClick,
  readOnly = false,
  folderClickNavigates = false,
  refreshToken = 0,
  endpointId = adapter.side,
  fallbackPath,
}: FilePaneProps) {
  const { path, entries, selected, loading, error } = paneState;

  const fallbackFromDeniedPath = useCallback((targetPath: string, cause: unknown): boolean => {
    if (
      !fallbackPath ||
      comparablePath(targetPath) === comparablePath(fallbackPath) ||
      !isPermissionDeniedError(cause)
    ) return false;
    onNavigate(fallbackPath, [], true, undefined);
    return true;
  }, [fallbackPath, onNavigate]);

  const [sortKey, setSortKey] = useState<'name' | 'size' | 'date'>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    entry: FileEntry;
  } | null>(null);
  const [dropTargetPath, setDropTargetPath] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [showAddressBar, setShowAddressBar] = useState(false);
  const [addressValue, setAddressValue] = useState(path);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const [renameValue, setRenameValue] = useState('');
  const [newFolderInput, setNewFolderInput] = useState(false);
  const [newFolderValue, setNewFolderValue] = useState('');
  const [newFileInput, setNewFileInput] = useState(false);
  const [newFileValue, setNewFileValue] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<RemovePreview | null>(null);
  const [columnWidths, setColumnWidths] = useState<FileTableColumnWidths>(() =>
    readStoredColumnWidths(adapter.side),
  );

  const lastClickedIndexRef = useRef<number | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  // 右键菜单视口收拢：实测菜单宽高后修正 left/top，避免在窗口右/下沿被裁
  const contextMenuStyle = useContextMenuPosition(
    contextMenuRef,
    contextMenu?.x ?? null,
    contextMenu?.y ?? null,
  );
  const renameInputRef = useRef<HTMLInputElement>(null);
  const newFolderInputRef = useRef<HTMLInputElement>(null);
  const newFileInputRef = useRef<HTMLInputElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const activeColumnResizeRef = useRef<{
    column: FileTableColumn;
    startX: number;
    startWidth: number;
  } | null>(null);
  // 拖拽中的最新列宽与待提交的 rAF 句柄（rAF 合并 setState 用）
  const pendingResizeWidthRef = useRef<{
    column: FileTableColumn;
    width: number;
  } | null>(null);
  const resizeRafRef = useRef<number | null>(null);
  // 列宽持久化：防抖计时器 + 最近一次提交的列宽
  const persistTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestWidthsRef = useRef<FileTableColumnWidths>(columnWidths);

  const tableWidth = useMemo(
    () => Object.values(columnWidths).reduce((total, width) => total + width, 0),
    [columnWidths],
  );

  // 同步写入 localStorage
  const writeColumnWidths = useCallback(
    (widths: FileTableColumnWidths) => {
      try {
        window.localStorage.setItem(
          `${COLUMN_WIDTH_STORAGE_PREFIX}${adapter.side}`,
          JSON.stringify(widths),
        );
      } catch {
        // localStorage 可能不可用；本次会话内仍可正常调整列宽
      }
    },
    [adapter.side],
  );

  // 列宽变化后 ~300ms 防抖写入（trailing），避免拖拽中每帧 setItem + stringify
  useEffect(() => {
    latestWidthsRef.current = columnWidths;
    if (persistTimerRef.current !== null) clearTimeout(persistTimerRef.current);
    persistTimerRef.current = setTimeout(() => {
      persistTimerRef.current = null;
      writeColumnWidths(columnWidths);
    }, 300);
    return () => {
      if (persistTimerRef.current !== null) {
        clearTimeout(persistTimerRef.current);
        persistTimerRef.current = null;
      }
    };
  }, [columnWidths, writeColumnWidths]);

  // 卸载时兜底写入，避免丢失防抖窗口内的最后一次调整
  useEffect(
    () => () => writeColumnWidths(latestWidthsRef.current),
    [writeColumnWidths],
  );

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const activeResize = activeColumnResizeRef.current;
      if (!activeResize) return;
      const nextWidth = clampColumnWidth(
        activeResize.column,
        activeResize.startWidth + event.clientX - activeResize.startX,
      );
      // rAF 合并：一帧内多次 pointermove 只提交一次 setState，避免整表高频重渲染
      pendingResizeWidthRef.current = {
        column: activeResize.column,
        width: nextWidth,
      };
      if (resizeRafRef.current !== null) return;
      resizeRafRef.current = requestAnimationFrame(() => {
        resizeRafRef.current = null;
        const pending = pendingResizeWidthRef.current;
        if (!pending) return;
        pendingResizeWidthRef.current = null;
        setColumnWidths((current) => {
          if (current[pending.column] === pending.width) return current;
          return { ...current, [pending.column]: pending.width };
        });
      });
    };

    const finishResize = () => {
      // 取消未提交的帧回调，同步提交最后位置，保证拖拽结束立即生效
      if (resizeRafRef.current !== null) {
        cancelAnimationFrame(resizeRafRef.current);
        resizeRafRef.current = null;
      }
      const pending = pendingResizeWidthRef.current;
      pendingResizeWidthRef.current = null;
      activeColumnResizeRef.current = null;
      if (!pending) return;
      const current = latestWidthsRef.current;
      if (current[pending.column] === pending.width) return;
      const next = { ...current, [pending.column]: pending.width };
      latestWidthsRef.current = next;
      setColumnWidths(next);
      // 拖拽结束立即持久化最终列宽，不再等防抖
      writeColumnWidths(next);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', finishResize);
    window.addEventListener('pointercancel', finishResize);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', finishResize);
      window.removeEventListener('pointercancel', finishResize);
      // 卸载时取消未提交的帧回调
      if (resizeRafRef.current !== null) {
        cancelAnimationFrame(resizeRafRef.current);
        resizeRafRef.current = null;
      }
    };
  }, [writeColumnWidths]);

  // Sync address bar value when path changes
  useEffect(() => {
    setAddressValue(path);
  }, [path, refreshToken]);

  // Focus address input when shown
  useEffect(() => {
    if (showAddressBar && addressInputRef.current) {
      addressInputRef.current.focus();
      addressInputRef.current.select();
    }
  }, [showAddressBar]);

  // Load entries when path changes
  useEffect(() => {
    if (!path) return;
    const controller = new AbortController();

    onNavigate(path, [], true, undefined);

    adapter
      .list(path, controller.signal)
      .then((fetchedEntries) => {
        if (!controller.signal.aborted) {
          onNavigate(path, fetchedEntries, false, undefined);
        }
      })
      .catch((err: unknown) => {
        if (!controller.signal.aborted) {
          if (fallbackFromDeniedPath(path, err)) return;
          const msg = toDisplayError(err, 'Failed to list files');
          onNavigate(path, [], false, msg);
        }
      });

    return () => {
      controller.abort();
    };
    // adapter is stable per-pane, path changes trigger reloads
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, fallbackFromDeniedPath]);

  // Close context menu on outside click
  useEffect(() => {
    if (!contextMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(e.target as Node)
      ) {
        setContextMenu(null);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [contextMenu]);

  // Focus rename input
  useEffect(() => {
    if (renaming && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renaming]);

  // Focus new folder input
  useEffect(() => {
    if (newFolderInput && newFolderInputRef.current) {
      newFolderInputRef.current.focus();
    }
  }, [newFolderInput]);

  // Focus new file input
  useEffect(() => {
    if (newFileInput && newFileInputRef.current) {
      newFileInputRef.current.focus();
    }
  }, [newFileInput]);

  // Close context menu on Escape
  useEffect(() => {
    if (!contextMenu) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setContextMenu(null);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [contextMenu]);

  // Sorted entries: directories first, then files, each group sorted by current sort key
  const sortedEntries = useMemo(() => {
    const dirs = entries.filter((e) => e.kind === 'directory');
    const others = entries.filter((e) => e.kind !== 'directory');

    const sortFn = (a: FileEntry, b: FileEntry) => {
      let cmp = 0;
      if (sortKey === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortKey === 'size') cmp = a.size - b.size;
      else if (sortKey === 'date') cmp = a.modifiedAt - b.modifiedAt;
      return sortAsc ? cmp : -cmp;
    };

    dirs.sort(sortFn);
    others.sort(sortFn);

    return [...dirs, ...others];
  }, [entries, sortKey, sortAsc]);

  const segments = useMemo(() => getPathSegments(path), [path]);

  // 最新状态放入 ref：行事件回调引用保持稳定，选择/重命名输入变化时不再重建回调
  // （配合 FileRow 的 React.memo，数千文件目录中仅受影响的行重渲染）
  const selectedRef = useRef(selected);
  const sortedEntriesRef = useRef(sortedEntries);
  const renamingRef = useRef(renaming);
  const renameValueRef = useRef(renameValue);
  // adapter 可能被外层包装组件每次渲染重建（LocalFilePane），同样经 ref 访问
  const adapterRef = useRef(adapter);
  useEffect(() => {
    selectedRef.current = selected;
    sortedEntriesRef.current = sortedEntries;
    renamingRef.current = renaming;
    renameValueRef.current = renameValue;
    adapterRef.current = adapter;
  });

  // ---- Handlers ----

  const handleSort = useCallback((key: 'name' | 'size' | 'date') => {
    if (key === sortKey) {
      setSortAsc((a) => !a);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }, [sortKey]);

  const handleColumnResizeStart = useCallback(
    (event: React.PointerEvent, column: FileTableColumn) => {
      event.preventDefault();
      event.stopPropagation();
      activeColumnResizeRef.current = {
        column,
        startX: event.clientX,
        startWidth: columnWidths[column],
      };
    },
    [columnWidths],
  );

  const adjustColumnWidth = useCallback(
    (column: FileTableColumn, delta: number) => {
      setColumnWidths((current) => ({
        ...current,
        [column]: clampColumnWidth(column, current[column] + delta),
      }));
    },
    [],
  );

  const resetColumnWidth = useCallback((column: FileTableColumn) => {
    setColumnWidths((current) => ({
      ...current,
      [column]: DEFAULT_COLUMN_WIDTHS[column],
    }));
  }, []);

  const renderColumnResizer = (column: FileTableColumn, label: string) => (
    <span
      className="file-transfer-column-resizer"
      role="separator"
      aria-label={`调整${label}列宽`}
      aria-orientation="vertical"
      aria-valuemin={MIN_COLUMN_WIDTHS[column]}
      aria-valuemax={MAX_COLUMN_WIDTH}
      aria-valuenow={columnWidths[column]}
      tabIndex={0}
      data-testid={`column-resizer-${column}`}
      title="拖动调整列宽；双击恢复默认宽度"
      onPointerDown={(event) => handleColumnResizeStart(event, column)}
      onClick={(event) => event.stopPropagation()}
      onDoubleClick={(event) => {
        event.stopPropagation();
        resetColumnWidth(column);
      }}
      onKeyDown={(event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        event.stopPropagation();
        adjustColumnWidth(column, event.key === 'ArrowLeft' ? -20 : 20);
      }}
    />
  );

  const handleRowClick = useCallback(
    (e: React.MouseEvent, entry: FileEntry, index: number) => {
      // 经 ref 读取最新选择集/排序结果，保持本回调引用稳定
      const currentSelected = selectedRef.current;
      if (e.ctrlKey || e.metaKey) {
        // Toggle: if already selected, deselect all and select just the others
        if (currentSelected.has(entry.path)) {
          const others = Array.from(currentSelected).filter(
            (p) => p !== entry.path,
          );
          onDeselectAll();
          if (others.length > 0) onSelect(others);
        } else {
          onSelect([entry.path]);
        }
        return;
      }

      if (e.shiftKey && lastClickedIndexRef.current !== null) {
        const start = Math.min(lastClickedIndexRef.current, index);
        const end = Math.max(lastClickedIndexRef.current, index);
        const rangePaths = sortedEntriesRef.current
          .slice(start, end + 1)
          .map((e) => e.path);
        onDeselectAll();
        onSelect(rangePaths);
        return;
      }

      // 远程/集群面板：单击文件夹直接进入
      if (folderClickNavigates && entry.kind === 'directory') {
        onNavigate(entry.path, [], true, undefined);
        lastClickedIndexRef.current = index;
        return;
      }

      onDeselectAll();
      onSelect([entry.path]);
      lastClickedIndexRef.current = index;
    },
    [onSelect, onDeselectAll, folderClickNavigates, onNavigate],
  );

  const handleDoubleClick = useCallback(
    (entry: FileEntry) => {
      if (entry.kind === 'directory') {
        onNavigate(entry.path, [], true, undefined);
      } else if (onFileDoubleClick) {
        onFileDoubleClick(entry);
      } else {
        onOpenFile(entry);
      }
    },
    [onNavigate, onOpenFile, onFileDoubleClick],
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, entry: FileEntry) => {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY, entry });
    },
    [],
  );

  const handleBreadcrumbClick = useCallback(
    (segmentPath: string) => {
      onNavigate(segmentPath, [], true, undefined);
    },
    [onNavigate],
  );

  const handleParentDir = useCallback(() => {
    const parent = getParentPath(path);
    if (parent !== null) {
      onNavigate(parent, [], true, undefined);
    }
  }, [path, onNavigate]);

  const handleAddressSubmit = useCallback(() => {
    const trimmed = addressValue.trim();
    if (trimmed && trimmed !== path) {
      onNavigate(trimmed, [], true, undefined);
    }
    setShowAddressBar(false);
  }, [addressValue, path, onNavigate]);

  const handleAddressKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleAddressSubmit();
      if (e.key === 'Escape') {
        setAddressValue(path);
        setShowAddressBar(false);
      }
    },
    [handleAddressSubmit, path],
  );

  const parentPath = getParentPath(path);
  // 盘符列表层级（此电脑）不是真实目录，不能在其中新建条目
  const atDrivesRoot = isLocalDrivesRoot(path);

  const startLoad = useCallback(
    (targetPath: string) => {
      const controller = new AbortController();
      onNavigate(targetPath, [], true, undefined);
      // adapter 经 ref 访问，保持本回调引用稳定（外层可能每次渲染重建 adapter）
      adapterRef.current
        .list(targetPath, controller.signal)
        .then((fetchedEntries) => {
          if (!controller.signal.aborted) {
            onNavigate(targetPath, fetchedEntries, false, undefined);
          }
        })
        .catch((err: unknown) => {
          if (!controller.signal.aborted) {
            if (fallbackFromDeniedPath(targetPath, err)) return;
            const msg = toDisplayError(err, 'Failed to list files');
            onNavigate(targetPath, [], false, msg);
          }
        });
    },
    [fallbackFromDeniedPath, onNavigate],
  );

  const handleRefresh = useCallback(() => {
    startLoad(path);
  }, [path, startLoad]);

  const handleNewFolderClick = useCallback(() => {
    if (readOnly || atDrivesRoot) return;
    setNewFolderInput(true);
    setNewFolderValue('');
  }, [readOnly, atDrivesRoot]);

  const handleNewFileClick = useCallback(() => {
    if (readOnly || atDrivesRoot) return;
    setNewFileInput(true);
    setNewFileValue('');
  }, [readOnly, atDrivesRoot]);

  const handleNewFolderSubmit = useCallback(() => {
    const name = newFolderValue.trim();
    if (!name) {
      setNewFolderInput(false);
      return;
    }
    const separator = path.includes('/') ? '/' : '\\';
    const newPath = path.endsWith(separator)
      ? path + name
      : path + separator + name;
    adapter
      .mkdir(newPath)
      .then(() => {
        setNewFolderInput(false);
        setNewFolderValue('');
        handleRefresh();
      })
      .catch(() => {
        setNewFolderInput(false);
      });
  }, [newFolderValue, path, adapter, handleRefresh]);

  const handleNewFileSubmit = useCallback(() => {
    const name = newFileValue.trim();
    if (!name) {
      setNewFileInput(false);
      return;
    }
    const separator = path.includes('/') ? '/' : '\\';
    const newPath = path.endsWith(separator)
      ? path + name
      : path + separator + name;
    adapter
      .createFile(newPath)
      .then(() => {
        setNewFileInput(false);
        setNewFileValue('');
        handleRefresh();
      })
      .catch(() => {
        setNewFileInput(false);
      });
  }, [newFileValue, path, adapter, handleRefresh]);

  const handleRenameStart = useCallback(
    (entry: FileEntry) => {
      if (readOnly) return;
      setRenaming(entry.path);
      setRenameValue(entry.name);
    },
    [readOnly],
  );

  const handleRenameSubmit = useCallback(() => {
    // 经 ref 读取最新重命名状态：输入过程不重建本回调，避免击键时所有行重渲染
    const renamingPath = renamingRef.current;
    const value = renameValueRef.current;
    if (!renamingPath || !value.trim()) {
      setRenaming(null);
      return;
    }
    const from = renamingPath;
    const separator = from.includes('/') ? '/' : '\\';
    const parent = from.substring(0, from.lastIndexOf(separator) + 1);
    const to = parent + value.trim();

    adapterRef.current
      .rename(from, to)
      .then(() => {
        setRenaming(null);
        handleRefresh();
      })
      .catch(() => {
        setRenaming(null);
      });
  }, [handleRefresh]);

  const handleRenameCancel = useCallback(() => {
    setRenaming(null);
  }, []);

  const handleDelete = useCallback(() => {
    if (readOnly || selected.size === 0) return;
    const paths = Array.from(selected);
    adapter
      .removePreview(paths)
      .then((preview) => {
        setDeleteConfirm(preview);
      })
      .catch(() => {
        setDeleteConfirm({ entries: [], total: paths.length });
      });
  }, [readOnly, selected, adapter]);

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteConfirm) return;
    const paths = Array.from(selected);
    adapter
      .remove(paths)
      .then(() => {
        setDeleteConfirm(null);
        onDeselectAll();
        handleRefresh();
      })
      .catch(() => {
        setDeleteConfirm(null);
      });
  }, [deleteConfirm, selected, adapter, onDeselectAll, handleRefresh]);

  const handleCopyPath = useCallback((entry: FileEntry) => {
    navigator.clipboard.writeText(entry.path).catch(() => {});
    setContextMenu(null);
  }, []);

  const handleCopyFiles = useCallback((entry: FileEntry) => {
    const currentSelected = selectedRef.current;
    const paths = currentSelected.has(entry.path)
      ? Array.from(currentSelected)
      : [entry.path];
    onCopyFiles?.(paths);
    setContextMenu(null);
  }, [onCopyFiles]);

  const handleCutFiles = useCallback((entry: FileEntry) => {
    if (readOnly) return;
    const currentSelected = selectedRef.current;
    const paths = currentSelected.has(entry.path)
      ? Array.from(currentSelected)
      : [entry.path];
    onCutFiles?.(paths);
    setContextMenu(null);
  }, [onCutFiles, readOnly]);

  const handlePasteFiles = useCallback((entry: FileEntry) => {
    if (!onPasteFiles || !clipboardAvailable) return;
    const targetDirectory = entry.kind === 'directory' ? entry.path : path;
    setContextMenu(null);
    Promise.resolve(onPasteFiles(targetDirectory))
      .then(handleRefresh)
      .catch(() => {});
  }, [clipboardAvailable, handleRefresh, onPasteFiles, path]);

  const handleDragStart = useCallback(
    (e: React.DragEvent, entry: FileEntry) => {
      // 经 ref 读取最新选择集，保持本回调引用稳定
      const currentSelected = selectedRef.current;
      const paths = currentSelected.has(entry.path)
        ? Array.from(currentSelected)
        : [entry.path];
      e.dataTransfer.setData(
        'application/x-hpclaw-files',
        JSON.stringify({ sourcePaths: paths, sourceSide: adapter.side, sourceEndpoint: endpointId }),
      );
      e.dataTransfer.effectAllowed = 'copyMove';
    },
    [adapter.side, endpointId],
  );

  const readDraggedFiles = useCallback((e: React.DragEvent): {
    sourcePaths: string[];
    sourceSide: FileSide;
    sourceEndpoint?: string;
  } | null => {
    const data = e.dataTransfer.getData('application/x-hpclaw-files');
    if (!data) return null;
    try {
      const parsed = JSON.parse(data) as {
        sourcePaths?: unknown;
        sourceSide?: unknown;
        sourceEndpoint?: unknown;
      };
      if (!Array.isArray(parsed.sourcePaths)) return null;
      if (parsed.sourceSide !== 'local' && parsed.sourceSide !== 'remote') return null;
      const sourceSide: FileSide = parsed.sourceSide;
      return {
        sourcePaths: parsed.sourcePaths.filter((item): item is string => typeof item === 'string'),
        sourceSide,
        sourceEndpoint: typeof parsed.sourceEndpoint === 'string' ? parsed.sourceEndpoint : undefined,
      };
    } catch {
      return null;
    }
  }, []);

  const handleDirectoryDragOver = useCallback((e: React.DragEvent, entry: FileEntry) => {
    if (entry.kind !== 'directory') return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setDropTargetPath(entry.path);
  }, []);

  const handleDirectoryDragLeave = useCallback((e: React.DragEvent, entry: FileEntry) => {
    if (entry.kind !== 'directory') return;
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
    setDropTargetPath(current => current === entry.path ? null : current);
  }, []);

  const handleDirectoryDrop = useCallback(async (e: React.DragEvent, entry: FileEntry) => {
    if (entry.kind !== 'directory') return;
    e.preventDefault();
    e.stopPropagation();
    setDropTargetPath(null);
    const dragged = readDraggedFiles(e);
    if (!dragged || dragged.sourcePaths.length === 0) return;

    const sameEndpoint = dragged.sourceEndpoint
      ? dragged.sourceEndpoint === endpointId
      : dragged.sourceSide === adapter.side;
    if (!sameEndpoint) {
      onDrop(dragged.sourcePaths, entry.path, dragged.sourceSide);
      return;
    }
    if (readOnly || dragged.sourcePaths.some(source => cannotMoveInto(source, entry.path))) return;

    try {
      for (const source of dragged.sourcePaths) {
        const destination = joinFilePath(entry.path, pathBaseName(source));
        if (comparablePath(source) !== comparablePath(destination)) {
          await adapterRef.current.rename(source, destination);
        }
      }
      onDeselectAll();
    } catch (cause) {
      console.error('Failed to move files into directory:', cause);
    } finally {
      handleRefresh();
    }
  }, [adapter.side, endpointId, handleRefresh, onDeselectAll, onDrop, readDraggedFiles, readOnly]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selected.size > 0) {
          handleDelete();
        }
      } else if (e.key === 'F2') {
        if (selected.size === 1) {
          const entry = entries.find((e) => selected.has(e.path));
          if (entry) handleRenameStart(entry);
        }
      } else if (e.key === 'a' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        onSelect(entries.map((e) => e.path));
      } else if (e.key === 'c' && (e.ctrlKey || e.metaKey)) {
        if (selected.size > 0 && onCopyFiles) {
          e.preventDefault();
          onCopyFiles(Array.from(selected));
        }
      } else if (e.key === 'x' && (e.ctrlKey || e.metaKey)) {
        if (!readOnly && selected.size > 0 && onCutFiles) {
          e.preventDefault();
          onCutFiles(Array.from(selected));
        }
      } else if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
        if (!readOnly && onPasteFiles && clipboardAvailable) {
          e.preventDefault();
          Promise.resolve(onPasteFiles(path)).then(handleRefresh).catch(() => {});
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selected, entries, handleDelete, handleRenameStart, onSelect, onCopyFiles, onCutFiles, onPasteFiles, clipboardAvailable, readOnly, path, handleRefresh]);

  // Drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDropTargetPath(null);
      const parsed = readDraggedFiles(e);
      // 同一窗格拖回当前目录不做任何处理；拖入子文件夹由目录行处理。
      const sameEndpoint = parsed?.sourceEndpoint
        ? parsed.sourceEndpoint === endpointId
        : parsed?.sourceSide === adapter.side;
      if (parsed && !sameEndpoint) {
        onDrop(parsed.sourcePaths, path, parsed.sourceSide);
      }
    },
    [adapter.side, endpointId, path, onDrop, readDraggedFiles],
  );

  // ---- Render ----

  return (
    <div
      className="file-transfer-pane"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      role="region"
      aria-label={`${adapter.side === 'local' ? '本地' : '远程'}文件面板`}
    >
      {/* Address bar：地址只显示在输入栏中，不再重复显示面包屑 */}
      <div className="file-transfer-breadcrumb" role="navigation" aria-label="路径导航">
        {parentPath !== null && (
          <button
            type="button"
            className="breadcrumb-segment mr-1 flex items-center gap-0.5 shrink-0"
            onClick={handleParentDir}
            title="上级目录"
            aria-label="上级目录"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span className="text-xs">..</span>
          </button>
        )}
        <input
          type="text"
          className="file-transfer-address-input flex-1"
          value={addressValue}
          onChange={(e) => setAddressValue(e.target.value)}
          onKeyDown={handleAddressKeyDown}
          placeholder="输入路径后按回车跳转..."
          spellCheck={false}
          data-testid="address-input"
        />
        <button
          type="button"
          onClick={handleRefresh}
          className="toolbar-btn shrink-0 ml-1"
          title="刷新"
          aria-label="刷新"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
        {!readOnly && (
          <>
            <button
              type="button"
              onClick={handleNewFolderClick}
              disabled={atDrivesRoot}
              className="toolbar-btn shrink-0"
              title="新建文件夹"
              aria-label="新建文件夹"
            >
              <FolderPlus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNewFileClick}
              disabled={atDrivesRoot}
              className="toolbar-btn shrink-0"
              title="新建文件"
              aria-label="新建文件"
            >
              <FilePlus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={selected.size === 0}
              className="toolbar-btn shrink-0"
              title="删除"
              aria-label="删除"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* New folder inline input */}
      {newFolderInput && (
        <div className="file-transfer-new-folder">
          <Folder className="w-4 h-4 text-amber-400 shrink-0" />
          <input
            ref={newFolderInputRef}
            className="file-transfer-inline-input"
            placeholder="文件夹名称"
            value={newFolderValue}
            onChange={(e) => setNewFolderValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleNewFolderSubmit();
              if (e.key === 'Escape') setNewFolderInput(false);
            }}
            onBlur={handleNewFolderSubmit}
            data-testid="new-folder-input"
          />
        </div>
      )}

      {/* New file inline input */}
      {newFileInput && (
        <div className="file-transfer-new-folder">
          <File className="w-4 h-4 text-scholar-400 shrink-0" />
          <input
            ref={newFileInputRef}
            className="file-transfer-inline-input"
            placeholder="文件名称"
            value={newFileValue}
            onChange={(e) => setNewFileValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleNewFileSubmit();
              if (e.key === 'Escape') setNewFileInput(false);
            }}
            onBlur={handleNewFileSubmit}
            data-testid="new-file-input"
          />
        </div>
      )}

      {/* Loading overlay while fetching */}
      {loading && (
        <div className="file-transfer-loading" data-testid="loading-state">
          <Loader2 className="w-6 h-6 animate-spin text-accent" />
          <p>加载中...</p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="file-transfer-error" data-testid="error-state">
          <AlertTriangle className="w-8 h-8 text-red-500" />
          <p>{toDisplayError(error, 'Failed to list files')}</p>
          <button
            type="button"
            onClick={handleRefresh}
            className="file-transfer-retry-btn"
          >
            重试
          </button>
        </div>
      )}

      {/* Table (only when not loading and not error, or when entries exist) */}
      {!loading && !error && (
        <div className="file-transfer-table-container" ref={tableRef}>
          {sortedEntries.length > 0 ? (
            <table
              className="file-transfer-table"
              style={{ width: `${tableWidth}px`, minWidth: '100%' }}
            >
              <colgroup>
                <col data-testid="file-column-name" style={{ width: columnWidths.name }} />
                <col data-testid="file-column-size" style={{ width: columnWidths.size }} />
                <col data-testid="file-column-date" style={{ width: columnWidths.date }} />
                <col
                  data-testid="file-column-permissions"
                  style={{ width: columnWidths.permissions }}
                />
              </colgroup>
              <thead>
                <tr>
                  <th
                    onClick={() => handleSort('name')}
                    data-sort-key="name"
                    aria-sort={
                      sortKey === 'name'
                        ? sortAsc
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                    }
                    role="columnheader"
                    scope="col"
                  >
                    名称
                    {sortKey === 'name' && (
                      <span className="sort-indicator">
                        {sortAsc ? ' \u2191' : ' \u2193'}
                      </span>
                    )}
                    {renderColumnResizer('name', '名称')}
                  </th>
                  <th
                    onClick={() => handleSort('size')}
                    data-sort-key="size"
                    aria-sort={
                      sortKey === 'size'
                        ? sortAsc
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                    }
                    role="columnheader"
                    scope="col"
                  >
                    大小
                    {sortKey === 'size' && (
                      <span className="sort-indicator">
                        {sortAsc ? ' \u2191' : ' \u2193'}
                      </span>
                    )}
                    {renderColumnResizer('size', '大小')}
                  </th>
                  <th
                    onClick={() => handleSort('date')}
                    data-sort-key="date"
                    aria-sort={
                      sortKey === 'date'
                        ? sortAsc
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                    }
                    role="columnheader"
                    scope="col"
                  >
                    修改日期
                    {sortKey === 'date' && (
                      <span className="sort-indicator">
                        {sortAsc ? ' \u2191' : ' \u2193'}
                      </span>
                    )}
                    {renderColumnResizer('date', '修改日期')}
                  </th>
                  <th role="columnheader" scope="col">
                    权限
                    {renderColumnResizer('permissions', '权限')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedEntries.map((entry, index) => (
                  <FileRow
                    key={entry.path}
                    entry={entry}
                    index={index}
                    selected={selected.has(entry.path)}
                    isRenaming={renaming === entry.path}
                    renameValue={renaming === entry.path ? renameValue : ''}
                    renameInputRef={renameInputRef}
                    onRenameValueChange={setRenameValue}
                    onRenameSubmit={handleRenameSubmit}
                    onRenameCancel={handleRenameCancel}
                    onRowClick={handleRowClick}
                    onRowDoubleClick={handleDoubleClick}
                    onRowContextMenu={handleContextMenu}
                    onRowDragStart={handleDragStart}
                    dropTarget={dropTargetPath === entry.path}
                    onRowDragOver={handleDirectoryDragOver}
                    onRowDragLeave={handleDirectoryDragLeave}
                    onRowDrop={handleDirectoryDrop}
                  />
                ))}
              </tbody>
            </table>
          ) : (
            <div
              className="file-transfer-empty"
              data-testid="empty-state"
            >
              <Inbox className="w-8 h-8 text-scholar-500" />
              <p>此目录为空</p>
              <p className="text-scholar-600 text-xs mt-1">
                拖拽文件到另一侧面板即可传输
              </p>
            </div>
          )}
        </div>
      )}

      {/* Context menu — portal 到 body：抽屉容器有 transform，直接渲染会让 fixed 定位相对抽屉而非视口 */}
      {contextMenu && createPortal(
        <div
          ref={contextMenuRef}
          className="file-transfer-context-menu"
          style={contextMenuStyle}
          data-testid="context-menu"
          role="menu"
        >
          {!readOnly && (
            <>
              <button
                type="button"
                onClick={() => {
                  setContextMenu(null);
                  handleNewFolderClick();
                }}
                className="context-menu-item"
                role="menuitem"
              >
                <FolderPlus className="w-4 h-4" />
                <span>新建文件夹</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setContextMenu(null);
                  handleNewFileClick();
                }}
                className="context-menu-item"
                role="menuitem"
              >
                <FilePlus className="w-4 h-4" />
                <span>新建文件</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setContextMenu(null);
                  handleRenameStart(contextMenu.entry);
                }}
                className="context-menu-item"
                role="menuitem"
              >
                <Pencil className="w-4 h-4" />
                <span>重命名</span>
              </button>
              <div className="context-menu-divider" />
              {onCopyFiles && (
                <button
                  type="button"
                  onClick={() => handleCopyFiles(contextMenu.entry)}
                  className="context-menu-item"
                  role="menuitem"
                >
                  <Copy className="w-4 h-4" />
                  <span>复制</span>
                </button>
              )}
              {onCutFiles && (
                <button
                  type="button"
                  onClick={() => handleCutFiles(contextMenu.entry)}
                  className="context-menu-item"
                  role="menuitem"
                >
                  <Scissors className="w-4 h-4" />
                  <span>剪切</span>
                </button>
              )}
              {onPasteFiles && (
                <button
                  type="button"
                  onClick={() => handlePasteFiles(contextMenu.entry)}
                  className="context-menu-item"
                  role="menuitem"
                  disabled={!clipboardAvailable}
                  title={clipboardAvailable ? '粘贴到此目录' : '请先复制文件或文件夹'}
                >
                  <ClipboardPaste className="w-4 h-4" />
                  <span>粘贴</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setContextMenu(null);
                  handleCopyPath(contextMenu.entry);
                }}
                className="context-menu-item"
                role="menuitem"
              >
                <Copy className="w-4 h-4" />
                <span>复制路径</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setContextMenu(null);
                  onOpenFile(contextMenu.entry);
                }}
                className="context-menu-item"
                role="menuitem"
              >
                <ExternalLink className="w-4 h-4" />
                <span>打开并编辑</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setContextMenu(null);
                  onPreviewFile(contextMenu.entry);
                }}
                className="context-menu-item"
                role="menuitem"
              >
                <Eye className="w-4 h-4" />
                <span>预览</span>
              </button>
              {onTransfer && (
                <button
                  type="button"
                  onClick={() => {
                    const paths = selected.has(contextMenu.entry.path)
                      ? Array.from(selected)
                      : [contextMenu.entry.path];
                    setContextMenu(null);
                    onDeselectAll();
                    onTransfer(paths);
                  }}
                  className="context-menu-item"
                  role="menuitem"
                >
                  {adapter.side === 'local' ? (
                    <><Upload className="w-4 h-4" /><span>上传到远程</span></>
                  ) : (
                    <><Download className="w-4 h-4" /><span>下载到本地</span></>
                  )}
                </button>
              )}
              <div className="context-menu-divider" />
              <button
                type="button"
                onClick={() => {
                  setContextMenu(null);
                  onSelect([contextMenu.entry.path]);
                  handleDelete();
                }}
                className="context-menu-item context-menu-item-danger"
                role="menuitem"
              >
                <Trash2 className="w-4 h-4" />
                <span>删除</span>
              </button>
            </>
          )}
          {readOnly && (
            <>
              {onCopyFiles && (
                <button
                  type="button"
                  onClick={() => handleCopyFiles(contextMenu.entry)}
                  className="context-menu-item"
                  role="menuitem"
                >
                  <Copy className="w-4 h-4" />
                  <span>复制</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setContextMenu(null);
                  handleCopyPath(contextMenu.entry);
                }}
                className="context-menu-item"
                role="menuitem"
              >
                <Copy className="w-4 h-4" />
                <span>复制路径</span>
              </button>
            </>
          )}
        </div>,
        document.body,
      )}

      {/* Delete confirmation dialog */}
      {deleteConfirm && (
        <div
          className="file-transfer-dialog-overlay"
          data-testid="delete-confirm-dialog"
        >
          <div
            className="file-transfer-dialog"
            role="dialog"
            aria-label="确认删除"
          >
            <h3 className="dialog-title">确认删除</h3>
            <p className="dialog-body">
              确定要删除 {deleteConfirm.total} 个项目吗？
              {deleteConfirm.recursive ? '（包括子目录）' : ''}
            </p>
            <div className="file-transfer-dialog-actions">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="file-transfer-btn-cancel"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="file-transfer-btn-danger"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
