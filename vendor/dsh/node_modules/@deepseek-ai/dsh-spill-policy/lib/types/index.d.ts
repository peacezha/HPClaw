/**
 * Token-budgeted tool content with recoverable text and image addresses.
 * Post-execute policies settle before retention; canonical program values
 * remain intact. Missing recovery storage or image pricing keeps the original
 * content and reports the reason through the logger.
 * @module @deepseek-ai/dsh-spill-policy
 */
import type { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
export type { SpillPolicyExec } from './types.ts';
/** Optional result-retention budget. */
export interface Config {
    /** Maximum estimated tokens in a retained result, including image descriptors and omission notices. Omitted disables retention. */
    maxInlineTokens?: number;
}
/** Cordis plugin identity. */
export declare const name = "spill-policy";
/** Tools own both model-facing results and PTC dispatch logs. */
export declare const inject: string[];
export declare const Config: z<Config>;
/**
 * Mount token retention for accepted tool results and PTC log copies.
 * @param ctx - tool registry and optional pricing, filesystem, attachment, and spill services.
 * @param config - maximum estimated result tokens; omission disables the plugin.
 */
export declare function apply(ctx: Context, config: Config): void;
//# sourceMappingURL=index.d.ts.map