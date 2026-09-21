// HPClaw v2 AI 智能化实机验证：中文技能检索 + agent 问答 + 确认端点
const http = require('http');
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
  const evalJs = async (expression) => {
    const { result, exceptionDetails } = await send('Runtime.evaluate', {
      expression, returnByValue: true, awaitPromise: true,
    });
    if (exceptionDetails) throw new Error('renderer exception: ' + JSON.stringify(exceptionDetails.exception?.description || exceptionDetails.text));
    return result.value;
  };
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // 等主界面
  for (let i = 0; i < 90; i++) {
    const ready = await evalJs(`!!document.querySelector('button[aria-label="打开 AI 助手"], button[aria-label="关闭 AI 助手"]')`).catch(() => false);
    if (ready) break;
    await sleep(1000);
  }

  // ── 1. 中文技能检索（此前因分词 bug 恒为空）────────────────────────────
  for (const q of ['质控', '转录组', '序列比对']) {
    const r = await evalJs(`fetch('/api/skills/search?q=${encodeURIComponent(q)}').then(r => r.json())`);
    const n = (r.results || []).length;
    ok(`中文技能检索「${q}」有结果`, n > 0, `${n} 条`);
  }

  // ── 2. 确认端点存活（假 id 应 404）──────────────────────────────────────
  const conf = await evalJs(`fetch('/api/ai/confirm', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: 'fake-id', approved: true }) }).then(r => r.status)`);
  ok('确认端点存活并校验 id', conf === 404, `status=${conf}`);

  // ── 3. 真实 agent 问答（触发工具调用 + 集群上下文）─────────────────────
  // 打开 AI 面板
  await evalJs(`(() => { const b = document.querySelector('button[aria-label="打开 AI 助手"]'); if (b) b.click(); })()`);
  await sleep(1200);
  // 检查 AI 是否已配置（是否有输入框而不是配置表单）
  const aiReady = await evalJs(`!!document.querySelector('textarea')`);
  if (!aiReady) {
    ok('AI 已配置可用', false, '未找到聊天输入框（可能未配置 API Key）');
  } else {
    // 输入并提交一个会触发工具调用的问题
    await evalJs(`(() => {
      const ta = document.querySelector('textarea');
      const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      setter.call(ta, '用 ls 看一下当前目录有什么文件，一句话告诉我');
      ta.dispatchEvent(new Event('input', { bubbles: true }));
    })()`);
    await sleep(300);
    await evalJs(`(() => {
      const btns = [...document.querySelectorAll('button[type="submit"]')];
      if (btns.length) btns[btns.length - 1].click();
    })()`);
    console.log('已提交 agent 问题，等待执行（最长 240s）…');

    // 轮询聊天区：等待最终回答出现（loading 结束且非错误）
    let sawToolCall = false, sawFinal = false, sawError = false, finalSnippet = '';
    const t0 = Date.now();
    while (Date.now() - t0 < 240_000) {
      const state = await evalJs(`(() => {
        const texts = document.body.innerText;
        const loading = !![...document.querySelectorAll('button[title="停止"]')].length;
        return {
          loading,
          toolCall: texts.includes('run_command'),
          error: texts.includes('[✗ Agent error]') || texts.includes('[❌ Error]'),
        };
      })()`);
      sawToolCall = sawToolCall || state.toolCall;
      sawError = sawError || state.error;
      if (!state.loading && sawToolCall) { sawFinal = true; break; }
      if (!state.loading && !state.toolCall && Date.now() - t0 > 20_000) { sawFinal = true; break; } // 可能直接回答
      await sleep(2000);
    }
    ok('agent 触发了工具调用（run_command）', sawToolCall);
    ok('agent 完成且未报错', sawFinal && !sawError, sawError ? '出现错误消息' : '');
  }

  console.log('---');
  const failed = results.filter(r => !r.pass);
  console.log(`结果: ${results.length - failed.length}/${results.length} 通过`);
  ws.close();
  process.exit(failed.length ? 1 : 0);
})().catch(e => { console.error('ABORTED:', e.message); process.exit(2); });
