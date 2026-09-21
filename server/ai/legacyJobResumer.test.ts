import { afterEach, describe, expect, it, vi } from 'vitest';
import { maybeResumeLegacyAgent, type LegacyResumeDeps } from './legacyJobResumer';
import type { AgentCtx, AgentCB } from './agentRunner';
import type { AIMessage, AIProfile } from './types';
import type { JobAgentBinding } from '../dsh/jobAgentBindings';

const profile: AIProfile = { provider: 'deepseek', model: 'deepseek-chat', apiKey: 'sk-test' };

function makeBinding(overrides: Partial<JobAgentBinding> = {}): JobAgentBinding {
  return {
    jobId: '424242',
    sshSessionId: 'ssh-1',
    conversationKey: 'ssh-1:saved-conv-1',
    dshSessionId: '',
    engine: 'legacy',
    conversationId: 'conv-1',
    locale: 'zh-CN',
    submittedAt: Date.now(),
    resumeCount: 0,
    ...overrides,
  };
}

type RunAgentMock = (ctx: AgentCtx, cb: AgentCB, messages: AIMessage[]) => Promise<void>;

function makeDeps(overrides: Partial<LegacyResumeDeps> = {}): LegacyResumeDeps & {
  runAgent: ReturnType<typeof vi.fn<RunAgentMock>>;
  exec: ReturnType<typeof vi.fn>;
} {
  const exec = vi.fn(async (cmd: string) => (cmd.startsWith('bpeek') ? 'job output tail line' : ''));
  const runAgent = vi.fn<RunAgentMock>(async (_ctx, cb) => cb.onDone('任务完成。'));
  const deps: LegacyResumeDeps = {
    getBinding: vi.fn(() => makeBinding()),
    markResumed: vi.fn(),
    getSession: vi.fn(() => ({ home: '/home/u', exec })),
    loadProfile: vi.fn(() => profile),
    appendConversation: vi.fn(async () => true),
    emitToUi: vi.fn(),
    notify: vi.fn(async () => undefined),
    onJobsSubmitted: vi.fn(),
    runAgent,
    ...overrides,
  };
  return Object.assign(deps, { exec, runAgent: deps.runAgent as ReturnType<typeof vi.fn<RunAgentMock>> });
}

afterEach(() => {
  delete process.env.HPCLAW_JOB_RESUME;
});

