/** Client Session object layer, Agent scopes, and Remote lifecycle wiring. */
import type { Context } from '@deepseek-ai/cordis';
export { createSessionControlStream, SessionEventStream, SESSION_SEARCH_RESULT_LIMIT, SESSION_SEARCH_SNIPPET_MAX_CODE_POINTS, } from './transport.ts';
export type { ClientSessionPageRequest, SessionControlStream, SessionControlStreamOptions, SessionEventStreamOptions, SessionJournalChange, SessionRemote, } from './transport.ts';
export { createScope, scopeOf } from './scope.ts';
export type { AgentContext, AgentScopeHandle } from './scope.ts';
export { SessionCreateError, SessionForkError } from './sessions/service.ts';
export type { SessionBinding, SessionListState, SessionSummary } from './sessions/service.ts';
export type { SessionListPhase, SessionListSnapshot, SessionSearchResultItem, SessionProjectionSnapshot, } from './sessions/manager.ts';
export type { Session } from './sessions/session.ts';
export type { ProjectionsBaseline, ProjectionValueStore, SessionProjectionMap, UseProjection, } from './sessions/projection-store.ts';
export type { BeginSubmissionInput, ISession, PendingSubmissionRetirement, ProjectionsFace, SessionFace, SubmissionHandle, } from './contract/session.ts';
export type { ISessions, SessionReference, SessionRetainInfo, SessionRetainOptions, SessionTarget, } from './contract/sessions.ts';
export { MutableSessionEventSource } from './contract/events.ts';
export type { AssistantLiveChunkEvent, SessionAssistantSettlementEntry, SessionEventChange, SessionEventLike, SessionEventLikeEntry, SessionEventSource, SessionEventWindow, SessionLiveEventEntry, SessionTransientEventEntry, } from './contract/events.ts';
export type { OpenState, PendingSubmission, PendingSubmissionAttachment, PendingSubmissionFileAttachment, PendingSubmissionImage, PendingSubmissionImageAttachment, PendingSubmissionPlacement, PromptError, SessionSnapshot, } from './contract/snapshot.ts';
/** Consumer-owned reference labels; extend this map through the package's canonical /client entry. */
export interface SessionReferenceSourceMap {
    /** Temporary Client Controller work, including fork-title preparation. */
    controllerOperation: unknown;
    /** A Client Gateway invocation's synchronous Context ownership. */
    gateway: unknown;
}
/** Declaration-merge-extensible labels carried by independent Client references. */
export type SessionReferenceSource = Extract<keyof SessionReferenceSourceMap, string>;
declare module '@deepseek-ai/cordis' {
    interface Context {
        /** Client Session object layer and Agent scope owner. */
        sessions: import('./contract/sessions.ts').ISessions;
    }
}
/** Required Remote and Context projection services. */
export declare const inject: string[];
/**
 * Install Client Session state and its reconnecting control stream.
 * @param ctx - Client Cordis context.
 */
export declare function apply(ctx: Context): void;
//# sourceMappingURL=index.d.ts.map