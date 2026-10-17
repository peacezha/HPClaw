/** Shared presentation and actions for the two Host-owned Subagent settings sections. */
import type { SettingsFormShell } from '@deepseek-ai/dsh-client-ui-primitives';
import type { SubagentLimitsCardFace, SubagentLimitsCardState } from './subagent-limits-card-controller.ts';
import type { SubagentModelSelectionCardFace, SubagentModelSelectionCardState } from './subagent-model-selection-card-controller.ts';
/** Both existing form sources and the actions exposed by one Subagent card. */
export interface SubagentCardFace {
    hooks: SubagentLimitsCardFace['hooks'] & SubagentModelSelectionCardFace['hooks'];
    editLimit: SubagentLimitsCardFace['edit'];
    resetLimit: SubagentLimitsCardFace['resetField'];
    toggleEnabled: SubagentModelSelectionCardFace['toggleEnabled'];
    toggleModel: SubagentModelSelectionCardFace['toggleModel'];
    retryCatalog: SubagentModelSelectionCardFace['retryCatalog'];
    /** Save valid drafts through their owning namespace controllers. */
    save: () => void;
    /** Discard both drafts without changing persisted settings. */
    discard: () => void;
}
/**
 * Derive the shared card state without duplicating either form's subscriptions.
 * @param limits - Current delegation-limit form.
 * @param models - Current model-authorization form.
 * @returns Availability and settlement across the sections this Host serves.
 */
export declare function subagentCardShell(limits: SubagentLimitsCardState, models: SubagentModelSelectionCardState): SettingsFormShell;
/**
 * Compose one card from the existing forms; each write retains its namespace revision fence.
 * @param limits - Limit form source and actions.
 * @param models - Model form source and actions.
 * @returns Framework-bound sources and shared save/discard actions.
 */
export declare function subagentCardFace(limits: SubagentLimitsCardFace, models: SubagentModelSelectionCardFace): SubagentCardFace;
//# sourceMappingURL=subagent-card-controller.d.ts.map