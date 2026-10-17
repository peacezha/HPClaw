/**
 * Direct-child and recursive descendant discovery from parent-owned catalogs.
 * Each catalog read releases its Session observation before the next branch.
 * @module @deepseek-ai/dsh-subagent
 */
import type { Context } from '@deepseek-ai/cordis';
import type { SessionId } from '@deepseek-ai/dsh-session';
import type { SubagentListEntry } from './control-types.ts';
import type { SubagentCatalogEntry } from './projection-types.ts';
export type { SubagentListEntry } from './control-types.ts';
/** One catalog descendant with its direct parent and edge distance from the requested root. */
export type SubagentDescendantListEntry = SubagentListEntry & {
    /** Parent whose catalog contains this child. */
    readonly parentId: SessionId;
    /** Edge distance from the requested root; direct children are `1`. */
    readonly depth: number;
};
/**
 * Read one parent's durable catalog through a live-preferred Session observation.
 * @param ctx - context carrying the Session query service.
 * @param parentSessionId - parent whose direct children are requested.
 * @param signal - cancellation forwarded to the Session observation.
 * @returns direct-child rows in parent catalog event order.
 * @throws {@link SubagentError} when query or catalog projection is unavailable.
 */
export declare function listChildren(ctx: Context, parentSessionId: SessionId, signal?: AbortSignal): Promise<SubagentCatalogEntry[]>;
/**
 * Walk reachable parent catalogs in stable pre-order without loading Agents.
 * @see SubagentRuntime.listDescendants for failure and cancellation semantics.
 * @param ctx - context carrying the Session store and query service.
 * @param rootSessionId - parent whose catalog starts the traversal.
 * @param signal - cancellation checked around each catalog read.
 * @returns children and branch diagnostics with catalog parent and depth.
 */
export declare function listDescendants(ctx: Context, rootSessionId: SessionId, signal?: AbortSignal): Promise<SubagentDescendantListEntry[]>;
//# sourceMappingURL=list-children.d.ts.map