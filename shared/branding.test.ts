import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { APP_NAME, GITHUB_URL, currentProductText } from './branding';
import { workflowMetadataText } from './workflowLocale';
import { translateUiText } from '../src/i18n';

describe('TRACE product branding', () => {
  it('aligns packaging, update publishing and rendered branding', () => {
    const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
    const lock = JSON.parse(fs.readFileSync(new URL('../package-lock.json', import.meta.url), 'utf8'));
    expect(pkg.productName).toBe(APP_NAME);
    expect(pkg.build.productName).toBe(APP_NAME);
    expect(pkg.build.nsis.shortcutName).toBe(APP_NAME);
    expect(pkg.build.publish[0]).toMatchObject({ owner: 'peacezha', repo: 'TRACE' });
    // Preserve the upgrade GUID so existing installations are upgraded rather than duplicated.
    expect(pkg.build.appId).toBe('com.trace.desktop');
    expect(pkg.build.nsis.guid).toBe('89cfe10e-df55-5d54-bd62-1401b68111e1');
    expect(lock.name).toBe(pkg.name);
    expect(lock.packages[''].version).toBe(pkg.version);
  });
  it('updates legacy display text and this repository URL only', () => {
    expect(currentProductText(undefined as any)).toBeUndefined();
    expect(currentProductText('HPClaw 智能助手')).toBe('TRACE 智能助手');
    expect(currentProductText('an HPClaw extension')).toBe('a TRACE extension');
    expect(currentProductText('https://github.com/peacezha/HPClaw/releases/latest')).toBe(GITHUB_URL + '/releases/latest');
    expect(currentProductText('https://github.com/someone/HPClaw')).toBe('https://github.com/someone/HPClaw');
    for (const value of ['C:/Users/u/AppData/Roaming/HPClaw/runtime', 'C:\\Program Files\\HPClaw\\HPClaw.exe', 'X-HPClaw-Bridge', 'hpclaw_workflow_habits_v1']) {
      expect(currentProductText(value)).toBe(value);
    }
  });
  it('still translates legacy saved display phrases correctly in both languages', () => {
    expect(translateUiText('HPClaw 原生智能体', 'en-US')).toBe('TRACE native agent');
    expect(translateUiText('HPClaw 原生智能体', 'zh-CN')).toBe('TRACE 原生智能体');
    expect(workflowMetadataText('HiDOG V11 管线与 HPClaw 启动器', 'en')).toBe('HiDOG V11 pipeline and TRACE launcher');
  });
});
