// BioSkills 流程导入器 v2：把 skills/bioSkills/workflows 下的 Agent 技能文档
// 转换成可追溯、可配置、可逐步监控的 HPClaw 工作流。
import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { Workflow, WorkflowParam, WorkflowStep } from './workflowTypes';
import type { FlowManifest, QcGate, ReferenceItem, SoftwareItem } from '../../shared/flowManifest';
import { buildEnvCheckCommand } from './envCheckScript';

export const BIOSKILLS_IMPORTER_VERSION = '3';
const AGENT_CONTRACT_VERSION = '3';
const MAX_STEP_COMMAND = 8_000;

/**
 * 已被 ENCODE 金标准流程覆盖的 BioSkills 同名流程，v3 起不再生成。
 * 这些目录的 SKILL.md 仍保留在 skills/ 中供 search_skills 检索知识，
 * 但流程库里只保留对应的 encode-* 固定脚本版本，避免“同一件事两套流程”。
 */
export const BIOSKILLS_RETIRED: ReadonlySet<string> = new Set([
  'atacseq-pipeline',   // → encode-atacseq
  'chipseq-pipeline',   // → encode-chipseq-tf / encode-chipseq-histone
  'rnaseq-to-de',       // → encode-rnaseq-bulk
  'hic-pipeline',       // → encode-hic
  'clip-pipeline',      // → encode-eclip
  'smrna-pipeline',     // → encode-mirnaseq
]);

/** 生成步骤脚本时允许挂载的调度器参数（与 ENCODE 金标准流程一致） */
const QUEUE_PARAM: WorkflowParam = {
  name: 'QUEUE',
  label: '队列',
  defaultValue: 'q2680v2',
  type: 'select',
  options: ['q2680v2', 'normal', 'smp', 'high'],
};

// ── 命令内可调参数提取 ────────────────────────────────────────────────

interface TunableRule {
  pattern: RegExp;
  param: string;
  label: string;
  context?: RegExp;
}

