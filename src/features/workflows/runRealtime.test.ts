import { describe, expect, it } from 'vitest';
import {
  mergeWorkflowRunUpdate,
  reconcileWorkflowRunSnapshot,
  type WorkflowRun,
} from './api';

function makeRun(overrides: Partial<WorkflowRun> = {}): WorkflowRun {
  return {
    runId: 'run-1',
    runDir: '/home/u/hpclaw_flows/demo/03_workspace/runs/run-1',
    status: 'running',
    updatedAt: 100,
    currentStep: 1,
    totalSteps: 2,
    steps: [
      { n: 1, title: '质控', status: 'running' },
      { n: 2, title: '统计', status: 'pending' },
    ],
    ...overrides,
  };
}

describe('流程运行实时增量合并', () => {
  it('同一运行的步骤事件原位更新，不产生重复卡片', () => {
    const before = [makeRun()];
    const after = mergeWorkflowRunUpdate(before, makeRun({
      updatedAt: 200,
      currentStep: 2,
      steps: [
        { n: 1, title: '质控', status: 'done', summary: 'QC 通过' },
        { n: 2, title: '统计', status: 'running' },
      ],
    }));

    expect(after).toHaveLength(1);
    expect(after[0].currentStep).toBe(2);
    expect(after[0].steps?.[0].status).toBe('done');
  });

  it('内容相同的 Socket 重复事件保留数组引用，避免重绘', () => {
    const run = makeRun();
    const before = [run];
    expect(mergeWorkflowRunUpdate(before, { ...run, steps: run.steps?.map(step => ({ ...step })) })).toBe(before);
  });

  it('低频快照无变化时保留引用，变化时采用服务端快照', () => {
    const before = [makeRun()];
    const identical = [makeRun()];
    expect(reconcileWorkflowRunSnapshot(before, identical)).toBe(before);

    const changed = [makeRun({ status: 'done', updatedAt: 300 })];
    expect(reconcileWorkflowRunSnapshot(before, changed)).toBe(changed);
  });
});
