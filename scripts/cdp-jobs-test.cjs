// 作业监控 + 通知 实机验证
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
    const { result, exceptionDetails } = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
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

  // 1. 作业列表
  const jobs = await api('GET', '/api/jobs');
  ok('作业列表接口返回', jobs.status === 200 && Array.isArray(jobs.data.jobs), `jobs=${(jobs.data.jobs || []).length}`);

  // 2. 作业事件接口
  const events = await api('GET', '/api/jobs/events');
  ok('作业事件接口返回', events.status === 200 && Array.isArray(events.data.events), `events=${(events.data.events || []).length}`);

  // 3. 通知配置默认值
  const cfg = await api('GET', '/api/notify/config');
  ok('通知配置读取', cfg.status === 200 && cfg.data.config && cfg.data.config.channel === 'serverchan',
    JSON.stringify({ enabled: cfg.data.config?.enabled, channel: cfg.data.config?.channel }));

  // 4. 保存配置（Server酱 假 key）
  const put = await api('PUT', '/api/notify/config', { enabled: true, channel: 'serverchan', sendKey: 'SCU123456test' });
  const cfg2 = await api('GET', '/api/notify/config');
  ok('配置保存生效', put.status === 200 && cfg2.data.config.enabled === true && cfg2.data.config.sendKey === 'SCU123456test');

  // 5. 测试发送（假 key 应返回明确错误，证明发送链路执行了）
  const test = await api('POST', '/api/notify/test');
  ok('测试发送链路执行（假 key 报错符合预期）',
    test.status === 400 && typeof test.data.error === 'string' && test.data.error.length > 0,
    (test.data.error || '').slice(0, 80));

  // 恢复关闭状态
  await api('PUT', '/api/notify/config', { enabled: false, channel: 'serverchan', sendKey: '' });

  // 6. 作业面板 UI
  await evalJs(`(() => { const b = document.querySelector('button[aria-label="作业监控"]'); if (b) b.click(); })()`);
  await sleep(2500);
  const panel = await evalJs(`(() => {
    const text = document.body.innerText;
    return { hasPanel: text.includes('作业监控'), hasSettings: text.includes('通知设置') || text.includes('完成时提醒我') || text.includes('提醒已关闭') };
  })()`);
  ok('作业面板打开并显示通知设置', panel.hasPanel && panel.hasSettings, JSON.stringify(panel));
  await shot('E:/0612hpclaw/hpclaw_v2/smoke-jobs.png');

  console.log('---');
  const failed = results.filter(r => !r.pass);
  console.log(`结果: ${results.length - failed.length}/${results.length} 通过`);
  ws.close();
  process.exit(failed.length ? 1 : 0);
})().catch(e => { console.error('ABORTED:', e.message); process.exit(2); });
