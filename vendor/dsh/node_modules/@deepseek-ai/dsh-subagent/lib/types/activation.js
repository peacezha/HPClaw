/** Execution-period records, capacity slots, child serialization, and local output capture.
 * @module @deepseek-ai/dsh-subagent/activation
 */
import { assertNever } from '@deepseek-ai/dsh-util-values';
import { finalAssistantOutput } from "./assistant-output.js";
import { epochStopReason } from "./lifecycle.js";
import { SubagentError } from "./error.js";
/** Process-local slots shared through uninterrupted continuable parent links. */
export class ActivationPool {
    slots = new Set();
    /**
     * Reserve before reconstruction; release also tolerates unpublished rollback.
     * @param capacity - the maximum simultaneous activations in this pool.
     * @returns an idempotent slot release.
     */
    reserve(capacity) {
        if (this.slots.size >= capacity) {
            throw new SubagentError(`subagent limit reached (active child limit: ${capacity}); wait for an existing child to finish `
                + 'or complete this work with the current agents', 'ACTIVATION_LIMIT_REACHED');
        }
        const slot = Symbol();
        this.slots.add(slot);
        return () => { this.slots.delete(slot); };
    }
}
/**
 * Read the live Agent retained by local execution.
 * @param activation - the managed local or external execution.
 * @returns the local Agent, absent for an external run.
 */
export function activationAgent(activation) {
    return activation.kind === 'local' ? activation.handle.agent : undefined;
}
/**
 * Require local residency before accepting further input.
 * @param activation - execution targeted by message delivery.
 * @returns the local activation.
 * @throws when the external backend cannot accept another message.
 */
export function requireLocalActivation(activation) {
    switch (activation.kind) {
        case 'local': return activation;
        case 'external':
            throw new SubagentError(`subagent "${activation.childId}" does not accept follow-up input`, 'NOT_CONTINUABLE');
        /* v8 ignore next 2 -- Both execution kinds are handled above. */
        default: return assertNever(activation);
    }
}
/**
 * Retain local failures whose turn ending could not be committed.
 * @param activation - exact local Agent and epoch receiving the scoped observers.
 * @param wake - notify its settlement watcher when failure changes readiness.
 */
export function observeLocalFailure(activation, wake) {
    const child = activation.handle.agent;
    child.ctx.on('agent/error', ({ agent }) => {
        if (agent !== child)
            return;
        activation.failureAt = child.session.seq;
        wake();
    });
    child.ctx.on('session/event', (session, event) => {
        if (session === child.session && event.type === 'turn/end'
            && activation.failureAt !== undefined && event.seq >= activation.failureAt) {
            activation.failureAt = undefined;
        }
    });
}
/**
 * Capture local output and retain failures without a later committed turn ending.
 * @param activation - the settled local execution and any structured result.
 * @returns final output, stop reason, and committed structured value.
 */
export function captureLocalResult(activation) {
    // oxlint-disable-next-line typescript/no-deprecated -- Existing Session history read; migration deferred.
    const events = activation.handle.agent.session.snapshotEvents(activation.outputStart);
    const output = finalAssistantOutput(events) ?? [];
    const stopReason = activation.failureAt === undefined ? epochStopReason(events) : 'error';
    const structured = activation.structured;
    if (structured !== undefined) {
        const captured = structured.captured();
        if (captured !== undefined)
            return { output, stopReason, structured: captured.value };
        if (stopReason === 'completed')
            return { output, stopReason: 'error' };
    }
    return { output, stopReason };
}
/** Serialize each durable child's delivery, release, and disposal. */
export class ChildLock {
    tails = new Map();
    /**
     * Run `operation` after every previously queued operation for `childId`.
     * @param childId - the durable child whose operations are linearized.
     * @param operation - the critical section to run in order.
     * @returns the operation's own settlement.
     */
    run(childId, operation) {
        const previous = this.tails.get(childId) ?? Promise.resolve();
        const result = previous.then(operation, operation);
        // Absorb rejections in the chaining tail so one failed critical section
        // cannot reject an unrelated later caller.
        const tail = result.then(() => undefined, () => undefined);
        this.tails.set(childId, tail);
        void tail.then(() => {
            if (this.tails.get(childId) === tail)
                this.tails.delete(childId);
        });
        return result;
    }
}
//# sourceMappingURL=activation.js.map