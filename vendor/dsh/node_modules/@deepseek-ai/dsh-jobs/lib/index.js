import { Service } from "@deepseek-ai/cordis";
//#region lib/types/archive-admission.js
/**
* The `job` family of the Workspace registry's archive admission: the
* background jobs a Session owns that have not settled, and their kill when
* the Session is archived with its work. Installed by every registry
* implementation through the seam's constructor, so it holds for each of
* them through the abstract `list` and `kill` alone.
*
* @module @deepseek-ai/dsh-jobs
*/
/**
* Answer `workspace/session-activity` with the running or stopping jobs the
* asked Session owns, and `workspace/session-stop` by killing each of them.
* Both listeners live as long as `ctx`'s fiber — the registry's own.
* @param ctx - the registry's registration context.
* @param registry - the registry whose `list` and `kill` answer.
*/
function installJobArchiveAdmission(ctx, registry) {
	ctx.on("workspace/session-activity", async ({ sessionId }, next) => {
		const jobs = runningJobs(registry, sessionId);
		const rest = await next();
		if (jobs.length === 0) return rest;
		return [{
			kind: "job",
			items: jobs.map((job) => ({
				id: job.id,
				label: job.label
			}))
		}, ...rest];
	});
	ctx.on("workspace/session-stop", ({ sessionId }) => {
		for (const job of runningJobs(registry, sessionId)) try {
			registry.kill(job.id, sessionId, "session archived");
		} catch (error) {
			ctx.logger.warn(`jobs: killing "${job.id}" for an archived Session failed: ${String(error)}`);
		}
	});
}
/** The jobs the Session owns that have not settled; unowned jobs in the same listing belong to nobody. */
function runningJobs(registry, owner) {
	return registry.list(owner).filter((job) => job.owner === owner && (job.status === "running" || job.status === "stopping"));
}
//#endregion
//#region lib/types/brand.js
/**
* dsh-jobs' owned branded id, carried across the registry, the model-facing
* control surface, and the client wire.
*
* It lives in its own leaf because the package root and `./types` both reach
* `dsh-agent` through the owner and listener signatures, which a Client program
* cannot resolve even as a type. A browser-safe consumer imports the id here;
* `Branded<B>` itself comes from the zero-dependency `@deepseek-ai/dsh-brand`.
*
* @module @deepseek-ai/dsh-jobs/brand
*/
/**
* Brand a string as a {@link JobId}.
* @param id - the raw job-id string (the registry generates 16 UUID hex characters after the kind).
* @returns the same string, branded; no validation is performed.
*/
function JobId(id) {
	return id;
}
//#endregion
//#region lib/types/index.js
/**
* The background-job Service Definition (`ctx.jobs`). It owns the contract for
* job ids, session-scoped access, lifecycle state, the per-job output ring —
* one bounded stream that the model consumes through a registry-kept cursor
* and that any number of observers read at absolute byte offsets — and the
* event stream announcing every commit, while producers retain their
* execution resources. The process-local registry lives in
* `@deepseek-ai/dsh-jobs-local`.
* @module @deepseek-ai/dsh-jobs
*/
/**
* Abstract background job registry. Subclass, implement the abstract members,
* and load the subclass as a plugin — it registers as `ctx.jobs` (one
* implementation per context; loading a second throws, which is cordis'
* standard duplicate-service behavior).
*
* Implementations must honor these semantics:
* - Registrations outlive producer and controller fibers. Owner and
*   service disposal cancel live work and await compliant producers; a
*   throwing teardown cancel force-fails only the record. Such settlements
*   announce `cause: 'teardown'`, because a job whose owner is being destroyed
*   has no reader left.
* - Owned-job access is fenced by the owner's session id. Ids are
*   predictable, so authorization — not secrecy — is the boundary.
* - Settlement is first-wins: one terminal record, released waiters, then one
*   round of contained event delivery, even against a late producer outcome.
*   The `settled` event follows every released waiter and reports whether it
*   released one (`awaited`), so a completion reporter can skip settlements a
*   waiting caller already collected.
* - A settled record stays listed until its owner's disposal, service
*   disposal, or an explicit {@link remove} by a caller that collected the
*   terminal state itself and never handed the id out.
* - {@link start} refuses work while no attached job controller serves the
*   spec's owner, so a producer cannot start work that owner cannot collect
*   or stop. One registry serves every composition in the process, so this
*   question — and event delivery under `{ owners: 'scope' }` — is
*   owner-relative rather than process-wide: registrations made from an
*   unscoped context serve every owner, and registrations made under an agent
*   composition's scope serve exactly the agents composed under it.
* - Every job owns one output ring. Pull sources named by the spec are pumped
*   by the registry and drained once more before settlement; pushed appends
*   land whole. The model's consuming cursor and observers' absolute offsets
*   read the same bytes and never disturb each other.
* - Ring retention is bounded. Appends past the live cap drop the oldest
*   retained bytes; a reader below the retained window gets a lossy read,
*   never an error. Settlement trims retention to the settled cap and ends
*   the stream; the ring has no separate lifecycle.
*/
var JobRegistry = class JobRegistry extends Service {
	constructor(ctx) {
		if (new.target === JobRegistry) throw new Error("@deepseek-ai/dsh-jobs is the abstract job registry seam; load an implementation such as @deepseek-ai/dsh-jobs-local instead");
		super(ctx, "jobs");
		installJobArchiveAdmission(ctx, this);
	}
};
//#endregion
export { JobId, JobRegistry, JobRegistry as default };
