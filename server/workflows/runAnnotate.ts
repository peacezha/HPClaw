// 流程运行的"僵尸/停顿"判定：run.json 由 AI 维护，AI 中断或忘记收尾时
// 运行会永远显示"运行中"。这里在服务端做客观判定——
// 活动状态超过阈值未更新（含心跳）即标记 stalled，并可用 bjobs 核实作业真实状态。

export const STALE_AFTER_MS = 10 * 60 * 1000; // 10 分钟无更新视为停顿

const ACTIVE_STATUSES = new Set(['running', 'waiting_user', 'waiting_jobs', 'blocked_env']);

export interface RawRun {
  runDir: string;
  status?: string;
  updatedAt?: number;
  startedAt?: number;
  heartbeatAt?: number;
  endedAt?: number;
  stale?: boolean;
  displayStatus?: string;
  jobStates?: Record<string, string>;
  currentStep?: number;
  totalSteps?: number;
  steps?: Array<{
    n?: number;
    status?: string;
    jobIds?: string[];
    startedAt?: number;
    finishedAt?: number;
  }>;
  [key: string]: unknown;
}

/** 单个运行是否停顿（活动状态且超过阈值无心跳/更新） */
export function isStaleRun(run: RawRun, now = Date.now()): boolean {
  if (!ACTIVE_STATUSES.has(String(run.status))) return false;
  const last = run.heartbeatAt || run.updatedAt || run.startedAt || 0;
  if (!last) return true; // 活动状态但完全没时间戳：异常，按停顿处理
  return now - last > STALE_AFTER_MS;
}

/** 给运行列表打上 stale/displayStatus 标记 */
export function annotateRuns<T extends RawRun>(runs: T[], now = Date.now()): T[] {
  return runs.map(r => (isStaleRun(r, now) ? { ...r, stale: true, displayStatus: 'stalled' } : r));
}

/** 收集所有停顿运行中的 LSF 作业号（用于一次 bjobs 核实） */
export function collectStaleJobIds(runs: RawRun[]): string[] {
  const ids = new Set<string>();
  for (const run of runs) {
    if (!run.stale) continue;
    for (const step of run.steps || []) {
      for (const id of step.jobIds || []) {
        if (/^\d+$/.test(id)) ids.add(id);
      }
    }
  }
  return [...ids].slice(0, 50);
}

/** 解析 `bjobs -noheader -o "jobid stat"` 输出为 jobid → 状态 */
export function parseBjobsStates(raw: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const line of raw.split(/\r?\n/)) {
    const m = line.trim().match(/^(\d+)(?:[._]\S+)?\s+(\w+)/);
    if (m) map.set(m[1], m[2]);
  }
  return map;
}

/** 收集所有活动运行的调度器作业号，供每轮监控主动核对真实状态。 */
export function collectActiveJobIds(runs: RawRun[]): string[] {
  const ids = new Set<string>();
  for (const run of runs) {
    if (!ACTIVE_STATUSES.has(String(run.status))) continue;
    for (const step of run.steps || []) {
      for (const id of step.jobIds || []) {
        if (/^\d+(?:[._]\d+)?$/.test(id)) ids.add(id);
      }
    }
  }
  return [...ids].slice(0, 100);
}

const ACTIVE_JOB_STATES = new Set(['RUN', 'RUNNING', 'PEND', 'PENDING', 'PSUSP', 'USUSP', 'SSUSP', 'CONFIGURING']);
const DONE_JOB_STATES = new Set(['DONE', 'COMPLETED']);
const FAILED_JOB_STATES = new Set(['EXIT', 'FAILED', 'CANCELLED', 'TIMEOUT', 'OUT_OF_MEMORY', 'NODE_FAIL', 'PREEMPTED']);

/**
 * 用调度器的客观状态修正运行时间线。AI 仍负责产物总结与 QC，
 * 但作业是否运行/成功/失败不再依赖 AI 手写 run.json。
 */
export function reconcileRunsWithScheduler<T extends RawRun>(
  runs: T[],
  states: Map<string, string>,
  now = Date.now(),
): T[] {
  return runs.map(original => {
    if (!ACTIVE_STATUSES.has(String(original.status))) return original;
    let changed = false;
    let hasActiveJob = false;
    let completedJobStep = false;
    let runFailed = false;
    const jobStates: Record<string, string> = {};
    const steps = (original.steps || []).map(step => {
      const ids = step.jobIds || [];
      if (ids.length === 0) return step;
      const known = ids.map(id => states.get(id)).filter((s): s is string => !!s).map(s => s.toUpperCase().split(/[+\s]/)[0]);
      ids.forEach(id => { jobStates[id] = states.get(id) || 'UNKNOWN'; });
      if (known.length === 0) return step;
      if (known.some(s => FAILED_JOB_STATES.has(s))) {
        runFailed = true;
        if (step.status !== 'failed') changed = true;
        return { ...step, status: 'failed', finishedAt: step.finishedAt || now };
      }
      if (known.some(s => ACTIVE_JOB_STATES.has(s))) {
        hasActiveJob = true;
        if (step.status !== 'running') changed = true;
        return { ...step, status: 'running', startedAt: step.startedAt || now };
      }
      if (known.length === ids.length && known.every(s => DONE_JOB_STATES.has(s))) {
        completedJobStep = true;
        // 调度器 DONE 只证明作业进程结束，不证明预期输出和 QC 合格。
        // 保持步骤 running，交给自动恢复的 Agent 验收后再写 done+证据。
        if (step.status !== 'running' || step.finishedAt) changed = true;
        return { ...step, status: 'running', finishedAt: undefined };
      }
      return step;
    });
    const next: RawRun = { ...original, steps };
    if (Object.keys(jobStates).length > 0) next.jobStates = jobStates;
    if (hasActiveJob) next.heartbeatAt = now;
    if (runFailed) {
      next.status = 'failed';
      next.endedAt = original.endedAt || now;
      next.updatedAt = now;
      changed = true;
    } else if (steps.length > 0 && steps.every(s => s.status === 'done' || s.status === 'skipped')) {
      next.status = 'done';
      next.currentStep = original.totalSteps || steps.length;
      next.endedAt = original.endedAt || now;
      next.updatedAt = now;
      changed = true;
    } else if (!hasActiveJob && completedJobStep && original.status === 'waiting_jobs') {
      next.status = 'waiting_user';
      next.error = '调度器作业已完成，正在等待 Agent 验收输出和 QC；尚未将任务标记为完成。';
      next.updatedAt = now;
      changed = true;
    } else {
      const runningStep = steps.find(s => s.status === 'running');
      if (runningStep?.n && original.currentStep !== runningStep.n) {
        next.currentStep = runningStep.n;
        next.updatedAt = now;
        changed = true;
      }
    }
    return (changed || Object.keys(jobStates).length > 0 || hasActiveJob ? next : original) as T;
  });
}

/** 把 bjobs 核实结果挂到停顿运行上（未出现在 bjobs 输出中的作业记为 GONE，即已结束被清理） */
export function attachJobStates<T extends RawRun>(runs: T[], states: Map<string, string>): T[] {
  return runs.map(run => {
    if (!run.stale) return run;
    const jobStates: Record<string, string> = {};
    for (const step of run.steps || []) {
      for (const id of step.jobIds || []) {
        jobStates[id] = states.get(id) || 'GONE';
      }
    }
    return Object.keys(jobStates).length > 0 ? { ...run, jobStates } : run;
  });
}
