/** Refresh failure feedback hosted outside the Plugins panel's lifetime. */
import type { ReactNode } from 'react';
import type { InjectFace, PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
import type { PluginManagerFace } from './manager-store.ts';
/** The controller's shared notice source and dismissal action. */
export type PluginRefreshToastFace = Pick<PluginManagerFace, 'dismissNotice'> & {
    hooks: Pick<PluginManagerFace['hooks'], 'pluginManager'>;
};
/** Render inputs bound from the shared controller and plugin dictionary. */
export type PluginRefreshToastProps = InjectFace<PluginRefreshToastFace> & PropsLocale<'pluginManager'>;
/**
 * Display refresh failures even after navigation leaves the Plugins panel.
 * @param props - shared notice hook, dismissal action, and locale seat.
 * @returns the refresh failure toast, or null for other notices.
 */
export declare function PluginRefreshToast({ usePluginManager, dismissNotice, t }: PluginRefreshToastProps): ReactNode;
//# sourceMappingURL=PluginRefreshToast.d.ts.map