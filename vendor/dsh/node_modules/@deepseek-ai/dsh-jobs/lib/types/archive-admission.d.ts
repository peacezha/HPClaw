/**
 * The `job` family of the Workspace registry's archive admission: the
 * background jobs a Session owns that have not settled, and their kill when
 * the Session is archived with its work. Installed by every registry
 * implementation through the seam's constructor, so it holds for each of
 * them through the abstract `list` and `kill` alone.
 *
 * @module @deepseek-ai/dsh-jobs
 */
import type { Context } from '@deepseek-ai/cordis';
import type { JobRegistry } from './index.ts';
/**
 * Answer `workspace/session-activity` with the running or stopping jobs the
 * asked Session owns, and `workspace/session-stop` by killing each of them.
 * Both listeners live as long as `ctx`'s fiber — the registry's own.
 * @param ctx - the registry's registration context.
 * @param registry - the registry whose `list` and `kill` answer.
 */
export declare function installJobArchiveAdmission(ctx: Context, registry: JobRegistry): void;
//# sourceMappingURL=archive-admission.d.ts.map