import { describe, expect, it } from 'vitest';
import { stripDsmlMarkup } from './dsml';

describe('stripDsmlMarkup', () => {
  it('剥离完整的 DSML calls 块', () => {
    const text = '我先检查一下。\n\n<｜｜DSML｜｜ calls> <｜｜DSML｜｜ invoke name="get_workflow_run"> <｜｜DSML｜｜ parameter name="runId" string="true">flow-123</｜｜DSML｜｜ parameter> </｜｜DSML｜｜ invoke> </｜｜DSML｜｜ calls>\n\n结果显示正常。';
    expect(stripDsmlMarkup(text)).toBe('我先检查一下。\n\n结果显示正常。');
  });

  it('剥离流式截断的未闭合 DSML 块', () => {
    const text = '正在处理 <｜｜DSML｜｜ calls> <｜｜DSML｜｜ invoke name="get_work';
    expect(stripDsmlMarkup(text)).toBe('正在处理');
  });

  it('剥离残留的单个 DSML 标签', () => {
    const text = '结果 <｜｜DSML｜｜ parameter name="x"> 已出';
    expect(stripDsmlMarkup(text)).toBe('结果 已出');
  });

  it('不含 DSML 时原样返回', () => {
    const text = '普通回答，没有任何标记。';
    expect(stripDsmlMarkup(text)).toBe(text);
  });

  it('剥离后压缩多余空行', () => {
    const text = '开头\n\n<｜｜DSML｜｜ calls> x </｜｜DSML｜｜ calls>\n\n\n结尾';
    expect(stripDsmlMarkup(text)).toBe('开头\n\n结尾');
  });
});
