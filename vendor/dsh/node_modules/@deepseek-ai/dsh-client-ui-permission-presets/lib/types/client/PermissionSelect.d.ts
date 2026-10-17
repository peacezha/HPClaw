import type { HostObservable, InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { PermissionCatalogState } from './catalog.ts';
import { PERMISSION_ACCESS_NS } from './locales.ts';
/** Business face injected by the permission package's slot registration. */
export interface PermissionSelectInjected {
    hooks: {
        /** One process catalog shared with the slash popup. */
        permissionCatalog: HostObservable<PermissionCatalogState>;
    };
    /** Submit one current-session preset through the existing command writer. */
    select: (preset: string) => Promise<boolean>;
}
/** Complete props derived from the conversation slot, injected hooks, and locale. */
export type PermissionSelectProps = PropsRuntime<'conversation.input.permission'> & InjectFace<PermissionSelectInjected> & PropsLocale<typeof PERMISSION_ACCESS_NS>;
export declare function PermissionSelect({ locked, select, usePermissionCatalog, useProjection, t, }: PermissionSelectProps): import("react").JSX.Element | null;
//# sourceMappingURL=PermissionSelect.d.ts.map