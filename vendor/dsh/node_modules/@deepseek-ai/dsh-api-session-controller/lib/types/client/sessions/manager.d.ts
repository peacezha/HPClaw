/** Host catalog, durable projection caches, and explicitly retained Client instances. */
import type { SubagentAddress } from '@deepseek-ai/dsh-subagent/client';
import { SessionSeq, type SessionId } from '@deepseek-ai/dsh-session/types';
import type { SessionProjectionMap } from '@deepseek-ai/dsh-session-projection/types';
import type { WorkspaceId } from '@deepseek-ai/dsh-workspace/types';
import type { SessionControlFrame, SessionRenameValue, SessionSummary } from '../../types.ts';
import type { RemoteFailure, RemoteResult } from '@deepseek-ai/dsh-typert-protocol';
import type { SessionListEntry } from './lineage.ts';
import { Session } from './session.ts';
import type { SessionRemotes } from './remotes.ts';
import type { SessionTarget } from '../contract/sessions.ts';
/**
 * List arrival lifecycle, orthogonal to the pull-activity `state` axis:
 * `pending` (no successful pull yet — an empty items array means "nothing
 * arrived", not "nothing exists") → `ready` (at least one pull landed).
 * Monotone: `ready` never steps back — later pull failures and reconnect
 * re-pulls ride the `state`/`error` axis, which is where failure is modeled
 * (no `error` phase here; that would duplicate `state`).
 */
