/** Host registry-response probing for the plugin installation dialog. */
import type { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
declare module '@deepseek-ai/cordis' {
    interface Context {
        pluginRegistryProbe: PluginRegistryProbe;
    }
}
/** Registry-probe deadline and process-local cache policy. */
export interface Config {
    /** Whether the dialog can compare the public npm registries. */
    registryProbeEnabled: boolean;
    /** Deadline for the parallel HTTPS probes, including response cleanup. */
    registryProbeTimeoutMs: number;
    /** Lifetime of a winning registry or unavailable result. */
    registryProbeCacheTtlMs: number;
}
/** Compares public registry responses on the Host; the Client owns the initial selection. */
export default class PluginRegistryProbe extends TypertRemoteService {
    private readonly config;
    static Config: z<Partial<Config>, Config>;
    private readonly lifetime;
    private pending;
    private cached;
    constructor(ctx: Context, config: Config);
    /**
     * Race npm and npmmirror HTTPS ping responses through the Host's fetch proxy.
     * Concurrent readers share a probe; a winner cancels and awaits the other request.
     * @returns the first registry with a successful response, or null when disabled or neither responds successfully; results are cached.
     * @throws rejects when the service has been unloaded.
     */
    fastest(): Promise<string | null>;
    private probe;
}
//# sourceMappingURL=index.d.ts.map