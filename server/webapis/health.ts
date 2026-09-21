// 健康检测：执行各服务注册的最轻量真实探针（经 invokeWebApi），
// 全量探测并发 6，结果缓存 10 分钟供目录路由展示。

import { getWebApiService, WEB_API_SERVICES } from './registry';
import { invokeWebApi } from './invoke';

export const PROBE_CACHE_TTL_MS = 10 * 60_000;
export const PROBE_ALL_CONCURRENCY = 6;

export interface WebApiProbeResult {
  serviceId: string;
  ok: boolean;
  status?: number;
  durationMs?: number;
  error?: string;
}

/** 单服务探针：执行注册表 probe，按 expect.status（默认 2xx）与 expect.contains 判定。
 *  瞬时网络波动（超时/连接失败）自动重试一次，避免把上游抖动误报为不可用。 */
export async function probeWebApi(serviceId: string): Promise<WebApiProbeResult> {
  const first = await probeWebApiOnce(serviceId);
  if (first.ok || !/超时|timeout|network_error/i.test(first.error || '')) return first;
  await new Promise(resolve => setTimeout(resolve, 3000));
  return probeWebApiOnce(serviceId);
}

async function probeWebApiOnce(serviceId: string): Promise<WebApiProbeResult> {
  const service = getWebApiService(serviceId);
  if (!service) {
    return { serviceId, ok: false, error: `未注册的数据服务: ${serviceId}` };
  }
  const probe = service.probe;
  const result = await invokeWebApi(service.id, probe.endpoint, probe.params || {});
  if (result.ok === false) {
    return {
      serviceId,
      ok: false,
      status: result.status,
      durationMs: result.durationMs,
      error: `${result.error.code}: ${result.error.message}`,
    };
  }
  const expectedStatus = probe.expect.status;
  if (expectedStatus !== undefined && result.status !== expectedStatus) {
    return {
      serviceId,
      ok: false,
      status: result.status,
      durationMs: result.durationMs,
      error: `期望 HTTP ${expectedStatus}，实际 ${result.status}`,
    };
  }
  if (expectedStatus === undefined && (result.status < 200 || result.status >= 300)) {
    return {
      serviceId,
      ok: false,
      status: result.status,
      durationMs: result.durationMs,
      error: `探针返回非 2xx：HTTP ${result.status}`,
    };
  }
  if (probe.expect.contains) {
    const haystack = result.text ?? JSON.stringify(result.data) ?? '';
    if (!haystack.includes(probe.expect.contains)) {
      return {
        serviceId,
        ok: false,
        status: result.status,
        durationMs: result.durationMs,
        error: `响应未包含期望内容 "${probe.expect.contains}"`,
      };
    }
  }
  return { serviceId, ok: true, status: result.status, durationMs: result.durationMs };
}

interface ProbeAllCache {
  at: number;
  results: WebApiProbeResult[];
}

let probeAllCache: ProbeAllCache | null = null;

/** 测试钩子：清空全量探针缓存。 */
export function clearProbeAllCache(): void {
  probeAllCache = null;
}

export function getCachedProbeAll(): ProbeAllCache | null {
  return probeAllCache;
}

/** 简单并发上限执行器（worker pool）。 */
async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  const lanes = Math.max(1, Math.min(concurrency, items.length));
  await Promise.all(
    Array.from({ length: lanes }, async () => {
      for (;;) {
        const index = cursor;
        cursor += 1;
        if (index >= items.length) return;
        results[index] = await worker(items[index]);
      }
    }),
  );
  return results;
}

/**
 * 全量探针（并发 concurrency，默认 6）。10 分钟内重复调用直接返回缓存，
 * 传 force=true 强制重探。
 */
export async function probeAllWebApis(
  concurrency = PROBE_ALL_CONCURRENCY,
  options: { force?: boolean } = {},
): Promise<{ at: number; cached: boolean; results: WebApiProbeResult[] }> {
  if (!options.force && probeAllCache && Date.now() - probeAllCache.at < PROBE_CACHE_TTL_MS) {
    return { at: probeAllCache.at, cached: true, results: probeAllCache.results };
  }
  const results = await mapWithConcurrency(WEB_API_SERVICES, concurrency, service =>
    probeWebApi(service.id),
  );
  probeAllCache = { at: Date.now(), results };
  return { at: probeAllCache.at, cached: false, results };
}
