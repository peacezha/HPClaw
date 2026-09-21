import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { appPath } from '../paths';
import { renderWorkflowCommand, type Workflow } from './workflowTypes';
import { workflowSlug } from '../../shared/flowManifest';
import type {
  WorkflowRun,
  WorkflowRunConfig,
  WorkflowRunPatch,
  WorkflowRunStatus,
  WorkflowRunStepStatus,
} from '../../shared/workflowRun';

export type RunExec = (command: string, timeout?: number) => Promise<string>;

/**
 * 解析流程资产的本地路径：先 pipelines/ 目录（hidog 等既有资产约定），
 * 再应用根（skills/ 下的技能脚本，如 wheatomics.py）。
 */
export function resolveAssetLocalPath(source: string): string {
  const candidates = [appPath('pipelines', source), appPath(source)];
  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) return candidate;
    } catch { /* ignore */ }
  }
  throw new Error(`资产文件不存在: ${source}`);
}

/** createWorkflowRun 的可选部署上下文：有 sftp 时把 workflow.assets 上传进 RUN 目录。 */
export interface CreateRunDeployContext {
  sftp?: { fastPut: (localPath: string, remotePath: string, cb: (err?: Error) => void) => void } | undefined;
}

const RUN_STATUSES = new Set<WorkflowRunStatus>([
  'blocked_env', 'running', 'waiting_user', 'waiting_jobs', 'done', 'failed', 'cancelled', 'unknown',
]);
const STEP_STATUSES = new Set<WorkflowRunStepStatus>(['pending', 'running', 'done', 'failed', 'skipped']);
const STEP_TRANSITIONS: Record<WorkflowRunStepStatus, WorkflowRunStepStatus[]> = {
  pending: ['running', 'skipped'],
  running: ['done', 'failed'],
  failed: ['running', 'skipped'],
  done: [],
  skipped: [],
};

const runUpdateLocks = new Map<string, Promise<void>>();

async function withRunUpdateLock<T>(runDir: string, operation: () => Promise<T>): Promise<T> {
  const previous = runUpdateLocks.get(runDir) ?? Promise.resolve();
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  const queued = previous.then(() => gate);
  runUpdateLocks.set(runDir, queued);
  await previous;
  try {
    return await operation();
  } finally {
    release();
    if (runUpdateLocks.get(runDir) === queued) runUpdateLocks.delete(runDir);
  }
}

function contentHash(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}

export function assertWorkflowStepTransition(from: WorkflowRunStepStatus, to: WorkflowRunStepStatus): void {
  if (from === to) return;
  if (!STEP_TRANSITIONS[from]?.includes(to)) {
    throw new Error(`非法流程步骤状态转换: ${from} -> ${to}`);
  }
}

function shq(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

function cleanRecord(value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value as Record<string, unknown>)
    .slice(0, 200)
    .map(([k, v]) => [String(k).slice(0, 100), String(v ?? '').slice(0, 4000)]));
}

function cleanStepParams(value: unknown): Record<number, Record<string, string>> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const out: Record<number, Record<string, string>> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>).slice(0, 100)) {
    const n = Number(key);
    if (Number.isInteger(n) && n > 0) out[n] = cleanRecord(raw);
  }
  return out;
}

function cleanStepCommands(value: unknown): Record<number, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const out: Record<number, string> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>).slice(0, 100)) {
    const n = Number(key);
    const command = String(raw ?? '').trim();
    if (Number.isInteger(n) && n > 0 && command) out[n] = command.slice(0, 20_000);
  }
  return out;
}

export function sanitizeRunConfig(value: unknown): WorkflowRunConfig {
  const v = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  return {
    inputs: Array.isArray(v.inputs) ? v.inputs.map(String).map(s => s.trim()).filter(Boolean).slice(0, 200) : [],
    params: cleanRecord(v.params),
    stepParams: cleanStepParams(v.stepParams),
    referenceOverrides: cleanRecord(v.referenceOverrides),
    skippedSteps: Array.isArray(v.skippedSteps)
      ? [...new Set(v.skippedSteps.map(Number).filter(n => Number.isInteger(n) && n > 0))].slice(0, 100)
      : [],
    stepCommandOverrides: cleanStepCommands(v.stepCommandOverrides),
  };
}

