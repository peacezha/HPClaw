/** Tables indexed by format position in `CREDENTIAL_FORMATS`, by ASCII code unit, or by a literal's last two code units. */
export interface FormatTables {
    /** Class bits per ASCII code unit. */
    readonly classes: Uint16Array;
    readonly literals: readonly string[];
    readonly literalLength: Uint8Array;
    readonly literalKind: Uint8Array;
    readonly literalShape: Uint8Array;
    readonly literalRun: Uint16Array;
    readonly literalMin: Int32Array;
    readonly literalMax: Int32Array;
    /**
     * Length of the longest proper suffix of each literal that begins a literal. The
     * scan resumes there, so a key block whose first dash ends `sk-` is still seen.
     */
    readonly literalOverlap: Uint8Array;
    /** Literal-only alternation of every literal, grouped by shared leading characters; no quantifier. */
    readonly prefixSource: string;
    /** Per key `code[-2] * 128 + code[-1]`: the literal with that ending plus one, or -1 where several share it. */
    readonly ending: Int8Array;
    /** Literals sharing an ending, by the same key. */
    readonly sharedEndings: readonly (readonly number[] | undefined)[];
}
/**
 * The tables for `CREDENTIAL_FORMATS`; the first call builds them.
 * @returns the shared, read-only tables.
 */
export declare function formatTables(): FormatTables;
//# sourceMappingURL=format-tables.d.ts.map