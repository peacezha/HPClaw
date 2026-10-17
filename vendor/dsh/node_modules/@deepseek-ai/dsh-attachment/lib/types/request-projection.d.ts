/**
 * Pure request-projection geometry shared by model routes and provider-side
 * request pricing. @module @deepseek-ai/dsh-attachment/request-projection
 */
/** Integer width and height of one projected image. */
export interface ProjectedDimensions {
    width: number;
    height: number;
}
/**
 * Compute aspect-preserving integer dimensions within a hard total-pixel budget.
 * @param width - positive source width.
 * @param height - positive source height.
 * @param maxPixels - positive width-times-height cap.
 * @returns inward-rounded dimensions; small images are not enlarged.
 */
export declare function requestImageDimensions(width: number, height: number, maxPixels: number): ProjectedDimensions;
/**
 * Compute aspect-preserving integer dimensions with an exact long edge; the
 * short edge rounds to the nearest pixel, as an encoder resize by the
 * long edge alone.
 * @param width - positive source width.
 * @param height - positive source height.
 * @param longEdge - positive target for the longer source edge.
 * @returns the target dimensions; a long edge at or above the source returns the source unchanged.
 */
export declare function longEdgeDimensions(width: number, height: number, longEdge: number): ProjectedDimensions;
//# sourceMappingURL=request-projection.d.ts.map