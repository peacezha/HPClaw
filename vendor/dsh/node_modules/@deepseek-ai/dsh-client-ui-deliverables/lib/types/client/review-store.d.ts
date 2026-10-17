/**
 * The review tab's view state: which listed file is shown, whether hunks are
 * drawn side by side, and whether long lines wrap. One bucket per tab, so two
 * reviews in one session keep their own choices; the bucket ends with the
 * tab record's signal.
 */
import { type EngineStoreHandle } from '@deepseek-ai/dsh-client-store';
import type { TabId } from '@deepseek-ai/dsh-client-ui-dockkit';
/** One review tab's choices. */
export interface ReviewTabState {
    /** Original index of the shown file in the summary's files array. */
    index: number;
    /** Whether deletions and additions are drawn in two columns; new tabs start enabled. */
    split: boolean;
    /** Whether long lines wrap instead of scrolling. */
    wrap: boolean;
    /** The navigation revision whose file index was last applied. */
    navigated: number;
}
/** Every review tab's choices, keyed by tab id. */
export interface ReviewState {
    byTab: Record<TabId, ReviewTabState>;
}
/** The review store's write set; every action names the tab it writes. */
type ReviewActions = {
    navigated: (draft: ReviewState, tabId: TabId, revision: number, index: number) => void;
    selected: (draft: ReviewState, tabId: TabId, index: number) => void;
    toggledSplit: (draft: ReviewState, tabId: TabId) => void;
    toggledWrap: (draft: ReviewState, tabId: TabId) => void;
    forget: (draft: ReviewState, tabId: TabId) => void;
};
/**
 * Declare the review tab's store; the registration declares it as an
 * exclusive store, so the framework mints one instance per session.
 * @returns the store handle to declare on the registration.
 */
export declare function createReviewStore(): EngineStoreHandle<ReviewState, ReviewActions>;
export {};
//# sourceMappingURL=review-store.d.ts.map