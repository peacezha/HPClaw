/**
 * Disable background interaction until every account overlay releases the element.
 * @param element - background element covered by an overlay.
 * @returns an idempotent release restoring the original inert state after the last owner.
 */
export declare function acquireOverlayInert(element: HTMLElement): () => void;
//# sourceMappingURL=overlay-inert.d.ts.map