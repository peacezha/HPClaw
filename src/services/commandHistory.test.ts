// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { recordCommand, searchHistory, getRecentCommands, clearHistory } from './commandHistory';

describe('commandHistory', () => {
  beforeEach(() => {
    clearHistory();
    localStorage.clear();
  });

  it('记录并按前缀匹配历史命令', () => {
    recordCommand('bjobs -w');
    recordCommand('fastqc reads_1.fq.gz');
    const hits = searchHistory('bjo');
    expect(hits[0]?.completion).toBe('bjobs -w');
  });

  it('整条已输入时不提示自己', () => {
    recordCommand('bjobs -w');
    expect(searchHistory('bjobs -w')).toHaveLength(0);
  });

  it('最后一个 token 前缀也能命中完整历史命令', () => {
    recordCommand('samtools view sample1.bam');
    const hits = searchHistory('samtools vi');
    expect(hits[0]?.completion).toBe('samtools view sample1.bam');
  });

  it('高频命令排在低频前面', () => {
    recordCommand('ls -lh');
    recordCommand('ls -lh');
    recordCommand('ls -lh');
    recordCommand('lsb_release -a');
    const hits = searchHistory('ls');
    expect(hits[0]?.completion).toBe('ls -lh');
  });

  it('getRecentCommands 按最近使用排序', () => {
    recordCommand('cmd-one');
    recordCommand('cmd-two');
    recordCommand('cmd-one'); // 刷新 one 的最近时间
    expect(getRecentCommands(2)).toEqual(['cmd-one', 'cmd-two']);
  });

  it('太短的命令不记录', () => {
    recordCommand('ls');
    expect(getRecentCommands()).toHaveLength(0);
  });
});