export type SessionListPhase = 'pending' | 'ready';
/** Request-local content hit returned to sidebar search consumers. */
export interface SessionSearchResultItem {
    sessionId: SessionId;
    snippet: string;
}
/** Immutable session-list snapshot for useSessionList. */
export interface SessionListSnapshot {
    items: readonly SessionListEntry[];
    state: 'idle' | 'loading' | 'error';
    /** Arrival lifecycle (see {@link SessionListPhase}); `state` stays the pull-activity axis. */
    phase: SessionListPhase;
    error: RemoteFailure | null;
    projectionsBySession: Readonly<Record<SessionId, SessionProjectionSnapshot>>;
}
/** Shared projection values and the lifecycle of their explicit baseline read. */
export interface SessionProjectionSnapshot {
    readonly values: Readonly<Partial<SessionProjectionMap>>;
    readonly state: 'idle' | 'loading' | 'ready' | 'migration-required' | 'error';
    readonly error: RemoteFailure | null;
}
/** Instance cluster + frame entry + the session list. */
export declare class SessionManager {
    private readonly remote;
    private readonly sessions;
    /** In-flight Session disposals remain here after instances leave `sessions`, so manager disposal can await quiescence. */
    private readonly sessionDisposals;
    /**
     * Accepted/running presentation must survive a later empty-history list
     * response. Host-asserted running is recorded even before a row, instance, or
     * address holds the identity — the listing that would hold it may not have
     * landed yet — while the client-local acceptance callback requires a current
     * holder, because it can arrive from a replaced or already-dropped Session.
     */
    private readonly engagedSessions;
    private disposed;
    /** Per-session projection value stores, retained independently of instance arrival (the
     *  title-snapshot precedent, generalized): push frames land here whether or not the Session
     *  is instantiated (list rows read the 'title' key), and an instantiated Session adopts the
     *  same store so history-baseline seeding and frames converge on one row set. */
    private readonly projectionStores;
    private summaries;
    private listState;
    /** Arrival phase; the pending → ready edge fires on the first successful pull (see SessionListPhase). */
    private listPhase;
    private listError;
    private listInflight;
    /** Active list request's mutation log; its identity also fences completion after reconnect. */
    private listMutations;
    private readonly addresses;
    private readonly projectionLoads;
    private readonly projectionInflight;
    private listSnapshotCache;
    /** Entry-identity cache (reference stability): list rebuilds reuse the previous entry
     *  object when every field matches — wire refreshes mint all-new summary objects, so identity
     *  must be recovered by value or every SessionListItem memo misses on every refresh. */
    private entryCache;
    private itemsCache;
    private readonly notifier;
    /** @param remote - generated Remote namespaces used by catalog and history readers. */
    constructor(remote: SessionRemotes);
    /**
     * Resolve an acquisition target without materializing a Session.
     * @param target - known identity or durable direct-parent address.
     * @returns the resolved identity with its explicit or catalog-derived history route installed.
     */
    resolveTarget(target: SessionTarget): SessionId;
    /**
     * Resolve an address for breadcrumb navigation without retaining transport authority.
     * @param sessionId - possible child id in received Session metadata.
     * @returns A retained address, then a catalog address, then an unknown-mode address
     *   from a listed subagent header; undefined without that evidence.
     */
    subagentAddress(sessionId: SessionId): SubagentAddress | undefined;
    /**
     * Withdraw an exact Client instance before running its teardown callbacks.
     * @param sessionId - identity to withdraw.
     * @param expected - instance being released; a replacement is left untouched.
     * @returns completion of the detached instance's stream teardown.
     */
    drop(sessionId: SessionId, expected: Session): Promise<void>;
    /**
     * Stop catalog requests and dispose every resident Session.
     * @returns once catalog requests and every Session stream have stopped.
     */
    dispose(): Promise<void>;
    private startSessionDisposal;
    private drainSessionDisposals;
    /**
     * Lazy build: return the existing instance or construct one (no auto-open —
     * the reference allocator opens history after binding the scope).
     * New instances reconcile retained metadata before returning.
     * @param sessionId - the session to get.
     * @returns the resident instance.
     */
    get(sessionId: SessionId): Session;
    private createSession;
    private effectiveBlank;
    /**
     * Identities an engagement may still belong to: the given list rows, resident
     * Session instances, and retained child addresses.
     * @param summaries - list rows of the caller's snapshot.
     * @returns the retained identity set.
     */
    private retainedIds;
    /**
     * Forget one engagement that no retained identity holds.
     * @param sessionId - identity whose engagement may be dropped.
     * @param retained - identities from {@link retainedIds} for the caller's snapshot.
     */
    private pruneEngagement;
    /** Resident per-session projection store (create-on-demand; outlives instantiation). */
    private projectionStore;
    /**
     * Read projections without starting migration; retry failed or migration-deferred reads.
     * @param sessionId - Session to inspect without opening its conversation.
     * @returns completion of the current or newly started read.
     */
    refreshProjections(sessionId: SessionId): Promise<void>;
    private agentAvailable;
    private updateParentAvailability;
    /** Full refresh via session.list (single-flight within one Host generation). */
    refreshList(): Promise<void>;
    /**
     * Search visible session message content without adding transient query
     * state to the list snapshot.
     * @param query - non-blank literal phrase.
     * @param signal - cancellation for superseded UI queries.
     * @returns the Host result or a folded transport error.
     */
    search(query: string, signal: AbortSignal): Promise<RemoteResult<{
        items: SessionSearchResultItem[];
        hasMore: boolean;
    }>>;
    /**
     * Contract session.create; on success merge into summaries immediately (no
     * wait for the next refresh). A created session is blank by definition
     * (entity birth precedes the first message).
     * @param opts - target workspace or working directory, an optional blank Session to reuse, and an optional Agent preset.
     * @returns the create result, naming the Session the Host created or reused.
    */
    create(opts?: {
        workspaceId?: WorkspaceId;
        cwd?: string;
        sessionId?: SessionId;
        agentPreset?: string;
    }): Promise<RemoteResult<{
        sessionId: SessionId;
    }>>;
    /**
     * Contract session.fork; on success merge the child into summaries
     * immediately (same synchronous-addressability guarantee as create).
     * Blankness starts provisionally true so the authoritative Host summary can
     * preserve it or lower it after an exact cut before the first `turn/start`;
     * lineage rides parentSessionId. A child published before Workspace
     * attachment fails is also reconciled into the list.
     * @param opts - source session, optional exact inclusive boundary seq, and permission to start migration.
     * @returns the fork result (the child session id).
     */
    fork(opts: {
        sessionId: SessionId;
        atSeq?: SessionSeq;
        allowMigration?: boolean;
    }): Promise<RemoteResult<{
        sessionId: SessionId;
    }>>;
    /**
     * Rename a Session and update its title projection without opening its history.
     * @param sessionId - Session to rename.
     * @param title - raw title text for Host normalization.
     * @returns the accepted title and event position, or the Remote failure.
     */
    rename(sessionId: SessionId, title: string): Promise<RemoteResult<SessionRenameValue>>;
    /**
     * Merge a Host summary, replacing live state and filling missing metadata.
     * Local create/fork placeholders only fill metadata on an existing row.
     */
    private mergeSummary;
    /** Apply immediately and retain for replay when a list response is in flight. */
    private recordMutation;
    /**
     * uSES subscription entry for useSessionList.
     * @param listener - change callback.
     * @returns the unsubscribe function.
     */
    subscribe(listener: () => void): () => void;
    /**
     * Cached list snapshot (rebuilt lazily when dirty with no listeners).
     * @returns the cached reference (stable until the next flush).
     */
    getListSnapshot(): SessionListSnapshot;
    /**
     * Read cached projection values for a Session that may exist only in a loaded subagent catalog.
     * @param sessionId - Session whose control or history baseline supplied projections.
     * @returns current values, or undefined before any projection store exists.
     */
    projectionValues(sessionId: SessionId): Readonly<Partial<SessionProjectionMap>> | undefined;
    /**
     * Apply a complete control baseline or one later replacement frame.
     * @param frame - baseline or live control replacement from Session Controller.
     */
    handleControlFrame(frame: SessionControlFrame): void;
    private replaceControlBaseline;
    /**
     * Apply one Session-list addition forwarded through `ctx.remote.$on`.
     * @param summary - current Host summary for the added Session.
     */
    handleSessionAdded(summary: SessionSummary): void;
    /**
     * Merge one list-surface projection block by the sequence space it declares.
     * A `sequenced` block came from the Host's live registry for an attached
     * Session, so each key lands under higher-seq-wins against that Session's
     * baselines and frames. A `cached` block was viewed from the persisted
     * checkpoint by a header-only listing: its watermark is not comparable with
     * this connection's seqs, so it only fills keys no sequenced row holds.
     */
    private applyListBlock;
    /**
     * Apply one Session removal forwarded through `ctx.remote.$on`.
     * @param sessionId - removed Session identity.
     */
    handleSessionRemoved(sessionId: SessionId): void;
    /**
     * Apply one live Agent running-state change.
     * @param sessionId - Session whose Agent state changed.
     * @param running - current Agent running state.
     */
    handleSessionStatus(sessionId: SessionId, running: boolean): void;
    /**
     * Advance Session-list activity from one user-authored durable message.
     * @param sessionId - Session whose activity changed.
     * @param updatedAt - durable message timestamp.
     */
    handleSessionActivity(sessionId: SessionId, updatedAt: number): void;
    /**
     * Surface one live Agent failure on an already-materialized Session.
     * @param sessionId - Session whose Agent failed.
     * @param message - caller-visible failure description.
     */
    handleSessionError(sessionId: SessionId, message: string): void;
    /**
     * Repair one re-established Host-event generation with queryable baselines.
     * Discard old projection cuts before new queries, including cold Sessions
     * absent from the process-local control baseline.
     * Opened Session follow streams resume independently through API Gateway.
     */
    handleConnected(): void;
    private buildListSnapshot;
}
//# sourceMappingURL=manager.d.ts.map