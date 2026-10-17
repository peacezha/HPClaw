/** File formats admitted by the spreadsheet preview. */
export type ExcelFormat = 'xlsx' | 'xls' | 'csv' | 'tsv';
/**
 * Resolve a registered filename to its parser.
 * @param path - Decoded file path.
 * @returns The supported suffix; rejects unsupported filenames.
 */
export declare function excelFormat(path: string): ExcelFormat;
//# sourceMappingURL=format.d.ts.map