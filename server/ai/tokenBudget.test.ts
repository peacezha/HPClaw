import { describe, expect, it } from 'vitest';
import { TokenBudgetManager, estimateTokens, MODEL_WINDOWS } from './tokenBudget';

describe('estimateTokens', () => {
  it('counts English text roughly at 4 chars per token', () => {
    const result = estimateTokens('Hello world, this is a test.');
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(15);
  });

  it('counts Chinese text at ~1.5 chars per token', () => {
    const result = estimateTokens('这是一段中文测试文本');
    expect(result).toBeGreaterThan(3);
    expect(result).toBeLessThan(15);
  });

  it('returns 0 for empty string', () => {
    expect(estimateTokens('')).toBe(0);
  });
});

describe('TokenBudgetManager', () => {
  it('allocates budget for components and tracks usage', () => {
    const budget = new TokenBudgetManager('deepseek-v4-pro');
    const tokens = budget.request('skills', 25000);
    expect(tokens).toBe(25000);
  });

  it('refuses allocation when budget exhausted', () => {
    const budget = new TokenBudgetManager('deepseek-v4-pro');
    budget.request('skills', 130000);
    const remaining = budget.request('conversation', 5000);
    expect(remaining).toBe(0);
  });

  it('rebalances by priority when under pressure', () => {
    const budget = new TokenBudgetManager('deepseek-v4-pro');
    budget.setPriority('conversation', 5);
    budget.setPriority('skills', 10);
    budget.request('conversation', 80000);
    budget.request('skills', 50000);
    const skillsAlloc = budget.getAllocation('skills');
    expect(skillsAlloc?.used).toBeGreaterThan(0);
  });

  it('returns correct window size for known models', () => {
    expect(MODEL_WINDOWS['deepseek-v4-pro']).toBe(131072);
    expect(MODEL_WINDOWS['deepseek-chat']).toBe(65536);
    expect(MODEL_WINDOWS['moonshot-v1-32k']).toBe(32768);
  });

  it('defaults to 65536 for unknown models', () => {
    const budget = new TokenBudgetManager('unknown-model');
    expect(budget.total()).toBe(65536);
  });
});
