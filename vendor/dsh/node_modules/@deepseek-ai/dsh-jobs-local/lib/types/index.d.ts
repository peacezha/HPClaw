/**
 * Process-local provider for the background-job capability seam
 * (`ctx.jobs`). It keeps every job — lifecycle state, the bounded output
 * ring, and the model cursor — in memory and hands out fresh projections and
 * chunk copies, never live state.
 *
 * Registrations outlive producer and controller fibers. Agent or service
 * disposal cancels live work and awaits compliant producers; a throwing
 * teardown cancel force-fails only the record and reports a possible orphan.
 * @module @deepseek-ai/dsh-jobs-local
 */
import { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import type { SessionId } from '@deepseek-ai/dsh-session';
import { JobRegistry, JobId } from '@deepseek-ai/dsh-jobs';
import type { JobEvents, JobOutputRead, JobRead, JobSpec, JobView } from '@deepseek-ai/dsh-jobs';
/** Timeout code that distinguishes a bounded wait from caller cancellation. */
export declare const TASK_WAIT_TIMEOUT = "TASK_WAIT_TIMEOUT";
/** Configuration for the process-local job registry. */
export interface Config {
    /**
     * Maximum `running` plus `stopping` jobs per exact owner or in the shared unowned bucket;
     * omission defaults to 10.
     */
    maxConcurrentJobsPerOwner?: number;
    /** Live ring retention per job in UTF-8 bytes; omission defaults to 262144. */
    retainBytes?: number;
    /**
     * Ring retention kept after a job settles, in UTF-8 bytes; omission defaults to 16384.
     * Settlement keeps every byte the model cursor has not consumed on top of
     * this cap; the first terminal model read then trims to it.
     */
    settledRetainBytes?: number;
    /** Poll interval for a job's pull sources, in milliseconds; omission defaults to 150. */
    pumpPollMs?: number;
}
/**
 * The in-memory `jobs` registry. See the Service Definition contract in
 * `@deepseek-ai/dsh-jobs` for the ownership, isolation, and lifecycle
 * semantics this implementation honors.
 */
export declare class LocalJobRegistry extends JobRegistry {
    static Config: z<Config>;
    /** Schemastery-defaulted active-job limit. */
    private readonly maxConcurrentJobsPerOwner;
    /** Schemastery-defaulted live ring retention cap. */
    private readonly retainBytes;
    /** Schemastery-defaulted settled ring retention cap. */
    private readonly settledRetainBytes;
    /** Schemastery-defaulted pull-source poll interval. */
    private readonly pumpPollMs;
    private store;
    /**
     * Controllers and scoped subscriptions layered by the scope that registered
     * them, in the tools-registry shape: a contribution files into its
     * registering context's scope, and a read unions the global layer with the
     * owner's scope chain.
     *
     * The registry is one process-wide instance serving every composition, so a
     * flat table would answer a per-owner question process-wide: one preset's
     * job controls would hold `start()` open for an agent whose own composition
     * loads none, and one settlement would reach every preset's notice listener.
     * Layers make both reads owner-relative. Nothing derives a cache from a
     * layer, so change notification is a no-op.
     */
    private readonly layers;
    private readonly hub;
    /** Owner agents with attached scope cleanup, mapped to the exact disposer. */
    private ownerCleanups;
    /** Service context used by detached settlement continuations and teardown. */
    private readonly selfCtx;
    constructor(ctx: Context, config: Config);
    /**
     * The event stream bound to the accessing context: a subscription is an
     * effect of that context, and `{ owners: 'scope' }` names its scope.
     */
    get events(): JobEvents;
    start(spec: JobSpec): JobId;
    list(caller?: SessionId): JobView[];
    get(id: JobId, caller?: SessionId): JobView;
    read(id: JobId, caller?: SessionId): JobRead;
    readAt(id: JobId, from: number, caller?: SessionId): JobOutputRead;
    kill(id: JobId, caller?: SessionId, reason?: string): 'requested' | 'already-finished';
    wait(id: JobId, timeoutMs: number, caller?: SessionId, signal?: AbortSignal): Promise<JobView>;
    remove(id: JobId, caller?: SessionId): void;
    attachController(name: string): () => void;
    /**
     * Resolve a spec's owner session to its live Agent. An owned registration
     * needs the agent registry, and the session must currently have a live
     * instance: that instance's disposal is what cancels and drops the job.
     */
    private resolveOwner;
    /**
     * Whether an attached job controller can collect and stop work owned by
     * `owner`. The global layer holds every controller attached from an unscoped
     * context — a host composition's own controls — and therefore serves every
     * owner; a scoped controller serves exactly the agents composed under it.
     * @param owner - the job's owner, or undefined for unowned work.
     * @returns whether some reachable controller serves the owner.
     */
    private servesOwner;
    /** Count authoritative active records for one exact owner or the shared unowned bucket. */
    private activeJobCount;
    /** Look up a job and enforce caller access. */
    private expect;
    /**
     * The isolation fence: a job with an owner is reachable only by callers
     * whose session id matches (`!== undefined` semantics — an unowned job is
     * open, and a caller-less view can never match an owned one).
     */
    private assertAccess;
    /** Project a fresh read-only view from the mutable record. */
    private view;
    private emit;
    /** Publish committed facts before live subscribers or completion waiters react. */
    private recordSessionEvent;
    /**
     * Consume the ring from the model cursor; the result rides the first read
     * after settlement. A terminal read is the point the settled stream drops
     * to the settled cap: settlement kept every unconsumed byte for it.
     */
    private readJob;
    private killJob;
    private waitJob;
    /**
     * Append one chunk to the ring. A producer chunk against a settled job is
     * logged and dropped; the registry's own pump drains silently after
     * settlement (a forced settlement may precede the producer's). A chunk
     * staged inside the starter call is retained and signals no observer — the
     * registration commit publishes it.
     */
    private appendRing;
    /**
     * Contain a failing pull source: the first throw is logged, and the source
     * reads as exhausted from then on, so the job runs to its own settlement
     * with whatever the ring holds instead of freezing on a pump failure.
     */
    private guardSource;
    /** Announce that one job's ring advanced (append or settlement). */
    private emitOutput;
    /**
     * Replace the live progress line through a producer face; a write against a
     * settled job is logged and dropped. A write staged inside the starter call
     * seeds the registered projection and signals no observer.
     */
    private updateProgress;
    /**
     * Record the first terminal outcome, release waiters, then announce the
     * settlement. First-wins preserves a teardown force-failure against late
     * producer settlement. The settled event follows every released waiter and
     * reports whether it released one: a timed-out or aborted wait has already
     * left the set, so only a wait still owed the projection counts.
     */
    private settle;
    /**
     * Attach one awaited cleanup through the exact owner's scope. This survives
     * producer reloads and joins agent quiescence; the retained disposer lets
     * service teardown detach the cross-fiber effect.
     */
    private ensureOwnerCleanup;
    /** Cancel, await terminal records, and drop every job owned by one exact agent lifecycle. */
    private disposeOwned;
    /** Drop settled records and announce each removal, the one visible-set change no per-job record carries. */
    private drop;
    /**
     * Cancel live jobs, await settlement, drop every record, and detach owner
     * effects. Throwing cancels are force-failed to avoid teardown deadlock.
     */
    private disposeAll;
    /**
     * Cancel jobs during teardown with per-job containment. A throwing cancel
     * force-fails the record and reports a possible orphan; a cancel that returns
     * without settling remains indistinguishable from a slow stop and may stall.
     */
    private cancelForTeardown;
}
export default LocalJobRegistry;
//# sourceMappingURL=index.d.ts.map