/** Retired native syntax remains a hard refusal even after a recoverable physical-row failure. */
/**
 * Refuse retired headers, PTC tags, and tool-result blocks in interpreted content slots.
 * Tool arguments, replay state, schema parameters, and nested extension values remain opaque.
 * @param row - parsed physical row or complete native logical event.
 */
export declare function assertV4RetiredSyntax(row: unknown): void;
//# sourceMappingURL=retired-syntax.d.ts.map