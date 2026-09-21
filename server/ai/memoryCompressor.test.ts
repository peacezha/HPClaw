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

  it('parses compression result JSON into StructuredMemory', () => {
    const compressor = new MemoryCompressor();
    const result = compressor.parseCompressionResult(JSON.stringify({
      task: 'RNA-seq QC',
      progress: { phase: 1, description: 'Running fastp', completed: 50, total: 100 },
      keyFacts: [{ category: 'data', fact: '100 FASTQ files' }],
      decisions: [{ what: 'Use fastp', why: 'Recommended by manual' }],
      skillsUsed: ['qc'],
      errors: [],
    }));

    expect(result).not.toBeNull();
    expect(result!.task).toBe('RNA-seq QC');
    expect(result!.progress.completed).toBe(50);
    expect(result!.keyFacts[0].fact).toBe('100 FASTQ files');
  });

  it('merges new memory with existing, deduplicating facts', () => {
    const compressor = new MemoryCompressor();
    const existing = {
      task: 'RNA-seq',
      progress: { phase: 1, description: 'QC', completed: 0 },
      keyFacts: [{ category: 'data' as const, fact: '100 FASTQ files', timestamp: 1 }],
      decisions: [{ what: 'Use fastp', why: 'Manual recommendation' }],
      skillsUsed: ['qc'],
      errors: [],
      generatedAt: 1,
    };

    const incoming = {
      task: 'RNA-seq',
      progress: { phase: 2, description: 'Alignment', completed: 45, total: 100 },
      keyFacts: [
        { category: 'environment' as const, fact: 'Working dir: /home/rnaseq/', timestamp: 2 },
        { category: 'data' as const, fact: '100 FASTQ files', timestamp: 2 }, // duplicate
      ],
      decisions: [{ what: 'Use STAR', why: 'User preference' }],
      skillsUsed: ['alignment'],
      errors: [],
      generatedAt: 2,
    };

    const merged = compressor.mergeMemories(existing, incoming);
    expect(merged.keyFacts.length).toBe(2); // deduplicated
    expect(merged.decisions.length).toBe(2);
    expect(merged.skillsUsed).toContain('qc');
    expect(merged.skillsUsed).toContain('alignment');
    expect(merged.progress.completed).toBe(45); // updated
  });
});
