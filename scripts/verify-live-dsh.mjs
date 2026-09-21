import WebSocket from 'ws';

const port = Number(process.argv[2]);
if (!Number.isInteger(port) || port <= 0) {
  throw new Error('usage: node scripts/verify-live-dsh.mjs <port>');
}

const baseUrl = `http://127.0.0.1:${port}`;
const rpc = async (method, payload) => {
  const response = await fetch(`${baseUrl}/api/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'client-request',
      rpcId: `verify-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`,
      method,
      payload,
    }),
  });
  const envelope = await response.json();
  if (envelope?.result?.ok !== true) {
    throw new Error(envelope?.result?.error?.message || `RPC ${method} failed`);
  }
  return envelope.result.value;
};

const cwd = process.cwd();
const created = await rpc('session.create', { cwd });
const sessionId = created.sessionId;
await rpc('session.selectModel', { sessionId, provider: 'deepseek-official', model: 'deepseek-v4-pro' });

let textLength = 0;
let terminalReason = 'timeout';
let terminalError = '';

await new Promise((resolve, reject) => {
  const wsUrl = new URL('/api/events.mux', baseUrl);
  wsUrl.protocol = 'ws:';
  const ws = new WebSocket(wsUrl);
  const timer = setTimeout(() => {
    ws.terminate();
    reject(new Error('live DSH verification timed out'));
  }, 60_000);

  const finish = () => {
    clearTimeout(timer);
    try { ws.terminate(); } catch {}
    resolve();
  };

  ws.on('open', () => {
    void rpc('session.prompt', {
      sessionId,
      mode: 'queue',
      content: [{ type: 'text', text: '只回复 HPCLAW_DSH_OK，不要调用任何工具。' }],
      clientTimeZone: 'Asia/Shanghai',
    }).catch(reject);
  });
  ws.on('message', raw => {
    let frame;
    try { frame = JSON.parse(String(raw)); } catch { return; }
    if (frame?.method !== 'session/event' || frame.payload?.sessionId !== sessionId) return;
    const event = frame.payload.event;
    if (event?.type === 'assistant/chunk' && event.data?.chunk?.type === 'text-delta') {
      textLength += String(event.data.chunk.text || '').length;
    }
    if (event?.type === 'turn/end') {
      terminalReason = event.data?.reason?.kind || 'unknown';
      terminalError = String(event.data?.reason?.error?.code || '');
      finish();
    }
  });
  ws.on('error', reject);
});

console.log(JSON.stringify({ sessionId, terminalReason, terminalError, textLength }));
if (terminalReason !== 'completed' || textLength === 0) process.exitCode = 1;
