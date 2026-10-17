import { n as e } from "./rolldown-runtime-DF993M8W.js";
import { D as t, H as n, J as r, K as i, W as a, _ as o, i as s, o as c, v as l } from "./common-DMSVbaSb.js";
import { $ as ee, $f as u, $i as d, Ao as te, Ar as ne, Bc as re, Fo as f, Ft as ie, Ht as ae, Jo as oe, Ko as se, Lo as ce, Na as le, No as ue, Oc as de, Or as fe, Po as p, Qi as pe, S as me, U as he, Uc as ge, Uf as _e, Uo as ve, Vf as ye, Vo as m, Wf as be, Wo as xe, Wr as Se, Yf as Ce, Yo as we, Zi as h, Zo as g, aa as Te, al as Ee, ap as De, cs as Oe, ei as ke, el as _, fa as v, ff as y, fp as Ae, ha as je, ii as Me, il as Ne, jd as b, jr as x, ka as Pe, kf as Fe, ls as Ie, mo as Le, na as Re, nf as ze, ni as Be, nl as Ve, no as S, oc as He, ol as Ue, pf as C, qo as We, qr as Ge, un as Ke, uo as qe, vi as Je, yo as Ye, za as Xe } from "./legacy-dM_vujv7.js";
import { p as w, r as Ze, s as Qe } from "./root-DdvV-xPu.js";
import "./platform-D4TUCh2P.js";
import { g as $e } from "./text_utils-DWSliayn.js";
import { M as et, P as tt } from "./StringUtilities-CMDxNrEc.js";
import { o as nt } from "./FormatterActions-D6HaA-6R.js";
import { P as rt, S as T, T as it, V as at, j as ot, w as st } from "./bindings-DyamxTH2.js";
import { $t as ct, At as lt, Gt as ut, Jt as E, K as dt, Kt as D, Qt as ft, Wt as pt, Xt as mt, Yt as ht, _t as gt, bt as _t, c as vt, cn as yt, ct as bt, dt as xt, en as St, ft as Ct, gn as wt, gt as Tt, ht as Et, it as Dt, jt as Ot, lt as kt, mt as At, o as jt, pn as Mt, q as Nt, qt as Pt, st as Ft, tn as It, ut as O, vt as Lt, yn as Rt, yt as zt } from "./common-Bs7hSOUj.js";
import { B as Bt, V as Vt, m as Ht, t as Ut, u as Wt, x as Gt } from "./elements-CiWscFTo.js";
import { t as Kt } from "./i18n-CTSaUtZW.js";
import { En as qt, Mt as Jt, Vr as Yt, t as Xt, vt as k } from "./snackbars-Dq3yf1tP.js";
import { t as Zt } from "./StorageItem-_wZ3i4k_.js";
import { n as Qt } from "./marked-CGxJO_CC.js";
import { n as $t, r as en } from "./UIRequestLocation-CtGcVN3I.js";
import { t as tn } from "./textInput.css-Ca_GEU1S.js";
import { t as nn } from "./utils-3dsE24eK.js";
import { a as rn } from "./perf_ui-B15al1e8.js";
import { l as an, n as on, t as sn } from "./lighthouse-B1qM_zXC.js";
import { t as cn, x as ln } from "./network-CzcqMGwP.js";
import { $ as un, J as dn, O as fn, Q as pn, S as mn, X as hn, Y as gn, Z as _n, _t as vn, at as yn, b as bn, ct as xn, dt as Sn, et as Cn, ft as wn, g as Tn, gt as En, it as Dn, l as On, lt as kn, mt as An, nt as jn, ot as Mn, p as Nn, pt as Pn, rt as Fn, st as In, tt as Ln, ut as Rn, vt as zn, x as Bn, yt as Vn } from "./timeline-BOm6TluW.js";
import { t as Hn } from "./markdown_view-D8BG91nk.js";
import { a as Un, n as Wn } from "./changes-BtlH668S.js";
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/ai_assistance/aiAssistancePanel.css.mjs
var Gn = "/*\n * Copyright 2024 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.toolbar-container {\n  display: flex;\n  flex-wrap: wrap;\n  background-color: var(--sys-color-cdt-base-container);\n  border-bottom: 1px solid var(--sys-color-divider);\n  flex: 0 0 auto;\n  justify-content: space-between;\n}\n\n.ai-assistance-view-container {\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  height: 100%;\n  align-items: center;\n  overflow: hidden;\n\n  & .fill-panel {\n    width: 100%;\n    height: 100%;\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: center;\n  }\n\n  devtools-split-view {\n    width: 100%;\n    height: 100%;\n  }\n}\n\n.toolbar-feedback-link {\n  color: var(--sys-color-primary);\n  margin: 0 var(--sys-size-3);\n  height: auto;\n  font-size: var(--sys-typescale-body4-size);\n}\n", { html: Kn } = ue, qn = class extends Hn {
	#e(e, n) {
		return Kn`<devtools-link @click=${(n) => {
			n.preventDefault(), n.stopPropagation(), t(e);
		}}>${tt(n, 100)}</devtools-link>`;
	}
	#t(e, t) {
		if (e.startsWith("#req-")) {
			let n = pt.instance().requests().find((t) => t.requestId() === e.substring(5));
			return n ? this.#e(n, n.url()) : Kn`${t}`;
		}
		if (e.startsWith("#file-")) {
			let n = Tt.getUISourceCodes().find((t) => Tt.uiSourceCodeId.get(t) === Number(e.substring(6)));
			return n ? this.#e(n, n.name()) : Kn`${t}`;
		}
		return null;
	}
	templateForToken(e) {
		if (e.type === "link") {
			let t = this.#t(e.href, e.text);
			if (t) return t;
		}
		if (e.type === "code") {
			let t = e.text.split("\n");
			t[0]?.trim() === "css" && (e.lang = "css", e.text = t.slice(1).join("\n"));
		}
		if (e.type === "codespan") {
			let t = e.text.match(/^\[(.*)\]\((.+)\)$/);
			if (t?.[2]) {
				let e = this.#t(t[2], t[1]);
				if (e) return e;
			}
		}
		return super.templateForToken(e);
	}
}, { html: Jn } = ce, { until: Yn } = xe, Xn = class extends qn {
	mainDocumentURL;
	constructor(e = "") {
		super(), this.mainDocumentURL = e;
	}
	#e(e) {
		let t = e.ownerDocument?.documentURL ?? "";
		return St(this.mainDocumentURL, t);
	}
	templateForToken(e) {
		if (e.type === "link" && e.href.startsWith("#")) {
			let t = this.#t(e.href);
			if (t) return Jn`<span>${Yn((t.type === "path" ? this.#r(t.path, e.text) : this.#n(t.nodeId, e.text)).then((t) => t || e.text), e.text)}</span>`;
		}
		return super.templateForToken(e);
	}
	#t(e) {
		if (e.startsWith("#path-")) return {
			type: "path",
			path: e.replace("#path-", "")
		};
		if (e.startsWith("#1,HTML")) return {
			type: "path",
			path: e.slice(1)
		};
		let t = "";
		if (e.startsWith("#node-") ? t = e.replace("#node-", "") : e.startsWith("#") && (t = e.slice(1)), t.trim() !== "") {
			let e = Number(t);
			if (Number.isInteger(e)) return {
				type: "node",
				nodeId: e
			};
		}
		return null;
	}
	async #n(e, t) {
		if (e === void 0) return;
		let n = b.instance().primaryPageTarget()?.model(_);
		if (!n) return;
		let r = (await n.pushNodesByBackendIdsToFrontend(/* @__PURE__ */ new Set([e])))?.get(e);
		if (r && this.#e(r)) return vt.instance().linkify(r, { textContent: t });
	}
	async #r(e, t) {
		let n = b.instance().primaryPageTarget()?.model(_);
		if (!n) return;
		let r = await n.pushNodeByPathToFrontend(e);
		if (!r) return;
		let i = n.nodeForId(r);
		if (i && this.#e(i)) return vt.instance().linkify(i, { textContent: t });
	}
}, Zn = "/*\n * Copyright 2024 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n@scope to (devtools-widget > *) {\n  .ai-assistance-feedback-row {\n    font-family: var(--default-font-family);\n    width: 100%;\n    display: flex;\n    justify-content: flex-start;\n    align-items: center;\n    margin-block: calc(-1 * var(--sys-size-3));\n    margin-top: var(--sys-size-5);\n    overflow: hidden;\n    mask-image: linear-gradient(to right, var(--ref-palette-neutral0) calc(100% - var(--sys-size-15)), transparent 100%);\n\n    &.not-v2 {\n      /* Can be removed when AIv2 ships */\n      gap: var(--sys-size-8);\n    }\n\n    .action-buttons {\n      display: flex;\n      align-items: center;\n      gap: var(--sys-size-2);\n      padding: var(--sys-size-4) 0;\n    }\n\n    .vertical-separator {\n      height: 16px;\n      width: 1px;\n      vertical-align: top;\n      margin: 0 var(--sys-size-2);\n      background: var(--sys-color-divider);\n      display: inline-block;\n    }\n\n    .suggestions-container {\n      overflow: hidden;\n      position: relative;\n      display: flex;\n\n      .suggestions-scroll-container {\n        display: flex;\n        overflow: auto hidden;\n        scrollbar-width: none;\n        gap: var(--sys-size-3);\n        padding: var(--sys-size-3);\n      }\n\n      .scroll-button-container {\n        position: absolute;\n        top: 0;\n        height: 100%;\n        display: flex;\n        align-items: center;\n        width: var(--sys-size-15);\n        z-index: 999;\n      }\n\n      .scroll-button-container.hidden {\n        display: none;\n      }\n\n      .scroll-button-container.left {\n        left: 0;\n        background:\n          linear-gradient(\n            90deg,\n            var(--sys-color-cdt-base-container) 0%,\n            var(--sys-color-cdt-base-container) 50%,\n            transparent\n          );\n      }\n\n      .scroll-button-container.right {\n        right: 0;\n        background:\n          linear-gradient(\n            90deg,\n            transparent,\n            var(--sys-color-cdt-base-container) 50%\n          );\n        justify-content: flex-end;\n      }\n    }\n  }\n\n  .feedback-form {\n    display: flex;\n    flex-direction: column;\n    gap: var(--sys-size-5);\n    margin-top: var(--sys-size-4);\n    background-color: var(--sys-color-surface3);\n    padding: var(--sys-size-6);\n    border-radius: var(--sys-shape-corner-medium-small);\n    max-width: var(--sys-size-32);\n\n    .feedback-input {\n      height: var(--sys-size-11);\n      padding: 0 var(--sys-size-5);\n      background-color: var(--sys-color-surface3);\n      width: auto;\n    }\n\n    .feedback-input::placeholder {\n      color: var(--sys-color-on-surface-subtle);\n      font: var(--sys-typescale-body4-regular);\n    }\n\n    .feedback-header {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n    }\n\n    .feedback-title {\n      margin: 0;\n      font: var(--sys-typescale-body3-medium);\n    }\n\n    .feedback-disclaimer {\n      padding: 0 var(--sys-size-4);\n    }\n  }\n\n  .user-query-wrapper {\n    display: flex;\n    justify-content: flex-end;\n    padding: 0 var(--sys-size-5);\n    align-items: center;\n  }\n\n  .chat-message {\n    user-select: text;\n    cursor: initial;\n    display: flex;\n    flex-direction: column;\n    gap: var(--sys-size-5);\n    width: 100%;\n    padding: var(--sys-size-7) var(--sys-size-5);\n    font-size: 12px;\n    word-break: normal;\n    overflow-wrap: anywhere;\n    border-bottom: var(--sys-size-1) solid var(--sys-color-divider);\n\n\n    &.query.ai-v2 {\n      width: fit-content;\n      max-width: 80%;\n      text-align: left;\n      padding: var(--sys-size-4) var(--sys-size-6);\n      font: var(--sys-typescale-body4-regular);\n      /* top left - top right - bottom right - bottom left */\n      border-radius: var(--sys-shape-corner-medium) var(--sys-shape-corner-extra-small) var(--sys-shape-corner-medium) var(--sys-shape-corner-medium);\n      background-color: var(--sys-color-surface5);\n      color: var(--sys-color-on-surface);\n\n      &.is-first-message {\n        /* So the first message doesn't bump right against the top\n         * toolbar */\n        margin-top: var(--sys-size-6);\n      }\n    }\n\n    &.ai-v2 {\n      border-bottom: none;\n    }\n\n    .ai-css-change {\n      margin: var(--sys-size-6) 0;\n    }\n\n    &:not(.ai-v2) .answer-body-wrapper {\n      display: flex;\n      flex-direction: column;\n      gap: var(--sys-size-5);\n      width: 100%;\n    }\n\n    &.ai-v2 .answer-body-wrapper {\n      @container(min-width: 700px) {\n        /* Purposefully not using design system variables, this is a\n         * specific size to indent the content in and align it with the\n         * walkthrough CTA. */\n        padding-left: 35px;\n      }\n    }\n\n    &.is-last-message {\n      border-bottom: 0;\n    }\n\n    .message-info {\n      display: flex;\n      align-items: center;\n      height: var(--sys-size-11);\n      gap: var(--sys-size-4);\n      font: var(--sys-typescale-body4-bold);\n\n      h2 {\n        font: var(--sys-typescale-body4-bold);\n      }\n    }\n\n    .actions {\n      display: flex;\n      flex-direction: column;\n      gap: var(--sys-size-8);\n      max-width: 100%;\n    }\n\n    .aborted {\n      color: var(--sys-color-on-surface-subtle);\n    }\n\n    .image-link {\n      width: fit-content;\n      border-radius: var(--sys-shape-corner-small);\n      outline-offset: var(--sys-size-2);\n\n      img {\n        max-height: var(--sys-size-20);\n        max-width: 100%;\n        border-radius: var(--sys-shape-corner-small);\n        border: 1px solid var(--sys-color-neutral-outline);\n        width: fit-content;\n        vertical-align: bottom;\n      }\n    }\n\n    .unavailable-image {\n      margin: var(--sys-size-4) 0;\n      display: inline-flex;\n      justify-content: center;\n      align-items: center;\n      height: var(--sys-size-17);\n      width: var(--sys-size-18);\n      background-color: var(--sys-color-surface3);\n      border-radius: var(--sys-shape-corner-small);\n      border: 1px solid var(--sys-color-neutral-outline);\n\n      devtools-icon {\n        color: var(--sys-color-state-disabled);\n      }\n    }\n  }\n\n  .indicator {\n    color: var(--sys-color-green-bright);\n  }\n\n  .summary {\n    display: grid;\n    grid-template-columns: auto 1fr auto;\n    padding: var(--sys-size-3);\n    line-height: var(--sys-size-9);\n    cursor: default;\n    gap: var(--sys-size-3);\n    justify-content: center;\n    align-items: center;\n\n    .title {\n      margin: 0;\n      text-overflow: ellipsis;\n      white-space: nowrap;\n      overflow: hidden;\n      font: var(--sys-typescale-body4-regular);\n\n      .paused {\n        font: var(--sys-typescale-body4-bold);\n      }\n    }\n  }\n\n  .step-code {\n    display: flex;\n    flex-direction: column;\n    gap: var(--sys-size-2);\n  }\n\n  .js-code-output {\n    devtools-code-block {\n      --code-block-max-code-height: 50px;\n    }\n  }\n\n  .context-details {\n    devtools-code-block {\n      --code-block-max-code-height: 80px;\n    }\n  }\n\n  .step {\n    width: fit-content;\n    background-color: var(--sys-color-surface3);\n    border-radius: 16px;\n    position: relative;\n\n    &.empty {\n      pointer-events: none;\n\n      .arrow {\n        display: none;\n      }\n    }\n\n    &:not(&[open]):hover::after {\n      content: '';\n      height: 100%;\n      width: 100%;\n      border-radius: inherit;\n      position: absolute;\n      top: 0;\n      left: 0;\n      pointer-events: none;\n      background-color: var(--sys-color-state-hover-on-subtle);\n    }\n\n    &.paused {\n      .indicator {\n        color: var(--sys-color-on-surface-subtle);\n      }\n    }\n\n    &.canceled {\n      .summary {\n        color: var(--sys-color-state-disabled);\n        text-decoration: line-through;\n      }\n\n      .indicator {\n        color: var(--sys-color-state-disabled);\n      }\n    }\n\n    devtools-markdown-view {\n      --code-background-color: var(--sys-color-surface1);\n    }\n\n    devtools-icon {\n      vertical-align: bottom;\n    }\n\n    devtools-spinner {\n      width: var(--sys-size-9);\n      height: var(--sys-size-9);\n      padding: var(--sys-size-2);\n    }\n\n    &[open] {\n      width: auto;\n\n      summary {\n        margin-bottom: var(--sys-size-2);\n      }\n\n      .summary .title {\n        white-space: normal;\n        overflow: unset;\n      }\n\n      .summary .arrow {\n        transform: rotate(180deg);\n      }\n    }\n\n    summary::marker {\n      content: '';\n    }\n\n    summary {\n      border-radius: 16px;\n\n      &:focus-visible {\n        outline: var(--sys-size-2) solid var(--sys-color-state-focus-ring);\n        outline-offset: var(--sys-size-2);\n      }\n    }\n\n    .step-details {\n      padding: 0 var(--sys-size-5) var(--sys-size-4) var(--sys-size-12);\n      display: flex;\n      flex-direction: column;\n      gap: var(--sys-size-6);\n\n      devtools-code-block {\n        --code-block-background-color: var(--sys-color-surface1);\n      }\n    }\n  }\n\n\n  .error-step {\n    color: var(--sys-color-error);\n  }\n\n  .side-effect-confirmation {\n    display: flex;\n    flex-direction: column;\n    gap: var(--sys-size-5);\n    padding-bottom: var(--sys-size-4);\n  }\n\n  .side-effect-buttons-container {\n    display: flex;\n    gap: var(--sys-size-4);\n  }\n\n  .walkthrough-toggle-container {\n    display: flex;\n    gap: var(--sys-size-2);\n    align-items: center;\n\n    &.has-widgets {\n      gap: var(--sys-size-6);\n    }\n\n    .chevron {\n      color: var(--sys-color-primary);\n      width: var(--sys-size-8);\n      height: var(--sys-size-8);\n      margin-left: var(--sys-size-2);\n    }\n  }\n\n\n  .computed-styles-widget {\n    display: block;\n    width: fit-content;\n  }\n\n  .styling-preview-widget {\n    width: 100%;\n    min-height: 100px;\n  }\n\n  .main-widgets-wrapper {\n    display: flex;\n    flex-direction: column;\n    gap: var(--sys-size-5);\n  }\n\n  .step-widgets-wrapper {\n    display: flex;\n    flex-direction: column;\n    align-items: flex-start;\n    gap: var(--sys-size-5);\n  }\n\n  .widget-header {\n    display: flex;\n    justify-content: space-between;\n    height: var(--sys-size-11);\n    align-items: center;\n    background: var(--sys-color-surface5);\n    padding: var(--sys-size-2) var(--sys-size-4);\n    border-top-left-radius: var(--sys-shape-corner-small);\n    border-top-right-radius: var(--sys-shape-corner-small);\n\n    .widget-name {\n      font: var(--sys-typescale-body4-regular);\n      margin: 0;\n      max-width: 80%;\n      overflow: hidden;\n      text-overflow: ellipsis;\n      white-space: nowrap; /* stop the titles going onto multiple lines */\n    }\n\n    /* This widget's title is some text + then a DOM node link, so it\n     * needs some extra styling */\n    .computed-style-title-wrapper {\n      display: flex;\n      align-items: center;\n      justify-content: flex-start;\n      gap: var(--sys-size-3);\n    }\n\n    .computed-style-title-prefix {\n      flex-shrink: 0;\n    }\n\n    .widget-reveal-container {\n      padding: 0;\n      background: none;\n      border-radius: 0;\n    }\n  }\n\n  .widget-reveal-button {\n    display: flex;\n    align-items: center;\n\n    devtools-icon {\n      margin-left: var(--sys-size-3);\n      color: var(--sys-color-primary);\n      width: var(--sys-size-8);\n      height: var(--sys-size-8);\n    }\n\n  }\n\n  .widget-and-revealer-container {\n    width: 100%;\n    min-width: var(--sys-size-30);\n    max-width: var(--sys-size-33);\n  }\n\n  .widget-reveal-container {\n    background: var(--sys-color-surface5);\n    border-bottom-right-radius: var(--sys-shape-corner-small);\n    border-bottom-left-radius: var(--sys-shape-corner-small);\n    padding: 0 var(--sys-size-4) var(--sys-size-4) 0;\n  }\n\n  .revealer-only .widget-reveal-container {\n    background: none;\n    border-radius: unset;\n  }\n\n  .widget-content-container {\n    padding: var(--sys-size-4) var(--sys-size-5);\n    border-top-left-radius: var(--sys-shape-corner-medium);\n    border-top-right-radius: var(--sys-shape-corner-medium);\n    overflow-x: auto;\n    background-color: var(--sys-color-surface3);\n\n    --override-computed-style-property-white-space: normal;\n\n    /* When header is present, content follows it and shouldn't have top radii */\n    .widget-header+& {\n      border-top-left-radius: 0;\n      border-top-right-radius: 0;\n    }\n\n    /* When header is present, content is the last child and needs bottom radii */\n    .widget-header+&:last-child {\n      border-bottom-left-radius: var(--sys-shape-corner-medium);\n      border-bottom-right-radius: var(--sys-shape-corner-medium);\n    }\n  }\n\n  .network-request-preview {\n    display: flex;\n    flex-direction: column;\n    gap: var(--sys-size-4);\n    margin-bottom: var(--sys-size-5);\n    padding-bottom: var(--sys-size-5);\n    border-bottom: 1px solid var(--sys-color-divider);\n\n    .network-request-header {\n      display: flex;\n      align-items: center;\n      gap: var(--sys-size-5);\n\n      .network-request-icon {\n        width: 32px;\n        height: 32px;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        background-color: var(--sys-color-surface1);\n        border-radius: var(--sys-shape-corner-small);\n        border: 1px solid var(--sys-color-divider);\n        overflow: hidden;\n\n        img {\n          max-width: 100%;\n          max-height: 100%;\n          object-fit: contain;\n        }\n\n        devtools-icon {\n          width: 20px;\n          height: 20px;\n        }\n      }\n\n      .network-request-details {\n        display: flex;\n        flex-direction: column;\n        overflow: hidden;\n\n        .network-request-name {\n          font: var(--sys-typescale-body4-bold);\n          overflow: hidden;\n          text-overflow: ellipsis;\n          white-space: nowrap;\n        }\n\n        .network-request-size {\n          font: var(--sys-typescale-body4-regular);\n          color: var(--sys-color-on-surface-subtle);\n        }\n      }\n    }\n  }\n}\n", Qn = /* @__PURE__ */ e({ getButtonLabel: () => er });
function $n(e, t) {
	if (e.length <= t) return {
		truncatedText: e,
		moreCharacters: 0
	};
	let n = e.lastIndexOf(" ", t), r = e.indexOf(" ", t), i = t;
	i = n === -1 && r === -1 ? t : n === -1 ? r : r === -1 || t - n <= r - t ? n : r;
	let a = e, o = 0;
	return i < e.length && (a = e.slice(0, i), o = e.length - i), {
		truncatedText: a,
		moreCharacters: o
	};
}
function er(e) {
	let t = "";
	if (t = e.isLoading && !e.isExpanded && e.stepTitle ? e.stepTitle : `${e.isExpanded ? "Hide" : "Show"} ${e.hasWidgets ? "AI walkthrough" : "thinking"}`, e.isLoading) return `Loading: ${t}`;
	let { truncatedText: n, moreCharacters: r } = $n(e.prompt, 50), i = r > 0 ? ` (and ${r} more characters)` : "";
	return `${t} for prompt ${n}${i}`;
}
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/ai_assistance/components/walkthroughView.css.mjs
var tr = "/*\n * Copyright 2026 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n@scope (devtools-widget) {\n  .walkthrough-view {\n    height: 100%;\n    background-color: var(--sys-color-cdt-base-container);\n    overflow: hidden;\n    display: flex;\n    flex-direction: column;\n  }\n}\n\n@scope (devtools-widget > *) {\n  .walkthrough-header {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    padding: 0 8px;\n    height: 35px;\n    border-bottom: 1px solid var(--sys-color-divider);\n    flex-shrink: 0;\n  }\n\n  .walkthrough-title {\n    font-size: 11px;\n    font-weight: 500;\n    color: var(--sys-color-on-surface);\n  }\n\n  .steps-container {\n    flex: 1;\n    overflow-y: auto;\n  }\n\n  .steps-scroll-content {\n    padding: var(--sys-size-6);\n    display: flex;\n    flex-direction: column;\n    gap: var(--sys-size-6);\n  }\n\n  .walkthrough-step {\n    display: flex;\n    gap: var(--sys-size-6);\n    align-items: flex-start;\n    justify-content: flex-start;\n    flex-shrink: 0;\n\n    .step-number {\n      font: var(--sys-typescale-body4-regular);\n      color: var(--sys-color-on-surface-subtle);\n      padding-top:var(--sys-size-4);\n      flex-grow: 0;\n      flex-shrink: 0;\n    }\n  }\n\n  .step-wrapper {\n    display: flex;\n    flex-direction: column;\n    gap: var(--sys-size-5);\n    min-width: 0;\n    width: 100%;\n  }\n\n  .step-container {\n    display: flex;\n    gap: var(--sys-size-5);\n    align-items: flex-start;\n  }\n\n  .step-icon {\n    color: var(--sys-color-on-surface-subtle);\n    width: var(--sys-size-8);\n    height: var(--sys-size-8);\n    flex-shrink: 0;\n    margin-top: var(--sys-size-2);\n  }\n\n  .step-content {\n    flex: 1;\n    font-size: 11px;\n    color: var(--sys-color-on-surface);\n    line-height: 1.4;\n  }\n\n  .empty-state {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    flex: 1;\n    color: var(--sys-color-on-surface-subtle);\n    font-size: 11px;\n  }\n\n  .inline-wrapper {\n    display: flex;\n    align-items: flex-start;\n    gap: var(--sys-size-2);\n    justify-content: flex-start;\n\n    .inline-icon {\n      display: block;\n    margin-top: var(--sys-size-2);\n    }\n  }\n\n  .walkthrough-inline {\n    border-radius: var(--sys-shape-corner-full);\n    overflow: hidden;\n    width: fit-content;\n    max-width: 100%;\n\n    &[open] {\n      border-radius: var(--sys-size-5);\n      width: auto;\n      background-color: var(--sys-color-surface2);\n      margin-left: calc(var(--sys-size-6) / 2);\n      flex-grow: 1;\n    }\n  }\n\n  .walkthrough-inline > summary {\n    display: flex;\n    align-items: center;\n    cursor: pointer;\n    background-color: transparent;\n    /* The same height as a DevTools Button */\n    height: var(--sys-size-11);\n    font: var(--sys-typescale-body4-regular);\n    font-weight:var(--ref-typeface-weight-medium);\n    user-select: none;\n    list-style: none; /* Hide default triangle */\n    justify-content: flex-start;\n    gap: var(--sys-size-4);\n    color: var(--sys-color-primary);\n    padding: 0 var(--sys-size-6);\n    overflow: hidden;\n\n    devtools-icon {\n      color: var(--sys-color-primary);\n    }\n\n    /* Align the summary to look like the tonal button */\n    &[data-has-widgets] {\n      background: var(--sys-color-tonal-container);\n      color: var(--sys-color-on-tonal-container);\n      border-radius: var(--sys-shape-corner-full);\n      margin-left: var(--sys-size-6);\n\n      devtools-icon {\n        color: var(--sys-color-on-tonal-container);\n      }\n    }\n\n    > .walkthrough-inline-title {\n      font: var(--sys-typescale-body4-regular);\n      font-weight: var(--ref-typeface-weight-medium);\n      overflow: hidden;\n      text-overflow: ellipsis;\n      white-space: nowrap;\n      min-width: 0;\n    }\n\n    &:focus-visible {\n      outline: var(--sys-size-2) solid var(--sys-color-state-focus-ring);\n      outline-offset: calc(-1 * var(--sys-size-2));\n    }\n  }\n\n  .walkthrough-inline[open] > summary {\n    border-radius: var(--sys-shape-corner-medium-small);\n    border-bottom-right-radius: 0;\n    border-bottom-left-radius: 0;\n    background: var(--sys-color-surface5);\n    color: var(--sys-color-on-surface);\n\n    &[data-has-widgets] {\n      margin-left: 0;\n    }\n\n    > devtools-icon[name='chevron-right'] {\n      transform: rotate(270deg);\n    }\n\n  }\n\n  .walkthrough-inline > summary::-webkit-details-marker {\n    display: none;\n  }\n\n  .walkthrough-inline > summary:hover {\n    background-color: var(--sys-color-state-hover-on-subtle);\n  }\n\n  .walkthrough-inline .steps-container {\n    padding: var(--sys-size-6);\n    border-top: 1px solid var(--sys-color-divider);\n    background-color: transparent;\n  }\n\n  .walkthrough-inline > summary > devtools-icon[name='chevron-right'] {\n    width: var(--sys-size-8);\n    height: var(--sys-size-8);\n    transition: transform 0.2s;\n    margin-left: auto;\n  }\n\n  .walkthrough-inline .step {\n    background-color: var(--sys-color-surface5);\n  }\n}\n", nr = /* @__PURE__ */ e({
	DEFAULT_VIEW: () => mr,
	WalkthroughView: () => hr,
	walkthroughCloseTitle: () => dr,
	walkthroughTitle: () => ur
}), rr = a, { html: A, render: ir, Directives: ar } = ue, { ref: or } = ar, sr = 2, j = {
	close: "Close",
	title: "Agent walkthrough",
	showThinking: "Show thinking",
	showAgentWalkthrough: "Show agent walkthrough",
	hideThinking: "Hide thinking",
	hideAgentWalkthrough: "Hide agent walkthrough",
	inProgress: "In progress"
}, cr = i("panels/ai_assistance/components/WalkthroughView.ts", j), lr = n.bind(void 0, cr);
function ur(e) {
	return e.isLoading ? Tr(e.lastStep) : e.hasWidgets ? rr(j.showAgentWalkthrough) : rr(j.showThinking);
}
function dr(e) {
	return e.isInlined ? lr(j.title) : e.hasWidgets ? rr(j.hideAgentWalkthrough) : rr(j.hideThinking);
}
function fr(e, t, n) {
	let r = n.at(-1);
	if (!e.isInlined || !r) return g;
	function i(t) {
		let n = t.target.open;
		e.message && (n ? e.onOpen(e.message) : e.onToggle(n, e.message));
	}
	let a = n.some((e) => e.widgets?.length), o = ft();
	return A`
    <div class="inline-wrapper" ?data-open=${e.isExpanded} jslog=${S("walkthrough-container")}>
      <span class="inline-icon">
        ${e.isLoading ? A`<devtools-spinner aria-label=${rr(j.inProgress)}></devtools-spinner>` : A`<devtools-icon name=${o}></devtools-icon>`}
      </span>
      <details class="walkthrough-inline" ?open=${e.isExpanded} @toggle=${i} jslog=${le("walkthrough").track({ click: !0 })}>
        <summary
          ?data-has-widgets=${!e.isLoading && a}
          aria-label=${er({
		isExpanded: e.isExpanded,
		isLoading: e.isLoading,
		hasWidgets: a,
		prompt: e.prompt,
		stepTitle: Tr(r)
	})}
        >
          <h2 class="walkthrough-inline-title">
            ${e.isExpanded ? dr({
		hasWidgets: a,
		isInlined: !0
	}) : ur({
		isLoading: e.isLoading,
		lastStep: r,
		hasWidgets: a
	})}
          </h2>
          <devtools-icon name="chevron-right"></devtools-icon>
        </summary>

        ${t}
      </details>
    </div>
  `;
}
function pr(e, t, n) {
	return e.isInlined ? g : A`
    <div class="walkthrough-view" jslog=${S("walkthrough-container")}>
      <div class="walkthrough-header">
         <h2 class="walkthrough-title">${lr(j.title)}</h2>
         <devtools-button
          .data=${{
		variant: d.TOOLBAR,
		iconName: "cross",
		title: lr(j.close),
		jslogContext: "close-walkthrough"
	}}
          @click=${() => {
		e.message && e.onToggle(!1, e.message);
	}}
        ></devtools-button>
      </div>
      ${t}
      ${n === 0 ? A`
        <div class="empty-state">
          <p>No walkthrough steps available yet.</p>
        </div>
      ` : g}
    </div>
  `;
}
var mr = (e, t, n) => {
	let r = e.message?.parts.filter((e) => e.type === "step")?.map((e) => e.step) ?? [], i = r.filter((e) => !e.requestApproval), a = i.length > 0 ? A`
    <div class="steps-container" @scroll=${e.handleScroll} ${or((e) => {
		t.scrollContainer = e;
	})}>
      <div class="steps-scroll-content" ${or((e) => {
		t.stepsContainer = e;
	})}>
        ${i.map((t, n) => A`
          <div class="walkthrough-step">
            <span class="step-number">${n + 1}</span>
            <div class="step-wrapper">
              ${Nr({
		step: t,
		isLoading: e.isLoading,
		markdownRenderer: e.markdownRenderer,
		isLast: n === i.length - 1
	})}
            </div>
          </div>
        `)}
      </div>
    </div>
  ` : g;
	ir(A`
    <style>
      ${tn}
      ${Zn}
      ${tr}
    </style>
    ${e.isInlined ? fr(e, a, r) : pr(e, a, i.length)}`, n);
}, hr = class extends Be {
	#e;
	#t = null;
	#n = !1;
	#r = null;
	#i = () => {};
	#a = () => {};
	#o = !1;
	#s = !1;
	#c = "";
	#l = !0;
	#u = !1;
	#d = {};
	#f = new ResizeObserver(() => this.#h());
	#p = 0;
	constructor(e, t = mr) {
		super(e), this.#e = t, this.setMinimumSize(330, 0);
	}
	wasShown() {
		super.wasShown(), this.#m();
	}
	willHide() {
		super.willHide(), this.#f.disconnect();
	}
	#m() {
		this.#d.stepsContainer && this.#f.observe(this.#d.stepsContainer);
	}
	#h() {
		let e = this.#d.stepsContainer?.offsetWidth ?? 0;
		if (e !== this.#p) {
			this.#p = e;
			return;
		}
		this.#l && this.#n && this.scrollToBottom();
	}
	scrollToBottom() {
		this.#d.stepsContainer && (this.#u = !0, window.requestAnimationFrame(() => {
			let e = this.#d.stepsContainer?.lastElementChild;
			e && e.scrollIntoView({
				behavior: "smooth",
				block: "end"
			});
		}));
	}
	#g = (e) => {
		if (e.target && e.target instanceof HTMLElement) {
			if (this.#u) {
				e.target.scrollTop + e.target.clientHeight + sr >= e.target.scrollHeight && (this.#u = !1);
				return;
			}
			this.#l = e.target.scrollTop + e.target.clientHeight + sr >= e.target.scrollHeight;
		}
	};
	set isLoading(e) {
		this.#n = e, this.requestUpdate();
	}
	get isLoading() {
		return this.#n;
	}
	get markdownRenderer() {
		return this.#r;
	}
	set markdownRenderer(e) {
		this.#r = e, this.requestUpdate();
	}
	get message() {
		return this.#t;
	}
	get onOpen() {
		return this.#a;
	}
	set onOpen(e) {
		this.#a = e, this.requestUpdate();
	}
	set message(e) {
		this.#t = e, this.requestUpdate();
	}
	set onToggle(e) {
		this.#i = e, this.requestUpdate();
	}
	set isInlined(e) {
		this.#o = e, this.requestUpdate();
	}
	set isExpanded(e) {
		this.#s = e, this.requestUpdate();
	}
	get prompt() {
		return this.#c;
	}
	set prompt(e) {
		this.#c = e, this.requestUpdate();
	}
	performUpdate() {
		if (!this.#r) return;
		let e = this.#t ? Yr(this.#t) : null;
		this.#e({
			isLoading: this.#n,
			markdownRenderer: this.#r,
			onToggle: this.#i,
			onOpen: this.#a,
			isInlined: this.#o,
			isExpanded: this.#s,
			prompt: this.#c,
			message: e,
			handleScroll: this.#g
		}, this.#d, this.contentElement), this.#m(), this.#l && this.#n && this.scrollToBottom();
	}
}, gr = /* @__PURE__ */ e({
	ChatMessage: () => ti,
	ChatMessageEntity: () => Sr,
	DEFAULT_VIEW: () => Cr,
	getDeduplicatedWidgetsMessage: () => Yr,
	getWidgetSignature: () => Jr,
	renderStep: () => Nr,
	titleForStep: () => Tr
}), { html: M, Directives: { ref: _r, ifDefined: vr } } = ue, N = a, { widget: P } = Me, yr = "https://crbug.com/508304827", br = 1, xr = 11, F = {
	thumbsUp: "Good response",
	thumbsDown: "Bad response",
	provideFeedbackPlaceholder: "Provide additional feedback",
	disclaimer: "Submitted feedback will also include your conversation",
	submit: "Submit",
	whyThisRating: "Why did you choose this rating? (optional)",
	close: "Close",
	report: "Report legal issue",
	scrollToNext: "Scroll to next suggestions",
	scrollToPrevious: "Scroll to previous suggestions",
	copyResponse: "Copy response",
	systemError: "Something unforeseen happened and I can no longer continue. Try your request again and see if that resolves the issue. If this keeps happening, update Chrome to the latest version.",
	maxStepsError: "Seems like I am stuck with the investigation. It would be better if you start over.",
	crossOriginError: "I have selected the new context but you will have to start a new chat.",
	stoppedResponse: "You stopped this response",
	confirmActionRequestApproval: "Continue",
	declineActionRequestApproval: "Cancel",
	ai: "AI",
	gemini: "Gemini",
	investigating: "Investigating",
	paused: "Paused",
	codeExecuted: "Code executed",
	codeToExecute: "Code to execute",
	dataReturned: "Data returned",
	completed: "Completed",
	inProgress: "In progress",
	aborted: "Aborted",
	imageInputSentToTheModel: "Image input sent to the model",
	openImageInNewTab: "Open image in a new tab",
	imageUnavailable: "Image unavailable",
	reveal: "Reveal",
	revealTrace: "Reveal trace",
	revealComputedStyles: "Reveal computed styles",
	revealCoreWebVitals: "Reveal Core Web Vitals",
	revealStyleProperties: "Reveal style properties",
	revealLcpBreakdown: "Reveal LCP breakdown",
	revealLcpDiscovery: "Reveal LCP discovery",
	revealClsCulprits: "Reveal layout shift culprits",
	revealRenderBlockingBreakdown: "Reveal render-blocking requests",
	revealLcpElement: "Reveal LCP element",
	revealPerformanceSummary: "Reveal performance summary",
	revealBottomUpTree: "Reveal bottom-up thread activity",
	revealNetworkDependencyTree: "Reveal network dependency tree",
	revealThirdParties: "Reveal 3rd parties",
	coreVitals: "Core Web Vitals",
	lighthouseReport: "Lighthouse report",
	revealLighthouse: "Reveal Lighthouse report",
	timelineEventSummary: "Event summary",
	revealTimelineEventSummary: "Reveal event",
	lcpBreakdown: "LCP breakdown",
	lcpDiscovery: "LCP discovery",
	clsCulprits: "Layout shift culprits",
	renderBlockingBreakdown: "Render-blocking requests",
	networkDependencyTree: "Network dependency tree",
	thirdParties: "3rd parties",
	lcpElement: "LCP element",
	performanceSummary: "Performance summary",
	exportForAgents: "Copy to coding agent",
	bottomUpTree: "Bottom-up thread activity",
	revealForcedReflow: "Reveal forced reflow",
	forcedReflow: "Forced reflow",
	revealCache: "Reveal efficient cache lifetimes",
	cache: "Efficient cache lifetimes",
	revealInpBreakdown: "Reveal INP breakdown",
	inpBreakdown: "INP breakdown",
	revealDocumentLatency: "Reveal document latency",
	documentLatency: "Document latency",
	revealDomSize: "Reveal DOM size",
	domSize: "DOM size",
	revealDuplicateJavaScript: "Reveal duplicated JavaScript",
	duplicateJavaScript: "Duplicated JavaScript",
	revealImageDelivery: "Reveal image delivery",
	imageDelivery: "Image delivery",
	revealFontDisplay: "Reveal font display",
	fontDisplay: "Font display",
	revealSlowCssSelector: "Reveal slow CSS selectors",
	slowCssSelector: "Slow CSS selectors",
	revealLegacyJavaScript: "Reveal legacy JavaScript",
	legacyJavaScript: "Legacy JavaScript",
	revealViewport: "Reveal viewport optimization",
	viewport: "Viewport optimization",
	revealNetworkRequest: "Reveal network request",
	networkRequest: "Network request",
	revealModernHttp: "Reveal modern HTTP usage",
	modernHttp: "Modern HTTP usage",
	revealCharacterSet: "Reveal character set declaration",
	characterSet: "Character set declaration"
}, Sr = /* @__PURE__ */ function(e) {
	return e.MODEL = "model", e.USER = "user", e;
}({}), Cr = (e, t, n) => {
	let r = !!w.devToolsAiAssistanceV2?.enabled, i = e.message;
	if (i.entity === "user") {
		let t = i.imageInput && "inlineData" in i.imageInput ? $r(i.imageInput.inlineData) : g, a = m({
			"chat-message": !0,
			query: !0,
			"is-last-message": e.isLastMessage,
			"is-first-message": e.isFirstMessage,
			"ai-v2": r
		}), o = m({ "user-query-wrapper": r });
		f(M`
      <style>${tn}</style>
      <style>${Zn}</style>
      <div class=${o}>
        <section class=${a} jslog=${S("question")}>
          ${t}
          <div class="message-content">${wr(i.text, e.markdownRenderer)}</div>
        </section>
      </div>
    `, n);
		return;
	}
	let a = i.parts.filter((e) => e.type === "step").map((e) => e.step), o = ft(), s = m({
		"chat-message": !0,
		answer: !0,
		"is-last-message": e.isLastMessage,
		"is-first-message": e.isFirstMessage,
		"ai-v2": r
	});
	f(M`
    <style>${tn}</style>
    <style>${Zn}</style>
    <section class=${s} jslog=${S("answer")}>
      ${r ? g : M`
        <div class="message-info">
          <devtools-icon name=${o}></devtools-icon>
          <div class="message-name">
            <h2>${ct() ? N(F.gemini) : N(F.ai)}</h2>
          </div>
        </div>`}
      ${r ? Ar(e, a) : g}
      <div class="answer-body-wrapper">
        ${se(i.parts, (e, t) => t, (t, n) => {
		let a = n === i.parts.length - 1;
		return t.type === "answer" ? M`<p>${wr(t.text, e.markdownRenderer, { animate: !e.isReadOnly && e.isLoading && a && e.isLastMessage })}</p>` : t.type === "widget" ? M`${We(Xr(t.widgets, { wrapperClass: "main-widgets-wrapper" }))}` : !r && t.type === "step" ? Nr({
			step: t.step,
			isLoading: e.isLoading,
			markdownRenderer: e.markdownRenderer,
			isLast: a
		}) : g;
	})}
        ${Qr(i)}
        ${e.shouldShowCSSChangeSummary && r && e.changeSummary ? M`
          <devtools-code-block
            .code=${e.changeSummary}
            .codeLang=${"css"}
            .displayLimit=${xr}
            .displayNotice=${!0}
            class="ai-css-change"
          ></devtools-code-block>
        ` : g}
        ${e.showActions ? ei(e, t) : g}
      </div>
      ${r ? jr(e, a) : g}
    </section>
  `, n);
};
function wr(e, t, { animate: n, ref: r } = {}) {
	let i = [];
	try {
		i = Qt(e);
		for (let e of i) t.renderToken(e);
	} catch {
		return M`${e}`;
	}
	return M`<devtools-markdown-view
    .data=${{
		tokens: i,
		renderer: t,
		animationEnabled: n
	}}
    ${r ? _r(r) : g}>
  </devtools-markdown-view>`;
}
function Tr(e) {
	return e.title ?? `${N(F.investigating)}…`;
}
function Er(e) {
	let t = e.requestApproval ? M`<span class="paused">${N(F.paused)}: </span>` : g;
	return M`<h3 class="title" aria-label=${Tr(e)}>${t}${Tr(e)}</h3>`;
}
function Dr(e) {
	if (!e.code && !e.output) return g;
	let t = e.output && !e.canceled ? N(F.codeExecuted) : N(F.codeToExecute);
	return M`<div class="step-code">${e.code ? M`<div class="action-result">
      <devtools-code-block
        .code=${e.code.trim()}
        .codeLang=${"js"}
        .displayNotice=${!e.output}
        .header=${t}
        .showCopyButton=${!0}
      ></devtools-code-block>
  </div>` : g}${e.output ? M`<div class="js-code-output">
    <devtools-code-block
      .code=${e.output}
      .codeLang=${"js"}
      .displayNotice=${!0}
      .header=${N(F.dataReturned)}
      .showCopyButton=${!1}
    ></devtools-code-block>
  </div>` : g}</div>`;
}
function Or({ step: e, markdownRenderer: t, isLast: n }) {
	let r = n && e.requestApproval ? Zr(e) : g, i = e.thought ? M`<p>${wr(e.thought, t)}</p>` : g, a = e.contextDetails ? M`${se(e.contextDetails, (e) => M`<div class="context-details">
      <devtools-code-block
        .code=${e.text}
        .codeLang=${e.codeLang || ""}
        .displayNotice=${!1}
        .header=${e.title}
        .showCopyButton=${!0}
      ></devtools-code-block>
    </div>`)}` : g;
	return M`<div class="step-details">
    ${i}
    ${Dr(e)}
    ${r}
    ${a}
  </div>`;
}
function kr(e, t) {
	let { message: n, walkthrough: r } = e, i = t.at(-1);
	if (r.isInlined || !i) return g;
	let a = t.some((e) => e.widgets?.length), o = r.isExpanded && e.message.id === e.walkthrough.activeSidebarMessage?.id, s = o ? dr({ hasWidgets: a }) : ur({
		isLoading: e.isLoading,
		hasWidgets: a,
		lastStep: i
	}), c = a && !e.isLoading ? d.TONAL : d.TEXT, l = ft(), ee = m({
		"walkthrough-toggle-container": !0,
		"has-widgets": a && !e.isLoading
	}), u = er({
		isExpanded: o,
		isLoading: e.isLoading,
		hasWidgets: a,
		prompt: e.prompt,
		stepTitle: Tr(i)
	});
	return M`
    <div class=${ee}>
      ${e.isLoading ? M`<devtools-spinner></devtools-spinner>` : M`<devtools-icon name=${l}></devtools-icon>`}
      <devtools-button
        .variant=${c}
        .size=${h.SMALL}
        .title=${i.isLoading ? Tr(i) : s}
        .accessibleLabel=${u}
        .jslogContext=${r.isExpanded ? "ai-hide-walkthrough-sidebar" : "ai-show-walkthrough-sidebar"}
        data-show-walkthrough
        @click=${() => {
		r.activeSidebarMessage?.id === e.message.id && r.isExpanded ? r.onToggle(!1, n) : r.onOpen(n);
	}}>${s}<devtools-icon class="chevron" .name=${o ? "cross" : "chevron-right"}></devtools-icon>
      </devtools-button>
    </div>
  `;
}
function Ar(e, t) {
	if (!t.at(-1)) return g;
	let n = e.walkthrough.isInlined ? g : kr(e, t), r = e.walkthrough.isInlined ? e.walkthrough.inlineExpandedMessages.some((t) => t.id === e.message.id) : e.walkthrough.isExpanded && e.walkthrough.activeSidebarMessage?.id === e.message.id;
	return M`
    ${n}
    ${e.walkthrough.isInlined ? M`
    <div class="walkthrough-container">
      ${P(hr, {
		message: e.message,
		isLoading: e.isLoading && e.isLastMessage,
		markdownRenderer: e.markdownRenderer,
		isInlined: !0,
		isExpanded: r,
		prompt: e.prompt,
		onToggle: e.walkthrough.onToggle,
		onOpen: e.walkthrough.onOpen
	})}
    </div>
  ` : g}
  `;
}
function jr(e, t) {
	let n = t.filter((e) => e.requestApproval);
	return n.length === 0 ? g : M`
    ${n.map((t) => M`
      <div class="side-effect-container">
        ${Nr({
		step: t,
		isLoading: e.isLoading,
		markdownRenderer: e.markdownRenderer,
		isLast: !0
	})}
      </div> `)}
  `;
}
function Mr({ step: e, isLoading: t, isLast: n }) {
	if (t && n && !e.requestApproval) return M`<devtools-spinner aria-label=${N(F.inProgress)}></devtools-spinner>`;
	let r = "checkmark", i = N(F.completed), a = "button";
	return n && e.requestApproval ? (a = void 0, i = N(F.paused), r = "pause-circle") : e.canceled && (i = N(F.aborted), r = "cross"), M`<devtools-icon
      class="indicator"
      role=${vr(a)}
      aria-label=${vr(i)}
      .name=${r}
    ></devtools-icon>`;
}
function Nr({ step: e, isLoading: t, markdownRenderer: n, isLast: r }) {
	return M`
    <details class=${m({
		step: !0,
		empty: !e.thought && !e.code && !e.contextDetails && !e.requestApproval,
		paused: !!e.requestApproval,
		canceled: !!e.canceled
	})}
      jslog=${le("step").track({ click: !0 })}
      .open=${!!e.requestApproval}>
      <summary>
        <div class="summary">
          ${Mr({
		step: e,
		isLoading: t,
		isLast: r
	})}
          ${Er(e)}
          <devtools-icon
            class="arrow"
            name="chevron-down"
          ></devtools-icon>
        </div>
      </summary>
      ${Or({
		step: e,
		markdownRenderer: n,
		isLast: r
	})}
    </details>
    ${We(Xr(e.widgets, { wrapperClass: "step-widgets-wrapper" }))}
    `;
}
var Pr = /* @__PURE__ */ new Map();
async function Fr(e) {
	let t = Pr.get(e);
	if (t) return t;
	let n = b.instance().primaryPageTarget();
	if (!n) return null;
	let r = await new Ee(n, e).resolvePromise();
	return r && Pr.set(e, r), r;
}
async function Ir(e) {
	let t = await Fr(e.data.backendNodeId);
	if (!t) return null;
	let n = new Bt(t, e.data.computedStyles), r = null;
	try {
		r = new RegExp(e.data.properties.join("|"), "i");
	} catch {
		return null;
	}
	return {
		renderedWidget: M`<devtools-widget
      class="computed-styles-widget" ${P(Gt, {
			nodeStyle: n,
			matchedStyles: e.data.matchedCascade,
			propertyTraces: null,
			allowUserControl: !1,
			filterText: r,
			enableNarrowViewResizing: !1
		})}></devtools-widget>`,
		revealable: new Wt(t),
		accessibleRevealLabel: N(F.revealComputedStyles),
		title: M`
      <span class="computed-style-title-wrapper">
        <span class="computed-style-title-prefix">Computed styles</span>
        <span class="style-class-wrapper">
          (<devtools-widget
            ${P(jt, { node: t })}
          ></devtools-widget>)
        </span>
      </span>`,
		jslogContext: "computed-styles"
	};
}
async function Lr(e) {
	return {
		renderedWidget: M`<devtools-widget class="core-vitals-widget" ${P(gn, {
			data: e.data,
			skipBottomBorder: !0
		})}>
  </devtools-widget>`,
		revealable: new vn(e.data.insightSetKey),
		accessibleRevealLabel: N(F.revealCoreWebVitals),
		title: N(F.coreVitals),
		jslogContext: "core-web-vitals"
	};
}
async function Rr(e) {
	let t = await Fr(e.data.backendNodeId);
	if (!t) return null;
	let n = null;
	try {
		n = e.data.selector ? new RegExp(e.data.selector) : null;
	} catch {
		return null;
	}
	return {
		renderedWidget: M`<devtools-widget
      class="styling-preview-widget"
      ${P(Ut, {
			domNode: t,
			filter: n
		})}>
  </devtools-widget>`,
		revealable: t,
		accessibleRevealLabel: N(F.revealStyleProperties),
		title: M`<devtools-widget
      ${P(jt, { node: t })}
    ></devtools-widget>`,
		jslogContext: "standalone-styles"
	};
}
var zr = {
	[k.LCP_BREAKDOWN]: {
		component: Dn,
		accessibleLabel: F.revealLcpBreakdown,
		title: F.lcpBreakdown,
		jslog: "lcp-breakdown-widget"
	},
	[k.RENDER_BLOCKING]: {
		component: un,
		accessibleLabel: F.revealRenderBlockingBreakdown,
		title: F.renderBlockingBreakdown,
		jslog: "render-blocking-widget"
	},
	[k.LCP_DISCOVERY]: {
		component: Fn,
		accessibleLabel: F.revealLcpDiscovery,
		title: F.lcpDiscovery,
		jslog: "lcp-discovery-widget"
	},
	[k.CLS_CULPRITS]: {
		component: wn,
		accessibleLabel: F.revealClsCulprits,
		title: F.clsCulprits,
		jslog: "cls-culprits-widget"
	},
	[k.NETWORK_DEPENDENCY_TREE]: {
		component: Cn,
		accessibleLabel: F.revealNetworkDependencyTree,
		title: F.networkDependencyTree,
		jslog: "network-dependency-tree-widget"
	},
	[k.THIRD_PARTIES]: {
		component: _n,
		accessibleLabel: F.revealThirdParties,
		title: F.thirdParties,
		jslog: "third-parties-widget"
	},
	[k.FORCED_REFLOW]: {
		component: In,
		accessibleLabel: F.revealForcedReflow,
		title: F.forcedReflow,
		jslog: "forced-reflow-widget"
	},
	[k.CACHE]: {
		component: An,
		accessibleLabel: F.revealCache,
		title: F.cache,
		jslog: "cache-widget"
	},
	[k.INP_BREAKDOWN]: {
		component: yn,
		accessibleLabel: F.revealInpBreakdown,
		title: F.inpBreakdown,
		jslog: "inp-breakdown-widget"
	},
	[k.DOCUMENT_LATENCY]: {
		component: Sn,
		accessibleLabel: F.revealDocumentLatency,
		title: F.documentLatency,
		jslog: "document-latency-widget"
	},
	[k.DOM_SIZE]: {
		component: Rn,
		accessibleLabel: F.revealDomSize,
		title: F.domSize,
		jslog: "dom-size-widget"
	},
	[k.DUPLICATE_JAVASCRIPT]: {
		component: kn,
		accessibleLabel: F.revealDuplicateJavaScript,
		title: F.duplicateJavaScript,
		jslog: "duplicate-javascript-widget"
	},
	[k.IMAGE_DELIVERY]: {
		component: Mn,
		accessibleLabel: F.revealImageDelivery,
		title: F.imageDelivery,
		jslog: "image-delivery-widget"
	},
	[k.FONT_DISPLAY]: {
		component: xn,
		accessibleLabel: F.revealFontDisplay,
		title: F.fontDisplay,
		jslog: "font-display-widget"
	},
	[k.SLOW_CSS_SELECTOR]: {
		component: pn,
		accessibleLabel: F.revealSlowCssSelector,
		title: F.slowCssSelector,
		jslog: "slow-css-selector-widget"
	},
	[k.LEGACY_JAVASCRIPT]: {
		component: jn,
		accessibleLabel: F.revealLegacyJavaScript,
		title: F.legacyJavaScript,
		jslog: "legacy-javascript-widget"
	},
	[k.VIEWPORT]: {
		component: hn,
		accessibleLabel: F.revealViewport,
		title: F.viewport,
		jslog: "viewport-widget"
	},
	[k.MODERN_HTTP]: {
		component: Ln,
		accessibleLabel: F.revealModernHttp,
		title: F.modernHttp,
		jslog: "modern-http-widget"
	},
	[k.CHARACTER_SET]: {
		component: Pn,
		accessibleLabel: F.revealCharacterSet,
		title: F.characterSet,
		jslog: "character-set-widget"
	}
};
function Br(e, t, n, r, i, a) {
	return {
		renderedWidget: M`<devtools-widget
    class=${n}
    ${P(e, {
			model: t,
			minimal: !0,
			bounds: a ?? null
		})}></devtools-widget>`,
		revealable: new zn(t),
		accessibleRevealLabel: N(r),
		title: N(i),
		jslogContext: n
	};
}
async function Vr(e) {
	let t = e.data.insight, n = e.data.insightData, r = zr[t];
	if (!r) return null;
	let i;
	if (t === k.CLS_CULPRITS) {
		let e = rn.instance().state()?.micro.entireTraceBounds;
		if (!e) return null;
		i = e;
	}
	return Br(r.component, n, r.jslog, r.accessibleLabel, r.title, i);
}
async function Hr(e) {
	let t = _t.mainThreadActivityBottomUp(e.data.bounds, e.data.parsedTrace);
	if (!t) return null;
	let n = t.events, r = qt(e.data.bounds.min), i = qt(e.data.bounds.max);
	return {
		renderedWidget: M`<devtools-widget
      class="bottom-up-timeline-tree-widget"
      ${P(Tn, {
			selectedEvents: n,
			parsedTrace: e.data.parsedTrace,
			startTime: r,
			endTime: i,
			compactMode: !0,
			maxLinkLength: 15,
			maxRows: 10
		})}></devtools-widget>`,
		revealable: new En(e.data.bounds),
		accessibleRevealLabel: N(F.revealBottomUpTree),
		title: N(F.bottomUpTree),
		jslogContext: "bottom-up"
	};
}
function Ur(e) {
	if (e === null) return g;
	function n() {
		e !== null && t(e?.revealable);
	}
	let r = m({
		"widget-and-revealer-container": !0,
		"revealer-only": e.renderedWidget === null
	}), i = M`
    <devtools-button class="widget-reveal-button"
      .variant=${d.TEXT}
      .accessibleLabel=${e.accessibleRevealLabel}
      .jslogContext=${"reveal"}
      @click=${n}
    >
      ${e.customRevealTitle ?? N(F.reveal)}
      <devtools-icon name='tab-move'></devtools-icon>
    </devtools-button>
  `;
	return M`
    <div class=${r} jslog=${vr(e.jslogContext ? S(e.jslogContext) : void 0)}>
      ${e.title ? M`
        <div class="widget-header">
          <h4 class="widget-name">${e.title}</h4>
          <div class="widget-reveal-container">
            ${i}
          </div>
        </div>
      ` : g}
      ${e.renderedWidget ? M`
        <div class="widget-content-container">
          ${e.renderedWidget}
        </div>` : g}
      ${e.title ? g : M`
        <div class="widget-reveal-container">
          ${i}
        </div>
      `}
    </div>
    `;
}
async function Wr(e) {
	let t = N(F.revealTrace);
	return {
		renderedWidget: null,
		title: null,
		revealable: new Bn(e.data.parsedTrace),
		customRevealTitle: t,
		accessibleRevealLabel: t,
		jslogContext: "performance-trace"
	};
}
async function Gr(e) {
	let t = e.data.uiSourceCode, n = a(`Show ${t.name()}`);
	return {
		renderedWidget: null,
		title: null,
		revealable: t,
		customRevealTitle: n,
		accessibleRevealLabel: n,
		jslogContext: "source-file-widget"
	};
}
function Kr(e) {
	let t = e.url.split("/").pop() || e.url, n = r(e.size), i = o[e.resourceType], { iconName: a, color: s } = nn.iconDataForResourceType(i), c = e.imageContent?.asImagePreviewUrl();
	return M`
    <div class="network-request-preview">
      <div class="network-request-header">
        <div class="network-request-icon">
          ${i.isImage() && c ? M`<img src=${c} alt=${t} />` : M`<devtools-icon name=${a} style=${oe({ color: s ?? "" })}></devtools-icon>`}
        </div>
        <div class="network-request-details">
          <div class="network-request-name" title=${e.url}>${t}</div>
          <div class="network-request-size">${n}</div>
        </div>
      </div>
    </div>
  `;
}
async function qr(e) {
	let t = e.data.root;
	if (!(t instanceof Ne)) return null;
	let n = e.data.networkRequest;
	return {
		renderedWidget: M`
    ${n ? Kr(n) : g}
    <devtools-widget class="dom-tree-widget" ${P(Ht, {
			maxTreeDepth: 2,
			enableContextMenu: !1,
			showComments: !1,
			showAIButton: !1,
			disableEdits: !0,
			expandRoot: !0,
			rootDOMNode: t,
			visibleWidth: 400,
			wrap: !0,
			maxRows: 10
		})}></devtools-widget>
  `,
		revealable: new Ee(t.domModel().target(), t.backendNodeId()),
		accessibleRevealLabel: N(F.revealLcpElement),
		title: N(F.lcpElement),
		jslogContext: "dom-snapshot"
	};
}
function Jr(e) {
	switch (e.name) {
		case "COMPUTED_STYLES": return `${e.name}:${e.data.backendNodeId}`;
		case "CORE_VITALS": return `${e.name}:${e.data.insightSetKey}`;
		case "STYLE_PROPERTIES": return `${e.name}:${e.data.backendNodeId}:${e.data.selector ?? ""}`;
		case "DOM_TREE": return `${e.name}:${e.data.root.backendNodeId()}`;
		case "PERFORMANCE_TRACE": return `${e.name}`;
		case "PERF_INSIGHT": return `${e.name}:${e.data.insight}:${e.data.insightData.insightKey}:${e.data.insightData.navigation?.args?.data?.navigationId ?? "no-nav-id"}`;
		case "TIMELINE_RANGE_SUMMARY": return `${e.name}:${e.data.track}:${e.data.bounds.min}-${e.data.bounds.max}`;
		case "BOTTOM_UP_TREE": return `${e.name}:${e.data.bounds.min}-${e.data.bounds.max}`;
		case "SOURCE_FILE": return `${e.name}:${e.data.uiSourceCode.url()}`;
		case "LIGHTHOUSE_REPORT": return `${e.name}:${e.data.report.fetchTime}`;
		case "TIMELINE_EVENT_SUMMARY": return `${e.name}:${e.data.event.ts}:${e.data.event.name}`;
		case "NETWORK_REQUEST_GENERAL_HEADERS": return `${e.name}:${e.data.request.requestId()}`;
		default: nt(e, "Unknown AiWidget name");
	}
}
function Yr(e) {
	let t = /* @__PURE__ */ new Set(), n = (e) => e.filter((e) => {
		let n = Jr(e);
		return !t.has(n) && (t.add(n), !0);
	}), r = e.parts.map((e) => e.type === "widget" ? {
		...e,
		widgets: n(e.widgets)
	} : e.type === "step" && e.step.widgets ? {
		...e,
		step: {
			...e.step,
			widgets: n(e.step.widgets)
		}
	} : e);
	return {
		...e,
		parts: r
	};
}
async function Xr(e, t = {}) {
	if (!w.devToolsAiAssistanceV2?.enabled || !e || e.length === 0) return g;
	let n = await Promise.all(e.map(async (e) => {
		let t = null;
		switch (e.name) {
			case "COMPUTED_STYLES":
				t = await Ir(e);
				break;
			case "CORE_VITALS":
				t = await Lr(e);
				break;
			case "STYLE_PROPERTIES":
				t = await Rr(e);
				break;
			case "DOM_TREE":
				t = await qr(e);
				break;
			case "PERFORMANCE_TRACE":
				t = await Wr(e);
				break;
			case "PERF_INSIGHT":
				t = await Vr(e);
				break;
			case "TIMELINE_RANGE_SUMMARY":
				t = await ni(e);
				break;
			case "BOTTOM_UP_TREE":
				t = await Hr(e);
				break;
			case "SOURCE_FILE":
				t = await Gr(e);
				break;
			case "LIGHTHOUSE_REPORT":
				t = await ri(e);
				break;
			case "TIMELINE_EVENT_SUMMARY":
				t = await ii(e);
				break;
			case "NETWORK_REQUEST_GENERAL_HEADERS":
				t = await ai(e);
				break;
			default: nt(e, "Unknown AiWidget name");
		}
		return Ur(t);
	}));
	return t.wrapperClass ? M`<div class=${t.wrapperClass}>${n}</div>` : M`${n}`;
}
function Zr(e) {
	return e.requestApproval ? M`<div
    class="side-effect-confirmation"
    jslog=${S("side-effect-confirmation")}
  >
    ${e.requestApproval.description ? M`<p>${e.requestApproval.description}</p>` : g}
    <div class="side-effect-buttons-container">
      <devtools-button
        .data=${{
		variant: d.OUTLINED,
		jslogContext: "decline-execute-code"
	}}
        @click=${() => e.requestApproval?.onAnswer(!1)}
      >${N(F.declineActionRequestApproval)}</devtools-button>
      <devtools-button
        .data=${{
		variant: d.PRIMARY,
		jslogContext: "accept-execute-code",
		iconName: "play"
	}}
        @click=${() => e.requestApproval?.onAnswer(!0)}
      >${N(F.confirmActionRequestApproval)}</devtools-button>
    </div>
  </div>` : g;
}
function Qr(e) {
	if (e.error) {
		let t;
		switch (e.error) {
			case D.UNKNOWN:
			case D.BLOCK:
				t = F.systemError;
				break;
			case D.MAX_STEPS:
				t = F.maxStepsError;
				break;
			case D.CROSS_ORIGIN:
				t = F.crossOriginError;
				break;
			case D.ABORT: return M`<p class="aborted" jslog=${S("aborted")}>${N(F.stoppedResponse)}</p>`;
		}
		return M`<p class="error" jslog=${S("error")}>${N(t)}</p>`;
	}
	return g;
}
function $r(e) {
	if (e.data === "") return M`<div class="unavailable-image" title=${F.imageUnavailable}>
      <devtools-icon name='file-image'></devtools-icon>
    </div>`;
	let t = `data:${e.mimeType};base64,${e.data}`;
	return M`<devtools-link
      class="image-link" title=${F.openImageInNewTab}
      href=${t}
    >
      <img src=${t} alt=${F.imageInputSentToTheModel} />
    </devtools-link>`;
}
function ei(e, t) {
	let n = w.devToolsAiAssistanceV2?.enabled;
	return M`
    <div class=${m({
		"ai-assistance-feedback-row": !0,
		"not-v2": !n
	})}>
      <div class="action-buttons">
        ${e.showRateButtons ? M`
          <devtools-button
            .data=${{
		variant: d.ICON,
		size: h.SMALL,
		iconName: "thumb-up",
		toggledIconName: "thumb-up-filled",
		toggled: e.currentRating === De.POSITIVE,
		toggleType: pe.PRIMARY,
		title: N(F.thumbsUp),
		jslogContext: "thumbs-up"
	}}
            @click=${() => e.onRatingClick(De.POSITIVE)}
          ></devtools-button>
          <devtools-button
            .data=${{
		variant: d.ICON,
		size: h.SMALL,
		iconName: "thumb-down",
		toggledIconName: "thumb-down-filled",
		toggled: e.currentRating === De.NEGATIVE,
		toggleType: pe.PRIMARY,
		title: N(F.thumbsDown),
		jslogContext: "thumbs-down"
	}}
            @click=${() => e.onRatingClick(De.NEGATIVE)}
          ></devtools-button>
          ${n ? g : M`<div class="vertical-separator"></div>`}
        ` : g}
        <devtools-button
          .data=${{
		variant: d.ICON,
		size: h.SMALL,
		title: N(F.report),
		iconName: "report",
		jslogContext: "report"
	}}
          @click=${e.onReportClick}
        ></devtools-button>
        ${n ? g : M`
          <div class="vertical-separator"></div>
          <devtools-button
            .data=${{
		variant: d.ICON,
		size: h.SMALL,
		title: N(F.copyResponse),
		iconName: "copy",
		jslogContext: "copy-ai-response"
	}}
            aria-label=${N(F.copyResponse)}
            @click=${e.onCopyResponseClick}></devtools-button>
        `}
        ${e.onExportClick && n && e.isLastMessage ? M`
          <devtools-button
            class="export-for-agents-button"
            .jslogContext=${"ai-export-for-agents"}
            .variant=${d.OUTLINED}
            .iconName=${"copy"}
            aria-label=${N(F.exportForAgents)}
            @click=${e.onExportClick}
          >${N(F.exportForAgents)}</devtools-button>
          ${e.suggestions ? M`<div class="vertical-separator"></div>` : g}
        ` : g}
      </div>
      ${e.suggestions ? M`<div class="suggestions-container">
        <div class="scroll-button-container left hidden" ${_r((e) => {
		t.suggestionsLeftScrollButtonContainer = e;
	})}>
          <devtools-button
            class='scroll-button'
            .data=${{
		variant: d.ICON,
		size: h.SMALL,
		iconName: "chevron-left",
		title: N(F.scrollToPrevious),
		jslogContext: "chevron-left"
	}}
            @click=${() => e.scrollSuggestionsScrollContainer("left")}
          ></devtools-button>
        </div>
        <div class="suggestions-scroll-container" @scroll=${e.onSuggestionsScrollOrResize} ${_r((e) => {
		t.suggestionsScrollContainer = e;
	})}>
          ${e.suggestions.map((t) => M`<devtools-button
            class='suggestion'
            .data=${{
		variant: d.OUTLINED,
		title: t,
		jslogContext: "suggestion"
	}}
            @click=${() => e.onSuggestionClick(t)}
          >${t}</devtools-button>`)}
        </div>
        <div class="scroll-button-container right hidden" ${_r((e) => {
		t.suggestionsRightScrollButtonContainer = e;
	})}>
          <devtools-button
            class='scroll-button'
            .data=${{
		variant: d.ICON,
		size: h.SMALL,
		iconName: "chevron-right",
		title: N(F.scrollToNext),
		jslogContext: "chevron-right"
	}}
            @click=${() => e.scrollSuggestionsScrollContainer("right")}
          ></devtools-button>
        </div>
      </div>` : g}
    </div>
    ${e.isShowingFeedbackForm ? M`
      <form class="feedback-form" @submit=${e.onSubmit}>
        <div class="feedback-header">
          <h4 class="feedback-title">${N(F.whyThisRating)}</h4>
          <devtools-button
            aria-label=${N(F.close)}
            @click=${e.onClose}
            .data=${{
		variant: d.ICON,
		iconName: "cross",
		size: h.SMALL,
		title: N(F.close),
		jslogContext: "close"
	}}
          ></devtools-button>
        </div>
        <input
          type="text"
          class="devtools-text-input feedback-input"
          @input=${(t) => e.onInputChange(t.target.value)}
          placeholder=${N(F.provideFeedbackPlaceholder)}
          jslog=${qe("feedback").track({ keydown: "Enter" })}
        >
        <span class="feedback-disclaimer">${N(F.disclaimer)}</span>
        <div>
          <devtools-button
          aria-label=${N(F.submit)}
          .data=${{
		type: "submit",
		disabled: e.isSubmitButtonDisabled,
		variant: d.OUTLINED,
		size: h.SMALL,
		title: N(F.submit),
		jslogContext: "send"
	}}
          >${N(F.submit)}</devtools-button>
        </div>
      </div>
    </form>
    ` : g}
  `;
}
var ti = class extends Be {
	message = {
		entity: "user",
		text: "",
		id: ""
	};
	isLoading = !1;
	isReadOnly = !1;
	prompt = "";
	canShowFeedbackForm = !1;
	isLastMessage = !1;
	isFirstMessage = !1;
	shouldShowCSSChangeSummary = !1;
	markdownRenderer;
	onSuggestionClick = () => {};
	onFeedbackSubmit = () => {};
	onCopyResponseClick = () => {};
	onExportClick = () => {};
	changeSummary;
	walkthrough = {
		onOpen: () => {},
		onToggle: () => {},
		isInlined: !1,
		isExpanded: !1,
		activeSidebarMessage: null,
		inlineExpandedMessages: []
	};
	#e = new ResizeObserver(() => this.#d());
	#t = new Ae(100);
	#n = "";
	#r;
	#i = !1;
	#a = !0;
	#o;
	#s = {};
	#c = !1;
	constructor(e, t) {
		super(e), this.#o = t ?? Cr;
	}
	wasShown() {
		super.wasShown(), this.performUpdate(), this.#u();
	}
	performUpdate() {
		let e = this.message.entity === "model" ? Yr(this.message) : this.message;
		this.#o({
			message: e,
			isLoading: this.isLoading,
			isReadOnly: this.isReadOnly,
			canShowFeedbackForm: this.canShowFeedbackForm,
			markdownRenderer: this.markdownRenderer,
			isLastMessage: this.isLastMessage,
			isFirstMessage: this.isFirstMessage,
			prompt: this.prompt,
			shouldShowCSSChangeSummary: this.shouldShowCSSChangeSummary,
			onSuggestionClick: this.onSuggestionClick,
			onRatingClick: this.#p.bind(this),
			onReportClick: () => te(yr),
			onCopyResponseClick: () => {
				this.message.entity === "model" && this.onCopyResponseClick(this.message);
			},
			onExportClick: this.onExportClick,
			scrollSuggestionsScrollContainer: this.#f.bind(this),
			onSuggestionsScrollOrResize: this.#d.bind(this),
			onSubmit: this.#h.bind(this),
			onClose: this.#m.bind(this),
			onInputChange: this.#l.bind(this),
			isSubmitButtonDisabled: this.#a,
			showActions: !(this.isLastMessage && this.isLoading),
			showRateButtons: this.message.entity === "model" && !!this.message.rpcId,
			suggestions: this.isLastMessage && this.message.entity === "model" && !this.isReadOnly && this.message.parts.at(-1)?.type === "answer" ? this.message.parts.at(-1).suggestions : void 0,
			currentRating: this.#r,
			isShowingFeedbackForm: this.#i,
			onFeedbackSubmit: this.onFeedbackSubmit,
			changeSummary: this.changeSummary,
			walkthrough: this.walkthrough
		}, this.#s, this.contentElement), this.#s.suggestionsScrollContainer && !this.#c && (this.#e.observe(this.#s.suggestionsScrollContainer), this.#c = !0);
	}
	#l(e) {
		this.#n = e;
		let t = !e;
		t !== this.#a && (this.#a = t, this.performUpdate());
	}
	#u = () => {
		let e = this.#s.suggestionsScrollContainer, t = this.#s.suggestionsLeftScrollButtonContainer, n = this.#s.suggestionsRightScrollButtonContainer;
		if (!e || !t || !n) return;
		let r = e.scrollLeft > br, i = e.scrollLeft + e.offsetWidth + br < e.scrollWidth;
		t.classList.toggle("hidden", !r), n.classList.toggle("hidden", !i);
	};
	willHide() {
		super.willHide(), this.#e.disconnect(), this.#c = !1;
	}
	#d() {
		this.#t.schedule(() => (this.#u(), Promise.resolve()));
	}
	#f(e) {
		let t = this.#s.suggestionsScrollContainer;
		t && t.scroll({
			top: 0,
			left: e === "left" ? t.scrollLeft - t.clientWidth : t.scrollLeft + t.clientWidth,
			behavior: "smooth"
		});
	}
	#p(e) {
		if (this.#r === e) {
			this.#r = void 0, this.#i = !1, this.#a = !0, this.message.entity === "model" && this.message.rpcId && this.onFeedbackSubmit(this.message.rpcId, De.SENTIMENT_UNSPECIFIED), this.performUpdate();
			return;
		}
		this.#r = e, this.#i = this.canShowFeedbackForm, this.message.entity === "model" && this.message.rpcId && this.onFeedbackSubmit(this.message.rpcId, e), this.performUpdate();
	}
	#m() {
		this.#i = !1, this.#a = !0, this.performUpdate();
	}
	#h(e) {
		e.preventDefault();
		let t = this.#n;
		this.#r && t && (this.message.entity === "model" && this.message.rpcId && this.onFeedbackSubmit(this.message.rpcId, this.#r, t), this.#i = !1, this.#a = !0, this.performUpdate());
	}
};
async function ni(e) {
	let { bounds: n, parsedTrace: r, track: i } = e.data, a = [];
	if (i === "main") {
		let e;
		for (let t of r.data.Meta.mainFrameNavigations) if (t.ts <= n.min) e = t.args.data?.navigationId;
		else break;
		let t = _t.findMainThread(e, r);
		t && (a = t.entries, It("TimelineRangeSummaryAiWidget found main thread. PID:", t.pid, "TID:", t.tid, "Number of entries:", t.entries.length));
	}
	if (!a) return It("Warning: could not find events for TimelineRangeSummaryAiWidget", e), null;
	let o = new Nn(), s = Jt.getOrCreate(r);
	return o.model = {
		selectedEvents: a,
		parsedTrace: r,
		entityMapper: s
	}, o.activeSelection = fn(n.min, n.max), o.refreshTree(!0), {
		renderedWidget: M`
    <devtools-widget
      ${P(dn, { data: {
			parsedTrace: r,
			events: a,
			isInAIWidget: !0,
			startTime: qt(n.min),
			endTime: qt(n.max),
			thirdPartyTreeTemplate: M`${P(Nn, {
				maxRows: 10,
				isInAIWidget: !0,
				model: {
					selectedEvents: o.selectedEvents ?? null,
					parsedTrace: r,
					entityMapper: o.entityMapper()
				},
				activeSelection: { bounds: n },
				onBottomUpButtonClicked: (e) => {
					t(new En(n, e ?? void 0));
				}
			})}`
		} })}
    ></devtools-widget>`,
		revealable: new Vn(n),
		accessibleRevealLabel: N(F.revealPerformanceSummary),
		title: N(F.performanceSummary),
		jslogContext: "timeline-range-summary"
	};
}
async function ri(e) {
	let t = an.renderLighthouseScores(e.data.report);
	if (!t) return null;
	let n = e.data.snapshotReport;
	return {
		renderedWidget: M`<div class="lighthouse-report-widget">${t}</div>`,
		revealable: new sn(e.data.report),
		accessibleRevealLabel: N(F.revealLighthouse),
		title: N(F.lighthouseReport),
		jslogContext: n ? "lighthouse-snapshot-report-widget" : "lighthouse-report-widget"
	};
}
async function ii(e) {
	return {
		renderedWidget: M`<devtools-widget class="timeline-event-summary-widget" ${P(() => On.makeEventWidget(e.data.event, e.data.parsedTrace))}></devtools-widget>`,
		revealable: new He(e.data.event),
		accessibleRevealLabel: N(F.revealTimelineEventSummary),
		title: N(F.timelineEventSummary),
		jslogContext: "timeline-event-summary-widget"
	};
}
async function ai(e) {
	return {
		renderedWidget: M`<devtools-widget class="network-request-general-headers-widget" ${P(() => ln.createGeneralHeadersView(e.data.request))}></devtools-widget>`,
		revealable: $t.tab(e.data.request, en.HEADERS_COMPONENT),
		accessibleRevealLabel: N(F.revealNetworkRequest),
		title: N(F.networkRequest),
		jslogContext: "network-request-general-headers-widget"
	};
}
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/ai_assistance/selectWorkspaceDialog.css.mjs
var oi = "/*\n * Copyright 2025 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n@scope to (devtools-widget > *) {\n  :scope {\n    width: 100%;\n    box-shadow: none;\n  }\n\n  .dialog-header {\n    margin: var(--sys-size-6) var(--sys-size-8) var(--sys-size-5);\n    font: var(--sys-typescale-headline5);\n  }\n\n  .buttons {\n    margin: var(--sys-size-6) var(--sys-size-8) var(--sys-size-8);\n    display: flex;\n    justify-content: flex-start;\n    gap: var(--sys-size-5);\n  }\n\n  .main-content {\n    color: var(--sys-color-on-surface-subtle);\n    margin: 0 var(--sys-size-8);\n    line-height: 18px;\n  }\n\n  .add-folder-button {\n    margin-left: auto;\n  }\n\n  ul {\n    list-style-type: none;\n    padding: 0;\n    margin: var(--sys-size-6) 0 var(--sys-size-4) 0;\n    max-height: var(--sys-size-20);\n    overflow-y: auto;\n  }\n\n  li {\n    display: flex;\n    align-items: center;\n    color: var(--sys-color-on-surface-subtle);\n    border-radius: 0 var(--sys-shape-corner-full) var(--sys-shape-corner-full) 0;\n    height: var(--sys-size-10);\n    margin: 0 var(--sys-size-8);\n    padding-left: var(--sys-size-9);\n  }\n\n  li:hover, li.selected {\n    background-color: var(--sys-color-state-hover-on-subtle);\n  }\n\n  li:focus {\n    background-color: var(--app-color-navigation-drawer-background-selected);\n  }\n\n  .folder-icon {\n    color: var(--icon-file-default);\n    margin-right: var(--sys-size-4);\n  }\n\n  li.selected .folder-icon {\n    color: var(--icon-file-authored);\n  }\n\n  .select-project-root {\n    margin-bottom: var(--sys-size-6);\n  }\n\n  .theme-with-dark-background, :host-context(.theme-with-dark-background) {\n    /*\n      * List item is focused and selected: there is no valid state where the list item is focused but not selected.\n    */\n    li:focus {\n      color: var(--app-color-navigation-drawer-label-selected);\n      background-color: var(--app-color-navigation-drawer-background-selected);\n\n      & .folder-icon {\n        color: var(--app-color-navigation-drawer-label-selected);\n      }\n    }\n  }\n\n  .ellipsis {\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n  }\n}\n", I = {
	selectFolder: "Select folder",
	selectFolderAccessibleLabel: "Select a folder to apply changes",
	cancel: "Cancel",
	select: "Select",
	addFolder: "Add folder",
	selectProjectRoot: "Source code from the selected folder is sent to Google. This data may be seen by human reviewers to improve this feature.",
	selectProjectRootNoLogging: "Source code from the selected folder is sent to Google. This data will not be used to improve Google’s AI models. Your organization may change these settings at any time."
}, L = a, si = (e, t, n) => {
	let r = e.folders.length > 0;
	f(p`
      <style>${oi}</style>
      <h2 class="dialog-header">${L(I.selectFolder)}</h2>
      <div class="main-content">
        <div class="select-project-root">${e.selectProjectRootText}</div>
        ${e.showAutomaticWorkspaceNudge ? p`
          <!-- Hardcoding, because there is no 'getFormatLocalizedString' equivalent for 'lockedString' -->
          <div>
            Tip: provide a
            <devtools-link
              class="devtools-link"
              href="https://goo.gle/devtools-automatic-workspace-folders"
              jslogcontext="automatic-workspaces-documentation"
            >com.chrome.devtools.json</devtools-link>
            file to automatically connect your project to DevTools.
          </div>
        ` : g}
      </div>
      ${r ? p`
        <ul role="listbox" aria-label=${L(I.selectFolder)}
          aria-activedescendant=${e.folders.length > 0 ? `option-${e.selectedIndex}` : ""}>
          ${e.folders.map((t, n) => {
		let r = `option-${n}`;
		return p`
              <li
                id=${r}
                @mousedown=${() => e.onProjectSelected(n)}
                @keydown=${e.onListItemKeyDown}
                class=${n === e.selectedIndex ? "selected" : ""}
                aria-selected=${n === e.selectedIndex ? "true" : "false"}
                title=${t.path}
                role="option"
                tabindex=${n === e.selectedIndex ? "0" : "-1"}
              >
                <devtools-icon class="folder-icon" name="folder"></devtools-icon>
                <span class="ellipsis">${t.name}</span>
              </li>`;
	})}
        </ul>
      ` : g}
      <div class="buttons">
        <devtools-button
          title=${L(I.cancel)}
          aria-label="Cancel"
          .jslogContext=${"cancel"}
          @click=${e.onCancelButtonClick}
          .variant=${d.OUTLINED}>${L(I.cancel)}</devtools-button>
        <devtools-button
          class="add-folder-button"
          title=${L(I.addFolder)}
          aria-label="Add folder"
          .iconName=${"plus"}
          .jslogContext=${"add-folder"}
          @click=${e.onAddFolderButtonClick}
          .variant=${r ? d.TONAL : d.PRIMARY}>${L(I.addFolder)}</devtools-button>
        ${r ? p`
          <devtools-button
            title=${L(I.select)}
            aria-label="Select"
            @click=${e.onSelectButtonClick}
            .jslogContext=${"select"}
            .variant=${d.PRIMARY}>${L(I.select)}</devtools-button>
        ` : g}
      </div>
    `, n);
}, ci = class e extends ke {
	#e;
	#t = st.instance();
	#n = 0;
	#r;
	#i;
	#a = yt.instance();
	#o = [];
	constructor(e, t) {
		super(), this.#r = e.onProjectSelected, this.#i = e.dialog, this.#d(), e.currentProject && (this.#n = Math.max(0, this.#o.findIndex((t) => t.project === e.currentProject))), this.#e = t ?? si, this.requestUpdate(), this.updateComplete.then(() => {
			this.contentElement?.querySelector(".selected")?.focus();
		});
	}
	wasShown() {
		super.wasShown(), this.#t.addEventListener(T.ProjectAdded, this.#f, this), this.#t.addEventListener(T.ProjectRemoved, this.#p, this);
	}
	willHide() {
		super.willHide(), this.#t.removeEventListener(T.ProjectAdded, this.#f, this), this.#t.removeEventListener(T.ProjectRemoved, this.#p, this);
	}
	#s(e) {
		switch (e.key) {
			case "ArrowDown": {
				e.preventDefault(), this.#n = Math.min(this.#n + 1, this.#o.length - 1);
				let t = this.contentElement.querySelectorAll("li")[this.#n];
				t?.scrollIntoView({
					block: "nearest",
					inline: "nearest"
				}), t?.focus({ preventScroll: !0 }), this.requestUpdate();
				break;
			}
			case "ArrowUp": {
				e.preventDefault(), this.#n = Math.max(this.#n - 1, 0);
				let t = this.contentElement.querySelectorAll("li")[this.#n];
				t?.scrollIntoView({
					block: "nearest",
					inline: "nearest"
				}), t?.focus({ preventScroll: !0 }), this.requestUpdate();
				break;
			}
			case "Enter": e.preventDefault(), this.#c();
		}
	}
	#c() {
		let e = this.#o[this.#n];
		e.project ? (this.#i.hide(), this.#r(e.project)) : this.#u();
	}
	performUpdate() {
		let e = w.aidaAvailability?.enterprisePolicyValue !== Ze.ALLOW_WITHOUT_LOGGING, t = {
			folders: this.#o,
			selectedIndex: this.#n,
			selectProjectRootText: L(e ? I.selectProjectRoot : I.selectProjectRootNoLogging),
			showAutomaticWorkspaceNudge: this.#a.automaticFileSystem === null && this.#a.availability === "available",
			onProjectSelected: (e) => {
				this.#n = e, this.requestUpdate();
			},
			onSelectButtonClick: this.#c.bind(this),
			onCancelButtonClick: () => {
				this.#i.hide();
			},
			onAddFolderButtonClick: () => {
				this.#l();
			},
			onListItemKeyDown: this.#s.bind(this)
		};
		this.#e(t, void 0, this.contentElement);
	}
	async #l() {
		await wt.instance().addFileSystem(), this.contentElement?.querySelector("[aria-label=\"Select\"]")?.shadowRoot?.querySelector("button")?.focus();
	}
	async #u() {
		await this.#a.connectAutomaticFileSystem(!0) || this.#i.hide();
	}
	#d() {
		this.#o = [];
		let e = this.#a.automaticFileSystem;
		e && this.#o.push({
			name: l.extractName(e.root),
			path: e.root,
			automaticFileSystem: e
		});
		let t = this.#t.projectsForType(it.FileSystem).filter((e) => e instanceof Mt && e.fileSystem().type() === Rt.WORKSPACE_PROJECT);
		for (let n of t) {
			if (e && n === this.#t.projectForFileSystemRoot(e.root)) {
				this.#o[0].project = n;
				continue;
			}
			this.#o.push({
				name: l.encodedPathToRawPathString(n.displayName()),
				path: l.urlToRawPathString(n.id(), Fe()),
				project: n
			});
		}
	}
	#f(e) {
		let t = e.data, n = this.#a.automaticFileSystem;
		if (n && t === this.#t.projectForFileSystemRoot(n.root)) {
			this.#i.hide(), this.#r(t);
			return;
		}
		this.#d();
		let r = this.#o.findIndex((e) => e.project === t);
		r !== -1 && (this.#n = r), this.requestUpdate(), this.updateComplete.then(() => {
			this.contentElement?.querySelector(".selected")?.scrollIntoView();
		});
	}
	#p() {
		let e = this.#n >= 0 && this.#n < this.#o.length ? this.#o[this.#n].project : null;
		if (this.#d(), e) {
			let t = this.#o.findIndex((t) => t.project === e);
			this.#n = t === -1 ? Math.min(this.#o.length - 1, this.#n) : t;
		} else this.#n = 0;
		this.requestUpdate();
	}
	static show(t, n) {
		let r = new ie("select-workspace");
		r.setAriaLabel(I.selectFolderAccessibleLabel), r.setMaxContentSize(new Je(384, 340)), r.setSizeBehavior(ae.SET_EXACT_WIDTH_MAX_HEIGHT), r.setDimmed(!0), new e({
			dialog: r,
			onProjectSelected: t,
			currentProject: n
		}).show(r.contentElement), r.show();
	}
}, li = /* @__PURE__ */ e({
	PatchSuggestionState: () => fi,
	PatchWidget: () => mi,
	isAiAssistancePatchingEnabled: () => hi
}), R = {
	unsavedChanges: "Unsaved changes",
	applyingToWorkspace: "Applying to workspace…",
	applyToWorkspace: "Apply to workspace",
	change: "Change",
	changeRootFolder: "Change project root folder",
	cancel: "Cancel",
	discard: "Discard",
	saveAll: "Save all",
	savedToDisk: "Saved to disk",
	codeDisclaimer: "Use code snippets with caution",
	applyToWorkspaceTooltip: "Source code from the selected folder is sent to Google to generate code suggestions.",
	applyToWorkspaceTooltipNoLogging: "Source code from the selected folder is sent to Google to generate code suggestions. This data will not be used to improve Google’s AI models.",
	learnMore: "Learn more",
	freDisclaimerHeader: "Apply changes directly to your project’s source code",
	freDisclaimerTextAiWontAlwaysGetItRight: "This feature uses AI and won’t always get it right",
	freDisclaimerTextPrivacy: "To generate code suggestions, source code from the selected folder is sent to Google. This data may be seen by human reviewers to improve this feature.",
	freDisclaimerTextPrivacyNoLogging: "To generate code suggestions, source code from the selected folder is sent to Google. This data will not be used to improve Google’s AI models. Your organization may change these settings at any time.",
	freDisclaimerTextUseWithCaution: "Use generated code snippets with caution",
	viewUploadedFiles: "View data sent to Google",
	opensInNewTab: "(opens in a new tab)",
	genericErrorMessage: "Changes couldn’t be applied to your workspace."
}, z = a, ui = "https://support.google.com/legal/answer/13505487", { widget: di } = Me, fi = /* @__PURE__ */ function(e) {
	return e.INITIAL = "initial", e.LOADING = "loading", e.SUCCESS = "success", e.ERROR = "error", e;
}({}), pi = (e, t, n) => {
	if (!e.changeSummary && e.patchSuggestionState === "initial") return;
	t.changeRef = t.changeRef ?? ve(), t.summaryRef = t.summaryRef ?? ve();
	function r() {
		return e.sources ? p`<devtools-link
          class="link"
          title="${R.viewUploadedFiles} ${R.opensInNewTab}"
          href="data:text/plain;charset=utf-8,${encodeURIComponent(e.sources)}"
          jslogcontext="files-used-in-patching">
          ${R.viewUploadedFiles}
        </devtools-link>` : g;
	}
	function i() {
		return e.savedToDisk ? p`
            <devtools-icon class="green-bright-icon summary-badge" name="check-circle"></devtools-icon>
            <span class="header-text">
              ${z(R.savedToDisk)}
            </span>
          ` : e.patchSuggestionState === "success" ? p`
            <devtools-icon class="on-tonal-icon summary-badge" name="difference"></devtools-icon>
            <span class="header-text">
              ${z(`File changes in ${e.projectName}`)}
            </span>
            <devtools-icon
              class="arrow"
              name="chevron-down"
            ></devtools-icon>
          ` : p`
          <devtools-icon class="on-tonal-icon summary-badge" name="pen-spark"></devtools-icon>
          <span class="header-text">
            ${z(R.unsavedChanges)}
          </span>
          <devtools-icon
            class="arrow"
            name="chevron-down"
          ></devtools-icon>
        `;
	}
	function a() {
		return !e.changeSummary && e.patchSuggestionState === "initial" || e.savedToDisk ? g : e.patchSuggestionState === "success" ? p`${di(Wn, {
			workspaceDiff: e.workspaceDiff,
			ignoredUrls: ["inspector://"]
		})}` : p`<devtools-code-block
          .code=${e.changeSummary ?? ""}
          .codeLang=${"css"}
          .displayNotice=${!0}
        ></devtools-code-block>
        ${e.patchSuggestionState === "error" ? p`<div class="error-container">
              <devtools-icon name="cross-circle-filled"></devtools-icon>${z(R.genericErrorMessage)} ${r()}
            </div>` : g}`;
	}
	function o() {
		if (e.savedToDisk) return g;
		if (e.patchSuggestionState === "success") return p`
          <div class="footer">
            <div class="left-side">
              <devtools-link class="link disclaimer-link" href="https://support.google.com/legal/answer/13505487" jslogcontext="code-disclaimer">
                ${z(R.codeDisclaimer)}
              </devtools-link>
              ${r()}
            </div>
            <div class="save-or-discard-buttons">
              <devtools-button
                @click=${e.onDiscard}
                .jslogContext=${"patch-widget.discard"}
                .variant=${d.OUTLINED}>
                  ${z(R.discard)}
              </devtools-button>
              <devtools-button
                @click=${e.onSaveAll}
                .jslogContext=${"patch-widget.save-all"}
                .variant=${d.PRIMARY}>
                  ${z(R.saveAll)}
              </devtools-button>
            </div>
          </div>
          `;
		let n = e.projectType === "automaticDisconnected" ? "folder-off" : e.projectType === "automaticConnected" ? "folder-asterisk" : "folder";
		return p`
        <div class="footer">
          ${e.projectName ? p`
            <div class="change-workspace" jslog=${S("patch-widget.workspace")}>
                <devtools-icon .name=${n}></devtools-icon>
                <span class="folder-name" title=${e.projectPath}>${e.projectName}</span>
              ${e.onChangeWorkspaceClick ? p`
                <devtools-button
                  @click=${e.onChangeWorkspaceClick}
                  .jslogContext=${"change-workspace"}
                  .variant=${d.TEXT}
                  .title=${z(R.changeRootFolder)}
                  .disabled=${e.patchSuggestionState === "loading"}
                  ${we(t.changeRef)}
                >${z(R.change)}</devtools-button>
              ` : g}
            </div>
          ` : g}
          <div class="apply-to-workspace-container" aria-live="polite">
            ${e.patchSuggestionState === "loading" ? p`
              <div class="loading-text-container" jslog=${S("patch-widget.apply-to-workspace-loading")}>
                <devtools-spinner></devtools-spinner>
                <span>
                  ${z(R.applyingToWorkspace)}
                </span>
              </div>
            ` : p`
                <devtools-button
                @click=${e.onApplyToWorkspace}
                .jslogContext=${"patch-widget.apply-to-workspace"}
                .variant=${d.OUTLINED}>
                ${z(R.applyToWorkspace)}
              </devtools-button>
            `}
            ${e.patchSuggestionState === "loading" ? p`<devtools-button
              @click=${e.onCancel}
              .jslogContext=${"cancel"}
              .variant=${d.OUTLINED}>
              ${z(R.cancel)}
            </devtools-button>` : g}
            <devtools-button
              aria-details="info-tooltip"
              .jslogContext=${"patch-widget.info-tooltip-trigger"}
              .iconName=${"info"}
              .variant=${d.ICON}
            ></devtools-button>
            <devtools-tooltip
                id="info-tooltip"
                variant="rich"
              >
             <div class="info-tooltip-container">
               ${e.applyToWorkspaceTooltipText}
               <button
                 class="link tooltip-link"
                 role="link"
                 jslog=${Xe("open-ai-settings").track({ click: !0 })}
                 @click=${e.onLearnMoreTooltipClick}
               >${z(R.learnMore)}</button>
             </div>
            </devtools-tooltip>
          </div>
        </div>`;
	}
	let s = e.savedToDisk ? p`
          <div class="change-summary saved-to-disk" role="status" aria-live="polite">
            <div class="header-container">
             ${i()}
             </div>
          </div>` : p`
          <details class="change-summary" jslog=${S("patch-widget")}>
            <summary class="header-container" ${we(t.summaryRef)}>
              ${i()}
            </summary>
            ${a()}
            ${o()}
          </details>
        `;
	f(s, n);
}, mi = class extends Be {
	changeSummary = "";
	changeManager;
	#e = s.instance().createSetting("ai-assistance-patching-fre-completed", !1);
	#t = s.instance().createSetting("ai-assistance-patching-selected-project-id", "");
	#n;
	#r = {};
	#i;
	#a;
	#o;
	#s;
	#c;
	#l;
	#u = "initial";
	#d = Un();
	#f = st.instance();
	#p = yt.instance().automaticFileSystem;
	#m = !1;
	#h = null;
	constructor(e, t = pi, n) {
		super(e), this.#i = n?.aidaClient ?? new ye(), this.#l = w.aidaAvailability?.enterprisePolicyValue !== Ze.ALLOW_WITHOUT_LOGGING, this.#n = t, this.requestUpdate();
	}
	#g() {
		x.instance().showView("chrome-ai");
	}
	#_() {
		return this.#o ? {
			projectName: l.encodedPathToRawPathString(this.#o.displayName()),
			projectPath: l.urlToRawPathString(this.#o.id(), Fe())
		} : this.#p ? {
			projectName: l.extractName(this.#p.root),
			projectPath: this.#p.root
		} : {
			projectName: "",
			projectPath: ""
		};
	}
	#v() {
		let e = this.#p ? this.#f.projectForFileSystemRoot(this.#p.root) : null;
		return this.#f.projectsForType(it.FileSystem).filter((e) => e instanceof Mt && e.fileSystem().type() === Rt.WORKSPACE_PROJECT).filter((t) => t !== e).length > 0;
	}
	#y(e) {
		return this.#p && this.#p.root === e ? this.#o ? "automaticConnected" : "automaticDisconnected" : this.#o ? "none" : "regular";
	}
	performUpdate() {
		let { projectName: e, projectPath: t } = this.#_();
		this.#n({
			workspaceDiff: this.#d,
			changeSummary: this.changeSummary,
			patchSuggestionState: this.#u,
			sources: this.#s,
			projectName: e,
			projectPath: t,
			projectType: this.#y(t),
			savedToDisk: this.#c,
			applyToWorkspaceTooltipText: this.#l ? z(R.applyToWorkspaceTooltip) : z(R.applyToWorkspaceTooltipNoLogging),
			onLearnMoreTooltipClick: this.#g.bind(this),
			onApplyToWorkspace: this.#T.bind(this),
			onCancel: () => {
				this.#a?.abort();
			},
			onDiscard: this.#O.bind(this),
			onSaveAll: this.#k.bind(this),
			onChangeWorkspaceClick: this.#v() ? this.#w.bind(this, { applyPatch: !1 }) : void 0
		}, this.#r, this.contentElement);
	}
	wasShown() {
		super.wasShown(), this.#x(), hi() && (this.#f.addEventListener(T.ProjectAdded, this.#S, this), this.#f.addEventListener(T.ProjectRemoved, this.#C, this));
	}
	willHide() {
		super.willHide(), this.#m = !1, hi() && (this.#f.removeEventListener(T.ProjectAdded, this.#S, this), this.#f.removeEventListener(T.ProjectRemoved, this.#C, this));
	}
	async #b() {
		if (this.#e.get()) return !0;
		let e = ft(), t = await Dt.show({
			header: {
				iconName: e,
				text: z(R.freDisclaimerHeader)
			},
			reminderItems: [
				{
					iconName: "psychiatry",
					content: z(R.freDisclaimerTextAiWontAlwaysGetItRight)
				},
				{
					iconName: "google",
					content: this.#l ? z(R.freDisclaimerTextPrivacy) : z(R.freDisclaimerTextPrivacyNoLogging)
				},
				{
					iconName: "warning",
					content: p`<devtools-link
            href=${ui}
            class="link devtools-link"
            jslogcontext="code-snippets-explainer.patch-widget"
          >${z(R.freDisclaimerTextUseWithCaution)}</devtools-link>`
				}
			],
			onLearnMoreClick: () => {
				x.instance().showView("chrome-ai");
			},
			ariaLabel: z(R.freDisclaimerHeader),
			learnMoreButtonText: z(R.learnMore)
		});
		return t && this.#e.set(!0), t;
	}
	#x() {
		let e = this.#p ? this.#f.projectForFileSystemRoot(this.#p.root) : this.#f.project(this.#t.get());
		e ? this.#o = e : (this.#o = void 0, this.#t.set("")), this.requestUpdate();
	}
	#S(e) {
		let t = e.data;
		this.#m && this.#p && t === this.#f.projectForFileSystemRoot(this.#p.root) ? (this.#m = !1, this.#o = t, this.#D()) : this.#o === void 0 && this.#x();
	}
	#C() {
		this.#o && !this.#f.project(this.#o.id()) && (this.#t.set(""), this.#o = void 0, this.requestUpdate());
	}
	#w(e = { applyPatch: !1 }) {
		ci.show((t) => {
			this.#o = t, this.#t.set(t.id()), e.applyPatch ? this.#D() : (this.requestUpdate(), this.updateComplete.then(() => {
				this.contentElement?.querySelector(".apply-to-workspace-container devtools-button")?.shadowRoot?.querySelector("button")?.focus();
			}));
		}, this.#o);
	}
	async #T() {
		hi() && await this.#b() && (this.#o ? await this.#D() : this.#p ? (this.#m = !0, await yt.instance().connectAutomaticFileSystem(!0)) : this.#w({ applyPatch: !0 }));
	}
	get #E() {
		return this.#d.modifiedUISourceCodes().filter((e) => !e.url().startsWith("inspector://"));
	}
	async #D() {
		let e = this.changeSummary;
		if (!e) throw Error("Change summary does not exist");
		this.#u = "loading", this.#h = null, this.requestUpdate();
		let { response: t, processedFiles: n } = await this.#j(e);
		t && "rpcId" in t && t.rpcId && (this.#h = t.rpcId);
		let r = this.#E.length > 0;
		this.#u = t?.type === E.ANSWER && r ? "success" : t?.type === E.ERROR && t.error === D.ABORT ? "initial" : "error", this.#s = `Filenames in ${this.#o?.displayName()}.
Files:
${n.map((e) => `* ${e}`).join("\n")}`, this.requestUpdate(), this.#u === "success" && this.updateComplete.then(() => {
			this.#r.summaryRef?.value?.focus();
		});
	}
	#O() {
		for (let e of this.#E) e.resetWorkingCopy();
		this.#u = "initial", this.#s = void 0, this.changeManager?.popStashedChanges(), this.#A(De.NEGATIVE), this.requestUpdate(), this.updateComplete.then(() => {
			this.#r.changeRef?.value?.focus();
		});
	}
	#k() {
		for (let e of this.#E) e.commitWorkingCopy();
		this.changeManager?.stashChanges().then(() => {
			this.changeManager?.dropStashedChanges();
		}), this.#c = !0, this.#A(De.POSITIVE), this.requestUpdate();
	}
	#A(e) {
		this.#h && this.#i.registerClientEvent({
			corresponding_aida_rpc_global_id: this.#h,
			disable_user_content_logging: !0,
			do_conversation_client_event: { user_feedback: { sentiment: e } }
		});
	}
	async #j(e) {
		if (!this.#o) throw Error("Project does not exist");
		this.#a = new AbortController();
		let { responses: t, processedFiles: n } = await new At({
			aidaClient: this.#i,
			serverSideLoggingEnabled: !1,
			project: this.#o
		}).applyChanges(e, { signal: this.#a.signal });
		return {
			response: t.at(-1),
			processedFiles: n
		};
	}
};
function hi() {
	return !!w.devToolsFreestyler?.patching;
}
window.aiAssistanceTestPatchPrompt = async (e, t, n) => {
	if (!hi()) return;
	let r = Un(), i = st.instance().projectsForType(it.FileSystem).filter((e) => e instanceof Mt && e.fileSystem().type() === Rt.WORKSPACE_PROJECT).find((t) => t.displayName() === e);
	if (!i) throw Error("project not found");
	let a = new ye(), o = new At({
		aidaClient: a,
		serverSideLoggingEnabled: !1,
		project: i
	});
	try {
		let e = [], { processedFiles: r, responses: i } = await o.applyChanges(t);
		if (i.at(-1)?.type === E.ERROR) return {
			error: "failed to patch",
			debugInfo: {
				responses: i,
				processedFiles: r
			}
		};
		for (let t of r) {
			let r = n.find((e) => e.path === t);
			if (!r) {
				e.push(`Patched ${t} that was not expected`);
				break;
			}
			let i = await o.agentProject.readFile(t);
			if (!i) throw Error(`${t} has no content`);
			for (let n of r.matches) i.match(new RegExp(n, "gm")) || e.push({
				message: `Did not match ${n} in ${t}`,
				file: t,
				content: i
			});
			for (let n of r.doesNotMatch || []) i.match(new RegExp(n, "gm")) && e.push({
				message: `Unexpectedly matched ${n} in ${t}`,
				file: t,
				content: i
			});
		}
		return {
			assertionFailures: e,
			debugInfo: {
				responses: i,
				processedFiles: r
			}
		};
	} finally {
		r.modifiedUISourceCodes().forEach((e) => {
			e.resetWorkingCopy();
		});
	}
};
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/ai_assistance/components/chatInput.css.mjs
var gi = "/*\n * Copyright 2025 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n* {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}\n\n:host {\n  display: flex;\n  flex-direction: column;\n}\n\n.input-form {\n  display: flex;\n  flex-direction: column;\n  padding: 0 var(--sys-size-5) var(--sys-size-5) var(--sys-size-5);\n  max-width: var(--sys-size-36);\n  background-color: var(--sys-color-cdt-base-container);\n  width: 100%;\n}\n\n.chat-readonly-container {\n  display: flex;\n  width: 100%;\n  max-width: var(--sys-size-36);\n  justify-content: center;\n  align-items: center;\n  background-color: var(--sys-color-surface3);\n  font: var(--sys-typescale-body4-regular);\n  padding: var(--sys-size-5) 0;\n  border-radius: var(--sys-shape-corner-medium-small);\n  margin-bottom: var(--sys-size-5);\n  color: var(--sys-color-on-surface-subtle);\n}\n\n.chat-input-container {\n  width: 100%;\n  display: flex;\n  position: relative;\n  flex-direction: column;\n  border: 1px solid var(--sys-color-neutral-outline);\n  border-radius: var(--sys-shape-corner-small);\n\n  &:focus-within {\n    outline: 1px solid var(--sys-color-primary);\n    border-color: var(--sys-color-primary);\n  }\n\n  &.disabled {\n    background-color: var(--sys-color-state-disabled-container);\n    border-color: transparent;\n\n    & .chat-input-disclaimer {\n      border-color: var(--sys-color-state-disabled);\n    }\n  }\n\n  &.single-line-layout {\n    flex-direction: row;\n    justify-content: space-between;\n\n    .chat-input {\n      flex-shrink: 1;\n      padding: var(--sys-size-4);\n    }\n\n    .chat-input-actions {\n      flex-shrink: 0;\n      padding-block: 0;\n      align-items: flex-end;\n      padding-bottom: var(--sys-size-1);\n    }\n  }\n\n  & .image-input-container {\n    margin: var(--sys-size-3) var(--sys-size-4) 0;\n    max-width: 100%;\n    width: fit-content;\n    position: relative;\n\n    devtools-button {\n      position: absolute;\n      top: calc(-1 * var(--sys-size-2));\n      right: calc(-1 * var(--sys-size-3));\n      border-radius: var(--sys-shape-corner-full);\n      border: 1px solid var(--sys-color-neutral-outline);\n      background-color: var(--sys-color-cdt-base-container);\n    }\n\n    img {\n      max-height: var(--sys-size-18);\n      max-width: 100%;\n      border: 1px solid var(--sys-color-neutral-outline);\n      border-radius: var(--sys-shape-corner-small);\n    }\n\n    .loading {\n      margin: var(--sys-size-4) 0;\n      display: inline-flex;\n      justify-content: center;\n      align-items: center;\n      height: var(--sys-size-18);\n      width: var(--sys-size-19);\n      background-color: var(--sys-color-surface3);\n      border-radius: var(--sys-shape-corner-small);\n      border: 1px solid var(--sys-color-neutral-outline);\n\n      devtools-spinner {\n        color: var(--sys-color-state-disabled);\n      }\n    }\n  }\n\n  & .chat-input-disclaimer-container {\n    display: flex;\n    align-items: center;\n    padding-right: var(--sys-size-3);\n    flex-shrink: 0;\n  }\n\n  & .chat-input-disclaimer {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    font: var(--sys-typescale-body5-regular);\n    border-right: 1px solid var(--sys-color-divider);\n    padding-right: 8px;\n\n    &.hide-divider {\n      border-right: none;\n    }\n  }\n\n  /*\n    Hide the inline disclaimer on narrow widths (< 400px) because space is limited\n    and the disclaimer is shown in the footer instead for this case.\n  */\n  @container --chat-ui-container (width < 400px) {\n    & .chat-input-disclaimer-container {\n      display: none;\n    }\n  }\n}\n\n.chat-input {\n  scrollbar-width: none;\n  field-sizing: content;\n  resize: none;\n  width: 100%;\n  max-height: 84px; /* 4 rows */\n  border: 0;\n  border-radius: var(--sys-shape-corner-small);\n  font: var(--sys-typescale-body4-regular);\n  line-height: 18px;\n  min-height: var(--sys-size-11);\n  color: var(--sys-color-on-surface);\n  background-color: var(--sys-color-cdt-base-container);\n  padding: var(--sys-size-4) var(--sys-size-4) var(--sys-size-3)\n    var(--sys-size-4);\n\n  &::placeholder {\n    opacity: 60%;\n  }\n\n  &:focus-visible {\n    outline: 0;\n  }\n\n  &:disabled {\n    color: var(--sys-color-state-disabled);\n    background-color: transparent;\n    border-color: transparent;\n\n    &::placeholder {\n      color: var(--sys-color-on-surface-subtle);\n      opacity: 100%;\n    }\n  }\n}\n\n.chat-input-actions {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: space-between;\n  padding-left: var(--sys-size-4);\n  padding-right: var(--sys-size-2);\n  gap: var(--sys-size-6);\n  padding-bottom: var(--sys-size-2);\n\n  & .chat-input-actions-left {\n    flex: 1 1 0;\n    min-width: 0;\n  }\n\n  & .chat-input-actions-right {\n    flex-shrink: 0;\n    display: flex;\n\n    & .start-new-chat-button {\n      padding-bottom: var(--sys-size-2);\n      padding-right: var(--sys-size-3);\n    }\n  }\n}\n\n.chat-inline-button {\n  padding-left: 3px;\n}\n\n.select-element {\n  display: flex;\n  gap: var(--sys-size-3);\n  align-items: center;\n\n  .resource-link {\n    display: flex;\n    background-color: var(--sys-color-cdt-base-container);\n    align-items: center;\n    cursor: pointer;\n    padding: var(--sys-size-2) var(--sys-size-3);\n    font: var(--sys-typescale-body5-regular);\n    border: var(--sys-size-1) solid var(--sys-color-divider);\n    border-radius: var(--sys-shape-corner-extra-small);\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n    /*\n      Allow the link/task item to shrink below its intrinsic minimum width in the flex container,\n      enabling text-overflow ellipsis to work correctly.\n    */\n    min-width: 0;\n    line-height: 1;\n\n    & .title {\n      vertical-align: middle;\n      /* Fixed italic text getting cut off */\n      padding-right: var(--sys-size-2);\n      font: var(--sys-typescale-body5-regular);\n      overflow: hidden;\n      text-overflow: ellipsis;\n    }\n\n    & .remove-context,\n    & .add-context {\n      vertical-align: middle;\n    }\n\n    &:focus-visible {\n      outline: 2px solid var(--sys-color-state-focus-ring);\n    }\n\n    devtools-icon,\n    devtools-file-source-icon {\n      display: inline-flex;\n      vertical-align: middle;\n      min-width: var(--sys-size-7);\n      min-height: var(--sys-size-7);\n    }\n\n    &.disabled {\n      border-style: dashed;\n      border-color: var(--sys-color-neutral-outline);\n      color: var(--sys-color-on-surface-light);\n\n      devtools-icon,\n      devtools-file-source-icon {\n        /* Override devtools-file-source-icon */\n        --override-file-source-icon-color: var(\n          --sys-color-on-surface-light-graphics\n        );\n        /* Some icons set their style attribute and we need to override it */\n        /* stylelint-disable-next-line declaration-no-important */\n        color: var(--sys-color-on-surface-light-graphics) !important;\n      }\n\n      .title {\n        color: var(--sys-color-on-surface-light);\n        font-style: italic;\n      }\n    }\n\n    /*\n      CSS styling for `network-override-marker` is similar to\n      https://source.chromium.org/chromium/chromium/src/+/main:third_party/devtools-frontend/src/front_end/panels/network/networkLogView.css;l=379.\n      There is a difference in `left` and `top` values to make sure\n      it is placed correctly for the network icon in assistance panel.\n    */\n    .network-override-marker {\n      position: relative;\n      float: left;\n    }\n\n    .network-override-marker::before {\n      content: var(--image-file-empty);\n      width: var(--sys-size-4);\n      height: var(--sys-size-4);\n      border-radius: 50%;\n      outline: var(--sys-size-1) solid var(--icon-gap-focus-selected);\n      left: 11px;\n      position: absolute;\n      top: 13px;\n      z-index: 1;\n      background-color: var(--sys-color-purple-bright);\n    }\n\n    .image.icon {\n      display: inline-flex;\n      justify-content: center;\n      align-items: center;\n      vertical-align: middle;\n      margin-right: var(--sys-size-3);\n\n      img {\n        max-width: var(--sys-size-7);\n        max-height: var(--sys-size-7);\n      }\n    }\n  }\n}\n\n.link {\n  color: var(--text-link);\n  text-decoration: underline;\n  cursor: pointer;\n}\n\nbutton.link {\n  border: none;\n  background: none;\n  font: inherit;\n\n  &:focus-visible {\n    outline: var(--sys-size-2) solid var(--sys-color-state-focus-ring);\n    outline-offset: 0;\n    border-radius: var(--sys-shape-corner-extra-small);\n  }\n}\n\n.floaty {\n  font: var(--sys-typescale-body4);\n  color: var(--sys-color-on-surface);\n  user-select: none;\n  padding: 0;\n  margin: 0;\n  list-style-type: none;\n  display: flex;\n  flex-flow: row wrap;\n  align-items: flex-end;\n  gap: var(--sys-size-2);\n  margin-bottom: var(--sys-size-2);\n\n  li {\n    background: var(--sys-color-surface3);\n    border-radius: var(--sys-shape-corner-small);\n    border: 1px solid var(--sys-color-neutral-outline);\n    padding: var(--sys-size-2) var(--sys-size-3);\n    display: flex;\n    flex-direction: row;\n    align-items: center;\n    gap: var(--sys-size-2);\n    min-height: var(--sys-size-8);\n  }\n\n  .context-item {\n    display: flex;\n    flex-direction: row;\n    align-items: center;\n    gap: var(--sys-size-2);\n  }\n\n  .open-floaty {\n    padding: 0;\n    border: none;\n\n    /* To align with other chips */\n    margin-bottom: 1px;\n  }\n}\n\n.chat-input-footer {\n  display: flex;\n  justify-content: center;\n  padding-block: var(--sys-size-3);\n  font: var(--sys-typescale-body5-regular);\n  border-top: 1px solid var(--sys-color-divider);\n  text-wrap: balance;\n  text-align: center;\n  width: 100%;\n\n  /*\n    The footer (for active conversations) is hidden by default on wider screens\n    because the disclaimer is shown inline within the chat input actions. Show it only on narrow widths (< 400px).\n  */\n  &:not(.is-read-only) {\n    display: none;\n    border: none;\n\n    @container --chat-ui-container (width < 400px) {\n      display: flex;\n    }\n  }\n}\n", _i = /* @__PURE__ */ e({
	ChatInput: () => ji,
	DEFAULT_VIEW: () => Ai
}), { html: B, Directives: { createRef: vi, ref: yi } } = ue, { widget: bi } = Me, xi = {
	inputTextAriaDescription: "You can also use one of the suggested prompts above to start your conversation",
	revealContextDescription: "Reveal the selected context item in DevTools",
	learnAbout: "Learn about AI in DevTools"
}, V = {
	sendButtonTitle: "Send",
	startNewChat: "Start new chat",
	cancelButtonTitle: "Cancel",
	selectAnElement: "Select an element",
	takeScreenshotButtonTitle: "Take screenshot",
	removeImageInputButtonTitle: "Remove image input",
	addImageButtonTitle: "Add image",
	pastConversation: "You're viewing a past conversation.",
	screenshotFailureMessage: "Failed to take a screenshot. Please try again.",
	uploadImageFailureMessage: "Failed to upload image. Please try again.",
	addContext: "Add item for context",
	removeContextElement: "Remove element from context",
	removeContextRequest: "Remove request from context",
	removeContextFile: "Remove file from context",
	removeContextPerfInsight: "Remove performance insight from context",
	removeContextStorage: "Remove storage from context",
	removeContext: "Remove from context"
}, Si = i("panels/ai_assistance/components/ChatInput.ts", xi), Ci = n.bind(void 0, Si), H = a, wi = 80, Ti = "image/jpeg", Ei = 100, Di = "relevant-data-link-chat", Oi = "relevant-data-link-footer";
function ki(e) {
	return e instanceof Ot ? H(V.removeContextFile) : e instanceof gt ? H(V.removeContextElement) : e instanceof lt ? H(V.removeContextRequest) : e instanceof Lt ? H(V.removeContextPerfInsight) : e instanceof Ct ? H(V.removeContextStorage) : H(V.removeContext);
}
var Ai = (e, t, n) => {
	let r = m({
		"chat-input-container": !0,
		"single-line-layout": !e.context,
		disabled: e.isTextInputDisabled
	}), i = (t) => B`
      <div class=${m({
		"chat-input-disclaimer": !0,
		"hide-divider": !e.isLoading && e.blockedByCrossOrigin
	})}>
        <button
          class="link"
          role="link"
          aria-details=${t}
          jslog=${Xe("open-ai-settings").track({ click: !0 })}
          @click=${(e) => {
		e.preventDefault(), x.instance().showView("chrome-ai");
	}}
        >${H("Relevant data")}</button>&nbsp;${H("is sent to Google")}
        <devtools-tooltip
          id=${t}
          variant="rich"
        ><div class="info-tooltip-container">
          ${e.disclaimerText}
          <button
            class="link tooltip-link"
            role="link"
            jslog=${Xe("open-ai-settings").track({ click: !0 })}
            @click=${() => {
		x.instance().showView("chrome-ai");
	}}>${Ci(xi.learnAbout)}
          </button>
        </div></devtools-tooltip>
      </div>
    `;
	f(B`
    <style>${tn}</style>
    <style>${gi}</style>
    ${e.isReadOnly ? B`
        <div
          class="chat-readonly-container"
          jslog=${S("read-only")}
        >
          <span>${H(V.pastConversation)}</span>
          <devtools-button
            aria-label=${H(V.startNewChat)}
            class="chat-inline-button"
            @click=${e.onNewConversation}
            .data=${{
		variant: d.TEXT,
		title: H(V.startNewChat),
		jslogContext: "start-new-chat"
	}}
          >${H(V.startNewChat)}</devtools-button>
        </div>` : B`
        <form class="input-form" @submit=${e.onSubmit}>
          <div class=${r}>
            ${e.multimodalInputEnabled && e.imageInput && !e.isTextInputDisabled ? B`
                <div class="image-input-container">
                  <devtools-button
                    aria-label=${H(V.removeImageInputButtonTitle)}
                    @click=${e.onRemoveImageInput}
                    .data=${{
		variant: d.ICON,
		size: h.MICRO,
		iconName: "cross",
		title: H(V.removeImageInputButtonTitle)
	}}
                  ></devtools-button>
                  ${e.imageInput.isLoading ? B`
                      <div class="loading">
                        <devtools-spinner></devtools-spinner>
                      </div>` : B`
                      <img src="data:${e.imageInput.mimeType};base64, ${e.imageInput.data}" alt="Image input" />`}
                </div>` : g}
            <textarea
              class="chat-input"
              .disabled=${e.isTextInputDisabled}
              wrap="hard"
              maxlength="10000"
              @keydown=${e.onTextAreaKeyDown}
              @paste=${e.onImagePaste}
              @dragover=${e.onImageDragOver}
              @drop=${e.onImageDrop}
              @input=${(t) => {
		e.onTextInputChange(t.target.value);
	}}
              placeholder=${e.inputPlaceholder}
              jslog=${qe("query").track({
		change: !0,
		keydown: "Enter"
	})}
              aria-description=${Ci(xi.inputTextAriaDescription)}
              ${yi(e.textAreaRef)}
            ></textarea>
            <div class="chat-input-actions">
              <div class="chat-input-actions-left">
                ${e.context ? B`
                    <div class="select-element">
                      ${e.conversationType === O.STYLING ? B`
                          <devtools-button
                            .data=${{
		variant: d.ICON_TOGGLE,
		size: h.SMALL,
		iconName: "select-element",
		toggledIconName: "select-element",
		toggleType: pe.PRIMARY,
		toggled: e.inspectElementToggled,
		title: H(V.selectAnElement),
		jslogContext: "select-element",
		disabled: e.isTextInputDisabled
	}}
                            @click=${e.onInspectElementClick}
                          ></devtools-button>` : g}
                      <div
                        class=${m({
		"resource-link": !0,
		disabled: !e.isContextSelected
	})}
                      >
                        ${e.context instanceof gt ? B`
                              <devtools-widget
                                class="title"
                                ${bi(jt, {
		node: e.context.getItem(),
		options: {
			disabled: !e.isContextSelected,
			hiddenClassList: e.context.getItem().classNames().filter((e) => e.startsWith(ht)),
			ariaDescription: Ci(xi.revealContextDescription)
		}
	})}
                              ></devtools-widget>` : B`
                          ${e.context instanceof lt ? nn.getIconForNetworkRequest(e.context.getItem()) : e.context instanceof Ot ? nn.getIconForSourceFile(e.context.getItem()) : e.context instanceof ut ? B`<devtools-icon class="icon" name="performance" title="Lighthouse"></devtools-icon>` : e.context instanceof Lt ? B`<devtools-icon class="icon" name="performance" title="Performance"></devtools-icon>` : e.context instanceof Ct ? B`<devtools-icon class="icon" name="table" title="Storage"></devtools-icon>` : g}
                            <span
                              role="button"
                              class="title"
                              tabindex="0"
                              @click=${e.onContextClick}
                              @keydown=${(t) => {
		(t.key === "Enter" || t.key === " ") && e.onContextClick();
	}}
                              aria-description=${Ci(xi.revealContextDescription)}
                            >${e.context.getTitle()}</span>`}
                        ${e.isContextSelected && e.onContextRemoved ? B`
                                  <devtools-button
                                    title=${ki(e.context)}
                                    aria-label=${ki(e.context)}
                                    class="remove-context"
                                    .iconName=${"cross"}
                                    .size=${h.MICRO}
                                    .jslogContext=${"context-removed"}
                                    .variant=${d.ICON}
                                    @click=${e.onContextRemoved}></devtools-button>` : g}
                      ${!e.isContextSelected && e.onContextAdd ? B`
                                    <devtools-button
                                      title=${H(V.addContext)}
                                      aria-label=${H(V.addContext)}
                                      class="add-context"
                                      .iconName=${"plus"}
                                      .size=${h.MICRO}
                                      .jslogContext=${"context-added"}
                                      .variant=${d.ICON}
                                      @click=${e.onContextAdd}></devtools-button>` : g}
                      </div>
                    </div>` : g}
              </div>
              <div class="chat-input-actions-right">
                <div class="chat-input-disclaimer-container">
                  ${i(Di)}
                </div>
                ${e.multimodalInputEnabled && !e.blockedByCrossOrigin ? B`
                    ${e.uploadImageInputEnabled ? B`
                        <devtools-button
                          class="chat-input-button"
                          aria-label=${H(V.addImageButtonTitle)}
                          @click=${e.onImageUpload}
                          .data=${{
		variant: d.ICON,
		size: h.REGULAR,
		disabled: e.isTextInputDisabled || e.imageInput?.isLoading,
		iconName: "add-photo",
		title: H(V.addImageButtonTitle),
		jslogContext: "upload-image"
	}}
                        ></devtools-button>` : g}
                    <devtools-button
                      class="chat-input-button"
                      aria-label=${H(V.takeScreenshotButtonTitle)}
                      @click=${e.onTakeScreenshot}
                      .data=${{
		variant: d.ICON,
		size: h.REGULAR,
		disabled: e.isTextInputDisabled || e.imageInput?.isLoading,
		iconName: "photo-camera",
		title: H(V.takeScreenshotButtonTitle),
		jslogContext: "take-screenshot"
	}}
                    ></devtools-button>` : g}
                ${e.isLoading ? B`
                    <devtools-button
                      class="chat-input-button"
                      aria-label=${H(V.cancelButtonTitle)}
                      @click=${e.onCancel}
                      .data=${{
		variant: d.ICON,
		size: h.REGULAR,
		iconName: "record-stop",
		title: H(V.cancelButtonTitle),
		jslogContext: "stop"
	}}
                    ></devtools-button>` : e.blockedByCrossOrigin ? B`
                      <devtools-button
                        class="start-new-chat-button"
                        aria-label=${H(V.startNewChat)}
                        @click=${e.onNewConversation}
                        .data=${{
		variant: d.OUTLINED,
		size: h.SMALL,
		title: H(V.startNewChat),
		jslogContext: "start-new-chat"
	}}
                      >${H(V.startNewChat)}</devtools-button>` : B`
                      <devtools-button
                        class="chat-input-button"
                        aria-label=${H(V.sendButtonTitle)}
                        .data=${{
		type: "submit",
		variant: d.ICON,
		size: h.REGULAR,
		disabled: e.isTextInputDisabled || e.isTextInputEmpty || e.imageInput?.isLoading,
		iconName: "send",
		title: H(V.sendButtonTitle),
		jslogContext: "send"
	}}
                      ></devtools-button>`}
              </div>
            </div>
          </div>
        </form>`}
    <footer
      class=${m({
		"chat-input-footer": !0,
		"is-read-only": e.isReadOnly
	})}
      jslog=${S("footer")}
    >
      ${i(Oi)}
    </footer>
  `, n);
}, ji = class extends Be {
	isLoading = !1;
	blockedByCrossOrigin = !1;
	isTextInputDisabled = !1;
	inputPlaceholder = "";
	context = null;
	isContextSelected = !1;
	inspectElementToggled = !1;
	disclaimerText = "";
	conversationType = O.STYLING;
	multimodalInputEnabled = !1;
	uploadImageInputEnabled = !1;
	isReadOnly = !1;
	#e = vi();
	#t;
	#n = -1;
	#r = "";
	setInputValue(e) {
		if (this.#e.value) {
			let t = this.#e.value.maxLength, n = t >= 0 ? e.substring(0, t) : e;
			this.#e.value.value = n, this.#e.value.setSelectionRange(n.length, n.length);
		}
		this.performUpdate();
	}
	#i() {
		return !this.#e.value?.value?.trim();
	}
	onTextSubmit = () => {};
	onContextClick = () => {};
	onInspectElementClick = () => {};
	onCancelClick = () => {};
	onNewConversation = () => {};
	onContextRemoved = null;
	onContextAdd = null;
	#a(e) {
		let t = kt.instance().getRecentPrompts();
		t.length && (e === -1 ? (this.#n === -1 && (this.#r = this.#e.value?.value || ""), this.#n < t.length - 1 && (this.#n++, this.setInputValue(t[this.#n]))) : this.#n > 0 ? (this.#n--, this.setInputValue(t[this.#n])) : this.#n === 0 && (this.#n = -1, this.setInputValue(this.#r)));
	}
	async #o() {
		let e = b.instance().primaryPageTarget();
		if (!e) throw Error("Could not find main target");
		let t = e.model(Oe);
		if (!t) throw Error("Could not find model");
		let n = setTimeout(() => {
			this.#t = { isLoading: !0 }, this.performUpdate();
		}, Ei), r = await t.captureScreenshot(ze.CaptureScreenshotRequestFormat.Jpeg, wi, Ie.FROM_VIEWPORT);
		clearTimeout(n), r ? (this.#t = {
			isLoading: !1,
			data: r,
			mimeType: Ti,
			inputType: Pt.SCREENSHOT
		}, this.performUpdate(), this.updateComplete.then(() => {
			this.focusTextInput();
		})) : (this.#t = void 0, this.performUpdate(), Xt.show({ message: H(V.screenshotFailureMessage) }));
	}
	targetAdded(e) {}
	targetRemoved(e) {}
	#s() {
		this.#t = void 0, this.performUpdate(), this.updateComplete.then(() => {
			this.focusTextInput();
		});
	}
	#c(e, t) {
		if (this.conversationType !== O.STYLING) return;
		let n = e?.files;
		if (!n || n.length === 0) return;
		let r = Array.from(n).find((e) => e.type.startsWith("image/"));
		r && (t.preventDefault(), this.#f(r));
	}
	#l = (e) => {
		this.#c(e.clipboardData, e);
	};
	#u = (e) => {
		this.conversationType === O.STYLING && e.preventDefault();
	};
	#d = (e) => {
		this.#c(e.dataTransfer, e);
	};
	async #f(e) {
		let t = setTimeout(() => {
			this.#t = { isLoading: !0 }, this.performUpdate();
		}, Ei);
		try {
			let t = new FileReader(), n = await new Promise((n, r) => {
				t.onload = () => {
					typeof t.result == "string" ? n(t.result) : r(/* @__PURE__ */ Error("FileReader result was not a string."));
				}, t.readAsDataURL(e);
			}), r = n.indexOf(","), i = n.substring(r + 1);
			this.#t = {
				isLoading: !1,
				data: i,
				mimeType: e.type,
				inputType: Pt.UPLOADED_IMAGE
			};
		} catch {
			this.#t = void 0, Xt.show({ message: H(V.uploadImageFailureMessage) });
		}
		clearTimeout(t), this.performUpdate(), this.updateComplete.then(() => {
			this.focusTextInput();
		});
	}
	#p;
	constructor(e, t) {
		super(e), this.#p = t ?? Ai;
	}
	wasShown() {
		super.wasShown(), b.instance().addModelListener(ge, re.PrimaryPageChanged, this.#m, this);
	}
	willHide() {
		super.willHide(), b.instance().removeModelListener(ge, re.PrimaryPageChanged, this.#m, this);
	}
	#m() {
		this.#t = void 0, this.performUpdate();
	}
	performUpdate() {
		this.#p({
			inputPlaceholder: this.inputPlaceholder,
			isLoading: this.isLoading,
			blockedByCrossOrigin: this.blockedByCrossOrigin,
			isTextInputDisabled: this.isTextInputDisabled,
			context: this.context,
			isContextSelected: this.isContextSelected,
			inspectElementToggled: this.inspectElementToggled,
			isTextInputEmpty: this.#i(),
			disclaimerText: this.disclaimerText,
			conversationType: this.conversationType,
			multimodalInputEnabled: this.multimodalInputEnabled,
			imageInput: this.#t,
			uploadImageInputEnabled: this.uploadImageInputEnabled,
			isReadOnly: this.isReadOnly,
			textAreaRef: this.#e,
			onContextClick: this.onContextClick,
			onInspectElementClick: this.onInspectElementClick,
			onImagePaste: this.#l,
			onNewConversation: this.onNewConversation,
			onTextInputChange: () => {
				this.requestUpdate();
			},
			onTakeScreenshot: this.#o.bind(this),
			onRemoveImageInput: this.#s.bind(this),
			onSubmit: this.onSubmit,
			onTextAreaKeyDown: this.onTextAreaKeyDown,
			onCancel: this.onCancel,
			onImageUpload: this.onImageUpload,
			onImageDragOver: this.#u,
			onImageDrop: this.#d,
			onContextRemoved: this.onContextRemoved,
			onContextAdd: this.onContextAdd
		}, void 0, this.contentElement);
	}
	focusTextInput() {
		this.#e.value?.focus();
	}
	onSubmit = (e) => {
		if (e.preventDefault(), this.#t?.isLoading) return;
		let t = !this.#t?.isLoading && this.#t?.data ? { inlineData: {
			data: this.#t.data,
			mimeType: this.#t.mimeType
		} } : void 0;
		this.onTextSubmit(this.#e.value?.value ?? "", t, this.#t?.inputType), this.#t = void 0, this.#n = -1, this.#r = "", this.setInputValue("");
	};
	onTextAreaKeyDown = (e) => {
		if (e.target && e.target instanceof HTMLTextAreaElement) {
			if (e.key === "ArrowUp") {
				let { value: t, selectionStart: n, selectionEnd: r } = e.target;
				n === r && t.lastIndexOf("\n", n - 1) === -1 && (e.preventDefault(), this.#a(-1));
				return;
			}
			if (e.key === "ArrowDown") {
				let { selectionEnd: t, selectionStart: n, value: r } = e.target;
				n === t && r.indexOf("\n", t) === -1 && (e.preventDefault(), this.#a(1));
				return;
			}
			if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
				if (e.preventDefault(), !e.target?.value || this.#t?.isLoading) return;
				let t = !this.#t?.isLoading && this.#t?.data ? { inlineData: {
					data: this.#t.data,
					mimeType: this.#t.mimeType
				} } : void 0;
				this.onTextSubmit(e.target.value, t, this.#t?.inputType), this.#t = void 0, this.#n = -1, this.#r = "", this.setInputValue("");
			}
		}
	};
	onCancel = (e) => {
		e.preventDefault(), this.isLoading && this.onCancelClick();
	};
	onImageUpload = (e) => {
		e.stopPropagation(), Ke(this.#f.bind(this), ".jpeg,.jpg,.png").click();
	};
}, Mi = "/*\n * Copyright 2024 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n* {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}\n\n:host {\n  width: 100%;\n  height: 100%;\n  user-select: text;\n  display: flex;\n  flex-direction: column;\n  background-color: var(--sys-color-cdt-base-container);\n}\n\n.chat-ui {\n  width: 100%;\n  height: 100%;\n  max-height: 100%;\n  display: flex;\n  flex-direction: column;\n  container-type: size;\n  container-name: --chat-ui-container;\n}\n\n.info-tooltip-container {\n  max-width: var(--sys-size-28);\n  padding: var(--sys-size-4) var(--sys-size-5);\n}\n\n.tooltip-link {\n  display: block;\n  margin-top: var(--sys-size-4);\n  color: var(--sys-color-primary);\n  padding-left: 0;\n}\n\n.chat-cancel-context-button {\n  padding-bottom: 3px;\n  padding-right: var(--sys-size-3);\n}\n\n\n.messages-container {\n  flex-grow: 1;\n  width: 100%;\n  max-width: var(--sys-size-36);\n\n  /* Prevents the container from jumping when the scrollbar is shown */\n  /* 688px is the max width of the input form + left and right paddings: var(--sys-size-36) + 2 * var(--sys-size-5)  */\n  @container (width > 688px) {\n    --half-scrollbar-width: calc((100cqw - 100%) / 2);\n\n    margin-left: var(--half-scrollbar-width);\n    margin-right: calc(-1 * var(--half-scrollbar-width));\n  }\n}\n\n.link {\n  color: var(--text-link);\n  text-decoration: underline;\n  cursor: pointer;\n}\n\nbutton.link {\n  border: none;\n  background: none;\n  font: inherit;\n\n  &:focus-visible {\n    outline: var(--sys-size-2) solid var(--sys-color-state-focus-ring);\n    outline-offset: 0;\n    border-radius: var(--sys-shape-corner-extra-small);\n  }\n}\n\n.select-an-element-text {\n  margin-left: 2px;\n}\n\nmain {\n  overflow: hidden auto;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  height: 100%;\n  container-type: size;\n  scrollbar-width: thin;\n  /*\n  Even though `transform: translateZ(1px)` doesn't have a visual effect,\n  it puts `main` element into another rendering layer which somehow\n  fixes the `.input-form` jumping on scroll issue.\n  */\n  transform: translateZ(1px);\n  scroll-timeline: --scroll-timeline y;\n}\n\n.empty-state-container {\n  flex-grow: 1;\n  display: grid;\n  align-items: center;\n  justify-content: center;\n  font: var(--sys-typescale-headline4);\n  gap: var(--sys-size-8);\n  padding: var(--sys-size-4);\n  max-width: var(--sys-size-33);\n\n  /* Prevents the container from jumping when the scrollbar is shown */\n  /* 688px is the max width of the input form + left and right paddings: var(--sys-size-36) + 2 * var(--sys-size-5)  */\n  @container (width > 688px) {\n    --half-scrollbar-width: calc((100cqw - 100%) / 2);\n\n    margin-left: var(--half-scrollbar-width);\n    margin-right: calc(-1 * var(--half-scrollbar-width));\n  }\n\n  .header {\n    display: flex;\n    flex-direction: column;\n    width: 100%;\n    align-items: center;\n    justify-content: center;\n    align-self: end;\n    gap: var(--sys-size-5);\n\n    .icon {\n      display: flex;\n      justify-content: center;\n      align-items: center;\n      height: var(--sys-size-14);\n      width: var(--sys-size-14);\n      border-radius: var(--sys-shape-corner-small);\n      background: linear-gradient(\n        135deg,\n        var(--sys-color-gradient-primary),\n        var(--sys-color-gradient-tertiary)\n      );\n    }\n\n    h1 {\n      font: var(--sys-typescale-headline4);\n    }\n\n    p {\n      text-align: center;\n      font: var(--sys-typescale-body4-regular);\n    }\n  }\n\n  .empty-state-content {\n    display: flex;\n    flex-direction: column;\n    gap: var(--sys-size-5);\n    align-items: center;\n    justify-content: center;\n    align-self: start;\n  }\n}\n\n.gemini {\n  .empty-state-container {\n    padding: var(--sys-size-8);\n  }\n\n  .empty-state-container .icon {\n    display: none;\n  }\n\n  .empty-state-container .header {\n    align-items: flex-start;\n    line-height: var(--sys-size-4);\n  }\n\n  .empty-state-content {\n    align-items: flex-start\n  }\n\n  .empty-state-container .greeting {\n    font-size: var(--sys-size-10);\n    color: var(--sys-color-primary);\n  }\n\n  .empty-state-container .cta {\n    font-size: var(--sys-size-10);\n  }\n\n  main {\n    align-items: flex-start;\n  }\n}\n\n.change-summary {\n  background-color: var(--sys-color-surface3);\n  border-radius: var(--sys-shape-corner-medium-small);\n  position: relative;\n  margin: 0 var(--sys-size-5) var(--sys-size-7) var(--sys-size-5);\n  padding: 0 var(--sys-size-5);\n\n  &.saved-to-disk {\n    pointer-events: none;\n  }\n\n  & .header-container {\n    display: flex;\n    align-items: center;\n    gap: var(--sys-size-3);\n    height: var(--sys-size-14);\n    padding-left: var(--sys-size-3);\n\n    devtools-spinner {\n      width: var(--sys-size-6);\n      height: var(--sys-size-6);\n      margin-left: var(--sys-size-3);\n      margin-right: var(--sys-size-3);\n    }\n\n    & devtools-icon.summary-badge {\n      width: var(--sys-size-8);\n      height: var(--sys-size-8);\n    }\n\n    & .green-bright-icon {\n      color: var(--sys-color-green-bright);\n    }\n\n    & .on-tonal-icon {\n      color: var(--sys-color-on-tonal-container);\n    }\n\n    & .header-text {\n      font: var(--sys-typescale-body4);\n      color: var(--sys-color-on-surface);\n      white-space: nowrap;\n      overflow-x: hidden;\n      text-overflow: ellipsis;\n    }\n\n    & .arrow {\n      margin-left: auto;\n    }\n\n    &::marker {\n      content: '';\n    }\n  }\n\n  &:not(.saved-to-disk, &[open]):hover::after {\n    content: '';\n    height: 100%;\n    width: 100%;\n    border-radius: inherit;\n    position: absolute;\n    top: 0;\n    left: 0;\n    pointer-events: none;\n    background-color: var(--sys-color-state-hover-on-subtle);\n  }\n\n  &[open]:not(.saved-to-disk) {\n    &::details-content {\n      height: fit-content;\n      padding: var(--sys-size-2) 0;\n      border-radius: inherit;\n    }\n\n    summary .arrow {\n      transform: rotate(180deg);\n    }\n  }\n\n  devtools-code-block {\n    margin-bottom: var(--sys-size-5);\n\n    --code-block-background-color: var(--sys-color-surface1);\n  }\n\n  .error-container {\n    display: flex;\n    align-items: center;\n    gap: var(--sys-size-3);\n    color: var(--sys-color-error);\n  }\n\n  .footer {\n    display: flex;\n    flex-flow: row wrap;\n    justify-content: space-between;\n    margin: var(--sys-size-5) 0 var(--sys-size-5) var(--sys-size-2);\n    gap: var(--sys-size-6) var(--sys-size-5);\n\n    .disclaimer-link {\n      align-self: center;\n    }\n\n    .left-side {\n      flex-grow: 1;\n      display: flex;\n      align-self: center;\n      gap: var(--sys-size-3);\n    }\n\n    .save-or-discard-buttons {\n      flex-grow: 1;\n      display: flex;\n      justify-content: flex-end;\n      gap: var(--sys-size-3);\n    }\n\n    .change-workspace {\n      display: flex;\n      flex-direction: row;\n      align-items: center;\n      gap: var(--sys-size-3);\n      min-width: var(--sys-size-22);\n      flex: 1 1 40%;\n\n      .folder-name {\n        white-space: nowrap;\n        overflow-x: hidden;\n        text-overflow: ellipsis;\n      }\n    }\n\n    .loading-text-container {\n      margin-right: var(--sys-size-3);\n      display: flex;\n      justify-content: center;\n      align-items: center;\n      gap: var(--sys-size-3);\n    }\n\n    .apply-to-workspace-container {\n      display: flex;\n      align-items: center;\n      gap: var(--sys-size-3);\n      min-width: fit-content;\n      justify-content: flex-end;\n      flex-grow: 1;\n      flex-shrink: 1;\n\n      devtools-icon {\n        /* var(--sys-size-8) is too small and var(--sys-size-9) is too big. */\n        width: 18px;\n        height: 18px;\n        margin-left: var(--sys-size-2);\n      }\n    }\n  }\n}\n\n@keyframes reveal {\n  0%,\n  99% {\n    opacity: 100%;\n  }\n\n  100% {\n    opacity: 0%;\n  }\n}\n\n.sticky {\n  position: sticky;\n  bottom: 0;\n  z-index: 9999;\n}\n\n.chat-input-widget {\n  width: 100%;\n  max-width: var(--sys-size-36);\n  background-color: var(--sys-color-cdt-base-container);\n  /*\n  The `box-shadow` is a workaround to hide the content appearing between the `.input-form`\n  and the footer in some resolutions even though the `.input-form` has `bottom: 0`.\n  */\n  box-shadow: 0 1px var(--sys-color-cdt-base-container);\n\n  /* Prevents the input form from jumping when the scrollbar is shown */\n  /* 688px is the max width of the input form + left and right paddings: var(--sys-size-36) + 2 * var(--sys-size-5)  */\n  @container (width > 688px) {\n    --half-scrollbar-width: calc((100cqw - 100%) / 2);\n\n    margin-left: var(--half-scrollbar-width);\n    margin-right: calc(-1 * var(--half-scrollbar-width));\n  }\n\n  /* when there isn't enough space to view the messages,\n  do not overlay the input form on top of the messages */\n  /* height < var(--sys-size-27) */\n  @container (height < 224px) {\n    margin-top: var(--sys-size-4);\n    margin-bottom: var(--sys-size-4);\n    position: static;\n  }\n\n  @container --chat-ui-container (width < 400px) {\n    /*\n      The footer already adds necessary paddings for this state.\n      However, without the `padding-bottom` here, the outline in the bottom\n      is rendered behind the footer. So, we add 1px space here to make sure\n      that the outline is rendered fully.\n    */\n    padding-bottom: var(--sys-size-1);\n  }\n}\n", Ni = "/*\n * Copyright 2026 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n@scope to (devtools-widget > *) {\n  :scope {\n    width: 100%;\n    box-shadow: none;\n    padding: var(--sys-size-8);\n    background-color: var(--sys-color-surface);\n    border-radius: var(--sys-shape-corner-medium);\n  }\n\n  .export-for-agents-dialog {\n    width: var(--sys-size-33); /* 512px */\n    max-width: 100%; /* deal with the dialog being squashed on smaller devices */\n  }\n\n  .export-for-agents-dialog header {\n    margin-bottom: var(--sys-size-6);\n\n    h1 {\n      font: var(--sys-typescale-headline5);\n      margin: 0;\n      color: var(--sys-color-on-surface);\n    }\n  }\n\n  .export-for-agents-dialog .state-selection {\n    display: flex;\n    gap: var(--sys-size-5);\n    margin: var(--sys-size-7) 0;\n  }\n\n  .export-for-agents-dialog .state-selection label {\n    display: flex;\n    align-items: center;\n    gap: var(--sys-size-2);\n    cursor: pointer;\n    font: var(--sys-typescale-body3-regular);\n\n    input {\n      /* Remove the margin on radio buttons so that the text and the\n       * radio button are properly aligned vertically. */\n      margin-bottom: 0;\n    }\n  }\n\n  .export-for-agents-dialog textarea {\n    width: 100%;\n    min-height: var(--sys-size-30); /* 288px */\n    max-height: var(--sys-size-34); /* 512px */\n    resize: none;\n    padding: var(--sys-size-5);\n    box-sizing: border-box;\n    font-family: var(--monospace-font-family);\n    font-size: var(--monospace-font-size);\n    background-color: var(--sys-color-surface5);\n    color: var(--sys-color-on-surface);\n    border-radius: var(--sys-shape-corner-small);\n    border: none;\n  }\n\n  main {\n    position: relative;\n  }\n\n  .prompt-loading {\n    position: absolute;\n    padding: var(--sys-size-5);\n    display: flex;\n    align-items: center;\n    justify-content: flex-start;\n    gap: var(--sys-size-5);\n  }\n\n  .export-for-agents-dialog .disclaimer {\n    margin-top: var(--sys-size-5);\n    font: var(--sys-typescale-body4-regular);\n    color: var(--sys-color-on-surface-subtle);\n  }\n\n  .export-for-agents-dialog footer {\n    display: flex;\n    justify-content: flex-end;\n    margin-top: var(--sys-size-6);\n  }\n\n  .export-for-agents-dialog .right-buttons {\n    display: flex;\n    gap: var(--sys-size-5);\n  }\n}\n", Pi = /* @__PURE__ */ e({
	DEFAULT_VIEW: () => Bi,
	ExportForAgentsDialog: () => Vi,
	StateType: () => Ri
}), { html: Fi, render: Ii } = ue, U = {
	exportForAgents: "Copy to coding agent",
	copyToClipboard: "Copy to clipboard",
	copiedToClipboard: "Copied to clipboard",
	asPrompt: "Summary prompt",
	asMarkdown: "Full conversation",
	saveAsMarkdown: "Save as…",
	generatingSummary: "Generating summary…",
	disclaimer: "This is an experimental AI feature and won’t always get it right. Double check this text before pasting into another tool."
}, Li = i("panels/ai_assistance/components/ExportForAgentsDialog.ts", U), W = n.bind(void 0, Li), Ri = /* @__PURE__ */ function(e) {
	return e.PROMPT = "prompt", e.CONVERSATION = "conversation", e;
}({}), zi = "prompt", Bi = (e, t, n) => {
	let r = e.state.activeType === "prompt", i = W(r ? U.copyToClipboard : U.saveAsMarkdown), a = r ? e.state.promptText : e.state.conversationText;
	Ii(Fi`
    <style>${Ni}</style>
    <div class="export-for-agents-dialog" jslog=${Pe("ai-export-for-agents")}>
      <header>
        <h1 id="export-for-agents-dialog-title" tabindex="-1">
          ${W(U.exportForAgents)}
        </h1>
      </header>
      <div class="state-selection" role="radiogroup" aria-labelledby="export-for-agents-dialog-title">
        <label>
          <input
            type="radio"
            value="prompt"
            name="export-state"
            .checked=${r}
            autofocus
            aria-label=${W(U.asPrompt)}
            @change=${() => e.onStateChange("prompt")}
          >
          ${W(U.asPrompt)}
        </label>
        <label>
          <input
            type="radio"
            value="conversation"
            name="export-state"
            .checked=${!r}
            aria-label=${W(U.asMarkdown)}
            @change=${() => e.onStateChange("conversation")}
          >
          ${W(U.asMarkdown)}
        </label>
      </div>
      <main>
        ${r && e.state.isPromptLoading ? Fi`
          <span class="prompt-loading">
            <devtools-spinner></devtools-spinner>
            ${W(U.generatingSummary)}
          </span>
          ` : g}
        ${r ? Fi`<textarea class="prompt" readonly .value=${e.state.isPromptLoading ? "" : a}></textarea>` : Fi`<textarea class="conversation" readonly .value=${a}></textarea>`}
      </main>
      <div class="disclaimer">${W(U.disclaimer)}</div>
      <footer>
        <div class="right-buttons">
          <devtools-button
            @click=${e.onButtonClick}
            .jslogContext=${e.jslogContext}
            .variant=${d.PRIMARY}
            .disabled=${r && e.state.isPromptLoading}
            .accessibleLabel=${i}
          >
            ${i}
          </devtools-button>
        </div>
      </footer>
    </div>
  `, n);
}, Vi = class e extends ke {
	static #e = zi;
	#t;
	#n;
	#r;
	#i;
	constructor(t, n = Bi) {
		super(), this.#n = t.dialog, this.#r = {
			activeType: e.#e,
			promptText: typeof t.promptText == "string" ? t.promptText : "",
			conversationText: t.markdownText,
			isPromptLoading: typeof t.promptText != "string"
		}, this.#i = t.onConversationSaveAs, this.#t = n, typeof t.promptText != "string" && t.promptText.then((e) => {
			this.#r.promptText = e, this.#r.isPromptLoading = !1, this.requestUpdate();
		}), this.requestUpdate();
	}
	static clearPersistedViewState() {
		e.#e = zi;
	}
	#a = (t) => {
		this.#r.activeType = t, e.#e = t, this.requestUpdate();
	};
	performUpdate() {
		let e, t = "";
		switch (this.#r.activeType) {
			case "prompt":
				t = "ai-export-for-agents.copy-to-clipboard", e = (e) => {
					e.preventDefault(), Ce.copyText(this.#r.promptText), Xt.show({ message: W(U.copiedToClipboard) }).setAttribute("aria-label", W(U.copiedToClipboard)), this.#n.hide();
				};
				break;
			case "conversation": t = "ai-export-for-agents.save-as-markdown", e = () => {
				this.#n.hide(), this.#i();
			};
		}
		let n = {
			onButtonClick: e,
			state: this.#r,
			onStateChange: this.#a,
			jslogContext: t
		};
		this.#t(n, void 0, this.contentElement);
	}
	static show({ promptText: t, markdownText: n, onConversationSaveAs: r }) {
		let i = new ie();
		i.setAriaLabel(W(U.exportForAgents)), i.setOutsideClickCallback((e) => {
			e.consume(!0), i.hide();
		}), i.addCloseButton(), i.setSizeBehavior(ae.MEASURE_CONTENT), i.setDimmed(!0);
		let a = new e({
			dialog: i,
			promptText: t,
			markdownText: n,
			onConversationSaveAs: r
		});
		a.show(i.contentElement), a.updateComplete.then(() => {
			i.show();
		});
	}
}, { ref: Hi, repeat: Ui, classMap: Wi } = xe, { widget: Gi } = Me, Ki = {
	emptyStateText: "How can I help you?",
	emptyStateTextGemini: "Where should we start?"
}, qi = a, Ji = 1;
function Yi(e, t) {
	let n = e.filter((e) => e.entity === Sr.MODEL), r = n.at(-1);
	if (r) return t && e.at(-1) === r ? n.at(-2) : r;
}
var Xi = (e, t, n) => {
	let r = !!w.devToolsAiAssistanceV2?.enabled, i = Wi({
		"chat-ui": !0,
		gemini: ct(),
		"ai-v2": r
	}), a = Wi({
		"chat-input-widget": !0,
		sticky: !e.isReadOnly
	}), o = !r && !e.isLoading, s = Yi(e.messages, e.isLoading);
	f(p`
      <style>${Mi}</style>
      <div class=${i}>
        <main @scroll=${e.handleScroll} ${Hi((e) => {
		t.mainElement = e;
	})}>
          ${e.messages.length > 0 ? p`
            <div class="messages-container" ${Hi(e.handleMessageContainerRef)}>
              ${Ui(e.messages, (e) => e.id, (t, n) => {
		let r = n > 0 ? e.messages[n - 1] : null, i = t.entity === Sr.MODEL && r?.entity === Sr.USER ? r.text : "";
		return Gi(ti, {
			message: t,
			isLoading: e.isLoading && n === e.messages.length - 1,
			isReadOnly: e.isReadOnly,
			canShowFeedbackForm: e.canShowFeedbackForm,
			markdownRenderer: e.markdownRenderer,
			isLastMessage: n === e.messages.length - 1,
			isFirstMessage: n === 0,
			prompt: i,
			shouldShowCSSChangeSummary: t.id === s?.id,
			onSuggestionClick: e.handleSuggestionClick,
			onFeedbackSubmit: e.onFeedbackSubmit,
			onCopyResponseClick: e.onCopyResponseClick,
			onExportClick: e.exportForAgentsClick,
			changeSummary: e.changeSummary,
			walkthrough: { ...e.walkthrough }
		});
	})}
              ${o ? Gi(mi, {
		changeSummary: e.changeSummary ?? "",
		changeManager: e.changeManager
	}) : g}
            </div>
          ` : p`
            <div class="empty-state-container">
              <div class="header">
                <div class="icon">
                  <devtools-icon
                    name="smart-assistant"
                  ></devtools-icon>
                </div>
                ${ct() ? p`
                    <h1 class='greeting'>Hello</h1>
                    <p class='cta'>${qi(Ki.emptyStateTextGemini)}</p>
                  ` : p`<h1>${qi(Ki.emptyStateText)}</h1>`}
              </div>
              <div class="empty-state-content">
                ${e.emptyStateSuggestions.map(({ title: t, jslogContext: n }) => p`<devtools-button
                    class="suggestion"
                    @click=${() => e.handleSuggestionClick(t)}
                    .data=${{
		variant: d.OUTLINED,
		size: h.REGULAR,
		title: t,
		jslogContext: n ?? "suggestion",
		disabled: e.isTextInputDisabled
	}}
                  >${t}</devtools-button>`)}
              </div>
            </div>
          `}
          <devtools-widget class=${a} ${Gi(ji, {
		isLoading: e.isLoading,
		blockedByCrossOrigin: e.blockedByCrossOrigin,
		isTextInputDisabled: e.isTextInputDisabled,
		inputPlaceholder: e.inputPlaceholder,
		disclaimerText: e.disclaimerText,
		context: e.context,
		isContextSelected: e.isContextSelected,
		inspectElementToggled: e.inspectElementToggled,
		multimodalInputEnabled: e.multimodalInputEnabled ?? !1,
		conversationType: e.conversationType,
		uploadImageInputEnabled: e.uploadImageInputEnabled ?? !1,
		isReadOnly: e.isReadOnly,
		onContextClick: e.onContextClick,
		onInspectElementClick: e.onInspectElementClick,
		onTextSubmit: e.onTextSubmit,
		onCancelClick: e.onCancelClick,
		onNewConversation: e.onNewConversation,
		onContextRemoved: e.onContextRemoved,
		onContextAdd: e.onContextAdd
	})} ${Hi((e) => {
		t.input = e;
	})}></devtools-widget>
        </main>
      </div>
    `, n);
}, Zi = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t;
	#n;
	#r;
	#i = {};
	#a = new ResizeObserver(() => this.#u());
	#o = !0;
	#s = !1;
	#c;
	#l = null;
	constructor(e, t = Xi) {
		super(), this.#n = e, this.#c = t;
	}
	set props(e) {
		this.#n = e, this.#_();
	}
	connectedCallback() {
		this.#_(), this.#r && this.#a.observe(this.#r);
	}
	disconnectedCallback() {
		this.#a.disconnect();
	}
	focusTextInput() {
		let e = this.#e.querySelector(".chat-input");
		e && e.focus();
	}
	setInputValue(e) {
		this.#i.input?.getWidget()?.setInputValue(e);
	}
	restoreScrollPosition() {
		this.#t !== void 0 && this.#i.mainElement && this.#d(this.#t);
	}
	scrollToBottom() {
		this.#i.mainElement && this.#d(this.#i.mainElement.scrollHeight);
	}
	#u() {
		this.#o && this.#i.mainElement && this.#o && this.#d(this.#i.mainElement.scrollHeight);
	}
	#d(e) {
		this.#i.mainElement && (this.#t = e, this.#s = !0, this.#i.mainElement.scrollTop = e);
	}
	#f = (e) => {
		this.#r = e, e ? this.#a.observe(e) : (this.#o = !0, this.#a.disconnect());
	};
	#p = (e) => {
		if (e.target && e.target instanceof HTMLElement) {
			if (this.#s) {
				this.#s = !1;
				return;
			}
			this.#t = e.target.scrollTop, this.#o = e.target.scrollTop + e.target.clientHeight + Ji > e.target.scrollHeight;
		}
	};
	#m = (e) => {
		this.#i.input?.getWidget()?.setInputValue(e), this.#_(), this.focusTextInput(), y.actionTaken(C.AiAssistanceDynamicSuggestionClicked);
	};
	async #h() {
		let e = this.#n.conversationMarkdown.replace(/\*\*Export Timestamp \(UTC\):\*\* .*\n\n/, "");
		if (this.#l?.markdown === e) return this.#l.summary;
		try {
			let t = await this.#n.generateConversationSummary(this.#n.conversationMarkdown);
			return this.#l = {
				markdown: e,
				summary: t
			}, t;
		} catch (e) {
			return console.error(e), "Failed to generate summary.";
		}
	}
	async #g() {
		let e = this.#h();
		Vi.show({
			promptText: e,
			markdownText: this.#n.conversationMarkdown,
			onConversationSaveAs: this.#n.onExportConversation ?? (async () => {})
		});
	}
	#_() {
		this.#c({
			...this.#n,
			handleScroll: this.#p,
			handleSuggestionClick: this.#m,
			handleMessageContainerRef: this.#f,
			exportForAgentsClick: this.#g.bind(this)
		}, this.#i, this.#e);
	}
};
customElements.define("devtools-ai-chat-view", Zi);
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/ai_assistance/components/disabledWidget.css.mjs
var Qi = "/*\n * Copyright 2025 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n@scope to (devtools-widget > *) {\n  .disabled-view {\n    display: flex;\n    max-width: var(--sys-size-34);\n    border-radius: var(--sys-shape-corner-small);\n    box-shadow: var(--sys-elevation-level3);\n    background-color: var(--app-color-card-background);\n    font: var(--sys-typescale-body4-regular);\n    text-wrap: pretty;\n    padding: var(--sys-size-6) var(--sys-size-8);\n    margin: var(--sys-size-4);\n    line-height: var(--sys-size-9);\n\n    .disabled-view-icon-container {\n      flex-shrink: 0;\n      border-radius: var(--sys-shape-corner-extra-small);\n      width: var(--sys-size-9);\n      height: var(--sys-size-9);\n      background: linear-gradient(\n        135deg,\n        var(--sys-color-gradient-primary),\n        var(--sys-color-gradient-tertiary)\n      );\n      margin-right: var(--sys-size-5);\n\n      devtools-icon {\n        margin: var(--sys-size-2);\n        width: var(--sys-size-8);\n        height: var(--sys-size-8);\n      }\n    }\n  }\n\n  .link {\n    color: var(--text-link);\n    text-decoration: underline;\n    cursor: pointer;\n  }\n}\n", $i = /* @__PURE__ */ e({
	DEFAULT_VIEW: () => ia,
	DisabledWidget: () => aa
}), G = {
	notLoggedIn: "This feature is only available when you are signed into Chrome with your Google account",
	offline: "Check your internet connection and try again",
	settingsLink: "AI assistance in Settings",
	turnOnForStyles: "Turn on {PH1} to get help with understanding CSS styles",
	turnOnForStylesAndRequests: "Turn on {PH1} to get help with styles and network requests",
	turnOnForStylesRequestsAndFiles: "Turn on {PH1} to get help with styles, network requests, and files",
	turnOnForStylesRequestsPerformanceAndFiles: "Turn on {PH1} to get help with styles, network requests, performance, and files",
	notAvailableInIncognitoMode: "AI assistance is not available in Incognito mode or Guest mode"
}, ea = i("panels/ai_assistance/components/DisabledWidget.ts", G), ta = n.bind(void 0, ea);
function na(e) {
	switch (e) {
		case u.NO_ACCOUNT_EMAIL:
		case u.SYNC_IS_PAUSED: return p`${ta(G.notLoggedIn)}`;
		case u.NO_INTERNET: return p`${ta(G.offline)}`;
	}
}
function ra(e) {
	if (e.isOffTheRecord) return p`${ta(G.notAvailableInIncognitoMode)}`;
	let t = document.createElement("span");
	t.textContent = ta(G.settingsLink), t.classList.add("link"), ee(t), t.addEventListener("click", () => {
		x.instance().showView("chrome-ai");
	}), t.setAttribute("jslog", `${je("open-ai-settings").track({ click: !0 })}`);
	let n;
	return n = e.devToolsAiAssistancePerformanceAgent?.enabled ? Kt(ea, G.turnOnForStylesRequestsPerformanceAndFiles, { PH1: t }) : e.devToolsAiAssistanceFileAgent?.enabled ? Kt(ea, G.turnOnForStylesRequestsAndFiles, { PH1: t }) : e.devToolsAiAssistanceNetworkAgent?.enabled ? Kt(ea, G.turnOnForStylesAndRequests, { PH1: t }) : Kt(ea, G.turnOnForStyles, { PH1: t }), p`${n}`;
}
var ia = (e, t, n) => {
	f(p`
      <style>
        ${Qi}
      </style>
      <div class="disabled-view">
        <div class="disabled-view-icon-container">
          <devtools-icon name="smart-assistant"></devtools-icon>
        </div>
        <div>
          ${e.aidaAvailability === u.AVAILABLE ? ra(e.hostConfig) : na(e.aidaAvailability)}
        </div>
      </div>
    `, n);
}, aa = class extends Be {
	aidaAvailability = u.NO_ACCOUNT_EMAIL;
	#e;
	constructor(e, t = ia) {
		super(e), this.#e = t;
	}
	wasShown() {
		super.wasShown(), this.requestUpdate();
	}
	performUpdate() {
		let e = w;
		this.#e({
			aidaAvailability: this.aidaAvailability,
			hostConfig: e
		}, {}, this.contentElement);
	}
}, oa = "/*\n * Copyright 2025 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n@scope to (devtools-widget > *) {\n  .ai-assistance-explore-container {\n    &,\n    * {\n      box-sizing: border-box;\n      margin: 0;\n      padding: 0;\n    }\n\n    width: 100%;\n    height: fit-content;\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    margin: auto 0;\n    font: var(--sys-typescale-headline4);\n    gap: var(--sys-size-8);\n    padding: var(--sys-size-3);\n    overflow: auto;\n    scrollbar-gutter: stable both-edges;\n\n    .link {\n      padding: 0;\n      margin: 0 3px;\n    }\n\n    .header {\n      flex-shrink: 0;\n      display: flex;\n      flex-direction: column;\n      width: 100%;\n      align-items: center;\n      justify-content: center;\n      justify-self: center;\n      gap: var(--sys-size-4);\n\n      .icon {\n        display: flex;\n        justify-content: center;\n        align-items: center;\n        height: var(--sys-size-14);\n        width: var(--sys-size-14);\n        border-radius: var(--sys-shape-corner-small);\n        background: linear-gradient(\n          135deg,\n          var(--sys-color-gradient-primary),\n          var(--sys-color-gradient-tertiary)\n        );\n      }\n\n      h1 {\n        font: var(--sys-typescale-headline4);\n      }\n\n      p {\n        text-align: center;\n        font: var(--sys-typescale-body4-regular);\n      }\n\n      .link {\n        font: var(--sys-typescale-body4-regular);\n      }\n    }\n\n    .content {\n      flex-shrink: 0;\n      display: flex;\n      flex-direction: column;\n      gap: var(--sys-size-5);\n      align-items: center;\n      justify-content: center;\n      justify-self: center;\n    }\n\n    .feature-card {\n      display: flex;\n      padding: var(--sys-size-4) var(--sys-size-6);\n      gap: 10px;\n      background-color: var(--sys-color-surface2);\n      border-radius: var(--sys-shape-corner-medium-small);\n      width: 100%;\n      align-items: center;\n\n      .feature-card-icon {\n        min-width: var(--sys-size-12);\n        min-height: var(--sys-size-12);\n        display: flex;\n        justify-content: center;\n        align-items: center;\n        background-color: var(--sys-color-tonal-container);\n        border-radius: var(--sys-shape-corner-full);\n\n        devtools-icon {\n          width: 18px;\n          height: 18px;\n        }\n      }\n\n      .feature-card-content {\n        h3 {\n          font: var(--sys-typescale-body3-medium);\n        }\n\n        p {\n          font: var(--sys-typescale-body4-regular);\n          line-height: 18px;\n        }\n      }\n    }\n  }\n\n  .ai-assistance-explore-footer {\n    flex-shrink: 0;\n    width: 100%;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    padding-block: var(--sys-size-3);\n    font: var(--sys-typescale-body5-regular);\n    border-top: 1px solid var(--sys-color-divider);\n    text-wrap: balance;\n    text-align: center;\n\n    p {\n      margin: 0;\n      padding: 0;\n    }\n  }\n}\n", sa = /* @__PURE__ */ e({
	DEFAULT_VIEW: () => ua,
	ExploreWidget: () => da
}), ca = {
	Explore: "Explore AI assistance",
	learnAbout: "Learn about AI in DevTools"
}, la = a, ua = (e, t, n) => {
	function r(e) {
		return p`Open
     <button
       class="link"
       role="link"
       jslog=${Xe(e.jslogContext).track({ click: !0 })}
       @click=${e.onClick}
     >${e.panelName}</button>
     ${e.text}`;
	}
	f(p`
      <style>
        ${oa}
      </style>
      <div class="ai-assistance-explore-container">
        <div class="header">
          <div class="icon">
            <devtools-icon name="smart-assistant"></devtools-icon>
          </div>
          <h1>${la(ca.Explore)}</h1>
          <p>
            To chat about an item, right-click and select${" "}
            <strong>Ask AI</strong>.
            <button
              class="link"
              role="link"
              jslog=${Xe("open-ai-settings").track({ click: !0 })}
              @click=${() => {
		x.instance().showView("chrome-ai");
	}}
            >${la(ca.learnAbout)}
            </button>
          </p>
        </div>
        <div class="content">
          ${e.featureCards.map((e) => p`
              <div class="feature-card">
                <div class="feature-card-icon">
                  <devtools-icon name=${e.icon}></devtools-icon>
                </div>
                <div class="feature-card-content">
                  <h3>${e.heading}</h3>
                  <p>${r(e)}</p>
                </div>
              </div>
            `)}
        </div>
      </div>
    `, n);
}, da = class extends Be {
	#e;
	constructor(e, t = ua) {
		super(e), this.#e = t;
	}
	wasShown() {
		super.wasShown(), this.requestUpdate();
	}
	performUpdate() {
		let e = w, t = [];
		e.devToolsFreestyler?.enabled && x.instance().hasView("elements") && t.push({
			icon: "brush-2",
			heading: "CSS styles",
			jslogContext: "open-elements-panel",
			onClick: () => {
				x.instance().showView("elements");
			},
			panelName: "Elements",
			text: "to ask about CSS styles"
		}), e.devToolsAiAssistanceNetworkAgent?.enabled && x.instance().hasView("network") && t.push({
			icon: "arrow-up-down",
			heading: "Network",
			jslogContext: "open-network-panel",
			onClick: () => {
				x.instance().showView("network");
			},
			panelName: "Network",
			text: "to ask about a request's details"
		}), e.devToolsAiAssistanceFileAgent?.enabled && x.instance().hasView("sources") && t.push({
			icon: "document",
			heading: "Files",
			jslogContext: "open-sources-panel",
			onClick: () => {
				x.instance().showView("sources");
			},
			panelName: "Sources",
			text: "to ask about a file's content"
		}), e.devToolsAiAssistancePerformanceAgent?.enabled && x.instance().hasView("timeline") && t.push({
			icon: "performance",
			heading: "Performance",
			jslogContext: "open-performance-panel",
			onClick: () => {
				x.instance().showView("timeline");
			},
			panelName: "Performance",
			text: "to ask about a trace item"
		}), this.#e({ featureCards: t }, {}, this.contentElement);
	}
}, fa = "/*\n * Copyright 2026 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n@scope to (devtools-widget > *) {\n  :scope {\n    width: 100%;\n    box-shadow: none;\n    padding: var(--sys-size-8);\n    background-color: var(--sys-color-surface);\n    border-radius: var(--sys-shape-corner-medium);\n  }\n\n  .opt-in-change-dialog {\n    width: var(--sys-size-33);\n    max-width: 100%;\n  }\n\n  header {\n    display: flex;\n    flex-direction: row;\n    align-items: center;\n    gap: var(--sys-size-8);\n    margin-bottom: var(--sys-size-8);\n\n    h1 {\n      margin: 0;\n      color: var(--sys-color-on-surface);\n      font: var(--sys-typescale-headline5);\n    }\n\n    .header-icon-container {\n      background: linear-gradient(\n        135deg,\n        var(--sys-color-gradient-primary),\n        var(--sys-color-gradient-tertiary)\n      );\n      border-radius: var(--sys-size-4);\n      height: var(--sys-size-14);\n      width: var(--sys-size-14);\n      display: flex;\n      align-items: center;\n      justify-content: center;\n\n      devtools-icon {\n        width: var(--sys-size-9);\n        height: var(--sys-size-9);\n      }\n    }\n  }\n\n  main {\n    background-color: var(--sys-color-surface4);\n    border-radius: var(--sys-shape-corner-medium-small);\n    padding: var(--sys-size-8);\n    display: flex;\n    flex-direction: column;\n    gap: var(--sys-size-6);\n    margin-bottom: var(--sys-size-8);\n\n    .item {\n      display: flex;\n      flex-direction: row;\n      align-items: center;\n      gap: var(--sys-size-8);\n\n      devtools-icon {\n        width: var(--sys-size-8);\n        height: var(--sys-size-8);\n        flex-shrink: 0;\n        color: var(--sys-color-on-surface-subtle);\n      }\n\n      .text {\n        font: var(--sys-typescale-body4);\n        color: var(--sys-color-on-surface);\n      }\n    }\n  }\n\n  footer {\n    display: flex;\n    flex-direction: row;\n    align-items: center;\n    justify-content: flex-end;\n\n    .right-buttons {\n      display: flex;\n      gap: var(--sys-size-5);\n    }\n  }\n}\n", pa = /* @__PURE__ */ e({
	DEFAULT_VIEW: () => _a,
	OptInChangeDialog: () => va
}), { html: ma, render: ha } = ue, K = {
	title: "AI assistance just got better",
	integrationPoint: "AI assistance is now integrated with Application and Lighthouse panels, and pulls context from data sources simultaneously",
	widgetPoint: "Use widgets to verify results or jump to source data for select debugging cases",
	privacyDisclaimer: "Chat messages, data accessible for this site via DevTools panels and Web APIs, and items you select such as network requests, files, and performance traces are sent to Google and may be seen by human reviewers to improve this feature. This is an experimental AI feature and won’t always get it right.",
	privacyDisclaimerEnterpriseNoLogging: "Chat messages, data accessible for this site via DevTools panels and Web APIs, and items you select such as network requests, files, and performance traces are sent to Google. The content submitted to and generated by this feature will not be used to improve Google’s AI models. This is an experimental AI feature and won’t always get it right.",
	manageSettings: "Manage in settings",
	gotIt: "Got it"
}, ga = i("panels/ai_assistance/components/OptInChangeDialog.ts", K), q = n.bind(void 0, ga), _a = (e, t, n) => {
	let r = e.loggingEnabled ? q(K.privacyDisclaimer) : q(K.privacyDisclaimerEnterpriseNoLogging);
	ha(ma`
    <style>${fa}</style>
    <div class="opt-in-change-dialog" jslog=${Pe("ai-v2-opt-in-change-dialog")}>
      <header>
        <div class="header-icon-container">
          <devtools-icon name="smart-assistant" role="presentation"></devtools-icon>
        </div>
        <h1 tabindex="-1">
          ${q(K.title)}
        </h1>
      </header>
      <main>
        <div class="item">
          <devtools-icon name="lightbulb-spark" role="presentation"></devtools-icon>
          <div class="text">${q(K.integrationPoint)}</div>
        </div>
        <div class="item">
          <devtools-icon name="flowsheet" role="presentation"></devtools-icon>
          <div class="text">${q(K.widgetPoint)}</div>
        </div>
        <div class="item">
          <devtools-icon name="google" role="presentation"></devtools-icon>
          <div class="text">${r}</div>
        </div>
      </main>
      <footer>
        <div class="right-buttons">
          <devtools-button
            @click=${e.onManageSettings}
            .jslogContext=${"ai-assistance-v2-opt-in.manage-settings"}
            .variant=${d.OUTLINED}
            .accessibleLabel=${q(K.manageSettings)}
          >
            ${q(K.manageSettings)}
          </devtools-button>
          <devtools-button
            @click=${e.onGotIt}
            .jslogContext=${"ai-assistance-v2-opt-in.got-it"}
            .variant=${d.PRIMARY}
            .accessibleLabel=${q(K.gotIt)}
          >
            ${q(K.gotIt)}
          </devtools-button>
        </div>
      </footer>
    </div>
  `, n);
}, va = class e extends ke {
	#e;
	#t;
	#n;
	constructor(e, t = _a) {
		super(), this.#t = e.onGotIt, this.#n = e.onManageSettings, this.#e = t, this.requestUpdate();
	}
	performUpdate() {
		let e = w.aidaAvailability?.enterprisePolicyValue !== Ze.ALLOW_WITHOUT_LOGGING, t = {
			onGotIt: this.#t,
			onManageSettings: this.#n,
			loggingEnabled: e
		};
		this.#e(t, void 0, this.contentElement);
	}
	focusTitle() {
		this.contentElement.querySelector("h1")?.focus();
	}
	static show(t) {
		let n = new ie();
		n.setAriaLabel(q(K.title)), n.setOutsideClickCallback((e) => e.consume(!0)), n.setCloseOnEscape(!1), n.setSizeBehavior(ae.MEASURE_CONTENT), n.setDimmed(!0);
		let r = new e({
			onGotIt: () => {
				n.hide(), t.onGotIt();
			},
			onManageSettings: () => {
				n.hide(), t.onManageSettings();
			}
		});
		r.show(n.contentElement), r.updateComplete.then(() => {
			n.show(), r.focusTitle();
		});
	}
}, { html: ya } = ce, { until: ba } = xe, xa = class extends qn {
	mainFrameId;
	lookupEvent;
	constructor(e = "", t = () => null) {
		super(), this.mainFrameId = e, this.lookupEvent = t;
	}
	templateForToken(e) {
		if (e.type === "link" && e.href.startsWith("#")) {
			if (e.href.startsWith("#node-")) {
				let t = Number(e.href.replace("#node-", ""));
				return ya`<span>${ba(this.#e(t, e.text).then((t) => t || e.text), e.text)}</span>`;
			}
			let n = this.lookupEvent(e.href.slice(1));
			if (!n) return ya`${e.text}`;
			let r = e.text, i = "";
			return Yt(n) ? i = n.args.data.url : r += ` (${n.name})`, ya`<a href="#" draggable=false .title=${i} @click=${(e) => {
				e.stopPropagation(), t(new He(n));
			}}>${r}</a>`;
		}
		return super.templateForToken(e);
	}
	async #e(e, t) {
		if (e === void 0) return;
		let n = b.instance().primaryPageTarget()?.model(_);
		if (!n) return;
		let r = (await n.pushNodesByBackendIdsToFrontend(/* @__PURE__ */ new Set([e])))?.get(e);
		if (r && r.frameId() === this.mainFrameId) return vt.instance().linkify(r, { textContent: t });
	}
}, { html: J } = ce, { until: Sa } = xe, Ca = class e extends qn {
	mainFrameId;
	constructor(e = "") {
		super(), this.mainFrameId = e;
	}
	#e(t) {
		if (!Array.isArray(t) || t.length === 0 || typeof t[0] != "object" || t[0] === null) return null;
		let n = Object.keys(t[0]);
		if (![
			"Problem",
			"Element",
			"NodeId",
			"Details"
		].every((e) => n.includes(e))) return null;
		let r = n.indexOf("Problem");
		if (r > -1) {
			let e = n.splice(r, 1);
			n.unshift(...e);
		}
		return J`
      <table style="width: 100%;">
        <thead>
          <tr>
            ${n.map((e) => J`<th style="text-align: left;">${e === "NodeId" ? "" : e}</th>`)}
          </tr>
        </thead>
        <tbody>
          ${t.flatMap((t) => J`
            <tr>
              ${n.map((e) => e === "NodeId" ? J`<td>${this.#n(t[e])}</td>` : e === "Details" ? J`<td><a href="#" @click=${this.#t}>Details</a></td>` : J`<td>${t[e]}</td>`)}
            </tr>
            <tr class="details-row" style="display: none;">
              <td colspan=${n.length} style="background-color: #f0f0f0; padding: 1em;">
                <devtools-markdown-view .data=${{
			tokens: Qt(t.Details),
			renderer: new e(this.mainFrameId)
		}}></devtools-markdown-view>
              </td>
            </tr>
          `)}
        </tbody>
      </table>
      <br><div>To investigate these problems, please click one of the provided links (above), to set as context, and ask me further questions about the problem.</div>
    `;
	}
	templateForToken(e) {
		if (e.type === "code") try {
			let t = JSON.parse(e.text), n = this.#e(t);
			if (n) return n;
		} catch {}
		if (e.type === "link" && e.href.startsWith("#")) {
			let t;
			if (e.href.startsWith("#node-") ? t = Number(e.href.replace("#node-", "")) : e.href.startsWith("#") && (t = Number(e.href.replace("#", ""))), t) return J`<span>${Sa(this.#i(t, e.text).then((t) => t || e.text), e.text)}</span>`;
		}
		return super.templateForToken(e);
	}
	#t(e) {
		e.preventDefault();
		let t = e.target, n = t.closest("tr");
		if (!n) return;
		let r = n.nextElementSibling;
		r?.classList.contains("details-row") && (r.style.display === "none" ? (r.style.display = "table-row", t.textContent = "Hide") : (r.style.display = "none", t.textContent = "Details"));
	}
	#n(e) {
		if (e.indexOf(",") === -1) {
			let t = Number(e);
			return isNaN(t) ? J`${e}` : this.#r(t);
		}
		return J`${e.split(",").map((e) => e.trim()).filter(Boolean).map((e) => {
			let t = Number(e);
			return isNaN(t) ? J`<div>${e}</div>` : J`<div>${this.#r(t)}</div>`;
		})}`;
	}
	#r(e) {
		let t = "link";
		return J`<span>${Sa(this.#i(e, t).then((e) => e || t), t)}</span>`;
	}
	async #i(e, t) {
		if (e === void 0) return;
		let n = b.instance().primaryPageTarget()?.model(_);
		if (!n) return;
		let r = (await n.pushNodesByBackendIdsToFrontend(/* @__PURE__ */ new Set([e])))?.get(e);
		if (r && r.frameId() === this.mainFrameId) return vt.instance().linkify(r, { textContent: t });
	}
}, wa = /* @__PURE__ */ e({ saveToDisk: () => Ta });
async function Ta(e) {
	let t = e.getConversationMarkdown(), n = new $e(t, !1, "text/markdown"), r = et(e.title || "") || "conversation";
	r.length > 52 && (r = r.substring(0, 52));
	let i = `devtools_${r}.md`;
	await rt.instance().save(i, n, !0), rt.instance().close(i);
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/ai_assistance/AiAssistancePanel.ts
var { html: Y } = ue, { widget: Ea } = Me, Da = "https://crbug.com/364805393", Oa = "https://developer.chrome.com/docs/devtools/ai-assistance", ka = 700, Aa = 400, X = {
	newChat: "New chat",
	help: "Help",
	settings: "Settings",
	sendFeedback: "Send feedback",
	newChatCreated: "New chat created",
	chatDeleted: "Chat deleted",
	history: "History",
	deleteChat: "Delete local chat",
	clearChatHistory: "Clear local chats",
	exportConversation: "Export conversation",
	noPastConversations: "No past conversations",
	followTheSteps: "Follow the steps above to ask a question",
	inputDisclaimerForEmptyState: "This is an experimental AI feature and won't always get it right.",
	responseCopiedToClipboard: "Response copied to clipboard"
}, Z = {
	answerLoading: "Answer loading",
	answerReady: "Answer ready",
	analyzingData: "Analyzing data",
	crossOriginError: "To talk about data from another origin, start a new chat",
	inputPlaceholderForStyling: "Ask a question about the selected element",
	inputPlaceholderForNetwork: "Ask a question about the selected network request",
	inputPlaceholderForFile: "Ask a question about the selected file",
	inputPlaceholderForPerformanceWithNoRecording: "Record a performance trace and select an item to ask a question",
	inputPlaceholderForStylingNoContext: "Select an element to ask a question",
	inputPlaceholderForNetworkNoContext: "Select a network request to ask a question",
	inputPlaceholderForFileNoContext: "Select a file to ask a question",
	inputPlaceholderForPerformanceTrace: "Ask a question about the selected performance trace",
	inputPlaceholderForPerformanceTraceNoContext: "Record or select a performance trace to ask a question",
	inputPlaceholderForNoContext: "Ask AI Assistance",
	inputPlaceholderForNoContextBranded: "Ask Gemini",
	inputDisclaimerForStyling: "Chat messages and any data the inspected page can access via Web APIs are sent to Google and may be seen by human reviewers to improve this feature. This is an experimental AI feature and won’t always get it right.",
	inputDisclaimerForStylingEnterpriseNoLogging: "Chat messages and any data the inspected page can access via Web APIs are sent to Google. The content you submit and that is generated by this feature will not be used to improve Google’s AI models. This is an experimental AI feature and won’t always get it right.",
	inputDisclaimerForNetwork: "Chat messages and the selected network request are sent to Google and may be seen by human reviewers to improve this feature. This is an experimental AI feature and won’t always get it right.",
	inputDisclaimerForNetworkEnterpriseNoLogging: "Chat messages and the selected network request are sent to Google. The content you submit and that is generated by this feature will not be used to improve Google’s AI models. This is an experimental AI feature and won’t always get it right.",
	inputDisclaimerForFile: "Chat messages and the selected file are sent to Google and may be seen by human reviewers to improve this feature. This is an experimental AI feature and won't always get it right.",
	inputDisclaimerForFileEnterpriseNoLogging: "Chat messages and the selected file are sent to Google. The content you submit and that is generated by this feature will not be used to improve Google’s AI models. This is an experimental AI feature and won’t always get it right.",
	inputDisclaimerForPerformance: "Chat messages and trace data from your performance trace are sent to Google and may be seen by human reviewers to improve this feature. This is an experimental AI feature and won't always get it right.",
	inputDisclaimerForPerformanceEnterpriseNoLogging: "Chat messages and data from your performance trace are sent to Google. The content you submit and that is generated by this feature will not be used to improve Google’s AI models. This is an experimental AI feature and won’t always get it right.",
	inputDisclaimerForNoContext: "Chat messages, any data the inspected page can see using Web APIs, and the items you select such as files, network requests, and performance traces are sent to Google and may be seen by human reviewers to improve this feature. This is an experimental AI feature and won’t always get it right.",
	inputDisclaimerForNoContextEnterpriseNoLogging: "Chat messages, any data the inspected page can see using Web APIs, and the items you select such as files, network requests, and performance traces are sent to Google. This data will not be used to improve Google’s AI models. This is an experimental AI feature and won’t always get it right.",
	inputPlaceholderForAccessibility: "Ask a question about the selected Lighthouse report",
	inputPlaceholderForAccessibilityNoContext: "Generate a Lighthouse report to ask a question",
	inputDisclaimerForAccessibility: "Chat messages and the selected Lighthouse report are sent to Google and may be seen by human reviewers to improve this feature. This is an experimental AI feature and won’t always get it right.",
	inputDisclaimerForAccessibilityEnterpriseNoLogging: "Chat messages and the selected Lighthouse report are sent to Google. The content you submit and that is generated by this feature will not be used to improve Google’s AI models. This is an experimental AI feature and won’t always get it right.",
	inputDisclaimerV2: "Chat messages, data accessible for this site via DevTools panels and Web APIs, and items you select such as network requests, files, and performance traces are sent to Google and may be seen by human reviewers to improve this feature. This is an experimental AI feature and won’t always get it right.",
	inputDisclaimerEnterpriseNoLoggingV2: "Chat messages, data accessible for this site via DevTools panels and Web APIs, and items you select such as network requests, files, and performance traces are sent to Google. The content submitted to and generated by this feature will not be used to improve Google’s AI models. This is an experimental AI feature and won’t always get it right."
}, ja = i("panels/ai_assistance/AiAssistancePanel.ts", X), Q = n.bind(void 0, ja), $ = a;
function Ma(e) {
	return e && (Ge.instance().isEnabled("emulationCapabilities") || e.nodeType() === Node.ELEMENT_NODE) ? e : null;
}
async function Na(e) {
	let t = e?.selectedContext;
	if (t) {
		let e = await t.getSuggestions();
		if (e) return e;
	}
	if (!e?.type || e.isReadOnly) return [];
	switch (e.type) {
		case O.STYLING: return [
			{
				title: "What can you help me with?",
				jslogContext: "styling-default"
			},
			{
				title: "Why isn’t this element visible?",
				jslogContext: "styling-default"
			},
			{
				title: Ge.instance().isEnabled("emulationCapabilities") ? "Are there display issues on this page for people using an Android phone?" : "How do I center this element?",
				jslogContext: "styling-default"
			}
		];
		case O.FILE: return [
			{
				title: "What does this script do?",
				jslogContext: "file-default"
			},
			{
				title: "Is the script optimized for performance?",
				jslogContext: "file-default"
			},
			{
				title: "Does the script handle user input safely?",
				jslogContext: "file-default"
			}
		];
		case O.ACCESSIBILITY: return [{
			title: "How can I fix accessibility issues on my page?",
			jslogContext: "accessibility-default"
		}, {
			title: "What accessibility issues exist on my page?",
			jslogContext: "accessibility-default"
		}];
		case O.NETWORK: return [
			{
				title: "Why is this network request taking so long?",
				jslogContext: "network-default"
			},
			{
				title: "Are there any security headers present?",
				jslogContext: "network-default"
			},
			{
				title: "Why is the request failing?",
				jslogContext: "network-default"
			}
		];
		case O.PERFORMANCE: return [{
			title: "What performance issues exist with my page?",
			jslogContext: "performance-default"
		}];
		case O.NONE: return [
			{
				title: "What can you help me with?",
				jslogContext: "empty"
			},
			{
				title: "What performance issues exist on the page?",
				jslogContext: "empty"
			},
			{
				title: "What are the slowest network requests on this page?",
				jslogContext: "empty"
			}
		];
		case O.STORAGE: return [{
			title: "How is localStorage used on this page?",
			jslogContext: "storage-default"
		}, {
			title: "How is sessionStorage used on this page?",
			jslogContext: "storage-default"
		}];
		default: nt(e.type, "Unknown conversation type");
	}
}
function Pa(e) {
	let t = e?.selectedContext;
	if (t instanceof Lt) {
		if (!t.external) {
			let e = t.getItem();
			return new xa(e.parsedTrace.data.Meta.mainFrameId, e.lookupEvent.bind(e));
		}
	} else if (e?.type === O.PERFORMANCE) return new xa();
	else if (Ge.instance().isEnabled("emulationCapabilities") && e?.type === O.STYLING && b.instance().primaryPageTarget()?.model(_)) {
		let e = ((b.instance().primaryPageTarget()?.model(_))?.target().model(ge))?.mainFrame?.id;
		return new Ca(e);
	} else if (e?.type === O.ACCESSIBILITY) {
		let e = (b.instance().primaryPageTarget()?.model(_))?.existingDocument()?.documentURL;
		return new Xn(e);
	}
	return new qn();
}
var Fa = /* @__PURE__ */ function(e) {
	return e.DISABLED_VIEW = "disabled-view", e.CHAT_VIEW = "chat-view", e.EXPLORE_VIEW = "explore-view", e;
}({});
function Ia(e) {
	let t = !!w.devToolsAiAssistanceV2?.enabled;
	return Y`
    <div class="toolbar-container" role="toolbar" jslog=${Le()}>
      <devtools-toolbar class="freestyler-left-toolbar" role="presentation">
      ${e.showChatActions ? Y`<devtools-button
          title=${Q(X.newChat)}
          aria-label=${Q(X.newChat)}
          .iconName=${"plus"}
          .jslogContext=${"freestyler.new-chat"}
          .variant=${d.TOOLBAR}
          @click=${e.onNewChatClick}></devtools-button>
        <div class="toolbar-divider"></div>
        <devtools-menu-button
          title=${Q(X.history)}
          aria-label=${Q(X.history)}
          .iconName=${"history"}
          .jslogContext=${"freestyler.history"}
          .populateMenuCall=${e.populateHistoryMenu}
        ></devtools-menu-button>` : g}
        ${e.showActiveConversationActions ? Y`
          <devtools-button
              title=${Q(X.deleteChat)}
              aria-label=${Q(X.deleteChat)}
              .iconName=${"bin"}
              .jslogContext=${"freestyler.delete"}
              .variant=${d.TOOLBAR}
              @click=${e.onDeleteClick}>
          </devtools-button>
          ${t ? g : Y`
            <devtools-button
              title=${Q(X.exportConversation)}
              aria-label=${Q(X.exportConversation)}
              .iconName=${"download"}
              .disabled=${e.isLoading}
              .jslogContext=${"export-ai-conversation"}
              .variant=${d.TOOLBAR}
              @click=${e.onExportConversationClick}>
            </devtools-button>
            `}` : g}
      </devtools-toolbar>
      <devtools-toolbar class="freestyler-right-toolbar" role="presentation">
        <devtools-link
          class="toolbar-feedback-link"
          title=${Q(X.sendFeedback)}
          href=${Da}
          jslogcontext=${"freestyler.send-feedback"}
        >${Q(X.sendFeedback)}</devtools-link>
        <div class="toolbar-divider"></div>
        <devtools-button
          title=${Q(X.help)}
          aria-label=${Q(X.help)}
          .iconName=${"help"}
          .jslogContext=${"freestyler.help"}
          .variant=${d.TOOLBAR}
          @click=${e.onHelpClick}></devtools-button>
        <devtools-button
          title=${Q(X.settings)}
          aria-label=${Q(X.settings)}
          .iconName=${"gear"}
          .jslogContext=${"freestyler.settings"}
          .variant=${d.TOOLBAR}
          @click=${e.onSettingsClick}></devtools-button>
      </devtools-toolbar>
    </div>
  `;
}
function La(e, t, n) {
	function r() {
		switch (e.state) {
			case "chat-view": return Y`<devtools-ai-chat-view
          .props=${e.props}
          ${we((e) => {
				e && e instanceof Zi && (t.chatView = e);
			})}
        ></devtools-ai-chat-view>`;
			case "explore-view": return Y`<devtools-widget class="fill-panel" ${Ea(da)}>
                    </devtools-widget>`;
			case "disabled-view": return Y`<devtools-widget class="fill-panel" ${Ea(aa, e.props)}>
                    </devtools-widget>`;
		}
	}
	if (w.devToolsAiAssistanceV2?.enabled) {
		let t = e.state === "chat-view" && e.props.walkthrough.isExpanded, i = !1;
		if (e.state === "chat-view") {
			let t = e.props.messages.at(-1);
			t && e.props.walkthrough.activeSidebarMessage?.id === t.id && (i = !0);
		}
		f(Y`
      ${Ia(e)}
      <div class="ai-assistance-view-container">
        <devtools-split-view
          name="ai-assistance-split-view-state"
          direction="column"
          sidebar-position="second"
          sidebar-visibility=${t && !e.props.walkthrough.isInlined ? "visible" : "hidden"}
          sidebar-initial-size=${Aa}
        >
          <div slot="main" class="main-view">
            ${r()}
          </div>
          ${t ? Y`
            <devtools-widget slot="sidebar" ${Ea(hr, {
			message: e.props.walkthrough.activeSidebarMessage,
			isLoading: e.props.isLoading && i,
			markdownRenderer: e.props.markdownRenderer,
			onToggle: e.props.walkthrough.onToggle
		})}></devtools-widget>` : g}
        </devtools-split-view>
      </div>
    `, n);
	} else f(Y`
      ${Ia(e)}
      <div class="ai-assistance-view-container">${r()}</div>
    `, n);
}
function Ra(e) {
	return e ? new gt(e) : null;
}
function za(e) {
	return e ? new Ot(e) : null;
}
function Ba(e) {
	return e ? new ut(e.report) : null;
}
function Va(e) {
	if (!e) return null;
	let t = cn.instance().networkLogView.timeCalculator();
	return new lt(e, t);
}
function Ha(e) {
	return e ? new Lt(e) : null;
}
function Ua(e) {
	return e ? new Ct(e) : null;
}
var Wa, Ga = class e extends me {
	view;
	static panelName = "freestyler";
	#e;
	#t;
	#n;
	#r = {};
	#i = Za();
	#a;
	#o = new mt();
	#s = new at();
	#c;
	#l = null;
	#u = null;
	#d = null;
	#f = null;
	#p = null;
	#m = null;
	#h = [];
	#g = !1;
	#_;
	#v = null;
	#y = new AbortController();
	#b = {
		isInlined: !1,
		isExpanded: !1,
		activeSidebarMessage: null,
		inlineExpandedMessages: []
	};
	constructor(t = La, { aidaClient: n, aidaAvailability: r }) {
		super(e.panelName), this.view = t, this.registerRequiredCSS(Gn), this.#a = this.#E(), this.#t = n, this.#_ = r, Re.instance().hasAction("elements.toggle-element-search") && (this.#e = Re.instance().getAction("elements.toggle-element-search")), kt.instance().addEventListener(xt.HISTORY_DELETED, this.#ee, this);
	}
	#x() {
		return {
			isLoading: this.#g,
			showChatActions: this.#G(),
			showActiveConversationActions: !!(this.#c && !this.#c.isEmpty),
			onNewChatClick: this.#ae.bind(this),
			populateHistoryMenu: this.#$.bind(this),
			onDeleteClick: this.#ne.bind(this),
			onExportConversationClick: this.#re.bind(this),
			onHelpClick: () => {
				te(Oa);
			},
			onSettingsClick: () => {
				x.instance().showView("chrome-ai");
			}
		};
	}
	async #S() {
		let e = w.aidaAvailability?.blockedByAge === !0;
		if (this.#_ !== u.AVAILABLE || !this.#a?.getIfNotDisabled() || e) return {
			state: "disabled-view",
			props: { aidaAvailability: this.#_ }
		};
		if (this.#c) {
			let e = await Na(this.#c), t = Pa(this.#c), n = null;
			return Xa() && this.#se(this.#A()) && (n = this.#Z.bind(this)), {
				state: "chat-view",
				props: {
					blockedByCrossOrigin: this.#c.isBlockedByOrigin,
					isLoading: this.#g,
					messages: this.#h,
					context: this.#c.selectedContext ?? this.#se(this.#A()),
					isContextSelected: !!this.#c.selectedContext,
					conversationType: this.#c.type,
					isReadOnly: this.#c.isReadOnly ?? !1,
					changeSummary: this.#V(),
					inspectElementToggled: this.#e?.toggled() ?? !1,
					canShowFeedbackForm: this.#i,
					multimodalInputEnabled: Ya() && this.#c.type === O.STYLING,
					isTextInputDisabled: this.#W(),
					emptyStateSuggestions: e,
					inputPlaceholder: this.#K(),
					disclaimerText: this.#q(),
					onExportConversation: this.#re.bind(this),
					changeManager: this.#o,
					uploadImageInputEnabled: Ja() && this.#c.type === O.STYLING,
					markdownRenderer: t,
					conversationMarkdown: this.#c.getConversationMarkdown(),
					generateConversationSummary: async (e) => (this.#n ||= new Et({
						aidaClient: this.#t,
						serverSideLoggingEnabled: this.#i
					}), await this.#n.summarizeConversation(e)),
					onTextSubmit: async (e, t, n) => {
						let r = () => {
							y.actionTaken(C.AiAssistanceQuerySubmitted), this.#ue(e, t, n);
						}, i = w.devToolsAiAssistanceV2?.enabled, a = s.instance().moduleSetting("ai-assistance-v2-opt-in-change-dialog-seen");
						if (i && !a.get()) {
							va.show({
								onGotIt: () => {
									a.set(!0), r();
								},
								onManageSettings: () => {
									a.set(!0), this.#r.chatView?.setInputValue(e), x.instance().showView("chrome-ai");
								}
							});
							return;
						}
						r();
					},
					onInspectElementClick: this.#U.bind(this),
					onFeedbackSubmit: this.#J.bind(this),
					onCancelClick: this.#oe.bind(this),
					onContextClick: this.#Y.bind(this),
					onNewConversation: this.#ae.bind(this),
					onCopyResponseClick: this.#H.bind(this),
					onContextRemoved: Xa() ? this.#X.bind(this) : null,
					onContextAdd: n,
					walkthrough: {
						onToggle: this.#T.bind(this),
						onOpen: this.#w.bind(this),
						isExpanded: this.#b.isExpanded,
						isInlined: this.#b.isInlined,
						activeSidebarMessage: this.#b.activeSidebarMessage,
						inlineExpandedMessages: this.#b.inlineExpandedMessages
					}
				}
			};
		}
		return { state: "explore-view" };
	}
	onResize() {
		super.onResize(), w.devToolsAiAssistanceV2?.enabled && this.#C();
	}
	#C() {
		let e = this.contentElement.offsetWidth < ka;
		if (e !== this.#b.isInlined) {
			if (this.#b.isInlined = e, !this.#b.isExpanded) {
				this.#b.activeSidebarMessage = null, this.#b.inlineExpandedMessages = [], this.requestUpdate();
				return;
			}
			e ? this.#b.inlineExpandedMessages = this.#b.activeSidebarMessage ? [this.#b.activeSidebarMessage] : [] : this.#b.activeSidebarMessage = this.#b.inlineExpandedMessages.at(-1) ?? null, this.requestUpdate();
		}
	}
	#w(e) {
		this.#b.inlineExpandedMessages.some((t) => t.id === e.id) || this.#b.inlineExpandedMessages.push(e), this.#b.activeSidebarMessage = e, this.#b.isExpanded = !0, this.requestUpdate();
	}
	#T(e, t) {
		if (e) {
			this.#w(t);
			return;
		}
		this.#b.inlineExpandedMessages = this.#b.inlineExpandedMessages.filter((e) => e.id !== t.id), this.#b.isInlined ? (this.#b.isExpanded = this.#b.inlineExpandedMessages.length > 0, this.#b.activeSidebarMessage?.id === t.id && (this.#b.activeSidebarMessage = this.#b.inlineExpandedMessages.at(-1) ?? null)) : (this.#b.isExpanded = !1, this.#b.activeSidebarMessage = null), this.requestUpdate();
	}
	#E() {
		try {
			return c("ai-assistance-enabled");
		} catch {
			return;
		}
	}
	static async instance(t = { forceNew: null }) {
		let { forceNew: n } = t;
		if (!Wa || n) {
			let t = new ye(), n = await ye.checkAccessPreconditions();
			Wa = new e(La, {
				aidaClient: t,
				aidaAvailability: n
			});
		}
		return Wa;
	}
	#D() {
		let e = v.instance().flavor(mn);
		e !== this.#v && (this.#v?.removeEventListener(bn.IS_VIEWING_TRACE, this.requestUpdate, this), this.#v = e, this.#v && this.#v.addEventListener(bn.IS_VIEWING_TRACE, this.requestUpdate, this));
	}
	async #O() {
		return await mn.executeRecordAndReload();
	}
	async #k(e) {
		return await on.executeLighthouseRecording({
			isAIControlled: !0,
			...e
		});
	}
	#A() {
		let { hostConfig: e } = Qe, t = x.instance(), n = t.isViewVisible("elements"), r = t.isViewVisible("network"), i = t.isViewVisible("sources"), a = t.isViewVisible("timeline"), o = t.isViewVisible("lighthouse"), s = t.isViewVisible("resources"), c;
		return n && e.devToolsFreestyler?.enabled ? c = O.STYLING : r && e.devToolsAiAssistanceNetworkAgent?.enabled ? c = O.NETWORK : i && e.devToolsAiAssistanceFileAgent?.enabled ? c = O.FILE : a && e.devToolsAiAssistancePerformanceAgent?.enabled ? c = O.PERFORMANCE : o && e.devToolsAiAssistanceAccessibilityAgent?.enabled ? c = O.ACCESSIBILITY : s && e.devToolsAiAssistanceStorageAgent?.enabled && (c = O.STORAGE), Xa() && !c ? O.NONE : c;
	}
	#j() {
		if (this.#g) {
			this.requestUpdate();
			return;
		}
		if (this.#c && !this.#c.isEmpty) {
			this.requestUpdate();
			return;
		}
		let e = this.#A();
		if (this.#c?.type === e) {
			this.requestUpdate();
			return;
		}
		let t = e ? new Ft({
			type: e,
			data: [],
			isReadOnly: !1,
			aidaClient: this.#t,
			changeManager: this.#o,
			isExternal: !1,
			performanceRecordAndReload: this.#O.bind(this),
			onInspectElement: this.#le.bind(this),
			networkTimeCalculator: cn.instance().networkLogView.timeCalculator(),
			lighthouseRecording: this.#k.bind(this)
		}) : void 0;
		this.#M(t);
	}
	#M(e) {
		if (this.#c !== e) {
			if (this.#oe(), this.#h = [], this.#g = !1, this.#c?.archiveConversation(), !e) {
				let t = this.#A();
				t && (e = new Ft({
					type: t,
					data: [],
					isReadOnly: !1,
					aidaClient: this.#t,
					changeManager: this.#o,
					isExternal: !1,
					performanceRecordAndReload: this.#O.bind(this),
					onInspectElement: this.#le.bind(this),
					networkTimeCalculator: cn.instance().networkLogView.timeCalculator(),
					lighthouseRecording: this.#k.bind(this)
				}));
			}
			this.#c = e;
		}
		if (this.#c) {
			if (this.#c.isEmpty && Xa()) {
				let e = this.#se(this.#A());
				this.#c.setContext(e);
			} else {
				let e = this.#se(this.#c.type);
				(e || !Xa()) && this.#c.setContext(e);
			}
		}
		this.requestUpdate();
	}
	wasShown() {
		super.wasShown(), this.#r.chatView?.restoreScrollPosition(), this.#r.chatView?.focusTextInput(), this.#N(), this.#u = Ra(Ma(v.instance().flavor(Ve))), this.#f = Va(v.instance().flavor(de)), this.#d = Ha(v.instance().flavor(zt)), this.#l = za(v.instance().flavor(ot)), this.#p = Ba(v.instance().flavor(sn)), this.#m = Ua(v.instance().flavor(Zt)), this.#M(this.#c), this.#a?.addChangeListener(this.requestUpdate, this), be.instance().addEventListener(_e.AIDA_AVAILABILITY_CHANGED, this.#N), this.#e?.addEventListener(Te.TOGGLED, this.requestUpdate, this), v.instance().addFlavorChangeListener(Ve, this.#P), v.instance().addFlavorChangeListener(de, this.#L), v.instance().addFlavorChangeListener(zt, this.#R), v.instance().addFlavorChangeListener(Zt, this.#F), v.instance().addFlavorChangeListener(ot, this.#z), v.instance().addFlavorChangeListener(sn, this.#B), x.instance().addEventListener(ne.VIEW_VISIBILITY_CHANGED, this.#j, this), b.instance().addModelListener(_, Ue.AttrModified, this.#I, this), b.instance().addModelListener(_, Ue.AttrRemoved, this.#I, this), v.instance().addFlavorChangeListener(mn, this.#D, this), this.#D(), this.#j(), y.actionTaken(C.AiAssistancePanelOpened);
	}
	willHide() {
		super.willHide(), this.#a?.removeChangeListener(this.requestUpdate, this), be.instance().removeEventListener(_e.AIDA_AVAILABILITY_CHANGED, this.#N), this.#e?.removeEventListener(Te.TOGGLED, this.requestUpdate, this), v.instance().removeFlavorChangeListener(Ve, this.#P), v.instance().removeFlavorChangeListener(de, this.#L), v.instance().removeFlavorChangeListener(zt, this.#R), v.instance().removeFlavorChangeListener(Zt, this.#F), v.instance().removeFlavorChangeListener(ot, this.#z), v.instance().removeFlavorChangeListener(sn, this.#B), x.instance().removeEventListener(ne.VIEW_VISIBILITY_CHANGED, this.#j, this), v.instance().removeFlavorChangeListener(mn, this.#D, this), b.instance().removeModelListener(_, Ue.AttrModified, this.#I, this), b.instance().removeModelListener(_, Ue.AttrRemoved, this.#I, this), this.#v &&= (this.#v.removeEventListener(bn.IS_VIEWING_TRACE, this.requestUpdate, this), null);
	}
	#N = async () => {
		let e = await ye.checkAccessPreconditions();
		e !== this.#_ && (this.#_ = e, this.requestUpdate());
	};
	#P = (e) => {
		this.#u?.getItem() !== e.data && (this.#u = Ra(Ma(e.data)), this.#M(this.#c));
	};
	#F = (e) => {
		this.#m?.getItem() !== e.data && (this.#m = Ua(e.data), this.#M(this.#c));
	};
	#I = (e) => {
		this.#u?.getItem() === e.data.node && (e.data.name === "class" || e.data.name === "id") && this.requestUpdate();
	};
	#L = (e) => {
		if (this.#f?.getItem() !== e.data) {
			if (e.data) {
				let t = cn.instance().networkLogView.timeCalculator();
				this.#f = new lt(e.data, t);
			} else this.#f = null;
			this.#M(this.#c);
		}
	};
	#R = (e) => {
		this.#d?.getItem() !== e.data && (this.#d = e.data ? new Lt(e.data) : null, this.#M(this.#c));
	};
	#z = (e) => {
		let t = e.data;
		t && this.#l?.getItem() !== t && (this.#l = new Ot(e.data), this.#M(this.#c));
	};
	#B = (e) => {
		let t = e.data;
		this.#p?.getItem() !== t?.report && (this.#p = Ba(t), this.#M(this.#c));
	};
	#V() {
		if (!hi() || !this.#c || this.#c?.isReadOnly) return;
		let e = !!w.devToolsAiAssistanceV2?.enabled;
		return this.#o.formatChangesForPatching(this.#c.id, !e);
	}
	async performUpdate() {
		let e = {
			...this.#x(),
			...await this.#S()
		};
		this.view(e, this.#r, this.contentElement);
	}
	#H(e) {
		let t = Ka(e);
		t && (Ce.copyText(t), Xt.show({ message: Q(X.responseCopiedToClipboard) }));
	}
	#U() {
		v.instance().setFlavor(Vt, new Vt(this.panelName)), this.#e?.execute();
	}
	#W() {
		return !!(this.#c && this.#c.isBlockedByOrigin || !this.#c || !this.#c.selectedContext && !Xa());
	}
	#G() {
		let e = this.#a?.getIfNotDisabled(), t = w.aidaAvailability?.blockedByAge === !0;
		return !(!e || t || this.#_ === u.NO_ACCOUNT_EMAIL || this.#_ === u.SYNC_IS_PAUSED);
	}
	#K() {
		if (!this.#c) return Q(X.followTheSteps);
		if (this.#c && this.#c.isBlockedByOrigin) return $(Z.crossOriginError);
		switch (this.#c.type) {
			case O.STYLING: return this.#c.selectedContext ? $(Z.inputPlaceholderForStyling) : $(Z.inputPlaceholderForStylingNoContext);
			case O.FILE: return this.#c.selectedContext ? $(Z.inputPlaceholderForFile) : $(Z.inputPlaceholderForFileNoContext);
			case O.NETWORK: return this.#c.selectedContext ? $(Z.inputPlaceholderForNetwork) : $(Z.inputPlaceholderForNetworkNoContext);
			case O.PERFORMANCE: return v.instance().flavor(mn)?.hasActiveTrace() ? this.#c.selectedContext ? $(Z.inputPlaceholderForPerformanceTrace) : $(Z.inputPlaceholderForPerformanceTraceNoContext) : $(Z.inputPlaceholderForPerformanceWithNoRecording);
			case O.ACCESSIBILITY: return this.#c.selectedContext ? $(Z.inputPlaceholderForAccessibility) : $(Z.inputPlaceholderForAccessibilityNoContext);
			case O.STORAGE: return $(Z.inputPlaceholderForNoContext);
			case O.NONE: return ct() ? $(Z.inputPlaceholderForNoContextBranded) : $(Z.inputPlaceholderForNoContext);
		}
	}
	#q() {
		if (!this.#c || this.#c.isReadOnly) return Q(X.inputDisclaimerForEmptyState);
		let e = w.aidaAvailability?.enterprisePolicyValue !== Ze.ALLOW_WITHOUT_LOGGING;
		if (w.devToolsAiAssistanceV2?.enabled) return $(e ? Z.inputDisclaimerV2 : Z.inputDisclaimerEnterpriseNoLoggingV2);
		switch (this.#c.type) {
			case O.STYLING: return $(e ? Z.inputDisclaimerForStyling : Z.inputDisclaimerForStylingEnterpriseNoLogging);
			case O.FILE: return $(e ? Z.inputDisclaimerForFile : Z.inputDisclaimerForFileEnterpriseNoLogging);
			case O.NETWORK: return $(e ? Z.inputDisclaimerForNetwork : Z.inputDisclaimerForNetworkEnterpriseNoLogging);
			case O.PERFORMANCE: return $(e ? Z.inputDisclaimerForPerformance : Z.inputDisclaimerForPerformanceEnterpriseNoLogging);
			case O.ACCESSIBILITY: return $(e ? Z.inputDisclaimerForAccessibility : Z.inputDisclaimerForAccessibilityEnterpriseNoLogging);
			case O.STORAGE:
			case O.NONE: return $(e ? Z.inputDisclaimerForNoContext : Z.inputDisclaimerForNoContextEnterpriseNoLogging);
		}
	}
	#J(e, t, n) {
		this.#t.registerClientEvent({
			corresponding_aida_rpc_global_id: e,
			disable_user_content_logging: !this.#i,
			do_conversation_client_event: { user_feedback: {
				sentiment: t,
				user_input: { comment: n }
			} }
		});
	}
	#Y() {
		if (!this.#c) return;
		let e = this.#c.selectedContext;
		if (e instanceof lt) {
			let n = $t.tab(e.getItem(), en.HEADERS_COMPONENT);
			return t(n);
		}
		if (e instanceof Ot) return t(e.getItem().uiLocation(0, 0));
		if (e instanceof Lt) {
			let n = e.getItem();
			if (n.callTree) {
				let e = n.callTree.selectedNode?.event ?? n.callTree.rootNode.event, r = new He(e);
				return t(r);
			}
			if (n.insight) return t(n.insight);
		}
	}
	#X() {
		this.#c?.setContext(null), this.requestUpdate();
	}
	#Z() {
		this.#c?.setContext(this.#se(this.#A())), this.requestUpdate();
	}
	#Q() {
		let e = !!w.aidaAvailability?.enabled, t = !!w.aidaAvailability?.blockedByAge, n = this.#_ === u.AVAILABLE, r = !!this.#a?.getIfNotDisabled();
		return e && n && r && !t;
	}
	async handleAction(e, t) {
		if (this.#g && !t?.prompt) {
			this.#r.chatView?.focusTextInput();
			return;
		}
		let n;
		switch (e) {
			case "freestyler.elements-floating-button":
				y.actionTaken(C.AiAssistanceOpenedFromElementsPanelFloatingButton), n = O.STYLING;
				break;
			case "freestyler.element-panel-context":
				y.actionTaken(C.AiAssistanceOpenedFromElementsPanel), n = O.STYLING;
				break;
			case "drjones.network-floating-button":
				y.actionTaken(C.AiAssistanceOpenedFromNetworkPanelFloatingButton), n = O.NETWORK;
				break;
			case "drjones.network-panel-context":
				y.actionTaken(C.AiAssistanceOpenedFromNetworkPanel), n = O.NETWORK;
				break;
			case "drjones.performance-panel-context":
				y.actionTaken(C.AiAssistanceOpenedFromPerformancePanelCallTree), n = O.PERFORMANCE;
				break;
			case "drjones.sources-floating-button":
				y.actionTaken(C.AiAssistanceOpenedFromSourcesPanelFloatingButton), n = O.FILE;
				break;
			case "drjones.sources-panel-context": y.actionTaken(C.AiAssistanceOpenedFromSourcesPanel), n = O.FILE;
		}
		if (!n) return;
		let r = this.#c;
		(!this.#c || this.#c.type !== n || this.#c.isEmpty) && (r = new Ft({
			type: n,
			data: [],
			isReadOnly: !1,
			aidaClient: this.#t,
			changeManager: this.#o,
			isExternal: !1,
			performanceRecordAndReload: this.#O.bind(this),
			onInspectElement: this.#le.bind(this),
			networkTimeCalculator: cn.instance().networkLogView.timeCalculator(),
			lighthouseRecording: this.#k.bind(this)
		})), this.#M(r);
		let i = t?.prompt;
		if (i && typeof i == "string") {
			if (!this.#Q()) return;
			y.actionTaken(C.AiAssistanceQuerySubmitted), this.#c && this.#c.isBlockedByOrigin && this.#ae(), await this.#ue(i);
		} else this.#r.chatView?.focusTextInput();
	}
	#$(e) {
		let t = kt.instance().getHistory().map((e) => Ft.fromSerializedConversation(e));
		for (let n of t.reverse()) !n.isEmpty && n.title && e.defaultSection().appendCheckboxItem(n.title, () => {
			this.#ie(n);
		}, {
			checked: this.#c?.id === n.id,
			jslogContext: "freestyler.history-item"
		});
		let n = e.defaultSection().items.length === 0;
		n && e.defaultSection().appendItem(Q(X.noPastConversations), () => {}, { disabled: !0 }), e.footerSection().appendItem(Q(X.clearChatHistory), () => {
			kt.instance().deleteAll();
		}, { disabled: n });
	}
	#ee() {
		this.#M();
	}
	#te() {
		this.#b.isExpanded = !1, this.#b.activeSidebarMessage = null, this.#b.inlineExpandedMessages = [];
	}
	#ne() {
		this.#c && (this.#te(), kt.instance().deleteHistoryEntry(this.#c.id), this.#M(), he.alert(Q(X.chatDeleted)));
	}
	async #re() {
		if (this.#c) return await Ta(this.#c);
	}
	async #ie(e) {
		this.#c?.id !== e.id && (this.#M(e), await this.#de(e.history));
	}
	#ae() {
		this.#M(), this.#te(), he.alert(Q(X.newChatCreated)), Se.annotationsEnabled() && Se.instance().deleteAllAnnotations();
	}
	#oe() {
		this.#y.abort(), this.#y = new AbortController();
	}
	#se(e) {
		switch (e) {
			case O.STYLING: return this.#u;
			case O.FILE: return this.#l;
			case O.NETWORK: return this.#f;
			case O.PERFORMANCE: return this.#d;
			case O.ACCESSIBILITY: return this.#p;
			case O.STORAGE: return this.#m;
			case O.NONE:
			case void 0: return null;
		}
	}
	#ce = (e) => {
		e instanceof Ot ? this.#l = e : e instanceof gt ? this.#u = e : e instanceof lt ? this.#f = e : e instanceof Lt ? this.#d = e : e instanceof ut ? this.#p = e : e instanceof Ct && (this.#m = e), Ye(`context-change-${this.#c?.type}`), this.requestUpdate();
	};
	async #le() {
		if (!this.#e) return null;
		let e = new Promise((e) => {
			let t = (t) => {
				t.data && (e(Ma(t.data)), r());
			}, n = (t) => {
				t.data || window.setTimeout(() => {
					e(Ma(v.instance().flavor(Ve))), r();
				}, 50);
			}, r = () => {
				v.instance().removeFlavorChangeListener(Ve, t), this.#e?.removeEventListener(Te.TOGGLED, n);
			};
			v.instance().addFlavorChangeListener(Ve, t), this.#e?.addEventListener(Te.TOGGLED, n), this.#y.signal.addEventListener("abort", () => {
				e(null), r();
			}, { once: !0 });
		});
		this.#e.execute();
		try {
			return await e;
		} finally {
			this.#e.toggled() && this.#e.execute();
		}
	}
	async #ue(e, t, n) {
		if (!this.#c) return;
		this.#oe();
		let r = this.#y.signal;
		this.#c.isEmpty && dt.instance().recordAction(Nt.STARTED_AI_CONVERSATION);
		let i = Ge.instance().isEnabled("emulationCapabilities"), a, o = this.#c.getPendingMultimodalInput();
		i && o ? a = o : Ya() && t && n && (a = {
			input: t,
			id: crypto.randomUUID(),
			type: n
		}), Ye(`start-conversation-${this.#c.type}`, "ui"), await this.#de(this.#c.run(e, {
			signal: r,
			multimodalInput: a
		}));
	}
	async #de(e) {
		let t = await this.#s.acquire();
		try {
			let t = {
				entity: Sr.MODEL,
				parts: [],
				id: crypto.randomUUID()
			}, n = { isLoading: !0 };
			function r() {
				let e = t.parts.at(-1);
				(e?.type !== "step" || e.step !== n) && t.parts.push({
					type: "step",
					step: n
				});
			}
			this.#g = !0;
			let i = !1, a = !1;
			for await (let o of e) {
				switch (n.requestApproval = void 0, o.type) {
					case E.USER_QUERY:
						this.#h.push({
							entity: Sr.USER,
							text: o.query,
							imageInput: o.imageInput,
							id: crypto.randomUUID()
						}), t = {
							entity: Sr.MODEL,
							parts: [],
							id: crypto.randomUUID()
						}, this.#h.push(t), this.#b.isExpanded && !this.#b.isInlined && this.#w(t);
						break;
					case E.QUERYING:
						n = { isLoading: !0 }, t.parts.length || r();
						break;
					case E.CONTEXT:
						n.title = $(Z.analyzingData), n.contextDetails = o.details, n.widgets = o.widgets, n.isLoading = !1, r();
						break;
					case E.TITLE:
						n.title = o.title, r();
						break;
					case E.THOUGHT:
						n.isLoading = !1, n.thought = o.thought, r();
						break;
					case E.SUGGESTIONS: {
						let e = t.parts.at(-1);
						e?.type === "answer" ? e.suggestions = o.suggestions : t.parts.push({
							type: "answer",
							text: "",
							suggestions: o.suggestions
						});
						break;
					}
					case E.SIDE_EFFECT:
						n.isLoading = !1, n.code ??= o.code, n.requestApproval = {
							description: o.description,
							onAnswer: (e) => {
								o.confirm(e), n.requestApproval = void 0, this.requestUpdate();
							}
						}, r();
						break;
					case E.ACTION:
						n.isLoading = !1, n.code ??= o.code, n.output ??= o.output, n.canceled = o.canceled, n.widgets ??= o.widgets, r();
						break;
					case E.ANSWER: {
						t.rpcId = o.rpcId;
						let e = t.parts.at(-1);
						if (e?.type === "answer") e.text = o.text, o.suggestions && (e.suggestions = o.suggestions);
						else {
							let e = {
								type: "answer",
								text: o.text
							};
							o.suggestions && (e.suggestions = o.suggestions), t.parts.push(e);
						}
						if (o.widgets && w.devToolsAiAssistanceV2?.enabled && t.parts.push({
							type: "widget",
							widgets: o.widgets
						}), t.parts.length > 1) {
							let e = t.parts[0];
							e.type === "step" && e.step.isLoading && !e.step.thought && !e.step.code && !e.step.contextDetails && t.parts.shift();
						}
						n.isLoading = !1;
						break;
					}
					case E.ERROR: {
						t.error = o.error;
						let e = t.parts.at(-1);
						if (e?.type === "step") {
							let n = e.step;
							o.error === D.ABORT ? n.canceled = !0 : n.isLoading && t.parts.pop();
						}
						o.error === D.BLOCK && t.parts.at(-1)?.type === "answer" && t.parts.pop();
						break;
					}
					case E.CONTEXT_CHANGE: this.#ce(o.context), n.isLoading = !1, n.widgets = o.widgets, r(), n = { isLoading: !0 };
				}
				if (!this.#c?.isReadOnly) switch (this.requestUpdate(), (o.type === E.CONTEXT || o.type === E.SIDE_EFFECT) && this.#r.chatView?.scrollToBottom(), o.type) {
					case E.CONTEXT:
						he.status($(Z.analyzingData));
						break;
					case E.ANSWER: !o.complete && !i ? (i = !0, he.status($(Z.answerLoading))) : o.complete && !a && (a = !0, he.status($(Z.answerReady)));
				}
			}
			this.#g = !1, this.requestUpdate();
		} finally {
			t();
		}
	}
};
function Ka(e) {
	let t = ["## AI"];
	for (let n of e.parts) if (n.type === "answer") t.push(`### Answer\n\n${n.text}`);
	else if (n.type === "step") {
		let e = n.step;
		e.title && t.push(`### ${e.title}`), e.contextDetails && t.push(bt(e.contextDetails)), e.thought && t.push(e.thought), e.code && t.push(`**Code executed:**\n\`\`\`\n${e.code.trim()}\n\`\`\``), e.output && t.push(`**Data returned:**\n\`\`\`\n${e.output}\n\`\`\``);
	}
	return t.join("\n\n");
}
var qa = class {
	handleAction(e, t, n) {
		switch (t) {
			case "freestyler.elements-floating-button":
			case "freestyler.element-panel-context":
			case "freestyler.main-menu":
			case "drjones.network-floating-button":
			case "drjones.network-panel-context":
			case "drjones.performance-panel-context":
			case "drjones.sources-floating-button":
			case "drjones.sources-panel-context": return (async () => {
				let e = x.instance().view(Ga.panelName);
				if (!e) return;
				await x.instance().showView(Ga.panelName);
				let r = fe.instance().totalSize() / 4;
				fe.instance().drawerSize() < r && fe.instance().setDrawerSize(r), (await e.widget()).handleAction(t, n);
			})(), !0;
		}
		return !1;
	}
};
function Ja() {
	return Ya() && !!w.devToolsFreestyler?.multimodalUploadInput;
}
function Ya() {
	return !!w.devToolsFreestyler?.multimodal;
}
function Xa() {
	return !!w.devToolsAiAssistanceContextSelectionAgent?.enabled;
}
function Za() {
	return !w.aidaAvailability?.disallowLogging;
}
//#endregion
export { Xn as AccessibilityAgentMarkdownRenderer, qa as ActionDelegate, Ga as AiAssistancePanel, _i as ChatInput, gr as ChatMessage, Zi as ChatView, $i as DisabledWidget, sa as ExploreWidget, wa as ExportConversation, Pi as ExportForAgentsDialog, qn as MarkdownRendererWithCodeBlock, pa as OptInChangeDialog, li as PatchWidget, si as SELECT_WORKSPACE_DIALOG_DEFAULT_VIEW, ci as SelectWorkspaceDialog, Fa as ViewState, Qn as WalkthroughUtils, nr as WalkthroughView, Yi as getCSSChangeSummaryMessage, Ka as getResponseMarkdown };
