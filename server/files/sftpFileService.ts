import path from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import type { Readable as ReadableType, Writable } from 'node:stream';
import type { SFTPWrapper } from 'ssh2';
import type { EntryKind, FileEntry } from '../../shared/fileTransfer';
import type { FilePreviewPayload, PreviewReadOptions } from '../../shared/filePreview';
import { assertSafeRemoteMutation, assertSafeRemotePath } from './pathSafety';

interface SftpAttributes {
  size?: number;
  mtime?: number;
  mode?: number;
}

interface SftpDirectoryEntry {
  filename: string;
  longname: string;
  attrs: SftpAttributes;
}

interface SftpCallbacks {
  readdir(remotePath: string, callback: (error?: Error, entries?: SftpDirectoryEntry[]) => void): void;
  stat(remotePath: string, callback: (error?: Error, attrs?: SftpAttributes) => void): void;
  lstat(remotePath: string, callback: (error?: Error, attrs?: SftpAttributes) => void): void;
  mkdir(remotePath: string, callback: (error?: Error) => void): void;
  rename(from: string, to: string, callback: (error?: Error) => void): void;
  unlink(remotePath: string, callback: (error?: Error) => void): void;
  rmdir(remotePath: string, callback: (error?: Error) => void): void;
  chmod(remotePath: string, mode: number, callback: (error?: Error) => void): void;
  createReadStream(remotePath: string, options: { end: number }): ReadableType;
  createWriteStream(remotePath: string): Writable;
}

function asError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

function abortError(): Error {
  const error = new Error('search aborted');
  error.name = 'AbortError';
  return error;
}

function kindFrom(mode: number | undefined, longname = ''): EntryKind {
  const type = (mode ?? 0) & 0o170000;
  if (type === 0o040000 || longname.startsWith('d')) return 'directory';
  if (type === 0o120000 || longname.startsWith('l')) return 'symlink';
  return 'file';
}

function ownerAndGroup(longname: string): Pick<FileEntry, 'owner' | 'group'> {
  const fields = longname.trim().split(/\s+/);
  return fields.length >= 4 ? { owner: fields[2], group: fields[3] } : {};
}

function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'"'"'`)}'`;
}

export class SftpFileService {
  private readonly callbacks: SftpCallbacks;

  constructor(
    private readonly sftp: SFTPWrapper,
    private readonly home: string,
    private readonly exec?: (command: string, timeout?: number) => Promise<string>,
  ) {
    this.callbacks = sftp as unknown as SftpCallbacks;
  }

  async list(remotePath: string): Promise<FileEntry[]> {
    const safePath = assertSafeRemotePath(remotePath);
    const entries = await this.readDirectory(safePath);
    return entries
      .filter(entry => entry.filename !== '.' && entry.filename !== '..')
      .map(entry => this.toEntry(path.posix.join(safePath, entry.filename), entry.attrs, entry.longname))
      .sort((left, right) => {
        if (left.kind === 'directory' && right.kind !== 'directory') return -1;
        if (left.kind !== 'directory' && right.kind === 'directory') return 1;
        return left.name.localeCompare(right.name, undefined, { sensitivity: 'base' });
      });
  }

  async stat(remotePath: string): Promise<FileEntry> {
    const safePath = assertSafeRemotePath(remotePath);
    const attrs = await this.readStat(safePath);
    return this.toEntry(safePath, attrs);
  }

  async mkdir(remotePath: string): Promise<void> {
    const safePath = assertSafeRemoteMutation(remotePath, this.home);
    await this.noResult(callback => this.callbacks.mkdir(safePath, callback));
  }

  async rename(from: string, to: string): Promise<void> {
    const safeFrom = assertSafeRemoteMutation(from, this.home);
    const safeTo = assertSafeRemoteMutation(to, this.home);
    await this.noResult(callback => this.callbacks.rename(safeFrom, safeTo, callback));
  }

  async copy(sourcePaths: string[], targetDirectory: string): Promise<{ paths: string[] }> {
    if (!Array.isArray(sourcePaths) || sourcePaths.length === 0) {
      throw new Error('source paths are required');
    }
    if (!this.exec) throw new Error('copy requires the authenticated remote command channel');

    const safeTargetDirectory = assertSafeRemotePath(targetDirectory);
    const targetEntry = await this.stat(safeTargetDirectory);
    if (targetEntry.kind !== 'directory') throw new Error('copy target must be a directory');

    const copiedPaths: string[] = [];
    for (const sourcePath of sourcePaths) {
      const safeSource = assertSafeRemotePath(sourcePath);
      const sourceEntry = await this.stat(safeSource);
      if (sourceEntry.kind === 'directory' && (
        safeTargetDirectory === safeSource
        || safeTargetDirectory.startsWith(`${safeSource.replace(/\/$/, '')}/`)
      )) {
        throw new Error('cannot copy a directory into itself');
      }

      const parsed = path.posix.parse(safeSource);
      let destination = '';
      for (let index = 0; index < 10_000; index += 1) {
        const suffix = index === 0 ? '' : index === 1 ? ' - 副本' : ` - 副本 (${index})`;
        const candidateName = sourceEntry.kind === 'directory'
          ? `${parsed.base}${suffix}`
          : `${parsed.name}${suffix}${parsed.ext}`;
        const candidate = assertSafeRemoteMutation(
          path.posix.join(safeTargetDirectory, candidateName),
          this.home,
        );
        try {
          await this.readLstat(candidate);
        } catch (error) {
          const code = (error as { code?: string | number })?.code;
          if (code === 'ENOENT' || code === 2) {
            destination = candidate;
            break;
          }
          throw error;
        }
      }
      if (!destination) throw new Error(`unable to allocate a copy name for ${parsed.base}`);

      await this.exec(
        `cp -a -- ${shellQuote(safeSource)} ${shellQuote(destination)}`,
        5 * 60_000,
      );
      copiedPaths.push(destination);
    }
    return { paths: copiedPaths };
  }

