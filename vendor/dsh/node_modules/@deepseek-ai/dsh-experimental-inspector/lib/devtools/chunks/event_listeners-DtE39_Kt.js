import { D as e, H as t, K as n, x as r } from "./common-DMSVbaSb.js";
import { $i as i, As as a, Dt as o, Kl as s, L as c, Ql as l, Ur as u, Xi as d, Xl as f, Yl as p, Zi as m, br as h, ei as g, ha as _, i as v, js as y, o as b } from "./legacy-dM_vujv7.js";
import { C as x } from "./common-Bs7hSOUj.js";
import { d as S, m as C, o as w, s as T } from "./object_ui-Dj5WXMwl.js";
import { t as E } from "./objectValue.css-JafYDKlR.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/event_listeners/EventListenersUtils.ts
async function D(e) {
	let t = e.runtimeModel().target().model(a);
	if (!t) return {
		eventListeners: [],
		internalHandlers: null
	};
	let n = {
		internalHandlers: null,
		eventListeners: []
	};
	return await e.callFunction(v, void 0).then(g).then(i).then(o).then(h).catch((e) => (console.error(e), n));
	function i(e) {
		return e.getOwnProperties(!1);
	}
	async function o(e) {
		if (!e.properties) throw Error("Object properties is empty");
		let t = [];
		for (let n of e.properties) n.name === "eventListeners" && n.value && t.push(c(n.value).then(d)), n.name === "internalHandlers" && n.value && t.push(l(n.value).then(f)), n.name === "errorString" && n.value && m(n.value);
		await Promise.all(t);
	}
	function c(n) {
		return s.objectAsArray(n).map(r).then(_);
		function r(n) {
			let r, i, a, o, s = null, c = null, l = null, d = null, f = [];
			f.push(n.callFunctionJSON(p, void 0).then(m));
			function p() {
				return {
					type: this.type,
					useCapture: this.useCapture,
					passive: this.passive,
					once: this.once
				};
			}
			function m(e) {
				e && (e.type !== void 0 && (r = e.type), e.useCapture !== void 0 && (i = e.useCapture), e.passive !== void 0 && (a = e.passive), e.once !== void 0 && (o = e.once));
			}
			f.push(n.callFunction(h).then(g).then(_).then(u).then(v));
			function h() {
				return this.handler || null;
			}
			function _(e) {
				return c = e, c;
			}
			function v(e) {
				return s = e, e.debuggerModel().functionDetailsPromise(e).then(b);
			}
			function b(e) {
				l = e ? e.location : null;
			}
			f.push(n.callFunction(x).then(g).then(S));
			function x() {
				return this.remove || null;
			}
			function S(e) {
				e.type === "function" && (d = e);
			}
			return Promise.all(f).then(C).catch((e) => (console.error(e), null));
			function C() {
				if (!l) throw Error("Empty event listener's location");
				return new y(t, e, r, i, a, o, s, c, l, d, y.Origin.FRAMEWORK_USER);
			}
		}
	}
	function l(e) {
		return s.objectAsArray(e).map(u).then(s.createFromRemoteObjects.bind(null));
	}
	function u(e) {
		return p.objectAsFunction(e).targetFunction();
	}
	function d(e) {
		n.eventListeners = e;
	}
	function f(e) {
		n.internalHandlers = e;
	}
	function m(e) {
		r.instance().error(String(e.value));
	}
	function h() {
		return n;
	}
	function g(e) {
		if (e.wasThrown || !e.object) throw Error("Exception in callFunction or empty result");
		return e.object;
	}
	function _(e) {
		return e.filter(t);
		function t(e) {
			return !!e;
		}
	}
	function v() {
		let e = [], t = [], n = [], r = [u];
		try {
			self.devtoolsFrameworkEventListeners && a(self.devtoolsFrameworkEventListeners) && (r = r.concat(self.devtoolsFrameworkEventListeners));
		} catch (t) {
			e.push("devtoolsFrameworkEventListeners call produced error: " + c(t));
		}
		for (let i = 0; i < r.length; ++i) try {
			let e = r[i](this);
			if (e.eventListeners && a(e.eventListeners)) {
				let n = e.eventListeners.map((e) => o(e)).filter(l);
				t = t.concat(n);
			}
			if (e.internalHandlers && a(e.internalHandlers)) {
				let t = e.internalHandlers.map((e) => s(e)).filter(l);
				n = n.concat(t);
			}
		} catch (t) {
			e.push("fetcher call produced error: " + c(t));
		}
		let i = {
			eventListeners: t,
			internalHandlers: n.length ? n : void 0
		};
		if (i.internalHandlers || delete i.internalHandlers, e.length) {
			let t = "Framework Event Listeners API Errors:\n	" + e.join("\n	");
			t = t.substr(0, t.length - 1), i.errorString = t;
		}
		return (i.errorString === "" || i.errorString === void 0) && delete i.errorString, i;
		function a(e) {
			if (!e || typeof e != "object") return !1;
			try {
				if (typeof e.splice == "function") {
					let t = e.length;
					return typeof t == "number" && t >>> 0 === t && (t > 0 || 1 / t > 0);
				}
			} catch {}
			return !1;
		}
		function o(t) {
			try {
				let n = "";
				if (!t) n += "empty event listener, ";
				else {
					let e = t.type;
					(!e || typeof e != "string") && (n += "event listener's type isn't string or empty, ");
					let r = t.useCapture;
					typeof r != "boolean" && (n += "event listener's useCapture isn't boolean or undefined, ");
					let i = t.passive;
					typeof i != "boolean" && (n += "event listener's passive isn't boolean or undefined, ");
					let a = t.once;
					typeof a != "boolean" && (n += "event listener's once isn't boolean or undefined, ");
					let o = t.handler;
					(!o || typeof o != "function") && (n += "event listener's handler isn't a function or empty, ");
					let s = t.remove;
					if (s && typeof s != "function" && (n += "event listener's remove isn't a function, "), !n) return {
						type: e,
						useCapture: r,
						passive: i,
						once: a,
						handler: o,
						remove: s
					};
				}
				return e.push(n.substr(0, n.length - 2)), null;
			} catch (t) {
				return e.push(c(t)), null;
			}
		}
		function s(t) {
			return t && typeof t == "function" ? t : (e.push("internal handler isn't a function or empty"), null);
		}
		function c(e) {
			try {
				return String(e);
			} catch {
				return "<error>";
			}
		}
		function l(e) {
			return !!e;
		}
		function u(e) {
			if (!e || !(e instanceof Node)) return { eventListeners: [] };
			let t = window.jQuery;
			if (!t?.fn) return { eventListeners: [] };
			let n = t, r = t._data || t.data, i = [], a = [];
			if (typeof r == "function") {
				let t = r(e, "events");
				for (let n in t) for (let r in t[n]) {
					let a = t[n][r];
					if (typeof a == "object" || typeof a == "function") {
						let t = {
							handler: a.handler || a,
							useCapture: !0,
							passive: !1,
							once: !1,
							type: n,
							remove: d.bind(e, a.selector)
						};
						i.push(t);
					}
				}
				let n = r(e);
				n && typeof n.handle == "function" && a.push(n.handle);
			}
			let o = n(e)[0];
			if (o) {
				let e = o.$events;
				for (let t in e) {
					let n = e[t];
					for (let e in n) if (typeof n[e] == "function") {
						let r = {
							handler: n[e],
							useCapture: !0,
							passive: !1,
							once: !1,
							type: t
						};
						i.push(r);
					}
				}
				o?.$handle && a.push(o.$handle);
			}
			return {
				eventListeners: i,
				internalHandlers: a
			};
		}
		function d(e, t, n) {
			if (!this || !(this instanceof Node)) return;
			let r = this, i = window.jQuery;
			i?.fn && i(r).off(t, e, n);
		}
	}
}
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/event_listeners/eventListenersView.css.mjs
var O = "/*\n * Copyright 2015 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.tree-outline-disclosure li {\n  padding: 0 0 0 5px;\n  overflow: hidden;\n  display: flex;\n  min-height: var(--sys-size-8);\n  align-items: center;\n}\n\n.tree-outline-disclosure {\n  padding-left: 0 !important; /* stylelint-disable-line declaration-no-important */\n  padding-right: 3px;\n}\n\n.tree-outline-disclosure li.parent::before {\n  top: 0 !important; /* stylelint-disable-line declaration-no-important */\n}\n\n.tree-outline-disclosure .name {\n  color: var(--sys-color-token-tag);\n}\n\n.tree-outline-disclosure .object-value-node,\n.tree-outline-disclosure .object-value-object {\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.event-listener-details {\n  display: flex;\n  min-height: var(--sys-size-8);\n  align-items: center;\n  gap: var(--sys-size-2);\n\n  devtools-button {\n    height: var(--sys-size-8);\n  }\n}\n\n.event-listener-tree-subtitle {\n  float: right;\n  margin-left: 5px;\n  flex-shrink: 0;\n}\n\n.event-listener-button {\n  padding: 0 5px;\n  color: var(--sys-color-primary);\n  background-color: var(--sys-color-cdt-base-container);\n  border-radius: 7px;\n  border: 1px solid var(--sys-color-tonal-outline);\n  margin-left: 5px;\n  display: block;\n  flex-shrink: 0;\n\n  &:hover {\n    background-color: var(--sys-color-state-hover-on-subtle);\n  }\n\n  &:active {\n    background-color: var(--sys-color-state-ripple-neutral-on-subtle);\n  }\n}\n\n.placeholder:not(.hidden) + .event-listener-tree {\n  display: none;\n}\n\n.placeholder {\n  display: flex;\n  margin: auto;\n  align-items: center;\n  justify-content: center;\n}\n\n.sources.panel .empty-view-scroller {\n  display: none;\n}\n\n.elements.panel .placeholder {\n  display: block;\n\n  .gray-info-message {\n    display: none;\n  }\n}\n\n.tree-outline-disclosure li:hover .event-listener-button {\n  display: inline;\n}\n\n@media (forced-colors: active) {\n  .event-listener-details .event-listener-button {\n    forced-color-adjust: none;\n    opacity: 100%;\n    background: ButtonFace;\n    color: ButtonText;\n    border-color: ButtonText;\n  }\n\n  .event-listener-button:hover {\n    background-color: Highlight !important; /* stylelint-disable-line declaration-no-important */\n    color: HighlightText;\n    border-color: ButtonText;\n  }\n\n  .tree-outline.hide-selection-when-blurred .selected:focus-visible .event-listener-button,\n  .tree-outline-disclosure li:focus-visible .gray-info-message {\n    background-color: Highlight;\n    color: HighlightText;\n    border-color: HighlightText;\n  }\n}\n", k = {
	noEventListeners: "No event listeners",
	eventListenersExplanation: "On this page you will find registered event listeners",
	deleteEventListener: "Delete event listener",
	togglePassive: "Toggle Passive",
	toggleWhetherEventListenerIs: "Toggle whether event listener is passive or blocking",
	openInElementsPanel: "Open in Elements panel",
	passive: "Passive"
}, A = n("panels/event_listeners/EventListenersView.ts", k), j = t.bind(void 0, A), M = class extends g {
	changeCallback = () => {};
	enableDefaultTreeFocus = !1;
	treeOutline;
	emptyHolder;
	objects = [];
	filter;
	#e = new x();
	#t = /* @__PURE__ */ new Map();
	constructor(e) {
		super(e), this.registerRequiredCSS(O), this.emptyHolder = this.element.createChild("div", "placeholder hidden"), this.emptyHolder.createChild("span", "gray-info-message").textContent = j(k.noEventListeners), new c(j(k.noEventListeners), j(k.eventListenersExplanation)).show(this.emptyHolder), this.treeOutline = new b(), this.treeOutline.setComparator(N.comparator), this.treeOutline.element.classList.add("event-listener-tree", "monospace"), this.treeOutline.setShowSelectionOnKeyboardFocus(!0), this.treeOutline.setFocusable(!0), this.treeOutline.registerRequiredCSS(O, E), this.element.appendChild(this.treeOutline.element);
	}
	focus() {
		this.enableDefaultTreeFocus && (this.emptyHolder.classList.contains("hidden") ? this.emptyHolder.focus() : this.treeOutline.forceSelect());
	}
	async performUpdate() {
		await this.addObjects(this.objects), this.filter && this.showFrameworkListeners(this.filter.showFramework, this.filter.showPassive, this.filter.showBlocking);
	}
	async addObjects(e) {
		let t = this.treeOutline.rootElement().children();
		for (let e of t) e.removeChildren();
		this.#e.reset(), await Promise.all(e.map((e) => e ? this.addObject(e) : Promise.resolve())), this.addEmptyHolderIfNeeded(), this.eventListenersArrivedForTest();
	}
	addObject(e) {
		let t, n = null, r = [], i = e.runtimeModel().target().model(a);
		return i && r.push(i.eventListeners(e).then(o)), r.push(D(e).then(s)), Promise.all(r).then(c).then(l.bind(this));
		function o(e) {
			t = e;
		}
		function s(e) {
			n = e;
		}
		async function c() {
			if (!n || !n.internalHandlers) return;
			return await n.internalHandlers.object().callFunctionJSON(r, t.map(e)).then(i);
			function e(e) {
				return f.toCallArgument(e.handler());
			}
			function r() {
				let e = [], t = new Set(this);
				for (let n of arguments) e.push(t.has(n));
				return e;
			}
			function i(e) {
				if (e) for (let n = 0; n < t.length; ++n) e[n] && t[n].markAsFramework();
			}
		}
		function l() {
			this.addObjectEventListeners(e, t), n && this.addObjectEventListeners(e, n.eventListeners);
		}
	}
	addObjectEventListeners(e, t) {
		if (t) for (let n of t) this.getOrCreateTreeElementForType(n.type()).addObjectEventListener(n, e);
	}
	showFrameworkListeners(e, t, n) {
		let r = this.treeOutline.rootElement().children();
		for (let i of r) {
			let r = !0;
			for (let a of i.children()) {
				let i = a, o = i.eventListener().origin(), s = !1;
				o === y.Origin.FRAMEWORK_USER && !e && (s = !0), o === y.Origin.FRAMEWORK && e && (s = !0), !t && i.eventListener().passive() && (s = !0), !n && !i.eventListener().passive() && (s = !0), i.hidden = s, r &&= s;
			}
			i.hidden = r;
		}
	}
	getOrCreateTreeElementForType(e) {
		let t = this.#t.get(e);
		return t || (t = new N(e, this.#e, this.changeCallback), this.#t.set(e, t), t.hidden = !0, this.treeOutline.appendChild(t)), this.emptyHolder.classList.add("hidden"), t;
	}
	addEmptyHolderIfNeeded() {
		let e = !0, t = null;
		for (let n of this.treeOutline.rootElement().children()) n.hidden = !n.firstChild(), e &&= n.hidden, !t && !n.hidden && (t = n);
		e && this.emptyHolder.classList.contains("hidden") && this.emptyHolder.classList.remove("hidden"), t && t.select(!0), this.treeOutline.setFocusable(!!t);
	}
	eventListenersArrivedForTest() {}
}, N = class extends v {
	toggleOnClick;
	linkifier;
	changeCallback;
	constructor(e, t, n) {
		super(e), this.toggleOnClick = !0, this.linkifier = t, this.changeCallback = n, o(this.listItemElement, `${e}, event listener`);
	}
	static comparator(e, t) {
		return e.title === t.title ? 0 : e.title > t.title ? 1 : -1;
	}
	addObjectEventListener(e, t) {
		let n = new P(e, t, this.linkifier, this.changeCallback);
		this.appendChild(n);
	}
}, P = class extends v {
	#e;
	editable;
	changeCallback;
	valueTitle;
	constructor(e, t, n, r) {
		super("", !0), this.#e = e, this.editable = !1, this.setTitle(t, n), this.changeCallback = r;
	}
	async onpopulate() {
		let e = [], t = this.#e, n = t.domDebuggerModel().runtimeModel();
		e.push(new C(n.createRemotePropertyFromPrimitiveValue("useCapture", t.useCapture()), void 0, {
			readOnly: !1,
			propertiesMode: w.OWN_AND_INTERNAL_AND_INHERITED
		})), e.push(new C(n.createRemotePropertyFromPrimitiveValue("passive", t.passive()), void 0, {
			readOnly: !1,
			propertiesMode: w.OWN_AND_INTERNAL_AND_INHERITED
		})), e.push(new C(n.createRemotePropertyFromPrimitiveValue("once", t.once()), void 0, {
			readOnly: !1,
			propertiesMode: w.OWN_AND_INTERNAL_AND_INHERITED
		})), t.handler() !== void 0 && e.push(new C(new l("handler", t.handler()), void 0, {
			readOnly: !1,
			propertiesMode: w.OWN_AND_INTERNAL_AND_INHERITED
		})), S.populateWithProperties(this, { properties: e }, !0, !0, void 0);
	}
	setTitle(t, n) {
		let r = this.listItemElement.createChild("span", "event-listener-details"), a = T.createPropertyValue(t, !1, !1);
		if (this.valueTitle = a, r.appendChild(this.valueTitle), this.#e.canRemove()) {
			let e = new d();
			e.data = {
				variant: i.ICON,
				size: m.MICRO,
				iconName: "bin",
				jslogContext: "delete-event-listener"
			}, u.install(e, j(k.deleteEventListener)), e.addEventListener("click", (e) => {
				this.removeListener(), e.consume();
			}, !1), r.appendChild(e);
		}
		if (this.#e.isScrollBlockingType() && this.#e.canTogglePassive()) {
			let e = r.createChild("button", "event-listener-button");
			e.textContent = j(k.togglePassive), e.setAttribute("jslog", `${_("passive").track({ click: !0 })}`), u.install(e, j(k.toggleWhetherEventListenerIs)), e.addEventListener("click", (e) => {
				this.togglePassiveListener(), e.consume();
			}, !1), r.appendChild(e);
		}
		let o = r.createChild("span", "event-listener-tree-subtitle"), s = n.linkifyRawLocation(this.#e.location(), this.#e.sourceURL(), void 0, { tabStop: !0 });
		o.appendChild(s), this.listItemElement.addEventListener("contextmenu", (n) => {
			let r = new h(n);
			n.target !== s && r.appendApplicableItems(s), t.subtype === "node" && r.defaultSection().appendItem(j(k.openInElementsPanel), () => e(t), { jslogContext: "reveal-in-elements" }), r.defaultSection().appendItem(j(k.deleteEventListener), this.removeListener.bind(this), {
				disabled: !this.#e.canRemove(),
				jslogContext: "delete-event-listener"
			}), r.defaultSection().appendCheckboxItem(j(k.passive), this.togglePassiveListener.bind(this), {
				checked: this.#e.passive(),
				disabled: !this.#e.canTogglePassive(),
				jslogContext: "passive"
			}), r.show();
		});
	}
	removeListener() {
		this.removeListenerBar(), this.#e.remove();
	}
	togglePassiveListener() {
		this.#e.togglePassive().then(() => this.changeCallback());
	}
	removeListenerBar() {
		let e = this.parent;
		if (!e) return;
		e.removeChild(this), e.childCount() || e.collapse();
		let t = !0;
		for (let n of e.children()) n.hidden || (t = !1);
		e.hidden = t;
	}
	eventListener() {
		return this.#e;
	}
	onenter() {
		return this.valueTitle ? (this.valueTitle.click(), !0) : !1;
	}
	ondelete() {
		return this.#e.canRemove() ? (this.removeListener(), !0) : !1;
	}
};
//#endregion
export { M as t };
