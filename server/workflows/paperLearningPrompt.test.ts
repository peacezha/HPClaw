import { beforeEach, expect, it, vi } from 'vitest';
import { extractEvidenceInventory, learnWorkflowFromText, preparePaperContext, paperModelOptions } from './learnFromPaper';

const modelCall = vi.hoisted(() => vi.fn());
vi.mock('ai', async importOriginal => ({ ...await importOriginal<typeof import('ai')>(), generateText: modelCall }));
const profile = { provider: 'custom-openai' as const, model: 'fixture', apiKey: 'fixture-only' };
beforeEach(() => modelCall.mockReset().mockResolvedValue({ text: '{}', finishReason: 'stop' }));
it('sends paper context exactly once, not again inside the context metadata JSON', async () => {
  const text = 'Title\nMethods\nUNIQUE_METHOD_SENTENCE: Reads were mapped using BWA.';
  await learnWorkflowFromText(text, profile, null, preparePaperContext(text));
  const options = modelCall.mock.calls[0][0];
  expect(options.prompt.split('【分析证据】')[0].match(/UNIQUE_METHOD_SENTENCE/g)).toHaveLength(1);
  expect(options.abortSignal).toBeInstanceOf(AbortSignal);
});
it('explicitly disables hidden thinking for Flash/V4 structured extraction, not for other providers', () => {
  expect(paperModelOptions({ ...profile, provider: 'deepseek', model: 'deepseek-flash' }, 8000))
    .toEqual({ maxOutputTokens: 8000, providerOptions: { deepseek: { reasoningEffort: 'none' } } });
  expect(paperModelOptions({ ...profile, model: 'other' }, 6000)).toEqual({ maxOutputTokens: 6000 });
});
it('retains partial evidence and rejects ungrounded source sentences from the model', async () => {
  const text = 'Reads were mapped using BWA. Mapping quality below 20 was removed.';
  modelCall.mockResolvedValue({ text: JSON.stringify({ stepsMentioned: [
    { id: 'S1', what: 'Mapping', sentence: 'Reads were mapped using BWA.' },
    { id: 'S2', what: 'Wrong', sentence: 'Reads were mapped using an invented aligner.' },
  ] }), finishReason: 'stop' });
  const result = await extractEvidenceInventory(text, profile);
  expect(result.inventory?.stepsMentioned).toHaveLength(1);
  expect(result.inventory?.tools).toEqual([]);
});
it('preserves prior chunks and distinct parameters from the same source sentence when a later chunk fails', async () => {
  const quote = 'Reads were trimmed with fastp -q 20 and -l 30.';
  modelCall.mockResolvedValueOnce({ text: JSON.stringify({ parameters: [
    { id: 'P1', name: '-q', value: '20', sentence: quote },
    { id: 'P2', name: '-l', value: '30', sentence: quote },
  ] }), finishReason: 'stop' }).mockRejectedValueOnce(new Error('fixture offline'));
  const result = await extractEvidenceInventory(quote + ' '.repeat(12500), profile);
  expect(result.inventory?.parameters.map(item => item.value)).toEqual(['20', '30']);
  expect(result.warnings?.some(warning => warning.includes('提取失败'))).toBe(true);
});
