import { describe, expect, it } from 'vitest';
import {
  annotateRuns, attachJobStates, collectActiveJobIds, collectStaleJobIds, isStaleRun,
  needsSchedulerStateQuery, parseBjobsStates, reconcileRunsWithScheduler, seedPersistedTerminalStates,
  STALE_AFTER_MS,
} from './runAnnotate';

const NOW = 1_800_000_000_000;

describe('isStaleRun 停顿判定', () => {
  it('活动状态超时无更新 → 停顿', () => {
    expect(isStaleRun({ runDir: 'a', status: 'running', updatedAt: NOW - STALE_AFTER_MS - 1 }, NOW)).toBe(true);
    expect(isStaleRun({ runDir: 'a', status: 'waiting_user', updatedAt: NOW - STALE_AFTER_MS - 1 }, NOW)).toBe(true);
    expect(isStaleRun({ runDir: 'a', status: 'waiting_jobs', updatedAt: NOW - STALE_AFTER_MS - 1 }, NOW)).toBe(true);
    expect(isStaleRun({ runDir: 'a', status: 'blocked_env', updatedAt: NOW - STALE_AFTER_MS - 1 }, NOW)).toBe(true);
  });

  it('心跳新鲜则不停顿；heartbeatAt 优先于 updatedAt', () => {
    expect(isStaleRun({ runDir: 'a', status: 'running', heartbeatAt: NOW - 1000, updatedAt: NOW - STALE_AFTER_MS * 2 }, NOW)).toBe(false);
    expect(isStaleRun({ runDir: 'a', status: 'running', updatedAt: NOW - 60_000 }, NOW)).toBe(false);
  });

  it('终态（done/failed）永不报停顿', () => {
    expect(isStaleRun({ runDir: 'a', status: 'done', updatedAt: NOW - 999_999_999 }, NOW)).toBe(false);
    expect(isStaleRun({ runDir: 'a', status: 'failed', updatedAt: NOW - 999_999_999 }, NOW)).toBe(false);
  });

  it('活动状态但完全无时间戳按停顿处理', () => {
    expect(isStaleRun({ runDir: 'a', status: 'running' }, NOW)).toBe(true);
  });
});

describe('annotateRuns / collectStaleJobIds', () => {
  it('停顿运行打标且收集作业号', () => {
    const runs = annotateRuns([
      { runDir: 'a', status: 'running', updatedAt: NOW - STALE_AFTER_MS - 1, steps: [{ jobIds: ['101', '102'] }, { jobIds: ['103'] }] },
      { runDir: 'b', status: 'done', updatedAt: NOW - 999_999 },
      { runDir: 'c', status: 'running', updatedAt: NOW - 1000 },
    ], NOW);
    expect(runs[0].stale).toBe(true);
    expect(runs[0].displayStatus).toBe('stalled');
    expect(runs[1].stale).toBeUndefined();
    expect(runs[2].stale).toBeUndefined();
    expect(collectStaleJobIds(runs)).toEqual(['101', '102', '103']);
  });
});

describe('parseBjobsStates / attachJobStates', () => {
  it('解析 bjobs 输出并把 GONE 标记给消失的作业', () => {
    const states = parseBjobsStates('101 DONE\n102 EXIT\n');
    expect(states.get('101')).toBe('DONE');
    const runs = attachJobStates([
      { runDir: 'a', status: 'running', stale: true, steps: [{ jobIds: ['101', '103'] }] },
      { runDir: 'b', status: 'running', stale: false, steps: [{ jobIds: ['102'] }] } as any,
    ], states);
    expect(runs[0].jobStates).toEqual({ '101': 'DONE', '103': 'GONE' });
    expect((runs[1] as any).jobStates).toBeUndefined();
  });
});

