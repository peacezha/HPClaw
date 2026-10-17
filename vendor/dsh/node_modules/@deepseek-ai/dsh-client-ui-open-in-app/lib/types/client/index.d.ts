/**
 * Shared native opening controls for workspace directories, document previews,
 * delivery cards, and changed-file review. Directory choices persist in the browser;
 * file defaults and application lists come from the serving Host desktop.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import { type OpenInAppKey } from './locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** Session-header "open workspace in application" copy. */
        'open-in-app': OpenInAppKey;
    }
}
export type { OpenInAppActionInjected, OpenInAppActionProps } from './OpenInAppAction.tsx';
export type { OpenInAppPathAction, OpenInAppPathFailure, OpenInAppPathRemote } from './open-path.ts';
export type { OpenPathActionProps, OpenPathInjected } from './OpenPathAction.tsx';
export type { OpenPathEmptyActionProps } from './OpenPathEmptyAction.tsx';
/** Required services: sessions, layout selection, the slot registry, copy, Remote calls, and shortcuts. */
export declare const inject: string[];
/**
 * Client plugin body: register dictionaries, workspace directory controls, and
 * document preview path controls.
 * @param ctx - client root context.
 */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map