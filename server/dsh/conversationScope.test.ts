import { describe, expect, it } from 'vitest';
import { buildDshConversationKey, normalizeConversationContextKey } from './conversationScope';

describe('dsh conversation scope', () => {
  it('keeps two conversations on the same cluster in different dsh sessions', () => {
    const first = buildDshConversationKey({
      sshSessionId: 'ssh-one', conversationContextId: 'chat-a', requestId: 'request-a',
    });
    const second = buildDshConversationKey({
      sshSessionId: 'ssh-one', conversationContextId: 'chat-b', requestId: 'request-b',
    });
    expect(first).toBe('ssh-one:chat-a');
    expect(second).toBe('ssh-one:chat-b');
    expect(first).not.toBe(second);
  });

  it('uses a stable saved-conversation fallback for older clients', () => {
    expect(buildDshConversationKey({
      sshSessionId: 'ssh-one', conversationId: 'archive-7', requestId: 'request-a',
    })).toBe('ssh-one:saved-archive-7');
  });

  it('removes control characters from a client context key', () => {
    expect(normalizeConversationContextKey(' chat\u0000-key\n')).toBe('chat-key');
  });
});
