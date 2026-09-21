import { describe, expect, it } from 'vitest';
import { resolveSocketSessionId } from './socketSession';

describe('socket session resolution', () => {
  it('falls back to the login sessionId from socket auth when cookie session is missing', () => {
    const activeSessions = new Set(['active-session']);

    const sessionId = resolveSocketSessionId(undefined, undefined, 'active-session', id => activeSessions.has(id));

    expect(sessionId).toBe('active-session');
  });

  it('does not accept unknown socket auth session ids', () => {
    const activeSessions = new Set(['active-session']);

    const sessionId = resolveSocketSessionId(undefined, undefined, 'stale-session', id => activeSessions.has(id));

    expect(sessionId).toBeUndefined();
  });

  it('uses an active explicit header before socket auth and rejects a stale header', () => {
    const activeSessions = new Set(['header-session', 'auth-session']);

    expect(resolveSocketSessionId(undefined, 'header-session', 'auth-session', id => activeSessions.has(id))).toBe('header-session');
    expect(resolveSocketSessionId(undefined, 'stale-session', undefined, id => activeSessions.has(id))).toBeUndefined();
  });
});
