import type { UserQuestionAnswer, UserQuestionOption } from '../../shared/aiQuestions';
import { normalizeQuestionAnswer } from '../../shared/questionIntent';

type QuestionReason = 'answered' | 'cancelled' | 'expired' | 'unavailable';
type QuestionReceipt = { success: boolean; reason: QuestionReason; error?: string };

/** A reply belongs to one pending question, never to a new Agent prompt. */
export class UserQuestions {
  private pending = new Map<string, { options: string[]; multiSelect: boolean; requestId?: string;
    settle: (reason: QuestionReason, answer?: UserQuestionAnswer) => void }>();
  private settled = new Map<string, QuestionReason>();

  request(opts: { id: string; question: string; options: UserQuestionOption[]; multiSelect?: boolean;
    signal: AbortSignal; send: (event: any) => void; requestId?: string; timeoutMs?: number }): Promise<UserQuestionAnswer | null> {
    return new Promise(resolve => {
      const expiresAt = Date.now() + (opts.timeoutMs ?? 14 * 60_000);
      let finished = false;
      const settle = (reason: QuestionReason, answer?: UserQuestionAnswer) => {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        opts.signal.removeEventListener('abort', onAbort);
        this.pending.delete(opts.id);
        this.settled.set(opts.id, reason);
        if (this.settled.size > 256) this.settled.delete(this.settled.keys().next().value!);
        opts.send({ type: 'ask_resolved', id: opts.id, reason, answered: reason === 'answered',
          ...(answer ? { answer } : {}), requestId: opts.requestId });
        resolve(reason === 'answered' && answer ? answer : null);
      };
      const onAbort = () => settle('cancelled');
      const timer = setTimeout(() => settle('expired'), Math.max(1, expiresAt - Date.now()));
      timer.unref?.();
      this.pending.set(opts.id, { options: opts.options.map(option => option.label), multiSelect: opts.multiSelect === true, requestId: opts.requestId, settle });
      opts.signal.addEventListener('abort', onAbort, { once: true });
      if (opts.signal.aborted) { settle('cancelled'); return; }
      // Register before emitting: immediate replies must not be lost.
      opts.send({ type: 'ask', id: opts.id, question: opts.question, options: opts.options.map(option => option.label),
        optionDetails: opts.options, multiSelect: opts.multiSelect === true, source: 'dsh', expiresAt, requestId: opts.requestId });
    });
  }

  respond(id: string, input: unknown, cancelled = false): QuestionReceipt {
    const pending = this.pending.get(id);
    if (!pending) return { success: false, reason: this.settled.get(id) ?? 'unavailable', error: 'question_no_longer_pending' };
    if (cancelled) { pending.settle('cancelled'); return { success: true, reason: 'cancelled' }; }
    let answer: UserQuestionAnswer;
    if (typeof input === 'string') {
      const value = input.trim();
      answer = pending.options.includes(value) ? { selected: [value] } : { selected: [], custom: value };
    } else {
      const raw = input as Partial<UserQuestionAnswer> | null;
      if (!raw || !Array.isArray(raw.selected) || raw.selected.some(value => typeof value !== 'string')
        || (raw.intent !== undefined && raw.intent !== 'clarification')
        || (raw.custom !== undefined && typeof raw.custom !== 'string'))
        return { success: false, reason: 'unavailable', error: 'invalid_question_answer' };
      answer = { selected: [...new Set(raw.selected)], ...(raw.custom?.trim() ? { custom: raw.custom.trim() } : {}), ...(raw.intent ? { intent: raw.intent } : {}) };
    }
    if ((!answer.selected.length && !answer.custom) || answer.selected.some(value => !pending.options.includes(value))
      || (!pending.multiSelect && answer.selected.length > 1))
      return { success: false, reason: 'unavailable', error: 'invalid_question_answer' };
    answer = normalizeQuestionAnswer(answer);
    if (!answer.selected.length && !answer.custom) return { success: false, reason: 'unavailable', error: 'invalid_question_answer' };
    pending.settle('answered', answer);
    return { success: true, reason: 'answered' };
  }

  cancel(id: string): void { this.pending.get(id)?.settle('cancelled'); }

  /**
   * steer 兼容路径：AI 运行中用户插话时，若该请求正挂在一个反问上，
   * 把插话文本直接当作该反问的回答（自由文本语义与主输入框回答一致）。
   */
  respondForRequest(requestId: string, input: unknown): (QuestionReceipt & { id?: string }) {
    for (const [id, entry] of this.pending) {
      if (entry.requestId === requestId) {
        const receipt = this.respond(id, input);
        return { ...receipt, id };
      }
    }
    return { success: false, reason: 'unavailable', error: 'question_no_longer_pending' };
  }
}
