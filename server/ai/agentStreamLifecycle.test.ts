import { describe, expect, it, vi } from 'vitest';
import { AgentStreamTimeoutError, consumeAgentStream } from './agentStreamLifecycle';

async function* neverSettlingAfterStart(): AsyncGenerator<{ type: string }> {
  yield { type: 'start' };
  await new Promise<void>(() => {});
}

describe('consumeAgentStream', () => {
  it('hard-stops a provider iterator that never returns its first response', async () => {
    const abortProvider = vi.fn();
    const started = Date.now();

    await expect(consumeAgentStream(neverSettlingAfterStart(), {
      signal: new AbortController().signal,
      firstResponseTimeoutMs: 20,
      idleTimeoutMs: 100,
      abortProvider,
      onPart: vi.fn(),
    })).rejects.toMatchObject<Partial<AgentStreamTimeoutError>>({
      code: 'AGENT_STREAM_TIMEOUT',
      phase: 'first_response',
    });

    expect(Date.now() - started).toBeLessThan(250);
    expect(abortProvider).toHaveBeenCalledTimes(1);
  });

  it('returns immediately on external cancellation even when iterator.next ignores AbortSignal', async () => {
    const controller = new AbortController();
    const promise = consumeAgentStream(neverSettlingAfterStart(), {
      signal: controller.signal,
      firstResponseTimeoutMs: 10_000,
      onPart: vi.fn(),
    });

    await new Promise(resolve => setTimeout(resolve, 5));
    controller.abort();

    await expect(promise).resolves.toEqual({
      aborted: true,
      receivedProviderResponse: false,
    });
  });

  it('uses the idle deadline after a real reasoning/content event', async () => {
    async function* stream(): AsyncGenerator<{ type: string; text?: string }> {
      yield { type: 'start' };
      yield { type: 'reasoning-delta', text: '正在规划' };
      await new Promise<void>(() => {});
    }

    await expect(consumeAgentStream(stream(), {
      signal: new AbortController().signal,
      firstResponseTimeoutMs: 100,
      idleTimeoutMs: 20,
      onPart: vi.fn(),
    })).rejects.toMatchObject({ phase: 'idle' });
  });

  it('suspends the idle deadline while a human wait (confirm/plan review) is pending', async () => {
    let humanWait = true;
    const parts: string[] = [];
    async function* stream(): AsyncGenerator<{ type: string; text?: string }> {
      yield { type: 'tool-call', toolName: 'set_plan' };
      // 模拟审批挂起：60ms 后解除（远超 20ms 空闲上限），随后正常出文本。
      await new Promise(resolve => setTimeout(resolve, 60));
      humanWait = false;
      yield { type: 'text-delta', text: '审批后继续' };
    }

    const result = await consumeAgentStream(stream(), {
      signal: new AbortController().signal,
      firstResponseTimeoutMs: 100,
      idleTimeoutMs: 20,
      isHumanWait: () => humanWait,
      onPart: part => { if (part.text) parts.push(part.text); },
    });
    expect(result).toEqual({ aborted: false, receivedProviderResponse: true });
    expect(parts).toEqual(['审批后继续']);
  });
});
