/**
 * Strict Schedule decoding, replay, time validation, and framing.
 * @module @deepseek-ai/dsh-schedule
 */
import { Temporal } from '@js-temporal/polyfill';
import type { SessionEvent, SessionLogOffset as SessionLogOffsetType } from '@deepseek-ai/dsh-session';
import type { AfterScheduleRecord, AtInput, AtScheduleRecord, EveryScheduleRecord, CronInput, CronScheduleRecord, DailyInput, DailyScheduleRecord, WeeklyInput, WeeklyScheduleRecord, LegacyScheduleRecord, RecurringScheduleRecord, OneShotScheduleRecord, ScheduleChange, ScheduleId as ScheduleIdType, ScheduleRecord, ScheduleView } from './types.ts';
/** Durable Schedule protocol version implemented by this package. */
export declare const SCHEDULE_CHANGE_VERSION: 1;
/** Fixed v1 lower bound for a fixed-rate reminder. */
export declare const MIN_EVERY_INTERVAL_SECONDS = 60;
/** Fixed v1 upper bound for a stored task title. */
export declare const MAX_TITLE_LENGTH = 120;
/**
 * Longest forward or backward walk of the cron date search, in years.
 *
 * The proleptic Gregorian leap-year and weekday alignment repeats every 400
 * years, so a rule that matches any local date has a match within this window;
 * walking further can only reach a rule that never matches. Bounding the walk
 * keeps a valid but unsatisfiable rule's creation and decision cost fixed
 * instead of enumerating candidate dates toward the four-digit-year ceiling.
 */
export declare const CRON_SEARCH_HORIZON_YEARS = 400;
/** Error from malformed or transition-invalid durable Schedule data. */
export declare class ScheduleLogError extends Error {
    /** Stable machine-readable error code. */
    readonly code: "corrupt_schedule_log";
    /**
     * Construct a durable-log failure.
     * @param message - Package-specific violated invariant.
     */
    constructor(message: string);
}
/** Error from a model-supplied Schedule rule or target Session that cannot become a record. */
export declare class ScheduleInputError extends Error {
    /** Stable public Schedule input code. */
    readonly code: 'invalid_prompt' | 'invalid_selector' | 'invalid_rule' | 'invalid_time_zone' | 'not_future' | 'time_out_of_range' | 'frequency_too_high' | 'subagent_session';
    /**
     * Construct a stable input failure.
     * @param code - Public Schedule error discriminator.
     * @param message - Stable public diagnostic.
     * @param options - Optional contained implementation cause.
     */
    constructor(code: 'invalid_prompt' | 'invalid_selector' | 'invalid_rule' | 'invalid_time_zone' | 'not_future' | 'time_out_of_range' | 'frequency_too_high' | 'subagent_session', message: string, options?: ErrorOptions);
}
/** Pure replay result, retaining active create order and every used id. */
export interface FoldedSchedules {
    /** Active records in their original create order. */
    readonly active: readonly LegacyScheduleRecord[];
    /** Every id ever created in this session-local suffix. */
    readonly seenIds: readonly ScheduleIdType[];
}
/** One latest-only recurring decision derived without enumerating a backlog. */
export interface RecurringOccurrence {
    /** Latest occurrence due at the decision time. */
    readonly occurrenceAt: string;
    /** First eligible target after the decision, or exhaustion. */
    readonly nextScheduledAt?: string;
}
/**
 * Brand a raw session-local id without changing its runtime value.
 * @param value - Raw session-local id.
 * @returns The same string with the Schedule brand.
 */
export declare function ScheduleId(value: string): ScheduleIdType;
/** Stable diagnostic for a title that is missing or empty after trimming. */
export declare const REQUIRED_TITLE_MESSAGE = "title is required and must be non-empty after trimming.";
/**
 * Validate the title supplied at creation.
 *
 * Creation requires an explicit title: a missing, blank-after-trim, or over-long
 * value throws instead of deriving a name from the instruction.
 * @param title - Task name supplied at creation.
 * @returns The trimmed title; an invalid title throws ScheduleInputError.
 */
