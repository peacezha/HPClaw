import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { builtinWorkflows } from './workflowStore';

const IDS = [
  'builtin-dapseq-tf', 'encode-chipseq-tf', 'encode-chipseq-histone', 'encode-atacseq',
  'builtin-dapseq-tf-en', 'encode-chipseq-tf-en', 'encode-chipseq-histone-en', 'encode-atacseq-en',
  'encode-chipseq-tf-dag',
];

describe('DAP/ChIP/ATAC bilingual QC workflows', () => {
  it.each(IDS)('%s has SPOT, scale-region TSS outputs, explicit library verdicts, and no blacklist dependency', id => {
    const workflow = builtinWorkflows().find(item => item.id === id);
    expect(workflow).toBeDefined();
    const serialized = JSON.stringify(workflow);
    expect(workflow!.params.some(param => param.name === 'TSS_BED')).toBe(true);
    expect(workflow!.params.some(param => param.name === 'BLACKLIST')).toBe(false);
    expect(serialized).toContain('hotspot2.sh');
    expect(serialized).toContain('*.SPOT.txt');
    expect(serialized).toContain('computeMatrix scale-regions');
    expect(serialized).toContain('-R qc/geneR1.bed -b 3000 -a 3000 -m 5000 --skipZeros');
    expect(serialized).toContain('--dpi 720');
    expect(serialized).toContain('.profile.pdf');
    expect(serialized).toContain('plotHeatmap');
    expect(serialized).toContain('.merge.png');
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

  it('uses the requested geneR1 BED6 profile and does not apply the old reference-point TSS gate', () => {
    const workflows = builtinWorkflows();
    const atac = workflows.find(item => item.id === 'encode-atacseq')!;
    const chip = workflows.find(item => item.id === 'encode-chipseq-tf')!;
    const dap = workflows.find(item => item.id === 'builtin-dapseq-tf')!;
    expect(atac.params.find(param => param.name === 'TSS_BED')?.placeholder).toBe('/public/home/chaohe/db/geneR1.bed');
    expect(atac.steps[5].command).toContain('0.2 None');
    expect(atac.steps[5].command).not.toContain('reference-point');
    expect(atac.steps[5].command).toContain('qc/atac.profile.pdf');
    expect(chip.steps[6].command).toContain('qc/chip.profile.pdf');
    expect(chip.steps[6].command).toContain('0.01 None');
    expect(dap.steps[5].command).toContain('qc/dap.profile.pdf');
    expect(dap.steps[5].command).toContain('0.05 None');
  });

  it('accepts a supplied BED6 file or extracts strand-aware gene regions from GTF/GFF', () => {
    const workflow = builtinWorkflows().find(item => item.id === 'encode-chipseq-tf')!;
    const command = workflow.steps[6].command;
    expect(command).toContain('BED6');
    expect(command).toContain("row[0] == 'gene'");
    expect(command).toContain("('transcript', 'mrna')");
    expect(command).toContain('qc/geneR1.source.txt');
  });

  it('normalizes the supplied geneR1 BED6 content with the embedded extractor', () => {
    const command = builtinWorkflows().find(item => item.id === 'encode-chipseq-tf')!.steps[6].command;
    const script = command.match(/qc\/geneR1\.source\.txt <<'PY'\n([\s\S]*?)\nPY\ntest -s qc\/geneR1\.bed/)?.[1];
    expect(script).toBeTruthy();
    const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'hpclaw-gene-bed-'));
    try {
      const source = path.join(temp, 'geneR1.bed');
      const output = path.join(temp, 'normalized.bed');
      const provenance = path.join(temp, 'source.txt');
      const scriptPath = path.join(temp, 'extract.py');
      fs.writeFileSync(source, 'chr1A\t40098\t70338\tTraesCS1A02G000100\t.\t-\nchr1A\t70239\t89245\tTraesCS1A02G000200\t.\t+\n');
      fs.writeFileSync(scriptPath, script!);
      const result = spawnSync(process.platform === 'win32' ? 'python' : 'python3', [scriptPath, source, output, provenance], { encoding: 'utf8' });
      expect(result.status, result.stderr).toBe(0);
      expect(fs.readFileSync(output, 'utf8')).toBe(fs.readFileSync(source, 'utf8'));
      expect(fs.readFileSync(provenance, 'utf8')).toContain('mode\tBED6');
    } finally {
      fs.rmSync(temp, { recursive: true, force: true });
    }
  });
});
