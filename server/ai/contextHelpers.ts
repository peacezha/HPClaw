import type { AIProfile, AIMessage } from './types';
import { normalizeAIProfile } from './providerAdapters';

export function profileFromBody(body: any): AIProfile {
  return normalizeAIProfile(body.profile || {
    provider: body.provider,
    baseUrl: body.baseUrl,
    model: body.model,
    apiKey: body.apiKey,
    temperature: body.temperature,
  });
}

export function messagesFromBody(body: any): AIMessage[] {
  return (body.messages || []).map((m: any) => ({
    role: m.role || 'user',
    content: m.content || '',
  }));
}
