// 测试桩：模拟 dsh --profile sdk 的换行 JSON-RPC 服务。
// 行为：initialize 应答 serverInfo；session/prompt 应答 messageId 并推送
// session.status running → 一条 session.event(assistant/message) → turn/end →
// session.status idle；session/wait 在 idle 前挂起、idle 后应答；
// session/resume 对 unknown-* 前缀报错（模拟 not found）；shutdown 应答后退出。
// 环境变量 FAKE_DSH_CRASH_AFTER_INIT=1 时 initialize 后直接崩溃（测清理路径）。
const readline = require('node:readline');

let running = false;
const rl = readline.createInterface({ input: process.stdin });

function send(msg) {
  process.stdout.write(JSON.stringify(msg) + '\n');
}

function reply(id, result) {
  send({ jsonrpc: '2.0', id, result });
}

function replyError(id, message) {
  send({ jsonrpc: '2.0', id, error: { code: -32603, message } });
}

rl.on('line', line => {
  let msg;
  try {
    msg = JSON.parse(line);
  } catch {
    return;
  }
  if (msg.id === undefined || !msg.method) return;
  if (process.env.FAKE_DSH_HANG === '1') return; // 挂起模式：任何请求都不应答（测超时）
  switch (msg.method) {
    case 'initialize':
      reply(msg.id, { serverInfo: { name: 'deepseek-harness-sdk-runtime', version: '0.0.1-fake' } });
      if (process.env.FAKE_DSH_CRASH_AFTER_INIT === '1') process.exit(2);
      break;
    case 'session/prompt': {
      const sessionId = String(msg.params?.sessionId ?? '');
      reply(msg.id, { messageId: 'fake-message-1' });
      running = true;
      send({ jsonrpc: '2.0', method: 'session.status', params: { sessionId, status: 'running' } });
      send({ jsonrpc: '2.0', method: 'session.event', params: { sessionId, event: { type: 'assistant/message', seq: 1, time: Date.now(), data: { turn: 1, step: 1, message: { role: 'assistant', content: [{ type: 'text', text: 'fake answer' }] } } } } });
      send({ jsonrpc: '2.0', method: 'session.event', params: { sessionId, event: { type: 'turn/end', seq: 2, time: Date.now(), data: { turn: 1, reason: { kind: 'completed' } } } } });
      running = false;
      send({ jsonrpc: '2.0', method: 'session.status', params: { sessionId, status: 'idle' } });
      break;
    }
    case 'session/resume':
      if (String(msg.params?.sessionId ?? '').startsWith('unknown-')) replyError(msg.id, 'unknown SDK session: ' + msg.params.sessionId);
      else reply(msg.id, {});
      break;
    case 'session/wait': {
      const id = msg.id;
      if (running) {
        const timer = setInterval(() => {
          if (!running) {
            clearInterval(timer);
            reply(id, {});
          }
        }, 10);
        timer.unref?.();
      } else {
        reply(id, {});
      }
      break;
    }
    case 'session/working-directory/set':
      reply(msg.id, { cwd: msg.params?.path ?? process.cwd() });
      break;
    case 'shutdown':
      reply(msg.id, {});
      setTimeout(() => process.exit(0), 10).unref?.();
      break;
    default:
      replyError(msg.id, 'unknown DeepSeek Harness SDK runtime method: ' + msg.method);
  }
});

rl.on('close', () => process.exit(0));
