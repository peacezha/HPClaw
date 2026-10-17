/** Public contact and bonus notice options shared by Host and Client. */
import z from '@deepseek-ai/schemastery';
/** Questionnaire destination and bonus notice timings shared by Host and Client. */
export interface ContactConfig {
    /** HTTPS questionnaire URL; override for a test form. */
    contactFormUrl: string;
    /** Questionnaire source option; empty until Harness is supported by the form. */
    contactSource: string;
    /** First delay before retrying a failed bonus acknowledgement. */
    bonusAckRetryDelayMs: number;
    /** Ceiling for the acknowledgement retry backoff. */
    bonusAckRetryMaxDelayMs: number;
}
/** Validate public questionnaire options. */
export declare const ContactConfigFields: {
    contactFormUrl: z<string, string, "defined">;
    contactSource: z<string, string, "defined">;
    bonusAckRetryDelayMs: z<number, number, "defined">;
    bonusAckRetryMaxDelayMs: z<number, number, "defined">;
};
/** Validate public questionnaire options. */
export declare const ContactConfig: z<Partial<ContactConfig>, ContactConfig>;
/** Bootstrap key containing no account credentials. */
export declare const CONTACT_CONFIG_GLOBAL = "__DSH_CONTACT_CONFIG__";
//# sourceMappingURL=contact-config.d.ts.map