/** Native directory flow using the local desktop bridge or the Host's OS chooser. */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
/** Required services (cordis fiber inject): the slot registry and workspace UI service. */
export declare const inject: string[];
/**
 * Client plugin body: register the renderless native flow into both
 * directory-flow holes through `slots.inject()` because the ui-workspace
 * entries may activate later or replace their declarations.
 * @param ctx - client root context.
 */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map