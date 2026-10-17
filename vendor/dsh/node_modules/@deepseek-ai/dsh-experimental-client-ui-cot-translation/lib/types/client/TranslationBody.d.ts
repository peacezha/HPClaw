import type { LocaleSnapshot } from '@deepseek-ai/dsh-client-locale/client';
import type { HostObservable, InjectFace, PropsLocale, PropsRenderFactories, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { CotTranslationPreferences } from '../preferences.ts';
import { type TranslateText } from './translation.ts';
import { NS } from './locales.ts';
/** Registry-side values and callbacks bound for the reasoning contribution. */
export interface TranslationBodyInjected {
    hooks: {
        preferences: HostObservable<CotTranslationPreferences>;
        translationLocale: HostObservable<LocaleSnapshot>;
        translationLimit: HostObservable<number>;
    };
    translate: TranslateText;
}
export type TranslationBodyProps = PropsRuntime<'conversation.chat.reasoning.body'> & PropsRenderFactories & PropsLocale<typeof NS> & InjectFace<TranslationBodyInjected>;
/**
 * Render translated reasoning, retaining the complete original until a failed request is retried.
 * @param props - original reasoning, translation preferences, and cancellation-aware callback.
 * @returns compact Markdown and translation status with a retry action on failure.
 */
export declare function TranslationBody(props: TranslationBodyProps): import("react").JSX.Element;
//# sourceMappingURL=TranslationBody.d.ts.map