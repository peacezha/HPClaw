/**
 * Job Controller client half: installs `ctx.jobs` (rosters, observations, and
 * the human kill) over the generated `job` Remote namespace. The plugin resolves both Remote faces it drives while its
 * own context is current, because stream (re)opens run on caller stacks — a
 * React event, a carrier retry — whose dynamic context has not declared
 * `remote.job`.
 * @module @deepseek-ai/dsh-api-job-controller/client
 */
import type { Context } from '@deepseek-ai/cordis';
export type { JobsSnapshot, ObservedJob } from './model.ts';
export type { IJobs } from './service.ts';
export type { JobChunk, JobKillRequest, JobKillValue, JobFollowFrame, JobFollowRequest, JobListFrame, JobListRequest, JobView, } from '../types.ts';
/** Required Client Remote services. */
export declare const inject: string[];
/**
 * Install the client jobs service.
 * @param ctx - Client root Context.
 */
export declare function apply(ctx: Context): void;
//# sourceMappingURL=index.d.ts.map