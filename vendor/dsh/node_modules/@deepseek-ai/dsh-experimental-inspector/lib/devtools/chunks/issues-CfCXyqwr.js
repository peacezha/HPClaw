import { n as e } from "./rolldown-runtime-DF993M8W.js";
import { D as t, H as n, K as r, W as i, i as a } from "./common-DMSVbaSb.js";
import { $i as o, Dl as s, El as c, Fo as l, Ja as ee, L as te, Mt as u, Po as d, Ta as ne, Vd as f, Zo as re, a as ie, al as ae, bp as oe, br as se, ef as p, ei as ce, ff as m, fp as le, ha as ue, i as h, ii as de, jo as fe, jr as pe, kt as g, ll as me, ma as he, mo as ge, o as _e, qo as ve, sr as ye, tr as be, za as _ } from "./legacy-dM_vujv7.js";
import "./platform-D4TUCh2P.js";
import { k as xe } from "./StringUtilities-CMDxNrEc.js";
import { c as Se } from "./FormatterActions-D6HaA-6R.js";
import { s as Ce } from "./bindings-DyamxTH2.js";
import { C as we, Vt as Te, c as Ee, v as De } from "./common-Bs7hSOUj.js";
import { A as Oe, C as v, D as ke, E as y, O as Ae, T as b, _ as je, a as Me, b as Ne, d as Pe, g as Fe, h as Ie, k as Le, l as Re, m as x, o as S, s as ze, u as Be, v as Ve, x as He, y as Ue } from "./issues_manager-Ba4w-pt1.js";
import { a as We, i as Ge, n as Ke, r as qe } from "./issue_counter-aMFHu4Gr.js";
import { i as Je, t as Ye } from "./UIFilter-CIzBruM3.js";
import { r as C, t as w } from "./UIRequestLocation-CtGcVN3I.js";
import { t as Xe } from "./request_link_icon-Do-M_Ngw.js";
import { t as Ze } from "./adorners-D4bF0Xzg.js";
import { n as Qe } from "./markdown_view-D8BG91nk.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/issues/AffectedResourcesView.ts
var $e = {
	unknown: "unknown",
	clickToRevealTheFramesDomNodeIn: "Click to reveal the frame's DOM node in the Elements panel",
	unavailable: "unavailable"
}, et = r("panels/issues/AffectedResourcesView.ts", $e), tt = n.bind(void 0, et), T = /* @__PURE__ */ function(e) {
	return e.COOKIE = "Cookie", e.DIRECTIVE = "Directive", e.ELEMENT = "Element", e.REQUEST = "Request", e.SOURCE = "Source", e;
}({}), nt = (e) => (/[^/]+$/.exec(e) || /[^/]+\/$/.exec(e) || [""])[0], E = class extends h {
	#e;
	issue;
	affectedResourcesCountElement;
	affectedResources;
	#t;
	#n;
	#r;
	requestResolver;
	constructor(e, t, n) {
		super(void 0, void 0, n), this.#e = e, this.issue = t, this.toggleOnClick = !0, this.affectedResourcesCountElement = this.createAffectedResourcesCounter(), this.affectedResources = this.createAffectedResources(), this.#t = 0, this.requestResolver = new Te(), this.#n = [], this.#r = /* @__PURE__ */ new Set();
	}
	setIssue(e) {
		this.issue = e;
	}
	createAffectedResourcesCounter() {
		let e = document.createElement("div");
		return e.classList.add("affected-resource-label"), this.listItemElement.appendChild(e), e;
	}
	createAffectedResources() {
		let e = new h(), t = document.createElement("table");
		return t.classList.add("affected-resource-list"), e.listItemElement.appendChild(t), this.appendChild(e), t;
	}
	updateAffectedResourceCount(e) {
		this.#t = e, this.affectedResourcesCountElement.textContent = this.getResourceNameWithCount(e), this.hidden = this.#t === 0, this.#e.updateAffectedResourceVisibility();
	}
	isEmpty() {
		return this.#t === 0;
	}
	clear() {
		this.affectedResources.textContent = "", this.requestResolver.clear();
	}
	expandIfOneResource() {
		this.#t === 1 && this.expand();
	}
	#i(e) {
		let t = s.instance().getFrame(e);
		if (!t?.url && (this.#r.add(e), !this.#n.length)) {
			let e = s.instance().addEventListener(c.FRAME_ADDED_TO_TARGET, this.#a, this), t = s.instance().addEventListener(c.FRAME_NAVIGATED, this.#a, this);
			this.#n = [e, t];
		}
		return t;
	}
	#a(e) {
		let t = e.data.frame;
		if (!t.url) return;
		let n = this.#r.delete(t.id);
		this.#r.size === 0 && this.#n.length && (oe(this.#n), this.#n = []), n && this.update();
	}
	createFrameCell(e, n) {
		let r = this.#i(e), i = r && (r.unreachableUrl() || r.url) || tt($e.unknown), a = document.createElement("td");
		if (a.classList.add("affected-resource-cell"), r) {
			let r = new fe();
			r.name = "code-circle", r.classList.add("link", "elements-panel", "medium"), r.onclick = async () => {
				m.issuesPanelResourceOpened(n, "Element");
				let r = s.instance().getFrame(e);
				if (r) {
					let e = await r.getOwnerDOMNodeOrDocument();
					e && t(e);
				}
			}, r.title = tt($e.clickToRevealTheFramesDomNodeIn), a.appendChild(r);
		}
		return a.appendChild(document.createTextNode(i)), a.onmouseenter = () => {
			let t = s.instance().getFrame(e);
			t && t.highlight();
		}, a.onmouseleave = () => me.hideDOMNodeHighlight(), a;
	}
	createRequestCell(e, t = {}) {
		let n = document.createElement("td");
		n.classList.add("affected-resource-cell");
		let r = new Xe();
		return r.data = {
			...t,
			affectedRequest: e,
			requestResolver: this.requestResolver,
			displayURL: !0
		}, n.appendChild(r), n;
	}
	async createElementCell({ backendNodeId: e, nodeName: t, target: n }, r) {
		if (!n) {
			let e = document.createElement("td");
			return e.textContent = t || tt($e.unavailable), e;
		}
		function i() {
			m.issuesPanelResourceOpened(r, "Element");
		}
		let a = new ae(n, e), o = Ee.instance().linkify(a, {
			textContent: t || void 0,
			onClick: i
		}), s = document.createElement("td");
		return s.classList.add("affected-resource-element", "devtools-link"), l(o, s), s;
	}
	appendSourceLocation(e, t, n) {
		let r = document.createElement("td");
		if (r.classList.add("affected-source-location"), t) {
			let e = new we(40).linkifyScriptLocation(n || null, t.scriptId || null, t.url, t.lineNumber, {
				columnNumber: t.columnNumber,
				inlineFrameIndex: 0
			});
			e.setAttribute("jslog", `${_("source-location").track({ click: !0 })}`), r.appendChild(e);
		}
		e.appendChild(r);
	}
	appendColumnTitle(e, t, n = null) {
		let r = document.createElement("td");
		r.classList.add("affected-resource-header"), n && r.classList.add(n), r.textContent = t, e.appendChild(r);
	}
	createIssueDetailCell(e, t = null) {
		let n = document.createElement("td");
		return typeof e == "string" ? n.textContent = e : n.appendChild(e), t && n.classList.add(t), n;
	}
	appendIssueDetailCell(e, t, n = null) {
		let r = this.createIssueDetailCell(t, n);
		return e.appendChild(r), r;
	}
}, rt = /* @__PURE__ */ e({ AffectedSelectivePermissionsInterventionView: () => ot }), D = {
	nViolations: "{n, plural, =1 {# violation} other {# violations}}",
	api: "API",
	script: "Script",
	adAncestry: "Ad Ancestry",
	unknown: "unknown",
	loading: "loading…"
}, it = r("panels/issues/AffectedSelectivePermissionsInterventionView.ts", D), O = n.bind(void 0, it), { widget: at } = de, ot = class extends E {
	#e = new we();
	getResourceNameWithCount(e) {
		return O(D.nViolations, { n: e });
	}
	#t() {
		let e = Array.from(this.issue.getSelectivePermissionsInterventionIssues());
		l(d`
      <tr>
        <td class="affected-resource-header">${O(D.api)}</td>
        <td class="affected-resource-header">${O(D.script)}</td>
        <td class="affected-resource-header">${O(D.adAncestry)}</td>
      </tr>
      ${e.map((e) => this.#n(e))}
    `, this.affectedResources, { host: this }), this.updateAffectedResourceCount(e.length);
	}
	#n(e) {
		let t = e.details(), n = e.model(), r = t.stackTrace && n ? this.#r(t.stackTrace, n) : Promise.resolve(d`<span>${O(D.unknown)}</span>`), i = n ? n.target() : null;
		return d`
      <tr class="affected-resource-directive">
        <td>${t.apiName}</td>
        <td>${ve(r, d`<span>${O(D.loading)}</span>`)}</td>
        <td class="affected-resource-cell">
          <div class="ad-ancestry-list">
            ${(t.adAncestry?.ancestryChain || []).map((e) => {
			let t = this.#e.linkifyScriptLocation(i, e.scriptId, "", 0);
			return d`<div>${t}</div>`;
		})}
            ${t.adAncestry?.rootScriptFilterlistRule ? d`<div>Rule: ${t.adAncestry.rootScriptFilterlistRule}</div>` : re}
          </div>
        </td>
      </tr>
    `;
	}
	async #r(e, t) {
		let n = await Ce.instance().createStackTraceFromProtocolRuntime(e, t.target());
		return d`${at(De, {
			stackTrace: n,
			options: { expandable: !0 }
		})}`;
	}
	update() {
		this.requestResolver.clear(), this.#e.reset(), this.#t();
	}
}, st = {
	hiddenIssues: "Hidden issues",
	unhideAll: "Unhide all"
}, ct = r("panels/issues/HiddenIssuesRow.ts", st), lt = n.bind(void 0, ct), ut = (e, t, n) => {
	l(d`
  <div class="header">
    <devtools-adorner class="aggregated-issues-count" .name=${"countWrapper"}>
      <span>${e.count}</span>
    </devtools-adorner>
    <div class="title">${lt(st.hiddenIssues)}</div>
    <devtools-button class="unhide-all-issues-button"
                     jslog=${ue().track({ click: !0 }).context("issues.unhide-all-hiddes")}
                     @click=${e.onUnhideAllIssues}
                     @keydown=${(e) => {
		e.key === "Enter" && e.stopImmediatePropagation();
	}}
                     .variant=${o.OUTLINED}>${lt(st.unhideAll)}</devtools-button>
  </div>`, n);
}, dt = class extends h {
	#e;
	constructor(e = ut) {
		super(void 0, !0, "hidden-issues"), this.#e = e, this.toggleOnClick = !0, this.listItemElement.classList.add("issue-category", "hidden-issues"), this.childrenListElement.classList.add("hidden-issues-body"), this.update(0);
	}
	update(e) {
		let t = S.instance(), n = {
			count: e,
			onUnhideAllIssues: t.unhideAllIssues.bind(t)
		};
		this.#e(n, void 0, this.listItemElement);
	}
}, ft = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.element-reveal-icon {\n  display: inline-block;\n  width: 20px;\n  height: 20px;\n  mask-image: var(--image-file-select-element);\n  background-color: var(--icon-default);\n}\n", pt = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t = () => {};
	#n = () => {};
	#r = () => {};
	set data(e) {
		this.#t = e.onElementRevealIconClick, this.#n = e.onElementRevealIconMouseEnter, this.#r = e.onElementRevealIconMouseLeave, this.#i();
	}
	#i() {
		this.#a();
	}
	#a() {
		l(d`
      <style>${ft}</style>
      <span
        class="element-reveal-icon"
        jslog=${_("elements-panel").track({ click: !0 })}
        @click=${this.#t}
        @mouseenter=${this.#n}
        @mouseleave=${this.#r}></span>
      `, this.#e, { host: this });
	}
};
customElements.define("devtools-elements-panel-link", pt);
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/issues/components/hideIssuesMenu.css.mjs
var mt = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.hide-issues-menu-btn {\n  position: relative;\n  display: flex;\n  background-color: transparent;\n  flex: none;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  margin: 0 -2px 0 4px;\n  overflow: hidden;\n  border-radius: 0;\n  border: none;\n\n  &:hover > devtools-icon {\n    color: var(--icon-default-hover);\n  }\n}\n", ht = { tooltipTitle: "Hide issues" }, gt = r("panels/issues/components/HideIssuesMenu.ts", ht), _t = n.bind(void 0, gt), vt = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t = "";
	#n = () => {};
	set data(e) {
		this.#t = e.menuItemLabel, this.#n = e.menuItemAction, this.#r();
	}
	onMenuOpen(e) {
		e.stopPropagation();
		let t = this.#e.querySelector("devtools-button"), n = new se(e, {
			x: t?.getBoundingClientRect().left,
			y: t?.getBoundingClientRect().bottom
		});
		n.headerSection().appendItem(this.#t, () => this.#n(), { jslogContext: "toggle-similar-issues" }), n.show();
	}
	onKeydown(e) {
		(e.key === "Enter" || e.key === "Space") && e.stopImmediatePropagation();
	}
	#r() {
		l(d`
    <style>${mt}</style>
    <devtools-button
      .data=${{
			variant: o.ICON,
			iconName: "dots-vertical",
			title: _t(ht.tooltipTitle)
		}}
      .jslogContext=${"hide-issues"}
      class="hide-issues-menu-btn"
      @click=${this.onMenuOpen}
      @keydown=${this.onKeydown}></devtools-button>
    `, this.#e, { host: this });
	}
};
customElements.define("devtools-hide-issues-menu", vt);
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/issues/IssueKindView.ts
var k = {
	hideAllCurrentPageErrors: "Hide all current Page Errors",
	hideAllCurrentBreakingChanges: "Hide all current Breaking Changes",
	hideAllCurrentImprovements: "Hide all current Improvements"
}, yt = r("panels/issues/IssueKindView.ts", k), bt = n.bind(void 0, yt);
function A() {
	return a.instance().createSetting("group-issues-by-kind", !1);
}
function xt(e, t) {
	return e.getKind() === t.getKind() ? 0 : e.getKind() === y.PAGE_ERROR || e.getKind() === y.BREAKING_CHANGE && t.getKind() === y.IMPROVEMENT ? -1 : 1;
}
function St(e) {
	switch (e) {
		case y.BREAKING_CHANGE: return "breaking-changes";
		case y.IMPROVEMENT: return "improvements";
		case y.PAGE_ERROR: return "page-errors";
	}
}
var Ct = class extends h {
	#e;
	#t;
	constructor(e) {
		super(void 0, !0, xe(e)), this.#e = e, this.#t = document.createElement("span"), this.toggleOnClick = !0, this.listItemElement.classList.add("issue-kind"), this.listItemElement.classList.add(St(e)), this.childrenListElement.classList.add("issue-kind-body");
	}
	getKind() {
		return this.#e;
	}
	getHideAllCurrentKindString() {
		switch (this.#e) {
			case y.PAGE_ERROR: return bt(k.hideAllCurrentPageErrors);
			case y.IMPROVEMENT: return bt(k.hideAllCurrentImprovements);
			case y.BREAKING_CHANGE: return bt(k.hideAllCurrentBreakingChanges);
		}
	}
	#n() {
		let e = document.createElement("div");
		e.classList.add("header");
		let t = new fe();
		t.name = We(this.#e), t.classList.add("leading-issue-icon", "extra-large");
		let n = new Ze();
		n.name = "countWrapper", n.append(this.#t), n.classList.add("aggregated-issues-count"), this.#t.textContent = "0";
		let r = document.createElement("div");
		r.classList.add("title"), r.textContent = Ae(this.#e);
		let i = new vt();
		i.classList.add("hide-available-issues"), i.data = {
			menuItemLabel: this.getHideAllCurrentKindString(),
			menuItemAction: () => {
				let e = ze(), t = e.get();
				for (let e of S.instance().issues()) e.getKind() === this.#e && (t[e.code()] = Me.HIDDEN);
				e.set(t);
			}
		}, e.appendChild(t), e.appendChild(n), e.appendChild(r), e.appendChild(i), this.listItemElement.appendChild(e);
	}
	onattach() {
		this.#n(), this.expand();
	}
	update(e) {
		this.#t.textContent = `${e}`;
	}
}, wt = "/*\n * Copyright 2020 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.issues-pane {\n  overflow: hidden;\n}\n\n.issues-toolbar-container {\n  display: flex;\n  flex: none;\n}\n\n.issues-toolbar-container > devtools-toolbar {\n  background-color: var(--sys-color-cdt-base-container);\n  border-bottom: 1px solid var(--sys-color-divider);\n}\n\n.issues-toolbar-left {\n  flex: 1 1 auto;\n}\n\n.issues-toolbar-right {\n  padding-right: 6px;\n}\n", Tt = "/*\n * Copyright 2020 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n/* Remove container padding from TreeOutline.\n * Allows issues to touch the edges of the container. */\n:host,\n.issues {\n  padding: 0;\n  overflow: auto;\n}\n\n.issues {\n  --issue-indent: 8px;\n}\n\n/* The top most parents need to be larger, as they may include an unhide button. */\n.tree-outline.issues > li {\n  min-height: var(--sys-size-13);\n}\n\n/* Override whitespace behavior for tree items to allow wrapping */\n.issues li {\n  white-space: normal;\n  align-items: flex-start;\n}\n\n/* Hide toggle for tree items which cannot be collapsed */\n.issues .always-parent::before {\n  display: none;\n}\n\n.issues li.parent::before {\n  margin-top: 7px;\n}\n\n.issues .affected-resources li.parent::before {\n  margin-top: 0;\n}\n\n.issue-category,\n.issue-kind,\n.issue {\n  padding: 0 8px;\n  padding-left: var(--issue-indent);\n  overflow: hidden;\n  flex: none;\n  transition: background-color 200ms;\n  border: 1px solid var(--sys-color-divider);\n  border-width: 0 0 1px;\n}\n\n.issue-category.hidden-issues.parent.expanded,\n.issue-kind.parent.expanded {\n  border-width: 0 0 1px;\n  background-color: var(--sys-color-surface2);\n}\n\n.issue-category + .children .issue,\n.issue.expanded {\n  background: var(--sys-color-cdt-base-container);\n}\n\n.issue.expanded {\n  border-width: 0;\n}\n\n.issue.selected,\n.issue.expanded.selected {\n  background-color: var(--sys-color-surface2);\n\n  &:focus {\n    background-color: var(--sys-color-tonal-container);\n  }\n}\n\n.tree-outline li:not(.selected):hover .selection {\n  background-color: unset;\n}\n\n.tree-outline li.issue:not(.expanded, .selected):hover .selection {\n  background-color: var(--sys-color-state-hover-on-subtle);\n}\n\n.tree-outline li.issue.expanded:not(.selected):hover {\n  background-color: var(--sys-color-state-hover-on-subtle);\n}\n\n.unhide-all-issues-button {\n  margin: 0;\n}\n\np {\n  margin-block: 2px;\n}\n\n/* Override selected tree item styles for issues to avoid changing width. */\n.tree-outline-disclosure:not(.tree-outline-disclosure-hide-overflow) .tree-outline.hide-selection-when-blurred .issue-category.selected:focus-visible,\n.tree-outline-disclosure:not(.tree-outline-disclosure-hide-overflow) .tree-outline.hide-selection-when-blurred .issue-kind.selected:focus-visible,\n.tree-outline-disclosure:not(.tree-outline-disclosure-hide-overflow) .tree-outline.hide-selection-when-blurred .issue.selected:focus-visible {\n  width: auto;\n  padding-right: 8px;\n}\n\n.header {\n  display: flex;\n  flex-direction: row;\n  align-items: flex-start;\n  padding: 4px 0;\n  cursor: pointer;\n  width: 100%;\n\n  & > :not(.unhide-all-issues-button) {\n    margin-top: var(--sys-size-2);\n  }\n}\n\n.header devtools-hide-issues-menu {\n  visibility: hidden;\n}\n\n.header:hover devtools-hide-issues-menu,\n.issue.selected devtools-hide-issues-menu {\n  visibility: visible;\n}\n\n.title {\n  flex: 1;\n  font-size: 12px;\n  color: var(--sys-color-on-surface);\n  font-weight: normal;\n  user-select: text;\n  padding-top: 2px;\n}\n\n.issue.expanded .title {\n  font-weight: 450;\n}\n\n.issue-body.children {\n  border-bottom: 1px solid var(--sys-color-divider);\n  padding: 6px 0;\n  position: relative;\n  padding-left: calc(var(--issue-indent) + 43px);\n  padding-bottom: 26px;\n  padding-right: 8px;\n}\n\n.issue-category + .children,\n.issue-kind + .children {\n  --issue-indent: 24px;\n\n  padding-left: 0;\n}\n\n/* Show a colored border on the left side of opened issues. */\n.issue-body::before {\n  content: \"\";\n  display: block;\n  position: absolute;\n  left: calc(var(--issue-indent) + 23px);\n  top: 0;\n  bottom: 20px;\n  width: 2px;\n}\n\n.issue-kind-breaking-change.issue-body::before {\n  border-left: 2px solid var(--issue-color-yellow);\n}\n\n.issue-kind-page-error.issue-body::before {\n  border-left: 2px solid var(--issue-color-red);\n}\n\n.issue-kind-improvement.issue-body::before {\n  border-left: 2px solid var(--issue-color-blue);\n}\n\n.tree-outline .issue-body li:hover:not(:has(devtools-checkbox)) .selection {\n  background-color: unset;\n}\n\ndevtools-icon.leading-issue-icon {\n  margin: 1px 0 -1px 7px;\n}\n\n.message {\n  line-height: 18px;\n  font-size: 12px;\n  color: var(--sys-color-token-subtle);\n  margin-bottom: 4px;\n  user-select: text;\n}\n\n.message p {\n  margin-bottom: 16px;\n}\n\n.message li {\n  margin-top: 8px;\n}\n\n.message code {\n  color: var(--sys-color-on-surface);\n  padding: 0 2px;\n  font-size: 12px;\n  user-select: text;\n  cursor: text;\n  background: var(--sys-color-surface2);\n}\n\n.separator::before {\n  content: \"·\";\n  padding-left: 1ex;\n  padding-right: 1ex;\n}\n\n.link {\n  font-size: 12px;\n  color: var(--sys-color-primary);\n}\n\n.link-wrapper {\n  margin-top: 15px;\n  user-select: text;\n}\n\n.affected-resources-label,\n.resolutions-label {\n  margin-top: 5px;\n  font-size: 10px;\n  font-weight: 500;\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n  color: var(--sys-color-on-surface);\n  display: inline-block;\n}\n\n.link-list {\n  list-style-type: none;\n  list-style-position: inside;\n  padding-inline-start: 0;\n}\n\n.resolutions-list {\n  list-style-type: none;\n  list-style-position: inside;\n  padding-inline-start: 0;\n}\n\n/* We inherit all the styles from treeoutline, but these are simple text <li>, so we override some styles */\n.link-list li::before {\n  content: none;\n  mask-image: none;\n}\n\n.resolutions-list li::before {\n  content: \"→\";\n  mask-image: none;\n  padding-right: 5px;\n  position: relative;\n  top: -1px;\n}\n\n.resolutions-list li {\n  display: list-item;\n}\n\nul > li.plain-enum {\n  display: list-item;\n}\n\n/* This is a hack because the tree view's CSS overrides list styling in a non-compositional way. This\n   can be removed once we've moved to proper components. */\nul > li.plain-enum::before {\n  content: \"\";\n  padding: 0;\n  margin: 0;\n  max-width: 0;\n}\n\n.affected-resources-label + .affected-resources {\n  padding: 3px 0 0;\n  position: relative;\n  user-select: text;\n}\n\n.affected-resource-label {\n  font-size: 12px;\n  line-height: 18px;\n  color: var(--sys-color-on-surface);\n  position: relative;\n  cursor: pointer;\n}\n\n.affected-resource-cookie {\n  font-size: 12px;\n  line-height: 18px;\n  border: 0;\n  border-collapse: collapse;\n}\n\n.affected-resource-element {\n  font-size: 12px;\n  line-height: 18px;\n  color: var(--sys-color-primary);\n  border: 0;\n  border-collapse: collapse;\n}\n\n.affected-resource-row {\n  font-size: 12px;\n  line-height: 18px;\n  border: 0;\n  border-collapse: collapse;\n  vertical-align: top;\n}\n\n.affected-resource-mixed-content {\n  font-size: 12px;\n  line-height: 18px;\n  border: 0;\n  border-collapse: collapse;\n}\n\n.affected-resource-heavy-ad {\n  font-size: 12px;\n  line-height: 18px;\n  border: 0;\n  border-collapse: collapse;\n}\n\n.affected-resource-request {\n  font-size: 12px;\n  line-height: 18px;\n  border: 0;\n  border-collapse: collapse;\n}\n\n.affected-resource-source {\n  font-size: 12px;\n  line-height: 18px;\n  color: var(--sys-color-primary);\n  border: 0;\n  border-collapse: collapse;\n}\n\n.affected-resource-list {\n  border-spacing: 10px 0;\n  margin-left: -12px;\n}\n\n.affected-resource-header {\n  font-size: 12px;\n  color: var(--sys-color-on-surface);\n  padding-left: 2px;\n}\n\n.code-example {\n  font-family: var(--monospace-font-family);\n  font-size: var(--monospace-font-size);\n}\n\n.affected-resource-blocked-status {\n  color: var(--issue-color-red);\n}\n\n.affected-resource-report-only-status {\n  color: var(--issue-color-yellow);\n}\n\n.affected-resource-cookie-info {\n  color: var(--sys-color-token-subtle);\n  padding: 2px;\n  text-align: right;\n}\n\n.affected-resource-cookie-info-header {\n  text-align: right;\n}\n\n.affected-resource-mixed-content-info {\n  color: var(--sys-color-token-subtle);\n  padding: 2px;\n}\n\n.affected-resource-heavy-ad-info {\n  color: var(--sys-color-token-subtle);\n  padding: 2px;\n}\n\n.affected-resource-heavy-ad-info-frame {\n  display: flex;\n  align-items: center;\n  color: var(--sys-color-token-subtle);\n  padding: 2px;\n}\n\n.affected-resource-cell {\n  color: var(--sys-color-token-subtle);\n  padding: 2px;\n}\n\n.affected-resource-cell.link {\n  color: var(--sys-color-primary);\n}\n\n.affected-resource-cell span.icon {\n  margin-right: 0.5ex;\n  vertical-align: sub;\n}\n\n.affected-resources > .parent {\n  margin-top: 0;\n  padding: 2px 5px 0;\n}\n\n.affected-resources > .parent.expanded {\n  background: var(--sys-color-cdt-base-container);\n}\n\n.affected-resources > .children.expanded {\n  background: var(--sys-color-cdt-base-container);\n  padding: 6px 0 9px 5px;\n}\n\n.aggregated-issues-count {\n  padding: 3px 7px 0;\n}\n\n.affected-resource-directive-info-header {\n  text-align: left;\n}\n\n.affected-resource-directive {\n  font-size: 12px;\n  line-height: 18px;\n  border: 0;\n  border-collapse: collapse;\n}\n\n.affected-resource-directive-info {\n  color: var(--sys-color-token-subtle);\n  padding: 2px;\n  text-align: left;\n}\n\n.devtools-link {\n  padding-top: 4px;\n}\n\ndevtools-icon.link-icon {\n  vertical-align: sub;\n  margin-right: 0.5ch;\n}\n\ndevtools-icon.elements-panel,\ndevtools-icon.network-panel {\n  margin-right: 0.5ex;\n  vertical-align: baseline;\n  height: 14px;\n}\n\n@media (forced-colors: active) {\n  .title {\n    color: ButtonText;\n  }\n\n  .tree-outline:not(.hide-selection-when-blurred) .selected .header .title,\n  .tree-outline.hide-selection-when-blurred .selected:focus-visible .header .title {\n    color: HighlightText;\n  }\n}\n", j = {
	nRequests: "{n, plural, =1 {# request} other {# requests}}",
	requestC: "Request",
	parentFrame: "Parent Frame",
	blockedResource: "Blocked Resource"
}, Et = r("panels/issues/AffectedBlockedByResponseView.ts", j), M = n.bind(void 0, Et), Dt = class extends E {
	#e(e) {
		let t = document.createElement("tr");
		this.appendColumnTitle(t, M(j.requestC)), this.appendColumnTitle(t, M(j.parentFrame)), this.appendColumnTitle(t, M(j.blockedResource)), this.affectedResources.appendChild(t);
		let n = 0;
		for (let t of e) this.#t(t), n++;
		this.updateAffectedResourceCount(n);
	}
	getResourceNameWithCount(e) {
		return M(j.nRequests, { n: e });
	}
	#t(e) {
		let t = document.createElement("tr");
		t.classList.add("affected-resource-row");
		let n = this.createRequestCell(e.request, { additionalOnClickAction() {
			m.issuesPanelResourceOpened(b.CROSS_ORIGIN_EMBEDDER_POLICY, T.REQUEST);
		} });
		if (t.appendChild(n), e.parentFrame) {
			let n = this.createFrameCell(e.parentFrame.frameId, this.issue.getCategory());
			t.appendChild(n);
		} else t.appendChild(document.createElement("td"));
		if (e.blockedFrame) {
			let n = this.createFrameCell(e.blockedFrame.frameId, this.issue.getCategory());
			t.appendChild(n);
		} else t.appendChild(document.createElement("td"));
		this.affectedResources.appendChild(t);
	}
	update() {
		this.clear(), this.#e(this.issue.getBlockedByResponseDetails());
	}
}, N = {
	nCookies: "{n, plural, =1 {# cookie} other {# cookies}}",
	name: "Name",
	domain: "Domain",
	path: "Path",
	nRawCookieLines: "{n, plural, =1 {1 Raw `Set-Cookie` header} other {# Raw `Set-Cookie` headers}}",
	filterSetCookieTitle: "Show network requests that include this `Set-Cookie` header in the network panel"
}, Ot = r("panels/issues/AffectedCookiesView.ts", N), P = n.bind(void 0, Ot), kt = class extends E {
	getResourceNameWithCount(e) {
		return P(N.nCookies, { n: e });
	}
	#e(e) {
		let t = document.createElement("tr");
		this.appendColumnTitle(t, P(N.name)), this.appendColumnTitle(t, P(N.domain) + " & " + P(N.path), "affected-resource-cookie-info-header"), this.affectedResources.appendChild(t);
		let n = 0;
		for (let t of e) n++, this.#t(t.cookie, t.hasRequest);
		this.updateAffectedResourceCount(n);
	}
	#t(e, n) {
		let r = document.createElement("tr");
		r.classList.add("affected-resource-cookie");
		let i = document.createElement("td");
		if (n) {
			let n = document.createElement("button");
			n.classList.add("link", "devtools-link"), n.textContent = e.name, n.tabIndex = 0, n.setAttribute("jslog", `${_("issues.filter-network-requests-by-cookie").track({ click: !0 })}`), n.addEventListener("click", () => {
				m.issuesPanelResourceOpened(this.issue.getCategory(), T.COOKIE), t(Je.filters([
					{
						filterType: Ye.CookieDomain,
						filterValue: e.domain
					},
					{
						filterType: Ye.CookieName,
						filterValue: e.name
					},
					{
						filterType: Ye.CookiePath,
						filterValue: e.path
					}
				]));
			}), i.appendChild(n);
		} else i.textContent = e.name;
		r.appendChild(i), this.appendIssueDetailCell(r, `${e.domain}${e.path}`, "affected-resource-cookie-info"), this.affectedResources.appendChild(r);
	}
	update() {
		this.clear(), this.#e(this.issue.cookiesWithRequestIndicator());
	}
}, At = class extends E {
	getResourceNameWithCount(e) {
		return P(N.nRawCookieLines, { n: e });
	}
	update() {
		this.clear();
		let e = this.issue.getRawCookieLines(), n = 0;
		for (let r of e) {
			let e = document.createElement("tr");
			if (e.classList.add("affected-resource-directive"), r.hasRequest) {
				let n = document.createElement("td"), i = document.createElement("button");
				i.classList.add("link", "devtools-link"), i.textContent = r.rawCookieLine, i.title = P(N.filterSetCookieTitle), i.tabIndex = 0, i.setAttribute("jslog", `${_("issues.filter-network-requests-by-raw-cookie").track({ click: !0 })}`), i.addEventListener("click", () => {
					t(Je.filters([{
						filterType: Ye.ResponseHeaderValueSetCookie,
						filterValue: r.rawCookieLine
					}]));
				}), n.appendChild(i), e.appendChild(n);
			} else this.appendIssueDetailCell(e, r.rawCookieLine);
			this.affectedResources.appendChild(e), n++;
		}
		this.updateAffectedResourceCount(n);
	}
}, jt = { nElements: "{n, plural, =1 {# element} other {# elements}}" }, Mt = r("panels/issues/AffectedElementsView.ts", jt), Nt = n.bind(void 0, Mt), F = class extends E {
	async #e(e) {
		let t = 0;
		for (let n of e) await this.#t(n), t++;
		this.updateAffectedResourceCount(t);
	}
	getResourceNameWithCount(e) {
		return Nt(jt.nElements, { n: e });
	}
	async #t(e) {
		let t = await this.createElementCell(e, this.issue.getCategory()), n = document.createElement("tr");
		n.appendChild(t), this.affectedResources.appendChild(n);
	}
	update() {
		this.clear(), this.#e(this.issue.elements());
	}
}, Pt = {
	nDescendants: "{n, plural, =1 { descendant} other { descendants}}",
	disallowedNode: "Disallowed descendant"
}, Ft = r("panels/issues/AffectedDescendantsWithinSelectElementView.ts", Pt), It = n.bind(void 0, Ft), Lt = class extends F {
	#e = Promise.resolve();
	update() {
		this.#e = this.#e.then(this.#t.bind(this));
	}
	getResourceName(e) {
		return It(Pt.nDescendants, { n: e });
	}
	async #t() {
		this.clear(), await this.#r(this.issue.getElementAccessibilityIssues());
	}
	async #n(e) {
		let t = document.createElement("tr");
		t.classList.add("affected-resource-select-element-descendant");
		let n = e.details(), r = e.model()?.target() || null;
		t.appendChild(await this.createElementCell({
			nodeName: It(Pt.disallowedNode),
			backendNodeId: n.nodeId,
			target: r
		}, e.getCategory())), this.affectedResources.appendChild(t);
	}
	async #r(e) {
		let t = 0;
		for (let n of e) t++, await this.#n(n);
		this.updateAffectedResourceCount(t);
	}
}, I = {
	nDirectives: "{n, plural, =1 {# directive} other {# directives}}",
	reportonly: "report-only",
	blocked: "blocked",
	clickToRevealTheViolatingDomNode: "Click to reveal the violating DOM node in the Elements panel",
	directiveC: "Directive",
	element: "Element",
	sourceLocation: "Source location",
	status: "Status",
	resourceC: "Resource"
}, Rt = r("panels/issues/AffectedDirectivesView.ts", I), L = n.bind(void 0, Rt), zt = class extends E {
	#e(e, t) {
		let n = document.createElement("td");
		t ? (n.classList.add("affected-resource-report-only-status"), n.textContent = L(I.reportonly)) : (n.classList.add("affected-resource-blocked-status"), n.textContent = L(I.blocked)), e.appendChild(n);
	}
	getResourceNameWithCount(e) {
		return L(I.nDirectives, { n: e });
	}
	#t(e, t) {
		let n = document.createElement("td");
		n.textContent = t, e.appendChild(n);
	}
	#n(e, t) {
		let n = document.createElement("td");
		n.classList.add("affected-resource-directive-info"), n.textContent = t, e.appendChild(n);
	}
	#r(e, n, r) {
		let i = new pt();
		if (n) {
			let e = n;
			i.title = L(I.clickToRevealTheViolatingDomNode), i.data = {
				onElementRevealIconClick: () => {
					let n = r.getTargetIfNotDisposed();
					if (n) {
						m.issuesPanelResourceOpened(this.issue.getCategory(), T.ELEMENT);
						let r = new ae(n, e);
						t(r);
					}
				},
				onElementRevealIconMouseEnter: () => {
					let t = r.getTargetIfNotDisposed();
					if (t) {
						let n = new ae(t, e);
						n && n.highlight();
					}
				},
				onElementRevealIconMouseLeave: () => {
					me.hideDOMNodeHighlight();
				}
			};
		}
		let a = document.createElement("td");
		a.classList.add("affected-resource-csp-info-node"), a.appendChild(i), e.appendChild(a);
	}
	#i(e) {
		let t = document.createElement("tr");
		if (this.issue.code() === je) this.appendColumnTitle(t, L(I.directiveC)), this.appendColumnTitle(t, L(I.element)), this.appendColumnTitle(t, L(I.sourceLocation)), this.appendColumnTitle(t, L(I.status));
		else if (this.issue.code() === Ne) this.appendColumnTitle(t, L(I.resourceC), "affected-resource-directive-info-header"), this.appendColumnTitle(t, L(I.status)), this.appendColumnTitle(t, L(I.directiveC)), this.appendColumnTitle(t, L(I.sourceLocation));
		else if (this.issue.code() === Fe) this.appendColumnTitle(t, L(I.sourceLocation)), this.appendColumnTitle(t, L(I.directiveC)), this.appendColumnTitle(t, L(I.status));
		else if (this.issue.code() === Ue) this.appendColumnTitle(t, L(I.sourceLocation)), this.appendColumnTitle(t, L(I.status));
		else if (this.issue.code() === Ve) this.appendColumnTitle(t, L(I.sourceLocation)), this.appendColumnTitle(t, L(I.directiveC)), this.appendColumnTitle(t, L(I.status));
		else {
			this.updateAffectedResourceCount(0);
			return;
		}
		this.affectedResources.appendChild(t);
		let n = 0;
		for (let t of e) n++, this.#a(t);
		this.updateAffectedResourceCount(n);
	}
	#a(e) {
		let t = document.createElement("tr");
		t.classList.add("affected-resource-directive");
		let n = e.details(), r = Oe(n.sourceCodeLocation), i = e.model(), a = e.model()?.getTargetIfNotDisposed();
		if (this.issue.code() === je && i) this.#t(t, n.violatedDirective), this.#r(t, n.violatingNodeId, i), this.appendSourceLocation(t, r, a), this.#e(t, n.isReportOnly);
		else if (this.issue.code() === Ne) {
			let e = n.blockedURL ? n.blockedURL : "";
			this.#n(t, e), this.#e(t, n.isReportOnly), this.#t(t, n.violatedDirective), this.appendSourceLocation(t, r, a);
		} else if (this.issue.code() === Fe) this.appendSourceLocation(t, r, a), this.#t(t, n.violatedDirective), this.#e(t, n.isReportOnly);
		else if (this.issue.code() === Ue) this.appendSourceLocation(t, r, a), this.#e(t, n.isReportOnly);
		else if (this.issue.code() === Ve) this.appendSourceLocation(t, r, a), this.#t(t, n.violatedDirective), this.#e(t, n.isReportOnly);
		else return;
		this.affectedResources.appendChild(t);
	}
	update() {
		this.clear(), this.#i(this.issue.getCspIssues());
	}
}, R = {
	nDocuments: "{n, plural, =1 { document} other { documents}}",
	documentInTheDOMTree: "Document in the DOM tree",
	url: "URL",
	mode: "Mode"
}, Bt = r("panels/issues/AffectedDocumentsInQuirksModeView.ts", R), z = n.bind(void 0, Bt), Vt = class extends F {
	#e = Promise.resolve();
	update() {
		this.#e = this.#e.then(this.#t.bind(this));
	}
	getResourceName(e) {
		return z(R.nDocuments, { n: e });
	}
	async #t() {
		this.clear(), await this.#r(this.issue.getQuirksModeIssues());
	}
	async #n(e) {
		let t = document.createElement("tr");
		t.classList.add("affected-resource-quirks-mode");
		let n = e.details(), r = s.instance().getFrame(n.frameId)?.resourceTreeModel().target() || null;
		t.appendChild(await this.createElementCell({
			nodeName: "document",
			backendNodeId: n.documentNodeId,
			target: r
		}, e.getCategory())), this.appendIssueDetailCell(t, n.isLimitedQuirksMode ? "Limited Quirks Mode" : "Quirks Mode"), this.appendIssueDetailCell(t, n.url), this.affectedResources.appendChild(t);
	}
	async #r(e) {
		let t = document.createElement("tr");
		this.appendColumnTitle(t, z(R.documentInTheDOMTree)), this.appendColumnTitle(t, z(R.mode)), this.appendColumnTitle(t, z(R.url)), this.affectedResources.appendChild(t);
		let n = 0;
		for (let t of e) n++, await this.#n(t);
		this.updateAffectedResourceCount(n);
	}
}, B = {
	nResources: "{n, plural, =1 {# resource} other {# resources}}",
	limitExceeded: "Limit exceeded",
	resolutionStatus: "Resolution Status",
	frameUrl: "Frame URL",
	removed: "Removed",
	warned: "Warned",
	cpuPeakLimit: "CPU peak limit",
	cpuTotalLimit: "CPU total limit",
	networkLimit: "Network limit"
}, Ht = r("panels/issues/AffectedHeavyAdView.ts", B), V = n.bind(void 0, Ht), Ut = class extends E {
	#e(e) {
		let t = document.createElement("tr");
		this.appendColumnTitle(t, V(B.limitExceeded)), this.appendColumnTitle(t, V(B.resolutionStatus)), this.appendColumnTitle(t, V(B.frameUrl)), this.affectedResources.appendChild(t);
		let n = 0;
		for (let t of e) this.#r(t.details()), n++;
		this.updateAffectedResourceCount(n);
	}
	getResourceNameWithCount(e) {
		return V(B.nResources, { n: e });
	}
	#t(e) {
		switch (e) {
			case f.HeavyAdResolutionStatus.HeavyAdBlocked: return V(B.removed);
			case f.HeavyAdResolutionStatus.HeavyAdWarning: return V(B.warned);
		}
		return "";
	}
	#n(e) {
		switch (e) {
			case f.HeavyAdReason.CpuPeakLimit: return V(B.cpuPeakLimit);
			case f.HeavyAdReason.CpuTotalLimit: return V(B.cpuTotalLimit);
			case f.HeavyAdReason.NetworkTotalLimit: return V(B.networkLimit);
		}
		return "";
	}
	#r(e) {
		let t = document.createElement("tr");
		t.classList.add("affected-resource-heavy-ad");
		let n = document.createElement("td");
		n.classList.add("affected-resource-heavy-ad-info"), n.textContent = this.#n(e.reason), t.appendChild(n);
		let r = document.createElement("td");
		r.classList.add("affected-resource-heavy-ad-info"), r.textContent = this.#t(e.resolution), t.appendChild(r);
		let i = e.frame.frameId, a = this.createFrameCell(i, this.issue.getCategory());
		t.appendChild(a), this.affectedResources.appendChild(t);
	}
	update() {
		this.clear(), this.#e(this.issue.getHeavyAdIssues());
	}
}, Wt = { nAllowedSites: "{n, plural, =1 {1 website allowed to access cookies} other {# websites allowed to access cookies}}" }, Gt = r("panels/issues/AffectedMetadataAllowedSitesView.ts", Wt), Kt = n.bind(void 0, Gt), qt = class extends E {
	getResourceNameWithCount(e) {
		return Kt(Wt.nAllowedSites, { n: e });
	}
	update() {
		this.clear();
		let e = this.issue.getCookieDeprecationMetadataIssues(), t = 0;
		for (let n of e) {
			let e = document.createElement("tr");
			e.classList.add("affected-resource-directive");
			let r = document.createElement("div"), i = document.createElement("span");
			if (i.textContent = n.details().allowedSites.join(", "), r.appendChild(i), !n.details().isOptOutTopLevel && n.details().optOutPercentage > 0) {
				let e = document.createElement("span");
				e.textContent = " (opt-out: " + n.details().optOutPercentage + "% - ", r.appendChild(e);
				let t = he.create("https://developers.google.com/privacy-sandbox/blog/grace-period-opt-out", "learn more");
				r.appendChild(t);
				let i = document.createElement("span");
				i.textContent = ")", r.appendChild(i);
			}
			this.appendIssueDetailCell(e, r), this.affectedResources.appendChild(e), t++;
		}
		this.updateAffectedResourceCount(t);
	}
}, H = {
	blockedCrossPartitionFetching: "Access to the Blob URL {url} was blocked because it was performed from a cross-partition context.",
	enforceNoopenerForNavigation: "Blob URL {url} top-level navigation had 'noopener' set because the Blob URL origin was cross-site with the top-level site of the context that initiated the navigation.",
	blobURLCount: "Blob URL issues count: {count}",
	noBlobURLAvailable: "No Blob URL available for this issue."
}, Jt = r("panels/issues/AffectedPartitioningBlobURLView.ts", H), U = n.bind(void 0, Jt), Yt = class extends E {
	getResourceNameWithCount(e) {
		return U(H.blobURLCount, { count: e });
	}
	update() {
		this.clear();
		let e = 0, t = this.issue.getPartitioningBlobURLIssues();
		for (let n of t) {
			let t = n.details().url, r = n.details().partitioningBlobURLInfo;
			if (t) {
				let n;
				switch (r) {
					case f.PartitioningBlobURLInfo.BlockedCrossPartitionFetching:
						n = U(H.blockedCrossPartitionFetching, { url: t });
						break;
					case f.PartitioningBlobURLInfo.EnforceNoopenerForNavigation: n = U(H.enforceNoopenerForNavigation, { url: t });
				}
				let i = document.createElement("div");
				i.textContent = n, this.affectedResources.appendChild(i), e++;
			} else {
				let e = document.createElement("div");
				e.textContent = U(H.noBlobURLAvailable), this.affectedResources.appendChild(e);
			}
		}
		this.updateAffectedResourceCount(e);
	}
}, Xt = { nElements: "{n, plural, =1 {# element} other {# elements}}" }, Zt = r("panels/issues/AffectedPermissionElementsView.ts", Xt), Qt = n.bind(void 0, Zt), $t = class extends F {
	update() {
		this.clear(), this.#e(this.issue.getPermissionElementIssues());
	}
	getResourceNameWithCount(e) {
		return Qt(Xt.nElements, { n: e });
	}
	async #e(e) {
		let t = 0, n = [];
		for (let r of e) for (let e of r.elements()) t++, n.push(d`<tr>
          ${await this.createElementCell(e, this.issue.getCategory())}
        </tr>`);
		l(d`${n}`, this.affectedResources), this.updateAffectedResourceCount(t);
	}
}, W = {
	nViolations: "{n, plural, =1 {# violation} other {# violations}}",
	warning: "warning",
	blocked: "blocked",
	instantiation: "Instantiation",
	aSharedarraybufferWas: "A `SharedArrayBuffer` was instantiated in a context that is not cross-origin isolated",
	transfer: "Transfer",
	sharedarraybufferWasTransferedTo: "`SharedArrayBuffer` was transfered to a context that is not cross-origin isolated",
	sourceLocation: "Source Location",
	trigger: "Trigger",
	status: "Status"
}, en = r("panels/issues/AffectedSharedArrayBufferIssueDetailsView.ts", W), G = n.bind(void 0, en), tn = class extends E {
	getResourceNameWithCount(e) {
		return G(W.nViolations, { n: e });
	}
	#e(e, t) {
		let n = document.createElement("td");
		t ? (n.classList.add("affected-resource-report-only-status"), n.textContent = G(W.warning)) : (n.classList.add("affected-resource-blocked-status"), n.textContent = G(W.blocked)), e.appendChild(n);
	}
	#t(e, t) {
		let n = document.createElement("td");
		switch (t) {
			case f.SharedArrayBufferIssueType.CreationIssue:
				n.textContent = G(W.instantiation), n.title = G(W.aSharedarraybufferWas);
				break;
			case f.SharedArrayBufferIssueType.TransferIssue: n.textContent = G(W.transfer), n.title = G(W.sharedarraybufferWasTransferedTo);
		}
		e.appendChild(n);
	}
	#n(e) {
		let t = document.createElement("tr");
		this.appendColumnTitle(t, G(W.sourceLocation)), this.appendColumnTitle(t, G(W.trigger)), this.appendColumnTitle(t, G(W.status)), this.affectedResources.appendChild(t);
		let n = 0;
		for (let t of e) n++, this.#r(t);
		this.updateAffectedResourceCount(n);
	}
	#r(e) {
		let t = document.createElement("tr");
		t.classList.add("affected-resource-directive");
		let n = e.details(), r = Oe(n.sourceCodeLocation);
		this.appendSourceLocation(t, r, e.model()?.getTargetIfNotDisposed()), this.#t(t, n.type), this.#e(t, n.isWarning), this.affectedResources.appendChild(t);
	}
	update() {
		this.clear(), this.#n(this.issue.getSharedArrayBufferIssues());
	}
}, nn = { nSources: "{n, plural, =1 {# source} other {# sources}}" }, rn = r("panels/issues/AffectedSourcesView.ts", nn), an = n.bind(void 0, rn), on = class extends E {
	#e(e) {
		let t = 0;
		for (let n of e) this.#t(n), t++;
		this.updateAffectedResourceCount(t);
	}
	getResourceNameWithCount(e) {
		return an(nn.nSources, { n: e });
	}
	#t({ url: e, lineNumber: t, columnNumber: n }) {
		let r = document.createElement("td"), i = {
			columnNumber: n,
			lineNumber: t,
			tabStop: !0,
			showColumnNumber: !1,
			inlineFrameIndex: 0
		}, a = we.linkifyURL(e, i);
		a.setAttribute("jslog", `${_("source-location").track({ click: !0 })}`), r.appendChild(a);
		let o = document.createElement("tr");
		o.classList.add("affected-resource-source"), o.appendChild(r), this.affectedResources.appendChild(o);
	}
	update() {
		this.clear(), this.#e(this.issue.sources());
	}
}, sn = { nTrackingSites: "{n, plural, =1 {1 potentially tracking website} other {# potentially tracking websites}}" }, cn = r("panels/issues/AffectedTrackingSitesView.ts", sn), ln = n.bind(void 0, cn), un = class extends E {
	getResourceNameWithCount(e) {
		return ln(sn.nTrackingSites, { n: e });
	}
	update() {
		this.clear();
		let e = this.issue.getBounceTrackingSites(), t = 0;
		for (let n of e) {
			let e = document.createElement("tr");
			e.classList.add("affected-resource-directive"), this.appendIssueDetailCell(e, n), this.affectedResources.appendChild(e), t++;
		}
		this.updateAffectedResourceCount(t);
	}
}, K = {
	nViolations: "{n, plural, =1 {# violation} other {# violations}}",
	element: "Element",
	invalidHeaderValue: "Invalid Header Value",
	request: "Request",
	untrustworthyOrigin: "Untrustworthy origin"
}, dn = r("panels/issues/AttributionReportingIssueDetailsView.ts", K), q = n.bind(void 0, dn), fn = class extends E {
	getResourceNameWithCount(e) {
		return q(K.nViolations, { n: e });
	}
	update() {
		this.clear();
		let e = this.issue.getAttributionReportingIssues(), t = e.values().next();
		t.done ? this.updateAffectedResourceCount(0) : this.#e(t.value.code(), e);
	}
	#e(e, t) {
		let n = document.createElement("tr");
		switch (e) {
			case v.INVALID_REGISTER_SOURCE_HEADER:
			case v.INVALID_REGISTER_TRIGGER_HEADER:
			case v.INVALID_REGISTER_OS_SOURCE_HEADER:
			case v.INVALID_REGISTER_OS_TRIGGER_HEADER:
			case v.OS_SOURCE_IGNORED:
			case v.OS_TRIGGER_IGNORED:
			case v.SOURCE_IGNORED:
			case v.TRIGGER_IGNORED:
			case v.INVALID_INFO_HEADER:
			case v.NAVIGATION_REGISTRATION_UNIQUE_SCOPE_ALREADY_SET:
				this.appendColumnTitle(n, q(K.request)), this.appendColumnTitle(n, q(K.invalidHeaderValue));
				break;
			case v.INSECURE_CONTEXT:
			case v.UNTRUSTWORTHY_REPORTING_ORIGIN:
				this.appendColumnTitle(n, q(K.element)), this.appendColumnTitle(n, q(K.request)), this.appendColumnTitle(n, q(K.untrustworthyOrigin));
				break;
			case v.PERMISSION_POLICY_DISABLED:
				this.appendColumnTitle(n, q(K.element)), this.appendColumnTitle(n, q(K.request));
				break;
			case v.SOURCE_AND_TRIGGER_HEADERS:
			case v.WEB_AND_OS_HEADERS:
			case v.NO_WEB_OR_OS_SUPPORT:
			case v.NO_REGISTER_SOURCE_HEADER:
			case v.NO_REGISTER_TRIGGER_HEADER:
			case v.NO_REGISTER_OS_SOURCE_HEADER:
			case v.NO_REGISTER_OS_TRIGGER_HEADER:
				this.appendColumnTitle(n, q(K.request));
				break;
			case v.NAVIGATION_REGISTRATION_WITHOUT_TRANSIENT_USER_ACTIVATION: this.appendColumnTitle(n, q(K.element));
		}
		this.affectedResources.appendChild(n);
		let r = 0;
		for (let n of t) r++, this.#t(e, n);
		this.updateAffectedResourceCount(r);
	}
	async #t(e, t) {
		let n = document.createElement("tr");
		n.classList.add("affected-resource-directive");
		let r = t.details();
		switch (e) {
			case v.INVALID_REGISTER_SOURCE_HEADER:
			case v.INVALID_REGISTER_TRIGGER_HEADER:
			case v.INVALID_REGISTER_OS_SOURCE_HEADER:
			case v.INVALID_REGISTER_OS_TRIGGER_HEADER:
			case v.OS_SOURCE_IGNORED:
			case v.OS_TRIGGER_IGNORED:
			case v.SOURCE_IGNORED:
			case v.TRIGGER_IGNORED:
			case v.INVALID_INFO_HEADER:
			case v.NAVIGATION_REGISTRATION_UNIQUE_SCOPE_ALREADY_SET:
				this.#r(n, r.request), this.appendIssueDetailCell(n, r.invalidParameter || "");
				break;
			case v.INSECURE_CONTEXT:
			case v.UNTRUSTWORTHY_REPORTING_ORIGIN:
				await this.#n(n, t), this.#r(n, r.request), this.appendIssueDetailCell(n, r.invalidParameter || "");
				break;
			case v.PERMISSION_POLICY_DISABLED:
				await this.#n(n, t), this.#r(n, r.request);
				break;
			case v.SOURCE_AND_TRIGGER_HEADERS:
			case v.WEB_AND_OS_HEADERS:
			case v.NO_WEB_OR_OS_SUPPORT:
			case v.NO_REGISTER_SOURCE_HEADER:
			case v.NO_REGISTER_TRIGGER_HEADER:
			case v.NO_REGISTER_OS_SOURCE_HEADER:
			case v.NO_REGISTER_OS_TRIGGER_HEADER:
				this.#r(n, r.request);
				break;
			case v.NAVIGATION_REGISTRATION_WITHOUT_TRANSIENT_USER_ACTIVATION: await this.#n(n, t);
		}
		this.affectedResources.appendChild(n);
	}
	async #n(e, t) {
		let n = t.details();
		if (n.violatingNodeId !== void 0) {
			let r = t.model()?.target() || null;
			e.appendChild(await this.createElementCell({
				backendNodeId: n.violatingNodeId,
				target: r,
				nodeName: "Attribution source element"
			}, t.getCategory()));
		} else this.appendIssueDetailCell(e, "");
	}
	#r(e, t) {
		if (!t) {
			this.appendIssueDetailCell(e, "");
			return;
		}
		e.appendChild(this.createRequestCell(t, { additionalOnClickAction() {
			m.issuesPanelResourceOpened(b.ATTRIBUTION_REPORTING, T.REQUEST);
		} }));
	}
}, J = {
	nRequests: "{n, plural, =1 {# request} other {# requests}}",
	warning: "warning",
	blocked: "blocked",
	status: "Status",
	request: "Request",
	resourceAddressSpace: "Resource Address",
	initiatorAddressSpace: "Initiator Address",
	secure: "secure",
	insecure: "insecure",
	initiatorContext: "Initiator Context",
	preflightRequestIfProblematic: "Preflight Request (if problematic)",
	preflightRequest: "Preflight Request",
	header: "Header",
	problem: "Problem",
	invalidValue: "Invalid Value (if available)",
	problemMissingHeader: "Missing Header",
	problemMultipleValues: "Multiple Values",
	problemInvalidValue: "Invalid Value",
	preflightDisallowedRedirect: "Response to preflight was a redirect",
	preflightInvalidStatus: "HTTP status of preflight request didn't indicate success",
	allowedOrigin: "Allowed Origin (from header)",
	allowCredentialsValueFromHeader: "`Access-Control-Allow-Credentials` Header Value",
	disallowedRequestMethod: "Disallowed Request Method",
	disallowedRequestHeader: "Disallowed Request Header",
	sourceLocation: "Source Location",
	unsupportedScheme: "Unsupported Scheme",
	failedRequest: "Failed Request"
}, pn = r("panels/issues/CorsIssueDetailsView.ts", J), Y = n.bind(void 0, pn), mn = class e extends E {
	constructor(e, t, n) {
		super(e, t, n), this.affectedResourcesCountElement.classList.add("cors-issue-affected-resource-label");
	}
	#e(e, t) {
		let n = document.createElement("td");
		t ? (n.classList.add("affected-resource-report-only-status"), n.textContent = Y(J.warning)) : (n.classList.add("affected-resource-blocked-status"), n.textContent = Y(J.blocked)), e.appendChild(n);
	}
	getResourceNameWithCount(e) {
		return Y(J.nRequests, { n: e });
	}
	#t(e, t) {
		let n = document.createElement("tr");
		switch (this.appendColumnTitle(n, Y(J.request)), this.appendColumnTitle(n, Y(J.status)), e) {
			case x.INVALID_HEADER_VALUES:
				this.appendColumnTitle(n, Y(J.preflightRequestIfProblematic)), this.appendColumnTitle(n, Y(J.header)), this.appendColumnTitle(n, Y(J.problem)), this.appendColumnTitle(n, Y(J.invalidValue));
				break;
			case x.WILDCARD_ORIGN_NOT_ALLOWED:
				this.appendColumnTitle(n, Y(J.preflightRequestIfProblematic));
				break;
			case x.PREFLIGHT_RESPONSE_INVALID:
				this.appendColumnTitle(n, Y(J.preflightRequest)), this.appendColumnTitle(n, Y(J.problem));
				break;
			case x.ORIGIN_MISMATCH:
				this.appendColumnTitle(n, Y(J.preflightRequestIfProblematic)), this.appendColumnTitle(n, Y(J.initiatorContext)), this.appendColumnTitle(n, Y(J.allowedOrigin));
				break;
			case x.ALLOW_CREDENTIALS_REQUIRED:
				this.appendColumnTitle(n, Y(J.preflightRequestIfProblematic)), this.appendColumnTitle(n, Y(J.allowCredentialsValueFromHeader));
				break;
			case x.INSECURE_LOCAL_NETWORK:
				this.appendColumnTitle(n, Y(J.resourceAddressSpace)), this.appendColumnTitle(n, Y(J.initiatorAddressSpace)), this.appendColumnTitle(n, Y(J.initiatorContext));
				break;
			case x.METHOD_DISALLOWED_BY_PREFLIGHT_RESPONSE:
				this.appendColumnTitle(n, Y(J.preflightRequest)), this.appendColumnTitle(n, Y(J.disallowedRequestMethod));
				break;
			case x.HEADER_DISALLOWED_BY_PREFLIGHT_RESPONSE:
				this.appendColumnTitle(n, Y(J.preflightRequest)), this.appendColumnTitle(n, Y(J.disallowedRequestHeader));
				break;
			case x.REDIRECT_CONTAINS_CREDENTIALS: break;
			case x.DISALLOWED_BY_MODE:
				this.appendColumnTitle(n, Y(J.initiatorContext)), this.appendColumnTitle(n, Y(J.sourceLocation));
				break;
			case x.CORS_DISABLED_SCHEME:
				this.appendColumnTitle(n, Y(J.initiatorContext)), this.appendColumnTitle(n, Y(J.sourceLocation)), this.appendColumnTitle(n, Y(J.unsupportedScheme));
				break;
			case x.NO_CORS_REDIRECT_MODE_NOT_FOLLOW:
				this.appendColumnTitle(n, Y(J.sourceLocation));
				break;
			default: Se(e);
		}
		this.affectedResources.appendChild(n);
		let r = 0;
		for (let n of t) r++, this.#r(e, n);
		this.updateAffectedResourceCount(r);
	}
	#n(e, t) {
		if (t === void 0) {
			this.appendIssueDetailCell(e, "");
			return;
		}
		this.appendIssueDetailCell(e, Y(t ? J.secure : J.insecure));
	}
	static getHeaderFromError(e) {
		switch (e) {
			case p.CorsError.InvalidAllowHeadersPreflightResponse: return "Access-Control-Allow-Headers";
			case p.CorsError.InvalidAllowMethodsPreflightResponse:
			case p.CorsError.MethodDisallowedByPreflightResponse: return "Access-Control-Allow-Methods";
			case p.CorsError.PreflightMissingAllowOriginHeader:
			case p.CorsError.PreflightMultipleAllowOriginValues:
			case p.CorsError.PreflightInvalidAllowOriginValue:
			case p.CorsError.MissingAllowOriginHeader:
			case p.CorsError.MultipleAllowOriginValues:
			case p.CorsError.InvalidAllowOriginValue:
			case p.CorsError.WildcardOriginNotAllowed:
			case p.CorsError.PreflightWildcardOriginNotAllowed:
			case p.CorsError.AllowOriginMismatch:
			case p.CorsError.PreflightAllowOriginMismatch: return "Access-Control-Allow-Origin";
			case p.CorsError.InvalidAllowCredentials:
			case p.CorsError.PreflightInvalidAllowCredentials: return "Access-Control-Allow-Credentials";
			case p.CorsError.RedirectContainsCredentials:
			case p.CorsError.PreflightDisallowedRedirect: return "Location";
			case p.CorsError.PreflightInvalidStatus: return "Status-Code";
		}
		return "";
	}
	static getProblemFromError(e) {
		switch (e.corsError) {
			case p.CorsError.InvalidAllowHeadersPreflightResponse:
			case p.CorsError.InvalidAllowMethodsPreflightResponse:
			case p.CorsError.PreflightInvalidAllowOriginValue:
			case p.CorsError.InvalidAllowOriginValue: return Y(J.problemInvalidValue);
			case p.CorsError.PreflightMultipleAllowOriginValues:
			case p.CorsError.MultipleAllowOriginValues: return Y(J.problemMultipleValues);
			case p.CorsError.MissingAllowOriginHeader:
			case p.CorsError.PreflightMissingAllowOriginHeader: return Y(J.problemMissingHeader);
			case p.CorsError.PreflightInvalidStatus: return Y(J.preflightInvalidStatus);
			case p.CorsError.PreflightDisallowedRedirect: return Y(J.preflightDisallowedRedirect);
			case p.CorsError.InvalidResponse: return Y(J.failedRequest);
		}
		throw Error("Invalid Argument");
	}
	#r(t, n) {
		let r = document.createElement("tr");
		r.classList.add("affected-resource-directive");
		let i = n.details(), a = i.corsErrorStatus, o = i.corsErrorStatus.corsError, s = {
			section: w.RESPONSE,
			name: e.getHeaderFromError(o)
		}, c = { additionalOnClickAction() {
			m.issuesPanelResourceOpened(b.CORS, T.REQUEST);
		} };
		switch (t) {
			case x.INVALID_HEADER_VALUES:
				r.appendChild(this.createRequestCell(i.request, c)), this.#e(r, i.isWarning), o.includes("Preflight") ? r.appendChild(this.createRequestCell(i.request, {
					...c,
					linkToPreflight: !0,
					highlightHeader: s
				})) : this.appendIssueDetailCell(r, ""), this.appendIssueDetailCell(r, e.getHeaderFromError(o), "code-example"), this.appendIssueDetailCell(r, e.getProblemFromError(i.corsErrorStatus)), this.appendIssueDetailCell(r, i.corsErrorStatus.failedParameter, "code-example");
				break;
			case x.WILDCARD_ORIGN_NOT_ALLOWED:
				r.appendChild(this.createRequestCell(i.request, c)), this.#e(r, i.isWarning), o.includes("Preflight") ? r.appendChild(this.createRequestCell(i.request, {
					...c,
					linkToPreflight: !0,
					highlightHeader: s
				})) : this.appendIssueDetailCell(r, "");
				break;
			case x.PREFLIGHT_RESPONSE_INVALID: {
				r.appendChild(this.createRequestCell(i.request, c)), this.#e(r, i.isWarning);
				let t = o === p.CorsError.PreflightInvalidStatus ? {
					section: w.GENERAL,
					name: "Status-Code"
				} : s;
				r.appendChild(this.createRequestCell(i.request, {
					...c,
					linkToPreflight: !0,
					highlightHeader: t
				})), this.appendIssueDetailCell(r, e.getProblemFromError(i.corsErrorStatus));
				break;
			}
			case x.ORIGIN_MISMATCH:
				r.appendChild(this.createRequestCell(i.request, c)), this.#e(r, i.isWarning), o.includes("Preflight") ? r.appendChild(this.createRequestCell(i.request, {
					...c,
					linkToPreflight: !0,
					highlightHeader: s
				})) : this.appendIssueDetailCell(r, ""), this.appendIssueDetailCell(r, i.initiatorOrigin ?? "", "code-example"), this.appendIssueDetailCell(r, i.corsErrorStatus.failedParameter, "code-example");
				break;
			case x.ALLOW_CREDENTIALS_REQUIRED:
				r.appendChild(this.createRequestCell(i.request, c)), this.#e(r, i.isWarning), o.includes("Preflight") ? r.appendChild(this.createRequestCell(i.request, {
					...c,
					linkToPreflight: !0,
					highlightHeader: s
				})) : this.appendIssueDetailCell(r, ""), this.appendIssueDetailCell(r, i.corsErrorStatus.failedParameter, "code-example");
				break;
			case x.INSECURE_LOCAL_NETWORK:
				r.appendChild(this.createRequestCell(i.request, c)), this.#e(r, i.isWarning), this.appendIssueDetailCell(r, i.resourceIPAddressSpace ?? ""), this.appendIssueDetailCell(r, i.clientSecurityState?.initiatorIPAddressSpace ?? ""), this.#n(r, i.clientSecurityState?.initiatorIsSecureContext);
				break;
			case x.METHOD_DISALLOWED_BY_PREFLIGHT_RESPONSE:
				r.appendChild(this.createRequestCell(i.request, c)), this.#e(r, i.isWarning), r.appendChild(this.createRequestCell(i.request, {
					...c,
					linkToPreflight: !0,
					highlightHeader: s
				})), this.appendIssueDetailCell(r, i.corsErrorStatus.failedParameter, "code-example");
				break;
			case x.HEADER_DISALLOWED_BY_PREFLIGHT_RESPONSE:
				r.appendChild(this.createRequestCell(i.request, {
					...c,
					highlightHeader: {
						section: w.REQUEST,
						name: a.failedParameter
					}
				})), this.#e(r, i.isWarning), r.appendChild(this.createRequestCell(i.request, {
					...c,
					linkToPreflight: !0,
					highlightHeader: {
						section: w.RESPONSE,
						name: "Access-Control-Allow-Headers"
					}
				})), this.appendIssueDetailCell(r, i.corsErrorStatus.failedParameter, "code-example");
				break;
			case x.REDIRECT_CONTAINS_CREDENTIALS:
				r.appendChild(this.createRequestCell(i.request, {
					...c,
					highlightHeader: {
						section: w.RESPONSE,
						name: e.getHeaderFromError(o)
					}
				})), this.#e(r, i.isWarning);
				break;
			case x.DISALLOWED_BY_MODE:
				r.appendChild(this.createRequestCell(i.request, c)), this.#e(r, i.isWarning), this.appendIssueDetailCell(r, i.initiatorOrigin ?? "", "code-example"), this.appendSourceLocation(r, i.location, n.model()?.getTargetIfNotDisposed());
				break;
			case x.CORS_DISABLED_SCHEME:
				r.appendChild(this.createRequestCell(i.request, {
					...c,
					highlightHeader: {
						section: w.RESPONSE,
						name: e.getHeaderFromError(o)
					}
				})), this.#e(r, i.isWarning), this.appendIssueDetailCell(r, i.initiatorOrigin ?? "", "code-example"), this.appendSourceLocation(r, i.location, n.model()?.getTargetIfNotDisposed()), this.appendIssueDetailCell(r, i.corsErrorStatus.failedParameter ?? "", "code-example");
				break;
			case x.NO_CORS_REDIRECT_MODE_NOT_FOLLOW:
				r.appendChild(this.createRequestCell(i.request, c)), this.#e(r, i.isWarning), this.appendSourceLocation(r, i.location, n.model()?.getTargetIfNotDisposed());
				break;
			default: r.appendChild(this.createRequestCell(i.request, c)), this.#e(r, i.isWarning), Se(t);
		}
		this.affectedResources.appendChild(r);
	}
	update() {
		this.clear();
		let e = this.issue.getCorsIssues(), t = e.values().next();
		t.done ? this.updateAffectedResourceCount(0) : this.#t(t.value.code(), e);
	}
}, hn = {
	nResources: "{n, plural, =1 {# resource} other {# resources}}",
	frameId: "Frame",
	violatingNode: "Violating node"
}, gn = r("panels/issues/GenericIssueDetailsView.ts", hn), _n = n.bind(void 0, gn), vn = class extends E {
	getResourceNameWithCount(e) {
		return _n(hn.nResources, { n: e });
	}
	#e(e) {
		let t = document.createElement("tr");
		e.values().next().value?.details()?.frameId && this.appendColumnTitle(t, _n(hn.frameId)), this.affectedResources.appendChild(t);
		let n = 0;
		for (let t of e) (t.details().frameId || t.details().violatingNodeId) && (n++, this.#t(t));
		this.updateAffectedResourceCount(n);
	}
	async #t(e) {
		let t = document.createElement("tr");
		t.classList.add("affected-resource-directive");
		let n = e.details();
		if (n.frameId && t.appendChild(this.createFrameCell(n.frameId, e.getCategory())), n.violatingNodeId) {
			let r = e.model()?.target() || null;
			t.appendChild(await this.createElementCell({
				backendNodeId: n.violatingNodeId,
				nodeName: this.violatingNodeIdName(n.errorType),
				target: r
			}, e.getCategory()));
		}
		this.affectedResources.appendChild(t);
	}
	violatingNodeIdName(e) {
		switch (e) {
			case f.GenericIssueErrorType.FormLabelForNameError: return i("Label");
			default: return _n(hn.violatingNode);
		}
	}
	update() {
		this.clear();
		let e = this.issue.getGenericIssues();
		e.size > 0 ? this.#e(e) : this.updateAffectedResourceCount(0);
	}
}, yn = /* @__PURE__ */ e({ IssueView: () => wn }), X = {
	name: "Name",
	blocked: "blocked",
	nRequests: "{n, plural, =1 {# request} other {# requests}}",
	nResources: "{n, plural, =1 {# resource} other {# resources}}",
	restrictionStatus: "Restriction Status",
	warned: "Warned",
	affectedResources: "Affected Resources",
	learnMoreS: "Learn more: {PH1}",
	automaticallyUpgraded: "automatically upgraded",
	hideIssuesLikeThis: "Hide issues like this",
	unhideIssuesLikeThis: "Unhide issues like this"
}, bn = r("panels/issues/IssueView.ts", X), Z = n.bind(void 0, bn), xn = class extends E {
	#e(e) {
		let t = 0;
		for (let n of e) {
			let e = document.createElement("tr");
			e.classList.add("affected-resource-request");
			let r = this.issue.getCategory(), i = Sn.get(r) || C.HEADERS_COMPONENT;
			e.appendChild(this.createRequestCell(n, {
				networkTab: i,
				additionalOnClickAction() {
					m.issuesPanelResourceOpened(r, T.REQUEST);
				}
			})), this.affectedResources.appendChild(e), t++;
		}
		this.updateAffectedResourceCount(t);
	}
	getResourceNameWithCount(e) {
		return Z(X.nRequests, { n: e });
	}
	update() {
		this.clear();
		for (let e of this.issue.getBlockedByResponseDetails()) {
			this.updateAffectedResourceCount(0);
			return;
		}
		if (this.issue.getCategory() === b.MIXED_CONTENT) {
			this.updateAffectedResourceCount(0);
			return;
		}
		this.#e(this.issue.requests());
	}
}, Sn = /* @__PURE__ */ new Map([
	[b.COOKIE, C.COOKIES],
	[b.CROSS_ORIGIN_EMBEDDER_POLICY, C.HEADERS_COMPONENT],
	[b.MIXED_CONTENT, C.HEADERS_COMPONENT]
]), Cn = class e extends E {
	#e(e) {
		let t = document.createElement("tr");
		this.appendColumnTitle(t, Z(X.name)), this.appendColumnTitle(t, Z(X.restrictionStatus)), this.affectedResources.appendChild(t);
		let n = 0;
		for (let t of e) {
			let e = t.details();
			this.appendAffectedMixedContent(e), n++;
		}
		this.updateAffectedResourceCount(n);
	}
	getResourceNameWithCount(e) {
		return Z(X.nResources, { n: e });
	}
	appendAffectedMixedContent(t) {
		let n = document.createElement("tr");
		if (n.classList.add("affected-resource-mixed-content"), t.request) {
			let e = Sn.get(this.issue.getCategory()) || C.HEADERS_COMPONENT;
			n.appendChild(this.createRequestCell(t.request, {
				networkTab: e,
				additionalOnClickAction() {
					m.issuesPanelResourceOpened(b.MIXED_CONTENT, T.REQUEST);
				}
			}));
		} else {
			let e = nt(t.insecureURL), r = this.appendIssueDetailCell(n, e, "affected-resource-mixed-content-info");
			r.title = t.insecureURL;
		}
		this.appendIssueDetailCell(n, e.translateStatus(t.resolutionStatus), "affected-resource-mixed-content-info"), this.affectedResources.appendChild(n);
	}
	static translateStatus(e) {
		switch (e) {
			case f.MixedContentResolutionStatus.MixedContentBlocked: return Z(X.blocked);
			case f.MixedContentResolutionStatus.MixedContentAutomaticallyUpgraded: return Z(X.automaticallyUpgraded);
			case f.MixedContentResolutionStatus.MixedContentWarning: return Z(X.warned);
		}
	}
	update() {
		this.clear(), this.#e(this.issue.getMixedContentIssues());
	}
}, wn = class e extends h {
	#e;
	#t;
	toggleOnClick;
	affectedResources;
	#n;
	#r;
	#i = null;
	#a;
	#o;
	#s = !0;
	#c;
	#l = !1;
	constructor(t, n) {
		super(void 0, void 0, xe(t.getCategory())), this.#e = t, this.#t = n, this.#o = new le(250), this.toggleOnClick = !0, this.listItemElement.classList.add("issue"), this.childrenListElement.classList.add("issue-body"), this.childrenListElement.classList.add(e.getBodyCSSClass(this.#e.getKind())), this.affectedResources = this.#p(), this.#n = [
			new kt(this, this.#e, "affected-cookies"),
			new F(this, this.#e, "affected-elements"),
			new xn(this, this.#e, "affected-requests"),
			new Cn(this, this.#e, "mixed-content-details"),
			new on(this, this.#e, "affected-sources"),
			new Ut(this, this.#e, "heavy-ad-details"),
			new zt(this, this.#e, "directives-details"),
			new Dt(this, this.#e, "blocked-by-response-details"),
			new tn(this, this.#e, "sab-details"),
			new mn(this, this.#e, "cors-details"),
			new vn(this, this.#e, "generic-details"),
			new Vt(this, this.#e, "affected-documents"),
			new fn(this, this.#e, "attribution-reporting-details"),
			new At(this, this.#e, "affected-raw-cookies"),
			new un(this, this.#e, "tracking-sites-details"),
			new qt(this, this.#e, "metadata-allowed-sites-details"),
			new Lt(this, this.#e, "disallowed-select-descendants-details"),
			new Yt(this, this.#e, "partitioning-blob-url-details"),
			new $t(this, this.#e, "permission-element-elements"),
			new ot(this, this.#e, "selective-permissions-intervention-details")
		], this.#c = new vt(), this.#r = null, this.#a = !1;
	}
	setIssue(e) {
		this.#e !== e && (this.#s = !0), this.#e = e, this.#n.forEach((t) => t.setIssue(e));
	}
	static getBodyCSSClass(e) {
		switch (e) {
			case y.BREAKING_CHANGE: return "issue-kind-breaking-change";
			case y.PAGE_ERROR: return "issue-kind-page-error";
			case y.IMPROVEMENT: return "issue-kind-improvement";
		}
	}
	getIssueTitle() {
		return this.#t.title;
	}
	onattach() {
		if (!this.#l) {
			this.createContent();
			return;
		}
		this.update();
	}
	createContent() {
		this.#d(), this.#m(), this.appendChild(this.affectedResources);
		let e = [];
		for (let t of this.#n) this.appendAffectedResource(t), t.update(), t.isEmpty() || e.push(t);
		this.#u(e), this.#h(), this.updateAffectedResourceVisibility(), this.#l = !0;
	}
	appendAffectedResource(e) {
		this.affectedResources.appendChild(e);
	}
	#u(e) {
		for (let t = 0; t < e.length; t++) {
			let n = e[t].listItemElement;
			g(n, t + 1), u(n, e.length);
		}
	}
	#d() {
		let e = document.createElement("div");
		e.classList.add("header"), this.#i = new fe(), this.#i.classList.add("leading-issue-icon", "extra-large"), this.#r = document.createElement("span");
		let t = new Ze();
		t.name = "countWrapper", t.append(this.#r), t.classList.add("aggregated-issues-count"), e.appendChild(this.#i), e.appendChild(t);
		let n = document.createElement("div");
		n.classList.add("title"), n.textContent = this.#t.title, e.appendChild(n), this.#c && e.appendChild(this.#c), this.#f(), this.listItemElement.appendChild(e);
	}
	onexpand() {
		let e = this.#e.getCategory();
		if (e === b.COOKIE) {
			let e = Ie.getSubCategory(this.#e.code());
			m.issuesPanelIssueExpanded(e);
		} else m.issuesPanelIssueExpanded(e);
		if (this.#s && this.#g(), !this.#a) {
			this.#a = !0;
			for (let e of this.#n) e.expandIfOneResource();
		}
	}
	#f() {
		if (this.#i) {
			let e = this.#e.getKind();
			this.#i.name = We(e), this.#i.title = ke(e);
		}
		if (this.#r && (this.#r.textContent = `${this.#e.getAggregatedIssuesCount()}`), this.listItemElement.classList.toggle("hidden-issue", this.#e.isHidden()), this.#c) {
			let e = {
				menuItemLabel: this.#e.isHidden() ? Z(X.unhideIssuesLikeThis) : Z(X.hideIssuesLikeThis),
				menuItemAction: () => {
					let e = ze(), t = e.get();
					t[this.#e.code()] = this.#e.isHidden() ? Me.UNHIDDEN : Me.HIDDEN, e.set(t);
				}
			};
			this.#c.data = e;
		}
	}
	updateAffectedResourceVisibility() {
		let e = this.#n.every((e) => e.isEmpty());
		this.affectedResources.hidden = e;
	}
	#p() {
		let e = new h();
		return e.setCollapsible(!1), e.setExpandable(!0), e.expand(), e.selectable = !1, e.listItemElement.classList.add("affected-resources-label"), e.listItemElement.textContent = Z(X.affectedResources), e.childrenListElement.classList.add("affected-resources"), g(e.listItemElement, 2), u(e.listItemElement, this.#t.links.length === 0 ? 2 : 3), e;
	}
	#m() {
		let e = new h();
		e.setCollapsible(!1), e.selectable = !1;
		let t = new Qe();
		t.data = { tokens: this.#t.markdown }, e.listItemElement.appendChild(t), g(e.listItemElement, 1), u(e.listItemElement, this.#t.links.length === 0 ? 2 : 3), this.appendChild(e);
	}
	#h() {
		if (this.#t.links.length === 0) return;
		let e = new h();
		e.setCollapsible(!1), e.listItemElement.classList.add("link-wrapper"), g(e.listItemElement, 3), u(e.listItemElement, 3);
		let t = e.listItemElement.createChild("ul", "link-list");
		for (let e of this.#t.links) {
			let n = t.createChild("li");
			l(d`<devtools-link class="link devtools-link" href=${e.link} jslogcontext="learn-more">${Z(X.learnMoreS, { PH1: e.linkTitle })}</devtools-link>`, n);
		}
		this.appendChild(e);
	}
	#g() {
		this.expanded && (this.#n.forEach((e) => e.update()), this.updateAffectedResourceVisibility()), this.#s = !this.expanded, this.#f();
	}
	update() {
		this.#o.schedule(async () => this.#g());
	}
	clear() {
		this.#n.forEach((e) => e.clear());
	}
	getIssueKind() {
		return this.#e.getKind();
	}
	isForHiddenIssue() {
		return this.#e.isHidden();
	}
	toggle(e) {
		e || e === void 0 && !this.expanded ? this.expand() : this.collapse();
	}
}, Tn = /* @__PURE__ */ e({
	IssuesPane: () => An,
	getGroupIssuesByCategorySetting: () => kn
}), Q = {
	crossOriginEmbedderPolicy: "Cross Origin Embedder Policy",
	mixedContent: "Mixed Content",
	samesiteCookie: "SameSite Cookie",
	heavyAds: "Heavy Ads",
	contentSecurityPolicy: "Content Security Policy",
	other: "Other",
	lowTextContrast: "Low Text Contrast",
	cors: "Cross Origin Resource Sharing",
	groupDisplayedIssuesUnder: "Group displayed issues under associated categories",
	groupByCategory: "Group by category",
	groupDisplayedIssuesUnderKind: "Group displayed issues as Page errors, Breaking changes and Improvements",
	groupByKind: "Group by kind",
	includeCookieIssuesCausedBy: "Include cookie Issues caused by third-party sites",
	includeThirdpartyCookieIssues: "Include third-party cookie issues",
	onlyThirdpartyCookieIssues: "Only third-party cookie issues detected",
	noIssues: "No issues detected",
	issuesPanelDescription: "On this page you can find warnings from the browser.",
	attributionReporting: "Attribution Reporting `API`",
	quirksMode: "Quirks Mode",
	generic: "Generic",
	permissionElement: "PEPC Element",
	selectivePermissionsIntervention: "Selective Permissions Intervention"
}, En = r("panels/issues/IssuesPane.ts", Q), $ = n.bind(void 0, En), Dn = "https://developer.chrome.com/docs/devtools/issues", On = class extends h {
	#e;
	constructor(e) {
		super(void 0, void 0, xe(e)), this.#e = e, this.toggleOnClick = !0, this.listItemElement.classList.add("issue-category"), this.childrenListElement.classList.add("issue-category-body");
	}
	getCategoryName() {
		switch (this.#e) {
			case b.CROSS_ORIGIN_EMBEDDER_POLICY: return $(Q.crossOriginEmbedderPolicy);
			case b.MIXED_CONTENT: return $(Q.mixedContent);
			case b.COOKIE: return $(Q.samesiteCookie);
			case b.HEAVY_AD: return $(Q.heavyAds);
			case b.CONTENT_SECURITY_POLICY: return $(Q.contentSecurityPolicy);
			case b.LOW_TEXT_CONTRAST: return $(Q.lowTextContrast);
			case b.CORS: return $(Q.cors);
			case b.ATTRIBUTION_REPORTING: return $(Q.attributionReporting);
			case b.QUIRKS_MODE: return $(Q.quirksMode);
			case b.GENERIC: return $(Q.generic);
			case b.PERMISSION_ELEMENT: return $(Q.permissionElement);
			case b.SELECTIVE_PERMISSIONS_INTERVENTION: return $(Q.selectivePermissionsIntervention);
			case b.OTHER: return $(Q.other);
		}
	}
	onattach() {
		this.#t();
	}
	#t() {
		let e = document.createElement("div");
		e.classList.add("header");
		let t = document.createElement("div");
		t.classList.add("title"), t.textContent = this.getCategoryName(), e.appendChild(t), this.listItemElement.appendChild(e);
	}
};
function kn() {
	return a.instance().createSetting("group-issues-by-category", !1);
}
var An = class extends ce {
	#e;
	#t;
	#n;
	#r;
	#i;
	#a;
	#o;
	#s;
	#c;
	#l = Promise.resolve();
	constructor() {
		super({
			jslog: `${ee("issues")}`,
			useShadowDom: !0
		}), this.registerRequiredCSS(wt), this.contentElement.classList.add("issues-pane"), this.#e = /* @__PURE__ */ new Map(), this.#n = /* @__PURE__ */ new Map(), this.#t = /* @__PURE__ */ new Map(), this.#r = null, this.#u(), this.#i = new _e(), this.#i.setShowSelectionOnKeyboardFocus(!0), this.#i.contentElement.classList.add("issues"), this.#i.registerRequiredCSS(Tt), this.contentElement.appendChild(this.#i.element), this.#a = new dt(), this.#i.appendChild(this.#a), this.#o = new te("", $(Q.issuesPanelDescription)), this.#o.link = Dn, this.#o.show(this.contentElement), this.#s = S.instance(), this.#c = new Be(this.#s), this.#c.addEventListener(Re.AGGREGATED_ISSUE_UPDATED, this.#d, this), this.#c.addEventListener(Re.FULL_UPDATE_REQUIRED, this.#_, this), this.#a.hidden = this.#s.numberOfHiddenIssues() === 0, this.#_(), this.#s.addEventListener(Pe.ISSUES_COUNT_UPDATED, this.#b, this);
	}
	elementsToRestoreScrollPositionsFor() {
		return [this.#i.element];
	}
	#u() {
		let e = this.contentElement.createChild("div", "issues-toolbar-container");
		e.setAttribute("jslog", `${ge()}`), e.role = "toolbar";
		let t = e.createChild("devtools-toolbar", "issues-toolbar-left");
		t.role = "presentation";
		let n = e.createChild("devtools-toolbar", "issues-toolbar-right");
		n.role = "presentation";
		let r = kn(), i = new ye(r, $(Q.groupDisplayedIssuesUnder), $(Q.groupByCategory));
		i.setVisible(!1), n.appendToolbarItem(i), r.addChangeListener(() => {
			this.#v(!0);
		});
		let a = A(), o = new ye(a, $(Q.groupDisplayedIssuesUnderKind), $(Q.groupByKind));
		n.appendToolbarItem(o), a.addChangeListener(() => {
			this.#v(!0);
		}), o.setVisible(!0);
		let s = Le();
		this.#r = new ye(s, $(Q.includeCookieIssuesCausedBy), $(Q.includeThirdpartyCookieIssues)), n.appendToolbarItem(this.#r), n.appendSeparator();
		let c = new qe();
		c.data = {
			clickHandler: () => {
				this.focus();
			},
			tooltipCallback: () => {
				let e = Ge(S.instance(), !1);
				c.title = e;
			},
			displayMode: Ke.SHOW_ALWAYS,
			issuesManager: S.instance()
		}, c.id = "console-issues-counter", c.setAttribute("jslog", `${ne("issues")}`);
		let l = new be(c);
		return n.appendToolbarItem(l), { toolbarContainer: e };
	}
	#d(e) {
		this.#f(e.data);
	}
	#f(e) {
		this.#l = this.#l.then(() => this.#p(e));
	}
	async #p(e) {
		let t = this.#t.get(e.aggregationKey());
		if (t) {
			t.setIssue(e);
			let n = this.#h(e);
			t.parent !== n && !(n instanceof ie && t.parent === n.rootElement()) && (t.parent?.removeChild(t), this.appendIssueViewToParent(t, n));
		} else {
			let n = e.getDescription();
			if (!n) {
				console.warn("Could not find description for issue code:", e.code());
				return;
			}
			t = new wn(e, await He(n)), this.#t.set(e.aggregationKey(), t);
			let r = this.#h(e);
			this.appendIssueViewToParent(t, r);
		}
		t.update(), this.#b();
	}
	appendIssueViewToParent(e, t) {
		t.appendChild(e, (e, t) => e instanceof dt ? 1 : t instanceof dt ? -1 : e instanceof wn && t instanceof wn ? e.getIssueTitle().localeCompare(t.getIssueTitle()) : (console.error("The issues tree should only contain IssueView objects as direct children"), 0)), t instanceof h && this.#m(t);
	}
	#m(e) {
		let t = e.childrenListNode.children, n = 0;
		for (let e = 0; e < t.length; e++) {
			let r = t[e];
			r.classList.contains("issue") && (g(r, ++n), u(r, t.length / 2));
		}
	}
	#h(e) {
		if (e.isHidden()) return this.#a;
		if (A().get()) {
			let t = e.getKind(), n = this.#n.get(t);
			if (n) return n;
			let r = new Ct(t);
			return this.#i.appendChild(r, (e, t) => e instanceof Ct && t instanceof Ct ? xt(e, t) : 0), this.#n.set(t, r), r;
		}
		if (kn().get()) {
			let t = e.getCategory(), n = this.#e.get(t);
			if (n) return n;
			let r = new On(t);
			return this.#i.appendChild(r, (e, t) => e instanceof On && t instanceof On ? e.getCategoryName().localeCompare(t.getCategoryName()) : 0), this.#e.set(t, r), r;
		}
		return this.#i;
	}
	#g(e, t) {
		for (let [n, r] of Array.from(e.entries())) t?.has(n) || (r.parent?.removeChild(r), e.delete(n));
	}
	#_() {
		this.#v(!1);
	}
	#v(e) {
		if (this.#g(this.#e, e ? void 0 : this.#c.aggregatedIssueCategories()), this.#g(this.#n, e ? void 0 : this.#c.aggregatedIssueKinds()), this.#g(this.#t, e ? void 0 : this.#c.aggregatedIssueCodes()), this.#c) for (let e of this.#c.aggregatedIssues()) this.#f(e);
		this.#b();
	}
	#y() {
		for (let e of this.#n.values()) {
			let t = this.#s.numberOfIssues(e.getKind());
			e.update(t);
		}
	}
	#b() {
		this.#x(this.#s.numberOfIssues(), this.#s.numberOfHiddenIssues()), A().get() && this.#y();
	}
	#x(e, t) {
		if (e > 0 || t > 0) {
			this.#a.hidden = t === 0, this.#a.update(t), this.#i.element.hidden = !1, this.#o.hideWidget();
			let e = this.#i.firstChild();
			e && (e.select(!0), this.setDefaultFocusedElement(e.listItemElement));
		} else {
			this.#i.element.hidden = !0;
			let e = this.#s.numberOfAllStoredIssues() - this.#s.numberOfThirdPartyCookiePhaseoutIssues() > 0;
			this.#o.header = $(e ? Q.onlyThirdpartyCookieIssues : Q.noIssues), this.#o.showWidget();
		}
	}
	async reveal(e) {
		await this.#l;
		let t = this.#c.keyForIssue(e), n = this.#t.get(t);
		if (n) {
			if (n.isForHiddenIssue() && (this.#a.expand(), this.#a.reveal()), A().get() && !n.isForHiddenIssue()) {
				let e = this.#n.get(n.getIssueKind());
				e?.expand(), e?.reveal();
			}
			n.expand(), n.reveal(), n.select(!1, !0);
		}
	}
}, jn = /* @__PURE__ */ e({ IssueRevealer: () => Mn }), Mn = class {
	async reveal(e) {
		await pe.instance().showView("issues-pane");
		let t = pe.instance().view("issues-pane");
		if (t) {
			let n = await t.widget();
			if (n instanceof An) await n.reveal(e);
			else throw Error("Expected issues pane to be an instance of IssuesPane");
		}
	}
};
//#endregion
export { rt as AffectedSelectivePermissionsInterventionView, jn as IssueRevealer, yn as IssueView, Tn as IssuesPane };
