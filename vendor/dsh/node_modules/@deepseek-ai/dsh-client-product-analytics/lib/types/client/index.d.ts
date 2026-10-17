/** Desktop renderer analytics sender; browser applications have no collection capability. */
import { Service, type Context } from '@deepseek-ai/cordis';
export type {} from '@deepseek-ai/dsh-client-product-analytics/remote';
import type { ProductEventMap } from '../events.ts';
export type { ProductEvent, ProductEventMap, TrackProductEvent } from '../events.ts';
declare module '@deepseek-ai/cordis' {
    interface Context {
        productAnalytics: DesktopAnalytics;
    }
}
declare class DesktopAnalytics extends Service {
    private collecting;
    private readonly submit;
    constructor(ctx: Context);
    /** Whether the synchronized Host configuration currently permits collection. */
    get enabled(): boolean;
    /**
     * Send an event without retaining it for reconnect or later enablement.
     * @param name - event name.
     * @param attributes - approved business fields.
     * @param timestamp - occurrence time; defaults to the current time.
     */
    track<K extends keyof ProductEventMap>(name: K, attributes: ProductEventMap[K], timestamp?: number): void;
}
/** Analytics consumes authenticated RPC and its reconnecting policy stream. */
export declare const inject: string[];
/** @param ctx - browser application context. */
export declare function apply(ctx: Context): void;
//# sourceMappingURL=index.d.ts.map