import { describe, expect, it } from 'vitest';
import { extractDshUiSpecs, parseDshUiSpec, parseDshUiSpecText } from './DshUiSpec';

const SPEC_JSON = JSON.stringify({
  title: '校验结果',
  gap: 12,
  items: [
    { type: 'table', columns: ['名称', '状态'], rows: [['按钮', '通过'], ['输入框', '缺失']] },
    { type: 'text', text: '整体布局合理' },
  ],
});

describe('parseDshUiSpec', () => {
  it('accepts a well-formed spec and keeps title/gap', () => {
    const spec = parseDshUiSpec(JSON.parse(SPEC_JSON));
    expect(spec).not.toBeNull();
    expect(spec!.title).toBe('校验结果');
    expect(spec!.gap).toBe(12);
    expect(spec!.items).toHaveLength(2);
  });

  it('rejects non-spec shapes', () => {
    expect(parseDshUiSpec(null)).toBeNull();
    expect(parseDshUiSpec('text')).toBeNull();
    expect(parseDshUiSpec([{ type: 'text' }])).toBeNull();
    expect(parseDshUiSpec({ a: 1 })).toBeNull();
    // items 必须是对象数组
    expect(parseDshUiSpec({ items: [1, 2, 3] })).toBeNull();
    expect(parseDshUiSpec({ items: [] })).toBeNull();
  });

  it('drops invalid title/gap but keeps the spec', () => {
    const spec = parseDshUiSpec({ title: 42, gap: -1, items: [{ type: 'text', text: 'x' }] });
    expect(spec).toEqual({ items: [{ type: 'text', text: 'x' }] });
  });
});

describe('parseDshUiSpecText', () => {
  it('parses a tool_result body that is exactly the spec JSON', () => {
    expect(parseDshUiSpecText(SPEC_JSON)?.title).toBe('校验结果');
  });

  it('returns null for non-spec or truncated bodies', () => {
    expect(parseDshUiSpecText('some plain output')).toBeNull();
    expect(parseDshUiSpecText('{"a":1}')).toBeNull();
    expect(parseDshUiSpecText(SPEC_JSON.slice(0, 40))).toBeNull();
  });
});

describe('extractDshUiSpecs', () => {
  it('extracts an inline spec JSON from the assistant reply and strips it', () => {
    const text = `校验完成，结果如下：${SPEC_JSON} 以上。`;
    const { specs, strippedText } = extractDshUiSpecs(text);

    expect(specs).toHaveLength(1);
    expect(specs[0].title).toBe('校验结果');
    expect(strippedText).toBe('校验完成，结果如下： 以上。');
  });

  it('strips the surrounding fence when the spec fills a code block', () => {
    const text = `结果：\n\`\`\`json\n${SPEC_JSON}\n\`\`\`\n请查收`;
    const { specs, strippedText } = extractDshUiSpecs(text);

    expect(specs).toHaveLength(1);
    expect(strippedText).toBe('结果：\n\n请查收');
    expect(strippedText).not.toContain('```');
  });

  it('leaves non-spec JSON untouched', () => {
    const text = '配置示例 {"a":1,"items":[1,2,3]} 仅供参考';
    const { specs, strippedText } = extractDshUiSpecs(text);

    expect(specs).toHaveLength(0);
    expect(strippedText).toBe(text);
  });

  it('leaves truncated (unbalanced) JSON untouched', () => {
    const text = `结果：${SPEC_JSON.slice(0, 60)}`;
    const { specs, strippedText } = extractDshUiSpecs(text);

    expect(specs).toHaveLength(0);
    expect(strippedText).toBe(text);
  });

  it('handles braces inside JSON strings without breaking the scan', () => {
    const specWithBrace = JSON.stringify({ items: [{ type: 'text', text: 'use {curly} braces' }] });
    const { specs } = extractDshUiSpecs(`看这里 ${specWithBrace}`);
    expect(specs).toHaveLength(1);
    expect(specs[0].items[0].text).toBe('use {curly} braces');
  });

  it('extracts multiple specs up to the cap', () => {
    const one = JSON.stringify({ items: [{ type: 'text', text: 'a' }] });
    const text = Array.from({ length: 7 }, () => one).join(' 分隔 ');
    const { specs } = extractDshUiSpecs(text);
    expect(specs).toHaveLength(5);
  });
});
