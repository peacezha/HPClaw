import type { AIMessage, KeyFact, StructuredMemory } from './types';

export interface ConversationWithMemory {
  messages?: AIMessage[];
  summary?: string;
  memory?: string;
  skillHints?: string[];
  structuredMemory?: StructuredMemory;
  [key: string]: any;
}

const PATH_OR_JOB = /(?:[A-Za-z]:\\[^\s"'<>|]{3,}|\/(?:[^\s"'<>|/]+\/)+[^\s"'<>|]*|\b(?:Job\s*<|job(?:\s*id)?\s*[:#=]?|作业(?:号|ID)?\s*[:#=]?)\s*\d+)/i;
const DECISION = /(?:决定|选择|采用|改用|确认|保持|不要|必须|优先|prefer|choose|decid|use\b|must\b)/i;
const ERROR = /(?:报错|失败|异常|超时|内存不足|权限|不存在|error|failed|exception|timeout|out of memory|permission denied|not found)/i;
const RESULT = /(?:完成|成功|通过|产出|结果|提交|已写入|已生成|done|success|passed|created|submitted)/i;
const METHOD = /(?:参数|命令|流程|方法|模型|队列|线程|内存|版本|工具|软件|parameter|command|pipeline|model|queue|thread|memory|version|tool)/i;

function clean(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function clip(value: string, maxChars: number): string {
  const compact = clean(value);
  return compact.length > maxChars ? `${compact.slice(0, Math.max(0, maxChars - 3))}...` : compact;
}

function meaningfulMessages(messages: AIMessage[]): AIMessage[] {
  return messages.filter(msg => msg.role !== 'system' && clean(msg.content || ''));
}

function uniqueByText<T>(items: T[], text: (item: T) => string, limit: number): T[] {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const item of items) {
    const key = clean(text(item)).toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(item);
    if (result.length >= limit) break;
  }
  return result;
}

function uniqueLatestByText<T>(items: T[], text: (item: T) => string, limit: number): T[] {
  return uniqueByText([...items].reverse(), text, limit).reverse();
}

function taskFromMessages(messages: AIMessage[]): string {
  const users = meaningfulMessages(messages).filter(msg => msg.role === 'user');
  if (users.length === 0) return '';
  // A conversation is an isolation boundary. Preserve its original goal and let
  // the recent-turn section carry later refinements instead of silently replacing it.
  return clip(users[0].content, 320);
}

function salientMessages(messages: AIMessage[]): AIMessage[] {
  const useful = meaningfulMessages(messages);
  const highSignal = useful.filter(msg => PATH_OR_JOB.test(msg.content) || DECISION.test(msg.content)
    || ERROR.test(msg.content) || RESULT.test(msg.content));
  const initialGoal = useful.find(msg => msg.role === 'user');
  return uniqueByText(
    [...(initialGoal ? [initialGoal] : []), ...highSignal.slice(-8), ...useful.slice(-10)],
    item => `${item.role}:${item.content}`,
    14,
  );
}

export function summarizeConversation(messages: AIMessage[] = [], maxChars = 1_200): string {
  const task = taskFromMessages(messages);
  const recent = meaningfulMessages(messages).slice(-8);
  const lines: string[] = [];
  if (task) lines.push(`目标: ${task}`);
  for (const msg of recent) {
    lines.push(`${msg.role === 'user' ? '用户' : '助手'}: ${clip(msg.content, 240)}`);
  }
  const summary = uniqueByText(lines, line => line, 10).join('\n');
  return summary.length > maxChars ? `${summary.slice(0, Math.max(0, maxChars - 3))}...` : summary;
}

function inferFactCategory(text: string): KeyFact['category'] {
  if (RESULT.test(text)) return 'result';
  if (DECISION.test(text)) return 'preference';
  if (METHOD.test(text)) return 'method';
  if (PATH_OR_JOB.test(text)) return 'environment';
  return 'data';
}

export function buildStructuredConversationMemory(messages: AIMessage[] = []): StructuredMemory {
  const useful = meaningfulMessages(messages);
  const facts = uniqueByText(
    salientMessages(messages)
      .filter(msg => PATH_OR_JOB.test(msg.content) || DECISION.test(msg.content) || ERROR.test(msg.content) || RESULT.test(msg.content))
      .map(msg => ({
        category: inferFactCategory(msg.content),
        fact: `${msg.role === 'user' ? '用户' : '助手'}: ${clip(msg.content, 260)}`,
        timestamp: Date.now(),
      } satisfies KeyFact)),
    fact => fact.fact,
    16,
  );

  const decisions = uniqueByText(
    useful
      .filter(msg => DECISION.test(msg.content))
      .slice(-8)
      .map(msg => ({
        what: clip(msg.content, 220),
        why: msg.role === 'user' ? '用户明确指定' : '对话中已确认',
      })),
    decision => decision.what,
    6,
  );

  const errors = uniqueByText(
    useful
      .map((msg, index) => ({ msg, index }))
      .filter(({ msg }) => ERROR.test(msg.content))
      .slice(-5)
      .map(({ msg, index }) => {
        const next = useful.slice(index + 1).find(item => item.role === 'assistant');
        return {
          error: clip(msg.content, 180),
          resolution: next && (RESULT.test(next.content) || /(?:修复|解决|改为|原因|fix|resolv)/i.test(next.content))
            ? clip(next.content, 220)
            : '尚无已验证的解决记录',
        };
      }),
    item => item.error,
    4,
  );

  const assistants = useful.filter(msg => msg.role === 'assistant');
  return {
    task: taskFromMessages(messages),
    progress: {
      phase: Math.max(1, useful.filter(msg => msg.role === 'user').length),
      description: assistants.length > 0 ? clip(assistants[assistants.length - 1].content, 240) : '等待开始',
      completed: assistants.length,
    },
    keyFacts: facts,
    decisions,
    skillsUsed: extractSkillHints(messages),
    errors,
    generatedAt: Date.now(),
  };
}

function mergeStructuredMemory(existing: StructuredMemory | undefined, incoming: StructuredMemory): StructuredMemory {
  if (!existing) return incoming;
  return {
    task: incoming.task || existing.task,
    progress: incoming.progress.description ? incoming.progress : existing.progress,
    keyFacts: uniqueLatestByText([...existing.keyFacts, ...incoming.keyFacts], fact => fact.fact, 20),
    decisions: uniqueLatestByText([...existing.decisions, ...incoming.decisions], decision => decision.what, 10),
    skillsUsed: [...new Set([...existing.skillsUsed, ...incoming.skillsUsed])].slice(0, 20),
    errors: uniqueLatestByText([...existing.errors, ...incoming.errors], error => error.error, 6),
    generatedAt: Date.now(),
  };
}

function formatPersistentMemory(messages: AIMessage[], memory: StructuredMemory, maxChars = 2_400): string {
  const lines: string[] = [];
  if (memory.task) lines.push(`当前目标: ${memory.task}`);
  if (memory.keyFacts.length > 0) {
    lines.push('已确认事实:');
    for (const fact of memory.keyFacts.slice(-10)) lines.push(`- [${fact.category}] ${fact.fact}`);
  }
  if (memory.decisions.length > 0) {
    lines.push('已确认决策:');
    for (const decision of memory.decisions.slice(-5)) lines.push(`- ${decision.what}（${decision.why}）`);
  }
  lines.push('最近进展:', summarizeConversation(messages, 1_000));
  const result = lines.filter(Boolean).join('\n');
  return result.length > maxChars ? `${result.slice(0, Math.max(0, maxChars - 3))}...` : result;
}

export function extractSkillHints(messages: AIMessage[] = []): string[] {
  const hints = new Set<string>();
  for (const msg of messages) {
    const text = msg.content || '';
    for (const match of text.matchAll(/<search_skill>([\s\S]*?)<\/search_skill>/g)) {
      const value = clean(match[1]).slice(0, 80);
      if (value) hints.add(value);
    }
    for (const match of text.matchAll(/\b(?:fastqc|multiqc|bsub|sbatch|samtools|bcftools|blast|rnaseq|RNA-seq|lsf|slurm|nextflow|snakemake)\b/gi)) {
      hints.add(match[0].toLowerCase());
    }
  }
  return [...hints].slice(0, 20);
}

export function mergeConversationMemory<T extends ConversationWithMemory>(conversation: T): T & Required<Pick<ConversationWithMemory, 'summary' | 'memory' | 'skillHints' | 'structuredMemory'>> {
  const messages = conversation.messages || [];
  const structuredMemory = mergeStructuredMemory(
    conversation.structuredMemory,
    buildStructuredConversationMemory(messages),
  );
  return {
    ...conversation,
    summary: summarizeConversation(messages),
    memory: formatPersistentMemory(messages, structuredMemory),
    skillHints: structuredMemory.skillsUsed,
    structuredMemory,
  };
}
