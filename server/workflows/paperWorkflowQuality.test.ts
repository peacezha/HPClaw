import { describe, expect, it } from 'vitest';
import { evaluatePaperWorkflow, sanitizePaperExtractionMeta } from './paperWorkflowQuality';
import type { WorkflowStep } from './workflowTypes';

describe('sanitizePaperExtractionMeta', () => {
  it('保留未匹配工具与阻断问题并清理非法状态', () => {
    const meta = sanitizePaperExtractionMeta({
      primaryPath: 'FASTQ → alignment',
      methodSections: ['Methods'],
      unresolvedQuestions: [{ question: '参考版本是什么？', blocking: true, affectsSteps: [2, -1] }],
      toolLinks: [
        { canonicalName: 'STAR', paperMention: 'STAR', codeMention: 'STAR_ALIGN', status: 'matched' },
        { canonicalName: 'custom', codeMention: 'custom.sh', status: 'bad' },
      ],
    });
    expect(meta.unresolvedQuestions[0]).toMatchObject({ blocking: true, affectsSteps: [2] });
    expect(meta.toolLinks[0].status).toBe('matched');
    expect(meta.toolLinks[1].status).toBe('unverified');
  });
});

describe('evaluatePaperWorkflow', () => {
  it('证据、命令、参数、资源和 QC 完整时进入人工复核状态', () => {
    const baseAgent = {
      sourceType: 'paper' as const, sourcePath: 'paper', sourceSection: 'Methods', evidence: '论文描述了该操作',
      confidence: 'high' as const, inputs: ['input'], outputs: ['output'], template: true, requiresReview: false,
    };
    const steps: WorkflowStep[] = [
      { title: '比对', command: '#BSUB -J align\nSTAR --readFilesIn {{INPUT}}', params: [{ name: 'INPUT', label: 'FASTQ', required: true }], agent: { ...baseAgent, kind: 'compute' } },
      { title: 'QC', command: '读取 STAR Log.final.out 并核对 >80%', agent: { ...baseAgent, kind: 'qc' } },
      { title: '报告', command: '汇总真实输出生成报告', agent: { ...baseAgent, kind: 'report' } },
    ];
    const extraction = sanitizePaperExtractionMeta({
      primaryPath: 'STAR 主路径', methodSections: ['Methods'],
      toolLinks: [{ canonicalName: 'STAR', paperMention: 'STAR', codeMention: 'STAR', status: 'matched' }],
    });
    const quality = evaluatePaperWorkflow({
      params: [{ name: 'INDEX', label: 'STAR 索引', required: true }], steps,
      manifest: {
        software: [{ name: 'STAR', module: 'STAR/2.7.10', required: true }],
        references: [{ name: 'STAR index', path: '{{INDEX}}', type: 'index', required: true }],
        inputHint: 'paired FASTQ', qcGates: [{ afterStep: 2, metric: '比对率', pass: '>80%' }],
      },
    }, extraction, {
      originalChars: 10000, selectedChars: 5000, truncated: false, selectionMode: 'methods', methodSections: ['Methods'],
    }, 'PMC 全文');
    expect(quality.score).toBeGreaterThanOrEqual(75);
    expect(quality.readiness).toBe('ready_for_review');
    expect(quality.blockers).toEqual([]);
  });

  it('摘要、待补命令和阻断问题不会伪装成可运行流程', () => {
    const extraction = sanitizePaperExtractionMeta({
      unresolvedQuestions: [{ question: '完整命令是什么？', blocking: true }],
      toolLinks: [{ canonicalName: 'unknown', paperMention: 'unknown', status: 'paper_only' }],
    });
    const quality = evaluatePaperWorkflow({
      params: [],
      steps: [{
        title: '未知分析', command: '# REVIEW_REQUIRED: 论文只说明使用 unknown，未给出完整 CLI',
        agent: { kind: 'compute', sourceType: 'paper', confidence: 'low', requiresReview: true },
      }],
    }, extraction, {
      originalChars: 1000, selectedChars: 1000, truncated: false, selectionMode: 'fulltext-fallback', methodSections: [],
    }, '出版商落地页（可能只有摘要）');
    expect(quality.readiness).toBe('insufficient');
    expect(quality.blockers.join('\n')).toContain('缺少可核验的完整命令');
    expect(quality.blockers.join('\n')).toContain('可能只有摘要');
  });
});