const TUNABLE_RULES: TunableRule[] = [
  { pattern: /(--qualified_quality_phred)\s+(\d+)/, param: 'FASTP_QUAL_PHRED', label: 'fastp 合格质量值（Q）' },
  { pattern: /(--length_required)\s+(\d+)/, param: 'FASTP_MIN_LENGTH', label: 'fastp 最短保留读长' },
  { pattern: /(--length_limit)\s+(\d+)/, param: 'FASTP_MAX_LENGTH', label: 'fastp 最长读长限制' },
  { pattern: /(--cut_mean_quality)\s+(\d+)/, param: 'FASTP_CUT_QUAL', label: 'fastp 滑窗平均质量' },
  { pattern: /(--cut_window_size)\s+(\d+)/, param: 'FASTP_CUT_WINDOW', label: 'fastp 滑窗大小' },
  { pattern: /(LEADING):(\d+)/, param: 'TRIM_LEADING', label: 'Trimmomatic LEADING 质量' },
  { pattern: /(TRAILING):(\d+)/, param: 'TRIM_TRAILING', label: 'Trimmomatic TRAILING 质量' },
  { pattern: /(MINLEN):(\d+)/, param: 'TRIM_MINLEN', label: 'Trimmomatic 最短读长' },
  { pattern: /(SLIDINGWINDOW):(\d+):(\d+)/, param: 'TRIM_WINDOW_QUAL', label: 'Trimmomatic 滑窗平均质量' },
  { pattern: /(salmon index[^\n]*?-k)\s*(\d+)/, param: 'SALMON_KMER', label: 'salmon 索引 k-mer', context: /salmon/i },
  { pattern: /(--outFilterMultimapNmax)\s+(\d+)/, param: 'STAR_MULTIMAP_MAX', label: 'STAR 最大多重比对数' },
  { pattern: /(--outFilterMismatchNmax)\s+(\d+)/, param: 'STAR_MISMATCH_MAX', label: 'STAR 最大错配数' },
  { pattern: /(--outFilterMismatchNoverLmax)\s+(0?\.\d+)/, param: 'STAR_MISMATCH_RATE', label: 'STAR 错配率上限' },
  { pattern: /(--sjdbOverhang)\s+(\d+)/, param: 'STAR_SJDB_OVERHANG', label: 'STAR sjdbOverhang（读长-1）' },
  { pattern: /(--outSJfilterCountUniqueMin)\s+(\d+)/, param: 'STAR_SJ_MIN_UNIQUE', label: 'STAR 剪接位点最小唯一 reads' },
  { pattern: /(--geno)\s+(0?\.\d+)/, param: 'PLINK_GENO', label: 'PLINK 位点缺失率上限' },
  { pattern: /(--mind)\s+(0?\.\d+)/, param: 'PLINK_MIND', label: 'PLINK 样本缺失率上限' },
  { pattern: /(--maf)\s+(0?\.\d+)/, param: 'PLINK_MAF', label: 'PLINK 最小等位基因频率' },
  { pattern: /(--hwe)\s+(\S+)/, param: 'PLINK_HWE', label: 'PLINK HWE 检验阈值' },
  { pattern: /(-q)\s+(0?\.\d+)/, param: 'MACS2_QVALUE', label: 'MACS2/MACS3 q 值阈值', context: /macs[23]/i },
  { pattern: /(--broad-cutoff)\s+(0?\.\d+)/, param: 'MACS2_BROAD_CUTOFF', label: 'MACS broad 阈值', context: /macs[23]/i },
  { pattern: /(-evalue)\s+(\S+)/, param: 'BLAST_EVALUE', label: '比对 E-value 阈值' },
  { pattern: /(alpha)\s*=\s*(0?\.\d+)/, param: 'DE_PADJ', label: '差异分析 FDR 阈值', context: /DESeq|results\(/i },
  { pattern: /(lfcThreshold)\s*=\s*(0?\.\d+)/, param: 'DE_LFC', label: '差异分析 log2FC 阈值', context: /DESeq|lfc/i },
  { pattern: /(--cov-cutoff)\s+(\d+|auto)/, param: 'SPADES_COV_CUTOFF', label: 'SPAdes 覆盖度阈值', context: /spades/i },
  { pattern: /(--confidence)\s+(0?\.\d+)/, param: 'KRAKEN_CONFIDENCE', label: 'Kraken2 置信度', context: /kraken/i },
];

const THREAD_FLAG_PATTERN = /(\s)(-p|-t|-@|--threads|--cpus)\s+\d+/g;

interface TunableExtraction {
  command: string;
  params: Array<{ name: string; label: string; defaultValue: string; type: 'number' | 'text'; required: false }>;
}

export function extractTunables(command: string): TunableExtraction {
  const params: TunableExtraction['params'] = [];
  let out = command.replace(THREAD_FLAG_PATTERN, (_m, sp, flag) => `${sp}${flag} {{THREADS}}`);
  for (const rule of TUNABLE_RULES) {
    if (params.some(p => p.name === rule.param)) continue;
    const lines = out.split('\n');
    let replaced = false;
    for (let i = 0; i < lines.length && !replaced; i++) {
      if (rule.context && !rule.context.test(lines[i])) continue;
      const match = lines[i].match(rule.pattern);
      if (!match) continue;
      const value = match[3] ?? match[2];
      params.push({
        name: rule.param,
        label: rule.label,
        defaultValue: value,
        type: /^\d+(?:\.\d+)?$/.test(value) ? 'number' : 'text',
        required: false,
      });
      const swapped = match[0].slice(0, match[0].length - String(value).length) + `{{${rule.param}}}`;
      lines[i] = lines[i].replace(match[0], swapped);
      replaced = true;
    }
    if (replaced) out = lines.join('\n');
  }
  return { command: out, params };
}

// ── Markdown 结构解析：Step / Stage / Phase / 编号标题 / 整段脚本标记 ─────

interface ExtractedStep {
  title: string;
  command: string;
  notes?: string;
  sourceHeading: string;
  sectionText: string;
}

interface MarkdownHeading {
  idx: number;
  level: number;
  raw: string;
  title: string;
}

function markdownHeadings(lines: string[]): MarkdownHeading[] {
  const headings: MarkdownHeading[] = [];
  let inFence = false;
  lines.forEach((line, idx) => {
    if (/^\s*```/.test(line)) { inFence = !inFence; return; }
    if (inFence) return;
    const match = line.match(/^(#{1,4})\s+(.+?)\s*$/);
    if (match) headings.push({ idx, level: match[1].length, raw: match[2].trim(), title: match[2].trim() });
  });
  return headings;
}

function stepTitle(raw: string): string | null {
  const named = raw.match(/^(?:Step|Stage|Phase)\s+\d+[A-Za-z]?(?:\.\d+)?\s*(?:[:：]|--|—|–|-)\s*(.+)$/i)
    || raw.match(/^(?:Step|Stage|Phase)\s+\d+[A-Za-z]?(?:\.\d+)?\s+(.+)$/i);
  if (named?.[1]) return named[1].trim();
  const numbered = raw.match(/^\d+(?:\.\d+)*[.)]\s+(.+)$/);
  return numbered?.[1]?.trim() || null;
}

function fencedCodeBlocks(section: string): string[] {
  const blocks: string[] = [];
  const regex = /^```[^\r\n]*\r?\n([\s\S]*?)^```\s*$/gm;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(section)) !== null) {
    const body = match[1].trim();
    if (body) blocks.push(body);
  }
  return blocks;
}

function joinedCodeBlocks(section: string, maxBlocks = 8, maxChars = 7_000): string {
  const selected: string[] = [];
  let used = 0;
  for (const block of fencedCodeBlocks(section).slice(0, maxBlocks)) {
    const remaining = maxChars - used;
    if (remaining <= 0) break;
    selected.push(block.length > remaining ? `${block.slice(0, remaining)}\n# …其余内容请读取来源章节` : block);
    used += Math.min(block.length, remaining);
  }
  return selected.join('\n\n');
}

function qcNotes(section: string): string | undefined {
  const notes: string[] = [];
  for (const match of section.matchAll(/\*\*(?:QC|Quality)\s+Checkpoint[^*]*\*\*[:：]?\s*([^\n]*)/gi)) {
    if (match[1]?.trim()) notes.push(`QC 关卡：${match[1].trim()}`);
  }
  const plain = section.match(/^\s*(?:#\s*)?(?:QC|Quality)\s+Checkpoint\s*[:：]\s*(.+)$/im);
  if (plain?.[1]) notes.push(`QC 关卡：${plain[1].trim()}`);
  const expected = section.match(/^\s*(?:Expected|Pass|Thresholds?)\s*[:：]\s*(.+)$/im);
  if (expected?.[1]) notes.push(`通过标准：${expected[1].trim()}`);
  return notes.length ? notes.slice(0, 4).join('；') : undefined;
}

function markerStepsFromBody(content: string): ExtractedStep[] {
  const candidates: Array<{ steps: ExtractedStep[]; score: number }> = [];
  for (const block of fencedCodeBlocks(content)) {
    const lines = block.split(/\r?\n/);
    const markers: Array<{ idx: number; title: string; raw: string }> = [];
    lines.forEach((line, idx) => {
      const decorated = line.match(/^\s*(?:#|\/\/|;)\s*=+\s*(\d+(?:\.\d+)*)[.)]?\s*(.+?)\s*=+\s*$/i);
      const named = line.match(/^\s*(?:#|\/\/|;)\s*(?:Step|Stage|Phase)\s+\d+[A-Za-z]?(?:\.\d+)?\s*[:：-]\s*(.+?)\s*$/i);
      if (decorated) markers.push({ idx, title: decorated[2].trim(), raw: decorated[0].trim() });
      else if (named) markers.push({ idx, title: named[1].trim(), raw: named[0].trim() });
    });
    if (markers.length < 2) continue;
    const steps = markers.map((marker, index): ExtractedStep => {
      const end = markers[index + 1]?.idx ?? lines.length;
      const preamble = index === 0 ? lines.slice(0, marker.idx) : [];
      const body = [...preamble, ...lines.slice(marker.idx + 1, end)].join('\n').trim();
      const commandBody = body.length > 7_000 ? `${body.slice(0, 7_000)}\n# …其余内容请读取来源脚本章节` : body;
      return {
        title: marker.title.replace(/\s*=+\s*$/, '').trim(),
        command: `# 可用参数：{{INPUT_DIR}}（输入数据目录）、{{THREADS}}（线程数）及流程参考数据参数\n${commandBody || '# 本阶段按来源脚本说明执行'}`,
        sourceHeading: marker.raw,
        sectionText: body,
      };
    });
    candidates.push({ steps, score: steps.length * 100_000 + block.length });
  }
  candidates.sort((a, b) => b.score - a.score);
  return candidates[0]?.steps ?? [];
}

/**
 * 提取流程主路径。除 `Step N` 外，同时支持 `Stage N`、`Phase N`、`## 1. 标题`，
 * 以及整段 R/Python 脚本内的 `# === 1. TITLE ===` 标记。
 */
export function extractStepsFromBody(content: string): ExtractedStep[] {
  const lines = content.split(/\r?\n/);
  const headings = markdownHeadings(lines);
  const starts = headings
    .map(h => ({ ...h, parsedTitle: stepTitle(h.title) }))
    .filter((h): h is MarkdownHeading & { parsedTitle: string } => Boolean(h.parsedTitle));
  if (starts.length === 0) return markerStepsFromBody(content);

  return starts.map(start => {
    const next = headings.find(h => h.idx > start.idx && h.level <= start.level);
    const end = next?.idx ?? lines.length;
    const section = lines.slice(start.idx + 1, end).join('\n');
    const code = joinedCodeBlocks(section);
    return {
      title: start.parsedTitle.replace(/\s*[-—–]\s*$/, '').trim(),
      command: `# 可用参数：{{INPUT_DIR}}（输入数据目录）、{{THREADS}}（线程数）及流程参考数据参数\n${code || '# 本步骤以 BioSkills 来源章节的操作说明为准（该章节没有可直接执行的示例代码）'}`,
      notes: qcNotes(section),
      sourceHeading: start.raw,
      sectionText: section,
    };
  });
}

export function extractLargestCodeBlock(content: string): string {
  return fencedCodeBlocks(content).sort((a, b) => b.length - a.length)[0] ?? '';
}

// ── QC 表格 / 列表解析 ───────────────────────────────────────────────

function tableCells(line: string): string[] {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(v => v.trim());
}

function isSeparatorRow(cells: string[]): boolean {
  return cells.length > 0 && cells.every(cell => /^:?-{3,}:?$/.test(cell));
}

function parseQcTable(lines: string[]): Array<{ key: string; value: string }> {
  const rows = lines.filter(line => /^\s*\|/.test(line)).map(tableCells);
  if (rows.length < 3 || !isSeparatorRow(rows[1])) return [];
  const headers = rows[0].map(v => v.toLowerCase());
  const find = (pattern: RegExp) => headers.findIndex(v => pattern.test(v));
  const stageIndex = find(/stage|checkpoint|gate|阶段|步骤/);
  const metricIndex = find(/check|metric|indicator|quality|指标|检查/);
  const thresholdIndex = find(/expected|pass|keep|threshold|criterion|通过|预期|阈值/);
  return rows.slice(2).filter(row => !isSeparatorRow(row)).map(row => {
    const stage = stageIndex >= 0 ? row[stageIndex] : '';
    const metric = metricIndex >= 0 ? row[metricIndex] : '';
    const key = [stage, metric].filter(Boolean).join(' — ') || row[0] || 'QC';
    let value = thresholdIndex >= 0 ? row[thresholdIndex] : '';
    if (!value && metric) value = metric;
    if (!value && headers[0]?.includes('threshold')) value = row[0];
    if (!value) value = '按 BioSkills 来源章节的质量标准判定';
    return { key: key.slice(0, 120), value: value.slice(0, 300) };
  }).filter(item => item.key && item.value);
}

/** 解析 QC/Quality Checkpoints 与 Quantitative Thresholds 段，兼容 Markdown 表格和列表。 */
export function extractQcCheckpoints(content: string): Array<{ key: string; value: string }> {
  const lines = content.split(/\r?\n/);
  const headings = markdownHeadings(lines);
  const starts = headings.filter(h => /^(?:QC|Quality)\s+Checkpoints?|^Quantitative\s+Thresholds?|^Quality\s+Gates?/i.test(h.title));
  const items: Array<{ key: string; value: string }> = [];
  for (const start of starts) {
    const next = headings.find(h => h.idx > start.idx && h.level <= start.level);
    const sectionLines = lines.slice(start.idx + 1, next?.idx ?? lines.length);
    items.push(...parseQcTable(sectionLines));
    for (const line of sectionLines) {
      const match = line.match(/^\s*(?:\d+\.|[-*])\s+\*\*(.+?)\*\*[:：]?\s*(.*)$/)
        || line.match(/^\s*(?:\d+\.|[-*])\s+(.+?)[:：]\s*(.+)$/);
      if (match?.[1] && match?.[2]) items.push({ key: match[1].trim().slice(0, 120), value: match[2].trim().slice(0, 300) });
    }
  }
  const seen = new Set<string>();
  return items.filter(item => {
    const key = item.key.toLowerCase().replace(/\W+/g, '');
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 24);
}

// ── Frontmatter / 软件解析 ───────────────────────────────────────────

interface ParsedSkill {
  name: string;
  description: string;
  primaryTool?: string;
  dependsOn: string[];
  qcCheckpoints: Array<{ key: string; value: string }>;
  versionTools: string[];
}

function stringList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(v => String(v).trim()).filter(Boolean);
  if (typeof value === 'string') return value.split(',').map(v => v.trim()).filter(Boolean);
  return [];
}

function normalizedToolName(raw: string): string {
  return raw
    .replace(/\s*\([^)]*\)\s*/g, ' ')
    .replace(/\s+(?:v)?\d[\w.+-]*(?:\s.*)?$/i, '')
    .replace(/[.;]+$/, '')
    .trim();
}

function versionToolsFromBody(content: string): string[] {
  const match = content.match(/tested with:\s*([^\r\n]+)/i);
  if (!match) return [];
  const seen = new Set<string>();
  return match[1].split(/[,;]/).map(v => v.trim()).filter(raw => {
    if (!/\d/.test(raw)) return false;
    if (/^Each\s|^Reference\s/i.test(raw)) return false;
    return true;
  }).map(normalizedToolName).filter(name => {
    const key = name.toLowerCase();
    if (!name || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function parseSkillFrontmatter(content: string): ParsedSkill | null {
  let data: Record<string, unknown>;
  try { data = matter(content).data as Record<string, unknown>; } catch { return null; }
  const name = String(data.name || '').trim();
  if (!name) return null;
  const qcCheckpoints: ParsedSkill['qcCheckpoints'] = [];
  const rawQc = data.qc_checkpoints;
  if (Array.isArray(rawQc)) {
    for (const item of rawQc) {
      if (typeof item === 'string') {
        qcCheckpoints.push({ key: item.replace(/_/g, ' '), value: '按 BioSkills 来源章节的质量门槛判定' });
      } else if (item && typeof item === 'object') {
        for (const [key, value] of Object.entries(item as Record<string, unknown>)) {
          qcCheckpoints.push({ key, value: String(value) });
        }
      }
    }
  } else if (rawQc && typeof rawQc === 'object') {
    for (const [key, value] of Object.entries(rawQc as Record<string, unknown>)) {
      qcCheckpoints.push({ key, value: String(value) });
    }
  }
  return {
    name,
    description: String(data.description || '').replace(/\s+/g, ' ').trim(),
    primaryTool: data.primary_tool ? String(data.primary_tool).trim() : undefined,
    dependsOn: stringList(data.depends_on),
    qcCheckpoints,
    versionTools: versionToolsFromBody(content),
  };
}

const MODULE_MAP: Record<string, string> = {
  fastp: 'fastp', fastqc: 'FastQC', multiqc: 'MultiQC', star: 'STAR', hisat2: 'HISAT2',
  bwa: 'BWA', 'bwa-mem2': 'BWA', bowtie2: 'Bowtie2', minimap2: 'minimap2', samtools: 'SAMtools',
  bcftools: 'BCFtools', bedtools: 'BEDTools', kallisto: 'kallisto', salmon: 'Salmon', subread: 'Subread',
  featurecounts: 'Subread', gatk: 'GATK', 'gatk mutect2': 'GATK', picard: 'picard', freebayes: 'freebayes',
  deepvariant: 'DeepVariant', macs2: 'MACS2', macs3: 'MACS2', deeptools: 'deepTools',
  trimmomatic: 'Trimmomatic', 'trim galore': 'Trim_Galore', spades: 'SPAdes', flye: 'Flye', canu: 'canu',
  quast: 'QUAST', busco: 'BUSCO', kraken2: 'Kraken2', bracken: 'Bracken', metaphlan: 'MetaPhlAn',
  humann: 'HUMAnN', qiime2: 'QIIME2', deseq2: 'R', edger: 'R', limma: 'R', scanpy: 'scanpy',
  seurat: 'R', catalyst: 'R', dada2: 'R', mofa2: 'R', xcms: 'R', 'gatk4': 'GATK',
  snpeff: 'snpEff', vep: 'VEP', 'ensembl vep': 'VEP', blast: 'BLAST+', diamond: 'DIAMOND',
  prokka: 'Prokka', bakta: 'Bakta', augustus: 'AUGUSTUS', repeatmasker: 'RepeatMasker', plink2: 'PLINK',
};

function toolKey(name: string): string {
  return name.toLowerCase().replace(/\s+/g, ' ').trim();
}

function toSoftwareItems(primaryTool: string | undefined, versionTools: string[]): SoftwareItem[] {
  const primaries = primaryTool ? primaryTool.split(/[,;]|\s+\+\s+/).map(normalizedToolName).filter(Boolean) : [];
  const primaryKeys = new Set(primaries.map(toolKey));
  const seen = new Set<string>();
  const items: SoftwareItem[] = [];
  for (const name of [...primaries, ...versionTools]) {
    const key = toolKey(name);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    const module = MODULE_MAP[key];
    items.push({ name, module, required: primaryKeys.has(key) });
  }
  return items.slice(0, 30);
}

// ── 输入与参考数据配置 ───────────────────────────────────────────────

type RefKind = 'rna' | 'variant' | 'epi' | 'singlecell' | 'assembly' | 'annotation' | 'meta' | 'gwas'
  | 'longread' | 'crispr' | 'causal' | 'cytometry' | 'metabolomics' | 'proteomics' | 'tabular' | 'other';

function classify(slug: string): RefKind {
  if (/clinical-trial|biomarker|multi-omics|grn|metabolic-modeling/.test(slug)) return 'tabular';
  if (/causal-genomics/.test(slug)) return 'causal';
  if (/gwas-pipeline/.test(slug)) return 'gwas';
  if (/edna|metagenomics|microbiome/.test(slug)) return 'meta';
  if (/crispr/.test(slug)) return 'crispr';
  if (/cytometry|imc/.test(slug)) return 'cytometry';
  if (/metabolomics/.test(slug)) return 'metabolomics';
  if (/proteomics/.test(slug)) return 'proteomics';
  if (/longread-sv/.test(slug)) return 'longread';
  if (/scrna|spatial|tcr|multiome/.test(slug)) return 'singlecell';
  if (/rnaseq|splicing|riboseq|smrna|merip|expression|timecourse/.test(slug)) return 'rna';
  if (/fastq-to-variants|somatic|cnv|neoantigen|liquid-biopsy|outbreak/.test(slug)) return 'variant';
  if (/chipseq|atacseq|clip|hic|methylation/.test(slug)) return 'epi';
  if (/assembly/.test(slug)) return 'assembly';
  if (/annotation/.test(slug)) return 'annotation';
  return 'other';
}

function referenceTemplates(kind: RefKind): ReferenceItem[] {
  switch (kind) {
    case 'rna': return [
      { name: '参考基因组 FASTA', path: '{{GENOME_FASTA}}', type: 'genome', source: '与注释版本一致的参考基因组', required: true },
      { name: '基因注释 GTF/GFF', path: '{{GTF}}', type: 'annotation', source: '与参考基因组同版本', required: true },
      { name: '比对/定量索引', path: '{{ALIGN_INDEX}}', type: 'index', source: '按所选 STAR/HISAT2/Salmon 等路径准备', required: false },
    ];
    case 'variant': return [
      { name: '参考基因组 FASTA（含索引）', path: '{{GENOME_FASTA}}', type: 'genome', source: 'FASTA、.fai 与 sequence dictionary 版本一致', required: true },
      { name: '已知变异/人群资源库', path: '{{KNOWN_VARIANTS}}', type: 'database', source: '按流程选择 dbSNP、gnomAD、PoN 等', required: false },
    ];
    case 'epi': return [
      { name: '参考基因组 FASTA', path: '{{GENOME_FASTA}}', type: 'genome', source: '与实验物种和版本一致', required: true },
      { name: '比对索引', path: '{{ALIGN_INDEX}}', type: 'index', source: '按 BWA/Bowtie2/STAR 等所选路径准备', required: true },
      { name: '基因注释 GTF/GFF', path: '{{GTF}}', type: 'annotation', source: '用于区域注释与可视化', required: false },
    ];
    case 'singlecell': return [
      { name: '单细胞/空间参考', path: '{{SC_REFERENCE}}', type: 'index', source: '原始 reads 路径需要；若输入已是矩阵可留空', required: false },
      { name: '细胞类型标记基因集', path: '{{MARKER_SET}}', type: 'annotation', source: '可选，用于注释验证', required: false },
    ];
    case 'assembly': return [
      { name: '近缘参考基因组', path: '{{GENOME_FASTA}}', type: 'genome', source: '可选，仅用于评估或 scaffolding', required: false },
      { name: 'BUSCO 数据库', path: '{{BUSCO_DB}}', type: 'database', source: '与物种谱系匹配', required: false },
    ];
    case 'annotation': return [
      { name: '待注释基因组 FASTA', path: '{{GENOME_FASTA}}', type: 'genome', source: '上游组装最终版本', required: true },
      { name: '同源蛋白/功能数据库', path: '{{PROTEIN_DB}}', type: 'database', source: 'Swiss-Prot、eggNOG、InterPro 等', required: false },
    ];
    case 'meta': return [
      { name: '物种分类/扩增子数据库', path: '{{TAXONOMY_DB}}', type: 'database', source: 'Kraken2/MetaPhlAn/SILVA/UNITE，按分析类型选择', required: true },
      { name: '宿主参考基因组', path: '{{HOST_GENOME}}', type: 'genome', source: '需要去宿主时指定', required: false },
    ];
    case 'longread': return [
      { name: '参考基因组 FASTA', path: '{{GENOME_FASTA}}', type: 'genome', source: '与长读长样本物种一致', required: true },
      { name: '结构变异真值/候选集', path: '{{SV_TRUTHSET}}', type: 'database', source: '可选，用于 benchmark', required: false },
    ];
    case 'crispr': return [
      { name: '目标物种参考基因组', path: '{{GENOME_FASTA}}', type: 'genome', source: '用于 guide/off-target 设计', required: false },
      { name: 'Guide/sgRNA 文库清单', path: '{{GUIDE_LIBRARY}}', type: 'other', source: '筛选流程需要；编辑设计流程可留空', required: false },
    ];
    case 'causal': return [
      { name: 'LD 参考面板', path: '{{LD_REFERENCE}}', type: 'database', source: '与研究人群祖源匹配', required: false },
      { name: 'GWAS 汇总统计资源', path: '{{GWAS_SUMMARY}}', type: 'other', source: '暴露/结局汇总统计或本地缓存', required: false },
    ];
    case 'gwas': return [
      { name: 'LD/基因型参考面板', path: '{{LD_REFERENCE}}', type: 'database', source: '用于填补、LD 剪枝或结果比较；与研究祖源匹配', required: false },
      { name: '变异注释资源', path: '{{VARIANT_ANNOTATION}}', type: 'annotation', source: '可选，用于位点到基因/功能注释', required: false },
    ];
    case 'cytometry': return [
      { name: '抗体/通道面板', path: '{{PANEL_FILE}}', type: 'annotation', source: 'marker、channel、type/state 列定义', required: false },
      { name: '补偿或解混矩阵', path: '{{COMP_MATRIX}}', type: 'other', source: '常规/光谱流式按仪器导出', required: false },
    ];
    case 'metabolomics': return [
      { name: '代谢物谱库', path: '{{METABOLITE_DB}}', type: 'database', source: '实验室谱库/HMDB/MassBank/GNPS 等', required: false },
    ];
    case 'proteomics': return [
      { name: '蛋白序列/注释库', path: '{{PROTEIN_DB}}', type: 'database', source: '与搜索引擎结果所用 FASTA 一致', required: false },
    ];
    default: return [];
  }
}

function inputHint(kind: RefKind): string {
  const hints: Record<RefKind, string> = {
    rna: 'FASTQ、BAM 或表达矩阵目录；同时提供样本分组表与建库类型',
    variant: 'FASTQ/BAM/CRAM/VCF 及样本-表型/配对信息',
    epi: 'FASTQ/BAM、对照样本与实验设计表',
    singlecell: 'FASTQ、10x/空间矩阵或分析对象，并提供样本/批次信息',
    assembly: '短读长/ONT/PacBio reads 目录，并说明测序平台与倍性',
    annotation: '待注释组装 FASTA 及可用 RNA/蛋白证据',
    meta: '宏基因组或扩增子 FASTQ，以及样本元数据',
    longread: 'ONT/PacBio FASTQ 或已比对 BAM/CRAM',
    crispr: '目标基因/区域、编辑目标或筛选 read/计数数据',
    causal: 'GWAS 汇总统计文件、祖源、表型和样本重叠说明',
    gwas: 'PLINK BED/PGEN、VCF 或剂量数据，以及表型、协变量和样本排除表',
    cytometry: 'FCS/IMC 文件、panel 表和样本级实验设计',
    metabolomics: 'mzML/峰表、QC/blank 标记和样本元数据',
    proteomics: 'MaxQuant/DIA-NN/搜索引擎输出及样本设计表',
    tabular: '一个或多个数据矩阵/统计表及严格对齐的样本元数据',
    other: '按来源流程说明提供输入文件与样本元数据',
  };
  return hints[kind];
}

// ── 名称、Agent 合同与主流程转换 ─────────────────────────────────────

const CN_NAMES: Record<string, string> = {
  'atacseq-pipeline': 'ATAC-seq 染色质可及性全流程',
  'biomarker-pipeline': '生物标志物建模与验证全流程',
  'causal-genomics-pipeline': '因果基因组学全流程',
  'chipseq-pipeline': 'ChIP-seq 分析全流程',
  'clinical-trial-pipeline': '临床试验统计分析全流程',
  'clip-pipeline': 'CLIP-seq RNA 结合位点全流程',
  'cnv-pipeline': '拷贝数变异（CNV）分析全流程',
  'crispr-editing-pipeline': 'CRISPR 编辑设计与验证全流程',
  'crispr-screen-pipeline': 'CRISPR 筛选分析全流程',
  'cytometry-pipeline': '流式/质谱流式细胞分析全流程',
  'edna-pipeline': '环境 DNA（eDNA）分析全流程',
  'expression-to-pathways': '表达差异到通路解释全流程',
  'fastq-to-variants': 'WGS/WES 变异检测全流程',
  'genome-annotation-pipeline': '基因组注释全流程',
  'genome-assembly-pipeline': '基因组组装全流程',
  'grn-pipeline': '基因调控网络（GRN）推断全流程',
  'gwas-pipeline': 'GWAS 分析全流程',
  'hic-pipeline': 'Hi-C 三维基因组分析全流程',
  'imc-pipeline': '成像质谱流式（IMC）分析全流程',
  'liquid-biopsy-pipeline': '液体活检与 cfDNA 分析全流程',
  'longread-sv-pipeline': '长读长结构变异检测全流程',
  'merip-pipeline': 'MeRIP/m6A-seq 分析全流程',
  'metabolic-modeling-pipeline': '代谢网络建模全流程',
  'metabolomics-pipeline': '非靶向代谢组学全流程',
  'metagenomics-pipeline': '宏基因组分析全流程',
  'methylation-pipeline': 'DNA 甲基化分析全流程',
  'microbiome-pipeline': '16S/ITS 微生物组分析全流程',
  'multi-omics-pipeline': '多组学整合分析全流程',
  'multiome-pipeline': '单细胞 Multiome 分析全流程',
  'neoantigen-pipeline': '新抗原预测全流程',
  'outbreak-pipeline': '病原暴发与传播分析全流程',
  'proteomics-pipeline': '蛋白质组学差异分析全流程',
  'riboseq-pipeline': 'Ribo-seq 翻译组分析全流程',
  'rnaseq-to-de': 'RNA-seq 差异表达全流程',
  'scrnaseq-pipeline': '单细胞 RNA-seq 全流程',
  'smrna-pipeline': '小 RNA/miRNA 分析全流程',
  'somatic-variant-pipeline': '肿瘤体细胞变异检测全流程',
  'spatial-pipeline': '空间转录组分析全流程',
  'splicing-pipeline': '可变剪接分析全流程',
  'tcr-pipeline': 'TCR/BCR 免疫组库分析全流程',
  'timecourse-pipeline': '时间序列表达分析全流程',
};

function prettify(slug: string): string {
  return slug.split('-').map(part => part ? part[0].toUpperCase() + part.slice(1) : part).join(' ');
}

function keywordsFor(slug: string, name: string, parsedName: string): string[] {
  const words = new Set<string>([slug, parsedName.replace(/^bio-workflows-/, ''), ...slug.split('-')]);
  name.split(/[\s/（）()与]+/).filter(v => v.length > 1).forEach(v => words.add(v));
  return [...words].slice(0, 16);
}

function decisionHeadings(content: string): string[] {
  return markdownHeadings(content.split(/\r?\n/))
    .filter(h => /decision\s+tree|which\s+path|modality\s+decision|branch\s+selection|选择.*路径|路径.*选择/i.test(h.title))
    .map(h => h.title)
    .slice(0, 3);
}

function alternativeSections(content: string): ExtractedStep[] {
  const lines = content.split(/\r?\n/);
  const headings = markdownHeadings(lines);
  const variants = headings.filter(h => /workflow variants?/i.test(h.title));
  const candidates = headings.filter(heading => {
    if (/workflow variants?/i.test(heading.title)) return false;
    const explicit = /alternative|manual gating|msstats workflow|mixomics.*workflow|similarity network fusion|strelka2 workflow|ms-dial|dia-nn workflow/i.test(heading.title);
    const insideVariants = variants.some(parent => {
      if (heading.idx <= parent.idx || heading.level <= parent.level) return false;
      const end = headings.find(next => next.idx > parent.idx && next.level <= parent.level)?.idx ?? lines.length;
      return heading.idx < end;
    });
    return explicit || insideVariants;
  });
  return candidates.slice(0, 4).map(heading => {
    const next = headings.find(item => item.idx > heading.idx && item.level <= heading.level);
    const section = lines.slice(heading.idx + 1, next?.idx ?? lines.length).join('\n');
    const code = joinedCodeBlocks(section, 8, 7_000);
    return {
      title: `可选分支：${heading.title}`,
      command: `# 可用参数：{{INPUT_DIR}}（输入数据目录）、{{THREADS}}（线程数）及流程参考数据参数\n${code || '# 按来源章节说明执行该可选分支'}`,
      notes: qcNotes(section),
      sourceHeading: heading.raw,
      sectionText: section,
    };
  });
}

function refsForStep(step: ExtractedStep, deps: string[], index: number, total: number): string[] {
  const haystack = `${step.sourceHeading}\n${step.sectionText.slice(0, 2_000)}`.toLowerCase();
  const matched = deps.filter(dep => {
    const leaf = dep.split('/').pop() || dep;
    return haystack.includes(dep.toLowerCase()) || haystack.includes(leaf.toLowerCase());
  });
  if (matched.length > 0) return [...new Set(matched)].slice(0, 6);
  if (deps.length === 0) return [];
  const from = Math.floor(index * deps.length / Math.max(total, 1));
  const to = Math.max(from + 1, Math.floor((index + 1) * deps.length / Math.max(total, 1)));
  return deps.slice(from, to).slice(0, 4);
}

/**
 * 步骤命令中出现哪个清单软件，就挂载哪个 module（按词边界匹配，
 * 兼容 trim_galore/Trim Galore 这类写法差异）；全都不沾边就不加载。
 */
function matchedModuleLoads(stepText: string, software: SoftwareItem[]): string[] {
  const haystack = stepText.toLowerCase();
  const loads: string[] = [];
  for (const item of software) {
    if (!item.module) continue;
    const base = item.module.split('/')[0];
    const candidates = [...new Set([base, item.name])]
      .map(v => v.toLowerCase().replace(/[\s_]+/g, '[\\s_-]'))
      .filter(v => v.length > 2);
    if (candidates.some(pattern => new RegExp(`\\b${pattern}\\b`, 'i').test(haystack))) {
      loads.push(`module load ${item.module}`);
    }
  }
  return [...new Set(loads)].slice(0, 8);
}

function jobNameFor(dir: string, index: number): string {
  const slug = dir.replace(/-pipeline$/, '').replace(/[^A-Za-z0-9]+/g, '_').slice(0, 18);
  return `bs_${slug}_s${index}`;
}

/**
 * v3：步骤命令 = 可直接提交的固定脚本（#BSUB + module load + 来源代码），
 * AI 只负责确认/微调参数，不再按“执行合同”现场重写代码。
 * 来源章节没有代码块时退化为明确的 AI 协助说明（不伪装成固定脚本）。
 */
function agentStepCommand(dir: string, heading: string, rawCommand: string, skillRefs: string[], software: SoftwareItem[], stepIndex: number): string {
  const sourcePath = `bioSkills/workflows/${dir}/SKILL.md`;
  const reference = rawCommand.length > 6_000 ? `${rawCommand.slice(0, 6_000)}\n# …其余模板读取来源章节` : rawCommand;
  const noCode = /本步骤以 BioSkills 来源章节的操作说明为准|本阶段按来源脚本说明执行|来源流程未提供独立代码块/.test(reference);
  if (noCode) {
    return [
      '# 本步骤在来源流程中没有可直接执行的固定代码，需要 AI 协助生成一次性脚本。',
      `# 来源流程：${sourcePath}`,
      `# 来源章节：${heading}`,
      skillRefs.length ? `# 关联技能：${skillRefs.join(', ')}` : '# 关联技能：以来源章节 Related Skills/depends_on 为准',
      '# 做法：先 search_skills 读取来源章节与关联技能，按本流程已确认的参数生成脚本，',
      '# 写回 RUN/code/step-NN.sh 后再执行；禁止脱离来源章节自由发挥。',
    ].join('\n');
  }
  return [
    '# 固定分析脚本（金标准）：只需确认参数取值，禁止改写命令逻辑。',
    `# 来源：${sourcePath} § ${heading}`,
    ...(skillRefs.length ? [`# 关联技能：${skillRefs.join(', ')}`] : []),
    '# 提交方式：bsub < 本脚本；耗时短的清尾检查也可 bash 本脚本 直接跑。',
    `#BSUB -J ${jobNameFor(dir, stepIndex)} -n {{THREADS}} -q {{QUEUE}}`,
    ...matchedModuleLoads(reference, software),
    '',
    reference,
  ].join('\n').slice(0, MAX_STEP_COMMAND);
}

/**
 * v3 新增：每个流程第一步固定为可执行的环境检查脚本（与 ENCODE 流程共用
 * envCheckScript 生成器）——逐个试加载清单软件，必需项缺失则退出码非 0
 * 并列出集群可用版本，同时确认输入目录存在。让用户在跑数据前就看到环境结论。
 */
function envCheckStep(dir: string, software: SoftwareItem[]): WorkflowStep {
  return {
    title: '环境检查（软件与输入）',
    command: buildEnvCheckCommand({ job: jobNameFor(dir, 0), software }).slice(0, MAX_STEP_COMMAND),
    notes: '只读检查，不修改任何数据；任一必需软件缺失时停止后续步骤，先补齐环境。',
    agent: {
      kind: 'qc',
      sourcePath: `bioSkills/workflows/${dir}/SKILL.md`,
      sourceSection: 'Environment check',
      template: false,
      contractVersion: AGENT_CONTRACT_VERSION,
    },
  };
}

function workflowDescription(description: string): string {
  const useWhen = description.search(/\s+Use when\b/i);
  const main = useWhen > 0 ? description.slice(0, useWhen) : description;
  return main.slice(0, 500).trim();
}

function checkpointStep(checkpoint: { key: string; value: string }, index: number, steps: WorkflowStep[], total: number): number {
  const eligible = steps.map((step, i) => ({ step, i })).filter(item => !item.step.optional && !['decision', 'report'].includes(item.step.agent?.kind || ''));
  const normalized = checkpoint.key.toLowerCase().replace(/^after[\s_-]*/, '').replace(/[_-]+/g, ' ');
  const tokens = normalized.split(/\s+/).filter(v => v.length > 2 && !['stage', 'step', 'quality', 'checkpoint'].includes(v));
  let best: { i: number; score: number } | undefined;
  for (const item of eligible) {
    const title = item.step.title.toLowerCase();
    const score = tokens.reduce((sum, token) => sum + (title.includes(token) ? 1 : 0), 0);
    if (score > 0 && (!best || score > best.score)) best = { i: item.i, score };
  }
  if (best) return best.i + 1;
  const position = Math.min(eligible.length - 1, Math.max(0, Math.round((index + 1) * eligible.length / Math.max(total, 1)) - 1));
  return (eligible[position]?.i ?? 0) + 1;
}

function detailedCheckpoints(parsed: ParsedSkill, content: string, extracted: ExtractedStep[]): Array<{ key: string; value: string }> {
  const body = extractQcCheckpoints(content);
  const inline = extracted.filter(step => step.notes?.includes('QC 关卡')).map(step => ({
    key: step.title,
    value: step.notes || '按来源章节的质量标准判定',
  }));
  const combined = [...body, ...(body.length ? [] : inline), ...parsed.qcCheckpoints];
  const seen = new Set<string>();
  return combined.filter(item => {
    const key = item.key.toLowerCase().replace(/\W+/g, '');
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 24);
}

function sourceDigest(content: string): string {
  return createHash('sha256').update(content).digest('hex').slice(0, 16);
}

export function workflowFromSkill(dir: string, parsed: ParsedSkill, content = ''): Omit<Workflow, 'createdAt' | 'updatedAt'> {
  const name = CN_NAMES[dir] || prettify(dir);
  const sourcePath = `bioSkills/workflows/${dir}/SKILL.md`;
  const kind = classify(dir);
  const extracted = content ? extractStepsFromBody(content) : [];
  const alternatives = content ? alternativeSections(content) : [];
  const software = toSoftwareItems(parsed.primaryTool, parsed.versionTools);
  const steps: WorkflowStep[] = [];

  // 第一步固定为环境检查：先确认软件与输入就绪，再进入分析步骤。
  steps.push(envCheckStep(dir, software));

  const branchHeadings = extracted
    .filter(step => /(?:Step|Stage|Phase)\s+\d+[A-Za-z]/i.test(step.sourceHeading))
    .map(step => step.sourceHeading);
  const decisions = content ? [
    ...decisionHeadings(content),
    ...(branchHeadings.length > 1 ? [`编号分支：${branchHeadings.join(' / ')}`] : []),
    ...(alternatives.length ? [`可选分析分支：${alternatives.map(step => step.sourceHeading).join(' / ')}`] : []),
  ].slice(0, 4) : [];
  if (decisions.length > 0) {
    steps.push({
      title: '分析设计与路径确认',
      command: [
        '# HPClaw BioSkills Agent Decision v3',
        `# 来源流程：${sourcePath}`,
        `# 决策章节：${decisions.join('；')}`,
        '# 读取来源章节，检查输入数据类型、实验设计、物种、对照和测序平台；列出适用与不适用分支。',
        '# 需要用户决定的关键分支用 ask_user；确认后用 update_workflow_run 记录选择与理由，并把不适用的分支步骤标记 skipped。',
      ].join('\n'),
      notes: `必须先完成分支选择。来源：${decisions.join('；')}`,
      agent: { kind: 'decision', sourcePath, sourceSection: decisions.join('；'), template: false, contractVersion: AGENT_CONTRACT_VERSION },
    });
  }

  if (extracted.length > 0) {
    [...extracted, ...alternatives].forEach((item, index) => {
      const refs = refsForStep(item, parsed.dependsOn, index, extracted.length);
      const tunable = extractTunables(item.command);
      const title = item.title || `阶段 ${index + 1}`;
      const notes = [item.notes, `来源章节：${item.sourceHeading}`, refs.length ? `关联技能：${refs.join('、')}` : '']
        .filter(Boolean).join('；');
      const step: WorkflowStep = {
        title,
        command: agentStepCommand(dir, item.sourceHeading, tunable.command, refs, software, index + 1),
        notes,
        optional: index >= extracted.length || branchHeadings.includes(item.sourceHeading) || /optional|alternative|可选/i.test(`${title} ${item.sourceHeading}`),
        agent: {
          kind: /qc|quality|validation|validate|质控|验证/i.test(title) ? 'qc' : 'compute',
          sourcePath,
          sourceSection: item.sourceHeading,
          skillRefs: refs.length ? refs : undefined,
          template: true,
          contractVersion: AGENT_CONTRACT_VERSION,
        },
      };
      if (tunable.params.length) step.params = tunable.params.slice(0, 20);
      steps.push(step);
    });
  } else {
    parsed.dependsOn.forEach((dep, index) => {
      const title = prettify(dep.split('/').pop() || dep);
      steps.push({
        title,
        command: agentStepCommand(dir, title, '# 来源流程未提供独立代码块；按关联技能的完整操作、陷阱与 QC 说明生成本次脚本。', [dep], software, index + 1),
        notes: `关联技能：${dep}`,
        agent: { kind: 'compute', sourcePath, sourceSection: title, skillRefs: [dep], template: true, contractVersion: AGENT_CONTRACT_VERSION },
      });
    });
  }

  steps.push({
    title: '结果汇总、QC 审计与分析报告',
    command: '按 analysis-report 技能汇总本次 Run 的全部步骤状态、真实 QC 指标、参数、软件版本和输出；在 04_results/<runId>/report/ 生成自包含 report.html、report.md 与 figures/，并用 update_workflow_run 登记 reportPath。',
    notes: `报告必须回链 BioSkills 来源 ${sourcePath}，明确所选分支、偏离模板之处和失败/警告项。`,
    agent: { kind: 'report', sourcePath, sourceSection: 'Outputs / Report', skillRefs: ['analysis-report'], template: false, contractVersion: AGENT_CONTRACT_VERSION },
  });

  const checkpoints = detailedCheckpoints(parsed, content, extracted);
  const qcGates: QcGate[] = checkpoints.map((checkpoint, index) => ({
    afterStep: checkpointStep(checkpoint, index, steps, checkpoints.length),
    metric: checkpoint.key,
    pass: checkpoint.value,
  }));

  // 占位参考数据由运行面板/AI 确认路径，预检阶段不作为硬阻断；必要性写入参数帮助。
  const rawReferences = referenceTemplates(kind);
  const references = rawReferences.map(reference => ({ ...reference, required: false }));
  const referenceParams: WorkflowParam[] = [];
  for (const reference of rawReferences) {
    const match = reference.path.match(/^\{\{(\w+)\}\}$/);
    if (!match) continue;
    referenceParams.push({
      name: match[1],
      label: reference.name,
      type: 'path',
      required: false,
      placeholder: reference.required ? '建议运行前指定；留空时由 AI 协助查找或构建' : '可选；留空时按所选分支处理',
      help: reference.source,
    });
  }

  const params: WorkflowParam[] = [
    { name: 'INPUT_DIR', label: '输入数据路径', type: 'path', help: inputHint(kind) },
    { name: 'SAMPLE_SHEET', label: '样本与实验设计表', type: 'path', required: false, placeholder: '可留空，由 AI 根据输入生成后请你确认', help: '推荐 TSV/CSV；至少包含 sample、group，并按流程补充 batch/pair/covariate。' },
    { name: 'THREADS', label: '每个计算步骤默认线程数', defaultValue: '8', type: 'number', min: 1, max: 256, step: 1 },
    { ...QUEUE_PARAM },
    ...referenceParams,
  ];

  const manifest: FlowManifest = {
    software,
    references,
    inputHint: inputHint(kind),
    qcGates,
  };

  return {
    id: `bioskills-${dir}`,
    name,
    description: workflowDescription(parsed.description),
    keywords: keywordsFor(dir, name, parsed.name),
    params,
    steps,
    manifest,
    provenance: {
      provider: 'bioskills',
      sourcePath,
      sourceName: parsed.name,
      sourceDigest: sourceDigest(content || parsed.name),
      importerVersion: BIOSKILLS_IMPORTER_VERSION,
    },
    source: 'builtin',
  };
}

export function validateBioskillsWorkflow(workflow: Workflow): string[] {
  const issues: string[] = [];
  if (!workflow.id.startsWith('bioskills-')) issues.push('ID 不是 bioskills-*');
  if (!workflow.provenance || workflow.provenance.provider !== 'bioskills') issues.push('缺少 BioSkills 来源信息');
  if (workflow.steps.length < 2) issues.push('步骤不足');
  if (!workflow.steps.some(step => step.agent?.kind === 'report')) issues.push('缺少报告步骤');
  workflow.steps.forEach((step, index) => {
    if (!step.title || !step.command) issues.push(`步骤 ${index + 1} 为空`);
    if (step.command.length > MAX_STEP_COMMAND) issues.push(`步骤 ${index + 1} 命令过长`);
    if (step.agent?.kind !== 'report' && !step.agent?.sourcePath) issues.push(`步骤 ${index + 1} 无法追溯来源`);
  });
  const paramNames = workflow.params.map(param => param.name);
  if (new Set(paramNames).size !== paramNames.length) issues.push('存在重复参数');
  for (const gate of workflow.manifest?.qcGates ?? []) {
    if (gate.afterStep < 1 || gate.afterStep > workflow.steps.length) issues.push(`QC 步骤越界: ${gate.metric}`);
  }
  return issues;
}

/**
 * 全量生成；任一来源失败时拒绝返回“部分成功”，避免种子静默变少。
 * categories：内置流程 id → 分类名（BUILTIN_CATEGORIES），命中时注入 workflow.category。
 */
export async function generateBioskillsWorkflows(skillsRoot: string, categories?: Record<string, string>): Promise<Workflow[]> {
  const root = path.join(skillsRoot, 'bioSkills', 'workflows');
  const entries = await fs.readdir(root, { withFileTypes: true }).catch(() => [] as import('node:fs').Dirent[]);
  const dirs = entries.filter(entry => entry.isDirectory() && !BIOSKILLS_RETIRED.has(entry.name)).map(entry => entry.name).sort();
  const now = Date.now();
  const workflows: Workflow[] = [];
  const failures: string[] = [];
  for (const dir of dirs) {
    try {
      const content = await fs.readFile(path.join(root, dir, 'SKILL.md'), 'utf-8');
      const parsed = parseSkillFrontmatter(content);
      if (!parsed) throw new Error('frontmatter 无法解析');
      const workflow = { ...workflowFromSkill(dir, parsed, content), createdAt: now, updatedAt: now } as Workflow;
      const issues = validateBioskillsWorkflow(workflow);
      if (issues.length) throw new Error(issues.join('；'));
      const category = categories?.[workflow.id];
      if (category) workflow.category = category;
      workflows.push(workflow);
    } catch (error: any) {
      failures.push(`${dir}: ${error?.message || String(error)}`);
    }
  }
  if (failures.length) throw new Error(`BioSkills 流程导入不完整（${failures.length}/${dirs.length}）：${failures.join(' | ')}`);
  return workflows;
}
