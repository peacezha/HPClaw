import { D as e, H as t, Jt as n, K as r, Q as i, _ as a, b as o, h as s, i as c, o as l, tt as u, v as d, w as f, x as p } from "./common-DMSVbaSb.js";
import { $d as m, Bc as h, Cl as g, Gl as _, Jl as ee, Ll as v, Md as te, Ml as y, Nl as b, Ol as x, Pl as ne, Qf as re, Ql as ie, Qs as ae, Uc as S, Xl as oe, Yf as C, Zl as se, Zs as ce, _l as le, _p as ue, bl as de, bp as w, df as fe, dp as pe, fl as T, fp as me, gl as E, if as he, jd as D, kd as ge, kl as O, ml as k, qd as A, su as _e, uc as ve, xl as ye } from "./legacy-dM_vujv7.js";
import { p as be } from "./root-DdvV-xPu.js";
import "./platform-D4TUCh2P.js";
import { t as j } from "./MapUtilities-C6UNTa-e.js";
import { S as xe, _ as Se, b as M, g as N, m as Ce, o as we, t as Te, v as Ee } from "./text_utils-DWSliayn.js";
import { I as De, P as Oe, d as ke, x as Ae } from "./StringUtilities-CMDxNrEc.js";
import { a as je, s as Me } from "./FormatterActions-D6HaA-6R.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/core/common/Mutex.ts
var Ne = class {
	#e = !1;
	#t = [];
	acquire() {
		let e = { resolved: !1 };
		return this.#e ? new Promise((t) => {
			this.#t.push(() => t(this.#n.bind(this, e)));
		}) : (this.#e = !0, Promise.resolve(this.#n.bind(this, e)));
	}
	#n(e) {
		if (e.resolved) throw Error("Cannot release more than once.");
		e.resolved = !0;
		let t = this.#t.shift();
		if (!t) {
			this.#e = !1;
			return;
		}
		t();
	}
	async run(e) {
		let t = await this.acquire();
		try {
			return await e();
		} finally {
			t();
		}
	}
}, Pe = /^\s*at\s+/;
function Fe(e) {
	let t = e.split("\n"), n = Ie(t), r = [];
	if (n === -1) return r;
	for (let e = n; e < t.length; ++e) {
		let n = t[e], i = Pe.exec(n);
		if (!i) {
			if (n.trim() === "") continue;
			return null;
		}
		let a = n.substring(i[0].length), o = !1;
		a.startsWith("async ") && (o = !0, a = a.substring(6));
		let s = !1;
		a.startsWith("new ") && (s = !0, a = a.substring(4));
		let c = "", l = "", u = -1, f = -1, p, m, h = !1, g = !1, _, ee, v, te, y = a.indexOf(" (");
		if (a.endsWith(")") && y !== -1) {
			c = a.substring(0, y).trim();
			let e = a.substring(y + 2, a.length - 1);
			if (e.startsWith("eval at ")) {
				h = !0;
				let t = e.lastIndexOf(", "), n = e;
				t === -1 ? e = "" : (n = e.substring(0, t), e = e.substring(t + 2)), n.startsWith("eval at ") && (n = n.substring(8));
				let r = n.indexOf(" ("), i = n, a = "";
				r === -1 ? te = Fe(`    at ${i}`)?.[0] : (i = n.substring(0, r).trim(), a = n.substring(r + 2, n.length - 1), te = Fe(`    at ${i} (${a})`)?.[0]);
			}
			if (e.startsWith("index ")) v = parseInt(e.substring(6), 10), l = "";
			else if (e === "<anonymous>" || e === "native") l = "";
			else if (e.includes(":wasm-function[")) {
				g = !0;
				let t = /^(.*):wasm-function\[(\d+)\]:(0x[0-9a-fA-F]+)$/.exec(e);
				t && (l = t[1], ee = parseInt(t[2], 10), f = parseInt(t[3], 16));
			} else {
				let t = d.splitLineAndColumn(e);
				l = t.url, u = t.lineNumber ?? -1, f = t.columnNumber ?? -1;
			}
		} else {
			let e = d.splitLineAndColumn(a);
			l = e.url, u = e.lineNumber ?? -1, f = e.columnNumber ?? -1;
		}
		if (c) {
			let e = /(.*)\s+\[as\s+(.*)\]/.exec(c);
			e && (m = e[2], c = e[1]);
			let t = c.indexOf(".");
			t !== -1 && (p = c.substring(0, t), m ??= c.substring(t + 1)), g && p && (_ = p);
		}
		r.push({
			url: l,
			functionName: c,
			lineNumber: u,
			columnNumber: f,
			parsedFrameInfo: {
				isAsync: o,
				isConstructor: s,
				isEval: h,
				evalOrigin: te,
				isWasm: g,
				wasmModuleName: _,
				wasmFunctionIndex: ee,
				typeName: p,
				methodName: m,
				promiseIndex: v
			}
		});
	}
	return r;
}
function Ie(e) {
	return e.findIndex((e) => Pe.test(e));
}
function Le(e) {
	let t = e.split("\n"), n = Ie(t);
	return n === -1 ? e : t.slice(0, n).join("\n");
}
function Re(e, t) {
	function n(e) {
		let r = e.parsedFrameInfo?.isWasm, i = t.callFrames.find((t) => r ? e.url === t.url && e.columnNumber === t.columnNumber : e.url === t.url && e.lineNumber === t.lineNumber && e.columnNumber === t.columnNumber);
		i && (e.scriptId = i.scriptId), e.parsedFrameInfo?.evalOrigin && n(e.parsedFrameInfo.evalOrigin);
	}
	for (let t of e) n(t);
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/stack_trace/StackTraceImpl.ts
var ze = class extends i {
	syncFragment;
	asyncFragments;
	constructor(e, t) {
		super(), this.syncFragment = e, this.asyncFragments = t, (e instanceof Ge || e instanceof Ue ? e.fragment : e).stackTraces.add(this), this.asyncFragments.forEach((e) => e.fragment.stackTraces.add(this));
	}
}, Be = class e {
	static EMPTY_FRAGMENT = new e();
	node;
	stackTraces = /* @__PURE__ */ new Set();
	static getOrCreate(t) {
		return t.fragment ||= new e(t), t.fragment;
	}
	constructor(e) {
		this.node = e;
	}
	get frames() {
		if (!this.node) return [];
		let e = [];
		for (let t of this.node.getCallStack()) e.push(...t.frames);
		return e;
	}
}, Ve = class {
	description;
	fragment;
	constructor(e, t) {
		this.description = e, this.fragment = t;
	}
	get frames() {
		return this.fragment.frames;
	}
}, He = class {
	url;
	uiSourceCode;
	name;
	line;
	column;
	missingDebugInfo;
	rawName;
	constructor(e, t, n, r, i, a, o) {
		this.url = e, this.uiSourceCode = t, this.name = n, this.line = r, this.column = i, this.missingDebugInfo = a, this.rawName = o;
	}
}, Ue = class {
	fragment;
	constructor(e) {
		this.fragment = e;
	}
	get frames() {
		if (!this.fragment.node) return [];
		let e = [];
		for (let t of this.fragment.node.getCallStack()) for (let n of t.frames) e.push(new We(n, t.parsedFrameInfo, t.evalOriginFrames));
		return e;
	}
}, We = class e {
	#e;
	#t;
	#n;
	constructor(e, t, n) {
		this.#e = e, this.#t = t, this.#n = n;
	}
	get url() {
		return this.#e.url;
	}
	get uiSourceCode() {
		return this.#e.uiSourceCode;
	}
	get name() {
		return this.#e.name;
	}
	get line() {
		return this.#e.line;
	}
	get column() {
		return this.#e.column;
	}
	get missingDebugInfo() {
		return this.#e.missingDebugInfo;
	}
	get rawName() {
		return this.#e.rawName;
	}
	get isAsync() {
		return this.#t?.isAsync;
	}
	get isConstructor() {
		return this.#t?.isConstructor;
	}
	get isEval() {
		return this.#t?.isEval;
	}
	get evalOrigin() {
		if (this.#n && this.#n.length !== 0) return new e(this.#n[0], this.#t?.evalOrigin?.parsedFrameInfo);
	}
	get isWasm() {
		return this.#t?.isWasm;
	}
	get wasmModuleName() {
		return this.#t?.wasmModuleName;
	}
	get wasmFunctionIndex() {
		return this.#t?.wasmFunctionIndex;
	}
	get typeName() {
		return this.#t?.typeName;
	}
	get methodName() {
		return this.#t?.methodName;
	}
	get promiseIndex() {
		return this.#t?.promiseIndex;
	}
}, Ge = class {
	fragment;
	callFrames;
	constructor(e, t) {
		this.fragment = e, this.callFrames = t;
	}
	get frames() {
		if (!this.fragment.node) return [];
		let e = [], t = 0;
		for (let n of this.fragment.node.getCallStack()) {
			for (let [r, i] of n.frames.entries()) {
				let n = r === 0 ? this.callFrames[t] : this.callFrames[t].createVirtualCallFrame(r, i.name ?? "");
				e.push(new Ke(i, n));
			}
			t++;
		}
		return e;
	}
}, Ke = class {
	#e;
	#t;
	constructor(e, t) {
		this.#e = e, this.#t = t;
	}
	get url() {
		return this.#e.url;
	}
	get uiSourceCode() {
		return this.#e.uiSourceCode;
	}
	get name() {
		return this.#e.name;
	}
	get line() {
		return this.#e.line;
	}
	get column() {
		return this.#e.column;
	}
	get missingDebugInfo() {
		return this.#e.missingDebugInfo;
	}
	get rawName() {
		return this.#e.rawName;
	}
	get sdkFrame() {
		return this.#t;
	}
};
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/stack_trace/ErrorStackParser.ts
function qe(e, t) {
	let n = e.indexOf("\n");
	return e = `${n === -1 ? e : e.substring(0, n)}. ${t}${n === -1 ? "" : e.substring(n)}`, e;
}
function Je(e, t) {
	if (!(/\n\s*at\s/.test(t) || t.startsWith("SyntaxError:"))) return null;
	let n = e.debuggerModel(), r = e.target().inspectedURL(), i = t.split("\n"), a = [];
	for (let e of i) {
		let t = /^\s*at\s(async\s)?/.exec(e);
		if (!t) {
			if (a.length && a[a.length - 1].isCallFrame) return null;
			a.push({ line: e });
			continue;
		}
		let i = t[0].length, o = e.length, s = !1;
		if (e[o - 1] === ")") {
			if (o--, s = !0, i = e.lastIndexOf(" (", o), i < 0) return null;
			i += 2;
			let t = e.indexOf("), ", i);
			t > i && (o = t);
		}
		let c = e.substring(i, o), l = d.splitLineAndColumn(c);
		if (l.url === "<anonymous>") {
			a.length && a[a.length - 1].isCallFrame && !a[a.length - 1].link ? a[a.length - 1].line += `\n${e}` : a.push({
				line: e,
				isCallFrame: !0
			});
			continue;
		}
		let u = Ye(n, l.url);
		if (!u && d.isRelativeURL(l.url) && (u = Ye(n, d.completeURL(r, l.url))), !u) return null;
		a.push({
			line: e,
			isCallFrame: !0,
			link: {
				url: u,
				prefix: e.substring(0, i),
				suffix: e.substring(o),
				enclosedInBraces: s,
				lineNumber: l.lineNumber,
				columnNumber: l.columnNumber
			}
		});
	}
	return a;
}
function Ye(e, t) {
	if (!t) return null;
	if (d.isValidUrlString(t) || e.scriptsForSourceURL(t).length) return t;
	let n = new URL(t, "file://");
	return e.scriptsForSourceURL(n.href).length ? n.href : null;
}
function Xe(e, t) {
	for (let n of e) {
		let e = t.callFrames.find((e) => Ze(n, e));
		e && n.link && (n.link.scriptId = e.scriptId);
	}
}
function Ze(e, t) {
	if (!e.link) return !1;
	let { url: n, lineNumber: r, columnNumber: i } = e.link;
	return n === t.url && r === t.lineNumber && i === t.columnNumber;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/stack_trace/StackTrace.ts
var Qe = /* @__PURE__ */ function(e) {
	return e.NO_INFO = "NO_INFO", e.PARTIAL_INFO = "PARTIAL_INFO", e;
}({}), $e = /* @__PURE__ */ function(e) {
	return e.UPDATED = "UPDATED", e;
}({}), et = class e {
	static #e;
	frame;
	constructor(e) {
		this.frame = e;
	}
	get sdkFrame() {
		return this.frame.sdkFrame;
	}
	static for(t) {
		function n(e, t) {
			return e.url === t.url && e.uiSourceCode === t.uiSourceCode && e.name === t.name && e.line === t.line && e.column === t.column && e.sdkFrame === t.sdkFrame && JSON.stringify(e.missingDebugInfo) === JSON.stringify(t.missingDebugInfo);
		}
		return (!e.#e || !n(e.#e.frame, t)) && (e.#e = new e(t)), e.#e;
	}
};
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/stack_trace/Trie.ts
function tt(e) {
	return e.lineNumber === -1 && e.columnNumber === -1 && !e.scriptId && !e.url;
}
var nt = class {
	parent;
	children = [];
	rawFrame;
	frames = [];
	fragment;
	parsedFrameInfo;
	evalOriginFrames;
	constructor(e, t) {
		this.rawFrame = e, this.parent = t, this.parsedFrameInfo = e.parsedFrameInfo;
	}
	*getCallStack() {
		for (let e = this; e.parent; e = e.parent) yield e;
	}
}, rt = class {
	#e = {
		parent: null,
		children: []
	};
	insert(e) {
		if (e.length === 0) throw Error("Trie.insert called with an empty frames array.");
		let t = this.#e;
		for (let n = e.length - 1; n >= 0; --n) t = this.#t(t, e[n]);
		return t;
	}
	#t(e, t) {
		let n = 0;
		for (; n < e.children.length; ++n) {
			let r = e.children[n], i = r instanceof WeakRef ? r.deref() : r;
			if (!i) continue;
			let a = it(i.rawFrame, t);
			if (a === 0) return t.parsedFrameInfo && !i.parsedFrameInfo && (i.parsedFrameInfo = t.parsedFrameInfo), i;
			if (a > 0) break;
		}
		let r = new nt(t, e);
		return e.parent ? e.children.splice(n, 0, r) : e.children.splice(n, 0, new WeakRef(r)), r;
	}
	walk(e, t) {
		let n = e ? [e] : [...this.#e.children].map((e) => e.deref()).filter((e) => !!e);
		for (let e = n.pop(); e; e = n.pop()) if (t(e)) for (let t = e.children.length - 1; t >= 0; --t) n.push(e.children[t]);
	}
};
function it(e, t) {
	let n = (e.scriptId ?? "").localeCompare(t.scriptId ?? "");
	if (n !== 0) return n;
	let r = (e.url ?? "").localeCompare(t.url ?? "");
	if (r !== 0) return r;
	let i = (e.functionName ?? "").localeCompare(t.functionName ?? "");
	return i === 0 ? e.lineNumber === t.lineNumber ? e.columnNumber - t.columnNumber : e.lineNumber - t.lineNumber : i;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/stack_trace/StackTraceModel.ts
var P = class e extends fe {
	#e = new rt();
	#t = new Ne();
	static #n(t) {
		let n = (t ?? D.instance().primaryPageTarget())?.model(e);
		if (!n) throw Error("Unable to find StackTraceModel");
		return n;
	}
	async createFromProtocolRuntime(e, t) {
		let [n, r] = await Promise.all([this.#a(e.callFrames, t), this.#i(e, t)]);
		return new ze(n, r);
	}
	async createFromErrorStackLikeString(e, t, n) {
		let r = Fe(e);
		if (!r) return null;
		n?.stackTrace && Re(r, n.stackTrace);
		let [i, a] = await Promise.all([this.#a(r, t), n?.stackTrace ? this.#i(n.stackTrace, t) : Promise.resolve([])]);
		return new ze(new Ue(i), a);
	}
	async createFromDebuggerPaused(e, t) {
		let [n, r] = await Promise.all([this.#r(e, t), this.#i(e, t)]);
		return new ze(n, r);
	}
	async scriptInfoChanged(e, t) {
		let n = await this.#t.acquire();
		try {
			let n = [], r = /* @__PURE__ */ new Set();
			for (let i of this.#s(e)) i.node?.children.length === 0 && n.push(this.#o(i, t)), r = r.union(i.stackTraces);
			await Promise.all(n);
			for (let e of r) e.dispatchEventToListeners($e.UPDATED);
		} finally {
			n();
		}
	}
	async #r(e, t) {
		return new Ge(await this.#a(e.callFrames.map((e) => ({
			scriptId: e.script.scriptId,
			url: e.script.sourceURL,
			functionName: e.functionName,
			lineNumber: e.location().lineNumber,
			columnNumber: e.location().columnNumber
		})), t), e.callFrames);
	}
	async #i(t, n) {
		let r = [], i = this.target().model(T);
		if (i) for await (let { stackTrace: a, target: o } of i.iterateAsyncParents(t)) {
			if (a.callFrames.length === 0) continue;
			let t = e.#n(o).#a(a.callFrames, n).then((e) => new Ve(a.description ?? "", e));
			r.push(t);
		}
		return await Promise.all(r);
	}
	async #a(e, t) {
		if (e.length === 0) return Be.EMPTY_FRAGMENT;
		let n = await this.#t.acquire();
		try {
			let n = this.#e.insert(e), r = !n.fragment, i = Be.getOrCreate(n);
			return r && await this.#o(i, t), i;
		} finally {
			n();
		}
	}
	async #o(e, t) {
		if (!e.node) return;
		let n = e.node.getCallStack().map((e) => e.rawFrame).toArray(), r = await t(n, this.target());
		console.assert(n.length === r.length, "Broken rawFramesToUIFrames implementation");
		let i = [];
		for (let n of e.node.getCallStack()) n.parsedFrameInfo?.evalOrigin && i.push(t([n.parsedFrameInfo.evalOrigin], this.target()));
		let a = await Promise.all(i), o = 0, s = 0;
		for (let t of e.node.getCallStack()) if (t.frames = r[o++].map((e) => new He(e.url, e.uiSourceCode, e.name, e.line, e.column, e.missingDebugInfo, t.rawFrame.functionName)), t.parsedFrameInfo?.evalOrigin) {
			let e = t.parsedFrameInfo.evalOrigin;
			t.evalOriginFrames = a[s++][0].map((t) => new He(t.url, t.uiSourceCode, t.name, t.line, t.column, t.missingDebugInfo, e.functionName));
		}
	}
	#s(e) {
		let t = /* @__PURE__ */ new Set();
		this.#e.walk(null, (n) => n.rawFrame.scriptId === e.scriptId || !n.rawFrame.scriptId && n.rawFrame.url === e.sourceURL ? (t.add(n), !1) : !0);
		let n = /* @__PURE__ */ new Set();
		for (let e of t) this.#e.walk(e, (e) => (e.fragment && n.add(e.fragment), !0));
		return n;
	}
};
fe.register(P, {
	capabilities: te.NONE,
	autostart: !1
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/workspace/FileManager.ts
var at, F = class e extends i {
	#e = /* @__PURE__ */ new Map();
	constructor() {
		super(), C.events.addEventListener(re.SavedURL, this.savedURL, this), C.events.addEventListener(re.CanceledSaveURL, this.#t, this), C.events.addEventListener(re.AppendedToURL, this.appendedToURL, this);
	}
	static instance(t = { forceNew: null }) {
		let { forceNew: n } = t;
		return (!at || n) && (at = new e()), at;
	}
	save(e, t, n) {
		let r = new Promise((t) => this.#e.set(e, t)), { isTextContent: i } = t, a = i ? t.text : t.base64;
		return C.save(e, a, n, !i), r;
	}
	savedURL(e) {
		let { url: t, fileSystemPath: n } = e.data, r = this.#e.get(t);
		this.#e.delete(t), r && r({ fileSystemPath: n });
	}
	#t({ data: e }) {
		let t = this.#e.get(e);
		this.#e.delete(e), t && t(null);
	}
	append(e, t) {
		C.append(e, t);
	}
	close(e) {
		C.close(e);
	}
	appendedToURL({ data: e }) {
		this.dispatchEventToListeners("AppendedToURL", e);
	}
}, ot = /* @__PURE__ */ function(e) {
	return e.APPENDED_TO_URL = "AppendedToURL", e;
}({}), st = {
	index: "(index)",
	thisFileWasChangedExternally: "This file was changed externally. Would you like to reload it?"
}, ct = r("models/workspace/UISourceCode.ts", st), lt = t.bind(void 0, ct), ut = class extends i {
	#e;
	#t;
	#n;
	#r;
	#i;
	#a;
	#o = null;
	#s = /* @__PURE__ */ new Map();
	#c = !1;
	#l = null;
	#u = null;
	#d = !1;
	#f = !1;
	#p = null;
	#m = null;
	#h = null;
	#g = !1;
	#_;
	#v = !1;
	#y = !1;
	#b = !1;
	constructor(e, t, n) {
		super(), this.#n = e, this.#r = t;
		let r = d.fromString(t);
		if (r) {
			if (this.#e = r.securityOrigin(), this.#t = d.concatenate(this.#e, r.folderPathComponents), r.queryParams && !(r.lastPathComponent && n.isFromSourceMap())) this.#i = r.lastPathComponent + "?" + r.queryParams;
			else try {
				this.#i = decodeURIComponent(r.lastPathComponent);
			} catch {
				this.#i = r.lastPathComponent;
			}
		} else this.#e = "", this.#t = "", this.#i = t;
		this.#a = n;
	}
	requestMetadata() {
		return this.#n.requestMetadata(this);
	}
	name() {
		return this.#i;
	}
	mimeType() {
		return this.#n.mimeType(this);
	}
	url() {
		return this.#r;
	}
	canonicalScriptId() {
		return `${this.#a.name()},${this.#r}`;
	}
	parentURL() {
		return this.#t;
	}
	origin() {
		return this.#e;
	}
	fullDisplayName() {
		return this.#n.fullDisplayName(this);
	}
	displayName(e) {
		if (!this.#i) return lt(st.index);
		let t = this.#i;
		return e ? t : Oe(t, 100);
	}
	canRename() {
		return this.#n.canRename();
	}
	rename(e) {
		let { resolve: t, promise: n } = Promise.withResolvers();
		return this.#n.rename(this, e, r.bind(this)), n;
		function r(e, n, r, i) {
			e && this.#x(n, r, i), t(e);
		}
	}
	remove() {
		this.#n.deleteFile(this);
	}
	#x(e, t, n) {
		let r = this.#r;
		this.#i = e, this.#r = t || d.relativePathToUrlString(e, r), n && (this.#a = n), this.dispatchEventToListeners("TitleChanged", this), this.project().workspace().dispatchEventToListeners(V.UISourceCodeRenamed, {
			oldURL: r,
			uiSourceCode: this
		});
	}
	contentURL() {
		return this.url();
	}
	contentType() {
		return this.#a;
	}
	project() {
		return this.#n;
	}
	requestContentData({ cachedWasmOnly: e } = {}) {
		return this.#o ? this.#o : this.#u ? Promise.resolve(this.#u) : e && this.mimeType() === "application/wasm" ? Promise.resolve(new Te([], [], [])) : (this.#o = this.#S(), this.#o);
	}
	async #S() {
		if (this.#u) throw Error("Called UISourceCode#requestContentImpl even though content is available for " + this.#r);
		try {
			this.#u = await this.#n.requestFileContent(this);
		} catch (e) {
			this.#u = { error: e ? String(e) : "" };
		}
		return this.#u;
	}
	#C(e) {
		return e ? e.isEncoded && e.content ? atob(e.content) : e.content : null;
	}
	#w(e) {
		return !e || N.isError(e) ? null : e.createdFromBase64 ? atob(e.base64) : e.text;
	}
	async checkContentUpdated() {
		if (!this.#u && !this.#d || !this.#n.canSetFileContent() || this.#f) return;
		this.#f = !0;
		let t = N.asDeferredContent(await this.#n.requestFileContent(this));
		if (!("error" in t)) {
			if (this.#f = !1, t.content === null) {
				let e = this.workingCopy();
				this.#E("", !1), this.setWorkingCopy(e);
				return;
			}
			if (this.#p !== t.content) {
				if (this.#w(this.#u) === this.#C(t)) {
					this.#p = null;
					return;
				}
				if (!this.isDirty() || this.#m === t.content) {
					this.#E(t.content, !1);
					return;
				}
				await e(this), await new Promise((e) => setTimeout(e, 0)), typeof globalThis.confirm != "function" || globalThis.confirm(lt(st.thisFileWasChangedExternally)) ? this.#E(t.content, !1) : this.#p = t.content;
			}
		}
	}
	forceLoadOnCheckContent() {
		this.#d = !0;
	}
	#T(e) {
		this.#n.canSetFileContent() && this.#n.setFileContent(this, e, !1), this.#E(e, !0);
	}
	#E(e, t) {
		this.#p = null, this.#u = new N(e, !!this.#_, this.mimeType()), this.#o = null, this.#c = !0, this.#D();
		let n = {
			uiSourceCode: this,
			content: e,
			encoded: this.#_
		};
		this.dispatchEventToListeners("WorkingCopyCommitted", n), this.#n.workspace().dispatchEventToListeners(V.WorkingCopyCommitted, n), t && this.#n.workspace().dispatchEventToListeners(V.WorkingCopyCommittedByUser, n);
	}
	addRevision(e) {
		this.#T(e);
	}
	hasCommits() {
		return this.#c;
	}
	workingCopy() {
		return this.workingCopyContent().content || "";
	}
	workingCopyContent() {
		return this.workingCopyContentData().asDeferedContent();
	}
	workingCopyContentData() {
		this.#h &&= (this.#m = this.#h(), null);
		let e = this.#u ? N.contentDataOrEmpty(this.#u) : Se;
		return this.#m === null ? e : new N(this.#m, !1, e.mimeType);
	}
	resetWorkingCopy() {
		this.#D(), this.#O();
	}
	#D() {
		this.#m = null, this.#h = null, this.setContainsAiChanges(!1);
	}
	setWorkingCopy(e) {
		this.#m = e, this.#h = null, this.#O();
	}
	setContainsAiChanges(e) {
		this.#b = e;
	}
	containsAiChanges() {
		return this.#b;
	}
	setContent(e, t) {
		this.#_ = t, this.#n.canSetFileContent() && this.#n.setFileContent(this, e, t), this.#E(e, !0);
	}
	setWorkingCopyGetter(e) {
		this.#h = e, this.#O();
	}
	#O() {
		this.#k(), this.dispatchEventToListeners("WorkingCopyChanged", this), this.#n.workspace().dispatchEventToListeners(V.WorkingCopyChanged, { uiSourceCode: this });
	}
	removeWorkingCopyGetter() {
		this.#h &&= (this.#m = this.#h(), null);
	}
	commitWorkingCopy() {
		this.isDirty() && this.#T(this.workingCopy());
	}
	isDirty() {
		return this.#m !== null || this.#h !== null;
	}
	isKnownThirdParty() {
		return this.#v;
	}
	markKnownThirdParty() {
		this.#v = !0;
	}
	isUnconditionallyIgnoreListed() {
		return this.#y;
	}
	isFetchXHR() {
		return [a.XHR, a.Fetch].includes(this.contentType());
	}
	markAsUnconditionallyIgnoreListed() {
		this.#y = !0;
	}
	extension() {
		return d.extractExtension(this.#i);
	}
	content() {
		return !this.#u || "error" in this.#u ? "" : this.#u.text;
	}
	loadError() {
		return this.#u && "error" in this.#u && this.#u.error || null;
	}
	searchInContent(e, t, n) {
		return !this.#u || "error" in this.#u ? this.#n.searchInFileContent(this, e, t, n) : Promise.resolve(Ce(this.#u, e, t, n));
	}
	contentLoaded() {
		return !!this.#u;
	}
	uiLocation(e, t) {
		return new L(this, e, t);
	}
	messages() {
		return this.#l ? new Set(this.#l) : /* @__PURE__ */ new Set();
	}
	addLineMessage(e, t, n, r, i) {
		let a = M.createFromLocation(n, r || 0), o = new R(e, t, i, a);
		return this.addMessage(o), o;
	}
	addMessage(e) {
		this.#l ||= /* @__PURE__ */ new Set(), this.#l.add(e), this.dispatchEventToListeners("MessageAdded", e);
	}
	removeMessage(e) {
		this.#l?.delete(e) && this.dispatchEventToListeners("MessageRemoved", e);
	}
	#k() {
		if (this.#l) {
			for (let e of this.#l) this.dispatchEventToListeners("MessageRemoved", e);
			this.#l = null;
		}
	}
	setDecorationData(e, t) {
		t !== this.#s.get(e) && (this.#s.set(e, t), this.dispatchEventToListeners("DecorationChanged", e));
	}
	getDecorationData(e) {
		return this.#s.get(e);
	}
	disableEdit() {
		this.#g = !0;
	}
	editDisabled() {
		return this.#g;
	}
	isIgnoreListed(e = vt.instance()) {
		return e.isUserOrSourceMapIgnoreListedUISourceCode(this);
	}
}, I = /* @__PURE__ */ function(e) {
	return e.WorkingCopyChanged = "WorkingCopyChanged", e.WorkingCopyCommitted = "WorkingCopyCommitted", e.TitleChanged = "TitleChanged", e.MessageAdded = "MessageAdded", e.MessageRemoved = "MessageRemoved", e.DecorationChanged = "DecorationChanged", e;
}({}), L = class {
	uiSourceCode;
	lineNumber;
	columnNumber;
	constructor(e, t, n) {
		this.uiSourceCode = e, this.lineNumber = t, this.columnNumber = n;
	}
	linkText(e = !1, t = !1) {
		let n = this.uiSourceCode.displayName(e), r = this.lineAndColumnText(t), i = r ? n + ":" + r : n;
		return this.uiSourceCode.isDirty() && (i = "*" + i), i;
	}
	lineAndColumnText(e = !1) {
		let t;
		return this.uiSourceCode.mimeType() === "application/wasm" ? typeof this.columnNumber == "number" && (t = `0x${this.columnNumber.toString(16)}`) : (t = `${this.lineNumber + 1}`, e && typeof this.columnNumber == "number" && (t += ":" + (this.columnNumber + 1))), t;
	}
	id() {
		return typeof this.columnNumber == "number" ? this.uiSourceCode.project().id() + ":" + this.uiSourceCode.url() + ":" + this.lineNumber + ":" + this.columnNumber : this.lineId();
	}
	lineId() {
		return this.uiSourceCode.project().id() + ":" + this.uiSourceCode.url() + ":" + this.lineNumber;
	}
	static comparator(e, t) {
		return e.compareTo(t);
	}
	compareTo(e) {
		return this.uiSourceCode.url() === e.uiSourceCode.url() ? this.lineNumber === e.lineNumber ? this.columnNumber === e.columnNumber ? 0 : typeof this.columnNumber == "number" ? typeof e.columnNumber == "number" ? this.columnNumber - e.columnNumber : 1 : -1 : this.lineNumber - e.lineNumber : this.uiSourceCode.url() > e.uiSourceCode.url() ? 1 : -1;
	}
	isIgnoreListed(e = vt.instance()) {
		return this.uiSourceCode.isIgnoreListed(e);
	}
}, dt = class {
	uiSourceCode;
	range;
	constructor(e, t) {
		this.uiSourceCode = e, this.range = t;
	}
}, ft = class {
	uiSourceCode;
	range;
	name;
	constructor(e, t, n) {
		this.uiSourceCode = e, this.range = t, this.name = n;
	}
}, R = class {
	#e;
	#t;
	range;
	#n;
	constructor(e, t, n, r) {
		this.#e = e, this.#t = t, this.range = r ?? new M(0, 0, 0, 0), this.#n = n;
	}
	level() {
		return this.#e;
	}
	text() {
		return this.#t;
	}
	clickHandler() {
		return this.#n;
	}
	lineNumber() {
		return this.range.startLine;
	}
	columnNumber() {
		return this.range.startColumn;
	}
	isEqual(e) {
		return this.text() === e.text() && this.level() === e.level() && this.range.equal(e.range);
	}
};
(function(e) {
	e.Level = /* @__PURE__ */ function(e) {
		return e.ERROR = "Error", e.ISSUE = "Issue", e.WARNING = "Warning", e;
	}({});
})(R ||= {});
var z = class {
	modificationTime;
	contentSize;
	constructor(e, t) {
		this.modificationTime = e, this.contentSize = t;
	}
}, pt = /* @__PURE__ */ function(e) {
	return e.PERFORMANCE = "performance", e.COVERAGE = "coverage", e;
}({});
function mt(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let [r, i] of e) for (let [e, a] of i) {
		let i = t(r - 1, e - 1);
		if (!i) continue;
		let o = i[0] + 1, s = i[1] + 1, c = n.get(o);
		c || (c = /* @__PURE__ */ new Map(), n.set(o, c)), c.set(s, (c.get(s) || 0) + a);
	}
	return n;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/workspace/WorkspaceImpl.ts
