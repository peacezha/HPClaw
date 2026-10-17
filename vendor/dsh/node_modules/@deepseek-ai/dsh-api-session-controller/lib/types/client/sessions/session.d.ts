import type { Context } from '@deepseek-ai/cordis';
import type { AttachmentIdType, ImageAttachmentRef } from '@deepseek-ai/dsh-attachment';
import type { SubagentAddress } from '@deepseek-ai/dsh-subagent/client';
import type { MessageId } from '@deepseek-ai/dsh-llm/brand';
import { SessionSeq, type SessionId } from '@deepseek-ai/dsh-session/types';
import type { PromptContentPart, QueueAction, SessionRequestId } from '../../types.ts';
import type { BeginSubmissionInput, SessionFace, SubmissionHandle } from '../contract/session.ts';
import type { SessionSnapshot } from '../contract/snapshot.ts';
import { MutableSessionEventSource } from '../contract/events.ts';
import type { RemoteResult } from '@deepseek-ai/dsh-typert-protocol';
import type { SessionRemotes } from './remotes.ts';
import { ProjectionValueStore } from './projection-store.ts';
/** Minimum message count for ordinary history windows. */
export declare const PAGE_MESSAGES = 50;
/** Minimum messages per page while a turn jump loops backwards. */
export declare const JUMP_PAGE_MESSAGES = 200;
/** Manager-owned observers of a Session object's local state edges. */
export interface SessionOptions {
    /** Catalog-discovered address selecting non-activating subagent transport. */
    address?: SubagentAddress;
    /** Whether the exact direct parent Agent is available in Host summaries; absent until known. */
    parentAvailable?: boolean;
    /**
     * Publish each accepted prompt to the Manager, including after this Session
     * object is replaced. Acceptance converts display state, but does not
     * establish that a turn started or reached durable history.
     */
    onEngaged?(session: Session): void;
    /**
     * Manager-owned projection value store to adopt (frames route through the
     * manager and values outlive instantiation); omitted, the Session owns a
     * private store (bare object-layer construction).
     */
    projections?: ProjectionValueStore;
}
/**
 * Owns a session's event window, lifecycle state, and observable
 * snapshot. React bindings remain outside this data layer. Features see only
 * the {@link SessionFace} slice (ISession verbs + the snapshot source); the
 * remaining public members are Session Controller internals.
 */
