/**
 * The failure line one Remote code deserves.
 *
 * Kept apart from the component so the mapping is testable on its own. Codes
 * this reader does not name fall to the generic line carrying the carrier's
 * message.
 */
import type { RemoteFailure } from '@deepseek-ai/dsh-api-remotes/client';
import type { TranslateNS } from '@deepseek-ai/dsh-client-locale/client';
/**
 * Say what went wrong, in terms of the file rather than of the transport.
 * @param t - namespace-bound translate.
 * @param failure - the settled Remote failure.
 * @returns the line to show in place of the file.
 */
export declare function failureLine(t: TranslateNS<'sidebarDocumentPreview'>, failure: RemoteFailure): string;
/** The action an empty preview offers beside its failure line. */
export type EmptyFailureRecourse = 'open' | 'retry' | 'none';
/**
 * Choose the empty state's action for one settled read failure.
 * @param failure - the settled Remote failure.
 * @returns `open` for a readable file this preview cannot render, `none` for a
 * path with nothing to show or open, `retry` for the rest: carrier and
 * unclassified failures a second read may resolve.
 */
export declare function emptyFailureRecourse(failure: RemoteFailure): EmptyFailureRecourse;
//# sourceMappingURL=failure-line.d.ts.map