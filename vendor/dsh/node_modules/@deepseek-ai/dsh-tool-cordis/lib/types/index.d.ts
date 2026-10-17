/** Read-only Host and Client runtime API discovery for plugin development. */
import type { Context } from '@deepseek-ai/cordis';
export declare const name = "tool-cordis";
export declare const inject: string[];
/** Register read-only runtime inspection tools over the Host providers that
 * `@deepseek-ai/dsh-tool-cordis/host` registers once per process.
 * @param ctx Agent-scoped registration context.
 */
export declare function apply(ctx: Context): void;
//# sourceMappingURL=index.d.ts.map