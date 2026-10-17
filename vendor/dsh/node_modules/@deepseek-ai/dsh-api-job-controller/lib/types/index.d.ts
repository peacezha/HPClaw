/**
 * Host job Remote owner: streams the background-job roster one session can
 * see and one job's retained output to browsers over the generated `job`
 * namespace, and stops a job on a human's behalf. The streams are
 * projections of `ctx.jobs`; the model's consuming cursor and notice state
 * never observe them, and a human kill is not the model's own, so the
 * completion notice still reaches the owning agent.
 * @module @deepseek-ai/dsh-api-job-controller
 */
import { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import type { JobKillRequest, JobKillValue, JobFollowFrame, JobFollowRequest, JobListFrame, JobListRequest } from './types.ts';
export type * from './types.ts';
declare module '@deepseek-ai/cordis' {
    interface Context {
        /** Host job Remote namespace owner. */
        jobController: JobController;
    }
}
/** Job Controller deployment policy. */
export interface Config {
    /** Coalescing window after a registry commit before the next rows or output read, in milliseconds (default 100). */
    readonly observeFlushMs?: number;
    /** Soft byte budget per observation output frame (default 65536); one larger chunk ships whole. */
    readonly observeMaxFrameBytes?: number;
}
/** Host service backing the generated `ctx.remote.job` namespace. */
export declare class JobController extends TypertRemoteService {
    static inject: string[];
    static Config: z<Config>;
    private readonly observeFlushMs;
    private readonly observeMaxFrameBytes;
    /**
     * @param ctx - Host context carrying the live Agent registry and the job registry.
     * @param config - observation cadence and framing policy.
     */
    constructor(ctx: Context, config: Config);
    /**
     * Stream the jobs one session can see — its own plus every unowned job —
     * as whole-set frames: one on open, then one after each coalesced burst of
     * lifecycle commits. The stream has no natural end; the carrier closes it.
     * @param request - the session whose visible set to mirror.
     * @param signal - cancellation owned by the Remote stream carrier.
     * @returns the roster frames.
     */
    list(request: JobListRequest, signal: AbortSignal): AsyncIterable<JobListFrame>;
    /**
     * Stream one job's retained output from an absolute byte offset, then its
     * terminal projection once settled and drained. Non-consuming: the
     * model-facing cursor and notice state never observe these reads. The
     * request's session is the fenced read's caller; the registry rejects a
     * job the session cannot see and an unknown job.
     * @param request - target job, owning session, and optional resume offset.
     * @param signal - cancellation owned by the Remote stream carrier.
     * @returns anchor, coalesced output frames, and the terminal status.
     */
    follow(request: JobFollowRequest, signal: AbortSignal): AsyncIterable<JobFollowFrame>;
    /**
     * Kill one background job on a human's behalf. The request's session is
     * the fenced read's caller, so the job must be one that session can see:
     * the registry's owner fence is the only access rule, and a child session's
     * own jobs are killable from its list like any other. The kill records
     * `cancelled by the user` as its reason; it is not one the model requested,
     * so the owning agent still receives the completion notice, and a shell
     * tool waiting on that job reads the reason in its own result.
     * @param request - Session whose job list carries the job, and the job id.
     * @returns the registry's admission of the kill request.
     */
    kill(request: JobKillRequest): JobKillValue;
}
export default JobController;
//# sourceMappingURL=index.d.ts.map