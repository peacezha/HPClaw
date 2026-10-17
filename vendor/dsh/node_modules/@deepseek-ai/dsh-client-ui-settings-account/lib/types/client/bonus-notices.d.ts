/**
 * Lifecycle of bonus notices: one foreground card in a stack, one read result in
 * force at a time, and one acknowledgement per displayed card. Reads happen when
 * the account becomes active and when the user asks for a refresh, never on a
 * timer; the server owns which bonus is unnotified and what its copy says.
 *
 * An order is acknowledged once its foreground card reports a presented frame: the card has
 * a position, the document is visible, and it painted one frame. The card measures
 * no cover, so a card painted under the open Settings overlay reports like any
 * other, and closing the card counts as a display too.
 *
 * One lifecycle covers one signed-in session. A repeated signed-in frame — the
 * second commit update of one sign-in, or a reconnected stream's replay — keeps
 * the card and its acknowledgement retries and reads again, so a credential
 * replaced in place is still named by a fresh read. Signing out, unloading, or a
 * read naming another account clears all of it; a later sign-in shows whatever
 * the server still offers.
 * @module @deepseek-ai/dsh-client-ui-settings-account/src/client/bonus-notices
 */
import type { AccountBonusBatch, AccountBonusOrderId, AccountUserId } from '@deepseek-ai/dsh-deepseek-account/types';
/** Notice eligible for display; the message is server-authored for the active locale. */
export interface BonusNotice {
    /** Server-localized plain-text title; absent responses use the localized bonus title. */
    readonly title?: string;
    /** Server order identity. */
    readonly orderId: AccountBonusOrderId;
    /** Server-localized plain text, including any award amount or expiration. */
    readonly message: string;
    /** Server expiration, re-checked at display time; an empty string means no expiration. */
    readonly expiresAt: string;
}
/** Deployment-varying acknowledgement retry timings. */
export interface BonusNoticeTiming {
    /** Delay before the first acknowledgement retry, doubled per further failure. */
    readonly ackRetryDelayMs: number;
    /** Ceiling for the acknowledgement retry backoff. */
    readonly ackRetryMaxDelayMs: number;
}
/** Collaborators and timings of one bonus notice lifecycle. */
export interface BonusNoticeControllerOptions extends BonusNoticeTiming {
    /** Read the signed-in account's unnotified bonus. @returns the batch, or null when no account is signed in. */
    read: () => Promise<AccountBonusBatch | null>;
    /**
     * Record one order as notified.
     * @param accountId - account the order belongs to.
     * @param orderId - shown order.
     * @returns false when the account changed or signed out; a protocol failure rejects.
     */
    acknowledge: (accountId: AccountUserId, orderId: AccountBonusOrderId) => Promise<boolean>;
    /** @param notices - notices in front-to-back order; empty when none are shown. */
    publish: (notices: readonly BonusNotice[]) => void;
}
/** Commands the account plugin issues to the bonus notice lifecycle. */
export interface BonusNoticeController {
    /**
     * Start the signed-in lifecycle and read. Re-entry during a live lifecycle keeps
     * the card and its acknowledgement retries and reads again, so a credential
     * replaced in place is named by that frame's own read.
     */
    begin(): void;
    /** Stop the lifecycle, drop the displayed notice, and discard pending acknowledgement retries. */
    end(): void;
    /**
     * Read the unnotified bonus once, for one Settings entry.
     * @returns after the read settles, so callers can await the whole entry.
     */
    refresh(): Promise<void>;
    /** @param orderId - notice whose card passed a presented frame while visible. */
    shown(orderId: AccountBonusOrderId): void;
    /** @param orderId - notice the user closed, which counts as seen. */
    dismiss(orderId: AccountBonusOrderId): void;
}
/**
 * Own the read, display, and acknowledgement lifecycle of bonus notices.
 * @param options - collaborators and timings.
 * @returns the controller the account plugin drives from account and settings state.
 */
export declare function createBonusNoticeController(options: BonusNoticeControllerOptions): BonusNoticeController;
//# sourceMappingURL=bonus-notices.d.ts.map