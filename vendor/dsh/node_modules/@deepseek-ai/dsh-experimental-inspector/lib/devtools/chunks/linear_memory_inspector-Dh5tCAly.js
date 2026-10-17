import { n as e } from "./rolldown-runtime-DF993M8W.js";
import { $ as t, H as n, K as r, i, x as a } from "./common-DMSVbaSb.js";
import { Ad as o, Cl as s, Hr as c, Ja as l, Vr as u, Wl as d, ei as f, fl as p, jd as m, jr as h, ma as g, ml as _, mo as v, ql as y } from "./legacy-dM_vujv7.js";
import { d as b } from "./bindings-DyamxTH2.js";
import { i as x, n as S, r as C, t as w } from "./components-CvUVvCxT.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/linear_memory_inspector/LinearMemoryInspectorPane.ts
var T = /* @__PURE__ */ e({
	Events: () => M,
	LinearMemoryInspectorPane: () => j,
	LinearMemoryInspectorView: () => N
}), E = {
	noOpenInspections: "No open inspections",
	memoryInspectorExplanation: "On this page you can inspect binary data.",
	learnMore: "Learn more"
}, D = r("panels/linear_memory_inspector/LinearMemoryInspectorPane.ts", E), O = n.bind(void 0, D), k, A = "https://developer.chrome.com/docs/devtools/memory-inspector", j = class e extends t(f) {
	#e;
	constructor() {
		super({ jslog: `${l("linear-memory-inspector").track({ resize: !0 })}` }), this.#e = new c(), this.#e.setPlaceholderElement(this.createPlaceholder()), this.#e.setCloseableTabs(!0), this.#e.setAllowTabReorder(!0, !0), this.#e.addEventListener(u.TabClosed, this.#n, this), this.#e.show(this.contentElement), this.#e.headerElement().setAttribute("jslog", `${v().track({ keydown: "ArrowUp|ArrowLeft|ArrowDown|ArrowRight|Enter|Space" })}`);
	}
	createPlaceholder() {
		let e = document.createElement("div");
		e.classList.add("empty-state"), e.createChild("span", "empty-state-header").textContent = O(E.noOpenInspections);
		let t = e.createChild("div", "empty-state-description");
		t.createChild("span").textContent = O(E.memoryInspectorExplanation);
		let n = g.create(A, O(E.learnMore), void 0, "learn-more");
		return t.appendChild(n), e;
	}
	static instance() {
		return k ||= new e(), k;
	}
	#t(e) {
		let t = this.#e.tabView(e);
		if (t === null) throw Error(`No linear memory inspector view for the given tab id: ${e}`);
		return t;
	}
	create(e, t, n, r) {
		let i = new N(n, r, e);
		this.#e.appendTab(e, t, i, void 0, !1, !0), this.#e.selectTab(e);
	}
	close(e) {
		this.#e.closeTab(e, !1);
	}
	reveal(e, t) {
		let n = this.#t(e);
		t !== void 0 && n.updateAddress(t), this.refreshView(e), this.#e.selectTab(e);
	}
	refreshView(e) {
		this.#t(e).refreshData();
	}
	#n(e) {
		let { tabId: t } = e.data;
		this.dispatchEventToListeners("ViewClosed", t);
	}
}, M = /* @__PURE__ */ function(e) {
	return e.VIEW_CLOSED = "ViewClosed", e;
}({}), N = class extends f {
	#e;
	#t;
	#n = 0;
	#r;
	#i;
	#a;
	firstTimeOpen;
	#o;
	constructor(e, t = 0, n, r) {
		if (super(), t < 0 || t >= e.length()) throw Error("Requested address is out of bounds.");
		this.#e = e, this.#r = t, this.#i = n, this.#o = !!r, this.firstTimeOpen = !0, this.#a = new S(), this.#a.addEventListener(w.MEMORY_REQUEST, this.#s, this), this.#a.addEventListener(w.ADDRESS_CHANGED, (e) => this.updateAddress(e.data)), this.#a.addEventListener(w.SETTINGS_CHANGED, (e) => this.saveSettings(e.data)), this.#a.addEventListener(w.DELETE_MEMORY_HIGHLIGHT, (e) => {
			U.instance().removeHighlight(this.#i, e.data), this.refreshData();
		}), this.#a.show(this.contentElement);
	}
	render() {
		if (this.firstTimeOpen) {
			let e = U.instance().loadSettings();
			this.#a.valueTypes = e.valueTypes, this.#a.valueTypeModes = e.modes, this.#a.endianness = e.endianness, this.firstTimeOpen = !1;
		}
		this.#t && (this.#a.memory = this.#t, this.#a.memoryOffset = this.#n, this.#a.address = this.#r, this.#a.outerMemoryLength = this.#e.length(), this.#a.highlightInfo = this.#c(), this.#a.hideValueInspector = this.#o);
	}
	wasShown() {
		super.wasShown(), this.refreshData();
	}
	saveSettings(e) {
		U.instance().saveSettings(e);
	}
	updateAddress(e) {
		if (e < 0 || e >= this.#e.length()) throw Error("Requested address is out of bounds.");
		this.#r = e;
	}
	refreshData() {
		U.getMemoryForAddress(this.#e, this.#r).then(({ memory: e, offset: t }) => {
			this.#t = e, this.#n = t, this.render();
		});
	}
	#s(e) {
		let { start: t, end: n, address: r } = e.data;
		if (r < t || r >= n) throw Error("Requested address is out of bounds.");
		U.getMemoryRange(this.#e, t, n).then((e) => {
			this.#t = e, this.#n = t, this.render();
		});
	}
	#c() {
		let e = U.instance().getHighlightInfo(this.#i);
		if (e !== void 0) {
			if (e.startAddress < 0 || e.startAddress >= this.#e.length()) throw Error("HighlightInfo start address is out of bounds.");
			if (e.size <= 0) throw Error("Highlight size must be a positive number.");
		}
		return e;
	}
}, P = /* @__PURE__ */ e({
	LinearMemoryInspectorController: () => U,
	RemoteArrayBufferWrapper: () => V
}), F = {
	couldNotOpenLinearMemory: "Could not open linear memory inspector: failed locating buffer.",
	openInMemoryInspectorPanel: "Open in Memory inspector panel"
}, I = r("panels/linear_memory_inspector/LinearMemoryInspectorController.ts", F), L = n.bind(void 0, I), R = "linear-memory-inspector", z = 1e3, B, V = class {
	#e;
	constructor(e) {
		this.#e = e;
	}
	length() {
		return this.#e.byteLength();
	}
	async getRange(e, t) {
		let n = Math.min(t, this.length());
		if (e < 0 || e > n) return console.error(`Requesting invalid range of memory: (${e}, ${t})`), /* @__PURE__ */ new Uint8Array();
		let r = await this.#e.bytes(e, n);
		return new Uint8Array(r ?? []);
	}
};
async function H(e) {
	let t = await e.runtimeModel().agent.invoke_callFunctionOn({
		objectId: e.objectId,
		functionDeclaration: "function() { return this instanceof ArrayBuffer || (typeof SharedArrayBuffer !== 'undefined' && this instanceof SharedArrayBuffer) ? this : this.buffer; }",
		silent: !0,
		objectGroup: R
	}), n = t.getError();
	if (n) throw Error(`Remote object representing ArrayBuffer could not be retrieved: ${n}`);
	return e = e.runtimeModel().createRemoteObject(t.result), new y(e);
}
var U = class e extends o {
	#e = j.instance();
	#t = /* @__PURE__ */ new Map();
	#n = /* @__PURE__ */ new Map();
	#r;
	constructor() {
		super(), m.instance().observeModels(s, this), m.instance().addModelListener(p, _.GlobalObjectCleared, this.#o, this), this.#e.addEventListener(M.VIEW_CLOSED, this.#s.bind(this)), m.instance().addModelListener(p, _.DebuggerPaused, this.#a, this);
		let e = x(), t = {
			valueTypes: Array.from(e.keys()),
			valueTypeModes: Array.from(e),
			endianness: C.LITTLE
		};
		this.#r = i.instance().createSetting("lmi-interpreter-settings", t);
	}
	static instance() {
		return B || (B = new e(), B);
	}
	static async getMemoryForAddress(e, t) {
		let n = Math.max(0, t - z / 2), r = n + z;
		return {
			memory: await e.getRange(n, r),
			offset: n
		};
	}
	static async getMemoryRange(e, t, n) {
		if (t < 0 || t > n || t >= e.length()) throw Error("Requested range is out of bounds.");
		let r = Math.max(n, t + z);
		return await e.getRange(t, r);
	}
	async evaluateExpression(e, t) {
		let n = await e.evaluate({ expression: t });
		if ("error" in n) {
			console.error(`Tried to evaluate the expression '${t}' but got an error: ${n.error}`);
			return;
		}
		if ("exceptionDetails" in n && n?.exceptionDetails?.text) {
			console.error(`Tried to evaluate the expression '${t}' but got an exception: ${n.exceptionDetails.text}`);
			return;
		}
		return n.object;
	}
	saveSettings(e) {
		let t = Array.from(e.valueTypes), n = [...e.modes];
		this.#r.set({
			valueTypes: t,
			valueTypeModes: n,
			endianness: e.endianness
		});
	}
	loadSettings() {
		let e = this.#r.get();
		return {
			valueTypes: new Set(e.valueTypes),
			modes: new Map(e.valueTypeModes),
			endianness: e.endianness
		};
	}
	getHighlightInfo(e) {
		return this.#n.get(e);
	}
	removeHighlight(e, t) {
		this.getHighlightInfo(e) === t && this.#n.delete(e);
	}
	setHighlightInfo(e, t) {
		this.#n.set(e, t);
	}
	#i(e) {
		this.#n.delete(e);
	}
	static async retrieveDWARFMemoryObjectAndAddress(e) {
		if (!(e instanceof b)) return;
		let t = e, n = e.linearMemoryAddress;
		if (n === void 0) return;
		let r = t.callFrame, i = await e.debuggerModel().agent.invoke_evaluateOnCallFrame({
			callFrameId: r.id,
			expression: "memories[0]"
		}), o = i.getError();
		return o && (console.error(o), a.instance().error(L(F.couldNotOpenLinearMemory))), {
			obj: e.debuggerModel().runtimeModel().createRemoteObject(i.result),
			address: n
		};
	}
	static extractObjectSize(e) {
		return e.linearMemorySize ?? 0;
	}
	static extractObjectTypeDescription(e) {
		let t = e.description;
		if (!t) return "";
		let n = t.charAt(t.length - 1), r = t.charAt(t.length - 2);
		return n === "*" || n === "&" ? r === " " ? t.slice(0, t.length - 2) : t.slice(0, t.length - 1) : t;
	}
	static extractObjectName(e, t) {
		return e.description?.charAt(e.description.length - 1) === "*" ? "*" + t : t;
	}
	async reveal({ object: t, expression: n }, r) {
		let i = await e.retrieveDWARFMemoryObjectAndAddress(t), a = t, o;
		i !== void 0 && (o = i.address, a = i.obj);
		let s = await H(a), { internalProperties: c } = await s.object().getOwnProperties(!1), l = (c?.find(({ name: e }) => e === "[[ArrayBufferData]]"))?.value?.value;
		if (!l) throw Error("Unable to find backing store id for array buffer");
		let u = c?.find(({ name: e }) => e === "[[WebAssemblyMemory]]")?.value, d = e.extractHighlightInfo(t, n);
		if (d ? this.setHighlightInfo(l, d) : this.#i(l), this.#t.has(l)) {
			this.#e.reveal(l, o), h.instance().showView("linear-memory-inspector", r);
			return;
		}
		let f = String(u ? u.description : s.object().description);
		this.#t.set(l, s.object());
		let p = new V(s);
		this.#e.create(l, f, p, o), h.instance().showView("linear-memory-inspector", r);
	}
	appendApplicableItems(e, t, n) {
		if (n.property.object?.isLinearMemoryInspectable()) {
			let e = n.path(), r = n.property.object;
			t.debugSection().appendItem(L(F.openInMemoryInspectorPanel), this.reveal.bind(this, new d(r, e)), { jslogContext: "reveal-in-memory-inspector" });
		}
	}
	static extractHighlightInfo(t, n) {
		if (!(t instanceof b)) return;
		let r = t.linearMemoryAddress ?? 0, i;
		try {
			i = {
				startAddress: r,
				size: e.extractObjectSize(t),
				name: n && e.extractObjectName(t, n),
				type: e.extractObjectTypeDescription(t)
			};
		} catch {
			i = void 0;
		}
		return i;
	}
	modelRemoved(e) {
		for (let [t, n] of this.#t) e === n.runtimeModel() && (this.#t.delete(t), this.#i(t), this.#e.close(t));
	}
	#a(e) {
		let t = e.data;
		for (let [e, n] of this.#t) if (t.runtimeModel() === n.runtimeModel()) {
			let n = t.debuggerPausedDetails()?.callFrames[0];
			n ? this.updateHighlightedMemory(e, n).then(() => this.#e.refreshView(e)) : (this.#i(e), this.#e.refreshView(e));
		}
	}
	#o(e) {
		this.modelRemoved(e.data.runtimeModel());
	}
	#s({ data: e }) {
		let t = this.#t.get(e);
		t && t.release(), this.#t.delete(e), this.#i(e);
	}
	async updateHighlightedMemory(t, n) {
		let r = this.getHighlightInfo(t), i = r?.name;
		if (!r || !i) {
			this.#i(t);
			return;
		}
		let a = await this.evaluateExpression(n, i);
		if (!a) {
			this.#i(t);
			return;
		}
		let o = e.extractHighlightInfo(a, i);
		!o || !this.#c(o, r) ? this.#i(t) : this.setHighlightInfo(t, o);
	}
	#c(e, t) {
		return e.type === t.type && e.startAddress === t.startAddress;
	}
};
//#endregion
export { P as LinearMemoryInspectorController, T as LinearMemoryInspectorPane };
