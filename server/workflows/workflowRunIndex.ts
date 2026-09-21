import type { WorkflowRun } from '../../shared/workflowRun';
import { resolveWorkflowRunDir, type RunExec } from './workflowRunService';

const MAX_INDEXED_RUNS = 100;

function shq(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

function indexFile(home: string): string {
  return `${home.replace(/\/+$/, '')}/hpclaw_flows/.hpclaw/run-index.txt`;
}

export function appendWorkflowRunIndexCommand(home: string, runDir: string): string {
  const file = indexFile(home);
  const dir = file.replace(/\/[^/]+$/, '');
  return `mkdir -p ${shq(dir)} && printf '%s\\n' ${shq(runDir)} >> ${shq(file)}`;
}

export async function readWorkflowRunIndex(exec: RunExec, home: string, limit = MAX_INDEXED_RUNS): Promise<string[]> {
  const bounded = Math.max(1, Math.min(MAX_INDEXED_RUNS, limit));
  const raw = await exec(`tail -n ${bounded * 2} ${shq(indexFile(home))} 2>/dev/null || true`, 10_000);
  const seen = new Set<string>();
  const dirs: string[] = [];
  for (const line of raw.split(/\r?\n/).reverse()) {
    const safe = resolveWorkflowRunDir(home, line.trim());
    if (!safe || seen.has(safe)) continue;
    seen.add(safe);
    dirs.push(safe);
    if (dirs.length >= bounded) break;
  }
  return dirs;
}

export async function readIndexedWorkflowRuns(exec: RunExec, home: string, limit = 20): Promise<WorkflowRun[]> {
  const dirs = await readWorkflowRunIndex(exec, home, Math.max(limit, 20));
  if (dirs.length === 0) return [];
  const command = dirs.map(dir => (
    `if [ -f ${shq(`${dir}/run.json`)} ]; then ` +
    `echo ${shq(`===RUN:${dir}===`)}; head -c 65536 ${shq(`${dir}/run.json`)}; echo; fi`
  )).join('\n');
  const raw = await exec(command, 20_000);
  const runs: WorkflowRun[] = [];
  const sectionRe = /===RUN:(.+?)===\r?\n([\s\S]*?)(?====RUN:|$)/g;
  let match: RegExpExecArray | null;
  while ((match = sectionRe.exec(raw)) !== null) {
    try {
      const parsed = JSON.parse(match[2].trim()) as WorkflowRun;
      const safeDir = resolveWorkflowRunDir(home, match[1].trim());
      if (safeDir && parsed?.runId && Array.isArray(parsed.steps)) runs.push({ ...parsed, runDir: safeDir });
    } catch { /* 单条损坏不影响其他已索引运行 */ }
  }
  return runs.slice(0, limit);
}

/** 用户明确点击“导入历史运行”时才执行目录发现；正常列表永不使用 glob。 */
export async function importLegacyWorkflowRunIndex(exec: RunExec, home: string): Promise<number> {
  const file = indexFile(home);
  const dir = file.replace(/\/[^/]+$/, '');
  const raw = await exec(
    `for f in ${shq(`${home}/hpclaw_flows`)}/*/03_workspace/runs/*/run.json; do ` +
    `[ -f "$f" ] && dirname "$f"; done 2>/dev/null | tail -n ${MAX_INDEXED_RUNS}`,
    20_000,
  );
  const dirs = [...new Set(raw.split(/\r?\n/)
    .map(item => resolveWorkflowRunDir(home, item.trim()))
    .filter((item): item is string => Boolean(item)))];
  const payload = dirs.map(item => `${item}\n`).join('');
  const encoded = Buffer.from(payload, 'utf8').toString('base64');
  await exec(`mkdir -p ${shq(dir)} && printf %s ${shq(encoded)} | base64 -d > ${shq(file)}`, 15_000);
  return dirs.length;
}
