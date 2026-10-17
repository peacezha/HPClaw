/** The tabs other plugins contribute to the Plugins page through `plugins.tab`, in the active locale. */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import { type HostObservable } from '@deepseek-ai/dsh-client-ui-slots';
/** One contributed tab: its registration id and its label in the active locale. */
export interface PluginTab {
    readonly id: string;
    readonly label: string;
}
/**
 * Project the `plugins.tab` ledger as one observable the page binds.
 * @param ctx - the page plugin's context, whose slot registry and locale the projection follows.
 * @returns the tab source; its snapshot changes only when the ledger or the locale does.
 */
export declare function tabLedgerSource(ctx: ClientContext): HostObservable<readonly PluginTab[]>;
//# sourceMappingURL=tab-ledger.d.ts.map