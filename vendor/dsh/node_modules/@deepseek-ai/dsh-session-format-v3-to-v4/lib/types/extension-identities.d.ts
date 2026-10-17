/** Fixed V3 event vocabulary and namespaced historical opaque events. */
import type { SessionFormatEvent } from '@deepseek-ai/dsh-session-format';
/** First-party event names understood by the released V3 reader, independent of the installed writer. */
export declare const RELEASED_V3_EVENT_TYPES: ReadonlySet<string>;
/**
 * Keep unknown ignorable events opaque after header promotion.
 * @param event - original V3 event; this incoming identity conversion is applied once.
 * @returns the same event or an ignorable namespaced event retaining its payload and coordinates.
 */
export declare function namespaceV3OpaqueEvent(event: SessionFormatEvent): SessionFormatEvent;
//# sourceMappingURL=extension-identities.d.ts.map