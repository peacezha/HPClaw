/** Theme preferences stored in the Host user-settings document. */
import z from '@deepseek-ai/schemastery';
/** Built-in preferences accepted at the registry and settings boundaries. */
export declare const THEME_PREFERENCES: readonly ["light", "dark", "system"];
/** Settings namespace owned by the theme plugin. */
export declare const THEME_SETTINGS_NAMESPACE = "ui-theme";
/** Field carrying the selected built-in theme preference. */
export declare const THEME_PREFERENCE_FIELD = "preference";
/** Field carrying the conversation content font size. */
export declare const FONT_SIZE_FIELD = "fontSize";
/** Theme preference persisted by the product Appearance row. */
export type ThemePreference = typeof THEME_PREFERENCES[number];
/** Default preference when the user-settings document has no override. */
export declare const DEFAULT_PREFERENCE: ThemePreference;
/** Smallest accepted content font size (px). */
export declare const FONT_SIZE_MIN = 10;
/** Largest accepted content font size (px). */
export declare const FONT_SIZE_MAX = 22;
/** Content font size when the user-settings document has no override (px). */
export declare const DEFAULT_FONT_SIZE = 14;
/** Independently configurable font roles. */
export declare const FONT_ROLES: readonly ["text", "code", "terminal"];
/** One configurable font role: interface text, code, or the sidebar terminal. */
export type FontRole = typeof FONT_ROLES[number];
/** Settings field, body variable, and accepted integer px range of one role's font size. */
export interface FontSizeSpec {
    /** Settings field carrying the size. */
    field: string;
    /** Body variable carrying the size in px. */
    variable: string;
    /** Smallest accepted size. */
    min: number;
    /** Largest accepted size. */
    max: number;
    /** Size when the user-settings document has no override. */
    default: number;
}
/**
 * Font sizes by role. `text` is the conversation content size; `code` is the
 * code-block size (inline code stays 1px larger); `terminal` is the sidebar
 * terminal cell font size.
 */
export declare const FONT_SIZE_SPECS: {
    readonly text: {
        readonly field: "fontSize";
        readonly variable: "--dsh-content-font-size";
        readonly min: 10;
        readonly max: 22;
        readonly default: 14;
    };
    readonly code: {
        readonly field: "codeFontSize";
        readonly variable: "--dsh-code-font-size";
        readonly min: 10;
        readonly max: 16;
        readonly default: 11;
    };
    readonly terminal: {
        readonly field: "terminalFontSize";
        readonly variable: "--dsh-terminal-font-size";
        readonly min: 10;
        readonly max: 20;
        readonly default: 13;
    };
};
/** Integer px font sizes by role. */
export type FontSizes = Readonly<Record<FontRole, number>>;
/** Default font sizes by role. */
export declare const DEFAULT_FONT_SIZES: FontSizes;
/** Settings field carrying each role's font-family list. */
export declare const FONT_FAMILY_FIELDS: {
    readonly text: "textFontFamily";
    readonly code: "codeFontFamily";
    readonly terminal: "terminalFontFamily";
};
/**
 * Body variable carrying one role's normalized font list; the token sheet
 * places it ahead of that role's built-in stack.
 * @param kind - font role.
 * @returns the CSS custom property name.
 */
export declare function fontFamilyVariable(kind: FontRole): string;
/** Normalized CSS font-family lists by role; `''` selects the built-in stack. */
export type FontFamilies = Readonly<Record<FontRole, string>>;
/** Durable theme section shared by the Host schema and the browser scope. */
export interface ThemeSettings {
    /** Selected built-in preference. */
    preference: ThemePreference;
    /** Conversation content font size in px (integer within {@link FONT_SIZE_MIN}..{@link FONT_SIZE_MAX}). */
    fontSize: number;
    /** Code-block font size in px (integer within the {@link FONT_SIZE_SPECS} `code` range). */
    codeFontSize: number;
    /** Sidebar terminal font size in px (integer within the {@link FONT_SIZE_SPECS} `terminal` range). */
    terminalFontSize: number;
    /** Interface and body text fonts placed before the built-in stack; `''` keeps the built-in stack. */
    textFontFamily: string;
    /** Code fonts placed before the built-in code stack; `''` keeps the built-in stack. */
    codeFontFamily: string;
    /** Sidebar terminal fonts placed before the built-in terminal stack; `''` keeps the built-in stack. */
    terminalFontFamily: string;
}
/**
 * Integer px schema for one role's font size.
 * @param spec - the role's range and default.
 * @returns the validated number schema.
 */
export declare function fontSizeSchema(spec: FontSizeSpec): z<number>;
/**
 * Collect every role's size from a settings section.
 * @param section - accepted theme settings.
 * @returns integer px sizes by role.
 */
export declare function sectionFontSizes(section: ThemeSettings): FontSizes;
/**
 * Whether one value is an accepted size for a role.
 * @param role - font role.
 * @param px - candidate size.
 * @returns true for an integer within the role's range.
 */
export declare function isFontSize(role: FontRole, px: number): boolean;
/** Durable theme schema; also the wire envelope the browser scope validates against. */
export declare const ThemeSettingsSchema: z<ThemeSettings>;
/**
 * Normalize user input into a CSS font-family list. Names are comma separated;
 * quotes, backslashes, angle brackets, and control characters are dropped, and
 * every non-generic name is double-quoted, so the result is always a valid list
 * safe to embed in inline CSS and boot scripts. Normalizing a result returns it unchanged.
 * @param value - user-entered or stored font list.
 * @returns the normalized list, or `''` when no family name remains.
 */
export declare function normalizeFontFamily(value: string): string;
/**
 * Narrow one wire or registry value to a persistable preference.
 * @param value - value crossing the settings or registry boundary.
 * @returns whether the value is a built-in preference.
 */
export declare function isThemePreference(value: unknown): value is ThemePreference;
//# sourceMappingURL=theme-settings.d.ts.map