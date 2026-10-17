/**
 * Browser theme registry over the `--dsw-*` token stylesheets. The service
 * owns the live theme preference (light/dark/system), resolves `system` through
 * `prefers-color-scheme`, and publishes immutable snapshots; it never touches
 * the DOM — ui-layout's presenter consumes the resolved snapshot. The Host
 * settings scope loads and stores the preference in the user-settings
 * document. The plugin also registers the Appearance and font settings rows
 * into the settings General section — the theme feature owns its own settings
 * surface. Desktop shortcuts adjust text, code, and terminal font sizes together.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import type { ConfigForm } from '@deepseek-ai/dsh-client-ui-settings/client';
import { type ThemeKey } from './locales.ts';
import { type FontFamilies, type FontRole, type FontSizes, type ThemePreference, type ThemeSettings } from '../theme-settings.ts';
export type { AppearanceRowComponentProps, AppearanceRowInjected } from './AppearanceRow.tsx';
export type { FontSettingsGroupProps, FontSettingsInjected } from './FontSettingsGroup.tsx';
export type { AppearanceRowState, FontRowState } from './settings-store.ts';
export type { ThemeKey } from './locales.ts';
export type { FontFamilies, FontRole, FontSizes, ThemePreference, ThemeSettings } from '../theme-settings.ts';
/** Namespace owning this feature's settings-row copy. */
export declare const SETTINGS_NS = "settings.theme";
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** The Appearance settings row's copy. */
        'settings.theme': ThemeKey;
    }
}
/** Theme token dictionary: --dsw-alias-* overrides keyed by variable name. */
export type ThemeTokens = Record<string, string>;
/**
 * One override-layer token value: both palette modes are mandatory (repeat
 * the same value when the token is scheme-invariant) so an override never
 * goes illegible when the user switches to the other scheme.
 */
export interface ThemeTokenModes {
    /** Value applied while the light base palette is active. */
    light: string;
    /** Value applied while the dark base palette is active. */
    dark: string;
}
/** Override-layer dictionary: token names to per-mode value pairs. */
export type ThemeTokenOverrides = Record<string, ThemeTokenModes>;
/** One selectable theme: id, dark/light semantics, and alias-token overrides. */
export interface ThemeDefinition {
    /** Theme id (the setTheme argument for concrete themes). */
    id: string;
    /**
     * Which base palette this theme builds on. The presenter switches
     * `body[data-ds-dark-theme]` from this field — never from the id.
     */
    colorScheme: 'light' | 'dark';
    /** Alias-layer overrides applied as inline CSS variables over the base palette. */
    tokens: ThemeTokens;
}
/** Immutable theme state published on every change. */
export interface ThemeSnapshot {
    /** The persisted preference (may be `system`). */
    preference: ThemePreference;
    /** Integer px font sizes by role, each within its `FONT_SIZE_SPECS` range (`text` is the conversation content size). */
    fontSizes: FontSizes;
    /** Normalized user font lists by role; `''` selects the role's built-in stack. */
    fontFamilies: FontFamilies;
    /**
     * The resolved active theme (`system` resolved via prefers-color-scheme)
     * with override layers folded into its tokens (seq order, later layers win
     * per-token; each value picked for the active color scheme).
     */
    active: ThemeDefinition;
    /** Registered themes in registration order. */
    themes: readonly ThemeDefinition[];
    /** Monotonic change counter (registry or active changes). */
    revision: number;
}
/** One theme token exposed to pre-definition Cordis inspection. */
export interface ThemeTokenInspection {
    /** Token name accepted by {@link ThemeRuntime.overrideTokens}. */
    name: string;
    /** Intended visual role. */
    description: string;
    /** CSS value category. */
    valueType: string;
    /** Whether override layers must supply both palette modes. */
    requiresLightAndDark: boolean;
    /** CSS custom property consumed by UI styles. */
    cssVariable?: string;
}
declare module '@deepseek-ai/cordis' {
    interface Context {
        theme: ThemeRuntime;
    }
    interface Events {
        /**
         * Theme state changed (preference switched, registry updated, or the OS
         * color scheme changed while the preference is `system`).
         * @param snapshot - Current immutable theme snapshot.
         * @mode emit
         */
        'theme/change'(snapshot: ThemeSnapshot): void;
    }
}
/**
 * Theme registry and preference owner. `light`/`dark` are built in (the base
 * stylesheets carry both palettes); third-party themes register alias-layer
 * overrides. Reads go through {@link getTheme}; preference writes only
 * through {@link setTheme}; continuous sync only through the `theme/change`
 * event. {@link overrideTokens} stacks partial token layers over the active
 * theme without touching the registry.
 * The service holds the `prefers-color-scheme` media query (environment
 * sensing, not presentation) and re-emits when the OS scheme flips while the
 * preference is `system`.
 */
