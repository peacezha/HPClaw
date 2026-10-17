/**
 * Appearance and font row slot stores: mirrors of the theme service
 * snapshot. The plugin's apply-world change listener is the only writer; the
 * row components read via props.useStore.
 */
import { type EngineStoreHandle } from '@deepseek-ai/dsh-client-store';
import { type FontFamilies, type FontSizes, type ThemePreference } from '../theme-settings.ts';
/** Store state mirrored from the theme snapshot. */
export interface AppearanceRowState {
    /** Persisted preference (selection state reads this, never the resolved active theme). */
    preference: ThemePreference;
    /** Service revision; -1 until first sync so revision 0 lands as a change. */
    revision: number;
}
/** Declared action shape giving the exported factory a stable return type. */
type AppearanceRowActions = {
    sync: (draft: AppearanceRowState, preference: ThemePreference, revision: number) => void;
};
/**
 * Declares the Appearance row state and write surface.
 * @returns the store handle.
 */
export declare function createAppearanceRowStore(): EngineStoreHandle<AppearanceRowState, AppearanceRowActions>;
/** Store state mirrored from the theme snapshot's fonts (shared by the font-size row and the font settings group). */
export interface FontRowState {
    /** Persisted font sizes in px by role. */
    fontSizes: FontSizes;
    /** Persisted normalized font lists by role. */
    fontFamilies: FontFamilies;
    /** Service revision; -1 until first sync so revision 0 lands as a change. */
    revision: number;
}
/** Declared action shape giving the exported factory a stable return type. */
type FontRowActions = {
    sync: (draft: FontRowState, fontSizes: FontSizes, fontFamilies: FontFamilies, revision: number) => void;
};
/**
 * Declares the font rows' state and write surface.
 * @returns the store handle.
 */
export declare function createFontRowStore(): EngineStoreHandle<FontRowState, FontRowActions>;
export {};
//# sourceMappingURL=settings-store.d.ts.map