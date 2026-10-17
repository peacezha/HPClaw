/**
 * Model-facing PowerShell Consumer of the `ctx.shell` capability seam. Intended for
 * Windows compositions where a PowerShell executor (e.g.
 * `@deepseek-ai/dsh-pwsh-local`) backs `ctx.shell`; the tool contract is
 * PowerShell-dialect: native `C:\...` paths and `$env:NAME` variables.
 *
 * Behavior mirrors `dsh-tool-bash` call-for-call: foreground and
 * `run_in_background` execution (with a job registry composed, every call
 * registers its process with `ctx.jobs` as it starts, and a foreground call
 * waits on its job until the timeout passes), the managed `DSH_*` environment through the
 * shared `shell-env` registry, the per-call sandbox policy resolution (the
 * calling session's mode and cwd travel to the confining executor), the
 * sandbox-denial rendering with the same-turn escalation surface
 * (`sandbox_permissions` + `justification` resolved through
 * `ctx.approval`), and the bash marker/truncation rendering story. UI
 * presentation mirrors the bash tool's too: a completed foreground call is
 * a terminal card with the parsed exit-status pill, using the shared
 * exit-status parse from `@deepseek-ai/dsh-shell`.
 *
 * @module @deepseek-ai/dsh-tool-pwsh
 */
import type { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
declare module '@deepseek-ai/dsh-jobs' {
    interface JobKindMap {
        pwsh: 'pwsh';
    }
}
export declare const name = "tool-pwsh";
export declare const inject: string[];
/** Configuration for the pwsh tool. */
export interface Config {
    /**
     * Expose `run_in_background` while a job registry is composed (default
     * true); disabled calls are also rejected. Without a registry the tool is
     * foreground-only regardless.
     */
    enableRunInBackground?: boolean;
    /**
     * Keep a foreground command that reaches its timeout running as a
     * background job instead of killing it (default true). Applies only while
     * background execution is available: with `enableRunInBackground` false or
     * no job registry, the executor's deadline kills the command. A foreground
     * command the registry refuses at its start (admission or a missing
     * controller) also runs under the deadline kill.
     */
    promoteOnTimeout?: boolean;
}
/** Runtime configuration schema for the pwsh tool plugin. */
export declare const Config: z<Config>;
export declare function apply(ctx: Context, config?: Config): void;
//# sourceMappingURL=index.d.ts.map