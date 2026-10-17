import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

const harness = {
  calls: [] as string[],
  eventSubs: new Set<(n: { sessionId: string; event: any }) => void>(),
  resumeError: undefined as Error | undefined,
  probe: 'idle' as 'idle' | 'running' | 'unknown',
  promptError: undefined as Error | undefined,
  lastPromptText: undefined as string | undefined,
};

function emit(sessionId: string, event: any) {
  for (const cb of [...harness.eventSubs]) cb({ sessionId, event });
}

vi.mock('./dshSidecar', () => ({
  ensureSidecar: vi.fn(async () => ({ ok: true, baseUrl: 'sdk+stdio://local' })),
  getSidecarClient: vi.fn(() => fakeClient),
}));

const fakeClient = {
  isAlive: true,
  resume: vi.fn(async (_sessionId: string) => {
    harness.calls.push('resume');
    if (harness.resumeError) throw harness.resumeError;
  }),
  setWorkingDirectory: vi.fn(async (sessionId: string, dir: string) => {
    harness.calls.push('set-cwd');
    return dir;
  }),
  prompt: vi.fn(async (opts: { sessionId: string; text: string }) => {
    harness.calls.push('prompt');
    harness.lastPromptText = opts.text;
    if (harness.promptError) throw harness.promptError;
    return { messageId: 'msg-1' };
  }),
  probeSession: vi.fn(async (_sessionId: string, _timeoutMs?: number) => harness.probe),
  sessionStatusOf: vi.fn((_sessionId: string) => undefined as 'idle' | 'running' | undefined),
  onSessionEvent: vi.fn((cb: (n: { sessionId: string; event: any }) => void) => {
    harness.eventSubs.add(cb);
    return () => { harness.eventSubs.delete(cb); };
  }),
};

import { runDshAgent } from './dshAgentRunner';
import { getDshSessionBinding, getDshInteractionHandler } from './bridgeState';

const tempDirs: string[] = [];

