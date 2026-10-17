import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { expect, it } from 'vitest';
const { migrateLegacyShortcuts } = createRequire(import.meta.url)('./legacy-shortcuts.cjs');
it('retires only verified old shortcuts, keeps rollback bytes and ignores unrelated targets', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'trace-shortcut-test-'));
  try {
    const desktop = path.join(root, 'Desktop'), programs = path.join(root, 'Programs'), userData = path.join(root, 'TRACE');
    fs.mkdirSync(desktop); fs.mkdirSync(programs);
    const old = path.join(desktop, 'HPClaw.lnk'), unrelated = path.join(programs, 'HPClaw.lnk');
    fs.writeFileSync(old, 'exact shortcut bytes'); fs.writeFileSync(unrelated, 'unrelated alias');
    const retired = migrateLegacyShortcuts({ desktop, programs, userData, readShortcutLink: (file: string) => ({
      target: file === old ? path.join(root, 'HPClaw', 'HPClaw.exe') : path.join(root, 'Other', 'program.exe'),
    }) });
    expect(retired).toBe(1); expect(fs.existsSync(old)).toBe(false); expect(fs.existsSync(unrelated)).toBe(true);
    const backup = path.join(userData, 'legacy-shortcut-backups', fs.readdirSync(path.join(userData, 'legacy-shortcut-backups'))[0]);
    expect(fs.readFileSync(backup, 'utf8')).toBe('exact shortcut bytes');
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
