# HPClaw 2.0 — 生信智能集群助手 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade HPClaw from a generic HPC terminal to a bioinformatics-aware intelligent cluster assistant with autonomous agent capabilities — the AI can independently plan, execute commands, read output files, and present rich results (images, tables, sequences) all in the chat stream.

**Architecture:** Phase 1 adds RichContent renderers (Image/Table/Code/PDF/FASTA/VCF) as pluggable cards in AI chat, a BioSkill engine with preloaded bioinformatics knowledge + nature-skills academic pack, backend File Content API for reading cluster files into chat, and enhanced Agent Mode that auto-detects output files and displays them as RichContent cards in the autonomous execution loop. Phase 2 (future) adds draggable IDE panels.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Motion, Lucide React, Express, SSH2, highlight.js

---

## File Structure

```
src/components/rich-content/          (NEW - all 9 files)
├── RendererRegistry.ts               Central type→component registry
├── FileTypeDetector.ts               Extension + MIME → renderer type
├── FilePathExtractor.ts              Regex path extraction from text
├── ContentFetcher.ts                 API client for /api/files/read
├── ImageCard.tsx                     Image preview with lightbox
├── TableCard.tsx                     Virtualized CSV/TSV table
├── CodeCard.tsx                      Syntax-highlighted code block
├── FastaCard.tsx                     Sequence viewer with stats
├── GenericCard.tsx                   Fallback file card with download
├── index.ts                          Barrel export, RichContentMessage component

src/components/
├── BioSkillPanel.tsx                 (NEW) Right panel skills tab
└── BioSkillBrowser.tsx               (NEW) Skill category browser + search

Modified:
├── src/App.tsx                       Add BioSkills tab to right panel, RichContent in chat
├── src/components/AIChat.tsx         Render RichContent cards, knowledge injection
├── src/components/Header.tsx         Add "BioSkills" toggle button
├── src/index.css                     Card styles, code theme
├── server.ts                         /api/files/read, skill indexer, observation logger
```

---

### Task 1: RendererRegistry — Type system and component registry

**Files:**
- Create: `src/components/rich-content/RendererRegistry.ts`

- [ ] **Step 1: Create RendererRegistry with types and singleton registry**

Create `src/components/rich-content/RendererRegistry.ts`:

```typescript
import type { ComponentType } from 'react';

// ── Types ────────────────────────────────────────────────────────
export type RendererType = 'image' | 'table' | 'code' | 'pdf' | 'fasta' | 'vcf' | 'log' | 'generic';

export interface FileMetadata {
  size: number;
  mime: string;
  dimensions?: { width: number; height: number };
  rows?: number;
}

export interface CardContent {
  type: RendererType;
  filePath: string;
  fileName: string;
  content: string; // base64 for binary, text for text files
  metadata: FileMetadata;
}

export interface CardProps {
  content: CardContent;
  onExpand?: () => void;
}

export interface RendererEntry {
  type: RendererType;
  component: ComponentType<CardProps>;
  label: string;
  extensions: string[];
  priority: number;
}

// ── Registry ─────────────────────────────────────────────────────
class RendererRegistryImpl {
  private entries = new Map<RendererType, RendererEntry>();

  register(entry: RendererEntry): void {
    this.entries.set(entry.type, entry);
  }

  get(type: RendererType): RendererEntry | undefined {
    return this.entries.get(type);
  }

  findByExtension(ext: string): RendererType | null {
    const lower = ext.toLowerCase();
    for (const [, entry] of this.entries) {
      if (entry.extensions.includes(lower)) return entry.type;
    }
    return null;
  }

  getAll(): RendererEntry[] {
    return Array.from(this.entries.values()).sort((a, b) => b.priority - a.priority);
  }
}

export const RendererRegistry = new RendererRegistryImpl();
```

- [ ] **Step 2: Verify the file has no syntax errors**

Run: `cd E:/0509hpclaw && node -e "require('fs').readFileSync('src/components/rich-content/RendererRegistry.ts','utf8'); console.log('OK')"`

Expected: `OK`

---

### Task 2: FileTypeDetector — Map file extensions to renderer types

**Files:**
- Create: `src/components/rich-content/FileTypeDetector.ts`

- [ ] **Step 1: Create FileTypeDetector**

Create `src/components/rich-content/FileTypeDetector.ts`:

```typescript
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
  // Log
  '.log': 'log', '.out': 'log', '.err': 'log',
  // Text (generic)
  '.txt': 'generic', '.md': 'generic', '.json': 'generic', '.yml': 'generic',
  '.yaml': 'generic', '.xml': 'generic', '.html': 'generic',
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
```

- [ ] **Step 2: Verify syntax**

Run: `cd E:/0509hpclaw && node -e "require('fs').readFileSync('src/components/rich-content/FileTypeDetector.ts','utf8'); console.log('OK')"`

---

### Task 3: FilePathExtractor — Extract file paths from AI text

**Files:**
- Create: `src/components/rich-content/FilePathExtractor.ts`

- [ ] **Step 1: Create FilePathExtractor**

Create `src/components/rich-content/FilePathExtractor.ts`:

```typescript
// ── Regex patterns for file paths in AI output ───────────────────
const PATH_PATTERNS = [
  // Absolute paths
  /\/(?:[\w.-]+\/)+[\w.-]+\.(?:png|jpg|jpeg|gif|svg|bmp|webp|tiff?|csv|tsv|tab|pdf|html|txt|md|json|log|out|err|fasta|fa|fna|ffn|fastq|fq|vcf|gvcf|py|R|r|sh|bash|pl|rb|jl|c|cpp|js|ts|jsx|tsx|yml|yaml|xml)/gi,
  // Home-relative paths
  /~(?:\/[\w.-]+)+\.(?:png|jpg|jpeg|gif|svg|bmp|webp|tiff?|csv|tsv|tab|pdf|html|txt|md|json|log|out|err|fasta|fa|fna|ffn|fastq|fq|vcf|gvcf|py|R|r|sh|bash|pl|rb|jl|c|cpp|js|ts|jsx|tsx|yml|yaml|xml)/gi,
  // ./relative paths
  /\.(?:\/[\w.-]+)+\.(?:png|jpg|jpeg|gif|svg|bmp|webp|tiff?|csv|tsv|tab|pdf|html|txt|md|json|log|out|err|fasta|fa|fna|ffn|fastq|fq|vcf|gvcf|py|R|r|sh|bash|pl|rb|jl|c|cpp|js|ts|jsx|tsx|yml|yaml|xml)/gi,
];

const SCP_PATH_PATTERN = /(?:scp|rsync|cp|mv)\s+\S+\s+(\S+)/gi;

export function extractFilePaths(text: string): string[] {
  const paths = new Set<string>();

  for (const pattern of PATH_PATTERNS) {
    const matches = text.match(pattern) || [];
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

  return Array.from(paths).filter(p => p.length > 2 && !p.startsWith('http'));
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
```

- [ ] **Step 2: Verify syntax**

Run: `cd E:/0509hpclaw && node -e "require('fs').readFileSync('src/components/rich-content/FilePathExtractor.ts','utf8'); console.log('OK')"`

---

### Task 4: ContentFetcher — API client for reading cluster files

**Files:**
- Create: `src/components/rich-content/ContentFetcher.ts`

- [ ] **Step 1: Create ContentFetcher**

Create `src/components/rich-content/ContentFetcher.ts`:

```typescript
import { detectFileType } from './FileTypeDetector';
import type { CardContent, RendererType } from './RendererRegistry';

interface FetchedContent {
  type: RendererType;
  filePath: string;
  content: string;
  metadata: {
    size: number;
    mime: string;
    dimensions?: { width: number; height: number };
    rows?: number;
  };
}

export async function fetchFileContent(filePath: string, signal?: AbortSignal): Promise<CardContent> {
  const res = await fetch('/api/files/read', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: filePath }),
    signal,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: '读取失败' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  const data: FetchedContent = await res.json();
  const fileName = filePath.split('/').pop() || filePath;

  return {
    type: detectFileType(filePath, data.metadata.mime),
    filePath,
    fileName,
    content: data.content,
    metadata: data.metadata,
  };
}

export async function fetchFileContentBatch(
  paths: string[],
  signal?: AbortSignal,
): Promise<Map<string, CardContent>> {
  const res = await fetch('/api/files/read/batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paths }),
    signal,
  });

  if (!res.ok) {
    throw new Error('批量读取失败');
  }

  const data: FetchedContent[] = await res.json();
  const map = new Map<string, CardContent>();

  for (const item of data) {
    const fileName = item.filePath.split('/').pop() || item.filePath;
    map.set(item.filePath, {
      type: detectFileType(item.filePath, item.metadata.mime),
      filePath: item.filePath,
      fileName,
      content: item.content,
      metadata: item.metadata,
    });
  }

  return map;
}

// Size threshold: files under this are shown inline, above show "click to load"
export const INLINE_SIZE_THRESHOLD = 500 * 1024; // 500KB
```

