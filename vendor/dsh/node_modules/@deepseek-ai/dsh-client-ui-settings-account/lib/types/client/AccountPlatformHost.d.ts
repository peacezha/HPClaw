import type { HostObservable, InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { PlatformPageClaim } from './platform-pages.ts';
import { type PlatformBridge } from './PlatformOverlay.tsx';
/** Injected share of the shared Platform host. */
export interface AccountPlatformHostInjected {
    platform: PlatformBridge;
    hooks: {
        page: HostObservable<PlatformPageClaim | null>;
    };
    /**
     * Viewer returned: drop the live request, notifying its owner with the reason
     * the page stopped being live. Post-return reads belong to the requesting
     * surface; this host closes the page and nothing else.
     */
    closePage(this: void): void;
}
/** Composed props of the shared Platform host. */
export type AccountPlatformHostProps = PropsRuntime<'shell.overlay'> & PropsLocale<'settings.account'> & InjectFace<AccountPlatformHostInjected>;
/**
 * @param props - the native commands, the live page request, and its dismissal.
 * @returns the native Platform container, or null while no page is requested.
 */
export declare function AccountPlatformHost({ platform, usePage, closePage, t }: AccountPlatformHostProps): import("react").JSX.Element | null;
//# sourceMappingURL=AccountPlatformHost.d.ts.map