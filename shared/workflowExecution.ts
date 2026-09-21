export const WORKFLOW_RUN_MARKER = '[HPCLAW_WORKFLOW_RUN]';

export interface WorkflowExecutionContext {
  workflowId: string;
  runId: string;
  runDir: string;
  policy: 'isolated-run-v1';
}

export function normalizeWorkflowExecutionContext(value: unknown): WorkflowExecutionContext | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const parsed = value as Partial<WorkflowExecutionContext>;
  if (!parsed.workflowId || !parsed.runId || !parsed.runDir || parsed.policy !== 'isolated-run-v1') return null;
  const runDir = String(parsed.runDir).trim().replace(/\/+$/, '');
  if (!runDir || runDir.includes('..') || /[\r\n\0]/.test(runDir)) return null;
  return {
    workflowId: String(parsed.workflowId).slice(0, 200),
    runId: String(parsed.runId).slice(0, 300),
    runDir,
    policy: 'isolated-run-v1',
  };
}

export function formatWorkflowExecutionContext(context: Omit<WorkflowExecutionContext, 'policy'>): string {
  return `${WORKFLOW_RUN_MARKER} ${JSON.stringify({ ...context, policy: 'isolated-run-v1' })}`;
}

export function parseWorkflowExecutionContext(text: string): WorkflowExecutionContext | null {
  const line = String(text || '').split(/\r?\n/).find(item => item.startsWith(`${WORKFLOW_RUN_MARKER} `));
  if (!line) return null;
  try {
    return normalizeWorkflowExecutionContext(JSON.parse(line.slice(WORKFLOW_RUN_MARKER.length).trim()));
  } catch {
    return null;
  }
}

/**
 * 从完整对话中恢复最近一次正式流程。调用方应在裁剪聊天窗口之前使用，
 * 避免长流程跑过多轮后最初的运行标记被传输预算丢弃。
 */
export function findLatestWorkflowExecutionContext(
  messages: Array<{ content?: unknown }> = [],
): WorkflowExecutionContext | null {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const parsed = parseWorkflowExecutionContext(String(messages[index]?.content || ''));
    if (parsed) return parsed;
  }
  return null;
}

// ─── 对话内流程配置卡标记 ─────────────────────────────────────────────
// AI（或前端流程匹配 chips）在消息中输出该标记时，前端不显示原始标记文本，
// 改渲染 WorkflowConfigCard 表单卡片，让用户点点点配置参数/输入后直接运行。
export const WORKFLOW_CONFIGURE_MARKER = '[HPCLAW_WORKFLOW_CONFIGURE]';

export interface WorkflowConfigureDirective {
  workflowId: string;
}

export function normalizeWorkflowConfigureDirective(value: unknown): WorkflowConfigureDirective | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const workflowId = String((value as Partial<WorkflowConfigureDirective>).workflowId || '').trim();
  if (!workflowId || workflowId.length > 200 || /[\r\n\0]/.test(workflowId)) return null;
  return { workflowId };
}

export function formatWorkflowConfigureDirective(directive: WorkflowConfigureDirective): string {
  return `${WORKFLOW_CONFIGURE_MARKER} ${JSON.stringify({ workflowId: directive.workflowId })}`;
}

/** 解析消息里的流程配置标记（单行独立标记；只取第一条）。 */
export function parseWorkflowConfigureDirective(text: string): WorkflowConfigureDirective | null {
  const line = String(text || '').split(/\r?\n/).find(item => item.trim().startsWith(WORKFLOW_CONFIGURE_MARKER));
  if (!line) return null;
  try {
    return normalizeWorkflowConfigureDirective(JSON.parse(line.trim().slice(WORKFLOW_CONFIGURE_MARKER.length).trim()));
  } catch {
    return null;
  }
}

/** 去掉消息中的所有配置标记行，返回剩余可读文本（渲染卡片时用）。 */
export function stripWorkflowConfigureDirectives(text: string): string {
  return String(text || '')
    .split(/\r?\n/)
    .filter(line => !line.trim().startsWith(WORKFLOW_CONFIGURE_MARKER))
    .join('\n')
    .trim();
}
