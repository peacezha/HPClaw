/** Native-route admission and independent audited Flash translation without Agent history. */
import { type Context } from '@deepseek-ai/cordis';
import type { Config } from './index.ts';
import type { PaidTranslationSpec, TranslationIdentity, TranslationProvider } from './types.ts';
import type { TranslationLog } from './storage.ts';
/**
 * Identify fixed native translation semantics without inspecting credentials or a model catalog.
 * @param config - independent translation output-token limit.
 * @returns fixed Flash model, literal-text prompt revision, disabled thinking, and requested output cap.
 */
export declare function deepseekRecipe(config: Config): string;
/**
 * Inspect native owners, credentials and exact Flash catalogs without inference.
 * @param ctx - translator context with optional provider services.
 * @param config - deadline for discovery.
 * @param signal - caller and service cancellation.
 * @param track - translator-owned settlement tracking for lookups that cannot accept cancellation.
 * @returns anonymous choices followed by eligible explicitly named paid routes.
 */
export declare function availablePaidProviders(ctx: Context, config: Config, signal: AbortSignal, track: (work: Promise<unknown>) => void): Promise<readonly TranslationProvider[]>;
/**
 * Audit and dispatch exactly one native Flash request with disabled thinking.
 * @param ctx - translator context with optional native services.
 * @param spec - explicit paid route, fragment, target language and existing Session.
 * @param config - paid deadline/output-token cap and shared response-byte limit.
 * @param signal - caller and service cancellation.
 * @param track - translator-owned settlement tracking for lookups that cannot accept cancellation.
 * @param log - common Session storage for this already cache-checked attempt.
 * @param identity - exact fragment, languages, route, and semantic recipe.
 * @returns non-empty text from a stop finish; all other outcomes reject safely.
 */
export declare function translateWithDeepSeek(ctx: Context, spec: PaidTranslationSpec, config: Config, signal: AbortSignal, track: (work: Promise<unknown>) => void, log: TranslationLog, identity: TranslationIdentity): Promise<string>;
//# sourceMappingURL=deepseek.d.ts.map