/** Feishu questionnaire context: Harness build and reported environment. */
import type { AccountUserId } from '@deepseek-ai/dsh-deepseek-account/types';
import type { ContactConfig } from '../contact-config.ts';
/**
 * Build an external questionnaire URL without authentication credentials.
 * @param config - questionnaire destination and supported source option.
 * @param context - account, build and environment facts sampled by the caller.
 * @returns questionnaire URL with hidden, optionally prefilled context fields.
 */
export declare function contactUrl(config: ContactConfig, context: {
    uid: AccountUserId | null | undefined;
    version: string | undefined;
    deviceInfo: string;
    width: number;
    height: number;
    pixelRatio: number;
}): string;
//# sourceMappingURL=contact-url.d.ts.map