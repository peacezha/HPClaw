/**
 * Lifecycle-edge publication for managed subagent activations.
 *
 * Public event payloads live in `./types.ts`; the package-private observer
 * retains only the identity shared by each start/end pair.
 *
 * @module @deepseek-ai/dsh-subagent/lifecycle
 */
import type { Context } from '@deepseek-ai/cordis';
import type { Agent } from '@deepseek-ai/dsh-agent';
import type { SessionEvent, SessionId } from '@deepseek-ai/dsh-session';
import type { SubagentResult, SubagentRunEndInfo, SubagentRunInfo } from './types.ts';
/**
 * Lifecycle observer for one activation's residency epoch. Package-private: the
 * continuation manager is the only consumer, and its call ordering is an
 * in-package contract rather than a published extension point.
 */
export interface ActivationObserver {
    /**
     * Publish the start edge once the epoch is resident.
     * @param child - the resident local Agent, or undefined for an external execution.
     */
    start(child?: Agent): void;
    /**
     * Publish the terminal edge exactly once, pairing this epoch's {@link start},
     * after the disposal outcome is known. Called only for a resident epoch: a
     * failure before residency publishes no edge, because inventing one would
     * report a lifecycle the child never had.
     * @param result - the captured result, with teardown failures applied.
     */
    settle(result: SubagentResult): void;
}
/**
 * Publish one lifecycle edge with per-listener exception containment. Run edges
 * carry the delegating parent that keys scoped dispatch; provider removal has no
 * parent carrier and reaches listeners unscoped.
 *
 * The service owns this closure because scoped dispatch keys its carrier by the
 * exact service instance, whose own context filter composes into the carrier;
 * a narrowed stand-in would silently change scope filtering.
 */
export type LifecycleEmitter = {
    (name: 'subagent/start', info: SubagentRunInfo, parent: Agent): void;
    (name: 'subagent/end', info: SubagentRunEndInfo, parent: Agent): void;
    (name: 'subagent/provider-removed', info: string): void;
};
/**
 * Build the contained lifecycle emitter this seam publishes every edge through.
 * Every listener is independently contained: a synchronous throw or a rejected
 * returned promise is logged without starving peer listeners, changing the run,
 * or — for provider removal, which fires from a disposer — breaking teardown.
 * @param ctx - the service's own context, owning dispatch and the logger.
 * @param carrier - resolve the scoped dispatch carrier for one delegating parent.
 * @returns the emitter both observers and the provider registry publish through.
 */
export declare function createLifecycleEmitter(ctx: Context, carrier: (parent: Agent) => object): LifecycleEmitter;
/**
 * Build the observer for one local or external activation's residency epoch. Creation failure before residency emits no lifecycle edge.
 * @param emit - the contained lifecycle emitter.
 * @param provider - the provider name recorded in the durable descriptor.
 * @param childId - the durable child session id.
 * @param parent - the exact live direct parent keying scoped dispatch.
 * @returns the observer whose edges this epoch publishes.
 */
export declare function createActivationObserver(emit: LifecycleEmitter, provider: string, childId: SessionId, parent: Agent): ActivationObserver;
/**
 * Why this child's epoch ended, for the terminal lifecycle edge and the
 * manager's own parent delivery. The child's own log is authoritative:
 * teardown succeeding says nothing about whether the model errored, hit its
 * token ceiling, or was cancelled, so deriving the reason from disposal would
 * report failed work as completed.
 *
 * {@link foldConsumedWork} supplies both halves the raw turn sequence cannot:
 * which turn accounts for the work this epoch consumed, and whether accepted
 * work was cancelled after it without any turn opening over it. A recorded
 * failure still wins over a cancellation — stopping a child that had already
 * failed does not turn its failure into a cancellation.
 * @param events - this epoch's own event suffix.
 * @returns its terminal stop reason; `completed` only for an epoch that both
 *   closed cleanly and had nothing left to run.
 */
export declare function epochStopReason(events: readonly SessionEvent[]): SubagentResult['stopReason'];
//# sourceMappingURL=lifecycle.d.ts.map