import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { normalizeWorkspace, resolveWorkspaceFilePath } from './workspace';

describe('normalizeWorkspace', () => {
  it('接受存在的目录', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hpclaw-ws-'));
    expect(normalizeWorkspace(dir)).toBe(path.resolve(dir));
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it('拒绝不存在的路径', () => {
    expect(normalizeWorkspace(path.join(os.tmpdir(), `no-such-${Date.now()}`))).toBeUndefined();
  });

  it('拒绝文件（非目录）', () => {
    const file = path.join(os.tmpdir(), `hpclaw-ws-${Date.now()}.txt`);
    fs.writeFileSync(file, 'x');
    expect(normalizeWorkspace(file)).toBeUndefined();
    fs.rmSync(file, { force: true });
  });

  it('拒绝非字符串/空串', () => {
    expect(normalizeWorkspace(undefined)).toBeUndefined();
    expect(normalizeWorkspace(null)).toBeUndefined();
    expect(normalizeWorkspace(42)).toBeUndefined();
    expect(normalizeWorkspace('')).toBeUndefined();
    expect(normalizeWorkspace('   ')).toBeUndefined();
  });

  it('trim 后 resolve', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hpclaw-ws-'));
    expect(normalizeWorkspace(`  ${dir}  `)).toBe(path.resolve(dir));
    fs.rmSync(dir, { recursive: true, force: true });
  });
});

describe('resolveWorkspaceFilePath', () => {
  it('只允许工作区内的绝对路径，并支持尚未创建的目标', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hpclaw-ws-safe-'));
    const inside = path.join(dir, 'nested', 'result.txt');
    expect(resolveWorkspaceFilePath(dir, inside)).toBe(path.resolve(inside));
    expect(() => resolveWorkspaceFilePath(dir, path.join(os.tmpdir(), 'outside.txt')))
      .toThrow('outside the selected workspace');
    expect(() => resolveWorkspaceFilePath(dir, 'relative.txt'))
      .toThrow('must be absolute');
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it('mustExist 时拒绝不存在的本地源文件', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hpclaw-ws-source-'));
    expect(() => resolveWorkspaceFilePath(dir, path.join(dir, 'missing.txt'), { mustExist: true }))
      .toThrow('local file not found');
    fs.rmSync(dir, { recursive: true, force: true });
  });
});
