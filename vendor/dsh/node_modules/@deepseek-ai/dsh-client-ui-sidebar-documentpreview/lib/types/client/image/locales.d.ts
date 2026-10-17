/** Locale-owned image renderer labels and status text. */
export declare const zh: {
    title: string;
    preview: string;
    loading: string;
    failed: string;
    unsupported: string;
    zoomControls: "缩放控件";
    zoomMenu: "选择缩放比例";
    zoomOut: "缩小";
    zoomIn: "放大";
    zoomFitWidth: "适应宽度";
    zoomValue: "{percent}%";
};
/** Image renderer dictionary keys. */
export type ImagePreviewKey = keyof typeof zh;
/** English dictionary with the same keys as the Chinese dictionary. */
export declare const en: {
    title: string;
    preview: string;
    loading: string;
    failed: string;
    unsupported: string;
    zoomControls: string;
    zoomMenu: string;
    zoomOut: string;
    zoomIn: string;
    zoomFitWidth: string;
    zoomValue: string;
};
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** Image preview selection, accessible name, and status text. */
        sidebarImage: ImagePreviewKey;
    }
}
//# sourceMappingURL=locales.d.ts.map