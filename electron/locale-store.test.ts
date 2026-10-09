import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { afterEach, describe, expect, it } from 'vitest';
const { createLocaleStore } = createRequire(import.meta.url)('./locale-store.cjs');
const temporary: string[] = [];
afterEach(() => { for (const dir of temporary.splice(0)) fs.rmSync(dir, { recursive: true, force: true }); });

function fixture(locale?: string) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hpclaw-locale-'));
  temporary.push(root);
  const installDir = path.join(root, 'install');
  const userData = path.join(root, 'user');
  fs.mkdirSync(installDir);
  if (locale) fs.writeFileSync(path.join(installDir, 'hpclaw-install-locale.json'), JSON.stringify({ locale }));
  return { installDir, userData, store: createLocaleStore({ installDir, userData }) };
}
describe('Windows installer and application language preference', () => {
  it('seeds English and Chinese from the installer choice', () => {
    expect(fixture('en-US').store.get()).toBe('en-US');
    expect(fixture('zh-CN').store.get()).toBe('zh-CN');
  });
  it('persists an in-app choice across restarts and upgrades', () => {
    const { store, installDir, userData } = fixture('en-US');
    store.set('zh-CN');
    expect(createLocaleStore({ installDir, userData }).get()).toBe('zh-CN');
  });
  it('rejects invalid input and safely handles a damaged preference file', () => {
    const { store, userData } = fixture('en-US');
    expect(() => store.set('../../etc')).toThrow('Unsupported');
    store.set('zh-CN');
    fs.writeFileSync(path.join(userData, 'language.json'), 'damaged');
    expect(store.get()).toBe('en-US');
    expect(fixture('invalid').store.get()).toBe('zh-CN');
  });
});
