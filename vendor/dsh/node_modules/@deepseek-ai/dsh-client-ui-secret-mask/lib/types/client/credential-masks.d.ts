/** Character that replaces each hidden credential character in `masked`. */
export declare const MASK = "*";
/** Builds masks; owns the shared mark strings and its sticky run pattern. */
export declare class CredentialMasks {
    private readonly marksOnly;
    private readonly marksLf;
    private readonly marksCr;
    /** Code units that `lines` counts without inspection: neither line breaks nor surrogates. Set `lastIndex` before each test. */
    private readonly ordinary;
    /**
     * The display form of `text[start, end)`, whose earliest candidate has `kind`.
     * @param text - the queried text.
     * @param kind - the literal kind of the range's earliest candidate.
     * @param plain - the range holds only prefixed-format characters: ASCII without line breaks.
     * @param start - first offset of the range.
     * @param end - offset after the range.
     * @returns the mask; line breaks stay in place, one mark per code point.
     */
    masked(text: string, kind: number, plain: boolean, start: number, end: number): string;
    /** `count` marks: up to the shared string's length, one slice of it. */
    private marks;
    /** `count` marks and then the line break `code`, 10 or 13: one slice where `marks` would be one. */
    private marksThen;
    /**
     * Keep the `BEGIN` line, the `END` line when present, and every line break; a block written on
     * one line is masked whole. Both searches stay inside the range, so they cost what the mask costs.
     */
    private keyBlock;
    /**
     * `text[start, end)` with every character except line breaks replaced; a surrogate pair is one
     * character, as `[^\r\n]` with the `u` flag counts it. A character loop: a native run could read far past `end`.
     */
    private range;
    /** `range` for a body that ends at a line break or the end of the text, where native runs stop. */
    private lines;
}
//# sourceMappingURL=credential-masks.d.ts.map