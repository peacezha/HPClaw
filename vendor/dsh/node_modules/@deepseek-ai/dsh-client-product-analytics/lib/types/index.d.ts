/** Desktop-only analytics RPC and live compaction collection. */
import { type Context, type Volatile } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import type { ProductEvent } from './events.ts';
/** Application-owned collection policy; no user settings surface. */
export interface Config {
    /** Live application collection policy; ordinary Web does not mount this service. */
    enabled: Volatile<boolean>;
    /** Running Desktop release, absent when unavailable. */
    appVersion?: string;
    /** Maximum execution time per static environment query, in milliseconds. */
    environmentQueryTimeoutMillis: number;
    /** Maximum captured bytes per environment query output stream. */
    environmentQueryMaxOutputBytes: number;
}
declare module '@deepseek-ai/cordis' {
    interface Context {
        productAnalytics: ProductAnalytics;
    }
}
/** Authenticated event intake; disabled instances do not inspect identity or accept new events. */
export default class ProductAnalytics extends TypertRemoteService {
    private readonly config;
    static inject: string[];
    static Config: z<Schemastery.ObjectS<NoInfer<{
        enabled: z<boolean, boolean, "volatile-defined">;
        appVersion: z<string, string, "plain">;
        environmentQueryTimeoutMillis: z<number, number, "defined">;
        environmentQueryMaxOutputBytes: z<number, number, "defined">;
    }>>, Schemastery.ObjectT<NoInfer<{
        enabled: z<boolean, boolean, "volatile-defined">;
        appVersion: z<string, string, "plain">;
        environmentQueryTimeoutMillis: z<number, number, "defined">;
        environmentQueryMaxOutputBytes: z<number, number, "defined">;
    }>>, "plain">;
    private active;
    private readonly environmentLifetime;
    private environment;
    private readonly listeners;
    constructor(ctx: Context, config: Config);
    /**
     * Read the collection policy.
     * @returns whether this Host currently accepts Desktop analytics.
     */
    enabled(): boolean;
    /**
     * Stream the effective policy initially and after live configuration edits.
     * @param signal - subscriber lifetime.
     * @returns current policy values until cancellation or service disposal.
     */
    watchPolicy(signal: AbortSignal): AsyncIterable<boolean>;
    /**
     * Submit selected Desktop fields with cached static environment and fresh identity.
     * The first intake waits for bounded environment queries; concurrent intakes share them.
     * Missing identity is omitted; failed environment fields carry fixed reasons.
     * @param event - typed product event without message contents or credentials.
     * @returns after local submission; no delivery or warehouse acknowledgement.
     */
    report(event: ProductEvent): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map