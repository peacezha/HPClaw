/**
 * The shell executor's settings page, browser half: the command timeout and
 * the per-stream output cap over the `shell` namespace the executor
 * registers. The page registers into the Plugins page's `plugins.item` slot
 * while the Host serves that namespace, so a deployment without a local shell
 * executor shows no trace of it.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import { type ShellSettingsLocaleKey } from './locales.ts';
export type { ShellCardProps } from './ShellCard.tsx';
export type { ShellCardFace, ShellCardState, ShellSettings } from './shell-card-controller.ts';
export type { ShellSettingsLocaleKey } from './locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** Shell settings page copy. */
        'settings.shell': ShellSettingsLocaleKey;
    }
}
/** Dictionary namespace owned by this plugin. */
export declare const NS = "settings.shell";
/** Required services (cordis fiber inject). */
export declare const inject: string[];
/**
 * Mount the shell settings page while the Host serves its namespace.
 * @param ctx - the browser plugin context.
 */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map