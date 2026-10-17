import type { ConfigForm } from '@deepseek-ai/dsh-client-ui-settings/client';
/** Fields exposed by the Session-log plugin. */
export interface UploadSettings {
    enabled: boolean;
}
/** Mutation state shared by the preference row and shell notice. */
export interface UploadMutation {
    busy: boolean;
    notice: 'saved' | 'failed' | null;
    sequence: number;
}
/** Writes the Host setting without publishing an optimistic upload state. */
export declare class UploadPreference {
    private readonly form;
    /** Observable mutation outcome. */
    readonly state: import("@deepseek-ai/dsh-client-store").SnapshotStore<UploadMutation>;
    /** @param form - Host-owned configuration form. */
    constructor(form: ConfigForm<UploadSettings>);
    /**
     * Persist enablement; refusal or transport failure leaves the accepted value visible.
     * @param enabled - requested upload state.
     * @returns completion after the write settles.
     */
    setEnabled(enabled: boolean): Promise<void>;
    /** Clear the displayed mutation notice. */
    dismiss(): void;
}
//# sourceMappingURL=upload-preference.d.ts.map