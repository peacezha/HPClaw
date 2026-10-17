import crypto from 'node:crypto';
import fs from 'node:fs';
import { dataPath, ensureDir } from '../paths';
import { estimateTokens } from './tokenBudget';
import { MemoryCompressor } from './memoryCompressor';
import { formatMemoryForAI } from './memoryOrchestrator';
import type { AIMessage, StructuredMemory } from './types';

/**
 * 长对话上下文自动压缩：当历史超出 conversation 段实际预算时，
 * 保留填满预算的尾部窗口，把被挤出的最旧消息经 MemoryCompressor
 * 摘要为一段 system 消息注入历史最前面。
 *
 * 摘要是按 conversationId 缓存的（内存 Map + DATA_ROOT 落盘）：
 * 缓存条目以“已压缩消息数 + 首/末条内容哈希”为有效性键——
 * 对话只增不改时，新溢出的消息可以增量压缩并拼到旧摘要后，
 * 命中前缀一致时整段复用，不重复调用模型。
 *
 * 热路径保护：调用方最多等待 COMPACTION_AWAIT_TIMEOUT_MS；
 * 超时本轮回退为旧截断行为，压缩在后台继续，完成后写入缓存，
 * 下一轮对话直接命中（“上一轮结果先用”）。压缩失败同样回退截断。
 */

/** 本轮允许等待压缩模型返回的最长时间（超时回退截断，不阻塞对话）。 */
export const COMPACTION_AWAIT_TIMEOUT_MS = 6_000;
/** 尾部窗口预算 = conversation 实际预算 - 该预留，保证摘要注入后整体仍不超预算。 */
export const COMPACTION_SUMMARY_RESERVE_TOKENS = 2_000;
/** 注入前对格式化摘要的硬截断上限（防御合并后膨胀）。 */
const SUMMARY_MAX_TOKENS = 2_000;
const CACHE_FILE = 'ai-context-compaction.json';
const MAX_CACHE_ENTRIES = 100;

export interface CompactionSummarizeRequest {
  /** 需要摘要的旧消息（增量压缩时只有新增部分）。 */
  messages: AIMessage[];
  locale?: 'zh-CN' | 'en-US';
}

/** 压缩执行器：返回结构化记忆；失败返回 null（调用方回退截断）。 */
export type CompactionSummarizer = (req: CompactionSummarizeRequest) => Promise<StructuredMemory | null>;

export interface CompactionPlan {
  /** 填满预算的尾部窗口（最新消息）。 */
  kept: AIMessage[];
  /** 被预算挤出的最旧消息（待摘要）。 */
  overflow: AIMessage[];
}

export interface CompactionResolution {
  /** 注入用的格式化摘要文本。 */
  summaryText: string;
  /** 摘要一共覆盖了多少条早期消息。 */
  count: number;
  summaryChars: number;
  /** 本轮是否首次让该摘要版本生效（用于一次性 UI 通知）。 */
  notify: boolean;
}

interface CompactionEntry {
  /** summary 覆盖的消息数（相对当前溢出前缀）。 */
  count: number;
  firstHash: string;
  lastHash: string;
  memory: StructuredMemory;
  /** 已通知过的最大 count；只增不减，保证同一摘要版本只提示一次。 */
  notifiedCount: number;
  updatedAt: number;
}

const compressor = new MemoryCompressor();
const memoryCache = new Map<string, CompactionEntry>();
const inflight = new Map<string, Promise<CompactionEntry | null>>();
let diskLoaded = false;

const TIMEOUT = Symbol('compaction-timeout');

