import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { getPath7za } from 'app-builder-lib/out/toolsets/7zip.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const releaseDir = path.join(root, 'release');
const intermediateArchive = path.join(releaseDir, `hpclaw-${pkg.version}-x64.nsis.7z`);
const installer = path.join(releaseDir, `HPClaw-Setup-${pkg.version}-x64.exe`);
const blockmap = `${installer}.blockmap`;

// electron-builder skips an archive whose timestamp looks current. A crashed
// 7-Zip process can leave a partial archive with a newer timestamp, so every
// installer build must remove these exact generated files first.
for (const generated of [intermediateArchive, installer, blockmap]) {
  fs.rmSync(generated, { force: true });
}

const electronDist = path.join(root, 'node_modules', 'electron', 'dist');
const builderCli = path.join(root, 'node_modules', 'electron-builder', 'cli.js');
const archiveModule = path.join(root, 'node_modules', 'app-builder-lib', 'out', 'targets', 'archive.js');
const archiveSource = fs.readFileSync(archiveModule, 'utf8');
const archiveNeedle = 'const args = debug7zArgs("a");';
const singleThreadArchive = `${archiveNeedle}\n    args.push("-mmt=1");`;
if (!archiveSource.includes(archiveNeedle)) {
  throw new Error(`cannot enable single-threaded 7-Zip: marker not found in ${archiveModule}`);
}

// On this build host 7-Zip 24.09 can return success while a multi-threaded
// LZMA/Deflate stream has a bad CRC. The same source archives correctly with
// -mmt=1. Patch only the installed build helper for this child build, then
// restore it even if electron-builder fails.
let built;
try {
  fs.writeFileSync(archiveModule, archiveSource.replace(archiveNeedle, singleThreadArchive));
  built = spawnSync(process.execPath, [
    builderCli,
    '--win',
    'nsis',
    '--config.compression=normal',
    `--config.electronDist=${electronDist}`,
  ], {
    cwd: root,
    env: { ...process.env, ELECTRON_BUILDER_COMPRESSION_LEVEL: '1' },
    stdio: 'inherit',
  });
} finally {
  fs.writeFileSync(archiveModule, archiveSource);
}
if (built.status !== 0) process.exit(built.status ?? 1);

for (const artifact of [installer, blockmap, path.join(releaseDir, 'latest.yml')]) {
  if (!fs.statSync(artifact).isFile() || fs.statSync(artifact).size === 0) {
    throw new Error(`installer artifact is missing or empty: ${artifact}`);
  }
}

// The NSIS message for an extraction CRC error says the app cannot be closed,
// which is misleading. Test the embedded 7z payload now so a corrupt setup can
// never be handed to users again.
const sevenZip = await getPath7za();
const verified = spawnSync(sevenZip, ['t', installer], { cwd: root, stdio: 'inherit' });
if (verified.status !== 0) {
  throw new Error(`installer CRC verification failed: ${installer}`);
}
console.log(`[installer] CRC verification passed: ${installer}`);
