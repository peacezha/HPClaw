/** One Sidebar view's Session reference, retained bodies and committed mount lifetime. */
import type { ISessions, SessionReference } from '@deepseek-ai/dsh-api-session-controller/client';
import type { SessionId } from '@deepseek-ai/dsh-session/types';
import type { TabId } from '@deepseek-ai/dsh-client-ui-dockkit';
declare module '@deepseek-ai/dsh-api-session-controller/client' {
    interface SessionReferenceSourceMap {
        sidebarView: unknown;
    }
}
/** Owns its reference until retirement finishes or the Sidebar plugin shuts down. */
export declare class SidebarSessionView {
    readonly sessionId: SessionId;
    private readonly onDispose;
    private readonly onTabRelease;
    /** Session reference released exclusively by this View. */
    readonly reference: SessionReference;
    private readonly tabs;
    private mounts;
    private retired;
    private disposed;
    /**
     * @param sessionId - Session displayed by this view.
     * @param sessions - allocator for this view's independent reference.
     * @param onDispose - removes this view from the collection's index before reference release.
     * @param onTabRelease - reconsiders retention after a body releases its hold.
     */
    constructor(sessionId: SessionId, sessions: ISessions, onDispose: (view: SidebarSessionView) => void, onTabRelease: (view: SidebarSessionView) => void);
    /** Whether an initialized retained body still needs this view. */
    get hasRetainedTabs(): boolean;
    /**
     * Keep a retired View's reference until its committed roots finish unmounting.
     * @returns cleanup to call once for this root; the final cleanup releases a retired View.
     */
    mount(): () => void;
    /**
     * Hold an initialized body until unmount or occurrence cancellation.
     * @param tabId - initialized body identity.
     * @param signal - occurrence lifetime; closing and undoing a tab creates a new lifetime.
     * @returns idempotent release of this body's hold.
     */
    readonly retainTab: (tabId: TabId, signal: AbortSignal) => (() => void);
    /** End a withdrawn view after its existing committed mounts finish. */
    retire(): void;
    /** Release once; plugin shutdown does not wait for remaining React mounts. */
    dispose(): void;
}
//# sourceMappingURL=session-view.d.ts.map