import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  maybeResumeAgent,
  type DshClientLike,
  type ResumeAgentDeps,
} from './dshJobResumer';
import type { JobAgentBinding } from './jobAgentBindings';
import type { EnsureSidecarResult } from './dshSidecar';

interface MockMux {
  hooks: { onOpened?: () => void; onFrame: (frame: any) => void; onClosed: () => void };
  close: ReturnType<typeof vi.fn>;
}

function makeBinding(overrides: Partial<JobAgentBinding> = {}): JobAgentBinding {
  return {
    jobId: '424242',
    sshSessionId: 'ssh-1',
    conversationKey: 'ssh-1',
    dshSessionId: 'dsh-sess-1',
    conversationId: 'conv-1',
    workspace: '/data/work',
    profile: { provider: 'deepseek', model: 'deepseek-chat', apiKey: 'sk-test' },
    locale: 'zh-CN',
    submittedAt: Date.now(),
    resumeCount: 0,
    ...overrides,
  };
}

function makeClient(muxes: MockMux[]): DshClientLike & {
  createSession: ReturnType<typeof vi.fn>;
  selectModel: ReturnType<typeof vi.fn>;
  prompt: ReturnType<typeof vi.fn>;
  connectMux: ReturnType<typeof vi.fn>;
} {
  return {
    createSession: vi.fn(async () => 'dsh-sess-1'),
    selectModel: vi.fn(async () => undefined),
    prompt: vi.fn(async () => ({ accepted: true })),
    connectMux: vi.fn((hooks: MockMux['hooks']) => {
      const mux: MockMux = { hooks, close: vi.fn() };
      muxes.push(mux);
      queueMicrotask(() => hooks.onOpened?.());
      return { close: mux.close };
    }),
  };
}

function makeDeps(overrides: Partial<ResumeAgentDeps> = {}): ResumeAgentDeps & { muxes: MockMux[] } {
  const muxes: MockMux[] = [];
  const deps: ResumeAgentDeps = {
    dataRoot: '/data/root',
    pluginSourceDir: '/plugin',
    skillDirs: ['/skills'],
    getBinding: vi.fn(() => makeBinding()),
    markResumed: vi.fn(),
    exec: vi.fn(async () => 'job output tail line'),
    appendConversation: vi.fn(async () => true),
    emitToUi: vi.fn(),
    notify: vi.fn(async () => undefined),
    ensureSidecar: vi.fn(async (): Promise<EnsureSidecarResult> => ({ ok: true, baseUrl: 'http://127.0.0.1:3999' })),
    createClient: vi.fn(() => makeClient(muxes)),
    ...overrides,
  };
  return Object.assign(deps, { muxes });
}

function sessionFrame(sessionId: string, event: unknown) {
  return { type: 'server-request', rpcId: 'r1', method: 'session/event', payload: { type: 'session/event', sessionId, event } };
}

afterEach(() => {
  delete process.env.HPCLAW_JOB_RESUME;
});

