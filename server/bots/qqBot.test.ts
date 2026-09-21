import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { QQBot, type QQBotDeps } from './qqBot';
import type { AgentCtx } from '../ai/agentRunner';

// QQBot 直接 import runAgent：mock 掉 agentRunner，捕获 ctx 验证 onJobsSubmitted 接线。
const mocks = vi.hoisted(() => ({ runAgent: vi.fn() }));
vi.mock('../ai/agentRunner', () => ({ runAgent: mocks.runAgent }));

function makeDeps(overrides: Partial<QQBotDeps> = {}): QQBotDeps & { trackJobs: ReturnType<typeof vi.fn> } {
  const trackJobs = vi.fn();
  return {
    getClusterSession: () => ({ sid: 'ssh-1', home: '/home/u', exec: vi.fn(async () => '') }),
    getAiProfile: () => ({ provider: 'deepseek', model: 'deepseek-chat', apiKey: 'sk-test' }),
    skillsDir: '/skills',
    lsfSkillDir: '/lsf',
    userSkillsDir: '/user-skills',
    trackJobs,
    ...overrides,
  } as QQBotDeps & { trackJobs: ReturnType<typeof vi.fn> };
}

beforeEach(() => {
  mocks.runAgent.mockReset();
  // token 接口与消息接口统一放行
  vi.stubGlobal('fetch', vi.fn(async () => ({
    ok: true,
    json: async () => ({ access_token: 'tok', expires_in: 7000 }),
    text: async () => '',
  })));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('QQBot 作业跟踪', () => {
  it('Agent 提交作业后交给 trackJobs（只监控不绑定）', async () => {
    const deps = makeDeps();
    const bot = new QQBot({ appId: 'app', appSecret: 'sec', allowlist: [] }, deps);

    let capturedCtx: AgentCtx | undefined;
    mocks.runAgent.mockImplementation(async (ctx: AgentCtx, cb: { onDone: (t: string) => void }) => {
      capturedCtx = ctx;
      ctx.onJobsSubmitted?.(['555']);
      cb.onDone('已提交作业 555');
    });

    await (bot as any).onUserMessage('C2C_MESSAGE_CREATE', {
      id: 'msg-1',
      author: { user_openid: 'user-1' },
      content: '帮我提交一个作业',
    });

    expect(mocks.runAgent).toHaveBeenCalledTimes(1);
    expect(capturedCtx?.sid).toBe('ssh-1');
    expect(deps.trackJobs).toHaveBeenCalledWith('ssh-1', ['555']);
  });

  it('未注入 trackJobs 时也不影响对话流程', async () => {
    const deps = makeDeps({ trackJobs: undefined });
    const bot = new QQBot({ appId: 'app', appSecret: 'sec', allowlist: [] }, deps);
    mocks.runAgent.mockImplementation(async (ctx: AgentCtx, cb: { onDone: (t: string) => void }) => {
      ctx.onJobsSubmitted?.(['556']);
      cb.onDone('完成');
    });

    await (bot as any).onUserMessage('C2C_MESSAGE_CREATE', {
      id: 'msg-2',
      author: { user_openid: 'user-1' },
      content: '再提交一个',
    });
    expect(mocks.runAgent).toHaveBeenCalledTimes(1);
  });
});
