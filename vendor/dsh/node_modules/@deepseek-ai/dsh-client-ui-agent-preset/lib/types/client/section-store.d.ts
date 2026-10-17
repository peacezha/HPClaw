/** Preset roster, the new-task default and the read-only composition viewer for the settings section. */
import type { Context } from '@deepseek-ai/cordis';
import { type SnapshotStore } from '@deepseek-ai/dsh-client-store';
import type { AgentPresetRow } from '@deepseek-ai/dsh-agent-preset-registry/types';
/** The read-only composition viewer over one preset. */
export interface PresetView {
    /** The preset being read. */
    id: string;
    /** Display name the preset published, or its id. */
    title: string;
    /** The declared child plugin list as YAML. */
    content: string;
}
/** Settings page state. */
export interface AgentPresetSectionState {
    status: 'idle' | 'loading' | 'ready' | 'error';
    error: string | null;
    saving: boolean;
    rows: readonly AgentPresetRow[];
    /** The open viewer, or null. */
    view: PresetView | null;
}
/** Loads the roster, writes the default, and reads one composition at a time. */
export declare class AgentPresetSectionController {
    private readonly ctx;
    /** Observable roster, selection and viewer state. */
    readonly store: SnapshotStore<AgentPresetSectionState>;
    private loading;
    private pendingSave;
    private viewRequest;
    constructor(ctx: Context);
    private set;
    /** Refresh the roster; concurrent calls share one read.
     * @returns Once the roster read settles.
     */
    load(): Promise<void>;
    private readRoster;
    /** Open one preset's declared composition in the viewer.
     * @param id Preset to read.
     * @returns Once the read settles; a current failure lands in `error`, while a read superseded by close or another read is ignored.
     */
    view(id: string): Promise<void>;
    /** Close the viewer. */
    closeView(): void;
    /** Set the default and synchronize the current blank task when supplied.
     * @param id Selected default.
     * @param sync Blank-session synchronization callback.
     * @returns Once saved and refreshed.
     */
    makeDefault(id: string, sync?: (id: string) => Promise<string | undefined>): Promise<void>;
    /** Replace a hidden built-in default after accepted Coding Tools changes.
     * @param shouldReset Rechecked after waiting; false when tools are enabled or this owner is disposed.
     * @returns Once the conditional save settles; errors remain visible in the section.
     */
    reconcileCodingTools(shouldReset: () => boolean): Promise<void>;
    private save;
}
//# sourceMappingURL=section-store.d.ts.map