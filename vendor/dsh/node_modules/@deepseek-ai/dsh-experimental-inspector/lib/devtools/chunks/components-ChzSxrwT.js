import { H as e, K as t, X as n, i as r } from "./common-DMSVbaSb.js";
import { Bd as i, Co as a, Da as o, Fo as s, Io as ee, Ji as te, Jn as c, La as l, Ma as ne, No as u, Po as d, So as f, Vo as p, Zo as m, fo as re, fu as ie, ha as h, ll as g, vn as ae, wo as oe } from "./legacy-dM_vujv7.js";
import "./platform-D4TUCh2P.js";
import { F as se } from "./StringUtilities-CMDxNrEc.js";
import { t as ce } from "./checkbox.css-CtBDUlMG.js";
import { n as le } from "./helpers-CsoC22BH.js";
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/elements/components/accessibilityTreeNode.css.mjs
var ue = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.container {\n  width: 100%;\n  display: inline-block;\n}\n\n.container:hover {\n  background-color: var(--sys-color-state-hover-on-subtle);\n}\n\nspan {\n  color: var(--sys-color-token-meta);\n  font-family: var(--monospace-font-family);\n  font-size: var(--monospace-font-size);\n}\n\n.role-value {\n  color: var(--sys-color-token-tag);\n}\n\n.attribute-name {\n  color: var(--sys-color-token-attribute);\n}\n\n.attribute-value {\n  color: var(--sys-color-token-attribute-value);\n}\n", de = { ignored: "Ignored" }, fe = t("panels/elements/components/AccessibilityTreeNode.ts", de), pe = e.bind(void 0, fe);
function me(e) {
	let t = 1e4;
	return e.length > t ? se(e, t) : e;
}
function he(e) {
	switch (e) {
		case i.AXValueType.Boolean:
		case i.AXValueType.BooleanOrUndefined:
		case i.AXValueType.String:
		case i.AXValueType.Number: return !0;
		default: return !1;
	}
}
var ge = class extends HTMLElement {
	#e = ae(this, { cssFile: ue });
	#t = !0;
	#n = "";
	#r = "";
	#i = [];
	#a = "";
	set data(e) {
		this.#t = e.ignored, this.#n = e.name, this.#r = e.role, this.#i = e.properties, this.#a = e.id, this.#o();
	}
	async #o() {
		let e = d`<span class='role-value'>${me(this.#r)}</span>`, t = d`"<span class='attribute-value'>${this.#n}</span>"`, n = this.#i.map(({ name: e, value: t }) => he(t.type) ? d` <span class='attribute-name'>${e}</span>:&nbsp;<span class='attribute-value'>${t.value}</span>` : m), r = this.#t ? d`<span>${pe(de.ignored)}</span>` : d`${e}&nbsp;${t}${n}`;
		await oe(`Accessibility node ${this.#a} render`, () => {
			s(d`<div class='container'>${r}</div>`, this.#e, { host: this });
		});
	}
};
customElements.define("devtools-accessibility-tree-node", ge);
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/elements/components/computedStyleProperty.css.mjs
var _e = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  position: relative;\n  overflow: hidden;\n  flex: auto;\n  text-overflow: ellipsis;\n}\n\n.computed-style-property {\n  --goto-size: 16px;\n\n  font-family: var(--monospace-font-family);\n  font-size: var(--monospace-font-size);\n  min-height: 16px;\n  box-sizing: border-box;\n  padding-top: 2px;\n  white-space: var(--override-computed-style-property-white-space, nowrap);\n  user-select: text;\n}\n\n.computed-style-property:hover {\n  background-color: var(--sys-color-state-hover-on-subtle);\n  cursor: text;\n}\n\n.computed-style-property.inherited {\n  opacity: 75%;\n  font-style: italic;\n}\n\n.property-name,\n.property-value {\n  display: contents;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.property-name {\n  width: 16em;\n  max-width: 52%;\n  margin-right: calc(var(--goto-size) / 2);\n  display: inline-block;\n  vertical-align: text-top;\n  color: var(--webkit-css-property-color, var(--sys-color-token-property-special)); /* stylelint-disable-line plugin/use_theme_colors */ /* See: crbug.com/1152736 for color variable migration. */\n}\n\n.property-value {\n  margin-left: 2em;\n}\n\n.goto {\n  display: none;\n  cursor: pointer;\n  position: absolute;\n  width: var(--goto-size);\n  height: var(--goto-size);\n  margin: -1px 0 0 calc(-1 * var(--goto-size));\n  mask: var(--image-file-goto-filled) center / contain no-repeat;\n  background-color: var(--sys-color-primary-bright);\n}\n\n.computed-style-property:hover .goto {\n  display: inline-block;\n}\n\n.hidden {\n  display: none;\n}\n/* narrowed styles */\n:host-context(.computed-narrow) .computed-style-property {\n  white-space: normal;\n\n  & .goto {\n    display: none;\n    margin-left: 0;\n  }\n}\n\n:host-context(.computed-narrow) .property-name,\n:host-context(.computed-narrow) .property-value {\n  display: inline-block;\n  width: 100%;\n  max-width: 100%;\n  margin-left: 0;\n  white-space: nowrap;\n}\n\n:host-context(.computed-narrow) .computed-style-property:not(.inherited):hover {\n  & .property-value {\n    margin-left: var(--goto-size);\n  }\n\n  & .goto {\n    display: inline-block;\n  }\n}\n/* high-contrast styles */\n@media (forced-colors: active) {\n  .computed-style-property.inherited {\n    opacity: 100%;\n  }\n\n  .computed-style-property:hover {\n    forced-color-adjust: none;\n    background-color: Highlight;\n  }\n\n  .computed-style-property:hover * {\n    color: HighlightText;\n  }\n\n  .goto {\n    background-color: HighlightText;\n  }\n}\n", ve = class e extends Event {
	static eventName = "onnavigatetosource";
	constructor() {
		super(e.eventName, {
			bubbles: !0,
			composed: !0
		});
	}
}, ye = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t = !1;
	#n = !1;
	connectedCallback() {
		this.#i();
	}
	set inherited(e) {
		e !== this.#t && (this.#t = e, this.#i());
	}
	set traceable(e) {
		e !== this.#n && (this.#n = e, this.#i());
	}
	#r() {
		this.dispatchEvent(new ve());
	}
	#i() {
		s(d`
      <style>${_e}</style>
      <div class="computed-style-property ${this.#t ? "inherited" : ""}">
        <div class="property-name">
          <slot name="name"></slot>
        </div>
        <span class="hidden" aria-hidden="false">: </span>
        ${this.#n ? d`<span class="goto" @click=${this.#r} jslog=${h("elements.jump-to-style").track({ click: !0 })}></span>` : null}
        <div class="property-value">
          <slot name="value"></slot>
        </div>
        <span class="hidden" aria-hidden="false">;</span>
      </div>
    `, this.#e, { host: this });
	}
};
customElements.define("devtools-computed-style-property", ye);
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/elements/components/computedStyleTrace.css.mjs
var be = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  text-overflow: ellipsis;\n  overflow: hidden;\n  flex-grow: 1;\n}\n\n.computed-style-trace {\n  margin-left: 16px;\n  font-family: var(--monospace-font-family);\n  font-size: var(--monospace-font-size);\n}\n\n.computed-style-trace:hover {\n  background-color: var(--sys-color-state-hover-on-subtle);\n  cursor: text;\n}\n\n.goto {\n  /* TODO: reuse with ComputedStyleProperty */\n  --size: 16px;\n\n  display: none;\n  cursor: pointer;\n  position: absolute;\n  width: var(--size);\n  height: var(--size);\n  margin: -1px 0 0 calc(-1 * var(--size));\n  mask: var(--image-file-goto-filled) center / contain no-repeat;\n  background-color: var(--sys-color-primary-bright);\n}\n\n.computed-style-trace:hover .goto {\n  display: inline-block;\n}\n\n.devtools-link {\n  color: var(--sys-color-on-surface);\n  text-decoration-color: var(--sys-color-token-subtle);\n  text-decoration-line: underline;\n  cursor: pointer;\n}\n\n.trace-value {\n  margin-left: 16px;\n}\n\n.computed-style-trace.inactive slot[name=\"trace-value\"] {\n  text-decoration: line-through;\n}\n\n.trace-selector {\n  --override-trace-selector-color: var(--sys-color-token-subtle);\n\n  color: var(--override-trace-selector-color);\n  padding-left: 2em;\n}\n\n.trace-link {\n  user-select: none;\n  float: right;\n  padding-left: 1em;\n  position: relative;\n  z-index: 1;\n}\n/* high-contrast styles */\n@media (forced-colors: active) {\n  .computed-style-trace:hover {\n    forced-color-adjust: none;\n    background-color: Highlight;\n  }\n\n  .goto {\n    background-color: Highlight;\n  }\n\n  .computed-style-trace:hover * {\n    color: HighlightText;\n  }\n\n  .computed-style-trace:hover .trace-selector {\n    --override-trace-selector-color: HighlightText;\n  }\n}\n", xe = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t = "";
	#n = !1;
	#r = () => {};
	#i;
	connectedCallback() {
		this.#a();
	}
	set data(e) {
		this.#t = e.selector, this.#n = e.active, this.#r = e.onNavigateToSource, this.#i = e.ruleOriginNode, this.#a();
	}
	#a() {
		s(d`
      <style>${te}</style>
      <style>${c}</style>
      <style>${be}</style>
      <div class="computed-style-trace ${this.#n ? "active" : "inactive"}">
        <span class="goto" @click=${this.#r}></span>
        <slot name="trace-value" @click=${this.#r}></slot>
        <span class="trace-selector">${this.#t}</span>
        <span class="trace-link">${this.#i}</span>
      </div>
    `, this.#e, { host: this });
	}
};
customElements.define("devtools-computed-style-trace", xe);
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/elements/components/cssHintDetailsView.css.mjs
var Se = "/*\n * Copyright 2022 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.hint-popup-wrapper {\n  max-width: 232px;\n}\n\ncode {\n  font-weight: bold;\n  font-family: inherit;\n}\n\n.hint-popup-possible-fix {\n  margin-top: 8px;\n}\n\n.clickable {\n  color: var(--sys-color-primary);\n}\n\n.underlined {\n  text-decoration: underline;\n}\n\n.unbreakable-text {\n  white-space: nowrap;\n}\n\n.footer {\n  margin-top: var(--sys-size-5);\n}\n", Ce = { learnMore: "Learn More" }, we = t("panels/elements/components/CSSHintDetailsView.ts", Ce), Te = e.bind(void 0, we), Ee = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t;
	constructor(e) {
		super(), this.#t = e, this.#n();
	}
	#n() {
		let e = this.#t.getLearnMoreLink();
		s(d`
        <style>${Se}</style>
        <div class="hint-popup-wrapper">
          <div class="hint-popup-reason">
            ${this.#t.getMessage()}
          </div>
          ${this.#t.getPossibleFixMessage() ? d`
              <div class="hint-popup-possible-fix">
                  ${this.#t.getPossibleFixMessage()}
              </div>
          ` : ""}
          ${e ? d`
                      <div class="footer">
                        <devtools-link id="learn-more" href=${e} class="clickable underlined unbreakable-text">
                            ${Te(Ce.learnMore)}
                        </devtools-link>
                      </div>
                  ` : ""}
        </div>
      `, this.#e, { host: this });
	}
};
customElements.define("devtools-css-hint-details-view", Ee);
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/elements/components/cssPropertyDocsView.css.mjs
var De = "/*\n * Copyright 2023 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.docs-popup-wrapper {\n  max-width: 420px;\n  font-size: 12px;\n  line-height: 1.4;\n}\n\n.docs-popup-section {\n  margin-top: 8px;\n}\n\n.clickable {\n  color: var(--sys-color-primary);\n}\n\n.underlined {\n  text-decoration: underline;\n}\n\n.unbreakable-text {\n  white-space: nowrap;\n}\n\n.footer {\n  display: flex;\n  justify-content: space-between;\n}\n\n#baseline {\n  display: inline-flex;\n  align-items: flex-start;\n  gap: 4px;\n}\n\n#baseline-icon {\n  width: 18px;\n  height: 18px;\n}\n", _ = {
	learnMore: "Learn more",
	dontShow: "Don't show",
	limitedAvailability: "Limited availability across major browsers",
	limitedAvailabilityInBrowsers: "Limited availability across major browsers (not fully implemented in {PH1})",
	browserOnPlatform: "{PH1} on {PH2}",
	newlyAvailableSince: "Newly available across major browsers (`Baseline` since {PH1})",
	widelyAvailableSince: "Widely available across major browsers (`Baseline` since {PH1})",
	unknownDate: "an unknown date"
}, Oe = t("panels/elements/components/CSSPropertyDocsView.ts", _), v = e.bind(void 0, Oe), ke = "../../../Images/baseline-high-availability.svg", Ae = "../../../Images/baseline-low-availability.svg", je = "../../../Images/baseline-limited-availability.svg", Me = (e) => {
	let t;
	switch (e.status) {
		case "high":
			t = ke;
			break;
		case "low":
			t = Ae;
			break;
		default: t = je;
	}
	return new URL(t, new URL("panels/elements/components/CSSPropertyDocsView.js", typeof document < "u" ? document.baseURI : new URL("../../", self.location.href).href).href).toString();
}, Ne = /* @__PURE__ */ new Set([
	"C",
	"CA",
	"E",
	"FF",
	"FFA",
	"S",
	"SM"
]), Pe = /* @__PURE__ */ new Map([
	["C", {
		name: "Chrome",
		platform: "desktop"
	}],
	["CA", {
		name: "Chrome",
		platform: "Android"
	}],
	["E", {
		name: "Edge",
		platform: "desktop"
	}],
	["FF", {
		name: "Firefox",
		platform: "desktop"
	}],
	["FFA", {
		name: "Firefox",
		platform: "Android"
	}],
	["S", {
		name: "Safari",
		platform: "macOS"
	}],
	["SM", {
		name: "Safari",
		platform: "iOS"
	}]
]);
function Fe(e) {
	return new Intl.ListFormat(n.instance().locale, {
		style: "long",
		type: "disjunction"
	}).format(e.entries().map(([e, t]) => t.length !== 1 || t[0] === "desktop" ? e : v(_.browserOnPlatform, {
		PH1: e,
		PH2: t[0]
	})));
}
var y = (e) => {
	if (!e) return v(_.unknownDate);
	let t = new Date(e);
	return new Intl.DateTimeFormat(n.instance().locale, {
		month: "long",
		year: "numeric"
	}).format(t);
}, Ie = (e) => {
	let t = e.map((e) => e.replace(/\d*$/, "")), n = Ne.difference(new Set(t)), r = /* @__PURE__ */ new Map();
	for (let e of n) {
		let t = Pe.get(e);
		if (t) {
			let { name: e, platform: n } = t;
			r.set(e, [...r.get(e) ?? [], n]);
		}
	}
	return r;
}, Le = (e, t) => {
	if (e.status === "false") {
		let e = t && Ie(t);
		return e ? v(_.limitedAvailabilityInBrowsers, { PH1: Fe(e) }) : v(_.limitedAvailability);
	}
	return e.status === "low" ? v(_.newlyAvailableSince, { PH1: y(e.baseline_low_date) }) : v(_.widelyAvailableSince, { PH1: y(e.baseline_high_date) });
}, b = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t;
	constructor(e) {
		super(), this.#t = e, this.#r();
	}
	#n(e) {
		let t = !e.target.checked;
		r.instance().moduleSetting("show-css-property-documentation-on-hover").set(t);
	}
	#r() {
		let { description: e, references: t, baseline: n, browsers: r } = this.#t, i = t?.[0].url;
		s(d`
      <style>${De}</style>
      <div class="docs-popup-wrapper">
        ${e ? d`
          <div id="description">
            ${e}
          </div>
        ` : m}
        ${n ? d`
          <div id="baseline" class="docs-popup-section">
            <img
              id="baseline-icon"
              src=${Me(n)}
              role="presentation"
            >
            <span>
              ${Le(n, r)}
            </span>
          </div>
        ` : m}
        ${i ? d`
          <div class="docs-popup-section footer">
            <devtools-link
              id="learn-more"
              href=${i}
              class="clickable underlined unbreakable-text"
            >
              ${v(_.learnMore)}
            </devtools-link>
            <devtools-checkbox
              @change=${this.#n}
              jslog=${re("css-property-doc").track({ change: !0 })}>
              ${v(_.dontShow)}
            </devtools-checkbox>
          </div>
        ` : m}
      </div>
    `, this.#e, { host: this });
	}
};
customElements.define("devtools-css-property-docs-view", b);
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/elements/components/CSSPropertyIconResolver.ts
var Re = /* @__PURE__ */ new Set([
	"tb",
	"tb-rl",
	"vertical-lr",
	"vertical-rl"
]);
function x(e) {
	if (e === "left-to-right") return "right-to-left";
	if (e === "right-to-left") return "left-to-right";
	if (e === "top-to-bottom") return "bottom-to-top";
	if (e === "bottom-to-top") return "top-to-bottom";
	throw Error("Unknown PhysicalFlexDirection");
}
function S(e) {
	return {
		...e,
		"row-reverse": x(e.row),
		"column-reverse": x(e.column)
	};
}
function C(e) {
	let t = e.get("direction") === "rtl", n = e.get("writing-mode");
	return n && Re.has(n) ? S({
		row: t ? "bottom-to-top" : "top-to-bottom",
		column: n === "vertical-lr" ? "left-to-right" : "right-to-left"
	}) : S({
		row: t ? "right-to-left" : "left-to-right",
		column: "top-to-bottom"
	});
}
function ze(e) {
	let t = !0, n = !1, r = -90;
	return e === "right-to-left" ? (r = 90, n = !1, t = !1) : e === "top-to-bottom" ? (r = 0, t = !1, n = !1) : e === "bottom-to-top" && (r = 0, t = !1, n = !0), {
		iconName: "flex-direction",
		rotate: r,
		scaleX: t ? -1 : 1,
		scaleY: n ? -1 : 1
	};
}
function Be(e) {
	let t = !0, n = !1, r = -90;
	return e === "right-to-left" ? (r = 90, n = !1, t = !1) : e === "top-to-bottom" ? (r = 0, t = !1, n = !1) : e === "bottom-to-top" && (r = 0, t = !1, n = !0), {
		iconName: "grid-direction",
		rotate: r,
		scaleX: t ? -1 : 1,
		scaleY: n ? -1 : 1
	};
}
function w(e, t) {
	return {
		iconName: e,
		rotate: t === "right-to-left" ? 90 : t === "left-to-right" ? -90 : 0,
		scaleX: 1,
		scaleY: 1
	};
}
function T(e, t) {
	return {
		iconName: e,
		rotate: t === "top-to-bottom" ? 90 : t === "bottom-to-top" ? -90 : 0,
		scaleX: t === "right-to-left" ? -1 : 1,
		scaleY: 1
	};
}
function Ve(e, t) {
	return {
		iconName: e,
		rotate: t === "top-to-bottom" ? 90 : t === "bottom-to-top" ? -90 : 0,
		scaleX: t === "right-to-left" ? -1 : 1,
		scaleY: 1
	};
}
function E(e, t) {
	return {
		iconName: e,
		rotate: t === "right-to-left" ? 90 : t === "left-to-right" ? -90 : 0,
		scaleX: 1,
		scaleY: 1
	};
}
function D(e) {
	function t(t) {
		return ze(C(t)[e]);
	}
	return t;
}
function O(e) {
	function t(t) {
		return Be(C(t)[e]);
	}
	return t;
}
function k(e) {
	function t(t) {
		let n = C(t), r = /* @__PURE__ */ new Map([
			["column", n.row],
			["row", n.column],
			["column-reverse", n.row],
			["row-reverse", n.column]
		]), i = t.get("flex-direction") || "row", a = r.get(i);
		if (!a) throw Error("Unknown direction for flex-align icon");
		return w(e, a);
	}
	return t;
}
function A(e) {
	function t(t) {
		let n = C(t);
		return w(e, (t.get("grid-auto-flow") || "row").includes("column") ? n.row : n.column);
	}
	return t;
}
function j(e) {
	function t(t) {
		return T(e, C(t)[t.get("flex-direction") || "row"]);
	}
	return t;
}
function M(e) {
	function t(t) {
		let n = C(t);
		return T(e, (t.get("grid-auto-flow") || "row").includes("column") ? n.column : n.row);
	}
	return t;
}
function N(e) {
	function t(t) {
		let n = C(t);
		return Ve(e, (t.get("grid-auto-flow") || "row").includes("column") ? n.column : n.row);
	}
	return t;
}
function P(e) {
	function t(t) {
		let n = C(t), r = /* @__PURE__ */ new Map([
			["column", n.row],
			["row", n.column],
			["column-reverse", n.row],
			["row-reverse", n.column]
		]), i = t.get("flex-direction") || "row", a = r.get(i);
		if (!a) throw Error("Unknown direction for flex-align icon");
		return E(e, a);
	}
	return t;
}
function F(e) {
	function t(t) {
		let n = C(t);
		return E(e, (t.get("grid-auto-flow") || "row").includes("column") ? n.row : n.column);
	}
	return t;
}
function I() {
	return {
		iconName: "align-items-baseline",
		rotate: 0,
		scaleX: 1,
		scaleY: 1
	};
}
function L(e) {
	function t(t) {
		return P(e)(t);
	}
	return t;
}
function R(e) {
	function t(t) {
		return F(e)(t);
	}
	return t;
}
function He(e, t) {
	return {
		iconName: e,
		rotate: t === "bottom-to-top" || t === "top-to-bottom" ? 90 : 0,
		scaleX: 1,
		scaleY: 1
	};
}
function z(e) {
	function t(t) {
		return He(e, C(t)[t.get("flex-direction") || "row"]);
	}
	return t;
}
var Ue = /* @__PURE__ */ new Map([
	["flex-direction: row", D("row")],
	["flex-direction: column", D("column")],
	["flex-direction: column-reverse", D("column-reverse")],
	["flex-direction: row-reverse", D("row-reverse")],
	["flex-direction: initial", D("row")],
	["flex-direction: unset", D("row")],
	["flex-direction: revert", D("row")],
	["align-content: center", k("align-content-center")],
	["align-content: space-around", k("align-content-space-around")],
	["align-content: space-between", k("align-content-space-between")],
	["align-content: stretch", k("align-content-stretch")],
	["align-content: space-evenly", k("align-content-space-evenly")],
	["align-content: flex-end", k("align-content-end")],
	["align-content: flex-start", k("align-content-start")],
	["align-content: start", k("align-content-start")],
	["align-content: end", k("align-content-end")],
	["align-content: normal", k("align-content-stretch")],
	["align-content: revert", k("align-content-stretch")],
	["align-content: unset", k("align-content-stretch")],
	["align-content: initial", k("align-content-stretch")],
	["justify-content: center", j("justify-content-center")],
	["justify-content: space-around", j("justify-content-space-around")],
	["justify-content: space-between", j("justify-content-space-between")],
	["justify-content: space-evenly", j("justify-content-space-evenly")],
	["justify-content: flex-end", j("justify-content-end")],
	["justify-content: flex-start", j("justify-content-start")],
	["justify-content: end", j("justify-content-end")],
	["justify-content: start", j("justify-content-start")],
	["justify-content: right", j("justify-content-end")],
	["justify-content: left", j("justify-content-start")],
	["align-items: stretch", P("align-items-stretch")],
	["align-items: flex-end", P("align-items-end")],
	["align-items: flex-start", P("align-items-start")],
	["align-items: end", P("align-items-end")],
	["align-items: start", P("align-items-start")],
	["align-items: self-end", P("align-items-end")],
	["align-items: self-start", P("align-items-start")],
	["align-items: center", P("align-items-center")],
	["align-items: baseline", I],
	["align-content: baseline", I],
	["flex-wrap: wrap", z("flex-wrap")],
	["flex-wrap: nowrap", z("flex-no-wrap")]
]), We = /* @__PURE__ */ new Map([
	["align-self: baseline", I],
	["align-self: center", L("align-self-center")],
	["align-self: flex-start", L("align-self-start")],
	["align-self: flex-end", L("align-self-end")],
	["align-self: start", R("align-self-start")],
	["align-self: end", R("align-self-end")],
	["align-self: self-start", R("align-self-start")],
	["align-self: self-end", R("align-self-end")],
	["align-self: stretch", L("align-self-stretch")]
]), Ge = /* @__PURE__ */ new Map([
	["grid-auto-flow: row", O("row")],
	["grid-auto-flow: column", O("column")],
	["align-content: center", A("align-content-center")],
	["align-content: space-around", A("align-content-space-around")],
	["align-content: space-between", A("align-content-space-between")],
	["align-content: stretch", A("align-content-stretch")],
	["align-content: space-evenly", A("align-content-space-evenly")],
	["align-content: end", A("align-content-end")],
	["align-content: start", A("align-content-start")],
	["align-content: baseline", I],
	["justify-content: center", M("justify-content-center")],
	["justify-content: space-around", M("justify-content-space-around")],
	["justify-content: space-between", M("justify-content-space-between")],
	["justify-content: space-evenly", M("justify-content-space-evenly")],
	["justify-content: end", M("justify-content-end")],
	["justify-content: start", M("justify-content-start")],
	["justify-content: right", M("justify-content-end")],
	["justify-content: left", M("justify-content-start")],
	["justify-content: stretch", M("justify-content-stretch")],
	["align-items: stretch", F("align-items-stretch")],
	["align-items: end", F("align-items-end")],
	["align-items: start", F("align-items-start")],
	["align-items: self-end", F("align-items-end")],
	["align-items: self-start", F("align-items-start")],
	["align-items: center", F("align-items-center")],
	["align-items: baseline", I],
	["justify-items: center", N("justify-items-center")],
	["justify-items: stretch", N("justify-items-stretch")],
	["justify-items: end", N("justify-items-end")],
	["justify-items: start", N("justify-items-start")],
	["justify-items: self-end", N("justify-items-end")],
	["justify-items: self-start", N("justify-items-start")],
	["justify-items: right", N("justify-items-end")],
	["justify-items: left", N("justify-items-start")],
	["justify-items: baseline", I]
]), Ke = /* @__PURE__ */ new Map([
	["align-self: baseline", I],
	["align-self: center", R("align-self-center")],
	["align-self: start", R("align-self-start")],
	["align-self: end", R("align-self-end")],
	["align-self: self-start", R("align-self-start")],
	["align-self: self-end", R("align-self-end")],
	["align-self: stretch", R("align-self-stretch")]
]), qe = (e) => {
	let t = e?.get("display");
	return t === "flex" || t === "inline-flex";
}, Je = (e) => {
	let t = e?.get("display");
	return t === "grid" || t === "inline-grid";
};
function Ye(e, t, n) {
	if (qe(t)) {
		let n = B(e, t);
		if (n) return n;
	}
	if (qe(n)) {
		let t = Xe(e, n);
		if (t) return t;
	}
	if (Je(t)) {
		let n = V(e, t);
		if (n) return n;
	}
	if (Je(n)) {
		let t = Ze(e, n);
		if (t) return t;
	}
	return null;
}
function B(e, t) {
	let n = Ue.get(e);
	return n ? n(t || /* @__PURE__ */ new Map()) : null;
}
function Xe(e, t) {
	let n = We.get(e);
	return n ? n(t || /* @__PURE__ */ new Map()) : null;
}
function V(e, t) {
	let n = Ge.get(e);
	return n ? n(t || /* @__PURE__ */ new Map()) : null;
}
function Ze(e, t) {
	let n = Ke.get(e);
	return n ? n(t || /* @__PURE__ */ new Map()) : null;
}
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/elements/components/cssQuery.css.mjs
var Qe = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.query:not(.editing-query) {\n  overflow: hidden;\n}\n\n.editable .query-text {\n  color: var(--sys-color-on-surface);\n}\n\n.editable .query-text:hover {\n  text-decoration: var(--override-styles-section-text-hover-text-decoration);\n  cursor: var(--override-styles-section-text-hover-cursor);\n}\n", { render: $e, html: H } = u, et = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t = "";
	#n;
	#r = "";
	#i;
	#a;
	set data(e) {
		this.#t = e.queryPrefix, this.#n = e.queryName, this.#r = e.queryText, this.#i = e.onQueryTextClick, this.#a = e.jslogContext, this.#o();
	}
	#o() {
		let e = p({
			query: !0,
			editable: !!this.#i
		}), t = H`
      <span class="query-text" @click=${this.#i}>${this.#r}</span>
    `;
		$e(H`
        <style>${Qe}</style>
        <style>${c}</style>
        <div class=${e} jslog=${o(this.#a).track({
			click: !0,
			change: !0
		})}>
          <slot name="indent"></slot>
          ${this.#t ? H`<span>${this.#t + " "}</span>` : m}
          ${this.#n ? H`<span>${this.#n + " "}</span>` : m}
          ${t} {
        </div>`, this.#e, { host: this });
	}
};
customElements.define("devtools-css-query", et);
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/elements/components/cssVariableValueView.css.mjs
var tt = "/*\n * Copyright 2023 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.registered-property-popup-wrapper {\n  max-width: 232px;\n  font-size: 12px;\n  line-height: 1.4;\n  word-break: break-all;\n}\n\n.monospace {\n  font-family: var(--monospace-font-family);\n  font-size: var(--monospace-font-size);\n}\n\n.divider {\n  margin: 8px -7px;\n  border: 1px solid var(--sys-color-divider);\n}\n\n.registered-property-links {\n  margin-top: 8px;\n}\n\n.clickable {\n  color: var(--sys-color-primary);\n  cursor: pointer;\n}\n\n.underlined {\n  text-decoration: underline;\n}\n\n.unbreakable-text {\n  white-space: nowrap;\n}\n\n.css-property {\n  color: var(--webkit-css-property-color, var(--sys-color-token-property-special)); /* stylelint-disable-line plugin/use_theme_colors */ /* See: crbug.com/1152736 for color variable migration. */\n}\n\n.title {\n  color: var(--sys-color-state-disabled);\n}\n", U = {
	registeredPropertyLinkTitle: "View registered property",
	invalidPropertyValue: "Invalid property value, expected type {type}",
	sIsNotDefined: "{PH1} is not defined"
}, nt = t("panels/elements/components/CSSVariableValueView.ts", U), rt = e.bind(void 0, nt), it = ee.bind(void 0, nt), { render: at, html: W } = u;
function ot(e) {
	return W`<div class="registered-property-links">
            <span role="button" @click=${e?.goToDefinition} class="clickable underlined unbreakable-text">
              ${rt(U.registeredPropertyLinkTitle)}
            </span>
          </div>`;
}
var st = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	constructor(e) {
		super(), this.#t(e);
	}
	#t(e) {
		let t = W`<span class="monospace css-property">${e.registration.syntax()}</span>`;
		at(W`
      <style>${tt}</style>
      <div class="variable-value-popup-wrapper">
        ${it(U.invalidPropertyValue, { type: t })}
        ${ot(e)}
      </div>`, this.#e, { host: this });
	}
}, ct = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	variableName;
	#t;
	details;
	constructor({ variableName: e, value: t, details: n }) {
		super(), this.variableName = e, this.details = n, this.value = t;
	}
	get value() {
		return this.#t;
	}
	set value(e) {
		this.#t = e, this.#n();
	}
	#n() {
		let e = this.details?.registration.initialValue(), t = this.details ? W`
        <hr class=divider />
        <div class=registered-property-popup-wrapper>
          <div class="monospace">
            <div><span class="css-property">syntax:</span> ${this.details.registration.syntax()}</div>
            <div><span class="css-property">inherits:</span> ${this.details.registration.inherits()}</div>
            ${e ? W`<div><span class="css-property">initial-value:</span> ${e}</div>` : ""}
          </div>
          ${ot(this.details)}
        </div>` : "";
		at(W`<style>${tt}</style>
             <div class="variable-value-popup-wrapper">
               ${this.value ?? rt(U.sIsNotDefined, { PH1: this.variableName })}
             </div>
             ${t}
             `, this.#e, { host: this });
	}
};
customElements.define("devtools-css-variable-value-view", ct), customElements.define("devtools-css-variable-parser-error", st);
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/components/node_text/nodeText.css.mjs
var lt = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n/* See: https://crbug.com/1227651 for details on changing these to --override pattern. */\n\n.node-label-name {\n  color: var(--override-node-text-label-color, var(--sys-color-token-tag));\n}\n\n.node-label-class {\n  color: var(--override-node-text-class-color, var(--sys-color-token-attribute));\n}\n\n.node-label-id {\n  color: var(--override-node-text-id-color, var(--sys-color-token-attribute));\n}\n\n.node-label-class.node-multiple-descriptors {\n  color: var(--override-node-text-multiple-descriptors-class, var(--override-node-text-class-color, var(--sys-color-token-attribute)));\n}\n\n.node-label-id.node-multiple-descriptors {\n  color: var(--override-node-text-multiple-descriptors-id, var(--override-node-text-id-color, var(--sys-color-token-attribute)));\n}\n", { render: ut, html: G } = u, dt = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t = "";
	#n = "";
	#r = [];
	set data(e) {
		this.#t = e.nodeTitle, this.#n = e.nodeId, this.#r = e.nodeClasses, this.#i();
	}
	#i() {
		let e = !!this.#n, t = !!(this.#r && this.#r.length > 0), n = [G`<span class="node-label-name">${this.#t}</span>`];
		if (this.#n) {
			let e = p({
				"node-label-id": !0,
				"node-multiple-descriptors": t
			});
			n.push(G`<span class=${e}>#${CSS.escape(this.#n)}</span>`);
		}
		if (this.#r && this.#r.length > 0) {
			let t = this.#r.map((e) => `.${CSS.escape(e)}`).join(""), r = p({
				"node-label-class": !0,
				"node-multiple-descriptors": e
			});
			n.push(G`<span class=${r}>${t}</span>`);
		}
		ut(G`
      <style>${lt}</style>
      ${n}
    `, this.#e, { host: this });
	}
};
customElements.define("devtools-node-text", dt);
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/elements/components/elementsBreadcrumbs.css.mjs
var ft = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  --override-node-text-label-color: var(--sys-color-token-tag);\n  --override-node-text-class-color: var(--sys-color-token-attribute);\n  --override-node-text-id-color: var(--sys-color-token-attribute);\n  --override-node-text-multiple-descriptors-id: var(--sys-color-on-surface);\n  --override-node-text-multiple-descriptors-class: var(--sys-color-token-property);\n}\n\n.crumbs {\n  display: inline-flex;\n  align-items: stretch;\n  width: 100%;\n  overflow: hidden;\n  pointer-events: auto;\n  cursor: default;\n  white-space: nowrap;\n  position: relative;\n  background: var(--sys-color-cdt-base-container);\n  font-size: inherit;\n  font-family: inherit;\n}\n\n.crumbs-window {\n  flex-grow: 2;\n  overflow: hidden;\n}\n\n.crumbs-scroll-container {\n  display: inline-flex;\n  margin: 0;\n  padding: 0;\n}\n\n.crumb {\n  display: block;\n  padding: 0 7px;\n  line-height: 23px;\n  white-space: nowrap;\n}\n\n.overflow {\n  padding: 0 5px;\n  font-weight: bold;\n  display: block;\n  border: none;\n  flex-grow: 0;\n  flex-shrink: 0;\n  text-align: center;\n  background-color: var(--sys-color-cdt-base-container);\n  color: var(--sys-color-token-subtle);\n  margin: 1px;\n  outline: 1px solid var(--sys-color-neutral-outline);\n}\n\n.overflow.hidden {\n  display: none;\n}\n\n.overflow:disabled {\n  opacity: 50%;\n}\n\n.overflow:focus {\n  outline-color: var(--sys-color-primary);\n}\n\n.overflow:not(:disabled):hover {\n  background-color: var(--sys-color-state-hover-on-subtle);\n  color: var(--sys-color-on-surface);\n}\n\n.crumb-link {\n  text-decoration: none;\n  color: inherit;\n}\n\n.crumb:hover {\n  background: var(--sys-color-state-hover-on-subtle);\n}\n\n.crumb.selected {\n  background: var(--sys-color-tonal-container);\n}\n\n.crumb:focus {\n  outline: var(--sys-color-primary) auto 1px;\n}\n", pt = { text: "(text)" }, mt = t("panels/elements/components/ElementsBreadcrumbsUtils.ts", pt), ht = e.bind(void 0, mt), gt = (e, t) => t ? e.filter((e) => e.nodeType() !== Node.DOCUMENT_NODE).map((e) => ({
	title: _t(e),
	selected: e.id === t.id,
	node: e
})).reverse() : [], K = (e, t = {}) => ({
	main: e,
	extras: t
}), _t = (e) => {
	switch (e.nodeType()) {
		case Node.ELEMENT_NODE: {
			let t = e.pseudoType();
			if (t) return K("::" + t);
			let n = K(e.nodeNameInCorrectCase()), r = e.getAttribute("id");
			r && (n.extras.id = r);
			let i = e.getAttribute("class");
			if (i) {
				let e = new Set(i.split(/\s+/));
				n.extras.classes = Array.from(e);
			}
			return n;
		}
		case Node.TEXT_NODE: return K(ht(pt.text));
		case Node.COMMENT_NODE: return K("<!-->");
		case Node.DOCUMENT_TYPE_NODE: return K("<!doctype>");
		case Node.DOCUMENT_FRAGMENT_NODE: return K(e.shadowRootType() ? "#shadow-root" : e.nodeNameInCorrectCase());
		default: return K(e.nodeNameInCorrectCase());
	}
}, { html: q } = u, J = {
	breadcrumbs: "DOM tree breadcrumbs",
	scrollLeft: "Scroll left",
	scrollRight: "Scroll right"
}, vt = t("panels/elements/components/ElementsBreadcrumbs.ts", J), yt = e.bind(void 0, vt), bt = class e extends Event {
	static eventName = "breadcrumbsnodeselected";
	node;
	constructor(t) {
		super(e.eventName, {}), this.node = t;
	}
}, xt = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t = new ResizeObserver(() => this.#l());
	#n = [];
	#r = null;
	#i = !1;
	#a = "start";
	#o = !1;
	#s = !1;
	set data(e) {
		this.#r = e.selectedNode, this.#n = e.crumbs, this.#s = !1, le(this, this.#b);
	}
	disconnectedCallback() {
		this.#o = !1, this.#t.disconnect();
	}
	#c(e) {
		return (t) => {
			t.preventDefault(), this.dispatchEvent(new bt(e));
		};
	}
	async #l() {
		let e = this.#e.querySelector(".crumbs-scroll-container"), t = this.#e.querySelector(".crumbs-window");
		if (!e || !t) return;
		let n = await f(() => t.clientWidth), r = await f(() => e.clientWidth);
		this.#i ? r < n && (this.#i = !1) : r > n && (this.#i = !0), this.#x(), this.#_(t);
	}
	#u(e) {
		return () => e.highlight();
	}
	#d() {
		g.hideDOMNodeHighlight();
	}
	#f(e) {
		return () => e.highlight();
	}
	#p() {
		g.hideDOMNodeHighlight();
	}
	#m() {
		if (!this.#t || this.#o === !0) return;
		let e = this.#e.querySelector(".crumbs");
		e && (this.#t.observe(e), this.#o = !0);
	}
	async #h() {
		let e = this.#e.querySelector(".crumbs-scroll-container"), t = this.#e.querySelector(".crumbs-window");
		if (!e || !t) return;
		let n = await f(() => t.clientWidth), r = await f(() => e.clientWidth);
		this.#i ? r < n && (this.#i = !1, this.#b()) : r > n && (this.#i = !0, this.#b());
	}
	#g(e) {
		if (!e.target) return;
		let t = e.target;
		this.#_(t);
	}
	#_(e) {
		let t = e.scrollWidth - e.clientWidth, n = e.scrollLeft;
		this.#a = n < 10 ? "start" : n >= t - 10 ? "end" : "middle", this.#b();
	}
	#v(e) {
		return () => {
			this.#s = !0;
			let t = this.#e.querySelector(".crumbs-window");
			if (!t) return;
			let n = t.clientWidth / 2, r = e === "left" ? Math.max(Math.floor(t.scrollLeft - n), 0) : t.scrollLeft + n;
			t.scrollTo({
				behavior: "smooth",
				left: r
			});
		};
	}
	#y(e, t) {
		let n = p({
			overflow: !0,
			[e]: !0,
			hidden: !this.#i
		}), r = yt(e === "left" ? J.scrollLeft : J.scrollRight);
		return q`
      <button
        class=${n}
        @click=${this.#v(e)}
        ?disabled=${t}
        aria-label=${r}
        title=${r}>
        <devtools-icon name=${"triangle-" + e} style="width: var(--sys-size-6); height: 10px;">
        </devtools-icon>
      </button>
      `;
	}
	#b() {
		let e = gt(this.#n, this.#r);
		s(q`
      <style>${ft}</style>
      <nav class="crumbs" aria-label=${yt(J.breadcrumbs)} jslog=${ne()}>
        ${this.#y("left", this.#a === "start")}

        <div class="crumbs-window" @scroll=${this.#g}>
          <ul class="crumbs-scroll-container">
            ${e.map((e) => {
			let t = {
				crumb: !0,
				selected: e.selected
			};
			return q`
                <li class=${p(t)}
                  data-node-id=${e.node.id}
                  data-crumb="true"
                >
                  <a href="#" draggable=false class="crumb-link"
                    jslog=${l().track({
				click: !0,
				resize: !0
			})}
                    @click=${this.#c(e.node)}
                    @mousemove=${this.#u(e.node)}
                    @mouseleave=${this.#d}
                    @focus=${this.#f(e.node)}
                    @blur=${this.#p}
                  >
                    <devtools-node-text data-node-title=${e.title.main} .data=${{
				nodeTitle: e.title.main,
				nodeId: e.title.extras.id,
				nodeClasses: e.title.extras.classes
			}}>
                    </devtools-node-text>
                  </a>
                </li>`;
		})}
          </ul>
        </div>
        ${this.#y("right", this.#a === "end")}
      </nav>
    `, this.#e, { host: this }), this.#h(), this.#m(), this.#x();
	}
	async #x() {
		if (!this.#r || !this.#e || !this.#i || this.#s) return;
		let e = this.#r.id, t = this.#e.querySelector(`.crumb[data-node-id="${e}"]`);
		t && await a(() => {
			t.scrollIntoView({ behavior: "auto" });
		});
	}
};
customElements.define("devtools-elements-breadcrumbs", xt);
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/elements/components/elementsTreeExpandButton.css.mjs
var St = "/*\n * Copyright 2022 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  display: inline-flex;\n  vertical-align: middle;\n}\n\n:host(.hidden) {\n  display: none;\n}\n\n.expand-button {\n  display: inline-flex;\n  justify-content: center;\n  align-items: center;\n  box-sizing: border-box;\n  width: 14px;\n  height: 10px;\n  margin: 0 2px;\n  border: 1px solid var(--override-adorner-border-color, var(--sys-color-tonal-outline));\n  border-radius: 10px;\n  background: var(--override-adorner-background-color, var(--sys-color-cdt-base-container));\n  padding: 0;\n  position: relative;\n\n  &:hover::after,\n  &:active::before {\n    content: \"\";\n    height: 100%;\n    width: 100%;\n    border-radius: inherit;\n    position: absolute;\n    top: 0;\n    left: 0;\n  }\n\n  &:hover::after {\n    background-color: var(--sys-color-state-hover-on-subtle);\n  }\n\n  &:active::before {\n    background-color: var(--sys-color-state-ripple-neutral-on-subtle);\n  }\n}\n\n.expand-button devtools-icon {\n  width: 14px;\n  height: 14px;\n  color: var(--sys-color-primary);\n}\n", Ct = { expand: "Expand" }, wt = t("panels/elements/components/ElementsTreeExpandButton.ts", Ct), Tt = e.bind(void 0, wt), Et = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t = () => {};
	set data(e) {
		this.#t = e.clickHandler, this.#n();
	}
	#n() {
		this.#r();
	}
	#r() {
		s(d`
      <style>${St}</style>
      <button
        class="expand-button"
        tabindex="-1"
        aria-label=${Tt(Ct.expand)}
        jslog=${h("expand").track({ click: !0 })}
        @click=${this.#t}><devtools-icon name="dots-horizontal"></devtools-icon></button>`, this.#e, { host: this });
	}
};
customElements.define("devtools-elements-tree-expand-button", Et);
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/elements/components/queryContainer.css.mjs
var Dt = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.container-link {\n  display: inline-block;\n  color: var(--sys-color-state-disabled);\n}\n\n.container-link:hover {\n  color: var(--sys-color-primary);\n}\n\n.queried-size-details {\n  color: var(--sys-color-on-surface);\n}\n\n.axis-icon {\n  margin-left: 0.4em;\n  width: 16px;\n  height: 12px;\n  vertical-align: text-top;\n}\n\n.axis-icon.hidden {\n  display: none;\n}\n\n.axis-icon.vertical {\n  transform: rotate(90deg);\n}\n", { render: Ot, html: kt } = u, { PhysicalAxis: At, QueryAxis: jt } = ie, Mt = class e extends Event {
	static eventName = "queriedsizerequested";
	constructor() {
		super(e.eventName, {});
	}
}, Nt = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t;
	#n;
	#r;
	#i = !1;
	#a;
	set data(e) {
		this.#t = e.queryName, this.#n = e.container, this.#r = e.onContainerLinkClick, this.#c();
	}
	updateContainerQueriedSizeDetails(e) {
		this.#a = e, this.#c();
	}
	async #o() {
		this.#n?.highlight("container-outline"), this.#i = !0, this.dispatchEvent(new Mt());
	}
	#s() {
		g.hideDOMNodeHighlight(), this.#i = !1, this.#c();
	}
	#c() {
		if (!this.#n) return;
		let e, t;
		this.#t || (e = this.#n.getAttribute("id"), t = this.#n.getAttribute("class")?.split(/\s+/).filter(Boolean));
		let n = this.#t || this.#n.nodeNameInCorrectCase();
		Ot(kt`
      <style>${Dt}</style>
      →
      <a href="#" draggable=false class="container-link"
         jslog=${o("container-query").track({ click: !0 })}
         @click=${this.#r}
         @mouseenter=${this.#o}
         @mouseleave=${this.#s}>
        <devtools-node-text data-node-title=${n} .data=${{
			nodeTitle: n,
			nodeId: e,
			nodeClasses: t
		}}>
        </devtools-node-text>
      </a>
      ${this.#i ? this.#l() : m}
    `, this.#e, { host: this });
	}
	#l() {
		if (!this.#a || this.#a.queryAxis === jt.NONE) return m;
		let e = this.#a.queryAxis === jt.BOTH, t = p({
			"axis-icon": !0,
			hidden: e,
			vertical: this.#a.physicalAxis === At.VERTICAL
		});
		return kt`
      <span class="queried-size-details">
        (${this.#a.queryAxis}
        <devtools-icon
          class=${t} name="width"></devtools-icon>
        ) ${e && this.#a.width ? " width: " : m}
        ${this.#a.width || m}
        ${e && this.#a.height ? " height: " : m}
        ${this.#a.height || m}
      </span>
    `;
	}
};
customElements.define("devtools-query-container", Nt);
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/elements/components/stylePropertyEditor.css.mjs
var Pt = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.container {\n  min-width: 170px;\n}\n\n.row {\n  padding: 0;\n  color: var(--sys-color-on-surface);\n  padding-bottom: 16px;\n}\n\n.row:last-child {\n  padding-bottom: 0;\n}\n\n.property {\n  padding-bottom: 4px;\n  white-space: nowrap;\n}\n\n.property-name {\n  color: var(--sys-color-token-property-special);\n}\n\n.property-value {\n  color: var(--sys-color-on-surface);\n}\n\n.property-value.not-authored {\n  color: var(--sys-color-state-disabled);\n}\n\n.buttons {\n  display: flex;\n  flex-direction: row;\n}\n\n.buttons > :first-child {\n  border-radius: 3px 0 0 3px;\n}\n\n.buttons > :last-child {\n  border-radius: 0 3px 3px 0;\n}\n\n.button {\n  border: 1px solid var(--sys-color-neutral-outline);\n  background-color: var(--sys-color-cdt-base-container);\n  width: 24px;\n  height: 24px;\n  min-width: 24px;\n  min-height: 24px;\n  padding: 0;\n  margin: 0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  cursor: pointer;\n}\n\n.button:focus-visible {\n  outline: auto 5px -webkit-focus-ring-color;\n}\n\n.button devtools-icon {\n  color: var(--icon-default);\n}\n\n.button:hover devtools-icon {\n  color: var(--icon-default-hover);\n}\n\n.button.selected devtools-icon {\n  color: var(--icon-toggled);\n}\n", Y = {
	selectButton: "Add {propertyName}: {propertyValue}",
	deselectButton: "Remove {propertyName}: {propertyValue}",
	denseLabel: "Dense"
}, Ft = t("panels/elements/components/StylePropertyEditor.ts", Y), It = e.bind(void 0, Ft), { render: Lt, html: X, Directives: Rt } = u, Z = class e extends Event {
	static eventName = "propertyselected";
	data;
	constructor(t, n) {
		super(e.eventName, {}), this.data = {
			name: t,
			value: n
		};
	}
}, Q = class e extends Event {
	static eventName = "propertydeselected";
	data;
	constructor(t, n) {
		super(e.eventName, {}), this.data = {
			name: t,
			value: n
		};
	}
}, $ = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t = /* @__PURE__ */ new Map();
	#n = /* @__PURE__ */ new Map();
	editableProperties = [];
	getEditableProperties() {
		return this.editableProperties;
	}
	set data(e) {
		this.#t = e.authoredProperties, this.#n = e.computedProperties, this.#r();
	}
	#r() {
		Lt(X`
      <style>${Pt}</style>
      <style>${ce}</style>
      <div class="container">
        ${this.editableProperties.map((e) => this.#i(e))}
      </div>
    `, this.#e, { host: this });
	}
	#i(e) {
		let t = this.#t.get(e.propertyName), n = !t, r = t || this.#n.get(e.propertyName), i = Rt.classMap({
			"property-value": !0,
			"not-authored": n
		});
		return e.propertyName === "grid-auto-flow" ? this.#a(e, r, i) : X`<div class="row">
      <div class="property">
        <span class="property-name">${e.propertyName}</span>: <span class=${i}>${r}</span>
      </div>
      <div class="buttons">
        ${e.propertyValues.map((n) => this.#s(n, e.propertyName, n === t))}
      </div>
    </div>`;
	}
	#a(e, t, n) {
		let r = this.#t.get(e.propertyName), i = r === "dense" || r === "row dense" || r === "column dense", a = r === "row" || r === "row dense", o = r === "column" || r === "column dense";
		return X`<div class="row">
      <div class="property">
        <span class="property-name">${e.propertyName}</span>: <span class=${n}>${t}</span>
      </div>
      <div class="buttons">
        ${this.#s("row", e.propertyName, a)}
        ${this.#s("column", e.propertyName, o)}
        <devtools-checkbox
          .checked=${i}
          @change=${(e) => this.#o(e, a, o)}
        >
          ${It(Y.denseLabel)}
        </devtools-checkbox>
      </div>
    </div>`;
	}
	#o(e, t, n) {
		let r = e.target.checked, i = "grid-auto-flow", a = this.#t.get(i), o = "";
		o = t ? r ? "row dense" : "row" : n ? r ? "column dense" : "column" : r ? "dense" : "", a && this.dispatchEvent(new Q(i, a)), o && this.dispatchEvent(new Z(i, o));
	}
	#s(e, t, n = !1) {
		let r = `${t}: ${e}`, i = this.findIcon(r, this.#n);
		if (!i) throw Error(`Icon for ${r} is not found`);
		let a = `transform: rotate(${i.rotate}deg) scale(${i.scaleX}, ${i.scaleY})`, o = Rt.classMap({
			button: !0,
			selected: n
		}), s = {
			propertyName: t,
			propertyValue: e
		};
		return X`
      <button title=${It(n ? Y.deselectButton : Y.selectButton, s)}
              class=${o}
              jslog=${l().track({
			click: !0,
			resize: !0
		}).context(`${t}-${e}`)}
              @click=${() => this.#c(t, e, n)}>
        <devtools-icon style=${a} name=${i.iconName}>
        </devtools-icon>
      </button>
    `;
	}
	#c(e, t, n) {
		if (e === "grid-auto-flow") {
			let r = this.#t.get(e), i = r?.includes("dense") || !1;
			if (n) {
				let t = i ? "dense" : "";
				r && this.dispatchEvent(new Q(e, r)), t && this.dispatchEvent(new Z(e, t));
			} else {
				let n = i ? `${t} dense` : t;
				r && this.dispatchEvent(new Q(e, r)), this.dispatchEvent(new Z(e, n));
			}
		} else n ? this.dispatchEvent(new Q(e, t)) : this.dispatchEvent(new Z(e, t));
	}
	findIcon(e, t) {
		throw Error("Not implemented");
	}
}, zt = class extends $ {
	jslogContext = "cssFlexboxEditor";
	editableProperties = Ht;
	findIcon(e, t) {
		return B(e, t);
	}
};
customElements.define("devtools-flexbox-editor", zt);
var Bt = class extends $ {
	jslogContext = "cssGridEditor";
	editableProperties = Ut;
	findIcon(e, t) {
		return V(e, t);
	}
};
customElements.define("devtools-grid-editor", Bt);
var Vt = class extends $ {
	jslogContext = "cssGridLanesEditor";
	editableProperties = Wt;
	findIcon(e, t) {
		return V(e, t);
	}
};
customElements.define("devtools-grid-lanes-editor", Vt);
var Ht = [
	{
		propertyName: "flex-direction",
		propertyValues: [
			"row",
			"column",
			"row-reverse",
			"column-reverse"
		]
	},
	{
		propertyName: "flex-wrap",
		propertyValues: ["nowrap", "wrap"]
	},
	{
		propertyName: "align-content",
		propertyValues: [
			"center",
			"flex-start",
			"flex-end",
			"space-around",
			"space-between",
			"stretch"
		]
	},
	{
		propertyName: "justify-content",
		propertyValues: [
			"center",
			"flex-start",
			"flex-end",
			"space-between",
			"space-around",
			"space-evenly"
		]
	},
	{
		propertyName: "align-items",
		propertyValues: [
			"center",
			"flex-start",
			"flex-end",
			"stretch",
			"baseline"
		]
	}
], Ut = [
	{
		propertyName: "grid-auto-flow",
		propertyValues: ["row", "column"]
	},
	{
		propertyName: "align-content",
		propertyValues: [
			"center",
			"start",
			"end",
			"space-between",
			"space-around",
			"space-evenly",
			"stretch"
		]
	},
	{
		propertyName: "justify-content",
		propertyValues: [
			"center",
			"start",
			"end",
			"space-between",
			"space-around",
			"space-evenly",
			"stretch"
		]
	},
	{
		propertyName: "align-items",
		propertyValues: [
			"center",
			"start",
			"end",
			"stretch",
			"baseline"
		]
	},
	{
		propertyName: "justify-items",
		propertyValues: [
			"center",
			"start",
			"end",
			"stretch"
		]
	}
], Wt = [
	{
		propertyName: "align-content",
		propertyValues: [
			"center",
			"start",
			"end",
			"space-between",
			"space-around",
			"space-evenly",
			"stretch"
		]
	},
	{
		propertyName: "justify-content",
		propertyValues: [
			"center",
			"start",
			"end",
			"space-between",
			"space-around",
			"space-evenly",
			"stretch"
		]
	},
	{
		propertyName: "align-items",
		propertyValues: [
			"center",
			"start",
			"end",
			"stretch"
		]
	},
	{
		propertyName: "justify-items",
		propertyValues: [
			"center",
			"start",
			"end",
			"stretch"
		]
	}
];
//#endregion
export { xt as a, et as c, Ee as d, xe as f, Nt as i, Ye as l, Bt as n, st as o, Vt as r, ct as s, zt as t, b as u };
