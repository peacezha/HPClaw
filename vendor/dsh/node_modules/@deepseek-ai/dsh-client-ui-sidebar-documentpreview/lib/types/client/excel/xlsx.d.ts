import { type ExcelLimits, type ExcelPreview } from './model.ts';
/**
 * Decode an XLSX into display cells, omitting drawings and retaining formulas without recalculation.
 * @param bytes - Complete borrowed workbook bytes.
 * @param limits - File and matrix allocation limits.
 * @returns Sheets ready for a read-only FortuneSheet workbook.
 */
export declare function convertXlsx(bytes: Uint8Array<ArrayBuffer>, limits: ExcelLimits): Promise<ExcelPreview>;
//# sourceMappingURL=xlsx.d.ts.map