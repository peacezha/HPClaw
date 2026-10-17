/** V3 content tags and request-tool fields admitted before V4 interpretation. */
import type { SessionFormatEvent, SessionFormatJsonValue } from '@deepseek-ai/dsh-session-format';
/**
 * Convert declared content tags while keeping arguments and extension data opaque.
 * @param value - released content array.
 * @param subject - owning event and content location for diagnostics.
 * @returns content in the same order, sharing unchanged blocks and image references.
 */
export declare function migrateV3Content(value: SessionFormatJsonValue | undefined, subject: string): SessionFormatJsonValue[];
/**
 * Convert declared V3 extension content and stream tags after canonical result lifting.
 * @param event - source event after producer attribution conversion.
 * @returns the event with namespaced content tags, retaining all coordinates and other fields.
 * @throws {SessionFormatUnsupportedMigrationError} A V3 tool definition contains the V4-only deferLoading field.
 */
export declare function migrateV3EventContent(event: SessionFormatEvent): SessionFormatEvent;
//# sourceMappingURL=content.d.ts.map