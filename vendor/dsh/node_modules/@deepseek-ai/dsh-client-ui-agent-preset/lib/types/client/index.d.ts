/**
 * Agent-preset surface plugin, browser half — three surfaces over one roster:
 * a chip on the new-session screen for the session about to start, a
 * read-only label in the session header, and a settings section that lists
 * the roster (selection, the new-task default, a read-only view of each
 * declared composition, and the way into Creator mode).
 *
 * A running session keeps the composition it began with (the host switches a
 * session's preset only before its first turn). That is what splits
 * the choice from the display: the hero chip is before-the-fact, while the
 * header only reports what a session already runs. The default preset is
 * edited where the roster is visible — the settings section's "make default"
 * — so General settings carries no duplicate control for the same field.
 *
 * Coding Tools (General settings) hide PTC and Minimal from the hero menu
 * and Settings roster when off. Hidden saved defaults fall back to Standard;
 * the existing gate clears staged choices while existing sessions keep their composition.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import { type AgentPresetSettingsKey } from './locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** Agent-preset surface copy. */
        'settings.agentPreset': AgentPresetSettingsKey;
    }
}
export type { AgentPresetLabelInjected, AgentPresetLabelProps } from './AgentPresetLabel.tsx';
export type { AgentPresetSeatInjected, AgentPresetSeatProps } from './AgentPresetSeat.tsx';
export type { AgentPresetSectionInjected, AgentPresetSectionProps } from './AgentPresetSection.tsx';
export type { AgentPresetSeatState } from './seat-store.ts';
export type { AgentPresetSectionState, PresetView } from './section-store.ts';
export type { AgentPresetOption, AgentPresetSettingsState } from './settings-store.ts';
export { AGENT_PRESET_SETTINGS_NS, writeDefaultPreset } from './settings-store.ts';
/** Required services (cordis fiber inject). */
export declare const inject: string[];
/**
 * Mount the roster surfaces: hero chip, session-header label, settings section.
 * @param ctx - the browser plugin context.
 */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map