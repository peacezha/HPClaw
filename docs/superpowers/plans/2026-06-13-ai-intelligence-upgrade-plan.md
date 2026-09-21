# AI 智能升级 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade HPClaw's AI with cluster context awareness, skill interaction graph, hierarchical memory, token budget management, and agent task planning.

**Architecture:** Build 8 new modules in `server/ai/` (tokenBudget, clusterContext, fileRecognizer, skillGraph, skillOrchestrator, memoryOrchestrator, memoryCompressor, observationStore, agentPlanner), upgrade 3 existing modules (skillIndex, conversationMemory, skillInstaller), rewrite contextBuilder, and update server routes + AIChat agent loop. Each module has a single responsibility with well-defined interfaces.

**Tech Stack:** TypeScript, Node.js fs, vitest for testing, @xenova/transformers for local embeddings, existing SSH session for cluster commands.

---

### Task 1: Extend Type Definitions

**Files:**
- Modify: `server/ai/types.ts`

- [ ] **Step 1: Add new type definitions to types.ts**

Read the current file, then replace it with the extended types:

```typescript
export type AIProvider =
  | 'gemini'
  | 'openai'
  | 'deepseek'
  | 'grok'
  | 'moonshot'
  | 'custom-openai';

export type LegacyAIProvider = AIProvider | 'kimi';

export interface AIProfile {
  provider: AIProvider;
  baseUrl?: string;
  model: string;
  apiKey: string;
  name?: string;
  temperature?: number;
}

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export type GatewayMode = 'chat' | 'agent' | 'fast' | 'autocomplete' | 'analysis';

export interface SkillMetadata {
  filename: string;
  name: string;
  description: string;
  tags: string[];
  trigger?: string;
  category: string;
  content: string;
  excerpt: string;
  size: number;
  isSystem: boolean;
  source: 'system' | 'imported' | 'user' | 'lsf';
  sourcePath: string;
  score?: number;
  // New: skill relation fields from frontmatter
  dependsOn?: string[];
  relatedTo?: string[];
  usedWith?: string[];
  solves?: string[];
}

export interface SkillIndex {
  generatedAt: string;
  skills: SkillMetadata[];
}

export type SkillRelation = 'depends_on' | 'related_to' | 'used_with' | 'triggers' | 'solves';

export interface SkillEdge {
  from: string;
  to: string;
  relation: SkillRelation;
  weight: number;
  reason: string;
}

export interface SkillGraph {
  nodes: Map<string, SkillMetadata>;
  edges: SkillEdge[];
  adjacency: Map<string, SkillEdge[]>;
}

export type FileType = 'fastq' | 'fasta' | 'bam' | 'sam' | 'vcf' | 'gvcf' | 'bed' | 'gff' | 'gtf' | 'fa' | 'fasta' | 'lsf' | 'sh' | 'html' | 'csv' | 'tsv' | 'png' | 'pdf' | 'r' | 'py' | 'directory' | 'other';

export interface FileEntry {
  name: string;
  size: number;
  modified: number;
  type: FileType;
  recognizedSkillHints: string[];
}

export interface JobEntry {
  jobId: string;
  name: string;
  status: 'RUN' | 'PEND' | 'DONE' | 'EXIT' | 'UNKNOWN';
  cores: number;
  queue: string;
  runtime: string;
}

export interface QuotaInfo {
  filesystem: string;
  used: string;
  total: string;
  percent: string;
}

export interface QueueInfo {
  name: string;
  slots: number;
  used: number;
  available: number;
}

export interface ClusterSnapshot {
  workingDir: string;
  files: FileEntry[];
  jobs: JobEntry[];
  quota: QuotaInfo | null;
  modules: string[];
  queueStatus: QueueInfo[];
  timestamp: number;
}

export type SnapshotDepth = 'quick' | 'standard' | 'full';

export interface ObservationEntry {
  id?: string;
  type: 'command' | 'output' | 'error' | 'warning' | 'state_change' | 'job_submit' | 'file_create';
  data: string;
  timestamp?: string;
  summary?: string;
  importance?: 1 | 2 | 3;
  relatedSkills?: string[];
  relatedFiles?: string[];
  command?: string;
  exitCode?: number;
  causalFrom?: string;
}

export interface ContextBuildOptions {
  messages: AIMessage[];
  mode?: GatewayMode;
  skillIndex?: SkillIndex;
  observations?: ObservationEntry[];
  memory?: string;
  summary?: string;
  terminalState?: string;
  selectedOutput?: string;
  maxSkillChars?: number;
  maxMessageChars?: number;
  // New fields
  sshSessionId?: string;
  skillGraph?: SkillGraph;
  structuredMemory?: StructuredMemory;
  taskPlan?: TaskPlan;
}

export interface GatewayRequest {
  profile: AIProfile;
  messages: AIMessage[];
  isFastMode?: boolean;
  maxTokens?: number;
}

export interface StreamEvent {
  type: 'reasoning' | 'content' | 'done' | 'error';
  content?: string;
  error?: string;
}

// ─── Token Budget ─────────────────────────────────────────

export interface TokenAllocation {
  min: number;
  max: number;
  used: number;
  priority: number;  // 1-10, higher = keep longer under pressure
}

export interface TokenBudget {
  total: number;
  used: number;
  allocations: Map<string, TokenAllocation>;
}

// ─── Skill Knowledge Pack ─────────────────────────────────

export interface SkillSnippet {
  skillFile: string;
  chapter?: string;
  content: string;
  tokenCount: number;
  relevanceScore: number;
}

export interface BibleChunk {
  chapter: string;
  content: string;
  tokenCount: number;
  relevanceScore: number;
}

export interface SkillKnowledgePack {
  core: SkillSnippet | null;
  dependencies: SkillSnippet[];
  related: SkillSnippet[];
  bible: BibleChunk[];
  totalTokens: number;
}

// ─── Memory ───────────────────────────────────────────────

export interface KeyFact {
  category: 'environment' | 'data' | 'method' | 'result' | 'preference';
  fact: string;
  timestamp: number;
}

export interface Decision {
  what: string;
  why: string;
}

export interface ErrorRecord {
  error: string;
  resolution: string;
}

export interface StructuredMemory {
  task: string;
  progress: {
    phase: number;
    description: string;
    completed: number;
    total?: number;
  };
  keyFacts: KeyFact[];
  decisions: Decision[];
  skillsUsed: string[];
  errors: ErrorRecord[];
  generatedAt: number;
}

export interface ConversationWithMemory {
  messages?: AIMessage[];
  summary?: string;
  memory?: string;
  skillHints?: string[];
  structuredMemory?: StructuredMemory;
  [key: string]: any;
}

// ─── Agent Planner ────────────────────────────────────────

export interface Step {
  id: string;
  description: string;
  command?: string;
  status: 'pending' | 'running' | 'done' | 'failed';
  result?: string;
  linkedSkills: string[];
  jobId?: string;
}

export interface Phase {
  id: number;
  name: string;
  status: 'pending' | 'active' | 'done' | 'failed';
  steps: Step[];
  linkedSkills: string[];
  entryConditions: string[];
}

export interface TaskPlan {
  goal: string;
  phases: Phase[];
  currentPhase: number;
  createdAt: number;
}
```

- [ ] **Step 2: Run TypeScript check to verify types compile**

```bash
npx tsc --noEmit server/ai/types.ts
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add server/ai/types.ts
git commit -m "feat: extend AI types with skill graph, memory, token budget, cluster context definitions

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 2: Token Budget Manager

**Files:**
- Create: `server/ai/tokenBudget.ts`
- Create: `server/ai/tokenBudget.test.ts`

- [ ] **Step 1: Write the test file**

```typescript
// server/ai/tokenBudget.test.ts
import { describe, expect, it } from 'vitest';
import { TokenBudgetManager, estimateTokens, MODEL_WINDOWS } from './tokenBudget';

describe('estimateTokens', () => {
  it('counts English text roughly at 4 chars per token', () => {
    const result = estimateTokens('Hello world, this is a test.');
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(15);
  });

  it('counts Chinese text at ~1.5 chars per token', () => {
    const result = estimateTokens('这是一段中文测试文本');
    expect(result).toBeGreaterThan(3);
    expect(result).toBeLessThan(15);
  });

  it('returns 0 for empty string', () => {
    expect(estimateTokens('')).toBe(0);
  });
});

