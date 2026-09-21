import path from 'path';
import { afterEach, describe, expect, it, vi } from 'vitest';

const originalEnv = { ...process.env };

async function loadPaths() {
  vi.resetModules();
  return import('./paths');
}

afterEach(() => {
  process.env = { ...originalEnv };
});

describe('server path helpers', () => {
  it('uses cwd for all roots by default', async () => {
    delete process.env.HPCLAW_APP_ROOT;
    delete process.env.HPCLAW_STATIC_ROOT;
    delete process.env.HPCLAW_DATA_ROOT;

    const paths = await loadPaths();

    expect(paths.APP_ROOT).toBe(process.cwd());
    expect(paths.STATIC_ROOT).toBe(process.cwd());
    expect(paths.DATA_ROOT).toBe(process.cwd());
    expect(paths.appPath('lsf_skills')).toBe(path.join(process.cwd(), 'lsf_skills'));
    expect(paths.staticPath('dist')).toBe(path.join(process.cwd(), 'dist'));
    expect(paths.dataPath('uploads')).toBe(path.join(process.cwd(), 'uploads'));
  });

  it('allows Electron to split app, static, and data roots', async () => {
    process.env.HPCLAW_APP_ROOT = 'C:/Program Files/HPClaw/resources/app.asar';
    process.env.HPCLAW_STATIC_ROOT = 'C:/Program Files/HPClaw/resources/app.asar';
    process.env.HPCLAW_DATA_ROOT = 'C:/Users/example/AppData/Roaming/HPClaw/runtime';

    const paths = await loadPaths();

    expect(paths.appPath('lsf_skills')).toBe(path.resolve('C:/Program Files/HPClaw/resources/app.asar', 'lsf_skills'));
    expect(paths.staticPath('dist')).toBe(path.resolve('C:/Program Files/HPClaw/resources/app.asar', 'dist'));
    expect(paths.dataPath('skills')).toBe(path.resolve('C:/Users/example/AppData/Roaming/HPClaw/runtime', 'skills'));
  });
});
