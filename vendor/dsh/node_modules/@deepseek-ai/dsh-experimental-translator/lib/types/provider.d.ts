import type { Config } from './index.ts';
import type { AnonymousTranslationProvider, AnonymousTranslationSpec } from './types.ts';
/**
 * Identify anonymous request semantics without provider-specific language normalization.
 * @param provider - explicitly resolved endpoint route.
 * @param config - deployment endpoints; raw endpoint values are excluded from stored recipes.
 * @returns protocol revision and effective endpoint fingerprint for durable result reuse.
 */
export declare function anonymousRecipe(provider: AnonymousTranslationProvider, config: Config): string;
/**
 * Send one bounded request without cookies, credentials, redirects or provider fallback.
 * @param spec - resolved text and provider-language choices.
 * @param config - endpoints, deadline and response-byte limit.
 * @param signal - caller and service lifetime cancellation.
 * @returns provider-translated text, or a safe failure preserving cancellation.
 */
export declare function translateText(spec: AnonymousTranslationSpec, config: Config, signal: AbortSignal): Promise<string>;
//# sourceMappingURL=provider.d.ts.map