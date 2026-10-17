import { n as e } from "./rolldown-runtime-DF993M8W.js";
import { B as t, D as n, H as r, K as i, W as a, _ as o, i as s, v as c } from "./common-DMSVbaSb.js";
import { $ as l, Bc as u, Dt as d, Fo as f, Md as p, Mo as m, Po as h, Q as g, S as _, Uc as v, Ur as y, Xr as ee, Yf as te, af as b, bn as x, bp as S, c as ne, ci as re, dd as ie, df as ae, ef as C, ei as w, hd as oe, i as T, ii as se, jd as E, md as ce, o as le, q as D, qa as O, wt as k } from "./legacy-dM_vujv7.js";
import "./platform-D4TUCh2P.js";
import { i as A, r as j, t as M } from "./UIFilter-CIzBruM3.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/security/SecurityModel.ts
var ue = /* @__PURE__ */ e({
	CertificateSecurityState: () => pe,
	Events: () => z,
	PageVisibleSecurityState: () => fe,
	SecurityModel: () => L,
	SecurityStyleExplanation: () => B,
	SummaryMessages: () => de,
	securityStateCompare: () => R
}), N = {
	theSecurityOfThisPageIsUnknown: "The security of this page is unknown.",
	thisPageIsNotSecure: "This page is not secure.",
	thisPageIsSecureValidHttps: "This page is secure (valid HTTPS).",
	thisPageIsNotSecureBrokenHttps: "This page is not secure (broken HTTPS).",
	cipherWithMAC: "{PH1} with {PH2}",
	keyExchangeWithGroup: "{PH1} with {PH2}"
}, P = i("panels/security/SecurityModel.ts", N), F = r.bind(void 0, P), I = t.bind(void 0, P), L = class extends ae {
	dispatcher;
	securityAgent;
	constructor(e) {
		super(e), this.dispatcher = new he(this), this.securityAgent = e.securityAgent(), e.registerSecurityDispatcher(this.dispatcher), this.securityAgent.invoke_enable();
	}
	resourceTreeModel() {
		return this.target().model(v);
	}
	networkManager() {
		return this.target().model(oe);
	}
};
function R(e, t) {
	let n = [
		b.SecurityState.Info,
		b.SecurityState.InsecureBroken,
		b.SecurityState.Insecure,
		b.SecurityState.Neutral,
		b.SecurityState.Secure,
		b.SecurityState.Unknown
	];
	return n.indexOf(e) - n.indexOf(t);
}
ae.register(L, {
	capabilities: p.SECURITY,
	autostart: !1
});
var z = /* @__PURE__ */ function(e) {
	return e.VisibleSecurityStateChanged = "VisibleSecurityStateChanged", e;
}({}), de = {
	[b.SecurityState.Unknown]: I(N.theSecurityOfThisPageIsUnknown),
	[b.SecurityState.Insecure]: I(N.thisPageIsNotSecure),
	[b.SecurityState.Neutral]: I(N.thisPageIsNotSecure),
	[b.SecurityState.Secure]: I(N.thisPageIsSecureValidHttps),
	[b.SecurityState.InsecureBroken]: I(N.thisPageIsNotSecureBrokenHttps)
}, fe = class {
	securityState;
	certificateSecurityState;
	safetyTipInfo;
	securityStateIssueIds;
	constructor(e, t, n, r) {
		this.securityState = e, this.certificateSecurityState = t ? new pe(t) : null, this.safetyTipInfo = n ? new me(n) : null, this.securityStateIssueIds = r;
	}
}, pe = class {
	protocol;
	keyExchange;
	keyExchangeGroup;
	cipher;
	mac;
	certificate;
	subjectName;
	issuer;
	validFrom;
	validTo;
	certificateNetworkError;
	certificateHasWeakSignature;
	certificateHasSha1Signature;
	modernSSL;
	obsoleteSslProtocol;
	obsoleteSslKeyExchange;
	obsoleteSslCipher;
	obsoleteSslSignature;
	constructor(e) {
		this.protocol = e.protocol, this.keyExchange = e.keyExchange, this.keyExchangeGroup = e.keyExchangeGroup || null, this.cipher = e.cipher, this.mac = e.mac || null, this.certificate = e.certificate, this.subjectName = e.subjectName, this.issuer = e.issuer, this.validFrom = e.validFrom, this.validTo = e.validTo, this.certificateNetworkError = e.certificateNetworkError || null, this.certificateHasWeakSignature = e.certificateHasWeakSignature, this.certificateHasSha1Signature = e.certificateHasSha1Signature, this.modernSSL = e.modernSSL, this.obsoleteSslProtocol = e.obsoleteSslProtocol, this.obsoleteSslKeyExchange = e.obsoleteSslKeyExchange, this.obsoleteSslCipher = e.obsoleteSslCipher, this.obsoleteSslSignature = e.obsoleteSslSignature;
	}
	isCertificateExpiringSoon() {
		let e = (/* @__PURE__ */ new Date(this.validTo * 1e3)).getTime();
		return e < new Date(Date.now()).setHours(48) && e > Date.now();
	}
	getKeyExchangeName() {
		return this.keyExchangeGroup ? this.keyExchange ? F(N.keyExchangeWithGroup, {
			PH1: this.keyExchange,
			PH2: this.keyExchangeGroup
		}) : this.keyExchangeGroup : this.keyExchange;
	}
	getCipherFullName() {
		return this.mac ? F(N.cipherWithMAC, {
			PH1: this.cipher,
			PH2: this.mac
		}) : this.cipher;
	}
}, me = class {
	safetyTipStatus;
	safeUrl;
	constructor(e) {
		this.safetyTipStatus = e.safetyTipStatus, this.safeUrl = e.safeUrl || null;
	}
}, B = class {
	securityState;
	title;
	summary;
	description;
	certificate;
	mixedContentType;
	recommendations;
	constructor(e, t, n, r, i = [], a = b.MixedContentType.None, o = []) {
		this.securityState = e, this.title = t, this.summary = n, this.description = r, this.certificate = i, this.mixedContentType = a, this.recommendations = o;
	}
}, he = class {
	model;
	constructor(e) {
		this.model = e;
	}
	securityStateChanged(e) {}
	visibleSecurityStateChanged({ visibleSecurityState: e }) {
		let t = new fe(e.securityState, e.certificateSecurityState || null, e.safetyTipInfo || null, e.securityStateIssueIds);
		this.model.dispatchEventToListeners("VisibleSecurityStateChanged", t);
	}
	certificateError(e) {}
}, V = "/*\n * Copyright 2015 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.lock-icon,\n.security-property {\n  height: var(--sys-size-9);\n  width: var(--sys-size-9);\n}\n\n.lock-icon-secure {\n  color: var(--sys-color-green);\n}\n\n.lock-icon-insecure {\n  color: var(--sys-color-error);\n}\n\n.lock-icon-insecure-broken {\n  color: var(--sys-color-error);\n}\n\n.security-property-secure {\n  color: var(--sys-color-green);\n}\n\n.security-property-neutral {\n  color: var(--sys-color-error);\n}\n\n.security-property-insecure {\n  color: var(--sys-color-error);\n}\n\n.security-property-insecure-broken {\n  color: var(--sys-color-error);\n}\n\n.security-property-info {\n  color: var(--sys-color-on-surface-subtle);\n}\n\n.security-property-unknown {\n  color: var(--sys-color-on-surface-subtle);\n}\n\n.url-scheme-secure {\n  color: var(--sys-color-green);\n}\n\n.url-scheme-neutral,\n.url-scheme-insecure,\n.url-scheme-insecure-broken {\n  color: var(--sys-color-error);\n}\n", ge = "/*\n * Copyright 2015 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.devtools-link {\n  display: inline-block;\n}\n\n.security-main-view {\n  overflow: hidden auto;\n  background-color: var(--sys-color-cdt-base-container);\n}\n\n.security-main-view > div {\n  flex-shrink: 0;\n}\n\n.security-summary-section-title {\n  font-size: 15px;\n  margin: 12px 16px;\n  user-select: text;\n}\n\n.lock-spectrum {\n  margin: 8px 16px;\n  display: flex;\n  align-items: flex-start;\n}\n\n.security-summary .lock-icon {\n  flex: none;\n  width: 16px;\n  height: 16px;\n  margin: 0;\n}\n/* Separate the middle icon from the other two. */\n\n.security-summary .lock-icon-neutral {\n  margin: 0 16px;\n}\n\n.security-summary:not(.security-summary-secure) .lock-icon-secure,\n.security-summary:not(.security-summary-neutral) .lock-icon-neutral,\n.security-summary:not(.security-summary-insecure) .lock-icon-insecure,\n.security-summary:not(.security-summary-insecure-broken) .lock-icon-insecure-broken {\n  color: var(--sys-color-state-disabled);\n}\n\n@media (forced-colors: active) {\n  .security-summary-neutral .lock-icon-neutral {\n    color: Highlight;\n  }\n\n  .security-summary:not(.security-summary-secure) .lock-icon-secure,\n  .security-summary:not(.security-summary-neutral) .lock-icon-neutral,\n  .security-summary:not(.security-summary-insecure) .lock-icon-insecure,\n  .security-summary:not(.security-summary-insecure-broken) .lock-icon-insecure-broken {\n    color: canvastext;\n  }\n}\n\n.triangle-pointer-container {\n  margin: 8px 24px 0;\n  padding: 0;\n}\n\n.triangle-pointer-wrapper {\n  /* Defaults for dynamic properties. */\n  transform: translateX(0);\n  transition: transform 0.3s;\n}\n\n.triangle-pointer {\n  width: 12px;\n  height: 12px;\n  margin-bottom: -6px;\n  margin-left: -6px;\n  transform: rotate(-45deg);\n  border-style: solid;\n  border-width: 1px 1px 0 0;\n  background: var(--sys-color-cdt-base-container);\n  border-color: var(--sys-color-neutral-outline);\n}\n\n.security-summary-secure .triangle-pointer-wrapper {\n  transform: translateX(0);\n}\n\n.security-summary-neutral .triangle-pointer-wrapper {\n  transform: translateX(32px);\n}\n\n.security-summary-insecure .triangle-pointer-wrapper {\n  transform: translateX(64px);\n}\n\n.security-summary-insecure-broken .triangle-pointer-wrapper {\n  transform: translateX(64px);\n}\n\n.security-summary-text {\n  padding: 16px 24px;\n  border-style: solid;\n  border-width: 1px 0;\n  font-size: 15px;\n  background: var(--sys-color-cdt-base-container);\n  border-color: var(--sys-color-neutral-outline);\n  user-select: text;\n}\n\n.security-summary-secure .triangle-pointer,\n.security-summary-secure .security-summary-text,\n.security-explanation-title-secure {\n  color: var(--sys-color-green);\n}\n\n.security-summary-insecure-broken .triangle-pointer,\n.security-summary-insecure-broken .security-summary-text,\n.security-explanation-title-neutral,\n.security-explanation-title-insecure,\n.security-explanation-title-insecure-broken {\n  color: var(--sys-color-error);\n}\n\n.security-explanation-list {\n  padding-bottom: 16px;\n}\n\n.security-explanation-list:empty {\n  border-bottom: none;\n  padding: 0;\n}\n\n.security-explanations-main {\n  margin-top: -5px;\n  background-color: var(--sys-color-cdt-base-container);\n  border-bottom: 1px solid var(--sys-color-divider);\n}\n\n.security-explanations-extra {\n  background-color: transparent;\n}\n\n.security-explanation {\n  padding: 11px;\n  display: flex;\n  white-space: nowrap;\n  border: none;\n  color: var(--sys-color-token-subtle);\n}\n\n.security-explanation-text {\n  flex: auto;\n  white-space: normal;\n  max-width: 400px;\n}\n\n.origin-button {\n  margin-top: var(--sys-size-4);\n}\n\n.security-explanation .security-property {\n  flex: none;\n  width: 16px;\n  height: 16px;\n  margin-right: 16px;\n}\n\n.security-explanation-title {\n  color: var(--sys-color-token-subtle);\n  margin-top: 1px;\n  margin-bottom: 8px;\n}\n\n.security-mixed-content {\n  margin-top: 8px;\n}\n\n.security-explanation-recommendations {\n  padding-inline-start: 16px;\n}\n\n.security-explanation-recommendations > li {\n  margin-bottom: 4px;\n}\n", _e = class extends T {
	constructor(e = "", t = !1, n) {
		super(e, t, n), d(this.listItemElement, e);
	}
	get elemId() {
		return "overview";
	}
	showElement() {
		throw Error("Unimplemented Method");
	}
	onselect(e) {
		if (e) {
			let e = this.elemId;
			this.listItemElement.dispatchEvent(new CustomEvent("update-sidebar-selection", {
				bubbles: !0,
				composed: !0,
				detail: { id: e }
			})), this.showElement();
		}
		return !1;
	}
}, ve = class e extends Event {
	static eventName = "showorigin";
	origin;
	constructor(t) {
		super(e.eventName, {
			bubbles: !0,
			composed: !0
		}), this.origin = t;
	}
}, H = class extends _e {
	#e;
	#t;
	#n = null;
	constructor(e, t, n = null) {
		super(), this.#t = t, this.#n = n, this.listItemElement.classList.add(e), this.#e = null, this.setSecurityState(b.SecurityState.Unknown);
	}
	setSecurityState(e) {
		this.#e = e, this.#t(this);
	}
	securityState() {
		return this.#e;
	}
	origin() {
		return this.#n;
	}
	showElement() {
		this.listItemElement.dispatchEvent(new ve(this.#n));
	}
}, ye = "/*\n * Copyright 2015 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.title-section {\n  padding: 16px 0 24px;\n  border-bottom: 1px solid var(--sys-color-divider);\n}\n\n.title-section-header {\n  padding-left: 16px;\n  padding-bottom: 10px;\n  font-size: 14px;\n}\n\n.security-origin-view {\n  overflow: hidden scroll;\n  display: block;\n  user-select: text;\n}\n\n.security-origin-view .origin-view-section {\n  border-bottom: 1px solid var(--sys-color-divider);\n  padding: 12px 6px 12px  24px;\n  font-size: 12px;\n}\n\n.origin-view-notes {\n  margin-top: 2px;\n  color: var(--sys-color-token-subtle);\n}\n\n.origin-view-section-notes {\n  margin-top: 6px;\n  color: var(--sys-color-token-subtle);\n}\n\n.security-origin-view .origin-display {\n  font-size: 12px;\n  padding-left: var(--sys-size-8);\n  display: flex;\n  align-items: center;\n}\n\n.title-section > .view-network-button {\n  padding: 6px 0 0 16px;\n}\n\n.security-origin-view .origin-display devtools-icon {\n  width: var(--sys-size-8);\n  height: var(--sys-size-8);\n  margin-right: var(--sys-size-6);\n}\n\n.security-origin-view .origin-view-section-title {\n  margin-top: 4px;\n  margin-bottom: 4px;\n  font-weight: bold;\n}\n\n.security-origin-view .details-table {\n  border-spacing: 0;\n}\n\n.security-origin-view .details-table-row {\n  white-space: nowrap;\n  overflow: hidden;\n  line-height: 22px;\n  vertical-align: top;\n}\n\n.security-origin-view .details-table-row > td {\n  padding: 0;\n}\n\n.security-origin-view .details-table-row > td:first-child {\n  color: var(--sys-color-token-subtle);\n  width: calc(120px + 1em);\n  text-align: right;\n  padding-right: 1em;\n}\n\n.security-origin-view .details-table-row > td:nth-child(2) {\n  white-space: normal;\n}\n\n.security-origin-view .sct-details .details-table .details-table-row:last-child td:last-child {\n  border-bottom: 1px solid var(--sys-color-divider);\n  padding-bottom: 10px;\n}\n\n.security-origin-view .sct-details .details-table:last-child .details-table-row:last-child td:last-child {\n  border-bottom: none;\n  padding-bottom: 0;\n}\n\n.security-origin-view .details-toggle {\n  margin-left: 126px;\n}\n\n.security-origin-view .sct-toggle {\n  margin-left: 145px;\n  padding-top: 5px;\n}\n\n.security-origin-view .details-table .empty-san {\n  color: var(--sys-color-state-disabled);\n}\n\n.security-origin-view .details-table .san-entry {\n  display: block;\n}\n\n.security-origin-view .truncated-san .truncated-entry {\n  display: none;\n}\n\n.origin-view-section:last-child {\n  border-bottom: none;\n}\n\n.devtools-link {\n  display: inline-flex;\n}\n", be = "/*\n * Copyright 2015 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.tree-outline-disclosure {\n  width: 100%;\n}\n\n.tree-outline li.security-group-list-item {\n  & + ol {\n    padding-left: 0;\n  }\n\n  &::before {\n    display: none;\n  }\n\n  &:not(:first-child) {\n    margin-top: var(--sys-size-6);\n  }\n}\n\n.security-main-view-reload-message {\n  color: var(--sys-color-token-subtle);\n}\n\n.tree-outline li.security-sidebar-origins + .children > li {\n  &.selected {\n    .url-scheme-secure {\n      color: var(--sys-color-green);\n    }\n\n    .url-scheme-neutral,\n    .url-scheme-insecure,\n    .url-scheme-insecure-broken {\n      color: var(--sys-color-error);\n    }\n  }\n}\n\n.security-main-view-reload-message,\n.tree-outline li.security-sidebar-origins,\n.tree-outline li.security-group-list-item,\n.tree-outline span {\n  font: var(--sys-typescale-body4-medium);\n\n  &:hover:not(:has(devtools-checkbox)) .selection {\n    background: transparent;\n  }\n}\n\n.tree-outline li {\n  & .leading-icons {\n    flex: none;\n  }\n\n  & .tree-element-title,\n  .highlighted-url,\n  .title {\n    overflow: hidden;\n    text-overflow: ellipsis;\n  }\n}\n", U = {
	security: "Security",
	mainOrigin: "Main origin",
	nonsecureOrigins: "Non-secure origins",
	secureOrigins: "Secure origins",
	unknownCanceled: "Unknown / canceled",
	overview: "Overview",
	reloadToViewDetails: "Reload to view details"
}, xe = i("panels/security/SecurityPanelSidebar.ts", U), W = r.bind(void 0, xe), Se = class extends w {
	#e;
	sidebarTree;
	#t;
	#n;
	securityOverviewElement;
	#r;
	#i;
	#a;
	constructor(e) {
		super(e), this.#e = s.instance().createSetting("security-last-selected-element-path", ""), this.#a = null, this.sidebarTree = new le(ne.NAVIGATION_TREE), this.sidebarTree.registerRequiredCSS(V, be), this.sidebarTree.element.classList.add("security-sidebar"), this.contentElement.appendChild(this.sidebarTree.element);
		let t = W(U.security), n = this.#o(t, "security");
		this.securityOverviewElement = new H("security-main-view-sidebar-tree-item", this.#d), this.securityOverviewElement.tooltip = W(U.overview), n.appendChild(this.securityOverviewElement), this.#t = /* @__PURE__ */ new Map([
			[Q.MainOrigin, { title: W(U.mainOrigin) }],
			[Q.NonSecure, {
				title: W(U.nonsecureOrigins),
				icon: J(b.SecurityState.Insecure, `lock-icon lock-icon-${b.SecurityState.Insecure}`)
			}],
			[Q.Secure, {
				title: W(U.secureOrigins),
				icon: J(b.SecurityState.Secure, `lock-icon lock-icon-${b.SecurityState.Secure}`)
			}],
			[Q.Unknown, {
				title: W(U.unknownCanceled),
				icon: J(b.SecurityState.Unknown, `lock-icon lock-icon-${b.SecurityState.Unknown}`)
			}]
		]), this.#n = /* @__PURE__ */ new Map();
		for (let e of Object.values(Q)) {
			let t = this.#l(this.#t.get(e)?.title, this.#t.get(e)?.icon);
			this.#n.set(e, t), n.appendChild(t);
		}
		this.#i = new T(W(U.reloadToViewDetails)), this.#i.selectable = !1, this.#i.listItemElement.classList.add("security-main-view-reload-message"), this.#n.get(Q.MainOrigin).appendChild(this.#i), this.#u(), this.#r = /* @__PURE__ */ new Map(), this.element.addEventListener("update-sidebar-selection", (e) => {
			let t = e.detail.id;
			this.#e.set(t);
		}), this.showLastSelectedElement();
	}
	elementsByOrigin() {
		return this.#r;
	}
	showLastSelectedElement() {
		this.securityOverviewElement.select(), this.securityOverviewElement.showElement();
	}
	#o(e, t) {
		let n = new T(e, !0, t);
		return n.listItemElement.classList.add("security-group-list-item"), n.setCollapsible(!1), n.selectable = !1, this.sidebarTree.appendChild(n), g(n.listItemElement, 3), d(n.childrenListElement, e), n;
	}
	#s(e) {
		return this.#t.get(e)?.title;
	}
	#c(e) {
		return this.#n.get(e);
	}
	#l(e, t) {
		let n = new T(e, !0);
		return n.expand(), n.listItemElement.classList.add("security-sidebar-origins"), t && n.setLeadingIcons([t]), d(n.childrenListElement, e), n;
	}
	toggleOriginsList(e) {
		for (let t of this.#n.values()) t.hidden = e;
	}
	addOrigin(e, t) {
		this.#i.hidden = !0;
		let n = new H("security-sidebar-tree-item", this.#d, e);
		n.tooltip = e, this.#r.set(e, n), this.updateOrigin(e, t);
	}
	setMainOrigin(e) {
		this.#a = e;
	}
	get mainOrigin() {
		return this.#a;
	}
	get originGroups() {
		return this.#n;
	}
	updateOrigin(e, t) {
		let n = this.#r.get(e);
		n.setSecurityState(t);
		let r;
		if (e === this.#a) r = this.#n.get(Q.MainOrigin), r.title = W(U.mainOrigin), b.SecurityState.Secure, r.setLeadingIcons([Y(t, `lock-icon lock-icon-${t}`)]), d(r.childrenListElement, r.title);
		else switch (t) {
			case b.SecurityState.Secure:
				r = this.#c(Q.Secure);
				break;
			case b.SecurityState.Unknown:
				r = this.#c(Q.Unknown);
				break;
			default: r = this.#c(Q.NonSecure);
		}
		let i = n.parent;
		i !== r && (i && (i.removeChild(n), i.childCount() === 0 && (i.hidden = !0)), r.appendChild(n), r.hidden = !1);
	}
	#u() {
		for (let [e, t] of this.#n) if (e === Q.MainOrigin) {
			for (let e = t.childCount() - 1; e > 0; e--) t.removeChildAtIndex(e);
			t.title = this.#s(Q.MainOrigin), t.hidden = !1, this.#i.hidden = !1;
		} else t.removeChildren(), t.hidden = !0;
	}
	clearOrigins() {
		this.#u(), this.#r.clear();
	}
	focus() {
		this.sidebarTree.focus();
	}
	#d(e) {
		if (e instanceof H) {
			let t = e.securityState() ?? b.SecurityState.Unknown, n = e.listItemElement.classList.contains("security-main-view-sidebar-tree-item"), r = n ? Y(t, `lock-icon lock-icon-${t}`) : J(t, `security-property security-property-${t}`);
			if (e.setLeadingIcons([r]), n) e.title = W(U.overview);
			else {
				let n = X(e.origin() ?? "", t);
				e.listItemElement.lastChild && e.listItemElement.removeChild(e.listItemElement.lastChild), e.listItemElement.appendChild(n);
			}
		}
	}
}, Ce = /* @__PURE__ */ e({
	OriginGroup: () => Q,
	SecurityDetailsTable: () => $,
	SecurityMainView: () => Me,
	SecurityOriginView: () => Ne,
	SecurityPanel: () => Z,
	createHighlightedUrl: () => X,
	getSecurityStateIconForDetailedView: () => J,
	getSecurityStateIconForOverview: () => Y
}), { widget: we, widgetRef: Te } = se, G = {
	securityOverview: "Security overview",
	secure: "Secure",
	info: "Info",
	notSecure: "Not secure",
	viewCertificate: "View certificate",
	notSecureBroken: "Not secure (broken)",
	thisPageIsDangerousFlaggedBy: "This page is dangerous (flagged by Google Safe Browsing).",
	flaggedByGoogleSafeBrowsing: "Flagged by Google Safe Browsing",
	toCheckThisPagesStatusVisit: "To check this page's status, visit g.co/safebrowsingstatus.",
	thisIsAnErrorPage: "This is an error page.",
	thisPageIsInsecureUnencrypted: "This page is insecure (unencrypted HTTP).",
	thisPageHasANonhttpsSecureOrigin: "This page has a non-HTTPS secure origin.",
	thisPageIsSuspicious: "This page is suspicious",
	chromeHasDeterminedThatThisSiteS: "Chrome has determined that this site could be fake or fraudulent.",
	ifYouBelieveThisIsShownIn: "If you believe this is shown in error please visit https://g.co/chrome/lookalike-warnings.",
	possibleSpoofingUrl: "Possible spoofing URL",
	thisSitesHostnameLooksSimilarToP: "This site's hostname looks similar to {PH1}. Attackers sometimes mimic sites by making small, hard-to-see changes to the domain name.",
	ifYouBelieveThisIsShownInErrorSafety: "If you believe this is shown in error please visit https://g.co/chrome/lookalike-warnings.",
	thisPageIsSuspiciousFlaggedBy: "This page is suspicious (flagged by Chrome).",
	certificate: "Certificate",
	insecureSha: "insecure (SHA-1)",
	theCertificateChainForThisSite: "The certificate chain for this site contains a certificate signed using SHA-1.",
	subjectAlternativeNameMissing: "`Subject Alternative Name` missing",
	theCertificateForThisSiteDoesNot: "The certificate for this site does not contain a `Subject Alternative Name` extension containing a domain name or IP address.",
	missing: "missing",
	thisSiteIsMissingAValidTrusted: "This site is missing a valid, trusted certificate ({PH1}).",
	validAndTrusted: "valid and trusted",
	theConnectionToThisSiteIsUsingA: "The connection to this site is using a valid, trusted server certificate issued by {PH1}.",
	publickeypinningBypassed: "Public-Key-Pinning bypassed",
	publickeypinningWasBypassedByA: "Public-Key-Pinning was bypassed by a local root certificate.",
	certificateExpiresSoon: "Certificate expires soon",
	theCertificateForThisSiteExpires: "The certificate for this site expires in less than 48 hours and needs to be renewed.",
	connection: "Connection",
	secureConnectionSettings: "secure connection settings",
	theConnectionToThisSiteIs: "The connection to this site is encrypted and authenticated using {PH1}, {PH2}, and {PH3}.",
	sIsObsoleteEnableTlsOrLater: "{PH1} is obsolete. Enable TLS 1.2 or later.",
	rsaKeyExchangeIsObsoleteEnableAn: "RSA key exchange is obsolete. Enable an ECDHE-based cipher suite.",
	sIsObsoleteEnableAnAesgcmbased: "{PH1} is obsolete. Enable an AES-GCM-based cipher suite.",
	theServerSignatureUsesShaWhichIs: "The server signature uses SHA-1, which is obsolete. Enable a SHA-2 signature algorithm instead. (Note this is different from the signature in the certificate.)",
	obsoleteConnectionSettings: "obsolete connection settings",
	resources: "Resources",
	activeMixedContent: "active mixed content",
	youHaveRecentlyAllowedNonsecure: "You have recently allowed non-secure content (such as scripts or iframes) to run on this site.",
	mixedContent: "mixed content",
	thisPageIncludesHttpResources: "This page includes HTTP resources.",
	nonsecureForm: "non-secure form",
	thisPageIncludesAFormWithA: "This page includes a form with a non-secure \"action\" attribute.",
	activeContentWithCertificate: "active content with certificate errors",
	youHaveRecentlyAllowedContent: "You have recently allowed content loaded with certificate errors (such as scripts or iframes) to run on this site.",
	contentWithCertificateErrors: "content with certificate errors",
	thisPageIncludesResourcesThat: "This page includes resources that were loaded with certificate errors.",
	allServedSecurely: "all served securely",
	allResourcesOnThisPageAreServed: "All resources on this page are served securely.",
	blockedMixedContent: "Blocked mixed content",
	yourPageRequestedNonsecure: "Your page requested non-secure resources that were blocked.",
	reloadThePageToRecordRequestsFor: "Reload the page to record requests for HTTP resources.",
	viewDRequestsInNetworkPanel: "{n, plural, =1 {View # request in Network Panel} other {View # requests in Network Panel}}",
	origin: "Origin",
	viewRequestsInNetworkPanel: "View requests in Network Panel",
	protocol: "Protocol",
	keyExchange: "Key exchange",
	cipher: "Cipher",
	serverSignature: "Server signature",
	encryptedClientHello: "Encrypted ClientHello",
	certificateTransparency: "Certificate Transparency",
	subject: "Subject",
	validFrom: "Valid from",
	validUntil: "Valid until",
	issuer: "Issuer",
	openFullCertificateDetails: "Open full certificate details",
	sct: "SCT",
	logName: "Log name",
	logId: "Log ID",
	validationStatus: "Validation status",
	source: "Source",
	issuedAt: "Issued at",
	hashAlgorithm: "Hash algorithm",
	signatureAlgorithm: "Signature algorithm",
	signatureData: "Signature data",
	showFullDetails: "Show full details",
	hideFullDetails: "Hide full details",
	thisRequestCompliesWithChromes: "This request complies with `Chrome`'s Certificate Transparency policy.",
	thisRequestDoesNotComplyWith: "This request does not comply with `Chrome`'s Certificate Transparency policy.",
	thisResponseWasLoadedFromCache: "This response was loaded from cache. Some security details might be missing.",
	theSecurityDetailsAboveAreFrom: "The security details above are from the first inspected response.",
	thisOriginIsANonhttpsSecure: "This origin is a non-HTTPS secure origin.",
	yourConnectionToThisOriginIsNot: "Your connection to this origin is not secure.",
	noSecurityInformation: "No security information",
	noSecurityDetailsAreAvailableFor: "No security details are available for this origin.",
	na: "(n/a)",
	showLess: "Show less",
	showMoreSTotal: "Show more ({PH1} total)",
	unknownField: "unknown",
	enabled: "enabled"
}, Ee = i("panels/security/SecurityPanel.ts", G), K = r.bind(void 0, Ee), q, De = /* @__PURE__ */ new Map([
	[513, "RSA with SHA-1"],
	[1025, "RSA with SHA-256"],
	[1281, "RSA with SHA-384"],
	[1537, "RSA with SHA-512"],
	[1027, "ECDSA with SHA-256"],
	[1283, "ECDSA with SHA-384"],
	[2052, "RSA-PSS with SHA-256"],
	[2053, "RSA-PSS with SHA-384"],
	[2054, "RSA-PSS with SHA-512"]
]), Oe = "lock", ke = "warning", Ae = "indeterminate-question-box";
function J(e, t) {
	let n;
	switch (e) {
		case b.SecurityState.Neutral:
		case b.SecurityState.Insecure:
		case b.SecurityState.InsecureBroken:
			n = ke;
			break;
		case b.SecurityState.Secure:
			n = Oe;
			break;
		case b.SecurityState.Info:
		case b.SecurityState.Unknown: n = Ae;
	}
	return m(n, t);
}
function Y(e, t) {
	let n;
	switch (e) {
		case b.SecurityState.Unknown:
		case b.SecurityState.Neutral:
			n = Ae;
			break;
		case b.SecurityState.Insecure:
		case b.SecurityState.InsecureBroken:
			n = ke;
			break;
		case b.SecurityState.Secure:
			n = Oe;
			break;
		case b.SecurityState.Info: throw Error(`Unexpected security state ${e}`);
	}
	return m(n, t);
}
function X(e, t) {
	let n = e.indexOf("://");
	if (n === -1) {
		let t = document.createElement("span");
		return t.textContent = e, t;
	}
	let r = document.createElement("span");
	r.classList.add("highlighted-url");
	let i = e.substr(0, n), a = e.substr(n + 3);
	return r.createChild("span", "url-scheme-" + t).textContent = i, r.createChild("span", "url-scheme-separator").textContent = "://", r.createChild("span").textContent = a, r;
}
var je = (e, t, n) => {
	f(h`
    <devtools-split-view direction="column" name="security"
      ${re(ee, (e) => {
		t.splitWidget = e;
	})}>
      <devtools-widget
        slot="sidebar"
        ${we(Se)}
        ${Te(Se, (e) => {
		t.sidebar = e;
	})}>
      </devtools-widget>
  </devtools-split-view>`, n);
}, Z = class e extends _ {
	view;
	mainView;
	sidebar;
	lastResponseReceivedForLoaderId;
	origins;
	filterRequestCounts;
	visibleView;
	eventListeners;
	securityModel;
	splitWidget;
	constructor(e = je) {
		super("security"), this.view = e, this.update(), this.sidebar.setMinimumSize(100, 25), this.sidebar.element.classList.add("panel-sidebar"), this.sidebar.element.setAttribute("jslog", `${O("sidebar").track({ resize: !0 })}`), this.mainView = new Me(), this.mainView.panel = this, this.element.addEventListener(ve.eventName, (e) => {
			e.origin ? this.showOrigin(e.origin) : this.setVisibleView(this.mainView);
		}), this.lastResponseReceivedForLoaderId = /* @__PURE__ */ new Map(), this.origins = /* @__PURE__ */ new Map(), this.filterRequestCounts = /* @__PURE__ */ new Map(), this.visibleView = null, this.eventListeners = [], this.securityModel = null, E.instance().observeModels(L, this, { scoped: !0 }), E.instance().addModelListener(v, u.PrimaryPageChanged, this.onPrimaryPageChanged, this), this.sidebar.showLastSelectedElement();
	}
	static instance(t = { forceNew: null }) {
		let { forceNew: n } = t;
		return (!q || n) && (q = new e()), q;
	}
	static createCertificateViewerButtonForOrigin(e, t) {
		let n = x(e, async (e) => {
			e.consume();
			let n = await ce.instance().getCertificate(t);
			n.length > 0 && te.showCertificateViewer(n);
		}, {
			className: "origin-button",
			jslogContext: "security.view-certificate-for-origin",
			title: e
		});
		return D(n), n;
	}
	static createCertificateViewerButtonForCert(e, t) {
		let n = x(e, (e) => {
			e.consume(), te.showCertificateViewer(t);
		}, {
			className: "origin-button",
			jslogContext: "security.view-certificate"
		});
		return D(n), n;
	}
	update() {
		this.view({ panel: this }, this, this.contentElement);
	}
	updateVisibleSecurityState(e) {
		this.sidebar.securityOverviewElement.setSecurityState(e.securityState), this.mainView.updateVisibleSecurityState(e);
	}
	onVisibleSecurityStateChanged({ data: e }) {
		this.updateVisibleSecurityState(e);
	}
	showOrigin(e) {
		let t = this.origins.get(e);
		t && (t.originView ||= new Ne(e, t), this.setVisibleView(t.originView));
	}
	wasShown() {
		super.wasShown(), this.visibleView || this.sidebar.showLastSelectedElement();
	}
	focus() {
		this.sidebar.focus();
	}
	setVisibleView(e) {
		this.visibleView !== e && (this.visibleView && this.visibleView.detach(), this.visibleView = e, e && this.splitWidget.setMainWidget(e));
	}
	onResponseReceived(e) {
		let t = e.data.request;
		t.resourceType() === o.Document && t.loaderId && this.lastResponseReceivedForLoaderId.set(t.loaderId, t);
	}
	processRequest(e) {
		let t = c.extractOrigin(e.url());
		if (!t) return;
		let n = e.securityState();
		(e.mixedContentType === b.MixedContentType.Blockable || e.mixedContentType === b.MixedContentType.OptionallyBlockable) && (n = b.SecurityState.Insecure);
		let r = this.origins.get(t);
		if (r) {
			if (R(n, r.securityState) < 0) {
				r.securityState = n;
				let i = e.securityDetails();
				i && (r.securityDetails = i), this.sidebar.updateOrigin(t, n), r.originView && r.originView.setSecurityState(n);
			}
		} else {
			let r = {
				securityState: n,
				securityDetails: e.securityDetails(),
				loadedFromCache: e.cached()
			};
			this.origins.set(t, r), this.sidebar.addOrigin(t, n);
		}
	}
	onRequestFinished(e) {
		let t = e.data;
		this.updateFilterRequestCounts(t), this.processRequest(t);
	}
	updateFilterRequestCounts(e) {
		if (e.mixedContentType === b.MixedContentType.None) return;
		let t = j.ALL;
		e.wasBlocked() ? t = j.BLOCKED : e.mixedContentType === b.MixedContentType.Blockable ? t = j.BLOCK_OVERRIDDEN : e.mixedContentType === b.MixedContentType.OptionallyBlockable && (t = j.DISPLAYED);
		let n = this.filterRequestCounts.get(t);
		n ? this.filterRequestCounts.set(t, n + 1) : this.filterRequestCounts.set(t, 1), this.mainView.refreshExplanations();
	}
	filterRequestCount(e) {
		return this.filterRequestCounts.get(e) || 0;
	}
	modelAdded(e) {
		if (e.target() !== e.target().outermostTarget()) return;
		this.securityModel = e;
		let t = e.resourceTreeModel(), n = e.networkManager();
		this.eventListeners.length && S(this.eventListeners), this.eventListeners = [
			e.addEventListener(z.VisibleSecurityStateChanged, this.onVisibleSecurityStateChanged, this),
			t.addEventListener(u.InterstitialShown, this.onInterstitialShown, this),
			t.addEventListener(u.InterstitialHidden, this.onInterstitialHidden, this),
			n.addEventListener(ie.ResponseReceived, this.onResponseReceived, this),
			n.addEventListener(ie.RequestFinished, this.onRequestFinished, this)
		], t.isInterstitialShowing && this.onInterstitialShown();
	}
	modelRemoved(e) {
		this.securityModel === e && (this.securityModel = null, S(this.eventListeners));
	}
	onPrimaryPageChanged(e) {
		let { frame: t } = e.data, n = this.lastResponseReceivedForLoaderId.get(t.loaderId);
		this.sidebar.showLastSelectedElement(), this.sidebar.clearOrigins(), this.origins.clear(), this.lastResponseReceivedForLoaderId.clear(), this.filterRequestCounts.clear(), this.mainView.refreshExplanations();
		let r = c.extractOrigin(n ? n.url() : t.url);
		this.sidebar.setMainOrigin(r), n && this.processRequest(n);
	}
	onInterstitialShown() {
		this.sidebar.showLastSelectedElement(), this.sidebar.toggleOriginsList(!0);
	}
	onInterstitialHidden() {
		this.sidebar.toggleOriginsList(!1);
	}
}, Q = /* @__PURE__ */ function(e) {
	return e.MainOrigin = "MainOrigin", e.NonSecure = "NonSecure", e.Secure = "Secure", e.Unknown = "Unknown", e;
}({}), Me = class extends w {
	panel;
	summarySection;
	securityExplanationsMain;
	securityExplanationsExtra;
	lockSpectrum;
	summaryText;
	explanations;
	securityState;
	constructor(e) {
		super(e, { jslog: `${O("security.main-view")}` }), this.registerRequiredCSS(V, ge), this.setMinimumSize(200, 100), this.contentElement.classList.add("security-main-view"), this.summarySection = this.contentElement.createChild("div", "security-summary"), this.securityExplanationsMain = this.contentElement.createChild("div", "security-explanation-list security-explanations-main"), this.securityExplanationsExtra = this.contentElement.createChild("div", "security-explanation-list security-explanations-extra");
		let t = this.summarySection.createChild("div", "security-summary-section-title");
		t.textContent = K(G.securityOverview), g(t, 1);
		let n = this.summarySection.createChild("div", "lock-spectrum");
		this.lockSpectrum = /* @__PURE__ */ new Map([
			[b.SecurityState.Secure, n.appendChild(Y(b.SecurityState.Secure, "lock-icon lock-icon-secure"))],
			[b.SecurityState.Neutral, n.appendChild(Y(b.SecurityState.Neutral, "lock-icon lock-icon-neutral"))],
			[b.SecurityState.Insecure, n.appendChild(Y(b.SecurityState.Insecure, "lock-icon lock-icon-insecure"))]
		]), y.install(this.getLockSpectrumDiv(b.SecurityState.Secure), K(G.secure)), y.install(this.getLockSpectrumDiv(b.SecurityState.Neutral), K(G.info)), y.install(this.getLockSpectrumDiv(b.SecurityState.Insecure), K(G.notSecure)), this.summarySection.createChild("div", "triangle-pointer-container").createChild("div", "triangle-pointer-wrapper").createChild("div", "triangle-pointer"), this.summaryText = this.summarySection.createChild("div", "security-summary-text"), g(this.summaryText, 2), this.explanations = null, this.securityState = null;
	}
	getLockSpectrumDiv(e) {
		let t = this.lockSpectrum.get(e);
		if (!t) throw Error(`Invalid argument: ${e}`);
		return t;
	}
	addExplanation(e, t) {
		let n = e.createChild("div", "security-explanation");
		n.classList.add("security-explanation-" + t.securityState);
		let r = J(t.securityState, "security-property security-property-" + t.securityState);
		n.appendChild(r);
		let i = n.createChild("div", "security-explanation-text"), a = i.createChild("div", "security-explanation-title");
		if (t.title ? (a.createChild("span").textContent = t.title + " - ", a.createChild("span", "security-explanation-title-" + t.securityState).textContent = t.summary) : a.textContent = t.summary, i.createChild("div").textContent = t.description, t.certificate.length && i.appendChild(Z.createCertificateViewerButtonForCert(K(G.viewCertificate), t.certificate)), t.recommendations?.length) {
			let e = i.createChild("ul", "security-explanation-recommendations");
			for (let n of t.recommendations) e.createChild("li").textContent = n;
		}
		return i;
	}
	updateVisibleSecurityState(e) {
		this.summarySection.classList.remove("security-summary-" + this.securityState), this.securityState = e.securityState, this.summarySection.classList.add("security-summary-" + this.securityState), this.securityState === b.SecurityState.Insecure ? (this.getLockSpectrumDiv(b.SecurityState.Insecure).classList.add("lock-icon-insecure"), this.getLockSpectrumDiv(b.SecurityState.Insecure).classList.remove("lock-icon-insecure-broken"), y.install(this.getLockSpectrumDiv(b.SecurityState.Insecure), K(G.notSecure))) : this.securityState === b.SecurityState.InsecureBroken && (this.getLockSpectrumDiv(b.SecurityState.Insecure).classList.add("lock-icon-insecure-broken"), this.getLockSpectrumDiv(b.SecurityState.Insecure).classList.remove("lock-icon-insecure"), y.install(this.getLockSpectrumDiv(b.SecurityState.Insecure), K(G.notSecureBroken)));
		let { summary: t, explanations: n } = this.getSecuritySummaryAndExplanations(e);
		this.summaryText.textContent = t || de[this.securityState](), this.explanations = this.orderExplanations(n), this.refreshExplanations();
	}
	getSecuritySummaryAndExplanations(e) {
		let { securityState: t, securityStateIssueIds: n } = e, r, i = [];
		if (r = this.explainSafetyTipSecurity(e, r, i), n.includes("malicious-content")) r = K(G.thisPageIsDangerousFlaggedBy), i.unshift(new B(b.SecurityState.Insecure, void 0, K(G.flaggedByGoogleSafeBrowsing), K(G.toCheckThisPagesStatusVisit)));
		else if (n.includes("is-error-page") && e.certificateSecurityState?.certificateNetworkError === null) return r = K(G.thisIsAnErrorPage), {
			summary: r,
			explanations: i
		};
		else t === b.SecurityState.InsecureBroken && n.includes("scheme-is-not-cryptographic") && (r ||= K(G.thisPageIsInsecureUnencrypted));
		return n.includes("scheme-is-not-cryptographic") ? (t === b.SecurityState.Neutral && !n.includes("insecure-origin") && (r = K(G.thisPageHasANonhttpsSecureOrigin)), {
			summary: r,
			explanations: i
		}) : (this.explainCertificateSecurity(e, i), this.explainConnectionSecurity(e, i), this.explainContentSecurity(e, i), {
			summary: r,
			explanations: i
		});
	}
	explainSafetyTipSecurity(e, t, n) {
		let { securityStateIssueIds: r, safetyTipInfo: i } = e, a = [];
		if (r.includes("bad_reputation")) {
			let e = `${K(G.chromeHasDeterminedThatThisSiteS)}\n\n${K(G.ifYouBelieveThisIsShownIn)}`;
			a.push({
				summary: K(G.thisPageIsSuspicious),
				description: e
			});
		} else if (r.includes("lookalike") && i?.safeUrl) {
			let e = { PH1: new URL(i.safeUrl).hostname }, t = `${K(G.thisSitesHostnameLooksSimilarToP, e)}\n\n${K(G.ifYouBelieveThisIsShownInErrorSafety)}`;
			a.push({
				summary: K(G.possibleSpoofingUrl),
				description: t
			});
		}
		return a.length > 0 && (t ||= K(G.thisPageIsSuspiciousFlaggedBy), n.push(new B(b.SecurityState.Insecure, void 0, a[0].summary, a[0].description))), t;
	}
	explainCertificateSecurity(e, t) {
		let { certificateSecurityState: n, securityStateIssueIds: r } = e, i = K(G.certificate);
		if (n?.certificateHasSha1Signature) {
			let e = K(G.insecureSha), r = K(G.theCertificateChainForThisSite);
			n.certificateHasWeakSignature ? t.push(new B(b.SecurityState.Insecure, i, e, r, n.certificate, b.MixedContentType.None)) : t.push(new B(b.SecurityState.Neutral, i, e, r, n.certificate, b.MixedContentType.None));
		}
		n && r.includes("cert-missing-subject-alt-name") && t.push(new B(b.SecurityState.Insecure, i, K(G.subjectAlternativeNameMissing), K(G.theCertificateForThisSiteDoesNot), n.certificate, b.MixedContentType.None)), n && n.certificateNetworkError !== null ? t.push(new B(b.SecurityState.Insecure, i, K(G.missing), K(G.thisSiteIsMissingAValidTrusted, { PH1: n.certificateNetworkError }), n.certificate, b.MixedContentType.None)) : n && !n.certificateHasSha1Signature && t.push(new B(b.SecurityState.Secure, i, K(G.validAndTrusted), K(G.theConnectionToThisSiteIsUsingA, { PH1: n.issuer }), n.certificate, b.MixedContentType.None)), r.includes("pkp-bypassed") && t.push(new B(b.SecurityState.Info, i, K(G.publickeypinningBypassed), K(G.publickeypinningWasBypassedByA))), n?.isCertificateExpiringSoon() && t.push(new B(b.SecurityState.Info, void 0, K(G.certificateExpiresSoon), K(G.theCertificateForThisSiteExpires)));
	}
	explainConnectionSecurity(e, t) {
		let n = e.certificateSecurityState;
		if (!n) return;
		let r = K(G.connection);
		if (n.modernSSL) {
			t.push(new B(b.SecurityState.Secure, r, K(G.secureConnectionSettings), K(G.theConnectionToThisSiteIs, {
				PH1: n.protocol,
				PH2: n.getKeyExchangeName(),
				PH3: n.getCipherFullName()
			})));
			return;
		}
		let i = [];
		n.obsoleteSslProtocol && i.push(K(G.sIsObsoleteEnableTlsOrLater, { PH1: n.protocol })), n.obsoleteSslKeyExchange && i.push(K(G.rsaKeyExchangeIsObsoleteEnableAn)), n.obsoleteSslCipher && i.push(K(G.sIsObsoleteEnableAnAesgcmbased, { PH1: n.cipher })), n.obsoleteSslSignature && i.push(K(G.theServerSignatureUsesShaWhichIs)), t.push(new B(b.SecurityState.Info, r, K(G.obsoleteConnectionSettings), K(G.theConnectionToThisSiteIs, {
			PH1: n.protocol,
			PH2: n.getKeyExchangeName(),
			PH3: n.getCipherFullName()
		}), void 0, void 0, i));
	}
	explainContentSecurity(e, t) {
		let n = !0, r = K(G.resources), i = e.securityStateIssueIds;
		i.includes("ran-mixed-content") && (n = !1, t.push(new B(b.SecurityState.Insecure, r, K(G.activeMixedContent), K(G.youHaveRecentlyAllowedNonsecure), [], b.MixedContentType.Blockable))), i.includes("displayed-mixed-content") && (n = !1, t.push(new B(b.SecurityState.Neutral, r, K(G.mixedContent), K(G.thisPageIncludesHttpResources), [], b.MixedContentType.OptionallyBlockable))), i.includes("contained-mixed-form") && (n = !1, t.push(new B(b.SecurityState.Neutral, r, K(G.nonsecureForm), K(G.thisPageIncludesAFormWithA)))), e.certificateSecurityState?.certificateNetworkError === null && (i.includes("ran-content-with-cert-error") && (n = !1, t.push(new B(b.SecurityState.Insecure, r, K(G.activeContentWithCertificate), K(G.youHaveRecentlyAllowedContent)))), i.includes("displayed-content-with-cert-errors") && (n = !1, t.push(new B(b.SecurityState.Neutral, r, K(G.contentWithCertificateErrors), K(G.thisPageIncludesResourcesThat))))), n && (i.includes("scheme-is-not-cryptographic") || t.push(new B(b.SecurityState.Secure, r, K(G.allServedSecurely), K(G.allResourcesOnThisPageAreServed))));
	}
	orderExplanations(e) {
		if (e.length === 0) return e;
		let t = [
			b.SecurityState.Insecure,
			b.SecurityState.Neutral,
			b.SecurityState.Secure,
			b.SecurityState.Info
		], n = [];
		for (let r of t) n.push(...e.filter((e) => e.securityState === r));
		return n;
	}
	refreshExplanations() {
		if (this.securityExplanationsMain.removeChildren(), this.securityExplanationsExtra.removeChildren(), this.explanations) {
			for (let e of this.explanations) if (e.securityState === b.SecurityState.Info) this.addExplanation(this.securityExplanationsExtra, e);
			else switch (e.mixedContentType) {
				case b.MixedContentType.Blockable:
					this.addMixedContentExplanation(this.securityExplanationsMain, e, j.BLOCK_OVERRIDDEN);
					break;
				case b.MixedContentType.OptionallyBlockable:
					this.addMixedContentExplanation(this.securityExplanationsMain, e, j.DISPLAYED);
					break;
				default: this.addExplanation(this.securityExplanationsMain, e);
			}
			if (this.panel.filterRequestCount(j.BLOCKED) > 0) {
				let e = {
					securityState: b.SecurityState.Info,
					summary: K(G.blockedMixedContent),
					description: K(G.yourPageRequestedNonsecure),
					mixedContentType: b.MixedContentType.Blockable,
					certificate: [],
					title: ""
				};
				this.addMixedContentExplanation(this.securityExplanationsMain, e, j.BLOCKED);
			}
		}
	}
	addMixedContentExplanation(e, t, n) {
		let r = this.addExplanation(e, t), i = this.panel.filterRequestCount(n);
		if (!i) {
			let e = r.createChild("div", "security-mixed-content");
			e.textContent = K(G.reloadThePageToRecordRequestsFor);
			return;
		}
		let a = r.createChild("button", "security-mixed-content devtools-link text-button link-style");
		l(a), a.tabIndex = 0, a.textContent = K(G.viewDRequestsInNetworkPanel, { n: i }), a.addEventListener("click", this.showNetworkFilter.bind(this, n));
	}
	showNetworkFilter(e, t) {
		t.consume(), n(A.filters([{
			filterType: M.MixedContent,
			filterValue: e
		}]));
	}
}, Ne = class extends w {
	originLockIcon;
	constructor(e, t) {
		super({ jslog: `${O("security.origin-view")}` }), this.registerRequiredCSS(ye, V), this.setMinimumSize(200, 100), this.element.classList.add("security-origin-view");
		let r = this.element.createChild("div", "title-section"), i = r.createChild("div", "title-section-header");
		i.textContent = K(G.origin), g(i, 1);
		let o = r.createChild("div", "origin-display");
		this.originLockIcon = o.createChild("span");
		let s = J(t.securityState, `security-property security-property-${t.securityState}`);
		this.originLockIcon.appendChild(s), o.appendChild(X(e, t.securityState));
		let u = r.createChild("div", "view-network-button"), f = x(K(G.viewRequestsInNetworkPanel), (t) => {
			t.consume();
			let r = new c(e);
			n(A.filters([{
				filterType: M.Domain,
				filterValue: r.host
			}, {
				filterType: M.Scheme,
				filterValue: r.scheme
			}]));
		}, { jslogContext: "reveal-in-network" });
		if (u.appendChild(f), l(f), t.securityDetails) {
			let n = this.element.createChild("div", "origin-view-section"), r = n.createChild("div", "origin-view-section-title");
			r.textContent = K(G.connection), g(r, 2);
			let i = new $();
			if (n.appendChild(i.element()), i.addRow(K(G.protocol), t.securityDetails.protocol), t.securityDetails.keyExchange && t.securityDetails.keyExchangeGroup ? i.addRow(K(G.keyExchange), t.securityDetails.keyExchange + " with " + t.securityDetails.keyExchangeGroup) : t.securityDetails.keyExchange ? i.addRow(K(G.keyExchange), t.securityDetails.keyExchange) : t.securityDetails.keyExchangeGroup && i.addRow(K(G.keyExchange), t.securityDetails.keyExchangeGroup), t.securityDetails.serverSignatureAlgorithm) {
				let e = De.get(t.securityDetails.serverSignatureAlgorithm);
				e ??= K(G.unknownField) + " (" + t.securityDetails.serverSignatureAlgorithm + ")", i.addRow(K(G.serverSignature), e);
			}
			i.addRow(K(G.cipher), t.securityDetails.cipher + (t.securityDetails.mac ? " with " + t.securityDetails.mac : "")), t.securityDetails.encryptedClientHello && i.addRow(K(G.encryptedClientHello), K(G.enabled));
			let o = this.element.createChild("div", "origin-view-section"), s = o.createChild("div", "origin-view-section-title");
			s.textContent = K(G.certificate), g(s, 2);
			let c = t.securityDetails.signedCertificateTimestampList.length, l = t.securityDetails.certificateTransparencyCompliance, u;
			if (c || l !== C.CertificateTransparencyCompliance.Unknown) {
				u = this.element.createChild("div", "origin-view-section");
				let e = u.createChild("div", "origin-view-section-title");
				e.textContent = K(G.certificateTransparency), g(e, 2);
			}
			let f = this.createSanDiv(t.securityDetails.sanList), p = (/* @__PURE__ */ new Date(1e3 * t.securityDetails.validFrom)).toUTCString(), m = (/* @__PURE__ */ new Date(1e3 * t.securityDetails.validTo)).toUTCString();
			if (i = new $(), o.appendChild(i.element()), i.addRow(K(G.subject), t.securityDetails.subjectName), i.addRow(a("SAN"), f), i.addRow(K(G.validFrom), p), i.addRow(K(G.validUntil), m), i.addRow(K(G.issuer), t.securityDetails.issuer), i.addRow("", Z.createCertificateViewerButtonForOrigin(K(G.openFullCertificateDetails), e)), !u) return;
			let h = new $();
			h.element().classList.add("sct-summary"), u.appendChild(h.element());
			for (let e = 0; e < c; e++) {
				let n = t.securityDetails.signedCertificateTimestampList[e];
				h.addRow(K(G.sct), n.logDescription + " (" + n.origin + ", " + n.status + ")");
			}
			let _ = u.createChild("div", "sct-details");
			_.classList.add("hidden");
			for (let e = 0; e < c; e++) {
				let n = new $();
				_.appendChild(n.element());
				let r = t.securityDetails.signedCertificateTimestampList[e];
				n.addRow(K(G.logName), r.logDescription), n.addRow(K(G.logId), r.logId.replace(/(.{2})/g, "$1 ")), n.addRow(K(G.validationStatus), r.status), n.addRow(K(G.source), r.origin), n.addRow(K(G.issuedAt), new Date(r.timestamp).toUTCString()), n.addRow(K(G.hashAlgorithm), r.hashAlgorithm), n.addRow(K(G.signatureAlgorithm), r.signatureAlgorithm), n.addRow(K(G.signatureData), r.signatureData.replace(/(.{2})/g, "$1 "));
			}
			if (c) {
				function e() {
					let e, n = !_.classList.contains("hidden");
					e = K(n ? G.showFullDetails : G.hideFullDetails), t.textContent = e, d(t, e), k(t, !n), h.element().classList.toggle("hidden"), _.classList.toggle("hidden");
				}
				let t = x(K(G.showFullDetails), e, {
					className: "details-toggle",
					jslogContext: "security.toggle-scts-details"
				});
				u.appendChild(t);
			}
			switch (l) {
				case C.CertificateTransparencyCompliance.Compliant:
					u.createChild("div", "origin-view-section-notes").textContent = K(G.thisRequestCompliesWithChromes);
					break;
				case C.CertificateTransparencyCompliance.NotCompliant:
					u.createChild("div", "origin-view-section-notes").textContent = K(G.thisRequestDoesNotComplyWith);
					break;
				case C.CertificateTransparencyCompliance.Unknown:
			}
			let v = this.element.createChild("div", "origin-view-section origin-view-notes");
			t.loadedFromCache && (v.createChild("div").textContent = K(G.thisResponseWasLoadedFromCache)), v.createChild("div").textContent = K(G.theSecurityDetailsAboveAreFrom);
		} else if (t.securityState === b.SecurityState.Secure) {
			let e = this.element.createChild("div", "origin-view-section"), t = e.createChild("div", "origin-view-section-title");
			t.textContent = K(G.secure), g(t, 2), e.createChild("div").textContent = K(G.thisOriginIsANonhttpsSecure);
		} else if (t.securityState !== b.SecurityState.Unknown) {
			let e = this.element.createChild("div", "origin-view-section"), t = e.createChild("div", "origin-view-section-title");
			t.textContent = K(G.notSecure), g(t, 2), e.createChild("div").textContent = K(G.yourConnectionToThisOriginIsNot);
		} else {
			let e = this.element.createChild("div", "origin-view-section"), t = e.createChild("div", "origin-view-section-title");
			t.textContent = K(G.noSecurityInformation), g(t, 2), e.createChild("div").textContent = K(G.noSecurityDetailsAreAvailableFor);
		}
	}
	createSanDiv(e) {
		let t = document.createElement("div");
		if (e.length === 0) t.textContent = K(G.na), t.classList.add("empty-san");
		else {
			let n = e.length > 3;
			for (let r = 0; r < e.length; r++) {
				let i = t.createChild("span", "san-entry");
				i.textContent = e[r], n && r >= 2 && i.classList.add("truncated-entry");
			}
			if (n) {
				function n() {
					let n = t.classList.contains("truncated-san"), i;
					n ? (t.classList.remove("truncated-san"), i = K(G.showLess)) : (t.classList.add("truncated-san"), i = K(G.showMoreSTotal, { PH1: e.length })), r.textContent = i, d(r, i), k(r, n);
				}
				let r = x(K(G.showMoreSTotal, { PH1: e.length }), n, { jslogContext: "security.toggle-san-truncation" });
				t.appendChild(r), n();
			}
		}
		return t;
	}
	setSecurityState(e) {
		this.originLockIcon.removeChildren();
		let t = J(e, `security-property security-property-${e}`);
		this.originLockIcon.appendChild(t);
	}
}, $ = class {
	#e;
	constructor() {
		this.#e = document.createElement("table"), this.#e.classList.add("details-table");
	}
	element() {
		return this.#e;
	}
	addRow(e, t) {
		let n = this.#e.createChild("tr", "details-table-row");
		n.createChild("td").textContent = e;
		let r = n.createChild("td");
		typeof t == "string" ? r.textContent = t : r.appendChild(t);
	}
};
//#endregion
export { ue as SecurityModel, Ce as SecurityPanel };
