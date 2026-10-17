/** First-class tool-role messages in the V4 representation. */
import type { SessionFormatEvent } from '@deepseek-ai/dsh-session-format';
/**
 * Lift one released-V3 wrapper tool/result row into the first-class V4 message.
 * Validate the wrapper before dropping it so malformed historical content is
 * rejected instead of being silently truncated.
 * @param event - released wrapper tool/result event.
 * @returns the same event with a first-class tool-role message.
 * @throws {SessionFormatError} when the wrapper, tool source, content, or error flag is malformed.
 * @throws {SessionFormatUnsupportedMigrationError} when the result contains another result.
 */
export declare function liftToolResult(event: SessionFormatEvent): SessionFormatEvent;
/**
 * Validate the native V4 first-class tool-role message of one tool/result row.
 * @param event - canonical V4 event.
 * @throws {SessionFormatError} when the row is not an exact first-class tool result.
 */
export declare function assertV4ToolResultMessage(event: SessionFormatEvent): void;
//# sourceMappingURL=tool-role.d.ts.map