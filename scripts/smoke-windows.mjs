import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import net from 'node:net';
import http from 'node:http';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import * as asar from '@electron/asar';
const expectedVersion = process.env.HPCLAW_SMOKE_VERSION || '0.4.43';
const resources = path.resolve(process.env.HPCLAW_SMOKE_RESOURCES || 'release-v0.4.43-final/win-unpacked/resources');
const archive = path.join(resources, 'app.asar');
const packagedNode = path.join(resources, 'app.asar.unpacked/vendor/node-runtime/node.exe');
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'hpclaw-package-smoke-'));
const appRoot = path.join(temporary, 'app');
const dataRoot = path.join(temporary, 'data');
for (const entry of asar.listPackage(archive)) {
  const filename = entry.replaceAll('\\', '/').replace(/^\//, '');
  if (!(filename === 'package.json' || /^(?:electron\/|dist\/|dist-electron\/|skills\/|lsf_skills\/|pipelines\/|demo-assets\/|node_modules\/(?:ssh2|asn1|safer-buffer|bcrypt-pbkdf|tweetnacl)\/)/.test(filename))) continue;
  const archivePath = path.normalize(filename);
  const stat = asar.statFile(archive, archivePath);
  if (stat.files || stat.link) continue;
  const target = path.join(appRoot, filename);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, asar.extractFile(archive, archivePath));
}
const packagedPackage = JSON.parse(fs.readFileSync(path.join(appRoot, 'package.json'), 'utf8'));
assert.equal(packagedPackage.version, expectedVersion);
const backend = fs.readFileSync(path.join(appRoot, 'dist-electron/server.cjs'), 'utf8');
if (Number(expectedVersion.split('.')[2]) >= 48) {
  assert(backend.includes('invalid_question_answer'));
  assert(backend.includes('question_no_longer_pending'));
  assert(backend.includes('optionDetails'));
  const frontend = fs.readdirSync(path.join(appRoot, 'dist/assets')).filter(file => file.endsWith('.js')).map(file => fs.readFileSync(path.join(appRoot, 'dist/assets', file), 'utf8')).join('\n');
  assert(frontend.includes('ai-question-dialog'));
  assert(frontend.includes('The agent needs your answer'));
  assert(frontend.includes('Answer later'));
  assert(frontend.includes('Answer delivery is unverified'));
  assert(frontend.includes('Select one or more options'));
  assert(frontend.includes('/api/ai/question'));
  console.log('Packaged question dialog, structured answer, expiry receipt and delivery safeguards verified.');
}
if (Number(expectedVersion.split('.')[2]) >= 47) {
  assert(backend.includes('confirm_resolved'));
  assert(backend.includes('HPClaw display truncated'));
  assert(backend.includes('This was not a user rejection.'));
  const plugin = fs.readFileSync(path.join(resources, 'app.asar.unpacked/vendor/dsh-plugin/index.js'), 'utf8');
  assert(plugin.includes("approval.setPolicy(exec.agent, 'ask')"));
  assert(plugin.includes('authoritative server FIRST'));
  const frontend = fs.readdirSync(path.join(appRoot, 'dist/assets')).filter(file => file.endsWith('.js')).map(file => fs.readFileSync(path.join(appRoot, 'dist/assets', file), 'utf8')).join('\n');
  assert(frontend.includes('Approval delivery is unverified'));
  assert(frontend.includes('Approval delivered. Awaiting the actual execution result.'));
  console.log('Packaged approval receipts, one-shot rejection safeguards and explicit truncation verified.');
}
assert(backend.includes('Step batch truncated: '));
assert(backend.includes('Download failed after 3 attempts: '));
if (Number(expectedVersion.split('.')[2]) >= 44) {
  assert(backend.includes('session.history'));
  assert(backend.includes('DSH history recovery limit reached; output not verified'));
  assert(backend.includes('no automatic rerun was attempted'));
  const readableBackend = backend.replace(/\\u([0-9a-f]{4})/gi, (_, code) => String.fromCharCode(parseInt(code, 16)));
  assert(readableBackend.includes('查不到作业不等于 DONE'));
  assert(backend.includes('This turn was not resubmitted'));
  assert(backend.includes('authoritative'));
  // electron-builder strips its development-only build configuration from app.asar.
  const builderDebug = fs.readFileSync(path.resolve(resources, '../../builder-debug.yml'), 'utf8');
  assert(builderDebug.includes('MUI_LANGUAGE "English"'));
  assert(builderDebug.includes('MUI_LANGUAGE "SimpChinese"'));
  const sourcePackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  assert.equal(sourcePackage.version, expectedVersion);
  assert.equal(sourcePackage.build.nsis.displayLanguageSelector, true);
  const { createLocaleStore } = await import(pathToFileURL(path.join(appRoot, 'electron/locale-store.cjs')).href);
  const installDir = path.join(temporary, 'isolated-install');
  fs.mkdirSync(installDir);
  fs.writeFileSync(path.join(installDir, 'hpclaw-install-locale.json'), JSON.stringify({ locale: 'en-US' }));
  const locale = createLocaleStore({ installDir, userData: dataRoot });
  assert.equal(locale.get(), 'en-US');
  locale.set('zh-CN');
  assert.equal(createLocaleStore({ installDir, userData: dataRoot }).get(), 'zh-CN');
  assert(fs.readFileSync(path.join(appRoot, 'electron/preload.cjs'), 'utf8').includes('hpclaw:locale:set'));
  console.log('Packaged Windows language seed, persistent override, IPC and DSH recovery code verified.');
}
if (Number(expectedVersion.split('.')[2]) >= 45) {
  assert(backend.includes('REMOTE_REPORT_AMBIGUOUS'));
  assert(backend.includes('Report not found in the supplied project directories'));
  const frontend = fs.readdirSync(path.join(appRoot, 'dist/assets')).filter(file => file.endsWith('.js')).map(file => fs.readFileSync(path.join(appRoot, 'dist/assets', file), 'utf8')).join('\n');
  assert(frontend.includes('High-quality alignment filtering and PCR duplicate removal'));
  assert(frontend.includes('Source section: '));
  assert(frontend.includes('basePaths'));
  console.log('Packaged report path resolution and reviewed workflow translations verified.');
}
const dsh = spawnSync(packagedNode, [path.join(resources, 'app.asar.unpacked/vendor/dsh/lib/bin.js'), '--help'], { encoding: 'utf8', timeout: 30000, windowsHide: true });
if (Number(expectedVersion.split('.')[2]) >= 46) {
  assert(backend.includes('acknowledgeFailedQc'));
  assert(backend.includes('qcCriteria'));
  assert(backend.includes('Workflow submission blocked'));
  const frontend = fs.readdirSync(path.join(appRoot, 'dist/assets')).filter(file => file.endsWith('.js')).map(file => fs.readFileSync(path.join(appRoot, 'dist/assets', file), 'utf8')).join('\n');
  assert(frontend.includes('QC failed: poor quality; downstream analysis is not recommended'));
  assert(frontend.includes('Acknowledge risk and continue'));
  assert(frontend.includes('workflow-qc-notice'));
  console.log('Packaged QC pause guard, retained failure acknowledgement and bilingual warnings verified.');
}
assert.equal(dsh.status, 0, dsh.stderr);
const port = await new Promise(resolve => {
  const server = net.createServer();
  server.listen(0, '127.0.0.1', () => { const port = server.address().port; server.close(() => resolve(port)); });
});
const child = spawn(packagedNode, [path.join(appRoot, 'dist-electron/server.cjs')], {
  cwd: appRoot, windowsHide: true, stdio: ['ignore','pipe','pipe'], env: { ...process.env, NODE_ENV: 'production',
    PORT: String(port), HPCLAW_APP_ROOT: appRoot, HPCLAW_STATIC_ROOT: appRoot, HPCLAW_DATA_ROOT: dataRoot,
    HPCLAW_HOST: '127.0.0.1', HPCLAW_WEB_MODE: '', HPCLAW_AI_ENGINE: 'legacy', HPCLAW_PARENT_PID: String(process.pid),
    HPCLAW_DESKTOP_TOKEN: 'isolated-package-smoke-only', HPCLAW_PUBLIC_WORKER: '', HPCLAW_WEB_ACCESS_ENABLED: '' },
});
let log = '';
child.stdout.on('data', data => { log += data; });
child.stderr.on('data', data => { log += data; });
const exited = new Promise(resolve => child.once('exit', resolve));
let modelServer;
try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    if (child.exitCode !== null) throw new Error('Packaged backend exited: ' + log.slice(-3000));
    try {
      const response = await fetch('http://127.0.0.1:' + port + '/api/app-info');
      if (response.ok) { assert((await response.json()).capabilities.cluster); ready = true; break; }
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  assert(ready, 'Packaged backend did not start: ' + log.slice(-3000));
  const html = await fetch('http://127.0.0.1:' + port + '/');
  assert.equal(html.status, 200);
  assert((await html.text()).includes('/assets/index-'));
  if (Number(expectedVersion.split('.')[2]) >= 48) {
    const question = async body => fetch('http://127.0.0.1:' + port + '/api/ai/question', { method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-HPClaw-Desktop-Token': 'isolated-package-smoke-only' }, body: JSON.stringify(body) });
    assert.equal((await question({ answer: 'fixture' })).status, 400);
    assert.equal((await question({ id: 'fixture', cancelled: 'false' })).status, 400);
    const missing = await question({ id: 'isolated-missing-question', answer: { selected: [], custom: 'fixture' } });
    assert.equal(missing.status, 409); assert.equal((await missing.json()).reason, 'unavailable');
    console.log('Packaged real question endpoint rejects invalid and stale IDs without accepting an answer or starting a task.');
  }
  const sentences = ['Reads were cleaned using fastp (version 0.20.0) with minimum length 20.',
    'Reads were mapped using BWA (version 0.7.17-r1188).', 'Peaks were called using MACS2 (version 2.2.6).'];
  const paperText = 'Methods\n' + sentences.join(' ') + '\nData availability\n'
    + 'Raw data were deposited under GSE192815 for use by the research community. '
    + 'The associated metadata describe samples and sequencing runs for this study.';
  let modelRequests = 0, batches = 0;
  modelServer = http.createServer(async (request, response) => {
    let body = '';
    for await (const chunk of request) body += chunk;
    const value = JSON.parse(body);
    assert.equal(value.reasoning_effort, 'none');
    assert.equal(value.model, 'deepseek-flash');
    modelRequests++;
    const prompt = value.messages.at(-1).content;
    let output, truncated = false;
    if (prompt.includes('STAGE: OUTLINE')) output = { name: 'Isolated model fixture, not a real analysis',
      steps: sentences.map((sentence, index) => ({ title: ['QC','Mapping','Peaks'][index], evidenceIds: ['E' + (index + 1)], agent: { evidence: sentence } })) };
    else if (prompt.includes('STAGE: STEPS')) {
      batches++;
      const nodes = JSON.parse(prompt.split('【本批节点与原文】\n')[1].split('\n【已声明参数】')[0]);
      truncated = batches === 1;
      output = { params: [{ name: 'OUTPUT_DIR', label: 'Fixture output', type: 'path', required: true }],
        steps: nodes.slice(0, truncated ? 2 : nodes.length).map(node => ({ ...node,
          command: 'echo isolated-model-fixture > {{OUTPUT_DIR}}/fixture-' + node.id + '.txt',
          agent: { ...node.agent, kind: 'compute', sourceType: 'paper', confidence: 'high',
            inputs: ['raw_data_manifest.tsv'], outputs: ['fixture-' + node.id + '.txt'] } })) };
    } else output = { stepsMentioned: sentences.map((sentence, index) => ({ id: 'E' + (index + 1), what: ['QC','Mapping','Peaks'][index], sentence })) };
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ id: 'fixture', created: 1, model: 'deepseek-flash',
      choices: [{ index: 0, message: { role: 'assistant', content: JSON.stringify(output) }, finish_reason: truncated ? 'length' : 'stop' }],
      usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 } }));
  });
  await new Promise(resolve => modelServer.listen(0, '127.0.0.1', resolve));
  const learned = await fetch('http://127.0.0.1:' + port + '/api/workflows/learn', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'X-HPClaw-Desktop-Token': 'isolated-package-smoke-only' },
    body: JSON.stringify({ paperText, profile: { provider: 'deepseek', model: 'deepseek-flash',
      apiKey: 'isolated-fixture-only', baseUrl: 'http://127.0.0.1:' + modelServer.address().port + '/v1' } }),
    signal: AbortSignal.timeout(60000),
  });
  const learnedBody = await learned.json();
  assert.equal(learned.status, 200, JSON.stringify(learnedBody).slice(0, 1000));
  assert.equal(learnedBody.draft.steps.length, 4);
  assert.equal(learnedBody.paperImport.rawData.length, 196);
  assert(learnedBody.draft.steps[0].command.includes('urllib.request.urlopen'));
  assert(learnedBody.draft.steps.some(step => step.title === 'Peaks'));
  assert.equal(batches, 2);
  assert.equal(modelRequests, 4);
  console.log('Packaged literature-learning API passed with real 196-run metadata and local model fixture: truncation retried, all three analysis nodes and real downloader retained; no paid model or raw downloads.');
  console.log('Windows v' + expectedVersion + ' packaged backend, frontend, DSH CLI and paper-learning code verified in isolated data directory.');
} finally {
  if (modelServer) { modelServer.closeAllConnections(); await new Promise(resolve => modelServer.close(resolve)); }
  child.kill();
  await exited;
  console.log('Isolated smoke fixtures retained at ' + temporary);
}


