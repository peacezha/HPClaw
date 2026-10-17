/** Locale bundles for the web-search provider's settings page. */
import type { SettingsFormLabels } from '@deepseek-ai/dsh-client-ui-primitives';
/** Locale keys the page renders. */
export type WebSearchSettingsLocaleKey = 'title' | 'description' | 'apiKey' | 'apiKeyHint' | 'apiKeySet' | 'apiKeyUnset' | 'baseUrl' | 'baseUrlHint' | 'maxUses' | 'maxUsesHint' | 'overridden' | 'reset' | 'readOnly' | 'unavailable' | 'save' | 'saving' | 'saveFailed' | 'invalidNumber';
/** English copy. */
export declare const en: Record<WebSearchSettingsLocaleKey, string>;
/** Simplified Chinese copy. */
export declare const zh: Record<WebSearchSettingsLocaleKey, string>;
/**
 * The form frame's copy, read from this page's dictionary.
 * @param t - the page's locale reader.
 * @returns the labels the shared settings form renders.
 */
export declare function formLabels(t: (key: WebSearchSettingsLocaleKey) => string): SettingsFormLabels;
//# sourceMappingURL=locales.d.ts.map