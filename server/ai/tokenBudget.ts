import type { TokenAllocation, TokenBudget } from './types';

export const MODEL_WINDOWS: Record<string, number> = {
  'deepseek-v4-pro': 131072,
  'deepseek-chat': 65536,
  'deepseek-reasoner': 65536,
  'gemini-3.1-pro-preview': 1048576,
  'gpt-4o-mini': 131072,
  'grok-2-latest': 131072,
  'moonshot-v1-32k': 32768,
};

const DEFAULT_WINDOW = 65536;

function isCJK(char: string): boolean {
  const code = char.charCodeAt(0);
  return (code >= 0x4E00 && code <= 0x9FFF) ||
    (code >= 0x3400 && code <= 0x4DBF) ||
    (code >= 0x3040 && code <= 0x309F) ||
    (code >= 0x30A0 && code <= 0x30FF) ||
    (code >= 0xAC00 && code <= 0xD7AF);
}

export function estimateTokens(text: string): number {
  if (!text) return 0;
  let cjkCount = 0;
  let otherCount = 0;
  for (const char of text) {
    if (isCJK(char)) {
      cjkCount++;
    } else {
      otherCount++;
    }
  }
  return Math.ceil(cjkCount / 1.5) + Math.ceil(otherCount / 4);
}

export class TokenBudgetManager {
  private budget: TokenBudget;

  constructor(model: string) {
    const total = MODEL_WINDOWS[model] ?? DEFAULT_WINDOW;
    this.budget = {
      total,
      used: 0,
      allocations: new Map(),
    };
    // Reserve 15% for AI response
    this.budget.used = Math.ceil(total * 0.15);
    // Reserve ~3% for system overhead
    this.budget.used += 800;
  }

  total(): number {
    return this.budget.total;
  }

  used(): number {
    return this.budget.used;
  }

  available(): number {
    return Math.max(0, this.budget.total - this.budget.used);
  }

  request(component: string, desired: number): number {
    const alloc = this.budget.allocations.get(component);
    const max = alloc?.max ?? this.budget.total;
    const available = this.available();
    const granted = Math.min(desired, max, available);
    if (granted <= 0) return 0;

    this.budget.allocations.set(component, {
      min: alloc?.min ?? 0,
      max,
      used: granted,
      priority: alloc?.priority ?? 5,
    });
    this.budget.used += granted;
    return granted;
  }

  setPriority(component: string, priority: number): void {
    const alloc = this.budget.allocations.get(component);
    if (alloc) {
      alloc.priority = priority;
    } else {
      this.budget.allocations.set(component, { min: 0, max: this.budget.total, used: 0, priority });
    }
  }

  setLimits(component: string, min: number, max: number): void {
    const existing = this.budget.allocations.get(component);
    this.budget.allocations.set(component, {
      min,
      max,
      used: existing?.used ?? 0,
      priority: existing?.priority ?? 5,
    });
  }

  getAllocation(component: string): TokenAllocation | undefined {
    return this.budget.allocations.get(component);
  }

  rebalance(requiredTokens: number): void {
    if (this.available() >= requiredTokens) return;
    const shortage = requiredTokens - this.available();
    const sorted = [...this.budget.allocations.entries()]
      .sort((a, b) => a[1].priority - b[1].priority);

    let reclaimed = 0;
    for (const [name, alloc] of sorted) {
      if (reclaimed >= shortage) break;
      const excess = Math.max(0, alloc.used - alloc.min);
      const take = Math.min(excess, shortage - reclaimed);
      if (take > 0) {
        alloc.used -= take;
        this.budget.used -= take;
        reclaimed += take;
      }
    }
  }
}
