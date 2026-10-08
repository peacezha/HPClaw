import { afterEach, expect, it, vi } from 'vitest';
import { generateText } from 'ai';
import { buildModel } from '../ai/agentRunner';
import { paperModelOptions } from './learnFromPaper';
afterEach(() => vi.unstubAllGlobals());
it('serializes reasoning_effort=none in the actual DeepSeek-compatible SDK request, using mocked transport only', async () => {
  const transport = vi.fn(async (_url: any, options: any) => {
    const body = JSON.parse(options.body);
    expect(body.model).toBe('deepseek-flash');
    expect(body.reasoning_effort).toBe('none');
    expect(body.max_tokens).toBe(8000);
    return new Response(JSON.stringify({ id: 'fixture', created: 1, model: 'deepseek-flash',
      choices: [{ index: 0, message: { role: 'assistant', content: '{}' }, finish_reason: 'stop' }],
      usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 } }), { headers: { 'Content-Type': 'application/json' } });
  });
  vi.stubGlobal('fetch', transport);
  const profile = { provider: 'deepseek' as const, model: 'deepseek-flash', apiKey: 'fixture-transport-only' };
  const result = await generateText({ model: buildModel(profile), prompt: 'fixture', ...paperModelOptions(profile, 8000), maxRetries: 0 });
  expect(result.text).toBe('{}');
  expect(transport).toHaveBeenCalledOnce();
});
