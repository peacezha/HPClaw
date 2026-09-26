// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';
import { loadAgentWorkspaces, needsAgentWorkspaceHint, saveAgentWorkspaces } from './agentWorkspace';

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

  it('persists multiple unique workspace roots and keeps their order', () => {
    localStorage.clear();
    expect(saveAgentWorkspaces(['D:\\data-a', 'D:\\data-b', 'D:\\data-a']))
      .toEqual(['D:\\data-a', 'D:\\data-b']);
    expect(loadAgentWorkspaces()).toEqual(['D:\\data-a', 'D:\\data-b']);
  });
});
