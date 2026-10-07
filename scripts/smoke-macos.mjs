import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import { spawn, spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';

if (process.platform !== 'darwin' || !process.env.CI) throw new Error('Run the Mac package smoke test only on the isolated CI runner');
const output = path.resolve(`release-mac-${process.arch}`);
const app = path.join(output, process.arch === 'arm64' ? 'mac-arm64' : 'mac', 'HPClaw.app');
const resources = path.join(app, 'Contents', 'Resources');
const bundledNode = path.join(resources, 'app.asar.unpacked', 'vendor', 'node-runtime', 'node');
const dshBin = path.join(resources, 'app.asar.unpacked', 'vendor', 'dsh', 'lib', 'bin.js');
assert(fs.existsSync(bundledNode), 'Packaged standalone Node missing');
const cli = spawnSync(bundledNode, [dshBin, '--help'], { encoding: 'utf8', timeout: 30000 });
assert.equal(cli.status, 0, cli.stderr);
const port = await new Promise(resolve => {
  const server = net.createServer();
  server.listen(0, '127.0.0.1', () => { const value = server.address().port; server.close(() => resolve(value)); });
});
const appEnv = { ...process.env, PORT: String(port), HPCLAW_WEB_MODE: '', HPCLAW_HOST: '' };
delete appEnv.ELECTRON_RUN_AS_NODE;
const child = spawn(path.join(app, 'Contents', 'MacOS', 'HPClaw'), [], {
  env: appEnv,
  stdio: ['ignore', 'pipe', 'pipe'],
});
let log = '';
child.stdout.on('data', value => { log += value; });
child.stderr.on('data', value => { log += value; });
const exited = new Promise(resolve => child.once('exit', resolve));
try {
  let ready = false;
  for (let index = 0; index < 120; index++) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/api/app-info`);
      if (response.ok && (await response.json()).capabilities.cluster) { ready = true; break; }
    } catch {}
    if (child.exitCode !== null) throw new Error('Packaged Mac app exited: ' + log.slice(-4000));
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  assert(ready, 'Packaged Mac app backend did not start');
  const html = await fetch(`http://127.0.0.1:${port}/`);
  assert.equal(html.status, 200);
  assert((await html.text()).includes('/assets/index-'));
  console.log('[mac smoke] Packaged Electron backend, frontend and bundled DSH CLI passed:', process.arch);
} finally {
  child.kill('SIGTERM');
  await Promise.race([exited, new Promise(resolve => setTimeout(resolve, 5000))]);
  if (child.exitCode === null) { child.kill('SIGKILL'); await exited; }
}
