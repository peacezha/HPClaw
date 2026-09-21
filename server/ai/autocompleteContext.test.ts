import { describe, expect, it } from 'vitest';
import { buildContextBlock, buildPathSuggestions, looksLikePath } from './autocompleteContext';
import type { ClusterSnapshot } from './types';

const snapshot: ClusterSnapshot = {
  workingDir: '/public/home/hpzhang',
  files: [
    { name: 'minimap.out', size: 100, modified: 0, type: 'file', recognizedSkillHints: [] },
    { name: 'minimap.err', size: 50, modified: 0, type: 'file', recognizedSkillHints: [] },
    { name: 'reads_1.fq.gz', size: 999, modified: 0, type: 'file', recognizedSkillHints: [] },
    { name: 'data', size: 0, modified: 0, type: 'directory', recognizedSkillHints: [] },
  ],
  jobs: [{ jobId: '123', name: 'test', status: 'RUN', cores: 8, queue: 'normal', runtime: '1h' }],
  quota: null,
  modules: [],
  queueStatus: [],
  timestamp: 0,
};

describe('buildPathSuggestions', () => {
  it('按前缀补全当前目录文件', () => {
    const hits = buildPathSuggestions('cat mini', snapshot);
    expect(hits.map(h => h.completion)).toEqual(['minimap.out', 'minimap.err']);
  });

  it('目录补全带尾部斜杠', () => {
    const hits = buildPathSuggestions('ls da', snapshot);
    expect(hits[0]?.completion).toBe('data/');
  });

  it('flag token 不给路径建议', () => {
    expect(buildPathSuggestions('ls -', snapshot)).toHaveLength(0);
  });

  it('无快照时返回空', () => {
    expect(buildPathSuggestions('cat mini', null)).toHaveLength(0);
  });

  it('./ 前缀也能补全', () => {
    const hits = buildPathSuggestions('cat ./mini', snapshot);
    expect(hits.map(h => h.completion)).toEqual(['./minimap.out', './minimap.err']);
  });
});

describe('looksLikePath', () => {
  it('识别路径形态', () => {
    expect(looksLikePath('data/reads')).toBe(true);
    expect(looksLikePath('./a.txt')).toBe(true);
    expect(looksLikePath('samtools')).toBe(false);
  });
});

describe('buildContextBlock', () => {
  it('包含目录、文件和历史', () => {
    const block = buildContextBlock(snapshot, ['bjobs -w', 'fastqc reads_1.fq.gz']);
    expect(block).toContain('/public/home/hpzhang');
    expect(block).toContain('minimap.out');
    expect(block).toContain('data/');
    expect(block).toContain('bjobs -w');
    expect(block).toContain('123(RUN)');
  });

  it('无上下文时返回空字符串', () => {
    expect(buildContextBlock(null, [])).toBe('');
  });
});