  async remove(remotePath: string, recursive: boolean): Promise<{ removed: number }> {
    const safePath = assertSafeRemoteMutation(remotePath, this.home);
    return { removed: await this.removeEntry(safePath, recursive) };
  }

  async chmod(remotePath: string, mode: number): Promise<void> {
    if (!Number.isInteger(mode) || mode < 0 || mode > 0o777) {
      throw new Error('mode must be an octal value from 000 to 777');
    }
    const safePath = assertSafeRemoteMutation(remotePath, this.home);
    await this.noResult(callback => this.callbacks.chmod(safePath, mode, callback));
  }

  /** 新建空文件（已存在则报错，不覆盖） */
  async touch(remotePath: string): Promise<void> {
    const safePath = assertSafeRemoteMutation(remotePath, this.home);
    if (!this.exec) throw new Error('touch requires the authenticated remote command channel');
    await this.exec(
      `sh -c 'if [ -e "$1" ]; then echo "already exists: $1" >&2; exit 17; fi; touch -- "$1"' hpclaw ${shellQuote(safePath)}`,
      15_000,
    );
  }

  /** 递归遍历目录：返回文件（含大小）与子目录，超过上限截断。symlink 不跟随，避免循环。 */
  async walk(
    root: string,
    maxEntries = 5_000,
  ): Promise<{ files: { path: string; size: number }[]; dirs: string[]; truncated: boolean }> {
    const safeRoot = assertSafeRemotePath(root);
    if (!Number.isInteger(maxEntries) || maxEntries < 1) {
      throw new Error('walk limit must be a positive integer');
    }
    const files: { path: string; size: number }[] = [];
    const dirs: string[] = [];
    let truncated = false;
    const pending = [safeRoot];
    while (pending.length) {
      const directory = pending.pop()!;
      for (const entry of await this.list(directory)) {
        if (entry.kind === 'directory') {
          dirs.push(entry.path);
          pending.push(entry.path);
        } else if (entry.kind === 'file') {
          files.push({ path: entry.path, size: entry.size });
        }
        if (files.length + dirs.length >= maxEntries) {
          truncated = true;
          break;
        }
      }
      if (truncated) break;
    }
    return { files, dirs, truncated };
  }

  async readPreview(remotePath: string, maxBytes: number): Promise<Buffer>;
  async readPreview(remotePath: string, options: PreviewReadOptions): Promise<FilePreviewPayload>;
  async readPreview(remotePath: string, maxBytesOrOptions: number | PreviewReadOptions): Promise<Buffer | FilePreviewPayload> {
    const safePath = assertSafeRemotePath(remotePath);
    const legacy = typeof maxBytesOrOptions === 'number';
    const options: PreviewReadOptions = legacy
      ? { mode: 'binary', maxBytes: maxBytesOrOptions }
      : maxBytesOrOptions;
    if (!Number.isInteger(options.maxBytes) || options.maxBytes < 1 || options.maxBytes > 50 * 1024 * 1024) {
      throw new Error('preview limit must be between 1 byte and 50 MiB');
    }
    if (!['binary', 'text', 'head'].includes(options.mode)) {
      throw new Error('preview mode must be binary, text, or head');
    }
    if (options.mode === 'head' && (!Number.isInteger(options.lineLimit) || options.lineLimit! < 1 || options.lineLimit! > 200)) {
      throw new Error('preview line limit must be between 1 and 200');
    }

    const stream = this.callbacks.createReadStream(safePath, { end: options.maxBytes - 1 });
    const chunks: Buffer[] = [];
    let length = 0;
    let lineCount = 0;
    let reachedLineLimit = false;
    try {
      for await (const chunk of stream) {
        const bytes = Buffer.from(chunk);
        const remaining = options.maxBytes - length;
        if (remaining <= 0) break;
        let usable = bytes.subarray(0, remaining);
        if (options.mode === 'head') {
          for (let index = 0; index < usable.length; index += 1) {
            if (usable[index] === 10) {
              lineCount += 1;
              if (lineCount === options.lineLimit) {
                usable = usable.subarray(0, index);
                reachedLineLimit = true;
                break;
              }
            }
          }
        }
        chunks.push(usable);
        length += usable.length;
        if (reachedLineLimit || bytes.length > remaining) break;
      }
    } finally {
      stream.destroy();
    }
    const preview = Buffer.concat(chunks, length);
    if (legacy) return preview;
    const attrs = await this.readStat(safePath);
    const totalSize = attrs.size ?? length;
    return {
      path: safePath,
      encoding: options.mode === 'binary' ? 'base64' : 'utf8',
      content: options.mode === 'binary' ? preview.toString('base64') : preview.toString('utf8'),
      bytesRead: length,
      totalSize,
      truncated: reachedLineLimit || length < totalSize,
      ...(options.lineLimit === undefined ? {} : { lineLimit: options.lineLimit }),
    };
  }

