// dsh 0.2.x sdk profile 的 stdio JSON-RPC 客户端：
// - 传输：子进程 stdin/stdout 上的换行分隔 JSON-RPC 2.0（@deepseek-ai/dsh-sdk-protocol）。
// - 请求/应答按 id 配对；session.event / session.status / subagent.* 通知分发给订阅者。
// - 进程退出/流关闭：拒绝所有挂起请求，触发 onExit（恰好一次），后续写请求立即失败。
// 注意：协议没有 session 级 cancel（initialize/prompt/resume/wait/working-directory/shutdown
// 是全部方法）；停止一个 turn 只能靠 shutdown 整个运行时，由 sidecar 监管重启。

import { spawn, type ChildProcess } from 'node:child_process';

export interface DshSdkSpawnSpec {
  /** 可执行文件（shell:false）或完整命令行（shell:true，兼容 DSH_BIN 覆盖）。 */
  command: string;
  args: string[];
  shell: boolean;
  env: NodeJS.ProcessEnv;
  cwd: string;
}

export interface DshSdkServerInfo {
  name: string;
  version: string;
}

export interface DshSdkSessionEvent {
  sessionId: string;
  event: any;
}

export type DshSdkSessionStatus = 'idle' | 'running';

export interface DshSdkClientOptions {
  /** 单请求默认超时（initialize 单独给足启动时间）；wait 长轮询不受此限。 */
  requestTimeoutMs?: number;
  /** stdout 上出现非 JSON 行时回调（dsh 侧日志透传）。 */
  onLog?: (line: string) => void;
}

interface PendingRequest {
  method: string;
  resolve: (value: any) => void;
  reject: (err: Error) => void;
  timer?: ReturnType<typeof setTimeout>;
}

const DEFAULT_REQUEST_TIMEOUT_MS = 30_000;

/** JSON-RPC 错误应答 → Error（code 带 dsh 侧错误码/message，供调用方归类）。 */
function rpcError(method: string, error: any): Error {
  const message = typeof error?.message === 'string' && error.message ? error.message : `dsh sdk ${method} failed`;
  const err = new Error(message) as Error & { code?: string | number; data?: unknown };
  if (typeof error?.code === 'number' || typeof error?.code === 'string') err.code = error.code;
  if (error?.data !== undefined) err.data = error.data;
  return err;
}

export class DshSdkClient {
  private readonly child: ChildProcess;
  private readonly requestTimeoutMs: number;
  private readonly onLog?: (line: string) => void;
  private nextId = 0;
  private readonly pending = new Map<number, PendingRequest>();
  private buffer = '';
  private exited = false;
  private exitNotified = false;
  private readonly sessionEventSubs = new Set<(n: DshSdkSessionEvent) => void>();
  private readonly sessionStatusSubs = new Set<(n: { sessionId: string; status: DshSdkSessionStatus }) => void>();
  private readonly notificationSubs = new Set<(method: string, params: any) => void>();
  private readonly exitSubs = new Set<(code: number | null, signal: NodeJS.Signals | null) => void>();
  private readonly lastStatus = new Map<string, DshSdkSessionStatus>();

  private constructor(child: ChildProcess, opts: DshSdkClientOptions) {
    this.child = child;
    this.requestTimeoutMs = opts.requestTimeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS;
    this.onLog = opts.onLog;
    child.stdout?.on('data', (chunk: Buffer) => this.onStdout(chunk));
    child.stderr?.on('data', (chunk: Buffer) => {
      const line = chunk.toString('utf8').trimEnd();
      if (line) this.onLog?.(`[stderr] ${line}`);
    });
    child.on('error', () => this.onProcessExit(child.exitCode, null));
    child.on('exit', (code, signal) => this.onProcessExit(code, signal));
    child.on('close', () => this.onProcessExit(child.exitCode, null));
  }

