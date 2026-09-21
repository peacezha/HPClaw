// 命令历史补全：记录用户在终端执行的命令，按 频率×新近度 排序提供补全。
// 这是预测下一条命令最强的信号（fish-shell 风格）。

export interface HistoryEntry {
  cmd: string;
  count: number;
  lastUsed: number;
}

const STORAGE_KEY = 'hpclaw_cmd_history';
const MAX_ENTRIES = 200;
const MAX_SUGGEST = 3;

// 模块级内存缓存：AI 补全按键路径（aiTerminal.requestAutocomplete）每键都会
// 经 searchHistory/getRecentCommands 触发 load，避免每次同步 localStorage 读 + JSON.parse。
// 一致性：仅本模块写该 key，写入（save/clearHistory）时同步更新或失效缓存即可。
let cache: HistoryEntry[] | null = null;

function load(): HistoryEntry[] {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      cache = [];
      return cache;
    }
    const parsed = JSON.parse(raw);
    cache = Array.isArray(parsed) ? parsed : [];
    return cache;
  } catch {
    // 解析失败不缓存，下次读取重试
    return [];
  }
}

function save(entries: HistoryEntry[]): void {
  // 缓存与写入存储的内容保持一致（截断到 MAX_ENTRIES）
  const truncated = entries.slice(0, MAX_ENTRIES);
  cache = truncated;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(truncated));
  } catch {
    // 存储失败不影响使用
  }
}

/** 记录一条已执行的命令（去重、累计频率、按最近使用排序保留） */
export function recordCommand(cmd: string): void {
  const normalized = cmd.trim().replace(/\s+/g, ' ');
  if (normalized.length < 3) return;
  const entries = load();
  // 多条命令可能在同一毫秒内写入；使用单调时间戳保证“刚执行的”稳定排在最前。
  const lastUsed = Math.max(Date.now(), ...entries.map(entry => entry.lastUsed + 1), 0);
  const existing = entries.find(e => e.cmd === normalized);
  if (existing) {
    existing.count += 1;
    existing.lastUsed = lastUsed;
  } else {
    entries.push({ cmd: normalized, count: 1, lastUsed });
  }
  entries.sort((a, b) => b.lastUsed - a.lastUsed);
  save(entries);
}

/** 最近使用的命令（新→旧），用于把历史注入 AI 补全上下文 */
export function getRecentCommands(limit = 8): string[] {
  return load()
    .sort((a, b) => b.lastUsed - a.lastUsed)
    .slice(0, limit)
    .map(e => e.cmd);
}

function scoreEntry(entry: HistoryEntry, now: number): number {
  // 频率分（对数衰减）+ 新近度分（24h 内线性衰减）
  const freqScore = Math.min(Math.log2(entry.count + 1) * 20, 60);
  const ageHours = (now - entry.lastUsed) / 3_600_000;
  const recencyScore = Math.max(0, 40 - ageHours * 1.7);
  return freqScore + recencyScore;
}

export interface HistorySuggestion {
  completion: string;
  explanation: string;
}

/**
 * 用当前输入的前缀匹配历史命令。
 * 匹配规则：整条命令前缀匹配优先，其次最后一个 token 前缀匹配。
 */
export function searchHistory(input: string, limit = MAX_SUGGEST): HistorySuggestion[] {
  const q = input.trim();
  if (q.length < 2) return [];
  const now = Date.now();
  const lastSpace = q.lastIndexOf(' ');
  const lastToken = lastSpace >= 0 ? q.slice(lastSpace + 1) : q;

  const scored: { entry: HistoryEntry; score: number }[] = [];
  for (const entry of load()) {
    let matchScore = 0;
    if (entry.cmd === q) continue; // 已完整输入，不提示
    if (entry.cmd.startsWith(q)) {
      matchScore = 100; // 整条前缀匹配
    } else if (lastToken.length >= 2 && entry.cmd !== q) {
      // 最后一个 token 的前缀匹配（如输入 "samtools vi" 命中 "samtools view a.bam"）
      const head = q.slice(0, q.length - lastToken.length);
      if (entry.cmd.startsWith(head) && entry.cmd.slice(head.length).startsWith(lastToken)) {
        matchScore = 70;
      }
    }
    if (matchScore > 0) {
      scored.push({ entry, score: matchScore + scoreEntry(entry, now) });
    }
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ entry }) => ({
      completion: entry.cmd,
      explanation: entry.count > 1 ? `历史（用过 ${entry.count} 次）` : '历史命令',
    }));
}

/** 清空历史（设置/隐私场景备用） */
export function clearHistory(): void {
  cache = null; // 失效缓存，下次 load 重新读存储
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch { /* ignore */ }
}
