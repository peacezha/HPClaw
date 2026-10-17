/**
 * Theme bootstrap row for the browser's pre-plugin interval. Each index
 * render embeds the current durable built-in preference, font sizes, and
 * font-family lists. Head CSS colors the document canvas before script
 * execution; the body script installs the palette selector and font variables
 * that the client presenters adopt.
 */
import type { IndexInjection } from '@deepseek-ai/dsh-host-webserver';
import { type FontFamilies, type FontSizes, type ThemePreference } from './theme-settings.ts';
/**
 * Theme bootstrap rows: head CSS colors the document canvas before
 * first paint, then the body script installs the palette selector and font
 * size and font families before the shell mount and module script.
 * @param preference - Current Host-backed built-in preference.
 * @param fontSizes - Current Host-backed font sizes in px by role.
 * @param fontFamilies - Current Host-backed font lists; each is normalized before embedding.
 * @returns head and body script rows in execution order.
 */
export declare function bootThemeInjections(preference?: ThemePreference, fontSizes?: FontSizes, fontFamilies?: FontFamilies): IndexInjection[];
//# sourceMappingURL=boot-theme.d.ts.map