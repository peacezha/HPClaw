import type { ExcelFormat } from './format.ts';
import { type ExcelLimits, type ExcelPreview } from './model.ts';
/**
 * Parse workbook bytes in a disposable Worker, copying the retained preview buffer.
 * @param bytes - Borrowed complete file bytes.
 * @param format - Format selected by the registered filename suffix.
 * @param limits - File, matrix, and elapsed-time limits.
 * @param signal - Document body's lifetime.
 * @returns Parsed sheets; rejects with a locale key on parser failures.
 */
export declare function parseExcel(bytes: Uint8Array<ArrayBuffer>, format: ExcelFormat, limits: ExcelLimits, signal: AbortSignal): Promise<ExcelPreview>;
//# sourceMappingURL=parse.d.ts.map