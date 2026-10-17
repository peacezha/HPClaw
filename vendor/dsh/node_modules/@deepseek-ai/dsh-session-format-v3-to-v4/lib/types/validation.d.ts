/** Native V4 metadata and generation-owned relationship validation. */
import type { SessionFormatArtifact, SessionFormatEvent } from '@deepseek-ai/dsh-session-format';
/**
 * Validate the exact native V4 logical header.
 * @param header - decoded or otherwise untrusted V4 Session header candidate.
 */
export declare function assertReleasedV4Header(header: unknown): void;
/**
 * Validate V4 inheritance, vocabulary, native message admission, and
 * lifecycle, compaction, tool, retry, title, command, catalog, and delivery ownership.
 * Installed Session restoration owns common event envelopes and message acceptance.
 * @param artifact - complete detached V4 artifact.
 * @param knownEventTypes - event types understood by the installed Session package.
 * @returns the same validated artifact and event objects.
 */
export declare function restoreReleasedV4Artifact(artifact: SessionFormatArtifact, knownEventTypes: ReadonlySet<string>): SessionFormatArtifact;
/**
 * Validate delivery generation and active-generation coordinates before evaluating ownership.
 * @param event - decoded event whose delivery payload may be inspected.
 * @param currentVersion - generation whose watermark coordinates are active.
 * @returns the active delivery's nonempty Session id, or undefined for other events and generations.
 */
export declare function validateDeliveryAccepted(event: SessionFormatEvent, currentVersion: 3 | 4): string | undefined;
/**
 * Validate native developer fields, message sources, lifecycle, catalog, and delivery
 * relationships without changing event vocabulary or tail recovery.
 * The owning admission stage rejects unknown required events;
 * unknown ignorable records retain their uninterpreted payloads.
 * @param artifact - decoded artifact with its final inherited cut.
 * @param knownEventTypes - installed event types whose payloads this reader interprets.
 */
export declare function assertReleasedV4Relationships(artifact: SessionFormatArtifact, knownEventTypes: ReadonlySet<string>): void;
//# sourceMappingURL=validation.d.ts.map