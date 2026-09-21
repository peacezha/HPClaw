import type { EntryKind, PickPathKind } from '@/shared/fileTransfer';

/**
 * 路径选取模式的底部确认栏（流程面板选输入文件/目录用）。
 * kind='file'：主按钮「选择选中的文件」，仅当单选条目是文件时可用；
 * kind='folder'：主按钮「选择此文件夹」，「选择选中项」仅限文件夹；
 * kind='any'：「选择选中项」（文件或文件夹）与「选择此文件夹」均可用。
 */
export default function PickConfirmBar({
  kind = 'any',
  currentPath,
  selectedEntry,
  onPick,
  onCancel,
}: {
  kind?: PickPathKind;
  /** 当前浏览的目录 */
  currentPath: string;
  /** 当前单选条目；kind 为 null 表示该路径不在当前目录列表中（跨目录残留选中） */
  selectedEntry: { path: string; kind: EntryKind | null } | null;
  onPick: (path: string) => void;
  onCancel: () => void;
}) {
  const label = kind === 'file' ? '选择文件：' : kind === 'folder' ? '选择目录：' : '选择文件或目录：';
  // symlink 无法从列表区分指向文件还是目录，选取时按文件处理
  const selectedIsFile = !!selectedEntry && selectedEntry.kind !== null && selectedEntry.kind !== 'directory';
  const selectedIsDirectory = selectedEntry?.kind === 'directory';

  // 「选择选中项」按钮的可用性与提示按 kind 收敛
  const selectEntryEnabled = kind === 'file'
    ? selectedIsFile
    : kind === 'folder'
      ? selectedIsDirectory
      : !!selectedEntry;
  const selectEntryTitle = (() => {
    if (selectEntryEnabled) return '使用选中的文件或文件夹';
    if (!selectedEntry) {
      return kind === 'file'
        ? '在列表中单击选中一个文件'
        : kind === 'folder'
          ? '在列表中选中一个文件夹（Ctrl+单击）'
          : '在列表中单击选中一个文件或文件夹';
    }
    if (selectedEntry.kind === null) return '选中项不在当前目录列表中，请重新选择';
    return kind === 'file'
      ? '选中的是文件夹，请改选一个文件'
      : '选中的是文件，请改选一个文件夹（Ctrl+单击）';
  })();

  return (
    <div className="px-4 py-2.5 border-t border-scholar-700/50 flex items-center gap-3 shrink-0 bg-scholar-900/60">
      <span className="text-[11px] text-scholar-400 shrink-0">{label}</span>
      <span className="flex-1 text-xs text-scholar-100 truncate font-mono" title={selectedEntry?.path || currentPath}>
        {selectedEntry?.path || currentPath || '…'}
      </span>
      {kind === 'file' ? (
        <button
          type="button"
          className="btn-primary !text-xs"
          disabled={!selectEntryEnabled}
          title={selectEntryTitle}
          onClick={() => selectedEntry && onPick(selectedEntry.path)}
        >选择选中的文件</button>
      ) : (
        <>
          <button
            type="button"
            className="btn-ghost !text-xs"
            disabled={!selectEntryEnabled}
            title={selectEntryTitle}
            onClick={() => selectedEntry && onPick(selectedEntry.path)}
          >选择选中项</button>
          <button
            type="button"
            className="btn-primary !text-xs"
            disabled={!currentPath}
            title="使用当前浏览的文件夹"
            onClick={() => currentPath && onPick(currentPath)}
          >选择此文件夹</button>
        </>
      )}
      <button type="button" className="btn-ghost !text-xs" onClick={onCancel}>取消</button>
    </div>
  );
}
