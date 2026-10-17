/**
 * The agent loop's settings page, browser half: the parallel tool-call cap
 * over the `agent-loop` namespace the loop registers. The page registers into
 * the Plugins page's `plugins.item` slot while the Host serves that namespace,
 * so a deployment that exposes no agent-loop settings shows no trace of it.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import { type AgentLoopSettingsLocaleKey } from './locales.ts';
export type { AgentLoopCardProps } from './AgentLoopCard.tsx';
export type { AgentLoopCardFace, AgentLoopCardState, AgentLoopSettings } from './agent-loop-card-controller.ts';
export type { AgentLoopSettingsLocaleKey } from './locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** Agent loop settings page copy. */
        'settings.agentLoop': AgentLoopSettingsLocaleKey;
    }
}
/** Dictionary namespace owned by this plugin. */
export declare const NS = "settings.agentLoop";
/** Required services (cordis fiber inject). */
export declare const inject: string[];
/**
 * Mount the agent loop's settings page while the Host serves its namespace.
 * @param ctx - the browser plugin context.
 */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map