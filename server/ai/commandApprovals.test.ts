import { afterEach, describe, expect, it, vi } from 'vitest';
import { CommandApprovals } from './commandApprovals';
afterEach(() => vi.useRealTimers());
describe('command approval decisions', () => {
  it('registers before emitting, acknowledges once and never replays an expired command', async () => {
    const approvals = new CommandApprovals();
    const sent: any[] = [];
    const promise = approvals.request({ id: 'a1', command: 'bkill 123', risk: 'destructive', signal: new AbortController().signal,
      send: event => { sent.push(event); if (event.type === 'confirm') expect(approvals.respond('a1', true).success).toBe(true); } });
    expect(await promise).toEqual({ approved: true, reason: 'allowed' });
    expect(sent.map(e => e.type)).toEqual(['confirm', 'confirm_resolved']);
    expect(approvals.respond('a1', true)).toEqual({ success: false, reason: 'allowed' });
  });
  it('timeout is expired, not rejected; a late allow cannot execute anything', async () => {
    vi.useFakeTimers();
    const approvals = new CommandApprovals(); const send = vi.fn();
    const decision = approvals.request({ id: 'a2', command: 'bkill 123', signal: new AbortController().signal, send, timeoutMs: 120_000 });
    await vi.advanceTimersByTimeAsync(120_001);
    expect(await decision).toEqual({ approved: false, reason: 'expired' });
    expect(approvals.respond('a2', true)).toEqual({ success: false, reason: 'expired' });
    expect(send).toHaveBeenLastCalledWith(expect.objectContaining({ type: 'confirm_resolved', reason: 'expired' }));
  });
  it('stop and explicit rejection have different outcomes, and concurrent IDs do not overwrite', async () => {
    const approvals = new CommandApprovals(); const abort = new AbortController();
    const a = approvals.request({ id: 'a', command: 'one', signal: abort.signal, send: () => {} });
    const b = approvals.request({ id: 'b', command: 'two', signal: abort.signal, send: () => {} });
    approvals.respond('a', false); abort.abort();
    expect(await a).toEqual({ approved: false, reason: 'rejected' });
    expect(await b).toEqual({ approved: false, reason: 'cancelled' });
  });
});