describe('maybeResumeAgent', () => {
  it('does nothing when HPCLAW_JOB_RESUME=off', async () => {
    const deps = makeDeps();
    process.env.HPCLAW_JOB_RESUME = 'off';
    await maybeResumeAgent({ sessionId: 'ssh-1', jobId: '424242', status: 'DONE' }, deps);
    expect(deps.getBinding).not.toHaveBeenCalled();
    expect(deps.ensureSidecar).not.toHaveBeenCalled();
  });

  it('does nothing when there is no binding for the job', async () => {
    const deps = makeDeps({ getBinding: vi.fn(() => undefined) });
    await maybeResumeAgent({ sessionId: 'ssh-1', jobId: '424242', status: 'DONE' }, deps);
    expect(deps.ensureSidecar).not.toHaveBeenCalled();
    expect(deps.markResumed).not.toHaveBeenCalled();
  });

  it('leaves legacy bindings to the legacy resumer', async () => {
    const deps = makeDeps({ getBinding: vi.fn(() => makeBinding({ engine: 'legacy', dshSessionId: '' })) });
    await maybeResumeAgent({ sessionId: 'ssh-1', jobId: '424242', status: 'DONE' }, deps);
    expect(deps.ensureSidecar).not.toHaveBeenCalled();
    expect(deps.createClient).not.toHaveBeenCalled();
    expect(deps.markResumed).not.toHaveBeenCalled();
  });

  it('stops at the per-job resume cap', async () => {
    const deps = makeDeps({ getBinding: vi.fn(() => makeBinding({ resumeCount: 3 })) });
    await maybeResumeAgent({ sessionId: 'ssh-1', jobId: '424242', status: 'DONE' }, deps);
    expect(deps.ensureSidecar).not.toHaveBeenCalled();
    expect(deps.markResumed).not.toHaveBeenCalled();
  });

  it('returns quietly when the sidecar is unavailable', async () => {
    const deps = makeDeps({
      ensureSidecar: vi.fn(async (): Promise<EnsureSidecarResult> => ({ ok: false, reason: 'no dsh' })),
    });
    await maybeResumeAgent({ sessionId: 'ssh-1', jobId: '424242', status: 'DONE' }, deps);
    expect(deps.createClient).not.toHaveBeenCalled();
    expect(deps.markResumed).not.toHaveBeenCalled();
  });

  it('runs the full wake-up flow and echoes results', async () => {
    const deps = makeDeps();
    const client = makeClient(deps.muxes);
    (deps.createClient as ReturnType<typeof vi.fn>).mockReturnValue(client);

    const running = maybeResumeAgent({ sessionId: 'ssh-1', jobId: '424242', status: 'DONE' }, deps);
    await vi.waitFor(() => expect(client.connectMux).toHaveBeenCalled());
    await vi.waitFor(() => expect(client.prompt).toHaveBeenCalled());

    expect(client.connectMux.mock.invocationCallOrder[0]).toBeLessThan(client.prompt.mock.invocationCallOrder[0]);

    expect(deps.exec).toHaveBeenCalledWith('ssh-1', 'bpeek 424242 | tail -60', 20_000);
    expect(deps.ensureSidecar).toHaveBeenCalledWith(expect.objectContaining({
      pluginSourceDir: '/plugin',
      skillDirs: ['/skills'],
      extraEnv: { DEEPSEEK_API_KEY: 'sk-test', DEEPSEEK_BASE_URL: 'https://api.deepseek.com' },
    }));
    expect(client.createSession).toHaveBeenCalledWith({ cwd: '/data/work', sessionId: 'dsh-sess-1' });
    expect(client.selectModel).toHaveBeenCalledWith({
      sessionId: 'dsh-sess-1',
      provider: 'deepseek-official',
      model: 'deepseek-chat',
    });
    const promptText = client.prompt.mock.calls[0][0].text as string;
    expect(promptText).toContain('424242');
    expect(promptText).toContain('DONE');
    expect(promptText).toContain('job output tail line');
    expect(promptText).toContain('请读取完整输出并继续之前的任务');

    // 其他会话的帧被忽略；本会话 text-delta 累积，turn/end 收尾
    deps.muxes[0].hooks.onFrame(sessionFrame('other-sess', { type: 'assistant/chunk', data: { chunk: { type: 'text-delta', text: 'noise' } } }));
    deps.muxes[0].hooks.onFrame(sessionFrame('dsh-sess-1', { type: 'assistant/chunk', data: { chunk: { type: 'text-delta', text: '任务完成，' } } }));
    deps.muxes[0].hooks.onFrame(sessionFrame('dsh-sess-1', { type: 'assistant/chunk', data: { chunk: { type: 'text-delta', text: '表达量正常。' } } }));
    deps.muxes[0].hooks.onFrame(sessionFrame('dsh-sess-1', { type: 'turn/end', data: { turn: 1, reason: { kind: 'completed' } } }));
    await running;

    expect(deps.appendConversation).toHaveBeenCalledWith('conv-1', [
      { role: 'user', content: '【系统】作业 424242 已结束（DONE），已自动继续处理。' },
      { role: 'assistant', content: '任务完成，表达量正常。' },
    ], 'ssh-1');
    expect(deps.emitToUi).toHaveBeenCalledWith('ssh-1', {
      type: 'ai:resumed',
      conversationId: 'conv-1',
      jobId: '424242',
      preview: '任务完成，表达量正常。',
    });
    expect(deps.notify).toHaveBeenCalledWith('作业完成，AI 已继续处理', '任务完成，表达量正常。');
    expect(deps.markResumed).toHaveBeenCalledWith('424242', 'ssh-1');
    expect(deps.muxes[0].close).toHaveBeenCalled();
  });

  it('uses the default model and skips conversation echo when profile/conversationId are absent', async () => {
    const deps = makeDeps({
      getBinding: vi.fn(() => makeBinding({ profile: undefined, conversationId: undefined })),
      exec: vi.fn(async () => { throw new Error('bpeek failed'); }),
    });
    const client = makeClient(deps.muxes);
    (deps.createClient as ReturnType<typeof vi.fn>).mockReturnValue(client);

    const running = maybeResumeAgent({ sessionId: 'ssh-1', jobId: '424242', status: 'EXIT' }, deps);
    await vi.waitFor(() => expect(client.connectMux).toHaveBeenCalled());
    deps.muxes[0].hooks.onFrame(sessionFrame('dsh-sess-1', { type: 'turn/end', data: {} }));
    await running;

    expect(client.selectModel).toHaveBeenCalledWith(expect.objectContaining({ model: 'deepseek-v4-pro' }));
    expect(deps.ensureSidecar).toHaveBeenCalledWith(expect.objectContaining({ extraEnv: {} }));
    const promptText = client.prompt.mock.calls[0][0].text as string;
    expect(promptText).not.toContain('输出摘要');
    expect(deps.appendConversation).not.toHaveBeenCalled();
    expect(deps.markResumed).toHaveBeenCalledWith('424242', 'ssh-1');
  });

  it('serializes concurrent resumes for the same dsh session', async () => {
    const deps = makeDeps();
    const client = makeClient(deps.muxes);
    (deps.createClient as ReturnType<typeof vi.fn>).mockReturnValue(client);

    const first = maybeResumeAgent({ sessionId: 'ssh-1', jobId: '424242', status: 'DONE' }, deps);
    await vi.waitFor(() => expect(client.connectMux).toHaveBeenCalledTimes(1));

    // 第二个唤醒撞上互斥锁：直接返回，不再触达 dsh
    await maybeResumeAgent({ sessionId: 'ssh-1', jobId: '424242', status: 'DONE' }, deps);
    expect(client.prompt).toHaveBeenCalledTimes(1);
    expect(deps.markResumed).not.toHaveBeenCalled();

    deps.muxes[0].hooks.onFrame(sessionFrame('dsh-sess-1', { type: 'turn/end', data: {} }));
    await first;
    expect(deps.markResumed).toHaveBeenCalledTimes(1);
  });

  it('never throws even when a step blows up', async () => {
    const deps = makeDeps({
      getBinding: vi.fn(() => { throw new Error('store corrupted'); }),
    });
    await expect(maybeResumeAgent({ sessionId: 'ssh-1', jobId: '424242', status: 'DONE' }, deps))
      .resolves.toBeUndefined();
  });
});
