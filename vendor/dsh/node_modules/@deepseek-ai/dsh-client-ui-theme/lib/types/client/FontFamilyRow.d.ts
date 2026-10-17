import type { PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots';
import { type FontRole } from '../theme-settings.ts';
import type { createFontRowStore } from './settings-store.ts';
/** Injected business face: the row's font role and its write. */
export interface FontFamilyRowInjected {
    /** Font role this row edits. */
    role: FontRole;
    /** Change this role's font list (normalized by the theme service). */
    setFontFamily: (value: string) => void;
}
/** Full component props: runtime share + store share + locale seat + injected face. */
export type FontFamilyRowComponentProps = PropsRuntime<'settings.general.item'> & PropsStore<ReturnType<typeof createFontRowStore>> & PropsLocale<'settings.theme'> & FontFamilyRowInjected;
/**
 * Render one font-family row.
 * @param props - composed slot props.
 * @returns the row element tree.
 */
export declare function FontFamilyRow({ t, role, setFontFamily, useStore }: FontFamilyRowComponentProps): import("react").JSX.Element;
//# sourceMappingURL=FontFamilyRow.d.ts.map