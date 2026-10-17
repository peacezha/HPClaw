/** Bounded, cancellable commands under the calling Session's existing file policy. */
import type { Context } from '@deepseek-ai/cordis';
import type { SandboxExecutionPolicy } from '@deepseek-ai/dsh-sandbox';
/** Resolved process resource limits owned by the worktree service. */
export interface ProcessConfig {
    /** Deadline for one command, including executable lookup and confinement. */
    timeoutMs: number;
    /** Termination grace period for each managed subprocess. */
    graceMs: number;
    /** Maximum captured bytes per output stream. */
    maxOutputBytes: number;
}
/**
 * Run an argv without a shell and await termination of its managed process range.
 * @param ctx - subprocess and sandbox providers in the same execution world.
 * @param config - complete process resource limits.
 * @param policy - unchanged calling Session policy.
 * @param cwd - canonical process working directory.
 * @param argv - executable followed by literal arguments.
 * @param signal - operation cancellation.
 * @param allowedExitCodes - command-specific successful statuses.
 * @param env - command-local environment overrides, applied after Git selector removal.
 * @returns complete bounded stdout and the exit code.
 */
export declare function runCommand(ctx: Context, config: ProcessConfig, policy: SandboxExecutionPolicy, cwd: string, argv: readonly [string, ...string[]], signal: AbortSignal, allowedExitCodes?: readonly number[], env?: NodeJS.ProcessEnv): Promise<{
    stdout: string;
    exitCode: number;
}>;
//# sourceMappingURL=process.d.ts.map