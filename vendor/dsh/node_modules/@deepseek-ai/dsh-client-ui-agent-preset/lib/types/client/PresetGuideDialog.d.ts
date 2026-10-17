import type { KeyboardEvent, ReactNode } from 'react';
import type { TranslateNS } from '@deepseek-ai/dsh-client-ui-slots';
import type { AgentPresetSettingsKey } from './locales.ts';
export type PresetGuidePage = 'explanation' | 'usage';
/** Locale references for one known, shipped preset. */
interface PresetGuide {
    name: AgentPresetSettingsKey;
    intro: AgentPresetSettingsKey;
    explanation: AgentPresetSettingsKey;
    usage: AgentPresetSettingsKey;
}
/**
 * Look up help only for known, shipped presets.
 * @param id - preset identifier from the roster.
 * @param trust - roster source; custom presets own their capability claims.
 * @returns the shipped guide, or undefined for unknown and custom presets.
 */
export declare function presetGuide(id: string, trust: string): PresetGuide | undefined;
/** Keep keyboard focus inside a preset reader while Tab moves through its controls.
 * @param event Keyboard event from the active reader.
 */
export declare function trapPresetReaderTab(event: KeyboardEvent<HTMLDivElement>): void;
/**
 * Open read-only help without changing the selected preset.
 * @param props - localized guide, initial page, and close callback.
 * @returns the modal reader with independent scroll positions for each page.
 */
export declare function PresetGuideDialog({ guide, initialPage, t, onClose }: {
    guide: PresetGuide;
    initialPage: PresetGuidePage;
    t: TranslateNS<'settings.agentPreset'>;
    onClose: () => void;
}): ReactNode;
export {};
//# sourceMappingURL=PresetGuideDialog.d.ts.map