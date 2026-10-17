import { n as e } from "./rolldown-runtime-DF993M8W.js";
import { H as t, K as n, i as r } from "./common-DMSVbaSb.js";
import { Bc as i, Hd as a, Jn as o, La as s, No as c, Qt as l, Uc as u, Vo as d, Zo as f, ei as p, ff as m, jd as h, jr as g, pf as _, qa as v } from "./legacy-dM_vujv7.js";
import "./data_grid-C6uthMeA.js";
import { n as y, t as b } from "./autofill_manager-BMi-l6xF.js";
import "./adorners-D4bF0Xzg.js";
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/autofill/autofillView.css.mjs
var x = "/*\n * Copyright 2023 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n@scope to (devtools-widget > *) {\n  main {\n    height: 100%;\n  }\n\n  .header {\n    display: flex;\n    border-bottom: 1px solid var(--sys-color-divider);\n    width: 100%;\n  }\n\n  .placeholder-container {\n    height: calc(100% - 29px);\n    display: flex;\n    justify-content: center;\n    align-items: center;\n  }\n\n  .address {\n    padding: 10px;\n    margin-right: auto;\n  }\n\n  .filled-fields-grid {\n    border-top: 1px solid var(--sys-color-divider);\n    box-sizing: border-box;\n  }\n\n  .content-container {\n    display: flex;\n    flex-flow: column;\n    height: 100%;\n  }\n\n  .grid-wrapper {\n    flex-grow: 1;\n  }\n\n  devtools-data-grid {\n    border: none;\n    height: 100%;\n  }\n\n  .checkbox-label {\n    display: flex;\n    align-items: center;\n  }\n\n  .right-to-left {\n    border-bottom: 1px solid var(--sys-color-divider);\n    display: flex;\n    flex-flow: row-reverse wrap;\n    justify-content: flex-end;\n  }\n\n  .label-container {\n    padding: 5px;\n    display: flex;\n    align-items: flex-start;\n  }\n\n  .top-left-corner {\n    border-bottom: 1px solid var(--sys-color-divider);\n    display: flex;\n    padding: 5px;\n    gap: 10px;\n  }\n\n  .matches-filled-field {\n    background-color: var(--sys-color-tonal-container);\n  }\n\n  .highlighted {\n    background-color: var(--sys-color-state-focus-select);\n  }\n\n  .link {\n    color: var(--sys-color-primary);\n    text-decoration-line: underline;\n  }\n\n  .feedback {\n    margin: auto 5px auto auto;\n    font-size: var(--sys-typescale-body4-size);\n  }\n}\n", S = /* @__PURE__ */ e({
	AutofillView: () => P,
	i18nString: () => M
}), { html: C, render: w, Directives: { styleMap: T } } = c, { FillingStrategy: E } = a, { bindToSetting: D } = l, O = {
	noAutofill: "No autofill detected",
	toStartDebugging: "To start debugging autofill, use Chrome's autofill menu to fill an address form.",
	value: "Value",
	predictedAutofillValue: "Predicted autofill value",
	formField: "Form field",
	autocompleteAttribute: "Autocomplete attribute",
	attr: "attr",
	inferredByHeuristics: "Inferred by heuristics",
	heur: "heur",
	autoShow: "Automatically open this panel",
	showTestAddressesInAutofillMenu: "Show test addresses in autofill menu",
	autoShowTooltip: "Open the autofill panel automatically when an autofill activity is detected.",
	addressPreview: "Address preview",
	formInspector: "Form inspector",
	learnMore: "Learn more",
	sendFeedback: "Send feedback"
}, k = "https://goo.gle/devtools-autofill-panel", A = "https://crbug.com/329106326", j = n("panels/autofill/AutofillView.ts", O), M = t.bind(void 0, j), N = (e, t, n) => {
	let r = () => {
		let t = (t, n) => {
			let r = e.address.substring(t, n).split("\n"), i = r.map((e, t) => t === r.length - 1 ? e : C`${e}<br>`), a = e.matches.some((e) => e.startIndex <= t && e.endIndex > t);
			return a ? C`
        <span class=${d({
				"matches-filled-field": a,
				highlighted: e.highlightedMatches.some((e) => e.startIndex <= t && e.endIndex > t)
			})}
              jslog=${s("matched-address-item").track({
				hover: !0,
				resize: !0
			})}
              @mouseenter=${() => e.onHighlightMatchesInAddress(t)}
              @mouseleave=${e.onClearHighlightedMatches}>
          ${i}
        </span>` : C`<span>${i}</span>`;
		}, n = [], r = /* @__PURE__ */ new Set([0, e.address.length]);
		for (let t of e.matches) r.add(t.startIndex), r.add(t.endIndex);
		let i = Array.from(r).sort((e, t) => e - t);
		for (let e = 0; e < i.length - 1; e++) n.push(t(i[e], i[e + 1]));
		return C`
      <div class="address">
        ${n}
      </div>
    `;
	}, i = () => {
		let t = new Set(e.highlightedMatches.map((e) => e.filledFieldIndex));
		return C`
      <div class="grid-wrapper" role="region" aria-label=${M(O.formInspector)}>
        <devtools-data-grid striped
                            class="filled-fields-grid">
          <table>
            <tr>
              <th id="name" weight="50" sortable>${M(O.formField)}</th>
              <th id="autofill-type" weight="50" sortable>${M(O.predictedAutofillValue)}</th>
              <th id="value" weight="50" sortable>${M(O.value)}</th>
            </tr>
            ${e.filledFields.map((n, r) => C`
                <tr style=${T({
			"font-family": "var(--monospace-font-family)",
			"font-size": "var(--monospace-font-size)",
			"background-color": t.has(r) ? "var(--sys-color-state-hover-on-subtle)" : null
		})}
                    @mouseenter=${() => e.onHighlightMatchesInFilledFiels(r)}
                    @mouseleave=${e.onClearHighlightedMatches}>
                  <td>${n.name || `#${n.id}`} (${n.htmlType})</td>
                  <td>
                      ${n.autofillType}
                      ${n.fillingStrategy === E.AutocompleteAttribute ? C`<devtools-adorner .name=${n.fillingStrategy} title=${M(O.autocompleteAttribute)}>
                              <span>${M(O.attr)}</span>
                            </devtools-adorner>` : n.fillingStrategy === E.AutofillInferred ? C`<devtools-adorner .name=${n.fillingStrategy} title=${M(O.inferredByHeuristics)}>
                              <span>${M(O.heur)}</span>
                            </devtools-adorner>` : f}
                  </td>
                  <td>"${n.value}"</td>
                </tr>`)}
          </table>
        </devtools-data-grid>
      </div>
    `;
	};
	if (!e.address && !e.filledFields.length) {
		w(C`
        <style>${x}</style>
        <style>${o}</style>
        <main>
          <div class="top-left-corner">
            <devtools-checkbox
                ${D(e.showTestAddressesInAutofillMenuSetting)}
                title=${M(O.showTestAddressesInAutofillMenu)}>
              ${M(O.showTestAddressesInAutofillMenu)}
            </devtools-checkbox>
            <devtools-checkbox
                ${D(e.autoOpenViewSetting)}
                title=${M(O.autoShowTooltip)}>
              ${M(O.autoShow)}
            </devtools-checkbox>
            <devtools-link href=${A} class="feedback link" jslogcontext="feedback">${M(O.sendFeedback)}</devtools-link>
          </div>
          <div class="placeholder-container" jslog=${v("autofill-empty")}>
            <div class="empty-state">
              <span class="empty-state-header">${M(O.noAutofill)}</span>
              <div class="empty-state-description">
                <span>${M(O.toStartDebugging)}</span>
                <devtools-link href=${k} class="link" jslogcontext="learn-more">${M(O.learnMore)}</devtools-link>
              </div>
            </div>
          </div>
        </main>
      `, n);
		return;
	}
	w(C`
      <style>${x}</style>
      <style>${o}</style>
      <main>
        <div class="content-container" jslog=${v("autofill")}>
          <div class="right-to-left" role="region" aria-label=${M(O.addressPreview)}>
            <div class="header">
              <div class="label-container">
                <devtools-checkbox
                    ${D(e.showTestAddressesInAutofillMenuSetting)}
                    title=${M(O.showTestAddressesInAutofillMenu)}>
                  ${M(O.showTestAddressesInAutofillMenu)}
                </devtools-checkbox>
              </div>
              <div class="label-container">
                <devtools-checkbox
                    ${D(e.autoOpenViewSetting)}
                    title=${M(O.autoShowTooltip)}>
                  ${M(O.autoShow)}
                </devtools-checkbox>
              </div>
              <devtools-link href=${A} class="feedback link" jslogcontext="feedback">${M(O.sendFeedback)}</devtools-link>
            </div>
            ${r()}
          </div>
          ${i()}
        </div>
      </main>
    `, n);
}, P = class extends p {
	#e;
	#t;
	#n = r.instance().createSetting("auto-open-autofill-view-on-event", !0);
	#r;
	#i = "";
	#a = [];
	#o = [];
	#s = [];
	constructor(e = b.instance(), t = N) {
		super({ useShadowDom: !0 }), this.#t = e, this.#e = t, this.#r = r.instance().createSetting("show-test-addresses-in-autofill-menu-on-event", !1);
	}
	wasShown() {
		super.wasShown();
		let e = this.#t.getLastFilledAddressForm();
		e && ({address: this.#i, filledFields: this.#a, matches: this.#o} = e), this.#t.addEventListener(y.ADDRESS_FORM_FILLED, this.#l, this), h.instance().addModelListener(u, i.PrimaryPageChanged, this.#c, this), this.requestUpdate();
	}
	willHide() {
		h.instance().removeModelListener(u, i.PrimaryPageChanged, this.#c, this), this.#t.removeEventListener(y.ADDRESS_FORM_FILLED, this.#l, this), super.willHide();
	}
	#c() {
		this.#i = "", this.#a = [], this.#o = [], this.#s = [], this.requestUpdate();
	}
	async #l({ data: e }) {
		this.#n.get() ? (await g.instance().showView("autofill-view"), m.actionTaken(_.AutofillReceivedAndTabAutoOpened)) : m.actionTaken(_.AutofillReceived), this.#i = e.address, this.#a = e.filledFields, this.#o = e.matches, this.#s = [], this.requestUpdate();
	}
	performUpdate() {
		let e = {
			autoOpenViewSetting: this.#n,
			showTestAddressesInAutofillMenuSetting: this.#r,
			address: this.#i,
			filledFields: this.#a,
			matches: this.#o,
			highlightedMatches: this.#s,
			onHighlightMatchesInAddress: (e) => {
				this.#s = this.#o.filter((t) => t.startIndex <= e && t.endIndex > e), this.requestUpdate();
			},
			onHighlightMatchesInFilledFiels: (e) => {
				this.#t.highlightFilledField(this.#a[e]), this.#s = this.#o.filter((t) => t.filledFieldIndex === e), this.requestUpdate();
			},
			onClearHighlightedMatches: () => {
				this.#t.clearHighlightedFilledFields(), this.#s = [], this.requestUpdate();
			}
		};
		this.#e(e, void 0, this.contentElement);
	}
};
//#endregion
export { S as AutofillView };
