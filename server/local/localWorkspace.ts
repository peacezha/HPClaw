// 本地工作区（无集群时的本地文件分析）服务端守卫。
// 安全契约（硬性）：
// 1. 工作区必填——所有操作都先 resolveWorkspaceRoot，未设置/非法直接拒绝；
// 2. 读写都限制在工作区内——相对路径解析 + realpath + isInside，符号链接越界一并拒绝；
// 3. 只许新建——write 用 flag:'wx'，已存在即失败；本模块不提供任何删除/覆盖/移动入口。
// realpath + isInside 的判定与 server/files/localPaths.ts、server/dsh/workspace.ts 保持一致。

import fs from 'node:fs';
import path from 'node:path';
import { exec } from 'node:child_process';

export type LocalWorkspaceFailure =
  | 'required'   // 未设置工作区
  | 'notfound'   // 工作区或目标不存在
  | 'outside'    // 越界（../、绝对路径、符号链接）
  | 'exists'     // 写入目标已存在（不允许覆盖）
  | 'binary'     // 二进制文件不支持文本读取
  | 'notdir'     // 列举目标不是目录
  | 'notfile'    // 读取目标不是文件
  | 'blocked';   // 命中危险命令黑名单

/** 带失败类别的本地工作区错误：工具层据此把原因回传给模型 */
export class LocalWorkspaceError extends Error {
  constructor(readonly failure: LocalWorkspaceFailure, message: string) {
    super(message);
    this.name = 'LocalWorkspaceError';
  }
}

/** 未设置工作区时工具统一回传的引导文案（agentRunner 测试也引用它） */
export const LOCAL_WORKSPACE_NOT_SET_MESSAGE = '未设置本地工作区路径，请先在对话输入框上方填写工作区目录';

export const LOCAL_LIST_MAX_ENTRIES = 500;
export const LOCAL_FILE_READ_MAX_LINES = 2_000;
export const LOCAL_FILE_READ_MAX_BYTES = 256 * 1024;
export const LOCAL_COMMAND_TIMEOUT_MS = 120_000;
export const LOCAL_COMMAND_MAX_OUTPUT_CHARS = 64 * 1024;

/** 危险命令黑名单：本地命令只允许读与新建，删除/格式化/关机类一律硬拒绝（不是确认，是拒绝） */
const LOCAL_COMMAND_BLACKLIST = /\brm\b|\bdel\b|\berase\b|\brd\b|\brmdir\b|\bformat\b|\bmkfs|\bshutdown|\breboot|\bRemove-Item\b|\bdiskpart/i;

