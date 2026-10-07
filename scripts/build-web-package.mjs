import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

if (process.platform !== 'linux' || process.arch !== 'x64') throw new Error('The Linux x64 deployment package must be prepared and verified on Linux x64');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const output = path.join(root, 'release-web');
fs.mkdirSync(output, { recursive: true });
const name = `HPClaw-${pkg.version}-web-linux-x64`;
const stage = path.join(output, name);
if (fs.existsSync(stage)) throw new Error('Web staging directory already exists; use a fresh checkout for reproducible packaging');
fs.mkdirSync(stage);
const skip = /(?:^|[\\/])(?:node-runtime|[^\\/]*win32[^\\/]*|[^\\/]*darwin[^\\/]*)(?:[\\/]|$)/;
for (const directory of ['dist', 'dist-electron', 'skills', 'lsf_skills', 'pipelines', 'demo-assets', 'vendor']) {
  fs.cpSync(path.join(root, directory), path.join(stage, directory), {
    recursive: true, filter: file => directory !== 'vendor' || (!skip.test(path.relative(path.join(root, 'vendor'), file))
      && !file.endsWith('.exe') && !file.endsWith('.cmd') && !file.endsWith('.ps1')),
  });
}
// An immutable deployment manifest installs only the external backend dependency.
fs.writeFileSync(path.join(stage, 'package.json'), JSON.stringify({
  name: 'hpclaw-web', version: pkg.version, private: true, type: 'module',
  engines: { node: '>=22' }, scripts: { start: 'node scripts/start-web.mjs' }, dependencies: { ssh2: '1.17.0' },
}, null, 2));
const lock = spawnSync('npm', ['install', '--package-lock-only', '--ignore-scripts', '--omit=dev', '--no-audit', '--no-fund'], { cwd: stage, stdio: 'inherit' });
if (lock.status !== 0) throw new Error('Web lockfile generation failed');
fs.mkdirSync(path.join(stage, 'scripts'));
for (const file of ['start-web.mjs', 'web-runtime-config.mjs']) {
  fs.copyFileSync(path.join(root, 'scripts', file), path.join(stage, 'scripts', file));
}
for (const file of ['Dockerfile', 'compose.yaml', 'deploy.sh', '.dockerignore']) {
  fs.copyFileSync(path.join(root, 'deploy', 'web', file), path.join(stage, file));
}
fs.chmodSync(path.join(stage, 'deploy.sh'), 0o755);
fs.copyFileSync(path.join(root, 'docs', 'MAC_WEB_DEPLOYMENT.md'), path.join(stage, 'README.md'));
fs.writeFileSync(path.join(stage, 'BUILD-INFO.json'), JSON.stringify({
  version: pkg.version, platform: 'linux-x64', sourceCommit: process.env.GITHUB_SHA || '',
  builtAt: new Date().toISOString(), singleUser: true,
}, null, 2));
const archive = path.join(output, `${name}.tar.gz`);
const result = spawnSync('tar', ['-czf', archive, '-C', output, name], { stdio: 'inherit' });
if (result.status !== 0) throw new Error('Web deployment archive failed');
const checked = spawnSync('tar', ['-tzf', archive], { stdio: 'ignore' });
if (checked.status !== 0) throw new Error('Web archive verification failed');
const hash = crypto.createHash('sha256').update(fs.readFileSync(archive)).digest('hex');
fs.writeFileSync(archive + '.sha256', `${hash}  ${path.basename(archive)}\n`);
console.log('[web] Deployment archive verified:', archive);
