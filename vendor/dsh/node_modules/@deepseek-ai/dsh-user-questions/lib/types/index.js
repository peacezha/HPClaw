/**
 * Service Definition for the user-questions capability seam (`ctx.userQuestions`): a UI-backed service for
 * pausing an agent tool call until the human answers a question. The model-
 * facing tool lives in `@deepseek-ai/dsh-tool-ask-user`; UI packages compose
 * answerers on the Agent-scoped Cordis waterfall.
 *
 * @module @deepseek-ai/dsh-user-questions
 */
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
import { createUserMessage, HarnessError } from '@deepseek-ai/dsh-llm';
import { scopeTarget } from '@deepseek-ai/dsh-scope';
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import z from '@deepseek-ai/schemastery';
import { userQuestionProjectionDefinition } from "./projection.js";
import { TimedQuestionWait } from "./timed-wait.js";
export { isTimedAskUserQuestionSchema, TIMED_WAIT_PARAMETER } from "./projection.js";
/** Stable error taxonomy for user-questions failures. */
export class UserQuestionError extends HarnessError {
    constructor(message, code, options) {
        super(message, code, options);
        this.name = 'UserQuestionError';
    }
}
function abortedQuestion(cause) {
    return new UserQuestionError('ask_user_question was aborted before the user answered', 'ASK_ABORTED', cause === undefined ? undefined : { cause });
}
function isRecord(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function restoreUserQuestionError(reason) {
    if (reason instanceof UserQuestionError)
        return reason;
    if (isRecord(reason)
        && reason.name === 'UserQuestionError'
        && typeof reason.message === 'string'
        && typeof reason.code === 'string') {
        return new UserQuestionError(reason.message, reason.code, { cause: reason });
    }
    return reason;
}
/** `ctx.userQuestions`: validation plus the scoped answerer waterfall. */
let UserQuestionService = (() => {
    let _classSuper = TypertRemoteService;
    let _instanceExtraInitializers = [];
    let _answer_decorators;
    let _attachWait_decorators;
    return class UserQuestionService extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _answer_decorators = [Remote];
            _attachWait_decorators = [Remote({ mode: 'stream' })];
            __esDecorate(this, null, _answer_decorators, { kind: "method", name: "answer", static: false, private: false, access: { has: obj => "answer" in obj, get: obj => obj.answer }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _attachWait_decorators, { kind: "method", name: "attachWait", static: false, private: false, access: { has: obj => "attachWait" in obj, get: obj => obj.attachWait }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static Config = z.object({});
        waits = (__runInitializers(this, _instanceExtraInitializers), new Map());
        queuedReplies = new WeakMap();
        constructor(ctx) {
            super(ctx, 'userQuestions');
            ctx.inject(['sessionProjections'], (projectionCtx) => {
                projectionCtx.sessionProjections.register(userQuestionProjectionDefinition);
            });
            ctx.effect(() => () => {
                for (const calls of this.waits.values()) {
                    for (const wait of calls.values())
                        wait.close(abortedQuestion());
                }
                this.waits.clear();
            }, 'userQuestions: foreground waits');
            ctx.on('agent/inbox/claimed', ({ agent, message, turn }) => {
                const source = message.source;
                if (source.kind !== 'user-question-reply')
                    return;
                const calls = this.queuedReplies.get(agent.session) ?? new Map();
                const reply = calls.get(source.callId);
                if (reply === undefined) {
                    calls.set(source.callId, { messageId: message.id, claimedTurn: turn });
                    this.queuedReplies.set(agent.session, calls);
                }
                else if (reply.messageId === message.id) {
                    reply.claimedTurn = turn;
                }
            }, { global: true });
            ctx.on('agent/inbox/discarded', ({ agent, message }) => {
                const source = message.source;
                if (source.kind === 'user-question-reply')
                    this.releaseReply(agent.session, source.callId, message.id);
            }, { global: true });
            ctx.on('session/event', (session, event) => {
                if (event.type === 'user/message') {
                    const source = event.data.source;
                    if (source.kind === 'user-question-reply')
                        this.releaseReply(session, source.callId, event.data.id);
                }
                else if (event.type === 'turn/end') {
                    const calls = this.queuedReplies.get(session);
                    if (calls === undefined)
                        return;
                    for (const [callId, reply] of calls) {
                        if (reply.claimedTurn === event.data.turn)
                            calls.delete(callId);
                    }
                }
            }, { global: true });
        }
        releaseReply(session, callId, messageId) {
            const calls = this.queuedReplies.get(session);
            if (calls?.get(callId)?.messageId !== messageId)
                return;
            calls.delete(callId);
        }
        assertLiveRoot(agent) {
            const agents = this.ctx.get('agents');
            if (agents === undefined || agents.get(agent.id) !== agent) {
                throw new UserQuestionError('human interaction requires the exact live calling agent when an agent is supplied', 'CALLER_NOT_LIVE');
            }
            if (!agents.roots().includes(agent)) {
                throw new UserQuestionError('human interaction is unavailable while the calling agent is owned by another live agent; '
                    + "include the unresolved question or decision in the child agent's final result", 'DELEGATED_CALLER');
            }
        }
        continued(agent) {
            const state = this.ctx.get('sessionProjections')?.stateOf(agent.session, 'userQuestions');
            return (state?.questions.active ?? []).filter(question => question.state === 'continued');
        }
        /**
         * Answer a continued question. The reply is steered into the agent as a
         * user message whose source names the call; that message is also the
         * record that closes the question in the projection.
         * @param agent - Live root agent for the owning Session.
         * @param callId - Continued question identity.
         * @param answer - Complete structured answer batch, one item per question of the call.
         * @returns Whether the question is still continued; an accepted reply stays
         *   queued until the agent admits its user message.
         * @throws {UserQuestionError} `BAD_ANSWER` when the batch does not name each
         *   question of the call exactly once, or `REPLY_QUEUED` when a reply is
         *   already waiting for admission.
         */
        answer(agent, callId, answer) {
            this.assertLiveRoot(agent);
            const question = this.continued(agent).find(item => item.callId === callId);
            if (question === undefined)
                return false;
            const queued = this.queuedReplies.get(agent.session);
            const matches = (message) => message.source.kind === 'user-question-reply' && message.source.callId === callId;
            if (queued?.has(callId) || agent.inbox.nextTurn.some(matches) || agent.inbox.nextStep.some(matches)) {
                throw new UserQuestionError('a reply is already queued for this question', 'REPLY_QUEUED');
            }
            // The gateway validated the batch's shape from the type; the model-facing
            // contract also promises one item per question, which only this owner of
            // the asked questions can check before the batch reaches the model.
            const answered = new Set(answer.answers.map(item => item.id));
            if (answered.size !== answer.answers.length
                || question.questions.length !== answer.answers.length
                || !question.questions.every(item => answered.has(item.id))) {
                throw new UserQuestionError(`the answer batch for ${callId} must name each of its ${String(question.questions.length)} questions exactly once`, 'BAD_ANSWER');
            }
            const message = createUserMessage({
                source: { kind: 'user-question-reply', callId, outcome: 'answered' },
                content: [{
                        type: 'text',
                        text: JSON.stringify({
                            kind: 'answer_to_pending_question', tool: 'ask_user_question', callId,
                            questions: question.questions, answers: answer.answers,
                        }),
                    }],
            });
            const calls = queued ?? new Map();
            calls.set(callId, { messageId: message.id });
            this.queuedReplies.set(agent.session, calls);
            try {
                agent.steer(message);
            }
            catch (error) {
                this.releaseReply(agent.session, callId, message.id);
                throw error;
            }
            return true;
        }
        /**
         * Let one answer UI hold a live timed wait. Closing the stream releases its claim.
         * @param agent - Live root agent owning the question.
         * @param callId - Foreground tool call to attach to.
         * @param signal - Remote stream cancellation, including Client disconnect.
         * @returns One Host-computed remaining duration, or no frames once the wait ended.
         */
        async *attachWait(agent, callId, signal) {
            this.assertLiveRoot(agent);
            const wait = this.waits.get(agent)?.get(callId);
            if (wait !== undefined)
                yield* wait.attach(signal);
        }
        /**
         * Foreground wait whose first settlement the Client decides: the Client
         * rejects with `ASK_TIMED_OUT` when its countdown ends, and this method maps
         * that code to the pending result.
         * @param request - Questions, live owner agent, and abort signal.
         * @param callId - Tool call identity the Client card is keyed by.
         * @param timeoutMs - Positive foreground wait in milliseconds.
         * @returns The answer when it arrives inside the window, otherwise a pending
         *   result, also when no connected Client claimed the request by the deadline.
         * @throws {UserQuestionError} `BAD_TIMEOUT` for a non-integer, non-positive,
         *   or oversized wait.
         */
        async askTimed(request, callId, timeoutMs) {
            if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 2_147_483_647) {
                throw new UserQuestionError('timeout must fit a positive platform timer', 'BAD_TIMEOUT');
            }
            this.assertLiveRoot(request.agent);
            const calls = this.waits.get(request.agent) ?? new Map();
            if (calls.has(callId))
                throw new UserQuestionError('the question call already has a foreground wait', 'DUPLICATE_WAIT');
            const wait = new TimedQuestionWait(Date.now() + timeoutMs, request.signal, new UserQuestionError('ask_user_question timed out before the user answered', 'ASK_TIMED_OUT'));
            calls.set(callId, wait);
            this.waits.set(request.agent, calls);
            try {
                try {
                    return await this.ask({ ...request, signal: wait.signal, wait: { callId, timed: true } });
                }
                catch (error) {
                    if (wait.signal.aborted)
                        throw wait.signal.reason;
                    if (error instanceof UserQuestionError && error.code === 'NO_PROVIDER') {
                        await wait.done;
                        throw wait.signal.reason;
                    }
                    throw error;
                }
            }
            catch (error) {
                if (error instanceof UserQuestionError && error.code === 'ASK_TIMED_OUT')
                    return { pending: true, callId };
                if (wait.signal.aborted)
                    throw abortedQuestion(error);
                throw error;
            }
            finally {
                wait.close(abortedQuestion());
                calls.delete(callId);
                if (calls.size === 0)
                    this.waits.delete(request.agent);
            }
        }
        /**
         * Ask the scoped answerer waterfall and wait for the user's answer.
         *
         * When a caller supplies an agent, human interaction is valid only for the
         * exact live runtime root. Runtime ownership, not durable session lineage,
         * decides this boundary: an owned child has no human answerer and would
         * block forever, while a lineage-bearing session resumed as a new runtime
         * root may ask normally.
         *
         * @param request Questions, owner agent, and abort signal.
         * @returns The answer chosen or typed by the human.
         * @throws {UserQuestionError} code `ASK_ABORTED` when the supplied signal
         *   is already or becomes aborted, `CALLER_NOT_LIVE` when a supplied agent
         *   is not the registry's exact live instance, or `DELEGATED_CALLER` when
         *   that live agent is owned by another agent.
         */
        async ask(request) {
            if (request.signal?.aborted) {
                throw abortedQuestion();
            }
            if (request.questions.length === 0) {
                throw new UserQuestionError('ask_user_question requires at least one question', 'EMPTY_QUESTIONS');
            }
            const agent = request.agent;
            if (agent !== undefined)
                this.assertLiveRoot(agent);
            // A presentation intent asserts two things the types cannot: that the
            // named approve label is one of this question's own options, and that a
            // plan-review carries the plan it is a review of. A UI honouring the
            // intent answers with that label, and shows that detail as the plan, so
            // either gap would put a choice the asker never offered — or an approval of
            // something invisible — in front of the user. Caught at the asker, where
            // the mistake is, rather than in each UI.
            for (const question of request.questions) {
                const intent = question.intent;
                if (intent === undefined)
                    continue;
                if (!(question.options ?? []).some(option => option.label === intent.approve)) {
                    throw new UserQuestionError(`question ${question.id} declares intent ${intent.kind} whose approve label `
                        + `${JSON.stringify(intent.approve)} names none of its options`, 'BAD_INTENT');
                }
                if (question.detail === undefined) {
                    throw new UserQuestionError(`question ${question.id} declares intent ${intent.kind} without the detail it reviews`, 'BAD_INTENT');
                }
            }
            const noAnswerer = () => Promise.reject(new UserQuestionError('no user-questions answerer accepted the request', 'NO_PROVIDER'));
            try {
                return await (agent === undefined
                    ? this.ctx.waterfall('user-questions/request', request, noAnswerer)
                    : this.ctx.waterfall(scopeTarget(agent, agent), 'user-questions/request', { ...request, agent }, noAnswerer));
            }
            catch (error) {
                const restored = restoreUserQuestionError(error);
                if (restored instanceof UserQuestionError)
                    throw restored;
                if (request.signal?.aborted) {
                    throw abortedQuestion(error);
                }
                throw restored;
            }
        }
    };
})();
export { UserQuestionService };
export default UserQuestionService;
//# sourceMappingURL=index.js.map