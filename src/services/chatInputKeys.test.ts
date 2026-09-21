import { describe, it, expect } from 'vitest';
import { shouldSubmitOnKey } from './chatInputKeys';

describe('shouldSubmitOnKey', () => {
  it('submits on plain Enter', () => {
    expect(shouldSubmitOnKey({ key: 'Enter', shiftKey: false })).toBe(true);
  });

  it('does not submit on Shift+Enter (newline)', () => {
    expect(shouldSubmitOnKey({ key: 'Enter', shiftKey: true })).toBe(false);
  });

  it('does not submit while IME composition is active', () => {
    expect(shouldSubmitOnKey({ key: 'Enter', shiftKey: false, isComposing: true })).toBe(false);
  });

  it('does not submit on other keys', () => {
    expect(shouldSubmitOnKey({ key: 'a', shiftKey: false })).toBe(false);
  });
});
