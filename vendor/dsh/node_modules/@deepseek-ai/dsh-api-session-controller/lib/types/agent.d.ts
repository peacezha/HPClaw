/** Agent activation, composition, and model-selection policy owned by API Session. */
import type { Context } from '@deepseek-ai/cordis';
import type { Agent, AgentSetup, ModelSelection as AgentModelSelection, ModelSelectionRef } from '@deepseek-ai/dsh-agent';
import type { Session, SessionId } from '@deepseek-ai/dsh-session';
import type { SessionInspection } from '@deepseek-ai/dsh-session-persistence';
import { type SessionObservation } from '@deepseek-ai/dsh-session-query';
import { RemoteError } from '@deepseek-ai/dsh-typert-protocol';
/** Cold Session identity absent from persistence. */
export declare class ApiSessionNotFound extends Error {
}
/** Session identity whose lifecycle belongs to subagent routing. */
export declare class ApiSessionSubagentOwnership extends Error {
    readonly sessionId: SessionId;
    /** @param sessionId - identity reserved to subagent routing. */
    constructor(sessionId: SessionId);
}
/** Explicit-id creation attempted to adopt a Session under another cwd. */
export declare class ApiSessionCwdConflict extends Error {
    readonly sessionId: SessionId;
    readonly requestedCwd: string;
    readonly existingCwd: string | undefined;
    constructor(sessionId: SessionId, requestedCwd: string, existingCwd: string | undefined);
}
/** Reuse of a Session named an Agent preset while the deployment composes no preset roster. */
export declare class ApiSessionPresetConflict extends Error {
    readonly sessionId: SessionId;
    readonly requestedPreset: string;
    constructor(sessionId: SessionId, requestedPreset: string);
}
/** Placement and Agent preset for one Session created for a new conversation. */
export interface ApiSessionCreateRequest {
    /** Blank Session to reuse, or the identity of a new Session when none is stored under it. */
    readonly sessionId?: SessionId;
    /** Directory the Session owns. */
    readonly cwd: string;
    /** Preset the Session runs; the configured default when omitted. */
    readonly agentPreset?: string;
    /**
     * Placement rule the caller owns, such as Workspace membership and archive state.
     * @param sessionId - existing Session named by the request.
     * @returns whether that Session may be reused.
     */
    readonly reusable: (sessionId: SessionId) => boolean;
}
/** The Session one creation request created or reused. */
export interface ApiSessionCreated {
    /** Live Agent of the Session. */
    readonly agent: Agent;
    /** Preset the Session ran when the request finished, before a later request for the same identity; absent without a roster. */
    readonly agentPreset: string | undefined;
}
/** Resolved preset and pre-publication Agent setup for one create or resume. */
interface ApiSessionComposition {
    readonly agentPreset?: string;
    readonly setup: AgentSetup;
}
/** Failures produced while resolving one ordinary Session identity to its live Agent. */
export type ApiSessionAgentError = RemoteError<'session/not-found' | 'session/agent-busy' | 'session/writer-held' | 'gateway/internal'>;
/** Result of resolving one ordinary Session identity to its live Agent. */
export type ApiSessionAgentResult = {
    readonly agent: Agent;
} | {
    readonly error: ApiSessionAgentError;
};
type InstalledSelection = ModelSelectionRef & {
    current: AgentModelSelection;
    consume(provider: string, model: string, reasoningEffort: string | undefined): boolean;
};
/**
 * Test whether generic Session routing must leave an identity to subagent routing.
 * @param ctx - Host context carrying the Agent ownership registry.
 * @param session - attached or live Session whose ownership is tested.
 * @param agent - live Agent when one exists for the Session.
 * @returns whether subagent routing owns the Session identity.
 */
export declare function hasApiSessionSubagentOwner(ctx: Context, session: Pick<Session, 'header'>, agent: Agent | undefined): boolean;
/**
 * Build the stable caller-facing subagent ownership rejection.
 * @param sessionId - Session identity owned by subagent routing.
 * @returns a stable Session-domain failure.
 */
export declare function apiSessionSubagentOwnershipError(sessionId: SessionId): ApiSessionAgentError;
/**
 * Inspect one cold Session without repairing, resuming, or publishing it.
 * @param ctx - Host context carrying Session persistence.
 * @param sessionId - durable Session identity.
 * @param signal - optional cancellation for persistence reads.
 * @returns the persisted header and complete event prefix.
 */