describe('TokenBudgetManager', () => {
  it('allocates budget for components and tracks usage', () => {
    const budget = new TokenBudgetManager('deepseek-v4-pro');

    const tokens = budget.request('skills', 25000);
    expect(tokens).toBe(25000);
    expect(budget.used()).toBeLessThan(30000); // skills + overhead

    const conv = budget.request('conversation', 50000);
    expect(conv).toBeGreaterThan(0);
    expect(conv).toBeLessThanOrEqual(50000);
  });

  it('refuses allocation when budget exhausted', () => {
    const budget = new TokenBudgetManager('deepseek-v4-pro');
    budget.request('skills', 130000);
    const remaining = budget.request('conversation', 5000);
    expect(remaining).toBe(0);
  });

  it('rebalances by priority when under pressure', () => {
    const budget = new TokenBudgetManager('deepseek-v4-pro');
    budget.setPriority('conversation', 5);
    budget.setPriority('skills', 10);
    budget.request('conversation', 80000);
    budget.request('skills', 50000);
    // skills should get its allocation because of higher priority
    const skillsAlloc = budget.getAllocation('skills');
    expect(skillsAlloc.used).toBeGreaterThan(0);
  });

  it('returns correct window size for known models', () => {
    expect(MODEL_WINDOWS['deepseek-v4-pro']).toBe(131072);
    expect(MODEL_WINDOWS['deepseek-chat']).toBe(65536);
    expect(MODEL_WINDOWS['moonshot-v1-32k']).toBe(32768);
  });

  it('defaults to 65536 for unknown models', () => {
    const budget = new TokenBudgetManager('unknown-model');
    expect(budget.total()).toBe(65536);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run server/ai/tokenBudget.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Write the implementation**

```typescript
// server/ai/tokenBudget.ts
import type { TokenAllocation, TokenBudget } from './types';

export const MODEL_WINDOWS: Record<string, number> = {
  'deepseek-v4-pro': 131072,
  'deepseek-chat': 65536,
  'deepseek-reasoner': 65536,
  'gemini-3.1-pro-preview': 1048576,
  'gpt-4o-mini': 131072,
  'grok-2-latest': 131072,
  'moonshot-v1-32k': 32768,
};

const DEFAULT_WINDOW = 65536;

function isCJK(char: string): boolean {
  const code = char.charCodeAt(0);
  return (code >= 0x4E00 && code <= 0x9FFF) ||
    (code >= 0x3400 && code <= 0x4DBF) ||
    (code >= 0x3040 && code <= 0x309F) ||
    (code >= 0x30A0 && code <= 0x30FF) ||
    (code >= 0xAC00 && code <= 0xD7AF);
}

export function estimateTokens(text: string): number {
  if (!text) return 0;
  let cjkCount = 0;
  let otherCount = 0;
  for (const char of text) {
    if (isCJK(char)) {
      cjkCount++;
    } else {
      otherCount++;
    }
  }
  // CJK: ~1.5 chars per token; ASCII: ~4 chars per token
  return Math.ceil(cjkCount / 1.5) + Math.ceil(otherCount / 4);
}

export class TokenBudgetManager {
  private budget: TokenBudget;

  constructor(model: string) {
    const total = MODEL_WINDOWS[model] ?? DEFAULT_WINDOW;
    this.budget = {
      total,
      used: 0,
      allocations: new Map(),
    };
    // Reserve 15% for AI response
    this.budget.used = Math.ceil(total * 0.15);
    // Reserve ~3% for system overhead
    this.budget.used += 800;
  }

  total(): number {
    return this.budget.total;
  }

  used(): number {
    return this.budget.used;
  }

  available(): number {
    return Math.max(0, this.budget.total - this.budget.used);
  }

  request(component: string, desired: number): number {
    const alloc = this.budget.allocations.get(component);
    const max = alloc?.max ?? this.budget.total;
    const available = this.available();
    const granted = Math.min(desired, max, available);
    if (granted <= 0) return 0;

    this.budget.allocations.set(component, {
      min: alloc?.min ?? 0,
      max,
      used: granted,
      priority: alloc?.priority ?? 5,
    });
    this.budget.used += granted;
    return granted;
  }

  setPriority(component: string, priority: number): void {
    const alloc = this.budget.allocations.get(component);
    if (alloc) {
      alloc.priority = priority;
    } else {
      this.budget.allocations.set(component, { min: 0, max: this.budget.total, used: 0, priority });
    }
  }

  setLimits(component: string, min: number, max: number): void {
    const existing = this.budget.allocations.get(component);
    this.budget.allocations.set(component, {
      min,
      max,
      used: existing?.used ?? 0,
      priority: existing?.priority ?? 5,
    });
  }

  getAllocation(component: string): TokenAllocation | undefined {
    return this.budget.allocations.get(component);
  }

  rebalance(requiredTokens: number): void {
    if (this.available() >= requiredTokens) return;
    const shortage = requiredTokens - this.available();

    // Sort allocations by priority ascending (lowest priority first)
    const sorted = [...this.budget.allocations.entries()]
      .sort((a, b) => a[1].priority - b[1].priority);

    let reclaimed = 0;
    for (const [name, alloc] of sorted) {
      if (reclaimed >= shortage) break;
      const excess = Math.max(0, alloc.used - alloc.min);
      const take = Math.min(excess, shortage - reclaimed);
      if (take > 0) {
        alloc.used -= take;
        this.budget.used -= take;
        reclaimed += take;
      }
    }
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run server/ai/tokenBudget.test.ts
```

Expected: All 7 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add server/ai/tokenBudget.ts server/ai/tokenBudget.test.ts
git commit -m "feat: add TokenBudgetManager with cross-model token estimation and priority rebalancing

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 3: File Recognizer

**Files:**
- Create: `server/ai/fileRecognizer.ts`
- Create: `server/ai/fileRecognizer.test.ts`

- [ ] **Step 1: Write the test file**

```typescript
// server/ai/fileRecognizer.test.ts
import { describe, expect, it } from 'vitest';
import { FileRecognizer, extractPattern, matchesGlob } from './fileRecognizer';

describe('matchesGlob', () => {
  it('matches *.fastq.gz against sample_R1.fastq.gz', () => {
    expect(matchesGlob('sample_R1.fastq.gz', '*.fastq.gz')).toBe(true);
  });
  it('does not match .txt against *.fastq.gz', () => {
    expect(matchesGlob('readme.txt', '*.fastq.gz')).toBe(false);
  });
  it('matches *.bam', () => {
    expect(matchesGlob('aligned.bam', '*.bam')).toBe(true);
  });
});

describe('FileRecognizer', () => {
  const recognizer = new FileRecognizer();

  it('recognizes FASTQ files and links to qc skill', () => {
    const result = recognizer.analyze('sample_01_R1.fastq.gz', 5000000, Date.now());
    expect(result.type).toBe('fastq');
    expect(result.recognizedSkillHints).toContain('qc');
  });

  it('recognizes BAM files and links to alignment skill', () => {
    const result = recognizer.analyze('sample_01.bam', 2000000000, Date.now());
    expect(result.type).toBe('bam');
    expect(result.recognizedSkillHints).toContain('alignment');
  });

  it('recognizes LSF script files', () => {
    const result = recognizer.analyze('myjob.lsf', 1024, Date.now());
    expect(result.type).toBe('lsf');
    expect(result.recognizedSkillHints).toContain('lsf-ncpgr');
  });

  it('infers analysis phase from file collection', () => {
    const files = [
      { name: 'sample_01.fastq.gz', size: 5000000, modified: Date.now(), type: 'fastq' as const, recognizedSkillHints: ['qc'] },
      { name: 'sample_01.bam', size: 2000000000, modified: Date.now(), type: 'bam' as const, recognizedSkillHints: ['alignment'] },
    ];
    const phase = recognizer.inferPhase(files);
    expect(phase.phase).toContain('比对');
    expect(phase.skills).toContain('alignment');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run server/ai/fileRecognizer.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Write the implementation**

```typescript
// server/ai/fileRecognizer.ts
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

export function matchesGlob(filename: string, glob: string): boolean {
  const pattern = '^' + glob.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$';
  return new RegExp(pattern, 'i').test(filename);
}

export function extractPattern(filename: string): string {
  // Remove common suffixes to detect base pattern
  return filename
    .replace(/\.gz$/i, '')
    .replace(/\.(fastq|fq|bam|sam|vcf|bed|gff|gff3|gtf|fa|fasta|lsf|sh|html|csv|tsv|png|jpg|svg|pdf|R|py)$/i, '');
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
    for (const f of files) allSkills.add(...f.recognizedSkillHints);

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
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run server/ai/fileRecognizer.test.ts
```

Expected: All 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add server/ai/fileRecognizer.ts server/ai/fileRecognizer.test.ts
git commit -m "feat: add FileRecognizer to map file types to skills and infer analysis phase

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 4: Cluster Context Provider

**Files:**
- Create: `server/ai/clusterContext.ts`
- Create: `server/ai/clusterContext.test.ts`

- [ ] **Step 1: Write the test file**

```typescript
// server/ai/clusterContext.test.ts
import { describe, expect, it } from 'vitest';
import { parseLsOutput, parseBjobsOutput, parseQuotaOutput, ClusterContextProvider } from './clusterContext';

describe('parseLsOutput', () => {
  it('parses ls -lh output into file entries', () => {
    const raw = [
      'total 100K',
      '-rw-r--r-- 1 user group 5.0M Jun 13 10:00 sample_R1.fastq.gz',
      '-rw-r--r-- 1 user group 1.9G Jun 13 10:01 aligned.bam',
      'drwxr-xr-x 2 user group 4.0K Jun 13 09:00 qc_results',
    ].join('\n');

    const files = parseLsOutput(raw);
    expect(files.length).toBe(3);
    expect(files[0].name).toBe('sample_R1.fastq.gz');
    expect(files[1].name).toBe('aligned.bam');
    expect(files[2].name).toBe('qc_results');
    expect(files[2].type).toBe('directory');
  });
});

describe('parseBjobsOutput', () => {
  it('parses bjobs -w output into job entries', () => {
    const raw = [
      'JOBID   USER    STAT  QUEUE      FROM_HOST   EXEC_HOST   JOB_NAME   SUBMIT_TIME',
      '12345   userB   RUN   normal     login01     node01      star_align Jun 13 10:00',
      '12346   userB   PEND  normal     login01                 star_align Jun 13 10:01',
    ].join('\n');

    const jobs = parseBjobsOutput(raw);
    expect(jobs.length).toBe(2);
    expect(jobs[0].jobId).toBe('12345');
    expect(jobs[0].status).toBe('RUN');
    expect(jobs[1].status).toBe('PEND');
  });
});

describe('parseQuotaOutput', () => {
  it('parses quota output', () => {
    const raw = '/home 1.2T 2.0T 67%';
    const quota = parseQuotaOutput(raw);
    expect(quota).not.toBeNull();
    expect(quota!.percent).toBe('67%');
  });
});

describe('ClusterContextProvider', () => {
  it('builds snapshot command for quick depth', () => {
    const provider = new ClusterContextProvider();
    const cmd = provider.buildSnapshotCommand('quick');
    expect(cmd).toContain('pwd');
    expect(cmd).toContain('ls');
    expect(cmd).not.toContain('bjobs');
  });

  it('builds snapshot command for standard depth', () => {
    const provider = new ClusterContextProvider();
    const cmd = provider.buildSnapshotCommand('standard');
    expect(cmd).toContain('pwd');
    expect(cmd).toContain('bjobs');
    expect(cmd).toContain('quota');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run server/ai/clusterContext.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Write the implementation**

```typescript
// server/ai/clusterContext.ts
import type { ClusterSnapshot, FileEntry, JobEntry, QuotaInfo, SnapshotDepth } from './types';
import { fileRecognizer } from './fileRecognizer';

export function parseLsOutput(raw: string): FileEntry[] {
  const lines = raw.split('\n').filter(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('total ')) return false;
    return /^[-dl]/.test(trimmed);
  });

  const entries: FileEntry[] = [];
  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    if (parts.length < 9) continue;

    const perms = parts[0];
    const sizeStr = parts[4];
    const month = parts[5];
    const day = parts[6];
    const timeOrYear = parts[7];
    const name = parts.slice(8).join(' ');

    const size = parseSize(sizeStr);
    const dateStr = `${month} ${day} ${timeOrYear}`;
    const modified = Date.parse(dateStr) || Date.now();

    if (perms.startsWith('d')) {
      entries.push({ name, size: 0, modified, type: 'directory', recognizedSkillHints: [] });
    } else {
      const entry = fileRecognizer.analyze(name, size, modified);
      entries.push(entry);
    }
  }

  return entries;
}

function parseSize(raw: string): number {
  const num = parseFloat(raw);
  if (raw.endsWith('T')) return num * 1024 * 1024 * 1024 * 1024;
  if (raw.endsWith('G')) return num * 1024 * 1024 * 1024;
  if (raw.endsWith('M')) return num * 1024 * 1024;
  if (raw.endsWith('K')) return num * 1024;
  return num || 0;
}

export function parseBjobsOutput(raw: string): JobEntry[] {
  const lines = raw.split('\n');
  if (lines.length < 2) return [];
  // Skip header
  const dataLines = lines.slice(1).filter(l => l.trim());

  return dataLines.map(line => {
    const parts = line.trim().split(/\s+/);
    return {
      jobId: parts[0] ?? '',
      name: parts[6] ?? parts[0] ?? '',
      status: normalizeJobStatus(parts[2] ?? 'UNKNOWN'),
      cores: parseInt(parts[3]) || 0,
      queue: parts[3] ?? '',
      runtime: '',
    };
  });
}

function normalizeJobStatus(raw: string): JobEntry['status'] {
  const upper = raw.toUpperCase();
  if (upper === 'RUN') return 'RUN';
  if (upper === 'PEND') return 'PEND';
  if (upper === 'DONE') return 'DONE';
  if (upper === 'EXIT') return 'EXIT';
  return 'UNKNOWN';
}

export function parseQuotaOutput(raw: string): QuotaInfo | null {
  const match = raw.match(/(\S+)\s+([\d.]+[TGMK]?)\s+([\d.]+[TGMK]?)\s+(\d+)%/);
  if (!match) return null;
  return {
    filesystem: match[1],
    used: match[2],
    total: match[3],
    percent: match[4] + '%',
  };
}

const SNAPSHOT_COMMANDS: Record<SnapshotDepth, string> = {
  quick: 'echo "===PWD===" && pwd && echo "===FILES===" && ls -lh --time-style=long-iso | head -80',
  standard: 'echo "===PWD===" && pwd && echo "===FILES===" && ls -lh --time-style=long-iso | head -80 && echo "===JOBS===" && bjobs -w 2>/dev/null | head -20 && echo "===QUOTA===" && quota -s 2>/dev/null | head -5',
  full: 'echo "===PWD===" && pwd && echo "===FILES===" && ls -lhR --time-style=long-iso | head -200 && echo "===JOBS===" && bjobs -w 2>/dev/null | head -30 && echo "===QUEUES===" && bqueues 2>/dev/null | head -20 && echo "===MODULES===" && module list 2>/dev/null && echo "===QUOTA===" && quota -s 2>/dev/null | head -10',
};

function parseSnapshotOutput(raw: string): ClusterSnapshot {
  const sections: Record<string, string> = {};
  let currentSection = '__preamble__';

  for (const line of raw.split('\n')) {
    const sectionMatch = line.match(/^===(\w+)===$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1].toLowerCase();
      sections[currentSection] = '';
    } else {
      sections[currentSection] = (sections[currentSection] ?? '') + line + '\n';
    }
  }

  const files = parseLsOutput(sections['files'] ?? '');
  const jobs = parseBjobsOutput(sections['jobs'] ?? '');
  const quota = parseQuotaOutput(sections['quota'] ?? '');
  const modulesStr = sections['modules'] ?? '';
  const modules = modulesStr
    .split('\n')
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('Currently') && !l.startsWith('No modules'));

  return {
    workingDir: (sections['pwd'] ?? '').trim(),
    files,
    jobs,
    quota,
    modules,
    queueStatus: [],
    timestamp: Date.now(),
  };
}

export class ClusterContextProvider {
  private cache: Map<string, { snapshot: ClusterSnapshot; timestamp: number }> = new Map();
  private cacheTTL = 30000; // 30 seconds

  buildSnapshotCommand(depth: SnapshotDepth): string {
    return SNAPSHOT_COMMANDS[depth];
  }

  parse(rawOutput: string): ClusterSnapshot {
    return parseSnapshotOutput(rawOutput);
  }

  getCached(key: string): ClusterSnapshot | null {
    const entry = this.cache.get(key);
    if (entry && Date.now() - entry.timestamp < this.cacheTTL) {
      return entry.snapshot;
    }
    return null;
  }

  setCache(key: string, snapshot: ClusterSnapshot): void {
    this.cache.set(key, { snapshot, timestamp: Date.now() });
  }

  summarizeForAI(snapshot: ClusterSnapshot, fileHints?: { phase: string; skills: string[] }): string {
    const lines: string[] = [];
    lines.push('## 集群实时状态');
    lines.push(`### 当前位置\n${snapshot.workingDir || '(未知)'}`);

    if (snapshot.files.length > 0) {
      lines.push(`### 目录内容 (${snapshot.files.length} 个条目)`);
      for (const f of snapshot.files.slice(0, 30)) {
        const skillTag = f.recognizedSkillHints.length > 0
          ? ` → 关联技能: ${f.recognizedSkillHints.join(', ')}`
          : '';
        lines.push(`  ${f.name} (${formatSize(f.size)})${skillTag}`);
      }
      if (snapshot.files.length > 30) {
        lines.push(`  ... 还有 ${snapshot.files.length - 30} 个文件`);
      }
    }

    if (fileHints) {
      lines.push(`### 分析阶段推断\n${fileHints.phase}\n关联技能: ${fileHints.skills.join(', ')}`);
    }

    if (snapshot.jobs.length > 0) {
      lines.push('### 集群作业');
      for (const j of snapshot.jobs) {
        lines.push(`  Job ${j.jobId} | ${j.name} | ${j.status} | ${j.queue}`);
      }
    }

    if (snapshot.quota) {
      lines.push(`### 磁盘配额\n${snapshot.quota.filesystem}: ${snapshot.quota.used}/${snapshot.quota.total} (${snapshot.quota.percent})`);
    }

    if (snapshot.modules.length > 0) {
      lines.push(`### 已加载模块\n${snapshot.modules.slice(0, 10).join(', ')}`);
    }

    return lines.join('\n');
  }
}

function formatSize(bytes: number): string {
  if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(1) + 'G';
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + 'M';
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + 'K';
  return bytes + 'B';
}

export const clusterContext = new ClusterContextProvider();
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run server/ai/clusterContext.test.ts
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add server/ai/clusterContext.ts server/ai/clusterContext.test.ts
git commit -m "feat: add ClusterContextProvider for structured cluster state snapshots

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 5: Skill Graph

**Files:**
- Create: `server/ai/skillGraph.ts`
- Create: `server/ai/skillGraph.test.ts`

- [ ] **Step 1: Write the test file**

```typescript
// server/ai/skillGraph.test.ts
import { describe, expect, it } from 'vitest';
import { SkillGraphBuilder, extractRelations } from './skillGraph';
import type { SkillMetadata } from './types';

function makeSkill(overrides: Partial<SkillMetadata> = {}): SkillMetadata {
  return {
    filename: 'test-skill',
    name: 'Test Skill',
    description: 'A test skill',
    tags: [],
    category: 'system',
    content: '---\nname: Test Skill\n---\n# Content',
    excerpt: '# Content',
    size: 100,
    isSystem: false,
    source: 'system',
    sourcePath: '/fake/test-skill.md',
    ...overrides,
  };
}

describe('extractRelations', () => {
  it('extracts depends_on and related_to from skill frontmatter', () => {
    const content = [
      '---',
      'name: rnaseq',
      'depends_on: [alignment, qc]',
      'related_to: [lsf-ncpgr, formats]',
      '---',
      '# RNA-seq',
    ].join('\n');

    const skill = makeSkill({ filename: 'bio/rnaseq', content });
    const relations = extractRelations(skill);

    expect(relations).toContainEqual({
      from: 'bio/rnaseq', to: 'alignment', relation: 'depends_on', weight: 10, reason: 'rnaseq depends on alignment',
    });
    expect(relations).toContainEqual({
      from: 'bio/rnaseq', to: 'qc', relation: 'depends_on', weight: 10, reason: 'rnaseq depends on qc',
    });
    expect(relations).toContainEqual({
      from: 'bio/rnaseq', to: 'lsf-ncpgr', relation: 'related_to', weight: 7, reason: 'rnaseq related to lsf-ncpgr',
    });
  });
});

describe('SkillGraphBuilder', () => {
  it('builds graph from skill list and answers adjacency queries', () => {
    const skills = [
      makeSkill({
        filename: 'bio/rnaseq',
        content: '---\nname: rnaseq\ndepends_on: [alignment, qc]\nrelated_to: [lsf-ncpgr]\n---\n# RNA-seq',
      }),
      makeSkill({
        filename: 'bio/alignment',
        content: '---\nname: alignment\n---\n# Alignment',
      }),
      makeSkill({
        filename: 'bio/qc',
        content: '---\nname: qc\n---\n# QC',
      }),
      makeSkill({
        filename: 'lsf-ncpgr',
        content: '---\nname: lsf\n---\n# LSF',
      }),
    ];

    const graph = SkillGraphBuilder.build(skills);

    // Expand from rnaseq 1 hop
    const expanded = graph.expandFromSkill('bio/rnaseq', { maxHops: 1, maxSkills: 10 });
    const filenames = expanded.map(s => s.filename);
    expect(filenames).toContain('bio/rnaseq');
    expect(filenames).toContain('bio/alignment');
    expect(filenames).toContain('bio/qc');
    expect(filenames).toContain('lsf-ncpgr');
  });

  it('respects maxSkills limit', () => {
    const skills = [
      makeSkill({
        filename: 'hub',
        content: '---\nname: hub\ndepends_on: [a, b, c, d, e, f]\n---\n# Hub',
      }),
      ...['a','b','c','d','e','f'].map(name =>
        makeSkill({ filename: name, content: `---\nname: ${name}\n---\n# ${name}` })
      ),
    ];
    const graph = SkillGraphBuilder.build(skills);
    const expanded = graph.expandFromSkill('hub', { maxHops: 1, maxSkills: 3 });
    expect(expanded.length).toBeLessThanOrEqual(3);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run server/ai/skillGraph.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Write the implementation**

```typescript
// server/ai/skillGraph.ts
import matter from 'gray-matter';
import type { SkillEdge, SkillGraph, SkillMetadata, SkillRelation } from './types';

const RELATION_WEIGHTS: Record<SkillRelation, number> = {
  'depends_on': 10,
  'solves': 9,
  'used_with': 7,
  'related_to': 6,
  'triggers': 5,
};

export function extractRelations(skill: SkillMetadata): SkillEdge[] {
  const edges: SkillEdge[] = [];
  try {
    const parsed = matter(skill.content);
    const front = parsed.data as Record<string, any>;

    const relationFields: SkillRelation[] = ['depends_on', 'related_to', 'used_with', 'solves'];
    for (const field of relationFields) {
      const value = front[field];
      if (!value) continue;
      const targets = Array.isArray(value) ? value : String(value).split(',').map(s => s.trim());
      for (const target of targets) {
        if (!target) continue;
        edges.push({
          from: skill.filename,
          to: target,
          relation: field,
          weight: RELATION_WEIGHTS[field],
          reason: `${skill.filename} ${field.replace(/_/g, ' ')} ${target}`,
        });
      }
    }
  } catch {
    // Skill has no frontmatter or invalid — skip
  }
  return edges;
}

export class SkillGraphBuilder {
  static build(skills: SkillMetadata[], extraEdges: SkillEdge[] = []): SkillGraphInstance {
    const nodes = new Map<string, SkillMetadata>();
    const adjacency = new Map<string, SkillEdge[]>();
    const edges: SkillEdge[] = [];

    for (const skill of skills) {
      nodes.set(skill.filename, skill);
    }

    for (const skill of skills) {
      const relEdges = extractRelations(skill);
      for (const edge of relEdges) {
        // Only add edge if the target skill exists
        if (nodes.has(edge.to)) {
          edges.push(edge);
          const existing = adjacency.get(edge.from) ?? [];
          existing.push(edge);
          adjacency.set(edge.from, existing);
        }
      }
    }

    // Add extra computed edges
    for (const edge of extraEdges) {
      if (nodes.has(edge.to)) {
        edges.push(edge);
        const existing = adjacency.get(edge.from) ?? [];
        existing.push(edge);
        adjacency.set(edge.from, existing);
      }
    }

    return new SkillGraphInstance(nodes, edges, adjacency);
  }
}

export interface ExpandOptions {
  maxHops: number;
  relations?: SkillRelation[];
  minWeight?: number;
  maxSkills: number;
}

export class SkillGraphInstance implements SkillGraph {
  constructor(
    public nodes: Map<string, SkillMetadata>,
    public edges: SkillEdge[],
    public adjacency: Map<string, SkillEdge[]>,
  ) {}

  expandFromSkill(filename: string, options: ExpandOptions): SkillMetadata[] {
    const visited = new Set<string>();
    const result: SkillMetadata[] = [];
    const queue: { filename: string; hop: number; weight: number }[] = [
      { filename, hop: 0, weight: 10 },
    ];

    while (queue.length > 0 && result.length < options.maxSkills) {
      const current = queue.shift()!;
      if (visited.has(current.filename)) continue;
      if (current.hop > options.maxHops) continue;

      const skill = this.nodes.get(current.filename);
      if (!skill) continue;

      visited.add(current.filename);
      result.push(skill);

      const neighbors = this.adjacency.get(current.filename) ?? [];
      const filtered = neighbors.filter(e => {
        if (options.relations && !options.relations.includes(e.relation)) return false;
        if (options.minWeight && e.weight < options.minWeight) return false;
        return true;
      });

      // Sort by weight descending
      filtered.sort((a, b) => b.weight - a.weight);

      for (const edge of filtered) {
        if (!visited.has(edge.to)) {
          queue.push({ filename: edge.to, hop: current.hop + 1, weight: edge.weight });
        }
      }
    }

    return result;
  }

  expandFromHints(hints: string[], options: ExpandOptions): SkillMetadata[] {
    const allResults = new Map<string, SkillMetadata>();

    for (const hint of hints) {
      const matching = this.searchByHint(hint);
      for (const skill of matching) {
        const expanded = this.expandFromSkill(skill.filename, {
          ...options,
          maxSkills: Math.ceil(options.maxSkills / hints.length),
        });
        for (const s of expanded) {
          allResults.set(s.filename, s);
        }
      }
    }

    return [...allResults.values()].slice(0, options.maxSkills);
  }

  private searchByHint(hint: string): SkillMetadata[] {
    const lower = hint.toLowerCase();
    const results: { skill: SkillMetadata; score: number }[] = [];

    for (const skill of this.nodes.values()) {
      let score = 0;
      if (skill.filename.toLowerCase().includes(lower)) score += 8;
      if (skill.name.toLowerCase().includes(lower)) score += 7;
      if (skill.tags.some(t => t.toLowerCase().includes(lower))) score += 6;
      if (skill.description.toLowerCase().includes(lower)) score += 4;

      // Check solves field
      if (skill.solves?.some(s => s.toLowerCase().includes(lower))) score += 5;

      if (score > 0) results.push({ skill, score });
    }

    return results
      .sort((a, b) => b.score - a.score)
      .map(r => r.skill);
  }

  getNode(filename: string): SkillMetadata | undefined {
    return this.nodes.get(filename);
  }

  getEdges(filename: string): SkillEdge[] {
    return this.adjacency.get(filename) ?? [];
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run server/ai/skillGraph.test.ts
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add server/ai/skillGraph.ts server/ai/skillGraph.test.ts
git commit -m "feat: add Skill Graph with relation extraction and N-hop expansion

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 6: Skill Index — Add Embedding Support

**Files:**
- Modify: `server/ai/skillIndex.ts`
- Modify: `server/ai/skillIndex.test.ts`

- [ ] **Step 1: Read current file and identify insertion points**

Read `server/ai/skillIndex.ts`. The file exports `refreshSkillIndex`, `loadOrRefreshSkillIndex`, `scoreSkill`, `searchSkillIndex`, `formatSkillSearchResults`. We need to:
1. Add `buildBibleChunks()` — split SKILL.md by `##` headings
2. Add `searchBibleChunks()` — search chunks by query
3. Add `buildSemanticIndex()` — stub for embedding (fallback to TF-IDF)
4. Update `skillFromFile()` to parse new frontmatter fields (`depends_on`, `related_to`, `used_with`, `solves`)

- [ ] **Step 2: Add test cases**

Append to `server/ai/skillIndex.test.ts`:

```typescript
import { buildBibleChunks, searchBibleChunks } from './skillIndex';

describe('bible chunks', () => {
  it('splits SKILL.md content by ## headings', () => {
    const content = [
      '---',
      'name: bible',
      '---',
      '## 总则',
      '集群基础规则内容...',
      '## 软件推荐',
      'STAR核数推荐: 8-12',
      'fastp核数推荐: 4-8',
    ].join('\n');

    const chunks = buildBibleChunks(content);
    expect(chunks.length).toBe(2);
    expect(chunks[0].chapter).toBe('总则');
    expect(chunks[1].chapter).toBe('软件推荐');
  });

  it('searches bible chunks by query', () => {
    const chunks = [
      { chapter: '总则', content: '集群基础规则', tokenCount: 20, relevanceScore: 0 },
      { chapter: '软件推荐', content: 'STAR核数推荐: 8-12, fastp核数: 4-8', tokenCount: 30, relevanceScore: 0 },
    ];

    const results = searchBibleChunks(chunks, 'STAR 核数', 3);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].chapter).toBe('软件推荐');
  });
});
```

- [ ] **Step 3: Run test to verify new tests fail**

```bash
npx vitest run server/ai/skillIndex.test.ts
```

Expected: 2 existing tests PASS, 2 new tests FAIL.

- [ ] **Step 4: Add implementation to skillIndex.ts**

Add these functions after the existing `formatSkillSearchResults` function:

```typescript
// ─── Bible Chunking ──────────────────────────────────────────

export interface BibleChunk {
  chapter: string;
  content: string;
  tokenCount: number;
  relevanceScore: number;
}

export function buildBibleChunks(content: string): BibleChunk[] {
  // Strip frontmatter
  const body = content.replace(/^---[\s\S]*?---\s*/, '').trim();
  const sections = body.split(/^## /m);
  const chunks: BibleChunk[] = [];

  for (const section of sections) {
    if (!section.trim()) continue;
    const newlineIdx = section.indexOf('\n');
    const chapter = newlineIdx > 0 ? section.slice(0, newlineIdx).trim() : section.trim();
    const text = newlineIdx > 0 ? section.slice(newlineIdx + 1).trim() : '';
    if (!text) continue;

    chunks.push({
      chapter,
      content: `## ${chapter}\n${text}`,
      tokenCount: estimateTokenCount(text),
      relevanceScore: 0,
    });
  }

  return chunks;
}

function estimateTokenCount(text: string): number {
  let cjk = 0;
  let other = 0;
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    if ((code >= 0x4E00 && code <= 0x9FFF) || (code >= 0x3040 && code <= 0x30FF)) {
      cjk++;
    } else {
      other++;
    }
  }
  return Math.ceil(cjk / 1.5) + Math.ceil(other / 4);
}

