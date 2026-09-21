import type { ObservationEntry } from './types';

let nextId = 0;

export class ObservationStore {
  private observations: ObservationEntry[] = [];
  private maxCount: number;

  constructor(maxCount = 500) {
    this.maxCount = maxCount;
  }

  add(obs: ObservationEntry): void {
    obs.id = obs.id ?? `obs_${++nextId}_${Date.now()}`;
    obs.timestamp = obs.timestamp ?? new Date().toISOString();
    this.observations.push(obs);
    if (this.observations.length > this.maxCount) {
      this.observations.sort((a, b) => (b.importance ?? 1) - (a.importance ?? 1));
      this.observations = this.observations.slice(0, this.maxCount);
    }
  }

  recent(filters: {
    importance?: number[];
    types?: string[];
    limit?: number;
  } = {}): ObservationEntry[] {
    let result = [...this.observations];

    if (filters.importance) {
      result = result.filter(o => filters.importance!.includes(o.importance ?? 1));
    }
    if (filters.types) {
      result = result.filter(o => filters.types!.includes(o.type));
    }

    result.sort((a, b) => (b.importance ?? 1) - (a.importance ?? 1));
    result = result.slice(-(filters.limit ?? 20));

    return result;
  }

  count(): number {
    return this.observations.length;
  }

  summarize(maxChars: number): string {
    const key = this.recent({ importance: [2, 3], limit: 10 });
    if (key.length === 0) return '';

    const lines = key.map(o => {
      const skillTag = o.relatedSkills?.length ? ` [技能: ${o.relatedSkills.join(', ')}]` : '';
      const content = o.summary ? `${o.summary} (${o.data.slice(0, 120)})` : o.data.slice(0, 120);
      return `- [${o.type}] ${content}${skillTag}`;
    });

    const joined = lines.join('\n');
    return joined.length > maxChars ? joined.slice(0, maxChars) + '...' : joined;
  }

  getAll(): ObservationEntry[] {
    return [...this.observations];
  }

  clear(): void {
    this.observations = [];
  }
}

export const globalObservationStore = new ObservationStore();
