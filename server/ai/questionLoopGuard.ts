import type { UserQuestionAnswer } from '../../shared/aiQuestions';
import { clarificationInstruction, normalizeQuestionAnswer } from '../../shared/questionIntent';

function normalize(value: string): string {
  return value.normalize('NFKC').toLowerCase().replace(/\b\d+(?:\.\d+)?\s*(?:gib|gb|mib|mb)\b/g, '<file-size>')
    .replace(/[\s，,。.!！?？:：;；()（）❓]/g, '');
}
function grams(value: string): Set<string> {
  return new Set(Array.from({ length: Math.max(0, value.length - 2) }, (_, i) => value.slice(i, i + 3)));
}
function sameQuestion(a: string, b: string): boolean {
  const x = normalize(a), y = normalize(b);
  if (x === y) return true;
  // Preserve identifiers/coordinates: cancelling job 1 is never consent for job 2.
  const ids = (s: string) => [...s.matchAll(/\d{3,}|\/[\w./-]+|[\w.-]+\.(?:bam|fq|fastq|bed)/g)].map(m => m[0]).sort().join('|');
  if (ids(x) !== ids(y)) return false;
  const gx = grams(x), gy = grams(y);
  return gx.size > 10 && gy.size > 10 && 2 * [...gx].filter(g => gy.has(g)).length / (gx.size + gy.size) >= 0.76;
}

/** No automatic approvals: a blocked question yields a model correction only. */
export class QuestionLoopGuard {
  private epoch = 0;
  private snapshot = '';
  private questions: Array<{ question: string; epoch: number; answer?: UserQuestionAnswer }> = [];
  beginTurn(text: string): void {
    // A later explicit human instruction supersedes "explain first"; the
    // actual command still goes through the independent approval layer.
    if (/^(?:请(?:你)?|帮我|先)?(?:按|按照|选择|就用|直接修复|继续|执行|恢复)|^(?:please\s+)?(?:use|apply|continue|execute|resume)\b/i.test(text.trim())) {
      const last = this.questions[this.questions.length - 1];
      if (last?.answer?.intent === 'clarification') last.answer = { selected: [], custom: text };
    }
  }

  progress(): void { this.epoch++; }
  observeRun(run: any): boolean {
    const next = JSON.stringify({ step: run?.currentStep, steps: run?.steps?.map((s: any) => ({
      n: s.n, done: s.status === 'done' || s.status === 'skipped', jobs: s.jobIds, outputs: s.outputs,
    })) });
    const advanced = Boolean(this.snapshot && next !== this.snapshot);
    if (advanced) this.progress();
    this.snapshot = next;
    return advanced;
  }
  observeHistory(messages: Array<{ role: string; content: string }>): void {
    let question = '';
    for (const message of messages.slice(-12)) {
      if (message.role === 'assistant' && message.content.trim().startsWith('❓')) {
        question = message.content.trim().replace(/^❓\s*/, '');
      } else if (message.role === 'assistant') {
        // A later normal response closes the question/reply pair in history.
        question = '';
      } else if (question && message.role === 'user') {
        // Human replies are preserved verbatim; this is not runtime approval.
        const previous = [...this.questions].reverse().find(q => sameQuestion(q.question, question));
        if (previous && !previous.answer) previous.answer = normalizeQuestionAnswer({ selected: [], custom: message.content });
        if (!previous) {
          this.questions.push({ question, epoch: this.epoch, answer: normalizeQuestionAnswer({ selected: [], custom: message.content }) });
        }
        question = '';
      }
    }
    this.questions = this.questions.slice(-24);
  }
  decide(question: string, options: unknown, explainOnly = false): { allowed: boolean; feedback: string } {
    if (explainOnly) return { allowed: false, feedback: clarificationInstruction('Explain the existing question before asking the user to decide.') };
    const previous = [...this.questions].reverse().find(q => q.epoch === this.epoch && sameQuestion(q.question, question));
    if (previous) {
      return { allowed: false, feedback: previous.answer?.intent === 'clarification'
        ? clarificationInstruction(previous.answer.custom || 'Explain your options.')
        : '[TRACE_REPEAT_QUESTION_BLOCKED] This question has already been asked without intervening task progress. '
          + (previous.answer ? 'The human reply was: ' + JSON.stringify(previous.answer) + '. Use that reply; it is NOT permission to bypass command approvals. ' : '')
          + 'Do not repeat the question. Continue safe work already authorized by the user, or explain the exact unresolved input/decision and concrete alternatives. Never invent missing biological parameters or claim task completion.' };
    }
    const concrete = Array.isArray(options) && options.filter(Boolean).length >= 2;
    if (!concrete && /请选择.*(?:修复|方案|处理方式)|(?:如何|怎么)修复.*继续|choose.*(?:repair|recovery).*|select.*(?:repair|recovery).*/i.test(question)) {
      return { allowed: false, feedback: '[TRACE_VAGUE_CHOICE_BLOCKED] No concrete repair alternatives were provided. Diagnose with read-only tools and explain the recommended repair and its evidence. Use safe existing task authorization when sufficient; ask only for a genuinely missing input/scientific decision, with concrete choices. Do not create generic "continue" options or assume approval.' };
    }
    this.questions.push({ question, epoch: this.epoch });
    this.questions = this.questions.slice(-24);
    return { allowed: true, feedback: '' };
  }
  answer(question: string, answer: UserQuestionAnswer): void {
    const record = [...this.questions].reverse().find(q => sameQuestion(q.question, question));
    if (record) record.answer = normalizeQuestionAnswer(answer);
  }
}

const scopes = new Map<string, { guard: QuestionLoopGuard; touched: number }>();
export function getQuestionLoopGuard(scope?: string): QuestionLoopGuard {
  if (!scope) return new QuestionLoopGuard();
  const previous = scopes.get(scope);
  const entry = previous && Date.now() - previous.touched < 24 * 60 * 60_000
    ? previous : { guard: new QuestionLoopGuard(), touched: Date.now() };
  entry.touched = Date.now(); scopes.delete(scope); scopes.set(scope, entry);
  while (scopes.size > 512) scopes.delete(scopes.keys().next().value!);
  return entry.guard;
}
export function clearQuestionLoopGuards(): void { scopes.clear(); }
