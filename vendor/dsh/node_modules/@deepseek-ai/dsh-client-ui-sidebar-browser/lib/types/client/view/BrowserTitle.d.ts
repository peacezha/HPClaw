/** Live Browser tab title from the Browser store. */
import type { ReactNode } from 'react';
import type { PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots';
import type { BrowserStore } from '../browser/store.ts';
/** Browser title props assembled by the Sidebar title seat. */
export type BrowserTitleProps = PropsRuntime<'sidebar.right.pane.tab.title'> & PropsStore<BrowserStore>;
/** Browser icon and current host name. */
export declare function BrowserTitle({ useTabInfo, useStore }: BrowserTitleProps): ReactNode;
//# sourceMappingURL=BrowserTitle.d.ts.map