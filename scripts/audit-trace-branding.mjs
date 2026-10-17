import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root = path.resolve(import.meta.dirname, '..');
// The old name is permitted only in explicitly reviewed compatibility readers.
// Historical docs and user records are not executable first-party UI source.
const compatibility = new Set(['shared/branding.ts', 'shared/chatPlan.ts', 'shared/workflowExecution.ts',
  'src/services/legacyBrandStorage.ts', 'src/features/workflows/api.ts',
  'server/legacyBrandEnvironment.ts', 'server/conversations/clusterConversations.ts',
  'server/ai/clusterSkills.ts', 'server/dsh/dshSidecar.ts', 'server/publicWeb/clusterState.ts',
  'server/workflows/workflowRunService.ts', 'server/workflows/workflowRunIndex.ts',
  'electron/app-identity.cjs', 'electron/legacy-brand-env.cjs', 'electron/legacy-shortcuts.cjs',
  'electron/locale-store.cjs', 'electron/update-manager.cjs', 'build/installer.nsh']);
const roots = ['src', 'shared', 'server', 'electron', 'vendor/dsh-plugin', 'pipelines', 'skills', 'lsf_skills', 'third-party'];
const files = ['server.ts', 'package.json', 'package-lock.json', 'index.html', 'vite.config.ts', 'build/competition-builder.json'];
const walk = (directory) => {
  for (const entry of fs.readdirSync(path.join(root, directory), { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '__pycache__' || entry.name.startsWith('.')) continue;
    const name = directory + '/' + entry.name;
    if (entry.isDirectory()) walk(name);
    else if (!/\.test\./.test(name) && /\.(?:tsx?|[cm]?js|py|json|css|html|md|txt|ya?ml)$/.test(name)) files.push(name);
  }
};
roots.forEach(walk);
const failures = [], reviewed = [];
for (const filename of files) {
  const content = fs.readFileSync(path.join(root, filename), 'utf8');
  if (!/hpclaw/i.test(content)) continue;
  if (compatibility.has(filename)) reviewed.push(filename); else failures.push(filename);
}
assert.deepEqual(failures, [], 'Unreviewed legacy branding in first-party source');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json')));
assert.equal(pkg.productName, 'TRACE'); assert.equal(pkg.build.appId, 'com.trace.desktop');
assert.equal(pkg.build.nsis.guid, '89cfe10e-df55-5d54-bd62-1401b68111e1');
assert.equal(pkg.build.publish[0].repo, 'TRACE');
assert.equal(JSON.parse(fs.readFileSync(path.join(root, 'vendor/dsh-plugin/package.json'))).name, 'trace-dsh-plugin');
console.log(JSON.stringify({ filesScanned: files.length, unreviewedBrandLeaks: 0, compatibilityReaders: reviewed }, null, 2));
