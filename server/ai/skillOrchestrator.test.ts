import { describe, expect, it } from 'vitest';
import { SkillOrchestrator } from './skillOrchestrator';
import { SkillGraphBuilder } from './skillGraph';
import { buildBibleChunks } from './skillIndex';
import type { SkillIndex, SkillMetadata } from './types';

function makeSkill(overrides: Partial<SkillMetadata>): SkillMetadata {
  return {
    filename: 'test',
    name: 'Test',
    description: '',
    tags: [],
    category: 'system',
    content: '---\nname: Test\n---\n# Content',
    excerpt: '# Content',
    size: 100,
    isSystem: false,
    source: 'system',
    sourcePath: '/fake/test.md',
    ...overrides,
  };
}

describe('SkillOrchestrator', () => {
  it('builds a knowledge pack from query with graph expansion', () => {
    const skills = [
      makeSkill({
        filename: 'bio/rnaseq',
        name: 'RNA-seq',
        description: 'RNA-seq transcriptome analysis',
        content: '---\nname: RNA-seq\ndepends_on: [alignment, qc]\n---\n# RNA-seq pipeline\n## 差异表达\nDESeq2 analysis steps...',
      }),
      makeSkill({
        filename: 'bio/alignment',
        name: 'Alignment',
        content: '---\nname: Alignment\n---\n# Alignment\nSTAR parameters: --runThreadN 8-12',
      }),
      makeSkill({
        filename: 'bio/qc',
        name: 'QC',
        content: '---\nname: QC\n---\n# QC\nfastp -w 4-8',
      }),
    ];

    const index: SkillIndex = { generatedAt: new Date().toISOString(), skills };
    const graph = SkillGraphBuilder.build(skills);
    const bibleChunks = buildBibleChunks('---\nname: bible\n---\n## 总则\nRules\n## 软件推荐\nSTAR: 8-12 cores');

    const orchestrator = new SkillOrchestrator(index, graph, bibleChunks);
    const pack = orchestrator.buildPack({
      userQuery: '帮我做RNA-seq差异表达',
      clusterHints: [],
      planHints: [],
      memoryHints: [],
      tokenBudget: 50000,
    });

    expect(pack.core).not.toBeNull();
    expect(pack.core!.skillFile).toBe('bio/rnaseq');
    expect(pack.dependencies.length).toBeGreaterThan(0);
    expect(pack.bible.length).toBeGreaterThan(0);
    expect(pack.totalTokens).toBeGreaterThan(0);
    expect(pack.totalTokens).toBeLessThanOrEqual(50000);
  });

  it('uses cluster hints to prioritize skills', () => {
    const skills = [
      makeSkill({ filename: 'bio/alignment', name: 'Alignment', content: '---\nname: alignment\n---\n# Alignment' }),
      makeSkill({ filename: 'bio/qc', name: 'QC', content: '---\nname: qc\n---\n# QC' }),
    ];
    const index: SkillIndex = { generatedAt: new Date().toISOString(), skills };
    const graph = SkillGraphBuilder.build(skills);

    const orchestrator = new SkillOrchestrator(index, graph, []);
    const pack = orchestrator.buildPack({
      userQuery: '分析数据',
      clusterHints: ['alignment'],
      planHints: [],
      memoryHints: [],
      tokenBudget: 10000,
    });

    expect(pack.core!.skillFile).toBe('bio/alignment');
  });

  it('keeps ordinary conversation free of unrelated skill manuals', () => {
    const skills = [
      makeSkill({
        filename: 'bio/rnaseq',
        name: 'RNA-seq',
        description: 'RNA-seq transcriptome analysis',
        content: '---\nname: RNA-seq\n---\n# RNA-seq pipeline',
      }),
    ];
    const index: SkillIndex = { generatedAt: new Date().toISOString(), skills };
    const orchestrator = new SkillOrchestrator(
      index,
      SkillGraphBuilder.build(skills),
      buildBibleChunks('## 总则\nA very large reference manual'),
    );

    const pack = orchestrator.buildPack({
      userQuery: '你好，请介绍自己',
      clusterHints: [],
      planHints: [],
      memoryHints: [],
      tokenBudget: 50000,
    });

    expect(pack.core).toBeNull();
    expect(pack.bible).toEqual([]);
    expect(pack.totalTokens).toBe(0);
  });
});
