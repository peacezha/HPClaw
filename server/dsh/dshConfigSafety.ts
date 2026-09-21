import fs from 'node:fs';
import { load as yamlLoad, dump as yamlDump } from 'js-yaml';
import { writeFileAtomic0600 } from './fileUtils';

export const DEFAULT_DEEPSEEK_BASE_URL = 'https://api.deepseek.com';

/**
 * DSH accepts custom DeepSeek-compatible gateways, but the value must still be
 * an absolute HTTP(S) URL. In particular, never let a pasted API key become a
 * fetch target: DSH includes that target in its durable error history.
 */
export function normalizeDeepSeekBaseUrl(value: unknown): string {
  const raw = typeof value === 'string' ? value.trim() : '';
  if (!raw) return DEFAULT_DEEPSEEK_BASE_URL;

  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error('DeepSeek API 地址无效：必须填写以 http:// 或 https:// 开头的完整地址');
  }
  if ((parsed.protocol !== 'http:' && parsed.protocol !== 'https:') || !parsed.hostname) {
    throw new Error('DeepSeek API 地址无效：仅支持 http:// 或 https:// 地址');
  }
  if (parsed.username || parsed.password) {
    throw new Error('DeepSeek API 地址不能包含账号、密码或 API Key');
  }
  if (parsed.search || parsed.hash) {
    throw new Error('DeepSeek API 地址不能包含查询参数或片段');
  }
  return raw.replace(/\/+$/, '');
}

/** Remove credential-shaped values before an error reaches logs or the UI. */
export function redactDshSensitiveText(value: unknown): string {
  return String(value ?? '')
    .replace(/\bsk-[A-Za-z0-9_-]{8,}\b/gi, 'sk-***')
    .replace(/\bBearer\s+[^\s,;]+/gi, 'Bearer ***')
    .replace(/(https?:\/\/)[^\s/@:]+:[^\s/@]+@/gi, '$1***:***@');
}

export interface DshSettingsRepairResult {
  changed: boolean;
  reason?: 'invalid-deepseek-base-url';
}

/**
 * Older/manual DSH settings may contain an API key in llm-deepseek.baseURL.
 * User settings take precedence over HPClaw's launch environment, so remove
 * only an invalid baseURL while preserving every unrelated DSH preference.
 */
export function repairInvalidDeepSeekBaseUrlSetting(settingsFile: string): DshSettingsRepairResult {
  if (!fs.existsSync(settingsFile)) return { changed: false };

  let parsed: unknown;
  try {
    parsed = yamlLoad(fs.readFileSync(settingsFile, 'utf8'));
  } catch {
    return { changed: false };
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return { changed: false };

  const root = parsed as Record<string, unknown>;
  const section = root['llm-deepseek'];
  if (!section || typeof section !== 'object' || Array.isArray(section)) return { changed: false };

  const deepSeek = section as Record<string, unknown>;
  if (!Object.prototype.hasOwnProperty.call(deepSeek, 'baseURL')) return { changed: false };
  try {
    normalizeDeepSeekBaseUrl(deepSeek.baseURL);
    return { changed: false };
  } catch {
    delete deepSeek.baseURL;
    if (Object.keys(deepSeek).length === 0) delete root['llm-deepseek'];
    writeFileAtomic0600(settingsFile, yamlDump(root, { lineWidth: -1, noRefs: true }));
    return { changed: true, reason: 'invalid-deepseek-base-url' };
  }
}
