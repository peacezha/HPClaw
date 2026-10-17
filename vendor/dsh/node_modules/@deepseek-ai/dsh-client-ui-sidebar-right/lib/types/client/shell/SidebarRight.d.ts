import type { ReactNode } from 'react';
import type { ShortcutCatalogEntry } from '@deepseek-ai/dsh-client-shortcuts/client';
import type { HostObservable, InjectFace, PropsLocale, PropsRenderSlots, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots';
import type { DockIntents, TabId, TabRecord } from '@deepseek-ai/dsh-client-ui-dockkit';
import type { HalvesFit, PaneId } from '@deepseek-ai/dsh-client-ui-dockkit';
import type { SessionId } from '@deepseek-ai/dsh-session/types';
import type { SidebarRightOpenTabOptions } from '../service.ts';
import type { SidebarRightTabDefinition } from '../tab-registry.ts';
import type { createSidebarRightStore, SurfaceState } from '../stores.ts';
import type { TabOccurrence } from '../tab-domain.ts';
import type { SidebarRightTabNavigation } from '../contract/slots.ts';
/** The store share the seat receives. */
type Store = PropsStore<ReturnType<typeof createSidebarRightStore>>;
/** The child seats this component renders. */
type Children = PropsRenderSlots<'sidebar.right.pane.tab' | 'sidebar.right.pane.tab.title' | 'sidebar.right.tab.menu.item'>;
/** What the panel reports to the frame: drawn or not, and whether it wants a track. */
export interface SidebarRightPresentation {
    /** Whether the panel is drawn at all. */
    readonly shown: boolean;
    /** Whether the drawn panel wants the conversation to make room for it. */
    readonly track: boolean;
    /** Whether the panel fills the viewport, independently of its retained track. */
    readonly fullscreen: boolean;
}
/** What this package needs from its host beyond the framework shares. */
export interface SidebarRightInjected {
    /**
     * Report the panel's presentation to the frame.
     *
     * The frame sizes the track and places the resize handle; this only tells it
     * the composition of the facts this package owns, and is called whenever that
     * composition changes.
     */
    readonly syncPresentation: (presentation: SidebarRightPresentation) => void;
    /**
     * Record this seat's room rule for `ctx.sidebarRight`'s splits, replacing its previous one.
     *
     * The docking kit measures its panes after it renders; the seat forwards each
     * reading, and the service applies it when it splits this seat's Session.
     * @param canSplitPane - whether two working halves of a docked pane would fit; unmeasured panes fit.
     */
    readonly measureRoom: (canSplitPane: (paneId: PaneId) => boolean) => void;
    /**
     * Record whether the frame width this seat renders at presents an expanded panel fullscreen automatically.
     *
     * The fullscreen command reads the latest report: while it holds, the command
     * closes the panel instead of switching its recorded mode.
     * @param autoFullscreen - whether the frame is narrower than the automatic fullscreen width.
     */
    readonly reportAutoFullscreen: (autoFullscreen: boolean) => void;
    /**
     * The navigation face's `openTab`, for the strip's add control: a new tab is
     * the guide opened by kind, through the same path as every other open.
     */
    readonly openTab: (kind: string, options?: SidebarRightOpenTabOptions) => void;
    /** Close through the resource owner's cleanup handler. */
    readonly closeTab: (tabId: TabId) => void;
    /** Split through the same controller as keyboard commands. */
    readonly splitPane: (paneId: PaneId) => void;
    /** Toggle the dock panel using its current display mode. */
    readonly toggleFullscreen: () => void;
    readonly hooks: {
        readonly shortcuts: HostObservable<readonly ShortcutCatalogEntry[]>;
        readonly tabTypes: HostObservable<readonly SidebarRightTabDefinition[]>;
    };
    readonly keyedHooks: {
        readonly tabNavigation: (key: string) => HostObservable<SidebarRightTabNavigation>;
    };
    /** Read a committed record's lifetime; never creates an occurrence. */
    readonly occurrence: (tab: Pick<TabRecord, 'id'>) => TabOccurrence;
}
/** The column seat's props: session scope, so the session arrives as a standard prop. */
export type RightbarSeatProps = PropsRuntime<'rightbar.session'> & Children & Store & PropsLocale<'sidebarRight'> & InjectFace<SidebarRightInjected>;
/** Everything the panel needs, already bound to one session. */
interface PanelProps {
    readonly sessionId: SessionId;
    readonly surface: SurfaceState;
    readonly actions: Store['actions'];
    readonly t: RightbarSeatProps['t'];
    readonly renderSlot: Children['renderSlot'];
    readonly openTab: SidebarRightInjected['openTab'];
    readonly closeTab: SidebarRightInjected['closeTab'];
    readonly splitPane: SidebarRightInjected['splitPane'];
    readonly toggleFullscreen: SidebarRightInjected['toggleFullscreen'];
    readonly shortcuts: readonly ShortcutCatalogEntry[];
    readonly useTabTypes: RightbarSeatProps['useTabTypes'];
    readonly useTabNavigation: RightbarSeatProps['useTabNavigation'];
    readonly useStore: Store['useStore'];
    readonly occurrence: SidebarRightInjected['occurrence'];
    readonly fullscreen: boolean;
    readonly autoFullscreen: boolean;
    readonly active: boolean;
    readonly retainTab: RightbarSeatProps['retainTab'];
    /** Receives the kit's room-rule readings for the service's `split`. */
    readonly reportRoom: (fits: ReadonlyMap<PaneId, HalvesFit>) => void;
}
/**
 * Build the kit's intent face for one session out of the store's actions.
 * @param sessionId - the session the seat draws; every action is bound to it.
 * @param actions - the seat's bound store actions.
 * @param openTab - the navigation face's `openTab`, which the strip's add control asks for a guide through.
 * @returns the intents the kit reports gestures to.
 */
export declare function intentsFor(sessionId: SessionId, actions: Store['actions'], openTab: PanelProps['openTab'], closeTab?: PanelProps['closeTab'], splitPane?: PanelProps['splitPane']): DockIntents;
/**
 * The right column's occupant: stable tab containers, docked or floating.
 * It is also where the frame learns the panel's presentation, because this is
 * the seat that knows it. `ctx.sidebarRight` names the on-screen Session
 * itself; this seat reports only what it renders with: the room its kit
 * measured and the automatic fullscreen rule of its frame width.
 */
export declare function RightbarSeat({ sessionId, width, viewportWidth, canShow, useStore, actions, t, renderSlot, syncPresentation, measureRoom, reportAutoFullscreen, openTab, closeTab, useTabTypes, useTabNavigation, occurrence, retainTab, active, useShortcuts, splitPane, toggleFullscreen, }: RightbarSeatProps): ReactNode;
export {};
//# sourceMappingURL=SidebarRight.d.ts.map