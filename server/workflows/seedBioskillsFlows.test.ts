import { describe, expect, it } from 'vitest';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  extractQcCheckpoints, extractStepsFromBody, extractTunables, parseSkillFrontmatter, workflowFromSkill,
} from '../../scripts/seed-bioskills-flows';

const WORKFLOWS_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'skills', 'bioSkills', 'workflows');

const SAMPLE = `---
name: bio-workflows-rnaseq-to-de
description: End-to-end RNA-seq workflow from FASTQ to DE results.
tool_type: mixed
primary_tool: DESeq2
workflow: true
depends_on:
  - read-qc/fastp-workflow
  - rna-quantification/alignment-free-quant
  - differential-expression/deseq2-basics
qc_checkpoints:
  - after_qc: "Q30 >80%, adapter content <5%"
  - after_quant: "Mapping rate >70%"
---

## Version Compatibility

Reference examples tested with: DESeq2 1.42+, STAR 2.7.11+, fastp 0.23+

# Body
`;

describe('parseSkillFrontmatter', () => {
  it('解析 name/description/primary_tool/depends_on/qc_checkpoints', () => {
    const parsed = parseSkillFrontmatter(SAMPLE);
    expect(parsed).not.toBeNull();
    expect(parsed!.name).toBe('bio-workflows-rnaseq-to-de');
    expect(parsed!.primaryTool).toBe('DESeq2');
    expect(parsed!.dependsOn).toEqual([
      'read-qc/fastp-workflow',
      'rna-quantification/alignment-free-quant',
      'differential-expression/deseq2-basics',
    ]);
    expect(parsed!.qcCheckpoints).toEqual([
      { key: 'after_qc', value: 'Q30 >80%, adapter content <5%' },
      { key: 'after_quant', value: 'Mapping rate >70%' },
    ]);
    expect(parsed!.versionTools).toEqual(['DESeq2', 'STAR', 'fastp']);
  });

  it('无 frontmatter 返回 null', () => {
    expect(parseSkillFrontmatter('# 没有 frontmatter')).toBeNull();
  });
});

describe('workflowFromSkill', () => {
  it('生成带 manifest 的流程：步骤含依赖技能与报告收尾', () => {
    const parsed = parseSkillFrontmatter(SAMPLE)!;
    const wf = workflowFromSkill('rnaseq-to-de', parsed);
    expect(wf.id).toBe('bioskills-rnaseq-to-de');
    expect(wf.name).toBe('RNA-seq 差异表达全流程');
    expect(wf.source).toBe('builtin');
    expect(wf.steps).toHaveLength(5); // 环境检查 + 3 依赖步骤 + 报告
    expect(wf.steps[0].title).toContain('环境检查');
    expect(wf.steps[0].command).toContain('#BSUB');
    expect(wf.steps[1].command).toContain('read-qc/fastp-workflow');
    expect(wf.steps[4].command).toContain('analysis-report');
    // manifest：RNA 类参考数据模板 + QC 关卡
    expect(wf.manifest!.references.some(r => r.type === 'genome')).toBe(true);
    expect(wf.manifest!.qcGates).toHaveLength(2);
    expect(wf.manifest!.qcGates[0].pass).toBe('Q30 >80%, adapter content <5%');
    // 软件：主工具 DESeq2 必需；版本兼容清单中的 STAR 是可能分支，不能错误阻断预检
    const star = wf.manifest!.software.find(s => s.name === 'STAR');
    expect(star?.module).toBe('STAR');
    expect(star?.required).toBe(false);
    expect(wf.manifest!.software.find(s => s.name === 'DESeq2')?.required).toBe(true);
  });
});

