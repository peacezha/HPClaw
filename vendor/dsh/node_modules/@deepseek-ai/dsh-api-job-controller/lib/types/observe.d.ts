/** Per-job observation generations: anchor, coalesced output, terminal status. */
import type { JobRegistry } from '@deepseek-ai/dsh-jobs';
import type { JobFollowFrame, JobFollowRequest } from './types.ts';
/** Cadence and framing bounds for one observation generation. */
export interface ObserveJobOptions {
    /** Coalescing window after a wake before reading, in milliseconds. */
    readonly flushMs: number;
    /**
     * Soft byte budget per `output` frame. Accumulated chunks flush once the
     * budget is met; one chunk larger than the budget ships whole (the
     * registry's retention cap is the hard bound on any single chunk).
     */
    readonly maxFrameBytes: number;
}
/**
 * Stream one job's retained output from an absolute offset: one `opened`
 * anchor, coalesced `output` frames as the ring advances, then one terminal
 * `status` after the settled job is drained, after which the generation
 * closes normally. A removal announced mid-generation (the owner's teardown)
 * closes it with the removed job's terminal projection instead of a failed
 * read. Reads are non-consuming — the model-facing cursor and
 * notice state never observe them; reconnecting callers resume by passing
 * the last frame's `next` as `from`. The request's session is the fenced
 * read's caller: the registry rejects a job the session cannot see and an
 * unknown job.
 * @param registry - the live job registry.
 * @param request - target job, owning session, and optional resume offset.
 * @param options - cadence and framing bounds.
 * @param signal - generation cancellation owned by the Remote stream carrier.
 * @returns the observation frame sequence for one generation.
 */
export declare function observeJobOutput(registry: JobRegistry, request: JobFollowRequest, options: ObserveJobOptions, signal: AbortSignal): AsyncIterable<JobFollowFrame>;
//# sourceMappingURL=observe.d.ts.map