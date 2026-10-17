/** Resumable desktop onboarding and preference application over Host settings. */
import type { TranscriptViewMode } from '@deepseek-ai/dsh-client-ui-chat/client';
import type { HostObservable } from '@deepseek-ai/dsh-client-ui-slots';
import type { SettingsDescribeFace, ConfigForm } from '@deepseek-ai/dsh-client-ui-settings/client';
import type { OnboardingSettings } from '../onboarding-settings.ts';
import type { AccountSnapshot } from './AccountSection.tsx';
import type { DesktopOnboardingState, OnboardingChange } from './onboarding-contract.ts';
/** Host-backed progress; completing writes active preferences before the durable done marker. */
export declare class DesktopOnboardingController {
    private readonly progress;
    private readonly chat;
    private readonly setDeveloperTools;
    private readonly account;
    private readonly readApiKeyPresence;
    private readonly settings;
    /** Private observable projected into the shell overlay's framework hook. */
    readonly state: import("@deepseek-ai/dsh-client-store").SnapshotStore<DesktopOnboardingState>;
    private readonly disposers;
    private saving;
    private completing;
    private draft;
    private updates;
    private disposed;
    private credentialGeneration;
    private hasApiKey;
    private checkingKeys;
    private error;
    private failedWrite;
    private creditFunded;
    /**
     * @param progress - installation-scoped durable progress.
     * @param chat - existing Chat settings owner.
     * @param setDeveloperTools - persist enablement through the shared developer-tools preference.
     * @param account - safe account state, initially unresolved.
     * @param settings - shared settings reader exposing initial failures and retry.
     * @param readApiKeyPresence - reads configured model-credential metadata without secrets.
     */
    constructor(progress: ConfigForm<OnboardingSettings>, chat: ConfigForm<{
        transcriptView?: TranscriptViewMode | null;
        performanceUsage: 'compact' | 'detailed';
    }>, setDeveloperTools: (enabled: boolean) => Promise<void>, account: HostObservable<AccountSnapshot>, readApiKeyPresence: () => Promise<boolean>, settings: SettingsDescribeFace);
    /** Recheck credential metadata after a provider or credential invalidation. */
    invalidateCredentials(): void;
    /**
     * Preview a step or selection immediately and serialize its persistence; the last rejected write restores saved progress.
     * @param change - user-selected progress fields.
     * @returns whether Host settings accepted the complete next progress value.
     */
    update(change: OnboardingChange): Promise<boolean>;
    /**
     * Apply the selected display and developer-tool preferences and finish this installation's introduction.
     * @param reason - ordinary completion or an explicit skip at the current step.
     * @returns whether preferences and the completion marker persisted.
     */
    complete(reason: 'completed' | 'skipped'): Promise<boolean>;
    private finish;
    /**
     * Retry an initial settings read or the last failed choice, including active preferences.
     * @returns whether the read or pending write succeeded; false when nothing can be retried.
     */
    retry(): Promise<boolean>;
    /** Remove subscriptions and prevent delayed metadata reads from writing progress. */
    dispose(): void;
    private readProgress;
    private save;
    private derive;
}
//# sourceMappingURL=onboarding-state.d.ts.map