var B = /* @__PURE__ */ function(e) {
	return e.Debugger = "debugger", e.Formatter = "formatter", e.Network = "network", e.FileSystem = "filesystem", e.ConnectableFileSystem = "connectablefilesystem", e.ContentScripts = "contentscripts", e.Service = "service", e;
}({}), ht = class {
	#e;
	#t;
	#n;
	#r;
	#i = /* @__PURE__ */ new Map();
	constructor(e, t, n, r) {
		this.#e = e, this.#t = t, this.#n = n, this.#r = r;
	}
	id() {
		return this.#t;
	}
	type() {
		return this.#n;
	}
	displayName() {
		return this.#r;
	}
	workspace() {
		return this.#e;
	}
	createUISourceCode(e, t) {
		return new ut(this, e, t);
	}
	addUISourceCode(e) {
		let t = e.url();
		return !this.uiSourceCodeForURL(t) && (this.#i.set(t, e), this.#e.dispatchEventToListeners("UISourceCodeAdded", e), !0);
	}
	removeUISourceCode(e) {
		let t = this.#i.get(e);
		t !== void 0 && (this.#i.delete(e), this.#e.dispatchEventToListeners("UISourceCodeRemoved", t));
	}
	removeProject() {
		this.#e.removeProject(this), this.#i.clear();
	}
	uiSourceCodeForURL(e) {
		return this.#i.get(e) ?? null;
	}
	uiSourceCodes() {
		return this.#i.values();
	}
	renameUISourceCode(e, t) {
		let n = e.url(), r = e.parentURL() ? d.urlFromParentUrlAndName(e.parentURL(), t) : d.preEncodeSpecialCharactersInPath(t);
		this.#i.set(r, e), this.#i.delete(n);
	}
	rename(e, t, n) {}
	excludeFolder(e) {}
	deleteFile(e) {}
	deleteDirectoryRecursively(e) {
		return Promise.resolve(!1);
	}
	remove() {}
	indexContent(e) {}
}, gt = class e extends i {
	#e = /* @__PURE__ */ new Map();
	#t = !1;
	static instance(t = { forceNew: null }) {
		let { forceNew: n } = t;
		return (!u().has(e) || n) && u().set(e, new e()), u().get(e);
	}
	static removeInstance() {
		u().delete(e);
	}
	uiSourceCode(e, t) {
		let n = this.#e.get(e);
		return n ? n.uiSourceCodeForURL(t) : null;
	}
	uiSourceCodeForURL(e) {
		for (let t of this.#e.values()) {
			let n = t.uiSourceCodeForURL(e);
			if (n) return n;
		}
		return null;
	}
	findCompatibleUISourceCodes(e) {
		let t = e.url(), n = e.contentType(), r = [];
		for (let i of this.#e.values()) {
			if (e.project().type() !== i.type()) continue;
			let a = i.uiSourceCodeForURL(t);
			a && a.url() === t && a.contentType() === n && r.push(a);
		}
		return r;
	}
	uiSourceCodesForProjectType(e) {
		let t = [];
		for (let n of this.#e.values()) if (n.type() === e) for (let e of n.uiSourceCodes()) t.push(e);
		return t;
	}
	addProject(e) {
		console.assert(!this.#e.has(e.id()), `A project with id ${e.id()} already exists!`), this.#e.set(e.id(), e), this.dispatchEventToListeners("ProjectAdded", e);
	}
	removeProject(e) {
		this.#e.delete(e.id()), this.dispatchEventToListeners("ProjectRemoved", e);
	}
	project(e) {
		return this.#e.get(e) || null;
	}
	projectForFileSystemRoot(e) {
		let t = d.rawPathToUrlString(e);
		return this.project(t);
	}
	projects() {
		return [...this.#e.values()];
	}
	projectsForType(e) {
		function t(t) {
			return t.type() === e;
		}
		return this.projects().filter(t);
	}
	uiSourceCodes() {
		let e = [];
		for (let t of this.#e.values()) for (let n of t.uiSourceCodes()) e.push(n);
		return e;
	}
	setHasResourceContentTrackingExtensions(e) {
		this.#t = e;
	}
	hasResourceContentTrackingExtensions() {
		return this.#t;
	}
}, V = /* @__PURE__ */ function(e) {
	return e.UISourceCodeAdded = "UISourceCodeAdded", e.UISourceCodeRemoved = "UISourceCodeRemoved", e.UISourceCodeRenamed = "UISourceCodeRenamed", e.WorkingCopyChanged = "WorkingCopyChanged", e.WorkingCopyCommitted = "WorkingCopyCommitted", e.WorkingCopyCommittedByUser = "WorkingCopyCommittedByUser", e.ProjectAdded = "ProjectAdded", e.ProjectRemoved = "ProjectRemoved", e;
}({}), H = {
	removeFromIgnoreList: "Remove from ignore list",
	addScriptToIgnoreList: "Add script to ignore list",
	addDirectoryToIgnoreList: "Add directory to ignore list",
	addAllContentScriptsToIgnoreList: "Add all extension scripts to ignore list",
	addAllThirdPartyScriptsToIgnoreList: "Add all third-party scripts to ignore list",
	addAllAnonymousScriptsToIgnoreList: "Add all anonymous scripts to ignore list"
}, _t = r("models/workspace/IgnoreListManager.ts", H), U = t.bind(void 0, _t), vt = class e extends i {
	#e;
	#t;
	#n = /* @__PURE__ */ new Set();
	#r = /* @__PURE__ */ new Map();
	#i = /* @__PURE__ */ new Set();
	constructor(e, t) {
		super(), this.#e = e, this.#t = t, this.#t.addModelListener(T, k.GlobalObjectCleared, this.clearCacheIfNeeded.bind(this), this), this.#t.addModelListener(g, ye.ExecutionContextCreated, this.onExecutionContextCreated, this, { scoped: !0 }), this.#t.addModelListener(g, ye.ExecutionContextDestroyed, this.onExecutionContextDestroyed, this, { scoped: !0 }), this.#e.moduleSetting("skip-stack-frames-pattern").addChangeListener(this.patternChanged.bind(this)), this.#e.moduleSetting("skip-content-scripts").addChangeListener(this.patternChanged.bind(this)), this.#e.moduleSetting("automatically-ignore-list-known-third-party-scripts").addChangeListener(this.patternChanged.bind(this)), this.#e.moduleSetting("enable-ignore-listing").addChangeListener(this.patternChanged.bind(this)), this.#e.moduleSetting("skip-anonymous-scripts").addChangeListener(this.patternChanged.bind(this)), this.#t.observeModels(T, this);
	}
	static instance(t = { forceNew: null }) {
		let { forceNew: n } = t;
		return n && u().set(e, new e(t.settings ?? c.instance(), t.targetManager ?? D.instance())), u().get(e);
	}
	static removeInstance() {
		u().delete(e);
	}
	addChangeListener(e) {
		this.#n.add(e);
	}
	removeChangeListener(e) {
		this.#n.delete(e);
	}
	modelAdded(e) {
		this.setIgnoreListPatterns(e);
		let t = e.sourceMapManager();
		t.addEventListener(b.SourceMapAttached, this.sourceMapAttached, this), t.addEventListener(b.SourceMapDetached, this.sourceMapDetached, this);
	}
	modelRemoved(e) {
		this.clearCacheIfNeeded();
		let t = e.sourceMapManager();
		t.removeEventListener(b.SourceMapAttached, this.sourceMapAttached, this), t.removeEventListener(b.SourceMapDetached, this.sourceMapDetached, this);
	}
	isContentScript(e) {
		return !e.isDefault;
	}
	onExecutionContextCreated(e) {
		if (this.isContentScript(e.data) && (this.#i.add(e.data.uniqueId), this.skipContentScripts)) for (let e of this.#t.models(T)) this.updateIgnoredExecutionContexts(e);
	}
	onExecutionContextDestroyed(e) {
		if (this.isContentScript(e.data) && (this.#i.delete(e.data.uniqueId), this.skipContentScripts)) for (let e of this.#t.models(T)) this.updateIgnoredExecutionContexts(e);
	}
	clearCacheIfNeeded() {
		this.#r.size > 1024 && this.#r.clear();
	}
	getSkipStackFramesPatternSetting() {
		return this.#e.moduleSetting("skip-stack-frames-pattern");
	}
	setIgnoreListPatterns(e) {
		let t = this.enableIgnoreListing ? this.getSkipStackFramesPatternSetting().getAsArray() : [], n = [];
		for (let e of t) !e.disabled && e.pattern && n.push(e.pattern);
		return e.setBlackboxPatterns(n, this.skipAnonymousScripts);
	}
	updateIgnoredExecutionContexts(e) {
		return e.setBlackboxExecutionContexts(this.skipContentScripts ? Array.from(this.#i) : []);
	}
	getGeneralRulesForUISourceCode(e) {
		return {
			isContentScript: e.project().type() === B.ContentScripts,
			isKnownThirdParty: e.isKnownThirdParty()
		};
	}
	isUserOrSourceMapIgnoreListedUISourceCode(e) {
		if (e.isUnconditionallyIgnoreListed()) return !0;
		let t = this.uiSourceCodeURL(e);
		return this.isUserIgnoreListedURL(t, this.getGeneralRulesForUISourceCode(e));
	}
	isUserIgnoreListedURL(e, t) {
		if (!this.enableIgnoreListing) return !1;
		if (t?.isContentScript && this.skipContentScripts || t?.isKnownThirdParty && this.automaticallyIgnoreListKnownThirdPartyScripts) return !0;
		if (!e) return this.skipAnonymousScripts;
		if (this.#r.has(e)) return !!this.#r.get(e);
		let n = this.getFirstMatchedRegex(e) !== null;
		return this.#r.set(e, n), n;
	}
	getFirstMatchedRegex(e) {
		if (!e) return null;
		let t = this.getSkipStackFramesPatternSetting().getAsArray();
		if (!this.urlToRegExpString(e)) return null;
		for (let n = 0; n < t.length; ++n) {
			let r = t[n];
			if (r.disabled || r.disabledForUrl === e) continue;
			let i = new RegExp(r.pattern);
			if (i.test(e)) return i;
		}
		return null;
	}
	sourceMapAttached(e) {
		let t = e.data.client, n = e.data.sourceMap;
		this.updateScriptRanges(t, n);
	}
	sourceMapDetached(e) {
		let t = e.data.client;
		this.updateScriptRanges(t, void 0);
	}
	async updateScriptRanges(e, t) {
		let n = !1;
		if (this.isUserIgnoreListedURL(e.sourceURL, { isContentScript: e.isContentScript() }) || (n = t?.sourceURLs().some((e) => this.isUserIgnoreListedURL(e, { isKnownThirdParty: t.hasIgnoreListHint(e) })) ?? !1), !n) {
			yt.get(e) && await e.setBlackboxedRanges([]) && yt.delete(e), this.dispatchEventToListeners("IGNORED_SCRIPT_RANGES_UPDATED", e);
			return;
		}
		if (!t) return;
		let r = t.findRanges((e) => this.isUserIgnoreListedURL(e, { isKnownThirdParty: t.hasIgnoreListHint(e) }), { isStartMatching: !0 }).flatMap((e) => [e.start, e.end]);
		!i(yt.get(e) || [], r) && await e.setBlackboxedRanges(r) && yt.set(e, r), this.dispatchEventToListeners("IGNORED_SCRIPT_RANGES_UPDATED", e);
		function i(e, t) {
			if (e.length !== t.length) return !1;
			for (let n = 0; n < e.length; ++n) if (e[n].lineNumber !== t[n].lineNumber || e[n].columnNumber !== t[n].columnNumber) return !1;
			return !0;
		}
	}
	uiSourceCodeURL(e) {
		return e.project().type() === B.Debugger ? null : e.url();
	}
	canIgnoreListUISourceCode(e) {
		let t = this.uiSourceCodeURL(e);
		return t ? !!this.urlToRegExpString(t) : !1;
	}
	ignoreListUISourceCode(e) {
		let t = this.uiSourceCodeURL(e);
		t && this.ignoreListURL(t);
	}
	unIgnoreListUISourceCode(e) {
		this.unIgnoreListURL(this.uiSourceCodeURL(e), this.getGeneralRulesForUISourceCode(e));
	}
	get enableIgnoreListing() {
		return this.#e.moduleSetting("enable-ignore-listing").get();
	}
	set enableIgnoreListing(e) {
		this.#e.moduleSetting("enable-ignore-listing").set(e);
	}
	get skipContentScripts() {
		return this.enableIgnoreListing && this.#e.moduleSetting("skip-content-scripts").get();
	}
	get skipAnonymousScripts() {
		return this.enableIgnoreListing && this.#e.moduleSetting("skip-anonymous-scripts").get();
	}
	get automaticallyIgnoreListKnownThirdPartyScripts() {
		return this.enableIgnoreListing && this.#e.moduleSetting("automatically-ignore-list-known-third-party-scripts").get();
	}
	ignoreListContentScripts() {
		this.enableIgnoreListing ||= !0, this.#e.moduleSetting("skip-content-scripts").set(!0);
	}
	unIgnoreListContentScripts() {
		this.#e.moduleSetting("skip-content-scripts").set(!1);
	}
	ignoreListAnonymousScripts() {
		this.enableIgnoreListing ||= !0, this.#e.moduleSetting("skip-anonymous-scripts").set(!0);
	}
	unIgnoreListAnonymousScripts() {
		this.#e.moduleSetting("skip-anonymous-scripts").set(!1);
	}
	ignoreListThirdParty() {
		this.enableIgnoreListing ||= !0, this.#e.moduleSetting("automatically-ignore-list-known-third-party-scripts").set(!0);
	}
	unIgnoreListThirdParty() {
		this.#e.moduleSetting("automatically-ignore-list-known-third-party-scripts").set(!1);
	}
	ignoreListURL(e) {
		let t = this.urlToRegExpString(e);
		t && this.addRegexToIgnoreList(t, e);
	}
	addRegexToIgnoreList(e, t) {
		let n = this.getSkipStackFramesPatternSetting().getAsArray(), r = !1;
		for (let i = 0; i < n.length; ++i) {
			let a = n[i];
			(a.pattern === e || t && a.disabledForUrl === t) && (a.disabled = !1, a.disabledForUrl = void 0, r = !0);
		}
		r || n.push({
			pattern: e,
			disabled: !1
		}), this.enableIgnoreListing ||= !0, this.getSkipStackFramesPatternSetting().setAsArray(n);
	}
	unIgnoreListURL(e, t) {
		if (t?.isContentScript && this.unIgnoreListContentScripts(), t?.isKnownThirdParty && this.unIgnoreListThirdParty(), !e) {
			this.unIgnoreListAnonymousScripts();
			return;
		}
		let n = this.getSkipStackFramesPatternSetting().getAsArray(), r = this.urlToRegExpString(e);
		if (r) {
			n = n.filter(function(e) {
				return e.pattern !== r;
			});
			for (let t = 0; t < n.length; ++t) {
				let r = n[t];
				if (!r.disabled) try {
					new RegExp(r.pattern).test(e) && (r.disabled = !0, r.disabledForUrl = e);
				} catch {}
			}
			this.getSkipStackFramesPatternSetting().setAsArray(n);
		}
	}
	removeIgnoreListPattern(e) {
		let t = this.getSkipStackFramesPatternSetting().getAsArray();
		t = t.filter(function(t) {
			return t.pattern !== e;
		}), this.getSkipStackFramesPatternSetting().setAsArray(t);
	}
	ignoreListHasPattern(e, t) {
		return this.getSkipStackFramesPatternSetting().getAsArray().some((n) => !(t && n.disabled) && n.pattern === e);
	}
	async patternChanged() {
		this.#r.clear();
		let e = [];
		for (let t of this.#t.models(T)) {
			e.push(this.setIgnoreListPatterns(t));
			let n = t.sourceMapManager();
			for (let r of t.scripts()) e.push(this.updateScriptRanges(r, n.sourceMapForClient(r)));
			e.push(this.updateIgnoredExecutionContexts(t));
		}
		await Promise.all(e);
		let t = Array.from(this.#n);
		for (let e of t) e();
		this.patternChangeFinishedForTests();
	}
	patternChangeFinishedForTests() {}
	urlToRegExpString(e) {
		let t = new d(e);
		if (t.isAboutBlank() || t.isDataURL()) return "";
		if (!t.isValid) return "^" + ke(e) + "$";
		let n = t.lastPathComponent;
		if (n ? n = "/" + n : t.folderPathComponents && (n = t.folderPathComponents + "/"), n ||= t.host, !n) return "";
		let r = t.scheme, i = "";
		return r && r !== "http" && r !== "https" && (i = "^" + r + "://", r === "chrome-extension" && (i += t.host + "\\b"), i += ".*"), i + ke(n) + (e.endsWith(n) ? "$" : "\\b");
	}
	getIgnoreListURLContextMenuItems(e) {
		if (e.project().type() === B.FileSystem) return [];
		let t = [], n = this.canIgnoreListUISourceCode(e), r = this.isUserOrSourceMapIgnoreListedUISourceCode(e), i = !this.uiSourceCodeURL(e), { isContentScript: a, isKnownThirdParty: o } = this.getGeneralRulesForUISourceCode(e);
		return r ? (n || a || o || i) && t.push({
			text: U(H.removeFromIgnoreList),
			callback: this.unIgnoreListUISourceCode.bind(this, e),
			jslogContext: "remove-script-from-ignorelist"
		}) : (n ? t.push({
			text: U(H.addScriptToIgnoreList),
			callback: this.ignoreListUISourceCode.bind(this, e),
			jslogContext: "add-script-to-ignorelist"
		}) : i && t.push({
			text: U(H.addAllAnonymousScriptsToIgnoreList),
			callback: this.ignoreListAnonymousScripts.bind(this),
			jslogContext: "add-anonymous-scripts-to-ignorelist"
		}), t.push(...this.getIgnoreListGeneralContextMenuItems({
			isContentScript: a,
			isKnownThirdParty: o
		}))), t;
	}
	getIgnoreListGeneralContextMenuItems(e) {
		let t = [];
		return e?.isContentScript && t.push({
			text: U(H.addAllContentScriptsToIgnoreList),
			callback: this.ignoreListContentScripts.bind(this),
			jslogContext: "add-content-scripts-to-ignorelist"
		}), e?.isKnownThirdParty && t.push({
			text: U(H.addAllThirdPartyScriptsToIgnoreList),
			callback: this.ignoreListThirdParty.bind(this),
			jslogContext: "add-3p-scripts-to-ignorelist"
		}), t;
	}
	getIgnoreListFolderContextMenuItems(e, t) {
		let n = [], r = "^" + ke(e) + "/";
		return this.ignoreListHasPattern(r, !0) ? n.push({
			text: U(H.removeFromIgnoreList),
			callback: this.removeIgnoreListPattern.bind(this, r),
			jslogContext: "remove-from-ignore-list"
		}) : this.isUserIgnoreListedURL(e, t) ? n.push({
			text: U(H.removeFromIgnoreList),
			callback: this.unIgnoreListURL.bind(this, e, t),
			jslogContext: "remove-from-ignore-list"
		}) : t?.isCurrentlyIgnoreListed || (n.push({
			text: U(H.addDirectoryToIgnoreList),
			callback: this.addRegexToIgnoreList.bind(this, r),
			jslogContext: "add-directory-to-ignore-list"
		}), n.push(...this.getIgnoreListGeneralContextMenuItems(t))), n;
	}
}, yt = /* @__PURE__ */ new WeakMap(), bt = /* @__PURE__ */ function(e) {
	return e.IGNORED_SCRIPT_RANGES_UPDATED = "IGNORED_SCRIPT_RANGES_UPDATED", e;
}({}), xt = class e {
	#e;
	#t;
	#n;
	#r;
	#i;
	constructor(t, n, r) {
		this.#e = t, this.#t = n, this.#n = r;
		let { queries: i, fileRegexQueries: a } = e.#a(t, n, r);
		this.#r = i, this.#i = a;
	}
	static fromPlainObject(t) {
		return new e(t.query, t.ignoreCase, t.isRegex);
	}
	filePathMatchesFileQuery(e) {
		return this.#i.every(({ regex: t, shouldMatch: n }) => !!e.match(t) === n);
	}
	queries() {
		return this.#r;
	}
	query() {
		return this.#e;
	}
	ignoreCase() {
		return this.#t;
	}
	isRegex() {
		return this.#n;
	}
	toPlainObject() {
		return {
			query: this.query(),
			ignoreCase: this.ignoreCase(),
			isRegex: this.isRegex()
		};
	}
	static #a(t, n, r) {
		let i = /"([^\\"]|\\.)+"/, a = /(\s*(?!-?f(ile)?:)[^\\ ]|\\.)+/, o = a.source + "(\\s+" + a.source + ")*", s = [
			"(\\s*" + St.source + "\\s*)",
			"(" + i.source + ")",
			"(" + o + ")"
		].join("|"), c = new RegExp(s, "g"), l = t.match(c) || [], u = [], d = [];
		for (let t of l) {
			if (!t) continue;
			let i = e.#c(t);
			if (i) {
				let e = new RegExp(i.text, n ? "i" : "");
				d.push({
					regex: e,
					shouldMatch: i.shouldMatch
				});
			} else r ? u.push(t) : t.startsWith("\"") && t.endsWith("\"") ? u.push(e.#s(t)) : u.push(e.#o(t));
		}
		return {
			queries: u,
			fileRegexQueries: d
		};
	}
	static #o(e) {
		return e.replace(/\\(.)/g, "$1");
	}
	static #s(e) {
		return e.substring(1, e.length - 1).replace(/\\(.)/g, "$1");
	}
	static #c(e) {
		let t = e.match(St);
		if (!t) return null;
		e = t[3];
		let n = "";
		for (let t = 0; t < e.length; ++t) {
			let r = e[t];
			r === "*" ? n += ".*" : r === "\\" ? (++t, e[t] === " " && (n += " ")) : (Ae().indexOf(e.charAt(t)) !== -1 && (n += "\\"), n += e.charAt(t));
		}
		let r = !t[1];
		return {
			text: n,
			shouldMatch: r
		};
	}
}, St = /(-)?f(ile)?:((?:[^\\ ]|\\.)+)/, Ct = { unknownErrorLoadingFile: "Unknown error loading file" }, wt = r("models/bindings/ContentProviderBasedProject.ts", Ct), Tt = t.bind(void 0, wt), W = class extends ht {
	#e;
	#t = /* @__PURE__ */ new WeakMap();
	constructor(e, t, n, r, i) {
		super(e, t, n, r), this.#e = i, e.addProject(this);
	}
	async requestFileContent(e) {
		let { contentProvider: t } = this.#t.get(e);
		try {
			return await t.requestContentData();
		} catch (e) {
			return { error: e ? String(e) : Tt(Ct.unknownErrorLoadingFile) };
		}
	}
	isServiceProject() {
		return this.#e;
	}
	async requestMetadata(e) {
		let { metadata: t } = this.#t.get(e);
		return t;
	}
	canSetFileContent() {
		return !1;
	}
	async setFileContent(e, t, n) {}
	fullDisplayName(e) {
		let t = e.parentURL().replace(/^(?:https?|file)\:\/\//, "");
		try {
			t = decodeURI(t);
		} catch {}
		return t + "/" + e.displayName(!0);
	}
	mimeType(e) {
		let { mimeType: t } = this.#t.get(e);
		return t;
	}
	canRename() {
		return !1;
	}
	rename(e, t, n) {
		n(!1);
	}
	excludeFolder(e) {}
	canExcludeFolder(e) {
		return !1;
	}
	async createFile(e, t, n, r) {
		return null;
	}
	canCreateFile() {
		return !1;
	}
	deleteFile(e) {}
	remove() {}
	searchInFileContent(e, t, n, r) {
		let { contentProvider: i } = this.#t.get(e);
		return i.searchInContent(t, n, r);
	}
	async findFilesMatchingSearchRequest(e, t, r) {
		let i = /* @__PURE__ */ new Map();
		return r.totalWork = t.length, await Promise.all(t.map(a.bind(this))), r.done = !0, i;
		async function a(t) {
			let a = !0, o = [];
			for (let r of e.queries().slice()) {
				let i = await this.searchInFileContent(t, r, !e.ignoreCase(), e.isRegex());
				if (!i.length) {
					a = !1;
					break;
				}
				o = n(o, i, xe.comparator);
			}
			a && i.set(t, o), ++r.worked;
		}
	}
	indexContent(e) {
		queueMicrotask(() => {
			e.done = !0;
		});
	}
	addUISourceCodeWithProvider(e, t, n, r) {
		this.#t.set(e, {
			mimeType: r,
			metadata: n,
			contentProvider: t
		}), this.addUISourceCode(e);
	}
	addContentProvider(e, t, n) {
		let r = this.createUISourceCode(e, t.contentType());
		return this.addUISourceCodeWithProvider(r, t, null, n), r;
	}
	reset() {
		this.removeProject(), this.workspace().addProject(this);
	}
	dispose() {
		this.removeProject();
	}
}, G = /* @__PURE__ */ new WeakMap(), Et = /* @__PURE__ */ new WeakMap(), Dt, Ot = class e extends i {
	constructor() {
		super();
	}
	static instance({ forceNew: t } = { forceNew: !1 }) {
		return (!Dt || t) && (Dt = new e()), Dt;
	}
}, kt = /* @__PURE__ */ function(e) {
	return e.FRAME_ATTRIBUTION_ADDED = "FrameAttributionAdded", e.FRAME_ATTRIBUTION_REMOVED = "FrameAttributionRemoved", e;
}({}), K = class e {
	static resolveFrame(t, n) {
		let r = e.targetForUISourceCode(t)?.model(S);
		return r ? r.frameForId(n) : null;
	}
	static setInitialFrameAttribution(t, n) {
		if (!n) return;
		let r = e.resolveFrame(t, n);
		if (!r) return;
		let i = /* @__PURE__ */ new Map();
		i.set(n, {
			frame: r,
			count: 1
		}), G.set(t, i);
	}
	static cloneInitialFrameAttribution(e, t) {
		let n = G.get(e);
		if (!n) return;
		let r = /* @__PURE__ */ new Map();
		for (let e of n.keys()) {
			let t = n.get(e);
			t !== void 0 && r.set(e, {
				frame: t.frame,
				count: t.count
			});
		}
		G.set(t, r);
	}
	static addFrameAttribution(t, n) {
		let r = e.resolveFrame(t, n);
		if (!r) return;
		let i = G.get(t);
		if (!i) return;
		let a = i.get(n) || {
			frame: r,
			count: 0
		};
		if (a.count += 1, i.set(n, a), a.count !== 1) return;
		let o = {
			uiSourceCode: t,
			frame: r
		};
		Ot.instance().dispatchEventToListeners("FrameAttributionAdded", o);
	}
	static removeFrameAttribution(e, t) {
		let n = G.get(e);
		if (!n) return;
		let r = n.get(t);
		if (console.assert(!!r, "Failed to remove frame attribution for url: " + e.url()), !r || (--r.count, r.count > 0)) return;
		n.delete(t);
		let i = {
			uiSourceCode: e,
			frame: r.frame
		};
		Ot.instance().dispatchEventToListeners("FrameAttributionRemoved", i);
	}
	static targetForUISourceCode(e) {
		return Et.get(e.project()) || null;
	}
	static setTargetForProject(e, t) {
		Et.set(e, t);
	}
	static getTargetForProject(e) {
		return Et.get(e) || null;
	}
	static framesForUISourceCode(t) {
		let n = e.targetForUISourceCode(t)?.model(S), r = G.get(t);
		return !n || !r ? [] : Array.from(r.keys()).map((e) => n.frameForId(e)).filter((e) => !!e);
	}
}, At = class {
	#e;
	#t;
	#n = /* @__PURE__ */ new Map();
	#r;
	#i;
	#a = /* @__PURE__ */ new Map();
	#o = /* @__PURE__ */ new Map();
	#s = new j();
	#c;
	#l;
	constructor(e, t, n) {
		this.#e = e.sourceMapManager(), this.#t = n, this.#c = e, this.#l = n.ignoreListManager, this.#r = new W(t, "jsSourceMaps:stub:" + e.target().id(), B.Service, "", !0), this.#i = [
			this.#e.addEventListener(b.SourceMapWillAttach, this.sourceMapWillAttach, this),
			this.#e.addEventListener(b.SourceMapFailedToAttach, this.sourceMapFailedToAttach, this),
			this.#e.addEventListener(b.SourceMapAttached, this.sourceMapAttached, this),
			this.#e.addEventListener(b.SourceMapDetached, this.sourceMapDetached, this)
		];
	}
	setFunctionRanges(e, t) {
		for (let n of this.#s.get(e)) n.augmentWithScopes(e.url(), t);
	}
	addStubUISourceCode(e) {
		let t = this.#r.addContentProvider(d.concatenate(e.sourceURL, ":sourcemap"), we.fromString(e.sourceURL, a.Script, "\n\n\n\n\n// Please wait a bit.\n// Compiled script is not shown while source map is being loaded!"), "text/javascript");
		this.#n.set(e, t);
	}
	removeStubUISourceCode(e) {
		let t = this.#n.get(e);
		this.#n.delete(e), t && this.#r.removeUISourceCode(t.url());
	}
	getLocationRangesForSameSourceLocation(e) {
		let t = e.debuggerModel, n = e.script();
		if (!n) return [];
		let r = this.#e.sourceMapForClient(n);
		if (!r) return [];
		let { lineNumber: i, columnNumber: a } = n.rawLocationToRelativeLocation(e), o = r.findEntry(i, a);
		if (!o?.sourceURL) return [];
		let s = this.#o.get(r);
		if (!s) return [];
		let c = s.uiSourceCodeForURL(o.sourceURL);
		return !c || !this.#s.hasValue(c, r) ? [] : r.findReverseRanges(o.sourceURL, o.sourceLineNumber, o.sourceColumnNumber).map(({ startLine: e, startColumn: r, endLine: i, endColumn: a }) => {
			let o = n.relativeLocationToRawLocation({
				lineNumber: e,
				columnNumber: r
			}), s = n.relativeLocationToRawLocation({
				lineNumber: i,
				columnNumber: a
			});
			return {
				start: t.createRawLocation(n, o.lineNumber, o.columnNumber),
				end: t.createRawLocation(n, s.lineNumber, s.columnNumber)
			};
		});
	}
	uiSourceCodeForURL(e, t) {
		let n = t ? B.ContentScripts : B.Network;
		for (let t of this.#a.values()) {
			if (t.type() !== n) continue;
			let r = t.uiSourceCodeForURL(e);
			if (r) return r;
		}
		return null;
	}
	rawLocationToUILocation(e) {
		let t = e.script();
		if (!t) return null;
		let { lineNumber: n, columnNumber: r } = t.rawLocationToRelativeLocation(e), i = this.#n.get(t);
		if (i) return new L(i, n, r);
		let a = this.#e.sourceMapForClient(t);
		if (!a) return null;
		let o = this.#o.get(a);
		if (!o) return null;
		let s = a.findEntry(n, r, e.inlineFrameIndex);
		if (!s?.sourceURL) return null;
		let c = o.uiSourceCodeForURL(s.sourceURL);
		return !c || !this.#s.hasValue(c, a) ? null : c.uiLocation(s.sourceLineNumber, s.sourceColumnNumber);
	}
	uiLocationToRawLocations(e, t, n) {
		let r = [];
		for (let i of this.#s.get(e)) {
			let a = i.sourceLineMapping(e.url(), t, n);
			if (!a) continue;
			let o = i.findReverseEntries(e.url(), a.sourceLineNumber, a.sourceColumnNumber, !0);
			if (o.length === 0) continue;
			let s = this.#e.clientForSourceMap(i);
			if (s) for (let e of o) {
				let t = s.relativeLocationToRawLocation(e);
				r.push(s.debuggerModel.createRawLocation(s, t.lineNumber, t.columnNumber));
			}
		}
		return r;
	}
	uiLocationRangeToRawLocationRanges(e, t) {
		if (!this.#s.has(e)) return null;
		let n = [];
		for (let r of this.#s.get(e)) {
			let i = this.#e.clientForSourceMap(r);
			if (i) for (let a of r.reverseMapTextRanges(e.url(), t)) {
				let e = i.relativeLocationToRawLocation(a.start), t = i.relativeLocationToRawLocation(a.end), r = i.debuggerModel.createRawLocation(i, e.lineNumber, e.columnNumber), o = i.debuggerModel.createRawLocation(i, t.lineNumber, t.columnNumber);
				n.push({
					start: r,
					end: o
				});
			}
		}
		return n;
	}
	async functionBoundsAtRawLocation(e) {
		let t = e.script();
		if (!t) return null;
		let n = this.#e.sourceMapForClient(t);
		if (!n) return null;
		await n.waitForScopeInfo();
		let { lineNumber: r, columnNumber: i } = t.rawLocationToRelativeLocation(e), { url: a, scope: o } = n.findOriginalFunctionScope({
			line: r,
			column: i
		}) ?? {};
		if (!o || !a) return null;
		let s = this.#o.get(n);
		if (!s) return null;
		let c = s.uiSourceCodeForURL(a);
		if (!c || "error" in await c.requestContentData()) return null;
		let l = o.name ?? "";
		return new ft(c, new M(o.start.line, o.start.column, o.end.line, o.end.column), l);
	}
	async translateRawFramesStep(e, t) {
		let n = e[0];
		if (tt(n)) return !1;
		let r = await (async (e) => {
			let t = this.#c.scriptForId(e.scriptId ?? "");
			if (!t || this.#n.has(t)) return null;
			let n = t.sourceMap();
			return await n?.waitForScopeInfo(), n?.hasScopeInfo() ? {
				sourceMap: n,
				script: t
			} : null;
		})(n);
		if (!r) return !1;
		let { sourceMap: i, script: a } = r, { lineNumber: o, columnNumber: s } = a.relativeLocationToRawLocation(n);
		if (!i.isOutlinedFrame(o, s)) {
			let n = i.translateCallSite(o, s);
			if (!n.length) return !1;
			e.shift();
			let r = [];
			t.push(r);
			let a = this.#o.get(i);
			for (let e of n) {
				let t = e.url ? a?.uiSourceCodeForURL(e.url) : void 0;
				r.push({
					...e,
					url: t ? void 0 : e.url,
					uiSourceCode: t ?? void 0
				});
			}
			return !0;
		}
		return !1;
	}
	getMappedLines(e) {
		if (!this.#s.has(e)) return null;
		let t = /* @__PURE__ */ new Set();
		for (let n of this.#s.get(e)) for (let r of n.mappings()) r.sourceURL === e.url() && t.add(r.sourceLineNumber);
		return t;
	}
	sourceMapWillAttach(e) {
		let { client: t } = e.data;
		this.addStubUISourceCode(t), this.#t.updateLocations(t), this.#l.isUserIgnoreListedURL(t.sourceURL, { isContentScript: t.isContentScript() }) && this.#e.cancelAttachSourceMap(t);
	}
	sourceMapFailedToAttach(e) {
		let { client: t } = e.data;
		this.removeStubUISourceCode(t), this.#t.updateLocations(t);
	}
	sourceMapAttached(e) {
		let { client: t, sourceMap: n } = e.data, r = /* @__PURE__ */ new Set([t]);
		this.removeStubUISourceCode(t);
		let i = t.target(), o = `jsSourceMaps:${t.isContentScript() ? "extensions" : ""}:${i.id()}`, c = this.#a.get(o);
		if (!c) {
			let e = t.isContentScript() ? B.ContentScripts : B.Network;
			c = new W(this.#r.workspace(), o, e, "", !1), K.setTargetForProject(c, i), this.#a.set(o, c);
		}
		this.#o.set(n, c);
		for (let e of n.sourceURLs()) {
			let i = a.SourceMapScript, o = c.createUISourceCode(e, i);
			n.hasIgnoreListHint(e) && o.markKnownThirdParty();
			let l = n.embeddedContentByURL(e), u = l === null ? new ve(e, i, t.createPageResourceLoadInitiator()) : we.fromString(e, i, l), d = null;
			l !== null && (d = new z(null, new TextEncoder().encode(l).length));
			let f = s.mimeFromURL(e) ?? i.canonicalMimeType();
			this.#s.set(o, n), K.setInitialFrameAttribution(o, t.frameId);
			let p = c.uiSourceCodeForURL(e);
			if (p !== null) {
				for (let t of this.#s.get(p)) {
					this.#s.delete(p, t);
					let i = this.#e.clientForSourceMap(t);
					i && (K.removeFrameAttribution(p, i.frameId), n.compatibleForURL(e, t) && (this.#s.set(o, t), K.addFrameAttribution(o, i.frameId)), r.add(i));
				}
				c.removeUISourceCode(e);
			}
			c.addUISourceCodeWithProvider(o, u, d, f);
		}
		Promise.all([...r].map((e) => this.#t.updateLocations(e))).then(() => this.sourceMapAttachedForTest(n));
	}
	sourceMapDetached(e) {
		let { client: t, sourceMap: n } = e.data, r = this.#o.get(n);
		if (r) {
			for (let e of r.uiSourceCodes()) this.#s.delete(e, n) && (K.removeFrameAttribution(e, t.frameId), this.#s.has(e) || r.removeUISourceCode(e.url()));
			this.#o.delete(n), this.#t.updateLocations(t);
		}
	}
	scriptsForUISourceCode(e) {
		let t = [];
		for (let n of this.#s.get(e)) {
			let e = this.#e.clientForSourceMap(n);
			e && t.push(e);
		}
		return t;
	}
	sourceMapAttachedForTest(e) {}
	dispose() {
		w(this.#i);
		for (let e of this.#a.values()) e.dispose();
		this.#r.dispose();
	}
}, q = class {
	#e;
	#t;
	#n;
	constructor(e, t) {
		this.#e = e, this.#t = t, this.#t.add(this), this.#n = null;
	}
	async update() {
		this.#e && (this.#n ? await this.#n.then(() => this.update()) : (this.#n = this.#e(this), await this.#n, this.#n = null));
	}
	async uiLocation() {
		throw Error("Not implemented");
	}
	dispose() {
		this.#t.delete(this), this.#e = null;
	}
	isDisposed() {
		return !this.#t.has(this);
	}
}, jt = class {
	#e;
	constructor() {
		this.#e = /* @__PURE__ */ new Set();
	}
	add(e) {
		this.#e.add(e);
	}
	delete(e) {
		this.#e.delete(e);
	}
	has(e) {
		return this.#e.has(e);
	}
	disposeAll() {
		for (let e of this.#e) e.dispose();
	}
}, Mt = class {
	#e;
	#t;
	#n;
	#r;
	#i;
	constructor(e, t, n, r) {
		this.#e = t, this.#i = r, this.#t = new W(n, "cssSourceMaps:" + e.id(), B.Network, "", !1), K.setTargetForProject(this.#t, e), this.#r = /* @__PURE__ */ new Map(), this.#n = [this.#e.addEventListener(b.SourceMapAttached, this.sourceMapAttached, this), this.#e.addEventListener(b.SourceMapDetached, this.sourceMapDetached, this)];
	}
	sourceMapAttachedForTest(e) {}
	async sourceMapAttached(e) {
		let t = e.data.client, n = e.data.sourceMap, r = this.#t, i = this.#r;
		for (let e of n.sourceURLs()) {
			let a = i.get(e);
			a || (a = new Pt(r, e, t.createPageResourceLoadInitiator()), i.set(e, a)), a.addSourceMap(n, t.frameId);
		}
		await this.#i.updateLocations(t), this.sourceMapAttachedForTest(n);
	}
	async sourceMapDetached(e) {
		let t = e.data.client, n = e.data.sourceMap, r = this.#r;
		for (let e of n.sourceURLs()) {
			let i = r.get(e);
			i && (i.removeSourceMap(n, t.frameId), i.getUiSourceCode() || r.delete(e));
		}
		await this.#i.updateLocations(t);
	}
	rawLocationToUILocation(e) {
		let t = e.header();
		if (!t) return null;
		let n = this.#e.sourceMapForClient(t);
		if (!n) return null;
		let { lineNumber: r, columnNumber: i } = e;
		n.mapsOrigin() && t.isInline && (r -= t.startLine, r === 0 && (i -= t.startColumn));
		let a = n.findEntry(r, i);
		if (!a?.sourceURL) return null;
		let o = this.#t.uiSourceCodeForURL(a.sourceURL);
		return o ? o.uiLocation(a.sourceLineNumber, a.sourceColumnNumber) : null;
	}
	uiLocationToRawLocations(e) {
		let { uiSourceCode: t, lineNumber: n, columnNumber: r = 0 } = e, i = Nt.get(t);
		if (!i) return [];
		let a = [];
		for (let e of i.getReferringSourceMaps()) {
			let i = e.findReverseEntries(t.url(), n, r), o = this.#e.clientForSourceMap(e);
			o && a.push(...i.map((e) => new x(o, e.lineNumber, e.columnNumber)));
		}
		return a;
	}
	static uiSourceOrigin(e) {
		let t = Nt.get(e);
		return t ? t.getReferringSourceMaps().map((e) => e.compiledURL()) : [];
	}
	dispose() {
		w(this.#n), this.#t.dispose();
	}
}, Nt = /* @__PURE__ */ new WeakMap(), Pt = class {
	#e;
	#t;
	#n;
	referringSourceMaps;
	uiSourceCode;
	constructor(e, t, n) {
		this.#e = e, this.#t = t, this.#n = n, this.referringSourceMaps = [], this.uiSourceCode = null;
	}
	recreateUISourceCodeIfNeeded(e) {
		let t = this.referringSourceMaps[this.referringSourceMaps.length - 1], n = a.SourceMapStyleSheet, r = t.embeddedContentByURL(this.#t), i = r === null ? new ve(this.#t, n, this.#n) : we.fromString(this.#t, n, r), o = this.#e.createUISourceCode(this.#t, n);
		Nt.set(o, this);
		let c = s.mimeFromURL(this.#t) || n.canonicalMimeType(), l = typeof r == "string" ? new z(null, r.length) : null;
		this.uiSourceCode ? (K.cloneInitialFrameAttribution(this.uiSourceCode, o), this.#e.removeUISourceCode(this.uiSourceCode.url())) : K.setInitialFrameAttribution(o, e), this.uiSourceCode = o, this.#e.addUISourceCodeWithProvider(this.uiSourceCode, i, l, c);
	}
	addSourceMap(e, t) {
		this.uiSourceCode && K.addFrameAttribution(this.uiSourceCode, t), this.referringSourceMaps.push(e), this.recreateUISourceCodeIfNeeded(t);
	}
	removeSourceMap(e, t) {
		let n = this.uiSourceCode;
		K.removeFrameAttribution(n, t);
		let r = this.referringSourceMaps.lastIndexOf(e);
		r !== -1 && this.referringSourceMaps.splice(r, 1), this.referringSourceMaps.length ? this.recreateUISourceCodeIfNeeded(t) : (this.#e.removeUISourceCode(n.url()), this.uiSourceCode = null);
	}
	getReferringSourceMaps() {
		return this.referringSourceMaps;
	}
	getUiSourceCode() {
		return this.uiSourceCode;
	}
};
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/bindings/ResourceUtils.ts
function Ft(e) {
	return S.resourceForURL(e);
}
function It(e) {
	if (!e) return "";
	let t = gt.instance().uiSourceCodeForURL(e);
	if (t) return t.displayName();
	let n = Ft(e);
	if (n) return n.displayName;
	let r = D.instance().inspectedURL();
	if (!r) return De(e, "");
	let i = d.fromString(r);
	if (!i) return e;
	let a = i.lastPathComponent, o = r.indexOf(a);
	if (o !== -1 && o + a.length === r.length) {
		let t = r.substring(0, o);
		if (e.startsWith(t) && e.length > o) return e.substring(o);
	}
	let s = De(e, i.host);
	return s === "/" ? i.host + "/" : s;
}
function Lt(e, t, n) {
	let r = e.model(S);
	if (!r) return null;
	let i = r.frameForId(t);
	return i ? Rt(i.resourceForURL(n)) : null;
}
function Rt(e) {
	return !e || typeof e.contentSize() != "number" && !e.lastModified() ? null : new z(e.lastModified(), e.contentSize());
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/bindings/StylesSourceMapping.ts
var zt = /* @__PURE__ */ new WeakMap(), Bt = class {
	#e;
	#t;
	#n = /* @__PURE__ */ new Map();
	#r;
	constructor(e, t) {
		this.#e = e;
		let n = this.#e.target();
		this.#t = new W(t, "css:" + n.id(), B.Network, "", !1), K.setTargetForProject(this.#t, n), this.#r = [
			this.#e.addEventListener(y.StyleSheetAdded, this.styleSheetAdded, this),
			this.#e.addEventListener(y.StyleSheetRemoved, this.styleSheetRemoved, this),
			this.#e.addEventListener(y.StyleSheetChanged, this.styleSheetChanged, this)
		];
	}
	addSourceMap(e, t) {
		this.#n.get(e)?.addSourceMap(e, t);
	}
	rawLocationToUILocation(e) {
		let t = e.header();
		if (!t || !this.acceptsHeader(t)) return null;
		let n = this.#n.get(t.resourceURL());
		if (!n) return null;
		let r = e.lineNumber, i = e.columnNumber;
		if (t.isInline && t.hasSourceURL) {
			r -= t.lineNumberInSource(0);
			let e = t.columnNumberInSource(r, 0);
			e === void 0 ? i = e : i -= e;
		}
		return n.getUiSourceCode().uiLocation(r, i);
	}
	uiLocationToRawLocations(e) {
		let t = zt.get(e.uiSourceCode);
		if (!t) return [];
		let n = [];
		for (let r of t.getHeaders()) {
			let t = e.lineNumber, i = e.columnNumber;
			r.isInline && r.hasSourceURL && (i = r.columnNumberInSource(t, e.columnNumber || 0), t = r.lineNumberInSource(t)), n.push(new x(r, t, i));
		}
		return n;
	}
	acceptsHeader(e) {
		return !(e.isConstructedByNew() || e.isInline && !e.hasSourceURL && e.origin !== "inspector" || !e.resourceURL());
	}
	styleSheetAdded(e) {
		let t = e.data;
		if (!this.acceptsHeader(t)) return;
		let n = t.resourceURL(), r = this.#n.get(n);
		r ? r.addHeader(t) : (r = new Vt(this.#e, this.#t, t), this.#n.set(n, r));
	}
	styleSheetRemoved(e) {
		let t = e.data;
		if (!this.acceptsHeader(t)) return;
		let n = t.resourceURL(), r = this.#n.get(n);
		r && (r.getHeaders().size === 1 ? (r.dispose(), this.#n.delete(n)) : r.removeHeader(t));
	}
	styleSheetChanged(e) {
		let t = this.#e.styleSheetHeaderForId(e.data.styleSheetId);
		if (!t || !this.acceptsHeader(t)) return;
		let n = this.#n.get(t.resourceURL());
		n && n.styleSheetChanged(t);
	}
	dispose() {
		for (let e of this.#n.values()) e.dispose();
		this.#n.clear(), w(this.#r), this.#t.removeProject();
	}
}, Vt = class {
	#e;
	#t;
	headers;
	uiSourceCode;
	#n;
	#r = new me(200);
	#i = !1;
	#a;
	#o;
	constructor(e, t, n) {
		this.#e = e, this.#t = t, this.headers = /* @__PURE__ */ new Set([n]);
		let r = e.target(), i = n.resourceURL(), a = Lt(r, n.frameId, i);
		this.uiSourceCode = this.#t.createUISourceCode(i, n.contentType()), zt.set(this.uiSourceCode, this), K.setInitialFrameAttribution(this.uiSourceCode, n.frameId), this.#t.addUISourceCodeWithProvider(this.uiSourceCode, this, a, "text/css"), this.#n = [this.uiSourceCode.addEventListener(I.WorkingCopyChanged, this.workingCopyChanged, this), this.uiSourceCode.addEventListener(I.WorkingCopyCommitted, this.workingCopyCommitted, this)];
	}
	addHeader(e) {
		this.headers.add(e), K.addFrameAttribution(this.uiSourceCode, e.frameId);
	}
	removeHeader(e) {
		this.headers.delete(e), K.removeFrameAttribution(this.uiSourceCode, e.frameId);
	}
	styleSheetChanged(e) {
		if (console.assert(this.headers.has(e)), this.#o || !this.headers.has(e)) return;
		let t = this.mirrorContent.bind(this, e, !0);
		this.#r.schedule(t, pe.DEFAULT);
	}
	workingCopyCommitted() {
		if (this.#a) return;
		let e = this.mirrorContent.bind(this, this.uiSourceCode, !0);
		this.#r.schedule(e, pe.AS_SOON_AS_POSSIBLE);
	}
	workingCopyChanged() {
		if (this.#a) return;
		let e = this.mirrorContent.bind(this, this.uiSourceCode, !1);
		this.#r.schedule(e, pe.DEFAULT);
	}
	async mirrorContent(e, t) {
		if (this.#i) {
			this.styleFileSyncedForTest();
			return;
		}
		let n = null;
		if (n = e === this.uiSourceCode ? this.uiSourceCode.workingCopy() : N.textOr(await e.requestContentData(), null), n === null || this.#i) {
			this.styleFileSyncedForTest();
			return;
		}
		e !== this.uiSourceCode && (this.#a = !0, this.uiSourceCode.setWorkingCopy(n), this.#a = !1), this.#o = !0;
		let r = [];
		for (let i of this.headers) i !== e && r.push(this.#e.setStyleSheetText(i.id, n, t));
		await Promise.all(r), this.#o = !1, this.styleFileSyncedForTest();
	}
	styleFileSyncedForTest() {}
	dispose() {
		this.#i || (this.#i = !0, this.#t.removeUISourceCode(this.uiSourceCode.url()), w(this.#n));
	}
	contentURL() {
		return console.assert(this.headers.size > 0), this.#s().originalContentProvider().contentURL();
	}
	contentType() {
		return console.assert(this.headers.size > 0), this.#s().originalContentProvider().contentType();
	}
	requestContentData() {
		return console.assert(this.headers.size > 0), this.#s().originalContentProvider().requestContentData();
	}
	searchInContent(e, t, n) {
		return console.assert(this.headers.size > 0), this.#s().originalContentProvider().searchInContent(e, t, n);
	}
	#s() {
		return console.assert(this.headers.size > 0), this.headers.values().next().value;
	}
	getHeaders() {
		return this.headers;
	}
	getUiSourceCode() {
		return this.uiSourceCode;
	}
	addSourceMap(e, t) {
		let n = this.#e.sourceMapManager();
		this.headers.forEach((r) => {
			n.detachSourceMap(r), n.attachSourceMap(r, e, t);
		});
	}
}, Ht = class e {
	#e;
	#t;
	#n;
	constructor(e, t) {
		this.#e = e, this.#e.cssWorkspaceBinding = this, this.#t = /* @__PURE__ */ new Map(), t.observeModels(O, this), this.#n = /* @__PURE__ */ new Set();
	}
	static instance(t = {
		forceNew: null,
		resourceMapping: null,
		targetManager: null
	}) {
		let { forceNew: n, resourceMapping: r, targetManager: i } = t;
		if (n) {
			if (!r || !i) throw Error(`Unable to create CSSWorkspaceBinding: resourceMapping and targetManager must be provided: ${(/* @__PURE__ */ Error()).stack}`);
			u().set(e, new e(r, i));
		}
		return u().get(e);
	}
	static removeInstance() {
		u().delete(e);
	}
	get modelToInfo() {
		return this.#t;
	}
	getCSSModelInfo(e) {
		return this.#t.get(e);
	}
	modelAdded(e) {
		this.#t.set(e, new Ut(e, this.#e, this));
	}
	modelRemoved(e) {
		this.getCSSModelInfo(e).dispose(), this.#t.delete(e);
	}
	async pendingLiveLocationChangesPromise() {
		await Promise.all(this.#n);
	}
	recordLiveLocationChange(e) {
		e.then(() => {
			this.#n.delete(e);
		}), this.#n.add(e);
	}
	async updateLocations(e) {
		let t = this.getCSSModelInfo(e.cssModel()).updateLocations(e);
		this.recordLiveLocationChange(t), await t;
	}
	createLiveLocation(e, t, n) {
		let r = this.getCSSModelInfo(e.cssModel()).createLiveLocation(e, t, n);
		return this.recordLiveLocationChange(r), r;
	}
	propertyRawLocation(e, t) {
		let n = e.ownerStyle;
		if (!n || n.type !== _e.Regular || !n.styleSheetId) return null;
		let r = n.cssModel().styleSheetHeaderForId(n.styleSheetId);
		if (!r) return null;
		let i = t ? e.nameRange() : e.valueRange();
		if (!i) return null;
		let a = i.startLine, o = i.startColumn;
		return new x(r, r.lineNumberInSource(a), r.columnNumberInSource(a, o));
	}
	propertyUILocation(e, t) {
		let n = this.propertyRawLocation(e, t);
		return n ? this.rawLocationToUILocation(n) : null;
	}
	rawLocationToUILocation(e) {
		return this.getCSSModelInfo(e.cssModel()).rawLocationToUILocation(e);
	}
	uiLocationToRawLocations(e) {
		let t = [];
		for (let n of this.#t.values()) t.push(...n.uiLocationToRawLocations(e));
		return t;
	}
}, Ut = class {
	#e;
	#t;
	#n;
	#r;
	#i;
	#a;
	constructor(e, t, n) {
		this.#e = [e.addEventListener(y.StyleSheetAdded, (e) => {
			this.styleSheetAdded(e);
		}, this), e.addEventListener(y.StyleSheetRemoved, (e) => {
			this.styleSheetRemoved(e);
		}, this)], this.#t = t, this.#n = new Bt(e, t.workspace);
		let r = e.sourceMapManager();
		this.#r = new Mt(e.target(), r, t.workspace, n), this.#i = new j(), this.#a = new j();
	}
	get locations() {
		return this.#i;
	}
	async createLiveLocation(e, t, n) {
		let r = new Wt(e, this, t, n), i = e.header();
		return i ? (r.setHeader(i), this.#i.set(i, r), await r.update()) : this.#a.set(e.url, r), r;
	}
	disposeLocation(e) {
		let t = e.header();
		t ? this.#i.delete(t, e) : this.#a.delete(e.url, e);
	}
	updateLocations(e) {
		let t = [];
		for (let n of this.#i.get(e)) t.push(n.update());
		return Promise.all(t);
	}
	async styleSheetAdded(e) {
		let t = e.data;
		if (!t.sourceURL) return;
		let n = [];
		for (let e of this.#a.get(t.sourceURL)) e.setHeader(t), this.#i.set(t, e), n.push(e.update());
		await Promise.all(n), this.#a.deleteAll(t.sourceURL);
	}
	async styleSheetRemoved(e) {
		let t = e.data, n = [];
		for (let e of this.#i.get(t)) e.setHeader(t), this.#a.set(e.url, e), n.push(e.update());
		await Promise.all(n), this.#i.deleteAll(t);
	}
	addSourceMap(e, t) {
		this.#n.addSourceMap(e, t);
	}
	rawLocationToUILocation(e) {
		let t = null;
		return t ||= this.#r.rawLocationToUILocation(e), t ||= this.#n.rawLocationToUILocation(e), t ||= this.#t.cssLocationToUILocation(e), t;
	}
	uiLocationToRawLocations(e) {
		let t = this.#r.uiLocationToRawLocations(e);
		return t.length || (t = this.#n.uiLocationToRawLocations(e), t.length) ? t : this.#t.uiLocationToCSSLocations(e);
	}
	dispose() {
		w(this.#e), this.#n.dispose(), this.#r.dispose();
	}
}, Wt = class extends q {
	url;
	#e;
	#t;
	#n;
	#r;
	constructor(e, t, n, r) {
		super(n, r), this.url = e.url, this.#e = e.lineNumber, this.#t = e.columnNumber, this.#n = t, this.#r = null;
	}
	header() {
		return this.#r;
	}
	setHeader(e) {
		this.#r = e;
	}
	async uiLocation() {
		if (!this.#r) return null;
		let e = new x(this.#r, this.#e, this.#t);
		return Ht.instance().rawLocationToUILocation(e);
	}
	dispose() {
		super.dispose(), this.#n.disposeLocation(this);
	}
}, J = {
	errorInDebuggerLanguagePlugin: "Error in debugger language plugin: {PH1}",
	loadingDebugSymbolsForVia: "[{PH1}] Loading debug symbols for {PH2} (via {PH3})…",
	loadingDebugSymbolsFor: "[{PH1}] Loading debug symbols for {PH2}…",
	loadedDebugSymbolsForButDidnt: "[{PH1}] Loaded debug symbols for {PH2}, but didn't find any source files",
	loadedDebugSymbolsForFound: "[{PH1}] Loaded debug symbols for {PH2}, found {PH3} source file(s)",
	failedToLoadDebugSymbolsFor: "[{PH1}] Failed to load debug symbols for {PH2} ({PH3})"
}, Gt = r("models/bindings/DebuggerLanguagePlugins.ts", J), Y = t.bind(void 0, Gt);
function X(e) {
	return `${e.sourceURL}@${e.hash}`;
}
function Kt(e) {
	let { script: t } = e;
	return {
		rawModuleId: X(t),
		codeOffset: e.location().columnNumber - (t.codeOffset() || 0),
		inlineFrameIndex: e.inlineFrameIndex
	};
}
var qt = class e extends Error {
	exception;
	exceptionDetails;
	constructor(e, t) {
		let { description: n } = t.exception || {};
		super(n || t.text), this.exception = e, this.exceptionDetails = t;
	}
	static makeLocal(t, n) {
		let r = {
			type: he.RemoteObjectType.Object,
			subtype: he.RemoteObjectSubtype.Error,
			description: n
		}, i = {
			text: "Uncaught",
			exceptionId: -1,
			columnNumber: 0,
			lineNumber: 0,
			exception: r
		}, a = t.debuggerModel.runtimeModel().createRemoteObject(r);
		return new e(a, i);
	}
}, Jt = class extends _ {
	get description() {
		return this.type;
	}
	get type() {
		return "namespace";
	}
};
async function Yt(e, t) {
	if (!/^(local|global|operand)$/.test(t.valueClass)) return { type: he.RemoteObjectType.Undefined };
	let n = Number(t.index), r = `${t.valueClass}s[${n}]`, i = await e.debuggerModel.agent.invoke_evaluateOnCallFrame({
		callFrameId: e.id,
		expression: r,
		silent: !0,
		generatePreview: !0,
		throwOnSideEffect: !0
	});
	return i.getError() || i.exceptionDetails ? { type: he.RemoteObjectType.Undefined } : i.result;
}
async function Xt(e, t, n) {
	if (t.type === "reftype") {
		let n = await Yt(e, t);
		return e.debuggerModel.runtimeModel().createRemoteObject(n);
	}
	return new $t(e, t, n);
}
var Zt = class extends se {
	variables;
	#e;
	#t;
	stopId;
	constructor(e, t, n) {
		super(e.debuggerModel.runtimeModel(), void 0, "object", void 0, null), this.variables = [], this.#e = e, this.#t = n, this.stopId = t;
	}
	async doGetProperties(e, t, n) {
		if (t) return {
			properties: [],
			internalProperties: []
		};
		let r = [], i = {};
		function a(e, t) {
			return new ie(e, t, !1, !1, !0, !1);
		}
		for (let e of this.variables) {
			let t;
			try {
				let n = await this.#t.evaluate(e.name, Kt(this.#e), this.stopId);
				t = n ? await Xt(this.#e, n, this.#t) : new _(void 0);
			} catch (e) {
				console.warn(e), t = new _(void 0);
			}
			if (e.nestedName && e.nestedName.length > 1) {
				let n = i;
				for (let t = 0; t < e.nestedName.length - 1; t++) {
					let r = e.nestedName[t], i = n[r];
					i || (i = new Jt({}), n[r] = i), n = i.value;
				}
				let r = e.nestedName[e.nestedName.length - 1];
				n[r] = t;
			} else r.push(a(e.name, t));
		}
		for (let e in i) r.push(a(e, i[e]));
		return {
			properties: r,
			internalProperties: []
		};
	}
}, Qt = class {
	#e;
	#t;
	#n;
	#r;
	#i;
	constructor(e, t, n, r, i, a) {
		if (i && new URL(i).protocol !== "data:") throw Error("The icon must be a data:-URL");
		this.#e = e, this.#t = n, this.#n = r, this.#r = i, this.#i = new Zt(e, t, a);
	}
	async getVariableValue(e) {
		for (let t = 0; t < this.#i.variables.length; ++t) {
			if (this.#i.variables[t].name !== e) continue;
			let n = await this.#i.getAllProperties(!1, !1);
			if (!n.properties) continue;
			let { value: r } = n.properties[t];
			if (r) return r;
		}
		return null;
	}
	callFrame() {
		return this.#e;
	}
	type() {
		return this.#t;
	}
	typeName() {
		return this.#n;
	}
	name() {}
	range() {
		return null;
	}
	object() {
		return this.#i;
	}
	description() {
		return "";
	}
	icon() {
		return this.#r;
	}
	extraProperties() {
		return [];
	}
}, $t = class extends oe {
	extensionObject;
	plugin;
	callFrame;
	constructor(e, t, n) {
		super(), this.extensionObject = t, this.plugin = n, this.callFrame = e;
	}
	get linearMemoryAddress() {
		return this.extensionObject.linearMemoryAddress;
	}
	get linearMemorySize() {
		return this.extensionObject.linearMemorySize;
	}
	get objectId() {
		return this.extensionObject.objectId;
	}
	get type() {
		return this.extensionObject.type === "array" || this.extensionObject.type === "null" ? "object" : this.extensionObject.type;
	}
	get subtype() {
		if (this.extensionObject.type === "array" || this.extensionObject.type === "null") return this.extensionObject.type;
	}
	get value() {
		return this.extensionObject.value;
	}
	unserializableValue() {}
	get description() {
		return this.extensionObject.description;
	}
	set description(e) {}
	get hasChildren() {
		return this.extensionObject.hasChildren;
	}
	get preview() {}
	get className() {
		return this.extensionObject.className ?? null;
	}
	arrayLength() {
		return 0;
	}
	arrayBufferByteLength() {
		return 0;
	}
	getOwnProperties(e, t) {
		return this.getAllProperties(!1, e, t);
	}
	async getAllProperties(e, t, n) {
		let { objectId: r } = this.extensionObject;
		if (r) {
			Me(this.plugin.getProperties);
			let e = await this.plugin.getProperties(r);
			return {
				properties: await Promise.all(e.map(async (e) => new ie(e.name, await Xt(this.callFrame, e.value, this.plugin)))),
				internalProperties: null
			};
		}
		return {
			properties: null,
			internalProperties: null
		};
	}
	release() {
		let { objectId: e } = this.extensionObject;
		e && (Me(this.plugin.releaseObject), this.plugin.releaseObject(e));
	}
	debuggerModel() {
		return this.callFrame.debuggerModel;
	}
	runtimeModel() {
		return this.callFrame.debuggerModel.runtimeModel();
	}
	isLinearMemoryInspectable() {
		return this.extensionObject.linearMemoryAddress !== void 0;
	}
}, en = class {
	#e;
	#t;
	#n;
	#r;
	#i;
	callFrameByStopId = /* @__PURE__ */ new Map();
	stopIdByCallFrame = /* @__PURE__ */ new Map();
	nextStopId = 0n;
	constructor(e, t, n) {
		this.#e = t, this.#t = n, this.#n = [], this.#r = /* @__PURE__ */ new Map(), e.observeModels(T, this), this.#i = /* @__PURE__ */ new Map();
	}
	async evaluateOnCallFrame(e, t) {
		let { script: n } = e, { expression: r, returnByValue: i, throwOnSideEffect: a } = t, { plugin: o } = await this.rawModuleIdAndPluginForScript(n);
		if (!o) return null;
		let s = Kt(e);
		if ((await o.rawLocationToSourceLocation(s)).length === 0) return null;
		if (i) return { error: "Cannot return by value" };
		if (a) return { error: "Cannot guarantee side-effect freedom" };
		try {
			let t = await o.evaluate(r, s, this.stopIdForCallFrame(e));
			return t ? { object: await Xt(e, t, o) } : { object: new _(void 0) };
		} catch (t) {
			if (t instanceof qt) {
				let { exception: e, exceptionDetails: n } = t;
				return {
					object: e,
					exceptionDetails: n
				};
			}
			let { exception: n, exceptionDetails: r } = qt.makeLocal(e, t.message);
			return {
				object: n,
				exceptionDetails: r
			};
		}
	}
	stopIdForCallFrame(e) {
		let t = this.stopIdByCallFrame.get(e);
		return t === void 0 ? (t = this.nextStopId++, this.stopIdByCallFrame.set(e, t), this.callFrameByStopId.set(t, e), t) : t;
	}
	callFrameForStopId(e) {
		return this.callFrameByStopId.get(e);
	}
	modelAdded(e) {
		this.#r.set(e, new tn(e, this.#e)), e.addEventListener(k.GlobalObjectCleared, this.globalObjectCleared, this), e.addEventListener(k.ParsedScriptSource, this.parsedScriptSource, this), e.addEventListener(k.DebuggerResumed, this.debuggerResumed, this), e.setEvaluateOnCallFrameCallback(this.evaluateOnCallFrame.bind(this));
	}
	modelRemoved(e) {
		e.removeEventListener(k.GlobalObjectCleared, this.globalObjectCleared, this), e.removeEventListener(k.ParsedScriptSource, this.parsedScriptSource, this), e.removeEventListener(k.DebuggerResumed, this.debuggerResumed, this), e.setEvaluateOnCallFrameCallback(null);
		let t = this.#r.get(e);
		t && (t.dispose(), this.#r.delete(e)), this.#i.forEach((t, n) => {
			let r = t.scripts.filter((t) => t.debuggerModel !== e);
			r.length === 0 ? (t.plugin.removeRawModule(n).catch((e) => {
				p.instance().error(Y(J.errorInDebuggerLanguagePlugin, { PH1: e.message }), !1);
			}), this.#i.delete(n)) : t.scripts = r;
		});
	}
	globalObjectCleared(e) {
		let t = e.data;
		this.modelRemoved(t), this.modelAdded(t);
	}
	addPlugin(e) {
		this.#n.push(e);
		for (let e of this.#r.keys()) for (let t of e.scripts()) this.hasPluginForScript(t) || this.parsedScriptSource({ data: t });
	}
	removePlugin(e) {
		this.#n = this.#n.filter((t) => t !== e);
		let t = /* @__PURE__ */ new Set();
		this.#i.forEach((n, r) => {
			n.plugin === e && (n.scripts.forEach((e) => t.add(e)), this.#i.delete(r));
		});
		for (let e of t) this.#r.get(e.debuggerModel).removeScript(e), this.parsedScriptSource({ data: e });
	}
	hasPluginForScript(e) {
		let t = X(e);
		return this.#i.get(t)?.scripts.includes(e) ?? !1;
	}
	async rawModuleIdAndPluginForScript(e) {
		let t = X(e), n = this.#i.get(t);
		return n && (await n.addRawModulePromise, n === this.#i.get(t)) ? {
			rawModuleId: t,
			plugin: n.plugin
		} : {
			rawModuleId: t,
			plugin: null
		};
	}
	uiSourceCodeForURL(e, t) {
		let n = this.#r.get(e);
		return n ? n.getProject().uiSourceCodeForURL(t) : null;
	}
	async rawLocationToUILocation(e) {
		let t = e.script();
		if (!t) return null;
		let { rawModuleId: n, plugin: r } = await this.rawModuleIdAndPluginForScript(t);
		if (!r) return null;
		let i = {
			rawModuleId: n,
			codeOffset: e.columnNumber - (t.codeOffset() || 0),
			inlineFrameIndex: e.inlineFrameIndex
		};
		try {
			let e = await r.rawLocationToSourceLocation(i);
			for (let n of e) {
				let e = this.uiSourceCodeForURL(t.debuggerModel, n.sourceFileURL);
				if (e) return e.uiLocation(n.lineNumber, n.columnNumber >= 0 ? n.columnNumber : void 0);
			}
		} catch (e) {
			p.instance().error(Y(J.errorInDebuggerLanguagePlugin, { PH1: e.message }), !1);
		}
		return null;
	}
	uiLocationToRawLocationRanges(e, t, n = -1) {
		let r = [];
		if (this.scriptsForUISourceCode(e).forEach((e) => {
			let t = X(e), n = this.#i.get(t);
			if (!n) return;
			let { plugin: a } = n;
			r.push(i(t, a, e));
		}), r.length === 0) return Promise.resolve(null);
		return Promise.all(r).then((e) => e.flat()).catch((e) => (p.instance().error(Y(J.errorInDebuggerLanguagePlugin, { PH1: e.message }), !1), null));
		async function i(r, i, a) {
			let o = {
				rawModuleId: r,
				sourceFileURL: e.url(),
				lineNumber: t,
				columnNumber: n
			}, s = await i.sourceLocationToRawLocation(o);
			return s ? s.map((e) => ({
				start: new E(a.debuggerModel, a.scriptId, 0, Number(e.startOffset) + (a.codeOffset() || 0)),
				end: new E(a.debuggerModel, a.scriptId, 0, Number(e.endOffset) + (a.codeOffset() || 0))
			})) : [];
		}
	}
	async uiLocationToRawLocations(e, t, n) {
		let r = await this.uiLocationToRawLocationRanges(e, t, n);
		return r ? r.map(({ start: e }) => e) : null;
	}
	async uiLocationRangeToRawLocationRanges(e, t) {
		let n = [];
		for (let r = t.startLine; r <= t.endLine; ++r) n.push(this.uiLocationToRawLocationRanges(e, r));
		let r = [];
		for (let e of await Promise.all(n)) {
			if (e === null) return null;
			for (let n of e) {
				let [e, i] = await Promise.all([this.rawLocationToUILocation(n.start), this.rawLocationToUILocation(n.end)]);
				e !== null && i !== null && (t.intersection(new M(e.lineNumber, e.columnNumber ?? 0, i.lineNumber, i.columnNumber ?? Infinity)).isEmpty() || r.push(n));
			}
		}
		return r;
	}
	async translateRawFramesStep(e, t, n) {
		let r = e[0], i = n.model(T)?.scriptForId(r.scriptId ?? "");
		if (!i) return !1;
		let a = await this.getFunctionInfo(i, r);
		if (!a) return !1;
		if (e.shift(), "frames" in a && a.frames.length) {
			let e = a.frames.map(async ({ name: e }, t) => {
				let n = new E(i.debuggerModel, i.scriptId, r.lineNumber, r.columnNumber, t);
				return s(await this.rawLocationToUILocation(n), e, r);
			});
			return t.push(await Promise.all(e)), !0;
		}
		let o = s(await this.#t.rawLocationToUILocation(new E(i.debuggerModel, i.scriptId, r.lineNumber, r.columnNumber)), r.functionName, r);
		return "missingSymbolFiles" in a && a.missingSymbolFiles.length ? t.push([{
			...o,
			missingDebugInfo: {
				type: Qe.PARTIAL_INFO,
				missingDebugFiles: a.missingSymbolFiles
			}
		}]) : t.push([{
			...o,
			missingDebugInfo: { type: Qe.NO_INFO }
		}]), !0;
		function s(e, t, n) {
			return e ? {
				uiSourceCode: e.uiSourceCode,
				name: t,
				line: e.lineNumber,
				column: e.columnNumber ?? -1
			} : {
				url: n.url,
				name: n.functionName,
				line: n.lineNumber,
				column: n.columnNumber
			};
		}
	}
	scriptsForUISourceCode(e) {
		for (let t of this.#r.values()) {
			let n = t.uiSourceCodeToScripts.get(e);
			if (n) return n;
		}
		return [];
	}
	setDebugInfoURL(e, t) {
		this.hasPluginForScript(e) || (e.debugSymbols = {
			type: A.DebugSymbolsType.ExternalDWARF,
			externalURL: t
		}, this.parsedScriptSource({ data: e }), e.debuggerModel.setDebugInfoURL(e, t));
	}
	parsedScriptSource(e) {
		let t = e.data;
		if (t.sourceURL) for (let e of this.#n) {
			if (!e.handleScript(t)) continue;
			let n = X(t), r = this.#i.get(n);
			if (r) r.scripts.push(t);
			else {
				let i = (async () => {
					let i = p.instance(), a = t.sourceURL, s = t.debugSymbols?.externalURL || "";
					s ? i.log(Y(J.loadingDebugSymbolsForVia, {
						PH1: e.name,
						PH2: a,
						PH3: s
					})) : i.log(Y(J.loadingDebugSymbolsFor, {
						PH1: e.name,
						PH2: a
					}));
					try {
						let c = !s && o(a, "wasm:") ? await t.getWasmBytecode() : void 0, l = await e.addRawModule(n, s, {
							url: a,
							code: c
						});
						if (r !== this.#i.get(n)) return [];
						if ("missingSymbolFiles" in l) {
							let t = e.createPageResourceLoadInitiator();
							return { missingSymbolFiles: l.missingSymbolFiles.map((e) => ({
								resourceUrl: e,
								initiator: t
							})) };
						}
						let u = l;
						return u.length === 0 ? i.warn(Y(J.loadedDebugSymbolsForButDidnt, {
							PH1: e.name,
							PH2: a
						})) : i.log(Y(J.loadedDebugSymbolsForFound, {
							PH1: e.name,
							PH2: a,
							PH3: u.length
						})), u;
					} catch (t) {
						return i.error(Y(J.failedToLoadDebugSymbolsFor, {
							PH1: e.name,
							PH2: a,
							PH3: t.message
						}), !1), this.#i.delete(n), [];
					}
				})();
				r = {
					rawModuleId: n,
					plugin: e,
					scripts: [t],
					addRawModulePromise: i
				}, this.#i.set(n, r);
			}
			r.addRawModulePromise.then((e) => {
				if (t.debuggerModel.scriptForId(t.scriptId) === t) {
					let n = this.#r.get(t.debuggerModel);
					n && Array.isArray(e) && n.addSourceFiles(t, e), this.#t.updateLocations(t);
				}
			});
			return;
		}
	}
	debuggerResumed(e) {
		let t = Array.from(this.callFrameByStopId.values()).filter((t) => t.debuggerModel === e.data);
		for (let e of t) {
			let t = this.stopIdByCallFrame.get(e);
			Me(t), this.stopIdByCallFrame.delete(e), this.callFrameByStopId.delete(t);
		}
	}
	getSourcesForScript(e) {
		let t = X(e), n = this.#i.get(t);
		return n ? n.addRawModulePromise : Promise.resolve(void 0);
	}
	async resolveScopeChain(e) {
		let t = e.script, { rawModuleId: n, plugin: r } = await this.rawModuleIdAndPluginForScript(t);
		if (!r) return null;
		let i = {
			rawModuleId: n,
			codeOffset: e.location().columnNumber - (t.codeOffset() || 0),
			inlineFrameIndex: e.inlineFrameIndex
		}, a = this.stopIdForCallFrame(e);
		try {
			if ((await r.rawLocationToSourceLocation(i)).length === 0) return null;
			let t = /* @__PURE__ */ new Map(), n = await r.listVariablesInScope(i);
			for (let i of n || []) {
				let n = t.get(i.scope);
				if (!n) {
					let { type: o, typeName: s, icon: c } = await r.getScopeInfo(i.scope);
					n = new Qt(e, a, o, s, c, r), t.set(i.scope, n);
				}
				n.object().variables.push(i);
			}
			return Array.from(t.values());
		} catch (e) {
			return p.instance().error(Y(J.errorInDebuggerLanguagePlugin, { PH1: e.message }), !1), null;
		}
	}
	async getFunctionInfo(e, t) {
		let { rawModuleId: n, plugin: r } = await this.rawModuleIdAndPluginForScript(e);
		if (!r) return null;
		let i = {
			rawModuleId: n,
			codeOffset: t.columnNumber - (e.codeOffset() || 0),
			inlineFrameIndex: 0
		};
		try {
			let e = await r.getFunctionInfo(i);
			if ("missingSymbolFiles" in e) {
				let t = r.createPageResourceLoadInitiator();
				return {
					missingSymbolFiles: e.missingSymbolFiles.map((e) => ({
						resourceUrl: e,
						initiator: t
					})),
					..."frames" in e && { frames: e.frames }
				};
			}
			return e;
		} catch (e) {
			return p.instance().warn(Y(J.errorInDebuggerLanguagePlugin, { PH1: e.message })), { frames: [] };
		}
	}
	async getInlinedFunctionRanges(e) {
		let t = e.script();
		if (!t) return [];
		let { rawModuleId: n, plugin: r } = await this.rawModuleIdAndPluginForScript(t);
		if (!r) return [];
		let i = {
			rawModuleId: n,
			codeOffset: e.columnNumber - (t.codeOffset() || 0)
		};
		try {
			return (await r.getInlinedFunctionRanges(i)).map((e) => ({
				start: new E(t.debuggerModel, t.scriptId, 0, Number(e.startOffset) + (t.codeOffset() || 0)),
				end: new E(t.debuggerModel, t.scriptId, 0, Number(e.endOffset) + (t.codeOffset() || 0))
			}));
		} catch (e) {
			return p.instance().warn(Y(J.errorInDebuggerLanguagePlugin, { PH1: e.message })), [];
		}
	}
	async getInlinedCalleesRanges(e) {
		let t = e.script();
		if (!t) return [];
		let { rawModuleId: n, plugin: r } = await this.rawModuleIdAndPluginForScript(t);
		if (!r) return [];
		let i = {
			rawModuleId: n,
			codeOffset: e.columnNumber - (t.codeOffset() || 0)
		};
		try {
			return (await r.getInlinedCalleesRanges(i)).map((e) => ({
				start: new E(t.debuggerModel, t.scriptId, 0, Number(e.startOffset) + (t.codeOffset() || 0)),
				end: new E(t.debuggerModel, t.scriptId, 0, Number(e.endOffset) + (t.codeOffset() || 0))
			}));
		} catch (e) {
			return p.instance().warn(Y(J.errorInDebuggerLanguagePlugin, { PH1: e.message })), [];
		}
	}
	async getMappedLines(e) {
		let t = await Promise.all(this.scriptsForUISourceCode(e).map((e) => this.rawModuleIdAndPluginForScript(e))), n = null;
		for (let { rawModuleId: r, plugin: i } of t) {
			if (!i) continue;
			let t = await i.getMappedLines(r, e.url());
			t !== void 0 && (n === null ? n = new Set(t) : t.forEach((e) => n.add(e)));
		}
		return n;
	}
}, tn = class {
	project;
	uiSourceCodeToScripts;
	constructor(e, t) {
		this.project = new W(t, "language_plugins::" + e.target().id(), B.Network, "", !1), K.setTargetForProject(this.project, e.target()), this.uiSourceCodeToScripts = /* @__PURE__ */ new Map();
	}
	addSourceFiles(e, t) {
		let n = e.createPageResourceLoadInitiator();
		for (let r of t) {
			let t = this.project.uiSourceCodeForURL(r);
			if (t) {
				let n = this.uiSourceCodeToScripts.get(t);
				n.includes(e) || n.push(e);
			} else {
				t = this.project.createUISourceCode(r, a.SourceMapScript), K.setInitialFrameAttribution(t, e.frameId), this.uiSourceCodeToScripts.set(t, [e]);
				let i = new ve(r, a.SourceMapScript, n), o = s.mimeFromURL(r) || "text/javascript";
				this.project.addUISourceCodeWithProvider(t, i, null, o);
			}
		}
	}
	removeScript(e) {
		this.uiSourceCodeToScripts.forEach((t, n) => {
			t = t.filter((t) => t !== e), t.length === 0 ? (this.uiSourceCodeToScripts.delete(n), this.project.removeUISourceCode(n.url())) : this.uiSourceCodeToScripts.set(n, t);
		});
	}
	dispose() {
		this.project.dispose();
	}
	getProject() {
		return this.project;
	}
}, nn = class e {
	#e;
	#t;
	#n;
	#r;
	#i;
	constructor(e, t, n) {
		rn.add(this), this.#e = n, this.#t = new W(t, "debugger:" + e.target().id(), B.Debugger, "", !0), this.#n = [
			e.addEventListener(k.GlobalObjectCleared, this.globalObjectCleared, this),
			e.addEventListener(k.ParsedScriptSource, this.parsedScriptSource, this),
			e.addEventListener(k.DiscardedAnonymousScriptSource, this.discardedScriptSource, this)
		], this.#r = /* @__PURE__ */ new Map(), this.#i = /* @__PURE__ */ new Map();
	}
	static createV8ScriptURL(e) {
		let t = d.extractName(e.sourceURL);
		return "debugger:///VM" + e.scriptId + (t ? " " + t : "");
	}
	static scriptForUISourceCode(e) {
		for (let t of rn) {
			let n = t.#r.get(e);
			if (n !== void 0) return n;
		}
		return null;
	}
	uiSourceCodeForScript(e) {
		return this.#i.get(e) ?? null;
	}
	rawLocationToUILocation(e) {
		let t = e.script();
		if (!t) return null;
		let n = this.#i.get(t);
		if (!n) return null;
		let { lineNumber: r, columnNumber: i } = t.rawLocationToRelativeLocation(e);
		return n.uiLocation(r, i);
	}
	uiLocationToRawLocations(e, t, n) {
		let r = this.#r.get(e);
		return r ? ({lineNumber: t, columnNumber: n} = r.relativeLocationToRawLocation({
			lineNumber: t,
			columnNumber: n
		}), [r.debuggerModel.createRawLocation(r, t, n ?? 0)]) : [];
	}
	uiLocationRangeToRawLocationRanges(e, { startLine: t, startColumn: n, endLine: r, endColumn: i }) {
		let a = this.#r.get(e);
		return a ? ({lineNumber: t, columnNumber: n} = a.relativeLocationToRawLocation({
			lineNumber: t,
			columnNumber: n
		}), {lineNumber: r, columnNumber: i} = a.relativeLocationToRawLocation({
			lineNumber: r,
			columnNumber: i
		}), [{
			start: a.debuggerModel.createRawLocation(a, t, n),
			end: a.debuggerModel.createRawLocation(a, r, i)
		}]) : [];
	}
	parsedScriptSource(t) {
		let n = t.data, r = e.createV8ScriptURL(n), i = this.#t.createUISourceCode(r, a.Script);
		n.isBreakpointCondition && i.markAsUnconditionallyIgnoreListed(), this.#r.set(i, n), this.#i.set(n, i), this.#t.addUISourceCodeWithProvider(i, n, null, "text/javascript"), this.#e.updateLocations(n);
	}
	discardedScriptSource(e) {
		let t = e.data, n = this.#i.get(t);
		n !== void 0 && (this.#i.delete(t), this.#r.delete(n), this.#t.removeUISourceCode(n.url()));
	}
	globalObjectCleared() {
		this.#i.clear(), this.#r.clear(), this.#t.reset();
	}
	dispose() {
		rn.delete(this), w(this.#n), this.globalObjectCleared(), this.#t.dispose();
	}
}, rn = /* @__PURE__ */ new Set(), an = {
	liveEditFailed: "`LiveEdit` failed: {PH1}",
	liveEditCompileFailed: "`LiveEdit` compile failed: {PH1}"
}, on = r("models/bindings/ResourceScriptMapping.ts", an), sn = t.bind(void 0, on), cn = class {
	debuggerModel;
	#e;
	debuggerWorkspaceBinding;
	#t;
	#n;
	#r;
	#i;
	constructor(e, t, n) {
		this.debuggerModel = e, this.#e = t, this.debuggerWorkspaceBinding = n, this.#t = /* @__PURE__ */ new Map(), this.#n = /* @__PURE__ */ new Map(), this.#r = /* @__PURE__ */ new Map();
		let r = e.runtimeModel();
		this.#i = [
			this.debuggerModel.addEventListener(k.ParsedScriptSource, (e) => this.addScript(e.data), this),
			this.debuggerModel.addEventListener(k.GlobalObjectCleared, this.globalObjectCleared, this),
			r.addEventListener(ye.ExecutionContextDestroyed, this.executionContextDestroyed, this),
			r.target().targetManager().addEventListener(ge.INSPECTED_URL_CHANGED, this.inspectedURLChanged, this)
		];
	}
	project(e) {
		let t = (e.isContentScript() ? "js:extensions:" : "js::") + this.debuggerModel.target().id() + ":" + e.frameId, n = this.#n.get(t);
		if (!n) {
			let r = e.isContentScript() ? B.ContentScripts : B.Network;
			n = new W(this.#e, t, r, "", !1), K.setTargetForProject(n, this.debuggerModel.target()), this.#n.set(t, n);
		}
		return n;
	}
	uiSourceCodeForScript(e) {
		return this.#r.get(e) ?? null;
	}
	rawLocationToUILocation(e) {
		let t = e.script();
		if (!t) return null;
		let n = this.#r.get(t);
		if (!n) return null;
		let r = this.#t.get(n);
		if (!r || r.hasDivergedFromVM() && !r.isMergingToVM() || r.isDivergingFromVM() || r.script !== t) return null;
		let { lineNumber: i, columnNumber: a = 0 } = e;
		return n.uiLocation(i, a);
	}
	uiLocationToRawLocations(e, t, n) {
		let r = this.#t.get(e);
		if (!r) return [];
		let { script: i } = r;
		return i ? [this.debuggerModel.createRawLocation(i, t, n)] : [];
	}
	uiLocationRangeToRawLocationRanges(e, { startLine: t, startColumn: n, endLine: r, endColumn: i }) {
		let a = this.#t.get(e);
		if (!a) return null;
		let { script: o } = a;
		return o ? [{
			start: this.debuggerModel.createRawLocation(o, t, n),
			end: this.debuggerModel.createRawLocation(o, r, i)
		}] : null;
	}
	inspectedURLChanged(e) {
		for (let t = this.debuggerModel.target(); t !== e.data; t = t.parentTarget()) if (t === null) return;
		for (let e of Array.from(this.#r.keys())) this.removeScripts([e]), this.addScript(e);
	}
	async functionBoundsAtRawLocation(e) {
		let t = e.script();
		if (!t) return null;
		let n = this.#r.get(t);
		if (!n) return null;
		let r = t ? await v(t) : null;
		if (!r) return null;
		let i = r.text.offsetFromPosition(e.lineNumber, e.columnNumber), a = [];
		(function e(t) {
			for (let n of t) i >= n.start && i < n.end && (a.push(n), e(n.children));
		})([r.scopeTree]);
		let o = a.findLast((e) => e.kind === je.FUNCTION || e.kind === je.ARROW_FUNCTION);
		if (!o) return null;
		let s = r.text.positionFromOffset(o.start), c = r.text.positionFromOffset(o.end);
		return new ft(n, new M(s.lineNumber, s.columnNumber, c.lineNumber, c.columnNumber), "");
	}
	addScript(e) {
		if (e.isLiveEdit() || e.isBreakpointCondition) return;
		let t = e.sourceURL;
		if (!t) return;
		if (e.hasSourceURL) t = ne.resolveRelativeSourceURL(e.debuggerModel.target(), t);
		else if (e.isInlineScript() || e.isContentScript() && !new d(t).isValid) return;
		let n = this.project(e), r = n.uiSourceCodeForURL(t);
		if (r) {
			let e = this.#t.get(r);
			e?.script && this.removeScripts([e.script]);
		}
		let i = e.originalContentProvider(), a = n.createUISourceCode(t, i.contentType());
		K.setInitialFrameAttribution(a, e.frameId);
		let o = Lt(this.debuggerModel.target(), e.frameId, t), s = new ln(this, a, e);
		this.#t.set(a, s), this.#r.set(e, a);
		let c = e.isWasm() ? "application/wasm" : "text/javascript";
		n.addUISourceCodeWithProvider(a, i, o, c), this.debuggerWorkspaceBinding.updateLocations(e);
	}
	scriptFile(e) {
		return this.#t.get(e) || null;
	}
	removeScripts(e) {
		let t = new j();
		for (let n of e) {
			let e = this.#r.get(n);
			if (!e) continue;
			let r = this.#t.get(e);
			r && r.dispose(), this.#t.delete(e), this.#r.delete(n), t.set(e.project(), e), this.debuggerWorkspaceBinding.updateLocations(n);
		}
		for (let e of t.keysArray()) {
			let n = t.get(e), r = !0;
			for (let t of e.uiSourceCodes()) if (!n.has(t)) {
				r = !1;
				break;
			}
			r ? (this.#n.delete(e.id()), e.removeProject()) : n.forEach((t) => e.removeUISourceCode(t.url()));
		}
	}
	executionContextDestroyed(e) {
		let t = e.data;
		this.removeScripts(this.debuggerModel.scriptsForExecutionContext(t));
	}
	globalObjectCleared() {
		let e = Array.from(this.#r.keys());
		this.removeScripts(e);
	}
	resetForTest() {
		this.globalObjectCleared();
	}
	dispose() {
		w(this.#i), this.globalObjectCleared();
	}
}, ln = class e extends i {
	#e;
	uiSourceCode;
	script;
	#t;
	#n;
	#r;
	#i;
	#a = new Ne();
	constructor(e, t, n) {
		super(), this.#e = e, this.uiSourceCode = t, this.script = this.uiSourceCode.contentType().isScript() ? n : null, this.uiSourceCode.addEventListener(I.WorkingCopyChanged, this.workingCopyChanged, this), this.uiSourceCode.addEventListener(I.WorkingCopyCommitted, this.workingCopyCommitted, this);
	}
	isDiverged() {
		if (this.uiSourceCode.isDirty()) return !0;
		if (!this.script || this.#t === void 0 || this.#t === null) return !1;
		let e = this.uiSourceCode.workingCopy();
		if (!e) return !1;
		if (!e.startsWith(this.#t.trimEnd())) return !0;
		let t = this.uiSourceCode.workingCopy().substr(this.#t.length);
		return !!t.length && !t.match(de);
	}
	workingCopyChanged() {
		this.update();
	}
	workingCopyCommitted() {
		if (be.devToolsLiveEdit?.enabled === !1 || this.uiSourceCode.project().canSetFileContent() || !this.script) return;
		let e = this.uiSourceCode.workingCopy();
		this.script.editSource(e).then(({ status: t, exceptionDetails: n }) => {
			this.scriptSourceWasSet(e, t, n);
		});
	}
	async scriptSourceWasSet(e, t, n) {
		if (t === A.SetScriptSourceResponseStatus.Ok && (this.#t = e), await this.update(), t === A.SetScriptSourceResponseStatus.Ok) return;
		if (!n) {
			p.instance().addMessage(sn(an.liveEditFailed, { PH1: i(t) }), f.WARNING);
			return;
		}
		let r = sn(an.liveEditCompileFailed, { PH1: n.text });
		this.uiSourceCode.addLineMessage(R.Level.ERROR, r, n.lineNumber, n.columnNumber);
		function i(e) {
			switch (e) {
				case A.SetScriptSourceResponseStatus.BlockedByActiveFunction: return "Functions that are on the stack (currently being executed) can not be edited";
				case A.SetScriptSourceResponseStatus.BlockedByActiveGenerator: return "Async functions/generators that are active can not be edited";
				case A.SetScriptSourceResponseStatus.BlockedByTopLevelEsModuleChange: return "The top-level of ES modules can not be edited";
				case A.SetScriptSourceResponseStatus.CompileError:
				case A.SetScriptSourceResponseStatus.Ok: throw Error("Compile errors and Ok status must not be reported on the console");
			}
		}
	}
	async update() {
		let e = await this.#a.acquire(), t = this.isDiverged();
		t && !this.#r ? await this.divergeFromVM() : !t && this.#r && await this.mergeToVM(), e();
	}
	async divergeFromVM() {
		this.script && (this.#n = !0, await this.#e.debuggerWorkspaceBinding.updateLocations(this.script), this.#n = void 0, this.#r = !0, this.dispatchEventToListeners(e.Events.DID_DIVERGE_FROM_VM));
	}
	async mergeToVM() {
		this.script && (this.#r = void 0, this.#i = !0, await this.#e.debuggerWorkspaceBinding.updateLocations(this.script), this.#i = void 0, this.dispatchEventToListeners(e.Events.DID_MERGE_TO_VM));
	}
	hasDivergedFromVM() {
		return !!this.#r;
	}
	isDivergingFromVM() {
		return !!this.#n;
	}
	isMergingToVM() {
		return !!this.#i;
	}
	checkMapping() {
		if (!this.script || this.#t !== void 0) {
			this.mappingCheckedForTest();
			return;
		}
		this.script.requestContentData().then((e) => {
			this.#t = N.textOr(e, null), this.update().then(() => this.mappingCheckedForTest());
		});
	}
	mappingCheckedForTest() {}
	dispose() {
		this.uiSourceCode.removeEventListener(I.WorkingCopyChanged, this.workingCopyChanged, this), this.uiSourceCode.removeEventListener(I.WorkingCopyCommitted, this.workingCopyCommitted, this);
	}
	addSourceMapURL(e) {
		this.script && this.script.debuggerModel.setSourceMapURL(this.script, e);
	}
	addDebugInfoURL(e) {
		if (!this.script) return;
		let { pluginManager: t } = hn.instance();
		t.setDebugInfoURL(this.script, e);
	}
	hasSourceMapURL() {
		return !!this.script?.sourceMapURL;
	}
	async missingSymbolFiles() {
		if (!this.script) return null;
		let { pluginManager: e } = this.#e.debuggerWorkspaceBinding, t = await e.getSourcesForScript(this.script);
		return t && "missingSymbolFiles" in t ? t.missingSymbolFiles : null;
	}
};
(function(e) {
	e.Events = /* @__PURE__ */ function(e) {
		return e.DID_MERGE_TO_VM = "DidMergeToVM", e.DID_DIVERGE_FROM_VM = "DidDivergeFromVM", e;
	}({});
})(ln ||= {});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/bindings/SymbolizedError.ts
function un(e) {
	return /\n\s*at\s/.test(e) || e.startsWith("SyntaxError:");
}
var dn = class e extends i {
	errorStack;
	cause;
	constructor(e, t) {
		super(), this.errorStack = e, this.cause = t, this.cause?.addEventListener("UPDATED", this.#e, this);
	}
	dispose() {
		this.cause?.removeEventListener("UPDATED", this.#e, this), (this.cause instanceof fn || this.cause instanceof e) && this.cause.dispose();
	}
	#e() {
		this.dispatchEventToListeners("UPDATED");
	}
}, fn = class e extends i {
	message;
	stackTrace;
	cause;
	constructor(e, t, n) {
		super(), this.message = e, this.stackTrace = t, this.cause = n, this.stackTrace.addEventListener($e.UPDATED, this.#e, this), this.cause?.addEventListener("UPDATED", this.#e, this);
	}
	dispose() {
		this.stackTrace.removeEventListener($e.UPDATED, this.#e, this), this.cause?.removeEventListener("UPDATED", this.#e, this), (this.cause instanceof e || this.cause instanceof dn) && this.cause.dispose();
	}
	#e() {
		this.dispatchEventToListeners("UPDATED");
	}
}, pn = class e extends i {
	message;
	#e = null;
	constructor(e) {
		super(), this.message = e;
	}
	get uiLocation() {
		return this.#e;
	}
	static async fromExceptionDetails(t, n, r) {
		let { exception: i, scriptId: a, lineNumber: o, columnNumber: s } = r;
		if (!i || i.subtype !== "error" || i.className !== "SyntaxError") throw Error("SymbolizedSyntaxError.fromExceptionDetails expects a SyntaxError");
		if (!a) return null;
		let c = t.model(T);
		if (!c) return null;
		let l = c.createRawLocationByScriptId(a, o, s), u = new e(i.description || "");
		return await n.createLiveLocation(l, u.#t.bind(u), new jt()), u;
	}
	async #t(e) {
		this.#e = await e.uiLocation(), this.dispatchEventToListeners("UPDATED");
	}
}, mn = /* @__PURE__ */ function(e) {
	return e.UPDATED = "UPDATED", e;
}({}), hn = class e {
	resourceMapping;
	#e;
	#t;
	pluginManager;
	ignoreListManager;
	workspace;
	constructor(e, t, n, r) {
		this.resourceMapping = e, this.resourceMapping.debuggerWorkspaceBinding = this, this.ignoreListManager = n, this.workspace = r, this.#e = /* @__PURE__ */ new Map(), t.observeModels(T, this), this.ignoreListManager.addEventListener(bt.IGNORED_SCRIPT_RANGES_UPDATED, (e) => this.updateLocations(e.data)), this.#t = /* @__PURE__ */ new Set(), this.pluginManager = new en(t, e.workspace, this);
	}
	setFunctionRanges(e, t) {
		for (let n of this.#e.values()) n.compilerMapping.setFunctionRanges(e, t);
	}
	static instance(t = {
		forceNew: null,
		resourceMapping: null,
		targetManager: null,
		ignoreListManager: null,
		workspace: null
	}) {
		let { forceNew: n, resourceMapping: r, targetManager: i, ignoreListManager: a, workspace: o } = t;
		if (n) {
			if (!r || !i || !a || !o) throw Error(`Unable to create DebuggerWorkspaceBinding: resourceMapping, targetManager and IgnoreLIstManager must be provided: ${(/* @__PURE__ */ Error()).stack}`);
			u().set(e, new e(r, i, a, o));
		}
		return u().get(e);
	}
	static removeInstance() {
		u().delete(e);
	}
	async computeAutoStepRanges(e, t) {
		function n(e, t) {
			let { start: n, end: r } = t;
			return !(n.scriptId !== e.scriptId || e.lineNumber < n.lineNumber || e.lineNumber > r.lineNumber || e.lineNumber === n.lineNumber && e.columnNumber < n.columnNumber || e.lineNumber === r.lineNumber && e.columnNumber >= r.columnNumber);
		}
		let r = t.location();
		if (!r) return [];
		let i = this.pluginManager, a = [];
		if (e === le.STEP_OUT) return await i.getInlinedFunctionRanges(r);
		let o = await i.rawLocationToUILocation(r);
		if (o) return a = await i.uiLocationToRawLocationRanges(o.uiSourceCode, o.lineNumber, o.columnNumber) || [], a = a.filter((e) => n(r, e)), e === le.STEP_OVER && (a = a.concat(await i.getInlinedCalleesRanges(r))), a;
		let s = this.#e.get(r.debuggerModel)?.compilerMapping;
		return s ? (a = s.getLocationRangesForSameSourceLocation(r), a = a.filter((e) => n(r, e)), a) : [];
	}
	modelAdded(e) {
		e.setBeforePausedCallback(this.shouldPause.bind(this)), this.#e.set(e, new gn(e, this)), e.setComputeAutoStepRangesCallback(this.computeAutoStepRanges.bind(this));
	}
	modelRemoved(e) {
		e.setComputeAutoStepRangesCallback(null);
		let t = this.#e.get(e);
		t && (t.dispose(), this.#e.delete(e));
	}
	async pendingLiveLocationChangesPromise() {
		await Promise.all(this.#t);
	}
	recordLiveLocationChange(e) {
		e.then(() => {
			this.#t.delete(e);
		}), this.#t.add(e);
	}
	async updateLocations(e) {
		let t = e.target().model(P)?.scriptInfoChanged(e, this.#n.bind(this));
		t && this.recordLiveLocationChange(t);
		let n = [t], r = this.#e.get(e.debuggerModel);
		if (r) {
			let t = r.updateLocations(e);
			this.recordLiveLocationChange(t), n.push(t);
		}
		await Promise.all(n);
	}
	async createStackTraceFromProtocolRuntime(e, t) {
		let n = t.model(P).createFromProtocolRuntime(e, this.#n.bind(this));
		return this.recordLiveLocationChange(n), await n;
	}
	async createStackTraceFromDebuggerPaused(e, t) {
		let n = t.model(P).createFromDebuggerPaused(e, this.#n.bind(this));
		return this.recordLiveLocationChange(n), await n;
	}
	async createStackTraceFromErrorStackLikeString(e, t, n) {
		let r = e.model(P).createFromErrorStackLikeString(t, this.#n.bind(this), n);
		return this.recordLiveLocationChange(r), await r;
	}
	async createSymbolizedError(e, t) {
		let n = "", r, i = t;
		if (e.subtype === "error") {
			let a = ee.objectAsError(e);
			n = a.errorStack;
			let [o, s] = await Promise.all([t ? Promise.resolve(t) : a.exceptionDetails(), a.cause()]);
			if (i = o, r = s, e.className === "SyntaxError" && i) {
				let t = await pn.fromExceptionDetails(e.runtimeModel().target(), this, i);
				if (t) return t;
			}
		} else if (e.type === "string") {
			if (n = e.description || "", !un(n)) return null;
		} else return null;
		let [a, o] = await Promise.all([this.createStackTraceFromErrorStackLikeString(e.runtimeModel().target(), n, i), r ? this.createSymbolizedError(r) : Promise.resolve(null)]), s = i?.exceptionMetaData?.issueSummary;
		return typeof s == "string" && (n = qe(n, s)), a ? new fn(Le(n), a, o) : new dn(n, o);
	}
	async createLiveLocation(e, t, n) {
		let r = this.#e.get(e.debuggerModel);
		if (!r) return null;
		let i = r.createLiveLocation(e, t, n);
		return this.recordLiveLocationChange(i), await i;
	}
	async createStackTraceTopFrameLiveLocation(e, t, n) {
		console.assert(e.length > 0);
		let r = vn.createStackTraceTopFrameLocation(e, this, t, n);
		return this.recordLiveLocationChange(r), await r;
	}
	async rawLocationToUILocation(e) {
		let t = await this.pluginManager.rawLocationToUILocation(e);
		if (t) return t;
		let n = this.#e.get(e.debuggerModel);
		return n ? n.rawLocationToUILocation(e) : null;
	}
	uiSourceCodeForSourceMapSourceURL(e, t, n) {
		let r = this.#e.get(e);
		return r ? r.compilerMapping.uiSourceCodeForURL(t, n) : null;
	}
	async uiSourceCodeForSourceMapSourceURLPromise(e, t, n) {
		return await (this.uiSourceCodeForSourceMapSourceURL(e, t, n) || this.waitForUISourceCodeAdded(t, e.target()));
	}
	async uiSourceCodeForDebuggerLanguagePluginSourceURLPromise(e, t) {
		return await (this.pluginManager.uiSourceCodeForURL(e, t) || this.waitForUISourceCodeAdded(t, e.target()));
	}
	uiSourceCodeForScript(e) {
		let t = this.#e.get(e.debuggerModel);
		return t ? t.uiSourceCodeForScript(e) : null;
	}
	waitForUISourceCodeAdded(e, t) {
		return new Promise((n) => {
			let r = this.workspace.addEventListener(V.UISourceCodeAdded, (i) => {
				let a = i.data;
				a.url() === e && K.targetForUISourceCode(a) === t && (this.workspace.removeEventListener(V.UISourceCodeAdded, r.listener), n(a));
			});
		});
	}
	async uiLocationToRawLocations(e, t, n) {
		let r = await this.pluginManager.uiLocationToRawLocations(e, t, n);
		if (r) return r;
		for (let r of this.#e.values()) {
			let i = r.uiLocationToRawLocations(e, t, n);
			if (i.length) return i;
		}
		return [];
	}
	async uiLocationRangeToRawLocationRanges(e, t) {
		let n = await this.pluginManager.uiLocationRangeToRawLocationRanges(e, t);
		if (n) return n;
		for (let n of this.#e.values()) {
			let r = n.uiLocationRangeToRawLocationRanges(e, t);
			if (r) return r;
		}
		return [];
	}
	async functionBoundsAtRawLocation(e) {
		let t = this.#e.get(e.debuggerModel);
		return t ? await t.functionBoundsAtRawLocation(e) : null;
	}
	async normalizeUILocation(e) {
		let t = await this.uiLocationToRawLocations(e.uiSourceCode, e.lineNumber, e.columnNumber);
		for (let e of t) {
			let t = await this.rawLocationToUILocation(e);
			if (t) return t;
		}
		return e;
	}
	async getMappedLines(e) {
		for (let t of this.#e.values()) {
			let n = t.getMappedLines(e);
			if (n !== null) return n;
		}
		return await this.pluginManager.getMappedLines(e);
	}
	scriptFile(e, t) {
		let n = this.#e.get(t);
		return n ? n.getResourceScriptMapping().scriptFile(e) : null;
	}
	scriptsForUISourceCode(e) {
		let t = /* @__PURE__ */ new Set();
		this.pluginManager.scriptsForUISourceCode(e).forEach((e) => t.add(e));
		for (let n of this.#e.values()) {
			let r = n.getResourceScriptMapping().scriptFile(e);
			r?.script && t.add(r.script), n.compilerMapping.scriptsForUISourceCode(e).forEach((e) => t.add(e));
		}
		return [...t];
	}
	supportsConditionalBreakpoints(e) {
		return this.pluginManager.scriptsForUISourceCode(e).every((e) => e.isJavaScript());
	}
	resetForTest(e) {
		let t = e.model(T), n = this.#e.get(t);
		n && n.getResourceScriptMapping().resetForTest();
	}
	removeLiveLocation(e) {
		let t = this.#e.get(e.rawLocation.debuggerModel);
		t && t.disposeLocation(e);
	}
	async shouldPause(e, t) {
		let { callFrames: [n] } = e;
		if (!n) return !1;
		let r = n.functionLocation();
		return !t || e.reason !== A.PausedEventReason.Step || !r || !n.script.isWasm() || !l("wasm-auto-stepping").get() || !this.pluginManager.hasPluginForScript(n.script) || await this.pluginManager.rawLocationToUILocation(n.location()) ? !0 : t.script() !== r.script() || t.columnNumber !== r.columnNumber || t.lineNumber !== r.lineNumber;
	}
	async #n(e, t) {
		let n = e.slice(0), r = [];
		for (; n.length;) await this.#r(n, r, t);
		return r;
	}
	async #r(e, t, n) {
		if (await this.pluginManager.translateRawFramesStep(e, t, n)) return;
		let r = this.#e.get(n.model(T));
		if (r) {
			await r.translateRawFramesStep(e, t);
			return;
		}
		let { url: i, lineNumber: a, columnNumber: o, functionName: s } = e.shift();
		t.push([{
			url: i,
			line: a,
			column: o,
			name: s
		}]);
	}
}, gn = class {
	#e;
	#t;
	#n;
	#r;
	#i;
	compilerMapping;
	#a;
	constructor(e, t) {
		this.#e = e, this.#t = t;
		let { workspace: n } = t.resourceMapping;
		this.#n = new nn(e, n, t), this.#r = t.resourceMapping, this.#i = new cn(e, n, t), this.compilerMapping = new At(e, n, t), this.#a = new j();
	}
	async createLiveLocation(e, t, n) {
		console.assert(e.scriptId !== "");
		let r = e.scriptId, i = new _n(r, e, this.#t, t, n);
		return this.#a.set(r, i), await i.update(), i;
	}
	disposeLocation(e) {
		this.#a.delete(e.scriptId, e);
	}
	async updateLocations(e) {
		let t = [];
		for (let n of this.#a.get(e.scriptId)) t.push(n.update());
		await Promise.all(t);
	}
	rawLocationToUILocation(e) {
		let t = this.compilerMapping.rawLocationToUILocation(e);
		return t ||= this.#i.rawLocationToUILocation(e), t ||= this.#r.jsLocationToUILocation(e), t ||= this.#n.rawLocationToUILocation(e), t;
	}
	uiSourceCodeForScript(e) {
		let t = null;
		return t ||= this.#i.uiSourceCodeForScript(e), t ||= this.#r.uiSourceCodeForScript(e), t ||= this.#n.uiSourceCodeForScript(e), t;
	}
	uiLocationToRawLocations(e, t, n = 0) {
		let r = this.compilerMapping.uiLocationToRawLocations(e, t, n);
		return r = r.length ? r : this.#i.uiLocationToRawLocations(e, t, n), r = r.length ? r : this.#r.uiLocationToJSLocations(e, t, n), r = r.length ? r : this.#n.uiLocationToRawLocations(e, t, n), r;
	}
	uiLocationRangeToRawLocationRanges(e, t) {
		let n = this.compilerMapping.uiLocationRangeToRawLocationRanges(e, t);
		return n ??= this.#i.uiLocationRangeToRawLocationRanges(e, t), n ??= this.#r.uiLocationRangeToJSLocationRanges(e, t), n ??= this.#n.uiLocationRangeToRawLocationRanges(e, t), n;
	}
	async functionBoundsAtRawLocation(e) {
		let t = null;
		return t ||= await this.compilerMapping.functionBoundsAtRawLocation(e), t ||= await this.#i.functionBoundsAtRawLocation(e), t ||= await this.#r.functionBoundsAtRawLocation(e), t;
	}
	async translateRawFramesStep(e, t) {
		await this.compilerMapping.translateRawFramesStep(e, t) || this.#o(e, t);
	}
	#o(e, t) {
		let { scriptId: n, url: r, lineNumber: i, columnNumber: a, functionName: o } = e.shift(), s = n ? this.#e.createRawLocationByScriptId(n, i, a) : r ? this.#e.createRawLocationByURL(r, i, a) : null;
		if (s) {
			let e = this.rawLocationToUILocation(s);
			if (e) {
				t.push([{
					uiSourceCode: e.uiSourceCode,
					name: o,
					line: e.lineNumber,
					column: e.columnNumber ?? -1
				}]);
				return;
			}
		}
		t.push([{
			url: r,
			line: i,
			column: a,
			name: o
		}]);
	}
	getMappedLines(e) {
		return this.compilerMapping.getMappedLines(e);
	}
	dispose() {
		this.#e.setBeforePausedCallback(null), this.compilerMapping.dispose(), this.#i.dispose(), this.#n.dispose();
	}
	getResourceScriptMapping() {
		return this.#i;
	}
}, _n = class extends q {
	scriptId;
	rawLocation;
	#e;
	constructor(e, t, n, r, i) {
		super(r, i), this.scriptId = e, this.rawLocation = t, this.#e = n;
	}
	async uiLocation() {
		let e = this.rawLocation;
		return await this.#e.rawLocationToUILocation(e);
	}
	dispose() {
		super.dispose(), this.#e.removeLiveLocation(this);
	}
}, vn = class e extends q {
	#e;
	#t;
	#n;
	constructor(e, t) {
		super(e, t), this.#e = !0, this.#t = null, this.#n = null;
	}
	static async createStackTraceTopFrameLocation(t, n, r, i) {
		let a = new e(r, i), o = t.map((e) => n.createLiveLocation(e, a.scheduleUpdate.bind(a), i));
		return a.#n = (await Promise.all(o)).filter((e) => !!e), await a.updateLocation(), a;
	}
	async uiLocation() {
		return this.#t ? await this.#t.uiLocation() : null;
	}
	dispose() {
		if (super.dispose(), this.#n) for (let e of this.#n) e.dispose();
		this.#n = null, this.#t = null;
	}
	async scheduleUpdate() {
		this.#e || (this.#e = !0, queueMicrotask(() => {
			this.updateLocation();
		}));
	}
	async updateLocation() {
		if (this.#e = !1, this.#n && this.#n.length !== 0) {
			this.#t = this.#n[0];
			for (let e of this.#n) if (!(await e.uiLocation())?.isIgnoreListed()) {
				this.#t = e;
				break;
			}
			this.update();
		}
	}
}, yn = class {
	#e;
	#t;
	#n;
	#r;
	#i;
	#a;
	#o;
	#s;
	#c;
	#l;
	#u;
	#d;
	constructor(e, t, n) {
		this.#e = e, this.#t = e.size, this.#n = 0, this.#i = t || Number.MAX_VALUE, this.#a = n, this.#o = new TextDecoder(), this.#s = !1, this.#c = null, this.#r = null;
	}
	async read(e) {
		if (this.#a && this.#a(this), this.#e?.type.endsWith("gzip")) {
			let e = this.#e.stream(), t = ue(e);
			this.#r = t.getReader();
		} else this.#d = new FileReader(), this.#d.onload = this.onChunkLoaded.bind(this), this.#d.onerror = this.onError.bind(this);
		return this.#u = e, this.loadChunk(), await new Promise((e) => {
			this.#l = e;
		});
	}
	cancel() {
		this.#s = !0;
	}
	loadedSize() {
		return this.#n;
	}
	fileSize() {
		return this.#t;
	}
	fileName() {
		return this.#e ? this.#e.name : "";
	}
	error() {
		return this.#c;
	}
	onChunkLoaded(e) {
		if (this.#s || e.target.readyState !== FileReader.DONE || !this.#d) return;
		let t = this.#d.result;
		this.#n += t.byteLength;
		let n = this.#n === this.#t;
		this.decodeChunkBuffer(t, n);
	}
	async decodeChunkBuffer(e, t) {
		if (!this.#u) return;
		let n = this.#o.decode(e, { stream: !t });
		if (await this.#u.write(n, t), !this.#s) {
			if (this.#a && this.#a(this), t) {
				this.finishRead();
				return;
			}
			this.loadChunk();
		}
	}
	async finishRead() {
		this.#u && (this.#e = null, this.#d = null, await this.#u.close(), this.#l(!this.#c));
	}
	async loadChunk() {
		if (this.#u && this.#e) {
			if (this.#r) {
				let { value: e, done: t } = await this.#r.read();
				if (t || !e) return await this.#u.write("", !0), await this.finishRead();
				this.decodeChunkBuffer(e.buffer, !1);
			}
			if (this.#d) {
				let e = this.#n, t = Math.min(this.#t, e + this.#i), n = this.#e.slice(e, t);
				this.#d.readAsArrayBuffer(n);
			}
		}
	}
	onError(e) {
		let t = e.target;
		this.#c = t.error, this.#l(!1);
	}
}, bn = class {
	#e;
	#t;
	#n;
	constructor() {
		this.#e = [];
	}
	async open(e) {
		this.#n = !1, this.#e = [], this.#t = e;
		let t = await F.instance().save(this.#t, Se, !0);
		return t && F.instance().addEventListener(ot.APPENDED_TO_URL, this.onAppendDone, this), !!t;
	}
	write(e) {
		return new Promise((t) => {
			this.#e.push(t), F.instance().append(this.#t, e);
		});
	}
	async close() {
		this.#n = !0, !this.#e.length && (F.instance().removeEventListener(ot.APPENDED_TO_URL, this.onAppendDone, this), F.instance().close(this.#t));
	}
	onAppendDone(e) {
		if (e.data !== this.#t) return;
		let t = this.#e.shift();
		t && t(), !this.#e.length && this.#n && (F.instance().removeEventListener(ot.APPENDED_TO_URL, this.onAppendDone, this), F.instance().close(this.#t));
	}
}, xn = class {
	#e = /* @__PURE__ */ new WeakMap();
	constructor() {
		D.instance().observeModels(T, this), D.instance().observeModels(O, this);
	}
	modelAdded(e) {
		let t = e.target(), n = this.#e.get(t) ?? new Cn();
		e instanceof T ? n.setDebuggerModel(e) : n.setCSSModel(e), this.#e.set(t, n);
	}
	modelRemoved(e) {
		let t = e.target();
		this.#e.get(t)?.clear();
	}
	addMessage(e, t, n) {
		this.#e.get(n)?.addMessage(e, t);
	}
	clear() {
		for (let e of D.instance().targets()) this.#e.get(e)?.clear();
	}
}, Sn = class {
	#e = new xn();
	constructor() {
		D.instance().addModelListener(ce, ae.MessageAdded, (e) => this.consoleMessageAdded(e.data)), ce.allMessagesUnordered().forEach(this.consoleMessageAdded, this), D.instance().addModelListener(ce, ae.ConsoleCleared, () => this.#e.clear());
	}
	consoleMessageAdded(e) {
		let t = e.runtimeModel();
		if (!e.isErrorOrWarning() || !e.runtimeModel() || e.source === m.LogEntrySource.Violation || !t) return;
		let n = e.level === m.LogEntryLevel.Error ? R.Level.ERROR : R.Level.WARNING;
		this.#e.addMessage(new R(n, e.messageText), e, t.target());
	}
}, Cn = class {
	#e;
	#t;
	#n = /* @__PURE__ */ new Map();
	#r;
	constructor() {
		this.#r = new jt(), gt.instance().addEventListener(V.UISourceCodeAdded, this.#c.bind(this));
	}
	setDebuggerModel(e) {
		if (this.#e) throw Error("Cannot set DebuggerModel twice");
		this.#e = e, e.addEventListener(k.ParsedScriptSource, (e) => {
			queueMicrotask(() => {
				this.#s(e);
			});
		}), e.addEventListener(k.GlobalObjectCleared, this.#u, this);
	}
	setCSSModel(e) {
		if (this.#t) throw Error("Cannot set CSSModel twice");
		this.#t = e, e.addEventListener(y.StyleSheetAdded, (e) => queueMicrotask(() => this.#l(e)));
	}
	async addMessage(e, t) {
		let n = new Tn(e, this.#r), r = this.#o(t) ?? this.#a(t) ?? this.#i(t);
		if (r && await n.updateLocationSource(r), t.url) {
			let e = this.#n.get(t.url);
			e || (e = [], this.#n.set(t.url, e)), e.push({
				source: t,
				presentation: n
			});
		}
	}
	#i(e) {
		if (!e.url) return null;
		let t = gt.instance().uiSourceCodeForURL(e.url);
		return t ? new L(t, e.line, e.column) : null;
	}
	#a(e) {
		return !this.#t || !e.url ? null : this.#t.createRawLocationsByURL(e.url, e.line, e.column)[0] ?? null;
	}
	#o(e) {
		if (!this.#e) return null;
		if (e.scriptId) return this.#e.createRawLocationByScriptId(e.scriptId, e.line, e.column);
		let t = e.stackTrace?.callFrames ? e.stackTrace.callFrames[0] : null;
		return t ? this.#e.createRawLocationByScriptId(t.scriptId, t.lineNumber, t.columnNumber) : e.url ? this.#e.createRawLocationByURL(e.url, e.line, e.column) : null;
	}
	#s(e) {
		let t = e.data, n = this.#n.get(t.sourceURL), r = [];
		for (let { presentation: e, source: i } of n ?? []) {
			let n = this.#o(i);
			n && t.scriptId === n.scriptId && r.push(e.updateLocationSource(n));
		}
		Promise.all(r).then(this.parsedScriptSourceForTest.bind(this));
	}
	parsedScriptSourceForTest() {}
	#c(e) {
		let t = e.data, n = this.#n.get(t.url()), r = [];
		for (let { presentation: e, source: i } of n ?? []) r.push(e.updateLocationSource(new L(t, i.line, i.column)));
		Promise.all(r).then(this.uiSourceCodeAddedForTest.bind(this));
	}
	uiSourceCodeAddedForTest() {}
	#l(e) {
		let t = e.data, n = this.#n.get(t.sourceURL), r = [];
		for (let { source: e, presentation: i } of n ?? []) t.containsLocation(e.line, e.column) && r.push(i.updateLocationSource(new x(t, e.line, e.column)));
		Promise.all(r).then(this.styleSheetAddedForTest.bind(this));
	}
	styleSheetAddedForTest() {}
	clear() {
		this.#u();
	}
	#u() {
		let e = Array.from(this.#n.values()).flat();
		for (let { presentation: t } of e) t.dispose();
		this.#n.clear(), this.#r.disposeAll();
	}
}, wn = class extends q {
	#e;
	constructor(e, t, n) {
		super(t, n), this.#e = e;
	}
	async uiLocation() {
		return this.#e;
	}
}, Tn = class {
	#e;
	#t;
	#n;
	#r;
	constructor(e, t) {
		this.#r = e, this.#n = t;
	}
	async updateLocationSource(e) {
		e instanceof E ? await hn.instance().createLiveLocation(e, this.#i.bind(this), this.#n) : e instanceof x ? await Ht.instance().createLiveLocation(e, this.#i.bind(this), this.#n) : e instanceof L && (this.#t || (this.#t = new wn(e, this.#i.bind(this), this.#n), await this.#t.update()));
	}
	async #i(e) {
		this.#e && this.#e.removeMessage(this.#r), e !== this.#t && (this.#e?.removeMessage(this.#r), this.#t?.dispose(), this.#t = e);
		let t = await e.uiLocation();
		t && (this.#r.range = M.createFromLocation(t.lineNumber, t.columnNumber || 0), this.#e = t.uiSourceCode, this.#e.addMessage(this.#r));
	}
	dispose() {
		this.#e?.removeMessage(this.#r), this.#t?.dispose();
	}
}, En = /* @__PURE__ */ new WeakMap(), Z = /* @__PURE__ */ new WeakMap(), Q = /* @__PURE__ */ new WeakSet();
function $(e) {
	return new M(e.lineOffset, e.columnOffset, e.endLine, e.endColumn);
}
function Dn(e) {
	return new M(e.startLine, e.startColumn, e.endLine, e.endColumn);
}
var On = class {
	workspace;
	#e = /* @__PURE__ */ new Map();
	#t = null;
	#n = null;
	constructor(e, t) {
		this.workspace = t, e.observeModels(S, this);
	}
	get debuggerWorkspaceBinding() {
		return this.#t;
	}
	set debuggerWorkspaceBinding(e) {
		if (this.#t) throw Error("DebuggerWorkspaceBinding already set");
		this.#t = e;
	}
	get cssWorkspaceBinding() {
		return this.#n;
	}
	set cssWorkspaceBinding(e) {
		if (this.#n) throw Error("CSSWorkspaceBinding already set");
		this.#n = e;
	}
	modelAdded(e) {
		let t = new kn(this, e);
		this.#e.set(e, t);
	}
	modelRemoved(e) {
		let t = this.#e.get(e);
		t && (t.dispose(), this.#e.delete(e));
	}
	infoForTarget(e) {
		let t = e.model(S);
		return t && this.#e.get(t) || null;
	}
	uiSourceCodeForScript(e) {
		let t = this.infoForTarget(e.debuggerModel.target());
		return t ? t.getProject().uiSourceCodeForURL(e.sourceURL) : null;
	}
	cssLocationToUILocation(e) {
		let t = e.header();
		if (!t) return null;
		let n = this.infoForTarget(e.cssModel().target());
		if (!n) return null;
		let r = n.getProject().uiSourceCodeForURL(e.url);
		if (!r) return null;
		let i = En.get(t) ?? Dn(t), a = e.lineNumber + i.startLine - t.startLine, o = e.columnNumber;
		return e.lineNumber === t.startLine && (o += i.startColumn - t.startColumn), r.uiLocation(a, o);
	}
	jsLocationToUILocation(e) {
		let t = e.script();
		if (!t) return null;
		let n = this.infoForTarget(e.debuggerModel.target());
		if (!n) return null;
		let r = t.embedderName();
		if (!r) return null;
		let i = n.getProject().uiSourceCodeForURL(r);
		if (!i) return null;
		let { startLine: a, startColumn: o } = Z.get(t) ?? $(t), { lineNumber: s, columnNumber: c } = e;
		return s === t.lineOffset && (c += o - t.columnOffset), s += a - t.lineOffset, t.hasSourceURL && (s === 0 && (c += t.columnOffset), s += t.lineOffset), i.uiLocation(s, c);
	}
	uiLocationToJSLocations(e, t, n) {
		if (!Q.has(e)) return [];
		let r = K.targetForUISourceCode(e);
		if (!r) return [];
		let i = r.model(T);
		if (!i) return [];
		let a = [];
		for (let r of i.scripts()) {
			if (r.embedderName() !== e.url()) continue;
			let o = Z.get(r) ?? $(r);
			if (!o.containsLocation(t, n)) continue;
			let s = t, c = n;
			r.hasSourceURL && (s -= o.startLine, s === 0 && (c -= o.startColumn)), a.push(i.createRawLocation(r, s, c));
		}
		return a;
	}
	uiLocationRangeToJSLocationRanges(e, t) {
		if (!Q.has(e)) return null;
		let n = K.targetForUISourceCode(e);
		if (!n) return null;
		let r = n.model(T);
		if (!r) return null;
		let i = [];
		for (let n of r.scripts()) {
			if (n.embedderName() !== e.url()) continue;
			let a = (Z.get(n) ?? $(n)).intersection(t);
			if (a.isEmpty()) continue;
			let { startLine: o, startColumn: s, endLine: c, endColumn: l } = a;
			n.hasSourceURL && (o -= a.startLine, o === 0 && (s -= a.startColumn), c -= a.startLine, c === 0 && (l -= a.startColumn));
			let u = r.createRawLocation(n, o, s), d = r.createRawLocation(n, c, l);
			i.push({
				start: u,
				end: d
			});
		}
		return i;
	}
	getMappedLines(e) {
		if (!Q.has(e)) return null;
		let t = K.targetForUISourceCode(e);
		if (!t) return null;
		let n = t.model(T);
		if (!n) return null;
		let r = /* @__PURE__ */ new Set();
		for (let t of n.scripts()) {
			if (t.embedderName() !== e.url()) continue;
			let { startLine: n, endLine: i } = Z.get(t) ?? $(t);
			for (let e = n; e <= i; ++e) r.add(e);
		}
		return r;
	}
	uiLocationToCSSLocations(e) {
		if (!Q.has(e.uiSourceCode)) return [];
		let t = K.targetForUISourceCode(e.uiSourceCode);
		if (!t) return [];
		let n = t.model(O);
		return n ? n.createRawLocationsByURL(e.uiSourceCode.url(), e.lineNumber, e.columnNumber) : [];
	}
	async functionBoundsAtRawLocation(e) {
		let t = e.script();
		if (!t) return null;
		let n = this.infoForTarget(t.debuggerModel.target());
		if (!n) return null;
		let r = t.embedderName();
		if (!r) return null;
		let i = n.getProject().uiSourceCodeForURL(r);
		if (!i) return null;
		let { lineNumber: a, columnNumber: o } = e;
		a -= t.lineOffset, a === 0 && (o -= t.columnOffset);
		let s = t ? await v(t) : null;
		if (!s) return null;
		let c = s.text.offsetFromPosition(a, o), l = [];
		(function e(t) {
			for (let n of t) c >= n.start && c < n.end && (l.push(n), e(n.children));
		})([s.scopeTree]);
		let u = l.findLast((e) => e.kind === je.FUNCTION || e.kind === je.ARROW_FUNCTION);
		if (!u) return null;
		let d = s.text.positionFromOffset(u.start), f = s.text.positionFromOffset(u.end);
		return d.lineNumber += t.lineOffset, d.lineNumber === t.lineOffset && (d.columnNumber += t.columnOffset), f.lineNumber += t.lineOffset, f.lineNumber === t.lineOffset && (f.columnNumber += t.columnOffset), new ft(i, new M(d.lineNumber, d.columnNumber, f.lineNumber, f.columnNumber), "");
	}
	resetForTest(e) {
		let t = e.model(S), n = t ? this.#e.get(t) : null;
		n && n.resetForTest();
	}
}, kn = class {
	project;
	#e = /* @__PURE__ */ new Map();
	#t;
	#n;
	resourceMapping;
	constructor(e, t) {
		let n = t.target();
		this.resourceMapping = e, this.project = new W(e.workspace, "resources:" + n.id(), B.Network, "", !1), K.setTargetForProject(this.project, n);
		let r = n.model(O);
		console.assert(!!r), this.#t = r;
		for (let e of t.frames()) for (let t of e.getResourcesMap().values()) this.addResource(t);
		this.#n = [
			t.addEventListener(h.ResourceAdded, this.resourceAdded, this),
			t.addEventListener(h.FrameWillNavigate, this.frameWillNavigate, this),
			t.addEventListener(h.FrameDetached, this.frameDetached, this),
			this.#t.addEventListener(y.StyleSheetChanged, (e) => {
				this.styleSheetChanged(e);
			}, this)
		];
	}
	async styleSheetChanged(e) {
		let t = this.#t.styleSheetHeaderForId(e.data.styleSheetId);
		if (!t || !t.isInline || t.isInline && t.isMutable) return;
		let n = this.#e.get(t.resourceURL());
		n && await n.styleSheetChanged(t, e.data.edit || null);
	}
	acceptsResource(e) {
		let t = e.resourceType();
		return !(t !== a.Image && t !== a.Font && t !== a.Document && t !== a.Manifest && t !== a.Fetch && t !== a.XHR || t === a.Image && e.mimeType && !e.mimeType.startsWith("image") || t === a.Font && e.mimeType && !e.mimeType.includes("font") || (t === a.Image || t === a.Font) && o(e.contentURL(), "data:"));
	}
	resourceAdded(e) {
		this.addResource(e.data);
	}
	addResource(e) {
		if (!this.acceptsResource(e)) return;
		let t = this.#e.get(e.url);
		t ? t.addResource(e) : (t = new An(this, e), this.#e.set(e.url, t));
	}
	removeFrameResources(e) {
		for (let t of e.resources()) {
			if (!this.acceptsResource(t)) continue;
			let e = this.#e.get(t.url);
			e && (e.resources.size === 1 ? (e.dispose(), this.#e.delete(t.url)) : e.removeResource(t));
		}
	}
	frameWillNavigate(e) {
		this.removeFrameResources(e.data);
	}
	frameDetached(e) {
		this.removeFrameResources(e.data.frame);
	}
	resetForTest() {
		for (let e of this.#e.values()) e.dispose();
		this.#e.clear();
	}
	dispose() {
		w(this.#n);
		for (let e of this.#e.values()) e.dispose();
		this.#e.clear(), this.project.removeProject();
	}
	getProject() {
		return this.project;
	}
}, An = class {
	resources;
	#e;
	#t;
	#n = [];
	#r;
	#i;
	constructor(e, t) {
		this.resources = /* @__PURE__ */ new Set([t]), this.#e = e.project, this.#r = e.resourceMapping.debuggerWorkspaceBinding, this.#i = e.resourceMapping.cssWorkspaceBinding, this.#t = this.#e.createUISourceCode(t.url, t.contentType()), Q.add(this.#t), t.frameId && K.setInitialFrameAttribution(this.#t, t.frameId), this.#e.addUISourceCodeWithProvider(this.#t, this, Rt(t), t.mimeType), Promise.all([...this.inlineScripts().map((e) => this.#r?.updateLocations(e)), ...this.inlineStyles().map((e) => this.#i?.updateLocations(e))]);
	}
	inlineStyles() {
		let e = K.targetForUISourceCode(this.#t), t = [];
		if (!e) return t;
		let n = e.model(O);
		if (n) for (let e of n.getStyleSheetIdsForURL(this.#t.url())) {
			let r = n.styleSheetHeaderForId(e);
			r && t.push(r);
		}
		return t;
	}
	inlineScripts() {
		let e = K.targetForUISourceCode(this.#t);
		if (!e) return [];
		let t = e.model(T);
		return t ? t.scripts().filter((e) => e.embedderName() === this.#t.url()) : [];
	}
	async styleSheetChanged(e, t) {
		if (this.#n.push({
			stylesheet: e,
			edit: t
		}), this.#n.length > 1) return;
		let n = await this.#t.requestContentData();
		N.isError(n) || await this.innerStyleSheetChanged(n.text), this.#n = [];
	}
	async innerStyleSheetChanged(e) {
		let t = this.inlineScripts(), n = this.inlineStyles(), r = new Ee(e);
		for (let e of this.#n) {
			let i = e.edit;
			if (!i) continue;
			let a = e.stylesheet, o = En.get(a) ?? Dn(a), s = i.oldRange.relativeFrom(o.startLine, o.startColumn), c = i.newRange.relativeFrom(o.startLine, o.startColumn);
			r = new Ee(r.replaceRange(s, i.newText));
			let l = [];
			for (let e of t) {
				let t = Z.get(e) ?? $(e);
				t.follows(s) && (Z.set(e, t.rebaseAfterTextEdit(s, c)), l.push(this.#r?.updateLocations(e)));
			}
			for (let e of n) {
				let t = En.get(e) ?? Dn(e);
				t.follows(s) && (En.set(e, t.rebaseAfterTextEdit(s, c)), l.push(this.#i?.updateLocations(e)));
			}
			await Promise.all(l);
		}
		this.#t.addRevision(r.value());
	}
	addResource(e) {
		this.resources.add(e), e.frameId && K.addFrameAttribution(this.#t, e.frameId);
	}
	removeResource(e) {
		this.resources.delete(e), e.frameId && K.removeFrameAttribution(this.#t, e.frameId);
	}
	dispose() {
		this.#e.removeUISourceCode(this.#t.url()), Promise.all([...this.inlineScripts().map((e) => this.#r?.updateLocations(e)), ...this.inlineStyles().map((e) => this.#i?.updateLocations(e))]);
	}
	firstResource() {
		return console.assert(this.resources.size > 0), this.resources.values().next().value;
	}
	contentURL() {
		return this.firstResource().contentURL();
	}
	contentType() {
		return this.firstResource().contentType();
	}
	requestContentData() {
		return this.firstResource().requestContentData();
	}
	searchInContent(e, t, n) {
		return this.firstResource().searchInContent(e, t, n);
	}
}, jn = class {
	#e = null;
	write(e) {
		this.#e && e.unshift(this.#e), this.#e = new Blob(e, { type: "text/plain" });
	}
	read() {
		return this.readRange();
	}
	size() {
		return this.#e ? this.#e.size : 0;
	}
	async readRange(e, t) {
		if (!this.#e) return p.instance().error("Attempt to read a temp file that was never written"), "";
		let n = typeof e == "number" || typeof t == "number" ? this.#e.slice(e, t) : this.#e, r = new FileReader();
		try {
			await new Promise((e, t) => {
				r.onloadend = e, r.onerror = t, r.readAsText(n);
			});
		} catch (e) {
			p.instance().error("Failed to read from temp file: " + e.message);
		}
		return r.result;
	}
	async copyToOutputStream(e, t) {
		if (!this.#e) return e.close(), null;
		let n = new yn(this.#e, 1e7, t);
		return await n.read(e).then((e) => e ? null : n.error());
	}
	remove() {
		this.#e = null;
	}
};
//#endregion
export { dt as A, Je as B, ht as C, I as D, pt as E, et as F, $e as I, Qe as L, z as M, mt as N, R as O, F as P, Xe as R, V as S, B as T, Ne as V, kt as _, yn as a, xt as b, mn as c, $t as d, Ht as f, jt as g, Mt as h, xn as i, ut as j, L as k, ln as l, Ft as m, On as n, bn as o, It as p, Sn as r, hn as s, jn as t, nn as u, K as v, gt as w, vt as x, Ot as y, qe as z };
