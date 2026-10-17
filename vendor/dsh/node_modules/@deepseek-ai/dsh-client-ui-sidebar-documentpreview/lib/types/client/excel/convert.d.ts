/** Format-specific parsing into one read-only FortuneSheet representation. */
import type { ExcelFormat } from './format.ts';
import type { ExcelLimits, ExcelPreview } from './model.ts';
/**
 * Decode spreadsheet bytes without recalculating saved formulas.
 * @param bytes - Borrowed complete file bytes.
 * @param format - Format selected by the registered filename suffix.
 * @param limits - File and matrix allocation limits.
 * @returns Display sheets and missing formula-cache count.
 */
export declare function convertExcel(bytes: Uint8Array<ArrayBuffer>, format: ExcelFormat, limits: ExcelLimits): Promise<ExcelPreview>;
//# sourceMappingURL=convert.d.ts.map