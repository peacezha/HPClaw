import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  LOCAL_COMMAND_TIMEOUT_MS,
  LOCAL_LIST_MAX_ENTRIES,
  LOCAL_WORKSPACE_NOT_SET_MESSAGE,
  LocalWorkspaceError,
  listLocalWorkspaceFiles,
  readLocalWorkspaceFile,
  resolveWorkspaceEntry,
  resolveWorkspaceRoot,
  runLocalWorkspaceCommand,
  writeLocalWorkspaceFile,
} from './localWorkspace';

let tmpRoot: string;
let workspace: string;
let outsideDir: string;

function comparable(value: string): string {
  const resolved = path.resolve(value);
  return process.platform === 'win32' ? resolved.toLowerCase() : resolved;
}

beforeEach(() => {
  tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'hpclaw-localws-'));
  fs.mkdirSync(path.join(tmpRoot, 'workspace'), { recursive: true });
  fs.mkdirSync(path.join(tmpRoot, 'outside'), { recursive: true });
  workspace = fs.realpathSync(path.join(tmpRoot, 'workspace'));
  outsideDir = fs.realpathSync(path.join(tmpRoot, 'outside'));
});

afterEach(() => {
  fs.rmSync(tmpRoot, { recursive: true, force: true });
});

describe('resolveWorkspaceRoot', () => {
  it('rejects a missing workspace with the guided message', () => {
    for (const input of [undefined, '', '   ', null]) {
      try {
        resolveWorkspaceRoot(input);
        expect.unreachable();
      } catch (err) {
        expect(err).toBeInstanceOf(LocalWorkspaceError);
        expect((err as LocalWorkspaceError).failure).toBe('required');
        expect((err as Error).message).toBe(LOCAL_WORKSPACE_NOT_SET_MESSAGE);
      }
    }
  });

  it('rejects a nonexistent workspace and a workspace that is a file', () => {
    expect(() => resolveWorkspaceRoot(path.join(workspace, 'no-such-dir')))
      .toThrowError(expect.objectContaining({ failure: 'notfound' }));
    const filePath = path.join(workspace, 'a-file.txt');
    fs.writeFileSync(filePath, 'x');
    expect(() => resolveWorkspaceRoot(filePath))
      .toThrowError(expect.objectContaining({ failure: 'notdir' }));
  });

  it('returns the realpath of a valid workspace directory', () => {
    expect(comparable(resolveWorkspaceRoot(workspace))).toBe(comparable(workspace));
  });
});

describe('resolveWorkspaceEntry escape guards', () => {
  it.each([
    '..\\outside.txt',
    '../outside.txt',
    'sub/../../outside.txt',
    'C:\\Windows\\system32\\drivers\\etc\\hosts',
    'C:/Windows/hosts',
    '/etc/passwd',
    '\\\\server\\share\\file.txt',
  ])('rejects escaping path %j', (input) => {
    try {
      resolveWorkspaceEntry(workspace, input);
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(LocalWorkspaceError);
      expect((err as LocalWorkspaceError).failure).toBe('outside');
    }
  });

  it('rejects empty and NUL-containing paths', () => {
    expect(() => resolveWorkspaceEntry(workspace, ''))
      .toThrowError(expect.objectContaining({ failure: 'required' }));
    expect(() => resolveWorkspaceEntry(workspace, 'bad\0name'))
      .toThrowError(expect.objectContaining({ failure: 'required' }));
  });

  it('resolves a normal nested relative path inside the workspace', () => {
    const resolved = resolveWorkspaceEntry(workspace, 'sub/dir/file.txt');
    expect(comparable(resolved)).toBe(comparable(path.join(workspace, 'sub/dir/file.txt')));
  });

  it('rejects a symlink/junction that points outside the workspace', () => {
    const linkPath = path.join(workspace, 'escape-link');
    let linkCreated = false;
    try {
      fs.symlinkSync(outsideDir, linkPath, 'junction');
      linkCreated = true;
    } catch { /* 无权限创建链接的环境跳过该用例 */ }
    if (!linkCreated) return;
    fs.writeFileSync(path.join(outsideDir, 'secret.txt'), 'secret');
    expect(() => resolveWorkspaceEntry(workspace, 'escape-link', { mustExist: true }))
      .toThrowError(expect.objectContaining({ failure: 'outside' }));
    expect(() => readLocalWorkspaceFile(workspace, 'escape-link/secret.txt'))
      .toThrowError(expect.objectContaining({ failure: 'outside' }));
  });
});

describe('listLocalWorkspaceFiles', () => {
  it('lists directories before files with entry metadata', () => {
    fs.mkdirSync(path.join(workspace, 'zdir'));
    fs.mkdirSync(path.join(workspace, 'adir'));
    fs.writeFileSync(path.join(workspace, 'b.txt'), 'bb');
    const result = listLocalWorkspaceFiles(workspace, '.');
    expect(result.truncated).toBe(false);
    expect(result.entries.map(entry => entry.name)).toEqual(['adir', 'zdir', 'b.txt']);
    expect(result.entries[0].kind).toBe('directory');
    expect(result.entries[2]).toMatchObject({ kind: 'file', size: 2 });
  });

  it('rejects listing a file', () => {
    fs.writeFileSync(path.join(workspace, 'f.txt'), 'x');
    expect(() => listLocalWorkspaceFiles(workspace, 'f.txt'))
      .toThrowError(expect.objectContaining({ failure: 'notdir' }));
  });

  it('caps the listing at the entry limit and marks truncation', () => {
    for (let i = 0; i < LOCAL_LIST_MAX_ENTRIES + 5; i += 1) {
      fs.writeFileSync(path.join(workspace, `f${String(i).padStart(4, '0')}.txt`), 'x');
    }
    const result = listLocalWorkspaceFiles(workspace, '.');
    expect(result.entries).toHaveLength(LOCAL_LIST_MAX_ENTRIES);
    expect(result.truncated).toBe(true);
  });
});

