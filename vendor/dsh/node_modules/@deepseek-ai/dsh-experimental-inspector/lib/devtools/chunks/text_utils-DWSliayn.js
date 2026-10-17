import { Bt as e, Q as t, Wt as n, en as r, qt as i } from "./common-DMSVbaSb.js";
import "./platform-D4TUCh2P.js";
import { a, l as o, m as s } from "./StringUtilities-CMDxNrEc.js";
import { Ln as c, Lt as l } from "./codemirror-CENmPHF2.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/core/platform/MimeType.ts
var u = /* @__PURE__ */ function(e) {
	return e.HTML = "text/html", e.XML = "text/xml", e.PLAIN = "text/plain", e.XHTML = "application/xhtml+xml", e.SVG = "image/svg+xml", e.CSS = "text/css", e.XSL = "text/xsl", e.VTT = "text/vtt", e.PDF = "application/pdf", e.EVENTSTREAM = "text/event-stream", e;
}({}), d = /* @__PURE__ */ new Set([
	"application/ecmascript",
	"application/javascript",
	"application/json",
	"application/json+protobuf",
	"application/mpegurl",
	"application/vnd.apple.mpegurl",
	"application/vnd.dart",
	"application/xml",
	"application/x-aspx",
	"application/x-javascript",
	"application/x-jsp",
	"application/x-httpd-php",
	"application/x-mpegurl",
	"audio/mpegurl",
	"audio/x-mpegurl"
]);
function f(e) {
	return e.startsWith("text/") || e.startsWith("multipart/") || e.includes("json") || e.endsWith("+xml") || d.has(e);
}
function p(e) {
	if (e === "*/*") return {
		mimeType: null,
		charset: null
	};
	let { mimeType: t, params: n } = m(e);
	return {
		mimeType: t,
		charset: n.get("charset")?.toLowerCase().trim() ?? null
	};
}
function m(e) {
	e = e.trim();
	let t = h(e, " 	;(");
	t < 0 && (t = e.length);
	let n = e.indexOf("/");
	if (n < 0 || n > t) return {
		mimeType: null,
		params: /* @__PURE__ */ new Map()
	};
	let r = e.substring(0, t).toLowerCase(), i = /* @__PURE__ */ new Map(), a = e.indexOf(";", t);
	for (; a >= 0 && a < e.length;) {
		if (++a, a = g(e, " 	", a), a < 0) continue;
		let t = a;
		if (a = h(e, ";=", a), a < 0 || e[a] === ";") continue;
		let n = e.substring(t, a).toLowerCase();
		++a, a = g(e, " 	", a);
		let r = "";
		if (!(a < 0 || e[a] === ";")) {
			if (e[a] !== "\"") {
				let t = a;
				a = e.indexOf(";", a);
				let n = a >= 0 ? a : e.length;
				r = e.substring(t, n).trimEnd();
			} else {
				for (++a; a < e.length && e[a] !== "\"";) e[a] === "\\" && a + 1 < e.length && ++a, r += e[a], ++a;
				a = e.indexOf(";", a);
			}
			i.has(n) || i.set(n, r);
		}
	}
	return {
		mimeType: r,
		params: i
	};
}
function h(e, t, n = 0) {
	for (let r = n; r < e.length; r++) if (t.includes(e[r])) return r;
	return -1;
}
function g(e, t, n = 0) {
	for (let r = n; r < e.length; r++) if (!t.includes(e[r])) return r;
	return -1;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/text_utils/CodeMirrorUtils.ts
function _() {
	async function e(e, t) {
		let n = await c(), r = new l(e, 4, 2), i = n.startState(2), a = r.pos;
		for (; !r.eol();) {
			r.start = a;
			let e = n.token(r, i);
			e === "error" && i.state === "maybeprop" && (e = "property"), t(r.current(), e), a = r.pos;
		}
	}
	return e;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/text_utils/ContentProvider.ts
var v = class {
	lineNumber;
	lineContent;
	columnNumber;
	matchLength;
	constructor(e, t, n, r) {
		this.lineNumber = e, this.lineContent = t, this.columnNumber = n, this.matchLength = r;
	}
	static comparator(e, t) {
		return e.lineNumber - t.lineNumber || e.columnNumber - t.columnNumber;
	}
}, y = function(e, t, n, r, i = !0) {
	return e == null || i && e.length > 1048576 ? null : (e = n ? e : encodeURIComponent(e), "data:" + t + (r ? ";charset=" + r : "") + (n ? ";base64" : "") + "," + e);
}, b = function(e) {
	return "requestStreamingContent" in e;
}, x = class {
	#e;
	#t = 0;
	#n = 0;
	#r = 0;
	constructor(e) {
		this.#e = e;
	}
	advance(e) {
		for (this.#t = e; this.#n < this.#e.length && this.#e[this.#n] < this.#t;) ++this.#n;
		this.#r = this.#n ? this.#t - this.#e[this.#n - 1] - 1 : this.#t;
	}
	offset() {
		return this.#t;
	}
	resetTo(e) {
		this.#t = e, this.#n = i(this.#e, e, n), this.#r = this.#n ? this.#t - this.#e[this.#n - 1] - 1 : this.#t;
	}
	lineNumber() {
		return this.#n;
	}
	columnNumber() {
		return this.#r;
	}
}, S = 2 ** 31 - 1, C = class e {
	startLine;
	startColumn;
	endLine;
	endColumn;
	constructor(e, t, n, r) {
		this.startLine = e, this.startColumn = t, this.endLine = n, this.endColumn = r;
	}
	static createFromLocation(t, n) {
		return new e(t, n, t, n);
	}
	static createUnboundedFromLocation(t, n) {
		return new e(t, n, S, S);
	}
	static fromObject(t) {
		return new e(t.startLine, t.startColumn, t.endLine, t.endColumn);
	}
	static comparator(e, t) {
		return e.compareTo(t);
	}
	static fromEdit(t, n) {
		let r = t.startLine, i = t.startColumn + n.length, a = s(n);
		if (a.length > 1) {
			r = t.startLine + a.length - 1;
			let e = a.length;
			i = a[e - 1] - a[e - 2] - 1;
		}
		return new e(t.startLine, t.startColumn, r, i);
	}
	isEmpty() {
		return this.startLine === this.endLine && this.startColumn === this.endColumn;
	}
	immediatelyPrecedes(e) {
		return e ? this.endLine === e.startLine && this.endColumn === e.startColumn : !1;
	}
	immediatelyFollows(e) {
		return e ? e.immediatelyPrecedes(this) : !1;
	}
	follows(e) {
		return e.endLine === this.startLine && e.endColumn <= this.startColumn || e.endLine < this.startLine;
	}
	get linesCount() {
		return this.endLine - this.startLine;
	}
	collapseToEnd() {
		return new e(this.endLine, this.endColumn, this.endLine, this.endColumn);
	}
	collapseToStart() {
		return new e(this.startLine, this.startColumn, this.startLine, this.startColumn);
	}
	normalize() {
		return this.startLine > this.endLine || this.startLine === this.endLine && this.startColumn > this.endColumn ? new e(this.endLine, this.endColumn, this.startLine, this.startColumn) : this.clone();
	}
	clone() {
		return new e(this.startLine, this.startColumn, this.endLine, this.endColumn);
	}
	serializeToObject() {
		return {
			startLine: this.startLine,
			startColumn: this.startColumn,
			endLine: this.endLine,
			endColumn: this.endColumn
		};
	}
	compareTo(e) {
		return this.startLine > e.startLine ? 1 : this.startLine < e.startLine ? -1 : this.startColumn > e.startColumn ? 1 : this.startColumn < e.startColumn ? -1 : 0;
	}
	compareToPosition(e, t) {
		return e < this.startLine || e === this.startLine && t < this.startColumn ? -1 : +(e > this.endLine || e === this.endLine && t > this.endColumn);
	}
	equal(e) {
		return this.startLine === e.startLine && this.endLine === e.endLine && this.startColumn === e.startColumn && this.endColumn === e.endColumn;
	}
	relativeTo(e, t) {
		let n = this.clone();
		return this.startLine === e && (n.startColumn -= t), this.endLine === e && (n.endColumn -= t), n.startLine -= e, n.endLine -= e, n;
	}
	relativeFrom(e, t) {
		let n = this.clone();
		return this.startLine === 0 && (n.startColumn += t), this.endLine === 0 && (n.endColumn += t), n.startLine += e, n.endLine += e, n;
	}
	rebaseAfterTextEdit(e, t) {
		console.assert(e.startLine === t.startLine), console.assert(e.startColumn === t.startColumn);
		let n = this.clone();
		if (!this.follows(e)) return n;
		let r = t.endLine - e.endLine, i = t.endColumn - e.endColumn;
		return n.startLine += r, n.endLine += r, n.startLine === t.endLine && (n.startColumn += i), n.endLine === t.endLine && (n.endColumn += i), n;
	}
	toString() {
		return JSON.stringify(this);
	}
	containsLocation(e, t) {
		return this.startLine === this.endLine ? this.startLine === e && this.startColumn <= t && t < this.endColumn : this.startLine === e ? this.startColumn <= t : this.endLine === e ? t < this.endColumn : this.startLine < e && e < this.endLine;
	}
	get start() {
		return {
			lineNumber: this.startLine,
			columnNumber: this.startColumn
		};
	}
	get end() {
		return {
			lineNumber: this.endLine,
			columnNumber: this.endColumn
		};
	}
	intersection(t) {
		let { startLine: n, startColumn: r } = this;
		n < t.startLine ? (n = t.startLine, r = t.startColumn) : n === t.startLine && (r = Math.max(r, t.startColumn));
		let { endLine: i, endColumn: a } = this;
		return i > t.endLine ? (i = t.endLine, a = t.endColumn) : i === t.endLine && (a = Math.min(a, t.endColumn)), n > i || n === i && r >= a ? new e(0, 0, 0, 0) : new e(n, r, i, a);
	}
}, w = class {
	offset;
	length;
	constructor(e, t) {
		this.offset = e, this.length = t;
	}
}, T = class {
	#e;
	#t;
	constructor(e) {
		this.#e = e;
	}
	lineEndings() {
		return this.#t ||= s(this.#e), this.#t;
	}
	value() {
		return this.#e;
	}
	lineCount() {
		return this.lineEndings().length;
	}
	offsetFromPosition(e, t) {
		return (e ? this.lineEndings()[e - 1] + 1 : 0) + t;
	}
	positionFromOffset(e) {
		let t = this.lineEndings(), r = i(t, e, n);
		return {
			lineNumber: r,
			columnNumber: e - (r && t[r - 1] + 1)
		};
	}
	lineAt(e) {
		let t = this.lineEndings(), n = e > 0 ? t[e - 1] + 1 : 0, r = t[e], i = this.#e.substring(n, r);
		return i.length > 0 && i.charAt(i.length - 1) === "\r" && (i = i.substring(0, i.length - 1)), i;
	}
	toSourceRange(e) {
		let t = this.offsetFromPosition(e.startLine, e.startColumn);
		return new w(t, this.offsetFromPosition(e.endLine, e.endColumn) - t);
	}
	toTextRange(e) {
		let t = new x(this.lineEndings()), n = C.createFromLocation(0, 0);
		return t.resetTo(e.offset), n.startLine = t.lineNumber(), n.startColumn = t.columnNumber(), t.advance(e.offset + e.length), n.endLine = t.lineNumber(), n.endColumn = t.columnNumber(), n;
	}
	replaceRange(e, t) {
		let n = this.toSourceRange(e);
		return this.#e.substring(0, n.offset) + t + this.#e.substring(n.offset + n.length);
	}
	extract(e) {
		let t = this.toSourceRange(e);
		return this.#e.substr(t.offset, t.length);
	}
}, E = new FinalizationRegistry((e) => {
	URL.revokeObjectURL(e);
}), D = 10485760, O = class t {
	mimeType;
	charset;
	#e;
	#t;
	#n;
	#r;
	constructor(e, t, n, r) {
		this.charset = r || "utf-8", t ? this.#e = e : this.#t = e, this.mimeType = n, this.mimeType ||= t ? "application/octet-stream" : "text/plain";
	}
	get base64() {
		if (this.#e === void 0) throw Error("Encoding text content as base64 is not supported");
		return this.#e;
	}
	get text() {
		if (this.#t !== void 0) return this.#t;
		if (!this.isTextContent) throw Error("Cannot interpret binary data as text");
		let t = e(this.#e);
		return this.#t = new TextDecoder(this.charset).decode(t), this.#t;
	}
	get isTextContent() {
		return this.#i || f(this.mimeType);
	}
	get isEmpty() {
		return !this.#e && !this.#t;
	}
	get createdFromBase64() {
		return this.#e !== void 0;
	}
	get #i() {
		return this.#e === void 0;
	}
	get textObj() {
		return this.#n === void 0 && (this.#n = new T(this.text)), this.#n;
	}
	contentEqualTo(e) {
		return this.#e !== void 0 && e.#e !== void 0 ? this.#e === e.#e : this.#t !== void 0 && e.#t !== void 0 ? this.#t === e.#t : this.isTextContent && e.isTextContent ? this.text === e.text : !1;
	}
	asDataUrl() {
		if (this.#e !== void 0) {
			let e = this.isTextContent ? this.charset : null;
			return y(this.#e, this.mimeType ?? "", !0, e);
		}
		return y(this.text, this.mimeType ?? "", !1, "utf-8");
	}
	asBlob() {
		if (this.#e !== void 0) {
			if (this.#e.length * .75 > D) return null;
			let t = e(this.#e);
			return new Blob([t], { type: this.mimeType });
		}
		let t = this.#t ?? "";
		return t.length > D ? null : new Blob([t], { type: this.mimeType });
	}
	asImagePreviewUrl() {
		if (this.#r) return this.#r;
		let e = this.asDataUrl();
		if (e !== null) return this.#r = e, this.#r;
		let t = this.asBlob();
		return t === null ? null : (this.#r = URL.createObjectURL(t), E.register(this, this.#r), this.#r);
	}
	asDeferedContent() {
		if (this.isTextContent) return {
			content: this.text,
			isEncoded: !1
		};
		if (this.#t !== void 0) return {
			content: this.#t,
			isEncoded: !1
		};
		if (this.#e !== void 0) return {
			content: this.#e,
			isEncoded: !0
		};
		throw Error("Unreachable");
	}
	static isError(e) {
		return "error" in e;
	}
	static textOr(e, n) {
		return t.isError(e) ? n : e.text;
	}
	static contentDataOrEmpty(e) {
		return t.isError(e) ? k : e;
	}
	static asDeferredContent(e) {
		return t.isError(e) ? {
			error: e.error,
			content: null,
			isEncoded: !1
		} : e.asDeferedContent();
	}
}, k = new O("", !1, "text/plain"), A = /(?:^|\s)(\-)?([\w\-]+):([^\s]+)/, j = /(?:^|\s)(\-)?\/([^\/\\]+(\\.[^\/]*)*)\//, M = /(?:^|\s)(\-)?([^\s]+)/, N = /\s/, P = {
	isSpaceChar: function(e) {
		return N.test(e);
	},
	lineIndent: function(e) {
		let t = 0;
		for (; t < e.length && P.isSpaceChar(e.charAt(t));) ++t;
		return e.substr(0, t);
	},
	splitStringByRegexes(e, t) {
		let n = [], r = [];
		for (let e = 0; e < t.length; e++) {
			let n = t[e];
			n.global ? r.push(n) : r.push(new RegExp(n.source, n.flags ? n.flags + "g" : "g"));
		}
		return i(e, 0, 0), n;
		function i(e, t, a) {
			if (t >= r.length) {
				n.push({
					value: e,
					position: a,
					regexIndex: -1,
					captureGroups: []
				});
				return;
			}
			let o = r[t], s = 0, c;
			for (o.lastIndex = 0; (c = o.exec(e)) !== null;) {
				let r = e.substring(s, c.index);
				r && i(r, t + 1, a + s);
				let o = c[0];
				n.push({
					value: o,
					position: a + c.index,
					regexIndex: t,
					captureGroups: c.slice(1)
				}), s = c.index + o.length;
			}
			let l = e.substring(s);
			l && i(l, t + 1, a + s);
		}
	}
}, F = class {
	keys;
	constructor(e) {
		this.keys = e;
	}
	static cloneFilter(e) {
		return {
			key: e.key,
			text: e.text,
			regex: e.regex,
			negative: e.negative
		};
	}
	parse(e) {
		let t = P.splitStringByRegexes(e, [
			A,
			j,
			M
		]), n = [];
		for (let { regexIndex: e, captureGroups: r } of t) if (e !== -1) {
			if (e === 0) {
				let e = r[0], t = r[1], i = r[2];
				this.keys.indexOf(t) === -1 ? n.push({
					text: `${t}:${i}`,
					negative: !!e
				}) : n.push({
					key: t,
					text: i,
					negative: !!e
				});
			} else if (e === 1) {
				let e = r[0], t = r[1];
				try {
					n.push({
						regex: new RegExp(t, "im"),
						negative: !!e
					});
				} catch {
					n.push({
						text: `/${t}/`,
						negative: !!e
					});
				}
			} else if (e === 2) {
				let e = r[0], t = r[1];
				n.push({
					text: t,
					negative: !!e
				});
			}
		}
		return n;
	}
}, I = class {
	callback;
	index;
	balance;
	buffer;
	findMultiple;
	closingDoubleQuoteRegex;
	lastBalancedIndex;
	constructor(e, t) {
		this.callback = e, this.index = 0, this.balance = 0, this.buffer = "", this.findMultiple = t || !1, this.closingDoubleQuoteRegex = /[^\\](?:\\\\)*"/g;
	}
	write(e) {
		this.buffer += e;
		let t = this.buffer.length, n = this.buffer, r;
		for (r = this.index; r < t; ++r) {
			let e = n[r];
			if (e === "\"") {
				if (this.closingDoubleQuoteRegex.lastIndex = r, !this.closingDoubleQuoteRegex.test(n)) break;
				r = this.closingDoubleQuoteRegex.lastIndex - 1;
			} else if (e === "{") ++this.balance;
			else if (e === "}") {
				if (--this.balance, this.balance < 0) return this.reportBalanced(), !1;
				if (!this.balance && (this.lastBalancedIndex = r + 1, !this.findMultiple)) break;
			} else if (e === "]" && !this.balance) return this.reportBalanced(), !1;
		}
		return this.index = r, this.reportBalanced(), !0;
	}
	reportBalanced() {
		this.lastBalancedIndex &&= (this.callback(this.buffer.slice(0, this.lastBalancedIndex)), this.buffer = this.buffer.slice(this.lastBalancedIndex), this.index -= this.lastBalancedIndex, 0);
	}
	remainder() {
		return this.buffer;
	}
}, L = function(e) {
	let t = [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	], n = 0, r = 0;
	for (let i of e) {
		let e = 0;
		if (i.length !== 0) {
			let t = i.charAt(0);
			if (t === "	") {
				n++;
				continue;
			}
			for (; t === " ";) t = i.charAt(++e);
		}
		if (e === i.length) {
			r = 0;
			continue;
		}
		let a = Math.abs(e - r);
		a < t.length && (t[a] = t[a] + 1), r = e;
	}
	let i = 0, a = 0;
	for (let e = 1; e < t.length; ++e) {
		let n = t[e];
		n > a && (a = n, i = e);
	}
	return n > i ? "	" : i ? " ".repeat(i) : null;
}, R = function(e) {
	let t = 0;
	for (let n = 0; n < e.length; ++t) {
		let t = e.indexOf("\n", n);
		t < 0 && (t = e.length), n = t + 1;
	}
	return (e.length - t) / t >= 80;
}, z = function(e, t, n, r) {
	return O.isError(e) || !e.isTextContent ? [] : B(e.textObj, t, n, r);
}, B = function(e, t, n, r) {
	let i = o(t, n, r), a = [];
	for (let t = 0; t < e.lineCount(); ++t) {
		let n = e.lineAt(t), r = n.matchAll(i);
		for (let e of r) a.push(new v(t, n, e.index, e[0].length));
	}
	return a;
}, V = function(e, t, n, r) {
	let i = o(t, n, r), a = [];
	for (let { lineNumber: t, lineContent: n } of e) {
		let e = n.matchAll(i);
		for (let r of e) a.push(new v(t, n, r.index, r[0].length));
	}
	return a;
}, H = function(e, t) {
	let n = Math.min(e.length, t.length);
	for (let r = n; r > 0; r--) {
		let n = e.slice(-r);
		if (n === t.substring(0, r)) return n;
	}
	return null;
}, U = class e {
	#e;
	#t;
	#n;
	constructor(e, t, n) {
		this.#e = e, this.#t = t, this.#n = n;
	}
	static fromString(t, n, r) {
		return new e(t, n, () => Promise.resolve(new O(r, !1, n.canonicalMimeType())));
	}
	contentURL() {
		return this.#e;
	}
	contentType() {
		return this.#t;
	}
	requestContentData() {
		return this.#n();
	}
	async searchInContent(e, t, n) {
		return z(await this.requestContentData(), e, t, n);
	}
}, W = class e extends t {
	mimeType;
	#e;
	#t;
	#n = [];
	#r;
	constructor(e, t, n) {
		super(), this.mimeType = e, this.#e = t, this.#t = !(!n || n.createdFromBase64), this.#r = n;
	}
	static create(t, n) {
		return new e(t, n);
	}
	static from(t) {
		return new e(t.mimeType, t.charset, t);
	}
	get isTextContent() {
		return this.#r ? this.#r.isTextContent : f(this.mimeType);
	}
	addChunk(e) {
		if (this.#t) throw Error("Cannot add base64 data to a text-only ContentData.");
		this.#n.push(e), this.dispatchEventToListeners("ChunkAdded", {
			content: this,
			chunk: e
		});
	}
	content() {
		if (this.#r && this.#n.length === 0) return this.#r;
		let e = this.#r?.base64 ?? "", t = this.#n.reduce((e, t) => a(e, t), e);
		return this.#r = new O(t, !0, this.mimeType, this.#e), this.#n = [], this.#r;
	}
}, G = function(e) {
	return "error" in e;
}, K = function(e) {
	return G(e) ? e : e.content();
}, q = /* @__PURE__ */ function(e) {
	return e.CHUNK_ADDED = "ChunkAdded", e;
}({}), J = class extends O {
	lines;
	#e;
	#t;
	#n;
	constructor(e, t, n) {
		if (super("", !1, "text/x-wast", "utf-8"), e.length !== t.length) throw Error("Lines and offsets don't match");
		this.lines = e, this.#e = t, this.#t = n;
	}
	get text() {
		return this.#n === void 0 && (this.#n = this.lines.join("\n")), this.#n;
	}
	get isEmpty() {
		return this.lines.length === 0 || this.lines.length === 1 && this.lines[0].length === 0;
	}
	get lineNumbers() {
		return this.#e.length;
	}
	bytecodeOffsetToLineNumber(e) {
		return r(this.#e, e, n) - 1;
	}
	lineNumberToBytecodeOffset(e) {
		return this.#e[e];
	}
	*nonBreakableLineNumbers() {
		let e = 0, t = 0;
		for (; e < this.lineNumbers;) {
			if (t < this.#t.length && this.lineNumberToBytecodeOffset(e) >= this.#t[t].start) {
				e = this.bytecodeOffsetToLineNumber(this.#t[t++].end) + 1;
				continue;
			}
			yield e++;
		}
	}
	asDeferedContent() {
		return {
			content: "",
			isEncoded: !1,
			wasmDisassemblyInfo: this
		};
	}
};
//#endregion
export { b as C, p as D, f as E, v as S, u as T, k as _, G as a, C as b, F as c, H as d, R as f, O as g, V as h, K as i, P as l, z as m, q as n, U as o, B as p, W as r, I as s, J as t, L as u, T as v, _ as w, x, w as y };
