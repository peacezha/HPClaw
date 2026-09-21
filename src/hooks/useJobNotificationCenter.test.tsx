// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, cleanup, renderHook } from '@testing-library/react';
import type { Socket } from 'socket.io-client';
import { useJobNotificationCenter, type UseJobNotificationCenterOptions } from './useJobNotificationCenter';

/** 最小 socket.io 客户端替身：本地触发已注册监听，统计解绑情况 */
function createFakeSocket() {
  const listeners = new Map<string, Set<(payload: unknown) => void>>();
  return {
    on: vi.fn((event: string, cb: (payload: unknown) => void) => {
      const set = listeners.get(event) ?? new Set();
      set.add(cb);
      listeners.set(event, set);
    }),
    off: vi.fn((event: string, cb: (payload: unknown) => void) => {
      listeners.get(event)?.delete(cb);
    }),
    emitLocal(event: string, payload: unknown) {
      for (const cb of [...(listeners.get(event) ?? [])]) cb(payload);
    },
    listenerCount(event: string) {
      return listeners.get(event)?.size ?? 0;
    },
  };
}
type FakeSocket = ReturnType<typeof createFakeSocket>;

class MockNotification {
  static permission: 'default' | 'granted' | 'denied' = 'granted';
  static requestPermission = vi.fn(async () => 'granted' as const);
  static instances: MockNotification[] = [];
  onclick: (() => void) | null = null;
  constructor(public title: string, public options?: { body?: string }) {
    MockNotification.instances.push(this);
  }
}

const t = (value: string) => value;

function makeOptions(socket: FakeSocket, overrides: Partial<UseJobNotificationCenterOptions> = {}): UseJobNotificationCenterOptions {
  return {
    sockets: { 'sess-1': socket as unknown as Socket },
    workbenchSidebarTab: 'conversations',
    activeConversationId: 'conv-current',
    onOpenJobsView: vi.fn(),
    onOpenConversation: vi.fn(),
    t,
    ...overrides,
  };
}

const JOB_DONE = { jobId: '101', name: 'blastx', status: 'DONE' as const, finishedAt: 1_700_000_000_000, excerpt: 'all done\nmore' };

