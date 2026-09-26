import { describe, expect, it } from 'vitest';
import { runBelongsToWorkflow, type WorkflowRun } from './api';
import type { Workflow } from '@/shared/workflow';

function makeWorkflow(overrides: Partial<Workflow> = {}): Workflow {
  return {
    id: 'wf-1',
    name: 'RNA-seq 差异表达全流程',
    description: '',
    keywords: [],
    params: [],
    steps: [],
    source: 'builtin',
    createdAt: 0,
    updatedAt: 0,
    ...overrides,
  };
}

function makeRun(overrides: Partial<WorkflowRun> = {}): WorkflowRun {
  return { runDir: '', status: 'done', ...overrides };
}

describe('runBelongsToWorkflow 三级归属', () => {
  const w = makeWorkflow();

  it('workflowId 匹配', () => {
    expect(runBelongsToWorkflow(makeRun({ workflowId: 'wf-1', runDir: '/x/hpclaw_runs/r1' }), w)).toBe(true);
    expect(runBelongsToWorkflow(makeRun({ workflowId: 'wf-other', runDir: '/x/r1' }), w)).toBe(false);
  });

  it('workflowId 缺失时按 workflowName 的 slug 匹配', () => {
    expect(runBelongsToWorkflow(makeRun({ workflowName: 'RNA-seq 差异表达全流程', runDir: '/x/r1' }), w)).toBe(true);
    expect(runBelongsToWorkflow(makeRun({ workflowName: '别的流程', runDir: '/x/r1' }), w)).toBe(false);
  });

  it('名称也缺失时按 runDir 所在的流程家目录归属（最可靠）', () => {
    expect(runBelongsToWorkflow(makeRun({
      workflowId: 'ai-乱写的-id',
      runDir: '~/hpclaw_flows/RNA-seq_差异表达全流程/03_workspace/runs/r1',
    }), w)).toBe(true);
    expect(runBelongsToWorkflow(makeRun({
      runDir: '~/hpclaw_flows/其他流程/03_workspace/runs/r1',
    }), w)).toBe(false);
  });

  it('目录 slug 需完整匹配，避免前缀误归属', () => {
    const short = makeWorkflow({ id: 'wf-2', name: 'RNA' });
    expect(runBelongsToWorkflow(makeRun({
      runDir: '~/hpclaw_flows/RNA-seq_差异表达全流程/03_workspace/runs/r1',
    }), short)).toBe(false);
  });
});

describe('workflowSlug 集群路径 ASCII 化', () => {
  it('纯 ASCII 名保持旧规则', async () => {
    const { workflowSlug } = await import('@/shared/flowManifest');
    expect(workflowSlug('fastq-to-variants')).toBe('fastq-to-variants');
    expect(workflowSlug('BLAST Pipeline v2')).toBe('BLAST_Pipeline_v2');
  });

  it('含中文名折叠为 ASCII 前缀 + 短哈希，且不同中文后缀不撞目录', async () => {
    const { workflowSlug } = await import('@/shared/flowManifest');
    const a = workflowSlug('RNA-seq 差异表达全流程');
    const b = workflowSlug('RNA-seq 质控与定量流程');
    expect(a).toMatch(/^RNA-seq-[0-9a-f]{6}$/);
    expect(b).toMatch(/^RNA-seq-[0-9a-f]{6}$/);
    expect(a).not.toBe(b);
    // 不含任何非 ASCII 字符
    // eslint-disable-next-line no-control-regex
    expect(/^[\x21-\x7e]+$/.test(a)).toBe(true);
  });

  it('纯中文名回退为 flow-<hash>，且确定性稳定', async () => {
    const { workflowSlug } = await import('@/shared/flowManifest');
    const a = workflowSlug('测试流程');
    expect(a).toMatch(/^flow-[0-9a-f]{6}$/);
    expect(workflowSlug('测试流程')).toBe(a);
    expect(workflowSlug('另一个流程')).not.toBe(a);
  });

  it('slug 不含 shell 特殊字符（括号曾让 ENCODE 流程的集群目录炸掉预检）', async () => {
    const { workflowSlug, workflowSlugParenLegacy } = await import('@/shared/flowManifest');
    const slug = workflowSlug('ENCODE-DCC ATAC-seq v2.2.3 (official WDL)');
    // 不含 ()$&;'"`! 等 shell 特殊字符，可直接用于未加引号的 mkdir/cd
    expect(/[()[\]{}$&;'"`!\\\s]/.test(slug)).toBe(false);
    // v0.4.19–v0.4.20 窗口期的带括号 slug 仍可识别归属
    const paren = workflowSlugParenLegacy('ENCODE-DCC ATAC-seq v2.2.3 (official WDL)');
    expect(paren).toContain('(');
    expect(runBelongsToWorkflow(makeRun({
      workflowId: '',
      workflowName: 'ENCODE-DCC ATAC-seq v2.2.3 (official WDL)',
      runDir: `/home/u/hpclaw_flows/${paren}/03_workspace/runs/run-1`,
    }), makeWorkflow({ name: 'ENCODE-DCC ATAC-seq v2.2.3 (official WDL)' }))).toBe(true);
  });

  it('旧中文目录仍可通过 legacy slug 归属', () => {
    // slug ASCII 化之前生成的目录名含中文，归属不能丢
    expect(runBelongsToWorkflow(makeRun({
      runDir: '/public/home/u/hpclaw_flows/RNA-seq_差异表达全流程/03_workspace/runs/old1',
    }), makeWorkflow())).toBe(true);
  });
});
