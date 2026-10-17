/**
 * Model-facing Consumer of the `ctx.userQuestions` capability seam.
 * The tool pauses until a UI provider returns a human answer, then feeds that
 * answer back into the agent loop as an ordinary tool result.
 *
 * @module @deepseek-ai/dsh-tool-ask-user
 */
import type { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import '@deepseek-ai/dsh-user-questions';
/** Cordis row selecting the tool schema and its default foreground wait. */
export interface Config {
    /** Tool definition selected by this Cordis row. Defaults to the blocking legacy tool. */
    mode?: 'legacy' | 'timed';
    /** Foreground wait before automatic continuation. Defaults to 120 seconds. */
    timeout?: number;
}
export declare const Config: z<Config>;
export declare const name = "tool-ask-user";
export declare const inject: string[];
export declare function apply(ctx: Context, config?: Config): void;
//# sourceMappingURL=index.d.ts.map