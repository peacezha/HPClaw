/** Localized labels for the NodeJS Inspector bottom panel and command. */
export declare const zh: {
    title: string;
    toggle: string;
    close: string;
    resize: string;
    frameTitle: string;
};
/** English labels checked against the bottom-panel dictionary. */
export declare const en: Record<keyof typeof zh, string>;
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** Shared Inspector frontend copy. */
        inspectorPanel: keyof typeof zh;
    }
}
//# sourceMappingURL=locales.d.ts.map