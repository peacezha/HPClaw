import { describe, expect, it } from 'vitest';
import { SkillGraphBuilder, extractRelations } from './skillGraph';
import type { SkillMetadata } from './types';

function makeSkill(overrides: Partial<SkillMetadata> = {}): SkillMetadata {
  return {
    filename: 'test-skill',
    name: 'Test Skill',
    description: 'A test skill',
    tags: [],
    category: 'system',
    content: '---\nname: Test Skill\n---\n# Content',
    excerpt: '# Content',
    size: 100,
    isSystem: false,
    source: 'system',
    sourcePath: '/fake/test-skill.md',
    ...overrides,
  };
}

describe('extractRelations', () => {
  it('extracts depends_on and related_to from skill frontmatter', () => {
    const content = [
      '---',
      'name: rnaseq',
      'depends_on: [alignment, qc]',
      'related_to: [lsf-ncpgr, formats]',
      '---',
      '# RNA-seq',
    ].join('\n');

    const skill = makeSkill({ filename: 'bio/rnaseq', content });
    const relations = extractRelations(skill);

    expect(relations).toContainEqual({
      from: 'bio/rnaseq', to: 'alignment', relation: 'depends_on', weight: 10, reason: 'bio/rnaseq depends on alignment',
    });
    expect(relations).toContainEqual({
      from: 'bio/rnaseq', to: 'qc', relation: 'depends_on', weight: 10, reason: 'bio/rnaseq depends on qc',
    });
    expect(relations).toContainEqual({
      from: 'bio/rnaseq', to: 'lsf-ncpgr', relation: 'related_to', weight: 6, reason: 'bio/rnaseq related to lsf-ncpgr',
    });
  });
});

describe('SkillGraphBuilder', () => {
  it('builds graph from skill list and answers adjacency queries', () => {
    const skills = [
      makeSkill({
        filename: 'bio/rnaseq',
        content: '---\nname: rnaseq\ndepends_on: [alignment, qc]\nrelated_to: [lsf-ncpgr]\n---\n# RNA-seq',
      }),
      makeSkill({ filename: 'bio/alignment', content: '---\nname: alignment\n---\n# Alignment' }),
      makeSkill({ filename: 'bio/qc', content: '---\nname: qc\n---\n# QC' }),
      makeSkill({ filename: 'lsf-ncpgr', content: '---\nname: lsf\n---\n# LSF' }),
    ];

    const graph = SkillGraphBuilder.build(skills);
    const expanded = graph.expandFromSkill('bio/rnaseq', { maxHops: 1, maxSkills: 10 });
    const filenames = expanded.map(s => s.filename);
    expect(filenames).toContain('bio/rnaseq');
    expect(filenames).toContain('bio/alignment');
    expect(filenames).toContain('bio/qc');
    expect(filenames).toContain('lsf-ncpgr');
  });

  it('respects maxSkills limit', () => {
    const skills = [
      makeSkill({
        filename: 'hub',
        content: '---\nname: hub\ndepends_on: [a, b, c, d, e, f]\n---\n# Hub',
      }),
      ...['a','b','c','d','e','f'].map(name =>
        makeSkill({ filename: name, content: `---\nname: ${name}\n---\n# ${name}` })
      ),
    ];
    const graph = SkillGraphBuilder.build(skills);
    const expanded = graph.expandFromSkill('hub', { maxHops: 1, maxSkills: 3 });
    expect(expanded.length).toBeLessThanOrEqual(3);
  });
});
