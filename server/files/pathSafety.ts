import path from 'node:path';

export function assertSafeLocalPath(input: string): string {
  if (!input.trim()) throw new Error('path is required');
  if (input.includes('\0')) throw new Error('path contains a null byte');

  const normalized = path.win32.normalize(input);
  if (normalized.startsWith('\\\\.\\') || normalized.startsWith('\\\\?\\')) {
    throw new Error('local device paths are not allowed');
  }

  const root = path.win32.parse(normalized).root;
  const hasDriveRoot = /^[A-Za-z]:\\$/.test(root);
  const hasUncRoot = /^\\\\[^\\]+\\[^\\]+\\$/.test(root);
  if (!hasDriveRoot && !hasUncRoot) throw new Error('local path must be fully qualified');
  return normalized;
}

export function assertSafeRemotePath(input: string): string {
  if (!input.trim()) throw new Error('path is required');
  if (input.includes('\0')) throw new Error('path contains a null byte');

  const normalized = path.posix.normalize(input);
  if (!path.posix.isAbsolute(normalized)) throw new Error('remote path must be absolute');
  return normalized;
}

export function assertSafeRemoteMutation(input: string, home: string): string {
  const normalized = assertSafeRemotePath(input);
  const mutationPath = path.posix.resolve(normalized);
  const normalizedHome = path.posix.resolve(assertSafeRemotePath(home));
  const protectedPaths = new Set(['/', '/home', normalizedHome]);
  if (protectedPaths.has(mutationPath)) throw new Error(`protected remote path: ${normalized}`);
  return normalized;
}

/**
 * 将 dsh 文件工具的远程访问限制在明确授权根内。
 * 这是词法路径边界；SFTP 服务仍应避免跟随指向根外的符号链接进行写入。
 */
export function assertRemotePathWithinRoot(
  input: string,
  root: string,
  options: { allowRoot?: boolean } = {},
): string {
  const normalized = path.posix.resolve(assertSafeRemotePath(input));
  const normalizedRoot = path.posix.resolve(assertSafeRemotePath(root));
  const inside = normalized === normalizedRoot || normalized.startsWith(`${normalizedRoot}/`);
  if (!inside) throw new Error(`remote path is outside the authorized root: ${input}`);
  if (!options.allowRoot && normalized === normalizedRoot) {
    throw new Error(`protected remote root: ${normalized}`);
  }
  return normalized;
}
