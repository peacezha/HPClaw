import z from '@deepseek-ai/schemastery';
import { Context, Service } from '@deepseek-ai/cordis';
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import type { SessionId } from '@deepseek-ai/dsh-session';
import type { ScheduleCatalogEntry, ScheduleCreateRequest, ScheduleDeleteRequest, ScheduleDeleteResult, ScheduleDeliveryHistoryRequest, ScheduleDeliveryHistoryResult, ScheduleListRequest, ScheduleRecord, ScheduleUpdateRequest, ScheduleUpdateResult } from './types.ts';
export type * from './types.ts';
export { scheduleDomain } from './storage.ts';
export type { ScheduleTask } from './storage.ts';
export type { RecurringOccurrence } from './domain.ts';
export { SCHEDULE_CHANGE_VERSION, MIN_EVERY_INTERVAL_SECONDS, MAX_TITLE_LENGTH, REQUIRED_TITLE_MESSAGE, ScheduleId, ScheduleInputError, ScheduleLogError, canonicalizeCronExpression, createAfterScheduleRecord, createAtScheduleRecord, createEveryScheduleRecord, createDailyScheduleRecord, createWeeklyScheduleRecord, createCronScheduleRecord, decodeScheduleChange, decodeScheduleRecord, foldScheduleEvents, isRecurringScheduleRecord, normalizeWeekdays, parseCronInput, parseWeeklyInput, renderReminderFraming, renderRecurringReminderBatchFraming, resolveEveryOccurrence, resolveDailyOccurrence, resolveWeeklyOccurrence, resolveCronOccurrence, resolveRecurringOccurrence, scheduleTitle, scheduleView, weeklyTime, } from './domain.ts';
declare module '@deepseek-ai/cordis' {
    interface Context {
        /** Durable Host-wide reminder management. */
        schedule: ScheduleService;
    }
}
/** Configuration for the Host Schedule domain. */
export interface Config {
    /**
     * Delivery-history window retained per task, in days; omission defaults to 30.
     * Pruning happens when an acknowledgment is appended, and `lastDelivery` is always retained.
     */
    deliveryHistoryDays?: number;
    /**
     * Retained delivery records per task; omission defaults to 200. The older of this
     * cap and the window wins, and the newest records survive.
     */
    deliveryHistoryRecords?: number;
}
/**
 * Shared management service; reads, deletion, and timing edits never activate a Session.
 *
 * `sessionPersistence` is a load-order requirement rather than a directly called
 * service: a delivery commits only when `ctx.sessions.flush()` reports that a
 * `session/flush` listener participated, and the persistence backend providing this
 * service is the plugin that registers that listener.
 */
