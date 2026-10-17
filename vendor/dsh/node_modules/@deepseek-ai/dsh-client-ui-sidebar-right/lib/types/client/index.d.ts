import type { Context as ClientContext } from '@deepseek-ai/cordis';
import { type SidebarRightController } from './service.ts';
import { SidebarRightTabRegistry } from './tab-registry.ts';
export type { SidebarRightTarget } from './focus.ts';
export type { RightbarSeatProps, SidebarRightInjected, SidebarRightPresentation } from './shell/SidebarRight.tsx';
export type { GuideBodyProps, GuideInjected } from './tabs/guide/GuideBody.tsx';
export type { ExpandButtonProps } from './shell/ExpandButton.tsx';
export type { SidebarRightState, SurfaceState } from './stores.ts';
export type { ISidebarRight, SidebarRightOpenResourceOptions, SidebarRightOpenTabOptions, SidebarRightPlacement, SidebarRightCloseHandler, SurfaceActions, } from './service.ts';
export type { SidebarRightGuideBox, SidebarRightGuideEntry, SidebarRightTabClaim, SidebarRightTabDefinition, SidebarRightTabPriority, } from './tab-registry.ts';
export type { SidebarRightTabInfo, SidebarRightTabInjected, UseSidebarRightTabInfo, SidebarRightTabActions, SidebarRightTabMenuOwnerProps, SidebarRightTabNavigation, SidebarRightTabPlacement, SidebarRightGuideEntryOwnerProps, } from './contract/slots.ts';
export type { SidebarRightNavigationParams, SidebarRightResourceParams, SidebarRightResourceParamsMap, SidebarRightTabParams, SidebarRightTabParamsFor, SidebarRightTabParamsMap, } from './contract/params.ts';
export type { FloatRect, PaneId, TabId, TabRecord } from '@deepseek-ai/dsh-client-ui-dockkit';
export type { PinResource, SidebarRightNavigator, TabOccurrence, SidebarRightOccurrenceId } from './tab-domain.ts';
export type { SidebarRightKey } from './locales.ts';
export type { OpenContentIntent } from './stores.ts';
export type { SidebarRightOpenTab } from './tab-inventory.ts';
/** Required browser services: the slot registry, the frame's panel actions, copy, and the resource model. */
export declare const inject: string[];
declare module '@deepseek-ai/cordis' {
    interface Context {
        /** Right-Sidebar navigation and presentation face. */
        sidebarRight: SidebarRightController;
        /** Right-Sidebar tab-type registry (stage one of a tab type's registration). */
        sidebarRightTabs: SidebarRightTabRegistry;
    }
}
/**
 * Client plugin body: provide the registry and the navigation face, register the
 * panel seat and the rail seat over one store with their extension children, and
 * register the guide type through the same public two-stage path any other type
 * uses.
 * @param ctx - client root context carrying the slot registry, the frame's face, and copy.
 */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map