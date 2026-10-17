// 聚合对话列表(v0.5.2+):本地工作台 + 所有已连接集群,每条标注来源。
// 抽成纯函数便于单测;会话遍历/超时/降级在 server.ts 的 /api/conversations/all 里。
export interface AggregatedConversationSource {
  originSessionId: string;
  clusterLabel: string;
  origin: 'local' | 'cluster';
  list: Array<Record<string, unknown> & { id: string; updatedAt?: unknown }>;
}

/** updatedAt 兼容历史格式:旧版集群存档写 ISO 字符串,Number() 直接转是 NaN,
 *  NaN 比较器会让 sort 整体失序,最新对话沉底(0.5.4 实测用户看不到新对话)。 */
export function normalizeUpdatedAt(value: unknown): number {
  const n = Number(value);
  if (Number.isFinite(n) && n > 0) return n;
  const parsed = Date.parse(String(value ?? ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function aggregateConversationLists(sources: AggregatedConversationSource[]): Array<Record<string, unknown>> {
  const seen = new Set<string>();
  const out: Array<Record<string, unknown>> = [];
  for (const source of sources) {
    for (const item of source.list) {
      if (!item || typeof item.id !== 'string' || !item.id || seen.has(item.id)) continue;
      seen.add(item.id);
      out.push({
        ...item,
        updatedAt: normalizeUpdatedAt(item.updatedAt),
        origin: source.origin,
        originSessionId: source.originSessionId,
        clusterLabel: source.clusterLabel,
      });
    }
  }
  out.sort((a, b) => Number(b.updatedAt) - Number(a.updatedAt));
  return out;
}
