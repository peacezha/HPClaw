// 在途 AI 运行登记处：让 AI 任务脱离单次 HTTP 连接存活。
// 前端切换对话/窗口时不再中止任务：服务端继续跑，事件进缓冲；
// 终态（done/error）时把最终答复追加进对话存档并广播 ai:resumed；
// 前端回到该对话时可 attach 重放缓冲并继续实时接收。
export interface ActiveRunEvent {
  type: string;
  [key: string]: unknown;
}

export interface ActiveRun {
  requestId: string;
  conversationId?: string;
  sessionId?: string;
  abort: AbortController;
  events: ActiveRunEvent[];
  text: string;
  startedAt: number;
  detached: boolean;
  terminal: 'done' | 'error' | null;
  terminalText: string;
  listeners: Set<(event: ActiveRunEvent) => void>;
}

const MAX_BUFFERED_EVENTS = 500;
const TERMINAL_TTL_MS = 15 * 60_000;

const runs = new Map<string, ActiveRun>();

export function registerActiveRun(input: {
  requestId: string;
  conversationId?: string;
  sessionId?: string;
  abort: AbortController;
}): ActiveRun {
  const run: ActiveRun = {
    requestId: input.requestId,
    conversationId: input.conversationId,
    sessionId: input.sessionId,
    abort: input.abort,
    events: [],
    text: '',
    startedAt: Date.now(),
    detached: false,
    terminal: null,
    terminalText: '',
    listeners: new Set(),
  };
  runs.set(run.requestId, run);
  return run;
}

export function getActiveRun(requestId: string): ActiveRun | undefined {
  return runs.get(requestId);
}

export function findActiveRunByConversation(conversationId: string): ActiveRun | undefined {
  for (const run of runs.values()) {
    if (run.conversationId === conversationId && !run.terminal) return run;
  }
  return undefined;
}

/** 事件先落缓冲（供 attach 重放），再推给当前 attach 的订阅者。 */
export function pushRunEvent(run: ActiveRun, event: ActiveRunEvent): void {
  if (event.type === 'content' && typeof event.content === 'string') run.text += event.content;
  run.events.push(event);
  if (run.events.length > MAX_BUFFERED_EVENTS) {
    run.events.splice(0, run.events.length - MAX_BUFFERED_EVENTS);
  }
  for (const listener of run.listeners) listener(event);
}

export function markRunDetached(run: ActiveRun): void {
  run.detached = true;
}

export function finishActiveRun(run: ActiveRun, terminal: 'done' | 'error', terminalText: string): void {
  run.terminal = terminal;
  run.terminalText = terminalText;
  setTimeout(() => {
    if (runs.get(run.requestId) === run) runs.delete(run.requestId);
  }, TERMINAL_TTL_MS).unref?.();
}

export function abortActiveRun(run: ActiveRun): void {
  run.abort.abort();
}

/** attach：返回解绑函数；调用方负责先发重放再接入实时事件。 */
export function attachRunListener(run: ActiveRun, listener: (event: ActiveRunEvent) => void): () => void {
  run.listeners.add(listener);
  return () => { run.listeners.delete(listener); };
}
