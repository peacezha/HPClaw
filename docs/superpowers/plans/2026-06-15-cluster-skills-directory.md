# Cluster Skills Directory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Read text skills from the active cluster user's `~/hpclaw_skills` directory and display/search them as first-class cluster skills.

**Architecture:** Extend `skillIndex` to classify text-like skill files and normalize cluster metadata, add a small testable `server/ai/clusterSkills.ts` helper for scanner output parsing/cache-safe conversion, and wire `server.ts` to fetch cluster skills through the helper. Front-end panels consume existing `source` and `category` metadata, with cluster skills shown in the HPC skill area.

**Tech Stack:** TypeScript, Express, React, Vitest, existing SSH command queue in `server.ts`, `gray-matter` for optional frontmatter.

---

## File Structure

- Modify `server/ai/skillIndex.ts`: expose text-skill extension detection, normalize cluster filenames with a `cluster/` prefix, and parse plain text skill content.
- Add `server/ai/clusterSkills.ts`: define supported scanner records, parse newline-delimited JSON scanner output, create a reusable remote scanner command, and convert entries into `SkillMetadata`.
- Add `server/ai/clusterSkills.test.ts`: unit-test scanner parsing and supported extension filtering without a live SSH session.
- Modify `server/ai/skillIndex.test.ts`: add failing tests for plain text cluster skills and cluster filename prefixing.
- Modify `server.ts`: replace inline `.md`-only cluster scan with `clusterSkills.ts` helper and add a per-session cache.
- Modify `src/services/skillCatalog.ts`: type `source` as the known skill source union and preserve returned metadata.
- Modify `src/components/SkillsPanel.tsx`: label cluster skills clearly in the existing tree.
- Modify `src/components/BioSkillPanel.tsx`: filter by returned `category/source` metadata instead of filename-only inference.

## Task 1: Skill Index Cluster Text Support

**Files:**
- Modify: `server/ai/skillIndex.ts`
- Modify: `server/ai/skillIndex.test.ts`

- [ ] **Step 1: Write failing tests**

Add tests showing the required behavior:

```ts
it('parses plain text cluster skills and prefixes filenames', () => {
  const skill = skillFromContent('notes/1.txt', 'fastp cluster defaults\nthreads=8', 'cluster', 31);

  expect(skill?.filename).toBe('cluster/notes/1');
  expect(skill?.name).toBe('1');
  expect(skill?.category).toBe('hpc');
  expect(skill?.source).toBe('cluster');
  expect(skill?.sourcePath).toBe('cluster:~/hpclaw_skills/notes/1.txt');
  expect(skill?.description).toContain('fastp cluster defaults');
});

it('indexes supported non-markdown text extensions', () => {
  for (const file of ['a.txt', 'run.py', 'job.lsf', 'config.yaml', 'table.tsv']) {
    expect(isTextSkillFile(file)).toBe(true);
  }
  expect(isTextSkillFile('image.png')).toBe(false);
});
```

- [ ] **Step 2: Run tests to verify red**

Run: `npm test -- server/ai/skillIndex.test.ts`

Expected: FAIL because `isTextSkillFile` is not exported and cluster filenames are not prefixed.

- [ ] **Step 3: Implement minimal skill index changes**

Add/export a text extension set and normalize cluster filenames:

