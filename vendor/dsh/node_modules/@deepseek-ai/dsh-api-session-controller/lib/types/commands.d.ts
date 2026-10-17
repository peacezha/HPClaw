/** Session commands whose activation policy is explicit at each Remote method. */
import type { Context } from '@deepseek-ai/cordis';
import type { MessageSource } from '@deepseek-ai/dsh-llm';
import { ApiSessionAgentController } from './agent.ts';
import type { SessionAttachmentRequest, SessionAttachmentValue, SessionCancelRequest, SessionCancelValue, SessionCreateRequest, SessionCreateValue, SessionForkRequest, SessionForkValue, SessionPromptRequest, SessionPromptValue, SessionRenameRequest, SessionRenameValue, SessionSelectModelRequest, SessionSelectModelValue, SessionUpdateQueueRequest, SessionUpdateQueueValue } from './types.ts';
type PromptContentCandidate = SessionPromptRequest['content'][number] | Extract<SessionUpdateQueueRequest['action'], {
    readonly kind: 'edit';
}>['content'][number];
/**
 * Whether prompt content carries non-whitespace text or an attachment.
 * @param content - submitted or edited prompt parts.
 * @returns false for content the Agent must not receive.
 */
export declare function hasPromptContent(content: readonly PromptContentCandidate[]): boolean;
/** Implements Session business commands delegated by the Session Controller Remote service. */
export declare class SessionCommandController {
    private readonly ctx;
    private readonly agents;
    private readonly defaultCwd;
    /**
     * @param ctx - Host context carrying Agent, model, attachment, title, and Workspace services.
     * @param agents - sole owner of create, resume, and Session-local model selection.
     * @param defaultCwd - project directory used when create names neither a Workspace nor a cwd.
     */
    constructor(ctx: Context, agents: ApiSessionAgentController, defaultCwd: string);
    /**
     * Create one ordinary Session for a new conversation, reusing the named
     * blank Session while it is an unarchived member of the requested Workspace.
     * @param request - optional blank Session to reuse, location, and Agent preset.
     * @returns the created or reused Session identity and its preset when configured.
     */
    create(request: SessionCreateRequest): Promise<SessionCreateValue>;
    /**
     * Validate and install one Session-local model selection; save the default in the background.
     * @param request - Session identity and requested model selection.
     * @returns the normalized selection installed for the Session, without waiting for default persistence.
     */
    selectModel(request: SessionSelectModelRequest): Promise<SessionSelectModelValue>;
    /**
     * Normalize and append a user-owned Session title.
     * @param request - Session identity and proposed title.
     * @returns the accepted title and durable event sequence.
     */
    rename(request: SessionRenameRequest): Promise<SessionRenameValue>;
    /**
     * Create a new ordinary Session from an exact event prefix. An explicit
     * `atSeq` is the inclusive cut; an omitted value selects the latest
     * completed-turn prefix. An open cut receives synthetic fork closers.
     * @param request - source Session and optional exact event boundary.
     * @returns the new Session identity.
     */
    fork(request: SessionForkRequest): Promise<SessionForkValue>;
    /**
     * Admit one prompt after Agent and attachment validation; the Remote method
     * has already validated the content and built the durable message source.
     * @param request - Session identity, prompt content, and delivery mode.
     * @param source - the `user-rpc` source recorded on the accepted message.
     * @returns acknowledgement that the Agent accepted the prompt.
     */
    prompt(request: SessionPromptRequest, source: MessageSource): Promise<SessionPromptValue>;
    private requireModel;
    /**
     * Read one durable image after proving the Session log references it.
     * @param request - Session and attachment identities used for authorization.
     * @returns the durable attachment reference and base64-encoded bytes.
     */
    attachment(request: SessionAttachmentRequest): Promise<SessionAttachmentValue>;
    /**
     * Mutate one pending Inbox occurrence, restoring an ordinary cold Agent when needed.
     * @param request - Session, queue item, and requested mutation.
     * @returns acknowledgement that the queue mutation was applied.
     */
    updateQueue(request: SessionUpdateQueueRequest): Promise<SessionUpdateQueueValue>;
    /**
     * Cancel one live ordinary Agent while retaining pending inbox work.
     * @param request - Session whose active Agent turn is cancelled.
     * @returns acknowledgement that cancellation was requested.
     */
    cancel(request: SessionCancelRequest): SessionCancelValue;
    private resolveAgent;
    private rejectCreation;
    private readSessionState;
    private forkWorkspace;
}
export {};
//# sourceMappingURL=commands.d.ts.map