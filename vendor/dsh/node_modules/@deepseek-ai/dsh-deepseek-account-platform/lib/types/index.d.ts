import { Context, Service } from '@deepseek-ai/cordis';
import Schema from '@deepseek-ai/schemastery';
import { DeepSeekAccount, type AccountBonusBatch, type AccountBonusOrderId, type AccountClientMetadata, type AccountDetails, type AccountUserId, type AccountView, type PlatformSession, type SignInAttemptId } from '@deepseek-ai/dsh-deepseek-account';
/** Deployment-specific platform and request deadlines. */
export interface Config {
    /** Platform origin serving auth-api and browser pages. */
    platformOrigin?: string;
    /** Native desktop identity for Host API and embedded Platform requests; null identifies the client as web. */
    desktopPlatform?: 'darwin' | 'win32' | null;
    /** Optional frontend deployment selector for embedded Usage and Top-up pages. */
    embeddedPageDist?: string;
    /** Exact HTTP(S) origin allowed to receive account tokens for inference and files. */
    inferenceOrigin?: string;
    /** Allow HTTP only on loopback for the development Mock. */
    allowLoopbackHttp?: boolean;
    /** Map authorization and completion pages to platformOrigin for private development proxies. */
    rewriteBrowserOrigin?: boolean;
    /** Host-only headers sent exclusively to platformOrigin; account authorization cannot be overridden. */
    requestHeaders?: Record<string, string>;
    /** Overrides for profile, balance and embedded Platform requests; Cookie pairs merge by name. Logout retains requestHeaders. */
    accountRequestHeaders?: Record<string, string>;
    /** Deadline for each platform HTTP request. */
    requestTimeoutMs?: number;
    /** Deadline for recharge-wallet queries; timeout returns a failed balance outcome. */
    balanceTimeoutMs?: number;
    /** Additional logout attempts after the first request fails, at most five. */
    logoutMaxRetries?: number;
    /** Delay before the first logout retry; each later delay doubles. */
    logoutRetryDelayMs?: number;
    /** Upper bound for the entire local attempt, even if the server advertises a longer TTL. */
    attemptTimeoutMs?: number;
}
/** Validated deployment choices. */
export declare const Config: Schema<Schemastery.ObjectS<NoInfer<{
    platformOrigin: Schema<string, string, "defined">;
    desktopPlatform: Schema<"darwin" | "win32" | null, "darwin" | "win32" | null, "defined">;
    embeddedPageDist: Schema<string, string, "defined">;
    inferenceOrigin: Schema<string, string, "defined">;
    allowLoopbackHttp: Schema<boolean, boolean, "defined">;
    rewriteBrowserOrigin: Schema<boolean, boolean, "defined">;
    requestHeaders: Schema<import("@deepseek-ai/cosmokit").Dict<string, string>, import("@deepseek-ai/cosmokit").Dict<string, string>, "defined">;
    accountRequestHeaders: Schema<import("@deepseek-ai/cosmokit").Dict<string, string>, import("@deepseek-ai/cosmokit").Dict<string, string>, "defined">;
    requestTimeoutMs: Schema<number, number, "defined">;
    balanceTimeoutMs: Schema<number, number, "defined">;
    logoutMaxRetries: Schema<number, number, "defined">;
    logoutRetryDelayMs: Schema<number, number, "defined">;
    attemptTimeoutMs: Schema<number, number, "defined">;
}>>, Schemastery.ObjectT<NoInfer<{
    platformOrigin: Schema<string, string, "defined">;
    desktopPlatform: Schema<"darwin" | "win32" | null, "darwin" | "win32" | null, "defined">;
    embeddedPageDist: Schema<string, string, "defined">;
    inferenceOrigin: Schema<string, string, "defined">;
    allowLoopbackHttp: Schema<boolean, boolean, "defined">;
    rewriteBrowserOrigin: Schema<boolean, boolean, "defined">;
    requestHeaders: Schema<import("@deepseek-ai/cosmokit").Dict<string, string>, import("@deepseek-ai/cosmokit").Dict<string, string>, "defined">;
    accountRequestHeaders: Schema<import("@deepseek-ai/cosmokit").Dict<string, string>, import("@deepseek-ai/cosmokit").Dict<string, string>, "defined">;
    requestTimeoutMs: Schema<number, number, "defined">;
    balanceTimeoutMs: Schema<number, number, "defined">;
    logoutMaxRetries: Schema<number, number, "defined">;
    logoutRetryDelayMs: Schema<number, number, "defined">;
    attemptTimeoutMs: Schema<number, number, "defined">;
}>>, "plain">;
/** The platform implementation owns login state and its opaque stored grant. */
export declare class PlatformAccount extends DeepSeekAccount {
    static inject: string[];
    static Config: Schema<Schemastery.ObjectS<NoInfer<{
        platformOrigin: Schema<string, string, "defined">;
        desktopPlatform: Schema<"darwin" | "win32" | null, "darwin" | "win32" | null, "defined">;
        embeddedPageDist: Schema<string, string, "defined">;
        inferenceOrigin: Schema<string, string, "defined">;
        allowLoopbackHttp: Schema<boolean, boolean, "defined">;
        rewriteBrowserOrigin: Schema<boolean, boolean, "defined">;
        requestHeaders: Schema<import("@deepseek-ai/cosmokit").Dict<string, string>, import("@deepseek-ai/cosmokit").Dict<string, string>, "defined">;
        accountRequestHeaders: Schema<import("@deepseek-ai/cosmokit").Dict<string, string>, import("@deepseek-ai/cosmokit").Dict<string, string>, "defined">;
        requestTimeoutMs: Schema<number, number, "defined">;
        balanceTimeoutMs: Schema<number, number, "defined">;
        logoutMaxRetries: Schema<number, number, "defined">;
        logoutRetryDelayMs: Schema<number, number, "defined">;
        attemptTimeoutMs: Schema<number, number, "defined">;
    }>>, Schemastery.ObjectT<NoInfer<{
        platformOrigin: Schema<string, string, "defined">;
        desktopPlatform: Schema<"darwin" | "win32" | null, "darwin" | "win32" | null, "defined">;
        embeddedPageDist: Schema<string, string, "defined">;
        inferenceOrigin: Schema<string, string, "defined">;
        allowLoopbackHttp: Schema<boolean, boolean, "defined">;
        rewriteBrowserOrigin: Schema<boolean, boolean, "defined">;
        requestHeaders: Schema<import("@deepseek-ai/cosmokit").Dict<string, string>, import("@deepseek-ai/cosmokit").Dict<string, string>, "defined">;
        accountRequestHeaders: Schema<import("@deepseek-ai/cosmokit").Dict<string, string>, import("@deepseek-ai/cosmokit").Dict<string, string>, "defined">;
        requestTimeoutMs: Schema<number, number, "defined">;
        balanceTimeoutMs: Schema<number, number, "defined">;
        logoutMaxRetries: Schema<number, number, "defined">;
        logoutRetryDelayMs: Schema<number, number, "defined">;
        attemptTimeoutMs: Schema<number, number, "defined">;
    }>>, "plain">;
    private readonly origin;
    private readonly embeddedPageDist;
    private readonly inferenceOrigin;
    private readonly rewriteBrowserOrigin;
    private readonly platform;
    private readonly requestHeaders;
    private readonly accountRequestHeaders;
    private readonly requestTimeout;
    private readonly balanceTimeout;
    private readonly attemptTimeout;
    private readonly logoutPolicy;
    private readonly logoutLifetime;
    private readonly revocations;
    private attempt;
    private readonly listeners;
    /**
     * Latest ready profile read and the grant token it was read with. Binding the token keeps a
     * cached identity from answering for a credential that has since changed.
     */
    private lastProfile;
    private detailsLifetime;
    private closed;
    private removing;
    /** @param ctx - Host with authorization and credentials services. @param config - deployment options. */
    constructor(ctx: Context, config?: Config);
    [Service.init](): Promise<void>;
    getState(): Promise<AccountView>;
    getProfile(client: AccountClientMetadata): Promise<AccountDetails['profile'] | null>;
    getBalance(client: AccountClientMetadata): Promise<AccountDetails['balance'] | null>;
    getUnnotifiedBonuses(client: AccountClientMetadata): Promise<AccountBonusBatch | null>;
    ackBonusNotified(accountId: AccountUserId, orderId: AccountBonusOrderId, client: AccountClientMetadata): Promise<boolean>;
    /**
     * Resolve the profile identity bound to one captured grant, within that grant's credential lifetime.
     * @param lifetime - credential lifetime the grant was captured under; a change discards the result.
     * @param stored - captured grant; the identity query never re-reads a newer credential.
     * @param headers - client identity headers of the calling operation.
     * @returns the account identity, or null while signed out or after the credential changed.
     */
    private currentAccountId;
    /**
     * Cache one ready profile against the grant token it was read with, so identity reuse cannot cross
     * a credential change. A stable ID that first appears or changes notifies identity-enabled watch consumers, so
     * identity consumers re-read getPlatformSession; repeated IDs stay silent.
     * @param token - grant the profile was read with.
     * @param profile - profile outcome to record when it carries account data.
     */
    private cacheProfile;
    /**
     * @param profile - ready profile projected for the UI.
     * @returns the account identity it names.
     * @throws PlatformAuthError when the profile carries no stable Platform id, which cannot isolate notices.
     */
    private identityOf;
    private getDetail;
    /** Deployment account headers plus the client identity headers derived from one call's metadata. */
    private detailHeaders;
    rejectToken(token: string): Promise<void>;
    private expireCredential;
    getDeviceIdentity(): Promise<{
        deviceId?: string;
        userId?: AccountUserId;
        osVersion: string;
    }>;
    getPlatformSession(): Promise<PlatformSession | null>;
    private readCurrentGrant;
    resolveToken(url: string): Promise<string | undefined>;
    startSignIn(client: AccountClientMetadata, callbackOrigin: string, loginSource: 'web' | 'desktop'): Promise<AccountView>;
    cancelSignIn(id: SignInAttemptId): Promise<AccountView>;
    signOut(client: AccountClientMetadata): Promise<AccountView>;
    watch(signal: AbortSignal, includeIdentityChanges?: boolean): AsyncIterable<AccountView>;
    private revoke;
    private invalidateDetails;
    private changed;
    private update;
    private run;
    private rejectPayload;
    private cancelRequest;
    private request;
    private finishFailedCallback;
}
export default PlatformAccount;
//# sourceMappingURL=index.d.ts.map