// End-to-end, read-only workflow environment check in the running HPClaw desktop app.
const http = require('http');
const port = process.argv[2] || '9227';
const workflowName = process.argv.slice(3).filter(value => !value.startsWith('--')).join(' ') || 'RNA-seq 质控与定量流程（FastQC/Trimmomatic/kallisto）';
const apiOnly = process.argv.includes('--api-only');
const getOnly = process.argv.includes('--get-only');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

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
    const { result, exceptionDetails } = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (exceptionDetails) throw new Error(exceptionDetails.exception?.description || exceptionDetails.text);
    return result.value;
  };
  const waitFor = async (expression, timeoutMs, label) => {
    const started = Date.now();
    while (Date.now() - started < timeoutMs) {
      if (await evaluate(expression).catch(() => false)) return;
      await sleep(500);
    }
    throw new Error(`等待超时：${label}`);
  };

  await waitFor(`!!document.querySelector('button[aria-label="打开 AI 助手"], button[aria-label="关闭 AI 助手"]')`, 60_000, '主界面');
  if (apiOnly || getOnly) {
    const apiState = await evaluate(`(async () => {
      const listed = await fetch('/api/workflows').then(response => response.json());
      const workflow = (listed.workflows || []).find(item => item.name === ${JSON.stringify(workflowName)});
      if (!workflow) return { error: 'API 中没有目标流程' };
      const response = await fetch('/api/workflows/' + encodeURIComponent(workflow.id) + '/preflight', {
        method: ${getOnly ? "'GET'" : "'POST'"},
        headers: { 'Content-Type': 'application/json' },
      });
      return { workflowSoftware: workflow.manifest?.software, status: response.status, body: await response.json() };
    })()`);
    console.log(JSON.stringify(apiState, null, 2));
    ws.close();
    return;
  }
  await evaluate(`document.querySelector('button[aria-label="打开 AI 助手"]')?.click()`);
  await sleep(500);
  await evaluate(`[...document.querySelectorAll('button')].find(button => button.textContent.trim() === '流程')?.click()`);
  await waitFor(`!!document.querySelector('input[placeholder="搜索流程或关键词..."]')`, 15_000, '流程搜索框');
  await evaluate(`(() => {
    const input = document.querySelector('input[placeholder="搜索流程或关键词..."]');
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(input, ${JSON.stringify(workflowName)});
    input.dispatchEvent(new Event('input', { bubbles: true }));
  })()`);
  await waitFor(`document.body.textContent.includes(${JSON.stringify(workflowName)})`, 15_000, '目标流程');
  const found = await evaluate(`(() => {
    const button = [...document.querySelectorAll('button')].find(item => item.textContent.includes(${JSON.stringify(workflowName)}));
    if (!button) return false;
    button.click();
    return true;
  })()`);
  if (!found) throw new Error('无法展开目标流程');
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.includes('检查环境'))`, 10_000, '检查环境按钮');
  const clicked = await evaluate(`(() => {
    const titleButton = [...document.querySelectorAll('button')].find(item => item.textContent.includes(${JSON.stringify(workflowName)}));
    const card = titleButton?.parentElement;
    const button = card ? [...card.querySelectorAll('button')].find(item => item.textContent.includes('检查环境')) : null;
    if (!button || button.disabled) return false;
    button.click();
    return true;
  })()`);
  if (!clicked) throw new Error('检查环境按钮不可用');
  await sleep(500);
  await waitFor(`(() => {
    const titleButton = [...document.querySelectorAll('button')].find(item => item.textContent.includes(${JSON.stringify(workflowName)}));
    const card = titleButton?.parentElement;
    const button = card ? [...card.querySelectorAll('button')].find(item => item.textContent.includes('检查环境')) : null;
    return !!button && !button.disabled && card.textContent.includes('Module');
  })()`, 150_000, '环境检查完成');
  const state = await evaluate(`(() => {
    const titleButton = [...document.querySelectorAll('button')].find(item => item.textContent.includes(${JSON.stringify(workflowName)}));
    const card = titleButton?.parentElement;
    return {
      text: card?.textContent || '',
      details: card ? [...card.querySelectorAll('[title]')].map(item => ({ text: item.textContent.trim(), title: item.getAttribute('title') })).filter(item => item.title) : [],
    };
  })()`);
  const apiState = await evaluate(`(async () => {
    const listed = await fetch('/api/workflows').then(response => response.json());
    const workflow = (listed.workflows || []).find(item => item.name === ${JSON.stringify(workflowName)});
    if (!workflow) return { error: 'API 中没有目标流程' };
    const response = await fetch('/api/workflows/' + encodeURIComponent(workflow.id) + '/preflight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return { status: response.status, body: await response.json() };
  })()`);
  console.log(JSON.stringify({ ui: state, api: apiState }, null, 2));
  ws.close();
})().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
