// HPClaw v2 流程（Workflow）实机验证：CRUD + 匹配 + UI
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
  const api = async (method, path, body) => {
    const expr = `(async () => {
      const r = await fetch('${path}', {
        method: '${method}',
        headers: { 'Content-Type': 'application/json' },
        ${body !== undefined ? `body: JSON.stringify(${JSON.stringify(body)}),` : ''}
      });
      const text = await r.text();
      let data; try { data = JSON.parse(text); } catch { data = text; }
      return { status: r.status, data };
    })()`;
    return evalJs(expr);
  };
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

  // ── 1. 内置流程已就绪 ──
  const listRes = await api('GET', '/api/workflows');
  const wfs = listRes.data.workflows || [];
  ok('内置流程已写入（≥3 个）', wfs.length >= 3, `${wfs.length} 个: ${wfs.map(w => w.name).join(' | ')}`);

  // ── 2. 关键词匹配 ──
  const m1 = await api('POST', '/api/workflows/match', { query: '帮我做转录组分析' });
  ok('「转录组」匹配到 RNA-seq 流程', (m1.data.matches || [])[0]?.name?.includes('RNA-seq'), (m1.data.matches || [])[0]?.name);
  const m2 = await api('POST', '/api/workflows/match', { query: 'blast 同源比对' });
  ok('「blast」匹配到 BLAST 流程', (m2.data.matches || [])[0]?.name?.includes('BLAST'), (m2.data.matches || [])[0]?.name);
  const m3 = await api('POST', '/api/workflows/match', { query: '今天天气不错' });
  ok('无关查询不匹配', (m3.data.matches || []).length === 0);

  // ── 3. 自定义流程 CRUD ──
  const created = await api('POST', '/api/workflows', {
    name: '测试流程-请删除',
    description: '实机验证用',
    keywords: ['测试流程', 'testwf'],
    params: [{ name: 'IN', label: '输入文件' }],
    steps: [
      { title: '第一步', command: 'ls -lh {{IN}}' },
      { title: '第二步', command: 'wc -l {{IN}}', optional: true },
    ],
  });
  const newId = created.data.workflow?.id;
  ok('创建自定义流程', created.status === 201 && !!newId);
  const m4 = await api('POST', '/api/workflows/match', { query: 'testwf 测试流程' });
  ok('自定义流程可被匹配', (m4.data.matches || []).some(w => w.id === newId));
  const del = await api('DELETE', `/api/workflows/${newId}`);
  ok('删除自定义流程', del.status === 200);

  // ── 4. UI：流程面板 ──
  await evalJs(`(() => { const b = document.querySelector('button[aria-label="打开 AI 助手"]'); if (b) b.click(); })()`);
  await sleep(1200);
  await evalJs(`(() => {
    const btns = [...document.querySelectorAll('button')];
    const tab = btns.find(b => b.textContent.trim() === '流程');
    if (tab) tab.click();
  })()`);
  await sleep(1500);
  const panelState = await evalJs(`(() => {
    const text = document.body.innerText;
    return {
      hasBuiltin: text.includes('RNA-seq') && text.includes('BLAST'),
      hasNewBtn: text.includes('新建') || text.includes('AI 生成'),
    };
  })()`);
  ok('流程面板显示内置流程', panelState.hasBuiltin);
  await shot('E:/0612hpclaw/hpclaw_v2/smoke-workflows.png');

  // ── 5. UI：聊天输入关键词 → 流程 chips ──
  await evalJs(`(() => {
    const btns = [...document.querySelectorAll('button')];
    const tab = btns.find(b => b.textContent.trim().startsWith('AI'));
    if (tab) tab.click();
  })()`);
  await sleep(800);
  await evalJs(`(() => {
    const ta = document.querySelector('textarea');
    if (!ta) return;
    const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
    setter.call(ta, '帮我做转录组分析');
    ta.dispatchEvent(new Event('input', { bubbles: true }));
  })()`);
  await sleep(1200);
  const chips = await evalJs(`document.body.innerText.includes('匹配流程')`);
  ok('输入关键词后出现流程 chips', chips);
  await shot('E:/0612hpclaw/hpclaw_v2/smoke-workflow-chips.png');

  console.log('---');
  const failed = results.filter(r => !r.pass);
  console.log(`结果: ${results.length - failed.length}/${results.length} 通过`);
  ws.close();
  process.exit(failed.length ? 1 : 0);
})().catch(e => { console.error('ABORTED:', e.message); process.exit(2); });
