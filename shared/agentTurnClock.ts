/** Count active execution separately from verified, in-stream human waits. */
export class AgentTurnClock {
  private readonly started: number;
  private pausedAt: number | undefined;
  private pausedMs = 0;
  private pending = new Set<string>();
  private stage = 'preparing';
  private stageAt: number;
  private lastTool = '';
  private lastEventAt: number;
  constructor(private now: () => number = Date.now) {
    this.started = this.stageAt = this.lastEventAt = now();
  }
  observe(event: any): void {
    const now = this.now();
    const previousStage = this.stage;
    this.lastEventAt = now;
    const id = typeof event?.id === 'string' ? event.id : '';
    if ((event.type === 'ask' || event.type === 'confirm' || event.type === 'plan_review') && id) {
      if (!this.pending.size) this.pausedAt = now;
      this.pending.add((event.type === 'ask' ? 'ask:' : event.type === 'confirm' ? 'confirm:' : 'plan_review:') + id);
      this.stage = event.type === 'ask' ? 'waiting_user' : 'waiting_approval';
    } else if ((event.type === 'ask_resolved' || event.type === 'confirm_resolved' || event.type === 'plan_review_resolved') && id) {
      this.pending.delete((event.type === 'ask_resolved' ? 'ask:' : event.type === 'confirm_resolved' ? 'confirm:' : 'plan_review:') + id);
      if (!this.pending.size && this.pausedAt !== undefined) {
        this.pausedMs += now - this.pausedAt; this.pausedAt = undefined; this.stage = 'resuming';
      } else if (this.pending.size) this.stage = [...this.pending][0].startsWith('ask:') ? 'waiting_user' : 'waiting_approval';
    } else if (!this.pending.size) {
      if (event.type === 'tool_call') {
        this.lastTool = String(event.name || '').replace(/[^\w.-]/g, '').slice(0, 80);
        this.stage = 'waiting_tool';
      } else if (event.type === 'tool_result') this.stage = 'waiting_model';
      else if (event.type === 'content' || event.type === 'reasoning') this.stage = 'generating';
      else if (event.type === 'status' && ['preparing', 'requesting', 'reconnecting'].includes(event.phase)) this.stage = event.phase;
    }
    if (this.stage !== previousStage || (event.type === 'tool_call' && !this.pending.size)) this.stageAt = now;
  }
  snapshot() {
    const now = this.now();
    const wallMs = now - this.started;
    const humanWaitMs = this.pausedMs + (this.pausedAt === undefined ? 0 : now - this.pausedAt);
    return { wallMs, activeMs: wallMs - humanWaitMs, humanWaitMs, waitingHuman: this.pending.size > 0,
      stage: this.stage, stageMs: now - this.stageAt, lastTool: this.lastTool, lastEventAgeMs: now - this.lastEventAt };
  }
}
