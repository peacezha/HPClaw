import path from 'node:path';
import { assertSafeRemotePath } from './pathSafety';

/** Resolve bounded, explicit candidates only; never search a cluster filesystem. */
export function remoteReportCandidates(input: string, home: string, bases: unknown = []): string[] {
  if (input.startsWith('/')) return [assertSafeRemotePath(input)];
  if (!input.trim() || /[\0\r\n\\]/.test(input) || /^[A-Za-z][\w+.-]*:/.test(input)) throw new Error('invalid remote report path');
  if (input === '~' || input.startsWith('~/')) return remoteReportCandidates(input.slice(2) || '.', home, [home]);
  if (!Array.isArray(bases) || bases.length > 8 || bases.some(base => typeof base !== 'string')) throw new Error('invalid report base paths');
  const roots = bases.length ? bases : [home];
  return [...new Set(roots.map(root => {
    const normalized = assertSafeRemotePath(root);
    const resolved = path.posix.resolve(normalized, input);
    if (resolved !== normalized && !resolved.startsWith(normalized.replace(/\/$/, '') + '/')) throw new Error('report path escapes its base directory');
    return resolved;
  }))];
}
