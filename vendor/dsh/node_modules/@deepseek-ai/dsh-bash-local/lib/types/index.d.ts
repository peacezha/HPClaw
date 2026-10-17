/**
 * Local Service Provider for the bash capability seam over the subprocess
 * capability seam. Public commands run as `bash -c` in a provider-managed range
 * through `ctx.subprocess`; subclasses may reuse the same mechanics with an
 * explicit argv. This executor owns command defaulting, deadlines and cause
 * classification, the model-friendly terminal environment, and the model-facing
 * stdout/stderr merge for background reads. Execution policy belongs in
 * `tools/pre-execute` or a sandboxing executor.
 * @module @deepseek-ai/dsh-bash-local
 */
import type { Volatile } from '@deepseek-ai/cordis';
import { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import { ShellExecutor } from '@deepseek-ai/dsh-shell';
import type { ShellExecRequest, ShellExecSpec, ShellExecution, ShellProcess } from '@deepseek-ai/dsh-shell';
/**
 * Model-friendly environment overrides: disable colors, pagers, and
 * interactive terminal features that would garble tool output (the same set
 * Codex hardcodes; Claude Code achieves it via TERM=dumb). Bash-tool policy —
 * merged first into the spawn's explicit env, so a trusted caller's own entry
 * still wins; the subprocess service applies its credential scrub independently.
 */
export declare const ENV_OVERRIDES: {
    readonly NO_COLOR: "1";
    readonly TERM: "dumb";
    readonly PAGER: "cat";
    readonly GIT_PAGER: "cat";
};
/** Validated plugin configuration with live command budgets. */
export interface Config {
    /** Default working directory for commands (default: process.cwd()). */
    cwd: Volatile<string | undefined>;
    /** Default foreground timeout in milliseconds. */
    timeoutMs: Volatile<number>;
    /** Upper bound for per-call timeout overrides. */
    maxTimeoutMs: Volatile<number>;
    /** Per-stream in-memory output cap; overflow spills to a temp file. */
    maxOutputBytes: Volatile<number>;
    /** Per-stream spill-file cap; larger streams retain only their in-memory tail. */
    maxSpillBytes: Volatile<number>;
    /** Grace period for kill escalation and inherited pipes; at most `MAX_TIMER_DELAY_MS`. */
    graceMs: Volatile<number>;
}
/**
 * Reject a resolved section this executor could not run with. The schema
 * expresses neither "positive and finite" nor the timer bound `graceMs` has to
 * fit, so a stored value that cannot be used fails at the next command.
 * @param config - the live configuration, schema-valid by construction.
 * @throws Error naming the field that cannot be used.
 */
export declare function assertServiceableBashConfig(config: Config): void;
/**
 * Local bash executor over `ctx.subprocess`. Bounded output, spill files,
 * managed-range SIGTERM→SIGKILL escalation, and quiescence are the subprocess
 * service's mechanics; this executor supplies their configured budgets per spawn, so a
 * still-running background process stays managed (killed and joined at
 * composition teardown) even across an executor reload.
 */
export declare class LocalBashExecutor extends ShellExecutor {
    readonly config: Config;
    static inject: string[];
    static Config: z<Schemastery.ObjectS<NoInfer<{
        cwd: z<string, string, "volatile">;
        timeoutMs: z<number, number, "volatile-defined">;
        maxTimeoutMs: z<number, number, "volatile-defined">;
        maxOutputBytes: z<number, number, "volatile-defined">;
        maxSpillBytes: z<number, number, "volatile-defined">;
        graceMs: z<number, number, "volatile-defined">;
    }>>, Schemastery.ObjectT<NoInfer<{
        cwd: z<string, string, "volatile">;
        timeoutMs: z<number, number, "volatile-defined">;
        maxTimeoutMs: z<number, number, "volatile-defined">;
        maxOutputBytes: z<number, number, "volatile-defined">;
        maxSpillBytes: z<number, number, "volatile-defined">;
        graceMs: z<number, number, "volatile-defined">;
    }>>, "plain">;
    constructor(ctx: Context, config: Config);
    /**
     * Resolve a request into a fully-specified spec: fill `workdir` from
     * `config.cwd` (else `process.cwd()`), and `timeoutMs` from
     * `config.timeoutMs`, capped at `config.maxTimeoutMs`. The tool layer calls
     * this before {@link execute}, so it receives explicit values and never
     * re-defaults.
     */
    resolve(request: ShellExecRequest): ShellExecSpec;
    /** Map one resolved bash spec and explicit argv onto a fully-specified subprocess spawn. */
    private spawnSpec;
    /** The collect-mode readers the executor itself requested (present by construction). */
    private static collected;
    execute(spec: ShellExecSpec): Promise<ShellExecution>;
    /**
     * Execute an explicit argv with the lifecycle, environment, output,
     * deadline, and cancellation semantics of this executor. Subclasses use this
     * after replacing the public command's shell argv at an execution boundary.
     * @param spec - resolved execution settings and caller-owned command metadata.
     * @param argvOrPrepare - exact argv, or preparation using the execution cancellation signal.
     * @param onStarted - installs provider facts synchronously before the handle can settle.
     * @returns the live execution handle; spawn rejection settles the handle as
     *   killed while `result()` carries the same failure as its rejection.
     */
    protected executeArgv(spec: ShellExecSpec, argvOrPrepare: readonly string[] | ((signal: AbortSignal) => Promise<readonly string[]>), onStarted?: (process: ShellExecution) => void): Promise<ShellExecution>;
    /**
     * Settlement hook for subclasses that attach execution facts to a process.
     * Called after exit facts or provider-failure output are stamped and before
     * {@link ShellProcess.done} resolves. The base implementation is intentionally
     * empty.
     * @param _proc - the settled process handle.
     * @param _stderr - the process's retained stderr tail used by subclasses for settlement classification.
     * @param _providerRejected - whether the subprocess promise rejected without a direct outcome.
     * @param _providerError - the provider rejection reason, which may itself be undefined.
     */
    protected onProcessDone(_proc: ShellProcess, _stderr: string, _providerRejected: boolean, _providerError?: unknown): void;
}
export default LocalBashExecutor;
//# sourceMappingURL=index.d.ts.map