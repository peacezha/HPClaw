import { describe, expect, it } from 'vitest';
import { buildConversationTimeline } from './AIChat';
import type { Message } from '../App';

describe('buildConversationTimeline', () => {
  it('merges all execution messages of one turn into a single trace card', () => {
    const messages: Message[] = [
      { role: 'user', content: '查一下' },
      { role: 'assistant', content: '我先看下目录' },
      { role: 'system', content: '[AI 执行命令] ls' },
      { role: 'assistant', content: '目录里有这些' },
      { role: 'system', content: '[📋 call_web_api] ok' },
      { role: 'assistant', content: '结论如下' },
    ];
    const timeline = buildConversationTimeline(messages, 0);
    const traces = timeline.filter(item => item.type === 'execution');
    expect(traces).toHaveLength(1);
    expect(traces[0].type === 'execution' && traces[0].items).toHaveLength(2);
    // 大卡插在该轮首个执行项的位置（第一条 assistant 解说之后）
    expect(timeline[1].type).toBe('message');
    expect(timeline[2].type).toBe('execution');
  });

  it('starts a new trace card at the next user message', () => {
    const messages: Message[] = [
      { role: 'system', content: '[AI 执行命令] ls' },
      { role: 'user', content: '继续' },
      { role: 'system', content: '[AI 执行命令] pwd' },
    ];
    const timeline = buildConversationTimeline(messages, 0);
    const traces = timeline.filter(item => item.type === 'execution');
    expect(traces).toHaveLength(2);
  });

  it('keeps non-execution system notices inside the turn without splitting the card', () => {
    const messages: Message[] = [
      { role: 'system', content: '[AI 执行命令] ls' },
      { role: 'system', content: '作业 #123 已完成' },
      { role: 'system', content: '[📋 call_web_api] ok' },
    ];
    const timeline = buildConversationTimeline(messages, 0);
    const traces = timeline.filter(item => item.type === 'execution');
    expect(traces).toHaveLength(1);
    // 系统通知保持为独立消息，位置在卡后
    expect(timeline.some(item => item.type === 'message')).toBe(true);
  });
});
