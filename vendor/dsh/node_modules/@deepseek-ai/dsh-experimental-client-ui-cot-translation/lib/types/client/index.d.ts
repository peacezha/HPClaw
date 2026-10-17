/** Browser entry for optional translation of expanded reasoning. */
import type { Context } from '@deepseek-ai/cordis';
export { inject } from './mount.ts';
export type { CotTranslationPreferences } from '../preferences.ts';
export type { CotTranslationKey } from './locales.ts';
export type { TranslationBodyInjected, TranslationBodyProps } from './TranslationBody.tsx';
export type { TranslationFormInjected, TranslationFormState } from './preferences-form.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        cotTranslation: import('./locales.ts').CotTranslationKey;
    }
}
/**
 * Mount the experimental reasoning presentation and its Remote methods.
 * @param ctx - browser plugin context.
 * @returns disposer joining UI and Remote withdrawal.
 */
export declare function apply(ctx: Context): Promise<() => Promise<void>>;
//# sourceMappingURL=index.d.ts.map