/** Shared display cells, resource limits, and parser failure categories. */
import { type Cell, type Sheet, type SheetConfig } from '@fortune-sheet/core';
/** Resource limits applied before allocating FortuneSheet's dense cell matrices. */
export interface ExcelLimits {
    /** Maximum source file bytes. */
    maxBytes: number;
    /** Maximum combined rectangular cell area across worksheets. */
    maxCells: number;
    /** Maximum time allowed for one parser Worker. */
    timeoutMs: number;
}
/** Content categories reported in stable order when XLSX preview omits them. */
export declare const EXCEL_UNSUPPORTED_FEATURES: readonly ["charts", "images", "shapes", "conditionalFormatting"];
/** A detected workbook feature that the spreadsheet preview does not display. */
export type ExcelUnsupportedFeature = typeof EXCEL_UNSUPPORTED_FEATURES[number];
/** Preview data, missing formula results, and detected content that is not displayed. */
export interface ExcelPreview {
    sheets: Sheet[];
    missingResults: number;
    unsupportedFeatures: ExcelUnsupportedFeature[];
}
/**
 * Retain an addressable A1 selection, including an A1 merge.
 * @param config - Worksheet layout.
 * @returns The initial selection used when activating a worksheet.
 */
export declare function initialSelection(config: SheetConfig): NonNullable<Sheet['luckysheet_select_save']>;
/**
 * Apply number formatting and default alignment without evaluating formulas.
 * @param cell - Owned display cell to complete.
 * @param numberFormat - Excel number format code.
 * @returns The same cell with its display text and value type.
 */
export declare function formatCell(cell: Cell, numberFormat: string): Cell;
//# sourceMappingURL=model.d.ts.map