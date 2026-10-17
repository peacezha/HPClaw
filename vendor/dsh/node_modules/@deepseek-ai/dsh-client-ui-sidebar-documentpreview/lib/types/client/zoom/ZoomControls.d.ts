import { type ZoomLabels } from './types.ts';
/** Live percentage display updated independently from the document tree. */
export interface ZoomControlsHandle {
    /** @param zoom - current gesture scale multiplier. */
    showZoom: (zoom: number) => void;
}
/**
 * Present fit-width, fixed presets, and incremental controls.
 * @param props - current resolved zoom, preference mode, labels, and callbacks.
 * @returns a localized zoom toolbar.
 */
export declare const ZoomControls: import("react").ForwardRefExoticComponent<{
    readonly zoom: number;
    readonly fitWidth: boolean;
    readonly labels: ZoomLabels;
    readonly visible: boolean;
    readonly onZoom: (zoom: number) => void;
    readonly onFitWidth: () => void;
    readonly onActiveChange: (active: boolean) => void;
} & import("react").RefAttributes<ZoomControlsHandle>>;
//# sourceMappingURL=ZoomControls.d.ts.map