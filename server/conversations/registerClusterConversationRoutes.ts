// 集群对话的只读列表与导回端点。
// 背景：QQ Bot 等外部入口直接把对话写进集群 ~/hpclaw_conversations，本地权威库
// 没有副本，此前对话记录页完全看不到这些记录。这里提供"列出集群对话（带导入
// 标记）"和"把单条集群对话导回本地库"两个端点；同步方向（本地→集群）仍由
// /api/conversations/:id/sync 承担，不受影响。
// 会话解析（X-SSH-Session-Id 或 cookie 默认会话）与 /:id/sync 完全同规则，
// 由 server.ts 注入 clusterConversationStoreFor；路由本身不关心会话细节。
import type { Express, Request } from 'express';
import type { ClusterConversationStore, ConversationSummary } from './clusterConversations';
import type { LocalConversationStore } from './localConversations';

export interface ClusterConversationRouteDeps {
  clusterConversationStoreFor: (req: Request) => ClusterConversationStore | undefined;
  localStore: LocalConversationStore;
}

/** 集群对话摘要 + 来源/导入标记（与本地摘要同构，前端按 id 去重合并） */
export interface ClusterConversationSummary extends ConversationSummary {
  origin: 'cluster';
  /** 本地权威库是否已有同 id 记录（已导入的条目按本地条目对待） */
  imported: boolean;
}

export function registerClusterConversationRoutes(app: Express, deps: ClusterConversationRouteDeps): void {
  // 注意：必须在 /api/conversations/:id 之前注册，否则 'cluster' 会被当成对话 id。
  app.get('/api/conversations/cluster', async (req, res) => {
    const clusterStore = deps.clusterConversationStoreFor(req);
    if (!clusterStore) {
      // 无活跃会话不是错误：前端把远程来源视为不可用，仅展示本地列表
      res.json({ success: true, connected: false, conversations: [] });
      return;
    }
    try {
      const summaries = await clusterStore.list();
      const conversations: ClusterConversationSummary[] = await Promise.all(
        summaries.map(async summary => ({
          ...summary,
          origin: 'cluster' as const,
          imported: Boolean(await deps.localStore.get(summary.id)),
        })),
      );
      res.json({ success: true, connected: true, conversations });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || String(err) });
    }
  });

  app.post('/api/conversations/:id/import', async (req, res) => {
    const clusterStore = deps.clusterConversationStoreFor(req);
    if (!clusterStore) {
      res.status(401).json({ success: false, error: '从计算资源导入需要活跃的 SSH 会话' });
      return;
    }
    try {
      const record = await clusterStore.get(String(req.params.id));
      if (!record) {
        res.status(404).json({ success: false, error: '对话不存在' });
        return;
      }
      await deps.localStore.save(record);
      res.json({ success: true, conversation: record });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || String(err) });
    }
  });
}
