/** Native source admission preserves unknown attribution and refuses retired plugin wrappers. */
import type { SessionFormatEvent } from '@deepseek-ai/dsh-session-format';
/**
 * Validate producer attribution in every declared durable message slot.
 * @param event - complete native V4 event before Session adoption.
 */
export declare function assertV4MessageSources(event: SessionFormatEvent): void;
/**
 * Refuse retired source syntax even after a malformed recoverable row; leave incomplete messages to decoding.
 * @param row - parsed row whose incomplete values have not been classified by the scanner.
 */
export declare function assertV4SourceRowAdmission(row: unknown): void;
//# sourceMappingURL=message-sources.d.ts.map