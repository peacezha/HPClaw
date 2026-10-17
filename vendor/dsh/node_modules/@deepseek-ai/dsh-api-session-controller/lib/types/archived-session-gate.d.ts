/**
 * The controller's admission gate for archived Sessions: an archived
 * Session, or a subagent descendant of one, must not run a model step until
 * it is restored. The work a Session still runs is reported and stopped by
 * its owners — the Agent registry (`turn`), the job registry seam (`job`),
 * the Subagent runtime (`subagent`), and the Schedule plugin (`schedule`) —
 * through the Workspace registry's archive-admission events.
 */
import type { Context, Plugin } from '@deepseek-ai/cordis';
import type { Agent } from '@deepseek-ai/dsh-agent';
/**
 * The gate as a plugin for `ctx.plugin(...)`: it loads once the Agent
 * registry, Session store, and Workspace registry are available and unwinds
 * with the plugin's fiber. A late waking delivery to an archived Session — a
 * subagent settlement, a queued follow-up — proposes a step the gate rejects,
 * which the loop ends as `blocked` without a request; unarchiving lifts the
 * gate for the whole lineage.
 */
export declare const ArchivedSessionGate: Plugin.Object<void>;
/**
 * Whether the Agent's Session, or a Session above it in its subagent lineage,
 * is archived. Lineage follows the durable header fields through
 * subagent-origin Sessions only: a fork of an archived Session is an
 * independent conversation.
 * @param ctx - Host context.
 * @param agent - the Agent proposing a step.
 * @returns whether an archived Session owns the step.
 */
export declare function underArchivedSession(ctx: Context, agent: Agent): boolean;
//# sourceMappingURL=archived-session-gate.d.ts.map