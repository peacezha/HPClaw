// 流程（Workflow）前端 API 客户端
import type { Workflow, WorkflowPaperImport } from '@/shared/workflow';
import type { PreflightResult } from '@/shared/flowManifest';
import { workflowSlug, workflowSlugLegacy, workflowSlugParenLegacy } from '@/shared/flowManifest';
import { getStoredLocale } from '../../i18n';

export type { Workflow, WorkflowStep, WorkflowParam } from '@/shared/workflow';
export type { FlowManifest, PreflightResult, PreflightItemResult } from '@/shared/flowManifest';

async function request(path: string, options: RequestInit = {}): Promise<any> {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
  return data;
}

export async function listWorkflows(): Promise<Workflow[]> {
  const data = await request('/api/workflows');
  return data.workflows || [];
}

export async function matchWorkflows(query: string): Promise<(Workflow & { score: number })[]> {
  const data = await request('/api/workflows/match', {
    method: 'POST',
    body: JSON.stringify({ query }),
  });
  return data.matches || [];
}

export async function createWorkflow(input: Partial<Workflow>): Promise<Workflow> {
  const data = await request('/api/workflows', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return data.workflow;
}

export async function updateWorkflow(id: string, input: Partial<Workflow>): Promise<Workflow> {
  const data = await request(`/api/workflows/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
  return data.workflow;
}

export async function deleteWorkflow(id: string): Promise<void> {
  await request(`/api/workflows/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export async function draftWorkflow(description: string, profile: { provider: string; model: string; apiKey: string }): Promise<Partial<Workflow>> {
  const data = await request('/api/workflows/draft', {
    method: 'POST',
    body: JSON.stringify({ description, profile, locale: getStoredLocale() }),
  });
  return data.draft;
}

/** 从文献学习流程：DOI 或 PDF 提取的论文文本 → AI 提取为流程草稿 */
export async function learnFromPaper(
  input: { doi?: string; paperText?: string; pasteSource?: 'paste' },
  profile: { provider: string; model: string; apiKey: string },
): Promise<{
  draft: Partial<Workflow>;
  /** 草稿箱条目 id：学习内容已持久化，可找回、可继续修订 */
  draftId: string | null;
  source: string;
  paperChars: number;
  repoUsed: string | null;
  repoFiles: string[];
  softwareCheck: Array<{ name: string; status: 'ok' | 'missing' | 'unknown'; hit?: string }>;
  paperImport: WorkflowPaperImport;
  context: {
    selectedChars: number;
    methodSections: string[];
    selectionMode: 'methods' | 'fulltext-fallback';
    truncated: boolean;
  };
}> {
  const data = await request('/api/workflows/learn', {
    method: 'POST',
    body: JSON.stringify({ ...input, profile, locale: getStoredLocale() }),
  });
  return {
    draft: data.draft,
    draftId: data.draftId || null,
    source: data.source || '',
    paperChars: data.paperChars || 0,
    repoUsed: data.repoUsed || null,
    repoFiles: data.repoFiles || [],
    softwareCheck: data.softwareCheck || [],
    paperImport: data.paperImport,
    context: data.context || { selectedChars: 0, methodSections: [], selectionMode: 'fulltext-fallback', truncated: false },
  };
}

// ── 文献学习草稿箱（持久化，避免切走页面后学习内容丢失） ────────────────────

export interface LearnDraftSummary {
  id: string;
  name: string;
  sourceLabel: string;
  doi?: string;
  repoUrl?: string;
  createdAt: number;
  updatedAt: number;
  revisionNotes: string[];
  stepCount: number;
  qualityScore?: number;
}

export async function listLearnDrafts(): Promise<LearnDraftSummary[]> {
  const data = await request('/api/workflows/learn-drafts');
  return data.drafts || [];
}

export async function getLearnDraft(id: string): Promise<{
  id: string;
  name: string;
  sourceLabel: string;
  createdAt: number;
  updatedAt: number;
  revisionNotes: string[];
  draft: Partial<Workflow>;
}> {
  const data = await request(`/api/workflows/learn-drafts/${encodeURIComponent(id)}`);
  return data.draft;
}

export async function deleteLearnDraftApi(id: string): Promise<void> {
  await request(`/api/workflows/learn-drafts/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

/** 按用户反馈让 AI 修订学习草稿；返回修订后的完整草稿与一句话修订说明 */
export async function reviseLearnDraft(
  id: string,
  feedback: string,
  profile: { provider: string; model: string; apiKey: string },
): Promise<{
  draft: Partial<Workflow>;
  revisionNote: string;
  paperImport: WorkflowPaperImport;
}> {
  const data = await request(`/api/workflows/learn-drafts/${encodeURIComponent(id)}/revise`, {
    method: 'POST',
    body: JSON.stringify({ feedback, profile, locale: getStoredLocale() }),
  });
  return { draft: data.draft, revisionNote: data.revisionNote || '', paperImport: data.paperImport };
}

/** 执行流程预检（SSH 核查必要软件与参考数据，需要集群会话）；only 可做单项校验 */
export async function runPreflight(
  id: string,
  sessionId?: string | null,
  only?: { software?: string[]; references?: string[] },
): Promise<PreflightResult> {
  const data = await request(`/api/workflows/${encodeURIComponent(id)}/preflight`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(sessionId ? { 'X-SSH-Session-Id': sessionId } : {}) },
    body: only ? JSON.stringify({ only }) : undefined,
  });
  return data.result;
}

/** 读取集群上缓存的上次预检结果；从未预检返回 null */
export async function getCachedPreflight(id: string, sessionId?: string | null): Promise<PreflightResult | null> {
  const data = await request(`/api/workflows/${encodeURIComponent(id)}/preflight`, {
    headers: sessionId ? { 'X-SSH-Session-Id': sessionId } : {},
  });
  return data.result || null;
}

/** 查看流程运行日志（动态发现 run 目录下的日志文件并 tail） */
export async function fetchRunLog(runDir: string, sessionId?: string | null, n = 200): Promise<{ log: string; files: string[] }> {
  const qs = new URLSearchParams({ dir: runDir, n: String(n) });
  const data = await request(`/api/workflows/runs/log?${qs}`, {
    headers: sessionId ? { 'X-SSH-Session-Id': sessionId } : {},
  });
  return { log: data.log || '', files: data.files || [] };
}

/** 流程运行状态（来自集群 run.json） */
export interface WorkflowRunStep {
  n: number;
  stepId?: string;
  dependsOn?: string[];
  phase?: string;
  title: string;
  status: 'pending' | 'running' | 'done' | 'failed' | 'skipped';
  startedAt?: number;
  finishedAt?: number;
  jobIds?: string[];
  summary?: string;
  qc?: { status: 'pass' | 'warn' | 'fail'; metrics?: Record<string, string> };
  outputs?: string[];
  evidence?: string[];
  scriptPath?: string;
  scriptUpdatedAt?: number;
  scriptUserModified?: boolean;
  scriptHash?: string;
  submittedScriptHash?: string;
}

export interface WorkflowRun {
  runId?: string;
  revision?: number;
  workflowId?: string;
  workflowName?: string;
  runDir: string;
  codeDir?: string;
  status: 'blocked_env' | 'running' | 'waiting_user' | 'waiting_jobs' | 'done' | 'failed' | 'cancelled' | 'unknown';
  startedAt?: number;
  updatedAt?: number;
  heartbeatAt?: number;
  endedAt?: number;
  currentStep?: number;
  totalSteps?: number;
  steps?: WorkflowRunStep[];
  reportPath?: string;
  /** 服务端判定：活动状态但超时无更新（AI 中断或未收尾） */
  stale?: boolean;
  displayStatus?: 'stalled';
  /** bjobs 核实结果：作业号 → 状态（GONE = 已结束被清理） */
  jobStates?: Record<string, string>;
  error?: string;
}

export interface WorkflowStepCode {
  run: WorkflowRun;
  step: WorkflowRunStep;
  codeDir: string;
  scriptPath: string;
  content: string;
}

export async function fetchWorkflowStepCode(
  runDir: string,
  step: number,
  sessionId?: string | null,
): Promise<WorkflowStepCode> {
  const qs = new URLSearchParams({ dir: runDir, step: String(step) });
  const data = await request(`/api/workflow-runs/code?${qs}`, {
    headers: sessionId ? { 'X-SSH-Session-Id': sessionId } : {},
  });
  return data.code;
}

export async function saveWorkflowStepCode(
  runDir: string,
  step: number,
  content: string,
  sessionId?: string | null,
): Promise<WorkflowStepCode> {
  const data = await request('/api/workflow-runs/code', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...(sessionId ? { 'X-SSH-Session-Id': sessionId } : {}) },
    body: JSON.stringify({ runDir, step, content }),
  });
  return data.code;
}

export interface WorkflowRunConfigInput {
  inputs: string[];
  params: Record<string, string>;
  stepParams: Record<number, Record<string, string>>;
  referenceOverrides: Record<string, string>;
  skippedSteps: number[];
  stepCommandOverrides: Record<number, string>;
}

/** 由服务端预创建正式运行记录，确保 AI 开始前监控面板已有稳定 runId。 */
export async function createWorkflowRun(
  workflowId: string,
  config: WorkflowRunConfigInput,
  sessionId?: string | null,
): Promise<WorkflowRun> {
  const data = await request(`/api/workflows/${encodeURIComponent(workflowId)}/runs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(sessionId ? { 'X-SSH-Session-Id': sessionId } : {}) },
    body: JSON.stringify(config),
  });
  return data.run;
}

/** 重新激活一条未完成运行；服务端用 revision 防止覆盖监控器的新状态。 */
export async function resumeWorkflowRun(
  runDir: string,
  expectedRevision: number | undefined,
  sessionId?: string | null,
): Promise<WorkflowRun> {
  const data = await request('/api/workflow-runs/resume', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(sessionId ? { 'X-SSH-Session-Id': sessionId } : {}) },
    body: JSON.stringify({ runDir, expectedRevision }),
  });
  return data.run;
}

