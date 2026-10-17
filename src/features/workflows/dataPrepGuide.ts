// 流程数据准备引导：从流程定义自动生成「数据怎么准备」的说明与可复制模板。
// 用户在运行面板经常看到参数却不知道数据该怎么填——这里把样本表/输入 JSON/
// 目录结构的具体格式直接生成出来，并提供一键复制。
import type { Workflow } from '@/shared/workflow';
import { workflowMetadataText } from '@/shared/workflowLocale';

export interface DataPrepTemplate {
  /** 模板标题，如「样本表 sample_sheet.tsv」 */
  label: string;
  /** 可直接复制/保存的文件内容 */
  content: string;
  /** 建议文件名 */
  filename: string;
  /** 模板对应的参数名 */
  param: string;
}

export interface DataPrepGuide {
  /** 一句话说明数据形态（来自 manifest.inputHint 或参数推断） */
  summary: string;
  /** 数据准备的要点列表（路径规则、成对规则、目录结构等） */
  points: string[];
  /** 可复制的文件模板（样本表/输入 JSON 骨架等） */
  templates: DataPrepTemplate[];
}

const SAMPLE_SHEET_CHIP = [
  'type\treplicate\tread1\tread2',
  'chip\t1\t/public/home/you/data/chip_rep1_R1.fastq.gz\t/public/home/you/data/chip_rep1_R2.fastq.gz',
  'chip\t2\t/public/home/you/data/chip_rep2_R1.fastq.gz\t/public/home/you/data/chip_rep2_R2.fastq.gz',
  'control\t1\t/public/home/you/data/input_rep1_R1.fastq.gz\t/public/home/you/data/input_rep1_R2.fastq.gz',
  'control\t2\t/public/home/you/data/input_rep2_R1.fastq.gz\t/public/home/you/data/input_rep2_R2.fastq.gz',
].join('\n');

const SAMPLE_SHEET_RNA = [
  'replicate\tread1\tread2',
  '1\t/public/home/you/data/sampleA_R1.fastq.gz\t/public/home/you/data/sampleA_R2.fastq.gz',
  '2\t/public/home/you/data/sampleB_R1.fastq.gz\t/public/home/you/data/sampleB_R2.fastq.gz',
].join('\n');

function inputJsonSkeleton(workflow: Workflow, english: boolean): string {
  return JSON.stringify(
    {
      _note: english
        ? `Illustrative skeleton only; use the exact input schema of ${workflow.provenance?.upstreamWorkflow || 'the official WDL'}. Remove note fields before running.`
        : `仅为示意骨架；字段以 ${workflow.provenance?.upstreamWorkflow || '官方 WDL'} 的输入 schema 为准。运行前删除说明字段。`,
      [`${workflow.id.replace(/^encode-/, '').replace(/-/g, '_')}.genome_tsv`]: '/public/home/you/refs/genome.tsv',
      _hint: english ? 'Adapt input.template.json from encode-test-data; verify all required fields.' : '从 encode-test-data 中改用 input.template.json，并核查全部必需字段。',
    },
    null,
    2,
  );
}

/** 该流程是否需要用户准备数据（纯运维/参数流程不需要） */
export function workflowNeedsDataPrep(workflow: Workflow): boolean {
  return Boolean(workflow.manifest?.inputHint)
    || workflow.params.some(p => p.type === 'path' || /INPUT|DATA|FASTQ|SAMPLE|SHEET|JSON|YAML|CONFIG/i.test(p.name));
}