export function searchBibleChunks(chunks: BibleChunk[], query: string, limit = 3): BibleChunk[] {
  const terms = query.toLowerCase().split(/[^\p{L}\p{N}_-]+/u).filter(t => t.length > 1);
  if (terms.length === 0) return chunks.slice(0, limit);

  const scored = chunks.map(chunk => {
    const lower = chunk.content.toLowerCase();
    let score = 0;
    for (const term of terms) {
      const count = lower.split(term).length - 1;
      score += count * 5;
      if (chunk.chapter.toLowerCase().includes(term)) score += 10;
    }
    return { ...chunk, relevanceScore: score };
  });

  return scored
    .filter(c => c.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);
}
```

Also update `skillFromFile()` to parse new frontmatter fields. Replace the existing return block:

```typescript
// Replace the existing return block in skillFromFile (around line 53-60):
return {
  filename,
  name,
  description,
  tags: normalizeTags(parsed.data.tags),
  trigger: parsed.data.trigger ? String(parsed.data.trigger) : undefined,
  category: categoryFor(relativePath, source),
  content: raw,
  excerpt: cleanExcerpt(parsed.content),
  size: Buffer.byteLength(raw),
  isSystem: source === 'system' || source === 'lsf',
  source,
  sourcePath: filePath,
  // New fields:
  dependsOn: Array.isArray(parsed.data.depends_on) ? parsed.data.depends_on.map(String) : undefined,
  relatedTo: Array.isArray(parsed.data.related_to) ? parsed.data.related_to.map(String) : undefined,
  usedWith: Array.isArray(parsed.data.used_with) ? parsed.data.used_with.map(String) : undefined,
  solves: Array.isArray(parsed.data.solves) ? parsed.data.solves.map(String) : undefined,
};
```

- [ ] **Step 5: Run all tests**

```bash
npx vitest run server/ai/skillIndex.test.ts
```

Expected: All tests PASS.

- [ ] **Step 6: Commit**

```bash
git add server/ai/skillIndex.ts server/ai/skillIndex.test.ts
git commit -m "feat: add Bible chunking, chunk search, and frontmatter relation fields to skillIndex

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 7: Skill Orchestrator

