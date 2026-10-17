/** Electron tag DOM inside a Sidebar-owned, stable content container. */
import type { DesktopBrowserReservation } from '../../types.ts';
import type { BrowserPresentation } from '../view/BrowserPresentation.ts';
/** The Electron tag API used by its navigation provider. */
export interface WebviewElement extends HTMLElement {
    loadURL(url: string): Promise<void>;
    getURL(): string;
    getTitle(): string;
    canGoBack(): boolean;
    canGoForward(): boolean;
    clearHistory(): void;
    goBack(): void;
    goForward(): void;
    reload(): void;
    isLoading(): boolean;
}
/** Physical attachment notifications; hiding a retained Sidebar body emits neither. */
export interface ElectronPresentationEvents {
    readonly mounted: () => void;
    readonly unmounted: () => void;
}
/** Owns tag creation and attachment, without measuring or following another element. */
export declare class ElectronWebviewPresentation implements BrowserPresentation {
    private readonly events;
    private element;
    private host;
    constructor(events: ElectronPresentationEvents);
    /** @param viewportId - committed content container. @returns ends attachment and releases its guest. */
    mount(viewportId: string): () => void;
    /**
     * Configure a detached webview for an approved guest reservation.
     * @param reservation - main-approved partition and bootstrap lease.
     * @returns a detached, configured webview.
     */
    createElement(reservation: DesktopBrowserReservation): WebviewElement;
    /**
     * Attach a prepared guest, removing any previous guest DOM from the container.
     * @param element - configured guest with its navigation listeners already installed.
     * @throws when no content container is mounted.
     */
    present(element: WebviewElement): void;
    /**
     * Set the guest element's accessible label.
     * @param title - observed document title.
     */
    show(title: string): void;
    /** Destroy only the guest DOM; a replacement may use the same mounted container. */
    clear(): void;
    /** Destroy the guest DOM and release its content container. */
    dispose(): void;
}
//# sourceMappingURL=ElectronWebviewPresentation.d.ts.map