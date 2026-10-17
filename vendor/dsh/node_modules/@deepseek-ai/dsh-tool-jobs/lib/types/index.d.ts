/**
 * Model-facing `job_output`, `job_list`, and `job_kill` tools over
 * `ctx.jobs`. Loading the plugin attaches the controller required by
 * producers. It also delivers completions the model has not already
 * collected to the owning agent: injected into a busy owner's next step, or
 * opening a turn on an idle one under the default `wakeup` delivery, unbounded
 * unless `maxConsecutiveWakes` caps it per owner.
 * @module @deepseek-ai/dsh-tool-jobs
 */
import type { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import type { ContextFormed } from '@deepseek-ai/dsh-llm';
declare module '@deepseek-ai/dsh-llm' {
    interface MessageSourceMap {
        'tool-jobs': {
            kind: 'tool-jobs';
        } & ContextFormed;
    }
}
export declare const name = "tool-jobs";
export declare const inject: string[];
/**
 * How an uncollected completion reaches an owner that is already idle: `wakeup`
 * opens a turn for it, `quiet` leaves it pending until something else wakes the
 * owner. A busy owner is injected either way.
 */
export type CompletionDelivery = 'quiet' | 'wakeup';
/** Configures bounded `job_output` waits and completion-notice delivery. */
export interface Config {
    /** Wait duration applied when `job_output` sets `wait` without `timeout_ms` (default 30s). */
    waitTimeoutMs?: number;
    /** Hard cap on any single wait; a larger model-supplied `timeout_ms` is clamped down to it (default 10min). */
    maxWaitTimeoutMs?: number;
    /** Whether a completion opens a turn on an idle owner (default `wakeup`). */
    completionDelivery?: CompletionDelivery;
    /**
     * Turns one owner may have opened by completion wakes before the next
     * notice degrades to injection, reset by any user-authored input. Absent by
     * default: every idle completion wakes its owner. Set it to bound the
     * self-exciting chain where a woken turn starts the job whose completion
     * wakes it again, at the cost of notices past the cap waiting silently for
     * the next user input.
     */
    maxConsecutiveWakes?: number;
}
export declare const Config: z<Config>;
export declare function apply(ctx: Context, config: Config): void;
//# sourceMappingURL=index.d.ts.map