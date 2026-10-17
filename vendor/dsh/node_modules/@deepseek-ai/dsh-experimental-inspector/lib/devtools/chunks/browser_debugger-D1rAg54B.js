import { n as e } from "./rolldown-runtime-DF993M8W.js";
import { B as t, D as n, H as r, K as i, X as a } from "./common-DMSVbaSb.js";
import { Aa as o, As as s, D as c, Dt as l, J as ee, Kd as u, L as te, La as ne, Ms as d, Nd as re, No as f, O as ie, Sl as p, St as ae, Tt as oe, U as m, Ut as h, Vo as se, Xn as g, Yn as ce, Zi as _, Zo as le, _o as v, _r as ue, br as y, bt as de, ei as b, et as fe, fa as x, fl as S, fo as pe, gr as me, ii as he, jd as C, jr as w, ks as T, l as ge, mc as E, ml as D, mo as _e, no as O, nt as ve, pc as k, pl as A, qd as j, ws as M, yr as ye } from "./legacy-dM_vujv7.js";
import "./platform-D4TUCh2P.js";
import { d as be, k as xe } from "./StringUtilities-CMDxNrEc.js";
import { c as Se } from "./common-Bs7hSOUj.js";
import { t as Ce } from "./event_listeners-DtE39_Kt.js";
import { M as N, k as we } from "./sources-RXc96T-9.js";
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/browser_debugger/categorizedBreakpointsSidebarPane.css.mjs
var Te = "/*\n * Copyright 2016 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  margin: 0;\n  padding: 2px 4px;\n  min-height: 18px;\n}\n\n.tree-outline {\n  padding: 0;\n}\n\n.tree-outline li {\n  margin-left: 14px;\n  user-select: text;\n}\n\n.tree-outline li.parent {\n  margin-left: 1px;\n}\n\n.tree-outline li:not(.parent)::before {\n  display: none;\n}\n\n.breakpoint-hit {\n  background-color: var(--sys-color-yellow-container);\n  color: var(--sys-color-on-yellow-container);\n}\n\n.breakpoint-hit-marker {\n  background-color: var(--sys-color-yellow-container);\n  border-right: 3px solid var(--sys-color-yellow-outline);\n  color: var(--sys-color-on-yellow-container);\n  height: 100%;\n  left: 0;\n  margin-left: -30px;\n  position: absolute;\n  right: -4px;\n  z-index: -1;\n}\n\ndevtools-checkbox.source-code {\n  max-width: 100%;\n}\n", Ee = /* @__PURE__ */ e({
	CategorizedBreakpointsSidebarPane: () => z,
	DEFAULT_VIEW: () => R
}), P = {
	auctionWorklet: "Ad Auction Worklet",
	animation: "Animation",
	breakpointHit: "breakpoint hit",
	canvas: "Canvas",
	clipboard: "Clipboard",
	control: "Control",
	device: "Device",
	domMutation: "DOM Mutation",
	dragDrop: "Drag / drop",
	geolocation: "Geolocation",
	keyboard: "Keyboard",
	load: "Load",
	media: "Media",
	mouse: "Mouse",
	notification: "Notification",
	parse: "Parse",
	pictureinpicture: "Picture-in-Picture",
	pointer: "Pointer",
	script: "Script",
	sharedStorageWorklet: "Shared Storage Worklet",
	timer: "Timer",
	touch: "Touch",
	trustedTypeViolations: "Trusted Type Violations",
	webaudio: "WebAudio",
	window: "Window",
	worker: "Worker",
	xhr: "XHR"
}, F = i("panels/browser_debugger/CategorizedBreakpointsSidebarPane.ts", P), De = r.bind(void 0, F), I = t.bind(void 0, F), { html: L, render: Oe } = f, { ifExpanded: ke } = ge, R = (e, t, n) => {
	let r = (t) => !!e.filterText || e.highlightedItem && t.includes(e.highlightedItem) || t.some((e) => e.enabled()), i = e.filterText ? new RegExp(be(e.filterText), "i") : null, a = (t) => !i || !!N(t.name).match(i) || t === e.highlightedItem, o = e.sortedCategoryNames.values().map((t) => {
		let n = e.categories.get(t);
		return i && B(t).match(i) ? [t, n] : [t, n?.filter(a)];
	}).filter((e) => !!e[1]?.length).toArray(), s = (t, n) => {
		let r = t.target;
		if (!(r instanceof h)) return;
		let i = r.checked;
		n instanceof k ? e.onBreakpointChange(n, i) : e.categories.get(n)?.forEach((t) => e.onBreakpointChange(t, i));
	}, c = (t) => se({
		small: !0,
		"source-code": !0,
		"breakpoint-hit": e.highlightedItem === t
	});
	Oe(L`
    <devtools-toolbar jslog=${_e()}>
      <devtools-toolbar-input
        type="filter"
        @change=${(t) => e.onFilterChanged(t.detail)}
        style="flex: 1;"
        ></devtools-toolbar-input>
    </devtools-toolbar>
    <devtools-tree autofocus @keydown=${(t) => {
		t.key === " " && (e.onSpaceKeyDown(), t.preventDefault());
	}} .template=${L`
      <ul role="tree">
        ${o.map(([t, n]) => L`
          <li @select=${() => e.onItemSelected(t)}
              @expand=${() => e.onExpandCollapse()}
              role="treeitem"
              jslog-context=${t}
              aria-checked=${n.some((e) => e.enabled()) ? !n.some((e) => !e.enabled()) || "mixed" : !1}
              ?open=${r(n)}>
            <style>${Te}</style>
            <devtools-checkbox
              class="small"
              tabIndex=-1
              title=${B(t)}
              ?indeterminate=${n.some((e) => !e.enabled()) && n.some((e) => e.enabled())}
              ?checked=${!n.some((e) => !e.enabled())}
              @change=${(e) => s(e, t)}
            >${B(t)}</devtools-checkbox>
            <ul role="group">
              ${ke(L`${n.map((t) => L`
                <li @select=${() => e.onItemSelected(t)}
                    role="treeitem"
                    aria-checked=${t.enabled()}
                    jslog-context=${xe(t.name)}>
                  <div ?hidden=${t !== e.highlightedItem} class="breakpoint-hit-marker"></div>
                  <devtools-checkbox
                    class=${c(t)}
                    tabIndex=-1
                    title=${N(t.name)}
                    ?checked=${t.enabled()}
                    aria-description=${t === e.highlightedItem ? De(P.breakpointHit) : le}
                    @change=${(e) => s(e, t)}
                  >${N(t.name)}</devtools-checkbox>
                </li>`)}`)}
            </ul>
          </li>`)}
      </ul>`}>
    </devtools-tree>`, n, { container: { attributes: { jslog: e.jslog } } });
}, z = class extends b {
	#e;
	#t;
	categories = /* @__PURE__ */ new Map();
	#n;
	#r = null;
	#i = null;
	#a;
	#o = null;
	constructor(e, t, n, r = R) {
		super({ useShadowDom: "pure" }), this.#a = r, this.#t = t, this.#e = n;
		for (let t of e) {
			let e = this.categories.get(t.category());
			e || (e = [], this.categories.set(t.category(), e)), e.push(t);
		}
		this.#n = [...this.categories.keys()].sort((e, t) => {
			let n = B(e), r = B(t);
			return n.localeCompare(r, a.instance().locale);
		}), C.instance().addModelListener(S, D.DebuggerPaused, this.update, this), C.instance().addModelListener(S, D.DebuggerResumed, this.update, this), x.instance().addFlavorChangeListener(re, this.update, this), this.requestUpdate();
	}
	getBreakpointFromPausedDetails(e) {
		return null;
	}
	update() {
		let e = x.instance().flavor(re), t = e ? e.model(S) : null, n = t ? t.debuggerPausedDetails() : null, r = n && this.getBreakpointFromPausedDetails(n);
		this.#r = r, r && (w.instance().showView(this.#e), this.requestUpdate());
	}
	#s(e) {
		this.#i = e, this.requestUpdate();
	}
	#c(e) {
		this.#o = e;
	}
	#l() {
		let e = this.#o;
		if (e) {
			if (e instanceof k) this.onBreakpointChanged(e, !e.enabled());
			else {
				let t = this.categories.get(e);
				if (t) {
					let e = t.some((e) => !e.enabled());
					t.forEach((t) => this.onBreakpointChanged(t, e));
				}
			}
		}
	}
	onBreakpointChanged(e, t) {
		e.setEnabled(t), this.requestUpdate();
	}
	performUpdate() {
		let e = {
			filterText: this.#i,
			jslog: this.#t,
			onFilterChanged: this.#s.bind(this),
			onBreakpointChange: this.onBreakpointChanged.bind(this),
			onItemSelected: this.#c.bind(this),
			onSpaceKeyDown: this.#l.bind(this),
			sortedCategoryNames: this.#n,
			categories: this.categories,
			highlightedItem: this.#r,
			onExpandCollapse: () => {
				this.requestUpdate();
			}
		};
		this.#a(e, void 0, this.contentElement);
	}
}, Ae = {
	[E.ANIMATION]: I(P.animation),
	[E.AUCTION_WORKLET]: I(P.auctionWorklet),
	[E.CANVAS]: I(P.canvas),
	[E.CLIPBOARD]: I(P.clipboard),
	[E.CONTROL]: I(P.control),
	[E.DEVICE]: I(P.device),
	[E.DOM_MUTATION]: I(P.domMutation),
	[E.DRAG_DROP]: I(P.dragDrop),
	[E.GEOLOCATION]: I(P.geolocation),
	[E.KEYBOARD]: I(P.keyboard),
	[E.LOAD]: I(P.load),
	[E.MEDIA]: I(P.media),
	[E.MOUSE]: I(P.mouse),
	[E.NOTIFICATION]: I(P.notification),
	[E.PARSE]: I(P.parse),
	[E.PICTURE_IN_PICTURE]: I(P.pictureinpicture),
	[E.POINTER]: I(P.pointer),
	[E.SCRIPT]: I(P.script),
	[E.SHARED_STORAGE_WORKLET]: I(P.sharedStorageWorklet),
	[E.TIMER]: I(P.timer),
	[E.TOUCH]: I(P.touch),
	[E.TRUSTED_TYPE_VIOLATION]: I(P.trustedTypeViolations),
	[E.WEB_AUDIO]: I(P.webaudio),
	[E.WINDOW]: I(P.window),
	[E.WORKER]: I(P.worker),
	[E.XHR]: I(P.xhr)
};
function B(e) {
	return Ae[e]();
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/browser_debugger/CSPViolationBreakpointsSidebarPane.ts
var je = /* @__PURE__ */ e({ CSPViolationBreakpointsSidebarPane: () => Me }), Me = class extends z {
	constructor() {
		let e = T.instance().cspViolationBreakpoints();
		super(e, `${O("sources.csp-violation-breakpoints")}`, "sources.csp-violation-breakpoints");
	}
	getBreakpointFromPausedDetails(e) {
		let t = e.auxData?.violationType ? e.auxData.violationType : "";
		return T.instance().cspViolationBreakpoints().find((e) => e.type() === t) || null;
	}
	onBreakpointChanged(e, t) {
		super.onBreakpointChanged(e, t), T.instance().updateCSPViolationBreakpoints();
	}
}, Ne = "/*\n * Copyright 2017 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n@scope to (devtools-widget > *) {\n  :scope {\n    overflow: auto;\n  }\n\n  .monospace {\n    font-family: var(--monospace-font-family);\n    font-size: var(--monospace-font-size);\n  }\n\n  .dom-breakpoints-container {\n    flex-grow: 1;\n  }\n\n  .breakpoint-list {\n    padding: 0 0 3px;\n    list-style-type: none;\n    margin: 0;\n  }\n\n  .breakpoint-list .dom-breakpoint > div {\n    overflow: hidden;\n    text-overflow: ellipsis;\n  }\n\n  .breakpoint-entry {\n    display: flex;\n    white-space: nowrap;\n    text-overflow: ellipsis;\n    overflow: hidden;\n    padding: 2px 0;\n  }\n\n  .breakpoint-entry:focus-visible {\n    background-color: var(--sys-color-tonal-container);\n  }\n\n  .breakpoint-hit {\n    background-color: var(--sys-color-neutral-container);\n    color: var(--sys-color-on-surface);\n  }\n\n  .placeholder {\n    display: flex;\n    height: 100%;\n    justify-content: center;\n  }\n\n  .gray-info-message {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    padding: 20px;\n  }\n}\n\n:host-context(.sources.panel) .empty-view-scroller {\n  display: none;\n}\n\n:host-context(.elements.panel) .placeholder .gray-info-message {\n  display: none;\n}\n\n@media (forced-colors: active) {\n  @scope to (devtools-widget > *) {\n    .breakpoint-entry:focus-visible,\n    .breakpoint-list .breakpoint-entry:hover {\n      forced-color-adjust: none;\n      background-color: Highlight;\n    }\n\n    .breakpoint-entry:focus-visible *,\n    .breakpoint-list .breakpoint-entry:hover * {\n      color: HighlightText;\n    }\n  }\n}\n", Pe = /* @__PURE__ */ e({
	ContextMenuProvider: () => Ve,
	DEFAULT_VIEW: () => K,
	DOMBreakpointsSidebarPane: () => ze
}), V = {
	noBreakpoints: "No DOM breakpoints",
	domBreakpointsDescription: "DOM breakpoints pause on the code that changes a DOM node or its children.",
	domBreakpointsList: "DOM Breakpoints list",
	sS: "{PH1}: {PH2}",
	sSS: "{PH1}: {PH2}, {PH3}",
	checked: "checked",
	unchecked: "unchecked",
	sBreakpointHit: "{PH1} breakpoint hit",
	breakpointHit: "breakpoint hit",
	revealDomNodeInElementsPanel: "Reveal DOM node in Elements panel",
	removeBreakpoint: "Remove breakpoint",
	removeAllDomBreakpoints: "Remove all DOM breakpoints",
	subtreeModified: "Subtree modified",
	attributeModified: "Attribute modified",
	nodeRemoved: "Node removed",
	breakOn: "Break on",
	breakpointRemoved: "Breakpoint removed",
	breakpointSet: "Breakpoint set"
}, H = i("panels/browser_debugger/DOMBreakpointsSidebarPane.ts", V), U = r.bind(void 0, H), W = t.bind(void 0, H), Fe = "https://developer.chrome.com/docs/devtools/javascript/breakpoints#dom", { html: G, render: Ie, Directives: Le } = f, { widget: Re } = he, K = (e, t, n) => {
	let r = e.breakpoints.length > 0;
	Ie(G`
      <style>${Ne}</style>
      <div class="dom-breakpoints-container" jslog=${O("sources.dom-breakpoints").track({ resize: !0 })}>
        ${r ? G`<ul class="breakpoint-list"
              aria-label=${U(V.domBreakpointsList)}>
            ${e.breakpoints.map((t) => {
		let { breakpoint: n } = t, r = n.enabled ? U(V.checked) : U(V.unchecked), i = Se.instance().linkify(n.node, {
			preventKeyboardFocus: !0,
			tooltip: void 0
		}), a = n.node.simpleSelector();
		return G`
                <li class=${`breakpoint-entry ${t.isHighlighted ? "breakpoint-hit" : ""}`}
                    tabindex=${t.isFocused ? "0" : "-1"}
                    @click=${() => e.onBreakpointClick(n)}
                    @contextmenu=${(t) => e.onBreakpointContextMenu(n, t)}
                    @keydown=${(t) => e.onBreakpointKeyDown(n, t)}
                    aria-label=${U(V.sSS, {
			PH1: t.label,
			PH2: a,
			PH3: r
		})}
                    aria-description=${t.isHighlighted ? U(V.sBreakpointHit, { PH1: r }) : r}
                    jslog=${o().context(n.type).track({ keydown: "ArrowUp|ArrowDown|PageUp|PageDown" })}>
                  <devtools-checkbox
                    class="checkbox-label"
                    .checked=${n.enabled}
                    @click=${(e) => e.stopPropagation()}
                    @change=${() => e.onBreakpointCheckboxClick(n)}
                    tabindex="-1"
                    aria-label=${U(V.sS, {
			PH1: t.label,
			PH2: a
		})}
                    aria-description=${Le.ifDefined(t.isHighlighted ? U(V.breakpointHit) : void 0)}
                    jslog=${pe().track({ click: !0 })}>
                  </devtools-checkbox>
                  <div class="dom-breakpoint">
                    <code class="monospace" style="display: block;">${i}</code>
                    <div>${t.label}</div>
                  </div>
                </li>`;
	})}
          </ul>` : G`<div class="placeholder">
            <div class="gray-info-message">${U(V.noBreakpoints)}</div>
            ${Re(te, {
		header: U(V.noBreakpoints),
		text: U(V.domBreakpointsDescription),
		link: Fe
	})}
          </div>`}
      </div>
    `, n);
}, q, ze = class e extends b {
	#e = [];
	#t = null;
	#n = null;
	#r;
	set highlightedBreakpoint(e) {
		this.#t = e, this.requestUpdate();
	}
	set focusedBreakpoint(e) {
		this.#n !== e && (this.#n = e, this.#i(), this.requestUpdate());
	}
	#i() {
		this.#n && !this.#e.includes(this.#n) && (this.#n = null), !this.#n && this.#e.length > 0 && (this.#n = this.#e[0]);
	}
	constructor(e = K) {
		super({ useShadowDom: !0 }), this.#r = e, C.instance().addModelListener(s, d.DOM_BREAKPOINT_ADDED, this.breakpointAdded, this), C.instance().addModelListener(s, d.DOM_BREAKPOINT_TOGGLED, this.breakpointToggled, this), C.instance().addModelListener(s, d.DOM_BREAKPOINTS_REMOVED, this.breakpointsRemoved, this);
		for (let e of C.instance().models(s)) {
			e.retrieveDOMBreakpoints();
			for (let t of e.domBreakpoints()) this.addBreakpoint(t);
		}
		this.update();
	}
	static instance() {
		return q ||= new e(), q;
	}
	performUpdate() {
		let e = {
			breakpoints: this.#e.map((e) => ({
				breakpoint: e,
				label: Be.get(e.type)?.() ?? "",
				isHighlighted: e === this.#t,
				isFocused: e === this.#n
			})),
			onBreakpointClick: this.onBreakpointClick.bind(this),
			onBreakpointCheckboxClick: this.onBreakpointCheckboxClick.bind(this),
			onBreakpointContextMenu: this.onBreakpointContextMenu.bind(this),
			onBreakpointKeyDown: this.onBreakpointKeyDown.bind(this)
		};
		this.#r(e, void 0, this.contentElement);
	}
	onBreakpointClick(e) {
		this.focusedBreakpoint = e;
	}
	onBreakpointKeyDown(e, t) {
		let n = t;
		if (n.key === " ") this.onBreakpointCheckboxClick(e), n.consume(!0);
		else if (n.key === "ArrowUp" || n.key === "ArrowDown") {
			let t = this.#e.indexOf(e), r = n.key === "ArrowUp" ? t - 1 : t + 1;
			r >= 0 && r < this.#e.length && (this.focusedBreakpoint = this.#e[r], this.updateComplete.then(() => {
				this.contentElement.querySelectorAll(".breakpoint-entry")[r].focus();
			}), n.consume(!0));
		}
	}
	breakpointAdded(e) {
		this.addBreakpoint(e.data);
	}
	breakpointToggled(e) {
		this.requestUpdate();
	}
	breakpointsRemoved(e) {
		let t = e.data;
		for (let e of t) {
			let t = this.#e.indexOf(e);
			t >= 0 && this.#e.splice(t, 1);
		}
		this.#i(), this.requestUpdate();
	}
	addBreakpoint(e) {
		this.#e.includes(e) || (this.#e.push(e), this.#e.sort((e, t) => e.type > t.type ? -1 : +(e.type < t.type)), this.#i(), this.requestUpdate());
	}
	onBreakpointContextMenu(e, t) {
		this.focusedBreakpoint = e;
		let r = new y(t);
		r.defaultSection().appendItem(U(V.revealDomNodeInElementsPanel), () => n(e.node), { jslogContext: "reveal-in-elements" }), r.defaultSection().appendItem(U(V.removeBreakpoint), () => {
			e.domDebuggerModel.removeDOMBreakpoint(e.node, e.type);
		}, { jslogContext: "remove-breakpoint" }), r.defaultSection().appendItem(U(V.removeAllDomBreakpoints), () => {
			e.domDebuggerModel.removeAllDOMBreakpoints();
		}, { jslogContext: "remove-all-dom-breakpoints" }), r.show();
	}
	onBreakpointCheckboxClick(e) {
		this.focusedBreakpoint = e, e.domDebuggerModel.toggleDOMBreakpoint(e, !e.enabled);
	}
	flavorChanged(e) {
		this.update();
	}
	update() {
		let e = x.instance().flavor(A);
		if (this.highlightedBreakpoint = null, !e?.auxData || e.reason !== j.PausedEventReason.DOM) return;
		let t = e.debuggerModel.target().model(s);
		if (!t) return;
		let n = t.resolveDOMBreakpointData(e.auxData);
		if (n) {
			for (let e of this.#e) e.node === n.node && e.type === n.type && (this.highlightedBreakpoint = e, this.focusedBreakpoint = e);
			this.#t && w.instance().showView("sources.dom-breakpoints");
		}
	}
}, Be = /* @__PURE__ */ new Map([
	[u.DOMBreakpointType.SubtreeModified, W(V.subtreeModified)],
	[u.DOMBreakpointType.AttributeModified, W(V.attributeModified)],
	[u.DOMBreakpointType.NodeRemoved, W(V.nodeRemoved)]
]), Ve = class {
	appendApplicableItems(e, t, n) {
		if (n.pseudoType()) return;
		let r = n.domModel().target().model(s);
		if (!r) return;
		function i(e) {
			if (!r) return;
			let t = we.get(e), i = t ? t() : "";
			r.hasDOMBreakpoint(n, e) ? (r.removeDOMBreakpoint(n, e), m.alert(`${U(V.breakpointRemoved)}: ${i}`)) : (r.setDOMBreakpoint(n, e), m.alert(`${U(V.breakpointSet)}: ${i}`));
		}
		let a = t.debugSection().appendSubMenuItem(U(V.breakOn), !1, "break-on"), o = {
			SubtreeModified: u.DOMBreakpointType.SubtreeModified,
			AttributeModified: u.DOMBreakpointType.AttributeModified,
			NodeRemoved: u.DOMBreakpointType.NodeRemoved
		};
		for (let e of Object.values(o)) {
			let t = we.get(e);
			t && a.defaultSection().appendCheckboxItem(t(), i.bind(null, e), {
				checked: r.hasDOMBreakpoint(n, e),
				jslogContext: e
			});
		}
	}
}, He = /* @__PURE__ */ e({ EventListenerBreakpointsSidebarPane: () => Ue }), J, Ue = class e extends z {
	constructor() {
		let e = T.instance().eventListenerBreakpoints(), t = M.instance().eventListenerBreakpoints();
		e = e.concat(t), super(e, `${O("sources.event-listener-breakpoints")}`, "sources.event-listener-breakpoints");
	}
	static instance() {
		return J ||= new e(), J;
	}
	getBreakpointFromPausedDetails(e) {
		let t = e.auxData;
		return t ? t && T.instance().resolveEventListenerBreakpoint(t) || M.instance().resolveEventListenerBreakpoint(t) : null;
	}
}, We = /* @__PURE__ */ e({
	ActionDelegate: () => Ge,
	ObjectEventListenersSidebarPane: () => Y,
	objectGroupName: () => X
}), Y = class e extends b {
	#e;
	eventListenersView;
	constructor() {
		super(), this.contentElement.setAttribute("jslog", `${O("sources.global-listeners")}`), this.eventListenersView = new Ce(), this.eventListenersView.changeCallback = this.requestUpdate.bind(this), this.eventListenersView.enableDefaultTreeFocus = !0, this.eventListenersView.show(this.element), this.setDefaultFocusedChild(this.eventListenersView), this.requestUpdate();
	}
	toolbarItems() {
		let e = ce.createActionButton("browser-debugger.refresh-global-event-listeners");
		return e.setSize(_.SMALL), [e];
	}
	async performUpdate() {
		this.#e &&= (this.#e.runtimeModel.releaseObjectGroup(X), void 0);
		let e = [], t = x.instance().flavor(p);
		if (t) {
			this.#e = t;
			let n = await t.evaluate({
				expression: "self",
				objectGroup: X,
				includeCommandLineAPI: !1,
				silent: !0,
				returnByValue: !1,
				generatePreview: !1
			}, !1, !1);
			!("error" in n) && !n.exceptionDetails && e.push(n.object);
		}
		await this.eventListenersView.addObjects(e);
	}
	wasShown() {
		super.wasShown(), x.instance().addFlavorChangeListener(p, this.requestUpdate, this), x.instance().setFlavor(e, this);
	}
	willHide() {
		x.instance().setFlavor(e, null), x.instance().removeFlavorChangeListener(p, this.requestUpdate, this), super.willHide(), this.#e &&= (this.#e.runtimeModel.releaseObjectGroup(X), void 0);
	}
}, Ge = class {
	handleAction(e, t) {
		if (t === "browser-debugger.refresh-global-event-listeners") {
			let t = e.flavor(Y);
			return t ? (t.requestUpdate(), !0) : !1;
		}
		return !1;
	}
}, X = "object-event-listeners-sidebar-pane", Ke = "/*\n * Copyright 2017 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.breakpoint-list {\n  padding-bottom: 3px;\n}\n\n.breakpoint-list .editing.being-edited {\n  overflow: hidden;\n  white-space: nowrap;\n}\n\n.breakpoint-condition {\n  display: block;\n  margin: 4px 8px 4px 23px;\n}\n\n.breakpoint-condition-input {\n  display: block;\n  margin-left: 0;\n  margin-right: 0;\n  border: 1px solid var(--sys-color-neutral-outline);\n  border-radius: 4px;\n\n  &:focus {\n    outline: 5px auto var(--sys-color-tonal-outline);\n    box-shadow: none;\n  }\n}\n\n.breakpoint-entry {\n  white-space: nowrap;\n  padding: 2px 0;\n}\n\n.breakpoint-list .breakpoint-entry:focus-visible {\n  background-color: var(--sys-color-tonal-container);\n}\n\n.breakpoint-entry devtools-checkbox {\n  max-width: 100%;\n}\n\n.breakpoint-hit {\n  background-color: var(--sys-color-yellow-container);\n  border-right: 3px solid var(--sys-color-yellow-outline);\n  color: var(--sys-color-on-yellow-container);\n}\n\n@media (forced-colors: active) {\n  .breakpoint-list .breakpoint-entry:hover,\n  .breakpoint-list .breakpoint-entry:focus-visible {\n    forced-color-adjust: none;\n    background-color: Highlight;\n  }\n\n  .breakpoint-list .breakpoint-entry:hover *,\n  .breakpoint-list .breakpoint-entry:focus-visible * {\n    color: HighlightText;\n  }\n}\n", qe = /* @__PURE__ */ e({ XHRBreakpointsSidebarPane: () => Ze }), Z = {
	xhrfetchBreakpoints: "XHR/fetch Breakpoints",
	noBreakpoints: "No breakpoints",
	addXhrfetchBreakpoint: "Add XHR/fetch breakpoint",
	addBreakpoint: "Add breakpoint",
	breakWhenUrlContains: "Break when URL contains:",
	urlBreakpoint: "URL Breakpoint",
	urlContainsS: "URL contains \"{PH1}\"",
	anyXhrOrFetch: "Any XHR or fetch",
	breakpointHit: "breakpoint hit",
	removeAllBreakpoints: "Remove all breakpoints",
	removeBreakpoint: "Remove breakpoint"
}, Je = i("panels/browser_debugger/XHRBreakpointsSidebarPane.ts", Z), Q = r.bind(void 0, Je), $ = /* @__PURE__ */ new WeakMap(), Ye = /* @__PURE__ */ new WeakMap(), Xe, Ze = class e extends b {
	#e;
	#t;
	#n;
	#r;
	#i;
	#a;
	constructor() {
		super({
			jslog: `${O("source.xhr-breakpoints")}`,
			useShadowDom: !0
		}), this.registerRequiredCSS(Ke), this.#e = new ye(), this.#t = new me(this.#e, this, ue.NonViewport), this.contentElement.appendChild(this.#t.element), this.#t.element.classList.add("breakpoint-list", "hidden"), fe(this.#t.element), l(this.#t.element, Q(Z.xhrfetchBreakpoints)), this.#n = this.contentElement.createChild("div", "gray-info-message"), this.#n.textContent = Q(Z.noBreakpoints), this.#r = /* @__PURE__ */ new Map(), this.#i = new g(Q(Z.addXhrfetchBreakpoint), "plus", void 0, "sources.add-xhr-fetch-breakpoint"), this.#i.setSize(_.SMALL), this.#i.addEventListener(g.Events.CLICK, () => {
			this.addButtonClicked();
		}), this.#n.addEventListener("contextmenu", this.emptyElementContextMenu.bind(this), !0), this.#n.tabIndex = -1, this.restoreBreakpoints(), this.update();
	}
	static instance() {
		return Xe ||= new e(), Xe;
	}
	toolbarItems() {
		return [this.#i];
	}
	emptyElementContextMenu(e) {
		let t = new y(e);
		t.defaultSection().appendItem(Q(Z.addBreakpoint), this.addButtonClicked.bind(this), { jslogContext: "sources.add-xhr-fetch-breakpoint" }), t.show();
	}
	async addButtonClicked() {
		await w.instance().showView("sources.xhr-breakpoints");
		let e = document.createElement("p");
		e.classList.add("breakpoint-condition"), e.textContent = Q(Z.breakWhenUrlContains), e.setAttribute("jslog", `${v("condition").track({ change: !0 })}`);
		let t = e.createChild("span", "breakpoint-condition-input");
		l(t, Q(Z.urlBreakpoint)), this.addListElement(e, this.#t.element.firstChild);
		let n = new c((t, n) => {
			this.removeListElement(e), T.instance().addXHRBreakpoint(n, !0), this.setBreakpoint(n), this.update();
		}, () => {
			this.removeListElement(e), this.update();
		}, void 0);
		ie.startEditing(t, n);
	}
	heightForItem(e) {
		return 0;
	}
	isItemSelectable(e) {
		return !0;
	}
	setBreakpoint(e) {
		this.#e.indexOf(e) === -1 ? this.#e.insertWithComparator(e, (e, t) => e > t ? 1 : e < t ? -1 : 0) : this.#t.refreshItem(e), (!this.#t.selectedItem() || !this.hasFocus()) && this.#t.selectItem(this.#e.at(0));
	}
	createElementForItem(e) {
		let t = document.createElement("div");
		ve(t);
		let n = t.createChild("div", "breakpoint-entry");
		$.set(t, n);
		let r = T.instance().xhrBreakpoints().get(e) || !1;
		ee(n), de(n, r), n.addEventListener("contextmenu", this.contextMenu.bind(this, e), !0);
		let i = e ? Q(Z.urlContainsS, { PH1: e }) : Q(Z.anyXhrOrFetch), a = h.create(i, r, void 0, void 0, !0);
		return oe(a, !0), l(n, i), n.appendChild(a), a.addEventListener("click", this.checkboxClicked.bind(this, e, r), !1), n.addEventListener("click", (t) => {
			t.target === n && this.checkboxClicked(e, r);
		}, !1), Ye.set(n, a), a.tabIndex = -1, n.tabIndex = -1, e === this.#t.selectedItem() && (n.tabIndex = 0, this.setDefaultFocusedElement(n)), n.addEventListener("keydown", (t) => {
			let n = !1;
			t.key === " " ? (this.checkboxClicked(e, r), n = !0) : t.key === "Enter" && (this.labelClicked(e), n = !0), n && t.consume(!0);
		}), e === this.#a && (n.classList.add("breakpoint-hit"), ae(n, Q(Z.breakpointHit))), a.classList.add("cursor-auto"), a.addEventListener("dblclick", this.labelClicked.bind(this, e), !1), this.#r.set(e, t), t.setAttribute("jslog", `${ne().track({
			click: !0,
			dblclick: !0,
			resize: !0,
			keydown: "ArrowUp|ArrowDown|PageUp|PageDown|Enter|Space"
		})}`), t;
	}
	selectedItemChanged(e, t, n, r) {
		if (n) {
			let e = $.get(n);
			if (!e) throw Error("Expected breakpoint entry to be found for an element");
			e.tabIndex = -1;
		}
		if (r) {
			let e = $.get(r);
			if (!e) throw Error("Expected breakpoint entry to be found for an element");
			this.setDefaultFocusedElement(e), e.tabIndex = 0, this.hasFocus() && e.focus();
		}
	}
	updateSelectedItemARIA(e, t) {
		return !0;
	}
	removeBreakpoint(e) {
		let t = this.#e.indexOf(e);
		t >= 0 && this.#e.remove(t), this.#r.delete(e), this.update();
	}
	addListElement(e, t) {
		this.#t.element.insertBefore(e, t), this.#n.classList.add("hidden"), this.#t.element.classList.remove("hidden");
	}
	removeListElement(e) {
		this.#t.element.removeChild(e), this.#t.element.firstElementChild || (this.#n.classList.remove("hidden"), this.#t.element.classList.add("hidden"));
	}
	contextMenu(e, t) {
		let n = new y(t);
		function r() {
			T.instance().removeXHRBreakpoint(e), this.removeBreakpoint(e);
		}
		function i() {
			for (let e of this.#r.keys()) T.instance().removeXHRBreakpoint(e), this.removeBreakpoint(e);
			this.update();
		}
		let a = Q(Z.removeAllBreakpoints);
		n.defaultSection().appendItem(Q(Z.addBreakpoint), this.addButtonClicked.bind(this), { jslogContext: "sources.add-xhr-fetch-breakpoint" }), n.defaultSection().appendItem(Q(Z.removeBreakpoint), r.bind(this), { jslogContext: "sources.remove-xhr-fetch-breakpoint" }), n.defaultSection().appendItem(a, i.bind(this), { jslogContext: "sources.remove-all-xhr-fetch-breakpoints" }), n.show();
	}
	checkboxClicked(e, t) {
		let n = this.hasFocus();
		T.instance().toggleXHRBreakpoint(e, !t), this.#t.refreshItem(e), this.#t.selectItem(e), n && this.focus();
	}
	labelClicked(e) {
		let t = this.#r.get(e), n = document.createElement("span");
		n.classList.add("breakpoint-condition"), n.textContent = e, n.setAttribute("jslog", `${v("condition").track({ change: !0 })}`), t && (this.#t.element.insertBefore(n, t), t.classList.add("hidden"));
		let r = new c((t, n, r, i) => {
			this.removeListElement(t), T.instance().removeXHRBreakpoint(e), this.removeBreakpoint(e);
			let a = !0;
			if (i) {
				let e = $.get(i), t = e ? Ye.get(e) : void 0;
				t && (a = t.checked);
			}
			T.instance().addXHRBreakpoint(n, a), this.setBreakpoint(n), this.#t.selectItem(n), this.focus();
		}, (e, t) => {
			this.removeListElement(e), t && t.classList.remove("hidden"), this.focus();
		}, t);
		ie.startEditing(n, r);
	}
	flavorChanged(e) {
		this.update();
	}
	update() {
		let e = this.#e.length === 0;
		this.#t.element.classList.toggle("hidden", e), this.#n.classList.toggle("hidden", !e);
		let t = x.instance().flavor(A);
		if (!t || t.reason !== j.PausedEventReason.XHR) {
			if (this.#a) {
				let e = this.#a;
				this.#a = void 0, this.#e.indexOf(e) >= 0 && this.#t.refreshItem(e);
			}
			return;
		}
		let n = t.auxData?.breakpointURL;
		this.#a = n, !(this.#e.indexOf(n) < 0) && (this.#t.refreshItem(n), w.instance().showView("sources.xhr-breakpoints"));
	}
	restoreBreakpoints() {
		let e = T.instance().xhrBreakpoints();
		for (let t of e.keys()) this.setBreakpoint(t);
	}
};
//#endregion
export { je as CSPViolationBreakpointsSidebarPane, Ee as CategorizedBreakpointsSidebarPane, Pe as DOMBreakpointsSidebarPane, He as EventListenerBreakpointsSidebarPane, We as ObjectEventListenersSidebarPane, qe as XHRBreakpointsSidebarPane };