describe('readLocalWorkspaceFile', () => {
  it('reads a text file completely', () => {
    fs.writeFileSync(path.join(workspace, 'note.txt'), 'line1\nline2\n');
    const result = readLocalWorkspaceFile(workspace, 'note.txt');
    expect(result.content).toBe('line1\nline2\n');
    expect(result.truncated).toBe(false);
    expect(result.totalLines).toBe(3);
  });

  it('paginates with offset/limit and marks truncation', () => {
    const lines = Array.from({ length: 10 }, (_, i) => `L${i + 1}`);
    fs.writeFileSync(path.join(workspace, 'paged.txt'), lines.join('\n'));
    const page = readLocalWorkspaceFile(workspace, 'paged.txt', { offset: 4, limit: 3 });
    expect(page.content).toBe('L4\nL5\nL6');
    expect(page.truncated).toBe(true);
    expect(page.totalLines).toBe(10);
  });

  it('truncates files larger than maxBytes', () => {
    fs.writeFileSync(path.join(workspace, 'big.txt'), 'x'.repeat(100));
    const result = readLocalWorkspaceFile(workspace, 'big.txt', { maxBytes: 10 });
    expect(result.content).toBe('x'.repeat(10));
    expect(result.truncated).toBe(true);
  });

  it('rejects binary files', () => {
    fs.writeFileSync(path.join(workspace, 'bin.dat'), Buffer.from([0x41, 0x00, 0x42]));
    expect(() => readLocalWorkspaceFile(workspace, 'bin.dat'))
      .toThrowError(expect.objectContaining({ failure: 'binary' }));
  });

  it('rejects directories and missing files', () => {
    expect(() => readLocalWorkspaceFile(workspace, '.'))
      .toThrowError(expect.objectContaining({ failure: 'notfile' }));
    expect(() => readLocalWorkspaceFile(workspace, 'missing.txt'))
      .toThrowError(expect.objectContaining({ failure: 'notfound' }));
  });
});

describe('writeLocalWorkspaceFile', () => {
  it('creates a new file, creating parent directories as needed', () => {
    const result = writeLocalWorkspaceFile(workspace, 'sub/dir/new.txt', '你好\n');
    expect(result.bytes).toBe(Buffer.byteLength('你好\n', 'utf8'));
    expect(fs.readFileSync(path.join(workspace, 'sub/dir/new.txt'), 'utf8')).toBe('你好\n');
  });

  it('refuses to overwrite an existing file', () => {
    writeLocalWorkspaceFile(workspace, 'once.txt', 'first');
    expect(() => writeLocalWorkspaceFile(workspace, 'once.txt', 'second'))
      .toThrowError(expect.objectContaining({ failure: 'exists' }));
    expect(fs.readFileSync(path.join(workspace, 'once.txt'), 'utf8')).toBe('first');
  });

  it('refuses to write through a path that escapes the workspace', () => {
    expect(() => writeLocalWorkspaceFile(workspace, '../evil.txt', 'x'))
      .toThrowError(expect.objectContaining({ failure: 'outside' }));
    expect(fs.existsSync(path.join(outsideDir, 'evil.txt'))).toBe(false);
  });
});

describe('runLocalWorkspaceCommand', () => {
  it('runs a command with the workspace as cwd', async () => {
    const result = await runLocalWorkspaceCommand(workspace, 'node -e "console.log(process.cwd())"');
    expect(result.ok).toBe(true);
    expect(result.exitCode).toBe(0);
    expect(comparable(result.stdout.trim())).toBe(comparable(workspace));
  });

  it('reports a non-zero exit without throwing', async () => {
    const result = await runLocalWorkspaceCommand(workspace, 'exit 3');
    expect(result.ok).toBe(false);
    expect(result.exitCode).toBe(3);
  });

  it.each([
    'rm -rf sub',
    'del /s /q x.txt',
    'erase x.txt',
    'rmdir sub',
    'rd sub',
    'format C:',
    'mkfs.ntfs D:',
    'shutdown /s /t 0',
    'reboot',
    'Remove-Item x.txt',
    'diskpart',
  ])('rejects blacklisted command %j', (command) => {
    try {
      runLocalWorkspaceCommand(workspace, command);
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(LocalWorkspaceError);
      expect((err as LocalWorkspaceError).failure).toBe('blocked');
    }
  });

  it('rejects empty commands', () => {
    expect(() => runLocalWorkspaceCommand(workspace, '   '))
      .toThrowError(expect.objectContaining({ failure: 'required' }));
  });

  it('exposes the command timeout constant used by the agent tool description', () => {
    expect(LOCAL_COMMAND_TIMEOUT_MS).toBe(120_000);
  });
});
