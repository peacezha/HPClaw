import { createHash } from "node:crypto";
import z from "@deepseek-ai/schemastery";
import { defineTool } from "@deepseek-ai/dsh-tools";
import { createUserMessage } from "@deepseek-ai/dsh-llm";
import "@deepseek-ai/cordis";
import "node:path";
import { escapeText, isModelInvocable, isSkillName, isUserInvocable, renderSkillContent } from "@deepseek-ai/dsh-skill";
//#region ../../util/brand/src/index.ts
/**
* Apply a compile-time number brand without changing the value.
* @param value - number admitted by the domain that owns the target brand.
* @returns the same number with the requested compile-time brand.
*/
function brandNumber(value) {
	return value;
}
//#endregion
//#region ../../util/values/src/partial-json.ts
/**
* Lazily scanned view of one JSON object's top-level fields, built from text
* that may still be streaming or from an already parsed object. Nothing is
* scanned until a reader asks; the view remembers every question it answered
* and reports changed answers when the owner refreshes for publication.
* Used for model tool-call arguments: a row reads the fields it
* cares about at whatever granularity it displays, at every stage of the call.
* @module @deepseek-ai/dsh-util-values/src/partial-json
*/
const SIMPLE_ESCAPES = {
	"\"": "\"",
	"\\": "\\",
	"/": "/",
	b: "\b",
	f: "\f",
	n: "\n",
	r: "\r",
	t: "	"
};
const CONTENT_ESCAPE = /[\\\u0000-\u001f]/u;
function isWhitespace(c) {
	return c === " " || c === "\n" || c === "\r" || c === "	";
}
function isHex(c) {
	return c >= "0" && c <= "9" || c >= "a" && c <= "f" || c >= "A" && c <= "F";
}
(class PartialArguments {
	/** The view of a call with no arguments available. */
	static EMPTY = PartialArguments.fromObject({});
	/**
	* View finished argument text without scanning it until a reader asks.
	* @param text - the complete argument JSON text.
	* @returns a sealed view.
	*/
	static fromText(text) {
		const view = new PartialArguments();
		view.append(text);
		view.sealed = true;
		return view;
	}
	/**
	* View an already parsed argument payload, such as a PTC dispatch object.
	* @param value - the parsed argument value.
	* @returns a sealed view; a non-object payload has no fields.
	*/
	static fromObject(value) {
		const view = new PartialArguments();
		view.object = typeof value === "object" && value !== null && !Array.isArray(value) ? value : {};
		view.sealed = true;
		return view;
	}
	/**
	* The source: text so far or a parsed object, plus whether it can still grow.
	* These are the only enumerable fields, so two views over the same source
	* compare equal structurally however far each has been read.
	*/
	chunks = [];
	object;
	sealed = false;
	#ends = [];
	#size = 0;
	#consumed = 0;
	#mode = "root";
	#escape = false;
	#keyStart = 0;
	#keyEscaped = false;
	#key = "";
	#current = null;
	#nestedEnds = [];
	#nestedInString = false;
	#invalidAt;
	#invalidValue = false;
	#entries = /* @__PURE__ */ new Map();
	#order = [];
	#reads = /* @__PURE__ */ new Map();
	/** Whether this view rejects further appends; does not scan text or register reads. */
	get isSealed() {
		return this.sealed;
	}
	/** Whether indexing or a content read found invalid JSON; unread value contents are not validated. */
	get invalid() {
		this.scan();
		return this.#mode === "invalid" || this.#invalidValue;
	}
	/**
	* Retain streamed argument text without scanning or comparing observed answers.
	* @param fragment - the text following every fragment appended before.
	*/
	append(fragment) {
		if (this.sealed) throw new Error("PartialArguments: cannot append to a sealed view");
		if (fragment.length === 0) return;
		this.chunks.push(fragment);
		this.#size += fragment.length;
		this.#ends.push(this.#size);
	}
	/**
	* Reconcile a streamed prefix with authoritative complete text without joining the fragments.
	* @param text - the final argument text, which replaces missing or conflicting deltas.
	* @returns this view sealed with its caches retained when every character matches; otherwise a new sealed view.
	*/
	settle(text) {
		if (this.object !== void 0 || text.length !== this.#size) return PartialArguments.fromText(text);
		let offset = 0;
		for (const chunk of this.chunks) {
			if (!text.startsWith(chunk, offset)) return PartialArguments.fromText(text);
			offset += chunk.length;
		}
		this.chunks = text.length === 0 ? [] : [text];
		this.#ends = text.length === 0 ? [] : [text.length];
		this.sealed = true;
		return this;
	}
	/**
	* Compare observed answers and advance their publication baseline. Unread views remain unscanned.
	* @returns whether any observed answer changed since its first read or the preceding refresh.
	*/
	refresh() {
		if (this.#reads.size === 0) return false;
		this.scan();
		let changed = false;
		let completions = false;
		for (const read of this.#reads.values()) {
			if (read.completion) {
				completions = true;
				continue;
			}
			changed = this.refreshRead(read) || changed;
		}
		if (completions) {
			for (const read of this.#reads.values()) if (read.completion) changed = this.refreshRead(read) || changed;
		}
		if (this.sealed) this.#reads.clear();
		return changed;
	}
	refreshRead(read) {
		const now = read.answer();
		if (Object.is(now, read.last)) return false;
		read.last = now;
		return true;
	}
	/**
	* Check whether no further fields can arrive.
	* @returns whether the outer object closed, indexing failed, or the view is sealed; unread values are not validated.
	*/
	closed() {
		return this.remember("closed", "", () => this.closedNow());
	}
	/**
	* List discovered fields in first-appearance order.
	* @returns top-level keys seen so far, in first-appearance order.
	*/
	keys() {
		return this.remember("keys", "", () => this.keysNow(), (keys) => keys.length);
	}
	/**
	* Check whether a top-level field has appeared.
	* @param key - argument name.
	* @returns whether the field has appeared (a string opened or another value began).
	*/
	has(key) {
		return this.remember("has", key, () => this.hasNow(key));
	}
	/**
	* Check whether a field's closing delimiter has arrived, without validating its contents.
	* @param key - argument name.
	* @returns whether its delimiter arrived and no content reader has reported an error for this value.
	*/
	complete(key) {
		return this.remember("complete", key, () => this.completeNow(key));
	}
	/**
	* Read string length without materializing its text.
	* @param key - argument name.
	* @param options - change granularity for a streaming string.
	* @returns decoded UTF-16 length of the string field so far; undefined when absent or not a string.
	*/
	stringLength(key, options) {
		const step = Math.max(1, Math.floor(options?.step ?? 1));
		const offset = options?.offset ?? 0;
		return this.remember(`length:${step}:${offset}`, key, () => this.lengthNow(key), (length) => length === void 0 ? void 0 : Math.ceil((length + offset) / step));
	}
	/**
	* Check a string against a decoded UTF-16 length limit without materializing it.
	* @param key - argument name.
	* @param maxLength - decoded UTF-16 limit, floored to at least zero.
	* @returns whether the string is longer than the limit; false when absent or not a string.
	*/
	stringExceeds(key, maxLength) {
		const limit = Math.max(0, Math.floor(maxLength));
		return this.remember(`exceeds:${limit}`, key, () => (this.lengthNow(key, limit + 1) ?? 0) > limit);
	}
	/**
	* Read a decoded string, including a streaming prefix.
	* @param key - argument name.
	* @returns the string field's decoded text so far; undefined when absent or not a string.
	*/
	text(key) {
		return this.remember("text", key, () => this.textNow(key));
	}
	/**
	* Read at most the first decoded UTF-16 units of a string.
	* @param key - argument name.
	* @param maxLength - maximum decoded UTF-16 length, floored to at least one.
	* @returns the bounded string prefix; undefined when absent or not a string.
	*/
	textPrefix(key, maxLength) {
		const limit = Math.max(1, Math.floor(maxLength));
		return this.remember(`prefix:${limit}`, key, () => this.textPrefixNow(key, limit));
	}
	/**
	* Read a completed non-string argument.
	* @param key - argument name.
	* @returns the parsed non-string value once it closed; undefined while open, absent, or a string.
	*/
	value(key) {
		return this.remember("value", key, () => this.valueNow(key));
	}
	/** Answer a question and, on a streaming view, remember it for change detection. */
	remember(kind, key, read, comparison) {
		this.scan();
		const result = read();
		if (!this.sealed) {
			const id = `${kind}/${key}`;
			if (!this.#reads.has(id)) this.#reads.set(id, {
				completion: kind === "complete",
				answer: comparison === void 0 ? read : () => comparison(read()),
				last: comparison === void 0 ? result : comparison(result)
			});
		}
		return result;
	}
	closedNow() {
		return this.sealed || this.#mode === "closed" || this.#mode === "invalid";
	}
	keysNow() {
		return this.object === void 0 ? this.#order : Object.keys(this.object);
	}
	hasNow(key) {
		return this.object === void 0 ? this.#entries.has(key) : Object.hasOwn(this.object, key);
	}
	completeNow(key) {
		if (this.object !== void 0) return Object.hasOwn(this.object, key);
		const entry = this.#entries.get(key);
		return entry !== void 0 && entry.end >= 0 && (entry.kind === "string" ? entry.invalidAt === void 0 : !entry.invalid);
	}
	lengthNow(key, limit = Number.POSITIVE_INFINITY) {
		if (this.object !== void 0) {
			const field = Object.hasOwn(this.object, key) ? this.object[key] : void 0;
			return typeof field === "string" ? field.length : void 0;
		}
		const entry = this.#entries.get(key);
		if (entry?.kind !== "string") return void 0;
		if (entry.text !== void 0 && entry.text.at === entry.end) return entry.text.length;
		const read = entry.length ??= {
			at: entry.start,
			length: 0,
			text: ""
		};
		this.readString(entry, read, limit, false);
		return read.length;
	}
	textNow(key) {
		if (this.object !== void 0) {
			const field = Object.hasOwn(this.object, key) ? this.object[key] : void 0;
			return typeof field === "string" ? field : void 0;
		}
		const entry = this.#entries.get(key);
		if (entry?.kind !== "string") return void 0;
		if (entry.text === void 0 && entry.end >= 0 && entry.needsDecoding && entry.invalidAt === void 0) {
			let text;
			try {
				text = JSON.parse(`"${this.slice(entry.start, entry.end)}"`);
			} catch (_error) {}
			if (text !== void 0) entry.text = {
				at: entry.end,
				length: text.length,
				text
			};
		}
		const read = entry.text ??= {
			at: entry.start,
			length: 0,
			text: ""
		};
		this.readString(entry, read, Number.POSITIVE_INFINITY, true);
		return read.text;
	}
	textPrefixNow(key, maxLength) {
		if (this.object !== void 0) {
			const field = Object.hasOwn(this.object, key) ? this.object[key] : void 0;
			return typeof field === "string" ? field.slice(0, maxLength) : void 0;
		}
		const entry = this.#entries.get(key);
		if (entry?.kind !== "string") return void 0;
		const prefixes = entry.prefixes ??= /* @__PURE__ */ new Map();
		let read = prefixes.get(maxLength);
		if (read === void 0) {
			read = {
				at: entry.start,
				length: 0,
				text: ""
			};
			prefixes.set(maxLength, read);
		}
		this.readString(entry, read, maxLength, true);
		return read.text;
	}
	valueNow(key) {
		if (this.object !== void 0) {
			if (!Object.hasOwn(this.object, key)) return void 0;
			const field = this.object[key];
			return typeof field === "string" ? void 0 : field;
		}
		const entry = this.#entries.get(key);
		if (entry?.kind !== "value" || entry.end < 0 || entry.invalid) return void 0;
		if (entry.parsed === void 0) try {
			entry.parsed = JSON.parse(this.slice(entry.start, entry.end));
		} catch (_error) {
			entry.invalid = true;
			this.#invalidValue = true;
		}
		return entry.parsed;
	}
	chunkAt(at) {
		let low = 0;
		let high = this.#ends.length;
		while (low < high) {
			const mid = low + high >>> 1;
			if (this.#ends[mid] <= at) low = mid + 1;
			else high = mid;
		}
		return low;
	}
	/** Materialize only a requested range, never the cumulative source. */
	slice(start, end) {
		if (start >= end) return "";
		const first = this.chunkAt(start);
		const last = this.chunkAt(end - 1);
		const base = first === 0 ? 0 : this.#ends[first - 1];
		if (first === last) return this.chunks[first].slice(start - base, end - base);
		const parts = [this.chunks[first].slice(start - base)];
		for (let i = first + 1; i < last; i++) parts.push(this.chunks[i]);
		parts.push(this.chunks[last].slice(0, end - this.#ends[last - 1]));
		return parts.join("");
	}
	readString(entry, read, limit, materialize) {
		const end = Math.min(entry.end < 0 ? this.#consumed : entry.end, entry.invalidAt ?? Number.POSITIVE_INFINITY, this.#invalidAt ?? Number.POSITIVE_INFINITY);
		if (!entry.needsDecoding) {
			const length = Math.min(end - read.at, limit - read.length);
			if (length <= 0) return;
			if (materialize) read.text += this.slice(read.at, read.at + length);
			read.at += length;
			read.length += length;
			return;
		}
		let chunkIndex = this.chunkAt(read.at);
		while (read.at < end && read.length < limit) {
			const base = chunkIndex === 0 ? 0 : this.#ends[chunkIndex - 1];
			const chunk = this.chunks[chunkIndex];
			const remaining = chunk.slice(read.at - base, Math.min(chunk.length, end - base));
			const boundary = remaining.search(CONTENT_ESCAPE);
			const length = Math.min(boundary < 0 ? remaining.length : boundary, limit - read.length);
			if (length > 0) {
				if (materialize) read.text += remaining.slice(0, length);
				read.at += length;
				read.length += length;
				if (read.at === base + chunk.length) chunkIndex++;
				continue;
			}
			const type = remaining.length > 1 ? remaining[1] : read.at + 1 < end ? this.chunks[chunkIndex + 1][0] : void 0;
			let decoded;
			let width = 2;
			if (remaining[0] === "\\" && type === void 0 && entry.end < 0) return;
			if (remaining[0] === "\\" && type === "u") {
				const hex = this.slice(read.at + 2, Math.min(end, read.at + 6));
				let valid = true;
				for (let i = 0; i < hex.length; i++) if (!isHex(hex[i])) valid = false;
				if (valid) {
					if (hex.length < 4 && entry.end < 0) return;
					if (hex.length === 4) decoded = String.fromCharCode(Number.parseInt(hex, 16));
				}
				width = 6;
			} else if (remaining[0] === "\\" && type !== void 0) decoded = SIMPLE_ESCAPES[type];
			if (decoded === void 0) {
				entry.invalidAt = read.at;
				this.#invalidValue = true;
				return;
			}
			if (materialize) read.text += decoded;
			read.length++;
			read.at += width;
			while (chunkIndex < this.chunks.length && read.at >= this.#ends[chunkIndex]) chunkIndex++;
		}
	}
	/** Locate new field ranges without decoding or parsing their contents. */
	scan() {
		if (this.object !== void 0 || this.#consumed === this.#size) return;
		for (let i = this.chunkAt(this.#consumed); i < this.chunks.length && this.#invalidAt === void 0; i++) {
			const pending = this.chunks[i];
			const base = i === 0 ? 0 : this.#ends[i - 1];
			for (let index = this.#consumed - base; index < pending.length && this.#mode !== "invalid"; index++) {
				if (this.#mode === "string" || this.#mode === "nested" && this.#nestedInString) {
					const end = this.stringBoundary(pending, index);
					this.#consumed += end - index;
					index = end;
					if (index === pending.length) break;
				}
				this.step(pending[index], this.#consumed);
				this.#consumed++;
			}
		}
	}
	/** Only raw quotes and their preceding backslash runs can terminate a string. */
	stringBoundary(fragment, start) {
		let at = start;
		while (true) {
			const quote = fragment.indexOf("\"", at);
			const end = quote < 0 ? fragment.length : quote;
			if (this.#mode === "string") {
				const entry = this.#current;
				if (!entry.needsDecoding && CONTENT_ESCAPE.test(fragment.slice(at, end))) entry.needsDecoding = true;
			}
			let slashStart = end;
			while (slashStart > at && fragment[slashStart - 1] === "\\") slashStart--;
			const escaped = (end - slashStart) % 2 === 1 !== (slashStart === at && this.#escape);
			this.#escape = quote < 0 && escaped;
			if (quote < 0 || !escaped) return end;
			at = quote + 1;
		}
	}
	step(c, at) {
		switch (this.#mode) {
			case "root":
				if (isWhitespace(c)) return;
				if (c === "{") {
					this.#mode = "key-or-end";
					return;
				}
				this.fail();
				return;
			case "key-or-end":
				if (isWhitespace(c)) return;
				if (c === "}") {
					this.#mode = "closed";
					return;
				}
				if (c === "\"") {
					this.beginKey(at);
					return;
				}
				this.fail();
				return;
			case "key-only":
				if (isWhitespace(c)) return;
				if (c === "\"") {
					this.beginKey(at);
					return;
				}
				this.fail();
				return;
			case "key":
				this.stepKey(c, at);
				return;
			case "colon":
				if (isWhitespace(c)) return;
				if (c === ":") {
					this.#mode = "value";
					return;
				}
				this.fail();
				return;
			case "value":
				this.beginValue(c, at);
				return;
			case "string": {
				const entry = this.#current;
				entry.end = at;
				this.#current = null;
				this.#mode = "comma-or-end";
				return;
			}
			case "scalar":
				this.stepScalar(c, at);
				return;
			case "nested":
				this.stepNested(c, at);
				return;
			case "comma-or-end":
				if (isWhitespace(c)) return;
				if (c === ",") {
					this.#mode = "key-only";
					return;
				}
				if (c === "}") {
					this.#mode = "closed";
					return;
				}
				this.fail();
				return;
			case "closed":
				if (isWhitespace(c)) return;
				this.fail();
				return;
			/* v8 ignore next 2 -- scan() stops stepping once the view is invalid. */
			case "invalid": return;
			/* v8 ignore next 2 -- Every scanner mode has a handler above. */
			default: assertNever(this.#mode);
		}
	}
	fail() {
		this.#invalidAt = this.#consumed;
		this.#mode = "invalid";
		this.#current = null;
	}
	beginKey(at) {
		this.#mode = "key";
		this.#keyStart = at + 1;
		this.#keyEscaped = false;
		this.#escape = false;
	}
	stepKey(c, at) {
		if (c < " ") {
			this.fail();
			return;
		}
		if (this.#escape) {
			this.#escape = false;
			return;
		}
		if (c === "\\") {
			this.#escape = true;
			this.#keyEscaped = true;
			return;
		}
		if (c !== "\"") return;
		const raw = this.slice(this.#keyStart, at);
		if (this.#keyEscaped) try {
			this.#key = JSON.parse(`"${raw}"`);
		} catch (_error) {
			this.fail();
			return;
		}
		else this.#key = raw;
		this.#mode = "colon";
	}
	open(entry) {
		if (!this.#entries.has(this.#key)) this.#order.push(this.#key);
		this.#entries.set(this.#key, entry);
		this.#current = entry;
	}
	beginValue(c, at) {
		if (isWhitespace(c)) return;
		if (c === "\"") {
			this.open({
				kind: "string",
				start: at + 1,
				end: -1,
				needsDecoding: false,
				invalidAt: void 0,
				length: void 0,
				text: void 0,
				prefixes: void 0
			});
			this.#escape = false;
			this.#mode = "string";
			return;
		}
		if (c === "}" || c === "," || c === ":" || c === "]") {
			this.fail();
			return;
		}
		this.open({
			kind: "value",
			start: at,
			end: -1,
			parsed: void 0,
			invalid: false
		});
		if (c === "{" || c === "[") {
			this.#mode = "nested";
			this.#nestedEnds = [c === "{" ? "}" : "]"];
			this.#nestedInString = false;
			this.#escape = false;
			return;
		}
		this.#mode = "scalar";
	}
	stepScalar(c, at) {
		if (c !== "," && c !== "}" && !isWhitespace(c)) return;
		this.closeValue(at);
		this.#mode = c === "," ? "key-only" : c === "}" ? "closed" : "comma-or-end";
	}
	stepNested(c, at) {
		if (this.#nestedInString) {
			this.#nestedInString = false;
			return;
		}
		if (c === "\"") {
			this.#nestedInString = true;
			return;
		}
		if (c === "{" || c === "[") {
			this.#nestedEnds.push(c === "{" ? "}" : "]");
			return;
		}
		if (c === "}" || c === "]") {
			if (this.#nestedEnds.pop() !== c) {
				this.fail();
				return;
			}
			if (this.#nestedEnds.length === 0) {
				this.closeValue(at + 1);
				this.#mode = "comma-or-end";
			}
		}
	}
	closeValue(end) {
		const entry = this.#current;
		entry.end = end;
		this.#current = null;
	}
});
//#endregion
//#region ../../util/values/src/index.ts
/**
* Mark an unreachable closed-union branch.
* @param value - impossible value; an unhandled typed variant fails at the call site.
* @param context - optional switch-site label included in the failure message.
* @returns never; a runtime value that escaped its type always throws.
*/
function assertNever(value, context) {
	const rendered = JSON.stringify(value) ?? String(value);
	throw new Error(`unreachable variant${context ? ` in ${context}` : ""}: ${rendered}`);
}
//#endregion
//#region ../../core/session/src/types.ts
/**
* Admit a numeric value as an existing Session event position.
* @param value - non-negative safe integer admitted by the owning log operation.
* @returns the same number with the Session-sequence brand.
*/
function SessionSeq(value) {
	if (!Number.isSafeInteger(value) || value < 0 || Object.is(value, -0)) throw new TypeError(`SessionSeq must be a non-negative safe integer, got ${String(value)}`);
	return brandNumber(value);
}
new Set([
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
	"developer/message",
	"feedback/message-delete",
	"feedback/message-put",
	"feedback/record",
	"goal/change",
	"hook/invoked",
	"hook/result",
	"image/offload",
	"job/registered",
	"job/settled",
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
	"working-directory/change",
	"workspace/changes"
]);
new Set(["image/offload"]);
new Set([
	"system/message",
	"developer/message",
	"user/message",
	"assistant/message",
	"tool/result"
]);
/**
* Deep structural equality over the session-event JSON value domain
* (null/boolean/number/string, arrays, plain objects). Replaces
* `node:util`'s isDeepStrictEqual to keep this module browser-safe.
*/
function isDeepEqualJson(a, b) {
	if (a === b) return true;
	if (Array.isArray(a) || Array.isArray(b)) {
		if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
		return a.every((item, i) => isDeepEqualJson(item, b[i]));
	}
	if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
	const aKeys = Object.keys(a);
	const bRecord = b;
	if (aKeys.length !== Object.keys(b).length) return false;
	return aKeys.every((key) => Object.hasOwn(b, key) && isDeepEqualJson(a[key], bRecord[key]));
}
new Set(["reasoningEffort", "maxTokens"]);
//#endregion
//#region lib/types/index.js
/**
* Durable session skill catalog and model-facing `skill` loader tool.
*
* @module @deepseek-ai/dsh-tool-skill
*/
const name = "tool-skill";
const inject = [
	"agents",
	"tools",
	"skills",
	"workingDirectory"
];
const DEFAULT_CATALOG_DESCRIPTION_MAX_LENGTH = 500;
/** Durable entry list mirroring the rendered catalog lines, for non-model consumers. */
function catalogSourceEntries(skills, descriptionMaxLength) {
	return skills.map((skill) => ({
		name: skill.name,
		description: catalogDescription(skill.description, descriptionMaxLength)
	}));
}
/** Validate and default the model-facing skill catalog configuration. */
const Config = z.object({ catalogDescriptionMaxLength: z.number().default(DEFAULT_CATALOG_DESCRIPTION_MAX_LENGTH) });
/**
* Register the model-facing skill loader and its visibility-matched
* durable session catalog. The catalog is emitted only when the calling agent
* resolves this plugin's exact tool registration; a restriction or scoped
* same-name shadow therefore removes both the schema and its call guidance.
*/
function apply(ctx, config = {}) {
	const catalogDescriptionMaxLength = config.catalogDescriptionMaxLength ?? DEFAULT_CATALOG_DESCRIPTION_MAX_LENGTH;
	assertPositiveInteger("catalogDescriptionMaxLength", catalogDescriptionMaxLength, 3);
	const skillTool = defineTool({
		name: "skill",
		description: "Load the full instructions for a skill. Call it before acting on a task that names or clearly matches a skill in the session skill catalog.",
		parameters: { name: {
			type: "string",
			required: true,
			description: "The exact skill name from the available skills list."
		} },
		output: {
			schema: {
				type: "object",
				additionalProperties: false,
				properties: {
					name: {
						type: "string",
						required: true
					},
					provider: {
						type: "string",
						required: true
					},
					resourceBase: { oneOf: [
						{
							type: "object",
							additionalProperties: false,
							properties: {
								kind: {
									type: "string",
									required: true,
									const: "directory"
								},
								path: {
									type: "string",
									required: true
								}
							}
						},
						{
							type: "object",
							additionalProperties: false,
							properties: {
								kind: {
									type: "string",
									required: true,
									const: "url"
								},
								url: {
									type: "string",
									required: true
								}
							}
						},
						{
							type: "object",
							additionalProperties: false,
							properties: {
								kind: {
									type: "string",
									required: true,
									const: "opaque"
								},
								description: {
									type: "string",
									required: true
								}
							}
						}
					] },
					content: {
						type: "string",
						required: true
					}
				}
			},
			render: (_args, value) => [{
				type: "text",
				text: renderSkillContent(value)
			}]
		},
		async execute(args, exec) {
			if (!isSkillName(args.name)) throw new Error(`invalid skill name "${args.name}"`);
			const lookup = {
				cwd: exec.agent === void 0 ? void 0 : await ctx.workingDirectory.ensure(exec.agent, exec.signal),
				signal: exec.signal,
				scope: exec.agent
			};
			const summary = (await ctx.skills.list(lookup)).find((skill) => skill.name === args.name);
			if (!summary) throw new Error(`skill "${args.name}" is unknown or no longer available`);
			if (!isModelInvocable(summary)) throw new Error(`skill "${args.name}" is not available for model invocation`);
			const skill = await ctx.skills.get(args.name, lookup);
			if (!skill) throw new Error(`skill "${args.name}" is unknown or no longer available`);
			if (!isModelInvocable(skill)) throw new Error(`skill "${args.name}" is not available for model invocation`);
			return {
				name: skill.name,
				provider: skill.provider,
				...skill.resourceBase !== void 0 ? { resourceBase: { ...skill.resourceBase } } : {},
				content: skill.content
			};
		},
		presentCall(args) {
			return {
				card: "generic",
				title: `Load skill ${args.name}`,
				kind: "read",
				rawInput: args.name
			};
		}
	});
	ctx.tools.register(skillTool);
	ctx.on("agent/pre-step", async ({ agent, messages, signal }, next) => {
		const decision = await next();
		if (decision.kind === "reject") return decision;
		const names = invokedSkillNames(messages);
		if (names.length === 0) return decision;
		signal.throwIfAborted();
		const lookup = {
			cwd: await ctx.workingDirectory.ensure(agent, signal),
			signal,
			scope: agent
		};
		const injections = [];
		for (const name of names) {
			const skill = await ctx.skills.get(name, lookup);
			signal.throwIfAborted();
			if (skill === void 0 || !isUserInvocable(skill)) continue;
			const source = {
				kind: "skill-invocation",
				name,
				form: "instructions"
			};
			injections.push(createUserMessage({
				content: [{
					type: "text",
					text: renderSkillContent(skill)
				}],
				source
			}));
		}
		if (injections.length === 0) return decision;
		return {
			...decision,
			messages: [...decision.messages, ...injections]
		};
	});
	ctx.on("agent/pre-step", async ({ agent, signal }, next) => {
		const decision = await next();
		if (decision.kind === "reject") return decision;
		signal.throwIfAborted();
		const snapshot = ctx.tools.get(skillTool.name, agent) === skillTool ? await ctx.skills.snapshot({
			cwd: await ctx.workingDirectory.ensure(agent, signal),
			signal,
			scope: agent
		}) : {
			skills: [],
			complete: true
		};
		signal.throwIfAborted();
		if (!snapshot.complete) return decision;
		const skills = snapshot.skills.filter(isModelInvocable);
		const entries = catalogSourceEntries(skills, catalogDescriptionMaxLength);
		const digest = digestCatalogEntries(entries);
		const history = catalogHistory(agent);
		const existing = catalogMessage(decision.messages);
		if (history.visibleDigest === digest) return existing === void 0 ? decision : {
			...decision,
			messages: decision.messages.filter((message) => message.id !== existing.message.id)
		};
		if (existing !== void 0 && digestCatalogEntries(existing.entries) === digest) return decision;
		if (!history.published && skills.length === 0) return existing === void 0 ? decision : {
			...decision,
			messages: decision.messages.filter((message) => message.id !== existing.message.id)
		};
		const catalog = history.published ? renderCatalogUpdate(entries) : renderCatalogMessage(entries);
		return {
			...decision,
			messages: existing === void 0 ? [...decision.messages, catalog] : decision.messages.map((message) => message.id === existing.message.id ? catalog : message)
		};
	});
}
function renderCatalogMessage(entries) {
	return createUserMessage({
		content: [{
			type: "text",
			text: [
				"<system-reminder>",
				"A skill is a reusable set of task-specific instructions. The following skills are available in this session:",
				"",
				"<available_skills>",
				...renderCatalogEntries(entries),
				"</available_skills>",
				"",
				"If the user names a skill, or the task clearly matches a skill's description, call the `skill` tool with the exact skill name before taking task actions. Load all applicable skills, then follow their full instructions. This catalog contains summaries only; do not infer or follow a skill's instructions until it has been loaded.",
				"A user may also invoke a skill directly; its <skill_content> block then appears in this conversation. Follow it, and do not call the `skill` tool again for that skill.",
				"</system-reminder>"
			].join("\n")
		}],
		source: {
			kind: "skill-catalog",
			form: "catalog",
			entries
		}
	});
}
function renderCatalogUpdate(entries) {
	const availability = entries.length === 0 ? ["No skills are currently available through the `skill` tool. Do not use names from earlier skill catalogs.", "A user may still invoke a skill directly; its <skill_content> block then appears in this conversation. Follow it, and do not call the `skill` tool for it."] : ["Use only names in this replacement catalog. If the user names a listed skill, or the task clearly matches its description, call the `skill` tool with the exact name before acting.", "A user may also invoke a skill directly; its <skill_content> block then appears in this conversation. Follow it, and do not call the `skill` tool again for that skill."];
	return createUserMessage({
		content: [{
			type: "text",
			text: [
				"<system-reminder>",
				"The available skill catalog changed. This complete catalog replaces every earlier available-skills list in this session:",
				"",
				"<available_skills>",
				...renderCatalogEntries(entries),
				"</available_skills>",
				"",
				...availability,
				"</system-reminder>"
			].join("\n")
		}],
		source: {
			kind: "skill-catalog",
			form: "catalog",
			update: true,
			entries
		}
	});
}
/**
* Model-facing catalog lines, projected from the same entries the source records.
* The pseudo-XML escaping belongs to this frame, not to the published fact, so it
* is applied here and never stored. Names are `isSkillName`-validated and carry
* no escapable character.
*/
function renderCatalogEntries(entries) {
	return entries.map((entry) => `- \`${entry.name}\`: ${escapeText(entry.description)}`);
}
/**
* Catalog identity over the durable entry list rather than the rendered prose.
* The entries are what changes; the surrounding `<system-reminder>` framing is
* written for the model and must not decide whether a republish is needed.
*/
function digestCatalogEntries(entries) {
	const canonical = entries.map((entry) => JSON.stringify([entry.name, entry.description])).join("\n");
	return createHash("sha256").update(canonical).digest("hex");
}
/**
* Entries of one durable catalog message, or undefined when the record is not a
* usable catalog.
*
* `agent.session.snapshotEvents()` may contain a resumed, forked, or externally written seed,
* and seed validation only guarantees a source object with a non-empty `kind`;
* no per-kind field is checked there. An unreadable record is therefore treated
* as "not this plugin's catalog" — the posture the replaced content digest had —
* rather than throwing inside the step listener, which would fail every
* subsequent turn of that session.
*/
function readCatalogEntries(source) {
	const entries = source.entries;
	if (!Array.isArray(entries)) return void 0;
	const readable = [];
	for (const entry of entries) {
		if (typeof entry !== "object" || entry === null) return void 0;
		const { name, description } = entry;
		if (typeof name !== "string" || name === "" || typeof description !== "string") return void 0;
		readable.push({
			name,
			description
		});
	}
	return readable;
}
function catalogHistory(agent) {
	const visible = new Set(agent.session.surface.nodes);
	let published = false;
	for (let index = agent.session.seq - 1; index >= 0; index -= 1) {
		const event = agent.session.eventAt(SessionSeq(index));
		if (event === void 0) throw new Error(`skill catalog cannot read seq ${String(index)} below the current Session length`);
		if (event.type !== "user/message" || event.data.source.kind !== "skill-catalog") continue;
		const entries = readCatalogEntries(event.data.source);
		if (entries === void 0) continue;
		const digest = digestCatalogEntries(entries);
		published = true;
		if (visible.has(event.seq)) return {
			visibleDigest: digest,
			published
		};
	}
	return { published };
}
function catalogMessage(messages) {
	for (const message of messages) {
		if (message.source.kind !== "skill-catalog") continue;
		const entries = readCatalogEntries(message.source);
		if (entries !== void 0) return {
			message,
			entries
		};
	}
}
function catalogDescription(value, maxLength) {
	const normalized = value.replaceAll(/\s+/g, " ").trim();
	return normalized.length <= maxLength ? normalized : `${normalized.slice(0, maxLength - 3)}...`;
}
function assertPositiveInteger(name, value, minimum = 1) {
	if (!Number.isInteger(value) || value < minimum) throw new Error(`tool-skill: ${name} must be an integer greater than or equal to ${minimum}`);
}
/**
* A whitespace-bounded `/name` token (the public skill-name grammar) anywhere
* in the text — the same word-boundary shape the transcript chip decoration
* uses, so a gesture reads as one wherever it sits in the sentence. A second
* `/` or any non-boundary character breaks the match, which keeps file paths
* (`/usr/bin`) and fractions (`5/8`) out.
*/
const SKILL_GESTURE = /(^|\s)\/([a-z0-9]+(?:-[a-z0-9]+)*)(?=\s|$)/g;
/**
* `/name` gesture tokens from the claimed user messages, deduplicated in
* first-seen order. Every text block of direct user input is scanned; no
* other source can forge a gesture.
* @param messages - the step's claimed batch.
* @returns candidate skill names, unvalidated against the registry.
*/
function invokedSkillNames(messages) {
	const names = [];
	for (const message of messages) {
		if (message.source.kind !== "user") continue;
		for (const block of message.content) {
			if (block.type !== "text") continue;
			for (const match of block.text.matchAll(SKILL_GESTURE)) {
				const name = match[2];
				if (name !== void 0 && !names.includes(name)) names.push(name);
			}
		}
	}
	return names;
}
//#endregion
export { Config, apply, inject, name };