/** 拉取已注册的小型运行索引；不会遍历流程目录。 */
export async function fetchWorkflowRuns(sessionId?: string | null): Promise<WorkflowRun[]> {
  const data = await request('/api/workflow-runs', {
    headers: sessionId ? { 'X-SSH-Session-Id': sessionId } : {},
  });
  return data.runs || [];
}

/** 仅在用户明确点击时扫描旧版流程运行目录并建立索引。 */
export async function importWorkflowRunHistory(sessionId?: string | null): Promise<number> {
  const data = await request('/api/workflow-runs/import-history', {
    method: 'POST',
    headers: sessionId ? { 'X-SSH-Session-Id': sessionId } : {},
  });
  return Number(data.count) || 0;
}

function workflowRunFingerprint(run: WorkflowRun): string {
  return JSON.stringify([
    run.runDir, run.codeDir, run.runId, run.revision, run.status, run.updatedAt, run.currentStep, run.totalSteps,
    run.stale, run.displayStatus, run.reportPath, run.error, run.jobStates,
    run.steps?.map(step => [
      step.n, step.status, step.startedAt, step.finishedAt, step.jobIds,
      step.summary, step.qc, step.outputs, step.scriptPath, step.scriptUpdatedAt, step.scriptUserModified,
      step.evidence, step.scriptHash, step.submittedScriptHash,
    ]),
  ]);
}

