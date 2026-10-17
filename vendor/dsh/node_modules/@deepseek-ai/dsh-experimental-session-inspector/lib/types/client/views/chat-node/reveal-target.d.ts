/** Precise and nearby Chat reveal candidates from the Inspector's loaded Chat snapshot. */
import type { InspectorChatTarget } from '../objects.ts';
import type { ChatConversationViewNode } from '@deepseek-ai/dsh-client-ui-chat/client';
/**
 * Preserve the primary identity or tool/exact/kind/nearest placement, then rank visible neighbors.
 * Explicit-node primaries include missing model coordinates, even when the node is hidden.
 * Request coordinates take precedence over the node's position.
 * Without a known anchor sequence, only the original target is returned.
 * @param target - Object identity or original event coordinates supplied by another View.
 * @param nodes - Current Session's loaded Chat nodes; equal-distance candidates retain input order.
 * @returns Primary target followed by distinct Step, Turn, and Session neighbors with only node coordinates.
 */
export declare function resolveChatRevealTargets(target: InspectorChatTarget, nodes: readonly ChatConversationViewNode[]): readonly InspectorChatTarget[];
//# sourceMappingURL=reveal-target.d.ts.map