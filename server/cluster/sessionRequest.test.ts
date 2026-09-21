import { describe, expect, it } from 'vitest';
import { resolveRequestSessionId } from './sessionRequest';

describe('request session resolution', () => {
  it('accepts an active explicit session header and rejects an unknown value', () => {
    const hasSession = (id: string) => id === 'active';

    expect(resolveRequestSessionId({ cookie: undefined, header: 'active', auth: undefined }, hasSession)).toBe('active');
    expect(resolveRequestSessionId({ cookie: undefined, header: 'stale', auth: undefined }, hasSession)).toBeUndefined();
  });

  it('explicit header wins over a stale cookie (multi-cluster tabs)', () => {
    const hasSession = (id: string) => id === 'header' || id === 'auth' || id === 'cookie';

    // 多标签页下 cookie 是上一次登录的会话，显式 header 必须优先
    expect(resolveRequestSessionId({ cookie: 'cookie', header: 'header', auth: 'auth' }, hasSession)).toBe('header');
    expect(resolveRequestSessionId({ cookie: 'cookie', header: 'stale', auth: 'auth' }, hasSession)).toBe('auth');
    expect(resolveRequestSessionId({ cookie: 'cookie', header: undefined, auth: undefined }, hasSession)).toBe('cookie');
  });
});
