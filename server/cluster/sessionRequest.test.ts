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

  it('an explicit local-workbench sentinel forces local mode and is never hijacked by a live cluster cookie', () => {
    const hasSession = (id: string) => id === 'cluster-1';

    // 用户点了本地 AI 工作台：即使 cookie 里还有连着网的集群会话，也必须本地执行
    expect(resolveRequestSessionId({ cookie: 'cluster-1', header: 'local-workbench', auth: undefined }, hasSession)).toBeUndefined();
    expect(resolveRequestSessionId({ cookie: 'cluster-1', header: undefined, auth: 'local-workbench' }, hasSession)).toBeUndefined();
  });
});
