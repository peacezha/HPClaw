/** API-key authentication and credential-gated discovery for the official DeepSeek route. */
import type { Context } from '@deepseek-ai/cordis';
import { Config } from './config.ts';
export { Config, plainOptions, resolveAdapterOptions } from './config.ts';
export type { Options, ResolvedDeepSeekOptions } from './config.ts';
export declare const name = "llm-deepseek-api-key";
export declare const inject: string[];
export declare function apply(ctx: Context, config: Config): void;
//# sourceMappingURL=index.d.ts.map