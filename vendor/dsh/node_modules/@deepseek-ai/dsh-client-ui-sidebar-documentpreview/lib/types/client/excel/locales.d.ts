/** Locale-owned Excel preview controls and parser feedback. */
export declare const zh: {
    title: string;
    language: string;
    loading: string;
    invalid: string;
    tooLarge: string;
    timeout: string;
    encoding: string;
    formulaWarning: string;
    unsupportedNotice: string;
    charts: string;
    images: string;
    shapes: string;
    conditionalFormatting: string;
    featureSeparator: string;
    retry: string;
};
/** Excel preview dictionary keys. */
export type ExcelPreviewKey = keyof typeof zh;
/** English Excel preview copy. */
export declare const en: {
    title: string;
    language: string;
    loading: string;
    invalid: string;
    tooLarge: string;
    timeout: string;
    encoding: string;
    formulaWarning: string;
    unsupportedNotice: string;
    charts: string;
    images: string;
    shapes: string;
    conditionalFormatting: string;
    featureSeparator: string;
    retry: string;
};
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** Excel preview status and third-party locale selection. */
        sidebarExcel: ExcelPreviewKey;
    }
}
//# sourceMappingURL=locales.d.ts.map