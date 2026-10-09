import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

const harness = vi.hoisted(() => ({
  calls: [] as string[],
  hooks: undefined as any,
  replayQuestion: false,
  questionResponse: undefined as any,
  answerAccepted: true,
  lastPromptText: undefined as string | undefined,
  promptCompletes: true,
  running: false,
  probeError: false,
  historyEvents: [] as any[],
}));

vi.mock('./dshSidecar', () => ({
  ensureSidecar: vi.fn(async () => ({ ok: true, baseUrl: 'http://127.0.0.1:3999' })),
}));

vi.mock('./dshClient', () => ({
  DshClient: class MockDshClient {
    async createSession() {
      return 'dsh-session-test';
    }

    async selectModel() {}
    async sessionStatus() {
      if (harness.probeError) throw new Error('connection refused');
      return { running: harness.running };
    }
    async history() { return { events: harness.historyEvents.map(event => ({ event })), hasMore: false }; }

    connectMux(hooks: any) {
      harness.calls.push('connect');
      harness.hooks = hooks;
      queueMicrotask(() => {
        hooks.onOpened?.();
        if (harness.replayQuestion) {
          harness.calls.push('question');
          hooks.onFrame({
            type: 'server-request',
            rpcId: 'question-rpc-1',
            method: 'question/requested',
            payload: {
              type: 'question/requested',
              sessionId: 'dsh-session-test',
              questions: [{ id: 'sequence', header: '补全序列', question: '请提供最后一条序列', options: [] }],
            },
          });
        }
      });
      return { close: vi.fn() };
    }

    async prompt(opts: any) {
      harness.calls.push('prompt');
      harness.lastPromptText = opts?.text;
      if (!harness.promptCompletes) { harness.running = true; return { accepted: true }; }
      queueMicrotask(() => harness.hooks.onFrame({
        type: 'server-request',
        method: 'session/event',
        payload: {
          sessionId: 'dsh-session-test',
          event: { type: 'assistant/chunk', data: { chunk: { type: 'text-delta', text: '已收到' } } },
        },
      }));
      queueMicrotask(() => harness.hooks.onFrame({
        type: 'server-request',
        method: 'session/event',
        payload: {
          sessionId: 'dsh-session-test',
          event: { type: 'turn/end', data: { reason: { kind: 'completed' } } },
        },
      }));
      return { accepted: true };
    }

    async cancel() { harness.calls.push('cancel'); }

    async respondApproval() {
      harness.calls.push('respond-approval');
      return true;
    }

    async respondQuestion(opts: any) {
      harness.calls.push('respond-question');
      harness.questionResponse = opts;
      harness.replayQuestion = false;
      return harness.answerAccepted;
    }
  },
}));

import { runDshAgent } from './dshAgentRunner';

const tempDirs: string[] = [];

