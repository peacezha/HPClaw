/**
 * The `ctx.jobs` client service: reference-counted streams over the `job`
 * namespace — one `job.list` roster stream per watched session and one
 * `job.follow` stream per observed job — so overlapping viewers share a
 * stream, rosters resume whole after a reconnect, and observations resume
 * from the model's cursor, plus the human kill passthrough over `job.kill`.
 * @module @deepseek-ai/dsh-api-job-controller/client/service
 */
import { Service, type Context } from '@deepseek-ai/cordis';
import { type ClientRemote } from '@deepseek-ai/dsh-api-gateway/client';
import type { RemoteResult } from '@deepseek-ai/dsh-typert-protocol';
import type { JobId } from '@deepseek-ai/dsh-jobs/brand';
import type { SessionId } from '@deepseek-ai/dsh-session/types';
import type { JobKillRequest, JobKillValue, JobFollowFrame, JobFollowRequest, JobListFrame, JobListRequest } from '../types.ts';
import type { ClientJobsModel, JobsSource } from './model.ts';
/** The generated `job` namespace face the stream runners drive. */
export interface JobRemote {
    /**
     * Open one roster generation.
     * @param request - the session whose visible set to mirror.
     * @param signal - generation cancellation.
     * @returns the whole-set frame sequence of one generation.
     */
    list(request: JobListRequest, signal?: AbortSignal): AsyncIterable<JobListFrame>;
    /**
     * Open one observation generation.
     * @param request - target job, owning session, and optional resume offset.
     * @param signal - generation cancellation.
     * @returns the frame sequence of one generation.
     */
    follow(request: JobFollowRequest, signal?: AbortSignal): AsyncIterable<JobFollowFrame>;
    /**
     * Kill one job on the human's behalf.
     * @param request - the session whose list carries the job, and the job id.
     * @returns the registry's admission, or the business/transport failure.
     */
    kill(request: JobKillRequest): Promise<RemoteResult<JobKillValue>>;
}
/** Remote faces the runners drive: the Gateway stream factory and the `job` namespace. */
export interface JobsRemote {
    readonly $stream: ClientRemote['$stream'];
    readonly job: JobRemote;
}
/** The client jobs service face. */
export interface IJobs {
    /** Rosters and per-job observation state. */
    readonly state: JobsSource;
    /**
     * Keep one session's roster current; reference-counted, so two watchers of
     * the same session share one stream and the rows leave with the last.
     * @param sessionId - the session whose visible jobs to mirror.
     * @returns stop function releasing this watcher's reference.
     */
    watchRows(sessionId: SessionId): () => void;
    /**
     * Start observing one job's live output; reference-counted, so two viewers
     * of the same job share one stream.
     * @param sessionId - owning session used for the fenced read; undefined for an unowned job.
     * @param id - job to observe.
     * @returns stop function releasing this observer's reference.
     */
    observe(sessionId: SessionId | undefined, id: JobId): () => void;
    /**
     * Kill one background job from a session's job list. Pure RPC passthrough:
     * row state converges through the roster stream, and the caller (the
     * job-list control) owns error presentation.
     * @param sessionId - session whose job list carries the job.
     * @param id - the job row's registry id.
     * @returns the registry's admission, or the business/transport failure.
     */
    kill(sessionId: SessionId, id: JobId): Promise<RemoteResult<JobKillValue>>;
}
declare module '@deepseek-ai/cordis' {
    interface Context {
        /** React-free client job rosters and observation control. */
        jobs: IJobs;
    }
}
/** Owns the bare jobs snapshot and the per-session and per-job streams. */
export declare class ClientJobs extends Service implements IJobs {
    private readonly remote;
    private readonly model;
    readonly state: JobsSource;
    private readonly rowsEntries;
    private readonly observations;
    /**
     * @param ctx - client root Context.
     * @param remote - the Gateway stream factory plus the generated `job` namespace, both resolved by the caller.
     * @param model - shared client jobs model.
     */
    constructor(ctx: Context, remote: JobsRemote, model: ClientJobsModel);
    kill(sessionId: SessionId, id: JobId): Promise<RemoteResult<JobKillValue>>;
    watchRows(sessionId: SessionId): () => void;
    observe(sessionId: SessionId | undefined, id: JobId): () => void;
    /** Share the live entry under `key` or start one, and hand back its release. */
    private acquire;
    /**
     * Release closures bind the exact entry they were minted for, never the
     * map's current occupant: a later acquire on the same key may have replaced
     * a stopped entry, and decrementing or disposing through the key alone
     * would tear down that newer stream's references.
     */
    private releaser;
    private startRows;
    private startObservation;
}
//# sourceMappingURL=service.d.ts.map