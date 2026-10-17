/**
 * The tree's asynchronous half: listing directories into the store.
 *
 * The component never awaits anything. It calls `start` / `refresh` / `toggle`, and
 * this face performs the listing and writes the outcome through the store's own
 * actions — the Slot-standard `inject` shape, so the session id is resolved by
 * the framework and the write set stays the store's.
 *
 * The listing itself is bound here to the Client Remote face: the tree keys
 * every level by absolute path and hands the endpoint that same absolute path;
 * the endpoint answers with the directory's workspace-relative path as well,
 * which the tree has no use for and drops.
 *
 * One level has one listing in force: asking for a level again — the reload
 * gesture, a directory reopened after a reset — retires the listing still in
 * flight for it, whose settlement then writes nothing. Cleanup rides the owner's
 * `signal`: a request is not made for a record that already ended, and when the
 * record goes away the bucket and the tab's listing bookkeeping are forgotten,
 * so no later settlement writes to it.
 */
import type { ClientRemote, RemoteResult } from '@deepseek-ai/dsh-api-remotes/client';
import type { BoundActions } from '@deepseek-ai/dsh-client-store';
import type { TabId } from '@deepseek-ai/dsh-client-ui-dockkit';
import type { SessionId } from '@deepseek-ai/dsh-session/types';
import type { DirLevel, createFilesStore } from './store.ts';
/**
 * Observe one directory without recursively watching its descendants.
 * @param sessionId - Session owning the directory tree.
 * @param path - absolute directory path.
 * @param signal - node lifetime.
 * @returns readiness and invalidation notifications.
 */
export type WatchWorkspaceDirectory = (sessionId: SessionId, path: string, signal: AbortSignal) => AsyncIterable<'ready' | 'change'>;
/**
 * Bind directory observation to the Remote stream supervisor.
 * @param remote - Client Remote with workspace file streams.
 * @returns a watcher that awaits stream disposal when its node ends.
 */
export declare function createWatch(remote: ClientRemote): WatchWorkspaceDirectory;
/**
 * One directory listing, bound to a Remote face.
 *
 * The session travels with the call because the endpoint resolves the workspace
 * root from it: the same path means different directories in different sessions.
 * A Remote call does not reject — the result carries the failure.
 */
export type ListWorkspaceDirectory = (sessionId: SessionId, path: string, signal: AbortSignal) => Promise<RemoteResult<DirLevel>>;
/**
 * The slice of the Client Remote face this package calls: the `workspaceFiles`
 * namespace's `list`, exactly as the Host's generated client declares it.
 */
export type WorkspaceFilesListRemote = {
    readonly workspaceFiles: Pick<ClientRemote['workspaceFiles'], 'list'>;
};
/**
 * Bind the listing to one Remote face, keeping only what the tree stores.
 * @param remote - the Client Remote face carrying the `workspaceFiles` namespace.
 * @returns the listing the tree's face performs.
 */
export declare function createList(remote: WorkspaceFilesListRemote): ListWorkspaceDirectory;
/**
 * The absolute path of one child entry.
 *
 * Joined with `/` whatever the parent's separators: the Host resolves mixed
 * separators, and the tree only needs a stable key.
 * @param parent - absolute path of the listed directory.
 * @param name - the entry's basename.
 * @returns the child's absolute path.
 */
export declare function childPath(parent: string, name: string): string;
/** The tree's injected business face, as the body receives it. */
export interface FilesInjected {
    /** Refresh the open directory tree. @param tabId - owning tab. */
    readonly refresh: (tabId: TabId) => void;
    /** Control automatic rereads without closing watches. @param tabId - owning tab. @param enabled - automatic-refresh setting. */
    readonly setAutoRefresh: (tabId: TabId, enabled: boolean) => void;
    /**
     * Seed this tab's tree and list its root.
     * @param tabId - the tab being drawn.
     * @param root - absolute path of the workspace root.
     * @param signal - the tab record's lifetime.
     */
    readonly start: (tabId: TabId, root: string, signal: AbortSignal) => void;
    /**
     * List one directory into the store.
     * @param tabId - the tab being drawn.
     * @param path - absolute directory path.
     * @param signal - the tab record's lifetime.
     */
    readonly load: (tabId: TabId, path: string, signal: AbortSignal) => void;
    /**
     * Open or collapse one directory, retaining intent during ancestor restoration.
     * @param tabId - the tab being drawn.
     * @param parentPath - the listed parent directory's exact tree key.
     * @param path - absolute directory path.
     * @param expanded - current expansion preferences, including descendants to restore.
     * @param signal - the tab record's lifetime.
     */
    readonly toggle: (tabId: TabId, parentPath: string, path: string, expanded: readonly string[], signal: AbortSignal) => void;
}
/**
 * Bind the tree's face to one directory listing.
 * @param list - the bound `workspaceFiles.list` call.
 * @param watch - target-scoped directory observation.
 * @returns the Slot `inject` factory: session and bound actions in, face out.
 */
export declare function filesFace(list: ListWorkspaceDirectory, watch: WatchWorkspaceDirectory): (sessionId: SessionId, actions: BoundActions<ReturnType<typeof createFilesStore>>) => FilesInjected;
//# sourceMappingURL=face.d.ts.map