  /** spawn 子进程并返回协议客户端（不负责就绪握手——initialize 由调用方发）。 */
  static spawn(spec: DshSdkSpawnSpec, opts: DshSdkClientOptions = {}): DshSdkClient {
    const child = spec.shell
      ? spawn(spec.command, { cwd: spec.cwd, env: spec.env, shell: true, windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] })
      : spawn(spec.command, spec.args, { cwd: spec.cwd, env: spec.env, windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] });
    return new DshSdkClient(child, opts);
  }

  get pid(): number | undefined {
    return this.child.pid;
  }

  get isAlive(): boolean {
    return !this.exited;
  }

  private onStdout(chunk: Buffer): void {
    this.buffer += chunk.toString('utf8');
    let index: number;
    while ((index = this.buffer.indexOf('\n')) >= 0) {
      const line = this.buffer.slice(0, index).trim();
      this.buffer = this.buffer.slice(index + 1);
      if (!line) continue;
      let msg: any;
      try {
        msg = JSON.parse(line);
      } catch {
        this.onLog?.(line);
        continue;
      }
      this.dispatch(msg);
    }
  }

  private dispatch(msg: any): void {
    // 应答：有 id 且能在 pending 里配对。
    if (msg !== null && typeof msg === 'object' && (typeof msg.id === 'number' || typeof msg.id === 'string') && msg.method === undefined) {
      const id = Number(msg.id);
      const entry = this.pending.get(id);
      if (!entry) return; // 迟到/未知应答：忽略
      this.pending.delete(id);
      if (entry.timer) clearTimeout(entry.timer);
      if (msg.error) entry.reject(rpcError(entry.method, msg.error));
      else entry.resolve(msg.result);
      return;
    }
    // 通知：无 id 有 method。
    if (msg !== null && typeof msg === 'object' && typeof msg.method === 'string') {
      const params = msg.params;
      if (msg.method === 'session.event') {
        const sessionId = String(params?.sessionId ?? '');
        const note: DshSdkSessionEvent = { sessionId, event: params?.event };
        for (const cb of [...this.sessionEventSubs]) {
          try { cb(note); } catch (err) { console.warn('[dsh-sdk] session.event 订阅回调异常（已忽略）: %s', err instanceof Error ? err.message : String(err)); }
        }
        return;
      }
      if (msg.method === 'session.status') {
        const sessionId = String(params?.sessionId ?? '');
        const status: DshSdkSessionStatus = params?.status === 'running' ? 'running' : 'idle';
        this.lastStatus.set(sessionId, status);
        for (const cb of [...this.sessionStatusSubs]) {
          try { cb({ sessionId, status }); } catch (err) { console.warn('[dsh-sdk] session.status 订阅回调异常（已忽略）: %s', err instanceof Error ? err.message : String(err)); }
        }
        return;
      }
      for (const cb of [...this.notificationSubs]) {
        try { cb(msg.method, params); } catch (err) { console.warn('[dsh-sdk] 通知订阅回调异常（已忽略）: %s', err instanceof Error ? err.message : String(err)); }
      }
    }
  }

  private onProcessExit(code: number | null, signal: NodeJS.Signals | null): void {
    if (this.exited) return;
    this.exited = true;
    const err = new Error(`dsh_process_exit: code=${code ?? 'null'} signal=${signal ?? 'none'}`);
    for (const entry of this.pending.values()) {
      if (entry.timer) clearTimeout(entry.timer);
      entry.reject(err);
    }
    this.pending.clear();
    if (this.exitNotified) return;
    this.exitNotified = true;
    for (const cb of [...this.exitSubs]) {
      try { cb(code, signal); } catch { /* 订阅者异常不阻断退出传播 */ }
    }
  }

  private request<T>(method: string, params: unknown, timeoutMs?: number): Promise<T> {
    if (this.exited) return Promise.reject(new Error(`dsh_process_exit: cannot send ${method}, process already exited`));
    const id = ++this.nextId;
    return new Promise<T>((resolve, reject) => {
      const entry: PendingRequest = { method, resolve, reject };
      if (timeoutMs !== 0) {
        entry.timer = setTimeout(() => {
          this.pending.delete(id);
          reject(new Error(`DSH_SDK_RPC_TIMEOUT: ${method} 未在 ${Math.round((timeoutMs ?? this.requestTimeoutMs) / 1000)}s 内应答`));
        }, timeoutMs ?? this.requestTimeoutMs);
        entry.timer.unref?.();
      }
      this.pending.set(id, entry);
      try {
        this.child.stdin?.write(JSON.stringify({ jsonrpc: '2.0', id, method, ...(params === undefined ? {} : { params }) }) + '\n');
      } catch (err) {
        this.pending.delete(id);
        if (entry.timer) clearTimeout(entry.timer);
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    });
  }

  /** 进程级握手：配置 provider/model 路由并返回运行时身份。 */
  initialize(params: { cwd: string; provider: string; model: string; reasoningEffort?: string }, timeoutMs?: number): Promise<{ serverInfo: DshSdkServerInfo }> {
    return this.request('initialize', params, timeoutMs ?? 120_000);
  }

  /** 投递一轮用户输入；未知 sessionId 会惰性创建会话。 */
  async prompt(params: { sessionId: string; text: string }): Promise<{ messageId: string }> {
    return await this.request('session/prompt', {
      sessionId: params.sessionId,
      contentBlocks: [{ type: 'text', text: params.text }],
    });
  }

  /** 恢复持久化会话（幂等由服务端保证：已打开/不存在都会报错，调用方按文案归类）。 */
  async resume(sessionId: string): Promise<void> {
    await this.request('session/resume', { sessionId });
  }

  /** 长轮询等会话（含子代理）转入 idle；无超时——调用方自行 race。 */
  async wait(sessionId: string): Promise<void> {
    await this.request('session/wait', { sessionId }, 0);
  }

  async getWorkingDirectory(sessionId: string): Promise<string> {
    const result = await this.request<{ cwd: string }>('session/working-directory/get', { sessionId });
    return String(result?.cwd ?? '');
  }

  async setWorkingDirectory(sessionId: string, path: string): Promise<string> {
    const result = await this.request<{ cwd: string }>('session/working-directory/set', { sessionId, path });
    return String(result?.cwd ?? '');
  }

  /** 优雅关停运行时（应答后 dsh 自行退出进程）。 */
  async shutdown(timeoutMs = 15_000): Promise<void> {
    await this.request('shutdown', undefined, timeoutMs);
  }

  /**
   * 会话活性探测：协议没有 status 查询，用 session/wait 竞速实现——
   * 立即 resolve = idle；超时 = running；unknown session 错误 = not found。
   * 进程死亡/传输错误不归类（继续 throw），调用方按通信中断处理。
   */
  async probeSession(sessionId: string, timeoutMs = 3_000): Promise<'idle' | 'running' | 'unknown'> {
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const outcome = await Promise.race([
        this.wait(sessionId).then(() => 'idle' as const, (err: unknown) => {
          const message = err instanceof Error ? err.message : String(err);
          if (/unknown SDK session/i.test(message)) return 'unknown' as const;
          if (/^(dsh_process_exit|DSH_SDK_RPC_TIMEOUT)/.test(message)) throw err;
          // agent 故障等其余拒绝 = 回合已终结（事件流已携带失败原因），按 idle 处理。
          return 'idle' as const;
        }),
        new Promise<'timeout'>(resolve => {
          timer = setTimeout(() => resolve('timeout'), timeoutMs);
          timer.unref?.();
        }),
      ]);
      return outcome === 'timeout' ? 'running' : outcome;
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  /** 最近一次 session.status 通知记录的会话状态（无记录返回 undefined）。 */
  sessionStatusOf(sessionId: string): DshSdkSessionStatus | undefined {
    return this.lastStatus.get(sessionId);
  }

  onSessionEvent(cb: (n: DshSdkSessionEvent) => void): () => void {
    this.sessionEventSubs.add(cb);
    return () => { this.sessionEventSubs.delete(cb); };
  }

  onSessionStatus(cb: (n: { sessionId: string; status: DshSdkSessionStatus }) => void): () => void {
    this.sessionStatusSubs.add(cb);
    return () => { this.sessionStatusSubs.delete(cb); };
  }

  onNotification(cb: (method: string, params: any) => void): () => void {
    this.notificationSubs.add(cb);
    return () => { this.notificationSubs.delete(cb); };
  }

  onExit(cb: (code: number | null, signal: NodeJS.Signals | null) => void): () => void {
    this.exitSubs.add(cb);
    return () => { this.exitSubs.delete(cb); };
  }

  /** 断开传输：结束 stdin（dsh 侦听 EOF 有界退出），随后由 sidecar 负责杀树。 */
  close(): void {
    try { this.child.stdin?.end(); } catch { /* 已关闭 */ }
  }

  /** 供 sidecar 杀树使用。 */
  get process(): ChildProcess {
    return this.child;
  }
}
