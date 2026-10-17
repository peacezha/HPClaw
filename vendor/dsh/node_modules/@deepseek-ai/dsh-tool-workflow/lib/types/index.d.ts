/**
 * The model-facing `workflow` tool: run a JavaScript orchestration script that fans out
 * subagents, and return the script's final value. It owns the model-facing schema and run lifecycle; script
 * parsing, execution, caps, and cancellation live behind `ctx.workflowEngine`
 * (`@deepseek-ai/dsh-workflow`), so a hardened engine swaps in without touching what the model
 * sees. Foreground execution awaits `run.result` and always disposes the run; non-completed reasons
 * become tool errors. `run_in_background: true` instead registers the run as an owned `ctx.jobs` job
 * and returns its id immediately — the job's output ring streams live progress, and the run's value
 * arrives with the job's completion notice. Presentation is an args-only generic card
 * titled from `meta.name`. Explicit-ask usage guidance is registered as the tool's own prompt
 * section rather than deployment persona prose.
 * @module @deepseek-ai/dsh-tool-workflow
 */
import type { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
declare module '@deepseek-ai/dsh-jobs' {
    interface JobKindMap {
        workflow: 'workflow';
    }
}
export declare const name = "tool-workflow";
export declare const inject: string[];
/** Config: the model-facing tool name plus result rendering caps. */
export interface Config {
    /** The model-facing tool name to register (default `workflow`). */
    toolName?: string;
    /** Rendered-result ceiling, in characters: a longer JSON value is truncated with a notice (default 50000). */
    maxResultChars?: number;
    /**
     * Expose `run_in_background` (default true); disabled calls are also
     * rejected. A background run needs a live `ctx.jobs` registry with a
     * controller serving the caller (`dsh-jobs-local` plus `dsh-tool-jobs` in
     * the shipped composition); without one the call fails with the missing
     * piece named.
     */
    enableRunInBackground?: boolean;
}
export declare const Config: z<Config>;
export declare function apply(ctx: Context, config: Config): void;
//# sourceMappingURL=index.d.ts.map