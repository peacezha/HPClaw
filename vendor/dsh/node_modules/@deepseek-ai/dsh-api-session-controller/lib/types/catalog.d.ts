/** Shared projection of the live LLM registry into the browser model catalog. */
import type { Context } from '@deepseek-ai/cordis';
import type { ModelCatalog, ModelSelection } from './types.ts';
/**
 * Build the browser model catalog without requiring a Session.
 * @param ctx - Host context carrying the live LLM registry.
 * @param defaultSelection - deployment default used before a Session selects a model.
 * @returns successful non-empty provider groups and isolated provider failures.
 */
export declare function buildModelCatalog(ctx: Context, defaultSelection?: ModelSelection): Promise<ModelCatalog>;
/**
 * Check a GUI selection against the current available provider catalog.
 * @param ctx - Host LLM registry.
 * @param selection - stored or explicitly requested selection.
 * @returns whether the exact model is currently advertised as available.
 */
export declare function modelAvailable(ctx: Context, selection: ModelSelection): Promise<boolean>;
/**
 * Check configured provider API-key references independently of model availability.
 * @param ctx - Host registry, settings, and credential services.
 * @returns whether any API-key provider has a configured credential.
 */
export declare function hasProviderApiKey(ctx: Context): Promise<boolean>;
//# sourceMappingURL=catalog.d.ts.map