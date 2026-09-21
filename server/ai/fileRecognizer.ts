import type { FileEntry, FileType } from './types';

interface FileRule {
  glob: string;
  type: FileType;
  skills: string[];
  context: string;
}

const FILE_RULES: FileRule[] = [
  { glob: '*.fastq.gz', type: 'fastq', skills: ['qc', 'fastp'], context: '压缩FASTQ测序数据' },
  { glob: '*.fq.gz', type: 'fastq', skills: ['qc', 'fastp'], context: '压缩FASTQ测序数据' },
  { glob: '*.fastq', type: 'fastq', skills: ['qc', 'fastp'], context: 'FASTQ测序数据' },
  { glob: '*.fq', type: 'fastq', skills: ['qc', 'fastp'], context: 'FASTQ测序数据' },
  { glob: '*.bam', type: 'bam', skills: ['alignment', 'formats'], context: 'BAM比对结果' },
  { glob: '*.sam', type: 'sam', skills: ['alignment', 'formats'], context: 'SAM比对结果' },
  { glob: '*.vcf', type: 'vcf', skills: ['formats'], context: 'VCF变异结果' },
  { glob: '*.vcf.gz', type: 'vcf', skills: ['formats'], context: '压缩VCF变异结果' },
  { glob: '*.g.vcf', type: 'gvcf', skills: ['formats'], context: 'GVCF中间文件' },
  { glob: '*.g.vcf.gz', type: 'gvcf', skills: ['formats'], context: '压缩GVCF文件' },
  { glob: '*.bed', type: 'bed', skills: ['formats'], context: 'BED区间文件' },
  { glob: '*.gff', type: 'gff', skills: ['formats'], context: 'GFF注释文件' },
  { glob: '*.gff3', type: 'gff', skills: ['formats'], context: 'GFF3注释文件' },
  { glob: '*.gtf', type: 'gtf', skills: ['formats', 'alignment'], context: 'GTF基因注释' },
  { glob: '*.fa', type: 'fa', skills: ['alignment'], context: 'FASTA参考序列' },
  { glob: '*.fasta', type: 'fasta', skills: ['alignment'], context: 'FASTA参考序列' },
  { glob: '*.lsf', type: 'lsf', skills: ['lsf-ncpgr'], context: 'LSF作业脚本' },
  { glob: '*.sh', type: 'sh', skills: ['lsf-ncpgr'], context: 'Shell脚本' },
  { glob: '*.html', type: 'html', skills: [], context: 'HTML报告' },
  { glob: '*.csv', type: 'csv', skills: [], context: 'CSV表格' },
  { glob: '*.tsv', type: 'tsv', skills: [], context: 'TSV表格' },
  { glob: '*.png', type: 'png', skills: [], context: 'PNG图片' },
  { glob: '*.jpg', type: 'png', skills: [], context: 'JPG图片' },
  { glob: '*.svg', type: 'png', skills: [], context: 'SVG图片' },
  { glob: '*.pdf', type: 'pdf', skills: [], context: 'PDF文档' },
  { glob: '*.R', type: 'r', skills: ['nature-figure'], context: 'R脚本' },
  { glob: '*.py', type: 'py', skills: [], context: 'Python脚本' },
];

function matchesGlob(filename: string, glob: string): boolean {
  const pattern = '^' + glob.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$';
  return new RegExp(pattern, 'i').test(filename);
}

export class FileRecognizer {
  private rules: FileRule[];

  constructor(rules?: FileRule[]) {
    this.rules = rules ?? FILE_RULES;
  }

  analyze(name: string, size: number, modified: number): FileEntry {
    let bestMatch: FileRule | null = null;
    let bestLength = 0;

    for (const rule of this.rules) {
      if (matchesGlob(name, rule.glob) && rule.glob.length > bestLength) {
        bestMatch = rule;
        bestLength = rule.glob.length;
      }
    }

    return {
      name,
      size,
      modified,
      type: bestMatch?.type ?? 'other',
      recognizedSkillHints: bestMatch?.skills ?? [],
    };
  }

  analyzeList(names: string[], sizes: number[], modifieds: number[]): FileEntry[] {
    return names.map((name, i) => this.analyze(name, sizes[i] ?? 0, modifieds[i] ?? Date.now()));
  }

  inferPhase(files: FileEntry[]): { phase: string; skills: string[] } {
    const types = new Set(files.map(f => f.type));
    const allSkills = new Set<string>();
    for (const f of files) {
      for (const s of f.recognizedSkillHints) allSkills.add(s);
    }

    const hasFastq = types.has('fastq');
    const hasBam = types.has('bam') || types.has('sam');
    const hasVcf = types.has('vcf') || types.has('gvcf');
    const hasHtml = types.has('html');

    if (hasVcf && !hasFastq) {
      return { phase: '变异检测阶段', skills: ['formats'] };
    }
    if (hasBam && hasFastq) {
      return { phase: '比对阶段 (已有原始数据和比对结果)', skills: [...allSkills] };
    }
    if (hasBam) {
      return { phase: '比对后处理阶段', skills: [...allSkills] };
    }
    if (hasFastq && hasHtml) {
      return { phase: '质控阶段已完成', skills: ['qc'] };
    }
    if (hasFastq) {
      return { phase: '原始数据阶段 (待质控)', skills: ['qc', 'fastp'] };
    }
    return { phase: '未知阶段', skills: [...allSkills] };
  }
}

export const fileRecognizer = new FileRecognizer();