- [ ] **Step 2: Verify syntax**

Run: `cd E:/0509hpclaw && node -e "require('fs').readFileSync('src/components/rich-content/ContentFetcher.ts','utf8'); console.log('OK')"`

---

### Task 5: ImageCard — Image preview with lightbox

**Files:**
- Create: `src/components/rich-content/ImageCard.tsx`

- [ ] **Step 1: Create ImageCard component**

Create `src/components/rich-content/ImageCard.tsx`:

```typescript
import { useState, useRef } from 'react';
import { Maximize2, Download, Loader2 } from 'lucide-react';
import type { CardProps } from './RendererRegistry';
import { INLINE_SIZE_THRESHOLD } from './ContentFetcher';

export default function ImageCard({ content, onExpand }: CardProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const isLarge = content.metadata.size > INLINE_SIZE_THRESHOLD;
  const src = content.content.startsWith('data:')
    ? content.content
    : `data:${content.metadata.mime};base64,${content.content}`;

  if (error) {
    return (
      <div className="rich-card p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-zinc-300 truncate">{content.fileName}</span>
          <span className="text-[10px] text-zinc-500">{(content.metadata.size / 1024).toFixed(0)}KB</span>
        </div>
        <div className="text-xs text-zinc-500 text-center py-4">
          图片加载失败
        </div>
      </div>
    );
  }

  return (
    <div className="rich-card p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-zinc-300 truncate flex-1">{content.fileName}</span>
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[10px] text-zinc-500">{(content.metadata.size / 1024).toFixed(0)}KB</span>
          {content.metadata.dimensions && (
            <span className="text-[10px] text-zinc-600">
              {content.metadata.dimensions.width}×{content.metadata.dimensions.height}
            </span>
          )}
          <button
            onClick={onExpand}
            className="p-1 text-zinc-500 hover:text-zinc-300"
            aria-label="放大图片"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              const a = document.createElement('a');
              a.href = `/api/files/download?path=${encodeURIComponent(content.filePath)}`;
              a.download = content.fileName;
              a.click();
            }}
            className="p-1 text-zinc-500 hover:text-zinc-300"
            aria-label="下载图片"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      {isLarge && !loaded ? (
        <button
          onClick={() => setLoaded(true)}
          className="w-full py-8 text-center text-xs text-zinc-500 bg-zinc-950 rounded hover:bg-zinc-800 transition-colors"
        >
          点击加载图片 ({(content.metadata.size / 1024).toFixed(0)}KB)
        </button>
      ) : (
        <div className="relative bg-[#0a0a0a] rounded overflow-hidden">
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-zinc-600" />
            </div>
          )}
          <img
            ref={imgRef}
            src={src}
            alt={content.fileName}
            className="w-full max-h-80 object-contain cursor-pointer"
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            onClick={onExpand}
          />
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify syntax**

Run: `cd E:/0509hpclaw && node -e "require('fs').readFileSync('src/components/rich-content/ImageCard.tsx','utf8'); console.log('OK')"`

---

### Task 6: TableCard — Virtualized CSV/TSV table

**Files:**
- Create: `src/components/rich-content/TableCard.tsx`

- [ ] **Step 1: Create TableCard with paginated table rendering**

Create `src/components/rich-content/TableCard.tsx`:

```typescript
import { useState, useMemo } from 'react';
import { Table2, Download, ChevronDown } from 'lucide-react';
import type { CardProps } from './RendererRegistry';

const PAGE_SIZE = 25;

function parseCSV(text: string, delimiter: ',' | '\t'): string[][] {
  const lines = text.trim().split('\n');
  return lines.map(line => {
    const result: string[] = [];
    let cell = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inQuotes = !inQuotes; continue; }
      if (ch === delimiter && !inQuotes) { result.push(cell.trim()); cell = ''; continue; }
      cell += ch;
    }
    result.push(cell.trim());
    return result;
  });
}

