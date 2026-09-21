import type { KeyFact, StructuredMemory } from './types';

export function formatMemoryForAI(memory: StructuredMemory | null): string {
  if (!memory) return '';

  const lines: string[] = [];
  lines.push('## 当前任务状态');

  if (memory.task) {
    lines.push(`**任务**: ${memory.task}`);
  }

  const p = memory.progress;
  if (p.description) {
    const totalStr = p.total ? `/${p.total}` : '';
    lines.push(`**进度**: 阶段${p.phase} — ${p.description} (${p.completed}${totalStr})`);
  }

  if (memory.keyFacts.length > 0) {
    lines.push('\n### 关键事实');
    for (const f of memory.keyFacts.slice(0, 12)) {
      lines.push(`- [${f.category}] ${f.fact}`);
    }
  }

  if (memory.decisions.length > 0) {
    lines.push('\n### 决策记录');
    for (const d of memory.decisions.slice(0, 5)) {
      lines.push(`- ${d.what}: ${d.why}`);
    }
  }

  if (memory.skillsUsed.length > 0) {
    lines.push(`\n### 已使用的技能\n${memory.skillsUsed.join(', ')}`);
  }

  if (memory.errors.length > 0) {
    lines.push('\n### 遇到的错误');
    for (const e of memory.errors.slice(0, 3)) {
      lines.push(`- ${e.error} → ${e.resolution}`);
    }
  }

  return lines.join('\n');
}

export class MemoryOrchestrator {
  private shortTerm: StructuredMemory | null = null;

  setShortTerm(memory: StructuredMemory): void {
    this.shortTerm = memory;
  }

  getShortTerm(): StructuredMemory | null {
    return this.shortTerm;
  }

  getFactsByCategory(category: KeyFact['category']): KeyFact[] {
    if (!this.shortTerm) return [];
    return this.shortTerm.keyFacts.filter(f => f.category === category);
  }

  getAllFacts(): KeyFact[] {
    return this.shortTerm?.keyFacts ?? [];
  }

  getCurrentProgress(): StructuredMemory['progress'] | null {
    return this.shortTerm?.progress ?? null;
  }

  getSkillsUsed(): string[] {
    return this.shortTerm?.skillsUsed ?? [];
  }

  clear(): void {
    this.shortTerm = null;
  }
}

export const memoryOrchestrator = new MemoryOrchestrator();
