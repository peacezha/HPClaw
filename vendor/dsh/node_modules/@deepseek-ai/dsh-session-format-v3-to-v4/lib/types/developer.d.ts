/** Native V4 developer-message and deferred-tool-schema validation. */
import type { SessionFormatEvent } from '@deepseek-ai/dsh-session-format';
/**
 * Validate native V4 developer messages, tool-change blocks, and deferred tool schemas.
 * Additional developer JSON fields are preserved. Malformed legacy message
 * slots remain available to recoverable decoding.
 * @param event - logical event or physical row before source-event range decoding.
 */
export declare function assertV4DeveloperData(event: SessionFormatEvent): void;
//# sourceMappingURL=developer.d.ts.map