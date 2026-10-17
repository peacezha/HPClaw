/** Selection and retention policy for independently owned Sidebar Session views. */
import type { ISessions, SessionReference } from '@deepseek-ai/dsh-api-session-controller/client';
import type { SessionId } from '@deepseek-ai/dsh-session/types';
import { SidebarSessionView } from './session-view.ts';
/** The reference is exclusively a framework SessionProvider target, not a business-component service. */
export interface SidebarSessionViewSnapshot {
    readonly sessionId: SessionId;
    readonly reference: SessionReference;
    readonly selected: boolean;
    /** Stable for this View's lifetime, independently of Session injection bindings. */
    readonly retainTab: SidebarSessionView['retainTab'];
}
/** Selects and retires views; the Sidebar plugin's injected dependencies own global teardown. */
export declare class SidebarSessionViews {
    private readonly sessions;
    /** Selected and retained View targets observed by the root renderer. */
    readonly source: import("@deepseek-ai/dsh-client-store").SnapshotStore<readonly SidebarSessionViewSnapshot[]>;
    private readonly views;
    private readonly viewsByReference;
    private selected;
    private closed;
    constructor(sessions: ISessions);
    /**
     * Change the foreground Session while preserving retained background Views.
     * @param sessionId - main selection, or absence.
     */
    select(sessionId: SessionId | undefined): void;
    /**
     * Bind a committed root; release retired references after that root unmounts.
     * @param reference - framework target published by this owner.
     * @returns releases this committed mount.
     */
    mount(reference: SessionReference): () => void;
    /** Plugin shutdown releases every view, including any awaiting a React unmount. */
    dispose(): void;
    private prune;
    private publish;
}
//# sourceMappingURL=session-views.d.ts.map