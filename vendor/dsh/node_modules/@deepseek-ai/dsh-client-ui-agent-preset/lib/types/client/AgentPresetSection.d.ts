import type { ObservableSnapshot, SnapshotStore } from '@deepseek-ai/dsh-client-store';
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { AgentPresetSectionState } from './section-store.ts';
/** Settings actions and their shared controller state. */
export interface AgentPresetSectionInjected {
    hooks: {
        agentPresetSection: SnapshotStore<AgentPresetSectionState>;
        /** Shared Coding Tools preference; off hides the built-in PTC and Minimal cards. */
        developerTools: ObservableSnapshot<boolean>;
    };
    /** Stage the `cordis` preset and start a Creator-mode task; absent without a conversation flow. */
    startCreatorDraft?: () => void;
    load: () => Promise<void>;
    /** Open one preset's declared composition in the read-only viewer. */
    view: (id: string) => Promise<void>;
    /** Close the read-only viewer. */
    closeView: () => void;
    makeDefault: (id: string) => Promise<void>;
}
/** Props assembled by the settings renderer. */
export type AgentPresetSectionProps = PropsRuntime<'settings.section'> & PropsLocale<'settings.agentPreset'> & InjectFace<AgentPresetSectionInjected>;
/** Render the roster with its default, mode help, composition viewer, and the guidance to Creator mode.
 * @param props Settings actions, snapshot hooks and localized text.
 * @returns The preset settings section.
 */
export declare function AgentPresetSection({ useAgentPresetSection, load, view, closeView, makeDefault, startCreatorDraft, close: closeSettings, useDeveloperTools, t, }: AgentPresetSectionProps): import("react").JSX.Element;
//# sourceMappingURL=AgentPresetSection.d.ts.map