import { n as e } from "./rolldown-runtime-DF993M8W.js";
import { a as t } from "./dom_extension-BLny9Waw.js";
import { D as n, H as r, J as i, K as a, Q as o, W as s, x as c } from "./common-DMSVbaSb.js";
import { Bl as l, Fo as u, Gl as d, Ht as f, Mo as p, Po as m, Ql as h, Sl as g, Sn as _, Ur as ee, Wl as te, Wo as ne, Xl as v, Yf as y, Zo as b, br as x, f as re, fa as ie, ff as ae, ha as S, hr as oe, i as C, if as w, ii as se, ll as T, ma as ce, ni as le, o as ue, p as de, pf as fe, r as E, u as pe, vi as me, vn as he } from "./legacy-dM_vujv7.js";
import "./platform-D4TUCh2P.js";
import { y as ge } from "./text_utils-DWSliayn.js";
import { F as _e, P as D, T as ve, b as ye, g as be, s as xe } from "./StringUtilities-CMDxNrEc.js";
import { C as Se, Fn as Ce } from "./common-Bs7hSOUj.js";
import { n as we } from "./i18n-CTSaUtZW.js";
import { s as Te } from "./text_editor-B6PKcoob.js";
import { t as Ee } from "./acorn-yx0Qbj0X.js";
import { t as O } from "./objectValue.css-JafYDKlR.js";
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/legacy/components/object_ui/customPreviewComponent.css.mjs
var De = "/*\n * Copyright 2015 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.custom-expandable-section {\n  display: inline-flex;\n  flex-direction: column;\n}\n\n.custom-expand-icon {\n  user-select: none;\n  margin-right: 4px;\n  margin-bottom: -4px;\n}\n\n.custom-expandable-section-standard-section {\n  display: inline-flex;\n}\n\n.custom-expandable-section-default-body {\n  padding-left: 12px;\n}\n", Oe = /* @__PURE__ */ e({
	RemoteObjectPreviewFormatter: () => j,
	renderNodeTitle: () => M,
	renderTrustedType: () => Me
}), { ifDefined: ke, repeat: Ae } = ne, k = {
	emptyD: "empty × {PH1}",
	empty: "empty",
	thePropertyIsComputedWithAGetter: "The property is computed with a getter"
}, je = a("ui/legacy/components/object_ui/RemoteObjectPreviewFormatter.ts", k), A = r.bind(void 0, je), j = class e {
	static objectPropertyComparator(e, t) {
		return n(e) - n(t);
		function n(e) {
			return e.name === "[[PromiseState]]" ? 1 : e.name === "[[PromiseResult]]" ? 2 : e.name === "[[GeneratorState]]" || e.name === "[[PrimitiveValue]]" || e.name === "[[WeakRefTarget]]" ? 3 : e.type !== w.PropertyPreviewType.Function && !e.name.startsWith("#") ? 4 : 5;
		}
	}
	renderObjectPreview(e, t = !0) {
		let n = e.description, r = /* @__PURE__ */ new Set([
			w.ObjectPreviewSubtype.Arraybuffer,
			w.ObjectPreviewSubtype.Dataview,
			w.ObjectPreviewSubtype.Error,
			w.ObjectPreviewSubtype.Null,
			w.ObjectPreviewSubtype.Regexp,
			w.ObjectPreviewSubtype.Webassemblymemory,
			"internal#entry",
			"trustedtype"
		]);
		if (e.type !== w.ObjectPreviewType.Object || e.subtype && r.has(e.subtype)) return this.renderPropertyPreview(e.type, e.subtype, void 0, n);
		let i = e.subtype === w.ObjectPreviewSubtype.Array || e.subtype === w.ObjectPreviewSubtype.Typedarray, a = "";
		if (n) {
			if (i) {
				let t = v.arrayLength(e), r = t > 1 ? "(" + t + ")" : "", i = v.arrayNameFromDescription(n);
				a = i === "Array" ? r : i + r;
			} else a = n === "Object" ? "" : n;
		}
		let o = Array.from(e.entries ? this.renderEntries(e) : i ? this.renderArrayProperties(e) : this.renderObjectProperties(e, t)), s = (e) => m`<span class=name>${/^\s|\s$|^$|\n/.test(e) ? "\"" + e.replace(/\n/g, "↵") + "\"" : e}</span>`, c = (e) => m`<span class=object-value-undefined>${e}</span>`, l = (e) => this.renderPropertyPreview(e.type, e.subtype, e.name, e.value), u = (e) => m`${e.key && m`${this.renderPropertyPreview(e.key.type, e.key.subtype, void 0, e.key.description)} => `}
          ${this.renderPropertyPreview(e.value.type, e.value.subtype, void 0, e.value.description)}`;
		return m`${a.length > 0 ? m`<span class=object-description>${a + "\xA0"}</span>` : b}<span class=object-properties-preview>${i ? "[" : "{"}${Ae(o, ({ name: e, entry: t, value: n, placeholder: r }, i) => m`${i > 0 ? ", " : ""}${r === void 0 ? b : c(r)}${e === void 0 ? b : s(e)}${e !== void 0 && n ? ": " : ""}${n ? l(n) : b}${t ? u(t) : b}`)}${e.overflow ? m`<span>${o.length > 0 ? ",\xA0…" : "…"}</span>` : ""}
    ${i ? "]" : "}"}</span>`;
	}
	*renderObjectProperties(t, n) {
		let r = t.properties.filter((e) => e.type !== "accessor").sort(e.objectPropertyComparator);
		for (let e = 0; e < r.length; ++e) {
			let i = r[e], a = i.name;
			if (n || i.type !== "undefined" && (i.type !== "object" || i.subtype !== "null")) {
				if (t.subtype === w.ObjectPreviewSubtype.Promise && a === "[[PromiseState]]") {
					let t = r.at(e + 1)?.name === "[[PromiseResult]]" ? r.at(e + 1) : void 0;
					t && e++, yield {
						name: "<" + i.value + ">",
						value: i.value === "pending" ? void 0 : t
					};
				} else t.subtype === "generator" && a === "[[GeneratorState]]" ? yield { name: "<" + i.value + ">" } : a === "[[PrimitiveValue]]" ? yield { value: i } : a === "[[WeakRefTarget]]" ? i.type === w.PropertyPreviewType.Undefined ? yield { name: "<cleared>" } : yield { value: i } : yield {
					name: a,
					value: i
				};
			}
		}
	}
	*renderArrayProperties(t) {
		let n = v.arrayLength(t), r = t.properties.filter((e) => o(e.name) !== -1).sort(a), i = t.properties.filter((e) => o(e.name) === -1).sort(e.objectPropertyComparator);
		function a(e, t) {
			return o(e.name) - o(t.name);
		}
		function o(e) {
			let t = Number(e) >>> 0;
			return String(t) === e && t < n ? t : -1;
		}
		let s = !t.overflow, c = [];
		for (let e of r) {
			let t = o(e.name), n = t - (c.at(-1)?.index ?? -1) - 1, r = t !== c.length;
			c.push({
				property: e,
				index: t,
				gap: n,
				hasGaps: r
			});
		}
		let l = n - (c.at(-1)?.index ?? -1) - 1, u = (e) => ({ placeholder: e === 1 ? A(k.empty) : A(k.emptyD, { PH1: e }) });
		for (let { property: e, gap: t, hasGaps: n } of c) s && t > 0 && (yield u(t)), yield {
			name: !s && n ? e.name : void 0,
			value: e
		};
		s && l > 0 && (yield u(l));
		for (let e of i) yield {
			name: e.name,
			value: e
		};
	}
	*renderEntries(e) {
		for (let t of e.entries ?? []) yield { entry: t };
	}
	renderPropertyPreview(e, t, n, r) {
		let i = e === "accessor" ? A(k.thePropertyIsComputedWithAGetter) : e === "object" && !t ? r : void 0;
		return m`<span class='object-value-${t || e}' title=${ke(i)}>${e === "accessor" ? "(...)" : e === "function" ? "ƒ" : e === "object" && t === "trustedtype" && n ? Me(r ?? "", n) : e === "object" && t === "node" && r ? M(r) : e === "string" ? be(r ?? "") : e === "object" && !t ? ((e) => {
			let t = e.split(".");
			for (let e = 0; e < t.length - 1; ++e) t[e] = _e(t[e], 3);
			return t.length === 1 && t[0] === "Object" ? "{…}" : t.join(".");
		})(r ?? "") : r}</span>`;
	}
	renderEvaluationResultPreview(e, t) {
		if ("error" in e) return b;
		if (e.exceptionDetails?.exception?.description) {
			let n = e.exceptionDetails.exception.description;
			return n.startsWith("TypeError: ") || t ? m`<span>${e.exceptionDetails.text} ${n}</span>` : b;
		}
		let { preview: n, type: r, subtype: i, className: a, description: o } = e.object;
		return n && r === "object" && i !== "node" && i !== "trustedtype" ? this.renderObjectPreview(n) : this.renderPropertyPreview(r, i, a, D(o || "", 400));
	}
	renderEvaluationResultPreviewFragment(e, t) {
		let n = document.createDocumentFragment();
		return u(this.renderEvaluationResultPreview(e, t), n), n;
	}
};
function M(e) {
	let t = e.match(/([^#.]+)(#[^.]+)?(\..*)?/);
	return t ? m`<span class=webkit-html-tag-name>${t[1]}</span>${t[2] && m`<span class=webkit-html-attribute-value>${t[2]}</span>`}${t[3] && m`<span class=webkit-html-attribute-name>${t[3]}</span>`}` : null;
}
function Me(e, t) {
	return m`${t} <span class=object-value-string>"${e.replace(/\n/g, "↵")}"</span>`;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/legacy/components/object_ui/JavaScriptREPL.ts
var Ne = /* @__PURE__ */ e({ JavaScriptREPL: () => N }), N = class e {
	static wrapObjectLiteral(e) {
		let t = /^\s*\{\s*(.*)\s*\}[\s;]*$/.exec(e);
		if (t === null) return e;
		let [, n] = t, r = 0;
		for (let t of n) if (t === "{") r++;
		else if (t === "}" && --r < 0) return e;
		let i = (e) => void Ee(e, {
			ecmaVersion: 2022,
			allowAwaitOutsideFunction: !0,
			ranges: !1,
			allowReturnOutsideFunction: !0
		});
		try {
			i("return {" + n + "};");
			let e = "({" + n + "})";
			return i(e), e;
		} catch {
			return e;
		}
	}
	static async evaluate(t, n, r, i, a, o, s = !1, c = !1) {
		let u = t.length > Pe;
		if (!t || r && u) return null;
		let d = t, f = n.debuggerModel.selectedCallFrame();
		if (f?.script.isJavaScript()) {
			let e = await Ce(f);
			try {
				d = await l().javaScriptSubstitute(d, e);
			} catch {}
		}
		d = e.wrapObjectLiteral(d);
		let p = {
			expression: d,
			generatePreview: !0,
			includeCommandLineAPI: !0,
			throwOnSideEffect: r,
			timeout: a,
			objectGroup: o,
			disableBreaks: !0,
			replMode: i,
			silent: c
		};
		return await n.evaluate(p, !1, s);
	}
	static async evaluateAndBuildPreview(t, n, r, i, a, o, s = !1, c = !1) {
		let l = ie.instance().flavor(g);
		if (!l) return {
			preview: document.createDocumentFragment(),
			result: null
		};
		let u = await e.evaluate(t, l, n, r, i, o, s, c);
		return u ? {
			preview: new j().renderEvaluationResultPreviewFragment(u, a),
			result: u
		} : {
			preview: document.createDocumentFragment(),
			result: null
		};
	}
}, Pe = 2e3, P = "/*\n * Copyright 2015 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.object-properties-section-dimmed {\n  opacity: 60%;\n}\n\n.object-properties-section {\n  padding: 0;\n  color: var(--sys-color-on-surface);\n  display: flex;\n  flex-direction: column;\n  overflow-x: auto;\n}\n\n.object-properties-section li,\nli.object-properties-section  {\n  user-select: text;\n\n  &::before {\n    flex-shrink: 0;\n    margin-right: 2px;\n    align-self: flex-start;\n  }\n}\n\n.object-properties-section li.editing-sub-part {\n  padding: 3px 12px 8px 6px;\n  margin: -1px -6px -8px;\n  text-overflow: clip;\n}\n\n.object-properties-section li.editing {\n  margin-left: 10px;\n  text-overflow: clip;\n}\n\n.tree-outline ol.title-less-mode {\n  padding-left: 0;\n}\n\n.object-properties-section .own-property {\n  font-weight: bold;\n}\n\n.object-properties-section .synthetic-property {\n  color: var(--sys-color-token-subtle);\n}\n\n.object-properties-section .private-property-hash {\n  color: var(--sys-color-on-surface);\n}\n\n.object-properties-section-root-element {\n  display: flex;\n  flex-direction: row;\n}\n\n.object-properties-section .editable-div {\n  overflow: hidden;\n}\n\n.name-and-value {\n  line-height: 16px;\n  display: flex;\n  white-space: nowrap;\n}\n\n.name-and-value .separator {\n  white-space: pre;\n  flex-shrink: 0;\n}\n\n.editing-sub-part .name-and-value {\n  overflow: visible;\n  display: inline-flex;\n}\n\n.property-prompt {\n  margin-left: 4px;\n}\n\n.tree-outline.hide-selection-when-blurred .selected:focus-visible {\n  background: none;\n}\n\n.tree-outline.hide-selection-when-blurred .selected:focus-visible ::slotted(*),\n.tree-outline.hide-selection-when-blurred .selected:focus-visible .tree-element-title,\n.tree-outline.hide-selection-when-blurred .selected:focus-visible .name-and-value,\n.tree-outline.hide-selection-when-blurred .selected:focus-visible .gray-info-message {\n  background: var(--sys-color-state-focus-highlight);\n  border-radius: 2px;\n}\n\n@media (forced-colors: active) {\n  .object-properties-section-dimmed {\n    opacity: 100%;\n  }\n\n  .tree-outline.hide-selection-when-blurred .selected:focus-visible {\n    background: Highlight;\n  }\n\n  .tree-outline li:hover .tree-element-title,\n  .tree-outline li.selected .tree-element-title {\n    color: ButtonText;\n  }\n\n  .tree-outline.hide-selection-when-blurred .selected:focus-visible .tree-element-title,\n  .tree-outline.hide-selection-when-blurred .selected:focus-visible .name-and-value {\n    background: transparent;\n    box-shadow: none;\n  }\n\n  .tree-outline.hide-selection-when-blurred .selected:focus-visible span,\n  .tree-outline.hide-selection-when-blurred .selected:focus-visible .gray-info-message {\n    color: HighlightText;\n  }\n\n  .tree-outline-disclosure:hover li.parent::before {\n    background-color: ButtonText;\n  }\n}\n", Fe = /* @__PURE__ */ e({
	ArrayGroupTreeNode: () => H,
	ArrayGroupingTreeElement: () => X,
	EXPANDABLE_TEXT_DEFAULT_VIEW: () => Ze,
	ExpandableTextPropertyValue: () => Q,
	InitialVisibleChildrenLimit: () => 200,
	OBJECT_PROPERTY_DEFAULT_VIEW: () => Ge,
	ObjectPropertiesMode: () => q,
	ObjectPropertiesSection: () => W,
	ObjectPropertiesSectionsTreeExpandController: () => Ye,
	ObjectPropertiesSectionsTreeOutline: () => K,
	ObjectPropertyTreeElement: () => Y,
	ObjectPropertyWidget: () => Ke,
	ObjectTree: () => V,
	ObjectTreeExpansionTracker: () => He,
	ObjectTreeNode: () => U,
	ObjectTreeNodeBase: () => B,
	Renderer: () => Xe,
	RootElement: () => J,
	getObjectPropertiesSectionFrom: () => Ue,
	objectPropertiesSectionStyles: () => P,
	objectValueStyles: () => O
}), { widget: F } = se, { ref: Ie, repeat: Le, ifDefined: I, classMap: Re } = ne, L = {
	exceptionS: "[Exception: {PH1}]",
	unknown: "unknown",
	expandRecursively: "Expand recursively",
	collapseChildren: "Collapse children",
	noProperties: "No properties",
	dots: "(...)",
	invokePropertyGetter: "Invoke property getter",
	showAllD: "Show all {PH1}",
	valueUnavailable: "<value unavailable>",
	valueNotAccessibleToTheDebugger: "Value is not accessible to the debugger",
	copyValue: "Copy value",
	copyPropertyPath: "Copy property path",
	stringIsTooLargeToEdit: "<string is too large to edit>",
	showMoreS: "Show more ({PH1})",
	longTextWasTruncatedS: "long text was truncated ({PH1})",
	copy: "Copy",
	openInMemoryInpector: "Open in Memory inspector panel"
}, ze = a("ui/legacy/components/object_ui/ObjectPropertiesSection.ts", L), R = r.bind(void 0, ze), z = 100, Be = /* @__PURE__ */ new WeakMap(), Ve = class e {
	properties = /* @__PURE__ */ new Map();
	internalProperties = /* @__PURE__ */ new Map();
	arrayRanges = /* @__PURE__ */ new Map();
	accessors = /* @__PURE__ */ new Map();
	remove(t) {
		return this[t.type].delete(e.#e(t));
	}
	get(t) {
		return this[t.type].get(e.#e(t));
	}
	getOrInsert(t) {
		let n = this[t.type], r = e.#e(t), i = n.get(r) ?? new e();
		return n.has(r) || n.set(r, i), i;
	}
	clear(e) {
		this[e].clear();
	}
	clearMissing(t, n) {
		let r = new Set(n.map(e.#e)), i = this[t];
		for (let e of i.keys()) r.has(e) || i.delete(e);
	}
	get empty() {
		return this.properties.size === 0 && this.internalProperties.size === 0 && this.arrayRanges.size === 0 && this.accessors.size === 0;
	}
	static #e(e) {
		return typeof e.key == "string" ? `${e.type}:${e.key}` : `${e.type}:${e.key.fromIndex}-${e.key.toIndex}`;
	}
}, He = class e {
	#e = null;
	static #t(e) {
		if (e instanceof U) return e.parent?.children?.internalProperties?.find((t) => t.name === "[[Prototype]]" && t.children?.properties?.includes(e));
	}
	static #n(t) {
		if (t instanceof U) {
			if (t.parent?.children?.properties?.includes(t)) return "properties";
			if (t.parent?.children?.internalProperties?.includes(t)) return "internalProperties";
			if (t.parent?.children?.accessors?.includes(t)) return "accessors";
			if (e.#t(t)) return "properties";
		}
		return t instanceof H && t.parent?.children?.arrayRanges?.includes(t) ? "arrayRanges" : null;
	}
	static #r(e, t) {
		switch (e) {
			case "arrayRanges": return t instanceof H ? {
				type: e,
				key: t.range
			} : null;
			default: return t instanceof U ? {
				type: e,
				key: t.name
			} : null;
		}
	}
	clear() {
		this.#e = null;
	}
	async #i(t, n) {
		let r = async (r) => {
			let i = n.children?.[r];
			if (!i) {
				t.clear(r);
				return;
			}
			let a = [];
			for (let n of i) {
				let i = e.#r(r, n);
				if (!i) continue;
				let o = t.get(i);
				o && (await this.#i(o, n), a.push(i));
			}
			t.clearMissing(r, a);
		};
		n.expanded = !0, await n.populateChildrenIfNeeded(), await r("properties"), await r("internalProperties"), await r("arrayRanges"), await r("accessors");
	}
	async apply(e) {
		if (this.#e) return await this.#i(this.#e, e);
	}
	static *#a(t) {
		if (!t) return;
		let n = e.#t(t);
		n ? yield* this.#a(n) : yield* this.#a(t.parent);
		let r = this.#n(t), i = r && e.#r(r, t);
		i && (yield i);
	}
	collapse(t) {
		if (!this.#e) return;
		if (t instanceof V) {
			this.#e = null;
			return;
		}
		let n, r = null, i = this.#e;
		for (let a of e.#a(t)) {
			n = a, r = i;
			let e = i.get(a);
			if (!e) return;
			i = e;
		}
		n && r && r.remove(n);
	}
	expand(t) {
		this.#e ||= new Ve();
		let n = this.#e;
		for (let r of e.#a(t)) n = n.getOrInsert(r);
	}
}, B = class e extends o {
	parent;
	options;
	#e;
	filter = null;
	extraProperties = [];
	#t = !1;
	constructor(e, t) {
		super(), this.parent = e, this.options = t, this.filter = e?.filter ?? null;
	}
	get expanded() {
		return this.#t;
	}
	set expanded(e) {
		e ? this.options.expansionTracker?.expand(this) : this.options.expansionTracker?.collapse(this), this.#t = e;
	}
	get readOnly() {
		return this.options.readOnly;
	}
	get propertiesMode() {
		return this.options.propertiesMode;
	}
	get includeNullOrUndefinedValues() {
		return this.filter?.includeNullOrUndefinedValues ?? !0;
	}
	set includeNullOrUndefinedValues(e) {
		this.setFilter({
			includeNullOrUndefinedValues: e,
			regex: this.filter?.regex ?? null
		});
	}
	*#n(e = -1) {
		function* t(t) {
			if (t) for (let n of t) yield* n.#n(Math.max(-1, e - 1));
		}
		yield this, e !== 0 && (yield* t(this.#e?.properties), yield* t(this.#e?.arrayRanges), yield* t(this.#e?.internalProperties));
	}
	async expandRecursively(e) {
		for (let t of this.#n(e)) await t.populateChildrenIfNeeded(), t.expanded = !0;
	}
	collapseRecursively() {
		for (let e of this.#n()) e.expanded = !1;
	}
	setFilter(t) {
		this.filter = t, this.dispatchEventToListeners(e.Events.FILTER_CHANGED), this.#n().forEach((n) => {
			n.filter = t, n.dispatchEventToListeners(e.Events.FILTER_CHANGED);
		});
	}
	removeChildren() {
		this.#e = void 0, this.dispatchEventToListeners(e.Events.CHILDREN_CHANGED);
	}
	removeChild(t) {
		n(this.#e?.arrayRanges, t), n(this.#e?.internalProperties, t), n(this.#e?.properties, t), this.dispatchEventToListeners(e.Events.CHILDREN_CHANGED);
		function n(e, t) {
			if (!e) return;
			let n = e.indexOf(t);
			n >= 0 && e.splice(n, 1);
		}
	}
	selfOrParentIfInternal() {
		return this;
	}
	get children() {
		return this.#e;
	}
	#r;
	async populateChildrenIfNeeded() {
		return this.#e ? this.#e : (this.#r ||= this.populateChildrenIfNeededImpl().then((e) => (this.#e = e, e)).finally(() => {
			this.#r = void 0;
		}), await this.#r);
	}
	async populateChildrenIfNeededImpl() {
		let t = this.object;
		if (!t) return {};
		let n = this.selfOrParentIfInternal();
		if (this.arrayLength > We) {
			let e = (await qe(t, 0, this.arrayLength - 1))?.ranges.map(([e, r, i]) => new H(t, {
				fromIndex: e,
				toIndex: r,
				count: i
			}, n, {
				readOnly: this.readOnly,
				propertiesMode: this.propertiesMode,
				expansionTracker: this.options.expansionTracker
			}));
			if (!e) return {};
			let { properties: r, internalProperties: i } = await v.loadFromObjectPerProto(this.object, !0, !0);
			return {
				arrayRanges: e,
				properties: r?.map((e) => new U(e, n, {
					readOnly: this.readOnly,
					propertiesMode: 1,
					expansionTracker: this.options.expansionTracker
				})),
				internalProperties: i?.map((e) => new U(e, n, {
					readOnly: this.readOnly,
					propertiesMode: 1,
					expansionTracker: this.options.expansionTracker
				}))
			};
		}
		let r = null, i = null;
		switch (this.propertiesMode) {
			case 0:
				({properties: r} = await t.getAllProperties(!1, !0));
				break;
			case 1: ({properties: r, internalProperties: i} = await v.loadFromObjectPerProto(t, !0));
		}
		let a = r?.map((e) => new U(e, n, {
			readOnly: this.readOnly,
			propertiesMode: 1,
			expansionTracker: this.options.expansionTracker
		}));
		a?.push(...this.extraProperties), a?.sort(W.compareProperties);
		let o = a && e.getGettersAndSetters(a, this.options);
		return {
			properties: a,
			internalProperties: i?.map((e) => new U(e, n, {
				readOnly: this.readOnly,
				propertiesMode: 1,
				expansionTracker: this.options.expansionTracker
			})),
			accessors: o
		};
	}
	get hasChildren() {
		return this.object?.hasChildren ?? !1;
	}
	get arrayLength() {
		return this.object?.arrayLength() ?? 0;
	}
	async setPropertyValue(e, t) {
		return await this.object?.setPropertyValue(e, t);
	}
	addExtraProperties(...e) {
		this.extraProperties.push(...e.map((e) => new U(e, this, {
			readOnly: this.readOnly,
			propertiesMode: 1,
			expansionTracker: this.options.expansionTracker
		})));
	}
	static getGettersAndSetters(e, t) {
		let n = [];
		for (let r of e) if (r.property.isOwn) {
			if (r.property.getter) {
				let e = new h("get " + r.property.name, r.property.getter, !1);
				n.push(new U(e, r.parent, {
					propertiesMode: r.propertiesMode,
					readOnly: r.readOnly,
					expansionTracker: t.expansionTracker
				}));
			}
			if (r.property.setter) {
				let e = new h("set " + r.property.name, r.property.setter, !1);
				n.push(new U(e, r.parent, {
					propertiesMode: r.propertiesMode,
					readOnly: r.readOnly,
					expansionTracker: t.expansionTracker
				}));
			}
		}
		return n;
	}
};
(function(e) {
	e.Events = /* @__PURE__ */ function(e) {
		return e.VALUE_CHANGED = "value-changed", e.CHILDREN_CHANGED = "children-changed", e.FILTER_CHANGED = "filter-changed", e;
	}({});
})(B ||= {});
var V = class extends B {
	#e;
	constructor(e, t) {
		super(void 0, t), this.#e = e;
	}
	get object() {
		return this.#e;
	}
}, H = class e extends B {
	#e;
	#t;
	constructor(e, t, n, r) {
		super(n, r), this.#e = e, this.#t = t;
	}
	async populateChildrenIfNeededImpl() {
		if (this.#t.count > X.bucketThreshold) return { arrayRanges: (await qe(this.object, this.#t.fromIndex, this.#t.toIndex))?.ranges.map(([t, n, r]) => new e(this.object, {
			fromIndex: t,
			toIndex: n,
			count: r
		}, this, {
			readOnly: this.readOnly,
			propertiesMode: this.propertiesMode,
			expansionTracker: this.options.expansionTracker
		})) };
		let t = await this.#e.callFunction(Je, [
			{ value: this.#t.fromIndex },
			{ value: this.#t.toIndex },
			{ value: X.sparseIterationThreshold }
		]);
		if (!t.object || t.wasThrown) return {};
		let n = t.object, r = await n.getAllProperties(!1, !0);
		n.release();
		let i = r.properties?.map((e) => new U(e, this, {
			propertiesMode: this.propertiesMode,
			readOnly: this.readOnly,
			expansionTracker: this.options.expansionTracker
		}));
		return i?.push(...this.extraProperties), i?.sort(W.compareProperties), {
			properties: i,
			accessors: i && B.getGettersAndSetters(i, this.options)
		};
	}
	get singular() {
		return this.#t.fromIndex === this.#t.toIndex;
	}
	get range() {
		return this.#t;
	}
	get object() {
		return this.#e;
	}
}, U = class e extends B {
	property;
	nonSyntheticParent;
	#e;
	constructor(e, t, n, r) {
		super(t, n), this.property = e, this.nonSyntheticParent = r;
	}
	get object() {
		return this.property.value;
	}
	get isFiltered() {
		return !(!this.filter || this.property.match(this.filter));
	}
	get name() {
		return this.property.name;
	}
	get path() {
		if (!this.#e) {
			if (this.property.synthetic) return this.#e = this.name, this.name;
			let t = /^(?:[$_\p{ID_Start}])(?:[$_\u200C\u200D\p{ID_Continue}])*$/u, n = /^(?:0|[1-9]\d*)$/, r = this.parent instanceof e && !this.parent.property.synthetic ? this.parent.path : "";
			this.#e = this.property.private || t.test(this.name) ? r ? `${r}.${this.name}` : this.name : n.test(this.name) ? `${r}[${this.name}]` : `${r}[${JSON.stringify(this.name)}]`;
		}
		return this.#e;
	}
	selfOrParentIfInternal() {
		return this.name === "[[Prototype]]" ? this.parent ?? this : this;
	}
	async setValue(e) {
		let t = v.toCallArgument(this.property.symbol || this.name);
		if (e = N.wrapObjectLiteral(e.trim()), this.property.synthetic) {
			let t = !1;
			e && (t = await this.property.setSyntheticValue(e)), t ? this.parent?.removeChildren() : this.dispatchEventToListeners(B.Events.VALUE_CHANGED);
			return;
		}
		let n = this.parent?.object;
		if (await (e ? n.setPropertyValue(t, e) : n.deleteProperty(t))) {
			this.dispatchEventToListeners(B.Events.VALUE_CHANGED);
			return;
		}
		e ? this.parent?.removeChildren() : this.parent?.removeChild(this);
	}
	async invokeGetter(e) {
		let t = await this.parent?.object?.callFunction("\n          function invokeGetter(getter) {\n            return Reflect.apply(getter, this, []);\n          }", [v.toCallArgument(e)]);
		t?.object && (this.property.value = t.object, this.property.wasThrown = t.wasThrown || !1, this.dispatchEventToListeners(B.Events.VALUE_CHANGED));
	}
}, Ue = (e) => Be.get(e), W = class e extends ue {
	root;
	#e;
	titleElement;
	skipProtoInternal;
	constructor(e, t, n, r, i = !0) {
		super(), this.root = new V(e, {
			readOnly: !i,
			propertiesMode: 1
		}), r || this.setHideOverflow(!0), this.setFocusable(!0), this.setShowSelectionOnKeyboardFocus(!0), this.#e = new J(this.root, n), this.appendChild(this.#e), typeof t == "string" || !t ? (this.titleElement = this.element.createChild("span"), this.titleElement.textContent = t || "") : (this.titleElement = t, this.element.appendChild(t)), this.titleElement instanceof HTMLElement && !this.titleElement.hasAttribute("tabIndex") && (this.titleElement.tabIndex = -1), Be.set(this.element, this), this.registerRequiredCSS(O, P), this.rootElement().childrenListElement.classList.add("source-code", "object-properties-section");
	}
	static defaultObjectPresentation(t, n, r, i) {
		let a = e.defaultObjectPropertiesSection(t, n, r, i);
		return t.hasChildren ? a.element : a.titleElement;
	}
	static defaultObjectPropertiesSection(t, n, r, i) {
		let a = document.createElement("span");
		a.classList.add("source-code");
		let o = he(a, { cssFile: O }), s = e.createPropertyValue(t, !1, !0);
		o.appendChild(s);
		let c = new e(t, a, n, void 0, !i);
		return r && c.skipProto(), c;
	}
	static compareProperties(e, t) {
		if (e instanceof U && (e = e.property), t instanceof U && (t = t.property), !e.synthetic && t.synthetic) return 1;
		if (!t.synthetic && e.synthetic) return -1;
		if (!e.isOwn && t.isOwn) return 1;
		if (!t.isOwn && e.isOwn) return -1;
		if (!e.enumerable && t.enumerable) return 1;
		if (!t.enumerable && e.enumerable) return -1;
		if (e.symbol && !t.symbol) return 1;
		if (t.symbol && !e.symbol) return -1;
		if (e.private && !t.private) return 1;
		if (t.private && !e.private) return -1;
		let n = e.name, r = t.name;
		return n.startsWith("_") && !r.startsWith("_") ? 1 : r.startsWith("_") && !n.startsWith("_") ? -1 : ye(n, r);
	}
	static createNameElement(e, t) {
		let n = document.createElement("span");
		if (n.classList.add("name"), e === null) return n;
		if (/^\s|\s$|^$|\n/.test(e)) return n.textContent = `"${e.replace(/\n/g, "↵")}"`, n;
		if (t) {
			let t = document.createElement("span");
			return t.classList.add("private-property-hash"), t.textContent = e[0], n.appendChild(t), n.appendChild(document.createTextNode(e.substring(1))), n;
		}
		return n.textContent = e, n;
	}
	static valueElementForFunctionDescription(e, t, n, r) {
		let { prefix: i, body: a, abbreviation: o } = ((e, t) => {
			let n = e.replace(/^function [gs]et /, "function ").replace(/^function [gs]et\(/, "function(").replace(/^[gs]et /, ""), r = n.match(/^(async\s+function)/), i = n.startsWith("function*"), a = n.startsWith("*"), o = !i && n.startsWith("function"), c = n.startsWith("class ") || n.startsWith("class{"), l = n.indexOf("=>"), u = !r && !i && !o && !c && l > 0;
			if (c) {
				let e = n.substring(5), r = /^[^{\s]+/.exec(e.trim()), i = t;
				return r && (i = r[0].trim() || t), {
					prefix: "class",
					body: e,
					abbreviation: i
				};
			}
			if (r) {
				let e = n.substring(r[1].length);
				return {
					prefix: "async ƒ",
					body: e,
					abbreviation: s(e)
				};
			}
			if (i) {
				let e = n.substring(9);
				return {
					prefix: "ƒ*",
					body: e,
					abbreviation: s(e)
				};
			}
			if (a) {
				let e = n.substring(1);
				return {
					prefix: "ƒ*",
					body: e,
					abbreviation: s(e)
				};
			}
			if (o) {
				let e = n.substring(8);
				return {
					prefix: "ƒ",
					body: e,
					abbreviation: s(e)
				};
			}
			if (u) {
				let e = n;
				return t ? e = t + "()" : n.length > 60 && (e = n.substring(0, l + 2) + " {…}"), {
					prefix: "",
					body: n,
					abbreviation: e
				};
			}
			return {
				prefix: "ƒ",
				body: n,
				abbreviation: s(n)
			};
		})(e ?? "", n ?? "");
		return m`<span
      class="object-value-function ${r ?? ""}"
      title=${D(e ?? "", 500)}>${i && m`<span class=object-value-function-prefix>${i} </span>`}${t ? D(a.trim(), 200) : o.replace(/\n/g, " ")}</span>`;
		function s(e) {
			let t = e.indexOf("("), r = e.match(/\)\s*{/);
			return t !== -1 && r?.index !== void 0 && r.index > t ? (e.substring(0, t).trim() || (n ?? "")) + e.substring(t, r.index + 1) : n + "()";
		}
	}
	static createPropertyValueWithCustomSupport(t, n, r, i, a, o, s) {
		if (t.customPreview()) {
			let e = new $(t).element;
			return e.classList.add("object-properties-section-custom-section"), e;
		}
		return e.createPropertyValue(t, n, r, i, a, o, s);
	}
	static getMemoryIcon(e, t) {
		return e.isLinearMemoryInspectable() ? m`<devtools-icon
      name=memory
      style="width: var(--sys-size-8); height: 13px; vertical-align: sub; cursor: pointer;"
      @click=${(r) => {
			r.consume(), n(new te(e, t));
		}}
      jslog=${S("open-memory-inspector").track({ click: !0 })}
      title=${R(L.openInMemoryInpector)}
      aria-label=${R(L.openInMemoryInpector)}></devtools-icon>` : b;
	}
	static appendMemoryIcon(t, n, r) {
		let i = document.createDocumentFragment();
		u(e.getMemoryIcon(n, r), i), t.appendChild(i);
	}
	static createPropertyValue(t, r, i, a, o = !1, s, c) {
		let l = document.createDocumentFragment(), d = t.type, f = t.subtype, p = t.description || "", h = t.className, g = () => {
			if (d === "object" && f === "internal#location") {
				let e = t.debuggerModel().createRawLocationByScriptId(t.value.scriptId, t.value.lineNumber, t.value.columnNumber);
				return e && a ? m`${a.linkifyRawLocation(e, "", "value")}` : m`<span class=value title=${p}>${"<" + R(L.unknown) + ">"}</span>`;
			}
			if (d === "string" && typeof p == "string") {
				let e = JSON.stringify(p), t = p.length > G;
				return m`<span class="value object-value-string" title=${I(t ? void 0 : p)}>${t ? F(Q, { text: e }) : e}</span>`;
			}
			if (d === "object" && f === "trustedtype") {
				let e = `${h} '${p}'`, t = e.length > G;
				return m`<span class="value object-value-trustedtype" title=${I(t ? void 0 : e)}>${t ? F(Q, { text: e }) : m`${h} <span class=object-value-string title=${p}>${JSON.stringify(p)}</span>`}</span>`;
			}
			if (d === "function") return e.valueElementForFunctionDescription(p, void 0, void 0, "value");
			if (d === "object" && f === "node" && p) return m`<span class="value object-value-node"
            @click=${(e) => {
				n(t), e.consume(!0);
			}}
            @mousemove=${() => T.highlightObjectAsDOMNode(t)}
            @mouseleave=${() => T.hideDOMNodeHighlight()}
          >${M(p)}</span>`;
			if (p.length > G) return m`<span class="value object-value-${f || d}" title=${p}>
          ${F(Q, { text: p })}
        </span>`;
			let r = t.preview && i;
			return m`<span class="value object-value-${f || d}" title=${p}>${r ? new j().renderObjectPreview(t.preview, c) : p}${o ? b : this.getMemoryIcon(t, s)}</span>`;
		};
		u(r ? m`<span class="error value">${we(ze, L.exceptionS, { PH1: g() })}</span>` : g(), l);
		let _ = l.firstElementChild;
		if (!(_ instanceof HTMLElement)) throw Error("Expected an HTML element");
		return _;
	}
	static formatObjectAsFunction(t, r, i, a) {
		return t.debuggerModel().functionDetailsPromise(t).then(o);
		function o(o) {
			i && o?.location && (r.classList.add("linkified"), r.addEventListener("click", () => (n(o.location), !1)));
			let s = a ? "" : "anonymous";
			o?.functionName && (s = o.functionName);
			let c = document.createDocumentFragment();
			u(e.valueElementForFunctionDescription(t.description, a, s), c), r.appendChild(c);
		}
	}
	static isDisplayableProperty(e, t) {
		if (!t?.synthetic) return !0;
		let n = e.name;
		return t.name !== "[[Entries]]" || n !== "length" && n !== "__proto__";
	}
	skipProto() {
		this.skipProtoInternal = !0;
	}
	expand() {
		this.#e.expand();
	}
	objectTreeElement() {
		return this.#e;
	}
	enableContextMenu() {
		this.element.addEventListener("contextmenu", this.contextMenuEventFired.bind(this), !1);
	}
	contextMenuEventFired(e) {
		let t = new x(e);
		t.appendApplicableItems(this.root), this.root.object instanceof d && (t.viewSection().appendItem(R(L.expandRecursively), this.#e.expandRecursively.bind(this.#e, z), { jslogContext: "expand-recursively" }), t.viewSection().appendItem(R(L.collapseChildren), this.#e.collapseChildren.bind(this.#e), { jslogContext: "collapse-children" })), t.show();
	}
	titleLessMode() {
		this.#e.listItemElement.classList.add("hidden"), this.#e.childrenListElement.classList.add("title-less-mode"), this.#e.expand();
	}
}, We = 100, G = 1e4, K = class extends ue {
	constructor() {
		super(), this.registerRequiredCSS(O, P), this.contentElement.classList.add("source-code"), this.contentElement.classList.add("object-properties-section");
	}
}, q = /* @__PURE__ */ function(e) {
	return e[e.ALL = 0] = "ALL", e[e.OWN_AND_INTERNAL_AND_INHERITED = 1] = "OWN_AND_INTERNAL_AND_INHERITED", e;
}({}), J = class extends C {
	object;
	linkifier;
	emptyPlaceholder;
	toggleOnClick;
	constructor(e, t, n) {
		let r = document.createElement("slot");
		super(r), this.object = e, this.object.addEventListener(B.Events.CHILDREN_CHANGED, this.onpopulate, this), this.linkifier = t, this.emptyPlaceholder = n, this.setExpandable(!0), this.selectable = !0, this.toggleOnClick = !0, this.listItemElement.classList.add("object-properties-section-root-element"), this.listItemElement.addEventListener("contextmenu", this.onContextMenu.bind(this), !1), e.expanded && this.expand();
	}
	onexpand() {
		this.object.expanded = !0, this.treeOutline && this.treeOutline.element.classList.add("expanded");
	}
	oncollapse() {
		this.object.expanded = !1, this.treeOutline && this.treeOutline.element.classList.remove("expanded");
	}
	ondblclick(e) {
		return !0;
	}
	onContextMenu(e) {
		let t = new x(e);
		if (t.appendApplicableItems(this.object.object), this.object instanceof d) {
			let { value: e } = this.object, n = typeof e == "object" ? JSON.stringify(e, null, 2) : e;
			t.clipboardSection().appendItem(R(L.copyValue), () => {
				ae.actionTaken(fe.NetworkPanelCopyValue), y.copyText(n);
			}, { jslogContext: "copy-value" });
		}
		t.viewSection().appendItem(R(L.expandRecursively), this.expandRecursively.bind(this, z), { jslogContext: "expand-recursively" }), t.viewSection().appendItem(R(L.collapseChildren), this.collapseChildren.bind(this), { jslogContext: "collapse-children" }), t.viewSection().appendCheckboxItem(s("Show all"), () => {
			this.object.includeNullOrUndefinedValues = !this.object.includeNullOrUndefinedValues;
		}, {
			checked: this.object.includeNullOrUndefinedValues,
			jslogContext: "show-all"
		}), t.show();
	}
	async onpopulate() {
		this.removeChildren();
		let e = this.treeOutline, t = e ? !!e.skipProtoInternal : !1;
		return await Y.populate(this, this.object, t, !1, this.linkifier, this.emptyPlaceholder);
	}
}, Ge = (e, n, r) => {
	let { property: i } = e.node, a = i.synthetic && e.node.name === "[[Entries]]", o = `completions-${e.node.parent?.object?.objectId?.replaceAll(".", "-")}-${e.node.name}`, s = async (t) => {
		t.target instanceof oe && e.onAutoComplete(t.detail.expression, t.detail.filter, t.detail.force);
	}, c = Re({
		name: !0,
		"object-properties-section-dimmed": !i.enumerable,
		"own-property": i.isOwn,
		"synthetic-property": i.synthetic
	}), l = /^\s|\s$|^$|\n/.test(i.name) ? `"${i.name.replace(/\n/g, "↵")}"` : i.name, d = !a && i.value && !i.wasThrown && i.value.hasChildren && !i.value.customPreview() && i.value.subtype !== "node" && i.value.type !== "function" && (i.value.type !== "object" || i.value.preview), f = () => {
		let t = Ie((e) => {
			n.valueElement = e;
		});
		if (a) return m`<span ${t} class=value></span>`;
		if (i.value) {
			let t = i.name !== "[[Prototype]]", r = W.createPropertyValueWithCustomSupport(i.value, i.wasThrown, t, e.linkifier, i.synthetic, e.node.path, e.node.includeNullOrUndefinedValues);
			return n.valueElement = r, r;
		}
		if (i.getter) {
			let n = i.getter;
			return m`<span ${t}><span
        class=object-value-calculate-value-button
        title=${R(L.invokePropertyGetter)}
        @click=${(t) => {
				t.consume(), e.invokeGetter(n);
			}}
        >${R(L.dots)}</span></span>`;
		}
		return m`<span ${t}
        class=object-value-unavailable
        title=${R(L.valueNotAccessibleToTheDebugger)}>${R(L.valueUnavailable)}</span>`;
	}, p = (n) => {
		n instanceof KeyboardEvent && !t(n) || (n.consume(!0), e.editable && i.value && !i.value.customPreview() && (i.writable || i.setter) && e.startEditing());
	};
	u(m`<span class=name-and-value><span
          ${Ie((e) => {
		n.nameElement = e;
	})}
          class=${c}
          title=${e.node.path}>${i.private ? m`<span class="private-property-hash">${i.name[0]}</span>${i.name.substring(1)}</span>` : l}</span>${a ? b : m`<span class='separator'>: </span><devtools-prompt
                @commit=${(t) => e.editingCommitted(t.detail)}
                @cancel=${() => e.editingEnded()}
                @beforeautocomplete=${s}
                @dblclick=${p}
                @keydown=${p}
                completions=${o}
                placeholder=${R(L.stringIsTooLargeToEdit)}
                ?editing=${e.editing}>
                  ${e.expanded && d && i.value ? m`<span
                      class="value object-value-${i.value.subtype || i.value.type}"
                      title=${I(i.value.description)}>${i.value.description === "Object" ? "" : _e(i.value.description ?? "", G)}${i.synthetic ? b : W.getMemoryIcon(i.value)}</span>` : f()}
                  <datalist id=${o}>${Le(e.completions, (e) => m`<option>${e}</option>`)}</datalist>
                </devtools-prompt></span>`}</span>`, r);
}, Ke = class extends le {
	#e = [];
	#t;
	#n;
	#r;
	#i = [];
	#a = !1;
	#o;
	#s = !1;
	#c;
	#l = !1;
	constructor(e, t = Ge) {
		super(e), this.#o = t;
	}
	get property() {
		return this.#t;
	}
	set property(e) {
		this.#t && (this.#t.removeEventListener(B.Events.VALUE_CHANGED, this.requestUpdate, this), this.#t.removeEventListener(B.Events.CHILDREN_CHANGED, this.requestUpdate, this), this.#t.removeEventListener(B.Events.FILTER_CHANGED, this.requestUpdate, this)), this.#t = e, this.#t.addEventListener(B.Events.VALUE_CHANGED, this.requestUpdate, this), this.#t.addEventListener(B.Events.CHILDREN_CHANGED, this.requestUpdate, this), this.#t.addEventListener(B.Events.FILTER_CHANGED, this.requestUpdate, this), this.requestUpdate();
	}
	get expanded() {
		return this.#s;
	}
	set expanded(e) {
		this.#s = e, this.requestUpdate();
	}
	get linkifier() {
		return this.#c;
	}
	set linkifier(e) {
		this.#c = e, this.requestUpdate();
	}
	get editable() {
		return this.#l;
	}
	set editable(e) {
		this.#l = e, this.requestUpdate();
	}
	performUpdate() {
		if (!this.#t) return;
		let e = {
			editable: this.#l,
			expanded: this.#s,
			editing: this.#a,
			editingEnded: this.#f.bind(this),
			editingCommitted: this.#p.bind(this),
			node: this.#t,
			linkifier: this.#c,
			completions: this.#a ? this.#i : [],
			onAutoComplete: this.#d.bind(this),
			invokeGetter: this.#m.bind(this),
			startEditing: this.startEditing.bind(this)
		}, t = this;
		this.#o(e, {
			set nameElement(e) {
				t.#n = e;
			},
			set valueElement(e) {
				t.#r = e;
			}
		}, this.element);
	}
	setSearchRegex(e, t) {
		let n = re;
		return t && (n += " " + t), this.revertHighlightChanges(), this.#n && this.#u(e, this.#n, n), this.property?.object && this.property?.object.type !== "object" && this.#r && this.#u(e, this.#r, n), !!this.#e.length;
	}
	#u(e, t, n) {
		let r = [], i = t.textContent || "";
		e.lastIndex = 0;
		let a = e.exec(i);
		for (; a;) r.push(new ge(a.index, a[0].length)), a = e.exec(i);
		r.length && pe(t, r, n, this.#e);
	}
	revertHighlightChanges() {
		de(this.#e), this.#e = [];
	}
	async #d(e, t, n) {
		let r = await Te(e, t, n);
		this.#i = r.map((e) => e.text), this.requestUpdate();
	}
	get editing() {
		return this.#a;
	}
	startEditing() {
		this.#a = !0, this.requestUpdate();
	}
	#f() {
		this.#i = [], this.#a = !1, this.requestUpdate();
	}
	async #p(e) {
		this.#f(), await this.#t?.setValue(e);
	}
	#m(e) {
		this.#t?.invokeGetter(e);
	}
}, Y = class e extends C {
	property;
	toggleOnClick;
	linkifier;
	maxNumPropertiesToShow;
	#e;
	constructor(e, t) {
		super(), this.#e = new Ke(), this.property = e, this.hidden = e.isFiltered, this.property.addEventListener(B.Events.VALUE_CHANGED, this.#t, this), this.property.addEventListener(B.Events.CHILDREN_CHANGED, this.#n, this), this.property.addEventListener(B.Events.FILTER_CHANGED, this.#r, this), this.toggleOnClick = !0, this.linkifier = t, this.maxNumPropertiesToShow = 200, this.listItemElement.addEventListener("contextmenu", this.contextMenuFired.bind(this), !1), this.listItemElement.dataset.objectPropertyNameForTest = e.name, this.updateExpandable(), this.setExpandRecursively(e.name !== "[[Prototype]]"), e.expanded && this.expand();
	}
	static async populate(t, n, r, i, a, o) {
		let s = await n.populateChildrenIfNeeded();
		s.arrayRanges ? await X.populate(t, s, a) : e.populateWithProperties(t, s, r, i, a, o);
	}
	static *createPropertyNodes({ properties: t, internalProperties: n, accessors: r, arrayRanges: i }, a, o, s, c, l) {
		let u = !0;
		i && i.length > 0 && (u = !1), t?.sort(W.compareProperties);
		let d = n?.find(({ property: e }) => e.name === "[[Entries]]");
		if (d) {
			let t = new e(d, s);
			t.setExpandable(!0), t.expand(), u = !1, yield t;
		}
		for (let n of t ?? []) if (!l?.(n.property) && (n.property.getter || !n.property.isAccessorProperty())) {
			let t = new e(n, s);
			n.property.name === "memories" && n.object?.className === "Memories" && (t.updateExpandable(), t.isExpandable() && t.expand()), u = !1, yield t;
		}
		for (let t of r ?? []) yield new e(t, s);
		for (let t of n ?? []) {
			let n = new e(t, s);
			t.property.name !== "[[Entries]]" && (t.property.name === "[[Prototype]]" && a || (u = !1, yield n));
		}
		if (u) {
			let e = document.createElement("div");
			e.classList.add("gray-info-message"), e.textContent = c || R(L.noProperties), yield new C(e);
		}
	}
	static populateWithProperties(t, n, r, i, a, o) {
		for (let s of this.createPropertyNodes(n, r, i, a, o, (n) => t instanceof e && !W.isDisplayableProperty(n, t.property?.property))) t.appendChild(s);
	}
	revertHighlightChanges() {
		this.#e.revertHighlightChanges();
	}
	setSearchRegex(e, t) {
		return this.#e.setSearchRegex(e, t);
	}
	startEditing() {
		this.#e.startEditing();
	}
	get editing() {
		return this.#e.editing;
	}
	get editable() {
		return this.#e.editable;
	}
	set editable(e) {
		this.#e.editable = e;
	}
	async applyExpression(e) {
		await this.property.setValue(e);
	}
	showAllPropertiesElementSelected(e) {
		return this.removeChild(e), this.children().forEach((e) => {
			e.hidden = !1;
		}), !1;
	}
	createShowAllPropertiesButton() {
		let e = document.createElement("div");
		e.classList.add("object-value-calculate-value-button"), e.textContent = R(L.dots), ee.install(e, R(L.showAllD, { PH1: this.childCount() }));
		let t = this.children();
		for (let e = this.maxNumPropertiesToShow; e < this.childCount(); ++e) t[e].hidden = !0;
		let n = new C(e);
		n.onselect = this.showAllPropertiesElementSelected.bind(this, n), this.appendChild(n);
	}
	async onpopulate() {
		let t = this.treeOutline, n = t ? !!t.skipProtoInternal : !1;
		this.removeChildren(), this.property.object && (await e.populate(this, this.property, n, !1, this.linkifier), this.childCount() > this.maxNumPropertiesToShow && this.createShowAllPropertiesButton());
	}
	onattach() {
		this.updateExpandable(), this.#e.markAsRoot(), this.#e.show(this.listItemElement), this.#e.property = this.property, this.#e.linkifier = this.linkifier, this.#e.editable = !this.property.readOnly;
	}
	onexpand() {
		this.property.expanded = !0, this.#e.expanded = !0;
	}
	oncollapse() {
		this.property.expanded = !1, this.#e.expanded = !1;
	}
	#t() {
		this.updateExpandable();
	}
	#n() {
		this.removeChildren(), this.onpopulate();
	}
	#r() {
		this.hidden = this.property.isFiltered;
	}
	getContextMenu(e) {
		let t = new x(e);
		if (t.appendApplicableItems(this), this.property.property.symbol && t.appendApplicableItems(this.property.property.symbol), this.property.object && (t.appendApplicableItems(this.property.object), this.property.parent?.object instanceof d)) {
			let { object: { value: e } } = this.property, n = typeof e == "object" ? JSON.stringify(e, null, 2) : e;
			t.clipboardSection().appendItem(R(L.copyValue), () => {
				ae.actionTaken(fe.NetworkPanelCopyValue), y.copyText(n);
			}, { jslogContext: "copy-value" });
		}
		if (!this.property.property.synthetic && this.property.path) {
			let e = y.copyText.bind(y, this.property.path);
			t.clipboardSection().appendItem(R(L.copyPropertyPath), e, { jslogContext: "copy-property-path" });
		}
		this.property.parent?.object instanceof d && (t.viewSection().appendItem(R(L.expandRecursively), this.expandRecursively.bind(this, z), { jslogContext: "expand-recursively" }), t.viewSection().appendItem(R(L.collapseChildren), this.collapseChildren.bind(this), { jslogContext: "collapse-children" }));
		let n = this.property;
		for (; n.parent;) n = n.parent;
		return t.viewSection().appendCheckboxItem(s("Show all"), () => {
			n.includeNullOrUndefinedValues = !n.includeNullOrUndefinedValues;
		}, {
			checked: n.includeNullOrUndefinedValues,
			jslogContext: "show-all"
		}), t;
	}
	contextMenuFired(e) {
		this.getContextMenu(e).show();
	}
	updateExpandable() {
		this.property.object ? this.setExpandable(!this.property.object.customPreview() && this.property.object.hasChildren && !this.property.property.wasThrown) : this.setExpandable(!1);
	}
	path() {
		return this.property.path;
	}
};
async function qe(e, t, n) {
	return await e.callFunctionJSON(r, [
		{ value: t },
		{ value: n },
		{ value: X.bucketThreshold },
		{ value: X.sparseIterationThreshold }
	]);
	function r(e, t, n, r) {
		if (e === void 0 || t === void 0 || r === void 0 || n === void 0) return;
		let i = null, a = t - e >= r && ArrayBuffer.isView(this);
		function* o(n) {
			if (e !== void 0 && t !== void 0 && r !== void 0) {
				if (t - e < r) for (let r = e; r <= t; ++r) r in n && (yield r);
				else {
					i ||= Object.getOwnPropertyNames(n);
					for (let n = 0; n < i.length; ++n) {
						let r = i[n], a = Number(r) >>> 0;
						String(a) === r && e <= a && a <= t && (yield a);
					}
				}
			}
		}
		let s = 0;
		if (a) s = t - e + 1;
		else for (let e of o(this)) ++s;
		let c = s;
		c = s <= n ? s : n ** (Math.ceil(Math.log(s) / Math.log(n)) - 1);
		let l = [];
		if (a) for (let n = e; n <= t; n += c) {
			let e = n, r = e + c - 1;
			r > t && (r = t), l.push([
				e,
				r,
				r - e + 1
			]);
		}
		else {
			s = 0;
			let e = -1, t = 0;
			for (let n of o(this)) e === -1 && (e = n), t = n, ++s === c && (l.push([
				e,
				t,
				s
			]), s = 0, e = -1);
			s > 0 && l.push([
				e,
				t,
				s
			]);
		}
		return { ranges: l };
	}
}
function Je(e, t, n) {
	let r = Object.create(null);
	if (e !== void 0 && t !== void 0 && n !== void 0) {
		if (t - e < n) for (let n = e; n <= t; ++n) n in this && (r[n] = this[n]);
		else {
			let n = Object.getOwnPropertyNames(this);
			for (let i = 0; i < n.length; ++i) {
				let a = n[i], o = Number(a) >>> 0;
				String(o) === a && e <= o && o <= t && (r[o] = this[o]);
			}
		}
		return r;
	}
}
var X = class e extends C {
	toggleOnClick;
	linkifier;
	#e;
	constructor(e, t) {
		super(ve("[%d … %d]", e.range.fromIndex, e.range.toIndex), !0), this.#e = e, this.#e.addEventListener(B.Events.CHILDREN_CHANGED, this.onpopulate, this), this.toggleOnClick = !0, this.linkifier = t, e.expanded && this.expand();
	}
	static async populate(t, n, r) {
		if (n.arrayRanges) {
			if (n.arrayRanges.length === 1) await Y.populate(t, n.arrayRanges[0], !1, !1, r);
			else for (let i of n.arrayRanges) i.singular ? await Y.populate(t, i, !1, !1, r) : t.appendChild(new e(i, r));
			Y.populateWithProperties(t, n, !1, !1, r);
		}
	}
	onexpand() {
		this.#e.expanded = !0;
	}
	oncollapse() {
		this.#e.expanded = !1;
	}
	async onpopulate() {
		this.removeChildren(), await Y.populate(this, this.#e, !1, !1, this.linkifier);
	}
	onattach() {
		this.listItemElement.classList.add("object-properties-section-name");
	}
	static bucketThreshold = 100;
	static sparseIterationThreshold = 25e4;
}, Ye = class e {
	static #e = /* @__PURE__ */ new WeakMap();
	static #t = /* @__PURE__ */ new WeakMap();
	#n = /* @__PURE__ */ new Set();
	constructor(e) {
		e.addEventListener(E.ElementAttached, this.#r, this), e.addEventListener(E.ElementExpanded, this.#i, this), e.addEventListener(E.ElementCollapsed, this.#a, this);
	}
	watchSection(t, n) {
		e.#t.set(n, t), this.#n.has(t) && n.expand();
	}
	stopWatchSectionsWithId(e) {
		for (let t of this.#n) t.startsWith(e + ":") && this.#n.delete(t);
	}
	#r(e) {
		let t = e.data;
		t.isExpandable() && this.#n.has(this.#o(t)) && t.expand();
	}
	#i(e) {
		let t = e.data;
		this.#n.add(this.#o(t));
	}
	#a(e) {
		let t = e.data;
		this.#n.delete(this.#o(t));
	}
	#o(t) {
		let n = e.#e.get(t);
		if (n) return n;
		let r = t, i = r;
		if (!t.treeOutline) throw Error("No tree outline available");
		let a = t.treeOutline.rootElement(), o;
		for (; r !== a;) {
			let e = "";
			e = r instanceof Y ? r.property.name : typeof r.title == "string" ? r.title : r.title.textContent || "", o = e + (o ? "." + o : ""), i = r, r.parent && (r = r.parent);
		}
		return o = e.#t.get(i) + (o ? ":" + o : ""), e.#e.set(t, o), o;
	}
}, Z, Xe = class e {
	static instance(t = { forceNew: !1 }) {
		let { forceNew: n } = t;
		return (!Z || n) && (Z = new e()), Z;
	}
	async render(e, t) {
		if (!(e instanceof v)) throw Error("Can't render " + e);
		let n = t?.title, r = new W(e, n, void 0, void 0, !!t?.editable);
		n || r.titleLessMode(), t?.expand && r.firstChild()?.expand();
		let i = () => {
			r.element.dispatchEvent(new CustomEvent("dimensionschanged"));
		};
		return r.addEventListener(E.ElementAttached, i), r.addEventListener(E.ElementExpanded, i), r.addEventListener(E.ElementCollapsed, i), {
			element: r.element,
			forceSelect: r.forceSelect.bind(r)
		};
	}
}, Ze = (e, t, n) => {
	let r = i(e.byteCount), a = e.text.length < Q.MAX_DISPLAYABLE_TEXT_LENGTH, o = (t) => {
		let { target: n } = t;
		if (!(n instanceof Element)) return;
		let i = n.closest("li"), o = i && C.getTreeElementBylistItemNode(i);
		if (!(o instanceof Y)) return;
		let s = o.getContextMenu(t);
		a && !e.expanded && s.clipboardSection().appendItem(R(L.showMoreS, { PH1: r }), e.expandText, { jslogContext: "show-more" }), s.clipboardSection().appendItem(R(L.copy), e.copyText, { jslogContext: "copy" }), s.show(), t.consume(!0);
	}, s = e.text.slice(0, e.maxLength);
	u(m`<span title=${s + "…"} @contextmenu=${o}>
               ${e.expanded ? e.text : s}
               <button
                 ?hidden=${e.expanded}
                 @click=${a ? e.expandText : void 0}
                 jslog=${I(a ? S("expand").track({ click: !0 }) : void 0)}
                 class=${a ? "expandable-inline-button" : "undisplayable-text"}
                 data-text=${R(a ? L.showMoreS : L.longTextWasTruncatedS, { PH1: r })}
                 ></button>
               <button
                 class=expandable-inline-button
                 @click=${e.copyText}
                 data-text=${R(L.copy)}
                 jslog=${S("copy").track({ click: !0 })}
                 ></button>
             </span>`, n);
}, Q = class e extends le {
	static MAX_DISPLAYABLE_TEXT_LENGTH = 1e7;
	static EXPANDABLE_MAX_LENGTH = 50;
	#e = "";
	#t = 0;
	#n = !1;
	#r = e.EXPANDABLE_MAX_LENGTH;
	#i;
	constructor(e, t = Ze) {
		super(e), this.#i = t;
	}
	set text(e) {
		this.#e = e, this.#t = xe(e), this.requestUpdate();
	}
	set maxLength(e) {
		this.#r = e, this.requestUpdate();
	}
	performUpdate() {
		let e = {
			copyText: () => y.copyText(this.#e),
			expandText: () => {
				this.#n || (this.#n = !0, this.requestUpdate());
			},
			expanded: this.#n,
			byteCount: this.#t,
			maxLength: this.#r,
			text: this.#e
		};
		this.#i(e, {}, this.contentElement);
	}
}, Qe = /* @__PURE__ */ e({
	CustomPreviewComponent: () => $,
	CustomPreviewSection: () => nt
}), $e = { showAsJavascriptObject: "Show as JavaScript object" }, et = a("ui/legacy/components/object_ui/CustomPreviewComponent.ts", $e), tt = r.bind(void 0, et), nt = class e {
	sectionElement;
	object;
	expanded;
	cachedContent;
	header;
	expandIcon;
	constructor(e) {
		this.sectionElement = document.createElement("span"), this.sectionElement.classList.add("custom-expandable-section"), this.object = e, this.expanded = !1, this.cachedContent = null;
		let t = e.customPreview();
		if (!t) return;
		let n;
		try {
			n = JSON.parse(t.header);
		} catch (e) {
			c.instance().error("Broken formatter: header is invalid json " + e);
			return;
		}
		if (this.header = this.renderJSONMLTag(n), this.header.nodeType === Node.TEXT_NODE) {
			c.instance().error("Broken formatter: header should be an element node.");
			return;
		}
		t.bodyGetterId && (this.header instanceof Element && this.header.classList.add("custom-expandable-section-header"), this.header.addEventListener("click", this.onClick.bind(this), !1), this.expandIcon = p("triangle-right", "custom-expand-icon"), this.header.insertBefore(this.expandIcon, this.header.firstChild)), this.sectionElement.appendChild(this.header);
	}
	element() {
		return this.sectionElement;
	}
	renderJSONMLTag(e) {
		return Array.isArray(e) ? e[0] === "object" ? this.layoutObjectTag(e) : this.renderElement(e) : document.createTextNode(String(e));
	}
	renderElement(e) {
		let t = e.shift();
		if (!rt.includes(t)) return c.instance().error("Broken formatter: element " + t + " is not allowed!"), document.createElement("span");
		let n = document.createElement(t);
		if (typeof e[0] == "object" && !Array.isArray(e[0])) {
			let t = e.shift();
			for (let e in t) {
				let r = t[e];
				e === "style" && typeof r == "string" && n.setAttribute(e, r);
			}
		}
		return this.appendJsonMLTags(n, e), n;
	}
	layoutObjectTag(t) {
		t.shift();
		let n = t.shift(), r = this.object.runtimeModel().createRemoteObject(n);
		if (r.customPreview()) return new e(r).element();
		let i = W.defaultObjectPresentation(r);
		return i.classList.toggle("custom-expandable-section-standard-section", r.hasChildren), i;
	}
	appendJsonMLTags(e, t) {
		for (let n = 0; n < t.length; ++n) e.appendChild(this.renderJSONMLTag(t[n]));
	}
	onClick(e) {
		e.consume(!0), this.cachedContent ? this.toggleExpand() : this.loadBody();
	}
	toggleExpand() {
		this.expanded = !this.expanded, this.header instanceof Element && this.header.classList.toggle("expanded", this.expanded), this.cachedContent instanceof Element && this.cachedContent.classList.toggle("hidden", !this.expanded), this.expandIcon && (this.expanded ? this.expandIcon.name = "triangle-down" : this.expandIcon.name = "triangle-right");
	}
	defaultBodyTreeOutline;
	async loadBody() {
		let e = this.object.customPreview();
		if (e && e.bodyGetterId) {
			let t = await this.object.callFunctionJSON((e) => e(), [{ objectId: e.bodyGetterId }]);
			t === null ? (this.defaultBodyTreeOutline = new K(), this.defaultBodyTreeOutline.setShowSelectionOnKeyboardFocus(!0, !1), this.defaultBodyTreeOutline.element.classList.add("custom-expandable-section-default-body"), Y.populate(this.defaultBodyTreeOutline.rootElement(), new V(this.object, {
				readOnly: !0,
				propertiesMode: q.OWN_AND_INTERNAL_AND_INHERITED
			}), !1, !1), this.cachedContent = this.defaultBodyTreeOutline.element) : this.cachedContent = this.renderJSONMLTag(t), this.sectionElement.appendChild(this.cachedContent), this.toggleExpand();
		}
	}
}, rt = [
	"span",
	"div",
	"ol",
	"li",
	"table",
	"tr",
	"td"
], $ = class {
	object;
	customPreviewSection;
	element;
	constructor(e) {
		this.object = e, this.customPreviewSection = new nt(e), this.element = document.createElement("span"), this.element.classList.add("source-code");
		let t = he(this.element, { cssFile: De });
		this.element.addEventListener("contextmenu", this.contextMenuEventFired.bind(this), !1), t.appendChild(this.customPreviewSection.element());
	}
	expandIfPossible() {
		let e = this.object.customPreview();
		e && e.bodyGetterId && this.customPreviewSection && this.customPreviewSection.loadBody();
	}
	contextMenuEventFired(e) {
		let t = new x(e);
		this.customPreviewSection && t.revealSection().appendItem(tt($e.showAsJavascriptObject), this.disassemble.bind(this), { jslogContext: "show-as-javascript-object" }), t.appendApplicableItems(this.object), t.show();
	}
	disassemble() {
		this.element.shadowRoot && (this.element.shadowRoot.textContent = "", this.customPreviewSection = null, this.element.shadowRoot.appendChild(W.defaultObjectPresentation(this.object)));
	}
}, it = "/*\n * Copyright 2017 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.widget:has(.object-popover-tree) {\n  padding: 0;\n  border-radius: var(--sys-shape-corner-extra-small);\n}\n\n.object-popover-content {\n  display: flex;\n  position: relative;\n  overflow: hidden;\n  flex: 1 1 auto;\n  flex-direction: column;\n}\n\n.object-popover-title {\n  text-overflow: ellipsis;\n  overflow: hidden;\n  white-space: nowrap;\n  font-weight: bold;\n  padding-left: 18px;\n  padding-bottom: 2px;\n  padding-top: var(--sys-size-3);\n  flex-shrink: 0;\n}\n\n.object-popover-tree {\n  border-top: 1px solid var(--sys-color-divider);\n  overflow: auto;\n  width: 100%;\n  height: calc(100% - 13px);\n}\n\n.object-popover-container {\n  display: inline-block;\n}\n\n.object-popover-description-box {\n  padding: 6px;\n  max-width: 350px;\n  line-height: 1.4;\n}\n\n.object-popover-footer {\n  margin-top: 8px;\n}\n", at = /* @__PURE__ */ e({ ObjectPopoverHelper: () => lt }), ot = { learnMore: "Learn more" }, st = a("ui/legacy/components/object_ui/ObjectPopoverHelper.ts", ot), ct = r.bind(void 0, st), lt = class e {
	linkifier;
	resultHighlightedAsDOM;
	constructor(e, t) {
		this.linkifier = e, this.resultHighlightedAsDOM = t;
	}
	dispose() {
		this.resultHighlightedAsDOM && T.hideDOMNodeHighlight(), this.linkifier && this.linkifier.dispose();
	}
	static async buildObjectPopover(t, n) {
		let r = D(t.description || "", ut), i = null;
		if (t.type === "function" || t.type === "object") {
			let a = null, o = !1;
			if (t.subtype === "node" && (T.highlightObjectAsDOMNode(t), o = !0), t.customPreview()) {
				let e = new $(t);
				e.expandIfPossible(), i = e.element;
			} else {
				i = document.createElement("div"), i.classList.add("object-popover-content"), n.registerRequiredCSS(O, it);
				let e = i.createChild("div", "object-popover-title");
				t.type === "function" ? (e.classList.add("source-code"), u(W.valueElementForFunctionDescription(t.description), e)) : (e.classList.add("monospace"), e.createChild("span").textContent = r), a = new Se();
				let o = new W(t, "", a, !0);
				o.element.classList.add("object-popover-tree"), o.titleLessMode(), i.appendChild(o.element);
			}
			return i.dataset.stableNameForTest = "object-popover-content", n.setMaxContentSize(new me(300, 250)), n.setSizeBehavior(f.SET_EXACT_SIZE), n.contentElement.appendChild(i), new e(a, o);
		}
		i = document.createElement("span"), i.dataset.stableNameForTest = "object-popover-content", n.registerRequiredCSS(O, it);
		let a = i.createChild("span", "monospace object-value-" + t.type);
		return a.style.whiteSpace = "pre", t.type === "string" ? _(a, `"${r}"`) : a.textContent = r, n.contentElement.appendChild(i), new e(null, !1);
	}
	static buildDescriptionPopover(t, n, r) {
		let i = document.createElement("div");
		i.classList.add("object-popover-description-box");
		let a = document.createElement("div");
		a.dataset.stableNameForTest = "object-popover-content", r.registerRequiredCSS(it), a.textContent = t;
		let o = ce.create(n, ct(ot.learnMore), void 0, "learn-more"), s = document.createElement("div");
		return s.classList.add("object-popover-footer"), s.appendChild(o), i.appendChild(a), i.appendChild(s), r.contentElement.appendChild(i), new e(null, !1);
	}
}, ut = 1e4;
//#endregion
export { P as _, Q as a, j as b, Fe as c, Y as d, V as f, J as g, B as h, Qe as i, Ye as l, U as m, at as n, q as o, He as p, $ as r, W as s, lt as t, K as u, N as v, Oe as x, Ne as y };
