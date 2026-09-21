import { describe, expect, it } from 'vitest';
import { TokenBudgetManager } from './tokenBudget';
import { fileRecognizer } from './fileRecognizer';
import { SkillGraphBuilder } from './skillGraph';
import { SkillOrchestrator } from './skillOrchestrator';
import { buildBibleChunks, loadOrRefreshSkillIndex } from './skillIndex';
import { MemoryCompressor } from './memoryCompressor';
import { MemoryOrchestrator, formatMemoryForAI } from './memoryOrchestrator';
import { AgentPlanner } from './agentPlanner';
import { ObservationStore } from './observationStore';
import path from 'path';

describe('Full AI pipeline integration', () => {
  it('end-to-end: cluster file detection → skill graph → orchestrator → memory', () => {
    // 1. Detect cluster files
    const files = fileRecognizer.analyzeList(
      ['sample_R1.fastq.gz', 'sample_R1.bam', 'myjob.lsf'],
      [5_000_000, 2_000_000_000, 1024],
      [Date.now(), Date.now(), Date.now()],
    );

    expect(files[0].type).toBe('fastq');
    expect(files[0].recognizedSkillHints).toContain('qc');
    expect(files[1].type).toBe('bam');
    expect(files[1].recognizedSkillHints).toContain('alignment');
    expect(files[2].type).toBe('lsf');

    // 2. Infer phase and collect skill hints
    const hints = fileRecognizer.inferPhase(files);
    expect(hints.skills).toContain('qc');
    expect(hints.skills).toContain('alignment');

    // 3. Build skill graph from real index
    const index = loadOrRefreshSkillIndex({
      skillsDir: path.join(process.cwd(), 'skills'),
      lsfSkillDir: path.join(process.cwd(), 'lsf_skills'),
    });

    const graph = SkillGraphBuilder.build(index.skills);
    expect(graph.nodes.size).toBeGreaterThan(0);

    // 4. Token budget
    const budget = new TokenBudgetManager('deepseek-v4-pro');
    const tokens = budget.request('skills', 25000);
    expect(tokens).toBe(25000);

    // 5. Bible chunks
    const bible = index.skills.find(s => s.filename === 'SKILL' || s.filename === 'SKILL.md');
    if (bible) {
      const chunks = buildBibleChunks(bible.content);
      expect(chunks.length).toBeGreaterThan(0);
    }

    // 6. Memory orchestrator
    const compressor = new MemoryCompressor();
    const compressionResult = compressor.parseCompressionResult(JSON.stringify({
      task: 'RNA-seq analysis',
      progress: { phase: 1, description: 'QC', completed: 0 },
      keyFacts: [{ category: 'data', fact: '100 FASTQ files' }],
      decisions: [{ what: 'Use fastp', why: 'Recommended by manual' }],
      skillsUsed: ['qc'],
      errors: [],
    }));
    expect(compressionResult).not.toBeNull();

    const memoryOrch = new MemoryOrchestrator();
    memoryOrch.setShortTerm(compressionResult!);
    const formatted = formatMemoryForAI(memoryOrch.getShortTerm()!);
    expect(formatted).toContain('RNA-seq');

    // 7. Agent planner
    const planner = new AgentPlanner();
    planner.setPlan({
      goal: 'RNA-seq QC',
      phases: [{
        id: 1,
        name: 'QC',
        status: 'pending',
        steps: [{ id: '1.1', description: 'fastp', status: 'pending', linkedSkills: ['qc'] }],
        linkedSkills: ['qc'],
        entryConditions: [],
      }],
      currentPhase: 0,
      createdAt: Date.now(),
    });
    expect(planner.currentPlan()).not.toBeNull();
    const phase = planner.activatePhase(1);
    expect(phase).not.toBeNull();
    planner.completePhase(1);
    expect(planner.allPhasesComplete()).toBe(true);

    // 8. Observation store
    const store = new ObservationStore();
    store.add({ type: 'command', data: 'fastp -i sample.fq', importance: 3, summary: 'QC started' });
    expect(store.count()).toBe(1);
    expect(store.summarize(100)).toContain('QC');
  });

  it('skill orchestrator with real skill index: transcriptome query', { timeout: 30000 }, () => {
    const index = loadOrRefreshSkillIndex({
      skillsDir: path.join(process.cwd(), 'skills'),
      lsfSkillDir: path.join(process.cwd(), 'lsf_skills'),
    });

    const graph = SkillGraphBuilder.build(index.skills);
    const bible = index.skills.find(s => s.filename === 'SKILL');
    const bibleChunks = bible ? buildBibleChunks(bible.content) : [];

    const orchestrator = new SkillOrchestrator(index, graph, bibleChunks);
    const pack = orchestrator.buildPack({
      userQuery: 'RNA-seq差异表达分析',
      clusterHints: ['qc', 'alignment', 'fastp'],
      planHints: [],
      memoryHints: [],
      tokenBudget: 20000,
    });

    // Should find relevant skills from the real index
    expect(pack.totalTokens).toBeGreaterThan(0);
    expect(pack.totalTokens).toBeLessThanOrEqual(20000);

    // Check that the pack has content (real skills exist)
    const hasContent = pack.core !== null ||
      pack.dependencies.length > 0 ||
      pack.related.length > 0;
    expect(hasContent).toBe(true);

    // Bible chunks should be found for this query
    const hasBible = pack.bible.length > 0;
    expect(hasBible).toBe(true);
  });
});
