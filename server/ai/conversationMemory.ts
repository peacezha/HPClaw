import type { AIMessage } from './types';

export interface ConversationWithMemory {
  messages?: AIMessage[];
  summary?: string;
  memory?: string;
  skillHints?: string[];
  [key: string]: any;
}

function clean(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

export function summarizeConversation(messages: AIMessage[] = [], maxChars = 480): string {
  const useful = messages
    .filter(msg => msg.role !== 'system' && msg.content)
    .slice(-8)
    .map(msg => `${msg.role}: ${clean(msg.content).slice(0, 180)}`);

  const summary = useful.join(' | ');
  return summary.length > maxChars ? `${summary.slice(0, maxChars)}...` : summary;
}

export function extractSkillHints(messages: AIMessage[] = []): string[] {
  const hints = new Set<string>();
  for (const msg of messages) {
    const text = msg.content || '';
    for (const match of text.matchAll(/<search_skill>([\s\S]*?)<\/search_skill>/g)) {
      const value = clean(match[1]).slice(0, 80);
      if (value) hints.add(value);
    }
    for (const match of text.matchAll(/\b(?:fastqc|multiqc|bsub|samtools|blast|rnaseq|RNA-seq|lsf)\b/gi)) {
      hints.add(match[0].toLowerCase());
    }
  }
  return [...hints].slice(0, 12);
}

export function mergeConversationMemory<T extends ConversationWithMemory>(conversation: T): T & Required<Pick<ConversationWithMemory, 'summary' | 'memory' | 'skillHints'>> {
  const messages = conversation.messages || [];
  return {
    ...conversation,
    summary: summarizeConversation(messages),
    memory: summarizeConversation(messages, 900),
    skillHints: extractSkillHints(messages),
  };
}
