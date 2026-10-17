/** Clipping geometry for the Inspector's element-picker overlay outside the Chat subtree. */
/**
 * Intersect a Chat box with its scrollports and the transcript area above the composer.
 * @param element - Existing Chat Node, call, or Group box.
 * @returns The visible rectangle, or undefined when the target is outside the conversation viewport.
 */
export declare function visibleChatRect(element: HTMLElement): {
    readonly left: number;
    readonly top: number;
    readonly width: number;
    readonly height: number;
} | undefined;
/**
 * Place an Inspector overlay without changing the Chat content box.
 * @param overlay - Inspector-owned fixed-position element.
 * @param element - Existing Chat Node, call, or Group box.
 * @returns Whether any part of the target remains visible after clipping.
 */
export declare function placeChatHighlight(overlay: HTMLElement, element: HTMLElement): boolean;
//# sourceMappingURL=highlight.d.ts.map