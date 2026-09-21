import { describe, expect, it } from 'vitest';
import { ensureUserChoiceOptions, isManualInputChoice, isPathPickerChoice } from './askOptions';

describe('ask option fallback', () => {
  it('keeps two or more model-provided choices unchanged', () => {
    expect(ensureUserChoiceOptions('选择队列', ['normal', 'smp'])).toEqual(['normal', 'smp']);
  });

  it('offers a real picker and manual entry for missing paths', () => {
    const choices = ensureUserChoiceOptions('请选择输入数据目录', []);
    expect(choices).toEqual(['选择文件或目录', '手动输入路径', '先暂停任务']);
    expect(isPathPickerChoice(choices[0])).toBe(true);
    expect(isManualInputChoice(choices[1])).toBe(true);
  });

  it('answers yes/no questions with explicit yes and no choices', () => {
    expect(ensureUserChoiceOptions('是否按推荐配置继续执行？', undefined))
      .toEqual(['是，继续', '否，先不做', '先暂停任务']);
    expect(ensureUserChoiceOptions('结果正常吗？', []))
      .toEqual(['是，继续', '否，先不做', '先暂停任务']);
    expect(ensureUserChoiceOptions('输出目录用 results 可以吗', []))
      .toEqual(['是，继续', '否，先不做', '先暂停任务']);
    expect(ensureUserChoiceOptions('Should I resubmit the job?', [], 'en-US'))
      .toEqual(['Yes, continue', 'No, skip for now', 'Pause this task']);
  });

  it('extracts quoted candidates from the question itself', () => {
    expect(ensureUserChoiceOptions('使用哪个队列：`normal`、`q2680v2` 还是 `smp`？', []))
      .toEqual(['normal', 'q2680v2', 'smp', '我来补充信息']);
    expect(ensureUserChoiceOptions('参考基因组用 "hg19" 还是 "hg38"？', []))
      .toEqual(['hg19', 'hg38', '我来补充信息']);
    expect(ensureUserChoiceOptions('选 ‘normal’ 或 ‘gpu’ 队列？', []))
      .toEqual(['normal', 'gpu', '我来补充信息']);
  });

  it('extracts enumerated lists without quotes, in Chinese and English', () => {
    expect(ensureUserChoiceOptions('队列选 normal、smp 还是 gpu？', []))
      .toEqual(['normal', 'smp', 'gpu', '我来补充信息']);
    expect(ensureUserChoiceOptions('输出格式用 BAM/CRAM？', []))
      .toEqual(['BAM', 'CRAM', '我来补充信息']);
    expect(ensureUserChoiceOptions('Which queue should I use: normal or smp?', [], 'en-US'))
      .toEqual(['normal', 'smp', 'Add details manually']);
    expect(ensureUserChoiceOptions('Which reference should I use: `hg19`、`hg38` 还是 `mm10`?', [], 'en-US'))
      .toEqual(['hg19', 'hg38', 'mm10', 'Add details manually']);
  });

  it('prefers enumerated choices over yes/no and quantity fallbacks', () => {
    expect(ensureUserChoiceOptions('参考基因组是 hg19、hg38 还是 mm10？', []))
      .toEqual(['hg19', 'hg38', 'mm10', '我来补充信息']);
    expect(ensureUserChoiceOptions('内存给 64 还是 128？', []))
      .toEqual(['64', '128', '我来补充信息']);
  });

  it('offers numeric tiers and a custom entry for quantity questions', () => {
    expect(ensureUserChoiceOptions('这个作业需要多少核？', []))
      .toEqual(['1', '4', '8', '16', '自定义输入']);
    expect(ensureUserChoiceOptions('参考基因组 hg38 需要多少内存？', []))
      .toEqual(['1', '4', '8', '16', '自定义输入']);
    expect(ensureUserChoiceOptions('How many threads should I use?', [], 'en-US'))
      .toEqual(['1', '4', '8', '16', 'Enter a custom value']);
    const choices = ensureUserChoiceOptions('这个作业需要多少核？', []);
    expect(isManualInputChoice(choices[choices.length - 1])).toBe(true);
  });

  it('reuses quantity candidates already mentioned in the question', () => {
    expect(ensureUserChoiceOptions('这个任务队列上限 512 核，申请多少核？', []))
      .toEqual(['512', '自定义输入']);
  });

  it('keeps failure, confirmation and default fallbacks', () => {
    expect(ensureUserChoiceOptions('The command failed. What next?', [], 'en-US'))
      .toEqual(['Apply suggested fix', 'Add details manually', 'Pause this task']);
    expect(ensureUserChoiceOptions('命令执行失败，报错提示超时，怎么办？', []))
      .toEqual(['按建议修复并继续', '我来补充信息', '先暂停任务']);
    expect(ensureUserChoiceOptions('请确认提交参数', []))
      .toEqual(['按推荐方案继续', '暂不执行', '先暂停任务']);
    expect(ensureUserChoiceOptions('接下来你想怎么处理这个结果？', []))
      .toEqual(['按推荐方案继续', '我来补充信息', '先暂停任务']);
  });
});
