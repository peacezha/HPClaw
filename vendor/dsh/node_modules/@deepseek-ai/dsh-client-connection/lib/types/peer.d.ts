/**
 * The Peer: one party admitted to this Host. Its creator fixes the principal
 * it speaks for and owns its lifetime; Gateway hands it to each Remote call as
 * `invocation.peer`.
 * @module @deepseek-ai/dsh-client-connection/src/peer
 */
import type { Context } from '@deepseek-ai/cordis';
import type { PeerId, PeerScope, Principal } from '@deepseek-ai/dsh-typert-protocol';
/** Construction options for one {@link Peer}. */
export interface PeerOptions {
    /** Caller identity every call through this Peer speaks for. */
    readonly principal: Principal;
    /** Omission permits an event stream; non-owner Peers still cannot answer waterfalls. */
    readonly interactions?: 'answer' | 'none';
}
/**
 * One Peer's scope. The instance is its own scope key, so `scopeOf(peer.ctx)`
 * returns it and events dispatched with `scopeTarget(subject, peer)` reach
 * listeners registered through `peer.ctx` and nobody else.
 */
export declare class Peer implements PeerScope {
    readonly id: PeerId;
    readonly ctx: Context;
    readonly principal: Principal;
    readonly interactions: 'answer' | 'none';
    readonly signal: AbortSignal;
    private readonly scope;
    /**
     * @param owner - Context the scope fiber hangs under; disposing it disposes the Peer.
     * @param options - the principal fixed for this Peer's lifetime.
     */
    constructor(owner: Context, options: PeerOptions);
    /** Tear down every connection-lifetime registration; racing calls share one completion. */
    dispose(): Promise<void>;
}
//# sourceMappingURL=peer.d.ts.map