export declare function scheduleTitle(title: string): string;
/**
 * Validate one required stored title at the durable boundary.
 *
 * Only records written after titles became required are read: a missing,
 * blank-after-trim, untrimmed, or over-long stored title is invalid, and no name
 * is derived from the instruction.
 * @param value - Untrusted durable title field.
 * @returns The stored title; an invalid title throws ScheduleLogError.
 */
export declare function decodeStoredTitle(value: unknown): string;
/**
 * Validate and canonicalize one raw IANA time-zone selector.
 * @param value - Candidate `UTC` or IANA Area/Location name.
 * @returns The runtime's canonical IANA name.
 */
export declare function canonicalizeTimeZone(value: string): string;
/**
 * Parse one strict local clock time accepted by the weekly selector.
 * @param value - Candidate `HH:mm:ss` time with optional one-to-three fractional digits.
 * @returns The parsed plain time; malformed input throws ScheduleInputError.
 */
export declare function weeklyTime(value: string): Temporal.PlainTime;
/**
 * Normalize the explicit ISO weekday set of one weekly rule.
 * @param weekdays - Untrusted candidate weekday values.
 * @returns Frozen unique ascending weekdays from 1 (Monday) through 7 (Sunday).
 */
export declare function normalizeWeekdays(weekdays: unknown): number[];
/**
 * Decode a current Host task record, preserving its committed target and stored zone spelling.
 *
 * Every variant of a stored Host task carries its title, so the historical
 * one-shot variants are re-checked for that member after their shape decodes.
 * @param value - Untrusted durable JSON record.
 * @returns Detached frozen record; malformed fields throw ScheduleLogError.
 */
export declare function decodeScheduleRecord(value: unknown): ScheduleRecord;
/**
 * Decode one strict version-1 `schedule/change` payload.
 * @param value - Untrusted durable JSON value.
 * @returns Detached, frozen Schedule change.
 */
export declare function decodeScheduleChange(value: unknown): ScheduleChange;
/** Timing fields one fixed-rate decision needs from its record. */
type EveryOccurrenceInput = Pick<EveryScheduleRecord, 'everySeconds' | 'scheduledAt'>;
/**
 * Resolve one fixed-rate decision without enumerating missed occurrences.
 * @param record - Active record whose target is the earliest unaccepted occurrence.
 * @param acceptedAt - Wall-clock decision time in epoch milliseconds.
 * @returns The latest due occurrence and first strictly future target, if representable.
 */
export declare function resolveEveryOccurrence(record: EveryOccurrenceInput, acceptedAt: number): RecurringOccurrence;
/**
 * Resolve a daily decision near the decision's local date, not across its missed history.
 * @param record - Daily rule with a committed earliest unaccepted UTC target.
 * @param acceptedAt - Explicit wall-clock decision time, at or after the committed target.
 * @returns Latest actual due occurrence and the next future occurrence on a later local date.
 */
export declare function resolveDailyOccurrence(record: DailyScheduleRecord, acceptedAt: number): RecurringOccurrence;
/**
 * Resolve a weekly decision near the decision's local date, not across its missed history.
 * @param record - Weekly rule with a committed earliest unaccepted UTC target.
 * @param acceptedAt - Explicit wall-clock decision time, at or after the committed target.
 * @returns Latest actual due occurrence and the next future occurrence on a selected weekday.
 */
export declare function resolveWeeklyOccurrence(record: WeeklyScheduleRecord, acceptedAt: number): RecurringOccurrence;
/**
 * Resolve a cron decision near the decision's local date, not across its missed history.
 * @param record - Cron rule with a committed earliest unaccepted UTC target.
 * @param acceptedAt - Explicit wall-clock decision time, at or after the committed target.
 * @returns Latest actual due occurrence and the first future occurrence.
 */
