import type { Translate } from '@deepseek-ai/dsh-client-ui-slots';
/** ISO weekday dictionary key naming one cron day-of-week value. */
type CronWeekdayKey = `frequency.weekday.${1 | 2 | 3 | 4 | 5 | 6 | 7}`;
/** Dictionary keys the cron description renders. */
export type CronDescriptionKey = CronWeekdayKey | 'cron.list.join' | 'cron.part.join' | 'cron.weekday.name' | 'cron.weekday.range' | 'cron.months' | 'cron.day.every' | 'cron.day.weekdays' | 'cron.day.monthDays' | 'cron.day.both' | 'cron.day.bothStarred' | 'cron.hours.range' | 'cron.hours.list' | 'cron.time.everyMinute' | 'cron.time.everyMinutes' | 'cron.time.joinedEveryMinute' | 'cron.time.joinedEveryMinutes' | 'cron.time.everyHour' | 'cron.time.joinedEveryHour' | 'cron.time.everyNHours' | 'cron.time.joinedEveryNHours' | 'cron.time.hourlyAt' | 'cron.time.joinedHourlyAt' | 'cron.time.hoursEveryMinute' | 'cron.time.hoursEveryMinutes' | 'cron.time.at' | 'cron.time.hoursAt';
/** Namespace-independent translator for the cron description. */
export type CronDescriptionTranslator = Translate<CronDescriptionKey>;
/** One parsed cron field: its matched values, its Vixie star flag, and its coverage. */
export interface CronField {
    /** Unique ascending matched values; Sunday 7 is folded onto 0. */
    readonly values: readonly number[];
    /**
     * Whether the field text starts with `*`, which is Vixie's `DOM_STAR`/`DOW_STAR`
     * test the Host applies: a stepped star such as `*​/2` counts, while a full range
     * written out (`1-31`) does not.
     */
    readonly starred: boolean;
    /** Whether the matched set is every value the field can take. */
    readonly full: boolean;
    /** Whether the field is a star field that matches every value. */
    readonly unrestricted: boolean;
}
/** One parsed five-field cron expression in evaluation order. */
export interface ParsedCron {
    /** Unique ascending matched minutes. */
    readonly minutes: CronField;
    /** Unique ascending matched hours. */
    readonly hours: CronField;
    /** Unique ascending matched days of the month. */
    readonly daysOfMonth: CronField;
    /** Unique ascending matched months. */
    readonly months: CronField;
    /** Unique ascending matched cron weekdays, Sunday 0 through Saturday 6. */
    readonly daysOfWeek: CronField;
}
/**
 * Parse one five-field cron expression in the dialect the Host accepts.
 * @param expression - candidate `minute hour day-of-month month day-of-week` text.
 * @returns parsed fields, or undefined when the Host would reject the expression.
 */
export declare function parseCronExpression(expression: string): ParsedCron | undefined;
/**
 * Describe one parsed cron expression as one localized sentence.
 * @param parsed - parsed cron expression.
 * @param t - cron translations.
 * @param locale - active UI locale naming restricted months.
 * @returns localized sentence, for example `Mon–Fri at 09:00` or `Every 15 minutes`.
 */
export declare function cronPreview(parsed: ParsedCron, t: CronDescriptionTranslator, locale: string): string;
/** One structured cron shape the Run time card's builder edits as rows. */
export type CronBuilderState = {
    /** Runs every `step` minutes of every hour and day. */
    readonly kind: 'minutely';
    /** Whole minutes between runs, 1 through 59. */
    readonly step: number;
} | {
    /** Runs at one minute of every `step` hours, every day. */
    readonly kind: 'hourly';
    /** Whole hours between runs, 1 through 23. */
    readonly step: number;
    /** Minute of each matched hour, 0 through 59. */
    readonly minute: number;
} | {
    /** Runs once a day at one wall-clock time. */
    readonly kind: 'daily';
    /** Hour of that time, 0 through 23. */
    readonly hour: number;
    /** Minute of that hour, 0 through 59. */
    readonly minute: number;
} | {
    /** Runs on chosen weekdays at one wall-clock time. */
    readonly kind: 'weekly';
    /** ISO weekdays, Monday 1 through Sunday 7; never empty. */
    readonly weekdays: readonly number[];
    /** Hour of that time, 0 through 23. */
    readonly hour: number;
    /** Minute of that hour, 0 through 59. */
    readonly minute: number;
} | {
    /** Runs on chosen days of every month at one wall-clock time. */
    readonly kind: 'monthly';
    /** Days of the month, 1 through 31, ascending; never empty. */
    readonly days: readonly number[];
    /** Hour of that time, 0 through 23. */
    readonly hour: number;
    /** Minute of that hour, 0 through 59. */
    readonly minute: number;
};
/**
 * Recognize the structured shape one parsed expression states, when one does.
 *
 * Every shape requires an unrestricted month. Exactly one of the two day fields
 * may restrict: a restricted weekday beside a star day-of-month is a weekly
 * rule, a restricted day-of-month beside a star weekday is a monthly rule, and
 * both restricting is unrecognized because each restriction matches
 * independently under the Host's Vixie union rule. Only a literal star states a
 * day field with no restriction: a written-out full set such as `0-6` or `1-31`
 * stays a weekly or monthly rule with every value selected, so toggling the
 * last pill on never collapses its row. Stepped shapes accept any uniform
 * full-range step on the clock, spelled with a star or written out, since both
 * match the same minutes or hours.
 * @param parsed - parsed cron expression.
 * @returns the shape the builder can edit, or undefined for the raw-expression fallback.
 */
export declare function recognizeCronShape(parsed: ParsedCron): CronBuilderState | undefined;
/**
 * Spell one builder shape as the five-field expression a save submits.
 *
 * `recognizeCronShape` recognizes every expression this returns as the same
 * shape, so a builder edit never falls back to the raw-expression row.
 * @param state - builder shape to spell.
 * @returns the expression stating that shape.
 */
export declare function cronShapeExpression(state: CronBuilderState): string;
export {};
//# sourceMappingURL=task-cron.d.ts.map