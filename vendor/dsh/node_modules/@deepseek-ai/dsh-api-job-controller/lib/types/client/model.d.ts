/**
 * React-free client job state: the roster each watched session can see, fed
 * by `job.list` frames, and per-job accumulated output views fed by
 * `job.follow` frames. Pure data plus subscriptions — transport wiring stays
 * in the client service, UI stays in slot components.
 * @module @deepseek-ai/dsh-api-job-controller/client/model
 */
import type { JobId } from '@deepseek-ai/dsh-jobs/brand';
import type { JobView } from '@deepseek-ai/dsh-jobs/view';
import type { SessionId } from '@deepseek-ai/dsh-session/types';
import type { JobFollowFrame } from '../types.ts';
/** One observed job's live view state. */
export interface ObservedJob {
    readonly jobId: JobId;
    /** Accumulated output tail, bounded to the render limit. */
    readonly text: string;
    /** True when bytes before {@link text} were dropped (eviction, resume gap, or the render bound). */
    readonly gapBefore: boolean;
    /** True while the observation stream is open and the job has not settled. */
    readonly streaming: boolean;
    /** Terminal observation failure, when the stream ended abnormally. */
    readonly error?: string;
}
/** Immutable client job state. */
export interface JobsSnapshot {
    /**
     * The jobs each watched session can see, keyed by session id. A session
     * nobody watches, or one that sees no job, has no key, so consumers read
     * absence rather than a sentinel.
     */
    readonly rows: Readonly<Record<string, readonly JobView[]>>;
    /** Live observation state keyed by job id. */
    readonly observed: Readonly<Record<string, ObservedJob>>;
}
/** Bare observable source for the client job snapshot. */
export interface JobsSource {
    /** Read the identity-stable current snapshot. */
    getSnapshot(): JobsSnapshot;
    /**
     * Subscribe to snapshot changes.
     * @param listener - invalidation callback.
     * @returns unsubscribe function.
     */
    subscribe(listener: () => void): () => void;
}
/** Owns the per-session rosters and per-job observation state. */
export declare class ClientJobsModel implements JobsSource {
    private readonly rowsBySession;
    private readonly observedStates;
    private readonly listeners;
    private snapshotCache;
    private snapshotDirty;
    getSnapshot(): JobsSnapshot;
    subscribe(listener: () => void): () => void;
    /**
     * Replace one session's roster with a `rows` frame's whole set. An empty
     * set is stored as an absent key.
     * @param sessionId - the watched session.
     * @param jobs - the complete visible set.
     */
    rowsReplaced(sessionId: SessionId, jobs: readonly JobView[]): void;
    /**
     * Drop one session's roster after its last watcher stops or its stream fails.
     * @param sessionId - the no-longer-watched session.
     */
    rowsDropped(sessionId: SessionId): void;
    /**
     * The resume offset for one job's next observation generation.
     * @param id - observed job.
     * @returns the last accepted `next`, or undefined for a fresh observation.
     */
    cursorOf(id: JobId): number | undefined;
    /**
     * Install or reset observation state when a generation's anchor arrives.
     * @param id - observed job.
     * @param frame - the generation's `opened` anchor.
     */
    observeOpened(id: JobId, frame: Extract<JobFollowFrame, {
        type: 'opened';
    }>): void;
    /**
     * Append one output frame's chunks to the bounded render tail.
     * @param id - observed job.
     * @param frame - a coalesced `output` frame.
     */
    observeOutput(id: JobId, frame: Extract<JobFollowFrame, {
        type: 'output';
    }>): void;
    /**
     * Close the live view once the terminal `status` frame arrived: the ring is
     * drained and the roster row carries the settled projection.
     * @param id - observed job.
     */
    observeSettled(id: JobId): void;
    /**
     * Record a terminal observation failure.
     * @param id - observed job.
     * @param error - the stream's terminal failure.
     */
    observeFailed(id: JobId, error: unknown): void;
    /**
     * Drop observation state after the last observer stops.
     * @param id - the no-longer-observed job.
     */
    observeStopped(id: JobId): void;
    private changed;
}
//# sourceMappingURL=model.d.ts.map