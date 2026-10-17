/** Persisted Browser tab snapshots shared by the body and title slots. */
import { type EngineStoreHandle } from '@deepseek-ai/dsh-client-store';
import type { TabId } from '@deepseek-ai/dsh-client-ui-dockkit';
import type { BrowserTabState } from './BrowserPersistence.ts';
/** All Browser tabs in one Session-scoped store. */
export interface BrowserState {
    byTab: Record<TabId, BrowserTabState>;
}
type BrowserActions = {
    replace: (draft: BrowserState, tabId: TabId, state: BrowserTabState) => void;
    forget: (draft: BrowserState, tabId: TabId) => void;
};
/**
 * Declare the Session-scoped Browser persistence store.
 * @returns a fresh store handle for Slot registration.
 */
export declare function createBrowserStore(): EngineStoreHandle<BrowserState, BrowserActions>;
/** Browser store handle shared by body and title registrations. */
export type BrowserStore = ReturnType<typeof createBrowserStore>;
export {};
//# sourceMappingURL=store.d.ts.map