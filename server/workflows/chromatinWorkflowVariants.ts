import type { Workflow, WorkflowParam, WorkflowStep } from './workflowTypes';

type Assay = 'dap' | 'chip-tf' | 'chip-histone' | 'atac';

interface QcSpec {
  assay: Assay;
  bamGlob: string;
  bamSuffix: string;
  peakSuffix: string;
  fripPass: number;
  tssPass?: number;
  includeInsertSize?: boolean;
}

const TARGETS: Array<{ id: string; assay: Assay }> = [
  { id: 'builtin-dapseq-tf', assay: 'dap' },
  { id: 'encode-chipseq-tf', assay: 'chip-tf' },
  { id: 'encode-chipseq-histone', assay: 'chip-histone' },
  { id: 'encode-atacseq', assay: 'atac' },
];

const ENGLISH_IDS: Record<string, string> = {
  'builtin-dapseq-tf': 'builtin-dapseq-tf-en',
  'encode-chipseq-tf': 'encode-chipseq-tf-en',
  'encode-chipseq-histone': 'encode-chipseq-histone-en',
  'encode-atacseq': 'encode-atacseq-en',
};

const ZH_NAMES: Record<Assay, string> = {
  dap: 'DAP-seq 转录因子结合位点分析与质控流程（中文版）',
  'chip-tf': 'ENCODE 转录因子 ChIP-seq 分析与质控流程（中文版）',
  'chip-histone': 'ENCODE 组蛋白修饰 ChIP-seq 分析与质控流程（中文版）',
  atac: 'ENCODE ATAC-seq 染色质可及性分析与质控流程（中文版）',
};

const EN_NAMES: Record<Assay, string> = {
  dap: 'DAP-seq Transcription-Factor Binding Analysis and QC (English)',
  'chip-tf': 'ENCODE-aligned TF ChIP-seq Analysis and QC (English)',
  'chip-histone': 'ENCODE-aligned Histone ChIP-seq Analysis and QC (English)',
  atac: 'ENCODE-aligned ATAC-seq Analysis and QC (English)',
};

const ZH_DESCRIPTIONS: Record<Assay, string> = {
  dap: 'DAP-seq 标准分析：原始序列质控、BWA MEM 比对、高质量比对筛选与去重、以裸 gDNA 文库为阴性对照的 MACS2 窄峰调用，并输出 FRiP、SPOT、TSS 富集曲线、信号轨迹、基序富集和峰关联基因。',
  'chip-tf': '参照 ENCODE 转录因子 ChIP-seq 分析框架：比对、过滤去重、链交叉相关性、MACS2 窄峰、FRiP 与 IDR；扩展输出 SPOT 值和 TSS 富集曲线。',
  'chip-histone': '参照 ENCODE 组蛋白修饰 ChIP-seq 分析框架：比对、过滤去重、链交叉相关性、SPP 宽峰、FRiP 与 IDR；扩展输出 SPOT 值和 TSS 富集曲线。',
  atac: '参照 ENCODE ATAC-seq 分析框架：Bowtie2 比对、细胞器序列去除、高质量比对筛选与去重、Tn5 插入位点校正、MACS2 开放染色质峰调用，并输出 FRiP、SPOT、TSS 富集曲线和片段长度分布。',
};

const EN_DESCRIPTIONS: Record<Assay, string> = {
  dap: 'DAP-seq analysis with raw-read QC, BWA-MEM alignment, high-quality alignment filtering and deduplication, MACS2 narrow-peak calling against a naked-gDNA control, FRiP, SPOT, TSS-enrichment profiles, signal tracks, motif enrichment, and peak-to-gene annotation.',
  'chip-tf': 'ENCODE-aligned TF ChIP-seq analysis with alignment, filtering and deduplication, strand cross-correlation, MACS2 narrow peaks, FRiP and IDR, plus extended SPOT and TSS-enrichment-profile QC.',
  'chip-histone': 'ENCODE-aligned histone ChIP-seq analysis with alignment, filtering and deduplication, strand cross-correlation, SPP broad peaks, FRiP and IDR, plus extended SPOT and TSS-enrichment-profile QC.',
  atac: 'ENCODE-aligned ATAC-seq analysis with Bowtie2 alignment, organelle-read removal, high-quality alignment filtering and deduplication, Tn5 insertion-site correction, MACS2 accessible-chromatin peaks, FRiP, SPOT, TSS-enrichment profiles, and fragment-size distribution.',
};

