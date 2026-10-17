/** Staged translation preferences using the shared Plugins form model. */
import { type SettingsFieldState, type SettingsFormActions, type SettingsFormScope, type SettingsFormShell } from '@deepseek-ai/dsh-client-ui-primitives';
import type { SnapshotStore } from '@deepseek-ai/dsh-client-store';
import { type CotTranslationPreferences } from '../preferences.ts';
/** Current drafts and the shared form status. */
export interface TranslationFormState extends SettingsFormShell {
    provider: SettingsFieldState;
    targetLanguage: SettingsFieldState;
}
/** Registration-side form observable and edit callbacks. */
export interface TranslationFormInjected extends SettingsFormActions {
    hooks: {
        translationForm: SnapshotStore<TranslationFormState>;
    };
}
/** Stages provider and language edits until the reader saves them. */
export declare class TranslationPreferencesForm {
    private readonly form;
    private readonly state;
    /** @param scope - Host-backed configuration form for this plugin. */
    constructor(scope: SettingsFormScope<CotTranslationPreferences>);
    /**
     * Build the registration face for the preferences form.
     * @returns draft observable and shared edit/save actions.
     */
    inject(): TranslationFormInjected;
    /** Release the accepted-preference subscription. */
    dispose(): void;
}
//# sourceMappingURL=preferences-form.d.ts.map