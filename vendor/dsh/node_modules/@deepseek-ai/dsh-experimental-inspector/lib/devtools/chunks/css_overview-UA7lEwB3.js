import { n as e } from "./rolldown-runtime-DF993M8W.js";
import { Et as t, H as n, It as r, K as i, at as a, ft as o, i as s } from "./common-DMSVbaSb.js";
import { $i as c, Fo as l, Hr as u, La as d, Md as f, Ol as p, Op as m, Po as h, S as ee, Vr as g, Wo as _, Yf as v, Zo as y, df as b, ei as x, el as te, ff as ne, ha as S, ii as C, jd as w, kd as re, kl as ie, ni as T, pf as ae, vi as oe } from "./legacy-dM_vujv7.js";
import { l as se } from "./root-DdvV-xPu.js";
import "./platform-D4TUCh2P.js";
import { b as E } from "./text_utils-DWSliayn.js";
import { C as D, c as O } from "./common-Bs7hSOUj.js";
import "./data_grid-C6uthMeA.js";
import { n as k, t as A } from "./helpers-CsoC22BH.js";
import { i as ce } from "./color_picker-Dp-vkqgw.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/css_overview/CSSOverviewUnusedDeclarations.ts
var le = /* @__PURE__ */ e({ CSSOverviewUnusedDeclarations: () => N }), j = {
	topAppliedToAStatically: "`Top` applied to a statically positioned element",
	leftAppliedToAStatically: "`Left` applied to a statically positioned element",
	rightAppliedToAStatically: "`Right` applied to a statically positioned element",
	bottomAppliedToAStatically: "`Bottom` applied to a statically positioned element",
	widthAppliedToAnInlineElement: "`Width` applied to an inline element",
	heightAppliedToAnInlineElement: "`Height` applied to an inline element",
	verticalAlignmentAppliedTo: "Vertical alignment applied to element which is neither `inline` nor `table-cell`"
}, ue = i("panels/css_overview/CSSOverviewUnusedDeclarations.ts", j), M = n.bind(void 0, ue), N = class {
	static add(e, t, n) {
		let r = e.get(t) || [];
		r.push(n), e.set(t, r);
	}
	static checkForUnusedPositionValues(e, t, n, r, i, a, o, s) {
		if (n[r] === "static") {
			if (n[i] !== "auto") {
				let r = M(j.topAppliedToAStatically);
				this.add(e, r, {
					declaration: `top: ${n[i]}`,
					nodeId: t
				});
			}
			if (n[a] !== "auto") {
				let r = M(j.leftAppliedToAStatically);
				this.add(e, r, {
					declaration: `left: ${n[a]}`,
					nodeId: t
				});
			}
			if (n[o] !== "auto") {
				let r = M(j.rightAppliedToAStatically);
				this.add(e, r, {
					declaration: `right: ${n[o]}`,
					nodeId: t
				});
			}
			if (n[s] !== "auto") {
				let r = M(j.bottomAppliedToAStatically);
				this.add(e, r, {
					declaration: `bottom: ${n[s]}`,
					nodeId: t
				});
			}
		}
	}
	static checkForUnusedWidthAndHeightValues(e, t, n, r, i, a) {
		if (n[r] === "inline") {
			if (n[i] !== "auto") {
				let r = M(j.widthAppliedToAnInlineElement);
				this.add(e, r, {
					declaration: `width: ${n[i]}`,
					nodeId: t
				});
			}
			if (n[a] !== "auto") {
				let r = M(j.heightAppliedToAnInlineElement);
				this.add(e, r, {
					declaration: `height: ${n[a]}`,
					nodeId: t
				});
			}
		}
	}
	static checkForInvalidVerticalAlignment(e, t, n, r, i) {
		if (!(!n[r] || n[r].startsWith("inline") || n[r].startsWith("table")) && n[i] !== "baseline") {
			let r = M(j.verticalAlignmentAppliedTo);
			this.add(e, r, {
				declaration: `vertical-align: ${n[i]}`,
				nodeId: t
			});
		}
	}
}, P = /* @__PURE__ */ e({ CSSOverviewModel: () => F }), F = class extends b {
	#e;
	#t;
	#n;
	constructor(e) {
		super(e), this.#e = e.runtimeAgent(), this.#t = e.cssAgent(), this.#n = e.domsnapshotAgent();
	}
	async getNodeStyleStats() {
		let e = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map(), d = {
			computedStyles: [
				"background-color",
				"color",
				"fill",
				"border-top-width",
				"border-top-color",
				"border-bottom-width",
				"border-bottom-color",
				"border-left-width",
				"border-left-color",
				"border-right-width",
				"border-right-color",
				"font-family",
				"font-size",
				"font-weight",
				"line-height",
				"position",
				"top",
				"right",
				"bottom",
				"left",
				"display",
				"width",
				"height",
				"vertical-align"
			],
			includeTextColorOpacities: !0,
			includeBlendedBackgroundColors: !0
		}, f = (e) => e instanceof o ? e.hasAlpha() ? e.asString(a.HEXA) : e.asString(a.HEX) : e.asString(), p = (e, n, r) => {
			if (e === -1) return;
			let i = v[e];
			if (!i) return;
			let a = t(i);
			if (!a || a.asLegacyColor().rgba()[3] === 0) return;
			let o = f(a);
			if (!o) return;
			let s = r.get(o) || /* @__PURE__ */ new Set();
			return s.add(n), r.set(o, s), a;
		}, m = (e) => (/* @__PURE__ */ new Set([
			"altglyph",
			"circle",
			"ellipse",
			"path",
			"polygon",
			"polyline",
			"rect",
			"svg",
			"text",
			"textpath",
			"tref",
			"tspan"
		])).has(e.toLowerCase()), h = (e) => (/* @__PURE__ */ new Set([
			"iframe",
			"video",
			"embed",
			"img"
		])).has(e.toLowerCase()), ee = (e, t) => (/* @__PURE__ */ new Set([
			"tr",
			"td",
			"thead",
			"tbody"
		])).has(e.toLowerCase()) && t.startsWith("table"), g = 0, { documents: _, strings: v } = await this.#n.invoke_captureSnapshot(d);
		for (let { nodes: o, layout: d } of _) {
			g += d.nodeIndex.length;
			for (let g = 0; g < d.styles.length; g++) {
				let _ = d.styles[g], y = d.nodeIndex[g];
				if (!o.backendNodeId || !o.nodeName) continue;
				let b = o.backendNodeId[y], x = o.nodeName[y], [te, ne, S, C, w, re, ie, T, ae, oe, se, E, D, O, k, A, le, j, ue, M, P, F, de, I] = _;
				p(te, b, e);
				let L = p(ne, b, n);
				if (m(v[x]) && p(S, b, i), v[C] !== "0px" && p(w, b, c), v[re] !== "0px" && p(ie, b, c), v[T] !== "0px" && p(ae, b, c), v[oe] !== "0px" && p(se, b, c), E && E !== -1) {
					let e = v[E], t = l.get(e) || /* @__PURE__ */ new Map(), n = "font-size", r = "font-weight", i = "line-height", a = t.get(n) || /* @__PURE__ */ new Map(), o = t.get(r) || /* @__PURE__ */ new Map(), s = t.get(i) || /* @__PURE__ */ new Map();
					if (D !== -1) {
						let e = v[D], t = a.get(e) || [];
						t.push(b), a.set(e, t);
					}
					if (O !== -1) {
						let e = v[O], t = o.get(e) || [];
						t.push(b), o.set(e, t);
					}
					if (k !== -1) {
						let e = v[k], t = s.get(e) || [];
						t.push(b), s.set(e, t);
					}
					t.set(n, a), t.set(r, o), t.set(i, s), l.set(e, t);
				}
				let R = L && d.blendedBackgroundColors && d.blendedBackgroundColors[g] !== -1 ? t(v[d.blendedBackgroundColors[g]]) : null;
				if (L && R) {
					let e = new ce({
						backgroundColors: [R.asString(a.HEXA)],
						computedFontSize: D === -1 ? "" : v[D],
						computedFontWeight: O === -1 ? "" : v[O]
					}), t = L.asLegacyColor().blendWithAlpha(d.textColorOpacities ? d.textColorOpacities[g] : 1);
					e.setColor(t);
					let n = `${f(t)}_${f(R.asLegacyColor())}`;
					if (s.instance().moduleSetting("apca").get()) {
						let i = e.contrastRatioAPCA(), a = e.contrastRatioAPCAThreshold();
						if (!(i && a && Math.abs(i) >= a) && i) {
							let e = {
								nodeId: b,
								contrastRatio: i,
								textColor: t,
								backgroundColor: R,
								thresholdsViolated: {
									aa: !1,
									aaa: !1,
									apca: !0
								}
							};
							r.has(n) ? r.get(n).push(e) : r.set(n, [e]);
						}
					} else {
						let i = e.contrastRatioThreshold("aa") || 0, a = e.contrastRatioThreshold("aaa") || 0, o = e.contrastRatio() || 0;
						if (i > o || a > o) {
							let e = {
								nodeId: b,
								contrastRatio: o,
								textColor: t,
								backgroundColor: R,
								thresholdsViolated: {
									aa: i > o,
									aaa: a > o,
									apca: !1
								}
							};
							r.has(n) ? r.get(n).push(e) : r.set(n, [e]);
						}
					}
				}
				N.checkForUnusedPositionValues(u, b, v, A, le, M, j, ue), !m(v[x]) && !h(v[x]) && N.checkForUnusedWidthAndHeightValues(u, b, v, P, F, de), I !== -1 && !ee(v[x], v[P]) && N.checkForInvalidVerticalAlignment(u, b, v, P, I);
			}
		}
		return {
			backgroundColors: e,
			textColors: n,
			textColorContrastIssues: r,
			fillColors: i,
			borderColors: c,
			fontInfo: l,
			unusedDeclarations: u,
			elementCount: g
		};
	}
	getComputedStyleForNode(e) {
		return this.#t.invoke_getComputedStyleForNode({ nodeId: e });
	}
	async getMediaQueries() {
		let e = await this.#t.invoke_getMediaQueries(), t = /* @__PURE__ */ new Map();
		if (!e) return t;
		for (let n of e.medias) {
			if (n.source === "linkedSheet") continue;
			let e = t.get(n.text) || [];
			e.push(n), t.set(n.text, e);
		}
		return t;
	}
	async getGlobalStylesheetStats() {
		let { result: e } = await this.#e.invoke_evaluate({
			expression: "(function() {\n      let styleRules = 0;\n      let inlineStyles = 0;\n      let externalSheets = 0;\n      const stats = {\n        // Simple.\n        type: new Set(),\n        class: new Set(),\n        id: new Set(),\n        universal: new Set(),\n        attribute: new Set(),\n\n        // Non-simple.\n        nonSimple: new Set()\n      };\n\n      for (const styleSheet of document.styleSheets) {\n        if (styleSheet.href) {\n          externalSheets++;\n        } else {\n          inlineStyles++;\n        }\n\n        // Attempting to grab rules can trigger a DOMException.\n        // Try it and if it fails skip to the next stylesheet.\n        let rules;\n        try {\n          rules = styleSheet.rules;\n        } catch (err) {\n          continue;\n        }\n\n        for (const rule of rules) {\n          if ('selectorText' in rule) {\n            styleRules++;\n\n            // Each group that was used.\n            for (const selectorGroup of rule.selectorText.split(',')) {\n              // Each selector in the group.\n              for (const selector of selectorGroup.split(/[\\t\\n\\f\\r ]+/g)) {\n                if (selector.startsWith('.')) {\n                  // Class.\n                  stats.class.add(selector);\n                } else if (selector.startsWith('#')) {\n                  // Id.\n                  stats.id.add(selector);\n                } else if (selector.startsWith('*')) {\n                  // Universal.\n                  stats.universal.add(selector);\n                } else if (selector.startsWith('[')) {\n                  // Attribute.\n                  stats.attribute.add(selector);\n                } else {\n                  // Type or non-simple selector.\n                  const specialChars = /[#.:\\[\\]|\\+>~]/;\n                  if (specialChars.test(selector)) {\n                    stats.nonSimple.add(selector);\n                  } else {\n                    stats.type.add(selector);\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n\n      return {\n        styleRules,\n        inlineStyles,\n        externalSheets,\n        stats: {\n          // Simple.\n          type: stats.type.size,\n          class: stats.class.size,\n          id: stats.id.size,\n          universal: stats.universal.size,\n          attribute: stats.attribute.size,\n\n          // Non-simple.\n          nonSimple: stats.nonSimple.size\n        }\n      }\n    })()",
			returnByValue: !0
		});
		if (e.type === "object") return e.value;
	}
};
b.register(F, {
	capabilities: f.DOM,
	autostart: !1
});
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/css_overview/cssOverviewProcessingView.css.mjs
var de = "/**\n * Copyright 2019 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.overview-processing-view {\n  overflow: hidden;\n  padding: 16px;\n  justify-content: center;\n  align-items: center;\n  height: 100%;\n}\n\n.overview-processing-view h1 {\n  font-size: 16px;\n  text-align: center;\n  font-weight: normal;\n  margin: 0;\n  padding: 8px;\n}\n\n.overview-processing-view h2 {\n  font-size: 12px;\n  text-align: center;\n  font-weight: normal;\n  margin: 0;\n  padding-top: 32px;\n}\n", I = /* @__PURE__ */ e({
	CSSOverviewProcessingView: () => me,
	DEFAULT_VIEW: () => pe
}), L = { cancel: "Cancel" }, R = i("panels/css_overview/CSSOverviewProcessingView.ts", L), fe = n.bind(void 0, R), pe = (e, t, n) => {
	l(h`
    <style>${de}</style>
    <div style="overflow:auto">
      <div class="vbox overview-processing-view">
        <h1>Processing page</h1>
        <div>
          <devtools-button
              @click=${e.onCancel}
              .jslogContext=${"css-overview.cancel-processing"}
              .variant=${c.OUTLINED}>${fe(L.cancel)}</devtools-button>
        </div>
      </div>
    </div>`, n);
}, me = class extends T {
	#e = () => {};
	#t;
	constructor(e, t = pe) {
		super(e), this.#t = t, this.requestUpdate();
	}
	set onCancel(e) {
		this.#e = e, this.requestUpdate();
	}
	performUpdate() {
		this.#t({ onCancel: this.#e }, {}, this.element);
	}
}, z = "/**\n * Copyright 2019 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n@scope to (devtools-widget > *) {\n  .overview-completed-view {\n    overflow: auto;\n\n    --overview-default-padding: 28px;\n    --overview-icon-padding: 32px;\n  }\n\n  .overview-completed-view .summary ul,\n  .overview-completed-view .colors ul {\n    display: flex;\n    flex-wrap: wrap;\n    list-style: none;\n    margin: 0;\n    padding: 0;\n  }\n\n  .overview-completed-view .summary ul {\n    display: grid;\n    grid-template-columns: repeat(auto-fill, 140px);\n    gap: 16px;\n  }\n\n  .overview-completed-view .colors ul li {\n    display: inline-block;\n    margin: 0 0 16px;\n    padding: 0 8px 0 0;\n  }\n\n  .overview-completed-view .summary ul li {\n    display: flex;\n    flex-direction: column;\n    grid-column-start: auto;\n  }\n\n  .overview-completed-view li .label {\n    font-size: 12px;\n    padding-bottom: 2px;\n  }\n\n  .overview-completed-view li .value {\n    font-size: 17px;\n  }\n\n  .overview-completed-view ul li span {\n    font-weight: bold;\n  }\n\n  .unused-rules-grid .header-container,\n  .unused-rules-grid .data-container,\n  .unused-rules-grid table.data {\n    position: relative;\n  }\n\n  .unused-rules-grid .data-container {\n    top: 0;\n    max-height: 350px;\n  }\n\n  .unused-rules-grid {\n    border-left: none;\n    border-right: none;\n  }\n  /** Ensure links are rendered at the correct height */\n\n  .unused-rules-grid .monospace {\n    display: block;\n    height: 18px;\n  }\n\n  .element-grid {\n    flex: 1;\n    border-left: none;\n    border-right: none;\n    overflow: auto;\n  }\n\n  .block {\n    width: 65px;\n    height: 25px;\n    border-radius: 3px;\n    margin-right: 16px;\n\n    &:focus-visible {\n      outline: 2px solid var(--sys-color-state-focus-ring);\n      outline-offset: 2px;\n    }\n  }\n\n  .block-title {\n    padding-top: 4px;\n    font-size: 12px;\n    color: var(--sys-color-on-surface);\n    letter-spacing: 0;\n    text-transform: uppercase;\n  }\n\n  .block-title.color-text {\n    text-transform: none;\n    max-width: 65px;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n    cursor: text;\n    user-select: text;\n    overflow: hidden;\n  }\n\n  .results-section {\n    flex-shrink: 0;\n    border-bottom: 1px solid var(--sys-color-divider);\n    padding: var(--overview-default-padding) 0 var(--overview-default-padding) 0;\n  }\n\n  .horizontally-padded {\n    padding-left: var(--overview-default-padding);\n    padding-right: var(--overview-default-padding);\n  }\n\n  .results-section h1 {\n    font-size: 15px;\n    font-weight: normal;\n    padding: 0;\n    margin: 0 0 20px;\n    padding-left: calc(var(--overview-default-padding) + var(--overview-icon-padding));\n    position: relative;\n    height: 26px;\n    line-height: 26px;\n  }\n\n  .results-section h1::before {\n    content: \"\";\n    display: block;\n    position: absolute;\n    left: var(--overview-default-padding);\n    top: 0;\n    width: 26px;\n    height: 26px;\n    /* stylelint-disable-next-line custom-property-pattern */\n    background-image: var(--image-file-cssoverview_icons_2x);\n    background-size: 104px 26px;\n  }\n\n  .results-section.horizontally-padded h1 {\n    padding-left: var(--overview-icon-padding);\n  }\n\n  .results-section.horizontally-padded h1::before {\n    left: 0;\n  }\n\n  .results-section.summary h1 {\n    padding-left: 0;\n  }\n\n  .results-section.summary h1::before {\n    display: none;\n  }\n\n  .results-section.colors h1::before {\n    background-position: 0 0;\n  }\n\n  .results-section.font-info h1::before {\n    background-position: -26px 0;\n  }\n\n  .results-section.unused-declarations h1::before {\n    background-position: -52px 0;\n  }\n\n  .results-section.media-queries h1::before {\n    background-position: -78px 0;\n  }\n\n  .results-section.colors h2 {\n    margin-top: 20px;\n    font-size: 13px;\n    font-weight: normal;\n  }\n\n  .overview-completed-view .font-info ul,\n  .overview-completed-view .media-queries ul,\n  .overview-completed-view .unused-declarations ul {\n    width: 100%;\n    list-style: none;\n    margin: 0;\n    padding: 0 var(--overview-default-padding);\n  }\n\n  .overview-completed-view .font-info ul li,\n  .overview-completed-view .media-queries ul li,\n  .overview-completed-view .unused-declarations ul li {\n    display: grid;\n    grid-template-columns: 2fr 3fr;\n    gap: 12px;\n    margin-bottom: 4px;\n    align-items: center;\n  }\n\n  .overview-completed-view .font-info button .details,\n  .overview-completed-view .media-queries button .details,\n  .overview-completed-view .unused-declarations button .details {\n    min-width: 100px;\n    text-align: right;\n    margin-right: 8px;\n    color: var(--sys-color-primary);\n    pointer-events: none;\n  }\n\n  .overview-completed-view .font-info button .bar-container,\n  .overview-completed-view .media-queries button .bar-container,\n  .overview-completed-view .unused-declarations button .bar-container {\n    flex: 1;\n    pointer-events: none;\n  }\n\n  .overview-completed-view .font-info button .bar,\n  .overview-completed-view .media-queries button .bar,\n  .overview-completed-view .unused-declarations button .bar {\n    height: 8px;\n    background: var(--sys-color-primary-bright);\n    border-radius: 2px;\n    min-width: 2px;\n  }\n\n  .overview-completed-view .font-info button,\n  .overview-completed-view .media-queries button,\n  .overview-completed-view .unused-declarations button {\n    border: none;\n    padding: 0;\n    padding-right: 10px;\n    margin: 0;\n    display: flex;\n    align-items: center;\n    border-radius: 2px;\n    cursor: pointer;\n    height: 28px;\n    background: none;\n\n    &:focus-visible {\n      outline: 2px solid var(--sys-color-state-focus-ring);\n    }\n\n    &:hover {\n      border-radius: 12px;\n      background: var(--sys-color-state-hover-on-subtle);\n    }\n\n    &:hover .details,\n    &:focus .details {\n      color: color-mix(in srgb, var(--sys-color-primary), var(--sys-color-state-hover-on-prominent) 6%);\n    }\n\n    &:hover .bar,\n    &:focus .bar {\n      background-color: color-mix(in srgb, var(--sys-color-primary-bright), var(--sys-color-state-hover-on-prominent) 6%);\n      color: var(--sys-color-on-primary);\n    }\n  }\n\n  .overview-completed-view .font-info .font-metric {\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));\n    gap: 12px;\n  }\n\n  .overview-completed-view .font-info ul {\n    padding: 0;\n  }\n\n  .overview-completed-view .font-info ul li {\n    grid-template-columns: 1fr 4fr;\n  }\n\n  .overview-completed-view .font-info h2 {\n    font-size: 14px;\n    font-weight: bold;\n    margin: 0 0 1em;\n  }\n\n  .overview-completed-view .font-info h3 {\n    font-size: 13px;\n    font-weight: normal;\n    font-style: italic;\n    margin: 0 0 0.5em;\n  }\n\n  .overview-completed-view .font-info {\n    padding-bottom: 0;\n  }\n\n  .overview-completed-view .font-family {\n    padding: var(--overview-default-padding);\n  }\n\n  .overview-completed-view .font-family:nth-child(2n+1) {\n    background: var(--sys-color-cdt-base-container);\n  }\n\n  .overview-completed-view .font-family:first-of-type {\n    padding-top: 0;\n  }\n\n  .contrast-warning {\n    display: flex;\n    align-items: center;\n    margin-top: 2px;\n  }\n\n  .contrast-warning .threshold-label {\n    font-weight: normal;\n    width: 30px;\n  }\n\n  .contrast-warning devtools-icon {\n    margin-left: 2px;\n  }\n\n  .contrast-preview {\n    padding: 0 5px;\n  }\n\n  .contrast-container-in-grid {\n    display: flex;\n    align-items: center;\n  }\n\n  .contrast-container-in-grid > * {\n    margin-right: 5px;\n    min-width: initial;\n  }\n\n  ::part(node-id-column) {\n    align-items: center;\n    height: 20px;\n\n    --show-element-display: none;\n  }\n\n  ::part(node-id-column):focus,\n  ::part(node-id-column):hover {\n    --show-element-display: inline-block;\n  }\n\n  ::part(show-element) {\n    display: var(--show-element-display);\n    height: 16px;\n    width: 16px;\n  }\n\n  .results-section.colors {\n    forced-color-adjust: none; /* show colors in high contrast theme */\n  }\n}\n", he = "/**\n * Copyright 2019 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n@scope to (devtools-widget > *) {\n  .overview-sidebar-panel {\n    display: flex;\n    background: var(--sys-color-cdt-base-container);\n    min-width: fit-content;\n    flex-direction: column;\n  }\n\n  .overview-sidebar-panel-item {\n    height: 30px;\n    padding-left: 30px;\n    display: flex;\n    align-items: center;\n    color: var(--sys-color-on-surface);\n    white-space: nowrap;\n\n    &:hover {\n      background: var(--sys-color-state-hover-on-subtle);\n    }\n\n    &:focus {\n      background: var(--sys-color-state-focus-highlight);\n    }\n\n    &.selected {\n      background: var(--sys-color-tonal-container);\n      color: var(--sys-color-on-tonal-container);\n    }\n  }\n\n  .overview-toolbar {\n    border-bottom: 1px solid var(--sys-color-divider);\n    flex: 0 0 auto;\n  }\n\n  .overview-sidebar-panel-item:focus-visible {\n    outline-width: unset;\n  }\n\n  @media (forced-colors: active) {\n    .overview-sidebar-panel-item.selected {\n      forced-color-adjust: none; /* crbug.com/1166705 workaround */\n      background: Highlight;\n      color: HighlightText;\n    }\n\n    .overview-sidebar-panel-item:hover {\n      forced-color-adjust: none; /* crbug.com/1166705 workaround */\n      background: Highlight;\n      color: HighlightText;\n    }\n  }\n}\n", ge = /* @__PURE__ */ e({
	CSSOverviewSidebarPanel: () => xe,
	DEFAULT_VIEW: () => be
}), { classMap: _e } = _, B = {
	clearOverview: "Clear overview",
	cssOverviewPanelSidebar: "CSS overview panel sidebar"
}, ve = i("panels/css_overview/CSSOverviewSidebarPanel.ts", B), ye = n.bind(void 0, ve), be = (e, t, n) => {
	l(h`
      <style>${he}</style>
      <div class="overview-sidebar-panel" @click=${(t) => {
		if (t.target instanceof HTMLElement) {
			let n = t.target.dataset.id;
			n && e.onItemClick(n);
		}
	}} @keydown=${(t) => {
		if (t.key === "Enter" || t.key === "ArrowUp" || t.key === "ArrowDown") {
			if (t.target instanceof HTMLElement) {
				let n = t.target.dataset.id;
				n && e.onItemKeyDown(n, t.key);
			}
			t.consume(!0);
		}
	}}
           aria-label=${ye(B.cssOverviewPanelSidebar)} role="tree">
        <div class="overview-toolbar">
          <devtools-toolbar>
            <devtools-button title=${ye(B.clearOverview)} @click=${e.onReset}
                .iconName=${"clear"} .variant=${c.TOOLBAR}
                .jslogContext=${"css-overview.clear-overview"}></devtools-button>
          </devtools-toolbar>
        </div>
        ${e.items.map(({ id: t, name: n }) => {
		let r = t === e.selectedId;
		return h`
            <div class="overview-sidebar-panel-item ${_e({ selected: r })}"
                ?autofocus=${r}
                role="treeitem" data-id=${t} tabindex="0"
                jslog=${d(`css-overview.${t}`).track({
			click: !0,
			keydown: "Enter|ArrowUp|ArrowDown"
		})}>
              ${n}
            </div>`;
	})}
      </div>`, n);
}, xe = class extends x {
	#e;
	#t = [];
	#n;
	#r = (e, t) => {};
	#i = () => {};
	constructor(e, t = be) {
		super(e, {
			useShadowDom: !0,
			delegatesFocus: !0
		}), this.#e = t;
	}
	performUpdate() {
		let e = {
			items: this.#t,
			selectedId: this.#n,
			onReset: this.#i,
			onItemClick: this.#o.bind(this),
			onItemKeyDown: this.#s.bind(this)
		};
		this.#e(e, {}, this.contentElement);
	}
	set items(e) {
		this.#t = e, this.requestUpdate();
	}
	set selectedId(e) {
		this.#a(e);
	}
	set onItemSelected(e) {
		this.#r = e, this.requestUpdate();
	}
	set onReset(e) {
		this.#i = e, this.requestUpdate();
	}
	#a(e, t = !1) {
		return this.#n = e, this.requestUpdate(), this.#r(e, t), this.updateComplete;
	}
	#o(e) {
		this.#a(e, !1);
	}
	#s(e, t) {
		if (t === "Enter") this.#a(e, !0);
		else {
			let n = -1;
			for (let t = 0; t < this.#t.length; t++) if (this.#t[t].id === e) {
				n = t;
				break;
			}
			if (n < 0) return;
			let r = (n + (t === "ArrowDown" ? 1 : -1)) % this.#t.length, i = this.#t[r].id;
			if (!i) return;
			this.#a(i, !1).then(() => {
				this.element.blur(), this.element.focus();
			});
		}
	}
}, Se = /* @__PURE__ */ e({
	CSSOverviewCompletedView: () => K,
	DEFAULT_VIEW: () => De,
	ELEMENT_DETAILS_DEFAULT_VIEW: () => Le,
	ElementDetailsView: () => Re
}), { styleMap: V, ref: H } = _, { widget: Ce } = C, U = {
	overviewSummary: "Overview summary",
	colors: "Colors",
	fontInfo: "Font info",
	unusedDeclarations: "Unused declarations",
	mediaQueries: "Media queries",
	elements: "Elements",
	externalStylesheets: "External stylesheets",
	inlineStyleElements: "Inline style elements",
	styleRules: "Style rules",
	typeSelectors: "Type selectors",
	idSelectors: "ID selectors",
	classSelectors: "Class selectors",
	universalSelectors: "Universal selectors",
	attributeSelectors: "Attribute selectors",
	nonsimpleSelectors: "Non-simple selectors",
	backgroundColorsS: "Background colors: {PH1}",
	textColorsS: "Text colors: {PH1}",
	fillColorsS: "Fill colors: {PH1}",
	borderColorsS: "Border colors: {PH1}",
	thereAreNoFonts: "There are no fonts.",
	thereAreNoUnusedDeclarations: "There are no unused declarations.",
	thereAreNoMediaQueries: "There are no media queries.",
	contrastIssues: "Contrast issues",
	nOccurrences: "{n, plural, =1 {# occurrence} other {# occurrences}}",
	contrastIssuesS: "Contrast issues: {PH1}",
	textColorSOverSBackgroundResults: "Text color {PH1} over {PH2} background results in low contrast for {PH3} elements",
	aa: "AA",
	aaa: "AAA",
	apca: "APCA",
	element: "Element",
	declaration: "Declaration",
	source: "Source",
	contrastRatio: "Contrast ratio",
	cssOverviewElements: "CSS overview elements",
	showElement: "Show element",
	unableToLink: "(unable to link)",
	unableToLinkToInlineStyle: "(unable to link to inline style)"
}, we = i("panels/css_overview/CSSOverviewCompletedView.ts", U), W = n.bind(void 0, we);
function Te(e) {
	let { h: t, s: n, l: r } = e.as(a.HSL);
	return t = Math.round(t * 360), n = Math.round(n * 100), r = Math.round(r * 100), r = Math.max(0, r - 15), `1px solid hsl(${t}deg ${n}% ${r}%)`;
}
var Ee = new Intl.NumberFormat("en-US"), De = (e, t, n) => {
	function r(e, t) {
		e && (e.scrollIntoView(), t && e.querySelector("button, [tabindex=\"0\"]")?.focus());
	}
	l(h`
      <style>${z}</style>
      <devtools-split-view direction="column" sidebar-position="first" sidebar-initial-size="200">
        <devtools-widget slot="sidebar" ${Ce(xe, {
		minimumSize: new oe(100, 25),
		items: [
			{
				name: W(U.overviewSummary),
				id: "summary"
			},
			{
				name: W(U.colors),
				id: "colors"
			},
			{
				name: W(U.fontInfo),
				id: "font-info"
			},
			{
				name: W(U.unusedDeclarations),
				id: "unused-declarations"
			},
			{
				name: W(U.mediaQueries),
				id: "media-queries"
			}
		],
		selectedId: e.selectedSection,
		onItemSelected: e.onSectionSelected,
		onReset: e.onReset
	})}>
        </devtools-widget>
        <devtools-split-view sidebar-position="second" slot="main" direction="row" sidebar-initial-size="minimized">
          <div class="vbox overview-completed-view" slot="main" @click=${e.onClick}>
            <!-- Dupe the styles into the main container because of the shadow root will prevent outer styles. -->
            <style>${z}</style>
            <div class="results-section horizontally-padded summary"
                  ${H((e) => {
		t.revealSection.set("summary", r.bind(null, e));
	})}>
              <h1>${W(U.overviewSummary)}</h1>
              ${Oe(e.elementCount, e.globalStyleStats, e.mediaQueries)}
            </div>
            <div class="results-section horizontally-padded colors"
                ${H((e) => {
		t.revealSection.set("colors", r.bind(null, e));
	})}>
                <h1>${W(U.colors)}</h1>
                ${ke(e.backgroundColors, e.textColors, e.textColorContrastIssues, e.fillColors, e.borderColors)}
              </div>
              <div class="results-section font-info"
                    ${H((e) => {
		t.revealSection.set("font-info", r.bind(null, e));
	})}>
                <h1>${W(U.fontInfo)}</h1>
                ${Me(e.fontInfo)}
              </div>
              <div class="results-section unused-declarations"
                    ${H((e) => {
		t.revealSection.set("unused-declarations", r.bind(null, e));
	})}>
                <h1>${W(U.unusedDeclarations)}</h1>
                ${Ae(e.unusedDeclarations)}
              </div>
              <div class="results-section media-queries"
                    ${H((e) => {
		t.revealSection.set("media-queries", r.bind(null, e));
	})}>
              <h1>${W(U.mediaQueries)}</h1>
              ${je(e.mediaQueries)}
            </div>
          </div>
          <devtools-widget slot="sidebar" ${Ce((e) => {
		let n = new u(e);
		return t.closeAllTabs = () => {
			n.closeTabs(n.tabIds());
		}, t.addTab = (e, t, r, i) => {
			n.hasTab(e) || n.appendTab(e, t, r, void 0, void 0, !0, void 0, void 0, i), n.selectTab(e), n.parentWidget().setSidebarMinimized(!1);
		}, n.addEventListener(g.TabClosed, (e) => {
			n.tabIds().length === 0 && n.parentWidget().setSidebarMinimized(!0);
		}), n;
	})}>
          </devtools-widget>
        </devtools-split-view>
      </devtools-split-view>`, n);
};
function Oe(e, t, n) {
	let r = (e, t) => h`
    <li>
      <div class="label">${e}</div>
      <div class="value">${Ee.format(t)}</div>
    </li>`;
	return h`<ul>
    ${r(W(U.elements), e)}
    ${r(W(U.externalStylesheets), t.externalSheets)}
    ${r(W(U.inlineStyleElements), t.inlineStyles)}
    ${r(W(U.styleRules), t.styleRules)}
    ${r(W(U.mediaQueries), n.length)}
    ${r(W(U.typeSelectors), t.stats.type)}
    ${r(W(U.idSelectors), t.stats.id)}
    ${r(W(U.classSelectors), t.stats.class)}
    ${r(W(U.universalSelectors), t.stats.universal)}
    ${r(W(U.attributeSelectors), t.stats.attribute)}
    ${r(W(U.nonsimpleSelectors), t.stats.nonSimple)}
  </ul>`;
}
function ke(e, t, n, r, i) {
	return h`
    <h2>${W(U.backgroundColorsS, { PH1: e.length })}</h2>
    <ul>${e.map((e) => G("background", e))}</ul>

    <h2>${W(U.textColorsS, { PH1: t.length })}</h2>
    <ul>${t.map((e) => G("text", e))}</ul>

    ${n.size > 0 ? Fe(n) : ""}

    <h2>${W(U.fillColorsS, { PH1: r.length })}</h2>
    <ul>${r.map((e) => G("fill", e))}</ul>

    <h2>${W(U.borderColorsS, { PH1: i.length })}</h2>
    <ul>${i.map((e) => G("border", e))}</ul>`;
}
function Ae(e) {
	return e.length > 0 ? Pe(e, "unused-declarations") : h`<div class="horizontally-padded">${W(U.thereAreNoUnusedDeclarations)}</div>`;
}
function je(e) {
	return e.length > 0 ? Pe(e, "media-queries") : h`<div class="horizontally-padded">${W(U.thereAreNoMediaQueries)}</div>`;
}
function Me(e) {
	return e.length > 0 ? h`${e.map(({ font: e, fontMetrics: t }) => h`
    <section class="font-family">
      <h2>${e}</h2>
      ${Ne(e, t)}
    </section>`)}` : h`<div>${W(U.thereAreNoFonts)}</div>`;
}
function Ne(e, t) {
	return h`
    <div class="font-metric">
      ${t.map(({ label: t, values: n }) => h`
        <div>
          <h3>${t}</h3>
          ${Pe(n, "font-info", `${e}/${t}`)}
        </div>`)}
    </div>`;
}
function Pe(e, t, n = "") {
	let r = e.reduce((e, t) => e + t.nodes.length, 0);
	return h`
      <ul aria-label=${t}>
        ${e.map(({ title: e, nodes: i }) => {
		let a = 100 * i.length / r, o = W(U.nOccurrences, { n: i.length });
		return h`<li>
            <div class="title">${e}</div>
            <button data-type=${t} data-path=${n} data-label=${e}
            jslog=${S().track({ click: !0 }).context(`css-overview.${t}`)}
            aria-label=${`${e}: ${o}`}>
              <div class="details">${o}</div>
              <div class="bar-container">
                <div class="bar" style=${V({ width: a })}></div>
              </div>
            </button>
          </li>`;
	})}
  </ul>`;
}
function Fe(e) {
	return h`
    <h2>${W(U.contrastIssuesS, { PH1: e.size })}</h2>
    <ul>
      ${[...e.entries()].map(([e, t]) => Ie(e, t))}
    </ul>`;
}
function Ie(e, t) {
	console.assert(t.length > 0);
	let n = t[0];
	for (let e of t) Math.abs(e.contrastRatio) < Math.abs(n.contrastRatio) && (n = e);
	let r = n.textColor.asString(a.HEXA), i = n.backgroundColor.asString(a.HEXA), o = s.instance().moduleSetting("apca").get(), c = W(U.textColorSOverSBackgroundResults, {
		PH1: r,
		PH2: i,
		PH3: t.length
	}), l = Te(n.backgroundColor.asLegacyColor());
	return h`<li>
    <button
      title=${c} aria-label=${c}
      data-type="contrast" data-key=${e} data-section="contrast" class="block"
      style=${V({
		color: r,
		backgroundColor: i,
		border: l
	})}
      jslog=${S("css-overview.contrast").track({ click: !0 })}>
      Text
    </button>
    <div class="block-title">
      ${o ? h`
        <div class="contrast-warning hidden">
          <span class="threshold-label">${W(U.apca)}</span>
          ${n.thresholdsViolated.apca ? q() : J()}
        </div>` : h`
        <div class="contrast-warning hidden">
          <span class="threshold-label">${W(U.aa)}</span>
          ${n.thresholdsViolated.aa ? q() : J()}
        </div>
        <div class="contrast-warning hidden">
          <span class="threshold-label">${W(U.aaa)}</span>
          ${n.thresholdsViolated.aaa ? q() : J()}
        </div>`}
    </div>
  </li>`;
}
function G(e, n) {
	let r = t(n)?.asLegacyColor();
	return r ? h`<li>
    <button title=${n} data-type="color" data-color=${n}
      data-section=${e} class="block"
      style=${V({
		backgroundColor: n,
		border: Te(r)
	})}
      jslog=${S("css-overview.color").track({ click: !0 })}>
    </button>
    <div class="block-title color-text">${n}</div>
  </li>` : y;
}
var K = class e extends x {
	onReset = () => {};
	#e = "summary";
	#t;
	#n;
	#r;
	#i;
	#a;
	#o;
	#s = {
		revealSection: /* @__PURE__ */ new Map(),
		closeAllTabs: () => {},
		addTab: (e, t, n, r) => {}
	};
	constructor(e, t = De) {
		super(e), this.#o = t, this.registerRequiredCSS(z), this.#r = new D(20, !0), this.#i = /* @__PURE__ */ new Map(), this.#a = null;
	}
	set target(e) {
		if (!e) return;
		let t = e.model(ie), n = e.model(te);
		if (!t || !n) throw Error("Target must provide CSS and DOM models");
		this.#t = t, this.#n = n;
	}
	#c(e, t) {
		let n = this.#s.revealSection.get(e);
		n && n(t);
	}
	#l() {
		this.#u(), this.onReset();
	}
	#u() {
		this.#s.closeAllTabs(), this.#i = /* @__PURE__ */ new Map(), e.pushedNodes.clear(), this.#e = "summary", this.requestUpdate();
	}
	#d(e) {
		if (!e.target) return;
		let t = e.target.dataset, n = t.type;
		if (!n || !this.#a) return;
		let r;
		switch (n) {
			case "contrast": {
				let e = t.section, i = t.key;
				if (!i) return;
				r = {
					type: n,
					key: i,
					nodes: this.#a.textColorContrastIssues.get(i) || [],
					section: e
				};
				break;
			}
			case "color": {
				let e = t.color, i = t.section;
				if (!e) return;
				let a;
				switch (i) {
					case "text":
						a = this.#a.textColors.get(e);
						break;
					case "background":
						a = this.#a.backgroundColors.get(e);
						break;
					case "fill":
						a = this.#a.fillColors.get(e);
						break;
					case "border": a = this.#a.borderColors.get(e);
				}
				if (!a) return;
				a = Array.from(a).map((e) => ({ nodeId: e })), r = {
					type: n,
					color: e,
					nodes: a,
					section: i
				};
				break;
			}
			case "unused-declarations": {
				let e = t.label;
				if (!e) return;
				let i = this.#a.unusedDeclarations.get(e);
				if (!i) return;
				r = {
					type: n,
					declaration: e,
					nodes: i
				};
				break;
			}
			case "media-queries": {
				let e = t.label;
				if (!e) return;
				let i = this.#a.mediaQueries.get(e);
				if (!i) return;
				r = {
					type: n,
					text: e,
					nodes: i
				};
				break;
			}
			case "font-info": {
				let e = t.label;
				if (!t.path) return;
				let [i, a] = t.path.split("/");
				if (!e) return;
				let o = this.#a.fontInfo.get(i);
				if (!o) return;
				let s = o.get(a);
				if (!s) return;
				let c = s.get(e);
				if (!c) return;
				let l = c.map((e) => ({ nodeId: e }));
				r = {
					type: n,
					name: `${e} (${i}, ${a})`,
					nodes: l
				};
				break;
			}
			default: return;
		}
		e.consume(), this.#f(r), this.requestUpdate();
	}
	performUpdate() {
		if (!this.#a || !("backgroundColors" in this.#a) || !("textColors" in this.#a)) return;
		let e = {
			elementCount: this.#a.elementCount,
			backgroundColors: this.#p(this.#a.backgroundColors),
			textColors: this.#p(this.#a.textColors),
			textColorContrastIssues: this.#a.textColorContrastIssues,
			fillColors: this.#p(this.#a.fillColors),
			borderColors: this.#p(this.#a.borderColors),
			globalStyleStats: this.#a.globalStyleStats,
			mediaQueries: this.#h(this.#a.mediaQueries),
			unusedDeclarations: this.#h(this.#a.unusedDeclarations),
			fontInfo: this.#m(this.#a.fontInfo),
			selectedSection: this.#e,
			onClick: this.#d.bind(this),
			onSectionSelected: this.#c.bind(this),
			onReset: this.#l.bind(this)
		};
		this.#o(e, this.#s, this.element);
	}
	#f(e) {
		let t = "", n = "";
		switch (e.type) {
			case "contrast": {
				let { section: r, key: i } = e;
				t = `${r}-${i}`, n = W(U.contrastIssues);
				break;
			}
			case "color": {
				let { section: r, color: i } = e;
				t = `${r}-${i}`, n = `${i.toUpperCase()} (${r})`;
				break;
			}
			case "unused-declarations": {
				let { declaration: r } = e;
				t = `${r}`, n = `${r}`;
				break;
			}
			case "media-queries": {
				let { text: r } = e;
				t = `${r}`, n = `${r}`;
				break;
			}
			case "font-info": {
				let { name: r } = e;
				t = `${r}`, n = `${r}`;
				break;
			}
		}
		let r = this.#i.get(t);
		if (!r) {
			if (!this.#n || !this.#t) throw Error("Unable to initialize CSS overview, missing models");
			r = new Re(this.#n, this.#t, this.#r), r.data = e.nodes, this.#i.set(t, r);
		}
		this.#s.addTab(t, n, r, e.type);
	}
	#p(e) {
		return Array.from(e.keys()).sort((e, n) => {
			let i = t(e)?.asLegacyColor(), a = t(n)?.asLegacyColor();
			return !i || !a ? 0 : r(a.rgba()) - r(i.rgba());
		});
	}
	#m(e) {
		return Array.from(e.entries()).map(([e, t]) => ({
			font: e,
			fontMetrics: Array.from(t.entries()).map(([e, t]) => ({
				label: e,
				values: this.#h(t)
			}))
		}));
	}
	#h(e) {
		return Array.from(e.entries()).sort((e, t) => {
			let n = e[1];
			return t[1].length - n.length;
		}).map(([e, t]) => ({
			title: e,
			nodes: t
		}));
	}
	set overviewData(e) {
		this.#a = e, this.requestUpdate();
	}
	static pushedNodes = /* @__PURE__ */ new Set();
}, Le = (e, t, n) => {
	let { items: r, visibility: i } = e;
	l(h`
    <div>
      <devtools-data-grid class="element-grid" striped inline
         name=${W(U.cssOverviewElements)}>
        <table>
          <tr>
            ${i.has("node-id") ? h`
              <th id="node-id" weight="50" sortable>
                ${W(U.element)}
              </th>` : y}
            ${i.has("declaration") ? h`
              <th id="declaration" weight="50" sortable>
                ${W(U.declaration)}
              </th>` : y}
            ${i.has("source-url") ? h`
              <th id="source-url" weight="100">
                ${W(U.source)}
              </th>` : y}
            ${i.has("contrast-ratio") ? h`
              <th id="contrast-ratio" weight="25" width="150px" sortable fixed>
                ${W(U.contrastRatio)}
              </th>` : y}
          </tr>
          ${r.map(({ data: e, link: t, showNode: n }) => h`
            <tr>
              ${i.has("node-id") ? ze(e, t, n) : y}
              ${i.has("declaration") ? Be(e) : y}
              ${i.has("source-url") ? Ve(e, t) : y}
              ${i.has("contrast-ratio") ? He(e) : y}
            </tr>`)}
        </table>
      </devtools-data-grid>
    </div>`, n);
}, Re = class extends T {
	#e;
	#t;
	#n;
	#r;
	#i;
	constructor(e, t, n, r = Le) {
		super(), this.#e = e, this.#t = t, this.#n = n, this.#i = r, this.#r = [];
	}
	set data(e) {
		this.#r = e, this.requestUpdate();
	}
	async performUpdate() {
		let e = /* @__PURE__ */ new Set();
		if (!this.#r.length) {
			this.#i({
				items: [],
				visibility: e
			}, {}, this.element);
			return;
		}
		let [t] = this.#r;
		"nodeId" in t && t.nodeId && e.add("node-id"), "declaration" in t && t.declaration && e.add("declaration"), "sourceURL" in t && t.sourceURL && e.add("source-url"), "contrastRatio" in t && t.contrastRatio && e.add("contrast-ratio");
		let n;
		if ("nodeId" in t && e.has("node-id")) {
			let e = this.#r.reduce((e, t) => {
				let n = t.nodeId;
				return K.pushedNodes.has(n) ? e : (K.pushedNodes.add(n), e.add(n));
			}, /* @__PURE__ */ new Set());
			n = await this.#e.pushNodesByBackendIdsToFrontend(e);
		}
		let r = await Promise.all(this.#r.map(async (t) => {
			let r, i;
			if ("nodeId" in t && e.has("node-id")) {
				let e = n?.get(t.nodeId) ?? null;
				e && (r = O.instance().linkify(e), i = () => e.scrollIntoView());
			}
			if ("range" in t && t.range && t.styleSheetId && e.has("source-url")) {
				let e = E.fromObject(t.range), n = this.#t.styleSheetHeaderForId(t.styleSheetId);
				if (n) {
					let t = n.lineNumberInSource(e.startLine), i = n.columnNumberInSource(e.startLine, e.startColumn), a = new p(n, t, i);
					r = h`${this.#n.linkifyCSSLocation(a)}`;
				}
			}
			return {
				data: t,
				link: r,
				showNode: i
			};
		}));
		this.#i({
			items: r,
			visibility: e
		}, {}, this.element);
	}
};
function ze(e, t, n) {
	return t ? h`
    <td>
      ${t}
      <devtools-icon part="show-element" name="select-element"
          title=${W(U.showElement)} tabindex="0"
          @click=${() => n?.()}></devtools-icon>
    </td>` : y;
}
function Be(e) {
	if (!("declaration" in e)) throw Error("Declaration entry is missing a declaration.");
	return h`<td>${e.declaration}</td>`;
}
function Ve(e, t) {
	return "range" in e && e.range ? t ? h`<td>${t}</td>` : h`<td>${W(U.unableToLink)}</td>` : h`<td>${W(U.unableToLinkToInlineStyle)}</td>`;
}
function He(e) {
	if (!("contrastRatio" in e)) throw Error("Contrast ratio entry is missing a contrast ratio.");
	let t = s.instance().moduleSetting("apca").get(), n = m(e.contrastRatio, 2), r = t ? n + "%" : n, i = Te(e.backgroundColor), a = e.textColor.asString(), o = e.backgroundColor.asString();
	return h`
    <td>
      <div class="contrast-container-in-grid">
          <span class="contrast-preview" style=${V({
		border: i,
		color: a,
		backgroundColor: o
	})}>Aa</span>
          <span>${r}</span>
          ${t ? h`
            <span>${W(U.apca)}</span>${e.thresholdsViolated.apca ? q() : J()}` : h`
            <span>${W(U.aa)}</span>${e.thresholdsViolated.aa ? q() : J()}
            <span>${W(U.aaa)}</span>${e.thresholdsViolated.aaa ? q() : J()}`}
      </div>
    </td>`;
}
function q() {
	return h`
    <devtools-icon name="clear" class="small" style="color:var(--icon-error);"></devtools-icon>`;
}
function J() {
	return h`
    <devtools-icon name="checkmark" class="small"
        style="color:var(--icon-checkmark-green);"></devtools-icon>`;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/components/panel_feedback/FeedbackButton.ts
var Ue = { feedback: "Feedback" }, We = i("ui/components/panel_feedback/FeedbackButton.ts", Ue), Ge = n.bind(void 0, We), Ke = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t = { feedbackUrl: "" };
	set data(e) {
		this.#t = e, k(this, this.#r);
	}
	#n() {
		v.openInNewTab(this.#t.feedbackUrl);
	}
	#r() {
		if (!A(this)) throw Error("FeedbackButton render was not scheduled");
		l(h`
      <devtools-button
          @click=${this.#n}
          .iconName=${"review"}
          .variant=${c.OUTLINED}
          .jslogContext=${"feedback"}
      >${Ge(Ue.feedback)}</devtools-button>
      `, this.#e, { host: this });
	}
};
customElements.define("devtools-feedback-button", Ke);
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/components/panel_feedback/panelFeedback.css.mjs
var qe = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  display: block;\n}\n\n.preview {\n  padding: 12px 16px;\n  border: 1px solid var(--sys-color-divider);\n  color: var(--sys-color-on-surface);\n  font-size: 13px;\n  line-height: 20px;\n  border-radius: 12px;\n  margin: 42px 0;\n  letter-spacing: 0.01em;\n}\n\nh2 {\n  color: var(--sys-color-primary);\n  font-size: 13px;\n  line-height: 20px;\n  letter-spacing: 0.01em;\n  margin: 9px 0 14px;\n  display: flex;\n  align-items: center;\n  gap: 5px;\n  font-weight: normal;\n}\n\nh3 {\n  font-size: 13px;\n  line-height: 20px;\n  letter-spacing: 0.04em;\n  color: var(--sys-color-on-surface);\n  margin-bottom: 2px;\n  font-weight: normal;\n}\n\n.preview p {\n  margin-bottom: 24px;\n}\n\n.thumbnail {\n  height: 92px;\n}\n\n.video {\n  display: flex;\n  flex-flow: row wrap;\n  gap: 20px;\n}\n\ndevtools-link {\n  color: var(--sys-color-primary);\n  text-decoration-line: underline;\n}\n\ndevtools-link.quick-start-link {\n  font-size: 14px;\n  line-height: 22px;\n  letter-spacing: 0.04em;\n}\n\n.video-description {\n  min-width: min-content;\n  flex-basis: min-content;\n  flex-grow: 1;\n}\n\n@media (forced-colors: active) {\n  devtools-link {\n    color: linktext;\n  }\n}\n", Y = {
	previewText: "Our team is actively working on this feature and we would love to know what you think.",
	previewTextFeedbackLink: "Send us your feedback.",
	previewFeature: "Preview feature",
	videoAndDocumentation: "Video and documentation"
}, Je = i("ui/components/panel_feedback/PanelFeedback.ts", Y), X = n.bind(void 0, Je), Ye = new URL("../../../Images/preview_feature_video_thumbnail.svg", new URL("ui/components/panel_feedback/PanelFeedback.js", typeof document < "u" ? document.baseURI : new URL("../../", self.location.href).href).href).toString(), Xe = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t = {
		feedbackUrl: "",
		quickStartUrl: "",
		quickStartLinkText: ""
	};
	set data(e) {
		this.#t = e, k(this, this.#n);
	}
	#n() {
		if (!A(this)) throw Error("PanelFeedback render was not scheduled");
		l(h`
      <style>${qe}</style>
      <div class="preview">
        <h2 class="flex">
          <devtools-icon name="experiment" class="extra-large" style="color: var(--icon-primary);"></devtools-icon> ${X(Y.previewFeature)}
        </h2>
        <p>${X(Y.previewText)} <devtools-link href=${this.#t.feedbackUrl} .jslogContext=${"feedback"}>${X(Y.previewTextFeedbackLink)}</devtools-link></p>
        <div class="video">
          <div class="thumbnail">
            <img src=${Ye} role="presentation" />
          </div>
          <div class="video-description">
            <h3>${X(Y.videoAndDocumentation)}</h3>
            <devtools-link class="quick-start-link" href=${this.#t.quickStartUrl} jslogcontext="css-overview.quick-start">${this.#t.quickStartLinkText}</devtools-link>
          </div>
        </div>
      </div>
      `, this.#e, { host: this });
	}
};
customElements.define("devtools-panel-feedback", Xe);
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/components/panel_feedback/previewToggle.css.mjs
var Ze = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  display: block;\n}\n\n.container {\n  display: flex;\n  flex-wrap: wrap;\n  padding: 4px;\n}\n\n.feedback,\n.learn-more {\n  display: flex;\n  align-items: center;\n}\n\n.helper {\n  flex-basis: 100%;\n  text-align: center;\n  font-style: italic;\n}\n\n.spacer {\n  flex: 1;\n}\n\n.devtools-link {\n  color: var(--sys-color-primary);\n  text-decoration-line: underline;\n  margin: 0 4px;\n}\n\n.feedback .devtools-link {\n  color: var(--sys-color-token-subtle);\n}\n", Z = {
	previewTextFeedbackLink: "Send us your feedback.",
	shortFeedbackLink: "Send feedback",
	learnMoreLink: "Learn More"
}, Qe = i("ui/components/panel_feedback/PreviewToggle.ts", Z), $e = n.bind(void 0, Qe), et = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t = "";
	#n = null;
	#r = null;
	#i;
	#a = "";
	#o;
	set data(e) {
		this.#t = e.name, this.#n = e.helperText, this.#r = e.feedbackURL, this.#i = e.learnMoreURL, this.#a = e.experiment, this.#o = e.onChangeCallback, this.#s();
	}
	#s() {
		let e = this.#a && se.isEnabled(this.#a);
		l(h`
      <style>${Ze}</style>
      <div class="container">
          <devtools-checkbox
            ?checked=${e}
            @change=${this.#c}
            aria-label=${this.#t} >
            <devtools-icon name="experiment" class="medium">
          </devtools-icon>${this.#t}
          </devtools-checkbox>
        <div class="spacer"></div>
        ${this.#r && !this.#n ? h`<div class="feedback"><devtools-link class="devtools-link" href=${this.#r} jslogContext=${"feedback"}>${$e(Z.shortFeedbackLink)}</devtools-link></div>` : y}
        ${this.#i ? h`<div class="learn-more"><devtools-link class="devtools-link" href=${this.#i} jslogContext=${"learn-more"}>${$e(Z.learnMoreLink)}</devtools-link></div>` : y}
        <div class="helper">
          ${this.#n && this.#r ? h`<p>${this.#n} <devtools-link class="devtools-link" href=${this.#r} jslogContext=${"feedback"}>${$e(Z.previewTextFeedbackLink)}</devtools-link></p>` : y}
        </div>
      </div>`, this.#e, { host: this });
	}
	#c(e) {
		let t = e.target.checked;
		this.#a && se.setEnabled(this.#a, t), this.#o?.(t);
	}
};
customElements.define("devtools-preview-toggle", et);
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/components/panel_introduction_steps/panelIntroductionSteps.css.mjs
var tt = "/*\n * Copyright 2022 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  display: block;\n}\n\nh1 {\n  font-weight: normal;\n  font-size: 18px;\n  line-height: 28px;\n  padding: 0;\n  margin-top: 0;\n  color: var(--sys-color-on-surface);\n}\n\n.intro-steps {\n  counter-reset: custom-counter;\n  list-style: none;\n  margin: 16px 0 30px 30px;\n  padding: 0;\n}\n\n.intro-steps li {\n  color: var(--sys-color-on-surface);\n  counter-increment: custom-counter;\n  font-size: 13px;\n  letter-spacing: 0.03em;\n  line-height: 1.54;\n  margin-bottom: 9px;\n  position: relative;\n}\n\n.intro-steps li::before {\n  --override-color-counter-background: var(--sys-color-tonal-container);\n\n  box-sizing: border-box;\n  background: var(--override-color-counter-background);\n  border-radius: 50%;\n  color: var(--sys-color-primary);\n  content: counter(custom-counter);\n  font-size: 12px;\n  height: 18px;\n  left: -30px;\n  line-height: 20px;\n  position: absolute;\n  text-align: center;\n  top: 0;\n  width: 18px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n", nt = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	connectedCallback() {
		k(this, this.#t);
	}
	#t() {
		if (!A(this)) throw Error("FeedbackButton render was not scheduled");
		l(h`
      <style>${tt}</style>
      <h1><slot name="title">slot: title</slot></h1>

      <ol class="intro-steps">
        <li><slot name="step-1">slot: step-1</slot></li>
        <li><slot name="step-2">slot: step-2</slot></li>
        <li><slot name="step-3">slot: step-3</slot></li>
      </ol>
    `, this.#e, { host: this });
	}
};
customElements.define("devtools-panel-introduction-steps", nt);
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/css_overview/cssOverviewStartView.css.mjs
var rt = "/**\n * Copyright 2019 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n@scope to (devtools-widget > *) {\n  h1 {\n    font-weight: normal;\n  }\n\n  .css-overview-start-view {\n    padding: 24px;\n    display: flex;\n    flex-direction: column;\n    background-color: var(--sys-color-cdt-base-container);\n    overflow: auto;\n  }\n\n  .start-capture-wrapper {\n    width: fit-content;\n  }\n\n  .preview-feature {\n    padding: 12px 16px;\n    border: 1px solid var(--sys-color-neutral-outline);\n    color: var(--sys-color-on-surface);\n    font-size: 13px;\n    line-height: 20px;\n    border-radius: 12px;\n    margin: 42px 0;\n    letter-spacing: 0.01em;\n  }\n\n  .preview-header {\n    color: var(--sys-color-primary);\n    font-size: 13px;\n    line-height: 20px;\n    letter-spacing: 0.01em;\n    margin: 9px 0 14px;\n  }\n\n  .preview-icon {\n    vertical-align: middle;\n  }\n\n  .feedback-prompt {\n    margin-bottom: 24px;\n  }\n\n  .feedback-prompt .devtools-link {\n    color: -webkit-link;\n    cursor: pointer;\n    text-decoration: underline;\n  }\n\n  .resources {\n    display: flex;\n    flex-direction: row;\n  }\n\n  .thumbnail-wrapper {\n    width: 144px;\n    height: 92px;\n    margin-right: 20px;\n  }\n\n  .video-doc-header {\n    font-size: 13px;\n    line-height: 20px;\n    letter-spacing: 0.04em;\n    color: var(--sys-color-on-surface);\n    margin-bottom: 2px;\n  }\n\n  devtools-feedback-button {\n    align-self: flex-end;\n  }\n\n  .resources .devtools-link {\n    font-size: 14px;\n    line-height: 22px;\n    letter-spacing: 0.04em;\n    text-decoration-line: underline;\n    color: var(--sys-color-primary);\n  }\n}\n", Q = {
	captureOverview: "Capture overview",
	identifyCSSImprovements: "Identify potential CSS improvements",
	capturePageCSSOverview: "Capture an overview of your page’s CSS",
	identifyCSSImprovementsWithExampleIssues: "Identify potential CSS improvements (e.g. low contrast issues, unused declarations, color or font mismatches)",
	locateAffectedElements: "Locate the affected elements in the Elements panel",
	quickStartWithCSSOverview: "Quick start: get started with the new CSS overview panel"
}, it = i("panels/css_overview/CSSOverviewStartView.ts", Q), $ = n.bind(void 0, it), at = "https://g.co/devtools/css-overview-feedback", ot = "https://developer.chrome.com/docs/devtools/css-overview", st = (e, t, n) => {
	l(h`
    <style>${rt}</style>
    <div class="css-overview-start-view">
      <devtools-panel-introduction-steps>
        <span slot="title">${$(Q.identifyCSSImprovements)}</span>
        <span slot="step-1">${$(Q.capturePageCSSOverview)}</span>
        <span slot="step-2">${$(Q.identifyCSSImprovementsWithExampleIssues)}</span>
        <span slot="step-3">${$(Q.locateAffectedElements)}</span>
      </devtools-panel-introduction-steps>
      <div class="start-capture-wrapper">
        <devtools-button
          class="start-capture"
          autofocus
          .variant=${c.PRIMARY}
          .jslogContext=${"css-overview.capture-overview"}
          @click=${e.onStartCapture}>
          ${$(Q.captureOverview)}
        </devtools-button>
      </div>
      <devtools-panel-feedback .data=${{
		feedbackUrl: at,
		quickStartUrl: ot,
		quickStartLinkText: $(Q.quickStartWithCSSOverview)
	}}>
      </devtools-panel-feedback>
      <devtools-feedback-button .data=${{ feedbackUrl: at }}>
      </devtools-feedback-button>
    </div>`, n);
}, ct = class extends T {
	#e;
	onStartCapture = () => {};
	constructor(e, t = st) {
		super(e, {
			useShadowDom: !0,
			delegatesFocus: !0
		}), this.#e = t, this.performUpdate();
	}
	performUpdate() {
		this.#e({ onStartCapture: this.onStartCapture }, {}, this.contentElement);
	}
}, lt = /* @__PURE__ */ e({
	CSSOverviewPanel: () => ft,
	DEFAULT_VIEW: () => dt
}), { widget: ut } = C, dt = (e, t, n) => {
	l(e.state === "start" ? ut(ct, { onStartCapture: e.onStartCapture }) : e.state === "processing" ? ut(me, { onCancel: e.onCancel }) : ut(K, {
		onReset: e.onReset,
		overviewData: e.overviewData,
		target: e.target
	}), n);
}, ft = class extends ee {
	#e;
	#t;
	#n;
	#r;
	#i;
	#a;
	#o;
	#s;
	#c;
	#l;
	#u;
	#d;
	#f;
	#p;
	constructor(e = dt) {
		super("css-overview"), this.#e = w.instance().inspectedURL(), w.instance().addEventListener(re.INSPECTED_URL_CHANGED, this.#h, this), this.#p = e, w.instance().observeTargets(this), this.#_();
	}
	#m() {
		ne.actionTaken(ae.CaptureCssOverviewClicked), this.#x();
	}
	#h() {
		this.#e !== w.instance().inspectedURL() && (this.#e = w.instance().inspectedURL(), this.#_());
	}
	targetAdded(e) {
		e === w.instance().primaryPageTarget() && (this.#t = e.model(F) ?? void 0);
	}
	targetRemoved() {}
	#g() {
		if (!this.#t) throw Error("Did not retrieve model information yet.");
		return this.#t;
	}
	#_() {
		this.#n = /* @__PURE__ */ new Map(), this.#r = /* @__PURE__ */ new Map(), this.#i = /* @__PURE__ */ new Map(), this.#a = /* @__PURE__ */ new Map(), this.#o = /* @__PURE__ */ new Map(), this.#s = /* @__PURE__ */ new Map(), this.#c = /* @__PURE__ */ new Map(), this.#l = 0, this.#u = {
			styleRules: 0,
			inlineStyles: 0,
			externalSheets: 0,
			stats: {
				type: 0,
				class: 0,
				id: 0,
				universal: 0,
				attribute: 0,
				nonSimple: 0
			}
		}, this.#d = /* @__PURE__ */ new Map(), this.#v();
	}
	#v() {
		this.#f = "start", this.performUpdate();
	}
	#y() {
		this.#f = "processing", this.performUpdate();
	}
	#b() {
		this.#f = "completed", this.performUpdate();
	}
	performUpdate() {
		let e = {
			state: this.#f,
			onStartCapture: this.#m.bind(this),
			onCancel: this.#_.bind(this),
			onReset: this.#_.bind(this),
			target: this.#t?.target(),
			overviewData: {
				backgroundColors: this.#n,
				textColors: this.#r,
				textColorContrastIssues: this.#d,
				fillColors: this.#i,
				borderColors: this.#a,
				globalStyleStats: this.#u,
				fontInfo: this.#o,
				elementCount: this.#l,
				mediaQueries: this.#s,
				unusedDeclarations: this.#c
			}
		};
		this.#p(e, {}, this.contentElement);
	}
	async #x() {
		this.#y();
		let e = this.#g(), [t, { elementCount: n, backgroundColors: r, textColors: i, textColorContrastIssues: a, fillColors: o, borderColors: s, fontInfo: c, unusedDeclarations: l }, u] = await Promise.all([
			e.getGlobalStylesheetStats(),
			e.getNodeStyleStats(),
			e.getMediaQueries()
		]);
		n && (this.#l = n), t && (this.#u = t), u && (this.#s = u), r && (this.#n = r), i && (this.#r = i), a && (this.#d = a), o && (this.#i = o), s && (this.#a = s), c && (this.#o = c), l && (this.#c = l), this.#b();
	}
};
//#endregion
export { Se as CSSOverviewCompletedView, P as CSSOverviewModel, lt as CSSOverviewPanel, I as CSSOverviewProcessingView, ge as CSSOverviewSidebarPanel, le as CSSOverviewUnusedDeclarations };
