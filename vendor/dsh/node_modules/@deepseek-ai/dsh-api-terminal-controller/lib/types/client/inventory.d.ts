/** Session-owned terminal discovery shared across view occurrences. */
import type { RemoteResult } from '@deepseek-ai/dsh-typert-protocol';
import type { WebTerminalId, WebTerminalInfo } from '../types.ts';
type Inventory = ReadonlyMap<WebTerminalId, WebTerminalInfo>;
/** One Session's cached list, retained failures and in-flight mutation reconciliation. */
export declare class TerminalInventory {
    private readonly load;
    private state;
    private items;
    private readonly pending;
    /** @param load - fetch the Session's retained Host terminals. */
    constructor(load: () => Promise<RemoteResult<WebTerminalInfo[]>>);
    /**
     * Read the cached list or join its single in-flight request.
     * @param refresh - explicitly replace a settled result or failure; overlapping refreshes share one request.
     * @returns current terminal metadata; failures remain cached until refresh or reset.
     */
    read(refresh?: boolean): Promise<Inventory>;
    private loadRequest;
    /**
     * Preserve acknowledged mutations and attachment metadata across a pending list response.
     * @param info - latest confirmed terminal metadata.
     */
    update(info: WebTerminalInfo): void;
    /**
     * Remove a terminal after confirmed closure or unavailability.
     * @param id - terminal identity.
     */
    remove(id: WebTerminalId): void;
    /**
     * Replace discovery after a connection change; never discover a Session that has not needed a list.
     * @returns the replacement lookup, or undefined for an unused or disposed inventory.
     */
    reset(): Promise<Inventory> | undefined;
    /**
     * Discard metadata and prevent late responses from publishing.
     * @returns after all owned list requests settle.
     */
    dispose(): Promise<void>;
}
export {};
//# sourceMappingURL=inventory.d.ts.map