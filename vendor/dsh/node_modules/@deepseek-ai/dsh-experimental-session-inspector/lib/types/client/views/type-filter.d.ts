/** Confirmed type filtering preserves the ancestors needed to inspect matching nested rows. */
import type { InspectorRow } from './table-model.ts';
/** Filtered row order and the distinction between matches and contextual ancestors. */
export interface InspectorTypeMatches {
    readonly rows: readonly InspectorRow[];
    readonly matches: ReadonlySet<string>;
}
/** Case-insensitive containment filter; optional surrounding stars have the same meaning as omission. */
export declare class InspectorTypeFilter {
    /** Trimmed type fragment without optional surrounding stars; preserves the entered case. */
    readonly query: string;
    private readonly needle;
    /** @param query - Type fragment; empty text or only stars clears filtering. */
    constructor(query: string);
    /**
     * Distinguish a type restriction from an empty or all-stars query.
     * @returns Whether this filter restricts the table.
     */
    get active(): boolean;
    /**
     * Match a type by case-insensitive containment, accepting all types when filtering is inactive.
     * @param type - Current raw type, absent while its record is unavailable.
     * @returns Whether the record matches the filter.
     */
    matches(type: string | undefined): boolean;
    /**
     * Retain matching rows and their ancestors; matching descendants start visible even under closed blocks.
     * @param rows - Complete loaded hierarchy, before user disclosure choices.
     * @param typeOf - Current type reader, independent of React row subscriptions.
     * @returns Matching rows and contextual ancestors in their original order.
     */
    apply(rows: readonly InspectorRow[], typeOf: (key: string) => string | undefined): InspectorTypeMatches;
    /**
     * Resolve candidates asynchronously from all loaded rows, not the already filtered subset.
     * @param rows - Complete loaded row list.
     * @param typeOf - Current raw type reader.
     * @returns Distinct matching types in deterministic order.
     */
    suggest(rows: readonly InspectorRow[], typeOf: (key: string) => string | undefined): Promise<readonly string[]>;
}
//# sourceMappingURL=type-filter.d.ts.map