/** First-human-message model provider for `ctx.sessionTitle`. */
import type { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import { type SessionTitleLlmConfig } from '@deepseek-ai/dsh-session-title-llm';
export declare const name = "session-title-first-prompt-llm";
export declare const inject: string[];
/** Required execution controls plus this provider's title-length targets; no defaults. */
export interface Config extends SessionTitleLlmConfig {
    /** Target word count for non-CJK titles. */
    readonly targetWords: number;
    /** Target character count for Chinese, Japanese, or Korean titles. */
    readonly targetCjkCharacters: number;
}
/** Loader schema for this provider's required execution controls and title-length targets. */
export declare const Config: z<Config>;
/**
 * Register the first-prompt model provider.
 * @param ctx - context exposing session-title, LLM, and session services.
 * @param config - required route, target, byte, token, and timeout policy.
 */
export declare function apply(ctx: Context, config: Config): void;
//# sourceMappingURL=index.d.ts.map