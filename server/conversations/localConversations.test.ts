import { afterEach, describe, expect, it } from 'vitest';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { LocalConversationStore } from './localConversations';

const roots: string[] = [];

afterEach(async () => {
  await Promise.all(roots.splice(0).map(root => fs.rm(root, { recursive: true, force: true })));
});

async function createStore(): Promise<LocalConversationStore> {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'hpclaw-conversations-'));
  roots.push(root);
  return new LocalConversationStore(root);
}

describe('LocalConversationStore', () => {
  it('persists, lists, updates and removes conversations without an SSH session', async () => {
    const store = await createStore();
    await store.save({ id: 'c1', title: 'First', messages: [{ role: 'user', content: 'hi' }], createdAt: 1, updatedAt: 2 });
    expect(await store.list()).toEqual([{ id: 'c1', title: 'First', messageCount: 1, createdAt: 1, updatedAt: 2 }]);

    await store.save({ id: 'c1', title: 'Updated', messages: [], createdAt: 1, updatedAt: 3 });
    expect((await store.get('c1'))?.title).toBe('Updated');
    expect((await store.list())[0].messageCount).toBe(0);

    await store.remove('c1');
    expect(await store.list()).toEqual([]);
  });

  it('rejects path traversal ids', async () => {
    const store = await createStore();
    await expect(store.get('../escape')).rejects.toThrow('非法');
    await expect(store.save({ id: '../escape', title: 'x', messages: [], createdAt: 1, updatedAt: 1 })).rejects.toThrow('非法');
  });

  it('returns missing only for absent archives, not corrupted existing data', async () => {
    const store = await createStore();
    expect(await store.get('absent')).toBeUndefined();
    await fs.writeFile(path.join(roots.at(-1)!, 'broken.json'), '{broken');
    await expect(store.get('broken')).rejects.toThrow();
    expect(await fs.readFile(path.join(roots.at(-1)!, 'broken.json'), 'utf8')).toBe('{broken');
  });
});
