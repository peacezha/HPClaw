import { o as e } from "./common-DMSVbaSb.js";
import { Qf as t, Yf as n } from "./legacy-dM_vujv7.js";
import { p as r } from "./root-DdvV-xPu.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/core/common/Lazy.ts
var i = Symbol("uninitialized"), a = Symbol("error");
function o(e) {
	let t = i, n = /* @__PURE__ */ Error("Initial");
	return () => {
		if (t === a) throw n;
		if (t !== i) return t;
		try {
			return t = e(), t;
		} catch (e) {
			throw n = e instanceof Error ? e : Error(e), t = a, n;
		}
	};
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/legacy/theme_support/ThemeSupport.ts
var s, c = /* @__PURE__ */ new Map(), l = class i extends EventTarget {
	setting;
	#e = "default";
	computedStyleOfHTML = o(() => window.getComputedStyle(document.documentElement));
	#t = /* @__PURE__ */ new Set([document]);
	#n;
	#r;
	#i = () => this.#s();
	#a = () => this.fetchColorsAndApplyHostTheme();
	constructor(e) {
		super(), this.setting = e, this.#n = window.matchMedia("(prefers-color-scheme: dark)"), this.#r = window.matchMedia("(forced-colors: active)"), this.#n.addEventListener("change", this.#i), this.#r.addEventListener("change", this.#i), e.addChangeListener(this.#i), n.events.addEventListener(t.ColorThemeChanged, this.#a);
	}
	#o() {
		this.#n.removeEventListener("change", this.#i), this.#r.removeEventListener("change", this.#i), this.setting.removeChangeListener(this.#i), n.events.removeEventListener(t.ColorThemeChanged, this.#a);
	}
	static hasInstance() {
		return s !== void 0;
	}
	static instance(e = {
		forceNew: null,
		setting: null
	}) {
		let { forceNew: t, setting: n } = e;
		if (!s || t) {
			if (!n) throw Error(`Unable to create theme support: setting must be provided: ${(/* @__PURE__ */ Error()).stack}`);
			s && s.#o(), s = new i(n);
		}
		return s;
	}
	addDocumentToTheme(e) {
		this.#t.add(e), this.#l(e);
	}
	getComputedValue(e, t = null) {
		let n = c.get(t);
		n || (n = /* @__PURE__ */ new Map(), c.set(t, n));
		let r = n.get(e);
		if (!r) {
			let i = t ? window.getComputedStyle(t) : this.computedStyleOfHTML();
			if (typeof i == "symbol") throw Error(`Computed value for property (${e}) could not be found on documentElement.`);
			r = i.getPropertyValue(e).trim(), r && n.set(e, r);
		}
		return r;
	}
	themeName() {
		return this.#e;
	}
	#s() {
		for (let e of this.#t) this.#c(e);
	}
	#c(t) {
		let n = window.matchMedia("(forced-colors: active)").matches, i = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "default", a = this.setting.get() === "systemPreferred" || n;
		this.#e = a ? i : this.setting.get(), t.documentElement.classList.toggle("theme-with-dark-background", this.#e === "dark");
		let o = e("chrome-theme-colors").get();
		if (r.isOffTheRecord === !0) t.documentElement.classList.toggle("baseline-grayscale", !0);
		else if (o) {
			let e = getComputedStyle(t.body).getPropertyValue("--user-color-source");
			t.documentElement.classList.toggle("baseline-default", e === "baseline-default"), t.documentElement.classList.toggle("baseline-grayscale", e === "baseline-grayscale");
		} else t.documentElement.classList.toggle("baseline-grayscale", !0);
		c.clear(), this.dispatchEvent(new u());
	}
	static clearThemeCache() {
		c.clear();
	}
	fetchColorsAndApplyHostTheme() {
		for (let e of this.#t) this.#l(e);
	}
	#l(t) {
		let r = e("chrome-theme-colors").get();
		if (n.isHostedMode() || !r) {
			this.#c(t);
			return;
		}
		let i = t.querySelector("link[href*='//theme/colors.css']"), a = t.createElement("link");
		a.setAttribute("href", `devtools://theme/colors.css?sets=ui,chrome&version=${(/* @__PURE__ */ new Date()).getTime().toString()}`), a.setAttribute("rel", "stylesheet"), a.setAttribute("type", "text/css"), a.onload = () => {
			i && i.remove(), this.#c(t);
		}, t.body.appendChild(a);
	}
}, u = class e extends Event {
	static eventName = "themechange";
	constructor() {
		super(e.eventName, {
			bubbles: !0,
			composed: !0
		});
	}
};
//#endregion
export { l as n, u as t };
