/** Replaceable element-to-record matching rules for the Inspector's Chat picker. */
import type { InspectorChatTarget } from '../objects.ts';
/** Chat identities enriched with the Node's loaded log coordinates before row lookup. */
export interface InspectorPickTarget extends InspectorChatTarget {
    readonly anchorSeq?: number;
    readonly nodeKind?: string;
}
/** A visible Chat box and its most specific available identity. */
export interface InspectorElementMatch {
    readonly element: HTMLElement;
    readonly target: InspectorPickTarget;
}
/**
 * Match tool-call boxes and Node parts before Group or Turn containers; never compare rendered text.
 * @param element - Pointer target in the main Chat.
 * @param root - Inspected Session's displayed main Chat column.
 * @returns Candidate identities and the box to preview, or undefined outside matching content.
 */
export declare function matchChatElement(element: Element, root: HTMLElement): InspectorElementMatch | undefined;
/**
 * Prefer an exact Node part, then its Node, Group, Step, or Turn table row.
 * @param target - Picked identities.
 * @param rows - Current row identities, including members of folded Inspector groups.
 * @returns The closest materialized table row, or undefined when none matches.
 */
export declare function matchChatNodeRow(target: InspectorPickTarget, rows: ReadonlyMap<string, InspectorChatTarget>): string | undefined;
//# sourceMappingURL=pick-match.d.ts.map