/**
 * 把跨进程/API 返回的任意错误值转换为可安全放进 JSX 的文本。
 * Electron IPC 和后端接口都可能返回 { error: { code, message } }，
 * 绝不能把这类普通对象直接保存到 React 的错误展示状态中。
 */
export function toDisplayError(value: unknown, fallback = '操作失败'): string {
  const visit = (candidate: unknown, depth: number): string | undefined => {
    if (typeof candidate === 'string') {
      const trimmed = candidate.trim();
      return trimmed || undefined;
    }
    if (candidate instanceof Error) {
      const message = candidate.message.trim();
      return message || candidate.name || undefined;
    }
    if (!candidate || typeof candidate !== 'object' || depth >= 5) return undefined;

    const record = candidate as Record<string, unknown>;
    for (const key of ['message', 'error', 'detail', 'reason', 'code']) {
      const message = visit(record[key], depth + 1);
      if (message) return message;
    }
    return undefined;
  };

  return visit(value, 0) || fallback;
}

/** 判断 SFTP/HTTP/IPC 的权限错误，用于失效历史目录自动回退到账号 home。 */
export function isPermissionDeniedError(value: unknown): boolean {
  const record = value && typeof value === 'object'
    ? value as Record<string, unknown>
    : undefined;
  const directCode = typeof record?.code === 'string' ? record.code : '';
  const nested = record?.error && typeof record.error === 'object'
    ? record.error as Record<string, unknown>
    : undefined;
  const nestedCode = typeof nested?.code === 'string' ? nested.code : '';
  const code = `${directCode} ${nestedCode}`.toUpperCase();
  if (/EACCES|EPERM|PERMISSION_DENIED|ACCESS_DENIED/.test(code)) return true;

  const message = toDisplayError(value, '').toLowerCase();
  return /permission denied|access denied|not permitted|权限不足|没有权限|无权访问/.test(message);
}