function replaceParam(params: WorkflowParam[], param: WorkflowParam): WorkflowParam[] {
  const next = params.filter(item => item.name !== 'BLACKLIST' && item.name !== param.name);
  const referenceIndex = next.findIndex(item => item.name === 'REF_FA');
  next.splice(referenceIndex >= 0 ? referenceIndex + 1 : next.length, 0, param);
  return next;
}

function tssParam(language: 'zh' | 'en'): WorkflowParam {
  return language === 'zh'
    ? { name: 'TSS_BED', label: '转录起始位点（TSS）注释 BED', type: 'path', help: '必填；与参考基因组版本一致，用于计算 TSS 富集曲线与富集分数。' }
    : { name: 'TSS_BED', label: 'Transcription start sites (TSS), BED', type: 'path', help: 'Required. Must match the reference assembly; used for the TSS-enrichment profile and score.' };
}

function qcCommand(spec: QcSpec): string {
  const tssThreshold = spec.tssPass === undefined ? 'None' : String(spec.tssPass);
  const insert = spec.includeInsertSize
    ? '\n  java -jar $EBROOTPICARD/picard.jar CollectInsertSizeMetrics I="$b" O=qc/"${s}".insert_size_metrics.txt H=qc/"${s}".insert_size.png'
    : '';
  return `#BSUB -J ${spec.assay.replace(/[^a-z]/g, '_')}_signal_qc -n {{THREADS}} -q {{QUEUE}}
module load deepTools/3.5.1 SAMtools/1.17 BEDTools/2.30.0${spec.includeInsertSize ? ' Picard/2.27.4' : ''}
cd {{INPUT_DIR}} && mkdir -p qc/tracks hotspots
: > qc/frip.tsv
: > qc/spot.tsv
: > qc/tss_enrichment.tsv
for b in ${spec.bamGlob}; do
  s=\${b%${spec.bamSuffix}}
  bw=qc/tracks/"\${s}".rpkm.bw
  bamCoverage -b "$b" -o "$bw" -p {{THREADS}} --normalizeUsing RPKM
  computeMatrix reference-point --referencePoint TSS -S "$bw" -R {{TSS_BED}} -a 2000 -b 2000 --binSize 10 -p {{THREADS}} -o qc/"\${s}".tss.mat.gz
  plotProfile -m qc/"\${s}".tss.mat.gz -o qc/"\${s}".tss_enrichment.png --outFileNameData qc/"\${s}".tss_profile.tsv --plotTitle "\${s} TSS enrichment"
  python3 - "$s" qc/"\${s}".tss.mat.gz >> qc/tss_enrichment.tsv <<'PY'
import gzip, json, math, sys
sample, path = sys.argv[1:]
rows = []
with gzip.open(path, 'rt') as fh:
    for line in fh:
        if line.startswith('@'):
            continue
        fields = line.rstrip().split('\\t')[6:]
        try:
            values = [float(v) for v in fields]
        except ValueError:
            continue
        rows.append(values)
if not rows:
    raise SystemExit('TSS matrix has no numeric rows: ' + path)
means = []
for column in zip(*rows):
    valid = [v for v in column if not math.isnan(v)]
    means.append(sum(valid) / len(valid) if valid else 0.0)
edge = means[:10] + means[-10:]
noise = sum(edge) / len(edge) if edge else 0.0
mid = len(means) // 2
score = max(means[max(0, mid - 10):mid + 10]) / noise if noise > 0 else 0.0
print('%s\\t%.4f' % (sample, score))
PY${insert}
  total=$(samtools view -c "$b")
  inpeak=$(bedtools intersect -a "$b" -b peaks/"\${s}"${spec.peakSuffix} -u | samtools view -c - || true)
  printf '%s\\t%s\\t%s\\n' "$s" "$total" "$inpeak" >> qc/frip.tsv
  samtools view -H "$b" | awk -F'\\t' '/^@SQ/{split($2,a,":");split($3,c,":");print a[2]"\\t0\\t"c[2]}' > qc/"\${s}".chrom.sizes.bed
  hotspot2.sh -c qc/"\${s}".chrom.sizes.bed "$b" hotspots/"\${s}"
  spot_file=$(find hotspots/"\${s}" -type f -name '*.SPOT.txt' | head -1)
  test -s "$spot_file"
  printf '%s\\t%s\\n' "$s" "$(tr -d '[:space:]' < "$spot_file")" >> qc/spot.tsv
done
python3 - ${spec.fripPass} ${tssThreshold} <<'PY'
import csv, json, os, sys
frip_min = float(sys.argv[1])
tss_min = None if sys.argv[2] == 'None' else float(sys.argv[2])
def ratios(path):
    out = {}
    with open(path) as fh:
        for row in csv.reader(fh, delimiter='\\t'):
            if len(row) >= 3:
                out[row[0]] = int(row[2]) / int(row[1]) if int(row[1]) else 0.0
            elif len(row) >= 2:
                out[row[0]] = float(row[1])
    return out
frip, spot, tss = ratios('qc/frip.tsv'), ratios('qc/spot.tsv'), ratios('qc/tss_enrichment.tsv')
libqc = {}
if os.path.exists('qc/qc.json'):
    with open('qc/qc.json') as fh: libqc = json.load(fh)
samples = sorted(set(frip) | set(spot) | set(tss))
with open('qc/library_verdict.tsv', 'w', newline='') as out:
    writer = csv.writer(out, delimiter='\\t', lineterminator='\\n')
    writer.writerow(['sample', 'verdict', 'reason'])
    for sample in samples:
        reasons = []
        if sample not in frip or frip[sample] < frip_min: reasons.append('FRiP below QC threshold')
        if sample not in spot: reasons.append('SPOT unavailable')
        if sample not in tss: reasons.append('TSS enrichment unavailable')
        if tss_min is not None and sample in tss and tss[sample] < tss_min: reasons.append('TSS enrichment below QC threshold')
        for metric, cutoff in [('NSC', 1.05), ('RSC', 0.8), ('NRF', 0.8)]:
            value = (libqc.get(sample) or {}).get(metric)
            if value is not None and float(value) < cutoff: reasons.append(metric + ' below QC threshold')
        verdict = 'FAILED' if reasons else 'PASS'
        writer.writerow([sample, verdict, '; '.join(reasons) if reasons else 'All required library QC checks passed'])
PY
test -s qc/library_verdict.tsv`;
}

