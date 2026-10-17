import type { Context } from '@deepseek-ai/cordis';
export type { BrowserBodyProps } from './view/BrowserBody.tsx';
export type { BrowserControllerState, BrowserInjected, BrowserMountRequest } from './browser/BrowserController.ts';
export type { BrowserFrame, BrowserFrameState, BrowserLoadError, BrowserSandboxControl } from './browser/BrowserFrame.ts';
export type { BrowserPage, BrowserPageFactory, BrowserPageOptions } from './browser/BrowserPage.ts';
export type { BrowserPresentation } from './view/BrowserPresentation.ts';
export type { BrowserFailure, BrowserHistoryEntry, BrowserNavigationStatus, BrowserTabState } from './browser/BrowserPersistence.ts';
export type { SidebarBrowserKey } from './locales.ts';
export type { BrowserState } from './browser/store.ts';
export type { BrowserAddressFailure, BrowserAddressResult, BrowserTarget } from './browser/url.ts';
declare module '@deepseek-ai/dsh-client-ui-sidebar-right/client' {
    interface SidebarRightTabParamsMap {
        /** Optional initial Browser URL. */
        browser: {
            readonly url?: string;
        };
    }
}
/** Required Browser services. */
export declare const inject: string[];
/** Register the Browser type, localized guide entry, body, and title. */
export declare function apply(ctx: Context): void;
//# sourceMappingURL=index.d.ts.map