// 流程运行专属对话：每次"启动运行"都开一个全新对话（独立上下文键 + 运行协议作为首条消息），
// 避免执行过程串进当前聊天。这里集中放可单测的纯逻辑：对话种子与存档标题派生。
import { parseWorkflowExecutionContext } from '@/shared/workflowExecution';

/** 新对话的 AI 上下文键；与 App 既有实现一致（crypto.randomUUID 优先）。 */
export function createConversationContextId(): string {
  return globalThis.crypto?.randomUUID?.() || `conversation-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** 专属对话种子：替换当前对话的完整补丁（全新上下文键 + 空存档引用 + 首条运行协议消息）。 */
export interface WorkflowRunConversationSeed {
  activeConversationId: null;
  conversationContextId: string;
  conversationSummary: string;
  messages: { role: 'user'; content: string }[];
}

/** 为一次流程运行生成专属对话种子；连续两次调用产生两个相互独立的上下文键。 */
export function seedWorkflowRunConversation(message: string): WorkflowRunConversationSeed {
  return {
    activeConversationId: null,
    conversationContextId: createConversationContextId(),
    conversationSummary: '',
    messages: [{ role: 'user', content: message }],
  };
}

/** 标题派生所需的最小消息形状（与 App/AIChat 的 Message 结构兼容）。 */
export interface ConversationTitleMessage {
  role: string;
  content: string;
}

/**
 * 运行协议消息 → 「流程：<名>」；非运行协议（或协议里取不到流程名）→ null。
 * 协议首行是 [HPCLAW_WORKFLOW_RUN] 标记，不能直接当标题；
 * 流程名出现在协议正文的「开始或继续/继续成品流程「<名>」」句中。
 */
export function workflowRunConversationTitle(firstUserContent: string): string | null {
  if (!parseWorkflowExecutionContext(firstUserContent)) return null;
  const name = /流程「([^」]+)」/.exec(firstUserContent)?.[1]?.trim();
  if (!name) return null;
  return `流程：${name}`.slice(0, 40);
}

/**
 * 自动保存的对话标题：首条用户消息是流程运行协议时派生「流程：<名>」，
 * 否则沿用既有规则（首条用户消息前 40 字，空则回退 fallback）。
 */
export function deriveConversationTitle(
  messages: readonly ConversationTitleMessage[],
  fallback: string,
): string {
  const firstUser = messages.find(m => m.role === 'user')?.content ?? '';
  return workflowRunConversationTitle(firstUser) ?? (firstUser.slice(0, 40) || fallback);
}
