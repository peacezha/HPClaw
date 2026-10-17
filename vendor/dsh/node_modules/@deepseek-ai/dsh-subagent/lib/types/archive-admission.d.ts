/**
 * The `subagent` family of the Workspace registry's archive admission: which
 * subagent descendants of a Session are still inside a turn, and how they
 * stop when the Session is archived with its work.
 *
 * @module @deepseek-ai/dsh-subagent
 */
import type { Context } from '@deepseek-ai/cordis';
/**
 * Answer `workspace/session-activity` with the running subagent descendants of
 * the asked Session, and `workspace/session-stop` by cancelling each of them
 * as their parent would. Both listeners live as long as `ctx`'s fiber.
 * @param ctx - context carrying the Agent registry; the Session query service is optional and only supplies labels.
 */
export declare function installSubagentArchiveAdmission(ctx: Context): void;
//# sourceMappingURL=archive-admission.d.ts.map