const STEP_SAMPLE = `---
name: bio-workflows-demo
description: demo
depends_on:
  - read-qc/fastp-workflow
---

## Primary Path

### Step 1: Quality Control with fastp

\`\`\`bash
fastp -i sample_R1.fastq.gz -I sample_R2.fastq.gz -o out_R1.fq.gz -O out_R2.fq.gz
\`\`\`

**QC Checkpoint 1:** Check fastp reports
- Q30 bases >80%
- Adapter content <5%

### Step 2: Salmon Quantification

\`\`\`bash
salmon quant -i salmon_index -l A -1 a.fq.gz -2 b.fq.gz -o quants/s1 -p 8
\`\`\`

## QC Checkpoints

1. **After QC**: Q30 >80%, adapter <5%
2. **After quant**: Mapping rate >70%
`;

describe('extractStepsFromBody / extractQcCheckpoints', () => {
  it('提取 Step 标题、代码块命令与 QC 备注', () => {
    const steps = extractStepsFromBody(STEP_SAMPLE);
    expect(steps).toHaveLength(2);
    expect(steps[0].title).toBe('Quality Control with fastp');
    expect(steps[0].command).toContain('fastp -i sample_R1.fastq.gz');
    expect(steps[0].command).toContain('{{INPUT_DIR}}'); // 参数提示头
    expect(steps[0].notes).toContain('QC 关卡');
    expect(steps[1].command).toContain('salmon quant');
  });

  it('解析 ## QC Checkpoints 段', () => {
    const qc = extractQcCheckpoints(STEP_SAMPLE);
    expect(qc).toEqual([
      { key: 'After QC', value: 'Q30 >80%, adapter <5%' },
      { key: 'After quant', value: 'Mapping rate >70%' },
    ]);
  });

  it('有 Step 结构时流程使用真实步骤，并生成参考数据参数', () => {
    const parsed = parseSkillFrontmatter(STEP_SAMPLE)!;
    const wf = workflowFromSkill('rnaseq-to-de', parsed, STEP_SAMPLE);
    // 环境检查 + 2 个真实步骤 + 报告
    expect(wf.steps).toHaveLength(4);
    expect(wf.steps[1].command).toContain('fastp');
    expect(wf.steps[3].command).toContain('analysis-report');
    // 线程 flag 回填 {{THREADS}} 占位
    expect(wf.steps[2].command).toContain('-p {{THREADS}}');
    // frontmatter 无 qc_checkpoints 时从 QC Checkpoints 段补充
    expect(wf.manifest!.qcGates.length).toBe(2);
    // RNA 类参考数据占位 → 可选 path 参数
    const gtf = wf.params.find(p => p.name === 'GTF');
    expect(gtf?.type).toBe('path');
    expect(gtf?.required).toBe(false);
  });

  it('步骤内的可调参数挂在该步骤上（step.params），不进全局参数', () => {
    const parsed = parseSkillFrontmatter(STEP_SAMPLE)!;
    const wf = workflowFromSkill('rnaseq-to-de', parsed, STEP_SAMPLE + `
### Step 3: fastp again

\`\`\`bash
fastp -i a.fq.gz -o b.fq.gz --qualified_quality_phred 20
\`\`\`
`);
    const step3 = wf.steps[3]; // 第 1 步是环境检查
    expect(step3.title).toContain('fastp again');
    expect(step3.params?.find(p => p.name === 'FASTP_QUAL_PHRED')?.defaultValue).toBe('20');
    expect(step3.command).toContain('--qualified_quality_phred {{FASTP_QUAL_PHRED}}');
    expect(wf.params.find(p => p.name === 'FASTP_QUAL_PHRED')).toBeUndefined();
  });
});

