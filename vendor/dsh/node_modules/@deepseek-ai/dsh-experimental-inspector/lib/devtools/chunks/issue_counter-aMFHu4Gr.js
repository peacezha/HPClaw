import { D as e, H as t, K as n, X as r } from "./common-DMSVbaSb.js";
import { Fo as i, No as a, Po as o, Vo as s, fp as c, wo as l, za as u } from "./legacy-dM_vujv7.js";
import "./icon_button-DGIafxYW.js";
import { E as d, S as f, d as p } from "./issues_manager-Ba4w-pt1.js";
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/components/issue_counter/issueCounter.css.mjs
var m = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  white-space: normal;\n  display: inline-block;\n}\n", h = {
	pageErrors: "{issueCount, plural, =1 {# page error} other {# page errors}}",
	breakingChanges: "{issueCount, plural, =1 {# breaking change} other {# breaking changes}}",
	possibleImprovements: "{issueCount, plural, =1 {# possible improvement} other {# possible improvements}}"
}, g = n("ui/components/issue_counter/IssueCounter.ts", h), _ = t.bind(void 0, g);
function v(e) {
	switch (e) {
		case d.PAGE_ERROR: return "issue-cross-filled";
		case d.BREAKING_CHANGE: return "issue-exclamation-filled";
		case d.IMPROVEMENT: return "issue-text-filled";
	}
}
function y(e, t) {
	return t ? {
		iconName: e,
		iconWidth: t,
		iconHeight: t
	} : { iconName: e };
}
var b = /* @__PURE__ */ function(e) {
	return e.OMIT_EMPTY = "OmitEmpty", e.SHOW_ALWAYS = "ShowAlways", e.ONLY_MOST_IMPORTANT = "OnlyMostImportant", e;
}({}), x = (function() {
	let e;
	return { format(...t) {
		return e ||= new Intl.ListFormat(r.instance().locale, {
			type: "unit",
			style: "short"
		}), e.format(...t);
	} };
})();
function S(e, t = !0) {
	let n = [
		e.numberOfIssues(d.PAGE_ERROR),
		e.numberOfIssues(d.BREAKING_CHANGE),
		e.numberOfIssues(d.IMPROVEMENT)
	], r = [
		_(h.pageErrors, { issueCount: n[0] }),
		_(h.breakingChanges, { issueCount: n[1] }),
		_(h.possibleImprovements, { issueCount: n[2] })
	];
	return x.format(r.filter((e, r) => !t || n[r] > 0));
}
var C = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t;
	#n;
	#r = "";
	#i;
	#a = [
		0,
		0,
		0
	];
	#o = "OmitEmpty";
	#s;
	#c;
	#l;
	#u = !1;
	scheduleUpdate() {
		this.#i ? this.#i.schedule(async () => this.#d()) : this.#d();
	}
	set data(e) {
		this.#t = e.clickHandler, this.#r = e.leadingText ?? "", this.#n = e.tooltipCallback, this.#o = e.displayMode ?? "OmitEmpty", this.#c = e.accessibleName, this.#l = e.throttlerTimeout, this.#u = !!e.compact, this.#s !== e.issuesManager && (this.#s?.removeEventListener(p.ISSUES_COUNT_UPDATED, this.scheduleUpdate, this), this.#s = e.issuesManager, this.#s.addEventListener(p.ISSUES_COUNT_UPDATED, this.scheduleUpdate, this)), this.#i = e.throttlerTimeout === 0 ? void 0 : new c(e.throttlerTimeout ?? 100), this.scheduleUpdate();
	}
	get data() {
		return {
			clickHandler: this.#t,
			leadingText: this.#r,
			tooltipCallback: this.#n,
			displayMode: this.#o,
			accessibleName: this.#c,
			throttlerTimeout: this.#l,
			compact: this.#u,
			issuesManager: this.#s
		};
	}
	#d() {
		if (!this.#s) return;
		this.#a = [
			this.#s.numberOfIssues(d.PAGE_ERROR),
			this.#s.numberOfIssues(d.BREAKING_CHANGE),
			this.#s.numberOfIssues(d.IMPROVEMENT)
		];
		let e = [
			d.PAGE_ERROR,
			d.BREAKING_CHANGE,
			d.IMPROVEMENT
		][this.#a.findIndex((e) => e > 0) ?? 2], t = (t, n) => {
			switch (this.#o) {
				case "OmitEmpty": return n > 0 ? `${n}` : void 0;
				case "ShowAlways": return `${n}`;
				case "OnlyMostImportant": return t === e ? `${n}` : void 0;
			}
		}, n = {
			groups: [
				{
					...y(v(d.PAGE_ERROR), "2ex"),
					text: t(d.PAGE_ERROR, this.#a[0])
				},
				{
					...y(v(d.BREAKING_CHANGE), "2ex"),
					text: t(d.BREAKING_CHANGE, this.#a[1])
				},
				{
					...y(v(d.IMPROVEMENT), "2ex"),
					text: t(d.IMPROVEMENT, this.#a[2])
				}
			],
			clickHandler: this.#t,
			leadingText: this.#r,
			accessibleName: this.#c,
			compact: this.#u
		};
		i(o`
        <style>${m}</style>
        <icon-button .data=${n} .accessibleName=${this.#c}></icon-button>
        `, this.#e, { host: this }), this.#n?.();
	}
};
customElements.define("devtools-issue-counter", C);
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/components/issue_counter/issueLinkIcon.css.mjs
var w = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  display: inline-block;\n  white-space: nowrap;\n  color: inherit;\n  font-size: inherit;\n  font-family: inherit;\n}\n\n:host([hidden]) {\n  display: none;\n}\n\nbutton {\n  border: none;\n  background: transparent;\n  margin: 0;\n  padding: 0;\n\n  &.link {\n    cursor: pointer;\n\n    & > span {\n      color: var(--sys-color-primary);\n    }\n  }\n}\n\ndevtools-icon {\n  width: 16px;\n  height: 16px;\n  vertical-align: middle;\n\n  &[name=\"issue-cross-filled\"] {\n    color: var(--icon-error);\n  }\n\n  &[name=\"issue-exclamation-filled\"] {\n    color: var(--icon-warning);\n  }\n\n  &[name=\"issue-text-filled\"] {\n    color: var(--icon-info);\n  }\n}\n\n@media (forced-colors: active) {\n  devtools-icon {\n    color: ButtonText;\n  }\n}\n", { html: T } = a, E = {
	clickToShowIssue: "Click to show issue in the issues tab",
	clickToShowIssueWithTitle: "Click to open the issue tab and show issue: {title}",
	issueUnavailable: "Issue unavailable at this time"
}, D = n("ui/components/issue_counter/IssueLinkIcon.ts", E), O = t.bind(void 0, D), k = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t;
	#n = null;
	#r;
	#i;
	#a;
	#o = e;
	set data(e) {
		if (this.#t = e.issue, this.#r = e.issueId, this.#i = e.issueResolver, !this.#t) {
			if (!this.#r) throw Error("Either `issue` or `issueId` must be provided");
			if (!this.#i) throw Error("An `IssueResolver` must be provided if an `issueId` is provided.");
		}
		this.#a = e.additionalOnClickAction, e.revealOverride && (this.#o = e.revealOverride), this.#s(), this.#u();
	}
	async #s() {
		if (!this.#t && this.#r) try {
			this.#t = await this.#i?.waitFor(this.#r);
		} catch {
			this.#t = null;
		}
		let e = this.#t?.getDescription();
		if (e) {
			let t = await f(e);
			t && (this.#n = t);
		}
		await this.#u();
	}
	get data() {
		return {
			issue: this.#t,
			issueId: this.#r,
			issueResolver: this.#i,
			additionalOnClickAction: this.#a,
			revealOverride: this.#o === e ? void 0 : this.#o
		};
	}
	handleClick(e) {
		e.button === 0 && (this.#t && this.#o(this.#t), this.#a?.(), e.consume());
	}
	#c() {
		return this.#n ? O(E.clickToShowIssueWithTitle, { title: this.#n }) : this.#t ? O(E.clickToShowIssue) : O(E.issueUnavailable);
	}
	#l() {
		return this.#t ? v(this.#t.getKind()) : "issue-questionmark-filled";
	}
	#u() {
		return l(() => {
			i(T`
      <style>${w}</style>
      <button class=${s({ link: !!this.#t })}
              title=${this.#c()}
              jslog=${u("issue").track({ click: !0 })}
              @click=${this.handleClick}>
        <devtools-icon name=${this.#l()}></devtools-icon>
      </button>`, this.#e, { host: this });
		});
	}
};
customElements.define("devtools-issue-link-icon", k);
//#endregion
export { v as a, S as i, b as n, C as r, k as t };
