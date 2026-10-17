/** Locale-owned copy for reasoning translation and its preferences. */
import type { SettingsFormLabels } from '@deepseek-ai/dsh-client-ui-primitives';
/** Dictionary namespace for this plugin. */
export declare const NS = "cotTranslation";
/** English copy and key source. */
export declare const en: {
    provider: string;
    google: string;
    bing: string;
    deepseekAccount: string;
    deepseekOfficial: string;
    providerUnavailableOption: string;
    providerUnavailable: string;
    paidNotice: string;
    anonymousNotice: string;
    targetLanguage: string;
    targetLanguageHint: string;
    privacy: string;
    translation: string;
    original: string;
    retry: string;
    failed: string;
    translating: string;
    invalidProvider: string;
    invalidLanguage: string;
    overridden: string;
    reset: string;
    unavailable: string;
    readOnly: string;
    saveFailed: string;
    save: string;
    saving: string;
    copy: string;
    copied: string;
    codeTitle: string;
    wrap: string;
    unwrap: string;
    footnotes: string;
};
/** Locale dictionary key union. */
export type CotTranslationKey = keyof typeof en;
/** Chinese copy. */
export declare const zh: Record<CotTranslationKey, string>;
/**
 * Read shared form chrome from the plugin dictionary.
 * @param t - current locale reader.
 * @returns localized form labels.
 */
export declare function formLabels(t: (key: CotTranslationKey) => string): SettingsFormLabels;
//# sourceMappingURL=locales.d.ts.map