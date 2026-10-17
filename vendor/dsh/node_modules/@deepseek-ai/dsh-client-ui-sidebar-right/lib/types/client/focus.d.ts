/** Live DOM ownership for docked and floating sidebar pages. */
import type { LayoutState, PaneId, TabId } from '@deepseek-ai/dsh-client-ui-dockkit';
import type { SessionId } from '@deepseek-ai/dsh-session/types';
import type { TabOccurrence } from './tab-domain.ts';
/** A page captured from the currently mounted Session and its current occurrence. */
export interface SidebarRightTarget {
    readonly sessionId: SessionId;
    readonly paneId: PaneId;
    readonly host: 'dock' | 'float';
    readonly tabId: TabId | undefined;
    readonly occurrence: TabOccurrence | undefined;
    readonly navigationRevision: number | undefined;
}
/**
 * Read pane and tab identity from live owner markup, including an embedding iframe.
 * @param element - focused or pointer-activated element in the product document.
 * @param sessionId - Session currently drawn by the sidebar.
 * @param layout - current committed layout for that Session.
 * @param occurrence - current occurrence lookup for a committed tab.
 * @returns the captured page, or undefined for stale, hidden, or outside elements.
 */
export declare function sidebarTargetFromElement(element: Element | null, sessionId: SessionId, layout: LayoutState, occurrence: (tabId: TabId) => TabOccurrence): SidebarRightTarget | undefined;
/**
 * Find a visible pane of one Session, preferring the requested pane over the active fallback.
 * @param document - product document containing docked and floating panes.
 * @param sessionId - Session whose panes may receive focus.
 * @param paneId - preferred pane before an operation changed the layout.
 * @returns a surviving visible pane, or undefined when the Session has none.
 */
export declare function visibleSidebarPane(document: Document, sessionId: SessionId, paneId: PaneId): HTMLElement | undefined;
/**
 * Observe pane focus and retain it when its DOM node is replaced, preserving text selections.
 * @param document - product document whose sidebar owns the listener lifetime.
 * @returns disposer for every document/window listener.
 */
export declare function observeSidebarFocus(document: Document): () => void;
//# sourceMappingURL=focus.d.ts.map