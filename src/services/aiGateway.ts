import { AIProfile } from './aiProfile';
import { getStoredLocale } from '../i18n';

export interface GatewayMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface StreamCallbacks {
  onReasoning: (text: string) => void;
  onContent: (text: string) => void;
  onDone: () => void;
  onError: (err: string) => void;
}

export interface Suggestion {
  completion: string;
  explanation: string;
}

export async function requestGatewayAutocomplete(
  command: string,
  profile: AIProfile,
  signal?: AbortSignal,
  context: { history?: string[] } = {},
): Promise<Suggestion[]> {
  const res = await fetch('/api/ai/autocomplete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command, profile, history: context.history || [], locale: getStoredLocale() }),
    signal,
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.suggestions || [];
}

export async function analyzeOutputWithGateway(text: string, profile: AIProfile): Promise<string> {
  const res = await fetch('/api/ai/analyze-output', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, profile, locale: getStoredLocale() }),
  });
  if (!res.ok) throw new Error('分析请求失败');
  const data = await res.json();
  return data.analysis || '无法分析该输出';
}
