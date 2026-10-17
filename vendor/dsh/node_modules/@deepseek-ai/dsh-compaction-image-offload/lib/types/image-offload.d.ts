/** Select and log permanent image omissions in current model-request order. */
import type { Session, SessionSeq } from '@deepseek-ai/dsh-session';
/**
 * Record one decision omitting the oldest retained input-image occurrences.
 * Assistant nodes carry model output and are excluded. Image indexes count
 * every occurrence, including previously offloaded ones, within each message.
 * @param session - session whose next request applies the decision.
 * @param sourceEventSeqs - input message events in the failed request's order.
 * @param count - additional retained occurrences the adapter needs omitted.
 * @returns whether any occurrence remained to offload.
 */
export declare function offloadOldestImages(session: Session, sourceEventSeqs: readonly SessionSeq[], count: number): boolean;
//# sourceMappingURL=image-offload.d.ts.map