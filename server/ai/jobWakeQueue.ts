/**
 * Serialize wake-ups per conversation/RUN without losing a different job's completion.
 * Identical in-flight events are ignored; unrelated keys can run concurrently.
 * No command is retried here: only queued completion notifications are drained.
 */
export class JobWakeQueue {
  private readonly tails = new Map<string, Promise<void>>();
  private readonly pending = new Set<string>();

  async enqueue(key: string, eventId: string, work: () => Promise<void>): Promise<void> {
    const identity = JSON.stringify([key, eventId]);
    if (this.pending.has(identity)) return;
    this.pending.add(identity);
    const prior = this.tails.get(key) ?? Promise.resolve();
    const next = prior.catch(() => {}).then(work);
    this.tails.set(key, next);
    try {
      await next;
    } finally {
      this.pending.delete(identity);
      if (this.tails.get(key) === next) this.tails.delete(key);
    }
  }
}
