// 文献学习草稿箱：学习内容持久化（防切走页面丢失）+ 修订写回。
import { beforeEach, describe, expect, it } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';

// DATA_ROOT 在模块加载时定型，必须先设环境再动态导入被测模块；
// 同一文件内共享一个临时目录，逐用例清空存储文件实现隔离。
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hpclaw-learn-drafts-'));
process.env.HPCLAW_DATA_ROOT = dir;
const storePromise = import('./learnDraftStore');
let store: typeof import('./learnDraftStore');

const sampleDraft = () => ({
  name: 'DAP-seq 流程草稿',
  description: '从论文提取',
  keywords: ['dap-seq'],
  params: [{ name: 'INPUT_DIR', label: 'FASTQ 目录', type: 'path' as const }],
  steps: [{ title: 'FastQC', command: 'fastqc *.fq.gz' }],
  source: 'ai' as const,
});

beforeEach(async () => {
  store = await storePromise;
  fs.rmSync(path.join(dir, 'workflows', 'learn-drafts.json'), { force: true });
});

describe('learnDraftStore', () => {
  it('persists drafts across module states (saved drafts survive navigation loss)', async () => {
    const entry = store.saveLearnDraft({
      name: 'DAP-seq 流程草稿',
      sourceLabel: 'DOI 10.1234/test',
      doi: '10.1234/test',
      draft: sampleDraft(),
      paperContext: 'Methods 上下文'.repeat(1000),
    });
    expect(entry.id).toBeTruthy();

    // 模拟“点了别的再回来”：重新读盘，草稿还在
    const fresh = await import('./learnDraftStore');
    const list = fresh.listLearnDrafts();
    expect(list).toHaveLength(1);
    expect(list[0].name).toBe('DAP-seq 流程草稿');
    expect(list[0].stepCount).toBe(1);
    expect((list[0] as any).paperContext).toBeUndefined();

    const full = fresh.getLearnDraft(entry.id);
    expect(full?.draft.steps[0]?.title).toBe('FastQC');
    expect(full?.paperContext?.length).toBeGreaterThan(0);
  });

  it('updates drafts with revision notes and evicts beyond 20 entries', () => {
    const entry = store.saveLearnDraft({ name: 'a', sourceLabel: 'x', draft: sampleDraft() });
    const updated = store.updateLearnDraft(entry.id, {
      revisionNote: '把第 3 步 SPP 改成 MACS2',
      draft: { ...sampleDraft(), name: '修订后' },
    });
    expect(updated?.revisionNotes).toEqual(['把第 3 步 SPP 改成 MACS2']);
    expect(updated?.draft.name).toBe('修订后');

    for (let i = 0; i < 25; i++) {
      store.saveLearnDraft({ name: `draft-${i}`, sourceLabel: 'x', draft: sampleDraft() });
    }
    const list = store.listLearnDrafts();
    expect(list.length).toBe(20);
    // LRU：最新的条目保留，最旧的（含最初那条）被挤出
    expect(list.some(item => item.name === 'draft-24')).toBe(true);
    expect(store.getLearnDraft(entry.id)).toBeUndefined();
  });

  it('deletes drafts and reports missing ids', () => {
    const entry = store.saveLearnDraft({ name: 'a', sourceLabel: 'x', draft: sampleDraft() });
    expect(store.deleteLearnDraft(entry.id)).toBe(true);
    expect(store.deleteLearnDraft(entry.id)).toBe(false);
    expect(store.listLearnDrafts()).toHaveLength(0);
  });
});