export declare function inspectApiSession(ctx: Context, sessionId: SessionId, signal?: AbortSignal): Promise<SessionInspection>;
/** Owns every operation that may create, resume, or configure a Web Agent. */
export declare class ApiSessionAgentController {
    private readonly ctx;
    private readonly resumes;
    private readonly claims;
    private readonly selections;
    private readonly imageAdmissionChains;
    /** @param ctx - Host context carrying Agent, model, persistence, and Typert services. */
    constructor(ctx: Context);
    /**
     * Resolve or resume one ordinary Session, deduplicating concurrent resumes.
     * @param sessionId - ordinary Session identity.
     * @returns the live Agent or a stable Session-domain failure.
     */
    resolveAgent(sessionId: SessionId): Promise<ApiSessionAgentResult>;
    /**
     * Resolve one ordinary Session from an already-retained exact observation.
     * @param observation - Host-owned observation whose preparation stays pinned through setup.
     * @returns the live Agent or a stable Session-domain failure.
     */
    resolveObservedAgent(observation: SessionObservation): Promise<ApiSessionAgentResult>;
    private resolve;
    /**
     * Create a Session for a new conversation, reusing the named blank Session
     * while it is still reusable. A reused Session runs the requested preset, or
     * the configured default when the request names none; the preset it recorded
     * is not resolved, and a change is logged as `agent-preset/selected` before
     * the Agent is published. A named Session that has started a turn, fails the
     * caller's placement rule, or is written by another owner stays unchanged,
     * and a new Session is created instead. Requests naming one identity run in
     * arrival order, including their preset resolution, and check the named
     * Session's directory and ownership before resolving the preset.
     * @param request - optional Session to reuse, directory, preset, and placement rule.
     * @returns the reused or created Session and the preset it ran when this request finished.
     * @throws ApiSessionCwdConflict when the named Session belongs to another directory.
     * @throws ApiSessionSubagentOwnership when subagent routing owns the named Session.
     * @throws RemoteError `agent-preset/not-found` or `agent-preset/invalid` for the requested or default preset.
     * @throws ApiSessionPresetConflict when no roster is composed and the request names a preset for a reused Session.
     */
    createSession(request: ApiSessionCreateRequest): Promise<ApiSessionCreated>;
    /**
     * Install or return the Session-local model selection used by prompt assembly.
     * @param agent - live Agent that owns the selection.
     * @returns the installed mutable selection reference.
     */
    selectionFor(agent: Agent): InstalledSelection;
    /**
     * Commit and cache one validated selection for the next prompt assembly.
     * @param agent - live Agent that owns the selection.
     * @param selection - validated selection to record and apply.
     */
    selectForNextRequest(agent: Agent, selection: AgentModelSelection): void;
    /**
     * Let a matching durable request header retire the execution cache.
     * @param agent - live Agent whose request was recorded.
     * @param provider - provider route used by the request.
     * @param model - provider-owned model used by the request.
     * @param reasoningEffort - adapter-owned effort used by the request.
     * @returns whether the pending selection was consumed.
     */
    consumeSelection(agent: Agent, provider: string, model: string, reasoningEffort: string | undefined): boolean;
    /**
     * Read the current Agent preset from the Session projection.
     * @param session - live Session whose projection state is available.
     * @returns the current preset, or undefined when the capability is absent.
     */
    presetForSession(session: Session): string | undefined;
    /**
     * Serialize image admission and model selection for one Agent.
     * @param agent - live Agent that owns the serialization chain.
     * @param operation - asynchronous operation admitted after prior work settles.
     * @returns the operation result or rejection.
     */
    serializeImageAdmission<Value>(agent: Agent, operation: () => Promise<Value>): Promise<Value>;
    /**
     * Resolve the preset id and pre-publication Agent setup for a create or resume.
     * @param presetId - requested preset or the configured default when omitted.
     * @returns the resolved preset identity and Agent setup callback.
     */
    composeAgent(presetId: string | undefined): Promise<ApiSessionComposition>;
    private liveAgent;
    private resume;
    private resumeObserved;
    private inOrder;
    /** @returns the reused Session, a new Session under `sessionId` when none is stored, or a new Session under a minted identity. */
    private claim;
    /** @returns the live blank Session under the requested preset, or undefined when it cannot be reused. */
    private reuseLive;
    /** Setup that re-checks blankness under the acquired writer, then records a preset change before publication. */
    private reuseSetup;
    /** Whether no turn has started, by the predicate the preset registry's `select` enforces. */
    private isBlank;
    /** Without a roster, reuse cannot apply a named preset. */
    private assertPresetApplicable;
    private created;
    private createMinted;
    private createAgent;
    private agentOptions;
    private installSelection;
    /**
     * Read the current Agent preset from an all-projections observation.
     * @param observation - exact Session observation carrying its projection snapshot.
     * @returns the current preset, or undefined when the capability is absent.
     */
    presetForObservation(observation: SessionObservation): string | undefined;
}
export {};
//# sourceMappingURL=agent.d.ts.map