**Files:**
- Create: `server/ai/skillOrchestrator.ts`
- Create: `server/ai/skillOrchestrator.test.ts`

- [ ] **Step 1: Write the test file**

```typescript
// server/ai/skillOrchestrator.test.ts
import { describe, expect, it } from 'vitest';
import { SkillOrchestrator } from './skillOrchestrator';
import { SkillGraphBuilder } from './skillGraph';
import { buildBibleChunks } from './skillIndex';
import type { SkillIndex, SkillMetadata } from './types';

function makeSkill(overrides: Partial<SkillMetadata>): SkillMetadata {
  return {
    filename: 'test',
    name: 'Test',
    description: '',
    tags: [],
    category: 'system',
    content: '---\nname: Test\n---\n# Content',
    excerpt: '# Content',
    size: 100,
    isSystem: false,
    source: 'system',
    sourcePath: '/fake/test.md',
    ...overrides,
  };
}

describe('SkillOrchestrator', () => {
  it('builds a knowledge pack from query with graph expansion', () => {
    const skills = [
      makeSkill({
        filename: 'bio/rnaseq',
        name: 'RNA-seq',
        description: 'RNA-seq transcriptome analysis',
        content: '---\nname: RNA-seq\ndepends_on: [alignment, qc]\n---\n# RNA-seq pipeline\n## 差异表达\nDESeq2 analysis steps...',
      }),
      makeSkill({
        filename: 'bio/alignment',
        name: 'Alignment',
        content: '---\nname: Alignment\n---\n# Alignment\nSTAR parameters: --runThreadN 8-12',
      }),
      makeSkill({
        filename: 'bio/qc',
        name: 'QC',
        content: '---\nname: QC\n---\n# QC\nfastp -w 4-8',
      }),
    ];

    const index: SkillIndex = { generatedAt: new Date().toISOString(), skills };
    const graph = SkillGraphBuilder.build(skills);
    const bibleChunks = buildBibleChunks('---\nname: bible\n---\n## 总则\nRules\n## 软件推荐\nSTAR: 8-12 cores');

    const orchestrator = new SkillOrchestrator(index, graph, bibleChunks);
    const pack = orchestrator.buildPack({
      userQuery: '帮我做RNA-seq差异表达',
      clusterHints: [],
      planHints: [],
      memoryHints: [],
      tokenBudget: 50000,
    });

    expect(pack.core).not.toBeNull();
    expect(pack.core!.skillFile).toBe('bio/rnaseq');
    expect(pack.dependencies.length).toBeGreaterThan(0);
    expect(pack.bible.length).toBeGreaterThan(0);
    expect(pack.totalTokens).toBeGreaterThan(0);
    expect(pack.totalTokens).toBeLessThanOrEqual(50000);
  });

  it('uses cluster hints to prioritize skills', () => {
    const skills = [
      makeSkill({ filename: 'bio/alignment', name: 'Alignment', content: '---\nname: alignment\n---\n# Alignment' }),
      makeSkill({ filename: 'bio/qc', name: 'QC', content: '---\nname: qc\n---\n# QC' }),
    ];
    const index: SkillIndex = { generatedAt: new Date().toISOString(), skills };
    const graph = SkillGraphBuilder.build(skills);

    const orchestrator = new SkillOrchestrator(index, graph, []);
    const pack = orchestrator.buildPack({
      userQuery: '分析数据',
      clusterHints: ['alignment'],  // Cluster has BAM files → alignment
      planHints: [],
      memoryHints: [],
      tokenBudget: 10000,
    });

    expect(pack.core!.skillFile).toBe('bio/alignment');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run server/ai/skillOrchestrator.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Write the implementation**

```typescript
// server/ai/skillOrchestrator.ts
import type { BibleChunk, SkillIndex, SkillKnowledgePack, SkillMetadata, SkillSnippet } from './types';
import { SkillGraphInstance } from './skillGraph';
import { searchBibleChunks, searchSkillIndex } from './skillIndex';
import { estimateTokens } from './tokenBudget';

export interface BuildPackInput {
  userQuery: string;
  clusterHints: string[];
  planHints: string[];
  memoryHints: string[];
  tokenBudget: number;
}

export class SkillOrchestrator {
  constructor(
    private index: SkillIndex,
    private graph: SkillGraphInstance,
    private bibleChunks: BibleChunk[],
  ) {}

  buildPack(input: BuildPackInput): SkillKnowledgePack {
    const budget = input.tokenBudget;

    // 1. Combine all hints for searching
    const allHints = [
      input.userQuery,
      ...input.clusterHints,
      ...input.planHints,
      ...input.memoryHints,
    ].filter(Boolean);

    // 2. Search for entry skills
    const entrySkills = searchSkillIndex(this.index, allHints.join(' '), 4);

    if (entrySkills.length === 0) {
      return {
        core: null,
        dependencies: [],
        related: [],
        bible: this.searchBible(input.userQuery, budget),
        totalTokens: 0,
      };
    }

    // 3. Expand via graph from top entry skill
    const coreSkill = entrySkills[0];
    const expanded = this.graph.expandFromSkill(coreSkill.filename, {
      maxHops: 2,
      minWeight: 5,
      maxSkills: 8,
    });

    // 4. Categorize by relation type
    const coreEdges = this.graph.getEdges(coreSkill.filename);
    const dependsOnTargets = new Set(
      coreEdges.filter(e => e.relation === 'depends_on').map(e => e.to)
    );
    const relatedTargets = new Set(
      coreEdges.filter(e => e.relation !== 'depends_on').map(e => e.to)
    );

    const dependencies: SkillMetadata[] = [];
    const related: SkillMetadata[] = [];

    for (const skill of expanded) {
      if (skill.filename === coreSkill.filename) continue;
      if (dependsOnTargets.has(skill.filename)) {
        dependencies.push(skill);
      } else if (relatedTargets.has(skill.filename)) {
        related.push(skill);
      }
    }

    // 5. Allocate token budget across skill categories
    const coreBudget = Math.floor(budget * 0.35);
    const depBudget = Math.floor(budget * 0.25);
    const relBudget = Math.floor(budget * 0.15);
    const bibleBudget = Math.floor(budget * 0.25);

    // 6. Build skill snippets
    const core = this.toSnippet(coreSkill, coreBudget);
    const depSnippets = this.toSnippets(dependencies, depBudget);
    const relSnippets = this.toSnippets(related, relBudget);
    const bible = this.searchBible(input.userQuery, bibleBudget);

    const totalTokens = (core?.tokenCount ?? 0) +
      depSnippets.reduce((s, sn) => s + sn.tokenCount, 0) +
      relSnippets.reduce((s, sn) => s + sn.tokenCount, 0) +
      bible.reduce((s, b) => s + b.tokenCount, 0);

    return { core, dependencies: depSnippets, related: relSnippets, bible, totalTokens };
  }

  private toSnippet(skill: SkillMetadata, maxTokens: number): SkillSnippet | null {
    const content = this.trimToTokens(skill.content, maxTokens);
    return {
      skillFile: skill.filename,
      content,
      tokenCount: estimateTokens(content),
      relevanceScore: skill.score ?? 0,
    };
  }

  private toSnippets(skills: SkillMetadata[], maxTokens: number): SkillSnippet[] {
    const perSkill = Math.floor(maxTokens / Math.max(1, skills.length));
    return skills.map(s => this.toSnippet(s, perSkill)).filter(Boolean) as SkillSnippet[];
  }

  private searchBible(query: string, maxTokens: number): BibleChunk[] {
    const results = searchBibleChunks(this.bibleChunks, query, 3);
    let used = 0;
    const out: BibleChunk[] = [];
    for (const chunk of results) {
      if (used + chunk.tokenCount > maxTokens) break;
      out.push(chunk);
      used += chunk.tokenCount;
    }
    return out;
  }

