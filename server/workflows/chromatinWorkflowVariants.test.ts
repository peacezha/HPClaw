import { describe, expect, it } from 'vitest';
import { builtinWorkflows } from './workflowStore';

const IDS = [
  'builtin-dapseq-tf', 'encode-chipseq-tf', 'encode-chipseq-histone', 'encode-atacseq',
  'builtin-dapseq-tf-en', 'encode-chipseq-tf-en', 'encode-chipseq-histone-en', 'encode-atacseq-en',
  'encode-chipseq-tf-dag',
];

describe('DAP/ChIP/ATAC bilingual QC workflows', () => {
  it.each(IDS)('%s has SPOT, a TSS profile, explicit library verdicts, and no blacklist dependency', id => {
    const workflow = builtinWorkflows().find(item => item.id === id);
    expect(workflow).toBeDefined();
    const serialized = JSON.stringify(workflow);
    expect(workflow!.params.some(param => param.name === 'TSS_BED')).toBe(true);
    expect(workflow!.params.some(param => param.name === 'BLACKLIST')).toBe(false);
    expect(serialized).toContain('hotspot2.sh');
    expect(serialized).toContain('*.SPOT.txt');
    expect(serialized).toContain('tss_enrichment.png');
    expect(serialized).toContain('library_verdict.tsv');
    expect(serialized).not.toMatch(/blacklist|黑名单/i);
    expect(serialized).not.toMatch(/测序深度|sequencing depth/i);
  });

  it('keeps distinct Chinese and English report entry points', () => {
    const workflows = builtinWorkflows();
    for (const id of IDS.filter(item => item.endsWith('-en'))) {
      const workflow = workflows.find(item => item.id === id)!;
      expect(workflow.name).toContain('(English)');
      expect(workflow.steps.at(-1)?.command).toContain('--language en');
      expect(workflow.steps.at(-1)?.notes).toContain('Library QC failed');
      expect(JSON.stringify(workflow)).not.toMatch(/[\u3400-\u9fff]/);
    }
    for (const id of ['builtin-dapseq-tf', 'encode-chipseq-tf', 'encode-chipseq-histone', 'encode-atacseq']) {
      const workflow = workflows.find(item => item.id === id)!;
      expect(workflow.name).toContain('中文版');
      expect(workflow.steps.at(-1)?.command).toContain('--language zh');
      expect(workflow.steps.at(-1)?.notes).toContain('文库质控失败');
    }
  });

  it('uses ATAC-specific TSS and FRiP thresholds while treating ChIP/DAP TSS as extended QC', () => {
    const workflows = builtinWorkflows();
    const atac = workflows.find(item => item.id === 'encode-atacseq')!;
    const chip = workflows.find(item => item.id === 'encode-chipseq-tf')!;
    const dap = workflows.find(item => item.id === 'builtin-dapseq-tf')!;
    expect(JSON.stringify(atac.manifest?.qcGates)).toContain('TSS 富集分数≥6');
    expect(atac.steps[5].command).toContain('0.2 6');
    expect(chip.steps[6].command).toContain('0.01 None');
    expect(dap.steps[5].command).toContain('0.05 None');
  });
});
