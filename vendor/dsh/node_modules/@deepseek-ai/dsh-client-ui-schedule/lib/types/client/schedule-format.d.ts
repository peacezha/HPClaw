/** Browser-safe formatting shared by Session and Host reminder catalogs. */
import type { Translate } from '@deepseek-ai/dsh-client-ui-slots';
import type { ScheduleRecord } from '@deepseek-ai/dsh-schedule/client';
import type { CronDescriptionKey } from './task-cron.ts';
type TimeUnit = 'day' | 'hour' | 'minute' | 'second';
type UnitKey = `unit.${TimeUnit}.${'one' | 'other'}`;
type WeekdayKey = `frequency.weekday.${1 | 2 | 3 | 4 | 5 | 6 | 7}`;
/** Dictionary keys required to display exact reminder frequencies. */
export type FrequencyKey = 'time.locale' | 'time.utcPrefix' | 'frequency.once' | 'frequency.every' | 'frequency.daily' | 'frequency.dailyLocal' | 'frequency.weekly' | 'frequency.weeklyLocal' | 'frequency.cron' | 'frequency.cronLocal' | 'frequency.cronRule' | 'frequency.weekday.join' | WeekdayKey | UnitKey | CronDescriptionKey;
/** Namespace-independent translator for reminder frequencies and time units. */
export type FrequencyTranslator = Translate<FrequencyKey>;
/** Dictionary keys required to localize a zone and mark the host's zone. */
export type ZoneLabelKey = 'time.locale' | 'time.utcPrefix' | 'rule.zone.system';
type ZoneLocaleKey = Extract<ZoneLabelKey, 'time.locale' | 'time.utcPrefix'>;
/** Universal fallback when a runtime cannot enumerate its ICU time-zone data. */
export declare const FALLBACK_ZONES: readonly ["UTC"];
/** Host-zone context a frequency line uses to omit or name a rule's stored zone. */
export interface FrequencyZone {
    /** Host's current IANA zone; a rule storing this zone shows no zone. */
    readonly system: string;
    /** ICU-localized name and offset of one zone. */
    readonly label: (zone: string) => string;
}
/** Dictionary keys required to display relative reminder targets. */
export type RelativeTimeKey = UnitKey | 'relative.now' | 'relative.future' | 'relative.overdue';
/**
 * Name one task from its stored title.
 *
 * Every decoded Host record and catalog entry carries a title that is non-empty
 * after trimming, so no name is derived from the instruction here. The
 * `schedule_create` card derives one only for a result read from a Session log
 * written before the stored field existed.
 * @param record - task being named.
 * @returns the stored title.
 */
export declare function taskName(record: ScheduleRecord): string;
/**
 * Render the stored ISO weekday set with localized names joined in locale order.
 * @param weekdays - Stored unique ascending ISO weekdays.
 * @param t - frequency, join, and unit translations.
 * @returns Localized weekday list, for example `Mon, Wed`.
 */
export declare function formatWeekdays(weekdays: readonly number[], t: FrequencyTranslator): string;
/**
 * Localize one IANA zone through the runtime's ICU/CLDR data, prefixed by its
 * current UTC offset. The raw IANA id remains internal unless ICU cannot name
 * a valid stored alias.
 * @param zone - IANA zone to label.
 * @param t - translate providing the active ICU locale.
 * @param at - instant used to resolve the current UTC offset and zone name.
 * @returns the UTC offset and localized zone name.
 */
export declare function zoneLabel(zone: string, t: Translate<ZoneLocaleKey>, at?: number): string;
/**
 * Name one zone and mark it when it is the host's own zone.
 * @param zone - IANA zone to name.
 * @param system - the host's current IANA zone.
 * @param t - translate providing the active ICU locale and system suffix.
 * @param at - instant used to resolve the current UTC offset and zone name.
 * @returns UTC offset and localized zone name, with the system suffix when applicable.
 */
export declare function zoneName(zone: string, system: string, t: Translate<ZoneLabelKey>, at?: number): string;
/**
 * Zones the time-zone menu offers, in menu order: the host's current zone,
 * followed by the runtime's IANA inventory ordered by current UTC offset and
 * canonical id, including a stored alias the inventory omits.
 *
 * `Intl.supportedValuesOf('timeZone')` supplies the inventory, so an engine
 * that can enumerate zones offers all of them. When enumeration is unavailable,
 * the menu falls back to the host zone, UTC, and any stored zone, so it is never
 * empty. A stored zone outside the inventory is appended,
 * so an accepted alias never disappears from the menu.
 * @param stored - zone the shown rule stores.
 * @param system - the host's current IANA zone.
 * @param at - instant used to order zones by their current UTC offset.
 * @returns IANA zones in menu order, de-duplicated.
 */
export declare function zoneChoices(stored: string, system: string, at?: number): readonly string[];
/**
 * IANA zone a record's stored wall-clock rule interprets its time in.
 *
 * Daily, weekly, and cron records store an explicit zone. One-shot `at` and
 * `after` records, and fixed-interval `every` records, store only the UTC
 * instant, so they have no rule zone and their displayed time uses the browser zone.
 * @param record - reminder whose kind determines whether a zone is stored.
 * @returns the stored IANA zone, or undefined when the record stores none.
 */
