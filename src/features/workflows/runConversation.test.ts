import { describe, expect, it } from 'vitest';
import {
  deriveConversationTitle,
  seedWorkflowRunConversation,
  workflowRunConversationTitle,
} from './runConversation';
import { composeResumeRunMessage, composeRunMessage } from './compose';
import type { Workflow } from '@/shared/workflow';

function makeWorkflow(overrides: Partial<Workflow> = {}): Workflow {
  return {
    id: 'wf-x',
    name: 'RNA-seq 差异分析',
    description: 'desc',
    keywords: [],
    params: [],
    steps: [{ title: 's1', command: 'echo hi' }],
    source: 'user',
    createdAt: 0,
    updatedAt: 0,
    ...overrides,
  };
}

const runMessage = composeRunMessage(makeWorkflow(), {
  inputs: ['/data/fastq'],
  paramValues: {},
  run: { runId: 'run-001', runDir: '/home/u/hpclaw_flows/x/03_workspace/runs/run-001' },
});

const resumeMessage = composeResumeRunMessage(makeWorkflow(), {
  runId: 'run-001',
  runDir: '/home/u/hpclaw_flows/x/03_workspace/runs/run-001',
  status: 'failed',
  currentStep: 1,
  totalSteps: 2,
});

describe('seedWorkflowRunConversation 专属对话种子', () => {
  it('连续两次启动运行产生两个相互独立的对话上下文键', () => {
    const first = seedWorkflowRunConversation(runMessage);
    const second = seedWorkflowRunConversation(runMessage);
    expect(first.conversationContextId).toBeTruthy();
    expect(second.conversationContextId).toBeTruthy();
    expect(first.conversationContextId).not.toBe(second.conversationContextId);
  });

  it('种子是全新对话：无存档引用、无摘要，运行协议是唯一的首条用户消息', () => {
    const seed = seedWorkflowRunConversation(runMessage);
    expect(seed.activeConversationId).toBeNull();
    expect(seed.conversationSummary).toBe('');
    expect(seed.messages).toEqual([{ role: 'user', content: runMessage }]);
  });
});

describe('workflowRunConversationTitle 运行协议标题', () => {
  it('从启动运行协议提取「流程：<名>」', () => {
    expect(workflowRunConversationTitle(runMessage)).toBe('流程：RNA-seq 差异分析');
  });

  it('从恢复运行协议提取「流程：<名>」', () => {
    expect(workflowRunConversationTitle(resumeMessage)).toBe('流程：RNA-seq 差异分析');
  });

  it('非运行协议消息返回 null', () => {
    expect(workflowRunConversationTitle('帮我看看这个报错')).toBeNull();
    expect(workflowRunConversationTitle('流程「x」未就绪，请帮我补齐')).toBeNull(); // 无运行标记
  });

  it('协议里取不到流程名时返回 null（调用方回退常规派生）', () => {
    const markerOnly = runMessage.split('\n')[0]; // 只有 [HPCLAW_WORKFLOW_RUN] 首行
    expect(workflowRunConversationTitle(markerOnly)).toBeNull();
  });
});

describe('deriveConversationTitle 自动保存标题', () => {
  it('首条用户消息是运行协议 → 标题为「流程：<名>」，而不是协议文本', () => {
    const title = deriveConversationTitle([{ role: 'user', content: runMessage }], '新对话');
    expect(title).toBe('流程：RNA-seq 差异分析');
    expect(title).not.toContain('[HPCLAW_WORKFLOW_RUN]');
  });

  it('普通对话沿用首条用户消息前 40 字', () => {
    const long = 'a'.repeat(50);
    expect(deriveConversationTitle([{ role: 'user', content: long }], '新对话')).toBe('a'.repeat(40));
    expect(deriveConversationTitle([
      { role: 'system', content: 'sys' },
      { role: 'user', content: '第一条' },
      { role: 'user', content: '第二条' },
    ], '新对话')).toBe('第一条');
  });

  it('没有用户消息时回退 fallback', () => {
    expect(deriveConversationTitle([], '新对话')).toBe('新对话');
    expect(deriveConversationTitle([{ role: 'assistant', content: 'hi' }], '对话')).toBe('对话');
  });
});
