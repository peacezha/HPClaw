import { describe, expect, it } from 'vitest';
import { needsAgentWorkspaceHint } from './agentWorkspace';

describe('needsAgentWorkspaceHint（本地工作区提示显示条件）', () => {
  it('shows the hint only when there is no cluster session and the workspace is empty', () => {
    // 无集群 + 未设工作区 → 提示
    expect(needsAgentWorkspaceHint(null, '')).toBe(true);
    expect(needsAgentWorkspaceHint(undefined, '')).toBe(true);
    expect(needsAgentWorkspaceHint(null, '   ')).toBe(true);
    // 本地工作台占位 sessionId 也算无集群
    expect(needsAgentWorkspaceHint('local-workbench', '')).toBe(true);

    // 已设工作区 → 不提示
    expect(needsAgentWorkspaceHint(null, 'D:\\data')).toBe(false);
    // 已连接集群 → 不提示（本地工作区是集群场景的可选项）
    expect(needsAgentWorkspaceHint('session-1', '')).toBe(false);
    expect(needsAgentWorkspaceHint('session-1', 'D:\\data')).toBe(false);
  });
});