function formatRunStamp(now: number): string {
  const d = new Date(now);
  const two = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${two(d.getMonth() + 1)}${two(d.getDate())}-${two(d.getHours())}${two(d.getMinutes())}${two(d.getSeconds())}`;
}

export function resolveWorkflowRunDir(home: string, runDir: string): string | null {
  const normalizedHome = home.replace(/\/+$/, '');
  const trimmed = String(runDir || '').trim();
  if (!trimmed || trimmed.includes('..') || /[\r\n\0]/.test(trimmed)) return null;
  const expanded = trimmed.startsWith('~/') ? `${normalizedHome}/${trimmed.slice(2)}` : trimmed;
  if (!expanded.startsWith(`${normalizedHome}/hpclaw_flows/`)) return null;
  if (!expanded.includes('/03_workspace/runs/')) return null;
  return expanded.replace(/\/+$/, '');
}

function atomicJsonCommand(filePath: string, value: unknown): string {
  const payload = Buffer.from(JSON.stringify(value, null, 2), 'utf8').toString('base64');
  const tmp = `${filePath}.tmp-${crypto.randomBytes(4).toString('hex')}`;
  return `printf %s ${shq(payload)} | base64 -d > ${shq(tmp)} && mv ${shq(tmp)} ${shq(filePath)}`;
}

function atomicTextCommand(filePath: string, content: string): string {
  const payload = Buffer.from(content, 'utf8').toString('base64');
  const tmp = `${filePath}.tmp-${crypto.randomBytes(4).toString('hex')}`;
  return `printf %s ${shq(payload)} | base64 -d > ${shq(tmp)} && mv ${shq(tmp)} ${shq(filePath)}`;
}

export function workflowStepScriptPath(runDir: string, stepNumber: number): string {
  return `${runDir.replace(/\/+$/, '')}/code/step-${String(stepNumber).padStart(2, '0')}.sh`;
}

function workflowRunValues(
  config: WorkflowRunConfig,
  stepNumber: number,
  runDir: string,
  flowDir: string,
): Record<string, string> {
  const values: Record<string, string> = {
    ...config.params,
    ...config.referenceOverrides,
    ...(config.stepParams[stepNumber] || {}),
    RUN: runDir,
    RUN_DIR: runDir,
    FLOW: flowDir,
    FLOW_HOME: flowDir,
  };
  if (!values.INPUT_DIR && config.inputs[0]) values.INPUT_DIR = config.inputs[0];
  return values;
}

export function buildWorkflowStepScript(
  workflow: Workflow,
  config: WorkflowRunConfig,
  stepNumber: number,
  runDir: string,
): string {
  const step = workflow.steps[stepNumber - 1];
  if (!step) throw new Error(`步骤不存在: ${stepNumber}`);
  const flowDir = runDir.split('/03_workspace/runs/')[0] || runDir;
  const template = config.stepCommandOverrides[stepNumber] || step.command || '';
  const rendered = renderWorkflowCommand(template, workflowRunValues(config, stepNumber, runDir, flowDir))
    .replaceAll('<RUN>', runDir)
    .replaceAll('<FLOW>', flowDir)
    .trim();
  const unresolved = [...rendered.matchAll(/\{\{\s*([\w.-]+)\s*\}\}/g)].map(match => match[1]);
  const uniqueUnresolved = [...new Set(unresolved)];
  return [
    '#!/usr/bin/env bash',
    'set -eo pipefail',
    '',
    `# HPClaw 流程：${workflow.name}`,
    `# 步骤 ${stepNumber}/${workflow.steps.length}：${step.title}`,
    '# 这是本步骤实际运行脚本。可以在流程面板中查看和修改；保存后，尚未提交的步骤会使用修改内容。',
    '# 已经提交到调度器的作业不会被修改；需要重跑时请先确认作业状态。',
    ...(step.notes ? [`# 注意：${step.notes.replace(/\r?\n/g, ' ')}`] : []),
    ...(uniqueUnresolved.length > 0
      ? [`# HPCLAW_REVIEW_REQUIRED：以下参数尚未确定，请在运行前补齐：${uniqueUnresolved.join(', ')}`]
      : []),
    '',
    rendered || '# 当前步骤没有可直接执行的命令，请在此处补充。',
    '',
  ].join('\n');
}

