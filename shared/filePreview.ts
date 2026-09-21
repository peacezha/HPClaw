export const LARGE_TEXT_BYTES = 100 * 1024 * 1024;
export const HEAD_LINE_LIMIT = 20;
export const HEAD_SCAN_BYTES = 256 * 1024;

const MIB = 1024 * 1024;

export type PreviewKind =
  | 'image'
  | 'pdf'
  | 'docx'
  | 'sheet'
  | 'html'
  | 'audio'
  | 'video'
  | 'markdown'
  | 'text'
  | 'unsupported';

export type PreviewMode = 'binary' | 'text' | 'head' | 'unsupported';

export interface PreviewDescriptor {
  kind: PreviewKind;
  mode: PreviewMode;
  mime: string;
  maxBytes: number;
  lineLimit?: number;
  reason?: string;
}

export interface FilePreviewPayload {
  path: string;
  encoding: 'base64' | 'utf8';
  content: string;
  bytesRead: number;
  totalSize: number;
  truncated: boolean;
  lineLimit?: number;
}

export interface PreviewReadOptions {
  mode: Exclude<PreviewMode, 'unsupported'>;
  maxBytes: number;
  lineLimit?: number;
}

interface PreviewGroup {
  kind: Exclude<PreviewKind, 'unsupported'>;
  extensions: readonly string[];
  mime: string;
  maxBytes: number;
  textual: boolean;
}

const GROUPS: readonly PreviewGroup[] = [
  {
    kind: 'image',
    extensions: [
      'png', 'apng', 'jpg', 'jpeg', 'jfif', 'pjpeg',
      'gif', 'bmp', 'webp', 'avif', 'svg', 'ico',
    ],
    mime: 'image/*',
    maxBytes: 25 * MIB,
    textual: false,
  },
  {
    kind: 'pdf',
    extensions: ['pdf'],
    mime: 'application/pdf',
    maxBytes: 50 * MIB,
    textual: false,
  },
  {
    kind: 'docx',
    extensions: ['docx'],
    mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    maxBytes: 25 * MIB,
    textual: false,
  },
  {
    kind: 'sheet',
    extensions: ['xlsx', 'xls', 'xlsm', 'xlsb', 'ods', 'fods'],
    mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    maxBytes: 25 * MIB,
    textual: false,
  },
  {
    kind: 'sheet',
    extensions: ['csv', 'tsv', 'tab'],
    mime: 'text/csv',
    maxBytes: 2 * MIB,
    textual: true,
  },
  {
    kind: 'html',
    extensions: ['html', 'htm', 'xhtml'],
    mime: 'text/html',
    maxBytes: 10 * MIB,
    textual: true,
  },
  {
    kind: 'audio',
    extensions: ['mp3', 'wav', 'wave', 'ogg', 'oga', 'opus', 'flac', 'm4a', 'aac'],
    mime: 'audio/*',
    maxBytes: 25 * MIB,
    textual: false,
  },
  {
    kind: 'video',
    extensions: ['mp4', 'm4v', 'webm', 'ogv', 'mov', 'mkv', 'avi', '3gp'],
    mime: 'video/*',
    maxBytes: 50 * MIB,
    textual: false,
  },
  {
    kind: 'markdown',
    extensions: ['md', 'markdown', 'rmd', 'qmd'],
    mime: 'text/markdown',
    maxBytes: 2 * MIB,
    textual: true,
  },
  {
    kind: 'text',
    extensions: [
      'txt', 'log', 'out', 'err',
      'json', 'jsonl', 'xml', 'yaml', 'yml', 'toml', 'ini', 'cfg', 'conf',
      'env', 'properties', 'editorconfig', 'gitignore', 'ipynb',
      'py', 'pyw', 'js', 'jsx', 'ts', 'tsx', 'css', 'scss',
      'sh', 'bash', 'zsh', 'fish', 'ps1', 'bat', 'cmd', 'r', 'jl', 'lua',
      'c', 'cc', 'cpp', 'h', 'hpp', 'java', 'go', 'rs', 'sql', 'pl', 'pm',
      'f', 'f90', 'f95', 'm', 'smk', 'snakefile', 'makefile', 'dockerfile',
      'fa', 'fna', 'faa', 'fasta', 'fas', 'fq', 'fastq', 'qual', 'csfasta',
      'sam', 'vcf', 'gff', 'gff2', 'gff3', 'gtf', 'bed', 'bedgraph', 'wig',
      'narrowpeak', 'broadpeak', 'aln', 'clustal', 'maf', 'nwk', 'newick',
      'paf', 'dict', 'fai', 'sto', 'embl', 'gb', 'gbk', 'genbank',
      'pdb', 'mol2', 'sdf', 'smi', 'xyz', 'gro', 'sbml',
      'slurm', 'sbatch', 'pbs', 'lsf', 'sge', 'job',
      'ped', 'map', 'bim', 'fam', 'frq', 'frqx', 'gct', 'rnk', 'cls', 'grp', 'gmt', 'mtx',
    ],
    mime: 'text/plain',
    maxBytes: 2 * MIB,
    textual: true,
  },
];

