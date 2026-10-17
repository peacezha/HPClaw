/** Host configuration for the account settings client. */
import type { Context, Volatile } from '@deepseek-ai/cordis';
import { type ContactConfig } from './contact-config.ts';
import z from '@deepseek-ai/schemastery';
import { type OnboardingStep, type OnboardingPurpose, type OnboardingProcess } from './onboarding-settings.ts';
/** Public contact options and live device-local onboarding progress. */
export interface Config extends ContactConfig {
    /** Onboarding progress format version. */
    version: Volatile<1>;
    /** Last accepted onboarding page. */
    step: Volatile<OnboardingStep>;
    /** Selected work scenario. */
    purpose?: Volatile<OnboardingPurpose | null | undefined>;
    /** Selected transcript detail. */
    process?: Volatile<OnboardingProcess | null | undefined>;
    /** Completion reason, absent until completion. */
    completion?: Volatile<'completed' | 'skipped' | 'api-key' | null | undefined>;
    /** Selected usage detail. */
    usage: Volatile<'compact' | 'detailed'>;
    /** Selected developer-tool visibility. */
    developerTools: Volatile<boolean>;
}
/** Configuration projected through the account plugin's shared form. */
export declare const Config: z<Schemastery.ObjectS<NoInfer<{
    contactFormUrl: z<string, string, "defined">;
    contactSource: z<string, string, "defined">;
    bonusAckRetryDelayMs: z<number, number, "defined">;
    bonusAckRetryMaxDelayMs: z<number, number, "defined">;
    version: z<1, 1, "volatile-defined">;
    step: z<"welcome" | "credit" | "purpose" | "process" | "done", "welcome" | "credit" | "purpose" | "process" | "done", "volatile-defined">;
    purpose: z<"office" | "development" | "both" | null, "office" | "development" | "both" | null, "volatile">;
    process: z<"compact" | "standard" | "detailed" | null, "compact" | "standard" | "detailed" | null, "volatile">;
    completion: z<"completed" | "skipped" | "api-key" | null, "completed" | "skipped" | "api-key" | null, "volatile">;
    usage: z<"compact" | "detailed", "compact" | "detailed", "volatile-defined">;
    developerTools: z<boolean, boolean, "volatile-defined">;
}>>, Schemastery.ObjectT<NoInfer<{
    contactFormUrl: z<string, string, "defined">;
    contactSource: z<string, string, "defined">;
    bonusAckRetryDelayMs: z<number, number, "defined">;
    bonusAckRetryMaxDelayMs: z<number, number, "defined">;
    version: z<1, 1, "volatile-defined">;
    step: z<"welcome" | "credit" | "purpose" | "process" | "done", "welcome" | "credit" | "purpose" | "process" | "done", "volatile-defined">;
    purpose: z<"office" | "development" | "both" | null, "office" | "development" | "both" | null, "volatile">;
    process: z<"compact" | "standard" | "detailed" | null, "compact" | "standard" | "detailed" | null, "volatile">;
    completion: z<"completed" | "skipped" | "api-key" | null, "completed" | "skipped" | "api-key" | null, "volatile">;
    usage: z<"compact" | "detailed", "compact" | "detailed", "volatile-defined">;
    developerTools: z<boolean, boolean, "volatile-defined">;
}>>, "plain">;
/**
 * Publish public questionnaire options before browser plugins activate.
 * @param ctx - Host context collecting page initialization data.
 * @param config - validated deployment options.
 */
export declare function apply(ctx: Context, config: Config): void;
//# sourceMappingURL=index.d.ts.map