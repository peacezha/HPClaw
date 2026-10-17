/**
 * Image offload executor for the compaction seam. When an image-capable route
 * fails a request with `IMAGE_OFFLOAD_REQUIRED`, the plugin records one
 * `image/offload` decision selecting the oldest retained input occurrences
 * and retries through the agent or compaction summary error waterfall. Every route
 * sends placeholder text for those occurrences in subsequent requests.
 *
 * @module @deepseek-ai/dsh-compaction-image-offload
 */
import type { Context } from '@deepseek-ai/cordis';
export declare const name = "compaction-image-offload";
export declare const inject: string[];
/**
 * Mount agent and summary recovery listeners without configuration.
 * @param ctx - the plugin context.
 */
export declare function apply(ctx: Context): void;
//# sourceMappingURL=index.d.ts.map