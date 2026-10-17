import type { ReactNode } from 'react';
import type { InjectFace, PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots';
import type { BrowserInjected } from '../browser/BrowserController.ts';
import type { BrowserStore } from '../browser/store.ts';
/** Browser body props assembled by the tab seat. */
export type BrowserBodyProps = PropsRuntime<'sidebar.right.pane.tab'> & PropsStore<BrowserStore> & PropsLocale<'sidebarBrowser'> & InjectFace<BrowserInjected>;
/** Render provider-neutral navigation state and optional controls. */
export declare function BrowserBody(props: BrowserBodyProps): ReactNode;
//# sourceMappingURL=BrowserBody.d.ts.map