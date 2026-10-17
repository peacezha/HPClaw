/** Read-only spreadsheet surface backed by browser-parsed workbook data. */
import { type ReactNode } from 'react';
import type { LoadedExcelBodyProps } from './LazyExcelBody.tsx';
/**
 * Display stored spreadsheet values and formats without editing or recalculation.
 * Keep the mounted workbook sized to its preview pane.
 * @param props - Complete workbook bytes, limits, and locale.
 * @returns An isolated spreadsheet surface with cancellable loading.
 */
export declare function ExcelBody({ content, format, limits, t, loading }: LoadedExcelBodyProps): ReactNode;
//# sourceMappingURL=excel.d.ts.map