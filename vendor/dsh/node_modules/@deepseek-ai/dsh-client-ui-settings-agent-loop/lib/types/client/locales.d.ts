/** Locale bundles for the agent loop's settings page. */
import type { SettingsFormLabels } from '@deepseek-ai/dsh-client-ui-primitives';
/** Locale keys the page renders. */
export type AgentLoopSettingsLocaleKey = 'title' | 'description' | 'maxParallel' | 'maxParallelHint' | 'overridden' | 'reset' | 'readOnly' | 'unavailable' | 'save' | 'saving' | 'saveFailed' | 'invalidNumber';
/** English copy. */
export declare const en: Record<AgentLoopSettingsLocaleKey, string>;
/** Simplified Chinese copy. */
export declare const zh: Record<AgentLoopSettingsLocaleKey, string>;
/**
 * The form frame's copy, read from this page's dictionary.
 * @param t - the page's locale reader.
 * @returns the labels the shared settings form renders.
 */
export declare function formLabels(t: (key: AgentLoopSettingsLocaleKey) => string): SettingsFormLabels;
//# sourceMappingURL=locales.d.ts.map