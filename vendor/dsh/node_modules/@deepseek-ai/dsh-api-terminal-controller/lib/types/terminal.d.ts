import { type RemoteUplinkWindow } from '@deepseek-ai/dsh-typert-protocol';
import type { SubprocessTerminalHandle } from '@deepseek-ai/dsh-subprocess';
import { type TerminalRetentionPolicy } from './retention.ts';
import type { TerminalEnvironment, TerminalInput, TerminalFrame, TerminalRetentionFrame, WebTerminalInfo } from './types.ts';
/** Process lifetime is independent of follower and component lifetimes. */
export declare class BrowserTerminal {
    private readonly handle;
    info: WebTerminalInfo;
    private readonly maxBufferedBytes;
    private readonly screen;
    private readonly serializer;
    private readonly followers;
    private sequence;
    private operations;
    private readonly drained;
    /** Provider completion precedes output drainage and the published exit state. */
    private exited;
    private closing;
    private retention;
    private controller;
    /**
     * @param handle - allocated terminal process range.
     * @param info - initial metadata.
     * @param scrollback - maximum retained scrollback rows.
     * @param maxBufferedBytes - per-follower queue cap.
     */
    constructor(handle: SubprocessTerminalHandle, info: WebTerminalInfo, scrollback: number, maxBufferedBytes: number);
    /**
     * Start monitoring after this allocation is committed to its Session owner.
     * @param policy - validated Host timing policy.
     * @param closing - closes the id before any asynchronous termination.
     * @param closed - removes the exact successfully terminated owner record.
     * @param failed - diagnostic sink for background cleanup failure.
     */
    monitor(policy: TerminalRetentionPolicy, closing: () => void, closed: () => void, failed: (error: unknown) => void): void;
    /**
     * Retain this committed process independently of output attachment.
     * @param signal - physical window stream lifetime.
     * @returns its hold acknowledgement and lifetime.
     */
    retain(signal: AbortSignal): AsyncIterable<TerminalRetentionFrame>;
    /**
     * Attach with exclusive input control; older attachments keep receiving output.
     * @param input - Gateway-decoded commands; returning its iterator must interrupt pending reads.
     * @param limits - input byte and PTY dimension limits validated at the Remote boundary.
     * @param signal - attachment cancellation; never terminates the process.
     * @param inputWindow - carrier frame capacity; absent for a carrier without an encoded-frame inbox limit.
     * @returns a screen baseline, output, per-attachment state and ordered command acknowledgements.
     */
    attach(input: AsyncIterable<TerminalInput>, limits: Pick<TerminalEnvironment, 'maxInputBytes' | 'maxCols' | 'maxRows'>, signal: AbortSignal, inputWindow?: RemoteUplinkWindow): AsyncIterable<TerminalFrame>;
    private consumeInput;
    private writable;
    private broadcastState;
    /**
     * Publish a display name to every attached view.
     * @param title - validated user title.
     */
    rename(title: string): void;
    /**
     * Terminate the complete provider-owned process range before releasing its screen.
     * @returns after process cleanup and final output drainage; failures remain retryable.
     */
    close(): Promise<void>;
    /**
     * Stop unattended cleanup scheduling and await final process cleanup.
     * @returns after terminal and monitor quiescence.
     */
    dispose(): Promise<void>;
    private closeProcess;
    private requireController;
    private broadcast;
    private enqueue;
    private consume;
    private output;
}
//# sourceMappingURL=terminal.d.ts.map