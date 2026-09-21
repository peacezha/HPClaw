// 调度器配置与采集：LSF / Slurm 命令映射、输出解析、当前用户进程采集。
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { dataPath } from '../paths';
import { parseBjobsOutput, parseSqueueOutput } from '../ai/clusterContext';
import type { JobEntry } from '../ai/types';

export type SchedulerType = 'lsf' | 'slurm';

const CONFIG_PATH = dataPath('scheduler-config.json');
const DEFAULT_SCHEDULER: SchedulerType = 'lsf';

export async function loadSchedulerType(): Promise<SchedulerType> {
  try {
    const raw = await fs.readFile(CONFIG_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return parsed?.scheduler === 'slurm' ? 'slurm' : 'lsf';
  } catch {
    return DEFAULT_SCHEDULER;
  }
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
};

export function jobsCommand(scheduler: SchedulerType): string {
  return JOBS_COMMANDS[scheduler];
}

export function parseJobsOutput(scheduler: SchedulerType, raw: string): JobEntry[] {
  return scheduler === 'slurm' ? parseSqueueOutput(raw) : parseBjobsOutput(raw);
}

/** sacct 补查 Slurm 作业最终状态（squeue 中作业一结束即消失，无法区分成功/失败） */
export function slurmFinalStateCommand(jobId: string): string {
  // jobId 只可能是数字（来自 squeue %i），无注入风险
  return `sacct -j ${jobId} --format=State --noheader -X 2>/dev/null | head -1`;
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
