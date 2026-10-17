export type TraceEdition = 'full' | 'competition';

export function normalizeTraceEdition(value: unknown): TraceEdition {
  return String(value || '').trim().toLowerCase() === 'competition' ? 'competition' : 'full';
}

export function isCompetitionRestrictedApiPath(pathname: string): boolean {
  const path = String(pathname || '').toLowerCase();
  return path === '/api/bridge'
    || path.startsWith('/api/bridge/');
}
