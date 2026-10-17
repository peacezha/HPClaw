/** Locale-independent spreadsheet parser failure categories. */
export declare class ExcelPreviewError extends Error {
    readonly code: 'invalid' | 'tooLarge' | 'timeout' | 'encoding';
    /** @param code - User-actionable parser failure. */
    constructor(code: 'invalid' | 'tooLarge' | 'timeout' | 'encoding', options?: ErrorOptions);
}
//# sourceMappingURL=error.d.ts.map