describe('extractTunables 可调参数提取', () => {
  it('数值 flag → 参数 + 占位回填，分隔符保留', () => {
    const cmd = [
      'fastp -i a.fq.gz -o b.fq.gz --qualified_quality_phred 20 --length_required 35',
      'java -jar trimmomatic.jar PE a.fq.gz b.fq.gz SLIDINGWINDOW:4:15 MINLEN:36',
      'salmon index -t tx.fa -i idx -k 31',
      'salmon quant -i idx -l A -1 a -2 b -p 8',
      'macs2 callpeak -t a.bam -c b.bam -q 0.05',
    ].join('\n');
    const { command, params } = extractTunables(cmd);
    const byName = Object.fromEntries(params.map(p => [p.name, p]));
    // fastp
    expect(byName.FASTP_QUAL_PHRED?.defaultValue).toBe('20');
    expect(command).toContain('--qualified_quality_phred {{FASTP_QUAL_PHRED}}');
    expect(byName.FASTP_MIN_LENGTH?.defaultValue).toBe('35');
    // Trimmomatic 冒号语法不被破坏
    expect(command).toContain('SLIDINGWINDOW:4:{{TRIM_WINDOW_QUAL}}');
    expect(command).toContain('MINLEN:{{TRIM_MINLEN}}');
    // salmon k-mer（上下文限定）
    expect(byName.SALMON_KMER?.defaultValue).toBe('31');
    // 线程回填
    expect(command).toContain('-p {{THREADS}}');
    // macs2 q 值
    expect(byName.MACS2_QVALUE?.defaultValue).toBe('0.05');
    expect(byName.MACS2_QVALUE?.type).toBe('number');
    // 全部可选
    expect(params.every(p => p.required === false)).toBe(true);
  });

  it('上下文不匹配时不提取（-q 在非 macs2 命令中）', () => {
    const { params } = extractTunables('bwa mem -q 0.5 ref.fa a.fq');
    expect(params.find(p => p.name === 'MACS2_QVALUE')).toBeUndefined();
  });

  it('DESeq2 的 alpha/lfcThreshold 提取', () => {
    const { command, params } = extractTunables(
      'res <- results(dds, alpha = 0.05, lfcThreshold = 0.6)',
    );
    expect(params.find(p => p.name === 'DE_PADJ')?.defaultValue).toBe('0.05');
    expect(command).toContain('alpha = {{DE_PADJ}}');
  });
});

describe('bioSkills 全量扫描', () => {  it('所有流水线 SKILL.md 都能解析且生成非空流程', async () => {
    const entries = await fs.readdir(WORKFLOWS_DIR, { withFileTypes: true });
    const dirs = entries.filter(e => e.isDirectory()).map(e => e.name);
    expect(dirs.length).toBeGreaterThan(30);
    const failures: string[] = [];
    for (const dir of dirs) {
      try {
        const content = await fs.readFile(path.join(WORKFLOWS_DIR, dir, 'SKILL.md'), 'utf-8');
        const parsed = parseSkillFrontmatter(content);
        if (!parsed) { failures.push(`${dir}: 无法解析 frontmatter`); continue; }
        const wf = workflowFromSkill(dir, parsed);
        if (!wf.name || wf.steps.length === 0) failures.push(`${dir}: 生成流程为空`);
        if (!wf.manifest) failures.push(`${dir}: 无 manifest`);
      } catch (err: any) {
        failures.push(`${dir}: ${err.message}`);
      }
    }
    expect(failures).toEqual([]);
  });

  it('相当比例的流程有具体命令步骤（非 search_skills 占位）', async () => {
    const entries = await fs.readdir(WORKFLOWS_DIR, { withFileTypes: true });
    const dirs = entries.filter(e => e.isDirectory()).map(e => e.name);
    let concrete = 0;
    for (const dir of dirs) {
      const content = await fs.readFile(path.join(WORKFLOWS_DIR, dir, 'SKILL.md'), 'utf-8');
      const parsed = parseSkillFrontmatter(content);
      if (!parsed) continue;
      const wf = workflowFromSkill(dir, parsed, content);
      if (!wf.steps[0]?.command.includes('search_skills 读取该技能')) concrete++;
    }
    // 至少 15 个流程带真实命令步骤（### Step 结构或整体工作流脚本）
    expect(concrete).toBeGreaterThanOrEqual(15);
  });
});
