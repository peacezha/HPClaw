import { n as e } from "./rolldown-runtime-DF993M8W.js";
import { t } from "./platform-D4TUCh2P.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/core/platform/DevToolsPath.ts
var n = /* @__PURE__ */ e({
	EmptyEncodedPathString: () => "",
	EmptyRawPathString: () => "",
	EmptyUrlString: () => "",
	urlString: () => r
}), r = (e, ...t) => String.raw({ raw: e }, ...t), i = /* @__PURE__ */ e({
	Experiment: () => _,
	ExperimentsSupport: () => h,
	GdpProfilesEnterprisePolicyValue: () => S,
	GenAiEnterprisePolicyValue: () => b,
	HostConfigFreestylerExecutionMode: () => x,
	HostExperiment: () => v,
	Runtime: () => m,
	conditions: () => w,
	experiments: () => y,
	getChromeVersion: () => p,
	getPathName: () => d,
	getRemoteBase: () => u,
	hostConfig: () => C,
	isNodeEntry: () => f
}), a = "", o, s, c, l = globalThis;
function u(e = l.self?.location?.toString() ?? "") {
	let t = new URL(e).searchParams.get("remoteBase");
	if (!t) return null;
	let n = /\/serve_file\/(@[0-9a-zA-Z]+)\/?$/.exec(t);
	return n ? {
		base: `devtools://devtools/remote/serve_file/${n[1]}/`,
		version: n[1]
	} : null;
}
function d() {
	return l.location?.pathname ?? "";
}
function f(e) {
	return ["node_app", "js_app"].some((t) => e.includes(t));
}
var p = () => {
	let e = t.getUserAgent().match(/(?:^|\W)(?:Chrome|HeadlessChrome)\/(\S+)/);
	return e && e.length > 1 ? e[1] : "";
}, m = class e {
	constructor() {}
	static instance(t = { forceNew: null }) {
		let { forceNew: n } = t;
		return (!o || n) && (o = new e()), o;
	}
	static removeInstance() {
		o = void 0;
	}
	static #e;
	static #t() {
		return !e.#e && l.location && (e.#e = new URLSearchParams(l.location.search)), e.#e;
	}
	static queryParam(t) {
		return e.#t()?.get(t) ?? null;
	}
	static setQueryParamForTesting(t, n) {
		e.#t()?.set(t, n);
	}
	static isNode() {
		return s === void 0 && (s = f(d())), s;
	}
	static isTraceApp() {
		return c === void 0 && (c = d().includes("trace_app")), c;
	}
	static setPlatform(e) {
		a = e;
	}
	static platform() {
		return a;
	}
	static isDescriptorEnabled(e) {
		let { experiment: t } = e;
		if (t === "*") return !0;
		if (t?.startsWith("!")) {
			let e = t.substring(1);
			if (y.isEnabled(e)) return !1;
		}
		if (t && !t.startsWith("!")) {
			let e = t;
			if (!y.isEnabled(e)) return !1;
		}
		let { condition: n } = e;
		return !n || n(C);
	}
	loadLegacyModule(e) {
		return console.log("Loading legacy module: " + e), import(`../../${e}`).then((t) => (console.log("Loaded legacy module: " + e), t));
	}
}, h = class {
	#e = [];
	#t = /* @__PURE__ */ new Map();
	#n = /* @__PURE__ */ new Set();
	#r = /* @__PURE__ */ new Set();
	#i = /* @__PURE__ */ new Set();
	#a = /* @__PURE__ */ new Set();
	#o = new g();
	allConfigurableExperiments() {
		return [...this.#e, ...this.#t.values()];
	}
	registerHostExperiment(e) {
		if (this.#s(e.name) || this.#c(e.name)) throw Error(`Duplicate registration of experiment '${e.name}'`);
		let t = new v({
			...e,
			experiments: this
		});
		return this.#t.set(e.name, t), t;
	}
	register(e, t, n, r) {
		if (this.#s(e) || this.#c(e)) throw Error(`Duplicate registration of experiment '${e}'`);
		this.#n.add(e), this.#e.push(new _(this, e, t, n ?? "", r ?? ""));
	}
	isEnabled(e) {
		if (this.#s(e)) return this.#r.has(e) || (this.#t.get(e)?.isEnabled() ?? !1);
		if (this.#c(e)) return this.#o.get(e) === !1 ? !1 : this.#r.has(e) || this.#i.has(e) || this.#a.has(e) ? !0 : !!this.#o.get(e);
		throw Error(`Unknown experiment '${e}'`);
	}
	getValueFromStorage(e) {
		return this.#o.get(e);
	}
	setEnabled(e, t) {
		if (this.#s(e)) {
			this.#t.get(e)?.setEnabled(t);
			return;
		}
		if (this.#c(e)) {
			this.#o.set(e, t);
			return;
		}
		throw Error(`Unknown experiment '${e}'`);
	}
	enableExperimentsByDefault(e) {
		for (let t of e) {
			if (!this.#c(t)) throw Error(`Unknown (legacy) experiment '${t}'`);
			this.#i.add(t);
		}
	}
	setServerEnabledExperiments(e) {
		for (let t of e) {
			let e = t;
			if (!this.#c(e)) throw Error(`Unknown (legacy) experiment '${e}'`);
			this.#a.add(e);
		}
	}
	enableForTest(e) {
		if (!this.#s(e) && !this.#c(e)) throw Error(`Unknown experiment '${e}'`);
		this.#r.add(e);
	}
	disableForTest(e) {
		if (!this.#s(e) && !this.#c(e)) throw Error(`Unknown experiment '${e}'`);
		this.#r.delete(e);
	}
	isEnabledForTest(e) {
		return this.#r.has(e);
	}
	clearForTest() {
		this.#e = [], this.#t.clear(), this.#n.clear(), this.#r.clear(), this.#i.clear(), this.#a.clear();
	}
	cleanUpStaleExperiments() {
		this.#o.cleanUpStaleExperiments(this.#n);
	}
	#s(e) {
		return this.#t.has(e);
	}
	#c(e) {
		return this.#n.has(e);
	}
}, g = class {
	#e = {};
	constructor() {
		try {
			let e = t.getLocalStorage()?.getItem("experiments");
			e && (this.#e = JSON.parse(e));
		} catch (e) {
			console.error("Failed to parse localStorage['experiments']: " + e.message);
		}
	}
	get(e) {
		return this.#e[e];
	}
	set(e, t) {
		this.#e[e] = t, this.#t();
	}
	cleanUpStaleExperiments(e) {
		for (let [t] of Object.entries(this.#e)) e.has(t) || delete this.#e[t];
		this.#t();
	}
	#t() {
		t.getLocalStorage()?.setItem("experiments", JSON.stringify(this.#e));
	}
}, _ = class {
	name;
	title;
	docLink;
	feedbackLink;
	#e;
	constructor(e, t, n, r, i) {
		this.name = t, this.title = n, this.docLink = r, this.feedbackLink = i, this.#e = e;
	}
	isEnabled() {
		return this.#e.isEnabled(this.name);
	}
	setEnabled(e) {
		this.#e.setEnabled(this.name, e);
	}
}, v = class {
	name;
	title;
	#e;
	aboutFlag;
	#t;
	requiresChromeRestart;
	docLink;
	feedbackLink;
	constructor(e) {
		this.name = e.name, this.title = e.title, this.#e = e.experiments, this.aboutFlag = e.aboutFlag, this.#t = e.isEnabled, this.requiresChromeRestart = e.requiresChromeRestart, this.docLink = e.docLink, this.feedbackLink = e.feedbackLink;
	}
	isEnabled() {
		return this.#e.isEnabledForTest(this.name) || this.#t;
	}
	setEnabled(e) {
		this.#t = e;
	}
}, y = new h(), b = /* @__PURE__ */ function(e) {
	return e[e.ALLOW = 0] = "ALLOW", e[e.ALLOW_WITHOUT_LOGGING = 1] = "ALLOW_WITHOUT_LOGGING", e[e.DISABLE = 2] = "DISABLE", e;
}({}), x = /* @__PURE__ */ function(e) {
	return e.ALL_SCRIPTS = "ALL_SCRIPTS", e.SIDE_EFFECT_FREE_SCRIPTS_ONLY = "SIDE_EFFECT_FREE_SCRIPTS_ONLY", e.NO_SCRIPTS = "NO_SCRIPTS", e;
}({}), S = /* @__PURE__ */ function(e) {
	return e[e.ENABLED = 0] = "ENABLED", e[e.ENABLED_WITHOUT_BADGES = 1] = "ENABLED_WITHOUT_BADGES", e[e.DISABLED = 2] = "DISABLED", e;
}({}), C = Object.create(null), w = { canDock: () => !!m.queryParam("can_dock") };
//#endregion
export { v as a, w as c, d, u as f, r as h, x as i, y as l, n as m, S as n, m as o, C as p, b as r, i as s, _ as t, p as u };
