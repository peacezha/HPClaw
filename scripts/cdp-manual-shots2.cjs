// 详细版教程全套截图采集（13 张）
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
  const typeChars = async (text, enter = false) => {
    const rect = await evalJs(`(() => { const t = document.querySelector('.xterm'); const b = t.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
    await clickAt(rect.x, rect.y);
    await sleep(300);
    for (const ch of text.split('')) {
      await send('Input.dispatchKeyEvent', { type: 'keyDown', key: ch, text: ch });
      await send('Input.dispatchKeyEvent', { type: 'keyUp', key: ch });
      await sleep(25);
    }
    if (enter) {
      await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
      await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
    }
  };

  for (let i = 0; i < 90; i++) {
    const ready = await evalJs(`!!document.querySelector('button[aria-label="打开 AI 助手"], button[aria-label="关闭 AI 助手"]')`).catch(() => false);
    if (ready) break;
    await sleep(1000);
  }
  await sleep(2000);

  // 01 主界面-白天
  await shot('01-main-light');

  // 02 主界面-黑夜（切回白天）
  let btn = await clickBtn('切换到黑夜模式');
  if (btn) await clickAt(btn.x, btn.y);
  await sleep(800);
  await shot('02-main-dark');
  btn = await clickBtn('切换到白天模式');
  if (btn) await clickAt(btn.x, btn.y);
  await sleep(800);

  // 03 AI 助理 + 关键词流程卡片
  btn = await clickBtn('打开 AI 助手');
  if (btn) await clickAt(btn.x, btn.y);
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
  await evalJs(`(() => {
    const ta = document.querySelector('textarea');
    const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
    setter.call(ta, '');
    ta.dispatchEvent(new Event('input', { bubbles: true }));
  })()`);

  // 04 流程面板
  await evalJs(`(() => { const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim() === '流程'); if (b) b.click(); })()`);
  await sleep(1200);
  await evalJs(`(() => { const items = [...document.querySelectorAll('button')].filter(x => x.textContent.includes('RNA-seq')); if (items[0]) items[0].click(); })()`);
  await sleep(600);
  await shot('04-workflows');

  // 05 技能库
  await evalJs(`(() => { const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim().startsWith('技能库')); if (b) b.click(); })()`);
  await sleep(1500);
  await shot('05-skills');

  // 06 AI 设置面板（回 AI tab 打开设置）
  await evalJs(`(() => { const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim().startsWith('AI')); if (b) b.click(); })()`);
  await sleep(500);
  await evalJs(`(() => { const b = document.querySelector('button[aria-label="AI 设置"]'); if (b) b.click(); })()`);
  await sleep(800);
  await shot('06-ai-settings');
  await evalJs(`(() => { const b = document.querySelector('button[aria-label="AI 设置"]'); if (b) b.click(); })()`);

  // 07 作业监控面板（展开通知设置）
  btn = await clickBtn('作业监控');
  if (btn) await clickAt(btn.x, btn.y);
  await sleep(2500);
  await evalJs(`(() => { const b = [...document.querySelectorAll('button')].find(x => x.textContent.includes('通知设置')); if (b) b.click(); })()`);
  await sleep(800);
  await shot('07-jobs-notify');
  btn = await clickBtn('作业监控');
  if (btn) await clickAt(btn.x, btn.y);
  await sleep(500);

  // 08 文件传输工作区
  btn = await clickBtn('文件传输');
  if (btn) await clickAt(btn.x, btn.y);
  await sleep(4000);
  await shot('08-transfer');

  // 09 传输右键菜单
  const menuPos = await evalJs(`(() => {
    const rows = document.querySelectorAll('[data-testid^="file-row-"]');
    if (!rows.length) return null;
    const r = rows[0].getBoundingClientRect();
    return { x: r.left + 60, y: r.top + r.height / 2 };
  })()`);
  if (menuPos) {
    await evalJs(`(() => {
      const rows = document.querySelectorAll('[data-testid^="file-row-"]');
      rows[0].dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: ${menuPos.x}, clientY: ${menuPos.y} }));
    })()`);
    await sleep(500);
    await shot('09-transfer-menu');
    await evalJs(`document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))`);
  }
  await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await sleep(800);

  // 10 命令补全（路径提示）：先 ls 一下家目录让内容在屏上，再敲 cat mini
  await typeChars('ls -lh minimap.out', true);
  await sleep(2000);
  await typeChars('cat mini');
  await sleep(1500);
  await shot('10-autocomplete');
  // 清空输入行
  await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'c', code: 'KeyC', windowsVirtualKeyCode: 67, modifiers: 2 });
  await sleep(500);

  // 11 终端文件名点击预览
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
    await clickAt(linkPos.x, linkPos.y);
    await sleep(3500);
    await shot('11-link-preview');
    await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await sleep(500);
  }

  // 12 对话记录面板
  btn = await clickBtn('对话记录');
  if (btn) await clickAt(btn.x, btn.y);
  await sleep(1500);
  await shot('12-history');
  btn = await clickBtn('对话记录');
  if (btn) await clickAt(btn.x, btn.y);
  await sleep(500);

  // 13 断线重连横幅（最后做，exit 后点重连恢复）
  await typeChars('exit', true);
  await sleep(3500);
  await shot('13-shell-dead');
  await evalJs(`(() => { const b = [...document.querySelectorAll('button')].find(x => x.textContent.includes('点击重连')); if (b) b.click(); })()`);
  await sleep(4000);

  console.log('done');
  ws.close();
  process.exit(0);
})().catch(e => { console.error('ABORTED:', e.message); process.exit(2); });
