import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

const harness = vi.hoisted(() => ({
  calls: [] as string[],
  hooks: undefined as any,
  replayQuestion: false,
  questionResponse: undefined as any,
  lastPromptText: undefined as string | undefined,
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

    async cancel() {}

    async respondApproval() {
      return true;
    }

    async respondQuestion(opts: any) {
      harness.calls.push('respond-question');
      harness.questionResponse = opts;
      harness.replayQuestion = false;
      return true;
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
  for (const dir of tempDirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

describe('runDshAgent mux ordering', () => {
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
