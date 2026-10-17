/** Node PTC process invalidation after a committed Session file-policy change. */
import type { Context } from '@deepseek-ai/cordis';
import type { SessionId } from '@deepseek-ai/dsh-session';
import type { SandboxExecutionPolicy } from '@deepseek-ai/dsh-sandbox';
/** Owns asynchronous process cleanup without delaying permission setters. */
export declare class PolicyProcesses {
    private readonly ctx;
    private readonly processes;
    /**
     * Begin cleanup on policy changes, even when no subsequent program runs.
     * @param ctx - Node provider lifecycle and Session services.
     */
    constructor(ctx: Context);
    /**
     * Track an admitted call or retained process until its owner confirms cleanup.
     * @param policy - Resolved process policy, including an optional Session identity.
     * @param release - Idempotent cancellation and awaited cleanup.
     * @returns Removal after successful process cleanup.
     */
    register(policy: SandboxExecutionPolicy, release: () => Promise<void>): () => void;
    /**
     * Wait for invalidated processes before admitting another program.
     * @param sessionId - Session carried by the resolved policy.
     * @returns Completion after prior cleanup; a failure rejects and remains retryable.
     */
    wait(sessionId: SessionId | undefined): Promise<void>;
    private release;
    private settle;
}
//# sourceMappingURL=policy-processes.d.ts.map