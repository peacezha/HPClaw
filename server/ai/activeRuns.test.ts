import { describe, expect, it, vi } from 'vitest';
import {
  abortActiveRun,
  attachRunListener,
  findActiveRunByConversation,
  finishActiveRun,
  getActiveRun,
  markRunDetached,
  pushRunEvent,
  registerActiveRun,
} from './activeRuns';
import { filterConversationsByScope } from '../conversations/localConversations';

describe('activeRuns（后台 AI 运行登记处）', () => {
  it('registers, buffers events, and accumulates visible text', () => {
    const run = registerActiveRun({ requestId: 'r1', conversationId: 'c1', abort: new AbortController() });
    pushRunEvent(run, { type: 'status', message: 'preparing' });
    pushRunEvent(run, { type: 'content', content: '你好' });
    pushRunEvent(run, { type: 'content', content: '，世界' });
    expect(run.text).toBe('你好，世界');
    expect(run.events).toHaveLength(3);
    expect(run.terminal).toBeNull();
  });

  it('finds the running run by conversation id and skips finished ones', () => {
    const run = registerActiveRun({ requestId: 'r2', conversationId: 'c2', abort: new AbortController() });
    expect(findActiveRunByConversation('c2')?.requestId).toBe('r2');
    finishActiveRun(run, 'done', '完成');
    expect(findActiveRunByConversation('c2')).toBeUndefined();
    expect(getActiveRun('r2')?.terminal).toBe('done');
  });

  it('caps the replay buffer so a long run does not grow memory forever', () => {
    const run = registerActiveRun({ requestId: 'r3', abort: new AbortController() });
    for (let i = 0; i < 600; i += 1) pushRunEvent(run, { type: 'status', i });
    expect(run.events.length).toBe(500);
  });

  it('notifies attach listeners with live events', () => {
    const run = registerActiveRun({ requestId: 'r4', abort: new AbortController() });
    const seen: string[] = [];
    const detach = attachRunListener(run, event => seen.push(event.type));
    pushRunEvent(run, { type: 'content', content: 'x' });
    detach();
    pushRunEvent(run, { type: 'content', content: 'y' });
    expect(seen).toEqual(['content']);
  });

  it('marks detach and aborts explicitly', () => {
    const abort = new AbortController();
    const run = registerActiveRun({ requestId: 'r5', abort });
    markRunDetached(run);
    expect(run.detached).toBe(true);
    expect(abort.signal.aborted).toBe(false); // 断连不再中止
    abortActiveRun(run);
    expect(abort.signal.aborted).toBe(true); // 显式停止仍生效
  });
});

describe('filterConversationsByScope（对话按计算目标过滤）', () => {
  const list = [
    { id: 'a', scopeKey: 'local-workbench' },
    { id: 'b', scopeKey: 'cluster-1' },
    { id: 'c' }, // 旧记录无 scopeKey
  ];
  it('keeps only the active target conversations, legacy records fall back to local workbench', () => {
    expect(filterConversationsByScope(list, 'local-workbench').map(i => i.id)).toEqual(['a', 'c']);
    expect(filterConversationsByScope(list, 'cluster-1').map(i => i.id)).toEqual(['b']);
  });
  it('empty scope returns everything', () => {
    expect(filterConversationsByScope(list, '')).toHaveLength(3);
  });
});
