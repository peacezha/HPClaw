import http from 'node:http';
import express from 'express';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { registerFileRoutes } from './registerFileRoutes';

const servers: http.Server[] = [];

afterEach(async () => {
  await Promise.all(servers.splice(0).map(server => new Promise<void>(resolve => server.close(() => resolve()))));
});

async function startRoutes(service: Record<string, any>, onResponse?: (response: express.Response) => void) {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    (req as any).session = { sshSessionId: req.get('X-Test-Cookie-Session-Id') };
    next();
  });
  app.use((_req, res, next) => {
    onResponse?.(res);
    next();
  });
  registerFileRoutes(app, sessionId => sessionId === 'active'
    ? { home: '/home/lin', cluster: { getSftp: () => ({}), exec: vi.fn() } as any, service: service as any }
    : undefined);
  const server = http.createServer(app);
  servers.push(server);
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Test server did not bind');
  return `http://127.0.0.1:${address.port}`;
}

describe('remote file routes', () => {
  it('requires the explicit active SSH session header', async () => {
    const baseUrl = await startRoutes({ list: vi.fn() });
    const response = await fetch(`${baseUrl}/api/remote/files?path=/home/lin`);

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: { code: 'SSH_SESSION_REQUIRED', message: 'An active SSH session is required' } });
  });

  it('resolves an active SSH session from the existing login cookie before the optional header', async () => {
    const service = { list: vi.fn(async () => []) };
    const baseUrl = await startRoutes(service);
    const response = await fetch(`${baseUrl}/api/remote/files?path=/home/lin`, {
      headers: { 'X-Test-Cookie-Session-Id': 'active' },
    });

    expect(response.status).toBe(200);
    expect(service.list).toHaveBeenCalledWith('/home/lin');
  });

  it('bounds previews and removes only after guarded preview validation', async () => {
    const service = {
      list: vi.fn(async () => []),
      stat: vi.fn(async () => ({ name: 'a.txt', path: '/home/lin/a.txt', kind: 'file', size: 2, modifiedAt: 1 })),
      readPreview: vi.fn(async () => Buffer.from('ok')),
      remove: vi.fn(async () => ({ removed: 1 })),
    };
    const baseUrl = await startRoutes(service);
    const headers = { 'X-SSH-Session-Id': 'active', 'Content-Type': 'application/json' };

    const preview = await fetch(`${baseUrl}/api/remote/preview?path=/home/lin/a.txt`, { headers });
    expect(preview.status).toBe(200);
    expect(service.readPreview).toHaveBeenCalledWith('/home/lin/a.txt', expect.objectContaining({
      mode: 'text',
      maxBytes: 2 * 1024 * 1024,
    }));

    const protectedPreview = await fetch(`${baseUrl}/api/remote/remove/preview`, {
      method: 'POST', headers, body: JSON.stringify({ path: '/home/lin', recursive: true }),
    });
    expect(protectedPreview.status).toBe(400);
    expect(service.stat).not.toHaveBeenCalledWith('/home/lin');

    const protectedRemove = await fetch(`${baseUrl}/api/remote/remove`, {
      method: 'POST', headers, body: JSON.stringify({ path: '/home/lin', recursive: true }),
    });
    expect(protectedRemove.status).toBe(400);
    expect(service.remove).not.toHaveBeenCalled();

    const remove = await fetch(`${baseUrl}/api/remote/remove`, {
      method: 'POST', headers, body: JSON.stringify({ path: '/home/lin/a.txt', recursive: false }),
    });
    expect(remove.status).toBe(200);
    expect(service.remove).toHaveBeenCalledWith('/home/lin/a.txt', false);
  });

  it('selects server-owned head limits for 100 MiB text files', async () => {
    const service = {
      stat: vi.fn(async () => ({
        name: 'reads.fa',
        path: '/home/lin/reads.fa',
        kind: 'file',
        size: 100 * 1024 * 1024,
        modifiedAt: 1,
      })),
      readPreview: vi.fn(async () => ({
        path: '/home/lin/reads.fa',
        encoding: 'utf8',
        content: 'line\n',
        bytesRead: 5,
        totalSize: 100 * 1024 * 1024,
        truncated: true,
        lineLimit: 20,
      })),
    };
    const baseUrl = await startRoutes(service);
    const response = await fetch(`${baseUrl}/api/remote/preview?path=/home/lin/reads.fa`, {
      headers: { 'X-SSH-Session-Id': 'active' },
    });

    expect(response.status).toBe(200);
    expect(service.readPreview).toHaveBeenCalledWith('/home/lin/reads.fa', {
      mode: 'head',
      maxBytes: 256 * 1024,
      lineLimit: 20,
    });
  });

  it('caps remote search results at 5,000 entries', async () => {
    const service = {
      search: vi.fn(async function* () {
        yield Array.from({ length: 5_001 }, (_, index) => ({ name: `${index}`, path: `/home/lin/${index}`, kind: 'file', size: 1, modifiedAt: 1 }));
      }),
    };
    const baseUrl = await startRoutes(service);
    const response = await fetch(`${baseUrl}/api/remote/search?root=/home/lin&query=a`, {
      headers: { 'X-SSH-Session-Id': 'active' },
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ entries: expect.any(Array), truncated: true });
    const body = await (await fetch(`${baseUrl}/api/remote/search?root=/home/lin&query=a`, {
      headers: { 'X-SSH-Session-Id': 'active' },
    })).json() as { entries: unknown[] };
    expect(body.entries).toHaveLength(5_000);
    expect(service.search).toHaveBeenCalledWith('/home/lin', 'a', expect.any(AbortSignal), 5_001);
  });

  it('cancels SFTP traversal when the response closes before completion', async () => {
    let closeResponse!: () => void;
    let beginSearch!: () => void;
    let stopSearch!: () => void;
    const started = new Promise<void>(resolve => { beginSearch = resolve; });
    const stopped = new Promise<void>(resolve => { stopSearch = resolve; });
    const service = {
      search: async function* (_root: string, _query: string, signal: AbortSignal) {
        beginSearch();
        await new Promise<void>(resolve => signal.addEventListener('abort', () => {
          stopSearch();
          resolve();
        }, { once: true }));
      },
    };
    const baseUrl = await startRoutes(service, res => {
      closeResponse = () => res.emit('close');
    });
    const requestController = new AbortController();
    const request = fetch(`${baseUrl}/api/remote/search?root=/home/lin&query=a`, {
      headers: { 'X-SSH-Session-Id': 'active' },
      signal: requestController.signal,
    }).catch(() => undefined);

    await started;
    closeResponse();
    try {
      await Promise.race([
        stopped,
        new Promise<void>((_resolve, reject) => setTimeout(() => reject(new Error('response close did not abort search')), 50)),
      ]);
    } finally {
      requestController.abort();
      await request;
    }
  });

  it('normalizes expected SFTP errors while retaining 500 for unknown failures', async () => {
    const service = {
      list: vi.fn()
        .mockRejectedValueOnce(Object.assign(new Error('No such file'), { code: 'ENOENT' }))
        .mockRejectedValueOnce(Object.assign(new Error('Permission denied'), { code: 'EACCES' }))
        .mockRejectedValueOnce(Object.assign(new Error('Directory not empty'), { code: 'ENOTEMPTY' }))
        .mockRejectedValueOnce(new Error('socket corruption')),
    };
    const baseUrl = await startRoutes(service);
    const headers = { 'X-SSH-Session-Id': 'active' };

    for (const expectedStatus of [404, 403, 409, 500]) {
      const response = await fetch(`${baseUrl}/api/remote/files?path=/home/lin/missing`, { headers });
      expect(response.status).toBe(expectedStatus);
    }
  });

  it('returns 400 for malformed request fields before invoking SFTP', async () => {
    const service = { rename: vi.fn() };
    const baseUrl = await startRoutes(service);
    const response = await fetch(`${baseUrl}/api/remote/rename`, {
      method: 'POST',
      headers: { 'X-SSH-Session-Id': 'active', 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: '', to: '/home/lin/target' }),
    });

    expect(response.status).toBe(400);
    expect(service.rename).not.toHaveBeenCalled();
  });

  it('copies remote files and folders into the requested directory', async () => {
    const service = {
      copy: vi.fn().mockResolvedValue({
        paths: ['/home/lin/target/report.txt', '/home/lin/target/results'],
      }),
    };
    const baseUrl = await startRoutes(service);
    const response = await fetch(`${baseUrl}/api/remote/copy`, {
      method: 'POST',
      headers: { 'X-SSH-Session-Id': 'active', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sourcePaths: ['/home/lin/report.txt', '/home/lin/results'],
        targetDirectory: '/home/lin/target',
      }),
    });

    expect(response.status).toBe(200);
    expect(service.copy).toHaveBeenCalledWith(
      ['/home/lin/report.txt', '/home/lin/results'],
      '/home/lin/target',
    );
  });

  it('writes remote file content through SFTP', async () => {
    const service = { writeFile: vi.fn().mockResolvedValue(undefined) };
    const baseUrl = await startRoutes(service);
    const response = await fetch(`${baseUrl}/api/remote/write`, {
      method: 'POST',
      headers: { 'X-SSH-Session-Id': 'active', 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: '/home/lin/notes.txt', content: 'updated' }),
    });

    expect(response.status).toBe(200);
    expect(service.writeFile).toHaveBeenCalledWith('/home/lin/notes.txt', 'updated');
  });
});


