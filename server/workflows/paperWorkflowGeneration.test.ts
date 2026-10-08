import { describe, expect, it, vi } from 'vitest';
import { generatePaperWorkflow, hasExecutableBody } from './paperWorkflowGeneration';
import { parseWorkflowJson } from './learnFromPaper';
import { evaluatePaperReproducibility } from './paperWorkflowQuality';
import fs from 'node:fs';
import { scanPaperAnalysis } from './paperLearningRecovery';
const sentences = ['Reads were cleaned using fastp.', 'Reads were mapped using BWA.', 'Peaks were called using MACS2.'];
const paperText = 'Methods\n' + sentences.join(' ');

describe('bounded paper workflow generation', () => {
  it('assembles executable complete batches without accepting false evidence-ID coverage', async () => {
    const call = vi.fn(async (prompt: string, stage: string) => stage === 'outline' ? {
      text: JSON.stringify({ steps: [{ title: 'QC', evidenceIds: ['E1','E2','E3'], agent: { evidence: sentences[0] } }] }),
    } : { text: JSON.stringify({ steps: JSON.parse(prompt.split('【本批节点与原文】\n')[1].split('\n【已声明参数】')[0])
      .map((node: any) => ({ ...node, command: 'tool --input {{INPUT}} --output {{OUTPUT}}',
        agent: { ...node.agent, kind: 'compute', inputs: ['INPUT'], outputs: ['OUTPUT'] } })),
      params: [{ name: 'INPUT' }, { name: 'OUTPUT' }] }) });
    const result = JSON.parse(await generatePaperWorkflow({ paperText, english: false, call, parse: parseWorkflowJson }));
    expect(result.workflow.steps).toHaveLength(3);
    expect(result.workflow.steps.every((step: any) => hasExecutableBody(step.command))).toBe(true);
    expect(result.extraction.unresolvedQuestions).toEqual([]);
  });
  it.skipIf(!process.env.HPCLAW_LEARN_DRAFT)('retains missing analyses from the real two-step draft without rewriting user data or calling a paid model', async () => {
    const entries = JSON.parse(fs.readFileSync(process.env.HPCLAW_LEARN_DRAFT!, 'utf8'));
    const entry = entries.find((item: any) => item.id === 'bc719c8e-f6cf-4cf9-aae7-ee8b8e261fe3');
    expect(entry).toBeTruthy();
    const text = entry.paperContext;
    const inventory = scanPaperAnalysis(text);
    expect(entry.draft.steps).toHaveLength(2);
    const call = vi.fn(async (_prompt: string, stage: string) => ({ text: JSON.stringify(stage === 'outline'
      ? { name: entry.draft.name, steps: [] } : { steps: [] }) }));
    const result = JSON.parse(await generatePaperWorkflow({ paperText: text, english: false, call, parse: parseWorkflowJson }));
    expect(result.workflow.steps).toHaveLength(inventory.stepsMentioned.length);
    expect(result.workflow.steps.length).toBeGreaterThan(2);
    expect(result.workflow.steps.every((step: any) => step.agent.requiresReview && step.command.includes('exit 2'))).toBe(true);
  });
  it('does not accept a truncated QC-only prefix as the complete analysis', async () => {
    const call = vi.fn(async (_prompt: string, stage: string) => stage === 'outline' ? {
      text: JSON.stringify({ name: 'DAP', steps: [{ title: 'QC', evidenceIds: ['E1'], agent: { evidence: sentences[0] } }] }),
      finishReason: 'length',
    } : { text: '{"steps":[]}', finishReason: 'length' });
    const result = JSON.parse(await generatePaperWorkflow({ paperText, english: false, call, parse: parseWorkflowJson }));
    expect(result.workflow.steps).toHaveLength(3);
    expect(result.workflow.steps.map((step: any) => step.agent.evidence)).toEqual(sentences);
    expect(result.workflow.steps.every((step: any) => step.command.includes('exit 2') && step.agent.requiresReview)).toBe(true);
    expect(result.extraction.warnings.some((warning: string) => warning.includes('截断'))).toBe(true);
    expect(call.mock.calls.filter(item => item[1] === 'steps')).toHaveLength(2);
  });
  it('fills batches by stable IDs, keeps a missing node and flags undeclared parameters', async () => {
    const call = vi.fn(async (_prompt: string, stage: string) => stage === 'outline' ? {
      text: JSON.stringify({ steps: sentences.map((sentence, index) => ({
        title: ['QC','Mapping','Peaks'][index], evidenceIds: ['E' + (index + 1)], agent: { evidence: sentence },
      })) }),
    } : {
      text: JSON.stringify({ steps: [{ id: 'S1', title: 'QC', command: 'fastp -i {{READS}} -o {{OUTPUT}} -q {{FASTP_Q}}',
        agent: { kind: 'compute', inputs: ['READS'], outputs: ['OUTPUT'], evidence: sentences[0] } }],
      params: [{ name: 'READS' }, { name: 'OUTPUT' }] }),
    });
    const result = JSON.parse(await generatePaperWorkflow({ paperText, english: false, call, parse: parseWorkflowJson }));
    expect(result.workflow.steps).toHaveLength(3);
    expect(result.workflow.steps[0].agent.requiresReview).toBe(true);
    expect(result.extraction.unresolvedQuestions.some((question: any) => question.question.includes('FASTP_Q'))).toBe(true);
    expect(result.workflow.steps[1].command).toContain('exit 2');
  });
  it('rejects fabricated source sentences and survives malformed field shapes', async () => {
    const call = vi.fn(async (_prompt: string, stage: string) => ({ text: JSON.stringify(stage === 'outline'
      ? { steps: [{ title: 'Invented', agent: { evidence: 'An invented program was used to map reads.' } }], excludedEvidence: {} }
      : { steps: {}, params: {}, manifest: { software: {} } }) }));
    const result = JSON.parse(await generatePaperWorkflow({ paperText, english: false, call, parse: parseWorkflowJson }));
    expect(result.workflow.steps).toHaveLength(3);
    expect(result.workflow.steps.some((step: any) => step.title === 'Invented')).toBe(false);
  });
  it('does not count comment-only download placeholders as acquisition steps', () => {
    expect(hasExecutableBody('# prefetch SRR123\n# download raw_data_manifest.tsv')).toBe(false);
    const audit = evaluatePaperReproducibility({ steps: [{ title: '下载数据', command: '# 示例 prefetch <accession>' }] as any },
      { rawData: [], parameterEvidence: [] } as any);
    expect(audit.hasAcquisitionStep).toBe(false);
  });
});
