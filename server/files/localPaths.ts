// AI 对话富内容卡片：本地文件路径解析。
// 对话文本是 AI 生成的不可信输入，本地读取只允许落在 DATA_ROOT 与当前工作区内。
// realpath + isInside 的判定与 server/dsh/workspace.ts 保持一致（那边约束的是
// dsh 工具写入，这里约束的是对话卡片的只读访问）。

import fs from 'node:fs';
import path from 'node:path';

export type LocalPathFailure = 'required' | 'outside' | 'notfound';

/** 带失败类别的路径解析错误：路由层据此映射 400/403/404 */
export class LocalPathError extends Error {
  constructor(readonly failure: LocalPathFailure, message: string) {
    super(message);
    this.name = 'LocalPathError';
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

/** realpath 后必须落在允许根集合内；不存在 / 越界分别抛 notfound / outside */
function realpathInsideRoots(roots: string[], input: string): string {
  const requested = path.resolve(input);
  if (!fs.existsSync(requested)) {
    throw new LocalPathError('notfound', `local file not found: ${input}`);
  }
  let candidate: string;
  try {
    candidate = fs.realpathSync(requested);
  } catch {
    throw new LocalPathError('notfound', `local file not found: ${input}`);
  }
  if (!roots.some(root => isInside(root, candidate))) {
    throw new LocalPathError('outside', `local path is outside the allowed roots: ${input}`);
  }
  return candidate;
}

/** 相对路径：逐个允许根 join 探测，取第一个存在且 realpath 后仍在根内者 */
function probeRelativeInRoots(roots: string[], relative: string): string | undefined {
  for (const root of roots) {
    const joined = path.join(root, relative);
    if (!fs.existsSync(joined)) continue;
    try {
      const candidate = fs.realpathSync(joined);
      if (isInside(root, candidate)) return candidate;
    } catch { /* realpath 失败的根探测视为未命中 */ }
  }
  return undefined;
}

// 后缀兜底搜索的护栏：只在直接探测失败时触发，限制深度与扫描条目数
const SUFFIX_SEARCH_MAX_DEPTH = 4;
const SUFFIX_SEARCH_MAX_ENTRIES = 5_000;
const SUFFIX_SEARCH_SKIP_DIRS = new Set(['node_modules', '.git']);

/**
 * 模型常把 cwd 相对路径 Unix 化并丢前缀（如 .dsh-vision-toolkit/artifacts/x.png
 * 写成 /artifacts/x.png）。在允许根内做有界后缀搜索，命中段边界对齐的同名文件。
 */
function suffixSearchInRoots(roots: string[], relative: string): string | undefined {
  const normalized = path.normalize(relative);
  if (normalized.split(path.sep).some(segment => segment === '..')) return undefined;
  const suffix = `${path.sep}${normalized}`;
  for (const root of roots) {
    let scanned = 0;
    const queue: { dir: string; depth: number }[] = [{ dir: root, depth: 0 }];
    while (queue.length > 0 && scanned < SUFFIX_SEARCH_MAX_ENTRIES) {
      const { dir, depth } = queue.shift()!;
      let entries: fs.Dirent[];
      try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
      } catch {
        continue;
      }
      scanned += entries.length;
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (depth < SUFFIX_SEARCH_MAX_DEPTH && !SUFFIX_SEARCH_SKIP_DIRS.has(entry.name)) {
            queue.push({ dir: full, depth: depth + 1 });
          }
        } else if (entry.isFile() && full.endsWith(suffix)) {
          try {
            const candidate = fs.realpathSync(full);
            if (isInside(root, candidate)) return candidate;
          } catch { /* 与直接探测一致：realpath 失败视为未命中 */ }
        }
      }
    }
  }
  return undefined;
}

function isWindowsAbsolute(input: string): boolean {
  return /^[A-Za-z]:[\\/]/.test(input) || input.startsWith('\\\\');
}

/**
 * 把 AI 答复里的本地文件路径解析到允许根集合（DATA_ROOT + 当前工作区）内的真实文件。
 * 三种形态都要中：
 * 1. Windows 绝对（C:\...，含 / 变体）与真实 Unix 绝对：realpath 后必须在根内，否则 outside；
 * 2. 相对路径（.dsh-vision-toolkit/artifacts/x.png）：逐根 join 探测，取第一个存在者；
 * 3. 前导 / 的伪 Unix 绝对（/artifacts/x.png）：先按真实绝对判定，失败/越界后剥掉
 *    前导 / 按相对路径兜底探测；直接探测都未命中时做一次有界后缀搜索。
 */
export function resolveLocalChatFilePath(input: string, roots: string[]): string {
  const trimmed = typeof input === 'string' ? input.trim() : '';
  if (!trimmed || trimmed.includes('\0')) {
    throw new LocalPathError('required', 'path is required');
  }
  if (roots.length === 0) {
    throw new LocalPathError('notfound', `local file not found: ${trimmed}`);
  }

  if (isWindowsAbsolute(trimmed)) {
    return realpathInsideRoots(roots, trimmed);
  }

  if (trimmed.startsWith('/')) {
    // 先按真实 Unix 绝对路径判定（Linux/macOS 部署与绝对引用）；
    // 不存在或越界时，剥掉前导 / 按"模型 Unix 化的 cwd 相对路径"兜底探测。
    try {
      return realpathInsideRoots(roots, trimmed);
    } catch (absoluteError) {
      const relative = trimmed.replace(/^\/+/, '');
      const probed = probeRelativeInRoots(roots, relative) ?? suffixSearchInRoots(roots, relative);
      if (probed) return probed;
      throw absoluteError;
    }
  }

  const probed = probeRelativeInRoots(roots, trimmed) ?? suffixSearchInRoots(roots, trimmed);
  if (probed) return probed;
  throw new LocalPathError('notfound', `local file not found: ${trimmed}`);
}
