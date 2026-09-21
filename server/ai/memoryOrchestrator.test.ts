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

  it('returns null when no memory is set', () => {
    const orchestrator = new MemoryOrchestrator();
    expect(orchestrator.getShortTerm()).toBeNull();
    expect(orchestrator.getFactsByCategory('data')).toEqual([]);
  });

  it('clears memory', () => {
    const orchestrator = new MemoryOrchestrator();
    orchestrator.setShortTerm(makeMemory());
    orchestrator.clear();
    expect(orchestrator.getShortTerm()).toBeNull();
  });
});

describe('formatMemoryForAI', () => {
  it('formats memory for AI context', () => {
    const mem = makeMemory();
    const formatted = formatMemoryForAI(mem);
    expect(formatted).toContain('RNA-seq');
    expect(formatted).toContain('STAR alignment');
    expect(formatted).toContain('45');
    expect(formatted).toContain('hg38');
    expect(formatted).toContain('STAR instead of HISAT2');
  });

  it('returns empty string for null memory', () => {
    expect(formatMemoryForAI(null)).toBe('');
  });
});
