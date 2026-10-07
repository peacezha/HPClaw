import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import net from 'node:net';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';

const appRoot = path.resolve(process.argv[2] || '.');
const dataRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'hpclaw-web-smoke-'));
const port = await new Promise(resolve => {
  const server = net.createServer();
  server.listen(0, '127.0.0.1', () => { const port = server.address().port; server.close(() => resolve(port)); });
});
const base = `http://127.0.0.1:${port}`;
const child = spawn(process.execPath, [path.join(appRoot, 'scripts', 'start-web.mjs')], {
  cwd: appRoot, env: { ...process.env, HPCLAW_DATA_ROOT: dataRoot, PORT: String(port),
    HPCLAW_HOST: '127.0.0.1', HPCLAW_WEB_ORIGIN: base, HPCLAW_PARENT_PID: '' },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let log = '';
child.stdout.on('data', chunk => { log += chunk; });
child.stderr.on('data', chunk => { log += chunk; });
const exited = new Promise(resolve => child.once('exit', resolve));
try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    try { if ((await fetch(base + '/healthz')).ok) { ready = true; break; } } catch {}
    if (child.exitCode !== null) throw new Error('Web backend exited: ' + log.slice(-4000));
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert(ready, 'Web backend did not become ready');
  assert.equal((await fetch(base + '/api/app-info')).status, 401);
  assert.equal((await fetch(base + '/')).status, 401);
  const credentials = JSON.parse(fs.readFileSync(path.join(dataRoot, 'web-access.json'), 'utf8'));
  const headers = { Authorization: 'Basic ' + Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64') };
  const appInfo = await fetch(base + '/api/app-info', { headers });
  assert.equal(appInfo.status, 200);
  assert.equal((await appInfo.json()).capabilities.cluster, true);
  const cookie = appInfo.headers.get('set-cookie')?.split(';')[0];
  assert(cookie, 'Authenticated session cookie missing');
  assert.equal((await fetch(base + '/api/app-info', { headers: { Cookie: cookie } })).status, 200);
  assert.equal((await fetch(base + '/api/local/files/html/resolve', {
    method: 'POST', headers: { ...headers, Origin: 'https://untrusted.example', 'Content-Type': 'application/json' }, body: '{}',
  })).status, 403);
  const report = path.join(dataRoot, 'report.html');
  fs.writeFileSync(report, '<html><head></head><body>HPCLAW_REPORT_OK</body></html>');
  const resolved = await fetch(base + '/api/local/files/html/resolve', {
    method: 'POST', headers: { ...headers, Origin: base, 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: report, workspace: dataRoot }),
  });
  assert.equal(resolved.status, 200);
  const document = await fetch(base + '/api/local/files/html/document?' + new URLSearchParams({ path: report, workspace: dataRoot, scripts: '1' }), { headers });
  assert.equal(document.status, 200);
  assert((await document.text()).includes('HPCLAW_REPORT_OK'));
  const html = await fetch(base, { headers });
  assert.equal(html.status, 200);
  assert((await html.text()).includes('/assets/index-'));
  console.log('[smoke] Web startup, access guard, cookie session, CSRF, report streaming and classic UI passed');
} finally {
  child.kill('SIGTERM');
  await Promise.race([exited, new Promise(resolve => setTimeout(resolve, 5000))]);
  if (child.exitCode === null) { child.kill('SIGKILL'); await exited; }
  fs.rmSync(dataRoot, { recursive: true, force: true });
}
