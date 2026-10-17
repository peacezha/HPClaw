import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { builtinWorkflows } from './workflowStore';
import { classifyWorkflowCatalog, isPendingDisposal } from '../../shared/workflowCatalog';
import { resolveWorkflowStepGraph } from './workflowRunService';
describe('corrected native TF ChIP-seq DAG', () => {
  it('retains an active branch workflow and deploys the tested helper', () => {
    const rows = builtinWorkflows(); classifyWorkflowCatalog(rows);
    const dag = rows.find(w => w.id === 'encode-chipseq-tf-dag')!;
    expect(isPendingDisposal(dag)).toBe(false);
    expect(dag.provenance?.importerVersion).toBe('chipseq-dag-v2');
    expect(dag.assets?.some(a => a.source === 'encode/chipseq_dag.py')).toBe(true);
    const graph = resolveWorkflowStepGraph(dag);
    expect(graph.find(s => s.stepId === 'pseudorep-peaks')?.dependsOn).toEqual(['filter-dedup']);
    expect(graph.find(s => s.stepId === 'report')?.dependsOn).toHaveLength(3);
    expect(JSON.stringify(dag)).not.toContain('--subsample-seed');
    expect(dag.steps[8].command).not.toContain('|| true');
    expect(dag.steps[3].command).toContain('samtools index -c');
  });
  it('declares actual DAP and ChIP dependencies in both language definitions', () => {
    const rows = builtinWorkflows(true);
    for (const id of ['builtin-dapseq-tf', 'builtin-dapseq-tf-en']) {
      const graph = resolveWorkflowStepGraph(rows.find(w => w.id === id)!);
      expect(graph.at(-1)?.dependsOn).toEqual(['extended-qc', 'idr', 'motif-annotation']);
    }
    for (const id of ['encode-chipseq-tf', 'encode-chipseq-histone', 'encode-chipseq-tf-en', 'encode-chipseq-histone-en']) {
      const graph = resolveWorkflowStepGraph(rows.find(w => w.id === id)!);
      expect(graph.find(s => s.stepId === 'peaks')?.dependsOn).toEqual(['filter-dedup']);
      expect(graph.at(-1)?.dependsOn).toHaveLength(3);
    }
  });
  it('verifies complementarity, paired templates, IDR scores and pooling with synthetic fixtures', () => {
    const result = spawnSync(process.platform === 'win32' ? 'python' : 'python3', ['pipelines/encode/test_chipseq_dag.py'], { encoding: 'utf8' });
    expect(result.status, result.stderr || String(result.error)).toBe(0);
  });
});
