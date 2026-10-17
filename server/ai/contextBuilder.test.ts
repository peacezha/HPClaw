// 长对话上下文自动压缩测试：临时数据目录（经 vi.mock('../paths') 注入）+ resetModules，
// 模拟独立进程启动/重启，避免模块级压缩缓存串扰。
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import type { CompactionSummarizeRequest } from './contextCompactor';
import type { AIMessage, StructuredMemory } from './types';

const { state } = vi.hoisted(() => ({ state: { tmpRoot: '' } }));

vi.mock('../paths', () => ({
  appPath: (...segments: string[]) => path.join(process.cwd(), ...segments),
  dataPath: (...segments: string[]) => path.join(state.tmpRoot, ...segments),
  ensureDir: (dir: string) => dir,
}));

// moonshot-v1-32k 窗口 32768：保留 15% 响应 + 800 开销后 conversation 实际预算 27052，
// 减去 2000 摘要预留 → 尾部窗口 25052 token。每条测试消息固定 1335 token（2000 个 CJK 字符）。
const TEST_MODEL = 'moonshot-v1-32k';

function makeMessages(count: number, startIndex = 0): AIMessage[] {
  return Array.from({ length: count }, (_, offset) => {
    const index = startIndex + offset;
    return { role: index % 2 === 0 ? 'user' : 'assistant', content: `${index}:${'汉'.repeat(2000)}` } as AIMessage;
  });
}

function fakeMemory(task: string, messages: AIMessage[]): StructuredMemory {
  return {
    task,
    progress: { phase: 1, description: '测试中', completed: messages.length },
    keyFacts: messages.map(message => ({
      category: 'data' as const,
      fact: `事实-${message.content.slice(0, 4)}`,
      timestamp: Date.now(),
    })),
    decisions: [],
    skillsUsed: [],
    errors: [],
    generatedAt: Date.now(),
  };
}

function recordingSummarizer(calls: CompactionSummarizeRequest[], impl?: (req: CompactionSummarizeRequest) => Promise<StructuredMemory | null>) {
  return async (req: CompactionSummarizeRequest) => {
    calls.push(req);
    return impl ? impl(req) : fakeMemory(`压缩${req.messages.length}条`, req.messages);
  };
}

async function freshBuilder() {
  state.tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'trace-context-builder-'));
  vi.resetModules();
  return import('./contextBuilder');
}

/** 同一数据目录“重启”：重置模块状态但保留磁盘缓存。 */
async function restartBuilder() {
  vi.resetModules();
  return import('./contextBuilder');
}

