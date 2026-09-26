import { EventEmitter } from 'node:events';
import { describe, expect, it, vi } from 'vitest';
import { createUpdateManager, normalizeUpdateUrl, parseGithubRepoUrl } from './update-manager.cjs';

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

  it('uses the built-in GitHub Releases feed when no custom server is configured', async () => {
    const { manager, updater } = createManager();
    updater.checkForUpdates.mockImplementation(async () => {
      updater.emit('update-not-available', { version: '0.2.4' });
      return undefined;
    });

    const state = await manager.check();

    expect(updater.setFeedURL).toHaveBeenCalledWith(expect.objectContaining({
      provider: 'github',
      owner: 'peacezha',
      repo: 'HPClaw',
    }));
    expect(state).toMatchObject({ phase: 'not-available', currentVersion: '0.2.4' });
  });

  it('routes a saved github.com repo URL to the github provider instead of generic', async () => {
    expect(parseGithubRepoUrl('https://github.com/peacezha/HPClaw/')).toEqual({ owner: 'peacezha', repo: 'HPClaw' });
    expect(parseGithubRepoUrl('https://github.com/peacezha/HPClaw.git')).toEqual({ owner: 'peacezha', repo: 'HPClaw' });
    expect(parseGithubRepoUrl('https://github.com/peacezha/HPClaw/releases')).toEqual({ owner: 'peacezha', repo: 'HPClaw' });
    expect(parseGithubRepoUrl('https://updates.example.com/hpclaw/')).toBeNull();
    expect(parseGithubRepoUrl('https://github.com/peacezha')).toBeNull();

    const { manager, updater } = createManager('https://github.com/peacezha/HPClaw/');
    updater.checkForUpdates.mockImplementation(async () => undefined);
    await manager.check();
    expect(updater.setFeedURL).toHaveBeenCalledWith(expect.objectContaining({
      provider: 'github',
      owner: 'peacezha',
      repo: 'HPClaw',
    }));
  });
});