beforeEach(() => {
  MockNotification.instances = [];
  MockNotification.permission = 'granted';
  vi.stubGlobal('Notification', MockNotification);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('useJobNotificationCenter job:finished', () => {
  it('收到事件：构造桌面通知、产生 toast、不在计算资源视图时角标 +1', () => {
    const socket = createFakeSocket();
    const options = makeOptions(socket);
    const { result } = renderHook(props => useJobNotificationCenter(props), { initialProps: options });

    act(() => socket.emitLocal('job:finished', JOB_DONE));

    expect(MockNotification.instances).toHaveLength(1);
    expect(MockNotification.instances[0].title).toBe('作业完成 · DONE · blastx');
    expect(MockNotification.instances[0].options?.body).toBe('#101 · all done');
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]).toMatchObject({ kind: 'job', status: 'DONE', title: '作业完成 · DONE · blastx' });
    expect(result.current.jobUnread).toBe(1);
    expect(result.current.conversationUnread).toBe(0);

    // 桌面通知点击 → 跳计算资源作业面板
    act(() => MockNotification.instances[0].onclick?.());
    expect(options.onOpenJobsView).toHaveBeenCalledTimes(1);
  });

  it('EXIT 状态使用“作业异常结束”标题', () => {
    const socket = createFakeSocket();
    renderHook(props => useJobNotificationCenter(props), { initialProps: makeOptions(socket) });
    act(() => socket.emitLocal('job:finished', { ...JOB_DONE, jobId: '102', status: 'EXIT' }));
    expect(MockNotification.instances[0].title).toBe('作业异常结束 · EXIT · blastx');
  });

  it('已在计算资源视图时不加角标，但仍弹 toast 与桌面通知', () => {
    const socket = createFakeSocket();
    const { result } = renderHook(props => useJobNotificationCenter(props), {
      initialProps: makeOptions(socket, { workbenchSidebarTab: 'compute' }),
    });
    act(() => socket.emitLocal('job:finished', JOB_DONE));
    expect(result.current.jobUnread).toBe(0);
    expect(result.current.toasts).toHaveLength(1);
    expect(MockNotification.instances).toHaveLength(1);
  });

  it('进入计算资源视图后角标清零', () => {
    const socket = createFakeSocket();
    const options = makeOptions(socket);
    const { result, rerender } = renderHook(props => useJobNotificationCenter(props), { initialProps: options });
    act(() => socket.emitLocal('job:finished', JOB_DONE));
    expect(result.current.jobUnread).toBe(1);
    rerender({ ...options, workbenchSidebarTab: 'compute' });
    expect(result.current.jobUnread).toBe(0);
  });

  it('同一作业事件去重：重复推送只提醒一次', () => {
    const socket = createFakeSocket();
    const { result } = renderHook(props => useJobNotificationCenter(props), { initialProps: makeOptions(socket) });
    act(() => {
      socket.emitLocal('job:finished', JOB_DONE);
      socket.emitLocal('job:finished', JOB_DONE);
    });
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.jobUnread).toBe(1);
    expect(MockNotification.instances).toHaveLength(1);
  });

  it('toast 最多叠 3 条，超出丢弃最旧', () => {
    const socket = createFakeSocket();
    const { result } = renderHook(props => useJobNotificationCenter(props), { initialProps: makeOptions(socket) });
    act(() => {
      for (const jobId of ['1', '2', '3', '4']) {
        socket.emitLocal('job:finished', { ...JOB_DONE, jobId, name: `job-${jobId}` });
      }
    });
    expect(result.current.toasts).toHaveLength(3);
    expect(result.current.toasts.map(toast => toast.title)).toEqual([
      '作业完成 · DONE · job-2',
      '作业完成 · DONE · job-3',
      '作业完成 · DONE · job-4',
    ]);
    expect(result.current.jobUnread).toBe(4);
  });

  it('toast 到时自动消失', () => {
    vi.useFakeTimers();
    try {
      const socket = createFakeSocket();
      const { result } = renderHook(props => useJobNotificationCenter(props), { initialProps: makeOptions(socket) });
      act(() => socket.emitLocal('job:finished', JOB_DONE));
      expect(result.current.toasts).toHaveLength(1);
      act(() => { vi.advanceTimersByTime(6_100); });
      expect(result.current.toasts).toHaveLength(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it('点击 toast 跳作业面板并关闭该条', () => {
    const socket = createFakeSocket();
    const options = makeOptions(socket);
    const { result } = renderHook(props => useJobNotificationCenter(props), { initialProps: options });
    act(() => socket.emitLocal('job:finished', JOB_DONE));
    act(() => result.current.activateToast(result.current.toasts[0]));
    expect(options.onOpenJobsView).toHaveBeenCalledTimes(1);
    expect(result.current.toasts).toHaveLength(0);
  });

  it('卸载后解绑 socket 监听', () => {
    const socket = createFakeSocket();
    const { unmount } = renderHook(props => useJobNotificationCenter(props), { initialProps: makeOptions(socket) });
    expect(socket.listenerCount('job:finished')).toBe(1);
    expect(socket.listenerCount('ai:resumed')).toBe(1);
    unmount();
    expect(socket.listenerCount('job:finished')).toBe(0);
    expect(socket.listenerCount('ai:resumed')).toBe(0);
  });
});

describe('useJobNotificationCenter ai:resumed', () => {
  const AI_RESUMED = { type: 'ai:resumed', conversationId: 'conv-other', jobId: '101', preview: '结果已写入 out/' };

  it('指向非当前对话：对话角标 +1、桌面通知、toast；点击打开该对话', () => {
    const socket = createFakeSocket();
    const options = makeOptions(socket);
    const { result } = renderHook(props => useJobNotificationCenter(props), { initialProps: options });

    act(() => socket.emitLocal('ai:resumed', AI_RESUMED));

    expect(result.current.conversationUnread).toBe(1);
    expect(result.current.jobUnread).toBe(0);
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]).toMatchObject({ kind: 'ai', conversationId: 'conv-other' });
    expect(MockNotification.instances).toHaveLength(1);
    expect(MockNotification.instances[0].title).toBe('AI 已继续处理作业 #101');

    act(() => result.current.activateToast(result.current.toasts[0]));
    expect(options.onOpenConversation).toHaveBeenCalledWith('conv-other');
  });

  it('指向当前对话：交给 AIChat 处理，这里完全忽略', () => {
    const socket = createFakeSocket();
    const { result } = renderHook(props => useJobNotificationCenter(props), { initialProps: makeOptions(socket) });
    act(() => socket.emitLocal('ai:resumed', { ...AI_RESUMED, conversationId: 'conv-current' }));
    expect(result.current.conversationUnread).toBe(0);
    expect(result.current.toasts).toHaveLength(0);
    expect(MockNotification.instances).toHaveLength(0);
  });

  it('对应对话被打开后角标清零', () => {
    const socket = createFakeSocket();
    const options = makeOptions(socket);
    const { result, rerender } = renderHook(props => useJobNotificationCenter(props), { initialProps: options });
    act(() => socket.emitLocal('ai:resumed', AI_RESUMED));
    expect(result.current.conversationUnread).toBe(1);
    rerender({ ...options, activeConversationId: 'conv-other' });
    expect(result.current.conversationUnread).toBe(0);
  });

  it('同一 jobId + 对话的重复事件只提醒一次', () => {
    const socket = createFakeSocket();
    const { result } = renderHook(props => useJobNotificationCenter(props), { initialProps: makeOptions(socket) });
    act(() => {
      socket.emitLocal('ai:resumed', AI_RESUMED);
      socket.emitLocal('ai:resumed', AI_RESUMED);
    });
    expect(result.current.conversationUnread).toBe(1);
    expect(result.current.toasts).toHaveLength(1);
  });
});
