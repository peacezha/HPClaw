import express, { type Express } from 'express';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  registerBridgeRoutes,
  type BridgeClusterSession,
  type BridgeFsService,
  type BridgeRouteDeps,
} from './bridgeRoutes';

const TOKEN = 'test-bridge-token';
const DSH_SESSION = 'dsh-fs-1';
const REMOTE = '/home/u/data.txt';

function makeSftp(overrides: Record<string, unknown> = {}) {
  return {
    fastPut: vi.fn((_local: string, _remote: string, cb: (err?: Error | null) => void) => cb(null)),
    fastGet: vi.fn((_remote: string, _local: string, cb: (err?: Error | null) => void) => cb(null)),
    ...overrides,
  };
}

function makeService(overrides: Partial<BridgeFsService> = {}): BridgeFsService {
  return {
    list: vi.fn(async () => [{ name: 'a.txt', path: '/home/u/a.txt', kind: 'file', size: 3 }]),
    stat: vi.fn(async () => ({ kind: 'file', size: 5 })),
    readPreview: vi.fn(async () => Buffer.from('hello', 'utf8')),
    writeFile: vi.fn(async () => undefined),
    ...overrides,
  };
}

function makeSession(options: { sftp?: unknown; sftpThrows?: boolean } = {}): BridgeClusterSession {
  const sftp = options.sftp ?? makeSftp();
  return {
    cluster: {
      exec: vi.fn(async () => 'ok\n'),
      state: 'connected',
      getSftp: () => {
        if (options.sftpThrows) throw new Error('SFTP is not ready');
        return sftp as never;
      },
    },
    home: '/home/u',
    info: { host: 'hpc.test' },
  };
}

function makeDeps(overrides: Partial<BridgeRouteDeps> = {}): BridgeRouteDeps {
  return {
    getSession: () => makeSession(),
    getDshSessionBinding: () => ({
      dshSessionId: DSH_SESSION,
      sshSessionId: 'ssh-1',
      workspaceRoot: tmpDir || os.tmpdir(),
      conversationKey: 'ssh-1:chat',
      confirmationPolicy: 'dangerous',
      updatedAt: Date.now(),
    }),
    getBridgeToken: () => TOKEN,
    ...overrides,
  };
}

const servers: Server[] = [];

async function startApp(deps: BridgeRouteDeps): Promise<string> {
  const app: Express = express();
  // 生产 server.ts 是 10mb；测试 app 需要容纳 >1MB 的 write 体来验证 413 分支。
  app.use(express.json({ limit: '8mb' }));
  registerBridgeRoutes(app, deps);
  const server = await new Promise<Server>(resolve => {
    const s = app.listen(0, '127.0.0.1', () => resolve(s));
  });
  servers.push(server);
  const { port } = server.address() as AddressInfo;
  return `http://127.0.0.1:${port}`;
}

let tmpDir = '';

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bridge-fs-test-'));
});

afterEach(async () => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
  while (servers.length > 0) {
    const server = servers.pop()!;
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
});