function buildCodeReadme(workflow: Workflow, runDir: string): string {
  const stepLines = workflow.steps.map((step, index) =>
    `- 步骤 ${index + 1}：\`step-${String(index + 1).padStart(2, '0')}.sh\` — ${step.title}`);
  return [
    `# ${workflow.name} — 本次运行代码`,
    '',
    `运行目录：\`${runDir}\``,
    '',
    '这里保存本次运行真正使用的脚本，一个流程步骤对应一个脚本。',
    '你可以在 HPClaw 的“查看/修改代码”中编辑；Agent 在执行尚未提交的步骤前会读取对应脚本。',
    '修改脚本不会改变已经提交到调度器的作业。手动在终端执行脚本时，run.json 的步骤状态不会自动更新。',
    '',
    ...stepLines,
    '',
    '日志保存在 `../logs/`，结果保存在 `../results/`，运行状态保存在 `../run.json`。',
    '',
  ].join('\n');
}

export async function writeWorkflowRun(exec: RunExec, home: string, run: WorkflowRun): Promise<void> {
  const safeDir = resolveWorkflowRunDir(home, run.runDir);
  if (!safeDir) throw new Error('非法流程运行目录');
  await exec(atomicJsonCommand(`${safeDir}/run.json`, run), 20_000);
}

export async function readWorkflowRun(exec: RunExec, home: string, runDir: string): Promise<WorkflowRun> {
  const safeDir = resolveWorkflowRunDir(home, runDir);
  if (!safeDir) throw new Error('非法流程运行目录');
  const raw = await exec(`cat ${shq(`${safeDir}/run.json`)}`, 15_000);
  const parsed = JSON.parse(raw) as WorkflowRun;
  if (!parsed || !parsed.runId || !Array.isArray(parsed.steps)) throw new Error('运行记录格式无效');
  parsed.runDir = safeDir;
  parsed.revision = Number.isInteger(parsed.revision) ? parsed.revision : 0;
  return parsed;
}

function markdownCell(value: unknown): string {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ').trim();
}

/** 不调用模型，直接从已验证的运行证据生成轻量报告，避免额外 Token。 */
export function buildWorkflowRunSummary(run: WorkflowRun): string {
  const stepRows = run.steps.map(step => [
    step.n,
    markdownCell(step.title),
    step.status,
    markdownCell(step.summary || ''),
    markdownCell((step.outputs || []).join('、')),
    step.qc?.status || '',
  ].join(' | '));
  return [
    `# ${run.workflowName} — 运行报告`,
    '',
    `- 运行 ID：\`${run.runId}\``,
    `- 状态：${run.status}`,
    `- 开始时间：${new Date(run.startedAt).toISOString()}`,
    `- 完成时间：${new Date(run.endedAt || run.updatedAt).toISOString()}`,
    `- 工作目录：\`${run.runDir}\``,
    '',
    '## 步骤与证据',
    '',
    '序号 | 步骤 | 状态 | 结果摘要 | 输出 | QC',
    '--- | --- | --- | --- | --- | ---',
    ...stepRows,
    '',
    '> 本报告由 HPClaw 根据 run.json 中已经验证的步骤状态、输出和 QC 证据自动生成，不额外调用 AI 模型。',
    '',
  ].join('\n');
}

