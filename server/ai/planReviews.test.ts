import { afterEach, describe, expect, it, vi } from 'vitest';
import { PlanReviews } from './planReviews';

afterEach(() => vi.useRealTimers());

function fixture(extra = {}) {
  const manager = new PlanReviews(), events: any[] = [];
  const abort = new AbortController();
  const promise = manager.request({
    id: 'pr1', goal: '质控并比对',
    steps: [
      { title: '运行 FastQC', verification: '生成 fastqc.html' },
      { title: '运行 bwa mem', verification: '生成 aligned.bam' },
    ],
    signal: abort.signal, send: event => events.push(event), requestId: 'req-1', ...extra,
  });
  return { manager, events, promise, abort };
}

describe('plan review pending store', () => {
  it('emits plan_review with goal and steps, then resolves approve', async () => {
    const { manager, events, promise } = fixture();
    expect(events[0]).toMatchObject({ type: 'plan_review', id: 'pr1', goal: '质控并比对', requestId: 'req-1' });
    expect(events[0].steps).toHaveLength(2);
    expect(manager.respond('pr1', { action: 'approve' })).toEqual({ success: true, reason: 'approved' });
    expect(await promise).toEqual({ action: 'approve', steps: undefined, reason: 'approved' });
    expect(events[1]).toMatchObject({ type: 'plan_review_resolved', id: 'pr1', reason: 'approved', action: 'approve' });
  });

  it('resolves edit with sanitized user steps and rejects invalid edits without consuming', async () => {
    const { manager, promise } = fixture();
    expect(manager.respond('pr1', { action: 'edit', steps: [{ title: '只跑 FastQC', verification: '' }] }))
      .toMatchObject({ success: false, error: 'invalid_plan_review_steps' });
    expect(manager.respond('pr1', { action: 'edit', steps: [{ title: '只跑 FastQC', verification: 'fastqc.html 存在' }] }))
      .toEqual({ success: true, reason: 'edited' });
    expect(await promise).toEqual({
      action: 'edit',
      steps: [{ title: '只跑 FastQC', verification: 'fastqc.html 存在' }],
      reason: 'edited',
    });
  });

  it('resolves cancel and keeps the receipt for late replies', async () => {
    const { manager, promise } = fixture();
    expect(manager.respond('pr1', { action: 'cancel' })).toEqual({ success: true, reason: 'cancelled' });
    expect(await promise).toEqual({ action: 'cancel', steps: undefined, reason: 'cancelled' });
    expect(manager.respond('pr1', { action: 'approve' })).toMatchObject({ success: false, reason: 'cancelled' });
  });

  it('rejects unknown actions and unknown ids', async () => {
    const { manager, promise, abort } = fixture();
    expect(manager.respond('pr1', { action: 'maybe' })).toMatchObject({ success: false, error: 'invalid_plan_review_action' });
    expect(manager.respond('nope', { action: 'approve' })).toMatchObject({ success: false, reason: 'unavailable' });
    abort.abort();
    expect(await promise).toBeNull();
  });

  it('expires silently and reports expiry to late responses', async () => {
    vi.useFakeTimers();
    const { manager, events, promise } = fixture({ timeoutMs: 50 });
    await vi.advanceTimersByTimeAsync(50);
    expect(await promise).toBeNull();
    expect(events[1]).toMatchObject({ type: 'plan_review_resolved', reason: 'expired' });
    expect(manager.respond('pr1', { action: 'approve' })).toMatchObject({ success: false, reason: 'expired' });
  });

  it('tracks pending reviews per request for the steer route', async () => {
    const { manager, promise } = fixture();
    expect(manager.hasPendingForRequest('req-1')).toBe(true);
    expect(manager.hasPendingForRequest('req-other')).toBe(false);
    manager.respond('pr1', { action: 'approve' });
    await promise;
    expect(manager.hasPendingForRequest('req-1')).toBe(false);
  });
});
