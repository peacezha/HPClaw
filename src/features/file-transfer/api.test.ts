import { afterEach, describe, expect, it, vi } from 'vitest';
import { listRemoteFiles } from './api';

afterEach(() => vi.unstubAllGlobals());

describe('file transfer API errors', () => {
  it('throws a standard Error when the server returns a structured error object', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({
      error: {
        code: 'SSH_SESSION_REQUIRED',
        message: '集群会话已失效，请重新连接',
      },
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })));

    await expect(listRemoteFiles('stale-session', '/home/user')).rejects.toMatchObject({
      message: '集群会话已失效，请重新连接',
      code: 'SSH_SESSION_REQUIRED',
      status: 401,
    });
  });

  it('passes the pane AbortSignal into the remote directory request', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ entries: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }));
    vi.stubGlobal('fetch', fetchMock);
    const controller = new AbortController();

    await listRemoteFiles('cluster-b', '/home/bob', controller.signal);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/remote/files'),
      expect.objectContaining({ signal: controller.signal }),
    );
  });
});
