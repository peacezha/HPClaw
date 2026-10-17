/**
 * Render the top divider; height is a percentage of the viewport, retained by its panel.
 * @param props - current height, resize callback, localized label, and controlled panel id.
 * @returns the pointer- and keyboard-operable horizontal divider.
 */
export declare function InspectorResizeHandle({ height, onResize, label, panelId }: {
    height: number;
    onResize: (height: number) => void;
    label: string;
    panelId: string;
}): import("react").JSX.Element;
//# sourceMappingURL=resize.d.ts.map