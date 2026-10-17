/**
 * Sidebar bonus notice. The card reports a display once it has a position, the
 * document is visible, and it has painted one frame: that is the whole signal,
 * and the card measures no cover, so a painted card behind the open Settings
 * overlay reports the same way as any other. Closing counts as a display too,
 * because the user acted on it. An award that expired before a render is not
 * drawn at all.
 */
import { type RefObject } from 'react';
import type { BonusNotice } from './bonus-notices.ts';
/** @param props - server-ordered notices, localized fallback copy, anchor, and display callbacks.
 * @returns a non-modal stack whose foreground card alone can report display or be closed.
 */
export declare function AccountNoticeStack({ notices, anchor, title, closeLabel, onShown, onDismiss }: {
    notices: readonly BonusNotice[];
    anchor: RefObject<HTMLElement>;
    title: string;
    closeLabel: string;
    /** Called after the foreground card has passed a visible presented frame. */
    onShown: (orderId: BonusNotice['orderId']) => void;
    /** Called when the user closes the foreground card. */
    onDismiss: (orderId: BonusNotice['orderId']) => void;
}): import("react").ReactPortal;
//# sourceMappingURL=AccountNotice.d.ts.map