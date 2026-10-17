/** Cancellation and settlement of complete PTC calls, including nested tools. */
import type { Context } from '@deepseek-ai/cordis';
import type { SessionId } from '@deepseek-ai/dsh-session';
import type { SandboxMode } from '@deepseek-ai/dsh-sandbox';
/** Keeps calls under a changed policy from overlapping their canceled predecessors. */
export declare class PtcCalls {
    private readonly calls;
    private disposed;
    /**
     * Observe policy changes for the owning tool registry.
     * @param ctx - Registry lifecycle and Session events.
     */
    constructor(ctx: Context);
    /**
     * Await canceled predecessors before resolving authority and admitting a call.
     * @param sessionId - Calling Session.
     * @param signal - Caller cancellation.
     * @param mode - Current standing mode, read after preceding cleanup.
     * @param run - Complete call, including nested-tool cleanup.
     * @returns The call result.
     */
    run<T>(sessionId: SessionId, signal: AbortSignal, mode: () => SandboxMode, run: (signal: AbortSignal) => Promise<T>): Promise<T>;
}
//# sourceMappingURL=ptc-calls.d.ts.map