import { beforeEach, expect, it, vi } from 'vitest';
import { extractEvidenceInventory, learnWorkflowFromText, preparePaperContext } from './learnFromPaper';

const modelCall = vi.hoisted(() => vi.fn());
vi.mock('ai', async importOriginal => ({ ...await importOriginal<typeof import('ai')>(), generateText: modelCall }));
const profile = { provider: 'custom-openai' as const, model: 'fixture', apiKey: 'fixture-only' };
beforeEach(() => modelCall.mockReset().mockResolvedValue({ text: '{}', finishReason: 'stop' }));
it('sends paper context exactly once, not again inside the context metadata JSON', async () => {
  const text = 'Title\nMethods\nUNIQUE_METHOD_SENTENCE: Reads were mapped using BWA.';
  await learnWorkflowFromText(text, profile, null, preparePaperContext(text));
  const options = modelCall.mock.calls[0][0];
  expect(options.prompt.match(/UNIQUE_METHOD_SENTENCE/g)).toHaveLength(1);
  expect(options.abortSignal).toBeInstanceOf(AbortSignal);
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
