import { n as e } from "./rolldown-runtime-DF993M8W.js";
import { $ as t, D as n, H as r, K as i, Q as a } from "./common-DMSVbaSb.js";
import { $i as o, Fo as s, Ja as c, L as l, No as u, Rl as d, Zi as f, Zo as ee, ei as p, fa as m, ff as h, ha as g, ii as te, ln as ne, ni as _, pf as re, qa as v } from "./legacy-dM_vujv7.js";
import { g as y } from "./text_utils-DWSliayn.js";
import { t as b } from "./diff-DXcO6Sla.js";
import { D as x, S, T as C, w } from "./bindings-DyamxTH2.js";
import { fn as T, in as E, mn as D } from "./common-Bs7hSOUj.js";
import { a as ie } from "./snippets-BWb8aXVv.js";
import { t as ae } from "./utils-3dsE24eK.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/workspace_diff/WorkspaceDiff.ts
var oe = class extends a {
	#e = T.instance();
	#t = /* @__PURE__ */ new WeakMap();
	loadingUISourceCodes = /* @__PURE__ */ new Map();
	#n = /* @__PURE__ */ new Set();
	constructor(e) {
		super(), e.addEventListener(S.WorkingCopyChanged, this.#i, this), e.addEventListener(S.WorkingCopyCommitted, this.#i, this), e.addEventListener(S.UISourceCodeAdded, this.#a, this), e.addEventListener(S.UISourceCodeRemoved, this.#o, this), e.addEventListener(S.ProjectRemoved, this.#s, this), e.uiSourceCodes().forEach(this.#f.bind(this));
	}
	requestDiff(e) {
		return this.#r(e).requestDiff();
	}
	subscribeToDiffChange(e, t, n) {
		this.#r(e).addEventListener("DiffChanged", t, n);
	}
	unsubscribeFromDiffChange(e, t, n) {
		this.#r(e).removeEventListener("DiffChanged", t, n);
	}
	modifiedUISourceCodes() {
		return Array.from(this.#n);
	}
	#r(e) {
		let t = this.#t.get(e);
		return t || (t = new k(e), this.#t.set(e, t)), t;
	}
	#i(e) {
		let t = e.data.uiSourceCode;
		this.#f(t);
	}
	#a(e) {
		let t = e.data;
		this.#f(t);
	}
	#o(e) {
		let t = e.data;
		this.#c(t);
	}
	#s(e) {
		let t = e.data;
		for (let e of t.uiSourceCodes()) this.#c(e);
	}
	#c(e) {
		this.loadingUISourceCodes.delete(e);
		let t = this.#t.get(e);
		t && (t.dispose = !0), this.#l(e);
	}
	#l(e) {
		this.uiSourceCodeProcessedForTest(), this.#n.delete(e) && this.dispatchEventToListeners("ModifiedStatusChanged", {
			uiSourceCode: e,
			isModified: !1
		});
	}
	#u(e) {
		this.uiSourceCodeProcessedForTest(), !this.#n.has(e) && (this.#n.add(e), this.dispatchEventToListeners("ModifiedStatusChanged", {
			uiSourceCode: e,
			isModified: !0
		}));
	}
	uiSourceCodeProcessedForTest() {}
	#d(e) {
		switch (e.project().type()) {
			case C.Network: return this.#e.binding(e) === null;
			case C.FileSystem: return !0;
			default: return !1;
		}
	}
	async #f(e) {
		if (this.loadingUISourceCodes.delete(e), !this.#d(e)) {
			this.#l(e);
			return;
		}
		if (e.isDirty()) {
			this.#u(e);
			return;
		}
		if (!e.hasCommits()) {
			this.#l(e);
			return;
		}
		let t = Promise.all([this.requestOriginalContentForUISourceCode(e), e.requestContentData().then((e) => y.textOr(e, null))]);
		this.loadingUISourceCodes.set(e, t);
		let n = await t;
		this.loadingUISourceCodes.get(e) === t && (this.loadingUISourceCodes.delete(e), n[0] !== null && n[1] !== null && n[0] !== n[1] ? this.#u(e) : this.#l(e));
	}
	requestOriginalContentForUISourceCode(e) {
		return this.#r(e).originalContent();
	}
	revertToOriginal(e) {
		function t(t) {
			typeof t == "string" && e.addRevision(t);
		}
		return h.actionTaken(re.RevisionApplied), this.requestOriginalContentForUISourceCode(e).then(t);
	}
}, O = /* @__PURE__ */ function(e) {
	return e.MODIFIED_STATUS_CHANGED = "ModifiedStatusChanged", e;
}({}), k = class extends a {
	#e;
	#t = null;
	#n = null;
	dispose = !1;
	constructor(e) {
		super(), this.#e = e, e.addEventListener(x.WorkingCopyChanged, this.#r, this), e.addEventListener(x.WorkingCopyCommitted, this.#r, this);
	}
	#r() {
		this.#n &&= (clearTimeout(this.#n), null), this.#t = null;
		let e = this.#e.content(), t = !e || e.length < 65536 ? 0 : 200;
		this.#n = window.setTimeout(n.bind(this), t);
		function n() {
			this.dispose || (this.dispatchEventToListeners("DiffChanged"), this.#n = null);
		}
	}
	requestDiff() {
		return this.#t ||= this.#i(), this.#t;
	}
	async originalContent() {
		let e = E.instance().originalContentForUISourceCode(this.#e);
		if (e) return await e;
		let t = await this.#e.project().requestFileContent(this.#e);
		return y.isError(t) ? t.error : t.asDeferedContent().content;
	}
	async #i() {
		if (this.dispose) return null;
		let e = await this.originalContent();
		if (e === null || e.length > 1048576 || this.dispose) return null;
		let t = this.#e.workingCopy();
		if (!t && !this.#e.contentLoaded()) {
			let e = await this.#e.requestContentData();
			if (y.isError(e)) return null;
			t = e.text;
		}
		if (t.length > 1048576 || this.dispose) return null;
		e = (await d(this.#e.contentType(), this.#e.mimeType(), e)).formattedContent;
		let n = await d(this.#e.contentType(), this.#e.mimeType(), t);
		t = n.formattedContent;
		let r = n.formattedMapping, i = /\r\n?|\n/;
		return {
			diff: b.lineDiff(e.split(i), t.split(i)),
			formattedCurrentMapping: r
		};
	}
}, A = null;
function j({ forceNew: e } = {}) {
	return (!A || e) && (A = new oe(w.instance())), A;
}
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/changes/changesSidebar.css.mjs
var M = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n@scope to (devtools-widget > *) {\n.tree-outline li {\n  min-height: 20px;\n}\n\ndevtools-icon {\n  color: var(--icon-file-default);\n  margin-right: var(--sys-size-4);\n}\n\n.tree-element-title > div {\n  display: flex;\n  align-items: center;\n}\n\n.navigator-sm-script-tree-item devtools-icon,\n.navigator-script-tree-item devtools-icon,\n.navigator-snippet-tree-item devtools-icon {\n  color: var(--icon-file-script);\n}\n\n.navigator-sm-stylesheet-tree-item devtools-icon,\n.navigator-stylesheet-tree-item devtools-icon {\n  color: var(--icon-file-styles);\n}\n\n.navigator-image-tree-item devtools-icon {\n  color: var(--icon-file-image);\n}\n\n.navigator-font-tree-item devtools-icon {\n  color: var(--icon-file-font);\n}\n\n.tree-outline li:hover:not(.selected) .selection {\n  display: block;\n\n  & devtools-icon {\n    color: var(--icon-default-hover);\n  }\n}\n\n@media (forced-colors: active) {\n  li,\n  devtools-icon {\n    forced-color-adjust: none;\n    color: ButtonText !important; /* stylelint-disable-line declaration-no-important */\n  }\n}\n}\n", N = /* @__PURE__ */ e({
	ChangesSidebar: () => B,
	DEFAULT_VIEW: () => z,
	Events: () => V
}), P = { sFromSourceMap: "{PH1} (from source map)" }, F = i("panels/changes/ChangesSidebar.ts", P), I = r.bind(void 0, F), { render: L, html: R } = u, z = (e, t, n) => {
	let r = (e) => e.contentType().isFromSourceMap() ? I(P.sFromSourceMap, { PH1: e.displayName() }) : e.url(), i = (e) => ie(e) ? "snippet" : "document";
	L(R`<devtools-tree
             navigation-variant
             hide-overflow .template=${R`
               <ul role="tree">
                 ${e.sourceCodes.values().map((t) => R`
                   <li
                     role="treeitem"
                     @select=${() => e.onSelect(t)}
                     ?selected=${t === e.selectedSourceCode}>
                       <style>${M}</style>
                       <div class=${"navigator-" + t.contentType().name() + "-tree-item"}>
                         <devtools-icon name=${i(t)}></devtools-icon>
                         <span title=${r(t)}>
                           <span ?hidden=${!t.isDirty()}>*</span>
                           ${t.displayName()}
                         </span>
                       </div>
                   </li>`)}
               </ul>`}></devtools-tree>`, n, { container: { attributes: { jslog: `${v("sidebar").track({ resize: !0 })}` } } });
}, B = class extends t(_) {
	#e = null;
	#t;
	#n = /* @__PURE__ */ new Set();
	#r = null;
	constructor(e, t = z) {
		super(e), this.#t = t;
	}
	set workspaceDiff(e) {
		this.#e && (this.#e.modifiedUISourceCodes().forEach(this.#o.bind(this)), this.#e.removeEventListener(O.MODIFIED_STATUS_CHANGED, this.uiSourceCodeModifiedStatusChanged, this)), this.#e = e, this.#e.modifiedUISourceCodes().forEach(this.#a.bind(this)), this.#e.addEventListener(O.MODIFIED_STATUS_CHANGED, this.uiSourceCodeModifiedStatusChanged, this), this.requestUpdate();
	}
	selectedUISourceCode() {
		return this.#r;
	}
	performUpdate() {
		let e = {
			onSelect: (e) => this.#i(e),
			sourceCodes: this.#n,
			selectedSourceCode: this.#r
		};
		this.#t(e, {}, this.contentElement);
	}
	#i(e) {
		this.#r = e, this.dispatchEventToListeners("SelectedUISourceCodeChanged"), this.requestUpdate();
	}
	#a(e) {
		this.#n.add(e), e.addEventListener(x.TitleChanged, this.requestUpdate, this), e.addEventListener(x.WorkingCopyChanged, this.requestUpdate, this), e.addEventListener(x.WorkingCopyCommitted, this.requestUpdate, this), this.requestUpdate();
	}
	#o(e) {
		if (e.removeEventListener(x.TitleChanged, this.requestUpdate, this), e.removeEventListener(x.WorkingCopyChanged, this.requestUpdate, this), e.removeEventListener(x.WorkingCopyCommitted, this.requestUpdate, this), e === this.#r) {
			let t;
			for (let n of this.#n.values()) {
				if (n === e) break;
				t = n;
			}
			this.#n.delete(e), this.#i(t ?? this.#n.values().next().value ?? null);
		} else this.#n.delete(e);
		this.requestUpdate();
	}
	uiSourceCodeModifiedStatusChanged(e) {
		let { isModified: t, uiSourceCode: n } = e.data;
		t ? this.#a(n) : this.#o(n), this.requestUpdate();
	}
}, V = /* @__PURE__ */ function(e) {
	return e.SELECTED_UI_SOURCE_CODE_CHANGED = "SelectedUISourceCodeChanged", e;
}({}), H = "/*\n * Copyright 2017 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n[slot=\"main\"] {\n  flex-direction: column;\n  display: flex;\n}\n\n[slot=\"sidebar\"] {\n  overflow: auto;\n}\n\n.diff-container {\n  flex: 1;\n  overflow: auto;\n\n  & .widget:first-child {\n    height: 100%;\n  }\n\n  .combined-diff-view {\n    padding-inline: var(--sys-size-6);\n    padding-block: var(--sys-size-4);\n  }\n}\n\n:focus.selected {\n  background-color: var(--sys-color-tonal-container);\n  color: var(--sys-color-on-tonal-container);\n}\n\n.changes-toolbar {\n  background-color: var(--sys-color-cdt-base-container);\n  border-top: 1px solid var(--sys-color-divider);\n}\n\n[hidden] {\n  display: none !important; /* stylelint-disable-line declaration-no-important */\n}\n\n.copy-to-prompt {\n  margin: var(--sys-size-4);\n  /* Got to override the default flex properties for widgets */\n  flex-grow: 0 !important; /* stylelint-disable-line declaration-no-important */\n}\n", se = "/*\n * Copyright 2025 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.combined-diff-view {\n  display: flex;\n  flex-direction: column;\n  gap: var(--sys-size-5);\n  height: 100%;\n  background-color: var(--sys-color-surface3);\n  overflow: auto;\n\n  details {\n    flex-shrink: 0;\n    border-radius: 12px;\n\n    &.selected {\n      outline: var(--sys-size-2) solid var(--sys-color-divider-on-tonal-container);\n    }\n\n    summary {\n      background-color: var(--sys-color-surface1);\n      border-radius: var(--sys-shape-corner-medium-small);\n      height: var(--sys-size-12);\n      padding: var(--sys-size-3);\n      font: var(--sys-typescale-body5-bold);\n      display: flex;\n      justify-content: space-between;\n      gap: var(--sys-size-2);\n\n      &:focus-visible {\n        outline: var(--sys-size-2) solid var(--sys-color-state-focus-ring);\n        /* Prevents outline clipping by drawing it inside the element's bounds instead of outside. */\n        outline-offset: calc(-1 * var(--sys-size-2));\n      }\n\n      .summary-left {\n        display: flex;\n        align-items: center;\n        min-width: 0;\n        flex-grow: 0;\n\n        .file-name-link {\n          margin-left: var(--sys-size-5);\n          width: 100%;\n          text-overflow: ellipsis;\n          overflow: hidden;\n          text-wrap-mode: nowrap;\n          border: none;\n          background: none;\n          font: inherit;\n          padding: 0;\n\n          &:hover {\n            color: var(--sys-color-primary);\n            text-decoration: underline;\n            cursor: pointer;\n          }\n\n          &:focus-visible {\n            outline: var(--sys-size-2) solid var(--sys-color-state-focus-ring);\n            outline-offset: var(--sys-size-2);\n          }\n        }\n\n        devtools-icon {\n          transform: rotate(270deg);\n        }\n\n        devtools-file-source-icon {\n          height: var(--sys-size-8);\n          width: var(--sys-size-8);\n          flex-shrink: 0;\n        }\n      }\n\n      .summary-right {\n        flex-shrink: 0;\n        display: flex;\n        align-items: center;\n        gap: var(--sys-size-2);\n        padding-right: var(--sys-size-4);\n\n        .copied {\n          font: var(--sys-typescale-body5-regular);\n        }\n      }\n\n      &::marker {\n        content: '';\n      }\n    }\n\n    .diff-view-container {\n      overflow-x: auto;\n      background-color: var(--sys-color-cdt-base-container);\n      border-bottom-left-radius: var(--sys-shape-corner-medium-small);\n      border-bottom-right-radius: var(--sys-shape-corner-medium-small);\n    }\n\n    &[open] {\n      summary {\n        border-radius: 0;\n        border-top-left-radius: var(--sys-shape-corner-medium-small);\n        border-top-right-radius: var(--sys-shape-corner-medium-small);\n\n        devtools-icon {\n          transform: rotate(0deg);\n        }\n      }\n    }\n  }\n}\n", U = /* @__PURE__ */ e({ CombinedDiffView: () => Y }), W = 1e3, { html: G, Directives: { classMap: K } } = u, q = {
	copied: "Copied to clipboard",
	copyFile: "Copy file {PH1} to clipboard"
}, ce = i("panels/changes/CombinedDiffView.ts", q), J = r.bind(void 0, ce);
function le(e) {
	let { fileName: t, fileUrl: n, mimeType: r, icon: i, diff: a, copied: s, selectedFileUrl: c, onCopy: l, onFileNameClick: u } = e;
	return G`
    <details open class=${K({ selected: c === n })}>
      <summary>
        <div class="summary-left">
          <devtools-icon class="drop-down-icon" name="arrow-drop-down"></devtools-icon>
          ${i}
          <button class="file-name-link" jslog=${g("jump-to-file")} @click=${() => u(n)}>${t}</button>
        </div>
        <div class="summary-right">
          <devtools-button
            .title=${J(q.copyFile, { PH1: t })}
            .size=${f.SMALL}
            .iconName=${"copy"}
            .jslogContext=${"combined-diff-view.copy"}
            .variant=${o.ICON}
            @click=${() => l(n)}
          ></devtools-button>
          ${s ? G`<span class="copied">${J(q.copied)}</span>` : ee}
        </div>
      </summary>
      <div class="diff-view-container">
        <devtools-diff-view
          .data=${{
		diff: a,
		mimeType: r
	}}>
        </devtools-diff-view>
      </div>
    </details>
  `;
}
var ue = (e, t, n) => {
	s(G`
      <div class="combined-diff-view">
        ${e.singleDiffViewInputs.map((e) => le(e))}
      </div>
    `, n);
}, Y = class extends _ {
	ignoredUrls = [];
	#e;
	#t;
	#n = [];
	#r = {};
	#i;
	#a = {};
	constructor(e, t = ue) {
		super(e), this.registerRequiredCSS(se), this.#i = t;
	}
	wasShown() {
		super.wasShown(), this.#t?.addEventListener(O.MODIFIED_STATUS_CHANGED, this.#l, this), this.#c();
	}
	willHide() {
		super.willHide(), this.#t?.removeEventListener(O.MODIFIED_STATUS_CHANGED, this.#l, this);
	}
	set workspaceDiff(e) {
		this.#t = e, this.#c();
	}
	set selectedFileUrl(e) {
		this.#e = e, this.requestUpdate(), this.updateComplete.then(() => {
			this.#a.scrollToSelectedDiff?.();
		});
	}
	async #o(e) {
		let t = this.#n.find((t) => t.url() === e);
		if (!t) return;
		let n = t.workingCopyContentData();
		n.isTextContent && (ne(n.text, J(q.copied)), this.#r[e] = !0, this.requestUpdate(), setTimeout(() => {
			delete this.#r[e], this.requestUpdate();
		}, W));
	}
	#s(e) {
		let t = this.#n.find((t) => t.url() === e);
		n(t);
	}
	async #c() {
		if (!this.#t) return;
		let e = this.#n, t = this.#t.modifiedUISourceCodes();
		e.filter((e) => !t.includes(e)).forEach((e) => this.#t?.unsubscribeFromDiffChange(e, this.requestUpdate, this)), t.filter((t) => !e.includes(t)).forEach((e) => this.#t?.subscribeToDiffChange(e, this.requestUpdate, this)), this.#n = t, this.isShowing() && this.requestUpdate();
	}
	async #l() {
		this.#t && await this.#c();
	}
	async performUpdate() {
		let e = (await Promise.all(this.#n.map(async (e) => {
			for (let t of this.ignoredUrls) if (e.url().startsWith(t)) return;
			return {
				diff: (await this.#t?.requestDiff(e))?.diff ?? [],
				uiSourceCode: e
			};
		}))).filter((e) => !!e).map(({ uiSourceCode: e, diff: t }) => {
			let n = e.fullDisplayName(), r = T.instance().fileSystem(e);
			return r && (n = [r.project().displayName(), ...D.relativePath(r)].join("/")), {
				diff: t,
				fileName: `${e.isDirty() ? "*" : ""}${n}`,
				fileUrl: e.url(),
				mimeType: e.mimeType(),
				icon: ae.getIconForSourceFile(e),
				copied: this.#r[e.url()],
				selectedFileUrl: this.#e,
				onCopy: this.#o.bind(this),
				onFileNameClick: this.#s.bind(this)
			};
		});
		this.#i({ singleDiffViewInputs: e }, this.#a, this.contentElement);
	}
}, de = /* @__PURE__ */ e({
	ChangesView: () => ge,
	DEFAULT_VIEW: () => $
}), fe = "https://developer.chrome.com/docs/devtools/changes", X = {
	noChanges: "No changes yet",
	changesViewDescription: "On this page you can track code changes made within DevTools."
}, pe = i("panels/changes/ChangesView.ts", X), Z = r.bind(void 0, pe), { render: me, html: he } = u, { widget: Q } = te, $ = (e, t, n) => {
	me(he`
      <style>${H}</style>
      <devtools-split-view direction=column>
        <div class=vbox slot="main">
          <devtools-widget
            ?hidden=${e.workspaceDiff.modifiedUISourceCodes().length > 0}
            ${Q(l, {
		header: Z(X.noChanges),
		text: Z(X.changesViewDescription),
		link: fe
	})}>
          </devtools-widget>
          <div class=diff-container role=tabpanel ?hidden=${e.workspaceDiff.modifiedUISourceCodes().length === 0}>
            ${Q(Y, {
		selectedFileUrl: e.selectedSourceCode?.url(),
		workspaceDiff: e.workspaceDiff
	})}
          </div>
        </div>
        <devtools-widget slot="sidebar" ${Q(B, { workspaceDiff: e.workspaceDiff })}
          @SelectedUISourceCodeChanged=${(t) => {
		let n = _.get(t.target);
		e.onSelect(n.selectedUISourceCode());
	}}>
        </devtools-widget>
      </devtools-split-view>`, n, { container: { attributes: { jslog: `${c("changes").track({ resize: !0 })}` } } });
}, ge = class e extends p {
	#e;
	#t = null;
	#n;
	constructor(e, t = $) {
		super(e, { useShadowDom: "pure" }), this.#e = j(), this.#n = t, this.requestUpdate();
	}
	performUpdate() {
		this.#n({
			workspaceDiff: this.#e,
			selectedSourceCode: this.#t,
			onSelect: (e) => {
				this.#t = e, this.requestUpdate();
			}
		}, {}, this.contentElement);
	}
	wasShown() {
		m.instance().setFlavor(e, this), super.wasShown(), this.requestUpdate(), this.#e.addEventListener(O.MODIFIED_STATUS_CHANGED, this.requestUpdate, this);
	}
	willHide() {
		super.willHide(), m.instance().setFlavor(e, null), this.#e.removeEventListener(O.MODIFIED_STATUS_CHANGED, this.requestUpdate, this);
	}
};
//#endregion
export { j as a, N as i, Y as n, U as r, de as t };
