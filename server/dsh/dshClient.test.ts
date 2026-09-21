import { afterEach, describe, expect, it, vi } from 'vitest';
import { DshClient } from './dshClient';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('DshClient question response', () => {
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
