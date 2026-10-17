import type { ConversationNodeDefinition, ToolResultNode, TurnLocation } from '@deepseek-ai/dsh-client-ui-conversation/client';
/** Wire Tool name whose settled result carries one created task. */
export declare const SCHEDULE_CREATE_TOOL = "schedule_create";
/** One settled `schedule_create` result the card renders. */
export type ScheduleCreatedTask = ToolResultNode;
/** Immutable created-task facts published against one Turn. */
export interface ScheduleTurnData {
    readonly created: readonly ScheduleCreatedTask[];
}
declare module '@deepseek-ai/dsh-client-ui-conversation/client' {
    interface ConversationTurnDataMap {
        /** `schedule_create` results settled in this Turn, in settlement order. */
        'schedule-created': ScheduleTurnData;
    }
}
/**
 * Turn-tail owner currency this row reads: the closing Turn with its sequence.
 *
 * Structurally equal to ui-chat's `TurnTailOwnerProps`; the fields are named
 * locally so this package keeps its existing dependency set.
 */
export interface ScheduleTurnOwner {
    readonly turn: TurnLocation;
    readonly seq: number;
    readonly openFile: (path: string) => void;
}
/** One in-window root call head, kept to build its result node. */
interface ScheduleCall {
    readonly name: string;
    readonly argsRaw: string;
    readonly time: number;
}
interface ScheduleTurnState {
    readonly turn: number;
    readonly calls: ReadonlyMap<string, ScheduleCall>;
    readonly created: readonly ScheduleCreatedTask[];
}
/**
 * Created tasks of one Turn up to a bound sequence.
 *
 * The Conversation Location index owns Turn membership before this runs, so
 * tasks cannot spill across Turns.
 * @param data - engine-published created-task data for one Turn.
 * @param seq - bound sequence; settlements after it are excluded.
 * @returns created result nodes in settlement order; empty when the Turn created none.
 */
export declare function scheduleTasksForClosing(data: Readonly<ScheduleTurnData> | undefined, seq?: number): readonly ScheduleCreatedTask[];
/**
 * Select the tasks one Turn created, for the Turn-tail list entry to render.
 *
 * The bounded sequence is the Turn's own end, not the closing Assistant text: a
 * Turn whose last text response precedes a `schedule_create` settlement still
 * owns that creation when it ends on a failed request or a user stop, and the
 * turn-tail seat exists only for a completed Turn. A Turn without a recorded end
 * falls back to the owner's own sequence.
 * @param owner - Turn-tail owner currency for the closing Assistant.
 * @returns created tasks, or null when the Turn created none.
 */
export declare function selectScheduleTasks(owner: ScheduleTurnOwner): ScheduleTurnData | null;
/** Turn-local `schedule_create` accumulator; it publishes no view Node. */
export declare const scheduleTurnDefinition: ConversationNodeDefinition<ScheduleTurnState>;
export {};
//# sourceMappingURL=schedule-turn.d.ts.map