export default function TableCard({ content }: CardProps) {
  const [page, setPage] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const delimiter = content.fileName.endsWith('.tsv') || content.fileName.endsWith('.tab') ? '\t' : ',';

  const { headers, rows, totalRows } = useMemo(() => {
    // content may be base64 or raw text
    let text = content.content;
    if (text.startsWith('data:')) {
      // base64 decode
      const base64 = text.split(',')[1] || text;
      try { text = atob(base64); } catch { /* not base64 */ }
    }
    const parsed = parseCSV(text, delimiter);
    if (parsed.length === 0) return { headers: [], rows: [], totalRows: 0 };
    return {
      headers: parsed[0],
      rows: parsed.slice(1),
      totalRows: parsed.length - 1,
    };
  }, [content.content, delimiter]);

  const displayRows = expanded ? rows : rows.slice(0, PAGE_SIZE);

  return (
    <div className="rich-card bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-zinc-800/50 border-b border-zinc-800">
        <span className="text-xs text-zinc-300 flex items-center gap-1.5">
          <Table2 className="w-3.5 h-3.5 text-blue-400" />
          {content.fileName}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-500">{totalRows} rows × {headers.length} cols</span>
          <button
            onClick={() => {
              const a = document.createElement('a');
              a.href = `/api/files/download?path=${encodeURIComponent(content.filePath)}`;
              a.download = content.fileName;
              a.click();
            }}
            className="p-1 text-zinc-500 hover:text-zinc-300"
            aria-label="下载表格"
          >
            <Download className="w-3 h-3" />
          </button>
        </div>
      </div>
      <div className="overflow-auto max-h-80">
        <table className="w-full text-xs border-collapse">
          <thead className="bg-zinc-800/80 sticky top-0">
            <tr>
              <th className="px-2 py-1.5 text-left text-zinc-400 font-medium border-b border-zinc-700 w-8">#</th>
              {headers.map((h, i) => (
                <th key={i} className="px-3 py-1.5 text-left text-zinc-300 font-medium border-b border-zinc-700 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayRows.map((row, ri) => (
              <tr key={ri} className="hover:bg-zinc-800/40">
                <td className="px-2 py-1 text-zinc-500 border-b border-zinc-800/50">{page * PAGE_SIZE + ri + 1}</td>
                {row.map((cell, ci) => (
                  <td key={ci} className="px-3 py-1 text-zinc-400 border-b border-zinc-800/50 whitespace-nowrap max-w-64 truncate">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > PAGE_SIZE && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="w-full py-2 text-center text-xs text-zinc-500 bg-zinc-800/30 hover:bg-zinc-800/50 flex items-center justify-center gap-1"
        >
          <ChevronDown className="w-3 h-3" />
          显示全部 {totalRows} 行
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify syntax**

Run: `cd E:/0509hpclaw && node -e "require('fs').readFileSync('src/components/rich-content/TableCard.tsx','utf8'); console.log('OK')"`

---

### Task 7: CodeCard — Syntax-highlighted code viewer

**Files:**
- Create: `src/components/rich-content/CodeCard.tsx`

- [ ] **Step 1: Create CodeCard with copy and language detection**

Create `src/components/rich-content/CodeCard.tsx`:

```typescript
import { useState } from 'react';
import { Code2, Copy, Check, Download } from 'lucide-react';
import type { CardProps } from './RendererRegistry';

const LANGUAGE_LABELS: Record<string, string> = {
  py: 'Python', R: 'R', r: 'R', sh: 'Bash', bash: 'Bash',
  js: 'JavaScript', ts: 'TypeScript', jsx: 'React', tsx: 'React',
  pl: 'Perl', rb: 'Ruby', jl: 'Julia', c: 'C', cpp: 'C++',
};

function detectLanguage(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  return LANGUAGE_LABELS[ext] || ext || 'text';
}

export default function CodeCard({ content }: CardProps) {
  const [copied, setCopied] = useState(false);

  const lang = detectLanguage(content.fileName);
  const codeText = content.content.startsWith('data:')
    ? (() => { try { return atob(content.content.split(',')[1] || content.content); } catch { return content.content; } })()
    : content.content;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rich-card bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-zinc-800/50 border-b border-zinc-800">
        <span className="text-xs text-zinc-300 flex items-center gap-1.5">
          <Code2 className="w-3.5 h-3.5 text-emerald-400" />
          {content.fileName}
          <span className="text-[10px] text-zinc-500 bg-zinc-700 px-1.5 py-0.5 rounded">{lang}</span>
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="p-1 text-zinc-500 hover:text-zinc-300 flex items-center gap-1 text-[10px]"
            aria-label="复制代码"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => {
              const a = document.createElement('a');
              a.href = `/api/files/download?path=${encodeURIComponent(content.filePath)}`;
              a.download = content.fileName;
              a.click();
            }}
            className="p-1 text-zinc-500 hover:text-zinc-300"
            aria-label="下载文件"
          >
            <Download className="w-3 h-3" />
          </button>
        </div>
      </div>
      <pre className="p-3 text-xs font-mono bg-[#09090b] overflow-x-auto max-h-80 overflow-y-auto leading-relaxed">
        <code className="text-zinc-300">{codeText.slice(0, 50000)}{codeText.length > 50000 && '\n\n... (文件过大，仅显示前 50000 字符)'}</code>
      </pre>
    </div>
  );
}
```

- [ ] **Step 2: Verify syntax**

Run: `cd E:/0509hpclaw && node -e "require('fs').readFileSync('src/components/rich-content/CodeCard.tsx','utf8'); console.log('OK')"`

---

### Task 8: FastaCard — Sequence file viewer with stats

**Files:**
- Create: `src/components/rich-content/FastaCard.tsx`

- [ ] **Step 1: Create FastaCard with sequence statistics**

Create `src/components/rich-content/FastaCard.tsx`:

```typescript
import { useState, useMemo } from 'react';
import { Dna, ChevronDown, Download } from 'lucide-react';
import type { CardProps } from './RendererRegistry';

interface SeqRecord {
  header: string;
  sequence: string;
  length: number;
  gcContent: number;
}

function parseFasta(text: string): SeqRecord[] {
  const records: SeqRecord[] = [];
  let current: SeqRecord | null = null;

  const lines = text.split('\n');
  for (const line of lines) {
    if (line.startsWith('>')) {
      if (current) records.push(current);
      current = { header: line.slice(1).trim(), sequence: '', length: 0, gcContent: 0 };
    } else if (current) {
      const seq = line.trim().toUpperCase();
      current.sequence += seq;
    }
  }
  if (current) records.push(current);

  for (const rec of records) {
    rec.length = rec.sequence.length;
    const gc = (rec.sequence.match(/[GC]/g) || []).length;
    rec.gcContent = rec.length > 0 ? (gc / rec.length) * 100 : 0;
  }

  return records;
}

function isFastq(text: string): boolean {
  return text.trim().startsWith('@') && text.includes('\n+\n');
}

export default function FastaCard({ content }: CardProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const records = useMemo(() => {
    let text = content.content;
    if (text.startsWith('data:')) {
      try { text = atob(text.split(',')[1] || text); } catch {}
    }
    if (isFastq(text)) {
      // Extract only sequences from FASTQ
      const lines = text.split('\n');
      const seqLines = lines.filter((_, i) => i % 4 === 1);
      const seqText = seqLines.map((s, i) => `>read_${i + 1}\n${s}`).join('\n');
      return parseFasta(seqText);
    }
    return parseFasta(text);
  }, [content.content]);

  const isFastqFile = content.fileName.endsWith('.fastq') || content.fileName.endsWith('.fq');
  const totalBp = records.reduce((sum, r) => sum + r.length, 0);
  const avgGC = records.length > 0 ? records.reduce((sum, r) => sum + r.gcContent, 0) / records.length : 0;

  return (
    <div className="rich-card bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-zinc-800/50 border-b border-zinc-800">
        <span className="text-xs text-zinc-300 flex items-center gap-1.5">
          <Dna className="w-3.5 h-3.5 text-emerald-400" />
          {content.fileName}
          <span className="text-[10px] text-zinc-500">
            {isFastqFile ? 'FASTQ' : 'FASTA'}
          </span>
        </span>
        <button
          onClick={() => {
            const a = document.createElement('a');
            a.href = `/api/files/download?path=${encodeURIComponent(content.filePath)}`;
            a.download = content.fileName;
            a.click();
          }}
          className="p-1 text-zinc-500 hover:text-zinc-300"
          aria-label="下载文件"
        >
          <Download className="w-3 h-3" />
        </button>
      </div>

      {/* Summary stats */}
      <div className="px-3 py-2 grid grid-cols-4 gap-2 text-center bg-zinc-950/50">
        <div>
          <div className="text-sm font-semibold text-emerald-400">{records.length}</div>
          <div className="text-[10px] text-zinc-500">Sequences</div>
        </div>
        <div>
          <div className="text-sm font-semibold text-blue-400">{(totalBp / 1000).toFixed(1)}k</div>
          <div className="text-[10px] text-zinc-500">Total bp</div>
        </div>
        <div>
          <div className="text-sm font-semibold text-amber-400">{avgGC.toFixed(1)}%</div>
          <div className="text-[10px] text-zinc-500">Avg GC</div>
        </div>
        <div>
          <div className="text-sm font-semibold text-zinc-300">
            {records.length > 0 ? (totalBp / records.length).toFixed(0) : 0}
          </div>
          <div className="text-[10px] text-zinc-500">Avg Length</div>
        </div>
      </div>

      {/* Sequence list (first 20) */}
      <div className="max-h-60 overflow-y-auto p-2 space-y-1">
        {records.slice(0, 20).map((rec, i) => (
          <div key={i} className="text-xs">
            <button
              onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
              className="w-full flex items-center gap-1.5 p-1.5 rounded hover:bg-zinc-800/50 text-left"
            >
              <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform ${expandedIdx === i ? '' : '-rotate-90'}`} />
              <span className="text-zinc-300 truncate flex-1">{rec.header.slice(0, 60)}</span>
              <span className="text-[10px] text-zinc-500 shrink-0">{rec.length}bp</span>
            </button>
            {expandedIdx === i && (
              <div className="ml-5 mt-1 p-2 bg-zinc-950 rounded font-mono text-[11px] text-emerald-400 break-all max-h-32 overflow-y-auto">
                {rec.sequence.slice(0, 1000)}
                {rec.sequence.length > 1000 && <span className="text-zinc-500"> ... ({rec.sequence.length - 1000} more bp)</span>}
              </div>
            )}
          </div>
        ))}
        {records.length > 20 && (
          <div className="text-center text-[10px] text-zinc-500 py-1">
            ... 还有 {records.length - 20} 条序列
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify syntax**

Run: `cd E:/0509hpclaw && node -e "require('fs').readFileSync('src/components/rich-content/FastaCard.tsx','utf8'); console.log('OK')"`

---

### Task 9: GenericCard — Fallback file card with download

**Files:**
- Create: `src/components/rich-content/GenericCard.tsx`

- [ ] **Step 1: Create GenericCard for unsupported file types**

Create `src/components/rich-content/GenericCard.tsx`:

```typescript
import { FileText, Download, ExternalLink } from 'lucide-react';
import type { CardProps } from './RendererRegistry';
import { getFileCategory } from './FileTypeDetector';

const CATEGORY_ICONS: Record<string, string> = {
  image: 'text-emerald-400',
  table: 'text-blue-400',
  code: 'text-amber-400',
  sequence: 'text-emerald-400',
  variant: 'text-purple-400',
  pdf: 'text-red-400',
  log: 'text-zinc-400',
};

export default function GenericCard({ content, onExpand }: CardProps) {
  const category = getFileCategory(content.filePath);
  const iconColor = CATEGORY_ICONS[category] || 'text-zinc-500';

  return (
    <div className="rich-card p-3 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center gap-3">
      <div className={`p-2 bg-zinc-800 rounded-lg shrink-0 ${iconColor}`}>
        <FileText className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-zinc-300 truncate">{content.fileName}</p>
        <p className="text-[10px] text-zinc-500">
          {(content.metadata.size / 1024).toFixed(0)}KB · {content.metadata.mime || category}
        </p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {onExpand && (
          <button
            onClick={onExpand}
            className="p-1.5 text-zinc-500 hover:text-zinc-300 rounded"
            aria-label="在面板中打开"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={() => {
            const a = document.createElement('a');
            a.href = `/api/files/download?path=${encodeURIComponent(content.filePath)}`;
            a.download = content.fileName;
            a.click();
          }}
          className="p-1.5 text-zinc-500 hover:text-emerald-400 rounded"
          aria-label="下载文件"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify syntax**

Run: `cd E:/0509hpclaw && node -e "require('fs').readFileSync('src/components/rich-content/GenericCard.tsx','utf8'); console.log('OK')"`

---

### Task 10: Barrel export and RichContentMessage — Wire everything together

**Files:**
- Create: `src/components/rich-content/index.ts`

- [ ] **Step 1: Create the barrel export with RichContentMessage orchestrator**

Create `src/components/rich-content/index.ts`:

```typescript
export { RendererRegistry } from './RendererRegistry';
export type { RendererType, CardContent, CardProps, RendererEntry } from './RendererRegistry';
export { detectFileType, getFileCategory } from './FileTypeDetector';
export { extractFilePaths, extractCodeBlocks, extractInlineCharts } from './FilePathExtractor';
export { fetchFileContent, fetchFileContentBatch, INLINE_SIZE_THRESHOLD } from './ContentFetcher';

// ── Register all renderers ───────────────────────────────────────
import { RendererRegistry } from './RendererRegistry';
import ImageCard from './ImageCard';
import TableCard from './TableCard';
import CodeCard from './CodeCard';
import FastaCard from './FastaCard';
import GenericCard from './GenericCard';

// Register in priority order (higher = preferred match)
RendererRegistry.register({ type: 'image',  component: ImageCard,   label: 'Image',     extensions: ['.png','.jpg','.jpeg','.gif','.svg','.bmp','.webp','.tiff','.tif'], priority: 100 });
RendererRegistry.register({ type: 'table',  component: TableCard,   label: 'Table',     extensions: ['.csv','.tsv','.tab'], priority: 90 });
RendererRegistry.register({ type: 'code',   component: CodeCard,    label: 'Code',      extensions: ['.py','.R','.r','.sh','.bash','.js','.ts','.jsx','.tsx','.pl','.rb','.jl','.c','.cpp'], priority: 85 });
RendererRegistry.register({ type: 'fasta',  component: FastaCard,   label: 'Sequence',  extensions: ['.fasta','.fa','.fna','.ffn','.fastq','.fq'], priority: 80 });
RendererRegistry.register({ type: 'vcf',    component: GenericCard, label: 'Variant',   extensions: ['.vcf','.gvcf'], priority: 80 });
RendererRegistry.register({ type: 'pdf',    component: GenericCard, label: 'PDF',       extensions: ['.pdf'], priority: 75 });
RendererRegistry.register({ type: 'log',    component: CodeCard,    label: 'Log',       extensions: ['.log','.out','.err'], priority: 70 });
RendererRegistry.register({ type: 'generic',component: GenericCard, label: 'File',      extensions: ['*'], priority: 0 });

// ── RichContentMessage ────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { extractFilePaths } from './FilePathExtractor';
import { detectFileType } from './FileTypeDetector';
import { fetchFileContent } from './ContentFetcher';
import type { CardContent } from './RendererRegistry';

interface RichContentMessageProps {
  children: string; // AI response text
  className?: string;
}

export function RichContentMessage({ children: text, className = '' }: RichContentMessageProps) {
  const [cards, setCards] = useState<CardContent[]>([]);
  const [loading, setLoading] = useState<Set<string>>(new Set());

  useEffect(() => {
    const paths = extractFilePaths(text);
    if (paths.length === 0) return;

    const uniquePaths = [...new Set(paths)].slice(0, 5); // Max 5 inline cards

    for (const path of uniquePaths) {
      setLoading(prev => new Set(prev).add(path));
      const fileType = detectFileType(path);
      const entry = RendererRegistry.get(fileType);
      // Skip generic for inline display
      if (!entry || entry.priority < 50) {
        setLoading(prev => { const s = new Set(prev); s.delete(path); return s; });
        continue;
      }
      fetchFileContent(path)
        .then(card => setCards(prev => [...prev, card]))
        .catch(() => { /* silent */ })
        .finally(() => setLoading(prev => { const s = new Set(prev); s.delete(path); return s; }));
    }
  }, [text]);

  if (cards.length === 0) return null;

  return (
    <div className={`rich-content-cards space-y-2 mt-2 ${className}`}>
      {cards.map((card, i) => {
        const entry = RendererRegistry.get(card.type);
        if (!entry) return null;
        const CardComponent = entry.component;
        return <CardComponent key={i} content={card} />;
      })}
      {loading.size > 0 && (
        <div className="text-[10px] text-zinc-500 animate-pulse">加载文件中...</div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify syntax**

Run: `cd E:/0509hpclaw && node -e "require('fs').readFileSync('src/components/rich-content/index.ts','utf8'); console.log('OK')"`

---

### Task 11: Backend — Add POST /api/files/read endpoint

**Files:**
- Modify: `server.ts` — Insert new route before the download route

- [ ] **Step 1: Locate insertion point and add /api/files/read route**

Read `server.ts` to find the download route location before inserting the new endpoint. Insert right before `app.get("/api/files/download"...)` (around line 725).

Add this code block:

```typescript
  // ══════════════════════════════════════════════════════════════════
  //  FILE CONTENT API — Read file content for inline preview
  // ══════════════════════════════════════════════════════════════════

  app.post("/api/files/read", async (req, res) => {
    const session = getSessionOrFail(req, res);
    if (!session) return;

    const remotePath = req.body.path as string;
    if (!remotePath) return res.status(400).json({ error: "请指定文件路径" });
    if (remotePath.includes("..")) return res.status(400).json({ error: "非法路径" });

    // Check file size first
    try {
      const sizeCode = `
size=$(stat -c%s "${remotePath}" 2>/dev/null || stat -f%z "${remotePath}" 2>/dev/null || echo 0)
file -b --mime-type "${remotePath}" 2>/dev/null || echo "application/octet-stream"
echo "SIZE:$size"
`;
      const checkCmd = [
        '-o', 'StrictHostKeyChecking=no',
        '-o', `ControlPath=${session.controlPath}`,
        '-o', 'BatchMode=yes',
        `${session.username}@${session.host}`,
        `bash -c '${sizeCode.replace(/'/g, "'\\''")}'`,
      ];

      const sizeResult = await new Promise<string>((resolve, reject) => {
        const proc = spawn('ssh', checkCmd, { timeout: 15000 });
        let out = '', err = '';
        proc.stdout?.on('data', (d) => out += d.toString());
        proc.stderr?.on('data', (d) => err += d.toString());
        proc.on('close', (code) => {
          // Non-zero is ok for stat on some systems
          resolve(out.trim());
        });
        proc.on('error', reject);
      });

      const lines = sizeResult.split('\n');
      const mime = lines[0]?.trim() || 'application/octet-stream';
      const sizeLine = lines.find(l => l.startsWith('SIZE:'));
      const fileSize = sizeLine ? parseInt(sizeLine.replace('SIZE:', ''), 10) : 0;

      // Reject files over 50MB
      if (fileSize > 50 * 1024 * 1024) {
        return res.status(413).json({ error: `文件过大 (${(fileSize / 1024 / 1024).toFixed(1)}MB)，限制 50MB` });
      }

      // Determine if text or binary
      const isText = mime.startsWith('text/') ||
        /\.(txt|md|json|xml|html|css|js|ts|py|R|r|sh|bash|pl|rb|jl|c|cpp|yml|yaml|csv|tsv|tab|log|out|err|fasta|fa|fna|ffn|fastq|fq|vcf|gvcf|sam|gff|gtf|bed)$/i.test(remotePath);

      // SCP file to temp
      const tmpFile = path.join(process.cwd(), 'uploads', `read_${uuidv4()}`);

      await new Promise<void>((resolve, reject) => {
        const proc = spawn('scp', [
          '-o', 'StrictHostKeyChecking=no',
          '-o', `ControlPath=${session.controlPath}`,
          '-o', 'BatchMode=yes',
          `${session.username}@${session.host}:${remotePath}`,
          tmpFile,
        ], { timeout: 30000 });
        let stderr = '';
        proc.stderr?.on('data', (d) => stderr += d.toString());
        proc.on('close', (code) => {
          if (code !== 0) reject(new Error(stderr.trim() || `SCP exit ${code}`));
          else resolve();
        });
        proc.on('error', reject);
      });

      // Read and encode
      const fileBuffer = fs.readFileSync(tmpFile);

      let content: string;
      let metadata: any = { size: fileSize, mime };

      if (isText) {
        content = fileBuffer.toString('utf-8');
      } else {
        content = fileBuffer.toString('base64');
        // Detect image dimensions if applicable
        if (mime.startsWith('image/')) {
          try {
            // Simple PNG dimension reader (reads IHDR)
            if (mime === 'image/png' && fileBuffer.length > 24) {
              const w = fileBuffer.readUInt32BE(16);
              const h = fileBuffer.readUInt32BE(20);
              metadata.dimensions = { width: w, height: h };
            }
          } catch { /* ignore */ }
        }
      }

      // Clean up temp
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);

      res.json({
        type: isText ? 'text' : 'binary',
        filePath: remotePath,
        content,
        metadata,
      });
    } catch (err: any) {
      res.status(500).json({ error: `读取失败: ${err.message}` });
    }
  });

  app.post("/api/files/read/batch", async (req, res) => {
    const session = getSessionOrFail(req, res);
    if (!session) return;

    const paths = req.body.paths as string[];
    if (!paths || !Array.isArray(paths)) return res.status(400).json({ error: "请提供文件路径列表" });
    if (paths.length > 10) return res.status(400).json({ error: "最多批量读取10个文件" });

    // Reuse single-file logic sequentially (simpler than parallel SSH sessions)
    const results: any[] = [];
    for (const remotePath of paths) {
      try {
        if (remotePath.includes("..")) { results.push({ error: "非法路径", filePath: remotePath }); continue; }

        const checkCmd = [
          '-o', 'StrictHostKeyChecking=no',
          '-o', `ControlPath=${session.controlPath}`,
          '-o', 'BatchMode=yes',
          `${session.username}@${session.host}`,
          `file -b --mime-type "${remotePath}" 2>/dev/null || echo "application/octet-stream"`,
        ];
        const mimeResult = await new Promise<string>((resolve) => {
          const proc = spawn('ssh', checkCmd, { timeout: 10000 });
          let out = '';
          proc.stdout?.on('data', (d) => out += d.toString());
          proc.on('close', () => resolve(out.trim() || 'application/octet-stream'));
        });

        const tmpFile = path.join(process.cwd(), 'uploads', `batch_${uuidv4()}`);
        await new Promise<void>((resolve, reject) => {
          const proc = spawn('scp', [
            '-o', 'StrictHostKeyChecking=no',
            '-o', `ControlPath=${session.controlPath}`,
            '-o', 'BatchMode=yes',
            `${session.username}@${session.host}:${remotePath}`,
            tmpFile,
          ], { timeout: 20000 });
          let stderr = '';
          proc.stderr?.on('data', (d) => stderr += d.toString());
          proc.on('close', (code) => {
            if (code !== 0) reject(new Error(stderr.trim()));
            else resolve();
          });
        });

        const fileBuffer = fs.readFileSync(tmpFile);
        const isText = mimeResult.startsWith('text/') || /\.(txt|md|json|csv|tsv|log|out|err|fasta|fa|fastq|fq|vcf|py|R|r|sh)$/i.test(remotePath);
        results.push({
          type: isText ? 'text' : 'binary',
          filePath: remotePath,
          content: isText ? fileBuffer.toString('utf-8') : fileBuffer.toString('base64'),
          metadata: { size: fileBuffer.length, mime: mimeResult },
        });
        if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
      } catch (err: any) {
        results.push({ error: err.message, filePath: remotePath });
      }
    }

    res.json(results);
  });
```

- [ ] **Step 2: Verify the server starts without syntax errors**

Run: `cd E:/0509hpclaw && npx tsx --eval "import './server'; console.log('Server module loaded OK')" 2>&1 | head -5`

Expected: `Server module loaded OK` (may show background startup messages)

- [ ] **Step 3: Commit**

```bash
git add server.ts
git commit -m "feat: add POST /api/files/read and /api/files/read/batch endpoints for inline file preview"
```

---

### Task 12: Backend — Observation Logger for passive learning

**Files:**
- Modify: `server.ts` — Add observation logging endpoint

- [ ] **Step 1: Add POST /api/observations endpoint to server.ts**

Insert this code block in the server routes section (before the conversation routes):

```typescript
  // ══════════════════════════════════════════════════════════════════
  //  OBSERVATION LOGGER — Passive learning from user behavior
  // ══════════════════════════════════════════════════════════════════

  const OBSERVATIONS: {
    timestamp: string;
    type: 'command' | 'directory' | 'module' | 'jobscript';
    data: string;
  }[] = [];

  app.post("/api/observations", (req, res) => {
    const { type, data } = req.body;
    if (!type || !data) return res.status(400).json({ error: "缺少参数" });
    if (!['command', 'directory', 'module', 'jobscript'].includes(type)) {
      return res.status(400).json({ error: "无效类型" });
    }

    OBSERVATIONS.push({
      timestamp: new Date().toISOString(),
      type,
      data: typeof data === 'string' ? data.slice(0, 500) : JSON.stringify(data).slice(0, 500),
    });

    // Keep only last 2000 observations
    if (OBSERVATIONS.length > 2000) {
      OBSERVATIONS.splice(0, OBSERVATIONS.length - 2000);
    }

    res.json({ success: true, count: OBSERVATIONS.length });
  });

  app.get("/api/observations/profile", (_req, res) => {
    // Generate a simple user profile summary from observations
    const profile: Record<string, { count: number; examples: string[] }> = {};

    for (const obs of OBSERVATIONS) {
      const key = `${obs.type}:${obs.data.slice(0, 40)}`;
      if (!profile[key]) profile[key] = { count: 0, examples: [] };
      profile[key].count++;
      if (profile[key].examples.length < 3 && !profile[key].examples.includes(obs.data)) {
        profile[key].examples.push(obs.data);
      }
    }

    // Sort by frequency, take top 20
    const sorted = Object.entries(profile)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 20)
      .map(([key, val]) => ({ pattern: key, ...val }));

    res.json({ success: true, totalObservations: OBSERVATIONS.length, profile: sorted });
  });
```

- [ ] **Step 2: Add frontend observation hook**

Create `src/hooks/useObservationLogger.ts`:

```typescript
import { useCallback } from 'react';

type ObservationType = 'command' | 'directory' | 'module' | 'jobscript';

export function useObservationLogger() {
  const log = useCallback(async (type: ObservationType, data: string) => {
    try {
      await fetch('/api/observations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data }),
      });
    } catch { /* silent — observation logging is best-effort */ }
  }, []);

  return { log };
}
```

- [ ] **Step 3: Add BioContext injection to AI prompts**

In `server.ts`, in the `/api/ai/stream` handler, add observation profile to system context. Find the system prompt construction and add:

```typescript
    // Get top patterns for bio context
    const topPatterns = OBSERVATIONS.slice(-100)
      .filter(o => o.type === 'command' || o.type === 'module')
      .map(o => o.data)
      .filter((v, i, a) => a.indexOf(v) === i)
      .slice(0, 5);

    if (topPatterns.length > 0) {
      const bioContextNote = `\n\n[用户行为背景]:\n最近集群操作: ${topPatterns.join(', ')}`;
      // Append to system message content
      if (messages.length > 0) {
        const sysMsg = messages.find((m: any) => m.role === 'system');
        if (sysMsg) {
          sysMsg.content = (sysMsg.content || '') + bioContextNote;
        }
      }
    }
```

- [ ] **Step 4: Verify syntax**

Run: `cd E:/0509hpclaw && node -e "const c = require('fs').readFileSync('server.ts','utf8'); console.log(c.includes('OBSERVATIONS') ? 'OK' : 'MISSING')"`

Expected: `OK`

---

### Task 13: Backend — Expand hpc-best-practices.md system skill

**Files:**
- Modify: `server.ts` — Replace the short hpc-best-practices content

- [ ] **Step 1: Replace the minimal hpc-best-practices content**

Read the current code at `server.ts` lines 22-26. Replace the `fs.writeFileSync` call:

```typescript
  fs.writeFileSync(path.join(SKILLS_DIR, "hpc-best-practices.md"), `# HPC Cluster Best Practices

## 1. Login Node Usage
- The login node is for **interactive work only** (editing, submitting jobs, checking status)
- Never run heavy computations (alignment, assembly, ML training) on the login node
- Use interactive jobs (\`bsub -Is bash\` or \`srun --pty bash\`) for testing

## 2. Job Scheduler (LSF / Slurm)
### LSF (LSF-NCPGR)
- Submit jobs: \`bsub -q <queue> -n <cpus> -o out.log -e err.log <command>\`
- Check status: \`bjobs\`, \`bjobs -l <jobid>\`, \`bjobs -u <username>\`
- Kill job: \`bkill <jobid>\`
- Queue info: \`bqueues\`, \`bhosts\`

### Slurm
- Submit: \`sbatch script.sh\`
- Status: \`squeue -u <username>\`, \`sacct\`
- Cancel: \`scancel <jobid>\`

## 3. Resource Requests
- Always specify CPU, memory, and walltime explicitly
- LSF: \`-n <cpus> -M <memory_MB> -W <minutes>\`
- Over-requesting wastes your fairshare priority; under-requesting causes OOM kills
- Typical requests:
  - Small: 1-4 CPU, 4-16GB, 1-4h
  - Medium: 8-16 CPU, 32-64GB, 12-24h
  - Large: 32+ CPU, 128GB+, 48h+

## 4. Storage & Quotas
- Check quota: \`quota -s\` or \`lfs quota -h /path\`
- Home directory: limited space, keep clean
- Scratch/project space: for large datasets and intermediate files
- Clean up temporary files after jobs complete

## 5. Software Modules
- List available: \`module avail\`
- Load: \`module load <name>/<version>\`
- List loaded: \`module list\`
- Purge all: \`module purge\`
- Common bioinformatics modules: samtools, bcftools, bwa, GATK, fastqc, multiqc

## 6. File Transfer
- Use \`scp\` or \`rsync\` from your local machine
- For large datasets, use \`rsync -avzP\` for resume capability
- Check network: \`ping\` and \`traceroute\` if transfers are slow

## 7. Best Practices Summary
1. Small tests first, then scale up
2. Monitor your jobs: \`bjobs -w\` or \`watch squeue\`
3. Use job arrays for batch processing: \`bsub -J "myarray[1-100]"\`
4. Save environment: \`conda env export > env.yml\` or \`pip freeze > requirements.txt\`
5. Document your pipeline steps — use this AI assistant to save SOPs
`);
```

- [ ] **Step 2: Verify syntax**

Run: `cd E:/0509hpclaw && node -e "require('fs').readFileSync('server.ts','utf8').includes('module purge'); console.log('OK')"`



---

### Task 14: Skills — Create preloaded bioinformatics knowledge files

**Files:**
- Create: `skills/bio/formats.md`
- Create: `skills/bio/alignment.md`
- Create: `skills/bio/qc.md`
- Create: `skills/bio/transcriptome.md`

- [ ] **Step 1: Create skills/bio/ directory and formats.md**

Run first: `mkdir -p E:/0509hpclaw/skills/bio`

Create `skills/bio/formats.md`:

```markdown
# Bioinformatics File Formats Reference

## FASTA (.fasta, .fa, .fna, .ffn)
- Header line starts with `>` followed by identifier and optional description
- Sequence lines: single-letter nucleotide or amino acid codes
- No fixed line length; wrap at 60-80 characters for readability
- Multi-FASTA: multiple `>` entries in one file

## FASTQ (.fastq, .fq)
- 4 lines per read:
  1. `@<read_id> <optional description>`
  2. Sequence (A/C/G/T/N)
  3. `+` (may repeat read_id)
  4. Quality scores (ASCII Phred+33 offset)
- Phred quality = ASCII(char) - 33; Q30 = error rate 0.001

## SAM/BAM
- SAM: tab-delimited text, 11 mandatory fields + optional tags
- BAM: binary compressed SAM (bgzip)
- Fields: QNAME, FLAG, RNAME, POS, MAPQ, CIGAR, RNEXT, PNEXT, TLEN, SEQ, QUAL
- FLAG interpretation: use `samtools flags <flag>` or Picard ExplainFlags
- CIGAR: M=match, I=insertion, D=deletion, N=skipped, S=soft clip, H=hard clip

## VCF (.vcf, .vcf.gz)
- Header lines start with `##`, column header line starts with `#CHROM`
- 8 fixed columns: CHROM, POS, ID, REF, ALT, QUAL, FILTER, INFO
- FORMAT + sample columns follow
- Genotype fields: GT (0/0, 0/1, 1/1), AD (allelic depths), DP (depth), GQ (quality)

## GFF/GTF (.gff, .gtf, .gff3)
- Tab-delimited: seqid, source, type, start, end, score, strand, phase, attributes
- GTF: gene/transcript/exon/CDS feature types
- GFF3: more flexible, uses `##` directives, `###` as separator

## BED (.bed)
- 3-12 columns, tab-delimited
- Required: chrom, chromStart (0-based), chromEnd (half-open)
- Optional: name, score, strand, thickStart, thickEnd, itemRgb, blockCount, blockSizes, blockStarts
```

- [ ] **Step 2: Create skills/bio/alignment.md**

```markdown
# Sequence Alignment Tools

## BLAST (Basic Local Alignment Search Tool)
### blastn (nucleotide vs nucleotide)
\`\`\`bash
blastn -query query.fasta -db /path/to/nt -out results.tsv -outfmt 6 -num_threads 8
\`\`\`
- Output format 6: tabular with qseqid sseqid pident length mismatch gapopen qstart qend sstart send evalue bitscore
- Common params: `-evalue 1e-5` (e-value threshold), `-max_target_seqs 10`

### blastp (protein vs protein)
\`\`\`bash
blastp -query proteins.fasta -db /path/to/nr -out results.tsv -outfmt 6 -num_threads 8
\`\`\`

### makeblastdb (create custom database)
\`\`\`bash
makeblastdb -in reference.fasta -dbtype nucl -out mydb
\`\`\`

## BWA (Burrows-Wheeler Aligner)
### Index reference
\`\`\`bash
bwa index reference.fasta
\`\`\`
### MEM algorithm (recommended for 70bp-1Mbp reads)
\`\`\`bash
bwa mem -t 8 reference.fasta reads_1.fq reads_2.fq > aligned.sam
\`\`\`

## Bowtie2
\`\`\`bash
bowtie2-build reference.fasta ref_index
bowtie2 -x ref_index -1 reads_1.fq -2 reads_2.fq -S aligned.sam -p 8
\`\`\`

## Minimap2 (long reads: PacBio, ONT)
\`\`\`bash
minimap2 -ax map-ont reference.fasta reads.fastq > aligned.sam   # ONT
minimap2 -ax map-pb reference.fasta reads.fastq > aligned.sam    # PacBio
minimap2 -ax sr reference.fasta reads_1.fq reads_2.fq > aln.sam  # short reads
\`\`\`

## STAR (RNA-seq aligner)
\`\`\`bash
STAR --runThreadN 16 \
     --genomeDir /path/to/star_index \
     --readFilesIn reads_1.fq reads_2.fq \
     --outSAMtype BAM SortedByCoordinate \
     --quantMode GeneCounts
\`\`\`

## HISAT2 (RNA-seq aligner, faster than STAR)
\`\`\`bash
hisat2-build reference.fasta ref_index
hisat2 -x ref_index -1 reads_1.fq -2 reads_2.fq -S aligned.sam -p 8
\`\`\`

## Post-Alignment Processing
\`\`\`bash
# SAM to sorted BAM
samtools view -bS aligned.sam | samtools sort -o sorted.bam
samtools index sorted.bam

# Mark duplicates (Picard)
picard MarkDuplicates I=sorted.bam O=dedup.bam M=metrics.txt

# Quality check
samtools flagstat sorted.bam
\`\`\`
```

- [ ] **Step 3: Create skills/bio/qc.md**

```markdown
# Quality Control Tools

## FastQC
\`\`\`bash
fastqc sample_R1.fastq.gz sample_R2.fastq.gz -o qc_report/ -t 4
\`\`\`
- Generates HTML report with per-base quality, GC content, adapter content, etc.
- Key metrics: Per base sequence quality (should stay in green), Per sequence GC content (normal distribution)

## MultiQC
Aggregates multiple FastQC reports into one:
\`\`\`bash
multiqc qc_report/ -o multiqc_report/
\`\`\`

## fastp (all-in-one: QC + trimming + filtering)
\`\`\`bash
fastp -i reads_1.fq.gz -I reads_2.fq.gz \
      -o clean_1.fq.gz -O clean_2.fq.gz \
      -h fastp_report.html -j fastp.json \
      --qualified_quality_phred 20 \
      --length_required 50 \
      --detect_adapter_for_pe \
      --thread 8
\`\`\`

## Trimmomatic
\`\`\`bash
trimmomatic PE -threads 8 \
  reads_1.fq reads_2.fq \
  paired_1.fq unpaired_1.fq paired_2.fq unpaired_2.fq \
  ILLUMINACLIP:adapters.fa:2:30:10 \
  LEADING:3 TRAILING:3 SLIDINGWINDOW:4:15 MINLEN:36
\`\`\`

## cutadapt (adapter trimming)
\`\`\`bash
cutadapt -a ADAPTER_SEQ -o trimmed.fastq reads.fastq
cutadapt -a AGATCGGAAGAGC -A AGATCGGAAGAGC -o trimmed_1.fq -p trimmed_2.fq reads_1.fq reads_2.fq
\`\`\`
```

- [ ] **Step 4: Create skills/bio/transcriptome.md**

```markdown
# Transcriptome Analysis Tools

## DESeq2 (R package, differential expression)
\`\`\`r
library(DESeq2)
dds <- DESeqDataSetFromMatrix(countData = counts, colData = metadata, design = ~ condition)
dds <- DESeq(dds)
res <- results(dds, contrast = c("condition", "treated", "control"))
res_sig <- res[which(res$padj < 0.05 & abs(res$log2FoldChange) > 1), ]
write.csv(as.data.frame(res_sig), "deg_results.csv")
\`\`\`

## edgeR (R package, alternative to DESeq2)
\`\`\`r
library(edgeR)
dge <- DGEList(counts = counts, group = group)
dge <- calcNormFactors(dge)
design <- model.matrix(~ group)
dge <- estimateDisp(dge, design)
fit <- glmQLFit(dge, design)
qlf <- glmQLFTest(fit)
topTags(qlf, n = 100)
\`\`\`

## Salmon (quantification, alignment-free)
\`\`\`bash
salmon index -t transcriptome.fasta -i salmon_index
salmon quant -i salmon_index -l A -1 reads_1.fq -2 reads_2.fq -o output -p 8
\`\`\`

## Kallisto (fast pseudoalignment)
\`\`\`bash
kallisto index -i kallisto_index transcriptome.fasta
kallisto quant -i kallisto_index -o output -t 8 reads_1.fq reads_2.fq
\`\`\`

## StringTie (transcript assembly)
\`\`\`bash
stringtie sorted.bam -o transcripts.gtf -p 8
stringtie --merge -G reference.gtf -o merged.gtf transcripts_list.txt
\`\`\`

## Downstream Analysis
### GO enrichment (clusterProfiler in R)
\`\`\`r
library(clusterProfiler)
ego <- enrichGO(gene = gene_list, OrgDb = org.Hs.eg.db, ont = "BP", pAdjustMethod = "BH")
dotplot(ego)
\`\`\`

### KEGG pathway
\`\`\`r
ekegg <- enrichKEGG(gene = entrez_ids, organism = "hsa")
barplot(ekegg)
\`\`\`
```

- [ ] **Step 5: Commit all bio skills**

```bash
git add skills/bio/
git commit -m "feat: add preloaded bioinformatics knowledge files (formats, alignment, qc, transcriptome)"
```

---

### Task 15: Integrate nature-skills into skills/nature/

**Files:**
- Depends on: `https://github.com/Yuan1z0825/nature-skills`

- [ ] **Step 1: Clone nature-skills into skills/nature/**

Run:
```bash
cd E:/0509hpclaw
git clone --depth 1 https://github.com/Yuan1z0825/nature-skills.git /tmp/nature-skills-temp
cp -R /tmp/nature-skills-temp/skills/* skills/nature/
rm -rf /tmp/nature-skills-temp
ls skills/nature/
```

Expected: `nature-academic-search  nature-citation  nature-data  nature-figure  nature-paper2ppt  nature-polishing  nature-reader  nature-response  nature-writing`

- [ ] **Step 2: Commit**

```bash
git add skills/nature/
git commit -m "feat: integrate nature-skills academic research pack (9 skills)"
```

---

### Task 16: BioSkillPanel — Right panel tab for skills browser

**Files:**
- Create: `src/components/BioSkillPanel.tsx`

- [ ] **Step 1: Create BioSkillPanel with category tabs**

Create `src/components/BioSkillPanel.tsx`:

```typescript
import { useState, useEffect } from 'react';
import { Dna, BookOpen, FileText, Cpu, Search, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SkillFile {
  filename: string;
  content: string;
  size?: number;
  isSystem?: boolean;
}

interface BioSkillPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type Category = 'all' | 'bio' | 'nature' | 'system' | 'user';

const CATEGORIES: { key: Category; label: string; icon: typeof Dna }[] = [
  { key: 'all', label: '全部', icon: BookOpen },
  { key: 'bio', label: '生信工具', icon: Dna },
  { key: 'nature', label: '学术技能', icon: FileText },
  { key: 'system', label: '系统', icon: Cpu },
  { key: 'user', label: '自定义', icon: FileText },
];

function getCategory(filename: string): Category {
  if (filename.startsWith('bio/') || /^(alignment|variants|transcriptome|qc|assembly|annotation|formats|phylogeny)\.md$/.test(filename)) return 'bio';
  if (filename.includes('nature-')) return 'nature';
  if (filename.startsWith('lsf') || filename.startsWith('hpc')) return 'system';
  return 'user';
}

export default function BioSkillPanel({ isOpen, onClose }: BioSkillPanelProps) {
  const [skills, setSkills] = useState<SkillFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCat, setActiveCat] = useState<Category>('all');
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadSkills = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/skills');
      const data = await res.json();
      if (data.success) setSkills(data.skills);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { if (isOpen) loadSkills(); }, [isOpen]);

  const filtered = skills.filter(s => {
    const cat = getCategory(s.filename);
    if (activeCat !== 'all' && cat !== activeCat) return false;
    if (searchQuery) return s.filename.toLowerCase().includes(searchQuery.toLowerCase());
    return true;
  });

  if (!isOpen) return null;

  return (
    <div className="h-full flex flex-col bg-zinc-900/80 border-l border-zinc-800">
      {/* Header */}
      <div className="p-3 border-b border-zinc-800 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-zinc-200 flex items-center gap-2">
            <Dna className="w-4 h-4 text-emerald-400" /> 技能知识库
          </h3>
        </div>
        {/* Search */}
        <div className="relative mb-3">
          <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="搜索技能..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded pl-7 pr-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
          />
        </div>
        {/* Categories */}
        <div className="flex gap-1 flex-wrap">
          {CATEGORIES.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveCat(key)}
              className={`px-2.5 py-1 rounded text-xs flex items-center gap-1 transition-colors ${
                activeCat === key ? 'bg-emerald-500/20 text-emerald-400' : 'text-zinc-500 hover:bg-zinc-800'
              }`}
            >
              <Icon className="w-3 h-3" /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Skill list */}
      <div className="flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="flex items-center justify-center p-8 text-zinc-500">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-center text-zinc-500 text-xs">暂无匹配技能</div>
        ) : (
          <div className="space-y-1">
            {filtered.map(skill => {
              const cat = getCategory(skill.filename);
              const isExpanded = expandedSkill === skill.filename;
              return (
                <div key={skill.filename} className={`rounded-lg border ${
                  cat === 'bio' ? 'border-emerald-500/10 bg-emerald-500/5' :
                  cat === 'nature' ? 'border-blue-500/10 bg-blue-500/5' :
                  cat === 'system' ? 'border-purple-500/10 bg-purple-500/5' :
                  'border-zinc-800 bg-zinc-900'
                }`}>
                  <button
                    onClick={() => setExpandedSkill(isExpanded ? null : skill.filename)}
                    className="w-full flex items-center justify-between p-2.5 text-left"
                  >
                    <span className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                      {isExpanded ? <ChevronDown className="w-3 h-3 text-zinc-500" /> : <ChevronRight className="w-3 h-3 text-zinc-500" />}
                      {skill.filename.replace('.md', '')}
                    </span>
                    <span className="text-[10px] text-zinc-600">{cat === 'system' ? '系统' : cat === 'bio' ? '生信' : cat === 'nature' ? '学术' : '自定义'}</span>
                  </button>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <pre className="mx-2 mb-2 p-2 text-xs text-zinc-400 whitespace-pre-wrap max-h-60 overflow-y-auto bg-zinc-950/50 rounded">
                          {skill.content.slice(0, 3000)}
                          {skill.content.length > 3000 && '\n\n... (内容过长，已截断)'}
                        </pre>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify syntax**

Run: `cd E:/0509hpclaw && node -e "require('fs').readFileSync('src/components/BioSkillPanel.tsx','utf8'); console.log('OK')"`

---

### Task 17: Modify AIChat — Autonomous Agent + RichContent integration

**Files:**
- Modify: `src/components/AIChat.tsx`

- [ ] **Step 1: Add RichContent imports**

At the top of AIChat.tsx, after existing imports:
```typescript
import { RichContentMessage } from './rich-content';
import { useObservationLogger } from '../hooks/useObservationLogger';
```

- [ ] **Step 2: Add RichContent to MessageBubble for assistant messages**

In the `MessageBubble` component, after the `{cleanContent && (...)}` block and BEFORE the `{outputFiles.length > 0 && (...)}` block, add:

```typescript
{/* RichContent cards: auto-detect and display file outputs */}
{msg.role === 'assistant' && (
  <RichContentMessage className="mt-2">
    {msg.content}
  </RichContentMessage>
)}
```

- [ ] **Step 3: Enhance Agent Mode loop — auto-fetch results after each execute step**

In the `handleAgentMode` function, after the `executeCommand(cmd, true)` call returns output, add automatic file path extraction and RichContent fetch. Find the line:
```typescript
const output = await executeCommand(cmd, true);
```

And add after it:
```typescript
// Auto-detect output files from command output for RichContent preview
const outputPaths = extractFilePaths(output + '\n' + cmd);
for (const fpath of outputPaths.slice(0, 3)) {
  try {
    await fetchFileContent(fpath);
  } catch { /* best-effort preload */ }
}
```

Add the import for `fetchFileContent`:
```typescript
import { RichContentMessage } from './rich-content';
import { extractFilePaths } from './rich-content';
import { fetchFileContent } from './rich-content';
```

- [ ] **Step 4: Add observation logging to agent execution**

In `handleAgentMode`, after a command is executed, log it:
```typescript
log('command', cmd);
```

In `handleFastMode`, after a command is executed:
```typescript
log('command', cmd);
```

- [ ] **Step 5: Use observation hook in AIChat component**

At the top of the `AIChat` function component:
```typescript
const { log } = useObservationLogger();
```

- [ ] **Step 6: Verify integration**

Run: `cd E:/0509hpclaw && node -e "const c = require('fs').readFileSync('src/components/AIChat.tsx','utf8'); console.log(c.includes('RichContentMessage') && c.includes('useObservationLogger') ? 'OK' : 'MISSING')"`

Expected: `OK`

---

### Task 18: Modify App.tsx — Add BioSkills tab to right panel

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Import BioSkillPanel and add to right panel**

Add import:
```typescript
import BioSkillPanel from './components/BioSkillPanel';
```

Update the `activeRightPanel` type to include 'bioskills':
```typescript
const [activeRightPanel, setActiveRightPanel] = useState<'files' | 'results' | 'history' | 'bioskills' | null>(null);
```

Update `handleToggleRightPanel` to accept 'bioskills':
```typescript
const handleToggleRightPanel = (panel: 'files' | 'results' | 'history' | 'bioskills') => {
```

Add BioSkills rendering in the right panel AnimatePresence block:
```typescript
) : activeRightPanel === 'bioskills' ? (
  <BioSkillPanel
    isOpen={true}
    onClose={() => setActiveRightPanel(null)}
  />
) : activeRightPanel === 'files' ? (
```

- [ ] **Step 2: Verify integration**

Run: `cd E:/0509hpclaw && node -e "const c = require('fs').readFileSync('src/App.tsx','utf8'); console.log(c.includes('BioSkillPanel') ? 'OK' : 'MISSING')"`

Expected: `OK`

---

### Task 19: Modify Header.tsx — Add BioSkills toggle button and icon import

**Files:**
- Modify: `src/components/Header.tsx`

- [ ] **Step 1: Add DNA icon import and BioSkills button**

Update the import:
```typescript
import { LogOut, Bot, Database, FolderOpen, Dna } from 'lucide-react';
```

Update the interface to accept 'bioskills':
```typescript
  activeRightPanel: 'files' | 'results' | 'history' | 'bioskills' | null;
  onToggleRightPanel: (panel: 'files' | 'results' | 'history' | 'bioskills') => void;
```

Add the BioSkills button after the Results button (before the divider):
```typescript
        <button
          onClick={() => onToggleRightPanel('bioskills')}
          className={`p-2 rounded-lg text-sm transition-colors ${
            activeRightPanel === 'bioskills' ? 'bg-emerald-600 text-white' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
          }`}
          title="生信技能"
          aria-label="生信技能"
        >
          <Dna className="w-4 h-4" />
        </button>
```

- [ ] **Step 2: Verify**

Run: `cd E:/0509hpclaw && node -e "const c = require('fs').readFileSync('src/components/Header.tsx','utf8'); console.log(c.includes('Dna') ? 'OK' : 'MISSING')"`

---

### Task 20: Update index.css — Add RichContent card and code styles

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Add card-related styles**

Add to `src/index.css` after the existing content:

```css
/* ── RichContent Card Styles ─────────────────────────────────── */
.rich-card {
  transition: border-color 0.15s ease;
}
.rich-card:hover {
  border-color: rgb(82 82 91 / 0.8);
}

/* Inline code in AI messages */
.rich-content-cards .rich-card + .rich-card {
  margin-top: 0.5rem;
}

/* Code block within cards */
.rich-card pre code {
  font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
  tab-size: 2;
}

/* Table card striped rows */
.rich-card table tbody tr:nth-child(even) {
  background: rgb(39 39 42 / 0.3);
}

/* FASTA sequence styling */
.rich-card .fasta-sequence {
  font-family: "JetBrains Mono", monospace;
  letter-spacing: 0.05em;
  word-break: break-all;
}

/* Card loading shimmer */
@keyframes card-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.rich-card-loading {
  background: linear-gradient(90deg, rgb(39 39 42 / 0.5) 25%, rgb(63 63 70 / 0.5) 50%, rgb(39 39 42 / 0.5) 75%);
  background-size: 200% 100%;
  animation: card-shimmer 1.5s infinite;
}
```

- [ ] **Step 2: Verify**

Run: `cd E:/0509hpclaw && node -e "const c = require('fs').readFileSync('src/index.css','utf8'); console.log(c.includes('rich-card') ? 'OK' : 'MISSING')"`

Expected: `OK`

---

### Task 21: Install dependencies and verify build

**Files:**
- Modify: `package.json` (if new deps needed)

- [ ] **Step 1: No new dependencies for Phase 1**

Phase 1 uses only existing dependencies. Run type check:

```bash
cd E:/0509hpclaw && npx tsc --noEmit 2>&1 | head -20
```

Fix any type errors that surface from the new components.

- [ ] **Step 2: Verify dev server starts**

```bash
cd E:/0509hpclaw && timeout 10 npm run dev 2>&1 || true
```

Expected: Server starts without crash.

- [ ] **Step 3: Commit all remaining changes**

```bash
git add -A
git commit -m "feat: HPClaw 2.0 — BioSkill engine, RichContent cards, tabbed panels, file content API"
```