function hashMessage(message: AIMessage | undefined): string {
  return crypto.createHash('sha256').update(message?.content || '').digest('hex').slice(0, 16);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function clipSummaryText(text: string): string {
  if (estimateTokens(text) <= SUMMARY_MAX_TOKENS) return text;
  return `${text.slice(0, Math.floor(SUMMARY_MAX_TOKENS * 3.5))}\n...[truncated]`;
}

function isValidEntry(value: any): value is CompactionEntry {
  return Boolean(value)
    && typeof value.count === 'number' && value.count >= 1
    && typeof value.firstHash === 'string' && typeof value.lastHash === 'string'
    && value.memory && Array.isArray(value.memory.keyFacts) && Array.isArray(value.memory.decisions);
}

function loadDiskCache(): void {
  if (diskLoaded) return;
  diskLoaded = true;
  try {
    const parsed = JSON.parse(fs.readFileSync(dataPath(CACHE_FILE), 'utf8'));
    for (const [key, value] of Object.entries(parsed?.entries || {})) {
      if (isValidEntry(value)) {
        memoryCache.set(key, { ...value, notifiedCount: Number((value as CompactionEntry).notifiedCount) || 0 });
      }
    }
  } catch { /* 缓存不存在或损坏时静默忽略，下次写入会重建 */ }
}

function saveDiskCache(): void {
  try {
    ensureDir(dataPath(''));
    const entries = [...memoryCache.entries()]
      .sort((a, b) => b[1].updatedAt - a[1].updatedAt)
      .slice(0, MAX_CACHE_ENTRIES);
    memoryCache.clear();
    for (const [key, value] of entries) memoryCache.set(key, value);
    fs.writeFileSync(dataPath(CACHE_FILE), JSON.stringify({ version: 1, entries: Object.fromEntries(entries) }), { mode: 0o600 });
  } catch { /* 落盘失败不影响主流程 */ }
}

/**
 * 超预算时把历史切成“尾部保留窗口 + 被挤出的最旧消息”。
 * 切分语义与 trimConversationByTokens 一致（从尾部装满，至少留一条），
 * 只是窗口预算预留了摘要空间。未超预算或不值得压缩时返回 null。
 */
export function planConversationCompaction(
  messages: AIMessage[],
  maxTokens: number,
  reserveTokens: number = COMPACTION_SUMMARY_RESERVE_TOKENS,
): CompactionPlan | null {
  if (messages.length < 2) return null;
  let total = 0;
  for (const message of messages) total += estimateTokens(message.content || '');
  if (total <= maxTokens) return null;

  const keptLimit = maxTokens - reserveTokens;
  if (keptLimit <= 0) return null;

  const keptReversed: AIMessage[] = [];
  let used = 0;
  let splitIndex = messages.length;
  for (let i = messages.length - 1; i >= 0; i--) {
    const tokens = estimateTokens(messages[i].content || '');
    if (used + tokens > keptLimit && keptReversed.length > 0) {
      splitIndex = i + 1;
      break;
    }
    keptReversed.push(messages[i]);
    used += tokens;
  }
  if (splitIndex <= 0 || splitIndex >= messages.length) return null;
  return { kept: keptReversed.reverse(), overflow: messages.slice(0, splitIndex) };
}

function toResolution(entry: CompactionEntry): CompactionResolution {
  const summaryText = clipSummaryText(formatMemoryForAI(entry.memory));
  const notify = entry.count > entry.notifiedCount;
  if (notify) {
    entry.notifiedCount = entry.count;
    saveDiskCache();
  }
  return { summaryText, count: entry.count, summaryChars: summaryText.length, notify };
}

/**
 * 为被挤出的旧消息解析摘要：纯缓存命中不调用模型；
 * 前缀一致但变长时只压缩新增部分并合并到旧摘要；
 * 否则全量压缩。最多等待 timeoutMs，超时/失败返回 null（调用方回退截断），
 * 在途压缩继续后台完成并写缓存，供下一轮直接使用。
 */
export async function resolveConversationCompaction(options: {
  conversationId: string;
  overflow: AIMessage[];
  summarize: CompactionSummarizer;
  timeoutMs?: number;
  locale?: 'zh-CN' | 'en-US';
}): Promise<CompactionResolution | null> {
  const { conversationId, overflow, summarize, locale } = options;
  if (!conversationId || overflow.length === 0) return null;
  loadDiskCache();

  const entry = memoryCache.get(conversationId);
  const firstHash = hashMessage(overflow[0]);
  const lastHash = hashMessage(overflow[overflow.length - 1]);
  // 有效性键 = 已压缩数量 + 首/末条内容哈希：前缀一致才允许复用/增量。
  const reusable = entry
    && entry.count >= 1
    && entry.count <= overflow.length
    && entry.firstHash === firstHash
    && entry.lastHash === hashMessage(overflow[entry.count - 1]);

  if (reusable && entry.count === overflow.length) {
    return toResolution(entry);
  }

  // 同一会话已有压缩在途：本轮直接回退截断，等在途结果写缓存。
  if (inflight.has(conversationId)) return null;

  const baseCount = reusable ? entry.count : 0;
  const previousMemory = reusable ? entry.memory : undefined;
  const notifiedCount = reusable ? entry.notifiedCount : 0;
  const newMessages = overflow.slice(baseCount);

  const task = (async (): Promise<CompactionEntry | null> => {
    try {
      const incoming = await summarize({ messages: newMessages, locale });
      if (!incoming) return null;
      const memory = previousMemory
        ? compressor.mergeMemories(previousMemory, incoming)
        : incoming;
      const next: CompactionEntry = {
        count: overflow.length,
        firstHash,
        lastHash,
        memory,
        notifiedCount,
        updatedAt: Date.now(),
      };
      memoryCache.set(conversationId, next);
      saveDiskCache();
      return next;
    } catch {
      return null;
    } finally {
      inflight.delete(conversationId);
    }
  })();
  inflight.set(conversationId, task);

  // 超时不等：本轮由调用方回退截断；任务在后台继续，完成后已写入缓存。
  // 注意通知标记只在摘要真正注入对话的那一轮（toResolution）才消耗。
  const winner = await Promise.race<CompactionEntry | null | typeof TIMEOUT>([
    task,
    sleep(Math.max(1, options.timeoutMs ?? COMPACTION_AWAIT_TIMEOUT_MS)).then(() => TIMEOUT),
  ]);
  if (winner === TIMEOUT || !winner) return null;
  return toResolution(winner);
}
