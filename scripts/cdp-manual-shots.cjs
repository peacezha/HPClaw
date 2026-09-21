// 收集使用教程所需的全套截图
const http = require('http');
const fs = require('fs');
const port = process.argv[2] || '9222';
const OUT = 'E:/0612hpclaw/hpclaw_v2/docs-manual/img';

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
  fs.mkdirSync(OUT, { recursive: true });
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
    const { result, exceptionDetails } = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (exceptionDetails) throw new Error('renderer exception: ' + JSON.stringify(exceptionDetails.exception?.description || exceptionDetails.text));
    return result.value;
  };
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const shot = async name => {
    const s = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${OUT}/${name}.png`, Buffer.from(s.data, 'base64'));
    console.log('saved:', name);
  };
  const clickAt = async (x, y) => {
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });
  };
  const clickBtn = async (aria) => evalJs(`(() => {
    const b = document.querySelector('button[aria-label="${aria}"]');
    if (b) { const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
    return null;
  })()`);

  for (let i = 0; i < 90; i++) {
    const ready = await evalJs(`!!document.querySelector('button[aria-label="打开 AI 助手"], button[aria-label="关闭 AI 助手"]')`).catch(() => false);
    if (ready) break;
    await sleep(1000);
  }

  // 1. 主界面（白天）
  await sleep(1000);
  await shot('01-main-light');

  // 2. 主界面（黑夜）
  const themeBtn = await clickBtn('切换到黑夜模式');
  if (themeBtn) await clickAt(themeBtn.x, themeBtn.y);
  await sleep(800);
  await shot('02-main-dark');
  const themeBtn2 = await clickBtn('切换到白天模式');
  if (themeBtn2) await clickAt(themeBtn2.x, themeBtn2.y);
  await sleep(800);

  // 3. AI 助理（打开侧栏 + 关键词 chips）
  const aiBtn = await clickBtn('打开 AI 助手');
  if (aiBtn) await clickAt(aiBtn.x, aiBtn.y);
  await sleep(1500);
  await evalJs(`(() => {
    const ta = document.querySelector('textarea');
    if (!ta) return;
    const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
    setter.call(ta, '帮我做转录组分析');
    ta.dispatchEvent(new Event('input', { bubbles: true }));
  })()`);
  await sleep(1300);
  await shot('03-ai-chat');

  // 清空输入框
  await evalJs(`(() => {
    const ta = document.querySelector('textarea');
    if (!ta) return;
    const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
    setter.call(ta, '');
    ta.dispatchEvent(new Event('input', { bubbles: true }));
  })()`);

  // 4. 流程面板
  await evalJs(`(() => { const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim() === '流程'); if (b) b.click(); })()`);
  await sleep(1200);
  // 展开第一个流程
  await evalJs(`(() => { const items = [...document.querySelectorAll('button')].filter(x => x.textContent.includes('RNA-seq')); if (items[0]) items[0].click(); })()`);
  await sleep(600);
  await shot('04-workflows');

  // 5. 技能库
  await evalJs(`(() => { const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim().startsWith('技能库')); if (b) b.click(); })()`);
  await sleep(1500);
  await shot('05-skills');

  // 6. 对话记录
  await evalJs(`(() => { const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim().startsWith('AI')); if (b) b.click(); })()`);
  await sleep(500);
  const histBtn = await clickBtn('对话记录');
  if (histBtn) await clickAt(histBtn.x, histBtn.y);
  await sleep(1500);
  await shot('06-history');
  if (histBtn) await clickAt(histBtn.x, histBtn.y); // 关闭
  await sleep(500);

  // 7. 文件传输工作区
  const ftBtn = await clickBtn('文件传输');
  if (ftBtn) await clickAt(ftBtn.x, ftBtn.y);
  await sleep(4000);
  await shot('07-transfer');

  // 8. 右键菜单
  const menuPos = await evalJs(`(() => {
    const rows = document.querySelectorAll('[data-testid^="file-row-"]');
    if (!rows.length) return null;
    const r = rows[0].getBoundingClientRect();
    return { x: r.left + 60, y: r.top + r.height / 2 };
  })()`);
  if (menuPos) {
    await evalJs(`(() => {
      const rows = document.querySelectorAll('[data-testid^="file-row-"]');
      const r = rows[0].getBoundingClientRect();
      rows[0].dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: ${menuPos.x}, clientY: ${menuPos.y} }));
    })()`);
    await sleep(500);
    await shot('08-transfer-menu');
    await evalJs(`document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))`);
  }

  // 关闭传输工作区（点 X）
  await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await sleep(800);

  // 9. 终端文件名点击预览
  const termRect = await evalJs(`(() => { const t = document.querySelector('.xterm'); const r = t.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
  await clickAt(termRect.x, termRect.y);
  await sleep(300);
  await send('Input.insertText', { text: 'ls -lh minimap.out' });
  await sleep(200);
  await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  await sleep(2000);
  const linkPos = await evalJs(`(() => {
    const rows = [...document.querySelectorAll('.xterm-rows > div')];
    for (const row of rows) {
      const t = row.textContent || '';
      const idx = t.indexOf('minimap.out');
      if (idx >= 0) {
        const r = row.getBoundingClientRect();
        return { x: r.left + idx * 8.4 + 30, y: r.top + r.height / 2 };
      }
    }
    return null;
  })()`);
  if (linkPos) {
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: linkPos.x, y: linkPos.y });
    await sleep(500);
    await clickAt(linkPos.x, linkPos.y);
    await sleep(3500);
    await shot('09-link-preview');
    await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  } else {
    console.log('WARN: minimap.out 链接未找到');
  }

  console.log('done');
  ws.close();
  process.exit(0);
})().catch(e => { console.error('ABORTED:', e.message); process.exit(2); });