export declare function recordTimeZone(record: ScheduleRecord): string | undefined;
/**
 * Format exact intervals or wall-clock rules without changing their precision or zone.
 *
 * A cron rule reads as the sentence `cronPreview` derives from its expression,
 * for example `Every day at 09:00, 15:00`. An expression this parser cannot
 * read keeps the raw `Cron {expression}` form, so the stored rule stays visible
 * when the Host's dialect and this parser diverge.
 * @param record - reminder whose kind and stored rule determine its frequency.
 * @param t - frequency, weekday, and unit translations, independent of the catalog namespace.
 * @param zone - host-zone context; when present, a stored zone equal to `zone.system` is omitted
 * and another zone is named by `zone.label`. Without it ICU localizes the stored zone.
 * @returns localized one-shot, fixed-interval, daily, weekly, or cron time-and-zone text.
 */
export declare function formatScheduleFrequency(record: ScheduleRecord, t: FrequencyTranslator, zone?: FrequencyZone): string;
/**
 * Format one target instant as a localized month-and-day date with its time, the
 * form the mock's task list shows and the same `Intl` field pair the universal
 * cards use.
 *
 * The month is a locale-owned name, not a zero-padded number: `en` renders
 * `Dec 31, 9:00 AM` and `zh-CN` renders `12月31日 09:00`, so neither locale can
 * produce a `12-31` string. The year appears only when the instant falls outside
 * the current year in the displayed zone, so a same-year target or delivery
 * stays compact while an older record still dates itself.
 *
 * `timeZone` carries the rule's own zone for a daily, weekly, or cron record, so
 * its occurrence reads in the task's zone. A one-shot `at` or `after` record
 * stores only the UTC instant, so callers pass no zone and it formats in the
 * browser zone.
 * @param scheduledAt - durable UTC target.
 * @param locale - BCP-47 locale owning the month name, day order, and clock.
 * @param timeZone - IANA zone of the task's own rule, or undefined for the browser zone.
 * @returns the localized month, day, and time, with the year when it is not the
 * current one, or the raw instant when the value cannot be parsed.
 */
export declare function formatScheduleNextRun(scheduledAt: string, locale: string, timeZone?: string): string;
/**
 * Format one target as an absolute time in this device's zone.
 *
 * A task whose stored rule names its own zone still shows its next run in the
 * reader's zone: the instant is the same one, and the reader compares it with
 * their own clock. The locale owns the month name, the field order, and the
 * separators, so the stamp reads `Sep 19, 2026, 15:51` in English and
 * `9月19日 15:51` in Chinese.
 *
 * Whether a bare date reads the year is a per-language typographic choice, and
 * the languages the design pins are stated in {@link YEAR_LANGUAGES} and
 * {@link NO_YEAR_LANGUAGES}. Every language not listed there states the year:
 * dropping it silently would hide the year of a target that can sit months or a
 * year away, which is worse than one field more than the reader needs.
 * @param scheduledAt - durable UTC target.
 * @param locale - BCP-47 locale owning the month name, field order, and clock.
 * @returns the localized absolute next run in the device zone, or the raw instant when it cannot be parsed.
 */
export declare function formatScheduleAbsolute(scheduledAt: string, locale: string): string;
/**
 * One next-run line as its two texts: the device-zone stamp and the distance.
 *
 * The list rows, the detail, the Session-header catalog, and the Sidebar hover
 * card all state this pair, so they take it from here instead of each composing
 * it: the stamp follows the language through `formatScheduleAbsolute`, and the
 * distance stays the reader's countdown.
 * @param scheduledAt - durable UTC target.
 * @param locale - BCP-47 locale owning the month name, field order, and clock.
 * @param now - current epoch milliseconds.
 * @param t - relative-time and unit translations.
 * @returns the absolute stamp, and the same distance wrapped in parentheses.
 */
export declare function nextRunParts(scheduledAt: string, locale: string, now: number, t: Translate<RelativeTimeKey>): {
    readonly absolute: string;
    readonly relative: string;
};
/**
 * Format a relative target using the largest natural clock unit.
 * @param scheduledAt - durable UTC target.
 * @param now - current epoch milliseconds.
 * @param t - relative-time and unit translations.
 * @returns localized future, overdue, or due-now label.
 */
export declare function formatScheduleRelative(scheduledAt: string, now: number, t: Translate<RelativeTimeKey>): string;
/**
 * Order overdue records first and future records by ascending target time.
 * @param records - reminders to order without mutating the input.
 * @param now - current epoch milliseconds used to identify overdue targets.
 * @returns sorted copy preserving input order for equal targets.
 */
export declare function orderScheduleRecords(records: readonly ScheduleRecord[], now: number): ScheduleRecord[];
export {};
//# sourceMappingURL=schedule-format.d.ts.map