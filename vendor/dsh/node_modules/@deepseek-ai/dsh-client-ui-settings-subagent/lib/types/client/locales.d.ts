/** Locale bundles for the Subagent settings page. */
import type { SettingsFormLabels } from '@deepseek-ai/dsh-client-ui-primitives';
/** Locale keys the page renders. */
export type SubagentSettingsLocaleKey = 'overridden' | 'reset' | 'readOnly' | 'unavailable' | 'save' | 'saving' | 'saveFailed' | 'subagentTitle' | 'subagentDescription' | 'subagentLimitsTitle' | 'subagentMaxDepth' | 'subagentDepthHelpLabel' | 'subagentDepthHelp' | 'subagentDepthZero' | 'subagentDepthOne' | 'subagentDepthOverride' | 'subagentMaxActive' | 'subagentCapacityHelpLabel' | 'subagentCapacityHelp' | 'subagentDepthInvalid' | 'subagentCapacityInvalid' | 'subagentModelSelectionTitle' | 'subagentModelSelectionToggle' | 'subagentModelSelectionChoose' | 'subagentModelSelectionAllowed' | 'subagentModelSelectionLoading' | 'subagentModelSelectionLoadFailed' | 'subagentModelSelectionRetry' | 'subagentModelSelectionPartial' | 'subagentModelSelectionUnavailable' | 'subagentModelSelectionUnavailableGroup' | 'subagentModelSelectionEmpty' | 'subagentModelSelectionRequired' | 'subagentModelSelectionConflict' | 'subagentModelSelectionOff';
/** English copy. */
export declare const en: Record<SubagentSettingsLocaleKey, string>;
/** Simplified Chinese copy. */
export declare const zh: Record<SubagentSettingsLocaleKey, string>;
/**
 * The form frame's copy, read from this page's dictionary.
 * @param t - the page's locale reader.
 * @returns the labels the shared settings form renders.
 */
export declare function formLabels(t: (key: SubagentSettingsLocaleKey) => string): SettingsFormLabels;
//# sourceMappingURL=locales.d.ts.map