import { Context, Service } from '@deepseek-ai/cordis';
import type { Entry } from '@deepseek-ai/cordis-plugin-loader';
declare module '@deepseek-ai/cordis' {
    interface Context {
        /** Persistent edits to the active profile's plugin configuration. */
        configEditor: ConfigEditor;
    }
}
/** Persist complete raw configs and apply them through the normal Loader path. */
export declare class ConfigEditor extends Service {
    private readonly ownerContext;
    static inject: string[];
    constructor(ownerContext: Context);
    /** The profile patch edited by this service. */
    get documentPath(): string;
    /** Addressable profile rows; nested Includes have independent configuration ownership.
     * @returns Active entries with unique profile patch ids.
     */
    entries(): Entry[];
    /** Read inherited and explicit profile values for the active entries.
     * @returns Detached layer values alongside their Loader entries.
     */
    configuration(): Array<{
        entry: Entry;
        inherited: Record<string, unknown>;
        override: Record<string, unknown>;
    }>;
    private inherited;
    /** Validate, persist, and reconcile a plugin's next config; ordinary fields keep normal lifecycle rules.
     * @param entry Current Loader entry, also used to detect replacement during the write.
     * @param change Derive a raw config from the current entry and its inherited layer.
     * @returns Fulfillment after Loader reconciliation completes.
     */
    edit(entry: Entry, change: (current: Record<string, unknown>, inherited: Record<string, unknown>) => Record<string, unknown>): Promise<void>;
}
export default ConfigEditor;
//# sourceMappingURL=index.d.ts.map