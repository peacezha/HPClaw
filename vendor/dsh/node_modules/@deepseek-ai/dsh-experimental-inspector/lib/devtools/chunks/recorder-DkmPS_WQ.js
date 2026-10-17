import { n as e } from "./rolldown-runtime-DF993M8W.js";
import { D as t, H as n, J as r, K as i, Q as a, b as o, i as s, r as c } from "./common-DMSVbaSb.js";
import { $i as l, Bc as u, Cf as d, Cl as f, Fo as p, Go as ee, Hi as te, Ja as ne, Jn as re, Ki as ie, Ko as ae, La as oe, Na as se, No as m, Od as ce, Of as le, Or as ue, Pd as de, Ra as fe, S as pe, Sa as me, Sd as he, Sf as ge, U as _e, Uc as ve, Vo as ye, Wi as be, Yf as xe, Yo as Se, Zi as Ce, Zo as we, _d as Te, _o as Ee, bc as De, bf as Oe, bp as ke, br as Ae, cc as je, ci as Me, dc as Ne, fa as Pe, fc as Fe, fd as Ie, ff as h, fo as Le, gd as Re, go as g, ha as _, ho as ze, ii as Be, ja as Ve, jd as He, jr as Ue, md as We, mo as Ge, ni as v, no as Ke, po as qe, pp as Je, qa as Ye, qs as Xe, ro as Ze, un as Qe, uo as $e, xd as et, xf as tt, xl as nt } from "./legacy-dM_vujv7.js";
import { o as rt } from "./root-DdvV-xPu.js";
import "./platform-D4TUCh2P.js";
import "./text_utils-DWSliayn.js";
import { P as it, g as at, k as y } from "./StringUtilities-CMDxNrEc.js";
import { s as ot } from "./FormatterActions-D6HaA-6R.js";
import { V as st, a as ct } from "./bindings-DyamxTH2.js";
import { Dt as lt, I as b, K as ut, L as dt, P as ft, q as pt, t as mt } from "./common-Bs7hSOUj.js";
import { Ot as ht, st as gt } from "./codemirror-CENmPHF2.js";
import { r as _t, x as vt } from "./text_editor-B6PKcoob.js";
import { i as yt } from "./code_highlighter-CNBDhX-D.js";
import { t as bt } from "./checkbox.css-CtBDUlMG.js";
import { t as xt } from "./textInput.css-Ca_GEU1S.js";
import { a as St } from "./emulation-CODu4I-X.js";
import { t as x } from "./recorder-actions-S2RfLX4H.js";
import { t as Ct } from "./puppeteer-xGpmPP-i.js";
import { r as wt, s as Tt } from "./menus-CbHfE0QY.js";
import { n as S, t as Et } from "./suggestion_input-CbJ3xGeU.js";
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/recorder/components/controlButton.css.mjs
var Dt = "/*\n * Copyright 2023 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  font-size: inherit;\n}\n\n.control {\n  background: none;\n  border: none;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n\n.control[disabled] {\n  filter: grayscale(100%);\n  cursor: auto;\n}\n\n.icon {\n  display: flex;\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n  background: var(--sys-color-error-bright);\n  margin-bottom: 8px;\n  position: relative;\n  transition: background 200ms;\n  place-content: center center;\n  align-items: center;\n}\n\n.icon::before {\n  --override-white: #fff;\n\n  box-sizing: border-box;\n  content: \"\";\n  display: block;\n  width: 14px;\n  height: 14px;\n  border: 1px solid var(--override-white);\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  background-color: var(--override-white);\n}\n\n.icon.square::before {\n  border-radius: 0;\n}\n\n.icon.circle::before {\n  border-radius: 50%;\n}\n\n.icon:hover {\n  background: color-mix(in srgb, var(--sys-color-error-bright), var(--sys-color-state-hover-on-prominent) 10%);\n}\n\n.icon:active {\n  background: color-mix(in srgb, var(--sys-color-error-bright), var(--sys-color-state-ripple-neutral-on-prominent) 16%);\n}\n\n.control[disabled] .icon:hover {\n  background: var(--sys-color-error);\n}\n\n.label {\n  font-size: 12px;\n  line-height: 16px;\n  text-align: center;\n  letter-spacing: 0.02em;\n  color: var(--sys-color-on-surface);\n}\n", { html: Ot } = m, kt = (e, t, n) => {
	let { label: r, shape: i, disabled: a, onClick: o } = e;
	p(Ot`
    <style>${Dt}</style>
    <button
        @click=${(e) => {
		a ? (e.stopPropagation(), e.preventDefault()) : o(e);
	}}
        .disabled=${a}
        class="control">
      <div class="icon ${i}"></div>
      <div class="label">${r}</div>
    </button>
  `, n, { container: { attributes: { classes: "flex-none" } } });
}, At = class extends v {
	#e = "";
	#t = "square";
	#n = !1;
	#r = () => {};
	#i;
	constructor(e, t) {
		super(e, { useShadowDom: "pure" }), this.#i = t || kt;
	}
	set label(e) {
		this.#e = e, this.requestUpdate();
	}
	set shape(e) {
		this.#t = e, this.requestUpdate();
	}
	set disabled(e) {
		this.#n = e, this.requestUpdate();
	}
	set onClick(e) {
		this.#r = e, this.requestUpdate();
	}
	performUpdate() {
		this.#i({
			label: this.#e,
			shape: this.#t,
			disabled: this.#n,
			onClick: this.#r
		}, {}, this.contentElement);
	}
}, C = /* @__PURE__ */ function(e) {
	return e.JSON = "json", e.PUPPETEER = "puppeteer", e.PUPPETEER_FIREFOX = "puppeteer-firefox", e.REPLAY = "@puppeteer/replay", e.LIGHTHOUSE = "lighthouse", e;
}({}), w;
(function(e) {
	e.CSS = "css", e.ARIA = "aria", e.Text = "text", e.XPath = "xpath", e.Pierce = "pierce";
})(w ||= {});
var T;
(function(e) {
	e.Change = "change", e.Click = "click", e.Close = "close", e.CustomStep = "customStep", e.DoubleClick = "doubleClick", e.EmulateNetworkConditions = "emulateNetworkConditions", e.Hover = "hover", e.KeyDown = "keyDown", e.KeyUp = "keyUp", e.Navigate = "navigate", e.Scroll = "scroll", e.SetViewport = "setViewport", e.WaitForElement = "waitForElement", e.WaitForExpression = "waitForExpression";
})(T ||= {});
var E;
(function(e) {
	e.Navigation = "navigation";
})(E ||= {});
function jt(e) {
	throw Error(`Unknown step type: ${e.type}`);
}
var Mt = /* @__PURE__ */ new Set([
	"mouse",
	"pen",
	"touch"
]), Nt = /* @__PURE__ */ new Map([
	["primary", "left"],
	["auxiliary", "middle"],
	["secondary", "right"],
	["back", "back"],
	["forward", "forward"]
]);
function D(e, t) {
	return Object.prototype.hasOwnProperty.call(e, t) ? e[t] !== void 0 : !1;
}
function Pt(e) {
	return typeof e == "object" && !!e;
}
function O(e) {
	return typeof e == "string";
}
function Ft(e) {
	return typeof e == "number";
}
function It(e) {
	return Array.isArray(e);
}
function Lt(e) {
	return typeof e == "boolean";
}
function Rt(e) {
	return It(e) && e.every((e) => Number.isInteger(e));
}
function zt(e) {
	return typeof e == "string" && Mt.has(e);
}
function Bt(e) {
	return typeof e == "string" && Nt.has(e);
}
function Vt(e) {
	if (D(e, "target") && O(e.target)) return e.target;
}
function Ht(e) {
	if (D(e, "frame")) {
		if (Rt(e.frame)) return e.frame;
		throw Error("Step `frame` is not an integer array");
	}
}
function k(e, t) {
	if (D(e, t)) {
		let n = e[t];
		if (Ft(n)) return n;
	}
	throw Error(`Step.${t} is not a number`);
}
function Ut(e, t) {
	if (D(e, t)) {
		let n = e[t];
		if (Lt(n)) return n;
	}
	throw Error(`Step.${t} is not a boolean`);
}
function Wt(e, t) {
	if (D(e, t)) return k(e, t);
}
function Gt(e, t) {
	if (D(e, t)) return qt(e, t);
}
function Kt(e, t) {
	if (D(e, t)) return Ut(e, t);
}
function qt(e, t) {
	if (D(e, t)) {
		let n = e[t];
		if (O(n)) return n;
	}
	throw Error(`Step.${t} is not a string`);
}
function Jt(e) {
	if (!D(e, "selectors")) throw Error("Step does not have required selectors");
	if (!It(e.selectors)) throw Error("Step selectors are not an array");
	if (e.selectors.length === 0) throw Error("Step does not have required selectors");
	return e.selectors.map((e) => {
		if (!O(e) && !It(e)) throw Error("Selector is not an array or string");
		return It(e) ? e.map((e) => {
			if (!O(e)) throw Error("Selector element is not a string");
			return e;
		}) : e;
	});
}
function Yt(e) {
	if (D(e, "selectors")) return Jt(e);
}
function Xt(e) {
	if (!Pt(e)) throw Error("Asserted event is not an object");
	if (!D(e, "type")) throw Error("Asserted event is missing type");
	if (e.type === E.Navigation) return {
		type: E.Navigation,
		url: Gt(e, "url"),
		title: Gt(e, "title")
	};
	throw Error("Unknown assertedEvent type");
}
function Zt(e) {
	if (It(e)) return e.map(Xt);
}
function Qt(e, t) {
	if (D(t, "timeout") && Ft(t.timeout) && !Sn(t.timeout)) throw Error(xn);
	return {
		type: e,
		assertedEvents: D(t, "assertedEvents") ? Zt(t.assertedEvents) : void 0,
		timeout: D(t, "timeout") && Ft(t.timeout) ? t.timeout : void 0
	};
}
function $t(e, t) {
	return {
		...Qt(e, t),
		target: Vt(t)
	};
}
function en(e, t) {
	return {
		...$t(e, t),
		frame: Ht(t)
	};
}
function tn(e, t) {
	return {
		...en(e, t),
		selectors: Jt(t)
	};
}
function nn(e) {
	let t = {
		offsetX: k(e, "offsetX"),
		offsetY: k(e, "offsetY"),
		duration: Wt(e, "duration")
	}, n = Gt(e, "deviceType");
	if (n) {
		if (!zt(n)) throw Error(`'deviceType' for click steps must be one of the following: ${[...Mt].join(", ")}`);
		t.deviceType = n;
	}
	let r = Gt(e, "button");
	if (r) {
		if (!Bt(r)) throw Error(`'button' for click steps must be one of the following: ${[...Nt.keys()].join(", ")}`);
		t.button = r;
	}
	return t;
}
function rn(e) {
	return {
		...tn(T.Click, e),
		...nn(e),
		type: T.Click
	};
}
function an(e) {
	return {
		...tn(T.DoubleClick, e),
		...nn(e),
		type: T.DoubleClick
	};
}
function on(e) {
	return {
		...tn(T.Hover, e),
		type: T.Hover
	};
}
function sn(e) {
	return {
		...tn(T.Change, e),
		type: T.Change,
		value: qt(e, "value")
	};
}
function cn(e) {
	return {
		...$t(T.KeyDown, e),
		type: T.KeyDown,
		key: qt(e, "key")
	};
}
function ln(e) {
	return {
		...$t(T.KeyUp, e),
		type: T.KeyUp,
		key: qt(e, "key")
	};
}
function un(e) {
	return {
		...$t(T.EmulateNetworkConditions, e),
		type: T.EmulateNetworkConditions,
		download: k(e, "download"),
		upload: k(e, "upload"),
		latency: k(e, "latency")
	};
}
function dn(e) {
	return {
		...$t(T.Close, e),
		type: T.Close
	};
}
function fn(e) {
	return {
		...$t(T.SetViewport, e),
		type: T.SetViewport,
		width: k(e, "width"),
		height: k(e, "height"),
		deviceScaleFactor: k(e, "deviceScaleFactor"),
		isMobile: Ut(e, "isMobile"),
		hasTouch: Ut(e, "hasTouch"),
		isLandscape: Ut(e, "isLandscape")
	};
}
function pn(e) {
	return {
		...en(T.Scroll, e),
		type: T.Scroll,
		x: Wt(e, "x"),
		y: Wt(e, "y"),
		selectors: Yt(e)
	};
}
function mn(e) {
	return {
		...$t(T.Navigate, e),
		type: T.Navigate,
		target: Vt(e),
		url: qt(e, "url")
	};
}
function hn(e) {
	let t = Gt(e, "operator");
	if (t && t !== ">=" && t !== "==" && t !== "<=") throw Error("WaitForElement step's operator is not one of '>=','==','<='");
	if (D(e, "attributes") && (!Pt(e.attributes) || Object.values(e.attributes).some((e) => typeof e != "string"))) throw Error("WaitForElement step's attribute is not a dictionary of strings");
	if (D(e, "properties") && !Pt(e.properties)) throw Error("WaitForElement step's attribute is not an object");
	return {
		...tn(T.WaitForElement, e),
		type: T.WaitForElement,
		operator: t,
		count: Wt(e, "count"),
		visible: Kt(e, "visible"),
		attributes: D(e, "attributes") ? e.attributes : void 0,
		properties: D(e, "properties") ? e.properties : void 0
	};
}
function gn(e) {
	if (!D(e, "expression")) throw Error("waitForExpression step is missing `expression`");
	return {
		...en(T.WaitForExpression, e),
		type: T.WaitForExpression,
		expression: qt(e, "expression")
	};
}
function _n(e) {
	if (!D(e, "name")) throw Error("customStep is missing name");
	if (!O(e.name)) throw Error("customStep's name is not a string");
	return {
		...en(T.CustomStep, e),
		type: T.CustomStep,
		name: e.name,
		parameters: D(e, "parameters") ? e.parameters : void 0
	};
}
function vn(e, t) {
	if (!Pt(e)) throw Error(t ? `Step ${t} is not an object` : "Step is not an object");
	if (!D(e, "type")) throw Error(t ? `Step ${t} does not have a type` : "Step does not have a type");
	if (!O(e.type)) throw Error(t ? `Type of the step ${t} is not a string` : "Type of the step is not a string");
	switch (e.type) {
		case T.Click: return rn(e);
		case T.DoubleClick: return an(e);
		case T.Hover: return on(e);
		case T.Change: return sn(e);
		case T.KeyDown: return cn(e);
		case T.KeyUp: return ln(e);
		case T.EmulateNetworkConditions: return un(e);
		case T.Close: return dn(e);
		case T.SetViewport: return fn(e);
		case T.Scroll: return pn(e);
		case T.Navigate: return mn(e);
		case T.CustomStep: return _n(e);
		case T.WaitForElement: return hn(e);
		case T.WaitForExpression: return gn(e);
		default: throw Error(`Step type ${e.type} is not supported`);
	}
}
function yn(e) {
	let t = [];
	if (!It(e)) throw Error("Recording `steps` is not an array");
	for (let [n, r] of e.entries()) t.push(vn(r, n));
	return t;
}
function bn(e) {
	return JSON.parse(JSON.stringify(e));
}
var xn = "Timeout is not between 1 and 30000 milliseconds";
function Sn(e) {
	return e >= 1 && e <= 3e4;
}
function Cn(e) {
	if (!Pt(e)) throw Error("Recording is not an object");
	if (!D(e, "title")) throw Error("Recording is missing `title`");
	if (!O(e.title)) throw Error("Recording `title` is not a string");
	if (D(e, "timeout") && !Ft(e.timeout)) throw Error("Recording `timeout` is not a number");
	if (!D(e, "steps")) throw Error("Recording is missing `steps`");
	if (D(e, "timeout") && Ft(e.timeout) && !Sn(e.timeout)) throw Error(xn);
	return bn({
		title: e.title,
		timeout: D(e, "timeout") && Ft(e.timeout) ? e.timeout : void 0,
		selectorAttribute: D(e, "selectorAttribute") && O(e.selectorAttribute) ? e.selectorAttribute : void 0,
		steps: yn(e.steps)
	});
}
function wn(e) {
	for (let t of Object.values(w)) if (e.startsWith(`${t}/`)) return t;
	return w.CSS;
}
function Tn(e) {
	Array.isArray(e) || (e = [e]);
	function t(e) {
		return e.replace(/['"()]/g, "\\$&");
	}
	return e.map((e) => {
		switch (wn(e)) {
			case w.ARIA: return `::-p-aria(${t(e.substring(w.ARIA.length + 1))})`;
			case w.CSS: return e;
			case w.XPath: return `::-p-xpath(${t(e.substring(w.XPath.length + 1))})`;
			case w.Pierce: return `:scope >>> ${e.substring(w.Pierce.length + 1)}`;
			case w.Text: return `::-p-text(${t(e.substring(w.Text.length + 1))})`;
		}
	}).join(" >>>> ");
}
var En = class {
	async beforeAllSteps(e, t) {}
	async afterAllSteps(e, t) {}
	async beforeEachStep(e, t, n) {}
	async stringifyStep(e, t, n) {}
	async afterEachStep(e, t, n) {}
}, Dn = class extends En {
	async beforeAllSteps(e, t) {
		let n = {
			...t,
			steps: void 0
		}, r = JSON.stringify(n, null, e.getIndent()).split("\n");
		r.pop(), r[r.length - 1] += ",", r.push(e.getIndent() + "\"steps\": ["), e.appendLine(r.join("\n")).startBlock().startBlock();
	}
	async afterAllSteps(e) {
		e.endBlock().endBlock().appendLine(e.getIndent() + "]").appendLine("}");
	}
	async stringifyStep(e, t, n) {
		let r = JSON.stringify(t, null, e.getIndent());
		if (!n) {
			e.appendLine(r);
			return;
		}
		let i = n.steps.lastIndexOf(t) === n.steps.length - 1 ? "" : ",";
		e.appendLine(r + i);
	}
}, On = class {
	#e;
	#t = 0;
	#n = [];
	constructor(e) {
		this.#e = e;
	}
	appendLine(e) {
		let t = e.split("\n").map((e) => e ? this.#e.repeat(this.#t) + e.trimEnd() : "");
		return this.#n.push(...t), this;
	}
	startBlock() {
		return this.#t++, this;
	}
	endBlock() {
		if (this.#t--, this.#t < 0) throw Error("Extra endBlock");
		return this;
	}
	toString() {
		return this.#n.join("\n") + "\n";
	}
	getIndent() {
		return this.#e;
	}
	getSize() {
		return this.#n.length;
	}
};
function A(e, t) {
	let n = [];
	return kn(e, n, 1, t), n.join("");
}
function kn(e, t = [], n = 1, r = "  ") {
	switch (typeof e) {
		case "bigint":
		case "symbol":
		case "function":
		case "undefined": throw Error("Invalid JSON");
		case "number":
		case "boolean":
			t.push(String(e));
			break;
		case "string":
			t.push(Mn(e));
			break;
		case "object":
			if (e === null) t.push("null");
			else if (Array.isArray(e)) {
				t.push("[\n");
				for (let i = 0; i < e.length; i++) t.push(r.repeat(n)), kn(e[i], t, n + 1, r), i !== e.length - 1 && t.push(","), t.push("\n");
				t.push(r.repeat(n - 1) + "]");
			} else {
				t.push("{\n");
				let i = Object.keys(e);
				for (let a = 0; a < i.length; a++) {
					let o = i[a], s = e[o];
					s !== void 0 && (t.push(r.repeat(n)), t.push(o), t.push(": "), kn(s, t, n + 1, r), a !== i.length - 1 && t.push(","), t.push("\n"));
				}
				t.push(r.repeat(n - 1) + "}");
			}
			break;
		default: throw Error("Unknown object type");
	}
	return t;
}
var An = (e, t) => e.toString(16).toUpperCase().padStart(t, "0"), jn = /* @__PURE__ */ new Map([
	["\b", "\\b"],
	["\f", "\\f"],
	["\n", "\\n"],
	["\r", "\\r"],
	["	", "\\t"],
	["\v", "\\v"],
	["'", "\\'"],
	["\\", "\\\\"],
	["<!--", "\\x3C!--"],
	["<script", "\\x3Cscript"],
	["<\/script", "\\x3C/script"]
]), Mn = (e) => {
	let t = /(\\|<(?:!--|\/?script))|(\p{Control})|(\p{Surrogate})/gu, n = /(\\|'|<(?:!--|\/?script))|(\p{Control})|(\p{Surrogate})/gu, r = (e, t, n, r) => n ? jn.has(n) ? jn.get(n) : "\\x" + An(n.charCodeAt(0), 2) : r ? "\\u" + An(r.charCodeAt(0), 4) : t ? jn.get(t) || "" : e, i = "", a = "";
	return e.includes("'") ? e.includes("\"") ? !e.includes("`") && !e.includes("${") ? (a = "`", i = e.replace(t, r)) : (a = "'", i = e.replace(n, r)) : (a = "\"", i = e.replace(t, r)) : (a = "'", i = e.replace(t, r)), `${a}${i}${a}`;
}, Nn = class extends En {
	#e = !1;
	#t;
	constructor(e = "chrome") {
		super(), this.#t = e;
	}
	async beforeAllSteps(e, t) {
		e.appendLine("import { Locator, launch } from 'puppeteer'; // v25.0.0 or later"), e.appendLine(""), this.#t === "firefox" ? e.appendLine("const browser = await launch({browser: 'firefox'});") : e.appendLine("const browser = await launch();"), e.appendLine("const page = await browser.newPage();"), e.appendLine(`const timeout = ${t.timeout || Pn};`), e.appendLine("page.setDefaultTimeout(timeout);"), e.appendLine(""), this.#e = !1;
	}
	async afterAllSteps(e, t) {
		if (e.appendLine(""), e.appendLine("await browser.close();"), e.appendLine(""), this.#e) for (let t of Fn.split("\n")) e.appendLine(t);
	}
	async stringifyStep(e, t, n) {
		e.appendLine("{").startBlock(), t.timeout !== void 0 && e.appendLine(`const timeout = ${t.timeout};`), this.#i(e, t);
		let r = t.assertedEvents && t.type !== T.Navigate;
		if (r) {
			e.appendLine("const promises = [];"), e.appendLine("const startWaitingForEvents = () => {").startBlock();
			for (let n of t.assertedEvents) switch (n.type) {
				case E.Navigation:
					e.appendLine(`promises.push(${"frame" in t && t.frame ? "frame" : "targetPage"}.waitForNavigation());`);
					break;
				default: throw Error(`Event type ${n.type} is not supported`);
			}
			e.endBlock().appendLine("}");
		}
		this.#g(e, t), r && e.appendLine("await Promise.all(promises);"), e.endBlock().appendLine("}");
	}
	#n(e, t) {
		t === "main" ? e.appendLine("const targetPage = page;") : (e.appendLine(`const target = await browser.waitForTarget(t => t.url() === ${A(t, e.getIndent())}, { timeout });`), e.appendLine("const targetPage = await target.page();"), e.appendLine("targetPage.setDefaultTimeout(timeout);"));
	}
	#r(e, t) {
		e.appendLine("let frame = targetPage.mainFrame();");
		for (let n of t) e.appendLine(`frame = frame.childFrames()[${n}];`);
	}
	#i(e, t) {
		this.#n(e, t.target || "main"), t.frame && this.#r(e, t.frame);
	}
	#a(e, t, n) {
		e.appendLine("await Locator.race([").startBlock(), e.appendLine(t.selectors.map((n) => `${t.frame ? "frame" : "targetPage"}.locator(${A(Tn(n), e.getIndent())})`).join(",\n")), e.endBlock().appendLine("])"), e.startBlock().appendLine(".setTimeout(timeout)"), t.assertedEvents?.length && e.appendLine(".on('action', () => startWaitingForEvents())"), n(), e.endBlock();
	}
	#o(e, t) {
		this.#a(e, t, () => {
			e.appendLine(".click({"), t.duration && e.appendLine(`  delay: ${t.duration},`), t.button && e.appendLine(`  button: '${Nt.get(t.button)}',`), e.appendLine("  offset: {"), e.appendLine(`    x: ${t.offsetX},`), e.appendLine(`    y: ${t.offsetY},`), e.appendLine("  },"), e.appendLine("});");
		});
	}
	#s(e, t) {
		this.#a(e, t, () => {
			e.appendLine(".click({"), e.appendLine("  count: 2,"), t.duration && e.appendLine(`  delay: ${t.duration},`), t.button && e.appendLine(`  button: '${Nt.get(t.button)}',`), e.appendLine("  offset: {"), e.appendLine(`    x: ${t.offsetX},`), e.appendLine(`    y: ${t.offsetY},`), e.appendLine("  },"), e.appendLine("});");
		});
	}
	#c(e, t) {
		this.#a(e, t, () => {
			e.appendLine(".hover();");
		});
	}
	#l(e, t) {
		this.#a(e, t, () => {
			e.appendLine(`.fill(${A(t.value, e.getIndent())});`);
		});
	}
	#u(e, t) {
		e.appendLine("await targetPage.emulateNetworkConditions({"), e.appendLine(`  offline: ${!t.download && !t.upload},`), e.appendLine(`  downloadThroughput: ${t.download},`), e.appendLine(`  uploadThroughput: ${t.upload},`), e.appendLine(`  latency: ${t.latency},`), e.appendLine("});");
	}
	#d(e, t) {
		e.appendLine(`await targetPage.keyboard.down(${A(t.key, e.getIndent())});`);
	}
	#f(e, t) {
		e.appendLine(`await targetPage.keyboard.up(${A(t.key, e.getIndent())});`);
	}
	#p(e, t) {
		e.appendLine("await targetPage.close()");
	}
	#m(e, t) {
		e.appendLine(`await targetPage.setViewport(${A({
			width: t.width,
			height: t.height
		}, e.getIndent())})`);
	}
	#h(e, t) {
		"selectors" in t ? this.#a(e, t, () => {
			e.appendLine(`.scroll({ scrollTop: ${t.y}, scrollLeft: ${t.x}});`);
		}) : e.appendLine(`await targetPage.evaluate((x, y) => { window.scroll(x, y); }, ${t.x}, ${t.y})`);
	}
	#g(e, t) {
		switch (t.type) {
			case T.Click: return this.#o(e, t);
			case T.DoubleClick: return this.#s(e, t);
			case T.Hover: return this.#c(e, t);
			case T.Change: return this.#l(e, t);
			case T.EmulateNetworkConditions: return this.#u(e, t);
			case T.KeyDown: return this.#d(e, t);
			case T.KeyUp: return this.#f(e, t);
			case T.Close: return this.#p(e, t);
			case T.SetViewport: return this.#m(e, t);
			case T.Scroll: return this.#h(e, t);
			case T.Navigate: return this.#_(e, t);
			case T.WaitForElement: return this.#y(e, t);
			case T.WaitForExpression: return this.#v(e, t);
			case T.CustomStep: return;
			default: return jt(t);
		}
	}
	#_(e, t) {
		e.appendLine(`await targetPage.goto(${A(t.url, e.getIndent())});`);
	}
	#v(e, t) {
		e.appendLine(`await ${t.frame ? "frame" : "targetPage"}.waitForFunction(${A(t.expression, e.getIndent())}, { timeout });`);
	}
	#y(e, t) {
		this.#e = !0, e.appendLine(`await waitForElement(${A(t, e.getIndent())}, ${t.frame ? "frame" : "targetPage"}, timeout);`);
	}
}, Pn = 5e3, Fn = "async function waitForElement(step, frame, timeout) {\n  const {\n    count = 1,\n    operator = '>=',\n    visible = true,\n    properties,\n    attributes,\n  } = step;\n  const compFn = {\n    '==': (a, b) => a === b,\n    '>=': (a, b) => a >= b,\n    '<=': (a, b) => a <= b,\n  }[operator];\n  await waitForFunction(async () => {\n    const elements = await querySelectorsAll(step.selectors, frame);\n    let result = compFn(elements.length, count);\n    const elementsHandle = await frame.evaluateHandle((...elements) => {\n      return elements;\n    }, ...elements);\n    await Promise.all(elements.map((element) => element.dispose()));\n    if (result && (properties || attributes)) {\n      result = await elementsHandle.evaluate(\n        (elements, properties, attributes) => {\n          for (const element of elements) {\n            if (attributes) {\n              for (const [name, value] of Object.entries(attributes)) {\n                if (element.getAttribute(name) !== value) {\n                  return false;\n                }\n              }\n            }\n            if (properties) {\n              if (!isDeepMatch(properties, element)) {\n                return false;\n              }\n            }\n          }\n          return true;\n\n          function isDeepMatch(a, b) {\n            if (a === b) {\n              return true;\n            }\n            if ((a && !b) || (!a && b)) {\n              return false;\n            }\n            if (!(a instanceof Object) || !(b instanceof Object)) {\n              return false;\n            }\n            for (const [key, value] of Object.entries(a)) {\n              if (!isDeepMatch(value, b[key])) {\n                return false;\n              }\n            }\n            return true;\n          }\n        },\n        properties,\n        attributes\n      );\n    }\n    await elementsHandle.dispose();\n    return result === visible;\n  }, timeout);\n}\n\nasync function querySelectorsAll(selectors, frame) {\n  for (const selector of selectors) {\n    const result = await querySelectorAll(selector, frame);\n    if (result.length) {\n      return result;\n    }\n  }\n  return [];\n}\n\nasync function querySelectorAll(selector, frame) {\n  if (!Array.isArray(selector)) {\n    selector = [selector];\n  }\n  if (!selector.length) {\n    throw new Error('Empty selector provided to querySelectorAll');\n  }\n  let elements = [];\n  for (let i = 0; i < selector.length; i++) {\n    const part = selector[i];\n    if (i === 0) {\n      elements = await frame.$$(part);\n    } else {\n      const tmpElements = elements;\n      elements = [];\n      for (const el of tmpElements) {\n        elements.push(...(await el.$$(part)));\n      }\n    }\n    if (elements.length === 0) {\n      return [];\n    }\n    if (i < selector.length - 1) {\n      const tmpElements = [];\n      for (const el of elements) {\n        const newEl = (await el.evaluateHandle(el => el.shadowRoot ? el.shadowRoot : el)).asElement();\n        if (newEl) {\n          tmpElements.push(newEl);\n        }\n      }\n      elements = tmpElements;\n    }\n  }\n  return elements;\n}\n\nasync function waitForFunction(fn, timeout) {\n  let isActive = true;\n  const timeoutId = setTimeout(() => {\n    isActive = false;\n  }, timeout);\n  while (isActive) {\n    const result = await fn();\n    if (result) {\n      clearTimeout(timeoutId);\n      return;\n    }\n    await new Promise(resolve => setTimeout(resolve, 100));\n  }\n  throw new Error('Timed out');\n}", In = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", Ln = In.split("").reduce((e, t, n) => (e.set(t, n), e), /* @__PURE__ */ new Map()), Rn = 31, zn = 32, Bn = 2147483647;
function Vn(e) {
	if (e < 0) throw Error("Only postive integers and zero are supported");
	if (e > Bn) throw Error("Only integers between 0 and 2147483647 are supported");
	let t = [];
	do {
		let n = e & Rn;
		e >>>= 5, e > 0 && (n |= zn), t.push(In[n]);
	} while (e !== 0);
	return t.join("");
}
function Hn(e) {
	let t = [];
	for (let n of e) t.push(Vn(n));
	return t.join("");
}
function Un(e) {
	let t = [], n = e.split(""), r = 0, i = 0;
	for (let e of n) {
		let n = Ln.get(e);
		r |= (n & Rn) << i, i += 5, n & zn || (t.push(r), r = 0, i = 0);
	}
	return t;
}
var Wn = "//# recorderSourceMap=";
async function Gn(e, t) {
	t ||= {};
	let n = t.extension ?? new Nn(), r = t.writer ?? new On(t.indentation ?? "  ");
	await n.beforeAllSteps?.(r, e);
	let i = [1];
	for (let t of e.steps) {
		let a = r.getSize();
		await n.beforeEachStep?.(r, t, e), await n.stringifyStep(r, t, e), await n.afterEachStep?.(r, t, e);
		let o = r.getSize();
		i.push(a, o - a);
	}
	return await n.afterAllSteps?.(r, e), r.appendLine(Wn + Hn(i)), r.toString();
}
async function Kn(e, t) {
	t ||= {};
	let n = t.extension;
	n ||= new Nn(), t.indentation || (t.indentation = "  ");
	let r = t.writer ?? new On(t.indentation ?? "  ");
	return await n.beforeEachStep?.(r, e), await n.stringifyStep(r, e), await n.afterEachStep?.(r, e), r.toString();
}
function qn(e) {
	return e.trim().startsWith(Wn);
}
function Jn(e) {
	let t = e.split("\n");
	for (let e = t.length - 1; e >= 0; e--) {
		let n = t[e];
		if (qn(n)) return Un(n.trim().substring(22));
	}
}
function Yn(e) {
	return e.split("\n").filter((e) => !qn(e)).join("\n");
}
var Xn = class {
	async beforeAllSteps(e) {}
	async afterAllSteps(e) {}
	async beforeEachStep(e, t) {}
	async runStep(e, t) {}
	async afterEachStep(e, t) {}
}, Zn = {
	"==": (e, t) => e === t,
	">=": (e, t) => e >= t,
	"<=": (e, t) => e <= t
};
function Qn(e) {
	return new Promise((t) => {
		setTimeout(t, e);
	});
}
var $n = class extends Xn {
	browser;
	page;
	timeout;
	constructor(e, t, n) {
		super(), this.browser = e, this.page = t, this.timeout = n?.timeout || 5e3;
	}
	async #e(e) {
		try {
			await e._client().send("Emulation.setAutomationOverride", { enabled: !0 });
		} catch {}
	}
	#t(e, t) {
		return e.timeout || t?.timeout || this.timeout;
	}
	async runStep(e, t) {
		let n = this.#t(e, t), r = this.page, i = this.browser, a = await nr(i, r, e, n), o = null;
		!a && e.target && (o = await r.waitForFrame(e.target, { timeout: n }));
		let s = o || a;
		if (!s) throw Error("Target is not found for step: " + JSON.stringify(e));
		await this.#e(s);
		let c = await tr(s, e);
		await this.runStepInFrame(e, r, s, c, n);
	}
	async runStepInFrame(e, t, n, r, i) {
		let a = null, o = () => {
			a = rr(r, e, i);
		}, s = this.page.locatorRace;
		switch (e.type) {
			case T.DoubleClick:
				await s(e.selectors.map((e) => r.locator(Tn(e)))).setTimeout(i).on("action", () => o()).click({
					count: 2,
					button: e.button && Nt.get(e.button),
					delay: e.duration,
					offset: {
						x: e.offsetX,
						y: e.offsetY
					}
				});
				break;
			case T.Click:
				await s(e.selectors.map((e) => r.locator(Tn(e)))).setTimeout(i).on("action", () => o()).click({
					delay: e.duration,
					button: e.button && Nt.get(e.button),
					offset: {
						x: e.offsetX,
						y: e.offsetY
					}
				});
				break;
			case T.Hover:
				await s(e.selectors.map((e) => r.locator(Tn(e)))).setTimeout(i).on("action", () => o()).hover();
				break;
			case T.EmulateNetworkConditions:
				{
					o();
					let { download: n, upload: r, latency: i } = e;
					await t.emulateNetworkConditions({
						offline: !n && !r,
						download: n,
						upload: r,
						latency: i
					});
				}
				break;
			case T.KeyDown:
				o(), await t.keyboard.down(e.key), await Qn(100);
				break;
			case T.KeyUp:
				o(), await t.keyboard.up(e.key), await Qn(100);
				break;
			case T.Close:
				"close" in n && (o(), await n.close());
				break;
			case T.Change:
				await s(e.selectors.map((e) => r.locator(Tn(e)))).on("action", () => o()).setTimeout(i).fill(e.value);
				break;
			case T.SetViewport:
				"setViewport" in n && (o(), await n.setViewport(e));
				break;
			case T.Scroll:
				"selectors" in e ? await s(e.selectors.map((e) => r.locator(Tn(e)))).on("action", () => o()).setTimeout(i).scroll({
					scrollLeft: e.x || 0,
					scrollTop: e.y || 0
				}) : (o(), await r.evaluate((e, t) => {
					/* c8 ignore start */
					window.scroll(e, t);
					/* c8 ignore stop */
				}, e.x || 0, e.y || 0));
				break;
			case T.Navigate:
				o(), await r.goto(e.url);
				break;
			case T.WaitForElement:
				try {
					o(), await ir(e, r, i);
				} catch (e) {
					throw e.message === "Timed out" ? Error("waitForElement timed out. The element(s) could not be found.") : e;
				}
				break;
			case T.WaitForExpression:
				o(), await r.waitForFunction(e.expression, { timeout: i });
				break;
			case T.CustomStep: break;
			default: jt(e);
		}
		await a;
	}
}, er = class extends $n {
	async afterAllSteps() {
		await this.browser.close();
	}
};
async function tr(e, t) {
	let n = "mainFrame" in e ? e.mainFrame() : e;
	if ("frame" in t && t.frame) for (let e of t.frame) n = n.childFrames()[e];
	return n;
}
async function nr(e, t, n, r) {
	if (!n.target || n.target === "main") return t;
	let i = await (await e.waitForTarget((e) => e.url() === n.target, { timeout: r })).page();
	return i ? (i.setDefaultTimeout(r), i) : null;
}
async function rr(e, t, n) {
	let r = [];
	if (t.assertedEvents) for (let i of t.assertedEvents) switch (i.type) {
		case E.Navigation:
			r.push(e.waitForNavigation({ timeout: n }));
			continue;
		default: throw Error(`Event type ${i.type} is not supported`);
	}
	await Promise.all(r);
}
async function ir(e, t, n) {
	let { count: r = 1, operator: i = ">=", visible: a = !0, properties: o, attributes: s } = e, c = Zn[i];
	await sr(async () => {
		let n = await ar(e.selectors, t), i = c(n.length, r), l = await t.evaluateHandle((...e) => e, ...n);
		return await Promise.all(n.map((e) => e.dispose())), i && (o || s) && (i = await l.evaluate((e, t, n) => {
			if (n) {
				for (let t of e) for (let [e, r] of Object.entries(n)) if (t.getAttribute(e) !== r) return !1;
			}
			if (t) {
				for (let n of e) if (!r(t, n)) return !1;
			}
			return !0;
			function r(e, t) {
				if (e === t) return !0;
				if (e && !t || !e && t || !(e instanceof Object) || !(t instanceof Object)) return !1;
				for (let [n, i] of Object.entries(e)) if (!r(i, t[n])) return !1;
				return !0;
			}
		}, o, s)), await l.dispose(), i === a;
	}, n);
}
async function ar(e, t) {
	for (let n of e) {
		let e = await or(n, t);
		if (e.length) return e;
	}
	return [];
}
async function or(e, t) {
	if (Array.isArray(e) || (e = [e]), !e.length) throw Error("Empty selector provided to querySelectorAll");
	let n = await t.$$(e[0]);
	if (!n.length) return [];
	for (let t of e.slice(1, e.length)) if (n = (await Promise.all(n.map(async (e) => {
		let n = await e.evaluateHandle((e) => e.shadowRoot ? e.shadowRoot : e), r = await n.$$(t);
		return n.dispose(), e.dispose(), r;
	}))).flat(), !n.length) return [];
	return n;
}
async function sr(e, t) {
	let n = !0, r = setTimeout(() => {
		n = !1;
	}, t);
	for (; n;) {
		if (await e()) {
			clearTimeout(r);
			return;
		}
		await new Promise((e) => setTimeout(e, 100));
	}
	throw Error("Timed out");
}
async function cr(e, t, n) {
	await e.beforeEachStep?.(t, n), await e.runStep(t, n), await e.afterEachStep?.(t, n);
}
var lr = class {
	#e;
	#t;
	#n = !1;
	constructor(e) {
		this.#t = e;
	}
	abort() {
		this.#n = !0;
	}
	set flow(e) {
		this.#e = e;
	}
	async runBeforeAllSteps(e) {
		await this.#t.beforeAllSteps?.(e);
	}
	async runAfterAllSteps(e) {
		await this.#t.afterAllSteps?.(e);
	}
	async runStep(e) {
		await cr(this.#t, e);
	}
	async run() {
		if (!this.#e) throw Error("Set the flow on the runner instance before calling `run`.");
		let e = this.#e;
		if (this.#n = !1, await this.#t.beforeAllSteps?.(e), this.#n) return !1;
		for (let t of e.steps) {
			if (this.#n) return await this.#t.afterAllSteps?.(e), !1;
			await cr(this.#t, t, e);
		}
		return await this.#t.afterAllSteps?.(e), !0;
	}
};
async function ur(e, t) {
	let n = e instanceof Xn ? e : t, r = e instanceof Xn ? void 0 : e, i = new lr(n ?? await dr());
	return r && (i.flow = r), i;
}
async function dr() {
	let { default: e } = await import("./_dsh-devtools_empty-BvRk9kiK.js"), t = await e.launch();
	return new er(t, await t.newPage());
}
var fr = class extends En {
	async beforeAllSteps(e) {
		e.appendLine("import url from 'url';"), e.appendLine("import { createRunner } from '@puppeteer/replay';"), e.appendLine(""), e.appendLine("export async function run(extension) {").startBlock(), e.appendLine("const runner = await createRunner(extension);"), e.appendLine(""), e.appendLine("await runner.runBeforeAllSteps();"), e.appendLine("");
	}
	async afterAllSteps(e) {
		e.appendLine(""), e.appendLine("await runner.runAfterAllSteps();").endBlock().appendLine("}"), e.appendLine(""), e.appendLine("if (process && import.meta.url === url.pathToFileURL(process.argv[1]).href) {").startBlock().appendLine("run()").endBlock().appendLine("}");
	}
	async stringifyStep(e, t) {
		e.appendLine(`await runner.runStep(${A(t, e.getIndent())});`);
	}
};
function pr(e) {
	return !!(e.type === T.Navigate || e.assertedEvents?.some((e) => e.type === E.Navigation));
}
function mr(e) {
	for (let t of e.steps) if (t.type === T.SetViewport) return t.isMobile;
	return !1;
}
var hr = class extends Nn {
	#e = !1;
	async beforeAllSteps(e, t) {
		e.appendLine("import fs from 'fs';"), await super.beforeAllSteps(e, t), e.appendLine("const lhApi = await import('lighthouse'); // v10.0.0 or later"), e.appendLine(`const flags = ${A({ screenEmulation: { disabled: !0 } }, e.getIndent())}`), mr(t) ? e.appendLine("const config = undefined;") : e.appendLine("const config = lhApi.desktopConfig;"), e.appendLine(`const lhFlow = await lhApi.startFlow(page, {name: ${A(t.title, e.getIndent())}, config, flags});`);
	}
	async stringifyStep(e, t, n) {
		if (t.type === T.SetViewport) {
			await super.stringifyStep(e, t, n);
			return;
		}
		let r = pr(t);
		r ? (this.#e &&= (e.appendLine("await lhFlow.endTimespan();"), !1), e.appendLine("await lhFlow.startNavigation();")) : this.#e ||= (e.appendLine("await lhFlow.startTimespan();"), !0), await super.stringifyStep(e, t, n), r && e.appendLine("await lhFlow.endNavigation();");
	}
	async afterAllSteps(e, t) {
		this.#e && e.appendLine("await lhFlow.endTimespan();"), e.appendLine("const lhFlowReport = await lhFlow.generateReport();"), e.appendLine("fs.writeFileSync(import.meta.dirname + '/flow.report.html', lhFlowReport)"), await super.afterAllSteps(e, t);
	}
}, j = /* @__PURE__ */ function(e) {
	return e.NORMAL = "normal", e.SLOW = "slow", e.VERY_SLOW = "very_slow", e.EXTREMELY_SLOW = "extremely_slow", e;
}({}), gr = {
	normal: 0,
	slow: 500,
	very_slow: 1e3,
	extremely_slow: 2e3
}, _r = /* @__PURE__ */ function(e) {
	return e.FAILURE = "Failure", e.SUCCESS = "Success", e;
}({});
function vr(e) {
	return o(e.url, "devtools:") || e.type === "page" || e.type === "background_page" || e.type === "webview";
}
function yr(e) {
	if (![
		"http:",
		"https:",
		"data:"
	].some((t) => o(e, t)) && e !== "about:blank") throw Error(`Navigation to ${e} is not allowed, due to blocked schema`);
}
var br = class e extends a {
	userFlow;
	speed;
	timeout;
	breakpointIndexes;
	steppingOver = !1;
	aborted = !1;
	#e = Promise.withResolvers();
	#t = Promise.withResolvers();
	#n;
	constructor(e, { speed: t, breakpointIndexes: n = /* @__PURE__ */ new Set() }) {
		super(), this.userFlow = e, this.speed = t, this.timeout = e.timeout || 5e3, this.breakpointIndexes = n;
	}
	#r() {
		this.#e.resolve(), this.#e = Promise.withResolvers();
	}
	static async connectPuppeteer() {
		let e = He.instance().rootTarget();
		if (!e) throw Error("Could not find the root target");
		let t = He.instance().primaryPageTarget();
		if (!t) throw Error("Could not find the primary page target");
		let n = t.model(Ne);
		if (!n) throw Error("Could not get childTargetManager");
		let r = t.model(ve);
		if (!r) throw Error("Could not get resource tree model");
		if (!r.mainFrame) throw Error("Could not find main frame");
		let i = e.model(Ne);
		if (!i) throw Error("Could not find the child target manager class for the root target");
		let a = e.router()?.connection;
		if (!a) throw Error("Expected root target to have a router");
		let o = await n.getParentTargetId(), s = await i.getParentTargetId(), { sessionId: c } = await e.targetAgent().invoke_attachToTarget({
			targetId: s,
			flatten: !0
		}), { page: l, browser: u, puppeteerConnection: d } = await Ct.connectPuppeteerToConnectionViaTab({
			connection: a,
			targetId: s,
			sessionId: c,
			isPageTargetCallback: vr
		});
		if (!l) throw Error("could not find main page!");
		return u.on("targetdiscovered", (e) => {
			e.type === "page" && e.targetId !== o && e.openerId === o && d._createSession(e, !0);
		}), {
			page: l,
			browser: u
		};
	}
	static async disconnectPuppeteer(e) {
		try {
			let t = await e.pages();
			for (let e of t) {
				let t = e._client();
				await t.send("Network.disable"), await t.send("Page.disable"), await t.send("Log.disable"), await t.send("Performance.disable"), await t.send("Runtime.disable"), await t.send("Emulation.clearDeviceMetricsOverride"), await t.send("Emulation.setAutomationOverride", { enabled: !1 });
				for (let t of e.frames()) {
					let e = t.client;
					await e.send("Network.disable"), await e.send("Page.disable"), await e.send("Log.disable"), await e.send("Performance.disable"), await e.send("Runtime.disable"), await e.send("Emulation.setAutomationOverride", { enabled: !1 });
				}
			}
			await e.disconnect();
		} catch (e) {
			console.error("Error disconnecting Puppeteer", e.message);
		}
	}
	async stop() {
		await Promise.race([this.#e.promise, this.#t.promise]);
	}
	get abortPromise() {
		return this.#t.promise;
	}
	abort() {
		this.aborted = !0, this.#t.resolve(), this.#n?.abort();
	}
	disposeForTesting() {
		this.#e.resolve(), this.#t.resolve();
	}
	continue() {
		this.steppingOver = !1, this.#r();
	}
	stepOver() {
		this.steppingOver = !0, this.#r();
	}
	updateBreakpointIndexes(e) {
		this.breakpointIndexes = e;
	}
	async play() {
		let { page: t, browser: n } = await e.connectPuppeteer();
		this.aborted = !1;
		let r = this;
		class i extends $n {
			#i;
			constructor(e, t, { timeout: n, speed: r }) {
				super(e, t, { timeout: n }), this.#i = r;
			}
			async beforeEachStep(e, t) {
				let { resolve: n, promise: i } = Promise.withResolvers();
				r.dispatchEventToListeners("Step", {
					step: e,
					resolve: n
				}), await i;
				let a = t.steps.indexOf(e), o = r.steppingOver || r.breakpointIndexes.has(a), s = e.type !== "setViewport" && e.type !== "navigate" && !r.aborted;
				o ? (r.dispatchEventToListeners("Stop"), await r.stop(), r.dispatchEventToListeners("Continue")) : s && await Promise.race([new Promise((e) => setTimeout(e, gr[this.#i])), r.abortPromise]);
			}
			async runStep(e, n) {
				(!o(t?.url(), "devtools:") || e.type !== "setViewport" && e.type !== "navigate") && (e.type === "navigate" && yr(e.url), await this.page.bringToFront(), await super.runStep(e, n));
			}
		}
		let a = new i(n, t, {
			timeout: this.timeout,
			speed: this.speed
		});
		this.#n = await ur(this.userFlow, a);
		let s;
		try {
			await this.#n.run();
		} catch (e) {
			s = e, console.error("Replay error", e.message);
		} finally {
			await e.disconnectPuppeteer(n);
		}
		this.aborted ? this.dispatchEventToListeners("Abort") : s ? this.dispatchEventToListeners("Error", s) : this.dispatchEventToListeners("Done");
	}
}, xr = /* @__PURE__ */ function(e) {
	return e.ABORT = "Abort", e.DONE = "Done", e.STEP = "Step", e.STOP = "Stop", e.ERROR = "Error", e.CONTINUE = "Continue", e;
}({}), Sr = { defaultRecordingName: "Recording {DATE} at {TIME}" }, Cr = i("panels/recorder/models/RecorderSettings.ts", Sr), wr = n.bind(void 0, Cr), Tr = class {
	#e = s.instance().createSetting("recorder-selector-attribute", "");
	#t = s.instance().createSetting("recorder-panel-replay-speed", j.NORMAL);
	#n = s.instance().createSetting("recorder-panel-replay-extension", "");
	#r = /* @__PURE__ */ new Map();
	#i = s.instance().createSetting("recorder-preferred-copy-format", C.JSON);
	constructor() {
		for (let e of Object.values(w)) this.#r.set(e, s.instance().createSetting(`recorder-${e}-selector-enabled`, !0));
	}
	get selectorAttribute() {
		return this.#e.get();
	}
	set selectorAttribute(e) {
		this.#e.set(e);
	}
	get speed() {
		return this.#t.get();
	}
	set speed(e) {
		this.#t.set(e);
	}
	get replayExtension() {
		return this.#n.get();
	}
	set replayExtension(e) {
		this.#n.set(e);
	}
	get defaultTitle() {
		let e = /* @__PURE__ */ new Date();
		return wr(Sr.defaultRecordingName, {
			DATE: e.toLocaleDateString(),
			TIME: e.toLocaleTimeString()
		});
	}
	get defaultSelectors() {
		return Object.values(w).filter((e) => this.getSelectorByType(e));
	}
	getSelectorByType(e) {
		return this.#r.get(e)?.get();
	}
	setSelectorByType(e, t) {
		this.#r.get(e)?.set(t);
	}
	get preferredCopyFormat() {
		return this.#i.get();
	}
	set preferredCopyFormat(e) {
		this.#i.set(e);
	}
}, Er = class {
	#e;
	#t = null;
	#n;
	constructor(e = 200) {
		this.#n = e, this.#e = new AbortController();
	}
	#r() {
		this.#e.abort(), this.#t && clearTimeout(this.#t), this.#e = new AbortController();
	}
	#i(e) {
		this.#r(), e();
	}
	handleShortcut(e) {
		this.#r(), document.addEventListener("keyup", (t) => {
			be.eventHasCtrlEquivalentKey(t) && this.#i(e);
		}, { signal: this.#e.signal }), this.#t = setTimeout(() => this.#i(e), this.#n);
	}
}, Dr = class {
	#e = new st();
	#t = 0;
	#n;
	#r;
	#i;
	constructor(e, t) {
		this.#r = e, this.#i = t;
	}
	async acquire() {
		return await this.#e.run(async () => {
			this.#t === 0 && (this.#n = await this.#r()), ++this.#t;
		}), [this.#n, this.#a.bind(this, { released: !1 })];
	}
	async run(e) {
		let [t, n] = await this.acquire();
		try {
			return await e(t);
		} finally {
			await n();
		}
	}
	async #a(e) {
		if (e.released) throw Error("Attempted to release object multiple times.");
		try {
			e.released = !0, await this.#e.run(async () => {
				this.#t === 1 && (await this.#i(this.#n), this.#n = void 0), --this.#t;
			});
		} catch (t) {
			throw e.released = !1, t;
		}
	}
}, M = "devtools_recorder", Or = class {
	static #e;
	static async get() {
		return this.#e ||= (await fetch(new URL("../injected/injected.generated.js", new URL("panels/recorder/util/util.js", typeof document < "u" ? document.baseURI : new URL("../../", self.location.href).href).href))).text(), await this.#e;
	}
};
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/recorder/models/SchemaUtils.ts
function kr(e) {
	return {
		type: T.SetViewport,
		width: e.clientWidth,
		height: e.clientHeight,
		deviceScaleFactor: 1,
		isMobile: !1,
		hasTouch: !1,
		isLandscape: !1
	};
}
function Ar(e) {
	return {
		type: T.EmulateNetworkConditions,
		download: e.download,
		upload: e.upload,
		latency: e.latency
	};
}
function jr(e, t) {
	return "selectors" in e && "selectors" in t ? JSON.stringify(e.selectors) === JSON.stringify(t.selectors) : !("selectors" in e) && !("selectors" in t);
}
var Mr = 3e4, Nr = Cn, Pr = vn;
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/recorder/models/SDKUtils.ts
function Fr(e) {
	return He.instance().primaryPageTarget() === e || e.id() === "main" ? "main" : e.inspectedURL();
}
function Ir(e, t) {
	let n = [];
	for (; t;) {
		let e = t.sameTargetParentFrame();
		if (!e) break;
		let r = e.childFrames.indexOf(t);
		n.unshift(r), t = e;
	}
	return {
		target: Fr(e),
		frame: n
	};
}
async function Lr(e, t, n) {
	let r = t.model(f).executionContexts(), i = t.model(ve);
	for (let a of i.frames()) {
		if (!r.find((e) => e.frameId === a.id)) continue;
		let { executionContextId: i } = await t.pageAgent().invoke_createIsolatedWorld({
			frameId: a.id,
			worldName: e
		});
		await t.runtimeAgent().invoke_evaluate({
			expression: n,
			includeCommandLineAPI: !0,
			contextId: i
		});
	}
}
function Rr(e, t) {
	for (let n of e) {
		let e = n.model(f);
		if (e) {
			for (let r of e.executionContexts()) if (r.id === t) return n;
		}
	}
}
function zr(e, t) {
	for (let n of e) {
		let e = n.model(f);
		if (e) {
			for (let n of e.executionContexts()) if (n.id === t && n.frameId !== void 0) return n.frameId;
		}
	}
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/recorder/models/RecordingSession.ts
var Br = at, Vr = /* @__PURE__ */ new Set([
	"typed",
	"address_bar",
	"auto_bookmark",
	"auto_subframe",
	"generated",
	"auto_toplevel",
	"reload",
	"keyword",
	"keyword_generated"
]), Hr = (e) => {
	let t = [];
	for (let n of e) for (let e of n) {
		let n = {
			meta: !1,
			ctrl: !1,
			shift: !1,
			alt: !1,
			keyCode: -1
		}, { keyCode: r, modifiers: i } = be.keyCodeAndModifiersFromKey(e);
		n.keyCode = r;
		let a = ie;
		n.ctrl = !!(i & a.Ctrl.value), n.meta = !!(i & a.Meta.value), n.shift = !!(i & a.Shift.value), n.shift = !!(i & a.Alt.value), n.keyCode !== -1 && t.push(n);
	}
	return t;
}, Ur = async (e, t, n) => {
	await Promise.all(t.map((t) => Lr(e, t, n)));
}, Wr = Object.freeze({
	addStep: "addStep",
	stopShortcut: "stopShortcut"
}), Gr = class e extends a {
	#e;
	#t;
	#n;
	#r;
	#i;
	#a = /* @__PURE__ */ new Map();
	#o = /* @__PURE__ */ new Map();
	#s = /* @__PURE__ */ new Map();
	#c = /* @__PURE__ */ new Map();
	#l = /* @__PURE__ */ new Map();
	#u = /* @__PURE__ */ new Map();
	#d = new st();
	#f;
	#p = /* @__PURE__ */ new Map();
	#m = !1;
	#h = [];
	constructor(e, t) {
		super(), this.#e = e, this.#t = e.pageAgent(), this.#n = e.targetAgent(), this.#r = We.instance();
		let n = e.model(ve);
		if (!n) throw Error("ResourceTreeModel is missing for the target: " + e.id());
		this.#i = n, this.#e = e, this.#f = {
			title: t.title,
			selectorAttribute: t.selectorAttribute,
			steps: []
		}, this.#h = t.selectorTypesToRecord;
	}
	cloneUserFlow() {
		return structuredClone(this.#f);
	}
	overwriteUserFlow(e) {
		this.#f = structuredClone(e);
	}
	async start() {
		if (this.#m) throw Error("The session has started");
		this.#m = !0, this.#r.addEventListener(We.Events.CONDITIONS_CHANGED, this.#v, this), await this.#g(), await this.#t.invoke_bringToFront(), await this.#M(this.#e);
	}
	async stop() {
		await this.#x(), this.#d.acquire(), await Promise.all([...this.#a.values()].map(this.#N)), this.#r.removeEventListener(We.Events.CONDITIONS_CHANGED, this.#v, this);
	}
	async #g() {
		let e = this.#i.mainFrame;
		if (!e) throw Error("Could not find mainFrame.");
		this.#r.networkConditions() !== Re && this.#v();
		let { cssLayoutViewport: t } = await this.#e.pageAgent().invoke_getLayoutMetrics();
		this.#w(kr(t));
		let n = await this.#i.navigationHistory();
		if (n) {
			let e = n.entries[n.currentIndex];
			this.#o.set(this.#e.id(), e.id), this.#s.set(this.#e.id(), n.entries.map((e) => e.id)), this.#f.steps.push({
				type: T.Navigate,
				url: e.url,
				assertedEvents: [{
					type: E.Navigation,
					url: e.url,
					title: e.title
				}]
			});
		} else this.#f.steps.push({
			type: T.Navigate,
			url: e.url,
			assertedEvents: [{
				type: E.Navigation,
				url: e.url,
				title: await this.#_(this.#e)
			}]
		});
		this.#x();
	}
	async #_(e) {
		return (await e.runtimeAgent().invoke_evaluate({ expression: "document.title" })).result?.value || "";
	}
	#v() {
		let e = this.#r.networkConditions();
		this.#w(Ar(e));
	}
	#y;
	#b = [];
	#x() {
		return this.#y && clearTimeout(this.#y), this.#y = setTimeout(() => {
			this.dispatchEventToListeners("recordingupdated", structuredClone(this.#f)), this.#y = void 0;
			for (let e of this.#b) e();
			this.#b.length = 0;
		}, 100), new Promise((e) => {
			this.#b.push(e);
		});
	}
	get #S() {
		return this.#f.steps.slice(-1)[0];
	}
	#C = /* @__PURE__ */ new Set();
	#w(e) {
		switch (e.type) {
			case "doubleClick":
				for (let t = this.#f.steps.length - 1; t > 0; t--) {
					let n = this.#f.steps[t];
					if (n.type === "click") {
						e.selectors = n.selectors, this.#f.steps.splice(t, 1);
						break;
					}
				}
				break;
			case "change": {
				let t = this.#S;
				if (!t) break;
				switch (t.type) {
					case "change":
						if (!jr(e, t)) break;
						this.#f.steps[this.#f.steps.length - 1] = e, this.#x();
						return;
					case "keyDown":
						this.#C.add(t.key), this.#f.steps.pop(), this.#w(e);
						return;
				}
				break;
			}
			case "keyDown":
				if (this.#C.has(e.key)) return;
				break;
			case "keyUp": if (this.#C.has(e.key)) {
				this.#C.delete(e.key);
				return;
			}
		}
		this.#f.steps.push(e), this.#x();
	}
	#T(e, t) {
		let n = this.#f.steps[this.#f.steps.length - 1];
		if (n && !n.assertedEvents?.find((e) => e.type === E.Navigation)) {
			let r = e.target || "main", i = (e.frame || []).join(","), a = n.target || "main", o = (("frame" in n ? n.frame : []) || []).join(",");
			r === a && i === o && (n.assertedEvents = [{ type: E.Navigation }], this.#p.set(t.id(), n), this.#x());
		}
	}
	#E(e, t) {
		let n = this.#p.get(e.id());
		if (!n) return;
		let r = n;
		if (!r.assertedEvents) return;
		let i = r.assertedEvents.find((e) => e.type === E.Navigation);
		i && !i.url && (i.url = t.url, i.title = t.title, this.#x());
	}
	#D(e) {
		let t = Number(e.data.payload);
		for (let e = 0; e < t - 1; e++) this.#f.steps.pop();
		this.dispatchEventToListeners("recordingstopped", structuredClone(this.#f));
	}
	#O(e, t) {
		switch (t.data.name) {
			case Wr.stopShortcut:
				this.#D(t);
				return;
			case Wr.addStep:
				this.#k(e, t);
				return;
			default: return;
		}
	}
	#k(e, t) {
		let n = t.data.executionContextId, r, i = e.model(f);
		if (i) {
			for (let e of i.executionContexts()) if (e.id === n) {
				r = e.frameId;
				break;
			}
		}
		if (!r) throw Error("No execution context found for the binding call + " + JSON.stringify(t.data));
		let a = JSON.parse(t.data.payload), o = e.model(ve).frameForId(r);
		if (!o) throw Error("Could not find frame.");
		let s = Ir(e, o);
		if (a.type === "beforeUnload") {
			this.#T(s, e);
			return;
		}
		switch (a.type) {
			case "change":
				this.#w({
					type: "change",
					value: a.value,
					selectors: a.selectors,
					frame: s.frame.length ? s.frame : void 0,
					target: s.target
				});
				break;
			case "doubleClick":
				this.#w({
					type: "doubleClick",
					target: s.target,
					selectors: a.selectors,
					offsetY: a.offsetY,
					offsetX: a.offsetX,
					frame: s.frame.length ? s.frame : void 0,
					deviceType: a.deviceType,
					button: a.button
				});
				break;
			case "click":
				this.#w({
					type: "click",
					target: s.target,
					selectors: a.selectors,
					offsetY: a.offsetY,
					offsetX: a.offsetX,
					frame: s.frame.length ? s.frame : void 0,
					duration: a.duration,
					deviceType: a.deviceType,
					button: a.button
				});
				break;
			case "keyUp":
				this.#w({
					type: "keyUp",
					key: a.key,
					frame: s.frame.length ? s.frame : void 0,
					target: s.target
				});
				break;
			case "keyDown":
				this.#w({
					type: "keyDown",
					frame: s.frame.length ? s.frame : void 0,
					target: s.target,
					key: a.key
				});
				break;
			default: throw Error("Unhandled client event");
		}
	}
	#A() {
		return Hr(te.instance().shortcutsForAction("chrome-recorder.start-recording").map((e) => e.descriptors.map((e) => e.key)));
	}
	static get #j() {
		try {
			return s.instance().settingForTest("untrusted-recorder-events"), !0;
		} catch {}
		return !1;
	}
	#M = async (e) => {
		if (e.type() !== de.FRAME) return;
		this.#a.set(e.id(), e);
		let t = e.model(De);
		ot(t), await t.resumeModel(), await this.#P(e), await this.#I(e);
		let n = e.model(Ne);
		ot(n), this.#u.set(e, [
			n.addEventListener(Fe.TARGET_CREATED, this.#R.bind(this, e)),
			n.addEventListener(Fe.TARGET_DESTROYED, this.#z.bind(this, e)),
			n.addEventListener(Fe.TARGET_INFO_CHANGED, this.#B.bind(this, e))
		]), await Promise.all(n.childTargets().map(this.#M));
	};
	#N = async (e) => {
		let t = this.#u.get(e);
		t && ke(t), await this.#L(e), await this.#F(e);
	};
	async #P(e) {
		let t = e.model(f);
		ot(t), this.#l.set(e, [t.addEventListener(nt.BindingCalled, this.#O.bind(this, e))]), await Promise.all(Object.values(Wr).map((e) => t.addBinding({
			name: e,
			executionContextName: M
		})));
	}
	async #F(e) {
		await Promise.all(Object.values(Wr).map((t) => e.runtimeAgent().invoke_removeBinding({ name: t })));
		let t = this.#l.get(e);
		t && ke(t);
	}
	async #I(t) {
		let n = `
      ${await Or.get()};DevToolsRecorder.startRecording({getAccessibleName, getAccessibleRole}, {
        debug: false,
        allowUntrustedEvents: ${e.#j},
        selectorTypesToRecord: ${JSON.stringify(this.#h)},
        selectorAttribute: ${this.#f.selectorAttribute ? Br(this.#f.selectorAttribute) : void 0},
        stopShortcuts: ${JSON.stringify(this.#A())},
      });
    `, [{ identifier: r }] = await Promise.all([t.pageAgent().invoke_addScriptToEvaluateOnNewDocument({
			source: n,
			worldName: M,
			includeCommandLineAPI: !0
		}), Lr(M, t, n)]);
		this.#c.set(t.id(), r);
	}
	async #L(e) {
		let t = this.#c.get(e.id());
		t && (await e.pageAgent().invoke_removeScriptToEvaluateOnNewDocument({ identifier: t }), await Ur(M, [...this.#a.values()], "DevToolsRecorder.stopRecording()"));
	}
	#R(e, t) {
		this.#V({
			type: "targetCreated",
			event: t,
			target: e
		});
	}
	#z(e, t) {
		let n = this.#a.get(t.data);
		n && this.#V({
			type: "targetClosed",
			event: t,
			target: n
		});
	}
	#B(e, t) {
		let n = this.#a.get(t.data.targetId) || e;
		this.#V({
			type: "targetInfoChanged",
			event: t,
			target: n
		});
	}
	#V(e) {
		return this.#d.run(async () => {
			try {
				switch (e.type) {
					case "targetClosed":
						await this.#U(e);
						break;
					case "targetCreated":
						await this.#H(e);
						break;
					case "targetInfoChanged": await this.#G(e);
				}
			} catch (e) {
				console.error("Error happened while processing recording events: ", e.message, e.stack);
			}
		});
	}
	async #H(e) {
		if (e.event.data.type !== "page" && e.event.data.type !== "iframe") return;
		await this.#n.invoke_attachToTarget({
			targetId: e.event.data.targetId,
			flatten: !0
		});
		let t = He.instance().targets().find((t) => t.id() === e.event.data.targetId);
		if (!t) throw Error("Could not find target.");
		await this.#M(t), window.dispatchEvent(new Event("recorderAttachedToTarget"));
	}
	async #U(e) {
		let t = this.#p.get(e.target.id());
		t && (delete t.assertedEvents, this.#p.delete(e.target.id()));
	}
	async #W(e, t) {
		let n = await e.navigationHistory();
		if (!n) return !1;
		let r = n.entries[n.currentIndex];
		if (this.#o.get(t.id()) === r.id) return !0;
		this.#o.set(t.id(), r.id);
		let i = this.#s.get(t.id()) || [];
		if (this.#s.set(t.id(), n.entries.map((e) => e.id)), Vr.has(r.transitionType) || i.includes(r.id)) {
			let e = this.#p.get(t.id());
			e && (delete e.assertedEvents, this.#p.delete(t.id())), this.#w({
				type: T.Navigate,
				url: r.url,
				assertedEvents: [{
					type: E.Navigation,
					url: r.url,
					title: r.title
				}]
			});
		} else this.#E(t, {
			type: E.Navigation,
			url: r.url,
			title: r.title
		});
		return !0;
	}
	async #G(e) {
		if (e.event.data.type !== "page" && e.event.data.type !== "iframe") return;
		let t = e.target, n = t.model(ve);
		if (!n) throw Error("ResourceTreeModel is missing in handleNavigation");
		if (e.event.data.type === "iframe") this.#E(t, {
			type: E.Navigation,
			url: e.event.data.url,
			title: await this.#_(t)
		});
		else if (e.event.data.type === "page") {
			if (await this.#W(n, t)) return;
			await this.#K(n, 500), this.#E(t, {
				type: E.Navigation,
				url: e.event.data.url,
				title: await this.#_(t)
			});
		}
	}
	async #K(e, t) {
		let { resolve: n, promise: r } = Promise.withResolvers(), i = () => {
			e.removeEventListener(u.DOMContentLoaded, i), n();
		};
		e.addEventListener(u.DOMContentLoaded, i), await Promise.any([r, new Promise((n) => setTimeout(() => {
			e.removeEventListener(u.DOMContentLoaded, i), n();
		}, t))]);
	}
}, Kr = /* @__PURE__ */ function(e) {
	return e.RECORDING_UPDATED = "recordingupdated", e.RECORDING_STOPPED = "recordingstopped", e;
}({}), qr = null, Jr = class {
	next() {
		return crypto.randomUUID();
	}
}, Yr = class e {
	#e;
	#t = new st();
	#n = new Jr();
	constructor() {
		this.#e = s.instance().createSetting("recorder-recordings-ng", []);
	}
	clearForTest() {
		this.#e.set([]), this.#n = new Jr();
	}
	setIdGeneratorForTest(e) {
		this.#n = e;
	}
	async upsertRecording(e, t) {
		let n = await this.#t.acquire();
		try {
			let n = await this.#e.forceGet();
			e.title = it(e.title, 300);
			let r = n.find((e) => e.storageName === t);
			return r ? r.flow = e : (r = {
				storageName: this.#n.next(),
				flow: e
			}, n.push(r)), this.#e.set(n), r;
		} finally {
			n();
		}
	}
	async deleteRecording(e) {
		let t = await this.#t.acquire();
		try {
			let t = await this.#e.forceGet();
			this.#e.set(t.filter((t) => t.storageName !== e));
		} finally {
			t();
		}
	}
	getRecording(e) {
		return this.#e.get().find((t) => t.storageName === e);
	}
	getRecordings() {
		return this.#e.get();
	}
	static instance() {
		return qr ||= new e(), qr;
	}
}, Xr = null, Zr = 52428800, Qr = class e {
	#e;
	#t;
	#n;
	constructor(e = Zr) {
		this.#e = s.instance().createSetting("recorder-screenshots", []), this.#t = this.#i(), this.#n = e;
	}
	clear() {
		this.#e.set([]), this.#t = /* @__PURE__ */ new Map();
	}
	getScreenshotForSection(e, t) {
		let n = this.#t.get(this.#r(e, t));
		return n ? (this.#a(n), n.data) : null;
	}
	storeScreenshotForSection(e, t, n) {
		let r = {
			recordingName: e,
			index: t,
			data: n
		};
		this.#t.set(this.#r(e, t), r), this.#a(r);
	}
	deleteScreenshotsForRecording(e) {
		for (let [t, n] of this.#t) n.recordingName === e && this.#t.delete(t);
		this.#a();
	}
	#r(e, t) {
		return `${e}:${t}`;
	}
	#i() {
		let e = /* @__PURE__ */ new Map(), t = this.#e.get();
		for (let n of t) e.set(this.#r(n.recordingName, n.index), n);
		return e;
	}
	#a(e) {
		if (e) {
			let t = this.#r(e.recordingName, e.index);
			this.#t.delete(t), this.#t.set(t, e);
		}
		let t = [], n = 0;
		for (let [e, r] of Array.from(this.#t.entries()).reverse()) n < this.#n ? (n += r.data.length, t.push(r)) : this.#t.delete(e);
		this.#e.set(t.reverse());
	}
	static instance(t = {
		forceNew: null,
		maxStorageSize: Zr
	}) {
		let { forceNew: n, maxStorageSize: r } = t;
		return (!Xr || n) && (Xr = new e(r)), Xr;
	}
}, $r = 160, ei = 240;
async function ti() {
	let e = He.instance().primaryPageTarget();
	if (!e) throw Error("Could not find main target");
	let { data: t } = await e.pageAgent().invoke_captureScreenshot({});
	return t ? "data:image/png;base64," + t : "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
}
async function ni(e) {
	let t = new Image(), n = new Promise((e) => {
		t.onload = e;
	});
	t.src = e, await n;
	let r = t.width / t.height, i = new OffscreenCanvas($r, Math.min(ei, $r / r)), a = i.getContext("2d", { willReadFrequently: !0 });
	if (!a) throw Error("Could not create context.");
	let o = await createImageBitmap(t, {
		resizeWidth: $r,
		resizeQuality: "high"
	});
	a.drawImage(o, 0, 0);
	let s = await i.convertToBlob({ type: "image/png" });
	return await new Promise((e, t) => {
		let n = new FileReader();
		n.onloadend = () => e(n.result), n.onerror = t, n.readAsDataURL(s);
	});
}
async function ri() {
	return await ni(await ti());
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/recorder/models/Section.ts
function ii(e) {
	let t = e.assertedEvents?.find((e) => e.type === "navigation");
	return e.type === "navigate" ? {
		title: t?.title || "",
		url: e.url,
		steps: [],
		causingStep: e
	} : t ? {
		title: t.title || "",
		url: t.url || "",
		steps: []
	} : null;
}
function ai(e) {
	let t = null, n = [];
	for (let r of e) {
		if (t) t.steps.push(r);
		else if (r.type === "navigate") {
			t = ii(r);
			continue;
		} else t = {
			title: "Current page",
			url: "",
			steps: [r]
		};
		let e = ii(r);
		e && (t && n.push(t), t = e);
	}
	return t && (!n.length || t.steps.length) && n.push(t), n;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/recorder/models/Tooltip.ts
function oi(e, t) {
	let n = e, r = te.instance().shortcutsForAction(t);
	for (let e of r) n += ` - ${e.title()}`;
	return n;
}
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/recorder/components/createRecordingView.css.mjs
var si = "/*\n * Copyright 2023 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n* {\n  margin: 0;\n  padding: 0;\n  outline: none;\n  box-sizing: border-box;\n  font-size: inherit;\n}\n\n.wrapper {\n  padding: 24px;\n  flex: 1;\n}\n\nh1 {\n  font-size: 18px;\n  line-height: 24px;\n  letter-spacing: 0.02em;\n  color: var(--sys-color-on-surface);\n  margin: 0;\n  font-weight: normal;\n}\n\n.row-label {\n  font-weight: 500;\n  font-size: 11px;\n  line-height: 16px;\n  letter-spacing: 0.8px;\n  text-transform: uppercase;\n  color: var(--sys-color-secondary);\n  margin-bottom: 8px;\n  margin-top: 32px;\n  display: flex;\n  align-items: center;\n  gap: 3px;\n}\n\n.footer {\n  display: flex;\n  justify-content: center;\n  border-top: 1px solid var(--sys-color-divider);\n  padding: 12px;\n  background: var(--sys-color-cdt-base-container);\n}\n\n.controls {\n  display: flex;\n}\n\n.error {\n  margin: 16px 0 0;\n  padding: 8px;\n  background: var(--sys-color-error-container);\n  color: var(--sys-color-error);\n}\n\n.row-label .link:focus-visible {\n  outline: var(--sys-color-state-focus-ring) auto 1px;\n}\n\n.header-wrapper {\n  display: flex;\n  align-items: baseline;\n  justify-content: space-between;\n}\n\n.checkbox-label {\n  display: inline-flex;\n  align-items: center;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  gap: 4px;\n  line-height: 1.1;\n  padding: 4px;\n}\n\n.checkbox-container {\n  display: flex;\n  flex-flow: row wrap;\n  gap: 10px;\n}\n\ninput[type=\"checkbox\"]:focus-visible {\n  outline: var(--sys-color-state-focus-ring) auto 1px;\n}\n\ndevtools-icon[name=\"help\"] {\n  width: 16px;\n  height: 16px;\n}\n", { html: ci, Directives: { ref: li, createRef: ui, repeat: di } } = m, N = {
	recordingName: "Recording name",
	startRecording: "Start recording",
	createRecording: "Create a new recording",
	recordingNameIsRequired: "Recording name is required",
	selectorAttribute: "Selector attribute",
	cancelRecording: "Cancel recording",
	selectorTypeCSS: "CSS",
	selectorTypePierce: "Pierce",
	selectorTypeARIA: "ARIA",
	selectorTypeText: "Text",
	selectorTypeXPath: "XPath",
	selectorTypes: "Selector types to record",
	includeNecessarySelectors: "You must choose CSS, Pierce, or XPath as one of your options. Only these selectors are guaranteed to be recorded since ARIA and text selectors may not be unique.",
	learnMore: "Learn more"
}, fi = i("panels/recorder/components/CreateRecordingView.ts", N), P = n.bind(void 0, fi), { widget: pi } = Be, mi = (e, t, n) => {
	let { name: r, selectorAttribute: i, selectorTypes: a, error: o, onUpdate: s, onRecordingStarted: c, onRecordingCancelled: u, onErrorReset: d } = e, f = ui(), ee = (e) => {
		o && d(), e.key === "Enter" && (c(), e.stopPropagation(), e.preventDefault());
	};
	t.focusInput = () => {
		f.value?.focus();
	};
	let te = /* @__PURE__ */ new Map([
		[w.ARIA, P(N.selectorTypeARIA)],
		[w.CSS, P(N.selectorTypeCSS)],
		[w.Text, P(N.selectorTypeText)],
		[w.XPath, P(N.selectorTypeXPath)],
		[w.Pierce, P(N.selectorTypePierce)]
	]);
	p(ci`
      <style>${si}</style>
      <style>${xt}</style>
      <style>${bt}</style>
      <div class="wrapper" jslog=${Ke("create-recording-view")}>
        <div class="header-wrapper">
          <h1>${P(N.createRecording)}</h1>
          <devtools-button
            title=${P(N.cancelRecording)}
            jslog=${me().track({ click: !0 })}
            .data=${{
		variant: l.ICON,
		size: Ce.SMALL,
		iconName: "cross"
	}}
            @click=${u}
          ></devtools-button>
        </div>
        <label class="row-label" for="user-flow-name">${P(N.recordingName)}</label>
        <input
          value=${r}
          @focus=${() => f.value?.select()}
          @keydown=${ee}
          jslog=${$e("user-flow-name").track({ change: !0 })}
          class="devtools-text-input"
          id="user-flow-name"
          ${li(f)}
          @input=${(e) => s({ name: e.target.value.trim() })}
        />
        <label class="row-label" for="selector-attribute">
          <span>${P(N.selectorAttribute)}</span>
          <devtools-link
            class="link" href="https://g.co/devtools/recorder#selector"
            title=${P(N.learnMore)}
            .jslogContext=${"recorder-selector-help"}>
            <devtools-icon name="help">
            </devtools-icon>
          </devtools-link>
        </label>
        <input
          value=${i}
          placeholder="data-testid"
          @keydown=${ee}
          jslog=${$e("selector-attribute").track({ change: !0 })}
          class="devtools-text-input"
          id="selector-attribute"
          @input=${(e) => s({ selectorAttribute: e.target.value.trim() })}
        />
        <label class="row-label">
          <span>${P(N.selectorTypes)}</span>
          <devtools-link
            class="link" href="https://g.co/devtools/recorder#selector"
            title=${P(N.learnMore)}
            .jslogContext=${"recorder-selector-help"}>
            <devtools-icon name="help">
            </devtools-icon>
          </devtools-link>
        </label>
        <div class="checkbox-container">
          ${di(a, (e) => ci`
              <label class="checkbox-label selector-type">
                <input
                  @keydown=${ee}
                  .value=${e.selectorType}
                  jslog=${Le().track({ click: !0 }).context(`selector-${e.selectorType}`)}
                  ?checked=${e.checked}
                  type="checkbox"
                  @change=${(t) => s({
		selectorType: e.selectorType,
		checked: t.target.checked
	})}
                />
                ${te.get(e.selectorType) || e.selectorType}
              </label>
            `)}
        </div>
        ${o && ci` <div class="error" role="alert"> ${o.message} </div>`}
      </div>
      <div class="footer">
        <div class="controls">
          <devtools-widget
            class="control-button"
            ${pi(At, {
		label: P(N.startRecording),
		shape: "circle",
		onClick: c
	})}
            jslog=${_(x.START_RECORDING).track({ click: !0 })}
            title=${oi(P(N.startRecording), x.START_RECORDING)}
          ></devtools-widget>
        </div>
      </div>
    `, n);
}, hi = class extends v {
	#e;
	#t = "";
	#n = "";
	#r = [];
	#i;
	#a = {};
	#o;
	onRecordingStarted = () => {};
	onRecordingCancelled = () => {};
	set recorderSettings(e) {
		this.#o = e, this.#t = this.#o.defaultTitle, this.#n = this.#o.selectorAttribute, this.#r = Object.values(w).map((e) => ({
			selectorType: e,
			checked: this.#o?.getSelectorByType(e) ?? !0
		})), this.requestUpdate();
	}
	constructor(e, t) {
		super(e, { useShadowDom: !0 }), this.#i = t || mi;
	}
	wasShown() {
		super.wasShown(), this.requestUpdate(), this.updateComplete.then(() => this.#a.focusInput?.());
	}
	startRecording() {
		if (!this.#o) throw Error("settings not set");
		if (!this.#t.trim()) {
			this.#e = Error(P(N.recordingNameIsRequired)), this.requestUpdate();
			return;
		}
		let e = this.#r.filter((e) => e.checked).map((e) => e.selectorType);
		if (!e.includes(w.CSS) && !e.includes(w.XPath) && !e.includes(w.Pierce)) {
			this.#e = Error(P(N.includeNecessarySelectors)), this.requestUpdate();
			return;
		}
		for (let t of Object.values(w)) this.#o.setSelectorByType(t, e.includes(t));
		let t = this.#n.trim();
		t && (this.#o.selectorAttribute = t), this.onRecordingStarted({
			name: this.#t,
			selectorTypesToRecord: e,
			selectorAttribute: this.#n ? this.#n : void 0
		}), ut.instance().recordAction(pt.RECORDER_RECORDING_STARTED);
	}
	performUpdate() {
		this.#i({
			name: this.#t,
			selectorAttribute: this.#n,
			selectorTypes: this.#r,
			error: this.#e,
			onRecordingCancelled: this.onRecordingCancelled,
			onUpdate: (e) => {
				"name" in e ? this.#t = e.name : "selectorAttribute" in e ? this.#n = e.selectorAttribute : this.#r = this.#r.map((t) => t.selectorType === e.selectorType ? {
					...t,
					checked: e.checked
				} : t), this.requestUpdate();
			},
			onRecordingStarted: () => {
				this.startRecording();
			},
			onErrorReset: () => {
				this.#e = void 0, this.requestUpdate();
			}
		}, this.#a, this.contentElement);
	}
}, gi = "/*\n * Copyright 2023 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n@scope to (devtools-widget > *) {\n  * {\n    margin: 0;\n    padding: 0;\n    box-sizing: border-box;\n    font-size: inherit;\n  }\n\n  *:focus,\n  *:focus-visible {\n    outline: none;\n  }\n\n  .wrapper {\n    padding: 24px;\n  }\n\n  .header {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    flex-wrap: wrap;\n    gap: 10px;\n  }\n\n  h1 {\n    font-size: 16px;\n    line-height: 19px;\n    color: var(--sys-color-on-surface);\n    font-weight: normal;\n  }\n\n  .icon,\n  .icon devtools-icon {\n    width: 20px;\n    height: 20px;\n    color: var(--sys-color-primary);\n  }\n\n  .table {\n    margin-top: 35px;\n  }\n\n  .title {\n    font-size: 13px;\n    color: var(--sys-color-on-surface);\n    margin-left: 10px;\n    flex: 1;\n    overflow-x: hidden;\n    white-space: nowrap;\n    text-overflow: ellipsis;\n  }\n\n  .row {\n    display: flex;\n    align-items: center;\n    padding-right: 5px;\n    height: 28px;\n    border-bottom: 1px solid var(--sys-color-divider);\n  }\n\n  .row:focus-within,\n  .row:hover {\n    background-color: var(--sys-color-state-hover-on-subtle);\n  }\n\n  .row:last-child {\n    border-bottom: none;\n  }\n\n  .actions {\n    display: flex;\n    align-items: center;\n  }\n\n  .actions button {\n    border: none;\n    background-color: transparent;\n    width: 24px;\n    height: 24px;\n    border-radius: 50%;\n  }\n\n  .actions .divider {\n    width: 1px;\n    height: 17px;\n    background-color: var(--sys-color-divider);\n    margin: 0 6px;\n  }\n}\n", { html: _i } = m, vi = {
	savedRecordings: "Saved recordings",
	createRecording: "Create a new recording",
	playRecording: "Play recording",
	deleteRecording: "Delete recording",
	openRecording: "Open recording"
}, yi = i("panels/recorder/components/RecordingListView.ts", vi), bi = n.bind(void 0, yi), xi = class e extends Event {
	static eventName = "createrecording";
	constructor() {
		super(e.eventName, {
			composed: !0,
			bubbles: !0
		});
	}
}, Si = class e extends Event {
	storageName;
	static eventName = "deleterecording";
	constructor(t) {
		super(e.eventName, {
			composed: !0,
			bubbles: !0
		}), this.storageName = t;
	}
}, Ci = class e extends Event {
	storageName;
	static eventName = "openrecording";
	constructor(t) {
		super(e.eventName, {
			composed: !0,
			bubbles: !0
		}), this.storageName = t;
	}
}, wi = class e extends Event {
	storageName;
	static eventName = "playrecording";
	constructor(t) {
		super(e.eventName, {
			composed: !0,
			bubbles: !0
		}), this.storageName = t;
	}
}, Ti = (e, t, n) => {
	let { recordings: r, replayAllowed: i, onCreateClick: a, onDeleteClick: o, onOpenClick: s, onPlayRecordingClick: c, onKeyDown: u } = e;
	p(_i`
      <style>${gi}</style>
      <div class="wrapper">
        <div class="header">
          <h1>${bi(vi.savedRecordings)}</h1>
          <devtools-button
            .variant=${l.PRIMARY}
            @click=${a}
            title=${oi(bi(vi.createRecording), x.CREATE_RECORDING)}
            .jslogContext=${"create-recording"}
          >
            ${bi(vi.createRecording)}
          </devtools-button>
        </div>
        <div class="table">
          ${r.map((e) => _i`
                <div
                  role="button"
                  tabindex="0"
                  aria-label=${bi(vi.openRecording)}
                  class="row"
                  @keydown=${(t) => u(e.storageName, t)}
                  @click=${(t) => s(e.storageName, t)}
                  jslog=${oe().track({
		click: !0,
		resize: !0
	}).context("recording")}>
                  <div class="icon">
                    <devtools-icon name="flow">
                    </devtools-icon>
                  </div>
                  <div class="title">${e.name}</div>
                  <div class="actions">
                    ${i ? _i`
                              <devtools-button
                                title=${bi(vi.playRecording)}
                                .data=${{
		variant: l.ICON,
		iconName: "play",
		jslogContext: "play-recording"
	}}
                                @click=${(t) => c(e.storageName, t)}
                                @keydown=${(e) => e.stopPropagation()}
                              ></devtools-button>
                              <div class="divider"></div>` : ""}
                    <devtools-button
                      class="delete-recording-button"
                      title=${bi(vi.deleteRecording)}
                      .data=${{
		variant: l.ICON,
		iconName: "bin",
		jslogContext: "delete-recording"
	}}
                      @click=${(t) => o(e.storageName, t)}
                      @keydown=${(e) => e.stopPropagation()}
                    ></devtools-button>
                  </div>
                </div>
              `)}
        </div>
      </div>
    `, n);
}, Ei = class extends v {
	#e = [];
	#t = !0;
	#n;
	constructor(e, t) {
		super(e, { useShadowDom: !0 }), this.#n = t || Ti;
	}
	set recordings(e) {
		this.#e = e, this.performUpdate();
	}
	set replayAllowed(e) {
		this.#t = e, this.performUpdate();
	}
	#r() {
		this.contentElement.dispatchEvent(new xi());
	}
	#i(e, t) {
		t.stopPropagation(), this.contentElement.dispatchEvent(new Si(e));
	}
	#a(e, t) {
		t.stopPropagation(), this.contentElement.dispatchEvent(new Ci(e));
	}
	#o(e, t) {
		t.stopPropagation(), this.contentElement.dispatchEvent(new wi(e));
	}
	#s(e, t) {
		t.key === "Enter" && this.#a(e, t);
	}
	performUpdate() {
		this.#n({
			recordings: this.#e,
			replayAllowed: this.#t,
			onCreateClick: this.#r.bind(this),
			onDeleteClick: this.#i.bind(this),
			onOpenClick: this.#a.bind(this),
			onPlayRecordingClick: this.#o.bind(this),
			onKeyDown: this.#s.bind(this)
		}, {}, this.contentElement);
	}
	wasShown() {
		super.wasShown(), this.performUpdate();
	}
}, Di = null, Oi = class e extends a {
	static instance() {
		return Di ||= new e(), Di;
	}
	#e = /* @__PURE__ */ new Map();
	constructor() {
		super(), this.attach();
	}
	attach() {
		let e = dt.instance();
		e.addEventListener(b.PLUGIN_ADDED, this.#t), e.addEventListener(b.PLUGIN_REMOVED, this.#t), e.addEventListener(b.VIEW_REGISTERED, this.#n);
		for (let t of e.views()) this.#n({ data: t });
	}
	detach() {
		let e = dt.instance();
		e.removeEventListener(b.PLUGIN_ADDED, this.#t), e.removeEventListener(b.PLUGIN_REMOVED, this.#t), e.removeEventListener(b.VIEW_REGISTERED, this.#n), this.#e.clear();
	}
	extensions() {
		return dt.instance().plugins();
	}
	getView(e) {
		let t = this.#e.get(e);
		if (!t) throw Error("View not found");
		return t;
	}
	#t = () => {
		this.dispatchEventToListeners("extensionsUpdated", this.extensions());
	};
	#n = (e) => {
		let t = e.data;
		this.#e.has(t.id) || this.#e.set(t.id, new ft(t));
	};
}, ki = /* @__PURE__ */ function(e) {
	return e.EXTENSIONS_UPDATED = "extensionsUpdated", e;
}({}), Ai = "/*\n * Copyright 2023 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n* {\n  margin: 0;\n  padding: 0;\n  outline: none;\n  box-sizing: border-box;\n  font-size: inherit;\n}\n\n.extension-view {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n}\n\nmain {\n  flex: 1;\n}\n\niframe {\n  border: none;\n  height: 100%;\n  width: 100%;\n}\n\nheader {\n  display: flex;\n  padding: 3px 8px;\n  justify-content: space-between;\n  border-bottom: 1px solid var(--sys-color-divider);\n}\n\nheader > div {\n  align-self: center;\n}\n\n.icon {\n  display: block;\n  width: 16px;\n  height: 16px;\n  color: var(--sys-color-secondary);\n}\n\n.title {\n  display: flex;\n  flex-direction: row;\n  gap: 6px;\n  color: var(--sys-color-secondary);\n  align-items: center;\n  font-weight: 500;\n}\n", { html: ji } = m, Mi = {
	closeView: "Close",
	extension: "Content provided by a browser extension"
}, Ni = i("panels/recorder/components/ExtensionView.ts", Mi), Pi = n.bind(void 0, Ni), Fi = class e extends Event {
	static eventName = "recorderextensionviewclosed";
	constructor() {
		super(e.eventName, {
			bubbles: !0,
			composed: !0
		});
	}
}, Ii = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t;
	constructor() {
		super(), this.setAttribute("jslog", `${Ke("extension-view")}`);
	}
	connectedCallback() {
		this.#r();
	}
	disconnectedCallback() {
		this.#t && Oi.instance().getView(this.#t.id).hide();
	}
	set descriptor(e) {
		this.#t = e, this.#r(), Oi.instance().getView(e.id).show();
	}
	#n() {
		this.dispatchEvent(new Fi());
	}
	#r() {
		if (!this.#t) return;
		let e = Oi.instance().getView(this.#t.id).frame();
		p(ji`
        <style>${Ai}</style>
        <div class="extension-view">
          <header>
            <div class="title">
              <devtools-icon
                class="icon"
                title=${Pi(Mi.extension)}
                name="extension">
              </devtools-icon>
              ${this.#t.title}
            </div>
            <devtools-button
              title=${Pi(Mi.closeView)}
              jslog=${me().track({ click: !0 })}
              .data=${{
			variant: l.ICON,
			size: Ce.SMALL,
			iconName: "cross"
		}}
              @click=${this.#n}
            ></devtools-button>
          </header>
          <main>
            ${e}
          </main>
      </div>
    `, this.#e, { host: this });
	}
};
customElements.define("devtools-recorder-extension-view", Ii);
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/recorder/components/recordingView.css.mjs
var Li = "/*\n * Copyright 2023 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n@scope to (devtools-widget > *) {\n  * {\n    padding: 0;\n    margin: 0;\n    box-sizing: border-box;\n    font-size: inherit;\n  }\n\n  .wrapper {\n    display: flex;\n    flex-direction: row;\n    flex: 1;\n    height: 100%;\n  }\n\n  .main {\n    overflow: hidden;\n    display: flex;\n    flex-direction: column;\n    flex: 1;\n  }\n\n  .sections {\n    min-height: 0;\n    background-color: var(--sys-color-cdt-base-container);\n    z-index: 0;\n    position: relative;\n    container: sections / inline-size;\n  }\n\n  .section {\n    display: flex;\n    padding: 0 16px;\n    gap: 8px;\n    position: relative;\n  }\n\n  .section::after {\n    content: '';\n    border-bottom: 1px solid var(--sys-color-divider);\n    position: absolute;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    z-index: -1;\n  }\n\n  .section:last-child::after {\n    content: none;\n  }\n\n  .screenshot-wrapper {\n    flex: 0 0 80px;\n    padding-top: 32px;\n    /* We want this to be on top of `.step-overlay` */\n    z-index: 2;\n  }\n\n  @container sections (max-width: 400px) {\n    .screenshot-wrapper {\n      display: none;\n    }\n  }\n\n  .screenshot {\n    object-fit: cover;\n    object-position: top center;\n    max-width: 100%;\n    width: 200px;\n    height: auto;\n    border: 1px solid var(--sys-color-divider);\n    border-radius: 1px;\n  }\n\n  .content {\n    flex: 1;\n    min-width: 0;\n  }\n\n  .steps {\n    flex: 1;\n    position: relative;\n    align-self: flex-start;\n    overflow: visible;\n  }\n\n  .step {\n    position: relative;\n    padding-left: 40px;\n    margin: 16px 0;\n  }\n\n  .step .action {\n    font-size: 13px;\n    line-height: 16px;\n    letter-spacing: 0.03em;\n  }\n\n  .recording {\n    color: var(--sys-color-primary);\n    font-style: italic;\n    margin-top: 8px;\n    margin-bottom: 0;\n  }\n\n  .add-assertion-button {\n    margin-top: 8px;\n  }\n\n  .details {\n    max-width: 240px;\n    display: flex;\n    flex-direction: column;\n    align-items: flex-end;\n  }\n\n  .url {\n    font-size: 12px;\n    line-height: 16px;\n    letter-spacing: 0.03em;\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    color: var(--sys-color-secondary);\n    max-width: 100%;\n    margin-bottom: 16px;\n  }\n\n  .header {\n    flex-shrink: 0;\n    align-items: center;\n    border-bottom: 1px solid var(--sys-color-divider);\n    display: flex;\n    flex-wrap: wrap;\n    gap: 10px;\n    justify-content: space-between;\n    padding: 16px;\n  }\n\n  .header-title-wrapper {\n    max-width: 100%;\n  }\n\n  .header-title {\n    align-items: center;\n    display: flex;\n    flex: 1;\n    max-width: 100%;\n  }\n\n  .header-title::before {\n    content: '';\n    min-width: 12px;\n    height: 12px;\n    display: inline-block;\n    background: var(--sys-color-primary);\n    border-radius: 50%;\n    margin-right: 7px;\n  }\n\n  #title-input {\n    font-family: inherit;\n    field-sizing: content;\n    font-size: 18px;\n    line-height: 22px;\n    letter-spacing: 0.02em;\n    padding: 1px 4px;\n    border: 1px solid transparent;\n    border-radius: 1px;\n    word-break: break-all;\n  }\n\n  #title-input:hover,\n  #title-input:focus-visible {\n    border-color: var(--input-outline);\n  }\n\n  #title-input.has-error {\n    border-color: var(--sys-color-error);\n  }\n\n  #title-input.disabled {\n    color: var(--sys-color-state-disabled);\n  }\n\n  .title-input-error-text {\n    margin-top: 4px;\n    margin-left: 19px;\n    color: var(--sys-color-error);\n  }\n\n  .title-button-bar {\n    flex-shrink: 0;\n    padding-left: 2px;\n    display: flex;\n  }\n\n  #title-input:focus + .title-button-bar {\n    display: none;\n  }\n\n  .settings-row {\n    padding: 16px 28px;\n    border-bottom: 1px solid var(--sys-color-divider);\n    display: flex;\n    flex-flow: row wrap;\n    justify-content: space-between;\n  }\n\n  .settings-title {\n    font-size: 14px;\n    line-height: 24px;\n    letter-spacing: 0.03em;\n    color: var(--sys-color-on-surface);\n    display: flex;\n    align-items: center;\n    align-content: center;\n    gap: 5px;\n    width: fit-content;\n  }\n\n  .settings-title:focus-visible {\n    outline: 2px solid var(--sys-color-state-focus-ring);\n    outline-offset: 2px;\n  }\n\n  .settings {\n    margin-top: 4px;\n    display: flex;\n    flex-wrap: wrap;\n    font-size: 12px;\n    line-height: 20px;\n    letter-spacing: 0.03em;\n    color: var(--sys-color-on-surface-subtle);\n  }\n\n  .settings.expanded {\n    gap: 10px;\n  }\n\n  .settings .separator {\n    width: 1px;\n    height: 20px;\n    background-color: var(--sys-color-divider);\n    margin: 0 5px;\n  }\n\n  .actions {\n    display: flex;\n    align-items: center;\n    flex-wrap: wrap;\n    gap: 12px;\n  }\n\n  .actions .separator {\n    width: 1px;\n    height: 24px;\n    background-color: var(--sys-color-divider);\n  }\n\n  .is-recording .header-title::before {\n    background: var(--sys-color-error-bright);\n  }\n\n  .footer {\n    display: flex;\n    justify-content: center;\n    border-top: 1px solid var(--sys-color-divider);\n    padding: 12px;\n    background: var(--sys-color-cdt-base-container);\n    z-index: 1;\n  }\n\n  .controls {\n    align-items: center;\n    display: flex;\n    justify-content: center;\n    position: relative;\n    width: 100%;\n  }\n\n  .chevron {\n    width: 14px;\n    height: 14px;\n    transform: rotate(-90deg);\n    color: var(--sys-color-on-surface);\n  }\n\n  .expanded .chevron {\n    transform: rotate(0);\n  }\n\n  .editable-setting {\n    display: flex;\n    flex-direction: row;\n    gap: 12px;\n    align-items: center;\n  }\n\n  .editable-setting .devtools-text-input {\n    width: fit-content;\n    height: var(--sys-size-9);\n  }\n\n  .wrapping-label {\n    display: inline-flex;\n    align-items: center;\n    gap: 12px;\n  }\n\n  .text-editor {\n    height: 100%;\n    overflow: auto;\n  }\n\n  .section-toolbar {\n    display: flex;\n    align-items: center;\n    padding: 3px 5px;\n    justify-content: space-between;\n    gap: 3px;\n  }\n\n  .section-toolbar > devtools-select-menu {\n    height: 24px;\n    min-width: 50px;\n  }\n\n  .sections .section-toolbar {\n    justify-content: flex-end;\n  }\n\n  devtools-split-view {\n    flex: 1 1 0%;\n    min-height: 0;\n  }\n\n  [slot='main'] {\n    overflow: hidden auto;\n  }\n\n  [slot='sidebar'] {\n    display: flex;\n    flex-direction: column;\n    overflow: auto;\n    height: 100%;\n    width: 100%;\n  }\n\n  [slot='sidebar'] .section-toolbar {\n    border-bottom: 1px solid var(--sys-color-divider);\n  }\n\n  devtools-recorder-extension-view {\n    flex: 1;\n  }\n}\n", Ri = "/*\n * Copyright 2023 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.select-button {\n  display: flex;\n  gap: var(--sys-size-6);\n}\n\n.groups-label {\n  display: inline-block;\n  padding: 0 var(--sys-size-4) var(--sys-size-4) 0;\n}\n\n.select-button devtools-button {\n  position: relative; /* Needed for outline to appear on top of the next element */\n}\n", { html: zi, Directives: { ifDefined: Bi, repeat: Vi } } = m, F = {
	Replay: "Replay",
	ReplayNormalButtonLabel: "Normal speed",
	ReplayNormalItemLabel: "Normal (Default)",
	ReplaySlowButtonLabel: "Slow speed",
	ReplaySlowItemLabel: "Slow",
	ReplayVerySlowButtonLabel: "Very slow speed",
	ReplayVerySlowItemLabel: "Very slow",
	ReplayExtremelySlowButtonLabel: "Extremely slow speed",
	ReplayExtremelySlowItemLabel: "Extremely slow",
	speedGroup: "Speed",
	extensionGroup: "Extensions"
}, Hi = i("panels/recorder/components/ReplaySection.ts", F), I = n.bind(void 0, Hi), Ui = "extension";
function Wi(e) {
	return e === j.NORMAL || e === j.SLOW || e === j.VERY_SLOW || e === j.EXTREMELY_SLOW;
}
var Gi = (e, t, n) => {
	let { disabled: r, groups: i, selectedItem: a, actionTitle: o, onButtonClick: s, onItemSelected: c } = e, u = l.PRIMARY;
	p(zi`
      <style>
        ${re}
      </style>
      <style>
        ${Ri}
      </style>
      <div
        class="select-button"
        title=${Bi(o)}
      >
        <label>
          ${i.length > 1 ? zi`
                <div
                  class="groups-label"
                  >${i.map((e) => e.name).join(" & ")}</div>` : we}
          <select
            class="primary"
            ?disabled=${r}
            jslog=${Ve("network-conditions").track({ change: !0 })}
            @change=${(e) => {
		e.target instanceof HTMLSelectElement && c(e.target.value);
	}}
          >
            ${Vi(i, (e) => e.name, (e) => zi`
                <optgroup label=${e.name}>
                  ${Vi(e.items, (e) => e.value, (e) => {
		let t = e.value === a.value;
		return zi`
                      <option
                        .title=${e.label()}
                        value=${e.value}
                        ?selected=${t}
                        jslog=${oe(y(e.value)).track({ click: !0 })}
                      >
                        ${t && e.buttonLabel ? e.buttonLabel() : e.label()}
                      </option>
                    `;
	})}
                </optgroup>
              `)}
          </select>
        </label>
        <devtools-button
          .disabled=${r}
          .variant=${u}
          .iconName=${a.buttonIconName}
          @click=${(e) => {
		e.stopPropagation(), s();
	}}
          jslog=${_(x.REPLAY_RECORDING).track({ click: !0 })}
        >
          ${I(F.Replay)}
        </devtools-button>
      </div>`, n);
}, Ki = class extends v {
	onStartReplay;
	#e = !1;
	#t;
	#n = [];
	#r;
	#i = [];
	constructor(e, t) {
		super(e, { useShadowDom: !0 }), this.#r = t || Gi, this.#i = this.#a();
	}
	set settings(e) {
		this.#t = e, this.performUpdate();
	}
	set replayExtensions(e) {
		this.#n = e, this.#i = this.#a(), this.performUpdate();
	}
	get disabled() {
		return this.#e;
	}
	set disabled(e) {
		this.#e = e, this.performUpdate();
	}
	wasShown() {
		super.wasShown(), this.performUpdate();
	}
	performUpdate() {
		let e = this.#o();
		this.#r({
			disabled: this.#e,
			groups: this.#i,
			selectedItem: e,
			actionTitle: oi(e.label(), x.REPLAY_RECORDING),
			onButtonClick: () => this.#s(),
			onItemSelected: (e) => this.#c(e)
		}, void 0, this.contentElement);
	}
	#a() {
		let e = [{
			name: I(F.speedGroup),
			items: [
				{
					value: j.NORMAL,
					buttonIconName: "play",
					buttonLabel: () => I(F.ReplayNormalButtonLabel),
					label: () => I(F.ReplayNormalItemLabel)
				},
				{
					value: j.SLOW,
					buttonIconName: "play",
					buttonLabel: () => I(F.ReplaySlowButtonLabel),
					label: () => I(F.ReplaySlowItemLabel)
				},
				{
					value: j.VERY_SLOW,
					buttonIconName: "play",
					buttonLabel: () => I(F.ReplayVerySlowButtonLabel),
					label: () => I(F.ReplayVerySlowItemLabel)
				},
				{
					value: j.EXTREMELY_SLOW,
					buttonIconName: "play",
					buttonLabel: () => I(F.ReplayExtremelySlowButtonLabel),
					label: () => I(F.ReplayExtremelySlowItemLabel)
				}
			]
		}];
		return this.#n.length && e.push({
			name: I(F.extensionGroup),
			items: this.#n.map((e) => ({
				value: Ui + e.getOrigin(),
				buttonIconName: "play",
				buttonLabel: () => e.getName(),
				label: () => e.getName()
			}))
		}), e;
	}
	#o() {
		let e = this.#t?.replayExtension || this.#t?.speed || "";
		for (let t of this.#i) for (let n of t.items) if (n.value === e) return n;
		return this.#i[0].items[0];
	}
	#s() {
		let e = this.#t?.replayExtension || this.#t?.speed || "";
		if (e.startsWith(Ui)) {
			let t = e.substring(9), n = this.#n.find((e) => e.getOrigin() === t);
			if (n) {
				this.#t && (this.#t.replayExtension = Ui + n.getOrigin()), this.onStartReplay && this.onStartReplay(j.NORMAL, n), this.performUpdate();
				return;
			}
		}
		this.onStartReplay && this.onStartReplay(this.#t ? this.#t.speed : j.NORMAL), this.performUpdate();
	}
	#c(e) {
		this.#t && (Wi(e) ? (this.#t.speed = e, this.#t.replayExtension = "") : this.#t.replayExtension = e, this.performUpdate());
	}
}, qi = "/*\n * Copyright 2025 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  display: inline-block;\n}\n\n.selector-picker {\n  width: 18px;\n  height: 18px;\n}\n", { html: Ji } = m, Yi = "captureSelectors", Xi = class e extends Event {
	static eventName = "requestselectorattribute";
	send;
	constructor(t) {
		super(e.eventName, {
			bubbles: !0,
			composed: !0
		}), this.send = t;
	}
}, Zi = { selectorPicker: "Select an element in the page to update selectors" }, Qi = i("panels/recorder/components/SelectorPicker.ts", Zi), $i = n.bind(void 0, Qi), ea = (e, t, n) => {
	let { active: r, disabled: i, onClick: a } = e;
	p(Ji`
      <style>${qi}</style>
      <devtools-button
        @click=${a}
        .title=${$i(Zi.selectorPicker)}
        class="selector-picker"
        .size=${Ce.SMALL}
        .iconName=${"select-element"}
        .active=${r}
        .disabled=${i}
        .variant=${l.ICON}
        jslog=${Le("selector-picker").track({ click: !0 })}
      ></devtools-button>
    `, n);
}, ta = class e extends v {
	#e;
	#t = !1;
	#n = !1;
	#r;
	#i = new st();
	#a = /* @__PURE__ */ new Map();
	#o = /* @__PURE__ */ new Map();
	onSelectorPicked;
	onAttributeRequested;
	constructor(e, t) {
		super(e, { useShadowDom: !0 }), this.#e = t || ea;
	}
	static get #s() {
		return He.instance();
	}
	set disabled(e) {
		this.#t = e, this.requestUpdate();
	}
	performUpdate() {
		this.#e({
			active: this.#n,
			disabled: this.#t,
			onClick: this.#c.bind(this)
		}, {}, this.contentElement);
	}
	#c(e) {
		e.preventDefault(), e.stopPropagation(), this.#l();
	}
	async #l() {
		return this.#n ? await this.#d() : await this.#u();
	}
	#u = () => this.#i.run(async () => {
		this.#n || (this.#n = !0, this.#r = await new Promise((e, t) => {
			let n = setTimeout(t, 1e3);
			this.onAttributeRequested ? this.onAttributeRequested((t) => {
				clearTimeout(n), e(t);
			}) : (clearTimeout(n), e(void 0));
		}), e.#s.observeTargets(this), this.requestUpdate());
	});
	#d = () => this.#i.run(async () => {
		this.#n && (this.#n = !1, e.#s.unobserveTargets(this), e.#s.targets().map(this.targetRemoved.bind(this)), this.#r = void 0, this.requestUpdate());
	});
	targetAdded(e) {
		if (e.type() !== de.FRAME) return;
		let t = this.#a.get(e);
		t || (t = new st(), this.#a.set(e, t)), t.run(async () => {
			await this.#h(e), await this.#p(e);
		});
	}
	targetRemoved(e) {
		let t = this.#a.get(e);
		t && t.run(async () => {
			try {
				await this.#m(e), await this.#g(e);
			} catch {}
		});
	}
	#f = (e) => {
		if (e.data.name !== Yi) return;
		let t = e.data.executionContextId, n = He.instance().targets(), r = Rr(n, t), i = zr(n, t);
		if (!r || !i) throw Error(`No execution context found for the binding call + ${JSON.stringify(e.data)}`);
		let a = r.model(ve);
		if (!a) throw Error(`ResourceTreeModel instance is missing for the target: ${r.id()}`);
		let o = a.frameForId(i);
		if (!o) throw Error("Frame is not found");
		this.onSelectorPicked && this.onSelectorPicked({
			...JSON.parse(e.data.payload),
			...Ir(r, o)
		}), this.#d();
	};
	async #p(e) {
		let t = `${await Or.get()};DevToolsRecorder.startSelectorPicker({getAccessibleName, getAccessibleRole}, ${JSON.stringify(this.#r ? this.#r : void 0)}, false)`, [{ identifier: n }] = await Promise.all([e.pageAgent().invoke_addScriptToEvaluateOnNewDocument({
			source: t,
			worldName: M,
			includeCommandLineAPI: !0
		}), Lr(M, e, t)]);
		this.#o.set(e, n);
	}
	async #m(e) {
		let t = this.#o.get(e);
		ot(t), this.#o.delete(e), await e.pageAgent().invoke_removeScriptToEvaluateOnNewDocument({ identifier: t }), await Lr(M, e, "DevToolsRecorder.stopSelectorPicker()");
	}
	async #h(e) {
		let t = e.model(f);
		ot(t), t.addEventListener(nt.BindingCalled, this.#f), await t.addBinding({
			name: Yi,
			executionContextName: M
		});
	}
	async #g(e) {
		await e.runtimeAgent().invoke_removeBinding({ name: Yi });
		let t = e.model(f);
		ot(t), t.removeEventListener(nt.BindingCalled, this.#f);
	}
	wasShown() {
		super.wasShown(), this.requestUpdate();
	}
	wasHidden() {
		super.wasHidden(), this.#d();
	}
}, na = "/*\n * Copyright 2023 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n* {\n  box-sizing: border-box;\n  padding: 0;\n  margin: 0;\n  font-size: inherit;\n}\n\n:host {\n  display: block;\n}\n\n.row {\n  display: flex;\n  flex-direction: row;\n  color: var(--sys-color-token-property-special);\n  font-family: var(--monospace-font-family);\n  font-size: var(--monospace-font-size);\n  align-items: center;\n  line-height: 18px;\n  margin-top: 3px;\n}\n\n.row devtools-button {\n  line-height: 1;\n  margin-left: 0.5em;\n}\n\n.separator {\n  margin-right: 0.5em;\n  color: var(--sys-color-on-surface);\n}\n\n.padded {\n  margin-left: 2em;\n}\n\n.padded.double {\n  margin-left: 4em;\n}\n\n.inline-button {\n  width: 18px;\n  height: 18px;\n  opacity: 0%;\n  visibility: hidden;\n  transition: opacity 200ms;\n  flex-shrink: 0;\n}\n\n.row:focus-within .inline-button,\n.row:hover .inline-button {\n  opacity: 100%;\n  visibility: visible;\n}\n\n.wrapped.row {\n  flex-wrap: wrap;\n}\n\n.gap.row {\n  gap: 5px;\n}\n\n.gap.row devtools-button {\n  margin-left: 0;\n}\n\n.regular-font {\n  font-family: inherit;\n  font-size: inherit;\n}\n\n.no-margin {\n  margin: 0;\n}\n\n.row-buttons {\n  margin-top: 3px;\n}\n\n.error {\n  margin: 3px 0 6px;\n  padding: 8px 12px;\n  background: var(--sys-color-error-container);\n  color: var(--sys-color-error);\n}\n";
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/recorder/components/util.ts
function ra(e, t = "Assertion failed!") {
	if (!e) throw Error(t);
}
var ia = (e) => {
	for (let t of Reflect.ownKeys(e)) {
		let n = e[t];
		(n && typeof n == "object" || typeof n == "function") && ia(n);
	}
	return Object.freeze(e);
}, aa = class {
	value;
	constructor(e) {
		this.value = e;
	}
}, L = class {
	value;
	constructor(e) {
		this.value = e;
	}
}, R = (e, t) => {
	if (t instanceof L) {
		ra(Array.isArray(e), `Expected an array. Got ${typeof e}.`);
		let n = [...e], r = Object.keys(t.value).sort((e, t) => Number(t) - Number(e));
		for (let e of r) {
			let r = t.value[Number(e)];
			r === void 0 ? n.splice(Number(e), 1) : r instanceof aa ? n.splice(Number(e), 0, r.value) : n[Number(e)] = R(n[e], r);
		}
		return Object.freeze(n);
	}
	if (typeof t == "object" && !Array.isArray(t)) {
		ra(!Array.isArray(e), "Expected an object. Got an array.");
		let n = { ...e }, r = Object.keys(t);
		for (let e of r) {
			let r = t[e];
			r === void 0 ? delete n[e] : n[e] = R(n[e], r);
		}
		return Object.freeze(n);
	}
	return t;
}, { html: z, Decorators: oa, Directives: sa, LitElement: ca } = m, { customElement: la, property: ua, state: da } = oa, { live: fa } = sa, { widget: pa } = Be, ma = Object.freeze({
	string: (e) => e.trim(),
	number: (e) => {
		let t = parseFloat(e);
		return Number.isNaN(t) ? 0 : t;
	},
	boolean: (e) => e.toLowerCase() === "true"
}), ha = Object.freeze({
	selectors: "string",
	offsetX: "number",
	offsetY: "number",
	target: "string",
	frame: "number",
	assertedEvents: "string",
	value: "string",
	key: "string",
	operator: "string",
	count: "number",
	expression: "string",
	x: "number",
	y: "number",
	url: "string",
	type: "string",
	timeout: "number",
	duration: "number",
	button: "string",
	deviceType: "string",
	width: "number",
	height: "number",
	deviceScaleFactor: "number",
	isMobile: "boolean",
	hasTouch: "boolean",
	isLandscape: "boolean",
	download: "number",
	upload: "number",
	latency: "number",
	name: "string",
	parameters: "string",
	visible: "boolean",
	properties: "string",
	attributes: "string"
}), B = ia({
	selectors: [[".cls"]],
	offsetX: 1,
	offsetY: 1,
	target: "main",
	frame: [0],
	assertedEvents: [{
		type: "navigation",
		url: "https://example.com",
		title: "Title"
	}],
	value: "Value",
	key: "Enter",
	operator: ">=",
	count: 1,
	expression: "true",
	x: 0,
	y: 0,
	url: "https://example.com",
	timeout: 5e3,
	duration: 50,
	deviceType: "mouse",
	button: "primary",
	type: "click",
	width: 800,
	height: 600,
	deviceScaleFactor: 1,
	isMobile: !1,
	hasTouch: !1,
	isLandscape: !0,
	download: 1e3,
	upload: 1e3,
	latency: 25,
	name: "customParam",
	parameters: "{}",
	properties: "{}",
	attributes: [{
		name: "attribute",
		value: "value"
	}],
	visible: !0
}), ga = ia({
	[T.Click]: {
		required: [
			"selectors",
			"offsetX",
			"offsetY"
		],
		optional: [
			"assertedEvents",
			"button",
			"deviceType",
			"duration",
			"frame",
			"target",
			"timeout"
		]
	},
	[T.DoubleClick]: {
		required: [
			"offsetX",
			"offsetY",
			"selectors"
		],
		optional: [
			"assertedEvents",
			"button",
			"deviceType",
			"frame",
			"target",
			"timeout"
		]
	},
	[T.Hover]: {
		required: ["selectors"],
		optional: [
			"assertedEvents",
			"frame",
			"target",
			"timeout"
		]
	},
	[T.Change]: {
		required: ["selectors", "value"],
		optional: [
			"assertedEvents",
			"frame",
			"target",
			"timeout"
		]
	},
	[T.KeyDown]: {
		required: ["key"],
		optional: [
			"assertedEvents",
			"target",
			"timeout"
		]
	},
	[T.KeyUp]: {
		required: ["key"],
		optional: [
			"assertedEvents",
			"target",
			"timeout"
		]
	},
	[T.Scroll]: {
		required: [],
		optional: [
			"assertedEvents",
			"frame",
			"target",
			"timeout",
			"x",
			"y"
		]
	},
	[T.Close]: {
		required: [],
		optional: [
			"assertedEvents",
			"target",
			"timeout"
		]
	},
	[T.Navigate]: {
		required: ["url"],
		optional: [
			"assertedEvents",
			"target",
			"timeout"
		]
	},
	[T.WaitForElement]: {
		required: ["selectors"],
		optional: [
			"assertedEvents",
			"attributes",
			"count",
			"frame",
			"operator",
			"properties",
			"target",
			"timeout",
			"visible"
		]
	},
	[T.WaitForExpression]: {
		required: ["expression"],
		optional: [
			"assertedEvents",
			"frame",
			"target",
			"timeout"
		]
	},
	[T.CustomStep]: {
		required: ["name", "parameters"],
		optional: [
			"assertedEvents",
			"target",
			"timeout"
		]
	},
	[T.EmulateNetworkConditions]: {
		required: [
			"download",
			"latency",
			"upload"
		],
		optional: [
			"assertedEvents",
			"target",
			"timeout"
		]
	},
	[T.SetViewport]: {
		required: [
			"deviceScaleFactor",
			"hasTouch",
			"height",
			"isLandscape",
			"isMobile",
			"width"
		],
		optional: [
			"assertedEvents",
			"target",
			"timeout"
		]
	}
}), V = {
	notSaved: "Not saved: {error}",
	addAttribute: "Add {attributeName}",
	deleteRow: "Delete row",
	addFrameIndex: "Add frame index within the frame tree",
	removeFrameIndex: "Remove frame index",
	addSelectorPart: "Add a selector part",
	removeSelectorPart: "Remove a selector part",
	addSelector: "Add a selector",
	removeSelector: "Remove a selector",
	unknownActionType: "Unknown action type."
}, _a = i("panels/recorder/components/StepEditor.ts", V), H = n.bind(void 0, _a), va = class e extends Event {
	static eventName = "stepedited";
	data;
	constructor(t) {
		super(e.eventName, {
			bubbles: !0,
			composed: !0
		}), this.data = t;
	}
}, ya = (e) => JSON.parse(JSON.stringify(e)), ba = class {
	static #e = new Dr(() => br.connectPuppeteer(), ({ browser: e }) => br.disconnectPuppeteer(e));
	static async default(e) {
		let t = { type: e }, n = ga[t.type], r = Promise.resolve();
		for (let e of n.required) r = Promise.all([r, (async () => Object.assign(t, { [e]: await this.defaultByAttribute(t, e) }))()]);
		return await r, Object.freeze(t);
	}
	static async defaultByAttribute(e, t) {
		return await this.#e.run((e) => {
			switch (t) {
				case "assertedEvents": return R(B.assertedEvents, new L({ 0: { url: e.page.url() || B.assertedEvents[0].url } }));
				case "url": return e.page.url() || B.url;
				case "height": return e.page.evaluate(() => visualViewport.height) || B.height;
				case "width": return e.page.evaluate(() => visualViewport.width) || B.width;
				default: return B[t];
			}
		});
	}
	static fromStep(e) {
		let t = structuredClone(e);
		for (let n of ["parameters", "properties"]) n in e && e[n] !== void 0 && (t[n] = JSON.stringify(e[n]));
		if ("attributes" in e && e.attributes) {
			t.attributes = [];
			for (let [n, r] of Object.entries(e.attributes)) t.attributes.push({
				name: n,
				value: r
			});
		}
		return "selectors" in e && (t.selectors = e.selectors.map((e) => typeof e == "string" ? [e] : [...e])), ia(t);
	}
	static toStep(e) {
		let t = structuredClone(e);
		for (let n of ["parameters", "properties"]) {
			let r = e[n];
			r && Object.assign(t, { [n]: JSON.parse(r) });
		}
		if (e.attributes) {
			if (e.attributes.length !== 0) {
				let n = {};
				for (let { name: t, value: r } of e.attributes) Object.assign(n, { [t]: r });
				Object.assign(t, { attributes: n });
			} else "attributes" in t && delete t.attributes;
		}
		if (e.selectors) {
			let n = e.selectors.filter((e) => e.length > 0).map((e) => e.length === 1 ? e[0] : [...e]);
			n.length === 0 ? "selectors" in t && delete t.selectors : Object.assign(t, { selectors: n });
		}
		return e.frame?.length === 0 && "frame" in t && delete t.frame, ya(Pr(t));
	}
}, xa = class extends ca {
	#e = /* @__PURE__ */ new Set();
	constructor() {
		super(), this.state = { type: T.WaitForElement }, this.isTypeEditable = !0, this.disabled = !1;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return e.addEventListener("keydown", this.#a), e;
	}
	set step(e) {
		this.state = ia(ba.fromStep(e)), this.error = void 0;
	}
	#t(e) {
		try {
			this.dispatchEvent(new va(ba.toStep(e))), this.state = e;
		} catch (e) {
			this.error = e.message;
		}
	}
	#n = (e) => {
		this.#t(R(this.state, {
			target: e.target,
			frame: e.frame,
			selectors: e.selectors.map((e) => typeof e == "string" ? [e] : e),
			offsetX: e.offsetX,
			offsetY: e.offsetY
		}));
	};
	#r = (e) => {
		this.dispatchEvent(new Xi(e));
	};
	#i = (e, t) => (n) => {
		n.preventDefault(), n.stopPropagation(), this.#t(R(this.state, e)), this.#v(t);
	};
	#a = (e) => {
		if (ra(e instanceof KeyboardEvent), e.target instanceof Et && e.key === "Enter") {
			e.preventDefault(), e.stopPropagation();
			let t = this.renderRoot.querySelectorAll("devtools-suggestion-input"), n = [...t].findIndex((t) => t === e.target);
			n >= 0 && n + 1 < t.length ? t[n + 1].focus() : e.target.blur();
		}
	};
	#o = (e) => (t) => {
		if (ra(t.target instanceof Et), t.target.disabled) return;
		let n = ma[ha[e.attribute]](t.target.value), r = e.from.bind(this)(n);
		r && this.#t(R(this.state, r));
	};
	#s = async (e) => {
		if (ra(e.target instanceof Et), e.target.disabled) return;
		let t = e.target.value;
		if (t !== this.state.type) {
			if (!Object.values(T).includes(t)) {
				this.error = H(V.unknownActionType);
				return;
			}
			this.#t(await ba.default(t));
		}
	};
	#c = async (e) => {
		e.preventDefault(), e.stopPropagation();
		let t = e.target.dataset.attribute;
		this.#t(R(this.state, { [t]: await ba.defaultByAttribute(this.state, t) })), this.#v(`[data-attribute=${t}].attribute devtools-suggestion-input`);
	};
	#l(e) {
		if (!this.disabled) return z`
      <devtools-button
        title=${e.title}
        .accessibleLabel=${e.title}
        .size=${Ce.SMALL}
        .iconName=${e.iconName}
        .variant=${l.ICON}
        jslog=${_(e.class).track({ click: !0 })}
        class="inline-button ${e.class}"
        @click=${e.onClick}
      ></devtools-button>
    `;
	}
	#u(e) {
		if (!this.disabled && [...ga[this.state.type].optional].includes(e) && !this.disabled) return z`<devtools-button
      .size=${Ce.SMALL}
      .iconName=${"bin"}
      .variant=${l.ICON}
      .title=${H(V.deleteRow)}
      class="inline-button delete-row"
      data-attribute=${e}
      jslog=${_("delete").track({ click: !0 })}
      @click=${(t) => {
			t.preventDefault(), t.stopPropagation(), this.#t(R(this.state, { [e]: void 0 }));
		}}
    ></devtools-button>`;
	}
	#d(e) {
		return this.#e.add("type"), z`<div class="row attribute" data-attribute="type" jslog=${g("type").track({ resize: !0 })}>
      <div id="type">type<span class="separator">:</span></div>
      <devtools-suggestion-input
        aria-labelledby="type"
        .disabled=${!e || this.disabled}
        .options=${Object.values(T)}
        .placeholder=${B.type}
        .value=${fa(this.state.type)}
        @blur=${this.#s}
      ></devtools-suggestion-input>
    </div>`;
	}
	#f(e) {
		this.#e.add(e);
		let t = this.state[e]?.toString();
		if (t !== void 0) return z`<div class="row attribute" data-attribute=${e} jslog=${g(y(e)).track({ resize: !0 })}>
      <div id=${e}>${e}<span class="separator">:</span></div>
      <devtools-suggestion-input
        .disabled=${this.disabled}
        aria-labelledby=${e}
        .placeholder=${B[e].toString()}
        .value=${fa(t)}
        .mimeType=${(() => {
			switch (e) {
				case "expression": return "text/javascript";
				case "properties": return "application/json";
				default: return "";
			}
		})()}
        @blur=${this.#o({
			attribute: e,
			from(t) {
				if (this.state[e] !== void 0) return { [e]: t };
			}
		})}
      ></devtools-suggestion-input>
      ${this.#u(e)}
    </div>`;
	}
	#p() {
		if (this.#e.add("frame"), this.state.frame !== void 0) return z`
      <div class="attribute" data-attribute="frame" jslog=${g("frame").track({ resize: !0 })}>
        <div class="row">
          <div id="frame">frame<span class="separator">:</span></div>
          ${this.#u("frame")}
        </div>
        ${this.state.frame.map((e, t, n) => z`
            <div class="padded row">
              <devtools-suggestion-input
                aria-labelledby="frame"
                .disabled=${this.disabled}
                .placeholder=${B.frame[0].toString()}
                .value=${fa(e.toString())}
                data-path=${`frame.${t}`}
                @blur=${this.#o({
			attribute: "frame",
			from(e) {
				if (this.state.frame?.[t] !== void 0) return { frame: new L({ [t]: e }) };
			}
		})}
              ></devtools-suggestion-input>
              ${this.#l({
			class: "add-frame",
			title: H(V.addFrameIndex),
			iconName: "plus",
			onClick: this.#i({ frame: new L({ [t + 1]: new aa(B.frame[0]) }) }, `devtools-suggestion-input[data-path="frame.${t + 1}"]`)
		})}
              ${this.#l({
			class: "remove-frame",
			title: H(V.removeFrameIndex),
			iconName: "minus",
			onClick: this.#i({ frame: new L({ [t]: void 0 }) }, `devtools-suggestion-input[data-path="frame.${Math.min(t, n.length - 2)}"]`)
		})}
            </div>
          `)}
      </div>
    `;
	}
	#m() {
		if (this.#e.add("selectors"), this.state.selectors !== void 0) return z`<div class="attribute" data-attribute="selectors" jslog=${g("selectors")}>
      <div class="row">
        <div>selectors<span class="separator">:</span></div>
        ${pa(ta, {
			disabled: this.disabled,
			onSelectorPicked: this.#n,
			onAttributeRequested: this.#r
		})}
        ${this.#u("selectors")}
      </div>
      ${this.state.selectors.map((e, t, n) => z`<div class="padded row" data-selector-path=${t}>
            <div id="selector-${t}">selector #${t + 1}<span class="separator">:</span></div>
            ${this.#l({
			class: "add-selector",
			title: H(V.addSelector),
			iconName: "plus",
			onClick: this.#i({ selectors: new L({ [t + 1]: new aa(structuredClone(B.selectors[0])) }) }, `devtools-suggestion-input[data-path="selectors.${t + 1}.0"]`)
		})}
            ${this.#l({
			class: "remove-selector",
			title: H(V.removeSelector),
			iconName: "minus",
			onClick: this.#i({ selectors: new L({ [t]: void 0 }) }, `devtools-suggestion-input[data-path="selectors.${Math.min(t, n.length - 2)}.0"]`)
		})}
          </div>
          ${e.map((e, n, r) => z`<div
              class="double padded row"
              data-selector-path="${t}.${n}"
            >
              <devtools-suggestion-input
                aria-labelledby="selector-${t}"
                .disabled=${this.disabled}
                .placeholder=${B.selectors[0][0]}
                .value=${fa(e)}
                data-path=${`selectors.${t}.${n}`}
                @blur=${this.#o({
			attribute: "selectors",
			from(e) {
				if (this.state.selectors?.[t]?.[n] !== void 0) return { selectors: new L({ [t]: new L({ [n]: e }) }) };
			}
		})}
              ></devtools-suggestion-input>
              ${this.#l({
			class: "add-selector-part",
			title: H(V.addSelectorPart),
			iconName: "plus",
			onClick: this.#i({ selectors: new L({ [t]: new L({ [n + 1]: new aa(B.selectors[0][0]) }) }) }, `devtools-suggestion-input[data-path="selectors.${t}.${n + 1}"]`)
		})}
              ${this.#l({
			class: "remove-selector-part",
			title: H(V.removeSelectorPart),
			iconName: "minus",
			onClick: this.#i({ selectors: new L({ [t]: new L({ [n]: void 0 }) }) }, `devtools-suggestion-input[data-path="selectors.${t}.${Math.min(n, r.length - 2)}"]`)
		})}
            </div>`)}`)}
    </div>`;
	}
	#h() {
		if (this.#e.add("assertedEvents"), this.state.assertedEvents !== void 0) return z`<div class="attribute" data-attribute="assertedEvents" jslog=${g("asserted-events")}>
      <div class="row">
        <div>asserted events<span class="separator">:</span></div>
        ${this.#u("assertedEvents")}
      </div>
      ${this.state.assertedEvents.map((e, t) => z` <div class="padded row" jslog=${g("event-type")}>
            <div id="event-type">type<span class="separator">:</span></div>
            <div aria-labelledby="event-type">${e.type}</div>
          </div>
          <div class="padded row" jslog=${g("event-title")}>
            <div id="event-title">title<span class="separator">:</span></div>
            <devtools-suggestion-input
              aria-labelledby="event-title"
              .disabled=${this.disabled}
              .placeholder=${B.assertedEvents[0].title}
              .value=${fa(e.title ?? "")}
              @blur=${this.#o({
			attribute: "assertedEvents",
			from(e) {
				if (this.state.assertedEvents?.[t]?.title !== void 0) return { assertedEvents: new L({ [t]: { title: e } }) };
			}
		})}
            ></devtools-suggestion-input>
          </div>
          <div  id="event-url" class="padded row" jslog=${g("event-url")}>
            <div>url<span class="separator">:</span></div>
            <devtools-suggestion-input
              aria-labelledby="event-url"
              .disabled=${this.disabled}
              .placeholder=${B.assertedEvents[0].url}
              .value=${fa(e.url ?? "")}
              @blur=${this.#o({
			attribute: "url",
			from(e) {
				if (this.state.assertedEvents?.[t]?.url !== void 0) return { assertedEvents: new L({ [t]: { url: e } }) };
			}
		})}
            ></devtools-suggestion-input>
          </div>`)}
    </div> `;
	}
	#g() {
		if (this.#e.add("attributes"), this.state.attributes !== void 0) return z`<div class="attribute" data-attribute="attributes" jslog=${g("attributes")}>
      <div class="row">
        <div>attributes<span class="separator">:</span></div>
        ${this.#u("attributes")}
      </div>
      ${this.state.attributes.map(({ name: e, value: t }, n, r) => z`<div class="padded row" jslog=${g("attribute")}>
          <devtools-suggestion-input
            .disabled=${this.disabled}
            .placeholder=${B.attributes[0].name}
            .value=${fa(e)}
            data-path=${`attributes.${n}.name`}
            jslog=${fe().track({ change: !0 })}
            @blur=${this.#o({
			attribute: "attributes",
			from(e) {
				if (this.state.attributes?.[n]?.name !== void 0) return { attributes: new L({ [n]: { name: e } }) };
			}
		})}
          ></devtools-suggestion-input>
          <span class="separator">:</span>
          <devtools-suggestion-input
            .disabled=${this.disabled}
            .placeholder=${B.attributes[0].value}
            .value=${fa(t)}
            data-path=${`attributes.${n}.value`}
            @blur=${this.#o({
			attribute: "attributes",
			from(e) {
				if (this.state.attributes?.[n]?.value !== void 0) return { attributes: new L({ [n]: { value: e } }) };
			}
		})}
          ></devtools-suggestion-input>
          ${this.#l({
			class: "add-attribute-assertion",
			title: H(V.addSelectorPart),
			iconName: "plus",
			onClick: this.#i({ attributes: new L({ [n + 1]: new aa((() => {
				{
					let e = new Set(r.map(({ name: e }) => e)), t = B.attributes[0], n = t.name, i = 0;
					for (; e.has(n);) ++i, n = `${t.name}-${i}`;
					return {
						...t,
						name: n
					};
				}
			})()) }) }, `devtools-suggestion-input[data-path="attributes.${n + 1}.name"]`)
		})}
          ${this.#l({
			class: "remove-attribute-assertion",
			title: H(V.removeSelectorPart),
			iconName: "minus",
			onClick: this.#i({ attributes: new L({ [n]: void 0 }) }, `devtools-suggestion-input[data-path="attributes.${Math.min(n, r.length - 2)}.value"]`)
		})}
        </div>`)}
    </div>`;
	}
	#_() {
		return [...ga[this.state.type].optional].filter((e) => this.state[e] === void 0).map((e) => z`<devtools-button
          .variant=${l.OUTLINED}
          class="add-row"
          data-attribute=${e}
          jslog=${_(`add-${y(e)}`)}
          @click=${this.#c}
        >
          ${H(V.addAttribute, { attributeName: e })}
        </devtools-button>`);
	}
	#v = (e) => {
		this.updateComplete.then(() => {
			this.renderRoot.querySelector(e)?.focus();
		});
	};
	render() {
		this.#e = /* @__PURE__ */ new Set();
		let e = z`
      <style>${na}</style>
      <div class="wrapper" jslog=${ze("step-editor")} >
        ${this.#d(this.isTypeEditable)} ${this.#f("target")}
        ${this.#p()} ${this.#m()}
        ${this.#f("deviceType")} ${this.#f("button")}
        ${this.#f("url")} ${this.#f("x")}
        ${this.#f("y")} ${this.#f("offsetX")}
        ${this.#f("offsetY")} ${this.#f("value")}
        ${this.#f("key")} ${this.#f("operator")}
        ${this.#f("count")} ${this.#f("expression")}
        ${this.#f("duration")} ${this.#h()}
        ${this.#f("timeout")} ${this.#f("width")}
        ${this.#f("height")} ${this.#f("deviceScaleFactor")}
        ${this.#f("isMobile")} ${this.#f("hasTouch")}
        ${this.#f("isLandscape")} ${this.#f("download")}
        ${this.#f("upload")} ${this.#f("latency")}
        ${this.#f("name")} ${this.#f("parameters")}
        ${this.#f("visible")} ${this.#f("properties")}
        ${this.#g()}
        ${this.error ? z`
              <div class="error">
                ${H(V.notSaved, { error: this.error })}
              </div>
            ` : void 0}
        ${this.disabled ? void 0 : z`<div
              class="row-buttons wrapped gap row regular-font no-margin"
            >
              ${this.#_()}
            </div>`}
      </div>
    `;
		for (let e of Object.keys(ha)) if (!this.#e.has(e)) throw Error(`The editable attribute ${e} does not have UI`);
		return e;
	}
};
S([da()], xa.prototype, "state", void 0), S([da()], xa.prototype, "error", void 0), S([ua({ type: Boolean })], xa.prototype, "isTypeEditable", void 0), S([ua({ type: Boolean })], xa.prototype, "disabled", void 0), xa = S([la("devtools-recorder-step-editor")], xa);
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/recorder/components/stepView.css.mjs
var Sa = "/*\n * Copyright 2023 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  font-size: inherit;\n}\n\n.title-container {\n  /* Vertically center items with min-width: 0; */\n  min-width: 0;\n  font-size: var(--sys-size-7);\n  display: flex;\n  flex-direction: row;\n  gap: var(--sys-size-2);\n  outline-offset: var(--sys-size-2);\n  flex-grow: 1;\n  align-items: center;\n}\n\n.action {\n  display: flex;\n  align-items: center;\n}\n\n.title {\n  flex: 1;\n  min-width: 0;\n}\n\n.is-start-of-group .title {\n  font-weight: bold;\n}\n\n.error-icon {\n  display: none;\n}\n\n.breakpoint-icon {\n  visibility: hidden;\n  cursor: pointer;\n  opacity: 0%;\n  fill: var(--sys-color-primary);\n  stroke: #1a73e8; /* stylelint-disable-line plugin/use_theme_colors */\n  transform: translate(-1.92px, -3px);\n}\n\n.circle-icon {\n  fill: var(--sys-color-primary);\n  stroke: var(--sys-color-cdt-base-container);\n  stroke-width: 4px;\n  r: 5px;\n  cx: 8px;\n  cy: 8px;\n}\n\n.is-start-of-group:not(:first-of-type) .circle-icon {\n  r: 7px;\n  fill: var(--sys-color-cdt-base-container);\n  stroke: var(--sys-color-primary);\n  stroke-width: 2px;\n}\n\n.step.is-success .circle-icon {\n  fill: var(--sys-color-primary);\n  stroke: var(--sys-color-primary);\n}\n\n.step.is-current .circle-icon {\n  stroke-dasharray: 24 10;\n  animation: rotate 1s linear infinite;\n  fill: var(--sys-color-cdt-base-container);\n  stroke: var(--sys-color-primary);\n  stroke-width: 2px;\n}\n\n.error {\n  margin: 16px 0 0;\n  padding: 8px;\n  background: var(--sys-color-error-container);\n  color: var(--sys-color-error);\n  position: relative;\n}\n\n@keyframes rotate {\n  0% {\n    transform: translate(8px, 8px) rotate(0) translate(-8px, -8px);\n  }\n\n  100% {\n    transform: translate(8px, 8px) rotate(360deg) translate(-8px, -8px);\n  }\n}\n\n.step.is-error .circle-icon {\n  fill: var(--sys-color-error);\n  stroke: var(--sys-color-error);\n}\n\n.step.is-error .error-icon {\n  display: block;\n  transform: translate(4px, 4px);\n}\n\n:host-context(.was-successful) .circle-icon {\n  animation: flash-circle 2s;\n}\n\n:host-context(.was-successful) .breakpoint-icon {\n  animation: flash-breakpoint-icon 2s;\n}\n\n@keyframes flash-circle {\n  25% {\n    fill: var(--override-color-recording-successful-text);\n    stroke: var(--override-color-recording-successful-text);\n  }\n\n  75% {\n    fill: var(--override-color-recording-successful-text);\n    stroke: var(--override-color-recording-successful-text);\n  }\n}\n\n@keyframes flash-breakpoint-icon {\n  25% {\n    fill: var(--override-color-recording-successful-text);\n    stroke: var(--override-color-recording-successful-text);\n  }\n\n  75% {\n    fill: var(--override-color-recording-successful-text);\n    stroke: var(--override-color-recording-successful-text);\n  }\n}\n\n.chevron {\n  width: 14px;\n  height: 14px;\n  transition: 200ms;\n  position: absolute;\n  top: 14px;\n  left: 24px;\n  transform: rotate(-90deg);\n  color: var(--sys-color-on-surface);\n}\n\n.expanded .chevron {\n  transform: rotate(0deg);\n}\n\n.is-start-of-group .chevron {\n  top: 34px;\n}\n\n.details {\n  display: none;\n  margin-top: 8px;\n  position: relative;\n}\n\n.expanded .details {\n  display: block;\n}\n\n.step-details {\n  overflow: auto;\n}\n\ndevtools-recorder-step-editor {\n  border: 1px solid var(--sys-color-neutral-outline);\n  padding: 3px 6px 6px;\n  margin-left: -6px;\n  border-radius: 3px;\n}\n\ndevtools-recorder-step-editor:hover {\n  border: 1px solid var(--sys-color-neutral-outline);\n}\n\ndevtools-recorder-step-editor.is-selected {\n  background-color: color-mix(\n    in srgb,\n    var(--sys-color-tonal-container),\n    var(--sys-color-cdt-base-container) 50%\n  );\n  border: 1px solid var(--sys-color-tonal-outline);\n}\n\n.summary {\n  display: flex;\n  flex-flow: row nowrap;\n}\n\n.subtitle {\n  font-weight: normal;\n  color: var(--sys-color-on-surface-subtle);\n  word-break: break-all;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.main-title {\n  word-break: break-all;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.step-actions {\n  border: none;\n  border-radius: 0;\n  height: 24px;\n\n  --override-select-menu-show-button-border-radius: 0;\n  --override-select-menu-show-button-outline: none;\n  --override-select-menu-show-button-padding: 0;\n}\n\n.step.has-breakpoint .circle-icon {\n  visibility: hidden;\n}\n\n.step:not(.is-start-of-group).has-breakpoint .breakpoint-icon {\n  visibility: visible;\n  opacity: 100%;\n}\n\n.step:not(.is-start-of-group, .has-breakpoint) .icon:hover .circle-icon {\n  transition: opacity 0.2s;\n  opacity: 0%;\n}\n\n.step:not(.is-start-of-group, .has-breakpoint) .icon:hover .error-icon {\n  visibility: hidden;\n}\n\n.step:not(.is-start-of-group, .has-breakpoint) .icon:hover .breakpoint-icon {\n  transition: opacity 0.2s;\n  visibility: visible;\n  opacity: 50%;\n}\n", Ca = "/*\n * Copyright 2023 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  font-size: inherit;\n}\n\n.timeline-section {\n  position: relative;\n  padding: 8px 0 8px 40px;\n  margin-left: 8px;\n\n  --override-color-recording-successful-text: #36a854;\n  --override-color-recording-successful-background: #e6f4ea;\n}\n\n.overlay {\n  position: absolute;\n  width: 100vw;\n  height: 100%;\n  /* Offset of 32px for spacing and 80px for screenshot */\n  left: calc(-32px - 80px);\n  top: 0;\n  z-index: -1;\n  pointer-events: none;\n}\n\n@container (max-width: 400px) {\n  .overlay {\n    /* Offset of 32px for spacing */\n    left: -32px;\n  }\n}\n\n:hover .overlay {\n  background: var(--sys-color-state-hover-on-subtle);\n}\n\n.is-selected .overlay {\n  background: var(--sys-color-tonal-container);\n}\n\n:host-context(.is-stopped) .overlay {\n  background: var(--sys-color-state-ripple-primary);\n  outline: 1px solid var(--sys-color-state-focus-ring);\n  z-index: 4;\n}\n\n.is-start-of-group:not(:first-of-type) {\n  padding-top: 16px;\n}\n\n.is-end-of-group {\n  padding-bottom: 16px;\n}\n\n.icon {\n  position: absolute;\n  left: 4px;\n  transform: translateX(-50%);\n  z-index: 2;\n}\n\n.bar {\n  position: absolute;\n  left: 4px;\n  display: block;\n  transform: translateX(-50%);\n  top: 18px;\n  height: 100%;\n  z-index: 1; /* We want this to be below of `.overlay` for stopped case */\n}\n\n.bar .background {\n  fill: var(--sys-color-state-hover-on-subtle);\n}\n\n.bar .line {\n  fill: var(--sys-color-primary);\n}\n\n.is-first-section .bar {\n  height: 100%;\n  display: none;\n}\n\n.is-first-section:not(.is-last-section) .bar {\n  display: block;\n}\n\n.is-last-section .bar .line {\n  display: none;\n}\n\n.is-last-section .bar .background {\n  display: none;\n}\n\n:host-context(.is-error) .bar .line {\n  fill: var(--sys-color-error);\n}\n\n:host-context(.is-error) .bar .background {\n  fill: var(--sys-color-error-container);\n}\n\n:host-context(.was-successful) .bar .background {\n  animation: flash-background 2s;\n}\n\n:host-context(.was-successful) .bar .line {\n  animation: flash-line 2s;\n}\n\n@keyframes flash-background {\n  25% {\n    fill: var(--override-color-recording-successful-background);\n  }\n\n  75% {\n    fill: var(--override-color-recording-successful-background);\n  }\n}\n\n@keyframes flash-line {\n  25% {\n    fill: var(--override-color-recording-successful-text);\n  }\n\n  75% {\n    fill: var(--override-color-recording-successful-text);\n  }\n}\n", { html: wa } = m, Ta = (e, t, n) => {
	let r = {
		"timeline-section": !0,
		"is-end-of-group": e.isEndOfGroup,
		"is-start-of-group": e.isStartOfGroup,
		"is-first-section": e.isFirstSection,
		"is-last-section": e.isLastSection,
		"is-selected": e.isSelected
	};
	p(wa`
    <style>${Ca}</style>
    <div class=${ye(r)}>
      <div class="overlay"></div>
      <div class="icon"><slot name="icon"></slot></div>
      <svg width="24" height="100%" class="bar">
        <rect class="line" x="7" y="0" width="2" height="100%" />
      </svg>
      <slot></slot>
    </div>
  `, n);
}, Ea = class extends v {
	#e = !1;
	#t = !1;
	#n = !1;
	#r = !1;
	#i = !1;
	#a;
	constructor(e, t = Ta) {
		super(e, { useShadowDom: !0 }), this.#a = t;
	}
	set isEndOfGroup(e) {
		this.#e = e, this.requestUpdate();
	}
	set isStartOfGroup(e) {
		this.#t = e, this.requestUpdate();
	}
	set isFirstSection(e) {
		this.#n = e, this.requestUpdate();
	}
	set isLastSection(e) {
		this.#r = e, this.requestUpdate();
	}
	set isSelected(e) {
		this.#i = e, this.requestUpdate();
	}
	performUpdate() {
		this.#a({
			isEndOfGroup: this.#e,
			isStartOfGroup: this.#t,
			isFirstSection: this.#n,
			isLastSection: this.#r,
			isSelected: this.#i
		}, {}, this.contentElement);
	}
}, { html: Da } = m, { widget: Oa } = Be, U = {
	setViewportClickTitle: "Set viewport",
	customStepTitle: "Custom step",
	clickStepTitle: "Click",
	doubleClickStepTitle: "Double click",
	hoverStepTitle: "Hover",
	emulateNetworkConditionsStepTitle: "Emulate network conditions",
	changeStepTitle: "Change",
	closeStepTitle: "Close",
	scrollStepTitle: "Scroll",
	keyUpStepTitle: "Key up",
	navigateStepTitle: "Navigate",
	keyDownStepTitle: "Key down",
	waitForElementStepTitle: "Wait for element",
	waitForExpressionStepTitle: "Wait for expression",
	elementRoleButton: "Button",
	elementRoleInput: "Input",
	elementRoleFallback: "Element",
	addStepBefore: "Add step before",
	addStepAfter: "Add step after",
	removeStep: "Remove step",
	openStepActions: "Open step actions",
	addBreakpoint: "Add breakpoint",
	removeBreakpoint: "Remove breakpoint",
	copyAs: "Copy as",
	stepManagement: "Manage steps",
	breakpoints: "Breakpoints"
}, ka = i("panels/recorder/components/StepView.ts", U), W = n.bind(void 0, ka), G = /* @__PURE__ */ function(e) {
	return e.DEFAULT = "default", e.SUCCESS = "success", e.CURRENT = "current", e.OUTSTANDING = "outstanding", e.ERROR = "error", e.STOPPED = "stopped", e;
}({}), Aa = class e extends Event {
	static eventName = "copystep";
	step;
	constructor(t) {
		super(e.eventName, {
			bubbles: !0,
			composed: !0
		}), this.step = t;
	}
}, ja = class e extends Event {
	static eventName = "stepchanged";
	currentStep;
	newStep;
	constructor(t, n) {
		super(e.eventName, {
			bubbles: !0,
			composed: !0
		}), this.currentStep = t, this.newStep = n;
	}
}, Ma = /* @__PURE__ */ function(e) {
	return e.BEFORE = "before", e.AFTER = "after", e;
}({}), Na = class e extends Event {
	static eventName = "addstep";
	position;
	stepOrSection;
	constructor(t, n) {
		super(e.eventName, {
			bubbles: !0,
			composed: !0
		}), this.stepOrSection = t, this.position = n;
	}
}, Pa = class e extends Event {
	static eventName = "removestep";
	step;
	constructor(t) {
		super(e.eventName, {
			bubbles: !0,
			composed: !0
		}), this.step = t;
	}
}, Fa = class e extends Event {
	static eventName = "addbreakpoint";
	index;
	constructor(t) {
		super(e.eventName, {
			bubbles: !0,
			composed: !0
		}), this.index = t;
	}
}, Ia = class e extends Event {
	static eventName = "removebreakpoint";
	index;
	constructor(t) {
		super(e.eventName, {
			bubbles: !0,
			composed: !0
		}), this.index = t;
	}
}, La = "copy-step-as-";
function Ra(e) {
	if (e.section) return e.section.title ? e.section.title : Da`<span class="fallback">(No Title)</span>`;
	if (!e.step) throw Error("Missing both step and section");
	switch (e.step.type) {
		case T.CustomStep: return W(U.customStepTitle);
		case T.SetViewport: return W(U.setViewportClickTitle);
		case T.Click: return W(U.clickStepTitle);
		case T.DoubleClick: return W(U.doubleClickStepTitle);
		case T.Hover: return W(U.hoverStepTitle);
		case T.EmulateNetworkConditions: return W(U.emulateNetworkConditionsStepTitle);
		case T.Change: return W(U.changeStepTitle);
		case T.Close: return W(U.closeStepTitle);
		case T.Scroll: return W(U.scrollStepTitle);
		case T.KeyUp: return W(U.keyUpStepTitle);
		case T.KeyDown: return W(U.keyDownStepTitle);
		case T.WaitForElement: return W(U.waitForElementStepTitle);
		case T.WaitForExpression: return W(U.waitForExpressionStepTitle);
		case T.Navigate: return W(U.navigateStepTitle);
	}
}
function za(e) {
	switch (e) {
		case "button": return W(U.elementRoleButton);
		case "input": return W(U.elementRoleInput);
		default: return W(U.elementRoleFallback);
	}
}
function Ba(e) {
	if (!("selectors" in e)) return "";
	let t = e.selectors.flat().find((e) => e.startsWith("aria/"));
	if (!t) return "";
	let n = t.match(/^aria\/(.+?)(\[role="(.+)"\])?$/);
	return n ? `${za(n[3])} "${n[1]}"` : "";
}
function Va(e) {
	return e ? e.url : "";
}
function Ha(e) {
	return Da`
    <devtools-menu-button
      class="step-actions"
      title=${W(U.openStepActions)}
      aria-label=${W(U.openStepActions)}
      .populateMenuCall=${e.populateStepContextMenu}
      @keydown=${(e) => {
		e.stopPropagation();
	}}
      jslog=${Ve("step-actions").track({ click: !0 })}
      .iconName=${"dots-vertical"}
    ></devtools-menu-button>
  `;
}
var Ua = (e, t, n) => {
	if (!e.step && !e.section) return;
	let r = {
		step: !0,
		expanded: e.showDetails,
		"is-success": e.state === "success",
		"is-current": e.state === "current",
		"is-outstanding": e.state === "outstanding",
		"is-error": e.state === "error",
		"is-stopped": e.state === "stopped",
		"is-start-of-group": e.isStartOfGroup,
		"is-first-section": e.isFirstSection,
		"has-breakpoint": e.hasBreakpoint
	}, i = !!e.step, a = Ra({
		step: e.step,
		section: e.section
	}), o = e.step ? Ba(e.step) : Va(e.section);
	p(Da`
    <style>${Sa}</style>
    <div>
      <devtools-widget ${Oa(Ea, {
		isFirstSection: e.isFirstSection,
		isLastSection: e.isLastSection,
		isStartOfGroup: e.isStartOfGroup,
		isEndOfGroup: e.isEndOfGroup,
		isSelected: e.isSelected
	})}
        @contextmenu=${(t) => {
		let n = new Ae(t);
		e.populateStepContextMenu(n), n.show();
	}}
        data-step-index=${e.stepIndex}
        data-section-index=${e.sectionIndex}
        @click=${(t) => {
		t.stopPropagation();
		let n = e.step || e.section;
		n && e.onStepClick(n);
	}}
        @mouseover=${() => {
		let t = e.step || e.section;
		t && e.onStepHover(t);
	}}
        class=${ye(r)}>
        <svg slot="icon" width="24" height="24" class="icon">
          <circle class="circle-icon"/>
          <g class="error-icon">
            <path d="M1.5 1.5L6.5 6.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M1.5 6.5L6.5 1.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </g>
          <path @click=${e.onBreakpointClick} jslog=${_("breakpoint").track({ click: !0 })} class="breakpoint-icon" d="M2.5 5.5H17.7098L21.4241 12L17.7098 18.5H2.5V5.5Z"/>
        </svg>
        <div class="summary">
          <div class="title-container ${i ? "action" : ""}"
            @click=${i ? e.toggleShowDetails : void 0}
            @keydown=${i ? e.onToggleShowDetailsKeydown : void 0}
            tabindex="0"
            jslog=${Ze().track({ click: !0 })}
            aria-role=${i ? "button" : ""}
            aria-label=${i ? "Show details for step" : ""}
          >
            ${i ? Da`<devtools-icon
                    class="chevron"
                    jslog=${se().track({ click: !0 })}
                    name="triangle-down">
                  </devtools-icon>` : ""}
            <div class="title">
              <div class="main-title" title=${a}>${a}</div>
              <div class="subtitle" title=${o}>${o}</div>
            </div>
          </div>
          ${Ha(e)}
        </div>
        <div class="details">
          ${e.step && Da`<devtools-recorder-step-editor
            class=${e.isSelected ? "is-selected" : ""}
            .step=${e.step}
            .disabled=${e.isPlaying}
            @stepedited=${e.stepEdited}>
          </devtools-recorder-step-editor>`}
          ${e.section?.causingStep && Da`<devtools-recorder-step-editor
            .step=${e.section.causingStep}
            .isTypeEditable=${!1}
            .disabled=${e.isPlaying}
            @stepedited=${e.stepEdited}>
          </devtools-recorder-step-editor>`}
        </div>
        ${e.error && Da`
          <div class="error" role="alert">
            ${e.error.message}
          </div>
        `}
      </devtools-widget>
    </div>
  `, n, { container: { classes: ["step-view-widget"] } });
}, Wa = class extends v {
	#e = new IntersectionObserver((e) => {
		this.#t.isVisible = e[0].isIntersecting;
	});
	#t = {
		state: "default",
		showDetails: !1,
		isEndOfGroup: !1,
		isStartOfGroup: !1,
		stepIndex: 0,
		sectionIndex: 0,
		isFirstSection: !1,
		isLastSection: !1,
		isRecording: !1,
		isPlaying: !1,
		isVisible: !1,
		hasBreakpoint: !1,
		removable: !0,
		builtInConverters: [],
		extensionConverters: [],
		isSelected: !1,
		actions: [],
		stepEdited: this.#a.bind(this),
		onBreakpointClick: this.#s.bind(this),
		handleStepAction: this.#o.bind(this),
		toggleShowDetails: this.#r.bind(this),
		onToggleShowDetailsKeydown: this.#i.bind(this),
		populateStepContextMenu: this.#l.bind(this),
		onStepClick: () => {},
		onStepHover: () => {}
	};
	#n;
	constructor(e, t) {
		super(e, { useShadowDom: "pure" }), this.#n = t || Ua;
	}
	set step(e) {
		this.#t.step = e, this.requestUpdate();
	}
	set section(e) {
		this.#t.section = e, this.requestUpdate();
	}
	set state(e) {
		let t = this.#t.state;
		this.#t.state = e, this.performUpdate(), this.#t.state !== t && this.#t.state === "current" && !this.#t.isVisible && this.element.scrollIntoView();
	}
	set error(e) {
		this.#t.error = e, this.requestUpdate();
	}
	set isEndOfGroup(e) {
		this.#t.isEndOfGroup = e, this.requestUpdate();
	}
	set isStartOfGroup(e) {
		this.#t.isStartOfGroup = e, this.requestUpdate();
	}
	set stepIndex(e) {
		this.#t.stepIndex = e, this.requestUpdate();
	}
	set sectionIndex(e) {
		this.#t.sectionIndex = e, this.requestUpdate();
	}
	set isFirstSection(e) {
		this.#t.isFirstSection = e, this.requestUpdate();
	}
	set isLastSection(e) {
		this.#t.isLastSection = e, this.requestUpdate();
	}
	set isRecording(e) {
		this.#t.isRecording = e, this.requestUpdate();
	}
	set isPlaying(e) {
		this.#t.isPlaying = e, this.requestUpdate();
	}
	set hasBreakpoint(e) {
		this.#t.hasBreakpoint = e, this.requestUpdate();
	}
	set removable(e) {
		this.#t.removable = e, this.requestUpdate();
	}
	set builtInConverters(e) {
		this.#t.builtInConverters = e, this.requestUpdate();
	}
	set extensionConverters(e) {
		this.#t.extensionConverters = e, this.requestUpdate();
	}
	set isSelected(e) {
		this.#t.isSelected = e, this.requestUpdate();
	}
	set recorderSettings(e) {
		this.#t.recorderSettings = e, this.requestUpdate();
	}
	set onStepClick(e) {
		this.#t.onStepClick = e, this.requestUpdate();
	}
	set onStepHover(e) {
		this.#t.onStepHover = e, this.requestUpdate();
	}
	get step() {
		return this.#t.step;
	}
	get section() {
		return this.#t.section;
	}
	wasShown() {
		super.wasShown(), this.#e.observe(this.element), this.requestUpdate();
	}
	willHide() {
		super.willHide(), this.#e.unobserve(this.element);
	}
	#r() {
		this.#t.showDetails = !this.#t.showDetails, this.requestUpdate();
	}
	#i(e) {
		let t = e;
		(t.key === "Enter" || t.key === " ") && (this.#r(), e.stopPropagation(), e.preventDefault());
	}
	#a(e) {
		let t = this.#t.step || this.#t.section?.causingStep;
		if (!t) throw Error("Expected step.");
		this.contentElement.dispatchEvent(new ja(t, e.data));
	}
	#o(e) {
		switch (e.itemValue) {
			case "add-step-before": {
				let e = this.#t.step || this.#t.section;
				if (!e) throw Error("Expected step or section.");
				this.contentElement.dispatchEvent(new Na(e, "before"));
				break;
			}
			case "add-step-after": {
				let e = this.#t.step || this.#t.section;
				if (!e) throw Error("Expected step or section.");
				this.contentElement.dispatchEvent(new Na(e, "after"));
				break;
			}
			case "remove-step": {
				let e = this.#t.section?.causingStep;
				if (!this.#t.step && !e) throw Error("Expected step.");
				this.contentElement.dispatchEvent(new Pa(this.#t.step || e));
				break;
			}
			case "add-breakpoint":
				if (!this.#t.step) throw Error("Expected step");
				this.contentElement.dispatchEvent(new Fa(this.#t.stepIndex));
				break;
			case "remove-breakpoint":
				if (!this.#t.step) throw Error("Expected step");
				this.contentElement.dispatchEvent(new Ia(this.#t.stepIndex));
				break;
			default: {
				let t = e.itemValue;
				if (!t.startsWith(La)) throw Error("Unknown step action.");
				let n = this.#t.step || this.#t.section?.causingStep;
				if (!n) throw Error("Step not found.");
				let r = t.substring(13);
				this.#t.recorderSettings && (this.#t.recorderSettings.preferredCopyFormat = r), this.contentElement.dispatchEvent(new Aa(structuredClone(n)));
			}
		}
	}
	#s() {
		this.#t.hasBreakpoint ? this.contentElement.dispatchEvent(new Ia(this.#t.stepIndex)) : this.contentElement.dispatchEvent(new Fa(this.#t.stepIndex)), this.requestUpdate();
	}
	#c = () => {
		let e = [];
		if (this.#t.isPlaying || (this.#t.step && e.push({
			id: "add-step-before",
			label: W(U.addStepBefore),
			group: "stepManagement",
			groupTitle: W(U.stepManagement)
		}), e.push({
			id: "add-step-after",
			label: W(U.addStepAfter),
			group: "stepManagement",
			groupTitle: W(U.stepManagement)
		}), this.#t.removable && e.push({
			id: "remove-step",
			group: "stepManagement",
			groupTitle: W(U.stepManagement),
			label: W(U.removeStep)
		})), this.#t.step && !this.#t.isRecording && (this.#t.hasBreakpoint ? e.push({
			id: "remove-breakpoint",
			label: W(U.removeBreakpoint),
			group: "breakPointManagement",
			groupTitle: W(U.breakpoints)
		}) : e.push({
			id: "add-breakpoint",
			label: W(U.addBreakpoint),
			group: "breakPointManagement",
			groupTitle: W(U.breakpoints)
		})), this.#t.step) {
			for (let t of this.#t.builtInConverters || []) e.push({
				id: La + y(t.getId()),
				label: t.getFormatName(),
				group: "copy",
				groupTitle: W(U.copyAs)
			});
			for (let t of this.#t.extensionConverters || []) e.push({
				id: La + y(t.getId()),
				label: t.getFormatName(),
				group: "copy",
				groupTitle: W(U.copyAs),
				jslogContext: "copy-step-as-extension"
			});
		}
		return e;
	};
	#l(e) {
		let t = this.#c(), n = t.filter((e) => e.id.startsWith(La)), r = t.filter((e) => !e.id.startsWith(La));
		for (let t of r) e.section(t.group).appendItem(t.label, () => {
			this.#o(new wt(t.id));
		}, { jslogContext: t.id });
		let i = n.find((e) => e.id === La + this.#t.recorderSettings?.preferredCopyFormat);
		if (i && e.section("copy").appendItem(i.label, () => {
			this.#o(new wt(i.id));
		}, { jslogContext: i.id }), n.length) {
			let t = e.section("copy").appendSubMenuItem(W(U.copyAs), !1, "copy");
			for (let e of n) e !== i && t.section(e.group).appendItem(e.label, () => {
				this.#o(new wt(e.id));
			}, { jslogContext: e.id });
		}
	}
	performUpdate() {
		this.#t.actions = this.#c(), this.#n(this.#t, void 0, this.contentElement);
	}
}, { html: K } = m, { widget: Ga } = Be, q = {
	mobile: "Mobile",
	desktop: "Desktop",
	latency: "Latency: {value} ms",
	upload: "Upload: {value}",
	download: "Download: {value}",
	editReplaySettings: "Edit replay settings",
	replaySettings: "Replay settings",
	default: "Default",
	environment: "Environment",
	screenshotForSection: "Screenshot for this section",
	editTitle: "Edit title",
	requiredTitleError: "Title is required",
	recording: "Recording…",
	endRecording: "End recording",
	recordingIsBeingStopped: "Stopping recording…",
	timeout: "Timeout: {value} ms",
	network: "Network",
	timeoutLabel: "Timeout",
	timeoutExplanation: "The timeout setting (in milliseconds) applies to every action when replaying the recording. For example, if a DOM element identified by a CSS selector does not appear on the page within the specified timeout, the replay fails with an error.",
	cancelReplay: "Cancel replay",
	showCode: "Show code",
	hideCode: "Hide code",
	addAssertion: "Add assertion",
	performancePanel: "Performance panel",
	codeSidebarOpened: "Code sidebar opened",
	codeSidebarClosed: "Code sidebar closed"
}, Ka = i("panels/recorder/components/RecordingView.ts", q), J = n.bind(void 0, Ka), qa = /* @__PURE__ */ function(e) {
	return e.PERFORMANCE_PANEL = "timeline", e.DEFAULT = "chrome-recorder", e;
}({}), Ja = [
	Re,
	Te,
	et,
	he,
	Ie
];
function Ya({ settings: e, replaySettingsExpanded: t, onSelectMenuLabelClick: n, onNetworkConditionsChange: i, onTimeoutInput: a, isRecording: o, replayState: s, onReplaySettingsKeydown: c, onToggleReplaySettings: l }) {
	if (!e) return we;
	let u = [];
	e.viewportSettings && (u.push(K`<div>${e.viewportSettings.isMobile ? J(q.mobile) : J(q.desktop)}</div>`), u.push(K`<div class="separator"></div>`), u.push(K`<div>${e.viewportSettings.width}×${e.viewportSettings.height} px</div>`));
	let d = [];
	if (!t) e.networkConditionsSettings ? e.networkConditionsSettings.title ? d.push(K`<div>${e.networkConditionsSettings.title}</div>`) : d.push(K`<div>
          ${J(q.download, { value: r(e.networkConditionsSettings.download) })},
          ${J(q.upload, { value: r(e.networkConditionsSettings.upload) })},
          ${J(q.latency, { value: e.networkConditionsSettings.latency })}
        </div>`) : d.push(K`<div>${Re.title instanceof Function ? Re.title() : Re.title}</div>`), d.push(K`<div class="separator"></div>`), d.push(K`<div>${J(q.timeout, { value: e.timeout || 5e3 })}</div>`);
	else {
		let t = e.networkConditionsSettings?.i18nTitleKey || Re.i18nTitleKey, r = Ja.find((e) => e.i18nTitleKey === t), o = "";
		r && (o = r.title instanceof Function ? r.title() : r.title), d.push(K`<div class="editable-setting">
      <label class="wrapping-label" @click=${n}>
        ${J(q.network)}
        <select
            title=${o}
            jslog=${Ve("network-conditions").track({ change: !0 })}
            @change=${i}>
      ${Ja.map((e) => K`
        <option jslog=${oe(y(e.i18nTitleKey || ""))}
                value=${e.i18nTitleKey || ""} ?selected=${t === e.i18nTitleKey}>
                ${e.title instanceof Function ? e.title() : e.title}
        </option>`)}
    </select>
      </label>
    </div>`), d.push(K`<div class="editable-setting">
      <label class="wrapping-label" title=${J(q.timeoutExplanation)}>
        ${J(q.timeoutLabel)}
        <input
          @input=${a}
          required
          min=${1}
          max=${Mr}
          value=${e.timeout || 5e3}
          jslog=${$e("timeout").track({ change: !0 })}
          class="devtools-text-input"
          type="number">
      </label>
    </div>`);
	}
	let f = !o && !s.isPlaying, p = {
		"settings-title": !0,
		expanded: t
	}, ee = {
		expanded: t,
		settings: !0
	};
	return K`
    <div class="settings-row">
      <div class="settings-container">
        <div
          class=${ye(p)}
          @keydown=${f && c}
          @click=${f && l}
          aria-expanded=${p.expanded ?? !1}
          tabindex="0"
          role="button"
          jslog=${_("replay-settings").track({ click: !0 })}
          aria-label=${J(q.editReplaySettings)}>
          <span>${J(q.replaySettings)}</span>
          ${f ? K`<devtools-icon
                  class="chevron"
                  name="triangle-down">
                </devtools-icon>` : ""}
        </div>
        <div class=${ye(ee)}>
          ${d.length ? d : K`<div>${J(q.default)}</div>`}
        </div>
      </div>
      <div class="settings-container">
        <div class="settings-title">${J(q.environment)}</div>
        <div class="settings">
          ${u.length ? u : K`<div>${J(q.default)}</div>`}
        </div>
      </div>
    </div>
  `;
}
function Xa(e, t) {
	return e.extensionDescriptor ? K`
        <devtools-recorder-extension-view .descriptor=${e.extensionDescriptor}>
        </devtools-recorder-extension-view>
      ` : K`
        <devtools-split-view
          direction="auto"
          sidebar-position="second"
          sidebar-initial-size="300"
          sidebar-visibility=${e.showCodeView ? "" : "hidden"}
        >
          <div slot="main">
            ${eo(e)}
          </div>
          <div slot="sidebar" jslog=${Ye("source-code").track({ resize: !0 })}>
            ${e.showCodeView ? K`
            <div class="section-toolbar" jslog=${Ge()}>
              <devtools-select-menu
                @selectmenuselected=${e.onCodeFormatChange}
                .showDivider=${!0}
                .showArrow=${!0}
                .sideButton=${!1}
                .showSelectedItem=${!0}
                .position=${Tt.BOTTOM}
                .buttonTitle=${e.converterName || ""}
                .jslogContext=${"code-format"}
              >
                ${e.builtInConverters.map((t) => K`<devtools-menu-item
                    .value=${t.getId()}
                    .selected=${e.converterId === t.getId()}
                    jslog=${_().track({ click: !0 }).context(`converter-${y(t.getId())}`)}
                  >
                    ${t.getFormatName()}
                  </devtools-menu-item>`)}
                ${e.extensionConverters.map((t) => K`<devtools-menu-item
                    .value=${t.getId()}
                    .selected=${e.converterId === t.getId()}
                    jslog=${_().track({ click: !0 }).context("converter-extension")}
                  >
                    ${t.getFormatName()}
                  </devtools-menu-item>`)}
              </devtools-select-menu>
              <devtools-button
                title=${oi(J(q.hideCode), x.TOGGLE_CODE_VIEW)}
                .data=${{
		variant: l.ICON,
		size: Ce.SMALL,
		iconName: "cross"
	}}
                @click=${e.showCodeToggle}
                jslog=${me().track({ click: !0 })}
              ></devtools-button>
            </div>
            ${Za(e, t)}` : we}
          </div>
        </devtools-split-view>
      `;
}
function Za(e, t) {
	if (!e.editorState) throw Error("Unexpected: trying to render the text editor without editorState");
	return K`
    <div class="text-editor" jslog=${$e().track({ change: !0 })}>
      <devtools-text-editor .state=${e.editorState} ${Se((e) => {
		e && e instanceof _t && (t.highlightLinesInEditor = (t, n, r = !1) => {
			let i = e.editor, a = e.createSelection({
				lineNumber: t + n,
				columnNumber: 0
			}, {
				lineNumber: t,
				columnNumber: 0
			}), o = e.state.doc.lineAt(a.main.anchor);
			a = e.createSelection({
				lineNumber: t + n - 1,
				columnNumber: o.length + 1
			}, {
				lineNumber: t,
				columnNumber: 0
			}), i.dispatch({
				selection: a,
				effects: r ? [gt.scrollIntoView(a.main, { y: "nearest" })] : void 0
			});
		});
	})}></devtools-text-editor>
    </div>
  `;
}
function Qa(e) {
	return e.screenshot ? K`
      <img class="screenshot" src=${e.screenshot} alt=${J(q.screenshotForSection)} />
    ` : null;
}
function $a(e) {
	return e.replayState.isPlaying ? K`
        <devtools-button .jslogContext=${"abort-replay"} @click=${e.onAbortReplay} .iconName=${"pause"} .variant=${l.OUTLINED}>
          ${J(q.cancelReplay)}
        </devtools-button>` : e.recorderSettings ? K`${Ga(Ki, {
		settings: e.recorderSettings,
		replayExtensions: e.replayExtensions,
		onStartReplay: e.onTogglePlaying,
		disabled: e.replayState.isPlaying
	})}` : we;
}
function eo(e) {
	return K`
      <div class="sections">
      ${e.showCodeView ? "" : K`<div class="section-toolbar">
        <devtools-button
          @click=${e.showCodeToggle}
          class="show-code"
          .data=${{
		variant: l.OUTLINED,
		title: oi(J(q.showCode), x.TOGGLE_CODE_VIEW)
	}}
          jslog=${qe(x.TOGGLE_CODE_VIEW).track({ click: !0 })}
        >
          ${J(q.showCode)}
        </devtools-button>
      </div>`}
      ${e.sections.map((t, n) => K`
            <div class="section">
              <div class="screenshot-wrapper">
                ${Qa(t)}
              </div>
              <div class="content">
                <div class="steps">
                  ${Ga(Wa, {
		section: t,
		state: e.getSectionState(t),
		isStartOfGroup: !0,
		isEndOfGroup: t.steps.length === 0,
		isFirstSection: n === 0,
		isLastSection: n === e.sections.length - 1 && t.steps.length === 0,
		isSelected: e.selectedStep === (t.causingStep || null),
		sectionIndex: n,
		isRecording: e.isRecording,
		isPlaying: e.replayState.isPlaying,
		error: e.getSectionState(t) === G.ERROR ? e.currentError ?? void 0 : void 0,
		hasBreakpoint: !1,
		removable: e.recording.steps.length > 1 && !!t.causingStep,
		onStepClick: e.onStepClick,
		onStepHover: e.onStepHover
	})}
                  ${t.steps.map((r) => {
		let i = e.recording.steps.indexOf(r);
		return K`
                      <devtools-widget
                      @copystep=${e.onCopyStep}
                      ${Ga(Wa, {
			step: r,
			state: e.getStepState(r),
			error: e.currentStep === r ? e.currentError ?? void 0 : void 0,
			isFirstSection: !1,
			isLastSection: n === e.sections.length - 1 && e.recording.steps[e.recording.steps.length - 1] === r,
			isStartOfGroup: !1,
			isEndOfGroup: t.steps[t.steps.length - 1] === r,
			stepIndex: i,
			hasBreakpoint: e.breakpointIndexes.has(i),
			sectionIndex: -1,
			isRecording: e.isRecording,
			isPlaying: e.replayState.isPlaying,
			removable: e.recording.steps.length > 1,
			builtInConverters: e.builtInConverters,
			extensionConverters: e.extensionConverters,
			isSelected: e.selectedStep === r,
			recorderSettings: e.recorderSettings ?? void 0,
			onStepClick: e.onStepClick,
			onStepHover: e.onStepHover
		})}
                      jslog=${Ke("step").track({ click: !0 })}
                      ></devtools-widget>
                    `;
	})}
                  ${!e.recordingTogglingInProgress && e.isRecording && n === e.sections.length - 1 ? K`<devtools-button
                    class="step add-assertion-button"
                    .data=${{
		variant: l.OUTLINED,
		title: J(q.addAssertion),
		jslogContext: "add-assertion"
	}}
                    @click=${e.onAddAssertion}
                  >${J(q.addAssertion)}</devtools-button>` : void 0}
                  ${e.isRecording && n === e.sections.length - 1 ? K`<div class="step recording">${J(q.recording)}</div>` : null}
                </div>
              </div>
            </div>
      `)}
      </div>
    `;
}
function to(e) {
	if (!e.recording) return we;
	let { title: t } = e.recording, n = !e.replayState.isPlaying && !e.isRecording;
	return K`
    <div class="header">
      <div class="header-title-wrapper">
        <div class="header-title">
          <input @blur=${e.onTitleBlur}
                @keydown=${e.onTitleInputKeyDown}
                id="title-input"
                jslog=${Ee("title").track({ change: !0 })}
                class=${ye({
		"has-error": e.isTitleInvalid,
		disabled: !n
	})}
                .value=${ee(t)}
                .disabled=${!n}
                maxlength="300"
                >
          <div class="title-button-bar">
            <devtools-button
              @click=${e.onEditTitleButtonClick}
              .data=${{
		disabled: !n,
		variant: l.TOOLBAR,
		iconName: "edit",
		title: J(q.editTitle),
		jslogContext: "edit-title"
	}}
            ></devtools-button>
          </div>
        </div>
        ${e.isTitleInvalid ? K`<div class="title-input-error-text">
          ${J(q.requiredTitleError)}
        </div>` : we}
      </div>
      ${!e.isRecording && e.replayAllowed ? K`<div class="actions">
              <devtools-button
                @click=${e.onMeasurePerformanceClick}
                .data=${{
		disabled: e.replayState.isPlaying,
		variant: l.OUTLINED,
		iconName: "performance",
		title: J(q.performancePanel),
		jslogContext: "measure-performance"
	}}
              >
                ${J(q.performancePanel)}
              </devtools-button>
              <div class="separator"></div>
              ${$a(e)}
            </div>` : we}
    </div>`;
}
var no = (e, t, n) => {
	let r = {
		wrapper: !0,
		"is-recording": e.isRecording,
		"is-playing": e.replayState.isPlaying,
		"was-successful": e.lastReplayResult === _r.SUCCESS,
		"was-failure": e.lastReplayResult === _r.FAILURE
	}, i = e.recordingTogglingInProgress ? J(q.recordingIsBeingStopped) : J(q.endRecording);
	p(K`
    <style>${re}</style>
    <style>${Li}</style>
    <style>${xt}</style>
    <div @click=${e.onWrapperClick} class=${ye(r)}>
      <div class="recording-view main">
        ${to(e)}
        ${e.extensionDescriptor ? K`
            <devtools-recorder-extension-view .descriptor=${e.extensionDescriptor}></devtools-recorder-extension-view>` : K`
          ${Ya(e)}
          ${Xa(e, t)}
        `}
        ${e.isRecording ? K`<div class="footer">
          <div class="controls">
            <devtools-widget
              class="control-button"
              ${Ga(At, {
		label: i,
		shape: "square",
		disabled: e.recordingTogglingInProgress,
		onClick: e.onRecordingFinished
	})}
              jslog=${Le("toggle-recording").track({ click: !0 })}
              title=${oi(i, x.START_RECORDING)}
            >
            </devtools-widget>
          </div>
        </div>` : we}
      </div>
    </div>
  `, n);
}, ro = class extends v {
	replayState = {
		isPlaying: !1,
		isPausedOnBreakpoint: !1
	};
	isRecording = !1;
	recordingTogglingInProgress = !1;
	recording = {
		title: "",
		steps: []
	};
	currentStep;
	currentError;
	sections = [];
	settings;
	lastReplayResult;
	replayAllowed = !1;
	breakpointIndexes = /* @__PURE__ */ new Set();
	extensionConverters = [];
	replayExtensions;
	extensionDescriptor;
	addAssertion;
	abortReplay;
	recordingFinished;
	playRecording;
	networkConditionsChanged;
	timeoutChanged;
	titleChanged;
	#e;
	get recorderSettings() {
		return this.#e;
	}
	set recorderSettings(e) {
		this.#e = e, this.#s = this.recorderSettings?.preferredCopyFormat ?? this.#t[0]?.getId(), this.#A();
	}
	#t = [];
	get builtInConverters() {
		return this.#t;
	}
	set builtInConverters(e) {
		this.#t = e, this.#s = this.recorderSettings?.preferredCopyFormat ?? this.#t[0]?.getId(), this.#A();
	}
	#n = !1;
	#r = null;
	#i = !1;
	#a = !1;
	#o = "";
	#s = "";
	#c;
	#l;
	#u = this.#O.bind(this);
	#d;
	#f = {};
	constructor(e, t) {
		super(e, { useShadowDom: !0 }), this.#d = t || no;
	}
	performUpdate() {
		let e = [...this.builtInConverters || [], ...this.extensionConverters || []].find((e) => e.getId() === this.#s) ?? this.builtInConverters[0];
		this.#d({
			breakpointIndexes: this.breakpointIndexes,
			builtInConverters: this.builtInConverters,
			converterId: this.#s,
			converterName: e?.getFormatName(),
			currentError: this.currentError ?? null,
			currentStep: this.currentStep ?? null,
			editorState: this.#l ?? null,
			extensionConverters: this.extensionConverters,
			extensionDescriptor: this.extensionDescriptor,
			isRecording: this.isRecording,
			isTitleInvalid: this.#n,
			lastReplayResult: this.lastReplayResult ?? null,
			recorderSettings: this.#e ?? null,
			recording: this.recording,
			recordingTogglingInProgress: this.recordingTogglingInProgress,
			replayAllowed: this.replayAllowed,
			replayExtensions: this.replayExtensions ?? [],
			replaySettingsExpanded: this.#i,
			replayState: this.replayState,
			sections: this.sections,
			selectedStep: this.#r ?? null,
			settings: this.settings ?? null,
			showCodeView: this.#a,
			onAddAssertion: () => {
				this.addAssertion?.();
			},
			onRecordingFinished: () => {
				this.recordingFinished?.();
			},
			getSectionState: this.#m.bind(this),
			getStepState: this.#p.bind(this),
			onAbortReplay: () => {
				this.abortReplay?.();
			},
			onMeasurePerformanceClick: this.#k.bind(this),
			onTogglePlaying: (e, t) => {
				this.playRecording?.({
					targetPanel: "chrome-recorder",
					speed: e,
					extension: t
				});
			},
			onCodeFormatChange: this.#M.bind(this),
			onCopyStep: this.#D.bind(this),
			onEditTitleButtonClick: this.#w.bind(this),
			onNetworkConditionsChange: this.#b.bind(this),
			onReplaySettingsKeydown: this.#v.bind(this),
			onSelectMenuLabelClick: this.#T.bind(this),
			onStepClick: this.#g.bind(this),
			onStepHover: this.#h.bind(this),
			onTimeoutInput: this.#x.bind(this),
			onTitleBlur: this.#S.bind(this),
			onTitleInputKeyDown: this.#C.bind(this),
			onToggleReplaySettings: this.#y.bind(this),
			onWrapperClick: this.#_.bind(this),
			showCodeToggle: this.showCodeToggle.bind(this)
		}, this.#f, this.contentElement);
	}
	wasShown() {
		super.wasShown(), document.addEventListener("copy", this.#u), this.performUpdate();
	}
	willHide() {
		super.willHide(), document.removeEventListener("copy", this.#u);
	}
	scrollToBottom() {
		let e = this.contentElement?.querySelector(".sections");
		e && (e.scrollTop = e.scrollHeight);
	}
	#p(e) {
		if (!this.currentStep) return G.DEFAULT;
		if (e === this.currentStep) return this.currentError ? G.ERROR : this.replayState?.isPlaying ? this.replayState?.isPausedOnBreakpoint ? G.STOPPED : G.CURRENT : G.SUCCESS;
		let t = this.recording.steps.indexOf(this.currentStep);
		return t === -1 ? G.DEFAULT : this.recording.steps.indexOf(e) < t ? G.SUCCESS : G.OUTSTANDING;
	}
	#m(e) {
		let t = this.currentStep;
		if (!t) return G.DEFAULT;
		let n = this.sections.find((e) => e.steps.includes(t));
		return !n && this.currentError ? G.ERROR : e === n || this.sections.indexOf(n) >= this.sections.indexOf(e) ? G.SUCCESS : G.OUTSTANDING;
	}
	#h = (e) => {
		let t = "type" in e ? e : e.causingStep;
		!t || this.#r || this.#j(t);
	};
	#g(e) {
		let t = "type" in e ? e : e.causingStep || null;
		this.#r !== t && (this.#r = t, this.performUpdate(), t && this.#j(t, !0));
	}
	#_() {
		this.#r && (this.#r = null, this.performUpdate());
	}
	#v(e) {
		e.key === "Enter" && (e.preventDefault(), this.#y(e));
	}
	#y(e) {
		e.stopPropagation(), this.#i = !this.#i, this.performUpdate();
	}
	#b(e) {
		let t = e.target;
		if (t instanceof HTMLSelectElement) {
			let e = Ja.find((e) => e.i18nTitleKey === t.value);
			this.networkConditionsChanged?.(e?.i18nTitleKey === Re.i18nTitleKey ? void 0 : e);
		}
	}
	#x(e) {
		let t = e.target;
		if (!t.checkValidity()) {
			t.reportValidity();
			return;
		}
		this.timeoutChanged?.(Number(t.value));
	}
	#S = (e) => {
		let t = e.target.value.trim();
		if (!t) {
			this.#n = !0, this.performUpdate();
			return;
		}
		this.titleChanged?.(t);
	};
	#C = (e) => {
		switch (e.code) {
			case "Escape":
			case "Enter": e.target.blur(), e.stopPropagation();
		}
	};
	#w = () => {
		let e = this.contentElement.querySelector("#title-input");
		if (!e) throw Error("Missing #title-input");
		e.focus();
	};
	#T = (e) => {
		let t = e.target;
		t.matches(".wrapping-label") && t.querySelector("devtools-select-menu")?.click();
	};
	async #E(e) {
		let t = [...this.builtInConverters, ...this.extensionConverters].find((e) => e.getId() === this.recorderSettings?.preferredCopyFormat);
		if (t ||= this.builtInConverters[0], !t) throw Error("No default converter found");
		let n = "";
		e ? n = await t.stringifyStep(e) : this.recording && ([n] = await t.stringify(this.recording)), xe.copyText(n);
	}
	#D(e) {
		e.stopPropagation(), this.#E(e.step);
	}
	async #O(e) {
		e.target === document.body && (e.preventDefault(), await this.#E(this.#r), h.keyboardShortcutFired(x.COPY_RECORDING_OR_STEP));
	}
	#k(e) {
		e.stopPropagation(), this.playRecording?.({
			targetPanel: "timeline",
			speed: j.NORMAL
		});
	}
	showCodeToggle = () => {
		this.#a = !this.#a, this.#a ? _e.alert(J(q.codeSidebarOpened)) : _e.alert(J(q.codeSidebarClosed)), this.#A();
	};
	#A = async () => {
		if (!this.recording) return;
		let e = [...this.builtInConverters || [], ...this.extensionConverters || []].find((e) => e.getId() === this.#s) ?? this.builtInConverters[0];
		if (!e) return;
		let [t, n] = await e.stringify(this.recording);
		this.#o = t, this.#c = n, this.#c?.shift();
		let r = e.getMediaType(), i = r ? await yt(r) : null;
		this.#l = ht.create({
			doc: this.#o,
			extensions: [
				vt(this.#o),
				ht.readOnly.of(!0),
				gt.lineWrapping,
				i || []
			]
		}), this.performUpdate(), this.contentElement.dispatchEvent(new Event("code-generated"));
	};
	#j = (e, t = !1) => {
		if (!this.#c) return;
		let n = this.recording.steps.indexOf(e);
		if (n === -1) return;
		let r = this.#c[n * 2], i = this.#c[n * 2 + 1];
		this.#f.highlightLinesInEditor?.(r, i, t);
	};
	#M = (e) => {
		this.#s = e.itemValue, this.recorderSettings && (this.recorderSettings.preferredCopyFormat = e.itemValue), this.#A();
	};
}, io = "extension_", ao = class {
	#e;
	#t;
	constructor(e, t) {
		this.#e = e, this.#t = t;
	}
	getId() {
		return io + this.#e;
	}
	getFormatName() {
		return this.#t.getName();
	}
	getMediaType() {
		return this.#t.getMediaType();
	}
	getFilename(e) {
		let t = this.#n(this.#t.getMediaType());
		return `${e.title}${t}`;
	}
	async stringify(e) {
		let t = await this.#t.stringify(e), n = Jn(t);
		return [Yn(t), n];
	}
	async stringifyStep(e) {
		return await this.#t.stringifyStep(e);
	}
	#n(e) {
		switch (e) {
			case "application/json": return ".json";
			case "application/javascript":
			case "text/javascript": return ".js";
			case "application/typescript":
			case "text/typescript": return ".ts";
			default: return "";
		}
	}
}, oo = class {
	#e;
	constructor(e) {
		this.#e = e;
	}
	getId() {
		return C.JSON;
	}
	getFormatName() {
		return "JSON";
	}
	getFilename(e) {
		return `${e.title}.json`;
	}
	async stringify(e) {
		let t = await Gn(e, {
			extension: new Dn(),
			indentation: this.#e
		}), n = Jn(t);
		return [Yn(t), n];
	}
	async stringifyStep(e) {
		return await Kn(e, {
			extension: new Dn(),
			indentation: this.#e
		});
	}
	getMediaType() {
		return "application/json";
	}
}, so = class {
	#e;
	constructor(e) {
		this.#e = e;
	}
	getId() {
		return C.LIGHTHOUSE;
	}
	getFormatName() {
		return "Puppeteer (including Lighthouse analysis)";
	}
	getFilename(e) {
		return `${e.title}.js`;
	}
	async stringify(e) {
		let t = await Gn(e, {
			extension: new hr(),
			indentation: this.#e
		}), n = Jn(t);
		return [Yn(t), n];
	}
	async stringifyStep(e) {
		return await Kn(e, { indentation: this.#e });
	}
	getMediaType() {
		return "text/javascript";
	}
}, co = class {
	#e;
	#t;
	constructor(e) {
		this.#e = e, this.#t = this.createExtension();
	}
	getId() {
		return C.PUPPETEER;
	}
	createExtension() {
		return new Nn();
	}
	getFormatName() {
		return "Puppeteer";
	}
	getFilename(e) {
		return `${e.title}.js`;
	}
	async stringify(e) {
		let t = await Gn(e, {
			indentation: this.#e,
			extension: this.#t
		}), n = Jn(t);
		return [Yn(t), n];
	}
	async stringifyStep(e) {
		return await Kn(e, {
			indentation: this.#e,
			extension: this.#t
		});
	}
	getMediaType() {
		return "text/javascript";
	}
}, lo = class extends co {
	getId() {
		return C.PUPPETEER_FIREFOX;
	}
	createExtension() {
		return new Nn("firefox");
	}
	getFormatName() {
		return "Puppeteer (for Firefox)";
	}
}, uo = class {
	#e;
	constructor(e) {
		this.#e = e;
	}
	getId() {
		return C.REPLAY;
	}
	getFormatName() {
		return "@puppeteer/replay";
	}
	getFilename(e) {
		return `${e.title}.js`;
	}
	async stringify(e) {
		let t = await Gn(e, {
			extension: new fr(),
			indentation: this.#e
		}), n = Jn(t);
		return [Yn(t), n];
	}
	async stringifyStep(e) {
		return await Kn(e, { extension: new fr() });
	}
	getMediaType() {
		return "text/javascript";
	}
}, fo = "/*\n * Copyright 2023 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  font-size: inherit;\n}\n\n*:focus,\n*:focus-visible {\n  outline: none;\n}\n\n:host {\n  overflow-x: auto;\n}\n\n:host,\ndevtools-create-recording-view {\n  display: flex;\n  flex-direction: column;\n  flex: 1;\n  min-height: 0;\n}\n\n.wrapper {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n}\n\n.header {\n  background-color: var(--sys-color-cdt-base-container);\n  display: flex;\n  flex-flow: row wrap;\n  align-items: center;\n  border-bottom: 1px solid var(--sys-color-divider);\n  padding: 0 5px;\n  gap: 3px;\n  flex-shrink: 0;\n}\n\n.separator {\n  background-color: var(--sys-color-divider);\n  width: 1px;\n  height: 17px;\n  margin: 0;\n}\n\nselect {\n  appearance: none;\n  user-select: none;\n  border: none;\n  border-radius: var(--sys-shape-corner-extra-small);\n  height: var(--sys-size-9);\n  max-width: 140px;\n  min-width: 140px;\n  padding: 0 var(--sys-size-6) 0 var(--sys-size-5);\n  position: relative;\n  color: var(--sys-color-on-surface);\n  background-color: transparent;\n  text-overflow: ellipsis;\n  background-image: var(--combobox-dropdown-arrow);\n  background-position: right center;\n  background-repeat: no-repeat;\n\n  &:hover {\n    background-color: var(--sys-color-state-hover-on-subtle);\n  }\n\n  &:active {\n    background-color: var(--sys-color-state-ripple-neutral-on-subtle);\n  }\n\n  &:hover:active {\n    background: var(--combobox-dropdown-arrow),\n      linear-gradient(\n        var(--sys-color-state-hover-on-subtle),\n        var(--sys-color-state-hover-on-subtle)\n      ),\n      linear-gradient(\n        var(--sys-color-state-ripple-neutral-on-subtle),\n        var(--sys-color-state-ripple-neutral-on-subtle)\n      );\n    background-position: right center;\n    background-repeat: no-repeat;\n  }\n\n  &:disabled {\n    pointer-events: none;\n    color: var(--sys-color-state-disabled);\n    background-color: var(--sys-color-state-disabled-container);\n  }\n\n  &:focus-visible {\n    outline: var(--sys-size-2) solid var(--sys-color-state-focus-ring);\n  }\n}\n\nselect option {\n  background-color: var(--sys-color-cdt-base-container);\n  color: var(--sys-color-on-surface);\n}\n\ndevtools-menu {\n  width: 0;\n  height: 0;\n  position: absolute;\n}\n\ndevtools-recording-list-view {\n  overflow: auto;\n}\n\n.error {\n  color: var(--sys-color-error);\n  border: 1px solid var(--sys-color-error);\n  background-color: var(--sys-color-error-container);\n  padding: 4px;\n}\n\n.feedback {\n  margin-left: auto;\n  margin-right: 4px;\n}\n\n.feedback .devtools-link {\n  letter-spacing: 0.03em;\n  text-decoration-line: underline;\n  font-size: var(--sys-typescale-body4-size);\n  line-height: 16px;\n  color: var(--sys-color-primary);\n  outline-offset: 3px;\n}\n\n.feedback .devtools-link:focus-visible,\n.empty-state-description .devtools-link:focus-visible {\n  outline: -webkit-focus-ring-color auto 1px;\n}\n\n.empty-state {\n  margin: var(--sys-size-5);\n  display: flex;\n  flex-grow: 1;\n  justify-content: center;\n  align-items: center;\n  flex-direction: column;\n  text-align: center;\n  min-height: fit-content;\n  min-width: fit-content;\n\n  > * {\n    max-width: var(--sys-size-29);\n  }\n\n  .empty-state-header {\n    font: var(--sys-typescale-headline5);\n    margin-bottom: var(--sys-size-3);\n  }\n\n  .empty-state-description {\n    font: var(--sys-typescale-body4-regular);\n    color: var(--sys-color-on-surface-subtle);\n\n    > devtools-link {\n      white-space: nowrap;\n      margin-left: var(--sys-size-3);\n      cursor: pointer;\n      text-decoration: underline;\n      color: var(--sys-color-primary);\n      outline-offset: var(--sys-size-2);\n    }\n  }\n\n  > devtools-button {\n    margin-top: var(--sys-size-7);\n  }\n}\n", po = /* @__PURE__ */ e({
	RecordingStateChangedEvent: () => ho,
	ReplayFinishedEvent: () => mo
}), mo = class e extends Event {
	static eventName = "replayfinished";
	constructor() {
		super(e.eventName, {
			bubbles: !0,
			composed: !0
		});
	}
}, ho = class e extends Event {
	recording;
	static eventName = "recordingstatechanged";
	constructor(t) {
		super(e.eventName, {
			bubbles: !0,
			composed: !0
		}), this.recording = t;
	}
}, go = /* @__PURE__ */ e({
	Pages: () => Do,
	RecorderController: () => $
}), { html: Y, Decorators: _o, Directives: { ref: vo }, LitElement: yo } = m, { customElement: bo, state: X } = _o, Z = {
	createRecording: "Create recording",
	importRecording: "Import recording",
	recordingImported: "Recording imported",
	deleteRecording: "Delete recording",
	recordingDeleted: "Recording deleted",
	noRecordings: "No recordings",
	numberOfRecordings: "recording(s)",
	continueReplay: "Continue",
	stepOverReplay: "Execute one step",
	exportRecording: "Export recording",
	startStopRecording: "Start/Stop recording",
	replayRecording: "Replay recording",
	copyShortcut: "Copy recording or selected step",
	toggleCode: "Toggle code view",
	export: "Export",
	recordingExported: "Recording exported",
	exportViaExtensions: "Export via extensions",
	getExtensions: "Get extensions…",
	sendFeedback: "Send feedback",
	header: "Nothing recorded yet",
	recordingDescription: "Use recordings to create automated end-to-end tests or performance traces.",
	learnMore: "Learn more",
	doYouTrustThisCode: "Do you trust this recording?",
	doNotImport: "Don't import recordings you do not understand or have not reviewed yourself into DevTools. This could allow attackers to steal your identity or take control of your computer. Please type “{PH1}” below to allow importing.",
	allowImporting: "allow importing",
	typeAllowImporting: "Type “{PH1}”"
}, xo = i("panels/recorder/RecorderController.ts", Z), Q = n.bind(void 0, xo), { widget: So } = Be, Co = "get-extensions-link", wo = "https://goo.gle/recorder-extension-list", To = "https://developer.chrome.com/docs/devtools/recorder", Eo = "https://goo.gle/recorder-feedback", Do = /* @__PURE__ */ function(e) {
	return e.START_PAGE = "StartPage", e.ALL_RECORDINGS_PAGE = "AllRecordingsPage", e.CREATE_RECORDING_PAGE = "CreateRecordingPage", e.RECORDING_PAGE = "RecordingPage", e;
}({}), Oo = {
	[C.JSON]: Oe.TO_JSON,
	[C.REPLAY]: Oe.TO_PUPPETEER_REPLAY,
	[C.PUPPETEER]: Oe.TO_PUPPETEER,
	[C.PUPPETEER_FIREFOX]: Oe.TO_PUPPETEER,
	[C.LIGHTHOUSE]: Oe.TO_LIGHTHOUSE
};
function ko(e) {
	if (e.steps.length > 4096) throw Error("Recording with steps over 4096 is not allowed");
	if (e.title.length > 300) throw Error("Recording with title over 300 characters is not allowed");
}
var $ = class extends yo {
	#e = Yr.instance();
	#t = Qr.instance();
	#n = !0;
	#r = {
		isPlaying: !1,
		isPausedOnBreakpoint: !1
	};
	#i;
	#a;
	#o = /* @__PURE__ */ new Set();
	#s;
	#c;
	#l = new Tr();
	#u = new Er();
	#d = s.instance().createSetting("disable-recorder-import-warning", !1, c.SYNCED);
	#f = s.instance().createSetting("disable-self-xss-warning", !1, c.SYNCED);
	#p;
	#m;
	constructor() {
		super(), this.isRecording = !1, this.isToggling = !1, this.exportMenuExpanded = !1, this.currentPage = "StartPage", this.#e.getRecordings().length && this.#y("AllRecordingsPage");
		let e = s.instance().moduleSetting("text-editor-indent").get();
		this.#s = Object.freeze([
			new oo(e),
			new uo(e),
			new co(e),
			new lo(e),
			new so(e)
		]);
		let t = Oi.instance();
		this.#h(t.extensions()), t.addEventListener(ki.EXTENSIONS_UPDATED, (e) => {
			this.#h(e.data);
		}), this.addEventListener("setrecording", (e) => this.#k(e));
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.currentRecordingSession && this.currentRecordingSession.stop(), this.#c &&= (dt.instance().removeEventListener(b.SHOW_VIEW_REQUESTED, this.#c), void 0);
	}
	#h(e) {
		this.extensionConverters = e.filter((e) => e.getCapabilities().includes("export")).map((e, t) => new ao(t, e)), this.replayExtensions = e.filter((e) => e.getCapabilities().includes("replay"));
	}
	setIsRecordingStateForTesting(e) {
		this.isRecording = e;
	}
	setRecordingStateForTesting(e) {
		this.#r.isPlaying = e.isPlaying, this.#r.isPausedOnBreakpoint = e.isPausedOnBreakpoint;
	}
	setCurrentPageForTesting(e) {
		this.#y(e);
	}
	getCurrentPageForTesting() {
		return this.currentPage;
	}
	getCurrentRecordingForTesting() {
		return this.currentRecording;
	}
	getStepBreakpointIndexesForTesting() {
		return [...this.#o.values()];
	}
	#g() {
		this.importError = void 0;
	}
	async #_(e) {
		let t = new Je(), n = new ct(e, 1e7);
		if (!await n.read(t)) throw n.error() ?? /* @__PURE__ */ Error("Unknown");
		let r;
		try {
			r = Nr(JSON.parse(t.data())), ko(r);
		} catch (e) {
			this.importError = e;
			return;
		}
		this.#v(await this.#e.upsertRecording(r)), this.#y("RecordingPage"), this.#g(), _e.alert(Q(Z.recordingImported));
	}
	setCurrentRecordingForTesting(e) {
		this.#v(e);
	}
	getSectionsForTesting() {
		return this.sections;
	}
	#v(e, t = {}) {
		let { keepBreakpoints: n = !1, updateSession: r = !1 } = t;
		this.recordingPlayer?.abort(), this.currentStep = void 0, this.recordingError = void 0, this.lastReplayResult = void 0, this.recordingPlayer = void 0, this.#r.isPlaying = !1, this.#r.isPausedOnBreakpoint = !1, this.#o = n ? this.#o : /* @__PURE__ */ new Set(), e ? (this.currentRecording = e, this.sections = ai(e.flow.steps), this.settings = this.#b(e.flow), r && this.currentRecordingSession && this.currentRecordingSession.overwriteUserFlow(e.flow)) : (this.currentRecording = void 0, this.sections = void 0, this.settings = void 0), this.#C();
	}
	#y(e) {
		e !== this.currentPage && (this.previousPage = this.currentPage, this.currentPage = e);
	}
	#b(e) {
		let t = e.steps, n = t.findIndex((e) => e.type === "navigate"), r = { timeout: e.timeout };
		for (let e = n - 1; e >= 0; e--) {
			let n = t[e];
			if (!r.viewportSettings && n.type === "setViewport" && (r.viewportSettings = n), !r.networkConditionsSettings && n.type === "emulateNetworkConditions") {
				r.networkConditionsSettings = { ...n };
				for (let t of [
					Te,
					et,
					he,
					Ie
				]) ce({
					...t,
					title: t.i18nTitleKey || ""
				}, {
					...n,
					title: t.i18nTitleKey || "",
					key: `step_${e}_recorder_key`
				}) && (r.networkConditionsSettings.title = t.title instanceof Function ? t.title() : t.title, r.networkConditionsSettings.i18nTitleKey = t.i18nTitleKey);
			}
		}
		return r;
	}
	#x() {
		let e = He.instance().primaryPageTarget();
		if (!e) throw Error("Missing main page target");
		return e;
	}
	#S(e) {
		if (!this.sections) return null;
		for (let t of this.sections) if (t.steps.indexOf(e) !== -1) return t;
		return null;
	}
	#C() {
		if (!this.sections || !this.currentRecording) return;
		let e = this.currentRecording.storageName;
		for (let t = 0; t < this.sections.length; t++) {
			let n = this.#t.getScreenshotForSection(e, t);
			this.sections[t].screenshot = n || void 0;
		}
		this.requestUpdate();
	}
	#w() {
		this.recordingPlayer?.abort();
	}
	async #T(e) {
		if (!this.currentRecording || !this.#n) return;
		let t = dt.instance();
		this.#c &&= (t.removeEventListener(b.SHOW_VIEW_REQUESTED, this.#c), void 0);
		let n, r = new Promise((e) => {
			n = e;
		});
		this.#c = (r) => {
			let i = r.data;
			i.extensionOrigin === e.getOrigin() && (this.#c &&= (t.removeEventListener(b.SHOW_VIEW_REQUESTED, this.#c), void 0), n(i));
		}, t.addEventListener(b.SHOW_VIEW_REQUESTED, this.#c), e.replay(this.currentRecording.flow);
		let i = await r;
		this.viewDescriptor = i, h.recordingReplayStarted(ge.REPLAY_VIA_EXTENSION);
	}
	async #E(e) {
		if (!this.currentRecording || !this.#n) return;
		if (this.viewDescriptor &&= void 0, this.#c &&= (dt.instance().removeEventListener(b.SHOW_VIEW_REQUESTED, this.#c), void 0), e.extension) return await this.#T(e.extension);
		h.recordingReplayStarted(e.targetPanel === qa.DEFAULT ? ge.REPLAY_ONLY : ge.REPLAY_WITH_PERFORMANCE_TRACING), this.#r.isPlaying = !0, this.currentStep = void 0, this.recordingError = void 0, this.lastReplayResult = void 0;
		let n = this.currentRecording;
		this.#g(), await this.#D(), this.recordingPlayer = new br(this.currentRecording.flow, {
			speed: e.speed,
			breakpointIndexes: this.#o
		});
		let r = e.targetPanel === qa.PERFORMANCE_PANEL, i = /* @__PURE__ */ new Set();
		this.recordingPlayer.addEventListener(xr.STEP, async ({ data: { step: e, resolve: t } }) => {
			this.currentStep = e;
			let r = this.#S(e);
			if (this.sections && r && !i.has(r)) {
				i.add(r);
				let e = this.sections.indexOf(r), t = await ri();
				r.screenshot = t, Qr.instance().storeScreenshotForSection(n.storageName, e, t);
			}
			t();
		}), this.recordingPlayer.addEventListener(xr.STOP, () => {
			this.#r.isPausedOnBreakpoint = !0, this.requestUpdate();
		}), this.recordingPlayer.addEventListener(xr.CONTINUE, () => {
			this.#r.isPausedOnBreakpoint = !1, this.requestUpdate();
		}), this.recordingPlayer.addEventListener(xr.ERROR, ({ data: e }) => {
			this.recordingError = e, r || (this.#r.isPlaying = !1, this.recordingPlayer = void 0), this.lastReplayResult = _r.FAILURE;
			let t = e.message.toLowerCase();
			t.startsWith("could not find element") ? h.recordingReplayFinished(tt.TIMEOUT_ERROR_SELECTORS) : t.startsWith("waiting for target failed") ? h.recordingReplayFinished(tt.TIMEOUT_ERROR_TARGET) : h.recordingReplayFinished(tt.OTHER_ERROR), this.dispatchEvent(new mo());
		}), this.recordingPlayer.addEventListener(xr.DONE, () => {
			r || (this.#r.isPlaying = !1, this.recordingPlayer = void 0), this.lastReplayResult = _r.SUCCESS, this.dispatchEvent(new mo()), h.recordingReplayFinished(tt.SUCCESS);
		}), this.recordingPlayer.addEventListener(xr.ABORT, () => {
			this.currentStep = void 0, this.recordingError = void 0, this.lastReplayResult = void 0, this.#r.isPlaying = !1;
		});
		let a = (e) => {}, o = new Promise((e) => {
			a = e;
		}), s = null;
		switch (e.targetPanel) {
			case qa.PERFORMANCE_PANEL: s = new lt(this.#x(), {
				tracingBufferUsage() {},
				eventsRetrievalProgress() {},
				tracingComplete(e) {
					a(e);
				}
			});
		}
		if (s && await s.start(), this.#O(!1), await this.recordingPlayer.play(), this.#O(!0), s) {
			await s.stop();
			let n = await o;
			if (this.#r.isPlaying = !1, this.recordingPlayer = void 0, await ue.instance().showPanel(e.targetPanel), e.targetPanel === qa.PERFORMANCE_PANEL) {
				let e = new je(n);
				t(e);
			}
		}
	}
	async #D() {
		try {
			let e = St.instance();
			e.isDeviceModeOn() && (e.toggleDeviceMode(), await this.#x().model(Xe)?.emulateDevice(null));
		} catch {}
	}
	#O(e) {
		this.#x().model(Xe)?.setTouchEmulationAllowed(e);
	}
	async #k(e) {
		let t = JSON.parse(e.detail);
		this.#v(await this.#e.upsertRecording(Nr(t))), this.#y("RecordingPage"), this.#g();
	}
	getUserFlow() {
		return this.currentRecording?.flow;
	}
	async #A(e) {
		if (!this.currentRecording) throw Error("Current recording expected to be defined.");
		let t = {
			...this.currentRecording,
			flow: {
				...this.currentRecording.flow,
				steps: this.currentRecording.flow.steps.map((t) => t === e.currentStep ? e.newStep : t)
			}
		};
		this.#v(await this.#e.upsertRecording(t.flow, t.storageName), {
			keepBreakpoints: !0,
			updateSession: !0
		});
	}
	async #j(e) {
		if (!this.currentRecording) throw Error("Current recording expected to be defined.");
		let t = e.stepOrSection, n, r = e.position;
		if ("steps" in t) {
			let i = this.sections?.indexOf(t);
			if (i === void 0 || i === -1) throw Error("There is no section to add a step to");
			if (e.position === Ma.AFTER) this.sections?.[i].steps.length ? (n = this.sections?.[i].steps[0], r = Ma.BEFORE) : (n = this.sections?.[i].causingStep, r = Ma.AFTER);
			else {
				if (i <= 0) throw Error("There is no section to add a step to");
				let e = this.sections?.[i - 1];
				n = e?.steps[e.steps.length - 1], r = Ma.AFTER;
			}
		} else n = t;
		if (!n) throw Error("Anchor step is not found when adding a step");
		let i = this.currentRecording.flow.steps, a = i.indexOf(n) + (r === Ma.BEFORE ? 0 : 1);
		i.splice(a, 0, {
			type: T.WaitForElement,
			selectors: ["body"]
		});
		let o = {
			...this.currentRecording,
			flow: {
				...this.currentRecording.flow,
				steps: i
			}
		};
		this.#o = new Set([...this.#o.values()].map((e) => a > e ? e : e + 1)), this.#v(await this.#e.upsertRecording(o.flow, o.storageName), {
			keepBreakpoints: !0,
			updateSession: !0
		});
	}
	async #M(e) {
		if (!this.currentRecording) throw Error("Current recording expected to be defined.");
		let t = {
			...this.currentRecording.flow,
			title: e
		};
		this.#v(await this.#e.upsertRecording(t, this.currentRecording.storageName));
	}
	async #N(e) {
		if (!this.currentRecording) throw Error("Current recording expected to be defined.");
		let t = this.currentRecording.flow.steps, n = t.indexOf(e.step);
		t.splice(n, 1);
		let r = {
			...this.currentRecording.flow,
			steps: t
		};
		this.#o = new Set([...this.#o.values()].map((e) => n > e ? e : n === e ? -1 : e - 1).filter((e) => e >= 0)), this.#v(await this.#e.upsertRecording(r, this.currentRecording.storageName), {
			keepBreakpoints: !0,
			updateSession: !0
		});
	}
	async #P(e) {
		if (!this.currentRecording) throw Error("Current recording expected to be defined.");
		let t = this.currentRecording.flow.steps.findIndex((e) => e.type === "navigate");
		if (t === -1) throw Error("Current recording does not have a navigate step");
		let n = this.currentRecording.flow.steps.findIndex((e, n) => n >= t ? !1 : e.type === "emulateNetworkConditions");
		if (!e) n !== -1 && this.currentRecording.flow.steps.splice(n, 1);
		else if (n === -1) this.currentRecording.flow.steps.splice(0, 0, Ar({
			download: e.download,
			upload: e.upload,
			latency: e.latency
		}));
		else {
			let t = this.currentRecording.flow.steps[n];
			t.download = e.download, t.upload = e.upload, t.latency = e.latency;
		}
		this.#v(await this.#e.upsertRecording(this.currentRecording.flow, this.currentRecording.storageName));
	}
	async #F(e) {
		if (!this.currentRecording) throw Error("Current recording expected to be defined.");
		this.currentRecording.flow.timeout = e, this.#v(await this.#e.upsertRecording(this.currentRecording.flow, this.currentRecording.storageName));
	}
	async #I(e) {
		if (e.stopPropagation(), e instanceof Si) await this.#e.deleteRecording(e.storageName), this.#t.deleteScreenshotsForRecording(e.storageName), this.requestUpdate();
		else {
			if (!this.currentRecording) return;
			await this.#e.deleteRecording(this.currentRecording.storageName), this.#t.deleteScreenshotsForRecording(this.currentRecording.storageName);
		}
		_e.alert(Q(Z.recordingDeleted)), (await this.#e.getRecordings()).length ? this.#y("AllRecordingsPage") : this.#y("StartPage"), this.#v(void 0), this.#g();
	}
	#L(e) {
		e?.stopPropagation(), this.#y("CreateRecordingPage"), this.#g();
	}
	async #R(e) {
		await this.#D(), this.isToggling = !0, this.#g(), h.recordingToggled(d.RECORDING_STARTED), this.currentRecordingSession = new Gr(this.#x(), {
			title: e.name,
			selectorAttribute: e.selectorAttribute,
			selectorTypesToRecord: e.selectorTypesToRecord.length ? e.selectorTypesToRecord : Object.values(w)
		}), this.#v(await this.#e.upsertRecording(this.currentRecordingSession.cloneUserFlow()));
		let t = -1, n, r = async (e) => {
			if (!this.sections) throw Error("Could not find sections.");
			let r = this.sections.length - 1, i = this.sections[r];
			if (n || t === r) return;
			n = ri();
			let a = await n;
			n = void 0, i.screenshot = a, Qr.instance().storeScreenshotForSection(e.storageName, r, a), t = r, this.#C();
		};
		this.currentRecordingSession.addEventListener(Kr.RECORDING_UPDATED, async ({ data: e }) => {
			if (!this.currentRecording) throw Error("No current recording found");
			this.#v(await this.#e.upsertRecording(e, this.currentRecording.storageName)), this.#p?.scrollToBottom(), await r(this.currentRecording);
		}), this.currentRecordingSession.addEventListener(Kr.RECORDING_STOPPED, async ({ data: e }) => {
			if (!this.currentRecording) throw Error("No current recording found");
			h.keyboardShortcutFired(x.START_RECORDING), this.#v(await this.#e.upsertRecording(e, this.currentRecording.storageName)), await this.#z();
		}), await this.currentRecordingSession.start(), this.isToggling = !1, this.isRecording = !0, this.#y("RecordingPage"), this.dispatchEvent(new ho(this.currentRecording.flow));
	}
	async #z() {
		if (!this.currentRecording || !this.currentRecordingSession) throw Error("Recording was never started");
		this.isToggling = !0, this.#g(), h.recordingToggled(d.RECORDING_FINISHED), await this.currentRecordingSession.stop(), this.currentRecordingSession = void 0, this.isToggling = !1, this.isRecording = !1, this.dispatchEvent(new ho(this.currentRecording.flow));
	}
	async onRecordingCancelled() {
		this.previousPage && this.#y(this.previousPage);
	}
	async #B(e) {
		let t = e instanceof Ci || e instanceof wi ? e.storageName : e.target?.value;
		this.#v(await this.#e.getRecording(t)), this.currentRecording ? this.#y("RecordingPage") : t === "StartPage" ? this.#y("StartPage") : t === "AllRecordingsPage" && this.#y("AllRecordingsPage");
	}
	async #V(e) {
		if (typeof e.itemValue != "string") throw Error("Invalid export option value");
		if (e.itemValue === Co) {
			xe.openInNewTab(wo);
			return;
		}
		if (!this.currentRecording) throw Error("No recording selected");
		let t = e.itemValue, n = (e) => e.getId() === t, r = this.#s.find(n) || this.extensionConverters.find(n);
		if (!r) throw Error("No recording selected");
		let [i] = await r.stringify(this.currentRecording.flow);
		if (await this.#H(r.getFilename(this.currentRecording.flow), i), Oo[r.getId()]) _e.alert(Q(Z.recordingExported));
		else if (r.getId().startsWith("extension_")) _e.alert(Q(Z.recordingExported));
		else throw Error("Could not find a metric for the export option with id = " + t);
	}
	async #H(e, t) {
		try {
			let n = await (await window.showSaveFilePicker({ suggestedName: e })).createWritable();
			await n.write(t), await n.close();
		} catch (e) {
			if (e.name === "AbortError") return;
			throw e;
		}
	}
	async #U() {
		if (!this.currentRecordingSession || !this.currentRecording) return;
		let e = this.currentRecordingSession.cloneUserFlow();
		e.steps.push({
			type: "waitForElement",
			selectors: [[".cls"]]
		}), this.#v(await this.#e.upsertRecording(e, this.currentRecording.storageName), {
			keepBreakpoints: !0,
			updateSession: !0
		}), await this.updateComplete, await this.#p?.updateComplete, this.#p?.contentElement?.querySelector(".section:last-child .step-view-widget:last-of-type")?.shadowRoot?.querySelector(".action")?.click();
	}
	async #W() {
		if (this.#d.get() || rt.queryParam("isChromeForTesting") || rt.queryParam("disableSelfXssWarnings") || this.#f.get()) return !0;
		let e = await mt.show({
			jslogContext: {
				input: "confirm-import-recording-input",
				dialog: "confirm-import-recording-dialog"
			},
			message: Q(Z.doNotImport, { PH1: Q(Z.allowImporting) }),
			header: Q(Z.doYouTrustThisCode),
			typePhrase: Q(Z.allowImporting),
			inputPlaceholder: Q(Z.typeAllowImporting, { PH1: Q(Z.allowImporting) })
		});
		return e && this.#d.set(!0), e;
	}
	async #G(e) {
		e.stopPropagation(), this.#g(), await this.#W() && (this.#i = Qe(this.#_.bind(this)), this.#i.click());
	}
	async #K(e) {
		await this.#B(e), await this.#E({
			targetPanel: qa.DEFAULT,
			speed: this.#l.speed
		});
	}
	#q = (e) => {
		this.#o = structuredClone(this.#o), this.#o.add(e.index), this.recordingPlayer?.updateBreakpointIndexes(this.#o), this.requestUpdate();
	};
	#J = (e) => {
		this.#o = structuredClone(this.#o), this.#o.delete(e.index), this.recordingPlayer?.updateBreakpointIndexes(this.#o), this.requestUpdate();
	};
	#Y() {
		this.viewDescriptor = void 0;
	}
	handleActions(e) {
		if (this.isActionPossible(e)) switch (e) {
			case x.CREATE_RECORDING:
				this.#L();
				return;
			case x.START_RECORDING:
				this.currentPage !== "CreateRecordingPage" && !this.isRecording ? this.#u.handleShortcut(this.#R.bind(this, {
					name: this.#l.defaultTitle,
					selectorTypesToRecord: this.#l.defaultSelectors,
					selectorAttribute: this.#l.selectorAttribute ? this.#l.selectorAttribute : void 0
				})) : this.currentPage === "CreateRecordingPage" ? this.#m && this.#u.handleShortcut(() => {
					this.#m?.startRecording();
				}) : this.isRecording && this.#z();
				return;
			case x.REPLAY_RECORDING:
				this.#E({
					targetPanel: qa.DEFAULT,
					speed: this.#l.speed
				});
				return;
			case x.TOGGLE_CODE_VIEW:
				this.#p?.showCodeToggle();
				return;
		}
	}
	isActionPossible(e) {
		switch (e) {
			case x.CREATE_RECORDING: return !this.isRecording && !this.#r.isPlaying;
			case x.START_RECORDING: return !this.#r.isPlaying;
			case x.REPLAY_RECORDING: return this.currentPage === "RecordingPage" && !this.#r.isPlaying;
			case x.TOGGLE_CODE_VIEW: return this.currentPage === "RecordingPage";
			case x.COPY_RECORDING_OR_STEP: return !1;
		}
	}
	#X() {
		let e = (e) => te.instance().shortcutsForAction(e).map((e) => e.title().split(/[\s+]+/).map((e) => ({ key: e.trim() })));
		return [
			{
				title: Q(Z.startStopRecording),
				rows: e(x.START_RECORDING)
			},
			{
				title: Q(Z.replayRecording),
				rows: e(x.REPLAY_RECORDING)
			},
			{
				title: Q(Z.copyShortcut),
				rows: le() ? [[{ key: "⌘" }, { key: "C" }]] : [[{ key: "Ctrl" }, { key: "C" }]]
			},
			{
				title: Q(Z.toggleCode),
				rows: e(x.TOGGLE_CODE_VIEW)
			}
		];
	}
	#Z() {
		switch (this.currentPage) {
			case "StartPage": return this.#$();
			case "AllRecordingsPage": return this.#Q();
			case "RecordingPage": return this.#ee();
			case "CreateRecordingPage": return this.#te();
		}
	}
	#Q() {
		return Y`
      <devtools-widget
        ${So(Ei, {
			recordings: this.#e.getRecordings().map((e) => ({
				storageName: e.storageName,
				name: e.flow.title
			})),
			replayAllowed: this.#n
		})}
        @createrecording=${this.#L}
        @deleterecording=${this.#I}
        @openrecording=${this.#B}
        @playrecording=${this.#K}
      >
      </devtools-widget>
    `;
	}
	#$() {
		return Y`
      <div class="empty-state" jslog=${Ke().context("start-view")}>
        <div class="empty-state-header">${Q(Z.header)}</div>
        <div class="empty-state-description">
          <span>${Q(Z.recordingDescription)}</span>
          <devtools-link
            class="devtools-link"
            href=${To}
            jslogcontext="learn-more"
          >${Q(Z.learnMore)}</devtools-link>
        </div>
        <devtools-button .variant=${l.TONAL} jslogContext=${x.CREATE_RECORDING} @click=${this.#L}>${Q(Z.createRecording)}</devtools-button>
      </div>
    `;
	}
	#ee() {
		return Y`
      <devtools-widget
          class="recording-view"
          ${So(ro, {
			recording: this.currentRecording?.flow ?? {
				title: "",
				steps: []
			},
			replayState: this.#r,
			isRecording: this.isRecording,
			recordingTogglingInProgress: this.isToggling,
			currentStep: this.currentStep,
			currentError: this.recordingError,
			sections: this.sections ?? [],
			settings: this.settings,
			recorderSettings: this.#l,
			lastReplayResult: this.lastReplayResult,
			replayAllowed: this.#n,
			breakpointIndexes: this.#o,
			builtInConverters: this.#s,
			extensionConverters: this.extensionConverters,
			replayExtensions: this.replayExtensions,
			extensionDescriptor: this.viewDescriptor,
			recordingFinished: this.#z.bind(this),
			addAssertion: this.#U.bind(this),
			abortReplay: this.#w.bind(this),
			playRecording: this.#E.bind(this),
			networkConditionsChanged: this.#P.bind(this),
			timeoutChanged: this.#F.bind(this),
			titleChanged: this.#M.bind(this)
		})}
          @requestselectorattribute=${(e) => {
			e.send(this.currentRecording?.flow.selectorAttribute);
		}}
          @stepchanged=${this.#A.bind(this)}
          @addstep=${this.#j.bind(this)}
          @removestep=${this.#N.bind(this)}
          @addbreakpoint=${this.#q.bind(this)}
          @removebreakpoint=${this.#J.bind(this)}
          @recorderextensionviewclosed=${this.#Y.bind(this)}
          ${Me(ro, (e) => {
			this.#p = e;
		})}
        ></devtools-widget>
    `;
	}
	#te() {
		return Y`
      <devtools-widget
        class="recording-view"
        ${So(hi, {
			recorderSettings: this.#l,
			onRecordingStarted: this.#R.bind(this),
			onRecordingCancelled: this.onRecordingCancelled.bind(this)
		})}
        ${Me(hi, (e) => {
			this.#m = e;
		})}
      ></devtools-widget>
    `;
	}
	#ne = () => {
		if (!this.#a) throw Error("#exportMenuButton not found");
		return this.#a;
	};
	#re(e) {
		e.stopPropagation(), this.#g(), this.exportMenuExpanded = !this.exportMenuExpanded;
	}
	#ie() {
		this.exportMenuExpanded = !1;
	}
	render() {
		let e = this.#e.getRecordings(), t = this.currentRecording ? this.currentRecording.storageName : this.currentPage, n = [e.length === 0 ? {
			value: "StartPage",
			name: Q(Z.noRecordings),
			selected: t === "StartPage"
		} : {
			value: "AllRecordingsPage",
			name: `${e.length} ${Q(Z.numberOfRecordings)}`,
			selected: t === "AllRecordingsPage"
		}, ...e.map((e) => ({
			value: e.storageName,
			name: e.flow.title,
			selected: t === e.storageName
		}))];
		return Y`
        <style>${re}</style>
        <style>${fo}</style>
        <div class="wrapper">
          <div class="header" jslog=${Ge()}>
            <devtools-button
              @click=${this.#L}
              .data=${{
			variant: l.TOOLBAR,
			iconName: "plus",
			disabled: this.#r.isPlaying || this.isRecording || this.isToggling,
			title: oi(Q(Z.createRecording), x.CREATE_RECORDING),
			jslogContext: x.CREATE_RECORDING
		}}
            ></devtools-button>
            <div class="separator"></div>
            <select
              .disabled=${e.length === 0 || this.#r.isPlaying || this.isRecording || this.isToggling}
              @click=${(e) => e.stopPropagation()}
              @change=${this.#B}
              jslog=${Ve("recordings").track({ change: !0 })}
            >
              ${ae(n, (e) => e.value, (e) => Y`<option .selected=${e.selected} value=${e.value}>${e.name}</option>`)}
            </select>
            <div class="separator"></div>
            <devtools-button
              @click=${this.#G}
              .data=${{
			variant: l.TOOLBAR,
			iconName: "import",
			title: Q(Z.importRecording),
			jslogContext: "import-recording"
		}}
            ></devtools-button>
            <devtools-button
              id='origin'
              @click=${this.#re}
              ${vo((e) => {
			e instanceof HTMLElement && (this.#a = e);
		})}
              .data=${{
			variant: l.TOOLBAR,
			iconName: "download",
			title: Q(Z.exportRecording),
			disabled: !this.currentRecording
		}}
              jslog=${Ve("export-recording").track({ click: !0 })}
            ></devtools-button>
            <devtools-menu
              @menucloserequest=${this.#ie}
              @menuitemselected=${this.#V}
              .origin=${this.#ne}
              .showDivider=${!1}
              .showSelectedItem=${!1}
              .open=${this.exportMenuExpanded}
            >
              <devtools-menu-group .name=${Q(Z.export)}>
                ${ae(this.#s, (e) => Y`
                    <devtools-menu-item
                      .value=${e.getId()}
                      jslog=${oe(`converter-${y(e.getId())}`).track({ click: !0 })}>
                      ${e.getFormatName()}
                    </devtools-menu-item>
                  `)}
              </devtools-menu-group>
              <devtools-menu-group .name=${Q(Z.exportViaExtensions)}>
                ${ae(this.extensionConverters, (e) => Y`
                    <devtools-menu-item
                     .value=${e.getId()}
                      jslog=${oe("converter-extension").track({ click: !0 })}>
                    ${e.getFormatName()}
                    </devtools-menu-item>
                  `)}
                <devtools-menu-item .value=${Co}>
                  ${Q(Z.getExtensions)}
                </devtools-menu-item>
              </devtools-menu-group>
            </devtools-menu>
            <devtools-button
              @click=${this.#I}
              .data=${{
			variant: l.TOOLBAR,
			iconName: "bin",
			disabled: !this.currentRecording || this.#r.isPlaying || this.isRecording || this.isToggling,
			title: Q(Z.deleteRecording),
			jslogContext: "delete-recording"
		}}
            ></devtools-button>
            <div class="separator"></div>
            <devtools-button
              @click=${() => this.recordingPlayer?.continue()}
              .data=${{
			variant: l.PRIMARY_TOOLBAR,
			iconName: "resume",
			disabled: !this.recordingPlayer || !this.#r.isPausedOnBreakpoint,
			title: Q(Z.continueReplay),
			jslogContext: "continue-replay"
		}}
            ></devtools-button>
            <devtools-button
              @click=${() => this.recordingPlayer?.stepOver()}
              .data=${{
			variant: l.TOOLBAR,
			iconName: "step-over",
			disabled: !this.recordingPlayer || !this.#r.isPausedOnBreakpoint,
			title: Q(Z.stepOverReplay),
			jslogContext: "step-over"
		}}
            ></devtools-button>
            <div class="feedback">
              <devtools-link class="devtools-link" title=${Q(Z.sendFeedback)} href=${Eo} jslogcontext="feedback">${Q(Z.sendFeedback)}</devtools-link>
            </div>
            <div class="separator"></div>
            <devtools-shortcut-dialog
              .data=${{ shortcuts: this.#X() }} jslog=${_("show-shortcuts").track({ click: !0 })}
            ></devtools-shortcut-dialog>
          </div>
          ${this.importError ? Y`<div class='error'>Import error: ${this.importError.message}</div>` : ""}
          ${this.#Z()}
        </div>
      `;
	}
};
S([X()], $.prototype, "currentRecordingSession", void 0), S([X()], $.prototype, "currentRecording", void 0), S([X()], $.prototype, "currentStep", void 0), S([X()], $.prototype, "recordingError", void 0), S([X()], $.prototype, "isRecording", void 0), S([X()], $.prototype, "isToggling", void 0), S([X()], $.prototype, "recordingPlayer", void 0), S([X()], $.prototype, "lastReplayResult", void 0), S([X()], $.prototype, "currentPage", void 0), S([X()], $.prototype, "previousPage", void 0), S([X()], $.prototype, "sections", void 0), S([X()], $.prototype, "settings", void 0), S([X()], $.prototype, "importError", void 0), S([X()], $.prototype, "exportMenuExpanded", void 0), S([X()], $.prototype, "extensionConverters", void 0), S([X()], $.prototype, "replayExtensions", void 0), S([X()], $.prototype, "viewDescriptor", void 0), $ = S([bo("devtools-recorder-controller")], $);
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/recorder/RecorderPanel.ts
var Ao = /* @__PURE__ */ e({
	ActionDelegate: () => No,
	RecorderPanel: () => Mo
}), jo, Mo = class e extends pe {
	static panelName = "chrome-recorder";
	#e;
	constructor() {
		super(e.panelName), this.element.setAttribute("jslog", `${ne("chrome-recorder").track({ resize: !0 })}`), this.#e = new $(), this.contentElement.append(this.#e), this.setHideOnDetach();
	}
	static instance(t = { forceNew: null }) {
		let { forceNew: n } = t;
		return (!jo || n) && (jo = new e()), jo;
	}
	wasShown() {
		super.wasShown(), Pe.instance().setFlavor(e, this), this.#e.focus();
	}
	willHide() {
		super.willHide(), Pe.instance().setFlavor(e, null);
	}
	handleActions(e) {
		this.#e.handleActions(e);
	}
	isActionPossible(e) {
		return this.#e.isActionPossible(e);
	}
}, No = class {
	handleAction(e, t) {
		return (async () => {
			await Ue.instance().showView(Mo.panelName);
			let e = Ue.instance().view(Mo.panelName);
			e && (await e.widget()).handleActions(t);
		})(), !0;
	}
};
//#endregion
export { go as RecorderController, po as RecorderEvents, Ao as RecorderPanel };
