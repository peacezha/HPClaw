// 示例对话种子：幂等标记、固定 id、demo-assets 资源拷贝。
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  DEMO_CONVERSATION_ID,
  DEMO_CONVERSATION_TITLE,
  ensureDemoConversationSeed,
} from './demoConversationSeed';
import { LocalConversationStore } from './localConversations';

const tempDirs: string[] = [];

afterEach(() => {
  for (const dir of tempDirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

function makeTempDir(prefix: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

/** 布置一套种子输入：空对话库目录 + 打包资源目录（内置两张假 svg） */
function setupDirs() {
  const root = makeTempDir('hpclaw-demo-seed-');
  const conversationsDir = path.join(root, 'conversations');
  const assetsSourceDir = path.join(root, 'bundle', 'demo-assets');
  const assetsTargetDir = path.join(root, 'data', 'demo-assets');
  fs.mkdirSync(assetsSourceDir, { recursive: true });
  fs.writeFileSync(path.join(assetsSourceDir, 'editing-summary-demo.svg'), '<svg xmlns="http://www.w3.org/2000/svg"/>');
  fs.writeFileSync(path.join(assetsSourceDir, 'qc-curve-demo.svg'), '<svg xmlns="http://www.w3.org/2000/svg"/>');
  return { root, conversationsDir, assetsSourceDir, assetsTargetDir };
}

describe('ensureDemoConversationSeed', () => {
  it('首次调用：写入固定 id 的示例对话、拷贝 demo-assets、写幂等标记', async () => {
    const { conversationsDir, assetsSourceDir, assetsTargetDir } = setupDirs();
    const seeded = await ensureDemoConversationSeed({
      conversationsDir,
      assetsSourceDir,
      assetsTargetDir,
      now: () => 123456,
    });
    expect(seeded).toBe(true);

    const store = new LocalConversationStore(conversationsDir);
    const record = await store.get(DEMO_CONVERSATION_ID);
    expect(record).toBeDefined();
    expect(record).toMatchObject({
      id: DEMO_CONVERSATION_ID,
      title: DEMO_CONVERSATION_TITLE,
      summary: '',
      memory: '',
      skillHints: [],
      createdAt: 123456,
      updatedAt: 123456,
    });
    // 2 条 user + 2 条 assistant 交替；引用 ./demo-assets 下的两张图
    const messages = record!.messages as Array<{ role: string; content: string }>;
    expect(messages.map(m => m.role)).toEqual(['user', 'assistant', 'user', 'assistant']);
    expect(messages[1].content).toContain('| --- |');
    expect(messages[3].content).toContain('./demo-assets/editing-summary-demo.svg');
    expect(messages[3].content).toContain('./demo-assets/qc-curve-demo.svg');
    expect(messages[3].content).toContain('https://www.ncbi.nlm.nih.gov');

    // 资源拷贝真实落盘 + 幂等标记
    expect(fs.existsSync(path.join(assetsTargetDir, 'editing-summary-demo.svg'))).toBe(true);
    expect(fs.existsSync(path.join(assetsTargetDir, 'qc-curve-demo.svg'))).toBe(true);
    expect(fs.existsSync(path.join(conversationsDir, '.demo-seed-v1'))).toBe(true);
  });

  it('幂等：二次调用跳过（不重复拷贝、不重写对话）', async () => {
    const { conversationsDir, assetsSourceDir, assetsTargetDir } = setupDirs();
    const copyDir = vi.fn(async (source: string, target: string) => {
      await fs.promises.cp(source, target, { recursive: true });
    });
    const options = { conversationsDir, assetsSourceDir, assetsTargetDir, copyDir };

    expect(await ensureDemoConversationSeed({ ...options, now: () => 111 })).toBe(true);
    expect(copyDir).toHaveBeenCalledTimes(1);
    expect(copyDir).toHaveBeenCalledWith(assetsSourceDir, assetsTargetDir);

    expect(await ensureDemoConversationSeed({ ...options, now: () => 222 })).toBe(false);
    expect(copyDir).toHaveBeenCalledTimes(1);
    const record = await new LocalConversationStore(conversationsDir).get(DEMO_CONVERSATION_ID);
    expect(record?.updatedAt).toBe(111);
  });

  it('标记已存在（用户删除过示例对话）：完全跳过，不播种不拷贝', async () => {
    const { conversationsDir, assetsSourceDir, assetsTargetDir } = setupDirs();
    fs.mkdirSync(conversationsDir, { recursive: true });
    fs.writeFileSync(path.join(conversationsDir, '.demo-seed-v1'), '1');
    const copyDir = vi.fn(async () => undefined);

    const seeded = await ensureDemoConversationSeed({ conversationsDir, assetsSourceDir, assetsTargetDir, copyDir });
    expect(seeded).toBe(false);
    expect(copyDir).not.toHaveBeenCalled();
    expect(await new LocalConversationStore(conversationsDir).list()).toEqual([]);
  });

  it('源目录即目标目录（dev 模式 DATA_ROOT == APP_ROOT）：跳过拷贝但仍播种', async () => {
    const { conversationsDir, assetsSourceDir } = setupDirs();
    const copyDir = vi.fn(async () => undefined);
    const seeded = await ensureDemoConversationSeed({
      conversationsDir,
      assetsSourceDir,
      assetsTargetDir: assetsSourceDir,
      copyDir,
    });
    expect(seeded).toBe(true);
    expect(copyDir).not.toHaveBeenCalled();
    expect(await new LocalConversationStore(conversationsDir).get(DEMO_CONVERSATION_ID)).toBeDefined();
  });
});
