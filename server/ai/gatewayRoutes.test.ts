import { describe, expect, it } from 'vitest';
import {
  buildAnalyzeMessages,
  buildAutocompleteMessages,
  parseAutocompleteSuggestions,
  truncateOutput,
} from './gatewayRoutes';
import type { ClusterSnapshot } from './types';

const snapshot: ClusterSnapshot = {
  workingDir: '/public/home/hpzhang',
  files: [
    { name: 'reads_1.fq.gz', size: 999, modified: 0, type: 'fastq', recognizedSkillHints: [] },
    { name: 'data', size: 0, modified: 0, type: 'directory', recognizedSkillHints: [] },
  ],
  jobs: [{ jobId: '123', name: 'test', status: 'RUN', cores: 8, queue: 'normal', runtime: '1h' }],
  quota: null,
  modules: [],
  queueStatus: [],
  timestamp: 0,
};

describe('truncateOutput', () => {
  it('短文本原样返回', () => {
    expect(truncateOutput('hello', 100)).toBe('hello');
  });

  it('长文本保留末尾并带截断标记', () => {
    const text = 'x'.repeat(500) + 'tail-error';
    const out = truncateOutput(text, 100);
    expect(out.startsWith('...[truncated]\n')).toBe(true);
    expect(out.endsWith('tail-error')).toBe(true);
    expect(out.length).toBe('...[truncated]\n'.length + 100);
  });
});

describe('buildAutocompleteMessages', () => {
  it('包含当前输入、环境上下文和最近命令', () => {
    const [system, user] = buildAutocompleteMessages({
      command: 'bsub -q',
      history: ['bjobs -w', 'fastqc reads_1.fq.gz'],
      snapshot,
      locale: 'zh-CN',
    });
    expect(system.role).toBe('system');
    expect(system.content).toContain('JSON array');
    expect(system.content).toContain('中文');
    expect(user.role).toBe('user');
    expect(user.content).toContain('bsub -q');
    expect(user.content).toContain('/public/home/hpzhang');
    expect(user.content).toContain('reads_1.fq.gz');
    expect(user.content).toContain('bjobs -w');
  });

  it('en-US 时要求英文解释，无上下文时不带环境块', () => {
    const [system, user] = buildAutocompleteMessages({
      command: 'ls',
      history: [],
      snapshot: null,
      locale: 'en-US',
    });
    expect(system.content).toContain('English');
    expect(user.content).not.toContain('环境上下文');
  });
});

describe('parseAutocompleteSuggestions', () => {
  it('解析标准 JSON 数组', () => {
    const text = '[{"completion":"bsub -q normal < run.sh","explanation":"提交作业"}]';
    expect(parseAutocompleteSuggestions(text, 'bsub -q')).toEqual([
      { completion: 'bsub -q normal < run.sh', explanation: '提交作业' },
    ]);
  });

  it('容忍代码围栏和首尾噪声', () => {
    const text = '好的：\n```json\n[{"completion":"bjobs -w","explanation":"查看作业"}]\n```\n以上。';
    const hits = parseAutocompleteSuggestions(text, 'bj');
    expect(hits).toHaveLength(1);
    expect(hits[0].completion).toBe('bjobs -w');
  });

  it('非法 JSON 与非数组返回空数组', () => {
    expect(parseAutocompleteSuggestions('not json at all', 'ls')).toEqual([]);
    expect(parseAutocompleteSuggestions('{"completion":"ls -l"}', 'ls')).toEqual([]);
  });

  it('过滤非法项、去掉与当前输入相同的项并去重', () => {
    const text = JSON.stringify([
      { completion: 'cat', explanation: '与输入相同' },
      { completion: 'cat a.txt', explanation: '有效' },
      { completion: 'cat a.txt', explanation: '重复' },
      { completion: 42 },
      'garbage',
      { completion: 'cat b.txt' },
    ]);
    const hits = parseAutocompleteSuggestions(text, 'cat');
    expect(hits).toEqual([
      { completion: 'cat a.txt', explanation: '有效' },
      { completion: 'cat b.txt', explanation: '' },
    ]);
  });

  it('遵守条数上限', () => {
    const text = JSON.stringify(
      Array.from({ length: 10 }, (_, i) => ({ completion: `ls arg${i}`, explanation: '' })),
    );
    expect(parseAutocompleteSuggestions(text, 'ls', 3)).toHaveLength(3);
  });
});

describe('buildAnalyzeMessages', () => {
  it('中文提示词并把输出包进代码块', () => {
    const [system, user] = buildAnalyzeMessages({ text: 'Job <123> Exited with code 1', locale: 'zh-CN' });
    expect(system.role).toBe('system');
    expect(system.content).toContain('分析');
    expect(user.content).toBe('```\nJob <123> Exited with code 1\n```');
  });

  it('en-US 使用英文提示词', () => {
    const [system] = buildAnalyzeMessages({ text: 'x', locale: 'en-US' });
    expect(system.content).toContain('Reply in English');
  });

  it('超长输出只保留末尾 8000 字符', () => {
    const text = 'y'.repeat(9000) + 'final-line';
    const [, user] = buildAnalyzeMessages({ text, locale: 'zh-CN' });
    expect(user.content).toContain('...[truncated]');
    expect(user.content).toContain('final-line');
    expect(user.content.length).toBeLessThan(8100);
  });
});
