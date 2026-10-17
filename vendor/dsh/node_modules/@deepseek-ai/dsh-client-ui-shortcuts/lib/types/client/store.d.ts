/** Shortcut reference visibility and search state, shared by its entry points. */
import { type EngineStoreHandle } from '@deepseek-ai/dsh-client-store';
type State = {
    open: boolean;
    query: string;
    focusRequest: number;
};
type Actions = {
    open(draft: State): void;
    close(draft: State): void;
    search(draft: State, query: string): void;
};
/**
 * Declare the reference dialog store.
 * @returns root-scoped visibility, focus request, and search actions.
 */
export declare function createShortcutsStore(): EngineStoreHandle<State, Actions>;
export {};
//# sourceMappingURL=store.d.ts.map