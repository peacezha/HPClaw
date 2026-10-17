/** Device-local onboarding progress stored in the Host settings document. */
import z from '@deepseek-ai/schemastery';
/** Account feature's durable onboarding namespace. */
export declare const DESKTOP_ONBOARDING_NAMESPACE = "ui-settings-account";
/** Persisted steps; a native top-up page leaves the durable step at credit. */
export type OnboardingStep = 'welcome' | 'credit' | 'purpose' | 'process' | 'done';
/** Work scenarios offered by the desktop introduction. */
export type OnboardingPurpose = 'office' | 'development' | 'both';
/** Work-detail mode applied to Chat when onboarding completes. */
export type OnboardingProcess = 'compact' | 'standard' | 'detailed';
/** One installation's resumable choices and terminal outcome. */
export interface OnboardingProgress {
    version: 1;
    step: OnboardingStep;
    purpose: OnboardingPurpose | null;
    process: OnboardingProcess | null;
    completion: 'completed' | 'skipped' | 'api-key' | null;
    usage: 'compact' | 'detailed';
    developerTools: boolean;
}
/** Host values may omit choices that have never been saved. */
export interface OnboardingSettings extends Omit<OnboardingProgress, 'purpose' | 'process' | 'completion'> {
    purpose?: OnboardingProgress['purpose'];
    process?: OnboardingProgress['process'];
    completion?: OnboardingProgress['completion'];
}
/** Validated defaults for a fresh installation. */
export declare const OnboardingSettingsFields: {
    version: z<1, 1, "defined">;
    step: z<"welcome" | "credit" | "purpose" | "process" | "done", "welcome" | "credit" | "purpose" | "process" | "done", "defined">;
    purpose: z<"office" | "development" | "both" | null, "office" | "development" | "both" | null, "plain">;
    process: z<"compact" | "standard" | "detailed" | null, "compact" | "standard" | "detailed" | null, "plain">;
    completion: z<"completed" | "skipped" | "api-key" | null, "completed" | "skipped" | "api-key" | null, "plain">;
    usage: z<"compact" | "detailed", "compact" | "detailed", "defined">;
    developerTools: z<boolean, boolean, "defined">;
};
/** Validated defaults for a fresh installation. */
export declare const OnboardingSettingsSchema: z<Partial<OnboardingSettings>, OnboardingSettings>;
//# sourceMappingURL=onboarding-settings.d.ts.map