import { afterEach, describe, expect, it, vi } from 'vitest';
import { enqueueTransfersBatch, listRemoteFiles } from './api';

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

describe('enqueueTransfersBatch', () => {
  it('posts all transfer inputs to the batch endpoint in one request', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({
      transfers: [{ id: 't1' }, { id: 't2' }],
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    }));
    vi.stubGlobal('fetch', fetchMock);

    const inputs = [
      {
        profileId: 'p1', sessionId: 'ssh-1', direction: 'upload',
        localPath: 'D:\\a.bin', remotePath: '/data/a.bin',
        temporaryPath: '/data/.a.bin.trace-t1.part',
        totalBytes: 1, transferredBytes: 0,
        conflictPolicy: 'overwrite', verificationMode: 'size', retryCount: 0,
      },
      {
        profileId: 'p1', sessionId: 'ssh-1', direction: 'upload',
        localPath: 'D:\\b.bin', remotePath: '/data/b.bin',
        temporaryPath: '/data/.b.bin.trace-t2.part',
        totalBytes: 2, transferredBytes: 0,
        conflictPolicy: 'overwrite', verificationMode: 'size', retryCount: 0,
      },
    ] as any;
    const tasks = await enqueueTransfersBatch('ssh-1', inputs);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('/api/transfers/batch');
    expect(init.method).toBe('POST');
    expect((init.headers as Record<string, string>)['X-SSH-Session-Id']).toBe('ssh-1');
    expect(JSON.parse(String(init.body))).toHaveLength(2);
    expect(tasks).toEqual([{ id: 't1' }, { id: 't2' }]);
  });

  it('surfaces the server validation error for an over-limit batch', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({
      error: { code: 'INVALID_TRANSFER_REQUEST', message: 'transfers must contain at most 500 items' },
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })));

    await expect(enqueueTransfersBatch('ssh-1', [])).rejects.toMatchObject({
      message: 'transfers must contain at most 500 items',
      code: 'INVALID_TRANSFER_REQUEST',
      status: 400,
    });
  });
});
