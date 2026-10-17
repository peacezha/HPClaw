// @vitest-environment jsdom
// useAllClusterJobs：30s 轮询 /api/jobs/summary/all、失败保留上次成功数据、
// enabled=false 不发请求、卸载清理定时器。
import { describe, it, expect, vi, afterEach } from 'vitest';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { useAllClusterJobs, type AllClusterJobsEntry } from './useAllClusterJobs';

const ENTRY: AllClusterJobsEntry = {
  sessionId: 'sess-1',
  host: 'hpc.example.edu',
  username: 'tester',
  scheduler: 'lsf',
  running: 2,
  pending: 1,
  updatedAt: 1_700_000_000_000,
};

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return { ok, status, json: async () => body } as Response;
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('useAllClusterJobs', () => {
  it('enabled 时拉取聚合接口并按 sessionId 索引', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ success: true, clusters: [ENTRY] }));
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => useAllClusterJobs({ enabled: true }));

    await waitFor(() => expect(result.current.bySessionId['sess-1']).toBeTruthy());
    expect(fetchMock).toHaveBeenCalledWith('/api/jobs/summary/all');
    expect(result.current.bySessionId['sess-1']).toMatchObject({ running: 2, pending: 1, scheduler: 'lsf' });
    expect(result.current.error).toBe('');
  });

  it('刷新失败保留上次成功数据，只记录错误', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse({ success: true, clusters: [ENTRY] }))
      .mockRejectedValueOnce(new Error('network down'));
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => useAllClusterJobs({ enabled: true }));
    await waitFor(() => expect(result.current.bySessionId['sess-1']).toBeTruthy());

    await act(() => result.current.refresh());
    expect(result.current.error).toContain('network down');
    expect(result.current.bySessionId['sess-1']).toMatchObject({ running: 2, pending: 1 });
  });

  it('HTTP 错误时抛出服务端 error 文案', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ success: false, error: '需要活跃的 SSH 会话' }, false, 401));
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => useAllClusterJobs({ enabled: true }));

    await waitFor(() => expect(result.current.error).toContain('需要活跃的 SSH 会话'));
    expect(result.current.bySessionId).toEqual({});
  });

  it('enabled=false 不发请求', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ success: true, clusters: [ENTRY] }));
    vi.stubGlobal('fetch', fetchMock);

    renderHook(() => useAllClusterJobs({ enabled: false }));
    await act(async () => undefined);

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('按 30s 间隔轮询，卸载后清理定时器', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn(async () => jsonResponse({ success: true, clusters: [ENTRY] }));
    vi.stubGlobal('fetch', fetchMock);

    const { unmount } = renderHook(() => useAllClusterJobs({ enabled: true, pollIntervalMs: 30_000 }));
    await act(async () => { await vi.advanceTimersByTimeAsync(0); });
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await act(async () => { await vi.advanceTimersByTimeAsync(30_000); });
    expect(fetchMock).toHaveBeenCalledTimes(2);

    unmount();
    await act(async () => { await vi.advanceTimersByTimeAsync(90_000); });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
