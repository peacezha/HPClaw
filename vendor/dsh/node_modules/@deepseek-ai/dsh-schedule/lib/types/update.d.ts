import type { ScheduleRecord, ScheduleTimingChange, ScheduleUpdateContent, ScheduleUpdateResult } from './types.ts';
/**
 * Title one update must either keep or replace.
 *
 * A decoded record always carries a stored title. A record value without a
 * valid one is refused with the durable decode error instead of deriving a name.
 * @param record - Current active Host record.
 * @returns The stored title; a missing, blank, untrimmed, or over-long title throws ScheduleLogError.
 */
export declare function retainedTitle(record: ScheduleRecord): string;
/**
 * Compare the complete observed record and resolve one name, instruction, and timing update
 * using a single queue-time sample.
 *
 * An omitted change, name, or instruction keeps the stored value. A supplied name or
 * instruction never re-anchors the schedule on its own; an equivalent normalized timing
 * change keeps the committed target too.
 * @param current - Current active Host record.
 * @param expected - Untrusted complete record observed by the caller.
 * @param change - Strict timing selector, whose kind may differ from the current record's kind, or undefined to keep timing.
 * @param now - Single wall-clock sample from the accepted FIFO slot.
 * @param content - Untrusted replacement name and instruction; each omitted field keeps its stored value.
 * @returns Current/new record or a bounded input/conflict result; unrelated failures throw.
 */
export declare function resolveScheduleUpdate(current: ScheduleRecord, expected: ScheduleRecord, change: ScheduleTimingChange | undefined, now: number, content?: ScheduleUpdateContent): ScheduleUpdateResult;
//# sourceMappingURL=update.d.ts.map