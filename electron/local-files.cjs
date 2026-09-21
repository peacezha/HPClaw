const path = require('node:path');
const { Readable } = require('node:stream');

function assertSafeLocalPath(input) {
  if (!input || !input.trim()) throw new Error('path is required');
  if (input.includes('\0')) throw new Error('path contains a null byte');
  const normalized = path.win32.normalize(input);
  if (normalized.startsWith('\\\\.\\') || normalized.startsWith('\\\\?\\')) {
    throw new Error('local device paths are not allowed');
  }
  return normalized;
}

function createLocalFileService({ fs, shell: _shell } = {}) {
  if (!fs) {
    fs = require('node:fs/promises');
  }

  const os = require('node:os');

  async function listDrives() {
    if (process.platform === 'win32') {
      const { execFile } = require('node:child_process');
      return new Promise((resolve, reject) => {
        execFile('wmic', ['logicaldisk', 'get', 'name'], { windowsHide: true }, (err, stdout) => {
          if (err) {
            // Fallback: try to list A-Z drives
            const drives = [];
            for (let i = 65; i <= 90; i++) {
              const letter = String.fromCharCode(i);
              try {
                const drivePath = `${letter}:\\`;
                require('node:fs').accessSync(drivePath);
                drives.push(drivePath);
              } catch {}
            }
            resolve(drives);
          } else {
            const drives = stdout
              .split(/\r?\n/)
              .map(line => line.trim())
              .filter(line => /^[A-Za-z]:$/.test(line))
              .map(line => `${line[0]}:\\`);
            resolve(drives);
          }
        });
      });
    }
    // Unix: return just '/'
    return ['/'];
  }

  async function list(directoryPath) {
    const safePath = assertSafeLocalPath(directoryPath);
    const dir = await fs.opendir(safePath);
    const entries = [];
    for await (const entry of dir) {
      const fullPath = path.win32.join(safePath, entry.name);
      let stat;
      try {
        stat = await fs.stat(fullPath);
      } catch {
        continue;
      }
      entries.push({
        name: entry.name,
        path: fullPath,
        kind: entry.isDirectory() ? 'directory' : entry.isSymbolicLink() ? 'symlink' : 'file',
        size: stat.size,
        modifiedAt: stat.mtimeMs,
      });
    }
    return entries;
  }

  async function stat(targetPath) {
    const safePath = assertSafeLocalPath(targetPath);
    const s = await fs.stat(safePath);
    return {
      name: path.win32.basename(safePath),
      path: safePath,
      kind: s.isDirectory() ? 'directory' : s.isSymbolicLink() ? 'symlink' : 'file',
      size: s.size,
      modifiedAt: s.mtimeMs,
    };
  }

  async function mkdir(targetPath) {
    const safePath = assertSafeLocalPath(targetPath);
    await fs.mkdir(safePath, { recursive: true });
  }

  async function createFile(targetPath) {
    const safePath = assertSafeLocalPath(targetPath);
    // wx: 已存在则报错，避免覆盖
    await fs.writeFile(safePath, '', { flag: 'wx' });
  }

  async function writeFile(targetPath, content) {
    const safePath = assertSafeLocalPath(targetPath);
    if (typeof content !== 'string') throw new Error('content must be a string');
    await fs.writeFile(safePath, content, 'utf8');
  }

  /** 递归遍历目录：返回文件（含大小）与子目录（绝对路径），超过上限截断。 */
  async function walk(rootPath, maxEntries = 5000) {
    const safeRoot = assertSafeLocalPath(rootPath);
    const files = [];
    const dirs = [];
    let truncated = false;
    const pending = [safeRoot];
    while (pending.length > 0) {
      if (files.length + dirs.length >= maxEntries) {
        truncated = true;
        break;
      }
      const dir = pending.pop();
      let entries;
      try {
        entries = await fs.readdir(dir, { withFileTypes: true });
      } catch {
        continue; // 无权限等错误跳过
      }
      for (const entry of entries) {
        const fullPath = path.win32.join(dir, entry.name);
        if (entry.isDirectory()) {
          dirs.push(fullPath);
          pending.push(fullPath);
        } else if (entry.isFile()) {
          let size = 0;
          try {
            size = (await fs.stat(fullPath)).size;
          } catch { /* 取不到大小按 0 处理 */ }
          files.push({ path: fullPath, size });
        }
        // symlink 不跟随，避免循环
      }
    }
    return { files, dirs, truncated };
  }

  async function rename(from, to) {
    const safeFrom = assertSafeLocalPath(from);
    const safeTo = assertSafeLocalPath(to);
    await fs.rename(safeFrom, safeTo);
  }

  async function pathExists(targetPath) {
    try {
      await fs.stat(targetPath);
      return true;
    } catch (error) {
      if (error?.code === 'ENOENT') return false;
      throw error;
    }
  }

  async function uniqueCopyDestination(sourcePath, targetDirectory, directory) {
    const sourceName = path.win32.basename(sourcePath);
    const parsed = path.win32.parse(sourceName);
    for (let index = 0; index < 10_000; index += 1) {
      const suffix = index === 0 ? '' : index === 1 ? ' - 副本' : ` - 副本 (${index})`;
      const candidateName = directory
        ? `${sourceName}${suffix}`
        : `${parsed.name}${suffix}${parsed.ext}`;
      const candidate = assertSafeLocalPath(path.win32.join(targetDirectory, candidateName));
      if (!await pathExists(candidate)) return candidate;
    }
    throw new Error(`unable to allocate a copy name for ${sourceName}`);
  }

  async function copy(sourcePaths, targetDirectory) {
    if (!Array.isArray(sourcePaths) || sourcePaths.length === 0) {
      throw new Error('source paths are required');
    }
    const safeTargetDirectory = assertSafeLocalPath(targetDirectory);
    const targetStat = await fs.stat(safeTargetDirectory);
    if (!targetStat.isDirectory()) throw new Error('copy target must be a directory');

    const copiedPaths = [];
    for (const sourcePath of sourcePaths) {
      const safeSource = assertSafeLocalPath(sourcePath);
      const sourceStat = await fs.lstat(safeSource);
      const sourceIsDirectory = sourceStat.isDirectory();
      const normalizedSource = safeSource.replace(/[\\/]+$/, '').toLocaleLowerCase();
      const normalizedTarget = safeTargetDirectory.replace(/[\\/]+$/, '').toLocaleLowerCase();
      if (sourceIsDirectory && (
        normalizedTarget === normalizedSource
        || normalizedTarget.startsWith(`${normalizedSource}\\`)
      )) {
        throw new Error('cannot copy a directory into itself');
      }
      const destination = await uniqueCopyDestination(
        safeSource,
        safeTargetDirectory,
        sourceIsDirectory,
      );
      await fs.cp(safeSource, destination, {
        recursive: sourceIsDirectory,
        force: false,
        errorOnExist: true,
        verbatimSymlinks: true,
      });
      copiedPaths.push(destination);
    }
    return { paths: copiedPaths };
  }

  function getShell() {
    if (_shell) return _shell;
    return require('electron').shell;
  }

  async function trash(targetPath) {
    const safePath = assertSafeLocalPath(targetPath);
    try {
      await getShell().trashItem(safePath);
    } catch {
      // Fallback: permanent delete
      const stat = await fs.stat(safePath);
      if (stat.isDirectory()) {
        await fs.rm(safePath, { recursive: true, force: true });
      } else {
        await fs.unlink(safePath);
      }
    }
  }

  async function readPreview(targetPath, maxBytesOrOptions) {
    const safePath = assertSafeLocalPath(targetPath);
    const legacy = typeof maxBytesOrOptions === 'number';
    const options = legacy
      ? { mode: 'binary', maxBytes: maxBytesOrOptions }
      : maxBytesOrOptions;
    if (!options || !['binary', 'text', 'head'].includes(options.mode)) {
      throw new Error('preview mode must be binary, text, or head');
    }
    if (!Number.isInteger(options.maxBytes) || options.maxBytes < 1 || options.maxBytes > 50 * 1024 * 1024) {
      throw new Error('preview limit must be between 1 byte and 50 MiB');
    }
    const lineLimit = options.mode === 'head' ? options.lineLimit : undefined;
    if (options.mode === 'head' && (!Number.isInteger(lineLimit) || lineLimit < 1 || lineLimit > 200)) {
      throw new Error('preview line limit must be between 1 and 200');
    }
    const fileStat = await fs.stat(safePath);
    const handle = await fs.open(safePath, 'r');
    try {
      const chunks = [];
      let bytesRead = 0;
      let lineCount = 0;
      let position = 0;
      let reachedLineLimit = false;
      const chunkSize = Math.min(64 * 1024, options.maxBytes);

      while (bytesRead < options.maxBytes && !reachedLineLimit) {
        const buffer = Buffer.alloc(Math.min(chunkSize, options.maxBytes - bytesRead));
        const result = await handle.read(buffer, 0, buffer.length, position);
        if (result.bytesRead === 0) break;
        position += result.bytesRead;
        let usable = buffer.subarray(0, result.bytesRead);

        if (options.mode === 'head') {
          for (let index = 0; index < usable.length; index += 1) {
            if (usable[index] === 10) {
              lineCount += 1;
              if (lineCount === lineLimit) {
                usable = usable.subarray(0, index);
                reachedLineLimit = true;
                break;
              }
            }
          }
        }

        chunks.push(usable);
        bytesRead += usable.length;
        if (result.bytesRead < buffer.length) break;
      }

      const content = Buffer.concat(chunks, bytesRead);
      if (legacy) return content;
      return {
        path: safePath,
        encoding: options.mode === 'binary' ? 'base64' : 'utf8',
        content: options.mode === 'binary' ? content.toString('base64') : content.toString('utf8'),
        bytesRead,
        totalSize: fileStat.size,
        truncated: reachedLineLimit || bytesRead < fileStat.size,
        ...(lineLimit === undefined ? {} : { lineLimit }),
      };
    } finally {
      await handle.close();
    }
  }

  async function search(root, query, signal) {
    const safeRoot = assertSafeLocalPath(root);
    const queryLower = query.toLowerCase();
    const results = [];

    async function walk(dirPath) {
      if (signal && signal.aborted) return;
      try {
        const dir = await fs.opendir(dirPath);
        for await (const entry of dir) {
          if (signal && signal.aborted) return;
          const fullPath = path.win32.join(dirPath, entry.name);
          if (entry.name.toLowerCase().includes(queryLower)) {
            let statEntry;
            try {
              statEntry = await fs.stat(fullPath);
            } catch {
              continue;
            }
            results.push({
              name: entry.name,
              path: fullPath,
              kind: entry.isDirectory() ? 'directory' : entry.isSymbolicLink() ? 'symlink' : 'file',
              size: statEntry.size,
              modifiedAt: statEntry.mtimeMs,
            });
          }
          if (entry.isDirectory()) {
            await walk(fullPath);
          }
        }
      } catch {
        // Permission errors, skip
      }
    }

    await walk(safeRoot);
    return results;
  }

  return {
    listDrives,
    list,
    stat,
    mkdir,
    createFile,
    writeFile,
    walk,
    rename,
    copy,
    trash,
    readPreview,
    search,
  };
}

module.exports = { createLocalFileService, assertSafeLocalPath };
