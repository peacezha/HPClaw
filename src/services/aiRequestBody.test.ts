import { describe, expect, it } from 'vitest';
import { prepareAiRequestBody } from './aiRequestBody';

describe('prepareAiRequestBody', () => {
  it('keeps small AI stream requests as plain JSON to avoid proxy gzip-body aborts', async () => {
    const payload = {
      profile: { provider: 'deepseek', model: 'deepseek-reasoner', apiKey: 'test' },
      messages: [{ role: 'user', content: 'generate lsf scripts' }],
      mode: 'agent',
    };

    const prepared = await prepareAiRequestBody(payload);

    expect(prepared.compressed).toBe(false);
    expect(prepared.headers).toEqual({ 'Content-Type': 'application/json' });
    expect(new TextDecoder().decode(prepared.body)).toBe(JSON.stringify(payload));
  });
});
