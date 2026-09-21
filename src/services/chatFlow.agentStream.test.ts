import { describe, expect, it } from 'vitest';
import {
  isAgentDoneCancelled,
  isCurrentAiRun,
  resolveAgentDoneText,
  shouldDisableChatInput,
  shouldRenderSystemMessage,
} from './chatFlow';

describe('agent stream chat flow', () => {
  it('uses done event content when no content deltas were streamed', () => {
    expect(resolveAgentDoneText('', 'Final answer from done event')).toBe('Final answer from done event');
  });

  it('prefers streamed content over duplicated done event content', () => {
    expect(resolveAgentDoneText('Streamed answer', 'Streamed answer')).toBe('Streamed answer');
  });

  it('does not turn agent sentinel values into visible assistant messages', () => {
    expect(resolveAgentDoneText('', '__ASK__')).toBe('');
    expect(resolveAgentDoneText('', '__CANCELLED__')).toBe('');
    expect(isAgentDoneCancelled('', '__CANCELLED__')).toBe(true);
  });

  it('renders useful system messages while hiding only noisy agent step markers', () => {
    expect(shouldRenderSystemMessage('[tool_call run_command] bjobs')).toBe(true);
    expect(shouldRenderSystemMessage('[Agent step 1]')).toBe(false);
    expect(shouldRenderSystemMessage('')).toBe(false);
  });

  it('keeps chat input usable while an AI request is running', () => {
    expect(shouldDisableChatInput(true, null)).toBe(false);
    expect(shouldDisableChatInput(false, 'loading-conversation-id')).toBe(true);
  });

  it('allows only the latest AI request to mutate streaming state', () => {
    expect(isCurrentAiRun(3, 3)).toBe(true);
    expect(isCurrentAiRun(4, 3)).toBe(false);
  });
});
