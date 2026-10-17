/** Shared zoom viewport, gesture handling, anchoring, and fit-width measurement. */
import { type ReactNode, type RefCallback } from 'react';
import { type ZoomLabels, type ZoomPreference } from './types.ts';
/** @returns an actual-size scale that only shrinks content wider than the viewport. */
export declare function fitWidthZoom(viewportWidth: number, intrinsicWidth: number | undefined, horizontalInset?: number): number;
/** Shared viewport inputs for renderer-owned content and tab state. */
export interface ZoomViewportProps {
    readonly preference: ZoomPreference;
    readonly intrinsicWidth: number | undefined;
    readonly horizontalInset?: number;
    readonly labels: ZoomLabels;
    readonly signal: AbortSignal;
    readonly scrollportRef: RefCallback<HTMLElement>;
    readonly onPreference: (preference: ZoomPreference) => void;
    /** Resolved scale after a gesture settles or fit-width measurement changes. */
    readonly onRenderZoom?: (zoom: number) => void;
    readonly children: ReactNode;
}
/**
 * Keep zoom controls and trackpad gestures independent from document rendering.
 * @param props - renderer content, intrinsic width, tab preference, and localized labels.
 * @returns the owned scrollport and floating zoom controls.
 */
export declare function ZoomViewport(props: ZoomViewportProps): ReactNode;
/** Shared surface class for actual-size and fit-width layout. */
export declare const zoomSurfaceClass: string;
//# sourceMappingURL=ZoomViewport.d.ts.map