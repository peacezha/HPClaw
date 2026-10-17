/**
 * Read or change the calling Session's working directory.
 * @module @deepseek-ai/dsh-tool-working-directory
 */
import type { Context } from '@deepseek-ai/cordis';
/** Cordis plugin name. */
export declare const name = "tool-working-directory";
/** Services used by the tool. */
export declare const inject: string[];
/**
 * Register the working-directory tool for this composition.
 * @param ctx - context providing the tool registry and directory owner.
 */
export declare function apply(ctx: Context): void;
//# sourceMappingURL=index.d.ts.map