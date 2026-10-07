import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { minimumNodeVersion } from './public-web-runtime.mjs';

if (process.platform !== 'linux' || process.arch !== 'x64') throw new Error('Build and verify the public web archive on Linux x64');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { version } = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const output = path.join(root, 'release-public-web');
const name = `HPClaw-${version}-public-web-linux-x64-node20`;
const stage = path.join(output, name);
if (fs.existsSync(stage)) throw new Error('Use a fresh checkout: staging directory already exists');
fs.mkdirSync(stage, { recursive: true });
for (const directory of ['dist', 'dist-electron', 'skills', 'lsf_skills', 'pipelines', 'demo-assets']) {
  fs.cpSync(path.join(root, directory), path.join(stage, directory), { recursive: true });
}
fs.mkdirSync(path.join(stage, 'scripts'));
for (const script of ['start-public-web.mjs', 'public-web-runtime.mjs']) {
  fs.copyFileSync(path.join(root, 'scripts', script), path.join(stage, 'scripts', script));
}
fs.copyFileSync(path.join(root, 'docs/PUBLIC_WEB_DEPLOYMENT.md'), path.join(stage, 'README.md'));
fs.writeFileSync(path.join(stage, 'package.json'), JSON.stringify({ name: 'hpclaw-public-web', version,
  private: true, type: 'module', engines: { node: '>=' + minimumNodeVersion },
  scripts: { start: 'node scripts/start-public-web.mjs', 'web:start': 'node scripts/start-public-web.mjs' },
  dependencies: { ssh2: '1.17.0' },
}, null, 2));
const lock = spawnSync('npm', ['install', '--package-lock-only', '--ignore-scripts', '--omit=dev', '--no-audit', '--no-fund'], { cwd: stage, stdio: 'inherit' });
if (lock.status !== 0) throw new Error('Deployment lockfile generation failed');
fs.writeFileSync(path.join(stage, 'BUILD-INFO.json'), JSON.stringify({ version, flavor: 'public-web',
  platform: 'linux-x64', minimumNodeVersion, sourceCommit: process.env.GITHUB_SHA || '', builtAt: new Date().toISOString(),
  clusterOwnedPersistence: true, sharedSitePassword: false, localWorkspace: false,
}, null, 2));
const archive = path.join(output, `${name}.tar.gz`);
if (spawnSync('tar', ['-czf', archive, '-C', output, name], { stdio: 'inherit' }).status !== 0
  || spawnSync('tar', ['-tzf', archive], { stdio: 'ignore' }).status !== 0) throw new Error('Archive verification failed');
const hash = crypto.createHash('sha256').update(fs.readFileSync(archive)).digest('hex');
fs.writeFileSync(archive + '.sha256', `${hash}  ${path.basename(archive)}\n`);
console.log('Public npm deployment package verified:', archive);
