import type { RendererType } from './RendererRegistry';

// ── Extension → RendererType map ─────────────────────────────────
const EXTENSION_MAP: Record<string, RendererType> = {
  // Images
  '.png': 'image', '.jpg': 'image', '.jpeg': 'image', '.gif': 'image',
  '.svg': 'image', '.bmp': 'image', '.webp': 'image', '.tiff': 'image', '.tif': 'image',
  // Tables
  '.csv': 'table', '.tsv': 'table', '.tab': 'table',
  // Code
  '.py': 'code', '.R': 'code', '.r': 'code', '.sh': 'code', '.bash': 'code',
  '.js': 'code', '.ts': 'code', '.jsx': 'code', '.tsx': 'code',
  '.pl': 'code', '.rb': 'code', '.jl': 'code', '.c': 'code', '.cpp': 'code',
  // PDF
  '.pdf': 'pdf',
  // Bioinformatics
  '.fasta': 'fasta', '.fa': 'fasta', '.fna': 'fasta', '.ffn': 'fasta',
  '.fastq': 'fasta', '.fq': 'fasta',
  '.vcf': 'vcf', '.gvcf': 'vcf',
  // Log / Report / Text
  '.log': 'log', '.out': 'log', '.err': 'log', '.html': 'log', '.htm': 'log',
  '.txt': 'log', '.md': 'log', '.json': 'log', '.yml': 'log',
  '.yaml': 'log', '.xml': 'log',
};

// ── MIME-based fallback ──────────────────────────────────────────
const MIME_MAP: Record<string, RendererType> = {
  'image/': 'image',
  'text/csv': 'table',
  'text/tab-separated-values': 'table',
  'application/pdf': 'pdf',
  'text/x-python': 'code',
  'text/x-r': 'code',
  'text/x-shellscript': 'code',
  'application/javascript': 'code',
  'text/': 'generic',
};

export function detectFileType(path: string, mime?: string): RendererType {
  // 1. Try extension
  const ext = '.' + (path.split('.').pop()?.toLowerCase() || '');
  if (EXTENSION_MAP[ext]) return EXTENSION_MAP[ext];

  // 2. Try MIME type
  if (mime) {
    for (const [prefix, type] of Object.entries(MIME_MAP)) {
      if (mime.startsWith(prefix)) return type;
    }
  }

  return 'generic';
}

export function getFileCategory(path: string): string {
  const ext = '.' + (path.split('.').pop()?.toLowerCase() || '');
  if (['.png','.jpg','.jpeg','.gif','.svg','.bmp','.webp','.tiff','.tif'].includes(ext)) return 'image';
  if (['.csv','.tsv','.tab'].includes(ext)) return 'table';
  if (['.py','.R','.r','.sh','.bash','.js','.ts','.pl','.rb'].includes(ext)) return 'code';
  if (['.fasta','.fa','.fna','.fastq','.fq'].includes(ext)) return 'sequence';
  if (['.vcf','.gvcf'].includes(ext)) return 'variant';
  if (['.pdf'].includes(ext)) return 'pdf';
  if (['.log','.out','.err'].includes(ext)) return 'log';
  return 'file';
}
