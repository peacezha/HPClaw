/**
 * Built-in plugins settings section, browser half: the shell around the
 * feature-owned tabs registered into `settings.plugins.tab` (the read-only
 * inventory ships one). The configuration pages of the host-plane plugins
 * live in their own companion packages, which register into the Plugins
 * page; this section owns the Settings navigation entry and the tab chrome
 * only.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
export type { PluginsSettingsSectionInjected, PluginsSettingsSectionProps } from './PluginsSettingsSection.tsx';
/** Required services (cordis fiber inject). */
export declare const inject: string[];
/**
 * Mount the built-in plugins section.
 * @param ctx - the browser plugin context.
 */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map