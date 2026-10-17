/**
 * The Subagent settings page, browser half: the delegation limits over the
 * `subagent` namespace and the models agents may choose over the
 * `subagent-model-selection` namespace, on one page with one save. The page
 * registers into the Plugins page's `plugins.item` slot while the Host serves
 * either namespace and shows the sections it serves.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import { type SubagentSettingsLocaleKey } from './locales.ts';
export type { SubagentCardProps } from './SubagentCard.tsx';
export type { SubagentCardFace } from './subagent-card-controller.ts';
export type { SubagentLimitsCardFace, SubagentLimitsCardState, SubagentLimitsSettings } from './subagent-limits-card-controller.ts';
export type { SubagentModelSelectionCardFace, SubagentModelSelectionCardState, SubagentModelSelectionSettings, } from './subagent-model-selection-card-controller.ts';
export type { SubagentSettingsLocaleKey } from './locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** Subagent settings page copy. */
        'settings.subagent': SubagentSettingsLocaleKey;
    }
}
/** Dictionary namespace owned by this plugin. */
export declare const NS = "settings.subagent";
/**
 * Namespace of the delegation limits. Spelled here rather than imported: a
 * client package must not depend on a Host package.
 */
export declare const SUBAGENT_NS = "subagent";
/** Required services (cordis fiber inject). */
export declare const inject: string[];
/**
 * Mount the Subagent settings page while the Host serves either of its namespaces.
 * @param ctx - the browser plugin context.
 */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map