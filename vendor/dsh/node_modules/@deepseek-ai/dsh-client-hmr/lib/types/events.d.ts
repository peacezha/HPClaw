/**
 * Wire protocol of the `/plugins/events` SSE channel — single source for
 * both halves of this package. Frames still cross a wire boundary: the
 * browser half validates them at its JSON parse point; sharing the type keeps
 * the two ends from drifting, not from parsing.
 */
import type { WebBootGraph } from '@deepseek-ai/dsh-client-modules';
/** One SSE frame: the settled graph on connection or change, or one rebuilt bundle notice. */
export type PluginsEventFrame = {
    type: 'graph';
    graph: WebBootGraph;
} | {
    type: 'rebuilt';
    id: string;
    rev: string;
};
/** Browser wire-parse result: known frame, forward-compatible unknown type, or malformed payload. */
export type PluginsEventParseResult = {
    kind: 'frame';
    frame: {
        type: 'graph';
        graph: unknown;
    } | Extract<PluginsEventFrame, {
        type: 'rebuilt';
    }>;
} | {
    kind: 'unknown';
} | {
    kind: 'invalid';
};
/**
 * Validate the frame envelope; the module controller parses the complete graph before updating its index.
 * @param value - Parsed JSON value from the EventSource message.
 * @returns the known frame, an unknown-type marker, or an invalid marker.
 */
export declare function parsePluginsEventFrame(value: unknown): PluginsEventParseResult;
/** System SSE endpoint pushing graph/rebuilt frames (wire protocol constant). */
export declare const EVENTS_ENDPOINT = "/plugins/events";
/**
 * Document-relative form of {@link EVENTS_ENDPOINT} used by the browser half.
 * See .agents/notes/implemented/architecture/2026-09-14-web-document-relative-app-routes.md.
 */
export declare const EVENTS_ROUTE: string;
//# sourceMappingURL=events.d.ts.map