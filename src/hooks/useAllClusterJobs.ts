// 全部已连接集群的作业概况轮询：30s 拉一次 GET /api/jobs/summary/all（聚合接口，
// 服务端遍历各集群 SSH 会话并发采集），供左侧边栏"计算资源"页签的每个集群条目
// 显示"运行 X · 排队 Y"。请求失败保留上次成功数据；enabled=false（侧栏不在
// 计算资源页 / 无已连接集群）时不发请求；组件卸载清理定时器。
import { useCallback, useEffect, useState } from 'react';

/** 聚合接口返回的单集群条目（字段对齐 /api/jobs/summary：scheduler/updatedAt） */
export interface AllClusterJobsEntry {
  sessionId: string;
  host: string;
  username: string;
  scheduler: string | null;
  running: number;
  pending: number;
  updatedAt: number;
  /** 该集群采集失败/超时时由服务端降级填入 */
  error?: string;
}

export interface UseAllClusterJobsOptions {
  /** false 时停止轮询且不发请求 */
  enabled: boolean;
  pollIntervalMs?: number;
}

export interface AllClusterJobsState {
  /** 按 sessionId 索引；请求失败时保留上次成功数据 */
  bySessionId: Record<string, AllClusterJobsEntry>;
  /** 最近一次整表刷新的错误（条目级失败在 entry.error 上） */
  error: string;
  loading: boolean;
  refresh: () => Promise<void>;
}

function normalizeEntries(value: unknown): AllClusterJobsEntry[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap(item => {
    if (!item || typeof item !== 'object') return [];
    const raw = item as Partial<AllClusterJobsEntry>;
    const sessionId = String(raw.sessionId || '').trim();
    if (!sessionId) return [];
    return [{
      sessionId,
      host: String(raw.host || ''),
      username: String(raw.username || ''),
      scheduler: raw.scheduler ? String(raw.scheduler) : null,
      running: Number(raw.running) || 0,
      pending: Number(raw.pending) || 0,
      updatedAt: Number(raw.updatedAt) || 0,
      error: raw.error ? String(raw.error) : undefined,
    }];
  });
}

export function useAllClusterJobs({
  enabled,
  pollIntervalMs = 30_000,
}: UseAllClusterJobsOptions): AllClusterJobsState {
  const [bySessionId, setBySessionId] = useState<Record<string, AllClusterJobsEntry>>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/jobs/summary/all');
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      const entries = normalizeEntries(data?.clusters);
      setBySessionId(Object.fromEntries(entries.map(entry => [entry.sessionId, entry])));
      setError('');
    } catch (cause) {
      // 只记录错误，不清空已缓存的各集群数据
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    void refresh();
    const timer = window.setInterval(() => void refresh(), pollIntervalMs);
    return () => window.clearInterval(timer);
  }, [enabled, pollIntervalMs, refresh]);

  return { bySessionId, error, loading, refresh };
}