describe('buildSmartContext 自动压缩', () => {
  it('历史未超 conversation 预算时不触发压缩', async () => {
    const { buildSmartContext } = await freshBuilder();
    const calls: CompactionSummarizeRequest[] = [];
    const onCompacted = vi.fn();
    const messages = makeMessages(10);

    const result = await buildSmartContext({
      messages, mode: 'agent', model: TEST_MODEL, skipSkills: true,
      conversationId: 'conv-under', compactSummarize: recordingSummarizer(calls), onCompacted,
    });

    expect(calls).toHaveLength(0);
    expect(onCompacted).not.toHaveBeenCalled();
    expect(result).toHaveLength(11);
    expect(result[0].role).toBe('system');
    expect(result.slice(1).map(m => m.content)).toEqual(messages.map(m => m.content));
  });

  it('超预算时压缩最旧消息并把摘要注入历史最前面', async () => {
    const { buildSmartContext } = await freshBuilder();
    const calls: CompactionSummarizeRequest[] = [];
    const onCompacted = vi.fn();
    const messages = makeMessages(30);

    const result = await buildSmartContext({
      messages, mode: 'agent', model: TEST_MODEL, skipSkills: true,
      conversationId: 'conv-over', compactSummarize: recordingSummarizer(calls), onCompacted,
    });

    // 12 条最旧消息被挤出并压缩；摘要 system 消息紧跟主 system 之后
    expect(calls).toHaveLength(1);
    expect(calls[0].messages.map(m => m.content)).toEqual(messages.slice(0, 12).map(m => m.content));
    expect(result[1].role).toBe('system');
    expect(result[1].content).toContain('早期对话摘要');
    expect(result[1].content).toContain('压缩12条');
    // 尾部窗口原样保留，被压缩的消息不再出现
    expect(result[2].content.startsWith('12:')).toBe(true);
    expect(result.at(-1)!.content.startsWith('29:')).toBe(true);
    expect(result.some(m => m.content.startsWith('0:'))).toBe(false);
    expect(onCompacted).toHaveBeenCalledTimes(1);
    expect(onCompacted.mock.calls[0][0].count).toBe(12);
    expect(onCompacted.mock.calls[0][0].summaryChars).toBeGreaterThan(0);
  });

  it('相同溢出集合命中缓存：不再调用模型，且同一摘要版本只通知一次', async () => {
    const { buildSmartContext } = await freshBuilder();
    const calls: CompactionSummarizeRequest[] = [];
    const onCompacted = vi.fn();
    const messages = makeMessages(30);
    const input = {
      messages, mode: 'agent' as const, model: TEST_MODEL, skipSkills: true,
      conversationId: 'conv-cache', compactSummarize: recordingSummarizer(calls), onCompacted,
    };

    const first = await buildSmartContext(input);
    const second = await buildSmartContext(input);

    expect(calls).toHaveLength(1);
    expect(second[1].content).toBe(first[1].content);
    expect(onCompacted).toHaveBeenCalledTimes(1);
  });

  it('缓存随服务重启后仍从磁盘复用', async () => {
    const { buildSmartContext } = await freshBuilder();
    const messages = makeMessages(30);
    const firstCalls: CompactionSummarizeRequest[] = [];
    await buildSmartContext({
      messages, mode: 'agent', model: TEST_MODEL, skipSkills: true,
      conversationId: 'conv-disk', compactSummarize: recordingSummarizer(firstCalls),
    });
    expect(firstCalls).toHaveLength(1);

    const persisted = JSON.parse(await fs.readFile(path.join(state.tmpRoot, 'ai-context-compaction.json'), 'utf8'));
    expect(persisted.entries['conv-disk'].count).toBe(12);

    const restarted = await restartBuilder();
    const secondCalls: CompactionSummarizeRequest[] = [];
    const onCompacted = vi.fn();
    const result = await restarted.buildSmartContext({
      messages, mode: 'agent', model: TEST_MODEL, skipSkills: true,
      conversationId: 'conv-disk', compactSummarize: recordingSummarizer(secondCalls), onCompacted,
    });

    expect(secondCalls).toHaveLength(0);
    expect(result[1].content).toContain('早期对话摘要');
    // 磁盘缓存带回了 notifiedCount，重启后不重复打扰
    expect(onCompacted).not.toHaveBeenCalled();
  });

  it('对话变长后增量压缩：只把新增旧消息送入模型并合并到旧摘要', async () => {
    const { buildSmartContext } = await freshBuilder();
    const calls: CompactionSummarizeRequest[] = [];
    const onCompacted = vi.fn();
    const summarize = recordingSummarizer(calls);

    await buildSmartContext({
      messages: makeMessages(30), mode: 'agent', model: TEST_MODEL, skipSkills: true,
      conversationId: 'conv-incr', compactSummarize: summarize, onCompacted,
    });
    expect(calls[0].messages).toHaveLength(12);

    const grown = [...makeMessages(30), ...makeMessages(4, 30)];
    const result = await buildSmartContext({
      messages: grown, mode: 'agent', model: TEST_MODEL, skipSkills: true,
      conversationId: 'conv-incr', compactSummarize: summarize, onCompacted,
    });

    // 溢出从 12 条增长到 16 条，只压缩新增 4 条
    expect(calls).toHaveLength(2);
    expect(calls[1].messages.map(m => m.content)).toEqual(grown.slice(12, 16).map(m => m.content));
    expect(result[1].content).toContain('已自动压缩 16 条');
    // 合并保留了第一批摘要里的事实
    expect(result[1].content).toContain('事实-0:');
    expect(onCompacted).toHaveBeenCalledTimes(2);
    expect(onCompacted.mock.calls[1][0].count).toBe(16);
  });

  it('压缩失败时回退为旧的截断行为', async () => {
    const { buildSmartContext } = await freshBuilder();
    const onCompacted = vi.fn();
    const messages = makeMessages(30);

    const result = await buildSmartContext({
      messages, mode: 'agent', model: TEST_MODEL, skipSkills: true,
      conversationId: 'conv-fail', compactSummarize: recordingSummarizer([], async () => null), onCompacted,
    });

    expect(result.some(m => m.content.includes('早期对话摘要'))).toBe(false);
    // 旧截断用完整预算 27052：保留最新 20 条
    expect(result).toHaveLength(21);
    expect(result[1].content.startsWith('10:')).toBe(true);
    expect(onCompacted).not.toHaveBeenCalled();
  });

  it('压缩超时本轮截断，后台完成后下一轮直接命中缓存并补一次通知', async () => {
    const { buildSmartContext } = await freshBuilder();
    const calls: CompactionSummarizeRequest[] = [];
    const onCompacted = vi.fn();
    const messages = makeMessages(30);
    const input = {
      messages, mode: 'agent' as const, model: TEST_MODEL, skipSkills: true,
      conversationId: 'conv-slow', compactionTimeoutMs: 20, onCompacted,
      compactSummarize: recordingSummarizer(calls, async req => {
        await new Promise(resolve => setTimeout(resolve, 120));
        return fakeMemory('慢速压缩', req.messages);
      }),
    };

    const first = await buildSmartContext(input);
    expect(first.some(m => m.content.includes('早期对话摘要'))).toBe(false);
    expect(onCompacted).not.toHaveBeenCalled();

    await new Promise(resolve => setTimeout(resolve, 200));

    const second = await buildSmartContext(input);
    expect(calls).toHaveLength(1);
    expect(second[1].content).toContain('慢速压缩');
    expect(onCompacted).toHaveBeenCalledTimes(1);
    expect(onCompacted.mock.calls[0][0].count).toBe(12);
  });

  it('缺少 conversationId 或压缩执行器时保持旧的截断行为', async () => {
    const { buildSmartContext } = await freshBuilder();
    const calls: CompactionSummarizeRequest[] = [];
    const messages = makeMessages(30);

    const withoutId = await buildSmartContext({
      messages, mode: 'agent', model: TEST_MODEL, skipSkills: true,
      compactSummarize: recordingSummarizer(calls),
    });
    const withoutSummarizer = await buildSmartContext({
      messages, mode: 'agent', model: TEST_MODEL, skipSkills: true,
      conversationId: 'conv-noop',
    });

    expect(calls).toHaveLength(0);
    for (const result of [withoutId, withoutSummarizer]) {
      expect(result).toHaveLength(21);
      expect(result[1].content.startsWith('10:')).toBe(true);
    }
  });
});
