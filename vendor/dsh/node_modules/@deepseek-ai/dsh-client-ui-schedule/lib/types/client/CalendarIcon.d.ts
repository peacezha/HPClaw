/** Calendar glyph for the date row's picker trigger. */
import type { ReactNode } from 'react';
/** Inputs of the calendar glyph, matching the product icon set's props. */
export interface CalendarIconProps {
    /** Extra class for layout placement; color rides currentColor. */
    readonly className?: string | undefined;
}
/**
 * Draw the 14px calendar outline the Date row's trigger carries.
 *
 * The shared product icon set has no calendar glyph, so this package draws the
 * one its own picker needs, at that set's regular 1px stroke.
 * @param props - extra class for layout placement.
 * @returns the decorative glyph.
 */
export declare function IconCalendarOutlineRegular({ className }: CalendarIconProps): ReactNode;
//# sourceMappingURL=CalendarIcon.d.ts.map