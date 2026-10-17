import type { PaneId } from '@deepseek-ai/dsh-client-ui-dockkit';
import type { SessionId } from '@deepseek-ai/dsh-session/types';
/**
 * Focus the page selected by an open or split after its DOM has committed.
 * @param document - product document owning the input focus.
 * @param sessionId - Session whose page is opening.
 * @param open - synchronous operation returning its selected pane, or undefined when unchanged.
 */
export declare function openWithPaneFocus(document: Document, sessionId: SessionId, open: () => PaneId | undefined): void;
/**
 * Commit a focused page's removal before focusing a surviving visible pane.
 * @param document - product document owning the input focus.
 * @param sessionId - Session whose page is closing.
 * @param paneId - pane whose page is closing; preferred if it survives.
 * @param close - synchronous cleanup and layout removal; errors preserve focus.
 */
export declare function closeWithPaneFocus(document: Document, sessionId: SessionId, paneId: PaneId, close: () => void): void;
//# sourceMappingURL=close-focus.d.ts.map