export declare class Session implements SessionFace {
    readonly sessionId: SessionId;
    private readonly remote;
    private readonly options;
    private baseSeq;
    private hasMore;
    private openState;
    private openError;
    private openPromise;
    /** Bumped by stream replacement to invalidate an in-flight doOpen. Stale
     *  passes drop all writes once the generation moves on. */
    private openGeneration;
    private loadingOlder;
    /** Shared low-water target of the running jump loop; null when no jump is paging. */
    private jumpTargetSeq;
    /** The running jump loop's completion, shared by retargeting callers. */
    private jumpPromise;
    private pendingHistory;
    private readonly stopObservingInbox;
    private readonly assistantStream;
    private running;
    private address;
    private parentAvailable;
    /**
     * Sticky send marker, private input of the composerPhase derivation: set
     * synchronously before prompt()'s first await, never reset — the blank →
     * engaging edge of the phase machine (see ComposerPhase).
     */
    private promptAttempted;
    /** A first accepted prompt stays in the engaging phase until its turn is observable. */
    private firstPromptPendingTurn;
    /** New Session display state; unknown bare sessions begin conservatively blank. */
    private blankBit;
    private removed;
    private promptError;
    private lastAgentError;
    /** Local submission echoes, insertion-ordered (see SessionSnapshot.pendingSubmissions). */
    private pendingSubmissions;
    /** Per-echo settlement state; `retiring` latches the first observation so a
     *  Inbox projection and its durable event cannot both retire one echo. */
    private readonly submissionSettlements;
    /** Owns the addressed page/follow lifecycle while this Session is open. */
    private events;
    /**
     * Per-session projection value store (push model; see the session-projection
     * subsystem page, docs/subsystems/session-projection.md): finished whole
     * values computed on the Host, seeded by the tail page's
     * projections block and updated by Session Controller control frames;
     * Host-sequenced writes merge under higher-seq-wins and cached list blocks
     * yield to them (projection-store.ts). Keys are read via `projections.faceOf(key)`
     * (the useProjection resolution face); the conversation snapshot never
     * carries projection values, and no client-side domain folding exists.
     * Manager-owned when constructed through SessionManager (frames route and
     * the store outlives instantiation, the title-snapshot precedent); a bare
     * construction gets a private store.
     */
    readonly projections: ProjectionValueStore;
    /** Contiguous history and live tail consumed by Conversation assembly. */
    readonly eventSource: MutableSessionEventSource;
    private snapshotCache;
    private readonly notifier;
    /**
     * Agent-scoped cordis context, bound once by ClientSessions when it
     * mints the scope (the client mirror of the host Agent's loopCtx). The
     * Session dispatches its own scoped events through it; undefined means
     * unbound (bare object-layer construction) or already pruned — both skip
     * dispatch-dependent behavior rather than fail.
     */
    private actx;
    /**
     * @param sessionId - Host session identity (client sessions are always Host-born).
     * @param remote - generated Remote namespaces this session calls.
     * @param options - optional manager-owned state observers.
     */
    constructor(sessionId: SessionId, remote: SessionRemotes, options?: SessionOptions);
    /**
     * Bind the Agent-scoped context minted by ClientSessions (single write;
     * a second bind is a wiring error and throws). Direction stays one-way at
     * this binding boundary: consumers still reach the Session via `sessions.sessionOf`,
     * while the Session holds its own dispatch point (host Agent.loopCtx
     * mirror).
     * @param actx - the agent's scoped context.
     */
    bindScope(actx: Context): void;
    /** Release the bound scope at prune time (a later rebind accompanies a freshly minted scope). */
    unbindScope(): void;
    /**
     * Register one local submission echo (see the ISession declaration).
     * Synchronous through markDirty: the echo is in the very next snapshot, so
     * the conversation can paint it before the caller starts serializing.
     * @param input - echo content and the optional settlement callback.
     * @returns the minted identity for {@link prompt} plus the pre-prompt abandon path.
     */
    beginSubmission(input: BeginSubmissionInput): SubmissionHandle;
    /**
     * Send (queue/steer passed through 1:1); failures land in the snapshot's promptError.
     * @param content - text, browser-owned temporary image uploads, and staged-file receipts.
     * @param mode - queue appends after the current turn; steer interrupts it.
     * @param signal - optional caller cancellation for the complete admission round-trip.
     * @param requestId - identity from {@link beginSubmission}; a failed identified prompt retires its echo.
     * @returns the prompt result (also mirrored into promptError on failure).
     */
    prompt(content: PromptContentPart[], mode: 'queue' | 'steer', signal?: AbortSignal, requestId?: SessionRequestId): Promise<RemoteResult<{
        accepted: true;
    }>>;
    /**
     * Resolve one image referenced by this session into browser-consumable bytes.
     * @param attachmentId - opaque id found in the folded session log.
     * @returns the authenticated reference and decoded bytes.
     */
    readAttachment(attachmentId: AttachmentIdType): Promise<RemoteResult<{
        attachment: ImageAttachmentRef;
        data: Uint8Array;
    }>>;
    /** Apply one operation to a still-pending queue occurrence. */
    updateQueue(itemId: MessageId, action: QueueAction): Promise<RemoteResult<{
        accepted: true;
    }>>;
    /**
     * Stop the active turn while the Host preserves pending inbox work; failures
     * land in promptError (same error-strip display slot). A subagent address
     * routes through `subagents.interruptByParent`, whose durable parent-address
     * authority works without a live parent Agent.
     * @returns the cancel result.
     */
    cancel(): Promise<RemoteResult<{
        accepted: true;
    }>>;
    /**
     * Rename: contract session.rename 1:1. On success settle the 'title'
     * projection cell from the response's `{title, seq}` under the store's
     * higher-seq-wins rule (the push frame arriving later is a no-op replay),
     * so the list row and any useProjection('title') reader update without
     * waiting for the control-stream projection update.
     * @param title - raw title text (the host normalizes acceptance).
     * @returns the rename result (normalized accepted title + title event seq).
     */
    rename(title: string): Promise<RemoteResult<{
        title: string;
        seq: SessionSeq;
    }>>;
    /**
     * Execute one slash-command line against this session's agent — pure
     * admission semantics (the host executor durably logs the lifecycle;
     * outcomes render as flow nodes, never as a response echo).
     * @param line - the full command line, leading slash included.
     * @returns the admission result.
     */
    command(line: string): Promise<RemoteResult<{
        matched: boolean;
    }>>;
    /** First open: pull the tail page (idempotent — in-flight/already-open returns the existing promise). */
    open(): Promise<void>;
    /** Prepend one Turn-aligned page: at least 50 messages and two Turn starts, capped at 500 messages. */
    loadOlder(): Promise<void>;
    /** Jump loader: page backwards until the window covers seq (see ISession.loadThrough). */
    loadThrough(seq: SessionSeq): Promise<void>;
    /** Rebuild an opened history source after address replacement.
     *  Invalidates any in-flight open first; projection state belongs to the independently
     *  reconnecting control stream and remains untouched. */
    resync(): Promise<void>;
    /**
     * uSES subscription entry.
     * @param listener - change callback.
     * @returns the unsubscribe function.
     */
    subscribe(listener: () => void): () => void;
    /**
     * Cached Session snapshot (rebuilt lazily when dirty with no listeners).
     * @returns the cached reference (stable until the next flush).
     */
    getSnapshot(): SessionSnapshot;
    /**
     * Running-bit relay from the host stream (list entry and snapshot stay consistent).
     * @param running - the new running state.
     */
    handleRunning(running: boolean): void;
    /**
     * Install or clear the catalog-discovered transport address. A changed
     * address rebuilds an already-open window through its new history route.
     * @param address - direct parent/child address, or undefined for ordinary transport.
     * @param parentAvailable - latest exact-parent availability hint, or undefined before a catalog read.
     */
    configureSubagent(address: SubagentAddress | undefined, parentAvailable?: boolean): void;
    /**
     * Update only the parent availability hint from a catalog refresh.
     * @param available - whether the exact direct parent is live.
     */
    handleSubagentParentAvailable(available: boolean): void;
    /**
     * Apply the Manager's effective display blank, further reconciled with the
     * current `sessionListMetadata` projection. Local send attempts and current
     * running state prevent re-blanking; an earlier false summary alone does not.
     * The Manager retains acceptance and earlier running observations across
     * Session-object replacement.
     * @param blank - New Session display state after Manager reconciliation.
     */
    handleBlank(blank: boolean): void;
    /** `api-session/removed` relay: flag the snapshot while retaining the resident instance. */
    handleRemoved(): void;
    /**
     * `api-session/error` relay: the outlet for live failures with no turn position.
     * @param message - the stringified error.
     */
    handleAgentError(message: string): void;
    /**
     * Stop the Session's live Remote source.
     * @returns when the Remote iterator has completed teardown.
     */
    dispose(): Promise<void>;
    /** @param generation - openGeneration at launch; stale passes cannot publish after replacement. */
    private doOpen;
    /** Apply one contiguous journal update already reconciled by the Remote stream. */
    private acceptEventChange;
    /** Replace the complete contiguous window and apply page-owned projection metadata. */
    private installWindow;
    private publishAssistantEntry;
    /** Prepend one stream-validated history page. */
    private prependWindow;
    /** Append one stream-validated live event. */
    private appendLive;
    /** Observe durable acceptance even when insertion and claim share one projection notification. */
    private observeSubmissionEvent;
    private observeSubmissionInsertions;
    private observeSubmissionMessage;
    /** Retire admitted Chat identities only after stale Inbox rows can no longer reappear. */
    private retireAdmittedSubmission;
    /** Inbox acceptance retires queued echoes; its watermark completes admitted Chat handoffs. */
    private observeSubmissionInbox;
    /**
     * Latch one observed settlement and remove the echo an animation frame
     * later. The delay keeps the echo in the snapshot until the frame in which
     * the durable node (whose assembly frame was registered first) is
     * renderable; the render-time rpcId dedupe hides the one-frame overlap.
     */
    private scheduleObservedRetirement;
    /** Remove one unsettled echo immediately (prompt rejection, abort, or disposal). */
    private retireFailedSubmission;
    /** Single removal point: drop the echo, publish, then notify the owner. */
    private finishSubmission;
    /** Publish a terminal background failure only while this stream still owns the Session. */
    private failEventStream;
    private buildSnapshot;
    private sessionAddress;
}
//# sourceMappingURL=session.d.ts.map