function reportCommand(language: 'zh' | 'en', assay: Assay): string {
  return `python3 <RUN>/tools/encode_native_report.py --run-dir <RUN> --input-dir {{INPUT_DIR}} --report-dir <RUN>/reports/final-report --language ${language} --assay ${assay}\ntest -s <RUN>/reports/final-report/report.html`;
}

function preflightCommand(assay: Assay): string {
  const indexCheck = assay === 'atac' ? 'test -s {{BOWTIE2_INDEX}}.1.bt2' : 'test -s {{BWA_INDEX}}.sa';
  return `set -euo pipefail
test -d {{INPUT_DIR}}
${indexCheck}
test -s {{REF_FA}}
test -s {{TSS_BED}}
command -v hotspot2.sh
command -v samtools
command -v bedtools
command -v computeMatrix
command -v plotProfile`;
}

function englishCommand(commandText: string): string {
  return commandText
    .replace('# 重复≥2 时对真重复跑 IDR（合并池峰为 oracle）；单重复改用自我伪重复 IDR', '# Run true-replicate IDR for two or more replicates; use self-pseudoreplicates for a single replicate')
    .replace('SKIP: 需要至少 2 个重复 peaks 才能算 IDR', 'SKIP: at least two replicate peak sets are required for IDR')
    .replace('Np(伪重复)/Nt(真重复) < 2 达标，>= 2 判重复间不一致', 'Np(pseudoreplicate)/Nt(true replicate) < 2 passes; >= 2 indicates replicate inconsistency')
    .replace('SKIP: 未提供 MOTIF_DB 或无 MEME Suite（ame），跳过基序富集', 'SKIP: MOTIF_DB or MEME Suite (ame) is unavailable; motif enrichment was skipped')
    .replace('SKIP: 未提供 GENES_BED，跳过峰基因注释', 'SKIP: GENES_BED is unavailable; peak-to-gene annotation was skipped');
}

