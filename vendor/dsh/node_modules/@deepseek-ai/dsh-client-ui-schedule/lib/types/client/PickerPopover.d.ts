import type { ReactNode, RefObject } from 'react';
/** Inputs of the picker shell. */
export interface PickerPopoverProps {
    /** Whether the panel is mounted. */
    readonly open: boolean;
    /** The row's trigger button, which anchors the panel and counts as inside for dismissal. */
    readonly anchorRef: RefObject<HTMLElement | null>;
    /** Accessible name of the panel. */
    readonly label: string;
    /** Layout class of this picker's contents.
     * (`| undefined` for exactOptionalPropertyTypes: the CSS module types every class as optional.) */
    readonly className: string | undefined;
    /** Dismiss the panel. */
    readonly onClose: () => void;
    /** The picker's columns or month grid. */
    readonly children: ReactNode;
}
/**
 * Render one picker panel into `document.body`, fixed below its trigger.
 *
 * The panel is a portal, so an ancestor's `overflow` cannot crop it, and a
 * pointerdown outside both the trigger and the panel dismisses it.
 * @param props - open state, the trigger, the panel name and layout class, the dismissal callback, and the contents.
 * @returns the panel while open, and nothing while closed.
 */
export declare function PickerPopover({ open, anchorRef, label, className, onClose, children }: PickerPopoverProps): ReactNode;
//# sourceMappingURL=PickerPopover.d.ts.map