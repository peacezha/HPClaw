// End-to-end regression for per-run, per-step editable workflow code.
// Creates a query-only troubleshooting RUN, edits step 1 through the public API,
// verifies persistence, then marks the test RUN cancelled. It submits no cluster job.
const http = require('http');

const port = process.argv[2] || '9228';
const workflowName = '集群作业排查流程';
const testJobId = '987654321';

function getJson(path) {
  return new Promise((resolve, reject) => {
    http.get({ host: '127.0.0.1', port, path }, response => {
      let body = '';
      response.on('data', chunk => { body += chunk; });
      response.on('end', () => {
        try { resolve(JSON.parse(body)); } catch (error) { reject(error); }
      });
    }).on('error', reject);
  });
}

(async () => {
  const targets = await getJson('/json');
  const target = targets.find(item => item.type === 'page' && !item.url.startsWith('devtools'));
  if (!target) throw new Error('没有找到 HPClaw 页面');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const requestId = ++id;
    pending.set(requestId, { resolve, reject });
    ws.send(JSON.stringify({ id: requestId, method, params }));
  });
  ws.onmessage = event => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) return;
    const entry = pending.get(message.id);
    pending.delete(message.id);
    message.error ? entry.reject(new Error(message.error.message)) : entry.resolve(message.result);
  };
  await new Promise(resolve => { ws.onopen = resolve; });
  const evaluate = async expression => {
    const { result, exceptionDetails } = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (exceptionDetails) throw new Error(exceptionDetails.exception?.description || exceptionDetails.text);
    return result.value;
  };

  const result = await evaluate(`(async () => {
    const request = async (path, options = {}) => {
      const response = await fetch(path, { headers: { 'Content-Type': 'application/json' }, ...options });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || ('HTTP ' + response.status));
      return body;
    };
    const listed = await request('/api/workflows');
    const workflow = (listed.workflows || []).find(item => item.name === ${JSON.stringify(workflowName)});
    if (!workflow) throw new Error('没有找到测试流程');
    const created = await request('/api/workflows/' + encodeURIComponent(workflow.id) + '/runs', {
      method: 'POST',
      body: JSON.stringify({
        inputs: [],
        params: { JOBID: ${JSON.stringify(testJobId)} },
        stepParams: {},
        referenceOverrides: {},
        skippedSteps: [],
        stepCommandOverrides: {},
      }),
    });
    const run = created.run;
    const initial = await request('/api/workflow-runs/code?dir=' + encodeURIComponent(run.runDir) + '&step=1');
    const marker = '# HPCLAW_CODE_EDIT_REGRESSION';
    const editedContent = initial.code.content.replace(/\\s*$/, '') + '\\n' + marker + '\\n';
    const saved = await request('/api/workflow-runs/code', {
      method: 'PUT',
      body: JSON.stringify({ runDir: run.runDir, step: 1, content: editedContent }),
    });
    const verified = await request('/api/workflow-runs/code?dir=' + encodeURIComponent(run.runDir) + '&step=1');
    const cancelled = await request('/api/workflow-runs/item', {
      method: 'PATCH',
      body: JSON.stringify({ runDir: run.runDir, patch: { status: 'cancelled' } }),
    });
    return {
      workflowId: workflow.id,
      runId: run.runId,
      runDir: run.runDir,
      codeDir: run.codeDir,
      totalSteps: run.totalSteps,
      scriptPaths: (run.steps || []).map(step => step.scriptPath),
      step1ContainsRenderedJobId: initial.code.content.includes(${JSON.stringify(testJobId)}),
      step1ContainsMarkerAfterSave: verified.code.content.includes(marker),
      userModified: saved.code.step.scriptUserModified,
      finalStatus: cancelled.run.status,
    };
  })()`);

  const passed = Boolean(
    result.codeDir
    && result.totalSteps > 0
    && result.scriptPaths.length === result.totalSteps
    && result.scriptPaths.every(path => typeof path === 'string' && path.includes('/code/step-'))
    && result.step1ContainsRenderedJobId
    && result.step1ContainsMarkerAfterSave
    && result.userModified
    && result.finalStatus === 'cancelled'
  );
  console.log(JSON.stringify({ passed, ...result }, null, 2));
  ws.close();
  process.exitCode = passed ? 0 : 1;
})().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
