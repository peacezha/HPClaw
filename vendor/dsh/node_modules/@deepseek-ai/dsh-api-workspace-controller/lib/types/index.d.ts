/** Host Workspace Remote owner: explicit commands and reconnect-safe state. */
import { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import type { WorkspaceArchiveSessionRequest, WorkspaceArchiveValue, WorkspaceCreateRequest, WorkspaceCreateValue, WorkspaceDeleteRequest, WorkspaceDeleteValue, WorkspaceFollowFrame, WorkspaceInsertBeforeRequest, WorkspaceInsertSessionBeforeRequest, WorkspaceOrderValue, WorkspacePinSessionRequest, WorkspacePinValue, WorkspaceRenameRequest, WorkspaceUnarchiveSessionRequest, WorkspaceUnpinSessionRequest, WorkspaceValue } from './types.ts';
export type * from './types.ts';
export { DirectoryPickerController } from './directory-picker.ts';
/** First-use directory policy for the Host account. */
export interface Config {
    /** Override the system Documents directory with a fully qualified path. */
    documentsDirectory?: string;
    /** Maximum duration of the operating system's Documents lookup. */
    documentsLookupTimeoutMs?: number;
}
/** Directory policy after schema defaults have been applied. */
type ResolvedConfig = Config & {
    documentsLookupTimeoutMs: number;
};
declare module '@deepseek-ai/cordis' {
    interface Context {
        /** Host Workspace business API and Remote namespace owner. */
        workspaceController: WorkspaceController;
    }
}
/** Host service backing the generated `ctx.remote.workspace` namespace. */
export declare class WorkspaceController extends TypertRemoteService {
    static inject: string[];
    static Config: z<Config, ResolvedConfig>;
    private readonly config;
    private readonly commands;
    private readonly feed;
    /**
     * @param ctx - Host context containing the Workspace registry.
     * @param config - first-use directory policy.
     */
    constructor(ctx: Context, config?: Config);
    /**
     * Create or idempotently resolve one Workspace over an existing directory.
     * @param request - directory path to register.
     * @returns the Workspace and whether this call created it.
     */
    create(request: WorkspaceCreateRequest): Promise<WorkspaceCreateValue>;
    /**
     * Initialize or reuse the default Workspace during first-use startup. The
     * directory name is fixed, so the Host never renames or relocates an
     * existing default; its initial title is that same name, which browser
     * consumers label in the reader's language.
     * @param signal - caller lifetime; cancels native directory lookup.
     * @returns the durable Workspace, or undefined when first-use initialization is ineligible; creates no Session or message.
     */
    initializeDefault(signal: AbortSignal): Promise<WorkspaceValue | undefined>;
    /**
     * Rename one Workspace to a unique non-blank title.
     * @param request - Workspace identity and proposed title.
     * @returns the updated Workspace projection.
     */
    rename(request: WorkspaceRenameRequest): Promise<WorkspaceValue>;
    /**
     * Remove one Workspace registration while retaining files and Sessions.
     * @param request - Workspace identity to remove.
     * @returns deletion confirmation.
     */
    delete(request: WorkspaceDeleteRequest): Promise<WorkspaceDeleteValue>;
    /**
     * Move one Workspace within the registry display order.
     * @param request - moved Workspace and optional anchor.
     * @returns the complete resulting Workspace order.
     */
    insertBefore(request: WorkspaceInsertBeforeRequest): Promise<WorkspaceOrderValue>;
    /**
     * Move one accounted Session within a Workspace.
     * @param request - Workspace, Session, and optional anchor identities.
     * @returns the updated Workspace projection.
     */
    insertSessionBefore(request: WorkspaceInsertSessionBeforeRequest): Promise<WorkspaceValue>;
    /**
     * Hide one known Session from Workspace grouping surfaces.
     * @param request - Session identity to archive.
     * @returns the complete resulting archive set.
     */
    archiveSession(request: WorkspaceArchiveSessionRequest): Promise<WorkspaceArchiveValue>;
    /**
     * Restore one archived Session to Workspace grouping surfaces.
     * @param request - Session identity to unarchive.
     * @returns the complete resulting archive set.
     */
    unarchiveSession(request: WorkspaceUnarchiveSessionRequest): Promise<WorkspaceArchiveValue>;
    /**
     * Surface one known unarchived Session ahead of unpinned Sessions.
     * @param request - Session identity to pin.
     * @returns the complete resulting pin set, most recently pinned first.
     */
    pinSession(request: WorkspacePinSessionRequest): Promise<WorkspacePinValue>;
    /**
     * Remove one Session's pin without changing its saved Session order.
     * @param request - Session identity to unpin.
     * @returns the complete resulting pin set, most recently pinned first.
     */
    unpinSession(request: WorkspaceUnpinSessionRequest): Promise<WorkspacePinValue>;
    /**
     * Stream a complete Workspace baseline followed by ordered increments. A
     * non-owner receives only the Workspaces and Sessions `allows()` admits.
     * When a delivered Workspace is no longer admitted at its next change or
     * the next order change, the stream sends a `replace` frame with the
     * complete filtered state instead of a `remove`, because a Client never
     * resurrects a removed Workspace; a `remove` frame reports a deletion and
     * reaches only a Client that received that Workspace.
     * @param signal - generation cancellation.
     * @returns baseline followed by ordered Workspace increments.
     */
    follow(signal: AbortSignal): AsyncIterable<WorkspaceFollowFrame>;
}
export default WorkspaceController;
//# sourceMappingURL=index.d.ts.map