export async function createWorkflowRun(
  exec: RunExec,
  home: string,
  workflow: Workflow,
  rawConfig: unknown,
  preflightReady?: boolean,
  deploy?: CreateRunDeployContext,
): Promise<WorkflowRun> {
  const now = Date.now();
  const slug = workflowSlug(workflow.name);
  const runId = `${slug}-${formatRunStamp(now)}-${crypto.randomBytes(2).toString('hex')}`;
  const runDir = `${home.replace(/\/+$/, '')}/hpclaw_flows/${slug}/03_workspace/runs/${runId}`;
  const codeDir = `${runDir}/code`;
  const config = sanitizeRunConfig(rawConfig);
  const stepScripts = workflow.steps.map((_step, index) =>
    buildWorkflowStepScript(workflow, config, index + 1, runDir));
  const run: WorkflowRun = {
    runId,
    workflowId: workflow.id,
    workflowName: workflow.name,
    workflowVersion: workflow.updatedAt,
    revision: 1,
    runDir,
    codeDir,
    workspacePolicy: 'isolated-run-v1',
    status: preflightReady === false ? 'blocked_env' : 'running',
    startedAt: now,
    updatedAt: now,
    heartbeatAt: now,
    currentStep: 0,
    totalSteps: workflow.steps.length,
    config,
    steps: workflow.steps.map((step, index) => ({
      n: index + 1,
      stepId: `step-${String(index + 1).padStart(2, '0')}`,
      title: step.title,
      status: config.skippedSteps.includes(index + 1) ? 'skipped' : 'pending',
      scriptPath: workflowStepScriptPath(runDir, index + 1),
      scriptUpdatedAt: now,
      scriptUserModified: false,
      scriptHash: contentHash(stepScripts[index]),
    })),
  };

  const safeDir = resolveWorkflowRunDir(home, runDir);
  if (!safeDir) throw new Error('无法创建流程运行目录');
  const commands = [
    `mkdir -p ${shq(codeDir)} ${shq(`${safeDir}/logs`)} ${shq(`${safeDir}/results`)}`,
    atomicTextCommand(`${codeDir}/README.md`, buildCodeReadme(workflow, safeDir)),
    ...workflow.steps.map((_step, index) => atomicTextCommand(
      workflowStepScriptPath(safeDir, index + 1),
      stepScripts[index],
    )),
    `chmod u+x ${shq(codeDir)}/step-*.sh`,
    atomicJsonCommand(`${safeDir}/config.json`, config),
    atomicJsonCommand(`${safeDir}/workspace.json`, {
      policy: 'isolated-run-v1',
      writableRoot: safeDir,
      allowedReadPaths: [...config.inputs, ...Object.values(config.referenceOverrides)],
      createdAt: now,
    }),
    atomicJsonCommand(`${safeDir}/workflow.snapshot.json`, workflow),
    atomicJsonCommand(`${safeDir}/run.json`, run),
    `mkdir -p ${shq(`${home.replace(/\/+$/, '')}/hpclaw_flows/.hpclaw`)}`,
    `printf '%s\\n' ${shq(safeDir)} >> ${shq(`${home.replace(/\/+$/, '')}/hpclaw_flows/.hpclaw/run-index.txt`)}`,
  ];
  await exec(commands.join('\n'), 30_000);

  // 流程资产自动部署（如 wheatomics.py）：创建 RUN 即就位，避免 Agent 满世界找脚本
  // 空转几十步（v0.2.2 用户实测踩中）。部署失败不阻断 RUN 创建，步骤执行时如实暴露。
  if (deploy?.sftp && Array.isArray(workflow.assets) && workflow.assets.length > 0) {
    for (const asset of workflow.assets) {
      try {
        const localPath = resolveAssetLocalPath(asset.source);
        const remote = `${safeDir}/${String(asset.remotePath || path.basename(asset.source))}`;
        await exec(`mkdir -p ${shq(path.posix.dirname(remote))}`, 15_000);
        await new Promise<void>((resolve, reject) => {
          deploy.sftp!.fastPut(localPath, remote, err => (err ? reject(err) : resolve()));
        });
      } catch (err) {
        console.warn('[workflow] 资产部署失败 %s: %s', asset.source, err instanceof Error ? err.message : String(err));
      }
    }
  }
  return run;
}

export interface WorkflowStepCode {
  run: WorkflowRun;
  step: WorkflowRun['steps'][number];
  codeDir: string;
  scriptPath: string;
  content: string;
}

