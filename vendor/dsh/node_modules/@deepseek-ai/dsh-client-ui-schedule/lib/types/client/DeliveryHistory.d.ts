import type { RemoteResult } from '@deepseek-ai/dsh-api-remotes/client';
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
import type { ScheduleDeliveryHistoryRequest, ScheduleDeliveryHistoryResult } from '@deepseek-ai/dsh-schedule/client';
/** Read saved records without opening or activating the original Session. */
export interface DeliveryHistoryInjected {
    /**
     * Read a newest-first page for the exact task and Session.
     * @param request - Task binding, required page size, and optional older-page cursor.
     * @returns Remote success or failure; transport exceptions may reject the promise.
     */
    readonly loadHistory: (request: ScheduleDeliveryHistoryRequest) => Promise<RemoteResult<ScheduleDeliveryHistoryResult>>;
}
type Cursor = ScheduleDeliveryHistoryRequest['before'];
type Props = DeliveryHistoryInjected & PropsLocale<'schedule.manager'> & {
    id: ScheduleDeliveryHistoryRequest['id'];
    sessionId: ScheduleDeliveryHistoryRequest['sessionId'];
    latestMessageId: Cursor;
    /** IANA zone of the task's own wall-clock rule; undefined for a one-shot or interval task. */
    timeZone?: string | undefined;
};
/**
 * Render immutable saved deliveries; the parent keys this view by task and Session.
 * Refreshes supersede pending older pages, and unmount ignores both late outcomes.
 * @param props - Exact task binding, latest receipt identity, Remote callback, task zone, and locale.
 * @returns Saved records and explicit loading, failure, and pagination actions.
 */
export declare function DeliveryHistory({ id, sessionId, latestMessageId, timeZone, loadHistory, t }: Props): import("react").JSX.Element;
export {};
//# sourceMappingURL=DeliveryHistory.d.ts.map