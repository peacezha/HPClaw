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

export type DshConfirmationPolicy = 'never' | 'dangerous' | 'state_changes' | 'every_command';

export interface DshBridgeBinding {
  dshSessionId: string;
  sshSessionId: string;
  workspaceRoot: string;
  conversationKey: string;
  confirmationPolicy: DshConfirmationPolicy;
  /** Explanation follow-ups cannot authorize remote mutations. */
  readOnly?: boolean;
  resume?: { conversationId?: string; locale: 'zh-CN' | 'en-US'; profile: { provider: string; model: string; baseUrl?: string } };
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
    confirmationPolicy: binding.confirmationPolicy === 'dangerous' || binding.confirmationPolicy === 'state_changes' || binding.confirmationPolicy === 'every_command'
      ? binding.confirmationPolicy
      : 'never',
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

export function setDshSessionReadOnly(dshSessionId: string, readOnly: boolean): void {
  const binding = dshBindings.get(dshSessionId);
  if (binding) binding.readOnly = readOnly;
}

/* ---------------- 交互应答注册表（审批/反问） ----------------
 * sdk 通道不回传 approval/request 与 user-questions/request 瀑布；插件内的 HTTP
 * 应答器把它们 POST 到 /api/bridge/interaction/*，桥路由在这里找到当前持有该会话
 * 的 runner 注册的处理器。处理器只在对应 SSE 请求存活期间注册，结束时注销。 */

export type DshApprovalOutcome = 'allowed-once' | 'rejected' | 'cancelled' | 'unavailable';

export interface DshApprovalInteraction {
  requestId: string;
  sessionId: string;
  toolName: string;
  callId?: string;
  reason?: string;
}

export interface DshQuestionItem {
  id: string;
  question: string;
  detail?: string;
  header?: string;
  options?: Array<{ label: string; description?: string }>;
  multiSelect?: boolean;
}

export interface DshQuestionAnswerItem {
  id: string;
  selected: string[];
  custom?: string;
}

export interface DshQuestionsInteraction {
  requestId: string;
  sessionId: string;
  callId?: string;
  questions: DshQuestionItem[];
}

export interface DshInteractionHandler {
  onApproval(req: DshApprovalInteraction): Promise<DshApprovalOutcome>;
  /** 返回 null 表示无人应答（前端已断开/用户关闭），插件侧应回退瀑布下一棒。 */
  onQuestions(req: DshQuestionsInteraction): Promise<{ answers: DshQuestionAnswerItem[] } | null>;
}

const interactionHandlers = new Map<string, DshInteractionHandler>();

/** 后注册覆盖先注册（同会话不应有并发持有者；唤醒/前台互斥由 wakeQueue 保证）。返回注销函数。 */
export function registerDshInteractionHandler(dshSessionId: string, handler: DshInteractionHandler): () => void {
  const key = String(dshSessionId || '').trim();
  if (!key) return () => {};
  interactionHandlers.set(key, handler);
  return () => {
    if (interactionHandlers.get(key) === handler) interactionHandlers.delete(key);
  };
}

export function getDshInteractionHandler(dshSessionId: string | undefined): DshInteractionHandler | undefined {
  if (!dshSessionId) return undefined;
  return interactionHandlers.get(dshSessionId);
}
