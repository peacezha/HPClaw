const STORAGE_KEY = 'hpclaw_agent_workspace';

export function normalizeAgentWorkspace(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

export function normalizeAgentWorkspaces(value: unknown): string[] {
  const source = Array.isArray(value) ? value : typeof value === 'string' ? [value] : [];
  return [...new Set(source.map(item => normalizeAgentWorkspace(item).trim()).filter(Boolean))].slice(0, 20);
}

export function loadAgentWorkspaces(): string[] {
  try {
    return normalizeAgentWorkspaces(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
  } catch {
    return [];
  }
}

export function saveAgentWorkspaces(paths: string[]): string[] {
  const normalized = normalizeAgentWorkspaces(paths);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

export function loadAgentWorkspace(): string {
  return loadAgentWorkspaces()[0] || '';
}

export function saveAgentWorkspace(path: string): string {
  const normalized = normalizeAgentWorkspace(path);
  saveAgentWorkspaces(normalized ? [normalized] : []);
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
