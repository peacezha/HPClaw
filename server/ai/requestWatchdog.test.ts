import { afterEach, describe, expect, it, vi } from 'vitest';
import { AgentTurnClock } from '../../shared/agentTurnClock';
import { createRequestWatchdog } from './requestWatchdog';
afterEach(() => vi.useRealTimers());
describe('Agent request deadline scheduling', () => {
  function fixture() {
    vi.useFakeTimers(); vi.setSystemTime(0);
    const clock = new AgentTurnClock(), abort = new AbortController(), onTimeout = vi.fn();
    let terminal = 'none';
    const watchdog = createRequestWatchdog({ clock, signal: abort.signal, getTerminalEvent: () => terminal,
      onTimeout, activeLimitMs: 15 * 60_000, wallLimitMs: 45 * 60_000 });
    const event = (value: any) => { clock.observe(value); watchdog.arm(); };
    watchdog.arm();
    return { watchdog, event, abort, onTimeout, finish: () => { terminal = 'done'; watchdog.arm(); } };
  }
  it('arms while the terminal event is none, without extending the active budget on heartbeats', () => {
    const test = fixture();
    vi.advanceTimersByTime(14 * 60_000); test.event({ type: 'status', phase: 'working' });
    vi.advanceTimersByTime(60_000); expect(test.onTimeout).toHaveBeenCalledTimes(1);
    test.watchdog.stop();
  });
  it('pauses for a real question and resumes the remaining execution time', () => {
    const test = fixture(); vi.advanceTimersByTime(10 * 60_000); test.event({ type: 'ask', id: 'q' });
    vi.advanceTimersByTime(12 * 60_000); expect(test.onTimeout).not.toHaveBeenCalled();
    test.event({ type: 'ask_resolved', id: 'q' }); vi.advanceTimersByTime(5 * 60_000);
    expect(test.onTimeout).toHaveBeenCalledTimes(1); test.watchdog.stop();
  });
  it('still terminates unanswered prompts at the wall safety ceiling', () => {
    const test = fixture(); test.event({ type: 'confirm', id: 'approval' });
    vi.advanceTimersByTime(45 * 60_000); expect(test.onTimeout).toHaveBeenCalledTimes(1); test.watchdog.stop();
  });
  it('does not fire after task completion or cancellation', () => {
    const complete = fixture(); complete.finish(); vi.advanceTimersByTime(46 * 60_000);
    expect(complete.onTimeout).not.toHaveBeenCalled();
    const cancelled = fixture(); cancelled.abort.abort(); vi.advanceTimersByTime(46 * 60_000);
    expect(cancelled.onTimeout).not.toHaveBeenCalled(); cancelled.watchdog.stop();
  });
});