function setStep(step: WorkflowStep, title: string, command: string, notes: string): void {
  step.title = title;
  step.command = command;
  step.notes = notes;
}

function commonManifest(workflow: Workflow, language: 'zh' | 'en'): void {
  if (!workflow.manifest) return;
  workflow.manifest.references = (workflow.manifest.references || []).filter(ref => ref.path !== '{{TSS_BED}}' && !/BLACKLIST/i.test(String(ref.path)) && !/blacklist|黑名单/i.test(ref.name));
  workflow.manifest.references.push({
    name: language === 'zh' ? '转录起始位点（TSS）注释 BED' : 'Transcription start sites (TSS), BED',
    path: '{{TSS_BED}}', type: 'annotation',
    source: language === 'zh' ? '由与参考基因组同版本的 GTF/GFF 生成' : 'Generate from a GTF/GFF matching the reference assembly',
    required: true,
  });
  const hotspot = workflow.manifest.software.find(item => /hotspot2/i.test(item.name));
  if (hotspot) {
    hotspot.checkCmd = 'command -v hotspot2.sh';
    hotspot.required = true;
  } else {
    workflow.manifest.software.push({ name: 'Hotspot2', checkCmd: 'command -v hotspot2.sh', required: true });
  }
}

function upgradeChinese(workflow: Workflow, assay: Assay): void {
  workflow.name = ZH_NAMES[assay];
  workflow.description = ZH_DESCRIPTIONS[assay];
  workflow.keywords = Array.from(new Set([...workflow.keywords, 'SPOT', 'TSS 富集', '文库质控', '中文版']));
  workflow.params = replaceParam(workflow.params, tssParam('zh'));
  const zhLabels: Record<string, string> = {
    INPUT_DIR: '原始 FASTQ 文件目录（*_R1.fq.gz / *_R2.fq.gz）',
    CONTROL_DIR: assay === 'dap' ? '裸 gDNA 阴性对照文库目录' : 'Input/IgG 对照文库目录',
    BWA_INDEX: 'BWA 参考基因组索引前缀', BOWTIE2_INDEX: 'Bowtie2 参考基因组索引前缀',
    REF_FA: '参考基因组 FASTA', TSS_BED: '转录起始位点（TSS）注释 BED',
    GENES_BED: '基因注释 BED/GFF', GENOME_SIZE: 'MACS2 有效基因组大小', MOTIF_DB: 'MEME 格式基序数据库',
    ORGANELLE_REGEX: '细胞器染色体名称模式（线粒体+叶绿体）', QUEUE: '作业队列', THREADS: '线程数',
  };
  workflow.params = workflow.params.map(param => ({ ...param, label: zhLabels[param.name] || param.label }));
  commonManifest(workflow, 'zh');

  const preflight = workflow.steps[0];
  preflight.title = '运行前检查：软件、输入文件与参考数据';
  preflight.command = preflightCommand(assay);
  preflight.notes = '只读检查。TSS 注释 BED 和 Hotspot2 为必需项；任一缺失时停止并返回明确原因。';

  if (assay === 'dap') {
    setStep(workflow.steps[1], '原始序列质控（FastQC）', workflow.steps[1].command, '检查碱基质量、接头残留和序列含量分布。');
    setStep(workflow.steps[2], 'BWA MEM 比对与坐标排序', workflow.steps[2].command, '实验文库和裸 gDNA 对照文库需采用相同参数处理。');
    setStep(workflow.steps[3], '高质量比对筛选与 PCR 重复去除', workflow.steps[3].command, 'MAPQ≥30；保留正确配对并去除未比对、次要比对、质控失败和 PCR 重复 reads。');
    setStep(workflow.steps[4], 'MACS2 窄峰调用（裸 gDNA 阴性对照）', workflow.steps[4].command
      .replace(/\n  if \[ -s \{\{BLACKLIST\}\} \]; then[\s\S]*?\n  fi\n/g, '\n  cp peaks/"${s}"_peaks.narrowPeak peaks/"${s}".peaks.final.bed\n'), '裸 gDNA 对照是 DAP-seq 背景校正的关键；候选峰供后续富集质控与注释。');
    setStep(workflow.steps[5], '扩展质控：FRiP、SPOT、TSS 富集曲线与信号轨迹', qcCommand({ assay, bamGlob: '*.dedup.bam', bamSuffix: '.dedup.bam', peakSuffix: '.peaks.final.bed', fripPass: 0.05 }), 'SPOT 由 Hotspot2 直接输出；TSS 富集曲线作为促进子附近信号的扩展诊断，不作为 DAP-seq 的 ENCODE 强制门槛。qc/library_verdict.tsv 对每个文库直接给出 PASS 或 FAILED 及未达标指标。');
    workflow.steps[6].title = '基序富集与峰关联基因注释';
    setStep(workflow.steps[7], '生成中文分析与质控报告', reportCommand('zh', assay), '采用生物信息学规范术语；对未达标样本明确标记“文库质控失败”并列出实际失败指标。');
    if (workflow.manifest) workflow.manifest.qcGates = [
      { afterStep: 4, metric: '比对质量与文库复杂度', pass: '高质量比对率与去重后保留率达到项目预设标准', warn: '任一关键指标低于阈值时直接标记文库质控失败' },
      { afterStep: 6, metric: 'FRiP、SPOT 与 TSS 富集曲线', pass: 'FRiP≥5%；SPOT 和 TSS 曲线必须成功产出', warn: '指标缺失或 FRiP<5% 时标记文库质控失败' },
    ];
  } else if (assay === 'chip-tf' || assay === 'chip-histone') {
    const broad = assay === 'chip-histone';
    const peakIndex = 5;
    const qcIndex = 6;
    workflow.steps[1].title = '原始序列质控（FastQC）';
    workflow.steps[2].title = 'BWA MEM 比对与坐标排序';
    workflow.steps[3].title = '高质量比对筛选与 PCR 重复去除';
    workflow.steps[4].title = '链交叉相关性与文库复杂度质控';
    workflow.steps[peakIndex].title = broad ? 'SPP 宽峰调用' : 'MACS2 窄峰调用';
    workflow.steps[peakIndex].command = broad
      ? workflow.steps[peakIndex].command.replace(/\n  bedtools intersect -a peaks\/"\$\{s\}"\.regionPeak -b \{\{BLACKLIST\}\} -v > peaks\/"\$\{s\}"\.peaks\.final\.bed/, '\n  cp peaks/"${s}".regionPeak peaks/"${s}".peaks.final.bed')
      : workflow.steps[peakIndex].command.replace(/\n  bedtools intersect -a peaks\/"\$\{s\}"_peaks\.narrowPeak -b \{\{BLACKLIST\}\} -v > peaks\/"\$\{s\}"\.peaks\.final\.bed/, '\n  cp peaks/"${s}"_peaks.narrowPeak peaks/"${s}".peaks.final.bed');
    workflow.steps[peakIndex].notes = '使用 Input/IgG 文库估计背景；候选峰供后续 FRiP 与 IDR 评估。';
    setStep(workflow.steps[qcIndex], '扩展质控：SPOT、TSS 富集曲线与信号轨迹', qcCommand({ assay, bamGlob: '*.dedup.bam', bamSuffix: '.dedup.bam', peakSuffix: '.peaks.final.bed', fripPass: 0.01 }), 'SPOT 由 Hotspot2 直接输出；TSS 富集曲线是扩展诊断，其形态受靶蛋白或组蛋白修饰类型影响，不作为 ChIP-seq 的统一强制阈值。qc/library_verdict.tsv 直接给出文库 PASS/FAILED 及未达标指标。');
    workflow.steps[7].title = 'FRiP 与重复间 IDR 一致性评估';
    setStep(workflow.steps[8], '生成中文分析与质控报告', reportCommand('zh', assay), '采用生物信息学规范术语；对未达标样本明确标记“文库质控失败”并列出实际失败指标。');
    if (workflow.manifest) workflow.manifest.qcGates = [
      { afterStep: 5, metric: '链交叉相关性与文库复杂度', pass: 'NSC≥1.05、RSC≥0.8、NRF≥0.8', warn: '任一关键指标低于阈值时标记文库质控失败' },
      { afterStep: 7, metric: 'SPOT 与 TSS 富集曲线', pass: 'SPOT 值与 TSS 富集曲线均成功产出', warn: '任一产物缺失时标记文库质控失败' },
      { afterStep: 8, metric: 'FRiP 与重复间 IDR', pass: 'FRiP≥1%，IDR rescue ratio<2', warn: 'FRiP<1% 或 IDR 不一致时标记文库质控失败' },
    ];
  } else {
    workflow.steps[1].title = '原始序列质控（FastQC）';
    workflow.steps[2].title = 'Bowtie2 比对与坐标排序';
    setStep(workflow.steps[3], '细胞器序列去除、高质量比对筛选与去重', workflow.steps[3].command
      .replace('  bedtools intersect -a "${s}.dedup.bam" -b {{BLACKLIST}} -v > "${s}.final.bam"', '  cp "${s}.dedup.bam" "${s}.final.bam"'), '去除线粒体/叶绿体序列、低质量比对、次要比对、质控失败 reads 和 PCR 重复。');
    workflow.steps[4].title = 'Tn5 插入位点校正与 MACS2 开放染色质峰调用';
    setStep(workflow.steps[5], '质控：TSS 富集曲线、FRiP、SPOT、片段长度分布与信号轨迹', qcCommand({ assay, bamGlob: '*.final.bam', bamSuffix: '.final.bam', peakSuffix: '_peaks.narrowPeak', fripPass: 0.2, tssPass: 6, includeInsertSize: true }), 'ATAC-seq 关键信噪指标：TSS 富集分数≥6、FRiP≥0.2；同时必须产出 Hotspot2 SPOT 值和 TSS 富集曲线。未达标时 qc/library_verdict.tsv 直接标记 FAILED 并列出未达标指标。');
    setStep(workflow.steps[6], '生成中文分析与质控报告', reportCommand('zh', assay), '采用生物信息学规范术语；对未达标样本明确标记“文库质控失败”并列出实际失败指标。');
    if (workflow.manifest) workflow.manifest.qcGates = [
      { afterStep: 4, metric: '高质量比对率与细胞器序列占比', pass: '高质量比对率达到项目标准，线粒体+叶绿体占比<20%', warn: '任一关键指标低于阈值时标记文库质控失败' },
      { afterStep: 6, metric: 'TSS 富集、FRiP 与 SPOT', pass: 'TSS 富集分数≥6、FRiP≥0.2，且 SPOT/TSS 曲线产物完整', warn: '任一必需指标缺失或低于阈值时标记文库质控失败' },
    ];
  }
  if (workflow.provenance) workflow.provenance.importerVersion = 'chromatin-qc-bilingual-v2';
}