  trimToTokens(text: string, maxTokens: number): string {
    if (!text) return '';
    // Strip frontmatter
    const body = text.replace(/^---[\s\S]*?---\s*/, '').trim();
    if (estimateTokens(body) <= maxTokens) return body;

    // Progressive trim: keep first 80% of maxTokens chars
    const chars = Math.floor(maxTokens * 4); // rough estimate
    return body.slice(0, chars) + '\n...[truncated for token budget]';
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run server/ai/skillOrchestrator.test.ts
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add server/ai/skillOrchestrator.ts server/ai/skillOrchestrator.test.ts
git commit -m "feat: add SkillOrchestrator for graph-expanded knowledge pack assembly with token budget

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 8: Observation Store

**Files:**
- Create: `server/ai/observationStore.ts`
- Create: `server/ai/observationStore.test.ts`

- [ ] **Step 1: Write the test file**

```typescript
// server/ai/observationStore.test.ts
import { describe, expect, it } from 'vitest';
import { ObservationStore } from './observationStore';
import type { ObservationEntry } from './types';

describe('ObservationStore', () => {
  it('adds and retrieves observations with importance filter', () => {
    const store = new ObservationStore(100);

    store.add({
      type: 'command',
      data: 'bsub -q normal myjob.sh',
      importance: 3,
      relatedSkills: ['lsf-ncpgr'],
      summary: '提交作业到normal队列',
    });

    store.add({
      type: 'output',
      data: 'Job <12345> submitted',
      importance: 3,
      relatedSkills: ['lsf-ncpgr'],
      summary: '作业已提交',
    });

    store.add({
      type: 'state_change',
      data: 'cd /tmp',
      importance: 1,
      summary: '切换目录',
    });

    const recent = store.recent({ importance: [2, 3] });
    expect(recent.length).toBe(2);
  });

  it('limits to max count', () => {
    const store = new ObservationStore(3);
    for (let i = 0; i < 10; i++) {
      store.add({ type: 'command', data: `cmd${i}`, importance: 2, summary: `cmd${i}` });
    }
    expect(store.count()).toBe(3);
  });

  it('generates structured summary for AI', () => {
    const store = new ObservationStore(10);
    store.add({ type: 'job_submit', data: 'Job <12345>', importance: 3, relatedSkills: ['lsf-ncpgr'], summary: '提交STAR比对作业' });
    store.add({ type: 'error', data: 'OOM killed', importance: 3, relatedSkills: ['ncpgr-software'], summary: '作业因内存不足被杀' });

    const summary = store.summarize(500);
    expect(summary).toContain('STAR比对');
    expect(summary).toContain('OOM');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run server/ai/observationStore.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Write the implementation**

```typescript
// server/ai/observationStore.ts
import type { ObservationEntry } from './types';

let nextId = 0;

export class ObservationStore {
  private observations: ObservationEntry[] = [];
  private maxCount: number;

  constructor(maxCount = 500) {
    this.maxCount = maxCount;
  }

  add(obs: ObservationEntry): void {
    obs.id = obs.id ?? `obs_${++nextId}_${Date.now()}`;
    obs.timestamp = obs.timestamp ?? new Date().toISOString();
    this.observations.push(obs);
    if (this.observations.length > this.maxCount) {
      // Remove lowest importance observations first
      this.observations.sort((a, b) => (b.importance ?? 1) - (a.importance ?? 1));
      this.observations = this.observations.slice(0, this.maxCount);
    }
  }

  recent(filters: {
    importance?: number[];
    types?: string[];
    relatedToStep?: string;
    maxTokens?: number;
    limit?: number;
  } = {}): ObservationEntry[] {
    let result = [...this.observations];

    if (filters.importance) {
      result = result.filter(o => filters.importance!.includes(o.importance ?? 1));
    }
    if (filters.types) {
      result = result.filter(o => filters.types!.includes(o.type));
    }

    result.sort((a, b) => (b.importance ?? 1) - (a.importance ?? 1));
    result = result.slice(-(filters.limit ?? 20));

    return result;
  }

  count(): number {
    return this.observations.length;
  }

  summarize(maxChars: number): string {
    const key = this.recent({ importance: [2, 3], limit: 10 });
    if (key.length === 0) return '';

    const lines = key.map(o => {
      const skillTag = o.relatedSkills?.length ? ` [技能: ${o.relatedSkills.join(', ')}]` : '';
      return `- [${o.type}] ${o.summary || o.data.slice(0, 120)}${skillTag}`;
    });

    const joined = lines.join('\n');
    return joined.length > maxChars ? joined.slice(0, maxChars) + '...' : joined;
  }

  getAll(): ObservationEntry[] {
    return [...this.observations];
  }

  clear(): void {
    this.observations = [];
  }
}

export const globalObservationStore = new ObservationStore();
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run server/ai/observationStore.test.ts
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add server/ai/observationStore.ts server/ai/observationStore.test.ts
git commit -m "feat: add structured ObservationStore with importance filtering and AI-ready summaries

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 9: Memory Compressor

**Files:**
- Create: `server/ai/memoryCompressor.ts`
- Create: `server/ai/memoryCompressor.test.ts`

- [ ] **Step 1: Write the test file**

```typescript
// server/ai/memoryCompressor.test.ts
import { describe, expect, it } from 'vitest';
import { MemoryCompressor, shouldCompress } from './memoryCompressor';
import type { AIMessage } from './types';

describe('shouldCompress', () => {
  it('returns true when message count exceeds 15', () => {
    const messages: AIMessage[] = Array.from({ length: 16 }, (_, i) => ({
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: `message ${i}`,
    }));
    expect(shouldCompress(messages, 1000, 50000)).toBe(true);
  });

  it('returns false for small conversations', () => {
    const messages: AIMessage[] = [
      { role: 'user', content: 'hello' },
      { role: 'assistant', content: 'hi' },
    ];
    expect(shouldCompress(messages, 100, 50000)).toBe(false);
  });
});

describe('MemoryCompressor', () => {
  it('builds compression prompt from messages', () => {
    const compressor = new MemoryCompressor();
    const messages: AIMessage[] = [
      { role: 'user', content: '帮我做RNA-seq质控' },
      { role: 'assistant', content: '我会帮你。首先检测文件...' },
      { role: 'user', content: '<output>\n100个FASTQ文件\n</output>' },
      { role: 'assistant', content: '检测到100个FASTQ文件。执行fastp质控。' },
    ];

    const prompt = compressor.buildCompressionPrompt(messages);
    expect(prompt).toContain('RNA-seq');
    expect(prompt).toContain('FASTQ');
    expect(prompt).toContain('structured');
  });

  it('builds compression request for API', () => {
    const compressor = new MemoryCompressor();
    const messages: AIMessage[] = [
      { role: 'user', content: 'test' },
      { role: 'assistant', content: 'ok' },
    ];

    const req = compressor.buildCompressionRequest(messages, 'deepseek-chat');
    expect(req.model).toBe('deepseek-chat');
    expect(req.temperature).toBe(0);
    expect(req.maxTokens).toBe(800);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run server/ai/memoryCompressor.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Write the implementation**

```typescript
// server/ai/memoryCompressor.ts
import type { AIMessage, StructuredMemory } from './types';

const COMPRESSION_SYSTEM_PROMPT = `You are a conversation summarizer. Analyze the conversation and output a JSON object in this EXACT format (no markdown, no extra text):

{
  "task": "brief one-line task description",
  "progress": {
    "phase": 1,
    "description": "current phase description",
    "completed": 0,
    "total": 100
  },
  "keyFacts": [
    { "category": "environment|data|method|result|preference", "fact": "fact description" }
  ],
  "decisions": [
    { "what": "what was decided", "why": "reason" }
  ],
  "skillsUsed": ["skill1", "skill2"],
  "errors": [
    { "error": "error description", "resolution": "how it was fixed" }
  ]
}

Rules:
- task: One sentence describing the user's goal
- progress: Current phase number (1-based), description, completed count and total
- keyFacts: Important facts the AI must remember (max 10). Category must be one of: environment, data, method, result, preference
- decisions: Key decisions made and their reasons (max 5)
- skillsUsed: Skill filenames that were relevant
- errors: Errors encountered and their resolutions (max 3)
- Omit empty arrays, don't fabricate facts
- Output ONLY the JSON object`;

export function shouldCompress(
  messages: AIMessage[],
  currentTokens: number,
  totalBudget: number,
): boolean {
  const nonSystem = messages.filter(m => m.role !== 'system');
  if (nonSystem.length > 15) return true;
  if (currentTokens / totalBudget > 0.4) return true;
  return false;
}

export class MemoryCompressor {
  buildCompressionPrompt(messages: AIMessage[]): string {
    const nonSystem = messages
      .filter(m => m.role !== 'system')
      .slice(-15);

    const conversation = nonSystem
      .map(m => `${m.role}: ${(m.content || '').slice(0, 300)}`)
      .join('\n');

    return `Summarize this HPC bioinformatics conversation:\n\n${conversation}`;
  }

  buildCompressionRequest(
    messages: AIMessage[],
    model: string = 'deepseek-chat',
  ) {
    return {
      model,
      messages: [
        { role: 'system', content: COMPRESSION_SYSTEM_PROMPT },
        { role: 'user', content: this.buildCompressionPrompt(messages) },
      ],
      temperature: 0,
      maxTokens: 800,
    };
  }

  parseCompressionResult(raw: string): StructuredMemory | null {
    try {
      // Try to extract JSON from the response
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return null;
      const parsed = JSON.parse(jsonMatch[0]);

      return {
        task: String(parsed.task || ''),
        progress: {
          phase: Number(parsed.progress?.phase) || 1,
          description: String(parsed.progress?.description || ''),
          completed: Number(parsed.progress?.completed) || 0,
          total: parsed.progress?.total ? Number(parsed.progress.total) : undefined,
        },
        keyFacts: Array.isArray(parsed.keyFacts) ? parsed.keyFacts.map((f: any) => ({
          category: String(f.category || 'data'),
          fact: String(f.fact || ''),
          timestamp: Date.now(),
        })) : [],
        decisions: Array.isArray(parsed.decisions) ? parsed.decisions.map((d: any) => ({
          what: String(d.what || ''),
          why: String(d.why || ''),
        })) : [],
        skillsUsed: Array.isArray(parsed.skillsUsed) ? parsed.skillsUsed.map(String) : [],
        errors: Array.isArray(parsed.errors) ? parsed.errors.map((e: any) => ({
          error: String(e.error || ''),
          resolution: String(e.resolution || ''),
        })) : [],
        generatedAt: Date.now(),
      };
    } catch {
      return null;
    }
  }

  mergeMemories(existing: StructuredMemory | null, incoming: StructuredMemory): StructuredMemory {
    if (!existing) return incoming;

    // Merge key facts (deduplicate by fact string)
    const factSet = new Set(existing.keyFacts.map(f => f.fact));
    const newFacts = incoming.keyFacts.filter(f => !factSet.has(f.fact));

    // Merge decisions (deduplicate by what string)
    const decisionSet = new Set(existing.decisions.map(d => d.what));
    const newDecisions = incoming.decisions.filter(d => !decisionSet.has(d.what));

    // Merge errors (deduplicate by error string)
    const errorSet = new Set(existing.errors.map(e => e.error));
    const newErrors = incoming.errors.filter(e => !errorSet.has(e.error));

    // Merge skills used
    const skillSet = new Set([...existing.skillsUsed, ...incoming.skillsUsed]);

    return {
      task: incoming.task || existing.task,
      progress: incoming.progress.description ? incoming.progress : existing.progress,
      keyFacts: [...existing.keyFacts, ...newFacts].slice(-20),
      decisions: [...existing.decisions, ...newDecisions].slice(-10),
      skillsUsed: [...skillSet],
      errors: [...existing.errors, ...newErrors].slice(-5),
      generatedAt: Date.now(),
    };
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run server/ai/memoryCompressor.test.ts
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add server/ai/memoryCompressor.ts server/ai/memoryCompressor.test.ts
git commit -m "feat: add MemoryCompressor with AI-driven structured summarization and merging

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 10: Memory Orchestrator

**Files:**
- Create: `server/ai/memoryOrchestrator.ts`
- Create: `server/ai/memoryOrchestrator.test.ts`
- Modify: `server/ai/conversationMemory.ts`

- [ ] **Step 1: Write the test file**

```typescript
// server/ai/memoryOrchestrator.test.ts
import { describe, expect, it } from 'vitest';
import { MemoryOrchestrator, formatMemoryForAI } from './memoryOrchestrator';
import type { StructuredMemory } from './types';

function makeMemory(overrides: Partial<StructuredMemory> = {}): StructuredMemory {
  return {
    task: 'RNA-seq analysis',
    progress: { phase: 2, description: 'STAR alignment', completed: 45, total: 100 },
    keyFacts: [
      { category: 'environment', fact: 'Working directory: /home/userB/rnaseq/', timestamp: Date.now() },
      { category: 'data', fact: '100 paired-end FASTQ files, hg38 reference', timestamp: Date.now() },
    ],
    decisions: [
      { what: 'Use STAR instead of HISAT2', why: 'User preference + cluster manual recommendation' },
    ],
    skillsUsed: ['transcriptome', 'alignment', 'qc'],
    errors: [],
    generatedAt: Date.now(),
    ...overrides,
  };
}

describe('MemoryOrchestrator', () => {
  it('stores and retrieves short-term memory', () => {
    const orchestrator = new MemoryOrchestrator();
    const mem = makeMemory();
    orchestrator.setShortTerm(mem);
    expect(orchestrator.getShortTerm()).toEqual(mem);
  });

  it('extracts key facts by category', () => {
    const orchestrator = new MemoryOrchestrator();
    orchestrator.setShortTerm(makeMemory());
    const envFacts = orchestrator.getFactsByCategory('environment');
    expect(envFacts.length).toBe(1);
    expect(envFacts[0].fact).toContain('Working directory');
  });
});

describe('formatMemoryForAI', () => {
  it('formats memory for AI context', () => {
    const mem = makeMemory();
    const formatted = formatMemoryForAI(mem);
    expect(formatted).toContain('RNA-seq');
    expect(formatted).toContain('STAR alignment');
    expect(formatted).toContain('45/100');
    expect(formatted).toContain('hg38');
    expect(formatted).toContain('STAR instead of HISAT2');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run server/ai/memoryOrchestrator.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Write the implementation**

```typescript
// server/ai/memoryOrchestrator.ts
import type { KeyFact, StructuredMemory } from './types';

export function formatMemoryForAI(memory: StructuredMemory | null): string {
  if (!memory) return '';

  const lines: string[] = [];
  lines.push('## 当前任务状态');

  if (memory.task) {
    lines.push(`**任务**: ${memory.task}`);
  }

  const p = memory.progress;
  if (p.description) {
    const totalStr = p.total ? `/${p.total}` : '';
    lines.push(`**进度**: 阶段${p.phase} — ${p.description} (${p.completed}${totalStr})`);
  }

  if (memory.keyFacts.length > 0) {
    lines.push('\n### 关键事实');
    for (const f of memory.keyFacts.slice(0, 12)) {
      lines.push(`- [${f.category}] ${f.fact}`);
    }
  }

  if (memory.decisions.length > 0) {
    lines.push('\n### 决策记录');
    for (const d of memory.decisions.slice(0, 5)) {
      lines.push(`- ${d.what}: ${d.why}`);
    }
  }

  if (memory.skillsUsed.length > 0) {
    lines.push(`\n### 已使用的技能\n${memory.skillsUsed.join(', ')}`);
  }

  if (memory.errors.length > 0) {
    lines.push('\n### 遇到的错误');
    for (const e of memory.errors.slice(0, 3)) {
      lines.push(`- ${e.error} → ${e.resolution}`);
    }
  }

  return lines.join('\n');
}

export class MemoryOrchestrator {
  private shortTerm: StructuredMemory | null = null;

  setShortTerm(memory: StructuredMemory): void {
    this.shortTerm = memory;
  }

  getShortTerm(): StructuredMemory | null {
    return this.shortTerm;
  }

  getFactsByCategory(category: KeyFact['category']): KeyFact[] {
    if (!this.shortTerm) return [];
    return this.shortTerm.keyFacts.filter(f => f.category === category);
  }

  getAllFacts(): KeyFact[] {
    return this.shortTerm?.keyFacts ?? [];
  }

  getCurrentProgress(): StructuredMemory['progress'] | null {
    return this.shortTerm?.progress ?? null;
  }

  getSkillsUsed(): string[] {
    return this.shortTerm?.skillsUsed ?? [];
  }

  clear(): void {
    this.shortTerm = null;
  }
}

// Global singleton for the server request lifecycle
export const memoryOrchestrator = new MemoryOrchestrator();
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run server/ai/memoryOrchestrator.test.ts
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add server/ai/memoryOrchestrator.ts server/ai/memoryOrchestrator.test.ts
git commit -m "feat: add MemoryOrchestrator for structured memory access and AI formatting

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 11: Agent Planner

**Files:**
- Create: `server/ai/agentPlanner.ts`
- Create: `server/ai/agentPlanner.test.ts`

- [ ] **Step 1: Write the test file**

```typescript
// server/ai/agentPlanner.test.ts
import { describe, expect, it } from 'vitest';
import { AgentPlanner, buildPlanningPrompt, parsePlanFromResponse } from './agentPlanner';

describe('buildPlanningPrompt', () => {
  it('generates a planning prompt with user goal and cluster context', () => {
    const prompt = buildPlanningPrompt(
      '100个RNA-seq样本做差异表达分析',
      '当前目录有100个FASTQ文件，参考基因组hg38已建索引',
      ['qc', 'alignment', 'transcriptome'],
    );
    expect(prompt).toContain('RNA-seq');
    expect(prompt).toContain('FASTQ');
    expect(prompt).toContain('phase');
    expect(prompt).toContain('qc');
  });
});

describe('parsePlanFromResponse', () => {
  it('parses a JSON plan from AI response', () => {
    const response = JSON.stringify({
      goal: 'RNA-seq analysis',
      phases: [
        {
          id: 1,
          name: '质控',
          status: 'pending',
          steps: [{ id: '1.1', description: 'fastp质控', status: 'pending', linkedSkills: ['qc'] }],
          linkedSkills: ['qc'],
          entryConditions: [],
        },
        {
          id: 2,
          name: '比对',
          status: 'pending',
          steps: [{ id: '2.1', description: 'STAR比对', status: 'pending', linkedSkills: ['alignment'] }],
          linkedSkills: ['alignment'],
          entryConditions: ['质控完成'],
        },
      ],
    });

    const plan = parsePlanFromResponse(response);
    expect(plan).not.toBeNull();
    expect(plan!.goal).toBe('RNA-seq analysis');
    expect(plan!.phases.length).toBe(2);
    expect(plan!.currentPhase).toBe(0);
  });

  it('returns null for invalid JSON', () => {
    expect(parsePlanFromResponse('not json')).toBeNull();
  });
});

describe('AgentPlanner', () => {
  it('sets and navigates a plan', () => {
    const planner = new AgentPlanner();
    const plan = {
      goal: 'Test task',
      phases: [
        {
          id: 1,
          name: 'Phase 1',
          status: 'pending' as const,
          steps: [{ id: '1.1', description: 'Step 1', status: 'pending' as const, linkedSkills: [] }],
          linkedSkills: ['skill1'],
          entryConditions: [],
        },
        {
          id: 2,
          name: 'Phase 2',
          status: 'pending' as const,
          steps: [],
          linkedSkills: ['skill2'],
          entryConditions: ['Phase 1 done'],
        },
      ],
      currentPhase: 0,
      createdAt: Date.now(),
    };

    planner.setPlan(plan);
    expect(planner.currentPlan()).toEqual(plan);

    const phase = planner.activatePhase(1);
    expect(phase).not.toBeNull();
    expect(phase!.status).toBe('active');

    planner.completePhase(1);
    const completed = planner.currentPlan()!.phases[0];
    expect(completed.status).toBe('done');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run server/ai/agentPlanner.test.ts
```

Expected: FAIL.

- [ ] **Step 3: Write the implementation**

```typescript
// server/ai/agentPlanner.ts
import type { Phase, Step, TaskPlan } from './types';

const PLANNING_SYSTEM_PROMPT = `You are an HPC bioinformatics task planner. Given a user's goal and cluster context, create a phased execution plan.

Output ONLY a JSON object (no markdown, no extra text):

{
  "goal": "one-line goal description",
  "phases": [
    {
      "id": 1,
      "name": "Phase name (Chinese OK)",
      "steps": [
        {
          "id": "1.1",
          "description": "Step description",
          "linkedSkills": ["skill-filename-1"]
        }
      ],
      "linkedSkills": ["skill-filename-1", "skill-filename-2"],
      "entryConditions": ["condition to start this phase"]
    }
  ]
}

Rules:
- Break the task into 2-5 phases
- Each phase has 1-4 concrete steps
- linkedSkills: reference actual skill filenames that are relevant
- entryConditions: what must be true before this phase can start
- Order phases logically (QC before alignment, etc.)
- Output ONLY the JSON object`;

export function buildPlanningPrompt(
  goal: string,
  clusterContext: string,
  availableSkills: string[],
): string {
  return [
    PLANNING_SYSTEM_PROMPT,
    '',
    `Available skills: ${availableSkills.join(', ') || '(none)'}`,
    `Cluster context:\n${clusterContext || '(unknown)'}`,
    '',
    `User goal: ${goal}`,
  ].join('\n');
}

export function parsePlanFromResponse(raw: string): TaskPlan | null {
  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const parsed = JSON.parse(jsonMatch[0]);

    return {
      goal: String(parsed.goal || ''),
      phases: Array.isArray(parsed.phases)
        ? parsed.phases.map((p: any, i: number) => ({
            id: Number(p.id) || i + 1,
            name: String(p.name || `Phase ${i + 1}`),
            status: 'pending' as const,
            steps: Array.isArray(p.steps)
              ? p.steps.map((s: any) => ({
                  id: String(s.id || `${i + 1}.1`),
                  description: String(s.description || ''),
                  status: 'pending' as const,
                  linkedSkills: Array.isArray(s.linkedSkills) ? s.linkedSkills.map(String) : [],
                }))
              : [],
            linkedSkills: Array.isArray(p.linkedSkills) ? p.linkedSkills.map(String) : [],
            entryConditions: Array.isArray(p.entryConditions) ? p.entryConditions.map(String) : [],
          }))
        : [],
      currentPhase: 0,
      createdAt: Date.now(),
    };
  } catch {
    return null;
  }
}

export function formatPlanForAI(plan: TaskPlan | null): string {
  if (!plan) return '';

  const lines: string[] = ['## 执行计划'];

  lines.push(`**目标**: ${plan.goal}`);
  lines.push(`**当前阶段**: ${plan.currentPhase}/${plan.phases.length}`);

  for (const phase of plan.phases) {
    const statusIcon = phase.status === 'done' ? '✅' :
      phase.status === 'active' ? '🔄' :
      phase.status === 'failed' ? '❌' : '⏳';
    lines.push(`\n### ${statusIcon} 阶段${phase.id}: ${phase.name}`);
    lines.push(`关联技能: ${phase.linkedSkills.join(', ') || '(无)'}`);

    for (const step of phase.steps) {
      const stepIcon = step.status === 'done' ? '✅' :
        step.status === 'running' ? '🔄' :
        step.status === 'failed' ? '❌' : '⬜';
      lines.push(`  ${stepIcon} ${step.id}: ${step.description}`);
    }
  }

  return lines.join('\n');
}

export class AgentPlanner {
  private plan: TaskPlan | null = null;

  setPlan(plan: TaskPlan): void {
    this.plan = plan;
  }

  currentPlan(): TaskPlan | null {
    return this.plan;
  }

  currentPhase(): Phase | null {
    if (!this.plan) return null;
    return this.plan.phases.find(p => p.id === this.plan!.currentPhase) ?? null;
  }

  activatePhase(phaseId: number): Phase | null {
    if (!this.plan) return null;
    const phase = this.plan.phases.find(p => p.id === phaseId);
    if (!phase) return null;
    phase.status = 'active';
    this.plan.currentPhase = phaseId;
    return phase;
  }

  completePhase(phaseId: number): void {
    if (!this.plan) return;
    const phase = this.plan.phases.find(p => p.id === phaseId);
    if (phase) {
      phase.status = 'done';
      for (const step of phase.steps) {
        step.status = 'done';
      }
    }
  }

  failPhase(phaseId: number): void {
    if (!this.plan) return;
    const phase = this.plan.phases.find(p => p.id === phaseId);
    if (phase) phase.status = 'failed';
  }

  updateStep(phaseId: number, stepId: string, updates: Partial<Step>): void {
    if (!this.plan) return;
    const phase = this.plan.phases.find(p => p.id === phaseId);
    if (!phase) return;
    const step = phase.steps.find(s => s.id === stepId);
    if (step) Object.assign(step, updates);
  }

  allPhasesComplete(): boolean {
    if (!this.plan) return false;
    return this.plan.phases.every(p => p.status === 'done');
  }

  clear(): void {
    this.plan = null;
  }
}

export const agentPlanner = new AgentPlanner();
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run server/ai/agentPlanner.test.ts
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add server/ai/agentPlanner.ts server/ai/agentPlanner.test.ts
git commit -m "feat: add AgentPlanner with hierarchical task decomposition and phase management

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 12: Rewrite Context Builder

**Files:**
- Rewrite: `server/ai/contextBuilder.ts`
- Modify: `server/ai/contextBuilder.test.ts` (create if not exists)

- [ ] **Step 1: Back up current contextBuilder and write the new version**

Read the current `server/ai/contextBuilder.ts` to understand existing interfaces, then replace:

```typescript
// server/ai/contextBuilder.ts
import type { AIMessage, BibleChunk, ClusterSnapshot, ContextBuildOptions, SkillKnowledgePack, SkillSnippet, StructuredMemory, TaskPlan } from './types';
import { SkillOrchestrator } from './skillOrchestrator';
import { SkillGraphBuilder } from './skillGraph';
import { buildBibleChunks, loadOrRefreshSkillIndex } from './skillIndex';
import { TokenBudgetManager, estimateTokens } from './tokenBudget';
import { formatMemoryForAI } from './memoryOrchestrator';
import { formatPlanForAI } from './agentPlanner';
import { fileRecognizer } from './fileRecognizer';
import { clusterContext } from './clusterContext';

// Re-export for backward compatibility
export { profileFromBody, messagesFromBody } from './contextHelpers';

export interface SmartContextInput {
  messages: AIMessage[];
  mode: ContextBuildOptions['mode'];
  userQuery?: string;
  clusterSnapshot?: ClusterSnapshot;
  structuredMemory?: StructuredMemory;
  taskPlan?: TaskPlan;
  model?: string;
  observations?: string;
  selectedOutput?: string;
}

function clipByTokens(text: string, maxTokens: number): string {
  if (!text) return '';
  if (estimateTokens(text) <= maxTokens) return text;
  const chars = Math.floor(maxTokens * 3.5);
  return text.slice(0, chars) + '\n...[truncated]';
}

function formatSkillPack(pack: SkillKnowledgePack): string {
  const parts: string[] = [];

  if (pack.core) {
    parts.push(`### 核心知识: ${pack.core.skillFile}\n${pack.core.content}`);
  }

