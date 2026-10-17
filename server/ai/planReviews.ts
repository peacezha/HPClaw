import crypto from 'node:crypto';

export type PlanReviewAction = 'approve' | 'edit' | 'cancel';
export type PlanReviewReason = 'approved' | 'edited' | 'cancelled' | 'expired' | 'unavailable';
export interface PlanReviewStep { title: string; verification: string }
export interface PlanReviewDecision { action: PlanReviewAction; steps?: PlanReviewStep[]; reason: PlanReviewReason }
type PlanReviewReceipt = { success: boolean; reason: PlanReviewReason; error?: string };

const MAX_REVIEW_STEPS = 12;

function sanitizeReviewSteps(input: unknown): PlanReviewStep[] | null {
  if (!Array.isArray(input) || input.length === 0 || input.length > MAX_REVIEW_STEPS) return null;
  const steps = input.map(item => ({
    title: String((item as PlanReviewStep)?.title || '').trim().slice(0, 300),
    verification: String((item as PlanReviewStep)?.verification || '').trim().slice(0, 500),
  }));
  return steps.every(step => step.title && step.verification) ? steps : null;
}

/**
 * 计划审批挂起存储：与 CommandApprovals/UserQuestions 同款一次性挂起语义。
 * set_plan 之后、执行之前等待用户批准/编辑/取消；审批事件走同一条 SSE 流，
 * 决定经 POST /api/ai/plan-review 到达。缺席、过期或取消都不视为用户拒绝。
 */
export class PlanReviews {
  private pending = new Map<string, {
    requestId?: string;
    settle: (reason: PlanReviewReason, decision?: { action: PlanReviewAction; steps?: PlanReviewStep[] }) => void;
  }>();
  private settled = new Map<string, PlanReviewReason>();

  request(opts: {
    id: string; goal: string; steps: PlanReviewStep[];
    signal: AbortSignal; send: (event: any) => void; requestId?: string; timeoutMs?: number;
  }): Promise<PlanReviewDecision | null> {
    return new Promise(resolve => {
      const expiresAt = Date.now() + (opts.timeoutMs ?? 14 * 60_000);
      let finished = false;
      const settle = (reason: PlanReviewReason, decision?: { action: PlanReviewAction; steps?: PlanReviewStep[] }) => {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        opts.signal.removeEventListener('abort', onAbort);
        this.pending.delete(opts.id);
        this.settled.set(opts.id, reason);
        if (this.settled.size > 256) this.settled.delete(this.settled.keys().next().value!);
        opts.send({
          type: 'plan_review_resolved', id: opts.id, reason,
          ...(decision ? { action: decision.action } : {}),
          requestId: opts.requestId,
        });
        if (!decision) { resolve(null); return; }
        resolve({ action: decision.action, steps: decision.steps, reason });
      };
      const onAbort = () => settle('cancelled');
      const timer = setTimeout(() => settle('expired'), Math.max(1, expiresAt - Date.now()));
      timer.unref?.();
      // 先注册再下发：立即送达的批准也不能丢失（与 CommandApprovals 同序）。
      this.pending.set(opts.id, { requestId: opts.requestId, settle });
      opts.signal.addEventListener('abort', onAbort, { once: true });
      if (opts.signal.aborted) { settle('cancelled'); return; }
      opts.send({
        type: 'plan_review', id: opts.id, goal: opts.goal,
        steps: opts.steps.map(step => ({ title: step.title, verification: step.verification })),
        expiresAt, requestId: opts.requestId,
      });
    });
  }

  respond(id: string, input: unknown): PlanReviewReceipt {
    const pending = this.pending.get(id);
    if (!pending) return { success: false, reason: this.settled.get(id) ?? 'unavailable', error: 'plan_review_no_longer_pending' };
    const raw = input && typeof input === 'object' ? input as { action?: unknown; steps?: unknown } : {};
    const action = raw.action;
    if (action !== 'approve' && action !== 'edit' && action !== 'cancel') {
      return { success: false, reason: 'unavailable', error: 'invalid_plan_review_action' };
    }
    if (action === 'approve') {
      pending.settle('approved', { action: 'approve' });
      return { success: true, reason: 'approved' };
    }
    if (action === 'cancel') {
      pending.settle('cancelled', { action: 'cancel' });
      return { success: true, reason: 'cancelled' };
    }
    const steps = sanitizeReviewSteps(raw.steps);
    if (!steps) return { success: false, reason: 'unavailable', error: 'invalid_plan_review_steps' };
    pending.settle('edited', { action: 'edit', steps });
    return { success: true, reason: 'edited' };
  }

  cancel(id: string): void { this.pending.get(id)?.settle('cancelled'); }

  /** steer 等路由需要判断某个在途请求是否正挂在计划审批上。 */
  hasPendingForRequest(requestId: string): boolean {
    for (const entry of this.pending.values()) {
      if (entry.requestId === requestId) return true;
    }
    return false;
  }
}

export function createPlanReviewId(): string {
  return `plan-review-${crypto.randomBytes(6).toString('hex')}`;
}
