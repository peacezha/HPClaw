import type { SnapshotStore } from '@deepseek-ai/dsh-client-store';
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { AgentPresetSettingsState } from './settings-store.ts';
/** Roster and navigation supplied by the preset plugin. */
export interface CreatePluginMenuItemInjected {
    hooks: {
        agentPresets: SnapshotStore<AgentPresetSettingsState>;
    };
    load: () => Promise<void>;
    startCreatorDraft: () => void;
}
type CreatePluginMenuItemProps = PropsRuntime<'plugins.add.actions'> & PropsLocale<'settings.agentPreset'> & InjectFace<CreatePluginMenuItemInjected>;
/**
 * Close the Add plugin menu before opening Creator without sending a message.
 * @param props - locale, roster, dismissal and navigation callbacks.
 * @returns a stable menu item that explains why Creator is unavailable.
 */
export declare function CreatePluginMenuItem({ t, useAgentPresets, load, onDismiss, startCreatorDraft, }: CreatePluginMenuItemProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=CreatePluginMenuItem.d.ts.map