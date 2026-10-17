/**
 * Pure card model for one `schedule_create` call in the Session transcript.
 *
 * The tool's model-facing result is its canonical task value serialized as
 * JSON (`renderValue`), so the created task's identity and rule are read from
 * that text. Presentation runs while a call streams and again on Session-log
 * replay of arbitrary logged arguments, so every step narrows wire JSON and
 * returns empty rather than throwing.
 */
import type { ScheduleRecord } from '@deepseek-ai/dsh-schedule/client';
import type { ToolCallViewProps } from '@deepseek-ai/dsh-client-ui-tool/client';
/** One Tool call block as the card receives it: a running call or a settled result. */
type ToolBlock = ToolCallViewProps['block'];
/** Derived presentation of one `schedule_create` call. */
export interface ScheduleCreateCardModel {
    /** Created task narrowed from the settled result, or undefined when the result carries none. */
    readonly task: ScheduleRecord | undefined;
    /** Single-line task title from the result, the call arguments, or the wire tool name. */
    readonly title: string;
    /** Raw model-facing result text of a settled call, when it is one text block. */
    readonly output: string | null;
}
/**
 * Narrow one opaque value to a complete Schedule rule.
 *
 * The value arrives from replayed wire JSON, so each rule kind is checked for
 * the fields `formatScheduleFrequency` reads. A missing identity or an
 * incomplete rule returns undefined and the card renders without a task.
 *
 * The result JSON normally carries the stored title. A result recorded before
 * that field existed carries none, so this narrowing derives the display title
 * from the instruction's first line; when the instruction has no such line it
 * returns undefined.
 * @param value - opaque value parsed from logged JSON.
 * @returns the narrowed rule, or undefined when it is not a complete task.
 */
export declare function narrowScheduleRecord(value: unknown): ScheduleRecord | undefined;
/**
 * Derive the transcript card of one `schedule_create` call.
 * @param block - raw call or result block carried by the Session journal.
 * @param toolName - wire Tool name, used when no task title is available.
 * @returns the created task, its title, and the settled result text.
 */
export declare function scheduleCreateCardModel(block: ToolBlock, toolName: string): ScheduleCreateCardModel;
export {};
//# sourceMappingURL=schedule-create-card.d.ts.map