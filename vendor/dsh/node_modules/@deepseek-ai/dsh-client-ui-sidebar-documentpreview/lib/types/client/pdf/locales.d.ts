/** Copy owned by the PDF renderer. */
export declare const zh: {
    title: string;
    pageImage: string;
    loading: string;
    rendering: string;
    failed: string;
    password: string;
    workerFailed: string;
    unsupported: string;
    retry: string;
    zoomControls: "缩放控件";
    zoomMenu: "选择缩放比例";
    zoomOut: "缩小";
    zoomIn: "放大";
    zoomFitWidth: "适应宽度";
    zoomValue: "{percent}%";
};
/** PDF translation keys shared by both dictionaries. */
export type PdfLocaleKey = keyof typeof zh;
/** English PDF-renderer dictionary. */
export declare const en: {
    title: string;
    pageImage: string;
    loading: string;
    rendering: string;
    failed: string;
    password: string;
    workerFailed: string;
    unsupported: string;
    retry: string;
    zoomControls: string;
    zoomMenu: string;
    zoomOut: string;
    zoomIn: string;
    zoomFitWidth: string;
    zoomValue: string;
};
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** PDF page, loading, and failure messages. */
        sidebarPdf: PdfLocaleKey;
    }
}
//# sourceMappingURL=locales.d.ts.map