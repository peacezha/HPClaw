import assert from 'node:assert/strict';
import path from 'node:path';
import net from 'node:net';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';
import fs from 'node:fs';

const root = path.resolve(process.argv[2]);
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (Number(pkg.version.split('.')[2]) >= 51) {
  const frontend = fs.readdirSync(path.join(root, 'dist/assets')).filter(name => name.endsWith('.js')).map(name => fs.readFileSync(path.join(root, 'dist/assets', name), 'utf8')).join('\n');
  assert(frontend.includes('records · complete history'));
  assert(frontend.includes('Expand execution details'));
  assert(frontend.includes('Validating outputs automatically'));
  assert(fs.existsSync(path.join(root, 'third-party/elkjs/LICENSE.md')));
  assert(!fs.existsSync(path.join(root, 'dist/qa/chat-continuity.html')));
}
const reservation = net.createServer();
await new Promise(resolve => reservation.listen(0, '127.0.0.1', resolve));
const port = reservation.address().port;
await new Promise(resolve => reservation.close(resolve));
const origin = 'http://127.0.0.1:' + port;
// Run the deployment's real launcher, not the source gateway factory.
const child = spawn(process.execPath, ['scripts/start-public-web.mjs'], {
  cwd: root, stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, PORT: String(port), HPCLAW_HOST: '127.0.0.1', HPCLAW_WEB_ORIGIN: origin },
});
const exited = once(child, 'exit');
let output = '';
child.stdout.on('data', chunk => { output += chunk; });
child.stderr.on('data', chunk => { output += chunk; });
try {
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    if (child.exitCode !== null) throw new Error('Packaged launcher exited: ' + output);
    try {
      const response = await fetch(origin, { signal: AbortSignal.timeout(1000) });
      if (response.ok) {
        assert((await response.text()).includes('window.hpclawPublicWeb=true'));
        ready = true;
        break;
      }
    } catch { /* startup may still be in progress */ }
    await delay(100);
  }
  assert(ready, 'Packaged launcher did not serve public HTML: ' + output);
  assert.equal((await fetch(origin + '/api/conversations')).status, 401);
  console.log('[smoke] Real deployment launcher and public HTML/API passed on Node.js ' + process.versions.node);
} finally {
  child.kill('SIGTERM');
  const timer = setTimeout(() => child.kill('SIGKILL'), 5000);
  await exited;
  clearTimeout(timer);
}
