/**
 * Owns subagent startup, message admission, cold resume, and execution lifetimes.
 * One child lock orders input acceptance and closure; one activation map owns
 * capacity, parent relationships, and resource release across all providers.
 *
 * @module @deepseek-ai/dsh-subagent/manager
 */
import type { Context } from '@deepseek-ai/cordis';
import type { Agent } from '@deepseek-ai/dsh-agent';
import type { ContentBlock, MessageId, MessageSource } from '@deepseek-ai/dsh-llm';
import type { SessionId } from '@deepseek-ai/dsh-session';
import type { ActivationObserver } from './lifecycle.ts';
import type { ContinuableCreateRequest, ContinuableCreateSpec, SubagentInterruptAuthority, SubagentActivationSpec, SubagentActivation, SubagentRun, SubagentSendMessageOptions, ResolvedSubagentStartRequest } from './types.ts';
/** Package-private hooks supplied by the owning service. */
interface SubagentHost {
    startExternal(name: string, request: ResolvedSubagentStartRequest): Promise<SubagentRun>;
    /** Resolve one provider's detached continuable-creation contribution. */
    prepareContinuable(name: string, request: ContinuableCreateRequest): Promise<ContinuableCreateSpec>;
    /** Build the lifecycle observer for one Activation residency epoch. */
    observeActivation(provider: string, childId: SessionId, parent: Agent): ActivationObserver;
}
/** Own subagent requests and the resources of every live activation. */
export declare class SubagentManager {
    private readonly ctx;
    private readonly host;
    private readonly maxActiveSubagents;
    /** Child session id → its live Activation. Process-local, never durable. */
    private readonly resident;
    /** Root identities retain their pool across child settlement without retaining dead roots. */
    private readonly rootPools;
    /** Materializations admitted before drain, tracked through publication or rollback. */
    private readonly materializations;
    /** Per-child serializer shared by delivery, release, and disposal. */
    private readonly locks;
    /** Structural Cordis owner of every Activation handle. */
    private readonly ownerCtx;
    /**
     * Exact roots whose host teardown has begun, with the live lineage members
     * observed under each root. Entries remain until that exact root leaves the
     * Agent registry, closing admission throughout its host's teardown without
     * poisoning a later same-id replacement.
     */
    private readonly closingScopes;
    private draining;
    /**
     * Build one manager inside the service's Agent-injected context.
     * @param ctx - context providing Agents, Sessions, and teardown ownership.
     * @param host - provider dispatch and lifecycle observation owned by the service.
     * @param maxActiveSubagents - the current configured child capacity.
     */
    constructor(ctx: Context, host: SubagentHost, maxActiveSubagents: () => number);
    /**
     * Interrupt one live continuable child's current turn under the supplied authority.
     * @param targetSessionId - the durable child session id to interrupt.
     * @param authority - the human parent address or exact live ancestor Agent.
     */
    interrupt(targetSessionId: SessionId, authority: SubagentInterruptAuthority): void;
    /**
     * Close admission, await every already-admitted materialization through
     * publication or rollback, then dispose the stable live Activation graph
     * child-first.
     */
    drain(): Promise<void>;
    /**
     * Join progressing child work, leaving idle parked inboxes resident.
     * @param parent - exact live parent whose descendants are observed.
     * @returns whether work was joined and the host must recheck parent completion.
     */
    waitForChildren(parent: Agent): Promise<boolean>;
    /**
     * Stop the managed descendants of exact live host-owned parents.
     * @param parents - exact live roots whose managed descendants must stop.
     */
    drainDescendants(parents: readonly Agent[]): Promise<void>;
    /**
     * Release selected resident direct children of one exact live parent.
     * @param parent - exact live direct parent authorizing the selected release.
     * @param childIds - durable direct-child ids to release when resident.
     */
    drainChildren(parent: Agent, childIds: readonly SessionId[]): Promise<void>;
    /**
     * Start one continuable background child and resolve at initial inbox acceptance.
     * Every earlier failure disposes any created handle and rolls back Activation
     * and parent ownership without returning either id.
     * @param spec - provider, delegation request, and caller cancellation.
     * @returns the durable child id and accepted initial prompt message id.
     */
    startLocal(spec: SubagentActivationSpec): Promise<SubagentActivation & {
        messageId: MessageId;
    }>;
    /**
     * Start an external backend under activation ownership.
     * @param spec - task, provider, cancellation, and delivery policy.
     * @returns the accepted activation and its result/disposal capabilities.
     */
    startExternal(spec: SubagentActivationSpec): Promise<SubagentActivation>;
    /** Capture the explicit or inherited directory while the parent still owns startup. */
    private resolveDirectory;
    /**
     * Deliver one model-authored message to a direct continuable child or to the
     * sender's direct parent. A missing direct child cold-resumes through the
     * ordinary continuation lifecycle.
     * @param sender - exact live Agent authorizing and originating the message.
     * @param targetId - durable direct-parent or direct-child session id.
     * @param content - model-authored content to deliver.
     * @param options - caller cancellation before acceptance.
     * @returns the accepted message's inbox id.
     */
    sendMessage(sender: Agent, targetId: SessionId, content: ContentBlock[], options: SubagentSendMessageOptions): Promise<MessageId>;
    /**
     * Queue one human-authored prompt as a distinct direct-child turn.
     * @param parent - exact live direct parent authorizing delivery.
     * @param childId - durable direct-child session id.
     * @param content - model-visible prompt blocks.
     * @param source - durable attribution for the human prompt.
     * @param signal - caller cancellation before inbox acceptance.
     * @returns the accepted durable message id.
     */
    queuePrompt(parent: Agent, childId: SessionId, content: ContentBlock[], source: MessageSource, signal: AbortSignal): Promise<MessageId>;
    /**
     * Steer one host-authored prompt to a direct continuable child.
     * @param parent - exact live direct parent authorizing delivery.
     * @param childId - durable direct-child session id.
     * @param content - model-visible prompt blocks.
     * @param source - durable attribution for the host prompt.
     * @param signal - caller cancellation before inbox acceptance.
     * @returns the accepted durable message id.
     */
    steerPrompt(parent: Agent, childId: SessionId, content: ContentBlock[], source: MessageSource, signal: AbortSignal): Promise<MessageId>;
    /** Admit local input synchronously before any teardown can begin. */
    private deliver;
    /**
     * Reject one child identity already owned by a live Agent or Session.
     * @param childId - proposed durable child session id.
     */
    private assertChildIdAvailable;
    /**
     * Pre-register `childId` in a continuation-managed parent's owned set so the
     * parent cannot settle while a caller is still establishing or resuming that
     * child. Returns a releaser for the failure path; it removes only a hold
     * this call added, and leaves ownership in place once a live Activation for
     * the child exists.
     * @param parent - the live direct parent the operation is admitted under.
     * @param childId - the durable child the operation addresses.
     * @returns the failure-path releaser; a no-op when nothing was added.
     */
    private holdOwnership;
    /**
     * Apply activation admission to a resident parent before delivering input.
     * @param parent - exact live Agent receiving the message.
     * @param message - durable user message to deliver.
     * @param delivery - receiving inbox destination.
     */
    private sendWaking;
    /**
     * Reject new admission once the manager or this exact parent tree began draining.
     * @param agent - exact live Agent whose lineage determines admission.
     */
    private assertAdmitting;
    /**
     * Authorize one operation against the durable direct-parent lineage.
     * @param parent - exact live Agent claiming direct-parent authority.
     * @param childId - durable child session id addressed by the operation.
     * @param parentSession - durable direct-parent id recorded by the child.
     */
    private authorizeLineage;
    /** Reject parent authority after the live registry entry changes. */
    private assertLiveParent;
    /**
     * Create or resume one child Agent and publish its Activation.
     * @param inputs - reconstruction and admission inputs for the residency epoch.
     * @returns the published process-local Activation.
     */
    private materialize;
    /**
     * Stop and release one Activation through its memoized close transaction.
     * @param activation - exact residency epoch to close.
     * @returns the shared close transaction.
     */
    private dispose;
    /** Close admission synchronously and share one release, including startup rollback. */
    private close;
    /** Dispose independent roots and report every branch failure after all settle. */
    private disposeRoots;
    /** Return the retained member set for one exact scoped-teardown root. */
    private closingMembers;
    /** Return the exact currently resolvable ancestry from `agent` upward. */
    private liveLineage;
    /** Return the teardown that closed continuable admission for this agent's lineage. */
    private closingTeardownFor;
    /** Resolve a root's pool once; descendants inherit their resident parent's pool directly. */
    private rootPool;
    /** Perform one tracked materialization through publication or rollback. */
    private materializeTracked;
    /**
     * Begin settlement observation after initial acceptance is recorded.
     * @param activation - accepted activation to observe.
     */
    private announce;
    /** Release an Activation whose start edge was not published. */
    private rollbackUnpublished;
    /** Register the child in a continuation-managed parent's owned set. */
    private acquireOwnership;
    /** Remove one child from its live owner's set and let that owner re-check settlement. */
    private releaseOwnership;
    /** Let a settlement watcher re-check residency after relevant state changes. */
    private wake;
    /** Follow one Activation to natural settlement. */
    private watchLocalSettlement;
    /** Report disposal failure once after the natural settlement observer finishes. */
    private reportTeardownFailure;
    /** Check pending input and owned children before closing admission. */
    private settlementState;
    /** Propagate stop synchronously and await descendant startup rollback before release. */
    private finishDisposal;
    /** Deliver the captured execution result to the durable direct parent after cleanup. */
    private notifySettlement;
    /** Request a best-effort final session flush before closing natural-settlement admission. */
    private flushFinalState;
    /** Return capabilities bound to an exact activation instead of a future same-id instance. */
    private receipt;
    /** Route one parent-originated delivery through residency and cold resume. */
    private deliverToChild;
    /** The delivery loop behind {@link deliverToChild}, run under the parent hold. */
    private deliverFollowup;
    /** Deliver one resident continuable child's message to its live direct parent. */
    private sendToParent;
    /** Send one Agent message while translating only the target's own rejection. */
    private sendAgentMessage;
    /**
     * Cold-resume a persisted child and submit the waiting turn. The descriptor
     * supplies every reconstruction input; no subagent provider is dispatched.
     */
    private coldResume;
    /** Admit a materialized child, commit its creation fact, and release it on failure. */
    private submitMaterialized;
    /** Build and submit one message across the final synchronous admission cutoff. */
    private submitAdmitted;
    /** Refuse image content for a child whose fixed model accepts text only. */
    private assertImageCapable;
    /** Resolve the persistence service continuable children require, or fail loud. */
    private requirePersistence;
    /** Resolve the Session query service used for cold child observations. */
    private requireSessionQuery;
}
export default SubagentManager;
//# sourceMappingURL=manager.d.ts.map