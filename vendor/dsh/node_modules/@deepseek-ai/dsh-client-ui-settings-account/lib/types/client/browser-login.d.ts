/** Browser tab ownership for one UI-initiated authorization attempt. */
import type { AccountView } from '@deepseek-ai/dsh-deepseek-account/types';
/** Keeps a preopened browser tab separate from Host authorization state. */
export declare class BrowserLogin {
    private readonly destination;
    private popup;
    private navigated;
    private attempt;
    /** @param destination - maps the Host authorization URL to the page the tab opens, read when the tab navigates. */
    constructor(destination: (authorizeUrl: string) => string);
    /**
     * Preopen a tab and bind it to the attempt returned by the Host.
     * @param request - authenticated Host start request.
     * @param latest - most recent streamed state, including frames received before the response.
     * @returns after this UI is following the new attempt.
     */
    start(request: () => Promise<AccountView>, latest: () => AccountView | undefined): Promise<void>;
    /** Preopen a tab during the user's click; blocked popups need the copy-link route. */
    begin(): void;
    /**
     * Bind the preopened tab to its Host attempt.
     * @param view - initial RPC response identifying this UI's attempt.
     */
    follow(view: AccountView): void;
    /**
     * Navigate or close the pending tab when its attempt changes.
     * @param view - latest Host state.
     */
    update(view: AccountView | undefined): void;
    /** Close the owned authorization tab and stop following its attempt. */
    dispose(): void;
}
//# sourceMappingURL=browser-login.d.ts.map