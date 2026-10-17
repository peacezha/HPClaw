/**
 * Local PowerShell Service Provider for the bash capability seam. Each command runs
 * as `pwsh -NoLogo -NoProfile -NonInteractive -Command <command>` in a managed
 * process spawned through `ctx.subprocess`; the executor owns command
 * defaulting, deadlines and cause classification, the model-friendly terminal
 * environment, and the model-facing stdout/stderr merge for background reads.
 *
 * The command string is passed as ONE argv element to `-Command`: PowerShell
 * itself parses the text, and no intermediate shell exists, so there is no
 * shell-quoting layer to escape (the `bash -c` string domain has no
 * equivalent here). Native Win32 paths (`C:\...`) pass through unchanged.
 *
 * @module @deepseek-ai/dsh-pwsh-local
 */
import type { Volatile } from '@deepseek-ai/cordis';
import { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import { ShellExecutor } from '@deepseek-ai/dsh-shell';
import type { ShellExecRequest, ShellExecSpec, ShellExecution, ShellProcess } from '@deepseek-ai/dsh-shell';
/**
 * Model-friendly environment overrides for PowerShell: disable colors and
 * pagers that would garble tool output. `TERM=dumb` is a POSIX concept and is
 * deliberately absent; `NO_COLOR` is honored by modern pwsh renderers.
 */
export declare const ENV_OVERRIDES: {
    readonly NO_COLOR: "1";
    readonly PAGER: "cat";
    readonly GIT_PAGER: "cat";
};
/**
 * UTF-8 output pinning prepended to every command. The subprocess collector
 * decodes output bytes as UTF-8, but Windows PowerShell 5.1 (the last-resort
 * executable fallback) writes the console/OEM code page by default, which
 * garbles non-ASCII output; pwsh 7 defaults to UTF-8 and is unaffected. The
 * statements ride on line 1 after `; ` separators so PowerShell error line
 * numbers stay accurate.
 */
export declare const ENCODING_PREAMBLE = "[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false); $OutputEncoding = [System.Text.UTF8Encoding]::new($false); ";
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
    /**
     * Explicit pwsh executable. When omitted, well-known Windows install
     * locations and PATH entries are probed in order (PowerShell 7 install,
     * PATH entries such as the Microsoft Store install, then Windows
     * PowerShell 5.1), falling back to a bare `pwsh` resolved through PATH.
     */
    pwshPath: Volatile<string | undefined>;
}
export { candidatePwshPaths, resolvePwshPath } from './resolve.ts';
/**
 * Reject a resolved section this executor could not run with. The schema
 * expresses neither "positive and finite" nor the timer bound `graceMs` has to
 * fit, so a stored value that cannot be used fails at the next command.
 * @param config - the live configuration, schema-valid by construction.
 * @throws Error naming the field that cannot be used.
 */
export declare function assertServiceablePwshConfig(config: Config): void;
/**
 * Local PowerShell executor over `ctx.subprocess`. Bounded output, spill
 * files, and managed-range termination are the subprocess service's mechanics;
 * this executor supplies their configured budgets per spawn.
 */
export declare class PwshLocalExecutor extends ShellExecutor {
    readonly config: Config;
    static inject: string[];
    static Config: z<Schemastery.ObjectS<NoInfer<{
        cwd: z<string, string, "volatile">;
        timeoutMs: z<number, number, "volatile-defined">;
        maxTimeoutMs: z<number, number, "volatile-defined">;
        maxOutputBytes: z<number, number, "volatile-defined">;
        maxSpillBytes: z<number, number, "volatile-defined">;
        graceMs: z<number, number, "volatile-defined">;
        pwshPath: z<string, string, "volatile">;
    }>>, Schemastery.ObjectT<NoInfer<{
        cwd: z<string, string, "volatile">;
        timeoutMs: z<number, number, "volatile-defined">;
        maxTimeoutMs: z<number, number, "volatile-defined">;
        maxOutputBytes: z<number, number, "volatile-defined">;
        maxSpillBytes: z<number, number, "volatile-defined">;
        graceMs: z<number, number, "volatile-defined">;
        pwshPath: z<string, string, "volatile">;
    }>>, "plain">;
    /** The declared executable the current {@link pwshPath} was resolved from. */
    private declaredPwshPath;
    /** The pwsh executable resolved from the current config. */
    private resolvedPwshPath;
    /** The pwsh executable every command runs through; a changed declared path is probed again on the next read. */
    get pwshPath(): string;
    constructor(ctx: Context, config: Config);
    /**
     * Resolve a request into a fully-specified spec: fill `workdir` from
     * `config.cwd` (else `process.cwd()`), and `timeoutMs` from
     * `config.timeoutMs`, capped at `config.maxTimeoutMs`.
     */
    resolve(request: ShellExecRequest): ShellExecSpec;
    /**
     * The pwsh invocation argv for one resolved spec — the argv-level seam a
     * confining subclass wraps through `ctx.sandbox.confine` (the pwsh twin of
     * `dsh-bash-local`'s `executeArgv` hook; see
     * `@deepseek-ai/dsh-pwsh-sandbox`).
     */
    protected argv(spec: ShellExecSpec): string[];
    /** Map one resolved spec plus its argv onto a fully-specified subprocess spawn. */
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
     * The base implementation is intentionally empty. Mirrored from
     * `dsh-bash-local` (whose sandboxing subclass consumes the same hook); the
     * pwsh-confining consumer is `@deepseek-ai/dsh-pwsh-sandbox`.
     * @param _proc - the settled process handle.
     * @param _stderr - the process's retained stderr tail used by subclasses for settlement classification.
     * @param _providerRejected - whether the subprocess promise rejected without a direct outcome.
     * @param _providerError - the provider rejection reason, which may itself be undefined.
     */
    protected onProcessDone(_proc: ShellProcess, _stderr: string, _providerRejected: boolean, _providerError?: unknown): void;
}
export default PwshLocalExecutor;
//# sourceMappingURL=index.d.ts.map