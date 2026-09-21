// One-off: interact with the running app via CDP — open AI panel and file transfer, screenshot each.
const http = require('http');
const fs = require('fs');
const port = process.argv[2] || '9222';
const OUT_DIR = 'E:/0612hpclaw/hpclaw_v2';

function getJson(path) {
  return new Promise((resolve, reject) => {
    http.get({ host: '127.0.0.1', port, path }, res => {
      let d = '';
      res.on('data', c => (d += c));
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch (e) { reject(e); } });
    }).on('error', reject);
  });
}

(async () => {
  const list = await getJson('/json');
  const target = list.find(t => t.type === 'page' && !t.url.startsWith('devtools'));
  if (!target) throw new Error('no page target');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const i = ++id;
    pending.set(i, { resolve, reject });
    ws.send(JSON.stringify({ id: i, method, params }));
  });
  ws.onmessage = ev => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) {
      const { resolve, reject } = pending.get(m.id);
      pending.delete(m.id);
      m.error ? reject(new Error(m.error.message)) : resolve(m.result);
    }
  };
  await new Promise(r => (ws.onopen = r));
  await send('Page.enable');

  const evalJs = async expr => {
    const { result } = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    return result.value;
  };
  const shot = async name => {
    const s = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(name, Buffer.from(s.data, 'base64'));
    console.log('saved:', name);
  };
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // Wait until main UI (AI assistant button) is present — session restore may take a while
  let ready = false;
  for (let i = 0; i < 60; i++) {
    const found = await evalJs(`!!document.querySelector('button[aria-label="打开 AI 助手"], button[aria-label="关闭 AI 助手"]')`);
    if (found) { ready = true; break; }
    await sleep(1000);
  }
  if (!ready) {
    console.log('main UI not ready; capturing whatever is shown');
    await shot(OUT_DIR + '/smoke-notready.png');
    process.exit(1);
  }
  console.log('main UI ready');

  // 1. Open AI assistant
  console.log('click AI:', await evalJs(`(() => { const b = document.querySelector('button[aria-label="打开 AI 助手"]'); if (b) { b.click(); return 'clicked'; } return 'already open or not found'; })()`));
  await sleep(1500);
  await shot(OUT_DIR + '/smoke-ai.png');

  // 2. Close AI (Esc), then open file transfer
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await sleep(600);
  console.log('click transfer:', await evalJs(`(() => { const b = document.querySelector('button[aria-label="文件传输"]'); if (b) { b.click(); return 'clicked'; } return 'not found'; })()`));
  await sleep(3500);
  await shot(OUT_DIR + '/smoke-transfer.png');

  ws.close();
  process.exit(0);
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
