/** Staged delegation limits backed by the Host's subagent settings section. */
import type { SnapshotStore } from '@deepseek-ai/dsh-client-store';
import { type SettingsFieldState, type SettingsFormActions, type SettingsFormScope, type SettingsFormShell } from '@deepseek-ai/dsh-client-ui-primitives';
/** Host-owned delegation defaults and live capacity. */
export interface SubagentLimitsSettings {
    maxDepth: number;
    maxActiveSubagents: number;
}
/** Effective values and drafts presented by the limits card. */
export interface SubagentLimitsCardState extends SettingsFormShell {
    maxDepth: SettingsFieldState;
    maxActiveSubagents: SettingsFieldState;
}
/** Actions and observable state bound by the slot renderer. */
export interface SubagentLimitsCardFace extends SettingsFormActions {
    hooks: {
        subagentLimitsCard: SnapshotStore<SubagentLimitsCardState>;
    };
}
/** Bind two independently resettable limits to one staged settings form. */
export declare class SubagentLimitsCardController {
    private readonly form;
    private readonly store;
    /** @param scope - The Host's `subagent` settings section. */
    constructor(scope: SettingsFormScope<SubagentLimitsSettings>);
    /**
     * Bind the limits editor to the slot renderer.
     * @returns The limits snapshot and staged write actions.
     */
    inject(): SubagentLimitsCardFace;
    /** Release accepted-value subscriptions. */
    dispose(): void;
}
//# sourceMappingURL=subagent-limits-card-controller.d.ts.map