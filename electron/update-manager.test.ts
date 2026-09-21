import { EventEmitter } from 'node:events';
import { describe, expect, it, vi } from 'vitest';
import { createUpdateManager, normalizeUpdateUrl } from './update-manager.cjs';

function createMemoryFs(initial = '') {
  const values = new Map<string, string>();
  if (initial) values.set('settings.json', initial);
  return {
    readFileSync: (file: string) => {
      if (!values.has(file)) throw new Error('ENOENT');
      return values.get(file)!;
    },
    mkdirSync: vi.fn(),
    writeFileSync: (file: string, value: string) => { values.set(file, value); },
    renameSync: (from: string, to: string) => {
      values.set(to, values.get(from)!);
      values.delete(from);
    },
    read: (file: string) => values.get(file),
  };
}

class FakeUpdater extends EventEmitter {
  autoDownload = true;
  autoInstallOnAppQuit = false;
  allowDowngrade = true;
  allowPrerelease = true;
  setFeedURL = vi.fn();
  checkForUpdates = vi.fn(async () => undefined);
  downloadUpdate = vi.fn(async () => undefined);
  quitAndInstall = vi.fn();
}

function createManager(updateUrl = '') {
  const updater = new FakeUpdater();
  const files = createMemoryFs(updateUrl ? JSON.stringify({ updateUrl, autoCheck: true }) : '');
  const manager = createUpdateManager({
    app: { isPackaged: true, getVersion: () => '0.2.4', getPath: () => 'unused', quit: vi.fn() },
    autoUpdater: updater,
    dialog: {},
    shell: {},
    fsImpl: files,
    settingsFile: 'settings.json',
    platform: 'win32',
  });
  return { manager, updater, files };
}

describe('update manager', () => {
  it('normalizes an HTTP update feed and rejects unsafe schemes or credentials', () => {
    expect(normalizeUpdateUrl('https://updates.example.com/hpclaw')).toBe('https://updates.example.com/hpclaw/');
    expect(() => normalizeUpdateUrl('file:///tmp/updates')).toThrow('http://');
    expect(() => normalizeUpdateUrl('https://user:secret@example.com/updates')).toThrow('账号或密码');
  });

  it('persists update settings atomically', () => {
    const { manager, files } = createManager();
    expect(manager.saveSettings({ updateUrl: 'https://updates.example.com/releases', autoCheck: false }))
      .toEqual({ updateUrl: 'https://updates.example.com/releases/', autoCheck: false });
    expect(JSON.parse(files.read('settings.json')!)).toEqual({
      updateUrl: 'https://updates.example.com/releases/',
      autoCheck: false,
    });
  });

  it('checks the configured generic feed and exposes an available update', async () => {
    const { manager, updater } = createManager('https://updates.example.com/hpclaw/');
    updater.checkForUpdates.mockImplementation(async () => {
      updater.emit('update-available', { version: '0.2.5' });
      return undefined;
    });

    const state = await manager.check();

    expect(updater.setFeedURL).toHaveBeenCalledWith(expect.objectContaining({
      provider: 'generic',
      url: 'https://updates.example.com/hpclaw/',
    }));
    expect(state).toMatchObject({ phase: 'available', currentVersion: '0.2.4', availableVersion: '0.2.5' });
  });

  it('tracks download progress and the downloaded state', async () => {
    const { manager, updater } = createManager('https://updates.example.com/hpclaw/');
    updater.downloadUpdate.mockImplementation(async () => {
      updater.emit('download-progress', { percent: 42.4, transferred: 424, total: 1000, bytesPerSecond: 50 });
      updater.emit('update-downloaded', { version: '0.2.5' });
      return undefined;
    });

    const state = await manager.download();

    expect(state).toMatchObject({ phase: 'downloaded', percent: 100, availableVersion: '0.2.5' });
  });

  it('returns a clear error when no online update source is configured', async () => {
    const { manager } = createManager();
    await expect(manager.check()).resolves.toMatchObject({
      phase: 'error',
      message: '请先填写并保存更新服务器地址',
    });
  });
});
