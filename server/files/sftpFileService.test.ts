import { PassThrough } from 'node:stream';
import { describe, expect, it, vi } from 'vitest';
import { SftpFileService } from './sftpFileService';

describe('SftpFileService', () => {
  it('normalizes readdir output and sorts directories first', async () => {
    const sftp = {
      readdir: vi.fn((_path, callback) => callback(null, [
        { filename: 'b.txt', longname: '-rw-r--r-- 1 lin users 8 Jan 1 00:00 b.txt', attrs: { size: 8, mtime: 20, mode: 0o100644 } },
        { filename: 'analysis', longname: 'drwxr-xr-x 2 lin users 0 Jan 1 00:00 analysis', attrs: { size: 0, mtime: 10, mode: 0o40755 } },
      ])),
    } as any;

    const entries = await new SftpFileService(sftp, '/home/lin').list('/home/lin');

    expect(entries).toEqual([
      expect.objectContaining({ name: 'analysis', path: '/home/lin/analysis', kind: 'directory', permissions: 0o755, owner: 'lin', group: 'users' }),
      expect.objectContaining({ name: 'b.txt', path: '/home/lin/b.txt', kind: 'file', size: 8, modifiedAt: 20_000, permissions: 0o644 }),
    ]);
  });

  it('delegates mutations only after path validation', async () => {
    const sftp = {
      mkdir: vi.fn((_path, callback) => callback()),
      rename: vi.fn((_from, _to, callback) => callback()),
      chmod: vi.fn((_path, _mode, callback) => callback()),
      unlink: vi.fn((_path, callback) => callback()),
    } as any;
    const service = new SftpFileService(sftp, '/home/lin');

    await service.mkdir('/home/lin/new');
    await service.rename('/home/lin/a', '/home/lin/b');
    await service.chmod('/home/lin/b', 0o640);

    expect(sftp.mkdir).toHaveBeenCalledWith('/home/lin/new', expect.any(Function));
    expect(sftp.rename).toHaveBeenCalledWith('/home/lin/a', '/home/lin/b', expect.any(Function));
    expect(sftp.chmod).toHaveBeenCalledWith('/home/lin/b', 0o640, expect.any(Function));
    await expect(service.remove('/home/lin', true)).rejects.toThrow('protected remote path');
  });

  it('copies remote files with an automatic conflict-safe name', async () => {
    const sftp = {
      stat: vi.fn((remotePath, callback) => {
        const directory = remotePath === '/home/lin/target';
        callback(null, {
          size: directory ? 0 : 12,
          mtime: 1,
          mode: directory ? 0o40755 : 0o100644,
        });
      }),
      lstat: vi.fn((remotePath, callback) => {
        if (remotePath === '/home/lin/target/report.txt') {
          callback(null, { size: 1, mtime: 1, mode: 0o100644 });
          return;
        }
        const error = Object.assign(new Error('not found'), { code: 'ENOENT' });
        callback(error);
      }),
    } as any;
    const exec = vi.fn(async () => '');
    const service = new SftpFileService(sftp, '/home/lin', exec);

    await expect(service.copy(
      ['/home/lin/report.txt'],
      '/home/lin/target',
    )).resolves.toEqual({ paths: ['/home/lin/target/report - 副本.txt'] });

    expect(exec).toHaveBeenCalledWith(
      "cp -a -- '/home/lin/report.txt' '/home/lin/target/report - 副本.txt'",
      5 * 60_000,
    );
  });

  it('uses guarded recursive removal and never traverses a protected root', async () => {
    const sftp = {
      lstat: vi.fn((remotePath, callback) => callback(null, {
        size: 0,
        mtime: 1,
        mode: remotePath.endsWith('dir') ? 0o40755 : 0o100644,
      })),
      stat: vi.fn((remotePath, callback) => callback(null, {
        size: 0,
        mtime: 1,
        mode: remotePath.endsWith('dir') ? 0o40755 : 0o100644,
      })),
      readdir: vi.fn((_path, callback) => callback(null, [
        { filename: 'nested.txt', longname: '-rw-r--r--', attrs: { size: 3, mtime: 1, mode: 0o100644 } },
      ])),
      unlink: vi.fn((_path, callback) => callback()),
      rmdir: vi.fn((_path, callback) => callback()),
    } as any;
    const exec = vi.fn(async () => '..');
    const service = new SftpFileService(sftp, '/home/lin', exec);

    await expect(service.remove('/', true)).rejects.toThrow('protected remote path');
    await expect(service.remove('/home/lin/dir', true)).resolves.toEqual({ removed: 2 });
    expect(exec).toHaveBeenCalledWith(expect.stringContaining("'/home/lin/dir'"), expect.any(Number));
  });

  it('unlinks in-tree links to protected directories without traversing their targets', async () => {
    const protectedLinks = [
      '/home/lin/work/root-link',
      '/home/lin/work/home-link',
    ];
    const sftp = {
      lstat: vi.fn((_remotePath, callback) => callback(null, { size: 0, mtime: 1, mode: 0o120777 })),
      stat: vi.fn((_remotePath, callback) => callback(null, { size: 0, mtime: 1, mode: 0o40755 })),
      readdir: vi.fn((_remotePath, callback) => callback(new Error('protected symlink target was traversed'))),
      unlink: vi.fn((_remotePath, callback) => callback()),
      rmdir: vi.fn((_remotePath, callback) => callback()),
    } as any;
    const service = new SftpFileService(sftp, '/home/lin');

    for (const remotePath of protectedLinks) {
      await expect(service.remove(remotePath, false)).resolves.toEqual({ removed: 1 });
    }

    expect(sftp.lstat).toHaveBeenCalledTimes(protectedLinks.length);
    expect(sftp.unlink).toHaveBeenCalledTimes(protectedLinks.length);
    for (const remotePath of protectedLinks) {
      expect(sftp.unlink).toHaveBeenCalledWith(remotePath, expect.any(Function));
    }
    expect(sftp.readdir).not.toHaveBeenCalled();
    expect(sftp.rmdir).not.toHaveBeenCalled();
  });

  it('uses one non-dereferencing remote operation for recursive removal even when the target changes type', async () => {
    const exec = vi.fn(async () => '..');
    const sftp = {
      lstat: vi.fn((_remotePath, callback) => callback(null, { size: 0, mtime: 1, mode: 0o40755 })),
      readdir: vi.fn((_remotePath, callback) => callback(new Error('must not traverse a raced path'))),
      unlink: vi.fn((_remotePath, callback) => callback()),
      rmdir: vi.fn((_remotePath, callback) => callback()),
    } as any;
    const service = new SftpFileService(sftp, '/cluster/home/lin', exec);

    await expect(service.remove('/cluster/home/lin/raced', true)).resolves.toEqual({ removed: 2 });

    expect(exec).toHaveBeenCalledWith(
      expect.stringContaining('find -P -- "$1" -depth -delete'),
      expect.any(Number),
    );
    expect(exec.mock.calls[0][0]).not.toContain('| wc -c');
    expect(exec.mock.calls[0][0]).toContain("'/cluster/home/lin/raced'");
    expect(sftp.lstat).not.toHaveBeenCalled();
    expect(sftp.readdir).not.toHaveBeenCalled();
    expect(sftp.unlink).not.toHaveBeenCalled();
    expect(sftp.rmdir).not.toHaveBeenCalled();
  });

  it('caps previews and validates the queried remote path', async () => {
    const stream = new PassThrough();
    const sftp = { createReadStream: vi.fn(() => stream) } as any;
    const service = new SftpFileService(sftp, '/home/lin');
    queueMicrotask(() => stream.end(Buffer.from('abcdef')));

    await expect(service.readPreview('/home/lin/a.txt', 3)).resolves.toEqual(Buffer.from('abc'));
    expect(sftp.createReadStream).toHaveBeenCalledWith('/home/lin/a.txt', { end: 2 });
    await expect(service.readPreview('relative.txt', 3)).rejects.toThrow('remote path must be absolute');
  });

  it('writes UTF-8 content through an SFTP write stream', async () => {
    const writeStream = new PassThrough();
    const chunks: Buffer[] = [];
    writeStream.on('data', chunk => chunks.push(chunk));
    const finished = new Promise<void>(resolve => writeStream.on('finish', resolve));
    const sftp = { createWriteStream: vi.fn(() => writeStream) } as any;
    const service = new SftpFileService(sftp, '/home/lin');

    const promise = service.writeFile('/home/lin/notes.txt', 'hello world');
    await finished;
    await promise;

    expect(sftp.createWriteStream).toHaveBeenCalledWith('/home/lin/notes.txt');
    expect(Buffer.concat(chunks).toString('utf8')).toBe('hello world');
  });

  it('stops an SFTP head preview after exactly 20 lines', async () => {
    const stream = new PassThrough();
    const content = Array.from({ length: 30 }, (_, index) => `line-${index + 1}`).join('\n');
    const sftp = {
      createReadStream: vi.fn(() => stream),
      stat: vi.fn((_path, callback) => callback(null, { size: Buffer.byteLength(content), mtime: 1, mode: 0o100644 })),
    } as any;
    const service = new SftpFileService(sftp, '/home/lin');
    queueMicrotask(() => stream.end(Buffer.from(content)));

    const result = await service.readPreview('/home/lin/reads.fa', {
      mode: 'head',
      maxBytes: 256 * 1024,
      lineLimit: 20,
    });

    expect(result.encoding).toBe('utf8');
    expect(result.content.split('\n')).toHaveLength(20);
    expect(result.content).toContain('line-20');
    expect(result.content).not.toContain('line-21');
    expect(result.truncated).toBe(true);
  });

  it('searches through bounded SFTP traversal instead of buffering an exec result', async () => {
    const exec = vi.fn(async () => { throw new Error('unbounded exec search must not run'); });
    const sftp = {
      readdir: vi.fn((_remotePath, callback) => callback(null, Array.from({ length: 5_002 }, (_, index) => ({
        filename: `file-${index}.txt`, longname: '-rw-r--r--', attrs: { size: 1, mtime: 1, mode: 0o100644 },
      })))),
    } as any;
    const service = new SftpFileService(sftp, '/home/lin', exec);
    const controller = new AbortController();
    const batches: unknown[] = [];
    for await (const batch of service.search('/home/lin', 'file', controller.signal, 5_001)) batches.push(...batch);

    expect(batches).toHaveLength(5_001);
    expect(exec).not.toHaveBeenCalled();
    expect(sftp.readdir).toHaveBeenCalledTimes(1);

    controller.abort();
    await expect(async () => {
      for await (const _batch of service.search('/home/lin', 'file', controller.signal, 5_001)) {
        // The generator must not yield after cancellation.
      }
    }).rejects.toMatchObject({ name: 'AbortError' });
  });
});
