/** Unfinished close requests survive reload independently of the removed sidebar tabs. */
import type { SessionId } from '@deepseek-ai/dsh-session/types';
import type { WebTerminalId } from '../types.ts';
/** An explicit cleanup request; no process or open-tab metadata is mirrored here. */
export interface TerminalCloseRequest {
    readonly sessionId: SessionId;
    readonly id: WebTerminalId;
    readonly title: string;
}
/** Each request has its own storage key, so other browser windows cannot overwrite its cleanup. */
export declare class TerminalCloseRequests {
    private readonly requests;
    constructor();
    /**
     * Read cleanup work still awaiting Host confirmation.
     * @returns unfinished requests owned by this browser instance.
     */
    pending(): readonly TerminalCloseRequest[];
    /**
     * Retain cleanup across reload before removing a tab.
     * @param request - close intent to save before removing its tab.
     */
    save(request: TerminalCloseRequest): void;
    /**
     * Forget confirmed cleanup in memory and browser storage.
     * @param id - terminal whose Host cleanup succeeded.
     */
    remove(id: WebTerminalId): void;
    private load;
}
//# sourceMappingURL=close-requests.d.ts.map