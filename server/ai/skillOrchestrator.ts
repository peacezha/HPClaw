import type { BibleChunk, SkillIndex, SkillKnowledgePack, SkillMetadata, SkillSnippet } from './types';
import { SkillGraphInstance } from './skillGraph';
import { searchBibleChunks, searchSkillIndex } from './skillIndex';
import { estimateTokens } from './tokenBudget';

export interface BuildPackInput {
  userQuery: string;
  clusterHints: string[];
  planHints: string[];
  memoryHints: string[];
  tokenBudget: number;
}

export class SkillOrchestrator {
  constructor(
    private index: SkillIndex,
    private graph: SkillGraphInstance,
    private bibleChunks: BibleChunk[],
  ) {}

  buildPack(input: BuildPackInput): SkillKnowledgePack {
    const budget = input.tokenBudget;

    const allHints = [
      input.userQuery,
      ...input.clusterHints,
      ...input.planHints,
      ...input.memoryHints,
    ].filter(Boolean);

    // 单个描述/正文中的泛词命中（2~4 分）不足以加载整份技能。
    // 这能避免“你好/你能做什么”之类普通对话误挂载数万字生信技能。
    const entrySkills = searchSkillIndex(this.index, allHints.join(' '), 4)
      .filter(skill => (skill.score ?? 0) >= 8);

    if (entrySkills.length === 0) {
      return {
        core: null,
        dependencies: [],
        related: [],
        // 没有明确技能命中时不要塞入“技能手册的前三章”。普通寒暄和简单问答
        // 因此保持轻量；真正的领域查询会由文件名/名称/标签达到上面的阈值。
        bible: [],
        totalTokens: 0,
      };
    }

    const coreSkill = entrySkills[0];
    const expanded = this.graph.expandFromSkill(coreSkill.filename, {
      maxHops: 2,
      minWeight: 5,
      maxSkills: 8,
    });

    const coreEdges = this.graph.getEdges(coreSkill.filename);
    const dependsOnTargets = new Set(
      coreEdges.filter(e => e.relation === 'depends_on').map(e => e.to)
    );
    const relatedTargets = new Set(
      coreEdges.filter(e => e.relation !== 'depends_on').map(e => e.to)
    );

    const dependencies: SkillMetadata[] = [];
    const related: SkillMetadata[] = [];

    for (const skill of expanded) {
      if (skill.filename === coreSkill.filename) continue;
      if (dependsOnTargets.has(skill.filename)) {
        dependencies.push(skill);
      } else if (relatedTargets.has(skill.filename)) {
        related.push(skill);
      }
    }

    const coreBudget = Math.floor(budget * 0.35);
    const depBudget = Math.floor(budget * 0.25);
    const relBudget = Math.floor(budget * 0.15);
    const bibleBudget = Math.floor(budget * 0.25);

    const core = this.toSnippet(coreSkill, coreBudget);
    const depSnippets = this.toSnippets(dependencies, depBudget);
    const relSnippets = this.toSnippets(related, relBudget);
    const bible = this.searchBible(input.userQuery, bibleBudget);

    const totalTokens = (core?.tokenCount ?? 0) +
      depSnippets.reduce((s, sn) => s + sn.tokenCount, 0) +
      relSnippets.reduce((s, sn) => s + sn.tokenCount, 0) +
      bible.reduce((s, b) => s + b.tokenCount, 0);

    return { core, dependencies: depSnippets, related: relSnippets, bible, totalTokens };
  }

  private toSnippet(skill: SkillMetadata, maxTokens: number): SkillSnippet | null {
    const content = this.trimToTokens(skill.content, maxTokens);
    return {
      skillFile: skill.filename,
      source: skill.source,
      content,
      tokenCount: estimateTokens(content),
      relevanceScore: skill.score ?? 0,
    };
  }

  private toSnippets(skills: SkillMetadata[], maxTokens: number): SkillSnippet[] {
    const perSkill = Math.floor(maxTokens / Math.max(1, skills.length));
    return skills.map(s => this.toSnippet(s, perSkill)).filter(Boolean) as SkillSnippet[];
  }

  private searchBible(query: string, maxTokens: number): BibleChunk[] {
    const results = searchBibleChunks(this.bibleChunks, query, 3);
    let used = 0;
    const out: BibleChunk[] = [];
    for (const chunk of results) {
      if (used + chunk.tokenCount > maxTokens) break;
      out.push(chunk);
      used += chunk.tokenCount;
    }
    return out;
  }

  trimToTokens(text: string, maxTokens: number): string {
    if (!text) return '';
    const body = text.replace(/^---[\s\S]*?---\s*/, '').trim();
    if (estimateTokens(body) <= maxTokens) return body;
    const chars = Math.floor(maxTokens * 4);
    return body.slice(0, chars) + '\n...[truncated for token budget]';
  }
}
