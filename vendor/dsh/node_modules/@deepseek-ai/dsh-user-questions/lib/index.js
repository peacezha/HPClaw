import { HarnessError, ToolCallId, createUserMessage } from "@deepseek-ai/dsh-llm";
import { scopeTarget } from "@deepseek-ai/dsh-scope";
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import z from "@deepseek-ai/schemastery";
import { z as z$1 } from "zod";
import { SessionLogOffset, TOOL_OUTCOME_UNKNOWN } from "@deepseek-ai/dsh-session";
/**
* Model-facing parameter only the timed `ask_user_question` schema declares.
* Its presence in the logged request header is what tells the fold that the
* `ask_user_question` calls that follow can be continued past a timeout; the
* blocking legacy schema never declares it.
*/
const TIMED_WAIT_PARAMETER = "timeout";
const toolOptionSchema = z$1.object({
	label: z$1.string(),
	description: z$1.string().optional()
}).loose();
const toolQuestionSchema = z$1.object({
	id: z$1.string(),
	question: z$1.string(),
	header: z$1.string().optional(),
	options: z$1.array(toolOptionSchema).optional(),
	multi_select: z$1.boolean().optional()
}).loose();
const toolArgumentsSchema = z$1.object({ questions: z$1.array(toolQuestionSchema).min(1) }).loose();
const optionSchema = z$1.object({
	label: z$1.string(),
	description: z$1.string().optional()
}).strict().transform((option) => ({
	label: option.label,
	...option.description === void 0 ? {} : { description: option.description }
}));
const questionSchema = z$1.object({
	id: z$1.string(),
	question: z$1.string(),
	detail: z$1.string().optional(),
	header: z$1.string().optional(),
	options: z$1.array(optionSchema).optional(),
	multiSelect: z$1.boolean().optional()
}).strict().transform((question) => ({
	id: question.id,
	question: question.question,
	...question.detail === void 0 ? {} : { detail: question.detail },
	...question.header === void 0 ? {} : { header: question.header },
	...question.options === void 0 ? {} : { options: question.options },
	...question.multiSelect === void 0 ? {} : { multiSelect: question.multiSelect }
}));
const pendingQuestionsSchema = z$1.array(z$1.object({
	callId: z$1.string().min(1).transform(ToolCallId),
	questions: z$1.array(questionSchema).min(1),
	state: z$1.enum(["open", "continued"])
}).strict()).superRefine((active, context) => {
	if (new Set(active.map((question) => question.callId)).size !== active.length) context.addIssue({
		code: "custom",
		message: "callIds must be unique"
	});
});
const answerSchema = z$1.object({
	id: z$1.string(),
	selected: z$1.array(z$1.string()),
	custom: z$1.string().optional()
}).strict().transform((answer) => ({
	id: answer.id,
	selected: answer.selected,
	...answer.custom === void 0 ? {} : { custom: answer.custom }
}));
const settledQuestionsSchema = z$1.array(z$1.object({
	callId: z$1.string().min(1).transform(ToolCallId),
	answers: z$1.array(answerSchema)
}).strict());
const projectionViewSchema = z$1.object({
	active: pendingQuestionsSchema,
	settled: settledQuestionsSchema
}).strict();
/** The `answers` batch as both the in-time tool result and the steered late reply spell it. */
const answerBatchSchema = z$1.object({ answers: z$1.array(answerSchema) }).loose();
const initialFold = {
	timed: false,
	questions: {
		active: [],
		settled: []
	}
};
function isRecord$1(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
/**
* Whether one logged tool schema is the timed `ask_user_question` tool's.
* @param tool - One entry of a request header's assembled tool schemas.
* @returns True only for an `ask_user_question` schema whose parameters declare {@link TIMED_WAIT_PARAMETER}.
*/
function isTimedAskUserQuestionSchema(tool) {
	if (tool.name !== "ask_user_question") return false;
	const properties = tool.parameters["properties"];
	return isRecord$1(properties) && "timeout" in properties;
}
/**
* Read the question batch out of logged `ask_user_question` arguments.
* @param argumentsText - Raw JSON arguments recorded on the `tool/call` event.
* @returns The questions in service vocabulary, or null when the arguments are unreadable.
*/
function questionsOf(argumentsText) {
	let parsed;
	try {
		parsed = JSON.parse(argumentsText);
	} catch (error) {
		return null;
	}
	const result = toolArgumentsSchema.safeParse(parsed);
	if (!result.success) return null;
	return result.data.questions.map((question) => ({
		id: question.id,
		question: question.question,
		...question.header === void 0 ? {} : { header: question.header },
		...question.options === void 0 ? {} : { options: question.options.map((option) => ({
			label: option.label,
			...option.description === void 0 ? {} : { description: option.description }
		})) },
		...question.multi_select === void 0 ? {} : { multiSelect: question.multi_select }
	}));
}
function isPendingResult(content) {
	const text = content.find((block) => block.type === "text");
	if (text === void 0) return false;
	try {
		const parsed = JSON.parse(text.text);
		return typeof parsed === "object" && parsed !== null && parsed.pending === true;
	} catch (error) {
		return false;
	}
}
/**
* Read the answer batch out of one recorded text: a tool result or a late reply.
* @param content - Content blocks of the recorded message.
* @returns The batch, or null when the text carries none this reader can use.
*/
function answerBatchOf(content) {
	const text = content.find((block) => block.type === "text");
	if (text === void 0) return null;
	let parsed;
	try {
		parsed = JSON.parse(text.text);
	} catch (error) {
		return null;
	}
	const result = answerBatchSchema.safeParse(parsed);
	return result.success ? result.data.answers : null;
}
/**
* Close one answerable question and keep the answers it settled with.
* A reply whose call is no longer answerable changes nothing.
* @param view - Current question state.
* @param callId - Call the result or reply named.
* @param answers - The batch it carried; empty when a late reply carried none.
* @returns The same view when that call was not answerable, otherwise the updated one.
*/
function settleQuestion(view, callId, answers) {
	const question = view.active.find((item) => item.callId === callId);
	if (question === void 0) return view;
	return {
		active: view.active.filter((item) => item.callId !== callId),
		settled: [...view.settled, {
			callId: question.callId,
			answers
		}]
	};
}
/**
* Apply one Session event to this Session's question fold.
* A `request/header` decides, from the assembled tool schemas it records,
* whether the `ask_user_question` calls that follow are timed; a call made
* under the blocking legacy schema is never tracked, so a Session that only
* ever used that tool folds to the empty view. A tracked question stays
* answerable as `continued` in exactly two cases: the tool returned the
* pending payload, or Session resume repair appended the synthetic
* `TOOL_OUTCOME_UNKNOWN` result for a call the process never finished. An
* answer batch settles it with that batch; any failure drops it. A PTC
* sub-call enters the fold when its recorded result is pending. A late reply
* settles only when the agent admits its user message; queued inbox messages
* can still be discarded before that point.
* @param fold - Current fold state.
* @param event - Next Session event in append order.
* @returns The same fold when the event is unrelated, otherwise the updated one.
*/
function applyUserQuestionEvent(fold, event) {
	const view = fold.questions;
	switch (event.type) {
		case "request/header": {
			const tools = event.data.header.tools;
			const timed = Array.isArray(tools) && tools.some((tool) => isRecord$1(tool) && typeof tool.name === "string" && isRecord$1(tool.parameters) && isTimedAskUserQuestionSchema({
				name: tool.name,
				parameters: tool.parameters
			}));
			return timed === fold.timed ? fold : {
				...fold,
				timed
			};
		}
		case "tool/call": {
			if (!fold.timed || event.data.name !== "ask_user_question") return fold;
			const questions = questionsOf(event.data.arguments);
			if (questions === null) return fold;
			const callId = event.data.callId;
			return {
				...fold,
				questions: {
					...view,
					active: [...view.active.filter((question) => question.callId !== callId), {
						callId,
						questions,
						state: "open"
					}]
				}
			};
		}
		case "tool/result": {
			const callId = event.data.message.toolCallId;
			if (!view.active.some((question) => question.callId === callId)) return fold;
			if (isPendingResult(event.data.message.content) || event.data.error?.code === TOOL_OUTCOME_UNKNOWN) return {
				...fold,
				questions: {
					...view,
					active: view.active.map((question) => question.callId === callId ? {
						...question,
						state: "continued"
					} : question)
				}
			};
			const answers = event.data.error === void 0 && event.data.message.isError !== true ? answerBatchOf(event.data.message.content) : null;
			return {
				...fold,
				questions: answers === null ? {
					...view,
					active: view.active.filter((question) => question.callId !== callId)
				} : settleQuestion(view, callId, answers)
			};
		}
		case "tool/ptc-dispatch": {
			if (event.data.name !== "ask_user_question" || event.data.isError || !isPendingResult(event.data.content)) return fold;
			const questions = questionsOf(JSON.stringify(event.data.arguments));
			if (questions === null) return fold;
			const callId = event.data.subCallId;
			return {
				...fold,
				questions: {
					...view,
					active: [...view.active.filter((question) => question.callId !== callId), {
						callId,
						questions,
						state: "continued"
					}]
				}
			};
		}
		case "user/message": {
			const source = event.data.source;
			if (source.kind !== "user-question-reply") return fold;
			const questions = settleQuestion(view, source.callId, answerBatchOf(event.data.content) ?? []);
			return questions === view ? fold : {
				...fold,
				questions
			};
		}
		default: return fold;
	}
}
/** Session projection exposing open, continued, and settled timed questions to every Client. */
const userQuestionProjectionDefinition = {
	key: "userQuestions",
	stateSchema: z$1.object({
		inheritedEventCount: z$1.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER).transform(SessionLogOffset),
		timed: z$1.boolean(),
		questions: projectionViewSchema
	}).strict(),
	init: (_header, inheritedEventCount) => ({
		inheritedEventCount,
		...initialFold
	}),
	apply: (state, event) => {
		if (event.seq < state.inheritedEventCount) return state;
		const fold = applyUserQuestionEvent(state, event);
		return fold === state ? state : {
			...state,
			...fold
		};
	},
	wire: {
		viewSchema: projectionViewSchema,
		view: (state) => state.questions
	},
	stateVersion: 2
};
//#endregion
//#region lib/types/timed-wait.js
/** Foreground question lifetime and Client claims; durable question state stays in the projection. */
/** One live foreground wait, counted by the Host only while no answer UI holds it. */
var TimedQuestionWait = class {
	deadline;
	parent;
	timeout;
	controller = new AbortController();
	completion = Promise.withResolvers();
	claims = /* @__PURE__ */ new Set();
	timer;
	/**
	* @param deadline - Host-clock deadline used while no Client holds the wait.
	* @param parent - Calling Turn's cancellation signal.
	* @param timeout - Business error used to settle an unattended wait.
	*/
	constructor(deadline, parent, timeout) {
		this.deadline = deadline;
		this.parent = parent;
		this.timeout = timeout;
		parent?.addEventListener("abort", this.parentAborted, { once: true });
		if (parent?.aborted === true) this.parentAborted();
		else this.schedule();
	}
	/** Cancellation shared with the foreground waterfall, not with the calling Turn. */
	get signal() {
		return this.controller.signal;
	}
	/** Settles when the wait is cancelled, expires, or is disposed. */
	get done() {
		return this.completion.promise;
	}
	parentAborted = () => {
		this.close(this.parent?.reason);
	};
	schedule() {
		clearTimeout(this.timer);
		this.timer = void 0;
		if (this.signal.aborted || this.claims.size > 0) return;
		this.timer = setTimeout(() => {
			this.close(this.timeout);
		}, Math.max(0, this.deadline - Date.now()));
	}
	/**
	* Hold the wait for one answer UI until its stream closes or the question settles.
	* @param signal - This business stream's cancellation lifetime.
	* @returns One remaining-duration frame; completion releases the claim.
	*/
	async *attach(signal) {
		if (signal.aborted || this.signal.aborted) return;
		if (this.claims.size === 0 && Date.now() >= this.deadline) {
			this.close(this.timeout);
			return;
		}
		const ended = Promise.withResolvers();
		const release = () => {
			if (!this.claims.delete(release)) return;
			signal.removeEventListener("abort", release);
			this.signal.removeEventListener("abort", release);
			ended.resolve();
			this.schedule();
		};
		this.claims.add(release);
		signal.addEventListener("abort", release, { once: true });
		this.signal.addEventListener("abort", release, { once: true });
		this.schedule();
		try {
			yield { remainingMs: Math.max(0, this.deadline - Date.now()) };
			await ended.promise;
		} finally {
			release();
		}
	}
	/**
	* Release timers, parent cancellation, and all Client claims.
	* @param reason - Cancellation delivered to the foreground waterfall.
	*/
	close(reason) {
		if (this.signal.aborted) return;
		clearTimeout(this.timer);
		this.timer = void 0;
		this.parent?.removeEventListener("abort", this.parentAborted);
		this.controller.abort(reason);
		this.completion.resolve();
	}
};
//#endregion
//#region lib/types/index.js
/**
* Service Definition for the user-questions capability seam (`ctx.userQuestions`): a UI-backed service for
* pausing an agent tool call until the human answers a question. The model-
* facing tool lives in `@deepseek-ai/dsh-tool-ask-user`; UI packages compose
* answerers on the Agent-scoped Cordis waterfall.
*
* @module @deepseek-ai/dsh-user-questions
*/
var __runInitializers = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
var __esDecorate = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) if (kind === "field") initializers.unshift(_);
		else descriptor[key] = _;
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
/** Stable error taxonomy for user-questions failures. */
var UserQuestionError = class extends HarnessError {
	constructor(message, code, options) {
		super(message, code, options);
		this.name = "UserQuestionError";
	}
};
function abortedQuestion(cause) {
	return new UserQuestionError("ask_user_question was aborted before the user answered", "ASK_ABORTED", cause === void 0 ? void 0 : { cause });
}
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function restoreUserQuestionError(reason) {
	if (reason instanceof UserQuestionError) return reason;
	if (isRecord(reason) && reason.name === "UserQuestionError" && typeof reason.message === "string" && typeof reason.code === "string") return new UserQuestionError(reason.message, reason.code, { cause: reason });
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
			_attachWait_decorators = [Remote({ mode: "stream" })];
			__esDecorate(this, null, _answer_decorators, {
				kind: "method",
				name: "answer",
				static: false,
				private: false,
				access: {
					has: (obj) => "answer" in obj,
					get: (obj) => obj.answer
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _attachWait_decorators, {
				kind: "method",
				name: "attachWait",
				static: false,
				private: false,
				access: {
					has: (obj) => "attachWait" in obj,
					get: (obj) => obj.attachWait
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			if (_metadata) Object.defineProperty(this, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		static Config = z.object({});
		waits = (__runInitializers(this, _instanceExtraInitializers), /* @__PURE__ */ new Map());
		queuedReplies = /* @__PURE__ */ new WeakMap();
		constructor(ctx) {
			super(ctx, "userQuestions");
			ctx.inject(["sessionProjections"], (projectionCtx) => {
				projectionCtx.sessionProjections.register(userQuestionProjectionDefinition);
			});
			ctx.effect(() => () => {
				for (const calls of this.waits.values()) for (const wait of calls.values()) wait.close(abortedQuestion());
				this.waits.clear();
			}, "userQuestions: foreground waits");
			ctx.on("agent/inbox/claimed", ({ agent, message, turn }) => {
				const source = message.source;
				if (source.kind !== "user-question-reply") return;
				const calls = this.queuedReplies.get(agent.session) ?? /* @__PURE__ */ new Map();
				const reply = calls.get(source.callId);
				if (reply === void 0) {
					calls.set(source.callId, {
						messageId: message.id,
						claimedTurn: turn
					});
					this.queuedReplies.set(agent.session, calls);
				} else if (reply.messageId === message.id) reply.claimedTurn = turn;
			}, { global: true });
			ctx.on("agent/inbox/discarded", ({ agent, message }) => {
				const source = message.source;
				if (source.kind === "user-question-reply") this.releaseReply(agent.session, source.callId, message.id);
			}, { global: true });
			ctx.on("session/event", (session, event) => {
				if (event.type === "user/message") {
					const source = event.data.source;
					if (source.kind === "user-question-reply") this.releaseReply(session, source.callId, event.data.id);
				} else if (event.type === "turn/end") {
					const calls = this.queuedReplies.get(session);
					if (calls === void 0) return;
					for (const [callId, reply] of calls) if (reply.claimedTurn === event.data.turn) calls.delete(callId);
				}
			}, { global: true });
		}
		releaseReply(session, callId, messageId) {
			const calls = this.queuedReplies.get(session);
			if (calls?.get(callId)?.messageId !== messageId) return;
			calls.delete(callId);
		}
		assertLiveRoot(agent) {
			const agents = this.ctx.get("agents");
			if (agents === void 0 || agents.get(agent.id) !== agent) throw new UserQuestionError("human interaction requires the exact live calling agent when an agent is supplied", "CALLER_NOT_LIVE");
			if (!agents.roots().includes(agent)) throw new UserQuestionError("human interaction is unavailable while the calling agent is owned by another live agent; include the unresolved question or decision in the child agent's final result", "DELEGATED_CALLER");
		}
		continued(agent) {
			return ((this.ctx.get("sessionProjections")?.stateOf(agent.session, "userQuestions"))?.questions.active ?? []).filter((question) => question.state === "continued");
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
			const question = this.continued(agent).find((item) => item.callId === callId);
			if (question === void 0) return false;
			const queued = this.queuedReplies.get(agent.session);
			const matches = (message) => message.source.kind === "user-question-reply" && message.source.callId === callId;
			if (queued?.has(callId) || agent.inbox.nextTurn.some(matches) || agent.inbox.nextStep.some(matches)) throw new UserQuestionError("a reply is already queued for this question", "REPLY_QUEUED");
			const answered = new Set(answer.answers.map((item) => item.id));
			if (answered.size !== answer.answers.length || question.questions.length !== answer.answers.length || !question.questions.every((item) => answered.has(item.id))) throw new UserQuestionError(`the answer batch for ${callId} must name each of its ${String(question.questions.length)} questions exactly once`, "BAD_ANSWER");
			const message = createUserMessage({
				source: {
					kind: "user-question-reply",
					callId,
					outcome: "answered"
				},
				content: [{
					type: "text",
					text: JSON.stringify({
						kind: "answer_to_pending_question",
						tool: "ask_user_question",
						callId,
						questions: question.questions,
						answers: answer.answers
					})
				}]
			});
			const calls = queued ?? /* @__PURE__ */ new Map();
			calls.set(callId, { messageId: message.id });
			this.queuedReplies.set(agent.session, calls);
			try {
				agent.steer(message);
			} catch (error) {
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
			if (wait !== void 0) yield* wait.attach(signal);
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
			if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 2147483647) throw new UserQuestionError("timeout must fit a positive platform timer", "BAD_TIMEOUT");
			this.assertLiveRoot(request.agent);
			const calls = this.waits.get(request.agent) ?? /* @__PURE__ */ new Map();
			if (calls.has(callId)) throw new UserQuestionError("the question call already has a foreground wait", "DUPLICATE_WAIT");
			const wait = new TimedQuestionWait(Date.now() + timeoutMs, request.signal, new UserQuestionError("ask_user_question timed out before the user answered", "ASK_TIMED_OUT"));
			calls.set(callId, wait);
			this.waits.set(request.agent, calls);
			try {
				try {
					return await this.ask({
						...request,
						signal: wait.signal,
						wait: {
							callId,
							timed: true
						}
					});
				} catch (error) {
					if (wait.signal.aborted) throw wait.signal.reason;
					if (error instanceof UserQuestionError && error.code === "NO_PROVIDER") {
						await wait.done;
						throw wait.signal.reason;
					}
					throw error;
				}
			} catch (error) {
				if (error instanceof UserQuestionError && error.code === "ASK_TIMED_OUT") return {
					pending: true,
					callId
				};
				if (wait.signal.aborted) throw abortedQuestion(error);
				throw error;
			} finally {
				wait.close(abortedQuestion());
				calls.delete(callId);
				if (calls.size === 0) this.waits.delete(request.agent);
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
			if (request.signal?.aborted) throw abortedQuestion();
			if (request.questions.length === 0) throw new UserQuestionError("ask_user_question requires at least one question", "EMPTY_QUESTIONS");
			const agent = request.agent;
			if (agent !== void 0) this.assertLiveRoot(agent);
			for (const question of request.questions) {
				const intent = question.intent;
				if (intent === void 0) continue;
				if (!(question.options ?? []).some((option) => option.label === intent.approve)) throw new UserQuestionError(`question ${question.id} declares intent ${intent.kind} whose approve label ${JSON.stringify(intent.approve)} names none of its options`, "BAD_INTENT");
				if (question.detail === void 0) throw new UserQuestionError(`question ${question.id} declares intent ${intent.kind} without the detail it reviews`, "BAD_INTENT");
			}
			const noAnswerer = () => Promise.reject(new UserQuestionError("no user-questions answerer accepted the request", "NO_PROVIDER"));
			try {
				return await (agent === void 0 ? this.ctx.waterfall("user-questions/request", request, noAnswerer) : this.ctx.waterfall(scopeTarget(agent, agent), "user-questions/request", {
					...request,
					agent
				}, noAnswerer));
			} catch (error) {
				const restored = restoreUserQuestionError(error);
				if (restored instanceof UserQuestionError) throw restored;
				if (request.signal?.aborted) throw abortedQuestion(error);
				throw restored;
			}
		}
	};
})();
//#endregion
export { TIMED_WAIT_PARAMETER, UserQuestionError, UserQuestionService, UserQuestionService as default, isTimedAskUserQuestionSchema };
