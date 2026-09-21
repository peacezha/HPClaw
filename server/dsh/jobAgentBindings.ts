// 作业 ↔ AI 会话绑定：记录"哪个 LSF 作业是由哪次 AI 对话提交的"，
// 供 jobWatcher 发现作业终态后唤醒对应 dsh 会话（见 dshJobResumer）。
// 持久化为 <DATA_ROOT>/job-agent-bindings.json（0600 原子写，LRU 上限 200 条）。

import fs from 'node:fs';
import path from 'node:path';
import { DATA_ROOT } from '../paths';
import { writeFileAtomic0600 } from './fileUtils';

export interface JobAgentBindingProfile {
  provider: string;
  model: string;
  apiKey?: string;
  baseUrl?: string;
}

export interface JobAgentBinding {
  jobId: string;
  sshSessionId: string;
  conversationKey: string;
  /** dsh 会话 id；legacy(内置)引擎没有 dsh 会话，固定为空串。 */
  dshSessionId: string;
  /** 提交作业的引擎：dsh 走 dshJobResumer 唤醒，legacy 走 legacyJobResumer。缺省按 dsh 处理。 */
  engine?: 'dsh' | 'legacy';
  conversationId?: string;
  workspace?: string;
  confirmationPolicy?: 'dangerous' | 'state_changes' | 'every_command';
  profile?: JobAgentBindingProfile;
  locale?: 'zh-CN' | 'en-US';
  submittedAt: number;
  resumeCount: number;
}

/** addBindings 的上下文字段（jobId/submittedAt/resumeCount 由存储层管理）。 */
export interface JobBindingContext {
  sshSessionId: string;
  conversationKey: string;
  dshSessionId: string;
  engine?: 'dsh' | 'legacy';
  conversationId?: string;
  workspace?: string;
  confirmationPolicy?: 'dangerous' | 'state_changes' | 'every_command';
  profile?: JobAgentBindingProfile;
  locale?: 'zh-CN' | 'en-US';
}

const MAX_BINDINGS = 200;

let dataRoot: string | undefined;
let bindingsCache: JobAgentBinding[] | undefined;

/** 注入数据根（测试用临时目录；未调用时回退全局 DATA_ROOT）。重复调用会强制重读文件。 */
export function initJobAgentBindings(root: string): void {
  dataRoot = root;
  bindingsCache = undefined;
}

function storeFile(): string {
  return path.join(dataRoot ?? DATA_ROOT, 'job-agent-bindings.json');
}

function isBinding(value: unknown): value is JobAgentBinding {
  const b = value as JobAgentBinding;
  return Boolean(
    b && typeof b === 'object'
    && typeof b.jobId === 'string' && typeof b.sshSessionId === 'string'
    && typeof b.conversationKey === 'string' && typeof b.dshSessionId === 'string'
    && typeof b.submittedAt === 'number' && typeof b.resumeCount === 'number',
  );
}

function load(): JobAgentBinding[] {
  if (bindingsCache) return bindingsCache;
  bindingsCache = [];
  try {
    const raw = JSON.parse(fs.readFileSync(storeFile(), 'utf8'));
    if (Array.isArray(raw)) bindingsCache = raw.filter(isBinding);
  } catch { /* 文件不存在或损坏：按空表处理 */ }
  return bindingsCache;
}

function persist(): void {
  writeFileAtomic0600(storeFile(), JSON.stringify(bindingsCache ?? [], null, 2));
}

// 与 server/ai/agentRunner.ts 的作业号提取规则一致：
// "Job <123> is submitted to queue <normal>." / "Submitted batch job 456"。
const SUBMIT_PATTERNS = [
  /Job\s+<(\d+(?:[._]\d+)?)>\s+is\s+submitted\b/gi,
  /Submitted\s+batch\s+job\s+(\d+(?:[._]\d+)?)/gi,
];

/** 从 bsub 输出提取作业号：按文本中首次出现位置排序、去重。"is not found" 等不会误报。 */
export function extractSubmittedJobIds(text: string): string[] {
  if (!text) return [];
  const matches: Array<{ id: string; index: number }> = [];
  for (const pattern of SUBMIT_PATTERNS) {
    for (const match of text.matchAll(pattern)) {
      matches.push({ id: match[1], index: match.index ?? 0 });
    }
  }
  matches.sort((a, b) => a.index - b.index);
  const ids: string[] = [];
  const seen = new Set<string>();
  for (const { id } of matches) {
    if (!seen.has(id)) {
      seen.add(id);
      ids.push(id);
    }
  }
  return ids;
}

/**
 * 绑定一批作业号到同一 AI 会话上下文。按 jobId+sshSessionId 去重：
 * 已存在则刷新上下文字段（不重置 resumeCount/submittedAt）。返回新增条数。
 */
export function addBindings(jobIds: string[], ctx: JobBindingContext): number {
  const list = load();
  let added = 0;
  for (const jobId of jobIds) {
    if (!jobId) continue;
    const existing = list.find(b => b.jobId === jobId && b.sshSessionId === ctx.sshSessionId);
    if (existing) {
      existing.conversationKey = ctx.conversationKey;
      existing.dshSessionId = ctx.dshSessionId;
      existing.engine = ctx.engine;
      existing.conversationId = ctx.conversationId;
      existing.workspace = ctx.workspace;
      existing.confirmationPolicy = ctx.confirmationPolicy;
      existing.profile = ctx.profile;
      existing.locale = ctx.locale;
      continue;
    }
    list.push({ jobId, ...ctx, submittedAt: Date.now(), resumeCount: 0 });
    added += 1;
  }
  // LRU：超上限按 submittedAt 淘汰最老。
  if (list.length > MAX_BINDINGS) {
    list.sort((a, b) => a.submittedAt - b.submittedAt);
    list.splice(0, list.length - MAX_BINDINGS);
  }
  persist();
  return added;
}

export function getBinding(jobId: string, sshSessionId: string): JobAgentBinding | undefined {
  return load().find(b => b.jobId === jobId && b.sshSessionId === sshSessionId);
}

export function markResumed(jobId: string, sshSessionId: string): void {
  const binding = getBinding(jobId, sshSessionId);
  if (!binding) return;
  binding.resumeCount += 1;
  persist();
}

export function removeBinding(jobId: string, sshSessionId: string): boolean {
  const list = load();
  const index = list.findIndex(b => b.jobId === jobId && b.sshSessionId === sshSessionId);
  if (index < 0) return false;
  list.splice(index, 1);
  persist();
  return true;
}

export function listBindings(): JobAgentBinding[] {
  return [...load()];
}
