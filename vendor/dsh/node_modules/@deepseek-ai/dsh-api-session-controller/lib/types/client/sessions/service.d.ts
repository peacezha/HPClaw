/** Client catalog and source-labelled ownership of exact Session generations. */
import type { Context } from '@deepseek-ai/cordis';
import type { SubagentAddress } from '@deepseek-ai/dsh-subagent/client';
import { type SessionId } from '@deepseek-ai/dsh-session/types';
import type { WorkspaceId } from '@deepseek-ai/dsh-workspace/types';
import type { SessionProjectionMap } from '@deepseek-ai/dsh-session-projection/types';
import { type ObservableSnapshot, type SnapshotStore } from '@deepseek-ai/dsh-client-store';
import type { RemoteFailure, RemoteResult } from '@deepseek-ai/dsh-typert-protocol';
import type { SessionEventSource } from '../contract/events.ts';
import type { SessionFace } from '../contract/session.ts';
import type { AgentContext, ISessions, SessionReference, SessionRetainInfo, SessionRetainOptions, SessionTarget } from '../contract/sessions.ts';
import { SessionManager } from './manager.ts';
import type { SessionRemotes } from './remotes.ts';
import type { SessionListPhase, SessionSearchResultItem, SessionProjectionSnapshot } from './manager.ts';
import type { SessionListEntry } from './lineage.ts';
/** Session list row projected from the host list RPC plus live stream increments. */
export interface SessionSummary {
    id: SessionId;
    /** Latest durable log-backed title, absent until the host projects one. */
    title?: string;
    /** Human-facing label: durable title, project basename, then session id. */
    displayTitle: string;
    cwd?: string;
    parentId?: SessionId;
    /** Coarse durable origin for navigation filtering; not a continuation capability. */
    origin?: 'subagent';
    /** Format classification supplied by the Host list, when available. */
    formatStatus?: SessionListEntry['formatStatus'];
    /** Host running state for `ids` members; a display fallback for other rows. */
    running: boolean;
    /** Local ownership counts; Host metadata refreshes cannot overwrite them. */
    readonly retainedBy: SessionRetainInfo['retainedBy'];
    /**
     * New Session presentation and reuse eligibility, derived from the Host
     * summary, `sessionListMetadata`, and client acceptance/running observations.
     * Workspace reconnection may reuse a blank in the same workspace. Filtering
     * stays with the consumer: the store carries every row, while the Workspace
     * browser shows only the selected blank entry.
     */
    blank: boolean;
    updatedAt: number;
    /** Current host-computed projection values retained by the object layer. */
    projectionValues?: Readonly<Partial<SessionProjectionMap>>;
}
/** Catalog metadata and local source counts; catalog membership owns no Client generation. */
export interface SessionListState {
    /** Host list order; every id has a matching byId row in the same snapshot. */
    ids: SessionId[];
    /** Host/catalog rows plus retained subagent fallbacks; only `ids` expresses Host-list membership. */
    byId: Record<SessionId, SessionSummary>;
    /** Arrival lifecycle projected 1:1 from the manager snapshot (see SessionListPhase): empty-with-ready means "truly no sessions". */
    phase: SessionListPhase;
    /** Shared projection values and explicit-read state, including unopened Sessions. */
    projectionsBySession: Readonly<Record<SessionId, SessionProjectionSnapshot>>;
}
/** Structured session-create failure. */
export declare class SessionCreateError extends Error {
    readonly rpcError: RemoteFailure;
    readonly requestedSessionId: SessionId | undefined;
    readonly name = "SessionCreateError";
    /**
     * @param rpcError - Host business or folded transport error.
     * @param requestedSessionId - caller-preallocated id used for later stream/list reconciliation.
     */
    constructor(rpcError: RemoteFailure, requestedSessionId: SessionId | undefined);
}
/** Structured session-fork failure. */
export declare class SessionForkError extends Error {
    readonly rpcError: RemoteFailure;
    readonly sourceSessionId: SessionId;
    readonly name = "SessionForkError";
    /**
     * @param rpcError - Host business or folded transport error.
     * @param sourceSessionId - the session the fork was cut from.
     */
    constructor(rpcError: RemoteFailure, sourceSessionId: SessionId);
}
/** Identity-stable logical binding for one materialized Client Session. */
export interface SessionBinding {
    readonly sessionId: SessionId;
    /** The outward session face only — feature code never sees the concrete class. */
    readonly session: SessionFace;
    /** Contiguous event window reserved for Conversation assembly. */
    readonly eventSource: SessionEventSource;
    readonly ctx: AgentContext;
}
export { scopeOf } from '../scope.ts';
/** Host catalog and local reference allocator; view selection remains outside the Controller. */
export declare class ClientSessions implements ISessions {
    private readonly rootCtx;
    /**
     * The wire schema's own result bound, re-exposed for presentation plugins as
     * injected data. Not per-connection state: the `session.search` response
     * schema caps `items` at this constant, so every transport (fixture included)
     * reports the same number.
     */
    readonly searchResultLimit = 20;
    /** Catalog metadata and local reference-source projection. */
    readonly list: SnapshotStore<SessionListState>;
    /** The object-layer instance cluster and frame dispatch entry. */
    private readonly manager;
    private readonly scopes;
    /** Stable per-id sources retained for the Client root lifetime, including across generation replacement. */
    private readonly retainObservers;
    private readonly scopeDrops;
    private closed;
    /**
     * @param ctx - client root context (scope fibers mount under it).
     * @param remote - generated Remote namespaces shared with every Session.
     */
    constructor(rootCtx: Context, remote: SessionRemotes);
    retain(target: SessionTarget, options: SessionRetainOptions): SessionReference;
    using<T>(target: SessionTarget, options: SessionRetainOptions, operation: (reference: SessionReference) => T | Promise<T>): Promise<T>;
    retainInfo(id: SessionId): ObservableSnapshot<SessionRetainInfo>;
    /**
     * Resolve an already discovered direct-parent address without opening it.
     * Feature plugins use this to avoid Agent-bound RPCs in persisted child views.
     * @param id - possible addressed child id.
     * @returns A retained, catalog-derived, or unknown-mode listed address, without retaining a new selection or scope.
     */
    subagentAddress(id: SessionId): SubagentAddress | undefined;
    /**
     * Read projections without starting migration; retry failed or migration-deferred reads.
     * @param sessionId - Session to inspect without opening its conversation.
     */
    refreshProjections(sessionId: SessionId): Promise<void>;
    /**
     * Refresh the real Session baseline, reusing an in-flight pull.
     * @returns completion of the current or newly started baseline pull.
     */
    refresh(): Promise<void>;
    /**
     * Search the Host's visible message-content index. Results stay
     * request-local; the list snapshot remains the metadata authority.
     * @param query - non-blank literal phrase.
     * @param signal - cancellation for a superseded search.
     * @returns bounded results or a business/transport error.
     */
    search(query: string, signal: AbortSignal): Promise<RemoteResult<{
        items: SessionSearchResultItem[];
        hasMore: boolean;
    }>>;
    /**
     * Apply one Session Controller live-control frame.
     * @param frame - baseline or live control replacement.
     */
    handleControlFrame(frame: Parameters<SessionManager['handleControlFrame']>[0]): void;
    /**
     * Apply one remotely forwarded Session-list addition.
     * @param summary - current Host summary for the added Session.
     */
    handleSessionAdded(summary: Parameters<SessionManager['handleSessionAdded']>[0]): void;
    /**
     * Apply one remotely forwarded Session removal.
     * @param sessionId - removed Session identity.
     */
    handleSessionRemoved(sessionId: Parameters<SessionManager['handleSessionRemoved']>[0]): void;
    /**
     * Apply one remotely forwarded running-state change.
     * @param args - Session identity and current Agent running state.
     */
    handleSessionStatus(...args: Parameters<SessionManager['handleSessionStatus']>): void;
    /**
     * Apply one remotely forwarded list-activity change.
     * @param args - Session identity and durable activity timestamp.
     */
    handleSessionActivity(...args: Parameters<SessionManager['handleSessionActivity']>): void;
    /**
     * Apply one remotely forwarded Agent failure.
     * @param args - Session identity and caller-visible failure description.
     */
    handleSessionError(...args: Parameters<SessionManager['handleSessionError']>): void;
    /** Rebuild the Session baseline and every opened window after connection. */
    handleConnected(): void;
    /**
     * Create a Host Session and publish its catalog row before resolving.
     * Callers retain the returned identity before borrowing its binding.
     * @param opts - target workspace or directory, an optional blank Session to reuse, and an optional Agent preset.
     * @returns the created or reused session id.
     * @throws {SessionCreateError} with the requested id.
     */
    create(opts?: {
        workspaceId?: WorkspaceId;
        cwd?: string;
        sessionId?: SessionId;
        agentPreset?: string;
    }): Promise<SessionId>;
    /**
     * Fork a session from an exact inclusive prefix of the source (same
     * synchronous-addressability guarantee as {@link ClientSessions.create}:
     * on resolution the child is catalogued and may be explicitly retained).
     * @param opts - source session id, the optional exact inclusive boundary
     *   seq (a real event seq the caller already knows; a cut inside an open
     *   turn is balanced Host-side with synthetic closers, and omission selects
     *   the latest completed-turn prefix), and whether to increment an
     *   inherited durable title before resolving, plus permission to start source migration.
     * @returns the child session id.
     * @throws {SessionForkError} with the source id.
     * @throws {Error} when a requested child-title rename fails after creation.
     */
    fork(opts: {
        sessionId: SessionId;
        atSeq?: number;
        increaseTitle?: boolean;
        onCreated?: (childId: SessionId) => void;
        allowMigration?: boolean;
    }): Promise<SessionId>;
    /**
     * Borrow an already-retained Agent-scoped Context.
     * @param id - session id (the agent identity — 1:1 same axis).
     * @returns the scoped Context, or undefined without a retained generation.
     */
    scope(id: SessionId): AgentContext | undefined;
    /**
     * Retain a validated Gateway identity synchronously, without history or catalog I/O.
     * @param id - Host-projected Session identity, possibly not yet catalogued.
     * @returns a Gateway-source reference owned by the invocation.
     */
    retainAgentScope(id: SessionId): SessionReference;
    /**
     * Read the Agent scope tag off a context. Service-method boundary: fetch
     * bundles must reach scope resolution through ctx.sessions — a cross-bundle
     * value import of the standalone helper would inline a second module
     * instance whose private tag Symbol never matches.
     * @param ctx - any client context.
     * @returns the session id, or undefined on root contexts.
     */
    scopeOf(ctx: Context): SessionId | undefined;
    /**
     * Resolve the business Session behind an Agent-scoped context — the one
     * hop every scoped consumer (event listeners, per-session controllers)
     * takes from ctx-space into object-space (the client mirror of host
     * `agent.session`). Same service-method boundary as
     * {@link ClientSessions.scopeOf}.
     * @param ctx - an Agent-scoped context.
     * @returns the matching live Session, or undefined for an untagged or ended generation.
     */
    sessionOf(ctx: Context): SessionFace | undefined;
    /**
     * Borrow an already-retained binding without extending its lifetime.
     * @param id - Session identity.
     * @returns the live binding, or undefined without a retained generation.
     */
    binding(id: SessionId): SessionBinding | undefined;
    private retainScope;
    private retentionSnapshot;
    private publishRetention;
    private retireScope;
    /** Materialize one scope after its caller establishes that the id may be addressed. */
    private materializeScope;
    /** Project the manager's list snapshot into the store (title derivation is display-only). */
    private projectList;
    private startScopeDrop;
    private drainScopeDrops;
    /** Await the already-withdrawn Session and scoped cleanup to quiescence. */
    private dropScope;
}
//# sourceMappingURL=service.d.ts.map