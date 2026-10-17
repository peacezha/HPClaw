/** Question composer props and one pending Remote waterfall response. */
import type { InjectFace, PropsLocale, PropsRenderSlots, PropsRuntime, PropsStore } from '@deepseek-ai/dsh-client-ui-slots';
import type { ToolCallId } from '@deepseek-ai/dsh-llm/brand';
import type { SessionId } from '@deepseek-ai/dsh-session/types';
import type { AskUserQuestionAnswer, AskUserQuestionAnswerItem, AskUserQuestionItem, UserQuestionState } from '@deepseek-ai/dsh-user-questions/types';
import type { createQuestionDraftStore } from '../draft-store.ts';
declare module '@deepseek-ai/dsh-client-ui-session/client' {
    interface SessionPendingInteractionMap {
        /** Pending question or plan-review request. */
        question: PendingQuestion;
    }
}
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface SlotMap {
        /** Actions for the exact plan under review; approval remains with the question composer. */
        'conversation.plan-review.actions': {
            kind: 'list';
            scope: 'session';
            owner: {
                review: PlanReview;
                requestKey: PendingQuestion['key'];
            };
        };
    }
}
/** One structured answer batch covering every question of the request. */
export type QuestionAnswer = AskUserQuestionAnswer;
/** One question of the request. */
type QuestionItem = AskUserQuestionItem;
/** One option the asker offered on a question. */
type QuestionOption = NonNullable<QuestionItem['options']>[number];
/**
 * A request narrowed to the `plan-review` presentation intent: everything the
 * decision card renders and answers with, so the panel never re-reads the
 * request fields. `approve` and `decline` are the asker's own options — an
 * answer must carry one of those labels verbatim — and `plan` is the markdown
 * body under review.
 */
export interface PlanReview {
    /** The reviewed question's id, echoed in the answer. */
    id: string;
    /** The question text, kept as the card's accessible name. */
    question: string;
    /** The plan markdown under review. */
    plan: string;
    /** Logged tool invocation used to reopen this plan. */
    callId?: ToolCallId;
    /** The option that approves the plan. */
    approve: QuestionOption;
    /** The option that declines it; absent when the asker offered no other option. */
    decline?: QuestionOption;
}
/**
 * Narrow a request to a renderable plan review, or return undefined to leave it
 * to the generic question flow.
 *
 * The card offers approval and a return to the composer for change requests.
 * It accepts one question carrying the plan as detail and the named approve
 * option, with at most one alternative and no multi-select. Larger choices
 * remain in the generic question flow.
 *
 * @param questions - the request's whole question batch.
 * @returns The narrowed review, or undefined when the generic flow owns it.
 */
export declare function planReviewOf(questions: readonly QuestionItem[]): PlanReview | undefined;
/** Rejection codes a Client returns through the waterfall; the wire preserves `name` and `code`. */
export type QuestionRejectionCode = 'ASK_ABORTED' | 'ASK_CANCELLED' | 'ASK_TIMED_OUT';
/** One live Host waterfall attached to a card; it settles once and then detaches. */
export interface QuestionWaterfallChannel {
    /** Client-clock deadline in epoch milliseconds; absent for a blocking question. */
    readonly deadline: number | undefined;
    /** Resolve the Host waterfall with the whole answer batch. */
    resolve(answer: QuestionAnswer): void;
    /** Reject the Host waterfall with a wire-preserved code. */
    reject(code: Exclude<QuestionRejectionCode, 'ASK_ABORTED'>): void;
    /** Hand the request to the next waterfall listener. */
    delegate(): void;
}
/** The Remote answer path of a continued question. */
export interface QuestionRpcChannel {
    /** Steer the answer into the agent; false when the question is no longer continued. Rejects when a reply is already queued. */
    answer(answer: QuestionAnswer): Promise<boolean>;
}
/** The composer seat a card occupies while it is visible. */
export interface QuestionSeat {
    /** Withdraw the card from the pending-interaction registry without ending the request. */
    hide(): void;
}
/** One waterfall request as the Remote Event listener awaits it. */
export interface QuestionWaterfallRequest {
    readonly channel: QuestionWaterfallChannel;
    /** Outcome returned to the Host: the answer, or a wire-preserved rejection. */
    readonly result: Promise<QuestionAnswer>;
    /**
     * Test whether a rejection asks the listener to call `next()`.
     * @param reason - rejection received from {@link QuestionWaterfallRequest.result}.
     * @returns whether {@link QuestionWaterfallChannel.delegate} produced it.
     */
    isDelegation(reason: unknown): boolean;
}
/**
 * Create the deferred one Remote Event listener settles through a card.
 * The request signal ends the channel with `ASK_ABORTED`; the Host ignores that
 * outcome for an event it already finished, so a cancel frame loses nothing.
 * @param deadline - Client-clock deadline in epoch milliseconds derived from the business claim's remaining duration.
 * @param signal - Delivery lifetime of the forwarded request.
 * @param onSettle - Called once with the channel when it settles or aborts.
 * @returns The channel to attach and the promise the listener awaits.
 */
