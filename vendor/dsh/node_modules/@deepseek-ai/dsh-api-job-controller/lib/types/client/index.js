/**
 * Job Controller client half: installs `ctx.jobs` (rosters, observations, and
 * the human kill) over the generated `job` Remote namespace. The plugin resolves both Remote faces it drives while its
 * own context is current, because stream (re)opens run on caller stacks — a
 * React event, a carrier retry — whose dynamic context has not declared
 * `remote.job`.
 * @module @deepseek-ai/dsh-api-job-controller/client
 */
import { ClientJobsModel } from "./model.js";
import { ClientJobs } from "./service.js";
/** Required Client Remote services. */
export const inject = ['remote', 'remote.job'];
/**
 * Install the client jobs service.
 * @param ctx - Client root Context.
 */
export function apply(ctx) {
    // Read the namespace now, not inside `open`: see the module JSDoc.
    const { remote } = ctx;
    const { job } = remote;
    new ClientJobs(ctx, { $stream: options => remote.$stream(options), job }, new ClientJobsModel());
}
//# sourceMappingURL=index.js.map