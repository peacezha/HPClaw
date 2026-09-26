// 流程数据准备引导：从流程定义自动生成「数据怎么准备」的说明与可复制模板。
// 用户在运行面板经常看到参数却不知道数据该怎么填——这里把样本表/输入 JSON/
// 目录结构的具体格式直接生成出来，并提供一键复制。
import type { Workflow } from '@/shared/workflow';

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

function inputJsonSkeleton(workflow: Workflow): string {
  return JSON.stringify(
    {
      _说明: `按上游官方 schema 填写；字段名以 ${workflow.provenance?.upstreamWorkflow || '官方 WDL'} 为准`,
      [`${workflow.id.replace(/^encode-/, '').replace(/-/g, '_')}.genome_tsv`]: '/public/home/you/refs/genome.tsv',
      提示: '测试数据包 encode-test-data 里有可直接改用的 input.template.json',
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
export function buildDataPrepGuide(workflow: Workflow): DataPrepGuide {
  const points: string[] = [
    '路径一律用集群上的绝对路径（/public/home/... 开头）；本地文件先经「文件传输」上传到集群。',
    '原始数据建议集中放在一个单独目录；双端数据成对命名（*_R1.fastq.gz / *_R2.fastq.gz）。',
    'gzip 压缩的 .fastq.gz/.fq.gz 直接支持，无需解压。',
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
      label: `样本表（${sheet.name}）`,
      content: withType ? SAMPLE_SHEET_CHIP : SAMPLE_SHEET_RNA,
      filename: 'sample_sheet.tsv',
      param: sheet.name,
    });
    points.unshift(withType
      ? '样本表是 4 列 TSV（type/replicate/read1/read2）：type=chip 或 control，同一重复的多个 lane 写多行。'
      : '样本表是 3 列 TSV（replicate/read1/read2）：每个生物学重复一行，同一重复的多个 lane 写多行。');
  }

  // 官方 input JSON 类（ENCODE WDL 包装流程）
  if (findParam('INPUT_JSON')) {
    templates.push({
      label: '官方 input JSON 骨架',
      content: inputJsonSkeleton(workflow),
      filename: 'input.template.json',
      param: 'INPUT_JSON',
    });
    points.unshift('INPUT_JSON 必须严格符合上游官方 schema；最快的起步方式是改测试数据包里现成的模板。');
  }

  // eCLIP YAML / ChIA-PIPE config
  if (findParam('INPUT_YAML')) {
    points.unshift('INPUT_YAML 从 YeoLab 官方 example（paired_end_clip.yaml）改起；SMInput 对照的 YAML 留 NONE 表示明确跳过归一化。');
  }
  if (findParam('CONFIG_FILE')) {
    points.unshift('CONFIG_FILE 从上游 example_config_file.sh 复制后按集群环境改；必须写清 FASTQ、BWA 索引、chrom sizes、IP 因子与运行类型。');
  }

  const summary = workflow.manifest?.inputHint
    || (sheet ? '准备一个样本表 TSV + 原始 FASTQ 目录' : '准备计算资源上要处理的数据目录或输入文件');

  return { summary, points, templates };
}
