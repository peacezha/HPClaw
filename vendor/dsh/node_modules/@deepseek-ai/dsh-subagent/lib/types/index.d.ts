/**
 * Service Definition for the subagent capability seam (`ctx.subagents`): a named-provider registry plus a
 * capability-validating asynchronous start API. Providers establish a
 * child before returning its run, so fulfillment is the single publication and
 * ownership-transfer boundary.
 *
 * Multiple providers coexist: each registers under a unique name and callers
 * select one by name.
 *
 * This package owns the Service Definition role of the capability seam. Service Providers
 * (`@deepseek-ai/dsh-subagent-spawn-in-process`, `-fork`, `-acp`) and the model-facing
 * consumer (`@deepseek-ai/dsh-tool-subagent`) are separate packages.
 *
 * `startActivation` establishes every child under the activation manager, which
 * owns execution, result delivery, and resource release. Local providers seed
 * resumable Agents; external providers return a single execution handle.
 * `sendMessage` steers between adjacent local Agents without exposing
 * whether a child is resident. Discovery combines real child Sessions with
 * parent-owned records for external executions.
 * Direct discovery reads parent catalogs; descendants recursively read reachable
 * child catalogs. External entries are leaves without local Sessions.
 *
 * Same-process providers are trusted typed collaborators. Requests, provider
 * descriptors, results, and lifecycle payloads are borrowed immutable values;
 * serialization and hostile-input validation belong at real process, worker,
 * persistence, and model boundaries.
 *
 * @module @deepseek-ai/dsh-subagent
 */