function englishParam(param: WorkflowParam): WorkflowParam {
  const labels: Record<string, string> = {
    INPUT_DIR: 'FASTQ directory (*_R1.fq.gz / *_R2.fq.gz)', CONTROL_DIR: 'Control-library directory',
    BWA_INDEX: 'BWA index prefix', BOWTIE2_INDEX: 'Bowtie2 index prefix', REF_FA: 'Reference genome FASTA',
    TSS_BED: 'Transcription start sites (TSS), BED', GENES_BED: 'Gene annotation, BED/GFF',
    GENOME_SIZE: 'MACS2 effective genome size', MOTIF_DB: 'Motif database in MEME format',
    ORGANELLE_REGEX: 'Organelle chromosome-name pattern', QUEUE: 'Queue', THREADS: 'Threads',
  };
  const help: Record<string, string> = {
    TSS_BED: 'Required. Must match the reference assembly.', GENOME_SIZE: 'Use hs, mm, or a numeric effective genome size.',
    ORGANELLE_REGEX: 'Adjust this pattern to the mitochondrial and chloroplast chromosome names in the selected assembly; leave empty to retain organelle reads.',
  };
  return { ...param, label: labels[param.name] || param.label, placeholder: param.required === false ? 'Optional; the agent can help locate or prepare this input' : param.placeholder, help: help[param.name] };
}

