import { describe, expect, it } from 'vitest';
import { sanitizeManifest } from './flowManifest';

describe('sanitizeManifest', () => {
  it('保留合法字段并裁剪空值', () => {
    const m = sanitizeManifest({
      software: [
        { name: 'FastQC', module: 'FastQC/0.11.9', required: true, extra: 'x' },
        { name: '', module: 'bad' },
        { name: 'kallisto', module: 'kallisto/0.48.0', versionCmd: 'kallisto version' },
      ],
      references: [
        { name: 'GTF', path: '/share/database/gtf', type: 'annotation', required: true },
        { name: 'bad', path: '', type: 'genome' },
        { name: 'db', path: '/db', type: 'not-a-type' },
      ],
      qcGates: [
        { afterStep: 2, metric: 'Q30', pass: '>80%', warn: '70-80%' },
        { afterStep: 0, metric: 'bad', pass: 'x' },
        { afterStep: 'x', metric: 'bad', pass: 'x' },
      ],
      inputHint: '  FASTQ 目录 ',
    });
    expect(m).toBeDefined();
    expect(m!.software).toHaveLength(2);
    expect(m!.software[0]).toEqual({ name: 'FastQC', module: 'FastQC/0.11.9', required: true });
    expect(m!.software[1].versionCmd).toBe('kallisto version');
    expect(m!.references).toHaveLength(2);
    expect(m!.references[1].type).toBe('other'); // 非法 type 回退
    expect(m!.qcGates).toHaveLength(1);
    expect(m!.qcGates[0].warn).toBe('70-80%');
    expect(m!.inputHint).toBe('FASTQ 目录');
  });

  it('required 缺省视为 true，显式 false 保留', () => {
    const m = sanitizeManifest({
      software: [{ name: 'a' }, { name: 'b', required: false }],
    });
    expect(m!.software[0].required).toBe(true);
    expect(m!.software[1].required).toBe(false);
  });

  it('空输入/无有效内容返回 undefined', () => {
    expect(sanitizeManifest(undefined)).toBeUndefined();
    expect(sanitizeManifest(null)).toBeUndefined();
    expect(sanitizeManifest('x')).toBeUndefined();
    expect(sanitizeManifest({ software: [], references: [], qcGates: [] })).toBeUndefined();
    expect(sanitizeManifest({ software: [{ name: '' }] })).toBeUndefined();
  });

  it('仅 inputHint 也构成有效 manifest', () => {
    const m = sanitizeManifest({ inputHint: '作业号' });
    expect(m).toBeDefined();
    expect(m!.software).toHaveLength(0);
  });
});