export declare function resolveCronOccurrence(record: CronScheduleRecord, acceptedAt: number): RecurringOccurrence;
/**
 * Identify recurring Host records explicitly, excluding both one-shot variants.
 * @param record - Current Host schedule record.
 * @returns Whether the record uses a recurring rule.
 */
export declare function isRecurringScheduleRecord(record: ScheduleRecord): record is RecurringScheduleRecord;
/**
 * Resolve one due recurring Host record with its rule-specific calendar or interval arithmetic.
 * @param record - Due recurring rule.
 * @param acceptedAt - Explicit decision time in epoch milliseconds.
 * @returns Latest due occurrence and optional future target.
 */
export declare function resolveRecurringOccurrence(record: RecurringScheduleRecord, acceptedAt: number): RecurringOccurrence;
/**
 * Apply already-decoded Schedule changes to one complete fold value.
 *
 * The transition authority for full-log replay. One mutable Map/Set pair spans
 * the whole batch; the returned arrays are materialized and frozen once.
 * @param folded - complete active records and used-id history before the changes.
 * @param changes - strictly decoded durable mutations in log order.
 * @returns the complete fold value after every mutation.
 */
export declare function applyScheduleChanges(folded: FoldedSchedules, changes: Iterable<ScheduleChange>): FoldedSchedules;
/**
 * Fold the package-owned stream after the durable fork seed boundary.
 * @param events - Complete ordered session log or candidate-extended log.
 * @param inheritedEventCount - Inherited prefix length excluded from child ownership.
 * @returns Active records and all previously used ids.
 */
export declare function foldScheduleEvents(events: readonly SessionEvent[], inheritedEventCount?: SessionLogOffsetType): FoldedSchedules;
/**
 * Allocate the next readable id without reusing any prior session-local id.
 * @param folded - Fold containing every previously created id.
 * @returns A fresh `schedule-N` identity.
 */
export declare function allocateScheduleId(folded: FoldedSchedules): ScheduleIdType;
/**
 * Validate a model after rule and compute its durable target.
 * @param id - Already allocated task id.
 * @param prompt - Reminder content supplied at creation.
 * @param afterSeconds - Requested positive delay.
 * @param now - Single rule-acceptance wall-clock sample in epoch milliseconds.
 * @param title - Required task name supplied at creation.
 * @returns Frozen durable after record.
 */
export declare function createAfterScheduleRecord(id: ScheduleIdType, prompt: string, afterSeconds: number, now: number, title: string): AfterScheduleRecord;
/**
 * Validate an absolute selector and compute its sole durable UTC target.
 * @param id - Already allocated task id.
 * @param prompt - Reminder content supplied at creation.
 * @param at - Explicit-offset instant or structured local calendar value.
 * @param now - Single rule-acceptance wall-clock sample in epoch milliseconds.
 * @param title - Required task name supplied at creation.
 * @returns Frozen durable absolute one-shot record.
 */
export declare function createAtScheduleRecord(id: ScheduleIdType, prompt: string, at: AtInput, now: number, title: string): AtScheduleRecord;
/**
 * Parse an absolute selector without requiring it to be future.
 * @param at - Explicit-offset instant or strict local calendar input.
 * @returns Resolved epoch milliseconds; malformed input throws ScheduleInputError.
 */
export declare function parseAtInput(at: AtInput): number;
/**
 * Validate a fixed-rate selector and compute the first target of a new interval anchor.
 * @param id - Already allocated task id.
 * @param prompt - Reminder content supplied at creation.
 * @param everySeconds - Requested fixed safe-integer interval.
 * @param now - Single rule-acceptance wall-clock sample in epoch milliseconds.
 * @param title - Required task name supplied at creation.
 * @returns Frozen durable fixed-rate record.
 */
export declare function createEveryScheduleRecord(id: ScheduleIdType, prompt: string, everySeconds: number, now: number, title: string): EveryScheduleRecord;
/**
 * Create a daily wall-clock rule with a strictly future committed UTC target.
 * @param id - Already allocated task identity.
 * @param prompt - Reminder content supplied at creation.
 * @param daily - Strict local time and explicit IANA zone.
 * @param now - Single rule-acceptance wall-clock sample in epoch milliseconds.
 * @param title - Required task name supplied at creation.
 * @returns Frozen daily record; absent future dates throw time_out_of_range.
 */
