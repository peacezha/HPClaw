import { describe, expect, it } from 'vitest';
import { parseSqueueOutput } from '../ai/clusterContext';
import {
  parseProcessesOutput, parseJobsOutput, lsfOutputTailCommand, slurmOutputTailCommand,
} from './scheduler';

describe('parseSqueueOutput', () => {
  it('解析管道分隔的 squeue 输出', () => {
    const jobs = parseSqueueOutput('12345|my-job|RUNNING|gpu|12:34\n');
    expect(jobs).toEqual([
      { jobId: '12345', name: 'my-job', status: 'RUN', cores: 0, queue: 'gpu', runtime: '12:34' },
    ]);
  });

  it('RUNNING → RUN，PENDING/CONFIGURING/SUSPENDED → PEND', () => {
    expect(parseSqueueOutput('1|a|RUNNING|p|0:01')[0]?.status).toBe('RUN');
    expect(parseSqueueOutput('2|a|PENDING|p|0:00')[0]?.status).toBe('PEND');
    expect(parseSqueueOutput('3|a|CONFIGURING|p|0:00')[0]?.status).toBe('PEND');
    expect(parseSqueueOutput('4|a|SUSPENDED|p|1:00')[0]?.status).toBe('PEND');
  });

  it('COMPLETED → DONE，FAILED/CANCELLED/TIMEOUT 等 → EXIT', () => {
    expect(parseSqueueOutput('5|a|COMPLETED|p|2:00')[0]?.status).toBe('DONE');
    for (const s of ['FAILED', 'CANCELLED', 'TIMEOUT', 'NODE_FAIL', 'PREEMPTED', 'OUT_OF_MEMORY']) {
      expect(parseSqueueOutput(`6|a|${s}|p|0:10`)[0]?.status).toBe('EXIT');
    }
  });

  it('未知状态 → UNKNOWN', () => {
    expect(parseSqueueOutput('7|a|REQUEUE|p|0:00')[0]?.status).toBe('UNKNOWN');
  });

  it('空输出与空行 → []', () => {
    expect(parseSqueueOutput('')).toEqual([]);
    expect(parseSqueueOutput('\n\n')).toEqual([]);
  });

  it('作业名含空格也能按管道正确解析', () => {
    const jobs = parseSqueueOutput('9|train model v2|RUNNING|cpu|1-02:03:04');
    expect(jobs[0]?.name).toBe('train model v2');
    expect(jobs[0]?.runtime).toBe('1-02:03:04');
  });
});

describe('parseJobsOutput', () => {
  it('slurm 走 squeue 解析', () => {
    expect(parseJobsOutput('slurm', '1|a|RUNNING|p|0:01')[0]?.status).toBe('RUN');
  });

  it('lsf 走 bjobs 解析', () => {
    const raw = 'JOBID USER STAT QUEUE FROM_HOST EXEC_HOST JOB_NAME SUBMIT_TIME\n101 u RUN normal h n1 myjob Jan 1\n';
    const jobs = parseJobsOutput('lsf', raw);
    expect(jobs[0]?.jobId).toBe('101');
    expect(jobs[0]?.status).toBe('RUN');
    expect(jobs[0]?.name).toBe('myjob');
  });
});

describe('parseProcessesOutput', () => {
  const header = '    PID STAT ELAPSED %CPU %MEM COMMAND';

  it('跳过表头并解析各字段', () => {
    const raw = `${header}\n  1234 R+   02:11:03 85.0 12.3 python train.py --epochs 10\n  2345 Ss   00:05    0.0  0.1  bash\n`;
    const procs = parseProcessesOutput(raw);
    expect(procs).toHaveLength(2);
    expect(procs[0]).toEqual({
      pid: '1234', stat: 'R+', etime: '02:11:03', cpu: '85.0', mem: '12.3',
      command: 'python train.py --epochs 10',
    });
    expect(procs[1]?.pid).toBe('2345');
    expect(procs[1]?.command).toBe('bash');
  });

  it('空输出与仅表头 → []', () => {
    expect(parseProcessesOutput('')).toEqual([]);
    expect(parseProcessesOutput(header + '\n')).toEqual([]);
  });

  it('超长命令截断到 120 字符', () => {
    const longCmd = 'x'.repeat(200);
    const procs = parseProcessesOutput(`${header}\n  1 R 00:01 1.0 0.1 ${longCmd}\n`);
    expect(procs[0]?.command).toHaveLength(121); // 120 + 省略号
    expect(procs[0]?.command.endsWith('…')).toBe(true);
  });
});

describe('输出尾部摘要命令', () => {
  it('lsf 用 bpeek 取尾部 30 行，非法作业号降级为 false', () => {
    expect(lsfOutputTailCommand('424242')).toBe('bpeek 424242 2>/dev/null | tail -n 30');
    expect(lsfOutputTailCommand('123.4')).toBe('bpeek 123.4 2>/dev/null | tail -n 30');
    expect(lsfOutputTailCommand('1;rm -rf /')).toBe('false');
    expect(lsfOutputTailCommand('')).toBe('false');
  });

  it('slurm 读默认输出文件尾部 30 行，非法作业号降级为 false', () => {
    expect(slurmOutputTailCommand('7890')).toBe('tail -q -n 30 "slurm-7890.out" "$HOME/slurm-7890.out" 2>/dev/null');
    expect(slurmOutputTailCommand('abc')).toBe('false');
  });
});
