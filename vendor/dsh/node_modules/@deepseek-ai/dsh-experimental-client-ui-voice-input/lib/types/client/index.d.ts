/** Browser entry for the optional speech Remote contribution and composer control. */
import type { Context } from '@deepseek-ai/cordis';
export { inject } from './mount.ts';
/**
 * Activate the experimental microphone contribution.
 * @param ctx - Client runtime.
 * @returns complete UI and Remote disposer.
 */
export declare function apply(ctx: Context): Promise<() => Promise<void>>;
//# sourceMappingURL=index.d.ts.map