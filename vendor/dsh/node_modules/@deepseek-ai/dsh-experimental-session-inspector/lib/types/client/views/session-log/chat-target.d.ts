/** Original log coordinates submitted for target-owned Chat reveal. */
import type { SessionEventLike } from '@deepseek-ai/dsh-api-session-controller/client';
import type { StreamChunk } from '@deepseek-ai/dsh-llm';
import type { InspectorChatTarget } from '../objects.ts';
/** Original owning event and, for an Assistant child row, its selected stream chunk. */
export interface SessionLogAnchor {
    readonly event: SessionEventLike;
    readonly chunk?: StreamChunk;
}
/**
 * Describe a log record without reading another View's model or DOM.
 * @param anchor - Original log event and optional selected delta.
 * @returns Original event coordinates and any tool-call or Assistant-part identity.
 */
export declare function sessionLogChatTarget(anchor: SessionLogAnchor): InspectorChatTarget;
//# sourceMappingURL=chat-target.d.ts.map