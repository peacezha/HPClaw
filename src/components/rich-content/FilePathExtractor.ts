// ── Regex patterns for file paths in AI output ───────────────────
// Match ABSOLUTE, HOME-RELATIVE and DOT-RELATIVE paths. Bare filenames are too ambiguous
// (AI references them in find/ls output, error messages, etc. — all false positives)

// 扩展名白名单：与 FileTypeDetector / 渲染器注册表对齐
const FILE_EXT = '(?:png|jpg|jpeg|gif|svg|bmp|webp|tiff?|csv|tsv|tab|pdf|x?html?|txt|md|json|log|out|err|fasta|fa|fna|ffn|fastq|fq|vcf|gvcf|py|R|r|sh|bash|pl|rb|jl|c|cpp|js|ts|jsx|tsx|yml|yaml|xml)';
const GZ_EXT = '(?:fq|fastq|fa|fasta|fna|ffn|vcf|g\\.vcf)\\.gz';

// 顺序有意义：Windows 绝对与点前缀相对路径先于 Unix 绝对匹配，
// 避免 `.dsh-vision-toolkit/artifacts/x.png`、`C:/dir/x.png` 被 Unix 模式按子串误捞；
// 提取后还会做一次"子串隶属于更长匹配"的去重兜底。
const PATH_PATTERNS = [
  // Windows absolute paths: C:\Users\me\out\plot.png（含 C:/ 变体，段内允许空格）
  new RegExp(`[A-Za-z]:[\\\\/](?:[\\w. -]+[\\\\/])*[\\w. -]+\\.${FILE_EXT}`, 'gi'),
  // Dot-relative paths: .dsh-vision-toolkit/artifacts/plot.png（dsh 工具的 cwd 相对产物）
  new RegExp(`\\.[\\w\\-.]+(?:[\\\\/][\\w\\-. ]+)*[\\\\/][\\w\\-. ]+\\.${FILE_EXT}`, 'gi'),
  // ./ 开头的相对路径: ./demo-assets/plot.png（先于 Unix 模式，避免其子串被误捞）
  new RegExp(`\\.(?:[\\\\/][\\w\\-. ]+)+\\.${FILE_EXT}`, 'gi'),
  // 裸相对路径: results/plot.png、code/step-01.sh（流程产物/脚本常见形态，
  // 解析基准由调用方给——流程 runDir、集群 home 或本地工作区）
  new RegExp(`[\\w\\-.]+(?:[\\\\/][\\w\\-. ]+)+\\.${FILE_EXT}`, 'gi'),
  // Absolute paths: /home/user/output/plot.png（lookbehind 防止吃 ./x.png 的子串）
  new RegExp(`(?<!\\.)/(?:[\\w.-]+/)+[\\w.-]+\\.${FILE_EXT}`, 'gi'),
  // Home-relative paths: ~/output/plot.png
  new RegExp(`~(?:/[\\w.-]+)+\\.${FILE_EXT}`, 'gi'),
  // Compressed bioinformatics: .fq.gz, .fastq.gz, .vcf.gz, .g.vcf.gz, .fa.gz, .fasta.gz
  new RegExp(`(?<!\\.)/(?:[\\w.-]+/)+[\\w.-]+\\.${GZ_EXT}`, 'gi'),
  new RegExp(`~(?:/[\\w.-]+)+\\.${GZ_EXT}`, 'gi'),
];

const SCP_PATH_PATTERN = /(?:scp|rsync|cp|mv)\s+\S+\s+(\S+)/gi;

/** 路径已作为 Markdown 图片目的地（MarkdownMessage 会内联渲染）——不再重复出卡片 */
function isMarkdownImageDestination(text: string, p: string): boolean {
  return text.includes(`](${p})`) || text.includes(`](<${p}>)`) || text.includes(`](${p} `);
}

export function extractFilePaths(text: string): string[] {
  const paths = new Set<string>();

  for (const pattern of PATH_PATTERNS) {
    const matches: string[] = text.match(pattern) ?? [];
    matches.forEach(m => {
      // Normalize and remove trailing punctuation
      const clean = m.replace(/[,;:)}\]]+$/, '');
      paths.add(clean);
    });
  }

  // Extract destination paths from scp/rsync commands
  while (true) {
    const match = SCP_PATH_PATTERN.exec(text);
    if (!match) break;
    if (match[1] && !match[1].startsWith('-')) {
      paths.add(match[1]);
    }
  }

  const list = Array.from(paths).filter(p => p.length > 2 && !p.startsWith('http') && !isMarkdownImageDestination(text, p));
  // 子串去重：一个匹配是另一个更长匹配的子串时只保留更长者
  //（如 /artifacts/x.png 隶属于 .dsh-vision-toolkit/artifacts/x.png）
  return list.filter(p => !list.some(other => other !== p && other.includes(p)));
}

export function extractCodeBlocks(text: string): { language: string; code: string }[] {
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  const blocks: { language: string; code: string }[] = [];
  let match;
  while ((match = codeBlockRegex.exec(text)) !== null) {
    blocks.push({ language: match[1] || 'bash', code: match[2].trim() });
  }
  return blocks;
}

export function extractInlineCharts(text: string): { title: string; data: string }[] {
  // Match <chart title="...">data</chart> blocks
  const chartRegex = /<chart\s+title="([^"]*)">([\s\S]*?)<\/chart>/gi;
  const charts: { title: string; data: string }[] = [];
  let match;
  while ((match = chartRegex.exec(text)) !== null) {
    charts.push({ title: match[1], data: match[2].trim() });
  }
  return charts;
}
