// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import express from 'express';
import { createServer } from 'node:http';
import { createPublicGateway, type PrivateWorker } from './gateway';
import { classifyAddress, resolveClusterAddress } from './network';
import { publicRouteAllowed } from './policy';

const cleanups: (() => Promise<void>)[] = [];
afterEach(async () => { await Promise.all(cleanups.splice(0).map(fn => fn())); });
async function setup() {
  const workers: PrivateWorker[] = [];
  const gateway = createPublicGateway({ root: process.cwd(), origin: 'http://127.0.0.1:3003',
    resolveAddress: async () => '8.8.8.8', createWorker: async identity => {
      const app = express(); app.use(express.json());
      const id = `cluster-${workers.length}`;
      const token = `private-${id}`;
      app.use((req, res, next) => req.get('X-HPClaw-Worker') === token ? next() : res.sendStatus(403));
      app.post('/api/login', (_req, res) => res.json({ success: true, sessionId: id, home: `/home/${id}` }));
      app.all('/api/*', (req, res) => res.json({ worker: id, url: req.originalUrl, body: req.body }));
      app.all('/socket.io/*', (_req, res) => res.send(id));
      const server = createServer(app); await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
      const worker = { identity, sessionId: id, port: (server.address() as any).port, token,
        stop: vi.fn(async () => { await new Promise<void>(resolve => server.close(() => resolve())); }) };
      workers.push(worker); return worker;
    } });
  await new Promise<void>(resolve => gateway.server.listen(0, '127.0.0.1', resolve));
  cleanups.push(gateway.close);
  const base = `http://127.0.0.1:${(gateway.server.address() as any).port}`;
  const login = async (username: string, cookie = '') => {
    const response = await fetch(base + '/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie },
      body: JSON.stringify({ host: 'example.org', port: 22, username, password: 'private-cluster-password' }) });
    return { cookie: response.headers.get('set-cookie')?.split(';')[0] || cookie, ...await response.json() };
  };
  return { base, login, workers };
}

describe('public cluster portal boundaries', () => {
  it('opens the login page without a shared password, but protects APIs', async () => {
    const { base } = await setup();
    expect((await fetch(base + '/api/app-info')).status).toBe(200);
    expect((await fetch(base + '/api/conversations')).status).toBe(401);
    expect((await fetch(base + '/api/local/files/view')).status).toBe(403);
    expect((await fetch(base + '/api/LOCAL/files/view')).status).toBe(403);
    expect((await fetch(base + '/api/transfers')).status).toBe(403);
    expect((await fetch(base + '/api/desktop/connect')).status).toBe(403);
  });
  it('isolates two visitors for HTTP, resources, Socket.IO and logout', async () => {
    const { base, login, workers } = await setup();
    const a = await login('alice'); const b = await login('bob');
    const own = await fetch(base + '/api/conversations', { headers: { Cookie: a.cookie, 'X-SSH-Session-Id': a.sessionId } });
    expect((await own.json()).worker).toBe(a.sessionId);
    for (const url of ['/api/conversations?scope=' + b.sessionId,
      '/api/files/html-assets/' + b.sessionId + '/token/index.css', '/socket.io/?hpclawCluster=' + b.sessionId]) {
      expect((await fetch(base + url, { headers: { Cookie: a.cookie } })).status).toBe(401);
    }
    expect((await fetch(base + '/api/conversations', { headers: { Cookie: a.cookie, 'X-SSH-Session-Id': b.sessionId } })).status).toBe(401);
    expect((await fetch(base + '/socket.io/?hpclawCluster=' + a.sessionId, { headers: { Cookie: a.cookie } })).status).toBe(200);
    await fetch(base + '/api/logout', { method: 'POST', headers: { Cookie: a.cookie } });
    expect(workers[0].stop).toHaveBeenCalledOnce(); expect(workers[1].stop).not.toHaveBeenCalled();
    expect((await fetch(base + '/api/jobs', { headers: { Cookie: b.cookie } })).status).toBe(200);
  });
  it('routes two clusters owned by one visitor, never to a stale or local scope', async () => {
    const { base, login } = await setup(); const a = await login('alice'); const b = await login('other', a.cookie);
    const own = await fetch(base + '/api/files/html-assets/' + a.sessionId + '/token/a.css', { headers: { Cookie: a.cookie } });
    expect((await own.json()).worker).toBe(a.sessionId);
    const stale = await fetch(base + '/api/conversations?scope=local-workbench', { headers: { Cookie: a.cookie } });
    expect(stale.status).toBe(401);
    const mutation = await fetch(base + '/api/conversations', { method: 'POST', headers: { Cookie: a.cookie, 'Content-Type': 'application/json', 'X-SSH-Session-Id': a.sessionId }, body: JSON.stringify({ scopeKey: b.sessionId }) });
    expect(mutation.status).toBe(401);
  });
  it('rejects cross-site login and mutations', async () => {
    const { base, login } = await setup(); const a = await login('alice');
    expect((await fetch(base + '/api/login', { method: 'POST', headers: { Origin: 'https://evil.test' } })).status).toBe(403);
    expect((await fetch(base + '/api/logout', { method: 'POST', headers: { Cookie: a.cookie, Origin: 'null' } })).status).toBe(403);
  });
  it('refuses public plaintext deployments by default', () => {
    expect(() => createPublicGateway({ root: '.', origin: 'http://example.org' })).toThrow('HTTPS');
    expect(() => createPublicGateway({ root: '.', origin: 'https://example.org/path' })).toThrow('origin');
  });
  it('blocks loopback, metadata, mapped IPv6 and mixed DNS answers; pins approved SSH', async () => {
    for (const ip of ['127.0.0.1', '0.0.0.0', '169.254.169.254', '::1', '::ffff:7f00:1', '64:ff9b::7f00:1']) expect(classifyAddress(ip)).toBe('blocked');
    expect(classifyAddress('10.0.0.2')).toBe('private'); expect(classifyAddress('8.8.8.8')).toBe('public');
    await expect(resolveClusterAddress('10.0.0.2')).rejects.toThrow();
    expect(await resolveClusterAddress('10.0.0.2', true)).toBe('10.0.0.2');
    await expect(resolveClusterAddress('127.0.0.1', true)).rejects.toThrow();
    await expect(resolveClusterAddress('example.org', false, (async () => [{ address: '8.8.8.8' }, { address: '127.0.0.1' }]) as any)).rejects.toThrow();
    expect(await resolveClusterAddress('example.org', false, (async () => [{ address: '8.8.8.8' }]) as any)).toBe('8.8.8.8');
    expect(publicRouteAllowed('/api/bridge/exec')).toBe(false);
  });
});
