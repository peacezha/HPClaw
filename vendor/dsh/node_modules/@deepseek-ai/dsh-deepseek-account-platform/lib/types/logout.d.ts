/** Resolved logout retry settings owned by the account provider. */
export interface LogoutRetryPolicy {
    readonly maxRetries: number;
    readonly delayMs: number;
    readonly requestTimeoutMs: number;
}
/**
 * Revoke one captured grant without changing local account state.
 * @param origin - Issuer verified before local grant removal.
 * @param token - Removed grant, never replaced with a later login's token.
 * @param policy - Request deadline and exponential retry limits.
 * @param signal - Provider lifetime; shutdown aborts requests and delays.
 * @param headers - Validated issuer-only deployment headers.
 * @returns After success, exhaustion, or cancellation; remote failures stay in the background.
 */
export declare function revokeAccount(origin: string, token: string, policy: LogoutRetryPolicy, signal: AbortSignal, headers: Record<string, string>): Promise<void>;
//# sourceMappingURL=logout.d.ts.map