import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { configureWebRuntime } from './web-runtime-config.mjs';

const directories: string[] = [];
function temporary() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'hpclaw-web-config-test-'));
  directories.push(directory);
  return directory;
}
afterEach(() => { for (const directory of directories.splice(0)) fs.rmSync(directory, { recursive: true, force: true }); });
describe('web runtime configuration', () => {
  it('generates persistent random access/session/encryption keys outside the app', () => {
    const directory = temporary();
    const env: NodeJS.ProcessEnv = { HPCLAW_DATA_ROOT: directory };
    const first = configureWebRuntime('/unused-app', env);
    expect(first.credentialsFile).toBe(path.join(directory, 'web-access.json'));
    expect(env.HPCLAW_WEB_PASSWORD?.length).toBeGreaterThanOrEqual(16);
    expect(env.SESSION_SECRET?.length).toBeGreaterThanOrEqual(32);
    expect(env.HPCLAW_ENCRYPTION_KEY).toMatch(/^[a-f0-9]{64}$/);
    const second: NodeJS.ProcessEnv = { HPCLAW_DATA_ROOT: directory };
    configureWebRuntime('/unused-app', second);
    expect(second.HPCLAW_WEB_PASSWORD).toBe(env.HPCLAW_WEB_PASSWORD);
    expect(second.HPCLAW_ENCRYPTION_KEY).toBe(env.HPCLAW_ENCRYPTION_KEY);
    expect(second.HPCLAW_WEB_MODE).toBe('1');
    expect(second.HPCLAW_HOST).toBe('127.0.0.1');
  });
  it('does not replace damaged credentials or lose the encryption key', () => {
    const directory = temporary();
    const file = path.join(directory, 'web-access.json');
    fs.writeFileSync(file, '{broken');
    expect(() => configureWebRuntime('/unused-app', { HPCLAW_DATA_ROOT: directory })).toThrow();
    expect(fs.readFileSync(file, 'utf8')).toBe('{broken');
  });
  it('rejects weak override secrets before writing configuration', () => {
    const directory = temporary();
    expect(() => configureWebRuntime('/unused-app', { HPCLAW_DATA_ROOT: directory, HPCLAW_WEB_PASSWORD: 'short' })).toThrow('16');
    expect(() => configureWebRuntime('/unused-app', { HPCLAW_DATA_ROOT: directory, HPCLAW_ENCRYPTION_KEY: 'invalid' })).toThrow('ENCRYPTION_KEY');
    expect(fs.existsSync(path.join(directory, 'web-access.json'))).toBe(false);
  });
});
