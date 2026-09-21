// Read-only probe of the module system through the currently connected HPClaw terminal.
const http = require('http');
const port = process.argv[2] || '9226';
const command = process.argv.slice(3).join(' ') ||
  `printf '\n__HPCLAW_MODULE_PROBE_BEGIN__\n'; type module 2>&1; ` +
  `printf '%s\n' '__FASTQC_AVAIL__'; module -t avail FastQC 2>&1 | head -20; ` +
  `printf '%s\n' '__FASTQC_SPIDER__'; module spider FastQC 2>&1 | head -20; ` +
  `printf '%s\n' '__HPCLAW_MODULE_PROBE_END__'`;

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
    const messageId = ++id;
    pending.set(messageId, { resolve, reject });
    ws.send(JSON.stringify({ id: messageId, method, params }));
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
  for (let attempt = 0; attempt < 60; attempt++) {
    if (await evaluate(`!!document.querySelector('.xterm')`).catch(() => false)) break;
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  await evaluate(`document.querySelector('button[aria-label="关闭 AI 助手"]')?.click()`);
  await new Promise(resolve => setTimeout(resolve, 500));
  const rect = await evaluate(`(() => {
    const terminal = document.querySelector('.xterm');
    if (!terminal) return null;
    const box = terminal.getBoundingClientRect();
    return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
  })()`);
  if (!rect) throw new Error('当前软件没有已连接终端');
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', clickCount: 1, x: rect.x, y: rect.y });
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', clickCount: 1, x: rect.x, y: rect.y });
  await send('Input.insertText', { text: command });
  await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  await new Promise(resolve => setTimeout(resolve, 5000));
  const text = await evaluate(`document.querySelector('.xterm-rows')?.innerText || document.querySelector('.xterm-rows')?.textContent || ''`);
  console.log(text);
  ws.close();
})().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
