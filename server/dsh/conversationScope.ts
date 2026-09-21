export function normalizeConversationContextKey(value: unknown, fallback = ''): string {
  if (typeof value !== 'string') return fallback;
  const normalized = value.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 160);
  return normalized || fallback;
}

export function buildDshConversationKey(input: {
  sshSessionId?: string;
  conversationContextId?: unknown;
  conversationId?: unknown;
  requestId: string;
}): string {
  const fallback = typeof input.conversationId === 'string' && input.conversationId
    ? `saved-${input.conversationId}`
    : `request-${input.requestId}`;
  const context = normalizeConversationContextKey(input.conversationContextId, fallback);
  return `${input.sshSessionId || 'local'}:${context}`;
}
