import { describe, expect, it } from 'vitest';
import { AgentPlanState } from './agentPlanState';

describe('AgentPlanState', () => {
  it('enforces one active step and evidence-bearing completion', () => {
    const state = new AgentPlanState();
    state.set('完成质控', [
      { title: '检查输入', verification: '确认 FASTQ 存在' },
      { title: '运行 FastQC', verification: '检查 html 和 zip 输出' },
    ], 1);

    state.update('1', 'running', {}, 2);
    expect(() => state.update('2', 'running')).toThrow('仍在执行');
    expect(() => state.update('1', 'done')).toThrow('summary');
    state.update('1', 'done', { summary: '发现 2 个 FASTQ', evidence: ['/data/a.fastq', '/data/b.fastq'] }, 3);
    state.update('2', 'running', {}, 4);
    state.update('2', 'done', { summary: 'FastQC 通过' }, 5);

    expect(state.isComplete()).toBe(true);
    expect(state.get()?.steps[0].finishedAt).toBe(3);
  });

  it('rejects invalid state transitions', () => {
    const state = new AgentPlanState();
    state.set('任务', [{ title: '一步', verification: '检查输出' }]);
    expect(() => state.update('1', 'done', { summary: '跳过执行' })).toThrow('非法步骤状态转换');
  });

  it('restores a waiting plan across user turns', () => {
    const state = new AgentPlanState();
    const restored = state.restore({
      goal: '等待用户选择参考基因组',
      steps: [{ id: '1', title: '选择参考', verification: '记录 accession', status: 'waiting' }],
      createdAt: 1,
      updatedAt: 2,
    });
    expect(restored?.steps[0].status).toBe('waiting');
    state.update('1', 'running');
    state.recordActiveEvidence(['命令: bjobs', '输出: DONE']);
    expect(state.activeStep()?.id).toBe('1');
    expect(state.get()?.steps[0].evidence).toContain('输出: DONE');
  });
});
