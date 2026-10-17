/** Host registry and HTTP adapter for generic Connection RPC channels. */
import { Context, Service } from '@deepseek-ai/cordis';
import type { PeerScope, Principal } from '@deepseek-ai/dsh-typert-protocol';
import type { ConnectionInteractions } from './connect-protocol.ts';
import type { BrowserAuth } from './browser-auth.ts';
import type { PeerAdmission, ConnectionAdmission, ConnectionIndexRequest, ConnectionIndexResponse, ConnectionFetchHandler, HostConnectionFetch, ConnectionRequestRejection, ConnectionTrustRequest, HostConnectionHandle, HostConnectionRpc } from './rpc.ts';
declare module '@deepseek-ai/cordis' {
    interface Context {
        /** Host Connection transport and RPC registrations. */
        connection: HostConnectionHandle;
    }
}
/** Host Connection service whose channel registrations belong to the caller fiber. */
export declare class HostConnectionService extends Service implements HostConnectionHandle {
    private readonly trustedHosts;
    private readonly browserAuth;
    /** The Peer every authenticated browser connection shares. */
    readonly browserPeer: PeerScope;
    private readonly peers;
    private readonly owner;
    private disposed;
    private readonly interceptors;
    private readonly fetchRoutes;
    readonly allowsRemoteAuthorities: boolean;
    /**
     * Provide the Host half over the active HTTP server.
     * @param ctx - owning Connection plugin context.
     * @param trustedHosts - deployment authorities accepted by the Host/Origin fence.
     * @param browserAuth - process token and persistent browser-session owner.
     */
    constructor(ctx: Context, trustedHosts: readonly string[], browserAuth: BrowserAuth);
    /** Generic channel registry scoped to the Context reading this service. */
    get rpc(): HostConnectionRpc;
    /** Exact Fetch-route registry scoped to the Context reading this service. */
    get fetch(): HostConnectionFetch;
    /** Apply the Host/Origin fence and require an authenticated live Peer. */
    requestRejection(request: ConnectionTrustRequest): ConnectionRequestRejection;
    /** Browser requests share an owner Peer; API HTTP does not depend on an attached socket. */
    admit(request: ConnectionTrustRequest): PeerAdmission;
    /** Create one in-process Peer owned by the Context that read this service. */
    createPeer(options: {
        readonly principal: Principal;
        readonly interactions?: ConnectionInteractions;
    }): PeerScope;
    /** Claim API socket ownership synchronously; callers release on termination or failed upgrade. */
    admitConnection(request: ConnectionTrustRequest): ConnectionAdmission;
    private isTrusted;
    private publishPeer;
    /**
     * Authenticate and publish a credential before sending the connect redirect.
     * @param request - launch-token request on /connect.
     * @param response - response owned to completion.
     */
    authorizeConnect(request: ConnectionIndexRequest, response: ConnectionIndexResponse): void;
    /**
     * Authenticate an index request; native TLS listeners mint Secure cookies.
     */
    authorizeIndex(request: ConnectionIndexRequest, response: ConnectionIndexResponse): boolean;
    /** Add this process's launch token to the clean application URL. */
    authenticatedUrl(baseUrl: string): string;
    /**
     * Compose one shared-channel Fetch handler from exact routes and its interceptor.
     * @param channel - shared channel mounted by Connection.
     * @returns Fetch handler that selects one owner or returns 404.
     */
    createSharedFetchHandler(channel: '/api'): ConnectionFetchHandler;
    private registerFetchRoute;
    private register;
    private registerInterceptor;
}
//# sourceMappingURL=rpc-host.d.ts.map