import type { AccountBonusNotification, AccountBonusOrderId, AccountDetails, AccountProfile } from '@deepseek-ai/dsh-deepseek-account/types';
/** Project Platform user data without retaining credentials or unneeded fields.
 * @param value - current or exchange user response.
 * @returns UI account profile.
 */
export declare function profile(value: unknown): AccountProfile;
/**
 * Read one Platform account field without waiting for the other query.
 * @param field - profile or recharge and bonus wallet balances.
 * @param origin - configured origin matching the stored grant issuer.
 * @param token - stored authorization token; response tokens are discarded.
 * @param signal - request and credential lifetime.
 * @param headers - validated deployment headers for the configured origin.
 * @returns sanitized query outcome; failure never becomes a zero balance.
 * @throws AccountUnauthorizedError when Platform rejects the stored token with HTTP 401 or response code 40003.
 */
export declare function readAccountDetail<K extends keyof AccountDetails>(field: K, origin: string, token: string, signal: AbortSignal, headers: Record<string, string>): Promise<AccountDetails[K]>;
/**
 * Read the unnotified bonus list for one captured credential.
 * @param origin - configured origin matching the stored grant issuer.
 * @param token - captured account grant; the caller has already bound it to the account.
 * @param signal - credential lifetime and request timeout.
 * @param headers - deployment and client identity headers for the configured origin.
 * @returns notifications in Platform order; a malformed payload is a protocol failure.
 */
export declare function readUnnotifiedBonuses(origin: string, token: string, signal: AbortSignal, headers: Record<string, string>): Promise<readonly AccountBonusNotification[]>;
/**
 * Record one displayed bonus as notified with the credential it was read under.
 * @param origin - configured origin matching the stored grant issuer.
 * @param token - captured account grant; the caller has already bound it to the account.
 * @param orderId - granted bonus order the user saw.
 * @param signal - credential lifetime and request timeout.
 * @param headers - deployment and client identity headers for the configured origin.
 * @returns after Platform records the acknowledgement; HTTP and business failures throw.
 */
export declare function sendBonusNotified(origin: string, token: string, orderId: AccountBonusOrderId, signal: AbortSignal, headers: Record<string, string>): Promise<void>;
//# sourceMappingURL=details.d.ts.map