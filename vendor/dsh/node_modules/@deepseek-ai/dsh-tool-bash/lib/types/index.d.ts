/**
 * Model-facing Consumer of the `ctx.shell` capability seam. While a job
 * registry is composed, every call registers its process with `ctx.jobs` as
 * it starts: `run_in_background` returns the id at once, and a foreground call
 * waits on its job until the command finishes or the wait times out, at which
 * point it returns the same id. Without a registry the tool is foreground-only
 * and the executor's deadline kills the command.
 *
 * TODO(permissions): deployment policy belongs in `tools/pre-execute` and
 * sandboxing executors; see docs/architecture.md § Where new behavior goes.
 * @module @deepseek-ai/dsh-tool-bash
 */
import type { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
export declare const name = "tool-bash";
export declare const inject: string[];
/** Configuration for the bash tool. */
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
/** Runtime configuration schema for the bash tool plugin. */
export declare const Config: z<Config>;
export declare function apply(ctx: Context, config?: Config): void;
//# sourceMappingURL=index.d.ts.map