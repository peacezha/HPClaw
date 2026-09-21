import type { AIMessage, AIProfile, GatewayRequest, LegacyAIProvider, StreamEvent } from './types';

const DEFAULT_MODELS: Record<AIProfile['provider'], string> = {
  gemini: 'gemini-3.1-pro-preview',
  openai: 'gpt-4o-mini',
  deepseek: 'deepseek-v4-pro',
  grok: 'grok-2-latest',
  moonshot: 'moonshot-v1-32k',
  'custom-openai': 'gpt-4o-mini',
};

const DEFAULT_OPENAI_ENDPOINTS: Partial<Record<AIProfile['provider'], string>> = {
  openai: 'https://api.openai.com/v1/chat/completions',
  deepseek: 'https://api.deepseek.com/chat/completions',
  grok: 'https://api.x.ai/v1/chat/completions',
  moonshot: 'https://api.moonshot.cn/v1/chat/completions',
};

function normalizeProvider(provider: unknown): AIProfile['provider'] {
  const raw = String(provider || 'deepseek').toLowerCase() as LegacyAIProvider;
  if (raw === 'kimi') return 'moonshot';
  if (raw === 'gemini' || raw === 'openai' || raw === 'deepseek' || raw === 'grok' || raw === 'moonshot' || raw === 'custom-openai') {
    return raw;
  }
  return 'deepseek';
}

export function normalizeAIProfile(input: Partial<AIProfile> & { provider?: LegacyAIProvider | string } = {}): AIProfile {
  const provider = normalizeProvider(input.provider);
  return {
    provider,
    baseUrl: input.baseUrl?.trim() || undefined,
    model: input.model?.trim() || DEFAULT_MODELS[provider],
    apiKey: input.apiKey?.trim() || '',
    name: input.name?.trim() || undefined,
    temperature: typeof input.temperature === 'number' ? input.temperature : 0.1,
  };
}

export function resolveOpenAIEndpoint(profile: AIProfile): string {
  if (profile.provider === 'gemini') {
    throw new Error('Gemini does not use an OpenAI-compatible endpoint');
  }

  const rawBase = profile.provider === 'custom-openai'
    ? profile.baseUrl
    : (profile.baseUrl || DEFAULT_OPENAI_ENDPOINTS[profile.provider]);

  if (!rawBase) {
    throw new Error('Missing baseUrl for OpenAI-compatible provider');
  }

  const base = rawBase.replace(/\/+$/, '');
  if (/\/chat\/completions$/i.test(base)) return base;
  return `${base}/chat/completions`;
}

function normalizeOpenAIMessages(messages: AIMessage[]): AIMessage[] {
  return messages.map((msg, index) => {
    if (msg.role === 'system' && index > 0) {
      return { role: 'user', content: `[System Instruction]\n${msg.content}` };
    }
    return msg;
  });
}

function splitGeminiMessages(messages: AIMessage[]) {
  let systemInstruction = '';
  const contents: any[] = [];

  for (const msg of messages) {
    if (msg.role === 'system') {
      systemInstruction += `${msg.content}\n`;
    } else {
      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content || ' ' }],
      });
    }
  }

  return { systemInstruction: systemInstruction.trim() || undefined, contents };
}

function buildOpenAIBody(request: GatewayRequest, stream: boolean) {
  const body: any = {
    model: request.profile.model,
    messages: normalizeOpenAIMessages(request.messages),
    temperature: request.profile.temperature ?? 0.1,
    stream,
  };

  if (request.maxTokens) body.max_tokens = request.maxTokens;
  if (request.isFastMode && request.profile.provider === 'deepseek' && (body.model === 'deepseek-reasoner' || body.model === 'deepseek-v4-pro')) {
    body.model = 'deepseek-chat';
  }
  if (body.model === 'deepseek-reasoner' || body.model === 'deepseek-v4-pro') delete body.temperature;
  if (!stream) delete body.stream;
  return body;
}

export async function completeAI(request: GatewayRequest): Promise<any> {
  if (!request.profile.apiKey) throw new Error('Missing API Key');

  if (request.profile.provider === 'gemini') {
    const { GoogleGenAI, ThinkingLevel } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: request.profile.apiKey });
    const { systemInstruction, contents } = splitGeminiMessages(request.messages);
    const config: any = {
      systemInstruction,
      temperature: request.profile.temperature ?? 0.1,
    };
    if (request.isFastMode) config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };

    const response = await ai.models.generateContent({
      model: request.profile.model || DEFAULT_MODELS.gemini,
      contents,
      config,
    });

    return { choices: [{ message: { content: response.text || '' } }] };
  }

  const response = await fetch(resolveOpenAIEndpoint(request.profile), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${request.profile.apiKey}`,
    },
    body: JSON.stringify(buildOpenAIBody(request, false)),
    signal: request.signal,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `${request.profile.provider} API Error: ${response.status}`);
  }

  return response.json();
}

export async function streamAICompletion(
  request: GatewayRequest,
  onEvent: (event: StreamEvent) => void,
): Promise<void> {
  if (!request.profile.apiKey) throw new Error('Missing API Key');

  if (request.profile.provider === 'gemini') {
    const data = await completeAI(request);
    onEvent({ type: 'content', content: data.choices?.[0]?.message?.content || '' });
    onEvent({ type: 'done' });
    return;
  }

  const response = await fetch(resolveOpenAIEndpoint(request.profile), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${request.profile.apiKey}`,
    },
    body: JSON.stringify(buildOpenAIBody(request, true)),
    signal: request.signal,
  });

  if (!response.ok || !response.body) {
    const errText = await response.text().catch(() => '');
    throw new Error(errText || `${request.profile.provider} API Error: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;
        const data = trimmed.slice(6);
        if (data === '[DONE]') {
          onEvent({ type: 'done' });
          continue;
        }

        try {
          const parsed = JSON.parse(data);
          const delta = parsed.choices?.[0]?.delta;
          if (delta?.reasoning_content) onEvent({ type: 'reasoning', content: delta.reasoning_content });
          if (delta?.content) onEvent({ type: 'content', content: delta.content });
        } catch {
          // Ignore malformed provider chunks.
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export function extractAIText(data: any): string {
  const msg = data?.choices?.[0]?.message;
  if (!msg) return '';
  if (msg.reasoning_content) {
    return `<thought>\n${msg.reasoning_content}\n</thought>\n${msg.content || ''}`;
  }
  return msg.content || '';
}
