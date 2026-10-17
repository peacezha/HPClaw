import type { ReactNode } from 'react';
/** Selectable row of a {@link TaskMenu}. */
export interface TaskMenuItem {
    /** Identifier `onSelect` receives when the row is activated. */
    id: string;
    /** Visible row label. */
    label: ReactNode;
    /** Whether the row cannot be activated, and is not a step of the arrow walk. */
    disabled?: boolean;
    /** Leading icon. */
    icon?: ReactNode;
    /** Destructive row: error-colored text and icon, and the danger hover fill. */
    danger?: boolean;
}
/** Hairline between item groups (not selectable). */
export interface TaskMenuSeparator {
    type: 'separator';
    id: string;
}
/** Non-interactive heading row above a group of items. */
export interface TaskMenuLabel {
    type: 'label';
    id: string;
    text: string;
}
/** One TaskMenu entry: a row, a separator, or a heading label. */
export type TaskMenuEntry = TaskMenuItem | TaskMenuSeparator | TaskMenuLabel;
/** Inputs of {@link TaskMenu}. */
export interface TaskMenuProps {
    /** Whether the list is showing (owner-controlled). */
    open: boolean;
    /** The trigger element, rendered in place. */
    anchor: ReactNode;
    /** Selectable rows and optional separators or heading labels (default none). */
    items?: readonly TaskMenuEntry[];
    /** Row shown as selected, marked with a trailing check. */
    selectedId?: string | undefined;
    /** Row activation callback (not called for disabled rows). */
    onSelect: (id: string) => void;
    /** Invoked on an outside pointer press, Escape, or a window blur that moved focus into an iframe. */
    onClose: () => void;
    /** List alignment against the anchor (default 'start'). */
    align?: 'start' | 'end';
    /** Render the list into document.body, fixed-positioned from the anchor rect. */
    portal?: boolean;
    /** Owner content pinned above the scrolling rows. */
    header?: ReactNode;
    /** Extra class on the anchor wrapper span. */
    className?: string | undefined;
    /** Extra class on the dropdown card itself; the only style hook that reaches a portaled list. */
    listClassName?: string | undefined;
}
/**
 * Render an anchored dropdown menu. While the list is open, Tab settles the
 * focused row — from the trigger, Tab enters the list instead — Escape and
 * Shift+Tab close it and return focus to the anchor's first enabled button, and
 * selecting a row does the same.
 * @param props.open - whether the list is showing (owner-controlled).
 * @param props.anchor - the trigger element, rendered in place.
 * @param props.items - selectable rows and optional separators or heading labels.
 * @param props.selectedId - row shown as selected.
 * @param props.onSelect - row activation callback, not called for disabled rows.
 * @param props.onClose - invoked on an outside pointer press, Escape, or a
 * window blur that moved focus into a cross-origin iframe.
 * @param props.align - list alignment against the anchor (default 'start').
 * @param props.portal - render the list into document.body, fixed-positioned
 * from the anchor rect (follows scroll and resize while open).
 * @param props.header - owner content pinned above the scrolling rows; a control
 * it marks `data-menu-field` takes the keyboard once the list is placed, which
 * is the frame a portaled list becomes focusable in.
 * @param props.className - extra class on the anchor wrapper span.
 * @param props.listClassName - extra class on the dropdown card itself.
 * @returns the anchor wrapper with the conditional list.
 */
export declare function TaskMenu({ open, anchor, items, selectedId, onSelect, onClose, align, portal, header, className, listClassName }: TaskMenuProps): import("react").JSX.Element;
//# sourceMappingURL=TaskMenu.d.ts.map