import type { Volatile } from '@deepseek-ai/cordis';
import { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import type { Scoped } from '@deepseek-ai/dsh-scope';
import type { ContentBlock, MessageId } from '@deepseek-ai/dsh-llm';
import type { Agent } from '@deepseek-ai/dsh-agent';
import type { SessionId } from '@deepseek-ai/dsh-session';
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import type { SubagentInterruptReceipt, SubagentPromptReceipt, SubagentPromptRequest } from './control-types.ts';
import type { SubagentActivation, SubagentActivationSpec, SubagentInterruptAuthority, SubagentProvider, SubagentRunEndInfo, SubagentRunInfo, SubagentSendMessageOptions } from './types.ts';
import type { SubagentDescendantListEntry } from './list-children.ts';
import type { SubagentCatalogEntry } from './projection-types.ts';
import { deliverSubagentPrompt } from './internal.ts';
export type {} from './catalog.ts';
export * from './out-of-process.ts';
export { AssistantOutputFold, finalAssistantOutput } from './assistant-output.ts';
export { SubagentRunId } from './types.ts';
export type { ContinuableCreateRequest, ContinuableCreateSpec, SubagentCapabilities, SubagentActivation, SubagentActivationSpec, SubagentInterruptAuthority, SubagentProvider, SubagentResult, SubagentRun, SubagentSendMessageOptions, SubagentStartRequest, ResolvedSubagentStartRequest, SubagentStopReason, SubagentStopReasonMap, } from './types.ts';
export { foldSubagentDescriptor, snapshotSubagentDescriptor, SUBAGENT_DESCRIPTOR_VERSION, } from './descriptor.ts';
export type { ContinuableSubagentDescriptorData, ContinuableSubagentDescriptorInput, OneShotSubagentDescriptorData, SubagentDescriptorData, } from './descriptor.ts';
export { STRUCTURED_OUTPUT_TOOL } from './structured.ts';
export { SubagentError } from './error.ts';
export { assertSubagentMaxDepth, delegationDepthOf } from './depth.ts';
export { appendDelegatedPolicyOverrides, applyChildComposition, captureDelegatedPolicyOverrides, childSessionMeta, parentAgentOptionsForDelegation, resolveChildAgentOptions, resolveChildDepth, SubagentDepthError, } from './child-agent.ts';
export type { ChildComposition, DelegatedPolicyOverrides } from './child-agent.ts';
export type { AgentMessageSource, SubagentSettledMessageSource } from './continuation-messages.ts';
export type * from './control-types.ts';
export type { SubagentDescendantListEntry } from './list-children.ts';
export type { SubagentRunEndInfo, SubagentRunInfo } from './types.ts';
export type { SubagentCatalogEntry, SubagentIdentityProjection, SubagentTimingProjection } from './projection-types.ts';
declare module '@deepseek-ai/cordis' {
    interface Context {
        subagents: SubagentRuntime;
    }
    interface Events {
        /**
         * A provider became resolvable in the registry.
         * @param provider - the registered provider.
         * @mode emit
         */
        'subagent/provider-added'(provider: SubagentProvider): void;
        /**
         * A provider left the registry. Accepted runs remain holder-owned.
         * @param name - the provider name that no longer resolves.
         * @mode emit
         */
        'subagent/provider-removed'(name: string): void;
        /**
         * A provider established a published child. For in-process providers,
         * `ctx.agents.get(info.id)` resolves during this notification.
         * Scope-filtered dispatch keys the carrier by the delegating parent, so a
         * parent-scoped listener observes only its own delegations. Paired with
         * `subagent/end`.
         * @param info - the provider and published child identity.
         * @mode emit
         */
        'subagent/start'(this: Scoped<SubagentRuntime>, info: SubagentRunInfo): void;
        /**
         * A published child settled. Scope-filtered dispatch uses the same delegating
         * parent carrier as `subagent/start`, so the lifecycle pair reaches the
         * same scoped audience.
         * @param info - the run identity and terminal outcome.
         * @mode emit
         */
        'subagent/end'(this: Scoped<SubagentRuntime>, info: SubagentRunEndInfo): void;
    }
}
/** Host configuration for continuable subagent capacity. */
export interface Config {
    /** Maximum live children sharing uninterrupted continuable parent links; defaults to 8. */
    maxActiveSubagents: Volatile<number>;
    /** Default delegation depth for tools without an explicit limit; defaults to 1. */
    maxDepth: Volatile<number>;
}
/** Named provider registry with managed activations, durable discovery, and local child messaging. */
export declare class SubagentRuntime extends TypertRemoteService {
    private config;
    static Config: z<Schemastery.ObjectS<NoInfer<{
        maxDepth: z<number, number, "volatile-defined">;
        maxActiveSubagents: z<number, number, "volatile-defined">;
    }>>, Schemastery.ObjectT<NoInfer<{
        maxDepth: z<number, number, "volatile-defined">;
        maxActiveSubagents: z<number, number, "volatile-defined">;
    }>>, "plain">;
    static inject: string[];
    private providers;
    private manager;
    /**
     * The contained lifecycle-edge publisher. Built here because scoped dispatch
     * keys its carrier by this exact service instance, whose own context filter
     * composes into the carrier.
     */
    private readonly emitLifecycle;
    constructor(ctx: Context, config: Config);
    /**
     * Resolve a delegation tool's depth policy against the current user setting.
     * @param configured - Explicit tool limit, or provider-managed for external delegation.
     * @returns The numeric limit, or undefined when the provider owns depth enforcement.
     */
    resolveMaxDepth(configured?: number | 'provider-managed'): number | undefined;
    /**
     * Start a local child under its reserved identity.
     * @param spec - local task, reserved child id, and result recipient.
     * @returns activation with its accepted initial message id.
     */
    startActivation(spec: SubagentActivationSpec & {
        readonly childId: SessionId;
    }): Promise<SubagentActivation & {
        readonly messageId: MessageId;
    }>;
    /**
     * Start a local or external child.
     * @param spec - task, backend, and result recipient.
     * @returns activation with a message id only for local children.
     */
    startActivation(spec: SubagentActivationSpec): Promise<SubagentActivation>;
    /**
     * Join progressing descendants without cancelling them. Idle descendants whose
     * inboxes require a later wake stay resident and do not delay host completion.
     * @param parent - the exact parent whose descendant work is observed.
     * @returns whether work was joined; hosts recheck parent idle after true.
     */
    waitForChildren(parent: Agent): Promise<boolean>;
    /**
     * Steer one model-authored message to the sender's direct parent or direct
     * continuable child. A running target admits it at the nearest step boundary;
     * an idle target starts a turn, and an absent direct child cold-resumes from
     * persistence. The service derives durable sender attribution from the exact
     * live sender. Caller cancellation stops only pre-acceptance work.
     * @param sender - exact live Agent authorizing and originating the message.
     * @param targetId - durable direct-parent or direct-child session id.
     * @param content - model-authored content to deliver.
     * @param options - caller cancellation before inbox acceptance.
     * @returns the accepted message's inbox id.
     * @throws when continuation services are unavailable, adjacency is rejected,
     *   or the message was not admitted.
     */
    sendMessage(sender: Agent, targetId: SessionId, content: ContentBlock[], options: SubagentSendMessageOptions): Promise<MessageId>;
    /**
     * Deliver one host-protocol message to a direct continuable child.
     * Symbol-keyed so host adapters can preserve their own source descriptors without
     * widening the public Service Definition or impersonating an Agent sender.
     * @param parent - exact live direct parent authorizing delivery.
     * @param childId - durable direct-child session id.
     * @param content - host-authored content to deliver.
     * @param source - durable host-protocol source descriptor.
     * @param signal - caller cancellation before inbox acceptance.
     * @param delivery - Queue as a distinct turn or Steer at the nearest step.
     * @returns the accepted message's inbox id.
     */
    private [deliverSubagentPrompt];
    /**
     * Interrupt one live child's current execution under a human parent
     * address or an exact live ancestor Agent. Fire-and-return: the cancel
     * signal is issued before this returns, but the target may keep running
     * until it observes the signal. Unclaimed pending inbox work, the Activation,
     * and published descendants are preserved; claimed work is not requeued.
     * Once the interrupted Agent is idle, a waking send resumes the parked FIFO
     * queue. External backends stop their single execution. An absent target
     * is an accepted no-op, as is a manager-less composition, which cannot own a
     * live Activation.
     * @param targetSessionId - the durable child session id to interrupt.
     * @param authority - the human parent address or exact live ancestor Agent.
     * @throws {SubagentError} `UNAUTHORIZED` when the authority does not own the
     *   live target.
     */
    interrupt(targetSessionId: SessionId, authority: SubagentInterruptAuthority): void;
    /**
     * Close subagent admission below exact live parent Agents, stop only their
     * visible descendant Activations synchronously, then await admitted scoped
     * materializations and release those forests child-first. The scoped cutoff
     * lasts until each exact parent leaves the registry; unrelated parent trees
     * remain live.
     * @param parents - exact host-owned parent Agents entering teardown.
     * @returns once every retained descendant activation released its execution handle.
     * @throws an aggregate error after all branches settle when any failed.
     */
    drainDescendants(parents: readonly Agent[]): Promise<void>;
    /**
     * Release selected resident direct children of one exact live
     * parent. Other children of the same parent remain admitted and resident.
     * Absent targets and a manager-less composition are accepted no-ops.
     * @param parent - exact live direct parent authorizing the selected release.
     * @param childIds - durable direct-child ids to release when resident.
     * @returns once every selected activation released its execution handle.
     * @throws {SubagentError} `UNAUTHORIZED` when a resident target belongs to a
     *   different parent or the supplied parent identity is stale.
     */
    drainChildren(parent: Agent, childIds: readonly SessionId[]): Promise<void>;
    /**
     * Read the parent's durable direct-child catalog without loading or resuming an Agent.
     * The service owns and releases the live-preferred Session observation.
     * @param parentSessionId - parent whose direct children are requested.
     * @param signal - cancellation forwarded to the Session query.
     * @returns catalog children in parent event order.
     * @throws {@link SubagentError} when query or catalog projection is unavailable.
     * @throws SessionQueryError when the parent cannot be read or the query is cancelled.
     */
    listChildren(parentSessionId: SessionId, signal?: AbortSignal): Promise<SubagentCatalogEntry[]>;
    /**
     * Recursively list reachable parent catalogs in stable pre-order, preserving
     * each catalog's event order. Each row carries its catalog parent and depth;
     * external children are leaves; one-shot and unknown-mode children remain
     * traversal nodes. Unknown modes
     * produce unsupported diagnostics. Unreadable child catalogs produce corrupt
     * or unavailable diagnostics and stop only that branch. Root read failures,
     * missing services or projections, and cancellation reject the whole listing.
     * Each catalog is observed once and released before the next read. No Agent
     * is loaded or resumed; Sessions absent from reachable catalogs are omitted.
     * @param rootSessionId - session whose catalog starts descendant discovery.
     * @param signal - cancellation forwarded to and checked around each catalog read.
     * @returns children and branch diagnostics in parent-catalog pre-order.
     * @throws {@link SubagentError} when listing dependencies are unavailable or the caller cancels.
     * @throws SessionQueryError when the root catalog cannot be read.
     */
    listDescendants(rootSessionId: SessionId, signal?: AbortSignal): Promise<SubagentDescendantListEntry[]>;
    /**
     * Deliver one browser-authored message to a continuable child through the
     * exact live direct parent, retaining the caller-minted request identity and
     * validated browser zone on the accepted message. Success identifies the
     * message the child's inbox accepted; later execution is independent of this
     * call. Queue delivery targets a later turn; steer delivery targets the
     * nearest step and retains the Agent loop's best-effort fallback semantics.
     * Image parts are admitted and persisted through the attachment store
     * before delivery, and the child's model must accept image input.
     * Cold resume at capacity rejects with `subagent/delivery-unavailable`.
     * @param request - durable address, delivery, minted identity, content, and optional browser zone.
     * @param signal - carrier cancellation, owning the call until inbox acceptance.
     * @returns the accepted message's inbox identity.
     * @throws {RemoteError} `gateway/bad-request`, `subagent/attachment-invalid`,
     *   `subagent/invalid-time-zone`, `subagent/parent-unavailable`,
     *   `subagent/not-resumable`, `subagent/unauthorized`,
     *   `subagent/delivery-unavailable`, `gateway/cancelled`, or `gateway/internal`.
     */
    prompt(request: SubagentPromptRequest, signal: AbortSignal): Promise<SubagentPromptReceipt>;
    /**
     * Remote face of {@link interrupt} under one durable parent address. No
     * catalog, history, persistence, or parent Agent lookup runs: the core
     * primitive alone authorizes the address against the live Activation, which
     * is what keeps a live child interruptible while its parent Agent is offline.
     * Absent, idle, and already-completed targets are accepted no-ops there.
     * @param childSessionId - durable child session id to interrupt.
     * @param parentSessionId - durable direct parent whose authority is claimed.
     * @param mode - required continuable-address discriminator.
     * @returns acknowledgement that the cancel signal was admitted, not that the target is quiescent.
     * @throws {RemoteError} `gateway/bad-request` for an empty id,
     *   `subagent/unauthorized` when the address does not own the live target,
     *   otherwise `gateway/internal`.
     */
    interruptByParent(childSessionId: SessionId, parentSessionId: SessionId, mode: 'continuable'): SubagentInterruptReceipt;
    /**
     * Register a provider under its name. Registration is effect-scoped and HMR
     * safe; removing a provider blocks new starts but does not revoke runs that
     * were already returned to their holders. Providers without either execution
     * method are rejected with UNSUPPORTED_CAPABILITY before registration.
     * @param provider - the trusted provider implementation.
     * @returns the exact Cordis effect disposer.
     */
    registerProvider(provider: SubagentProvider): () => void;
    /**
     * Look up a provider by name.
     * @param name - the provider name.
     * @returns the provider, or undefined when absent.
     */
    getProvider(name: string): SubagentProvider | undefined;
    /**
     * List registered provider names in insertion order.
     * @returns the registered names.
     */
    list(): string[];
    /**
     * Resolve one provider's detached continuable-creation contribution. Method
     * presence on the provider IS the capability, so a provider without it is
     * rejected before the manager reserves any child resources.
     */
    private prepareContinuable;
    /** Look up a provider for dispatch or fail loud. */
    private expectProvider;
    /** Resolve the subagent manager or fail loud. */
    private requireManager;
    /**
     * Build the lifecycle observer for one continuable Activation's residency
     * epoch, so the manager publishes its edges without owning event dispatch.
     */
    private observeActivation;
    /** Reject the first requested capability that the provider lacks. */
    private assertCapabilities;
}
export default SubagentRuntime;
//# sourceMappingURL=index.d.ts.map