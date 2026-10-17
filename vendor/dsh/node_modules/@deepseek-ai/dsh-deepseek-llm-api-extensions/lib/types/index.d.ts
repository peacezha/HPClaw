/**
 * DeepSeek LLM API extension registry: plugins own independent top-level request
 * fields while the official adapter performs one preparation and acceptance transaction.
 * @module @deepseek-ai/dsh-deepseek-llm-api-extensions
 */
import { Context, Service } from '@deepseek-ai/cordis';
import type { DeepSeekLlmApiExtensionMap, DeepSeekLlmApiExtensionProvider, DeepSeekLlmApiExtensionRequest, PreparedDeepSeekLlmApiExtensions } from './types.ts';
export type * from './types.ts';
declare module '@deepseek-ai/cordis' {
    interface Context {
        deepseekLlmApiExtensions: DeepSeekLlmApiExtensionRegistry;
    }
}
/** Registry of independently owned top-level fields for official DeepSeek requests. */
export declare class DeepSeekLlmApiExtensionRegistry extends Service {
    private readonly providers;
    /** Fields whose preparation failure was already logged; later failures stay silent. */
    private readonly warnedFields;
    constructor(ctx: Context);
    /**
     * Register the sole provider of one top-level request field. Registration is effect-scoped.
     * @param field - declaration-merged field owned by the provider.
     * @param provider - request-time field preparation and optional acceptance behavior.
     * @returns disposer that releases the field.
     */
    register<K extends keyof DeepSeekLlmApiExtensionMap>(field: K, provider: DeepSeekLlmApiExtensionProvider<DeepSeekLlmApiExtensionMap[K]>): () => Promise<void>;
    /**
     * Prepare every currently registered field from one immutable base request.
     * A provider whose preparation throws, or whose value cannot be cloned, is omitted
     * from this request; the first such failure per field is logged. Only cancellation rejects. Field values are cloned
     * and frozen; providers retain no mutable alias to the outgoing request.
     * @param request - exact serialized request facts before extension fields.
     * @returns detached fields and their idempotent joint acceptance transaction.
     */
    prepare(request: DeepSeekLlmApiExtensionRequest): Promise<PreparedDeepSeekLlmApiExtensions>;
}
export default DeepSeekLlmApiExtensionRegistry;
//# sourceMappingURL=index.d.ts.map