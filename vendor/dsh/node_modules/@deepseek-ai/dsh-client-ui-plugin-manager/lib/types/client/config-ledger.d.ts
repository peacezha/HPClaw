/**
 * Which plugins bring their own configuration to the Plugins page, read from
 * the three slots the page declares: the official plugins listed beside the
 * official bundles, the bundles with a form on their page, and the rows with a
 * page of their own. The projection follows the slot ledgers and the active
 * locale and keeps its snapshot until one of them moves.
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
import { type HostObservable } from '@deepseek-ai/dsh-client-ui-slots';
/** One official plugin as the page lists it: its registration id and its title in the active locale. */
export interface OfficialItem {
    readonly id: string;
    readonly label: string;
}
/**
 * The plugins carrying configuration: the official plugins in ledger order,
 * the package names of the bundles with a page-level form, and the keys
 * ({@link rowConfigKey}) of the rows with a page.
 */
export interface ConfigLedger {
    readonly items: readonly OfficialItem[];
    readonly bundles: ReadonlySet<string>;
    readonly rows: ReadonlySet<string>;
}
/**
 * The key a row's configuration registers under.
 * @param bundle - the bundle's package name.
 * @param rowId - the row id the bundle's patch declares.
 * @returns the `plugins.row.config` key.
 */
export declare function rowConfigKey(bundle: string, rowId: string): string;
/**
 * Project the configuration ledgers as one observable the page binds.
 * @param ctx - the page plugin's context, whose slot registry and locale the projection follows.
 * @returns the ledger source; its snapshot changes only when a ledger or the locale does.
 */
export declare function configLedgerSource(ctx: ClientContext): HostObservable<ConfigLedger>;
//# sourceMappingURL=config-ledger.d.ts.map