export declare function createWaterfallRequest(deadline: number | undefined, signal: AbortSignal | undefined, onSettle: (channel: QuestionWaterfallChannel) => void): QuestionWaterfallRequest;
/** Reactive card state read by every mounted presentation of one question. */
export interface QuestionCardSnapshot {
    /** Mirrors the projection row; `open` until the projection says otherwise. */
    readonly state: UserQuestionState;
    /** User-visible foreground wait presentation. */
    readonly waitState: 'counting' | 'focused' | 'editing' | 'waiting' | 'continued';
    /**
     * Foreground countdown presentation, absent for a request that carried no
     * deadline. The card owns the ticking, so a hidden panel keeps counting and
     * still times out; `running` is false while a hold or an edit froze it.
     */
    readonly countdown: {
        readonly remainingMs: number;
        readonly running: boolean;
    } | undefined;
    /** Channel a submission would use right now. */
    readonly channel: 'waterfall' | 'rpc' | 'none';
    /** Set once the card left the registry; the mounted composer clears its draft on this. */
    readonly closed: boolean;
}
/**
 * One answerable Client card. A card keyed by tool call is created by whichever
 * source arrives first, the forwarded waterfall or the Session projection, and
 * removed only when the projection no longer lists the call.
 */
export declare class PendingQuestion {
    #private;
    /** Presentation discriminator used by Session pending-interaction consumers. */
    readonly kind: 'question' | 'plan-review';
    /** Render identity and request key for the Session-scoped draft store. */
    readonly key: string;
    /** Agent/Session identity owning the request. */
    readonly sessionId: SessionId;
    /** The request's question list. */
    readonly questions: readonly AskUserQuestionItem[];
    /** Tool call identity; absent for a blocking request that carried no `wait`. */
    readonly callId: ToolCallId | undefined;
    /**
     * Recorded answers of a call that already settled. Present only on a
     * read-only review card, which the tool call row builds from its own
     * transcript so a finished question can be read back in the panel that
     * asked it. Such a card has no answer channel and no countdown.
     */
    readonly review: readonly AskUserQuestionAnswerItem[] | undefined;
    /**
     * What closing the panel does. A card keyed by tool call stays reachable
     * from its tool call row, so closing only withdraws the panel (`hide`) and
     * persists nothing. A card the Host never named has no way back, so closing
     * it ends the request (`cancel`).
     */
    readonly dismissal: 'hide' | 'cancel';
    /**
     * @param sessionId - Agent/Session identity owning the request.
     * @param questions - complete question batch.
     * @param callId - tool call identity when the Host named one.
     * @param siblings - keys of every card currently registered for the Session, for draft pruning.
     * @param review - recorded answers of a settled call, making this a read-only card.
     */
    constructor(sessionId: SessionId, questions: readonly AskUserQuestionItem[], callId?: ToolCallId, siblings?: () => readonly string[], review?: readonly AskUserQuestionAnswerItem[]);
    /**
     * Card key of a tool call, shared by every source that names one. The Host
     * request and the Session projection carry the branded `ToolCallId`; a
     * transcript row carries the same wire value as a plain string.
     * @param sessionId - owning Session.
     * @param callId - tool call identity, branded or as a transcript spells it.
     * @returns the render identity and draft key.
     */
    static keyOf(sessionId: SessionId, callId: string): string;
    /**
     * Draft keys that are still live in this Session, this card included.
     * @returns keys the draft store must keep; everything else is stale.
     */
    liveKeys(): readonly string[];
    /** Subscribe to card state changes. */
    readonly subscribe: (listener: () => void) => (() => void);
    /** Read the stable current card state. */
    readonly snapshot: () => QuestionCardSnapshot;
    /** Observable snapshot read by the renderer's keyed Hook. */
    readonly getSnapshot: () => QuestionCardSnapshot;
    private createSnapshot;
    private publish;
    /**
     * Attach the live waterfall of a forwarded request.
     * @param channel - request channel created by {@link createWaterfallRequest}.
     */
    attachWaterfall(channel: QuestionWaterfallChannel): void;
    /**
     * Drop a waterfall channel that settled or was cancelled; the card stays.
     * @param channel - the channel that ended.
     */
    detachWaterfall(channel: QuestionWaterfallChannel): void;
    /**
     * Whether a live waterfall is attached.
     * @returns whether the pending Host request still accepts settlement.
     */
    hasWaterfall(): boolean;
    /**
     * Attach the Remote answer path used once the question is continued.
     * @param channel - Remote calls bound to this Session and call.
     */
    attachRpc(channel: QuestionRpcChannel): void;
    /**
     * Attach the composer seat this card is published into.
     * @param seat - withdrawal of the published panel, owned by the card registry.
     */
    attachSeat(seat: QuestionSeat): void;
    /**
     * Copy the projection row state.
     * @param state - `open` or `continued`.
     */
    setState(state: UserQuestionState): void;
    /** Stop this Client's countdown indefinitely; the waterfall then waits like a blocking question. */
    takeTime(): void;
    /**
     * Record focus even before the request arrives, freezing a pristine countdown once attached.
     * @param now - current Client epoch time.
     */
    holdFocus(now?: number): void;
    /**
     * Resume a pristine countdown after the answer surface loses focus.
     * @param now - current Client epoch time.
     */
    releaseFocus(now?: number): void;
    /**
     * Keep the first edited draft answerable without a foreground deadline.
     * @param now - current Client epoch time used to preserve the remaining duration.
     */
    engage(now?: number): void;
    /** Local countdown reached zero: settle the waterfall with `ASK_TIMED_OUT`, keep the card. */
    timeout(): void;
    /** Hand a live waterfall to the next listener when this presentation domain unloads. */
    delegate(): void;
    /** Mark the card removed from the registry; the mounted composer clears its draft. */
    close(): void;
    /**
     * Submit the whole answer batch through the live waterfall, or through the
     * Remote path once the question is continued.
     * @param answer - complete structured answer batch.
     */
    answer(answer: QuestionAnswer): Promise<void>;
    /**
     * Close the panel. A tool-call-keyed card only leaves the composer seat: the
     * request stands, the countdown keeps running here, and the tool call row
     * reopens it. A card the Host never named ends its request instead, because
     * nothing could bring it back.
     */
    dismiss(): Promise<void>;
}
/** Pending value returned by the composer-chain selector. */
export type QuestionWait = PendingQuestion;
/**
 * Full component props: the framework runtime share (chain currency +
 * session/global standard kit) plus the chain `matched` share — the entry's
 * selector result, already narrowed to the question carrier — plus the
 * standard locale seat; the carrier plus the domain face above carry the
 * whole behavior surface.
 */
export type QuestionComposerProps = PropsRuntime<'conversation.composer'> & PropsStore<ReturnType<typeof createQuestionDraftStore>> & PropsRenderSlots<'conversation.plan-review.actions'> & InjectFace<{
    keyedHooks: {
        questionCard: (key: string) => PendingQuestion | undefined;
    };
}> & {
    matched: QuestionWait;
} & PropsLocale<'question'>;
export {};
//# sourceMappingURL=slots.d.ts.map