/** 供工具层在请求用户确认之前先做硬拒绝判定，避免危险命令白弹一次确认框 */
export function isBlockedLocalCommand(command: string): boolean {
  return LOCAL_COMMAND_BLACKLIST.test(command);
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

function isAbsoluteAny(input: string): boolean {
  return path.isAbsolute(input) || /^[A-Za-z]:[\\/]/.test(input) || input.startsWith('\\\\');
}

/**
 * 规范化并校验工作区根：必填、存在、是目录；返回 realpath 后的绝对路径。
 * 不自动创建目录——工作区必须由用户明确选择，避免 AI 把文件写进用户不认识的角落。
 */
export function resolveWorkspaceRoot(input: unknown): string {
  if (typeof input !== 'string' || !input.trim() || input.includes('\0')) {
    throw new LocalWorkspaceError('required', LOCAL_WORKSPACE_NOT_SET_MESSAGE);
  }
  const resolved = path.resolve(input.trim());
  let stat: fs.Stats;
  try {
    stat = fs.statSync(resolved);
  } catch {
    throw new LocalWorkspaceError('notfound', `本地工作区不存在：${input.trim()}`);
  }
  if (!stat.isDirectory()) {
    throw new LocalWorkspaceError('notdir', `本地工作区不是文件夹：${input.trim()}`);
  }
  try {
    return fs.realpathSync(resolved);
  } catch {
    throw new LocalWorkspaceError('notfound', `本地工作区不可访问：${input.trim()}`);
  }
}

/**
 * 把工作区内的相对路径解析为真实绝对路径。
 * - 只接受相对路径：绝对路径（Windows C:\、UNC、POSIX /）与任何 `..` 段一律拒绝；
 * - 已存在的目标做 realpath，必须仍落在工作区内（阻断符号链接/junction 越界）；
 * - 不存在的目标（新建场景）取最近的已存在祖先 realpath 校验后拼回剩余片段。
 */
export function resolveWorkspaceEntry(
  root: string,
  relPath: string,
  options: { mustExist?: boolean } = {},
): string {
  const input = typeof relPath === 'string' ? relPath.trim() : '';
  if (!input || input.includes('\0')) {
    throw new LocalWorkspaceError('required', '工作区内路径不能为空');
  }
  if (isAbsoluteAny(input)) {
    throw new LocalWorkspaceError('outside', `只允许工作区内的相对路径：${input}`);
  }
  const segments = input.split(/[\\/]+/).filter(Boolean);
  if (segments.some(segment => segment === '..')) {
    throw new LocalWorkspaceError('outside', `路径不允许包含 ..：${input}`);
  }
  const realRoot = fs.realpathSync(root);
  const requested = path.join(realRoot, ...segments);

  let candidate: string;
  if (fs.existsSync(requested)) {
    try {
      candidate = fs.realpathSync(requested);
    } catch {
      throw new LocalWorkspaceError('notfound', `工作区内路径不可访问：${input}`);
    }
  } else {
    if (options.mustExist) {
      throw new LocalWorkspaceError('notfound', `工作区内不存在该路径：${input}`);
    }
    const missing: string[] = [];
    let cursor = requested;
    while (!fs.existsSync(cursor)) {
      const parent = path.dirname(cursor);
      if (parent === cursor) {
        throw new LocalWorkspaceError('notfound', `工作区内路径没有可落点的父目录：${input}`);
      }
      missing.unshift(path.basename(cursor));
      cursor = parent;
    }
    candidate = path.join(fs.realpathSync(cursor), ...missing);
  }

  if (!isInside(realRoot, candidate)) {
    throw new LocalWorkspaceError('outside', `路径越出工作区：${input}`);
  }
  return candidate;
}

export interface LocalWorkspaceListEntry {
  name: string;
  kind: 'directory' | 'file' | 'other';
  size: number;
  mtime: number;
}

export interface LocalWorkspaceListResult {
  path: string;
  entries: LocalWorkspaceListEntry[];
  truncated: boolean;
}

/** 列举工作区内某个子目录：目录优先排序，最多 LOCAL_LIST_MAX_ENTRIES 条。只读，不跟随符号链接。 */
export function listLocalWorkspaceFiles(root: string, relPath = '.'): LocalWorkspaceListResult {
  const target = resolveWorkspaceEntry(root, relPath, { mustExist: true });
  const stat = fs.statSync(target);
  if (!stat.isDirectory()) {
    throw new LocalWorkspaceError('notdir', `不是目录：${relPath}`);
  }
  const dirents = fs.readdirSync(target, { withFileTypes: true });
  const entries: LocalWorkspaceListEntry[] = dirents.map(dirent => {
    // 符号链接不跟随（不 stat 目标）；坏链接/权限不足的条目不拖垮整个列举
    let size = 0;
    let mtime = 0;
    if (dirent.isFile() || dirent.isDirectory()) {
      try {
        const entryStat = fs.statSync(path.join(target, dirent.name));
        size = dirent.isFile() ? entryStat.size : 0;
        mtime = entryStat.mtimeMs;
      } catch { /* 单个条目元数据读取失败按 0 处理 */ }
    }
    return {
      name: dirent.name,
      kind: dirent.isDirectory() ? 'directory' : dirent.isFile() ? 'file' : 'other',
      size,
      mtime,
    };
  });
  entries.sort((a, b) => {
    if ((a.kind === 'directory') !== (b.kind === 'directory')) return a.kind === 'directory' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  return {
    path: relPath,
    entries: entries.slice(0, LOCAL_LIST_MAX_ENTRIES),
    truncated: entries.length > LOCAL_LIST_MAX_ENTRIES,
  };
}

export interface LocalWorkspaceReadResult {
  path: string;
  content: string;
  totalLines: number;
  sizeBytes: number;
  truncated: boolean;
  /** 截断/分页说明，工具层拼进回传给模型的文本 */
  notes: string[];
}

/** 读取工作区内文本文件：默认最多 LOCAL_FILE_READ_MAX_LINES 行 / LOCAL_FILE_READ_MAX_BYTES 字节，二进制拒绝。 */
export function readLocalWorkspaceFile(
  root: string,
  relPath: string,
  options: { offset?: number; limit?: number; maxBytes?: number } = {},
): LocalWorkspaceReadResult {
  const target = resolveWorkspaceEntry(root, relPath, { mustExist: true });
  const stat = fs.statSync(target);
  if (!stat.isFile()) {
    throw new LocalWorkspaceError('notfile', `不是普通文件：${relPath}`);
  }
  const maxBytes = Math.max(1, options.maxBytes ?? LOCAL_FILE_READ_MAX_BYTES);
  const bytesToRead = Math.min(stat.size, maxBytes + 1);
  const buffer = Buffer.alloc(bytesToRead);
  const fd = fs.openSync(target, 'r');
  try {
    fs.readSync(fd, buffer, 0, bytesToRead, 0);
  } finally {
    fs.closeSync(fd);
  }
  if (buffer.includes(0)) {
    throw new LocalWorkspaceError('binary', `二进制文件不支持文本读取：${relPath}`);
  }
  const bytesTruncated = stat.size > maxBytes;
  const text = buffer.subarray(0, Math.min(stat.size, maxBytes)).toString('utf8');
  const allLines = text.split('\n');
  const offset = Math.max(1, Math.floor(options.offset ?? 1));
  const limit = Math.max(1, Math.floor(options.limit ?? LOCAL_FILE_READ_MAX_LINES));
  const page = allLines.slice(offset - 1, offset - 1 + limit);
  const linesTruncated = offset - 1 + page.length < allLines.length;
  const notes: string[] = [];
  if (bytesTruncated) notes.push(`文件超过 ${maxBytes} 字节，已截断（总大小 ${stat.size} 字节）`);
  if (offset > 1) notes.push(`从第 ${offset} 行开始（共 ${allLines.length} 行）`);
  if (linesTruncated) notes.push(`仅显示 ${page.length} 行，后续还有 ${allLines.length - (offset - 1 + page.length)} 行未显示`);
  return {
    path: relPath,
    content: page.join('\n'),
    totalLines: allLines.length,
    sizeBytes: stat.size,
    truncated: bytesTruncated || linesTruncated,
    notes,
  };
}

export interface LocalWorkspaceWriteResult {
  path: string;
  bytes: number;
}

/**
 * 在工作区内新建文件。只允许新建：目标已存在（含符号链接指向已有文件）直接失败，
 * fs.writeFile 的 flag:'wx' 提供原子兜底，杜绝"检查后才被创建"的竞态覆盖。
 * 父目录自动创建；不存在 delete/rename/overwrite 的任何入口。
 */
export function writeLocalWorkspaceFile(
  root: string,
  relPath: string,
  content: string,
  options: { overwrite?: boolean } = {},
): LocalWorkspaceWriteResult {
  const target = resolveWorkspaceEntry(root, relPath);
  if (fs.existsSync(target) && !options.overwrite) {
    throw new LocalWorkspaceError('exists', `文件已存在，不允许覆盖：${relPath}`);
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  try {
    fs.writeFileSync(target, content, { encoding: 'utf8', flag: options.overwrite ? 'w' : 'wx' });
  } catch (err: any) {
    if (err?.code === 'EEXIST') {
      throw new LocalWorkspaceError('exists', `文件已存在，不允许覆盖：${relPath}`);
    }
    throw err;
  }
  return { path: relPath, bytes: Buffer.byteLength(content, 'utf8') };
}

export interface LocalWorkspaceCommandResult {
  ok: boolean;
  exitCode: number | null;
  timedOut: boolean;
  stdout: string;
  stderr: string;
}

function truncateOutput(value: string): string {
  if (value.length <= LOCAL_COMMAND_MAX_OUTPUT_CHARS) return value;
  return `${value.slice(0, LOCAL_COMMAND_MAX_OUTPUT_CHARS)}\n...[输出超过 ${LOCAL_COMMAND_MAX_OUTPUT_CHARS} 字符，已截断]`;
}

/**
 * 在工作区根目录下执行一条本地命令（Windows 走 cmd.exe /c，其余走 sh）。
 * 危险命令（删除/格式化/关机等黑名单）直接拒绝；输出双侧各截断 64KB；超时 120s。
 * 命令自身非零退出不算服务错误——正常返回 ok:false + 退出码，由模型决定下一步。
 */
export function runLocalWorkspaceCommand(
  root: string,
  command: string,
  options: { allowDestructive?: boolean } = {},
): Promise<LocalWorkspaceCommandResult> {
  const input = typeof command === 'string' ? command.trim() : '';
  if (!input || input.includes('\0')) {
    throw new LocalWorkspaceError('required', '命令不能为空');
  }
  if (!options.allowDestructive && LOCAL_COMMAND_BLACKLIST.test(input)) {
    throw new LocalWorkspaceError('blocked', `命令命中本地安全黑名单，已拒绝执行：${input.slice(0, 200)}`);
  }
  return new Promise((resolve) => {
    exec(input, {
      cwd: root,
      shell: process.platform === 'win32' ? (process.env.ComSpec || 'cmd.exe') : '/bin/sh',
      env: process.env,
      timeout: LOCAL_COMMAND_TIMEOUT_MS,
      maxBuffer: 4 * 1024 * 1024,
      windowsHide: true,
    }, (error, stdout, stderr) => {
      const timedOut = Boolean(error && (error as any).killed);
      resolve({
        ok: !error,
        exitCode: typeof (error as any)?.code === 'number' ? (error as any).code : error ? null : 0,
        timedOut,
        stdout: truncateOutput(String(stdout ?? '')),
        stderr: truncateOutput(String(stderr ?? (timedOut ? `命令超过 ${LOCAL_COMMAND_TIMEOUT_MS / 1000}s 已终止` : ''))),
      });
    });
  });
}
