/** Watch and read ownership for the Files panel's expanded directory tree. */
import type { DirLevel } from './store.ts';
/** One open directory and its active child nodes; cached view preferences live in the store. */
export declare class DirectoryNode {
    readonly path: string;
    private readonly load;
    private readonly watch;
    private readonly failed;
    private restore;
    /** Open direct-child directories, keyed by absolute path. */
    readonly children: Map<string, DirectoryNode>;
    private readonly controller;
    private readonly signal;
    private task;
    private reading;
    private dirty;
    private initialized;
    private automatic;
    constructor(path: string, load: (path: string, signal: AbortSignal) => Promise<DirLevel | undefined>, watch: (path: string, signal: AbortSignal) => AsyncIterable<'ready' | 'change'>, failed: (path: string, error: unknown) => void, lifetime: AbortSignal, restore?: readonly string[]);
    /**
     * Start observation once; readiness triggers the initial listing.
     * @returns this node.
     */
    open(): this;
    /**
     * Find an active node in this subtree.
     * @param path - absolute directory path.
     * @returns the matching node, or undefined when that directory is closed.
     */
    find(path: string): DirectoryNode | undefined;
    /**
     * Update the expansion preferences used by pending directory listings.
     * @param expanded - latest expansion preferences from the store.
     */
    setExpanded(expanded: readonly string[]): void;
    /**
     * Open a direct child using this node's lifetime and automatic-refresh setting.
     * @param path - absolute direct-child directory path.
     * @param restore - descendant expansion preferences to restore after listing.
     * @returns the active child, or undefined after cancellation.
     */
    expand(path: string, restore?: readonly string[]): DirectoryNode | undefined;
    /**
     * Remove a child and its pending restoration preferences.
     * @param path - absolute direct-child directory path.
     * @returns once the child subtree's reads and watches have ended.
     */
    collapse(path: string): Promise<void>;
    /**
     * Control subtree rereads without ending subscriptions.
     * @param enabled - refresh dirty nodes automatically.
     */
    setAutomatic(enabled: boolean): void;
    /** Queue a reread, coalescing with active work. @returns completion of the active read and its coalesced rereads. */
    refresh(): Promise<void>;
    /** Refresh this node and its open descendants. @returns once their listings settle. */
    refreshTree(): Promise<void>;
    /** Cancel the active subtree. @returns once all owned reads and watches have ended. */
    close(): Promise<void>;
    private follow;
    private read;
}
//# sourceMappingURL=directory-node.d.ts.map