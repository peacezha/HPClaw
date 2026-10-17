/** Shallow, typed runtime-object inspection without JSON conversion or implicit getter calls. */
/** One original field or collection entry, evaluated only when its parent is expanded. */
export interface InspectorObjectEntry {
    readonly key: string;
    readonly name: string;
    readonly value: unknown;
    readonly accessor?: boolean;
    /** An array slot without an own property, distinct from an explicit undefined value. */
    readonly absent?: boolean;
    /** Synthetic disclosure for non-index collection properties. */
    readonly properties?: boolean;
}
/** Display of one value; child enumeration never recursively visits child values. */
export declare class InspectorObjectValue {
    private readonly value;
    /** Shallow type or scalar preview; no child getters are evaluated. */
    readonly label: string;
    /** Whether this value permits child enumeration rather than opaque scalar display. */
    readonly expandable: boolean;
    /** @param value - Original runtime value, including Maps, Sets, and class instances. */
    constructor(value: unknown);
    /**
     * Enumerate one level without evaluating accessors or descending into children.
     * @returns Original children; Map keys remain values rather than being coerced to property names.
     */
    entries(): IterableIterator<InspectorObjectEntry>;
}
//# sourceMappingURL=object-value.d.ts.map