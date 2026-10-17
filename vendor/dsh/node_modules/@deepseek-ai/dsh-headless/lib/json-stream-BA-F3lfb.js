import { lastAssistantStreamChunk } from "@deepseek-ai/dsh-llm/assistant-stream";
//#region lib/types/json-stream.js
/**
* `--json` run projection: a bounded, ordered event stream derived from one
* Agent's durable Session events. Every projected event is a commit point:
* text and reasoning come from committed `assistant/message` content, never
* from a live attempt that may still be retried or discarded, so the stream
* never carries content the durable log does not contain.
* @module @deepseek-ai/dsh-headless/json-stream
*/
/** Default per-string and per-key cap applied to every bounded projected payload. */
const MAX_STRING_BYTES = 8 * 1024;
/** Default cap on one projected event's serialized bytes, newline included; the terminal `final` is exempt. */
const MAX_EVENT_BYTES = 32 * 1024;
/** Bytes every newline-delimited writer appends after one serialized event. */
const LINE_TERMINATOR_BYTES = 1;
/** Truncate one UTF-8 string to `maxBytes`, dropping a split trailing character. */
function truncateUtf8(text, maxBytes) {
	const decoded = Buffer.from(text, "utf8").subarray(0, maxBytes).toString("utf8");
	return decoded.endsWith("�") ? decoded.slice(0, -1) : decoded;
}
/** Cap one object key, flagging the payload when it was cut. */
function boundKey(key, maxBytes, state) {
	if (Buffer.byteLength(key, "utf8") <= maxBytes) return key;
	state.truncated = true;
	return truncateUtf8(key, maxBytes);
}
/** Maximum container depth one projected payload keeps before the tail is cut. */
const MAX_DEPTH = 64;
/** Recursively cap every string in one JSON-serializable value, keys included. */
function boundValue(value, maxBytes, state, depth = 0) {
	if (typeof value === "string") {
		if (Buffer.byteLength(value, "utf8") <= maxBytes) return value;
		state.truncated = true;
		return truncateUtf8(value, maxBytes);
	}
	if (Array.isArray(value)) {
		if (depth >= MAX_DEPTH) {
			state.truncated = true;
			return "[truncated: depth]";
		}
		return value.map((item) => boundValue(item, maxBytes, state, depth + 1));
	}
	if (value !== null && typeof value === "object") {
		if (depth >= MAX_DEPTH) {
			state.truncated = true;
			return "[truncated: depth]";
		}
		const bounded = Object.create(null);
		for (const [key, item] of Object.entries(value)) bounded[boundKey(key, maxBytes, state)] = boundValue(item, maxBytes, state, depth + 1);
		return bounded;
	}
	return value;
}
/**
* Bound every string and key in one projected payload, adding `truncated: true`
* when any was cut. {@link boundJsonLine} composes this with the whole-line cap.
* @param event - the event payload to bound.
* @param maxStringBytes - per-string and per-key byte cap.
* @returns a copy with every over-long string and key truncated.
*/
function boundJsonEvent(event, maxStringBytes = MAX_STRING_BYTES) {
	const state = { truncated: false };
	const bounded = boundValue(event, maxStringBytes, state);
	if (state.truncated) bounded.truncated = true;
	return bounded;
}
/**
* Serialize one projected payload under both limits: every string and key is
* capped at `maxStringBytes`, and the serialized line at `maxEventBytes`. The
* line cap reserves the newline the writer appends, so the complete record
* stays within it. When the line is still too long, scalar fields survive and
* structured fields are dropped; when even those are too long, only `type` and
* `truncated` remain.
* @param event - the event payload to serialize.
* @param maxStringBytes - per-string and per-key byte cap.
* @param maxEventBytes - cap on the serialized line plus its trailing newline.
* @returns the bounded JSON line, without a trailing newline.
*/
function boundJsonLine(event, maxStringBytes = MAX_STRING_BYTES, maxEventBytes = MAX_EVENT_BYTES) {
	const limit = maxEventBytes - LINE_TERMINATOR_BYTES;
	const bounded = boundJsonEvent(event, maxStringBytes);
	const line = JSON.stringify(bounded);
	if (Buffer.byteLength(line, "utf8") <= limit) return line;
	const scalars = Object.create(null);
	for (const [key, value] of Object.entries(bounded)) if (value === null || typeof value !== "object") scalars[key] = value;
	scalars.truncated = true;
	const short = JSON.stringify(scalars);
	if (Buffer.byteLength(short, "utf8") <= limit) return short;
	return JSON.stringify({
		type: bounded.type,
		truncated: true
	});
}
/**
* Parse raw tool-call arguments as the executor does: empty input is `{}`,
* invalid or non-round-trippable JSON (a non-finite number) stays text.
*/
function parseArguments(raw) {
	if (raw === "") return {};
	const seen = { nonFinite: false };
	try {
		const parsed = JSON.parse(raw, (_key, value) => {
			if (typeof value === "number" && !Number.isFinite(value)) seen.nonFinite = true;
			return value;
		});
		return seen.nonFinite ? raw : parsed;
	} catch {
		return raw;
	}
}
/** Join the text blocks of a tool result's model-facing content. */
function resultText(blocks) {
	return blocks.filter((block) => block.type === "text" && typeof block.text === "string").map((block) => block.text).join("");
}
/** The usage a provider reported in one attempt's stream, if any. */
function streamUsage(stream) {
	return lastAssistantStreamChunk(stream, "usage")?.usage;
}
/**
* Accumulate one step's usage across its attempts. A retried attempt keeps its
* usage only in its `assistant/attempt` stream, so the committed message alone
* would under-report billed tokens. An attempt that reports no sample makes the
* step total unknowable, so the step omits usage entirely rather than publish a
* partial sum as if it were complete; an optional bucket is summed only when
* every contribution reports it.
* @param state - usage accumulated so far and whether it is still complete.
* @param next - usage reported by the next attempt.
* @returns the updated state.
*/
function addUsage(state, next) {
	if (next === void 0) return {
		usage: state.usage,
		complete: false
	};
	if (state.usage === void 0) return {
		usage: next,
		complete: state.complete
	};
	const total = state.usage;
	const sum = (a, b) => a === void 0 || b === void 0 ? void 0 : a + b;
	const totalTokens = sum(total.totalTokens, next.totalTokens);
	const cacheReadTokens = sum(total.cacheReadTokens, next.cacheReadTokens);
	const cacheWriteTokens = sum(total.cacheWriteTokens, next.cacheWriteTokens);
	const reasoningTokens = sum(total.reasoningTokens, next.reasoningTokens);
	return {
		usage: {
			inputTokens: total.inputTokens + next.inputTokens,
			outputTokens: total.outputTokens + next.outputTokens,
			...totalTokens === void 0 ? {} : { totalTokens },
			...cacheReadTokens === void 0 ? {} : { cacheReadTokens },
			...cacheWriteTokens === void 0 ? {} : { cacheWriteTokens },
			...reasoningTokens === void 0 ? {} : { reasoningTokens }
		},
		complete: state.complete
	};
}
/**
* Project one Agent's run as newline-delimited JSON on `sink`.
*
* The opening `session` event is written before the subscription starts, so a
* caller must invoke this before submitting the task. Text and reasoning are
* emitted only when the step's `assistant/message` commits them, and the
* terminal `final` event carries the same lossless answer the default mode
* prints (it is deliberately not bounded).
* @param ctx - plugin context carrying the live Session feed.
* @param agent - the exact Agent whose events belong to this invocation.
* @param sink - stdout sink receiving one JSON object per line.
* @param options - projection tunables.
* @returns the projection handle that finishes or disposes the stream.
*/
function projectJsonRun(ctx, agent, sink, options = {}) {
	const maxStringBytes = options.maxStringBytes ?? 8192;
	let disposed = false;
	let stepUsage = {
		usage: void 0,
		complete: true
	};
	const write = (event) => {
		sink.write(`${boundJsonLine(event, maxStringBytes)}\n`);
	};
	const onSessionEvent = (session, event) => {
		if (session !== agent.session) return;
		switch (event.type) {
			case "turn/start":
				write({
					type: "status",
					phase: "turn_start",
					turn: event.data.turn
				});
				return;
			case "step/start":
				write({
					type: "status",
					phase: "step_start",
					turn: event.data.turn,
					step: event.data.step
				});
				return;
			case "assistant/attempt":
				stepUsage = addUsage(stepUsage, streamUsage(event.data.stream));
				return;
			case "assistant/message":
				stepUsage = addUsage(stepUsage, event.data.usage ?? streamUsage(event.data.stream));
				for (const block of event.data.message.content) if (block.type === "reasoning") write({
					type: "thinking",
					text: block.text
				});
				else if (block.type === "text") write({
					type: "text",
					text: block.text
				});
				return;
			case "step/end": {
				const { usage, complete } = stepUsage;
				stepUsage = {
					usage: void 0,
					complete: true
				};
				write({
					type: "status",
					phase: "step_end",
					turn: event.data.turn,
					step: event.data.step,
					...complete && usage !== void 0 ? { usage } : {}
				});
				return;
			}
			case "turn/end":
				write({
					type: "status",
					phase: "turn_end",
					turn: event.data.turn,
					reason: event.data.reason
				});
				return;
			case "tool/call":
				write({
					type: "tool_call",
					callId: event.data.callId,
					tool: event.data.name,
					input: parseArguments(event.data.arguments)
				});
				return;
			case "tool/result": {
				if (event.surfaceOp !== "append") return;
				const message = event.data.message;
				write({
					type: "tool_result",
					callId: message.toolCallId,
					status: message.isError === true ? "error" : "completed",
					result: resultText(message.content)
				});
				return;
			}
			default: return;
		}
	};
	write({
		type: "session",
		sessionId: agent.id,
		cwd: options.cwd ?? process.cwd()
	});
	const stopSession = ctx.on("session/event", onSessionEvent);
	return {
		finish(text) {
			if (disposed) return;
			sink.write(`${JSON.stringify({
				type: "final",
				text
			})}\n`);
		},
		dispose() {
			disposed = true;
			stopSession();
		}
	};
}
//#endregion
export { projectJsonRun as n, boundJsonLine as t };
