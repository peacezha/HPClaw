import { describe, expect, it, vi } from 'vitest';
import { SessionRegistry } from './sessionRegistry';

describe('SessionRegistry', () => {
  it('creates distinct random UUID session IDs that can be used for lookup', () => {
    const session = { close: vi.fn() } as never;
    const registry = new SessionRegistry();
    const firstId = registry.createId();
    const secondId = registry.createId();

    registry.register(firstId, session);

    expect(firstId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    expect(secondId).not.toBe(firstId);
    expect(registry.has(firstId)).toBe(true);
    expect(registry.get(firstId)).toBe(session);
    expect(registry.get(undefined)).toBeUndefined();
  });

  it('closes and removes the previous session when a new session is registered', () => {
    const first = { close: vi.fn() } as never;
    const second = { close: vi.fn() } as never;
    const registry = new SessionRegistry();

    registry.register('first', first);
    registry.register('second', second);

    expect(first.close).toHaveBeenCalledOnce();
    expect(second.close).not.toHaveBeenCalled();
    expect(registry.has('first')).toBe(false);
    expect(registry.get('first')).toBeUndefined();
    expect(registry.get('second')).toBe(second);
  });

  it('moves the same session to a new ID without closing it', () => {
    const session = { close: vi.fn() } as never;
    const registry = new SessionRegistry();

    registry.register('first', session);
    registry.register('second', session);

    expect(session.close).not.toHaveBeenCalled();
    expect(registry.get('first')).toBeUndefined();
    expect(registry.get('second')).toBe(session);
  });

  it('closes and removes a session explicitly', () => {
    const session = { close: vi.fn() } as never;
    const registry = new SessionRegistry();
    registry.register('active', session);

    registry.remove('active');
    registry.remove('active');

    expect(session.close).toHaveBeenCalledOnce();
    expect(registry.has('active')).toBe(false);
  });
});