/**
 * 合并 Socket 推送的单条运行记录。内容没有变化时保留原数组引用，避免整页重绘。
 */
export function mergeWorkflowRunUpdate(
  current: WorkflowRun[],
  incoming: WorkflowRun,
  limit = 20,
): WorkflowRun[] {
  if (!incoming?.runDir) return current;
  const index = current.findIndex(run => run.runDir === incoming.runDir
    || (!!incoming.runId && run.runId === incoming.runId));
  if (index >= 0 && workflowRunFingerprint(current[index]) === workflowRunFingerprint(incoming)) return current;
  const next = index >= 0
    ? current.map((run, i) => i === index ? incoming : run)
    : [incoming, ...current];
  return next
    .sort((a, b) => (b.updatedAt || b.startedAt || 0) - (a.updatedAt || a.startedAt || 0))
    .slice(0, limit);
}

/** 低频兜底快照没有变化时不触发 React 更新。 */
export function reconcileWorkflowRunSnapshot(current: WorkflowRun[], incoming: WorkflowRun[]): WorkflowRun[] {
  if (current.length === incoming.length
    && current.every((run, index) => workflowRunFingerprint(run) === workflowRunFingerprint(incoming[index]))) {
    return current;
  }
  return incoming;
}

/** 部署流程内置管线文件到集群流程家目录（SFTP 上传） */
export async function deployWorkflowAssets(
  id: string,
  sessionId?: string | null,
): Promise<{ results: Array<{ remotePath: string; ok: boolean; error?: string }>; base: string }> {
  const data = await request(`/api/workflows/${encodeURIComponent(id)}/deploy-assets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(sessionId ? { 'X-SSH-Session-Id': sessionId } : {}) },
  });
  return { results: data.results || [], base: data.base || '' };
}

/**
 * 运行归属判定：run 是否属于某个流程。
 * 三级匹配：run.json 的 workflowId → workflowName 的 slug → runDir 是否位于该流程的家目录。
 * （AI 手写 run.json 时可能缺 workflowId 或写法有偏差，目录归属是最可靠的事实）
 * slug 同时匹配新版（ASCII 化）与旧版（含中文），旧中文目录的历史运行不丢失。
 */
export function runBelongsToWorkflow(run: WorkflowRun, workflow: Workflow): boolean {
  if (run.workflowId && run.workflowId === workflow.id) return true;
  const slugs = new Set([
    workflowSlug(workflow.name),
    workflowSlugLegacy(workflow.name),
    // v0.4.19–v0.4.20 生成的带括号 slug 目录也要认得回来
    workflowSlugParenLegacy(workflow.name),
  ]);
  if (run.workflowName) {
    const runNameSlug = workflowSlug(run.workflowName);
    const runNameLegacy = workflowSlugLegacy(run.workflowName);
    if (slugs.has(runNameSlug) || slugs.has(runNameLegacy)) return true;
  }
  for (const slug of slugs) {
    if (run.runDir && run.runDir.includes(`/hpclaw_flows/${slug}/`)) return true;
  }
  return false;
}
