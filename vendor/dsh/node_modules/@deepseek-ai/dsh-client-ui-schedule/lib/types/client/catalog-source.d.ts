/** Authoritative Schedule queries and deletion for Session and Host catalogs. */
import type { RemoteResult } from '@deepseek-ai/dsh-api-remotes/client';
import type { HostObservable } from '@deepseek-ai/dsh-client-ui-slots';
import type { ScheduleDeleteResult, ScheduleId, ScheduleRecord } from '@deepseek-ai/dsh-schedule/client';
/** How one deletion settled; the wiring reports it as a transient notice. */
export type CatalogDeleteOutcome = 'deleted' | 'failed' | 'pending';
/** Query and mutation state exposed to a catalog component. */
export interface CatalogSnapshot<Item extends {
    readonly id: ScheduleId;
} = ScheduleRecord> {
    readonly records: readonly Item[];
    readonly status: 'loading' | 'ready' | 'error';
    readonly deleting: readonly ScheduleId[];
    /**
     * Whether an authoritative list read has ever succeeded.
     *
     * A consumer may read `records` as the answer only once this holds: the first
     * snapshot reports `loading` with no records, and a later refresh republishes
     * `loading` over the records of the last successful read, so `status` alone
     * cannot separate a first read from a refresh. A failed read leaves it alone.
     */
    readonly settled: boolean;
    /**
     * Count of reads this source has been asked for - by a consumer, and by its own
     * `schedule/changed`, connection-reset, and post-deletion acknowledgement paths.
     *
     * A consumer that appears with a record of its own — a created-task card —
     * records this at mount and asks for a read: an absence in the retained records
     * states a deletion only once a read requested after that point has succeeded
     * (see `readSettled`), because an earlier read may predate the record. A request
     * shares the read in flight only when that read was requested after the ordinal
     * the caller names, so this counts the requests rather than the `list()` calls.
     * Counters rather than timestamps, so the answer never compares the browser's
     * clock with the Host's.
     */
    readonly readRequest: number;
    /**
     * Ordinal of the read whose result the current records came from, and 0 before
     * any read succeeded. A failed read leaves it alone.
     */
    readonly readSettled: number;
}
/** Remote operations and invalidations scoped by the registering entry. */
export interface CatalogDependencies<Item extends {
    readonly id: ScheduleId;
} = ScheduleRecord> {
    readonly list: () => Promise<RemoteResult<Item[]>>;
    readonly remove: (id: ScheduleId) => Promise<RemoteResult<ScheduleDeleteResult>>;
    readonly subscribeChanged: (listener: () => void) => () => void;
    readonly subscribeReset: (listener: () => void) => () => void;
}
/** Props injected through a catalog slot. */
export interface CatalogInjected<Item extends {
    readonly id: ScheduleId;
} = ScheduleRecord> {
    readonly hooks: {
        readonly catalog: HostObservable<CatalogSnapshot<Item>>;
    };
    /**
     * Delete one reminder and refresh after the Remote acknowledgement.
     * @param id - reminder shown in this catalog.
     * @returns 'deleted' after the acknowledged deletion's refreshed query,
     * 'failed' when the deletion was not confirmed, and 'pending' when a deletion
     * of the same reminder was already in flight.
     */
    readonly onDelete: (id: ScheduleId) => Promise<CatalogDeleteOutcome>;
    /**
     * Reload the catalog: after a query failure or an acknowledged timing update,
     * and from a created-task card that needs a read newer than its own result.
     *
     * Requests made in one commit share a single read, so several cards mounting
     * together still send one. A caller that has already observed a request passes
     * that ordinal as `since`, and only a read requested later than it is shared - so
     * a read issued before the caller appeared cannot answer for it, and a caller
     * that has seen the newest request gets a fresh read.
     * @param since - request ordinal the caller last observed, 0 to share any read in flight.
     * @returns Resolution after publishing the read result; failures remain in catalog state.
     */
    readonly onRetry: (since?: number) => Promise<void>;
}
/**
 * Create a catalog whose Remote subscriptions follow its framework subscribers.
 * Mutations retain visible rows until an authoritative list read succeeds, and
 * each deletion resolves with its own outcome for the caller to report.
 * @param deps - Remote calls and invalidation subscriptions.
 * @returns observable catalog and component callbacks.
 */
export declare function createCatalogSource<Item extends {
    readonly id: ScheduleId;
} = ScheduleRecord>(deps: CatalogDependencies<Item>): CatalogInjected<Item>;
//# sourceMappingURL=catalog-source.d.ts.map