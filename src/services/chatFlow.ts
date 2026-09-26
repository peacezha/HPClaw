export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export const AGENT_PLAN_CHECKPOINT = '[HPCLAW_AGENT_PLAN]';

export function serializeAgentPlanCheckpoint(plan: unknown): string {
  return `${AGENT_PLAN_CHECKPOINT} ${JSON.stringify(plan)}`;
}

export function findLatestAgentPlanCheckpoint(messages: ChatMessage[]): unknown | null {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const content = messages[index]?.content?.trim() || '';
    if (!content.startsWith(`${AGENT_PLAN_CHECKPOINT} `)) continue;
    const raw = content.slice(AGENT_PLAN_CHECKPOINT.length).trim();
    if (!raw || raw.length > 50_000) return null;
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || !String(parsed.goal || '').trim() || !Array.isArray(parsed.steps)) return null;
      return parsed;
    } catch {
      return null;
    }
  }
  return null;
}

/** 在对话中只保留一份隐藏计划检查点，供切换对话或重开软件后恢复。 */
export function upsertAgentPlanCheckpoint(messages: ChatMessage[], plan: unknown | null): ChatMessage[] {
  const withoutOld = messages.filter(message => !message.content.trim().startsWith(`${AGENT_PLAN_CHECKPOINT} `));
  if (!plan) return withoutOld;
  return [...withoutOld, { role: 'system', content: serializeAgentPlanCheckpoint(plan) }];
}

export function buildOutgoingMessages(
  currentMessages: ChatMessage[],
  userText: string,
  appendUserMessage: boolean,
): ChatMessage[] {
  if (!appendUserMessage) return currentMessages;
  return [...currentMessages, { role: 'user', content: userText }];
}

// 0.2.9 与此前版本都只传 18 条 / 2 万字符。隔离 dsh 会话后，这个窗口
// 容易让原生引擎在长对话中丢掉刚刚确认的参数。服务端仍会按模型 token
// 预算二次裁剪，因此这里扩大到一个保守的连续窗口，不会无限增长请求体。
const MAX_TRANSPORT_MESSAGES = 32;
const MAX_TRANSPORT_TOTAL_CHARS = 48_000;
const MAX_TRANSPORT_USER_CHARS = 8_000;
const MAX_TRANSPORT_ASSISTANT_CHARS = 8_000;
const MAX_TRANSPORT_SYSTEM_CHARS = 2_000;

function truncateForTransport(content: string, maxChars: number): string {
  if (content.length <= maxChars) return content;
  const omitted = content.length - maxChars;
  return `${content.slice(0, maxChars)}\n[... ${omitted} chars truncated for transport ...]`;
}

function isNoisySystemMessage(content: string): boolean {
  const text = content.trim();
  if (!text) return true;
  // 计划通过请求体的 resumePlan 独立传输，隐藏检查点只用于持久化恢复。
  if (text.startsWith(`${AGENT_PLAN_CHECKPOINT} `)) return true;
  // 只过滤纯噪音的步数提示；工具调用/结果历史保留（截断后）供模型跨轮参考
  return /^\[Agent step \d+\]/.test(text);
}

function maxCharsForRole(role: ChatMessage['role']): number {
  if (role === 'user') return MAX_TRANSPORT_USER_CHARS;
  if (role === 'assistant') return MAX_TRANSPORT_ASSISTANT_CHARS;
  return MAX_TRANSPORT_SYSTEM_CHARS;
}

function fitMessagesToTransportBudget(messages: ChatMessage[]): ChatMessage[] {
  const kept: ChatMessage[] = [];
  let totalChars = 0;

  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    const nextTotal = totalChars + message.content.length;
    // 超预算即停止，保留最新的连续窗口，避免历史出现"空洞"
    if (nextTotal > MAX_TRANSPORT_TOTAL_CHARS && kept.length > 0) break;
    kept.push(message);
    totalChars = nextTotal;
  }

  return kept.reverse();
}

export function prepareMessagesForAiTransport(messages: ChatMessage[]): ChatMessage[] {
  const compacted = messages
    .slice(-MAX_TRANSPORT_MESSAGES)
    .filter(message => message.role !== 'system' || !isNoisySystemMessage(message.content))
    .map(message => ({
      ...message,
      content: truncateForTransport(message.content, maxCharsForRole(message.role)),
    }));

  return fitMessagesToTransportBudget(compacted);
}

export function latestUserMessage(messages: ChatMessage[]): ChatMessage | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'user' && messages[i].content.trim()) {
      return messages[i];
    }
  }
  return null;
}

const AGENT_ASK_SENTINEL = '__ASK__';
const AGENT_CANCELLED_SENTINEL = '__CANCELLED__';

function resolveAgentDonePayload(streamedText: string, doneContent?: string): string {
  return (streamedText.trim() || (doneContent || '').trim());
}

export function resolveAgentDoneText(streamedText: string, doneContent?: string): string {
  const text = resolveAgentDonePayload(streamedText, doneContent);
  if (text === AGENT_ASK_SENTINEL || text === AGENT_CANCELLED_SENTINEL) return '';
  return text;
}

export function isAgentDoneCancelled(streamedText: string, doneContent?: string): boolean {
  return resolveAgentDonePayload(streamedText, doneContent) === AGENT_CANCELLED_SENTINEL;
}

export function shouldRenderSystemMessage(content: string): boolean {
  const text = content.trim();
  if (!text) return false;
  if (text.startsWith(`${AGENT_PLAN_CHECKPOINT} `)) return false;
  // 不渲染 Agent 步骤提示和命令类工具的原始输出
  if (/^\[Agent step \d+\]/.test(text)) return false;
  if (/^\[命令输出已隐藏\]/.test(text)) return false;
  // ask_user 已有正式问题卡片；隐藏旧会话中遗留的原始工具 JSON，避免重复提问。
  if (/^\[(?:🔧|📋)\s+ask_user\]/.test(text)) return false;
  return true;
}

export function shouldDisableChatInput(_isAiLoading: boolean, loadingConversationId?: string | null): boolean {
  return !!loadingConversationId;
}

export function isCurrentAiRun(currentRunId: number, runId: number): boolean {
  return currentRunId === runId;
}
