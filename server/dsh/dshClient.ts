// dsh web sidecar 的线上协议客户端：
// - 一元 RPC：POST {base}/api/<method>，client-request 信封 → server-response 信封。
// - 流式：WebSocket {base}/api/events.mux（只下行，逐帧 server-request 信封）。
// 只跑 loopback（127.0.0.1），Host 头由 fetch/ws 自动带。

import WebSocket from 'ws';

export interface DshMuxHooks {
  onOpened?: () => void;
  onFrame: (frameEnvelope: any) => void;
  onClosed: () => void;
}

export interface DshMuxHandle {
  close: () => void;
}

function newRpcId(): string {
  return `hpclaw-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export class DshClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  /** 一元 RPC：返回 result.value；ok:false 或传输失败时 throw（Error.code 带 dsh 错误码）。 */
  async rpc<T = any>(method: string, payload: unknown): Promise<T> {
    let res: Response;
    try {
      res = await fetch(`${this.baseUrl}/api/${method}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'client-request', rpcId: newRpcId(), method, payload }),
      });
    } catch (err) {
      throw new Error(`network_error: ${err instanceof Error ? err.message : String(err)}`);
    }
    const envelope: any = await res.json().catch(() => undefined);
    const result = envelope?.result;
    if (result?.ok === true) return result.value as T;
    const code = typeof result?.error?.code === 'string' ? result.error.code : `http_${res.status}`;
    const message = typeof result?.error?.message === 'string' ? result.error.message : `dsh rpc ${method} failed`;
    const err = new Error(`${code}: ${message}`) as Error & { code?: string };
    err.code = code;
    throw err;
  }

  /** 传已有 sessionId 可冷恢复该会话；cwd 与 workspaceId 至多一个（这里只用 cwd）。 */
  async createSession(opts: { cwd: string; sessionId?: string }): Promise<string> {
    const value = await this.rpc<{ sessionId: string }>('session.create', {
      cwd: opts.cwd,
      sessionId: opts.sessionId,
    });
    return String(value?.sessionId || '');
  }

  /** best-effort：失败只 warn 不 throw（模型选择在 dsh 侧可能被 profile 固定）。 */
  async selectModel(opts: { sessionId: string; provider: string; model: string; reasoningEffort?: string }): Promise<void> {
    try {
      await this.rpc('session.selectModel', opts);
    } catch (err) {
      console.warn('[dsh] selectModel 失败（已忽略）: %s', err instanceof Error ? err.message : String(err));
    }
  }

  async prompt(opts: { sessionId: string; text: string }): Promise<{ accepted?: boolean }> {
    return await this.rpc('session.prompt', {
      sessionId: opts.sessionId,
      mode: 'queue',
      content: [{ type: 'text', text: opts.text }],
      clientTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  }

  async cancel(sessionId: string): Promise<void> {
    await this.rpc('session.cancel', { sessionId });
  }

  /** 审批应答：POST {base}/api/respond，client-response 信封。返回服务端是否 accepted。 */
  async respondApproval(opts: {
    rpcId: string;
    sessionId: string;
    approvalId: string;
    outcome: 'allowed-once' | 'rejected';
  }): Promise<boolean> {
    let res: Response;
    try {
      res = await fetch(`${this.baseUrl}/api/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'client-response',
          rpcId: opts.rpcId,
          result: {
            ok: true,
            value: { sessionId: opts.sessionId, approvalId: opts.approvalId, outcome: opts.outcome },
          },
        }),
      });
    } catch (err) {
      console.warn('[dsh] 审批应答传输失败: %s', err instanceof Error ? err.message : String(err));
      return false;
    }
    const body: any = await res.json().catch(() => undefined);
    return body?.accepted === true;
  }

  /**
   * 用户反问应答：question/requested 是一个可回复的 server-request，
   * 必须对 /api/respond 回送同一个 rpcId，dsh 才会继续当前 turn。
   */
  async respondQuestion(opts: {
    rpcId: string;
    sessionId: string;
    answer: { answers: Array<{ id: string; selected: string[]; custom?: string }> };
  }): Promise<boolean> {
    let res: Response;
    try {
      res = await fetch(`${this.baseUrl}/api/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'client-response',
          rpcId: opts.rpcId,
          result: {
            ok: true,
            value: { sessionId: opts.sessionId, answer: opts.answer },
          },
        }),
      });
    } catch (err) {
      console.warn('[dsh] 反问应答传输失败: %s', err instanceof Error ? err.message : String(err));
      return false;
    }
    const body: any = await res.json().catch(() => undefined);
    return body?.accepted === true;
  }

  /** 连接事件多路复用 WS。断线只回调 onClosed，是否重连由调用方决定。 */
  connectMux(hooks: DshMuxHooks): DshMuxHandle {
    const url = new URL('/api/events.mux', this.baseUrl);
    url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(url.toString());
    let closedByUs = false;
    let notified = false;
    const notifyClosed = (): void => {
      if (notified || closedByUs) return;
      notified = true;
      hooks.onClosed();
    };
    ws.on('open', () => {
      try {
        hooks.onOpened?.();
      } catch (err) {
        console.warn('[dsh] mux 就绪回调异常（已忽略）: %s', err instanceof Error ? err.message : String(err));
      }
    });
    ws.on('message', (raw: WebSocket.RawData) => {
      const text = Buffer.isBuffer(raw)
        ? raw.toString('utf8')
        : Array.isArray(raw)
          ? Buffer.concat(raw).toString('utf8')
          : String(raw);
      let frame: any;
      try {
        frame = JSON.parse(text);
      } catch {
        return; // 非 JSON 帧直接忽略
      }
      try {
        hooks.onFrame(frame);
      } catch (err) {
        console.warn('[dsh] mux 帧处理异常（已忽略）: %s', err instanceof Error ? err.message : String(err));
      }
    });
    ws.on('close', notifyClosed);
    ws.on('error', notifyClosed);
    return {
      close: () => {
        closedByUs = true;
        try { ws.terminate(); } catch { /* 已关闭 */ }
      },
    };
  }
}
