import z from "@deepseek-ai/schemastery";
import { BlockAssembler, createUserMessage } from "@deepseek-ai/dsh-llm";
import { MAX_TIMER_DELAY_MS, deadline } from "@deepseek-ai/dsh-timeout";
import { assertNever, deepFreeze } from "@deepseek-ai/dsh-util-values";
//#region lib/types/index.js
/**
* Shared execution policy for model-backed session-title providers: route
* preparation, input/token/time bounds, cancellation, exact auxiliary request
* logging, and stream assembly. Title wording, length targets, reasoning
* selection, and output interpretation belong to each provider.
* @module @deepseek-ai/dsh-session-title-llm
*/
var __addDisposableResource = function(env, value, async) {
	if (value !== null && value !== void 0) {
		if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
		var dispose, inner;
		if (async) {
			if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
			dispose = value[Symbol.asyncDispose];
		}
		if (dispose === void 0) {
			if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
			dispose = value[Symbol.dispose];
			if (async) inner = dispose;
		}
		if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
		if (inner) dispose = function() {
			try {
				inner.call(this);
			} catch (e) {
				return Promise.reject(e);
			}
		};
		env.stack.push({
			value,
			dispose,
			async
		});
	} else if (async) env.stack.push({ async: true });
	return value;
};
var __disposeResources = (function(SuppressedError) {
	return function(env) {
		function fail(e) {
			env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
			env.hasError = true;
		}
		var r, s = 0;
		function next() {
			while (r = env.stack.pop()) try {
				if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
				if (r.dispose) {
					var result = r.dispose.call(r.value);
					if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) {
						fail(e);
						return next();
					});
				} else s |= 1;
			} catch (e) {
				fail(e);
			}
			if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
			if (env.hasError) throw env.error;
		}
		return next();
	};
})(typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
	var e = new Error(message);
	return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
/** Capability-owned timeout reason code for auxiliary title requests. */
const SESSION_TITLE_TIMEOUT_CODE = "SESSION_TITLE_TIMEOUT";
/** Shared Loader field schemas with no library defaults. */
const SessionTitleLlmConfigFields = {
	maxInputBytes: z.number().step(1).min(1).required(),
	maxOutputTokens: z.number().step(1).min(1).required(),
	timeoutMs: z.number().step(1).min(1).max(MAX_TIMER_DELAY_MS).required(),
	provider: z.string(),
	model: z.string()
};
/** Shared Loader schema with no library defaults. */
const SessionTitleLlmConfigSchema = z.object(SessionTitleLlmConfigFields);
/** Complete execution-control key set for direct construction validation. */
const CONFIG_KEYS = new Set([
	"maxInputBytes",
	"maxOutputTokens",
	"timeoutMs",
	"provider",
	"model"
]);
/** Validate one positive integer limit. */
function assertPositiveInteger(name, value) {
	if (!Number.isInteger(value) || value <= 0) throw new Error(`session-title-llm: ${name} must be a positive integer`);
}
/**
* Validate and detach required execution controls.
* @param config - untrusted execution configuration.
* @returns immutable controls with optional route absence preserved.
*/
function resolveSessionTitleLlmConfig(config) {
	const candidate = config;
	if (candidate === null || typeof candidate !== "object") throw new Error("session-title-llm: configuration is required");
	const value = candidate;
	for (const key of Object.keys(value)) if (!CONFIG_KEYS.has(key)) throw new Error(`session-title-llm: unknown config key "${key}"`);
	assertPositiveInteger("maxInputBytes", value.maxInputBytes);
	assertPositiveInteger("maxOutputTokens", value.maxOutputTokens);
	assertPositiveInteger("timeoutMs", value.timeoutMs);
	if (value.timeoutMs > MAX_TIMER_DELAY_MS) throw new Error(`session-title-llm: timeoutMs must not exceed ${MAX_TIMER_DELAY_MS}`);
	const hasProvider = value.provider !== void 0;
	if (hasProvider !== (value.model !== void 0)) throw new Error("session-title-llm: provider and model must be supplied together");
	if (hasProvider && (typeof value.provider !== "string" || value.provider.length === 0 || typeof value.model !== "string" || value.model.length === 0)) throw new Error("session-title-llm: provider and model overrides must be non-empty strings");
	return deepFreeze({ ...value });
}
/** Resolve the explicit pair or the exact route captured from `request/header`. */
function resolveRoute(config, request) {
	if (config.provider !== void 0 && config.model !== void 0) return {
		provider: config.provider,
		model: config.model
	};
	if (request.route === void 0) throw new Error("session-title-llm: no logged request route is available; configure provider and model together");
	return request.route;
}
/**
* Classify one terminal finish reason. Operational failures throw; every other
* terminal kind is returned for the provider to accept or reject.
* @param finish - terminal finish reason from the assembled stream.
* @returns the provider-facing finish reason.
* @throws {Error} on a provider or caller abort, or an impossible finish variant.
*/
function terminalFinish(finish) {
	switch (finish.kind) {
		case "stop":
		case "tool-calls":
		case "max-tokens": return finish;
		case "error":
		case "aborted": {
			const error = new Error(finish.failure.message);
			error.code = finish.failure.code;
			throw error;
		}
		/* v8 ignore next -- closed FinishReason union exhaustiveness guard */
		default: return assertNever(finish, "FinishReason");
	}
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
async function executeSessionTitleLlm(ctx, config, request, titleProvider, prepared) {
	const env_1 = {
		stack: [],
		error: void 0,
		hasError: false
	};
	try {
		request.signal.throwIfAborted();
		if (prepared.messageSeqs.length === 0) throw new Error("session-title-llm: at least one source message is required");
		const inputBytes = Buffer.byteLength(prepared.input, "utf8");
		if (inputBytes > config.maxInputBytes) throw new Error(`session-title-llm: input is ${inputBytes} bytes, exceeding maxInputBytes ${config.maxInputBytes}`);
		const route = resolveRoute(config, request);
		const messages = [createUserMessage({
			content: [{
				type: "text",
				text: prepared.input
			}],
			source: { kind: "dsh-session-title-llm" }
		})];
		const callDeadline = __addDisposableResource(env_1, deadline(request.signal, config.timeoutMs, SESSION_TITLE_TIMEOUT_CODE), false);
		const maxTokens = config.maxOutputTokens;
		const call = await ctx.llm.prepareCall({
			...route,
			maxTokens
		}, callDeadline.signal, (controls, model) => {
			const effort = prepared.selectReasoningEffort(model);
			return {
				...controls,
				...effort === void 0 ? {} : { reasoningEffort: effort }
			};
		});
		const options = deepFreeze({
			...call.config,
			messages,
			system: prepared.system,
			sessionId: request.session.id,
			purpose: "session-title",
			signal: callDeadline.signal
		});
		request.session.append("session/title-llm-request", {
			titleProvider,
			messageSeqs: [...prepared.messageSeqs],
			route,
			system: prepared.system,
			messages,
			maxTokens,
			...call.config.reasoningEffort === void 0 ? {} : { reasoningEffort: call.config.reasoningEffort }
		});
		callDeadline.signal.throwIfAborted();
		const assembler = new BlockAssembler();
		for await (const chunk of call.stream(options)) {
			callDeadline.signal.throwIfAborted();
			assembler.push(chunk);
		}
		callDeadline.signal.throwIfAborted();
		const finish = terminalFinish(assembler.finish);
		return {
			blocks: assembler.blocks(),
			finish,
			model: route
		};
	} catch (e_1) {
		env_1.error = e_1;
		env_1.hasError = true;
	} finally {
		__disposeResources(env_1);
	}
}
//#endregion
export { SESSION_TITLE_TIMEOUT_CODE, SessionTitleLlmConfigFields, SessionTitleLlmConfigSchema, executeSessionTitleLlm, resolveSessionTitleLlmConfig };