export declare class ScheduleService extends TypertRemoteService {
    static inject: string[];
    static Config: z<Config>;
    /** Resolved retention bounds shared with the runtime that appends acknowledgments. */
    private readonly retention;
    private readonly ready;
    private readonly initialized;
    private chain;
    private runtime;
    private stopping;
    /**
     * @param ctx - Host services owning storage, dispatch, and Session restoration.
     * @param config - Validated retention configuration for delivery history.
     */
    constructor(ctx: Context, config: Config);
    [Service.init](): Promise<void>;
    /**
     * Create a reminder bound to the caller-selected Session without activating it.
     *
     * The request must supply a title; a missing, blank-after-trim, or over-long
     * title rejects with `invalid_prompt` instead of deriving one from the prompt.
     * A Session a delegated child owns rejects with `subagent_session`, because delivery
     * can never reach it: the child is one whose delegation depth is above zero.
     * The record is built from the clock reading taken before the request joins the
     * serialized queue, so a create that waits behind a longer operation keeps its
     * request-time anchor and may already be due when the queue reaches it.
     * @param sessionId - Original Session receiving the reminder.
     * @param request - Validated tool selector, required title, and reminder content.
     * @param signal - Optional cancellation checked before persistence begins, including after FIFO waits.
     * @returns The durably stored schedule. Cancellation does not roll back an in-flight write.
     */
    create(sessionId: SessionId, request: ScheduleCreateRequest, signal?: AbortSignal): Promise<ScheduleRecord>;
    /**
     * Read the selected Session's active tasks without resuming its Agent.
     * @param request - Session whose task list is requested.
     * @returns Persisted reminders in storage order.
     */
    list(request: ScheduleListRequest): Promise<ScheduleRecord[]>;
    /**
     * Read all active and inactive Host reminders with their original Session bindings.
     * A deleted reminder has no row, so it is absent here.
     * Does not activate Sessions or read Session history.
     * @returns Reminders ordered by scheduledAt ascending, then lexicographically by id.
     */
    catalog(): Promise<ScheduleCatalogEntry[]>;
    /**
     * Read saved inbox deliveries without activating or reading the original Session.
     * The task's own row supplies its binding, so its records stay readable through this lookup.
     * @param request - Session binding, task identity, explicit limit, and optional exclusive message cursor.
     * @returns Newest-first deliveries in append order, or a task/cursor lookup failure.
     * @throws ScheduleInputError when limit is not a safe integer from 1 through 100.
     */
    history(request: ScheduleDeliveryHistoryRequest): Promise<ScheduleDeliveryHistoryResult>;
    /**
     * Delete one task belonging to the selected Session, leaving queued messages intact.
     *
     * The row is removed: the task no longer schedules, leaves `list` and `catalog`, and its
     * saved delivery records go with it. A task bound to a Session a delegated child owns
     * stays deletable even though creation and timing edits refuse that binding, so a task
     * stored before that rule existed remains removable.
     * @param request - Session and exact task identity.
     * @param signal - Optional cancellation checked before persistence begins, including after FIFO waits.
     * @returns Whether that Session owned a deleted task. Cancellation does not roll back an in-flight write.
     */
    delete(request: ScheduleDeleteRequest, signal?: AbortSignal): Promise<ScheduleDeleteResult>;
    /**
     * Update the name, instruction, and timing of an active task within the original Session
     * binding without activating the Session or changing saved deliveries.
     *
     * Each supplied field replaces its stored value; an omitted field keeps it. A name or
     * instruction change alone does not reset the committed target. A Session a delegated
     * child owns returns the non-mutating `subagent_session` result, so an edit cannot
     * re-arm a task bound to a Session delivery can never reach, and the Web editor can
     * explain the refusal through the ordinary result it already renders.
     * @param request - Task binding, complete observed record, and any combination of timing, name, and instruction.
     * @param signal - Cancellation checked after domain readiness and FIFO waits, before persistence begins.
     * @returns The committed record, unchanged record for a no-op, or a non-mutating input/lookup/conflict/refusal result.
     * Storage and lifecycle failures reject; cancellation after a write starts does not roll it back.
     */
    update(request: ScheduleUpdateRequest, signal?: AbortSignal): Promise<ScheduleUpdateResult>;
    /**
     * Dispatch one post-commit `schedule/changed` notification, containing
     * synchronous listener failures: every call site emits only after its durable
     * task write landed, so a throwing listener must not reject the caller or
     * skip the following `requestDrive()`.
     */
    private emitChanged;
    private getDomain;
    /**
     * Refuse a Session no delivery can reach because a delegated child owns it.
     *
     * Delivery resolves the bound Session through `ctx.sessionController.resolveAgent`,
     * which rejects the live Agent of a delegated child; a stored task for such a Session
     * would stay permanently overdue and retry on every drive. Both operations that can
     * arm a delivery read that same fact here instead of restating it: a delegated child
     * is one whose {@link delegationDepthOf} is above zero, the accounting the delegation
     * cap itself enforces, which survives a cold resume through the persisted header.
     * @param sessionId - Session the task would be bound to.
     * @returns The stable refusal for a delegated child's Session, or undefined when the Session is eligible.
     */
    private reminderTargetRefusal;
    /**
     * Remove every active task stored for one Session, inside the queue the tools
     * use.
     *
     * Enumerating and deleting in one queue slot is what makes an archive stop
     * ordered behind a create whose write is still in flight: a stop that read the
     * table outside the queue could miss a row the create was about to commit and
     * leave an armed reminder behind. Re-entering the public `delete()` from here
     * would deadlock on this queue, so the rows are removed directly.
     * @param sessionId - Session whose active Host tasks must stop.
     */
    private stopSessionTasks;
    private serialize;
}
export default ScheduleService;
//# sourceMappingURL=index.d.ts.map