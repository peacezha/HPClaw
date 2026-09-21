import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { getPath7za } from 'app-builder-lib/out/toolsets/7zip.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const releaseDir = path.join(root, 'release-competition');
const installer = path.join(releaseDir, `HPClaw-Competition-Setup-${pkg.version}-x64.exe`);
const blockmap = `${installer}.blockmap`;
const latest = path.join(releaseDir, 'latest.yml');
const sizeLimitBytes = 200_000_000;

function runNodeScript(script, args = [], env = process.env) {
  const result = spawnSync(process.execPath, [script, ...args], {
    cwd: root,
    env,
    stdio: 'inherit',
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

// release-competition is a dedicated generated directory. Validate its exact
// parent/name before recursively replacing it so this script can never remove
// the source tree or the full edition's release directory.
if (path.dirname(releaseDir) !== root || path.basename(releaseDir) !== 'release-competition') {
  throw new Error(`refusing to clean unexpected output directory: ${releaseDir}`);
}
fs.rmSync(releaseDir, { recursive: true, force: true });

const buildEnv = {
  ...process.env,
  HPCLAW_EDITION: 'competition',
  VITE_HPCLAW_EDITION: 'competition',
};
runNodeScript(path.join(root, 'node_modules', 'vite', 'bin', 'vite.js'), ['build', '--mode', 'competition'], buildEnv);
runNodeScript(path.join(root, 'scripts', 'build-electron-server.mjs'), [], buildEnv);

const electronDist = path.join(root, 'node_modules', 'electron', 'dist');
const builderCli = path.join(root, 'node_modules', 'electron-builder', 'cli.js');
const builderConfig = path.join(root, 'build', 'competition-builder.json');
const archiveModule = path.join(root, 'node_modules', 'app-builder-lib', 'out', 'targets', 'archive.js');
const archiveSource = fs.readFileSync(archiveModule, 'utf8');
const archiveNeedle = 'const args = debug7zArgs("a");';
const singleThreadArchive = `${archiveNeedle}\n    args.push("-mmt=1");`;
if (!archiveSource.includes(archiveNeedle)) {
  throw new Error(`cannot enable single-threaded 7-Zip: marker not found in ${archiveModule}`);
}

let built;
try {
  fs.writeFileSync(archiveModule, archiveSource.replace(archiveNeedle, singleThreadArchive));
  built = spawnSync(process.execPath, [
    builderCli,
    '--win',
    'nsis',
    '--config',
    builderConfig,
    '--config.compression=normal',
    `--config.electronDist=${electronDist}`,
  ], {
    cwd: root,
    env: { ...buildEnv, ELECTRON_BUILDER_COMPRESSION_LEVEL: '1' },
    stdio: 'inherit',
  });
} finally {
  fs.writeFileSync(archiveModule, archiveSource);
}
if (built.status !== 0) process.exit(built.status ?? 1);

for (const artifact of [installer, blockmap, latest]) {
  if (!fs.statSync(artifact).isFile() || fs.statSync(artifact).size === 0) {
    throw new Error(`competition installer artifact is missing or empty: ${artifact}`);
  }
}

const installerBytes = fs.statSync(installer).size;
if (installerBytes >= sizeLimitBytes) {
  throw new Error(`competition installer exceeds 200 MB: ${installerBytes} bytes`);
}

const unpackedResources = path.join(releaseDir, 'win-unpacked', 'resources');
for (const excluded of [path.join(unpackedResources, 'app.asar.unpacked', 'vendor')]) {
  if (fs.existsSync(excluded)) throw new Error(`competition package contains excluded development runtime: ${excluded}`);
}

// The NSIS extraction failure text misleadingly says the application cannot
// close, so validate the embedded archive before it can be delivered.
const sevenZip = await getPath7za();
const verified = spawnSync(sevenZip, ['t', installer], { cwd: root, stdio: 'inherit' });
if (verified.status !== 0) throw new Error(`installer CRC verification failed: ${installer}`);

console.log(`[competition] installer=${installer}`);
console.log(`[competition] size=${installerBytes} bytes (${(installerBytes / 1_000_000).toFixed(2)} MB)`);
console.log('[competition] CRC verification passed and excluded runtimes are absent');
