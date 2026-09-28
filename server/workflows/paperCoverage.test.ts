// 参数覆盖审计与代码块抽取的回归测试（v0.4.29，学 CoPaLink 的确定性对齐思路）
import { describe, expect, it } from 'vitest';
import { auditParameterCoverage, extractCodeUnits } from './learnFromPaper';

describe('auditParameterCoverage', () => {
  const paper = [
    'Reads were trimmed with fastp v0.23.4 using --length_required 35 and a q-value cutoff of 0.05.',
    'Alignment was performed with BWA MEM 0.7.17. Peaks were called using MACS2 with FDR < 0.01.',
    'We required MAPQ 30 for all downstream analyses.',
  ].join('\n');

  it('报告中明确给出的参数被草稿覆盖时判为 found', () => {
    const draft = {
      workflow: {
        steps: [
          { command: 'fastp --length_required 35', notes: 'fastp v0.23.4，q-value 0.05' },
          { command: 'bwa mem', notes: 'BWA 0.7.17；MACS2 FDR < 0.01；MAPQ 30' },
        ],
      },
    };
    const report = auditParameterCoverage(paper, draft);
    expect(report.found).toContain('0.23.4');
    expect(report.found).toContain('--length_required');
    expect(report.missing).toHaveLength(0);
  });

  it('草稿漏掉文中参数时列入 missing 并带原文句子', () => {
    const draft = { workflow: { steps: [{ command: 'bwa mem', notes: 'BWA 0.7.17' }] } };
    const report = auditParameterCoverage(paper, draft);
    const missingTokens = report.missing.map(m => m.token);
    expect(missingTokens).toContain('--length_required');
    expect(missingTokens).toContain('0.23.4');
    expect(missingTokens).toContain('0.01');
    const flagItem = report.missing.find(m => m.token === '--length_required');
    expect(flagItem?.sentence).toContain('fastp');
  });

  it('过短的通用数字（1、2）不参与审计，避免噪音', () => {
    const report = auditParameterCoverage('We used 2 threads and 1 lane.', { steps: [] });
    expect(report.missing.filter(m => /^[12]$/.test(m.token))).toHaveLength(0);
  });
});

describe('extractCodeUnits', () => {
  it('Nextflow 文件按 process 切块', () => {
    const nf = 'process FASTQC {\n  script:\n  """fastqc $reads"""\n}\nprocess BWA {\n  script:\n  """bwa mem"""\n}\n';
    const units = extractCodeUnits('main.nf', nf);
    expect(units.map(u => u.name)).toEqual(['process FASTQC', 'process BWA']);
    expect(units[0].body).toContain('fastqc');
    expect(units[1].body).toContain('bwa mem');
  });

  it('Snakemake 文件按 rule 切块', () => {
    const smk = 'rule align:\n    shell: "bwa mem"\nrule call:\n    shell: "macs2 callpeak"\n';
    const units = extractCodeUnits('Snakefile', smk);
    expect(units.map(u => u.name)).toEqual(['rule align', 'rule call']);
  });

  it('非流程文件原样返回整块', () => {
    const units = extractCodeUnits('run.sh', 'echo hello');
    expect(units).toHaveLength(1);
    expect(units[0].name).toBe('run.sh');
  });
});
