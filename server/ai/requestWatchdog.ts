import type { AgentTurnClock } from '../../shared/agentTurnClock';

/** An active-execution deadline, with a separate ceiling for human waits. */
export function createRequestWatchdog(options: {
  clock: AgentTurnClock;
  signal: AbortSignal;
  getTerminalEvent: () => string;
  onTimeout: () => void;
  activeLimitMs: number;
  wallLimitMs: number;
}) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const stop = () => { if (timer) clearTimeout(timer); timer = undefined; };
  const arm = () => {
    stop();
    if (options.signal.aborted || options.getTerminalEvent() !== 'none') return;
    const state = options.clock.snapshot();
    const remaining = Math.min(options.wallLimitMs - state.wallMs,
      state.waitingHuman ? Infinity : options.activeLimitMs - state.activeMs);
    timer = setTimeout(() => {
      if (!options.signal.aborted && options.getTerminalEvent() === 'none') options.onTimeout();
    }, Math.max(1, remaining));
    timer.unref?.();
  };
  return { arm, stop };
}