describe('maybeResumeLegacyAgent', () => {
  it('does nothing when HPCLAW_JOB_RESUME=off', async () => {
    const deps = makeDeps();
    process.env.HPCLAW_JOB_RESUME = 'off';
    await maybeResumeLegacyAgent({ sessionId: 'ssh-1', jobId: '424242', status: 'DONE' }, deps);
    expect(deps.getBinding).not.toHaveBeenCalled();
    expect(deps.runAgent).not.toHaveBeenCalled();
  });

  it('does nothing when there is no binding or the binding is not legacy', async () => {
    const noBinding = makeDeps({ getBinding: vi.fn(() => undefined) });
    await maybeResumeLegacyAgent({ sessionId: 'ssh-1', jobId: '424242', status: 'DONE' }, noBinding);
    expect(noBinding.runAgent).not.toHaveBeenCalled();

    const dshBinding = makeDeps({ getBinding: vi.fn(() => makeBinding({ engine: 'dsh', dshSessionId: 'dsh-1' })) });
    await maybeResumeLegacyAgent({ sessionId: 'ssh-1', jobId: '424242', status: 'DONE' }, dshBinding);
    expect(dshBinding.runAgent).not.toHaveBeenCalled();
    expect(dshBinding.markResumed).not.toHaveBeenCalled();
  });

  it('stops at the per-job resume cap', async () => {
    const deps = makeDeps({ getBinding: vi.fn(() => makeBinding({ resumeCount: 3 })) });
    await maybeResumeLegacyAgent({ sessionId: 'ssh-1', jobId: '424242', status: 'DONE' }, deps);
    expect(deps.runAgent).not.toHaveBeenCalled();
    expect(deps.markResumed).not.toHaveBeenCalled();
  });

  it('skips quietly when the cluster session is offline or no AI profile is available', async () => {
    const offline = makeDeps({ getSession: vi.fn(() => undefined) });
    await maybeResumeLegacyAgent({ sessionId: 'ssh-1', jobId: '424242', status: 'DONE' }, offline);
    expect(offline.runAgent).not.toHaveBeenCalled();
    expect(offline.markResumed).not.toHaveBeenCalled();

    const noProfile = makeDeps({ loadProfile: vi.fn(() => undefined) });
    await maybeResumeLegacyAgent({ sessionId: 'ssh-1', jobId: '424242', status: 'DONE' }, noProfile);
    expect(noProfile.runAgent).not.toHaveBeenCalled();
    expect(noProfile.markResumed).not.toHaveBeenCalled();
  });

  it('runs the full wake-up flow and echoes results into the conversation', async () => {
    const deps = makeDeps({
      getBinding: vi.fn(() => makeBinding({ confirmationPolicy: 'state_changes' })),
    });
    await maybeResumeLegacyAgent({ sessionId: 'ssh-1', jobId: '424242', status: 'DONE' }, deps);

    expect(deps.exec).toHaveBeenCalledWith('bpeek 424242 | tail -60', 20_000);
    expect(deps.runAgent).toHaveBeenCalledTimes(1);
    const [ctx, , messages] = deps.runAgent.mock.calls[0] as unknown as [AgentCtx, AgentCB, AIMessage[]];
    expect(ctx.sid).toBe('ssh-1');
    expect(ctx.conversationId).toBe('conv-1');
    expect(ctx.conversationKey).toBe('ssh-1:saved-conv-1');
    expect(ctx.locale).toBe('zh-CN');
    expect(ctx.runtimeConfig).toMatchObject({ confirmationPolicy: 'state_changes' });
    // 无人值守：危险命令确认一律拒绝
    await expect(ctx.confirmCommand?.('bkill 1', {})).resolves.toBe(false);
    const wake = messages[0].content;
    expect(wake).toContain('424242');
    expect(wake).toContain('DONE');
    expect(wake).toContain('输出摘要');
    expect(wake).toContain('job output tail line');

    expect(deps.appendConversation).toHaveBeenCalledWith('conv-1', [
      { role: 'user', content: '【系统】作业 424242 已结束（DONE），已自动继续处理。' },
      { role: 'assistant', content: '任务完成。' },
    ]);
    expect(deps.emitToUi).toHaveBeenCalledWith('ssh-1', {
      type: 'ai:resumed',
      conversationId: 'conv-1',
      jobId: '424242',
      preview: '任务完成。',
    });
    expect(deps.notify).toHaveBeenCalledWith('作业完成，AI 已继续处理', '任务完成。');
    expect(deps.markResumed).toHaveBeenCalledWith('424242', 'ssh-1');
  });

  it('forwards jobs submitted during the wake turn to onJobsSubmitted', async () => {
    const deps = makeDeps({
      runAgent: vi.fn<RunAgentMock>(async (ctx, cb) => {
        ctx.onJobsSubmitted?.(['777']);
        cb.onDone('已提交后续作业 777。');
      }),
    });
    await maybeResumeLegacyAgent({ sessionId: 'ssh-1', jobId: '424242', status: 'DONE' }, deps);
    expect(deps.onJobsSubmitted).toHaveBeenCalledWith(
      expect.objectContaining({ jobId: '424242', engine: 'legacy' }),
      ['777'],
    );
    expect(deps.markResumed).toHaveBeenCalledTimes(1);
  });

  it('surfaces the pending question when the agent stops to ask the user', async () => {
    const deps = makeDeps({
      runAgent: vi.fn<RunAgentMock>(async (_ctx, cb) => {
        cb.onAsk('输出目录选哪个？');
        cb.onDone('__ASK__');
      }),
    });
    await maybeResumeLegacyAgent({ sessionId: 'ssh-1', jobId: '424242', status: 'DONE' }, deps);
    expect(deps.appendConversation).toHaveBeenCalledWith('conv-1', [
      { role: 'user', content: '【系统】作业 424242 已结束（DONE），已自动继续处理。' },
      { role: 'assistant', content: '需要用户确认后继续：输出目录选哪个？' },
    ]);
    expect(deps.markResumed).toHaveBeenCalledTimes(1);
  });

  it('writes a failure note when the agent run errors, and still marks the attempt', async () => {
    const deps = makeDeps({
      runAgent: vi.fn<RunAgentMock>(async (_ctx, cb) => cb.onErr('provider timeout')),
    });
    await maybeResumeLegacyAgent({ sessionId: 'ssh-1', jobId: '424242', status: 'EXIT' }, deps);
    expect(deps.appendConversation).toHaveBeenCalledWith('conv-1', [
      { role: 'user', content: '【系统】作业 424242 已结束（EXIT），已自动继续处理。' },
      { role: 'assistant', content: '(自动续跑失败：provider timeout)' },
    ]);
    expect(deps.markResumed).toHaveBeenCalledWith('424242', 'ssh-1');
  });

  it('uses English prompts and messages when the binding locale is en-US', async () => {
    const deps = makeDeps({ getBinding: vi.fn(() => makeBinding({ locale: 'en-US' })) });
    await maybeResumeLegacyAgent({ sessionId: 'ssh-1', jobId: '424242', status: 'DONE' }, deps);
    const messages = deps.runAgent.mock.calls[0][2] as AIMessage[];
    expect(messages[0].content).toContain('has finished');
    expect(deps.appendConversation).toHaveBeenCalledWith('conv-1', [
      { role: 'user', content: '[System] Job 424242 finished (DONE); the conversation was resumed automatically.' },
      { role: 'assistant', content: '任务完成。' },
    ]);
    expect(deps.notify).toHaveBeenCalledWith('Job finished, AI resumed', '任务完成。');
  });

  it('serializes concurrent resumes for the same conversation', async () => {
    let release: () => void = () => {};
    const gate = new Promise<void>(resolve => { release = resolve; });
    const deps = makeDeps({
      runAgent: vi.fn<RunAgentMock>(async (_ctx, cb) => {
        await gate;
        cb.onDone('任务完成。');
      }),
    });

    const first = maybeResumeLegacyAgent({ sessionId: 'ssh-1', jobId: '424242', status: 'DONE' }, deps);
    await vi.waitFor(() => expect(deps.runAgent).toHaveBeenCalledTimes(1));

    // 同一 conversationKey 的第二个唤醒撞上互斥锁：直接返回
    await maybeResumeLegacyAgent({ sessionId: 'ssh-1', jobId: '424242', status: 'DONE' }, deps);
    expect(deps.runAgent).toHaveBeenCalledTimes(1);
    expect(deps.markResumed).not.toHaveBeenCalled();

    release();
    await first;
    expect(deps.markResumed).toHaveBeenCalledTimes(1);
  });

  it('never throws even when a step blows up', async () => {
    const deps = makeDeps({
      getBinding: vi.fn(() => { throw new Error('store corrupted'); }),
    });
    await expect(maybeResumeLegacyAgent({ sessionId: 'ssh-1', jobId: '424242', status: 'DONE' }, deps))
      .resolves.toBeUndefined();
  });
});
