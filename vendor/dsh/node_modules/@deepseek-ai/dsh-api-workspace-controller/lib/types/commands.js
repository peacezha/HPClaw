/** Workspace command implementation and stable Remote failure mapping. */
import { WorkspaceActiveSessionError, WorkspaceArchivedSessionPinError, WorkspaceId, WorkspaceMoveInvalidError, WorkspaceOrderInvalidError, WorkspaceUnknownSessionError, } from '@deepseek-ai/dsh-workspace';
import { RemoteError, remoteErrorOf } from '@deepseek-ai/dsh-typert-protocol';
import { workspaceView } from "./feed.js";
/** Implements Workspace mutations against the authoritative registry. */
export class WorkspaceCommands {
    ctx;
    operationTail = Promise.resolve();
    /** @param ctx - Host context containing the Workspace registry. */
    constructor(ctx) {
        this.ctx = ctx;
    }
    /**
     * Create or resolve one Workspace over an existing directory.
     * @param request - directory path to register.
     * @returns the Workspace and whether this call created it.
     */
    create(request) {
        return this.enqueue(async () => {
            try {
                const existing = await this.ctx.workspaceRegistry.resolveByPath(request.path);
                if (existing !== undefined) {
                    return { workspace: workspaceView(existing), created: false };
                }
                const workspace = await this.ctx.workspaceRegistry.create(request.path);
                return { workspace: workspaceView(workspace), created: true };
            }
            catch (error) {
                if (remoteErrorOf(error) !== undefined)
                    throw error;
                throw new RemoteError('workspace/invalid-path', `cannot create a Workspace at "${request.path}": ${errorMessage(error)}`, { path: request.path }, { cause: error });
            }
        });
    }
    /**
     * Rename one Workspace after serializing title ownership checks.
     * @param request - Workspace identity and proposed title.
     * @returns the updated Workspace projection.
     */
    rename(request) {
        const title = request.title.trim();
        if (title === '') {
            return Promise.reject(new RemoteError('gateway/bad-request', 'Workspace rename requires a non-blank title', {}));
        }
        return this.enqueue(async () => {
            const workspace = this.requireWorkspace(request.workspaceId);
            if (title !== workspace.title) {
                if (this.ctx.workspaceRegistry.list().some(candidate => candidate.id !== workspace.id && candidate.title === title)) {
                    throw new RemoteError('workspace/name-conflict', `Workspace name '${title}' is already in use`, { name: title });
                }
                await workspace.setTitle(title);
            }
            return { workspace: workspaceView(workspace) };
        });
    }
    /**
     * Delete one Workspace registration without deleting its directory or Sessions.
     * @param request - Workspace identity to remove.
     * @returns deletion confirmation.
     */
    delete(request) {
        return this.enqueue(async () => {
            if (!await this.ctx.workspaceRegistry.delete(WorkspaceId(request.workspaceId))) {
                throw workspaceNotFound(request.workspaceId);
            }
            return { deleted: true };
        });
    }
    /**
     * Move one Workspace within the durable registry order.
     * @param request - moved Workspace and optional anchor.
     * @returns the complete resulting Workspace order.
     */
    async insertBefore(request) {
        try {
            const workspaceIds = await this.ctx.workspaceRegistry.insertBefore(WorkspaceId(request.workspaceId), request.beforeWorkspaceId === undefined
                ? undefined
                : WorkspaceId(request.beforeWorkspaceId));
            return { workspaceIds: [...workspaceIds] };
        }
        catch (error) {
            if (!(error instanceof WorkspaceOrderInvalidError))
                throw error;
            throw workspaceNotFound(error.workspaceId);
        }
    }
    /**
     * Move one accounted Session within a Workspace's manual order.
     * @param request - Workspace, Session, and optional anchor identities.
     * @returns the updated Workspace projection.
     */
    async insertSessionBefore(request) {
        const workspace = this.requireWorkspace(request.workspaceId);
        try {
            await workspace.insertSessionBefore(request.sessionId, request.beforeSessionId);
        }
        catch (error) {
            if (!(error instanceof WorkspaceMoveInvalidError))
                throw error;
            throw new RemoteError('workspace/move-invalid', error.message, {
                workspaceId: request.workspaceId,
                sessionId: request.sessionId,
                ...request.beforeSessionId === undefined
                    ? {}
                    : { beforeSessionId: request.beforeSessionId },
            }, { cause: error });
        }
        return { workspace: workspaceView(workspace) };
    }
    /**
     * Add one known Session to the registry-global archive set. Without
     * `stopActivity` a Session with running work is refused as
     * `workspace/session-active` with the activity the registry's providers
     * reported; with it, the providers stop that work first.
     * @param request - Session identity to archive and whether to stop its work.
     * @returns the complete resulting archive set.
     */
    async archiveSession(request) {
        try {
            await this.ctx.workspaceRegistry.archiveSession(request.sessionId, request.stopActivity === true ? { stopActivity: true } : {});
        }
        catch (error) {
            if (error instanceof WorkspaceUnknownSessionError) {
                throw new RemoteError('session/not-found', error.message, { sessionId: request.sessionId }, { cause: error });
            }
            if (error instanceof WorkspaceActiveSessionError) {
                throw new RemoteError('workspace/session-active', error.message, { sessionId: request.sessionId, activity: error.activity }, { cause: error });
            }
            throw error;
        }
        return { archivedSessionIds: [...this.ctx.workspaceRegistry.archivedSessionIds] };
    }
    /**
     * Drop one Session from the registry-global archive set. An id that is not
     * archived is not an error: the call is idempotent, so a lost race with
     * another surface resolves as a no-op.
     * @param request - Session identity to unarchive.
     * @returns the complete resulting archive set.
     */
    async unarchiveSession(request) {
        await this.ctx.workspaceRegistry.unarchiveSession(request.sessionId);
        return { archivedSessionIds: [...this.ctx.workspaceRegistry.archivedSessionIds] };
    }
    /**
     * Add one known unarchived Session to the registry-global pin set.
     * @param request - Session identity to pin.
     * @returns the complete resulting pin set, most recently pinned first.
     */
    async pinSession(request) {
        try {
            await this.ctx.workspaceRegistry.pinSession(request.sessionId);
        }
        catch (error) {
            if (error instanceof WorkspaceUnknownSessionError) {
                throw new RemoteError('session/not-found', error.message, { sessionId: request.sessionId }, { cause: error });
            }
            if (error instanceof WorkspaceArchivedSessionPinError) {
                throw new RemoteError('gateway/bad-request', error.message, {}, { cause: error });
            }
            throw error;
        }
        return { pinnedSessionIds: [...this.ctx.workspaceRegistry.pinnedSessionIds] };
    }
    /**
     * Drop one Session from the registry-global pin set. An id that is not
     * pinned is not an error: the call is idempotent, so a lost race with
     * another surface resolves as a no-op.
     * @param request - Session identity to unpin.
     * @returns the complete resulting pin set, most recently pinned first.
     */
    async unpinSession(request) {
        await this.ctx.workspaceRegistry.unpinSession(request.sessionId);
        return { pinnedSessionIds: [...this.ctx.workspaceRegistry.pinnedSessionIds] };
    }
    requireWorkspace(workspaceId) {
        const workspace = this.ctx.workspaceRegistry.get(WorkspaceId(workspaceId));
        if (workspace === undefined)
            throw workspaceNotFound(workspaceId);
        return workspace;
    }
    enqueue(operation) {
        const result = this.operationTail.then(operation);
        this.operationTail = result.then(() => undefined, () => undefined);
        return result;
    }
}
function workspaceNotFound(workspaceId) {
    return new RemoteError('workspace/not-found', `Workspace "${workspaceId}" not found`, { workspaceId });
}
function errorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
//# sourceMappingURL=commands.js.map