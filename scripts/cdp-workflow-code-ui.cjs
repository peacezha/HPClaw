// Opens the real workflow RUN code editor and verifies the saved step script is visible.
const http = require('http');
const fs = require('fs');
const port = process.argv[2] || '9228';
const screenshotPath = process.argv[3] || 'hpclaw-workflow-code-editor.png';
const workflowName = '集群作业排查流程';
const marker = '# HPCLAW_CODE_EDIT_REGRESSION';
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
  await send('Page.enable');
  const evaluate = async expression => {
    const { result, exceptionDetails } = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (exceptionDetails) throw new Error(exceptionDetails.exception?.description || exceptionDetails.text);
    return result.value;
  };
  const waitFor = async (expression, timeoutMs, label) => {
    const started = Date.now();
    while (Date.now() - started < timeoutMs) {
      if (await evaluate(expression).catch(() => false)) return;
      await sleep(400);
    }
    throw new Error(`等待超时：${label}`);
  };

  await evaluate(`document.querySelector('button[aria-label="打开 AI 助手"]')?.click()`);
  await sleep(500);
  await evaluate(`[...document.querySelectorAll('button')].find(button => button.textContent.trim() === '流程')?.click()`);
  await waitFor(`!!document.querySelector('input[placeholder="搜索流程或关键词..."]')`, 15_000, '流程搜索框');
  await evaluate(`(() => {
    const input = document.querySelector('input[placeholder="搜索流程或关键词..."]');
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, ${JSON.stringify(workflowName)});
    input.dispatchEvent(new Event('input', { bubbles: true }));
  })()`);
  await waitFor(`document.body.innerText.includes(${JSON.stringify(workflowName)})`, 10_000, '目标流程');
  const drawerAlreadyOpen = await evaluate(`document.body.innerText.includes('任务监控') && document.body.innerText.includes('运行流程')`);
  if (!drawerAlreadyOpen) {
    const hasEntry = await evaluate(`[...document.querySelectorAll('button')].some(button => button.textContent.includes('选择数据并运行'))`);
    if (!hasEntry) {
      const opened = await evaluate(`(() => {
        const title = [...document.querySelectorAll('button')].find(button => button.textContent.includes(${JSON.stringify(workflowName)}));
        if (!title) return false;
        title.click();
        return true;
      })()`);
      if (!opened) throw new Error('无法展开目标流程');
    }
    await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.includes('选择数据并运行'))`, 10_000, '运行面板入口');
    await evaluate(`[...document.querySelectorAll('button')].find(button => button.textContent.includes('选择数据并运行'))?.click()`);
    await waitFor(`document.body.innerText.includes('任务监控') && document.body.innerText.includes('运行流程')`, 15_000, '流程运行面板');
  }
  await waitFor(`[...document.querySelectorAll('button')].some(button => button.textContent.includes('flow-19a09b-'))`, 20_000, '测试运行记录');
  await evaluate(`(() => {
    const matches = [...document.querySelectorAll('button')].filter(button =>
      button.textContent.includes('flow-19a09b-') && button.className.split(/\\s+/).includes('p-2'));
    matches[0]?.click();
  })()`);
  await waitFor(`document.body.innerText.includes('查看/修改代码')`, 10_000, '展开运行代码入口');
  await evaluate(`[...document.querySelectorAll('button')].find(button => button.textContent.includes('查看/修改代码'))?.click()`);
  await waitFor(`!!document.querySelector('textarea[aria-label="步骤运行脚本"]')`, 15_000, '步骤代码编辑器');
  await waitFor(`document.querySelector('textarea[aria-label="步骤运行脚本"]')?.value.includes(${JSON.stringify(marker)})`, 15_000, '已保存的用户修改');
  const state = await evaluate(`(() => {
    const editor = document.querySelector('textarea[aria-label="步骤运行脚本"]');
    return {
      hasCodeTitle: document.body.innerText.includes('本次运行代码（按步骤）'),
      hasAllFiveSteps: [1,2,3,4,5].every(n => document.body.innerText.includes('步骤 ' + n + ' ·')),
      containsRenderedJobId: editor.value.includes('987654321'),
      containsSavedMarker: editor.value.includes(${JSON.stringify(marker)}),
      codeDirVisible: document.body.innerText.includes('/code'),
    };
  })()`);
  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(screenshotPath, Buffer.from(screenshot.data, 'base64'));
  const passed = Object.values(state).every(Boolean);
  console.log(JSON.stringify({ passed, state, screenshotPath }, null, 2));
  ws.close();
  process.exitCode = passed ? 0 : 1;
})().catch(error => {
  console.error(error.message);
  process.exit(1);
});
