/** Mandatory native V4 relationships; incomplete tails retain their open transactions. */
import type { SessionFormatArtifact } from '@deepseek-ai/dsh-session-format';
/**
 * Validate native V4 lifecycle and ownership facts without rewriting any event.
 * @param artifact - artifact whose V4 envelopes and messages have been admitted.
 * @param knownEventTypes - installed event types whose payloads this reader interprets.
 */
export declare function assertV4LifecycleRelationships(artifact: SessionFormatArtifact, knownEventTypes: ReadonlySet<string>): void;
//# sourceMappingURL=relationships.d.ts.map