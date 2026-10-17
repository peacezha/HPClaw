/** Released V3 plugin-source conversion and declared message traversal. */
import type { SessionFormatEvent, SessionFormatJsonObject, SessionFormatJsonValue } from '@deepseek-ai/dsh-session-format';
/**
 * Visit only messages carried by first-party event payloads.
 * @param event - source or target logical event.
 * @param transform - message transform preserving unchanged identity.
 * @returns the event sharing all untouched payloads.
 */
export declare function mapEventMessages(event: SessionFormatEvent, transform: (message: SessionFormatJsonObject) => SessionFormatJsonObject): SessionFormatEvent;
/**
 * Lift one released V3 plugin source into the current producer-owned shape.
 * @param source - source record whose `kind` is `'plugin'`.
 * @param seq - event seq for diagnostics.
 * @param role - carried message role for role-sensitive renames.
 * @returns a copy whose kind is the producer's own kind and whose `plugin` field is dropped.
 */
export declare function rewritePluginSource(source: SessionFormatJsonObject, seq: number, role: SessionFormatJsonValue | undefined): SessionFormatJsonObject;
/**
 * Convert released plugin wrappers while retaining every direct source kind and its metadata.
 * @param source - decoded V3 message source.
 * @param seq - event sequence for diagnostics.
 * @param role - enclosing message role for role-sensitive producer mappings.
 * @returns the converted source with every non-identity field preserved.
 */
export declare function rewriteV3MessageSource(source: SessionFormatJsonObject, seq: number, role: SessionFormatJsonValue | undefined): SessionFormatJsonObject;
//# sourceMappingURL=sources.d.ts.map