describe('AI rich-content file routes', () => {
  const textEntry = { name: 'result.csv', path: '/home/lin/result.csv', kind: 'file', size: 12, modifiedAt: 1 };

  it('requires an active SSH session for /api/files/read, read/batch and view', async () => {
    const baseUrl = await startRoutes({ stat: vi.fn() });

    for (const attempt of [
      () => fetch(`${baseUrl}/api/files/read`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: '/home/lin/result.csv' }) }),
      () => fetch(`${baseUrl}/api/files/read/batch`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paths: ['/home/lin/result.csv'] }) }),
      () => fetch(`${baseUrl}/api/files/view?path=/home/lin/result.csv`),
    ]) {
      const response = await attempt();
      expect(response.status).toBe(401);
    }
  });

  it('reads a remote text file with mime metadata for inline cards', async () => {
    const service = {
      stat: vi.fn(async () => textEntry),
      readPreview: vi.fn(async () => ({
        path: '/home/lin/result.csv', encoding: 'utf8', content: 'a,b\n1,2', bytesRead: 7, totalSize: 12, truncated: false,
      })),
    };
    const baseUrl = await startRoutes(service);
    const response = await fetch(`${baseUrl}/api/files/read`, {
      method: 'POST',
      headers: { 'X-SSH-Session-Id': 'active', 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: '/home/lin/result.csv' }),
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      filePath: '/home/lin/result.csv',
      content: 'a,b\n1,2',
      metadata: { size: 12, mime: 'text/csv' },
    });
    expect(service.readPreview).toHaveBeenCalledWith('/home/lin/result.csv', { mode: 'text', maxBytes: 10 * 1024 * 1024 });
  });

  it('reads a remote image as base64 for /api/files/read', async () => {
    const service = {
      stat: vi.fn(async () => ({ name: 'plot.png', path: '/home/lin/plot.png', kind: 'file', size: 100, modifiedAt: 1 })),
      readPreview: vi.fn(async () => ({
        path: '/home/lin/plot.png', encoding: 'base64', content: Buffer.from('png-bytes').toString('base64'), bytesRead: 9, totalSize: 100, truncated: false,
      })),
    };
    const baseUrl = await startRoutes(service);
    const response = await fetch(`${baseUrl}/api/files/read`, {
      method: 'POST',
      headers: { 'X-SSH-Session-Id': 'active', 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: '/home/lin/plot.png' }),
    });

    expect(response.status).toBe(200);
    const body = await response.json() as { metadata: { mime: string }; content: string };
    expect(body.metadata.mime).toBe('image/png');
    expect(Buffer.from(body.content, 'base64').toString()).toBe('png-bytes');
    expect(service.readPreview).toHaveBeenCalledWith('/home/lin/plot.png', { mode: 'binary', maxBytes: 10 * 1024 * 1024 });
  });

  it('rejects oversized, directory and unsupported reads before touching content', async () => {
    const service = {
      stat: vi.fn()
        .mockResolvedValueOnce({ name: 'big.csv', path: '/home/lin/big.csv', kind: 'file', size: 11 * 1024 * 1024, modifiedAt: 1 })
        .mockResolvedValueOnce({ name: 'dir', path: '/home/lin/dir', kind: 'directory', size: 0, modifiedAt: 1 })
        .mockResolvedValueOnce({ name: 'pack.zip', path: '/home/lin/pack.zip', kind: 'file', size: 10, modifiedAt: 1 }),
      readPreview: vi.fn(),
    };
    const baseUrl = await startRoutes(service);
    const headers = { 'X-SSH-Session-Id': 'active', 'Content-Type': 'application/json' };

    for (const [path, expectedStatus] of [
      ['/home/lin/big.csv', 413],
      ['/home/lin/dir', 400],
      ['/home/lin/pack.zip', 415],
    ] as const) {
      const response = await fetch(`${baseUrl}/api/files/read`, { method: 'POST', headers, body: JSON.stringify({ path }) });
      expect(response.status).toBe(expectedStatus);
    }
    expect(service.readPreview).not.toHaveBeenCalled();
  });

  it('returns 400 for a missing path field', async () => {
    const baseUrl = await startRoutes({ stat: vi.fn() });
    const response = await fetch(`${baseUrl}/api/files/read`, {
      method: 'POST',
      headers: { 'X-SSH-Session-Id': 'active', 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    expect(response.status).toBe(400);
  });

  it('omits per-file failures from /api/files/read/batch results', async () => {
    const service = {
      stat: vi.fn(async (path: string) => {
        if (path.includes('missing')) throw Object.assign(new Error('No such file'), { code: 'ENOENT' });
        return textEntry;
      }),
      readPreview: vi.fn(async () => ({
        path: '/home/lin/result.csv', encoding: 'utf8', content: 'a,b', bytesRead: 3, totalSize: 12, truncated: false,
      })),
    };
    const baseUrl = await startRoutes(service);
    const response = await fetch(`${baseUrl}/api/files/read/batch`, {
      method: 'POST',
      headers: { 'X-SSH-Session-Id': 'active', 'Content-Type': 'application/json' },
      body: JSON.stringify({ paths: ['/home/lin/result.csv', '/home/lin/missing.csv'] }),
    });

    expect(response.status).toBe(200);
    const body = await response.json() as { filePath: string }[];
    expect(body).toHaveLength(1);
    expect(body[0].filePath).toBe('/home/lin/result.csv');
  });

  it('rejects malformed batch requests', async () => {
    const baseUrl = await startRoutes({ stat: vi.fn() });
    const response = await fetch(`${baseUrl}/api/files/read/batch`, {
      method: 'POST',
      headers: { 'X-SSH-Session-Id': 'active', 'Content-Type': 'application/json' },
      body: JSON.stringify({ paths: [] }),
    });
    expect(response.status).toBe(400);
  });

  it('streams /api/files/view with a detected Content-Type and query session routing', async () => {
    const service = {
      stat: vi.fn(async () => ({ name: 'plot.png', path: '/home/lin/plot.png', kind: 'file', size: 9, modifiedAt: 1 })),
      readPreview: vi.fn(async () => ({
        path: '/home/lin/plot.png', encoding: 'base64', content: Buffer.from('png-bytes').toString('base64'), bytesRead: 9, totalSize: 9, truncated: false,
      })),
    };
    const baseUrl = await startRoutes(service);
    // <img src> 无法带请求头：与 /api/files/download 一样接受 ?sessionId=
    const response = await fetch(`${baseUrl}/api/files/view?path=/home/lin/plot.png&sessionId=active`);

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('image/png');
    expect(await response.text()).toBe('png-bytes');
  });
});
