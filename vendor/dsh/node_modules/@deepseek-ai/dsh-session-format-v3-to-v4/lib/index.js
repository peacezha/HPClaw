import { assertReleasedV3Header, releasedV2SessionFormatCodec, releasedV3SessionFormatCodec } from "@deepseek-ai/dsh-session-format-v2-to-v3";
import { SessionFormatError, SessionFormatUnsupportedMigrationError, defineSessionFormatMigration, isSessionFormatJsonObject, sessionFormatCount } from "@deepseek-ai/dsh-session-format";
import { isAbsolute } from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region lib/types/sources.js
/** Released V3 plugin-source conversion and declared message traversal. */
/**
* Visit only messages carried by first-party event payloads.
* @param event - source or target logical event.
* @param transform - message transform preserving unchanged identity.
* @returns the event sharing all untouched payloads.
*/
function mapEventMessages(event, transform) {
	const data = event.data;
	if (!isSessionFormatJsonObject(data)) return event;
	if (event.type === "user/message") {
		const message = transform(data);
		return message === data ? event : {
			...event,
			data: message
		};
	}
	if (event.type === "developer/message" || event.type === "system/message" || event.type === "assistant/message" || event.type === "tool/result") {
		if (!isSessionFormatJsonObject(data["message"])) throw new SessionFormatError(event.type + " requires a message");
		const message = transform(data["message"]);
		return message === data["message"] ? event : {
			...event,
			data: {
				...data,
				message
			}
		};
	}
	const key = event.type === "agent/inbox/spliced" ? "inserted" : event.type === "session/title-llm-request" ? "messages" : void 0;
	if (key === void 0) return event;
	const messages = data[key];
	if (!Array.isArray(messages)) throw new SessionFormatError(event.type + " requires message array");
	const mapped = messages.map((message) => {
		if (!isSessionFormatJsonObject(message)) throw new SessionFormatError(event.type + " requires message objects");
		return transform(message);
	});
	return mapped.every((message, index) => message === messages[index]) ? event : {
		...event,
		data: {
			...data,
			[key]: mapped
		}
	};
}
/** Released V3 plugin names whose current producer kind is not the plugin string. */
const RENAMED_PRODUCERS = Object.freeze({
	"compact": "compact-checkpoint",
	"tools-code-mode": "ptc-mode",
	"tools-ptc": "ptc-mode",
	"dsh-compaction-basic": "compact-basic",
	"@deepseek-ai/dsh-system-prompt": "runtime-context"
});
/** First-party V3 plugin identities that intentionally keep their current kind. */
const RELEASED_SAME_NAME_PRODUCERS = new Set([
	"agent-instructions",
	"session-reference",
	"team-message",
	"goal",
	"skill-invocation",
	"skill-catalog",
	"coordinator",
	"subagent-report",
	"subagent-settled",
	"webhook",
	"agent-message",
	"model-selection",
	"plan-mode",
	"time-context",
	"tmux-context",
	"user-approval",
	"repeat-tool-reminder",
	"tool-cordis",
	"cordis-host-runner",
	"tool-goal",
	"tool-jobs",
	"hooks-codex",
	"hooks-claude-code",
	"schedule",
	"dsh-session-title-llm"
]);
/** Resolve the current producer kind for one released V3 plugin string. */
function producerKind(plugin, role) {
	if (plugin === "@deepseek-ai/dsh-system-prompt" && role === "system") return "system-prompt";
	const renamed = Object.hasOwn(RENAMED_PRODUCERS, plugin) ? RENAMED_PRODUCERS[plugin] : void 0;
	if (renamed !== void 0) return renamed;
	if (RELEASED_SAME_NAME_PRODUCERS.has(plugin)) return plugin;
	return `plugin:${plugin}`;
}
/**
* Lift one released V3 plugin source into the current producer-owned shape.
* @param source - source record whose `kind` is `'plugin'`.
* @param seq - event seq for diagnostics.
* @param role - carried message role for role-sensitive renames.
* @returns a copy whose kind is the producer's own kind and whose `plugin` field is dropped.
*/
function rewritePluginSource(source, seq, role) {
	const plugin = source["plugin"];
	if (typeof plugin !== "string") throw new SessionFormatError(`plugin source at seq ${seq} is not canonical: plugin requires a string`);
	const kind = producerKind(plugin, role);
	if (Object.keys(source).length === 2) return { kind };
	return Object.fromEntries(Object.entries(source).filter(([key]) => key !== "plugin").map(([key, item]) => [key, key === "kind" ? kind : item]));
}
/**
* Convert released plugin wrappers while retaining every direct source kind and its metadata.
* @param source - decoded V3 message source.
* @param seq - event sequence for diagnostics.
* @param role - enclosing message role for role-sensitive producer mappings.
* @returns the converted source with every non-identity field preserved.
*/
function rewriteV3MessageSource(source, seq, role) {
	const kind = source["kind"];
	if (typeof kind !== "string" || kind.length === 0) throw new SessionFormatError(`message source at seq ${seq} requires a nonempty kind`);
	if (kind === "plugin") return rewritePluginSource(source, seq, role);
	return source;
}
//#endregion
//#region lib/types/message-sources.js
/** Native source admission preserves unknown attribution and refuses retired plugin wrappers. */
function source(message) {
	const value = message["source"];
	if (!isSessionFormatJsonObject(value) || typeof value["kind"] !== "string" || value["kind"].length === 0 || value["kind"] === "plugin") throw new SessionFormatError("format v4 message requires a producer-owned source kind");
}
/**
* Validate producer attribution in every declared durable message slot.
* @param event - complete native V4 event before Session adoption.
*/
function assertV4MessageSources(event) {
	mapEventMessages(event, (message) => {
		source(message);
		return message;
	});
}
/**
* Refuse retired source syntax even after a malformed recoverable row; leave incomplete messages to decoding.
* @param row - parsed row whose incomplete values have not been classified by the scanner.
*/
function assertV4SourceRowAdmission(row) {
	if (!isSessionFormatJsonObject(row) || !isSessionFormatJsonObject(row["data"])) return;
	const data = row["data"];
	const messages = row["type"] === "user/message" ? [data] : row["type"] === "system/message" || row["type"] === "assistant/message" || row["type"] === "tool/result" ? [data["message"]] : row["type"] === "agent/inbox/spliced" ? data["inserted"] : row["type"] === "session/title-llm-request" ? data["messages"] : [];
	if (!Array.isArray(messages)) return;
	for (const message of messages) {
		if (!isSessionFormatJsonObject(message)) continue;
		const value = message["source"];
		if (isSessionFormatJsonObject(value) && value["kind"] === "plugin") source(message);
	}
}
//#endregion
//#region lib/types/retired-syntax.js
/** Retired native syntax remains a hard refusal even after a recoverable physical-row failure. */
function assertBlock(block, subject) {
	if (isSessionFormatJsonObject(block) && block["type"] === "tool-result") throw new SessionFormatError(`${subject} must not contain a released tool-result wrapper`);
}
function assertContent$1(content, subject) {
	if (Array.isArray(content)) content.forEach((block) => {
		assertBlock(block, subject);
	});
}
function assertMessageContent(message, subject) {
	if (isSessionFormatJsonObject(message)) assertContent$1(message["content"], subject);
}
/**
* Refuse retired headers, PTC tags, and tool-result blocks in interpreted content slots.
* Tool arguments, replay state, schema parameters, and nested extension values remain opaque.
* @param row - parsed physical row or complete native logical event.
*/
function assertV4RetiredSyntax(row) {
	if (!isSessionFormatJsonObject(row)) return;
	if ((row["type"] === "tool/code-dispatch-start" || row["type"] === "tool/code-dispatch") && row["ignorable"] !== true) throw new SessionFormatUnsupportedMigrationError(`format v4 rejects retired event type ${row["type"]}`);
	const data = row["data"];
	if (row["type"] === "request/header") {
		if (!isSessionFormatJsonObject(data) || !isSessionFormatJsonObject(data["header"])) throw new SessionFormatError("format v4 request/header requires data and header objects");
		if (Object.hasOwn(data["header"], "system")) throw new SessionFormatError("format v4 request/header rejects retired header.system");
		return;
	}
	if (!isSessionFormatJsonObject(data)) return;
	const subject = `format v4 ${String(row["type"])} at seq ${String(row["seq"])} content`;
	switch (row["type"]) {
		case "user/message":
			assertContent$1(data["content"], subject);
			break;
		case "developer/message":
		case "assistant/message":
		case "team/message/queued":
			assertMessageContent(data["message"], subject);
			break;
		case "agent/inbox/spliced":
		case "session/title-llm-request": {
			const messages = data[row["type"] === "agent/inbox/spliced" ? "inserted" : "messages"];
			if (Array.isArray(messages)) messages.forEach((message) => {
				assertMessageContent(message, subject);
			});
			break;
		}
		case "compaction/summary":
			assertContent$1(data["summary"], subject);
			assertContent$1(data["rawOutput"], subject);
			break;
		case "tool/ptc-dispatch":
			assertContent$1(data["content"], subject);
			break;
	}
	if ((row["type"] === "assistant/message" || row["type"] === "assistant/attempt") && Array.isArray(data["stream"])) for (const entry of data["stream"]) {
		if (!isSessionFormatJsonObject(entry) || entry["type"] !== "chunk") continue;
		const chunk = entry["chunk"];
		if (!isSessionFormatJsonObject(chunk)) continue;
		if (chunk["type"] === "block-end") assertBlock(chunk["block"], subject);
		if (chunk["type"] === "block-start" && chunk["blockType"] === "tool-result") throw new SessionFormatError(`${subject} must not contain a released tool-result wrapper`);
	}
}
//#endregion
//#region lib/types/system-message.js
/** Native system-message fields checked before physical recovery can discard a row. */
function record$1(value, subject) {
	if (!isSessionFormatJsonObject(value)) throw new SessionFormatError(`format v4 ${subject} requires an object`);
	return value;
}
function string(value, subject, nonempty = false) {
	if (typeof value !== "string" || nonempty && value.length === 0) throw new SessionFormatError(`format v4 ${subject} requires a string${nonempty ? " with content" : ""}`);
}
function positive(value, subject) {
	if (sessionFormatCount(value, subject) === 0) throw new SessionFormatError(`format v4 ${subject} must be positive`);
}
function image(value) {
	const attachment = record$1(value, "system image attachment");
	string(attachment["attachmentId"], "system image attachmentId", true);
	if (![
		"image/png",
		"image/jpeg",
		"image/webp",
		"image/gif"
	].includes(attachment["mediaType"])) throw new SessionFormatError("format v4 system image requires a supported mediaType");
	sessionFormatCount(attachment["bytes"], "system image bytes");
	positive(attachment["width"], "system image width");
	positive(attachment["height"], "system image height");
	if (attachment["name"] !== void 0) string(attachment["name"], "system image name");
	if (attachment["originalDimensions"] !== void 0) {
		const original = record$1(attachment["originalDimensions"], "system image originalDimensions");
		positive(original["width"], "system image original width");
		positive(original["height"], "system image original height");
	}
}
/**
* Validate system fields independently of historical message representations; preserve additional JSON fields.
* @param row - complete logical event or parsed physical row before corruption recovery.
*/
function assertV4SystemMessageFields(row) {
	if (!isSessionFormatJsonObject(row) || row["type"] !== "system/message") return;
	const data = record$1(row["data"], "system/message data");
	positive(data["turn"], "system/message turn");
	positive(data["step"], "system/message step");
	const message = record$1(data["message"], "system message");
	string(message["id"], "system message id", true);
	if (message["role"] !== "system") throw new SessionFormatError("format v4 system message requires system role");
	const content = message["content"];
	if (!Array.isArray(content)) throw new SessionFormatError("format v4 system message requires content array");
	for (const value of content) {
		const block = record$1(value, "system content block");
		string(block["type"], "system content type", true);
		switch (block["type"]) {
			case "text":
			case "reasoning":
				string(block["text"], "system content text");
				break;
			case "tool-call":
				string(block["id"], "system tool-call id", true);
				string(block["name"], "system tool-call name", true);
				string(block["arguments"], "system tool-call arguments");
				break;
			case "image":
				image(block["attachment"]);
				break;
			case "tool-result": throw new SessionFormatError("format v4 system content rejects retired tool-result wrappers");
			default: break;
		}
	}
}
//#endregion
//#region lib/types/developer.js
/** Native V4 developer-message and deferred-tool-schema validation. */
function assertToolChange(block, developer) {
	if (!isSessionFormatJsonObject(block) || block["type"] !== "tool-addition" && block["type"] !== "tool-removal") return;
	if (!developer) throw new SessionFormatError(`format v4 ${block["type"]} requires developer role`);
	if (typeof block["toolName"] !== "string" || block["toolName"].length === 0) throw new SessionFormatError(`format v4 ${block["type"]} requires a nonempty toolName`);
	if (block["type"] === "tool-addition" && Object.hasOwn(block, "tool")) throw new SessionFormatError("format v4 tool-addition must omit inline tool definitions");
}
function assertContent(value, developer = false) {
	if (Array.isArray(value)) value.forEach((block) => {
		assertToolChange(block, developer);
	});
}
function assertDeveloperMessage(message) {
	assertContent(message["content"], true);
	const source = message["source"];
	if (typeof message["id"] !== "string" || message["id"].length === 0 || !Array.isArray(message["content"]) || !isSessionFormatJsonObject(source) || typeof source["kind"] !== "string" || source["kind"].length === 0 || source["kind"] === "plugin") throw new SessionFormatError("format v4 developer message requires id, role, content, and a producer-owned source");
}
/** Ordinary-message corruption belongs to the decoder; recognized V4-only values are refused here. */
function assertOrdinaryMessage(value) {
	if (!isSessionFormatJsonObject(value)) return;
	if (value["role"] === "developer") throw new SessionFormatError("format v4 developer/message and developer role must occur together");
	assertContent(value["content"]);
}
/**
* Validate native V4 developer messages, tool-change blocks, and deferred tool schemas.
* Additional developer JSON fields are preserved. Malformed legacy message
* slots remain available to recoverable decoding.
* @param event - logical event or physical row before source-event range decoding.
*/
function assertV4DeveloperData(event) {
	const data = event.data;
	if (!isSessionFormatJsonObject(data)) {
		if (event.type === "developer/message") throw new SessionFormatError("format v4 developer/message data must be an object");
		return;
	}
	if (event.type === "developer/message") {
		const message = data["message"];
		if (!isSessionFormatJsonObject(message) || message["role"] !== "developer") throw new SessionFormatError("format v4 developer/message requires turn, step, and a developer message");
		for (const field of ["turn", "step"]) if (sessionFormatCount(data[field], `developer/message ${field}`) === 0) throw new SessionFormatError(`developer/message ${field} must be positive`);
		assertDeveloperMessage(message);
		if (message["content"].some((block) => isSessionFormatJsonObject(block) && block["type"] === "tool-addition")) sessionFormatCount(data["headerSeq"], "developer/message headerSeq");
		else if (Object.hasOwn(data, "headerSeq")) throw new SessionFormatError("format v4 developer/message must omit headerSeq without tool additions");
	} else switch (event.type) {
		case "user/message":
			assertOrdinaryMessage(data);
			break;
		case "system/message":
		case "assistant/message":
		case "tool/result":
			assertOrdinaryMessage(data["message"]);
			break;
		case "agent/inbox/spliced":
		case "session/title-llm-request": {
			const messages = data[event.type === "agent/inbox/spliced" ? "inserted" : "messages"];
			if (Array.isArray(messages)) messages.forEach(assertOrdinaryMessage);
			break;
		}
	}
	if (event.type === "compaction/summary") {
		assertContent(data["summary"]);
		assertContent(data["rawOutput"]);
	}
	if ((event.type === "assistant/message" || event.type === "assistant/attempt") && Array.isArray(data["stream"])) for (const entry of data["stream"]) {
		if (!isSessionFormatJsonObject(entry) || entry["type"] !== "chunk") continue;
		const chunk = entry["chunk"];
		if (!isSessionFormatJsonObject(chunk)) continue;
		if (chunk["type"] === "block-end") assertToolChange(chunk["block"], false);
		if (chunk["type"] === "block-start" && (chunk["blockType"] === "tool-addition" || chunk["blockType"] === "tool-removal")) throw new SessionFormatError("format v4 tool-change blocks require developer role");
	}
	if (event.type === "request/header" && isSessionFormatJsonObject(data["header"])) {
		const tools = data["header"]["tools"];
		if (Array.isArray(tools)) for (const tool of tools) {
			if (!isSessionFormatJsonObject(tool) || !Object.hasOwn(tool, "deferLoading")) continue;
			if (tool["deferLoading"] !== true) throw new SessionFormatError("format v4 tool deferLoading must be true when present");
		}
	}
}
//#endregion
//#region lib/types/fork-result.js
/** Native V4 fork-result identity and not-started error validation. */
/**
* Validate fork-generated not-started results without changing their identity or text.
* Append results carry their own sequence; replacement results retain an earlier identity.
* @param row - logical event or physical event row.
*/
function assertV4ForkResult(row) {
	if (!isSessionFormatJsonObject(row) || row["type"] !== "tool/result") return;
	const data = row["data"];
	if (!isSessionFormatJsonObject(data)) return;
	const error = data["error"];
	const message = data["message"];
	if (!isSessionFormatJsonObject(error) || error["code"] !== "TOOL_NOT_STARTED" || !isSessionFormatJsonObject(message) || typeof message["id"] !== "string" || !message["id"].startsWith("forked-tool-result-")) return;
	const source = message["source"];
	const callId = isSessionFormatJsonObject(source) ? source["callId"] : void 0;
	const prefix = `forked-tool-result-${String(callId)}-`;
	const suffix = message["id"].slice(prefix.length);
	const operation = row["surfaceOp"];
	const replacement = isSessionFormatJsonObject(operation) && operation["op"] === "replace";
	const sequence = Number(suffix);
	const content = message["content"];
	const text = Array.isArray(content) && content.length === 1 ? content[0] : void 0;
	const sourceEventSeqs = row["sourceEventSeqs"];
	if (typeof callId !== "string" || !message["id"].startsWith(prefix) || !/^(0|[1-9]\d*)$/.test(suffix) || !Number.isSafeInteger(sequence) || (replacement ? typeof row["seq"] !== "number" || sequence >= row["seq"] : sequence !== row["seq"]) || error["name"] !== "ToolNotStartedError" || !replacement && (sourceEventSeqs !== void 0 || operation !== "append") || replacement && (!Array.isArray(sourceEventSeqs) || sourceEventSeqs.length !== 1 || sourceEventSeqs[0] !== sequence) || message["role"] !== "tool" || message["isError"] !== true || message["toolCallId"] !== callId || !isSessionFormatJsonObject(source) || source["kind"] !== "tool" || !isSessionFormatJsonObject(text) || text["type"] !== "text" || typeof text["text"] !== "string") throw new SessionFormatError("invalid V4 not-started fork result");
}
//#endregion
//#region lib/types/tool-role.js
/** First-class tool-role messages in the V4 representation. */
const WRAPPER_FIELDS = new Set([
	"type",
	"toolCallId",
	"content",
	"isError"
]);
const MESSAGE_FIELDS = new Set([
	"id",
	"role",
	"source",
	"content"
]);
/** Preserve unknown fields without merging their original message and result owners. */
function extensionFields(value, fields, owner) {
	return Object.fromEntries(Object.entries(value).filter(([key]) => !fields.has(key)).map(([key, field]) => [`plugin:${owner}:${key}`, field]));
}
function resultContent(value, subject) {
	if (!Array.isArray(value)) throw new SessionFormatError(`${subject} tool-result content must be an array`);
	if (value.some((block) => isSessionFormatJsonObject(block) && block["type"] === "tool-result")) throw new SessionFormatUnsupportedMigrationError(`${subject} contains a nested tool-result unsupported by this converter`);
	return value;
}
/**
* Lift one released-V3 wrapper tool/result row into the first-class V4 message.
* Validate the wrapper before dropping it so malformed historical content is
* rejected instead of being silently truncated.
* @param event - released wrapper tool/result event.
* @returns the same event with a first-class tool-role message.
* @throws {SessionFormatError} when the wrapper, tool source, content, or error flag is malformed.
* @throws {SessionFormatUnsupportedMigrationError} when the result contains another result.
*/
function liftToolResult(event) {
	if (event.type !== "tool/result" || !isSessionFormatJsonObject(event.data)) return event;
	const data = event.data;
	const message = data["message"];
	if (!isSessionFormatJsonObject(message) || message["role"] !== "user") return event;
	const source = message["source"];
	const callId = isSessionFormatJsonObject(source) ? source["callId"] : void 0;
	const content = message["content"];
	const block = Array.isArray(content) && content.length === 1 ? content[0] : void 0;
	const wrapper = isSessionFormatJsonObject(block) ? block : void 0;
	const id = message["id"];
	if (typeof id !== "string" || id.length === 0 || !isSessionFormatJsonObject(source) || source["kind"] !== "tool" || typeof callId !== "string" || callId.length === 0 || wrapper === void 0 || wrapper["type"] !== "tool-result" || wrapper["toolCallId"] !== callId) throw new SessionFormatError(`format v3 ${event.type} at seq ${event.seq} requires exactly one tool-result wrapper matching its tool source`);
	const isError = wrapper["isError"];
	if (isError !== void 0 && typeof isError !== "boolean") throw new SessionFormatError(`format v3 ${event.type} at seq ${event.seq} tool-result isError must be boolean`);
	const targetMessage = {
		role: "tool",
		source,
		toolCallId: callId,
		content: resultContent(wrapper["content"], `format v3 ${event.type} at seq ${event.seq}`),
		...isError === void 0 ? {} : { isError },
		id,
		...extensionFields(message, MESSAGE_FIELDS, "message"),
		...extensionFields(wrapper, WRAPPER_FIELDS, "result")
	};
	return {
		...event,
		data: {
			...data,
			message: targetMessage
		}
	};
}
/**
* Validate the native V4 first-class tool-role message of one tool/result row.
* @param event - canonical V4 event.
* @throws {SessionFormatError} when the row is not an exact first-class tool result.
*/
function assertV4ToolResultMessage(event) {
	if (event.type !== "tool/result") return;
	const subject = `format v4 ${event.type} at seq ${event.seq}`;
	const data = event.data;
	if (!isSessionFormatJsonObject(data)) throw new SessionFormatError(`${subject} data must be an object`);
	const message = data["message"];
	if (!isSessionFormatJsonObject(message)) throw new SessionFormatError(`${subject} message must be an object`);
	const id = message["id"];
	const role = message["role"];
	const toolCallId = message["toolCallId"];
	const source = message["source"];
	const isError = message["isError"];
	const content = message["content"];
	const sourceCallId = isSessionFormatJsonObject(source) ? source["callId"] : void 0;
	if (typeof id !== "string" || id.length === 0) throw new SessionFormatError(`${subject} requires a first-class message with a string id`);
	if (role !== "tool") throw new SessionFormatError(`${subject} requires a tool-role message`);
	if (typeof toolCallId !== "string" || toolCallId.length === 0 || sourceCallId !== toolCallId) throw new SessionFormatError(`${subject} requires toolCallId matching its tool source`);
	if (!isSessionFormatJsonObject(source) || source["kind"] !== "tool") throw new SessionFormatError(`${subject} requires a tool source`);
	if (!Array.isArray(content)) throw new SessionFormatError(`${subject} requires array content`);
	if (content.some((block) => isSessionFormatJsonObject(block) && block["type"] === "tool-result")) throw new SessionFormatError(`${subject} content must not contain a released tool-result wrapper`);
	if (isError !== void 0 && typeof isError !== "boolean") throw new SessionFormatError(`${subject} isError must be boolean when present`);
	if (data["error"] !== void 0 && isError !== true) throw new SessionFormatError(`${subject} carries error metadata for a non-error tool result`);
}
//#endregion
//#region lib/types/relationships.js
/** Mandatory native V4 relationships; incomplete tails retain their open transactions. */
const SURFACE_TYPES = new Set([
	"system/message",
	"user/message",
	"developer/message",
	"assistant/message",
	"tool/result"
]);
const STEP_EVENT_TYPES = new Set([
	"system/message",
	"developer/message",
	"assistant/attempt"
]);
const RELATIONSHIP_TYPES = new Set([
	...SURFACE_TYPES,
	...STEP_EVENT_TYPES,
	"turn/start",
	"turn/end",
	"step/start",
	"step/end",
	"tool/call",
	"request/header",
	"request/context",
	"tool/ptc-dispatch-start",
	"tool/ptc-dispatch",
	"llm/retry",
	"llm/retry-started",
	"session/title",
	"session/title-llm-request",
	"command/run",
	"command/done",
	"compaction/start",
	"compaction/summary",
	"compaction/end",
	"compaction/prune",
	"session/end-seed"
]);
function record(value, subject) {
	if (!isSessionFormatJsonObject(value)) throw new SessionFormatError(`${subject} requires an object`);
	return value;
}
function text(value, subject) {
	if (typeof value !== "string" || value.length === 0) throw new SessionFormatError(`${subject} requires a nonempty string`);
	return value;
}
function array(value, subject) {
	if (!Array.isArray(value)) throw new SessionFormatError(`${subject} requires an array`);
	return value;
}
function earlier(value, seq, subject) {
	const coordinate = sessionFormatCount(value, subject);
	if (coordinate >= seq) throw new SessionFormatError(`${subject} must name an earlier event`);
	return coordinate;
}
/** One native artifact's lifecycle state; no state survives between reads. */
var Relationships = class {
	artifact;
	knownEventTypes;
	turn = null;
	step = null;
	nextTurn = 1;
	nextStep = 1;
	provider;
	surface = [];
	protectedHead;
	compaction;
	tools = /* @__PURE__ */ new Map();
	dispatches = /* @__PURE__ */ new Map();
	retries = [];
	startedRetries = /* @__PURE__ */ new Set();
	commands = /* @__PURE__ */ new Set();
	orphanCompactions = /* @__PURE__ */ new Set();
	constructor(artifact, knownEventTypes) {
		this.artifact = artifact;
		this.knownEventTypes = knownEventTypes;
		let start;
		for (const event of artifact.events) {
			if (!knownEventTypes.has(event.type)) continue;
			if (event.type === "compaction/start") start = event.seq;
			if (event.type === "compaction/end") start = void 0;
			if (event.type === "session/end-seed") {
				if (start !== void 0) this.orphanCompactions.add(start);
				start = void 0;
			}
		}
	}
	requireTurn(type) {
		if (this.turn === null) throw new SessionFormatError(`${type} is outside an open turn`);
	}
	requireStep(event, data) {
		if (this.turn === null || this.step === null || data["turn"] !== this.turn || data["step"] !== this.step) throw new SessionFormatError(`${event.type} does not match an open turn and step`);
	}
	closeTools(type) {
		if (this.tools.size !== 0) throw new SessionFormatError(`${type} leaves unresolved tool call ${String(this.tools.keys().next().value)}`);
		this.tools.clear();
	}
	developer(event, data) {
		if (data["headerSeq"] === void 0) return;
		const headerSeq = earlier(data["headerSeq"], event.seq, "developer/message headerSeq");
		const headerEvent = this.artifact.events[headerSeq];
		if (headerEvent?.type !== "request/header") throw new SessionFormatError("developer/message headerSeq must reference an earlier request/header");
		if (!this.knownEventTypes.has(headerEvent.type)) throw new SessionFormatError("developer/message headerSeq must reference a known request/header");
		const tools = record(record(headerEvent.data, "request/header data")["header"], "request header")["tools"];
		const content = array(record(data["message"], "developer message")["content"], "developer content");
		for (const value of content) {
			if (!isSessionFormatJsonObject(value) || value["type"] !== "tool-addition") continue;
			const toolName = value["toolName"];
			const definitions = Array.isArray(tools) ? tools.filter((tool) => isSessionFormatJsonObject(tool) && tool["name"] === toolName) : [];
			if (definitions.length !== 1) throw new SessionFormatError(`developer/message tool-addition "${toolName}" must name exactly one tool in headerSeq ${headerSeq}`);
			const definition = definitions[0];
			if (typeof definition["description"] !== "string" || !isSessionFormatJsonObject(definition["parameters"])) throw new SessionFormatError(`developer/message tool-addition "${toolName}" requires a complete tool definition in headerSeq ${headerSeq}`);
		}
	}
	foldSurface(event) {
		if (!SURFACE_TYPES.has(event.type)) return;
		if (event.type === "system/message" && this.surface.length > 0 && this.protectedHead === void 0) throw new SessionFormatError("system/message requires a protected first surface head");
		if (event["surfaceOp"] === "append") {
			if (event.type === "system/message" && this.surface.length === 0) this.protectedHead = event.seq;
			this.surface.push(event.seq);
			return;
		}
		const operation = record(event["surfaceOp"], `${event.type} surfaceOp`);
		const first = this.surface.indexOf(earlier(operation["startSeq"], event.seq, "replacement start"));
		const last = this.surface.indexOf(earlier(operation["endSeq"], event.seq, "replacement end"));
		if (first < 0 || last < first) throw new SessionFormatError(`${event.type} replacement range is not on the current surface`);
		const removed = this.surface.slice(first, last + 1);
		const sources = array(event["sourceEventSeqs"], "replacement sourceEventSeqs");
		if (removed.some((seq) => !sources.includes(seq))) throw new SessionFormatError("replacement sourceEventSeqs omit a shadowed surface node");
		if (this.protectedHead !== void 0 && removed.includes(this.protectedHead)) {
			if (event.type !== "system/message" || removed.length !== 1) throw new SessionFormatError("surface replacement cannot shadow the protected system head");
			this.protectedHead = event.seq;
		}
		this.surface.splice(first, removed.length, event.seq);
	}
	tool(event, data) {
		if (event.type === "tool/result" && event["surfaceOp"] !== "append") {
			this.requireTurn(event.type);
			return;
		}
		this.requireStep(event, data);
		if (event.type === "assistant/message") {
			const message = record(data["message"], "assistant message");
			for (const value of array(message["content"], "assistant content")) {
				const block = record(value, "assistant content block");
				if (block["type"] !== "tool-call") continue;
				const id = text(block["id"], "tool call id");
				if (this.tools.has(id)) throw new SessionFormatError(`assistant/message repeats advertised tool call ${id}`);
				this.tools.set(id, {
					name: block["name"],
					arguments: block["arguments"],
					started: false
				});
			}
			return;
		}
		const message = event.type === "tool/result" ? record(data["message"], "tool result message") : void 0;
		const id = text(message === void 0 ? data["callId"] : message["toolCallId"], "tool call id");
		const pending = this.tools.get(id);
		if (pending === void 0) throw new SessionFormatError(`${event.type} ${id} has no advertised tool lifecycle`);
		if (message === void 0) {
			if (pending.started || pending.name !== data["name"] || pending.arguments !== data["arguments"]) throw new SessionFormatError(`tool/call ${id} does not match one advertised tool call`);
			pending.started = true;
		} else {
			if (!pending.started && !notStartedRepair(event, data, message, id)) throw new SessionFormatError(`tool/result ${id} is not the exact TOOL_NOT_STARTED repair`);
			this.tools.delete(id);
		}
	}
	dispatch(event, data) {
		this.requireTurn(event.type);
		const id = text(data["subCallId"], "PTC subCallId");
		const root = text(data["rootCallId"], "PTC rootCallId");
		const parent = text(data["parentCallId"], "PTC parentCallId");
		const existing = this.dispatches.get(id);
		if (existing !== void 0 && existing.data["rootCallId"] !== root) throw new SessionFormatError("PTC dispatch changes its rootCallId");
		if (parent !== root && this.dispatches.get(parent)?.data["rootCallId"] !== root) throw new SessionFormatError("PTC parentCallId does not belong to rootCallId");
		if (event.type === "tool/ptc-dispatch-start") {
			if (existing !== void 0) throw new SessionFormatError("PTC dispatch repeats subCallId");
			this.dispatches.set(id, {
				data,
				settled: false
			});
			return;
		}
		if (existing === void 0 || existing.settled) throw new SessionFormatError("PTC dispatch has no unique start");
		if ([
			"rootCallId",
			"parentCallId",
			"name",
			"arguments"
		].some((key) => !isDeepStrictEqual(existing.data[key], data[key]))) throw new SessionFormatError("PTC dispatch does not match its start");
		existing.settled = true;
	}
	retry(event, data) {
		const id = text(data["retryId"], "retryId");
		const attempt = sessionFormatCount(data["retry"], "retry");
		if (event.type === "llm/retry-started") {
			const scheduled = this.retries.find((item) => item["retryId"] === id && item["retry"] === attempt);
			if (scheduled === void 0) throw new SessionFormatError("llm/retry-started pairs no prior scheduled attempt");
			if (scheduled["turn"] !== data["turn"] || scheduled["step"] !== data["step"]) throw new SessionFormatError("llm/retry-started changes scheduled coordinates");
			const key = JSON.stringify([id, attempt]);
			if (this.startedRetries.has(key)) throw new SessionFormatError("llm/retry-started repeats one scheduled attempt");
			this.startedRetries.add(key);
			return;
		}
		if (this.turn === null || data["turn"] !== this.turn || data["step"] !== (this.step ?? this.nextStep - 1)) throw new SessionFormatError("llm/retry does not match the current turn and step");
		if (data["provider"] !== this.provider) throw new SessionFormatError("llm/retry provider does not match the open request/header");
		const prior = this.retries.findLast((item) => [
			"turn",
			"step",
			"provider",
			"policyKey"
		].every((key) => item[key] === data[key]));
		if (attempt !== (prior === void 0 ? 1 : sessionFormatCount(prior["retry"], "prior retry") + 1)) throw new SessionFormatError("llm/retry skips its policy attempt sequence");
		if (prior === void 0 ? this.retries.some((item) => item["retryId"] === id) : prior["retryId"] !== id) throw new SessionFormatError("llm/retry must keep one retryId per policy chain");
		this.retries.push(data);
	}
	compact(event, data) {
		if (event.type === "compaction/prune" || event.type === "compaction/summary") this.span(event, data);
		if (event.type === "compaction/prune") return;
		if (event.type === "compaction/start") {
			if (this.compaction !== void 0) throw new SessionFormatError("compaction/start overlaps an open compaction");
			const owner = data["turn"] === null ? null : sessionFormatCount(data["turn"], "compaction turn");
			if (owner !== this.turn) throw new SessionFormatError("compaction/start does not match the open turn");
			this.compaction = {
				id: text(data["compactionId"], "compactionId"),
				command: data["sourceCommandId"],
				turn: owner,
				seq: event.seq,
				summarized: false
			};
			return;
		}
		const current = this.compactionOwner(data, event.type);
		if (current.turn !== this.turn) throw new SessionFormatError(`${event.type} does not match the open turn`);
		if (event.type === "compaction/summary") {
			if (current.summarized) throw new SessionFormatError("compaction/summary repeats");
			current.summarized = true;
		} else {
			if (data["turn"] !== current.turn) throw new SessionFormatError("compaction/end changes its owner turn");
			if (data["error"] === void 0 && !current.summarized) throw new SessionFormatError("successful compaction/end requires one summary");
			this.compaction = void 0;
		}
	}
	compactionOwner(data, subject) {
		if (this.compaction === void 0 || this.compaction.id !== data["compactionId"] || this.compaction.command !== data["sourceCommandId"]) throw new SessionFormatError(`${subject} has no matching compaction/start`);
		return this.compaction;
	}
	span(event, data) {
		const range = record(data["shadowedRange"], "compaction shadowedRange");
		const start = this.surface.indexOf(earlier(range["start"], event.seq, "compaction range start"));
		const end = this.surface.indexOf(earlier(range["end"], event.seq, "compaction range end"));
		const seqs = array(data["shadowedSeqs"], "compaction shadowedSeqs");
		if (start < 0 || end < start || !isDeepStrictEqual(this.surface.slice(start, end + 1), seqs)) throw new SessionFormatError(`${event.type} shadowedSeqs do not name an exact current surface span`);
		if (this.protectedHead !== void 0 && seqs.includes(this.protectedHead)) throw new SessionFormatError("compaction cannot shadow the protected system head");
	}
	accept(event) {
		if (!this.knownEventTypes.has(event.type) || !RELATIONSHIP_TYPES.has(event.type)) return;
		const data = record(event.data, event.type);
		if (STEP_EVENT_TYPES.has(event.type)) this.requireStep(event, data);
		if (event.type.startsWith("turn/") && this.compaction !== void 0 && !this.orphanCompactions.has(this.compaction.seq)) throw new SessionFormatError(`${event.type} crosses an open compaction`);
		this.foldSurface(event);
		switch (event.type) {
			case "turn/start":
				if (this.turn !== null || data["turn"] !== this.nextTurn) throw new SessionFormatError("turn/start does not open the expected turn");
				this.turn = this.nextTurn;
				this.nextStep = 1;
				this.tools.clear();
				break;
			case "turn/end":
				if (this.turn === null || data["turn"] !== this.turn || this.step !== null) throw new SessionFormatError("turn/end does not match the open turn with no open step");
				this.closeTools(event.type);
				this.turn = null;
				this.nextTurn += 1;
				break;
			case "step/start":
				if (this.turn === null || data["turn"] !== this.turn || this.step !== null || data["step"] !== this.nextStep) throw new SessionFormatError("step/start does not match the open turn and next step");
				this.step = this.nextStep;
				break;
			case "step/end":
				this.requireStep(event, data);
				this.closeTools(event.type);
				this.step = null;
				this.nextStep += 1;
				break;
			case "assistant/message":
			case "tool/call":
			case "tool/result":
				this.tool(event, data);
				break;
			case "developer/message":
				this.developer(event, data);
				break;
			case "request/header":
				this.requireTurn(event.type);
				this.provider = record(record(data["header"], "request header")["config"], "request config")["provider"];
				break;
			case "request/context":
				this.requireTurn(event.type);
				break;
			case "tool/ptc-dispatch-start":
			case "tool/ptc-dispatch":
				this.dispatch(event, data);
				break;
			case "llm/retry":
			case "llm/retry-started":
				this.retry(event, data);
				break;
			case "session/title":
			case "session/title-llm-request":
				titleSources(this.artifact.events, event, data, this.knownEventTypes);
				break;
			case "command/run": {
				const id = text(data["commandId"], "commandId");
				if (this.commands.has(id)) throw new SessionFormatError(`command/run repeats commandId ${id}`);
				this.commands.add(id);
				break;
			}
			case "command/done":
				if (!this.commands.has(text(data["commandId"], "commandId"))) throw new SessionFormatError("command/done has no prior command/run");
				if (data["sourceEventSeq"] !== void 0) {
					const source = this.artifact.events[earlier(data["sourceEventSeq"], event.seq, "command sourceEventSeq")];
					if (data["kind"] !== "success" || source?.type === "command/run" || source?.type === "command/done") throw new SessionFormatError("command/done has invalid sourceEventSeq");
				}
				break;
			case "compaction/start":
			case "compaction/summary":
			case "compaction/end":
			case "compaction/prune":
				this.compact(event, data);
				break;
			case "user/message": {
				const source = record(data["source"], "user message source");
				if (event["surfaceOp"] !== "append" && source["kind"] === "compact-checkpoint") this.compactionOwner(source, "compaction checkpoint");
				break;
			}
			case "session/end-seed":
				this.compaction = void 0;
				break;
		}
	}
};
function notStartedRepair(event, data, message, callId) {
	const error = record(data["error"], "not-started error");
	if (error["name"] !== "ToolNotStartedError" || error["code"] !== "TOOL_NOT_STARTED" || message["isError"] !== true || event["sourceEventSeqs"] !== void 0) return false;
	const id = text(message["id"], "not-started message id");
	if (id.startsWith(`forked-tool-result-${callId}-`)) return true;
	const prefix = `interrupted-tool-result-${callId}-`;
	const suffix = id.slice(prefix.length);
	const content = array(message["content"], "not-started content");
	const block = content[0];
	return id.startsWith(prefix) && /^(0|[1-9]\d*)$/.test(suffix) && Number.isSafeInteger(Number(suffix)) && content.length === 1 && isSessionFormatJsonObject(block) && block["type"] === "text" && block["text"] === "The tool call was interrupted before the Harness recorded it as started. Retry it if it is still needed.";
}
function titleSources(events, event, data, knownEventTypes) {
	const references = array(data["messageSeqs"], "title messageSeqs");
	if (event.type === "session/title" && references.length === 0 !== (record(data["source"], "title source")["kind"] === "user")) throw new SessionFormatError("session/title messageSeqs must be empty exactly for a user title");
	const seen = /* @__PURE__ */ new Set();
	for (const value of references) {
		const seq = earlier(value, event.seq, "title messageSeqs");
		const source = events[seq];
		if (seen.has(seq) || source?.type !== "user/message" || !knownEventTypes.has(source.type) || record(record(source.data, "title input")["source"], "title input source")["kind"] !== "user") throw new SessionFormatError(`${event.type} messageSeqs must cite distinct earlier human user/message events`);
		seen.add(seq);
	}
	if (event.type !== "session/title-llm-request") return;
	const messages = array(data["messages"], "title messages");
	const message = record(messages[0], "title message");
	const content = array(message["content"], "title content");
	const block = content[0];
	if (references.length === 0 || messages.length !== 1 || message["role"] !== "user" || record(message["source"], "title source")["kind"] !== "dsh-session-title-llm" || content.length !== 1 || !isSessionFormatJsonObject(block) || block["type"] !== "text") throw new SessionFormatError("session/title-llm-request messages do not represent messageSeqs");
}
/**
* Validate native V4 lifecycle and ownership facts without rewriting any event.
* @param artifact - artifact whose V4 envelopes and messages have been admitted.
* @param knownEventTypes - installed event types whose payloads this reader interprets.
*/
function assertV4LifecycleRelationships(artifact, knownEventTypes) {
	const state = new Relationships(artifact, knownEventTypes);
	for (const event of artifact.events) state.accept(event);
}
//#endregion
//#region lib/types/facts.js
/** Historical child identity reduced to the fields required by a parent's catalog. */
/**
* Collect a child's own descriptor without requiring one before its parent catalog is read.
* @param artifact - validated historical child artifact with its exact inherited cut.
* @returns compact child identity and descriptor evidence with validated discovery fields for catalog completion.
* @throws SessionFormatError when a supported own descriptor has invalid discovery fields.
*/
function historicalChildCatalogSource(artifact) {
	const header = artifact.header;
	if (header.origin !== "subagent" || header.parentSession === void 0) throw new SessionFormatUnsupportedMigrationError("catalog migration requires a subagent child with a direct parent");
	const descriptors = artifact.events.filter((event) => event.type === "subagent/descriptor" && event.seq >= artifact.inheritedEventCount);
	const source = {
		childId: header.id,
		childCreatedAt: header.createdAt,
		descriptorCount: descriptors.length,
		descriptor: descriptors[0]?.data ?? null
	};
	childCatalogFact(source);
	return source;
}
/**
* Validate supplemental child evidence supplied across the migration JSON interface.
* @param value - collected child identity and optional descriptor.
* @returns validated evidence; descriptor interpretation is deferred until parent membership is known.
*/
function childCatalogSource(value) {
	if (!isSessionFormatJsonObject(value) || typeof value["childId"] !== "string" || !Object.hasOwn(value, "descriptor")) throw new SessionFormatUnsupportedMigrationError("catalog migration requires historical child identity and descriptor evidence");
	sessionFormatCount(value["childCreatedAt"], "catalog child creation time");
	sessionFormatCount(value["descriptorCount"], "child descriptor count");
	return value;
}
/**
* Interpret only the discovery fields of known historical descriptors.
* @param source - validated child evidence.
* @returns a catalog fact, or undefined without exactly one supported own descriptor.
*/
function childCatalogFact(source) {
	const id = source["childId"];
	const descriptor = source["descriptor"];
	const count = source["descriptorCount"];
	const known = isSessionFormatJsonObject(descriptor) && [
		1,
		2,
		3
	].includes(descriptor["version"]);
	if (count !== 1 || !known) return void 0;
	if (typeof descriptor["provider"] !== "string") throw new SessionFormatUnsupportedMigrationError(`${childCatalogSubject(source)} has an invalid subagent descriptor provider`);
	if (descriptor["version"] !== 1 && descriptor["mode"] !== "continuable" && descriptor["mode"] !== "one-shot") throw new SessionFormatUnsupportedMigrationError(`${childCatalogSubject(source)} has an invalid subagent descriptor mode`);
	return catalogFact({
		version: 0,
		childId: id,
		childCreatedAt: source["childCreatedAt"],
		mode: descriptor["version"] === 1 ? "continuable" : descriptor["mode"],
		...descriptor["label"] === void 0 ? {} : { label: descriptor["label"] }
	}, childCatalogSubject(source));
}
/**
* Validate the historical fields used for catalog membership without interpreting extensions.
* @param value - catalog payload or prepared historical discovery fact.
* @param subject - event type or child identity used in rejection diagnostics.
* @returns validated catalog payload.
*/
function catalogFact(value, subject = "subagent/catalog") {
	if (!isSessionFormatJsonObject(value) || value["version"] !== 0 && value["version"] !== 1 && value["version"] !== 2 || typeof value["childId"] !== "string" || value["mode"] !== "continuable" && value["mode"] !== "one-shot" && value["mode"] !== "external" && value["mode"] !== "unknown" || value["version"] === 2 !== (value["mode"] === "external") || value["version"] === 0 && value["mode"] === "unknown" || value["mode"] === "continuable" && typeof value["label"] !== "string" || value["label"] !== void 0 && typeof value["label"] !== "string") throw new SessionFormatError(`${subject} requires a supported versioned catalog fact`);
	sessionFormatCount(value["childCreatedAt"], "catalog child creation time");
	return value;
}
/**
* Name the child and its optional storage-owned location in a migration diagnostic.
* @param source - validated supplemental child evidence.
* @returns a child identity with its source path when persistence supplied one.
*/
function childCatalogSubject(source) {
	return `Session ${source["childId"]}${typeof source["sourcePath"] === "string" ? ` (raw log: ${source["sourcePath"]})` : ""}`;
}
//#endregion
//#region lib/types/validation.js
/** Native V4 metadata and generation-owned relationship validation. */
/**
* Validate the exact native V4 logical header.
* @param header - decoded or otherwise untrusted V4 Session header candidate.
*/
function assertReleasedV4Header(header) {
	if (!isSessionFormatJsonObject(header) || header["version"] !== 4) throw new SessionFormatError("expected format v4 header");
	const required = [
		"version",
		"id",
		"createdAt",
		"isSeeded",
		"delegationDepth"
	];
	const allowed = new Set([
		...required,
		"cwd",
		"parentSession",
		"origin",
		"agentPreset"
	]);
	const missing = required.find((key) => !Object.hasOwn(header, key));
	const unexpected = Object.keys(header).find((key) => !allowed.has(key));
	if (missing !== void 0) throw new SessionFormatError(`format v4 header lacks required field ${missing}`);
	if (unexpected !== void 0) throw new SessionFormatError(`format v4 header has unexpected field ${unexpected}`);
	if (typeof header.id !== "string") throw new SessionFormatError("format v4 header id must be a string");
	sessionFormatCount(header.createdAt, "format v4 header createdAt");
	sessionFormatCount(header.delegationDepth, "format v4 header delegationDepth");
	if (typeof header.isSeeded !== "boolean") throw new SessionFormatError("format v4 header isSeeded must be boolean");
	if (header.cwd !== void 0 && (typeof header.cwd !== "string" || !isAbsolute(header.cwd))) throw new SessionFormatError("format v4 header cwd must be absolute");
	for (const key of ["parentSession", "agentPreset"]) if (header[key] !== void 0 && typeof header[key] !== "string") throw new SessionFormatError(`format v4 header ${key} must be a string`);
	if (header.origin !== void 0 && header.origin !== "subagent") throw new SessionFormatError("format v4 header origin must be \"subagent\"");
}
/**
* Validate V4 inheritance, vocabulary, native message admission, and
* lifecycle, compaction, tool, retry, title, command, catalog, and delivery ownership.
* Installed Session restoration owns common event envelopes and message acceptance.
* @param artifact - complete detached V4 artifact.
* @param knownEventTypes - event types understood by the installed Session package.
* @returns the same validated artifact and event objects.
*/
function restoreReleasedV4Artifact(artifact, knownEventTypes) {
	assertReleasedV4Header(artifact.header);
	const cut = sessionFormatCount(artifact.inheritedEventCount, "format v4 inherited event count");
	if (cut > artifact.events.length) throw new SessionFormatError("format v4 inherited event count exceeds its events");
	if (!artifact.header.isSeeded && cut !== 0) throw new SessionFormatError("unseeded format v4 Session has inherited events");
	let lastInheritedMarker;
	for (const [index, event] of artifact.events.entries()) {
		if (!knownEventTypes.has(event.type) && event["ignorable"] !== true) throw new SessionFormatUnsupportedMigrationError(`format v4 contains unknown event type ${JSON.stringify(event.type)} at seq ${index}`);
		if (event.seq !== index) throw new SessionFormatError(`format v4 event ${index} is not dense`);
		if (!knownEventTypes.has(event.type)) continue;
		assertV4RetiredSyntax(event);
		assertV4SystemMessageFields(event);
		assertV4ToolResultMessage(event);
		assertV4ForkResult(event);
		if (event.type === "session/end-seed" && isSessionFormatJsonObject(event.data) && event.data["inherited"] === true) lastInheritedMarker = index;
	}
	if (artifact.header.isSeeded && lastInheritedMarker !== cut) throw new SessionFormatError("format v4 seeded header disagrees with its last inherited end-seed marker");
	if (!artifact.header.isSeeded && lastInheritedMarker !== void 0) throw new SessionFormatError("format v4 unseeded Session contains an inherited end-seed marker");
	assertReleasedV4Relationships(artifact, knownEventTypes);
	return artifact;
}
/**
* Validate delivery generation and active-generation coordinates before evaluating ownership.
* @param event - decoded event whose delivery payload may be inspected.
* @param currentVersion - generation whose watermark coordinates are active.
* @returns the active delivery's nonempty Session id, or undefined for other events and generations.
*/
function validateDeliveryAccepted(event, currentVersion) {
	if (event.type !== "session-log-deepseek/delivery-accepted") return void 0;
	const data = event.data;
	if (!isSessionFormatJsonObject(data)) throw new SessionFormatError("delivery-accepted data must be an object");
	if (sessionFormatCount(data["sessionFormatVersion"] === void 0 ? 0 : data["sessionFormatVersion"], "delivery sessionFormatVersion") !== currentVersion) return void 0;
	if (sessionFormatCount(data["throughSeq"], "delivery throughSeq") >= event.seq) throw new SessionFormatError("delivery throughSeq must precede its marker");
	const id = data["sessionId"];
	if (typeof id !== "string" || id.length === 0) throw new SessionFormatError("delivery requires a nonempty Session id");
	return id;
}
/**
* Validate native developer fields, message sources, lifecycle, catalog, and delivery
* relationships without changing event vocabulary or tail recovery.
* The owning admission stage rejects unknown required events;
* unknown ignorable records retain their uninterpreted payloads.
* @param artifact - decoded artifact with its final inherited cut.
* @param knownEventTypes - installed event types whose payloads this reader interprets.
*/
function assertReleasedV4Relationships(artifact, knownEventTypes) {
	const ids = /* @__PURE__ */ new Set();
	for (const event of artifact.events) {
		if (!knownEventTypes.has(event.type)) continue;
		assertV4DeveloperData(event);
		assertV4MessageSources(event);
		const deliveryId = validateDeliveryAccepted(event, 4);
		if (deliveryId !== void 0 && !(artifact.header.parentSession !== void 0 && event.seq < artifact.inheritedEventCount) && deliveryId !== artifact.header.id) throw new SessionFormatError("current-generation delivery marker names the wrong Session");
		if (event.type === "subagent/catalog" && event.seq >= artifact.inheritedEventCount) {
			const id = catalogFact(event.data)["childId"];
			if (ids.has(id)) throw new SessionFormatError(`duplicate catalog child ${id}`);
			ids.add(id);
		}
	}
	assertV4LifecycleRelationships(artifact, knownEventTypes);
}
//#endregion
//#region lib/types/codec.js
/** V4 framing with native tool-role admission and released physical rows. */
function physicalV2(value) {
	if (!isSessionFormatJsonObject(value) || value["version"] !== 4) throw new SessionFormatError("expected format v4 physical header");
	return {
		...value,
		version: 2
	};
}
/**
* V4 physical encoder and decoder retain the released row framing while
* validating the native tool-role message directly.
*/
const releasedV4SessionFormatCodec = Object.freeze({
	version: 4,
	decodeHeader(value) {
		return {
			...releasedV2SessionFormatCodec.decodeHeader(physicalV2(value)),
			version: 4
		};
	},
	createDecoder(value, recovery) {
		const decoder = releasedV2SessionFormatCodec.createDecoder(physicalV2(value), recovery);
		return {
			...decoder,
			header: {
				...decoder.header,
				version: 4
			},
			decodeRow(row, context) {
				assertV4RowAdmission(row);
				decoder.decodeRow(row, {
					emitRun: context.emitRun.bind(context),
					emitEvent: context.emitEvent.bind(context)
				});
			}
		};
	},
	encodeHeader(header, inheritedEventCount) {
		assertReleasedV4Header(header);
		return {
			...releasedV2SessionFormatCodec.encodeHeader({
				...header,
				version: 2
			}, inheritedEventCount),
			version: 4
		};
	},
	encodeEvent(event) {
		if (event.type === "developer/message" && event["ignorable"] === true) {
			assertV4DeveloperData(event);
			assertV4RetiredSyntax(event);
		}
		assertV4RowAdmission(event);
		return releasedV2SessionFormatCodec.encodeEvent(event);
	}
});
/**
* Apply native V4 admission before a scanner discards a recoverable suffix.
* Ignorable developer payloads require reader vocabulary; physical decoding defers them.
* @param row - parsed physical row before framing and source-event range decoding.
* @param knownEventTypes - installed event types, supplied by native readers before tail recovery.
*/
function assertV4RowAdmission(row, knownEventTypes) {
	if (isSessionFormatJsonObject(row)) {
		if (row["type"] === "developer/message" && row["ignorable"] === true && knownEventTypes?.has("developer/message") !== true) return;
		assertV4DeveloperData(row);
	}
	assertV4SourceRowAdmission(row);
	assertV4RetiredSyntax(row);
	assertV4SystemMessageFields(row);
	if (!isSessionFormatJsonObject(row) || row["type"] !== "tool/result") return;
	const event = row;
	assertV4ToolResultMessage(event);
	assertV4ForkResult(event);
}
//#endregion
//#region lib/types/content.js
/** V3 content tags and request-tool fields admitted before V4 interpretation. */
const V3_BLOCK_TYPES = new Set([
	"text",
	"reasoning",
	"image",
	"file",
	"tool-call",
	"tool-result"
]);
function migrateBlock(value, subject) {
	if (!isSessionFormatJsonObject(value) || typeof value["type"] !== "string") throw new SessionFormatError(`${subject} requires content blocks with string type tags`);
	const type = value["type"];
	if (V3_BLOCK_TYPES.has(type)) return value;
	return {
		...value,
		type: `plugin:${type}`
	};
}
/**
* Convert declared content tags while keeping arguments and extension data opaque.
* @param value - released content array.
* @param subject - owning event and content location for diagnostics.
* @returns content in the same order, sharing unchanged blocks and image references.
*/
function migrateV3Content(value, subject) {
	if (!Array.isArray(value)) throw new SessionFormatError(`${subject} content must be an array`);
	const mapped = value.map((block, index) => migrateBlock(block, `${subject}[${index}]`));
	return mapped.every((block, index) => block === value[index]) ? value : mapped;
}
function migrateMessage(message, subject) {
	const content = migrateV3Content(message["content"], subject);
	return content === message["content"] ? message : {
		...message,
		content
	};
}
function migrateChunk(value, subject) {
	if (!isSessionFormatJsonObject(value)) return value;
	if (value["type"] === "block-end") {
		const block = migrateBlock(value["block"], `${subject}.block`);
		return block === value["block"] ? value : {
			...value,
			block
		};
	}
	if (value["type"] !== "block-start") return value;
	const original = value["blockType"];
	if (typeof original !== "string") throw new SessionFormatError(`${subject} blockType must be a string`);
	const blockType = V3_BLOCK_TYPES.has(original) ? original : `plugin:${original}`;
	return blockType === original ? value : {
		...value,
		blockType
	};
}
/**
* Convert declared V3 extension content and stream tags after canonical result lifting.
* @param event - source event after producer attribution conversion.
* @returns the event with namespaced content tags, retaining all coordinates and other fields.
* @throws {SessionFormatUnsupportedMigrationError} A V3 tool definition contains the V4-only deferLoading field.
*/
function migrateV3EventContent(event) {
	const subject = `format v3 ${event.type} at seq ${event.seq}`;
	let mapped = mapEventMessages(event, (message) => migrateMessage(message, subject));
	if (!isSessionFormatJsonObject(mapped.data)) return mapped;
	let data = mapped.data;
	const contentField = (key) => {
		const content = migrateV3Content(data[key], `${subject}.${key}`);
		if (content !== data[key]) data = {
			...data,
			[key]: content
		};
	};
	if (event.type === "compaction/summary") {
		contentField("summary");
		if (data["rawOutput"] !== void 0) contentField("rawOutput");
	} else if (event.type === "tool/ptc-dispatch") contentField("content");
	else if (event.type === "team/message/queued" && isSessionFormatJsonObject(data["message"])) {
		const message = migrateMessage(data["message"], subject);
		if (message !== data["message"]) data = {
			...data,
			message
		};
	}
	if (event.type === "request/header" && isSessionFormatJsonObject(data["header"])) {
		const tools = data["header"]["tools"];
		if (Array.isArray(tools)) {
			for (const [index, tool] of tools.entries()) if (isSessionFormatJsonObject(tool) && Object.hasOwn(tool, "deferLoading")) throw new SessionFormatUnsupportedMigrationError(`${subject}.header.tools[${index}] contains deferLoading, which is only defined in V4`);
		}
	}
	if ((event.type === "assistant/message" || event.type === "assistant/attempt") && Array.isArray(data["stream"])) {
		const stream = data["stream"];
		const converted = stream.map((entry, index) => {
			if (!isSessionFormatJsonObject(entry) || entry["type"] !== "chunk") return entry;
			const chunk = migrateChunk(entry["chunk"], `${subject}.stream[${index}]`);
			return chunk === entry["chunk"] ? entry : {
				...entry,
				chunk
			};
		});
		if (converted.some((entry, index) => entry !== stream[index])) data = {
			...data,
			stream: converted
		};
	}
	if (data !== mapped.data) mapped = {
		...mapped,
		data
	};
	return mapped;
}
//#endregion
//#region lib/types/extension-identities.js
/** Fixed V3 event vocabulary and namespaced historical opaque events. */
/** First-party event names understood by the released V3 reader, independent of the installed writer. */
const RELEASED_V3_EVENT_TYPES = new Set([
	"agent-preset/selected",
	"agent/inbox/spliced",
	"approval/asked",
	"approval/decided",
	"approval/policy",
	"assistant/attempt",
	"assistant/message",
	"command/done",
	"command/run",
	"compaction/end",
	"compaction/prune",
	"compaction/start",
	"compaction/summary",
	"deliverables/presented",
	"feedback/message-delete",
	"feedback/message-put",
	"feedback/record",
	"goal/change",
	"hook/invoked",
	"hook/result",
	"image/offload",
	"llm/retry",
	"llm/retry-started",
	"model/selection",
	"permission/preset",
	"plan/mode",
	"request/context",
	"request/header",
	"sandbox/mode",
	"schedule/change",
	"session-log-deepseek/delivery-accepted",
	"session/end-seed",
	"session/title",
	"session/title-llm-request",
	"step/end",
	"step/start",
	"subagent/catalog",
	"subagent/descriptor",
	"subagent/model-selection-policy",
	"system/message",
	"team/member",
	"team/message/delivered",
	"team/message/queued",
	"team/task",
	"todo/write",
	"tool-workflow/agent-end",
	"tool-workflow/agent-start",
	"tool-workflow/run-end",
	"tool-workflow/run-start",
	"tool/call",
	"tool/ptc-dispatch",
	"tool/ptc-dispatch-start",
	"tool/result",
	"turn/end",
	"turn/start",
	"user/message",
	"web/deepseek-search-llm-request",
	"workspace/changes"
]);
/**
* Keep unknown ignorable events opaque after header promotion.
* @param event - original V3 event; this incoming identity conversion is applied once.
* @returns the same event or an ignorable namespaced event retaining its payload and coordinates.
*/
function namespaceV3OpaqueEvent(event) {
	return event["ignorable"] === true && !RELEASED_V3_EVENT_TYPES.has(event.type) ? {
		...event,
		type: `plugin:${event.type}`,
		ignorable: true
	} : event;
}
//#endregion
//#region lib/types/references.js
/** Remap released V3 local event references after interrupted-turn insertion. */
function object(value) {
	if (!isSessionFormatJsonObject(value)) throw new SessionFormatError("V3 event reference container must be an object");
	return value;
}
/**
* Remap first-party local references, retaining generation-qualified captures and numeric payloads.
* @param event - first-party source event before envelope renumbering.
* @param seq - target event position.
* @param mapping - target positions of all earlier source events.
* @returns the event with target coordinates; unchanged events retain their identity.
*/
function remapV3References(event, seq, mapping) {
	if (seq === event.seq) return event;
	const reference = (value) => {
		const source = sessionFormatCount(value, "V3 source event reference");
		const target = mapping[source];
		if (source >= event.seq || target === void 0) throw new SessionFormatError("V3 reference must name an earlier source event");
		return target;
	};
	const references = (value) => {
		if (!Array.isArray(value)) throw new SessionFormatError("V3 event references must be an array");
		return value.map(reference);
	};
	let data = event.data;
	switch (event.type) {
		case "command/done": {
			const source = object(data);
			if (source["sourceEventSeq"] !== void 0) data = {
				...source,
				sourceEventSeq: reference(source["sourceEventSeq"])
			};
			break;
		}
		case "compaction/summary":
		case "compaction/prune": {
			const source = object(data);
			const range = object(source["shadowedRange"]);
			data = {
				...source,
				shadowedRange: {
					...range,
					start: reference(range["start"]),
					end: reference(range["end"])
				},
				shadowedSeqs: references(source["shadowedSeqs"])
			};
			break;
		}
		case "session/title":
		case "session/title-llm-request": {
			const source = object(data);
			data = {
				...source,
				messageSeqs: references(source["messageSeqs"])
			};
			break;
		}
		case "image/offload": {
			const source = object(data);
			const targets = source["targets"];
			if (!Array.isArray(targets)) throw new SessionFormatError("V3 image offload targets must be an array");
			data = {
				...source,
				targets: targets.map((value) => {
					const target = object(value);
					return {
						...target,
						seq: reference(target["seq"])
					};
				})
			};
			break;
		}
	}
	const surface = event["surfaceOp"];
	const range = surface === void 0 || surface === "append" ? void 0 : object(surface);
	return {
		...event,
		seq,
		data,
		...event["sourceEventSeqs"] === void 0 ? {} : { sourceEventSeqs: references(event["sourceEventSeqs"]) },
		...range === void 0 ? {} : { surfaceOp: {
			...range,
			startSeq: reference(range["startSeq"]),
			endSeq: reference(range["endSeq"])
		} }
	};
}
//#endregion
//#region lib/types/migration.js
/** Append historical child facts after converting V3 source events to V4. */
/** Header-only migration declaration; body restoration requires explicit child evidence. */
const sessionFormatV3ToV4 = defineSessionFormatMigration({
	name: "@deepseek-ai/dsh-session-format-v3-to-v4",
	fromVersion: 3,
	toVersion: 4,
	migrateHeader(header) {
		assertReleasedV3Header(header);
		return {
			...header,
			version: 4
		};
	},
	createStage() {
		throw new SessionFormatUnsupportedMigrationError("V3 catalog migration requires explicit historical child facts, including an empty array for a parent without children");
	},
	validateTargetHeader: assertReleasedV4Header
});
/**
* Bind one parent's historical child evidence to its V3→V4 migration.
* @param children - complete child evidence retained unchanged for the lifetime of this declaration; an empty array declares no children.
* @returns an adjacent migration that creates independent stages with the supplied evidence.
*/
function createSessionFormatV3ToV4(children) {
	return defineSessionFormatMigration({
		...sessionFormatV3ToV4,
		createStage: (input) => new ReleasedV3ToV4Stage(input, children)
	});
}
var ReleasedV3ToV4Stage = class {
	input;
	headerInheritedEventCount;
	candidates;
	catalogs = [];
	cut;
	sourceCut;
	mapping = [];
	turn;
	stepOpen = false;
	nextTurnSpliced = false;
	nextSeq = 0;
	time;
	foreignDeliverySeq;
	constructor(input, children) {
		this.input = input;
		this.candidates = children.map(childCatalogSource).sort((left, right) => left["childCreatedAt"] - right["childCreatedAt"] || (left["childId"] === right["childId"] ? 0 : left["childId"] < right["childId"] ? -1 : 1));
		this.cut = input.sourceHeader.isSeeded ? void 0 : 0;
		this.sourceCut = this.cut;
		if (!input.sourceHeader.isSeeded) this.headerInheritedEventCount = 0;
		this.time = input.sourceHeader.createdAt;
	}
	transformEvent(event, context) {
		if (event.seq !== this.mapping.length) throw new SessionFormatError("V3 source events must be dense");
		const interrupted = this.observeRestart(event);
		if (interrupted !== void 0) context.emitEvent({
			type: "turn/end",
			seq: this.nextSeq++,
			time: event.time,
			data: {
				turn: interrupted,
				reason: { kind: "interrupted" }
			}
		});
		const targetSeq = this.nextSeq++;
		this.time = event.time;
		if (event.type === "session/end-seed" && isSessionFormatJsonObject(event.data) && event.data["inherited"] === true) {
			if (!this.input.sourceHeader.isSeeded) throw new SessionFormatError("unseeded format v3 Session contains an inherited end-seed marker");
			this.sourceCut = event.seq;
			this.cut = targetSeq;
			this.catalogs.length = 0;
		} else if (event.type === "subagent/catalog") this.catalogs.push(event.data);
		const deliveryId = validateDeliveryAccepted(event, 3);
		if (event.type === "session-log-deepseek/delivery-accepted") {
			if (event.data["sessionFormatVersion"] === 4) throw new SessionFormatUnsupportedMigrationError("format v3 delivery marker claims target format v4");
			if (deliveryId !== void 0 && deliveryId !== this.input.sourceHeader.id) this.foreignDeliverySeq = event.seq;
		}
		const opaque = namespaceV3OpaqueEvent(event);
		if (opaque !== event) {
			this.mapping.push(targetSeq);
			context.emitEvent(opaque.seq === targetSeq ? opaque : {
				...opaque,
				seq: targetSeq
			});
			return;
		}
		if (!RELEASED_V3_EVENT_TYPES.has(event.type)) throw new SessionFormatUnsupportedMigrationError(`format v3 contains unknown event type ${JSON.stringify(event.type)} at seq ${event.seq}`);
		const remapped = remapV3References(event, targetSeq, this.mapping);
		this.mapping.push(targetSeq);
		const rewritten = mapEventMessages(remapped, (message) => {
			const source = message["source"];
			if (!isSessionFormatJsonObject(source)) return message;
			const converted = rewriteV3MessageSource(source, event.seq, message["role"]);
			return converted === source ? message : {
				...message,
				source: converted
			};
		});
		context.emitEvent(migrateV3EventContent(liftToolResult(rewritten)));
	}
	transformRun(run, context) {
		for (const event of run.expand()) this.transformEvent(event, context);
	}
	observeRestart(event) {
		const data = event.data;
		const interrupted = event.type === "turn/start" && this.turn !== void 0 && !this.stepOpen && this.nextTurnSpliced && isSessionFormatJsonObject(data) && data["turn"] === this.turn + 1 ? this.turn : void 0;
		this.nextTurnSpliced = event.type === "agent/inbox/spliced" && isSessionFormatJsonObject(data) && data["target"] === "next-turn" && Array.isArray(data["inserted"]) && data["inserted"].length > 0;
		if (event.type === "turn/start" && isSessionFormatJsonObject(data) && typeof data["turn"] === "number") this.turn = data["turn"];
		else if (event.type === "turn/end") this.turn = void 0;
		else if (event.type === "step/start") this.stepOpen = true;
		else if (event.type === "step/end") this.stepOpen = false;
		return interrupted;
	}
	finish(context) {
		const cut = sessionFormatCount(this.cut, "V3 inherited event count");
		const sourceCut = sessionFormatCount(this.sourceCut, "V3 source inherited event count");
		const existingCatalogs = /* @__PURE__ */ new Map();
		for (const data of this.catalogs) {
			const fact = catalogFact(data);
			const id = fact["childId"];
			if (existingCatalogs.has(id)) throw new SessionFormatUnsupportedMigrationError(`duplicate catalog child ${id}`);
			existingCatalogs.set(id, fact);
		}
		if (this.input.sourceInheritedEventCount !== void 0 && sourceCut !== this.input.sourceInheritedEventCount) throw new SessionFormatError("format v3 inherited cut disagrees with its source marker");
		if (this.foreignDeliverySeq !== void 0 && (this.input.sourceHeader.parentSession === void 0 || this.foreignDeliverySeq >= sourceCut)) throw new SessionFormatError("current-generation delivery marker names the wrong Session");
		for (const source of this.candidates) {
			const id = source["childId"];
			const existing = existingCatalogs.get(id);
			const fact = childCatalogFact(source);
			if (existing !== void 0) {
				if (existing["childCreatedAt"] !== source["childCreatedAt"]) throw new SessionFormatUnsupportedMigrationError(`${childCatalogSubject(source)} conflicts with its parent catalog`);
				if (fact !== void 0 && ["mode", "label"].some((key) => existing[key] !== fact[key])) throw new SessionFormatUnsupportedMigrationError(`${childCatalogSubject(source)} conflicts with its parent catalog`);
				continue;
			}
			const entry = fact ?? {
				version: 1,
				childId: id,
				childCreatedAt: source["childCreatedAt"],
				mode: "unknown"
			};
			existingCatalogs.set(id, entry);
			context.emitEvent({
				type: "subagent/catalog",
				seq: this.nextSeq++,
				time: this.time,
				data: entry
			});
		}
		return cut;
	}
};
//#endregion
export { RELEASED_V3_EVENT_TYPES, assertReleasedV4Header, assertReleasedV4Relationships, assertV4RowAdmission, createSessionFormatV3ToV4, historicalChildCatalogSource, releasedV3SessionFormatCodec, releasedV4SessionFormatCodec, restoreReleasedV4Artifact, sessionFormatV3ToV4 };
