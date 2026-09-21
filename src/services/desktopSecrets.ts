// 桌面端（Electron）加密密钥通道：preload 暴露的 hpclawDesktop.secrets，
// 主进程用 safeStorage 加密后落盘（userData/secrets.json）。
// 浏览器开发模式没有该通道，各存储模块回退 localStorage 明文（仅开发用）。
import type { HpclawDesktop } from '../types/desktop';

export type DesktopSecretsApi = HpclawDesktop['secrets'];

export function desktopSecrets(): DesktopSecretsApi | null {
  if (typeof window === 'undefined') return null;
  return (window as any).hpclawDesktop?.secrets ?? null;
}