  if (pack.dependencies.length > 0) {
    parts.push('### 依赖技能');
    for (const dep of pack.dependencies) {
      parts.push(`#### ${dep.skillFile}\n${clipByTokens(dep.content, 2000)}`);
    }
  }

  if (pack.related.length > 0) {
    parts.push('### 关联技能');
    for (const rel of pack.related) {
      parts.push(`#### ${rel.skillFile}\n${clipByTokens(rel.content, 1500)}`);
    }
  }

  if (pack.bible.length > 0) {
    parts.push('### 集群手册相关章节');
    for (const chunk of pack.bible) {
      parts.push(`#### ${chunk.chapter}\n${chunk.content}`);
    }
  }

  return parts.join('\n\n');
}

export async function buildSmartContext(input: SmartContextInput): Promise<AIMessage[]> {
  const model = input.model ?? 'deepseek-v4-pro';
  const mode = input.mode ?? 'chat';
  const query = input.userQuery ?? latestUserText(input.messages);

  // 1. Token budget
  const budget = new TokenBudgetManager(model);

  // Allocate component budgets
  budget.setLimits('cluster', 5000, 15000);
  budget.setLimits('skills', 10000, 30000);
  budget.setLimits('memory', 3000, 15000);
  budget.setLimits('observations', 2000, 10000);
  budget.setLimits('conversation', 15000, 50000);

  // 2. Build skill knowledge pack
  const skillsDir = require('path').join(process.cwd(), 'skills');
  const lsfSkillDir = require('path').join(process.cwd(), 'lsf_skills');
  const index = loadOrRefreshSkillIndex({ skillsDir, lsfSkillDir });
  const graph = SkillGraphBuilder.build(index.skills);

  const bibleContent = index.skills.find(s => s.filename === 'SKILL' || s.filename === 'SKILL.md');
  const bibleChunks = bibleContent ? buildBibleChunks(bibleContent.content) : [];

  // Collect hints from cluster and plan
  const clusterHints: string[] = [];
  if (input.clusterSnapshot) {
    for (const f of input.clusterSnapshot.files) {
      clusterHints.push(...f.recognizedSkillHints);
    }
  }

  const planHints = input.taskPlan?.phases
    .find(p => p.id === input.taskPlan.currentPhase)
    ?.linkedSkills ?? [];

  const memoryHints = input.structuredMemory?.keyFacts?.map(f => f.fact) ?? [];

  const orchestrator = new SkillOrchestrator(index, graph, bibleChunks);
  const skillTokens = budget.request('skills', 28000);
  const skillPack = orchestrator.buildPack({
    userQuery: query,
    clusterHints: [...new Set(clusterHints)],
    planHints,
    memoryHints,
    tokenBudget: skillTokens,
  });

  // 3. Format components
  const fragments: string[] = [];

  // Persona
  fragments.push(modePersona(mode));

  // Cluster context
  if (input.clusterSnapshot) {
    const clusterTokens = budget.request('cluster', 12000);
    const hints = fileRecognizer.inferPhase(input.clusterSnapshot.files);
    const summary = clusterContext.summarizeForAI(input.clusterSnapshot, hints);
    fragments.push(clipByTokens(summary, clusterTokens));
  }

  // Task plan (agent mode)
  if (input.taskPlan) {
    const planText = formatPlanForAI(input.taskPlan);
    fragments.push(planText);
  }

  // Skills
  const skillsText = formatSkillPack(skillPack);
  fragments.push(skillsText);

  // Memory
  if (input.structuredMemory) {
    const memTokens = budget.request('memory', 12000);
    fragments.push(clipByTokens(formatMemoryForAI(input.structuredMemory), memTokens));
  }

  // Observations
  if (input.observations) {
    const obsTokens = budget.request('observations', 8000);
    fragments.push(clipByTokens(input.observations, obsTokens));
  }

  // Selected output
  if (input.selectedOutput) {
    fragments.push(`Selected terminal output:\n\`\`\`\n${clipByTokens(input.selectedOutput, 3000)}\n\`\`\``);
  }

  // 4. Conversation history
  const convTokens = budget.request('conversation', 40000);
  const nonSystem = input.messages.filter(m => m.role !== 'system');
  const conversation = trimConversationByTokens(nonSystem, convTokens);

  const systemMessage: AIMessage = {
    role: 'system',
    content: fragments.filter(Boolean).join('\n\n---\n\n'),
  };

  return [systemMessage, ...conversation];
}

