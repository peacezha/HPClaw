import { afterEach, describe, expect, it, vi } from 'vitest';
import { DshClient } from './dshClient';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('DshClient question response', () => {
  it('bounds a stalled RPC and propagates cancellation without blocking session.cancel', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('fetch', vi.fn((_url, init) => new Promise((_resolve, reject) => {
      init.signal.addEventListener('abort', () => reject(init.signal.reason), { once: true });
    })));
    const client = new DshClient('http://127.0.0.1:3999');
    const stalled = client.sessionStatus('session-1');
    const assertion = expect(stalled).rejects.toThrow('DSH_RPC_TIMEOUT');
    await vi.advanceTimersByTimeAsync(30_001);
    await assertion;
    const abort = new AbortController();
    const attached = new DshClient('http://127.0.0.1:3999', abort.signal);
    const request = attached.history('session-1');
    const cancelled = expect(request).rejects.toThrow();
    abort.abort();
    await cancelled;
    const fetchMock = vi.fn(async (_url: string, init: RequestInit) => {
      expect(init.signal?.aborted).toBe(false);
      return new Response(JSON.stringify({ result: { ok: true, value: {} } }));
    });
    vi.stubGlobal('fetch', fetchMock);
    await attached.cancel('session-1');
    expect(fetchMock).toHaveBeenCalledOnce();
  });
  it('echoes the question rpcId and sends the structured answer to /api/respond', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ accepted: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }));
    vi.stubGlobal('fetch', fetchMock);
    const client = new DshClient('http://127.0.0.1:3999');

    const accepted = await client.respondQuestion({
      rpcId: 'rpc-question-7',
      sessionId: 'session-1',
      answer: { answers: [{ id: 'last_seq', selected: [], custom: 'ATGC' }] },
    });

    expect(accepted).toBe(true);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://127.0.0.1:3999/api/respond');
    expect(JSON.parse(String(init?.body))).toEqual({
      type: 'client-response',
      rpcId: 'rpc-question-7',
      result: {
        ok: true,
        value: {
          sessionId: 'session-1',
          answer: { answers: [{ id: 'last_seq', selected: [], custom: 'ATGC' }] },
        },
      },
    });
  });
});
