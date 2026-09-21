// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

type JobNotificationsModule = typeof import('./jobNotifications');

class MockNotification {
  static permission: 'default' | 'granted' | 'denied' = 'granted';
  static requestPermission = vi.fn(async () => 'granted' as const);
  static instances: MockNotification[] = [];
  onclick: (() => void) | null = null;
  constructor(public title: string, public options?: { body?: string }) {
    MockNotification.instances.push(this);
  }
}

let mod: JobNotificationsModule;

beforeEach(async () => {
  vi.resetModules();
  MockNotification.instances = [];
  MockNotification.permission = 'granted';
  MockNotification.requestPermission = vi.fn(async () => 'granted');
  vi.stubGlobal('Notification', MockNotification);
  mod = await import('./jobNotifications');
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('firstExcerptLine', () => {
  it('取第一个非空行并去除首尾空白', () => {
    expect(mod.firstExcerptLine('\n  \n  Done. Output written to out.txt  \nsecond line')).toBe('Done. Output written to out.txt');
  });

  it('空摘要返回空串', () => {
    expect(mod.firstExcerptLine()).toBe('');
    expect(mod.firstExcerptLine('')).toBe('');
    expect(mod.firstExcerptLine('\n \n')).toBe('');
  });

  it('超长行截断到 120 字符并加省略号', () => {
    const line = 'x'.repeat(200);
    const result = mod.firstExcerptLine(line);
    expect(result).toHaveLength(121);
    expect(result.endsWith('…')).toBe(true);
  });
});

describe('createEventDeduper', () => {
  it('窗口期内同 key 判重，不同 key 放行', () => {
    const dedup = mod.createEventDeduper(1000);
    expect(dedup('job:1:DONE')).toBe(false);
    expect(dedup('job:1:DONE')).toBe(true);
    expect(dedup('job:2:DONE')).toBe(false);
  });

  it('超过窗口期后同 key 重新放行', () => {
    vi.useFakeTimers();
    try {
      const dedup = mod.createEventDeduper(1000);
      expect(dedup('job:1:DONE')).toBe(false);
      vi.advanceTimersByTime(1500);
      expect(dedup('job:1:DONE')).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('showDesktopNotification', () => {
  it('权限已授予时构造 Notification 并接线 onclick', () => {
    const onClick = vi.fn();
    const notification = mod.showDesktopNotification('作业完成 · DONE · blastx', '#101 · all done', onClick);
    expect(notification).not.toBeNull();
    expect(MockNotification.instances).toHaveLength(1);
    expect(MockNotification.instances[0].title).toBe('作业完成 · DONE · blastx');
    expect(MockNotification.instances[0].options?.body).toBe('#101 · all done');
    MockNotification.instances[0].onclick?.();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('权限被拒绝或未决定时不构造，静默降级', () => {
    MockNotification.permission = 'denied';
    expect(mod.showDesktopNotification('t', 'b')).toBeNull();
    MockNotification.permission = 'default';
    expect(mod.showDesktopNotification('t', 'b')).toBeNull();
    expect(MockNotification.instances).toHaveLength(0);
  });

  it('环境不支持 Notification 时返回 null', () => {
    vi.unstubAllGlobals();
    expect(mod.notificationsSupported()).toBe(false);
    expect(mod.showDesktopNotification('t', 'b')).toBeNull();
  });
});

describe('ensureNotificationPermission', () => {
  it('default 状态请求一次，重复调用不再请求', () => {
    MockNotification.permission = 'default';
    mod.ensureNotificationPermission();
    mod.ensureNotificationPermission();
    expect(MockNotification.requestPermission).toHaveBeenCalledTimes(1);
  });

  it('已授予或已拒绝时不发起请求', () => {
    MockNotification.permission = 'granted';
    mod.ensureNotificationPermission();
    MockNotification.permission = 'denied';
    mod.ensureNotificationPermission();
    expect(MockNotification.requestPermission).not.toHaveBeenCalled();
  });
});
