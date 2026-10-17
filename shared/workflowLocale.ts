import type { Workflow } from './workflow';
import { WORKFLOW_PHRASES, translateWorkflowTemplate } from '../src/i18n/workflowCopy';
import { BIOINFORMATICS_PHRASES } from '../src/i18n/bioinformatics';
import { currentProductText, currentProvider } from './branding';

export type ReportLanguage = 'zh' | 'en';

/** Reviewed scientific metadata, shared by the UI and the run snapshot. Do not
 * translate paths, sample identifiers, parameter values, commands or raw logs. */
export const WORKFLOW_RUNTIME_PHRASES: ReadonlyArray<readonly [string, string]> = [
  ['ATAC-seq 染色质可及性全流程', 'End-to-end ATAC-seq Chromatin Accessibility Analysis'],
  ['染色质可及性全流程', 'End-to-end chromatin accessibility analysis'],
  ['ChIP-seq 分析全流程', 'End-to-end ChIP-seq Analysis'],
  ['DAP-seq 转录因子结合位点分析与质控流程（中文版）', 'DAP-seq Transcription-Factor Binding Analysis and QC'],
  ['ENCODE 转录因子 ChIP-seq 分析与质控流程（中文版）', 'ENCODE-aligned TF ChIP-seq Analysis and QC'],
  ['ENCODE 组蛋白修饰 ChIP-seq 分析与质控流程（中文版）', 'ENCODE-aligned Histone ChIP-seq Analysis and QC'],
  ['ENCODE ATAC-seq 染色质可及性分析与质控流程（中文版）', 'ENCODE-aligned ATAC-seq Analysis and QC'],
  ['蛋白代谢与多组学', 'Proteomics, Metabolomics & Multi-omics'], ['基因组与变异分析', 'Genomics & Variant Analysis'],
  ['基因编辑与 CRISPR', 'Gene Editing & CRISPR'], ['单细胞与免疫分析', 'Single-cell & Immune Analysis'],
  ['微生物与病原分析', 'Microbiome & Pathogen Analysis'], ['转录组与表观调控', 'Transcriptomics & Epigenomic Regulation'],
  ['DAP-seq 分析：原始序列质控、BWA MEM 比对、过滤去重、裸 gDNA 对照 MACS2 峰调用、FRiP/SPOT/TSS 质控、按转录因子与条件分组的生物学重复 IDR、可重复峰的基序富集与基因注释。', 'DAP-seq analysis with raw-read QC, BWA-MEM alignment, filtering and deduplication, MACS2 peaks against matched naked-gDNA controls, FRiP/SPOT/TSS QC, biological-replicate IDR grouped by transcription factor and condition, and motif enrichment and gene annotation of reproducible peaks.'],
  ['DAP 生物学重复与对照分组表（TSV）', 'DAP biological-replicate and matched-control sheet (TSV)'],
  ['必填列：sample、target、condition、replicate、bam、control_bam。每个转录因子/条件至少两个独立重复；bam 为该样本的 sample.dedup.bam，control_bam 显式指定匹配的裸 gDNA 对照。相对 BAM 路径以 INPUT_DIR 为基准。', 'Required columns: sample, target, condition, replicate, bam, control_bam. Provide at least two independent replicates per target/condition. bam must be sample.dedup.bam; specify the matched naked-gDNA control explicitly. Relative BAM paths are resolved against INPUT_DIR.'],
  ['全局 IDR 阈值', 'Global IDR threshold'], ['IDR 候选峰的宽松 p 值阈值', 'Permissive p-value threshold for IDR candidate peaks'],
  ['必填：填写当前物种的有效基因组大小；hs/mm 仅适用于人/小鼠，不得用于小麦等其他物种。', 'Required: provide the effective genome size for the selected species. hs/mm apply only to human/mouse, not wheat or other species.'],
  ['IDR 单独使用宽松候选峰，不使用经过严格阈值筛选的最终峰；默认 p=0.001，可按实验设计调整。这是 TRACE 的 DAP-seq 扩展，并非 ENCODE 官方流程。', 'IDR uses separate permissive candidate peaks, not pre-filtered final peaks. Default p=0.001; adjust to the experimental design. This is a TRACE DAP-seq extension, not an official ENCODE workflow.'],
  ['显式提供样本、转录因子、条件、独立重复和匹配裸 gDNA 对照；禁止仅根据文件名推测分组。', 'Specify samples, transcription factors, conditions, independent replicates and matched naked-gDNA controls explicitly; do not infer groups from filenames alone.'],
  ['MACS2 窄峰调用（匹配裸 gDNA 对照与 IDR 候选峰）', 'MACS2 narrow-peak calling with matched naked-gDNA controls and IDR candidates'],
  ['按分组表逐样本匹配裸 gDNA 对照；采用 BAMPE，分别产出常规峰与独立的宽松 IDR 候选峰。', 'Match each sample to its naked-gDNA control using the sample sheet. Use BAMPE to generate conventional peaks and separate permissive IDR candidate peaks.'],
  ['生物学重复 IDR 一致性评估', 'Biological-replicate IDR reproducibility assessment'],
  ['仅比较同一转录因子、同一条件的独立生物学重复。全局 IDR 使用第 12 列的 -log10 分数；输出重复对诊断图、分组汇总和可重复峰。单重复、零可重复峰或计算失败均不得标记通过；下游使用 IDR 可重复峰。', 'Compare independent biological replicates of the same transcription factor and condition only. Use the global -log10(IDR) score in column 12; export pairwise diagnostic plots, group summaries and reproducible peaks. A single replicate, zero reproducible peaks or a computation failure cannot establish a pass. Downstream analysis uses IDR-reproducible peaks.'],
  ['DAP 生物学重复 IDR', 'DAP biological-replicate IDR'],
  ['每组至少两个独立重复，且存在通过全局 IDR 阈值的可重复峰', 'At least two independent replicates per group, with reproducible peaks passing the global IDR threshold'],
  ['单重复、零可重复峰、缺少证据或 IDR 计算失败时，不建议继续下游分析', 'Downstream analysis is not recommended with a single replicate, zero reproducible peaks, missing evidence, or an IDR computation failure'],
  ['DAP-seq 生物学重复 IDR 分析工具', 'DAP-seq biological-replicate IDR analysis helper'],
  ['ENCODE TF ChIP-seq 官方结构流程（分支 DAG）', 'ENCODE TF ChIP-seq Workflow Structure (Branched DAG)'],
  ['互补自伪重复与池化伪重复峰调用', 'Complementary self- and pooled-pseudoreplicate peak calling'],
  ['三路 IDR 可重复性评估', 'Three-way IDR reproducibility assessment'],
  ['同一转录因子与条件的双端 ChIP-seq 生物学重复目录，以及一个处理完成的 matched Input 对照 BAM 目录', 'Paired-end ChIP-seq biological replicates for one transcription factor and condition, plus a directory containing one processed matched Input-control BAM'],
  ['三路 IDR 可重复性', 'Three-way IDR reproducibility'],
  ['rescue ratio 与 self-consistency ratio 均≤2，且峰数非零', 'Both rescue and self-consistency ratios ≤2, with nonzero peak counts'],
  ['任一比值>2 或不可计算时不建议继续下游分析', 'Downstream analysis is not recommended if either ratio exceeds 2 or cannot be calculated'],
  ['按模板名与 read group 哈希分成互补且不重叠的两份，保留双端配对；分别合并各重复的 pr1 和 pr2，所有峰采用 BAMPE 模式。仅处理同一靶标、同一条件的生物学重复。', 'Hash template names and read groups into disjoint, complementary halves while preserving read pairs. Pool each replicate\'s pr1 and pr2 separately; call all peaks in BAMPE mode. Use biological replicates of the same target and condition only.'],
  ['全局 IDR 使用第 12 列的 -log10 分数；评估真重复、自伪重复和池化伪重复，同时输出 rescue ratio 与 self-consistency ratio。缺失、零峰或仅单重复不能标记为通过。', 'Use the global -log10(IDR) score in column 12. Assess true, self-pseudoreplicate and pooled-pseudoreplicate pairs; report both rescue and self-consistency ratios. Missing evidence, zero peaks or a single biological replicate cannot establish a pass.'],
  ['参照 ENCODE 依赖结构的原生双端 TF ChIP-seq 流程：链交叉相关性、真重复峰与互补伪重复分支，三路 IDR 与信号质控汇入报告。使用直接文件参数；这是 TRACE 扩展实现，不是官方 WDL。', 'Native paired-end TF ChIP-seq workflow following the ENCODE dependency structure: strand cross-correlation, true-replicate peaks and complementary pseudoreplicates branch separately; three-way IDR and signal QC converge on the report. Direct file parameters are used. This is a TRACE extension, not the official WDL.'],
  ['确定性分析与质控报告生成器', 'Deterministic analysis and QC report generator'],
  ['生成中文分析与质控报告', 'Generate the analysis and QC report'],
  ['生成英文分析与质控报告', 'Generate the analysis and QC report'],
  ['采用生物信息学规范术语；对未达标样本明确标记“文库质控失败”并列出实际失败指标。', 'Use standard bioinformatics terminology; explicitly label failed samples as "Library QC failed" and list the measured failing metrics.'],
];

