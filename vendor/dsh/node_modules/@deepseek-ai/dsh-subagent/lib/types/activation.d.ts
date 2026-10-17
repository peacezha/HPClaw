/** Execution-period records, capacity slots, child serialization, and local output capture.
 * @module @deepseek-ai/dsh-subagent/activation
 */
import type { Agent, AgentHandle } from '@deepseek-ai/dsh-agent';
import type { SessionId, SessionLogOffset } from '@deepseek-ai/dsh-session';
import type { ActivationObserver } from './lifecycle.ts';
import type { StructuredAttachment } from './structured.ts';
import type { SubagentResult, SubagentRun } from './types.ts';
/** Process-local slots shared through uninterrupted continuable parent links. */
export declare class ActivationPool {
    private readonly slots;
    /**
     * Reserve before reconstruction; release also tolerates unpublished rollback.
     * @param capacity - the maximum simultaneous activations in this pool.
     * @returns an idempotent slot release.
     */
    reserve(capacity: number): () => void;
}
/**
 * One residency epoch for a local child or an external execution.
 * The manager owns admission, execution handles, and resource release.
 */
interface ActivationBase {
    /** Shared capacity for this Activation and all its managed descendants. */
    readonly pool: ActivationPool;
    /** Return this epoch's slot after its handle has finished disposal. */
    readonly releaseSlot: () => void;
    /** The durable child this Activation is an epoch of. */
    readonly childId: SessionId;
    readonly parent: Agent;
    readonly delivery: 'parent' | 'caller';
    readonly result: PromiseWithResolvers<SubagentResult>;
    /** Published synchronously before teardown; subsequent callers share this transaction. */
    closing: Promise<void> | undefined;
    /**
     * Exact live Agent ancestry observed when this Activation materialized.
     * Weak membership preserves host-scope identity across an intermediate
     * ancestor leaving the registry without retaining that ancestor's runtime.
     */
    readonly ancestry: WeakSet<Agent>;
    /**
     * Session ids of the child Activations this one owns. Because one Session has
     * at most one live Activation, the id identifies the live child without
     * another runtime-incarnation reference. Non-empty blocks settlement.
     */
    readonly ownedChildren: Set<SessionId>;
    /** The lifecycle observer that emits this epoch's start and terminal edges. */
    readonly observer: ActivationObserver;
    /**
     * Whether any delivery to this child was ever accepted. A materialization
     * rolled back before its first acceptance is a child the caller was told does
     * not exist, so its teardown owes the parent no settlement account.
     */
    announced: boolean;
}
/** Resources retained only for the selected execution kind. */
export type ActivationResource = {
    readonly kind: 'local';
    readonly handle: AgentHandle;
    readonly outputStart: SessionLogOffset;
    readonly structured: StructuredAttachment | undefined;
    /** Latest live failure not superseded by a later committed turn ending. */
    failureAt: SessionLogOffset | undefined;
    /** Renewed when local settlement must recheck input or owned children. */
    poke: PromiseWithResolvers<void>;
} | {
    readonly kind: 'external';
    readonly run: SubagentRun;
    readonly controller: AbortController;
};
/** One managed execution period with its provider-specific resources. */
export type Activation = ActivationBase & ActivationResource;
/** Local residency with input admission and Session-backed result capture. */
export type LocalActivation = Extract<Activation, {
    kind: 'local';
}>;
/**
 * Read the live Agent retained by local execution.
 * @param activation - the managed local or external execution.
 * @returns the local Agent, absent for an external run.
 */
export declare function activationAgent(activation: Activation): Agent | undefined;
/**
 * Require local residency before accepting further input.
 * @param activation - execution targeted by message delivery.
 * @returns the local activation.
 * @throws when the external backend cannot accept another message.
 */
export declare function requireLocalActivation(activation: Activation): LocalActivation;
/**
 * Retain local failures whose turn ending could not be committed.
 * @param activation - exact local Agent and epoch receiving the scoped observers.
 * @param wake - notify its settlement watcher when failure changes readiness.
 */
export declare function observeLocalFailure(activation: LocalActivation, wake: () => void): void;
/**
 * Capture local output and retain failures without a later committed turn ending.
 * @param activation - the settled local execution and any structured result.
 * @returns final output, stop reason, and committed structured value.
 */
export declare function captureLocalResult(activation: LocalActivation): SubagentResult;
/** Serialize each durable child's delivery, release, and disposal. */
export declare class ChildLock {
    private tails;
    /**
     * Run `operation` after every previously queued operation for `childId`.
     * @param childId - the durable child whose operations are linearized.
     * @param operation - the critical section to run in order.
     * @returns the operation's own settlement.
     */
    run<T>(childId: SessionId, operation: () => Promise<T>): Promise<T>;
}
export {};
//# sourceMappingURL=activation.d.ts.map