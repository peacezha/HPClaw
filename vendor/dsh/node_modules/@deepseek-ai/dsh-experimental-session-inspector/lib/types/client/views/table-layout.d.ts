/** Live folding preserves the visible anchor and places unused viewport space after all data rows. */
import type { InspectorRow, InspectorTableHierarchy } from './table-model.ts';
/** Fixed table row and header height, in CSS pixels. */
export declare const INSPECTOR_ROW_HEIGHT = 30;
/** One data row in the virtual scroll layout. */
export type InspectorTableItem = {
    readonly key: string;
    readonly rowIndex: number;
    readonly size: number;
    readonly row: InspectorRow;
};
/** Last committed scroll geometry, measured before a source update. */
export interface InspectorViewport {
    readonly offset: number;
    readonly height: number;
}
/** A disclosure row's measured position relative to the scroll viewport. */
export interface InspectorRowAnchor {
    readonly key: string;
    readonly top: number;
}
/** View-local spacing; constructing without a predecessor resets retained blank areas. */
export declare class InspectorTableLayout {
    private readonly hierarchy;
    /** Visible data rows and their virtual sizes; excludes the table header and trailing space. */
    readonly items: readonly InspectorTableItem[];
    /** Whether a live block closure shortened the previous visible hierarchy. */
    readonly preservedCollapse: boolean;
    /** Trailing space in CSS pixels retained to keep the viewport anchor stable. */
    readonly bottomPadding: number;
    /** Anchored scroll offset in CSS pixels, or undefined when no anchor adjustment is needed. */
    readonly scrollOffset: number | undefined;
    private readonly minimumExtent;
    private readonly rowIndexes;
    /**
     * @param hierarchy - Current visible data rows.
     * @param previous - Previous committed layout, omitted after manual disclosure changes.
     * @param viewport - Scroll geometry before the current row change.
     * @param anchor - Clicked disclosure row to retain at its measured viewport position.
     */
    constructor(hierarchy: InspectorTableHierarchy, previous?: InspectorTableLayout, viewport?: InspectorViewport, anchor?: InspectorRowAnchor);
    /**
     * Keep the enclosing headers visible above the first visible data row.
     * @param itemIndex - First visible virtual item.
     * @returns Ancestor indexes in the virtual layout.
     */
    stickyIndexes(itemIndex: number): readonly number[];
    /**
     * Resolve each sticky level below the table header and already occupied sticky rows.
     * @param offset - Scroll offset in CSS pixels.
     * @returns Active ancestor indexes, outermost first.
     */
    stickyIndexesAtOffset(offset: number): readonly number[];
    private anchorOffset;
}
//# sourceMappingURL=table-layout.d.ts.map