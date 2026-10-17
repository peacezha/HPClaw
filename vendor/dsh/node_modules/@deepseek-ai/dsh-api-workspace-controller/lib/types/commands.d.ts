/** Workspace command implementation and stable Remote failure mapping. */
import type { Context } from '@deepseek-ai/cordis';
import type { WorkspaceArchiveSessionRequest, WorkspaceArchiveValue, WorkspaceCreateRequest, WorkspaceCreateValue, WorkspaceDeleteRequest, WorkspaceDeleteValue, WorkspaceInsertBeforeRequest, WorkspaceInsertSessionBeforeRequest, WorkspaceOrderValue, WorkspacePinSessionRequest, WorkspacePinValue, WorkspaceRenameRequest, WorkspaceUnarchiveSessionRequest, WorkspaceUnpinSessionRequest, WorkspaceValue } from './types.ts';
/** Implements Workspace mutations against the authoritative registry. */
export declare class WorkspaceCommands {
    private readonly ctx;
    private operationTail;
    /** @param ctx - Host context containing the Workspace registry. */
    constructor(ctx: Context);
    /**
     * Create or resolve one Workspace over an existing directory.
     * @param request - directory path to register.
     * @returns the Workspace and whether this call created it.
     */
    create(request: WorkspaceCreateRequest): Promise<WorkspaceCreateValue>;
    /**
     * Rename one Workspace after serializing title ownership checks.
     * @param request - Workspace identity and proposed title.
     * @returns the updated Workspace projection.
     */
    rename(request: WorkspaceRenameRequest): Promise<WorkspaceValue>;
    /**
     * Delete one Workspace registration without deleting its directory or Sessions.
     * @param request - Workspace identity to remove.
     * @returns deletion confirmation.
     */
    delete(request: WorkspaceDeleteRequest): Promise<WorkspaceDeleteValue>;
    /**
     * Move one Workspace within the durable registry order.
     * @param request - moved Workspace and optional anchor.
     * @returns the complete resulting Workspace order.
     */
    insertBefore(request: WorkspaceInsertBeforeRequest): Promise<WorkspaceOrderValue>;
    /**
     * Move one accounted Session within a Workspace's manual order.
     * @param request - Workspace, Session, and optional anchor identities.
     * @returns the updated Workspace projection.
     */
    insertSessionBefore(request: WorkspaceInsertSessionBeforeRequest): Promise<WorkspaceValue>;
    /**
     * Add one known Session to the registry-global archive set. Without
     * `stopActivity` a Session with running work is refused as
     * `workspace/session-active` with the activity the registry's providers
     * reported; with it, the providers stop that work first.
     * @param request - Session identity to archive and whether to stop its work.
     * @returns the complete resulting archive set.
     */
    archiveSession(request: WorkspaceArchiveSessionRequest): Promise<WorkspaceArchiveValue>;
    /**
     * Drop one Session from the registry-global archive set. An id that is not
     * archived is not an error: the call is idempotent, so a lost race with
     * another surface resolves as a no-op.
     * @param request - Session identity to unarchive.
     * @returns the complete resulting archive set.
     */
    unarchiveSession(request: WorkspaceUnarchiveSessionRequest): Promise<WorkspaceArchiveValue>;
    /**
     * Add one known unarchived Session to the registry-global pin set.
     * @param request - Session identity to pin.
     * @returns the complete resulting pin set, most recently pinned first.
     */
    pinSession(request: WorkspacePinSessionRequest): Promise<WorkspacePinValue>;
    /**
     * Drop one Session from the registry-global pin set. An id that is not
     * pinned is not an error: the call is idempotent, so a lost race with
     * another surface resolves as a no-op.
     * @param request - Session identity to unpin.
     * @returns the complete resulting pin set, most recently pinned first.
     */
    unpinSession(request: WorkspaceUnpinSessionRequest): Promise<WorkspacePinValue>;
    private requireWorkspace;
    private enqueue;
}
//# sourceMappingURL=commands.d.ts.map