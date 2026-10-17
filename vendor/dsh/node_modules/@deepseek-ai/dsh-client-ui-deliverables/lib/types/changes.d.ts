/** Validate workspace-change records that cross the Host routes and address their summary, comparison, and native-open actions. */
import type { SessionId } from '@deepseek-ai/dsh-session/types';
import type { WorkspaceChangedFile, WorkspaceChangesSummary, WorkspaceFileDiff } from '@deepseek-ai/dsh-workspace-changes/types';
/** Authenticated GET route serving one announced change summary while its Session lives. */
export declare const CHANGED_FILES_PATH = "/api/changes.summary";
/** Authenticated GET route serving one listed file's turn-start and turn-end comparison while its Session lives. */
export declare const CHANGES_DIFF_PATH = "/api/changes.diff";
/** Authenticated POST route for opening a changed file on the Host desktop. */
export declare const CHANGES_OPEN_PATH = "/api/changes.open";
/**
 * Browser-relative form of {@link CHANGED_FILES_PATH}; see
 * .agents/notes/implemented/architecture/2026-09-14-web-document-relative-app-routes.md.
 */
export declare const CHANGED_FILES_ROUTE: string;
/** Browser-relative form of {@link CHANGES_DIFF_PATH}. */
export declare const CHANGES_DIFF_ROUTE: string;
/** Browser-relative form of {@link CHANGES_OPEN_PATH}. */
export declare const CHANGES_OPEN_ROUTE: string;
/** Resource-address prefix of a turn's review tab in the right Sidebar. */
export declare const CHANGES_REVIEW_ADDRESS = "dsh-resource://changes-review/session/";
/** The summary fields the route serves; the Host keeps the working directory and snapshot ids to itself. */
export type ChangesSummary = Pick<WorkspaceChangesSummary, 'turn' | 'files' | 'total' | 'added' | 'deleted'>;
/** The comparison the route serves, as the Host computed it. */
export type ChangesDiff = WorkspaceFileDiff;
/** Coordinates of one turn's review: the viewed Session, the announcing event, and the turn it summarized. */
export interface ChangesReviewCoordinates {
    sessionId: SessionId;
    seq: number;
    /** The summarized turn, carried for the tab title. */
    turn: number;
}
/**
 * Validate one changed-file record read from the summary route.
 * @param value - decoded JSON.
 * @returns whether the record carries a path, a display path, and line counts.
 */
export declare function isChangedFile(value: unknown): value is WorkspaceChangedFile;
/**
 * Validate a summary read from the summary route.
 * @param value - decoded JSON.
 * @returns whether the value identifies a turn, a complete file list, the total count, and the line totals.
 */
export declare function isChangesSummary(value: unknown): value is ChangesSummary;
/**
 * Validate a comparison read from the comparison route.
 * @param value - decoded JSON.
 * @returns whether the value is a text comparison with well-formed hunks, or a binary or oversized refusal.
 */
export declare function isChangesDiff(value: unknown): value is ChangesDiff;
/**
 * Validate the `workspace/changes` event data read from a Session log.
 * @param value - decoded durable event data.
 * @returns whether the event names a turn.
 */
export declare function isChangesEvent(value: unknown): value is {
    turn: number;
};
/**
 * Build authenticated coordinates for the summary one `workspace/changes` event announced.
 * @param sessionId - owning Session.
 * @param seq - event sequence.
 * @returns document-relative summary route.
 */
export declare function changesSummaryUrl(sessionId: SessionId, seq: number): string;
/**
 * Build authenticated coordinates for one listed file's comparison.
 * @param sessionId - owning Session.
 * @param seq - workspace/changes event sequence.
 * @param index - original index in the summary's files array.
 * @returns document-relative comparison route.
 */
export declare function changesDiffUrl(sessionId: SessionId, seq: number, index: number): string;
/**
 * Build authenticated coordinates for a changed file's native open.
 * @param sessionId - owning Session.
 * @param seq - workspace/changes event sequence.
 * @param index - original index in the summary's files array.
 * @returns document-relative action route.
 */
export declare function changedFileUrl(sessionId: SessionId, seq: number, index: number): string;
/**
 * The right-Sidebar address of one turn's review. The Session and the event
 * sequence identify the content; the turn rides along for the tab title.
 * @param coordinates - viewed Session, announcing event, and turn.
 * @returns a `dsh-resource://changes-review/session/…` address.
 */
export declare function changesReviewAddress(coordinates: ChangesReviewCoordinates): string;
/**
 * Read the coordinates back out of a review address.
 * @param address - a resource address.
 * @returns the coordinates, or undefined for any other address.
 */
export declare function parseChangesReviewAddress(address: string): ChangesReviewCoordinates | undefined;
//# sourceMappingURL=changes.d.ts.map