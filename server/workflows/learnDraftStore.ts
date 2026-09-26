// 文献学习草稿箱：学习产出的流程草稿持久化到磁盘，避免用户切换页面/关闭面板后
// 学习内容丢失；同时作为「与 AI 交流修改」的载体（修订直接写回草稿）。
// 存储：DATA_ROOT/workflows/learn-drafts.json（纯数组，原子写入，上限 20 条 LRU）。
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { dataPath, ensureDir } from '../paths';
import type { Workflow } from './workflowTypes';

const STORE_PATH = dataPath('workflows', 'learn-drafts.json');
const MAX_DRAFTS = 20;
/** 论文上下文保留上限：修订时作为证据回灌给模型，太大浪费 token。 */
const MAX_PAPER_CONTEXT_CHARS = 70_000;

export interface LearnDraft {
  id: string;
  name: string;
  sourceLabel: string;
  doi?: string;
  repoUrl?: string;
  createdAt: number;
  updatedAt: number;
  /** 历次修订的用户反馈摘要（最新在最后）。 */
  revisionNotes: string[];
  /** 流程草稿（与编辑器字段同构，含 manifest 与 paperImport 审计）。 */
  draft: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>;
  /** 学习时选取的论文方法上下文，供后续修订引用；仅存草稿箱，列表接口不返回。 */
  paperContext?: string;
}

function readAll(): LearnDraft[] {
  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(item => item && typeof item === 'object' && typeof item.id === 'string' && item.draft);
  } catch {
    return [];
  }
}

function writeAll(drafts: LearnDraft[]): void {
  ensureDir(path.dirname(STORE_PATH));
  const tmp = `${STORE_PATH}.tmp-${process.pid}`;
  fs.writeFileSync(tmp, JSON.stringify(drafts, null, 1));
  fs.renameSync(tmp, STORE_PATH);
}

/** 列表用摘要：不带 paperContext 与 draft 主体，避免列表页拉大对象。 */
export function listLearnDrafts(): Array<Omit<LearnDraft, 'draft' | 'paperContext'> & { stepCount: number; qualityScore?: number }> {
  return readAll()
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .map(({ draft, paperContext: _pc, ...meta }) => ({
      ...meta,
      stepCount: Array.isArray(draft.steps) ? draft.steps.length : 0,
      qualityScore: draft.paperImport?.quality?.score,
    }));
}

export function getLearnDraft(id: string): LearnDraft | undefined {
  return readAll().find(item => item.id === id);
}

export function saveLearnDraft(input: {
  name: string;
  sourceLabel: string;
  doi?: string;
  repoUrl?: string;
  draft: LearnDraft['draft'];
  paperContext?: string;
}): LearnDraft {
  const now = Date.now();
  const entry: LearnDraft = {
    id: crypto.randomUUID(),
    name: input.name.slice(0, 80),
    sourceLabel: input.sourceLabel.slice(0, 200),
    doi: input.doi,
    repoUrl: input.repoUrl,
    createdAt: now,
    updatedAt: now,
    revisionNotes: [],
    draft: input.draft,
    paperContext: input.paperContext?.slice(0, MAX_PAPER_CONTEXT_CHARS),
  };
  const drafts = [entry, ...readAll()]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, MAX_DRAFTS);
  writeAll(drafts);
  return entry;
}

export function updateLearnDraft(
  id: string,
  patch: { name?: string; draft?: LearnDraft['draft']; revisionNote?: string },
): LearnDraft | undefined {
  const drafts = readAll();
  const entry = drafts.find(item => item.id === id);
  if (!entry) return undefined;
  if (typeof patch.name === 'string' && patch.name.trim()) entry.name = patch.name.trim().slice(0, 80);
  if (patch.draft) entry.draft = patch.draft;
  if (patch.revisionNote?.trim()) entry.revisionNotes = [...entry.revisionNotes, patch.revisionNote.trim().slice(0, 500)].slice(-20);
  entry.updatedAt = Date.now();
  writeAll(drafts);
  return entry;
}

export function deleteLearnDraft(id: string): boolean {
  const drafts = readAll();
  const next = drafts.filter(item => item.id !== id);
  if (next.length === drafts.length) return false;
  writeAll(next);
  return true;
}