// 这些常见格式不能安全或可靠地在浏览器内核中解析。明确交给系统关联程序，
// 避免未知二进制文件被当作 UTF-8 文本读取后出现乱码或占用大量内存。
const SYSTEM_OPEN_EXTENSIONS = new Set([
  'doc', 'dot', 'odt', 'rtf', 'pages',
  'ppt', 'pptx', 'pps', 'ppsx', 'odp', 'key',
  'numbers',
  'tif', 'tiff', 'heic', 'heif', 'dng', 'raw', 'cr2', 'cr3', 'nef', 'arw',
  'psd', 'ai', 'eps',
  'zip', '7z', 'rar', 'tar', 'gz', 'tgz', 'bz2', 'xz', 'zst', 'cab', 'iso',
  'bam', 'cram', 'bcf', 'bigwig', 'bw', 'bigbed', 'bb', 'h5', 'hdf5', 'parquet',
  'exe', 'msi', 'dll', 'so', 'dylib', 'bin', 'class', 'jar', 'wasm',
]);

function extensionOf(name: string): string {
  const normalized = name.trim().toLowerCase();
  if (!normalized) return '';
  const base = normalized.split(/[\\/]/).pop() ?? normalized;
  const dot = base.lastIndexOf('.');
  return dot >= 0 ? base.slice(dot + 1) : base;
}

function mimeForImage(extension: string): string {
  if (['jpg', 'jpeg', 'jfif', 'pjpeg'].includes(extension)) return 'image/jpeg';
  if (extension === 'svg') return 'image/svg+xml';
  if (extension === 'ico') return 'image/x-icon';
  return `image/${extension}`;
}

function mimeForMedia(kind: 'audio' | 'video', extension: string): string {
  const overrides: Record<string, string> = {
    mp3: 'audio/mpeg',
    wave: 'audio/wav',
    oga: 'audio/ogg',
    opus: 'audio/ogg',
    m4a: 'audio/mp4',
    m4v: 'video/mp4',
    ogv: 'video/ogg',
    mov: 'video/quicktime',
    mkv: 'video/x-matroska',
    avi: 'video/x-msvideo',
    '3gp': 'video/3gpp',
  };
  return overrides[extension] ?? `${kind}/${extension}`;
}

export function classifyPreview(name: string, size: number): PreviewDescriptor {
  const extension = extensionOf(name);
  if (SYSTEM_OPEN_EXTENSIONS.has(extension)) {
    return {
      kind: 'unsupported',
      mode: 'unsupported',
      mime: 'application/octet-stream',
      maxBytes: 0,
      reason: '此格式更适合使用本机已安装的软件打开',
    };
  }
  // 未识别的扩展名按文本格式打开（用户可读的远多于真正二进制的场景）
  const group = GROUPS.find(candidate => candidate.extensions.includes(extension))
    ?? GROUPS.find(candidate => candidate.kind === 'text')!;

  const mime = group.kind === 'image'
    ? mimeForImage(extension)
    : group.kind === 'audio' || group.kind === 'video'
      ? mimeForMedia(group.kind, extension)
      : group.mime;
  if ((!group.textual || group.kind === 'html') && size > group.maxBytes) {
    return {
      kind: 'unsupported',
      mode: 'unsupported',
      mime,
      maxBytes: 0,
      reason: '文件较大，建议使用本机已安装的软件打开',
    };
  }

  if (group.textual && size >= LARGE_TEXT_BYTES) {
    return {
      kind: group.kind === 'sheet' ? 'text' : group.kind,
      mode: 'head',
      mime,
      maxBytes: HEAD_SCAN_BYTES,
      lineLimit: HEAD_LINE_LIMIT,
    };
  }

  return {
    kind: group.kind,
    mode: group.textual ? 'text' : 'binary',
    mime,
    maxBytes: group.maxBytes,
  };
}
