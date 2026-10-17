/** Optional Remote contribution and reasoning-slot registration lifecycle. */
import type { Context } from '@deepseek-ai/cordis';
import type { TypertRemoteContribution } from '@deepseek-ai/dsh-typert-protocol';
/** Services required to mount the optional Remote and UI contributions. */
export declare const inject: string[];
/**
 * Mount Session-bound translation and withdraw UI before its generated Remote.
 * @param ctx - Client plugin lifetime.
 * @param contribution - generated controller Remote definitions.
 * @returns disposer that removes both contributions.
 */
export declare function mountTranslation(ctx: Context, contribution: TypertRemoteContribution): Promise<() => Promise<void>>;
//# sourceMappingURL=mount.d.ts.map