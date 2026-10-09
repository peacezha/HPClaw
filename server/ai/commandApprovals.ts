export type ApprovalReason = 'allowed' | 'rejected' | 'expired' | 'cancelled' | 'unavailable';
export interface ApprovalDecision { approved: boolean; reason: ApprovalReason }
interface PendingApproval { settle: (reason: ApprovalReason) => void }

/** One decision per exact command; absence of an answer is never a user rejection. */
export class CommandApprovals {
  private pending = new Map<string, PendingApproval>();
  private settled = new Map<string, ApprovalDecision>();

  request(opts: {
    id: string; command: string; risk?: string; title?: string; signal: AbortSignal;
    requestId?: string; send: (event: any) => void; timeoutMs?: number;
  }): Promise<ApprovalDecision> {
    return new Promise(resolve => {
      const expiresAt = Date.now() + (opts.timeoutMs ?? 14 * 60_000);
      let finished = false;
      const settle = (reason: ApprovalReason) => {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        opts.signal.removeEventListener('abort', onAbort);
        this.pending.delete(opts.id);
        const decision = { approved: reason === 'allowed', reason };
        this.settled.set(opts.id, decision);
        if (this.settled.size > 256) this.settled.delete(this.settled.keys().next().value!);
        // A delivery receipt is not execution success. The runner validates actual output separately.
        opts.send({ type: 'confirm_resolved', id: opts.id, reason, approved: decision.approved, requestId: opts.requestId });
        resolve(decision);
      };
      const onAbort = () => settle('cancelled');
      const timer = setTimeout(() => settle('expired'), Math.max(1, expiresAt - Date.now()));
      timer.unref?.();
      this.pending.set(opts.id, { settle }); // Register BEFORE emitting (including immediate replies).
      opts.signal.addEventListener('abort', onAbort, { once: true });
      if (opts.signal.aborted) { settle('cancelled'); return; }
      opts.send({ type: 'confirm', id: opts.id, command: opts.command, risk: opts.risk,
        title: opts.title, expiresAt, requestId: opts.requestId });
    });
  }

  respond(id: string, approved: boolean): { success: boolean; reason?: ApprovalReason } {
    const pending = this.pending.get(id);
    if (!pending) return { success: false, reason: this.settled.get(id)?.reason ?? 'unavailable' };
    pending.settle(approved ? 'allowed' : 'rejected');
    return { success: true, reason: approved ? 'allowed' : 'rejected' };
  }

  cancel(id: string): void { this.pending.get(id)?.settle('cancelled'); }
}
