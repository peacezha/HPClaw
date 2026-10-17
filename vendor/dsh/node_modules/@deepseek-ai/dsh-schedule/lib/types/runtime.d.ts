import type { ContextFormed } from '@deepseek-ai/dsh-llm';
declare module '@deepseek-ai/dsh-llm' {
    interface MessageSourceMap {
        'schedule': {
            kind: 'schedule';
        } & ContextFormed;
    }
}
import type { Context } from '@deepseek-ai/cordis';
import type { DeliveryRetentionBounds } from './types.ts';
import type { ScheduleTask } from './storage.ts';
/** Largest delay Node timers represent without clamping. */
export declare const MAX_TIMER_DELAY_MS = 2147483647;
/** Owns at most one timer across recomputations; delivery and management share the serialized operation. */
export declare class ScheduleRuntime {
    private readonly ctx;
    private readonly tasks;
    private readonly transact;
    private readonly commit;
    private readonly retention;
    private timer;
    private running;
    private stopping;
    private requested;
    /**
     * @param ctx - Host services used to resume and enqueue.
     * @param tasks - Current durable tasks.
     * @param transact - Serialize delivery against management writes.
     * @param commit - Persist task status, target, receipt, and history together after durable inbox delivery.
     */
    constructor(ctx: Context, tasks: () => readonly ScheduleTask[], transact: (work: () => Promise<void>) => Promise<void>, commit: (task: ScheduleTask) => Promise<void>, retention: DeliveryRetentionBounds);
    /**
     * Recompute the nearest obligation after startup or a durable change.
     * Dispatch failures are logged; refused admission does not retry automatically.
     */
    requestDrive(): void;
    /** Stop the timer and drain an accepted delivery before storage closes. */
    dispose(): Promise<void>;
    private clearTimer;
    private drive;
}
//# sourceMappingURL=runtime.d.ts.map