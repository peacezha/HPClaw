// @vitest-environment jsdom
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useUserQuestions } from './useUserQuestions';
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
function fixture() {
  const onAnswered = vi.fn(), onLegacyAnswer = vi.fn(async () => {});
  const hook = renderHook(() => useUserQuestions({ english: false, onAnswered, onLegacyAnswer }));
  const ask = (id = 'q1', extra = {}) => act(() => hook.result.current.handleEvent({ type: 'ask', id, question: 'Which samples?', options: ['A', 'B'], ...extra }));
  return { ...hook, ask, onAnswered, onLegacyAnswer };
}
describe('user question receipts and UI lifecycle', () => {
  it('updates existing delivery-error text when the language changes', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('offline'); }));
    const f = renderHook(({ english }) => useUserQuestions({ english, onAnswered: vi.fn(), onLegacyAnswer: vi.fn() }), { initialProps: { english: false } });
    act(() => f.result.current.handleEvent({ type: 'ask', id: 'q-lang', question: 'Input?', options: [] }));
    await act(async () => f.result.current.reply({ selected: [], custom: 'test' }));
    expect(f.result.current.error).toContain('尚未核验');
    f.rerender({ english: true }); expect(f.result.current.error).toContain('unverified'); expect(f.result.current.pending?.id).toBe('q-lang');
  });
  it('records the exact SSE-acknowledged answer once even if the turn ends before its HTTP receipt', async () => {
    let resolve!: (value: Response) => void; vi.stubGlobal('fetch', vi.fn(() => new Promise<Response>(r => { resolve = r; })));
    const f = fixture(); f.ask(); let pending!: Promise<void>;
    act(() => { pending = f.result.current.reply({ selected: ['A'] }); });
    act(() => f.result.current.handleEvent({ type: 'ask_resolved', id: 'q1', reason: 'answered', answer: { selected: ['A'] } }));
    expect(f.onAnswered).toHaveBeenCalledExactlyOnceWith('A');
    act(() => f.result.current.clear());
    await act(async () => { resolve(Response.json({ success: true })); await pending; });
    expect(f.onAnswered).toHaveBeenCalledTimes(1);
  });
  it('keeps answers pending until a verified receipt, and never submits a new prompt', async () => {
    let resolve!: (value: Response) => void;
    const fetch = vi.fn(() => new Promise<Response>(r => { resolve = r; })); vi.stubGlobal('fetch', fetch);
    const f = fixture(); f.ask();
    let pending!: Promise<void>;
    act(() => { pending = f.result.current.reply({ selected: ['A'] }); });
    expect(f.result.current.pending?.id).toBe('q1'); expect(f.result.current.busy).toBe(true);
    act(() => { void f.result.current.reply({ selected: ['B'] }); });
    expect(fetch).toHaveBeenCalledTimes(1);
    await act(async () => { resolve(Response.json({ success: true })); await pending; });
    expect(f.result.current.pending).toBeUndefined(); expect(f.onAnswered).toHaveBeenCalledWith('A'); expect(f.onLegacyAnswer).not.toHaveBeenCalled();
    expect(fetch.mock.calls[0][0]).toBe('/api/ai/question');
  });
  it('retains the same question after transport failure and retries its ID only', async () => {
    const fetch = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValue(Response.json({ success: true })); vi.stubGlobal('fetch', fetch);
    const f = fixture(); f.ask();
    await act(async () => f.result.current.reply({ selected: [], custom: '/data/raw' }));
    expect(f.result.current.pending?.id).toBe('q1'); expect(f.result.current.error).toContain('尚未核验'); expect(f.onAnswered).not.toHaveBeenCalled();
    await act(async () => f.result.current.reply({ selected: [], custom: '/data/raw' }));
    expect(JSON.parse(fetch.mock.calls[1][1].body)).toMatchObject({ id: 'q1', answer: { custom: '/data/raw' } });
    expect(f.onAnswered).toHaveBeenCalledTimes(1);
  });
  it('ignores a delayed failed reply after a real conversation switch', async () => {
    let reject!: (err: Error) => void; vi.stubGlobal('fetch', vi.fn(() => new Promise((_resolve, r) => { reject = r; })));
    const f = fixture(); f.ask(); let pending!: Promise<void>;
    act(() => { pending = f.result.current.reply({ selected: ['A'] }); });
    act(() => f.result.current.clear()); f.ask('q2');
    await act(async () => { reject(new Error('offline')); await pending; });
    expect(f.result.current.pending?.id).toBe('q2'); expect(f.result.current.error).toBe('');
  });
  it('queues distinct questions, deduplicates replay, and never restores a resolved ID', () => {
    const f = fixture(); f.ask(); f.ask(); f.ask('q2');
    expect(f.result.current.count).toBe(2);
    act(() => f.result.current.handleEvent({ type: 'ask_resolved', id: 'q1', reason: 'answered' })); f.ask();
    expect(f.result.current.count).toBe(1); expect(f.result.current.pending?.id).toBe('q2');
  });
  it('removes expired replies without blaming rejection or resubmitting tasks', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ success: false, reason: 'expired' }, { status: 409 })));
    const f = fixture(); f.ask();
    await act(async () => f.result.current.reply({ selected: ['A'] }));
    expect(f.result.current.pending).toBeUndefined(); expect(f.result.current.notice).toContain('过期'); expect(f.onAnswered).not.toHaveBeenCalled();
    f.ask('q2', { expiresAt: Date.now() - 1000 }); expect(f.result.current.pending).toBeUndefined();
  });
  it('still supports native questions without an in-stream reply ID', async () => {
    const f = fixture(); f.ask('', { options: [] });
    expect(f.result.current.pending?.options.length).toBeGreaterThan(0);
    await act(async () => f.result.current.reply({ selected: [], custom: 'details' }));
    await waitFor(() => expect(f.onLegacyAnswer).toHaveBeenCalledWith('details'));
  });
});
