import { describe, expect, it } from 'vitest';
import { aggregateConversationLists } from './aggregateConversations';

describe('aggregateConversationLists', () => {
  it('合并本地与多集群列表,按 updatedAt 倒序并标注来源', () => {
    const out = aggregateConversationLists([
      { originSessionId: 'local-workbench', clusterLabel: '', origin: 'local', list: [
        { id: 'a', title: '本地对话', updatedAt: 100 },
      ] },
      { originSessionId: 'sess-hpzhang', clusterLabel: 'hpzhang@hpc1', origin: 'cluster', list: [
        { id: 'b', title: '集群流程对话', updatedAt: 300 },
      ] },
      { originSessionId: 'sess-llfu', clusterLabel: 'llfu25@hpc1', origin: 'cluster', list: [
        { id: 'c', title: '另一集群', updatedAt: 200 },
      ] },
    ]);
    expect(out.map(item => item.id)).toEqual(['b', 'c', 'a']);
    expect(out[0]).toMatchObject({ origin: 'cluster', originSessionId: 'sess-hpzhang', clusterLabel: 'hpzhang@hpc1' });
    expect(out[2]).toMatchObject({ origin: 'local', originSessionId: 'local-workbench' });
  });

  it('同 id 去重(先出现者优先),跳过坏条目', () => {
    const out = aggregateConversationLists([
      { originSessionId: 'sess-a', clusterLabel: 'u@h1', origin: 'cluster', list: [
        { id: 'x', title: '第一次', updatedAt: 100 },
        { id: '', title: '坏条目', updatedAt: 999 },
        { id: 'x', title: '重复', updatedAt: 400 },
      ] },
      { originSessionId: 'sess-b', clusterLabel: 'v@h2', origin: 'cluster', list: [
        { id: 'x', title: '又一个重复', updatedAt: 500 },
      ] },
    ]);
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({ id: 'x', title: '第一次', originSessionId: 'sess-a' });
  });

  it('空来源(集群全部读取失败)返回空数组', () => {
    expect(aggregateConversationLists([])).toEqual([]);
  });

  it('ISO 字符串 updatedAt 归一化为时间戳再排序(旧版集群存档格式)', () => {
    const out = aggregateConversationLists([
      { originSessionId: 'sess-a', clusterLabel: 'u@h1', origin: 'cluster', list: [
        { id: 'old-iso', title: '旧格式', updatedAt: '2026-05-22T08:55:06.859Z' },
        { id: 'new-num', title: '新格式', updatedAt: 1792253102393 },
        { id: 'bad', title: '坏值', updatedAt: 'not-a-date' },
      ] },
    ]);
    expect(out.map(item => item.id)).toEqual(['new-num', 'old-iso', 'bad']);
    expect(typeof out[0].updatedAt).toBe('number');
    expect(out[2].updatedAt).toBe(0);
  });
});