export async function readWorkflowStepCode(
  exec: RunExec,
  home: string,
  runDir: string,
  stepNumber: number,
): Promise<WorkflowStepCode> {
  const run = await readWorkflowRun(exec, home, runDir);
  const step = run.steps.find(item => item.n === stepNumber);
  if (!step) throw new Error(`步骤不存在: ${stepNumber}`);
  const scriptPath = workflowStepScriptPath(run.runDir, stepNumber);
  const content = await exec(
    `if [ -f ${shq(scriptPath)} ]; then head -c 200000 ${shq(scriptPath)}; else printf %s ${shq('步骤脚本不存在')}; exit 2; fi`,
    15_000,
  );
  return { run, step, codeDir: `${run.runDir}/code`, scriptPath, content };
}

export async function writeWorkflowStepCode(
  exec: RunExec,
  home: string,
  runDir: string,
  stepNumber: number,
  rawContent: unknown,
): Promise<WorkflowStepCode> {
  const content = String(rawContent ?? '').replace(/\0/g, '');
  if (!content.trim()) throw new Error('步骤脚本不能为空');
  if (Buffer.byteLength(content, 'utf8') > 200_000) throw new Error('步骤脚本不能超过 200 KB');
  const safeDir = resolveWorkflowRunDir(home, runDir);
  if (!safeDir) throw new Error('非法流程运行目录');
  return withRunUpdateLock(safeDir, async () => {
    const run = await readWorkflowRun(exec, home, safeDir);
    const step = run.steps.find(item => item.n === stepNumber);
    if (!step) throw new Error(`步骤不存在: ${stepNumber}`);
    if (step.status === 'running' || step.status === 'done' || step.status === 'skipped' || (step.jobIds?.length || 0) > 0) {
      throw new Error('该步骤已经运行或提交，不能直接修改脚本；请创建新的运行或按失败重试流程生成修订。');
    }
    const scriptPath = workflowStepScriptPath(run.runDir, stepNumber);
    await exec(`${atomicTextCommand(scriptPath, content)} && chmod u+x ${shq(scriptPath)}`, 20_000);
    const now = Date.now();
    step.scriptPath = scriptPath;
    step.scriptUpdatedAt = now;
    step.scriptUserModified = true;
    step.scriptHash = contentHash(content);
    run.codeDir = `${run.runDir}/code`;
    run.updatedAt = now;
    run.heartbeatAt = now;
    run.revision = (run.revision || 0) + 1;
    await writeWorkflowRun(exec, home, run);
    return { run, step, codeDir: run.codeDir, scriptPath, content };
  });
}

function cleanStringList(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map(String).map(s => s.trim()).filter(Boolean).slice(0, 200);
}

