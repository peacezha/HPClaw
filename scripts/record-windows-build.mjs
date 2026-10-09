import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import * as yaml from 'js-yaml';

const directory = path.resolve(process.argv[2]);
const { version } = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const sourceCommit = process.env.GITHUB_SHA;
assert(/^[a-f0-9]{40}$/.test(sourceCommit || ''), 'Exact build source required');
const names = [`HPClaw-Setup-${version}-x64.exe`, `HPClaw-Setup-${version}-x64.exe.blockmap`, 'latest.yml'];
const assets = [];
for (const name of names) {
  const file = path.join(directory, name);
  const hash = crypto.createHash('sha256');
  for await (const chunk of fs.createReadStream(file)) hash.update(chunk);
  assets.push({ name, size: fs.statSync(file).size, sha256: hash.digest('hex') });
}
const manifest = yaml.load(fs.readFileSync(path.join(directory, 'latest.yml'), 'utf8'));
const installerHash = crypto.createHash('sha512');
for await (const chunk of fs.createReadStream(path.join(directory, names[0]))) installerHash.update(chunk);
const sha512 = installerHash.digest('base64');
assert.equal(manifest.version, version);
assert.equal(manifest.path, names[0]);
assert.equal(manifest.sha512, sha512);
assert.equal(manifest.files?.[0]?.url, names[0]);
assert.equal(manifest.files[0].sha512, sha512);
assert.equal(manifest.files[0].size, assets[0].size);
const record = { version, sourceCommit, installerSha512: sha512, assets };
const recordPath = path.join(directory, 'windows-build.json');
if (process.argv.includes('--verify')) {
  assert.deepEqual(JSON.parse(fs.readFileSync(recordPath, 'utf8')), record);
  console.log('Windows build source and all artifact checksums verified.');
} else {
  assert.equal(process.platform, 'win32');
  assert.equal(process.arch, 'x64');
  fs.writeFileSync(recordPath, JSON.stringify(record, null, 2) + '\n');
  console.log('Windows build source and artifact checksums recorded.');
  console.log('HPCLAW_WINDOWS_BUILD_RECORD=' + JSON.stringify(record));
}