afterEach(() => {
  harness.calls.length = 0;
  harness.eventSubs.clear();
  harness.resumeError = undefined;
  harness.promptError = undefined;
  harness.probe = 'idle';
  harness.lastPromptText = undefined;
  vi.clearAllMocks();
  vi.useRealTimers();
  for (const dir of tempDirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

function pendingRun(overrides: Record<string, any> = {}) {
  const dataRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'trace-dsh-sdk-'));
  tempDirs.push(dataRoot);
  const sent: any[] = [];
  const abort = new AbortController();
  const promise = runDshAgent({
    send: event => sent.push(event), requestAbort: abort.signal, requestId: 'sdk-test',
    profile: { provider: 'deepseek', model: 'test', apiKey: 'sk-test-only' },
    userText: '继续', locale: 'zh-CN', sshSessionId: 'ssh-test', conversationKey: 'test-sdk',
    dataRoot, pluginSourceDir: '/plugin', skillDirs: [],
    onConfirm: async () => false, onQuestion: async () => null, ...overrides,
  });
  return { promise, sent, abort, dataRoot };
}

/** 等 prompt 真正发出（start() 是异步的）。 */
async function waitForPrompt() {
  await vi.waitFor(() => expect(harness.calls).toContain('prompt'));
}

/** 取 runner 为会话注册的交互处理器（bridgeState 是真实实现）。 */
function interaction(sessionId: string) {
  const handler = getDshInteractionHandler(sessionId);
  if (!handler) throw new Error('no interaction handler registered for ' + sessionId);
  return handler;
}

describe('runDshAgent (sdk channel)', () => {
  it('falls back to legacy without an active SSH session instead of throwing', async () => {
    const dataRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'trace-dsh-nosession-'));
    tempDirs.push(dataRoot);
    const { ensureSidecar } = await import('./dshSidecar');
    (ensureSidecar as ReturnType<typeof vi.fn>).mockClear();
    const sent: any[] = [];
    const outcome = await runDshAgent({
      send: event => sent.push(event),
      requestAbort: new AbortController().signal,
      requestId: 'request-no-ssh',
      profile: { provider: 'deepseek', model: 'deepseek-flash', apiKey: 'sk-test-only' },
      userText: '测试',
      locale: 'zh-CN',
      conversationKey: 'conversation-no-ssh',
      dataRoot,
      pluginSourceDir: '/plugin',
      skillDirs: ['/skills'],
      onConfirm: async () => false,
      onQuestion: async () => null,
    });

    expect(outcome).toBe('fallback');
    expect(sent.some(e => e?.type === 'error')).toBe(false);
    expect(ensureSidecar).not.toHaveBeenCalled();
  });

  it('subscribes before prompting and streams assistant message + done', async () => {
    const run = pendingRun();
    await vi.waitFor(() => expect(fakeClient.onSessionEvent).toHaveBeenCalled());
    await waitForPrompt();
    // 全新会话不经过 resume；resume 的复用路径由 mapping 测试覆盖。
    expect(fakeClient.resume).not.toHaveBeenCalled();
    expect(fakeClient.setWorkingDirectory).toHaveBeenCalled();
    emit('dsh-sess-unknown', { type: 'assistant/message', data: { message: { content: [{ type: 'text', text: 'noise' }] } } });
    const sessionId = fakeClient.prompt.mock.calls[0][0].sessionId;
    emit(sessionId, { type: 'assistant/message', data: { message: { content: [{ type: 'text', text: '已收到' }] } } });
    emit(sessionId, { type: 'turn/end', data: { reason: { kind: 'completed' } } });
    await run.promise;
    expect(run.sent).toContainEqual({ type: 'content', content: '已收到' });
    expect(run.sent).toContainEqual({ type: 'done', content: '已收到', requestId: 'sdk-test' });
    expect(harness.lastPromptText).toContain('![描述](路径)');
    expect(harness.lastPromptText).toContain('临时 HTTP 服务');
    expect(harness.lastPromptText).not.toContain('智能体质量契约');
  });

  it('persists the conversation→session mapping and reuses it on the next run', async () => {
    const first = pendingRun({ conversationKey: 'map-test' });
    const dataRoot = first.dataRoot;
    await vi.waitFor(() => expect(fakeClient.onSessionEvent).toHaveBeenCalled());
    await waitForPrompt();
    const sessionId = fakeClient.prompt.mock.calls[0][0].sessionId;
    emit(sessionId, { type: 'assistant/message', data: { message: { content: [{ type: 'text', text: 'ok' }] } } });
    emit(sessionId, { type: 'turn/end', data: { reason: { kind: 'completed' } } });
    await first.promise;
    const map = JSON.parse(fs.readFileSync(path.join(dataRoot, 'dsh-sessions.json'), 'utf8'));
    expect(map['map-test']).toBe(sessionId);

    const second = pendingRun({ conversationKey: 'map-test', dataRoot });
    await vi.waitFor(() => expect(fakeClient.prompt).toHaveBeenCalledTimes(2));
    expect(fakeClient.prompt.mock.calls[1][0].sessionId).toBe(sessionId);
    emit(sessionId, { type: 'turn/end', data: { reason: { kind: 'aborted' } } });
    await second.promise;
  });

  it('creates a fresh session when the mapped one cannot be resumed', async () => {
    const run = pendingRun({ conversationKey: 'resume-fail' });
    harness.resumeError = new Error('session not found');
    await vi.waitFor(() => expect(fakeClient.onSessionEvent).toHaveBeenCalled());
    await waitForPrompt();
    const sessionId = fakeClient.prompt.mock.calls[0][0].sessionId;
    expect(sessionId).toMatch(/^trace-/);
    emit(sessionId, { type: 'turn/end', data: { reason: { kind: 'aborted' } } });
    await run.promise;
  });

  it('never enqueues a duplicate prompt behind a running worker', async () => {
    harness.probe = 'running';
    const run = pendingRun();
    await run.promise;
    expect(harness.calls).not.toContain('prompt');
    expect(run.sent).toContainEqual(expect.objectContaining({ type: 'error', outcome: 'unverified', error: expect.stringContaining('未重复提交') }));
  });

  it('answers a user question through the interaction handler and never resubmits', async () => {
    const onQuestion = vi.fn(async ({ questions }: any) => ({
      answers: [{ id: questions[0].id, selected: ['A', 'B'], custom: 'Keep control' }],
    }));
    const run = pendingRun({ onQuestion });
    await vi.waitFor(() => expect(fakeClient.onSessionEvent).toHaveBeenCalled());
    await waitForPrompt();
    const sessionId = fakeClient.prompt.mock.calls[0][0].sessionId;
    const answer = await interaction(sessionId).onQuestions({
      requestId: 'q-1', sessionId,
      questions: [{ id: 'samples', question: 'Which samples?', multiSelect: true, options: [{ label: 'A' }, { label: 'B' }] }],
    });
    expect(answer).toEqual({ answers: [{ id: 'samples', selected: ['A', 'B'], custom: 'Keep control' }] });
    expect(onQuestion).toHaveBeenCalledTimes(1);
    expect(harness.calls.filter(c => c === 'prompt')).toHaveLength(1);
    emit(sessionId, { type: 'assistant/message', data: { message: { content: [{ type: 'text', text: '按 A+B 处理完成。' }] } } });
    emit(sessionId, { type: 'turn/end', data: { reason: { kind: 'completed' } } });
    await run.promise;
    expect(run.sent).toContainEqual(expect.objectContaining({ type: 'done', content: '按 A+B 处理完成。' }));
  });

  it('corrects a vague empty-option repair question without showing a fake choice dialog', async () => {
    const onQuestion = vi.fn();
    const run = pendingRun({ onQuestion });
    await vi.waitFor(() => expect(fakeClient.onSessionEvent).toHaveBeenCalled());
    await waitForPrompt();
    const sessionId = fakeClient.prompt.mock.calls[0][0].sessionId;
    const answer = await interaction(sessionId).onQuestions({
      requestId: 'q-vague', sessionId,
      questions: [{ id: 'fix', question: 'step-03 因 BAI 失败，如何修复并继续？', options: [] }],
    });
    expect(onQuestion).not.toHaveBeenCalled();
    expect(answer?.answers[0]).toMatchObject({ selected: [], custom: expect.stringContaining('TRACE_VAGUE_CHOICE_BLOCKED') });
    run.abort.abort();
    await run.promise;
  });

  it('marks clarification answers read-only and instructs explain-before-decide', async () => {
    const onQuestion = vi.fn(async () => ({ answers: [{ id: 'repair', selected: ['CSI'], custom: '有哪些修复方案？' }] }));
    const run = pendingRun({ onQuestion });
    await vi.waitFor(() => expect(fakeClient.onSessionEvent).toHaveBeenCalled());
    await waitForPrompt();
    const sessionId = fakeClient.prompt.mock.calls[0][0].sessionId;
    const answer = await interaction(sessionId).onQuestions({
      requestId: 'q-explain', sessionId,
      questions: [{ id: 'repair', question: 'Which repair method?', options: [{ label: 'CSI' }, { label: 'Realign' }] }],
    });
    expect(answer?.answers[0]).toMatchObject({ selected: [], custom: expect.stringContaining('TRACE_CLARIFICATION_ONLY') });
    expect(getDshSessionBinding(sessionId)?.readOnly).toBe(true);
    run.abort.abort();
    await run.promise;
  });

  it('returns null and finishes cancelled when the user dismisses the question', async () => {
    const run = pendingRun({ onQuestion: async () => null });
    await vi.waitFor(() => expect(fakeClient.onSessionEvent).toHaveBeenCalled());
    await waitForPrompt();
    const sessionId = fakeClient.prompt.mock.calls[0][0].sessionId;
    const answer = await interaction(sessionId).onQuestions({
      requestId: 'q-dismiss', sessionId,
      questions: [{ id: 'sequence', question: '请提供最后一条序列', options: [] }],
    });
    expect(answer).toBeNull();
    await run.promise;
    expect(run.sent).toContainEqual(expect.objectContaining({ type: 'done', content: '__CANCELLED__' }));
  });

  it('stops a stubborn repeated-question loop without inventing consent', async () => {
    const onQuestion = vi.fn();
    const run = pendingRun({ onQuestion });
    await vi.waitFor(() => expect(fakeClient.onSessionEvent).toHaveBeenCalled());
    await waitForPrompt();
    const sessionId = fakeClient.prompt.mock.calls[0][0].sessionId;
    let last: any;
    for (let n = 0; n < 3; n++) {
      last = await interaction(sessionId).onQuestions({
        requestId: 'vague-' + n, sessionId,
        questions: [{ id: 'repair', question: '如何修复并继续？', options: [] }],
      });
    }
    await run.promise;
    expect(onQuestion).not.toHaveBeenCalled();
    expect(last?.answers[0].selected).toEqual([]);
    expect(run.sent).toContainEqual(expect.objectContaining({ type: 'error', outcome: 'unverified', error: expect.stringContaining('没有代你选择') }));
  });

  it('routes approvals through onConfirm and maps the decision to the wire outcome', async () => {
    const onConfirm = vi.fn(async () => true);
    const run = pendingRun({ onConfirm });
    await vi.waitFor(() => expect(fakeClient.onSessionEvent).toHaveBeenCalled());
    await waitForPrompt();
    const sessionId = fakeClient.prompt.mock.calls[0][0].sessionId;
    const outcome = await interaction(sessionId).onApproval({
      requestId: 'ap-1', sessionId, toolName: 'run_command', callId: 'c1',
      reason: 'HPClaw 命令确认\n风险级: destructive\n命令: bkill 123',
    });
    expect(outcome).toBe('allowed-once');
    expect(onConfirm).toHaveBeenCalledWith(expect.objectContaining({ command: 'bkill 123', risk: 'destructive' }));
    run.abort.abort();
    await run.promise;
  });

  it('rejects only on explicit rejection; expiry reports an unverified error and finishes', async () => {
    const onConfirm = vi.fn(async () => ({ approved: false, reason: 'expired' as const }));
    const run = pendingRun({ onConfirm });
    await vi.waitFor(() => expect(fakeClient.onSessionEvent).toHaveBeenCalled());
    await waitForPrompt();
    const sessionId = fakeClient.prompt.mock.calls[0][0].sessionId;
    const outcome = await interaction(sessionId).onApproval({
      requestId: 'ap-expired', sessionId, toolName: 'run_command',
      reason: 'HPClaw 命令确认\n风险级: destructive\n命令: bkill 123',
    });
    expect(outcome).toBe('unavailable');
    await run.promise;
    expect(run.sent).toContainEqual(expect.objectContaining({ type: 'error', error: expect.stringContaining('不是用户拒绝') }));
  });

  it('keeps waiting past a 90s idle window while the engine confirms it is still running', async () => {
    vi.useFakeTimers();
    try {
      const run = pendingRun();
      await vi.advanceTimersByTimeAsync(0);
      await waitForPrompt();
      harness.probe = 'running';
      await vi.advanceTimersByTimeAsync(95_000);
      expect(run.sent.filter(e => e.type === 'error')).toEqual([]);
      expect(run.sent.some(e => String(e.message).includes('已确认仍在执行'))).toBe(true);
      run.abort.abort();
      await run.promise;
    } finally {
      vi.useRealTimers();
    }
  });

  it('reports idle-without-end-record as unverified instead of success', async () => {
    vi.useFakeTimers();
    try {
      const run = pendingRun();
      await vi.advanceTimersByTimeAsync(0);
      await waitForPrompt();
      harness.probe = 'idle';
      await vi.advanceTimersByTimeAsync(95_000);
      await run.promise;
      expect(run.sent.filter(e => e.type === 'done')).toHaveLength(0);
      expect(run.sent).toContainEqual(expect.objectContaining({ type: 'error', outcome: 'unverified', error: expect.stringContaining('尚未核验') }));
    } finally {
      vi.useRealTimers();
    }
  });

  it('reports a prompt submission failure as unverified and never retries automatically', async () => {
    harness.promptError = new Error('socket hang up');
    const run = pendingRun();
    await run.promise;
    expect(run.sent).toContainEqual(expect.objectContaining({ type: 'error', outcome: 'unverified', error: expect.stringContaining('未自动重投') }));
  });

  it('registers submitted job bindings from run_command tool results', async () => {
    const onJobsSubmitted = vi.fn();
    const run = pendingRun({ onJobsSubmitted, conversationKey: 'job-bind-test' });
    await vi.waitFor(() => expect(fakeClient.onSessionEvent).toHaveBeenCalled());
    await waitForPrompt();
    const sessionId = fakeClient.prompt.mock.calls[0][0].sessionId;
    emit(sessionId, { type: 'tool/call', data: { callId: 'submit', name: 'run_command', arguments: '{"command":"bsub < job.lsf"}' } });
    emit(sessionId, { type: 'tool/result', data: { message: { role: 'tool', toolCallId: 'submit', content: [{ type: 'text', text: 'Job <424242> is submitted to queue <normal>.' }] } } });
    expect(onJobsSubmitted).toHaveBeenCalledWith(['424242']);
    emit(sessionId, { type: 'assistant/message', data: { message: { content: [{ type: 'text', text: '作业已提交并监控。' }] } } });
    emit(sessionId, { type: 'turn/end', data: { reason: { kind: 'completed' } } });
    await run.promise;
    expect(run.sent).toContainEqual(expect.objectContaining({ type: 'done', content: '作业已提交并监控。' }));
  });
});