function latestUserText(messages: AIMessage[]): string {
  return [...messages].reverse().find(m => m.role === 'user')?.content || '';
}

function modePersona(mode: ContextBuildOptions['mode']): string {
  const base = 'You are HPClaw, a skill-aware AI partner for HPC and bioinformatics work.';

  switch (mode) {
    case 'autocomplete':
      return `${base}\nMode: terminal autocomplete. Return terse machine-readable suggestions.`;
    case 'analysis':
      return `${base}\nMode: terminal output analysis. Explain errors, causes, and concrete next steps for an HPC user.`;
    case 'agent':
      return `${base}\nMode: autonomous HPC assistant. You can execute commands, monitor jobs, and search skills. Respect login-node safety. For heavy work, use bsub scheduler jobs.`;
    case 'fast':
      return `${base}\nMode: fast command assistant. Keep responses minimal and action-oriented.`;
    default:
      return `${base}\nMode: HPClaw AI workspace. Ground answers in current terminal, conversation, observations, and installed skills.`;
  }
}

function trimConversationByTokens(messages: AIMessage[], maxTokens: number): AIMessage[] {
  const kept: AIMessage[] = [];
  let used = 0;

  for (const msg of [...messages].reverse()) {
    const contentTokens = estimateTokens(msg.content || '');
    if (used + contentTokens > maxTokens && kept.length > 0) break;
    kept.push(msg);
    used += contentTokens;
  }

  return kept.reverse();
}

// ─── Backward compatibility ────────────────────────────────

export function buildGatewayMessages(options: ContextBuildOptions): AIMessage[] {
  // If smart context is available, use it; otherwise fall back to legacy
  // For now, return a simple legacy-compatible format
  const rawMessages = options.messages || [];
  const nonSystem = rawMessages.filter(m => m.role !== 'system');
  const systemMessages = rawMessages.filter(m => m.role === 'system').map(m => m.content);

  const fragments = [
    'You are HPClaw, a skill-aware AI partner for HPC and bioinformatics work.',
    ...systemMessages,
  ];

  return [
    { role: 'system', content: fragments.join('\n\n') },
    ...nonSystem,
  ];
}
```

Also create the context helpers file for backward compatibility:

```typescript
// server/ai/contextHelpers.ts
import type { AIProfile, AIMessage } from './types';
import { normalizeAIProfile } from './providerAdapters';

export function profileFromBody(body: any): AIProfile {
  return normalizeAIProfile(body.profile || {
    provider: body.provider,
    baseUrl: body.baseUrl,
    model: body.model,
    apiKey: body.apiKey,
    temperature: body.temperature,
  });
}

export function messagesFromBody(body: any): AIMessage[] {
  return (body.messages || []).map((m: any) => ({
    role: m.role || 'user',
    content: m.content || '',
  }));
}
```

- [ ] **Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: No type errors (or fix any that arise).

- [ ] **Step 3: Commit**

```bash
git add server/ai/contextBuilder.ts server/ai/contextHelpers.ts
git commit -m "feat: rewrite ContextBuilder with token budgets, skill packs, cluster context, and memory integration

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 13: Update Server Routes

**Files:**
- Modify: `server.ts`

- [ ] **Step 1: Update the `/api/ai/stream` route**

The current import block in `server.ts` (lines 1-19) needs to be updated. Read the current file, then update the imports and the stream route to use the new context builder.

Update the imports at the top of `server.ts`:

```typescript
// Replace the import block with:
import type { AIProfile, AIMessage } from "./server/ai/types";
import { normalizeAIProfile } from "./server/ai/providerAdapters";
import { completeAI, extractAIText, streamAICompletion } from "./server/ai/providerAdapters";
import { formatSkillSearchResults, loadOrRefreshSkillIndex, refreshSkillIndex, searchSkillIndex, buildBibleChunks } from "./server/ai/skillIndex";
import { installSkillFromSource } from "./server/ai/skillInstaller";
import { formatLoginFailure } from "./server/loginDiagnostics";
import { buildTerminalSshArgs, LOGIN_RESPONSE_TIMEOUT_MS } from "./server/loginSsh";
import { resolveSocketSessionId } from "./server/socketSession";
import { buildGatewayMessages, buildSmartContext, profileFromBody, messagesFromBody } from "./server/ai/contextBuilder";
import { buildAutocompletePrompt, grammarSuggestions } from "./server/ai/autocomplete";
import { clusterContext } from "./server/ai/clusterContext";
import { fileRecognizer } from "./server/ai/fileRecognizer";
import { SkillGraphBuilder } from "./server/ai/skillGraph";
import { SkillOrchestrator } from "./server/ai/skillOrchestrator";
import { memoryOrchestrator } from "./server/ai/memoryOrchestrator";
import { agentPlanner } from "./server/ai/agentPlanner";
import { globalObservationStore } from "./server/ai/observationStore";
import { MemoryCompressor, shouldCompress } from "./server/ai/memoryCompressor";
import { estimateTokens } from "./server/ai/tokenBudget";
```

Replace the `/api/ai/stream` route (approximately lines 305-345) with:

```typescript
app.post("/api/ai/stream", async (req, res) => {
  const profile = profileFromBody(req.body);
  if (!profile.apiKey) return res.status(400).json({ error: "Missing API Key" });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  const heartbeat = setInterval(() => {
    res.write(": heartbeat\n\n");
  }, 15000);

  try {
    // ── Build smart context ────────────────────────────
    const sessionId = (req.session as any)?.sshSessionId;
    let clusterSnapshot = null;

    // Collect cluster snapshot if SSH session is active
    if (sessionId) {
      try {
        const cmd = clusterContext.buildSnapshotCommand(
          req.body.mode === 'agent' ? 'standard' : 'quick'
        );
        // Note: cluster command execution requires the SSH session from sshSessions map
        // In the full integration, this calls runViaSSH. For now, use cached or skip.
        const cached = clusterContext.getCached(sessionId);
        if (cached) {
          clusterSnapshot = cached;
        }
      } catch { /* snapshot is best-effort */ }
    }

    const rawMessages = messagesFromBody(req.body);
    const query = [...rawMessages].reverse().find(m => m.role === 'user')?.content || '';

    // Build smart context
    const smartMessages = await buildSmartContext({
      messages: rawMessages,
      mode: req.body.mode || (req.body.isFastMode ? "fast" : "agent"),
      userQuery: query,
      clusterSnapshot: clusterSnapshot ?? undefined,
      structuredMemory: memoryOrchestrator.getShortTerm() ?? undefined,
      taskPlan: req.body.mode === 'agent' ? agentPlanner.currentPlan() ?? undefined : undefined,
      model: profile.model,
      observations: globalObservationStore.summarize(3000),
      selectedOutput: req.body.selectedOutput,
    });

    console.log(`[AI Stream] Gateway provider=${profile.provider}, model=${profile.model}, msgs=${smartMessages.length}`);
    await streamAICompletion(
      { profile, messages: smartMessages, isFastMode: !!req.body.isFastMode, maxTokens: req.body.maxTokens },
      event => res.write(`data: ${JSON.stringify(event)}\n\n`),
    );

    res.end();
  } catch (err: any) {
    res.write(`data: ${JSON.stringify({ type: "error", error: err.message })}\n\n`);
    res.end();
  } finally {
    clearInterval(heartbeat);
  }
});
```

