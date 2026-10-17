import type { ReactNode, RefObject } from 'react';
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
/** Row copy of the task manager namespace, as the pickers receive it. */
type Translate = PropsLocale<'schedule.manager'>['t'];
/** Inputs of the clock picker. */
export interface ClockPickerProps {
    /** Whether the panel is showing. */
    readonly open: boolean;
    /** The row's trigger button, which anchors the panel. */
    readonly anchorRef: RefObject<HTMLButtonElement | null>;
    /** The staged clock text. */
    readonly value: string;
    /** Stage one picked `HH:MM:SS` clock. */
    readonly onPick: (time: string) => void;
    /** Dismiss the panel. */
    readonly onClose: () => void;
    /**
     * Whether the panel offers the seconds column (default true). A cron rule has
     * no seconds field, so its form hides the column; a pick then keeps the staged
     * clock's own seconds.
     */
    readonly seconds?: boolean;
    /** Row copy. */
    readonly t: Translate;
}
/**
 * Render the clock panel: hours, minutes, and optionally seconds, one scrolling column each.
 * @param props - open state, the trigger, the staged clock, the pick and close callbacks, the seconds-column switch, and row copy.
 * @returns the anchored panel while open, and nothing while closed.
 */
export declare function ClockPicker({ open, anchorRef, value, onPick, onClose, seconds, t }: ClockPickerProps): ReactNode;
export {};
//# sourceMappingURL=ClockPicker.d.ts.map