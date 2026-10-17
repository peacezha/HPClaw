/**
 * The web-search provider's settings page, browser half: the key, the
 * endpoint, and the per-request search budget over the `web-search-deepseek`
 * namespace the provider registers. The page registers into the Plugins
 * page's `plugins.item` slot while the Host serves that namespace, so a
 * deployment without the provider shows no trace of it.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import { type WebSearchSettingsLocaleKey } from './locales.ts';
export type { WebSearchCardProps } from './WebSearchCard.tsx';
export type { WebSearchCardFace, WebSearchCardState, WebSearchSettings } from './web-search-card-controller.ts';
export type { WebSearchSettingsLocaleKey } from './locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** Web-search settings page copy. */
        'settings.webSearch': WebSearchSettingsLocaleKey;
    }
}
/** Dictionary namespace owned by this plugin. */
export declare const NS = "settings.webSearch";
/** Required services (cordis fiber inject). */
export declare const inject: string[];
/**
 * Mount the web-search settings page while the Host serves its namespace.
 * @param ctx - the browser plugin context.
 */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map