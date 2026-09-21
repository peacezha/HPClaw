// 整文件夹传输：把拖拽/右键的源路径（文件或目录）展开为逐文件传输清单。
import type { FileEntry } from '@/shared/fileTransfer';

export interface ExpandedFile {
  localPath: string;
  remotePath: string;
  totalBytes: number;
}

export interface FolderExpansion {
  files: ExpandedFile[];
  /** 需要先在目标端创建的目录（按层级从浅到深排序，父目录在前） */
  targetDirs: string[];
  truncated: boolean;
  folderCount: number;
}

export interface WalkResult {
  files: { path: string; size: number }[];
  dirs: string[];
  truncated: boolean;
}

const baseName = (p: string) => p.split(/[/\\]/).filter(Boolean).pop() || '';
const stripTrailing = (p: string) => p.replace(/[/\\]+$/, '');
const joinRemote = (dir: string, name: string) =>
  dir.endsWith('/') ? dir + name : `${dir}/${name}`;
const joinLocal = (dir: string, name: string) =>
  dir.endsWith('\\') ? dir + name : `${dir}\\${name}`;

/** 远程 → 远程（集群互传）：展开源集群路径为逐文件清单（目标也是远端 posix 路径） */
export async function expandForRemoteCopy(
  sourcePaths: string[],
  targetRemoteDir: string,
  deps: {
    statRemote: (p: string) => Promise<FileEntry>;
    walkRemote: (p: string) => Promise<WalkResult>;
  },
): Promise<FolderExpansion> {
  // expandForUpload 的映射正是"源 → 远端 posix 目标"，源端换成远程 stat/walk 即可复用
  return expandForUpload(sourcePaths, targetRemoteDir, {
    statLocal: deps.statRemote,
    walkLocal: deps.walkRemote,
  });
}

/** 本地 → 远程：展开源路径（本地文件/目录）为上传清单 */
export async function expandForUpload(
  sourcePaths: string[],
  targetRemoteDir: string,
  deps: {
    statLocal: (p: string) => Promise<FileEntry>;
    walkLocal: (p: string) => Promise<WalkResult>;
  },
): Promise<FolderExpansion> {
  const files: ExpandedFile[] = [];
  const targetDirs = new Set<string>();
  let truncated = false;
  let folderCount = 0;

  for (const rawPath of sourcePaths) {
    const sourcePath = stripTrailing(rawPath);
    const stat = await deps.statLocal(sourcePath);
    if (stat.kind !== 'directory') {
      files.push({
        localPath: sourcePath,
        remotePath: joinRemote(targetRemoteDir, baseName(sourcePath) || 'file'),
        totalBytes: stat.size,
      });
      continue;
    }

    folderCount++;
    const remoteRoot = joinRemote(targetRemoteDir, baseName(sourcePath) || 'folder');
    targetDirs.add(remoteRoot);
    const walk = await deps.walkLocal(sourcePath);
    truncated = truncated || walk.truncated;

    for (const dir of walk.dirs) {
      const rel = dir.slice(sourcePath.length).replace(/^[\\/]+/, '').replace(/\\/g, '/');
      if (rel) targetDirs.add(`${remoteRoot}/${rel}`);
    }
    for (const f of walk.files) {
      const rel = f.path.slice(sourcePath.length).replace(/^[\\/]+/, '').replace(/\\/g, '/');
      if (!rel) continue;
      files.push({ localPath: f.path, remotePath: `${remoteRoot}/${rel}`, totalBytes: f.size });
    }
  }

  const sortedDirs = [...targetDirs].sort(
    (a, b) => a.split('/').length - b.split('/').length || a.localeCompare(b),
  );
  return { files, targetDirs: sortedDirs, truncated, folderCount };
}

/** 远程 → 本地：展开源路径（远程文件/目录）为下载清单 */
export async function expandForDownload(
  sourcePaths: string[],
  targetLocalDir: string,
  deps: {
    statRemote: (p: string) => Promise<FileEntry>;
    walkRemote: (p: string) => Promise<WalkResult>;
  },
): Promise<FolderExpansion> {
  const files: ExpandedFile[] = [];
  const targetDirs = new Set<string>();
  let truncated = false;
  let folderCount = 0;

  for (const rawPath of sourcePaths) {
    const sourcePath = stripTrailing(rawPath);
    const stat = await deps.statRemote(sourcePath);
    if (stat.kind !== 'directory') {
      files.push({
        localPath: joinLocal(targetLocalDir, baseName(sourcePath) || 'file'),
        remotePath: sourcePath,
        totalBytes: stat.size,
      });
      continue;
    }

    folderCount++;
    const localRoot = joinLocal(targetLocalDir, baseName(sourcePath) || 'folder');
    targetDirs.add(localRoot);
    const walk = await deps.walkRemote(sourcePath);
    truncated = truncated || walk.truncated;

    for (const dir of walk.dirs) {
      const rel = dir.slice(sourcePath.length).replace(/^[\\/]+/, '').replace(/\//g, '\\');
      if (rel) targetDirs.add(`${localRoot}\\${rel}`);
    }
    for (const f of walk.files) {
      const rel = f.path.slice(sourcePath.length).replace(/^[\\/]+/, '').replace(/\//g, '\\');
      if (!rel) continue;
      files.push({ localPath: `${localRoot}\\${rel}`, remotePath: f.path, totalBytes: f.size });
    }
  }

  const sortedDirs = [...targetDirs].sort(
    (a, b) => a.split('\\').length - b.split('\\').length || a.localeCompare(b),
  );
  return { files, targetDirs: sortedDirs, truncated, folderCount };
}
