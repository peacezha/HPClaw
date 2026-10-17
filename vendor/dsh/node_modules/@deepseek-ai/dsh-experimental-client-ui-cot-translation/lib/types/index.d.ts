import { Context, type Volatile } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import type { TranslationRequest } from '@deepseek-ai/dsh-experimental-translator/types';
import type { CotTranslationPreferences, CotTranslationSnapshot } from './types.ts';
/** Live preferences presented on the bundle's Plugins page. */
export interface Config {
    /** Explicit translation provider, defaulting to Bing. */
    provider: Volatile<CotTranslationPreferences['provider']>;
    /** Target language code; auto follows the browser UI locale. */
    targetLanguage: Volatile<string>;
}
declare module '@deepseek-ai/cordis' {
    interface Context {
        /** Remote consumer of the experimental translation service. */
        cotTranslation: CotTranslationController;
    }
}
/** Optional reasoning translation delegates Session-bound storage to the translator. */
export default class CotTranslationController extends TypertRemoteService {
    private readonly config;
    static inject: string[];
    static Config: z<Schemastery.ObjectS<NoInfer<{
        provider: z<"google" | "bing" | "deepseek-account" | "deepseek-official", "google" | "bing" | "deepseek-account" | "deepseek-official", "volatile-defined">;
        targetLanguage: z<string, string, "volatile-defined">;
    }>>, Schemastery.ObjectT<NoInfer<{
        provider: z<"google" | "bing" | "deepseek-account" | "deepseek-official", "google" | "bing" | "deepseek-account" | "deepseek-official", "volatile-defined">;
        targetLanguage: z<string, string, "volatile-defined">;
    }>>, "plain">;
    constructor(ctx: Context, config: Config);
    /**
     * Read accepted translation preferences and the current request limit without sending text.
     * @param signal - browser query cancellation or Remote contribution withdrawal.
     * @returns authoritative preferences, eligible routes, and maximum UTF-16 text length per request.
     */
    limits(signal: AbortSignal): Promise<CotTranslationSnapshot>;
    /**
     * Translate one displayed fragment through the reader's selected provider.
     * @param request - original text and Session identity supplied by the Client; provider and explicit
     * target language match accepted preferences, while auto uses the browser locale.
     * @param signal - browser cancellation or Remote contribution withdrawal.
     * @returns translated text; an uncached inactive Session joins ordinary GUI activation before retry.
     * Failures omit the source and provider response. Cancellation stops this caller's wait, not shared activation.
     */
    translate(request: TranslationRequest, signal: AbortSignal): Promise<string>;
    private resolveSelected;
}
//# sourceMappingURL=index.d.ts.map