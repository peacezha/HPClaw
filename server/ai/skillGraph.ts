import matter from 'gray-matter';
import type { SkillEdge, SkillGraph, SkillMetadata, SkillRelation } from './types';

const RELATION_WEIGHTS: Record<SkillRelation, number> = {
  'depends_on': 10,
  'solves': 9,
  'used_with': 7,
  'related_to': 6,
  'triggers': 5,
};

export function extractRelations(skill: SkillMetadata): SkillEdge[] {
  const edges: SkillEdge[] = [];
  const metadataRelations: Array<[SkillRelation, string[] | undefined]> = [
    ['depends_on', skill.dependsOn],
    ['related_to', skill.relatedTo],
    ['used_with', skill.usedWith],
    ['solves', skill.solves],
  ];
  const hasParsedMetadata = metadataRelations.some(([, values]) => values !== undefined);

  if (hasParsedMetadata) {
    for (const [relation, values] of metadataRelations) {
      for (const target of values ?? []) {
        if (!target) continue;
        edges.push({
          from: skill.filename,
          to: target,
          relation,
          weight: RELATION_WEIGHTS[relation],
          reason: `${skill.filename} ${relation.replace(/_/g, ' ')} ${target}`,
        });
      }
    }
    return edges;
  }

  try {
    const parsed = matter(skill.content);
    const front = parsed.data as Record<string, any>;

    const relationFields: SkillRelation[] = ['depends_on', 'related_to', 'used_with', 'solves'];
    for (const field of relationFields) {
      const value = front[field];
      if (!value) continue;
      const targets = Array.isArray(value) ? value : String(value).split(',').map((s: string) => s.trim());
      for (const target of targets) {
        if (!target) continue;
        edges.push({
          from: skill.filename,
          to: target,
          relation: field,
          weight: RELATION_WEIGHTS[field],
          reason: `${skill.filename} ${field.replace(/_/g, ' ')} ${target}`,
        });
      }
    }
  } catch {
    // Skill has no frontmatter or invalid — skip
  }
  return edges;
}

export class SkillGraphBuilder {
  static build(skills: SkillMetadata[], extraEdges: SkillEdge[] = []): SkillGraphInstance {
    const nodes = new Map<string, SkillMetadata>();
    const adjacency = new Map<string, SkillEdge[]>();
    const edges: SkillEdge[] = [];

    for (const skill of skills) {
      nodes.set(skill.filename, skill);
    }

    const aliases = new Map<string, string>();
    for (const [filename, skill] of nodes) {
      aliases.set(filename.toLowerCase(), filename);
      const shortFilename = filename.split('/').pop();
      if (shortFilename && !aliases.has(shortFilename.toLowerCase())) {
        aliases.set(shortFilename.toLowerCase(), filename);
      }
      aliases.set(skill.name.toLowerCase(), filename);
    }

    const resolveTarget = (target: string): string | null => {
      if (nodes.has(target)) return target;
      return aliases.get(target.toLowerCase()) ?? null;
    };

    for (const skill of skills) {
      const relEdges = extractRelations(skill);
      for (const edge of relEdges) {
        const resolvedTo = resolveTarget(edge.to);
        if (resolvedTo) {
          const resolvedEdge: SkillEdge = { ...edge, to: resolvedTo };
          edges.push(resolvedEdge);
          const existing = adjacency.get(resolvedEdge.from) ?? [];
          existing.push(resolvedEdge);
          adjacency.set(resolvedEdge.from, existing);
        }
      }
    }

    for (const edge of extraEdges) {
      const resolvedTo = resolveTarget(edge.to);
      if (resolvedTo) {
        const resolvedEdge: SkillEdge = { ...edge, to: resolvedTo };
        edges.push(resolvedEdge);
        const existing = adjacency.get(resolvedEdge.from) ?? [];
        existing.push(resolvedEdge);
        adjacency.set(resolvedEdge.from, existing);
      }
    }

    return new SkillGraphInstance(nodes, edges, adjacency);
  }
}

export interface ExpandOptions {
  maxHops: number;
  relations?: SkillRelation[];
  minWeight?: number;
  maxSkills: number;
}

export class SkillGraphInstance implements SkillGraph {
  constructor(
    public nodes: Map<string, SkillMetadata>,
    public edges: SkillEdge[],
    public adjacency: Map<string, SkillEdge[]>,
  ) {}

  expandFromSkill(filename: string, options: ExpandOptions): SkillMetadata[] {
    const visited = new Set<string>();
    const result: SkillMetadata[] = [];
    const queue: { filename: string; hop: number; weight: number }[] = [
      { filename, hop: 0, weight: 10 },
    ];

    while (queue.length > 0 && result.length < options.maxSkills) {
      const current = queue.shift()!;
      if (visited.has(current.filename)) continue;
      if (current.hop > options.maxHops) continue;

      const skill = this.nodes.get(current.filename);
      if (!skill) continue;

      visited.add(current.filename);
      result.push(skill);

      const neighbors = this.adjacency.get(current.filename) ?? [];
      const filtered = neighbors.filter(e => {
        if (options.relations && !options.relations.includes(e.relation)) return false;
        if (options.minWeight && e.weight < options.minWeight) return false;
        return true;
      });

      filtered.sort((a, b) => b.weight - a.weight);

      for (const edge of filtered) {
        if (!visited.has(edge.to)) {
          queue.push({ filename: edge.to, hop: current.hop + 1, weight: edge.weight });
        }
      }
    }

    return result;
  }

  expandFromHints(hints: string[], options: ExpandOptions): SkillMetadata[] {
    const allResults = new Map<string, SkillMetadata>();

    for (const hint of hints) {
      const matching = this.searchByHint(hint);
      for (const skill of matching) {
        const expanded = this.expandFromSkill(skill.filename, {
          ...options,
          maxSkills: Math.ceil(options.maxSkills / hints.length),
        });
        for (const s of expanded) {
          allResults.set(s.filename, s);
        }
      }
    }

    return [...allResults.values()].slice(0, options.maxSkills);
  }

  private searchByHint(hint: string): SkillMetadata[] {
    const lower = hint.toLowerCase();
    const results: { skill: SkillMetadata; score: number }[] = [];

    for (const skill of this.nodes.values()) {
      let score = 0;
      if (skill.filename.toLowerCase().includes(lower)) score += 8;
      if (skill.name.toLowerCase().includes(lower)) score += 7;
      if (skill.tags.some(t => t.toLowerCase().includes(lower))) score += 6;
      if (skill.description.toLowerCase().includes(lower)) score += 4;
      if (skill.solves?.some(s => s.toLowerCase().includes(lower))) score += 5;

      if (score > 0) results.push({ skill, score });
    }

    return results.sort((a, b) => b.score - a.score).map(r => r.skill);
  }

  getNode(filename: string): SkillMetadata | undefined {
    return this.nodes.get(filename);
  }

  getEdges(filename: string): SkillEdge[] {
    return this.adjacency.get(filename) ?? [];
  }
}
