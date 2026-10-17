/** Metadata inventory of saved and adopted layouts without mounting their content. */
import { type ObservableSnapshot } from '@deepseek-ai/dsh-client-store';
import type { SessionId } from '@deepseek-ai/dsh-session/types';
import type { TabId, TabRecord } from '@deepseek-ai/dsh-client-ui-dockkit';
/** One open occurrence; resource recovery belongs to its kind's provider. */
export interface SidebarRightOpenTab {
    readonly sessionId: SessionId;
    readonly tabId: TabId;
    readonly kind: string;
    readonly contentId: string;
}
/** Derived membership only; layout stores remain the persisted authority. */
export declare class SidebarTabInventory {
    private readonly sessions;
    private readonly snapshot;
    /** Read-only metadata observable shared with content providers. */
    readonly source: ObservableSnapshot<readonly SidebarRightOpenTab[]>;
    /** Read saved layouts once before the root service is published. */
    constructor();
    /**
     * Replace membership from the authoritative in-window store.
     * @param sessionId - adopted Session.
     * @param tabs - current committed records.
     */
    update(sessionId: SessionId, tabs: readonly TabRecord[]): void;
    /**
     * Forget a permanently cleared scope.
     * @param sessionId - removed Session scope.
     */
    remove(sessionId: SessionId): void;
    private publish;
}
//# sourceMappingURL=tab-inventory.d.ts.map