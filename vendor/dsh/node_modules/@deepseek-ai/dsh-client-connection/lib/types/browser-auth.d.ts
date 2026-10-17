/** Browser-session authentication for the Host Connection carrier. */
import type { PeerId } from '@deepseek-ai/dsh-typert-protocol';
import { type ConnectionInteractions } from './connect-protocol.ts';
import type { CredentialProvider } from '@deepseek-ai/dsh-credentials';
import type { ConnectionIndexRequest, ConnectionIndexResponse, ConnectionTrustRequest } from './rpc.ts';
/**
 * Process launch-token exchange and persistent signed-cookie verification.
 * Connection loads the credential provider's signing secret during activation
 * and retains it for synchronous request authentication.
 */
export declare class BrowserAuth {
    private readonly secret;
    private readonly launchToken;
    private readonly maxAgeMilliseconds;
    private constructor();
    /**
     * Initialize browser authentication and create its durable signing secret
     * when this Harness home has none.
     * @param processOwner - root application context retaining one token across Connection reloads.
     * @param credentials - persistent credential provider for the Web profile.
     * @param maxAgeDays - positive absolute browser-cookie lifetime in days.
     * @returns initialized authentication owner with the process owner's launch token.
     */
    static create(processOwner: object, credentials: CredentialProvider, maxAgeDays: number): Promise<BrowserAuth>;
    /**
     * Add this process's launch token to the caller's application URL.
     * @param baseUrl - clean browser URL whose authority and mount are preserved.
     * @returns the same URL carrying the process token as its sole authentication input.
     */
    authenticatedUrl(baseUrl: string): string;
    /**
     * Authenticate an index request. A valid root query token mints the cookie
     * and redirects to the directory-relative clean `./`; a valid cookie lets
     * the caller serve the index; every other request receives the same minimal
     * 401 response.
     * @param req - incoming root or configured-index request.
     * @param res - response owned when this method returns false.
     * @param secure - whether the listener receiving this request serves TLS; the
     * minted cookie carries `Secure` when it does. Only that listener's own
     * protocol decides, never a `publicUrl` announcement or a forwarded header:
     * those describe a hop this process does not terminate.
     * @returns true only when the caller may serve index.html.
     */
    authorizeIndex(req: ConnectionIndexRequest, res: ConnectionIndexResponse, secure?: boolean): boolean;
    /**
     * Exchange the launch token for an independent API operator; omitted interactions default to none.
     * @param req - trusted GET request on /connect with at most one interactions declaration.
     * @param res - response owned to completion, redirecting to the API mux on success.
     * @param secure - whether the receiving listener serves TLS.
     * @param publish - synchronously create the operator before exposing its signed credential.
     */
    authorizeConnect(req: ConnectionIndexRequest, res: ConnectionIndexResponse, secure: boolean, publish: (interactions: ConnectionInteractions) => PeerId): void;
    /**
     * Verify the authority-bound browser cookie on a Host request.
     * @param request - request headers carrying Host and Cookie.
     * @param secure - whether the receiving listener uses TLS, including its default port.
     * @returns true only for an unexpired cookie signed by this activation's loaded secret.
     */
    isAuthenticated(request: ConnectionTrustRequest, secure?: boolean): boolean;
    /**
     * Verify an API credential without creating or reviving its operator.
     * @param request - request headers carrying Host and Cookie.
     * @param secure - whether the receiving listener uses TLS.
     * @returns the signed operator id, or undefined for invalid, expired, or browser cookies.
     */
    authenticateApi(request: ConnectionTrustRequest, secure?: boolean): PeerId | undefined;
    private authenticate;
    private writeUnauthorized;
}
//# sourceMappingURL=browser-auth.d.ts.map