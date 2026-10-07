import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import { io } from 'socket.io-client';
import { createPublicGateway, spawnPrivateWorker, type PrivateWorker } from '../server/publicWeb/gateway';

if (process.env.GITHUB_ACTIONS !== 'true' || process.platform !== 'linux') throw new Error('Real SSH integration uses only isolated CI fixtures');
const root = path.resolve(process.argv[2]);
const workers: PrivateWorker[] = [];
const gateway = createPublicGateway({ root, origin: 'http://127.0.0.1:3003',
  // Explicit fixture injection, not present in the production entry point. Production rejects loopback SSH.
  resolveAddress: async () => '127.0.0.1',
  createWorker: async (...args) => { const worker = await spawnPrivateWorker(root, ...args); workers.push(worker); return worker; },
});
await new Promise<void>(resolve => gateway.server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${(gateway.server.address() as any).port}`;
const login = async (letter: 'A' | 'B') => {
  const credentials = { host: 'fixture.hpclaw.test', port: 22222,
    username: process.env[`HPCLAW_SMOKE_USER_${letter}`], password: process.env[`HPCLAW_SMOKE_PASSWORD_${letter}`] };
  assert(credentials.username && credentials.password, 'Missing isolated credentials');
  let response = await fetch(base + '/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(credentials) });
  const cookie = response.headers.get('set-cookie')!.split(';')[0];
  let result = await response.json();
  assert.equal(response.status, 428, 'First login must require host fingerprint');
  response = await fetch(base + '/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: JSON.stringify({ ...credentials, expectedFingerprint: result.fingerprint }) });
  result = await response.json();
  assert.equal(response.status, 200, 'Authenticated fixture login must succeed');
  assert(result.success && result.home?.startsWith('/home/'), 'Private cluster state must attach');
  return { cookie, sid: result.sessionId as string, home: result.home as string };
};
const request = (user: Awaited<ReturnType<typeof login>>, url: string, method = 'GET', value?: unknown) => fetch(base + url, {
  method, headers: { Cookie: user.cookie, 'X-SSH-Session-Id': user.sid, ...(value !== undefined ? { 'Content-Type': 'application/json' } : {}) },
  ...(value !== undefined ? { body: JSON.stringify(value) } : {}), signal: AbortSignal.timeout(45000),
});
try {
  assert.equal((await fetch(base + '/api/conversations')).status, 401);
  assert((await (await fetch(base)).text()).includes('window.hpclawPublicWeb=true'));
  const alice = await login('A'); const bob = await login('B');
  assert.equal(workers.length, 2, 'Fingerprint retry must reuse the pending worker');
  assert.equal((await fetch(`http://127.0.0.1:${workers[0].port}/api/public/profile`)).status, 403, 'Direct worker access forbidden');
  assert.equal((await fetch(base + '/api/conversations?scope=' + bob.sid, { headers: { Cookie: alice.cookie } })).status, 401);
  assert.equal((await request(alice, '/api/local/files/view')).status, 403);
  const profile = { provider: 'custom-openai', model: 'fixture-model', apiKey: 'fixture-only-not-a-real-key', baseUrl: 'https://example.org/v1' };
  assert((await request(alice, '/api/ai-profile', 'POST', { profile })).ok);
  assert.equal((await (await request(alice, '/api/public/profile')).json()).profile.apiKey, profile.apiKey);
  assert(!(await (await request(bob, '/api/public/profile')).json()).profile?.apiKey, 'API profiles are private');
  assert((await request(alice, '/api/public/preferences', 'PUT', { key: 'hpclaw_workflow_run_config_v1:fixture', value: '{"input":"cluster-owned"}' })).ok);
  const saved = await (await request(alice, '/api/conversations', 'POST', { title: 'CI cluster archive', messages: [{ role: 'user', content: 'cluster-owned conversation' }] })).json();
  assert(saved.success); const conversationId = saved.conversation.id;
  assert.equal((await request(bob, '/api/conversations/' + conversationId)).status, 404);
  const remotePath = alice.home + '/report.html';
  const report = '<html><head></head><body>HPCLAW_PUBLIC_REMOTE_REPORT</body></html>';
  const upload = await fetch(base + '/api/public/upload?path=' + encodeURIComponent(remotePath), { method: 'POST', headers: {
    Cookie: alice.cookie, 'X-SSH-Session-Id': alice.sid, 'Content-Type': 'application/octet-stream' }, body: report });
  assert(upload.ok, 'Browser upload streams to real SFTP');
  assert.equal(await (await request(alice, '/api/files/download?path=' + encodeURIComponent(remotePath))).text(), report);
  assert((await (await request(alice, '/api/files/html/document?path=' + encodeURIComponent(remotePath) + '&sessionId=' + alice.sid)).text()).includes('HPCLAW_PUBLIC_REMOTE_REPORT'));
  const socket = io(base, { transports: ['websocket'], auth: { sessionId: alice.sid }, query: { hpclawCluster: alice.sid },
    extraHeaders: { Cookie: alice.cookie }, reconnection: false, timeout: 10000 });
  try {
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Real WebSocket SSH terminal timed out')), 15000);
      const marker = 'HPCLAW_TERMINAL_' + Date.now();
      socket.on('shell:ready', () => socket.emit('data', `printf '${marker}\\n'\n`));
      socket.on('data', value => { if (String(value).includes(marker)) { clearTimeout(timer); resolve(); } });
      socket.on('connect_error', () => { clearTimeout(timer); reject(new Error('WebSocket handshake failed')); });
    });
  } finally { socket.disconnect(); }
  assert((await request(alice, '/api/logout', 'POST')).ok);
  assert((await request(bob, '/api/public/session')).ok, 'Alice logout must not affect Bob');
  const restored = await login('A');
  assert.equal((await (await request(restored, '/api/public/profile')).json()).profile.apiKey, profile.apiKey, 'API key restored from cluster, not shared server');
  const restoredProfile = await (await request(restored, '/api/public/profile')).json();
  assert.equal(restoredProfile.preferences['hpclaw_workflow_run_config_v1:fixture'], '{"input":"cluster-owned"}');
  const list = await (await request(restored, '/api/conversations')).json();
  assert(list.conversations.some((item: any) => item.id === conversationId), 'Conversation survives worker replacement');
  assert((await request(restored, '/api/logout', 'POST')).ok);
  assert((await request(bob, '/api/logout', 'POST')).ok);
  await Promise.all(workers.map(worker => worker.stop()));
  assert(!fs.existsSync(path.join(root, 'ai-profile.json')), 'No shared deployment settings file');
  console.log('[smoke] Packaged public gateway, two real SSH accounts, fingerprint reuse, ownership, SFTP upload/download, remote HTML, WebSocket terminal and cluster persistence passed');
} finally { await gateway.close(); }
