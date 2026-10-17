/** Source-safe Agent Teams browser registration. */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import { type TeamKey } from './locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** Agent Teams roster and task-board copy. */
        'agent-team': TeamKey;
    }
}
/** Required browser services for navigation, slots, and localized copy. */
export declare const inject: string[];
/**
 * Register the Team locale dictionaries and the conversation-header action.
 * The panel reads the Lead Session's `agentTeam` projection from the shared
 * Session store; this registration performs no Team RPC.
 * @param ctx - Client Context carrying the injected navigation, locale, slot, and Session services.
 */
export declare function registerAgentTeamUi(ctx: ClientContext): void;
//# sourceMappingURL=mount.d.ts.map