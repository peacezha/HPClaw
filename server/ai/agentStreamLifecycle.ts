export type AgentStreamPart = { type?: string; [key: string]: unknown };

type NextResult<T> =
  | { kind: 'next'; value: IteratorResult<T> }
  | { kind: 'aborted' }
  | { kind: 'timeout' };

export class AgentStreamTimeoutError extends Error {
  readonly code = 'AGENT_STREAM_TIMEOUT';

  constructor(readonly phase: 'first_response' | 'idle', timeoutMs: number) {
    super(phase === 'first_response'
      ? `AI 模型在 ${Math.round(timeoutMs / 1000)} 秒内未返回任何有效响应，已终止本轮 Agent。集群 SSH 连接保持不变，可直接重试。`
      : `AI 模型连续 ${Math.round(timeoutMs / 1000)} 秒没有新输出，已终止本轮 Agent 以防止无限“生成中”。集群 SSH 连接保持不变。`);
    this.name = 'AgentStreamTimeoutError';
  }
}

function waitForNext<T>(
  iterator: AsyncIterator<T>,
  signal: AbortSignal,
  timeoutMs: number,
): Promise<NextResult<T>> {
  if (signal.aborted) return Promise.resolve({ kind: 'aborted' });

  return new Promise((resolve, reject) => {
    let settled = false;
    const finish = (result: NextResult<T>) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      signal.removeEventListener('abort', onAbort);
      resolve(result);
    };
    const onAbort = () => finish({ kind: 'aborted' });
    const timer = setTimeout(() => finish({ kind: 'timeout' }), timeoutMs);
    signal.addEventListener('abort', onAbort, { once: true });

    // Some provider implementations do not settle iterator.next() after their
    // fetch is aborted. The abort/timeout branches above must therefore win
    // independently instead of awaiting provider cooperation.
    iterator.next().then(
      value => finish({ kind: 'next', value }),
      error => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        signal.removeEventListener('abort', onAbort);
        reject(error);
      },
    );
  });
}

function safeReturn<T>(iterator: AsyncIterator<T>): void {
  try {
    const result = iterator.return?.();
    if (result) void Promise.resolve(result).catch(() => {});
  } catch {
    // The provider stream is already being abandoned.
  }
}

function isMeaningfulProviderPart(part: AgentStreamPart): boolean {
  return part.type !== 'start' && part.type !== 'start-step';
}

export interface ConsumeAgentStreamOptions<T extends AgentStreamPart> {
  signal: AbortSignal;
  firstResponseTimeoutMs?: number;
  idleTimeoutMs?: number;
  onPart: (part: T) => void | Promise<void>;
  onFirstResponse?: (part: T) => void;
  abortProvider?: () => void;
}

export interface ConsumeAgentStreamResult {
  aborted: boolean;
  receivedProviderResponse: boolean;
}

/**
 * Consume an AI SDK fullStream without trusting the provider iterator to honor
 * AbortSignal. This is the hard lifecycle boundary for one Agent turn.
 */
export async function consumeAgentStream<T extends AgentStreamPart>(
  stream: AsyncIterable<T>,
  options: ConsumeAgentStreamOptions<T>,
): Promise<ConsumeAgentStreamResult> {
  const firstResponseTimeoutMs = options.firstResponseTimeoutMs ?? 45_000;
  const idleTimeoutMs = options.idleTimeoutMs ?? 135_000;
  const iterator = stream[Symbol.asyncIterator]();
  let receivedProviderResponse = false;

  while (true) {
    const timeoutMs = receivedProviderResponse ? idleTimeoutMs : firstResponseTimeoutMs;
    let outcome: NextResult<T>;
    try {
      outcome = await waitForNext(iterator, options.signal, timeoutMs);
    } catch (error) {
      safeReturn(iterator);
      throw error;
    }

    if (outcome.kind === 'aborted') {
      safeReturn(iterator);
      return { aborted: true, receivedProviderResponse };
    }
    if (outcome.kind === 'timeout') {
      options.abortProvider?.();
      safeReturn(iterator);
      throw new AgentStreamTimeoutError(
        receivedProviderResponse ? 'idle' : 'first_response',
        timeoutMs,
      );
    }
    if (outcome.value.done) {
      return { aborted: false, receivedProviderResponse };
    }

    const part = outcome.value.value;
    if (!receivedProviderResponse && isMeaningfulProviderPart(part)) {
      receivedProviderResponse = true;
      options.onFirstResponse?.(part);
    }
    await options.onPart(part);
  }
}
