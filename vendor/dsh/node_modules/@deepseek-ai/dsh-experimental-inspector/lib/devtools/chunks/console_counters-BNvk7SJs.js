import { n as e } from "./rolldown-runtime-DF993M8W.js";
import { H as t, K as n, x as r } from "./common-DMSVbaSb.js";
import { No as i, Or as a, Qs as o, Ta as s, Zs as c, ff as l, fp as u, gf as d, ir as f, jd as p, jr as m, ni as h, rr as g } from "./legacy-dM_vujv7.js";
import "./icon_button-DGIafxYW.js";
import { d as _, o as v } from "./issues_manager-Ba4w-pt1.js";
import { i as y, n as b } from "./issue_counter-aMFHu4Gr.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/console_counters/WarningErrorCounter.ts
var x = /* @__PURE__ */ e({
	WarningErrorCounter: () => j,
	WarningErrorCounterWidget: () => k
}), { html: S, nothing: C, render: w } = i, T = {
	sErrors: "{n, plural, =1 {# error} other {# errors}}",
	sWarnings: "{n, plural, =1 {# warning} other {# warnings}}",
	openConsoleToViewS: "Open Console to view {PH1}",
	openIssuesToView: "{n, plural, =1 {Open Issues to view # issue:} other {Open Issues to view # issues:}}"
}, E = n("panels/console_counters/WarningErrorCounter.ts", T), D = t.bind(void 0, E), O = (e, t, n) => {
	let i = v.instance(), a = (e) => e === 0 ? void 0 : `${e}`, { errors: o, warnings: c, issues: l, compact: u } = e, d = D(T.sErrors, { n: o }), f = D(T.sWarnings, { n: c }), p = "";
	o && c ? p = `${d}, ${f}` : o ? p = d : c && (p = f);
	let m = D(T.openConsoleToViewS, { PH1: p }), h = {
		clickHandler: r.instance().show.bind(r.instance()),
		accessibleName: m,
		compact: u,
		groups: [{
			iconName: "cross-circle-filled",
			text: a(o)
		}, {
			iconName: "warning-filled",
			text: a(c)
		}]
	}, g = y(i), _ = `${D(T.openIssuesToView, { n: l })} ${g}`, x = {
		clickHandler: e.showIssuesHandler,
		issuesManager: i,
		compact: u,
		accessibleName: _,
		displayMode: b.ONLY_MOST_IMPORTANT
	};
	w(S`<div class="status-buttons"
         >${o + c ? S`<icon-button
            .data=${h}
            title=${m}
            class=${"small"}
            jslog=${s("console").track({ click: !0 })}
         ></icon-button>` : C}${l ? S`<devtools-issue-counter
            class=${"main-toolbar"}
            title=${_}
            .data=${x}
            jslog=${s("issue").track({ click: !0 })}
         ></devtools-issue-counter>` : C}</div>`, n);
}, k = class e extends h {
	setVisibility;
	view;
	throttler;
	updatingForTest;
	compact;
	static instanceForTest = null;
	constructor(t, n, r = O) {
		super(t), this.setVisibility = n, this.view = r, this.throttler = new u(100), p.instance().addModelListener(c, o.ConsoleCleared, this.update, this), p.instance().addModelListener(c, o.MessageAdded, this.update, this), p.instance().addModelListener(c, o.MessageUpdated, this.update, this), v.instance().addEventListener(_.ISSUES_COUNT_UPDATED, this.update, this), this.update(), e.instanceForTest = this;
	}
	onSetCompactLayout(e) {
		this.setCompactLayout(e.data);
	}
	setCompactLayout(e) {
		this.compact = e, this.performUpdate();
	}
	updatedForTest() {}
	update() {
		this.updatingForTest = !0, this.throttler.schedule(this.performUpdate.bind(this));
	}
	get titlesForTesting() {
		let e = this.contentElement.querySelector("icon-button")?.shadowRoot?.querySelector("button");
		return e ? e.getAttribute("aria-label") : null;
	}
	showIssues() {
		l.issuesPanelOpenedFrom(d.STATUS_BAR_ISSUES_COUNTER), m.instance().showView("issues-pane");
	}
	async performUpdate() {
		let e = c.allErrors(), t = c.allWarnings(), n = v.instance().numberOfIssues();
		this.view({
			compact: this.compact,
			errors: e,
			warnings: t,
			issues: n,
			showIssuesHandler: this.showIssues.bind(this)
		}, {}, this.contentElement), this.setVisibility(!!(e || t || n)), a.instance().toolbarItemResized(), this.updatingForTest = !1, this.updatedForTest();
	}
}, A, j = class e {
	toolbarItem;
	constructor() {
		let e = document.createElement("devtools-widget"), t = new g(e);
		t.setVisible(!1);
		let n = new k(e, t.setVisible.bind(t));
		t.addEventListener(f.COMPACT_LAYOUT_UPDATED, n.onSetCompactLayout, n), this.toolbarItem = t;
	}
	item() {
		return this.toolbarItem;
	}
	static instance(t = { forceNew: null }) {
		let { forceNew: n } = t;
		return (!A || n) && (A = new e()), A;
	}
};
//#endregion
export { x as WarningErrorCounter };
