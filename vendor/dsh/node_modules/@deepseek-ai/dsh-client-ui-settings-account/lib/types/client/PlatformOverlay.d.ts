import type { PlatformPage } from './platform-pages.ts';
/** Non-secret commands supplied by the desktop application preload. */
export interface PlatformBridge {
    /** @param page - supported Platform destination. @param bounds - viewport rectangle. @returns after document load. */
    open(this: void, page: PlatformPage, bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    }): Promise<void>;
    /** @param bounds - viewport rectangle. @returns after native bounds update. */
    setBounds(this: void, bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    }): Promise<void>;
    /** @returns after the native document is destroyed. */
    close(this: void): Promise<void>;
}
/** @param props - native commands, localized copy, and return action. @returns full-window Platform container. */
export declare function PlatformOverlay({ bridge, page, backLabel, loadingLabel, failureLabel, retryLabel, onClose }: {
    bridge: PlatformBridge;
    page: PlatformPage;
    backLabel: string;
    loadingLabel: string;
    failureLabel: string;
    retryLabel: string;
    onClose: () => void;
}): import("react").ReactPortal;
//# sourceMappingURL=PlatformOverlay.d.ts.map