// One-off smoke test: capture a screenshot of the running HPClaw window via CDP.
// Usage: node scripts/cdp-screenshot.cjs <debug-port> <out.png> [waitMs]
const http = require('http');
const fs = require('fs');

const port = process.argv[2] || '9222';
const out = process.argv[3] || 'smoke.png';
const waitMs = parseInt(process.argv[4] || '6000', 10);

function getJson(path) {
  return new Promise((resolve, reject) => {
    http.get({ host: '127.0.0.1', port, path }, res => {
      let data = '';
      res.on('data', c => (data += c));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

(async () => {
  // Wait for the page target to appear
  let target = null;
  for (let i = 0; i < 30; i++) {
    try {
      const list = await getJson('/json');
      target = list.find(t => t.type === 'page' && !t.url.startsWith('devtools'));
      if (target) break;
    } catch {}
    await new Promise(r => setTimeout(r, 500));
  }
  if (!target) throw new Error('no page target found');
  console.log('page:', target.url);

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const msgId = ++id;
    pending.set(msgId, { resolve, reject });
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });
  ws.onmessage = ev => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
    }
  };
  await new Promise(r => (ws.onopen = r));

  await send('Page.enable');
  await new Promise(r => setTimeout(r, waitMs)); // let the app render

  // Basic render sanity: collect page title + background color of body
  const { result } = await send('Runtime.evaluate', {
    expression: `JSON.stringify({title: document.title, bodyBg: getComputedStyle(document.body).backgroundColor, hasLogin: !!document.querySelector('form')})`,
    returnByValue: true,
  });
  console.log('render info:', result.value);

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(out, Buffer.from(shot.data, 'base64'));
  console.log('screenshot saved:', out);
  ws.close();
  process.exit(0);
})().catch(e => {
  console.error('FAILED:', e.message);
  process.exit(1);
});
