import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  DEFAULT_DEEPSEEK_BASE_URL,
  normalizeDeepSeekBaseUrl,
  redactDshSensitiveText,
  repairInvalidDeepSeekBaseUrlSetting,
} from './dshConfigSafety';

const tempDirs: string[] = [];

afterEach(() => {
  for (const dir of tempDirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

describe('dshConfigSafety', () => {
  it('accepts HTTP(S) endpoints and supplies the official default', () => {
    expect(normalizeDeepSeekBaseUrl(undefined)).toBe(DEFAULT_DEEPSEEK_BASE_URL);
    expect(normalizeDeepSeekBaseUrl('https://proxy.example/v1/')).toBe('https://proxy.example/v1');
    expect(normalizeDeepSeekBaseUrl('http://127.0.0.1:8000')).toBe('http://127.0.0.1:8000');
  });

  it('rejects API keys and credential-bearing URLs as endpoints', () => {
    expect(() => normalizeDeepSeekBaseUrl('sk-1234567890abcdef')).toThrow('http://');
    expect(() => normalizeDeepSeekBaseUrl('https://user:secret@example.com')).toThrow('API Key');
  });

  it('redacts credential-shaped values in DSH errors', () => {
    expect(redactDshSensitiveText('to sk-1234567890abcdef with Bearer abc.def failed'))
      .toBe('to sk-*** with Bearer *** failed');
  });

  it('removes only an invalid saved baseURL and preserves unrelated settings', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hpclaw-dsh-settings-'));
    tempDirs.push(dir);
    const file = path.join(dir, 'settings.yaml');
    fs.writeFileSync(file, [
      'ui-onboarding:',
      '  welcomeNoticeVersion: test',
      'permission:',
      '  defaultPreset: dangerous',
      'llm-deepseek:',
      '  baseURL: sk-1234567890abcdef',
      '',
    ].join('\n'));

    expect(repairInvalidDeepSeekBaseUrlSetting(file)).toEqual({ changed: true, reason: 'invalid-deepseek-base-url' });
    const repaired = fs.readFileSync(file, 'utf8');
    expect(repaired).toContain('defaultPreset: dangerous');
    expect(repaired).not.toContain('llm-deepseek');
    expect(repaired).not.toContain('sk-1234567890abcdef');
    expect(repairInvalidDeepSeekBaseUrlSetting(file)).toEqual({ changed: false });
  });

  it('keeps a valid custom baseURL untouched', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hpclaw-dsh-settings-'));
    tempDirs.push(dir);
    const file = path.join(dir, 'settings.yaml');
    const original = 'llm-deepseek:\n  baseURL: https://proxy.example/v1\n';
    fs.writeFileSync(file, original);
    expect(repairInvalidDeepSeekBaseUrlSetting(file)).toEqual({ changed: false });
    expect(fs.readFileSync(file, 'utf8')).toBe(original);
  });
});
