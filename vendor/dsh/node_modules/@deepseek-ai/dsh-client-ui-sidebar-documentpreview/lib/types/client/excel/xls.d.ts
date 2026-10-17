/** Legacy BIFF workbooks mapped to saved values and basic spreadsheet layout. */
import { type WorkBook } from 'xlsx';
import { type ExcelLimits, type ExcelPreview } from './model.ts';
/**
 * Decode a binary XLS workbook without accepting renamed text or HTML files.
 * @param bytes - Borrowed complete workbook bytes.
 * @param limits - Maximum combined worksheet area.
 * @returns Saved values, formulas, and supported workbook layout.
 */
export declare function convertXls(bytes: Uint8Array<ArrayBuffer>, limits: ExcelLimits): ExcelPreview;
/**
 * Map SheetJS values and optional BIFF layout metadata without retaining the workbook.
 * @param workbook - Parsed legacy workbook.
 * @param limits - Maximum combined worksheet area.
 * @returns FortuneSheet display data.
 */
export declare function mapXlsWorkbook(workbook: WorkBook, limits: ExcelLimits): ExcelPreview;
//# sourceMappingURL=xls.d.ts.map