function englishClone(source: Workflow, assay: Assay, now: number): Workflow {
  const clone = JSON.parse(JSON.stringify(source)) as Workflow;
  clone.id = ENGLISH_IDS[source.id];
  clone.name = EN_NAMES[assay];
  clone.description = EN_DESCRIPTIONS[assay];
  clone.keywords = Array.from(new Set([...clone.keywords.filter(word => !/[\u3400-\u9fff]/.test(word)), 'English', 'SPOT', 'TSS enrichment', 'library QC']));
  clone.params = clone.params.map(englishParam);
  const titles: Record<Assay, string[]> = {
    dap: ['Preflight: software, inputs, and references', 'Raw-read QC with FastQC', 'BWA-MEM alignment and coordinate sorting', 'High-quality alignment filtering and PCR duplicate removal', 'MACS2 narrow-peak calling against the naked-gDNA control', 'Extended QC: FRiP, SPOT, TSS-enrichment profile, and signal tracks', 'Motif enrichment and peak-to-gene annotation', 'Generate the English analysis and QC report'],
    'chip-tf': ['Preflight: software, inputs, and references', 'Raw-read QC with FastQC', 'BWA-MEM alignment and coordinate sorting', 'High-quality alignment filtering and PCR duplicate removal', 'Strand cross-correlation and library-complexity QC', 'MACS2 narrow-peak calling', 'Extended QC: SPOT, TSS-enrichment profile, and signal tracks', 'FRiP and cross-replicate IDR reproducibility', 'Generate the English analysis and QC report'],
    'chip-histone': ['Preflight: software, inputs, and references', 'Raw-read QC with FastQC', 'BWA-MEM alignment and coordinate sorting', 'High-quality alignment filtering and PCR duplicate removal', 'Strand cross-correlation and library-complexity QC', 'SPP broad-peak calling', 'Extended QC: SPOT, TSS-enrichment profile, and signal tracks', 'FRiP and cross-replicate IDR reproducibility', 'Generate the English analysis and QC report'],
    atac: ['Preflight: software, inputs, and references', 'Raw-read QC with FastQC', 'Bowtie2 alignment and coordinate sorting', 'Organelle-read removal, high-quality alignment filtering, and deduplication', 'Tn5 insertion-site correction and MACS2 accessible-chromatin peak calling', 'QC: TSS-enrichment profile, FRiP, SPOT, fragment-size distribution, and signal tracks', 'Generate the English analysis and QC report'],
  };
  clone.steps.forEach((step, index) => {
    step.title = titles[assay][index] || step.title;
    step.command = englishCommand(step.command);
    step.notes = index === clone.steps.length - 1
      ? 'Uses standard bioinformatics terminology. A failed sample is reported explicitly as "Library QC failed" with the failed metrics.'
      : 'Follow the declared inputs, outputs, and assay-specific QC criteria.';
  });
  clone.steps[clone.steps.length - 1].command = reportCommand('en', assay);
  if (clone.manifest) {
    clone.manifest.inputHint = assay === 'dap'
      ? 'Paired-end DAP-seq FASTQs plus a naked-gDNA negative-control library'
      : assay === 'atac' ? 'Paired-end ATAC-seq FASTQs' : 'Paired-end ChIP-seq FASTQs plus an Input/IgG control library';
    const refNames: Record<string, string> = {
      '{{BWA_INDEX}}': 'BWA index', '{{BOWTIE2_INDEX}}': 'Bowtie2 index', '{{REF_FA}}': 'Reference genome FASTA',
      '{{TSS_BED}}': 'Transcription start sites (TSS), BED', '{{GENES_BED}}': 'Gene annotation, BED/GFF',
      '{{MOTIF_DB}}': 'Motif database in MEME format',
    };
    clone.manifest.references = clone.manifest.references.map(ref => ({
      ...ref,
      name: refNames[String(ref.path)] || ref.name,
      source: ref.path === '{{TSS_BED}}'
        ? 'Generate from a GTF/GFF matching the reference assembly'
        : ref.required ? 'Provide a file matching the selected reference assembly' : 'Optional; locate or prepare this resource when needed',
    }));
    clone.manifest.qcGates = assay === 'atac' ? [
      { afterStep: 4, metric: 'High-quality alignment rate and organelle-read fraction', pass: 'Project alignment criterion met and mitochondrial + chloroplast fraction <20%', warn: 'Library QC failed when a required metric is below its threshold' },
      { afterStep: 6, metric: 'TSS enrichment, FRiP, and SPOT', pass: 'TSS enrichment ≥6, FRiP ≥0.2, and complete SPOT/TSS-profile outputs', warn: 'Library QC failed when a required metric is missing or below its threshold' },
    ] : assay === 'dap' ? [
      { afterStep: 4, metric: 'Alignment quality and library complexity', pass: 'Project high-quality-alignment and post-deduplication retention criteria met', warn: 'Library QC failed when a required metric is below its threshold' },
      { afterStep: 6, metric: 'FRiP, SPOT, and TSS-enrichment profile', pass: 'FRiP ≥5% and complete SPOT/TSS-profile outputs', warn: 'Library QC failed when a required metric is missing or FRiP <5%' },
    ] : [
      { afterStep: 5, metric: 'Strand cross-correlation and library complexity', pass: 'NSC ≥1.05, RSC ≥0.8, and NRF ≥0.8', warn: 'Library QC failed when a required metric is below its threshold' },
      { afterStep: 7, metric: 'SPOT and TSS-enrichment profile', pass: 'Both the SPOT value and TSS-enrichment profile are produced', warn: 'Library QC failed when either required output is missing' },
      { afterStep: 8, metric: 'FRiP and cross-replicate IDR', pass: 'FRiP ≥1% and IDR rescue ratio <2', warn: 'Library QC failed when FRiP or IDR reproducibility does not meet the criterion' },
    ];
  }
  clone.createdAt = now;
  clone.updatedAt = now;
  clone.assets = clone.assets?.map(asset => ({ ...asset, label: asset.remotePath === 'tools/encode_native_report.py' ? 'Deterministic analysis and QC report generator' : asset.label }));
  if (clone.provenance) clone.provenance.importerVersion = 'chromatin-qc-bilingual-v2-en';
  return clone;
}

/** Apply the no-blacklist QC policy and add English variants while preserving legacy IDs for upgrades. */
export function addChromatinWorkflowVariants(workflows: Workflow[], now: number): void {
  for (const target of TARGETS) {
    const workflow = workflows.find(item => item.id === target.id);
    if (workflow) upgradeChinese(workflow, target.assay);
  }
  for (const target of TARGETS) {
    const source = workflows.find(item => item.id === target.id);
    if (!source || workflows.some(item => item.id === ENGLISH_IDS[target.id])) continue;
    workflows.push(englishClone(source, target.assay, now));
  }
}