```ts
const TEXT_EXTENSIONS = new Set([
  '.md', '.markdown', '.txt', '.rst', '.adoc', '.org',
  '.yml', '.yaml', '.json', '.toml', '.ini', '.conf', '.cfg',
  '.sh', '.bash', '.zsh', '.py', '.r', '.pl', '.rb', '.jl',
  '.lsf', '.sbatch', '.csv', '.tsv', '.log', '.out', '.err',
]);

export function isTextSkillFile(file: string): boolean {
  return file === 'SKILL.md' || TEXT_EXTENSIONS.has(path.extname(file).toLowerCase());
}

function normalizeSkillFilename(relativePath: string, source: SkillMetadata['source']): string {
  const filename = relativePath
    .replace(/\/SKILL\.md$/i, '')
    .replace(/\.[^.\/]+$/i, '');
  return source === 'cluster' ? `cluster/${filename.replace(/^cluster\//, '')}` : filename;
}
```

Use `normalizeSkillFilename` in both `skillFromFile` and `skillFromContent`, and keep `sourcePath` for cluster entries as `cluster:~/hpclaw_skills/${relativePath}`.

- [ ] **Step 4: Run tests to verify green**

Run: `npm test -- server/ai/skillIndex.test.ts`

Expected: PASS for all `skillIndex` tests.

## Task 2: Cluster Scanner Helper

**Files:**
- Add: `server/ai/clusterSkills.ts`
- Add: `server/ai/clusterSkills.test.ts`

- [ ] **Step 1: Write failing tests**

Create `server/ai/clusterSkills.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { buildClusterSkillScanCommand, clusterSkillFromRecord, parseClusterSkillScanOutput } from './clusterSkills';

describe('cluster skill scanner helpers', () => {
  it('parses newline-delimited scanner records and skips malformed lines', () => {
    const output = [
      JSON.stringify({ rel: '1.txt', text: 'cluster note', size: 12, mtime: 100 }),
      'not json',
      JSON.stringify({ rel: 'image.png', text: 'binary', size: 6, mtime: 101 }),
    ].join('\n');

    const records = parseClusterSkillScanOutput(output);

    expect(records).toHaveLength(1);
    expect(records[0].rel).toBe('1.txt');
  });

  it('converts scanner records to cluster skill metadata', () => {
    const skill = clusterSkillFromRecord({ rel: 'pipelines/run.sh', text: 'bsub < job.lsf', size: 14, mtime: 200 });

    expect(skill?.filename).toBe('cluster/pipelines/run');
    expect(skill?.source).toBe('cluster');
    expect(skill?.category).toBe('hpc');
  });

  it('builds a scanner command for hpclaw_skills with limits', () => {
    const command = buildClusterSkillScanCommand();

    expect(command).toContain('hpclaw_skills');
    expect(command).toContain('MAX_FILES');
    expect(command).toContain('MAX_BYTES');
  });
});
```

- [ ] **Step 2: Run tests to verify red**

Run: `npm test -- server/ai/clusterSkills.test.ts`

Expected: FAIL because `server/ai/clusterSkills.ts` does not exist.

- [ ] **Step 3: Implement helper**

Create `server/ai/clusterSkills.ts` with:

```ts
import { Buffer } from 'buffer';
import { isTextSkillFile, skillFromContent } from './skillIndex';
import type { SkillMetadata } from './types';

export interface ClusterSkillRecord {
  rel: string;
  text: string;
  size: number;
  mtime?: number;
}

export const DEFAULT_CLUSTER_SKILL_CACHE_TTL_MS = 45_000;

export function parseClusterSkillScanOutput(raw: string): ClusterSkillRecord[] {
  const records: ClusterSkillRecord[] = [];
  for (const line of raw.trim().split(/\r?\n/)) {
    if (!line.trim()) continue;
    try {
      const parsed = JSON.parse(line);
      if (!parsed?.rel || typeof parsed.text !== 'string') continue;
      const rel = String(parsed.rel).replace(/\\/g, '/');
      if (!isTextSkillFile(rel)) continue;
      records.push({
        rel,
        text: parsed.text,
        size: Number(parsed.size || Buffer.byteLength(parsed.text)),
        mtime: parsed.mtime == null ? undefined : Number(parsed.mtime),
      });
    } catch {
      continue;
    }
  }
  return records;
}

export function clusterSkillFromRecord(record: ClusterSkillRecord): SkillMetadata | null {
  return skillFromContent(record.rel, record.text, 'cluster', record.size || Buffer.byteLength(record.text));
}

export function clusterSkillsFromScanOutput(raw: string): SkillMetadata[] {
  return parseClusterSkillScanOutput(raw)
    .map(clusterSkillFromRecord)
    .filter(Boolean) as SkillMetadata[];
}

export function buildClusterSkillScanCommand(maxFiles = 500, maxBytes = 262144): string {
  const script = String.raw`
import os, json
d = os.path.expanduser('~/hpclaw_skills')
MAX_FILES = ${maxFiles}
MAX_BYTES = ${maxBytes}
TEXT_EXTS = set(${JSON.stringify(['.md','.markdown','.txt','.rst','.adoc','.org','.yml','.yaml','.json','.toml','.ini','.conf','.cfg','.sh','.bash','.zsh','.py','.r','.pl','.rb','.jl','.lsf','.sbatch','.csv','.tsv','.log','.out','.err'])})
count = 0
os.makedirs(d, exist_ok=True)
for root, dirs, files in os.walk(d):
    dirs[:] = [x for x in dirs if not x.startswith('.')]
    for fn in files:
        ext = os.path.splitext(fn)[1].lower()
        if fn != 'SKILL.md' and ext not in TEXT_EXTS:
            continue
        if count >= MAX_FILES:
            raise SystemExit
        f = os.path.join(root, fn)
        try:
            size = os.path.getsize(f)
            with open(f, 'r', encoding='utf-8', errors='replace') as handle:
                text = handle.read(MAX_BYTES)
            rel = os.path.relpath(f, d)
            mtime = int(os.path.getmtime(f))
            print(json.dumps({'rel': rel, 'text': text, 'size': size, 'mtime': mtime}, ensure_ascii=False))
            count += 1
        except Exception:
            pass
`;
  const encoded = Buffer.from(script, 'utf8').toString('base64');
  return `printf '%s' '${encoded}' | base64 -d | python3 2>/dev/null || printf '%s' '${encoded}' | base64 -d | python 2>/dev/null`;
}
```

- [ ] **Step 4: Run helper tests**

Run: `npm test -- server/ai/clusterSkills.test.ts`

Expected: PASS.

## Task 3: Server Integration and Cache

**Files:**
- Modify: `server.ts`

- [ ] **Step 1: Write failing integration-adjacent test if feasible**

If `server.ts` helpers remain private, do not add brittle route tests. The scanner and skill metadata behavior are covered in Task 1 and Task 2. Proceed to minimal server wiring.

- [ ] **Step 2: Implement server wiring**

In `server.ts`:

```ts
import {
  DEFAULT_CLUSTER_SKILL_CACHE_TTL_MS,
  buildClusterSkillScanCommand,
  clusterSkillsFromScanOutput,
} from './server/ai/clusterSkills';
```

Add cache fields to `SSHSession`:

```ts
clusterSkillCache?: {
  fetchedAt: number;
  skills: SkillMetadata[];
};
```

Replace inline `fetchClusterSkills` body with:

```ts
async function fetchClusterSkills(session: SSHSession): Promise<SkillMetadata[]> {
  const cached = session.clusterSkillCache;
  if (cached && Date.now() - cached.fetchedAt < DEFAULT_CLUSTER_SKILL_CACHE_TTL_MS) {
    return cached.skills;
  }
  session.suppressTermOutput = true;
  try {
    const raw = await runViaSSH(session, buildClusterSkillScanCommand(), 30000);
    const skills = clusterSkillsFromScanOutput(raw);
    session.clusterSkillCache = { fetchedAt: Date.now(), skills };
    console.log(`[skills:cluster] Fetched ${skills.length} cluster skills`);
    return skills;
  } catch (err: any) {
    console.error('[skills:cluster] Error:', err.message || err);
    return [];
  } finally {
    session.suppressTermOutput = false;
  }
}
```

- [ ] **Step 3: Run server-related tests**

Run: `npm test -- server/ai/clusterSkills.test.ts server/ai/skillIndex.test.ts`

Expected: PASS.

## Task 4: Front-End Metadata Display

**Files:**
- Modify: `src/services/skillCatalog.ts`
- Modify: `src/components/SkillsPanel.tsx`
- Modify: `src/components/BioSkillPanel.tsx`

- [ ] **Step 1: Type metadata**

In `skillCatalog.ts`, type `source` as:

```ts
export type SkillSource = 'system' | 'imported' | 'user' | 'lsf' | 'cluster';
```

and use `source?: SkillSource` in `Skill`.

- [ ] **Step 2: Show source badge in `SkillsPanel`**

For each skill item, render a small source label when `s.source === 'cluster'`:

```tsx
{(s as any).source === 'cluster' && (
  <span className="text-[9px] px-1 rounded bg-accent/10 text-accent shrink-0">cluster</span>
)}
```

Also set the HPC category label to `集群技能` if the file source is cluster-dominated.

- [ ] **Step 3: Use metadata in `BioSkillPanel`**

Extend the category type:

```ts
type Category = 'all' | 'bio' | 'nature' | 'system' | 'hpc' | 'user';
```

Use returned metadata:

```ts
function getCategory(skill: SkillFile): Category {
  if ((skill as any).source === 'cluster' || (skill as any).category === 'hpc') return 'hpc';
  const filename = skill.filename;
  if ((skill as any).category === 'bio' || filename.startsWith('bio/')) return 'bio';
  if ((skill as any).category === 'nature' || filename.includes('nature/')) return 'nature';
  if ((skill as any).source === 'system' || (skill as any).source === 'lsf') return 'system';
  return 'user';
}
```

- [ ] **Step 4: Run type check**

Run: `npm run lint`

Expected: PASS or existing unrelated type errors only. If errors point to these files, fix them.

## Task 5: Final Verification

**Files:**
- All modified files from tasks above.

- [ ] **Step 1: Run focused tests**

Run: `npm test -- server/ai/skillIndex.test.ts server/ai/clusterSkills.test.ts`

Expected: PASS.

- [ ] **Step 2: Run full tests**

Run: `npm test`

Expected: PASS, unless existing unrelated failures are identified with evidence.

- [ ] **Step 3: Run type check**

Run: `npm run lint`

Expected: PASS, unless existing unrelated failures are identified with evidence.

- [ ] **Step 4: Inspect diff**

Run: `git diff -- server/ai/skillIndex.ts server/ai/skillIndex.test.ts server/ai/clusterSkills.ts server/ai/clusterSkills.test.ts server.ts src/services/skillCatalog.ts src/components/SkillsPanel.tsx src/components/BioSkillPanel.tsx`

Expected: Diff only contains cluster skill directory support.