afterEach(() => {
  harness.calls.length = 0;
  harness.hooks = undefined;
  harness.replayQuestion = false;
  harness.questionResponse = undefined;
  harness.answerAccepted = true;
  harness.promptCompletes = true;
  harness.running = false;
  harness.probeError = false;
  harness.historyEvents = [];
  vi.useRealTimers();
  for (const dir of tempDirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

function pendingRun(overrides: Record<string, any> = {}) {
  const dataRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'hpclaw-dsh-recovery-'));
  tempDirs.push(dataRoot);
  const sent: any[] = [];
  const abort = new AbortController();
  const promise = runDshAgent({
    send: event => sent.push(event), requestAbort: abort.signal, requestId: 'recovery-test',
    profile: { provider: 'deepseek', model: 'test', apiKey: 'sk-test-only' },
    userText: '继续', locale: 'zh-CN', sshSessionId: 'ssh-test', conversationKey: 'test-recovery',
    dataRoot, pluginSourceDir: '/plugin', skillDirs: [],
    onConfirm: async () => false, onQuestion: async () => null, ...overrides,
  });
  return { promise, sent, abort };
}

describe('DSH recovery without duplicate execution', () => {
  it('reports an unacknowledged answer without encouraging duplicate execution', async () => {
    vi.useFakeTimers();
    harness.replayQuestion = true;
    harness.answerAccepted = false;
    const run = pendingRun({ locale: 'en-US', onQuestion: async () => ({ answers: [{ id: 'sequence', selected: [], custom: 'fixture' }] }) });
    await vi.advanceTimersByTimeAsync(80);
    await run.promise;
    expect(harness.calls).not.toContain('prompt');
    expect(run.sent).toContainEqual(expect.objectContaining({ type: 'error', outcome: 'unverified', error: expect.stringContaining('This turn was not resubmitted') }));
  });
  it('deduplicates replayed frames and replaces partial text with the recovered authoritative answer', async () => {
    vi.useFakeTimers();
    harness.promptCompletes = false;
    const run = pendingRun();
    await vi.advanceTimersByTimeAsync(80);
    const delta = { seq: 11, type: 'assistant/chunk', data: { chunk: { type: 'text-delta', text: 'partial ' } } };
    harness.hooks.onFrame({ method: 'session/event', payload: { sessionId: 'dsh-session-test', event: delta } });
    harness.hooks.onFrame({ method: 'session/event', payload: { sessionId: 'dsh-session-test', event: delta } });
    harness.running = false;
    harness.historyEvents = [delta,
      { seq: 12, type: 'assistant/message', data: { message: { content: [{ type: 'text', text: 'complete answer with verified evidence' }] } } },
      { seq: 13, type: 'turn/end', data: { reason: { kind: 'completed' } } },
    ];
    harness.hooks.onClosed();
    await vi.advanceTimersByTimeAsync(0);
    await run.promise;
    expect(run.sent.filter(e => e.type === 'content')).toEqual([{ type: 'content', content: 'partial ' }]);
    expect(run.sent).toContainEqual(expect.objectContaining({ type: 'done', authoritative: true, content: 'complete answer with verified evidence' }));
    expect(harness.calls.filter(call => call === 'prompt')).toHaveLength(1);
  });
  it('keeps a confirmed-running worker alive beyond two old 90-second idle windows', async () => {
    vi.useFakeTimers();
    harness.promptCompletes = false;
    const run = pendingRun();
    await vi.advanceTimersByTimeAsync(80);
    await vi.advanceTimersByTimeAsync(185_000);
    expect(run.sent.filter(e => e.type === 'error')).toEqual([]);
    expect(run.sent.some(e => String(e.message).includes('已确认仍在执行'))).toBe(true);
    expect(harness.calls.filter(call => call === 'prompt')).toHaveLength(1);
    run.abort.abort();
    await run.promise;
  });

  it('recovers a missing end record and full answer from durable history', async () => {
    vi.useFakeTimers();
    harness.promptCompletes = false;
    harness.historyEvents = [{ seq: 20, type: 'turn/end', data: { reason: { kind: 'completed' } } }];
    const run = pendingRun();
    await vi.advanceTimersByTimeAsync(80);
    harness.running = false;
    harness.historyEvents.push(
      { seq: 21, type: 'assistant/message', data: { message: { content: [{ type: 'text', text: '已核验：5 个产物，来源 results/qc.tsv。' }] } } },
      { seq: 22, type: 'turn/end', data: { reason: { kind: 'completed' } } },
    );
    await vi.advanceTimersByTimeAsync(90_000);
    await run.promise;
    expect(run.sent.filter(e => e.type === 'done')).toEqual([expect.objectContaining({ content: '已核验：5 个产物，来源 results/qc.tsv。' })]);
    expect(harness.calls.filter(call => call === 'prompt')).toHaveLength(1);
  });

  it('does not enqueue a retry behind a surviving worker', async () => {
    vi.useFakeTimers();
    harness.running = true;
    const run = pendingRun();
    await vi.advanceTimersByTimeAsync(80);
    await run.promise;
    expect(harness.calls).not.toContain('prompt');
    expect(run.sent).toContainEqual(expect.objectContaining({ type: 'error', outcome: 'unverified', error: expect.stringContaining('未重复提交') }));
  });

  it('reports two failed probes as unverified, not success or a cluster job failure', async () => {
    vi.useFakeTimers();
    harness.promptCompletes = false;
    const run = pendingRun({ locale: 'en-US' });
    await vi.advanceTimersByTimeAsync(80);
    harness.probeError = true;
    await vi.advanceTimersByTimeAsync(185_000);
    await run.promise;
    expect(run.sent.filter(e => e.type === 'done')).toHaveLength(0);
    expect(run.sent).toContainEqual(expect.objectContaining({ type: 'error', outcome: 'unverified', error: expect.stringContaining('may still be running') }));
    expect(harness.calls.filter(call => call === 'prompt')).toHaveLength(1);
  });

  it('registers approvals before callbacks and pauses the idle timer while awaiting a decision', async () => {
    vi.useFakeTimers();
    harness.promptCompletes = false;
    let decide!: (approved: boolean) => void;
    const run = pendingRun({ onConfirm: () => new Promise<boolean>(resolve => { decide = resolve; }) });
    await vi.advanceTimersByTimeAsync(80);
    harness.hooks.onFrame({ method: 'approval/requested', rpcId: 'approval-test', payload: {
      sessionId: 'dsh-session-test', approvalId: 'a1', reason: 'HPClaw 命令确认\n风险级: write\n命令: echo test',
    } });
    await vi.advanceTimersByTimeAsync(185_000);
    expect(run.sent.filter(e => e.type === 'error')).toHaveLength(0);
    expect(harness.calls.filter(call => call === 'connect')).toHaveLength(1);
    decide(true);
    await vi.advanceTimersByTimeAsync(0);
    expect(harness.calls).toContain('respond-approval');
    run.abort.abort();
    await run.promise;
  });
});

describe('runDshAgent mux ordering', () => {
  it('expiry cancels only the Agent turn, never fabricates rejection or sends an allow response', async () => {
    vi.useFakeTimers(); harness.promptCompletes = false;
    const run = pendingRun({ onConfirm: async () => ({ approved: false, reason: 'expired' }) });
    await vi.advanceTimersByTimeAsync(80);
    harness.hooks.onFrame({ method: 'approval/requested', rpcId: 'expired-rpc', payload: {
      sessionId: 'dsh-session-test', approvalId: 'expired-id', reason: 'HPClaw 命令确认\n风险级: destructive\n命令: bkill 123',
    } });
    await vi.advanceTimersByTimeAsync(0); await run.promise;
    expect(harness.calls).toContain('cancel');
    expect(harness.calls).not.toContain('respond-approval');
    expect(run.sent).toContainEqual(expect.objectContaining({ type: 'error', error: expect.stringContaining('不是用户拒绝') }));
  });
  it('falls back to legacy without an active SSH session instead of throwing', async () => {
    const dataRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'hpclaw-dsh-nosession-'));
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

    // 无集群会话：静默回退 legacy,不抛错、不发 error 事件、不启动 sidecar
    expect(outcome).toBe('fallback');
    expect(sent.some(e => e?.type === 'error')).toBe(false);
    expect(ensureSidecar).not.toHaveBeenCalled();
  });

  it('opens the mux before submitting the prompt and preserves a very fast answer', async () => {
    const dataRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'hpclaw-dsh-runner-'));
    tempDirs.push(dataRoot);
    const sent: any[] = [];
    const outcome = await runDshAgent({
      send: event => sent.push(event),
      requestAbort: new AbortController().signal,
      requestId: 'request-test',
      profile: { provider: 'deepseek', model: 'deepseek-v4-pro', apiKey: 'sk-test-only' },
      userText: '测试',
      summary: '当前目标: 分析 /data/project-a；已提交 Job <81234>',
      locale: 'zh-CN',
      sshSessionId: 'ssh-test',
      conversationKey: 'conversation-test',
      dataRoot,
      pluginSourceDir: '/plugin',
      skillDirs: ['/skills'],
      onConfirm: async () => false,
      onQuestion: async () => null,
    });

    expect(outcome).toBe('completed');
    expect(harness.calls).toEqual(['connect', 'prompt']);
    expect(sent).toContainEqual({ type: 'content', content: '已收到' });
    expect(sent).toContainEqual({ type: 'done', content: '已收到', requestId: 'request-test' });
    // 文件展示矫正指令随每轮 prompt 注入：Markdown 图片语法直写路径，禁止临时 HTTP 服务
    expect(harness.lastPromptText).toContain('![描述](路径)');
    expect(harness.lastPromptText).toContain('临时 HTTP 服务');
    expect(harness.lastPromptText).not.toContain('智能体质量契约');
    expect(harness.lastPromptText).toContain('对话摘要：');
    expect(harness.lastPromptText).toContain('81234');
  });

  it('answers a replayed dsh question before submitting the next prompt', async () => {
    const dataRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'hpclaw-dsh-question-'));
    tempDirs.push(dataRoot);
    harness.replayQuestion = true;
    const outcome = await runDshAgent({
      send: () => {},
      requestAbort: new AbortController().signal,
      requestId: 'request-question',
      profile: { provider: 'deepseek', model: 'deepseek-v4-pro', apiKey: 'sk-test-only' },
      userText: '继续',
      locale: 'zh-CN',
      sshSessionId: 'ssh-test',
      conversationKey: 'conversation-question',
      dataRoot,
      pluginSourceDir: '/plugin',
      skillDirs: ['/skills'],
      onConfirm: async () => false,
      onQuestion: async ({ questions }) => ({
        answers: [{ id: questions[0].id, selected: [], custom: 'ATGC' }],
      }),
    });

    expect(outcome).toBe('completed');
    expect(harness.calls).toEqual(['connect', 'question', 'respond-question', 'prompt']);
    expect(harness.questionResponse).toMatchObject({
      rpcId: 'question-rpc-1',
      sessionId: 'dsh-session-test',
      answer: { answers: [{ id: 'sequence', custom: 'ATGC' }] },
    });
  });
});
