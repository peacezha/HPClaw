import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { afterEach, describe, expect, it } from 'vitest';
const { migrateDesktopProfile } = createRequire(import.meta.url)('./app-identity.cjs');
const dirs: string[] = [];
afterEach(() => { for (const dir of dirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true }); });
function root() { const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'trace-brand-migration-')); dirs.push(dir); return dir; }
describe('TRACE profile migration', () => {
  it('copies records, encryption material and browser storage without altering originals', () => {
    const appData = root(), old = path.join(appData, 'HPClaw');
    fs.mkdirSync(path.join(old, 'Local Storage'), { recursive: true });
    for (const [file, value] of [['server-key.json', 'ciphertext-key-bytes'], ['profiles.json', 'encrypted-credentials'],
      ['Local Storage/history', 'original conversations and preferences'], ['SingletonLock', 'stale lock']]) fs.writeFileSync(path.join(old, file), value);
    const result = migrateDesktopProfile({ appData, platform: 'win32' });
    expect(result).toMatchObject({ runtimeName: 'TRACE', userData: path.join(appData, 'TRACE'), migrated: true });
    expect(fs.readFileSync(path.join(result.userData, 'server-key.json'), 'utf8')).toBe('ciphertext-key-bytes');
    expect(fs.readFileSync(path.join(result.userData, 'profiles.json'), 'utf8')).toBe('encrypted-credentials');
    expect(fs.readFileSync(path.join(old, 'Local Storage/history'), 'utf8')).toBe('original conversations and preferences');
    expect(fs.existsSync(path.join(result.userData, 'SingletonLock'))).toBe(false);
    expect(migrateDesktopProfile({ appData, platform: 'win32' }).migrated).toBe(false);
  });
  it('never merges into an existing TRACE profile or imports competition data into the full edition', () => {
    const appData = root();
    for (const name of ['HPClaw', 'TRACE', 'HPClaw Competition']) { fs.mkdirSync(path.join(appData, name)); fs.writeFileSync(path.join(appData, name, 'profiles.json'), name); }
    migrateDesktopProfile({ appData, platform: 'win32' });
    expect(fs.readFileSync(path.join(appData, 'TRACE/profiles.json'), 'utf8')).toBe('TRACE');
    const competition = migrateDesktopProfile({ appData, platform: 'win32', competition: true });
    expect(fs.readFileSync(path.join(competition.userData, 'profiles.json'), 'utf8')).toBe('HPClaw Competition');
  });
});
