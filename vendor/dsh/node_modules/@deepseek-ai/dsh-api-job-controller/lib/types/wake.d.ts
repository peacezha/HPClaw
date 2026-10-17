/**
 * Wake bookkeeping shared by the two observation generators: a wake-flag
 * waiter that never loses a wake between waits, and an abortable sleep that
 * coalesces bursts into bounded frames.
 * @module @deepseek-ai/dsh-api-job-controller/wake
 */
/** Wake-flag waiter: a wake between waits is never lost. */
export declare class OutputWaiter {
    private dirty;
    private resolve;
    /** Record one wake; releases a pending wait or arms the next one. */
    wake(): void;
    /**
     * Resolve on the next wake, immediately when one already arrived, or on abort.
     * @param signal - generation cancellation.
     * @returns settles when woken or aborted.
     */
    wait(signal: AbortSignal): Promise<void>;
}
/**
 * Sleep for the coalescing window, or return at once when aborted.
 * @param ms - window in milliseconds.
 * @param signal - generation cancellation.
 * @returns settles after the window or on abort.
 */
export declare function sleep(ms: number, signal: AbortSignal): Promise<void>;
//# sourceMappingURL=wake.d.ts.map