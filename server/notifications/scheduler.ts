// 调度器配置与采集：LSF / Slurm 命令映射、输出解析、当前用户进程采集。
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { dataPath } from '../paths';
import { parseBjobsOutput, parseSqueueOutput } from '../ai/clusterContext';
import type { JobEntry } from '../ai/types';
import type { SchedulerKind } from '../cluster/schedulerProfile';

// 兼容旧名；现在覆盖 lsf / slurm / pbs / none
export type SchedulerType = SchedulerKind;

const CONFIG_PATH = dataPath('scheduler-config.json');
const DEFAULT_SCHEDULER: SchedulerType = 'lsf';

export async function loadSchedulerType(): Promise<SchedulerType> {
  try {
    const raw = await fs.readFile(CONFIG_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return normalizeScheduler(parsed?.scheduler);
  } catch {
    return DEFAULT_SCHEDULER;
  }
}

function normalizeScheduler(value: unknown): SchedulerType {
  return value === 'slurm' || value === 'pbs' || value === 'none' ? value : 'lsf';
}

export async function saveSchedulerType(scheduler: SchedulerType): Promise<void> {
  await fs.mkdir(path.dirname(CONFIG_PATH), { recursive: true });
  const tmp = `${CONFIG_PATH}.tmp`;
  await fs.writeFile(tmp, JSON.stringify({ scheduler }, null, 2), 'utf-8');
  await fs.rename(tmp, CONFIG_PATH);
}

const JOBS_COMMANDS: Record<SchedulerType, string> = {
  lsf: 'bjobs -w 2>/dev/null',
  // 管道分隔避免空白切分问题；%M = 已运行时间
  slurm: 'squeue -u "$(whoami)" -o "%i|%j|%T|%P|%M" --noheader 2>/dev/null',
  // PBS/Torque 默认定宽表：JobID Name User TimeUse State Queue
  pbs: 'qstat -u "$(whoami)" 2>/dev/null',
  // 无调度器：只能按当前用户进程近似
  none: 'true',
};

export function jobsCommand(scheduler: SchedulerType): string {
  return JOBS_COMMANDS[scheduler];
}

/** PBS qstat 状态字母 → HPClaw 作业状态 */
function normalizePbsStatus(letter: string): JobEntry['status'] {
  const s = letter.trim().toUpperCase();
  if (s === 'R' || s === 'E') return 'RUN';
  if (s === 'Q' || s === 'H' || s === 'W' || s === 'T' || s === 'S') return 'PEND';
  if (s === 'C' || s === 'F') return 'DONE';
  return 'UNKNOWN';
}

export function parseQstatOutput(raw: string): JobEntry[] {
  return raw
    .split('\n')
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('-') && !/^job\s*id/i.test(l) && !/^job_id/i.test(l))
    .map(line => {
      const parts = line.split(/\s+/);
      return {
        jobId: (parts[0] ?? '').split('.')[0],
        name: parts[1] ?? parts[0] ?? '',
        status: normalizePbsStatus(parts[4] ?? ''),
        cores: 0,
        queue: parts[5] ?? '',
        runtime: parts[3] ?? '',
      };
    })
    .filter(j => j.jobId);
}

export function parseJobsOutput(scheduler: SchedulerType, raw: string): JobEntry[] {
  if (scheduler === 'slurm') return parseSqueueOutput(raw);
  if (scheduler === 'pbs') return parseQstatOutput(raw);
  if (scheduler === 'none') return [];
  return parseBjobsOutput(raw);
}

/** sacct 补查 Slurm 作业最终状态（squeue 中作业一结束即消失，无法区分成功/失败） */
export function slurmFinalStateCommand(jobId: string): string {
  // jobId 只可能是数字（来自 squeue %i），无注入风险
  return `sacct -j ${jobId} --format=State --noheader -X 2>/dev/null | head -1`;
}

/** PBS 作业离开 qstat 后补查：-x 含历史，Exit_status=0 判 DONE。 */
export function pbsFinalStateCommand(jobId: string): string {
  const safe = /^[\d._]+$/.test(jobId) ? jobId : '';
  return safe
    ? `qstat -x -f ${safe} 2>/dev/null | grep -E 'job_state|Exit_status' | tr '\\n' ' '`
    : 'false';
}

export function finalStateCommand(scheduler: SchedulerType, jobId: string): string {
  if (scheduler === 'slurm') return slurmFinalStateCommand(jobId);
  if (scheduler === 'pbs') return pbsFinalStateCommand(jobId);
  if (scheduler === 'none') return 'false';
  return lsfFinalStateCommand(jobId);
}

