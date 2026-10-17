/**
 * Exact rule snapshots, editable timing fields, the injected task update callback, and Host
 * failure mapping; zone interpretation belongs to the Host.
 */
import type { RemoteResult } from '@deepseek-ai/dsh-api-remotes/client';
import type { ScheduleRecord, ScheduleUpdateRequest, ScheduleUpdateResult } from '@deepseek-ai/dsh-schedule/client';
import type { TaskManagerKey } from './task-manager-locales.ts';
/** Task mutation callback injected by the task catalog owner. */
export interface TaskTimingInjected {
    /**
     * Compare and update the exact task, then refresh the authoritative catalog on success or a stale rule.
     * Catalog read failures remain in catalog state and do not change the persistence result.
     * @param request - Captured task and Session, complete expected record, and the optional
     * replacement name, instruction, and timing change; an omitted `change` keeps the committed target.
     * @returns Original Remote mutation result; transport or storage exceptions may reject.
     */
    readonly onUpdateTiming: (request: ScheduleUpdateRequest) => Promise<RemoteResult<ScheduleUpdateResult>>;
}
/** Native input values retained for one edit session. */
export interface TimingDraft {
    date: string;
    time: string;
    timeZone: string;
    seconds: string;
    expression: string;
}
/**
 * Project only persisted rule fields, excluding catalog metadata and delivery receipts.
 * @param record - Rule from the current catalog.
 * @returns Independent complete expected rule for compare-and-update.
 */
export declare function timingSnapshot(record: ScheduleRecord): ScheduleRecord;
/**
 * The zone a new or switched-to rule starts its clock rows in, and whether that
 * zone came from the stored rule rather than this device.
 *
 * A daily, weekly, or cron record stores the zone its wall clock means, so
 * editing it keeps that zone. A one-shot `at` target and an `after` interval
 * store only the committed instant and no creation zone, so they start in this
 * device's zone.
 * @param record - rule the draft is seeded from.
 * @returns the draft's IANA zone and whether it is the no-stored-zone fallback.
 */
export declare function draftZone(record: ScheduleRecord): {
    zone: string;
    stored: boolean;
};
/**
 * The date and clock one instant names in one zone, keeping millisecond precision.
 *
 * The locale is fixed, so the field order never follows the interface language,
 * and each field is read by name rather than from a formatted string.
 * @param instant - canonical ISO instant.
 * @param zone - IANA zone the returned wall clock is expressed in.
 * @returns `YYYY-MM-DDTHH:MM:SS.mmm` in that zone.
 */
export declare function zonedWallClock(instant: string, zone: string): string;
/**
 * Initialize one-shot inputs in the zone the rule states, or in this device's
 * zone for a rule that stores none.
 *
 * An `at` target stores an instant and no creation zone, so its rows show that
 * instant in the draft's zone: the shown pair names the instant the record
 * already commits rather than restating it in a zone the record does not have.
 * @param record - Expected rule captured when editing starts.
 * @returns Native input values without rounding seconds or milliseconds.
 */
export declare function timingDraft(record: ScheduleRecord): TimingDraft;
/**
 * One date as the rows and pickers expose it.
 *
 * The draft, the calendar's own comparisons, and the text submitted to the Host
 * all stay `YYYY-MM-DD`; only the exposed text takes the slashed form the design
 * states, so no caller has to parse or re-format a date merely to show it.
 * @param date - stored or staged ISO date text.
 * @returns the same date with slashes between its fields.
 */
export declare function slashDate(date: string): string;
/**
 * One clock time at whole-second precision.
 *
 * The rows and the clock picker both show `HH:MM:SS`; an untouched stored value
 * keeps its milliseconds in the draft so a save can submit them back.
 * @param time - stored or staged clock text, with or without fractional seconds.
 * @returns the same clock time at whole-second precision, or the input when it is not a clock time.
 */
export declare function secondPrecision(time: string): string;
/**
 * Localize controlled Host failures without exposing transport or storage diagnostics.
 * @param code - Error code returned by the timing update.
 * @returns Dictionary key describing the recovery action.
 */
export declare function timingError(code: Extract<ScheduleUpdateResult, {
    code: string;
}>['code']): TaskManagerKey;
//# sourceMappingURL=task-timing.d.ts.map