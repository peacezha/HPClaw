import type { ShortcutCatalogEntry } from '@deepseek-ai/dsh-client-shortcuts/client';
import type { ReactNode } from 'react';
import type { ObservableSnapshot } from '@deepseek-ai/dsh-client-store';
import type { InjectFace, PropsRenderSlots, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { SidebarRightGuideBox } from '../../tab-registry.ts';
/** What the guide body needs from its host beyond the framework shares. */
export interface GuideInjected {
    /** The registry's guide entries in `order`; observable, so a type registering later appears. */
    readonly hooks: {
        readonly shortcuts: ObservableSnapshot<readonly ShortcutCatalogEntry[]>;
        readonly guideEntries: ObservableSnapshot<readonly SidebarRightGuideBox[]>;
    };
}
/** The guide body's composed props: the tab it draws, its chain child, and the entries. */
export type GuideBodyProps = PropsRuntime<'sidebar.right.pane.tab'> & PropsRenderSlots<'sidebar.right.tab.guide' | 'sidebar.right.tab.guide.entry'> & InjectFace<GuideInjected>;
/** The guide tab's body, replaceable through its chain child. */
export declare function GuideBody({ useTabInfo, useGuideEntries, renderSlot, renderSlotChain, useShortcuts }: GuideBodyProps): ReactNode;
//# sourceMappingURL=GuideBody.d.ts.map