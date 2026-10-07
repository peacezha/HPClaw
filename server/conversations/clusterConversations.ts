// 集群端对话存档：对话记录保存在集群用户家目录 ~/hpclaw_conversations/ 下，
// 与 ~/hpclaw_skills 同级，跨设备登录同一集群账号即可看到同一份对话记录。
// 目录结构：
//   ~/hpclaw_conversations/<id>.json   单个对话的完整记录
//   ~/hpclaw_conversations/index.json  摘要索引（列表页只读它，避免逐个拉取全文）
import path from 'node:path';
import { SftpFileService } from '../files/sftpFileService';
import { PUBLIC_WORKER } from '../publicWeb/policy';

export interface ConversationSummary {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messageCount: number;
  /** 对话归属的计算目标：'local-workbench' 或集群 sessionId；旧记录缺省按本地处理。 */
  scopeKey?: string;
}

export interface ConversationRecordLike {
  id: string;
  contextKey?: string;
  /** 对话归属的计算目标：'local-workbench' 或集群 sessionId；旧记录缺省按本地处理。 */
  scopeKey?: string;
  title: string;
  messages: unknown[];
  summary?: string;
  memory?: string;
  skillHints?: string[];
  createdAt: number;
  updatedAt: number;
}

const REMOTE_DIR = 'hpclaw_conversations';
const INDEX_FILE = 'index.json';
const MAX_CONVERSATION_BYTES = 50 * 1024 * 1024; // readPreview 上限 50 MiB

export class ClusterConversationStore {
  constructor(
    private readonly service: SftpFileService,
    private readonly home: string,
  ) {}

  private get dir(): string {
    return path.posix.join(this.home, REMOTE_DIR);
  }

  private filePath(id: string): string {
    if (!/^[\w-]+$/.test(id)) throw new Error('非法的对话 ID');
    return path.posix.join(this.dir, `${id}.json`);
  }

  private async ensureDir(): Promise<void> {
    await this.service.mkdir(this.dir).catch(() => { /* 已存在则忽略 */ });
    if (PUBLIC_WORKER) await this.service.chmod(this.dir, 0o700);
  }

  /** 对话摘要列表（按更新时间倒序）。索引缺失时扫描目录重建。 */
  async list(): Promise<ConversationSummary[]> {
    try {
      const raw = await this.service.readPreview(path.posix.join(this.dir, INDEX_FILE), 4 * 1024 * 1024);
      const parsed = JSON.parse(raw.toString('utf8'));
      const list = Array.isArray(parsed) ? parsed : parsed?.conversations;
      if (Array.isArray(list)) {
        return list.filter(s => s && typeof s.id === 'string');
      }
    } catch { /* 索引不存在/损坏 → 扫描重建 */ }
    return this.scanSummaries();
  }

  private async scanSummaries(): Promise<ConversationSummary[]> {
    let entries;
    try {
      entries = await this.service.list(this.dir);
    } catch {
      return []; // 目录不存在 = 还没有任何对话
    }
    const summaries: ConversationSummary[] = [];
    for (const entry of entries) {
      if (entry.kind !== 'file' || !entry.name.endsWith('.json') || entry.name === INDEX_FILE) continue;
      try {
        const raw = await this.service.readPreview(entry.path, MAX_CONVERSATION_BYTES);
        summaries.push(toSummary(JSON.parse(raw.toString('utf8')) as ConversationRecordLike));
      } catch { /* 跳过损坏的存档文件 */ }
    }
    summaries.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    await this.writeIndex(summaries).catch(() => { /* 索引重建失败不影响列表返回 */ });
    return summaries;
  }

  async get(id: string): Promise<ConversationRecordLike | undefined> {
    try {
      const raw = await this.service.readPreview(this.filePath(id), MAX_CONVERSATION_BYTES);
      return JSON.parse(raw.toString('utf8')) as ConversationRecordLike;
    } catch (error) {
      const code = (error as { code?: string | number })?.code;
      if (code === 'ENOENT' || code === 2 || /no such file|not found/i.test(String(error))) return undefined;
      // A connection/permission failure is not a missing archive. Never turn
      // a transient read failure into an overwrite with a fresh record.
      throw error;
    }
  }

  async save(record: ConversationRecordLike): Promise<void> {
    await this.ensureDir();
    await this.service.writeFile(this.filePath(record.id), JSON.stringify(record, null, 2));
    if (PUBLIC_WORKER) await this.service.chmod(this.filePath(record.id), 0o600);
    const rest = (await this.list()).filter(s => s.id !== record.id);
    await this.writeIndex(
      [toSummary(record), ...rest].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)),
    );
  }

  async remove(id: string): Promise<void> {
    await this.service.remove(this.filePath(id), false).catch(() => { /* 不存在视为已删除 */ });
    const rest = (await this.list()).filter(s => s.id !== id);
    await this.writeIndex(rest);
  }

  private async writeIndex(summaries: ConversationSummary[]): Promise<void> {
    await this.ensureDir();
    await this.service.writeFile(path.posix.join(this.dir, INDEX_FILE), JSON.stringify(summaries, null, 2));
    if (PUBLIC_WORKER) await this.service.chmod(path.posix.join(this.dir, INDEX_FILE), 0o600);
  }
}

function toSummary(record: ConversationRecordLike): ConversationSummary {
  return {
    id: record.id,
    title: record.title || '对话',
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    messageCount: Array.isArray(record.messages) ? record.messages.length : 0,
    scopeKey: record.scopeKey,
  };
}
