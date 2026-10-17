/** Shared Web and desktop developer-tool preference stored by the Host. */
import z from '@deepseek-ai/schemastery';
/** Namespace for developer UI and HTML preview capabilities. */
export declare const DEVELOPER_TOOLS_NAMESPACE = "ui-settings";
/** Persisted developer-tool choice. */
export interface DeveloperToolsSettings {
    /** Enable diagnostic views, preset selection, change summaries and scripted HTML previews. */
    enabled: boolean;
}
/** New installations and missing values enable the full interface. */
export declare const DeveloperToolsSettingsFields: {
    enabled: z<boolean, boolean, "defined">;
};
/** Schema for shared configuration values. */
export declare const DeveloperToolsSettingsSchema: z<Schemastery.ObjectS<NoInfer<{
    enabled: z<boolean, boolean, "defined">;
}>>, Schemastery.ObjectT<NoInfer<{
    enabled: z<boolean, boolean, "defined">;
}>>, "plain">;
//# sourceMappingURL=developer-tools-settings.d.ts.map