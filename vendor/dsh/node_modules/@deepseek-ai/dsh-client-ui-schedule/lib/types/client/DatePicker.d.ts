import type { ReactNode, RefObject } from 'react';
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
/** Row copy of the task manager namespace, as the pickers receive it. */
type Translate = PropsLocale<'schedule.manager'>['t'];
/** Inputs of the date picker. */
export interface DatePickerProps {
    /** Whether the panel is showing. */
    readonly open: boolean;
    /** The row's trigger button, which anchors the panel. */
    readonly anchorRef: RefObject<HTMLButtonElement | null>;
    /** The staged ISO date. */
    readonly value: string;
    /** Stage one picked ISO date. */
    readonly onPick: (date: string) => void;
    /** Dismiss the panel. */
    readonly onClose: () => void;
    /** Row copy. */
    readonly t: Translate;
}
/**
 * Render the month panel: one localized heading row over weeks of day cells.
 * @param props - open state, the trigger, the staged date, the pick and close callbacks, and row copy.
 * @returns the anchored panel while open, and nothing while closed.
 */
export declare function DatePicker({ open, anchorRef, value, onPick, onClose, t }: DatePickerProps): ReactNode;
export {};
//# sourceMappingURL=DatePicker.d.ts.map