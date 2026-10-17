import type { IframePresentation } from '../view/IframePresentation.ts';
import { type BrowserFrame, type BrowserFrameState, type BrowserSandboxControl } from './BrowserFrame.ts';
import type { BrowserPageOptions } from './BrowserPage.ts';
import type { BrowserTarget } from './url.ts';
/** Owns iframe navigation; the view reports loads without reading cross-origin content. */
export declare class IframeImpl implements BrowserFrame {
    private readonly options;
    private readonly presentation;
    readonly sandbox: BrowserSandboxControl;
    private readonly navigation;
    private readonly store;
    private sandboxed;
    private error;
    private disposed;
    private disposal;
    /** @param options - initial checkpoint and persistence writer. @param presentation - iframe DOM adapter. */
    constructor(options: BrowserPageOptions, presentation: IframePresentation);
    /**
     * Record a controlled load or a later navigation to an unreadable address.
     * @param revision - document generation whose iframe emitted load.
     */
    handleLoaded(revision: number): void;
    /**
     * Publish a failure only for the current document generation.
     * @param revision - document generation whose iframe reported failure.
     */
    handleLoadFailed(revision: number): void;
    /** @returns immutable navigation state. */
    getSnapshot: () => BrowserFrameState;
    /** @param listener - state invalidation. @returns unsubscribe callback. */
    subscribe: (listener: () => void) => (() => void);
    /** @param target - validated address; submitting the current address reloads it. */
    loadUrl(target: BrowserTarget): void;
    /** Move through application-known history while the iframe address remains known. */
    goBack(): void;
    /** Move through application-known history while the iframe address remains known. */
    goForward(): void;
    /** Reload the last application-known address. */
    reload(): void;
    /** @returns after the presentation has been removed; repeated calls join disposal. */
    dispose(): Promise<void>;
    private setSandbox;
    private load;
    private snapshot;
    private publish;
}
//# sourceMappingURL=IframeImpl.d.ts.map