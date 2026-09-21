import { describe, expect, it } from 'vitest';
import {
  buildOutgoingMessages,
  findLatestAgentPlanCheckpoint,
  latestUserMessage,
  prepareMessagesForAiTransport,
  upsertAgentPlanCheckpoint,
} from './chatFlow';

describe('chat flow helpers', () => {
  it('appends manual user input to the outgoing AI request history', () => {
    const messages = [
      { role: 'user' as const, content: '第一轮问题' },
      { role: 'assistant' as const, content: '第一轮回答' },
    ];

    expect(buildOutgoingMessages(messages, '第二轮问题', true)).toEqual([
      ...messages,
      { role: 'user', content: '第二轮问题' },
    ]);
  });

  it('uses existing history for external triggers without duplicating the last user message', () => {
    const messages = [
      { role: 'assistant' as const, content: '上一轮回答' },
      { role: 'user' as const, content: '帮我解释终端输出' },
    ];

    expect(buildOutgoingMessages(messages, '帮我解释终端输出', false)).toEqual(messages);
  });

  it('finds the latest non-empty user message', () => {
    expect(latestUserMessage([
      { role: 'user', content: '第一轮' },
      { role: 'assistant', content: '回答' },
      { role: 'user', content: '  ' },
      { role: 'user', content: '第二轮' },
    ])).toEqual({ role: 'user', content: '第二轮' });
  });
  it('compacts AI transport history by keeping tool logs truncated and the latest user request', () => {
    const largeText = 'generated lsf script\n'.repeat(800);
    const messages = [
      { role: 'user' as const, content: 'please generate lsf scripts' },
      { role: 'system' as const, content: '[tool_call run_command] {"command":"cat > 01_bwa_index.lsf"}' },
      { role: 'system' as const, content: `[tool_result run_command] ${largeText}` },
      { role: 'assistant' as const, content: largeText },
      { role: 'user' as const, content: 'check these lsf files and leave paths blank' },
    ];

    const prepared = prepareMessagesForAiTransport(messages);
    const serialized = JSON.stringify({ messages: prepared });

    expect(prepared.at(-1)).toEqual({
      role: 'user',
      content: 'check these lsf files and leave paths blank',
    });
    // 工具历史保留（截断后），供模型跨轮参考
    expect(prepared.some(message => message.content.includes('run_command'))).toBe(true);
    expect(serialized.length).toBeLessThan(21_000);
    expect(prepared.some(message => message.content.includes('truncated for transport'))).toBe(true);
  });

  it('persists one hidden Agent plan and restores it after reopening a conversation', () => {
    const first = { goal: '完成分析', steps: [{ id: '1', title: '质控', verification: '检查报告', status: 'running' }] };
    const updated = { ...first, steps: [{ ...first.steps[0], status: 'waiting', summary: '等待作业' }] };
    let messages = upsertAgentPlanCheckpoint([{ role: 'user', content: '开始分析' }], first);
    messages = upsertAgentPlanCheckpoint(messages, updated);

    expect(messages.filter(message => message.content.startsWith('[HPCLAW_AGENT_PLAN]')).length).toBe(1);
    expect(findLatestAgentPlanCheckpoint(messages)).toEqual(updated);
    expect(prepareMessagesForAiTransport(messages).some(message => message.content.includes('HPCLAW_AGENT_PLAN'))).toBe(false);
    expect(upsertAgentPlanCheckpoint(messages, null)).toEqual([{ role: 'user', content: '开始分析' }]);
  });
});
