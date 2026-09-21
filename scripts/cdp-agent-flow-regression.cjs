// HPClaw desktop regression: a formal workflow must not end early or mistake
// `Job <id> is not found` for a newly submitted LSF job.
const http = require('http');
const fs = require('fs');

const port = process.argv[2] || '9225';
const loginOnly = process.argv.includes('--login-only');
const screenshotPath = loginOnly ? 'hpclaw-login-only.png' : (process.argv[3] || 'hpclaw-agent-flow-regression.png');
const jobId = loginOnly ? '12345' : (process.argv[4] || '12345');
const mode = loginOnly ? 'login-only' : (process.argv[5] || 'workflow');
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
  let requestId = 0;
  const pending = new Map();
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++requestId;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
  ws.onmessage = event => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) return;
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
  };
  await new Promise(resolve => { ws.onopen = resolve; });
  await send('Page.enable');

  const evaluate = async expression => {
    const { result, exceptionDetails } = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (exceptionDetails) {
      throw new Error(exceptionDetails.exception?.description || exceptionDetails.text || '页面脚本异常');
    }
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
  const clickButton = label => evaluate(`(() => {
    const target = [...document.querySelectorAll('button')]
      .find(button => button.textContent.trim() === ${JSON.stringify(label)});
    if (!target) return false;
    target.click();
    return true;
  })()`);

  // Login uses the already-filled remembered profile; this script never reads form values.
  const loginVisible = await evaluate(`[...document.querySelectorAll('button')].some(button => button.textContent.trim() === 'Login')`);
  if (loginVisible) {
    if (!await clickButton('Login')) throw new Error('登录按钮不可用');
  }
  await waitFor(
    `!!document.querySelector('button[aria-label="打开 AI 助手"], button[aria-label="关闭 AI 助手"]')`,
    90_000,
    '集群主界面',
  );

  if (mode === 'login-only') {
    const state = await evaluate(`(() => ({
      connectedProfileVisible: !!document.querySelector('.xterm') && !document.body.innerText.includes('终端连接已断开'),
      terminalVisible: !!document.querySelector('.xterm'),
      aiButtonVisible: !!document.querySelector('button[aria-label="打开 AI 助手"], button[aria-label="关闭 AI 助手"]'),
    }))()`);
    const screenshot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(screenshotPath, Buffer.from(screenshot.data, 'base64'));
    const passed = state.connectedProfileVisible && state.terminalVisible && state.aiButtonVisible;
    console.log(JSON.stringify({ passed, mode, state, screenshotPath }, null, 2));
    ws.close();
    process.exit(passed ? 0 : 1);
  }

  await evaluate(`(() => {
    const button = document.querySelector('button[aria-label="打开 AI 助手"]');
    if (button) button.click();
    return true;
  })()`);
  await sleep(600);
  if (!await clickButton('流程')) throw new Error('流程页签不可用');
  await waitFor(`document.body.innerText.includes('集群作业排查流程')`, 20_000, '集群作业排查流程');

  const expanded = await evaluate(`(() => {
    const button = [...document.querySelectorAll('button')]
      .find(item => item.textContent.includes('集群作业排查流程'));
    if (!button) return false;
    button.click();
    return true;
  })()`);
  if (!expanded) throw new Error('无法展开集群作业排查流程');
  await waitFor(`document.body.innerText.includes('选择数据并运行')`, 10_000, '流程运行入口');
  if (!await clickButton('选择数据并运行')) throw new Error('流程运行入口不可用');
  await waitFor(`document.body.innerText.includes('全局参数') && document.body.innerText.includes('运行流程')`, 10_000, '运行配置');

  const configState = await evaluate(`(() => ({
    hasDataSelection: document.body.innerText.includes('数据选择'),
    hasJobParameter: [...document.querySelectorAll('input')].some(input => input.placeholder === 'JOBID'),
    body: document.body.innerText.slice(-3000),
  }))()`);
  if (configState.hasDataSelection) throw new Error('运维流程仍错误要求选择数据目录');
  if (!configState.hasJobParameter) throw new Error('没有找到 JOBID 参数');

  const filled = await evaluate(`(() => {
    const input = [...document.querySelectorAll('input')].find(item => item.placeholder === 'JOBID');
    if (!input) return false;
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(input, ${JSON.stringify(jobId)});
    input.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  })()`);
  if (!filled) throw new Error('无法设置 JOBID');
  if (!await clickButton('运行流程')) throw new Error('运行流程按钮不可用');

  await waitFor(`!!document.querySelector('button[title="停止"]')`, 30_000, 'AI 开始执行');
  const startedAt = Date.now();
  let state = null;
  while (Date.now() - startedAt < 360_000) {
    state = await evaluate(`(() => {
      const text = document.body.innerText;
      return {
        generating: !!document.querySelector('button[title="停止"]'),
        falseSubmission: text.includes('作业 ${jobId} 已成功提交') || text.includes('[JOB_SUBMITTED]'),
        timeoutError: text.includes('AI 请求超时或连接中断'),
        disconnected: text.includes('终端连接已断开') || text.includes('点击重连'),
        hasNotFound: text.includes('not found') || text.includes('作业号不存在') || text.includes('作业不存在'),
        hasDone: text.includes('已完成'),
        hasWorkflowCompleted: text.includes('排查流程完成') || text.includes('运行状态已更新: done, step 5/5'),
        hasWaitingJobs: text.includes('后台监控'),
        excerpt: text.slice(-5000),
      };
    })()`);
    if (!state.generating) break;
    await sleep(1000);
  }

  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(screenshotPath, Buffer.from(screenshot.data, 'base64'));
  const passed = !!state
    && !state.generating
    && !state.falseSubmission
    && !state.timeoutError
    && !state.disconnected
    && state.hasWorkflowCompleted;
  console.log(JSON.stringify({
    passed,
    jobId,
    elapsedMs: Date.now() - startedAt,
    config: { hasDataSelection: configState.hasDataSelection, hasJobParameter: configState.hasJobParameter },
    state,
    screenshotPath,
  }, null, 2));
  ws.close();
  process.exit(passed ? 0 : 1);
})().catch(error => {
  console.error(JSON.stringify({ passed: false, error: error.message }, null, 2));
  process.exit(2);
});