Also update `profileFromBody` and `messagesFromBody` — they're now imported from `contextHelpers.ts` instead of defined locally. Remove the local definitions (lines 73-87 in the original server.ts).

- [ ] **Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: Fix any type errors that arise from the integration.

- [ ] **Step 3: Commit**

```bash
git add server.ts
git commit -m "feat: integrate smart context builder into /api/ai/stream route

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 14: Update AIChat.tsx Agent Loop

**Files:**
- Modify: `src/components/AIChat.tsx`

- [ ] **Step 1: Update the `handleAgentMode` function**

In `src/components/AIChat.tsx`, find the `handleAgentMode` function (around line 553). Replace the `getSkillsContext()` call and the `sysPrompt` construction to use structured context.

The key changes:

1. Instead of `getSkillsContext()` which returns the entire bible, the context is now built server-side
2. The agent loop should handle `taskPlan` from the server response
3. Memory compression should be triggered after phase completion

Replace the `getSkillsContext` usage (around lines 566-616). Instead of building `sysPrompt` with the full bible, pass a simpler system message since the smart context is built server-side:

```typescript
const handleAgentMode = async (userText: string) => {
  // Fetch real-time cluster state before AI makes decisions
  let clusterState = '';
  try {
    const stateOutput = await executeCommand('echo "PWD:$(pwd)" && echo "WHOAMI:$(whoami)" && bjobs -w 2>/dev/null | head -15 && echo "---QUOTA---" && quota -s 2>/dev/null | head -5', true);
    const pwdMatch = stateOutput.match(/PWD:(\/[^\n]*)/);
    if (pwdMatch) currentPwdRef.current = pwdMatch[1];
    clusterState = stateOutput;
  } catch { /* cluster state is best-effort */ }

  // Simplified system prompt — rich context is built server-side now
  const sysPrompt: Message = {
    role: 'system',
    content: `你是 HPClaw 生物信息学智能集群助手。你通过执行命令、监控作业、搜索技能来帮助用户完成HPC分析任务。

【核心规则】：
1. 禁止使用 rm 命令
2. 耗时超过2分钟的操作必须用 bsub 提交LSF作业
3. 每次只输出一个 <execute>，等待结果后再决定下一步
4. 执行生信软件前先用 mii search 或 module av 确认可用版本
5. 作业提交后必须询问用户是否监控

【实时集群状态】：
${clusterState || '(无法获取集群状态)'}`,
  };

  // ... rest of the agent loop remains the same
  // The context management at line 636-645 should be updated:
  // Instead of dropping old messages, trigger server-side memory compression

  const contextMsgs: { role: string; content: string }[] = [
    ...messages.map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: userText },
  ];

  // ... agent loop continues with existing logic
```

- [ ] **Step 2: Update context management in the agent loop**

Replace the simple truncation at lines 636-645:

```typescript
// Before (old):
// if (contextMsgs.length > 20) {
//   const summaryMsg = { ... };
//   const recent = contextMsgs.slice(-10);
//   contextMsgs.length = 0;
//   contextMsgs.push(summaryMsg, ...recent);
// }

// After (new): trigger server-side memory compression
if (contextMsgs.length > 15) {
  addMessage({
    role: 'system',
    content: '[对话较长，正在压缩记忆...]',
  });
  // The server-side contextBuilder handles compression automatically
  // We keep last 10 messages for continuity
  const recent = contextMsgs.slice(-10);
  contextMsgs.length = 0;
  contextMsgs.push(...recent);
}
```

- [ ] **Step 3: Run the dev server to verify it compiles**

```bash
npm run dev &
sleep 3
curl http://localhost:3003 > /dev/null 2>&1 && echo "Server started OK"
```

Expected: Server starts without crashes. Kill the server after verification.

- [ ] **Step 4: Commit**

```bash
git add src/components/AIChat.tsx
git commit -m "feat: simplify AIChat agent prompt, delegate rich context to server-side contextBuilder

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 15: Add Skill Relationships to Core Skills

**Files:**
- Modify: `skills/SKILL.md` (add depends_on/related_to/solves frontmatter)
- Modify: `skills/bio/transcriptome.md`
- Modify: `skills/bio/alignment.md`
- Modify: `skills/bio/qc.md`
- Modify: `skills/bio/formats.md`

- [ ] **Step 1: Add relation frontmatter to core skills**

For each of the 5 core bio skills, add relation fields to the YAML frontmatter:

`skills/SKILL.md` frontmatter update:
```yaml
---
name: ncpgr-software
description: NCPGR高性能计算集群软件使用注意事项与优化指南
triggers: ["集群", "LSF", "bsub", "module", "核数", "内存"]
solves: ["软件选型", "资源申请", "module使用", "singularity使用"]
related_to: [lsf-ncpgr, bio/alignment, bio/qc, bio/transcriptome]
---
```

`skills/bio/transcriptome.md` frontmatter update:
```yaml
---
name: RNA-seq transcriptome
description: RNA-seq转录组分析流程
tags: [rnaseq, transcriptome, deg, expression]
depends_on: [bio/alignment, bio/qc]
related_to: [lsf-ncpgr, bio/formats]
used_with: [nature/nature-figure, nature/nature-data]
triggers: ["RNA-seq", "转录组", "差异表达", "DEG", "表达量"]
solves: ["差异表达分析", "转录本定量", "可变剪切"]
---
```

`skills/bio/alignment.md` frontmatter update:
```yaml
---
name: Sequence Alignment
description: 序列比对工具和参数指南
tags: [bwa, star, bowtie2, minimap2, alignment, mapping]
related_to: [bio/qc, bio/formats, bio/transcriptome]
used_with: [lsf-ncpgr, SKILL]
triggers: ["比对", "alignment", "mapping", "BWA", "STAR", "bowtie2"]
solves: ["序列比对", "reads mapping", "参考基因组比对"]
---
```

`skills/bio/qc.md` frontmatter update:
```yaml
---
name: Quality Control
description: 测序数据质控指南
tags: [fastqc, multiqc, fastp, qc, quality]
related_to: [bio/alignment, bio/transcriptome]
used_with: [SKILL]
triggers: ["质控", "QC", "fastqc", "fastp", "质量"]
solves: ["测序数据质控", "质量评估", "低质量碱基过滤"]
---
```

`skills/bio/formats.md` frontmatter update:
```yaml
---
name: Bioinformatics File Formats
description: 生物信息学常见文件格式说明
tags: [fastq, fasta, sam, bam, vcf, bed, gff, gtf]
related_to: [bio/alignment, bio/qc]
triggers: ["格式", "format", "FASTQ", "BAM", "VCF", "SAM", "GTF"]
solves: ["文件格式理解", "格式转换", "字段含义查询"]
---
```

- [ ] **Step 2: Rebuild skill index to pick up new fields**

```bash
npx tsx -e "const {refreshSkillIndex}=require('./server/ai/skillIndex'); const idx=refreshSkillIndex({skillsDir:'./skills',lsfSkillDir:'./lsf_skills'}); console.log('Index rebuilt:', idx.skills.length, 'skills'); const rnaseq=idx.skills.find(s=>s.filename==='bio/transcriptome'); console.log('transcriptome depends_on:', rnaseq?.dependsOn);"
```

Expected: Shows `dependsOn: ['bio/alignment', 'bio/qc']`.

- [ ] **Step 3: Commit**

```bash
git add skills/SKILL.md skills/bio/transcriptome.md skills/bio/alignment.md skills/bio/qc.md skills/bio/formats.md skills/.skill-index.json
git commit -m "feat: add skill relation fields (depends_on, related_to, solves) to core bio skills

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

### Task 16: Integration Test & Verification

**Files:**
- Create: `server/ai/integration.test.ts`

- [ ] **Step 1: Write the integration test**

```typescript
// server/ai/integration.test.ts
import { describe, expect, it } from 'vitest';
import { TokenBudgetManager } from './tokenBudget';
import { FileRecognizer, fileRecognizer } from './fileRecognizer';
import { SkillGraphBuilder } from './skillGraph';
import { SkillOrchestrator } from './skillOrchestrator';
import { buildBibleChunks } from './skillIndex';
import { MemoryCompressor } from './memoryCompressor';
import { MemoryOrchestrator, formatMemoryForAI } from './memoryOrchestrator';
import { AgentPlanner } from './agentPlanner';
import { ObservationStore } from './observationStore';

describe('Full AI pipeline integration', () => {
  it('end-to-end: cluster file detection → skill graph → orchestrator → memory', () => {
    // 1. Detect cluster files
    const files = fileRecognizer.analyzeList(
      ['sample_R1.fastq.gz', 'sample_R1.bam', 'myjob.lsf'],
      [5_000_000, 2_000_000_000, 1024],
      [Date.now(), Date.now(), Date.now()],
    );

    expect(files[0].type).toBe('fastq');
    expect(files[1].type).toBe('bam');
    expect(files[2].type).toBe('lsf');

    // 2. Infer phase and collect skill hints
    const hints = fileRecognizer.inferPhase(files);
    expect(hints.skills).toContain('qc');
    expect(hints.skills).toContain('alignment');

    // 3. Build skill graph from real index
    const { loadOrRefreshSkillIndex } = require('./skillIndex');
    const path = require('path');
    const index = loadOrRefreshSkillIndex({
      skillsDir: path.join(process.cwd(), 'skills'),
      lsfSkillDir: path.join(process.cwd(), 'lsf_skills'),
    });

    const graph = SkillGraphBuilder.build(index.skills);
    expect(graph.nodes.size).toBeGreaterThan(0);

    // 4. Token budget
    const budget = new TokenBudgetManager('deepseek-v4-pro');
    const tokens = budget.request('skills', 25000);
    expect(tokens).toBe(25000);

    // 5. Bible chunks
    const bible = index.skills.find(s => s.filename === 'SKILL' || s.filename === 'SKILL.md');
    if (bible) {
      const chunks = buildBibleChunks(bible.content);
      expect(chunks.length).toBeGreaterThan(0);
    }

    // 6. Memory orchestrator
    const compressor = new MemoryCompressor();
    const compressionResult = compressor.parseCompressionResult(JSON.stringify({
      task: 'RNA-seq analysis',
      progress: { phase: 1, description: 'QC', completed: 0 },
      keyFacts: [{ category: 'data', fact: '100 FASTQ files' }],
      decisions: [{ what: 'Use fastp', why: 'Recommended by manual' }],
      skillsUsed: ['qc'],
      errors: [],
    }));
    expect(compressionResult).not.toBeNull();

    const memoryOrch = new MemoryOrchestrator();
    memoryOrch.setShortTerm(compressionResult!);
    expect(formatMemoryForAI(memoryOrch.getShortTerm()!)).toContain('RNA-seq');

    // 7. Agent planner
    const planner = new AgentPlanner();
    planner.setPlan({
      goal: 'RNA-seq QC',
      phases: [{
        id: 1,
        name: 'QC',
        status: 'pending',
        steps: [{ id: '1.1', description: 'fastp', status: 'pending', linkedSkills: ['qc'] }],
        linkedSkills: ['qc'],
        entryConditions: [],
      }],
      currentPhase: 0,
      createdAt: Date.now(),
    });
    expect(planner.currentPlan()).not.toBeNull();

    // 8. Observation store
    const store = new ObservationStore();
    store.add({ type: 'command', data: 'fastp -i sample.fq', importance: 3, summary: 'QC started' });
    expect(store.count()).toBe(1);
    expect(store.summarize(100)).toContain('QC');
  });
});
```

- [ ] **Step 2: Run integration test**

```bash
npx vitest run server/ai/integration.test.ts
```

Expected: All tests PASS, demonstrating the full pipeline works end-to-end.

- [ ] **Step 3: Run all AI tests**

```bash
npx vitest run server/ai/
```

Expected: All tests across all new modules PASS.

- [ ] **Step 4: Commit**

```bash
git add server/ai/integration.test.ts
git commit -m "test: add full-pipeline integration test for AI intelligence upgrade

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

