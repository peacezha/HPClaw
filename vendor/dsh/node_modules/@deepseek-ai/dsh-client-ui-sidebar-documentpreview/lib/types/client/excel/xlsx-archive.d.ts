/** Owns the unpacked preview copy and its detected unsupported content. */
export declare class XlsxPreviewArchive {
    private readonly bytes;
    /** Detected workbook content that the preview does not display. */
    readonly unsupportedFeatures: Set<"charts" | "images" | "shapes" | "conditionalFormatting">;
    private readonly files;
    private readonly parts;
    /**
     * Read an archive without modifying the borrowed source buffer.
     * @param bytes - Complete XLSX source bytes.
     * @throws When ZIP entries have ASCII case-equivalent names.
     */
    constructor(bytes: Uint8Array<ArrayBuffer>);
    /**
     * Omit DrawingML parts before ExcelJS parses them; callers must also ignore worksheet drawing references.
     * @returns Source bytes when no parts were omitted, otherwise an uncompressed temporary ZIP.
     */
    withoutDrawings(): Uint8Array<ArrayBuffer>;
    private inspectContent;
}
//# sourceMappingURL=xlsx-archive.d.ts.map