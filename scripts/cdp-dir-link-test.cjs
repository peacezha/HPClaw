// HPClaw v2 终端链接升级 实机验证 v2：真实 hover + 点击（坐标定位）
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
  const typeText = async (text) => {
    for (const ch of text) {
      await send('Input.dispatchKeyEvent', { type: 'keyDown', key: ch, text: ch });
      await sleep(40);
    }
  };
  const pressEnter = () => send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', text: '\r' });

  // 等终端就绪
  let termReady = false;
  for (let i = 0; i < 90; i++) {
    termReady = await evalJs(`!!document.querySelector('.xterm')`).catch(() => false);
    if (termReady) break;
    await sleep(1000);
  }
  ok('终端就绪（已登录）', termReady);
  if (!termReady) throw new Error('terminal not ready');
  await sleep(2000);

  // 构造干净的测试环境
  await typeText('mkdir -p /tmp/cdp_link_test/d1 && cd /tmp/cdp_link_test && touch f1.txt && clear && ls');
  await pressEnter();
  await sleep(3500);

  // 在 xterm-rows 中定位目标词所在的行与像素坐标（等宽字体 canvas 测宽）
  const locateWord = async (word) => evalJs(`(() => {
    const rows = document.querySelector('.xterm-rows');
    if (!rows) return { error: 'no rows' };
    const rowDivs = [...rows.children];
    for (let i = rowDivs.length - 1; i >= 0; i--) {
      const row = rowDivs[i];
      const text = row.textContent;
      const col = text.indexOf(${JSON.stringify(word)});
      if (col < 0) continue;
      const rect = row.getBoundingClientRect();
      const cs = getComputedStyle(row);
      const ctx = document.createElement('canvas').getContext('2d');
      ctx.font = cs.fontSize + ' ' + cs.fontFamily;
      const cellW = ctx.measureText('M').width;
      return {
        x: rect.left + cellW * (col + 0.5),
        y: rect.top + rect.height / 2,
        rowText: text, col, cellW,
      };
    }
    return { error: 'word not found', word: ${JSON.stringify(word)} };
  })()`);

  // hover 到目标词，等 xterm 加上 link 装饰，然后真实点击
  const hoverAndClick = async (word) => {
    const loc = await locateWord(word);
    if (loc.error) return { clicked: false, ...loc };
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: loc.x, y: loc.y });
    // 轮询等 link 装饰出现
    let deco = null;
    for (let i = 0; i < 20; i++) {
      await sleep(250);
      deco = await evalJs(`(() => {
        const links = [...document.querySelectorAll('.xterm-rows .xterm-link')];
        const texts = links.map(l => l.textContent);
        return { texts, hit: texts.some(t => t.includes(${JSON.stringify(word)})) };
      })()`);
      if (deco.hit) break;
    }
    if (!deco || !deco.hit) return { clicked: false, stage: 'hover-no-decoration', deco, loc };
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: loc.x, y: loc.y, button: 'left', clickCount: 1 });
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: loc.x, y: loc.y, button: 'left', clickCount: 1 });
    return { clicked: true, loc };
  };

  // ── 用例1：点击裸目录名 d1 → cd + ls ──
  const r1 = await hoverAndClick('d1');
  ok('hover+点击裸目录名 d1', r1.clicked === true, JSON.stringify(r1).slice(0, 200));
  await sleep(3500);
  const termText1 = await evalJs(`document.querySelector('.xterm-rows')?.textContent || ''`);
  ok('点击目录后终端执行 cd+ls', termText1.includes('cd "/tmp/cdp_link_test/d1" && ls'));
  await shot('E:/0612hpclaw/hpclaw_v2/smoke-dir-2-cd.png');

  // ── 用例2：回到上级，点击文件名 f1.txt → 预览打开 ──
  await typeText('cd /tmp/cdp_link_test && clear && ls');
  await pressEnter();
  await sleep(3000);
  const r2 = await hoverAndClick('f1.txt');
  ok('hover+点击文件名 f1.txt', r2.clicked === true, JSON.stringify(r2).slice(0, 200));
  await sleep(4500);
  const previewOpen = await evalJs(`!!document.querySelector('[data-testid="preview-overlay"]')`);
  ok('点击文件名打开预览', previewOpen);
  await shot('E:/0612hpclaw/hpclaw_v2/smoke-dir-3-preview.png');
  if (previewOpen) {
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', text: '' });
    await sleep(800);
  }

  console.log('---');
  const failed = results.filter(r => !r.pass);
  console.log(`结果: ${results.length - failed.length}/${results.length} 通过`);
  ws.close();
  process.exit(failed.length ? 1 : 0);
})().catch(e => { console.error('ABORTED:', e.message); process.exit(2); });
