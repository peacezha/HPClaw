import http from 'node:http';
import express from 'express';
import session from 'express-session';
import { afterEach, describe, expect, it } from 'vitest';
import { createWebAccess, readWebAccessConfig, type WebAccessConfig } from './webAccess';

const servers: http.Server[] = [];
afterEach(async () => {
  await Promise.all(servers.splice(0).map(server => new Promise<void>(resolve => server.close(() => resolve()))));
});
const password = 'test-password-at-least-16';
const authorization = 'Basic ' + Buffer.from('hpclaw:' + password).toString('base64');
const config: WebAccessConfig = { enabled: true, host: '127.0.0.1', username: 'hpclaw', password, origin: 'https://hpclaw.example.org' };
async function start() {
  const app = express();
  const access = createWebAccess(config, () => 'trusted-random-bridge-token');
  app.use(session({ secret: 'test-session-secret-at-least-32-chars', resave: false, saveUninitialized: false }));
  app.use(access.middleware);
  app.all('*', (_req, res) => res.json({ ok: true }));
  const server = http.createServer(app);
  servers.push(server);
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address() as { port: number };
  return { base: `http://127.0.0.1:${address.port}`, access };
}

describe('single-user web access', () => {
  it('keeps desktop mode on loopback without introducing browser login', () => {
    expect(readWebAccessConfig({ HPCLAW_HOST: '0.0.0.0' })).toMatchObject({ enabled: false, host: '127.0.0.1' });
  });
  it('rejects missing/weak credentials, weak sessions and unconfigured public origins', () => {
    expect(() => readWebAccessConfig({ HPCLAW_WEB_MODE: '1' })).toThrow('PASSWORD');
    const env = { HPCLAW_WEB_MODE: '1', HPCLAW_WEB_PASSWORD: password, SESSION_SECRET: 'x'.repeat(32), HPCLAW_HOST: '0.0.0.0' };
    expect(() => readWebAccessConfig(env)).toThrow('ORIGIN');
    expect(() => readWebAccessConfig({ ...env, HPCLAW_WEB_ORIGIN: 'https://u:p@example.org' })).toThrow('origin');
    expect(() => readWebAccessConfig({ ...env, HPCLAW_WEB_ORIGIN: 'https://example.org/path' })).toThrow('origin');
    expect(() => readWebAccessConfig({ ...env, SESSION_SECRET: 'short' })).toThrow('SESSION_SECRET');
    expect(readWebAccessConfig({ ...env, HPCLAW_WEB_ORIGIN: 'https://example.org/' }).origin).toBe('https://example.org');
  });
  it('guards both static pages and application endpoints before authentication', async () => {
    const { base } = await start();
    for (const route of ['/', '/api/local/files/html/document', '/api/ai/profile', '/api/conversations']) {
      const response = await fetch(base + route);
      expect(response.status).toBe(401);
      expect(response.headers.get('www-authenticate')).toContain('Basic');
    }
    expect((await fetch(base, { headers: { Authorization: 'Basic invalid' } })).status).toBe(401);
  });
  it('authenticates HTTP credentials and reuses the signed browser session', async () => {
    const { base } = await start();
    const response = await fetch(base, { headers: { Authorization: authorization } });
    expect(response.status).toBe(200);
    const cookie = response.headers.get('set-cookie')?.split(';')[0];
    expect(cookie).toBeTruthy();
    expect((await fetch(base + '/api/app-info', { headers: { Cookie: cookie! } })).status).toBe(200);
    expect((await fetch(base, { headers: { Cookie: 'connect.sid=forged' } })).status).toBe(401);
  });
  it('denies cross-origin mutations even with valid credentials', async () => {
    const { base } = await start();
    for (const origin of ['https://attacker.example', 'null']) {
      expect((await fetch(base + '/api/login', { method: 'POST', headers: { Authorization: authorization, Origin: origin } })).status).toBe(403);
    }
    expect((await fetch(base + '/api/login', { method: 'POST', headers: { Authorization: authorization, Origin: config.origin! } })).status).toBe(200);
  });
  it('only exempts token-authenticated loopback bridge routes, not other APIs', async () => {
    const { base } = await start();
    expect((await fetch(base + '/api/bridge/exec', { method: 'POST', headers: { 'X-HPClaw-Bridge': 'wrong' } })).status).toBe(401);
    const headers = { 'X-HPClaw-Bridge': 'trusted-random-bridge-token' };
    expect((await fetch(base + '/api/bridge/exec', { method: 'POST', headers })).status).toBe(200);
    expect((await fetch(base + '/api/local/files/read', { method: 'POST', headers })).status).toBe(401);
  });
  it('requires authentication and an exact approved origin for terminal sockets', () => {
    const access = createWebAccess(config, () => 'token');
    expect(access.authorized({ headers: {} })).toBe(false);
    expect(access.authorized({ headers: { authorization } })).toBe(true);
    expect(access.authorized({ headers: {}, session: { hpclawWebAccess: 'forged' } })).toBe(false);
    expect(access.originAllowed(config.origin)).toBe(true);
    expect(access.originAllowed('https://hpclaw.example.org.attacker.example')).toBe(false);
    expect(access.originAllowed('null')).toBe(false);
  });
});
