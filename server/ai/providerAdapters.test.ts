import { describe, expect, it } from 'vitest';
import { normalizeAIProfile, resolveOpenAIEndpoint } from './providerAdapters';

describe('provider adapter profile resolution', () => {
  it('normalizes legacy kimi provider to moonshot and keeps custom model names', () => {
    const profile = normalizeAIProfile({
      provider: 'kimi',
      model: 'moonshot-v1-auto',
      apiKey: 'key',
    });

    expect(profile.provider).toBe('moonshot');
    expect(profile.model).toBe('moonshot-v1-auto');
    expect(profile.apiKey).toBe('key');
  });

  it('uses custom OpenAI baseUrl without forcing a preset model', () => {
    const profile = normalizeAIProfile({
      provider: 'custom-openai',
      baseUrl: 'https://llm.example.com/v1',
      model: 'my/custom-model',
      apiKey: 'key',
    });

    expect(resolveOpenAIEndpoint(profile)).toBe('https://llm.example.com/v1/chat/completions');
    expect(profile.model).toBe('my/custom-model');
  });
});
