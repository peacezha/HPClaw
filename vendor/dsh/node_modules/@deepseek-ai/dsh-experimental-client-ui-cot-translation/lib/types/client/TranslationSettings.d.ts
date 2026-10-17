import type { TranslationProvider } from '@deepseek-ai/dsh-experimental-translator/types';
import type { HostObservable, InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import { NS } from './locales.ts';
import type { TranslationFormInjected } from './preferences-form.ts';
/** Settings snapshots and explicit refresh callback supplied by the Host mirror. */
export interface TranslationSettingsInjected extends TranslationFormInjected {
    hooks: TranslationFormInjected['hooks'] & {
        availableProviders: HostObservable<readonly TranslationProvider[]>;
    };
    /** Refresh native route eligibility without sending reasoning or starting inference. */
    refreshProviders: () => void;
}
export type TranslationSettingsProps = PropsRuntime<'plugins.bundle.config'> & PropsLocale<typeof NS> & InjectFace<TranslationSettingsInjected>;
/**
 * Render staged translation preferences and name which text leaves the Host.
 * @param props - current draft fields, accepted-value metadata, and save actions.
 * @returns the bundle's translation preferences.
 */
export declare function TranslationSettings(props: TranslationSettingsProps): import("react").JSX.Element;
//# sourceMappingURL=TranslationSettings.d.ts.map