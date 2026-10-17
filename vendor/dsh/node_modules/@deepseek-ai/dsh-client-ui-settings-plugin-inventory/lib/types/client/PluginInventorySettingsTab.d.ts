import { type ReactNode } from 'react';
import type { ClientEntryState } from '@deepseek-ai/dsh-client-modules/client';
import type { ObservableSnapshot } from '@deepseek-ai/dsh-client-store';
import type { PluginInventorySnapshot } from '@deepseek-ai/dsh-api-remotes/client';
import type { LocalizedText } from '@deepseek-ai/dsh-package-manifest';
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
type AgentPresetGroup = NonNullable<PluginInventorySnapshot['agentPresets']>[number];
/** Registration-side Remote face used by the section. */
export interface PluginInventorySettingsTabInjected {
    /** Resolve local package text in the current Client locale at render time. */
    resolveText: (text: LocalizedText) => string;
    /** Page-local module synchronization, independent from the Host inventory. */
    hooks: {
        clientSync: ObservableSnapshot<ClientEntryState>;
    };
    /** Retry the latest client graph without changing the Host composition. */
    retryClient: () => void;
    /** Read a current Host inventory snapshot. */
    list: () => Promise<PluginInventorySnapshot>;
    /**
     * Display name for one preset: shipped presets resolve through the
     * agent-preset dictionaries, user-authored ones keep their own metadata.
     */
    presetName: (preset: AgentPresetGroup) => string;
}
/** Full component props assembled by the Settings slot renderer. */
export type PluginInventorySettingsTabProps = PropsRuntime<'settings.plugins.tab'> & PropsLocale<'settings.pluginInventory'> & InjectFace<PluginInventorySettingsTabInjected>;
/** Render the read-only plugin inventory: agent presets first, then the global plane. */
export declare function PluginInventorySettingsTab({ list, presetName, resolveText, t, useClientSync, retryClient }: PluginInventorySettingsTabProps): ReactNode;
export {};
//# sourceMappingURL=PluginInventorySettingsTab.d.ts.map