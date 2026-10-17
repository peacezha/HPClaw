/** Plugins settings section: localized tabs around feature-owned pages. */
import type { HostObservable, InjectFace, PropsLocale, PropsRenderSlots, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { PluginsSettingsLocaleKey } from './locales.ts';
/** One tab projected from a `settings.plugins.tab` contribution. */
export interface PluginsSettingsTabEntry {
    id: string;
    order: number;
    label: string;
}
/** Registration-side business face for the section. */
export interface PluginsSettingsSectionInjected {
    hooks: {
        /** Ordered, locale-aware projection of the Plugins tab ledger. */
        tabs: HostObservable<readonly PluginsSettingsTabEntry[]>;
    };
}
/** Props the renderer binds for the section. */
export type PluginsSettingsSectionProps = PropsRuntime<'settings.section'> & PropsLocale<'settings.plugins'> & PropsRenderSlots<'settings.plugins.tab'> & InjectFace<PluginsSettingsSectionInjected>;
/** Render one Plugins page whose contents arrive from feature-owned tabs; one contribution shows as the page itself. */
export declare function PluginsSettingsSection({ t, renderSlot, useTabs }: PluginsSettingsSectionProps): import("react").JSX.Element;
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** Built-in plugins section and plugin configuration page copy. */
        'settings.plugins': PluginsSettingsLocaleKey;
    }
}
//# sourceMappingURL=PluginsSettingsSection.d.ts.map