import { describe, expect, it } from 'vitest';
import { formatLoginFailure } from './loginDiagnostics';

describe('login diagnostics', () => {
  it('includes the final SSH output when login closes before success', () => {
    const message = formatLoginFailure({
      code: 255,
      signal: null,
      output: 'Connection reset by peer',
    });

    expect(message).toContain('SSH 连接已断开');
    expect(message).toContain('code 255');
    expect(message).toContain('Connection reset by peer');
  });

  it('explains OTP reuse for authentication failures', () => {
    const message = formatLoginFailure({
      code: 255,
      signal: null,
      output: 'All configured authentication methods failed',
    });

    expect(message).toContain('认证失败');
    expect(message).toContain('30 秒内不可重复使用');
  });
});
