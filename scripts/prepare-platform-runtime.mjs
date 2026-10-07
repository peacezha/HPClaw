// Prepare only missing native optional packages; preserve the audited vendored DSH JS.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const modules = path.join(root, 'vendor', 'dsh', 'node_modules');
const { platform, arch } = process;
if (!['darwin', 'linux'].includes(platform) || !['arm64', 'x64'].includes(arch)) {
  throw new Error('Platform preparation requires native macOS/Linux arm64 or x64; do not copy Windows binaries to another OS');
}
const required = new Map();
for (const parent of ['node-addon-require-builtin', '@vscode/ripgrep', 'sharp']) {
  const pkg = JSON.parse(fs.readFileSync(path.join(modules, parent, 'package.json'), 'utf8'));
  for (const [name, version] of Object.entries(pkg.optionalDependencies || {})) {
    if (name.endsWith(`${platform}-${arch}`) || name.endsWith(`${platform}-${arch}-gnu`)) {
      if (!/^\d+\.\d+\.\d+(?:[-+].*)?$/.test(version)) throw new Error(`Unpinned optional dependency: ${name}@${version}`);
      required.set(name, version);
    }
  }
}
if (required.size < 4) throw new Error('Incomplete native runtime dependency inventory');
const stage = fs.mkdtempSync(path.join(os.tmpdir(), 'hpclaw-native-'));
try {
  fs.writeFileSync(path.join(stage, 'package.json'), JSON.stringify({ private: true, name: 'hpclaw-native-stage', version: '1.0.0' }));
  const installed = spawnSync('npm', ['install', '--prefix', stage, '--ignore-scripts', '--omit=dev', '--package-lock=false',
    '--no-audit', '--no-fund', ...[...required].map(([name, version]) => `${name}@${version}`)], { stdio: 'inherit' });
  if (installed.status !== 0) throw new Error('Native optional dependency installation failed');
  // Copy transitive native libraries too, but never replace the existing vendored JS package tree.
  for (const entry of fs.readdirSync(path.join(stage, 'node_modules'))) {
    if (entry.startsWith('.')) continue;
    const names = entry.startsWith('@')
      ? fs.readdirSync(path.join(stage, 'node_modules', entry)).map(name => `${entry}/${name}`) : [entry];
    for (const name of names) {
      const target = path.join(modules, name);
      if (!fs.existsSync(target)) fs.cpSync(path.join(stage, 'node_modules', name), target, { recursive: true });
    }
  }
} finally {
  // mkdtemp owns this exact directory; never remove a caller-supplied path.
  fs.rmSync(stage, { recursive: true, force: true });
}
const nodeRoot = path.join(root, 'vendor', 'node-runtime');
fs.mkdirSync(nodeRoot, { recursive: true });
fs.copyFileSync(process.execPath, path.join(nodeRoot, 'node'));
fs.chmodSync(path.join(nodeRoot, 'node'), 0o755);
const helper = path.join(modules, 'node-pty', 'prebuilds', `${platform}-${arch}`, 'spawn-helper');
if (fs.existsSync(helper)) fs.chmodSync(helper, 0o755);
const rg = path.join(modules, '@vscode', `ripgrep-${platform}-${arch}`, 'bin', 'rg');
if (fs.existsSync(rg)) fs.chmodSync(rg, 0o755);
const require = createRequire(path.join(modules, '_hpclaw_native_check.cjs'));
require('node-addon-require-builtin');
require('sharp');
const pty = require('node-pty').spawn('/bin/sh', ['-c', 'printf HPCLAW_PTY_OK'], { name: 'xterm', cols: 80, rows: 24 });
await new Promise((resolve, reject) => {
  let output = '';
  const timeout = setTimeout(() => { pty.kill(); reject(new Error('Native PTY timed out')); }, 10000);
  pty.onData(data => { output += data; });
  pty.onExit(({ exitCode }) => {
    clearTimeout(timeout);
    exitCode === 0 && output.includes('HPCLAW_PTY_OK') ? resolve() : reject(new Error('Native PTY smoke test failed'));
  });
});
console.log(`[platform] ${platform}-${arch}: Node, require-builtin, sharp, ripgrep and PTY prepared`);
