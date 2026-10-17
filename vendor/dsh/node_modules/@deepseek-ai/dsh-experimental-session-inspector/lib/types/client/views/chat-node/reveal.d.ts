/** Inspector-owned DOM reveal and native scrolling, without a Conversation request channel. */
import type { InspectorChatTarget } from '../objects.ts';
/** Owns one deferred reveal and body-level flash, without modifying Chat content nodes. */
export declare class InspectorChatRevealer {
    private readonly getRoot;
    private frame;
    private overlay;
    private animation;
    private cancelScroll;
    /** @param getRoot - Current Session's main Chat, or undefined when it is not displayed. */
    constructor(getRoot: () => HTMLElement | undefined);
    /**
     * Reveal the first usable occurrence, falling back to the displayed Chat column.
     * Hidden or empty candidates do not prevent nearby content from being highlighted.
     * The highlight waits for scrolling to settle; reduced-motion mode scrolls immediately without a flash.
     * @param targets - Exact and approximate Node, Group, or Turn identities in preference order.
     */
    reveal(targets: readonly InspectorChatTarget[]): void;
    /** Cancel pending native scrolling and remove the Inspector-owned overlay. */
    dispose(): void;
    private queueFlash;
    private smoothScroll;
    private flash;
}
//# sourceMappingURL=reveal.d.ts.map