/** Web SSE transport for page-owned client entry reconciliation and rebuilt code replacement. */
import type { Context } from '@deepseek-ai/cordis';
export type { PluginsEventFrame } from '../events.ts';
/** Cordis plugin name. */
export declare const name = "client-hmr";
/** Required service: the client module system whose entry controller handles received frames. */
export declare const inject: string[];
/**
 * Forward graph snapshots and rebuilds to the page's shared serial controller. The event stream arrives through the
 * shell transport when the page has one, otherwise through the browser `EventSource`.
 * @param ctx - Plugin context with the client module system.
 */
export declare function apply(ctx: Context): void;
//# sourceMappingURL=index.d.ts.map