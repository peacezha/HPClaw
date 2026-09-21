import { describe, expect, it } from 'vitest';
import type { SessionData } from 'express-session';
import { BoundedSessionStore } from './boundedSessionStore';

function sessionValue(maxAge = 10_000): SessionData {
  return { cookie: { originalMaxAge: maxAge, maxAge } as SessionData['cookie'] };
}

function get(store: BoundedSessionStore, sid: string): Promise<SessionData | null | undefined> {
  return new Promise((resolve, reject) => store.get(sid, (error, value) => error ? reject(error) : resolve(value)));
}

describe('BoundedSessionStore', () => {
  it('expires stale sessions without a background timer', async () => {
    let now = 1_000;
    const store = new BoundedSessionStore({ ttlMs: 2_000, now: () => now });
    store.set('one', sessionValue());
    expect(await get(store, 'one')).not.toBeNull();
    now = 3_001;
    expect(await get(store, 'one')).toBeNull();
  });

  it('evicts the least recently touched session at the hard capacity', async () => {
    let now = 1_000;
    const store = new BoundedSessionStore({ maxSessions: 2, now: () => now });
    store.set('old', sessionValue());
    now += 1;
    store.set('kept', sessionValue());
    now += 1;
    await get(store, 'old');
    now += 1;
    store.set('new', sessionValue());

    expect(await get(store, 'old')).not.toBeNull();
    expect(await get(store, 'kept')).toBeNull();
    expect(await get(store, 'new')).not.toBeNull();
  });
});
