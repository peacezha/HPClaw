/** Toolbar warning and non-modal details for the current preview’s missing fonts. */
import { type ReactNode } from 'react';
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
/** Notice inputs supplied by the document owner and Office locale registration. */
export type FontNoticeProps = PropsLocale<'sidebarOffice'> & {
    readonly fonts: readonly string[];
};
/**
 * Show a warning while fonts are unavailable for the current preview.
 * @param props - missing font families and localized copy.
 * @returns a warning button and its anchored details, or nothing when fonts are available.
 */
export declare function FontNotice({ fonts, t }: FontNoticeProps): ReactNode;
//# sourceMappingURL=FontNotice.d.ts.map