const phrases = [...BIOINFORMATICS_PHRASES, ...WORKFLOW_PHRASES, ...WORKFLOW_RUNTIME_PHRASES];
const english = new Map(phrases);
const chinese = new Map(phrases.map(([zh, en]) => [en, zh]));

export function normalizeReportLanguage(value: unknown, fallback: ReportLanguage = 'zh'): ReportLanguage {
  return value === 'en' || value === 'en-US' ? 'en' : value === 'zh' || value === 'zh-CN' ? 'zh' : fallback;
}

export function workflowMetadataText(value: string, language: ReportLanguage): string {
  value = currentProductText(value);
  const exact = (language === 'en' ? english : chinese).get(value);
  if (exact !== undefined) return exact;
  if (language === 'en') {
    const submit = value.match(/^写成 ([\w.-]+\.lsf) 后 bsub 提交(；先看报告再决定后续|；单端数据只传 R1 一个文件)?$/);
    if (submit) return `Write ${submit[1]} and submit with bsub${submit[2] === '；先看报告再决定后续' ? '; review the report before proceeding' : submit[2] ? '; pass only R1 for single-end data' : ''}`;
    const reference = value.match(/^可留空：AI 运行时协助查找或(?:在 02_reference\/ 下)?构建（([^\n]+)）$/);
    if (reference) return `May be left empty; AI can help locate or build it${value.includes('02_reference/') ? ' under 02_reference/' : ''} (${reference[1]})`;
    return translateWorkflowTemplate(value) ?? value;
  }
  return value;
}

