/** Carrier-independent tab commands and renderer-facing state. */
import { type BoundActions } from '@deepseek-ai/dsh-client-store';
import type { TabId } from '@deepseek-ai/dsh-client-ui-dockkit';
import type { HostObservable } from '@deepseek-ai/dsh-client-ui-slots';
import type { BrowserFrameState } from './BrowserFrame.ts';
import type { BrowserPageFactory } from './BrowserPage.ts';
import { type BrowserTabState } from './BrowserPersistence.ts';
import type { BrowserStore } from './store.ts';
import { type BrowserAddressFailure, type BrowserTarget } from './url.ts';
/** Live tab state; navigation comes from its provider and draft validation stays local. */
export interface BrowserControllerState {
    readonly frame: BrowserFrameState;
    /** Saved address offered for explicit restoration before any page has been requested. */
    readonly restoreTarget: BrowserTarget | undefined;
    readonly addressFailure: BrowserAddressFailure | undefined;
    readonly addressRevision: number;
}
/** Construction inputs for one tab occurrence. */
export interface BrowserControllerOptions {
    readonly tabId: TabId;
    readonly signal: AbortSignal;
    readonly applicationOrigin: string;
    readonly initial: BrowserTabState | undefined;
    readonly actions: BoundActions<BrowserStore>;
    readonly createPage: BrowserPageFactory;
    readonly openTab: (url: string) => void;
}
/** Owns input validation and page lifetime without inspecting the carrier type. */
export declare class BrowserController implements HostObservable<BrowserControllerState> {
    private readonly options;
    private readonly page;
    private readonly store;
    private readonly unsubscribe;
    private actions;
    private checkpoint;
    private started;
    private disposed;
    private disposal;
    private readonly abort;
    /** @param options - identity, persistence, page factory and source-tab navigation. */
    constructor(options: BrowserControllerOptions);
    /** @returns immutable state for the common toolbar. */
    getSnapshot: () => BrowserControllerState;
    /** @param listener - state invalidation. @returns unsubscribe callback. */
    subscribe: (listener: () => void) => (() => void);
    /**
     * Attach the page without transferring ownership of its tab occurrence.
     * @param viewportId - mounted content container.
     * @returns physical attachment cleanup only.
     */
    mount(viewportId: string): () => void;
    /**
     * Consume initial navigation once; a saved checkpoint alone never starts a page.
     * @param initialUrl - explicit typed-open address, or absence.
     */
    start(initialUrl: string | undefined): void;
    /** Load the saved address only after an explicit restore action. */
    restore(): void;
    /**
     * Validate an address before navigation, publishing invalid input for correction.
     * @param value - address-bar or typed-open input.
     */
    loadUrl(value: string): void;
    /** Delegate Back to the page's navigation provider. */
    goBack(): void;
    /** Delegate Forward to the page's navigation provider. */
    goForward(): void;
    /** Restore a saved address, or reload the already requested page. */
    reload(): void;
    /**
     * Apply the optional embedding-sandbox control; unsupported providers remain unchanged.
     * @param enabled - whether to enforce the provider's embedding sandbox.
     */
    setSandbox(enabled: boolean): void;
    /**
     * Redirect future checkpoint writes to a replacement Session binding.
     * @param actions - replacement persistence writer.
     */
    rebind(actions: BoundActions<BrowserStore>): void;
    /**
     * Release the page and detach occurrence and state listeners.
     * @returns after page teardown; repeated callers join the same disposal.
     */
    dispose(): Promise<void>;
    private publishSaved;
    private addressFailed;
    private command;
}
/** Values available once a Sidebar body has committed its content container. */
export interface BrowserMountRequest {
    readonly tabId: TabId;
    readonly signal: AbortSignal;
    readonly viewportId: string;
    readonly applicationOrigin: string;
    readonly initial: BrowserTabState | undefined;
    readonly initialUrl: string | undefined;
    readonly openTab: (url: string) => void;
}
/** Plain Slot callbacks and a framework-bound state source, not a desktop protocol. */
export interface BrowserInjected {
    readonly keyedHooks: {
        readonly browserState: (key: string) => HostObservable<BrowserControllerState> | undefined;
    };
    /** @param request - committed tab and container. @returns ends physical attachment without closing the tab. */
    mount(request: BrowserMountRequest): () => void;
    /** @returns after every page has been disposed. */
    dispose(): Promise<void>;
    /** @param actions - writer from a recreated Session binding. */
    rebind(actions: BoundActions<BrowserStore>): void;
    /** @param tabId - owning tab. @param value - address input. */
    loadUrl(tabId: TabId, value: string): void;
    /** @param tabId - tab whose saved address the user requested to restore. */
    restore(tabId: TabId): void;
    /** @param tabId - owning tab. */
    goBack(tabId: TabId): void;
    /** @param tabId - owning tab. */
    goForward(tabId: TabId): void;
    /** Restore a saved address or reload its page. @param tabId - owning tab. */
    reload(tabId: TabId): void;
    /** @param tabId - owning tab. @param enabled - provider's optional sandbox control. */
    setSandbox(tabId: TabId, enabled: boolean): void;
}
/**
 * Own tab-occurrence controllers behind Session-scoped callbacks.
 * @param actions - persisted view-state writer.
 * @param createPage - composition-selected provider.
 * @param isTabOpen - authoritative layout membership, independent of mounted bodies and plugin lifetime.
 * @returns tab callbacks.
 */
export declare function createBrowserControllers(actions: BoundActions<BrowserStore>, createPage: BrowserPageFactory, isTabOpen: (tabId: TabId) => boolean): BrowserInjected;
//# sourceMappingURL=BrowserController.d.ts.map