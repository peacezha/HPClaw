import { describe, expect, it } from 'vitest';
import { buildDataPrepGuide, workflowNeedsDataPrep } from './dataPrepGuide';
import type { Workflow } from '@/shared/workflow';

function makeWorkflow(overrides: Partial<Workflow> = {}): Workflow {
  return {
    id: 'wf-test', name: '测试流程', description: '', keywords: [], params: [], steps: [],
    source: 'builtin', createdAt: 0, updatedAt: 0, ...overrides,
  };
}

describe('数据准备引导', () => {
  it('样本表流程给出 TSV 模板与成对规则', () => {
    const guide = buildDataPrepGuide(makeWorkflow({
      params: [{ name: 'SAMPLE_SHEET', label: '样本表 TSV', type: 'path' }],
    }));
    const tpl = guide.templates.find(t => t.param === 'SAMPLE_SHEET');
    expect(tpl).toBeTruthy();
    expect(tpl!.content.split('\n')[0]).toContain('replicate\tread1\tread2');
    expect(guide.points.some(p => p.includes('绝对路径'))).toBe(true);
  });

  it('ChIP 类流程的样本表带 type=chip/control 行', () => {
    const guide = buildDataPrepGuide(makeWorkflow({
      params: [
        { name: 'SAMPLE_SHEET', label: '样本表 TSV（type, replicate, read1, read2）', type: 'path' },
        { name: 'CONTROL_DIR', label: '对照目录', type: 'path' },
      ],
    }));
    const tpl = guide.templates.find(t => t.param === 'SAMPLE_SHEET')!;
    expect(tpl.content).toContain('chip\t1\t');
    expect(tpl.content).toContain('control\t1\t');
    expect(guide.points[0]).toContain('type');
  });

  it('INPUT_JSON 流程给出 JSON 骨架模板', () => {
    const guide = buildDataPrepGuide(makeWorkflow({
      id: 'encode-atacseq',
      params: [{ name: 'INPUT_JSON', label: '官方 pipeline input JSON', type: 'path' }],
    }));
    const tpl = guide.templates.find(t => t.param === 'INPUT_JSON')!;
    expect(JSON.parse(tpl.content)).toBeTruthy();
  });

  it('纯运维流程不需要数据准备', () => {
    expect(workflowNeedsDataPrep(makeWorkflow())).toBe(false);
    expect(workflowNeedsDataPrep(makeWorkflow({
      params: [{ name: 'INPUT_DIR', label: '数据目录', type: 'path' }],
    }))).toBe(true);
  });
});