export function localizeWorkflowMetadata(source: Workflow, language: ReportLanguage): Workflow {
  const w = structuredClone(source);
  const text = (s: string | undefined) => s === undefined ? s : workflowMetadataText(s, language);
  w.name = text(w.name)!; w.description = text(w.description)!;
  w.params = w.params.map(p => ({ ...p, label: text(p.label)!, help: text(p.help), placeholder: text(p.placeholder) }));
  w.steps = w.steps.map(s => ({ ...s, title: text(s.title)!, notes: text(s.notes), phase: text(s.phase),
    ...(s.params ? { params: s.params.map(p => ({ ...p, label: text(p.label)!, help: text(p.help), placeholder: text(p.placeholder) })) } : {}) }));
  if (w.manifest) {
    w.manifest.inputHint = text(w.manifest.inputHint);
    w.manifest.references = w.manifest.references.map(r => ({ ...r, name: text(r.name)!, source: text(r.source) }));
    w.manifest.qcGates = w.manifest.qcGates.map(q => ({ ...q, metric: text(q.metric)!, pass: text(q.pass)!, warn: text(q.warn) }));
  }
  w.assets = w.assets?.map(a => ({ ...a, label: text(a.label) }));
  if (w.provenance) w.provenance = { ...w.provenance, sourceName: currentProductText(w.provenance.sourceName),
    provider: currentProvider(w.provenance.provider) as NonNullable<Workflow['provenance']>['provider'],
    upstreamWorkflow: currentProvider(w.provenance.upstreamWorkflow),
    ...(w.provenance.sourceUrl ? { sourceUrl: currentProductText(w.provenance.sourceUrl) } : {}) };
  return w;
}

/** Only bundled, known report CLIs are modified. Shell commands, references and
 * executable parameters otherwise remain byte-for-byte unchanged. */
export function reportCommandForLanguage(command: string, language: ReportLanguage): string {
  return command.replace(/^([ \t]*python3?\s+[^\n]*\b(?:encode_native_report|hidogV11_trace_report)\.py)([^\n]*)$/gm, (line, head: string, tail: string) => {
    if (/[;&|]/.test(tail)) return line; // Never attach options to a later shell command.
    const rest = tail.replace(/\s+--language\s+(?:zh|en)\b/g, '');
    return `${head}${rest} --language ${language}`;
  });
}
