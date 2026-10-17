import type { SubprocessTerminalActivity } from '@deepseek-ai/dsh-subprocess';
import type { TerminalRetentionFrame } from './types.ts';
/** Validated Host timing policy for unattended terminal cleanup. */
export interface TerminalRetentionPolicy {
    readonly unattendedTimeoutMs: number;
    readonly activityPollIntervalMs: number;
    readonly cleanupRetryMs: number;
}
/** Exactly one owner orders holds, observation, and retryable process cleanup. */
export declare class TerminalRetention {
    private readonly policy;
    private readonly inspect;
    private readonly terminate;
    private readonly failed;
    private readonly lifetime;
    private readonly holders;
    private epoch;
    private timer;
    private observation;
    private idle;
    private closing;
    private disposed;
    private cleanup;
    /**
     * @param policy - deployment timing choices.
     * @param inspect - fresh shell and owned-job observation.
     * @param terminate - mark the identity closed, await process quiescence, and remove its owner record.
     * @param failed - diagnostic sink for failed automatic cleanup.
     */
    constructor(policy: TerminalRetentionPolicy, inspect: () => Promise<SubprocessTerminalActivity>, terminate: () => Promise<void>, failed: (error: unknown) => void);
    /**
     * Hold one terminal for one physical Remote stream, independently of screen subscriptions.
     * @param signal - transport generation lifetime.
     * @returns acknowledgement followed by an open stream until cancellation or terminal closure.
     */
    retain(signal: AbortSignal): AsyncIterable<TerminalRetentionFrame>;
    /** Invalidate outstanding idle observations before accepting input. */
    invalidate(): void;
    /**
     * Start or join cleanup; failure keeps the identity closed and schedules one retry.
     * @returns after owned process cleanup succeeds, or rejects with its failure.
     */
    close(): Promise<void>;
    /**
     * Stop timers and streams and await both observation and final cleanup.
     * @returns after process quiescence; cleanup failure is reported to the disposing owner.
     */
    dispose(): Promise<void>;
    private cancelTimer;
    private schedule;
    private observe;
}
//# sourceMappingURL=retention.d.ts.map