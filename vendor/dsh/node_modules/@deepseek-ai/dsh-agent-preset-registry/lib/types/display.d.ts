/**
 * Display resolution for roster presets, shared by every surface that renders
 * preset names: shipped presets resolve through locale dictionary keys, and
 * user-authored metadata is never translated. A pure fold with no imports, so
 * browser bundles inline it and the Host uses the same single home for which
 * shipped id carries which copy key.
 * @module @deepseek-ai/dsh-agent-preset-registry/display
 */
/** Dictionary keys carrying one shipped preset's display copy. */
export type BuiltInPresetCopyKey = 'presetStandardName' | 'presetStandardDescription' | 'presetPtcName' | 'presetPtcDescription' | 'presetMinimalName' | 'presetMinimalDescription' | 'presetCordisName' | 'presetCordisDescription';
/** Preset roster fields needed to resolve display copy. */
export interface PresetDisplaySource {
    /** Stable preset id. */
    readonly id: string;
    /** Unlocalized name published by the preset. */
    readonly name?: string;
    /** Unlocalized description published by the preset. */
    readonly description?: string;
}
/** Display copy resolved for the active locale. */
export interface PresetDisplayText {
    /** Localized built-in name or the preset's own fallback name. */
    readonly name: string;
    /** Localized built-in description or the preset's own description. */
    readonly description?: string;
}
/**
 * Whether a roster row is one of the shipped presets whose copy the dictionaries carry.
 * A shipped preset publishes no `name`; a declaration that names itself owns its copy.
 * @param preset - roster row.
 * @returns true for a shipped preset id without a published name.
 */
export declare function isBuiltInPreset(preset: PresetDisplaySource): boolean;
/**
 * Resolve preset display copy without making user-authored metadata translatable.
 * @param preset - roster row whose copy is being rendered.
 * @param t - active locale lookup covering {@link BuiltInPresetCopyKey}.
 * @returns localized copy for a known shipped preset, otherwise declaration metadata.
 */
export declare function presetDisplayText(preset: PresetDisplaySource, t: (key: BuiltInPresetCopyKey) => string): PresetDisplayText;
//# sourceMappingURL=display.d.ts.map