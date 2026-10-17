/** Supplied shortcut-control and feedback artwork, colored by the owning UI. */
declare const artwork: {
    edit: import("react").JSX.Element;
    error: import("react").JSX.Element;
    success: import("react").JSX.Element;
};
/**
 * Render the shortcut design artwork at its supplied size.
 * @param props - glyph kind and semantic color class.
 * @returns an ornamental SVG hidden from assistive technology.
 */
export declare function ShortcutIcon({ kind, className }: {
    kind: keyof typeof artwork;
    className?: string | undefined;
}): import("react").JSX.Element;
export {};
//# sourceMappingURL=Icons.d.ts.map