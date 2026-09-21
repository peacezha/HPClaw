import { describe, expect, it } from 'vitest';
import { isCompetitionRestrictedApiPath, normalizeHpclawEdition } from './edition';

describe('HPClaw edition policy', () => {
  it('defaults unknown editions to the full product', () => {
    expect(normalizeHpclawEdition(undefined)).toBe('full');
    expect(normalizeHpclawEdition('full')).toBe('full');
    expect(normalizeHpclawEdition('competition')).toBe('competition');
    expect(normalizeHpclawEdition(' Competition ')).toBe('competition');
  });

  it('blocks only dsh bridge APIs in the competition edition', () => {
    for (const path of ['/api/bridge', '/api/bridge/status']) {
      expect(isCompetitionRestrictedApiPath(path)).toBe(true);
    }
    for (const path of [
      '/api/login',
      '/api/files/list',
      '/api/transfers',
      '/api/ai/stream',
      '/api/workflows',
      '/api/workflows/abc',
      '/api/workflow-runs',
      '/api/workflow-runs/item',
    ]) {
      expect(isCompetitionRestrictedApiPath(path)).toBe(false);
    }
  });
});