export declare class ThemeRuntime {
    private readonly ctx;
    private readonly host;
    private themes;
    private preference;
    private fontSizes;
    private fontFamilies;
    private revision;
    /** Own settings writes not yet settled; adoption waits for zero so a Host echo of an earlier write cannot revert a later local change. */
    private pendingWrites;
    private snapshot;
    private readonly media;
    /** Override layers by source; seq (monotonic) is the stacking order. */
    private readonly overrides;
    private overrideSeq;
    /**
     * @param ctx - owning context (change events are emitted on it; the
     * media-query and scope listeners are released through ctx.effect on dispose).
     * @param host - durable preference scope owned by the same plugin.
     */
    constructor(ctx: ClientContext, host: ConfigForm<ThemeSettings>);
    /**
     * Read the current immutable theme snapshot.
     * @returns the current snapshot (stable reference until the next change).
     */
    getTheme(): ThemeSnapshot;
    /**
     * Export the current token directory without reading DOM or computed styles.
     * @returns stable JSON-safe token descriptions, including registered and override-only names.
     */
    exportInspectTokens(): ThemeTokenInspection[];
    /**
     * Switch the theme preference — the only user preference write entry.
     * Built-in preferences are written through the settings scope and every
     * accepted value emits `theme/change`.
     * @param id - a registered theme id or `system`; unknown ids throw.
     */
    setTheme(id: string): void;
    /**
     * Change one role's font size. Accepted
     * values are written through the settings scope and emit `theme/change`.
     * @param role - font role.
     * @param px - integer px within the role's `FONT_SIZE_SPECS` range; out-of-range or fractional values throw.
     */
    setFontSize(role: FontRole, px: number): void;
    /**
     * Step all font sizes within their own ranges and save changed fields in one mutation.
     * Emits one `theme/change`; no write or event occurs when every role is at its limit.
     * @param delta - one pixel to add or remove from each role's current size.
     */
    private adjustFontSizes;
    /**
     * Change one role's font list — the only font-family write entry. The value
     * is normalized, written through the settings scope, and emits `theme/change`
     * when the normalized list differs.
     * @param role - font role.
     * @param value - comma-separated family names; a value without names restores the built-in stack.
     */
    setFontFamily(role: FontRole, value: string): void;
    /** Queue one settings write, then adopt the durable section once no own write remains. */
    private write;
    /** Adopt the scope's accepted durable preference without writing it back. */
    private adopt;
    /**
     * Register a theme. Duplicate id throws (single occupant per id; the
     * built-in pair counts; `system` is a preference, not a registrable id).
     * @param definition - theme id, colorScheme, and alias-token overrides.
     * @returns disposer. Disposing the theme backing the active preference
     * resets the preference to the default so the UI never keeps tokens of an
     * unregistered theme.
     */
    register(definition: ThemeDefinition): () => void;
    /**
     * Stack a token override layer on top of the active theme — the token-level
     * analogue of slot shading: the base theme stays untouched, layers compose
     * in seq order with later layers winning per-token, and removing a layer
     * restores whatever it covered. Calling again with the same source replaces
     * that source's whole layer and restacks it on top (effect re-registration
     * semantics). Emits `theme/change` with the recomposed snapshot.
     * @param source - layer identity; one layer per source (dynamic packages
     * pass their package id — the façade pins it, so it also names the layer's
     * origin for inspection).
     * @param tokens - token-name → `{ light, dark }` value pairs. Validated at
     * runtime (model-authored callers reach this boundary with untyped JS);
     * a bare string value throws a teaching error.
     * @returns disposer removing exactly the layer this call created; a no-op
     * once the source has re-overridden (the newer layer is not torn down).
     */
    overrideTokens(source: string, tokens: ThemeTokenOverrides): () => void;
    private buildSnapshot;
    /**
     * Fold the override layers into the active definition: seq order, later
     * layers win per-token, each value picked for the active color scheme (the
     * presenter consumes the composed snapshot and needs no override awareness).
     * Without layers the registered definition passes through by identity.
     */
    private composeActive;
    private publish;
}
/**
 * Required services: settings transport plus slots/locale for the Appearance
 * row. `remote` carries the forwarded settings invalidation that
 * `ctx.configForms.get(entryId)` subscribes to on this context.
 */
export declare const inject: string[];
/**
 * Client plugin body: provide the theme service and register the
 * feature-owned Appearance and font settings rows into the General section's item
 * slot (a feature owns its settings surface). Desktop font-size shortcuts share
 * all three font-size settings when the keyboard service is available.
 * @param ctx - client cordis context.
 */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map