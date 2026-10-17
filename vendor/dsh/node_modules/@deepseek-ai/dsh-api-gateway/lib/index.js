import { randomUUID } from "node:crypto";
import { Service, symbols } from "@deepseek-ai/cordis";
import { Deque } from "@deepseek-ai/dsh-deque";
import { MAX_TIMER_DELAY_MS } from "@deepseek-ai/dsh-timeout";
import z from "@deepseek-ai/schemastery";
import { RemoteError, isRemoteJsonValue, remoteErrorOf, remoteMethods } from "@deepseek-ai/dsh-typert-protocol";
import WebSocket, { WebSocketServer } from "ws";
//#region lib/types/access.js
/**
* Resource resolution for non-owner access decisions: the resources one call
* or one forwarded event touches, read from Typert-validated arguments before
* any lookup or Context resolves them.
* @module @deepseek-ai/dsh-api-gateway/src/access
*/
const GLOBAL = Object.freeze([Object.freeze({ kind: "global" })]);
/**
* Resolve the resources one call touches. For each resource kind, a
* `resources` reader of the method wins; otherwise every lookup parameter
* whose provider declares the kind contributes its wire resource id, and so
* does the Context identity of a Context method whose Host adapter declares
* the kind; otherwise the kind's default field registered in
* `typert.resources` is read from a top-level argument or, failing that,
* from the first object argument.
* @param typert - registry holding default fields, lookup providers, and Host Context adapters.
* @param readers - the method's `resources` readers, or `undefined` when it declares none.
* @param descriptor - receiver, parameter order, lookups, and cancellation slot of the method.
* @param args - named arguments matched to the descriptor's field set: JSON
*   arguments as their Typert codecs validated them, lookup and Context
*   identities as wire values.
* @param signal - value placed in the cancellation slot of the positional arguments.
* @returns the touched resources, the global resource alone when none;
*   `undefined` when the resources are invalid: a reader throws or returns
*   an empty list, a default field holds an array, or a resource id is not a
*   non-empty string.
*/
function callResources(typert, readers, descriptor, args, signal) {
	const sources = /* @__PURE__ */ new Map();
	for (const { kind, field } of typert.resources.entries()) sources.set(kind, () => {
		const id = defaultFieldId(descriptor, args, field);
		return Array.isArray(id) ? "invalid" : id === void 0 ? [] : [id];
	});
	for (const [kind, ids] of lookupResources(typert, descriptor, args)) sources.set(kind, () => ids);
	let positional;
	for (const [kind, reader] of Object.entries(readers ?? {})) sources.set(kind, () => {
		positional ??= [...descriptor.parameters.map((parameter) => args[parameter.wire]), ...descriptor.cancellation === void 0 ? [] : [signal]];
		return read(reader, positional, []);
	});
	const resources = [];
	for (const [kind, ids] of sources) if (!collect(resources, kind, ids())) return void 0;
	return resources.length === 0 ? GLOBAL : resources;
}
/**
* Resolve the resources one forwarded event notification touches. An event
* carries every resource it declares, so a reader returning `undefined`
* makes the notification invalid instead of a global one.
* @param readers - the event entry's declared readers, or `undefined` when it declares none.
* @param args - the event's validated JSON arguments, passed to each reader as its positional arguments.
* @returns the global resource alone without readers, including an empty
*   reader set; otherwise the touched resources; `undefined` when the
*   resources are invalid: a resource id is missing or malformed.
*/
function eventResources(readers, args) {
	const declared = Object.entries(readers ?? {});
	if (declared.length === 0) return GLOBAL;
	const resources = [];
	for (const [kind, reader] of declared) if (!collect(resources, kind, read(reader, args, "invalid"))) return void 0;
	return resources;
}
/**
* The resource ids lookup parameters and the Context identity name, per
* resource kind: the Context identity first, then lookup parameters in order.
* An optional lookup parameter the call omits names no resource id; the
* Context identity is required.
*/
function lookupResources(typert, descriptor, args) {
	const ids = /* @__PURE__ */ new Map();
	const add = (kind, id) => {
		const list = ids.get(kind);
		if (list === void 0) ids.set(kind, [id]);
		else list.push(id);
	};
	const receiver = descriptor.invocation;
	if (receiver.kind === "context") {
		const kind = typert.contexts.getHost(receiver.context)?.resource;
		if (kind !== void 0) add(kind, args[receiver.wire]);
	}
	for (const parameter of descriptor.parameters) {
		if (parameter.lookup === void 0) continue;
		const kind = typert.lookups.get(parameter.lookup)?.resource;
		const id = args[parameter.wire];
		if (kind !== void 0 && id !== void 0) add(kind, id);
	}
	return ids;
}
/** Run one reader with spread positional arguments: `undefined` yields `absent`, a list names several and must not be empty. */
function read(reader, args, absent) {
	let value;
	try {
		value = reader(...args);
	} catch {
		return "invalid";
	}
	if (value === void 0) return absent;
	if (!Array.isArray(value)) return [value];
	return value.length === 0 ? "invalid" : value;
}
/** Append one kind's resource ids; false when any is malformed. */
function collect(resources, kind, ids) {
	if (ids === "invalid") return false;
	for (const id of ids) {
		if (typeof id !== "string" || id.length === 0) return false;
		resources.push({
			kind,
			id
		});
	}
	return true;
}
/** The default field: a top-level argument, else that field of the first object argument. */
function defaultFieldId(descriptor, args, field) {
	if (descriptor.parameters.some((parameter) => parameter.wire === field)) return args[field];
	for (const parameter of descriptor.parameters) {
		const value = args[parameter.wire];
		if (typeof value !== "object" || value === null || Array.isArray(value)) continue;
		if (!Object.hasOwn(value, field)) return void 0;
		return Reflect.get(value, field);
	}
}
//#endregion
//#region lib/types/stream-protocol.js
/** Wire messages for Gateway-owned Remote streams and event-result RPCs. */
/** Exact WebSocket route carrying every Typert Remote stream. */
const REMOTE_STREAM_MUX_PATH = "/api/remote.mux";
/** Gateway-internal logical stream carrying application-selected Cordis events. */
const REMOTE_EVENT_STREAM_ENDPOINT = "$events";
/** Discriminator for the first item proving the Host event source is ready. */
const REMOTE_EVENT_STREAM_READY = { type: "ready" };
/**
* Parse one result sent through the Client's `$events/result` HTTP RPC.
* @param value - untrusted result payload.
* @returns validated event correlation and outcome fields.
*/
function parseRemoteEventResult(value) {
	if (!isRecord(value) || !exactKeys(value, [
		"clientId",
		"eventId",
		"outcome"
	]) || !isRemoteEventClientId(value.clientId) || !isRemoteEventId(value.eventId) || !isRecord(value.outcome)) throw new Error("api gateway: invalid Remote event result");
	const outcome = value.outcome;
	if (outcome.kind === "next" && exactKeys(outcome, ["kind"])) return {
		clientId: value.clientId,
		eventId: value.eventId,
		outcome: { kind: "next" }
	};
	if (outcome.kind === "result" && (exactKeys(outcome, ["kind"]) || exactKeys(outcome, ["kind", "value"])) && (!Object.hasOwn(outcome, "value") || isRemoteJsonValue(outcome.value))) return {
		clientId: value.clientId,
		eventId: value.eventId,
		outcome: Object.hasOwn(outcome, "value") ? {
			kind: "result",
			value: outcome.value
		} : { kind: "result" }
	};
	if (outcome.kind === "rejected" && exactKeys(outcome, ["kind", "error"])) return {
		clientId: value.clientId,
		eventId: value.eventId,
		outcome: {
			kind: "rejected",
			error: parseRemoteEventRejection(outcome.error)
		}
	};
	throw new Error("api gateway: invalid Remote event result");
}
/**
* Remove the direct Agent and cancellation fields from one waterfall request.
* @param value - request object before the waterfall's `next` callback.
* @param subject - Agent used by the Cordis scope carrier.
* @returns JSON-safe request fields and the optional Host cancellation signal.
*/
function projectRemoteEventRequest(value, subject) {
	if (!isPlainRecord(value) || !Object.hasOwn(value, "agent") || value.agent !== subject) throw new TypeError("api gateway: Remote event request must carry its scoped Agent directly");
	const signal = value.signal;
	if (signal !== void 0 && !(signal instanceof AbortSignal)) throw new TypeError("api gateway: Remote event request signal must be an AbortSignal");
	const request = Object.create(null);
	for (const key of Reflect.ownKeys(value)) {
		if (key === "agent" || key === "signal") continue;
		if (typeof key !== "string" || (typeof key === "string" ? Object.getOwnPropertyDescriptor(value, key) : void 0)?.enumerable !== true) throw new TypeError("api gateway: Remote event request has a non-JSON property");
		request[key] = Reflect.get(value, key);
	}
	if (!isRemoteJsonValue(request)) throw new TypeError("api gateway: Remote event request is not lossless JSON data");
	return {
		request,
		...signal === void 0 ? {} : { signal }
	};
}
/**
* Recreate a Client rejection for the Host continuation.
* @param rejection - validated wire-safe error fields.
* @returns an Error preserving the remote name, code, and JSON-safe details.
*/
function restoreRemoteEventRejection(rejection) {
	const error = new Error(rejection.message);
	error.name = rejection.name;
	if (rejection.code !== void 0) error.code = rejection.code;
	if (rejection.details !== void 0) error.details = rejection.details;
	return error;
}
/**
* Recognize a non-empty Remote Event correlation id at a wire boundary.
* @param value - untrusted wire value.
* @returns whether the value is a valid Remote Event id.
*/
function isRemoteEventId(value) {
	return typeof value === "string" && value.length > 0;
}
/**
* Recognize a non-empty Remote Event Client id at a wire boundary.
* @param value - untrusted wire value.
* @returns whether the value identifies one event-stream generation.
*/
function isRemoteEventClientId(value) {
	return typeof value === "string" && value.length > 0;
}
/**
* Recognize the direct Agent identity used by a scoped Remote Event.
* @param value - untrusted wire value.
* @returns whether the value is a non-empty Agent identity.
*/
function isRemoteEventAgentId(value) {
	return typeof value === "string" && value.length > 0;
}
/**
* Parse and validate one browser-to-Host text message.
* @param text - complete WebSocket text message.
* @returns the validated logical-stream request.
*/
function parseRemoteStreamClientMessage(text) {
	return parseMessage(text, (value) => {
		if ((value.type === "cancel" || value.type === "end") && exactKeys(value, ["type", "streamId"]) && validId(value.streamId)) return value;
		if (value.type === "item" && (exactKeys(value, ["type", "streamId"]) || exactKeys(value, [
			"type",
			"streamId",
			"value"
		])) && validId(value.streamId) && (!Object.hasOwn(value, "value") || isRemoteJsonValue(value.value))) return value;
		if (value.type === "open" && exactKeys(value, [
			"type",
			"streamId",
			"endpoint",
			"payload"
		]) && validId(value.streamId) && typeof value.endpoint === "string" && value.endpoint.length > 0) return value;
		throw new Error("api gateway: invalid Remote stream client message");
	});
}
function parseMessage(text, validate) {
	let decoded;
	try {
		decoded = JSON.parse(text);
	} catch (cause) {
		throw new Error("api gateway: Remote stream message is not JSON", { cause });
	}
	if (!isRecord(decoded)) throw new Error("api gateway: Remote stream message must be an object");
	return validate(decoded);
}
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isPlainRecord(value) {
	if (!isRecord(value)) return false;
	const prototype = Object.getPrototypeOf(value);
	return prototype === Object.prototype || prototype === null;
}
function exactKeys(value, expected) {
	return Reflect.ownKeys(value).length === expected.length && expected.every((key) => Object.hasOwn(value, key));
}
function validId(value) {
	return typeof value === "string" && value.length > 0;
}
function parseRemoteEventRejection(value) {
	if (!isRecord(value) || !hasOnlyKeys(value, ["name", "message"], ["code", "details"]) || typeof value.name !== "string" || value.name.length === 0 || typeof value.message !== "string" || Object.hasOwn(value, "code") && typeof value.code !== "string" || Object.hasOwn(value, "details") && !isRemoteJsonValue(value.details)) throw new Error("api gateway: invalid Remote event rejection");
	return {
		name: value.name,
		message: value.message,
		...typeof value.code === "string" ? { code: value.code } : {},
		...Object.hasOwn(value, "details") ? { details: value.details } : {}
	};
}
function hasOnlyKeys(value, required, optional) {
	const keys = Reflect.ownKeys(value);
	return required.every((key) => Object.hasOwn(value, key)) && keys.every((key) => typeof key === "string" && (required.includes(key) || optional.includes(key)));
}
//#endregion
//#region lib/types/stream-server.js
/** Host WebSocket owner for multiplexed Typert Remote streams. */
const MAX_MISSED_HEARTBEATS = 2;
/** Own the no-server WebSocket acceptor and every active logical stream. */
var RemoteStreamMuxServer = class {
	open;
	failure;
	heartbeatIntervalMs;
	streamInboxBytes;
	server = new WebSocketServer({ noServer: true });
	connections = /* @__PURE__ */ new Set();
	missedHeartbeats = /* @__PURE__ */ new WeakMap();
	heartbeatTimer;
	/**
	* @param open - Gateway stream dispatcher.
	* @param failure - Gateway error-to-wire mapper.
	* @param heartbeatIntervalMs - interval between WebSocket Ping control frames.
	* @param streamInboxBytes - buffered uplink frame bytes one logical stream may hold before it fails.
	*/
	constructor(open, failure, heartbeatIntervalMs, streamInboxBytes) {
		this.open = open;
		this.failure = failure;
		this.heartbeatIntervalMs = heartbeatIntervalMs;
		this.streamInboxBytes = streamInboxBytes;
	}
	/**
	* Upgrade one admitted request and begin serving its logical streams. Every
	* stream the socket opens speaks for the Peer admitted at upgrade, and the
	* socket closes when that Peer's scope is disposed.
	* @param req - authenticated HTTP upgrade request.
	* @param socket - carrier socket transferred to the WebSocket server.
	* @param head - bytes already read after the HTTP upgrade headers.
	* @param peer - Peer the upgrade was admitted as.
	*/
	handleUpgrade(req, socket, head, peer) {
		this.server.handleUpgrade(req, socket, head, (websocket) => {
			const release = bindPeer(websocket, peer);
			if (release === void 0) return;
			const alive = () => {
				this.missedHeartbeats.set(websocket, 0);
			};
			alive();
			this.startHeartbeat();
			const bound = (endpoint, payload, uplink, control, window) => this.open(endpoint, payload, uplink, peer, control, window);
			const done = new RemoteStreamMuxConnection(websocket, bound, this.failure, this.streamInboxBytes, alive).run().catch((error) => {
				console.error("[api-gateway] Remote stream connection failed:", error);
			}).then(async () => {
				await release();
			}).catch((error) => {
				console.error("[api-gateway] Remote stream scope cleanup failed:", error);
			});
			this.connections.add(done);
			done.then(() => {
				this.connections.delete(done);
			});
		});
	}
	/** Terminate all sockets and wait until every iterator has returned. */
	async close() {
		clearInterval(this.heartbeatTimer);
		this.heartbeatTimer = void 0;
		for (const socket of this.server.clients) socket.terminate();
		const closed = Promise.withResolvers();
		this.server.close((error) => {
			if (error === void 0) closed.resolve();
			else closed.reject(error);
		});
		await closed.promise;
		await Promise.all(this.connections);
	}
	/** Start one `unref()` timer after the first upgrade; it spans empty-client periods until close(). */
	startHeartbeat() {
		if (this.heartbeatTimer !== void 0) return;
		this.heartbeatTimer = setInterval(() => {
			for (const socket of this.server.clients) {
				if (socket.readyState !== WebSocket.OPEN) continue;
				const missed = this.missedHeartbeats.get(socket);
				if (missed >= MAX_MISSED_HEARTBEATS) {
					setImmediate(() => {
						if (this.missedHeartbeats.get(socket) >= MAX_MISSED_HEARTBEATS) socket.terminate();
					});
					continue;
				}
				this.missedHeartbeats.set(socket, missed + 1);
				socket.ping();
			}
		}, this.heartbeatIntervalMs);
		this.heartbeatTimer.unref();
	}
};
var RemoteStreamMuxConnection = class {
	socket;
	open;
	failure;
	streamInboxBytes;
	alive;
	streams = /* @__PURE__ */ new Map();
	writes = Promise.resolve();
	constructor(socket, open, failure, streamInboxBytes, alive) {
		this.socket = socket;
		this.open = open;
		this.failure = failure;
		this.streamInboxBytes = streamInboxBytes;
		this.alive = alive;
	}
	/**
	* Serve frames until the socket closes. A Pong, any received frame, and a
	* downlink write that waited in the local send buffer and then completed
	* count as peer activity, so a congested link that delays the Pong behind
	* data keeps its socket. A write that completes at once proves nothing
	* about the peer and does not count.
	*/
	async run() {
		await new Promise((resolve) => {
			this.socket.once("close", resolve);
			this.socket.once("error", () => {
				this.socket.terminate();
			});
			this.socket.on("pong", this.alive);
			this.socket.on("message", (data, isBinary) => {
				this.alive();
				if (isBinary) {
					this.socket.close(1003, "text messages required");
					return;
				}
				try {
					this.receive(rawText(data));
				} catch {
					this.socket.close(1008, "invalid Remote stream request");
				}
			});
		});
		const active = [...this.streams.values()];
		for (const stream of active) stream.stop(/* @__PURE__ */ new Error("Remote stream socket closed"));
		await Promise.all(active.map((stream) => stream.done));
	}
	/**
	* Dispatch one frame. `item`, `end`, and `cancel` for a stream this connection
	* no longer owns are dropped: a finished stream leaves the table while the
	* Client's in-flight frames are still arriving. A duplicate `open` is the one
	* protocol violation that closes the socket.
	*/
	receive(text) {
		const message = parseRemoteStreamClientMessage(text);
		switch (message.type) {
			case "open":
				this.openStream(message);
				return;
			case "item":
				this.streams.get(message.streamId)?.inbox.push(message.value, Buffer.byteLength(text, "utf8"));
				return;
			case "end":
				this.streams.get(message.streamId)?.inbox.end();
				return;
			case "cancel":
				this.streams.get(message.streamId)?.stop(/* @__PURE__ */ new Error("Remote stream cancelled"));
				return;
			/* v8 ignore next 4 -- parseRemoteStreamClientMessage admits only the four frame types above. */
			default: throw new Error(`api gateway: unknown Remote stream client message ${JSON.stringify(message)}`);
		}
	}
	openStream(message) {
		if (this.streams.has(message.streamId)) throw new Error(`api gateway: duplicate Remote stream id ${JSON.stringify(message.streamId)}`);
		const abort = new AbortController();
		const inbox = new UplinkInbox(this.streamInboxBytes, message.endpoint, (error) => {
			abort.abort(error);
		});
		const active = {
			abort,
			inbox,
			stop: (reason) => {
				abort.abort(reason);
				inbox.fail(reason);
			},
			done: Promise.resolve()
		};
		this.streams.set(message.streamId, active);
		const done = this.pump(message.streamId, message.endpoint, message.payload, active);
		active.done = done;
		const remove = () => {
			this.streams.delete(message.streamId);
		};
		done.then(remove, remove);
	}
	async pump(streamId, endpoint, payload, active) {
		let outcome;
		try {
			const source = await this.open(endpoint, payload, active.inbox, active.abort, {
				maxBytes: this.streamInboxBytes,
				frameOverheadBytes: Buffer.byteLength(JSON.stringify({
					type: "item",
					streamId,
					value: null
				}), "utf8") - 4
			});
			for await (const value of source) await this.send({
				type: "item",
				streamId,
				value
			});
			outcome = { failed: false };
		} catch (error) {
			outcome = {
				failed: true,
				error
			};
		}
		active.inbox.fail(/* @__PURE__ */ new Error("Remote stream ended"));
		if (active.abort.signal.aborted) {
			const reason = active.abort.signal.reason;
			if (remoteErrorOf(reason) !== void 0) await this.sendFailure(streamId, reason);
			return;
		}
		if (outcome.failed) {
			await this.sendFailure(streamId, outcome.error);
			return;
		}
		try {
			await this.send({
				type: "end",
				streamId
			});
		} catch (error) {
			await this.sendFailure(streamId, error);
		}
	}
	async sendFailure(streamId, error) {
		if (this.socket.readyState !== WebSocket.OPEN) return;
		try {
			await this.send({
				type: "error",
				streamId,
				error: this.failure(error)
			});
		} catch {
			this.socket.close(1011, "Remote stream failure could not be delivered");
		}
	}
	send(message) {
		let text;
		try {
			text = JSON.stringify(message);
		} catch (cause) {
			return Promise.reject(new Error("api gateway: Remote stream item is not JSON serializable", { cause }));
		}
		const delivery = this.writes.then(() => new Promise((resolve, reject) => {
			if (this.socket.readyState !== WebSocket.OPEN) {
				reject(/* @__PURE__ */ new Error("api gateway: Remote stream socket is closed"));
				return;
			}
			let queued = false;
			this.socket.send(text, (error) => {
				if (error) {
					reject(error);
					return;
				}
				if (queued) this.alive();
				resolve();
			});
			queued = this.socket.bufferedAmount > 0;
		}));
		this.writes = delivery.catch(() => void 0);
		return delivery;
	}
};
const UPLINK_DONE$1 = {
	value: void 0,
	done: true
};
/**
* Bounded single-consumer uplink queue of one logical stream, the source the
* Host method reads through `invocation.uplink()`. Buffered frame bytes are
* capped: overflow, and an item after the Client's `end`, fail the queue and
* report a Remote failure that the connection uses to fail the logical stream.
*/
var UplinkInbox = class {
	maxBytes;
	endpoint;
	onViolation;
	queue = new Deque();
	bytes = 0;
	ended = false;
	closed = false;
	taken = false;
	failure;
	wake;
	constructor(maxBytes, endpoint, onViolation) {
		this.maxBytes = maxBytes;
		this.endpoint = endpoint;
		this.onViolation = onViolation;
	}
	push(value, frameBytes) {
		if (this.failure !== void 0 || this.closed) return;
		if (this.ended) {
			this.violate(new RemoteError("gateway/protocol", "api gateway: Remote stream uplink item after end", { endpoint: this.endpoint }));
			return;
		}
		if (this.bytes + frameBytes > this.maxBytes) {
			this.violate(new RemoteError("gateway/uplink-overflow", `api gateway: Remote stream uplink exceeded ${String(this.maxBytes)} buffered bytes`, { endpoint: this.endpoint }));
			return;
		}
		this.queue.pushBack({
			value,
			bytes: frameBytes
		});
		this.bytes += frameBytes;
		this.signal();
	}
	/** Client half-close; idempotent. */
	end() {
		if (this.ended) return;
		this.ended = true;
		this.signal();
	}
	/** End the consumer's next read with `error`; idempotent, drops buffered items. */
	fail(error) {
		if (this.failure !== void 0) return;
		this.failure = error;
		this.queue.clear();
		this.bytes = 0;
		this.signal();
	}
	[Symbol.asyncIterator]() {
		if (this.taken) throw new Error("api gateway: Remote stream uplink inbox already has a consumer");
		this.taken = true;
		return this;
	}
	async next() {
		while (true) {
			if (this.closed) return UPLINK_DONE$1;
			const entry = this.queue.popFront();
			if (entry !== void 0) {
				this.bytes -= entry.bytes;
				return {
					value: entry.value,
					done: false
				};
			}
			if (this.failure !== void 0) throw this.failure;
			if (this.ended) return UPLINK_DONE$1;
			if (this.wake !== void 0) throw new Error("api gateway: Remote stream uplink inbox has one pending read");
			await new Promise((resolve) => {
				this.wake = resolve;
			});
		}
	}
	/** Consumer stopped reading: later items are dropped, a pending read ends. */
	return() {
		this.closed = true;
		this.queue.clear();
		this.bytes = 0;
		this.signal();
		return Promise.resolve(UPLINK_DONE$1);
	}
	violate(error) {
		this.fail(error);
		this.onViolation(error);
	}
	signal() {
		const wake = this.wake;
		this.wake = void 0;
		wake?.();
	}
};
/**
* Close the socket when the Peer's scope is disposed. A scope that is already
* disposed leaves no Peer for the socket to speak for, so the socket closes now.
* @returns the registration's disposer, or `undefined` when the socket was closed.
*/
function bindPeer(websocket, peer) {
	try {
		return peer.ctx.effect(() => () => {
			websocket.close(1001, "peer left");
		}, "api-gateway: Remote stream socket bound to its Peer");
	} catch {
		websocket.close(1001, "peer left");
		return;
	}
}
function rawText(data) {
	if (Array.isArray(data)) return Buffer.concat(data).toString("utf8");
	if (data instanceof ArrayBuffer) return Buffer.from(data).toString("utf8");
	return Buffer.from(data).toString("utf8");
}
/**
* Reject an upgrade without transferring socket ownership to ws.
* @param socket - carrier socket that receives the HTTP rejection.
* @param status - authentication or browser-trust rejection status.
*/
function rejectRemoteStreamUpgrade(socket, status) {
	const reason = status === 401 ? "Unauthorized" : status === 403 ? "Forbidden" : "Conflict";
	const body = reason.toLowerCase();
	socket.end([
		`HTTP/1.1 ${String(status)} ${reason}`,
		"Connection: close",
		"Content-Type: text/plain; charset=utf-8",
		`Content-Length: ${String(Buffer.byteLength(body))}`,
		"",
		body
	].join("\r\n"));
}
//#endregion
//#region lib/types/index.js
/**
* Live Typert Remote dispatch over Cordis Services and registered providers.
* Unary transport and response envelopes belong to Connection; live Remote
* streams use the Gateway-owned WebSocket mux.
* @module @deepseek-ai/dsh-api-gateway
*/
const NEVER_ABORTED_SIGNAL = new AbortController().signal;
const DEFAULT_WEBSOCKET_HEARTBEAT_INTERVAL_MS = 2e3;
const DEFAULT_STREAM_INBOX_BYTES = 262144;
const EMPTY_ASYNC_ITERABLE = { [Symbol.asyncIterator]: () => ({ next: () => Promise.resolve({
	value: void 0,
	done: true
}) }) };
const UPLINK_DONE = {
	value: void 0,
	done: true
};
const SRC_JSON_CODEC = { mode: "src-json" };
/**
* Dispatch failure produced outside the invoked business method. Rides the
* shared Remote failure vocabulary, so its code crosses the wire instead of
* folding to `internal`.
*/
var TypertGatewayError = class extends RemoteError {
	/** Canonical `<namespace>/<method>` endpoint. */
	endpoint;
	/** Affected wire field when the failure is field-specific. */
	field;
	/**
	* Construct a Gateway failure without embedding boundary values in its message.
	* @param code - stable failure category.
	* @param endpoint - canonical Remote endpoint.
	* @param message - correction-oriented diagnostic without sensitive values.
	* @param options - optional field and contained cause.
	*/
	constructor(code, endpoint, message, options = {}) {
		super(code, `typert gateway: ${endpoint}: ${message}`, {
			endpoint,
			...options.field === void 0 ? {} : { field: options.field }
		}, options.cause === void 0 ? void 0 : { cause: options.cause });
		this.name = "TypertGatewayError";
		this.endpoint = endpoint;
		this.field = options.field;
	}
};
/**
* Resolve strict generated definitions or conservative SRC markers against
* current Cordis Services and Typert providers.
* @typert service typertGateway
*/
var TypertGatewayService = class extends Service {
	static inject = ["typert", "remoteAccess"];
	static Config = z.object({
		websocketHeartbeatIntervalMs: z.number().step(1).min(1).max(MAX_TIMER_DELAY_MS).default(DEFAULT_WEBSOCKET_HEARTBEAT_INTERVAL_MS),
		streamInboxBytes: z.number().step(1).min(1).default(DEFAULT_STREAM_INBOX_BYTES)
	});
	/** Carrier adapter shared by the WebSocket mux and local Host transports. */
	wireStream = {
		open: (endpoint, payload, uplink, peer, signal) => this.openWireStream(endpoint, payload, uplink, peer, signal, new AbortController()),
		failure: (error) => rpcError(error)
	};
	srcClaims;
	remoteEvents;
	remoteEventClients = /* @__PURE__ */ new Map();
	pendingRemoteEvents = /* @__PURE__ */ new Map();
	/**
	* Register the Gateway against the active Typert registry.
	* WebSocket admission waits for launcher-owned application readiness when supplied;
	* direct invocation and in-process streams remain available independently.
	* @param ctx - owning Host Context with Typert registry access.
	* @param config - validated Gateway transport configuration.
	*/
	constructor(ctx, config) {
		super(ctx, "typertGateway");
		const resolved = config;
		ctx.on("internal/service", () => {
			this.srcClaims = void 0;
		});
		ctx.inject(["connection"], (connectionCtx) => {
			connectionCtx.connection.rpc.intercept("/api", (endpoint) => this.claimsEndpoint(endpoint), (endpoint, payload, signal, peer) => this.dispatchRpc(endpoint, payload, signal, peer));
		});
		ctx.inject(["connection", "webServer"], (webCtx) => {
			const listen = () => {
				const mux = new RemoteStreamMuxServer((endpoint, payload, uplink, peer, control, window) => this.openWireStream(endpoint, payload, uplink, peer, control.signal, control, window), this.wireStream.failure, resolved.websocketHeartbeatIntervalMs, resolved.streamInboxBytes);
				const releases = /* @__PURE__ */ new Set();
				webCtx.effect(function* () {
					yield async () => {
						await mux.close();
						await Promise.all(releases);
					};
					const route = {
						path: REMOTE_STREAM_MUX_PATH,
						handler: (req, socket, head) => {
							const admission = webCtx.connection.admitConnection(req);
							if ("rejection" in admission) {
								rejectRemoteStreamUpgrade(socket, admission.rejection);
								return;
							}
							const release = () => {
								const done = admission.release().catch((error) => {
									console.error("[api-gateway] Peer release failed:", error);
								});
								releases.add(done);
								done.then(() => {
									releases.delete(done);
								});
							};
							const closed = () => {
								socket.removeListener("error", release);
								release();
							};
							socket.on("error", release);
							socket.once("close", closed);
							if (socket.destroyed) {
								closed();
								return;
							}
							try {
								mux.handleUpgrade(req, socket, head, admission.peer);
							} catch (error) {
								release();
								socket.destroy();
								console.error("[api-gateway] Remote stream upgrade failed:", error);
							}
						}
					};
					yield webCtx.webServer.registerUpgrade(route);
				}, `api-gateway: ${REMOTE_STREAM_MUX_PATH} WebSocket`);
			};
			const ready = webCtx.get("appReady");
			if (ready === void 0) listen();
			else webCtx.effect(() => {
				let closed = false;
				const cancel = ready.onReady(() => {
					if (!closed) listen();
				});
				return () => {
					closed = true;
					cancel();
				};
			}, "api-gateway: application readiness");
		});
	}
	/**
	* Check for an active owner Client event stream, the only kind that can answer forwarded waterfalls.
	* @returns whether an owner stream is open and has not been cancelled.
	*/
	hasLiveClient() {
		for (const client of this.remoteEventClients.values()) if (client.answers && !client.signal.aborted) return true;
		return false;
	}
	/**
	* Register the sole application-selected forwarded-event source.
	* @param source - stream factory installed by the Remote assembly.
	* @param host - stable Host facts included in each Client generation's opening frame.
	* @returns disposer removing this source and cancelling its active streams.
	*/
	registerRemoteEvents(source, host) {
		if (this.remoteEvents !== void 0) throw new Error("typert gateway: forwarded Remote event source is already registered");
		const lifetime = new AbortController();
		const stream = source(lifetime.signal);
		const registration = {
			lifetime,
			done: this.consumeRemoteEvents(stream, lifetime.signal).catch((error) => {
				if (this.remoteEvents?.lifetime !== lifetime || lifetime.signal.aborted) return;
				this.closeRemoteEvents(error);
				this.remoteEvents = void 0;
				lifetime.abort(error);
			}),
			host: { home: host.home }
		};
		this.remoteEvents = registration;
		return async () => {
			if (this.remoteEvents === registration) {
				this.remoteEvents = void 0;
				const error = /* @__PURE__ */ new Error("typert gateway: forwarded Remote event source was removed");
				registration.lifetime.abort(error);
				this.closeRemoteEvents(error);
			}
			await registration.done;
		};
	}
	claimsEndpoint(endpoint) {
		if (endpoint === "$events/result") return true;
		const segments = endpoint.split("/");
		if (segments.length !== 2 || segments[0] === "" || segments[1] === "") return false;
		if (this.ctx.typert.local.get(endpoint) !== void 0 || this.ctx.typert.local.hasSeen(endpoint)) return true;
		this.srcClaims ??= this.collectSrcClaims();
		return this.srcClaims.has(endpoint);
	}
	/**
	* The `resources` readers of a method, read from the root Service's class
	* metadata so a Context method's receiver is not resolved before access is
	* decided; `undefined` when the Service is absent or the method declares none.
	*/
	resourceReaders(descriptor) {
		const receiver = this.ctx.get(descriptor.service);
		if (!isObject(receiver)) return void 0;
		const member = descriptor.implementation ?? descriptor.method;
		return remoteMethods(originalOf(receiver)).find((marker) => marker.method === member)?.resources;
	}
	collectSrcClaims() {
		const claims = /* @__PURE__ */ new Set();
		for (const [serviceKey, definition] of Object.entries(this.ctx.reflect.props)) {
			if (definition.type !== "service") continue;
			const receiver = this.ctx.get(serviceKey);
			if (!isObject(receiver)) continue;
			const original = originalOf(receiver);
			const binding = Reflect.get(original, "typertRemote");
			if (!isObject(binding) || typeof Reflect.get(binding, "namespace") !== "string") continue;
			const namespace = Reflect.get(binding, "namespace");
			for (const candidate of remoteMethods(original)) claims.add(endpointOf(namespace, candidate.exportName ?? candidate.method));
		}
		return claims;
	}
	/**
	* Invoke one live Remote method through strict generated reflection or SRC markers.
	* @param request - decoded endpoint and exact named wire arguments.
	* @returns the business result without output decoding.
	* @throws {@link TypertGatewayError} for dispatch, provider, or boundary failures; lookup-policy and business errors retain identity.
	*/
	async invoke(request) {
		return this.invokePrepared(await this.prepareInvocation(request, new AbortController()));
	}
	async invokePrepared(prepared) {
		if (prepared.descriptor.mode !== void 0) throw new TypertGatewayError("gateway/signature-invalid", prepared.endpoint, "stream Remote methods must be opened through the stream carrier");
		try {
			return await Reflect.apply(prepared.method, prepared.receiver, prepared.args);
		} catch (error) {
			if (prepared.invocation.signal.aborted) throw remoteCancelled(prepared.endpoint, error);
			throw error;
		} finally {
			await prepared.invocation.close();
		}
	}
	/**
	* Open one live stream Remote method without assuming a physical carrier.
	* @param request - decoded endpoint, named wire arguments, and the Client uplink when the carrier has one.
	* @returns a cancellation-aware iterable over the business results.
	*/
	async stream(request) {
		return this.openStream(request, new AbortController());
	}
	/**
	* `control` belongs to the logical stream: a rejected uplink item aborts it
	* with the Remote failure as the reason so the carrier delivers that failure.
	*/
	async openStream(request, control) {
		const prepared = await this.prepareInvocation(request, control);
		if (prepared.descriptor.mode === void 0) {
			await prepared.invocation.close();
			throw new TypertGatewayError("gateway/signature-invalid", prepared.endpoint, "unary Remote methods cannot be opened through the stream carrier");
		}
		let source;
		try {
			source = Reflect.apply(prepared.method, prepared.receiver, prepared.args);
		} catch (error) {
			await prepared.invocation.close();
			if (prepared.invocation.signal.aborted) throw remoteCancelled(prepared.endpoint, error);
			throw error;
		}
		if (!isIterable(source)) {
			await prepared.invocation.close();
			throw new TypertGatewayError("gateway/result-invalid", prepared.endpoint, "stream Remote method did not return Iterable or AsyncIterable", { field: "result" });
		}
		return cancellableStream(source, prepared.endpoint, prepared.invocation);
	}
	async dispatchRpc(endpoint, payload, signal, peer) {
		if (endpoint === "$events/result") try {
			assertPeerLive(peer, endpoint);
			requireInteractions(peer, endpoint);
			if (peer.principal.kind !== "owner") throw new TypertGatewayError("gateway/invocation-unavailable", endpoint, "only owner Peers answer forwarded Remote events");
			const result = parseRemoteEventResultPayload(payload);
			const client = this.remoteEventClients.get(result.clientId);
			if (client === void 0) throw new Error("typert gateway: Remote event result identifies no active event stream");
			if (client.peer !== peer) throw new TypertGatewayError("gateway/interactions-forbidden", endpoint, "Remote event result belongs to another Peer");
			this.receiveRemoteEventResult(client, result);
			return {
				ok: true,
				value: void 0
			};
		} catch (error) {
			return rpcFailure(error);
		}
		return this.invokeRpc(endpoint, payload, signal, peer);
	}
	async openWireStream(endpoint, payload, uplink, peer, signal, control, uplinkWindow) {
		if (endpoint === "$events") {
			releaseUplink(uplink);
			assertPeerLive(peer, endpoint);
			requireInteractions(peer, endpoint);
			return this.openRemoteEvents(payload, signal, peer);
		}
		return this.openStream({
			...remoteRequest(endpoint, payload, signal, peer),
			uplink,
			uplinkWindow
		}, control);
	}
	async *openRemoteEvents(payload, signal, peer) {
		if (!isObject(payload) || !isPlainObject(payload) || Reflect.ownKeys(payload).length !== 1 || !Object.hasOwn(payload, "args") || !isObject(payload.args) || !isPlainObject(payload.args) || Reflect.ownKeys(payload.args).length !== 0) throw new TypertGatewayError("gateway/arguments-invalid", REMOTE_EVENT_STREAM_ENDPOINT, "forwarded Remote event stream requires an empty args object");
		const registration = this.remoteEvents;
		if (registration === void 0) throw new TypertGatewayError("gateway/service-unavailable", REMOTE_EVENT_STREAM_ENDPOINT, "forwarded Remote event source is unavailable");
		const lifetime = AbortSignal.any([
			signal,
			registration.lifetime.signal,
			peer.signal
		]);
		let clientId = randomUUID();
		while (this.remoteEventClients.has(clientId)) clientId = randomUUID();
		const client = {
			peer,
			id: clientId,
			queue: new RemoteEventQueue(),
			signal: lifetime,
			deliveries: /* @__PURE__ */ new Map(),
			principal: peer.principal,
			answers: peer.principal.kind === "owner"
		};
		this.remoteEventClients.set(clientId, client);
		if (client.answers) for (const pending of this.pendingRemoteEvents.values()) this.deliverRemoteEvent(pending, client);
		try {
			yield {
				...REMOTE_EVENT_STREAM_READY,
				clientId,
				host: registration.host
			};
			yield* client.queue.iterate(lifetime);
		} finally {
			this.removeRemoteEventClient(client);
		}
	}
	async consumeRemoteEvents(source, signal) {
		for await (const dispatch of source) {
			if (signal.aborted) {
				if ("context" in dispatch) dispatch.reject(signal.reason);
				return;
			}
			if ("context" in dispatch) this.startRemoteEvent(dispatch);
			else this.broadcastRemoteEvent(dispatch);
		}
		if (!signal.aborted) throw new Error("typert gateway: forwarded Remote event source ended unexpectedly");
	}
	broadcastRemoteEvent(frame) {
		assertRemoteEventFrame(frame);
		const wire = {
			type: "emit",
			event: frame.event,
			args: frame.args
		};
		let resolved = false;
		let resources;
		for (const client of this.remoteEventClients.values()) {
			if (!client.answers) {
				if (!resolved) {
					resources = eventResources(frame.resources, frame.args);
					resolved = true;
				}
				if (resources === void 0) continue;
				if (this.ctx.remoteAccess.decide({
					principal: client.principal,
					action: `event:${frame.event}`,
					resources
				}).kind === "deny") continue;
			}
			client.queue.push(wire);
		}
	}
	startRemoteEvent(source) {
		try {
			assertRemoteEventName(source);
			if (!isRemoteEventAgentId(source.context.agentId)) throw new TypeError("typert gateway: scoped Remote events require a non-empty Agent identity");
			const projected = projectRemoteEventRequest(source.request, source.context.subject);
			let id = randomUUID();
			while (this.pendingRemoteEvents.has(id)) id = randomUUID();
			let releaseContext;
			try {
				const dispose = source.context.value.effect(() => () => {
					this.cancelRemoteEvent(pending, /* @__PURE__ */ new Error("typert gateway: Remote event Agent Context was released"));
				}, `api-gateway: Remote event ${JSON.stringify(source.event)}`);
				releaseContext = () => {
					dispose();
				};
			} catch {
				source.resolve({ kind: "next" });
				return;
			}
			const signals = new Set(projected.signal === void 0 ? [] : [projected.signal]);
			const abort = () => {
				const reason = [...signals].find((signal) => signal.aborted)?.reason;
				this.cancelRemoteEvent(pending, reason instanceof Error ? reason : new Error("typert gateway: Remote event was cancelled", { cause: reason }));
			};
			const pending = {
				id,
				source,
				frame: {
					type: "waterfall",
					event: source.event,
					eventId: id,
					agentId: source.context.agentId,
					request: projected.request
				},
				deliveries: /* @__PURE__ */ new Set(),
				releaseContext,
				releaseSignal: () => {
					for (const signal of signals) signal.removeEventListener("abort", abort);
				}
			};
			this.pendingRemoteEvents.set(id, pending);
			for (const signal of signals) signal.addEventListener("abort", abort, { once: true });
			if ([...signals].some((signal) => signal.aborted)) abort();
			else for (const client of this.remoteEventClients.values()) if (client.answers) this.deliverRemoteEvent(pending, client);
		} catch (error) {
			source.reject(error);
		}
	}
	deliverRemoteEvent(pending, client) {
		pending.deliveries.add(client);
		client.deliveries.set(pending.id, pending);
		client.queue.push(pending.frame);
	}
	receiveRemoteEventResult(client, result) {
		const pending = this.pendingRemoteEvents.get(result.eventId);
		if (pending === void 0 || !pending.deliveries.has(client)) return;
		this.removeRemoteEventDelivery(pending, client);
		if (result.outcome.kind === "result") this.settleRemoteEvent(pending, {
			kind: "result",
			value: result.outcome.value
		});
		else if (result.outcome.kind === "rejected") this.cancelRemoteEvent(pending, restoreRemoteEventRejection(result.outcome.error));
		else if (pending.deliveries.size === 0) this.settleRemoteEvent(pending, { kind: "next" });
	}
	removeRemoteEventDelivery(pending, client) {
		pending.deliveries.delete(client);
		client.deliveries.delete(pending.id);
	}
	removeRemoteEventClient(client) {
		this.remoteEventClients.delete(client.id);
		for (const pending of [...client.deliveries.values()]) this.removeRemoteEventDelivery(pending, client);
		client.queue.end();
	}
	settleRemoteEvent(pending, outcome) {
		this.finishRemoteEvent(pending);
		pending.source.resolve(outcome);
	}
	cancelRemoteEvent(pending, reason) {
		if (this.pendingRemoteEvents.get(pending.id) !== pending) return;
		this.finishRemoteEvent(pending);
		pending.source.reject(reason);
	}
	finishRemoteEvent(pending) {
		this.pendingRemoteEvents.delete(pending.id);
		pending.releaseSignal();
		pending.releaseContext();
		const clients = new Set(pending.deliveries);
		for (const client of clients) this.removeRemoteEventDelivery(pending, client);
		const cancellation = {
			type: "cancel",
			eventId: pending.id
		};
		for (const client of clients) client.queue.push(cancellation);
	}
	closeRemoteEvents(reason) {
		for (const pending of [...this.pendingRemoteEvents.values()]) this.cancelRemoteEvent(pending, reason);
		for (const client of [...this.remoteEventClients.values()]) client.queue.end();
	}
	async invokeRpc(endpoint, payload, signal, peer) {
		try {
			const prepared = await this.prepareInvocation(remoteRequest(endpoint, payload, signal, peer), new AbortController());
			return encodeRpcResult(await this.invokePrepared(prepared), prepared.descriptor.result);
		} catch (error) {
			return rpcFailure(error);
		}
	}
	/** `control` fails the logical stream when an uplink item is rejected; unary calls hand over an inert one. */
	async prepareInvocation(request, control) {
		const endpoint = endpointOf(request.namespace, request.method);
		assertPeerLive(request.peer, endpoint);
		const descriptor = this.resolveDescriptor(request.namespace, request.method, endpoint);
		assertExactArguments(request.args, descriptor, endpoint);
		const validated = validateArguments(descriptor, request.args, endpoint);
		if (request.peer.principal.kind !== "owner") {
			const resources = callResources(this.ctx.typert, this.resourceReaders(descriptor), descriptor, validated, request.signal ?? NEVER_ABORTED_SIGNAL);
			const decision = resources === void 0 ? {
				kind: "deny",
				reason: "resource-invalid"
			} : this.ctx.remoteAccess.decide({
				principal: request.peer.principal,
				action: `${descriptor.namespace}/${descriptor.method}`,
				resources,
				args: validated
			});
			if (decision.kind === "deny") throw new RemoteError("remote-access/denied", `remote access: ${endpoint}: access denied (${decision.reason})`, {
				action: endpoint,
				reason: decision.reason
			});
		}
		const receiverContext = await this.resolveReceiverContext(descriptor, validated, endpoint);
		const receiver = receiverContext.get(descriptor.service);
		if (!isObject(receiver)) throw new TypertGatewayError("gateway/service-unavailable", endpoint, `active Service ${JSON.stringify(descriptor.service)} is unavailable`);
		validateBinding(receiver, descriptor.service, descriptor.namespace, endpoint);
		const args = await Promise.all(descriptor.parameters.map((parameter) => this.resolveParameter(parameter, validated, endpoint)));
		const signal = methodSignal(request, control, descriptor.mode === "stream");
		const invocation = new GatewayInvocation({
			namespace: request.namespace,
			method: request.method,
			args: request.args
		}, descriptor.service, request.peer, signal, {
			source: request.uplink ?? EMPTY_ASYNC_ITERABLE,
			window: request.uplinkWindow,
			codec: descriptor.uplink?.codec ?? SRC_JSON_CODEC,
			endpoint,
			abort: (reason) => {
				control.abort(reason);
			}
		});
		if (descriptor.cancellation !== void 0) args.push(signal);
		const callReceiver = receiverContext.extend({ invocation }).get(descriptor.service);
		const implementation = descriptor.implementation ?? descriptor.method;
		const method = Reflect.get(callReceiver, implementation);
		if (typeof method !== "function") throw new TypertGatewayError("gateway/method-unavailable", endpoint, `active Service ${JSON.stringify(descriptor.service)} has no callable method ${JSON.stringify(implementation)}`);
		return {
			endpoint,
			descriptor,
			receiver: callReceiver,
			args,
			method,
			invocation
		};
	}
	resolveDescriptor(namespace, method, endpoint) {
		const strict = this.ctx.typert.local.get(endpoint);
		if (strict !== void 0) return strict;
		if (this.ctx.typert.local.hasSeen(endpoint)) throw new TypertGatewayError("gateway/definition-unavailable", endpoint, "its strict definition was withdrawn and SRC fallback is forbidden");
		return this.resolveSrcDescriptor(namespace, method, endpoint);
	}
	resolveSrcDescriptor(namespace, method, endpoint) {
		const candidates = [];
		for (const [serviceKey, definition] of Object.entries(this.ctx.reflect.props)) {
			if (definition.type !== "service") continue;
			const receiver = this.ctx.get(serviceKey);
			if (!isObject(receiver)) continue;
			const original = originalOf(receiver);
			const value = Reflect.get(original, "typertRemote");
			if (value === void 0) continue;
			const binding = readBinding(value, original, serviceKey, endpoint);
			if (binding.namespace !== namespace) continue;
			const marker = remoteMethods(original).find((candidate) => (candidate.exportName ?? candidate.method) === method);
			if (marker === void 0) continue;
			candidates.push(this.srcDescriptor(binding, marker, method, endpoint));
		}
		if (candidates.length === 0) throw new TypertGatewayError("gateway/invocation-unavailable", endpoint, "no active Remote method exports this endpoint");
		if (candidates.length > 1) throw new TypertGatewayError("gateway/ambiguous-endpoint", endpoint, `multiple active Services export this endpoint: ${candidates.map((candidate) => candidate.service).sort().join(", ")}`);
		return candidates[0];
	}
	srcDescriptor(binding, marker, method, endpoint) {
		const names = methodParameterNames(binding.service, marker.method, endpoint);
		const signalIndex = names.indexOf("signal");
		if (signalIndex >= 0 && signalIndex !== names.length - 1) throw new TypertGatewayError("gateway/signature-invalid", endpoint, "SRC cancellation parameter signal must be the final parameter", { field: "signal" });
		const cancellation = signalIndex >= 0 ? { parameter: "signal" } : void 0;
		const businessNames = cancellation === void 0 ? names : names.slice(0, -1);
		const parameters = [];
		const wires = /* @__PURE__ */ new Set();
		for (const name of businessNames) {
			const matches = this.ctx.typert.lookups.definitions().filter((definition) => definition.parameter === name);
			if (matches.length > 1) throw new TypertGatewayError("gateway/signature-invalid", endpoint, `parameter ${JSON.stringify(name)} matches multiple lookup providers`, { field: name });
			const match = matches[0];
			const parameter = match === void 0 ? {
				name,
				wire: name,
				source: "json",
				codec: { mode: "src-json" }
			} : {
				name,
				wire: match.wire,
				source: "lookup",
				lookup: match.key,
				codec: { mode: "src-json" }
			};
			if (wires.has(parameter.wire)) throw new TypertGatewayError("gateway/signature-invalid", endpoint, `multiple parameters use wire field ${JSON.stringify(parameter.wire)}`, { field: parameter.wire });
			wires.add(parameter.wire);
			parameters.push(parameter);
		}
		let receiver = { kind: "direct" };
		if (marker.invocation.kind === "context") {
			const provider = this.ctx.typert.contexts.getHost(marker.invocation.context);
			if (provider === void 0) throw new TypertGatewayError("gateway/context-unavailable", endpoint, `Context provider ${JSON.stringify(marker.invocation.context)} is unavailable`);
			if (wires.has(provider.wire)) throw new TypertGatewayError("gateway/signature-invalid", endpoint, `Context identity conflicts with wire field ${JSON.stringify(provider.wire)}`, { field: provider.wire });
			receiver = {
				kind: "context",
				context: marker.invocation.context,
				wire: provider.wire,
				codec: { mode: "src-json" }
			};
		}
		return {
			id: `src:${binding.serviceKey}#${endpoint}`,
			service: binding.serviceKey,
			namespace: binding.namespace,
			method,
			...marker.method === method ? {} : { implementation: marker.method },
			...marker.mode === void 0 ? {} : { mode: marker.mode },
			invocation: receiver,
			parameters,
			...cancellation === void 0 ? {} : { cancellation },
			result: { mode: "src-json" }
		};
	}
	async resolveReceiverContext(descriptor, args, endpoint) {
		if (descriptor.invocation.kind === "direct") return this.ctx;
		const invocation = descriptor.invocation;
		const provider = this.ctx.typert.contexts.getHost(invocation.context);
		if (provider === void 0) throw new TypertGatewayError("gateway/context-unavailable", endpoint, `Context provider ${JSON.stringify(invocation.context)} is unavailable`);
		if (provider.wire !== invocation.wire || invocation.codec.mode === "strict" && provider.wireTypeSymbol !== invocation.codec.typeSymbol) throw new TypertGatewayError("gateway/provider-mismatch", endpoint, `Context provider ${JSON.stringify(invocation.context)} does not match its strict definition`, { field: invocation.wire });
		const identity = decode(invocation.codec, args[invocation.wire], endpoint, invocation.wire);
		let context;
		try {
			context = await provider.resolve(identity);
		} catch (cause) {
			if (remoteErrorOf(cause) !== void 0) throw cause;
			throw new TypertGatewayError("gateway/context-failed", endpoint, `Context provider ${JSON.stringify(invocation.context)} failed`, {
				cause,
				field: invocation.wire
			});
		}
		if (context === void 0) throw new TypertGatewayError("gateway/context-not-found", endpoint, `Context provider ${JSON.stringify(invocation.context)} did not resolve the requested identity`, { field: invocation.wire });
		return context;
	}
	async resolveParameter(parameter, args, endpoint) {
		if (!Object.hasOwn(args, parameter.wire)) return void 0;
		if (parameter.source === "json") return args[parameter.wire];
		const value = decode(parameter.codec, args[parameter.wire], endpoint, parameter.wire);
		const key = parameter.lookup;
		/* v8 ignore next -- registry validation rejects strict descriptors without a key, and SRC derivation always supplies one. */
		if (key === void 0) throw new TypertGatewayError("gateway/lookup-unavailable", endpoint, `lookup parameter ${JSON.stringify(parameter.name)} has no provider key`, { field: parameter.wire });
		const provider = this.ctx.typert.lookups.get(key);
		if (provider === void 0) throw new TypertGatewayError("gateway/lookup-unavailable", endpoint, `lookup provider ${JSON.stringify(key)} is unavailable`, { field: parameter.wire });
		if (provider.wire !== parameter.wire || parameter.codec.mode === "strict" && provider.wireTypeSymbol !== parameter.codec.typeSymbol) throw new TypertGatewayError("gateway/provider-mismatch", endpoint, `lookup provider ${JSON.stringify(key)} does not match its strict definition`, { field: parameter.wire });
		let resolved;
		try {
			resolved = await provider.resolve(value);
		} catch (cause) {
			if (remoteErrorOf(cause) !== void 0) throw cause;
			throw new TypertGatewayError("gateway/lookup-failed", endpoint, `lookup provider ${JSON.stringify(key)} failed`, {
				cause,
				field: parameter.wire
			});
		}
		if (resolved === void 0) throw new TypertGatewayError("gateway/lookup-not-found", endpoint, `lookup provider ${JSON.stringify(key)} did not resolve the requested identity`, { field: parameter.wire });
		return resolved;
	}
};
function encodeRpcResult(value, codec) {
	const attachments = [];
	const writeBytes = (bytes, path) => {
		attachments.push({
			path: [...path],
			bytes
		});
		return null;
	};
	return {
		ok: true,
		value: codec.mode === "strict" ? codec.encode?.(value, writeBytes) ?? value : encodeRuntimeResult(value, writeBytes),
		...attachments.length === 0 ? {} : { attachments }
	};
}
function encodeRuntimeResult(input, writeBytes) {
	const path = [];
	const ancestors = /* @__PURE__ */ new Set();
	const extract = (input, key) => {
		let value = input;
		if (input !== null && typeof input === "object" && !(input instanceof Uint8Array)) {
			const toJSON = Reflect.get(input, "toJSON");
			if (typeof toJSON === "function") value = Reflect.apply(toJSON, input, [key]);
		}
		if (value instanceof Uint8Array) return writeBytes(value, path);
		if (typeof value !== "object" || value === null) return value;
		if (value instanceof Number || value instanceof String || value instanceof Boolean) return value.valueOf();
		if (ancestors.has(value)) throw new TypeError("gateway: circular RPC result");
		ancestors.add(value);
		let copy;
		if (Array.isArray(value)) {
			const items = [];
			for (let index = 0, length = value.length; index < length; index++) items.push(child(value[index], index));
			copy = items;
		} else {
			const fields = {};
			for (const key of Object.keys(value)) {
				const item = Reflect.get(value, key);
				if (key === "toJSON" && typeof item === "function") continue;
				const extracted = child(item, key);
				if (key === "__proto__") Object.defineProperty(fields, key, {
					value: extracted,
					enumerable: true
				});
				else fields[key] = extracted;
			}
			copy = fields;
		}
		ancestors.delete(value);
		return copy;
	};
	const child = (value, key) => {
		if (typeof value !== "object" || value === null) return value;
		path.push(key);
		const extracted = extract(value, String(key));
		path.pop();
		return extracted;
	};
	return extract(input, "value");
}
/** Pull-driven queue owned by one connected Client event generation. */
var RemoteEventQueue = class {
	frames = new Deque();
	waiter;
	closed = false;
	push(frame) {
		if (this.closed) return;
		this.frames.pushBack(frame);
		this.waiter?.();
	}
	end() {
		if (this.closed) return;
		this.closed = true;
		this.waiter?.();
	}
	/**
	* Yield buffered and later frames until the queue ends or `signal` aborts.
	* An abort discards the frames still buffered, so a revoked Peer receives none of them.
	* @param signal - Client generation lifetime.
	* @returns the queued wire frames in push order.
	*/
	async *iterate(signal) {
		const abort = () => {
			this.end();
		};
		signal.addEventListener("abort", abort, { once: true });
		try {
			while (true) {
				while (this.frames.size > 0 && !signal.aborted) yield this.frames.popFront();
				if (this.closed || signal.aborted) return;
				await new Promise((resolve) => {
					this.waiter = resolve;
				});
				this.waiter = void 0;
			}
		} finally {
			signal.removeEventListener("abort", abort);
		}
	}
};
function assertRemoteEventFrame(frame) {
	assertRemoteEventName(frame);
	if (!Array.isArray(frame.args) || !isRemoteJsonValue(frame.args)) throw new TypeError(`typert gateway: Remote event ${JSON.stringify(frame.event)} arguments are not lossless JSON data`);
}
function assertRemoteEventName(frame) {
	if (typeof frame.event !== "string" || frame.event.length === 0) throw new TypeError("typert gateway: Remote event name must be a nonempty string");
}
function requireInteractions(peer, endpoint) {
	if (peer.interactions !== "answer") throw new TypertGatewayError("gateway/interactions-forbidden", endpoint, "forwarded Remote events require interactions=answer");
}
function parseRemoteEventResultPayload(payload) {
	if (!isObject(payload) || !isPlainObject(payload) || Reflect.ownKeys(payload).length !== 1 || !Object.hasOwn(payload, "args")) throw new Error("typert gateway: Remote event result requires exactly one plain-object args field");
	return parseRemoteEventResult(payload.args);
}
function remoteRequest(endpoint, payload, signal, peer) {
	assertPeerLive(peer, endpoint);
	const segments = endpoint.split("/");
	if (segments.length !== 2 || segments[0] === "" || segments[1] === "") throw new Error(`invalid Remote endpoint ${JSON.stringify(endpoint)}`);
	const [namespace, method] = segments;
	if (!isObject(payload) || !isPlainObject(payload) || Reflect.ownKeys(payload).length !== 1 || !Object.hasOwn(payload, "args") || !isObject(payload.args) || !isPlainObject(payload.args)) throw new Error("Remote payload must contain exactly one plain-object args field");
	return {
		namespace,
		method,
		args: payload.args,
		signal,
		peer
	};
}
/**
* The signal a method observes. A carrier that supplies an uplink fails the
* stream through `control` when an item is rejected, so that invocation joins
* `control` with the carrier signal; a stream also ends with its Peer. Every
* other invocation keeps the carrier signal's identity.
*/
function methodSignal(request, control, stream) {
	const carrier = request.signal;
	if (request.uplink === void 0 && !stream) return carrier ?? NEVER_ABORTED_SIGNAL;
	const joined = carrier === void 0 || carrier === control.signal ? [control.signal] : [carrier, control.signal];
	return AbortSignal.any(stream ? [...joined, request.peer.signal] : joined);
}
/**
* Refuse a call whose Peer has been disposed.
* @param peer - Peer the call speaks for.
* @param endpoint - endpoint named in the failure.
* @throws {@link TypertGatewayError} `gateway/peer-disposed` once the Peer is disposed.
*/
function assertPeerLive(peer, endpoint) {
	if (peer.signal.aborted) throw new TypertGatewayError("gateway/peer-disposed", endpoint, "the calling Peer has been disposed");
}
function isIterable(value) {
	return isObject(value) && (typeof Reflect.get(value, Symbol.iterator) === "function" || typeof Reflect.get(value, Symbol.asyncIterator) === "function");
}
async function* cancellableStream(source, endpoint, invocation) {
	const { signal } = invocation;
	const asyncFactory = Reflect.get(source, Symbol.asyncIterator);
	const syncFactory = Reflect.get(source, Symbol.iterator);
	const iterator = typeof asyncFactory === "function" ? Reflect.apply(asyncFactory, source, []) : Reflect.apply(syncFactory, source, []);
	let rejectAbort;
	const onAbort = () => {
		rejectAbort?.(streamAbortFailure(endpoint, signal.reason));
	};
	signal.addEventListener("abort", onAbort, { once: true });
	try {
		while (true) {
			if (signal.aborted) throw streamAbortFailure(endpoint, signal.reason);
			const aborted = new Promise((_resolve, reject) => {
				rejectAbort = reject;
			});
			aborted.catch(() => void 0);
			const next = await Promise.race([Promise.resolve(iterator.next()), aborted]);
			rejectAbort = void 0;
			if (next.done === true) return;
			yield next.value;
		}
	} finally {
		rejectAbort = void 0;
		signal.removeEventListener("abort", onAbort);
		await invocation.close();
		await iterator.return?.();
	}
}
/**
* The failure a stream surfaces for its abort: a Remote failure used as the
* reason is the Gateway or carrier failing the stream itself (a rejected,
* overflowing, or misplaced uplink item); any other abort is a cancellation.
*/
function streamAbortFailure(endpoint, reason) {
	return remoteErrorOf(reason) === void 0 ? remoteCancelled(endpoint, reason) : reason;
}
/** Carrier-signal cancellation as the shared failure vocabulary expresses it. */
function remoteCancelled(endpoint, cause) {
	return new RemoteError("gateway/cancelled", `Remote invocation "${endpoint}" was aborted`, {}, { cause });
}
/**
* The iterable `invocation.uplink()` returns. Each uplink item passes the
* descriptor codec, or the JSON-safety check when the descriptor declares no
* uplink, before delivery; a rejected item fails the whole logical stream.
* Iteration ends when the Client half-closes or the downlink finishes, and
* fails when the stream is cancelled, so a method blocked on the uplink always
* wakes.
*/
var UplinkDecoder = class {
	codec;
	endpoint;
	signal;
	abort;
	source;
	interrupted = /* @__PURE__ */ new Set();
	onAbort = () => {
		const failure = streamAbortFailure(this.endpoint, this.signal.reason);
		for (const read of this.interrupted) read.reject(failure);
	};
	closed = false;
	constructor(uplink, codec, endpoint, signal, abort) {
		this.codec = codec;
		this.endpoint = endpoint;
		this.signal = signal;
		this.abort = abort;
		this.source = uplink[Symbol.asyncIterator]();
		signal.addEventListener("abort", this.onAbort, { once: true });
	}
	[Symbol.asyncIterator]() {
		return this;
	}
	async next() {
		if (this.signal.aborted) throw streamAbortFailure(this.endpoint, this.signal.reason);
		if (this.closed) return UPLINK_DONE;
		const interrupted = Promise.withResolvers();
		this.interrupted.add(interrupted);
		interrupted.promise.catch(() => void 0);
		let next;
		try {
			next = await Promise.race([this.source.next(), interrupted.promise]);
		} finally {
			this.interrupted.delete(interrupted);
		}
		if (next.done === true) {
			this.finish();
			return UPLINK_DONE;
		}
		let value;
		try {
			value = next.value === void 0 && this.codec.mode === "src-json" ? void 0 : decode(this.codec, next.value, this.endpoint, "uplink");
		} catch (failure) {
			this.abort(failure);
			throw failure;
		}
		return {
			value,
			done: false
		};
	}
	/** Downlink finished or the method stopped reading: unread uplink items are dropped. */
	return() {
		if (!this.closed) {
			this.finish();
			Promise.resolve().then(() => this.source.return?.()).catch(() => void 0);
		}
		return Promise.resolve(UPLINK_DONE);
	}
	finish() {
		this.closed = true;
		this.signal.removeEventListener("abort", this.onAbort);
		for (const read of this.interrupted) read.resolve(UPLINK_DONE);
	}
};
/**
* The context of one Remote call as the receiving method reads it through
* `this.ctx.invocation`. The uplink is decoded on first use and released when
* the call's downlink finishes.
*/
var GatewayInvocation = class {
	request;
	service;
	peer;
	signal;
	uplink_;
	decoder;
	taken = false;
	get uplinkWindow() {
		return this.uplink_.window;
	}
	/**
	* @param request - decoded endpoint and wire arguments.
	* @param service - Cordis service key of the receiver.
	* @param peer - Peer the call speaks for.
	* @param signal - the signal the method observes.
	* @param uplink - carrier items and the codec that decodes them.
	*/
	constructor(request, service, peer, signal, uplink_) {
		this.request = request;
		this.service = service;
		this.peer = peer;
		this.signal = signal;
		this.uplink_ = uplink_;
	}
	uplink() {
		if (this.taken) throw new Error(`typert gateway: ${this.uplink_.endpoint}: invocation.uplink() is available once per call`);
		this.taken = true;
		const { source, codec, endpoint, abort } = this.uplink_;
		this.decoder = new UplinkDecoder(source, codec, endpoint, this.signal, abort);
		return this.decoder;
	}
	/**
	* The downlink finished: release the uplink. Unread items are dropped, and a
	* carrier iterable the method never took is returned so it stops producing;
	* a later `uplink()` throws like a second one would.
	* @returns settles once a taken uplink has closed.
	*/
	async close() {
		if (this.decoder !== void 0) {
			await this.decoder.return();
			return;
		}
		this.taken = true;
		releaseUplink(this.uplink_.source);
	}
};
/**
* Return a carrier uplink nobody will read, so it drops later items instead of
* buffering them. The carrier owns the iterator and `return()` is not awaited:
* a generator blocked in `next()` completes it only once it yields.
* @param source - the carrier's uplink iterable.
*/
function releaseUplink(source) {
	Promise.resolve().then(() => source[Symbol.asyncIterator]().return?.()).catch(() => void 0);
}
function rpcFailure(error) {
	const remote = remoteErrorOf(error);
	if (remote !== void 0) return {
		ok: false,
		error: {
			code: remote.code,
			message: remote.message,
			details: remote.details
		}
	};
	return {
		ok: false,
		error: {
			code: "gateway/internal",
			message: error instanceof Error ? error.message : String(error),
			details: {}
		}
	};
}
function rpcError(error) {
	return rpcFailure(error).error;
}
function endpointOf(namespace, method) {
	return `${namespace}/${method}`;
}
function validateBinding(receiver, serviceKey, namespace, endpoint) {
	const original = originalOf(receiver);
	const value = Reflect.get(original, "typertRemote");
	if (value === void 0) throw new TypertGatewayError("gateway/binding-invalid", endpoint, `Service ${JSON.stringify(serviceKey)} has no visible typertRemote binding`);
	return {
		binding: readBinding(value, original, serviceKey, endpoint, namespace),
		original
	};
}
function readBinding(value, original, serviceKey, endpoint, namespace) {
	if (!isObject(value) || Reflect.get(value, "service") !== original || Reflect.get(value, "serviceKey") !== serviceKey || typeof Reflect.get(value, "namespace") !== "string" || namespace !== void 0 && Reflect.get(value, "namespace") !== namespace) throw new TypertGatewayError("gateway/binding-invalid", endpoint, `Service ${JSON.stringify(serviceKey)} has an inconsistent typertRemote binding`);
	return value;
}
function originalOf(receiver) {
	const original = Reflect.get(receiver, symbols.original);
	return isObject(original) ? original : receiver;
}
function methodParameterNames(service, method, endpoint) {
	let prototype = Object.getPrototypeOf(service);
	let implementation;
	while (prototype !== null) {
		const descriptor = Object.getOwnPropertyDescriptor(prototype, method);
		if (descriptor !== void 0) {
			if ("value" in descriptor && typeof descriptor.value === "function") implementation = descriptor.value;
			break;
		}
		prototype = Object.getPrototypeOf(prototype);
	}
	if (implementation === void 0) throw new TypertGatewayError("gateway/method-unavailable", endpoint, `Remote marker has no prototype method ${JSON.stringify(method)}`);
	const source = Function.prototype.toString.call(implementation);
	const open = source.indexOf("(");
	const close = source.indexOf(")", open + 1);
	/* v8 ignore next -- standard public class-method syntax always contains a parenthesized parameter list. */
	if (open < 0 || close < 0) return invalidSignature(endpoint, method);
	const body = source.slice(open + 1, close).trim();
	if (body.length === 0) return [];
	const parts = body.split(",").map((part) => part.trim());
	const names = /* @__PURE__ */ new Set();
	for (const part of parts) {
		if (!/^[$A-Z_a-z][$\w]*$/u.test(part) || names.has(part)) return invalidSignature(endpoint, method);
		names.add(part);
	}
	return [...names];
}
function invalidSignature(endpoint, method) {
	throw new TypertGatewayError("gateway/signature-invalid", endpoint, `SRC method ${JSON.stringify(method)} must use unique identifier parameters without destructuring, defaults, or rest`);
}
function assertExactArguments(args, descriptor, endpoint) {
	if (!isPlainObject(args)) throw new TypertGatewayError("gateway/arguments-invalid", endpoint, "args must be a plain object");
	const expected = new Set(descriptor.parameters.map((parameter) => parameter.wire));
	if (descriptor.invocation.kind === "context") expected.add(descriptor.invocation.wire);
	const extra = Reflect.ownKeys(args).filter((key) => typeof key !== "string" || !expected.has(key));
	const acceptsMissing = new Set(descriptor.parameters.filter((parameter) => parameter.source === "json" && (parameter.acceptsUndefined === true || parameter.codec.mode === "src-json")).map((parameter) => parameter.wire));
	const missing = [...expected].filter((key) => !Object.hasOwn(args, key) && !acceptsMissing.has(key));
	if (extra.length === 0 && missing.length === 0) return;
	const clauses = [];
	if (missing.length > 0) clauses.push(`missing ${missing.map((key) => JSON.stringify(key)).join(", ")}`);
	if (extra.length > 0) clauses.push(`unexpected ${extra.map((key) => JSON.stringify(String(key))).join(", ")}`);
	throw new TypertGatewayError("gateway/arguments-invalid", endpoint, `args fields do not match the descriptor: ${clauses.join("; ")}`);
}
/**
* Decode every present JSON argument once through its parameter codec; a
* Typert codec drops object fields its compiled type does not declare. Lookup
* and Context identities keep their wire values; dispatch decodes and resolves
* them only after the access check. An absent field stays absent; a present
* `undefined` is not JSON-safe and fails decoding.
*/
function validateArguments(descriptor, args, endpoint) {
	const entries = [];
	if (descriptor.invocation.kind === "context") entries.push([descriptor.invocation.wire, args[descriptor.invocation.wire]]);
	for (const parameter of descriptor.parameters) {
		if (!Object.hasOwn(args, parameter.wire)) continue;
		const value = args[parameter.wire];
		entries.push([parameter.wire, parameter.source === "json" ? decode(parameter.codec, value, endpoint, parameter.wire) : value]);
	}
	return Object.fromEntries(entries);
}
function decode(codec, value, endpoint, field) {
	try {
		if (codec.mode === "strict") {
			value = codec.create().parse(value);
			/* v8 ignore next -- generated optional-input codecs are the only strict codecs that return undefined. */
			if (value === void 0) return value;
		}
		assertJsonValue(value, /* @__PURE__ */ new Set());
		return value;
	} catch (cause) {
		throw new TypertGatewayError("gateway/input-invalid", endpoint, `wire field ${JSON.stringify(field)} failed boundary validation`, {
			cause,
			field
		});
	}
}
function assertJsonValue(value, ancestors) {
	if (value === null || typeof value === "string" || typeof value === "boolean") return;
	if (typeof value === "number") {
		if (Number.isFinite(value)) return;
		throw new TypeError("non-finite number is not JSON-safe");
	}
	if (!isObject(value)) throw new TypeError(`${typeof value} is not JSON-safe`);
	if (ancestors.has(value)) throw new TypeError("cyclic value is not JSON-safe");
	ancestors.add(value);
	try {
		if (Array.isArray(value)) {
			if (Object.getOwnPropertySymbols(value).length > 0 || Object.keys(value).length !== value.length) throw new TypeError("sparse or decorated array is not JSON-safe");
			for (let index = 0; index < value.length; index += 1) {
				if (!Object.hasOwn(value, index)) throw new TypeError("sparse array is not JSON-safe");
				assertJsonValue(value[index], ancestors);
			}
			return;
		}
		if (!isPlainObject(value)) throw new TypeError("non-plain object is not JSON-safe");
		if (Object.getOwnPropertySymbols(value).length > 0) throw new TypeError("symbol property is not JSON-safe");
		for (const key of Reflect.ownKeys(value)) {
			const descriptor = Object.getOwnPropertyDescriptor(value, key);
			/* v8 ignore next -- ownKeys() just returned this key; only a hostile same-process Proxy can delete it between operations. */
			if (descriptor === void 0 || !descriptor.enumerable || !("value" in descriptor)) throw new TypeError("non-data property is not JSON-safe");
			assertJsonValue(descriptor.value, ancestors);
		}
	} finally {
		ancestors.delete(value);
	}
}
function isPlainObject(value) {
	if (Array.isArray(value)) return false;
	const prototype = Object.getPrototypeOf(value);
	return prototype === null || prototype === Object.prototype;
}
function isObject(value) {
	return typeof value === "object" && value !== null || typeof value === "function";
}
//#endregion
export { TypertGatewayError, TypertGatewayService, TypertGatewayService as default };
