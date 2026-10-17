import { type ExcelLimits, type ExcelPreview } from './model.ts';
/**
 * Parse delimited UTF-8 or BOM-marked UTF-16 without type inference.
 * @param bytes - Borrowed complete file bytes.
 * @param format - Comma or tab-separated input.
 * @param limits - Maximum worksheet area.
 * @returns A single sheet with literal field values.
 */
export declare function convertDelimited(bytes: Uint8Array<ArrayBuffer>, format: 'csv' | 'tsv', limits: ExcelLimits): ExcelPreview;
//# sourceMappingURL=delimited.d.ts.map