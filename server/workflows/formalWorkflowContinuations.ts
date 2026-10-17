import fs from 'node:fs';
import path from 'node:path';
import { DATA_ROOT } from '../paths';
import { writeFileAtomic0600 } from '../dsh/fileUtils';

export interface WorkflowConnectionIdentity {
  host: string;
  port: number;
  username: string;
}

export interface FormalWorkflowContinuation {
  id: string;
  jobId: string;
  runDir: string;
  workflowId: string;
  runId: string;
  connectionKey: string;
  sessionId?: string;
  conversationId?: string;
  locale?: 'zh-CN' | 'en-US';
  confirmationPolicy?: 'never' | 'dangerous' | 'state_changes' | 'every_command';
  state: 'waiting_jobs' | 'job_finished' | 'resuming' | 'waiting_user';
  terminalStatus?: 'DONE' | 'EXIT';
  resumeCount: number;
  submittedAt: number;
  updatedAt: number;
  /** 连续对账失败次数（旧记录无此字段按 0 处理）；成功对账后清零。 */
  reconcileAttempts?: number;
  /** 最近一次对账失败时间；配合 reconcileAttempts 做退避调度。 */
  lastAttemptAt?: number;
}

export interface FormalWorkflowContinuationContext {
  runDir: string;
  workflowId: string;
  runId: string;
  connection: WorkflowConnectionIdentity;
  sessionId?: string;
  conversationId?: string;
  locale?: 'zh-CN' | 'en-US';
  confirmationPolicy?: 'never' | 'dangerous' | 'state_changes' | 'every_command';
}

const MAX_RECORDS = 500;
let rootOverride: string | undefined;
let cache: FormalWorkflowContinuation[] | undefined;

export function initFormalWorkflowContinuations(root: string): void {
  rootOverride = root;
  cache = undefined;
}

function filePath(): string {
  return path.join(rootOverride ?? DATA_ROOT, 'formal-workflow-continuations.json');
}

export function workflowConnectionKey(identity: WorkflowConnectionIdentity): string {
  return `${identity.username.trim().toLowerCase()}@${identity.host.trim().toLowerCase()}:${Number(identity.port) || 22}`;
}

function isRecord(value: unknown): value is FormalWorkflowContinuation {
  const record = value as FormalWorkflowContinuation;
  return Boolean(record
    && typeof record.id === 'string'
    && typeof record.jobId === 'string'
    && typeof record.runDir === 'string'
    && typeof record.connectionKey === 'string'
    && typeof record.updatedAt === 'number');
}

function load(): FormalWorkflowContinuation[] {
  if (cache) return cache;
  cache = [];
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath(), 'utf8'));
    if (Array.isArray(parsed)) cache = parsed.filter(isRecord);
  } catch { /* 首次运行或损坏时从空记录开始 */ }
  return cache;
}

function persist(): void {
  const records = (cache ?? []).sort((a, b) => b.updatedAt - a.updatedAt).slice(0, MAX_RECORDS);
  cache = records;
  writeFileAtomic0600(filePath(), JSON.stringify(records, null, 2));
}

function recordId(connectionKey: string, jobId: string, runDir: string): string {
  return Buffer.from(`${connectionKey}\0${jobId}\0${runDir}`).toString('base64url');
}

export function addFormalWorkflowContinuations(
  jobIds: string[],
  context: FormalWorkflowContinuationContext,
): FormalWorkflowContinuation[] {
  const records = load();
  const connectionKey = workflowConnectionKey(context.connection);
  const now = Date.now();
  const added: FormalWorkflowContinuation[] = [];
  for (const jobId of jobIds) {
    if (!/^[\d._]+$/.test(jobId)) continue;
    const id = recordId(connectionKey, jobId, context.runDir);
    let record = records.find(item => item.id === id);
    if (!record) {
      record = {
        id,
        jobId,
        runDir: context.runDir,
        workflowId: context.workflowId,
        runId: context.runId,
        connectionKey,
        sessionId: context.sessionId,
        conversationId: context.conversationId,
        locale: context.locale,
        confirmationPolicy: context.confirmationPolicy,
        state: 'waiting_jobs',
        resumeCount: 0,
        submittedAt: now,
        updatedAt: now,
      };
      records.push(record);
    } else {
      record.sessionId = context.sessionId;
      record.conversationId = context.conversationId ?? record.conversationId;
      record.locale = context.locale ?? record.locale;
      record.confirmationPolicy = context.confirmationPolicy ?? record.confirmationPolicy;
      record.state = 'waiting_jobs';
      record.terminalStatus = undefined;
      record.updatedAt = now;
    }
    added.push({ ...record });
  }
  if (added.length) persist();
  return added;
}

export function listPendingFormalWorkflowContinuations(identity: WorkflowConnectionIdentity): FormalWorkflowContinuation[] {
  const key = workflowConnectionKey(identity);
  return load().filter(record => record.connectionKey === key && record.state !== 'waiting_user').map(record => ({ ...record }));
}

export function markFormalWorkflowJobFinished(
  identity: WorkflowConnectionIdentity,
  jobId: string,
  terminalStatus: 'DONE' | 'EXIT',
  sessionId: string,
): FormalWorkflowContinuation[] {
  const key = workflowConnectionKey(identity);
  // A user/QC/approval pause is durable. A repeated scheduler event must not undo it.
  const matched = load().filter(record => record.connectionKey === key && record.jobId === jobId && record.state !== 'waiting_user');
  const now = Date.now();
  for (const record of matched) {
    record.state = 'job_finished';
    record.terminalStatus = terminalStatus;
    record.sessionId = sessionId;
    record.updatedAt = now;
  }
  if (matched.length) persist();
  return matched.map(record => ({ ...record }));
}

