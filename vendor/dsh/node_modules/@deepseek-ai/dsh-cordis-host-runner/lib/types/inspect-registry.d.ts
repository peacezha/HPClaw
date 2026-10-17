/** Host registry for model-visible, read-only Cordis capability queries. */
import { Service } from '@deepseek-ai/cordis';
import type { Context } from '@deepseek-ai/cordis';
import type { Agent } from '@deepseek-ai/dsh-agent';
import { type JsonValue } from '@deepseek-ai/dsh-util-values';
import type { CordisInspectPlatform, CordisInspectProviderManifest, CordisInspectProviderView, CordisInspectQueryResolution, CordisInspectRequestId, CordisInspectResolveAck } from './types.ts';
/** Context supplied to a Host inspect query. */
export interface HostCordisInspectQueryContext {
    /** Tool-call cancellation. */
    signal: AbortSignal;
    /** Agent whose scoped runtime is being inspected. */
    agent: Agent;
}
/** Local registration paired with its serializable manifest. */
export interface HostCordisInspectProviderRegistration {
    /** Provider and explicit method directory. */
    manifest: CordisInspectProviderManifest;
    /** Execute one declared method. */
    query(method: string, input: JsonValue | undefined, context: HostCordisInspectQueryContext): Promise<JsonValue>;
}
declare module '@deepseek-ai/cordis' {
    interface Context {
        /** Host registry for Cordis inspect providers and Client manifest/query routing. */
        cordisInspect: CordisInspectRegistryService;
    }
}
/** Registry and cross-page router behind the two model-facing inspect tools. */
export declare class CordisInspectRegistryService extends Service {
    private readonly clientQueryTimeoutMs;
    private readonly providers;
    private readonly pending;
    private clientManifest;
    private nextRequest;
    /**
     * Register the process-global Host registry.
     * @param ctx - owning Host context.
     * @param clientQueryTimeoutMs - maximum wait for a valid Client response, in milliseconds.
     */
    constructor(ctx: Context, clientQueryTimeoutMs: number);
    /**
     * Register one Host provider.
     * @param registration - manifest and local query handler.
     * @returns idempotent disposer.
     */
    register(registration: HostCordisInspectProviderRegistration): () => void;
    /**
     * Replace the mirrored Client provider directory.
     * @param providers - complete Client manifest snapshot.
     */
    syncClientManifest(providers: readonly CordisInspectProviderManifest[]): void;
    /**
     * Return the complete known Host and Client provider directory.
     * @returns Host providers followed by the Client providers.
     */
    list(): CordisInspectProviderView[];
    /**
     * Execute one provider query on its owning platform.
     * @param platform - Host or Client runtime.
     * @param providerId - provider selected from {@link list}.
     * @param methodName - declared method name.
     * @param input - optional lossless JSON input.
     * @param agent - requesting Agent and scope.
     * @param signal - tool-call cancellation.
     * @returns provider JSON data; Client queries fail fast when Gateway has no live Client
     * and retain only the first observed failure diagnostic for timeout reporting.
     */
    query(platform: CordisInspectPlatform, providerId: string, methodName: string, input: JsonValue | undefined, agent: Agent, signal: AbortSignal): Promise<JsonValue>;
    /**
     * Accept the first valid Client response for a pending query.
     * @param agent - Agent whose Session owns the query.
     * @param requestId - Pending Client query identity.
     * @param resolution - Client provider result or failure.
     * @returns acknowledgement with accepted true only for a success that settles the query; only the first failure diagnostic is retained.
     */
    resolveClientQuery(agent: Agent, requestId: CordisInspectRequestId, resolution: CordisInspectQueryResolution): CordisInspectResolveAck;
    private queryClient;
}
//# sourceMappingURL=inspect-registry.d.ts.map