export async function updateWorkflowRun(
  exec: RunExec,
  home: string,
  runDir: string,
  patch: WorkflowRunPatch,
): Promise<WorkflowRun> {
  const safeDir = resolveWorkflowRunDir(home, runDir);
  if (!safeDir) throw new Error('非法流程运行目录');
  return withRunUpdateLock(safeDir, async () => {
  const run = await readWorkflowRun(exec, home, safeDir);
  if (Number.isInteger(patch.expectedRevision) && patch.expectedRevision !== run.revision) {
    throw new Error(`流程状态已被其他操作更新（期望 revision ${patch.expectedRevision}，当前 ${run.revision}），请刷新后重试`);
  }
  const now = Date.now();

  if (patch.status && RUN_STATUSES.has(patch.status)) run.status = patch.status;
  if (patch.status === 'running' || patch.status === 'waiting_user' || patch.status === 'waiting_jobs' || patch.status === 'blocked_env') {
    delete run.endedAt;
  }
  if (Number.isInteger(patch.currentStep) && Number(patch.currentStep) >= 0 && Number(patch.currentStep) <= run.totalSteps) {
    run.currentStep = Number(patch.currentStep);
  }
  if (typeof patch.error === 'string') run.error = patch.error.slice(0, 4000);
  if (typeof patch.reportPath === 'string') run.reportPath = patch.reportPath.slice(0, 2000);

  if (patch.step && Number.isInteger(patch.step.n)) {
    const step = run.steps.find(s => s.n === patch.step!.n);
    if (!step) throw new Error(`步骤不存在: ${patch.step.n}`);
    if (patch.step.status && STEP_STATUSES.has(patch.step.status)) {
      assertWorkflowStepTransition(step.status, patch.step.status);
      if (patch.step.status === 'running') {
        const unfinishedPrevious = run.steps.find(s => s.n < step.n && s.status !== 'done' && s.status !== 'skipped');
        if (unfinishedPrevious) throw new Error(`前置步骤 ${unfinishedPrevious.n} 尚未完成，不能启动步骤 ${step.n}`);
      }
      const completionSummary = typeof patch.step.summary === 'string' ? patch.step.summary.trim() : step.summary?.trim();
      if (patch.step.status === 'done' && !completionSummary) {
        throw new Error(`步骤 ${step.n} 完成时必须提供基于真实输出的 summary`);
      }
      const completionEvidence = [
        ...(Array.isArray(patch.step.evidence) ? patch.step.evidence : step.evidence || []),
        ...(Array.isArray(patch.step.outputs) ? patch.step.outputs : step.outputs || []),
        ...(Array.isArray(patch.step.jobIds) ? patch.step.jobIds : step.jobIds || []),
        ...(patch.step.qc || step.qc ? ['QC'] : []),
      ].map(String).map(item => item.trim()).filter(Boolean);
      if (patch.step.status === 'done' && completionEvidence.length === 0) {
        throw new Error(`步骤 ${step.n} 完成时必须提供命令、日志、输出文件、作业号或 QC 证据`);
      }
      step.status = patch.step.status;
    }
    if (typeof patch.step.summary === 'string') step.summary = patch.step.summary.slice(0, 8000);
    const jobIds = cleanStringList(patch.step.jobIds);
    if (jobIds) step.jobIds = jobIds.filter(id => /^\d+(?:[._]\d+)?$/.test(id));
    const outputs = cleanStringList(patch.step.outputs);
    if (outputs) step.outputs = outputs;
    const evidence = cleanStringList(patch.step.evidence);
    if (evidence) step.evidence = evidence.map(item => item.slice(0, 4000));
    if (patch.step.qc && ['pass', 'warn', 'fail'].includes(patch.step.qc.status)) {
      step.qc = {
        status: patch.step.qc.status,
        metrics: patch.step.qc.metrics ? cleanRecord(patch.step.qc.metrics) : undefined,
      };
    }
    if (step.status === 'running') {
      step.startedAt ??= now;
      step.submittedScriptHash ??= step.scriptHash;
      run.currentStep = step.n;
      if (run.status !== 'blocked_env') run.status = 'running';
    }
    if (step.status === 'done' || step.status === 'failed' || step.status === 'skipped') step.finishedAt ??= now;
    if (step.status === 'failed') {
      run.status = 'failed';
      run.endedAt = now;
    }
  }

  if (run.status === 'done' || run.status === 'failed' || run.status === 'cancelled') run.endedAt ??= now;
  if (run.steps.length > 0 && run.steps.every(s => s.status === 'done' || s.status === 'skipped')) {
    run.status = 'done';
    run.currentStep = run.totalSteps;
    run.endedAt ??= now;
  }
  if (patch.status === 'done' && run.steps.some(s => s.status !== 'done' && s.status !== 'skipped')) {
    throw new Error('仍有未完成步骤，不能把整个流程标记为 done');
  }
  if (run.status === 'done' && !run.reportPath) {
    const reportPath = `${safeDir}/results/run-summary.md`;
    try {
      await exec(`mkdir -p ${shq(`${safeDir}/results`)} && ${atomicTextCommand(reportPath, buildWorkflowRunSummary(run))}`, 20_000);
      run.reportPath = reportPath;
    } catch {
      // 报告生成失败不能反向抹掉已经验证完成的流程；运行记录仍会正常落盘。
    }
  }
  run.updatedAt = now;
  run.heartbeatAt = now;
  run.revision = (run.revision || 0) + 1;
  await writeWorkflowRun(exec, home, run);
  return run;
  });
}
