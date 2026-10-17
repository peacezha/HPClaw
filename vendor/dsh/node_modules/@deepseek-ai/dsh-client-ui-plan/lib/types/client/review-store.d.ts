/** Session-owned memory of pending plans already opened automatically. */
import { type EngineStoreHandle } from '@deepseek-ai/dsh-client-store';
interface PlanReviewState {
    opened: Partial<Record<string, true>>;
}
type PlanReviewActions = {
    markOpened: (draft: PlanReviewState, reviewKey: string) => void;
};
/**
 * Keep manual sidebar closure effective across review component remounts.
 * @returns a transient store handle whose instances belong to Session scopes.
 */
export declare function createPlanReviewStore(): EngineStoreHandle<PlanReviewState, PlanReviewActions>;
export {};
//# sourceMappingURL=review-store.d.ts.map