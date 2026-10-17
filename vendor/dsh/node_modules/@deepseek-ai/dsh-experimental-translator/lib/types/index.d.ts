/** Anonymous text translation with optional durable provider-independent Session results. */
import { Context, Service } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import type { TranslationProvider, TranslationRequest, TranslationSpec } from './types.ts';
export type * from './types.ts';
export { TranslationError } from './error.ts';
declare module '@deepseek-ai/cordis' {
    interface Context {
        /** Experimental text translator with optional durable Session reuse. */
        translator: Translator;
    }
}
/** Routing and bounds for anonymous requests and independent native model translation. */
export interface Config {
    /** Provider selected when a consumer omits it. */
    provider: TranslationProvider;
    /** Google-compatible anonymous translation endpoint. */
    googleEndpoint: string;
    /** Bing-compatible Microsoft Edge browser translation endpoint. */
    bingEndpoint: string;
    /** Deadline covering the request and complete response body, in milliseconds. */
    timeoutMs: number;
    /** Maximum UTF-16 code units per request; at least two to admit one supplementary-plane character. */
    maxTextChars: number;
    /** Maximum anonymous JSON-body bytes or paid assembled UTF-8 translation bytes. */
    maxResponseBytes: number;
    /** Deadline for native admission and complete translation output, in milliseconds. */
    deepseekTimeoutMs: number;
    /** Requested output-token cap for independent native Flash translation. */
    deepseekMaxOutputTokens: number;
}
/** One Host service with explicit routing, cancellation and quiescent unload. */
export default class Translator extends Service {
    private readonly config;
    static Config: z<Schemastery.ObjectS<NoInfer<{
        provider: z<"google" | "bing" | "deepseek-account" | "deepseek-official", "google" | "bing" | "deepseek-account" | "deepseek-official", "defined">;
        googleEndpoint: z<string, string, "defined">;
        bingEndpoint: z<string, string, "defined">;
        timeoutMs: z<number, number, "defined">;
        maxTextChars: z<number, number, "defined">;
        maxResponseBytes: z<number, number, "defined">;
        deepseekTimeoutMs: z<number, number, "defined">;
        deepseekMaxOutputTokens: z<number, number, "defined">;
    }>>, Schemastery.ObjectT<NoInfer<{
        provider: z<"google" | "bing" | "deepseek-account" | "deepseek-official", "google" | "bing" | "deepseek-account" | "deepseek-official", "defined">;
        googleEndpoint: z<string, string, "defined">;
        bingEndpoint: z<string, string, "defined">;
        timeoutMs: z<number, number, "defined">;
        maxTextChars: z<number, number, "defined">;
        maxResponseBytes: z<number, number, "defined">;
        deepseekTimeoutMs: z<number, number, "defined">;
        deepseekMaxOutputTokens: z<number, number, "defined">;
    }>>, "plain">;
    private readonly lifetime;
    private readonly pending;
    private readonly storage;
    constructor(ctx: Context, config: Config);
    /** Maximum UTF-16 code units accepted by one provider request. */
    get maxTextChars(): number;
    /**
     * Inspect eligible native routes without inference; saved results remain readable for unavailable routes.
     * @param signal - optional caller cancellation, combined with service disposal.
     * @returns anonymous choices followed by eligible explicitly selected paid routes.
     */
    availableProviders(signal?: AbortSignal): Promise<readonly TranslationProvider[]>;
    /**
     * Resolve provider and source-language defaults without sending text.
     * @param request - consumer text, destination and optional routing choices.
     * @returns a complete specification; exceeding `maxTextChars` throws `TRANSLATION_TEXT_LIMIT`.
     */
    resolve(request: TranslationRequest): TranslationSpec;
    /**
     * Translate one resolved specification; the selected provider receives its text.
     * @param spec - complete routing and language choices from `resolve()`.
     * @param signal - optional caller cancellation, combined with service disposal.
     * @returns translated plain text, durably retained before return when a Session is supplied.
     * An uncached supplied Session must be active; otherwise rejects with `TRANSLATION_SESSION_INACTIVE` before dispatch.
     * Rejects provider/storage/limit failures and preserves cancellation reasons.
     */
    translate(spec: TranslationSpec, signal?: AbortSignal): Promise<string>;
    private signal;
    private track;
    private assertTextLimit;
}
//# sourceMappingURL=index.d.ts.map