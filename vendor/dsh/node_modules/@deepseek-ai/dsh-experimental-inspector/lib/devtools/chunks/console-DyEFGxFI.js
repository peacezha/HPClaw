import { n as e } from "./rolldown-runtime-DF993M8W.js";
import { a as t } from "./dom_extension-BLny9Waw.js";
import { $ as n, C as r, D as i, H as a, K as o, Q as s, S as c, W as l, Wt as u, X as d, b as f, en as ee, i as p, o as te, qt as ne, r as re, v as m, w as ie, x as ae } from "./common-DMSVbaSb.js";
import { $d as h, $f as oe, $i as se, $n as ce, $s as le, Bc as ue, Bl as de, Cl as g, Cn as fe, Dl as pe, Dt as _, En as me, Fn as he, Fo as ge, Hi as _e, Ja as ve, Jl as ye, Jr as be, Ki as xe, La as Se, Mo as Ce, No as we, Or as Te, Pd as Ee, Pn as De, Po as Oe, Qs as v, S as ke, Sl as y, Sn as Ae, Ta as je, Tt as Me, U as Ne, Uc as Pe, Uf as Fe, Ur as b, Va as Ie, Vf as Le, Wf as Re, Wi as ze, Wo as Be, Xl as Ve, Xn as He, Xr as Ue, Xs as We, Xt as Ge, Yf as Ke, Yl as qe, Yn as Je, Yr as Ye, Z as Xe, Zi as Ze, Zo as Qe, Zs as x, _ as $e, ar as et, bp as tt, br as nt, d as rt, dp as it, ei as at, el as ot, er as st, f as ct, fa as S, ff as C, fl as lt, fo as ut, fp as dt, g as ft, gf as pt, gl as mt, ha as ht, hd as gt, i as _t, ic as w, if as T, ii as vt, jd as E, jo as D, jr as yt, k as bt, kp as xt, kr as St, ll as O, lr as Ct, lt as wt, ml as Tt, mo as Et, na as Dt, ni as k, op as Ot, p as kt, pf as A, po as At, qa as jt, r as Mt, tr as Nt, u as Pt, ui as Ft, uo as It, ur as Lt, vr as Rt, wt as zt, xl as Bt, xn as j, yr as Vt, zl as Ht } from "./legacy-dM_vujv7.js";
import { o as M, p as Ut, r as Wt } from "./root-DdvV-xPu.js";
import "./platform-D4TUCh2P.js";
import { c as Gt, g as Kt, l as qt, y as Jt } from "./text_utils-DWSliayn.js";
import { C as Yt, F as Xt, P as Zt, T as Qt, g as $t } from "./StringUtilities-CMDxNrEc.js";
import { B as en, F as tn, R as nn, c as rn, o as an, s as on, w as sn, z as cn } from "./bindings-DyamxTH2.js";
import { C as N, En as ln, Fn as un, K as dn, Mt as fn, Qt as pn, Tn as mn, Vt as hn, Wt as gn, at as _n, b as vn, it as yn, ot as bn, q as xn, t as Sn, v as Cn, wn, xn as Tn, z as En } from "./common-Bs7hSOUj.js";
import { Ot as Dn, Pn as On, T as kn, Y as An, a as jn, bt as Mn, d as Nn, i as Pn, jt as Fn, sn as In, st as P, wn as Ln } from "./codemirror-CENmPHF2.js";
import { a as Rn, b as zn, h as Bn, r as Vn, s as Hn, v as Un } from "./object_ui-Dj5WXMwl.js";
import { D as Wn, S as Gn, T as Kn, _ as qn, a as Jn, b as Yn, c as Xn, g as Zn, h as Qn, l as $n, m as er, n as tr, o as nr, p as rr, r as ir, t as ar, w as or, x as sr } from "./text_editor-B6PKcoob.js";
import { a as cr, n as lr } from "./code_highlighter-CNBDhX-D.js";
import { t as ur } from "./AutocompleteHistory-BJXpeT8x.js";
import { t as dr } from "./objectValue.css-JafYDKlR.js";
import { d as fr, i as pr, o as F } from "./issues_manager-Ba4w-pt1.js";
import { i as mr, n as hr, r as gr, t as _r } from "./issue_counter-aMFHu4Gr.js";
import { t as vr } from "./request_link_icon-Do-M_Ngw.js";
import { r as yr } from "./data_grid-C6uthMeA.js";
import { n as I } from "./settings_ui-B3VIsMZM.js";
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/console/consoleContextSelector.css.mjs
var br = "/*\n * Copyright 2017 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.widget {\n  .console-context-selector-element{\n    padding: 2px 1px 2px 2px;\n    white-space: nowrap;\n    display: flex;\n    flex-direction: column;\n    height: 36px;\n    justify-content: center;\n    overflow-y: auto;\n\n    .title {\n      overflow: hidden;\n      text-overflow: ellipsis;\n      flex-grow: 0;\n    }\n\n    .subtitle {\n      color: var(--sys-color-token-subtle);\n      margin-right: 3px;\n      overflow: hidden;\n      text-overflow: ellipsis;\n      flex-grow: 0;\n    }\n\n    .badge {\n      pointer-events: none;\n      margin-right: 4px;\n      display: inline-block;\n      height: 15px;\n    }\n  }\n\n  &.highlighted .console-context-selector-element .subtitle {\n    color: inherit;\n  }\n}\n", xr = /* @__PURE__ */ e({
	ConsoleContextSelector: () => Or,
	ConsoleContextSelectorElement: () => Ar
}), { render: Sr, nothing: Cr, html: wr } = we, Tr = {
	javascriptContextNotSelected: "JavaScript context: Not selected",
	extension: "Extension",
	javascriptContextS: "JavaScript context: {PH1}"
}, Er = o("panels/console/ConsoleContextSelector.ts", Tr), Dr = a.bind(void 0, Er), Or = class {
	items;
	dropDown;
	#e;
	constructor() {
		this.items = new Vt(), this.dropDown = new ft(this.items, this, "javascript-context"), this.dropDown.setRowHeight(36), this.#e = new Nt(this.dropDown.element), this.#e.setEnabled(!1), this.#e.setTitle(Dr(Tr.javascriptContextNotSelected)), this.items.addEventListener(Rt.ITEMS_REPLACED, () => this.#e.setEnabled(!!this.items.length)), this.#e.element.classList.add("toolbar-has-dropdown"), E.instance().addModelListener(g, Bt.ExecutionContextCreated, this.onExecutionContextCreated, this, { scoped: !0 }), E.instance().addModelListener(g, Bt.ExecutionContextChanged, this.onExecutionContextChanged, this, { scoped: !0 }), E.instance().addModelListener(g, Bt.ExecutionContextDestroyed, this.onExecutionContextDestroyed, this, { scoped: !0 }), E.instance().addModelListener(Pe, ue.FrameNavigated, this.frameNavigated, this, { scoped: !0 }), S.instance().addFlavorChangeListener(y, this.executionContextChangedExternally, this), S.instance().addFlavorChangeListener(tn, this.callFrameSelectedInUI, this), E.instance().observeModels(g, this, { scoped: !0 }), E.instance().addModelListener(lt, Tt.CallFrameSelected, this.callFrameSelectedInModel, this);
	}
	toolbarItem() {
		return this.#e;
	}
	highlightedItemChanged(e, t, n, r) {
		if (O.hideDOMNodeHighlight(), t?.frameId) {
			let e = pe.instance().getFrame(t.frameId);
			e && !e.isOutermostFrame() && e.highlight();
		}
		n && n.classList.remove("highlighted"), r && r.classList.add("highlighted");
	}
	titleFor(e) {
		let t = e.target(), n = e.label(), r = n ? t.decorateLabel(n) : "";
		if (e.frameId) {
			let n = t.model(Pe)?.frameForId(e.frameId);
			n && (r ||= n.displayName());
		}
		return r ||= e.origin, r;
	}
	depthFor(e) {
		let t = e.target(), n = 0;
		if (e.isDefault || n++, e.frameId) {
			let r = pe.instance().getFrame(e.frameId);
			for (; r;) r = r.parentFrame(), r && (n++, t = r.resourceTreeModel().target());
		}
		let r = 0, i = t.parentTarget();
		for (; i && t.type() !== Ee.ServiceWorker;) r++, t = i, i = t.parentTarget();
		return n += r, n;
	}
	executionContextCreated(e) {
		this.items.insertWithComparator(e, e.runtimeModel.executionContextComparator()), e === S.instance().flavor(y) && this.dropDown.selectItem(e);
	}
	onExecutionContextCreated(e) {
		let t = e.data;
		this.executionContextCreated(t);
	}
	onExecutionContextChanged(e) {
		let t = e.data;
		this.items.indexOf(t) !== -1 && (this.executionContextDestroyed(t), this.executionContextCreated(t));
	}
	executionContextDestroyed(e) {
		let t = this.items.indexOf(e);
		t !== -1 && this.items.remove(t);
	}
	onExecutionContextDestroyed(e) {
		let t = e.data;
		this.executionContextDestroyed(t);
	}
	executionContextChangedExternally({ data: e }) {
		(!e || E.instance().isInScope(e.target())) && this.dropDown.selectItem(e);
	}
	isTopContext(e) {
		if (!e?.isDefault) return !1;
		let t = e.target().model(Pe), n = e.frameId && t?.frameForId(e.frameId);
		return n ? n.isOutermostFrame() : !1;
	}
	hasTopContext() {
		return this.items.some((e) => this.isTopContext(e));
	}
	modelAdded(e) {
		e.executionContexts().forEach(this.executionContextCreated, this);
	}
	modelRemoved(e) {
		for (let t = this.items.length - 1; t >= 0; t--) this.items.at(t).runtimeModel === e && this.executionContextDestroyed(this.items.at(t));
	}
	createElementForItem(e) {
		let t = new Ar();
		return t.title = this.titleFor(e), t.subtitle = this.subtitleFor(e), t.itemDepth = this.depthFor(e), t.markAsRoot(), t.contentElement;
	}
	subtitleFor(e) {
		let t = e.target(), n = null;
		if (e.frameId && (n = t.model(Pe)?.frameForId(e.frameId) ?? null), f(e.origin, "chrome-extension:")) return Dr(Tr.extension);
		let r = n?.sameTargetParentFrame();
		if (!n || !r || r.securityOrigin !== e.origin) {
			let t = m.fromString(e.origin);
			if (t) return t.domain();
		}
		if (n?.securityOrigin) {
			let e = new m(n.securityOrigin).domain();
			if (e) return e;
		}
		return "IFrame";
	}
	isItemSelectable(e) {
		let t = e.debuggerModel.selectedCallFrame()?.script.executionContext();
		return !t || e === t;
	}
	itemSelected(e) {
		this.#e.element.classList.toggle("highlight", !this.isTopContext(e) && this.hasTopContext());
		let t = e ? Dr(Tr.javascriptContextS, { PH1: this.titleFor(e) }) : Dr(Tr.javascriptContextNotSelected);
		this.#e.setTitle(t), S.instance().setFlavor(y, e);
	}
	callFrameSelectedInUI() {
		let e = S.instance().flavor(tn)?.sdkFrame.script.executionContext();
		e && S.instance().setFlavor(y, e);
	}
	callFrameSelectedInModel(e) {
		let t = e.data;
		for (let e of this.items) e.debuggerModel === t && this.dropDown.refreshItem(e);
	}
	frameNavigated(e) {
		let t = e.data, n = t.resourceTreeModel().target().model(g);
		if (n) for (let e of n.executionContexts()) t.id === e.frameId && this.dropDown.refreshItem(e);
	}
}, kr = (e, t, n) => {
	if (!e.title) {
		Sr(Cr, n);
		return;
	}
	Sr(wr`
      <style>${br}</style>
      <div class="console-context-selector-element" style="padding-left: ${e.itemDepth ? 8 + e.itemDepth * 15 + "px" : void 0};">
        <div class="title">${Zt(e.title, 100)}</div>
        <div class="subtitle">${e.subtitle}</div>
      </div>
    `, n);
}, Ar = class extends k {
	#e;
	#t;
	#n;
	#r;
	constructor(e, t) {
		super(e, { useShadowDom: !0 }), this.#e = t ?? kr, this.requestUpdate();
	}
	set title(e) {
		this.#t = e, this.requestUpdate();
	}
	set subtitle(e) {
		this.#n = e, this.requestUpdate();
	}
	set itemDepth(e) {
		this.#r = e, this.requestUpdate();
	}
	async performUpdate() {
		let e = {
			title: this.#t,
			subtitle: this.#n,
			itemDepth: this.#r
		};
		this.#e(e, void 0, this.contentElement);
	}
}, jr = /* @__PURE__ */ e({
	ConsoleFilter: () => L,
	FilterType: () => R
}), L = class e {
	name;
	parsedFilters;
	executionContext;
	levelsMask;
	constructor(t, n, r, i) {
		this.name = t, this.parsedFilters = n, this.executionContext = r, this.levelsMask = i || e.defaultLevelsFilterValue();
	}
	static allLevelsFilterValue() {
		let e = {}, t = {
			Verbose: h.LogEntryLevel.Verbose,
			Info: h.LogEntryLevel.Info,
			Warning: h.LogEntryLevel.Warning,
			Error: h.LogEntryLevel.Error
		};
		for (let n of Object.values(t)) e[n] = !0;
		return e;
	}
	static defaultLevelsFilterValue() {
		let t = e.allLevelsFilterValue();
		return t[h.LogEntryLevel.Verbose] = !1, t;
	}
	static singleLevelMask(e) {
		let t = {};
		return t[e] = !0, t;
	}
	clone() {
		let t = this.parsedFilters.map(Gt.cloneFilter), n = Object.assign({}, this.levelsMask);
		return new e(this.name, t, this.executionContext, n);
	}
	shouldBeVisible(e) {
		let t = e.consoleMessage();
		return this.executionContext && (this.executionContext.runtimeModel !== t.runtimeModel() || this.executionContext.id !== t.getExecutionContextId()) ? !1 : t.type === w.Command || t.type === w.Result || t.type === T.ConsoleAPICalledEventType.EndGroup ? !0 : t.level && !this.levelsMask[t.level] ? !1 : this.applyFilter(e) || this.parentGroupHasMatch(e.consoleGroup());
	}
	parentGroupHasMatch(e) {
		return e === null ? !1 : this.applyFilter(e) || this.parentGroupHasMatch(e.consoleGroup());
	}
	applyFilter(e) {
		let t = e.consoleMessage();
		for (let r of this.parsedFilters) if (r.key) switch (r.key) {
			case "context":
				if (!n(r, t.context, !1)) return !1;
				break;
			case "source":
				if (!n(r, t.source ? le.get(t.source) : t.source, !0)) return !1;
				break;
			case "url": if (!n(r, t.url, !1)) return !1;
		}
		else if (r.regex && e.matchesFilterRegex(r.regex) === r.negative || r.text && e.matchesFilterText(r.text) === r.negative) return !1;
		return !0;
		function n(e, t, n) {
			if (!e.text) return !!t === e.negative;
			if (!t) return !e.text == !e.negative;
			let r = e.text.toLowerCase(), i = t.toLowerCase();
			return !(n && i === r === e.negative || !n && i.includes(r) === e.negative);
		}
	}
}, R = /* @__PURE__ */ function(e) {
	return e.Context = "context", e.Source = "source", e.Url = "url", e;
}({}), Mr = /* @__PURE__ */ e({
	format: () => Fr,
	updateStyle: () => Lr
}), Nr = [
	"black",
	"red",
	"green",
	"yellow",
	"blue",
	"magenta",
	"cyan",
	"gray"
], Pr = [
	"darkgray",
	"lightred",
	"lightgreen",
	"lightyellow",
	"lightblue",
	"lightmagenta",
	"lightcyan",
	"white"
], Fr = (e, t) => {
	let n = [], r = /* @__PURE__ */ new Map();
	function i(e) {
		let t = r.get("text-decoration") ?? "";
		t.includes(e) || r.set("text-decoration", `${t} ${e}`);
	}
	function a(e) {
		let t = r.get("text-decoration")?.replace(` ${e}`, "");
		t ? r.set("text-decoration", t) : r.delete("text-decoration");
	}
	function o(e) {
		if (e) {
			if (n.length && n[n.length - 1].type === "string") {
				n[n.length - 1].value += e;
				return;
			}
			n.push({
				type: "string",
				value: e
			});
		}
	}
	let s = 0, c = /%([%_Oocsdfi])|\x1B\[([\d;]*)m/;
	for (let l = c.exec(e); l !== null; l = c.exec(e)) {
		o(l.input.substring(0, l.index));
		let c, u = l[1];
		switch (u) {
			case "%":
				o("%"), c = "";
				break;
			case "s":
				if (s < t.length) {
					let { description: e } = t[s++];
					c = e ?? "";
				}
				break;
			case "c":
				if (s < t.length) {
					let e = t[s++].description ?? "";
					n.push({
						type: "style",
						value: e
					}), c = "";
				}
				break;
			case "o":
			case "O":
				if (s < t.length) {
					let e = u === "O" ? "generic" : "optimal", r = t[s++];
					n.push({
						type: e,
						value: r
					}), c = "";
				}
				break;
			case "_":
				s < t.length && (s++, c = "");
				break;
			case "d":
			case "f":
			case "i":
				if (s < t.length) {
					let { value: e } = t[s++];
					c = typeof e == "number" ? e : NaN, u !== "f" && (c = Math.floor(c));
				}
				break;
			case void 0: {
				let e = (l[2] || "0").split(";").map((e) => e ? parseInt(e, 10) : 0);
				for (; e.length;) {
					let t = e.shift();
					switch (t) {
						case 0:
							r.clear();
							break;
						case 1:
							r.set("font-weight", "bold");
							break;
						case 2:
							r.set("font-weight", "lighter");
							break;
						case 3:
							r.set("font-style", "italic");
							break;
						case 4:
							i("underline");
							break;
						case 9:
							i("line-through");
							break;
						case 22:
							r.delete("font-weight");
							break;
						case 23:
							r.delete("font-style");
							break;
						case 24:
							a("underline");
							break;
						case 29:
							a("line-through");
							break;
						case 38:
						case 48:
							if (e.shift() === 2) {
								let n = e.shift() ?? 0, i = e.shift() ?? 0, a = e.shift() ?? 0;
								r.set(t === 38 ? "color" : "background-color", `rgb(${n},${i},${a})`);
							}
							break;
						case 39:
						case 49:
							r.delete(t === 39 ? "color" : "background-color");
							break;
						case 53:
							i("overline");
							break;
						case 55:
							a("overline");
							break;
						default: {
							let e = Nr[t - 30] ?? Pr[t - 90];
							if (e !== void 0) r.set("color", `var(--console-color-${e})`);
							else {
								let e = Nr[t - 40] ?? Pr[t - 100];
								e !== void 0 && r.set("background-color", `var(--console-color-${e})`);
							}
							break;
						}
					}
				}
				let t = [...r.entries()].map(([e, t]) => `${e}:${t.trimStart()}`).join(";");
				n.push({
					type: "style",
					value: t
				}), c = "";
				break;
			}
		}
		c === void 0 && (o(l[0]), c = ""), e = c + l.input.substring(l.index + l[0].length);
	}
	return o(e), {
		tokens: n,
		args: t.slice(s)
	};
}, Ir = (e) => [...e].map((e) => `\\\\?(?:${[...new Set([e.toLowerCase(), e.toUpperCase()].map((e) => e.charCodeAt(0).toString(16)))].map((e) => `\\\\0{0,${6 - e.length}}${e}[ \\n\\t]?`).join("|")}|${e})`).join(""), Lr = (e, t) => {
	let n = [
		"background",
		"border",
		"color",
		"font",
		"line",
		"margin",
		"padding",
		"text"
	], r = RegExp(`(?=${Ir("url")}\\(['"]?([^\\)]*))`, "gi"), i = RegExp(`(?=(${Ir("image-set")}\\(.*))`, "gi"), a = /^image-set\((?:(?:(?:url|type)\("[^\\"]*"\)|[\d.]+(?:x|dpi|dpcm|dppx)),?\s*)+\)/i;
	e.clear();
	let o = document.createElement("span");
	o.setAttribute("style", t);
	for (let t of o.style) {
		if (!n.some((e) => t.startsWith(e) || t.startsWith(`-webkit-${e}`))) continue;
		let s = o.style.getPropertyValue(t);
		[...s.matchAll(i)].some((e) => !a.test(e[1])) || [...s.matchAll(r)].map((e) => e[1]).some((e) => !f(e, "data:")) || e.set(t, {
			value: s,
			priority: o.style.getPropertyPriority(t)
		});
	}
}, Rr = "/*\n * Copyright 2025 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n@scope to (devtools-widget > *) {\n  .teaser-tooltip-container {\n    width: var(--sys-size-31);\n    padding: var(--sys-size-1) var(--sys-size-3) var(--sys-size-3);\n    margin-top: var(--sys-size-2);\n  }\n\n  .response-container {\n    height: 85px;\n    display: flex;\n    flex-direction: column;\n  }\n\n  @keyframes gradient {\n    0% { background-position: 100% 0; }\n    100% { background-position: -100% 0; }\n  }\n\n  .loader {\n    background-size: 400% 100%;\n    animation: gradient 4s infinite linear;\n    margin-top: var(--sys-size-5);\n  }\n\n  @media (prefers-color-scheme: light) {\n    .loader {\n      background-image: linear-gradient(\n        70deg,\n        color-mix(in srgb, var(--sys-color-on-surface) 5%, transparent) 0%,\n        color-mix(in srgb, var(--sys-color-on-surface) 5%, transparent) 30%,\n        color-mix(in srgb, var(--sys-color-on-surface) 15%, transparent) 50%,\n        color-mix(in srgb, var(--sys-color-on-surface) 5%, transparent) 70%,\n        color-mix(in srgb, var(--sys-color-on-surface) 5%, transparent) 100%\n      );\n    }\n  }\n\n  @media (prefers-color-scheme: dark) {\n    .loader {\n      background-image: linear-gradient(\n        70deg,\n        color-mix(in srgb, var(--sys-color-on-surface) 10%, transparent) 0%,\n        color-mix(in srgb, var(--sys-color-on-surface) 10%, transparent) 30%,\n        color-mix(in srgb, var(--sys-color-on-surface) 30%, transparent) 50%,\n        color-mix(in srgb, var(--sys-color-on-surface) 10%, transparent) 70%,\n        color-mix(in srgb, var(--sys-color-on-surface) 10%, transparent) 100%\n      );\n    }\n  }\n\n  h2 {\n    font: var(--sys-typescale-body4-bold);\n    margin: 0 0 var(--sys-size-3);\n    line-clamp: 1;\n    -webkit-line-clamp: 1;\n    display: -webkit-box;\n    -webkit-box-orient: vertical;\n    overflow: hidden;\n  }\n\n  .main-text {\n    line-clamp: 4;\n    -webkit-line-clamp: 4;\n    display: -webkit-box;\n    -webkit-box-orient: vertical;\n    overflow: hidden;\n  }\n\n  .lightbulb-icon {\n    color: var(--sys-color-on-primary);\n    height: var(--sys-size-7);\n    margin-left: calc(-1 * var(--sys-size-4));\n  }\n\n  .learn-more {\n    padding-top: 7px;\n  }\n\n  .info-tooltip-text {\n    max-width: var(--sys-size-26);\n  }\n\n  .tooltip-footer {\n    padding: var(--sys-size-5) 0 0;\n    display: flex;\n    align-items: center;\n    height: 34px;\n\n    devtools-checkbox {\n      margin-left: auto;\n    }\n  }\n\n  .progress-line {\n    display: flex;\n    align-items: center;\n    flex-grow: 1;\n\n    .label {\n      margin-right: var(--sys-size-6);\n    }\n\n    .indicator-container {\n      height: var(--sys-size-5);\n      background-color: var(--sys-color-surface5);\n      flex-grow: 1\n    }\n\n    .indicator {\n      background-color: var(--sys-color-primary);\n      height: 100%;\n    }\n  }\n}\n", zr = "/* Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n *\n * Copyright (C) 2006, 2007, 2008 Apple Inc.  All rights reserved.\n * Copyright (C) 2009 Anthony Ricaud <rik@webkit.org>\n *\n * Redistribution and use in source and binary forms, with or without\n * modification, are permitted provided that the following conditions\n * are met:\n *\n * 1.  Redistributions of source code must retain the above copyright\n *     notice, this list of conditions and the following disclaimer.\n * 2.  Redistributions in binary form must reproduce the above copyright\n *     notice, this list of conditions and the following disclaimer in the\n *     documentation and/or other materials provided with the distribution.\n * 3.  Neither the name of Apple Computer, Inc. (\"Apple\") nor the names of\n *     its contributors may be used to endorse or promote products derived\n *     from this software without specific prior written permission.\n *\n * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS \"AS IS\" AND ANY\n * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED\n * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE\n * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY\n * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES\n * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;\n * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND\n * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT\n * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF\n * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n */\n\n.console-view {\n  background-color: var(--sys-color-cdt-base-container);\n  overflow: hidden;\n\n  --override-error-text-color: var(--sys-color-on-error-container);\n  --message-corner-rounder-background: var(--sys-color-cdt-base-container);\n}\n\n.console-toolbar-container {\n  display: flex;\n  flex: none;\n}\n\n.console-main-toolbar {\n  flex: 1 1 auto;\n}\n\n.console-sidebar-levels-info {\n  margin-left: var(--sys-size-3);\n  width: var(--sys-size-8);\n  height: var(--sys-size-8);\n}\n\n#console-issues-counter {\n  margin-top: 0;\n}\n\n.console-toolbar-container > devtools-toolbar {\n  background-color: var(--sys-color-cdt-base-container);\n  border-bottom: 1px solid var(--sys-color-divider);\n}\n\n.console-view-fix-select-all {\n  height: 0;\n  overflow: hidden;\n}\n\n.console-settings-pane {\n  display: grid;\n  grid-template-columns: 50% 50%;\n  flex: none;\n  background-color: var(--sys-color-cdt-base-container);\n  border-bottom: 1px solid var(--sys-color-divider);\n}\n\n#console-messages {\n  flex: 1 1;\n  overflow-y: auto;\n  overflow-wrap: break-word;\n  user-select: text;\n  transform: translateZ(0);\n  overflow-anchor: none;  /* Chrome-specific scroll-anchoring opt-out */\n  background-color: var(--sys-color-cdt-base-container);\n}\n\n#console-prompt {\n  clear: right;\n  position: relative;\n  margin: 0 22px 0 20px;\n}\n\n.console-prompt-editor-container {\n  min-height: 21px;\n  padding-left: 2px;\n  padding-top: 1px;\n}\n\n.console-message,\n.console-user-command {\n  clear: right;\n  position: relative;\n  padding: 1px 22px 1px 0;\n  margin-left: 24px;\n  min-height: 18px;\n  flex: auto;\n  display: flex;\n  align-items: flex-end;\n}\n\n.console-message > * {\n  flex: auto;\n}\n\n.console-timestamp {\n  color: var(--sys-color-token-subtle);\n  user-select: none;\n  flex: none;\n  margin-right: 5px;\n}\n\n.message-level-icon,\n.command-result-icon {\n  position: absolute;\n  left: -17px;\n  top: 2px;\n  user-select: none;\n}\n\n.console-message-repeat-count {\n  margin: 1.4px 0 0 10px;\n  flex: none;\n}\n\n.repeated-message {\n  margin-left: 4px;\n}\n\n.repeated-message .message-level-icon {\n  display: none;\n}\n\n.console-message-stack-trace-toggle {\n  display: flex;\n  flex-direction: row;\n  align-items: flex-start;\n  margin-top: -1px;\n}\n\n.console-error-level .repeated-message,\n.console-warning-level .repeated-message,\n.console-verbose-level .repeated-message,\n.console-info-level .repeated-message {\n  display: flex;\n}\n\n.console-info {\n  color: var(--sys-color-token-subtle);\n  font-style: italic;\n  padding-bottom: 2px;\n}\n\n.console-group .console-group > .console-group-messages {\n  margin-left: 16px;\n}\n\n.console-group-title.console-from-api {\n  font-weight: bold;\n}\n\n.console-group-title .console-message {\n  margin-left: 12px;\n}\n\n.expand-group-icon {\n  user-select: none;\n  flex: none;\n  position: relative;\n  left: 8px;\n  top: 3px;\n  margin-right: 2px;\n}\n\n.console-group-title .message-level-icon {\n  display: none;\n}\n\n.console-message-repeat-count .expand-group-icon {\n  position: static;\n  color: var(--sys-color-cdt-base-container);\n  margin-left: -1px;\n}\n\n.console-group {\n  position: relative;\n}\n\n.console-message-wrapper {\n  display: flex;\n  flex-direction: column;\n  margin: 4px;\n  border-radius: 5px;\n\n  /* Console ANSI color */\n  --console-color-black: #000;\n  --console-color-red: #a00;\n  --console-color-green: #0a0;\n  --console-color-yellow: #a50;\n  --console-color-blue: #00a;\n  --console-color-magenta: #a0a;\n  --console-color-cyan: #0aa;\n  --console-color-gray: #aaa;\n  --console-color-darkgray: #555;\n  --console-color-lightred: #f55;\n  --console-color-lightgreen: #5f5;\n  --console-color-lightyellow: #ff5;\n  --console-color-lightblue: #55f;\n  --console-color-ightmagenta: #f5f;\n  --console-color-lightcyan: #5ff;\n  --console-color-white: #fff;\n\n  &:focus {\n    background-image: linear-gradient(to bottom, var(--sys-color-state-focus-highlight), var(--sys-color-state-focus-highlight));\n  }\n}\n\n.console-row-wrapper {\n  display: flex;\n  flex-direction: row;\n}\n\n.theme-with-dark-background .console-message-wrapper {\n  /* Dark theme console ANSI color */\n  --console-color-red: rgb(237 78 76);\n  --console-color-green: rgb(1 200 1);\n  --console-color-yellow: rgb(210 192 87);\n  --console-color-blue: rgb(39 116 240);\n  --console-color-magenta: rgb(161 66 244);\n  --console-color-cyan: rgb(18 181 203);\n  --console-color-gray: rgb(207 208 208);\n  --console-color-darkgray: rgb(137 137 137);\n  --console-color-lightred: rgb(242 139 130);\n  --console-color-lightgreen: rgb(161 247 181);\n  --console-color-lightyellow: rgb(221 251 85);\n  --console-color-lightblue: rgb(102 157 246);\n  --console-color-lightmagenta: rgb(214 112 214);\n  --console-color-lightcyan: rgb(132 240 255);\n}\n\n.console-message-wrapper.console-warning-level + .console-message-wrapper,\n.console-message-wrapper.console-error-level + .console-message-wrapper {\n  & .console-message::before,\n  & .console-user-command::before {\n    display: none !important; /* stylelint-disable-line declaration-no-important */\n  }\n}\n\n.console-message-wrapper:not(.console-error-level, .console-warning-level) {\n  & .console-message::before,\n  & .console-user-command::before {\n    width: calc(100% - 25px);\n    content: \"\";\n    display: block;\n    position: absolute;\n    top: -2px;\n    border-top: 1px solid var(--sys-color-divider);\n  }\n\n  &:first-of-type .console-message::before,\n  &:first-of-type .console-user-command::before {\n    display: none;\n  }\n}\n\n.console-message-wrapper.console-adjacent-user-command-result:not(.console-error-level, .console-warning-level) {\n  border-top-width: 0;\n}\n\n.console-message-wrapper:focus + .console-message-wrapper {\n  border-top-color: transparent;\n}\n\n.console-message-wrapper.console-adjacent-user-command-result:not(.console-error-level, .console-warning-level):focus {\n  border-top-width: 1px;\n}\n\n.console-message-wrapper.console-adjacent-user-command-result:not(.console-error-level, .console-warning-level):focus .console-message {\n  padding-top: 2px;\n  min-height: 16px;\n}\n\n.console-message-wrapper.console-adjacent-user-command-result:not(.console-error-level, .console-warning-level):focus .command-result-icon {\n  top: 3px;\n}\n\n.console-message-wrapper .nesting-level-marker {\n  width: 14px;\n  flex: 0 0 auto;\n  position: relative;\n  margin-bottom: -1px;\n  margin-top: -1px;\n  background-color: var(--sys-color-cdt-base-container);\n}\n\n.console-message-wrapper .nesting-level-marker + .console-message::after {\n  position: absolute;\n  left: -30px;\n  top: 0;\n  width: 6px;\n  height: 100%;\n  box-sizing: border-box;\n  background-color: var(--sys-color-surface-yellow);\n  border-top-left-radius: 5px;\n  border-bottom-left-radius: 5px;\n  content: \"\";\n}\n\n.console-error-level {\n  background-color: var(--sys-color-surface-error);\n\n  --message-corner-rounder-background: var(--sys-color-surface-error);\n}\n\n.console-warning-level {\n  background-color: var(--sys-color-surface-yellow);\n\n  --message-corner-rounder-background: var(--sys-color-surface-yellow);\n}\n\n.console-view-object-properties-section {\n  padding: 0;\n  position: relative;\n  color: inherit;\n  display: inline-block;\n  overflow-wrap: break-word;\n  max-width: 100%;\n  margin-top: -1.5px;\n}\n\n/* Console content is rendered in \"Noto Sans Mono\" on Linux, which has a\n * different actual line-height than the fonts used on Windows or MacOS.\n * \"vertical-align: middle\" breaks the layout when expanding an object such\n * that it spans multiple lines. We therefore align to the top, and use a\n * different \"margin-top\" on Linux to compensate for the line-height difference.\n */\n.platform-linux .console-view-object-properties-section {\n  margin-top: 0;\n}\n\n.info-note {\n  background-color: var(--sys-color-tonal-container);\n}\n\n.info-note::before {\n  content: \"i\";\n}\n\n.console-view-object-properties-section:not(.expanded) .info-note {\n  display: none;\n}\n\n.console-system-type.console-info-level {\n  color: var(--sys-color-primary);\n}\n\n#console-messages .link {\n  cursor: pointer;\n  text-decoration: underline;\n}\n\n#console-messages .link,\n#console-messages .devtools-link:not(.invalid-link) {\n  color: var(--sys-color-primary);\n  word-break: break-all;\n}\n\n#console-messages .devtools-link:focus-visible {\n  background-color: transparent;\n}\n\n#console-messages .resource-links {\n  margin-top: -1px;\n  margin-bottom: -2px;\n}\n\n.console-object-preview {\n  white-space: normal;\n  overflow-wrap: break-word;\n  font-style: italic;\n}\n\n.console-object-preview .name {\n  flex-shrink: 0;\n}\n\n.console-message-text {\n  .object-value-node {\n    display: inline-block;\n  }\n\n  .object-value-string,\n  .object-value-regexp,\n  .object-value-symbol {\n    white-space: pre-wrap;\n    word-break: break-all;\n  }\n\n  .formatted-stack-frame {\n    display: var(--display-formatted-stack-frame-default);\n\n    &:has(.ignore-list-link) {\n      display: var(--display-ignored-formatted-stack-frame);\n      opacity: 60%;\n\n      /* Subsequent builtin stack frames are also treated as ignored */\n      & + .formatted-builtin-stack-frame {\n        display: var(--display-ignored-formatted-stack-frame);\n        opacity: 60%;\n      }\n    }\n  }\n}\n\n.console-message-stack-trace-wrapper {\n  --override-display-stack-preview-toggle-link: none;\n  --display-formatted-stack-frame-default: block;\n\n  flex: 1 1 auto;\n  display: flex;\n  flex-direction: column;\n  align-items: stretch;\n\n  &:has(div > .stack-preview-container.show-hidden-rows) {\n    --display-ignored-formatted-stack-frame: var(--display-formatted-stack-frame-default);\n  }\n\n  &:has(.formatted-stack-frame .ignore-list-link):has(.formatted-stack-frame .devtools-link:not(.ignore-list-link)),\n  &:has(.formatted-stack-frame .ignore-list-link):has(.stack-preview-container.has-non-ignored-links) {\n    /* If there are ignored frames and unignored frames, then we want\n    to enable the show more/less links. To do that we override some\n    variables to always display the structured stack trace, but possibly\n    only the links at the bottom of it, as we share its show more/less links.\n    We also check the structured stack trace (StackTracePreviewContent) for\n    non-ignored links, so that when all inline Error frames are ignored but\n    the console.error() call stack has non-ignored frames (e.g. in async\n    traces), the toggle is still shown. See crbug.com/379788109. */\n    --override-display-stack-preview-toggle-link: table-row;\n    --override-display-stack-preview-hidden-div: block;\n\n    &:not(:has(div > .stack-preview-container.show-hidden-rows)) {\n      --display-ignored-formatted-stack-frame: none;\n    }\n  }\n\n  & > .hidden-stack-trace {\n    /* Always hide the body of the structured stack trace if this class\n    is set, but we may still show it for the Show more/less links at the bottom. */\n    display: var(--override-display-stack-preview-hidden-div, none);\n\n    --override-display-stack-preview-tbody: none;\n  }\n}\n\n.repeated-message .console-message-stack-trace-toggle,\n.repeated-message > .console-message-text {\n  flex: 1;\n}\n\n.console-warning-level .console-message-text {\n  color: var(--sys-color-on-surface-yellow);\n}\n\n.console-error-level .console-message-text,\n.console-error-level .console-view-object-properties-section {\n  color: var(--override-error-text-color) !important; /* stylelint-disable-line declaration-no-important */\n}\n\n.console-message-formatted-table {\n  clear: both;\n}\n\n.console-message .source-code {\n  line-height: 1.2;\n}\n\n.console-message-anchor {\n  float: right;\n  text-align: right;\n  max-width: 100%;\n  margin-left: 4px;\n}\n\n.console-message-nowrap-below,\n.console-message-nowrap-below div,\n.console-message-nowrap-below span {\n  white-space: nowrap !important; /* stylelint-disable-line declaration-no-important */\n}\n\n.object-state-note {\n  display: inline-block;\n  width: 11px;\n  height: 11px;\n  color: var(--sys-color-on-tonal-container);\n  text-align: center;\n  border-radius: 3px;\n  line-height: 13px;\n  margin: 0 6px;\n  font-size: 9px;\n}\n\n.console-object {\n  white-space: pre-wrap;\n  word-break: break-all;\n}\n\n.console-message-stack-trace-wrapper > * {\n  flex: none;\n}\n\n.console-message-expand-icon {\n  margin-bottom: -4px;\n}\n\n.console-searchable-view {\n  max-height: 100%;\n}\n\n.console-view-pinpane {\n  max-height: 50%;\n}\n\n/* We are setting width and height to 0px to essentially hide the html element on the UI but visible to the screen reader.\n This html element is used by screen readers when console messages are filtered, instead of screen readers reading\n contents of the filtered messages we only want the screen readers to read the count of filtered messages. */\n.message-count {\n  width: 0;\n  height: 0;\n}\n\n.devtools-console-insight {\n  margin: 9px 22px 11px 24px;\n}\n\n.hover-button {\n  --width: 24px;\n\n  align-items: center;\n  border-radius: 50%;\n  border: none;\n  /* todo: extract to global styles and make it work with dark mode. */\n  box-shadow: 0 1px 3px 1px rgb(0 0 0 / 15%), 0 1px 2px 0 rgb(0 0 0 / 30%); /* stylelint-disable-line plugin/use_theme_colors */\n  box-sizing: border-box;\n  background-color: var(--sys-color-tonal-container);\n  color: var(--sys-color-on-tonal-container);\n  font: var(--sys-typescale-body4-medium);\n  height: var(--width);\n  justify-content: center;\n  margin: 0;\n  max-height: var(--width);\n  max-width: var(--width);\n  min-height: var(--width);\n  min-width: var(--width);\n  overflow: hidden;\n  padding: var(--sys-size-3) var(--sys-size-4);\n  position: absolute;\n  right: 6px;\n  display: none;\n  width: var(--width);\n  z-index: 1;\n\n  .theme-with-dark-background & {\n    border: 1px solid var(--sys-color-neutral-outline);\n    background-color: var(--sys-color-primary);\n    color: var(--sys-color-on-primary);\n  }\n\n  & devtools-icon {\n    box-sizing: border-box;\n    flex-shrink: 0;\n    height: var(--sys-size-8);\n    min-height: var(--sys-size-8);\n    min-width: var(--sys-size-8);\n    width: var(--sys-size-8);\n\n    --devtools-icon-color: var(--sys-color-on-tonal-container);\n  }\n\n  .theme-with-dark-background & devtools-icon {\n    --devtools-icon-color: var(--sys-color-on-primary);\n  }\n}\n\n.hover-button:focus,\n.hover-button:hover {\n  border-radius: 4px;\n  max-width: 200px;\n  transition:\n    max-width var(--sys-motion-duration-short4) var(--sys-motion-easing-emphasized),\n    border-radius 50ms linear;\n  width: fit-content;\n  gap: var(--sys-size-3);\n}\n\n.hover-button:focus-visible {\n  outline: 2px solid var(--sys-color-primary);\n  outline-offset: 2px;\n}\n\n.button-label {\n  display: block;\n  overflow: hidden;\n  white-space: nowrap;\n\n  & div {\n    display: inline-block;\n    vertical-align: -1px;\n\n    &::after {\n      content: attr(data-text);\n    }\n  }\n}\n\n.console-message-wrapper:not(.has-insight) {\n  &:hover,\n  &:focus,\n  &.console-selected {\n    .hover-button {\n      display: flex;\n\n      &:focus,\n      &:hover {\n        display: inline-flex;\n      }\n    }\n  }\n}\n\n.ai-code-completion-summary-toolbar-container {\n  container-type: inline-size;\n}\n\n@media (forced-colors: active) {\n  .console-message-expand-icon,\n  .console-warning-level .expand-group-icon {\n    forced-color-adjust: none;\n    color: ButtonText;\n  }\n\n  .console-message-wrapper:focus,\n  .console-message-wrapper:focus:last-of-type {\n    forced-color-adjust: none;\n    background-color: Highlight;\n    border-top-color: Highlight;\n    border-bottom-color: Highlight;\n  }\n\n  .console-message-wrapper:focus *,\n  .console-message-wrapper:focus:last-of-type *,\n  .console-message-wrapper:focus .devtools-link,\n  .console-message-wrapper:focus:last-of-type .devtools-link {\n    color: HighlightText !important; /* stylelint-disable-line declaration-no-important */\n  }\n\n  #console-messages .devtools-link,\n  #console-messages .devtools-link:hover {\n    color: linktext;\n  }\n\n  #console-messages .link:focus-visible,\n  #console-messages .devtools-link:focus-visible {\n    background: Highlight;\n    color: HighlightText;\n  }\n\n  .console-message-wrapper:focus devtools-icon {\n    color: HighlightText;\n  }\n\n  .console-message-wrapper.console-error-level:focus,\n  .console-message-wrapper.console-error-level:focus:last-of-type {\n    --override-error-text-color: HighlightText;\n  }\n}\n", Br = /* @__PURE__ */ e({
	ConsoleCommand: () => ti,
	ConsoleCommandResult: () => ni,
	ConsoleGroupViewMessage: () => ei,
	ConsoleTableMessageView: () => ri,
	ConsoleViewMessage: () => H,
	getLongStringVisibleLength: () => li,
	getMaxTokenizableStringLength: () => si,
	getMessageForElement: () => Ur,
	setLongStringVisibleLength: () => ui,
	setMaxTokenizableStringLength: () => ci
}), z = {
	consoleclearWasPreventedDueTo: "`console.clear()` was prevented due to 'Preserve log'",
	consoleWasCleared: "Console was cleared",
	clearAllMessagesWithS: "Clear all messages with {PH1}",
	assertionFailed: "Assertion failed: ",
	violationS: "`[Violation]` {PH1}",
	interventionS: "`[Intervention]` {PH1}",
	deprecationS: "`[Deprecation]` {PH1}",
	thisValueWillNotBeCollectedUntil: "This value will not be collected until console is cleared.",
	thisValueWasEvaluatedUponFirst: "This value was evaluated upon first expanding. It may have changed since then.",
	functionWasResolvedFromBound: "Function was resolved from bound function.",
	exception: "<exception>",
	warning: "Warning",
	error: "Error",
	logpoint: "Logpoint",
	cndBreakpoint: "Conditional Breakpoint",
	repeatS: "{n, plural, =1 {Repeated # time} other {Repeated # times}}",
	warningS: "{n, plural, =1 {Warning, Repeated # time} other {Warning, Repeated # times}}",
	errorS: "{n, plural, =1 {Error, Repeated # time} other {Error, Repeated # times}}",
	url: "<URL>",
	tookNms: "took <N>ms",
	someEvent: "<some> event",
	Mxx: " M<XX>",
	attribute: "<attribute>",
	index: "(index)",
	value: "Value",
	console: "Console",
	stackMessageExpanded: "Stack table expanded",
	stackMessageCollapsed: "Stack table collapsed",
	explainThisError: "Understand this error",
	explainThisWarning: "Understand this warning",
	explainThisMessage: "Understand this message",
	explainThisErrorWithAI: "Understand this error. Powered by AI.",
	explainThisWarningWithAI: "Understand this warning. Powered by AI.",
	explainThisMessageWithAI: "Understand this message. Powered by AI",
	dots: "(...)",
	invokePropertyGetter: "Invoke property getter"
}, Vr = o("panels/console/ConsoleViewMessage.ts", z), B = a.bind(void 0, Vr), Hr = /* @__PURE__ */ new WeakMap(), Ur = (e) => Hr.get(e), Wr = 18, Gr = (e) => (t) => t instanceof Ve ? t : e ? typeof t == "object" ? e.createRemoteObject(t) : e.createRemoteObjectFromPrimitiveValue(t) : Ve.fromLocalObject(t), Kr = "explain.console-message.hover", qr = "explain.console-message.context.error", Jr = "explain.console-message.context.warning", Yr = "explain.console-message.context.other", Xr = new IntersectionObserver((e) => {
	for (let t of e) t.intersectionRatio > 0 && C.actionTaken(A.InsightHoverButtonShown);
});
function V(e, t) {
	t instanceof k ? t.show(e, null, !0) : e.appendChild(t);
}
var H = class e {
	message;
	linkifier;
	repeatCountInternal;
	closeGroupDecorationCount;
	consoleGroupInternal;
	selectableChildren;
	messageResized;
	elementInternal;
	consoleRowWrapper = null;
	previewFormatter;
	searchRegexInternal;
	messageIcon;
	traceExpanded;
	expandTrace;
	hasStackTrace;
	anchorElement;
	contentElementInternal;
	nestingLevelMarkers;
	searchHighlightNodes;
	searchHighlightNodeChanges;
	isVisibleInternal;
	cachedHeight;
	messagePrefix;
	timestampElement;
	inSimilarGroup;
	similarGroupMarker;
	lastInSimilarGroup;
	groupKeyInternal;
	repeatCountElement;
	requestResolver;
	issueResolver;
	#e = !1;
	#t = void 0;
	#n = Promise.resolve();
	constructor(e, t, n, r, i) {
		this.message = e, this.linkifier = t, this.requestResolver = n, this.issueResolver = r, this.repeatCountInternal = 1, this.closeGroupDecorationCount = 0, this.selectableChildren = [], this.messageResized = i, this.elementInternal = null, this.previewFormatter = new zn(), this.searchRegexInternal = null, this.messageIcon = null, this.traceExpanded = !1, this.expandTrace = null, this.hasStackTrace = !1, this.anchorElement = null, this.contentElementInternal = null, this.nestingLevelMarkers = null, this.searchHighlightNodes = [], this.searchHighlightNodeChanges = [], this.isVisibleInternal = !1, this.cachedHeight = 0, this.messagePrefix = "", this.timestampElement = null, this.inSimilarGroup = !1, this.similarGroupMarker = null, this.lastInSimilarGroup = !1, this.groupKeyInternal = "", this.repeatCountElement = null, this.consoleGroupInternal = null;
	}
	setInsight(e) {
		this.elementInternal && (ge(e, this.elementInternal), this.elementInternal.classList.toggle("has-insight", !0), this.elementInternal.addEventListener("closeinsight", () => {
			C.actionTaken(A.InsightClosed), this.elementInternal && (this.elementInternal.classList.toggle("has-insight", !1), ge(Qe, this.elementInternal)), this.#t?.setInactive(!1);
		}, { once: !0 }), this.#t?.setInactive(!0));
	}
	element() {
		return this.toMessageElement();
	}
	wasShown() {
		this.isVisibleInternal = !0;
	}
	onResize() {}
	willHide() {
		this.isVisibleInternal = !1, this.cachedHeight = this.element().offsetHeight;
	}
	isVisible() {
		return this.isVisibleInternal;
	}
	fastHeight() {
		return this.cachedHeight ? this.cachedHeight : this.approximateFastHeight();
	}
	approximateFastHeight() {
		return Wr;
	}
	consoleMessage() {
		return this.message;
	}
	formatErrorStackPromiseForTest() {
		return this.#n;
	}
	buildMessage() {
		let e, t = this.message.messageText;
		if (this.message.source === r.ConsoleAPI) switch (this.message.type) {
			case T.ConsoleAPICalledEventType.Trace:
				e = this.format(this.message.parameters || ["console.trace"]);
				break;
			case T.ConsoleAPICalledEventType.Clear:
				e = document.createElement("span"), e.classList.add("console-info"), p.instance().moduleSetting("preserve-console-log").get() ? e.textContent = B(z.consoleclearWasPreventedDueTo) : e.textContent = B(z.consoleWasCleared), b.install(e, B(z.clearAllMessagesWithS, { PH1: String(_e.instance().shortcutTitleForAction("console.clear")) }));
				break;
			case T.ConsoleAPICalledEventType.Dir: {
				let t = ["%O", this.message.parameters ? this.message.parameters[0] : void 0];
				e = this.format(t);
				break;
			}
			case T.ConsoleAPICalledEventType.Profile:
			case T.ConsoleAPICalledEventType.ProfileEnd:
				e = this.format([t]);
				break;
			default: {
				if (this.message.type === T.ConsoleAPICalledEventType.Assert && (this.messagePrefix = B(z.assertionFailed)), this.message.parameters?.length === 1) {
					let t = this.message.parameters[0];
					typeof t != "string" && t.type === "string" && (e = this.tryFormatAsError(t.value));
				}
				let n = this.message.parameters || [t];
				e ||= this.format(n);
			}
		}
		else if (this.message.source === h.LogEntrySource.Network) e = this.formatAsNetworkRequest() || this.format([t]);
		else {
			let n = this.message.parameters && t === this.message.parameters[0];
			this.message.source === h.LogEntrySource.Violation ? t = B(z.violationS, { PH1: t }) : this.message.source === h.LogEntrySource.Intervention ? t = B(z.interventionS, { PH1: t }) : this.message.source === h.LogEntrySource.Deprecation && (t = B(z.deprecationS, { PH1: t }));
			let r = this.message.parameters || [t];
			n && (r[0] = t), e = this.format(r);
		}
		e.classList.add("console-message-text");
		let n = document.createElement("span");
		return n.classList.add("source-code"), this.anchorElement = this.buildMessageAnchor(), this.anchorElement && n.appendChild(this.anchorElement), n.appendChild(e), n;
	}
	formatAsNetworkRequest() {
		let e = gn.requestForConsoleMessage(this.message);
		if (!e) return null;
		let t = document.createElement("span");
		if (this.message.level === h.LogEntryLevel.Error) {
			j(t, e.requestMethod + " ");
			let n = N.linkifyRevealable(e, e.url(), e.url(), void 0, void 0, "network-request");
			n.tabIndex = -1, this.selectableChildren.push({
				element: n,
				forceSelect: () => n.focus()
			}), t.appendChild(n), e.failed && Ae(t, " ", e.localizedFailDescription || ""), e.statusCode !== 0 && Ae(t, " ", String(e.statusCode));
			let r = e.getInferredStatusText();
			r && Ae(t, " (", r, ")");
		} else {
			let n = this.message.messageText;
			V(t, this.linkifyWithCustomLinkifier(n, (t, n, r, i) => {
				let a = n === e.url() ? N.linkifyRevealable(e, n, e.url(), void 0, void 0, "network-request") : N.linkifyURL(n, {
					text: t,
					lineNumber: r,
					columnNumber: i
				});
				return a.tabIndex = -1, this.selectableChildren.push({
					element: a,
					forceSelect: () => a.focus()
				}), a;
			}));
		}
		return t;
	}
	createAffectedResourceLinks() {
		let e = [], t = this.message.getAffectedResources()?.requestId;
		if (t) {
			let n = new vr();
			n.classList.add("resource-links"), n.data = {
				affectedRequest: { requestId: t },
				requestResolver: this.requestResolver,
				displayURL: !1
			}, e.push(n);
		}
		let n = this.message.getAffectedResources()?.issueId;
		if (n) {
			let t = new _r();
			t.classList.add("resource-links"), t.data = {
				issueId: n,
				issueResolver: this.issueResolver
			}, e.push(t);
		}
		return e;
	}
	#r() {
		if (gn.requestForConsoleMessage(this.message)?.resourceType().isStyleSheet()) return A.StyleSheetInitiatorLinkClicked;
	}
	buildMessageAnchor() {
		let e = this.message.runtimeModel();
		if (!e) return null;
		let t = (({ stackFrameWithBreakpoint: t, scriptId: n, stackTrace: r, url: i, line: a, column: o }) => {
			let s = this.#r();
			return t ? this.linkifier.maybeLinkifyConsoleCallFrame(e.target(), t, {
				inlineFrameIndex: 0,
				revealBreakpoint: !0,
				userMetric: s
			}) : n ? this.linkifier.linkifyScriptLocation(e.target(), n, i || "", a, {
				columnNumber: o,
				inlineFrameIndex: 0,
				userMetric: s
			}) : r?.callFrames.length ? this.linkifier.linkifyStackTraceTopFrame(e.target(), r) : i && i !== "undefined" ? this.linkifier.linkifyScriptLocation(e.target(), null, i, a, {
				columnNumber: o,
				inlineFrameIndex: 0,
				userMetric: s
			}) : null;
		})(this.message);
		if (t) {
			t.tabIndex = -1, this.selectableChildren.push({
				element: t,
				forceSelect: () => t.focus()
			});
			let e = document.createElement("span");
			e.classList.add("console-message-anchor"), e.appendChild(t);
			for (let t of this.createAffectedResourceLinks()) j(e, " "), e.append(t);
			return j(e, " "), e;
		}
		return null;
	}
	buildMessageWithStackTrace(e) {
		let t = Ce("triangle-right", "console-message-expand-icon"), { stackTraceElement: n, contentElement: r, messageElement: i, clickableElement: a, toggleElement: o } = this.buildMessageHelper(e.target(), this.message.stackTrace, t), s;
		return this.expandTrace = (e) => {
			e ? s = window.setTimeout(() => {
				C.actionTaken(A.TraceExpanded);
			}, 300) : clearTimeout(s), t.name = e ? "triangle-down" : "triangle-right", n.classList.toggle("hidden-stack-trace", !e);
			let o = B(e ? z.stackMessageExpanded : z.stackMessageCollapsed);
			_(r, `${i.textContent} ${o}`), Ne.alert(o), zt(a, e), this.traceExpanded = e;
		}, a.addEventListener("click", (e) => {
			De() || r.hasSelection() || (this.expandTrace?.(n.classList.contains("hidden-stack-trace")), e.consume());
		}, !1), this.message.type === T.ConsoleAPICalledEventType.Trace && p.instance().moduleSetting("console-trace-expand").get() && this.expandTrace(!0), this.hasStackTrace = !0, o._expandStackTraceForTest = this.expandTrace.bind(this, !0), o;
	}
	buildMessageWithIgnoreLinks() {
		let { toggleElement: e } = this.buildMessageHelper(null, void 0, null);
		return e;
	}
	buildMessageHelper(e, t, n) {
		let r = document.createElement("div");
		r.classList.add("console-message-stack-trace-toggle");
		let i = r.createChild("div", "console-message-stack-trace-wrapper"), a = this.buildMessage(), o = i.createChild("div");
		zt(o, !1), n && o.appendChild(n), t && (o.tabIndex = -1), o.appendChild(a);
		let s = i.createChild("div", "hidden-stack-trace"), c = E.instance(), l = e ?? c.primaryPageTarget() ?? c.rootTarget(), u = new Cn();
		if (u.options = { widthConstrained: !0 }, l && t) {
			let e = this.selectableChildren.length;
			on.instance().createStackTraceFromProtocolRuntime(t, l).then((e) => (u.stackTrace = e, u.updateComplete)).then(() => {
				let t = u.linkElements.map((e) => ({
					element: e,
					forceSelect: () => e.focus()
				}));
				this.selectableChildren.splice(e, 0, ...t);
			});
		}
		return u.markAsRoot(), u.show(s), _(i, `${a.textContent} ${B(z.stackMessageCollapsed)}`), Xe(s), {
			stackTraceElement: s,
			contentElement: i,
			messageElement: a,
			clickableElement: o,
			toggleElement: r
		};
	}
	format(e) {
		let t = document.createElement("span");
		if (this.messagePrefix && (t.createChild("span").textContent = this.messagePrefix), !e.length) return t;
		let n = e.map(Gr(this.message.runtimeModel())), r = Ve.type(n[0]) === "string" && (this.message.type !== w.Result || this.message.level === h.LogEntryLevel.Error);
		r && (n = this.formatWithSubstitutionString(n[0].description, n.slice(1), t), n.length && j(t, " "));
		for (let e = 0; e < n.length; ++e) r && n[e].type === "string" ? V(t, this.linkifyStringAsFragment(n[e].description || "")) : t.appendChild(this.formatParameter(n[e], !1, !0)), e < n.length - 1 && j(t, " ");
		return t;
	}
	formatParameter(e, t, n) {
		if (e.customPreview()) return new Vn(e).element;
		let r = t ? "object" : e.subtype || e.type, i;
		switch (r) {
			case "error":
				i = this.formatParameterAsError(e);
				break;
			case "function":
				i = this.formatParameterAsFunction(e, n);
				break;
			case "array":
			case "arraybuffer":
			case "blob":
			case "dataview":
			case "generator":
			case "iterator":
			case "map":
			case "object":
			case "promise":
			case "proxy":
			case "set":
			case "typedarray":
			case "wasmvalue":
			case "weakmap":
			case "weakset":
			case "webassemblymemory":
				i = this.formatParameterAsObject(e, n);
				break;
			case "node":
				i = e.isNode() ? this.formatParameterAsNode(e) : this.formatParameterAsObject(e, !1);
				break;
			case "trustedtype":
				i = this.formatParameterAsObject(e, !1);
				break;
			case "string":
				i = this.formatParameterAsString(e);
				break;
			case "boolean":
			case "date":
			case "null":
			case "number":
			case "regexp":
			case "symbol":
			case "undefined":
			case "bigint":
				i = this.formatParameterAsValue(e);
				break;
			default: i = this.formatParameterAsValue(e), console.error(`Tried to format remote object of unknown type ${r}.`);
		}
		return i.classList.add(`object-value-${r}`), i.classList.add("source-code"), i;
	}
	formatParameterAsValue(e) {
		let t = document.createElement("span"), n = e.description || "";
		if (n.length > si()) {
			let e = new Rn();
			e.text = n, e.maxLength = li(), e.show(t, null, !0);
		} else j(t, n);
		return t.addEventListener("contextmenu", this.contextMenuEventFired.bind(this, e), !1), t;
	}
	formatParameterAsTrustedType(e) {
		let t = document.createElement("span"), n = document.createElement("span");
		return n.appendChild(this.formatParameterAsString(e)), n.classList.add("object-value-string"), j(t, `${e.className} `), t.appendChild(n), t;
	}
	formatParameterAsObject(e, t) {
		let n = document.createElement("span");
		n.classList.add("console-object");
		let r = (t) => {
			e.preview && (n.classList.add("console-object-preview"), ge(this.previewFormatter.renderObjectPreview(e.preview, t), n), Hn.appendMemoryIcon(n, e));
		};
		if (t && e.preview) r(!0);
		else if (e.type === "function") {
			let t = n.createChild("span");
			Hn.formatObjectAsFunction(e, t, !1), n.classList.add("object-value-function");
		} else e.subtype === "trustedtype" ? n.appendChild(this.formatParameterAsTrustedType(e)) : j(n, e.description || "");
		if (!e.hasChildren || e.customPreview()) return n;
		let i = n.createChild("span", "object-state-note info-note");
		this.message.type === w.QueryObjectResult ? b.install(i, B(z.thisValueWillNotBeCollectedUntil)) : b.install(i, B(z.thisValueWasEvaluatedUponFirst));
		let a = new Hn(e, n, this.linkifier);
		return a.element.classList.add("console-view-object-properties-section"), a.enableContextMenu(), a.setShowSelectionOnKeyboardFocus(!0, !0), this.selectableChildren.push(a), a.addEventListener(Mt.ElementAttached, this.messageResized), a.addEventListener(Mt.ElementExpanded, this.messageResized), a.addEventListener(Mt.ElementCollapsed, this.messageResized), a.root.addEventListener(Bn.Events.FILTER_CHANGED, () => r(a.root.includeNullOrUndefinedValues)), a.element;
	}
	formatParameterAsFunction(e, t) {
		let n = document.createElement("span");
		return qe.objectAsFunction(e).targetFunction().then(r.bind(this)), n;
		function r(r) {
			let i = document.createElement("span"), a = Hn.formatObjectAsFunction(r, i, !0, t);
			if (n.appendChild(i), r !== e) {
				let e = n.createChild("span", "object-state-note info-note");
				b.install(e, B(z.functionWasResolvedFromBound));
			}
			n.addEventListener("contextmenu", this.contextMenuEventFired.bind(this, e), !1), a.then(() => this.formattedParameterAsFunctionForTest());
		}
	}
	formattedParameterAsFunctionForTest() {}
	contextMenuEventFired(e, t) {
		let n = new nt(t);
		n.appendApplicableItems(e), n.show();
	}
	renderPropertyPreviewOrAccessor(e, t, n) {
		return t.type === "accessor" ? this.formatAsAccessorProperty(e, n.map((e) => e.name.toString()), !1) : this.renderPropertyPreview(t.type, "subtype" in t ? t.subtype : void 0, null, t.value);
	}
	formatParameterAsNode(e) {
		let t = document.createElement("span"), n = e.runtimeModel().target().model(ot);
		return n && n.pushObjectAsNodeToFrontend(e).then(async (n) => {
			if (!n) {
				t.appendChild(this.formatParameterAsObject(e, !1));
				return;
			}
			let r = await Ge.render(n);
			r ? (this.selectableChildren.push(r), r.element.addEventListener("dimensionschanged", () => {
				this.messageResized({ data: r.element });
			}), t.appendChild(r.element)) : t.appendChild(this.formatParameterAsObject(e, !1)), this.formattedParameterAsNodeForTest();
		}), t;
	}
	formattedParameterAsNodeForTest() {}
	formatParameterAsString(e) {
		let t = e.description ?? "", n = $t(t), r = document.createElement("span");
		return r.addEventListener("contextmenu", this.contextMenuEventFired.bind(this, e), !1), V(r, this.linkifyStringAsFragment(n)), r;
	}
	formatParameterAsError(e) {
		let t = document.createElement("span"), n = async (e, r) => {
			let i = ye.objectAsError(e), [a, o] = await Promise.all([i.exceptionDetails(), i.cause()]), s = this.tryFormatAsError(i.errorStack, a);
			if (s || (s = document.createElement("span"), V(s, this.linkifyStringAsFragment(i.errorStack))), r) {
				let e = document.createElement("div");
				e.append("Caused by: ", s), t.appendChild(e);
			} else t.appendChild(s);
			if (o?.subtype === "error") await n(o, !0);
			else if (o?.type === "string") {
				let e = document.createElement("div");
				e.append(`Caused by: ${o.value}`), t.append(e);
			}
		};
		return this.#n = n(e, !1), t;
	}
	formatAsArrayEntry(e) {
		return this.renderPropertyPreview(e.type, e.subtype, e.className, e.description);
	}
	renderPropertyPreview(e, t, n, r) {
		let i = document.createDocumentFragment();
		return ge(this.previewFormatter.renderPropertyPreview(e, t, n, r), i), i;
	}
	createRemoteObjectAccessorPropertySpan(e, t, n) {
		let r = document.createElement("span"), i = r.createChild("span");
		if (i.textContent = B(z.dots), !e) return r;
		i.classList.add("object-value-calculate-value-button"), b.install(i, B(z.invokePropertyGetter)), i.addEventListener("click", a, !1);
		function a(r) {
			r.consume(), e && e.callFunction(o, [{ value: JSON.stringify(t) }]).then(n);
		}
		function o(e) {
			let t = this, n = JSON.parse(e);
			for (let e = 0, r = n.length; e < r; ++e) t = t[n[e]];
			return t;
		}
		return r;
	}
	formatAsAccessorProperty(e, t, n) {
		let r = this.createRemoteObjectAccessorPropertySpan(e, t, i.bind(this));
		function i(e) {
			let t = e.wasThrown, i = e.object;
			if (i) {
				if (r.removeChildren(), t) {
					let e = r.createChild("span");
					e.textContent = B(z.exception), b.install(e, i.description);
				} else if (n) r.appendChild(this.formatAsArrayEntry(i));
				else {
					let e = i.type, t = i.subtype, n = "";
					e !== "function" && i.description && (n = e === "string" || t === "regexp" || t === "trustedtype" ? Xt(i.description, 100) : Zt(i.description, 100)), r.appendChild(this.renderPropertyPreview(e, t, i.className, n));
				}
			}
		}
		return r;
	}
	formatWithSubstitutionString(e, t, n) {
		let r = /* @__PURE__ */ new Map(), { tokens: i, args: a } = Fr(e, t);
		for (let e of i) switch (e.type) {
			case "generic":
				n.append(this.formatParameter(e.value, !0, !1));
				break;
			case "optimal":
				n.append(this.formatParameter(e.value, !1, !0));
				break;
			case "string":
				if (r.size === 0) V(n, this.linkifyStringAsFragment(e.value));
				else {
					let t = e.value.split("\n");
					for (let e = 0; e < t.length; e++) {
						e > 0 && n.append(document.createElement("br"));
						let i = document.createElement("span");
						i.style.setProperty("contain", "paint"), i.style.setProperty("display", "inline-block"), i.style.setProperty("max-width", "100%"), V(i, this.linkifyStringAsFragment(t[e]));
						for (let [e, { value: t, priority: n }] of r) i.style.setProperty(e, t, n);
						n.append(i);
					}
				}
				break;
			case "style": Lr(r, e.value);
		}
		return a;
	}
	matchesFilterRegex(e) {
		e.lastIndex = 0;
		let t = this.contentElement(), n = this.anchorElement ? this.anchorElement.deepTextContent() : "";
		return !!n && e.test(n.trim()) || e.test(t.deepTextContent().slice(n.length));
	}
	matchesFilterText(e) {
		return (this.contentElement().deepTextContent() + this.message.messageText).toLowerCase().includes(e.toLowerCase());
	}
	updateTimestamp() {
		this.contentElementInternal && (p.instance().moduleSetting("console-timestamps-enabled").get() ? (this.timestampElement || (this.timestampElement = document.createElement("span"), this.timestampElement.classList.add("console-timestamp")), this.timestampElement.textContent = me(this.message.timestamp, !1) + " ", b.install(this.timestampElement, me(this.message.timestamp, !0)), this.contentElementInternal.insertBefore(this.timestampElement, this.contentElementInternal.firstChild)) : this.timestampElement &&= (this.timestampElement.remove(), null));
	}
	nestingLevel() {
		let e = 0;
		for (let t = this.consoleGroup(); t !== null; t = t.consoleGroup()) e++;
		return e;
	}
	setConsoleGroup(e) {
		this.consoleGroupInternal = e;
	}
	clearConsoleGroup() {
		this.consoleGroupInternal = null;
	}
	consoleGroup() {
		return this.consoleGroupInternal;
	}
	isTraceExpanded() {
		return this.traceExpanded;
	}
	isExpandableTrace() {
		return this.hasStackTrace;
	}
	setTraceExpanded(e) {
		this.expandTrace && this.traceExpanded !== e && this.expandTrace(e);
	}
	setInSimilarGroup(e, t) {
		this.inSimilarGroup = e, this.lastInSimilarGroup = e && !!t, this.similarGroupMarker && !e ? (this.similarGroupMarker.remove(), this.similarGroupMarker = null) : this.elementInternal && !this.similarGroupMarker && e && (this.similarGroupMarker = document.createElement("div"), this.similarGroupMarker.classList.add("nesting-level-marker"), this.consoleRowWrapper?.insertBefore(this.similarGroupMarker, this.consoleRowWrapper.firstChild), this.similarGroupMarker.classList.toggle("group-closed", this.lastInSimilarGroup));
	}
	isLastInSimilarGroup() {
		return !!this.inSimilarGroup && !!this.lastInSimilarGroup;
	}
	resetCloseGroupDecorationCount() {
		this.closeGroupDecorationCount && (this.closeGroupDecorationCount = 0, this.updateCloseGroupDecorations());
	}
	incrementCloseGroupDecorationCount() {
		++this.closeGroupDecorationCount, this.updateCloseGroupDecorations();
	}
	updateCloseGroupDecorations() {
		if (this.nestingLevelMarkers) for (let e = 0, t = this.nestingLevelMarkers.length; e < t; ++e) this.nestingLevelMarkers[e].classList.toggle("group-closed", t - e <= this.closeGroupDecorationCount);
	}
	focusedChildIndex() {
		return this.selectableChildren.length ? this.selectableChildren.findIndex((e) => e.element.hasFocus()) : -1;
	}
	onKeyDown(e) {
		!De() && this.elementInternal && this.elementInternal.hasFocus() && !this.elementInternal.hasSelection() && this.maybeHandleOnKeyDown(e) && e.consume(!0);
	}
	maybeHandleOnKeyDown(e) {
		let t = this.focusedChildIndex(), n = t === -1;
		if (this.expandTrace && n && (e.key === "ArrowLeft" && this.traceExpanded || e.key === "ArrowRight" && !this.traceExpanded)) return this.expandTrace(!this.traceExpanded), !0;
		if (!this.selectableChildren.length) return !1;
		if (e.key === "ArrowLeft") return this.elementInternal?.focus(), !0;
		if (e.key === "ArrowRight" && n && this.selectNearestVisibleChild(0)) return !0;
		if (e.key === "ArrowUp") {
			let e = this.nearestVisibleChild(0);
			if (this.selectableChildren[t] === e && e) return this.elementInternal?.focus(), !0;
			if (this.selectNearestVisibleChild(t - 1, !0)) return !0;
		}
		return !!(e.key === "ArrowDown" && (n && this.selectNearestVisibleChild(0) || !n && this.selectNearestVisibleChild(t + 1)));
	}
	selectNearestVisibleChild(e, t) {
		let n = this.nearestVisibleChild(e, t);
		return n ? (n.forceSelect(), !0) : !1;
	}
	nearestVisibleChild(e, t) {
		let n = this.selectableChildren.length;
		if (e < 0 || e >= n) return null;
		let r = t ? -1 : 1, i = e;
		for (; !this.selectableChildren[i].element.offsetParent;) if (i += r, i < 0 || i >= n) return null;
		return this.selectableChildren[i];
	}
	focusLastChildOrSelf() {
		this.elementInternal && !this.selectNearestVisibleChild(this.selectableChildren.length - 1, !0) && this.elementInternal.focus();
	}
	setContentElement(e) {
		console.assert(!this.contentElementInternal, "Cannot set content element twice"), this.contentElementInternal = e;
	}
	getContentElement() {
		return this.contentElementInternal;
	}
	contentElement() {
		if (this.contentElementInternal) return this.contentElementInternal;
		let e = document.createElement("div");
		e.classList.add("console-message"), this.messageIcon && e.appendChild(this.messageIcon), this.contentElementInternal = e;
		let t = this.message.runtimeModel(), n, r = !!this.message.stackTrace && (this.message.source === h.LogEntrySource.Network || this.message.source === h.LogEntrySource.Violation || this.message.level === h.LogEntryLevel.Error || this.message.level === h.LogEntryLevel.Warning || this.message.type === T.ConsoleAPICalledEventType.Trace);
		return n = t && r ? this.buildMessageWithStackTrace(t) : this.buildMessageWithIgnoreLinks(), e.appendChild(n), this.updateTimestamp(), this.contentElementInternal;
	}
	#i() {
		if (this.elementInternal) {
			if (this.shouldShowTeaser()) {
				if (!this.#t) {
					let e = crypto.randomUUID();
					this.elementInternal.setAttribute("aria-details", `teaser-${e}`), this.#t = new zi(e, this), this.#t.show(this.elementInternal, this.consoleRowWrapper);
				}
				this.#t.maybeGenerateTeaser();
			} else this.#t?.detach(), this.#t = void 0;
		}
	}
	#a() {
		if (this.#t) {
			let { okToRemove: e } = this.#t.abortTeaserGeneration();
			e && (this.#t.detach(), this.#t = void 0);
		}
	}
	toMessageElement() {
		return this.elementInternal ? this.elementInternal : (this.elementInternal = document.createElement("div"), this.elementInternal.tabIndex = -1, this.elementInternal.addEventListener("keydown", this.onKeyDown.bind(this)), this.elementInternal.addEventListener("mouseenter", this.#i.bind(this)), this.elementInternal.addEventListener("focusin", this.#i.bind(this)), this.elementInternal.addEventListener("mouseleave", this.#a.bind(this)), this.elementInternal.addEventListener("focusout", this.#a.bind(this)), this.updateMessageElement(), this.elementInternal.classList.toggle("console-adjacent-user-command-result", this.#e), this.elementInternal);
	}
	updateMessageElement() {
		if (this.elementInternal) {
			this.elementInternal.className = "console-message-wrapper", this.elementInternal.setAttribute("jslog", `${Se("console-message").track({
				click: !0,
				resize: !0,
				keydown: "ArrowUp|ArrowDown|ArrowLeft|ArrowRight|Enter|Space|Home|End"
			})}`), this.elementInternal.removeChildren(), this.consoleRowWrapper = this.elementInternal.createChild("div"), this.consoleRowWrapper.classList.add("console-row-wrapper"), this.message.isGroupStartMessage() && this.elementInternal.classList.add("console-group-title"), this.message.source === r.ConsoleAPI && this.elementInternal.classList.add("console-from-api"), this.inSimilarGroup && (this.similarGroupMarker = this.consoleRowWrapper.createChild("div", "nesting-level-marker"), this.similarGroupMarker.classList.toggle("group-closed", this.lastInSimilarGroup)), this.nestingLevelMarkers = [];
			for (let e = 0; e < this.nestingLevel(); ++e) this.nestingLevelMarkers.push(this.consoleRowWrapper.createChild("div", "nesting-level-marker"));
			switch (this.updateCloseGroupDecorations(), Hr.set(this.elementInternal, this), this.message.level) {
				case h.LogEntryLevel.Verbose:
					this.elementInternal.classList.add("console-verbose-level"), _(this.elementInternal, this.text);
					break;
				case h.LogEntryLevel.Info:
					this.elementInternal.classList.add("console-info-level"), this.message.type === w.System && this.elementInternal.classList.add("console-system-type"), _(this.elementInternal, this.text);
					break;
				case h.LogEntryLevel.Warning:
					this.elementInternal.classList.add("console-warning-level"), this.elementInternal.role = "log", _(this.elementInternal, this.text);
					break;
				case h.LogEntryLevel.Error: this.elementInternal.classList.add("console-error-level"), this.elementInternal.role = "log", _(this.elementInternal, this.text);
			}
			this.updateMessageIcon(), this.shouldRenderAsWarning() && this.elementInternal.classList.add("console-warning-level"), this.consoleRowWrapper.appendChild(this.contentElement()), Dt.instance().hasAction(Kr) && this.shouldShowInsights() && (C.actionTaken(A.InsightConsoleMessageShown), this.consoleRowWrapper.append(this.#s())), this.repeatCountInternal > 1 && this.showRepeatCountElement();
		}
	}
	shouldShowInsights() {
		return this.message.source === r.ConsoleAPI && this.message.stackTrace?.callFrames[0]?.url === "" || this.message.messageText === "" || this.message.source === r.SELF_XSS ? !1 : this.message.level === h.LogEntryLevel.Error || this.message.level === h.LogEntryLevel.Warning;
	}
	shouldShowTeaser() {
		return !(!this.shouldShowInsights() || !p.instance().moduleSetting("console-insight-teasers-enabled").getIfNotDisabled() || !_n.instance().isEventuallyAvailable() || !d.instance().locale.startsWith("en-"));
	}
	getExplainLabel() {
		return this.message.level === h.LogEntryLevel.Error ? B(z.explainThisError) : this.message.level === h.LogEntryLevel.Warning ? B(z.explainThisWarning) : B(z.explainThisMessage);
	}
	#o() {
		return this.message.level === h.LogEntryLevel.Error ? B(z.explainThisErrorWithAI) : this.message.level === h.LogEntryLevel.Warning ? B(z.explainThisWarningWithAI) : B(z.explainThisMessageWithAI);
	}
	getExplainActionId() {
		return this.message.level === h.LogEntryLevel.Error ? qr : this.message.level === h.LogEntryLevel.Warning ? Jr : Yr;
	}
	#s() {
		let t = new D();
		t.name = "lightbulb-spark", t.style.color = "var(--devtools-icon-color)", t.classList.add("medium");
		let n = document.createElement("button");
		n.append(t), n.onclick = (t) => {
			t.stopPropagation(), S.instance().setFlavor(e, this), Dt.instance().getAction(Kr).execute();
		};
		let r = document.createElement("div");
		r.classList.add("button-label");
		let i = document.createElement("div");
		return i.setAttribute("data-text", this.getExplainLabel()), r.append(i), n.append(r), n.classList.add("hover-button"), n.ariaLabel = this.#o(), n.tabIndex = 0, n.setAttribute("jslog", `${ht(Kr).track({ click: !0 })}`), Xr.observe(n), n;
	}
	shouldRenderAsWarning() {
		return (this.message.level === h.LogEntryLevel.Verbose || this.message.level === h.LogEntryLevel.Info) && (this.message.source === h.LogEntrySource.Violation || this.message.source === h.LogEntrySource.Deprecation || this.message.source === h.LogEntrySource.Intervention || this.message.source === h.LogEntrySource.Recommendation);
	}
	updateMessageIcon() {
		this.messageIcon &&= (this.messageIcon.remove(), null);
		let e = "", t = "";
		this.message.level === h.LogEntryLevel.Warning ? (e = "warning-filled", t = B(z.warning)) : this.message.level === h.LogEntryLevel.Error ? (e = "cross-circle-filled", t = B(z.error)) : this.message.originatesFromLogpoint ? (e = "console-logpoint", t = B(z.logpoint)) : this.message.originatesFromConditionalBreakpoint && (e = "console-conditional-breakpoint", t = B(z.cndBreakpoint)), e && (this.messageIcon = new D(), this.messageIcon.name = e, this.messageIcon.style.color = "", this.messageIcon.classList.add("message-level-icon", "small"), this.contentElementInternal && this.contentElementInternal.insertBefore(this.messageIcon, this.contentElementInternal.firstChild), _(this.messageIcon, t));
	}
	setAdjacentUserCommandResult(e) {
		this.#e = e, this.elementInternal?.classList.toggle("console-adjacent-user-command-result", this.#e);
	}
	repeatCount() {
		return this.repeatCountInternal || 1;
	}
	resetIncrementRepeatCount() {
		this.repeatCountInternal = 1, this.repeatCountElement &&= (this.repeatCountElement.remove(), this.contentElementInternal && this.contentElementInternal.classList.remove("repeated-message"), null);
	}
	incrementRepeatCount() {
		this.repeatCountInternal++, this.showRepeatCountElement();
	}
	setRepeatCount(e) {
		this.repeatCountInternal = e, this.showRepeatCountElement();
	}
	showRepeatCountElement() {
		if (!this.elementInternal) return;
		if (!this.repeatCountElement) {
			switch (this.repeatCountElement = document.createElement("dt-small-bubble"), this.repeatCountElement.classList.add("console-message-repeat-count"), this.message.level) {
				case h.LogEntryLevel.Warning:
					this.repeatCountElement.type = "warning";
					break;
				case h.LogEntryLevel.Error:
					this.repeatCountElement.type = "error";
					break;
				case h.LogEntryLevel.Verbose:
					this.repeatCountElement.type = "verbose";
					break;
				default: this.repeatCountElement.type = "info";
			}
			this.shouldRenderAsWarning() && (this.repeatCountElement.type = "warning"), this.consoleRowWrapper?.insertBefore(this.repeatCountElement, this.contentElementInternal), this.contentElement().classList.add("repeated-message");
		}
		this.repeatCountElement.textContent = `${this.repeatCountInternal}`;
		let e;
		e = this.message.level === h.LogEntryLevel.Warning ? B(z.warningS, { n: this.repeatCountInternal }) : this.message.level === h.LogEntryLevel.Error ? B(z.errorS, { n: this.repeatCountInternal }) : B(z.repeatS, { n: this.repeatCountInternal }), _(this.repeatCountElement, e);
	}
	get text() {
		return this.message.messageText;
	}
	toExportString() {
		let e = [], t = this.contentElement().childTextNodes().map(N.untruncatedNodeText).join("");
		for (let n = 0; n < this.repeatCount(); ++n) e.push(t);
		return e.join("\n");
	}
	toMessageTextString() {
		let e = this.contentElement().querySelector(".console-message-text");
		return e ? e.deepTextContent().trim() : this.consoleMessage().messageText;
	}
	setSearchRegex(e) {
		if (this.searchHighlightNodeChanges?.length && kt(this.searchHighlightNodeChanges), this.searchRegexInternal = e, this.searchHighlightNodes = [], this.searchHighlightNodeChanges = [], !this.searchRegexInternal) return;
		let t = this.contentElement().deepTextContent(), n;
		this.searchRegexInternal.lastIndex = 0;
		let r = [];
		for (; (n = this.searchRegexInternal.exec(t)) && n[0];) r.push(new Jt(n.index, n[0].length));
		r.length && (this.searchHighlightNodes = Pt(this.contentElement(), r, ct, this.searchHighlightNodeChanges));
	}
	searchRegex() {
		return this.searchRegexInternal;
	}
	searchCount() {
		return this.searchHighlightNodes.length;
	}
	searchHighlightNode(e) {
		return this.searchHighlightNodes[e];
	}
	async getInlineFrames(e, t, n, r) {
		let i = on.instance(), a = sn.instance().projects().map((e) => e.uiSourceCodeForURL(t)).flat().filter((e) => !!e).map((e) => i.scriptsForUISourceCode(e)).flat();
		if (a.length) {
			let t = new mt(e, a[0].scriptId, n || 0, r), o = await i.pluginManager.getFunctionInfo(a[0], t);
			return o && "frames" in o ? o : { frames: [] };
		}
		return { frames: [] };
	}
	async expandInlineStackFrames(e, t, n, r, i, a, o, s) {
		let { frames: c } = await this.getInlineFrames(e, r, i, a);
		if (!c.length) return !1;
		for (let l = 0; l < c.length; ++l) {
			let { name: u } = c[l], d = document.createElement("span");
			V(d, this.linkifyStringAsFragment(`${t} ${u} (`));
			let f = this.linkifier.linkifyScriptLocation(e.target(), null, r, i, {
				columnNumber: a,
				inlineFrameIndex: l
			});
			f.tabIndex = -1, this.selectableChildren.push({
				element: f,
				forceSelect: () => f.focus()
			}), d.appendChild(f), V(d, this.linkifyStringAsFragment(n)), d.classList.add("formatted-stack-frame"), o.insertBefore(d, s);
		}
		return !0;
	}
	createScriptLocationLinkForSyntaxError(e, t) {
		let { scriptId: n, lineNumber: r, columnNumber: i } = t;
		if (!n) return;
		let a = t.url || e.scriptForId(n)?.sourceURL;
		if (!a) return;
		let o = this.linkifier.linkifyScriptLocation(e.target(), t.scriptId || null, a, r, {
			columnNumber: i,
			inlineFrameIndex: 0,
			showColumnNumber: !0
		});
		return o.tabIndex = -1, o;
	}
	tryFormatAsError(e, t) {
		let n = this.message.runtimeModel();
		if (!n) return null;
		let r = t?.exceptionMetaData?.issueSummary;
		typeof r == "string" && (e = cn(e, r));
		let i = en(n, e);
		if (!i?.length) return null;
		t?.stackTrace && nn(i, t.stackTrace);
		let a = n.debuggerModel(), o = document.createElement("span");
		for (let e = 0; e < i.length; ++e) {
			let n = e < i.length - 1 ? "\n" : "", { line: r, link: s, isCallFrame: c } = i[e];
			if (!s && t && r.startsWith("SyntaxError")) {
				V(o, this.linkifyStringAsFragment(r));
				let e = this.createScriptLocationLinkForSyntaxError(a, t);
				e && (o.append(" (at "), o.appendChild(e), o.append(")")), o.append(n);
				continue;
			}
			if (!c) {
				V(o, this.linkifyStringAsFragment(`${r}${n}`));
				continue;
			}
			let l = document.createElement("span");
			if (!s) {
				V(l, this.linkifyStringAsFragment(`${r}${n}`)), l.classList.add("formatted-builtin-stack-frame"), o.appendChild(l);
				continue;
			}
			let u = `${s.suffix}${n}`;
			V(l, this.linkifyStringAsFragment(s.prefix));
			let d = this.linkifier.linkifyScriptLocation(a.target(), s.scriptId || null, s.url, s.lineNumber, {
				columnNumber: s.columnNumber,
				inlineFrameIndex: 0,
				showColumnNumber: !0
			});
			if (d.tabIndex = -1, this.selectableChildren.push({
				element: d,
				forceSelect: () => d.focus()
			}), l.appendChild(d), V(l, this.linkifyStringAsFragment(u)), l.classList.add("formatted-stack-frame"), o.appendChild(l), !s.enclosedInBraces) continue;
			let f = s.prefix.substring(0, s.prefix.lastIndexOf(" ", s.prefix.length - 3)), ee = this.selectableChildren.length - 1;
			this.expandInlineStackFrames(a, f, u, s.url, s.lineNumber, s.columnNumber, o, l).then((e) => {
				e && (o.removeChild(l), this.selectableChildren.splice(ee, 1));
			});
		}
		return o;
	}
	linkifyWithCustomLinkifier(t, n) {
		if (t.length > si()) {
			let e = new Rn();
			return e.text = t, e.maxLength = li(), e;
		}
		let r = document.createDocumentFragment(), i = e.tokenizeMessageText(t), a = !1;
		for (let e of i) if (e.text) switch (a &&= (e.text = `blob:${e.text}`, !a), e.text === "'blob:" && e === i[0] && (a = !0, e.text = "'"), e.type) {
			case "url": {
				let t = e.text.startsWith("www.") ? "http://" + e.text : e.text, i = m.splitLineAndColumn(t), a = m.removeWasmFunctionInfoFromURL(i.url), o;
				o = i ? n(e.text, a, i.lineNumber, i.columnNumber) : n(e.text, ""), r.appendChild(o);
				break;
			}
			default: r.appendChild(document.createTextNode(e.text));
		}
		return r;
	}
	linkifyStringAsFragment(e) {
		return this.linkifyWithCustomLinkifier(e, (e, t, n, r) => {
			let i = {
				text: e,
				lineNumber: n,
				columnNumber: r
			}, a = N.linkifyURL(t, i);
			return a.tabIndex = -1, this.selectableChildren.push({
				element: a,
				forceSelect: () => a.focus()
			}), a;
		});
	}
	static tokenizeMessageText(e) {
		let { tokenizerRegexes: t, tokenizerTypes: n } = $r();
		return e.length > si() ? [{
			text: e,
			type: void 0
		}] : qt.splitStringByRegexes(e, t).map((e) => ({
			text: e.value,
			type: n[e.regexIndex]
		}));
	}
	groupKey() {
		return this.groupKeyInternal ||= this.message.groupCategoryKey() + ":" + this.groupTitle(), this.groupKeyInternal;
	}
	groupTitle() {
		return e.tokenizeMessageText(this.message.messageText).reduce((e, t) => {
			let n = t.text;
			return t.type === "url" ? n = B(z.url) : t.type === "time" ? n = B(z.tookNms) : t.type === "event" ? n = B(z.someEvent) : t.type === "milestone" ? n = B(z.Mxx) : t.type === "autofill" && (n = B(z.attribute)), e + n;
		}, "").replace(/[%]o/g, "");
	}
}, Zr = null, Qr = null;
function $r() {
	if (!Zr || !Qr) {
		let e = "\\u0000-\\u0020\\u007f-\\u009f", t = RegExp("(?:[a-zA-Z][a-zA-Z0-9+.-]{2,}:\\/\\/|data:|www\\.)[^\\s" + e + "\"]{2,}[^\\s" + e + "\"')}\\],:;.!?]", "u"), n = /(?:\/[\w\.-]*)+\:[\d]+/, r = /took [\d]+ms/, i = /'\w+' event/, a = /\sM[6-7]\d/, o = /\(suggested: \"[\w-]+\"\)/, s = /* @__PURE__ */ new Map();
		return s.set(t, "url"), s.set(n, "url"), s.set(r, "time"), s.set(i, "event"), s.set(a, "milestone"), s.set(o, "autofill"), Zr = Array.from(s.keys()), Qr = Array.from(s.values()), {
			tokenizerRegexes: Zr,
			tokenizerTypes: Qr
		};
	}
	return {
		tokenizerRegexes: Zr,
		tokenizerTypes: Qr
	};
}
var ei = class extends H {
	collapsedInternal;
	expandGroupIcon;
	onToggle;
	groupEndMessageInternal;
	constructor(e, t, n, r, i, a) {
		console.assert(e.isGroupStartMessage()), super(e, t, n, r, a), this.collapsedInternal = e.type === T.ConsoleAPICalledEventType.StartGroupCollapsed, this.expandGroupIcon = null, this.onToggle = i, this.groupEndMessageInternal = null;
	}
	setCollapsed(e) {
		this.setCollapsedSilent(e), this.onToggle.call(null);
	}
	setCollapsedSilent(e) {
		this.collapsedInternal = e, this.expandGroupIcon && (this.expandGroupIcon.name = this.collapsedInternal ? "triangle-right" : "triangle-down");
	}
	collapsed() {
		return this.collapsedInternal;
	}
	maybeHandleOnKeyDown(e) {
		return this.focusedChildIndex() === -1 && (e.key === "ArrowLeft" && !this.collapsedInternal || e.key === "ArrowRight" && this.collapsedInternal) ? (this.setCollapsed(!this.collapsedInternal), !0) : super.maybeHandleOnKeyDown(e);
	}
	toMessageElement() {
		let e = this.elementInternal || null;
		if (!e) {
			e = super.toMessageElement();
			let t = this.collapsedInternal ? "triangle-right" : "triangle-down";
			this.expandGroupIcon = Ce(t, "expand-group-icon"), this.contentElement().tabIndex = -1, this.repeatCountElement ? this.repeatCountElement.insertBefore(this.expandGroupIcon, this.repeatCountElement.firstChild) : this.consoleRowWrapper?.insertBefore(this.expandGroupIcon, this.contentElementInternal), e.addEventListener("click", () => this.setCollapsed(!this.collapsedInternal));
		}
		return e;
	}
	showRepeatCountElement() {
		super.showRepeatCountElement(), this.repeatCountElement && this.expandGroupIcon && this.repeatCountElement.insertBefore(this.expandGroupIcon, this.repeatCountElement.firstChild);
	}
	messagesHidden() {
		return this.collapsed() ? !0 : !!this.consoleGroup()?.messagesHidden();
	}
	setGroupEnd(e) {
		if (e.consoleMessage().type !== T.ConsoleAPICalledEventType.EndGroup) throw Error("Invalid console message as group end");
		if (this.groupEndMessageInternal !== null) throw Error("Console group already has an end");
		this.groupEndMessageInternal = e;
	}
	groupEnd() {
		return this.groupEndMessageInternal;
	}
}, ti = class extends H {
	formattedCommand;
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.formattedCommand = null;
	}
	contentElement() {
		let e = this.getContentElement();
		if (e) return e;
		let t = document.createElement("div");
		this.setContentElement(t), t.classList.add("console-user-command");
		let n = new D();
		return n.name = "chevron-right", n.classList.add("command-result-icon", "medium"), t.appendChild(n), Hr.set(t, this), this.formattedCommand = document.createElement("span"), this.formattedCommand.classList.add("source-code"), this.formattedCommand.textContent = Yt(this.text), t.appendChild(this.formattedCommand), this.formattedCommand.textContent.length < ii ? lr(this.formattedCommand, "text/javascript").then(this.updateSearch.bind(this)) : this.updateSearch(), this.updateTimestamp(), t;
	}
	updateSearch() {
		this.setSearchRegex(this.searchRegex());
	}
}, ni = class extends H {
	contentElement() {
		let e = super.contentElement();
		if (!e.classList.contains("console-user-command-result") && (e.classList.add("console-user-command-result"), this.consoleMessage().level === h.LogEntryLevel.Info)) {
			let t = new D();
			t.name = "chevron-left-dot", t.classList.add("command-result-icon", "medium"), e.insertBefore(t, e.firstChild);
		}
		return e;
	}
}, ri = class extends H {
	dataGrid;
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), console.assert(e.type === T.ConsoleAPICalledEventType.Table), this.dataGrid = null;
	}
	wasShown() {
		this.dataGrid && this.dataGrid.updateWidths(), super.wasShown();
	}
	onResize() {
		this.isVisible() && this.dataGrid && this.dataGrid.onResize();
	}
	contentElement() {
		let e = this.getContentElement();
		if (e) return e;
		let t = document.createElement("div");
		return t.classList.add("console-message"), this.messageIcon && t.appendChild(this.messageIcon), this.setContentElement(t), t.appendChild(this.buildTableMessage()), this.updateTimestamp(), t;
	}
	buildTableMessage() {
		let e = document.createElement("span");
		e.classList.add("source-code"), this.anchorElement = this.buildMessageAnchor(), this.anchorElement && e.appendChild(this.anchorElement);
		let t = this.message.parameters?.length ? this.message.parameters[0] : null;
		if (!t) return this.buildMessage();
		let n = Gr(this.message.runtimeModel())(t);
		if (!n?.preview) return this.buildMessage();
		let r = Symbol("rawValueColumn"), i = [], a = n.preview, o = [];
		for (let e = 0; e < a.properties.length; ++e) {
			let t = a.properties[e], s;
			if (t.valuePreview?.properties.length) s = t.valuePreview.properties;
			else if (t.value || t.value === "") s = [{
				name: r,
				type: t.type,
				value: t.value
			}];
			else continue;
			let c = /* @__PURE__ */ new Map();
			for (let e = 0; e < s.length; ++e) {
				let r = s[e], a = i.indexOf(r.name) !== -1;
				if (!a) {
					if (i.length === 20) continue;
					a = !0, i.push(r.name);
				}
				if (a) {
					let e = this.renderPropertyPreviewOrAccessor(n, r, [t, r]).firstElementChild;
					e.classList.add("console-message-nowrap-below"), c.set(r.name, e);
				}
			}
			o.push({
				rowName: t.name,
				rowValue: c
			});
		}
		let s = [];
		for (let { rowName: e, rowValue: t } of o) {
			s.push(e);
			for (let e = 0; e < i.length; ++e) s.push(t.get(i[e]));
		}
		i.unshift(B(z.index));
		let c = i.map((e) => e === r ? B(z.value) : e.toString());
		if (s.length && (this.dataGrid = yr.create(c, s, B(z.console)), this.dataGrid)) {
			this.dataGrid.setStriped(!0), this.dataGrid.setFocusable(!1);
			let t = document.createElement("span");
			t.classList.add("console-message-text");
			let r = t.createChild("div", "console-message-formatted-table"), i = r.createChild("span");
			r.appendChild(this.formatParameter(n, !0, !1));
			let a = i.attachShadow({ mode: "open" }), o = this.dataGrid.asWidget();
			o.markAsRoot(), o.show(a), o.registerRequiredCSS(zr, dr), e.appendChild(t), this.dataGrid.renderInline();
		}
		return e;
	}
	approximateFastHeight() {
		let e = this.message.parameters?.[0];
		return e && typeof e != "string" && e.preview ? Wr * e.preview.properties.length : Wr;
	}
}, ii = 1e4, ai = 1e4, oi = 5e3, si = () => ai, ci = (e) => {
	ai = e;
}, li = () => oi, ui = (e) => {
	oi = e;
}, di = /* @__PURE__ */ e({
	PromptBuilder: () => gi,
	SourceType: () => hi,
	allowHeader: () => _i,
	formatConsoleMessage: () => xi,
	formatNetworkRequest: () => bi,
	formatRelatedCode: () => vi,
	lineWhitespace: () => U
}), fi = 1e3, pi = 1e3, mi = 1e3, hi = /* @__PURE__ */ function(e) {
	return e.MESSAGE = "message", e.STACKTRACE = "stacktrace", e.NETWORK_REQUEST = "networkRequest", e.RELATED_CODE = "relatedCode", e;
}({}), gi = class {
	#e;
	constructor(e) {
		this.#e = e;
	}
	async getNetworkRequest() {
		let e = this.#e.consoleMessage().getAffectedResources()?.requestId;
		if (e) return gn.instance().requestsForId(e)[0];
	}
	async getMessageSourceCode() {
		let e = this.#e.consoleMessage().stackTrace?.callFrames[0], t = this.#e.consoleMessage().runtimeModel(), n = t?.debuggerModel();
		if (!n || !t || !e) return {
			text: "",
			columnNumber: 0,
			lineNumber: 0
		};
		let r = new mt(n, e.scriptId, e.lineNumber, e.columnNumber), i = await on.instance().rawLocationToUILocation(r), a = await i?.uiSourceCode.requestContentData().then((e) => Kt.asDeferredContent(e)), o = !a?.isEncoded && a?.content ? a.content : "", s = o.indexOf("\n");
		if (o.length > mi && (s < 0 || s > mi)) {
			let { formattedContent: e, formattedMapping: t } = await Ht(i?.uiSourceCode.mimeType() ?? "text/javascript", o), [n, r] = t.originalToFormatted(i?.lineNumber ?? 0, i?.columnNumber ?? 0);
			return {
				text: e,
				columnNumber: r,
				lineNumber: n
			};
		}
		return {
			text: o,
			columnNumber: i?.columnNumber ?? 0,
			lineNumber: i?.lineNumber ?? 0
		};
	}
	async buildPrompt(e = Object.values(hi)) {
		let [t, n] = await Promise.all([e.includes("relatedCode") ? this.getMessageSourceCode() : void 0, e.includes("networkRequest") ? this.getNetworkRequest() : void 0]), r = t?.text ? vi(t) : "", i = n ? bi(n) : "", a = e.includes("stacktrace") ? await Si(this.#e) : "", o = xi(this.#e), s = this.formatPrompt({
			message: [o, a].join("\n").trim(),
			relatedCode: r,
			relatedRequest: i
		}), c = [{
			type: "message",
			value: o
		}];
		return a && c.push({
			type: "stacktrace",
			value: a
		}), r && c.push({
			type: "relatedCode",
			value: r
		}), i && c.push({
			type: "networkRequest",
			value: i
		}), {
			prompt: s,
			sources: c,
			isPageReloadRecommended: e.includes("networkRequest") && !!this.#e.consoleMessage().getAffectedResources()?.requestId && !i
		};
	}
	formatPrompt({ message: e, relatedCode: t, relatedRequest: n }) {
		let r = `Please explain the following console error or warning:

\`\`\`
${e}
\`\`\``;
		return t && (r += `
For the following code:

\`\`\`
${t}
\`\`\``), n && (r += `
For the following network request:

\`\`\`
${n}
\`\`\``), r;
	}
	getSearchQuery() {
		let e = this.#e.toMessageTextString();
		return e &&= e.split("\n")[0], e;
	}
};
function _i(e) {
	let t = e.name.toLowerCase().trim();
	return !(t.startsWith("x-") || t === "cookie" || t === "set-cookie" || t === "authorization");
}
function U(e) {
	let t = /^\s*/.exec(e);
	if (!t?.length) return null;
	let n = t[0];
	return n === e ? null : n;
}
function vi({ text: e, columnNumber: t, lineNumber: n }, r = mi) {
	let i = e.split("\n");
	if (i[n].length >= r / 2) {
		let e = Math.max(t - r / 2, 0), a = Math.min(t + r / 2, i[n].length);
		return i[n].substring(e, a);
	}
	let a = 0, o = n, s = U(i[n]), c = /* @__PURE__ */ new Map();
	for (; i[o] !== void 0 && a + i[o].length <= r / 2;) {
		let e = U(i[o]);
		e !== null && s !== null && (e === s || !e.startsWith(s)) && (/^\s*[\}\)\]]/.exec(i[o]) || c.set(e, o), s = e), a += i[o].length + 1, o--;
	}
	o = n + 1;
	let l = n, u = n;
	for (s = U(i[n]); i[o] !== void 0 && a + i[o].length <= r;) {
		a += i[o].length;
		let e = U(i[o]);
		if (e !== null && s !== null && (e === s || !e.startsWith(s))) {
			let t = i[o + 1], n = t ? U(t) : null;
			(!n || n === e || !n.startsWith(e)) && c.has(e) && (l = c.get(e) ?? 0, u = o), s = e;
		}
		o++;
	}
	return i.slice(l, u + 1).join("\n");
}
function yi(e, t, n) {
	let r = "";
	for (let e of t) {
		if (r.length + e.length > n) break;
		r += e;
	}
	return r = r.trim(), r && e ? e + "\n" + r : r;
}
function bi(e) {
	return `Request: ${e.url()}

${fn.formatHeaders("Request headers:", e.requestHeaders())}

${fn.formatHeaders("Response headers:", e.responseHeaders)}

Response status: ${e.statusCode} ${e.statusText}`;
}
function xi(e) {
	return e.toMessageTextString().substr(0, fi);
}
async function Si(e) {
	let t = e.contentElement().querySelector(".stack-preview-container");
	if (!t) return "";
	let n = k.get(t);
	return n ? (await n.updateComplete, yi("", n.contentElement.querySelector(".stack-preview-container").childTextNodes().filter((e) => !e.parentElement?.closest(".show-all-link,.show-less-link,.hidden-row")).map(N.untruncatedNodeText), pi)) : "";
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/console/ConsoleInsightTeaser.ts
var Ci = /* @__PURE__ */ e({
	ConsoleInsightTeaser: () => zi,
	DEFAULT_VIEW: () => Ri
}), { render: wi, html: W, Directives: { ref: Ti } } = we, Ei = "https://developer.chrome.com/docs/ai/built-in", G = {
	learnMore: "Learn more",
	learnMoreAboutAiSummaries: "Learn more about AI summaries",
	freDisclaimerHeader: "Get explanations for console warnings and errors",
	freDisclaimerTextAiWontAlwaysGetItRight: "This feature uses AI and won’t always get it right",
	consoleInsightsSendsData: "To generate explanations, the console message, associated stack trace, related source code, and the associated network headers are sent to Google. This data may be seen by human reviewers to improve this feature.",
	consoleInsightsSendsDataNoLogging: "To generate explanations, the console message, associated stack trace, related source code, and the associated network headers are sent to Google. This data will not be used to improve Google’s AI models. Your organization may change these settings at any time.",
	freDisclaimerTextUseWithCaution: "Use generated code snippets with caution",
	infoTooltipText: "The text above has been generated with AI on your local device. Clicking the button will send the console message, stack trace, related source code, and the associated network headers to Google to generate a more detailed explanation.",
	summarizing: "Summarizing…",
	summarizingTakesABitLonger: "Summarizing takes a bit longer…",
	loading: "Loading",
	tellMeMore: "Tell me more",
	dontShow: "Don’t show",
	learnDataUsage: "Learn more about how your data is used",
	summaryNotAvailable: "Summary not available",
	getHelpForWarning: "Get help understanding this warning",
	getHelpForError: "Get help understanding this error",
	toUseDownload: "To use Chrome’s Built-in AI here and elsewhere, download the AI model (~4 GB).",
	downloadModel: "Download model",
	downloadingAiModel: "Downloading AI model",
	progress: "Progress",
	progressUnknown: "Progress: unknown"
}, K = l, Di = "https://support.google.com/legal/answer/13505487", Oi = "https://developer.chrome.com/docs/devtools/ai-assistance/get-started#data-use", ki = "explain.console-message.teaser", Ai = 3500;
function ji(e) {
	return W`
    <div class="teaser-tooltip-container">
      <div class="response-container">
        <h2>${e.isForWarning ? K(G.getHelpForWarning) : K(G.getHelpForError)}
        </h2>
        <div>You can get quick answers from <devtools-link
            jslogcontext="insights-teaser-built-in-ai-documentation"
            class="link"
            href=${Ei}
          >
            Chrome’s Built-in AI
          </devtools-link>
          , without any data leaving your device.
        </div>
        <div>${K(G.toUseDownload)}</div>
      </div>
      <div class="tooltip-footer">
        <devtools-button
          title=${K(G.downloadModel)}
          .jslogContext=${"insights-teaser-download-model"}
          .variant=${se.PRIMARY}
          @click=${e.onDownloadModelClick}
          @focusout=${(e) => {
		e.stopPropagation();
	}}
        >
          ${K(G.downloadModel)}
        </devtools-button>
        ${Fi(e)}
      </div>
    </div>
  `;
}
function Mi(e) {
	let t = ((e.downloadProgress || 0) * 100).toFixed(0);
	return W`
    <div class="teaser-tooltip-container">
      <div class="response-container">
        <h2>${K(G.downloadingAiModel)}</h2>
        <div class="progress-line">
          ${e.downloadProgress === null ? W`
              <div class="label">${K(G.progressUnknown)}</div>
            ` : W`
              <div class="label">${K(G.progress)}</div>
              <div class="indicator-container">
                <div
                  class="indicator"
                  role="progressbar"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow=${t}
                  style="width: ${t}%"
                ></div>
              </div>
          `}
        </div>
      </div>
      <div class="tooltip-footer">
        <devtools-button
          title=${K(G.downloadModel)}
          .jslogContext=${"insights-teaser-download-model"}
          .variant=${se.PRIMARY}
          .disabled=${!0}
        >
          ${K(G.downloadModel)}
        </devtools-button>
      </div>
    </div>
  `;
}
function Ni(e) {
	return W`
    <div class="teaser-tooltip-container">
      <div class="response-container">
        <h2>${e.isSlowGeneration ? K(G.summarizingTakesABitLonger) : K(G.summarizing)}</h2>
        <div
          role="presentation"
          aria-label=${K(G.loading)}
          class="loader"
          style="clip-path: url(${"#clipPath-" + e.uuid});"
        >
          <svg width="100%" height="58">
            <defs>
            <clipPath id=${"clipPath-" + e.uuid}>
              <rect x="0" y="0" width="100%" height="12" rx="8"></rect>
              <rect x="0" y="20" width="100%" height="12" rx="8"></rect>
              <rect x="0" y="40" width="100%" height="12" rx="8"></rect>
            </clipPath>
          </defs>
          </svg>
        </div>
      </div>
      ${Ii(e)}
    </div>
  `;
}
function Pi(e) {
	return W`
    <div class="teaser-tooltip-container">
      <h2>${K(G.summaryNotAvailable)}</h2>
      ${Ii(e)}
    </div>
  `;
}
function Fi(e) {
	return W`
    <devtools-checkbox
      aria-label=${K(G.dontShow)}
      @change=${e.dontShowChanged}
      jslog=${ut("explain.teaser.dont-show").track({ change: !0 })}>
      ${K(G.dontShow)}
    </devtools-checkbox>
  `;
}
function Ii(e) {
	return W`
    <div class="tooltip-footer">
      ${e.hasTellMeMoreButton ? W`
        <devtools-button
          title=${K(G.tellMeMore)}
          .jslogContext=${"insights-teaser-tell-me-more"}
          .variant=${se.PRIMARY}
          @click=${e.onTellMeMoreClick}
        >
          <devtools-icon class="lightbulb-icon" name="lightbulb-spark"></devtools-icon>
          ${K(G.tellMeMore)}
        </devtools-button>
      ` : Qe}
      <devtools-button
        .iconName=${"info"}
        .variant=${se.ICON}
        aria-details=${"teaser-info-tooltip-" + e.uuid}
        .accessibleLabel=${K(G.learnDataUsage)}
      ></devtools-button>
      <devtools-tooltip
        id=${"teaser-info-tooltip-" + e.uuid}
        variant="rich"
        jslogContext="teaser-info-tooltip"
        trigger="both"
        hover-delay=500
      >
        <div class="info-tooltip-text">${K(G.infoTooltipText)}</div>
        <div class="learn-more">
          <devtools-link
            class="devtools-link"
            title=${K(G.learnMoreAboutAiSummaries)}
            href=${Oi}
            jslogcontext="explain.teaser.learn-more"
          >${K(G.learnMoreAboutAiSummaries)}</devtools-link>
        </div>
      </devtools-tooltip>
      ${Fi(e)}
    </div>
  `;
}
function Li(e) {
	return W`
    <div class="teaser-tooltip-container">
      <div class="response-container">
        <h2>${e.headerText}</h2>
        <div class="main-text">${e.mainText}</div>
      </div>
      ${Ii(e)}
    </div>
  `;
}
var Ri = (e, t, n) => {
	if (e.isInactive) {
		wi(Qe, n);
		return;
	}
	wi(W`
    <style>${Rr}</style>
    <devtools-tooltip
      ${Ti((e) => {
		t.tooltip = e;
	})}
      id=${"teaser-" + e.uuid}
      hover-delay=1000
      variant="rich"
      vertical-distance-increase=-6
      prefer-span-left
      jslogContext="console-insight-teaser"
    >
      ${(() => {
		switch (e.state) {
			case "no-model": return ji(e);
			case "downloading": return Mi(e);
			case "ready":
			case "generating": return Ni(e);
			case "error": return Pi(e);
			case "partial-teaser":
			case "teaser": return Li(e);
		}
	})()}
    </devtools-tooltip>
  `, n);
}, zi = class extends k {
	#e;
	#t;
	#n;
	#r;
	#i = "";
	#a = "";
	#o;
	#s = !1;
	#c = null;
	#l = !1;
	#u = null;
	#d;
	#f;
	#p;
	#m;
	#h = null;
	#g;
	#_ = [];
	#v;
	#y = !1;
	#b = 0;
	constructor(e, t, n, r) {
		super(n), this.#e = r ?? Ri, this.#t = e, this.#r = new gi(t), this.#o = t, this.#v = this.#o.consoleMessage().level === h.LogEntryLevel.Warning, this.#f = this.#C.bind(this), this.#p = this.#D.bind(this), this.#m = this.#O.bind(this), this.#n = _n.instance(), this.#g = this.#n.hasSession() ? "ready" : "no-model", this.#y = !0, this.requestUpdate();
	}
	#x() {
		try {
			return te("console-insights-enabled");
		} catch {
			return;
		}
	}
	#S() {
		return p.instance().createLocalSetting("console-insights-onboarding-finished", !0);
	}
	async #C() {
		let e = await Le.checkAccessPreconditions();
		e !== this.#d && (this.#d = e, this.requestUpdate());
	}
	#w() {
		S.instance().setFlavor(H, this.#o), Dt.instance().getAction(ki).execute();
	}
	#T(e) {
		if (e.stopPropagation(), this.#x()?.getIfNotDisabled() && this.#S()?.getIfNotDisabled()) {
			this.#w();
			return;
		}
		this.#k();
	}
	#E(e) {
		e.stopPropagation(), this.#g = "downloading", this.#n.startDownloadingModel(), C.actionTaken(A.InsightTeaserModelDownloadStarted), this.requestUpdate();
	}
	#D(e) {
		this.#h = e.data, this.requestUpdate();
	}
	#O() {
		this.#n.hasSession() && (this.#g === "no-model" || this.#g === "downloading") && (this.#g = "ready", C.actionTaken(A.InsightTeaserModelDownloadCompleted), this.maybeGenerateTeaser());
	}
	async #k() {
		let e = Ut.aidaAvailability?.enterprisePolicyValue === Wt.ALLOW_WITHOUT_LOGGING, t = pn();
		await yn.show({
			header: {
				iconName: t,
				text: K(G.freDisclaimerHeader)
			},
			reminderItems: [
				{
					iconName: "psychiatry",
					content: K(G.freDisclaimerTextAiWontAlwaysGetItRight)
				},
				{
					iconName: "google",
					content: K(e ? G.consoleInsightsSendsDataNoLogging : G.consoleInsightsSendsData)
				},
				{
					iconName: "warning",
					content: W`<devtools-link
            href=${Di}
            class="link devtools-link"
            jslogcontext="explain.teaser.code-snippets-explainer"
          >${K(G.freDisclaimerTextUseWithCaution)}</devtools-link>`
				}
			],
			onLearnMoreClick: () => {
				yt.instance().showView("chrome-ai");
			},
			ariaLabel: K(G.freDisclaimerHeader),
			learnMoreButtonText: K(G.learnMore)
		}) && (this.#x()?.set(!0), this.#S()?.set(!0), this.#w());
	}
	maybeGenerateTeaser() {
		let e = () => {
			!this.#s && p.instance().moduleSetting("console-insight-teasers-enabled").get() && this.#j();
		}, t = this.#n.hasSession();
		switch (this.#g) {
			case "no-model":
			case "downloading":
				t ? (this.#g = "ready", e()) : (this.#_.length === 0 && (this.#_ = [this.#n.addEventListener(bn.DOWNLOAD_PROGRESS_CHANGED, this.#p), this.#n.addEventListener(bn.DOWNLOADED_AND_SESSION_CREATED, this.#m)]), this.#n.isDownloading() && (this.#g = "downloading", this.#h = this.#n.getDownloadProgress())), this.requestUpdate();
				return;
			case "ready":
				e(), this.requestUpdate();
				return;
			case "generating":
				console.error("Trying trigger teaser generation when state is \"GENERATING\"");
				return;
			case "partial-teaser":
				console.error("Trying trigger teaser generation when state is \"PARTIAL_TEASER\"");
				return;
			case "teaser":
			case "error": return;
		}
	}
	abortTeaserGeneration() {
		return this.#c && this.#c.abort(), (this.#g === "generating" || this.#g === "partial-teaser") && (this.#b && (this.#a ? C.consoleInsightTeaserAbortedAfterFirstCharacter(performance.now() - this.#b) : C.consoleInsightTeaserAbortedBeforeFirstCharacter(performance.now() - this.#b)), this.#a = "", this.#g = "ready", C.actionTaken(A.InsightTeaserGenerationAborted)), this.#u && clearTimeout(this.#u), tt(this.#_), { okToRemove: this.#g !== "teaser" };
	}
	setInactive(e) {
		this.#s !== e && (this.#s = e, this.requestUpdate());
	}
	#A() {
		this.#l = !0, this.requestUpdate();
	}
	async #j() {
		this.#i = this.#o.toMessageTextString().substring(0, 70), this.#g = "generating", C.actionTaken(A.InsightTeaserGenerationStarted), this.#u = setTimeout(this.#A.bind(this), Ai), this.#b = performance.now();
		let e = "", t = !1, n = 0;
		try {
			for await (let r of this.#M()) e += r, this.#a = e, this.#g = "partial-teaser", this.requestUpdate(), t || (t = !0, n = performance.now(), C.consoleInsightTeaserFirstChunkGenerated(n - this.#b), C.consoleInsightTeaserFirstChunkGeneratedMedium(n - this.#b));
		} catch (e) {
			e.name === "AbortError" ? this.#g = "ready" : (console.error(e.name, e.message), this.#g = "error", C.actionTaken(A.InsightTeaserGenerationErrored)), clearTimeout(this.#u), this.requestUpdate();
			return;
		}
		clearTimeout(this.#u);
		let r = performance.now() - this.#b;
		C.consoleInsightTeaserGenerated(r), C.consoleInsightTeaserGeneratedMedium(r), C.consoleInsightTeaserChunkToEndMedium(performance.now() - n), e.length > 300 ? C.consoleInsightLongTeaserGenerated(r) : C.consoleInsightShortTeaserGenerated(r), this.#g = "teaser", this.#a = e, C.actionTaken(A.InsightTeaserGenerationCompleted), this.requestUpdate();
	}
	async *#M() {
		let { prompt: e } = await this.#r.buildPrompt();
		this.#c = new AbortController();
		let t = this.#n.getConsoleInsight(e, this.#c);
		for await (let e of t) yield e;
		this.#c = null;
	}
	#N(e) {
		let t = !e.target.checked;
		p.instance().moduleSetting("console-insight-teasers-enabled").set(t);
	}
	#P() {
		return !(!Dt.instance().hasAction(ki) || Ut.aidaAvailability?.blockedByAge || Ut.isOffTheRecord || this.#d !== oe.AVAILABLE);
	}
	performUpdate() {
		let e = {};
		this.#e({
			onTellMeMoreClick: this.#T.bind(this),
			uuid: this.#t,
			headerText: this.#i,
			mainText: this.#a,
			isInactive: this.#s || !p.instance().moduleSetting("console-insight-teasers-enabled").get(),
			dontShowChanged: this.#N.bind(this),
			hasTellMeMoreButton: this.#P(),
			isSlowGeneration: this.#l,
			onDownloadModelClick: this.#E.bind(this),
			downloadProgress: this.#h,
			state: this.#g,
			isForWarning: this.#v
		}, e, this.contentElement), this.#y && e.tooltip?.hasAttribute("popover") && e.tooltip.showTooltip(), this.#y = !1;
	}
	wasShown() {
		super.wasShown(), Re.instance().addEventListener(Fe.AIDA_AVAILABILITY_CHANGED, this.#f), this.#C();
	}
	willHide() {
		super.willHide(), Re.instance().removeEventListener(Fe.AIDA_AVAILABILITY_CHANGED, this.#f);
	}
}, Bi = "/*\n * Copyright 2018 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.close-button {\n  position: absolute;\n  top: var(--sys-size-4);\n  left: var(--sys-size-2);\n}\n\n.console-pins {\n  max-height: 200px;\n  overflow-y: auto;\n  background: var(--sys-color-cdt-base-container);\n\n  --override-error-text-color: var(--sys-color-on-error-container);\n}\n\n.console-pins:not(:empty) {\n  border-bottom: 1px solid var(--sys-color-divider);\n}\n\n.console-pin {\n  position: relative;\n  user-select: text;\n  flex: none;\n  padding: 2px 0 6px 24px;\n}\n\n.console-pin:not(:last-child) {\n  border-bottom: 1px solid var(--sys-color-divider);\n}\n\n.console-pin.error-level:not(:focus-within) {\n  background-color: var(--sys-color-surface-error);\n  color: var(--override-error-text-color);\n}\n\n.console-pin:not(:last-child).error-level:not(:focus-within) {\n  border-top: 1px solid var(--sys-color-error-outline);\n  border-bottom: 1px solid var(--sys-color-error-outline);\n  margin-top: -1px;\n}\n\n.console-pin-name {\n  margin-left: -5px;\n  margin-bottom: 1px;\n  height: auto;\n}\n\n.console-pin-name,\n.console-pin-preview {\n  width: 100%;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  min-height: 13px;\n}\n\n.console-pin-preview {\n  overflow: hidden;\n}\n\n.console-pin-name:focus-within {\n  background: var(--sys-color-cdt-base-container);\n  border-radius: 4px;\n  border: 1px solid var(--sys-color-state-focus-ring);\n}\n\n.console-pin:focus-within .console-pin-preview,\n.console-pin-name:not(:focus-within, :hover) {\n  opacity: 60%;\n}\n", Vi = /* @__PURE__ */ e({
	ConsolePin: () => ea,
	ConsolePinEvent: () => ta,
	ConsolePinModel: () => $i,
	ConsolePinPane: () => Ji,
	ConsolePinPresenter: () => Qi,
	DEFAULT_PANE_VIEW: () => qi,
	DEFAULT_VIEW: () => Yi
}), { createRef: Hi, ref: Ui, repeat: Wi } = Be, { widget: Gi } = vt, q = {
	removeExpression: "Remove expression",
	removeAllExpressions: "Remove all expressions",
	removeExpressionS: "Remove expression: {PH1}",
	removeBlankExpression: "Remove blank expression",
	liveExpressionEditor: "Live expression editor",
	expression: "Expression",
	evaluateAllowingSideEffects: "Evaluate, allowing side effects",
	notAvailable: "not available",
	doYouTrustThisCode: "Do you trust this code?",
	doNotPaste: "Don't paste code you do not understand or have not reviewed yourself into DevTools. This could allow attackers to steal your identity or take control of your computer. Please type “{PH1}” below to allow pasting.",
	allowPasting: "allow pasting",
	typeAllowPasting: "Type “{PH1}”"
}, Ki = o("panels/console/ConsolePinPane.ts", q), J = a.bind(void 0, Ki), qi = (e, t, n) => {
	ge(Oe`
    <style>${Bi}</style>
    <div class='console-pins monospace' jslog=${jt("console-pins")} @contextmenu=${e.onContextMenu}>
    ${Wi(e.pins, (e) => e, (t) => Gi(Qi, {
		pin: t,
		focusOut: e.focusOut,
		onRemove: () => e.onRemove(t)
	}))}
    </div>`, n);
}, Ji = class extends at {
	#e;
	#t;
	#n;
	#r;
	constructor(e, t = qi) {
		super({ useShadowDom: !0 }), this.#r = e, this.#e = t, this.#n = new $i(p.instance());
	}
	willHide() {
		super.willHide(), this.#n.stopPeriodicEvaluate();
	}
	contextMenuEventFired(e) {
		let t = new nt(e), n = fe(e);
		if (n) {
			let e = n.enclosingNodeOrSelfWithClass("widget");
			if (e) {
				let n = k.get(e);
				n instanceof Qi && (t.editSection().appendItem(J(q.removeExpression), () => n.pin ? this.removePin(n.pin) : void 0, { jslogContext: "remove-expression" }), n.appendToContextMenu(t));
			}
		}
		t.editSection().appendItem(J(q.removeAllExpressions), this.removeAllPins.bind(this), { jslogContext: "remove-all-expressions" }), t.show();
	}
	removeAllPins() {
		this.#n.removeAll(), this.requestUpdate();
	}
	removePin(e) {
		this.#n.remove(e), this.requestUpdate();
	}
	addPin(e, t) {
		let n = this.#n.add(e);
		t && (this.#t = n), this.requestUpdate();
	}
	wasShown() {
		super.wasShown(), this.#n.startPeriodicEvaluate(), this.requestUpdate();
	}
	performUpdate() {
		this.#e({
			pins: [...this.#n.pins],
			focusOut: this.#r,
			onRemove: (e) => this.removePin(e),
			onContextMenu: this.contextMenuEventFired.bind(this)
		}, {}, this.contentElement);
		for (let e of this.children()) e instanceof Qi && e.pin === this.#t && e.updateComplete.then(() => e.focus());
		this.#t = void 0;
	}
}, Yi = (e, n, r) => {
	let i = e.expression ? J(q.removeExpressionS, { PH1: e.expression }) : J(q.removeBlankExpression), a = Hi(), o = Hi(), s = e.result && !("error" in e.result) && e.result?.exceptionDetails && !g.isSideEffectFailure(e.result);
	ge(Oe`
    <style>${Bi}</style>
    <style>${dr}</style>
    <div class='console-pin ${s ? "error-level" : ""}'>
      <devtools-button class='close-button'
          .iconName=${"cross"}
          .variant=${se.ICON}
          .size=${Ze.MICRO}
          tabindex=0
          aria-label=${i}
          @click=${(t) => {
		e.onDelete(), t.consume(!0);
	}}
          @keydown=${(n) => {
		t(n) && (e.onDelete(), n.consume(!0));
	}}
          ${Ui(a)}
      ></devtools-button>
      <div class='console-pin-name'
          title=${e.expression}
          jslog=${It().track({ change: !0 })}
          @keydown=${(e) => {
		e.key === "Escape" && e.consume();
	}}
      >
        <devtools-text-editor .state=${e.editorState} ${Ui(o)} tabindex=0
        ></devtools-text-editor>
      </div>
      <div class='console-pin-preview'
          @mouseenter=${() => e.onPreviewHoverChange(!0)}
          @mouseleave=${() => e.onPreviewHoverChange(!1)}
          @click=${(t) => e.onPreviewClick(t)}
      >
        ${Zi(e.result, e.isEditing)}
      </div>
    </div>
    `, r), Object.assign(n, {
		deletePinIcon: a.value,
		editor: o.value
	});
}, Xi = new zn();
function Zi(e, t) {
	if (!e) return Qe;
	if (e && g.isSideEffectFailure(e)) return Oe`<span class='object-value-calculate-value-button' title=${J(q.evaluateAllowingSideEffects)}>(…)</span>`;
	let n = Xi.renderEvaluationResultPreview(e, !t);
	return n === Qe && !t ? Oe`${J(q.notAvailable)}` : n;
}
var Qi = class extends k {
	#e;
	#t;
	#n;
	#r;
	#i;
	#a;
	#o = !1;
	#s = null;
	#c;
	#l;
	constructor(e, t = Yi) {
		super(e), this.#r = t, this.#l = p.instance().createSetting("disable-self-xss-warning", !1, re.SYNCED), this.#i = {
			workingCopy: () => this.#a?.state.doc.toString() ?? "",
			workingCopyWithHint: () => this.#a ? Kn(this.#a.editor) : "",
			isEditing: () => !!this.#a?.editor.hasFocus
		};
	}
	wasShown() {
		super.wasShown(), this.#e?.addEventListener("EVALUATE_RESULT_READY", this.requestUpdate, this), this.requestUpdate();
	}
	willHide() {
		super.willHide(), this.#e?.removeEventListener("EVALUATE_RESULT_READY", this.requestUpdate, this), this.setHovered(!1);
	}
	set pin(e) {
		this.#e?.removeEventListener("EVALUATE_RESULT_READY", this.requestUpdate, this), this.#e = e, this.#a = void 0, this.#e.setEditor(this.#i), this.#e.addEventListener("EVALUATE_RESULT_READY", this.requestUpdate, this), this.requestUpdate();
	}
	get pin() {
		return this.#e;
	}
	set focusOut(e) {
		this.#t = e;
	}
	set onRemove(e) {
		this.#n = e;
	}
	#u(e) {
		let t = [
			P.contentAttributes.of({ "aria-label": J(q.liveExpressionEditor) }),
			P.lineWrapping,
			Ln.javascriptLanguage,
			Wn,
			Pn(J(q.expression)),
			Nn.of([
				{
					key: "Escape",
					run: (e) => (e.dispatch({ changes: {
						from: 0,
						to: e.state.doc.length,
						insert: this.#e?.expression ?? ""
					} }), this.#t?.(), !0)
				},
				{
					key: "Enter",
					run: () => (this.#t?.(), !0)
				},
				{
					key: "Mod-Enter",
					run: () => (this.#t?.(), !0)
				},
				{
					key: "Tab",
					run: (e) => On(e.state) === null && (e.dispatch({ changes: {
						from: 0,
						to: e.state.doc.length,
						insert: this.#e?.expression ?? ""
					} }), this.#t?.(), !0)
				},
				{
					key: "Shift-Tab",
					run: (e) => On(e.state) === null && (e.dispatch({ changes: {
						from: 0,
						to: e.state.doc.length,
						insert: this.#e?.expression ?? ""
					} }), this.#a?.blur(), this.#c.focus(), !0)
				}
			]),
			P.domEventHandlers({
				blur: (e, t) => this.#d(t),
				paste: () => this.#f()
			}),
			sr(e),
			Gn.instance(),
			Yn.instance()
		];
		return M.queryParam("noJavaScriptCompletion") !== "true" && t.push(Xn()), Dn.create({
			doc: e,
			extensions: t
		});
	}
	#d(e) {
		if (!this.#e) return;
		let t = this.#e.commit();
		e.dispatch({
			selection: { anchor: this.#e.expression.length },
			changes: t ? void 0 : {
				from: 0,
				to: e.state.doc.length,
				insert: this.#e.expression
			}
		}), this.requestUpdate();
	}
	#f() {
		return M.queryParam("isChromeForTesting") || M.queryParam("disableSelfXssWarnings") || this.#l.get() ? !1 : (this.#p(), !0);
	}
	async #p() {
		await Sn.show({
			jslogContext: {
				dialog: "self-xss-warning",
				input: "allow-pasting"
			},
			header: J(q.doYouTrustThisCode),
			message: J(q.doNotPaste, { PH1: J(q.allowPasting) }),
			typePhrase: J(q.allowPasting),
			inputPlaceholder: J(q.typeAllowPasting, { PH1: J(q.allowPasting) })
		}) && (this.#l.set(!0), C.actionTaken(A.SelfXssAllowPastingInDialog));
	}
	setHovered(e) {
		this.#o !== e && (this.#o = e, !e && this.#s && O.hideDOMNodeHighlight());
	}
	async focus() {
		let e = this.#a;
		e && (e.editor.focus(), e.dispatch({ selection: { anchor: e.state.doc.length } }));
	}
	appendToContextMenu(e) {
		if (!this.#e) return;
		let { lastResult: t } = this.#e;
		t && !("error" in t) && t.object && (e.appendApplicableItems(t.object), this.#e.skipReleaseLastResult());
	}
	performUpdate() {
		if (!this.#e) return;
		let e = {};
		this.#r({
			expression: this.#e.expression,
			editorState: this.#a?.state ?? this.#u(this.#e.expression),
			result: this.#e.lastResult,
			isEditing: this.#i.isEditing(),
			onDelete: () => this.#n?.(),
			onPreviewHoverChange: (e) => this.setHovered(e),
			onPreviewClick: (e) => {
				this.#s && (i(this.#s), e.consume());
			}
		}, e, this.contentElement);
		let { deletePinIcon: t, editor: n } = e;
		if (!t || !n) throw Error("Broken view function, expected output");
		this.#c = t, this.#a = n;
		let r = this.#e.lastNode;
		this.#o && (r ? O.highlightObjectAsDOMNode(r) : this.#s && O.hideDOMNodeHighlight()), this.#s = r || null;
	}
}, $i = class {
	#e;
	#t = /* @__PURE__ */ new Set();
	#n = new dt(250);
	#r = !1;
	constructor(e) {
		this.#e = e.createLocalSetting("console-pins", []);
		for (let e of this.#e.get()) this.add(e);
	}
	get pins() {
		return this.#t;
	}
	add(e) {
		let t = new ea(e, () => this.#a());
		return this.#t.add(t), this.#a(), t;
	}
	remove(e) {
		this.#t.delete(e), this.#a();
	}
	removeAll() {
		this.#t.clear(), this.#a();
	}
	startPeriodicEvaluate() {
		this.#r = !0, this.#i();
	}
	stopPeriodicEvaluate() {
		this.#r = !1;
	}
	async #i() {
		if (!this.#r) return;
		let e = S.instance().flavor(y);
		e && await Promise.all(this.#t.values().map((t) => t.evaluate(e))), this.#n.schedule(this.#i.bind(this));
	}
	#a() {
		let e = this.#t.values().map((e) => e.expression).toArray();
		this.#e.set(e);
	}
}, ea = class extends s {
	#e;
	#t;
	#n;
	#r = null;
	#i = null;
	#a = null;
	#o = !0;
	constructor(e, t) {
		super(), this.#e = e, this.#t = t;
	}
	get expression() {
		return this.#e;
	}
	get lastResult() {
		return this.#r;
	}
	get lastNode() {
		return this.#i;
	}
	skipReleaseLastResult() {
		this.#o = !1;
	}
	setEditor(e) {
		this.#n = e;
	}
	commit() {
		if (!this.#n) return !1;
		let e = this.#n.workingCopy(), t = e.trim();
		return this.#e = t, this.#t(), this.#e === e;
	}
	async evaluate(e) {
		let t = this.#n?.workingCopyWithHint() ?? "", n = !!this.#n?.isEditing() && t !== this.#e, r = n ? 250 : void 0, i = await Un.evaluate(t, e, n, !0, r, "live-expression", !0, !0);
		this.#r && this.#o && this.#a?.runtimeModel.releaseEvaluationResult(this.#r), this.#r = i, this.#a = e, this.#o = !0, this.#i = i && !("error" in i) && i.object.type === "object" && i.object.subtype === "node" ? i.object : null, this.dispatchEventToListeners("EVALUATE_RESULT_READY", this);
	}
}, ta = /* @__PURE__ */ function(e) {
	return e.EVALUATE_RESULT_READY = "EVALUATE_RESULT_READY", e;
}({}), na = "/*\n * Copyright 2017 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  overflow: auto;\n}\n\n.count {\n  flex: none;\n  margin: 0 var(--sys-size-3);\n}\n\ndevtools-icon {\n  margin-right: var(--sys-size-3);\n\n  &[name=\"cross-circle\"] {\n    color: var(--sys-color-error-bright);\n  }\n\n  &[name=\"warning\"] {\n    color: var(--icon-warning);\n  }\n\n  &[name=\"info\"] {\n    color: var(--icon-info);\n  }\n}\n\n.tree-element-title {\n  flex-grow: 1;\n}\n", ra = /* @__PURE__ */ e({
	ConsoleFilterGroup: () => X,
	ConsoleSidebar: () => pa,
	DEFAULT_VIEW: () => da,
	Events: () => ma,
	GroupName: () => la
}), Y = {
	other: "<other>",
	dUserMessages: "{n, plural, =0 {No user messages} =1 {# user message} other {# user messages}}",
	dMessages: "{n, plural, =0 {No messages} =1 {# message} other {# messages}}",
	dErrors: "{n, plural, =0 {No errors} =1 {# error} other {# errors}}",
	dWarnings: "{n, plural, =0 {No warnings} =1 {# warning} other {# warnings}}",
	dInfo: "{n, plural, =0 {No info} =1 {# info} other {# info}}",
	dVerbose: "{n, plural, =0 {No verbose} =1 {# verbose} other {# verbose}}"
}, ia = o("panels/console/ConsoleSidebar.ts", Y), aa = a.bind(void 0, ia), { render: oa, html: sa, nothing: ca } = we, la = /* @__PURE__ */ function(e) {
	return e.CONSOLE_API = "user message", e.ALL = "message", e.ERROR = "error", e.WARNING = "warning", e.INFO = "info", e.VERBOSE = "verbose", e;
}({}), ua = {
	message: {
		icon: "list",
		label: Y.dMessages
	},
	"user message": {
		icon: "profile",
		label: Y.dUserMessages
	},
	error: {
		icon: "cross-circle",
		label: Y.dErrors
	},
	warning: {
		icon: "warning",
		label: Y.dWarnings
	},
	info: {
		icon: "info",
		label: Y.dInfo
	},
	verbose: {
		icon: "bug",
		label: Y.dVerbose
	}
}, da = (e, t, n) => {
	oa(sa`<devtools-tree
        navigation-variant
        hide-overflow
        .template=${sa`
          <ul role="tree">
            ${e.groups.map((t) => sa`
              <li
                role="treeitem"
                @select=${() => e.onSelectionChanged(t.filter)}
                ?selected=${t.filter === e.selectedFilter}>
                  <style>${na}</style>
                  <devtools-icon name=${ua[t.name].icon}></devtools-icon>
                  ${aa(ua[t.name].label, { n: t.messageCount })}
                  ${t.messageCount === 0 ? ca : sa`
                  <ul role="group">
                    ${t.urlGroups.values().map((t) => sa`
                      <li
                        @select=${() => e.onSelectionChanged(t.filter)}
                        role="treeitem"
                        ?selected=${t.filter === e.selectedFilter}
                        title=${t.url ?? ""}>
                          <devtools-icon name=document></devtools-icon>
                          ${t.filter.name} <span class=count>${t.count}</span>
                      </li>`)}
                  </ul>`}
              </li>`)}
        </ul>`}
        ></devtools-tree>`, n, { container: { attributes: { jslog: `${jt("sidebar").track({ resize: !0 })}` } } });
}, X = class {
	urlGroups = /* @__PURE__ */ new Map();
	messageCount = 0;
	name;
	filter;
	constructor(e, t, n) {
		this.name = e, this.filter = new L(e, t, null, n);
	}
	onMessage(e) {
		let t = e.consoleMessage(), n = t.type !== w.Command && t.type !== w.Result && !t.isGroupMessage();
		if (!this.filter.shouldBeVisible(e) || !n) return;
		let r = this.#e(t.url || null);
		r.count++, this.messageCount++;
	}
	clear() {
		this.messageCount = 0, this.urlGroups.clear();
	}
	#e(e) {
		let t = this.urlGroups.get(e);
		if (t) return t;
		let n = this.filter.clone();
		t = {
			filter: n,
			url: e,
			count: 0
		};
		let r = e ? m.fromString(e) : null;
		return n.name = e ? r ? r.displayName : e : aa(Y.other), n.parsedFilters.push({
			key: R.Url,
			text: e,
			negative: !1,
			regex: void 0
		}), this.urlGroups.set(e, t), t;
	}
}, fa = [{
	key: R.Source,
	text: r.ConsoleAPI,
	negative: !1,
	regex: void 0
}], pa = class extends n(at) {
	#e;
	#t = [
		new X("message", [], L.allLevelsFilterValue()),
		new X("user message", fa, L.allLevelsFilterValue()),
		new X("error", [], L.singleLevelMask(h.LogEntryLevel.Error)),
		new X("warning", [], L.singleLevelMask(h.LogEntryLevel.Warning)),
		new X("info", [], L.singleLevelMask(h.LogEntryLevel.Info)),
		new X("verbose", [], L.singleLevelMask(h.LogEntryLevel.Verbose))
	];
	#n = p.instance().createSetting("console.sidebar-selected-filter", null);
	#r = this.#t.find((e) => e.name === this.#n.get())?.filter;
	constructor(e, t = da) {
		super(e, { useShadowDom: "pure" }), this.#e = t, this.setMinimumSize(125, 0), this.performUpdate();
	}
	performUpdate() {
		let e = {
			groups: this.#t,
			selectedFilter: this.#r ?? this.#t[0].filter,
			onSelectionChanged: (e) => {
				this.#r = e, this.#n.set(e.name), this.dispatchEventToListeners("FilterSelected");
			}
		};
		this.#e(e, {}, this.contentElement);
	}
	clear() {
		for (let e of this.#t) e.clear();
		this.requestUpdate();
	}
	onMessageAdded(e) {
		for (let t of this.#t) t.onMessage(e);
		this.requestUpdate();
	}
	shouldBeVisible(e) {
		return this.#r?.shouldBeVisible(e) ?? !0;
	}
}, ma = /* @__PURE__ */ function(e) {
	return e.FILTER_SELECTED = "FilterSelected", e;
}({}), ha = /* @__PURE__ */ e({ ConsoleViewport: () => ga }), ga = class {
	element;
	topGapElement;
	topGapElementActive;
	#e;
	bottomGapElement;
	bottomGapElementActive;
	provider;
	virtualSelectedIndex;
	firstActiveIndex;
	lastActiveIndex;
	renderedItems;
	anchorSelection;
	headSelection;
	itemCount;
	cumulativeHeights;
	muteCopyHandler;
	observer;
	observerConfig;
	#t;
	selectionIsBackward;
	lastSelectedElement;
	cachedProviderElements;
	constructor(e) {
		this.element = document.createElement("div"), this.element.style.overflow = "auto", this.topGapElement = this.element.createChild("div"), this.topGapElement.style.height = "0px", this.topGapElement.style.color = "transparent", this.topGapElementActive = !1, this.#e = this.element.createChild("div"), this.bottomGapElement = this.element.createChild("div"), this.bottomGapElement.style.height = "0px", this.bottomGapElement.style.color = "transparent", this.bottomGapElementActive = !1, this.topGapElement.textContent = "﻿", this.bottomGapElement.textContent = "﻿", Me(this.topGapElement, !0), Me(this.bottomGapElement, !0), this.provider = e, this.element.addEventListener("scroll", this.onScroll.bind(this), !1), this.element.addEventListener("copy", this.onCopy.bind(this), !1), this.element.addEventListener("dragstart", this.onDragStart.bind(this), !1), this.#e.addEventListener("focusin", this.onFocusIn.bind(this), !1), this.#e.addEventListener("focusout", this.onFocusOut.bind(this), !1), this.#e.addEventListener("keydown", this.onKeyDown.bind(this), !1), this.virtualSelectedIndex = -1, this.#e.tabIndex = -1, this.firstActiveIndex = -1, this.lastActiveIndex = -1, this.renderedItems = [], this.anchorSelection = null, this.headSelection = null, this.itemCount = 0, this.cumulativeHeights = /* @__PURE__ */ new Int32Array(), this.muteCopyHandler = !1, this.observer = new MutationObserver(this.refresh.bind(this)), this.observerConfig = {
			childList: !0,
			subtree: !0
		}, this.#t = !1, this.selectionIsBackward = !1;
	}
	stickToBottom() {
		return this.#t;
	}
	setStickToBottom(e) {
		this.#t = e, this.#t ? this.observer.observe(this.#e, this.observerConfig) : this.observer.disconnect();
	}
	hasVirtualSelection() {
		return this.virtualSelectedIndex !== -1;
	}
	copyWithStyles() {
		this.muteCopyHandler = !0, this.element.ownerDocument.execCommand("copy"), this.muteCopyHandler = !1;
	}
	onCopy(e) {
		if (this.muteCopyHandler) return;
		let t = this.selectedText();
		t && (e.preventDefault(), this.selectionContainsTable() ? this.copyWithStyles() : e.clipboardData && e.clipboardData.setData("text/plain", t));
	}
	onFocusIn(e) {
		let t = this.renderedItems.findIndex((t) => t.element().isSelfOrAncestor(e.target));
		t !== -1 && (this.virtualSelectedIndex = this.firstActiveIndex + t);
		let n = !1;
		this.virtualSelectedIndex === -1 && this.isOutsideViewport(e.relatedTarget) && e.target === this.#e && this.itemCount && (n = !0, this.virtualSelectedIndex = this.itemCount - 1, this.refresh(), this.scrollItemIntoView(this.virtualSelectedIndex)), this.updateFocusedItem(n);
	}
	onFocusOut(e) {
		this.isOutsideViewport(e.relatedTarget) && (this.virtualSelectedIndex = -1), this.updateFocusedItem();
	}
	isOutsideViewport(e) {
		return e !== null && !e.isSelfOrDescendant(this.#e);
	}
	onDragStart(e) {
		let t = this.selectedText();
		return t ? (e.dataTransfer && (e.dataTransfer.clearData(), e.dataTransfer.setData("text/plain", t), e.dataTransfer.effectAllowed = "copy"), !0) : !1;
	}
	onKeyDown(e) {
		if (De() || !this.itemCount || e.shiftKey) return;
		let t = !1;
		switch (e.key) {
			case "ArrowUp":
				if (this.virtualSelectedIndex > 0) t = !0, this.virtualSelectedIndex--;
				else return;
				break;
			case "ArrowDown":
				if (this.virtualSelectedIndex < this.itemCount - 1) this.virtualSelectedIndex++;
				else return;
				break;
			case "Home":
				this.virtualSelectedIndex = 0;
				break;
			case "End":
				this.virtualSelectedIndex = this.itemCount - 1;
				break;
			default: return;
		}
		e.consume(!0), this.scrollItemIntoView(this.virtualSelectedIndex), this.updateFocusedItem(t);
	}
	updateFocusedItem(e) {
		let t = this.renderedElementAt(this.virtualSelectedIndex), n = this.lastSelectedElement !== t, r = this.#e === Ft(this.element.ownerDocument);
		if (this.lastSelectedElement && n && this.lastSelectedElement.classList.remove("console-selected"), t && (e || n || r) && this.element.hasFocus()) {
			t.classList.add("console-selected");
			let n = Ur(t);
			n && S.instance().setFlavor(H, n), e ? (this.setStickToBottom(!1), this.renderedItems[this.virtualSelectedIndex - this.firstActiveIndex].focusLastChildOrSelf()) : t.hasFocus() || t.focus({ preventScroll: !0 });
		}
		this.itemCount && !this.#e.hasFocus() ? this.#e.tabIndex = 0 : this.#e.tabIndex = -1, this.lastSelectedElement = t;
	}
	contentElement() {
		return this.#e;
	}
	invalidate() {
		delete this.cachedProviderElements, this.itemCount = this.provider.itemCount(), this.virtualSelectedIndex > this.itemCount - 1 && (this.virtualSelectedIndex = this.itemCount - 1), this.rebuildCumulativeHeights(), this.refresh();
	}
	providerElement(e) {
		this.cachedProviderElements ||= Array(this.itemCount);
		let t = this.cachedProviderElements[e];
		return t || (t = this.provider.itemElement(e), this.cachedProviderElements[e] = t), t;
	}
	rebuildCumulativeHeights() {
		let e = this.firstActiveIndex, t = this.lastActiveIndex, n = 0;
		this.cumulativeHeights = new Int32Array(this.itemCount);
		for (let r = 0; r < this.itemCount; ++r) e <= r && r - e < this.renderedItems.length && r <= t ? n += this.renderedItems[r - e].element().offsetHeight : n += this.provider.fastHeight(r), this.cumulativeHeights[r] = n;
	}
	rebuildCumulativeHeightsIfNeeded() {
		let e = 0, t = 0;
		for (let n = 0; n < this.renderedItems.length; ++n) {
			let r = this.cachedItemHeight(this.firstActiveIndex + n), i = this.renderedItems[n].element().offsetHeight;
			if (Math.abs(r - i) > 1) {
				this.rebuildCumulativeHeights();
				return;
			}
			if (t += i, e += r, Math.abs(e - t) > 1) {
				this.rebuildCumulativeHeights();
				return;
			}
		}
	}
	cachedItemHeight(e) {
		return e === 0 ? this.cumulativeHeights[0] : this.cumulativeHeights[e] - this.cumulativeHeights[e - 1];
	}
	isSelectionBackwards(e) {
		if (!e?.rangeCount || !e.anchorNode || !e.focusNode) return !1;
		let t = document.createRange();
		return t.setStart(e.anchorNode, e.anchorOffset), t.setEnd(e.focusNode, e.focusOffset), t.collapsed;
	}
	createSelectionModel(e, t, n) {
		return {
			item: e,
			node: t,
			offset: n
		};
	}
	updateSelectionModel(e) {
		let t = e?.rangeCount ? e.getRangeAt(0) : null;
		if (!t || !e || e.isCollapsed || !this.element.hasSelection()) return this.headSelection = null, this.anchorSelection = null, !1;
		let n = Number.MAX_VALUE, r = -1, i = !1;
		for (let e = 0; e < this.renderedItems.length; ++e) if (t.intersectsNode(this.renderedItems[e].element())) {
			let t = e + this.firstActiveIndex;
			n = Math.min(n, t), r = Math.max(r, t), i = !0;
		}
		let a = t.intersectsNode(this.topGapElement) && this.topGapElementActive, o = t.intersectsNode(this.bottomGapElement) && this.bottomGapElementActive;
		if (!a && !o && !i) return this.headSelection = null, this.anchorSelection = null, !1;
		(!this.anchorSelection || !this.headSelection) && (this.anchorSelection = this.createSelectionModel(0, this.element, 0), this.headSelection = this.createSelectionModel(this.itemCount - 1, this.element, this.element.children.length), this.selectionIsBackward = !1);
		let s = this.isSelectionBackwards(e), c = this.selectionIsBackward ? this.headSelection : this.anchorSelection, l = this.selectionIsBackward ? this.anchorSelection : this.headSelection, u = null, d = null;
		return i && (u = this.createSelectionModel(n, t.startContainer, t.startOffset), d = this.createSelectionModel(r, t.endContainer, t.endOffset)), a && o && i ? (u = u && u.item < c.item ? u : c, d = d && d.item > l.item ? d : l) : i ? a ? u = s ? this.headSelection : this.anchorSelection : o && (d = s ? this.anchorSelection : this.headSelection) : (u = c, d = l), s ? (this.anchorSelection = d, this.headSelection = u) : (this.anchorSelection = u, this.headSelection = d), this.selectionIsBackward = s, !0;
	}
	restoreSelection(e) {
		if (!e || !this.anchorSelection || !this.headSelection) return;
		let t = (e, t) => this.firstActiveIndex <= e.item && e.item <= this.lastActiveIndex ? {
			element: e.node,
			offset: e.offset
		} : {
			element: e.item < this.firstActiveIndex ? this.topGapElement : this.bottomGapElement,
			offset: +!!t
		}, { element: n, offset: r } = t(this.anchorSelection, !!this.selectionIsBackward), { element: i, offset: a } = t(this.headSelection, !this.selectionIsBackward);
		e.setBaseAndExtent(n, r, i, a);
	}
	selectionContainsTable() {
		if (!this.anchorSelection || !this.headSelection) return !1;
		let e = this.selectionIsBackward ? this.headSelection.item : this.anchorSelection.item, t = this.selectionIsBackward ? this.anchorSelection.item : this.headSelection.item;
		for (let n = e; n <= t; n++) if (this.providerElement(n)?.consoleMessage().type === "table") return !0;
		return !1;
	}
	refresh() {
		this.observer.disconnect(), this.#n(), this.#t && this.observer.observe(this.#e, this.observerConfig);
	}
	#n() {
		if (!this.visibleHeight()) return;
		if (!this.itemCount) {
			for (let e = 0; e < this.renderedItems.length; ++e) this.renderedItems[e].willHide();
			this.renderedItems = [], this.#e.removeChildren(), this.topGapElement.style.height = "0px", this.bottomGapElement.style.height = "0px", this.firstActiveIndex = -1, this.lastActiveIndex = -1, this.updateFocusedItem();
			return;
		}
		let e = this.element.getComponentSelection(), t = this.updateSelectionModel(e), n = this.element.scrollTop, r = this.visibleHeight(), i = r * 2;
		this.rebuildCumulativeHeightsIfNeeded(), this.#t ? (this.firstActiveIndex = Math.max(this.itemCount - Math.ceil(i / this.provider.minimumRowHeight()), 0), this.lastActiveIndex = this.itemCount - 1) : (this.firstActiveIndex = Math.max(ne(this.cumulativeHeights, n + 1 - (i - r) / 2, u), 0), this.lastActiveIndex = this.firstActiveIndex + Math.ceil(i / this.provider.minimumRowHeight()) - 1, this.lastActiveIndex = Math.min(this.lastActiveIndex, this.itemCount - 1));
		let a = this.cumulativeHeights[this.firstActiveIndex - 1] || 0, o = this.cumulativeHeights[this.cumulativeHeights.length - 1] - this.cumulativeHeights[this.lastActiveIndex];
		function s() {
			this.topGapElement.style.height = a + "px", this.bottomGapElement.style.height = o + "px", this.topGapElementActive = !!a, this.bottomGapElementActive = !!o, this.#e.style.setProperty("height", "10000000px");
		}
		this.partialViewportUpdate(s.bind(this)), this.#e.style.removeProperty("height"), t && this.restoreSelection(e), this.#t && (this.element.scrollTop = 1e7);
	}
	partialViewportUpdate(e) {
		let t = /* @__PURE__ */ new Set();
		for (let e = this.firstActiveIndex; e <= this.lastActiveIndex; ++e) {
			let n = this.providerElement(e);
			console.assert(!!n, "Expected provider element to be defined"), n && t.add(n);
		}
		let n = this.renderedItems.filter((e) => !t.has(e));
		for (let e = 0; e < n.length; ++e) n[e].willHide();
		e();
		let r = !1;
		for (let e = 0; e < n.length; ++e) r ||= n[e].element().hasFocus(), n[e].element().remove();
		let i = [], a = this.#e.firstChild;
		for (let e of t) {
			let t = e.element();
			t === a ? a = a.nextSibling : (t.parentElement || i.push(e), this.#e.insertBefore(t, a));
		}
		for (let e = 0; e < i.length; ++e) i[e].wasShown();
		this.renderedItems = Array.from(t), r && this.#e.focus(), this.updateFocusedItem();
	}
	selectedText() {
		if (this.updateSelectionModel(this.element.getComponentSelection()), !this.headSelection || !this.anchorSelection) return null;
		let e = null, t = null;
		this.selectionIsBackward ? (e = this.headSelection, t = this.anchorSelection) : (e = this.anchorSelection, t = this.headSelection);
		let n = [];
		for (let r = e.item; r <= t.item; ++r) {
			let e = this.providerElement(r);
			if (console.assert(!!e), !e) continue;
			let t = e.element().childTextNodes().map(N.untruncatedNodeText).join("");
			n.push(t);
		}
		let r = this.providerElement(t.item)?.element();
		if (r && t.node?.isSelfOrDescendant(r)) {
			let e = this.textOffsetInNode(r, t.node, t.offset);
			n.length > 0 && (n[n.length - 1] = n[n.length - 1].substring(0, e));
		}
		let i = this.providerElement(e.item)?.element();
		if (i && e.node?.isSelfOrDescendant(i)) {
			let t = this.textOffsetInNode(i, e.node, e.offset);
			n[0] = n[0].substring(t);
		}
		return n.join("\n");
	}
	textOffsetInNode(e, t, n) {
		let r = t.textContent ? t.textContent.length : 0;
		t.nodeType !== Node.TEXT_NODE && (n < t.childNodes.length ? (t = t.childNodes.item(n), n = 0) : n = r);
		let i = 0, a = e;
		for (; (a = a.traverseNextNode(e)) && a !== t;) a.nodeType !== Node.TEXT_NODE || a.parentNode && (a.parentNode.nodeName === "STYLE" || a.parentNode.nodeName === "SCRIPT" || a.parentNode.nodeName === "#document-fragment") || (i += N.untruncatedNodeText(a).length);
		let o = N.untruncatedNodeText(t).length;
		return n > 0 && o !== r && (n = o), i + n;
	}
	onScroll(e) {
		this.refresh();
	}
	firstVisibleIndex() {
		return this.cumulativeHeights.length ? (this.rebuildCumulativeHeightsIfNeeded(), ne(this.cumulativeHeights, this.element.scrollTop + 1, u)) : -1;
	}
	lastVisibleIndex() {
		if (!this.cumulativeHeights.length) return -1;
		this.rebuildCumulativeHeightsIfNeeded();
		let e = this.element.scrollTop + this.element.clientHeight, t = this.itemCount - 1;
		return ne(this.cumulativeHeights, e, u, void 0, t);
	}
	renderedElementAt(e) {
		return e === -1 || e < this.firstActiveIndex || e > this.lastActiveIndex ? null : this.renderedItems[e - this.firstActiveIndex].element();
	}
	scrollItemIntoView(e, t) {
		let n = this.firstVisibleIndex(), r = this.lastVisibleIndex();
		e > n && e < r || e === r && this.cumulativeHeights[e] <= this.element.scrollTop + this.visibleHeight() || (t ? this.forceScrollItemToBeLast(e) : e <= n ? this.forceScrollItemToBeFirst(e) : e >= r && this.forceScrollItemToBeLast(e));
	}
	forceScrollItemToBeFirst(e) {
		console.assert(e >= 0 && e < this.itemCount, "Cannot scroll item at invalid index"), this.setStickToBottom(!1), this.rebuildCumulativeHeightsIfNeeded(), this.element.scrollTop = e > 0 ? this.cumulativeHeights[e - 1] : 0, he(this.element) && this.setStickToBottom(!0), this.refresh();
		let t = this.renderedElementAt(e);
		t && t.scrollIntoView(!0);
	}
	forceScrollItemToBeLast(e) {
		console.assert(e >= 0 && e < this.itemCount, "Cannot scroll item at invalid index"), this.setStickToBottom(!1), this.rebuildCumulativeHeightsIfNeeded(), this.element.scrollTop = this.cumulativeHeights[e] - this.visibleHeight(), he(this.element) && this.setStickToBottom(!0), this.refresh();
		let t = this.renderedElementAt(e);
		t && t.scrollIntoView(!1);
	}
	visibleHeight() {
		return this.element.offsetHeight;
	}
}, _a = /* @__PURE__ */ e({
	ActionDelegate: () => Ta,
	ConsoleView: () => $,
	ConsoleViewFilter: () => wa
}), Z = {
	issuesWithColon: "{n, plural, =0 {No Issues} =1 {# Issue:} other {# Issues:}}",
	issueToolbarTooltipGeneral: "Some problems no longer generate console messages, but are surfaced in the issues tab.",
	issueToolbarClickToView: "Click to view {issueEnumeration}",
	issueToolbarClickToGoToTheIssuesTab: "Click to go to the issues tab",
	findStringInLogs: "Find string in logs",
	consoleSettings: "Console settings",
	groupSimilarMessagesInConsole: "Group similar messages",
	showCorsErrorsInConsole: "CORS errors in console",
	showConsoleSidebar: "Show console sidebar",
	hideConsoleSidebar: "Hide console sidebar",
	consoleSidebarShown: "Console sidebar shown",
	consoleSidebarHidden: "Console sidebar hidden",
	doNotClearLogOnPageReload: "Do not clear log on page reload / navigation",
	preserveLog: "Preserve log",
	networkMessages: "Network messages",
	onlyShowMessagesFromTheCurrentContext: "Only show messages from the current context (`top`, `iframe`, `worker`, extension)",
	selectedContextOnly: "Selected context only",
	logXMLHttpRequests: "Log XMLHttpRequests",
	eagerlyEvaluateTextInThePrompt: "Eagerly evaluate text in the prompt",
	autocompleteFromHistory: "Autocomplete from history",
	treatEvaluationAsUserActivation: "Treat evaluation as user activation",
	sHidden: "{n, plural, =1 {# hidden} other {# hidden}}",
	consoleCleared: "Console cleared",
	hideMessagesFromS: "Hide messages from {PH1}",
	saveAs: "Save as…",
	copyConsole: "Copy console",
	copyVisibleStyledSelection: "Copy visible styled selection",
	replayXhr: "Replay XHR",
	writingFile: "Writing file…",
	searching: "Searching…",
	egEventdCdnUrlacom: "e.g. `/eventd/ -cdn url:a.com`",
	verbose: "Verbose",
	info: "Info",
	warnings: "Warnings",
	errors: "Errors",
	overriddenByFilterSidebar: "Log levels are controlled by the console sidebar.",
	customLevels: "Custom levels",
	sOnly: "{PH1} only",
	allLevels: "All levels",
	defaultLevels: "Default levels",
	hideAll: "Hide all",
	logLevelS: "Log level: {PH1}",
	default: "Default",
	filteredMessagesInConsole: "{PH1} messages in console",
	collapseAll: "Collapse all",
	expandAll: "Expand all"
}, va = o("panels/console/ConsoleView.ts", Z), Q = a.bind(void 0, va), ya, ba = 5, xa = "console-ai-code-completion-disclaimer-tooltip", Sa = "console-ai-code-completion-spinner-tooltip", Ca = "console-ai-code-completion-citations-tooltip", $ = class e extends at {
	#e;
	sidebar;
	isSidebarOpen;
	filter;
	consoleToolbarContainer;
	splitWidget;
	contentsElement;
	visibleViewMessages;
	hiddenByFilterCount;
	shouldBeHiddenCache;
	lastShownHiddenByFilterCount;
	currentMatchRangeIndex;
	searchRegex;
	groupableMessages;
	groupableMessageTitle;
	shortcuts;
	regexMatchRanges;
	consoleContextSelector;
	filterStatusText;
	showSettingsPaneSetting;
	showSettingsPaneButton;
	progressToolbarItem;
	groupSimilarSetting;
	showCorsErrorsSetting;
	timestampsSetting;
	consoleHistoryAutocompleteSetting;
	selfXssWarningDisabledSetting;
	pinPane;
	viewport;
	messagesElement;
	messagesCountElement;
	viewportThrottler;
	pendingBatchResize;
	onMessageResizedBound;
	promptElement;
	linkifier;
	consoleMessages;
	consoleGroupStarts;
	prompt;
	immediatelyFilterMessagesForTest;
	maybeDirtyWhileMuted;
	scheduledRefreshPromiseForTest;
	needsFullUpdate;
	buildHiddenCacheTimeout;
	searchShouldJumpBackwards;
	searchProgressIndicator;
	#t;
	muteViewportUpdates;
	waitForScrollTimeout;
	issueCounter;
	pendingSidebarMessages = [];
	userHasOpenedSidebarAtLeastOnce = !1;
	issueToolbarThrottle;
	requestResolver = new hn();
	issueResolver = new pr();
	#n = !1;
	#r = this.#d.bind(this);
	#i;
	#a = !1;
	aiCodeCompletionConfig;
	aiCodeCompletionSummaryToolbarContainer;
	aiCodeCompletionSummaryToolbar;
	constructor(e) {
		super(), this.setMinimumSize(0, 35), this.registerRequiredCSS(zr, dr, cr), this.#e = new $e(this, null), this.#e.element.classList.add("console-searchable-view"), this.#e.setPlaceholder(Q(Z.findStringInLogs)), this.#e.setMinimalSearchQuerySize(0), this.sidebar = new pa(), this.sidebar.addEventListener(ma.FILTER_SELECTED, this.onFilterChanged.bind(this)), this.isSidebarOpen = !1, this.filter = new wa(this.onFilterChanged.bind(this)), this.consoleToolbarContainer = this.element.createChild("div", "console-toolbar-container"), this.consoleToolbarContainer.role = "toolbar", this.splitWidget = new Ue(!0, !1, "console.sidebar.width", 100), this.splitWidget.setMainWidget(this.#e), this.splitWidget.setSidebarWidget(this.sidebar), this.splitWidget.show(this.element), this.splitWidget.hideSidebar(), this.splitWidget.enableShowModeSaving(), this.isSidebarOpen = this.splitWidget.showMode() === Ye.BOTH, this.filter.setLevelMenuOverridden(this.isSidebarOpen), this.splitWidget.addEventListener(be.SHOW_MODE_CHANGED, (e) => {
			this.isSidebarOpen = e.data === Ye.BOTH, this.isSidebarOpen && (this.userHasOpenedSidebarAtLeastOnce ||= (C.actionTaken(A.ConsoleSidebarOpened), !0), this.pendingSidebarMessages.forEach((e) => {
				this.sidebar.onMessageAdded(e);
			}), this.pendingSidebarMessages = []), this.filter.setLevelMenuOverridden(this.isSidebarOpen), this.onFilterChanged();
		}), this.contentsElement = this.#e.element, this.element.classList.add("console-view"), this.visibleViewMessages = [], this.hiddenByFilterCount = 0, this.shouldBeHiddenCache = /* @__PURE__ */ new Set(), this.groupableMessages = /* @__PURE__ */ new Map(), this.groupableMessageTitle = /* @__PURE__ */ new Map(), this.shortcuts = /* @__PURE__ */ new Map(), this.regexMatchRanges = [], this.consoleContextSelector = new Or(), this.filterStatusText = new Lt(), this.filterStatusText.element.classList.add("dimmed"), this.showSettingsPaneSetting = p.instance().createSetting("console-show-settings-toolbar", !1), this.showSettingsPaneButton = new Ct(this.showSettingsPaneSetting, "gear", Q(Z.consoleSettings), "gear-filled"), this.showSettingsPaneButton.element.setAttribute("jslog", `${At("console-settings").track({ click: !0 })}`), this.progressToolbarItem = new Nt(document.createElement("div")), this.groupSimilarSetting = p.instance().moduleSetting("console-group-similar"), this.groupSimilarSetting.addChangeListener(() => this.updateMessageList()), this.showCorsErrorsSetting = p.instance().moduleSetting("console-shows-cors-errors"), this.showCorsErrorsSetting.addChangeListener(() => this.updateMessageList());
		let t = this.consoleToolbarContainer.createChild("devtools-toolbar", "console-main-toolbar");
		t.setAttribute("jslog", `${Et()}`), t.role = "presentation", t.wrappable = !0, t.appendToolbarItem(this.splitWidget.createShowHideSidebarButton(Q(Z.showConsoleSidebar), Q(Z.hideConsoleSidebar), Q(Z.consoleSidebarShown), Q(Z.consoleSidebarHidden), "console-sidebar")), t.appendToolbarItem(Je.createActionButton("console.clear")), this.#i = new He(Q(Z.collapseAll), "compress", void 0, "console.collapse-all"), this.#i.addEventListener(He.Events.CLICK, this.#l, this), t.appendToolbarItem(this.#i), t.appendSeparator(), t.appendToolbarItem(this.consoleContextSelector.toolbarItem()), t.appendSeparator();
		let n = Je.createActionButton("console.create-pin");
		t.appendToolbarItem(n), t.appendSeparator(), t.appendToolbarItem(this.filter.textFilterUI), t.appendToolbarItem(this.filter.levelMenuButton), t.appendToolbarItem(this.filter.levelMenuButtonInfo), t.appendToolbarItem(this.progressToolbarItem), t.appendSeparator(), this.issueCounter = new gr(), this.issueCounter.id = "console-issues-counter", this.issueCounter.setAttribute("jslog", `${je("issues").track({ click: !0 })}`);
		let r = new Nt(this.issueCounter);
		this.issueCounter.data = {
			clickHandler: () => {
				C.issuesPanelOpenedFrom(pt.STATUS_BAR_ISSUES_COUNTER), yt.instance().showView("issues-pane");
			},
			issuesManager: F.instance(),
			accessibleName: Q(Z.issueToolbarTooltipGeneral),
			displayMode: hr.OMIT_EMPTY
		}, t.appendToolbarItem(r), t.appendSeparator(), t.appendToolbarItem(this.filterStatusText), t.appendToolbarItem(this.showSettingsPaneButton);
		let i = p.instance().moduleSetting("monitoring-xhr-enabled");
		this.timestampsSetting = p.instance().moduleSetting("console-timestamps-enabled"), this.consoleHistoryAutocompleteSetting = p.instance().moduleSetting("console-history-autocomplete"), this.selfXssWarningDisabledSetting = p.instance().createSetting("disable-self-xss-warning", !1, re.SYNCED);
		let a = this.contentsElement.createChild("div", "console-settings-pane");
		_(a, Q(Z.consoleSettings)), Xe(a);
		let o = p.instance().moduleSetting("console-eager-eval"), s = p.instance().moduleSetting("preserve-console-log"), c = p.instance().moduleSetting("console-user-activation-eval");
		a.append(I(Q(Z.networkMessages), this.filter.networkMessagesSetting, this.filter.networkMessagesSetting.title()), I(Q(Z.logXMLHttpRequests), i), I(Q(Z.preserveLog), s, Q(Z.doNotClearLogOnPageReload)), I(o.title(), o, Q(Z.eagerlyEvaluateTextInThePrompt)), I(Q(Z.selectedContextOnly), this.filter.filterByExecutionContextSetting, Q(Z.onlyShowMessagesFromTheCurrentContext)), I(this.consoleHistoryAutocompleteSetting.title(), this.consoleHistoryAutocompleteSetting, Q(Z.autocompleteFromHistory)), I(this.groupSimilarSetting.title(), this.groupSimilarSetting, Q(Z.groupSimilarMessagesInConsole)), I(c.title(), c, Q(Z.treatEvaluationAsUserActivation)), I(this.showCorsErrorsSetting.title(), this.showCorsErrorsSetting, Q(Z.showCorsErrorsInConsole))), this.showSettingsPaneSetting.get() || a.classList.add("hidden"), this.showSettingsPaneSetting.addChangeListener(() => a.classList.toggle("hidden", !this.showSettingsPaneSetting.get())), this.pinPane = new Ji(() => this.prompt.focus()), this.pinPane.element.classList.add("console-view-pinpane"), this.pinPane.element.classList.remove("flex-auto"), this.pinPane.show(this.contentsElement), this.viewport = new ga(this), this.viewport.setStickToBottom(!0), this.viewport.contentElement().classList.add("console-group", "console-group-messages"), this.contentsElement.appendChild(this.viewport.element), this.messagesElement = this.viewport.element, this.messagesElement.id = "console-messages", this.messagesElement.classList.add("monospace"), this.messagesElement.addEventListener("click", this.messagesClicked.bind(this), !1), [
			"paste",
			"clipboard-paste",
			"drop"
		].forEach((e) => {
			this.messagesElement.addEventListener(e, this.messagesPasted.bind(this), !0);
		}), this.messagesCountElement = this.consoleToolbarContainer.createChild("div", "message-count"), wt(this.messagesCountElement, !1), this.viewportThrottler = new dt(e), this.pendingBatchResize = !1, this.onMessageResizedBound = (e) => {
			this.onMessageResized(e);
		}, this.promptElement = this.messagesElement.createChild("div", "source-code"), this.promptElement.id = "console-prompt";
		let l = this.messagesElement.createChild("div", "console-view-fix-select-all");
		l.textContent = ".", Me(l, !0), this.registerShortcuts(), this.messagesElement.addEventListener("contextmenu", this.handleContextMenuEvent.bind(this), !1);
		let u = new dt(100), d = () => u.schedule(async () => this.onFilterChanged());
		this.linkifier = new N(40), this.linkifier.addEventListener(vn.LIVE_LOCATION_UPDATED, d), this.consoleMessages = [], this.consoleGroupStarts = [], this.aiCodeCompletionConfig = wn.isAiCodeCompletionAvailable() ? {
			completionContext: {
				getPrefix: this.getConsoleMessageHistory.bind(this),
				additionalFiles: [{
					path: "devtools-console-context.js",
					content: ln,
					included_reason: Ot.RELATED_FILE
				}],
				stopSequences: ["\n\n"]
			},
			generationContext: { additionalPreambleContext: Tn },
			onFeatureEnabled: () => {
				this.setupAiCodeCompletion();
			},
			onFeatureDisabled: () => {
				this.cleanupAiCodeCompletion();
			},
			onSuggestionAccepted: this.#o.bind(this),
			onRequestTriggered: this.#s.bind(this),
			onResponseReceived: this.#c.bind(this),
			panel: mn.CONSOLE
		} : void 0, this.prompt = new Ba(this.aiCodeCompletionConfig), this.prompt.show(this.promptElement), this.prompt.element.addEventListener("keydown", this.promptKeyDown.bind(this), !0), this.prompt.addEventListener(Va.TEXT_CHANGED, this.promptTextChanged, this), this.messagesElement.addEventListener("keydown", this.messagesKeyDown.bind(this), !1), this.prompt.element.addEventListener("focusin", () => {
			this.isScrolledToBottom() && this.viewport.setStickToBottom(!0);
		}), this.consoleHistoryAutocompleteSetting.addChangeListener(this.consoleHistoryAutocompleteChanged, this), this.consoleHistoryAutocompleteChanged(), this.updateFilterStatus(), this.timestampsSetting.addChangeListener(this.consoleTimestampsSettingChanged, this), this.registerWithMessageSink(), S.instance().addFlavorChangeListener(y, this.executionContextChanged, this), this.messagesElement.addEventListener("mousedown", (e) => this.updateStickToBottomOnPointerDown(e.button === 2), !1), this.messagesElement.addEventListener("mouseup", this.updateStickToBottomOnPointerUp.bind(this), !1), this.messagesElement.addEventListener("mouseleave", this.updateStickToBottomOnPointerUp.bind(this), !1), this.messagesElement.addEventListener("wheel", this.updateStickToBottomOnWheel.bind(this), !1), this.messagesElement.addEventListener("touchstart", this.updateStickToBottomOnPointerDown.bind(this, !1), !1), this.messagesElement.addEventListener("touchend", this.updateStickToBottomOnPointerUp.bind(this), !1), this.messagesElement.addEventListener("touchcancel", this.updateStickToBottomOnPointerUp.bind(this), !1), E.instance().addModelListener(x, v.ConsoleCleared, this.consoleCleared, this, { scoped: !0 }), E.instance().addModelListener(x, v.MessageAdded, this.onConsoleMessageAdded, this, { scoped: !0 }), E.instance().addModelListener(x, v.MessageUpdated, this.onConsoleMessageUpdated, this, { scoped: !0 }), E.instance().addModelListener(x, v.CommandEvaluated, this.commandEvaluated, this, { scoped: !0 }), E.instance().observeModels(x, this, { scoped: !0 });
		let f = F.instance();
		this.issueToolbarThrottle = new dt(100), f.addEventListener(fr.ISSUES_COUNT_UPDATED, this.#r);
	}
	static clearConsoleViewInstanceForTest() {
		ya = null;
	}
	static instance(t) {
		return (!ya || t?.forceNew) && (ya = new e(t?.viewportThrottlerTimeout ?? 50)), ya;
	}
	createAiCodeCompletionSummaryToolbar() {
		this.aiCodeCompletionSummaryToolbar || (this.aiCodeCompletionSummaryToolbar = new En({
			citationsTooltipId: Ca,
			disclaimerTooltipId: xa,
			spinnerTooltipId: Sa,
			panel: mn.CONSOLE
		}), this.aiCodeCompletionSummaryToolbarContainer = this.element.createChild("div", "ai-code-completion-summary-toolbar-container"), this.aiCodeCompletionSummaryToolbar.show(this.aiCodeCompletionSummaryToolbarContainer, void 0, !0));
	}
	#o(e) {
		if (!this.aiCodeCompletionSummaryToolbar || e.length === 0) return;
		let t = e.map((e) => e.uri).filter((e) => !!e);
		this.aiCodeCompletionSummaryToolbar.updateCitations(t);
	}
	#s() {
		this.aiCodeCompletionSummaryToolbar?.setLoading(!0);
	}
	#c() {
		this.aiCodeCompletionSummaryToolbar?.setLoading(!1);
	}
	clearConsole() {
		x.requestClearMessages(), this.prompt.clearAiCodeCompletionCache();
	}
	collapseAll() {
		for (let e of this.consoleMessages) e instanceof ei && e.setCollapsedSilent(!0), e.setTraceExpanded(!1);
		this.updateMessageList();
	}
	expandAll() {
		for (let e of this.consoleMessages) e instanceof ei && e.setCollapsedSilent(!1), e.setTraceExpanded(!0);
		this.updateMessageList();
	}
	#l() {
		this.#a ? this.expandAll() : this.collapseAll(), this.#a = !this.#a, this.#u();
	}
	#u() {
		let e = !1, t = !1;
		for (let n of this.visibleViewMessages) if (n instanceof ei && (e ||= !n.collapsed(), t ||= n.collapsed()), n.isExpandableTrace() && (e ||= n.isTraceExpanded(), t ||= !n.isTraceExpanded()), e && t) break;
		this.#a = !e && t, this.#a ? (this.#i.setGlyph("expand"), this.#i.setTitle(Q(Z.expandAll))) : (this.#i.setGlyph("compress"), this.#i.setTitle(Q(Z.collapseAll)));
	}
	#d() {
		this.issueToolbarThrottle.schedule(async () => this.updateIssuesToolbarItem()), this.issuesCountUpdatedForTest();
	}
	issuesCountUpdatedForTest() {}
	modelAdded(e) {
		e.messages().forEach(this.addConsoleMessage, this);
	}
	modelRemoved(e) {
		!p.instance().moduleSetting("preserve-console-log").get() && e.target().outermostTarget() === e.target() && this.consoleCleared();
	}
	onFilterChanged() {
		if (this.filter.currentFilter.levelsMask = this.isSidebarOpen ? L.allLevelsFilterValue() : this.filter.messageLevelFiltersSetting.get(), this.cancelBuildHiddenCache(), this.immediatelyFilterMessagesForTest) {
			for (let e of this.consoleMessages) this.computeShouldMessageBeVisible(e);
			this.updateMessageList();
			return;
		}
		this.buildHiddenCache(0, this.consoleMessages.slice());
	}
	setImmediatelyFilterMessagesForTest() {
		this.immediatelyFilterMessagesForTest = !0;
	}
	searchableView() {
		return this.#e;
	}
	clearHistory() {
		this.prompt.history().clear(), this.prompt.clearAiCodeCompletionCache();
	}
	consoleHistoryAutocompleteChanged() {
		this.prompt.setAddCompletionsFromHistory(this.consoleHistoryAutocompleteSetting.get());
	}
	itemCount() {
		return this.visibleViewMessages.length;
	}
	itemElement(e) {
		return this.visibleViewMessages[e];
	}
	fastHeight(e) {
		return this.visibleViewMessages[e].fastHeight();
	}
	minimumRowHeight() {
		return 16;
	}
	registerWithMessageSink() {
		ae.instance().messages().forEach(this.addSinkMessage, this), ae.instance().addEventListener(c.MESSAGE_ADDED, ({ data: e }) => {
			this.addSinkMessage(e);
		}, this);
	}
	addSinkMessage(e) {
		let t = h.LogEntryLevel.Verbose;
		switch (e.level) {
			case ie.INFO:
				t = h.LogEntryLevel.Info;
				break;
			case ie.ERROR:
				t = h.LogEntryLevel.Error;
				break;
			case ie.WARNING: t = h.LogEntryLevel.Warning;
		}
		let n = e.source || h.LogEntrySource.Other, r = new We(null, n, t, e.text, {
			type: w.System,
			timestamp: e.timestamp
		});
		this.addConsoleMessage(r);
	}
	consoleTimestampsSettingChanged() {
		this.updateMessageList(), this.consoleMessages.forEach((e) => e.updateTimestamp()), this.groupableMessageTitle.forEach((e) => e.updateTimestamp());
	}
	executionContextChanged() {
		this.prompt.clearAutocomplete();
	}
	willHide() {
		super.willHide(), this.hidePromptSuggestBox();
	}
	dispose() {
		E.instance().removeModelListener(x, v.ConsoleCleared, this.consoleCleared, this), E.instance().removeModelListener(x, v.MessageAdded, this.onConsoleMessageAdded, this), E.instance().removeModelListener(x, v.MessageUpdated, this.onConsoleMessageUpdated, this), E.instance().removeModelListener(x, v.CommandEvaluated, this.commandEvaluated, this), E.instance().unobserveModels(x, this), F.instance().removeEventListener(fr.ISSUES_COUNT_UPDATED, this.#r);
	}
	wasShown() {
		super.wasShown(), this.#n && F.instance().addEventListener(fr.ISSUES_COUNT_UPDATED, this.#r), this.#n = !1, this.updateIssuesToolbarItem(), this.viewport.refresh();
	}
	focus() {
		this.viewport.hasVirtualSelection() ? this.viewport.contentElement().focus() : this.focusPrompt();
	}
	focusPrompt() {
		if (!this.prompt.hasFocus()) {
			let e = this.viewport.stickToBottom(), t = this.viewport.element.scrollTop;
			this.prompt.focus(), this.viewport.setStickToBottom(e), this.viewport.element.scrollTop = t;
		}
	}
	restoreScrollPositions() {
		this.viewport.stickToBottom() ? this.immediatelyScrollToBottom() : super.restoreScrollPositions();
	}
	onResize() {
		this.scheduleViewportRefresh(), this.hidePromptSuggestBox(), this.viewport.stickToBottom() && this.immediatelyScrollToBottom();
		for (let e = 0; e < this.visibleViewMessages.length; ++e) this.visibleViewMessages[e].onResize();
	}
	hidePromptSuggestBox() {
		this.prompt.clearAutocomplete();
	}
	async invalidateViewport() {
		if (this.updateIssuesToolbarItem(), this.muteViewportUpdates) {
			this.maybeDirtyWhileMuted = !0;
			return;
		}
		this.needsFullUpdate ? (this.updateMessageList(), delete this.needsFullUpdate) : this.viewport.invalidate();
	}
	onDetach() {
		this.#n = !0, F.instance().removeEventListener(fr.ISSUES_COUNT_UPDATED, this.#r);
	}
	updateIssuesToolbarItem() {
		if (this.#n) return;
		let e = F.instance(), t = mr(e), n = e.numberOfIssues() === 0 ? Q(Z.issueToolbarClickToGoToTheIssuesTab) : Q(Z.issueToolbarClickToView, { issueEnumeration: t }), r = `${Q(Z.issueToolbarTooltipGeneral)} ${n}`;
		b.install(this.issueCounter, r), this.issueCounter.data = {
			...this.issueCounter.data,
			leadingText: Q(Z.issuesWithColon, { n: e.numberOfIssues() }),
			accessibleName: r
		};
	}
	scheduleViewportRefresh() {
		if (this.muteViewportUpdates) {
			this.maybeDirtyWhileMuted = !0;
			return;
		}
		this.scheduledRefreshPromiseForTest = this.viewportThrottler.schedule(this.invalidateViewport.bind(this));
	}
	getScheduledRefreshPromiseForTest() {
		return this.scheduledRefreshPromiseForTest;
	}
	immediatelyScrollToBottom() {
		this.viewport.setStickToBottom(!0), this.promptElement.scrollIntoView(!0);
	}
	updateFilterStatus() {
		this.hiddenByFilterCount !== this.lastShownHiddenByFilterCount && (this.filterStatusText.setText(Q(Z.sHidden, { n: this.hiddenByFilterCount })), this.filterStatusText.setVisible(!!this.hiddenByFilterCount), this.lastShownHiddenByFilterCount = this.hiddenByFilterCount);
	}
	onConsoleMessageAdded(e) {
		let t = e.data;
		this.addConsoleMessage(t);
	}
	addConsoleMessage(e) {
		let t = this.createViewMessage(e);
		if (Da.set(e, t), e.type === w.Command || e.type === w.Result) {
			let e = this.consoleMessages[this.consoleMessages.length - 1], n = e && Ea.get(e) || 0;
			Ea.set(t, n);
		} else Ea.set(t, t.consoleMessage().timestamp);
		let n;
		n = !this.consoleMessages.length || s(t, this.consoleMessages[this.consoleMessages.length - 1]) > 0 ? this.consoleMessages.length : ee(this.consoleMessages, t, s);
		let r = n < this.consoleMessages.length;
		if (this.consoleMessages.splice(n, 0, t), e.type === w.Command) this.prompt.history().pushHistoryItem(e.messageText), this.prompt.history().length() >= ba && !this.selfXssWarningDisabledSetting.get() && this.selfXssWarningDisabledSetting.set(!0);
		else if (e.type !== w.Result) {
			let r = ee(this.consoleGroupStarts, t, s) - 1;
			if (r >= 0) {
				let e = this.consoleGroupStarts[r];
				o(t, e);
			}
			e.isGroupStartMessage() && (n = ee(this.consoleGroupStarts, t, s), this.consoleGroupStarts.splice(n, 0, t));
		}
		this.filter.onMessageAdded(e), this.isSidebarOpen ? this.sidebar.onMessageAdded(t) : this.pendingSidebarMessages.push(t);
		let i = !1, a = this.groupSimilarSetting.get();
		if (e.isGroupable()) {
			let e = t.groupKey();
			i = a && this.groupableMessages.has(e);
			let n = this.groupableMessages.get(e);
			n || (n = [], this.groupableMessages.set(e, n)), n.push(t);
		}
		this.computeShouldMessageBeVisible(t), !i && !r ? (this.appendMessageToEnd(t, !a), this.updateFilterStatus(), this.#e.updateSearchMatchesCount(this.regexMatchRanges.length)) : this.needsFullUpdate = !0, this.scheduleViewportRefresh(), this.consoleMessageAddedForTest(t);
		function o(e, t) {
			let n = t.groupEnd();
			if (n !== null && s(e, n) > 0) {
				let n = t.consoleGroup();
				if (n === null) return;
				o(e, n);
				return;
			}
			e.consoleMessage().type === T.ConsoleAPICalledEventType.EndGroup ? t.setGroupEnd(e) : e.setConsoleGroup(t);
		}
		function s(e, t) {
			return (Ea.get(e) || 0) - (Ea.get(t) || 0);
		}
	}
	onConsoleMessageUpdated(e) {
		let t = e.data, n = Da.get(t);
		n && (n.updateMessageElement(), this.computeShouldMessageBeVisible(n), this.updateMessageList());
	}
	consoleMessageAddedForTest(e) {}
	shouldMessageBeVisible(e) {
		return !this.shouldBeHiddenCache.has(e);
	}
	computeShouldMessageBeVisible(e) {
		this.filter.shouldBeVisible(e) && (!this.isSidebarOpen || this.sidebar.shouldBeVisible(e)) ? this.shouldBeHiddenCache.delete(e) : this.shouldBeHiddenCache.add(e);
	}
	appendMessageToEnd(e, t) {
		if (e.consoleMessage().category === h.LogEntryCategory.Cors && !this.showCorsErrorsSetting.get()) return;
		let n = this.visibleViewMessages[this.visibleViewMessages.length - 1];
		if (e.consoleMessage().type === T.ConsoleAPICalledEventType.EndGroup) {
			if (n) {
				let e = n.consoleGroup();
				e && !e.messagesHidden() && n.incrementCloseGroupDecorationCount();
			}
			return;
		}
		if (!this.shouldMessageBeVisible(e)) {
			this.hiddenByFilterCount++;
			return;
		}
		if (!t && this.tryToCollapseMessages(e, this.visibleViewMessages[this.visibleViewMessages.length - 1])) return;
		let r = e.consoleGroup();
		if (i(r, this.visibleViewMessages), !r?.messagesHidden()) {
			let t = e.consoleMessage().originatingMessage(), r = !!(t && n?.consoleMessage() === t);
			e.setAdjacentUserCommandResult(r), this.visibleViewMessages.push(e), this.searchMessage(this.visibleViewMessages.length - 1);
		}
		this.messageAppendedForTests();
		function i(e, t) {
			if (e === null || t.includes(e)) return;
			let n = e.consoleGroup();
			if (n) {
				if (n.messagesHidden()) return;
				i(n, t);
			}
			t.push(e);
		}
	}
	messageAppendedForTests() {}
	createViewMessage(e) {
		switch (e.type) {
			case w.Command: return new ti(e, this.linkifier, this.requestResolver, this.issueResolver, this.onMessageResizedBound);
			case w.Result: return new ni(e, this.linkifier, this.requestResolver, this.issueResolver, this.onMessageResizedBound);
			case T.ConsoleAPICalledEventType.StartGroupCollapsed:
			case T.ConsoleAPICalledEventType.StartGroup: return new ei(e, this.linkifier, this.requestResolver, this.issueResolver, this.updateMessageList.bind(this), this.onMessageResizedBound);
			case T.ConsoleAPICalledEventType.Table: return new ri(e, this.linkifier, this.requestResolver, this.issueResolver, this.onMessageResizedBound);
			default: return new H(e, this.linkifier, this.requestResolver, this.issueResolver, this.onMessageResizedBound);
		}
	}
	async onMessageResized(e) {
		let t = e.data instanceof _t ? e.data.treeOutline?.element : e.data;
		!this.pendingBatchResize && t && (this.pendingBatchResize = !0, await Promise.resolve(), this.viewport.setStickToBottom(this.isScrolledToBottom()), t.offsetHeight <= this.messagesElement.offsetHeight && t.scrollIntoViewIfNeeded(), this.pendingBatchResize = !1);
	}
	getConsoleMessageHistory() {
		let e = S.instance().flavor(y), t = "";
		if (e) {
			let n = e.target().model(x);
			if (n) {
				let e = "";
				for (let r of n.messages()) r.type === w.Command && r.messageText !== e && (e = r.messageText, t = t + r.messageText + "\n\n");
			}
		}
		return t;
	}
	consoleCleared() {
		let e = this.viewport.element.hasFocus();
		this.cancelBuildHiddenCache(), this.currentMatchRangeIndex = -1, this.consoleMessages = [], this.groupableMessages.clear(), this.groupableMessageTitle.clear(), this.sidebar.clear(), this.pendingSidebarMessages = [], this.updateMessageList(), this.hidePromptSuggestBox(), this.viewport.setStickToBottom(!0), this.linkifier.reset(), this.filter.clear(), this.requestResolver.clear(), this.consoleGroupStarts = [], this.aiCodeCompletionSummaryToolbar?.clearCitations(), e && this.prompt.focus(), Ne.alert(Q(Z.consoleCleared));
	}
	handleContextMenuEvent(e) {
		let t = new nt(e), n = e.target;
		if (n.isSelfOrDescendant(this.promptElement)) {
			t.show();
			return;
		}
		let r = n.enclosingNodeOrSelfWithClass("console-message-wrapper"), i = r && Ur(r), a = i ? i.consoleMessage() : null;
		if (i && S.instance().setFlavor(H, i), a && !i?.element()?.matches(".has-insight") && i?.shouldShowInsights() && t.headerSection().appendAction(i?.getExplainActionId(), void 0, !0), a?.url) {
			let e = Q(Z.hideMessagesFromS, { PH1: new m(a.url).displayName });
			t.headerSection().appendItem(e, this.filter.addMessageURLFilter.bind(this.filter, a.url), { jslogContext: "hide-messages-from" });
		}
		if (t.defaultSection().appendAction("console.clear"), t.defaultSection().appendAction("console.clear.history"), t.saveSection().appendItem(Q(Z.copyConsole), this.copyConsole.bind(this), { jslogContext: "copy-console" }), t.saveSection().appendItem(Q(Z.saveAs), this.saveConsole.bind(this), { jslogContext: "save-as" }), this.element.hasSelection() && t.clipboardSection().appendItem(Q(Z.copyVisibleStyledSelection), this.viewport.copyWithStyles.bind(this.viewport), { jslogContext: "copy-visible-styled-selection" }), a) {
			let e = gn.requestForConsoleMessage(a);
			e && gt.canReplayRequest(e) && t.debugSection().appendItem(Q(Z.replayXhr), gt.replayRequest.bind(null, e), { jslogContext: "replay-xhr" });
		}
		t.show();
	}
	async saveConsole() {
		let e = E.instance().scopeTarget().inspectedURL(), t = m.fromString(e), n = Qt("%s-%d.log", t ? t.host : "console", Date.now()), r = new an(), i = document.createElement("devtools-progress");
		if (i.title = Q(Z.writingFile), i.totalWork = this.itemCount(), !await r.open(n)) return;
		this.progressToolbarItem.element.appendChild(i);
		let a = 0;
		for (; a < this.itemCount() && !i.canceled;) {
			let e = [], t = 0;
			for (; t < 350 && t + a < this.itemCount(); ++t) {
				let n = this.itemElement(a + t);
				e.push(n.toExportString());
			}
			a += t, await r.write(e.join("\n") + "\n"), i.worked = a;
		}
		r.close(), i.done = !0;
	}
	async copyConsole() {
		let e = [];
		for (let t = 0; t < this.itemCount(); t++) {
			let n = this.itemElement(t);
			e.push(n.toExportString());
		}
		Ke.copyText(e.join("\n") + "\n");
	}
	tryToCollapseMessages(e, t) {
		return !this.timestampsSetting.get() && t && !e.consoleMessage().isGroupMessage() && e.consoleMessage().type !== w.Command && e.consoleMessage().type !== w.Result && e.consoleMessage().isEqual(t.consoleMessage()) ? (t.incrementRepeatCount(), e.isLastInSimilarGroup() && t.setInSimilarGroup(!0, !0), !0) : !1;
	}
	buildHiddenCache(e, t) {
		let n = Date.now(), r;
		for (r = e; r < t.length && (this.computeShouldMessageBeVisible(t[r]), !(r % 10 == 0 && Date.now() - n > 12)); ++r);
		if (r === t.length) {
			this.updateMessageList();
			return;
		}
		this.buildHiddenCacheTimeout = this.element.window().requestAnimationFrame(this.buildHiddenCache.bind(this, r + 1, t));
	}
	cancelBuildHiddenCache() {
		this.shouldBeHiddenCache.clear(), this.buildHiddenCacheTimeout && (this.element.window().cancelAnimationFrame(this.buildHiddenCacheTimeout), delete this.buildHiddenCacheTimeout);
	}
	updateMessageList() {
		this.regexMatchRanges = [], this.hiddenByFilterCount = 0;
		for (let e of this.visibleViewMessages) e.resetCloseGroupDecorationCount(), e.resetIncrementRepeatCount();
		if (this.visibleViewMessages = [], this.groupSimilarSetting.get()) this.addGroupableMessagesToEnd();
		else for (let e of this.consoleMessages) {
			if (e.setInSimilarGroup(!1), e.consoleMessage().isGroupable()) {
				let t = e.consoleGroup();
				t && !this.consoleGroupStarts.includes(t) && e.clearConsoleGroup();
			}
			this.appendMessageToEnd(e, !0);
		}
		this.updateFilterStatus(), this.#e.updateSearchMatchesCount(this.regexMatchRanges.length), this.highlightMatch(this.currentMatchRangeIndex, !1), this.#u(), this.viewport.invalidate(), this.messagesCountElement.setAttribute("aria-label", Q(Z.filteredMessagesInConsole, { PH1: this.visibleViewMessages.length }));
	}
	addGroupableMessagesToEnd() {
		let e = /* @__PURE__ */ new Set(), t = /* @__PURE__ */ new Set();
		for (let n of this.consoleMessages) {
			let r = n.consoleMessage();
			if (e.has(r)) continue;
			if (!r.isGroupable()) {
				this.appendMessageToEnd(n), e.add(r);
				continue;
			}
			let i = n.groupKey(), a = this.groupableMessages.get(i);
			if (!a || a.length < 5) {
				n.setInSimilarGroup(!1), this.appendMessageToEnd(n), e.add(r);
				continue;
			}
			if (t.has(i)) continue;
			if (!a.find((e) => this.shouldMessageBeVisible(e))) {
				for (let t of a) e.add(t.consoleMessage());
				t.add(i);
				continue;
			}
			let o = this.groupableMessageTitle.get(i);
			if (!o) {
				let e = new We(null, r.source, r.level, n.groupTitle(), { type: T.ConsoleAPICalledEventType.StartGroupCollapsed });
				o = this.createViewMessage(e), this.groupableMessageTitle.set(i, o);
			}
			o.setRepeatCount(a.length), this.appendMessageToEnd(o);
			for (let t of a) t.setInSimilarGroup(!0, a[a.length - 1] === t), t.setConsoleGroup(o), this.appendMessageToEnd(t, !0), e.add(t.consoleMessage());
			let s = new We(null, r.source, r.level, r.messageText, { type: T.ConsoleAPICalledEventType.EndGroup });
			this.appendMessageToEnd(this.createViewMessage(s));
		}
	}
	messagesClicked(e) {
		let t = e.target;
		this.messagesElement.hasSelection() || (t === this.messagesElement || this.prompt.belowEditorElement().isSelfOrAncestor(t)) && (this.prompt.moveCaretToEndOfPrompt(), this.focusPrompt());
	}
	messagesKeyDown(e) {
		let t = e;
		t.ctrlKey || t.altKey || t.metaKey || t.key.length !== 1 || De() || this.messagesElement.hasSelection() || (this.prompt.moveCaretToEndOfPrompt(), this.focusPrompt());
	}
	messagesPasted(e) {
		!M.queryParam("isChromeForTesting") && !M.queryParam("disableSelfXssWarnings") && !this.selfXssWarningDisabledSetting.get() && (e.preventDefault(), this.prompt.showSelfXssWarning()), !De() && this.prompt.focus();
	}
	registerShortcuts() {
		this.shortcuts.set(ze.makeKey("u", xe.Ctrl.value), this.clearPromptBackwards.bind(this));
	}
	clearPromptBackwards(e) {
		this.prompt.clear(), Ie(e.currentTarget, e, "clear-prompt");
	}
	promptKeyDown(e) {
		let t = e;
		if (t.key === "PageUp") {
			this.updateStickToBottomOnWheel();
			return;
		}
		let n = ze.makeKeyFromEvent(t), r = this.shortcuts.get(n);
		r && (r(t), t.preventDefault());
	}
	printResult(e, t, n) {
		if (!e) return;
		let r = n ? h.LogEntryLevel.Error : h.LogEntryLevel.Info, i;
		i = n ? We.fromException(e.runtimeModel(), n, w.Result, void 0, void 0) : new We(e.runtimeModel(), h.LogEntrySource.Javascript, r, "", {
			type: w.Result,
			parameters: [e]
		}), i.setOriginatingMessage(t), e.runtimeModel().target().model(x)?.addMessage(i);
	}
	commandEvaluated(e) {
		let { data: t } = e;
		this.printResult(t.result, t.commandMessage, t.exceptionDetails);
	}
	elementsToRestoreScrollPositionsFor() {
		return [this.messagesElement];
	}
	onSearchCanceled() {
		this.cleanupAfterSearch();
		for (let e of this.visibleViewMessages) e.setSearchRegex(null);
		this.currentMatchRangeIndex = -1, this.regexMatchRanges = [], this.searchRegex = null, this.viewport.refresh();
	}
	performSearch(e, t, n) {
		this.onSearchCanceled(), this.#e.updateSearchMatchesCount(0), this.searchRegex = e.toSearchRegex(!0).regex, this.regexMatchRanges = [], this.currentMatchRangeIndex = -1, t && (this.searchShouldJumpBackwards = !!n), this.searchProgressIndicator = document.createElement("devtools-progress"), this.searchProgressIndicator.title = Q(Z.searching), this.searchProgressIndicator.totalWork = this.visibleViewMessages.length, this.progressToolbarItem.element.appendChild(this.searchProgressIndicator), this.#f(0);
	}
	cleanupAfterSearch() {
		delete this.searchShouldJumpBackwards, this.#t &&= (clearTimeout(this.#t), void 0), this.searchProgressIndicator && (this.searchProgressIndicator.done = !0, delete this.searchProgressIndicator);
	}
	searchFinishedForTests() {}
	#f(e) {
		if (this.#t = void 0, this.searchProgressIndicator?.canceled) {
			this.cleanupAfterSearch();
			return;
		}
		let t = Date.now();
		for (; e < this.visibleViewMessages.length && Date.now() - t < 100; ++e) this.searchMessage(e);
		if (this.#e.updateSearchMatchesCount(this.regexMatchRanges.length), this.searchShouldJumpBackwards !== void 0 && this.regexMatchRanges.length && (this.highlightMatch(this.searchShouldJumpBackwards ? -1 : 0), delete this.searchShouldJumpBackwards), e === this.visibleViewMessages.length) {
			this.cleanupAfterSearch(), window.setTimeout(this.searchFinishedForTests.bind(this), 0);
			return;
		}
		this.#t = window.setTimeout(this.#f.bind(this, e), 100), this.searchProgressIndicator && (this.searchProgressIndicator.worked = e);
	}
	searchMessage(e) {
		let t = this.visibleViewMessages[e];
		t.setSearchRegex(this.searchRegex);
		for (let n = 0; n < t.searchCount(); ++n) this.regexMatchRanges.push({
			messageIndex: e,
			matchIndex: n
		});
	}
	jumpToNextSearchResult() {
		this.highlightMatch(this.currentMatchRangeIndex + 1);
	}
	jumpToPreviousSearchResult() {
		this.highlightMatch(this.currentMatchRangeIndex - 1);
	}
	supportsCaseSensitiveSearch() {
		return !0;
	}
	supportsWholeWordSearch() {
		return !0;
	}
	supportsRegexSearch() {
		return !0;
	}
	highlightMatch(e, t = !0) {
		if (!this.regexMatchRanges.length) return;
		let n;
		this.currentMatchRangeIndex >= 0 && (n = this.regexMatchRanges[this.currentMatchRangeIndex], this.visibleViewMessages[n.messageIndex].searchHighlightNode(n.matchIndex).classList.remove(rt)), e = xt(e, this.regexMatchRanges.length), this.currentMatchRangeIndex = e, this.#e.updateCurrentMatchIndex(e), n = this.regexMatchRanges[e];
		let r = this.visibleViewMessages[n.messageIndex].searchHighlightNode(n.matchIndex);
		r.classList.add(rt), t && (this.viewport.scrollItemIntoView(n.messageIndex), r.scrollIntoViewIfNeeded());
	}
	updateStickToBottomOnPointerDown(e) {
		this.muteViewportUpdates = !e, this.viewport.setStickToBottom(!1), this.waitForScrollTimeout && (clearTimeout(this.waitForScrollTimeout), delete this.waitForScrollTimeout);
	}
	updateStickToBottomOnPointerUp() {
		if (!this.muteViewportUpdates) return;
		this.waitForScrollTimeout = window.setTimeout(e.bind(this), 200);
		function e() {
			this.muteViewportUpdates = !1, this.isShowing() && this.viewport.setStickToBottom(this.isScrolledToBottom()), this.maybeDirtyWhileMuted && (this.scheduleViewportRefresh(), delete this.maybeDirtyWhileMuted), delete this.waitForScrollTimeout, this.updateViewportStickinessForTest();
		}
	}
	updateViewportStickinessForTest() {}
	updateStickToBottomOnWheel() {
		this.updateStickToBottomOnPointerDown(), this.updateStickToBottomOnPointerUp();
	}
	promptTextChanged() {
		let e = this.viewport.stickToBottom(), t = this.isScrolledToBottom();
		this.viewport.setStickToBottom(t), t && !e && this.scheduleViewportRefresh(), this.promptTextChangedForTest();
	}
	promptTextChangedForTest() {}
	isScrolledToBottom() {
		return this.messagesElement.scrollHeight - this.messagesElement.scrollTop - this.messagesElement.clientHeight - this.prompt.belowEditorElement().offsetHeight <= 2;
	}
	setupAiCodeCompletion() {
		this.createAiCodeCompletionSummaryToolbar();
	}
	cleanupAiCodeCompletion() {
		this.aiCodeCompletionSummaryToolbarContainer?.remove(), this.aiCodeCompletionSummaryToolbarContainer = void 0, this.aiCodeCompletionSummaryToolbar = void 0;
	}
};
globalThis.Console = globalThis.Console || {}, globalThis.Console.ConsoleView = $;
var wa = class e {
	filterChanged;
	messageLevelFiltersSetting;
	networkMessagesSetting;
	filterByExecutionContextSetting;
	suggestionBuilder;
	textFilterUI;
	textFilterSetting;
	filterParser;
	currentFilter;
	levelLabels;
	levelMenuButton;
	levelMenuButtonInfo;
	constructor(t) {
		this.filterChanged = t, this.messageLevelFiltersSetting = e.levelFilterSetting(), this.networkMessagesSetting = p.instance().moduleSetting("network-messages"), this.filterByExecutionContextSetting = p.instance().moduleSetting("selected-context-filter-enabled"), this.messageLevelFiltersSetting.addChangeListener(this.onFilterChanged.bind(this)), this.networkMessagesSetting.addChangeListener(this.onFilterChanged.bind(this)), this.filterByExecutionContextSetting.addChangeListener(this.onFilterChanged.bind(this)), S.instance().addFlavorChangeListener(y, this.onFilterChanged, this);
		let n = Object.values(R);
		this.suggestionBuilder = new bt(n), this.textFilterUI = new ce(void 0, 1, 1, Q(Z.egEventdCdnUrlacom), this.suggestionBuilder.completions.bind(this.suggestionBuilder), !0), this.textFilterSetting = p.instance().createSetting("console.text-filter", ""), this.textFilterSetting.get() && this.textFilterUI.setValue(this.textFilterSetting.get()), this.textFilterUI.addEventListener(st.Event.TEXT_CHANGED, () => {
			this.textFilterSetting.set(this.textFilterUI.value()), this.onFilterChanged();
		}), this.filterParser = new Gt(n), this.currentFilter = new L("", [], null, this.messageLevelFiltersSetting.get()), this.updateCurrentFilter(), this.levelLabels = /* @__PURE__ */ new Map([
			[h.LogEntryLevel.Verbose, Q(Z.verbose)],
			[h.LogEntryLevel.Info, Q(Z.info)],
			[h.LogEntryLevel.Warning, Q(Z.warnings)],
			[h.LogEntryLevel.Error, Q(Z.errors)]
		]), this.levelMenuButton = new et(this.appendLevelMenuItems.bind(this), void 0, void 0, "log-level");
		let r = Ce("info", "console-sidebar-levels-info");
		r.title = Q(Z.overriddenByFilterSidebar), this.levelMenuButtonInfo = new Nt(r), this.levelMenuButtonInfo.setVisible(!1), this.updateLevelMenuButtonText(), this.messageLevelFiltersSetting.addChangeListener(this.updateLevelMenuButtonText.bind(this));
	}
	onMessageAdded(e) {
		e.type === w.Command || e.type === w.Result || e.isGroupMessage() || (e.context && this.suggestionBuilder.addItem(R.Context, e.context), e.source && this.suggestionBuilder.addItem(R.Source, e.source), e.url && this.suggestionBuilder.addItem(R.Url, e.url));
	}
	setLevelMenuOverridden(e) {
		this.levelMenuButton.setEnabled(!e), this.levelMenuButtonInfo.setVisible(e), e ? this.levelMenuButton.setText(Q(Z.customLevels)) : this.updateLevelMenuButtonText();
	}
	static levelFilterSetting() {
		return p.instance().createSetting("message-level-filters", L.defaultLevelsFilterValue());
	}
	updateCurrentFilter() {
		let e = this.filterParser.parse(this.textFilterUI.value());
		for (let { key: t } of e) switch (t) {
			case R.Context:
				C.actionTaken(A.ConsoleFilterByContext);
				break;
			case R.Source:
				C.actionTaken(A.ConsoleFilterBySource);
				break;
			case R.Url: C.actionTaken(A.ConsoleFilterByUrl);
		}
		this.networkMessagesSetting.get() || e.push({
			key: R.Source,
			text: h.LogEntrySource.Network,
			negative: !0,
			regex: void 0
		}), this.currentFilter.executionContext = this.filterByExecutionContextSetting.get() ? S.instance().flavor(y) : null, this.currentFilter.parsedFilters = e, this.currentFilter.levelsMask = this.messageLevelFiltersSetting.get();
	}
	onFilterChanged() {
		this.updateCurrentFilter(), this.filterChanged();
	}
	updateLevelMenuButtonText() {
		let e = !0, t = !0, n = L.allLevelsFilterValue(), r = L.defaultLevelsFilterValue(), i = null, a = this.messageLevelFiltersSetting.get(), o = {
			Verbose: h.LogEntryLevel.Verbose,
			Info: h.LogEntryLevel.Info,
			Warning: h.LogEntryLevel.Warning,
			Error: h.LogEntryLevel.Error
		};
		for (let s of Object.values(o)) e &&= a[s] === n[s], t &&= a[s] === r[s], a[s] && (i = i ? Q(Z.customLevels) : Q(Z.sOnly, { PH1: String(this.levelLabels.get(s)) }));
		e ? i = Q(Z.allLevels) : t ? i = Q(Z.defaultLevels) : i ||= Q(Z.hideAll), this.levelMenuButton.element.classList.toggle("warning", !e && !t), this.levelMenuButton.setText(i), this.levelMenuButton.setTitle(Q(Z.logLevelS, { PH1: i }));
	}
	appendLevelMenuItems(e) {
		let t = this.messageLevelFiltersSetting, n = t.get();
		e.headerSection().appendItem(Q(Z.default), () => t.set(L.defaultLevelsFilterValue()), { jslogContext: "default" });
		for (let [t, i] of this.levelLabels.entries()) e.defaultSection().appendCheckboxItem(i, r.bind(null, t), {
			checked: n[t],
			jslogContext: t
		});
		function r(e) {
			n[e] = !n[e], t.set(n);
		}
	}
	addMessageURLFilter(e) {
		if (!e) return;
		let t = this.textFilterUI.value() ? ` ${this.textFilterUI.value()}` : "";
		this.textFilterUI.setValue(`-url:${e}${t}`), this.textFilterSetting.set(this.textFilterUI.value()), this.onFilterChanged();
	}
	shouldBeVisible(e) {
		return this.currentFilter.shouldBeVisible(e);
	}
	clear() {
		this.suggestionBuilder.clear();
	}
	reset() {
		this.messageLevelFiltersSetting.set(L.defaultLevelsFilterValue()), this.filterByExecutionContextSetting.set(!1), this.networkMessagesSetting.set(!0), this.textFilterUI.setValue(""), this.onFilterChanged();
	}
}, Ta = class {
	handleAction(e, t) {
		switch (t) {
			case "console.toggle": {
				let e = Te.instance(), t = $.instance();
				return e.drawerVisible() && !e.isDrawerMinimized() && t.isShowing() && t.hasFocus() ? (e.minimizeDrawer(), !0) : (e.drawerVisible() && e.isDrawerMinimized() && e.setDrawerMinimized(!1), Ke.bringToFront(), ae.instance().show(), t.focusPrompt(), !0);
			}
			case "console.clear": return $.instance().clearConsole(), !0;
			case "console.clear.history": return $.instance().clearHistory(), !0;
			case "console.create-pin": return $.instance().pinPane.addPin("", !0), !0;
		}
		return !1;
	}
}, Ea = /* @__PURE__ */ new WeakMap(), Da = /* @__PURE__ */ new WeakMap(), Oa = /* @__PURE__ */ e({
	ConsolePanel: () => Aa,
	ConsoleRevealer: () => Na,
	WrapperView: () => Ma
}), ka, Aa = class e extends ke {
	view;
	#e = !1;
	constructor() {
		super("console"), this.view = $.instance();
	}
	static instance(t = { forceNew: null }) {
		let { forceNew: n } = t;
		return (!ka || n) && (ka = new e()), ka;
	}
	static updateContextFlavor() {
		let t = e.instance().view;
		S.instance().setFlavor($, t.isShowing() ? t : null);
	}
	wasShown() {
		super.wasShown();
		let t = Te.instance();
		this.#e = t.isDrawerMinimized(), ja?.isShowing() && t.setDrawerMinimized(!0), this.view.show(this.element), e.updateContextFlavor();
	}
	willHide() {
		super.willHide();
		let t = Te.instance();
		t.setDrawerMinimized(!1), ja && ja.showViewInWrapper(), this.#e && t.setDrawerMinimized(!0), e.updateContextFlavor();
	}
	searchableView() {
		return $.instance().searchableView();
	}
}, ja = null, Ma = class e extends at {
	view;
	constructor() {
		super({ jslog: `${ve("console").track({ resize: !0 })}` }), this.view = $.instance();
	}
	static instance() {
		return ja ||= new e(), ja;
	}
	wasShown() {
		super.wasShown(), Aa.instance().isShowing() ? Te.instance().setDrawerMinimized(!0) : this.showViewInWrapper(), Aa.updateContextFlavor();
	}
	willHide() {
		super.willHide(), Aa.updateContextFlavor();
	}
	showViewInWrapper() {
		this.view.show(this.element);
	}
}, Na = class {
	async reveal(e) {
		let t = $.instance();
		if (t.isShowing()) {
			t.focus();
			return;
		}
		await yt.instance().showView("console-view");
	}
}, Pa = "/*\n * Copyright 2018 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n#console-prompt .CodeMirror {\n  padding: 3px 0 1px;\n}\n\n#console-prompt .CodeMirror-line {\n  padding-top: 0;\n}\n\n#console-prompt .CodeMirror-lines {\n  padding-top: 0;\n}\n\n#console-prompt .console-prompt-icon {\n  position: absolute;\n  left: -9px;\n  top: 4px;\n  user-select: none;\n}\n\n.console-eager-preview {\n  padding-bottom: 2px;\n  margin-left: 4px;\n  opacity: 60%;\n  position: relative;\n}\n\n.console-eager-inner-preview {\n  text-overflow: ellipsis;\n  overflow: hidden;\n  margin-left: 4px;\n  height: 100%;\n  white-space: nowrap;\n}\n\n.preview-result-icon {\n  position: absolute;\n  left: -13px;\n  top: -1px;\n}\n\n.console-eager-inner-preview:empty,\n.console-eager-inner-preview:empty + .preview-result-icon {\n  opacity: 0%;\n}\n\n.console-prompt-icon.console-prompt-incomplete {\n  opacity: 65%;\n}\n", Fa = /* @__PURE__ */ e({
	ConsolePrompt: () => Ba,
	Events: () => Va
}), { Direction: Ia } = tr, La = {
	consolePrompt: "Console prompt",
	selfXssWarning: "Warning: Don’t paste code into the DevTools Console that you don’t understand or haven’t reviewed yourself. This could allow attackers to steal your identity or take control of your computer. Please type “{PH1}” below and press Enter to allow pasting.",
	allowPasting: "allow pasting"
}, Ra = o("panels/console/ConsolePrompt.ts", La), za = a.bind(void 0, Ra), Ba = class extends n(k) {
	addCompletionsFromHistory;
	#e;
	initialText;
	editor;
	eagerPreviewElement;
	textChangeThrottler;
	requestPreviewBound;
	requestPreviewCurrent = 0;
	innerPreviewElement;
	promptIcon;
	iconThrottler;
	eagerEvalSetting;
	previewRequestForTest;
	highlightingNode;
	#t;
	#n;
	#r = !1;
	#i = new kn();
	aiCodeCompletionConfig;
	aiCodeCompletionProvider;
	#a() {
		return this.#r ? [] : M.queryParam("noJavaScriptCompletion") === "true" ? [Ln.javascriptLanguage] : [Ln.javascript(), Xn()];
	}
	#o() {
		let e = this.#a(), t = this.#i.reconfigure(e);
		this.editor.dispatch({ effects: t });
	}
	constructor(e) {
		super({ jslog: `${It("console-prompt").track({
			change: !0,
			keydown: "Enter|ArrowUp|ArrowDown|PageUp"
		})}` }), this.registerRequiredCSS(Pa), this.addCompletionsFromHistory = !0, this.#e = new ur(p.instance().createLocalSetting("console-history", [])), this.initialText = "", this.eagerPreviewElement = document.createElement("div"), this.eagerPreviewElement.classList.add("console-eager-preview"), this.textChangeThrottler = new dt(150), this.requestPreviewBound = this.requestPreview.bind(this), this.innerPreviewElement = this.eagerPreviewElement.createChild("div", "console-eager-inner-preview");
		let t = new D();
		t.name = "chevron-left-dot", t.classList.add("preview-result-icon", "medium"), this.eagerPreviewElement.appendChild(t);
		let n = this.element.createChild("div", "console-prompt-editor-container");
		this.element.appendChild(this.eagerPreviewElement), this.promptIcon = new D(), this.promptIcon.name = "chevron-right", this.promptIcon.style.color = "var(--icon-action)", this.promptIcon.classList.add("console-prompt-icon", "medium"), this.element.appendChild(this.promptIcon), this.iconThrottler = new dt(0), this.eagerEvalSetting = p.instance().moduleSetting("console-eager-eval"), this.eagerEvalSetting.addChangeListener(this.eagerSettingChanged.bind(this)), this.eagerPreviewElement.classList.toggle("hidden", !this.eagerEvalSetting.get()), this.element.tabIndex = 0, this.previewRequestForTest = null, this.highlightingNode = !1;
		let r = Jn();
		this.#t = r[0];
		let i = qn.bool("console-autocomplete-on-enter", [], or), a = [
			Nn.of(this.editorKeymap()),
			P.updateListener.of((e) => this.editorUpdate(e)),
			r,
			i.instance(),
			Wn,
			sr(this.initialText),
			Yn.instance(),
			Ln.javascriptLanguage.data.of({ autocomplete: (e) => this.addCompletionsFromHistory ? this.#n.historyCompletions(e) : null }),
			P.contentAttributes.of({ "aria-label": za(La.consolePrompt) }),
			P.lineWrapping,
			Fn({ aboveCursor: !0 }),
			this.#i.of(this.#a())
		];
		this.aiCodeCompletionConfig = e, this.aiCodeCompletionConfig && (this.aiCodeCompletionProvider = rr.createInstance(this.aiCodeCompletionConfig), a.push(...this.aiCodeCompletionProvider.extension()));
		let o = this.initialText, s = Dn.create({
			doc: o,
			extensions: a
		});
		this.editor = new ir(s), this.aiCodeCompletionProvider && (this.aiCodeCompletionProvider.editorInitialized(this.editor), this.editor.editor.dispatch({ effects: Zn.of(er.ONLY_SHOW_ON_EMPTY) })), this.editor.addEventListener("keydown", (e) => {
			e.defaultPrevented && e.stopPropagation();
		}), n.appendChild(this.editor), this.#n = new ar(this.editor, this.#e), this.hasFocus() && this.focus(), this.element.removeAttribute("tabindex"), this.editorSetForTest(), St.instance().panelLoaded("console", "DevTools.Launch.Console");
	}
	eagerSettingChanged() {
		let e = this.eagerEvalSetting.get();
		this.eagerPreviewElement.classList.toggle("hidden", !e), e && this.requestPreview();
	}
	belowEditorElement() {
		return this.eagerPreviewElement;
	}
	onTextChanged() {
		if (this.eagerEvalSetting.get()) {
			let e = !Kn(this.editor.editor);
			this.previewRequestForTest = this.textChangeThrottler.schedule(this.requestPreviewBound, e ? it.AS_SOON_AS_POSSIBLE : it.DEFAULT);
		}
		this.updatePromptIcon(), this.dispatchEventToListeners("TextChanged");
	}
	async requestPreview() {
		let e = ++this.requestPreviewCurrent, t = Kn(this.editor.editor).trim(), n = S.instance().flavor(y), { preview: r, result: i } = await Un.evaluateAndBuildPreview(t, !0, !0, 500);
		this.requestPreviewCurrent === e && (this.innerPreviewElement.removeChildren(), r.deepTextContent() !== Kn(this.editor.editor).trim() && this.innerPreviewElement.appendChild(r), i && "object" in i && i.object?.subtype === "node" ? (this.highlightingNode = !0, O.highlightObjectAsDOMNode(i.object)) : this.highlightingNode && (this.highlightingNode = !1, O.hideDOMNodeHighlight()), i && n && n.runtimeModel.releaseEvaluationResult(i));
	}
	willHide() {
		super.willHide(), this.highlightingNode && (this.highlightingNode = !1, O.hideDOMNodeHighlight());
	}
	history() {
		return this.#e;
	}
	clearAutocomplete() {
		An(this.editor.editor);
	}
	clearAiCodeCompletionCache() {
		this.aiCodeCompletionProvider?.clearCache();
	}
	moveCaretToEndOfPrompt() {
		this.editor.dispatch({ selection: Mn.cursor(this.editor.state.doc.length) });
	}
	clear() {
		this.editor.dispatch({ changes: {
			from: 0,
			to: this.editor.state.doc.length
		} });
	}
	text() {
		return this.editor.state.doc.toString();
	}
	setAddCompletionsFromHistory(e) {
		this.addCompletionsFromHistory = e;
	}
	editorKeymap() {
		return [
			{ any: (e, t) => t.repeat ? !1 : t.key === "ArrowUp" ? this.#n.moveHistory(Ia.BACKWARD) : t.key === "ArrowDown" && this.#n.moveHistory(Ia.FORWARD) },
			{
				mac: "Ctrl-p",
				run: () => this.#n.moveHistory(Ia.BACKWARD, !0)
			},
			{
				mac: "Ctrl-n",
				run: () => this.#n.moveHistory(Ia.FORWARD, !0)
			},
			{
				key: "Escape",
				run: () => nr(this.editor.editor, this.#t)
			},
			{
				key: "Ctrl-Enter",
				run: () => (this.handleEnter(!0), !0)
			},
			{
				key: "Enter",
				run: () => (this.handleEnter(), !0),
				shift: In
			}
		];
	}
	async enterWillEvaluate(e) {
		let { doc: t, selection: n } = this.editor.state;
		if (!t.length) return !1;
		if (e || n.main.head < t.length) return !0;
		let r = S.instance().flavor(y), i = await $n(t.toString());
		return r === S.instance().flavor(y) && i;
	}
	showSelfXssWarning() {
		ae.instance().warn(za(La.selfXssWarning, { PH1: za(La.allowPasting) }), r.SELF_XSS), this.#r = !0, C.actionTaken(A.SelfXssWarningConsoleMessageShown), this.#o();
	}
	async handleEnter(e) {
		if (this.#r && (this.text() === za(La.allowPasting) || this.text() === `'${za(La.allowPasting)}'`)) {
			ae.instance().log(this.text()), this.editor.dispatch({
				changes: {
					from: 0,
					to: this.editor.state.doc.length
				},
				scrollIntoView: !0
			}), p.instance().createSetting("disable-self-xss-warning", !1, re.SYNCED).set(!0), this.#r = !1, C.actionTaken(A.SelfXssAllowPastingInConsole), this.#o();
			return;
		}
		await this.enterWillEvaluate(e) ? (this.appendCommand(this.text(), !0), nr(this.editor.editor, this.#t), this.editor.dispatch({
			changes: {
				from: 0,
				to: this.editor.state.doc.length
			},
			scrollIntoView: !0
		}), this.aiCodeCompletionProvider && this.editor.editor.state.field(Qn) !== er.OFF && this.editor.editor.dispatch({ effects: Zn.of(er.OFF) })) : this.editor.state.doc.length ? In(this.editor.editor) : this.editor.dispatch({ scrollIntoView: !0 });
	}
	updatePromptIcon() {
		this.iconThrottler.schedule(async () => {
			this.promptIcon.classList.toggle("console-prompt-incomplete", !await this.enterWillEvaluate());
		});
	}
	appendCommand(e, t) {
		let n = S.instance().flavor(y);
		if (n) {
			let r = n, i = r.target().model(x);
			if (i) {
				let n = i.addCommandMessage(r, e), a = Un.wrapObjectLiteral(e);
				this.evaluateCommandInConsole(r, n, a, t), Aa.instance().isShowing() && (C.actionTaken(A.CommandEvaluatedInConsolePanel), dn.instance().recordAction(xn.CONSOLE_PROMPT_EXECUTED));
			}
		}
	}
	async evaluateCommandInConsole(e, t, n, r) {
		let i = e.debuggerModel.selectedCallFrame();
		if (i?.script.isJavaScript()) {
			let e = await un(i);
			n = await this.substituteNames(n, e);
		}
		await e.target().model(x)?.evaluateCommandInConsole(e, t, n, r);
	}
	async substituteNames(e, t) {
		try {
			return await de().javaScriptSubstitute(e, t);
		} catch {
			return e;
		}
	}
	editorUpdate(e) {
		e.docChanged || jn(e.state) !== jn(e.startState) ? this.onTextChanged() : e.selectionSet && this.updatePromptIcon();
	}
	focus() {
		this.editor.focus();
	}
	editorSetForTest() {}
}, Va = /* @__PURE__ */ function(e) {
	return e.TEXT_CHANGED = "TextChanged", e;
}({}), Ha = /* @__PURE__ */ e({ SymbolizedErrorWidget: () => Wa }), Ua = (e, t, n) => {}, Wa = class extends k {
	#e;
	#t;
	#n;
	constructor(e, t = Ua) {
		super(e), this.#t = t;
	}
	set ignoreListManager(e) {
		this.#n = e, this.requestUpdate();
	}
	get ignoreListManager() {
		return this.#n;
	}
	set error(e) {
		this.#e?.removeEventListener(rn.UPDATED, this.requestUpdate, this), this.#e = e, this.isShowing() && this.#e?.addEventListener(rn.UPDATED, this.requestUpdate, this), this.requestUpdate();
	}
	get error() {
		return this.#e;
	}
	wasShown() {
		super.wasShown(), this.#e?.addEventListener(rn.UPDATED, this.requestUpdate, this), this.requestUpdate();
	}
	willHide() {
		super.willHide(), this.#e?.removeEventListener(rn.UPDATED, this.requestUpdate, this);
	}
	performUpdate() {
		if (!this.#e) return;
		let e = {
			error: this.#e,
			ignoreListManager: this.#n
		};
		this.#t(e, {}, this.contentElement);
	}
};
//#endregion
export { ha as a, Ci as c, hi as d, H as f, xr as g, jr as h, _a as i, gi as l, Mr as m, Fa as n, ra as o, Br as p, Oa as r, Vi as s, Ha as t, di as u };
