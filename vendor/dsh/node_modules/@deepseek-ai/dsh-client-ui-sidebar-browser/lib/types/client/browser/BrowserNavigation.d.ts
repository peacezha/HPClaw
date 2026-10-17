/** Bounded, application-known history used only by the iframe provider. */
import type { BrowserTarget } from './url.ts';
import type { BrowserHistoryEntry, BrowserTabState } from './BrowserPersistence.ts';
/** Maximum retained application-known navigation entries per tab. */
export declare const MAX_BROWSER_HISTORY = 100;
/**
 * Owns the application-known URL history and the iframe observation state machine.
 * The first load for a request keeps its URL authoritative; another load marks it unknown.
 */
export declare class BrowserNavigation {
    private value;
    /**
     * @param initial - persisted state restored for this tab, or a fresh empty state.
     */
    constructor(initial?: BrowserTabState);
    /**
     * Create state before a tab has a controlled navigation target.
     * @returns empty serializable state.
     */
    static empty(): BrowserTabState;
    /**
     * Read the selected application-history entry.
     * @param state - serializable tab state.
     * @returns the current target, if any.
     */
    static current(state: BrowserTabState | undefined): BrowserHistoryEntry | undefined;
    /**
     * Test whether the Web carrier can use the preceding application-history entry.
     * @param state - serializable tab state.
     * @returns whether Back is available.
     */
    static canGoBack(state: BrowserTabState): boolean;
    /**
     * Test whether the Web carrier can use the following application-history entry.
     * @param state - serializable tab state.
     * @returns whether Forward is available.
     */
    static canGoForward(state: BrowserTabState): boolean;
    /** Current immutable serializable state. */
    get snapshot(): BrowserTabState;
    /** Whether the Web iframe can safely use the application-owned Back entry. */
    get canGoBack(): boolean;
    /** Whether the Web iframe can safely use the application-owned Forward entry. */
    get canGoForward(): boolean;
    /**
     * Add a controlled target and discard its stale forward branch.
     * @param target - validated canonical target.
     * @returns the new load request.
     */
    navigate(target: BrowserTarget): NonNullable<BrowserTabState['request']>;
    /**
     * Select the preceding application-known target.
     * @returns a new load request, or undefined when unavailable.
     */
    back(): BrowserTabState['request'];
    /**
     * Select the following application-known target.
     * @returns a new load request, or undefined when unavailable.
     */
    forward(): BrowserTabState['request'];
    /**
     * Start another load of the last application-known target.
     * @returns a new load request, or undefined before the first target.
     */
    reload(): BrowserTabState['request'];
    /**
     * Record a frame load for its captured revision.
     * @param revision - revision bound to the rendered frame.
     */
    frameLoaded(revision: number): void;
    private request;
}
//# sourceMappingURL=BrowserNavigation.d.ts.map