/** 由流程定义生成数据准备引导。 */
export function buildDataPrepGuide(workflow: Workflow, locale: 'zh-CN' | 'en-US' = 'zh-CN'): DataPrepGuide {
  const english = locale === 'en-US';
  const text = (zh: string, en: string) => english ? en : zh;
  const points: string[] = [
    text('路径一律用集群上的绝对路径（/public/home/... 开头）；本地文件先经「文件传输」上传到集群。', 'Use absolute paths on the cluster (for example, /public/home/...). Upload local files to the cluster using File Transfer first.'),
    text('原始数据建议集中放在一个单独目录；双端数据成对命名（*_R1.fastq.gz / *_R2.fastq.gz）。', 'Keep raw reads in a dedicated directory. Name paired-end files consistently (*_R1.fastq.gz / *_R2.fastq.gz).'),
    text('gzip 压缩的 .fastq.gz/.fq.gz 直接支持，无需解压。', 'gzip-compressed .fastq.gz/.fq.gz files are supported directly; decompression is not required.'),
  ];
  const templates: DataPrepTemplate[] = [];
  const params = workflow.params;
  const findParam = (name: string) => params.find(p => p.name === name);

  // 样本表类（ChIP / RNA-seq）
  const sheet = findParam('SAMPLE_SHEET') || findParam('SAMPLE_LIST');
  if (sheet) {
    const withType = workflow.params.some(p => p.name === 'CONTROL_DIR')
      || /chip|control/i.test(sheet.label + (sheet.help || ''));
    templates.push({
      label: text(`样本表（${sheet.name}）`, `Sample sheet (${sheet.name})`),
      content: withType ? SAMPLE_SHEET_CHIP : SAMPLE_SHEET_RNA,
      filename: 'sample_sheet.tsv',
      param: sheet.name,
    });
    points.unshift(withType
      ? text('样本表是 4 列 TSV（type/replicate/read1/read2）：type=chip 或 control，同一重复的多个 lane 写多行。', 'Use a four-column TSV sample sheet (type/replicate/read1/read2): type is chip or control. List multiple sequencing lanes from the same replicate on separate rows.')
      : text('样本表是 3 列 TSV（replicate/read1/read2）：每个生物学重复一行，同一重复的多个 lane 写多行。', 'Use a three-column TSV sample sheet (replicate/read1/read2). Include one row per biological replicate, or separate rows for multiple sequencing lanes from the same replicate.'));
  }

  // 官方 input JSON 类（ENCODE WDL 包装流程）
  if (findParam('INPUT_JSON')) {
    templates.push({
      label: text('官方 input JSON 骨架（需按上游 schema 核对）', 'Official input JSON skeleton (verify against the upstream schema)'),
      content: inputJsonSkeleton(workflow, english),
      filename: 'input.template.json',
      param: 'INPUT_JSON',
    });
    points.unshift(text('INPUT_JSON 必须严格符合上游官方 schema；最快的起步方式是改测试数据包里现成的模板。', 'INPUT_JSON must conform exactly to the upstream input schema. Start by adapting the template supplied with the test dataset.'));
  }

  // eCLIP YAML / ChIA-PIPE config
  if (findParam('INPUT_YAML')) {
    points.unshift(text('INPUT_YAML 从 YeoLab 官方 example（paired_end_clip.yaml）改起；SMInput 对照的 YAML 留 NONE 表示明确跳过归一化。', 'Adapt INPUT_YAML from the official YeoLab example (paired_end_clip.yaml). Setting the size-matched input control YAML to NONE explicitly skips normalization.'));
  }
  if (findParam('CONFIG_FILE')) {
    points.unshift(text('CONFIG_FILE 从上游 example_config_file.sh 复制后按集群环境改；必须写清 FASTQ、BWA 索引、chrom sizes、IP 因子与运行类型。', 'Adapt the upstream example_config_file.sh to your cluster. Specify FASTQ files, the BWA index, chromosome sizes, the immunoprecipitation target and the run type.'));
  }

  const summary = workflow.manifest?.inputHint
    ? workflowMetadataText(workflow.manifest.inputHint, english ? 'en' : 'zh')
    : (sheet ? text('准备一个样本表 TSV + 原始 FASTQ 目录', 'Prepare a TSV sample sheet and a directory containing the raw FASTQ files.')
      : text('准备计算资源上要处理的数据目录或输入文件', 'Prepare the input files or data directory on the compute resource.'));

  return { summary, points, templates };
}
