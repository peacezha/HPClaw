// dsh 桥状态：服务启动时生成一次性桥 token 并落盘（dsh 插件凭它调 /api/bridge/*），
// 每个 dsh 会话都绑定固定 SSH 会话与本地工作区；桥路由禁止使用进程级
// "最近一次集群"，避免多个 Agent 并发时把命令发到错误集群。

import crypto from 'node:crypto';
import { dataPath } from '../paths';
import { writeFileAtomic0600 } from './fileUtils';

export interface BridgeState {
  token: string;
  baseUrl: string;
  updatedAt: string;
}

let bridgeState: BridgeState | undefined;

export type DshConfirmationPolicy = 'dangerous' | 'state_changes' | 'every_command';

export interface DshBridgeBinding {
  dshSessionId: string;
  sshSessionId: string;
  workspaceRoot: string;
  conversationKey: string;
  confirmationPolicy: DshConfirmationPolicy;
  updatedAt: number;
}

const MAX_DSH_BINDINGS = 256;
const dshBindings = new Map<string, DshBridgeBinding>();

export function bridgeStateFile(): string {
  return dataPath('dsh-bridge.json');
}

/** 服务启动时调用；幂等（重复调用直接返回已生成的状态）。port 缺省取 PORT 环境变量或 3003。 */
export function initBridgeState(port?: number): BridgeState {
  if (bridgeState) return { ...bridgeState };
  const resolvedPort = port ?? Number(process.env.PORT || 3003);
  bridgeState = {
    token: crypto.randomBytes(24).toString('hex'),
    baseUrl: `http://127.0.0.1:${resolvedPort}`,
    updatedAt: new Date().toISOString(),
  };
  try {
    writeFileAtomic0600(bridgeStateFile(), JSON.stringify(bridgeState, null, 2));
  } catch (err) {
    // 落盘失败不阻塞启动：桥路由会因 token 读不到文件而在 dsh 侧不可用，但本进程内鉴权仍生效。
    console.warn('[dsh-bridge] 桥状态落盘失败: %s', err instanceof Error ? err.message : String(err));
  }
  return { ...bridgeState };
}

export function getBridgeToken(): string {
  return initBridgeState().token;
}

export function getBridgeState(): BridgeState {
  return initBridgeState();
}

export function bindDshSession(binding: Omit<DshBridgeBinding, 'updatedAt'>): DshBridgeBinding {
  const dshSessionId = String(binding.dshSessionId || '').trim();
  const sshSessionId = String(binding.sshSessionId || '').trim();
  if (!dshSessionId || !sshSessionId) throw new Error('dsh/ssh session binding is required');
  const value: DshBridgeBinding = {
    ...binding,
    dshSessionId,
    sshSessionId,
    confirmationPolicy: binding.confirmationPolicy === 'state_changes' || binding.confirmationPolicy === 'every_command'
      ? binding.confirmationPolicy
      : 'dangerous',
    updatedAt: Date.now(),
  };
  dshBindings.delete(dshSessionId);
  dshBindings.set(dshSessionId, value);
  while (dshBindings.size > MAX_DSH_BINDINGS) {
    const oldest = dshBindings.keys().next().value;
    if (!oldest) break;
    dshBindings.delete(oldest);
  }
  return { ...value };
}

export function getDshSessionBinding(dshSessionId: string | undefined): DshBridgeBinding | undefined {
  if (!dshSessionId) return undefined;
  const binding = dshBindings.get(dshSessionId);
  if (!binding) return undefined;
  binding.updatedAt = Date.now();
  dshBindings.delete(dshSessionId);
  dshBindings.set(dshSessionId, binding);
  return { ...binding };
}

export function unbindDshSession(dshSessionId: string): void {
  dshBindings.delete(dshSessionId);
}