async function post(base: string, urlPath: string, body: unknown, token: string | null | undefined = TOKEN): Promise<{ status: number; body: any }> {
  const res = await fetch(`${base}${urlPath}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'X-HPClaw-Bridge': token } : {}),
      'X-HPClaw-Dsh-Session': DSH_SESSION,
    },
    body: JSON.stringify(body),
  });
  return { status: res.status, body: await res.json().catch(() => undefined) };
}

describe('bridgeRoutes fs endpoints', () => {
  it('rejects requests without the bridge token with 403', async () => {
    const base = await startApp(makeDeps());
    const res = await post(base, '/api/bridge/fs/list', { path: '/home/u' }, null);
    expect(res.status).toBe(403);
    expect(res.body).toEqual({ error: 'forbidden' });
  });

  it('returns 409 when there is no connected cluster session', async () => {
    const base = await startApp(makeDeps({ getSession: () => undefined }));
    const res = await post(base, '/api/bridge/fs/list', { path: '/home/u' });
    expect(res.status).toBe(409);
    expect(res.body).toEqual({ error: 'no_cluster_session' });
  });

  it('returns 409 sftp_not_ready when getSftp throws', async () => {
    const base = await startApp(makeDeps({ getSession: () => makeSession({ sftpThrows: true }) }));
    const res = await post(base, '/api/bridge/fs/list', { path: '/home/u' });
    expect(res.status).toBe(409);
    expect(res.body.error).toBe('sftp_not_ready');
  });

  it('rejects a missing path with 400 on all fs endpoints', async () => {
    const base = await startApp(makeDeps());
    for (const urlPath of ['/api/bridge/fs/list', '/api/bridge/fs/read', '/api/bridge/fs/write']) {
      const res = await post(base, urlPath, {});
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'invalid_request' });
    }
    expect((await post(base, '/api/bridge/fs/push', { localPath: 'x' })).status).toBe(400);
    expect((await post(base, '/api/bridge/fs/pull', { remotePath: 'x' })).status).toBe(400);
  });

  it('lists directories and truncates at 500 entries', async () => {
    const service = makeService();
    const base = await startApp(makeDeps({ createSftpService: () => service }));
    const ok = await post(base, '/api/bridge/fs/list', { path: '/home/u' });
    expect(ok.status).toBe(200);
    expect(ok.body.ok).toBe(true);
    expect(ok.body.path).toBe('/home/u');
    expect(ok.body.entries).toHaveLength(1);
    expect(ok.body.truncated).toBeUndefined();
    expect(service.list).toHaveBeenCalledWith('/home/u');

    const big = makeService({
      list: vi.fn(async () => Array.from({ length: 600 }, (_v, i) => ({ name: `f${i}` }))),
    });
    const bigBase = await startApp(makeDeps({ createSftpService: () => big }));
    const res = await post(bigBase, '/api/bridge/fs/list', { path: '/home/u' });
    expect(res.body.entries).toHaveLength(500);
    expect(res.body.truncated).toBe(true);
  });

  it('returns ok:false with the error message when list fails', async () => {
    const service = makeService({ list: vi.fn(async () => { throw new Error('permission denied'); }) });
    const base = await startApp(makeDeps({ createSftpService: () => service }));
    const res = await post(base, '/api/bridge/fs/list', { path: '/home/u/denied' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: false, error: 'permission denied' });
  });

  it('reads remote files as utf8 text and caps maxBytes at 1MB', async () => {
    const service = makeService();
    const base = await startApp(makeDeps({ createSftpService: () => service }));
    const res = await post(base, '/api/bridge/fs/read', { path: REMOTE, maxBytes: 10 * 1024 * 1024 });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true, path: REMOTE, content: 'hello' });
    expect(service.readPreview).toHaveBeenCalledWith(REMOTE, 1024 * 1024);

    const truncService = makeService({
      readPreview: vi.fn(async (_p: string, max: number) => Buffer.alloc(max, 120)),
      stat: vi.fn(async () => ({ kind: 'file', size: 2 * 1024 * 1024 })),
    });
    const truncBase = await startApp(makeDeps({ createSftpService: () => truncService }));
    const truncated = await post(truncBase, '/api/bridge/fs/read', { path: REMOTE, maxBytes: 1024 });
    expect(truncated.body.truncated).toBe(true);
  });

  it('rejects write content over 1MB with 413 and non-string content with 400', async () => {
    const service = makeService();
    const base = await startApp(makeDeps({ createSftpService: () => service }));

    const tooLarge = await post(base, '/api/bridge/fs/write', { path: REMOTE, content: 'x'.repeat(1024 * 1024 + 1) });
    expect(tooLarge.status).toBe(413);
    expect(tooLarge.body).toEqual({ error: 'too_large' });

    const wrongType = await post(base, '/api/bridge/fs/write', { path: REMOTE, content: 42 });
    expect(wrongType.status).toBe(400);

    const ok = await post(base, '/api/bridge/fs/write', { path: REMOTE, content: '你好' });
    expect(ok.status).toBe(200);
    expect(ok.body).toEqual({ ok: true, path: REMOTE, bytes: Buffer.byteLength('你好', 'utf8') });
    expect(service.writeFile).toHaveBeenCalledWith(REMOTE, '你好');
  });

  it('pushes a local file via fastPut and reports its size', async () => {
    const sftp = makeSftp();
    const base = await startApp(makeDeps({ getSession: () => makeSession({ sftp }) }));
    const localPath = path.join(tmpDir, 'upload.txt');
    fs.writeFileSync(localPath, 'push me');

    const res = await post(base, '/api/bridge/fs/push', { localPath, remotePath: REMOTE });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true, localPath, remotePath: REMOTE, bytes: 7 });
    expect(sftp.fastPut).toHaveBeenCalledWith(localPath, REMOTE, expect.any(Function));
  });

  it('rejects push when the local file is missing, a directory, or too large', async () => {
    const base = await startApp(makeDeps());

    const missing = await post(base, '/api/bridge/fs/push', { localPath: path.join(tmpDir, 'nope.txt'), remotePath: REMOTE });
    expect(missing.status).toBe(400);
    expect(missing.body.error).toBe('invalid_request');

    const dir = await post(base, '/api/bridge/fs/push', { localPath: tmpDir, remotePath: REMOTE });
    expect(dir.status).toBe(400);

    const bigPath = path.join(tmpDir, 'big.bin');
    fs.writeFileSync(bigPath, Buffer.alloc(1));
    const realStat = fs.statSync;
    const statSpy = vi.spyOn(fs, 'statSync').mockImplementation(((p: fs.PathLike, opts?: unknown) => {
      const stat = realStat(p as string, opts as never);
      if (String(p) === bigPath) return { ...stat, isFile: () => true, size: 513 * 1024 * 1024 };
      return stat;
    }) as typeof fs.statSync);
    try {
      const tooLarge = await post(base, '/api/bridge/fs/push', { localPath: bigPath, remotePath: REMOTE });
      expect(tooLarge.status).toBe(413);
      expect(tooLarge.body).toEqual({ error: 'too_large' });
    } finally {
      statSpy.mockRestore();
    }
  });

  it('returns ok:false when fastPut fails', async () => {
    const sftp = makeSftp({
      fastPut: vi.fn((_l: string, _r: string, cb: (err?: Error | null) => void) => cb(new Error('disk quota exceeded'))),
    });
    const base = await startApp(makeDeps({ getSession: () => makeSession({ sftp }) }));
    const localPath = path.join(tmpDir, 'upload.txt');
    fs.writeFileSync(localPath, 'x');

    const res = await post(base, '/api/bridge/fs/push', { localPath, remotePath: REMOTE });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: false, error: 'disk quota exceeded' });
  });

  it('refuses to overwrite an existing local file on pull without overwrite', async () => {
    const sftp = makeSftp();
    const service = makeService();
    const base = await startApp(makeDeps({
      getSession: () => makeSession({ sftp }),
      createSftpService: () => service,
    }));
    const localPath = path.join(tmpDir, 'exists.txt');
    fs.writeFileSync(localPath, 'old');

    const res = await post(base, '/api/bridge/fs/pull', { remotePath: REMOTE, localPath });
    expect(res.status).toBe(409);
    expect(res.body).toEqual({ error: 'exists' });
    expect(sftp.fastGet).not.toHaveBeenCalled();

    const overwrite = await post(base, '/api/bridge/fs/pull', { remotePath: REMOTE, localPath, overwrite: true });
    expect(overwrite.status).toBe(200);
    expect(overwrite.body).toEqual({ ok: true, remotePath: REMOTE, localPath, bytes: 5 });
    expect(sftp.fastGet).toHaveBeenCalledWith(REMOTE, localPath, expect.any(Function));
  });

  it('pulls a remote file via fastGet after stat confirms a file', async () => {
    const sftp = makeSftp();
    const service = makeService({ stat: vi.fn(async () => ({ kind: 'file', size: 1234 })) });
    const base = await startApp(makeDeps({
      getSession: () => makeSession({ sftp }),
      createSftpService: () => service,
    }));
    const localPath = path.join(tmpDir, 'download.txt');

    const res = await post(base, '/api/bridge/fs/pull', { remotePath: REMOTE, localPath });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true, remotePath: REMOTE, localPath, bytes: 1234 });
    expect(service.stat).toHaveBeenCalledWith(REMOTE);
    expect(sftp.fastGet).toHaveBeenCalledWith(REMOTE, localPath, expect.any(Function));
  });

  it('rejects pull of a remote directory with 400', async () => {
    const service = makeService({ stat: vi.fn(async () => ({ kind: 'directory', size: 0 })) });
    const base = await startApp(makeDeps({ createSftpService: () => service }));
    const localPath = path.join(tmpDir, 'download.txt');

    const res = await post(base, '/api/bridge/fs/pull', { remotePath: '/home/u/dir', localPath });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('invalid_request');
  });

  it('rejects local workspace escape and remote paths outside SSH home', async () => {
    const base = await startApp(makeDeps());
    const outside = path.join(os.tmpdir(), `outside-${Date.now()}.txt`);
    fs.writeFileSync(outside, 'secret');
    try {
      const push = await post(base, '/api/bridge/fs/push', { localPath: outside, remotePath: REMOTE });
      expect(push.body.ok).toBe(false);
      expect(push.body.error).toContain('outside the selected workspace');
      const read = await post(base, '/api/bridge/fs/read', { path: '/etc/passwd' });
      expect(read.body.ok).toBe(false);
      expect(read.body.error).toContain('outside the authorized root');
    } finally {
      fs.rmSync(outside, { force: true });
    }
  });

  it('applies state_changes confirmation policy to file writes and transfers', async () => {
    const base = await startApp(makeDeps({
      getDshSessionBinding: () => ({
        dshSessionId: DSH_SESSION, sshSessionId: 'ssh-1', workspaceRoot: tmpDir,
        conversationKey: 'ssh-1:chat', confirmationPolicy: 'state_changes', updatedAt: Date.now(),
      }),
    }));
    const res = await post(base, '/api/bridge/fs/write', { path: REMOTE, content: 'x' });
    expect(res.status).toBe(428);
    expect(res.body).toEqual({ error: 'confirmation_required', risk: 'write', action: 'write' });
    expect((await post(base, '/api/bridge/fs/read', { path: REMOTE })).status).toBe(200);
  });
});
