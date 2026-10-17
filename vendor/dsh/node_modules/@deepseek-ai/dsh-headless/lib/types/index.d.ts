/**
 * @deepseek-ai/dsh-headless — one-shot direct Agent driver. The bundle patch
 * rides over dsh-base without Host, HTTP, or browser plugins; this runner
 * creates one Agent through the core registry (or adopts the exact Session a
 * `--session-id` names), drives the task to quiescence, streams provider
 * reasoning to stderr, flushes its Session, prints the final assistant text to
 * stdout, and exits. With `--json` it projects the run as newline-delimited
 * events instead of the final text.
 *
 * @module @deepseek-ai/dsh-headless
 */
import type { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
/** Stable Cordis plugin name. */
export declare const name = "headless-runner";
/** Core services required before the one-shot turn can start. */
export declare const inject: string[];
/** Plugin config: the task and run options resolved from this app's injected provider service. */
export interface Config {
    /** The prompt text for the single run; absent when the task arrives on stdin. */
    task?: string;
    /** Exact Session identity to adopt; absent for a fresh random identity. An id with no stored Session fails. */
    sessionId?: string;
    /** Whether stdout carries the machine-readable event stream instead of final text. */
    json?: boolean;
}
export declare const Config: z<Config>;
/**
 * Mount the one-shot direct driver.
 * @param ctx - plugin context carrying core services and the launcher-provided exit request.
 * @param config - validated task and run options.
 */
export declare function apply(ctx: Context, config: Config): void;
//# sourceMappingURL=index.d.ts.map