import { describe, expect, it } from 'vitest';
import { buildStructuredConversationMemory, mergeConversationMemory, summarizeConversation } from './conversationMemory';

describe('conversation memory', () => {
  it('adds optional memory fields without dropping legacy conversation data', () => {
    const conversation = {
      id: 'c1',
      title: 'legacy',
      createdAt: '2026-06-12T00:00:00.000Z',
      updatedAt: '2026-06-12T00:00:00.000Z',
      clusterInfo: { host: 'hpc', username: 'u' },
      messages: [
        { role: 'user' as const, content: 'run fastqc' },
        { role: 'assistant' as const, content: '<execute>fastqc sample.fq</execute>' },
      ],
    };

    const updated = mergeConversationMemory(conversation);

    expect(updated.id).toBe('c1');
    expect(updated.clusterInfo.host).toBe('hpc');
    expect(updated.summary).toContain('run fastqc');
    expect(updated.memory).toContain('fastqc sample.fq');
  });

  it('summarizes compactly from recent useful turns', () => {
    const summary = summarizeConversation([
      { role: 'system', content: 'noise' },
      { role: 'user', content: 'check bjobs output and explain failures' },
      { role: 'assistant', content: 'Job failed because memory exceeded.' },
    ]);

    expect(summary).toContain('check bjobs output');
    expect(summary).toContain('memory exceeded');
    expect(summary.length).toBeLessThan(500);
  });

  it('refreshes stale memory fields from the current messages', () => {
    const updated = mergeConversationMemory({
      id: 'c2',
      title: 'updated',
      summary: 'old fastqc summary',
      memory: 'old fastqc memory',
      skillHints: ['fastqc'],
      messages: [
        { role: 'user', content: 'align reads with bwa mem' },
        { role: 'assistant', content: 'Use bsub with bwa mem and samtools sort.' },
      ],
    });

    expect(updated.summary).toContain('align reads with bwa mem');
    expect(updated.summary).not.toContain('old fastqc summary');
    expect(updated.memory).toContain('samtools sort');
    expect(updated.skillHints).not.toContain('fastqc');
    expect(updated.skillHints).toContain('samtools');
  });

  it('preserves the original goal, confirmed paths, job ids and recent progress in isolated memory', () => {
    const messages = [
      { role: 'user' as const, content: '在 /data/project-a 做 RNA-seq，输出放到 /data/project-a/results' },
      ...Array.from({ length: 12 }, (_, index) => ({
        role: (index % 2 === 0 ? 'assistant' : 'user') as 'assistant' | 'user',
        content: `普通中间消息 ${index}`,
      })),
      { role: 'assistant' as const, content: '已提交 Job <81234>，选择 normal 队列。' },
      { role: 'user' as const, content: '继续并保留线程数 16。' },
    ];

    const updated = mergeConversationMemory({ messages });

    expect(updated.summary).toContain('/data/project-a');
    expect(updated.memory).toContain('81234');
    expect(updated.memory).toContain('线程数 16');
    expect(updated.structuredMemory.task).toContain('RNA-seq');
    expect(updated.structuredMemory.keyFacts.some(fact => fact.fact.includes('81234'))).toBe(true);
  });

  it('does not invent a resolution for an unresolved error', () => {
    const memory = buildStructuredConversationMemory([
      { role: 'user', content: '任务报错 Permission denied' },
    ]);

    expect(memory.errors).toContainEqual(expect.objectContaining({
      resolution: '尚无已验证的解决记录',
    }));
  });
});