/** 各调度器的脚本提交命令；none 退化登录节点后台执行并回显 PID。 */
export function submitCommand(scheduler: SchedulerType, scriptPath: string): string {
  const safe = `'${scriptPath.replace(/'/g, `'\\''`)}'`;
  switch (scheduler) {
    case 'slurm': return `sbatch ${safe}`;
    case 'pbs': return `qsub ${safe}`;
    case 'none': return `nohup bash ${safe} > ${safe}.nohup.log 2>&1 & echo "NOHUP_PID:$!"`;
    default: return `bsub < ${safe}`;
  }
}

/** 流程模板的 #BSUB 指令翻译到目标调度器；none 直接剥掉。 */
export function translateSchedulerDirectives(script: string, target: SchedulerKind): string {
  if (target === 'lsf') return script;
  const lines = script.split('\n');
  const out: string[] = [];
  for (const line of lines) {
    const match = line.match(/^\s*#BSUB\s+(.+)$/);
    if (!match) {
      out.push(line);
      continue;
    }
    if (target === 'none') continue; // 无调度器：去掉调度指令
    const translated = translateBsubLine(match[1].trim(), target);
    if (translated) out.push(translated);
  }
  return out.join('\n');
}

function translateBsubLine(args: string, target: 'slurm' | 'pbs'): string | null {
  const tokens = args.split(/\s+/);
  const flag = tokens[0];
  const value = tokens.slice(1).join(' ');
  const one = (lsf: string, slurm: string, pbs: string) => (target === 'slurm' ? `#SBATCH ${slurm}` : `#PBS ${pbs}`);
  switch (flag) {
    case '-J': return one('-J', `--job-name=${value}`, `-N ${value.replace(/[^\w.-]/g, '_').slice(0, 60)}`);
    case '-n': return one('-n', `--ntasks=${value}`, `-l nodes=1:ppn=${value}`);
    case '-q': return one('-q', `--partition=${value}`, `-q ${value}`);
    case '-o': return one('-o', `--output=${value}`, `-o ${value}`);
    case '-e': return one('-e', `--error=${value}`, `-e ${value}`);
    case '-W': return one('-W', `--time=${value}`, `-l walltime=${/^\d+$/.test(value) ? `${value}:00` : value}`);
    case '-M': return one('-M', `--mem=${/\d/.test(value) && !/[A-Za-z]/.test(value) ? `${value}MB` : value}`, `-l mem=${value}`);
    case '-R': {
      const mem = /rusage\[mem=([\d.]+[A-Za-z]*)\]/.exec(value)?.[1];
      return mem ? one('-R', `--mem=${mem}`, `-l mem=${mem}`) : null;
    }
    default: return null; // 无法对应的指令丢弃（总比提交一个调度器不认识的脚本强）
  }
}

/** LSF 作业从默认 bjobs 列表消失后，用历史列表确认 DONE/EXIT。 */
export function lsfFinalStateCommand(jobId: string): string {
  // jobId 来自调度器解析或提交回执，只允许数字及数组任务分隔符。
  const safe = /^[\d._]+$/.test(jobId) ? jobId : '';
  return safe ? `bjobs -a -noheader -o stat ${safe} 2>/dev/null | head -1` : 'false';
}

/** LSF 作业输出尾部摘要：bpeek 对已结束作业仍可读；无输出时为空。 */
export function lsfOutputTailCommand(jobId: string): string {
  const safe = /^[\d._]+$/.test(jobId) ? jobId : '';
  return safe ? `bpeek ${safe} 2>/dev/null | tail -n 30` : 'false';
}

/** Slurm 默认输出文件（slurm-<jobId>.out）尾部摘要；自定义输出路径时查不到则留空。 */
export function slurmOutputTailCommand(jobId: string): string {
  const safe = /^[\d._]+$/.test(jobId) ? jobId : '';
  return safe ? `tail -q -n 30 "slurm-${safe}.out" "$HOME/slurm-${safe}.out" 2>/dev/null` : 'false';
}

export interface ProcessEntry {
  pid: string;
  stat: string;
  etime: string;
  cpu: string;
  mem: string;
  command: string;
}

export const PROCESSES_COMMAND =
  'ps -u "$(whoami)" -o pid,stat,etime,pcpu,pmem,args --sort=-pcpu 2>/dev/null | head -26';

export function parseProcessesOutput(raw: string): ProcessEntry[] {
  const lines = raw.split('\n');
  if (lines.length < 2) return [];
  return lines
    .slice(1)
    .filter(l => l.trim())
    .map(line => {
      const parts = line.trim().split(/\s+/);
      const command = parts.slice(5).join(' ');
      return {
        pid: parts[0] ?? '',
        stat: parts[1] ?? '',
        etime: parts[2] ?? '',
        cpu: parts[3] ?? '',
        mem: parts[4] ?? '',
        command: command.length > 120 ? `${command.slice(0, 120)}…` : command,
      };
    })
    .filter(p => p.pid);
}
