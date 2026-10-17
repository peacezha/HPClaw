/** One-shot Inspector picking through a real click-catching mask over the main Chat. */
import { type InspectorPickTarget } from './pick-match.ts';
/** Owns the mask, preview, and geometry observers for one picking gesture. */
export declare class InspectorChatPicker {
    private readonly getRoot;
    private readonly owner;
    private readonly picked;
    private readonly cancelled;
    private readonly released;
    private mask;
    private overlay;
    private root;
    private observing;
    private resizing;
    /**
     * @param getRoot - Current Session's displayed main Chat.
     * @param owner - Inspector button; hiding or removing it cancels picking.
     * @param picked - True completes selection; false keeps the mask for another pick.
     * @param cancelled - Clear the owning panel's picking state.
     * @param released - Forget this gesture after its DOM resources are released.
     */
    constructor(getRoot: () => HTMLElement | undefined, owner: HTMLElement, picked: (target: InspectorPickTarget) => boolean, cancelled: () => void, released: () => void);
    /**
     * Begin picking in the visible main Chat.
     * @returns Whether a visible Chat was found and its mask installed.
     */
    start(): boolean;
    /** Remove the mask and observers without calling panel callbacks during unmount. */
    dispose(): void;
    private currentRoot;
    private readonly position;
    private readonly verify;
    private hit;
    private readonly hide;
    /** Stop the gesture and clear its owning panel's picking state. */
    readonly cancel: () => void;
    private readonly move;
    private readonly suppress;
    private readonly click;
    private readonly wheel;
    private readonly keydown;
}
//# sourceMappingURL=picker.d.ts.map