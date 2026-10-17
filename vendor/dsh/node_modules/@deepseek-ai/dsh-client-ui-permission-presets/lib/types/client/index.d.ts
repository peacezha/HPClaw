/**
 * Permission preset plugin, browser half — a popupSelect DECORATION hung on
 * the host `/permission` command: one flat list of presets, current value
 * marked active, a pick executes the switch. One process catalog directory is
 * shared with the composer slot; Session projection carries current value
 * only. The decoration owns only the
 * bare invocation; the host command keeps its catalog row, the argued path
 * (`/permission <preset>` still switches directly), and the lifecycle
 * logging. Options read the process catalog and the active mark reads the
 * session's `permissions` projection; a
 * pick submits the `/permission <preset>` command line, so both surfaces
 * write through one path and the pushed projection frame is the one
 * confirmation. The Full access row carries the same explicit risk gate as
 * the composer chip; the shared popup shell owns the modal mechanics.
 * The General-settings row separately writes the default preset for sessions
 * created later through the host Settings API.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import { accessEn } from './locales.ts';
export type { PermissionRowInjected, PermissionRowProps } from './PermissionRow.tsx';
export type { PermissionCatalogState } from './catalog.ts';
export type { PermissionSelectInjected, PermissionSelectProps } from './PermissionSelect.tsx';
export type { PermissionDefaultOption, PermissionSettingsState, } from './settings-store.ts';
/** Required services (cordis fiber inject). */
export declare const inject: string[];
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** Current-session permission picker and confirmation copy. */
        'permission.access': keyof typeof accessEn;
    }
}
/**
 * Client plugin body: register the /permission popup picker over the
 * permissions projection.
 * @param ctx - client root context.
 */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map