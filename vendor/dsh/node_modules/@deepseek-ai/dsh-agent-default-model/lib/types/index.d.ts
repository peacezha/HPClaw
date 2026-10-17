import type { Volatile } from '@deepseek-ai/cordis';
import { Context, Service } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import type { ModelSelection } from '@deepseek-ai/dsh-agent';
declare module '@deepseek-ai/cordis' {
    interface Context {
        /** Default model selection for Agents created without an explicit model. */
        agentDefaultModel: AgentDefaultModelConfig;
    }
}
/** Default model selection supplied by plugin configuration. */
export interface Config {
    /** Registered provider route. */
    provider: Volatile<string>;
    /** Provider-owned model id. */
    model: Volatile<string>;
    /** Adapter-owned reasoning effort; omission follows the provider default. */
    reasoningEffort: Volatile<string | undefined>;
}
/**
 * Owns the default model selection independently of any Host or transport.
 * Each operation reads the owning Config references.
 */
export declare class AgentDefaultModelConfig extends Service {
    private readonly ownerContext;
    private config;
    private saves;
    static Config: z<Schemastery.ObjectS<NoInfer<{
        provider: z<string, string, "volatile-defined">;
        model: z<string, string, "volatile-defined">;
        reasoningEffort: z<string, string, "volatile">;
    }>>, Schemastery.ObjectT<NoInfer<{
        provider: z<string, string, "volatile-defined">;
        model: z<string, string, "volatile-defined">;
        reasoningEffort: z<string, string, "volatile">;
    }>>, "plain">;
    constructor(ownerContext: Context, config: Config);
    /**
     * Read the current default model selection.
     * @returns a detached provider, model, and optional reasoning selection.
     */
    currentSelection(): ModelSelection;
    /**
     * Save the complete default model selection. A deployment without a configuration
     * editor keeps its composition entry. Saves commit in submission order; a failed
     * save rejects its caller without blocking later saves.
     * @param next - resolved selection accepted by an entry point.
     * @returns fulfillment after the optional profile write settles.
     */
    saveSelection(next: ModelSelection): Promise<void>;
}
export default AgentDefaultModelConfig;
//# sourceMappingURL=index.d.ts.map