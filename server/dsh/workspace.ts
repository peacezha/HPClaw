// 用户选择的本地工作区（dsh 会话 cwd）校验：绝对路径、存在、是目录才接受。

import fs from 'node:fs';
import path from 'node:path';

/**
 * 规范化前端传来的 workspace：trim 后 resolve 为绝对路径，stat 确认是目录。
 * 任何一步不满足都返回 undefined（调用方回退到 DATA_ROOT，不报错打断对话）。
 */
export function normalizeWorkspace(input: unknown): string | undefined {
  if (typeof input !== 'string' || !input.trim()) return undefined;
  const resolved = path.resolve(input.trim());
  try {
    return fs.statSync(resolved).isDirectory() ? fs.realpathSync(resolved) : undefined;
  } catch {
    return undefined;
  }
}

function comparable(value: string): string {
  const resolved = path.resolve(value);
  return process.platform === 'win32' ? resolved.toLowerCase() : resolved;
}

function isInside(root: string, candidate: string): boolean {
  const normalizedRoot = comparable(root);
  const normalizedCandidate = comparable(candidate);
  return normalizedCandidate === normalizedRoot
    || normalizedCandidate.startsWith(`${normalizedRoot}${path.sep}`);
}

/**
 * 把 dsh 传来的本地文件路径约束在当前会话工作区内。
 * - 已存在路径通过 realpath 阻断符号链接/junction 越界；
 * - 新建目标从最近的已存在父目录解析真实路径，再拼回剩余片段；
 * - 相对路径一律拒绝，避免服务进程 cwd 变化导致目标漂移。
 */
export function resolveWorkspaceFilePath(
  workspaceRoot: string,
  input: string,
  options: { mustExist?: boolean } = {},
): string {
  if (!input.trim() || input.includes('\0')) throw new Error('local path is required');
  if (!path.isAbsolute(input)) throw new Error('local path must be absolute');
  const root = fs.realpathSync(workspaceRoot);
  const requested = path.resolve(input);
  let candidate: string;

  if (fs.existsSync(requested)) {
    candidate = fs.realpathSync(requested);
  } else {
    if (options.mustExist) throw new Error('local file not found');
    const suffix: string[] = [];
    let cursor = requested;
    while (!fs.existsSync(cursor)) {
      const parent = path.dirname(cursor);
      if (parent === cursor) throw new Error('local path has no existing parent');
      suffix.unshift(path.basename(cursor));
      cursor = parent;
    }
    candidate = path.resolve(fs.realpathSync(cursor), ...suffix);
  }

  if (!isInside(root, candidate)) {
    throw new Error(`local path is outside the selected workspace: ${input}`);
  }
  return candidate;
}
