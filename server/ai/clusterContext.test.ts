import { describe, expect, it } from 'vitest';
import { clusterContext, parseLsOutput, parseBjobsOutput } from './clusterContext';

describe('默认集群快照边界', () => {
  it('standard 不再列举文件，只有显式 full 才允许递归内容', () => {
    expect(clusterContext.buildSnapshotCommand('standard')).not.toMatch(/\bls\b|\bfind\b/);
    expect(clusterContext.buildSnapshotCommand('full')).toContain('ls -lhR');
  });
});

describe('parseLsOutput', () => {
  it('解析 long-iso 格式（--time-style=long-iso，8 列）', () => {
    const raw = `total 84G
-rw-rw-r--+  1 hpzhang WHYan 1.5M 2026-05-24 14:00 00C3750B10DFEF993FD23E1D1ADD85CD.png
drwxr-xr-x+  4 hpzhang WHYan 4.0K 2025-02-19 15:26 0218allsnp
-rw-rw-r--+  1 hpzhang WHYan 2.1K 2026-06-18 02:06 minimap.out
`;
    const entries = parseLsOutput(raw);
    expect(entries).toHaveLength(3);
    expect(entries[0].name).toBe('00C3750B10DFEF993FD23E1D1ADD85CD.png');
    expect(entries[0].type).not.toBe('directory');
    expect(entries[1].name).toBe('0218allsnp');
    expect(entries[1].type).toBe('directory');
    expect(entries[2].name).toBe('minimap.out');
  });

  it('解析标准 ls -l 格式（9 列）', () => {
    const raw = `total 20
-rw-rw-r--  1 hpzhang WHYan 1.5M May 24 14:00 reads_1.fq.gz
drwxr-xr-x  4 hpzhang WHYan 4.0K Feb 19  2025 data
`;
    const entries = parseLsOutput(raw);
    expect(entries).toHaveLength(2);
    expect(entries[0].name).toBe('reads_1.fq.gz');
    expect(entries[1].type).toBe('directory');
  });

  it('文件名带空格时保留完整名称', () => {
    const raw = `-rw-rw-r--+  1 hpzhang WHYan 1.5K 2026-05-24 14:00 my report file.txt
`;
    const entries = parseLsOutput(raw);
    expect(entries[0]?.name).toBe('my report file.txt');
  });

  it('空输出/无有效行返回空数组', () => {
    expect(parseLsOutput('')).toHaveLength(0);
    expect(parseLsOutput('total 0\n')).toHaveLength(0);
  });
});

describe('parseBjobsOutput', () => {
  const header = 'JOBID   USER    STAT  QUEUE      FROM_HOST   EXEC_HOST   JOB_NAME   SUBMIT_TIME';

  it('解析常规 bjobs -w 输出', () => {
    const raw = `${header}
123456  hpzhang RUN   normal     node01      node02      blast_job  Jul 21 14:04
123457  hpzhang PEND  smp        node01                  qc_job     Jul 21 14:05
`;
    const jobs = parseBjobsOutput(raw);
    expect(jobs).toHaveLength(2);
    expect(jobs[0]).toMatchObject({ jobId: '123456', status: 'RUN', queue: 'normal', name: 'blast_job' });
    expect(jobs[1]).toMatchObject({ jobId: '123457', status: 'PEND', queue: 'smp', name: 'qc_job' });
  });

  it('EXEC_HOST 含空格的并行作业不错位', () => {
    // 真实 bjobs -w 中 EXEC_HOST 列会被最宽单元格撑开，表头位置同步后移
    const wideHeader = 'JOBID   USER    STAT  QUEUE      FROM_HOST   EXEC_HOST           JOB_NAME   SUBMIT_TIME';
    const raw = `${wideHeader}
123458  hpzhang RUN   parallel   node01      8*node02 2*node03   mpi_job    Jul 21 15:00
`;
    const jobs = parseBjobsOutput(raw);
    expect(jobs[0]).toMatchObject({ jobId: '123458', status: 'RUN', queue: 'parallel', name: 'mpi_job' });
  });

  it('JOB_NAME 含空格时保留完整名称', () => {
    const raw = `${header}
123459  hpzhang RUN   normal     node01      node02      my job name Jul 21 15:30
`;
    const jobs = parseBjobsOutput(raw);
    expect(jobs[0]?.name).toBe('my job name');
    expect(jobs[0]?.status).toBe('RUN');
  });

  it('空列（EXEC_HOST 为空）不导致后续字段左移', () => {
    const raw = `${header}
123460  hpzhang PEND  normal     node01                  wait_job   Jul 21 16:00
`;
    const jobs = parseBjobsOutput(raw);
    expect(jobs[0]).toMatchObject({ jobId: '123460', status: 'PEND', queue: 'normal', name: 'wait_job' });
  });

  it('无作业/表头异常时不报错', () => {
    expect(parseBjobsOutput('')).toHaveLength(0);
    expect(parseBjobsOutput('No unfinished job found')).toHaveLength(0);
    expect(parseBjobsOutput('garbage\n1 2 3\n')[0]?.jobId).toBe('1');
  });
});