export function markFormalWorkflowResuming(id: string): void {
  const record = load().find(item => item.id === id);
  if (!record) return;
  record.state = 'resuming';
  record.resumeCount += 1;
  record.updatedAt = Date.now();
  persist();
}

export function markFormalWorkflowWaitingUser(id: string): void {
  const record = load().find(item => item.id === id);
  if (!record) return;
  record.state = 'waiting_user';
  record.updatedAt = Date.now();
  persist();
}

// ── 对账退避与失败上限 ──────────────────────────────────────────────
// 大 LSF 集群上一次对账超时不代表永远失败；每 45s 无差别重放会把登录节点
// 打出更多慢查询。失败按 45s→2min→5min→15min 退避，连续失败到上限后
// 暂停为 waiting_user 并明确告知用户，避免无限 deferred。

/** 连续对账失败达到该次数后暂停自动续跑，转人工恢复。 */
export const FORMAL_RECONCILE_MAX_ATTEMPTS = 8;

const RECONCILE_BACKOFF_MS = [45_000, 120_000, 300_000, 900_000];

/** 第 attempts 次失败后的重试间隔（45s→2min→5min→15min 封顶）。 */
export function reconcileBackoffMs(attempts: number): number {
  const n = Math.max(1, Math.floor(attempts));
  return RECONCILE_BACKOFF_MS[Math.min(n - 1, RECONCILE_BACKOFF_MS.length - 1)];
}

/** 该记录是否到了下一次对账时间（sweep 用；旧记录缺字段时立即到期）。 */
export function isFormalWorkflowReconcileDue(record: FormalWorkflowContinuation, now = Date.now()): boolean {
  const attempts = record.reconcileAttempts ?? 0;
  if (attempts <= 0 || !record.lastAttemptAt) return true;
  return now - record.lastAttemptAt >= reconcileBackoffMs(attempts);
}

/** 记录一次对账失败（递增计数并落盘），返回更新后的记录。 */
export function noteFormalWorkflowReconcileAttempt(id: string, now = Date.now()): FormalWorkflowContinuation | undefined {
  const record = load().find(item => item.id === id);
  if (!record) return undefined;
  record.reconcileAttempts = (record.reconcileAttempts ?? 0) + 1;
  record.lastAttemptAt = now;
  record.updatedAt = now;
  persist();
  return { ...record };
}

/** 对账成功后清零失败计数，让后续失败重新从最短退避开始。 */
export function resetFormalWorkflowReconcileAttempts(id: string): void {
  const record = load().find(item => item.id === id);
  if (!record || !record.reconcileAttempts) return;
  record.reconcileAttempts = 0;
  record.lastAttemptAt = undefined;
  record.updatedAt = Date.now();
  persist();
}

export interface FormalReconcileFailureDeps {
  /** 把 run 置为 waiting_user 并写明暂停原因（可能因集群仍缓慢而失败，调用方自行兜底）。 */
  pauseRun: (runDir: string, error: string) => Promise<unknown>;
  /** 复用现有外部通知通道（notify-config 配置的渠道）。 */
  notify?: (title: string, content: string) => Promise<unknown> | unknown;
  now?: () => number;
}

/**
 * 对账失败的统一决策：递增失败计数；未达上限 → 'retry'（调用方负责重新排队，sweep 按退避到期再来）；
 * 达到上限 → 'pause'，记录转 waiting_user（不再被 sweep 捞起）、run 写明可人工恢复的原因并通知用户。
 */
export async function handleFormalReconcileFailure(
  record: FormalWorkflowContinuation,
  deps: FormalReconcileFailureDeps,
): Promise<{ action: 'retry' | 'pause'; attempts: number }> {
  const now = (deps.now ?? Date.now)();
  const updated = noteFormalWorkflowReconcileAttempt(record.id, now);
  const attempts = updated?.reconcileAttempts ?? (record.reconcileAttempts ?? 0) + 1;
  if (attempts < FORMAL_RECONCILE_MAX_ATTEMPTS) return { action: 'retry', attempts };
  markFormalWorkflowWaitingUser(record.id);
  const error = `自动续跑对账因集群响应缓慢连续失败 ${attempts} 次，已暂停；你的作业未被取消，可在对话里发送「继续」手动恢复。`;
  try {
    await deps.pauseRun(record.runDir, error);
  } catch (err) {
    console.warn('[workflow-continuation] 暂停流程运行写入失败: %s', err instanceof Error ? err.message : String(err));
  }
  try {
    await deps.notify?.(
      '流程自动续跑已暂停',
      `运行 ${record.runId}（${record.runDir}）的自动续跑对账连续失败 ${attempts} 次（集群响应缓慢），已暂停；作业未被取消，可在对话里发送「继续」手动恢复。`,
    );
  } catch (err) {
    console.warn('[workflow-continuation] 暂停通知发送失败: %s', err instanceof Error ? err.message : String(err));
  }
  return { action: 'pause', attempts };
}

export function removeFormalWorkflowContinuation(id: string): boolean {
  const records = load();
  const index = records.findIndex(record => record.id === id);
  if (index < 0) return false;
  records.splice(index, 1);
  persist();
  return true;
}

export function listAllFormalWorkflowContinuations(): FormalWorkflowContinuation[] {
  return load().map(record => ({ ...record }));
}
