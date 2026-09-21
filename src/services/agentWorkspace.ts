const STORAGE_KEY = 'hpclaw_agent_workspace';

export function normalizeAgentWorkspace(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

export function loadAgentWorkspace(): string {
  try {
    return normalizeAgentWorkspace(JSON.parse(localStorage.getItem(STORAGE_KEY) || '""'));
  } catch {
    return '';
  }
}

export function saveAgentWorkspace(path: string): string {
  const normalized = normalizeAgentWorkspace(path);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

export function clearAgentWorkspace(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * 本地文件分析的工作区提示条件：无集群会话（sessionId 为空或本地工作台）
 * 且未设置工作区。工作区是本地模式的必填项（AI 只能在工作区内读/新建），
 * 缺失时界面给出琥珀色提示。
 */
export function needsAgentWorkspaceHint(sessionId: string | null | undefined, workspace: string): boolean {
  const hasCluster = !!sessionId && sessionId !== 'local-workbench';
  return !hasCluster && !workspace.trim();
}
