/** Session Remote owner: cold reads, explicit Agent commands, and live control state. */
import { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import { nativeFileApplications, openNativeFileApplication } from '@deepseek-ai/dsh-native-command';
import type { SessionId } from '@deepseek-ai/dsh-session';
import type { SessionInspection } from '@deepseek-ai/dsh-session-persistence';
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import { type ApiSessionAgentResult } from './agent.ts';
import { buildModelCatalog } from './catalog.ts';
import type { ModelCatalog, SessionWorkspacePathApplication, SessionAttachmentRequest, SessionAttachmentValue, SessionCancelRequest, SessionCancelValue, SessionControlFrame, SessionCreateRequest, SessionCreateValue, SessionFollowFrame, SessionFollowRequest, SessionForkRequest, SessionForkValue, SessionListRequest, SessionListValue, SessionOpenWorkspacePathRequest, SessionOpenWorkspacePathValue, SessionPage, SessionPageRequest, SessionPromptRequest, SessionPromptValue, SessionRenameRequest, SessionRenameValue, SessionSearchRequest, SessionSearchValue, SessionSelectModelRequest, SessionSelectModelValue, SessionProjectionsRequest, SessionProjectionsValue, SessionUpdateQueueRequest, SessionUpdateQueueValue } from './types.ts';
export type * from './types.ts';
export { ApiSessionNotFound } from './agent.ts';
export { SessionFileReferences } from './file-references.ts';
export { SessionSkillCatalog } from './skill-catalog.ts';
declare module '@deepseek-ai/cordis' {
    interface Context {
        /** Host Session business API and Remote namespace owner. */
        sessionController: SessionController;
    }
}
/** Session Controller deployment policy. */
export interface Config {
    /** Override platform desktop-opener detection. */
    readonly nativeOpen?: boolean;
    /** Positive integral milliseconds of list work before yielding between complete rows. */
    readonly listWorkSliceMs?: number;
}
/** Deployment policy after schema defaults have been applied. */
type ResolvedConfig = Config & {
    readonly listWorkSliceMs: number;
};
/** Host integrations replaceable by direct unit tests. */
export interface SessionControllerInternals {
    /** Native default-application handoff. */
    readonly openPath?: (path: string, signal: AbortSignal) => Promise<void>;
    /** Native file-association query. */
    readonly fileApplications?: typeof nativeFileApplications;
    /** Explicit registered-application handoff. */
    readonly openFileApplication?: typeof openNativeFileApplication;
    /** Native file-manager handoff. */
    readonly revealPath?: (path: string, signal: AbortSignal) => Promise<void>;
    /** Native handoff availability probe. */
    readonly canOpenPath?: () => boolean;
}
/** Host service backing the generated `ctx.remote.session` namespace. */
export declare class SessionController extends TypertRemoteService {
    static inject: string[];
    static Config: z<Config, ResolvedConfig>;
    private readonly agents;
    private readonly commands;
    private readonly controlState;
    private readonly history;
    private readonly listState;
    private readonly openPath;
    private readonly fileApplications;
    private readonly openFileApplication;
    private readonly revealPath;
    private readonly canOpenPath;
    private readonly promotions;
    /**
     * @param ctx - Host context containing the Session capability assembly.
     * @param config - native-opener and list-scheduling deployment policy.
     * @param internals - host integrations replaceable by direct unit tests.
     */
    constructor(ctx: Context, config: Config, internals?: SessionControllerInternals);
    private promote;
    /**
     * Resolve or resume one ordinary Session for another Host API domain.
     * @param sessionId - Session identity whose Agent owns the operation.
     * @returns the live Agent or the stable Session-domain failure.
     */
    resolveAgent(sessionId: SessionId): Promise<ApiSessionAgentResult>;
    /**
     * Inspect one attached or persisted Session without activating its Agent.
     * @param sessionId - durable Session identity.
     * @param signal - optional caller cancellation for persistence reads.
     * @returns the current attached state or persisted header and event prefix.
     */
    inspect(sessionId: SessionId, signal?: AbortSignal): Promise<SessionInspection>;
    /**
     * Read all visible Session rows without resuming an Agent.
     * @param _request - reserved empty list request.
     * @param signal - cancellation for persistence reads and summary generation.
     * @returns visible Session summaries ordered by activity.
     */
    list(_request: SessionListRequest, signal: AbortSignal): Promise<SessionListValue>;
    /**
     * Search visible Session content without resuming an Agent. A non-owner
     * receives only the hits whose Session `allows()` admits; `hasMore`
     * describes the bounded result before that filtering.
     * @param request - literal message-content query.
     * @param signal - cancellation for list and search reads.
     * @returns authorized bounded Session search results.
     */
    search(request: SessionSearchRequest, signal: AbortSignal): Promise<SessionSearchValue>;
    /**
     * Create one ordinary Session for a new conversation, reusing the named blank Session while it is reusable.
     * @param request - optional blank Session to reuse, location, and Agent preset.
     * @returns the created or reused Session identity and its preset when configured.
     */
    create(request: SessionCreateRequest): Promise<SessionCreateValue>;
    /**
     * Select one Session-local model after explicitly resuming the Session; save the default in the background.
     * @param request - Session identity and requested model selection.
     * @returns the normalized selection installed for the Session, without waiting for default persistence.
     */
    selectModel(request: SessionSelectModelRequest): Promise<SessionSelectModelValue>;
    /**
     * Select the first available account model after login when no provider API key is configured.
     * @returns after saving the first available model or retaining the existing default.
     */
    initializeDefaultModel(): Promise<void>;
    /**
     * Describe every currently routable model for Host-generation selectors.
     * @returns provider-grouped models, the deployment default, and isolated provider failures.
     */
    modelCatalog(): Promise<ModelCatalog>;
    /**
     * Report whether this deployment can hand a Session workspace path to a native desktop.
     * @returns true when the matching open operation is available.
     */
    canOpenWorkspacePath(): boolean;
    /**
     * Describe the serving desktop for authenticated file-action routes.
     * @returns Host name, configured availability, and platform-specific file-manager behavior.
     */
    workspaceDesktop(): {
        name: string;
        available: boolean;
        fileManager: 'finder' | 'explorer' | 'directory' | null;
    };
    /**
     * Verify one path through the composed filesystem and open it on the Host desktop.
     * @param request - path after best-effort Session workspace resolution.
     * @param signal - caller lifetime; abort terminates the native command.
     * @returns confirmation after the native opener accepts the path.
     * @throws RemoteError when the request is invalid, has no verified Host mapping, is cancelled, or the opener fails.
     */
    openWorkspacePath(request: SessionOpenWorkspacePathRequest, signal: AbortSignal): Promise<SessionOpenWorkspacePathValue>;
    /**
     * Query current file handlers on the serving desktop without activating an Agent.
     * @param request - file path in Host filesystem syntax.
     * @param signal - caller lifetime, propagated to filesystem and desktop queries.
     * @returns OS application names, icons, and default selection; empty when desktop opening is unavailable.
     * @throws RemoteError when the path is invalid, the query is cancelled, or native discovery fails.
     */
    workspacePathApplications(request: {
        readonly path: string;
    }, signal: AbortSignal): Promise<readonly SessionWorkspacePathApplication[]>;
    private verifyDesktopPath;
    /**
     * Rename one Session after explicitly resuming it.
     * @param request - Session identity and proposed title.
     * @returns the accepted title and durable event sequence.
     */
    rename(request: SessionRenameRequest): Promise<SessionRenameValue>;
    /**
     * Fork one cold-readable exact event prefix into a new Session. An omitted
     * boundary selects the latest completed-turn prefix; an open cut receives
     * synthetic fork closers.
     * @param request - source Session, optional exact inclusive event boundary, and migration preflight choice.
     * @returns the new Session identity.
     */
    fork(request: SessionForkRequest): Promise<SessionForkValue>;
    /**
     * Admit one prompt after explicitly resuming its Session.
     * @param request - Session identity, prompt content, source metadata, and delivery mode.
     * @param signal - caller cancellation before prompt admission begins.
     * @returns acknowledgement that the Agent accepted the prompt.
     */
    prompt(request: SessionPromptRequest, signal: AbortSignal): Promise<SessionPromptValue>;
    /**
     * Read one image proven reachable from the addressed Session log.
     * @param request - Session and attachment identities used for authorization.
     * @returns the durable attachment reference and base64-encoded bytes.
     */
    attachment(request: SessionAttachmentRequest): Promise<SessionAttachmentValue>;
    /**
     * Mutate one still-pending queue occurrence, resuming a cold Agent first.
     * @param request - Session, queue item, and requested mutation.
     * @returns acknowledgement that the queue mutation was applied.
     */
    updateQueue(request: SessionUpdateQueueRequest): Promise<SessionUpdateQueueValue>;
    /**
     * Cancel one active Agent turn without dropping its pending inbox.
     * @param request - Session whose active Agent turn is cancelled.
     * @returns acknowledgement that cancellation was requested.
     */
    cancel(request: SessionCancelRequest): SessionCancelValue;
    /**
     * Read one cold-safe, message-aligned Session history page.
     * @param request - durable address, backward cursor, and page budget.
     * @param signal - cancellation for persistence reads.
     * @returns one chronological page.
     */
    page(request: SessionPageRequest, signal: AbortSignal): Promise<SessionPage>;
    /**
     * Follow one Session log from its opening or resume cursor.
     * @param request - durable address and last committed sequence already held by the caller.
     * @param signal - cancellation owned by the Remote stream carrier.
     * @returns a complete opening snapshot followed by gap-free durable event
     *   frames and optional cursorless assistant-stream frames.
     */
    follow(request: SessionFollowRequest, signal: AbortSignal): AsyncIterable<SessionFollowFrame>;
    /**
     * Read exact projections, returning cached hints only when migration is required.
     * @param request - Session whose current values are required.
     * @param signal - cancellation for the Session read.
     * @returns a sequenced baseline, cached hints when migration is deferred, or null when absent.
     */
    projections(request: SessionProjectionsRequest, signal: AbortSignal): Promise<SessionProjectionsValue>;
    private liveProjections;
    /**
     * Stream a complete live-control baseline followed by replacement frames.
     * @param signal - cancellation owned by the Remote stream carrier.
     * @returns one complete baseline followed by live replacement frames.
     */
    control(signal: AbortSignal): AsyncIterable<SessionControlFrame>;
}
export { buildModelCatalog };
export default SessionController;
//# sourceMappingURL=index.d.ts.map