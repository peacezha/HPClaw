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
import { Service } from '@deepseek-ai/cordis';
import { installJobArchiveAdmission } from "./archive-admission.js";
export { JobId } from "./types.js";
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
export class JobRegistry extends Service {
    constructor(ctx) {
        // `abstract` erases at runtime, so a composition row naming this package
        // would register a ctx.jobs with no method implementations and fail far
        // from the misconfiguration. Fail loud at load instead.
        if (new.target === JobRegistry) {
            throw new Error('@deepseek-ai/dsh-jobs is the abstract job registry seam; load an implementation such as @deepseek-ai/dsh-jobs-local instead');
        }
        super(ctx, 'jobs');
        // Archive admission: the Workspace registry asks what still runs for a
        // Session before hiding it; owned jobs answer here for every implementation.
        installJobArchiveAdmission(ctx, this);
    }
}
export default JobRegistry;
//# sourceMappingURL=index.js.map