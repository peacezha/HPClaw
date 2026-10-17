import type { DesktopBrowserBridge } from '../../types.ts';
import type { ElectronWebviewPresentation } from './ElectronWebviewPresentation.ts';
import { type BrowserFrame, type BrowserFrameState } from '../browser/BrowserFrame.ts';
import type { BrowserPageOptions } from '../browser/BrowserPage.ts';
import { type BrowserTarget } from '../browser/url.ts';
/** Owns native history and translates Electron observations into common frame state. */
export declare class ElectronWebViewImpl implements BrowserFrame {
    private readonly options;
    private readonly bridge;
    private readonly workspace;
    private readonly presentation;
    private readonly store;
    private readonly lifetime;
    private guestLifetime;
    private element;
    private lease;
    private workspaceKey;
    private initializing;
    private ready;
    private pending;
    private revision;
    private firstDocument;
    private checkpoint;
    private disposal;
    private attachment;
    private readonly releases;
    /**
     * @param options - saved address, persistence and source-tab opening callback.
     * @param bridge - main-process guest operations.
     * @param workspace - resolves the storage account once for this frame lifetime.
     * @param presentation - tag and Sidebar placement adapter.
     */
    constructor(options: BrowserPageOptions, bridge: DesktopBrowserBridge, workspace: (signal: AbortSignal) => Promise<string>, presentation: ElectronWebviewPresentation);
    /** @returns immutable carrier-neutral navigation state. */
    getSnapshot: () => BrowserFrameState;
    /** @param listener - state invalidation. @returns unsubscribe callback. */
    subscribe: (listener: () => void) => (() => void);
    /** A physical mount may recreate a lost guest; ordinary Sidebar hiding never calls this. */
    attach(): void;
    /** Invalidate pending attachment before the containing DOM is removed. */
    detach(): void;
    /** @param target - validated address, loaded without replacing the guest. */
    loadUrl(target: BrowserTarget): void;
    /** Move backward through Chromium history. */
    goBack(): void;
    /** Move forward through Chromium history. */
    goForward(): void;
    /** Reload the actual current page, or retry failed guest creation. */
    reload(): void;
    /** @returns after pending initialization and the owned guest have been released. */
    dispose(): Promise<void>;
    private navigate;
    private initialize;
    private createGuest;
    private loadPending;
    private observe;
    private observeReady;
    private persist;
    private failed;
    private commandFailed;
    private dropGuest;
    private release;
}
//# sourceMappingURL=ElectronWebViewImpl.d.ts.map