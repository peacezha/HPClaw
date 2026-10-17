/**
 * Shared execution policy for model-backed session-title providers: route
 * preparation, input/token/time bounds, cancellation, exact auxiliary request
 * logging, and stream assembly. Title wording, length targets, reasoning
 * selection, and output interpretation belong to each provider.
 * @module @deepseek-ai/dsh-session-title-llm
 */
import type { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import type { ContextFormed } from '@deepseek-ai/dsh-llm';
declare module '@deepseek-ai/dsh-llm' {
    interface MessageSourceMap {
        'dsh-session-title-llm': {
            kind: 'dsh-session-title-llm';
        } & ContextFormed;
    }
}
import type { ContentBlock, FinishReason, LlmResolvedModelInfo, Message, ReasoningEffortId } from '@deepseek-ai/dsh-llm';
import type { SessionSeq } from '@deepseek-ai/dsh-session';
import { SessionTitleProviderId } from '@deepseek-ai/dsh-session-title';
import type { SessionTitleModelIdentity, SessionTitleProviderRequest } from '@deepseek-ai/dsh-session-title';
/** Exact model-visible request recorded before one auxiliary title dispatch. */
export interface SessionTitleLlmRequestEventData {
    /** Registered title-provider identity responsible for the request. */
    readonly titleProvider: SessionTitleProviderId;
    /** Exact human `user/message` seqs represented in `messages`. */
    readonly messageSeqs: SessionSeq[];
    /** Exact auxiliary LLM route. */
    readonly route: SessionTitleModelIdentity;
    /** Exact auxiliary system prompt. */
    readonly system: string;
    /** Exact auxiliary message list. */
    readonly messages: Message[];
    /** Exact auxiliary output-token cap. */
    readonly maxTokens: number;
    /** Resolved reasoning effort when recorded; older requests can omit it. */
    readonly reasoningEffort?: ReasoningEffortId;
}
declare module '@deepseek-ai/dsh-session/types' {
    interface SessionEventMap {
        /** Log-only pre-dispatch record of one session-title model request. */
        'session/title-llm-request': SessionTitleLlmRequestEventData;
    }
}
/** Capability-owned timeout reason code for auxiliary title requests. */
export declare const SESSION_TITLE_TIMEOUT_CODE = "SESSION_TITLE_TIMEOUT";
/** Required execution controls for one model-backed title request. */
export interface SessionTitleLlmConfig {
    /** Maximum UTF-8 bytes in the provider-prepared user input. */
    readonly maxInputBytes: number;
    /** Output-token cap for the title request, independent of conversation requests. */
    readonly maxOutputTokens: number;
    /** End-to-end auxiliary request deadline in milliseconds. */
    readonly timeoutMs: number;
    /** Optional explicit provider route; must be paired with `model`. */
    readonly provider?: string;
    /** Optional explicit model id; must be paired with `provider`. */
    readonly model?: string;
}
/** Validated immutable execution controls. */
export interface ResolvedSessionTitleLlmConfig extends SessionTitleLlmConfig {
}
/** Shared Loader field schemas with no library defaults. */
export declare const SessionTitleLlmConfigFields: {
    maxInputBytes: z<number, number, "defined">;
    maxOutputTokens: z<number, number, "defined">;
    timeoutMs: z<number, number, "defined">;
    provider: z<string, string, "plain">;
    model: z<string, string, "plain">;
};
/** Shared Loader schema with no library defaults. */
export declare const SessionTitleLlmConfigSchema: z<SessionTitleLlmConfig>;
/**
 * Validate and detach required execution controls.
 * @param config - untrusted execution configuration.
 * @returns immutable controls with optional route absence preserved.
 */
export declare function resolveSessionTitleLlmConfig(config: SessionTitleLlmConfig): ResolvedSessionTitleLlmConfig;
/**
 * Provider-prepared model input, source-message attribution, and the
 * provider-owned reasoning selector forwarded to `ctx.llm.prepareCall`.
 */
export interface SessionTitleLlmPreparedRequest {
    /** Exact system prompt supplied by the provider. */
    readonly system: string;
    /** Exact user message text supplied by the provider, including any framing. */
    readonly input: string;
    /** Exact human `user/message` seqs represented by `input`, in log order. */
    readonly messageSeqs: readonly SessionSeq[];
    /**
     * Provider-owned reasoning selection for the captured route. The execution
     * module combines only the returned effort with its fixed output-token cap.
     * @param model - detached, deeply frozen metadata from the captured adapter generation.
     * @returns a supported effort id, or `undefined` to use the route's normal default.
     */
    readonly selectReasoningEffort: (model: Readonly<LlmResolvedModelInfo>) => ReasoningEffortId | undefined;
}
/** Terminal finish kinds forwarded to a provider for its own interpretation. */
export type SessionTitleLlmFinish = Extract<FinishReason, {
    kind: 'stop' | 'tool-calls' | 'max-tokens';
}>;
/** Assembled auxiliary model response for one provider to interpret. */
export interface SessionTitleLlmResponse {
    /** Assembled content blocks in stream order; the provider rejects unwanted block types. */
    readonly blocks: readonly ContentBlock[];
    /** Terminal finish reason forwarded without title-output interpretation. */
    readonly finish: SessionTitleLlmFinish;
    /** Exact auxiliary model route that produced the response. */
    readonly model: SessionTitleModelIdentity;
}
/**
 * Execute one prepared auxiliary title request.
 *
 * The provider owns the system prompt, user input, reasoning selection, and
 * output interpretation. This function owns route preparation, the final input
 * byte limit, the output-token cap, the end-to-end deadline, cancellation, the
 * exact `session/title-llm-request` record, and stream assembly.
 * @param ctx - context exposing the registered LLM service.
 * @param config - validated execution controls.
 * @param request - service-owned session, route, message snapshot, current title, and cancellation.
 * @param titleProvider - registered title-provider identity recorded with the request.
 * @param prepared - provider system prompt, input, source-message seqs, and reasoning selector.
 * @returns assembled response blocks, terminal finish, and the exact route used.
 * @throws {Error} when input bounds, route preparation, the deadline, cancellation, or an operational finish failure occurs.
 */
export declare function executeSessionTitleLlm(ctx: Context, config: ResolvedSessionTitleLlmConfig, request: SessionTitleProviderRequest, titleProvider: SessionTitleProviderId, prepared: SessionTitleLlmPreparedRequest): Promise<SessionTitleLlmResponse>;
//# sourceMappingURL=index.d.ts.map