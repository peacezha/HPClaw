import type { UserQuestionAnswer, UserQuestionOption } from '../../shared/aiQuestions';

type QuestionReason = 'answered' | 'cancelled' | 'expired' | 'unavailable';
type QuestionReceipt = { success: boolean; reason: QuestionReason; error?: string };

/** A reply belongs to one pending question, never to a new Agent prompt. */
export class UserQuestions {
  private pending = new Map<string, { options: string[]; multiSelect: boolean;
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
      this.pending.set(opts.id, { options: opts.options.map(option => option.label), multiSelect: opts.multiSelect === true, settle });
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
        || (raw.custom !== undefined && typeof raw.custom !== 'string'))
        return { success: false, reason: 'unavailable', error: 'invalid_question_answer' };
      answer = { selected: [...new Set(raw.selected)], ...(raw.custom?.trim() ? { custom: raw.custom.trim() } : {}) };
    }
    if ((!answer.selected.length && !answer.custom) || answer.selected.some(value => !pending.options.includes(value))
      || (!pending.multiSelect && answer.selected.length > 1))
      return { success: false, reason: 'unavailable', error: 'invalid_question_answer' };
    pending.settle('answered', answer);
    return { success: true, reason: 'answered' };
  }

  cancel(id: string): void { this.pending.get(id)?.settle('cancelled'); }
}