describe('调度器主动对账', () => {
  it('scheduler success cannot bypass a failed QC verdict or roll completed steps back to running', () => {
    const runs = [{
      runDir: 'qc', status: 'waiting_jobs', currentStep: 1, totalSteps: 2,
      steps: [
        { n: 1, title: 'QC', status: 'done', jobIds: ['100'], qc: { status: 'fail' } },
        { n: 2, status: 'running', jobIds: ['101'] },
      ],
    }];
    const result = reconcileRunsWithScheduler(runs, parseBjobsStates('100 DONE\n101 DONE\n'), NOW);
    expect(result[0].steps?.[0].status).toBe('done');
    expect(result[0].status).toBe('waiting_user');
    expect((result[0] as any).error).toContain('不建议继续');
    expect((result[0] as any).endedAt).toBeUndefined();
    const allDone = reconcileRunsWithScheduler([{ ...runs[0], steps: [runs[0].steps[0]] }], new Map(), NOW);
    expect(allDone[0].status).toBe('waiting_user');
  });
  it('an acknowledged failure does not block scheduler reconciliation but remains failed QC', () => {
    const result = reconcileRunsWithScheduler([{
      runDir: 'qc', status: 'waiting_jobs', currentStep: 1, totalSteps: 1,
      steps: [{ n: 1, status: 'done', qc: { status: 'fail' }, qcOverride: { approvedAt: 1000, revision: 4 } }],
    }], new Map(), NOW);
    expect(result[0].status).toBe('done');
    expect(result[0].steps?.[0].qc?.status).toBe('fail');
  });
  it('收集活动运行作业；DONE 等待 Agent 验收，EXIT 直接失败', () => {
    const runs = [
      { runDir: 'a', status: 'running', totalSteps: 1, currentStep: 1, steps: [{ n: 1, status: 'running', jobIds: ['101'] }] },
      { runDir: 'b', status: 'done', steps: [{ n: 1, status: 'done', jobIds: ['999'] }] },
    ];
    expect(collectActiveJobIds(runs)).toEqual(['101']);
    const done = reconcileRunsWithScheduler(runs, parseBjobsStates('101 DONE\n'), NOW);
    expect(done[0].steps?.[0].status).toBe('running');
    expect(done[0].status).toBe('waiting_user');

    const failed = reconcileRunsWithScheduler([
      { runDir: 'c', status: 'running', steps: [{ n: 1, status: 'running', jobIds: ['102'] }] },
    ], parseBjobsStates('102 EXIT\n'), NOW);
    expect(failed[0].steps?.[0].status).toBe('failed');
    expect(failed[0].status).toBe('failed');
  });

  it('后台作业完成但还有后续步骤时进入自动验收门，不标记分析完成', () => {
    const runs = [{
      runDir: 'a', status: 'waiting_jobs', totalSteps: 2, currentStep: 1,
      steps: [
        { n: 1, status: 'running', jobIds: ['201'] },
        { n: 2, status: 'pending' },
      ],
    }];
    expect(collectActiveJobIds(runs)).toEqual(['201']);
    const reconciled = reconcileRunsWithScheduler(runs, parseBjobsStates('201 DONE\n'), NOW);
    expect(reconciled[0].steps?.[0].status).toBe('running');
    expect(reconciled[0].status).toBe('waiting_user');
    expect(reconciled[0].error).toContain('等待 Agent 验收');
  });

  it('retains a batch member terminal state after LSF purges it, without treating unknown jobs as success', () => {
    const run = {
      runDir: 'r', status: 'waiting_jobs', steps: [{ n: 1, status: 'running', jobIds: ['1', '2'] }],
    };
    const first = reconcileRunsWithScheduler([run], new Map([['1', 'DONE'], ['2', 'RUN']]))[0];
    expect(first.status).toBe('waiting_jobs');
    expect(first.jobStates).toEqual({ '1': 'DONE', '2': 'RUN' });
    const last = reconcileRunsWithScheduler([first], new Map([['2', 'DONE']]))[0];
    expect(last.status).toBe('waiting_user');
    expect(last.jobStates).toEqual({ '1': 'DONE', '2': 'DONE' });
    const unknown = reconcileRunsWithScheduler([run], new Map([['1', 'DONE']]))[0];
    expect(unknown.status).toBe('waiting_jobs');
    const paused = reconcileRunsWithScheduler([{ ...last, error: '用户要求暂停' }], new Map([['2', 'DONE']]))[0];
    expect(paused.error).toBe('用户要求暂停');
  });
});

describe('持久化终态播种与补查跳过', () => {
  const run = {
    runDir: '/flows/r1', status: 'waiting_jobs', totalSteps: 1, currentStep: 1,
    steps: [{ n: 1, status: 'running', jobIds: ['11', '22'] }],
  };

  it('续跑记录终态与 run.jobStates 终态都算数；活跃态/其他 RUN 的记录不带入', () => {
    const states = seedPersistedTerminalStates(
      { ...run, jobStates: { '22': 'DONE', '33': 'RUN' } },
      [
        { runDir: '/flows/r1', jobId: '11', terminalStatus: 'DONE' },
        { runDir: '/flows/r1', jobId: '77' }, // 无终态：忽略
        { runDir: '/other', jobId: '99', terminalStatus: 'EXIT' }, // 其他 RUN：忽略
      ],
    );
    expect(states.get('11')).toBe('DONE');
    expect(states.get('22')).toBe('DONE'); // run.jobStates 里的调度器终态可复用
    expect(states.has('33')).toBe(false); // RUN 不是终态
    expect(states.has('77')).toBe(false);
    expect(states.has('99')).toBe(false);
    // 该 RUN 的全部活动作业（11、22）都已有可信终态 → 不再向调度器补查
    expect(needsSchedulerStateQuery({ ...run, jobStates: { '22': 'DONE' } }, states)).toBe(false);
  });

  it('任一活动作业缺少可信状态时仍需补查', () => {
    const states = seedPersistedTerminalStates(run, [{ runDir: '/flows/r1', jobId: '11', terminalStatus: 'DONE' }]);
    expect(needsSchedulerStateQuery(run, states)).toBe(true); // 22 仍无状态
    states.set('22', 'EXIT');
    expect(needsSchedulerStateQuery(run, states)).toBe(false);
    // 终态运行不再产生活动作业，自然无需补查
    expect(needsSchedulerStateQuery({ ...run, status: 'done' }, new Map())).toBe(false);
  });
});
