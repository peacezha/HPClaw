import { describe, expect, it } from 'vitest';
import {
  annotateRuns, attachJobStates, collectActiveJobIds, collectStaleJobIds, isStaleRun,
  parseBjobsStates, reconcileRunsWithScheduler, STALE_AFTER_MS,
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
  it('收集活动运行作业；DONE 等待 Agent 验收，EXIT 直接失败', () => {
    const runs = [
      { runDir: 'a', status: 'running', totalSteps: 1, currentStep: 1, steps: [{ n: 1, status: 'running', jobIds: ['101'] }] },
      { runDir: 'b', status: 'done', steps: [{ n: 1, status: 'done', jobIds: ['999'] }] },
    ];
    expect(collectActiveJobIds(runs)).toEqual(['101']);
    const done = reconcileRunsWithScheduler(runs, parseBjobsStates('101 DONE\n'), NOW);
    expect(done[0].steps?.[0].status).toBe('running');
    expect(done[0].status).toBe('running');

    const failed = reconcileRunsWithScheduler([
      { runDir: 'c', status: 'running', steps: [{ n: 1, status: 'running', jobIds: ['102'] }] },
    ], parseBjobsStates('102 EXIT\n'), NOW);
    expect(failed[0].steps?.[0].status).toBe('failed');
    expect(failed[0].status).toBe('failed');
  });

  it('后台作业完成但还有后续步骤时转为等待用户继续', () => {
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
});
