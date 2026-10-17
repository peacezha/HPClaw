import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import { builtinWorkflows } from './workflowStore';
import { resolveWorkflowStepGraph } from './workflowRunService';

describe('DAP-seq biological-replicate IDR', () => {
  it.each(['builtin-dapseq-tf', 'builtin-dapseq-tf-en'])('adds a real, required step 7 to %s and sends reproducible peaks downstream', id => {
    const w = builtinWorkflows().find(row => row.id === id)!;
    expect(w.steps).toHaveLength(9);
    expect(w.steps[6]).toMatchObject({ id: 'idr', dependsOn: ['peaks'] });
    expect(w.steps[6].command).toContain('dapseq_idr.py idr');
    expect(w.steps[6].command).not.toContain('|| true');
    expect(w.steps[6].optional).not.toBe(true);
    expect(w.steps[7].dependsOn).toEqual(['idr']);
    expect(w.steps[7].command).toContain('idr/final/*.peaks.final.bed');
    expect(resolveWorkflowStepGraph(w).at(-1)?.dependsOn).toEqual(['extended-qc', 'idr', 'motif-annotation']);
    expect(w.params.find(p => p.name === 'DAP_SAMPLE_SHEET')?.required).toBe(true);
    expect(w.params.find(p => p.name === 'GENOME_SIZE')?.required).toBe(true);
    expect(w.params.find(p => p.name === 'GENOME_SIZE')?.defaultValue).toBeUndefined();
    expect(w.steps[3].command).toContain('samtools index -c');
    expect(w.steps[5].command).toContain('dapseq_idr.py list-bams');
    expect(w.assets?.some(a => a.source === 'encode/dapseq_idr.py')).toBe(true);
    expect(w.manifest?.qcGates.some(g => g.afterStep === 7 && /IDR/.test(g.metric))).toBe(true);
  });
  it('verifies independent groups, permissive inputs, global IDR scores and truthful failures with fixture tools', () => {
    const result = spawnSync(process.platform === 'win32' ? 'python' : 'python3', ['pipelines/encode/test_dapseq_idr.py'], { encoding: 'utf8' });
    expect(result.status, result.stderr || String(result.error)).toBe(0);
  });
  it('verifies Chinese/English deterministic reports and honest IDR conclusions with output fixtures', () => {
    const result = spawnSync(process.platform === 'win32' ? 'python' : 'python3', ['pipelines/encode/test_report_locale.py'], { encoding: 'utf8' });
    expect(result.status, result.stderr || String(result.error)).toBe(0);
  });
});
