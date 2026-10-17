/** Locale bundles for the shell executor's settings page. */
import type { SettingsFormLabels } from '@deepseek-ai/dsh-client-ui-primitives';
/** Locale keys the page renders. */
export type ShellSettingsLocaleKey = 'title' | 'description' | 'timeoutMs' | 'timeoutMsHint' | 'maxOutputBytes' | 'maxOutputBytesHint' | 'overridden' | 'reset' | 'readOnly' | 'unavailable' | 'save' | 'saving' | 'saveFailed' | 'invalidNumber';
/** English copy. */
export declare const en: Record<ShellSettingsLocaleKey, string>;
/** Simplified Chinese copy. */
export declare const zh: Record<ShellSettingsLocaleKey, string>;
/**
 * The form frame's copy, read from this page's dictionary.
 * @param t - the page's locale reader.
 * @returns the labels the shared settings form renders.
 */
export declare function formLabels(t: (key: ShellSettingsLocaleKey) => string): SettingsFormLabels;
//# sourceMappingURL=locales.d.ts.map