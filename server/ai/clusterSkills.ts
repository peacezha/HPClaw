import { Buffer } from 'buffer';
import { isTextSkillFile, skillFromContent } from './skillIndex';
import type { SkillMetadata } from './types';

export interface ClusterSkillRecord {
  rel: string;
  text: string;
  size: number;
  mtime?: number;
}

// 远程技能只是 Agent 的辅助知识，绝不能成为每次对话的同步前置条件。
// 缓存时间拉长到 5 分钟；首次扫描也有很小的硬预算。
export const DEFAULT_CLUSTER_SKILL_CACHE_TTL_MS = 5 * 60_000;
export const DEFAULT_CLUSTER_SKILL_SCAN_TIMEOUT_MS = 2_500;

const REMOTE_TEXT_EXTENSIONS = [
  '.md',
  '.markdown',
  '.txt',
  '.rst',
  '.adoc',
  '.org',
  '.yml',
  '.yaml',
  '.json',
  '.toml',
  '.ini',
  '.conf',
  '.cfg',
  '.sh',
  '.bash',
  '.zsh',
  '.py',
  '.r',
  '.pl',
  '.rb',
  '.jl',
  '.lsf',
  '.sbatch',
  '.csv',
  '.tsv',
  '.log',
  '.out',
  '.err',
];

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

export function buildClusterSkillScanCommand(
  maxFiles = 500,
  maxBytes = 16_384,
  maxTotalBytes = 2_097_152,
): string {
  const script = `
import os, json
d = os.path.expanduser('~/hpclaw_skills')
MAX_FILES = ${Math.max(1, Math.floor(maxFiles))}
MAX_BYTES = ${Math.max(1024, Math.floor(maxBytes))}
MAX_TOTAL_BYTES = ${Math.max(4096, Math.floor(maxTotalBytes))}
TEXT_EXTS = set(${JSON.stringify(REMOTE_TEXT_EXTENSIONS)})
count = 0
total_bytes = 0
os.makedirs(d, exist_ok=True)
for root, dirs, files in os.walk(d):
    dirs[:] = [name for name in dirs if not name.startswith('.')]
    for fn in files:
        ext = os.path.splitext(fn)[1].lower()
        if fn != 'SKILL.md' and ext not in TEXT_EXTS:
            continue
        if count >= MAX_FILES:
            raise SystemExit
        if total_bytes >= MAX_TOTAL_BYTES:
            raise SystemExit
        f = os.path.join(root, fn)
        try:
            size = os.path.getsize(f)
            with open(f, 'r', encoding='utf-8', errors='replace') as handle:
                text = handle.read(min(MAX_BYTES, MAX_TOTAL_BYTES - total_bytes))
            rel = os.path.relpath(f, d)
            mtime = int(os.path.getmtime(f))
            print(json.dumps({'rel': rel, 'text': text, 'size': size, 'mtime': mtime}, ensure_ascii=False))
            count += 1
            total_bytes += len(text.encode('utf-8', errors='replace'))
        except Exception:
            pass
`;
  const encoded = Buffer.from(script, 'utf8').toString('base64');
  return [
    '# hpclaw_skills MAX_FILES MAX_BYTES MAX_TOTAL_BYTES',
    `printf '%s' '${encoded}' | base64 -d | python3 2>/dev/null || printf '%s' '${encoded}' | base64 -d | python 2>/dev/null`,
  ].join('\n');
}

// ── 运行时扫描（带按会话缓存）─────────────────────────────────────
// 此前 buildClusterSkillScanCommand/clusterSkillsFromScanOutput 只被测试引用，
// 运行时从未接线，导致技能库读不到集群 ~/hpclaw_skills 里的技能。
const scanCache = new Map<string, { at: number; skills: SkillMetadata[] }>();
const activeScans = new Map<string, Promise<SkillMetadata[]>>();

export function getCachedClusterSkills(cacheKey: string): SkillMetadata[] {
  return scanCache.get(cacheKey)?.skills ?? [];
}

async function refreshClusterSkills(
  exec: (cmd: string, timeout?: number) => Promise<string>,
  cacheKey: string,
  timeoutMs: number,
): Promise<SkillMetadata[]> {
  const running = activeScans.get(cacheKey);
  if (running) return running;

  const previous = scanCache.get(cacheKey)?.skills ?? [];
  const pending = (async () => {
    try {
      const raw = await exec(buildClusterSkillScanCommand(), timeoutMs);
      const skills = clusterSkillsFromScanOutput(raw);
      scanCache.set(cacheKey, { at: Date.now(), skills });
      return skills;
    } catch {
      return previous;
    } finally {
      activeScans.delete(cacheKey);
    }
  })();
  activeScans.set(cacheKey, pending);
  return pending;
}

/**
 * 给 AI 主链路使用：立即返回已有缓存，并在后台刷新。
 * 即使集群命令、共享文件系统或 SSH 通道变慢，也不会拖住模型首包。
 */
export function refreshClusterSkillsInBackground(
  exec: (cmd: string, timeout?: number) => Promise<string>,
  cacheKey: string,
  ttlMs: number = DEFAULT_CLUSTER_SKILL_CACHE_TTL_MS,
  timeoutMs: number = DEFAULT_CLUSTER_SKILL_SCAN_TIMEOUT_MS,
): void {
  const cached = scanCache.get(cacheKey);
  if (cached && Date.now() - cached.at < ttlMs) return;
  void refreshClusterSkills(exec, cacheKey, timeoutMs);
}

/**
 * 在集群上扫描 ~/hpclaw_skills 并解析为技能元数据。
 * 扫描失败（无会话/无 python/网络抖动）返回旧缓存或空数组，不阻塞本地技能。
 */
export async function scanClusterSkills(
  exec: (cmd: string, timeout?: number) => Promise<string>,
  cacheKey: string,
  ttlMs: number = DEFAULT_CLUSTER_SKILL_CACHE_TTL_MS,
  timeoutMs: number = DEFAULT_CLUSTER_SKILL_SCAN_TIMEOUT_MS,
): Promise<SkillMetadata[]> {
  const cached = scanCache.get(cacheKey);
  if (cached && Date.now() - cached.at < ttlMs) return cached.skills;
  // 有旧缓存时采用 stale-while-revalidate，调用方不再等待网络。
  if (cached) {
    refreshClusterSkillsInBackground(exec, cacheKey, ttlMs, timeoutMs);
    return cached.skills;
  }
  return refreshClusterSkills(exec, cacheKey, timeoutMs);
}
