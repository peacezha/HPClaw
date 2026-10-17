/** Load the spreadsheet renderer only when a supported workbook is opened. */
import { type ReactNode } from 'react';
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
import type { DocumentPreviewProps } from '../document/contract.ts';
import { type ExcelFormat } from './format.ts';
import type { ExcelLimits } from './model.ts';
/** Document input plus parser limits and localized copy. */
export type ExcelBodyProps = DocumentPreviewProps & PropsLocale<'sidebarExcel'> & {
    readonly limits: ExcelLimits;
};
/** Lazily loaded renderer input with the parser choice and main-bundle loading content. */
export type LoadedExcelBodyProps = ExcelBodyProps & {
    readonly format: ExcelFormat;
    readonly loading: ReactNode;
};
/**
 * Load the browser spreadsheet renderer for every registered format.
 * @param props - Complete file bytes and standard document seats.
 * @returns Localized loading state or Excel preview.
 */
export declare function LazyExcelBody(props: ExcelBodyProps): ReactNode;
//# sourceMappingURL=LazyExcelBody.d.ts.map