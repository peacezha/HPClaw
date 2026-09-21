// 服务端共享的 AI 配置：与应用内"AI 设置"同源——前端每次发起 AI 请求时
// 自动把当前 profile 同步到这里，QQ 机器人等服务端功能直接复用，无需二次配置。
// apiKey 落盘为 AES-256-GCM 密文（secretBox，密钥由 Electron 主进程注入），
// 历史明文读取时原样透传，下次保存自动加密。
import fs from 'node:fs';
import path from 'node:path';
import { dataPath } from '../paths';
import { decryptSecret, encryptSecret } from '../secretBox';
import type { AIProfile } from './types';

const PROFILE_PATH = dataPath('ai-profile.json');

/** 保存最近一次使用的 AI 配置（缺 apiKey 时忽略，不覆盖已有配置） */
export function saveServerAiProfile(profile: AIProfile): void {
  if (!profile?.apiKey) return;
  try {
    fs.mkdirSync(path.dirname(PROFILE_PATH), { recursive: true });
    fs.writeFileSync(PROFILE_PATH, JSON.stringify({
      provider: profile.provider,
      model: profile.model,
      apiKey: encryptSecret(profile.apiKey),
      baseUrl: profile.baseUrl,
      temperature: profile.temperature,
    }, null, 2), { mode: 0o600 });
  } catch { /* best-effort，不影响主流程 */ }
}

/** 读取共享 AI 配置；未配置过返回 undefined */
export function loadServerAiProfile(): AIProfile | undefined {
  try {
    const parsed = JSON.parse(fs.readFileSync(PROFILE_PATH, 'utf8'));
    if (parsed?.apiKey) {
      parsed.apiKey = decryptSecret(parsed.apiKey);
      if (parsed.apiKey) return parsed as AIProfile;
    }
  } catch { /* 未配置 */ }
  return undefined;
}
