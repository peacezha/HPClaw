/** Type-specific horizontal previews without changing raw inspector data. */
/** Maximum text length of a horizontal row preview. */
export declare const INSPECTOR_PREVIEW_LIMIT = 240;
/**
 * Format horizontal data with type-specific delta fields and bounded nesting.
 * @param value - Original row data, which remains unchanged for JSON inspection.
 * @param hiddenRootFields - Additional top-level metadata already displayed in the owning table's columns.
 * @returns A bounded preview omitting type, sequence, top-level time, and singleton field names.
 */
export declare function inspectorPreview(value: unknown, hiddenRootFields?: readonly string[]): string;
//# sourceMappingURL=format.d.ts.map