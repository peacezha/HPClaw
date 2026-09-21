// HPClaw v2 主题/Tab栏/终端链接预览 实机验证
const http = require('http');
const fs = require('fs');
const port = process.argv[2] || '9222';
const results = [];
const ok = (name, pass, detail = '') => {
  results.push({ name, pass });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
};

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
  const evalJs = async (expression) => {
    const { result, exceptionDetails } = await send('Runtime.evaluate', {
      expression, returnByValue: true, awaitPromise: true,
    });
    if (exceptionDetails) throw new Error('renderer exception: ' + JSON.stringify(exceptionDetails.exception?.description || exceptionDetails.text));
    return result.value;
  };
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const shot = async name => {
    const s = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(name, Buffer.from(s.data, 'base64'));
    console.log('saved:', name);
  };

  for (let i = 0; i < 90; i++) {
    const ready = await evalJs(`!!document.querySelector('button[aria-label="打开 AI 助手"], button[aria-label="关闭 AI 助手"]')`).catch(() => false);
    if (ready) break;
    await sleep(1000);
  }

  // ── 1. 主题切换 ──
  const themeBtn = await evalJs(`!!document.querySelector('button[aria-label="切换到黑夜模式"], button[aria-label="切换到白天模式"]')`);
  ok('主题切换按钮存在', themeBtn);
  await evalJs(`(() => { const b = document.querySelector('button[aria-label="切换到黑夜模式"], button[aria-label="切换到白天模式"]'); })()`);
  // 当前应为 light
  const before = await evalJs(`({ theme: document.documentElement.dataset.theme || 'light', bodyBg: getComputedStyle(document.body).backgroundColor })`);
  // 切到 dark
  await evalJs(`(() => { const b = document.querySelector('button[aria-label="切换到黑夜模式"]'); if (b) b.click(); })()`);
  await sleep(600);
  const dark = await evalJs(`({ theme: document.documentElement.dataset.theme, bodyBg: getComputedStyle(document.body).backgroundColor, headerBg: getComputedStyle(document.querySelector('header')).backgroundColor })`);
  ok('切换到黑夜模式生效', dark.theme === 'dark' && dark.bodyBg !== before.bodyBg, `dark bg=${dark.bodyBg}`);
  await shot('E:/0612hpclaw/hpclaw_v2/smoke-dark.png');
  // 切回 light
  await evalJs(`(() => { const b = document.querySelector('button[aria-label="切换到白天模式"]'); if (b) b.click(); })()`);
  await sleep(600);
  const light = await evalJs(`({ theme: document.documentElement.dataset.theme || 'light', bodyBg: getComputedStyle(document.body).backgroundColor })`);
  ok('切回白天模式生效', light.bodyBg !== dark.bodyBg, `light bg=${light.bodyBg}`);
  await shot('E:/0612hpclaw/hpclaw_v2/smoke-light.png');

  // ── 2. Tab 栏不溢出（打开 AI 侧栏检查三个 tab + 图标都在一行）──
  await evalJs(`(() => { const b = document.querySelector('button[aria-label="打开 AI 助手"]'); if (b) b.click(); })()`);
  await sleep(1200);
  const tabBarCheck = await evalJs(`(() => {
    const bar = [...document.querySelectorAll('div')].find(d => d.textContent.includes('AI 助理') && d.textContent.includes('技能库') && d.textContent.includes('流程') && d.className.includes('border-b'));
    if (!bar) return { error: 'tabbar not found' };
    const btns = [...bar.querySelectorAll('button')];
    const tops = new Set(btns.map(b => Math.round(b.getBoundingClientRect().top)));
    return { buttons: btns.length, distinctRows: tops.size };
  })()`);
  ok('Tab 栏三个 tab + 图标无换行错位', tabBarCheck.distinctRows === 1, JSON.stringify(tabBarCheck));
  // 拖拽手柄存在
  const resizeHandle = await evalJs(`!!document.querySelector('[aria-label="调整 AI 面板宽度"]')`);
  ok('AI 侧栏拖拽手柄存在', resizeHandle);

  // ── 3. 终端文件名点击预览 ──
  // 在终端里执行 ls 产生文件名，然后检查 xterm 是否渲染了可点击链接
  await evalJs(`(() => {
    const term = document.querySelector('.xterm');
    if (!term) return;
    // 通过 socket 发命令
    window.__lastCmd = Date.now();
  })()`);
  // 直接用键盘输入 ls
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'l', text: 'l' });
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 's', text: 's' });
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', text: '\r' });
  await sleep(2500);
  // xterm link 元素类名为 xterm-link
  const linkInfo = await evalJs(`(() => {
    const links = [...document.querySelectorAll('.xterm .xterm-link, .xterm [class*="link"]')];
    return { count: links.length, samples: links.slice(0, 3).map(l => l.textContent) };
  })()`);
  ok('终端文件名渲染为可点击链接', linkInfo.count > 0, JSON.stringify(linkInfo.samples));
  // 点击第一个链接 → 预览应打开
  if (linkInfo.count > 0) {
    await evalJs(`(() => { const l = document.querySelector('.xterm .xterm-link, .xterm [class*="link"]'); if (l) l.dispatchEvent(new MouseEvent('click', { bubbles: true })); })()`);
    await sleep(3000);
    const previewOpen = await evalJs(`!!document.querySelector('[data-testid="preview-overlay"]')`);
    ok('点击文件名打开预览', previewOpen);
    await shot('E:/0612hpclaw/hpclaw_v2/smoke-link-preview.png');
  }

  console.log('---');
  const failed = results.filter(r => !r.pass);
  console.log(`结果: ${results.length - failed.length}/${results.length} 通过`);
  ws.close();
  process.exit(failed.length ? 1 : 0);
})().catch(e => { console.error('ABORTED:', e.message); process.exit(2); });