export declare function createDailyScheduleRecord(id: ScheduleIdType, prompt: string, daily: DailyInput, now: number, title: string): DailyScheduleRecord;
/**
 * Normalize a daily selector without calculating a new committed target.
 * @param daily - Strict local time and explicit IANA zone.
 * @returns Normalized time and canonical zone; malformed input throws ScheduleInputError.
 */
export declare function parseDailyInput(daily: DailyInput): {
    readonly time: string;
    readonly timeZone: string;
};
/**
 * Create a weekly wall-clock rule with a strictly future committed UTC target.
 * @param id - Already allocated task identity.
 * @param prompt - Reminder content supplied at creation.
 * @param weekly - Strict local time, explicit IANA zone, and explicit ISO weekday set.
 * @param now - Single rule-acceptance wall-clock sample in epoch milliseconds.
 * @param title - Required task name supplied at creation.
 * @returns Frozen weekly record; absent future weekdays throw time_out_of_range.
 */
export declare function createWeeklyScheduleRecord(id: ScheduleIdType, prompt: string, weekly: WeeklyInput, now: number, title: string): WeeklyScheduleRecord;
/**
 * Create a cron wall-clock rule with a strictly future committed UTC target.
 * @param id - Already allocated task identity.
 * @param prompt - Reminder content supplied at creation.
 * @param cron - Strict five-field expression and explicit IANA zone.
 * @param now - Single rule-acceptance wall-clock sample in epoch milliseconds.
 * @param title - Required task name supplied at creation.
 * @returns Frozen cron record; absent future occurrences throw time_out_of_range.
 */
export declare function createCronScheduleRecord(id: ScheduleIdType, prompt: string, cron: CronInput, now: number, title: string): CronScheduleRecord;
/**
 * Normalize a weekly selector without calculating a new committed target.
 * @param weekly - Strict local time, explicit IANA zone, and explicit ISO weekday set.
 * @returns Normalized time, canonical zone, and unique ascending weekdays; malformed input throws ScheduleInputError.
 */
export declare function parseWeeklyInput(weekly: WeeklyInput): {
    readonly time: string;
    readonly timeZone: string;
    readonly weekdays: number[];
};
/**
 * Canonicalize one strict five-field cron expression.
 * @param expression - Candidate `minute hour day-of-month month day-of-week` expression.
 * @returns The canonical expression; malformed or unsupported input throws ScheduleInputError.
 */
export declare function canonicalizeCronExpression(expression: string): string;
/**
 * Normalize a cron selector without calculating a new committed target.
 * @param cron - Strict five-field expression and explicit IANA zone.
 * @returns The canonical expression and canonical zone; malformed input throws ScheduleInputError.
 */
export declare function parseCronInput(cron: CronInput): {
    readonly expression: string;
    readonly timeZone: string;
};
/**
 * Derive one execution-local management view.
 * @param record - Active durable record.
 * @param now - Wall-clock sample used for its timing state.
 * @returns Complete Host delivery view.
 */
export declare function scheduleView(record: ScheduleRecord, now: number): ScheduleView;
/**
 * Render the fixed model framing for a due reminder.
 * @param record - Due active record.
 * @returns Stable model-visible text with JSON-escaped dynamic fields.
 */
export declare function renderReminderFraming(record: OneShotScheduleRecord): string;
/**
 * Render one recurring reminder batch in the supplied order.
 * @param reminders - Complete admitted batch with one latest occurrence per record.
 * @returns Stable model-visible text whose dynamic payload is canonical JSON.
 */
export declare function renderRecurringReminderBatchFraming(reminders: readonly {
    readonly record: RecurringScheduleRecord;
    readonly occurrenceAt: string;
}[]): string;
export {};
//# sourceMappingURL=domain.d.ts.map