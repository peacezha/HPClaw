// @vitest-environment jsdom
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useCommandApprovals } from './useCommandApprovals';
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
const event = (id: string, risk = 'destructive') => ({ type: 'confirm', id, command: 'bkill 123', risk, expiresAt: Date.now() + 60_000 });
describe('approval UI delivery', () => {
  it('never automatically trusts job termination and preserves concurrent commands', async () => {
    const fetch = vi.fn(async () => new Response(JSON.stringify({ success: true })));
    vi.stubGlobal('fetch', fetch);
    const { result } = renderHook(() => useCommandApprovals({ english: false, trusted: () => true, onTrust: vi.fn() }));
    act(() => { result.current.handleEvent(event('a')); result.current.handleEvent(event('b')); result.current.handleEvent(event('a')); });
    expect(fetch).not.toHaveBeenCalled(); expect(result.current.count).toBe(2);
    await act(async () => result.current.decide('a', 'execute'));
    expect(result.current.pending?.id).toBe('b');
    expect(fetch).toHaveBeenCalledOnce();
    expect(JSON.parse(String(fetch.mock.calls[0][1]?.body))).toEqual({ id: 'a', approved: true });
  });
  it('keeps a failed delivery visible for retry and waits for a real acknowledgement', async () => {
    const fetch = vi.fn().mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(new Response(JSON.stringify({ success: true })));
    vi.stubGlobal('fetch', fetch);
    const { result } = renderHook(() => useCommandApprovals({ english: true, trusted: () => false, onTrust: vi.fn() }));
    act(() => result.current.handleEvent(event('a')));
    await act(async () => result.current.decide('a', 'execute'));
    expect(result.current.pending?.id).toBe('a'); expect(result.current.error).toContain('unverified');
    await act(async () => result.current.decide('a', 'execute'));
    expect(result.current.pending).toBeUndefined(); expect(result.current.notice).toContain('Awaiting');
  });
  it('does not render stale replayed approvals or conflate expiry with refusal', () => {
    const { result } = renderHook(() => useCommandApprovals({ english: false, trusted: () => false, onTrust: vi.fn() }));
    act(() => result.current.handleEvent(event('a')));
    act(() => result.current.handleEvent({ type: 'confirm_resolved', id: 'a', reason: 'expired' }));
    expect(result.current.notice).toContain('不代表你点了拒绝');
    act(() => result.current.handleEvent(event('a')));
    expect(result.current.pending).toBeUndefined();
  });
  it('ignores a late receipt after switching conversations and prevents double clicks', async () => {
    let resolve!: (value: Response) => void;
    const fetch = vi.fn(() => new Promise<Response>(r => { resolve = r; })); vi.stubGlobal('fetch', fetch);
    const trust = vi.fn();
    const { result } = renderHook(() => useCommandApprovals({ english: true, trusted: () => false, onTrust: trust }));
    act(() => result.current.handleEvent(event('a', 'write')));
    let request!: Promise<void>;
    act(() => { request = result.current.decide('a', 'trust'); void result.current.decide('a', 'trust'); });
    expect(fetch).toHaveBeenCalledOnce();
    act(() => { result.current.clear(); result.current.handleEvent(event('b')); });
    await act(async () => { resolve(new Response(JSON.stringify({ success: true }))); await request; });
    expect(result.current.pending?.id).toBe('b'); expect(trust).not.toHaveBeenCalled();
    await waitFor(() => expect(result.current.busy).toBe(false));
  });
});
