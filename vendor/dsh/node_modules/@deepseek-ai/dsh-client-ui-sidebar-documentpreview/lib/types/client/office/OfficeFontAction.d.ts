/** Font warning for the Office revision displayed by the document toolbar. */
import type { ReactNode } from 'react';
import type { PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots';
import type { OfficeStore } from './store.ts';
/** Office toolbar inputs share the body’s conversion result. */
export type OfficeFontActionProps = PropsRuntime<'sidebar.right.tab.document.action'> & PropsStore<OfficeStore> & PropsLocale<'sidebarOffice'>;
/**
 * Expose font details only for the currently loaded Office revision.
 * @param props - toolbar revision, tab reader, Office store, and localized copy.
 * @returns the font warning, or nothing before conversion completes.
 */
export declare function OfficeFontAction({ content, useTabInfo, useStore, t }: OfficeFontActionProps): ReactNode;
//# sourceMappingURL=OfficeFontAction.d.ts.map