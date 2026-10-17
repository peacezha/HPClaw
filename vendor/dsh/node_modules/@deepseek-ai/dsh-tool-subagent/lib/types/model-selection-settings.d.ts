/** Host-owned opt-in setting for model-selectable subagent delegation. */
import type { Volatile } from '@deepseek-ai/cordis';
import { Context, Service } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import { type AllowedModelRoute } from './model-selection.ts';
declare module '@deepseek-ai/cordis' {
    interface Context {
        /** User preference sampled when a new Session receives delegation tools. */
        subagentModelSelection: SubagentModelSelectionConfig;
    }
}
/** Stored user preference; the shipped composition defaults it off. */
export interface SubagentModelSelectionSettings {
    /** Whether newly composed top-level Sessions receive model selection. */
    enabled: boolean;
    /** Exact child LLM routes offered to newly composed top-level Sessions. */
    allowedModels: AllowedModelRoute[];
}
/** Optional deployment base for the preference. */
export interface Config {
    /** Initial enabled state inherited when the user document does not override it. */
    enabled: Volatile<boolean>;
    /** Initial route list inherited when the user document does not override it. */
    allowedModels: Volatile<AllowedModelRoute[]>;
}
/** Singleton settings owner read when delegation tools are composed for a Session. */
export declare class SubagentModelSelectionConfig extends Service {
    private config;
    static Config: z<Schemastery.ObjectS<NoInfer<{
        enabled: z<boolean, boolean, "volatile-defined">;
        allowedModels: z<NoInfer<AllowedModelRoute[]>, NoInfer<AllowedModelRoute[]>, "volatile-defined">;
    }>>, Schemastery.ObjectT<NoInfer<{
        enabled: z<boolean, boolean, "volatile-defined">;
        allowedModels: z<NoInfer<AllowedModelRoute[]>, NoInfer<AllowedModelRoute[]>, "volatile-defined">;
    }>>, "plain">;
    constructor(ctx: Context, config: Config);
    /**
     * Read a detached selection preference for the next eligible Session composition.
     * @returns the enabled state and exact allowed routes.
     */
    current(): SubagentModelSelectionSettings;
}
export declare const name = "subagent-model-selection-settings";
export default SubagentModelSelectionConfig;
//# sourceMappingURL=model-selection-settings.d.ts.map