  async writeFile(remotePath: string, content: string): Promise<void> {
    const safePath = assertSafeRemoteMutation(remotePath, this.home);
    if (typeof content !== 'string') throw new Error('content must be a string');
    await pipeline(Readable.from([Buffer.from(content, 'utf8')]), this.callbacks.createWriteStream(safePath));
  }

  async *search(root: string, query: string, signal: AbortSignal, maxResults = 5_000): AsyncGenerator<FileEntry[]> {
    const safeRoot = assertSafeRemotePath(root);
    if (!/^[A-Za-z0-9._ -]{1,128}$/.test(query)) {
      throw new Error('search query contains unsupported filename characters');
    }
    if (!Number.isInteger(maxResults) || maxResults < 1) {
      throw new Error('search result limit must be a positive integer');
    }
    this.throwIfAborted(signal);
    yield* this.searchWithSftp(safeRoot, query.toLocaleLowerCase(), signal, maxResults);
  }

  private async *searchWithSftp(root: string, query: string, signal: AbortSignal, maxResults: number): AsyncGenerator<FileEntry[]> {
    const pending = [root];
    const batch: FileEntry[] = [];
    let matched = 0;
    while (pending.length) {
      this.throwIfAborted(signal);
      const directory = pending.pop()!;
      for (const entry of await this.list(directory)) {
        this.throwIfAborted(signal);
        if (entry.kind === 'directory') {
          pending.push(entry.path);
          continue;
        }
        if (!entry.name.toLocaleLowerCase().includes(query)) continue;
        matched += 1;
        batch.push(entry);
        if (batch.length === 100) yield batch.splice(0);
        if (matched >= maxResults) {
          if (batch.length) yield batch;
          return;
        }
      }
    }
    if (batch.length) yield batch;
  }

  private async removeEntry(remotePath: string, recursive: boolean): Promise<number> {
    const safePath = assertSafeRemoteMutation(remotePath, this.home);
    if (recursive) return this.removeRecursively(safePath);

    const entry = this.toEntry(safePath, await this.readLstat(safePath));
    if (entry.kind !== 'directory') {
      await this.noResult(callback => this.callbacks.unlink(safePath, callback));
      return 1;
    }
    await this.noResult(callback => this.callbacks.rmdir(safePath, callback));
    return 1;
  }

  private async removeRecursively(remotePath: string): Promise<number> {
    if (!this.exec) throw new Error('recursive removal requires the authenticated remote command channel');
    const command = `sh -c 'find -P -- "$1" -depth -delete -printf .' hpclaw ${shellQuote(remotePath)}`;
    const output = await this.exec(command, 30_000);
    let count = 0;
    for (let i = 0; i < output.length; i++) {
      if (output[i] === '.') count++;
    }
    return count;
  }

  private toEntry(remotePath: string, attrs: SftpAttributes, longname = ''): FileEntry {
    const safePath = assertSafeRemotePath(remotePath);
    const mode = attrs.mode;
    return {
      name: path.posix.basename(safePath) || '/',
      path: safePath,
      kind: kindFrom(mode, longname),
      size: attrs.size ?? 0,
      modifiedAt: (attrs.mtime ?? 0) * 1_000,
      ...(mode === undefined ? {} : { permissions: mode & 0o777 }),
      ...ownerAndGroup(longname),
    };
  }

  private readDirectory(remotePath: string): Promise<SftpDirectoryEntry[]> {
    return new Promise((resolve, reject) => {
      this.callbacks.readdir(remotePath, (error, entries) => {
        if (error) reject(asError(error));
        else resolve(entries ?? []);
      });
    });
  }

  private readStat(remotePath: string): Promise<SftpAttributes> {
    return new Promise((resolve, reject) => {
      this.callbacks.stat(remotePath, (error, attrs) => {
        if (error) reject(asError(error));
        else if (attrs) resolve(attrs);
        else reject(new Error('SFTP stat returned no attributes'));
      });
    });
  }

  private readLstat(remotePath: string): Promise<SftpAttributes> {
    return new Promise((resolve, reject) => {
      this.callbacks.lstat(remotePath, (error, attrs) => {
        if (error) reject(asError(error));
        else if (attrs) resolve(attrs);
        else reject(new Error('SFTP lstat returned no attributes'));
      });
    });
  }

  private noResult(invoke: (callback: (error?: Error) => void) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      invoke(error => error ? reject(asError(error)) : resolve());
    });
  }

  private throwIfAborted(signal: AbortSignal): void {
    if (signal.aborted) throw abortError();
  }

}
