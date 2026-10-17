import { describe, expect, it } from 'vitest';
import { isCompetitionRestrictedApiPath, normalizeTraceEdition } from './edition';

describe('TRACE edition policy', () => {
  it('defaults unknown editions to the full product', () => {
    expect(normalizeTraceEdition(undefined)).toBe('full');
    expect(normalizeTraceEdition('full')).toBe('full');
    expect(normalizeTraceEdition('competition')).toBe('competition');
    expect(normalizeTraceEdition(' Competition ')).toBe('competition');
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
