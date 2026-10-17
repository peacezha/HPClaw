import type { PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots';
import { type FontRole } from '../theme-settings.ts';
import type { createFontRowStore } from './settings-store.ts';
/** Injected business face: the row's font role and its write (t rides the standard locale seat). */
export interface FontSizeRowInjected {
    /** Font role this row edits. */
    role: FontRole;
    /** Change this role's font size (integer px within its FONT_SIZE_SPECS range). */
    setFontSize: (px: number) => void;
}
/** Full component props: runtime share + store share + locale seat + injected face. */
export type FontSizeRowComponentProps = PropsRuntime<'settings.general.item'> & PropsStore<ReturnType<typeof createFontRowStore>> & PropsLocale<'settings.theme'> & FontSizeRowInjected & {
    /** Disclosure button after the unit label; the font settings group passes it for the text row. */
    expander?: FontSizeRowExpander | undefined;
};
/** Controlled disclosure state for the button that expands more font settings. */
export interface FontSizeRowExpander {
    /** Whether the controlled region is shown. */
    open: boolean;
    /** Id of the controlled region. */
    controls: string;
    /** Toggle the region. */
    onToggle: () => void;
}
/**
 * Render the font-size row.
 * @param props - composed slot props.
 * @returns the row element tree.
 */
export declare function FontSizeRow({ t, role, setFontSize, useStore, expander }: FontSizeRowComponentProps): import("react").JSX.Element;
//# sourceMappingURL=FontSizeRow.d.ts.map