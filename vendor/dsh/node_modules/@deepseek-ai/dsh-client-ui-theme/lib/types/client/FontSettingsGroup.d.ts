import type { PropsLocale, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots';
import type { FontRole } from '../theme-settings.ts';
import type { createFontRowStore } from './settings-store.ts';
/** Injected business face: font writes by role. */
export interface FontSettingsInjected {
    /** Change one role's font list (normalized by the theme service). */
    setFontFamily: (role: FontRole, value: string) => void;
    /** Change one role's font size (integer px within its FONT_SIZE_SPECS range). */
    setFontSize: (role: FontRole, px: number) => void;
}
/** Full component props: runtime share + store share + locale seat + injected face. */
export type FontSettingsGroupProps = PropsRuntime<'settings.general.item'> & PropsStore<ReturnType<typeof createFontRowStore>> & PropsLocale<'settings.theme'> & FontSettingsInjected;
/**
 * Render the text font-size row and its expandable font settings.
 * @param props - composed slot props.
 * @returns the text size row and, when expanded, the font rows.
 */
export declare function FontSettingsGroup({ setFontFamily, setFontSize, ...shared }: FontSettingsGroupProps): import("react").JSX.Element;
//# sourceMappingURL=FontSettingsGroup.d.ts.map