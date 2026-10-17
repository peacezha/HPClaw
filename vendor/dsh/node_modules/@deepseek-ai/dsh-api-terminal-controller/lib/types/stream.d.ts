import type { TerminalFrame } from './types.ts';
/** Slow followers fail explicitly; a later attachment recovers from the screen. */
export declare class TerminalFollower {
    private readonly maxBytes;
    private readonly queue;
    private bytes;
    private wake;
    private closed;
    private finished;
    private failure;
    /** Whether this attachment still accepts input and output. */
    get active(): boolean;
    /** @param maxBytes - maximum queued UTF-8 bytes for this follower. */
    constructor(maxBytes: number);
    /**
     * Queue a frame or fail this follower when its byte limit is exceeded.
     * @param frame - next ordered frame.
     */
    push(frame: TerminalFrame): void;
    /**
     * Fail this attachment without stopping its terminal; failures after finish or close are ignored.
     * @param error - input or output failure reported to the attached consumer.
     */
    fail(error: Error): void;
    /** Finish after delivering every queued frame, including the final exit state. */
    finish(): void;
    /** Stop this follower without stopping its terminal. */
    close(): void;
    /**
     * Drain until detached or failed.
     * @param signal - Remote generation cancellation.
     * @returns ordered terminal frames.
     */
    read(signal: AbortSignal): AsyncIterable<TerminalFrame>;
}
//# sourceMappingURL=stream.d.ts.map