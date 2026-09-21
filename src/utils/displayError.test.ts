import { describe, expect, it } from 'vitest';
import { isPermissionDeniedError, toDisplayError } from './displayError';

describe('toDisplayError', () => {
  it('unwraps API error objects', () => {
    expect(toDisplayError({
      error: { code: 'SSH_SESSION_REQUIRED', message: '会话已失效' },
    })).toBe('会话已失效');
  });

  it('unwraps direct code/message objects', () => {
    expect(toDisplayError({ code: 'EACCES', message: 'Permission denied' }))
      .toBe('Permission denied');
  });

  it('uses Error messages and a stable fallback', () => {
    expect(toDisplayError(new Error('network lost'))).toBe('network lost');
    expect(toDisplayError({ unexpected: true }, '加载失败')).toBe('加载失败');
  });

  it('recognizes permission errors from codes and messages', () => {
    expect(isPermissionDeniedError({ error: { code: 'EACCES', message: 'denied' } })).toBe(true);
    expect(isPermissionDeniedError(new Error('Permission denied'))).toBe(true);
    expect(isPermissionDeniedError(new Error('network lost'))).toBe(false);
  });
});
