/**
 * 本地文件面板的"盘符列表"层级（此电脑）。
 *
 * pane 路径用非空哨兵字符串表示该层级：空字符串会触发
 * FileTransferWorkspace 的自动导航 effect 把路径覆盖回默认值，
 * 所以这里用一个不可能出现在真实文件系统中的词作为标记。
 */
export const LOCAL_DRIVES_ROOT = '此电脑';

export function isLocalDrivesRoot(path: string): boolean {
  const trimmed = path.trim();
  return trimmed === LOCAL_DRIVES_ROOT || trimmed.toLowerCase() === 'this pc';
}

/** 判断是否为 Windows 盘符根路径（如 `C:\` 或 `C:/`）。 */
export function isWindowsDriveRoot(path: string): boolean {
  return /^[A-Za-z]:[\\/]?$/.test(path.trim());
}
