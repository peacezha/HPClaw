import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { ConversationRecordLike, ConversationSummary } from './clusterConversations';

const INDEX_FILE = 'index.json';
const MAX_CONVERSATION_BYTES = 50 * 1024 * 1024;

function validateId(id: string): string {
  if (!/^[\w-]+$/.test(id)) throw new Error('非法的对话 ID');
  return id;
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

/**
 * 本地权威对话库。对话不再依附 SSH 会话，因此无集群模式、断线和切换集群时
 * 都可以继续使用；集群副本只作为用户主动选择的同步目标。
 */
export class LocalConversationStore {
  constructor(private readonly dir: string) {}

  private filePath(id: string): string {
    return path.join(this.dir, `${validateId(id)}.json`);
  }

  private async ensureDir(): Promise<void> {
    await fs.mkdir(this.dir, { recursive: true });
  }

  private async writeAtomic(file: string, content: string): Promise<void> {
    await this.ensureDir();
    const temporary = `${file}.tmp-${process.pid}-${Date.now()}`;
    await fs.writeFile(temporary, content, { encoding: 'utf8', mode: 0o600 });
    await fs.rename(temporary, file);
    await fs.chmod(file, 0o600).catch(() => undefined);
  }

  async list(): Promise<ConversationSummary[]> {
    try {
      const parsed = JSON.parse(await fs.readFile(path.join(this.dir, INDEX_FILE), 'utf8'));
      const list = Array.isArray(parsed) ? parsed : parsed?.conversations;
      if (Array.isArray(list)) {
        return list.filter(item => item && typeof item.id === 'string')
          .sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0));
      }
    } catch { /* 索引不存在或损坏时扫描恢复 */ }
    return this.scanSummaries();
  }

  private async scanSummaries(): Promise<ConversationSummary[]> {
    await this.ensureDir();
    const names = await fs.readdir(this.dir).catch(() => [] as string[]);
    const summaries: ConversationSummary[] = [];
    for (const name of names) {
      if (!name.endsWith('.json') || name === INDEX_FILE) continue;
      try {
        const stat = await fs.stat(path.join(this.dir, name));
        if (!stat.isFile() || stat.size > MAX_CONVERSATION_BYTES) continue;
        const record = JSON.parse(await fs.readFile(path.join(this.dir, name), 'utf8')) as ConversationRecordLike;
        if (record?.id) summaries.push(toSummary(record));
      } catch { /* 跳过单个损坏记录 */ }
    }
    summaries.sort((a, b) => b.updatedAt - a.updatedAt);
    await this.writeIndex(summaries);
    return summaries;
  }

  async get(id: string): Promise<ConversationRecordLike | undefined> {
    try {
      const file = this.filePath(id);
      const stat = await fs.stat(file);
      if (stat.size > MAX_CONVERSATION_BYTES) throw new Error('对话存档超过安全读取上限，未覆盖原文件');
      return JSON.parse(await fs.readFile(file, 'utf8')) as ConversationRecordLike;
    } catch (error) {
      if ((error as NodeJS.ErrnoException)?.code === 'ENOENT') return undefined;
      throw error;
    }
  }

  async save(record: ConversationRecordLike): Promise<void> {
    await this.writeAtomic(this.filePath(record.id), JSON.stringify(record, null, 2));
    const summaries = (await this.list()).filter(item => item.id !== record.id);
    summaries.unshift(toSummary(record));
    summaries.sort((a, b) => b.updatedAt - a.updatedAt);
    await this.writeIndex(summaries);
  }

  async remove(id: string): Promise<void> {
    await fs.rm(this.filePath(id), { force: true });
    await this.writeIndex((await this.list()).filter(item => item.id !== id));
  }

  private async writeIndex(summaries: ConversationSummary[]): Promise<void> {
    await this.writeAtomic(path.join(this.dir, INDEX_FILE), JSON.stringify(summaries, null, 2));
  }
}

/** 按计算目标过滤对话：无 scopeKey 的旧记录归入本地工作台。 */
export function filterConversationsByScope<T extends { scopeKey?: string }>(list: T[], scope: string): T[] {
  if (!scope) return list;
  return list.filter(item => (item.scopeKey || 'local-workbench') === scope);
}
