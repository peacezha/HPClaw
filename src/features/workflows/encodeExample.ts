// 「参考示例」一键填参：按流程把参数自动填成集群上示例参考库里的具体文件路径。
// 用户把 encode-reference-example 包上传到 ~/hpclaw_refs/encode_example 并跑一次
// build_indices.sh 后，点「参考示例」即可直接运行（chr19 小数据集，只用于验证流程跑通）。
export const ENCODE_EXAMPLE_ROOT = '~/hpclaw_refs/encode-reference-example';

export interface EncodeExampleSpec {
  /** 填进 inputs 列表的数据目录（含 smoke FASTQ） */
  inputDir?: string;
  /** 参数名 → 示例值；只填空着的参数，不覆盖用户已填 */
  params: Record<string, string>;
}

const R = (p: string) => `${ENCODE_EXAMPLE_ROOT}/${p}`;

export const ENCODE_EXAMPLES: Record<string, EncodeExampleSpec> = {
  'encode-chipseq-tf': {
    inputDir: R('fastq/chip_smoke'),
    params: {
      INPUT_DIR: R('fastq/chip_smoke'),
      CONTROL_DIR: R('fastq/chip_control'),
      BWA_INDEX: R('bwa_index/GRCh38_chr19'),
      REF_FA: R('GRCh38_chr19.fa.gz'),
      BLACKLIST: R('hg38.blacklist.bed.gz'),
      GENOME_SIZE: '5.9e7',
    },
  },
  'encode-chipseq-histone': {
    inputDir: R('fastq/chip_smoke'),
    params: {
      INPUT_DIR: R('fastq/chip_smoke'),
      CONTROL_DIR: R('fastq/chip_control'),
      BWA_INDEX: R('bwa_index/GRCh38_chr19'),
      REF_FA: R('GRCh38_chr19.fa.gz'),
      BLACKLIST: R('hg38.blacklist.bed.gz'),
      GENOME_SIZE: '5.9e7',
    },
  },
  'encode-atacseq': {
    inputDir: R('fastq/chip_smoke'),
    params: {
      INPUT_DIR: R('fastq/chip_smoke'),
      BOWTIE2_INDEX: R('bowtie2_index/GRCh38_chr19'),
      REF_FA: R('GRCh38_chr19.fa.gz'),
      BLACKLIST: R('hg38.blacklist.bed.gz'),
      TSS_BED: R('GRCh38_chr19.tss.bed.gz'),
      GENOME_SIZE: '5.9e7',
    },
  },
  'encode-rnaseq-bulk': {
    inputDir: R('fastq/rna_rep'),
    params: {
      INPUT_DIR: R('fastq/rna_rep'),
      STAR_INDEX: R('star_index'),
      RSEM_INDEX: R('rsem_index/out/rsem'),
      GTF: R('gencode.v24.chr19.gtf.gz'),
      LAYOUT: 'paired',
      STRANDEDNESS: 'reverse',
    },
  },
};

/** 该流程是否有参考示例可填 */
export function encodeExampleFor(workflowId: string): EncodeExampleSpec | undefined {
  return ENCODE_EXAMPLES[workflowId];
}
