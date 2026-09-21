export type HpclawEdition = 'full' | 'competition';

export function normalizeHpclawEdition(value: unknown): HpclawEdition {
  return String(value || '').trim().toLowerCase() === 'competition' ? 'competition' : 'full';
}

export function isCompetitionRestrictedApiPath(pathname: string): boolean {
  const path = String(pathname || '').toLowerCase();
  return path === '/api/bridge'
    || path.startsWith('/api/bridge/');
}
