import { describe, expect, it } from 'vitest';
import { createLocalFileService } from './local-files.cjs';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const tmpBase = os.tmpdir();

function tmpDir() {
  return fs.mkdtempSync(path.join(tmpBase, 'hpclaw-test-'));
}

describe('local-files', () => {
  function makeService() {
    return createLocalFileService({ fs: fs.promises });
  }

  it('lists entries in a directory', async () => {
    const svc = makeService();
    const dir = tmpDir();
    try {
      fs.writeFileSync(path.join(dir, 'a.txt'), 'hello');
      fs.mkdirSync(path.join(dir, 'sub'));
      fs.writeFileSync(path.join(dir, 'sub', 'b.txt'), 'world');

      const entries = await svc.list(dir);
      const names = entries.map(e => e.name).sort();
      expect(names).toContain('a.txt');
      expect(names).toContain('sub');

      const aTxt = entries.find(e => e.name === 'a.txt')!;
      expect(aTxt.kind).toBe('file');
      expect(aTxt.size).toBe(5);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('stats a file entry', async () => {
    const svc = makeService();
    const dir = tmpDir();
    try {
      const filePath = path.join(dir, 'stat.txt');
      fs.writeFileSync(filePath, 'stat content');

      const entry = await svc.stat(filePath);
      expect(entry.name).toBe('stat.txt');
      expect(entry.kind).toBe('file');
      expect(entry.size).toBe(12);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('stats a directory entry', async () => {
    const svc = makeService();
    const dir = tmpDir();
    try {
      const entry = await svc.stat(dir);
      expect(entry.kind).toBe('directory');
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('creates a directory', async () => {
    const svc = makeService();
    const dir = tmpDir();
    try {
      const newDir = path.join(dir, 'new-dir');
      await svc.mkdir(newDir);
      expect(fs.statSync(newDir).isDirectory()).toBe(true);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('writes text content to a file', async () => {
    const svc = makeService();
    const dir = tmpDir();
    try {
      const filePath = path.join(dir, 'write.txt');
      await svc.writeFile(filePath, 'hello world');
      expect(fs.readFileSync(filePath, 'utf8')).toBe('hello world');
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('renames a file', async () => {
    const svc = makeService();
    const dir = tmpDir();
    try {
      const oldPath = path.join(dir, 'old.txt');
      const newPath = path.join(dir, 'new.txt');
      fs.writeFileSync(oldPath, 'rename test');
      await svc.rename(oldPath, newPath);
      expect(fs.existsSync(oldPath)).toBe(false);
      expect(fs.statSync(newPath).isFile()).toBe(true);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('copies files and folders with conflict-safe copy names', async () => {
    const svc = makeService();
    const dir = tmpDir();
    try {
      const sourceFile = path.join(dir, 'report.txt');
      const sourceFolder = path.join(dir, 'results');
      const target = path.join(dir, 'target');
      fs.writeFileSync(sourceFile, 'report');
      fs.mkdirSync(sourceFolder);
      fs.writeFileSync(path.join(sourceFolder, 'data.tsv'), 'a\tb');
      fs.mkdirSync(target);
      fs.writeFileSync(path.join(target, 'report.txt'), 'existing');

      const result = await svc.copy([sourceFile, sourceFolder], target);

      expect(result.paths.map(p => path.basename(p))).toEqual([
        'report - 副本.txt',
        'results',
      ]);
      expect(fs.readFileSync(path.join(target, 'report - 副本.txt'), 'utf8')).toBe('report');
      expect(fs.readFileSync(path.join(target, 'results', 'data.tsv'), 'utf8')).toBe('a\tb');
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('does not copy a directory into one of its descendants', async () => {
    const svc = makeService();
    const dir = tmpDir();
    try {
      const source = path.join(dir, 'source');
      const child = path.join(source, 'child');
      fs.mkdirSync(child, { recursive: true });

      await expect(svc.copy([source], child)).rejects.toThrow('into itself');
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('reads a text file preview capped at maxBytes', async () => {
    const svc = makeService();
    const dir = tmpDir();
    try {
      const filePath = path.join(dir, 'preview.txt');
      fs.writeFileSync(filePath, 'hello world preview');

      // Read with enough maxBytes
      const buf = await svc.readPreview(filePath, 100);
      expect(buf.toString()).toBe('hello world preview');

      // Read with limited maxBytes
      const bufLimited = await svc.readPreview(filePath, 5);
      expect(bufLimited.toString()).toBe('hello');
      expect(bufLimited.length).toBe(5);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('streams only the first 20 lines for a large text preview', async () => {
    const svc = makeService();
    const dir = tmpDir();
    try {
      const filePath = path.join(dir, 'reads.fa');
      const content = Array.from({ length: 30 }, (_, index) => `>record-${index + 1}`).join('\n');
      fs.writeFileSync(filePath, content);

      const result = await svc.readPreview(filePath, {
        mode: 'head',
        maxBytes: 256 * 1024,
        lineLimit: 20,
      });

      expect(result.encoding).toBe('utf8');
      expect(result.content.split('\n')).toHaveLength(20);
      expect(result.content).toContain('>record-20');
      expect(result.content).not.toContain('>record-21');
      expect(result).toMatchObject({
        totalSize: Buffer.byteLength(content),
        truncated: true,
        lineLimit: 20,
      });
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('returns base64 for bounded binary previews', async () => {
    const svc = makeService();
    const dir = tmpDir();
    try {
      const filePath = path.join(dir, 'plot.png');
      fs.writeFileSync(filePath, Buffer.from([0, 1, 2, 3]));

      const result = await svc.readPreview(filePath, {
        mode: 'binary',
        maxBytes: 20,
      });

      expect(result).toMatchObject({
        encoding: 'base64',
        content: Buffer.from([0, 1, 2, 3]).toString('base64'),
        bytesRead: 4,
        totalSize: 4,
        truncated: false,
      });
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('rejects null byte in path', async () => {
    const svc = makeService();
    await expect(svc.stat('bad\0path')).rejects.toThrow('null byte');
    await expect(svc.list('bad\0path')).rejects.toThrow('null byte');
    await expect(svc.mkdir('bad\0path')).rejects.toThrow('null byte');
  });

  it('rejects empty path', async () => {
    const svc = makeService();
    await expect(svc.stat('')).rejects.toThrow('path is required');
    await expect(svc.list('')).rejects.toThrow('path is required');
    await expect(svc.mkdir('')).rejects.toThrow('path is required');
  });

  it('throws on non-existent path stat', async () => {
    const svc = makeService();
    const dir = tmpDir();
    try {
      await expect(svc.stat(path.join(dir, 'nonexistent.txt'))).rejects.toThrow();
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
