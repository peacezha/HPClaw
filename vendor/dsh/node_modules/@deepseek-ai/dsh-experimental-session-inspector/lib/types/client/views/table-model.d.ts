/** Row identities and raw values shared by the two virtual inspector tables. */
import type { ObservableSnapshot } from '@deepseek-ai/dsh-client-store';
/** One table position; children immediately follow their parent. */
export interface InspectorRow {
    readonly key: string;
    readonly parent?: string;
    readonly depth: number;
    /** Disclosure default; a block lifecycle transition resets any earlier user override. */
    readonly disclosure?: 'open' | 'closed';
}
/** One user disclosure choice, valid only for the lifecycle state in which it was made. */
export interface InspectorDisclosure {
    readonly state: InspectorRow['disclosure'];
    readonly collapsed: boolean;
}
/**
 * Resolve a manual choice or the block lifecycle default.
 * @param row - Current row metadata.
 * @param choices - Table-local user choices.
 * @returns Whether the row's descendants are hidden.
 */
export declare function inspectorRowCollapsed(row: InspectorRow, choices: ReadonlyMap<string, InspectorDisclosure>): boolean;
/** Table-local hierarchy index for disclosure and virtualized sticky ancestors. */
export declare class InspectorTableHierarchy {
    /** Depth-first row order with folded descendants omitted. */
    readonly rows: readonly InspectorRow[];
    private readonly byKey;
    private readonly branches;
    /**
     * @param rows - Complete depth-first row order.
     * @param choices - Table-local disclosure overrides.
     */
    constructor(rows: readonly InspectorRow[], choices: ReadonlyMap<string, InspectorDisclosure>);
    /**
     * Identify rows that own descendants or an explicit disclosure state.
     * @param key - Row identity.
     * @returns Whether this row owns a disclosure.
     */
    isBranch(key: string): boolean;
    /**
     * Find the current row's visible parent headers, including itself when it is a header.
     * @param index - First row at the viewport's scroll offset.
     * @returns Ordered indexes retained above the virtual viewport.
     */
    stickyIndexes(index: number): readonly number[];
}
/** Raw data and compact metadata for one independently updated row. */
export interface InspectorRecord {
    readonly type: string;
    readonly identity: string;
    readonly location: string;
    /** Unix epoch milliseconds. */
    readonly time?: number;
    readonly value: unknown;
    /** Owner-supplied preview for domain-specific field formatting. */
    readonly summary?: string;
    /** Parent summary used only while its children are folded. */
    readonly collapsedSummary?: string;
}
/** Converts a keyed source without changing snapshot identity on unchanged input. */
export declare class InspectorRecordSource<T> implements ObservableSnapshot<InspectorRecord | undefined> {
    private readonly source;
    private readonly project;
    private previous;
    private snapshot;
    /**
     * @param source - Existing keyed business source.
     * @param project - Raw metadata projection, evaluated only after its input changes.
     */
    constructor(source: ObservableSnapshot<T | undefined>, project: (value: T) => InspectorRecord);
    /** @returns Stable metadata for the current raw value. */
    getSnapshot: () => InspectorRecord | undefined;
    /** @param listener - Row invalidation callback. @returns Its disposer. */
    subscribe: (listener: () => void) => (() => void);
}
//# sourceMappingURL=table-model.d.ts.map