// 通知服务：作业完成时通过 Server酱 / PushPlus / 企业微信 / 邮件 提醒用户。
// smtpPass（邮箱授权码）落盘为 AES-256-GCM 密文（secretBox），历史明文读取时透传。
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { dataPath } from '../paths';
import { decryptSecret, encryptSecret } from '../secretBox';

export type NotifyChannel = 'serverchan' | 'pushplus' | 'wecom' | 'feishu' | 'email';

export interface NotifyConfig {
  enabled: boolean;
  channel: NotifyChannel;
  // Server酱（sct.ftqq.com）
  sendKey?: string;
  // PushPlus（pushplus.plus）
  token?: string;
  // 企业微信群机器人
  webhook?: string;
  // 邮件（QQ/163 邮箱授权码）
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
  mailTo?: string;
}

const CONFIG_PATH = dataPath('notify-config.json');

export const DEFAULT_NOTIFY_CONFIG: NotifyConfig = {
  enabled: false,
  channel: 'serverchan',
};

export async function loadNotifyConfig(): Promise<NotifyConfig> {
  try {
    const raw = await fs.readFile(CONFIG_PATH, 'utf-8');
    const config: NotifyConfig = { ...DEFAULT_NOTIFY_CONFIG, ...JSON.parse(raw) };
    // 落盘密文 → 内存明文；历史明文原样透传
    if (config.smtpPass) config.smtpPass = decryptSecret(config.smtpPass);
    return config;
  } catch {
    return { ...DEFAULT_NOTIFY_CONFIG };
  }
}

export async function saveNotifyConfig(config: NotifyConfig): Promise<void> {
  await fs.mkdir(path.dirname(CONFIG_PATH), { recursive: true });
  // 授权码加密落盘；encryptSecret 对空值/已加密值原样返回
  const toWrite = config.smtpPass ? { ...config, smtpPass: encryptSecret(config.smtpPass) } : config;
  const tmp = `${CONFIG_PATH}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(toWrite, null, 2), 'utf-8');
  await fs.rename(tmp, CONFIG_PATH);
}

function formEncode(fields: Record<string, string>): string {
  return Object.entries(fields)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
}

async function postJson(url: string, body: unknown, timeoutMs = 15_000): Promise<{ ok: boolean; error?: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const text = await res.text();
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}: ${text.slice(0, 200)}` };
    // 飞书/企业微信等在 HTTP 200 里也可能返回业务错误码
    try {
      const parsed = JSON.parse(text);
      const code = parsed.code ?? parsed.errcode ?? 0;
      if (typeof code === 'number' && code !== 0 && code !== 200) {
        return { ok: false, error: text.slice(0, 200) };
      }
    } catch { /* 非 JSON 响应视为成功 */ }
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || String(err) };
  } finally {
    clearTimeout(timer);
  }
}

async function postForm(url: string, fields: Record<string, string>, timeoutMs = 15_000): Promise<{ ok: boolean; error?: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formEncode(fields),
      signal: controller.signal,
    });
    const text = await res.text();
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}: ${text.slice(0, 200)}` };
    // Server酱/PushPlus 在 200 里也可能返回错误码
    if (/"code"\s*:\s*0(?!\d)/.test(text) || /"code"\s*:\s*200(?!\d)/.test(text)) return { ok: true };
    try {
      const parsed = JSON.parse(text);
      if (parsed.code === 0 || parsed.code === 200 || parsed.errcode === 0 || parsed.errmsg === 'ok') return { ok: true };
      return { ok: false, error: text.slice(0, 200) };
    } catch {
      return { ok: true };
    }
  } catch (err: any) {
    return { ok: false, error: err?.message || String(err) };
  } finally {
    clearTimeout(timer);
  }
}

/** 发送通知。返回 { ok, error? }；配置不完整时报错说明缺什么。 */
export async function sendNotification(
  config: NotifyConfig,
  title: string,
  content: string,
): Promise<{ ok: boolean; error?: string }> {
  switch (config.channel) {
    case 'serverchan': {
      if (!config.sendKey) return { ok: false, error: '缺少 Server酱 SendKey' };
      const key = config.sendKey.trim();
      // 新版 sctp 密钥按分片号路由，老版 SCU 密钥走 sctapi
      const shard = key.match(/^sctp(\d+)t/i)?.[1];
      const base = shard ? `https://sctp${shard}-api.ftqq.com` : 'https://sctapi.ftqq.com';
      return postForm(`${base}/${key}.send`, { title, desp: content });
    }
    case 'pushplus': {
      if (!config.token) return { ok: false, error: '缺少 PushPlus token' };
      return postJson('https://www.pushplus.plus/send', {
        token: config.token.trim(),
        title,
        content,
        template: 'markdown',
      });
    }
    case 'wecom': {
      if (!config.webhook) return { ok: false, error: '缺少企业微信机器人 Webhook' };
      const result = await postJson(config.webhook.trim(), {
        msgtype: 'markdown',
        markdown: { content: `**${title}**\n${content}` },
      });
      return result;
    }
    case 'feishu': {
      if (!config.webhook) return { ok: false, error: '缺少飞书机器人 Webhook' };
      // 飞书自定义机器人：open.feishu.cn/open-apis/bot/v2/hook/{token}
      const result = await postJson(config.webhook.trim(), {
        msg_type: 'text',
        content: { text: `【${title}】\n${content}` },
      });
      return result;
    }
    case 'email': {
      if (!config.smtpHost || !config.smtpUser || !config.smtpPass || !config.mailTo) {
        return { ok: false, error: '缺少 SMTP 配置（服务器/账号/授权码/收件人）' };
      }
      try {
        // 懒加载 nodemailer，避免无邮件需求时加载
        const nodemailer = await import('nodemailer');
        const port = config.smtpPort || 465;
        const transporter = nodemailer.default.createTransport({
          host: config.smtpHost.trim(),
          port,
          secure: port === 465,
          auth: { user: config.smtpUser.trim(), pass: config.smtpPass.trim() },
        });
        await transporter.sendMail({
          from: `HPClaw <${config.smtpUser.trim()}>`,
          to: config.mailTo.trim(),
          subject: title,
          text: content,
        });
        return { ok: true };
      } catch (err: any) {
        return { ok: false, error: err?.message || String(err) };
      }
    }
    default:
      return { ok: false, error: `未知通知渠道: ${config.channel}` };
  }
}
