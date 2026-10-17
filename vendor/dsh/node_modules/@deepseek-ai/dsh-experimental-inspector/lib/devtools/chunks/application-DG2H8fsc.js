import { n as e } from "./rolldown-runtime-DF993M8W.js";
import { $ as t, B as n, D as r, Et as i, H as a, J as o, K as s, Q as c, U as l, Vt as u, W as d, X as ee, Zt as f, _ as p, b as te, h as ne, i as m, v as re, x as ie } from "./common-DMSVbaSb.js";
import { $i as h, $n as ae, Bc as g, C as oe, Cl as se, Dl as ce, Ds as le, Dt as ue, El as de, En as fe, Es as pe, Fo as _, G as me, Gc as he, Gl as ge, Hc as _e, Hi as ve, Hl as ye, Hr as be, I as xe, Id as Se, Io as Ce, Jc as we, Jl as Te, Jn as Ee, Jo as De, Kc as Oe, Ko as ke, L as Ae, La as je, Md as Me, Mo as v, Mp as Ne, Na as Pe, Nd as Fe, No as Ie, Ns as Le, Oc as Re, Os as ze, Pd as Be, Po as y, Q as Ve, Qi as He, R as Ue, Rc as We, Sp as Ge, U as Ke, Uc as qe, Ud as Je, Ur as Ye, Ut as Xe, Vo as Ze, Vr as Qe, Wc as $e, Wo as et, Wt as tt, Xi as nt, Xn as rt, Xr as it, Yc as at, Yd as ot, Yf as st, Yn as ct, Yo as lt, Yr as ut, Zd as dt, Zi as ft, Zn as pt, Zo as b, al as mt, an as ht, ar as gt, as as _t, bn as vt, bp as yt, br as bt, bt as xt, c as St, ci as Ct, dc as wt, dd as Tt, df as Et, dn as Dt, dp as Ot, ds as kt, ef as x, ei as S, er as At, fa as jt, fc as Mt, ff as Nt, fn as Pt, fo as Ft, fp as It, fs as Lt, g as Rt, go as zt, ha as Bt, hd as Vt, ho as Ht, i as Ut, ii as Wt, is as Gt, jd as C, jo as Kt, jr as qt, ka as Jt, kr as Yt, ll as Xt, ma as Zt, mo as Qt, n as $t, na as en, nf as w, ni as tn, nl as nn, no as T, ns as rn, o as an, of as on, oi as sn, or as cn, os as ln, pf as un, pi as dn, pn as fn, ps as E, qa as D, qc as pn, r as mn, rf as O, rs as hn, sf as k, sl as gn, sr as _n, ss as vn, t as yn, tr as bn, ts as xn, uf as Sn, uo as Cn, us as wn, vn as Tn, wn as En, wo as Dn, xl as On, xn as kn, y as An, yf as jn, yr as Mn, z as Nn, za as Pn, zc as Fn, zl as In } from "./legacy-dM_vujv7.js";
import { l as Ln, m as Rn, p as zn } from "./root-DdvV-xPu.js";
import "./platform-D4TUCh2P.js";
import { D as Bn, T as Vn, c as Hn, g as Un, o as Wn } from "./text_utils-DWSliayn.js";
import { I as Gn, P as Kn, c as qn, d as Jn, i as Yn, k as Xn } from "./StringUtilities-CMDxNrEc.js";
import { o as Zn, s as Qn } from "./FormatterActions-D6HaA-6R.js";
import { n as $n, t as er } from "./diff-DXcO6Sla.js";
import { B as tr, R as nr, o as rr, p as ir, s as ar, v as or, w as sr } from "./bindings-DyamxTH2.js";
import { C as cr, Vt as lr, o as ur, v as dr, w as fr } from "./common-Bs7hSOUj.js";
import { Ot as pr, Xt as mr, b as hr } from "./codemirror-CENmPHF2.js";
import { _ as gr, f as _r, g as vr, o as yr, s as br } from "./object_ui-Dj5WXMwl.js";
import { n as xr, t as Sr } from "./i18n-CTSaUtZW.js";
import { x as Cr } from "./text_editor-B6PKcoob.js";
import { t as wr } from "./StorageItem-_wZ3i4k_.js";
import { i as Tr, r as Er } from "./code_highlighter-CNBDhX-D.js";
import { t as Dr } from "./objectValue.css-JafYDKlR.js";
import "./icon_button-DGIafxYW.js";
import { n as Or } from "./issues_manager-Ba4w-pt1.js";
import { i as kr, n as Ar, t as jr } from "./UIFilter-CIzBruM3.js";
import { n as Mr, r as Nr } from "./UIRequestLocation-CtGcVN3I.js";
import "./request_link_icon-Do-M_Ngw.js";
import { c as Pr, l as Fr, s as Ir, u as Lr } from "./data_grid-C6uthMeA.js";
import { n as Rr } from "./settings_ui-B3VIsMZM.js";
import { t as zr } from "./textInput.css-Ca_GEU1S.js";
import "./components-ChzSxrwT.js";
import "./inline_editor-R0UzNzHT.js";
import { t as Br } from "./adorners-D4bF0Xzg.js";
import { l as Vr } from "./mobile_throttling-DGhe-4CD.js";
import { a as Hr, c as Ur, i as Wr, n as Gr, o as Kr, t as qr } from "./source_frame-B0odV5Nv.js";
import { c as Jr } from "./perf_ui-B15al1e8.js";
import { n as Yr, r as Xr, t as Zr } from "./helper-Cjm7Cg8b.js";
import { T as Qr, h as $r, x as ei } from "./network-CzcqMGwP.js";
import { a as ti, s as ni } from "./menus-CbHfE0QY.js";
import { i as ri, n as ii } from "./protocol_monitor-Ddc61xch.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/components/legacy_wrapper/LegacyWrapper.ts
var ai = class extends HTMLElement {
	wrapper = null;
	async render() {}
	wasShown() {}
	willHide() {}
};
function oi(e, t, n) {
	return new class extends e {
		#e;
		constructor(...e) {
			super(!0), this.#e = t, this.#e.wrapper = this, this.#e.render(), this.contentElement.appendChild(this.#e), n && this.element.setAttribute("jslog", `${D().context(n)}`);
		}
		wasShown() {
			super.wasShown(), this.#e.wasShown(), this.#e.render();
		}
		willHide() {
			super.willHide(), this.#e.willHide();
		}
		async performUpdate() {
			await this.#e.render();
		}
		getComponent() {
			return this.#e;
		}
	}();
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/application/ApplicationPanelTreeElement.ts
var A = class e extends Ut {
	resourcesPanel;
	customItemURL;
	constructor(e, t, n, r) {
		super(t, n, r), this.resourcesPanel = e, ue(this.listItemElement, t), this.listItemElement.tabIndex = -1;
	}
	deselect() {
		super.deselect(), this.listItemElement.tabIndex = -1;
	}
	get itemURL() {
		if (this.customItemURL) return this.customItemURL;
		throw Error("Unimplemented Method");
	}
	set itemURL(e) {
		this.customItemURL = e;
	}
	onselect(t) {
		if (!t) return !1;
		let n = [];
		for (let t = this; t; t = t.parent) {
			let r = t instanceof e && t.itemURL;
			if (!r) break;
			n.push(r);
		}
		return this.resourcesPanel.setLastSelectedItemPath(n), !1;
	}
	showView(e) {
		this.resourcesPanel.showView(e);
	}
}, si = class extends A {
	expandedSetting;
	categoryName;
	categoryLink;
	emptyCategoryHeadline;
	categoryDescription;
	constructor(e, t, n, r, i, a = !1) {
		super(e, t, !1, i), this.expandedSetting = m.instance().createSetting("resources-" + i + "-expanded", a), this.categoryName = t, this.categoryLink = null, this.emptyCategoryHeadline = n, this.categoryDescription = r;
	}
	get itemURL() {
		return "category://" + this.categoryName;
	}
	set itemURL(e) {
		super.itemURL = e;
	}
	setLink(e) {
		this.categoryLink = e;
	}
	onselect(e) {
		return super.onselect(e), this.updateCategoryView(), !1;
	}
	updateCategoryView() {
		let e = this.childCount() === 0 ? this.emptyCategoryHeadline : this.categoryName;
		this.resourcesPanel.showCategoryView(this.categoryName, e, this.categoryDescription, this.categoryLink);
	}
	appendChild(e, t) {
		super.appendChild(e, t), this.selected && this.childCount() === 1 && this.updateCategoryView();
	}
	removeChild(e) {
		super.removeChild(e), this.selected && this.childCount() === 0 && this.updateCategoryView();
	}
	onattach() {
		super.onattach(), this.expandedSetting.get() && this.expand();
	}
	onexpand() {
		this.expandedSetting.set(!0);
	}
	oncollapse() {
		this.expandedSetting.set(!1);
	}
}, ci = "/*\n * Copyright 2016 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n.report-field-name {\n  flex-basis: 152px;\n}\n\n.manifest-view-header {\n  min-width: 600px;\n  flex-shrink: 0;\n  flex-grow: 0;\n}\n\n:host {\n  overflow: auto;\n}\n\n.inline-icon {\n  width: 16px;\n  height: 16px;\n  margin-inline: var(--sys-size-3);\n\n  &[name=\"check-circle\"] {\n    color: var(--icon-checkmark-green);\n  }\n}\n\n.multiline-value {\n  padding-top: var(--sys-size-5);\n  white-space: normal;\n}\n\nselect {\n  margin: 4px;\n}\n\n.inline-button {\n  vertical-align: sub;\n}\n\ndevtools-report .report-row {\n  margin: var(--sys-size-3) 0 var(--sys-size-3) var(--sys-size-9);\n  grid-column: 1 / 3;\n\n  > devtools-checkbox:first-child {\n    margin-left: calc(var(--sys-size-4) * -1);\n  }\n\n  > devtools-icon:first-child {\n    /* We have inline icons that would otherwise be mis-aligned */\n    margin-inline-start: 0;\n  }\n}\n\ndevtools-report .report-section {\n  display: grid;\n  grid-column: 1 / 3;\n  grid-template-columns: subgrid;\n  padding-bottom: var(--sys-size-5);\n  border-bottom: 1px solid var(--sys-color-divider);\n  margin-bottom: var(--sys-size-5);\n}\n\n.image-wrapper,\n.image-wrapper img {\n  max-width: 200px;\n  max-height: 200px;\n  display: block;\n  object-fit: contain;\n}\n\n.image-wrapper {\n  display: inline-block;\n  height: fit-content;\n  margin-right: 8px;\n}\n\n.show-mask img {\n  /* The safe zone is a centrally positioned circle, with radius 2/5\n  * (40%) of the minimum of the icon's width and height.\n  * https://w3c.github.io/manifest/#icon-masks */\n  clip-path: circle(40% at 50% 50%);\n}\n\n.show-mask .image-wrapper {\n  background: var(--image-file-checker);\n}\n", li = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  overflow: hidden;\n}\n\ndiv {\n  line-height: 1.7em;\n}\n\n.arrow-icon-button {\n  cursor: pointer;\n  padding: 1px 0;\n  border: none;\n  background: none;\n  margin-right: 2px;\n}\n\n.arrow-icon {\n  display: inline-block;\n  mask-image: var(--image-file-triangle-right);\n  background-color: var(--icon-default);\n  margin-top: 2px;\n  height: 14px;\n  width: 14px;\n  transition: transform 200ms;\n}\n\n.arrow-icon.expanded {\n  transform: rotate(90deg);\n}\n\n.expandable-list-container {\n  display: flex;\n  margin-top: 4px;\n}\n\n.expandable-list-items {\n  overflow: hidden;\n}\n\n.link,\n.devtools-link {\n  color: var(--sys-color-primary);\n  text-decoration: underline;\n  cursor: pointer;\n  outline-offset: 2px;\n  border: none;\n  background: none;\n  font-family: inherit;\n  font-size: var(--sys-size-6);\n\n  &:focus-visible {\n    outline: 2px solid var(--sys-color-state-focus-ring);\n    outline-offset: 0;\n    border-radius: var(--sys-shape-corner-extra-small);\n  }\n}\n\nbutton.link {\n  border: none;\n  background: none;\n  font-family: inherit;\n  font-size: inherit;\n}\n\n.text-ellipsis {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n", { html: ui, Directives: { ifDefined: di } } = Ie, fi = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t = !1;
	#n = [];
	#r;
	set data(e) {
		this.#n = e.rows, this.#r = e.title, this.#a();
	}
	#i() {
		this.#t = !this.#t, this.#a();
	}
	#a() {
		this.#n.length < 1 || _(ui`
      <style>${li}</style>
      <div class="expandable-list-container">
        <div>
          ${this.#n.length > 1 ? ui`
              <button title=${di(this.#r)} aria-label=${di(this.#r)} aria-expanded=${this.#t ? "true" : "false"} @click=${() => this.#i()} class="arrow-icon-button">
                <span class="arrow-icon ${this.#t ? "expanded" : ""}"
                jslog=${Pe().track({ click: !0 })}></span>
              </button>
            ` : b}
        </div>
        <div class="expandable-list-items">
          ${this.#n.filter((e, t) => this.#t || t === 0).map((e) => ui`
            ${e}
          `)}
        </div>
      </div>
    `, this.#e, { host: this });
	}
};
customElements.define("devtools-expandable-list", fi);
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/application/components/BackForwardCacheStrings.ts
var j = {
	notMainFrame: "Navigation happened in a frame other than the main frame.",
	backForwardCacheDisabled: "Back/forward cache is disabled by flags. Visit chrome://flags/#back-forward-cache to enable it locally on this device.",
	relatedActiveContentsExist: "The page was opened using '`window.open()`' and another tab has a reference to it, or the page opened a window.",
	HTTPStatusNotOK: "Only pages with a status code of 2XX can be cached.",
	schemeNotHTTPOrHTTPS: "Only pages whose URL scheme is HTTP / HTTPS can be cached.",
	loading: "The page did not finish loading before navigating away.",
	wasGrantedMediaAccess: "Pages that have granted access to record video or audio are not currently eligible for back/forward cache.",
	HTTPMethodNotGET: "Only pages loaded via a GET request are eligible for back/forward cache.",
	subframeIsNavigating: "An iframe on the page started a navigation that did not complete.",
	timeout: "The page exceeded the maximum time in back/forward cache and was expired.",
	cacheLimit: "The page was evicted from the cache to allow another page to be cached.",
	JavaScriptExecution: "Chrome detected an attempt to execute JavaScript while in the cache.",
	rendererProcessKilled: "The renderer process for the page in back/forward cache was killed.",
	rendererProcessCrashed: "The renderer process for the page in back/forward cache crashed.",
	grantedMediaStreamAccess: "Pages that have granted media stream access are not currently eligible for back/forward cache.",
	cacheFlushed: "The cache was intentionally cleared.",
	serviceWorkerVersionActivation: "The page was evicted from back/forward cache due to a service worker activation.",
	sessionRestored: "Chrome restarted and cleared the back/forward cache entries.",
	serviceWorkerPostMessage: "A service worker attempted to send the page in back/forward cache a `MessageEvent`.",
	enteredBackForwardCacheBeforeServiceWorkerHostAdded: "A service worker was activated while the page was in back/forward cache.",
	serviceWorkerClaim: "The page was claimed by a service worker while it is in back/forward cache.",
	haveInnerContents: "Pages that have certain kinds of embedded content (e.g. PDFs) are not currently eligible for back/forward cache.",
	timeoutPuttingInCache: "The page timed out entering back/forward cache (likely due to long-running pagehide handlers).",
	backForwardCacheDisabledByLowMemory: "Back/forward cache is disabled due to insufficient memory.",
	backForwardCacheDisabledByCommandLine: "Back/forward cache is disabled by the command line.",
	networkRequestDatapipeDrainedAsBytesConsumer: "Pages that have inflight fetch() or XHR are not currently eligible for back/forward cache.",
	networkRequestRedirected: "The page was evicted from back/forward cache because an active network request involved a redirect.",
	networkRequestTimeout: "The page was evicted from the cache because a network connection was open too long. Chrome limits the amount of time that a page may receive data while cached.",
	networkExceedsBufferLimit: "The page was evicted from the cache because an active network connection received too much data. Chrome limits the amount of data that a page may receive while cached.",
	navigationCancelledWhileRestoring: "Navigation was cancelled before the page could be restored from back/forward cache.",
	backForwardCacheDisabledForPrerender: "Back/forward cache is disabled for prerenderer.",
	userAgentOverrideDiffers: "Browser has changed the user agent override header.",
	foregroundCacheLimit: "The page was evicted from the cache to allow another page to be cached.",
	backForwardCacheDisabledForDelegate: "Back/forward cache is not supported by delegate.",
	unloadHandlerExistsInMainFrame: "The page has an unload handler in the main frame.",
	unloadHandlerExistsInSubFrame: "The page has an unload handler in a sub frame.",
	serviceWorkerUnregistration: "ServiceWorker was unregistered while a page was in back/forward cache.",
	noResponseHead: "Pages that do not have a valid response head cannot enter back/forward cache.",
	cacheControlNoStore: "Pages with cache-control:no-store header cannot enter back/forward cache.",
	ineligibleAPI: "Ineligible APIs were used.",
	internalError: "Internal error.",
	webSocket: "Pages with WebSocket cannot enter back/forward cache.",
	webTransport: "Pages with WebTransport cannot enter back/forward cache.",
	webRTC: "Pages with WebRTC cannot enter back/forward cache.",
	mainResourceHasCacheControlNoStore: "Pages whose main resource has cache-control:no-store cannot enter back/forward cache.",
	mainResourceHasCacheControlNoCache: "Pages whose main resource has cache-control:no-cache cannot enter back/forward cache.",
	subresourceHasCacheControlNoStore: "Pages whose subresource has cache-control:no-store cannot enter back/forward cache.",
	subresourceHasCacheControlNoCache: "Pages whose subresource has cache-control:no-cache cannot enter back/forward cache.",
	containsPlugins: "Pages containing plugins are not currently eligible for back/forward cache.",
	documentLoaded: "The document did not finish loading before navigating away.",
	dedicatedWorkerOrWorklet: "Pages that use a dedicated worker or worklet are not currently eligible for back/forward cache.",
	outstandingNetworkRequestOthers: "Pages with an in-flight network request are not currently eligible for back/forward cache.",
	outstandingIndexedDBTransaction: "Page with ongoing indexed DB transactions are not currently eligible for back/forward cache.",
	requestedNotificationsPermission: "Pages that have requested notifications permissions are not currently eligible for back/forward cache.",
	requestedMIDIPermission: "Pages that have requested MIDI permissions are not currently eligible for back/forward cache.",
	requestedAudioCapturePermission: "Pages that have requested audio capture permissions are not currently eligible for back/forward cache.",
	requestedVideoCapturePermission: "Pages that have requested video capture permissions are not currently eligible for back/forward cache.",
	requestedBackForwardCacheBlockedSensors: "Pages that have requested sensor permissions are not currently eligible for back/forward cache.",
	requestedBackgroundWorkPermission: "Pages that have requested background sync or fetch permissions are not currently eligible for back/forward cache.",
	broadcastChannel: "The page cannot be cached because it has a BroadcastChannel instance with registered listeners.",
	indexedDBConnection: "Pages that have an open IndexedDB connection are not currently eligible for back/forward cache.",
	webXR: "Pages that use WebXR are not currently eligible for back/forward cache.",
	sharedWorker: "Pages that use SharedWorker are not currently eligible for back/forward cache.",
	sharedWorkerMessage: "The page was evicted from the cache because it received a message from a SharedWorker",
	webLocks: "Pages that use WebLocks are not currently eligible for back/forward cache.",
	webHID: "Pages that use WebHID are not currently eligible for back/forward cache.",
	webShare: "Pages that use WebShare are not currently eligible for back/forwad cache.",
	requestedStorageAccessGrant: "Pages that have requested storage access are not currently eligible for back/forward cache.",
	webNfc: "Pages that use WebNfc are not currently eligible for back/forwad cache.",
	outstandingNetworkRequestFetch: "Pages with an in-flight fetch network request are not currently eligible for back/forward cache.",
	outstandingNetworkRequestXHR: "Pages with an in-flight XHR network request are not currently eligible for back/forward cache.",
	appBanner: "Pages that requested an AppBanner are not currently eligible for back/forward cache.",
	printing: "Pages that show Printing UI are not currently eligible for back/forward cache.",
	webDatabase: "Pages that use WebDatabase are not currently eligible for back/forward cache.",
	pictureInPicture: "Pages that use Picture-in-Picture are not currently eligible for back/forward cache.",
	speechRecognizer: "Pages that use SpeechRecognizer are not currently eligible for back/forward cache.",
	idleManager: "Pages that use IdleManager are not currently eligible for back/forward cache.",
	paymentManager: "Pages that use PaymentManager are not currently eligible for back/forward cache.",
	speechSynthesis: "Pages that use SpeechSynthesis are not currently eligible for back/forward cache.",
	keyboardLock: "Pages that use Keyboard lock are not currently eligible for back/forward cache.",
	webOTPService: "Pages that use WebOTPService are not currently eligible for bfcache.",
	outstandingNetworkRequestDirectSocket: "Pages with an in-flight network request are not currently eligible for back/forward cache.",
	injectedJavascript: "Pages that `JavaScript` is injected into by extensions are not currently eligible for back/forward cache.",
	injectedStyleSheet: "Pages that a `StyleSheet` is injected into by extensions are not currently eligible for back/forward cache.",
	contentDiscarded: "Undefined",
	contentSecurityHandler: "Pages that use SecurityHandler are not eligible for back/forward cache.",
	contentWebAuthenticationAPI: "Pages that use WebAuthetication API are not eligible for back/forward cache.",
	contentFileChooser: "Pages that use FileChooser API are not eligible for back/forward cache.",
	contentSerial: "Pages that use Serial API are not eligible for back/forward cache.",
	contentFileSystemAccess: "Pages that use File System Access API are not eligible for back/forward cache.",
	contentMediaDevicesDispatcherHost: "Pages that use Media Device Dispatcher are not eligible for back/forward cache.",
	contentWebBluetooth: "Pages that use WebBluetooth API are not eligible for back/forward cache.",
	contentWebUSB: "Pages that use WebUSB API are not eligible for back/forward cache.",
	contentMediaSession: "Pages that use MediaSession API and set a playback state are not eligible for back/forward cache.",
	contentMediaSessionService: "Pages that use MediaSession API and set action handlers are not eligible for back/forward cache.",
	contentMediaPlay: "A media player was playing upon navigating away.",
	contentScreenReader: "Back/forward cache is disabled due to screen reader.",
	embedderPopupBlockerTabHelper: "Popup blocker was present upon navigating away.",
	embedderSafeBrowsingTriggeredPopupBlocker: "Safe Browsing considered this page to be abusive and blocked popup.",
	embedderSafeBrowsingThreatDetails: "Safe Browsing details were shown upon navigating away.",
	embedderAppBannerManager: "App Banner was present upon navigating away.",
	embedderDomDistillerViewerSource: "DOM Distiller Viewer was present upon navigating away.",
	embedderDomDistillerSelfDeletingRequestDelegate: "DOM distillation was in progress upon navigating away.",
	embedderOomInterventionTabHelper: "Out-Of-Memory Intervention bar was present upon navigating away.",
	embedderOfflinePage: "The offline page was shown upon navigating away.",
	embedderChromePasswordManagerClientBindCredentialManager: "Chrome Password Manager was present upon navigating away.",
	embedderPermissionRequestManager: "There were permission requests upon navigating away.",
	embedderModalDialog: "Modal dialog such as form resubmission or http password dialog was shown for the page upon navigating away.",
	embedderExtensions: "Back/forward cache is disabled due to extensions.",
	embedderExtensionMessaging: "Back/forward cache is disabled due to extensions using messaging API.",
	embedderExtensionMessagingForOpenPort: "Extensions with long-lived connection should close the connection before entering back/forward cache.",
	embedderExtensionSentMessageToCachedFrame: "Extensions with long-lived connection attempted to send messages to frames in back/forward cache.",
	errorDocument: "Back/forward cache is disabled due to a document error.",
	fencedFramesEmbedder: "Pages using FencedFrames cannot be stored in bfcache.",
	keepaliveRequest: "Back/forward cache is disabled due to a keepalive request.",
	jsNetworkRequestReceivedCacheControlNoStoreResource: "Back/forward cache is disabled because some JavaScript network request received resource with `Cache-Control: no-store` header.",
	indexedDBEvent: "Back/forward cache is disabled due to an IndexedDB event.",
	cookieDisabled: "Back/forward cache is disabled because cookies are disabled on a page that uses `Cache-Control: no-store`.",
	webRTCUsedWithCCNS: "Back/forward cache is disabled because WebRTC has been used.",
	webTransportUsedWithCCNS: "Back/forward cache is disabled because WebTransport has been used.",
	webSocketUsedWithCCNS: "Back/forward cache is disabled because WebSocket has been used."
}, pi = s("panels/application/components/BackForwardCacheStrings.ts", j), M = n.bind(void 0, pi), mi = {
	NotPrimaryMainFrame: { name: M(j.notMainFrame) },
	BackForwardCacheDisabled: { name: M(j.backForwardCacheDisabled) },
	RelatedActiveContentsExist: { name: M(j.relatedActiveContentsExist) },
	HTTPStatusNotOK: { name: M(j.HTTPStatusNotOK) },
	SchemeNotHTTPOrHTTPS: { name: M(j.schemeNotHTTPOrHTTPS) },
	Loading: { name: M(j.loading) },
	WasGrantedMediaAccess: { name: M(j.wasGrantedMediaAccess) },
	HTTPMethodNotGET: { name: M(j.HTTPMethodNotGET) },
	SubframeIsNavigating: { name: M(j.subframeIsNavigating) },
	Timeout: { name: M(j.timeout) },
	CacheLimit: { name: M(j.cacheLimit) },
	JavaScriptExecution: { name: M(j.JavaScriptExecution) },
	RendererProcessKilled: { name: M(j.rendererProcessKilled) },
	RendererProcessCrashed: { name: M(j.rendererProcessCrashed) },
	GrantedMediaStreamAccess: { name: M(j.grantedMediaStreamAccess) },
	CacheFlushed: { name: M(j.cacheFlushed) },
	ServiceWorkerVersionActivation: { name: M(j.serviceWorkerVersionActivation) },
	SessionRestored: { name: M(j.sessionRestored) },
	ServiceWorkerPostMessage: { name: M(j.serviceWorkerPostMessage) },
	EnteredBackForwardCacheBeforeServiceWorkerHostAdded: { name: M(j.enteredBackForwardCacheBeforeServiceWorkerHostAdded) },
	ServiceWorkerClaim: { name: M(j.serviceWorkerClaim) },
	HaveInnerContents: { name: M(j.haveInnerContents) },
	TimeoutPuttingInCache: { name: M(j.timeoutPuttingInCache) },
	BackForwardCacheDisabledByLowMemory: { name: M(j.backForwardCacheDisabledByLowMemory) },
	BackForwardCacheDisabledByCommandLine: { name: M(j.backForwardCacheDisabledByCommandLine) },
	NetworkRequestDatapipeDrainedAsBytesConsumer: { name: M(j.networkRequestDatapipeDrainedAsBytesConsumer) },
	NetworkRequestRedirected: { name: M(j.networkRequestRedirected) },
	NetworkRequestTimeout: { name: M(j.networkRequestTimeout) },
	NetworkExceedsBufferLimit: { name: M(j.networkExceedsBufferLimit) },
	NavigationCancelledWhileRestoring: { name: M(j.navigationCancelledWhileRestoring) },
	BackForwardCacheDisabledForPrerender: { name: M(j.backForwardCacheDisabledForPrerender) },
	UserAgentOverrideDiffers: { name: M(j.userAgentOverrideDiffers) },
	ForegroundCacheLimit: { name: M(j.foregroundCacheLimit) },
	BackForwardCacheDisabledForDelegate: { name: M(j.backForwardCacheDisabledForDelegate) },
	UnloadHandlerExistsInMainFrame: { name: M(j.unloadHandlerExistsInMainFrame) },
	UnloadHandlerExistsInSubFrame: { name: M(j.unloadHandlerExistsInSubFrame) },
	ServiceWorkerUnregistration: { name: M(j.serviceWorkerUnregistration) },
	NoResponseHead: { name: M(j.noResponseHead) },
	CacheControlNoStore: { name: M(j.cacheControlNoStore) },
	CacheControlNoStoreCookieModified: { name: M(j.cacheControlNoStore) },
	CacheControlNoStoreHTTPOnlyCookieModified: { name: M(j.cacheControlNoStore) },
	DisableForRenderFrameHostCalled: { name: M(j.ineligibleAPI) },
	BlocklistedFeatures: { name: M(j.ineligibleAPI) },
	SchedulerTrackedFeatureUsed: { name: M(j.ineligibleAPI) },
	DomainNotAllowed: { name: M(j.internalError) },
	ConflictingBrowsingInstance: { name: M(j.internalError) },
	NotMostRecentNavigationEntry: { name: M(j.internalError) },
	IgnoreEventAndEvict: { name: M(j.internalError) },
	BrowsingInstanceNotSwapped: { name: M(j.internalError) },
	ActivationNavigationsDisallowedForBug1234857: { name: M(j.internalError) },
	Unknown: { name: M(j.internalError) },
	RenderFrameHostReused_SameSite: { name: M(j.internalError) },
	RenderFrameHostReused_CrossSite: { name: M(j.internalError) },
	WebSocket: { name: M(j.webSocket) },
	WebTransport: { name: M(j.webTransport) },
	WebRTC: { name: M(j.webRTC) },
	MainResourceHasCacheControlNoStore: { name: M(j.mainResourceHasCacheControlNoStore) },
	MainResourceHasCacheControlNoCache: { name: M(j.mainResourceHasCacheControlNoCache) },
	SubresourceHasCacheControlNoStore: { name: M(j.subresourceHasCacheControlNoStore) },
	SubresourceHasCacheControlNoCache: { name: M(j.subresourceHasCacheControlNoCache) },
	ContainsPlugins: { name: M(j.containsPlugins) },
	DocumentLoaded: { name: M(j.documentLoaded) },
	DedicatedWorkerOrWorklet: { name: M(j.dedicatedWorkerOrWorklet) },
	OutstandingNetworkRequestOthers: { name: M(j.outstandingNetworkRequestOthers) },
	OutstandingIndexedDBTransaction: { name: M(j.outstandingIndexedDBTransaction) },
	RequestedNotificationsPermission: { name: M(j.requestedNotificationsPermission) },
	RequestedMIDIPermission: { name: M(j.requestedMIDIPermission) },
	RequestedAudioCapturePermission: { name: M(j.requestedAudioCapturePermission) },
	RequestedVideoCapturePermission: { name: M(j.requestedVideoCapturePermission) },
	RequestedBackForwardCacheBlockedSensors: { name: M(j.requestedBackForwardCacheBlockedSensors) },
	RequestedBackgroundWorkPermission: { name: M(j.requestedBackgroundWorkPermission) },
	BroadcastChannel: { name: M(j.broadcastChannel) },
	IndexedDBConnection: { name: M(j.indexedDBConnection) },
	WebXR: { name: M(j.webXR) },
	SharedWorker: { name: M(j.sharedWorker) },
	SharedWorkerMessage: { name: M(j.sharedWorkerMessage) },
	WebLocks: { name: M(j.webLocks) },
	WebHID: { name: M(j.webHID) },
	WebShare: { name: M(j.webShare) },
	RequestedStorageAccessGrant: { name: M(j.requestedStorageAccessGrant) },
	WebNfc: { name: M(j.webNfc) },
	OutstandingNetworkRequestFetch: { name: M(j.outstandingNetworkRequestFetch) },
	OutstandingNetworkRequestXHR: { name: M(j.outstandingNetworkRequestXHR) },
	AppBanner: { name: M(j.appBanner) },
	Printing: { name: M(j.printing) },
	WebDatabase: { name: M(j.webDatabase) },
	PictureInPicture: { name: M(j.pictureInPicture) },
	SpeechRecognizer: { name: M(j.speechRecognizer) },
	IdleManager: { name: M(j.idleManager) },
	PaymentManager: { name: M(j.paymentManager) },
	SpeechSynthesis: { name: M(j.speechSynthesis) },
	KeyboardLock: { name: M(j.keyboardLock) },
	WebOTPService: { name: M(j.webOTPService) },
	OutstandingNetworkRequestDirectSocket: { name: M(j.outstandingNetworkRequestDirectSocket) },
	InjectedJavascript: { name: M(j.injectedJavascript) },
	InjectedStyleSheet: { name: M(j.injectedStyleSheet) },
	Dummy: { name: M(j.internalError) },
	ContentDiscarded: { name: M(j.contentDiscarded) },
	ContentSecurityHandler: { name: M(j.contentSecurityHandler) },
	ContentWebAuthenticationAPI: { name: M(j.contentWebAuthenticationAPI) },
	ContentFileChooser: { name: M(j.contentFileChooser) },
	ContentSerial: { name: M(j.contentSerial) },
	ContentFileSystemAccess: { name: M(j.contentFileSystemAccess) },
	ContentMediaDevicesDispatcherHost: { name: M(j.contentMediaDevicesDispatcherHost) },
	ContentWebBluetooth: { name: M(j.contentWebBluetooth) },
	ContentWebUSB: { name: M(j.contentWebUSB) },
	ContentMediaSession: { name: M(j.contentMediaSession) },
	ContentMediaSessionService: { name: M(j.contentMediaSessionService) },
	ContentMediaPlay: { name: M(j.contentMediaPlay) },
	ContentScreenReader: { name: M(j.contentScreenReader) },
	EmbedderPopupBlockerTabHelper: { name: M(j.embedderPopupBlockerTabHelper) },
	EmbedderSafeBrowsingTriggeredPopupBlocker: { name: M(j.embedderSafeBrowsingTriggeredPopupBlocker) },
	EmbedderSafeBrowsingThreatDetails: { name: M(j.embedderSafeBrowsingThreatDetails) },
	EmbedderAppBannerManager: { name: M(j.embedderAppBannerManager) },
	EmbedderDomDistillerViewerSource: { name: M(j.embedderDomDistillerViewerSource) },
	EmbedderDomDistillerSelfDeletingRequestDelegate: { name: M(j.embedderDomDistillerSelfDeletingRequestDelegate) },
	EmbedderOomInterventionTabHelper: { name: M(j.embedderOomInterventionTabHelper) },
	EmbedderOfflinePage: { name: M(j.embedderOfflinePage) },
	EmbedderChromePasswordManagerClientBindCredentialManager: { name: M(j.embedderChromePasswordManagerClientBindCredentialManager) },
	EmbedderPermissionRequestManager: { name: M(j.embedderPermissionRequestManager) },
	EmbedderModalDialog: { name: M(j.embedderModalDialog) },
	EmbedderExtensions: { name: M(j.embedderExtensions) },
	EmbedderExtensionMessaging: { name: M(j.embedderExtensionMessaging) },
	EmbedderExtensionMessagingForOpenPort: { name: M(j.embedderExtensionMessagingForOpenPort) },
	EmbedderExtensionSentMessageToCachedFrame: { name: M(j.embedderExtensionSentMessageToCachedFrame) },
	ErrorDocument: { name: M(j.errorDocument) },
	FencedFramesEmbedder: { name: M(j.fencedFramesEmbedder) },
	KeepaliveRequest: { name: M(j.keepaliveRequest) },
	JsNetworkRequestReceivedCacheControlNoStoreResource: { name: M(j.jsNetworkRequestReceivedCacheControlNoStoreResource) },
	IndexedDBEvent: { name: M(j.indexedDBEvent) },
	CookieDisabled: { name: M(j.cookieDisabled) },
	WebRTCUsedWithCCNS: { name: M(j.webRTCUsedWithCCNS) },
	WebTransportUsedWithCCNS: { name: M(j.webTransportUsedWithCCNS) },
	WebSocketUsedWithCCNS: { name: M(j.webSocketUsedWithCCNS) },
	HTTPAuthRequired: { name: l("HTTPAuthRequired") },
	CookieFlushed: { name: l("CookieFlushed") },
	SmartCard: { name: l("SmartCard") },
	LiveMediaStreamTrack: { name: l("LiveMediaStreamTrack") },
	UnloadHandler: { name: l("UnloadHandler") },
	ParserAborted: { name: l("ParserAborted") },
	BroadcastChannelOnMessage: { name: l("BroadcastChannelOnMessage") },
	RequestedByWebViewClient: { name: l("RequestedByWebViewClient") },
	PostMessageByWebViewClient: { name: l("PostMessageByWebViewClient") },
	WebViewSettingsChanged: { name: l("WebViewSettingsChanged") },
	WebViewJavaScriptObjectChanged: { name: l("WebViewJavaScriptObjectChanged") },
	WebViewMessageListenerInjected: { name: l("WebViewMessageListenerInjected") },
	WebViewSafeBrowsingAllowlistChanged: { name: l("WebViewSafeBrowsingAllowlistChanged") },
	WebViewDocumentStartJavascriptChanged: { name: l("WebViewDocumentStartJavascriptChanged") },
	CacheControlNoStoreDeviceBoundSessionTerminated: { name: M(j.cacheControlNoStore) },
	CacheLimitPrunedOnModerateMemoryPressure: { name: l("CacheLimitPrunedOnModerateMemoryPressure") },
	CacheLimitPrunedOnCriticalMemoryPressure: { name: l("CacheLimitPrunedOnCriticalMemoryPressure") }
}, hi = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  overflow: auto;\n}\n\ndevtools-report-value {\n  overflow: hidden;\n}\n\n.inline-icon {\n  vertical-align: sub;\n}\n\n.gray-text {\n  color: var(--sys-color-token-subtle);\n  margin: 0 0 5px 56px;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  flex: auto;\n  overflow-wrap: break-word;\n  overflow: hidden;\n  grid-column-start: span 2;\n}\n\n.details-list {\n  margin-left: 56px;\n  grid-column-start: span 2;\n}\n\n.help-outline-icon {\n  margin: 0 2px;\n}\n\n.circled-exclamation-icon {\n  margin-right: 10px;\n  flex-shrink: 0;\n}\n\n.status {\n  margin-right: 11px;\n  flex-shrink: 0;\n}\n\n.report-line {\n  grid-column-start: span 2;\n  display: flex;\n  align-items: center;\n  margin: 0 30px;\n  line-height: 26px;\n}\n\n.report-key {\n  color: var(--sys-color-token-subtle);\n  min-width: auto;\n  overflow-wrap: break-word;\n  align-self: start;\n}\n\n.report-value {\n  padding: 0 6px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.link,\n.devtools-link {\n  color: var(--sys-color-primary);\n  text-decoration: underline;\n  cursor: pointer;\n  outline-offset: 2px;\n}\n\ndevtools-report-value:has(devtools-tree-outline) {\n  margin-left: var(--sys-size-7);\n}\n\n.cache-status-section:focus-visible {\n outline: 0;\n}\n\n.tree-outline li .selection {\n  margin-left: -5px;\n}\n\n@media (forced-colors: active) {\n  .link,\n  .devtools-link {\n    color: linktext;\n    text-decoration-color: linktext;\n  }\n}\n", gi = /* @__PURE__ */ e({ BackForwardCacheView: () => ji }), N = {
	mainFrame: "Main Frame",
	backForwardCacheTitle: "Back/forward cache",
	unavailable: "unavailable",
	url: "URL",
	unknown: "Unknown Status",
	normalNavigation: "Not served from back/forward cache: to trigger back/forward cache, use Chrome's back/forward buttons, or use the test button below to automatically navigate away and back.",
	restoredFromBFCache: "Successfully served from back/forward cache.",
	pageSupportNeeded: "Actionable",
	testCompleted: "Back/forward cache test completed.",
	pageSupportNeededExplanation: "These reasons are actionable i.e. they can be cleaned up to make the page eligible for back/forward cache.",
	circumstantial: "Not Actionable",
	circumstantialExplanation: "These reasons are not actionable i.e. caching was prevented by something outside of the direct control of the page.",
	supportPending: "Pending Support",
	runTest: "Test back/forward cache",
	runningTest: "Running test",
	learnMore: "Learn more: back/forward cache eligibility",
	neverUseUnload: "Learn more: Never use unload handler",
	supportPendingExplanation: "Chrome support for these reasons is pending i.e. they will not prevent the page from being eligible for back/forward cache in a future version of Chrome.",
	blockingExtensionId: "Extension id: ",
	framesTitle: "Frames",
	issuesInSingleFrame: "{n, plural, =1 {# issue found in 1 frame.} other {# issues found in 1 frame.}}",
	issuesInMultipleFrames: "{n, plural, =1 {# issue found in {m} frames.} other {# issues found in {m} frames.}}",
	framesPerIssue: "{n, plural, =1 {# frame} other {# frames}}",
	blankURLTitle: "Blank URL [{PH1}]",
	filesPerIssue: "{n, plural, =1 {# file} other {# files}}"
}, _i = s("panels/application/components/BackForwardCacheView.ts", N), vi = a.bind(void 0, _i), { widget: yi } = Wt;
function bi(e, t, n, r, i) {
	if (!e) return y`
      <devtools-report-key>
        ${vi(N.mainFrame)}
      </devtools-report-key>
      <devtools-report-value>
        ${vi(N.unavailable)}
      </devtools-report-value>`;
	let a = r === "Running", o = te(e.url, "devtools:");
	return y`
    ${Si(e.backForwardCacheDetails.restoredFromCache)}
    <devtools-report-key>${vi(N.url)}</devtools-report-key>
    <devtools-report-value>${e.url}</devtools-report-value>
    ${xi(t)}
    <devtools-report-section>
      <devtools-button
        aria-label=${vi(N.runTest)}
        .disabled=${a || o}
        .spinner=${a}
        .variant=${h.PRIMARY}
        @click=${i}
        jslog=${Bt("back-forward-cache.run-test").track({ click: !0 })}>
        ${a ? y`
          ${vi(N.runningTest)}` : `
          ${vi(N.runTest)}
        `}
      </devtools-button>
    </devtools-report-section>
    <devtools-report-divider>
    </devtools-report-divider>
    ${Ci(e.backForwardCacheDetails.explanations, e.backForwardCacheDetails.explanationsTree, n)}
    <devtools-report-section>
      <devtools-link href="https://web.dev/bfcache/" class="link"
      jslogcontext="learn-more.eligibility">
        ${vi(N.learnMore)}
      </devtools-link>
    </devtools-report-section>`;
}
function xi(e) {
	if (!e || e.frameCount === 0 && e.issueCount === 0) return b;
	function t(e) {
		return y`
      <li role="treeitem" class="text-ellipsis">
        ${e.iconName ? y`
          <devtools-icon class="inline-icon extra-large" .name=${e.iconName} style="margin-bottom: -3px;">
          </devtools-icon>
        ` : b}
        ${e.text}
        ${e.children?.length ? y`
          <ul role="group">
            ${e.children.map((e) => t(e))}
          </ul>` : b}
      </li>`;
	}
	let n = "";
	return n = e.frameCount === 1 ? vi(N.issuesInSingleFrame, { n: e.issueCount }) : vi(N.issuesInMultipleFrames, {
		n: e.issueCount,
		m: e.frameCount
	}), y`
    <devtools-report-key jslog=${T("frames")}>${vi(N.framesTitle)}</devtools-report-key>
    <devtools-report-value>
      <devtools-tree .template=${y`
        <ul role="tree">
          <li role="treeitem" class="text-ellipsis">
            ${n}
            <ul role="group">
              ${t(e.node)}
            </ul>
          </li>
        </ul>
      `}>
      </devtools-tree>
    </devtools-report-value>`;
}
function Si(e) {
	switch (e) {
		case !0: return y`
        <devtools-report-section autofocus tabindex="-1">
          <div class="status extra-large">
            <devtools-icon class="inline-icon extra-large" name="check-circle" style="color: var(--icon-checkmark-green);">
            </devtools-icon>
          </div>
          ${vi(N.restoredFromBFCache)}
        </devtools-report-section>`;
		case !1: return y`
        <devtools-report-section autofocus tabindex="-1">
          <div class="status">
            <devtools-icon class="inline-icon extra-large" name="clear">
            </devtools-icon>
          </div>
          ${vi(N.normalNavigation)}
        </devtools-report-section>`;
	}
	return y`
    <devtools-report-section autofocus tabindex="-1">
      ${vi(N.unknown)}
    </devtools-report-section>`;
}
function Ci(e, t, n) {
	if (e.length === 0) return b;
	let r = e.filter((e) => e.type === w.BackForwardCacheNotRestoredReasonType.PageSupportNeeded), i = e.filter((e) => e.type === w.BackForwardCacheNotRestoredReasonType.SupportPending), a = e.filter((e) => e.type === w.BackForwardCacheNotRestoredReasonType.Circumstantial);
	return y`
    ${wi(vi(N.pageSupportNeeded), vi(N.pageSupportNeededExplanation), r, n)}
    ${wi(vi(N.supportPending), vi(N.supportPendingExplanation), i, n)}
    ${wi(vi(N.circumstantial), vi(N.circumstantialExplanation), a, n)}`;
}
function wi(e, t, n, r) {
	return y`
    ${n.length > 0 ? y`
      <devtools-report-section-header>
        ${e}
        <div class="help-outline-icon">
          <devtools-icon class="inline-icon medium" name="help" title=${t}>
          </devtools-icon>
        </div>
      </devtools-report-section-header>
      ${n.map((e) => ki(e, r.get(e.reason)))}
    ` : b}`;
}
function Ti(e) {
	if (e.reason === w.BackForwardCacheNotRestoredReason.EmbedderExtensionSentMessageToCachedFrame && e.context) {
		let t = "chrome://extensions/?id=" + e.context;
		return y`${vi(N.blockingExtensionId)}
      <devtools-link .href=${t}>${e.context}</devtools-link>`;
	}
	return b;
}
function Ei(e) {
	if (e === void 0 || e.length === 0) return b;
	let t = [y`<div>${vi(N.framesPerIssue, { n: e.length })}</div>`];
	return t.push(...e.map((e) => y`<div class="text-ellipsis" title=${e}
    jslog=${zt().track({ resize: !0 })}>${e}</div>`)), y`
      <div class="details-list"
      jslog=${Ht("frames-per-issue")}>
        <devtools-expandable-list .data=${{
		rows: t,
		title: vi(N.framesPerIssue, { n: e.length })
	}}
        jslog=${zt().track({ resize: !0 })}></devtools-expandable-list>
      </div>
    `;
}
function Di(e) {
	return e.reason === w.BackForwardCacheNotRestoredReason.UnloadHandlerExistsInMainFrame || e.reason === w.BackForwardCacheNotRestoredReason.UnloadHandlerExistsInSubFrame ? y`
        <devtools-link href="https://web.dev/bfcache/#never-use-the-unload-event" class="link"
        jslogContext=${"learn-more.never-use-unload"}>
          ${vi(N.neverUseUnload)}
        </devtools-link>` : b;
}
function Oi(e) {
	if (e === void 0 || e.length === 0) return b;
	let t = [y`<div>${vi(N.filesPerIssue, { n: e.length })}</div>`];
	return t.push(...e.map((e) => y`
          ${yi(fr, {
		sourceURL: e.url,
		lineNumber: e.lineNumber,
		options: {
			columnNumber: e.columnNumber,
			showColumnNumber: !0,
			inlineFrameIndex: 0,
			maxLength: 50
		}
	})}`)), y`
      <div class="details-list">
        <devtools-expandable-list .data=${{ rows: t }}></devtools-expandable-list>
      </div>
    `;
}
function ki(e, t) {
	return y`
    <devtools-report-section>
      ${e.reason in mi ? y`
          <div class="circled-exclamation-icon">
            <devtools-icon class="inline-icon medium" style="color: var(--icon-warning)" name="warning">
            </devtools-icon>
          </div>
          <div>
            ${mi[e.reason].name()}
            ${Di(e)}
            ${Ti(e)}
          </div>` : b}
    </devtools-report-section>
    <div class="gray-text">
      ${e.reason}
    </div>
    ${Oi(e.details)}
    ${Ei(t)}`;
}
var Ai = (e, t, n) => {
	_(y`
    <style>${hi}</style>
    <devtools-report .data=${{ reportTitle: vi(N.backForwardCacheTitle) }} jslog=${D("back-forward-cache")}>

      ${bi(e.frame, e.frameTreeData, e.reasonToFramesMap, e.screenStatus, e.navigateAwayAndBack)}
    </devtools-report>
  `, n);
}, ji = class extends tn {
	#e = "Result";
	#t = 0;
	#n;
	constructor(e = Ai) {
		super({
			useShadowDom: !0,
			delegatesFocus: !0
		}), this.#n = e, this.#r()?.addEventListener(g.PrimaryPageChanged, this.requestUpdate, this), this.#r()?.addEventListener(g.BackForwardCacheDetailsUpdated, this.requestUpdate, this), this.requestUpdate();
	}
	#r() {
		return C.instance().primaryPageTarget()?.model(qe) || null;
	}
	#i() {
		return this.#r()?.mainFrame || null;
	}
	async performUpdate() {
		let e = /* @__PURE__ */ new Map(), t = this.#i(), n = t?.backForwardCacheDetails?.explanationsTree;
		n && this.#u(n, { blankCount: 1 }, e);
		let r = this.#l(n, { blankCount: 1 });
		r.node.iconName = "frame";
		let i = {
			frame: t,
			frameTreeData: r,
			reasonToFramesMap: e,
			screenStatus: this.#e,
			navigateAwayAndBack: this.#c.bind(this)
		};
		this.#n(i, void 0, this.contentElement);
	}
	#a() {
		C.instance().removeModelListener(qe, g.FrameNavigated, this.#a, this), this.#e = "Result", this.requestUpdate(), this.updateComplete.then(() => {
			Ke.alert(vi(N.testCompleted)), this.contentElement.focus();
		});
	}
	async #o() {
		C.instance().removeModelListener(qe, g.FrameNavigated, this.#o, this), await this.#s(50);
	}
	async #s(e) {
		let t = C.instance().primaryPageTarget()?.model(qe), n = await t?.navigationHistory();
		t && n && (n.currentIndex === this.#t ? window.setTimeout(this.#s.bind(this, e * 2), e) : (C.instance().addModelListener(qe, g.FrameNavigated, this.#a, this), t.navigateToHistoryEntry(n.entries[n.currentIndex - 1])));
	}
	async #c() {
		let e = C.instance().primaryPageTarget()?.model(qe), t = await e?.navigationHistory();
		e && t && (this.#t = t.currentIndex, this.#e = "Running", this.requestUpdate(), C.instance().addModelListener(qe, g.FrameNavigated, this.#o, this), e.navigate("chrome://terms"));
	}
	#l(e, t) {
		if (!e) return {
			node: { text: "" },
			frameCount: 0,
			issueCount: 0
		};
		let n = 1, r = 0, i = [], a = "";
		e.url.length ? a = e.url : (a = vi(N.blankURLTitle, { PH1: t.blankCount }), t.blankCount += 1);
		for (let t of e.explanations) {
			let e = { text: t.reason };
			r += 1, i.push(e);
		}
		for (let a of e.children) {
			let e = this.#l(a, t);
			e.issueCount > 0 && (i.push(e.node), r += e.issueCount, n += e.frameCount);
		}
		let o = { text: `(${r}) ${a}` };
		return i.length ? (o = {
			...o,
			children: i
		}, o.iconName = "iframe") : e.url.length || --t.blankCount, {
			node: o,
			frameCount: n,
			issueCount: r
		};
	}
	#u(e, t, n) {
		let r = e.url;
		r.length === 0 && (r = vi(N.blankURLTitle, { PH1: t.blankCount }), t.blankCount += 1), e.explanations.forEach((e) => {
			let t = n.get(e.reason);
			t === void 0 ? (t = [r], n.set(e.reason, t)) : t.push(r);
		}), e.children.map((e) => {
			this.#u(e, t, n);
		});
	}
}, Mi = "/*\n * Copyright 2023 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\ndevtools-data-grid {\n  margin-top: 0;\n}\n\n.link,\n.devtools-link {\n  color: var(--sys-color-primary);\n  text-decoration: underline;\n  cursor: pointer;\n  outline-offset: 2px;\n}\n\n@media (forced-colors: active) {\n  .link,\n  .devtools-link {\n    color: linktext;\n    text-decoration-color: linktext;\n  }\n}\n", Ni = /* @__PURE__ */ e({
	BounceTrackingMitigationsView: () => Ui,
	DEFAULT_VIEW: () => Hi,
	ScreenStatusType: () => Ri,
	i18nString: () => Li
}), { html: Pi } = Ie, Fi = {
	bounceTrackingMitigationsTitle: "Bounce tracking mitigations",
	forceRun: "Force run",
	runningMitigations: "Running",
	stateDeletedFor: "State was deleted for the following sites:",
	checkingPotentialTrackers: "Checking for potential bounce tracking sites.",
	learnMore: "Learn more: Bounce Tracking Mitigations",
	noPotentialBounceTrackersIdentified: "State was not cleared for any potential bounce tracking sites. Either none were identified or third-party cookies are not blocked.",
	featureDisabled: "Bounce tracking mitigations are disabled."
}, Ii = s("panels/application/components/BounceTrackingMitigationsView.ts", Fi), Li = a.bind(void 0, Ii), Ri = /* @__PURE__ */ function(e) {
	return e.INITIALIZING = "Initializing", e.RUNNING = "Running", e.RESULT = "Result", e.DISABLED = "Disabled", e;
}({}), zi = (e) => {
	let t = e.screenStatus === "Running";
	return Pi`
    <devtools-button
      aria-label=${Li(Fi.forceRun)}
      .disabled=${t}
      .spinner=${t}
      .variant=${h.PRIMARY}
      @click=${e.runMitigations}
      jslog=${Bt("force-run").track({ click: !0 })}>
      ${t ? Pi`
        ${Li(Fi.runningMitigations)}` : `
        ${Li(Fi.forceRun)}
      `}
    </devtools-button>
  `;
}, Bi = (e) => e.seenButtonClick ? e.trackingSites.length === 0 ? Pi`
      <devtools-report-section>
      ${e.screenStatus === "Running" ? Pi`
        ${Li(Fi.checkingPotentialTrackers)}` : `
        ${Li(Fi.noPotentialBounceTrackersIdentified)}
      `}
      </devtools-report-section>
    ` : Pi`
    <devtools-report-section>
      <devtools-data-grid striped inline>
        <table>
          <tr>
            <th id="sites" weight="10" sortable>
              ${Li(Fi.stateDeletedFor)}
            </th>
          </tr>
          ${e.trackingSites.map((e) => Pi`
            <tr><td>${e}</td></tr>`)}
        </table>
      </devtools-data-grid>
    </devtools-report-section>
  ` : b, Vi = (e) => e.screenStatus === "Initializing" ? b : e.screenStatus === "Disabled" ? Pi`
      <devtools-report-section>
        ${Li(Fi.featureDisabled)}
      </devtools-report-section>
    ` : Pi`
    <devtools-report-section>
      ${zi(e)}
    </devtools-report-section>
    ${Bi(e)}
    <devtools-report-divider>
    </devtools-report-divider>
    <devtools-report-section>
      <devtools-link href="https://privacycg.github.io/nav-tracking-mitigations/#bounce-tracking-mitigations" class="link"
      jslogcontext="learn-more">
        ${Li(Fi.learnMore)}
      </devtools-link>
    </devtools-report-section>
  `, Hi = (e, t, n) => {
	_(Pi`
    <style>${Mi}</style>
    <style>${Ee}</style>
    <devtools-report .data=${{ reportTitle: Li(Fi.bounceTrackingMitigationsTitle) }}
                      jslog=${D("bounce-tracking-mitigations")}>
      ${Vi(e)}
    </devtools-report>
  `, n, { container: { classes: ["overflow-auto"] } });
}, Ui = class extends tn {
	#e = [];
	#t = "Initializing";
	#n = !1;
	#r;
	constructor(e, t = Hi) {
		super(e, { useShadowDom: "pure" }), this.#r = t;
		let n = C.instance().primaryPageTarget();
		n ? n.systemInfo().invoke_getFeatureState({ featureState: "DIPS" }).then((e) => {
			this.#t = e.featureEnabled ? "Result" : "Disabled", this.requestUpdate();
		}) : this.#t = "Result";
	}
	wasShown() {
		super.wasShown(), this.requestUpdate();
	}
	performUpdate() {
		this.#r({
			screenStatus: this.#t,
			trackingSites: this.#e,
			seenButtonClick: this.#n,
			runMitigations: this.#i.bind(this)
		}, void 0, this.contentElement);
	}
	async #i() {
		let e = C.instance().primaryPageTarget();
		if (!e) return;
		this.#n = !0, this.#t = "Running", this.requestUpdate();
		let t = await e.storageAgent().invoke_runBounceTrackingMitigations();
		this.#e = [], t.deletedSites.forEach((e) => {
			this.#e.push(e);
		}), this.#a();
	}
	#a() {
		this.#t = "Result", this.requestUpdate();
	}
}, Wi = /* @__PURE__ */ e({
	CrashReportContextGrid: () => Yi,
	DEFAULT_VIEW: () => Ji,
	i18nString: () => qi
}), Gi = {
	key: "Key",
	value: "Value",
	copyKey: "Copy key",
	copyValue: "Copy value"
}, Ki = s("panels/application/components/CrashReportContextGrid.ts", Gi), qi = a.bind(void 0, Ki), Ji = (e, t, n) => {
	_(y`
      <style>
        :host {
          display: block;
        }

        div {
          overflow: auto;
        }

        td {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      </style>
      <style>${Ee}</style>
      <div>
        <devtools-data-grid striped inline>
          <table>
            <thead>
              <tr>
                <th id="key" weight="50">${qi(Gi.key)}</th>
                <th id="value" weight="50">${qi(Gi.value)}</th>
              </tr>
            </thead>
            <tbody>
              ${e.entries.map((t) => y`
                <tr class=${e.selectedKey === t.key ? "selected" : ""}
                    @select=${() => e.onSelect(t.key)}
                    @contextmenu=${(n) => e.onContextMenu(n, t.key, t.value)}>
                  <td title=${t.key}>${t.key}</td>
                  <td title=${t.value}>${t.value}</td>
                </tr>
              `)}
            </tbody>
          </table>
        </devtools-data-grid>
      </div>
    `, n);
}, Yi = class extends tn {
	#e = [];
	#t = [];
	#n;
	#r = [];
	#i;
	constructor(e, t = Ji) {
		super(e, { useShadowDom: !0 }), this.#i = t;
	}
	set data(e) {
		this.#e = e.entries, this.#n = e.selectedKey, this.#r = e.filters || [], this.requestUpdate();
	}
	#a() {
		if (this.#r.length === 0) {
			this.#t = this.#e;
			return;
		}
		this.#t = this.#e.filter((e) => this.#r.every((t) => {
			let n = t.regex;
			if (!n) return !0;
			let r = n.test(e.key) || n.test(e.value);
			return t.negative ? !r : r;
		}));
	}
	#o(e, t, n) {
		let r = e.detail;
		r.defaultSection().appendItem(qi(Gi.copyKey), () => {
			st.copyText(t);
		}, { jslogContext: "copy-key" }), r.defaultSection().appendItem(qi(Gi.copyValue), () => {
			st.copyText(n);
		}, { jslogContext: "copy-value" });
	}
	performUpdate() {
		this.#a(), this.#i({
			entries: this.#t,
			selectedKey: this.#n,
			onSelect: (e) => this.element.dispatchEvent(new CustomEvent("select", { detail: e })),
			onContextMenu: (e, t, n) => this.#o(e, t, n)
		}, void 0, this.contentElement);
	}
}, Xi = "/*\n * Copyright 2025 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n@scope to (devtools-widget > *) {\n  :scope {\n    overflow: auto;\n    height: 100%;\n  }\n\n  .endpoints-container {\n    height: 100%;\n    display: flex;\n    flex-direction: column;\n    width: 100%;\n  }\n\n  .endpoints-header {\n    font-size: 15px;\n    background-color: var(--sys-color-surface2);\n    padding: 1px 4px;\n    flex-shrink: 0;\n  }\n\n  devtools-data-grid {\n    flex: auto;\n  }\n}\n", Zi = /* @__PURE__ */ e({
	DEFAULT_VIEW: () => ra,
	EndpointsGrid: () => ia,
	i18nString: () => ea
}), Qi = {
	noEndpointsToDisplay: "No endpoints to display",
	endpointsDescription: "Here you will find the list of endpoints that receive the reports"
}, $i = s("panels/application/components/EndpointsGrid.ts", Qi), ea = a.bind(void 0, $i), { render: ta, html: na } = Ie, ra = (e, t, n) => {
	ta(na`
    <style>${Xi}</style>
    <style>${Ee}</style>
    <div class="endpoints-container" jslog=${T("endpoints")}>
      <div class="endpoints-header">${d("Endpoints")}</div>
      ${e.endpoints.size > 0 ? na`
        <devtools-data-grid striped>
         <table>
          <tr>
            <th id="origin" weight="30">${d("Origin")}</th>
            <th id="name" weight="20">${d("Name")}</th>
            <th id="url" weight="30">${d("URL")}</th>
          </tr>
          ${Array.from(e.endpoints).map(([e, t]) => t.map((t) => na`<tr>
                <td>${e}</td>
                <td>${t.groupName}</td>
                <td>${t.url}</td>
              </tr>`)).flat()}
          </table>
        </devtools-data-grid>
      ` : na`
        <div class="empty-state">
          <span class="empty-state-header">${ea(Qi.noEndpointsToDisplay)}</span>
          <span class="empty-state-description">${ea(Qi.endpointsDescription)}</span>
        </div>
      `}
    </div>
  `, n);
}, ia = class extends tn {
	endpoints = /* @__PURE__ */ new Map();
	#e;
	constructor(e, t = ra) {
		super(e), this.#e = t, this.requestUpdate();
	}
	performUpdate() {
		this.#e({ endpoints: this.endpoints }, void 0, this.contentElement);
	}
}, aa = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n:host {\n  display: flex;\n  padding: 20px;\n  height: 100%;\n}\n\n.heading {\n  font-size: 15px;\n}\n\ndevtools-data-grid {\n  margin-top: 20px;\n}\n\n.info-icon {\n  vertical-align: text-bottom;\n  height: 14px;\n}\n\n.no-events-message {\n  margin-top: 20px;\n}\n", oa = /* @__PURE__ */ e({
	InterestGroupAccessGrid: () => da,
	i18nString: () => ua
}), { html: sa } = Ie, ca = {
	allInterestGroupStorageEvents: "All interest group storage events.",
	eventTime: "Event Time",
	eventType: "Access Type",
	groupOwner: "Owner",
	groupName: "Name",
	noEvents: "No interest group events detected",
	interestGroupDescription: "On this page you can inspect and analyze interest groups"
}, la = s("panels/application/components/InterestGroupAccessGrid.ts", ca), ua = a.bind(void 0, la), da = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t = [];
	connectedCallback() {
		this.#n();
	}
	set data(e) {
		this.#t = e, this.#n();
	}
	#n() {
		_(sa`
      <style>${aa}</style>
      <style>${Ee}</style>
      ${this.#t.length === 0 ? sa`
          <div class="empty-state">
            <span class="empty-state-header">${ua(ca.noEvents)}</span>
            <span class="empty-state-description">${ua(ca.interestGroupDescription)}</span>
          </div>` : sa`
          <div>
            <span class="heading">Interest Groups</span>
            <devtools-icon class="info-icon medium" name="info"
                          title=${ua(ca.allInterestGroupStorageEvents)}>
            </devtools-icon>
            ${this.#r()}
          </div>`}
    `, this.#e, { host: this });
	}
	#r() {
		return sa`
      <devtools-data-grid striped inline>
        <table>
          <tr>
            <th id="event-time" sortable weight="10">${ua(ca.eventTime)}</td>
            <th id="event-type" sortable weight="5">${ua(ca.eventType)}</td>
            <th id="event-group-owner" sortable weight="10">${ua(ca.groupOwner)}</td>
            <th id="event-group-name" sortable weight="10">${ua(ca.groupName)}</td>
          </tr>
          ${this.#t.map((e) => sa`
          <tr @select=${() => this.dispatchEvent(new CustomEvent("select", { detail: e }))}>
            <td>${(/* @__PURE__ */ new Date(1e3 * e.accessTime)).toLocaleString()}</td>
            <td>${e.type}</td>
            <td>${e.ownerOrigin}</td>
            <td>${e.name}</td>
          </tr>
        `)}
        </table>
      </devtools-data-grid>`;
	}
};
customElements.define("devtools-interest-group-access-grid", da);
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/application/components/permissionsPolicySection.css.mjs
var fa = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n@scope to (devtools-widget > *) {\n  :scope {\n    display: contents;\n  }\n\n  .text-ellipsis {\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n  }\n\n  .link,\n  .devtools-link {\n    color: var(--sys-color-primary);\n    text-decoration: underline;\n    cursor: pointer;\n    outline-offset: 2px;\n  }\n\n  button.link {\n    border: none;\n    background: none;\n    font-family: inherit;\n    font-size: inherit;\n  }\n\n  .policies-list {\n    padding-top: 3px;\n  }\n\n  .permissions-row {\n    display: flex;\n    line-height: 22px;\n  }\n\n  .permissions-row div {\n    padding-right: 5px;\n  }\n\n  .feature-name {\n    width: 135px;\n  }\n\n  .allowed-icon {\n    vertical-align: sub;\n  }\n\n  .block-reason {\n    width: 215px;\n  }\n\n  .disabled-features-button {\n    padding-left: var(--sys-size-3);\n  }\n}\n", pa = /* @__PURE__ */ e({
	PermissionsPolicySection: () => xa,
	renderIconLink: () => _a
}), ma = {
	showDetails: "Show details",
	hideDetails: "Hide details",
	allowedFeatures: "Allowed Features",
	disabledFeatures: "Disabled Features",
	clickToShowHeader: "Click to reveal the request whose \"`Permissions-Policy`\" HTTP header disables this feature.",
	clickToShowIframe: "Click to reveal the top-most iframe which does not allow this feature in the elements panel.",
	disabledByIframe: "missing in iframe \"`allow`\" attribute",
	disabledByHeader: "disabled by \"`Permissions-Policy`\" header",
	disabledByFencedFrame: "disabled inside a `fencedframe`"
}, ha = s("panels/application/components/PermissionsPolicySection.ts", ma), ga = a.bind(void 0, ha);
function _a(e, t, n, r) {
	return y`
    <devtools-button
      .iconName=${e}
      title=${t}
      aria-label=${t}
      .variant=${h.ICON}
      .size=${ft.SMALL}
      @click=${n}
      jslog=${Bt().track({ click: !0 }).context(r)}>
    </devtools-button>`;
}
function va(e) {
	return e.length ? y`
    <devtools-report-key>${ga(ma.allowedFeatures)}</devtools-report-key>
    <devtools-report-value>${e.map(({ feature: e }) => e).join(", ")}</devtools-report-value>` : b;
}
function ya(e, t, n, r, i) {
	if (!e.length) return b;
	if (!t) return y`
      <devtools-report-key>${ga(ma.disabledFeatures)}</devtools-report-key>
      <devtools-report-value>
        ${e.map(({ policy: e }) => e.feature).join(", ")}
        <devtools-button
            class="disabled-features-button"
            .variant=${h.OUTLINED}
            @click=${n}
            jslog=${Bt("show-disabled-features-details").track({ click: !0 })}>
          ${ga(ma.showDetails)}
        </devtools-button>
      </devtools-report-value>`;
	let a = e.map(({ policy: e, blockReason: t, linkTargetDOMNode: n, linkTargetRequest: a }) => {
		let o = (() => {
			switch (t) {
				case w.PermissionsPolicyBlockReason.IframeAttribute: return ga(ma.disabledByIframe);
				case w.PermissionsPolicyBlockReason.Header: return ga(ma.disabledByHeader);
				case w.PermissionsPolicyBlockReason.InFencedFrameTree: return ga(ma.disabledByFencedFrame);
				default: return "";
			}
		})();
		return y`
      <div class="permissions-row">
        <div>
          <devtools-icon class="allowed-icon extra-large" name="cross-circle">
          </devtools-icon>
        </div>
        <div class="feature-name text-ellipsis">${e.feature}</div>
        <div class="block-reason">${o}</div>
        <div>
          ${n ? _a("code-circle", ga(ma.clickToShowIframe), () => r(n), "reveal-in-elements") : b}
          ${a ? _a("arrow-up-down-circle", ga(ma.clickToShowHeader), () => i(a), "reveal-in-network") : b}
        </div>
      </div>`;
	});
	return y`
    <devtools-report-key>${ga(ma.disabledFeatures)}</devtools-report-key>
    <devtools-report-value class="policies-list">
      ${a}
      <div class="permissions-row">
        <devtools-button
            .variant=${h.OUTLINED}
            @click=${n}
            jslog=${Bt("hide-disabled-features-details").track({ click: !0 })}>
          ${ga(ma.hideDetails)}
        </devtools-button>
      </div>
    </devtools-report-value>`;
}
var ba = (e, t, n) => {
	_(y`
    <style>${fa}</style>
    <devtools-report-section-header>
      ${d("Permissions Policy")}
    </devtools-report-section-header>
    ${va(e.allowed)}
    ${e.allowed.length > 0 && e.disallowed.length > 0 ? y`<devtools-report-divider class="subsection-divider"></devtools-report-divider>` : b}
    ${ya(e.disallowed, e.showDetails, e.onToggleShowDetails, e.onRevealDOMNode, e.onRevealHeader)}
    <devtools-report-divider></devtools-report-divider>`, n);
}, xa = class extends tn {
	#e = [];
	#t = !1;
	#n;
	constructor(e, t = ba) {
		super(e, { useShadowDom: !1 }), this.#n = t;
	}
	set policies(e) {
		this.#e = e, this.requestUpdate();
	}
	get policies() {
		return this.#e;
	}
	set showDetails(e) {
		this.#t = e, this.requestUpdate();
	}
	get showDetails() {
		return this.#t;
	}
	#r() {
		this.showDetails = !this.showDetails;
	}
	async #i(e) {
		await r(e);
	}
	async #a(e) {
		if (!e) return;
		let t = e.responseHeaderValue("permissions-policy") ? "permissions-policy" : "feature-policy", n = Mr.responseHeaderMatch(e, {
			name: t,
			value: ""
		});
		await r(n);
	}
	async performUpdate() {
		let e = ce.instance(), t = this.#e.sort((e, t) => e.feature.localeCompare(t.feature)), n = t.filter((e) => e.allowed).sort((e, t) => e.feature.localeCompare(t.feature)), r = t.filter((e) => !e.allowed).sort((e, t) => e.feature.localeCompare(t.feature)), i = this.#t ? await Promise.all(r.map(async (t) => {
			let n = t.locator ? e.getFrame(t.locator.frameId) : void 0, r = t.locator?.blockReason, i = await (r === w.PermissionsPolicyBlockReason.IframeAttribute && n?.getOwnerDOMNodeOrDocument() || void 0), a = n?.resourceForURL(n.url);
			return {
				policy: t,
				blockReason: r,
				linkTargetDOMNode: i,
				linkTargetRequest: r === w.PermissionsPolicyBlockReason.Header && a?.request || void 0
			};
		})) : r.map((e) => ({ policy: e }));
		this.#n({
			allowed: n,
			disallowed: i,
			showDetails: this.#t,
			onToggleShowDetails: this.#r.bind(this),
			onRevealDOMNode: this.#i.bind(this),
			onRevealHeader: this.#a.bind(this)
		}, void 0, this.contentElement);
	}
}, Sa = "/*\n * Copyright 2022 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  display: flex;\n  flex-direction: column;\n}\n\n.devtools-link {\n  color: var(--sys-color-primary);\n  text-decoration: underline;\n  cursor: pointer;\n  outline-offset: 2px;\n}\n\n.devtools-link:focus-visible {\n  outline-width: unset;\n}\n\ninput.devtools-text-input[type=\"text\"] {\n  padding: 3px 6px;\n  margin-left: 4px;\n  margin-right: 4px;\n  width: 250px;\n  height: 25px;\n}\n\ninput.devtools-text-input[type=\"text\"]::placeholder {\n  color: var(--sys-color-token-subtle);\n}\n\n.protocol-handlers-row {\n  margin: var(--sys-size-3) 0;\n}\n\n.inline-icon {\n  width: 16px;\n  height: 16px;\n\n  &[name=\"check-circle\"] {\n    color: var(--icon-checkmark-green);\n  }\n}\n\n@media (forced-colors: active) {\n  .devtools-link:not(.devtools-link-prevent-click) {\n    color: linktext;\n  }\n\n  .devtools-link:focus-visible {\n    background: Highlight;\n    color: HighlightText;\n  }\n}\n", Ca = /* @__PURE__ */ e({ ProtocolHandlersView: () => Ma }), wa = "https://web.dev/url-protocol-handler/", Ta = {
	protocolDetected: "Found valid protocol handler registration in the {PH1}. With the app installed, test the registered protocols.",
	protocolNotDetected: "Define protocol handlers in the {PH1} to register your app as a handler for custom protocols when your app is installed.",
	needHelpReadOur: "Need help? Read {PH1}.",
	protocolHandlerRegistrations: "URL protocol handler registration for PWAs",
	manifest: "manifest",
	testProtocol: "Test protocol",
	dropdownLabel: "Select protocol handler",
	textboxLabel: "Query parameter or endpoint for protocol handler",
	textboxPlaceholder: "Enter URL"
}, Ea = s("panels/application/components/ProtocolHandlersView.ts", Ta), Da = a.bind(void 0, Ea), Oa = Ce.bind(void 0, Ea);
function ka(e, t) {
	let n = e.length > 0 ? Ta.protocolDetected : Ta.protocolNotDetected;
	return y`
    <div class="protocol-handlers-row status">
      <devtools-icon class="inline-icon"
                     name=${e.length > 0 ? "check-circle" : "info"}>
      </devtools-icon>
      ${xr(Ea, n, { PH1: y`
        <devtools-link href=${t} jslogcontext="manifest">${Da(Ta.manifest)}</devtools-link>
        ` })}
    </div>`;
}
function Aa(e, t, n, r, i) {
	return e.length === 0 ? b : y`
    <div class="protocol-handlers-row">
      <select class="protocol-select" @change=${n}
              aria-label=${Da(Ta.dropdownLabel)}>
        ${e.filter((e) => e.protocol).map(({ protocol: e }) => y`
          <option value=${e} jslog=${je(e).track({ click: !0 })}>
            ${e}://
          </option>`)}
      </select>
      <input .value=${t} class="devtools-text-input" type="text"
             @change=${r} aria-label=${Da(Ta.textboxLabel)}
             placeholder=${Da(Ta.textboxPlaceholder)} />
      <devtools-button .variant=${h.PRIMARY} @click=${i}>
        ${Da(Ta.testProtocol)}
      </devtools-button>
    </div>`;
}
var ja = (e, t, n) => {
	_(y`
    <style>${Sa}</style>
    <style>${Ee}</style>
    <style>${zr}</style>
    ${ka(e.protocolHandler, e.manifestLink)}
    <div class="protocol-handlers-row">
      ${Oa(Ta.needHelpReadOur, { PH1: y`
        <devtools-link href=${wa} class="devtools-link" autofocus jslogcontext="learn-more">
          ${Da(Ta.protocolHandlerRegistrations)}
        </devtools-link>` })}
    </div>
    ${Aa(e.protocolHandler, e.queryInputState, e.protocolSelectHandler, e.queryInputChangeHandler, e.testProtocolClickHandler)}
  `, n, { container: { classes: ["vbox"] } });
}, Ma = class extends tn {
	#e = [];
	#t = "";
	#n = "";
	#r = "";
	#i;
	constructor(e, t = ja) {
		super(e, { useShadowDom: !1 }), this.#i = t;
	}
	set protocolHandlers(e) {
		this.#e = e, this.requestUpdate();
	}
	get protocolHandlers() {
		return this.#e;
	}
	set manifestLink(e) {
		let t = this.#t !== e;
		this.#t = e, t && (this.#r = "", this.#n = this.#e[0]?.protocol ?? ""), this.requestUpdate();
	}
	get manifestLink() {
		return this.#t;
	}
	#a = (e) => {
		this.#n = e.target.value;
	};
	#o = (e) => {
		this.#r = e.target.value, this.requestUpdate();
	};
	#s = () => {
		let e = `${this.#n}://${this.#r}`;
		st.openInNewTab(e), Nt.actionTaken(un.CaptureTestProtocolClicked);
	};
	performUpdate() {
		this.#i({
			protocolHandler: this.#e,
			manifestLink: this.#t,
			queryInputState: this.#r,
			protocolSelectHandler: this.#a,
			queryInputChangeHandler: this.#o,
			testProtocolClickHandler: this.#s
		}, void 0, this.contentElement);
	}
}, Na = "/*\n * Copyright 2025 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n@scope to (devtools-widget > *) {\n  :scope {\n    overflow: auto;\n    height: 100%;\n  }\n\n  .reporting-container {\n    height: 100%;\n    display: flex;\n    flex-direction: column;\n    width: 100%;\n  }\n\n  .reporting-header {\n    font-size: 15px;\n    background-color: var(--sys-color-surface2);\n    padding: 1px 4px;\n    flex-shrink: 0;\n  }\n\n  devtools-data-grid {\n    flex: auto;\n  }\n\n  .inline-icon {\n    vertical-align: text-bottom;\n  }\n}\n", Pa = /* @__PURE__ */ e({
	DEFAULT_VIEW: () => Va,
	ReportsGrid: () => Ha,
	i18nString: () => La
}), Fa = {
	noReportsToDisplay: "No reports to display",
	reportingApiDescription: "Here you will find reporting api reports that are generated by the page.",
	learnMore: "Learn more",
	status: "Status",
	destination: "Destination",
	generatedAt: "Generated at"
}, Ia = s("panels/application/components/ReportsGrid.ts", Fa), La = a.bind(void 0, Ia), { render: Ra, html: za } = Ie, Ba = "https://developer.chrome.com/docs/capabilities/web-apis/reporting-api", Va = (e, t, n) => {
	Ra(za`
    <style>${Na}</style>
    <style>${Ee}</style>
    <div class="reporting-container" jslog=${T("reports")}>
      <div class="reporting-header">${d("Reports")}</div>
      ${e.reports.length > 0 ? za`
        <devtools-data-grid striped>
          <table>
            <tr>
              ${e.protocolMonitorExperimentEnabled ? za`
                <th id="id" weight="30">${d("ID")}</th>
              ` : ""}
              <th id="url" weight="30">${d("URL")}</th>
              <th id="type" weight="20">${d("Type")}</th>
              <th id="status" weight="20">
                <style>${Na}</style>
                <span class="status-header">${La(Fa.status)}</span>
                <devtools-link href="https://web.dev/reporting-api/#report-status"
                jslogcontext="report-status">
                  <devtools-icon class="inline-icon medium" name="help" style="color: var(--icon-link);"
                  ></devtools-icon>
                </devtools-link>
              </th>
              <th id="destination" weight="20">${La(Fa.destination)}</th>
              <th id="timestamp" weight="20">${La(Fa.generatedAt)}</th>
              <th id="body" weight="20">${d("Body")}</th>
            </tr>
            ${e.reports.map((t) => za`
              <tr @select=${() => e.onSelect(t.id)}>
                ${e.protocolMonitorExperimentEnabled ? za`<td>${t.id}</td>` : ""}
                <td>${t.initiatorUrl}</td>
                <td>${t.type}</td>
                <td>${t.status}</td>
                <td>${t.destination}</td>
                <td>${(/* @__PURE__ */ new Date(t.timestamp * 1e3)).toLocaleString()}</td>
                <td>${JSON.stringify(t.body)}</td>
              </tr>
            `)}
          </table>
        </devtools-data-grid>
      ` : za`
        <div class="empty-state">
          <span class="empty-state-header">${La(Fa.noReportsToDisplay)}</span>
          <div class="empty-state-description">
            <span>${La(Fa.reportingApiDescription)}</span>
            <devtools-link
              class="devtools-link"
              href=${Ba}
              jslogcontext="learn-more"
            >${La(Fa.learnMore)}</devtools-link>
          </div>
        </div>
      `}
    </div>
  `, n);
}, Ha = class extends tn {
	reports = [];
	#e = !1;
	#t;
	onReportSelected = () => {};
	constructor(e, t = Va) {
		super(e), this.#t = t, this.#e = Ln.isEnabled(Ge.PROTOCOL_MONITOR), this.requestUpdate();
	}
	performUpdate() {
		let e = {
			reports: this.reports,
			protocolMonitorExperimentEnabled: this.#e,
			onSelect: this.onReportSelected
		};
		this.#t(e, void 0, this.contentElement);
	}
}, Ua = "/*\n * Copyright 2023 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n:host {\n  display: block;\n  white-space: normal;\n  max-width: 400px;\n}\n\n.router-rules {\n  border: 1px solid var(--sys-color-divider);\n  border-spacing: 0;\n  padding-left: 10px;\n  padding-right: 10px;\n  line-height: initial;\n  margin-top: 0;\n  padding-bottom: 12px;\n  text-wrap: balance;\n}\n\n.router-rule {\n  display: flex;\n  margin-top: 12px;\n  flex-direction: column;\n}\n\n.rule-id {\n  color: var(--sys-color-token-subtle);\n}\n\n.item {\n  display: flex;\n  flex-direction: column;\n  padding-left: 10px;\n}\n\n.condition,\n.source {\n  list-style: none;\n  display: flex;\n  margin-top: 4px;\n  flex-direction: row;\n}\n\n.condition > *,\n.source > * {\n  word-break: break-all;\n  line-height: 1.5em;\n}\n\n.rule-type {\n  flex: 0 0 18%;\n}\n", Wa = /* @__PURE__ */ e({ ServiceWorkerRouterView: () => qa });
function Ga(e) {
	return y`
    <li class="router-rule">
      <div class="rule-id">Rule ${e.id}</div>
      <ul class="item">
        <li class="condition">
          <div class="rule-type">Condition</div>
          <div class="rule-value">${e.condition}</div>
        </li>
        <li class="source">
          <div class="rule-type">Source</div>
          <div class="rule-value">${e.source}</div>
        </li>
      </ul>
    </li>`;
}
var Ka = (e, t, n) => {
	_(y`
    <style>${Ua}</style>
    <ul class="router-rules">
      ${e.rules.map(Ga)}
    </ul>`, n);
}, qa = class extends tn {
	#e = [];
	#t;
	constructor(e, t = Ka) {
		super(e, { useShadowDom: !0 }), this.#t = t;
	}
	set rules(e) {
		this.#e = e, this.#e.length > 0 && this.requestUpdate();
	}
	get rules() {
		return this.#e;
	}
	performUpdate() {
		this.#t({ rules: this.#e }, void 0, this.contentElement);
	}
}, Ja = "/*\n * Copyright 2022 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n@scope to (devtools-widget > *) {\n  :scope {\n    padding: 20px;\n    height: 100%;\n    display: flex;\n  }\n\n  .heading {\n    font-size: 15px;\n  }\n\n  devtools-data-grid {\n    margin-top: 20px;\n  }\n\n  .info-icon {\n    vertical-align: text-bottom;\n    height: 14px;\n  }\n\n  .no-events-message {\n    margin-top: 20px;\n  }\n}\n", Ya = /* @__PURE__ */ e({
	DEFAULT_VIEW: () => no,
	SharedStorageAccessGrid: () => ro,
	i18nString: () => to
}), Xa = "https://developers.google.com/privacy-sandbox/private-advertising/shared-storage", { render: Za, html: Qa } = Ie, $a = {
	sharedStorage: "Shared storage",
	allSharedStorageEvents: "All shared storage events for this page.",
	eventTime: "Event Time",
	eventScope: "Access Scope",
	eventMethod: "Access Method",
	ownerOrigin: "Owner Origin",
	ownerSite: "Owner Site",
	eventParams: "Optional Event Params",
	noEvents: "No shared storage events detected",
	sharedStorageDescription: "On this page you can view, add, edit and delete shared storage key-value pairs and view shared storage events.",
	learnMore: "Learn more"
}, eo = s("panels/application/components/SharedStorageAccessGrid.ts", $a), to = a.bind(void 0, eo), no = (e, t, n) => {
	Za(Qa`
    <style>${Ja}</style>
    ${e.events.length === 0 ? Qa`
        <div class="empty-state" jslog=${T().context("empty-view")}>
          <div class="empty-state-header">${to($a.noEvents)}</div>
          <div class="empty-state-description">
            <span>${to($a.sharedStorageDescription)}</span>
            <devtools-link
              class="devtools-link"
              href=${Xa}
              .jslogContext=${"learn-more"}
            >${to($a.learnMore)}</devtools-link>
          </div>
        </div>` : Qa`
        <div jslog=${T("events-table")}>
          <span class="heading">${to($a.sharedStorage)}</span>
          <devtools-icon class="info-icon medium" name="info"
                          title=${to($a.allSharedStorageEvents)}>
          </devtools-icon>
          <devtools-data-grid striped inline>
            <table>
              <thead>
                <tr>
                  <th id="event-time" weight="10" sortable>
                    ${to($a.eventTime)}
                  </th>
                  <th id="event-scope" weight="10" sortable>
                    ${to($a.eventScope)}
                  </th>
                  <th id="event-method" weight="10" sortable>
                    ${to($a.eventMethod)}
                  </th>
                  <th id="event-owner-origin" weight="10" sortable>
                    ${to($a.ownerOrigin)}
                  </th>
                  <th id="event-owner-site" weight="10" sortable>
                    ${to($a.ownerSite)}
                  </th>
                  <th id="event-params" weight="10" sortable>
                    ${to($a.eventParams)}
                  </th>
                </tr>
              </thead>
              <tbody>
                ${e.events.map((t) => Qa`
                  <tr @select=${() => e.onSelect(t)}>
                    <td data-value=${t.accessTime}>
                      ${(/* @__PURE__ */ new Date(1e3 * t.accessTime)).toLocaleString()}
                    </td>
                    <td>${t.scope}</td>
                    <td>${t.method}</td>
                    <td>${t.ownerOrigin}</td>
                    <td>${t.ownerSite}</td>
                    <td>${JSON.stringify(t.params)}</td>
                  </tr>
                `)}
              </tbody>
            </table>
          </devtools-data-grid>
        </div>`}`, n);
}, ro = class extends tn {
	#e;
	#t = [];
	#n = () => {};
	constructor(e, t = no) {
		super(e, { useShadowDom: !0 }), this.#e = t, this.performUpdate();
	}
	set events(e) {
		this.#t = e, this.performUpdate();
	}
	set onSelect(e) {
		this.#n = e, this.performUpdate();
	}
	get onSelect() {
		return this.#n;
	}
	performUpdate() {
		this.#e({
			events: this.#t,
			onSelect: this.#n.bind(this)
		}, {}, this.contentElement);
	}
}, io = "/*\n * Copyright 2022 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.text-ellipsis {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\ndevtools-icon {\n  vertical-align: text-bottom;\n  margin-left: var(--sys-size-3);\n  width: 16px;\n  height: 16px;\n}\n\ndevtools-button {\n  vertical-align: sub;\n  margin-left: var(--sys-size-3);\n}\n\n.entropy-budget {\n  display: flex;\n  align-items: center;\n  height: 18px;\n}\n", ao = "/*\n * Copyright 2025 The Chromium Authors. All rights reserved.\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.default-bucket {\n  font-style: italic;\n}\n", oo = /* @__PURE__ */ e({
	StorageBucketRevealInfo: () => uo,
	StorageMetadataView: () => fo
}), so = {
	origin: "Frame origin",
	topLevelSite: "Top-level site",
	opaque: "(opaque)",
	isOpaque: "Is opaque",
	isThirdParty: "Is third-party",
	yes: "Yes",
	no: "No",
	yesBecauseTopLevelIsOpaque: "Yes, because the top-level site is opaque",
	yesBecauseKeyIsOpaque: "Yes, because the storage key is opaque",
	yesBecauseOriginNotInTopLevelSite: "Yes, because the origin is outside of the top-level site",
	yesBecauseAncestorChainHasCrossSite: "Yes, because the ancestry chain contains a third-party origin",
	loading: "Loading…",
	bucketName: "Bucket name",
	defaultBucket: "Default bucket",
	persistent: "Is persistent",
	durability: "Durability",
	quota: "Quota",
	expiration: "Expiration",
	none: "None",
	deleteBucket: "Delete bucket",
	confirmBucketDeletion: "Delete the \"{PH1}\" bucket?",
	bucketWillBeRemoved: "The selected storage bucket and contained data will be removed."
}, co = s("panels/application/components/StorageMetadataView.ts", so), lo = a.bind(void 0, co), uo = class {
	bucketInfo;
	constructor(e) {
		this.bucketInfo = e;
	}
}, fo = class extends ai {
	#e = this.attachShadow({ mode: "open" });
	#t;
	#n = null;
	#r = null;
	#i = !1;
	setStorageKey(e) {
		this.#n = pn(e), this.render();
	}
	setStorageBucket(e) {
		this.#r = e, this.setStorageKey(e.bucket.storageKey);
	}
	setShowOnlyBucket(e) {
		this.#i = e;
	}
	enableStorageBucketControls(e) {
		this.#t = e, this.#n && this.render();
	}
	render() {
		return Dn("StorageMetadataView render", async () => {
			_(y`
        <style>${ao}</style>
        <devtools-report .data=${{ reportTitle: this.getTitle() ?? lo(so.loading) }}>
          ${await this.renderReportContent()}
        </devtools-report>`, this.#e, { host: this });
		});
	}
	getTitle() {
		if (!this.#n) return;
		let e = this.#n.origin, t = this.#r?.bucket.name || lo(so.defaultBucket);
		return this.#t ? `${t} - ${e}` : e;
	}
	key(e) {
		return y`<devtools-report-key>${e}</devtools-report-key>`;
	}
	value(e) {
		return y`<devtools-report-value>${e}</devtools-report-value>`;
	}
	async renderReportContent() {
		if (!this.#n) return b;
		let e = this.#n.origin, t = !!this.#n.components.get(he.ANCESTOR_CHAIN_BIT), n = !!this.#n.components.get(he.NONCE_HIGH), r = !!this.#n.components.get(he.TOP_LEVEL_SITE_OPAQUE_NONCE_HIGH), i = this.#n.components.get(he.TOP_LEVEL_SITE), a = t ? lo(so.yesBecauseAncestorChainHasCrossSite) : n ? lo(so.yesBecauseKeyIsOpaque) : r ? lo(so.yesBecauseTopLevelIsOpaque) : i && e !== i ? lo(so.yesBecauseOriginNotInTopLevelSite) : null;
		return y`
        ${i && e !== i ? y`${this.key(lo(so.origin))}
            ${this.value(y`<div class="text-ellipsis" title=${e}>${e}</div>`)}` : b}
        ${i || r ? this.key(lo(so.topLevelSite)) : b}
        ${i ? this.value(i) : b}
        ${r ? this.value(lo(so.opaque)) : b}
        ${a ? y`
          ${this.key(lo(so.isThirdParty))}${this.value(a)}` : b}
        ${n || r ? this.key(lo(so.isOpaque)) : b}
        ${n ? this.value(lo(so.yes)) : b}
        ${r ? this.value(lo(so.yesBecauseTopLevelIsOpaque)) : b}
        ${this.#r ? this.#a() : b}
        ${this.#t ? this.#s() : b}`;
	}
	#a() {
		if (!this.#r) throw Error("Should not call #renderStorageBucketInfo if #bucket is null.");
		let { bucket: { name: e }, persistent: t, durability: n, quota: i } = this.#r, a = !e, s = () => a ? y`<span class="default-bucket">${lo(so.defaultBucket)}</span>` : this.#i ? y`<devtools-link
        @click=${(e) => {
			e.preventDefault(), r(new uo(this.#r));
		}}
        title=${e}
        jslog=${Bt("storage-bucket").track({ click: !0 })}
      >${e}</devtools-link>` : y`${e}`;
		return this.#i ? y`
        ${this.key(lo(so.bucketName))}
        ${this.value(s())}` : y`
      ${this.key(lo(so.bucketName))}
      ${this.value(s())}
      ${this.key(lo(so.persistent))}
      ${this.value(lo(t ? so.yes : so.no))}
      ${this.key(lo(so.durability))}
      ${this.value(n)}
      ${this.key(lo(so.quota))}
      ${this.value(o(i))}
      ${this.key(lo(so.expiration))}
      ${this.value(this.#o())}`;
	}
	#o() {
		if (!this.#r) throw Error("Should not call #getExpirationString if #bucket is null.");
		let { expiration: e } = this.#r;
		return e === 0 ? lo(so.none) : (/* @__PURE__ */ new Date(e * 1e3)).toLocaleString();
	}
	#s() {
		return y`
    <devtools-report-divider></devtools-report-divider>
    <devtools-report-section>
      <devtools-button aria-label=${lo(so.deleteBucket)}
                       .variant=${h.OUTLINED}
                       @click=${this.#c}>
        ${lo(so.deleteBucket)}
      </devtools-button>
    </devtools-report-section>`;
	}
	async #c() {
		if (!this.#t || !this.#r) throw Error("Should not call #deleteBucket if #storageBucketsModel or #storageBucket is null.");
		await tt.show(lo(so.bucketWillBeRemoved), lo(so.confirmBucketDeletion, { PH1: this.#r.bucket.name || "" }), this, { jslogContext: "delete-bucket-confirmation" }) && this.#t.deleteBucket(this.#r.bucket);
	}
};
customElements.define("devtools-storage-metadata-view", fo);
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/application/components/SharedStorageMetadataView.ts
var po = /* @__PURE__ */ e({ SharedStorageMetadataView: () => vo }), { html: mo } = Ie, ho = {
	sharedStorage: "Shared storage",
	creation: "Creation Time",
	notYetCreated: "Not yet created",
	numEntries: "Number of Entries",
	entropyBudget: "Entropy Budget for Fenced Frames",
	budgetExplanation: "Remaining data leakage allowed within a 24-hour period for this origin in bits of entropy",
	resetBudget: "Reset Budget",
	numBytesUsed: "Number of Bytes Used"
}, go = s("panels/application/components/SharedStorageMetadataView.ts", ho), _o = a.bind(void 0, go), vo = class extends fo {
	#e;
	#t = null;
	#n = 0;
	#r = 0;
	#i = 0;
	constructor(e, t) {
		super(), this.#e = e, this.classList.add("overflow-auto"), this.setStorageKey(t);
	}
	async #a() {
		await this.#e.resetBudget(), await this.render();
	}
	getTitle() {
		return _o(ho.sharedStorage);
	}
	async renderReportContent() {
		let e = await this.#e.getMetadata();
		return this.#t = e?.creationTime ?? null, this.#n = e?.length ?? 0, this.#r = e?.bytesUsed ?? 0, this.#i = e?.remainingBudget ?? 0, mo`
      <style>${io}</style>
      ${await super.renderReportContent()}
      ${this.key(_o(ho.creation))}
      ${this.value(this.#o())}
      ${this.key(_o(ho.numEntries))}
      ${this.value(String(this.#n))}
      ${this.key(_o(ho.numBytesUsed))}
      ${this.value(String(this.#r))}
      ${this.key(mo`<span class="entropy-budget">${_o(ho.entropyBudget)}<devtools-icon name="info" title=${_o(ho.budgetExplanation)}></devtools-icon></span>`)}
      ${this.value(mo`<span class="entropy-budget">${this.#i}${this.#s()}</span>`)}`;
	}
	#o() {
		return this.#t ? mo`${(/* @__PURE__ */ new Date(1e3 * this.#t)).toLocaleString()}` : mo`${_o(ho.notYetCreated)}`;
	}
	#s() {
		return mo`
      <devtools-button .iconName=${"undo"}
                       .jslogContext=${"reset-entropy-budget"}
                       .size=${ft.SMALL}
                       .title=${_o(ho.resetBudget)}
                       .variant=${h.ICON}
                       @click=${this.#a.bind(this)}></devtools-button>
    `;
	}
};
customElements.define("devtools-shared-storage-metadata-view", vo);
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/application/components/trustTokensView.css.mjs
var yo = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  padding: 20px;\n  height: 100%;\n  display: flex;\n}\n\n.heading {\n  font-size: 15px;\n}\n\ndevtools-data-grid {\n  margin-top: 20px;\n\n  & devtools-button {\n    width: 14px;\n    height: 14px;\n  }\n}\n\ndevtools-icon {\n  width: 14px;\n  height: 14px;\n}\n\n.no-tt-message {\n  margin-top: 20px;\n}\n", bo = /* @__PURE__ */ e({
	TrustTokensView: () => ko,
	i18nString: () => To
}), xo = "https://developers.google.com/privacy-sandbox/protections/private-state-tokens", { html: So } = Ie, Co = {
	issuer: "Issuer",
	storedTokenCount: "Stored token count",
	allStoredTrustTokensAvailableIn: "All stored private state tokens available in this browser instance.",
	noTrustTokens: "No private state tokens detected",
	trustTokensDescription: "On this page you can view all available private state tokens in the current browsing context.",
	deleteTrustTokens: "Delete all stored private state tokens issued by {PH1}.",
	trustTokens: "Private state tokens",
	learnMore: "Learn more"
}, wo = s("panels/application/components/TrustTokensView.ts", Co), To = a.bind(void 0, wo), Eo = 1e3;
function Do(e) {
	return e.tokens.length === 0 ? So`
        <div jslog=${D("trust-tokens")}>
          <div class="empty-state" jslog=${T().context("empty-view")}>
            <div class="empty-state-header">${To(Co.noTrustTokens)}</div>
            <div class="empty-state-description">
              <span>${To(Co.trustTokensDescription)}</span>
              <devtools-link
                class="devtools-link"
                href=${xo}
                .jslogContext=${"learn-more"}
              >${To(Co.learnMore)}</devtools-link>
            </div>
          </div>
        </div>
      ` : So`
      <div jslog=${D("trust-tokens")}>
        <span class="heading">${To(Co.trustTokens)}</span>
        <devtools-icon name="info" title=${To(Co.allStoredTrustTokensAvailableIn)}></devtools-icon>
        <devtools-data-grid striped inline>
          <table>
            <tr>
              <th id="issuer" weight="10" sortable>${To(Co.issuer)}</th>
              <th id="count" weight="5" sortable>${To(Co.storedTokenCount)}</th>
              <th id="delete-button" weight="1" sortable></th>
            </tr>
            ${e.tokens.filter((e) => e.count > 0).map((t) => So`
                <tr>
                  <td>${Ao(t.issuerOrigin)}</td>
                  <td>${t.count}</td>
                  <td>
                    <devtools-button .iconName=${"bin"}
                                    .jslogContext=${"delete-all"}
                                    .size=${ft.SMALL}
                                    .title=${To(Co.deleteTrustTokens, { PH1: Ao(t.issuerOrigin) })}
                                    .variant=${h.ICON}
                                    @click=${() => e.deleteClickHandler(Ao(t.issuerOrigin))}></devtools-button>
                  </td>
                </tr>
              `)}
          </table>
        </devtools-data-grid>
      </div>
    `;
}
var Oo = (e, t, n) => {
	_(So`
    <style>${yo}</style>
    <style>${Ee}</style>
    ${Do(e)}
  `, n);
}, ko = class extends S {
	#e = 0;
	#t = [];
	#n;
	constructor(e, t = Oo) {
		super(e, { useShadowDom: !0 }), this.#n = t;
	}
	wasShown() {
		super.wasShown(), this.requestUpdate(), this.#e = setInterval(this.requestUpdate.bind(this), Eo);
	}
	willHide() {
		super.willHide(), clearInterval(this.#e), this.#e = 0;
	}
	async performUpdate() {
		let e = C.instance().primaryPageTarget();
		if (!e) return;
		let { tokens: t } = await e.storageAgent().invoke_getTrustTokens();
		t.sort((e, t) => e.issuerOrigin.localeCompare(t.issuerOrigin)), this.#t = t, this.#n({
			tokens: this.#t,
			deleteClickHandler: this.#r.bind(this)
		}, void 0, this.contentElement);
	}
	#r(e) {
		C.instance().primaryPageTarget()?.storageAgent().invoke_clearTrustTokens({ issuerOrigin: e });
	}
};
function Ao(e) {
	return e.replace(/\/$/, "");
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/application/components/components.ts
var jo = /* @__PURE__ */ e({
	BackForwardCacheView: () => gi,
	BounceTrackingMitigationsView: () => Ni,
	CrashReportContextGrid: () => Wi,
	EndpointsGrid: () => Zi,
	InterestGroupAccessGrid: () => oa,
	PermissionsPolicySection: () => pa,
	ProtocolHandlersView: () => Ca,
	ReportsGrid: () => Pa,
	ServiceWorkerRouterView: () => Wa,
	SharedStorageAccessGrid: () => Ya,
	SharedStorageMetadataView: () => po,
	StorageMetadataView: () => oo,
	TrustTokensView: () => bo
}), Mo = /* @__PURE__ */ e({
	AppManifestView: () => es,
	DEFAULT_VIEW: () => $o,
	Events: () => ts
}), { styleMap: No, classMap: Po, ref: Fo } = et, { linkifyURL: Io } = cr, { widget: Lo } = Wt, P = {
	noManifestDetected: "No manifest detected",
	manifestDescription: "A manifest defines how your app appears on phone’s home screens and what the app looks like on launch.",
	appManifest: "Manifest",
	errorsAndWarnings: "Errors and warnings",
	installability: "Installability",
	identity: "Identity",
	presentation: "Presentation",
	protocolHandlers: "Protocol Handlers",
	icons: "Icons",
	windowControlsOverlay: "Window Controls Overlay",
	name: "Name",
	shortName: "Short name",
	url: "URL",
	computedAppId: "Computed App ID",
	appIdExplainer: "This is used by the browser to know whether the manifest should be updating an existing application, or whether it refers to a new web app that can be installed.",
	learnMore: "Learn more",
	appIdNote: "Note: `id` is not specified in the manifest, `start_url` is used instead. To specify an App ID that matches the current identity, set the `id` field to {PH1} {PH2}.",
	copyToClipboard: "Copy suggested ID to clipboard",
	copiedToClipboard: "Copied suggested ID {PH1} to clipboard",
	description: "Description",
	startUrl: "Start URL",
	themeColor: "Theme color",
	backgroundColor: "Background color",
	orientation: "Orientation",
	display: "Display",
	newNoteUrl: "New note URL",
	descriptionMayBeTruncated: "Description may be truncated.",
	shortcutsMayBeNotAvailable: "The maximum number of shortcuts is platform dependent. Some shortcuts may be not available.",
	showOnlyTheMinimumSafeAreaFor: "Show only the minimum safe area for maskable icons",
	documentationOnMaskableIcons: "documentation on maskable icons",
	needHelpReadOurS: "Need help? Read the {PH1}.",
	shortcutS: "Shortcut #{PH1}",
	shortcutSShouldIncludeAXPixel: "Shortcut #{PH1} should include a 96×96 pixel icon",
	screenshotS: "Screenshot #{PH1}",
	pageIsNotLoadedInTheMainFrame: "Page is not loaded in the main frame",
	pageIsNotServedFromASecureOrigin: "Page is not served from a secure origin",
	pageHasNoManifestLinkUrl: "Page has no manifest <link> `URL`",
	manifestCouldNotBeFetchedIsEmpty: "Manifest could not be fetched, is empty, or could not be parsed",
	manifestStartUrlIsNotValid: "Manifest '`start_url`' is not valid",
	manifestDoesNotContainANameOr: "Manifest does not contain a '`name`' or '`short_name`' field",
	manifestDisplayPropertyMustBeOne: "Manifest '`display`' property must be one of '`standalone`', '`fullscreen`', or '`minimal-ui`'",
	manifestDoesNotContainASuitable: "Manifest does not contain a suitable icon—PNG, SVG, or WebP format of at least {PH1}px is required, the '`sizes`' attribute must be set, and the '`purpose`' attribute, if set, must include '`any`'.",
	avoidPurposeAnyAndMaskable: "Declaring an icon with '`purpose`' of '`any maskable`' is discouraged. It is likely to look incorrect on some platforms due to too much or too little padding.",
	noSuppliedIconIsAtLeastSpxSquare: "No supplied icon is at least {PH1} pixels square in `PNG`, `SVG`, or `WebP` format, with the purpose attribute unset or set to '`any`'.",
	couldNotDownloadARequiredIcon: "Could not download a required icon from the manifest",
	downloadedIconWasEmptyOr: "Downloaded icon was empty or corrupted",
	theSpecifiedApplicationPlatform: "The specified application platform is not supported on Android",
	noPlayStoreIdProvided: "No Play store ID provided",
	thePlayStoreAppUrlAndPlayStoreId: "The Play Store app URL and Play Store ID do not match",
	theAppIsAlreadyInstalled: "The app is already installed",
	aUrlInTheManifestContainsA: "A URL in the manifest contains a username, password, or port",
	pageIsLoadedInAnIncognitoWindow: "Page is loaded in an incognito window",
	pageDoesNotWorkOffline: "Page does not work offline",
	couldNotCheckServiceWorker: "Could not check `service worker` without a '`start_url`' field in the manifest",
	manifestSpecifies: "Manifest specifies '`prefer_related_applications`: true'",
	preferrelatedapplicationsIsOnly: "'`prefer_related_applications`' is only supported on `Chrome` Beta and Stable channels on `Android`.",
	manifestContainsDisplayoverride: "Manifest contains '`display_override`' field, and the first supported display mode must be one of '`standalone`', '`fullscreen`', or '`minimal-ui`'",
	pageDoesNotWorkOfflineThePage: "Page does not work offline. Starting in Chrome 93, the installability criteria are changing, and this site will not be installable. See {PH1} for more information.",
	imageFromS: "Image from {PH1}",
	screenshot: "Screenshot",
	formFactor: "Form factor",
	label: "Label",
	platform: "Platform",
	icon: "Icon",
	sSrcIsNotSet: "{PH1} '`src`' is not set",
	sUrlSFailedToParse: "{PH1} URL ''{PH2}'' failed to parse",
	sSFailedToLoad: "{PH1} {PH2} failed to load",
	sSDoesNotSpecifyItsSizeInThe: "{PH1} {PH2} does not specify its size in the manifest",
	sSShouldSpecifyItsSizeAs: "{PH1} {PH2} should specify its size as `[width]x[height]`",
	sSShouldHaveSquareIcon: "Most operating systems require square icons. Please include at least one square icon in the array.",
	actualSizeSspxOfSSDoesNotMatch: "Actual size ({PH1}×{PH2})px of {PH3} {PH4} does not match specified size ({PH5}×{PH6}px)",
	actualWidthSpxOfSSDoesNotMatch: "Actual width ({PH1}px) of {PH2} {PH3} does not match specified width ({PH4}px)",
	actualHeightSpxOfSSDoesNotMatch: "Actual height ({PH1}px) of {PH2} {PH3} does not match specified height ({PH4}px)",
	sSSizeShouldBeAtLeast320: "{PH1} {PH2} size should be at least 320×320",
	sSSizeShouldBeAtMost3840: "{PH1} {PH2} size should be at most 3840×3840",
	sSWidthDoesNotComplyWithRatioRequirement: "{PH1} {PH2} width can't be more than 2.3 times as long as the height",
	sSHeightDoesNotComplyWithRatioRequirement: "{PH1} {PH2} height can't be more than 2.3 times as long as the width",
	screenshotPixelSize: "Screenshot {url} should specify a pixel size `[width]x[height]` instead of `any` as first size.",
	noScreenshotsForRicherPWAInstallOnDesktop: "Richer PWA Install UI won’t be available on desktop. Please add at least one screenshot with the `form_factor` set to `wide`.",
	noScreenshotsForRicherPWAInstallOnMobile: "Richer PWA Install UI won’t be available on mobile. Please add at least one screenshot for which `form_factor` is not set or set to a value other than `wide`.",
	tooManyScreenshotsForDesktop: "No more than 8 screenshots will be displayed on desktop. The rest will be ignored.",
	tooManyScreenshotsForMobile: "No more than 5 screenshots will be displayed on mobile. The rest will be ignored.",
	screenshotsMustHaveSameAspectRatio: "All screenshots with the same `form_factor` must have the same aspect ratio as the first screenshot with that `form_factor`. Some screenshots will be ignored.",
	wcoFound: "Chrome has successfully found the {PH1} value for the {PH2} field in the {PH3}.",
	wcoNotFound: "Define {PH1} in the manifest to use the Window Controls Overlay API and customize your app's title bar.",
	customizePwaTitleBar: "Customize the window controls overlay of your PWA's title bar",
	wcoNeedHelpReadMore: "Need help? Read {PH1}.",
	selectWindowControlsOverlayEmulationOs: "Emulate the Window Controls Overlay on",
	onInvokeAlert: "Scrolled to {PH1}"
}, Ro = s("panels/application/AppManifestView.ts", P), F = a.bind(void 0, Ro);
function zo(e, t) {
	return y`
    <devtools-report-section-header
        ${Fo((n) => {
		t && n instanceof HTMLElement && t.scrollToSection.set(e, () => {
			n.scrollIntoView();
		});
	})}>
      ${e}
    </devtools-report-section-header>`;
}
function Bo(e, t, n, r) {
	return y`
    ${zo(F(P.errorsAndWarnings), r)}
    <div class="report-section" jslog=${T("errors-and-warnings")}>
      ${t?.map((e) => y`<div class="report-row">
          <devtools-icon
          name=${e.critical ? "cross-circle-filled" : "warning-filled"}
          style=${No({ color: e.critical ? "var(--icon-error)" : "var(--icon-warning)" })}>
        </devtools-icon>
        ${e.message}</div>
      `)}
      ${e?.map((e) => y`<div class="report-row">${e}</div>`)}
      ${n?.map((e) => y`<div class="report-row">${e}</div>`)}
    </div>`;
}
function Vo(e, t, n) {
	let { name: r, shortName: i, description: a, appId: o, recommendedId: s, hasId: c } = e;
	return y`${zo(F(P.identity), n)}
  <div class="report-section" jslog=${T("identity")}>
    <devtools-report-key>${F(P.name)}</devtools-report-key>
    <devtools-report-value>${r}</devtools-report-value>
    <devtools-report-key>${F(P.shortName)}</devtools-report-key>
    <devtools-report-value>${i}</devtools-report-value>
    <devtools-report-key>${F(P.description)}</devtools-report-key>
    <devtools-report-value>${a}</devtools-report-value>
    ${o && s ? y`
      <devtools-report-key aria-label="App Id">${F(P.computedAppId)}</devtools-report-key>
      <devtools-report-value jslog=${T("identity")}>
        ${o}
        <devtools-icon class="inline-icon" name="help" title=${F(P.appIdExplainer)}
            jslog=${Bt("help").track({ hover: !0 })}>
        </devtools-icon>
        <devtools-link href="https://developer.chrome.com/blog/pwa-manifest-id/"
                      jslogcontext="learn-more"
                      ${Fo(Go(F(P.identity), n))}>
          ${F(P.learnMore)}
        </devtools-link>
        ${c ? b : y`
          <div class="multiline-value">
            ${Ce(Ro, P.appIdNote, {
		PH1: y`<code>${s}</code>`,
		PH2: y`<devtools-button class="inline-button" @click=${t}
                          .iconName=${"copy"}
                          .variant=${h.ICON}
                          .size=${ft.SMALL}
                          .jslogContext=${"manifest.copy-id"}
                          .title=${F(P.copyToClipboard)}>
                        </devtools-button>`
	})}
        </div>`}
      </devtools-report-value>` : b}
    </div>`;
}
function Ho(e, t) {
	let { startUrl: n, completeStartUrl: r, themeColor: i, backgroundColor: a, orientation: o, display: s, newNoteUrl: c, hasNewNoteUrl: l, completeNewNoteUrl: u } = e;
	return y`${zo(F(P.presentation), t)}
    <div class="report-section" jslog=${T("presentation")}>
      <devtools-report-key>${F(P.startUrl)}</devtools-report-key>
      <devtools-report-value>
      ${r ? (() => {
		let e = Io(r, {
			text: n,
			tabStop: !0,
			jslogContext: "start-url"
		});
		return t.focusOnSection.set(F(P.presentation), () => e.focus()), e;
	})() : b}
      </devtools-report-value>
      <devtools-report-key>${F(P.themeColor)}</devtools-report-key>
      <devtools-report-value>${i ? y`<devtools-color-swatch .color=${i}></devtools-color-swatch>` : b}
      </devtools-report-value>
      <devtools-report-key>${F(P.backgroundColor)}</devtools-report-key>
      <devtools-report-value>${a ? y`<devtools-color-swatch .color=${a}></devtools-color-swatch>` : b}
      </devtools-report-value>
      <devtools-report-key>${F(P.orientation)}</devtools-report-key>
      <devtools-report-value>${o}</devtools-report-value>
      <devtools-report-key>${F(P.display)}</devtools-report-key>
      <devtools-report-value>${s}</devtools-report-value>
      ${u ? y`
        <devtools-report-key>${F(P.newNoteUrl)}</devtools-report-key>
        <devtools-report-value>${l ? Io(u, {
		text: c,
		tabStop: !0
	}) : b}
        </devtools-report-value>
      ` : b}
    </div>
  `;
}
function Uo(e, t) {
	return y`${zo(F(P.protocolHandlers), t)}
    <div class="report-row">
      <devtools-widget ${Lo(Ma, {
		protocolHandlers: e.protocolHandlers,
		manifestLink: e.manifestLink
	})}
        ${Fo(Go(F(P.protocolHandlers), t))}>
      </devtools-widget>
    </div>
    <devtools-report-divider></devtools-report-divider>`;
}
function Wo(e, t, n) {
	return y`
    <div class="image-wrapper">
      <img src=${e} alt=${F(P.imageFromS, { PH1: t })}
          width=${n}>
    </div>`;
}
function Go(e, t) {
	return (n) => {
		n instanceof HTMLElement && t.focusOnSection.set(e, () => n.focus());
	};
}
function Ko(e, t, n, r) {
	return y`${zo(F(P.icons), r)}
    <div class="report-section" jslog=${T("icons")}>
      <div class="report-row">
        <devtools-checkbox class="mask-checkbox"
            jslog=${Ft("show-minimal-safe-area-for-maskable-icons").track({ change: !0 })}
            @click=${(e) => n(e.target.checked)}
            ${Fo(Go(F(P.icons), r))}>
          ${F(P.showOnlyTheMinimumSafeAreaFor)}
        </devtools-checkbox>
      </div>
      <div class="report-row">
        ${Ce(Ro, P.needHelpReadOurS, { PH1: y`
            <devtools-link href="https://web.dev/maskable-icon/" jslogcontext="learn-more">
              ${F(P.documentationOnMaskableIcons)}
            </devtools-link>` })}
      </div>
      ${Array.from(e.icons).map(([e, n]) => y`
        <devtools-report-key>${e}</devtools-report-key>
        <devtools-report-value class=${Po({ "show-mask": !!t })}>
          ${n.filter((e) => "imageSrc" in e).map((e) => Wo(e.imageSrc, e.imageUrl, e.naturalWidth))}
        </devtools-report-value>
      `)}
    </div>`;
}
function qo(e) {
	return y`${e.shortcuts.map((e, t) => y`
    ${zo(F(P.shortcutS, { PH1: t + 1 }))}
    <div class="report-section" jslog=${T("shortcuts")}>
      <devtools-report-key>${F(P.name)}</devtools-report-key>
      <devtools-report-value>${e.name}</devtools-report-value>
      ${e.shortName ? y`
        <devtools-report-key>${F(P.shortName)}</devtools-report-key>
        <devtools-report-value>${e.shortName}</devtools-report-value>
      ` : b}
      ${e.description ? y`
        <devtools-report-key>${F(P.description)}</devtools-report-key>
        <devtools-report-value>${e.description}</devtools-report-value>
      ` : b}
      <devtools-report-key>${F(P.url)}</devtools-report-key>
      <devtools-report-value>
        ${Io(e.shortcutUrl, {
		text: e.url,
		tabStop: !0,
		jslogContext: "shortcut"
	})}
      </devtools-report-value>
      ${Array.from(e.icons).map(([e, t]) => y`
        <devtools-report-key>${e}</devtools-report-key>
        <devtools-report-value>
          ${t.filter((e) => "imageSrc" in e).map((e) => Wo(e.imageSrc, e.imageUrl, e.naturalWidth))}
        </devtools-report-value>
      `)}
    </div>`)}`;
}
function Jo(e) {
	return y`${e.screenshots.map(({ screenshot: e, processedImage: t }, n) => y`
    ${zo(F(P.screenshotS, { PH1: n + 1 }))}
    <div class="report-section" jslog=${T("screenshots")}>
      ${e.form_factor ? y`<devtools-report-key>${F(P.formFactor)}</devtools-report-key>
          <devtools-report-value>${e.form_factor}</devtools-report-value>` : b}
      ${e.label ? y`<devtools-report-key>${F(P.label)}</devtools-report-key>
          <devtools-report-value>${e.label}</devtools-report-value>` : b}
      ${e.platform ? y`<devtools-report-key>${F(P.platform)}</devtools-report-key>
          <devtools-report-value>${e.platform}</devtools-report-value>` : b}
      ${"imageSrc" in t ? y`
        <devtools-report-key>${t.title}</devtools-report-key>
        <devtools-report-value>
          ${Wo(t.imageSrc, t.imageUrl, t.naturalWidth)}
        </devtools-report-value>` : b}
    </div>
  `)}`;
}
function Yo(e) {
	return y`${zo(F(P.installability))}
    ${Zo(e).map((e) => y`
      <div class="report-row">
        ${e}
      </div>
    `)}`;
}
function Xo(e, t, n, r, i) {
	return y`
    ${zo(F(P.windowControlsOverlay), i)}
    <div class="report-section" jslog=${T("window-controls-overlay")}>
      ${e?.hasWco && i ? y`
        <div class="report-row">
          <devtools-icon class="inline-icon" name="check-circle"></devtools-icon>
          ${Ce(Ro, P.wcoFound, {
		PH1: y`<code class="wco">window-controls-overlay</code>`,
		PH2: y`<code>
              <devtools-link
                href="https://developer.mozilla.org/en-US/docs/Web/Manifest/display_override"
                jslogcontext="display-override"
                ${Fo(Go(F(P.windowControlsOverlay), i))}>
                display-override
              </devtools-link>
            </code>`,
		PH3: y`${cr.linkifyURL(e.url)}`
	})}
        </div>
        ${t && n && r ? Qo(t, n, r) : b}` : y`
          <div class="report-row">
            <devtools-icon class="inline-icon" name="info"></devtools-icon>
            ${Ce(Ro, P.wcoNotFound, { PH1: y`<code>
                <devtools-link
                    href="https://developer.mozilla.org/en-US/docs/Web/Manifest/display_override"
                    jslogcontext="display-override"
                    ${Fo(Go(F(P.windowControlsOverlay), i))}>
                  display-override
                </devtools-link>
              </code>` })}
          </div>`}
        <div class="report-row">
          ${Ce(Ro, P.wcoNeedHelpReadMore, { PH1: y`<devtools-link
              href="https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/how-to/window-controls-overlay"
              jslogcontext="customize-pwa-tittle-bar">
            ${F(P.customizePwaTitleBar)}
          </devtools-link>` })}
        </div>
    </div>`;
}
function Zo(e) {
	let t = [];
	for (let n of e) {
		let e;
		switch (n.errorId) {
			case "not-in-main-frame":
				e = F(P.pageIsNotLoadedInTheMainFrame);
				break;
			case "not-from-secure-origin":
				e = F(P.pageIsNotServedFromASecureOrigin);
				break;
			case "no-manifest":
				e = F(P.pageHasNoManifestLinkUrl);
				break;
			case "manifest-empty":
				e = F(P.manifestCouldNotBeFetchedIsEmpty);
				break;
			case "start-url-not-valid":
				e = F(P.manifestStartUrlIsNotValid);
				break;
			case "manifest-missing-name-or-short-name":
				e = F(P.manifestDoesNotContainANameOr);
				break;
			case "manifest-display-not-supported":
				e = F(P.manifestDisplayPropertyMustBeOne);
				break;
			case "manifest-missing-suitable-icon":
				if (n.errorArguments.length !== 1 || n.errorArguments[0].name !== "minimum-icon-size-in-pixels") {
					console.error("Installability error does not have the correct errorArguments");
					break;
				}
				e = F(P.manifestDoesNotContainASuitable, { PH1: n.errorArguments[0].value });
				break;
			case "no-acceptable-icon":
				if (n.errorArguments.length !== 1 || n.errorArguments[0].name !== "minimum-icon-size-in-pixels") {
					console.error("Installability error does not have the correct errorArguments");
					break;
				}
				e = F(P.noSuppliedIconIsAtLeastSpxSquare, { PH1: n.errorArguments[0].value });
				break;
			case "cannot-download-icon":
				e = F(P.couldNotDownloadARequiredIcon);
				break;
			case "no-icon-available":
				e = F(P.downloadedIconWasEmptyOr);
				break;
			case "platform-not-supported-on-android":
				e = F(P.theSpecifiedApplicationPlatform);
				break;
			case "no-id-specified":
				e = F(P.noPlayStoreIdProvided);
				break;
			case "ids-do-not-match":
				e = F(P.thePlayStoreAppUrlAndPlayStoreId);
				break;
			case "already-installed":
				e = F(P.theAppIsAlreadyInstalled);
				break;
			case "url-not-supported-for-webapk":
				e = F(P.aUrlInTheManifestContainsA);
				break;
			case "in-incognito":
				e = F(P.pageIsLoadedInAnIncognitoWindow);
				break;
			case "not-offline-capable":
				e = F(P.pageDoesNotWorkOffline);
				break;
			case "no-url-for-service-worker":
				e = F(P.couldNotCheckServiceWorker);
				break;
			case "prefer-related-applications":
				e = F(P.manifestSpecifies);
				break;
			case "prefer-related-applications-only-beta-stable":
				e = F(P.preferrelatedapplicationsIsOnly);
				break;
			case "manifest-display-override-not-supported":
				e = F(P.manifestContainsDisplayoverride);
				break;
			case "warn-not-offline-capable":
				e = F(P.pageDoesNotWorkOfflineThePage, { PH1: "https://developer.chrome.com/blog/improved-pwa-offline-detection/" });
				break;
			default: console.error(`Installability error id '${n.errorId}' is not recognized`);
		}
		e && t.push(e);
	}
	return t;
}
function Qo(e, t, n) {
	return y`<div class="report-row">
      <devtools-checkbox @click=${(e) => n(e.target.checked)}
          title=${F(P.selectWindowControlsOverlayEmulationOs)}>
        ${F(P.selectWindowControlsOverlayEmulationOs)}
      </devtools-checkbox>
      <select value=${e}
              @change=${(e) => {
		let n = e.target, r = n.options[n.selectedIndex].value;
		t(r);
	}}
             .selectedIndex=${0}>
        <option value=${gn.WINDOWS}
                jslog=${je("windows").track({ click: !0 })}>
          Windows
        </option>
        <option value=${gn.MAC}
                jslog=${je("macos").track({ click: !0 })}>
          macOS
        </option>
        <option value=${gn.LINUX}
                jslog=${je("linux").track({ click: !0 })}>
          Linux
        </option>
      </select>
    </div>`;
}
var $o = (e, t, n) => {
	let { isEmpty: r, identityData: i, presentationData: a, protocolHandlersData: o, iconsData: s, shortcutsData: c, screenshotsData: l, installabilityErrors: u, warnings: d, errors: ee, imageErrors: f, maskedIcons: p, windowControlsData: te, selectedPlatform: ne, onSelectOs: m, onToggleWcoToolbar: re, onToggleIconMasked: ie, onCopyId: h, url: ae } = e;
	_(y`
    <style>${ci}</style>
    <style>${Ee}</style>
    ${r ? Lo(Ae, {
		header: F(P.noManifestDetected),
		text: F(P.manifestDescription),
		link: "https://web.dev/add-manifest/"
	}) : y`
    <devtools-report .data=${{
		reportTitle: F(P.appManifest),
		reportUrl: ae
	}}>
      ${Bo(d, ee, f, t)}
      ${u?.length ? Yo(u) : b}
      ${i && h ? Vo(i, h, t) : b}
      ${a ? Ho(a, t) : b}
      ${o ? Uo(o, t) : b}
      ${s && ie ? Ko(s, !!p, ie, t) : b}
      ${te && t ? Xo(te, ne, m, re, t) : b}
      ${c ? qo(c) : b}
      ${l ? Jo(l) : b}
    </devtools-report>`}`, n);
}, es = class extends t(S) {
	registeredListeners;
	target;
	resourceTreeModel;
	serviceWorkerManager;
	overlayModel;
	manifestUrl;
	manifestData;
	manifestErrors;
	installabilityErrors;
	appIdResponse;
	wcoToolbarEnabled = !1;
	maskedIcons = !1;
	view;
	output = {
		scrollToSection: /* @__PURE__ */ new Map(),
		focusOnSection: /* @__PURE__ */ new Map()
	};
	constructor(e = $o) {
		super({
			jslog: `${D("manifest")}`,
			useShadowDom: !0
		}), this.view = e, C.instance().observeTargets(this), this.registeredListeners = [], this.manifestUrl = "", this.manifestData = null, this.manifestErrors = [], this.installabilityErrors = [], this.appIdResponse = null;
	}
	scrollToSection(e) {
		let t = this.output.scrollToSection.get(e);
		t && (t(), Ke.alert(F(P.onInvokeAlert, { PH1: e })));
	}
	focusOnSection(e) {
		let t = this.output.focusOnSection.get(e);
		return t ? (t(), !0) : !1;
	}
	getStaticSections() {
		return [
			{
				title: F(P.identity),
				jslogContext: "identity"
			},
			{
				title: F(P.presentation),
				jslogContext: "presentation"
			},
			{
				title: F(P.protocolHandlers),
				jslogContext: "protocol-handlers"
			},
			{
				title: F(P.icons),
				jslogContext: "icons"
			},
			{
				title: F(P.windowControlsOverlay),
				jslogContext: "window-controls"
			}
		];
	}
	getManifestElement() {
		return this.contentElement;
	}
	targetAdded(e) {
		e === C.instance().primaryPageTarget() && (this.target = e, this.resourceTreeModel = e.model(qe), this.serviceWorkerManager = e.model(rn), this.overlayModel = e.model(Xt), this.resourceTreeModel && this.serviceWorkerManager && this.overlayModel && (this.updateManifest(!0), this.registeredListeners = [this.resourceTreeModel.addEventListener(g.DOMContentLoaded, () => {
			this.updateManifest(!0);
		}), this.serviceWorkerManager.addEventListener(xn.REGISTRATION_UPDATED, () => {
			this.updateManifest(!1);
		})]));
	}
	targetRemoved(e) {
		this.target === e && this.resourceTreeModel && this.serviceWorkerManager && this.overlayModel && (delete this.resourceTreeModel, delete this.serviceWorkerManager, delete this.overlayModel, yt(this.registeredListeners));
	}
	async updateManifest(e) {
		if (!this.resourceTreeModel) return;
		let [{ url: t, data: n, errors: r }, i, a] = await Promise.all([
			this.resourceTreeModel.fetchAppManifest(),
			this.resourceTreeModel.getInstallabilityErrors(),
			this.resourceTreeModel.getAppId()
		]);
		this.manifestUrl = t, this.manifestData = n, this.manifestErrors = r, this.installabilityErrors = i, this.appIdResponse = a, e ? await this.performUpdate() : await this.requestUpdate();
	}
	async performUpdate() {
		let e = this.manifestUrl, t = this.manifestData, n = this.manifestErrors, r = this.installabilityErrors, i = this.appIdResponse, a = i?.appId || null, o = i?.recommendedId || null;
		if ((!t || t === "{}") && !n.length) {
			this.view({ isEmpty: !0 }, this.output, this.contentElement), this.dispatchEventToListeners("ManifestDetected", !1);
			return;
		}
		if (this.dispatchEventToListeners("ManifestDetected", !0), !t) {
			this.view({
				url: e,
				errors: n
			}, this.output, this.contentElement);
			return;
		}
		t.charCodeAt(0) === 65279 && (t = t.slice(1));
		let s = JSON.parse(t), c = this.processIdentity(s, a, o), l = this.processPresentation(s, e), u = this.processProtocolHandlers(s, e), d = await this.processIcons(s, e), ee = await this.processShortcuts(s, e), f = await this.processScreenshots(s, e), p = [
			...c.warnings,
			...ee.warnings,
			...f.warnings
		], te = [
			...d.imageResourceErrors,
			...ee.imageResourceErrors,
			...f.imageResourceErrors
		], ne = await this.processWindowControls(s, e), m = this.overlayModel?.getWindowControlsConfig().selectedPlatform, re = this.overlayModel ? (e) => this.onSelectOs(e, ne.themeColor) : void 0, ie = this.overlayModel ? (e) => this.onToggleWcoToolbar(e) : void 0, h = o ? () => {
			Ke.alert(F(P.copiedToClipboard, { PH1: o })), st.copyText(o);
		} : void 0;
		this.view({
			maskedIcons: this.maskedIcons,
			parsedManifest: s,
			url: e,
			identityData: c,
			presentationData: l,
			protocolHandlersData: u,
			iconsData: d,
			shortcutsData: ee,
			screenshotsData: f,
			installabilityErrors: r,
			warnings: p,
			errors: n,
			imageErrors: te,
			windowControlsData: ne,
			selectedPlatform: m,
			onSelectOs: re,
			onToggleWcoToolbar: ie,
			onCopyId: h,
			onToggleIconMasked: (e) => {
				this.maskedIcons = e, this.requestUpdate();
			}
		}, this.output, this.contentElement);
	}
	stringProperty(e, t) {
		let n = e[t];
		return typeof n == "string" ? n : "";
	}
	async loadImage(e) {
		let t = this.resourceTreeModel?.mainFrame?.id;
		if (!this.target) throw Error("no target");
		if (!t) throw Error("no main frame found");
		let n;
		try {
			n = (await ye.instance().loadResource(e, {
				target: this.target,
				frameId: t,
				initiatorUrl: this.target.inspectedURL()
			}, !0)).content;
		} catch {
			return null;
		}
		let r = document.createElement("img"), i = new Promise((e, t) => {
			r.onload = e, r.onerror = t;
		});
		r.src = "data:application/octet-stream;base64," + await u(n);
		try {
			return await i, {
				naturalWidth: r.naturalWidth,
				naturalHeight: r.naturalHeight,
				src: r.src
			};
		} catch {}
		return null;
	}
	parseSizes(e, t, n, r) {
		let i = e ? e.split(/\s+/) : [], a = [];
		for (let e of i) {
			if (e === "any") {
				a.find((e) => "any" in e) || a.push({
					any: "any",
					formatted: "any"
				});
				continue;
			}
			let i = e.match(/^(?<width>\d+)[xX](?<height>\d+)$/);
			if (i) {
				let e = parseInt(i.groups?.width || "", 10), t = parseInt(i.groups?.height || "", 10), n = `${e}×${t}px`;
				a.push({
					width: e,
					height: t,
					formatted: n
				});
			} else r.push(F(P.sSShouldSpecifyItsSizeAs, {
				PH1: t,
				PH2: n
			}));
		}
		return a;
	}
	checkSizeProblem(e, t, n, r, i) {
		if ("any" in e) return { hasSquareSize: t === n };
		let a = e.width === e.height;
		return t !== e.width && n !== e.height ? {
			error: F(P.actualSizeSspxOfSSDoesNotMatch, {
				PH1: t,
				PH2: n,
				PH3: r,
				PH4: i,
				PH5: e.width,
				PH6: e.height
			}),
			hasSquareSize: a
		} : t === e.width ? n === e.height ? { hasSquareSize: a } : {
			error: F(P.actualHeightSpxOfSSDoesNotMatch, {
				PH1: n,
				PH2: r,
				PH3: i,
				PH4: e.height
			}),
			hasSquareSize: a
		} : {
			error: F(P.actualWidthSpxOfSSDoesNotMatch, {
				PH1: t,
				PH2: r,
				PH3: i,
				PH4: e.width
			}),
			hasSquareSize: a
		};
	}
	async processImageResource(e, t, n) {
		let r = [], i = F(n ? P.screenshot : P.icon);
		if (!t.src) return r.push(F(P.sSrcIsNotSet, { PH1: i })), { imageResourceErrors: r };
		let a = re.completeURL(e, t.src);
		if (!a) return r.push(F(P.sUrlSFailedToParse, {
			PH1: i,
			PH2: t.src
		})), {
			imageResourceErrors: r,
			imageUrl: t.src
		};
		let o = await this.loadImage(a);
		if (!o) return r.push(F(P.sSFailedToLoad, {
			PH1: i,
			PH2: a
		})), {
			imageResourceErrors: r,
			imageUrl: a
		};
		let { src: s, naturalWidth: c, naturalHeight: l } = o, u = this.parseSizes(t.sizes, i, a, r), d = u.map((e) => e.formatted).join(" ") + "\n" + (t.type || ""), ee = !1;
		if (!t.sizes) r.push(F(P.sSDoesNotSpecifyItsSizeInThe, {
			PH1: i,
			PH2: a
		}));
		else {
			n && u.length > 0 && "any" in u[0] && r.push(F(P.screenshotPixelSize, { url: a }));
			for (let e of u) {
				let { error: t, hasSquareSize: o } = this.checkSizeProblem(e, c, l, i, a);
				if (ee ||= o, t) r.push(t);
				else if (n) {
					let t = "any" in e ? c : e.width, n = "any" in e ? l : e.height;
					t < 320 || n < 320 ? r.push(F(P.sSSizeShouldBeAtLeast320, {
						PH1: i,
						PH2: a
					})) : t > 3840 || n > 3840 ? r.push(F(P.sSSizeShouldBeAtMost3840, {
						PH1: i,
						PH2: a
					})) : t > n * 2.3 ? r.push(F(P.sSWidthDoesNotComplyWithRatioRequirement, {
						PH1: i,
						PH2: a
					})) : n > t * 2.3 && r.push(F(P.sSHeightDoesNotComplyWithRatioRequirement, {
						PH1: i,
						PH2: a
					}));
				}
			}
		}
		let f = typeof t.purpose == "string" ? t.purpose.toLowerCase() : "";
		return f.includes("any") && f.includes("maskable") && r.push(F(P.avoidPurposeAnyAndMaskable)), {
			imageResourceErrors: r,
			squareSizedIconAvailable: ee,
			naturalWidth: c,
			naturalHeight: l,
			title: d,
			imageSrc: s,
			imageUrl: a
		};
	}
	async onToggleWcoToolbar(e) {
		this.wcoToolbarEnabled = e, this.overlayModel && await this.overlayModel.toggleWindowControlsToolbar(this.wcoToolbarEnabled);
	}
	async onSelectOs(e, t) {
		this.overlayModel && (this.overlayModel.setWindowControlsPlatform(e), this.overlayModel.setWindowControlsThemeColor(t), await this.overlayModel.toggleWindowControlsToolbar(this.wcoToolbarEnabled));
	}
	processIdentity(e, t, n) {
		let r = this.stringProperty(e, "description"), i = [];
		return r.length > 300 && i.push(F(P.descriptionMayBeTruncated)), {
			name: this.stringProperty(e, "name"),
			shortName: this.stringProperty(e, "short_name"),
			description: this.stringProperty(e, "description"),
			appId: t,
			recommendedId: n,
			hasId: !!this.stringProperty(e, "id"),
			warnings: i
		};
	}
	async processIcons(e, t) {
		let n = e.icons || [], r = [], i = [], a = !1;
		for (let e of n) {
			let n = await this.processImageResource(t, e, !1);
			i.push(n), r.push(...n.imageResourceErrors), n.squareSizedIconAvailable && (a = !0);
		}
		let o = Map.groupBy(i.filter((e) => "title" in e), (e) => e.title);
		return a || r.push(F(P.sSShouldHaveSquareIcon)), {
			icons: o,
			imageResourceErrors: r
		};
	}
	async processShortcuts(e, t) {
		let n = e.shortcuts || [], r = [], i = [], a = [];
		n.length > 4 && i.push(F(P.shortcutsMayBeNotAvailable));
		let o = 1;
		for (let e of n) {
			let n = re.completeURL(t, e.url), i = e.icons || [], s = [], c = !1;
			for (let e of i) {
				let n = await this.processImageResource(t, e, !1);
				if (s.push(n), a.push(...n.imageResourceErrors), !c && e.sizes) {
					let t = e.sizes.match(/^(\d+)x(\d+)$/);
					t && Number(t[1]) >= 96 && Number(t[2]) >= 96 && (c = !0);
				}
			}
			let l = Map.groupBy(s.filter((e) => "title" in e), (e) => e.title);
			r.push({
				name: e.name,
				shortName: e.short_name,
				description: e.description,
				url: e.url,
				shortcutUrl: n,
				icons: l
			}), c || a.push(F(P.shortcutSShouldIncludeAXPixel, { PH1: o })), o++;
		}
		return {
			shortcuts: r,
			warnings: i,
			imageResourceErrors: a
		};
	}
	async processScreenshots(e, t) {
		let n = e.screenshots || [], r = [], i = [], a = [], o = !1, s = /* @__PURE__ */ new Map();
		for (let e of n) {
			let n = await this.processImageResource(t, e, !0);
			if (r.push({
				screenshot: e,
				processedImage: n
			}), a.push(...n.imageResourceErrors), e.form_factor && "naturalWidth" in n) {
				let t = n.naturalWidth, r = n.naturalHeight;
				s.has(e.form_factor) || s.set(e.form_factor, {
					width: t,
					height: r
				});
				let i = s.get(e.form_factor);
				i && (o ||= t * i.height !== r * i.width);
			}
		}
		o && i.push(F(P.screenshotsMustHaveSameAspectRatio));
		let c = n.filter((e) => e.form_factor === "wide"), l = n.filter((e) => e.form_factor !== "wide");
		return c.length < 1 && i.push(F(P.noScreenshotsForRicherPWAInstallOnDesktop)), l.length < 1 && i.push(F(P.noScreenshotsForRicherPWAInstallOnMobile)), c.length > 8 && i.push(F(P.tooManyScreenshotsForDesktop)), l.length > 5 && i.push(F(P.tooManyScreenshotsForMobile)), {
			screenshots: r,
			warnings: i,
			imageResourceErrors: a
		};
	}
	async processWindowControls(e, t) {
		let n = (e.display_override || []).includes("window-controls-overlay"), r = this.stringProperty(e, "theme_color"), i = !1;
		return this.overlayModel && (i = await this.overlayModel.hasStyleSheetText(t)), {
			hasWco: n,
			themeColor: r,
			wcoStyleSheetText: i,
			url: t
		};
	}
	processPresentation(e, t) {
		let n = this.stringProperty(e, "start_url"), r = n ? re.completeURL(t, n) : null, a = this.stringProperty(e, "theme_color"), o = a ? i(a) ?? i("white") : null, s = this.stringProperty(e, "background_color"), c = s ? i(s) ?? i("white") : null, l = (e.note_taking || {}).new_note_url, u = typeof l == "string", d = u ? re.completeURL(t, l) : null;
		return {
			startUrl: n,
			completeStartUrl: r,
			themeColor: o,
			backgroundColor: c,
			orientation: this.stringProperty(e, "orientation"),
			display: this.stringProperty(e, "display"),
			newNoteUrl: l,
			hasNewNoteUrl: u,
			completeNewNoteUrl: d
		};
	}
	processProtocolHandlers(e, t) {
		return {
			protocolHandlers: e.protocol_handlers || [],
			manifestLink: t
		};
	}
}, ts = /* @__PURE__ */ function(e) {
	return e.MANIFEST_DETECTED = "ManifestDetected", e;
}({}), ns = { backForwardCache: "Back/forward cache" }, rs = s("panels/application/BackForwardCacheTreeElement.ts", ns), is = a.bind(void 0, rs), as = class extends A {
	view;
	constructor(e) {
		super(e, is(ns.backForwardCache), !1, "bfcache");
		let t = v("database");
		this.setLeadingIcons([t]);
	}
	get itemURL() {
		return "bfcache://";
	}
	onselect(e) {
		return super.onselect(e), this.view ||= new ji(), this.showView(this.view), Yt.instance().panelShown("back-forward-cache"), !1;
	}
}, os = /* @__PURE__ */ e({
	BackgroundServiceModel: () => ss,
	Events: () => cs
}), ss = class extends Et {
	backgroundServiceAgent;
	events;
	constructor(e) {
		super(e), this.backgroundServiceAgent = e.backgroundServiceAgent(), e.registerBackgroundServiceDispatcher(this), this.events = /* @__PURE__ */ new Map();
	}
	enable(e) {
		this.events.set(e, []), this.backgroundServiceAgent.invoke_startObserving({ service: e });
	}
	setRecording(e, t) {
		this.backgroundServiceAgent.invoke_setRecording({
			shouldRecord: e,
			service: t
		});
	}
	clearEvents(e) {
		this.events.set(e, []), this.backgroundServiceAgent.invoke_clearEvents({ service: e });
	}
	getEvents(e) {
		return this.events.get(e) || [];
	}
	recordingStateChanged({ isRecording: e, service: t }) {
		this.dispatchEventToListeners("RecordingStateChanged", {
			isRecording: e,
			serviceName: t
		});
	}
	backgroundServiceEventReceived({ backgroundServiceEvent: e }) {
		this.events.get(e.service).push(e), this.dispatchEventToListeners("BackgroundServiceEventReceived", e);
	}
};
Et.register(ss, {
	capabilities: Me.BROWSER,
	autostart: !1
});
var cs = /* @__PURE__ */ function(e) {
	return e.RecordingStateChanged = "RecordingStateChanged", e.BackgroundServiceEventReceived = "BackgroundServiceEventReceived", e;
}({}), ls = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.background-service-toolbar {\n  background-color: var(--sys-color-cdt-base-container);\n  border-bottom: var(--sys-size-1) solid var(--sys-color-divider);\n}\n\n.data-grid {\n  flex: auto;\n  border: none;\n}\n\n[slot=\"insertion-point-main\"] {\n  overflow: auto;\n}\n\n.background-service-preview {\n  position: absolute;\n  background-color: var(--sys-color-cdt-base-container);\n  justify-content: center;\n  align-items: center;\n  overflow: auto;\n  font-size: 13px;\n  color: var(--sys-color-on-surface-subtle);\n}\n\n.background-service-preview > div {\n  max-width: 450px;\n  margin: 10px;\n  text-align: center;\n}\n\n.background-service-preview > div > p {\n  flex: none;\n  white-space: pre-line;\n}\n\n.background-service-shortcut {\n  color: var(--sys-color-on-surface-subtle);\n}\n\n.background-service-metadata {\n  padding-left: 5px;\n  padding-top: 10px;\n}\n\n.background-service-metadata-entry {\n  padding-left: 10px;\n  padding-bottom: 5px;\n}\n\n.background-service-metadata-name {\n  color: var(--sys-color-on-surface-subtle);\n  display: inline-block;\n  margin-right: 0.25em;\n  font-weight: bold;\n}\n\n.background-service-metadata-value {\n  display: inline;\n  margin-right: 1em;\n  white-space: pre-wrap;\n  word-break: break-all;\n  user-select: text;\n}\n\n.background-service-empty-value {\n  color: var(--sys-color-state-disabled);\n  font-style: italic;\n}\n\n.background-service-record-inline-button {\n  margin-bottom: 6px;\n}\n", us = /* @__PURE__ */ e({
	ActionDelegate: () => ms,
	BackgroundServiceView: () => fs,
	EventDataNode: () => ps
}), I = {
	backgroundFetch: "Background fetch",
	backgroundSync: "Background sync",
	pushMessaging: "Push messaging",
	notifications: "Notifications",
	paymentHandler: "Payment handler",
	periodicBackgroundSync: "Periodic background sync",
	clear: "Clear",
	saveEvents: "Save events",
	showEventsFromOtherDomains: "Show events from other domains",
	showEventsForOtherStorageKeys: "Show events from other storage partitions",
	stopRecordingEvents: "Stop recording events",
	startRecordingEvents: "Start recording events",
	timestamp: "Timestamp",
	event: "Event",
	origin: "Origin",
	storageKey: "Storage Key",
	swScope: "Service Worker Scope",
	instanceId: "Instance ID",
	backgroundServices: "Background services",
	noEventSelected: "No event selected",
	selectAnEventToViewMetadata: "Select an event to view its metadata",
	recordingSActivity: "Recording {PH1} activity…",
	noRecording: "No recording yet",
	devtoolsWillRecordAllSActivity: "DevTools will record all {PH1} activity for up to 3 days, even when closed.",
	startRecordingToDebug: "Start to debug background services by using the \"{PH1}\" button or by pressing {PH2}.",
	empty: "empty",
	noMetadataForThisEvent: "No metadata for this event"
}, ds = s("panels/application/BackgroundServiceView.ts", I), L = a.bind(void 0, ds), fs = class e extends S {
	serviceName;
	model;
	serviceWorkerManager;
	securityOriginManager;
	storageKeyManager;
	recordAction;
	recordButton;
	originCheckbox;
	storageKeyCheckbox;
	saveButton;
	toolbar;
	splitWidget;
	dataGrid;
	previewPanel;
	selectedEventNode;
	preview;
	static getUIString(e) {
		switch (e) {
			case Je.ServiceName.BackgroundFetch: return L(I.backgroundFetch);
			case Je.ServiceName.BackgroundSync: return L(I.backgroundSync);
			case Je.ServiceName.PushMessaging: return L(I.pushMessaging);
			case Je.ServiceName.Notifications: return L(I.notifications);
			case Je.ServiceName.PaymentHandler: return L(I.paymentHandler);
			case Je.ServiceName.PeriodicBackgroundSync: return L(I.periodicBackgroundSync);
			default: return "";
		}
	}
	constructor(e, t) {
		if (super({
			jslog: `${D().context(Xn(e))}`,
			useShadowDom: !0
		}), this.registerRequiredCSS(Nn, ls), this.serviceName = e, this.model = t, this.model.addEventListener(cs.RecordingStateChanged, this.onRecordingStateChanged, this), this.model.addEventListener(cs.BackgroundServiceEventReceived, this.onEventReceived, this), this.model.enable(this.serviceName), this.serviceWorkerManager = this.model.target().model(rn), this.securityOriginManager = this.model.target().model(at), !this.securityOriginManager) throw Error("SecurityOriginManager instance is missing");
		if (this.securityOriginManager.addEventListener(we.MainSecurityOriginChanged, () => this.onOriginChanged()), this.storageKeyManager = this.model.target().model(Oe), !this.storageKeyManager) throw Error("StorageKeyManager instance is missing");
		this.storageKeyManager.addEventListener($e.MAIN_STORAGE_KEY_CHANGED, () => this.onStorageKeyChanged()), this.recordAction = en.instance().getAction("background-service.toggle-recording"), this.toolbar = this.contentElement.createChild("devtools-toolbar", "background-service-toolbar"), this.toolbar.setAttribute("jslog", `${Qt()}`), this.setupToolbar(), this.splitWidget = new it(!1, !0), this.splitWidget.show(this.contentElement), this.dataGrid = this.createDataGrid(), this.previewPanel = new S(), this.previewPanel.element.setAttribute("jslog", `${D("preview").track({ resize: !0 })}`), this.selectedEventNode = null, this.preview = null, this.splitWidget.setMainWidget(this.dataGrid.asWidget()), this.splitWidget.setSidebarWidget(this.previewPanel), this.splitWidget.hideMain(), this.showPreview(null);
	}
	getDataGrid() {
		return this.dataGrid;
	}
	async setupToolbar() {
		this.toolbar.wrappable = !0, this.recordButton = ct.createActionButton(this.recordAction), this.recordButton.toggleOnClick(!1), this.toolbar.appendToolbarItem(this.recordButton);
		let e = new rt(L(I.clear), "clear", void 0, "background-service.clear");
		e.addEventListener(rt.Events.CLICK, () => this.clearEvents()), this.toolbar.appendToolbarItem(e), this.toolbar.appendSeparator(), this.saveButton = new rt(L(I.saveEvents), "download", void 0, "background-service.save-events"), this.saveButton.addEventListener(rt.Events.CLICK, (e) => {
			this.saveToFile();
		}), this.saveButton.setEnabled(!1), this.toolbar.appendToolbarItem(this.saveButton), this.toolbar.appendSeparator(), this.originCheckbox = new pt(L(I.showEventsFromOtherDomains), L(I.showEventsFromOtherDomains), () => this.refreshView(), "show-events-from-other-domains"), this.toolbar.appendToolbarItem(this.originCheckbox), this.storageKeyCheckbox = new pt(L(I.showEventsForOtherStorageKeys), L(I.showEventsForOtherStorageKeys), () => this.refreshView(), "show-events-from-other-partitions"), this.toolbar.appendToolbarItem(this.storageKeyCheckbox);
	}
	refreshView() {
		this.clearView();
		let e = this.model.getEvents(this.serviceName).filter((e) => this.acceptEvent(e));
		for (let t of e) this.addEvent(t);
	}
	clearView() {
		this.selectedEventNode = null, this.dataGrid.rootNode().removeChildren(), this.splitWidget.hideMain(), this.saveButton.setEnabled(!1), this.showPreview(null);
	}
	toggleRecording() {
		let t = !this.recordButton.isToggled();
		this.model.setRecording(t, this.serviceName);
		let n = e.getUIString(this.serviceName).toLowerCase();
		t && (Ke.alert(L(I.recordingSActivity, { PH1: n }) + " " + L(I.devtoolsWillRecordAllSActivity, { PH1: n })), this.preview?.focus());
	}
	clearEvents() {
		this.model.clearEvents(this.serviceName), this.clearView();
	}
	onRecordingStateChanged({ data: e }) {
		e.serviceName === this.serviceName && e.isRecording !== this.recordButton.isToggled() && (this.recordButton.setToggled(e.isRecording), this.updateRecordButtonTooltip(), this.showPreview(this.selectedEventNode));
	}
	updateRecordButtonTooltip() {
		let e = this.recordButton.isToggled() ? L(I.stopRecordingEvents) : L(I.startRecordingEvents);
		this.recordButton.setTitle(e, "background-service.toggle-recording");
	}
	onEventReceived({ data: e }) {
		this.acceptEvent(e) && this.addEvent(e);
	}
	onOriginChanged() {
		this.originCheckbox.checked() || this.refreshView();
	}
	onStorageKeyChanged() {
		this.storageKeyCheckbox.checked() || this.refreshView();
	}
	addEvent(e) {
		let t = new ps(this.createEventData(e), e.eventMetadata);
		this.dataGrid.rootNode().appendChild(t), this.splitWidget.showMode() !== ut.BOTH && this.splitWidget.showBoth(), this.dataGrid.rootNode().children.length === 1 && (this.saveButton.setEnabled(!0), this.showPreview(this.selectedEventNode));
	}
	createDataGrid() {
		let e = [
			{
				id: "id",
				title: "#",
				weight: 1,
				sortable: !1
			},
			{
				id: "timestamp",
				title: L(I.timestamp),
				weight: 7,
				sortable: !1
			},
			{
				id: "event-name",
				title: L(I.event),
				weight: 8,
				sortable: !1
			},
			{
				id: "origin",
				title: L(I.origin),
				weight: 8,
				sortable: !1
			},
			{
				id: "storage-key",
				title: L(I.storageKey),
				weight: 8,
				sortable: !1
			},
			{
				id: "sw-scope",
				title: L(I.swScope),
				weight: 4,
				sortable: !1
			},
			{
				id: "instance-id",
				title: L(I.instanceId),
				weight: 8,
				sortable: !1
			}
		], t = new Pr({
			displayName: L(I.backgroundServices),
			columns: e
		});
		return t.setStriped(!0), t.addEventListener(Lr.SELECTED_NODE, (e) => this.showPreview(e.data)), t;
	}
	createEventData(e) {
		let t = "", n = this.serviceWorkerManager ? this.serviceWorkerManager.registrations().get(e.serviceWorkerRegistrationId) : void 0;
		return n && (t = n.scopeURL.substr(n.securityOrigin.length)), {
			id: this.dataGrid.rootNode().children.length + 1,
			timestamp: fe(e.timestamp * 1e3, !0),
			origin: e.origin,
			"storage-key": e.storageKey,
			"sw-scope": t,
			"event-name": e.eventName,
			"instance-id": e.instanceId
		};
	}
	acceptEvent(e) {
		if (e.service !== this.serviceName) return !1;
		if (this.originCheckbox.checked() || this.storageKeyCheckbox.checked()) return !0;
		let t = e.origin.substr(0, e.origin.length - 1), n = e.storageKey;
		return this.securityOriginManager.securityOrigins().includes(t) || this.storageKeyManager.storageKeys().includes(n);
	}
	createLearnMoreLink() {
		let e = "https://developer.chrome.com/docs/devtools/javascript/background-services/";
		switch (this.serviceName) {
			case Je.ServiceName.BackgroundFetch:
				e += "#fetch";
				break;
			case Je.ServiceName.BackgroundSync:
				e += "#sync";
				break;
			case Je.ServiceName.PushMessaging:
				e += "#push";
				break;
			case Je.ServiceName.Notifications: e += "#notifications";
		}
		return e;
	}
	showPreview(t) {
		if (this.selectedEventNode && this.selectedEventNode === t) return;
		if (this.selectedEventNode = t, this.preview && this.preview.detach(), this.selectedEventNode) {
			this.preview = this.selectedEventNode.createPreview(), this.preview.show(this.previewPanel.contentElement);
			return;
		}
		let n;
		if (this.dataGrid.rootNode().children.length) n = new Ae(L(I.noEventSelected), L(I.selectAnEventToViewMetadata));
		else if (this.recordButton.isToggled()) {
			let t = e.getUIString(this.serviceName).toLowerCase();
			n = new Ae(L(I.recordingSActivity, { PH1: t }), L(I.devtoolsWillRecordAllSActivity, { PH1: t }));
		} else {
			let e = ve.instance().shortcutsForAction("background-service.toggle-recording")[0];
			n = new Ae(L(I.noRecording), L(I.startRecordingToDebug, {
				PH1: L(I.startRecordingEvents),
				PH2: e.title()
			})), n.link = this.createLearnMoreLink();
			let t = vt(L(I.startRecordingEvents), () => this.toggleRecording(), {
				jslogContext: "start-recording",
				variant: h.TONAL
			});
			n.contentElement.appendChild(t);
		}
		n.setDefaultFocusedElement(n.contentElement), this.preview = n, this.preview.show(this.previewPanel.contentElement);
	}
	async saveToFile() {
		let e = `${this.serviceName}-${Ne(/* @__PURE__ */ new Date())}.json`, t = new rr();
		if (!await t.open(e)) return;
		let n = this.model.getEvents(this.serviceName).filter((e) => this.acceptEvent(e));
		await t.write(JSON.stringify(n, void 0, 2)), t.close();
	}
}, ps = class extends Fr {
	eventMetadata;
	constructor(e, t) {
		super(e), this.eventMetadata = t.sort((e, t) => Yn(e.key, t.key));
	}
	createPreview() {
		let e = new S();
		e.element.classList.add("background-service-metadata"), e.element.setAttribute("jslog", `${T("metadata")}`);
		for (let t of this.eventMetadata) {
			let n = document.createElement("div");
			n.classList.add("background-service-metadata-entry"), n.createChild("div", "background-service-metadata-name").textContent = t.key + ": ", t.value ? n.createChild("div", "background-service-metadata-value source-code").textContent = t.value : n.createChild("div", "background-service-metadata-value background-service-empty-value").textContent = L(I.empty), e.element.appendChild(n);
		}
		if (!e.element.children.length) {
			let t = document.createElement("div");
			t.classList.add("background-service-metadata-entry"), t.createChild("div", "background-service-metadata-name background-service-empty-value").textContent = L(I.noMetadataForThisEvent), e.element.appendChild(t);
		}
		return e;
	}
}, ms = class {
	handleAction(e, t) {
		let n = e.flavor(fs);
		if (t === "background-service.toggle-recording") {
			if (!n) throw Error("BackgroundServiceView instance is missing");
			return n.toggleRecording(), !0;
		}
		return !1;
	}
}, hs = /* @__PURE__ */ e({
	BounceTrackingMitigationsTreeElement: () => ys,
	i18nString: () => vs
}), gs = { bounceTrackingMitigations: "Bounce tracking mitigations" }, _s = s("panels/application/BounceTrackingMitigationsTreeElement.ts", gs), vs = a.bind(void 0, _s), ys = class extends A {
	view;
	constructor(e) {
		super(e, vs(gs.bounceTrackingMitigations), !1, "bounce-tracking-mitigations");
		let t = v("database");
		this.setLeadingIcons([t]);
	}
	get itemURL() {
		return "bounce-tracking-mitigations://";
	}
	onselect(e) {
		return super.onselect(e), this.view ||= new Ui(), this.showView(this.view), Yt.instance().panelShown("bounce-tracking-mitigations"), !1;
	}
}, bs = /* @__PURE__ */ e({
	DeviceBoundSessionModelEvents: () => Ss,
	DeviceBoundSessionsModel: () => xs
}), xs = class extends c {
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ new Set();
	constructor() {
		super(), C.instance().observeModels(Vt, this, { scoped: !0 });
	}
	modelAdded(e) {
		e.addEventListener(Tt.DeviceBoundSessionsAdded, this.#n, this), e.addEventListener(Tt.DeviceBoundSessionEventOccurred, this.#i, this), e.enableDeviceBoundSessions();
	}
	modelRemoved(e) {
		e.removeEventListener(Tt.DeviceBoundSessionsAdded, this.#n, this), e.removeEventListener(Tt.DeviceBoundSessionEventOccurred, this.#i, this);
	}
	addVisibleSite(e) {
		this.#t.has(e) || (this.#t.add(e), this.dispatchEventToListeners("ADD_VISIBLE_SITE", { site: e }));
	}
	clearVisibleSites() {
		this.getPreserveLogSetting().get() || (this.#t.clear(), this.dispatchEventToListeners("CLEAR_VISIBLE_SITES"));
	}
	clearEvents() {
		if (this.getPreserveLogSetting().get()) return;
		let e = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
		for (let [r, i] of [...this.#e]) {
			let a = e.get(r), o = t.get(r);
			for (let [n, s] of i) s.eventsById.clear(), s.hasErrors && (s.hasErrors = !1, o || (o = [], t.set(r, o)), o.push(n)), !s.session && (i.delete(n), a || (a = [], e.set(r, a)), a.push(n));
			i.size === 0 && (this.#e.delete(r), n.add(r));
		}
		this.dispatchEventToListeners("CLEAR_EVENTS", {
			emptySessions: e,
			emptySites: n,
			noLongerFailedSessions: t
		});
	}
	deleteSession(e, t) {
		for (let n of C.instance().models(Vt, { scoped: !0 })) n.deleteDeviceBoundSession({
			site: e,
			id: t
		});
	}
	isSiteVisible(e) {
		return this.#t.has(e);
	}
	isSessionTerminated(e, t) {
		let n = this.getSession(e, t);
		return n !== void 0 && n.isSessionTerminated;
	}
	sessionHasErrors(e, t) {
		let n = this.getSession(e, t);
		return n !== void 0 && n.hasErrors;
	}
	getSession(e, t) {
		return this.#e.get(e)?.get(t);
	}
	getPreserveLogSetting() {
		return m.instance().createSetting("device-bound-sessions-preserve-log", !1);
	}
	#n({ data: e }) {
		for (let t of e) {
			let e = this.#r(t.key.site, t.key.id);
			e.session = t;
		}
		this.dispatchEventToListeners("INITIALIZE_SESSIONS", { sessions: e });
	}
	#r(e, t) {
		let n = this.#e.get(e);
		n || (n = /* @__PURE__ */ new Map(), this.#e.set(e, n));
		let r = n.get(t);
		return r || (r = {
			isSessionTerminated: !1,
			hasErrors: !1,
			eventsById: /* @__PURE__ */ new Map()
		}, n.set(t, r)), r;
	}
	#i({ data: e }) {
		let t = this.#r(e.site, e.sessionId);
		if (t.eventsById.has(e.eventId)) return;
		let n = {
			event: e,
			timestamp: /* @__PURE__ */ new Date()
		};
		t.eventsById.set(e.eventId, n);
		let r = e.creationEventDetails?.newSession || e.refreshEventDetails?.newSession;
		r && (t.session = r), e.succeeded && t.session && e.challengeEventDetails && (t.session.cachedChallenge = e.challengeEventDetails.challenge), e.succeeded && (e.terminationEventDetails ? t.isSessionTerminated = !0 : e.creationEventDetails && (t.isSessionTerminated = !1)), e.succeeded || (t.hasErrors = !0), this.dispatchEventToListeners("EVENT_OCCURRED", {
			site: n.event.site,
			sessionId: n.event.sessionId
		});
	}
}, Ss = /* @__PURE__ */ function(e) {
	return e.INITIALIZE_SESSIONS = "INITIALIZE_SESSIONS", e.ADD_VISIBLE_SITE = "ADD_VISIBLE_SITE", e.CLEAR_VISIBLE_SITES = "CLEAR_VISIBLE_SITES", e.EVENT_OCCURRED = "EVENT_OCCURRED", e.CLEAR_EVENTS = "CLEAR_EVENTS", e;
}({}), Cs = /* @__PURE__ */ e({ RootTreeElement: () => Ds }), ws = {
	deviceBoundSessions: "Device bound sessions",
	deviceBoundSessionsCategoryDescription: "On this page you can view device bound sessions and associated events",
	noSession: "No session",
	terminatedSession: "{sessionName}, Session terminated",
	sessionWithErrors: "{sessionName}, Session has errors",
	clear: "Clear"
}, Ts = s("panels/application/DeviceBoundSessionsTreeElement.ts", ws), Es = a.bind(void 0, Ts), Ds = class extends A {
	#e;
	#t = /* @__PURE__ */ new Map();
	constructor(e, t) {
		super(e, Es(ws.deviceBoundSessions), !0, "device-bound-sessions-root"), this.setLeadingIcons([v("lock-person")]), this.#e = t;
	}
	get itemURL() {
		return "device-bound-sessions://";
	}
	onselect(e) {
		return super.onselect(e), this.resourcesPanel.showDeviceBoundSessionDefault(this.#e, Es(ws.deviceBoundSessions), Es(ws.deviceBoundSessionsCategoryDescription)), !1;
	}
	onbind() {
		super.onbind(), this.#e.addEventListener(Ss.INITIALIZE_SESSIONS, this.#c, this), this.#e.addEventListener(Ss.ADD_VISIBLE_SITE, this.#l, this), this.#e.addEventListener(Ss.CLEAR_VISIBLE_SITES, this.#u, this), this.#e.addEventListener(Ss.EVENT_OCCURRED, this.#d, this), this.#e.addEventListener(Ss.CLEAR_EVENTS, this.#f, this);
	}
	onunbind() {
		super.onunbind(), this.#e.removeEventListener(Ss.INITIALIZE_SESSIONS, this.#c, this), this.#e.removeEventListener(Ss.ADD_VISIBLE_SITE, this.#l, this), this.#e.removeEventListener(Ss.CLEAR_VISIBLE_SITES, this.#u, this), this.#e.removeEventListener(Ss.EVENT_OCCURRED, this.#d, this), this.#e.removeEventListener(Ss.CLEAR_EVENTS, this.#f, this);
	}
	#n(e) {
		let t = this.#t.get(e);
		if (!t) return;
		let n = t.siteTreeElement, r = this.indexOfChild(n) >= 0, i = this.#e.isSiteVisible(e);
		if (i && !r) {
			this.appendChild(n);
			let e = [...n.children()];
			n.removeChildren();
			for (let t of e) n.appendChild(t);
		} else !i && r && this.removeChild(n);
	}
	#r(e, t, n) {
		let r = e.title;
		if (t) {
			e.listItemElement.classList.add("device-bound-session-terminated"), e.setLeadingIcons([v("database-off")]);
			let t = Es(ws.terminatedSession, { sessionName: r });
			ue(e.listItemElement, t);
			return;
		}
		if (e.listItemElement.classList.remove("device-bound-session-terminated"), n) {
			e.setLeadingIcons([v("warning")]);
			let t = Es(ws.sessionWithErrors, { sessionName: r });
			ue(e.listItemElement, t);
		} else e.setLeadingIcons([v("database")]), ue(e.listItemElement, r);
	}
	#i(e, t) {
		let n = this.#e.isSessionTerminated(e, t), r = this.#e.sessionHasErrors(e, t), i = this.#t.get(e);
		if (!i) return;
		let a = i.sessions.get(t);
		a && this.#r(a, n, r);
	}
	#a(e) {
		for (let [t, n] of e) {
			let e = this.#t.get(t);
			if (e) for (let r of n) {
				let n = e.sessions.get(r);
				if (n) {
					let e = this.#e.isSessionTerminated(t, r);
					this.#r(n, e, !1);
				}
			}
		}
	}
	#o(e, t) {
		let n = this.#t.get(e);
		if (!n) {
			let t = new A(this.resourcesPanel, e, !0, "device-bound-sessions-site");
			t.setLeadingIcons([v("cloud")]), t.itemURL = `device-bound-sessions://${e}`;
			let r = t.onselect.bind(t);
			t.onselect = (e) => (r(e), this.resourcesPanel.showDeviceBoundSessionDefault(this.#e, Es(ws.deviceBoundSessions), Es(ws.deviceBoundSessionsCategoryDescription)), !1), n = {
				siteTreeElement: t,
				sessions: /* @__PURE__ */ new Map()
			}, this.#t.set(e, n);
		}
		if (!n.sessions.has(t)) {
			let r = new A(this.resourcesPanel, t ?? Es(ws.noSession), !1, "device-bound-sessions-session");
			t === void 0 && r.listItemElement.classList.add("no-device-bound-session"), r.setLeadingIcons([v("database")]), r.itemURL = `device-bound-sessions://${e}/${t || ""}`;
			let i = r.onselect.bind(r);
			r.onselect = (n) => (i(n), this.resourcesPanel.showDeviceBoundSession(this.#e, e, t), !1), r.listItemElement.addEventListener("keydown", (n) => {
				let r = n;
				(r.key === "Delete" || r.key === "Backspace") && t !== void 0 && (this.#e.deleteSession(e, t), n.consume(!0));
			}), r.listItemElement.addEventListener("contextmenu", (n) => {
				if (t !== void 0) {
					let r = new bt(n);
					r.defaultSection().appendItem(Es(ws.clear), () => this.#e.deleteSession(e, t), { jslogContext: "clear" }), r.show();
				}
			}), t === void 0 ? n.siteTreeElement.insertChild(r, 0) : n.siteTreeElement.appendChild(r), n.sessions.set(t, r);
		}
		this.#n(e);
	}
	#s(e, t) {
		for (let e of t) {
			let t = this.#t.get(e);
			t && (this.removeChild(t.siteTreeElement), this.#t.delete(e));
		}
		for (let [t, n] of e) {
			let e = this.#t.get(t);
			if (e) for (let t of n) {
				let n = e.sessions.get(t);
				n && (e.siteTreeElement.removeChild(n), e.sessions.delete(t));
			}
		}
	}
	#c({ data: { sessions: e } }) {
		for (let t of e) this.#o(t.key.site, t.key.id);
	}
	#l({ data: { site: e } }) {
		this.#n(e);
	}
	#u() {
		this.removeChildren();
	}
	#d({ data: { site: e, sessionId: t } }) {
		this.#o(e, t), this.#i(e, t);
	}
	#f({ data: { emptySessions: e, emptySites: t, noLongerFailedSessions: n } }) {
		this.#s(e, t), this.#a(n);
	}
}, Os = /* @__PURE__ */ e({
	Events: () => js,
	ExtensionStorage: () => ks,
	ExtensionStorageModel: () => As
}), ks = class extends c {
	#e;
	#t;
	#n;
	#r;
	constructor(e, t, n, r) {
		super(), this.#e = e, this.#t = t, this.#n = n, this.#r = r;
	}
	get model() {
		return this.#e;
	}
	get extensionId() {
		return this.#t;
	}
	get name() {
		return this.#n;
	}
	get key() {
		return `${this.extensionId}-${this.storageArea}`;
	}
	get storageArea() {
		return this.#r;
	}
	async getItems(e) {
		let t = {
			id: this.#t,
			storageArea: this.#r
		};
		e && (t.keys = e);
		let n = await this.#e.agent.invoke_getStorageItems(t);
		if (n.getError()) throw Error(n.getError());
		return n.data;
	}
	async setItem(e, t) {
		let n = await this.#e.agent.invoke_setStorageItems({
			id: this.#t,
			storageArea: this.#r,
			values: { [e]: t }
		});
		if (n.getError()) throw Error(n.getError());
	}
	async removeItem(e) {
		let t = await this.#e.agent.invoke_removeStorageItems({
			id: this.#t,
			storageArea: this.#r,
			keys: [e]
		});
		if (t.getError()) throw Error(t.getError());
	}
	async clear() {
		let e = await this.#e.agent.invoke_clearStorageItems({
			id: this.#t,
			storageArea: this.#r
		});
		if (e.getError()) throw Error(e.getError());
	}
	matchesTarget(e) {
		if (!e) return !1;
		let t = e.targetInfo()?.url, n = t ? re.fromString(t) : null;
		return n?.scheme === "chrome-extension" && n?.host === this.extensionId;
	}
}, As = class extends Et {
	#e;
	#t;
	agent;
	#n;
	constructor(e) {
		super(e), this.#e = e.model(se), this.#t = /* @__PURE__ */ new Map(), this.agent = e.extensionsAgent();
	}
	enable() {
		this.#n ||= (this.#e && (this.#e.addEventListener(On.ExecutionContextCreated, this.#s, this), this.#e.addEventListener(On.ExecutionContextDestroyed, this.#u, this), this.#e.executionContexts().forEach(this.#o, this)), !0);
	}
	#r(e) {
		let t = this.#t.get(e);
		if (t) return t;
		let n = /* @__PURE__ */ new Map();
		return this.#t.set(e, n), n;
	}
	#i(e, t) {
		for (let n of [
			ot.StorageArea.Session,
			ot.StorageArea.Local,
			ot.StorageArea.Sync,
			ot.StorageArea.Managed
		]) {
			let r = this.#r(e), i = new ks(this, e, t, n);
			console.assert(!r.get(n)), i.getItems([]).then(() => {
				this.#t.get(e) === r && (r.get(n) || (r.set(n, i), this.dispatchEventToListeners("ExtensionStorageAdded", i)));
			}).catch(() => {});
		}
	}
	#a(e) {
		let t = this.#t.get(e);
		if (t) {
			for (let [e, n] of t) t.delete(e), this.dispatchEventToListeners("ExtensionStorageRemoved", n);
			this.#t.delete(e);
		}
	}
	#o(e) {
		let t = this.#c(e);
		t && this.#i(t, e.name);
	}
	#s(e) {
		this.#o(e.data);
	}
	#c(e) {
		let t = re.fromString(e.origin);
		return t?.scheme === "chrome-extension" ? t.host : void 0;
	}
	#l(e) {
		let t = this.#c(e);
		if (t) {
			if (this.#e?.executionContexts().some((e) => this.#c(e) === t)) return;
			this.#a(t);
		}
	}
	#u(e) {
		this.#l(e.data);
	}
	storageForIdAndArea(e, t) {
		return this.#t.get(e)?.get(t);
	}
	storages() {
		let e = [];
		for (let t of this.#t.values()) e.push(...t.values());
		return e;
	}
};
Et.register(As, {
	capabilities: Me.JS,
	autostart: !1
});
var js = /* @__PURE__ */ function(e) {
	return e.EXTENSION_STORAGE_ADDED = "ExtensionStorageAdded", e.EXTENSION_STORAGE_REMOVED = "ExtensionStorageRemoved", e;
}({}), Ms = class e {
	type;
	description;
	severity;
	directive;
	value;
	constructor(e, t, n, r, i) {
		this.type = e, this.description = t, this.severity = n, this.directive = r, this.value = i;
	}
	static getHighestSeverity(e) {
		return e.length === 0 ? 100 : e.map((e) => e.severity).reduce((e, t) => e < t ? e : t, 100);
	}
	equals(t) {
		return t instanceof e && t.type === this.type && t.description === this.description && t.severity === this.severity && t.directive === this.directive && t.value === this.value;
	}
}, Ns = /* @__PURE__ */ function(e) {
	return e[e.HIGH = 10] = "HIGH", e[e.SYNTAX = 20] = "SYNTAX", e[e.MEDIUM = 30] = "MEDIUM", e[e.HIGH_MAYBE = 40] = "HIGH_MAYBE", e[e.STRICT_CSP = 45] = "STRICT_CSP", e[e.MEDIUM_MAYBE = 50] = "MEDIUM_MAYBE", e[e.INFO = 60] = "INFO", e[e.NONE = 100] = "NONE", e;
}({}), Ps = /* @__PURE__ */ function(e) {
	return e[e.MISSING_SEMICOLON = 100] = "MISSING_SEMICOLON", e[e.UNKNOWN_DIRECTIVE = 101] = "UNKNOWN_DIRECTIVE", e[e.INVALID_KEYWORD = 102] = "INVALID_KEYWORD", e[e.NONCE_CHARSET = 106] = "NONCE_CHARSET", e[e.MISSING_DIRECTIVES = 300] = "MISSING_DIRECTIVES", e[e.SCRIPT_UNSAFE_INLINE = 301] = "SCRIPT_UNSAFE_INLINE", e[e.SCRIPT_UNSAFE_EVAL = 302] = "SCRIPT_UNSAFE_EVAL", e[e.PLAIN_URL_SCHEMES = 303] = "PLAIN_URL_SCHEMES", e[e.PLAIN_WILDCARD = 304] = "PLAIN_WILDCARD", e[e.SCRIPT_ALLOWLIST_BYPASS = 305] = "SCRIPT_ALLOWLIST_BYPASS", e[e.OBJECT_ALLOWLIST_BYPASS = 306] = "OBJECT_ALLOWLIST_BYPASS", e[e.NONCE_LENGTH = 307] = "NONCE_LENGTH", e[e.IP_SOURCE = 308] = "IP_SOURCE", e[e.DEPRECATED_DIRECTIVE = 309] = "DEPRECATED_DIRECTIVE", e[e.SRC_HTTP = 310] = "SRC_HTTP", e[e.STRICT_DYNAMIC = 400] = "STRICT_DYNAMIC", e[e.STRICT_DYNAMIC_NOT_STANDALONE = 401] = "STRICT_DYNAMIC_NOT_STANDALONE", e[e.NONCE_HASH = 402] = "NONCE_HASH", e[e.UNSAFE_INLINE_FALLBACK = 403] = "UNSAFE_INLINE_FALLBACK", e[e.ALLOWLIST_FALLBACK = 404] = "ALLOWLIST_FALLBACK", e[e.IGNORED = 405] = "IGNORED", e[e.REQUIRE_TRUSTED_TYPES_FOR_SCRIPTS = 500] = "REQUIRE_TRUSTED_TYPES_FOR_SCRIPTS", e[e.REPORTING_DESTINATION_MISSING = 600] = "REPORTING_DESTINATION_MISSING", e[e.REPORT_TO_ONLY = 601] = "REPORT_TO_ONLY", e;
}({}), Fs = class e {
	directives = {};
	clone() {
		let t = new e();
		for (let [e, n] of Object.entries(this.directives)) n && (t.directives[e] = [...n]);
		return t;
	}
	convertToString() {
		let e = "";
		for (let [t, n] of Object.entries(this.directives)) {
			if (e += t, n !== void 0) for (let t, r = 0; t = n[r]; r++) e += " ", e += t;
			e += "; ";
		}
		return e;
	}
	getEffectiveCsp(e, t) {
		let n = t || [], r = this.clone(), i = r.getEffectiveDirective("script-src"), a = this.directives[i] || [], o = r.directives[i];
		if (o && (r.policyHasScriptNonces() || r.policyHasScriptHashes())) {
			if (e >= 2) a.includes("'unsafe-inline'") && (Js(o, "'unsafe-inline'"), n.push(new Ms(Ps.IGNORED, "unsafe-inline is ignored if a nonce or a hash is present. (CSP2 and above)", Ns.NONE, i, "'unsafe-inline'")));
			else for (let e of a) (e.startsWith("'nonce-") || e.startsWith("'sha")) && Js(o, e);
		}
		if (o && this.policyHasStrictDynamic()) {
			if (e >= 3) for (let e of a) (!e.startsWith("'") || e === "'self'" || e === "'unsafe-inline'") && (Js(o, e), n.push(new Ms(Ps.IGNORED, "Because of strict-dynamic this entry is ignored in CSP3 and above", Ns.NONE, i, e)));
			else Js(o, "'strict-dynamic'");
		}
		return e < 3 && (delete r.directives["report-to"], delete r.directives["worker-src"], delete r.directives["manifest-src"], delete r.directives["trusted-types"], delete r.directives["require-trusted-types-for"]), r;
	}
	getEffectiveDirective(e) {
		return !(e in this.directives) && Rs.includes(e) ? "default-src" : e;
	}
	getEffectiveDirectives(e) {
		return [...new Set(e.map((e) => this.getEffectiveDirective(e)))];
	}
	policyHasScriptNonces() {
		let e = this.getEffectiveDirective("script-src");
		return (this.directives[e] || []).some((e) => Ws(e));
	}
	policyHasScriptHashes() {
		let e = this.getEffectiveDirective("script-src");
		return (this.directives[e] || []).some((e) => qs(e));
	}
	policyHasStrictDynamic() {
		let e = this.getEffectiveDirective("script-src");
		return (this.directives[e] || []).includes("'strict-dynamic'");
	}
}, Is = /* @__PURE__ */ function(e) {
	return e.SELF = "'self'", e.NONE = "'none'", e.UNSAFE_INLINE = "'unsafe-inline'", e.UNSAFE_EVAL = "'unsafe-eval'", e.WASM_EVAL = "'wasm-eval'", e.WASM_UNSAFE_EVAL = "'wasm-unsafe-eval'", e.STRICT_DYNAMIC = "'strict-dynamic'", e.UNSAFE_HASHED_ATTRIBUTES = "'unsafe-hashed-attributes'", e.UNSAFE_HASHES = "'unsafe-hashes'", e.REPORT_SAMPLE = "'report-sample'", e.BLOCK = "'block'", e.ALLOW = "'allow'", e;
}({}), Ls = /* @__PURE__ */ function(e) {
	return e.CHILD_SRC = "child-src", e.CONNECT_SRC = "connect-src", e.DEFAULT_SRC = "default-src", e.FONT_SRC = "font-src", e.FRAME_SRC = "frame-src", e.IMG_SRC = "img-src", e.MEDIA_SRC = "media-src", e.OBJECT_SRC = "object-src", e.SCRIPT_SRC = "script-src", e.SCRIPT_SRC_ATTR = "script-src-attr", e.SCRIPT_SRC_ELEM = "script-src-elem", e.STYLE_SRC = "style-src", e.STYLE_SRC_ATTR = "style-src-attr", e.STYLE_SRC_ELEM = "style-src-elem", e.PREFETCH_SRC = "prefetch-src", e.MANIFEST_SRC = "manifest-src", e.WORKER_SRC = "worker-src", e.BASE_URI = "base-uri", e.PLUGIN_TYPES = "plugin-types", e.SANDBOX = "sandbox", e.DISOWN_OPENER = "disown-opener", e.FORM_ACTION = "form-action", e.FRAME_ANCESTORS = "frame-ancestors", e.NAVIGATE_TO = "navigate-to", e.REPORT_TO = "report-to", e.REPORT_URI = "report-uri", e.BLOCK_ALL_MIXED_CONTENT = "block-all-mixed-content", e.UPGRADE_INSECURE_REQUESTS = "upgrade-insecure-requests", e.REFLECTED_XSS = "reflected-xss", e.REFERRER = "referrer", e.REQUIRE_SRI_FOR = "require-sri-for", e.TRUSTED_TYPES = "trusted-types", e.REQUIRE_TRUSTED_TYPES_FOR = "require-trusted-types-for", e.WEBRTC = "webrtc", e;
}({}), Rs = [
	"child-src",
	"connect-src",
	"default-src",
	"font-src",
	"frame-src",
	"img-src",
	"manifest-src",
	"media-src",
	"object-src",
	"script-src",
	"script-src-attr",
	"script-src-elem",
	"style-src",
	"style-src-attr",
	"style-src-elem",
	"worker-src"
];
function zs(e) {
	return Object.values(Ls).includes(e);
}
function Bs(e) {
	return Object.values(Is).includes(e);
}
function Vs(e) {
	return (/* @__PURE__ */ RegExp("^[a-zA-Z][+a-zA-Z0-9.-]*:$")).test(e);
}
var Hs = /* @__PURE__ */ RegExp("^'nonce-[a-zA-Z0-9+/_-]+[=]{0,2}'$"), Us = /* @__PURE__ */ RegExp("^'nonce-(.+)'$");
function Ws(e, t) {
	return (t ? Hs : Us).test(e);
}
var Gs = /* @__PURE__ */ RegExp("^'(sha256|sha384|sha512)-[a-zA-Z0-9+/]+[=]{0,2}'$"), Ks = /* @__PURE__ */ RegExp("^'(sha256|sha384|sha512)-(.+)'$");
function qs(e, t) {
	return (t ? Gs : Ks).test(e);
}
function Js(e, t) {
	if (e.includes(t)) {
		let n = e.findIndex((e) => t === e);
		e.splice(n, 1);
	}
}
Ls.SCRIPT_SRC, Ls.OBJECT_SRC, Ls.BASE_URI;
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/third_party/csp_evaluator/package/allowlist_bypasses/angular.ts
var Ys = class {
	csp;
	constructor(e) {
		this.csp = new Fs(), this.parse(e);
	}
	parse(e) {
		this.csp = new Fs();
		let t = e.split(";");
		for (let e = 0; e < t.length; e++) {
			let n = t[e].trim().match(/\S+/g);
			if (Array.isArray(n)) {
				let e = n[0].toLowerCase();
				if (e in this.csp.directives) continue;
				zs(e);
				let t = [];
				for (let e, r = 1; e = n[r]; r++) e = Xs(e), t.includes(e) || t.push(e);
				this.csp.directives[e] = t;
			}
		}
		return this.csp;
	}
};
function Xs(e) {
	e = e.trim();
	let t = e.toLowerCase();
	return Bs(t) || Vs(e) ? t : e;
}
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/application/frameDetailsReportView.css.mjs
var Zs = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  overflow: auto;\n}\n\n.text-ellipsis {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\nbutton ~ .text-ellipsis {\n  padding-left: 2px;\n}\n\n.link,\n.devtools-link {\n  color: var(--sys-color-primary);\n  text-decoration: underline;\n  cursor: pointer;\n  outline-offset: 2px;\n  padding: 0;\n  margin-left: var(--sys-size-3);\n  white-space: nowrap;;\n}\n\nbutton.link {\n  border: none;\n  background: none;\n  font-family: inherit;\n  font-size: inherit;\n  height: 16px;\n}\n\nbutton.link:has(devtools-icon) {\n  margin-top: 5px;\n}\n\ndevtools-button.help-button {\n  top: 4px;\n  position: relative;\n}\n\nbutton.text-link {\n  padding-left: 2px;\n  height: 26px;\n}\n\n.inline-button {\n  padding-left: 1ex;\n}\n\n.inline-comment {\n  padding-left: 1ex;\n  white-space: pre-line;\n}\n\n.inline-comment::before {\n  content: \"(\";\n}\n\n.inline-comment::after {\n  content: \")\";\n}\n\n.inline-name {\n  color: var(--sys-color-token-subtle);\n  padding-inline: 4px;\n  user-select: none;\n  white-space: pre-line;\n}\n\n.inline-items {\n  display: flex;\n}\n\n.inline-items devtools-button {\n  flex: 0 0 20px;\n  width: 20px;\n  height: 20px;\n}\n\n.inline-items .text-ellipsis {\n  flex: 0 1 auto;\n  min-width: 0;\n  padding-left: 2px;\n}\n\n.span-cols {\n  grid-column-start: span 2;\n  margin-left: var(--sys-size-9);\n  line-height: 28px;\n}\n\n.report-section:has(.link) {\n  line-height: var(--sys-size-12);\n}\n\n.without-min-width {\n  min-width: auto;\n}\n\n.bold {\n  font-weight: bold;\n}\n\n.link:not(button):has(devtools-icon) {\n  vertical-align: baseline;\n  margin-inline-start: 3px;\n}\n\n.inline-icon {\n  margin-bottom: -5px;\n  width: 18px;\n  height: 18px;\n  vertical-align: baseline;\n}\n\n@media (forced-colors: active) {\n  .link,\n  .devtools-link {\n    color: linktext;\n    text-decoration-color: linktext;\n  }\n}\n", Qs = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.content {\n  display: grid;\n  grid-template-columns: min-content 1fr;\n}\n\n.key {\n  color: var(--sys-color-token-subtle);\n  padding: 0 6px;\n  text-align: right;\n  white-space: pre;\n}\n\n.value {\n  color: var(--sys-color-token-subtle);\n  margin-inline-start: 0;\n  padding: 0 6px;\n}\n\n.error-text {\n  color: var(--sys-color-error-bright);\n  font-weight: bold;\n}\n", $s = "/*\n * Copyright 2023 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  .status-badge {\n    border-radius: 4px;\n    padding: 4px;\n    background: var(--sys-color-neutral-container);\n\n    & > devtools-icon {\n      vertical-align: sub;\n    }\n  }\n\n  .badge-error {\n    --override-adorner-text-color: var(--sys-color-error-bright);\n    --override-adorner-border-color: var(--sys-color-error-bright);\n  }\n\n  .badge-success {\n    --override-adorner-text-color: var(--sys-color-tertiary);\n    --override-adorner-border-color: var(--sys-color-tertiary);\n  }\n\n  .badge-secondary {\n    --override-adorner-text-color: var(--sys-color-token-subtle);\n    --override-adorner-border-color: var(--sys-color-token-subtle);\n  }\n\n  /* Use mono-space source code font to assist reading of adorner content */\n  devtools-adorner {\n    font-family: var(--source-code-font-family);\n  }\n\n  .token-status-badge {\n    display: none;\n  }\n\n  [aria-expanded='false'] .token-status-badge {\n    display: inline-flex;\n  }\n}", ec = /* @__PURE__ */ e({
	OriginTrialTokenRows: () => fc,
	OriginTrialTreeView: () => mc
}), { classMap: tc } = et, { widget: nc } = Wt, rc = {
	origin: "Origin",
	trialName: "Trial Name",
	expiryTime: "Expiry Time",
	usageRestriction: "Usage Restriction",
	isThirdParty: "Third Party",
	matchSubDomains: "Subdomain Matching",
	rawTokenText: "Raw Token",
	status: "Token Status",
	token: "Token",
	tokens: "{PH1} tokens",
	noTrialTokens: "No trial tokens"
}, ic = s("panels/application/OriginTrialTreeView.ts", rc), ac = a.bind(void 0, ic);
function oc(e) {
	let t = e.status === w.OriginTrialStatus.Enabled;
	return y`
    <li role="treeitem">
      ${e.trialName}
      <devtools-adorner class="badge-${t ? "success" : "error"}">
        ${e.status}
      </devtools-adorner>
      ${e.tokensWithStatus.length > 1 ? y`
        <devtools-adorner class="badge-secondary">
          ${ac(rc.tokens, { PH1: e.tokensWithStatus.length })}
        </devtools-adorner>` : b}
      <ul role="group">
        ${e.tokensWithStatus.length > 1 ? e.tokensWithStatus.map(sc) : lc(e.tokensWithStatus[0])}
      </ul>
    </li>`;
}
function sc(e) {
	let t = e.status === w.OriginTrialTokenStatus.Success;
	return y`
    <li role="treeitem">
      ${ac(rc.token)}
      <devtools-adorner class="token-status-badge badge-${t ? "success" : "error"}">
        ${e.status}
      </devtools-adorner>
      <ul role="group">
        ${lc(e)}
      </ul>
    </li>`;
}
function cc(e) {
	return y`
    <li role="treeitem">
      ${nc(fc, { data: e })}
    </li>`;
}
function lc(e) {
	return y`
    ${cc(e)}
    ${uc(e.rawTokenText)}
  `;
}
function uc(e) {
	return y`
    <li role="treeitem">
      ${ac(rc.rawTokenText)}
      <ul role="group">
        <li role="treeitem">
          <div style="overflow-wrap: break-word;">
            ${e}
          </div>
        </li>
      </ul>
    </li>`;
}
var dc = (e, t, n) => {
	let r = e.tokenWithStatus.status === w.OriginTrialTokenStatus.Success;
	_(y`
    <style>
      ${Qs}
      ${$s}
    </style>
    <div class="content">
      <div class="key">${ac(rc.status)}</div>
      <div class="value">
        <devtools-adorner class="badge-${r ? "success" : "error"}">
          ${e.tokenWithStatus.status}
        </devtools-adorner>
      </div>
      ${e.parsedTokenDetails.map((e) => y`
        <div class="key">${e.name}</div>
        <div class="value">
          <div class=${tc({ "error-text": !!e.value.hasError })}>
            ${e.value.text}
          </div>
        </div>
      `)}
    </div>`, n);
}, fc = class extends tn {
	#e;
	#t = null;
	#n = [];
	#r = new Intl.DateTimeFormat(ee.instance().locale, {
		dateStyle: "long",
		timeStyle: "long"
	});
	constructor(e, t = dc) {
		super(e, { useShadowDom: !0 }), this.#e = t;
	}
	set data(e) {
		this.#t = e, this.#i();
	}
	connectedCallback() {
		this.requestUpdate();
	}
	#i() {
		this.#t?.parsedToken && (this.#n = [
			{
				name: ac(rc.origin),
				value: {
					text: this.#t.parsedToken.origin,
					hasError: this.#t.status === w.OriginTrialTokenStatus.WrongOrigin
				}
			},
			{
				name: ac(rc.expiryTime),
				value: {
					text: this.#r.format(this.#t.parsedToken.expiryTime * 1e3),
					hasError: this.#t.status === w.OriginTrialTokenStatus.Expired
				}
			},
			{
				name: ac(rc.usageRestriction),
				value: { text: this.#t.parsedToken.usageRestriction }
			},
			{
				name: ac(rc.isThirdParty),
				value: { text: this.#t.parsedToken.isThirdParty.toString() }
			},
			{
				name: ac(rc.matchSubDomains),
				value: { text: this.#t.parsedToken.matchSubDomains.toString() }
			}
		], this.#t.status === w.OriginTrialTokenStatus.UnknownTrial && (this.#n = [{
			name: ac(rc.trialName),
			value: { text: this.#t.parsedToken.trialName }
		}, ...this.#n]), this.requestUpdate());
	}
	performUpdate() {
		if (!this.#t) return;
		let e = {
			tokenWithStatus: this.#t,
			parsedTokenDetails: this.#n
		};
		this.#e(e, void 0, this.contentElement);
	}
}, pc = (e, t, n) => {
	if (!e.trials.length) {
		_(y`
      <span class="status-badge">
        <devtools-icon class="medium" name="clear"></devtools-icon>
        <span>${ac(rc.noTrialTokens)}</span>
      </span>`, n);
		return;
	}
	_(y`
    <style>${$s}</style>
    <devtools-tree .template=${y`
      <style>${$s}</style>
      <ul role="tree">
        ${e.trials.map(oc)}
      </ul>
    `}>
    </devtools-tree>
  `, n);
}, mc = class extends tn {
	#e = { trials: [] };
	#t;
	constructor(e, t = pc) {
		super(e, { useShadowDom: !0 }), this.#t = t;
	}
	set data(e) {
		this.#e = e, this.requestUpdate();
	}
	performUpdate() {
		this.#t(this.#e, void 0, this.contentElement);
	}
}, hc = /* @__PURE__ */ e({
	DEFAULT_VIEW: () => vc,
	FrameDetailsReportView: () => Wc
}), { widget: gc } = Wt, R = {
	additionalInformation: "Additional Information",
	thisAdditionalDebugging: "This additional (debugging) information is shown because the 'Protocol Monitor' experiment is enabled.",
	frameId: "Frame ID",
	document: "Document",
	url: "URL",
	clickToOpenInSourcesPanel: "Click to open in Sources panel",
	clickToOpenInNetworkPanel: "Click to open in Network panel",
	unreachableUrl: "Unreachable URL",
	clickToOpenInNetworkPanelMight: "Click to open in Network panel (might require page reload)",
	origin: "Origin",
	ownerElement: "Owner Element",
	adStatus: "Ad Status",
	rootDescription: "This frame has been identified as the root frame of an ad",
	root: "root",
	childDescription: "This frame has been identified as a child frame of an ad",
	child: "child",
	securityIsolation: "Security & Isolation",
	contentSecurityPolicy: "Content Security Policy (CSP)",
	secureContext: "Secure Context",
	yes: "Yes",
	no: "No",
	crossoriginIsolated: "Cross-Origin Isolated",
	localhostIsAlwaysASecureContext: "`Localhost` is always a secure context",
	aFrameAncestorIsAnInsecure: "A frame ancestor is an insecure context",
	theFramesSchemeIsInsecure: "The frame's scheme is insecure",
	reportingTo: "reporting to",
	apiAvailability: "API availability",
	availabilityOfCertainApisDepends: "Availability of certain APIs depends on the document being cross-origin isolated.",
	availableTransferable: "available, transferable",
	availableNotTransferable: "available, not transferable",
	unavailable: "unavailable",
	sharedarraybufferConstructorIs: "`SharedArrayBuffer` constructor is available and `SABs` can be transferred via `postMessage`",
	sharedarraybufferConstructorIsAvailable: "`SharedArrayBuffer` constructor is available but `SABs` cannot be transferred via `postMessage`",
	willRequireCrossoriginIsolated: "⚠️ will require cross-origin isolated context in the future",
	requiresCrossoriginIsolated: "requires cross-origin isolated context",
	transferRequiresCrossoriginIsolatedPermission: "`SharedArrayBuffer` transfer requires enabling the permission policy:",
	available: "available",
	thePerformanceAPI: "The `performance.measureUserAgentSpecificMemory()` API is available",
	thePerformancemeasureuseragentspecificmemory: "The `performance.measureUserAgentSpecificMemory()` API is not available",
	measureMemory: "Measure Memory",
	learnMore: "Learn more",
	creationStackTrace: "Frame Creation `Stack Trace`",
	creationStackTraceExplanation: "This frame was created programmatically. The `stack trace` shows where this happened.",
	parentIsAdExplanation: "This frame is considered an ad frame because its parent frame is an ad frame.",
	matchedBlockingRuleExplanation: "This frame is considered an ad frame because its current (or previous) main document is an ad resource.",
	createdByAdScriptExplanation: "There was an ad script in the `(async) stack` when this frame was created. Examining the creation `stack trace` of this frame might provide more insight.",
	creatorAdScriptAncestry: "Creator Ad Script Ancestry",
	rootScriptFilterlistRule: "Root Script Filterlist Rule",
	none: "None",
	originTrialsExplanation: "Origin trials give you access to a new or experimental feature."
}, _c = s("panels/application/FrameDetailsView.ts", R), z = a.bind(void 0, _c), vc = (e, t, n) => {
	e.frame && _(y`
    <style>${Zs}</style>
    <devtools-report .data=${{ reportTitle: e.frame.displayName() }}
    jslog=${D("frames")}>
      ${bc(e)}
      ${Mc(e)}
      ${Bc(e.frame)}
      ${yc(e.trials)}
      ${e.permissionsPolicies ? gc(xa, {
		policies: e.permissionsPolicies,
		showDetails: !1
	}) : b}
      ${e.protocolMonitorExperimentEnabled ? Uc(e.frame) : b}
    </devtools-report>
  `, n);
};
function yc(e) {
	if (!e) return b;
	let t = { trials: e };
	return y`
    <devtools-report-section-header>
      ${d("Origin trials")}
    </devtools-report-section-header>
    <devtools-report-section>
      <span class="report-section">
        ${z(R.originTrialsExplanation)}
        <devtools-link href="https://developer.chrome.com/docs/web-platform/origin-trials/" class="link"
                jslogcontext="learn-more.origin-trials">
          ${z(R.learnMore)}
        </devtools-link>
      </span>
    </devtools-report-section>
    <devtools-widget class="span-cols" ${gc(mc, { data: t })}>
    </devtools-widget>
    <devtools-report-divider></devtools-report-divider>`;
}
function bc(e) {
	return e.frame ? y`
      <devtools-report-section-header>${z(R.document)}</devtools-report-section-header>
      <devtools-report-key>${z(R.url)}</devtools-report-key>
      <devtools-report-value>
        <div class="inline-items">
          ${e.frame?.unreachableUrl() ? b : xc(e.onRevealInSources)}
          ${e.onRevealInNetwork ? Sc(e.onRevealInNetwork) : b}
          <div class="text-ellipsis" title=${e.frame.url}>${e.frame.url}</div>
        </div>
      </devtools-report-value>
      ${Cc(e.frame?.unreachableUrl())}
      ${Tc(e.frame?.securityOrigin)}
      ${Ec(e.linkTargetDOMNode)}
      ${Dc(e.creationStackTrace)}
      ${Ac(e.frame?.adFrameType(), e.frame?.adFrameStatus())}
      ${jc(e.frame?.adFrameType(), e.target, e.adScriptAncestry)}
      <devtools-report-divider></devtools-report-divider>` : b;
}
function xc(e) {
	return _a("label", z(R.clickToOpenInSourcesPanel), e, "reveal-in-sources");
}
function Sc(e) {
	return _a("arrow-up-down-circle", z(R.clickToOpenInNetworkPanel), e, "reveal-in-network");
}
function Cc(e) {
	return e ? y`
      <devtools-report-key>${z(R.unreachableUrl)}</devtools-report-key>
      <devtools-report-value>
        <div class="inline-items">
          ${wc(e)}
          <div class="text-ellipsis" title=${e}>${e}</div>
        </div>
      </devtools-report-value>
    ` : b;
}
function wc(e) {
	let t = re.fromString(e);
	return t ? _a("arrow-up-down-circle", z(R.clickToOpenInNetworkPanelMight), () => {
		r(kr.filters([{
			filterType: jr.Domain,
			filterValue: t.domain()
		}, {
			filterType: null,
			filterValue: t.path
		}]));
	}, "unreachable-url.reveal-in-network") : b;
}
function Tc(e) {
	return e && e !== "://" ? y`
        <devtools-report-key>${z(R.origin)}</devtools-report-key>
        <devtools-report-value>
          <div class="text-ellipsis" title=${e}>${e}</div>
        </devtools-report-value>
      ` : b;
}
function Ec(e) {
	return e ? y`
        <devtools-report-key>${z(R.ownerElement)}</devtools-report-key>
        <devtools-report-value class="without-min-width">
          <div class="inline-items">
            ${gc(ur, { node: e })}
          </div>
        </devtools-report-value>
      ` : b;
}
function Dc(e) {
	return e ? y`
        <devtools-report-key title=${z(R.creationStackTraceExplanation)}>${z(R.creationStackTrace)}</devtools-report-key>
        <devtools-report-value jslog=${T("frame-creation-stack-trace")}>
          ${gc(dr, {
		stackTrace: e,
		options: { expandable: !0 }
	})}
        </devtools-report-value>
      ` : b;
}
function Oc(e) {
	switch (e) {
		case w.AdFrameType.Child: return {
			value: z(R.child),
			description: z(R.childDescription)
		};
		case w.AdFrameType.Root: return {
			value: z(R.root),
			description: z(R.rootDescription)
		};
	}
}
function kc(e) {
	switch (e) {
		case w.AdFrameExplanation.CreatedByAdScript: return z(R.createdByAdScriptExplanation);
		case w.AdFrameExplanation.MatchedBlockingRule: return z(R.matchedBlockingRuleExplanation);
		case w.AdFrameExplanation.ParentIsAd: return z(R.parentIsAdExplanation);
	}
}
function Ac(e, t) {
	if (e === void 0 || e === w.AdFrameType.None) return b;
	let n = Oc(e), r = [y`<div title=${n.description}>${n.value}</div>`];
	for (let e of t?.explanations || []) r.push(y`<div>${kc(e)}</div>`);
	return y`
      <devtools-report-key>${z(R.adStatus)}</devtools-report-key>
      <devtools-report-value class="ad-status-list" jslog=${T("ad-status")}>
        <devtools-expandable-list .data=${{
		rows: r,
		title: z(R.adStatus)
	}}>
        </devtools-expandable-list>
      </devtools-report-value>`;
}
function jc(e, t, n) {
	if (e === w.AdFrameType.None || !t || !n || n.ancestryChain.length === 0) return b;
	let r = n.ancestryChain.map((e) => y`<div>
      ${gc(fr, {
		target: t,
		scriptId: e.scriptId,
		options: { jslogContext: "ad-script" }
	})}
    </div>`), i = n.rootScriptFilterlistRule !== void 0;
	return y`
      <devtools-report-key>${z(R.creatorAdScriptAncestry)}</devtools-report-key>
      <devtools-report-value class="creator-ad-script-ancestry-list" jslog=${T("creator-ad-script-ancestry")}>
        <devtools-expandable-list .data=${{
		rows: r,
		title: z(R.creatorAdScriptAncestry)
	}}>
        </devtools-expandable-list>
      </devtools-report-value>
      ${i ? y`
        <devtools-report-key>${z(R.rootScriptFilterlistRule)}</devtools-report-key>
        <devtools-report-value jslog=${T("root-script-filterlist-rule")}>${n.rootScriptFilterlistRule}</devtools-report-value>
      ` : b}
    `;
}
function Mc(e) {
	return e.frame ? y`
      <devtools-report-section-header>${z(R.securityIsolation)}</devtools-report-section-header>
      <devtools-report-key>${z(R.secureContext)}</devtools-report-key>
      <devtools-report-value>
        ${e.frame.isSecureContext() ? z(R.yes) : z(R.no)}\xA0${Nc(e.frame)}
      </devtools-report-value>
      <devtools-report-key>${z(R.crossoriginIsolated)}</devtools-report-key>
      <devtools-report-value>
        ${e.frame.isCrossOriginIsolated() ? z(R.yes) : z(R.no)}
      </devtools-report-value>
      ${Fc(e.securityIsolationInfo)}
      <devtools-report-divider></devtools-report-divider>
    ` : b;
}
function Nc(e) {
	let t = Pc(e);
	return t ? y`<span class="inline-comment">${t}</span>` : b;
}
function Pc(e) {
	switch (e?.getSecureContextType()) {
		case w.SecureContextType.Secure: return null;
		case w.SecureContextType.SecureLocalhost: return z(R.localhostIsAlwaysASecureContext);
		case w.SecureContextType.InsecureAncestor: return z(R.aFrameAncestorIsAnInsecure);
		case w.SecureContextType.InsecureScheme: return z(R.theFramesSchemeIsInsecure);
	}
	return null;
}
function Fc(e) {
	return e ? y`
          ${Ic(e.coep, d("Cross-Origin Embedder Policy (COEP)"), x.CrossOriginEmbedderPolicyValue.None)}
          ${Ic(e.coop, d("Cross-Origin Opener Policy (COOP)"), x.CrossOriginOpenerPolicyValue.UnsafeNone)}
          ${zc(e.csp)}
        ` : b;
}
function Ic(e, t, n) {
	if (!e) return b;
	function r(e) {
		switch (e) {
			case x.CrossOriginEmbedderPolicyValue.Credentialless: return "credentialless";
			case x.CrossOriginEmbedderPolicyValue.None: return "none";
			case x.CrossOriginEmbedderPolicyValue.RequireCorp: return "require-corp";
			case x.CrossOriginOpenerPolicyValue.NoopenerAllowPopups: return "noopenener-allow-popups";
			case x.CrossOriginOpenerPolicyValue.SameOrigin: return "same-origin";
			case x.CrossOriginOpenerPolicyValue.SameOriginAllowPopups: return "same-origin-allow-popups";
			case x.CrossOriginOpenerPolicyValue.SameOriginPlusCoep: return "same-origin-plus-coep";
			case x.CrossOriginOpenerPolicyValue.RestrictProperties: return "restrict-properties";
			case x.CrossOriginOpenerPolicyValue.RestrictPropertiesPlusCoep: return "restrict-properties-plus-coep";
			case x.CrossOriginOpenerPolicyValue.UnsafeNone: return "unsafe-none";
		}
	}
	let i = e.value !== n, a = !i && e.reportOnlyValue !== n, o = i ? e.reportingEndpoint : e.reportOnlyReportingEndpoint;
	return y`
      <devtools-report-key>${t}</devtools-report-key>
      <devtools-report-value>
        ${r(i ? e.value : e.reportOnlyValue)}
        ${a ? y`<span class="inline-comment">report-only</span>` : b}
        ${o ? y`<span class="inline-name">${z(R.reportingTo)}</span>${o}` : b}
      </devtools-report-value>
    `;
}
function Lc(e) {
	let t = new Ys(e).csp.directives, n = [];
	for (let e in t) n.push(y`
          <div>
            <span class="bold">${e}</span>
            ${": " + t[e]?.join(", ")}
          </div>`);
	return n;
}
function Rc(e, t) {
	return y`
      <devtools-report-key>
        ${e.isEnforced ? d("Content-Security-Policy") : y`
          ${d("Content-Security-Policy-Report-Only")}
          <devtools-button
            .iconName=${"help"}
            class='help-button'
            .accessibleLabel=${z(R.learnMore)}
            .variant=${h.ICON}
            .size=${ft.SMALL}
            @click=${() => {
		window.location.href = "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy-Report-Only";
	}}
            jslog=${Pn("learn-more.csp-report-only").track({ click: !0 })}
            ></devtools-button>`}
      </devtools-report-key>
      <devtools-report-value>
        ${e.source === x.ContentSecurityPolicySource.HTTP ? d("HTTP header") : d("Meta tag")}
        ${Lc(e.effectiveDirectives)}
      </devtools-report-value>
      ${t ? y`<devtools-report-divider class="subsection-divider"></devtools-report-divider>` : b}
    `;
}
function zc(e) {
	return y`
      <devtools-report-divider></devtools-report-divider>
      <devtools-report-section-header>
        ${z(R.contentSecurityPolicy)}
      </devtools-report-section-header>
      ${e?.length ? e.map((t, n) => Rc(t, n < e?.length - 1)) : y`
        <devtools-report-key>
          ${d("Content-Security-Policy")}
        </devtools-report-key>
        <devtools-report-value>
          ${z(R.none)}
        </devtools-report-value>
      `}
    `;
}
function Bc(e) {
	return e ? y`
      <devtools-report-section-header>
        ${z(R.apiAvailability)}
      </devtools-report-section-header>
      <devtools-report-section>
        <span class="report-section">
          ${z(R.availabilityOfCertainApisDepends)}
          <devtools-link
            href="https://web.dev/why-coop-coep/" class="link"
            jslogcontext="learn-more.coop-coep">
            ${z(R.learnMore)}
          </devtools-link>
        </span>
      </devtools-report-section>
      ${Vc(e)}
      ${Hc(e)}
      <devtools-report-divider></devtools-report-divider>` : b;
}
function Vc(e) {
	if (e) {
		let t = e.getGatedAPIFeatures();
		if (t) {
			let n = t.includes(w.GatedAPIFeatures.SharedArrayBuffers), r = n && t.includes(w.GatedAPIFeatures.SharedArrayBuffersTransferAllowed), i = z(r ? R.availableTransferable : n ? R.availableNotTransferable : R.unavailable), a = r ? z(R.sharedarraybufferConstructorIs) : n ? z(R.sharedarraybufferConstructorIsAvailable) : "";
			function o(e) {
				switch (e.getCrossOriginIsolatedContextType()) {
					case w.CrossOriginIsolatedContextType.Isolated: return b;
					case w.CrossOriginIsolatedContextType.NotIsolated: return n ? y`
                  <span class="inline-comment">
                    ${z(R.willRequireCrossoriginIsolated)}
                  </span>` : y`<span class="inline-comment">${z(R.requiresCrossoriginIsolated)}</span>`;
					case w.CrossOriginIsolatedContextType.NotIsolatedFeatureDisabled: if (!r) return y`
                  <span class="inline-comment">
                    ${z(R.transferRequiresCrossoriginIsolatedPermission)}
                    <code> cross-origin-isolated</code>
                  </span>`;
				}
				return b;
			}
			return y`
          <devtools-report-key>SharedArrayBuffers</devtools-report-key>
          <devtools-report-value title=${a}>
            ${i}\xA0${o(e)}
          </devtools-report-value>
        `;
		}
	}
	return b;
}
function Hc(e) {
	if (e) {
		let t = e.isCrossOriginIsolated(), n = z(t ? R.available : R.unavailable), r = z(t ? R.thePerformanceAPI : R.thePerformancemeasureuseragentspecificmemory);
		return y`
        <devtools-report-key>${z(R.measureMemory)}</devtools-report-key>
        <devtools-report-value>
          <span title=${r}>${n}</span>\xA0<devtools-link class="link" href="https://web.dev/monitor-total-page-memory-usage/" jslogcontext="learn-more.monitor-memory-usage">${z(R.learnMore)}</devtools-link>
        </devtools-report-value>
      `;
	}
	return b;
}
function Uc(e) {
	return e ? y`
      <devtools-report-section-header
        title=${z(R.thisAdditionalDebugging)}
      >${z(R.additionalInformation)}</devtools-report-section-header>
      <devtools-report-key>${z(R.frameId)}</devtools-report-key>
      <devtools-report-value>
        <div class="text-ellipsis" title=${e.id}>${e.id}</div>
      </devtools-report-value>
      <devtools-report-divider></devtools-report-divider>
    ` : b;
}
var Wc = class extends tn {
	#e;
	#t = null;
	#n = null;
	#r = null;
	#i = null;
	#a = null;
	#o = !1;
	#s = null;
	#c = new cr();
	#l = null;
	#u;
	constructor(e, t = vc) {
		super(e, { useShadowDom: !0 }), this.#o = Ln.isEnabled(Ge.PROTOCOL_MONITOR), this.#u = t;
	}
	set frame(e) {
		this.#e = e, this.#e.getPermissionsPolicyState().then((e) => {
			this.#s = e, this.requestUpdate();
		});
		let { creationStackTrace: t, creationStackTraceTarget: n } = e.getCreationStackTraceData();
		t && ar.instance().createStackTraceFromProtocolRuntime(t, n).then((e) => {
			this.#n = e, this.requestUpdate();
		}), e.resourceTreeModel().target().model(Vt)?.getSecurityIsolationStatus(e.id).then((e) => {
			this.#r = e, this.requestUpdate();
		}), e.getOwnerDOMNodeOrDocument().then((e) => {
			this.#i = e, this.requestUpdate();
		}), e.getOriginTrials().then((e) => {
			this.#a = e, this.requestUpdate();
		}), this.requestUpdate();
	}
	get frame() {
		return this.#e;
	}
	async performUpdate() {
		let e = await this.#e?.parentFrame()?.getAdScriptAncestry(this.#e?.id);
		e && e.ancestryChain.length > 0 && (this.#l = e, this.#t = this.#e?.resourceTreeModel().target() ?? null);
		let t = this.#e;
		if (!t) return;
		let n = t.resourceForURL(t.url)?.request, i = {
			frame: t,
			target: this.#t,
			creationStackTrace: this.#n,
			protocolMonitorExperimentEnabled: this.#o,
			permissionsPolicies: this.#s,
			adScriptAncestry: this.#l,
			linkifier: this.#c,
			linkTargetDOMNode: this.#i,
			trials: this.#a,
			securityIsolationInfo: this.#r,
			onRevealInNetwork: n ? () => {
				let e = Mr.tab(n, Nr.HEADERS_COMPONENT);
				return r(e);
			} : void 0,
			onRevealInSources: async () => {
				let e = this.#d(t);
				e && await r(e);
			}
		};
		this.#u(i, void 0, this.contentElement);
	}
	#d(e) {
		for (let t of sr.instance().projects()) {
			let n = or.getTargetForProject(t);
			if (n && n === e.resourceTreeModel().target()) {
				let n = t.uiSourceCodeForURL(e.url);
				if (n) return n;
			}
		}
		return null;
	}
}, Gc = /* @__PURE__ */ e({
	Database: () => Zc,
	DatabaseId: () => Xc,
	Entry: () => Yc,
	Events: () => Jc,
	Index: () => $c,
	IndexedDBModel: () => qc,
	ObjectStore: () => Qc
}), Kc = "", qc = class e extends Et {
	storageBucketModel;
	indexedDBAgent;
	storageAgent;
	databasesInternal;
	databaseNamesByStorageKeyAndBucket;
	updatedStorageBuckets;
	throttler;
	enabled;
	constructor(e) {
		super(e), e.registerStorageDispatcher(this), this.storageBucketModel = e.model(vn), this.indexedDBAgent = e.indexedDBAgent(), this.storageAgent = e.storageAgent(), this.databasesInternal = /* @__PURE__ */ new Map(), this.databaseNamesByStorageKeyAndBucket = /* @__PURE__ */ new Map(), this.updatedStorageBuckets = /* @__PURE__ */ new Set(), this.throttler = new It(1e3);
	}
	static keyFromIDBKey(t) {
		if (t == null) return;
		let n;
		switch (typeof t) {
			case "number":
				n = {
					type: dt.KeyType.Number,
					number: t
				};
				break;
			case "string":
				n = {
					type: dt.KeyType.String,
					string: t
				};
				break;
			case "object":
				if (t instanceof Date) n = {
					type: dt.KeyType.Date,
					date: t.getTime()
				};
				else if (Array.isArray(t)) {
					let r = [];
					for (let n = 0; n < t.length; ++n) {
						let i = e.keyFromIDBKey(t[n]);
						i && r.push(i);
					}
					n = {
						type: dt.KeyType.Array,
						array: r
					};
				} else return;
				break;
			default: return;
		}
		return n;
	}
	static keyRangeFromIDBKeyRange(t) {
		return {
			lower: e.keyFromIDBKey(t.lower),
			upper: e.keyFromIDBKey(t.upper),
			lowerOpen: !!t.lowerOpen,
			upperOpen: !!t.upperOpen
		};
	}
	static idbKeyPathFromKeyPath(e) {
		let t;
		switch (e.type) {
			case dt.KeyPathType.Null:
				t = null;
				break;
			case dt.KeyPathType.String:
				t = e.string;
				break;
			case dt.KeyPathType.Array: t = e.array;
		}
		return t;
	}
	static keyPathStringFromIDBKeyPath(e) {
		return typeof e == "string" ? "\"" + e + "\"" : e instanceof Array ? "[\"" + e.join("\", \"") + "\"]" : null;
	}
	enable() {
		if (!this.enabled) {
			if (this.indexedDBAgent.invoke_enable(), this.storageBucketModel) {
				this.storageBucketModel.addEventListener(ln.BUCKET_ADDED, this.storageBucketAdded, this), this.storageBucketModel.addEventListener(ln.BUCKET_REMOVED, this.storageBucketRemoved, this);
				for (let { bucket: e } of this.storageBucketModel.getBuckets()) this.addStorageBucket(e);
			}
			this.enabled = !0;
		}
	}
	clearForStorageKey(e) {
		if (!this.enabled || !this.databaseNamesByStorageKeyAndBucket.has(e)) return;
		for (let [t] of this.databaseNamesByStorageKeyAndBucket.get(e) || []) {
			let n = this.storageBucketModel?.getBucketByName(e, t)?.bucket;
			n && this.removeStorageBucket(n);
		}
		this.databaseNamesByStorageKeyAndBucket.delete(e);
		let t = this.storageBucketModel?.getBucketsForStorageKey(e) || [];
		for (let { bucket: e } of t) this.addStorageBucket(e);
	}
	async deleteDatabase(e) {
		this.enabled && (await this.indexedDBAgent.invoke_deleteDatabase({
			storageBucket: e.storageBucket,
			databaseName: e.name
		}), this.loadDatabaseNamesByStorageBucket(e.storageBucket));
	}
	async refreshDatabaseNames() {
		for (let [e] of this.databaseNamesByStorageKeyAndBucket) {
			let t = this.databaseNamesByStorageKeyAndBucket.get(e)?.keys() || [];
			for (let n of t) {
				let t = this.storageBucketModel?.getBucketByName(e, n)?.bucket;
				t && await this.loadDatabaseNamesByStorageBucket(t);
			}
		}
		this.dispatchEventToListeners("DatabaseNamesRefreshed");
	}
	refreshDatabase(e) {
		this.loadDatabase(e, !0);
	}
	async clearObjectStore(e, t) {
		await this.indexedDBAgent.invoke_clearObjectStore({
			storageBucket: e.storageBucket,
			databaseName: e.name,
			objectStoreName: t
		});
	}
	async deleteEntries(t, n, r) {
		let i = e.keyRangeFromIDBKeyRange(r);
		await this.indexedDBAgent.invoke_deleteObjectStoreEntries({
			storageBucket: t.storageBucket,
			databaseName: t.name,
			objectStoreName: n,
			keyRange: i
		});
	}
	storageBucketAdded({ data: { bucketInfo: { bucket: e } } }) {
		this.addStorageBucket(e);
	}
	storageBucketRemoved({ data: { bucketInfo: { bucket: e } } }) {
		this.removeStorageBucket(e);
	}
	addStorageBucket(e) {
		let { storageKey: t } = e;
		this.databaseNamesByStorageKeyAndBucket.has(t) || (this.databaseNamesByStorageKeyAndBucket.set(t, /* @__PURE__ */ new Map()), this.storageAgent.invoke_trackIndexedDBForStorageKey({ storageKey: t }));
		let n = this.databaseNamesByStorageKeyAndBucket.get(t) || /* @__PURE__ */ new Map();
		console.assert(!n.has(e.name ?? Kc)), n.set(e.name ?? Kc, /* @__PURE__ */ new Set()), this.loadDatabaseNamesByStorageBucket(e);
	}
	removeStorageBucket(e) {
		let { storageKey: t } = e;
		console.assert(this.databaseNamesByStorageKeyAndBucket.has(t));
		let n = this.databaseNamesByStorageKeyAndBucket.get(t) || /* @__PURE__ */ new Map();
		console.assert(n.has(e.name ?? Kc));
		let r = n.get(e.name ?? Kc) || /* @__PURE__ */ new Map();
		for (let e of r) this.databaseRemovedForStorageBucket(e);
		n.delete(e.name ?? Kc), n.size === 0 && (this.databaseNamesByStorageKeyAndBucket.delete(t), this.storageAgent.invoke_untrackIndexedDBForStorageKey({ storageKey: t }));
	}
	updateStorageKeyDatabaseNames(e, t) {
		let n = this.databaseNamesByStorageKeyAndBucket.get(e.storageKey);
		if (n === void 0) return;
		let r = new Set(t.map((t) => new Xc(e, t))), i = new Set(n.get(e.name ?? Kc));
		n.set(e.name ?? Kc, r);
		for (let e of i) e.inSet(r) || this.databaseRemovedForStorageBucket(e);
		for (let e of r) e.inSet(i) || this.databaseAddedForStorageBucket(e);
	}
	databases() {
		let e = [];
		for (let [, t] of this.databaseNamesByStorageKeyAndBucket) for (let [, n] of t) for (let t of n) e.push(t);
		return e;
	}
	databaseAddedForStorageBucket(e) {
		this.dispatchEventToListeners("DatabaseAdded", {
			model: this,
			databaseId: e
		});
	}
	databaseRemovedForStorageBucket(e) {
		this.dispatchEventToListeners("DatabaseRemoved", {
			model: this,
			databaseId: e
		});
	}
	async loadDatabaseNamesByStorageBucket(e) {
		let { storageKey: t } = e, { databaseNames: n } = await this.indexedDBAgent.invoke_requestDatabaseNames({ storageBucket: e });
		return !n || !this.databaseNamesByStorageKeyAndBucket.has(t) || !(this.databaseNamesByStorageKeyAndBucket.get(t) || /* @__PURE__ */ new Map()).has(e.name ?? Kc) ? [] : (this.updateStorageKeyDatabaseNames(e, n), n);
	}
	async loadDatabase(t, n) {
		let r = (await this.indexedDBAgent.invoke_requestDatabase({
			storageBucket: t.storageBucket,
			databaseName: t.name
		})).databaseWithObjectStores;
		if (!this.databaseNamesByStorageKeyAndBucket.get(t.storageBucket.storageKey)?.has(t.storageBucket.name ?? Kc) || !r) return;
		let i = new Zc(t, r.version);
		this.databasesInternal.set(t, i);
		for (let t of r.objectStores) {
			let n = e.idbKeyPathFromKeyPath(t.keyPath), r = new Qc(t.name, n, t.autoIncrement);
			for (let n = 0; n < t.indexes.length; ++n) {
				let i = t.indexes[n], a = e.idbKeyPathFromKeyPath(i.keyPath), o = new $c(i.name, a, i.unique, i.multiEntry);
				r.indexes.set(o.name, o);
			}
			i.objectStores.set(r.name, r);
		}
		this.dispatchEventToListeners("DatabaseLoaded", {
			model: this,
			database: i,
			entriesUpdated: n
		});
	}
	loadObjectStoreData(e, t, n, r, i, a) {
		this.requestData(e, e.name, t, void 0, n, r, i, a);
	}
	loadIndexData(e, t, n, r, i, a, o) {
		this.requestData(e, e.name, t, n, r, i, a, o);
	}
	async requestData(t, n, r, i, a, o, s, c) {
		let l = a ? e.keyRangeFromIDBKeyRange(a) : void 0, u = this.target().model(se), d = await this.indexedDBAgent.invoke_requestData({
			storageBucket: t.storageBucket,
			databaseName: n,
			objectStoreName: r,
			indexName: i,
			skipCount: o,
			pageSize: s,
			keyRange: l
		});
		if (!u || !this.databaseNamesByStorageKeyAndBucket.get(t.storageBucket.storageKey)?.has(t.storageBucket.name ?? Kc)) return;
		if (d.getError()) {
			console.error("IndexedDBAgent error: " + d.getError());
			return;
		}
		let ee = d.objectStoreDataEntries, f = [];
		for (let e of ee) {
			let t = u?.createRemoteObject(e.key), n = u?.createRemoteObject(e.primaryKey), r = u?.createRemoteObject(e.value);
			if (!t || !n || !r) return;
			f.push(new Yc(t, n, r));
		}
		c(f, d.hasMore);
	}
	async getMetadata(e, t) {
		let n = e.name, r = t.name, i = await this.indexedDBAgent.invoke_getMetadata({
			storageBucket: e.storageBucket,
			databaseName: n,
			objectStoreName: r
		});
		return i.getError() ? (console.error("IndexedDBAgent error: " + i.getError()), null) : {
			entriesCount: i.entriesCount,
			keyGeneratorValue: i.keyGeneratorValue
		};
	}
	async refreshDatabaseListForStorageBucket(e) {
		let t = await this.loadDatabaseNamesByStorageBucket(e);
		for (let n of t) this.loadDatabase(new Xc(e, n), !1);
	}
	indexedDBListUpdated({ storageKey: e, bucketId: t }) {
		let n = this.storageBucketModel?.getBucketById(t)?.bucket;
		e && n && (this.updatedStorageBuckets.add(n), this.throttler.schedule(() => {
			let e = Array.from(this.updatedStorageBuckets, (e) => {
				this.refreshDatabaseListForStorageBucket(e);
			});
			return this.updatedStorageBuckets.clear(), Promise.all(e);
		}));
	}
	indexedDBContentUpdated({ bucketId: e, databaseName: t, objectStoreName: n }) {
		let r = this.storageBucketModel?.getBucketById(e)?.bucket;
		if (r) {
			let e = new Xc(r, t);
			this.dispatchEventToListeners("IndexedDBContentUpdated", {
				databaseId: e,
				objectStoreName: n,
				model: this
			});
		}
	}
	cacheStorageListUpdated(e) {}
	cacheStorageContentUpdated(e) {}
	interestGroupAccessed(e) {}
	interestGroupAuctionEventOccurred(e) {}
	interestGroupAuctionNetworkRequestCreated(e) {}
	sharedStorageAccessed(e) {}
	sharedStorageWorkletOperationExecutionFinished(e) {}
	storageBucketCreatedOrUpdated(e) {}
	storageBucketDeleted(e) {}
};
Et.register(qc, {
	capabilities: Me.STORAGE,
	autostart: !1
});
var Jc = /* @__PURE__ */ function(e) {
	return e.DatabaseAdded = "DatabaseAdded", e.DatabaseRemoved = "DatabaseRemoved", e.DatabaseLoaded = "DatabaseLoaded", e.DatabaseNamesRefreshed = "DatabaseNamesRefreshed", e.IndexedDBContentUpdated = "IndexedDBContentUpdated", e;
}({}), Yc = class {
	key;
	primaryKey;
	value;
	constructor(e, t, n) {
		this.key = e, this.primaryKey = t, this.value = n;
	}
}, Xc = class {
	storageBucket;
	name;
	constructor(e, t) {
		this.storageBucket = e, this.name = t;
	}
	inBucket(e) {
		return this.storageBucket.name === e.name;
	}
	equals(e) {
		return this.name === e.name && this.storageBucket.name === e.storageBucket.name && this.storageBucket.storageKey === e.storageBucket.storageKey;
	}
	inSet(e) {
		for (let t of e) if (this.equals(t)) return !0;
		return !1;
	}
}, Zc = class {
	databaseId;
	version;
	objectStores;
	constructor(e, t) {
		this.databaseId = e, this.version = t, this.objectStores = /* @__PURE__ */ new Map();
	}
}, Qc = class {
	name;
	keyPath;
	autoIncrement;
	indexes;
	constructor(e, t, n) {
		this.name = e, this.keyPath = t, this.autoIncrement = n, this.indexes = /* @__PURE__ */ new Map();
	}
	get keyPathString() {
		return qc.keyPathStringFromIDBKeyPath(this.keyPath);
	}
}, $c = class {
	name;
	keyPath;
	unique;
	multiEntry;
	constructor(e, t, n, r) {
		this.name = e, this.keyPath = t, this.unique = n, this.multiEntry = r;
	}
	get keyPathString() {
		return qc.keyPathStringFromIDBKeyPath(this.keyPath);
	}
}, el = "/*\n * Copyright 2012 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.indexed-db-data-view .data-view-toolbar {\n  position: relative;\n  background-color: var(--sys-color-cdt-base-container);\n  border-bottom: 1px solid var(--sys-color-divider);\n}\n\n.indexed-db-data-view .data-grid {\n  flex: auto;\n}\n\n.indexed-db-data-view .data-grid .data-container tr:nth-last-child(1) {\n  background-color: var(--sys-color-cdt-base-container);\n}\n\n.indexed-db-data-view .data-grid .data-container tr:nth-last-child(1) td {\n  border: 0;\n}\n\n.indexed-db-data-view .data-grid .data-container tr:nth-last-child(2) td {\n  border-bottom: 1px solid var(--sys-color-divider);\n}\n\n.indexed-db-data-view .data-grid:focus .data-container tr.selected {\n  background-color: var(--sys-color-tonal-container);\n  color: inherit;\n}\n\n.indexed-db-data-view .section,\n.indexed-db-data-view .section > .header,\n.indexed-db-data-view .section > .header .title {\n  margin: 0;\n  min-height: inherit;\n  line-height: inherit;\n}\n\n.indexed-db-data-view .data-grid .data-container td .section .header .title {\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  overflow: hidden;\n}\n\n.indexed-db-key-path {\n  color: var(--sys-color-error);\n  white-space: pre-wrap;\n  unicode-bidi: -webkit-isolate;\n}\n\n.indexed-db-container {\n  overflow: auto;\n}\n\n.indexed-db-header {\n  min-width: 400px;\n  flex-shrink: 0;\n  flex-grow: 0;\n}\n\n.source-code.indexed-db-key-path {\n  font-size: unset !important; /* stylelint-disable-line declaration-no-important */\n}\n\n.resources-toolbar {\n  padding-right: 10px;\n}\n\n.object-store-summary-bar {\n  flex: 0 0 27px;\n  line-height: 27px;\n  padding-left: 5px;\n  background-color: var(--sys-color-cdt-base-container);\n  border-top: 1px solid var(--sys-color-divider);\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  overflow: hidden;\n}\n", tl = /* @__PURE__ */ e({
	IDBDataGridNode: () => sl,
	IDBDataView: () => ol,
	IDBDatabaseView: () => al
}), { html: nl } = Ie, B = {
	version: "Version",
	objectStores: "Object stores",
	deleteDatabase: "Delete database",
	refreshDatabase: "Refresh database",
	confirmDeleteDatabase: "Delete \"{PH1}\" database?",
	databaseWillBeRemoved: "The selected database and contained data will be removed.",
	confirmClearObjectStore: "Clear \"{PH1}\" object store?",
	objectStoreWillBeCleared: "The data contained in the selected object store will be removed.",
	idb: "IDB",
	refresh: "Refresh",
	deleteSelected: "Delete selected",
	clearObjectStore: "Clear object store",
	dataMayBeStale: "Data may be stale",
	someEntriesMayHaveBeenModified: "Some entries may have been modified",
	keyString: "Key",
	primaryKey: "Primary key",
	valueString: "Value",
	indexedDb: "Indexed DB",
	keyPath: "Key path: ",
	showPreviousPage: "Show previous page",
	showNextPage: "Show next page",
	filterByKey: "Filter by key (show keys greater or equal to)",
	expandRecursively: "Expand Recursively",
	collapse: "Collapse",
	totalEntriesS: "Total entries: {PH1}",
	keyGeneratorValueS: "Key generator value: {PH1}"
}, rl = s("panels/application/IndexedDBViews.ts", B), il = a.bind(void 0, rl), al = class extends fo {
	model;
	database;
	constructor(e, t) {
		super(), this.model = e, this.setShowOnlyBucket(!0), t && this.update(t);
	}
	getTitle() {
		return this.database?.databaseId.name;
	}
	async renderReportContent() {
		return this.database ? nl`
      ${await super.renderReportContent()}
      ${this.key(il(B.version))}
      ${this.value(this.database.version.toString())}
      ${this.key(il(B.objectStores))}
      ${this.value(this.database.objectStores.size.toString())}
      <devtools-report-divider></devtools-report-divider>
      <devtools-report-section>
      <devtools-button
          aria-label=${il(B.deleteDatabase)}
          .variant=${h.OUTLINED}
          @click=${this.deleteDatabase}
          jslog=${Bt("delete-database").track({ click: !0 })}>
        ${il(B.deleteDatabase)}
      </devtools-button>&nbsp;
      <devtools-button
          aria-label=${il(B.refreshDatabase)}
          .variant=${h.OUTLINED}
          @click=${this.refreshDatabaseButtonClicked}
          jslog=${Bt("refresh-database").track({ click: !0 })}>
        ${il(B.refreshDatabase)}
      </devtools-button>
      </devtools-report-section>
      ` : b;
	}
	refreshDatabaseButtonClicked() {
		this.model.refreshDatabase(this.database.databaseId);
	}
	update(e) {
		this.database = e;
		let t = this.model.target().model(vn)?.getBucketByName(e.databaseId.storageBucket.storageKey, e.databaseId.storageBucket.name);
		t ? this.setStorageBucket(t) : this.setStorageKey(e.databaseId.storageBucket.storageKey), this.render().then(() => this.updatedForTests());
	}
	updatedForTests() {}
	async deleteDatabase() {
		await tt.show(il(B.databaseWillBeRemoved), il(B.confirmDeleteDatabase, { PH1: this.database.databaseId.name }), this, { jslogContext: "delete-database-confirmation" }) && this.model.deleteDatabase(this.database.databaseId);
	}
	wasShown() {
		super.wasShown();
	}
};
customElements.define("devtools-idb-database-view", al);
var ol = class extends $t {
	model;
	databaseId;
	isIndex;
	refreshObjectStoreCallback;
	refreshButton;
	deleteSelectedButton;
	clearButton;
	needsRefresh;
	clearingObjectStore;
	pageSize;
	skipCount;
	entries;
	objectStore;
	index;
	keyInput;
	dataGrid;
	lastPageSize;
	lastSkipCount;
	pageBackButton;
	pageForwardButton;
	lastKey;
	summaryBarElement;
	constructor(e, t, n, r, i) {
		super({
			title: il(B.idb),
			viewId: "idb",
			jslog: `${D("indexed-db-data-view")}`
		}), this.registerRequiredCSS(el), this.model = e, this.databaseId = t, this.isIndex = !!r, this.refreshObjectStoreCallback = i, this.element.classList.add("indexed-db-data-view", "storage-view"), this.refreshButton = new rt(il(B.refresh), "refresh"), this.refreshButton.addEventListener(rt.Events.CLICK, this.refreshButtonClicked, this), this.refreshButton.element.setAttribute("jslog", `${Bt("refresh").track({ click: !0 })}`), this.deleteSelectedButton = new rt(il(B.deleteSelected), "bin"), this.deleteSelectedButton.addEventListener(rt.Events.CLICK, (e) => {
			this.deleteButtonClicked(null);
		}), this.deleteSelectedButton.element.setAttribute("jslog", `${Bt("delete-selected").track({ click: !0 })}`), this.clearButton = new rt(il(B.clearObjectStore), "clear"), this.clearButton.addEventListener(rt.Events.CLICK, () => {
			this.clearButtonClicked();
		}, this), this.clearButton.element.setAttribute("jslog", `${Bt("clear-all").track({ click: !0 })}`);
		let a = Dt({
			title: il(B.dataMayBeStale),
			iconName: "warning",
			color: "var(--icon-warning)",
			width: "20px",
			height: "20px"
		});
		this.needsRefresh = new bn(a), this.needsRefresh.setVisible(!1), this.needsRefresh.setTitle(il(B.someEntriesMayHaveBeenModified)), this.clearingObjectStore = !1, this.createEditorToolbar(), this.pageSize = 50, this.skipCount = 0, this.update(n, r), this.entries = [];
	}
	createDataGrid() {
		let e = this.isIndex && this.index ? this.index.keyPath : this.objectStore.keyPath, t = [];
		t.push({
			id: "number",
			title: "#",
			sortable: !1,
			width: "50px"
		}), t.push({
			id: "key",
			titleDOMFragment: this.keyColumnHeaderFragment(il(B.keyString), e),
			sortable: !1
		}), this.isIndex && t.push({
			id: "primary-key",
			titleDOMFragment: this.keyColumnHeaderFragment(il(B.primaryKey), this.objectStore.keyPath),
			sortable: !1
		});
		let n = il(B.valueString);
		t.push({
			id: "value",
			title: n,
			sortable: !1
		});
		let r = new Pr({
			displayName: il(B.indexedDb),
			columns: t,
			deleteCallback: this.deleteButtonClicked.bind(this),
			refreshCallback: this.updateData.bind(this, !0)
		});
		return r.setStriped(!0), r.addEventListener(Lr.SELECTED_NODE, () => {
			this.updateToolbarEnablement();
		}, this), r;
	}
	keyColumnHeaderFragment(e, t) {
		let n = document.createDocumentFragment();
		if (kn(n, e), t === null) return n;
		if (kn(n, " (" + il(B.keyPath)), Array.isArray(t)) {
			kn(n, "[");
			for (let e = 0; e < t.length; ++e) e !== 0 && kn(n, ", "), n.appendChild(this.keyPathStringFragment(t[e]));
			kn(n, "]");
		} else {
			let e = t;
			n.appendChild(this.keyPathStringFragment(e));
		}
		return kn(n, ")"), n;
	}
	keyPathStringFragment(e) {
		let t = document.createDocumentFragment();
		kn(t, "\"");
		let n = t.createChild("span", "source-code indexed-db-key-path");
		return n.textContent = e, kn(t, "\""), t;
	}
	createEditorToolbar() {
		let e = this.element.createChild("devtools-toolbar", "data-view-toolbar");
		e.setAttribute("jslog", `${Qt()}`), e.appendToolbarItem(this.refreshButton), e.appendToolbarItem(this.clearButton), e.appendToolbarItem(this.deleteSelectedButton), e.appendToolbarItem(new cn()), this.pageBackButton = new rt(il(B.showPreviousPage), "triangle-left", void 0, "prev-page"), this.pageBackButton.addEventListener(rt.Events.CLICK, this.pageBackButtonClicked, this), e.appendToolbarItem(this.pageBackButton), this.pageForwardButton = new rt(il(B.showNextPage), "triangle-right", void 0, "next-page"), this.pageForwardButton.setEnabled(!1), this.pageForwardButton.addEventListener(rt.Events.CLICK, this.pageForwardButtonClicked, this), e.appendToolbarItem(this.pageForwardButton), this.keyInput = new ae(il(B.filterByKey), .5), this.keyInput.addEventListener(At.Event.TEXT_CHANGED, this.updateData.bind(this, !1)), e.appendToolbarItem(this.keyInput), e.appendToolbarItem(new cn()), e.appendToolbarItem(this.needsRefresh);
	}
	pageBackButtonClicked() {
		this.skipCount = Math.max(0, this.skipCount - this.pageSize), this.updateData(!1);
	}
	pageForwardButtonClicked() {
		this.skipCount += this.pageSize, this.updateData(!1);
	}
	populateContextMenu(e, t) {
		let n = t;
		n.valueObjectPresentation && (e.revealSection().appendItem(il(B.expandRecursively), () => {
			n.valueObjectPresentation && n.valueObjectPresentation.objectTreeElement().expandRecursively();
		}, { jslogContext: "expand-recursively" }), e.revealSection().appendItem(il(B.collapse), () => {
			n.valueObjectPresentation && n.valueObjectPresentation.objectTreeElement().collapse();
		}, { jslogContext: "collapse" }));
	}
	refreshData() {
		this.updateData(!0);
	}
	update(e = null, t = null) {
		e && (this.objectStore = e, this.index = t, this.dataGrid && this.dataGrid.asWidget().detach(), this.dataGrid = this.createDataGrid(), this.dataGrid.setRowContextMenuCallback(this.populateContextMenu.bind(this)), this.dataGrid.asWidget().show(this.element), this.skipCount = 0, this.updateData(!0));
	}
	parseKey(e) {
		let t;
		try {
			t = JSON.parse(e);
		} catch {
			t = e;
		}
		return t;
	}
	updateData(e) {
		let t = this.parseKey(this.keyInput.value()), n = this.pageSize, r = this.skipCount, i = this.dataGrid.selectedNode ? this.dataGrid.selectedNode.data.number : 0;
		if (i = Math.max(i, this.skipCount), this.clearButton.setEnabled(!this.isIndex), !e && this.lastKey === t && this.lastPageSize === n && this.lastSkipCount === r) return;
		(this.lastKey !== t || this.lastPageSize !== n) && (r = 0, this.skipCount = 0), this.lastKey = t, this.lastPageSize = n, this.lastSkipCount = r;
		function a(e, t) {
			this.clear(), this.entries = e;
			let n = null;
			for (let t = 0; t < e.length; ++t) {
				let a = {};
				a.number = t + r, a.key = e[t].key, a["primary-key"] = e[t].primaryKey, a.value = e[t].value;
				let o = new sl(a);
				this.dataGrid.rootNode().appendChild(o), a.number <= i && (n = o);
			}
			n && n.select(), this.pageBackButton.setEnabled(!!r), this.pageForwardButton.setEnabled(t), this.needsRefresh.setVisible(!1), this.updateToolbarEnablement(), this.updatedDataForTests();
		}
		let o = t ? window.IDBKeyRange.lowerBound(t) : null;
		this.isIndex && this.index ? this.model.loadIndexData(this.databaseId, this.objectStore.name, this.index.name, o, r, n, a.bind(this)) : this.model.loadObjectStoreData(this.databaseId, this.objectStore.name, o, r, n, a.bind(this)), this.model.getMetadata(this.databaseId, this.objectStore).then(this.updateSummaryBar.bind(this));
	}
	updateSummaryBar(e) {
		if (this.summaryBarElement ||= this.element.createChild("div", "object-store-summary-bar"), this.summaryBarElement.removeChildren(), !e) return;
		let t = this.summaryBarElement.createChild("span");
		t.textContent = il(B.totalEntriesS, { PH1: String(e.entriesCount) }), this.objectStore.autoIncrement && (t.textContent += " ❘ ", t.textContent += il(B.keyGeneratorValueS, { PH1: String(e.keyGeneratorValue) }));
	}
	updatedDataForTests() {}
	refreshButtonClicked() {
		this.updateData(!0);
	}
	async clearButtonClicked() {
		await tt.show(il(B.objectStoreWillBeCleared), il(B.confirmClearObjectStore, { PH1: this.objectStore.name }), this.element, { jslogContext: "clear-object-store-confirmation" }) && (this.clearButton.setEnabled(!1), this.clearingObjectStore = !0, await this.model.clearObjectStore(this.databaseId, this.objectStore.name), this.clearingObjectStore = !1, this.clearButton.setEnabled(!0), this.updateData(!0));
	}
	markNeedsRefresh() {
		this.clearingObjectStore || this.needsRefresh.setVisible(!0);
	}
	async resolveArrayKey(e) {
		let { properties: t } = await e.getOwnProperties(!1);
		if (!t) return [];
		let n = [], r = t.filter((e) => !isNaN(Number(e.name))).map(async (e) => {
			let t = e.value;
			if (!t) return;
			let r;
			r = t.subtype === "array" ? await this.resolveArrayKey(t) : t.value, n[Number(e.name)] = r;
		});
		return await Promise.all(r), n;
	}
	async deleteButtonClicked(e) {
		if (!e && (e = this.dataGrid.selectedNode, !e)) return;
		let t = this.isIndex ? e.data["primary-key"] : e.data.key, n = t.subtype === "array" ? await this.resolveArrayKey(t) : t.value;
		await this.model.deleteEntries(this.databaseId, this.objectStore.name, window.IDBKeyRange.only(n)), this.refreshObjectStoreCallback();
	}
	clear() {
		this.dataGrid.rootNode().removeChildren(), this.entries = [];
	}
	updateToolbarEnablement() {
		let e = !this.dataGrid || this.dataGrid.rootNode().children.length === 0;
		this.deleteSelectedButton.setEnabled(!e && this.dataGrid.selectedNode !== null);
	}
}, sl = class extends Fr {
	selectable;
	valueObjectPresentation;
	constructor(e) {
		super(e, !1), this.selectable = !0, this.valueObjectPresentation = null;
	}
	createCell(e) {
		let t = super.createCell(e), n = this.data[e];
		switch (e) {
			case "value": {
				t.removeChildren();
				let e = br.defaultObjectPropertiesSection(n, void 0, !0, !0);
				t.appendChild(e.element), this.valueObjectPresentation = e;
				break;
			}
			case "key":
			case "primary-key": {
				t.removeChildren();
				let e = br.defaultObjectPresentation(n, void 0, !0, !0);
				t.appendChild(e);
				break;
			}
		}
		return t;
	}
}, cl = /* @__PURE__ */ e({
	Events: () => ul,
	InterestGroupStorageModel: () => ll
}), ll = class extends Et {
	storageAgent;
	enabled;
	constructor(e) {
		super(e), e.registerStorageDispatcher(this), this.storageAgent = e.storageAgent(), this.enabled = !1;
	}
	enable() {
		this.enabled || this.storageAgent.invoke_setInterestGroupTracking({ enable: !0 });
	}
	disable() {
		this.enabled && this.storageAgent.invoke_setInterestGroupTracking({ enable: !1 });
	}
	interestGroupAccessed(e) {
		this.dispatchEventToListeners("InterestGroupAccess", e);
	}
	indexedDBListUpdated(e) {}
	indexedDBContentUpdated(e) {}
	interestGroupAuctionEventOccurred(e) {}
	interestGroupAuctionNetworkRequestCreated(e) {}
	cacheStorageListUpdated(e) {}
	cacheStorageContentUpdated(e) {}
	sharedStorageAccessed(e) {}
	sharedStorageWorkletOperationExecutionFinished(e) {}
	storageBucketCreatedOrUpdated(e) {}
	storageBucketDeleted(e) {}
};
Et.register(ll, {
	capabilities: Me.STORAGE,
	autostart: !1
});
var ul = /* @__PURE__ */ function(e) {
	return e.INTEREST_GROUP_ACCESS = "InterestGroupAccess", e;
}({}), dl = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\ndevtools-interest-group-access-grid {\n  overflow: auto;\n}\n", fl = /* @__PURE__ */ e({ InterestGroupStorageView: () => _l }), pl = {
	noValueSelected: "No interest group selected",
	clickToDisplayBody: "Select any interest group event to display the group's current state",
	noDataAvailable: "No details available",
	noDataDescription: "The browser may have left the group."
}, ml = s("panels/application/InterestGroupStorageView.ts", pl), hl = a.bind(void 0, ml);
function gl(e, t) {
	return e.accessTime === t.accessTime && e.type === t.type && e.ownerOrigin === t.ownerOrigin && e.name === t.name;
}
var _l = class extends it {
	interestGroupGrid = new da();
	events = [];
	detailsGetter;
	noDataView;
	noDisplayView;
	constructor(e) {
		super(!1, !0), this.element.setAttribute("jslog", `${D("interest-groups")}`), this.detailsGetter = e;
		let t = new S();
		this.noDisplayView = new Ae(hl(pl.noValueSelected), hl(pl.clickToDisplayBody)), this.noDataView = new Ae(hl(pl.noDataAvailable), hl(pl.noDataDescription)), t.setMinimumSize(0, 120), this.setMainWidget(t), this.noDisplayView.setMinimumSize(0, 80), this.setSidebarWidget(this.noDisplayView), this.noDataView.setMinimumSize(0, 80), this.noDisplayView.contentElement.setAttribute("jslog", `${D("details").track({ resize: !0 })}`), this.noDataView.contentElement.setAttribute("jslog", `${D("details").track({ resize: !0 })}`), this.hideSidebar(), t.contentElement.appendChild(this.interestGroupGrid), this.interestGroupGrid.addEventListener("select", this.onFocus.bind(this));
	}
	wasShown() {
		super.wasShown();
		let e = this.mainWidget();
		e && e.registerRequiredCSS(dl);
	}
	addEvent(e) {
		this.showMode() !== ut.BOTH && this.showBoth(), this.events.find((t) => gl(t, e)) || (this.events.push(e), this.interestGroupGrid.data = this.events);
	}
	clearEvents() {
		this.events = [], this.interestGroupGrid.data = this.events, this.setSidebarWidget(this.noDisplayView), this.sidebarUpdatedForTesting();
	}
	async onFocus(e) {
		let { ownerOrigin: t, name: n, type: r } = e.detail, i = null;
		if (r !== k.InterestGroupAccessType.AdditionalBid && r !== k.InterestGroupAccessType.AdditionalBidWin && r !== k.InterestGroupAccessType.TopLevelAdditionalBid && (i = await this.detailsGetter.getInterestGroupDetails(t, n)), i) {
			let e = await Gr.createView(JSON.stringify(i));
			e?.setMinimumSize(0, 40), e && (e.contentElement.setAttribute("jslog", `${D("details").track({ resize: !0 })}`), this.setSidebarWidget(e));
		} else this.setSidebarWidget(this.noDataView);
		this.sidebarUpdatedForTesting();
	}
	getEventsForTesting() {
		return this.events;
	}
	getInterestGroupGridForTesting() {
		return this.interestGroupGrid;
	}
	sidebarUpdatedForTesting() {}
}, vl = /* @__PURE__ */ e({
	InterestGroupTreeElement: () => Sl,
	i18nString: () => xl
}), yl = { interestGroups: "Interest groups" }, bl = s("panels/application/InterestGroupTreeElement.ts", yl), xl = a.bind(void 0, bl), Sl = class extends A {
	view;
	constructor(e) {
		super(e, xl(yl.interestGroups), !1, "interest-groups");
		let t = v("database");
		this.setLeadingIcons([t]), this.view = new _l(this);
	}
	get itemURL() {
		return "interest-groups://";
	}
	async getInterestGroupDetails(e, t) {
		let n = C.instance().primaryPageTarget();
		return n ? (await n.storageAgent().invoke_getInterestGroupDetails({
			ownerOrigin: e,
			name: t
		})).details : null;
	}
	onselect(e) {
		return super.onselect(e), this.showView(this.view), Yt.instance().panelShown("interest-groups"), !1;
	}
	addEvent(e) {
		this.view.addEvent(e);
	}
	clearEvents() {
		this.view.clearEvents();
	}
}, Cl = "/*\n * Copyright 2020 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.report-content-box {\n  overflow: initial;\n}\n\n.report-field-name {\n  flex: 0 0 200px;\n}\n\n.report-field-value {\n  user-select: text;\n  display: flex;\n}\n\n.report-field .inline-name {\n  color: var(--sys-color-state-disabled);\n  padding-left: 2ex;\n  user-select: none;\n  white-space: pre-line;\n}\n\n.report-field .inline-name::after {\n  content: \":\\A0\";\n}\n\n.report-field .inline-comment {\n  color: var(--sys-color-token-subtle);\n  padding-left: 1ex;\n  white-space: pre-line;\n}\n\n.report-field .inline-comment::before {\n  content: \"(\";\n}\n\n.report-field .inline-comment::after {\n  content: \")\";\n}\n\n.report-field .inline-span {\n  color: var(--sys-color-token-subtle);\n  padding-left: 1ex;\n  white-space: pre-line;\n}\n\n.report-field-value-link {\n  display: inline-block;\n}\n\n.icon-link.devtools-link {\n  background-color: var(--sys-color-primary);\n  vertical-align: sub;\n}\n\n.frame-details-container {\n  overflow: auto;\n}\n\n.frame-details-report-container {\n  min-width: 550px;\n}\n\n.text-ellipsis {\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n", wl = /* @__PURE__ */ e({
	OpenedWindowDetailsView: () => jl,
	WorkerDetailsView: () => Ml
}), Tl = {
	yes: "Yes",
	no: "No",
	clickToOpenInElementsPanel: "Click to open in Elements panel",
	document: "Document",
	url: "URL",
	security: "Security",
	openerFrame: "Opener Frame",
	accessToOpener: "Access to opener",
	showsWhetherTheOpenedWindowIs: "Shows whether the opened window is able to access its opener and vice versa",
	windowWithoutTitle: "Window without title",
	closed: "closed",
	worker: "worker",
	type: "Type",
	securityIsolation: "Security & Isolation",
	crossoriginEmbedderPolicy: "Cross-Origin Embedder Policy",
	webWorker: "Web Worker",
	unknown: "Unknown",
	reportingTo: "reporting to"
}, El = s("panels/application/OpenedWindowDetailsView.ts", Tl), Dl = a.bind(void 0, El), Ol = (e) => Dl(e ? Tl.yes : Tl.no);
function kl(e, t, n) {
	let r = v(e, "icon-link devtools-link"), i = document.createElement("button");
	return Ye.install(i, t), i.classList.add("devtools-link", "link-style", "text-button"), i.appendChild(r), i.addEventListener("click", (e) => {
		e.consume(!0), n();
	}), i;
}
async function Al(e) {
	let t = null;
	if (e instanceof _e ? t = e : e && (t = ce.instance().getFrame(e)), !t) return null;
	let n = await t.getOwnerDOMNodeOrDocument();
	if (!n) return null;
	let i = kl("code-circle", Dl(Tl.clickToOpenInElementsPanel), () => r(n)), a = document.createElement("span");
	return a.textContent = `<${n.nodeName().toLocaleLowerCase()}>`, i.insertBefore(a, i.firstChild), i.addEventListener("mouseenter", () => {
		t && t.highlight();
	}), i.addEventListener("mouseleave", () => {
		Xt.hideDOMNodeHighlight();
	}), i;
}
var jl = class extends S {
	targetInfo;
	isWindowClosed;
	reportView;
	documentSection;
	#e;
	securitySection;
	openerElementField;
	hasDOMAccessValue;
	constructor(e, t) {
		super(), this.registerRequiredCSS(Cl), this.targetInfo = e, this.isWindowClosed = t, this.contentElement.classList.add("frame-details-container"), this.reportView = new An(this.buildTitle()), this.reportView.show(this.contentElement), this.reportView.registerRequiredCSS(Cl), this.reportView.element.classList.add("frame-details-report-container"), this.documentSection = this.reportView.appendSection(Dl(Tl.document)), this.#e = this.documentSection.appendField(Dl(Tl.url)).createChild("div", "text-ellipsis"), this.securitySection = this.reportView.appendSection(Dl(Tl.security)), this.openerElementField = this.securitySection.appendField(Dl(Tl.openerFrame)), this.securitySection.setFieldVisible(Dl(Tl.openerFrame), !1), this.hasDOMAccessValue = this.securitySection.appendField(Dl(Tl.accessToOpener)), Ye.install(this.hasDOMAccessValue, Dl(Tl.showsWhetherTheOpenedWindowIs)), this.requestUpdate();
	}
	async performUpdate() {
		this.reportView.setTitle(this.buildTitle()), this.#e.textContent = this.targetInfo.url, this.#e.title = this.targetInfo.url, this.hasDOMAccessValue.textContent = Ol(this.targetInfo.canAccessOpener), this.maybeDisplayOpenerFrame();
	}
	async maybeDisplayOpenerFrame() {
		this.openerElementField.removeChildren();
		let e = await Al(this.targetInfo.openerFrameId);
		if (e) {
			this.openerElementField.append(e), this.securitySection.setFieldVisible(Dl(Tl.openerFrame), !0);
			return;
		}
		this.securitySection.setFieldVisible(Dl(Tl.openerFrame), !1);
	}
	buildTitle() {
		let e = this.targetInfo.title || Dl(Tl.windowWithoutTitle);
		return this.isWindowClosed && (e += ` (${Dl(Tl.closed)})`), e;
	}
	setIsWindowClosed(e) {
		this.isWindowClosed = e;
	}
	setTargetInfo(e) {
		this.targetInfo = e;
	}
}, Ml = class extends S {
	targetInfo;
	reportView;
	documentSection;
	isolationSection;
	coepPolicy;
	constructor(e) {
		super(), this.registerRequiredCSS(Cl), this.targetInfo = e, this.contentElement.classList.add("frame-details-container"), this.reportView = new An(this.targetInfo.title || this.targetInfo.url || Dl(Tl.worker)), this.reportView.show(this.contentElement), this.reportView.registerRequiredCSS(Cl), this.reportView.element.classList.add("frame-details-report-container"), this.documentSection = this.reportView.appendSection(Dl(Tl.document));
		let t = this.documentSection.appendField(Dl(Tl.url)).createChild("div", "text-ellipsis");
		t.textContent = this.targetInfo.url, t.title = this.targetInfo.url;
		let n = this.documentSection.appendField(Dl(Tl.type));
		n.textContent = this.workerTypeToString(this.targetInfo.type), this.isolationSection = this.reportView.appendSection(Dl(Tl.securityIsolation)), this.coepPolicy = this.isolationSection.appendField(Dl(Tl.crossoriginEmbedderPolicy)), this.requestUpdate();
	}
	workerTypeToString(e) {
		return e === "worker" ? Dl(Tl.webWorker) : e === "service_worker" ? d("Service Worker") : Dl(Tl.unknown);
	}
	async updateCoopCoepStatus() {
		let e = C.instance().targetById(this.targetInfo.targetId);
		if (!e) return;
		let t = e.model(Vt), n = t && await t.getSecurityIsolationStatus(null);
		n && this.fillCrossOriginPolicy(this.coepPolicy, (e) => e !== x.CrossOriginEmbedderPolicyValue.None, n.coep);
	}
	fillCrossOriginPolicy(e, t, n) {
		if (!n) {
			e.textContent = "";
			return;
		}
		let r = t(n.value);
		if (e.textContent = r ? n.value : n.reportOnlyValue, !r && t(n.reportOnlyValue)) {
			let t = document.createElement("span");
			t.classList.add("inline-comment"), t.textContent = "report-only", e.appendChild(t);
		}
		let i = r ? n.reportingEndpoint : n.reportOnlyReportingEndpoint;
		if (i) {
			let t = e.createChild("span", "inline-name");
			t.textContent = Dl(Tl.reportingTo);
			let n = e.createChild("span");
			n.textContent = i;
		}
	}
	async performUpdate() {
		await this.updateCoopCoepStatus();
	}
}, V = {
	PrefetchFailedIneligibleRedirect: "The prefetch was redirected, but the redirect URL is not eligible for prefetch.",
	PrefetchFailedInvalidRedirect: "The prefetch was redirected, but there was a problem with the redirect.",
	PrefetchFailedMIMENotSupported: "The prefetch failed because the response's Content-Type header was not supported.",
	PrefetchFailedNetError: "The prefetch failed because of a network error.",
	PrefetchFailedNon2XX: "The prefetch failed because of a non-2xx HTTP response status code.",
	PrefetchFailedNon2XXWithStatusCode: "The prefetch failed because of a non-2xx HTTP response status code ({PH1}).",
	PrefetchIneligibleRetryAfter: "A previous prefetch to the origin got a HTTP 503 response with an Retry-After header that has not elapsed yet.",
	PrefetchIsPrivacyDecoy: "The URL was not eligible to be prefetched because there was a registered service worker or cross-site cookies for that origin, but the prefetch was put on the network anyways and not used, to disguise that the user had some kind of previous relationship with the origin.",
	PrefetchIsStale: "Too much time elapsed between the prefetch and usage, so the prefetch was discarded.",
	PrefetchNotEligibleBrowserContextOffTheRecord: "The prefetch was not performed because the browser is in Incognito or Guest mode.",
	PrefetchNotEligibleDataSaverEnabled: "The prefetch was not performed because the operating system is in Data Saver mode.",
	PrefetchNotEligibleExistingProxy: "The URL is not eligible to be prefetched, because in the default network context it is configured to use a proxy server.",
	PrefetchNotEligibleHostIsNonUnique: "The URL was not eligible to be prefetched because its host was not unique (e.g., a non publicly routable IP address or a hostname which is not registry-controlled), but the prefetch was required to be proxied.",
	PrefetchNotEligibleNonDefaultStoragePartition: "The URL was not eligible to be prefetched because it uses a non-default storage partition.",
	PrefetchNotEligibleSameSiteCrossOriginPrefetchRequiredProxy: "The URL was not eligible to be prefetched because the default network context cannot be configured to use the prefetch proxy for a same-site cross-origin prefetch request.",
	PrefetchNotEligibleSchemeIsNotHttps: "The URL was not eligible to be prefetched because its scheme was not https:.",
	PrefetchNotEligibleUserHasCookies: "The URL was not eligible to be prefetched because it was cross-site, but the user had cookies for that origin.",
	PrefetchNotEligibleUserHasServiceWorker: "The URL was not eligible to be prefetched because there was a registered service worker for that origin, which is currently not supported.",
	PrefetchNotUsedCookiesChanged: "The prefetch was not used because it was a cross-site prefetch, and cookies were added for that URL while the prefetch was ongoing, so the prefetched response is now out-of-date.",
	PrefetchProxyNotAvailable: "A network error was encountered when trying to set up a connection to the prefetching proxy.",
	PrefetchNotUsedProbeFailed: "The prefetch was blocked by your Internet Service Provider or network administrator.",
	PrefetchEvictedForNewerPrefetch: "The prefetch was discarded because the initiating page has too many prefetches ongoing, and this was one of the oldest.",
	PrefetchEvictedAfterCandidateRemoved: "The prefetch was discarded because no speculation rule in the initating page triggers a prefetch for this URL anymore.",
	PrefetchNotEligibleBatterySaverEnabled: "The prefetch was not performed because the Battery Saver setting was enabled.",
	PrefetchNotEligiblePreloadingDisabled: "The prefetch was not performed because speculative loading was disabled.",
	PrefetchEvictedAfterBrowsingDataRemoved: "The prefetch was discarded because browsing data was removed.",
	prerenderFinalStatusLowEndDevice: "The prerender was not performed because this device does not have enough total system memory to support prerendering.",
	prerenderFinalStatusInvalidSchemeRedirect: "The prerendering navigation failed because it redirected to a URL whose scheme was not http: or https:.",
	prerenderFinalStatusInvalidSchemeNavigation: "The URL was not eligible to be prerendered because its scheme was not http: or https:.",
	prerenderFinalStatusNavigationRequestBlockedByCsp: "The prerendering navigation was blocked by a Content Security Policy.",
	prerenderFinalStatusMojoBinderPolicy: "The prerendered page used a forbidden JavaScript API that is currently not supported. (Internal Mojo interface: {PH1})",
	prerenderFinalStatusRendererProcessCrashed: "The prerendered page crashed.",
	prerenderFinalStatusRendererProcessKilled: "The prerendered page was killed.",
	prerenderFinalStatusDownload: "The prerendered page attempted to initiate a download, which is currently not supported.",
	prerenderFinalStatusNavigationBadHttpStatus: "The prerendering navigation failed because of a non-2xx HTTP response status code.",
	prerenderFinalStatusNavigationBadHttpStatusWithStatusCode: "The prerendering navigation failed because of a non-2xx HTTP response status code ({PH1}).",
	prerenderFinalStatusClientCertRequested: "The prerendering navigation required a HTTP client certificate.",
	prerenderFinalStatusNavigationRequestNetworkError: "The prerendering navigation encountered a network error.",
	prerenderFinalStatusSslCertificateError: "The prerendering navigation failed because of an invalid SSL certificate.",
	prerenderFinalStatusLoginAuthRequested: "The prerendering navigation required HTTP authentication, which is currently not supported.",
	prerenderFinalStatusUaChangeRequiresReload: "Changing User Agent occurred in prerendering navigation.",
	prerenderFinalStatusBlockedByClient: "Some resource load was blocked.",
	prerenderFinalStatusAudioOutputDeviceRequested: "The prerendered page requested audio output, which is currently not supported.",
	prerenderFinalStatusMixedContent: "The prerendered page contained mixed content.",
	prerenderFinalStatusTriggerBackgrounded: "The initiating page was backgrounded, so the prerendered page was discarded.",
	prerenderFinalStatusMemoryLimitExceeded: "The prerender was not performed because the browser exceeded the prerendering memory limit.",
	prerenderFinalStatusDataSaverEnabled: "The prerender was not performed because the user requested that the browser use less data.",
	prerenderFinalStatusHasEffectiveUrl: "The initiating page cannot perform prerendering, because it has an effective URL that is different from its normal URL. (For example, the New Tab Page, or hosted apps.)",
	prerenderFinalStatusTimeoutBackgrounded: "The initiating page was backgrounded for a long time, so the prerendered page was discarded.",
	prerenderFinalStatusCrossSiteRedirectInInitialNavigation: "The prerendering navigation failed because the prerendered URL redirected to a cross-site URL.",
	prerenderFinalStatusCrossSiteNavigationInInitialNavigation: "The prerendering navigation failed because it targeted a cross-site URL.",
	prerenderFinalStatusSameSiteCrossOriginRedirectNotOptInInInitialNavigation: "The prerendering navigation failed because the prerendered URL redirected to a cross-origin same-site URL, but the destination response did not include the appropriate Supports-Loading-Mode header.",
	prerenderFinalStatusSameSiteCrossOriginNavigationNotOptInInInitialNavigation: "The prerendering navigation failed because it was to a cross-origin same-site URL, but the destination response did not include the appropriate Supports-Loading-Mode header.",
	prerenderFinalStatusActivationNavigationParameterMismatch: "The prerender was not used because during activation time, different navigation parameters (e.g., HTTP headers) were calculated than during the original prerendering navigation request.",
	prerenderFinalStatusPrimaryMainFrameRendererProcessCrashed: "The initiating page crashed.",
	prerenderFinalStatusPrimaryMainFrameRendererProcessKilled: "The initiating page was killed.",
	prerenderFinalStatusActivationFramePolicyNotCompatible: "The prerender was not used because the sandboxing flags or permissions policy of the initiating page was not compatible with those of the prerendering page.",
	prerenderFinalStatusPreloadingDisabled: "The prerender was not performed because the user disabled preloading in their browser settings.",
	prerenderFinalStatusBatterySaverEnabled: "The prerender was not performed because the user requested that the browser use less battery.",
	prerenderFinalStatusActivatedDuringMainFrameNavigation: "Prerendered page activated during initiating page's main frame navigation.",
	prerenderFinalStatusCrossSiteRedirectInMainFrameNavigation: "The prerendered page navigated to a URL which redirected to a cross-site URL.",
	prerenderFinalStatusCrossSiteNavigationInMainFrameNavigation: "The prerendered page navigated to a cross-site URL.",
	prerenderFinalStatusSameSiteCrossOriginRedirectNotOptInInMainFrameNavigation: "The prerendered page navigated to a URL which redirected to a cross-origin same-site URL, but the destination response did not include the appropriate Supports-Loading-Mode header.",
	prerenderFinalStatusSameSiteCrossOriginNavigationNotOptInInMainFrameNavigation: "The prerendered page navigated to a cross-origin same-site URL, but the destination response did not include the appropriate Supports-Loading-Mode header.",
	prerenderFinalStatusMemoryPressureOnTrigger: "The prerender was not performed because the browser was under critical memory pressure.",
	prerenderFinalStatusMemoryPressureAfterTriggered: "The prerendered page was unloaded because the browser came under critical memory pressure.",
	prerenderFinalStatusPrerenderingDisabledByDevTools: "The prerender was not performed because DevTools has been used to disable prerendering.",
	prerenderFinalStatusSpeculationRuleRemoved: "The prerendered page was unloaded because the initiating page removed the corresponding prerender rule from <script type=\"speculationrules\">.",
	prerenderFinalStatusActivatedWithAuxiliaryBrowsingContexts: "The prerender was not used because during activation time, there were other windows with an active opener reference to the initiating page, which is currently not supported.",
	prerenderFinalStatusMaxNumOfRunningEagerPrerendersExceeded: "The prerender whose eagerness is \"eager\" was not performed because the initiating page already has too many prerenders ongoing. Remove other speculation rules with \"eager\" to enable further prerendering.",
	prerenderFinalStatusMaxNumOfRunningEmbedderPrerendersExceeded: "The browser-triggered prerender was not performed because the initiating page already has too many prerenders ongoing.",
	prerenderFinalStatusMaxNumOfRunningNonEagerPrerendersExceeded: "The old non-eager prerender (with a \"moderate\" or \"conservative\" eagerness and triggered by hovering or clicking links) was automatically canceled due to starting a new non-eager prerender. It can be retriggered by interacting with the link again.",
	prerenderFinalStatusPrerenderingUrlHasEffectiveUrl: "The prerendering navigation failed because it has an effective URL that is different from its normal URL. (For example, the New Tab Page, or hosted apps.)",
	prerenderFinalStatusRedirectedPrerenderingUrlHasEffectiveUrl: "The prerendering navigation failed because it redirected to an effective URL that is different from its normal URL. (For example, the New Tab Page, or hosted apps.)",
	prerenderFinalStatusActivationUrlHasEffectiveUrl: "The prerender was not used because during activation time, navigation has an effective URL that is different from its normal URL. (For example, the New Tab Page, or hosted apps.)",
	prerenderFinalStatusJavaScriptInterfaceAdded: "The prerendered page was unloaded because a new JavaScript interface has been injected by WebView.addJavascriptInterface().",
	prerenderFinalStatusJavaScriptInterfaceRemoved: "The prerendered page was unloaded because a JavaScript interface has been removed by WebView.removeJavascriptInterface().",
	prerenderFinalStatusAllPrerenderingCanceled: "All prerendered pages were unloaded by the browser for some reason (For example, WebViewCompat.addWebMessageListener() was called during prerendering.)",
	prerenderFinalStatusWindowClosed: "The prerendered page was unloaded because it called window.close().",
	prerenderFinalStatusBrowsingDataRemoved: "The prerendered page was unloaded because browsing data was removed.",
	statusNotTriggered: "Not triggered",
	statusPending: "Pending",
	statusRunning: "Running",
	statusReady: "Ready",
	statusSuccess: "Success",
	statusFailure: "Failure"
}, Nl = s("panels/application/preloading/components/PreloadingString.ts", V), Pl = n.bind(void 0, Nl), H = a.bind(void 0, Nl), Fl = {
	PrefetchFailedIneligibleRedirect: { name: Pl(V.PrefetchFailedIneligibleRedirect) },
	PrefetchFailedInvalidRedirect: { name: Pl(V.PrefetchFailedInvalidRedirect) },
	PrefetchFailedMIMENotSupported: { name: Pl(V.PrefetchFailedMIMENotSupported) },
	PrefetchFailedNetError: { name: Pl(V.PrefetchFailedNetError) },
	PrefetchFailedNon2XX: { name: Pl(V.PrefetchFailedNon2XX) },
	PrefetchIneligibleRetryAfter: { name: Pl(V.PrefetchIneligibleRetryAfter) },
	PrefetchIsPrivacyDecoy: { name: Pl(V.PrefetchIsPrivacyDecoy) },
	PrefetchIsStale: { name: Pl(V.PrefetchIsStale) },
	PrefetchNotEligibleBrowserContextOffTheRecord: { name: Pl(V.PrefetchNotEligibleBrowserContextOffTheRecord) },
	PrefetchNotEligibleDataSaverEnabled: { name: Pl(V.PrefetchNotEligibleDataSaverEnabled) },
	PrefetchNotEligibleExistingProxy: { name: Pl(V.PrefetchNotEligibleExistingProxy) },
	PrefetchNotEligibleHostIsNonUnique: { name: Pl(V.PrefetchNotEligibleHostIsNonUnique) },
	PrefetchNotEligibleNonDefaultStoragePartition: { name: Pl(V.PrefetchNotEligibleNonDefaultStoragePartition) },
	PrefetchNotEligibleSameSiteCrossOriginPrefetchRequiredProxy: { name: Pl(V.PrefetchNotEligibleSameSiteCrossOriginPrefetchRequiredProxy) },
	PrefetchNotEligibleSchemeIsNotHttps: { name: Pl(V.PrefetchNotEligibleSchemeIsNotHttps) },
	PrefetchNotEligibleUserHasCookies: { name: Pl(V.PrefetchNotEligibleUserHasCookies) },
	PrefetchNotEligibleUserHasServiceWorker: { name: Pl(V.PrefetchNotEligibleUserHasServiceWorker) },
	PrefetchNotUsedCookiesChanged: { name: Pl(V.PrefetchNotUsedCookiesChanged) },
	PrefetchProxyNotAvailable: { name: Pl(V.PrefetchProxyNotAvailable) },
	PrefetchNotUsedProbeFailed: { name: Pl(V.PrefetchNotUsedProbeFailed) },
	PrefetchEvictedForNewerPrefetch: { name: Pl(V.PrefetchEvictedForNewerPrefetch) },
	PrefetchEvictedAfterCandidateRemoved: { name: Pl(V.PrefetchEvictedAfterCandidateRemoved) },
	PrefetchNotEligibleBatterySaverEnabled: { name: Pl(V.PrefetchNotEligibleBatterySaverEnabled) },
	PrefetchNotEligiblePreloadingDisabled: { name: Pl(V.PrefetchNotEligiblePreloadingDisabled) },
	PrefetchNotEligibleUserHasServiceWorkerNoFetchHandler: { name: () => d("Unknown") },
	PrefetchNotEligibleRedirectFromServiceWorker: { name: () => d("Unknown") },
	PrefetchNotEligibleRedirectToServiceWorker: { name: () => d("Unknown") },
	PrefetchEvictedAfterBrowsingDataRemoved: { name: Pl(V.PrefetchEvictedAfterBrowsingDataRemoved) }
};
function Il({ prefetchStatus: e }, t) {
	switch (e) {
		case null: return null;
		case O.PrefetchStatus.PrefetchNotStarted: return null;
		case O.PrefetchStatus.PrefetchNotFinishedInTime: return null;
		case O.PrefetchStatus.PrefetchResponseUsed: return null;
		case O.PrefetchStatus.PrefetchAllowed:
		case O.PrefetchStatus.PrefetchHeldback: return null;
		case O.PrefetchStatus.PrefetchSuccessfulButNotUsed: return null;
		case O.PrefetchStatus.PrefetchFailedIneligibleRedirect: return Fl.PrefetchFailedIneligibleRedirect.name();
		case O.PrefetchStatus.PrefetchFailedInvalidRedirect: return Fl.PrefetchFailedInvalidRedirect.name();
		case O.PrefetchStatus.PrefetchFailedMIMENotSupported: return Fl.PrefetchFailedMIMENotSupported.name();
		case O.PrefetchStatus.PrefetchFailedNetError: return Fl.PrefetchFailedNetError.name();
		case O.PrefetchStatus.PrefetchFailedNon2XX: return t === void 0 ? Fl.PrefetchFailedNon2XX.name() : H(V.PrefetchFailedNon2XXWithStatusCode, { PH1: String(t) });
		case O.PrefetchStatus.PrefetchIneligibleRetryAfter: return Fl.PrefetchIneligibleRetryAfter.name();
		case O.PrefetchStatus.PrefetchEvictedForNewerPrefetch: return Fl.PrefetchEvictedForNewerPrefetch.name();
		case O.PrefetchStatus.PrefetchEvictedAfterCandidateRemoved: return Fl.PrefetchEvictedAfterCandidateRemoved.name();
		case O.PrefetchStatus.PrefetchIsPrivacyDecoy: return Fl.PrefetchIsPrivacyDecoy.name();
		case O.PrefetchStatus.PrefetchIsStale: return Fl.PrefetchIsStale.name();
		case O.PrefetchStatus.PrefetchNotEligibleBrowserContextOffTheRecord: return Fl.PrefetchNotEligibleBrowserContextOffTheRecord.name();
		case O.PrefetchStatus.PrefetchNotEligibleDataSaverEnabled: return Fl.PrefetchNotEligibleDataSaverEnabled.name();
		case O.PrefetchStatus.PrefetchNotEligibleExistingProxy: return Fl.PrefetchNotEligibleExistingProxy.name();
		case O.PrefetchStatus.PrefetchNotEligibleHostIsNonUnique: return Fl.PrefetchNotEligibleHostIsNonUnique.name();
		case O.PrefetchStatus.PrefetchNotEligibleNonDefaultStoragePartition: return Fl.PrefetchNotEligibleNonDefaultStoragePartition.name();
		case O.PrefetchStatus.PrefetchNotEligibleSameSiteCrossOriginPrefetchRequiredProxy: return Fl.PrefetchNotEligibleSameSiteCrossOriginPrefetchRequiredProxy.name();
		case O.PrefetchStatus.PrefetchNotEligibleSchemeIsNotHttps: return Fl.PrefetchNotEligibleSchemeIsNotHttps.name();
		case O.PrefetchStatus.PrefetchNotEligibleUserHasCookies: return Fl.PrefetchNotEligibleUserHasCookies.name();
		case O.PrefetchStatus.PrefetchNotEligibleUserHasServiceWorker: return Fl.PrefetchNotEligibleUserHasServiceWorker.name();
		case O.PrefetchStatus.PrefetchNotUsedCookiesChanged: return Fl.PrefetchNotUsedCookiesChanged.name();
		case O.PrefetchStatus.PrefetchProxyNotAvailable: return Fl.PrefetchProxyNotAvailable.name();
		case O.PrefetchStatus.PrefetchNotUsedProbeFailed: return Fl.PrefetchNotUsedProbeFailed.name();
		case O.PrefetchStatus.PrefetchNotEligibleBatterySaverEnabled: return Fl.PrefetchNotEligibleBatterySaverEnabled.name();
		case O.PrefetchStatus.PrefetchNotEligiblePreloadingDisabled: return Fl.PrefetchNotEligiblePreloadingDisabled.name();
		case O.PrefetchStatus.PrefetchNotEligibleUserHasServiceWorkerNoFetchHandler: return Fl.PrefetchNotEligibleUserHasServiceWorkerNoFetchHandler.name();
		case O.PrefetchStatus.PrefetchNotEligibleRedirectFromServiceWorker: return Fl.PrefetchNotEligibleRedirectFromServiceWorker.name();
		case O.PrefetchStatus.PrefetchNotEligibleRedirectToServiceWorker: return Fl.PrefetchNotEligibleRedirectToServiceWorker.name();
		case O.PrefetchStatus.PrefetchEvictedAfterBrowsingDataRemoved: return Fl.PrefetchEvictedAfterBrowsingDataRemoved.name();
		default: return d(`Unknown failure reason: ${e}`);
	}
}
function Ll(e, t) {
	switch (e.prerenderStatus) {
		case null:
		case O.PrerenderFinalStatus.Activated: return null;
		case O.PrerenderFinalStatus.Destroyed: return d("Unknown");
		case O.PrerenderFinalStatus.LowEndDevice: return H(V.prerenderFinalStatusLowEndDevice);
		case O.PrerenderFinalStatus.InvalidSchemeRedirect: return H(V.prerenderFinalStatusInvalidSchemeRedirect);
		case O.PrerenderFinalStatus.InvalidSchemeNavigation: return H(V.prerenderFinalStatusInvalidSchemeNavigation);
		case O.PrerenderFinalStatus.NavigationRequestBlockedByCsp: return H(V.prerenderFinalStatusNavigationRequestBlockedByCsp);
		case O.PrerenderFinalStatus.MojoBinderPolicy: return Qn(e.disallowedMojoInterface), H(V.prerenderFinalStatusMojoBinderPolicy, { PH1: e.disallowedMojoInterface });
		case O.PrerenderFinalStatus.RendererProcessCrashed: return H(V.prerenderFinalStatusRendererProcessCrashed);
		case O.PrerenderFinalStatus.RendererProcessKilled: return H(V.prerenderFinalStatusRendererProcessKilled);
		case O.PrerenderFinalStatus.Download: return H(V.prerenderFinalStatusDownload);
		case O.PrerenderFinalStatus.TriggerDestroyed: return d("Internal error");
		case O.PrerenderFinalStatus.NavigationNotCommitted: return d("Internal error");
		case O.PrerenderFinalStatus.NavigationBadHttpStatus: return t === void 0 ? H(V.prerenderFinalStatusNavigationBadHttpStatus) : H(V.prerenderFinalStatusNavigationBadHttpStatusWithStatusCode, { PH1: String(t) });
		case O.PrerenderFinalStatus.ClientCertRequested: return H(V.prerenderFinalStatusClientCertRequested);
		case O.PrerenderFinalStatus.NavigationRequestNetworkError: return H(V.prerenderFinalStatusNavigationRequestNetworkError);
		case O.PrerenderFinalStatus.CancelAllHostsForTesting: throw Error("unreachable");
		case O.PrerenderFinalStatus.DidFailLoad: return d("Unknown");
		case O.PrerenderFinalStatus.Stop: return d("Unknown");
		case O.PrerenderFinalStatus.SslCertificateError: return H(V.prerenderFinalStatusSslCertificateError);
		case O.PrerenderFinalStatus.LoginAuthRequested: return H(V.prerenderFinalStatusLoginAuthRequested);
		case O.PrerenderFinalStatus.UaChangeRequiresReload: return H(V.prerenderFinalStatusUaChangeRequiresReload);
		case O.PrerenderFinalStatus.BlockedByClient: return H(V.prerenderFinalStatusBlockedByClient);
		case O.PrerenderFinalStatus.AudioOutputDeviceRequested: return H(V.prerenderFinalStatusAudioOutputDeviceRequested);
		case O.PrerenderFinalStatus.MixedContent: return H(V.prerenderFinalStatusMixedContent);
		case O.PrerenderFinalStatus.TriggerBackgrounded: return H(V.prerenderFinalStatusTriggerBackgrounded);
		case O.PrerenderFinalStatus.MemoryLimitExceeded: return H(V.prerenderFinalStatusMemoryLimitExceeded);
		case O.PrerenderFinalStatus.DataSaverEnabled: return H(V.prerenderFinalStatusDataSaverEnabled);
		case O.PrerenderFinalStatus.TriggerUrlHasEffectiveUrl: return H(V.prerenderFinalStatusHasEffectiveUrl);
		case O.PrerenderFinalStatus.ActivatedBeforeStarted: return d("Internal error");
		case O.PrerenderFinalStatus.InactivePageRestriction: return d("Internal error");
		case O.PrerenderFinalStatus.StartFailed: return d("Internal error");
		case O.PrerenderFinalStatus.TimeoutBackgrounded: return H(V.prerenderFinalStatusTimeoutBackgrounded);
		case O.PrerenderFinalStatus.CrossSiteRedirectInInitialNavigation: return H(V.prerenderFinalStatusCrossSiteRedirectInInitialNavigation);
		case O.PrerenderFinalStatus.CrossSiteNavigationInInitialNavigation: return H(V.prerenderFinalStatusCrossSiteNavigationInInitialNavigation);
		case O.PrerenderFinalStatus.SameSiteCrossOriginRedirectNotOptInInInitialNavigation: return H(V.prerenderFinalStatusSameSiteCrossOriginRedirectNotOptInInInitialNavigation);
		case O.PrerenderFinalStatus.SameSiteCrossOriginNavigationNotOptInInInitialNavigation: return H(V.prerenderFinalStatusSameSiteCrossOriginNavigationNotOptInInInitialNavigation);
		case O.PrerenderFinalStatus.ActivationNavigationParameterMismatch: return H(V.prerenderFinalStatusActivationNavigationParameterMismatch);
		case O.PrerenderFinalStatus.ActivatedInBackground: return d("Internal error");
		case O.PrerenderFinalStatus.EmbedderHostDisallowed: throw Error("unreachable");
		case O.PrerenderFinalStatus.ActivationNavigationDestroyedBeforeSuccess: return d("Internal error");
		case O.PrerenderFinalStatus.TabClosedByUserGesture: throw Error("unreachable");
		case O.PrerenderFinalStatus.TabClosedWithoutUserGesture: throw Error("unreachable");
		case O.PrerenderFinalStatus.PrimaryMainFrameRendererProcessCrashed: return H(V.prerenderFinalStatusPrimaryMainFrameRendererProcessCrashed);
		case O.PrerenderFinalStatus.PrimaryMainFrameRendererProcessKilled: return H(V.prerenderFinalStatusPrimaryMainFrameRendererProcessKilled);
		case O.PrerenderFinalStatus.ActivationFramePolicyNotCompatible: return H(V.prerenderFinalStatusActivationFramePolicyNotCompatible);
		case O.PrerenderFinalStatus.PreloadingDisabled: return H(V.prerenderFinalStatusPreloadingDisabled);
		case O.PrerenderFinalStatus.BatterySaverEnabled: return H(V.prerenderFinalStatusBatterySaverEnabled);
		case O.PrerenderFinalStatus.ActivatedDuringMainFrameNavigation: return H(V.prerenderFinalStatusActivatedDuringMainFrameNavigation);
		case O.PrerenderFinalStatus.PreloadingUnsupportedByWebContents: throw Error("unreachable");
		case O.PrerenderFinalStatus.CrossSiteRedirectInMainFrameNavigation: return H(V.prerenderFinalStatusCrossSiteRedirectInMainFrameNavigation);
		case O.PrerenderFinalStatus.CrossSiteNavigationInMainFrameNavigation: return H(V.prerenderFinalStatusCrossSiteNavigationInMainFrameNavigation);
		case O.PrerenderFinalStatus.SameSiteCrossOriginRedirectNotOptInInMainFrameNavigation: return H(V.prerenderFinalStatusSameSiteCrossOriginRedirectNotOptInInMainFrameNavigation);
		case O.PrerenderFinalStatus.SameSiteCrossOriginNavigationNotOptInInMainFrameNavigation: return H(V.prerenderFinalStatusSameSiteCrossOriginNavigationNotOptInInMainFrameNavigation);
		case O.PrerenderFinalStatus.MemoryPressureOnTrigger: return H(V.prerenderFinalStatusMemoryPressureOnTrigger);
		case O.PrerenderFinalStatus.MemoryPressureAfterTriggered: return H(V.prerenderFinalStatusMemoryPressureAfterTriggered);
		case O.PrerenderFinalStatus.PrerenderingDisabledByDevTools: return H(V.prerenderFinalStatusPrerenderingDisabledByDevTools);
		case O.PrerenderFinalStatus.SpeculationRuleRemoved: return H(V.prerenderFinalStatusSpeculationRuleRemoved);
		case O.PrerenderFinalStatus.ActivatedWithAuxiliaryBrowsingContexts: return H(V.prerenderFinalStatusActivatedWithAuxiliaryBrowsingContexts);
		case O.PrerenderFinalStatus.MaxNumOfRunningEagerPrerendersExceeded: return H(V.prerenderFinalStatusMaxNumOfRunningEagerPrerendersExceeded);
		case O.PrerenderFinalStatus.MaxNumOfRunningEmbedderPrerendersExceeded: return H(V.prerenderFinalStatusMaxNumOfRunningEmbedderPrerendersExceeded);
		case O.PrerenderFinalStatus.MaxNumOfRunningNonEagerPrerendersExceeded: return H(V.prerenderFinalStatusMaxNumOfRunningNonEagerPrerendersExceeded);
		case O.PrerenderFinalStatus.PrerenderingUrlHasEffectiveUrl: return H(V.prerenderFinalStatusPrerenderingUrlHasEffectiveUrl);
		case O.PrerenderFinalStatus.RedirectedPrerenderingUrlHasEffectiveUrl: return H(V.prerenderFinalStatusRedirectedPrerenderingUrlHasEffectiveUrl);
		case O.PrerenderFinalStatus.ActivationUrlHasEffectiveUrl: return H(V.prerenderFinalStatusActivationUrlHasEffectiveUrl);
		case O.PrerenderFinalStatus.JavaScriptInterfaceAdded: return H(V.prerenderFinalStatusJavaScriptInterfaceAdded);
		case O.PrerenderFinalStatus.JavaScriptInterfaceRemoved: return H(V.prerenderFinalStatusJavaScriptInterfaceRemoved);
		case O.PrerenderFinalStatus.AllPrerenderingCanceled: return H(V.prerenderFinalStatusAllPrerenderingCanceled);
		case O.PrerenderFinalStatus.WindowClosed: return H(V.prerenderFinalStatusWindowClosed);
		case O.PrerenderFinalStatus.BrowsingDataRemoved: return H(V.prerenderFinalStatusBrowsingDataRemoved);
		case O.PrerenderFinalStatus.SlowNetwork:
		case O.PrerenderFinalStatus.OtherPrerenderedPageActivated:
		case O.PrerenderFinalStatus.V8OptimizerDisabled:
		case O.PrerenderFinalStatus.PrerenderFailedDuringPrefetch: return "";
		default: return d(`Unknown failure reason: ${e.prerenderStatus}`);
	}
}
function Rl(e, t) {
	let n = e.url === void 0 ? t : e.url;
	return ir(n);
}
function zl(e, t) {
	return !e.errorMessage && e.tag ? "\"" + e.tag + "\"" : Rl(e, t);
}
function Bl(e) {
	switch (e) {
		case O.SpeculationAction.Prefetch: return d("Prefetch");
		case O.SpeculationAction.Prerender: return d("Prerender");
		case O.SpeculationAction.PrerenderUntilScript: return d("Prerender until script");
	}
}
function Vl(e) {
	switch (e.status) {
		case E.NOT_SUPPORTED: return 0;
		case E.PENDING: return 1;
		case E.RUNNING: return 2;
		case E.READY: return 3;
		case E.SUCCESS: return 4;
		case E.FAILURE: switch (e.action) {
			case O.SpeculationAction.Prefetch: return 5;
			case O.SpeculationAction.Prerender: return 6;
			case O.SpeculationAction.PrerenderUntilScript: return 7;
		}
		case E.NOT_TRIGGERED: return 8;
		default: Zn(e.status, "Unknown Preloading attempt status");
	}
}
function Hl(e) {
	switch (e) {
		case E.NOT_TRIGGERED: return H(V.statusNotTriggered);
		case E.PENDING: return H(V.statusPending);
		case E.RUNNING: return H(V.statusRunning);
		case E.READY: return H(V.statusReady);
		case E.SUCCESS: return H(V.statusSuccess);
		case E.FAILURE: return H(V.statusFailure);
		case E.NOT_SUPPORTED: return d("Internal error");
	}
}
function Ul(e, t) {
	let n = Hl(e.status);
	if (e.status !== E.FAILURE) return n;
	switch (e.action) {
		case O.SpeculationAction.Prefetch: {
			let r = Il(e, t) ?? d("Internal error");
			return n + " - " + r;
		}
		case O.SpeculationAction.Prerender:
		case O.SpeculationAction.PrerenderUntilScript: {
			let r = Ll(e, t);
			return Qn(r), n + " - " + r;
		}
	}
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/application/preloading/components/MismatchedPreloadingGrid.ts
var { charDiff: Wl } = er, { render: Gl, html: Kl, Directives: { styleMap: ql } } = Ie, Jl = {
	url: "URL",
	action: "Action",
	status: "Status",
	statusNotTriggered: "Not triggered",
	statusPending: "Pending",
	statusRunning: "Running",
	statusReady: "Ready",
	statusSuccess: "Success",
	statusFailure: "Failure"
}, Yl = s("panels/application/preloading/components/MismatchedPreloadingGrid.ts", Jl), Xl = a.bind(void 0, Yl), Zl = class {
	static status(e) {
		switch (e) {
			case E.NOT_TRIGGERED: return Xl(Jl.statusNotTriggered);
			case E.PENDING: return Xl(Jl.statusPending);
			case E.RUNNING: return Xl(Jl.statusRunning);
			case E.READY: return Xl(Jl.statusReady);
			case E.SUCCESS: return Xl(Jl.statusSuccess);
			case E.FAILURE: return Xl(Jl.statusFailure);
			case E.NOT_SUPPORTED: return d("Internal error");
		}
	}
}, Ql = (e, t, n) => {
	Gl(Kl`
    <devtools-data-grid striped inline>
      <table>
        <tr>
          <th id="url" weight="40" sortable>
            ${Xl(Jl.url)}
          </th>
          <th id="action" weight="15" sortable>
            ${Xl(Jl.action)}
          </th>
          <th id="status" weight="15" sortable>
            ${Xl(Jl.status)}
          </th>
        </tr>
        ${e.rows.map((t) => ({
		row: t,
		diffScore: er.characterScore(t.url, e.pageURL)
	})).sort((e, t) => t.diffScore - e.diffScore).map(({ row: t }) => Kl`
              <tr>
                <td>
                  <div>${Wl(t.url, e.pageURL).map((e) => {
		let t = e[1];
		switch (e[0]) {
			case $n.Equal: return Kl`<span>${t}</span>`;
			case $n.Insert: return Kl`<span style=${ql({
				color: "var(--sys-color-green)",
				"text-decoration": "line-through"
			})}
                              >${t}</span>`;
			case $n.Delete: return Kl`<span style=${ql({ color: "var(--sys-color-error)" })}>${t}</span>`;
			case $n.Edit: return Kl`<span style=${ql({
				color: "var(--sys-color-green",
				"text-decoration": "line-through"
			})}
                          >${t}</span>`;
			default: throw Error("unreachable");
		}
	})}
                  </div>
                </td>
                <td>${Bl(t.action)}</td>
                <td>${Zl.status(t.status)}</td>
              </tr>
            `)}
      </table>
    </devtools-data-grid>`, n, { container: { classes: ["devtools-resources-mismatched-preloading-grid"] } });
}, $l = class extends tn {
	#e = null;
	#t;
	constructor(e, t = Ql) {
		super(e, { useShadowDom: "pure" }), this.#t = t;
	}
	wasShown() {
		super.wasShown(), this.requestUpdate();
	}
	set data(e) {
		this.#e = e, this.requestUpdate();
	}
	performUpdate() {
		this.#e && this.#t(this.#e, {}, this.contentElement);
	}
}, eu = "/*\n * Copyright 2022 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n:host {\n  display: flex;\n  height: 100%;\n}\n\ndevtools-report {\n  flex-grow: 1;\n}\n\nbutton.link {\n  color: var(--sys-color-primary);\n  text-decoration: underline;\n  padding: 0;\n  border: none;\n  background: none;\n  font-family: inherit;\n  font-size: inherit;\n  height: 16px;\n}\n\nbutton.link devtools-icon {\n  vertical-align: sub;\n}\n\n.link {\n  color: var(--sys-color-primary);\n  text-decoration: underline;\n  cursor: pointer;\n}\n", { html: tu } = Ie, nu = {
	noElementSelected: "No element selected",
	selectAnElementForMoreDetails: "Select an element for more details",
	detailsDetailedInformation: "Detailed information",
	detailsAction: "Action",
	detailsStatus: "Status",
	detailsTargetHint: "Target hint",
	detailsFormSubmission: "Form submission",
	detailsFailureReason: "Failure reason",
	detailsRuleSet: "Rule set",
	yes: "Yes",
	no: "No",
	automaticallyFellBackToPrefetch: "(automatically fell back to prefetch)",
	detailedStatusNotTriggered: "Speculative load attempt is not yet triggered.",
	detailedStatusPending: "Speculative load attempt is eligible but pending.",
	detailedStatusRunning: "Speculative load is running.",
	detailedStatusReady: "Speculative load finished and the result is ready for the next navigation.",
	detailedStatusSuccess: "Speculative load finished and used for a navigation.",
	detailedStatusFailure: "Speculative load failed.",
	detailedStatusFallbackToPrefetch: "Speculative load failed, but fallback to prefetch succeeded.",
	buttonInspect: "Inspect",
	buttonClickToInspect: "Click to inspect prerendered page",
	buttonClickToRevealRuleSet: "Click to reveal rule set"
}, ru = s("panels/application/preloading/components/PreloadingDetailsReportView.ts", nu), iu = a.bind(void 0, ru), au = class {
	static detailedStatus({ status: e }) {
		switch (e) {
			case E.NOT_TRIGGERED: return iu(nu.detailedStatusNotTriggered);
			case E.PENDING: return iu(nu.detailedStatusPending);
			case E.RUNNING: return iu(nu.detailedStatusRunning);
			case E.READY: return iu(nu.detailedStatusReady);
			case E.SUCCESS: return iu(nu.detailedStatusSuccess);
			case E.FAILURE: return iu(nu.detailedStatusFailure);
			case E.NOT_SUPPORTED: return d("Internal error");
		}
	}
	static detailedTargetHint(e) {
		switch (Qn(e.targetHint), e.targetHint) {
			case O.SpeculationTargetHint.Blank: return "_blank";
			case O.SpeculationTargetHint.Self: return "_self";
		}
	}
}, ou = class extends ai {
	#e = this.attachShadow({ mode: "open" });
	#t = null;
	set data(e) {
		this.#t = e, this.#n();
	}
	async #n() {
		await Dn("PreloadingDetailsReportView render", () => {
			if (this.#t === null) {
				_(tu`
          <style>${eu}</style>
          <style>${Ee}</style>
          <div class="empty-state">
            <span class="empty-state-header">${iu(nu.noElementSelected)}</span>
            <span class="empty-state-description">${iu(nu.selectAnElementForMoreDetails)}</span>
          </div>
        `, this.#e, { host: this });
				return;
			}
			let e = this.#t.pipeline, t = this.#t.pageURL, n = e.getPrerender()?.status === E.FAILURE && (e.getPrefetch()?.status === E.READY || e.getPrefetch()?.status === E.SUCCESS);
			_(tu`
        <style>${eu}</style>
        <style>${Ee}</style>
        <devtools-report
          .data=${{ reportTitle: "Speculative Loading Attempt" }}
          jslog=${T("preloading-details")}>
          <devtools-report-section-header>${iu(nu.detailsDetailedInformation)}</devtools-report-section-header>

          ${this.#r()}
          ${this.#a(n)}
          ${this.#o(n)}
          ${this.#c()}
          ${this.#l()}
          ${this.#s()}
          ${this.#u()}

          ${this.#t.ruleSets.map((e) => this.#d(e, t))}
        </devtools-report>
      `, this.#e, { host: this });
		});
	}
	#r() {
		Qn(this.#t);
		let e = this.#t.pipeline.getOriginallyTriggered(), t = this.#t.pipeline.getPrefetch()?.status, n;
		if (e.action === O.SpeculationAction.Prefetch && e.requestId !== void 0 && t !== E.NOT_TRIGGERED) {
			let { requestId: t, key: { url: r } } = e;
			n = tu`
          <devtools-request-link-icon
            .data=${{
				affectedRequest: {
					requestId: t,
					url: r
				},
				requestResolver: this.#t.requestResolver || new lr(),
				displayURL: !0,
				urlToDisplay: r
			}}
          >
          </devtools-request-link-icon>
      `;
		} else n = tu`
          <div class="text-ellipsis" title=${e.key.url}>${e.key.url}</div>
      `;
		return tu`
        <devtools-report-key>${d("URL")}</devtools-report-key>
        <devtools-report-value>
          ${n}
        </devtools-report-value>
    `;
	}
	#i(e) {
		return [O.SpeculationAction.Prerender, O.SpeculationAction.PrerenderUntilScript].includes(e);
	}
	#a(e) {
		Qn(this.#t);
		let t = this.#t.pipeline.getOriginallyTriggered(), n = Bl(t.action), r = b;
		e && (r = tu`${iu(nu.automaticallyFellBackToPrefetch)}`);
		let i = b;
		return (() => {
			if (!this.#i(t.action) || C.instance().primaryPageTarget() === null) return;
			let e = C.instance().targets().find((e) => e.targetInfo()?.subtype === "prerender" && e.inspectedURL() === t.key.url), n = e === void 0;
			i = tu`
          <devtools-button
            @click=${() => {
				e !== void 0 && jt.instance().setFlavor(Fe, e);
			}}
            .title=${iu(nu.buttonClickToInspect)}
            .size=${ft.SMALL}
            .variant=${h.OUTLINED}
            .disabled=${n}
            jslog=${Bt("inspect-prerendered-page").track({ click: !0 })}
          >
            ${iu(nu.buttonInspect)}
          </devtools-button>
      `;
		})(), tu`
        <devtools-report-key>${iu(nu.detailsAction)}</devtools-report-key>
        <devtools-report-value>
          <div class="text-ellipsis" title="">
            ${n} ${r} ${i}
          </div>
        </devtools-report-value>
    `;
	}
	#o(e) {
		Qn(this.#t);
		let t = this.#t.pipeline.getOriginallyTriggered(), n = e ? iu(nu.detailedStatusFallbackToPrefetch) : au.detailedStatus(t);
		return tu`
        <devtools-report-key>${iu(nu.detailsStatus)}</devtools-report-key>
        <devtools-report-value>
          ${n}
        </devtools-report-value>
    `;
	}
	#s() {
		Qn(this.#t);
		let e = this.#t.pipeline.getOriginallyTriggered();
		if (e.action !== O.SpeculationAction.Prefetch) return b;
		let t = Il(e, Xr(e));
		return t === null ? b : tu`
        <devtools-report-key>${iu(nu.detailsFailureReason)}</devtools-report-key>
        <devtools-report-value>
          ${t}
        </devtools-report-value>
    `;
	}
	#c() {
		Qn(this.#t);
		let e = this.#t.pipeline.getOriginallyTriggered();
		return this.#i(e.action) && e.key.targetHint !== void 0 ? tu`
        <devtools-report-key>${iu(nu.detailsTargetHint)}</devtools-report-key>
        <devtools-report-value>
          ${au.detailedTargetHint(e.key)}
        </devtools-report-value>
    ` : b;
	}
	#l() {
		Qn(this.#t);
		let e = this.#t.pipeline.getOriginallyTriggered();
		return e.key.formSubmission === void 0 || !this.#i(e.action) ? b : tu`
        <devtools-report-key>${iu(nu.detailsFormSubmission)}</devtools-report-key>
        <devtools-report-value>
          ${e.key.formSubmission ? iu(nu.yes) : iu(nu.no)}
        </devtools-report-value>
    `;
	}
	#u() {
		Qn(this.#t);
		let e = this.#t.pipeline.getOriginallyTriggered();
		if (!this.#i(e.action)) return b;
		let t = Ll(e, Xr(e));
		return t === null ? b : tu`
        <devtools-report-key>${iu(nu.detailsFailureReason)}</devtools-report-key>
        <devtools-report-value>
          ${t}
        </devtools-report-value>
    `;
	}
	#d(e, t) {
		let n = () => {
			r(new Yr(e.id));
		}, i = Rl(e, t);
		return tu`
      <devtools-report-key>${iu(nu.detailsRuleSet)}</devtools-report-key>
      <devtools-report-value>
        <div class="text-ellipsis" title="">
          <button class="link" role="link"
            @click=${n}
            title=${iu(nu.buttonClickToRevealRuleSet)}
            style=${De({
			color: "var(--sys-color-primary)",
			"text-decoration": "underline"
		})}
            jslog=${Bt("reveal-rule-set").track({ click: !0 })}
          >
            ${i}
          </button>
        </div>
      </devtools-report-value>
    `;
	}
};
customElements.define("devtools-resources-preloading-details-report-view", ou);
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/application/preloading/components/preloadingDisabledInfobar.css.mjs
var su = "/*\n * Copyright 2023 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n#container {\n  padding: 6px 12px;\n  border-bottom: 1px solid var(--sys-color-divider);\n  align-items: center;\n  display: flex;\n}\n\n#contents .key {\n  grid-column-start: span 2;\n  font-weight: bold;\n}\n\n#contents .value {\n  grid-column-start: span 2;\n  margin-top: var(--sys-size-6);\n}\n\n#footer {\n  margin-top: var(--sys-size-6);\n  margin-bottom: var(--sys-size-2);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  grid-column-start: span 2;\n}\n\ndevtools-link {\n  color: var(--sys-color-primary);\n  text-decoration-line: underline;\n}\n", { urlString: cu } = Rn, lu = {
	infobarPreloadingIsDisabled: "Speculative loading is disabled",
	infobarPreloadingIsForceEnabled: "Speculative loading is force-enabled",
	titleReasonsPreventingPreloading: "Reasons preventing speculative loading",
	headerDisabledByPreference: "User settings or extensions",
	descriptionDisabledByPreference: "Speculative loading is disabled because of user settings or an extension. Go to {PH1} to update your preference. Go to {PH2} to disable any extension that blocks speculative loading.",
	preloadingPagesSettings: "Preload pages settings",
	extensionsSettings: "Extensions settings",
	headerDisabledByDataSaver: "Data Saver",
	descriptionDisabledByDataSaver: "Speculative loading is disabled because of the operating system's Data Saver mode.",
	headerDisabledByBatterySaver: "Battery Saver",
	descriptionDisabledByBatterySaver: "Speculative loading is disabled because of the operating system's Battery Saver mode.",
	headerDisabledByHoldbackPrefetchSpeculationRules: "Prefetch was disabled, but is force-enabled now",
	descriptionDisabledByHoldbackPrefetchSpeculationRules: "Prefetch is forced-enabled because DevTools is open. When DevTools is closed, prefetch will be disabled because this browser session is part of a holdback group used for performance comparisons.",
	headerDisabledByHoldbackPrerenderSpeculationRules: "Prerendering was disabled, but is force-enabled now",
	descriptionDisabledByHoldbackPrerenderSpeculationRules: "Prerendering is forced-enabled because DevTools is open. When DevTools is closed, prerendering will be disabled because this browser session is part of a holdback group used for performance comparisons.",
	footerLearnMore: "Learn more"
}, uu = s("panels/application/preloading/components/PreloadingDisabledInfobar.ts", lu), du = a.bind(void 0, uu), fu = "https://developer.chrome.com/blog/prerender-pages/", pu = (e, t, n) => {
	let r = b;
	e.header !== null && (r = y`
        <style>${su}</style>
        <div id="container">
          <span id="header">${e.header}</span>
          <devtools-button-dialog .data=${{
		iconName: "info",
		variant: h.ICON,
		closeButton: !0,
		position: ni.AUTO,
		horizontalAlignment: ti.AUTO,
		closeOnESC: !0,
		closeOnScroll: !1,
		dialogTitle: du(lu.titleReasonsPreventingPreloading)
	}}
                                  jslog=${Jt("preloading-disabled").track({
		resize: !0,
		keydown: "Escape"
	})}>
            <div id="contents">
              <devtools-report>
                ${e.warnings.map(({ key: e, valueId: t, placeholders: n = {} }) => {
		let r = Ce(uu, t, Object.fromEntries(Object.entries(n).map(([e, { title: t, href: n }]) => [e, y`<devtools-link href=${n}>${t}</devtools-link>`])));
		return y`
                      <div class="key">${e}</div>
                      <div class="value">${r}</div>
                    `;
	})}
              </devtools-report>
              <div id="footer">
                <devtools-link href=${fu} jslogcontext="learn-more">
                  ${du(lu.footerLearnMore)}
                </devtools-link>
              </div>
            </div>
          </devtools-button-dialog>
        </div>`), _(r, n);
}, mu = class extends S {
	#e;
	#t = !1;
	#n = !1;
	#r = !1;
	#i = !1;
	#a = !1;
	constructor(e = pu) {
		super({ useShadowDom: !0 }), this.#e = e;
	}
	get disabledByPreference() {
		return this.#t;
	}
	set disabledByPreference(e) {
		this.#t !== e && (this.#t = e, this.requestUpdate());
	}
	get disabledByDataSaver() {
		return this.#n;
	}
	set disabledByDataSaver(e) {
		this.#n !== e && (this.#n = e, this.requestUpdate());
	}
	get disabledByBatterySaver() {
		return this.#r;
	}
	set disabledByBatterySaver(e) {
		this.#r !== e && (this.#r = e, this.requestUpdate());
	}
	get disabledByHoldbackPrefetchSpeculationRules() {
		return this.#i;
	}
	set disabledByHoldbackPrefetchSpeculationRules(e) {
		this.#i !== e && (this.#i = e, this.requestUpdate());
	}
	get disabledByHoldbackPrerenderSpeculationRules() {
		return this.#a;
	}
	set disabledByHoldbackPrerenderSpeculationRules(e) {
		this.#a !== e && (this.#a = e, this.requestUpdate());
	}
	wasShown() {
		super.wasShown(), this.requestUpdate();
	}
	performUpdate() {
		let e = null;
		this.#t || this.#n || this.#r ? e = du(lu.infobarPreloadingIsDisabled) : (this.#i || this.#a) && (e = du(lu.infobarPreloadingIsForceEnabled));
		let t = [];
		this.#t && t.push({
			key: du(lu.headerDisabledByPreference),
			valueId: lu.descriptionDisabledByPreference,
			placeholders: {
				PH1: {
					title: du(lu.preloadingPagesSettings),
					href: cu`chrome://settings/performance`
				},
				PH2: {
					title: du(lu.extensionsSettings),
					href: cu`chrome://extensions`
				}
			}
		}), this.#n && t.push({
			key: du(lu.headerDisabledByDataSaver),
			valueId: lu.descriptionDisabledByDataSaver
		}), this.#r && t.push({
			key: du(lu.headerDisabledByBatterySaver),
			valueId: lu.descriptionDisabledByBatterySaver
		}), this.#i && t.push({
			key: du(lu.headerDisabledByHoldbackPrefetchSpeculationRules),
			valueId: lu.descriptionDisabledByHoldbackPrefetchSpeculationRules
		}), this.#a && t.push({
			key: du(lu.headerDisabledByHoldbackPrerenderSpeculationRules),
			valueId: lu.descriptionDisabledByHoldbackPrerenderSpeculationRules
		});
		let n = {
			header: e,
			warnings: t
		};
		this.#e(n, void 0, this.contentElement);
	}
}, hu = "/*\n * Copyright 2022 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n@scope to (devtools-widget > *){\n  .preloading-container {\n    overflow: auto;\n    height: 100%;\n    display: flex;\n    flex-direction: column;\n\n    devtools-data-grid {\n      flex: auto;\n    }\n\n    .inline-icon {\n      vertical-align: text-bottom;\n    }\n  }\n\n  .preloading-header {\n    font-size: 15px;\n    background-color: var(--sys-color-cdt-base-container);\n    padding: 1px 4px;\n  }\n\n  .preloading-placeholder {\n    flex-grow: 1;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-size: 13px;\n    color: var(--sys-color-token-subtle);\n  }\n}\n", { PreloadingStatus: gu } = Lt, _u = {
	action: "Action",
	ruleSet: "Rule set",
	status: "Status",
	prefetchFallbackReady: "Prefetch fallback ready"
}, vu = s("panels/application/preloading/components/PreloadingGrid.ts", _u), yu = a.bind(void 0, vu), { render: bu, html: xu, nothing: Su, Directives: { styleMap: Cu } } = Ie;
function wu(e, t) {
	let n = e.pipeline.getOriginallyTriggered().key.url;
	return t && n.startsWith(t) ? n.slice(t.length) : n;
}
var Tu = (e, t, n) => {
	if (!e.rows || !e.pageURL) {
		bu(Su, n);
		return;
	}
	let { rows: r, pageURL: i } = e, a = i === "" ? null : new re(i).securityOrigin();
	bu(xu`
    <style>${hu}</style>
    <div class="preloading-container">
      <devtools-data-grid striped>
        <table>
          <tr>
            <th id="url" weight="40" sortable>${d("URL")}</th>
            <th id="action" weight="15" sortable>${yu(_u.action)}</th>
            <th id="rule-set" weight="20" sortable>${yu(_u.ruleSet)}</th>
            <th id="status" weight="40" sortable>${yu(_u.status)}</th>
          </tr>
          ${r.map((t) => {
		let n = t.pipeline.getOriginallyTriggered(), r = t.pipeline.getPrefetch()?.status, o = t.pipeline.getPrerender()?.status === gu.FAILURE && (r === gu.READY || r === gu.SUCCESS), s = t.pipeline.getOriginallyTriggered().status === gu.FAILURE;
		return xu`<tr @select=${() => e.onSelect?.({ rowId: t.id })}>
              <td title=${n.key.url}>${wu(t, a)}</td>
              <td>${Bl(n.action)}</td>
              <td>${t.ruleSets.length === 0 ? "" : zl(t.ruleSets[0], i)}</td>
              <td data-value=${Vl(n)}>
                <div style=${Cu({ color: o ? "var(--sys-color-orange-bright)" : s ? "var(--sys-color-error)" : "var(--sys-color-on-surface)" })}>
                  ${s || o ? xu`
                    <devtools-icon
                      name=${o ? "warning-filled" : "cross-circle-filled"}
                      class='medium'
                      style=${Cu({ "vertical-align": "sub" })}
                    ></devtools-icon>` : ""}
                  ${o ? yu(_u.prefetchFallbackReady) : Ul(n, t.statusCode)}
                </div>
              </td>
            </tr>`;
	})}
        </table>
      </devtools-data-grid>
    </div>
  `, n);
}, Eu = class extends S {
	#e;
	#t;
	#n;
	#r;
	constructor(e) {
		super(), this.#e = e ?? Tu, this.requestUpdate();
	}
	set rows(e) {
		this.#t = e, this.requestUpdate();
	}
	set pageURL(e) {
		this.#n = e, this.requestUpdate();
	}
	set onSelect(e) {
		this.#r = e, this.requestUpdate();
	}
	performUpdate() {
		let e = {
			rows: this.#t,
			pageURL: this.#n,
			onSelect: this.#r?.bind(this)
		};
		this.#e(e, void 0, this.contentElement);
	}
}, Du = "/*\n * Copyright 2023 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  height: 100%;\n}\n\n.placeholder {\n  display: flex;\n  height: 100%;\n}\n\n.ruleset-header-container {\n  flex-shrink: 0;\n}\n\n.ruleset-header {\n  padding: 4px 8px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  border-bottom: 1px solid var(--sys-color-divider);\n}\n\n.ruleset-header devtools-icon {\n  vertical-align: sub;\n}\n\n.text-editor-container {\n  overflow: auto;\n}\n", Ou = {
	noElementSelected: "No element selected",
	selectAnElementForMoreDetails: "Select an element for more details"
}, ku = s("panels/application/preloading/components/RuleSetDetailsView.ts", Ou), Au = a.bind(void 0, ku), ju = await Tr("application/json"), Mu = (e, t, n) => {
	_(y`
    <style>${Du}</style>
    <style>${Ee}</style>
    ${e ? y`
        <div class="ruleset-header-container">
          <div class="ruleset-header" id="ruleset-url">${e.url}</div>
          ${e.errorMessage ? y`
            <div class="ruleset-header">
              <devtools-icon name="cross-circle" class="medium">
              </devtools-icon>
              <span id="error-message-text">${e.errorMessage}</span>
            </div>
          ` : b}
        </div>
        <div class="text-editor-container">
          <devtools-text-editor .state=${e.editorState}></devtools-text-editor>
        </div>` : y`
          <div class="placeholder">
            <div class="empty-state">
              <span class="empty-state-header">${Au(Ou.noElementSelected)}</span>
              <span class="empty-state-description">${Au(Ou.selectAnElementForMoreDetails)}</span>
            </div>
          </div>`}
    `, n);
}, Nu = class extends S {
	#e;
	#t = null;
	#n = !0;
	constructor(e, t = Mu) {
		super(e, { useShadowDom: !0 }), this.#e = t;
	}
	wasShown() {
		super.wasShown(), this.requestUpdate();
	}
	set ruleSet(e) {
		this.#t = e, this.requestUpdate();
	}
	set shouldPrettyPrint(e) {
		this.#n = e, this.requestUpdate();
	}
	async performUpdate() {
		if (!this.#t) {
			this.#e(null, {}, this.contentElement);
			return;
		}
		let e = await this.#r(), t = pr.create({
			doc: e,
			extensions: [
				Cr(e),
				mr(),
				pr.readOnly.of(!0),
				ju,
				hr(Er)
			]
		});
		this.#e({
			url: this.#t.url || C.instance().inspectedURL(),
			errorMessage: this.#t.errorMessage,
			editorState: t,
			sourceText: e
		}, {}, this.contentElement);
	}
	async #r() {
		return this.#n && this.#t?.sourceText !== void 0 ? (await In("application/json", this.#t.sourceText)).formattedContent : this.#t?.sourceText || "";
	}
}, Pu = "/*\n * Copyright 2023 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  overflow: auto;\n  height: 100%;\n}\n\n.ruleset-container {\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n}\n\ndevtools-data-grid {\n  flex: auto;\n}\n\n.inline-icon {\n  vertical-align: text-bottom;\n}\n", { styleMap: Fu } = et, Iu = {
	ruleSet: "Rule set",
	status: "Status",
	clickToOpenInElementsPanel: "Click to open in Elements panel",
	clickToOpenInNetworkPanel: "Click to open in Network panel",
	errors: "{errorCount, plural, =1 {# error} other {# errors}}",
	buttonRevealPreloadsAssociatedWithRuleSet: "Reveal speculative loads associated with this rule set"
}, Lu = s("panels/application/preloading/components/RuleSetGrid.ts", Iu), Ru = a.bind(void 0, Lu), zu = (e, t, n) => {
	let r = b;
	if (e.data !== null) {
		let { rows: t, pageURL: n } = e.data;
		r = y`
          <style>${Pu}</style>
          <div class="ruleset-container" jslog=${D("preloading-rules")}>
            <devtools-data-grid striped>
              <table>
                <tr>
                  <th id="rule-set" weight="20" sortable>
                    ${Ru(Iu.ruleSet)}
                  </th>
                  <th id="status" weight="80" sortable>
                    ${Ru(Iu.status)}
                  </th>
                </tr>
                ${t.map(({ ruleSet: t, preloadsStatusSummary: r }) => {
			let i = zl(t, n), a = t.backendNodeId !== void 0, o = t.url !== void 0 && t.requestId;
			return y`
                    <tr @select=${() => e.onSelect(t.id)}>
                      <td>
                        ${a || o ? y`
                          <button class="link" role="link"
                              @click=${() => {
				a ? e.onRevealInElements(t) : e.onRevealInNetwork(t);
			}}
                              title=${Ru(a ? Iu.clickToOpenInElementsPanel : Iu.clickToOpenInNetworkPanel)}
                              style=${Fu({
				border: "none",
				background: "none",
				color: "var(--icon-link)",
				cursor: "pointer",
				"text-decoration": "underline",
				"padding-inline-start": "0",
				"padding-inline-end": "0"
			})}
                              jslog=${Bt(a ? "reveal-in-elements" : "reveal-in-network").track({ click: !0 })}
                            >
                              <devtools-icon name=${a ? "code-circle" : "arrow-up-down-circle"} class="medium"
                                style=${Fu({
				color: "var(--icon-link)",
				"vertical-align": "sub"
			})}
                              ></devtools-icon>
                              ${i}
                            </button>` : i}
                    </td>
                    <td>
                      ${t.errorType === void 0 ? "" : y`
                        <span style=${Fu({ color: "var(--sys-color-error)" })}>
                          ${Ru(Iu.errors, { errorCount: 1 })}
                        </span>`} ${t.errorType !== O.RuleSetErrorType.SourceIsNotJsonObject && t.errorType !== O.RuleSetErrorType.InvalidRulesetLevelTag ? y`
                        <button class="link" role="link"
                          @click=${() => e.onRevealPreloadsAssociatedWithRuleSet(t)}
                          title=${Ru(Iu.buttonRevealPreloadsAssociatedWithRuleSet)}
                          style=${Fu({
				color: "var(--sys-color-primary)",
				"text-decoration": "underline",
				cursor: "pointer",
				border: "none",
				background: "none",
				"padding-inline-start": "0",
				"padding-inline-end": "0"
			})}
                          jslog=${Bt("reveal-preloads").track({ click: !0 })}>
                          ${r}
                        </button>` : ""}
                    </td>
                  </tr>
                `;
		})}
              </table>
            </devtools-data-grid>
          </div>`;
	}
	_(r, n);
}, Bu = class extends t(S) {
	#e;
	#t = null;
	constructor(e = zu) {
		super({ useShadowDom: !0 }), this.#e = e;
	}
	get data() {
		return this.#t;
	}
	set data(e) {
		this.#t = e, this.requestUpdate();
	}
	performUpdate() {
		let e = {
			data: this.#t,
			onSelect: this.dispatchEventToListeners.bind(this, "select"),
			onRevealInElements: this.#n.bind(this),
			onRevealInNetwork: this.#r.bind(this),
			onRevealPreloadsAssociatedWithRuleSet: this.#i.bind(this)
		};
		this.#e(e, void 0, this.contentElement);
	}
	#n(e) {
		Qn(e.backendNodeId);
		let t = C.instance().scopeTarget();
		t !== null && r(new mt(t, e.backendNodeId));
	}
	#r(e) {
		Qn(e.requestId);
		let t = C.instance().scopeTarget()?.model(Vt)?.requestForId(e.requestId) || null;
		if (t === null) return;
		let n = Mr.tab(t, Nr.PREVIEW, { clearFilter: !1 });
		r(n);
	}
	#i(e) {
		r(new Zr(e.id));
	}
}, Vu = /* @__PURE__ */ function(e) {
	return e.SELECT = "select", e;
}({}), Hu = "/*\n * Copyright 2023 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  overflow: auto;\n  height: 100%;\n}\n\nbutton {\n  font-size: inherit;\n}\n\ndevtools-report {\n  padding: 1em 0;\n}\n\ndevtools-report-section-header {\n  padding-bottom: 0;\n  margin-bottom: -1.5em;\n}\n\ndevtools-report-section {\n  min-width: fit-content;\n}\n\ndevtools-report-divider {\n  margin: 1em 0;\n}\n\n.reveal-links {\n  white-space: nowrap;\n}\n\n.link {\n  border: none;\n  background: none;\n  color: var(--sys-color-primary);\n  text-decoration: underline;\n  cursor: pointer;\n  outline-offset: 2px;\n  padding: 0;\n}\n\n.status-badge-container {\n  white-space: nowrap;\n  margin: 8px 0 24px;\n}\n\n.status-badge-container span {\n  margin-right: 2px;\n}\n\n.status-badge {\n  border-radius: 4px;\n  padding: 4px;\n\n  devtools-icon {\n    width: 16px;\n    height: 16px;\n  }\n}\n\n.status-badge-success {\n  background: var(--sys-color-surface-green);\n}\n\n.status-badge-failure {\n  background: var(--sys-color-error-container);\n}\n\n.status-badge-neutral {\n  background: var(--sys-color-neutral-container);\n}\n", U = {
	speculativeLoadingStatusForThisPage: "Speculative loading status for this page",
	detailsFailureReason: "Failure reason",
	downgradedPrefetchUsed: "The initiating page attempted to prerender this page's URL. The prerender failed, but the resulting response body was still used as a prefetch.",
	prefetchUsed: "This page was successfully prefetched.",
	prerenderUsed: "This page was successfully prerendered.",
	prefetchFailed: "The initiating page attempted to prefetch this page's URL, but the prefetch failed, so a full navigation was performed instead.",
	prerenderFailed: "The initiating page attempted to prerender this page's URL, but the prerender failed, so a full navigation was performed instead.",
	noPreloads: "The initiating page did not attempt to speculatively load this page's URL.",
	currentURL: "Current URL",
	preloadedURLs: "URLs being speculatively loaded by the initiating page",
	speculationsInitiatedByThisPage: "Speculations initiated by this page",
	viewAllRules: "View all speculation rules",
	viewAllSpeculations: "View all speculations",
	learnMore: "Learn more: Speculative loading on developer.chrome.com",
	mismatchedHeadersDetail: "Mismatched HTTP request headers",
	badgeSuccess: "Success",
	badgeFailure: "Failure",
	badgeNoSpeculativeLoads: "No speculative loads",
	badgeNotTriggeredWithCount: "{n, plural, =1 {# not triggered} other {# not triggered}}",
	badgeInProgressWithCount: "{n, plural, =1 {# in progress} other {# in progress}}",
	badgeSuccessWithCount: "{n, plural, =1 {# success} other {# success}}",
	badgeFailureWithCount: "{n, plural, =1 {# failure} other {# failures}}",
	headerName: "Header name",
	initialNavigationValue: "Value in initial navigation",
	activationNavigationValue: "Value in activation navigation",
	missing: "(missing)"
}, Uu = s("panels/application/preloading/components/UsedPreloadingView.ts", U), Wu = a.bind(void 0, Uu), { widget: Gu } = Wt;
function Ku({ kind: e, prefetch: t, prerenderLike: n, mismatchedData: r, attemptWithMismatchedHeaders: i }) {
	let a, o;
	switch (e) {
		case "DowngradedPrerenderToPrefetchAndUsed":
			a = { type: "success" }, o = y`${Wu(U.downgradedPrefetchUsed)}`;
			break;
		case "PrefetchUsed":
			a = { type: "success" }, o = y`${Wu(U.prefetchUsed)}`;
			break;
		case "PrerenderUsed":
			a = { type: "success" }, o = y`${Wu(U.prerenderUsed)}`;
			break;
		case "PrefetchFailed":
			a = { type: "failure" }, o = y`${Wu(U.prefetchFailed)}`;
			break;
		case "PrerenderFailed":
			a = { type: "failure" }, o = y`${Wu(U.prerenderFailed)}`;
			break;
		case "NoPreloads": a = {
			type: "neutral",
			message: Wu(U.badgeNoSpeculativeLoads)
		}, o = y`${Wu(U.noPreloads)}`;
	}
	let s;
	return e === "PrefetchFailed" ? (Qn(t), s = Il(t)) : (e === "PrerenderFailed" || e === "DowngradedPrerenderToPrefetchAndUsed") && (Qn(n), s = Ll(n)), y`
    <devtools-report-section-header>
      ${Wu(U.speculativeLoadingStatusForThisPage)}
    </devtools-report-section-header>
    <devtools-report-section>
      <div>
        <div class="status-badge-container">
          ${Xu(a)}
        </div>
        <div>
          ${o}
        </div>
      </div>
    </devtools-report-section>

    ${s === void 0 ? b : y`
      <devtools-report-section-header>
        ${Wu(U.detailsFailureReason)}
      </devtools-report-section-header>
      <devtools-report-section>
        ${s}
      </devtools-report-section>`}

    ${r ? qu(r) : b}
    ${i ? Ju(i) : b}`;
}
function qu(e) {
	return y`
    <devtools-report-section-header>
      ${Wu(U.currentURL)}
    </devtools-report-section-header>
    <devtools-report-section>
      <devtools-link
        class="link devtools-link"
        href=${e.pageURL}
        jslogcontext="current-url"
      >${e.pageURL}</devtools-link>
    </devtools-report-section>

    <devtools-report-section-header>
      ${Wu(U.preloadedURLs)}
    </devtools-report-section-header>
    <devtools-report-section jslog=${T("preloaded-urls")}>
      ${Gu($l, { data: e })}
    </devtools-report-section>`;
}
function Ju(e) {
	return y`
    <devtools-report-section-header>
      ${Wu(U.mismatchedHeadersDetail)}
    </devtools-report-section-header>
    <devtools-report-section>
      <style>${hu}</style>
      <div class="preloading-container">
        <devtools-data-grid striped inline>
          <table>
            <tr>
              <th id="header-name" weight="30" sortable>
                ${Wu(U.headerName)}
              </th>
              <th id="initial-value" weight="30" sortable>
                ${Wu(U.initialNavigationValue)}
              </th>
              <th id="activation-value" weight="30" sortable>
                ${Wu(U.activationNavigationValue)}
              </th>
            </tr>
            ${(e.mismatchedHeaders ?? []).map((e) => y`
              <tr>
                <td>${e.headerName}</td>
                <td>${e.initialValue ?? Wu(U.missing)}</td>
                <td>${e.activationValue ?? Wu(U.missing)}</td>
              </tr>
            `)}
          </table>
        </devtools-data-grid>
      </div>
    </devtools-report-section>`;
}
function Yu({ badges: e, revealRuleSetView: t, revealAttemptViewWithFilter: n }) {
	return y`
    <devtools-report-section-header>
      ${Wu(U.speculationsInitiatedByThisPage)}
    </devtools-report-section-header>
    <devtools-report-section>
      <div>
        <div class="status-badge-container">
          ${e.map(Xu)}
        </div>

        <div class="reveal-links">
          <button class="link devtools-link" @click=${t}
              jslog=${Bt("view-all-rules").track({ click: !0 })}>
            ${Wu(U.viewAllRules)}
          </button>
         ・
          <button class="link devtools-link" @click=${n}
              jslog=${Bt("view-all-speculations").track({ click: !0 })}>
           ${Wu(U.viewAllSpeculations)}
          </button>
        </div>
      </div>
    </devtools-report-section>`;
}
function Xu(e) {
	let t = (e, t, n) => y`
      <span class=${e}>
        <devtools-icon name=${t}></devtools-icon>
        <span>
          ${n}
        </span>
      </span>
    `;
	switch (e.type) {
		case "success": {
			let n;
			return n = e.count === void 0 ? Wu(U.badgeSuccess) : Wu(U.badgeSuccessWithCount, { n: e.count }), t("status-badge status-badge-success", "check-circle", n);
		}
		case "failure": {
			let n;
			return n = e.count === void 0 ? Wu(U.badgeFailure) : Wu(U.badgeFailureWithCount, { n: e.count }), t("status-badge status-badge-failure", "cross-circle", n);
		}
		case "neutral": return t("status-badge status-badge-neutral", "clear", e.message);
	}
}
var Zu = (e, t, n) => {
	_(y`
    <style>${Hu}</style>
    <devtools-report>
      ${Ku(e.speculativeLoadingStatusData)}

      <devtools-report-divider></devtools-report-divider>

      ${Yu(e.speculationsInitiatedSummaryData)}

      <devtools-report-divider></devtools-report-divider>

      <devtools-report-section>
        <devtools-link
          class="link devtools-link"
          href=${"https://developer.chrome.com/blog/prerender-pages/"}
          jslogcontext="learn-more"
        >${Wu(U.learnMore)}</devtools-link>
      </devtools-report-section>
    </devtools-report>`, n);
}, Qu = class extends S {
	#e;
	constructor(e = Zu) {
		super({ useShadowDom: !0 }), this.#e = e;
	}
	#t = {
		pageURL: "",
		previousAttempts: [],
		currentAttempts: []
	};
	set data(e) {
		this.#t = e, this.requestUpdate();
	}
	performUpdate() {
		let e = {
			speculativeLoadingStatusData: this.#i(),
			speculationsInitiatedSummaryData: this.#s()
		};
		this.#e(e, void 0, this.contentElement);
	}
	#n(e) {
		return [O.SpeculationAction.Prerender, O.SpeculationAction.PrerenderUntilScript].includes(e);
	}
	#r(e) {
		return this.#n(e.action);
	}
	#i() {
		let e = re.urlWithoutHash(this.#t.pageURL), t = this.#t.previousAttempts.filter((t) => re.urlWithoutHash(t.key.url) === e), n = t.filter((e) => e.key.action === O.SpeculationAction.Prefetch)[0], r = t.filter((e) => this.#n(e.action))[0], i = "NoPreloads";
		return i = r?.status === E.FAILURE && n?.status === E.SUCCESS ? "DowngradedPrerenderToPrefetchAndUsed" : r?.status === E.SUCCESS ? "PrerenderUsed" : n?.status === E.SUCCESS ? "PrefetchUsed" : r?.status === E.FAILURE ? "PrerenderFailed" : n?.status === E.FAILURE ? "PrefetchFailed" : "NoPreloads", {
			kind: i,
			prefetch: n,
			prerenderLike: r,
			mismatchedData: this.#a(i),
			attemptWithMismatchedHeaders: this.#o()
		};
	}
	#a(e) {
		if (e !== "NoPreloads" || this.#t.previousAttempts.length === 0) return;
		let t = this.#t.previousAttempts.map((e) => ({
			url: e.key.url,
			action: e.key.action,
			status: e.status
		}));
		return {
			pageURL: this.#t.pageURL,
			rows: t
		};
	}
	#o() {
		let e = this.#t.previousAttempts.find((e) => this.#r(e) && e.mismatchedHeaders !== null);
		if (e?.mismatchedHeaders) {
			if (e.key.url !== this.#t.pageURL) throw Error("unreachable");
			return e;
		}
	}
	#s() {
		let e = this.#t.currentAttempts.reduce((e, t) => (e.set(t.status, (e.get(t.status) ?? 0) + 1), e), /* @__PURE__ */ new Map()), t = e.get(E.NOT_TRIGGERED) ?? 0, n = e.get(E.READY) ?? 0, i = e.get(E.FAILURE) ?? 0, a = (e.get(E.PENDING) ?? 0) + (e.get(E.RUNNING) ?? 0), o = [];
		return this.#t.currentAttempts.length === 0 && o.push({
			type: "neutral",
			message: Wu(U.badgeNoSpeculativeLoads)
		}), t > 0 && o.push({
			type: "neutral",
			message: Wu(U.badgeNotTriggeredWithCount, { n: t })
		}), a > 0 && o.push({
			type: "neutral",
			message: Wu(U.badgeInProgressWithCount, { n: a })
		}), n > 0 && o.push({
			type: "success",
			count: n
		}), i > 0 && o.push({
			type: "failure",
			count: i
		}), {
			badges: o,
			revealRuleSetView: () => {
				r(new Yr(null));
			},
			revealAttemptViewWithFilter: () => {
				r(new Zr(null));
			}
		};
	}
}, $u = "/*\n * Copyright 2022 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.empty-state {\n  display: none;\n}\n\n.empty {\n  .empty-state {\n    display: flex;\n  }\n\n  devtools-split-view, .pretty-print-button, devtools-toolbar {\n    display: none;\n  }\n}\n\n.preloading-toolbar {\n  background-color: var(--sys-color-cdt-base-container);\n  border-bottom: 1px solid var(--sys-color-divider);\n\n  button.toolbar-has-dropdown {\n    margin: var(--sys-size-2) 0;\n  }\n\n  .toolbar-filter {\n    max-width: var(--sys-size-29);\n  }\n}\n\ndevtools-split-view {\n  .preloading-grid-widget-container > .vbox {\n    height: 100%;\n  }\n}\n", ed = "/*\n * Copyright 2024 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  padding: 2px 1px 2px 2px;\n}\n\n.title {\n  padding-left: 8px;\n}\n\n.subtitle {\n  padding-left: 8px;\n}\n", td = /* @__PURE__ */ e({
	PreloadingAttemptView: () => md,
	PreloadingRuleSetView: () => fd,
	PreloadingSummaryView: () => hd,
	applyFilterText: () => pd
}), { createRef: nd, ref: rd } = et, { widget: id } = Wt, ad = {
	filterFilterByRuleSet: "Filter by rule set",
	filterAllPreloads: "All speculative loads",
	noRuleSets: "no rule sets",
	validityValid: "Valid",
	validityInvalid: "Invalid",
	validitySomeRulesInvalid: "Some rules invalid",
	statusNotTriggered: "Not triggered",
	statusPending: "Pending",
	statusRunning: "Running",
	statusReady: "Ready",
	statusSuccess: "Success",
	statusFailure: "Failure",
	prettyPrint: "Pretty print",
	noRulesDetected: "No rules detected",
	rulesDescription: "On this page you will see the speculation rules used to prefetch and prerender page navigations.",
	noPrefetchAttempts: "No speculation detected",
	prefetchDescription: "On this page you will see details on speculative loads.",
	learnMore: "Learn more"
}, od = s("panels/application/preloading/PreloadingView.ts", ad), sd = a.bind(void 0, od), cd = "https://developer.chrome.com/docs/devtools/application/debugging-speculation-rules", ld = Symbol("AllRuleSetRootId"), ud = class {
	static status(e) {
		switch (e) {
			case E.NOT_TRIGGERED: return sd(ad.statusNotTriggered);
			case E.PENDING: return sd(ad.statusPending);
			case E.RUNNING: return sd(ad.statusRunning);
			case E.READY: return sd(ad.statusReady);
			case E.SUCCESS: return sd(ad.statusSuccess);
			case E.FAILURE: return sd(ad.statusFailure);
			case E.NOT_SUPPORTED: return d("Internal error");
		}
	}
	static preloadsStatusSummary(e) {
		return [
			E.NOT_TRIGGERED,
			E.PENDING,
			E.RUNNING,
			E.READY,
			E.SUCCESS,
			E.FAILURE
		].filter((t) => (e?.get(t) || 0) > 0).map((t) => (e?.get(t) || 0) + " " + this.status(t)).join(", ").toLocaleLowerCase();
	}
	static validity({ errorType: e }) {
		switch (e) {
			case void 0: return sd(ad.validityValid);
			case O.RuleSetErrorType.SourceIsNotJsonObject:
			case O.RuleSetErrorType.InvalidRulesetLevelTag: return sd(ad.validityInvalid);
			case O.RuleSetErrorType.InvalidRulesSkipped: return sd(ad.validitySomeRulesInvalid);
		}
	}
	static location(e) {
		if (e.backendNodeId !== void 0) return d("<script>");
		if (e.url !== void 0) return e.url;
		throw Error("unreachable");
	}
	static processLocalId(e) {
		let t = e.indexOf(".");
		return t === -1 ? e : e.slice(t + 1);
	}
};
function dd() {
	return C.instance().scopeTarget()?.inspectedURL() || "";
}
var fd = class extends S {
	model;
	focusedRuleSetId = null;
	warningsContainer;
	warningsView = new mu();
	hsplit;
	ruleSetGrid = new Bu();
	ruleSetGridContainerRef = nd();
	ruleSetDetailsRef;
	shouldPrettyPrint = m.instance().moduleSetting("auto-pretty-print-minified").get();
	constructor(e) {
		super({ useShadowDom: !0 }), this.registerRequiredCSS(Nn, $u), this.model = e, C.instance().addScopeChangeListener(this.onScopeChange.bind(this)), C.instance().addModelListener(kt, wn.MODEL_UPDATED, this.render, this, { scoped: !0 }), C.instance().addModelListener(kt, wn.WARNINGS_UPDATED, (e) => {
			Object.assign(this.warningsView, e.data);
		}, this, { scoped: !0 }), this.warningsContainer = document.createElement("div"), this.warningsContainer.classList.add("flex-none"), this.contentElement.insertBefore(this.warningsContainer, this.contentElement.firstChild), this.warningsView.show(this.warningsContainer), this.ruleSetGrid.addEventListener(Vu.SELECT, this.onRuleSetsGridCellFocused, this), this.ruleSetDetailsRef = nd(), _(y`
        <div class="empty-state">
          <span class="empty-state-header">${sd(ad.noRulesDetected)}</span>
          <div class="empty-state-description">
            <span>${sd(ad.rulesDescription)}</span>
            <devtools-link
              class="devtools-link"
              href=${cd}
              jslogcontext="learn-more"
            >${sd(ad.learnMore)}</devtools-link>
          </div>
        </div>
        <devtools-split-view sidebar-position="second">
          <div slot="main" ${rd(this.ruleSetGridContainerRef)}>
          </div>
          <div slot="sidebar" jslog=${T("rule-set-details")}>
            <devtools-widget ${id(Nu, {
			ruleSet: this.getRuleSet(),
			shouldPrettyPrint: this.shouldPrettyPrint
		})} ${rd(this.ruleSetDetailsRef)}></devtools-widget>
          </div>
        </devtools-split-view>
        <div class="pretty-print-button" style="border-top: 1px solid var(--sys-color-divider)">
        <devtools-button
          .iconName=${"brackets"}
          .toggledIconName=${"brackets"}
          .toggled=${this.shouldPrettyPrint}
          .toggleType=${He.PRIMARY}
          .title=${sd(ad.prettyPrint)}
          .variant=${h.ICON_TOGGLE}
          .size=${ft.REGULAR}
          @click=${() => {
			this.shouldPrettyPrint = !this.shouldPrettyPrint, this.updateRuleSetDetails();
		}}
          jslog=${Bt().track({ click: !0 }).context("preloading-status-panel-pretty-print")}></devtools-button>
        </div>`, this.contentElement, { host: this }), this.hsplit = this.contentElement.querySelector("devtools-split-view");
	}
	wasShown() {
		super.wasShown(), this.warningsView.wasShown(), this.render();
	}
	onScopeChange() {
		let e = C.instance().scopeTarget()?.model(kt);
		Qn(e), this.model = e, this.render();
	}
	revealRuleSet(e) {
		this.focusedRuleSetId = e.ruleSetId, this.render();
	}
	updateRuleSetDetails() {
		let e = this.getRuleSet(), t = this.ruleSetDetailsRef.value?.getWidget();
		t && (t.shouldPrettyPrint = this.shouldPrettyPrint, t.ruleSet = e), e === null ? this.hsplit.setAttribute("sidebar-visibility", "hidden") : this.hsplit.removeAttribute("sidebar-visibility");
	}
	getRuleSet() {
		let e = this.focusedRuleSetId;
		return e === null ? null : this.model.getRuleSetById(e);
	}
	render() {
		let e = this.model.getPreloadCountsByRuleSetId(), t = this.model.getAllRuleSets().map(({ id: t, value: n }) => {
			let r = e.get(t) || /* @__PURE__ */ new Map();
			return {
				ruleSet: n,
				preloadsStatusSummary: ud.preloadsStatusSummary(r)
			};
		});
		this.ruleSetGrid.data = {
			rows: t,
			pageURL: dd()
		}, this.contentElement.classList.toggle("empty", t.length === 0), this.updateRuleSetDetails();
		let n = this.ruleSetGridContainerRef.value;
		n && this.ruleSetGrid.element.parentElement !== n && this.ruleSetGrid.show(n);
	}
	onRuleSetsGridCellFocused(e) {
		this.focusedRuleSetId = e.data, this.render();
	}
	getInfobarContainerForTest() {
		return this.warningsView.contentElement;
	}
	getRuleSetGridForTest() {
		return this.ruleSetGrid;
	}
};
function pd(e, t) {
	if (e.trim() === "") return t;
	let n = [
		"url",
		"action",
		"status"
	], r = new Hn([...n]).parse(e.toLowerCase()), i = r.at(-1);
	return !i || ((i.key === void 0 || i.key === null) && n.some((e) => i.text === `${e}:`) && r.pop(), r.length === 0) ? t : t.filter((e) => {
		let t = e.pipeline.getOriginallyTriggered(), n = t.key.url.toLowerCase(), i = Bl(t.action).toLowerCase(), a = ud.status(t.status).toLowerCase();
		return r.every((e) => {
			if (e.text === void 0 || e.text === null || e.text === "") return !0;
			let t = e.text.toLowerCase();
			switch (e.key) {
				case "url": return n.includes(t);
				case "action": return i.includes(t);
				case "status": return t.split(",").some((e) => a.includes(e));
				case void 0: return n.includes(t) || i.includes(t) || a.includes(t);
				default: return !1;
			}
		});
	});
}
var md = class extends S {
	model;
	focusedPreloadingAttemptId = null;
	warningsContainer;
	warningsView = new mu();
	preloadingGrid = new Eu();
	preloadingDetails = new ou();
	ruleSetSelector;
	textFilterUI;
	hsplit;
	clearButton;
	constructor(e) {
		super({
			jslog: `${D("preloading-speculations")}`,
			useShadowDom: !0
		}), this.registerRequiredCSS(Nn, $u), this.model = e, C.instance().addScopeChangeListener(this.onScopeChange.bind(this)), C.instance().addModelListener(kt, wn.MODEL_UPDATED, this.render, this, { scoped: !0 }), C.instance().addModelListener(kt, wn.WARNINGS_UPDATED, (e) => {
			Object.assign(this.warningsView, e.data);
		}, this, { scoped: !0 }), this.warningsContainer = document.createElement("div"), this.warningsContainer.classList.add("flex-none"), this.contentElement.insertBefore(this.warningsContainer, this.contentElement.firstChild), this.warningsView.show(this.warningsContainer);
		let t = new S(), n = t.contentElement.createChild("devtools-toolbar", "preloading-toolbar");
		n.setAttribute("jslog", `${Qt()}`), this.ruleSetSelector = new gd(() => this.render()), n.appendToolbarItem(this.ruleSetSelector.item()), this.textFilterUI = new ae(void 0, 1, 1), this.textFilterUI.addEventListener(At.Event.TEXT_CHANGED, this.onTextFilterChanged, this), n.appendToolbarItem(this.textFilterUI), n.appendToolbarItem(new cn()), this.clearButton = new rt("Clear speculative loads", "clear", void 0, "clear-speculative-loads"), this.clearButton.addEventListener(rt.Events.CLICK, () => {
			let e = C.instance().scopeTarget()?.model(kt);
			e && (e.reset(), this.textFilterUI.setValue(""), this.ruleSetSelector.select(null), this.render());
		}), n.appendToolbarItem(this.clearButton), this.preloadingGrid.onSelect = this.onPreloadingGridCellFocused.bind(this);
		let r = document.createElement("div");
		r.className = "preloading-grid-widget-container", r.style = "height: 100%", this.preloadingGrid.show(r, null, !0), _(y`
        <div class="empty-state">
          <span class="empty-state-header">${sd(ad.noPrefetchAttempts)}</span>
          <div class="empty-state-description">
            <span>${sd(ad.prefetchDescription)}</span>
            <devtools-link
              class="devtools-link"
              href=${cd}
              jslogcontext="learn-more"
            >${sd(ad.learnMore)}</devtools-link>
          </div>
        </div>
        <devtools-split-view sidebar-position="second" ${Ct(it, (e) => {
			this.hsplit = e;
		})}>
          <div slot="main" class="overflow-auto" style="height: 100%">
            ${r}
          </div>
          <div slot="sidebar" class="overflow-auto" style="height: 100%">
            ${this.preloadingDetails}
          </div>
        </devtools-split-view>`, t.contentElement, { host: this }), t.show(this.contentElement);
	}
	wasShown() {
		super.wasShown(), this.warningsView.wasShown(), this.render();
	}
	onScopeChange() {
		let e = C.instance().scopeTarget()?.model(kt);
		Qn(e), this.model = e, this.render();
	}
	setFilter(e) {
		let t = e.ruleSetId;
		t !== null && this.model.getRuleSetById(t) === void 0 && (t = null), this.ruleSetSelector.select(t), this.textFilterUI.setValue(""), this.render();
	}
	onTextFilterChanged() {
		this.render();
	}
	updatePreloadingDetails() {
		let e = this.focusedPreloadingAttemptId, t = e === null ? null : this.model.getPreloadingAttemptById(e);
		if (t === null) this.preloadingDetails.data = null;
		else {
			let e = this.model.getPipeline(t), n = t.ruleSetIds.map((e) => this.model.getRuleSetById(e)).filter((e) => e !== null);
			this.preloadingDetails.data = {
				pipeline: e,
				ruleSets: n,
				pageURL: dd()
			};
		}
	}
	render() {
		let e = this.ruleSetSelector.getSelected(), t = this.model.getRepresentativePreloadingAttempts(e).map(({ id: e, value: t }) => {
			let n = t;
			return {
				id: e,
				pipeline: this.model.getPipeline(n),
				ruleSets: n.ruleSetIds.flatMap((e) => {
					let t = this.model.getRuleSetById(e);
					return t === null ? [] : [t];
				}),
				statusCode: Xr(n)
			};
		}), n = pd(this.textFilterUI.valueWithoutSuggestion(), t);
		this.preloadingGrid.rows = n, this.preloadingGrid.pageURL = dd();
		let r = this.contentElement.classList.contains("empty"), i = t.length === 0;
		this.contentElement.classList.toggle("empty", i), r && !i && this.hsplit?.doLayout(), this.updatePreloadingDetails();
	}
	onPreloadingGridCellFocused({ rowId: e }) {
		this.focusedPreloadingAttemptId = e, this.render();
	}
	getRuleSetSelectorToolbarItemForTest() {
		return this.ruleSetSelector.item();
	}
	getPreloadingGridForTest() {
		return this.preloadingGrid;
	}
	getPreloadingDetailsForTest() {
		return this.preloadingDetails;
	}
	selectRuleSetOnFilterForTest(e) {
		this.ruleSetSelector.select(e);
	}
}, hd = class extends S {
	model;
	warningsContainer;
	warningsView = new mu();
	usedPreloading = new Qu();
	constructor(e) {
		super({
			jslog: `${D("speculative-loads")}`,
			useShadowDom: !0
		}), this.registerRequiredCSS(Nn, $u), this.model = e, C.instance().addScopeChangeListener(this.onScopeChange.bind(this)), C.instance().addModelListener(kt, wn.MODEL_UPDATED, this.render, this, { scoped: !0 }), C.instance().addModelListener(kt, wn.WARNINGS_UPDATED, (e) => {
			Object.assign(this.warningsView, e.data);
		}, this, { scoped: !0 }), this.warningsContainer = document.createElement("div"), this.warningsContainer.classList.add("flex-none"), this.contentElement.insertBefore(this.warningsContainer, this.contentElement.firstChild), this.warningsView.show(this.warningsContainer), this.usedPreloading.show(this.contentElement);
	}
	wasShown() {
		super.wasShown(), this.warningsView.wasShown(), this.render();
	}
	onScopeChange() {
		let e = C.instance().scopeTarget()?.model(kt);
		Qn(e), this.model = e, this.render();
	}
	render() {
		this.usedPreloading.data = {
			pageURL: C.instance().scopeTarget()?.inspectedURL() || "",
			previousAttempts: this.model.getRepresentativePreloadingAttemptsOfPreviousPage().map(({ value: e }) => e),
			currentAttempts: this.model.getRepresentativePreloadingAttempts(null).map(({ value: e }) => e)
		};
	}
	getUsedPreloadingForTest() {
		return this.usedPreloading;
	}
}, gd = class {
	model;
	onSelectionChanged = () => {};
	toolbarItem;
	listModel;
	dropDown;
	constructor(e) {
		let t = C.instance().scopeTarget()?.model(kt);
		Qn(t), this.model = t, C.instance().addScopeChangeListener(this.onScopeChange.bind(this)), C.instance().addModelListener(kt, wn.MODEL_UPDATED, this.onModelUpdated, this, { scoped: !0 }), this.listModel = new Mn(), this.dropDown = new Rt(this.listModel, this), this.dropDown.setRowHeight(36), this.dropDown.setPlaceholderText(sd(ad.filterAllPreloads)), this.toolbarItem = new bn(this.dropDown.element), this.toolbarItem.setTitle(sd(ad.filterFilterByRuleSet)), this.toolbarItem.element.classList.add("toolbar-has-dropdown"), this.toolbarItem.element.setAttribute("jslog", `${Bt("filter-by-rule-set").track({ click: !0 })}`), this.onModelUpdated(), this.onSelectionChanged = e;
	}
	onScopeChange() {
		let e = C.instance().scopeTarget()?.model(kt);
		Qn(e), this.model = e, this.onModelUpdated();
	}
	onModelUpdated() {
		let e = [ld, ...this.model.getAllRuleSets().map(({ id: e }) => e)], t = this.dropDown.getSelectedItem(), n = t === null || !e.includes(t) ? ld : t;
		this.listModel.replaceAll(e), this.dropDown.selectItem(n), this.updateWidth(e);
	}
	updateWidth(e) {
		let t = e.map((e) => this.titleFor(e).length), n = Math.max(...t), r = Math.min(n * 6 + 16, 315);
		this.dropDown.setWidth(r);
	}
	translateItemIdToRuleSetId(e) {
		return e === ld ? null : e;
	}
	getSelected() {
		let e = this.dropDown.getSelectedItem();
		return e === null ? null : this.translateItemIdToRuleSetId(e);
	}
	select(e) {
		this.dropDown.selectItem(e);
	}
	item() {
		return this.toolbarItem;
	}
	titleFor(e) {
		let t = this.translateItemIdToRuleSetId(e);
		if (t === null) return sd(ad.filterAllPreloads);
		let n = this.model.getRuleSetById(t);
		return n === null ? d("Internal error") : zl(n, dd());
	}
	subtitleFor(e) {
		let t = this.translateItemIdToRuleSetId(e), n = this.model.getPreloadCountsByRuleSetId().get(t) || /* @__PURE__ */ new Map();
		return ud.preloadsStatusSummary(n) || `(${sd(ad.noRuleSets)})`;
	}
	createElementForItem(e) {
		let t = document.createElement("div"), n = Tn(t, { cssFile: ed }), r = n.createChild("div", "title");
		kn(r, Kn(this.titleFor(e), 100));
		let i = n.createChild("div", "subtitle");
		return kn(i, this.subtitleFor(e)), t;
	}
	isItemSelectable(e) {
		return !0;
	}
	itemSelected(e) {
		this.onSelectionChanged();
	}
	highlightedItemChanged(e, t, n, r) {}
}, _d = /* @__PURE__ */ e({
	PreloadingRuleSetTreeElement: () => Cd,
	PreloadingSummaryTreeElement: () => Sd
}), vd = {
	speculativeLoads: "Speculative loads",
	rules: "Rules",
	speculations: "Speculations"
}, yd = s("panels/application/PreloadingTreeElement.ts", vd), bd = a.bind(void 0, yd), xd = class extends A {
	#e;
	#t;
	view;
	#n;
	#r;
	constructor(e, t, n, r) {
		super(e, r, !1, "speculative-loads"), this.#t = t, this.#n = n;
		let i = v("speculative-loads");
		this.setLeadingIcons([i]), this.#r = !1;
	}
	get itemURL() {
		return this.#n;
	}
	initialize(e) {
		this.#e = e, this.#r && !this.view && this.onselect(!1);
	}
	onselect(e) {
		return super.onselect(e), this.#r = !0, this.#e ? (this.view ||= new this.#t(this.#e), this.showView(this.view), !1) : !1;
	}
}, Sd = class extends si {
	#e;
	#t;
	#n;
	#r = null;
	#i = null;
	constructor(e) {
		super(e, bd(vd.speculativeLoads), "", "", "preloading");
		let t = v("speculative-loads");
		this.setLeadingIcons([t]), this.#n = !1;
	}
	constructChildren(e) {
		this.#r = new Cd(e), this.#i = new wd(e), this.appendChild(this.#r), this.appendChild(this.#i);
	}
	initialize(e) {
		if (this.#r === null || this.#i === null) throw Error("unreachable");
		if (this.#e = e, this.#r.initialize(e), this.#i.initialize(e), this.#i.selected) {
			let e = new Zr(null);
			this.expandAndRevealAttempts(e);
		} else if (this.#r.selected) {
			let e = new Yr(null);
			this.expandAndRevealRuleSet(e);
		} else this.#n && !this.#t && this.onselect(!1);
	}
	onselect(e) {
		return super.onselect(e), this.#n = !0, this.#e ? (this.#t ||= new hd(this.#e), this.showView(this.#t), !1) : !1;
	}
	expandAndRevealRuleSet(e) {
		if (this.#r === null) throw Error("unreachable");
		this.expand(), this.#r.revealRuleSet(e);
	}
	expandAndRevealAttempts(e) {
		if (this.#i === null) throw Error("unreachable");
		this.expand(), this.#i.revealAttempts(e);
	}
}, Cd = class extends xd {
	constructor(e) {
		super(e, fd, "preloading://rule-set", bd(vd.rules));
	}
	revealRuleSet(e) {
		this.select(), this.view !== void 0 && this.view?.revealRuleSet(e);
	}
}, wd = class extends xd {
	constructor(e) {
		super(e, md, "preloading://attempt", bd(vd.speculations));
	}
	revealAttempts(e) {
		this.select(), this.view?.setFilter(e);
	}
}, Td = /* @__PURE__ */ e({
	CrashReportContextView: () => Ad,
	DEFAULT_VIEW: () => kd
}), Ed = {
	noContext: "No context entries detected across frames.",
	unknownFrame: "Unknown Frame",
	filterByText: "Filter by key or value",
	refresh: "Refresh"
}, Dd = s("panels/application/CrashReportContextView.ts", Ed), Od = a.bind(void 0, Dd), kd = (e, t, n) => {
	let { widget: r } = Wt;
	_(y`
    <style>${Ee}</style>
    <style>
      .crash-report-context-view {
        padding-top: 5px;
        overflow: auto;
      }

      .frame-section {
        margin-top: var(--sys-size-8);
      }

      .frame-section:first-child {
        margin-top: 0;
      }

      .frame-header {
        display: flex;
        align-items: center;
        padding: var(--sys-size-4) var(--sys-size-6);
        gap: var(--sys-size-6);
        background-color: var(--sys-color-surface2);
        border-bottom: 1px solid var(--sys-color-divider);
      }

      .frame-url {
        font-weight: var(--ref-typeface-weight-bold);
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-family: var(--default-font-family);
      }


      .toolbar-container {
        border-bottom: 1px solid var(--sys-color-divider);
        background-color: var(--sys-color-cdt-base-container);
      }
    </style>
    <div class="vbox flex-auto" jslog=${D("crash-report-context")}>
      <devtools-toolbar class="crash-report-context-toolbar" role="toolbar" jslog=${Qt()}>
        <devtools-button title=${Od(Ed.refresh)}
                         @click=${e.onRefresh}
                         .iconName=${"refresh"}
                         .variant=${h.TOOLBAR}
                         jslog=${Bt("refresh").track({ click: !0 })}>
        </devtools-button>
        <devtools-toolbar-input type="filter" placeholder=${Od(Ed.filterByText)}
            @change=${(t) => e.onFilterChanged(t)} class="flex-auto">
        </devtools-toolbar-input>
      </devtools-toolbar>
      ${e.frames.length > 0 ? y`
        <div class="crash-report-context-view flex-auto">
          ${e.frames.map((t) => y`
            <div class="frame-section">
              <div class="frame-header">
                <span class="frame-url" title="URL: ${t.url}\nFrame ID: ${t.frameId}">${t.displayName}</span>
              </div>
              <div class="grid-container">
                <devtools-widget
                  ${r(Yi, { data: {
		entries: t.entries.map((e) => ({
			key: e.key,
			value: e.value
		})),
		selectedKey: e.selectedKey || void 0,
		filters: e.filters
	} })}
                  @select=${(t) => e.onRowSelected(t.detail)}>
                </devtools-widget>
              </div>
            </div>
          `)}
        </div>
      ` : y`
        ${r(Ae, { header: Od(Ed.noContext) })}
      `}
    </div>
  `, n);
}, Ad = class extends S {
	selectedKey = null;
	#e;
	#t = [];
	constructor(e = kd) {
		super(), this.#e = e, this.requestUpdate();
	}
	async performUpdate() {
		let e = C.instance().models(Le), t = (await Promise.all(e.map((e) => e.getEntries()))).flat().filter((e) => e !== null), n = this.#n(t);
		this.#e({
			frames: n,
			selectedKey: this.selectedKey,
			filters: this.#t,
			onRowSelected: (e) => {
				this.selectedKey = e, this.requestUpdate();
			},
			onRefresh: () => {
				this.requestUpdate();
			},
			onFilterChanged: (e) => {
				let t = e.detail, n = t ? qn(t, "i") : null;
				this.#t = n ? [{
					key: "key,value",
					regex: n,
					negative: !1
				}] : [], this.requestUpdate();
			}
		}, void 0, this.contentElement);
	}
	#n(e) {
		return e.length === 0 ? [] : [...Map.groupBy(e, (e) => e.frameId).entries()].map(([e, t]) => {
			let n = ce.instance().getFrame(e), r = n?.url || Od(Ed.unknownFrame);
			return {
				url: r,
				frameId: e,
				displayName: n?.displayName() || r,
				isMain: n?.isMainFrame() ?? !1,
				origin: n?.securityOrigin || "",
				entries: t
			};
		}).sort((e, t) => e.isMain && !t.isMain ? -1 : !e.isMain && t.isMain ? 1 : 0).map((e) => ({
			url: e.url,
			frameId: e.frameId,
			displayName: e.displayName,
			entries: e.entries
		}));
	}
}, jd = /* @__PURE__ */ e({
	DEFAULT_VIEW: () => Ld,
	ReportingApiView: () => Rd,
	i18nString: () => Fd
}), { widget: Md } = Wt, Nd = {
	noReportOrEndpoint: "No report or endpoint",
	reportingApiDescription: "On this page you will be able to inspect `Reporting API` reports and endpoints.",
	noReportSelected: "No report selected",
	clickToDisplayBody: "Click on any report to display its body"
}, Pd = s("panels/application/ReportingApiView.ts", Nd), Fd = a.bind(void 0, Pd), Id = "https://developer.chrome.com/docs/capabilities/web-apis/reporting-api", Ld = (e, t, n) => {
	e.hasReports || e.hasEndpoints ? _(y`
      <style>${Ee}</style>
      <devtools-split-view sidebar-position="second" sidebar-initial-size="150" jslog=${D("reporting-api")}>
        ${e.hasReports ? y`
          <devtools-split-view slot="main" sidebar-position="second" sidebar-initial-size="150">
            <div slot="main">
              ${Md(Ha, {
		reports: e.reports,
		onReportSelected: e.onReportSelected
	})}
            </div>
            <div slot="sidebar" class="vbox" jslog=${D("preview").track({ resize: !0 })}>
              ${e.focusedReport ? Md(Wr, { jsonObject: e.focusedReport.body }) : Md(Ae, {
		header: Fd(Nd.noReportSelected),
		text: Fd(Nd.clickToDisplayBody)
	})}
            </div>
          </devtools-split-view>
        ` : y`
          <div slot="main">
            ${Md(Ha, {
		reports: e.reports,
		onReportSelected: e.onReportSelected
	})}
          </div>
        `}
        <div slot="sidebar">
          ${Md(ia, { endpoints: e.endpoints })}
        </div>
      </devtools-split-view>
    `, n) : _(y`
      <devtools-widget ${Md(Ae, {
		header: Fd(Nd.noReportOrEndpoint),
		text: Fd(Nd.reportingApiDescription),
		link: Id
	})} jslog=${D("reporting-api-empty")}></devtools-widget>
    `, n);
}, Rd = class extends S {
	#e;
	#t;
	#n;
	#r = [];
	#i;
	constructor(e = Ld) {
		super(), this.#t = e, this.#e = /* @__PURE__ */ new Map(), C.instance().observeModels(Vt, this), this.requestUpdate();
	}
	modelAdded(e) {
		e.target() === C.instance().primaryPageTarget() && (this.#n = e, this.#n.addEventListener(Tt.ReportingApiEndpointsChangedForOrigin, this.#a, this), this.#n.addEventListener(Tt.ReportingApiReportAdded, this.#o, this), this.#n.addEventListener(Tt.ReportingApiReportUpdated, this.#s, this), this.#n.enableReportingApi(), this.requestUpdate());
	}
	modelRemoved(e) {
		this.#n && this.#n === e && (this.#n.removeEventListener(Tt.ReportingApiEndpointsChangedForOrigin, this.#a, this), this.#n.removeEventListener(Tt.ReportingApiReportAdded, this.#o, this), this.#n.removeEventListener(Tt.ReportingApiReportUpdated, this.#s, this), this.#n = void 0);
	}
	performUpdate() {
		let e = {
			hasReports: this.#r.length > 0,
			hasEndpoints: this.#e.size > 0,
			endpoints: this.#e,
			reports: this.#r,
			focusedReport: this.#i,
			onReportSelected: this.#c.bind(this)
		};
		this.#t(e, void 0, this.element);
	}
	#a({ data: e }) {
		this.#e.set(e.origin, e.endpoints), this.requestUpdate();
	}
	#o({ data: e }) {
		this.#r.push(e), this.requestUpdate();
	}
	#s({ data: e }) {
		let t = this.#r.findIndex((t) => t.id === e.id);
		this.#r[t] = e, this.requestUpdate();
	}
	#c(e) {
		let t = this.#r.find((t) => t.id === e);
		t && (this.#i = t, this.requestUpdate());
	}
}, zd = /* @__PURE__ */ e({
	CrashReportContextTreeElement: () => Wd,
	ReportingApiTreeElement: () => Ud,
	i18nString: () => Hd
}), Bd = {
	reportingApi: "Reporting API",
	crashReportContext: "Crash Report Context"
}, Vd = s("panels/application/ReportingApiTreeElement.ts", Bd), Hd = a.bind(void 0, Vd), Ud = class extends A {
	view;
	#e = !1;
	constructor(e) {
		super(e, Hd(Bd.reportingApi), !0, "reporting-api");
		let t = v("document");
		this.setLeadingIcons([t]);
	}
	onattach() {
		super.onattach(), this.#e || (this.#e = !0, this.appendChild(new Wd(this.resourcesPanel)));
	}
	get itemURL() {
		return "reportingApi://";
	}
	onselect(e) {
		return super.onselect(e), this.view ||= new Rd(), this.showView(this.view), Yt.instance().panelShown("reporting-api"), !1;
	}
}, Wd = class extends A {
	view;
	constructor(e) {
		super(e, Hd(Bd.crashReportContext), !1, "crash-report-context");
		let t = v("table");
		this.setLeadingIcons([t]);
	}
	get itemURL() {
		return "reportingApi://crash-report-context";
	}
	onselect(e) {
		return super.onselect(e), this.view ||= new Ad(), this.view.requestUpdate(), this.showView(this.view), Yt.instance().panelShown("crash-report-context"), !1;
	}
}, Gd = "/*\n * Copyright 2016 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.tree-outline {\n  li.storage-group-list-item,\n  li.storage-group-list-item:not(:has(devtools-checkbox)) {\n    padding: 0 var(--sys-size-8) 0 var(--sys-size-3);\n\n    &::before {\n      display: none;\n    }\n\n    &:hover .selection,\n    &:active .selection::before {\n      background-color: transparent;\n    }\n\n    & + ol {\n      padding-left: 0;\n    }\n  }\n\n  li.storage-group-list-item:not(:first-child) {\n    margin-top: var(--sys-size-6);\n  }\n}\n\n.icons-container devtools-icon.red-icon {\n  color: var(--icon-error);\n}\n\ndevtools-icon.navigator-file-tree-item {\n  color: var(--icon-file-default);\n}\n\ndevtools-icon.navigator-folder-tree-item {\n  color: var(--icon-folder-primary);\n}\n\ndevtools-icon.navigator-script-tree-item {\n  color: var(--icon-file-script);\n}\n\ndevtools-icon.navigator-stylesheet-tree-item {\n  color: var(--icon-file-styles);\n}\n\ndevtools-icon.navigator-image-tree-item,\ndevtools-icon.navigator-font-tree-item {\n  color: var(--icon-file-image);\n}\n\n.window-closed .tree-element-title {\n  text-decoration: line-through;\n}\n\n.device-bound-session-terminated {\n  text-decoration: line-through;\n}\n\n.no-device-bound-session {\n  font-style: italic;\n}\n", Kd = "/*\n * Copyright 2014 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.service-worker-cache-data-view .data-view-toolbar {\n  position: relative;\n  background-color: var(--sys-color-cdt-base-container);\n  border-bottom: 1px solid var(--sys-color-divider);\n  padding-right: 10px;\n}\n\n.service-worker-cache-data-view .data-grid {\n  flex: auto;\n}\n\n.service-worker-cache-data-view .data-grid .data-container tr:nth-last-child(1) td {\n  border: 0;\n}\n\n.service-worker-cache-data-view .data-grid .data-container tr:nth-last-child(2) td {\n  border-bottom: 1px solid var(--sys-color-divider);\n}\n\n.service-worker-cache-data-view .data-grid .data-container tr.selected {\n  background-color: var(--sys-color-neutral-container);\n  color: inherit;\n}\n\n.service-worker-cache-data-view .data-grid:focus .data-container tr.selected {\n  background-color: var(--sys-color-tonal-container);\n  color: var(--sys-color-on-tonal-container);\n}\n\n.service-worker-cache-data-view .section,\n.service-worker-cache-data-view .section > .header,\n.service-worker-cache-data-view .section > .header .title {\n  margin: 0;\n  min-height: inherit;\n  line-height: inherit;\n}\n\n.service-worker-cache-data-view .data-grid .data-container td .section .header .title {\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  overflow: hidden;\n}\n\n.cache-preview-panel-resizer {\n  background-color: var(--sys-color-surface1);\n  height: 4px;\n  border-bottom: 1px solid var(--sys-color-divider);\n}\n\n.cache-storage-summary-bar {\n  flex: 0 0 27px;\n  line-height: 27px;\n  padding-left: 5px;\n  background-color: var(--sys-color-cdt-base-container);\n  border-top: 1px solid var(--sys-color-divider);\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  overflow: hidden;\n}\n", qd = /* @__PURE__ */ e({
	DataGridNode: () => $d,
	RequestView: () => ef,
	ServiceWorkerCacheView: () => Zd
}), Jd = {
	cache: "Cache",
	refresh: "Refresh",
	deleteSelected: "Delete Selected",
	filterByPath: "Filter by path",
	noCacheEntrySelected: "No cache entry selected",
	selectACacheEntryAboveToPreview: "Select a cache entry above to preview",
	name: "Name",
	timeCached: "Time Cached",
	varyHeaderWarning: "⚠️ Set ignoreVary to true when matching this entry",
	serviceWorkerCache: "`Service Worker` Cache",
	matchingEntriesS: "Matching entries: {PH1}",
	totalEntriesS: "Total entries: {PH1}",
	headers: "Headers",
	preview: "Preview"
}, Yd = s("panels/application/ServiceWorkerCacheViews.ts", Jd), Xd = a.bind(void 0, Yd), Zd = class extends $t {
	model;
	entriesForTest;
	splitWidget;
	previewPanel;
	preview;
	cache;
	dataGrid;
	refreshThrottler;
	refreshButton;
	deleteSelectedButton;
	entryPathFilter;
	returnCount;
	summaryBarElement;
	loadingPromise;
	metadataView = new fo();
	constructor(e, t) {
		super({
			title: Xd(Jd.cache),
			viewId: "cache",
			jslog: `${D("cache-storage-data")}`
		}), this.registerRequiredCSS(Kd), this.model = e, this.entriesForTest = null, this.element.classList.add("service-worker-cache-data-view"), this.element.classList.add("storage-view");
		let n = this.element.createChild("devtools-toolbar", "data-view-toolbar");
		n.setAttribute("jslog", `${Qt()}`), this.element.appendChild(this.metadataView), this.splitWidget = new it(!1, !1), this.splitWidget.show(this.element), this.previewPanel = new S();
		let r = this.previewPanel.element.createChild("div", "cache-preview-panel-resizer");
		this.splitWidget.setMainWidget(this.previewPanel), this.splitWidget.installResizer(r), this.preview = null, this.cache = t;
		let i = this.model.target().model(vn)?.getBucketByName(t.storageBucket.storageKey, t.storageBucket.name);
		this.metadataView.setShowOnlyBucket(!0), i ? this.metadataView.setStorageBucket(i) : t.storageKey && this.metadataView.setStorageKey(t.storageKey), this.dataGrid = null, this.refreshThrottler = new It(300), this.refreshButton = new rt(Xd(Jd.refresh), "refresh", void 0, "cache-storage.refresh"), this.refreshButton.addEventListener(rt.Events.CLICK, this.refreshButtonClicked, this), n.appendToolbarItem(this.refreshButton), this.deleteSelectedButton = new rt(Xd(Jd.deleteSelected), "cross", void 0, "cache-storage.delete-selected"), this.deleteSelectedButton.addEventListener(rt.Events.CLICK, (e) => {
			this.deleteButtonClicked(null);
		}), n.appendToolbarItem(this.deleteSelectedButton);
		let a = new ae(Xd(Jd.filterByPath), 1);
		n.appendToolbarItem(a);
		let o = new It(300);
		this.entryPathFilter = "", a.addEventListener(At.Event.TEXT_CHANGED, () => {
			o.schedule(() => (this.entryPathFilter = a.value(), this.updateData(!0)));
		}), this.returnCount = null, this.summaryBarElement = null, this.loadingPromise = null, this.update(t);
	}
	resetDataGrid() {
		this.dataGrid && this.dataGrid.asWidget().detach(), this.dataGrid = this.createDataGrid();
		let e = this.dataGrid.asWidget();
		this.splitWidget.setSidebarWidget(e), e.setMinimumSize(0, 100);
	}
	wasShown() {
		super.wasShown(), this.model.addEventListener(Gt.CACHE_STORAGE_CONTENT_UPDATED, this.cacheContentUpdated, this), this.updateData(!0);
	}
	willHide() {
		super.willHide(), this.model.removeEventListener(Gt.CACHE_STORAGE_CONTENT_UPDATED, this.cacheContentUpdated, this);
	}
	showPreview(e) {
		e && this.preview === e || (this.preview && this.preview.detach(), e ||= new Ae(Xd(Jd.noCacheEntrySelected), Xd(Jd.selectACacheEntryAboveToPreview)), this.preview = e, this.preview.show(this.previewPanel.element));
	}
	createDataGrid() {
		let e = [
			{
				id: "number",
				title: "#",
				sortable: !1,
				width: "3px"
			},
			{
				id: "name",
				title: Xd(Jd.name),
				weight: 4,
				sortable: !0
			},
			{
				id: "response-type",
				title: d("Response-Type"),
				weight: 1,
				align: Ir.RIGHT,
				sortable: !0
			},
			{
				id: "content-type",
				title: d("Content-Type"),
				weight: 1,
				sortable: !0
			},
			{
				id: "content-length",
				title: d("Content-Length"),
				weight: 1,
				align: Ir.RIGHT,
				sortable: !0
			},
			{
				id: "response-time",
				title: Xd(Jd.timeCached),
				width: "12em",
				weight: 1,
				align: Ir.RIGHT,
				sortable: !0
			},
			{
				id: "vary-header",
				title: d("Vary Header"),
				weight: 1,
				sortable: !0
			}
		], t = new Pr({
			displayName: Xd(Jd.serviceWorkerCache),
			columns: e,
			deleteCallback: this.deleteButtonClicked.bind(this),
			refreshCallback: this.updateData.bind(this, !0)
		});
		return t.addEventListener(Lr.SORTING_CHANGED, this.sortingChanged, this), t.addEventListener(Lr.SELECTED_NODE, (e) => {
			this.previewCachedResponse(e.data.data);
		}, this), t.setStriped(!0), t;
	}
	sortingChanged() {
		if (!this.dataGrid) return;
		let e = this.dataGrid, t = e.isSortOrderAscending(), n = e.sortColumnId(), r;
		n === "name" ? r = (e, t) => e.name.localeCompare(t.name) : n === "content-type" ? r = (e, t) => e.data.mimeType.localeCompare(t.data.mimeType) : n === "content-length" ? r = (e, t) => e.data.resourceSize - t.data.resourceSize : n === "response-time" ? r = (e, t) => e.data.endTime - t.data.endTime : n === "response-type" ? r = (e, t) => e.responseType.localeCompare(t.responseType) : n === "vary-header" && (r = (e, t) => e.varyHeader.localeCompare(t.varyHeader));
		let i = e.rootNode().children.slice();
		e.rootNode().removeChildren(), i.sort((e, n) => {
			let i = r(e, n);
			return t ? i : -i;
		}), i.forEach((t) => e.rootNode().appendChild(t));
	}
	async deleteButtonClicked(e) {
		!e && (e = this.dataGrid?.selectedNode ?? null, !e) || (await this.model.deleteCacheEntry(this.cache, e.data.url()), e.remove());
	}
	update(e = null) {
		e && (this.cache = e, this.resetDataGrid(), this.updateData(!0));
	}
	updateSummaryBar() {
		this.summaryBarElement ||= this.element.createChild("div", "cache-storage-summary-bar"), this.summaryBarElement.removeChildren();
		let e = this.summaryBarElement.createChild("span");
		e.textContent = this.entryPathFilter ? Xd(Jd.matchingEntriesS, { PH1: String(this.returnCount) }) : Xd(Jd.totalEntriesS, { PH1: String(this.returnCount) });
	}
	updateDataCallback(e, t) {
		if (!this.dataGrid) return;
		let n = this.dataGrid.selectedNode?.data.url();
		this.refreshButton.setEnabled(!0), this.entriesForTest = e, this.returnCount = t, this.updateSummaryBar();
		let r = /* @__PURE__ */ new Map(), i = this.dataGrid.rootNode();
		for (let e of i.children) r.set(e.data.url, e);
		i.removeChildren();
		let a = null;
		for (let t = 0; t < e.length; ++t) {
			let o = e[t], s = r.get(o.requestURL);
			!s || s.data.responseTime !== o.responseTime ? (s = new $d(t, this.createRequest(o), o.responseType), s.selectable = !0) : s.data.number = t, i.appendChild(s), o.requestURL === n && (a = s);
		}
		a ? a.revealAndSelect() : this.showPreview(null), this.updatedForTest();
	}
	async updateData(e) {
		if (!e && this.loadingPromise || (this.refreshButton.setEnabled(!1), this.loadingPromise)) return await this.loadingPromise;
		this.loadingPromise = new Promise((e) => {
			this.model.loadAllCacheData(this.cache, this.entryPathFilter, (t, n) => {
				e({
					entries: t,
					returnCount: n
				});
			});
		});
		let { entries: t, returnCount: n } = await this.loadingPromise;
		this.updateDataCallback(t, n), this.loadingPromise = null;
	}
	refreshButtonClicked() {
		this.updateData(!0);
	}
	cacheContentUpdated(e) {
		let { cacheName: t, storageBucket: n } = e.data;
		this.cache.inBucket(n) && this.cache.cacheName === t && this.refreshThrottler.schedule(() => Promise.resolve(this.updateData(!0)), Ot.AS_SOON_AS_POSSIBLE);
	}
	async previewCachedResponse(e) {
		let t = Qd.get(e);
		t || (t = new ef(e), Qd.set(e, t)), e === this.dataGrid?.selectedNode?.data && this.showPreview(t);
	}
	createRequest(e) {
		let t = Re.createWithoutBackendRequest("cache-storage-" + e.requestURL, e.requestURL, "", null);
		t.requestMethod = e.requestMethod, t.setRequestHeaders(e.requestHeaders), t.statusCode = e.responseStatus, t.statusText = e.responseStatusText, t.protocol = new re(e.requestURL).scheme, t.responseHeaders = e.responseHeaders, t.setRequestHeadersText(""), t.endTime = e.responseTime;
		let n = e.responseHeaders.find((e) => e.name.toLowerCase() === "content-type"), r = Vn.PLAIN;
		if (n) {
			let e = Bn(n.value);
			e.mimeType && (r = e.mimeType);
		}
		t.mimeType = r, n = e.responseHeaders.find((e) => e.name.toLowerCase() === "content-length"), t.resourceSize = n && Number(n.value) || 0;
		let i = ne.fromMimeType(r);
		return i ||= ne.fromURL(e.requestURL) || p.Other, t.setResourceType(i), t.setContentDataProvider(this.requestContent.bind(this, t)), t;
	}
	async requestContent(e) {
		let t = await this.cache.requestCachedResponse(e.url(), e.requestHeaders());
		return t ? new Un(t.body, !0, e.mimeType, e.charset() ?? void 0) : { error: "No cached response found" };
	}
	updatedForTest() {}
}, Qd = /* @__PURE__ */ new WeakMap(), $d = class extends Fr {
	number;
	name;
	request;
	responseType;
	varyHeader;
	constructor(e, t, n) {
		super(t), this.number = e;
		let r = new re(t.url());
		this.name = r.isValid ? Gn(t.url(), r.domain()) : t.url(), this.request = t, this.responseType = n, this.varyHeader = t.responseHeaders.find((e) => e.name.toLowerCase() === "vary")?.value || "";
	}
	createCell(e) {
		let t = this.createTD(e), n, r = this.request.url();
		e === "number" ? n = String(this.number) : e === "name" ? n = this.name : e === "response-type" ? n = this.responseType === "opaqueResponse" ? "opaque" : this.responseType === "opaqueRedirect" ? "opaqueredirect" : this.responseType : e === "content-type" ? n = this.request.mimeType : e === "content-length" ? n = (this.request.resourceSize | 0).toLocaleString("en-US") : e === "response-time" ? n = (/* @__PURE__ */ new Date(this.request.endTime * 1e3)).toLocaleString() : e === "vary-header" && (n = this.varyHeader, this.varyHeader && (r = Xd(Jd.varyHeaderWarning)));
		let i = t.parentElement, a;
		return i && this.dataGrid && (a = this.dataGrid.elementToDataGridNode.get(i)), Pr.setElementText(t, n || "", !0, a), Ye.install(t, r), t;
	}
}, ef = class extends S {
	tabbedPane;
	resourceViewTabSetting;
	constructor(e) {
		super(), this.tabbedPane = new be(), this.tabbedPane.element.setAttribute("jslog", `${T("network-item-preview")}`), this.tabbedPane.addEventListener(Qe.TabSelected, this.tabSelected, this), this.resourceViewTabSetting = m.instance().createSetting("cache-storage-view-tab", "preview");
		let t = new ei();
		t.request = e, this.tabbedPane.appendTab("headers", Xd(Jd.headers), t), this.tabbedPane.appendTab("preview", Xd(Jd.preview), new $r(e)), this.tabbedPane.show(this.element);
	}
	wasShown() {
		super.wasShown(), this.selectTab();
	}
	selectTab(e) {
		e ||= this.resourceViewTabSetting.get(), e && !this.tabbedPane.selectTab(e) && this.tabbedPane.selectTab("headers");
	}
	tabSelected(e) {
		e.data.isUserGesture && this.resourceViewTabSetting.set(e.data.tabId);
	}
}, tf = {
	cacheStorage: "Cache storage",
	noCacheStorage: "No cache storage detected",
	cacheStorageDescription: "On this page you can view and delete cache data.",
	refreshCaches: "Refresh Caches",
	delete: "Delete"
}, nf = s("panels/application/ServiceWorkerCacheTreeElement.ts", tf), rf = a.bind(void 0, nf), af = class extends si {
	swCacheModels;
	swCacheTreeElements;
	storageBucket;
	constructor(e, t) {
		super(e, rf(tf.cacheStorage), rf(tf.noCacheStorage), rf(tf.cacheStorageDescription), "cache-storage");
		let n = v("database");
		this.setLink("https://developer.chrome.com/docs/devtools/storage/cache/"), this.setLeadingIcons([n]), this.swCacheModels = /* @__PURE__ */ new Set(), this.swCacheTreeElements = /* @__PURE__ */ new Set(), this.storageBucket = t;
	}
	initialize() {
		this.swCacheModels.clear(), this.swCacheTreeElements.clear(), C.instance().observeModels(_t, {
			modelAdded: (e) => this.serviceWorkerCacheModelAdded(e),
			modelRemoved: (e) => this.serviceWorkerCacheModelRemoved(e)
		});
	}
	onattach() {
		super.onattach(), this.listItemElement.addEventListener("contextmenu", this.handleContextMenuEvent.bind(this), !0);
	}
	handleContextMenuEvent(e) {
		let t = new bt(e);
		t.defaultSection().appendItem(rf(tf.refreshCaches), this.refreshCaches.bind(this), { jslogContext: "refresh-caches" }), t.show();
	}
	refreshCaches() {
		for (let e of this.swCacheModels) e.refreshCacheNames();
	}
	serviceWorkerCacheModelAdded(e) {
		e.enable(), this.swCacheModels.add(e);
		for (let t of e.caches()) this.addCache(e, t);
		e.addEventListener(Gt.CACHE_ADDED, this.cacheAdded, this), e.addEventListener(Gt.CACHE_REMOVED, this.cacheRemoved, this);
	}
	serviceWorkerCacheModelRemoved(e) {
		for (let t of e.caches()) this.removeCache(e, t);
		e.removeEventListener(Gt.CACHE_ADDED, this.cacheAdded, this), e.removeEventListener(Gt.CACHE_REMOVED, this.cacheRemoved, this), this.swCacheModels.delete(e);
	}
	cacheAdded(e) {
		let { model: t, cache: n } = e.data;
		this.addCache(t, n);
	}
	cacheInTree(e) {
		return !this.storageBucket || e.inBucket(this.storageBucket);
	}
	addCache(e, t) {
		if (this.cacheInTree(t)) {
			let n = new of(this.resourcesPanel, e, t, this.storageBucket === void 0);
			this.swCacheTreeElements.add(n), this.appendChild(n);
		}
	}
	cacheRemoved(e) {
		let { model: t, cache: n } = e.data;
		this.cacheInTree(n) && this.removeCache(t, n);
	}
	removeCache(e, t) {
		let n = this.cacheTreeElement(e, t);
		n && (this.removeChild(n), this.swCacheTreeElements.delete(n), this.setExpandable(this.childCount() > 0));
	}
	cacheTreeElement(e, t) {
		for (let n of this.swCacheTreeElements) if (n.hasModelAndCache(e, t)) return n;
		return null;
	}
}, of = class extends A {
	model;
	cache;
	view;
	constructor(e, t, n, r) {
		let i;
		i = r ? n.cacheName + " - " + n.storageKey : n.cacheName, super(e, i, !1, "cache-storage-instance"), this.model = t, this.cache = n, this.view = null;
		let a = v("table");
		this.setLeadingIcons([a]);
	}
	get itemURL() {
		return "cache://" + this.cache.cacheId;
	}
	onattach() {
		super.onattach(), this.listItemElement.addEventListener("contextmenu", this.handleContextMenuEvent.bind(this), !0);
	}
	handleContextMenuEvent(e) {
		let t = new bt(e);
		t.defaultSection().appendItem(rf(tf.delete), this.clearCache.bind(this), { jslogContext: "delete" }), t.show();
	}
	clearCache() {
		this.model.deleteCache(this.cache);
	}
	update(e) {
		this.cache = e, this.view && this.view.update(e);
	}
	onselect(e) {
		return super.onselect(e), this.view ||= new Zd(this.model, this.cache), this.showView(this.view), Yt.instance().panelShown("service-worker-cache"), !1;
	}
	hasModelAndCache(e, t) {
		return this.cache.equals(t) && this.model === e;
	}
}, sf = "/*\n * Copyright 2015 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.service-worker-version {\n  display: flex;\n  /* The status string can be long, allow this line of the report to wrap. */\n  align-items: center;\n  flex-wrap: wrap;\n\n  devtools-button {\n    margin-left: var(--sys-size-3);\n  }\n}\n\n.service-worker-version-stack {\n  position: relative;\n}\n\n.service-worker-version-stack-bar {\n  position: absolute;\n  top: 10px;\n  bottom: 20px;\n  left: 4px;\n  content: \"\";\n  border-left: 1px solid var(--sys-color-divider);\n  z-index: 0;\n}\n\n.service-worker-version:not(:last-child) {\n  margin-bottom: 7px;\n}\n\n.service-worker-version-string {\n  /* This label contains important information that needs to be legible at all\n     times. Don't shrink it. */\n  flex-shrink: 0;\n}\n\n.service-worker-active-circle,\n.service-worker-redundant-circle,\n.service-worker-waiting-circle,\n.service-worker-installing-circle {\n  position: relative;\n  display: inline-block;\n  width: 10px;\n  height: 10px;\n  z-index: 10;\n  margin-right: 5px;\n  border-radius: 50%;\n  border: 1px solid var(--sys-color-token-subtle);\n  align-self: center;\n  /* The circle should not shrink, to avoid risking becoming invisible. */\n  flex-shrink: 0;\n}\n\n.service-worker-active-circle {\n  background-color: var(--sys-color-green-bright);\n}\n\n.service-worker-waiting-circle {\n  background-color: var(--sys-color-yellow-bright);\n}\n\n.service-worker-installing-circle {\n  background-color: var(--sys-color-cdt-base-container);\n}\n\n.service-worker-redundant-circle {\n  background-color: var(--sys-color-neutral-bright);\n}\n\n.service-worker-subtitle {\n  padding-left: 14px;\n  line-height: 14px;\n  color: var(--sys-color-state-disabled);\n}\n\n.link {\n  margin-left: 7px;\n}\n\n.service-worker-editor-with-button {\n  align-items: baseline;\n  display: flex;\n}\n\n.service-worker-notification-editor {\n  border: 1px solid var(--sys-color-divider);\n  display: flex;\n  flex: auto;\n  margin-right: 4px;\n  max-width: 400px;\n  min-width: 80px;\n}\n\n.report-field-value {\n  white-space: normal;\n}\n\n.report-field-value-filename,\n.service-worker-client-string {\n  max-width: 400px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.report-field-value-filename {\n  display: contents;\n}\n\n.report-field-value-subtitle {\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.service-worker-client {\n  display: flex;\n}\n\n.service-worker-client-focus-link {\n  flex: none;\n  margin-left: 2px;\n  align-self: center;\n}\n\n.service-worker-notification-editor.source-code {\n  /** Simulate CodeMirror that is shown above */\n  padding: 4px;\n}\n\n.service-worker-list {\n  background-color: var(--sys-color-cdt-base-container);\n  overflow: auto;\n}\n\n.service-workers-this-origin {\n  flex-shrink: 0;\n  flex-grow: 0;\n}\n\n.devtools-link {\n  line-height: 14px;\n  align-self: center;\n  padding: 1px;\n}\n\nbutton.link {\n  padding: 1px;\n}\n\nbutton.link:focus-visible {\n  background-color: inherit;\n}\n", cf = "/*\n * Copyright 2020 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n.resource-service-worker-update-view {\n  display: block;\n  margin: 6px;\n  color: var(--sys-color-on-surface-subtle);\n  overflow: auto;\n}\n\n.service-worker-update-timing-table {\n  border: 1px solid var(--sys-color-divider);\n  border-spacing: 0;\n  padding-left: 10px;\n  padding-right: 10px;\n  line-height: initial;\n  table-layout: auto;\n  overflow: hidden;\n}\n\n.service-worker-update-timing-row {\n  position: relative;\n  height: 20px;\n  overflow: hidden;\n  min-width: 80px;\n}\n\n.service-worker-update-timing-bar {\n  position: absolute;\n  min-width: 1px;\n  top: 0;\n  bottom: 0;\n}\n\n.service-worker-update-timing-bar-clickable::before {\n  user-select: none;\n  mask-image: var(--image-file-triangle-right);\n  float: left;\n  width: 14px;\n  height: 14px;\n  margin-right: 2px;\n  content: \"\";\n  position: relative;\n  background-color: var(--icon-default);\n  transition: transform 200ms;\n}\n\n.service-worker-update-timing-bar-clickable {\n  position: relative;\n  left: -12px;\n}\n\n.service-worker-update-timing-bar-clickable:focus-visible {\n  background-color: var(--sys-color-state-focus-highlight);\n}\n\n.service-worker-update-timing-bar-clickable[aria-checked=\"true\"]::before {\n  transform: rotate(90deg);\n}\n\n.service-worker-update-timing-bar-details-collapsed {\n  display: none;\n}\n\n.service-worker-update-timing-bar-details-expanded {\n  display: table-row;\n}\n\n.service-worker-update-timing-bar-details:focus-visible {\n  background-color: var(--sys-color-state-focus-highlight);\n}\n\n.service-worker-update-timing-bar.activate {\n  top: 5px;\n  height: 10px;\n  background-color: var(--sys-color-yellow-bright);\n}\n\n.service-worker-update-timing-bar.wait {\n  top: 5px;\n  height: 10px;\n  background-color: var(--sys-color-purple-bright);\n}\n\n.service-worker-update-timing-bar.install {\n  top: 5px;\n  height: 10px;\n  background-color: var(--sys-color-cyan-bright);\n}\n\n.service-worker-update-timing-table > tr > td {\n  padding: 4px 0;\n  padding-right: 10px;\n}\n\ntable.service-worker-update-timing-table > tr.service-worker-update-timing-table-header > td {\n  border-top: 5px solid transparent;\n  color: var(--sys-color-token-subtle);\n}\n\ntable.service-worker-update-timing-table > tr.service-worker-update-timing-bar-details > td:first-child {\n  padding-left: 12px;\n}\n\ntable.service-worker-update-timing-table > tr.service-worker-update-timeline > td:first-child {\n  padding-left: 12px;\n}\n", lf = /* @__PURE__ */ e({
	ServiceWorkerUpdateCycleView: () => pf,
	ServiceWorkerUpdateNames: () => mf
}), uf = {
	version: "Version",
	updateActivity: "Update Activity",
	timeline: "Timeline",
	startTimeS: "Start time: {PH1}",
	endTimeS: "End time: {PH1}"
}, df = s("panels/application/ServiceWorkerUpdateCycleView.ts", uf), ff = a.bind(void 0, df), pf = class {
	registration;
	rows;
	selectedRowIndex;
	tableElement;
	constructor(e) {
		this.registration = e, this.rows = [], this.selectedRowIndex = -1, this.tableElement = document.createElement("table"), this.createTimingTable();
	}
	calculateServiceWorkerUpdateRanges() {
		function e(e, t) {
			t.start < Number.MAX_VALUE && t.start <= t.end && e.push(t);
		}
		function t(t, n, r, i, a, o, s) {
			e(t, {
				id: n,
				phase: "Install",
				start: r,
				end: i
			}), (s === on.ServiceWorkerVersionStatus.Activating || s === on.ServiceWorkerVersionStatus.Activated || s === on.ServiceWorkerVersionStatus.Redundant) && (e(t, {
				id: n,
				phase: "Wait",
				start: i,
				end: a
			}), e(t, {
				id: n,
				phase: "Activate",
				start: a,
				end: o
			}));
		}
		function n(e) {
			let n = e.currentState, r = 0, i = 0, a = 0, o = 0, s = n.status;
			if (s === on.ServiceWorkerVersionStatus.New) return [];
			for (; n;) n.status === on.ServiceWorkerVersionStatus.Activated ? r = n.lastUpdatedTimestamp : n.status === on.ServiceWorkerVersionStatus.Activating ? (r === 0 && (r = n.lastUpdatedTimestamp), i = n.lastUpdatedTimestamp) : n.status === on.ServiceWorkerVersionStatus.Installed ? a = n.lastUpdatedTimestamp : n.status === on.ServiceWorkerVersionStatus.Installing && (a === 0 && (a = n.lastUpdatedTimestamp), o = n.lastUpdatedTimestamp), n = n.previousState;
			let c = [];
			return t(c, e.id, o, a, i, r, s), c;
		}
		let r = this.registration.versionsByMode(), i = [
			hn.Modes.ACTIVE,
			hn.Modes.WAITING,
			hn.Modes.INSTALLING,
			hn.Modes.REDUNDANT
		];
		for (let e of i) {
			let t = r.get(e);
			if (t) return n(t);
		}
		return [];
	}
	createTimingTable() {
		this.tableElement.classList.add("service-worker-update-timing-table"), this.tableElement.setAttribute("jslog", `${Ht("update-timing-table")}`);
		let e = this.calculateServiceWorkerUpdateRanges();
		this.updateTimingTable(e);
	}
	createTimingTableHead() {
		let e = this.tableElement.createChild("tr", "service-worker-update-timing-table-header");
		kn(e.createChild("td"), ff(uf.version)), kn(e.createChild("td"), ff(uf.updateActivity)), kn(e.createChild("td"), ff(uf.timeline));
	}
	removeRows() {
		let e = this.tableElement.getElementsByTagName("tr");
		for (; e[0];) e[0].parentNode && e[0].parentNode.removeChild(e[0]);
		this.rows = [];
	}
	updateTimingTable(e) {
		this.selectedRowIndex = -1, this.removeRows(), this.createTimingTableHead();
		let t = e;
		if (t.length === 0) return;
		let n = t.map((e) => e.start), r = t.map((e) => e.end), i = n.reduce((e, t) => Math.min(e, t)), a = r.reduce((e, t) => Math.max(e, t)), o = 100 / (a - i);
		for (let e of t) {
			let t = e.phase, n = o * (e.start - i), r = o * (a - e.end), s = this.tableElement.createChild("tr", "service-worker-update-timeline");
			s.setAttribute("jslog", `${zt("update-timeline").track({
				click: !0,
				resize: !0,
				keydown: "ArrowLeft|ArrowRight|ArrowUp|ArrowDown|Enter|Space"
			})}`), this.rows.push(s);
			let c = s.createChild("td");
			kn(c, "#" + e.id), c.classList.add("service-worker-update-timing-bar-clickable"), c.setAttribute("tabindex", "0"), c.setAttribute("role", "switch"), c.addEventListener("focus", (e) => {
				this.onFocus(e);
			}), c.setAttribute("jslog", `${Pe("timing-info").track({ click: !0 })}`), xt(c, !1);
			let l = s.createChild("td");
			kn(l, t);
			let u = s.createChild("td").createChild("div", "service-worker-update-timing-row").createChild("span", "service-worker-update-timing-bar " + t.toLowerCase());
			u.style.left = n + "%", u.style.right = r + "%", u.textContent = "​", this.constructUpdateDetails(s, e);
		}
	}
	constructUpdateDetails(e, t) {
		let n = this.tableElement.createChild("tr", "service-worker-update-timing-bar-details");
		n.classList.add("service-worker-update-timing-bar-details-collapsed");
		let r = n.createChild("td");
		r.colSpan = 3;
		let i = new Date(t.start).toISOString();
		kn(r.createChild("span"), ff(uf.startTimeS, { PH1: i })), n.tabIndex = 0;
		let a = this.tableElement.createChild("tr", "service-worker-update-timing-bar-details");
		a.classList.add("service-worker-update-timing-bar-details-collapsed");
		let o = a.createChild("td");
		o.colSpan = 3;
		let s = new Date(t.end).toISOString();
		kn(o.createChild("span"), ff(uf.endTimeS, { PH1: s })), a.tabIndex = 0, e.addEventListener("keydown", (e) => {
			this.onKeydown(e, n, a);
		}), e.addEventListener("click", (e) => {
			this.onClick(e, n, a);
		});
	}
	toggle(e, t, n, r) {
		n.classList.contains("service-worker-update-timing-bar-clickable") && (e.classList.toggle("service-worker-update-timing-bar-details-collapsed"), e.classList.toggle("service-worker-update-timing-bar-details-expanded"), t.classList.toggle("service-worker-update-timing-bar-details-collapsed"), t.classList.toggle("service-worker-update-timing-bar-details-expanded"), xt(n, !r));
	}
	onFocus(e) {
		let t = e.target;
		if (!t) return;
		let n = t.parentElement;
		n && (this.selectedRowIndex = this.rows.indexOf(n));
	}
	onKeydown(e, t, n) {
		if (!e.target) return;
		let r = e.target, i = e, a = r.getAttribute("aria-checked") === "true";
		if (i.key === "Enter" || i.key === " ") {
			this.toggle(t, n, r, a), e.preventDefault();
			return;
		}
		if (!a && i.key === "ArrowRight" || a && i.key === "ArrowLeft") {
			this.toggle(t, n, r, a), e.preventDefault();
			return;
		}
		i.key === "ArrowDown" && (this.selectedRowIndex >= 0 ? this.selectNextRow() : this.selectFirstRow(), e.preventDefault()), i.key === "ArrowUp" && (this.selectedRowIndex >= 0 ? this.selectPreviousRow() : this.selectLastRow(), e.preventDefault());
	}
	focusRow(e) {
		e.cells[0].focus();
	}
	blurRow(e) {
		e.cells[0].blur();
	}
	selectFirstRow() {
		this.rows.length !== 0 && (this.selectedRowIndex = 0, this.focusRow(this.rows[0]));
	}
	selectLastRow() {
		this.rows.length !== 0 && (this.selectedRowIndex = this.rows.length - 1, this.focusRow(this.rows[this.selectedRowIndex]));
	}
	selectNextRow() {
		if (this.rows.length === 0) return;
		let e = this.selectedRowIndex;
		this.selectedRowIndex++, this.selectedRowIndex >= this.rows.length && (this.selectedRowIndex = 0), this.blurRow(this.rows[e]), this.focusRow(this.rows[this.selectedRowIndex]);
	}
	selectPreviousRow() {
		if (this.rows.length === 0) return;
		let e = this.selectedRowIndex;
		this.selectedRowIndex--, this.selectedRowIndex < 0 && (this.selectedRowIndex = this.rows.length - 1), this.blurRow(this.rows[e]), this.focusRow(this.rows[this.selectedRowIndex]);
	}
	onClick(e, t, n) {
		let r = e.target;
		if (!r) return;
		let i = r.getAttribute("aria-checked") === "true";
		this.toggle(t, n, r, i), e.preventDefault();
	}
	refresh() {
		let e = this.calculateServiceWorkerUpdateRanges();
		this.updateTimingTable(e);
	}
}, mf = /* @__PURE__ */ function(e) {
	return e.INSTALL = "Install", e.WAIT = "Wait", e.ACTIVATE = "Activate", e;
}({}), hf = /* @__PURE__ */ e({
	Section: () => bf,
	ServiceWorkersView: () => yf,
	setThrottleDisabledForDebugging: () => vf
}), W = {
	serviceWorkersFromOtherOrigins: "Service workers from other origins",
	updateOnReload: "Update on reload",
	onPageReloadForceTheService: "On page reload, force the `service worker` to update, and activate it",
	bypassForNetwork: "Bypass for network",
	bypassTheServiceWorkerAndLoad: "Bypass the `service worker` and load resources from the network",
	serviceWorkerForS: "`Service worker` for {PH1}",
	testPushMessageFromDevtools: "Test push message from DevTools.",
	networkRequests: "Network requests",
	update: "Update",
	unregisterServiceWorker: "Unregister service worker",
	unregister: "Unregister",
	source: "Source",
	status: "Status",
	clients: "Clients",
	pushString: "Push",
	pushData: "Push data",
	syncString: "Sync",
	syncTag: "Sync tag",
	periodicSync: "Periodic sync",
	periodicSyncTag: "Periodic sync tag",
	sRegistrationErrors: "{PH1} registration errors",
	receivedS: "Received {PH1}",
	routers: "Routers",
	sDeleted: "{PH1} - deleted",
	sActivatedAndIsS: "#{PH1} activated and is {PH2}",
	stopString: "Stop",
	startString: "Start",
	sIsRedundant: "#{PH1} is redundant",
	sWaitingToActivate: "#{PH1} waiting to activate",
	sTryingToInstall: "#{PH1} trying to install",
	updateCycle: "Update Cycle",
	workerS: "Worker: {PH1}",
	focus: "focus",
	seeAllRegistrations: "See all registrations"
}, gf = s("panels/application/ServiceWorkersView.ts", W), G = a.bind(void 0, gf), _f = !1, vf = (e) => {
	_f = e;
}, yf = class extends S {
	currentWorkersView;
	toolbar;
	sections;
	manager;
	securityOriginManager;
	sectionToRegistration;
	eventListeners;
	constructor() {
		super({
			jslog: `${D("service-workers")}`,
			useShadowDom: !0
		}), this.registerRequiredCSS(sf), this.currentWorkersView = new An(d("Service workers")), this.currentWorkersView.setBodyScrollable(!1), this.contentElement.classList.add("service-worker-list"), this.currentWorkersView.show(this.contentElement), this.currentWorkersView.element.classList.add("service-workers-this-origin"), this.currentWorkersView.element.setAttribute("jslog", `${T("this-origin")}`), this.toolbar = this.currentWorkersView.createToolbar(), this.sections = /* @__PURE__ */ new Map(), this.manager = null, this.securityOriginManager = null, this.sectionToRegistration = /* @__PURE__ */ new WeakMap();
		let e = this.contentElement.createChild("div", "service-workers-other-origin");
		e.setAttribute("jslog", `${T("other-origin")}`);
		let t = new An();
		t.setHeaderVisible(!1), t.show(e);
		let n = t.appendSection(G(W.serviceWorkersFromOtherOrigins)).appendRow(), r = Zt.create("chrome://serviceworker-internals", G(W.seeAllRegistrations), void 0, "view-all");
		n.appendChild(r), this.toolbar.appendToolbarItem(Vr().createOfflineToolbarCheckbox());
		let i = m.instance().createSetting("service-worker-update-on-reload", !1);
		i.setTitle(G(W.updateOnReload));
		let a = new _n(i, G(W.onPageReloadForceTheService));
		this.toolbar.appendToolbarItem(a);
		let o = m.instance().createSetting("bypass-service-worker", !1);
		o.setTitle(G(W.bypassForNetwork));
		let s = new _n(o, G(W.bypassTheServiceWorkerAndLoad));
		this.toolbar.appendToolbarItem(s), this.eventListeners = /* @__PURE__ */ new Map(), C.instance().observeModels(rn, this), this.updateListVisibility();
	}
	modelAdded(e) {
		if (e.target() === C.instance().primaryPageTarget()) {
			this.manager = e, this.securityOriginManager = e.target().model(at);
			for (let e of this.manager.registrations().values()) this.updateRegistration(e);
			this.eventListeners.set(e, [
				this.manager.addEventListener(xn.REGISTRATION_UPDATED, this.registrationUpdated, this),
				this.manager.addEventListener(xn.REGISTRATION_DELETED, this.registrationDeleted, this),
				this.securityOriginManager.addEventListener(we.SecurityOriginAdded, this.updateSectionVisibility, this),
				this.securityOriginManager.addEventListener(we.SecurityOriginRemoved, this.updateSectionVisibility, this)
			]);
		}
	}
	modelRemoved(e) {
		this.manager && this.manager === e && (yt(this.eventListeners.get(e) || []), this.eventListeners.delete(e), this.manager = null, this.securityOriginManager = null);
	}
	getTimeStamp(e) {
		let t = e.versionsByMode(), n = 0, r = t.get(hn.Modes.ACTIVE), i = t.get(hn.Modes.INSTALLING), a = t.get(hn.Modes.WAITING), o = t.get(hn.Modes.REDUNDANT);
		return r ? n = r.scriptResponseTime : a ? n = a.scriptResponseTime : i ? n = i.scriptResponseTime : o && (n = o.scriptResponseTime), n || 0;
	}
	updateSectionVisibility() {
		let e = !1, t = [];
		for (let n of this.sections.values()) {
			let r = this.getReportViewForOrigin(n.registration.securityOrigin);
			e ||= r === this.currentWorkersView, n.section.parentWidget() !== r && t.push(n);
		}
		for (let e of t) {
			let t = e.registration;
			this.removeRegistrationFromList(t), this.updateRegistration(t, !0);
		}
		this.currentWorkersView.sortSections((e, t) => {
			let n = this.sectionToRegistration.get(e), r = this.sectionToRegistration.get(t), i = n ? this.getTimeStamp(n) : 0;
			return (r ? this.getTimeStamp(r) : 0) - i;
		});
		for (let e of this.sections.values()) e.section.parentWidget() === this.currentWorkersView || this.isRegistrationVisible(e.registration) ? e.section.showWidget() : e.section.hideWidget();
		this.contentElement.classList.toggle("service-worker-has-current", !!e), this.updateListVisibility();
	}
	registrationUpdated(e) {
		this.updateRegistration(e.data), this.gcRegistrations();
	}
	gcRegistrations() {
		if (!this.manager || !this.securityOriginManager) return;
		let e = !1, t = new Set(this.securityOriginManager.securityOrigins());
		for (let n of this.manager.registrations().values()) if ((t.has(n.securityOrigin) || this.isRegistrationVisible(n)) && !n.canBeRemoved()) {
			e = !0;
			break;
		}
		if (e) for (let e of this.manager.registrations().values()) !(t.has(e.securityOrigin) || this.isRegistrationVisible(e)) && e.canBeRemoved() && this.removeRegistrationFromList(e);
	}
	getReportViewForOrigin(e) {
		return this.securityOriginManager && (this.securityOriginManager.securityOrigins().includes(e) || this.securityOriginManager.unreachableMainSecurityOrigin() === e) ? this.currentWorkersView : null;
	}
	updateRegistration(e, t) {
		let n = this.sections.get(e);
		if (!n) {
			let t = e.scopeURL, r = this.getReportViewForOrigin(e.securityOrigin);
			if (!r) return;
			let i = r.appendSection(t);
			i.setUiGroupTitle(G(W.serviceWorkerForS, { PH1: t })), this.sectionToRegistration.set(i, e), n = new bf(this.manager, i, e), this.sections.set(e, n);
		}
		t || (this.updateSectionVisibility(), n.scheduleUpdate());
	}
	registrationDeleted(e) {
		this.removeRegistrationFromList(e.data);
	}
	removeRegistrationFromList(e) {
		let t = this.sections.get(e);
		t && t.section.detach(), this.sections.delete(e), this.updateSectionVisibility();
	}
	isRegistrationVisible(e) {
		return !e.scopeURL;
	}
	updateListVisibility() {
		this.contentElement.classList.toggle("service-worker-list-empty", this.sections.size === 0);
	}
}, bf = class {
	manager;
	section;
	registration;
	fingerprint;
	pushNotificationDataSetting;
	syncTagNameSetting;
	periodicSyncTagNameSetting;
	updateCycleView;
	routerView;
	networkRequests;
	updateButton;
	deleteButton;
	sourceField;
	statusField;
	clientsField;
	clientInfoCache;
	throttler;
	updateCycleField;
	routerField;
	constructor(e, t, n) {
		this.manager = e, this.section = t, this.registration = n, this.fingerprint = null, this.pushNotificationDataSetting = m.instance().createLocalSetting("push-data", G(W.testPushMessageFromDevtools)), this.syncTagNameSetting = m.instance().createLocalSetting("sync-tag-name", "test-tag-from-devtools"), this.periodicSyncTagNameSetting = m.instance().createLocalSetting("periodic-sync-tag-name", "test-tag-from-devtools"), this.updateCycleView = new pf(n), this.routerView = new qa(), this.networkRequests = new nt(), this.networkRequests.data = {
			variant: h.TEXT,
			title: G(W.networkRequests),
			jslogContext: "show-network-requests"
		}, this.networkRequests.textContent = G(W.networkRequests), this.networkRequests.addEventListener("click", this.networkRequestsClicked.bind(this)), this.section.appendButtonToHeader(this.networkRequests), this.updateButton = vt(G(W.update), this.updateButtonClicked.bind(this), {
			variant: h.TEXT,
			title: G(W.update),
			jslogContext: "update"
		}), this.section.appendButtonToHeader(this.updateButton), this.deleteButton = vt(G(W.unregister), this.unregisterButtonClicked.bind(this), {
			variant: h.TEXT,
			title: G(W.unregisterServiceWorker),
			jslogContext: "unregister"
		}), this.section.appendButtonToHeader(this.deleteButton), this.sourceField = this.wrapWidget(this.section.appendField(G(W.source))), this.statusField = this.wrapWidget(this.section.appendField(G(W.status))), this.clientsField = this.wrapWidget(this.section.appendField(G(W.clients))), this.createSyncNotificationField(G(W.pushString), this.pushNotificationDataSetting.get(), G(W.pushData), this.push.bind(this), "push-message"), this.createSyncNotificationField(G(W.syncString), this.syncTagNameSetting.get(), G(W.syncTag), this.sync.bind(this), "sync-tag"), this.createSyncNotificationField(G(W.periodicSync), this.periodicSyncTagNameSetting.get(), G(W.periodicSyncTag), (e) => this.periodicSync(e), "periodic-sync-tag"), this.createUpdateCycleField(), this.maybeCreateRouterField(), this.clientInfoCache = /* @__PURE__ */ new Map(), this.throttler = new It(500);
	}
	createSyncNotificationField(e, t, n, r, i) {
		let a = this.wrapWidget(this.section.appendField(e)).createChild("form", "service-worker-editor-with-button"), o = Pt("source-code service-worker-notification-editor");
		o.setAttribute("jslog", `${Cn().track({ change: !0 }).context(i)}`), a.appendChild(o);
		let s = vt(e, void 0, { jslogContext: i });
		s.type = "submit", a.appendChild(s), o.value = t, o.placeholder = n, ue(o, e), a.addEventListener("submit", (e) => {
			r(o.value || ""), e.consume(!0);
		});
	}
	scheduleUpdate() {
		if (_f) {
			this.update();
			return;
		}
		this.throttler.schedule(this.update.bind(this));
	}
	addVersion(e, t, n) {
		let r = e.createChild("div", "service-worker-version");
		r.createChild("div", t);
		let i = r.createChild("span", "service-worker-version-string");
		return i.textContent = n, me(i), r;
	}
	updateClientsField(e) {
		this.clientsField.removeChildren(), this.section.setFieldVisible(G(W.clients), !!e.controlledClients.length);
		for (let t of e.controlledClients) {
			let e = this.clientsField.createChild("div", "service-worker-client"), n = this.clientInfoCache.get(t);
			n && this.updateClientInfo(e, n), this.manager.target().targetAgent().invoke_getTargetInfo({ targetId: t }).then(this.onClientInfo.bind(this, e));
		}
	}
	updateSourceField(e) {
		this.sourceField.removeChildren();
		let t = re.extractName(e.scriptURL), n = this.sourceField.createChild("div", "report-field-value-filename"), r = cr.linkifyURL(e.scriptURL, { text: t });
		if (r.tabIndex = 0, r.setAttribute("jslog", `${Pn("source-location").track({ click: !0 })}`), n.appendChild(r), this.registration.errors.length) {
			let e = Dt({
				title: String(this.registration.errors.length),
				iconName: "cross-circle-filled",
				color: "var(--icon-error)"
			});
			e.classList.add("devtools-link", "link"), e.tabIndex = 0, ue(e, G(W.sRegistrationErrors, { PH1: this.registration.errors.length })), self.onInvokeElement(e, () => ie.instance().show()), n.appendChild(e);
		}
		e.scriptResponseTime !== void 0 && (this.sourceField.createChild("div", "report-field-value-subtitle").textContent = G(W.receivedS, { PH1: (/* @__PURE__ */ new Date(e.scriptResponseTime * 1e3)).toLocaleString() }));
	}
	update() {
		let e = this.registration.fingerprint();
		if (e === this.fingerprint) return Promise.resolve();
		this.fingerprint = e, this.section.setHeaderButtonsState(this.registration.isDeleted);
		let t = this.registration.versionsByMode(), n = this.registration.scopeURL, r = this.registration.isDeleted ? G(W.sDeleted, { PH1: n }) : n;
		this.section.setTitle(r);
		let i = t.get(hn.Modes.ACTIVE), a = t.get(hn.Modes.WAITING), o = t.get(hn.Modes.INSTALLING), s = t.get(hn.Modes.REDUNDANT);
		this.statusField.removeChildren();
		let c = this.statusField.createChild("div", "service-worker-version-stack");
		if (c.createChild("div", "service-worker-version-stack-bar"), i) {
			this.updateSourceField(i);
			let e = hn.RunningStatus[i.currentState.runningStatus](), t = this.addVersion(c, "service-worker-active-circle", G(W.sActivatedAndIsS, {
				PH1: i.id,
				PH2: e
			}));
			if (i.isRunning() || i.isStarting()) {
				let e = vt(G(W.stopString), this.stopButtonClicked.bind(this, i.id), { jslogContext: "stop" });
				t.appendChild(e);
			} else if (i.isStartable()) {
				let e = vt(G(W.startString), this.startButtonClicked.bind(this), { jslogContext: "start" });
				t.appendChild(e);
			}
			this.updateClientsField(i), this.maybeCreateRouterField();
		} else s && (this.updateSourceField(s), this.addVersion(c, "service-worker-redundant-circle", G(W.sIsRedundant, { PH1: s.id })), this.updateClientsField(s));
		if (a) {
			let e = this.addVersion(c, "service-worker-waiting-circle", G(W.sWaitingToActivate, { PH1: a.id })), t = vt(d("skipWaiting"), this.skipButtonClicked.bind(this), {
				title: d("skipWaiting"),
				jslogContext: "skip-waiting"
			});
			e.appendChild(t), a.scriptResponseTime !== void 0 && (e.createChild("div", "service-worker-subtitle").textContent = G(W.receivedS, { PH1: (/* @__PURE__ */ new Date(a.scriptResponseTime * 1e3)).toLocaleString() }));
		}
		if (o) {
			let e = this.addVersion(c, "service-worker-installing-circle", G(W.sTryingToInstall, { PH1: o.id }));
			o.scriptResponseTime !== void 0 && (e.createChild("div", "service-worker-subtitle").textContent = G(W.receivedS, { PH1: (/* @__PURE__ */ new Date(o.scriptResponseTime * 1e3)).toLocaleString() }));
		}
		return this.updateCycleView.refresh(), Promise.resolve();
	}
	unregisterButtonClicked() {
		this.manager.deleteRegistration(this.registration.id);
	}
	createUpdateCycleField() {
		this.updateCycleField = this.wrapWidget(this.section.appendField(G(W.updateCycle))), this.updateCycleField.appendChild(this.updateCycleView.tableElement);
	}
	maybeCreateRouterField() {
		let e = this.registration.versionsByMode().get(hn.Modes.ACTIVE), t = G(W.routers);
		e?.routerRules && e.routerRules.length > 0 ? (this.routerField ||= this.wrapWidget(this.section.appendField(t)), this.routerField.lastElementChild || this.routerView.show(this.routerField), this.routerView.rules = e.routerRules) : (this.section.removeField(t), this.routerField = void 0);
	}
	updateButtonClicked() {
		this.manager.updateRegistration(this.registration.id);
	}
	networkRequestsClicked() {
		r(kr.filters([{
			filterType: jr.Is,
			filterValue: Ar.SERVICE_WORKER_INTERCEPTED
		}])), Nt.actionTaken(un.ServiceWorkerNetworkRequestClicked);
	}
	push(e) {
		this.pushNotificationDataSetting.set(e), this.manager.deliverPushMessage(this.registration.id, e);
	}
	sync(e) {
		this.syncTagNameSetting.set(e), this.manager.dispatchSyncEvent(this.registration.id, e, !0);
	}
	periodicSync(e) {
		this.periodicSyncTagNameSetting.set(e), this.manager.dispatchPeriodicSyncEvent(this.registration.id, e);
	}
	onClientInfo(e, t) {
		let n = t.targetInfo;
		n && (this.clientInfoCache.set(n.targetId, n), this.updateClientInfo(e, n));
	}
	updateClientInfo(e, t) {
		if (t.type !== "page" && t.type === "iframe") {
			let n = e.createChild("span", "service-worker-client-string");
			kn(n, G(W.workerS, { PH1: t.url }));
			return;
		}
		e.removeChildren();
		let n = e.createChild("span", "service-worker-client-string");
		kn(n, t.url);
		let r = new nt();
		r.data = {
			iconName: "select-element",
			variant: h.ICON,
			size: ft.SMALL,
			title: G(W.focus),
			jslogContext: "client-focus"
		}, r.className = "service-worker-client-focus-link", r.addEventListener("click", this.activateTarget.bind(this, t.targetId)), e.appendChild(r);
	}
	activateTarget(e) {
		this.manager.target().targetAgent().invoke_activateTarget({ targetId: e });
	}
	startButtonClicked() {
		this.manager.startWorker(this.registration.scopeURL);
	}
	skipButtonClicked() {
		this.manager.skipWaiting(this.registration.scopeURL);
	}
	stopButtonClicked(e) {
		this.manager.stopWorker(e);
	}
	wrapWidget(e) {
		let t = Tn(e, { cssFile: [sf, cf] }), n = document.createElement("div");
		return t.appendChild(n), n;
	}
}, xf = "/*\n * Copyright 2022 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\ndevtools-shared-storage-access-grid {\n  overflow: auto;\n}\n", Sf = /* @__PURE__ */ e({ SharedStorageEventsView: () => Df }), Cf = {
	noEventSelected: "No shared storage event selected",
	clickToDisplayBody: "Click on any shared storage event to display the event parameters"
}, wf = s("panels/application/SharedStorageEventsView.ts", Cf), Tf = a.bind(void 0, wf);
function Ef(e, t) {
	return JSON.stringify(e) === JSON.stringify(t);
}
var Df = class extends it {
	#e = new ro();
	#t = [];
	#n;
	#r = "";
	constructor() {
		super(!1, !0), this.element.setAttribute("jslog", `${D("shared-storage-events")}`), this.#n = new Ae(Tf(Cf.noEventSelected), Tf(Cf.clickToDisplayBody)), this.#n.setMinimumSize(0, 40), this.#e.setMinimumSize(0, 80), this.#e.onSelect = this.#o.bind(this), this.setMainWidget(this.#e), this.setSidebarWidget(this.#n), this.hideSidebar(), this.#i()?.addEventListener(g.PrimaryPageChanged, this.clearEvents, this);
	}
	#i() {
		return C.instance().primaryPageTarget()?.model(qe) || null;
	}
	#a() {
		return this.#i()?.mainFrame || null;
	}
	get id() {
		return this.#a()?.id || this.#r;
	}
	wasShown() {
		super.wasShown();
		let e = this.sidebarWidget();
		e && e.registerRequiredCSS(xf);
	}
	addEvent(e) {
		e.mainFrameId === this.id && (this.#t.some((t) => Ef(t, e)) || (this.showMode() !== ut.BOTH && this.showBoth(), this.#t.push(e), this.#e.events = this.#t));
	}
	clearEvents() {
		this.#t = [], this.#e.events = this.#t, this.setSidebarWidget(this.#n), this.hideSidebar();
	}
	#o(e) {
		let t = Gr.createViewSync(e);
		t.setMinimumSize(0, 40), this.setSidebarWidget(t);
	}
	setDefaultIdForTesting(e) {
		this.#r = e;
	}
	getEventsForTesting() {
		return this.#t;
	}
	getSharedStorageAccessGridForTesting() {
		return this.#e;
	}
}, Of = /* @__PURE__ */ e({ SharedStorageListTreeElement: () => Mf }), kf = { sharedStorage: "Shared storage" }, Af = s("panels/application/SharedStorageListTreeElement.ts", kf), jf = a.bind(void 0, Af), Mf = class extends A {
	#e;
	view;
	constructor(e, t = !1) {
		super(e, jf(kf.sharedStorage), !1, "shared-storage"), this.#e = m.instance().createSetting("resources-shared-storage-expanded", t);
		let n = v("database");
		this.setLeadingIcons([n]), this.view = new Df();
	}
	get itemURL() {
		return "shared-storage://";
	}
	onselect(e) {
		return super.onselect(e), this.resourcesPanel.showView(this.view), !1;
	}
	onattach() {
		super.onattach(), this.#e.get() && this.expand();
	}
	onexpand() {
		this.#e.set(!0);
	}
	oncollapse() {
		this.#e.set(!1);
	}
	addEvent(e) {
		this.view.addEvent(e);
	}
}, Nf = /* @__PURE__ */ e({
	Events: () => If,
	SharedStorageForOrigin: () => Pf,
	SharedStorageModel: () => Ff
}), Pf = class extends c {
	#e;
	#t;
	constructor(e, t) {
		super(), this.#e = e, this.#t = t;
	}
	get securityOrigin() {
		return this.#t;
	}
	async getMetadata() {
		return await this.#e.storageAgent.invoke_getSharedStorageMetadata({ ownerOrigin: this.securityOrigin }).then(({ metadata: e }) => e);
	}
	async getEntries() {
		return await this.#e.storageAgent.invoke_getSharedStorageEntries({ ownerOrigin: this.securityOrigin }).then(({ entries: e }) => e);
	}
	async setEntry(e, t, n) {
		await this.#e.storageAgent.invoke_setSharedStorageEntry({
			ownerOrigin: this.securityOrigin,
			key: e,
			value: t,
			ignoreIfPresent: n
		});
	}
	async deleteEntry(e) {
		await this.#e.storageAgent.invoke_deleteSharedStorageEntry({
			ownerOrigin: this.securityOrigin,
			key: e
		});
	}
	async clear() {
		await this.#e.storageAgent.invoke_clearSharedStorageEntries({ ownerOrigin: this.securityOrigin });
	}
	async resetBudget() {
		await this.#e.storageAgent.invoke_resetSharedStorageBudget({ ownerOrigin: this.securityOrigin });
	}
};
(function(e) {
	e.Events = /* @__PURE__ */ function(e) {
		return e.SHARED_STORAGE_CHANGED = "SharedStorageChanged", e;
	}({});
})(Pf ||= {});
var Ff = class extends Et {
	#e;
	#t;
	storageAgent;
	#n;
	constructor(e) {
		super(e), e.registerStorageDispatcher(this), this.#e = e.model(at), this.#t = /* @__PURE__ */ new Map(), this.storageAgent = e.storageAgent(), this.#n = !1;
	}
	async enable() {
		this.#n ||= (this.#e.addEventListener(we.SecurityOriginAdded, this.#a, this), this.#e.addEventListener(we.SecurityOriginRemoved, this.#s, this), await this.storageAgent.invoke_setSharedStorageTracking({ enable: !0 }), this.#r(), !0);
	}
	disable() {
		this.#n &&= (this.#e.removeEventListener(we.SecurityOriginAdded, this.#a, this), this.#e.removeEventListener(we.SecurityOriginRemoved, this.#s, this), this.storageAgent.invoke_setSharedStorageTracking({ enable: !1 }), this.#i(), !1);
	}
	dispose() {
		this.disable();
	}
	#r() {
		for (let e of this.#e.securityOrigins()) this.#o(e);
	}
	#i() {
		for (let e of this.#t.keys()) this.#c(e);
	}
	#a(e) {
		this.#o(e.data);
	}
	#o(e) {
		let t = new re(e);
		if (!t.isValid || t.scheme === "data" || t.scheme === "about" || t.scheme === "javascript" || this.#t.has(e)) return;
		let n = new Pf(this, e);
		this.#t.set(e, n), this.dispatchEventToListeners("SharedStorageAdded", n);
	}
	#s(e) {
		this.#c(e.data);
	}
	#c(e) {
		let t = this.storageForOrigin(e);
		t && (this.#t.delete(e), this.dispatchEventToListeners("SharedStorageRemoved", t));
	}
	storages() {
		return this.#t.values();
	}
	storageForOrigin(e) {
		return this.#t.get(e) || null;
	}
	numStoragesForTesting() {
		return this.#t.size;
	}
	isChangeEvent(e) {
		return [
			k.SharedStorageAccessMethod.Set,
			k.SharedStorageAccessMethod.Append,
			k.SharedStorageAccessMethod.Delete,
			k.SharedStorageAccessMethod.Clear
		].includes(e.method);
	}
	sharedStorageAccessed(e) {
		if (this.isChangeEvent(e)) {
			let t = this.storageForOrigin(e.ownerOrigin);
			if (t) {
				let n = {
					accessTime: e.accessTime,
					method: e.method,
					mainFrameId: e.mainFrameId,
					ownerSite: e.ownerSite,
					params: e.params,
					scope: e.scope
				};
				t.dispatchEventToListeners(Pf.Events.SHARED_STORAGE_CHANGED, n);
			} else this.#o(e.ownerOrigin);
		}
		this.dispatchEventToListeners("SharedStorageAccess", e);
	}
	sharedStorageWorkletOperationExecutionFinished(e) {}
	indexedDBListUpdated(e) {}
	indexedDBContentUpdated(e) {}
	cacheStorageListUpdated(e) {}
	cacheStorageContentUpdated(e) {}
	interestGroupAccessed(e) {}
	interestGroupAuctionEventOccurred(e) {}
	interestGroupAuctionNetworkRequestCreated(e) {}
	storageBucketCreatedOrUpdated(e) {}
	storageBucketDeleted(e) {}
};
Et.register(Ff, {
	capabilities: Me.STORAGE,
	autostart: !1
});
var If = /* @__PURE__ */ function(e) {
	return e.SHARED_STORAGE_ACCESS = "SharedStorageAccess", e.SHARED_STORAGE_ADDED = "SharedStorageAdded", e.SHARED_STORAGE_REMOVED = "SharedStorageRemoved", e;
}({}), Lf = /* @__PURE__ */ e({
	DEFAULT_VIEW: () => Uf,
	StorageItemsToolbar: () => Wf
}), Rf = {
	refresh: "Refresh",
	clearAll: "Clear All",
	deleteSelected: "Delete Selected",
	refreshedStatus: "Table refreshed"
}, zf = s("panels/application/StorageItemsToolbar.ts", Rf), Bf = a.bind(void 0, zf), { html: Vf, render: Hf } = Ie, Uf = (e, t, n) => {
	Hf(Vf`
      <devtools-toolbar class="top-resources-toolbar"
                        jslog=${Qt()}>
        <devtools-button title=${Bf(Rf.refresh)}
                         jslog=${Bt("storage-items-view.refresh").track({ click: !0 })}
                         @click=${e.onRefresh}
                         .iconName=${"refresh"}
                         .variant=${h.TOOLBAR}></devtools-button>
        <devtools-toolbar-input type="filter"
                                ?disabled=${!e.filterItemEnabled}
                                @change=${e.onFilterChanged}
                                style="flex-grow:0.4"></devtools-toolbar-input>
        ${new cn().element}
        <devtools-button title=${e.deleteAllButtonTitle}
                         @click=${e.onDeleteAll}
                         id=storage-items-delete-all
                         ?disabled=${!e.deleteAllButtonEnabled}
                         jslog=${Bt("storage-items-view.clear-all").track({ click: !0 })}
                         .iconName=${e.deleteAllButtonIconName}
                         .variant=${h.TOOLBAR}></devtools-button>
        <devtools-button title=${Bf(Rf.deleteSelected)}
                         @click=${e.onDeleteSelected}
                         ?disabled=${!e.deleteSelectedButtonDisabled}
                         jslog=${Bt("storage-items-view.delete-selected").track({ click: !0 })}
                         .iconName=${"cross"}
                         .variant=${h.TOOLBAR}></devtools-button>
        ${e.mainToolbarItems.map((e) => e.element)}
      </devtools-toolbar>
      ${e.metadataView}`, n);
}, Wf = class e extends t(S) {
	filterRegex;
	#e;
	#t;
	#n = !0;
	#r = !0;
	#i = !0;
	#a = "clear";
	#o = Bf(Rf.clearAll);
	#s = [];
	constructor(e, t = Uf) {
		super(e), this.#t = t, this.filterRegex = null;
	}
	set metadataView(e) {
		this.#e = e;
	}
	get metadataView() {
		return this.#e ||= new fo(), this.#e;
	}
	performUpdate() {
		let t = {
			deleteAllButtonEnabled: this.#n,
			deleteSelectedButtonDisabled: this.#r,
			filterItemEnabled: this.#i,
			deleteAllButtonIconName: this.#a,
			deleteAllButtonTitle: this.#o,
			mainToolbarItems: this.#s,
			metadataView: this.metadataView,
			onFilterChanged: this.filterChanged.bind(this),
			onRefresh: () => {
				this.dispatchEventToListeners(e.Events.REFRESH), Ke.alert(Bf(Rf.refreshedStatus));
			},
			onDeleteAll: () => {
				this.dispatchEventToListeners(e.Events.DELETE_ALL);
			},
			onDeleteSelected: () => {
				this.dispatchEventToListeners(e.Events.DELETE_SELECTED);
			}
		};
		this.#t(t, {}, this.contentElement);
	}
	setDeleteAllTitle(e) {
		this.#o = e, this.requestUpdate();
	}
	setDeleteAllGlyph(e) {
		this.#a = e, this.requestUpdate();
	}
	appendToolbarItem(e) {
		this.#s.push(e), this.requestUpdate();
	}
	setStorageKey(e) {
		this.metadataView.setStorageKey(e);
	}
	filterChanged({ detail: t }) {
		this.filterRegex = t ? new RegExp(Jn(t), "i") : null, this.dispatchEventToListeners(e.Events.REFRESH);
	}
	hasFilter() {
		return !!this.filterRegex;
	}
	setCanDeleteAll(e) {
		this.#n = e, this.requestUpdate();
	}
	setCanDeleteSelected(e) {
		this.#r = e, this.requestUpdate();
	}
	setCanFilter(e) {
		this.#i = e, this.requestUpdate();
	}
};
(function(e) {
	e.Events = /* @__PURE__ */ function(e) {
		return e.REFRESH = "Refresh", e.FILTER_CHANGED = "FilterChanged", e.DELETE_ALL = "DeleteAll", e.DELETE_SELECTED = "DeleteSelected", e;
	}({});
})(Wf ||= {});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/application/KeyValueStorageItemsView.ts
var Gf = /* @__PURE__ */ e({ KeyValueStorageItemsView: () => np }), { ARIAUtils: Kf } = yn, { EmptyWidget: qf } = Ue, { VBox: Jf, widget: Yf } = Wt, { Size: Xf } = dn, { repeat: Zf } = et, Qf = {
	noPreviewSelected: "No value selected",
	selectAValueToPreview: "Select a value to preview",
	numberEntries: "Number of entries shown in table: {PH1}",
	key: "Key",
	value: "Value"
}, $f = s("panels/application/KeyValueStorageItemsView.ts", Qf), ep = a.bind(void 0, $f), tp = 4096, np = class extends S {
	#e;
	#t;
	#n = [];
	#r = null;
	#i;
	#a = !0;
	#o;
	#s;
	metadataView;
	#c;
	#l;
	constructor(e, t, n, r, i, a, o) {
		i ??= new fo(), r ||= (e, n, r) => {
			_(y`
            <devtools-widget
              ${Yf(Wf, { metadataView: i })}
              class=flex-none
              @Refresh=${e.onRefresh}
              @DeleteAll=${e.onDeleteAll}
              @DeleteSelected=${e.onDeleteSelected}
              ${Ct(Wf, (e) => {
				n.toolbar = e;
			})}
            ></devtools-widget>
            <devtools-split-view sidebar-position="second" name="${t}-split-view-state">
               <devtools-widget
                  slot="main"
                  ${Yf(Jf, { minimumSize: new Xf(0, 50) })}>
                <devtools-data-grid
                  .name=${`${t}-datagrid-with-preview`}
                  striped
                  style="flex: auto"
                  @sort=${(t) => e.onSort(t.detail.ascending)}
                  @refresh=${e.onRefresh}
                  @create=${(t) => e.onCreate(t.detail.key, t.detail.value)}
                  @deselect=${() => e.onSelect(null)}
                >
                  <table>
                    <tr>
                      <th id="key" sortable ?editable=${e.editable}>
                        ${ep(Qf.key)}
                      </th>
                      <th id="value" ?editable=${e.editable}>
                        ${ep(Qf.value)}
                      </th>
                    </tr>
                    ${Zf(e.items, (e) => e.key, (t) => y`
                      <tr data-key=${t.key} data-value=${t.value}
                          @select=${() => e.onSelect(t)}
                          @edit=${(n) => e.onEdit(t.key, t.value, n.detail.columnId, n.detail.valueBeforeEditing, n.detail.newText)}
                          @delete=${() => e.onDelete(t.key)}
                          selected=${e.selectedKey === t.key || b}>
                        <td>${t.key}</td>
                        <td>${t.value.substr(0, tp)}</td>
                      </tr>`)}
                      <tr placeholder></tr>
                  </table>
                </devtools-data-grid>
              </devtools-widget>
              <devtools-widget
                  slot="sidebar"
                  ${Yf(Jf, { minimumSize: new Xf(0, 50) })}
                  jslog=${D("preview").track({ resize: !0 })}>
               ${e.preview?.element}
              </devtools-widget>
            </devtools-split-view>`, r, { container: {
				attributes: { jslog: e.jslog },
				classes: e.classes
			} });
		}, super(), this.metadataView = i, this.#o = n, this.#c = a, this.#l = o, this.#i = r, this.performUpdate(), this.#e = new qf(ep(Qf.noPreviewSelected), ep(Qf.selectAValueToPreview)), this.#t = null, this.showPreview(null, null);
	}
	wasShown() {
		super.wasShown(), this.refreshItems();
	}
	performUpdate() {
		let e = this, t = { set toolbar(t) {
			e.#s = t;
		} }, n = {
			items: this.#n,
			selectedKey: this.#r,
			editable: this.#o,
			preview: this.#e,
			jslog: this.#c,
			classes: this.#l,
			onSelect: (e) => {
				this.#s?.setCanDeleteSelected(!!e), e ? this.#m(e) : this.#m(null), this.selectedItemChanged(e);
			},
			onSort: (e) => {
				this.#a = e;
			},
			onCreate: (e, t) => {
				this.#u(e, t);
			},
			onEdit: (e, t, n, r, i) => {
				this.#d(e, t, n, r, i);
			},
			onDelete: (e) => {
				this.#p(e);
			},
			onDeleteSelected: () => {
				this.deleteSelectedItem();
			},
			onDeleteAll: () => {
				this.deleteAllItems();
			},
			onRefresh: () => {
				this.refreshItems();
			}
		};
		this.#i(n, t, this.contentElement);
	}
	get toolbar() {
		return this.#s;
	}
	refreshItems() {}
	deleteAllItems() {}
	itemsCleared() {
		this.#n = [], this.performUpdate(), this.#s?.setCanDeleteSelected(!1);
	}
	itemRemoved(e) {
		let t = this.#n.findIndex((t) => t.key === e);
		t !== -1 && (this.#n.splice(t, 1), this.performUpdate(), this.#s?.setCanDeleteSelected(this.#n.length > 1));
	}
	itemAdded(e, t) {
		this.#n.some((t) => t.key === e) || (this.#n.push({
			key: e,
			value: t
		}), this.performUpdate());
	}
	itemUpdated(e, t) {
		let n = this.#n.find((t) => t.key === e);
		n && n.value !== t && (n.value = t, this.performUpdate(), this.#r === e && (this.#t !== t && this.#m({
			key: e,
			value: t
		}), this.#s?.setCanDeleteSelected(!0)));
	}
	showItems(e) {
		let t = this.#a ? 1 : -1;
		this.#n = [...e].sort((e, n) => t * (e.key > n.key ? 1 : -1));
		let n = this.#n.find((e) => e.key === this.#r);
		n ? this.#m(n) : this.#r = null, this.performUpdate(), this.#s?.setCanDeleteSelected(!!this.#r), Kf.LiveAnnouncer.alert(ep(Qf.numberEntries, { PH1: this.#n.length }));
	}
	deleteSelectedItem() {
		this.#r && this.#p(this.#r);
	}
	#u(e, t) {
		this.setItem(e, t), this.#f(e, t), this.#m({
			key: e,
			value: t
		});
	}
	isEditAllowed(e, t, n) {
		return !0;
	}
	#d(e, t, n, r, i) {
		this.isEditAllowed(n, r, i) && (n === "key" ? (typeof r == "string" && this.removeItem(r), this.setItem(i, t), this.#f(i, t), this.#m({
			key: i,
			value: t
		})) : (this.setItem(e, i), this.#m({
			key: e,
			value: i
		})));
	}
	#f(e, t) {
		for (let n = this.#n.length - 1; n >= 0; --n) {
			let r = this.#n[n];
			r.key === e && t !== r.value && this.#n.splice(n, 1);
		}
	}
	#p(e) {
		this.removeItem(e);
	}
	showPreview(e, t) {
		this.#e && this.#t === t || (this.#e && this.#e.detach(), e ||= new qf(ep(Qf.noPreviewSelected), ep(Qf.selectAValueToPreview)), this.#t = t, this.#e = e, this.performUpdate());
	}
	async #m(e) {
		if (e?.value) {
			this.#r = e.key;
			let t = await this.createPreview(e.key, e.value);
			this.#r === e.key && this.showPreview(t, e.value);
		} else this.#r = null, this.showPreview(null, null);
	}
	set editable(e) {
		this.#o = e, this.performUpdate();
	}
	keys() {
		return this.#n.map((e) => e.key);
	}
	selectedItemChanged(e) {}
}, rp = /* @__PURE__ */ e({
	SharedStorageItemsDispatcher: () => sp,
	SharedStorageItemsView: () => cp
}), ip = {
	sharedStorage: "Shared storage",
	sharedStorageItemsCleared: "Shared Storage items cleared",
	sharedStorageFilteredItemsCleared: "Shared Storage filtered items cleared",
	sharedStorageItemDeleted: "The storage item was deleted.",
	sharedStorageItemEdited: "The storage item was edited.",
	sharedStorageItemEditCanceled: "The storage item edit was canceled."
}, ap = s("panels/application/SharedStorageItemsView.ts", ip), op = a.bind(void 0, ap), sp;
(function(e) {
	e.Events = /* @__PURE__ */ function(e) {
		return e.FILTERED_ITEMS_CLEARED = "FilteredItemsCleared", e.ITEM_DELETED = "ItemDeleted", e.ITEM_EDITED = "ItemEdited", e.ITEMS_CLEARED = "ItemsCleared", e.ITEMS_REFRESHED = "ItemsRefreshed", e;
	}({});
})(sp ||= {});
var cp = class e extends np {
	#e;
	sharedStorageItemsDispatcher;
	constructor(e, t) {
		super(op(ip.sharedStorage), "shared-storage-items-view", !0, t, new vo(e, e.securityOrigin)), this.#e = e, this.performUpdate(), this.#e.addEventListener(Pf.Events.SHARED_STORAGE_CHANGED, this.#t, this), this.sharedStorageItemsDispatcher = new c();
	}
	static async createView(t, n) {
		let r = new e(t, n);
		return await r.updateEntriesOnly(), r;
	}
	async updateEntriesOnly() {
		let e = await this.#e.getEntries();
		e && this.#n(e);
	}
	async #t() {
		await this.refreshItems();
	}
	async refreshItems() {
		await this.metadataView?.render(), await this.updateEntriesOnly(), this.sharedStorageItemsDispatcher.dispatchEventToListeners(sp.Events.ITEMS_REFRESHED);
	}
	async deleteAllItems() {
		if (!this.toolbar?.hasFilter()) {
			await this.#e.clear(), await this.refreshItems(), this.sharedStorageItemsDispatcher.dispatchEventToListeners(sp.Events.ITEMS_CLEARED), Ke.alert(op(ip.sharedStorageItemsCleared));
			return;
		}
		await Promise.all(this.keys().map((e) => this.#e.deleteEntry(e))), await this.refreshItems(), this.sharedStorageItemsDispatcher.dispatchEventToListeners(sp.Events.FILTERED_ITEMS_CLEARED), Ke.alert(op(ip.sharedStorageFilteredItemsCleared));
	}
	isEditAllowed(e, t, n) {
		return e === "key" && n === "" ? (this.refreshItems().then(() => {
			Ke.alert(op(ip.sharedStorageItemEditCanceled));
		}), !1) : !0;
	}
	async setItem(e, t) {
		await this.#e.setEntry(e, t, !1), await this.refreshItems(), this.sharedStorageItemsDispatcher.dispatchEventToListeners(sp.Events.ITEM_EDITED), Ke.alert(op(ip.sharedStorageItemEdited));
	}
	#n(e) {
		if (this.toolbar) {
			let t = e.filter((e) => this.toolbar?.filterRegex?.test(`${e.key} ${e.value}`) ?? !0);
			this.showItems(t);
		}
	}
	async removeItem(e) {
		await this.#e.deleteEntry(e), await this.refreshItems(), this.sharedStorageItemsDispatcher.dispatchEventToListeners(sp.Events.ITEM_DELETED, { key: e }), Ke.alert(op(ip.sharedStorageItemDeleted));
	}
	async createPreview(e, t) {
		let n = e && {
			key: e,
			value: t || ""
		};
		return Gr.createViewSync(n);
	}
}, lp = /* @__PURE__ */ e({ SharedStorageTreeElement: () => up }), up = class e extends A {
	view;
	constructor(e, t) {
		super(e, t.securityOrigin, !1, "shared-storage-instance");
	}
	static async createElement(t, n) {
		let r = new e(t, n);
		r.view = await cp.createView(n), r.view.element.setAttribute("jslog", `${D("shared-storage-data")}`);
		let i = v("database");
		return r.setLeadingIcons([i]), r;
	}
	get itemURL() {
		return "shared-storage://";
	}
	onselect(e) {
		return super.onselect(e), this.resourcesPanel.showView(this.view), !1;
	}
}, dp = /* @__PURE__ */ e({
	StorageBucketsTreeElement: () => gp,
	StorageBucketsTreeParentElement: () => hp,
	i18nString: () => mp
}), fp = {
	storageBuckets: "Storage buckets",
	noStorageBuckets: "No storage buckets detected",
	storageBucketsDescription: "On this page you can view and delete storage buckets, and their associated `Storage APIs`."
}, pp = s("panels/application/StorageBucketsTreeElement.ts", fp), mp = a.bind(void 0, pp), hp = class extends si {
	bucketTreeElements = /* @__PURE__ */ new Set();
	constructor(e) {
		super(e, mp(fp.storageBuckets), mp(fp.noStorageBuckets), mp(fp.storageBucketsDescription), "storage-buckets");
		let t = v("bucket");
		this.setLeadingIcons([t]), this.setLink("https://github.com/WICG/storage-buckets/blob/gh-pages/explainer.md");
	}
	initialize() {
		C.instance().addModelListener(vn, ln.BUCKET_ADDED, this.bucketAdded, this), C.instance().addModelListener(vn, ln.BUCKET_REMOVED, this.bucketRemoved, this), C.instance().addModelListener(vn, ln.BUCKET_CHANGED, this.bucketChanged, this);
		for (let e of C.instance().models(vn)) {
			let t = e.getBuckets();
			for (let n of t) this.addBucketTreeElement(e, n);
		}
	}
	removeBucketsForModel(e) {
		for (let t of this.bucketTreeElements) t.model === e && this.removeBucketTreeElement(t);
	}
	bucketAdded({ data: { model: e, bucketInfo: t } }) {
		this.addBucketTreeElement(e, t);
	}
	bucketRemoved({ data: { model: e, bucketInfo: t } }) {
		let n = this.getBucketTreeElement(e, t);
		n && this.removeBucketTreeElement(n);
	}
	bucketChanged({ data: { model: e, bucketInfo: t } }) {
		let n = this.getBucketTreeElement(e, t);
		n && (n.bucketInfo = t);
	}
	addBucketTreeElement(e, t) {
		if (t.bucket.name === void 0) return;
		let n = new gp(this.resourcesPanel, e, t);
		this.bucketTreeElements.add(n), this.appendChild(n), n.initialize();
	}
	removeBucketTreeElement(e) {
		this.removeChild(e), this.bucketTreeElements.delete(e), this.setExpandable(this.bucketTreeElements.size > 0);
	}
	get itemURL() {
		return "storage-buckets-group://";
	}
	getBucketTreeElement(e, { bucket: { storageKey: t, name: n } }) {
		for (let r of this.bucketTreeElements) if (r.model === e && r.bucketInfo.bucket.storageKey === t && r.bucketInfo.bucket.name === n) return r;
		return null;
	}
}, gp = class extends si {
	storageBucketInfo;
	bucketModel;
	view;
	constructor(e, t, n) {
		let { bucket: r } = n, { origin: i } = pn(n.bucket.storageKey);
		super(e, `${r.name} - ${i}`, "", "", "storage-bucket"), this.bucketModel = t, this.storageBucketInfo = n;
		let a = v("database");
		this.setLeadingIcons([a]);
	}
	initialize() {
		let { bucket: e } = this.bucketInfo, t = new gm(this.resourcesPanel, e);
		this.appendChild(t);
		let n = new af(this.resourcesPanel, e);
		this.appendChild(n), n.initialize();
	}
	get itemURL() {
		let { bucket: e } = this.bucketInfo;
		return `storage-buckets-group://${e.name}/${e.storageKey}`;
	}
	get model() {
		return this.bucketModel;
	}
	get bucketInfo() {
		return this.storageBucketInfo;
	}
	set bucketInfo(e) {
		this.storageBucketInfo = e, this.view && this.view.getComponent().setStorageBucket(this.storageBucketInfo);
	}
	onselect(e) {
		return super.onselect(e), this.view || (this.view = oi(tn, new fo()), this.view.getComponent().enableStorageBucketControls(this.model), this.view.getComponent().setStorageBucket(this.storageBucketInfo)), this.showView(this.view), !1;
	}
}, _p = "/*\n * Copyright 2016 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.report-row {\n  display: flex;\n  align-items: center;\n  white-space: normal;\n\n  &:has(.quota-override-error:empty) {\n    margin: 0;\n  }\n}\n\n.clear-storage-button .report-row {\n  display: flex;\n}\n\n.link {\n  margin-left: 10px;\n  display: none;\n}\n\n.report-row:hover .link {\n  display: inline;\n}\n\n.quota-override-editor-with-button {\n  align-items: baseline;\n  display: flex;\n}\n\n.quota-override-notification-editor {\n  border: solid 1px var(--sys-color-neutral-outline);\n  border-radius: 4px;\n  display: flex;\n  flex: auto;\n  margin-right: 4px;\n  max-width: 200px;\n  min-width: 50px;\n  min-height: 19px;\n  padding-left: 4px;\n\n  &:focus {\n    border-color: var(--sys-color-state-focus-ring);\n  }\n\n  &:hover:not(:focus) {\n    background-color: var(--sys-color-state-hover-on-subtle);\n  }\n}\n\n.quota-override-error:not(:empty) {\n  padding-top: 10px;\n  color: var(--sys-color-error);\n}\n\n.usage-breakdown-row {\n  min-width: fit-content;\n}\n\n.clear-storage-container {\n  overflow: auto;\n}\n\n.clear-storage-header {\n  min-width: 400px;\n}\n\n.report-content-box {\n  overflow: initial;\n}\n\n.include-third-party-cookies {\n  flex: 1;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  margin-left: 10px;\n}\n", vp = /* @__PURE__ */ e({
	ActionDelegate: () => Sp,
	AllStorageTypes: () => xp,
	StorageView: () => bp
}), K = {
	storageQuotaUsed: "{PH1} used out of {PH2} storage quota",
	storageQuotaUsedWithBytes: "{PH1} bytes used out of {PH2} bytes storage quota",
	storageWithCustomMarker: "{PH1} (custom)",
	storageTitle: "Storage",
	usage: "Usage",
	mb: "MB",
	learnMore: "Learn more",
	clearSiteData: "Clear site data",
	SiteDataCleared: "Site data cleared",
	application: "Application",
	unregisterServiceWorker: "Unregister service workers",
	localAndSessionStorage: "Local and session storage",
	indexDB: "IndexedDB",
	cookies: "Cookies",
	cacheStorage: "Cache storage",
	includingThirdPartyCookies: "including third-party cookies",
	sFailedToLoad: "{PH1} (failed to load)",
	internalError: "Internal error",
	pleaseEnterANumber: "Please enter a number",
	numberMustBeNonNegative: "Number must be non-negative",
	numberMustBeSmaller: "Number must be smaller than {PH1}",
	clearing: "Clearing…",
	storageQuotaIsLimitedIn: "Storage quota is limited in Incognito mode",
	fileSystem: "File System",
	other: "Other",
	storageUsage: "Storage usage",
	serviceWorkers: "Service workers",
	simulateCustomStorage: "Simulate custom storage quota"
}, yp = s("panels/application/StorageView.ts", K), q = a.bind(void 0, yp), bp = class e extends S {
	pieColors;
	reportView;
	target;
	securityOrigin;
	storageKey;
	settings;
	includeThirdPartyCookiesSetting;
	quotaRow;
	quotaUsage;
	pieChart;
	previousOverrideFieldValue;
	quotaOverrideCheckbox;
	quotaOverrideControlRow;
	quotaOverrideEditor;
	quotaOverrideErrorMessage;
	clearButton;
	throttler = new It(1e3);
	constructor() {
		super({ useShadowDom: !0 }), this.registerRequiredCSS(_p), this.contentElement.classList.add("clear-storage-container"), this.contentElement.setAttribute("jslog", `${D("clear-storage")}`), this.pieColors = /* @__PURE__ */ new Map([
			[k.StorageType.Cache_storage, "rgb(229, 113, 113)"],
			[k.StorageType.Cookies, "rgb(239, 196, 87)"],
			[k.StorageType.Indexeddb, "rgb(155, 127, 230)"],
			[k.StorageType.Local_storage, "rgb(116, 178, 102)"],
			[k.StorageType.Service_workers, "rgb(255, 167, 36)"]
		]), this.reportView = new An(q(K.storageTitle)), this.reportView.registerRequiredCSS(_p), this.reportView.element.classList.add("clear-storage-header"), this.reportView.show(this.contentElement), this.target = null, this.securityOrigin = null, this.storageKey = null, this.settings = /* @__PURE__ */ new Map();
		for (let e of xp) this.settings.set(e, m.instance().createSetting("clear-storage-" + Xn(e), !0));
		this.includeThirdPartyCookiesSetting = m.instance().createSetting("clear-storage-include-third-party-cookies", !1);
		let e = this.reportView.appendSection("", "clear-storage-button").appendRow();
		this.clearButton = vt(q(K.clearSiteData), this.clear.bind(this), { jslogContext: "storage.clear-site-data" }), this.clearButton.id = "storage-view-clear-button", e.appendChild(this.clearButton);
		let t = Rr(q(K.includingThirdPartyCookies), this.includeThirdPartyCookiesSetting);
		t.classList.add("include-third-party-cookies"), e.appendChild(t);
		let n = this.reportView.appendSection(q(K.usage));
		n.element.setAttribute("jslog", `${T("usage")}`), this.quotaRow = n.appendSelectableRow(), this.quotaRow.classList.add("quota-usage-row");
		let r = n.appendRow(), i = Zt.create("https://developer.chrome.com/docs/devtools/progressive-web-apps#opaque-responses", q(K.learnMore), void 0, "learn-more");
		r.appendChild(i), this.quotaUsage = null, this.pieChart = new Jr(), this.populatePieChart(0, []);
		let a = n.appendRow();
		a.classList.add("usage-breakdown-row"), a.appendChild(this.pieChart), this.previousOverrideFieldValue = "";
		let o = n.appendRow();
		o.classList.add("quota-override-row"), this.quotaOverrideCheckbox = Xe.create(q(K.simulateCustomStorage), !1), this.quotaOverrideCheckbox.setAttribute("jslog", `${Ft("simulate-custom-quota").track({ change: !0 })}`), o.appendChild(this.quotaOverrideCheckbox), this.quotaOverrideCheckbox.addEventListener("click", this.onClickCheckbox.bind(this), !1), this.quotaOverrideControlRow = n.appendRow(), this.quotaOverrideEditor = this.quotaOverrideControlRow.createChild("input", "quota-override-notification-editor"), this.quotaOverrideEditor.setAttribute("placeholder", q(K.pleaseEnterANumber)), this.quotaOverrideEditor.setAttribute("jslog", `${Cn("quota-override").track({ change: !0 })}`), this.quotaOverrideControlRow.appendChild(fn(q(K.mb))), this.quotaOverrideControlRow.classList.add("hidden"), this.quotaOverrideEditor.addEventListener("keyup", (e) => {
			e.key === "Enter" && (this.applyQuotaOverrideFromInputField(), e.consume(!0));
		}), this.quotaOverrideEditor.addEventListener("focusout", (e) => {
			this.applyQuotaOverrideFromInputField(), e.consume(!0);
		});
		let s = n.appendRow();
		this.quotaOverrideErrorMessage = s.createChild("div", "quota-override-error");
		let c = this.reportView.appendSection(q(K.application));
		c.element.setAttribute("jslog", `${T("application")}`), this.appendItem(c, q(K.unregisterServiceWorker), k.StorageType.Service_workers), c.markFieldListAsGroup();
		let l = this.reportView.appendSection(q(K.storageTitle));
		l.element.setAttribute("jslog", `${T("storage")}`), this.appendItem(l, q(K.localAndSessionStorage), k.StorageType.Local_storage), this.appendItem(l, q(K.indexDB), k.StorageType.Indexeddb), this.appendItem(l, q(K.cookies), k.StorageType.Cookies), this.appendItem(l, q(K.cacheStorage), k.StorageType.Cache_storage), l.markFieldListAsGroup(), C.instance().observeTargets(this);
	}
	appendItem(e, t, n) {
		let r = e.appendRow(), i = this.settings.get(n);
		i && r.appendChild(Rr(t, i));
	}
	targetAdded(e) {
		if (e !== C.instance().primaryPageTarget()) return;
		this.target = e;
		let t = e.model(at);
		this.updateOrigin(t.mainSecurityOrigin(), t.unreachableMainSecurityOrigin()), t.addEventListener(we.MainSecurityOriginChanged, this.originChanged, this);
		let n = e.model(Oe);
		this.updateStorageKey(n.mainStorageKey()), n.addEventListener($e.MAIN_STORAGE_KEY_CHANGED, this.storageKeyChanged, this);
	}
	targetRemoved(e) {
		this.target === e && (e.model(at).removeEventListener(we.MainSecurityOriginChanged, this.originChanged, this), e.model(Oe).removeEventListener($e.MAIN_STORAGE_KEY_CHANGED, this.storageKeyChanged, this));
	}
	originChanged(e) {
		let { mainSecurityOrigin: t, unreachableMainSecurityOrigin: n } = e.data;
		this.updateOrigin(t, n);
	}
	storageKeyChanged(e) {
		let { mainStorageKey: t } = e.data;
		this.updateStorageKey(t);
	}
	updateOrigin(e, t) {
		let n = this.securityOrigin;
		t ? (this.securityOrigin = t, this.reportView.setSubtitle(q(K.sFailedToLoad, { PH1: t }))) : (this.securityOrigin = e, this.reportView.setSubtitle(e)), n !== this.securityOrigin && (this.quotaOverrideControlRow.classList.add("hidden"), this.quotaOverrideCheckbox.checked = !1, this.quotaOverrideErrorMessage.textContent = ""), this.performUpdate();
	}
	updateStorageKey(e) {
		let t = this.storageKey;
		this.storageKey = e, this.reportView.setSubtitle(e), t !== this.storageKey && (this.quotaOverrideControlRow.classList.add("hidden"), this.quotaOverrideCheckbox.checked = !1, this.quotaOverrideErrorMessage.textContent = ""), this.performUpdate();
	}
	async applyQuotaOverrideFromInputField() {
		if (!this.target || !this.securityOrigin) {
			this.quotaOverrideErrorMessage.textContent = q(K.internalError);
			return;
		}
		this.quotaOverrideErrorMessage.textContent = "";
		let e = this.quotaOverrideEditor.value;
		if (e === "") {
			await this.clearQuotaForOrigin(this.target, this.securityOrigin), this.previousOverrideFieldValue = "";
			return;
		}
		let t = parseFloat(e);
		if (!Number.isFinite(t)) {
			this.quotaOverrideErrorMessage.textContent = q(K.pleaseEnterANumber);
			return;
		}
		if (t < 0) {
			this.quotaOverrideErrorMessage.textContent = q(K.numberMustBeNonNegative);
			return;
		}
		let n = 9e12;
		if (t >= n) {
			this.quotaOverrideErrorMessage.textContent = q(K.numberMustBeSmaller, { PH1: n.toLocaleString() });
			return;
		}
		let r = 1e6, i = Math.round(t * r), a = `${i / r}`;
		this.quotaOverrideEditor.value = a, this.previousOverrideFieldValue = a, await this.target.storageAgent().invoke_overrideQuotaForOrigin({
			origin: this.securityOrigin,
			quotaSize: i
		});
	}
	async clearQuotaForOrigin(e, t) {
		await e.storageAgent().invoke_overrideQuotaForOrigin({ origin: t });
	}
	async onClickCheckbox() {
		this.quotaOverrideControlRow.classList.contains("hidden") ? (this.quotaOverrideControlRow.classList.remove("hidden"), this.quotaOverrideCheckbox.checked = !0, this.quotaOverrideEditor.value = this.previousOverrideFieldValue, window.setTimeout(() => this.quotaOverrideEditor.focus(), 500)) : this.target && this.securityOrigin && (this.quotaOverrideControlRow.classList.add("hidden"), this.quotaOverrideCheckbox.checked = !1, await this.clearQuotaForOrigin(this.target, this.securityOrigin), this.quotaOverrideErrorMessage.textContent = "");
	}
	clear() {
		if (!this.securityOrigin) return;
		let t = [];
		for (let e of this.settings.keys()) this.settings.get(e)?.get() && t.push(e);
		if (this.target) {
			let n = this.includeThirdPartyCookiesSetting.get();
			e.clear(this.target, this.storageKey, this.securityOrigin, t, n);
		}
		this.clearButton.disabled = !0;
		let n = this.clearButton.textContent;
		this.clearButton.textContent = q(K.clearing), window.setTimeout(() => {
			this.clearButton.disabled = !1, this.clearButton.textContent = n, this.clearButton.focus();
		}, 500), Ke.alert(q(K.SiteDataCleared));
	}
	static clear(e, t, n, r, i) {
		if (console.assert(!!t), !t) return;
		e.storageAgent().invoke_clearDataForStorageKey({
			storageKey: t,
			storageTypes: r.join(",")
		});
		let a = new Set(r), o = a.has(k.StorageType.All);
		if (a.has(k.StorageType.Local_storage) || o) {
			let n = e.model(le);
			n && n.clearForStorageKey(t);
		}
		if (a.has(k.StorageType.Indexeddb) || o) for (let e of C.instance().targets()) {
			let n = e.model(qc);
			n && n.clearForStorageKey(t);
		}
		if (n && (a.has(k.StorageType.Cookies) || o)) {
			e.storageAgent().invoke_clearDataForOrigin({
				origin: n,
				storageTypes: k.StorageType.Cookies
			});
			let t = e.model(We);
			t && t.clear(void 0, i ? void 0 : n);
		}
		if (a.has(k.StorageType.Cache_storage) || o) {
			let e = C.instance().primaryPageTarget()?.model(_t);
			e && e.clearForStorageKey(t);
		}
	}
	async performUpdate() {
		if (!this.securityOrigin || !this.target) {
			this.quotaRow.textContent = "", this.populatePieChart(0, []);
			return;
		}
		let e = this.securityOrigin, t = await this.target.storageAgent().invoke_getUsageAndQuota({ origin: e });
		if (this.quotaRow.textContent = "", t.getError()) {
			this.populatePieChart(0, []);
			return;
		}
		let n = t.overrideActive, r = o(t.quota), i = o(t.usage), a = q(K.storageWithCustomMarker, { PH1: r }), s = r;
		if (n) {
			let e = document.createElement("b");
			e.textContent = a, s = e;
		}
		let c = Sr(yp, K.storageQuotaUsed, {
			PH1: i,
			PH2: s
		});
		if (this.quotaRow.appendChild(c), Ye.install(this.quotaRow, q(K.storageQuotaUsedWithBytes, {
			PH1: t.usage.toLocaleString(),
			PH2: t.quota.toLocaleString()
		})), !t.overrideActive && t.quota < 125829120) {
			let e = new Kt();
			e.name = "info", e.style.color = "var(--icon-info)", e.classList.add("small"), Ye.install(this.quotaRow, q(K.storageQuotaIsLimitedIn)), this.quotaRow.appendChild(e);
		}
		if (this.quotaUsage === null || this.quotaUsage !== t.usage) {
			this.quotaUsage = t.usage;
			let e = [];
			for (let n of t.usageBreakdown.sort((e, t) => t.usage - e.usage)) {
				let t = n.usage;
				if (!t) continue;
				let r = this.getStorageTypeName(n.storageType), i = this.pieColors.get(n.storageType) || "#ccc";
				e.push({
					value: t,
					color: i,
					title: r
				});
			}
			this.populatePieChart(t.usage, e);
		}
		this.throttler.schedule(this.requestUpdate.bind(this));
	}
	populatePieChart(e, t) {
		this.pieChart.data = {
			chartName: q(K.storageUsage),
			size: 110,
			formatter: o,
			showLegend: !0,
			total: e,
			slices: t
		};
	}
	getStorageTypeName(e) {
		switch (e) {
			case k.StorageType.File_systems: return q(K.fileSystem);
			case k.StorageType.Indexeddb: return q(K.indexDB);
			case k.StorageType.Cache_storage: return q(K.cacheStorage);
			case k.StorageType.Service_workers: return q(K.serviceWorkers);
			default: return q(K.other);
		}
	}
}, xp = [
	k.StorageType.Cache_storage,
	k.StorageType.Cookies,
	k.StorageType.Indexeddb,
	k.StorageType.Local_storage,
	k.StorageType.Service_workers
], Sp = class {
	handleAction(e, t) {
		switch (t) {
			case "resources.clear": return this.handleClear(!1);
			case "resources.clear-incl-third-party-cookies": return this.handleClear(!0);
		}
		return !1;
	}
	handleClear(e) {
		let t = C.instance().primaryPageTarget();
		if (!t) return !1;
		let n = t.model(qe);
		if (!n) return !1;
		let r = n.getMainSecurityOrigin();
		return n.getMainStorageKey().then((n) => {
			bp.clear(t, n, r, xp, e);
		}, (e) => {}), !0;
	}
}, Cp = /* @__PURE__ */ e({
	TrustTokensTreeElement: () => Dp,
	i18nString: () => Ep
}), wp = { trustTokens: "Private state tokens" }, Tp = s("panels/application/TrustTokensTreeElement.ts", wp), Ep = a.bind(void 0, Tp), Dp = class extends A {
	view;
	constructor(e) {
		super(e, Ep(wp.trustTokens), !1, "private-state-tokens");
		let t = v("database");
		this.setLeadingIcons([t]);
	}
	get itemURL() {
		return "trustTokens://";
	}
	onselect(e) {
		return super.onselect(e), this.view ||= new ko(), this.showView(this.view), Yt.instance().panelShown("trust-tokens"), !1;
	}
}, Op = "/*\n* Copyright 2025 The Chromium Authors\n* Use of this source code is governed by a BSD-style license that can be\n* found in the LICENSE file.\n */\n\n:host {\n  width: 100%;\n  flex: auto 0 1;\n  overflow-y: auto;\n  flex-direction: column;\n\n  --override-background-list-item-color: var(--sys-color-cdt-base-container);\n}\n\n:host(.square-corners) li {\n  border-radius: 0;\n}\n\n:host([hidden]) {\n  display: none;\n}\n\nul {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\nli {\n  flex: none;\n  min-height: 30px;\n  display: flex;\n  align-items: center;\n  position: relative;\n  overflow: hidden;\n  border-radius: var(--sys-shape-corner-extra-small);\n\n  &:hover {\n    .controls-gradient {\n      background-image: linear-gradient(90deg, transparent, var(--sys-color-cdt-base-container));\n    }\n\n    .controls-buttons {\n      visibility: visible;\n    }\n\n  }\n\n  &:focus-within:not(:active),\n  &:focus-visible {\n    background-color: var(--sys-color-state-hover-on-subtle);\n\n    --override-background-list-item-color: hsl(0deg 0% 96%);\n\n    outline: none;\n\n\n    .controls-gradient {\n      background-image: linear-gradient(90deg, transparent, var(--override-background-list-item-color));\n    }\n\n    .controls-buttons {\n      background-color: var(--override-background-list-item-color);\n      visibility: visible;\n    }\n\n  }\n}\n\n.controls-container {\n  display: flex;\n  flex-direction: row;\n  justify-content: flex-end;\n  align-items: stretch;\n  pointer-events: none;\n  position: absolute;\n  right: 0;\n}\n\n.controls-gradient {\n  width: var(--sys-size-16);\n}\n\n.controls-buttons {\n  flex: none;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  pointer-events: auto;\n  visibility: hidden;\n  background-color: var(--sys-color-cdt-base-container);\n}\n", kp = {
	edit: "Edit",
	remove: "Remove"
}, Ap = s("ui/components/lists/List.ts", kp), jp = a.bind(void 0, Ap), Mp = class extends CustomEvent {
	constructor(e) {
		super("edit", {
			bubbles: !0,
			composed: !0,
			detail: e
		});
	}
}, Np = class extends CustomEvent {
	constructor(e) {
		super("delete", {
			bubbles: !0,
			composed: !0,
			detail: e
		});
	}
}, Pp = class extends HTMLElement {
	static observedAttributes = [
		"editable",
		"deletable",
		"disable-li-focus"
	];
	#e;
	#t = !1;
	#n = !1;
	#r;
	constructor() {
		super(), this.attachShadow({ mode: "open" }), this.#e = new MutationObserver(this.#i.bind(this));
	}
	set editable(e) {
		this.#t !== e && (this.#t = e, this.#i());
	}
	set deletable(e) {
		this.#n !== e && (this.#n = e, this.#i());
	}
	set disableListItemFocus(e) {
		this.#r !== e && (this.#r = e, this.#i());
	}
	attributeChangedCallback(e, t, n) {
		let r = n !== null;
		e === "editable" ? this.editable = r : e === "deletable" ? this.deletable = r : e === "disable-li-focus" && (this.disableListItemFocus = r);
	}
	connectedCallback() {
		this.#e.observe(this, { childList: !0 }), this.#i();
	}
	disconnectedCallback() {
		this.#e.disconnect();
	}
	createSlottedListItem(e) {
		return y`
    <li role='listitem' tabindex=${this.#r ? "-1" : "0"}>
    <slot name='slot-${e}'></slot>
    <div class='controls-container'>
              <div class='controls-gradient'></div>
              <div class='controls-buttons'>
                ${this.#t ? y`
            <devtools-button
              title=${jp(kp.edit)}
              aria-label=${jp(kp.edit)}
              .iconName=${"edit"}
              .jslogContext=${"edit-item"}
              .variant=${h.ICON}
              @click=${this.#o.bind(this, e)}
            ></devtools-button>
          ` : b}
                ${this.#n ? y`
            <devtools-button
              title=${jp(kp.remove)}
              aria-label=${jp(kp.remove)}
              .iconName=${"bin"}
              .jslogContext=${"remove-item"}
              .variant=${h.ICON}
              @click=${this.#a.bind(this, e)}
            ></devtools-button>
          ` : b}
              </div>
            </div>
            </li>`;
	}
	#i() {
		if (this.shadowRoot) {
			let e = [...this.children].map((e, t) => {
				let n = `slot-${t}`;
				return e.getAttribute("slot") !== n && e.setAttribute("slot", n), {
					index: t,
					item: e
				};
			});
			_(y`
    <style>${Op}</style>
    <ul role='list'>
    ${ke(e, (e) => e.item, (e) => this.createSlottedListItem(e.index))}
    </ul>
  `, this.shadowRoot);
		}
	}
	#a(e) {
		this.dispatchEvent(new Np({ index: e }));
	}
	#o(e) {
		this.dispatchEvent(new Mp({ index: e }));
	}
};
customElements.define("devtools-list", Pp);
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/web_mcp/WebMCPModel.ts
var Fp = /* @__PURE__ */ function(e) {
	return e.TOOLS_ADDED = "ToolsAdded", e.TOOLS_REMOVED = "ToolsRemoved", e.TOOL_INVOKED = "ToolInvoked", e.TOOL_RESPONDED = "ToolResponded", e;
}({}), Ip = class {
	status;
	output;
	errorText;
	#e;
	#t;
	constructor(e, t, n, r) {
		this.status = e, this.errorText = n, this.#e = r, this.output = t;
	}
	get exceptionDetails() {
		return this.#t ||= this.#n(this.#e), this.#t;
	}
	async #n(e) {
		if (!e) return;
		let t = Te.objectAsError(e), [n, r] = await Promise.all([t.exceptionDetails(), t.cause()]), i = t.errorStack, a = tr(e.runtimeModel(), t.errorStack) || [];
		return n?.stackTrace && nr(a, n.stackTrace), r?.subtype === "error" ? {
			error: e,
			description: i,
			frames: a,
			cause: await this.#n(r)
		} : r?.type === "string" ? {
			error: e,
			description: i,
			frames: a,
			cause: {
				error: r,
				description: r.value,
				frames: []
			}
		} : {
			error: e,
			description: i,
			frames: a
		};
	}
}, Lp = class {
	#e;
	#t;
	#n;
	constructor(e, t) {
		this.#n = new WeakRef(t), this.#e = e, this.#t = e.stackTrace && ar.instance().createStackTraceFromProtocolRuntime(e.stackTrace, t);
	}
	get stackTrace() {
		return this.#t;
	}
	get name() {
		return this.#e.name;
	}
	get description() {
		return this.#e.description;
	}
	get inputSchema() {
		let e = this.#e.inputSchema;
		if (typeof e == "string") try {
			e = JSON.parse(e);
		} catch {
			e = {};
		}
		return typeof e == "object" && e ? e : {};
	}
	get frame() {
		return this.#n.deref()?.model(qe)?.frameForId(this.#e.frameId) ?? void 0;
	}
	get isDeclarative() {
		return !!this.#e.backendNodeId;
	}
	get node() {
		let e = this.#n.deref();
		return this.#e.backendNodeId && e && new mt(e, this.#e.backendNodeId);
	}
	async invoke(e) {
		let t = await this.#n.deref()?.webMCPAgent().invoke_invokeTool({
			toolName: this.name,
			frameId: this.#e.frameId,
			input: e
		});
		if (t && !t.getError()) return t.invocationId;
	}
}, Rp = class extends Et {
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ new Map();
	agent;
	#n = !1;
	constructor(e) {
		super(e), this.agent = e.webMCPAgent(), e.registerWebMCPDispatcher(this);
		let t = e.model(se);
		t && t.addEventListener(On.ExecutionContextDestroyed, this.#r, this), this.enable();
	}
	get tools() {
		return this.#e.values().flatMap((e) => e.values());
	}
	get toolCalls() {
		return [...this.#t.values()];
	}
	toolCallForId(e) {
		return this.#t.get(e);
	}
	clearCalls() {
		this.#t.clear();
	}
	async enable() {
		this.#n ||= (await this.agent.invoke_enable(), !0);
	}
	#r(e) {
		let t = e.data;
		if (t.isDefault && t.frameId) {
			let e = this.#e.get(t.frameId);
			if (e) {
				let n = [...e.values()];
				this.#e.delete(t.frameId), this.dispatchEventToListeners("ToolsRemoved", n);
			}
		}
	}
	toolsRemoved(e) {
		let t = [];
		for (let n of e.tools) {
			let e = this.#e.get(n.frameId)?.get(n.name);
			e && (this.#e.get(n.frameId)?.delete(n.name), t.push(e));
		}
		this.dispatchEventToListeners("ToolsRemoved", t);
	}
	toolsAdded(e) {
		let t = [];
		for (let n of e.tools) {
			let e = new Lp(n, this.target()), r = this.#e.get(n.frameId) ?? /* @__PURE__ */ new Map();
			this.#e.has(n.frameId) || this.#e.set(n.frameId, r), r.set(e.name, e), t.push(e);
		}
		this.dispatchEventToListeners("ToolsAdded", t);
	}
	toolInvoked(e) {
		let t = this.#e.get(e.frameId)?.get(e.toolName);
		if (!t) return;
		let n = {
			tool: t,
			input: e.input,
			invocationId: e.invocationId,
			cancel: () => {
				n.result === void 0 && this.agent.invoke_cancelInvocation({ invocationId: e.invocationId });
			}
		};
		this.#t.set(e.invocationId, n), this.dispatchEventToListeners("ToolInvoked", n);
	}
	toolResponded(e) {
		let t = this.#t.get(e.invocationId);
		if (!t) return;
		let n = e.exception && this.target().model(se)?.createRemoteObject(e.exception);
		t.result = new Ip(e.status, e.output, e.errorText, n), this.dispatchEventToListeners("ToolResponded", t);
	}
};
Et.register(Rp, {
	capabilities: Me.WEB_MCP,
	autostart: !0
});
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/application/webMCPView.css.mjs
var zp = "/*\n * Copyright 2026 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n@scope to (devtools-widget > *) {\n  .webmcp-view {\n    height: 100%;\n    width: 100%;\n  }\n\n  .call-log,\n  .tool-list {\n    height: 100%;\n    display: flex;\n    flex-direction: column;\n    overflow: auto;\n    padding: 0;\n  }\n\n  .empty-view-scroller {\n    flex: auto;\n  }\n\n  devtools-data-grid {\n    flex: auto;\n  }\n\n  .data-grid {\n    th {\n      height: 26px;\n    }\n\n    td {\n      vertical-align: middle;\n    }\n\n    tr.status-cancelled {\n      color: var(--sys-color-on-surface-light);\n    }\n\n    tr.status-error {\n      color: var(--sys-color-error);\n    }\n\n    tr.selected {\n      background-color: var(--sys-color-tonal-container);\n    }\n\n    tbody tr.selected.status-error,\n    tbody tr.selected.status-error.revealed {\n      background-color: var(--sys-color-error-container);\n      color: var(--sys-color-error);\n    }\n\n    tbody tr:hover .run-tool-action-button,\n    tbody tr:focus-within .run-tool-action-button,\n    &:focus-within tbody tr.selected .run-tool-action-button {\n      display: flex;\n    }\n  }\n\n  .section-title {\n    display: flex;\n    gap: var(--sys-size-2);\n    background-color: var(--sys-color-surface1);\n    padding: 0 var(--sys-size-3);\n    line-height: var(--sys-size-10);\n    overflow: hidden;\n    align-items: center;\n    flex: none;\n    color: var(--sys-color-on-surface);\n    border-bottom: 1px solid var(--sys-color-divider);\n\n    devtools-button {\n      margin: calc(-1 * var(--sys-size-1)) 0;\n    }\n  }\n\n  .status-cell {\n    display: flex;\n    align-items: center;\n    gap: var(--sys-size-3);\n  }\n\n  .name-cell {\n    display: flex;\n    gap: var(--sys-size-5);\n    align-items: center;\n    min-width: 0;\n  }\n\n  .name-cell > span {\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    min-width: 0;\n  }\n\n  .run-tool-action-button {\n    display: none;\n    width: var(--sys-size-8);\n    height: var(--sys-size-8);\n    padding: 0;\n    border: none;\n    background-color: transparent;\n    cursor: pointer;\n    align-items: center;\n    justify-content: center;\n    flex-shrink: 0;\n\n    devtools-icon {\n      width: var(--sys-size-7);\n      height: var(--sys-size-7);\n      color: var(--sys-color-primary);\n    }\n  }\n\n  .tool-details {\n    height: 100%;\n    display: flex;\n    flex-direction: column;\n    overflow: hidden;\n  }\n\n  .tool-details-grid {\n    display: grid;\n    grid-template-columns: min-content 1fr;\n    gap: var(--sys-size-6);\n    padding: calc(0.5*var(--sys-size-6)) var(--sys-size-8);\n    align-items: flex-start;\n    overflow-y: auto;\n\n    .label {\n      color: var(--sys-color-on-surface-subtle);\n      white-space: nowrap;\n      padding: var(--sys-size-3) 0;\n    }\n\n    .value {\n      user-select: text;\n\n      &.source-code {\n        color: var(--sys-color-token-property-special);\n      }\n\n      padding: var(--sys-size-3) 0;\n      color: var(--sys-color-on-surface);\n      overflow-wrap: anywhere;\n\n      &.stack-trace {\n        display: flex;\n        padding: 0;\n        margin-top: calc(-1 * (var(--sys-size-1) + var(--sys-size-2)));\n        margin-left: calc(-1 * var(--sys-size-3));\n      }\n\n      &.tool-origin-container {\n        display: flex;\n        align-items: center;\n        gap: var(--sys-size-4);\n      }\n\n      .tool-origin-node {\n        display: flex;\n        align-items: center;\n        cursor: default;\n      }\n    }\n\n    .show-element {\n      height: 1lh;\n    }\n  }\n\n  devtools-list {\n    flex: 1 1 auto;\n    margin: 0;\n    padding: var(--sys-size-4) 0;\n    box-sizing: border-box;\n  }\n\n  .tool-item {\n    display: flex;\n    flex-direction: column;\n    padding: var(--sys-size-5) var(--sys-size-4);\n    gap: var(--sys-size-3);\n    width: 100%;\n    box-sizing: border-box;\n    border-bottom: 1px solid var(--sys-color-divider);\n\n    &:hover {\n      background-color: var(--sys-color-state-hover-on-subtle);\n    }\n\n    &.selected {\n      background-color: var(--sys-color-tonal-container);\n    }\n  }\n\n  .tool-name-container {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    gap: var(--sys-size-5);\n\n    .tool-icons {\n      display: flex;\n      gap: var(--sys-size-2);\n      align-items: center;\n    }\n    /* stylelint-disable-next-line selector-type-no-unknown */\n    icon-button {\n      flex-shrink: 0;\n      display: flex;\n      align-items: center;\n      cursor: pointer;\n    }\n  }\n\n  .tool-name.source-code {\n    color: var(--sys-color-token-property-special);\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    min-width: 0;\n    flex: 1;\n  }\n\n  .tool-description {\n    color: var(--sys-color-on-surface);\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n  }\n\n  devtools-toolbar-input {\n    flex-grow: 1;\n    flex-shrink: 1;\n  }\n\n  .toolbar-text.status-error-text {\n    color: var(--sys-color-error);\n  }\n\n  .toolbar-text.status-cancelled-text {\n    color: var(--sys-color-on-surface-light);\n  }\n\n  .call-details-tabbed-pane {\n    flex: auto;\n    border-bottom: 1px solid var(--sys-color-divider);\n  }\n\n  .call-payload-view {\n    display: flex;\n    flex-direction: column;\n    height: 100%;\n  }\n\n  .call-payload-content {\n    padding: var(--sys-size-5);\n    flex: auto;\n    overflow: auto;\n  }\n\n  .payload-value.error-text {\n    color: var(--sys-color-error);\n    white-space: pre-wrap;\n  }\n\n  .sidebar-tool-details {\n    flex: none;\n    border-bottom: 1px solid var(--sys-color-divider);\n  }\n\n  .call-to-action {\n    background-color: var(--sys-color-neutral-container);\n    padding: 8px;\n    border-radius: 5px;\n    margin: 4px;\n  }\n\n  .call-to-action-body {\n    padding: 6px 0;\n    margin-left: 9.5px;\n    border-left: 2px solid var(--issue-color-yellow);\n    padding-left: 18px;\n    line-height: 20px;\n  }\n\n  .call-to-action .explanation {\n    font-weight: bold;\n  }\n\n  .inline-icon {\n    vertical-align: middle;\n  }\n\n  .json-editor-widget {\n    flex: auto;\n    /* extend the JSON editor padding to match the details grid */\n    padding-left: calc(var(--sys-size-8) - 1em);\n    min-height: 0;\n  }\n\n  .webmcp-run-tool-button {\n    align-self: flex-end;\n    margin: var(--sys-size-6) var(--sys-size-8);\n  }\n}\n", Bp = /* @__PURE__ */ e({
	DEFAULT_VIEW: () => Xp,
	PAYLOAD_DEFAULT_VIEW: () => Qp,
	PayloadWidget: () => $p,
	TabId: () => Up,
	ToolDetailsWidget: () => tm,
	WebMCPView: () => Zp,
	filterToolCalls: () => Wp,
	getJSONEditorParameters: () => Yp,
	parsePayload: () => Jp,
	parseToolSchema: () => rm
}), J = {
	toolRegistry: "Available Tools",
	noToolsPlaceholderTitle: "Available `WebMCP` Tools",
	noToolsPlaceholder: "Registered `WebMCP` tools for this page will appear here. No tools have been registered or detected yet.",
	noCallsPlaceholderTitle: "Tool Activity",
	noCallsPlaceholder: "Start interacting with your `WebMCP` agent to see real-time tool calls and executions here.",
	toolDetails: "Details",
	viewInElementsPanel: "View in Elements panel",
	frame: "Frame",
	name: "Name",
	status: "Status",
	input: "Input",
	output: "Output",
	inProgress: "In Progress",
	clearLog: "Clear log",
	close: "Close",
	filter: "Filter",
	toolTypes: "Tool types",
	statusTypes: "Status types",
	clearFilters: "Clear filters",
	imperative: "Imperative",
	declarative: "Declarative",
	error: "Error",
	canceled: "Canceled",
	completed: "Completed",
	pending: "In Progress",
	totalCalls: "{PH1} Total calls",
	failed: "{PH1} Failed",
	canceledCount: "{PH1} Canceled",
	inProgressCount: "{PH1} In Progress",
	copyName: "Copy name",
	copyDescription: "Copy description",
	cancelCall: "Cancel",
	runTool: "Run Tool",
	revealTool: "Reveal tool",
	editAndRun: "Edit and run",
	paste: "Paste",
	toolUnregisteredNotice: "This tool has been unregistered",
	causedBy: "Caused by:"
}, Vp = s("panels/application/WebMCPView.ts", J), Y = a.bind(void 0, Vp), { widget: Hp } = Wt, Up = /* @__PURE__ */ function(e) {
	return e.DETAILS = "webmcp.tool-details", e.INPUT = "webmcp.call-inputs", e.OUTPUT = "webmcp.call-outputs", e;
}({});
function Wp(e, t) {
	let n = [...e], r = t.statusTypes;
	r && (n = n.filter((e) => {
		let { completed: t, error: n, pending: i, canceled: a } = r;
		return !!(t && e.result?.status === Sn.InvocationStatus.Completed || n && e.result?.status === Sn.InvocationStatus.Error || a && e.result?.status === Sn.InvocationStatus.Canceled || i && e.result === void 0);
	}));
	let i = t.toolTypes;
	if (i && (n = n.filter((e) => {
		let { imperative: t, declarative: n } = i;
		return !!(t && !e.tool.isDeclarative || n && e.tool.isDeclarative);
	})), t.text) {
		let e = qn(t.text, "i");
		n = n.filter((t) => e.test(t.tool.name) || e.test(t.input) || t.result?.output && e.test(JSON.stringify(t.result.output)) || t.result?.errorText && e.test(t.result.errorText));
	}
	return n;
}
function Gp(e) {
	let t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
	for (let r of e) {
		let e = t.get(r.tool);
		e || (e = /* @__PURE__ */ new Map(), t.set(r.tool, e)), e.set(r.result?.status, (e.get(r.result?.status) ?? 0) + 1), n.set(r.result?.status, (n.get(r.result?.status) ?? 0) + 1);
	}
	return {
		totals: n,
		stats: t
	};
}
function Kp(e) {
	switch (e) {
		case Sn.InvocationStatus.Completed: return {
			iconName: "check-circle",
			iconColor: "var(--sys-color-green)"
		};
		case Sn.InvocationStatus.Error: return {
			iconName: "cross-circle-filled",
			iconColor: "var(--sys-color-error)"
		};
		case Sn.InvocationStatus.Canceled: return {
			iconName: "record-stop",
			iconColor: "var(--sys-color-on-surface-light)"
		};
		case void 0: return { iconName: "watch" };
	}
}
function qp(e) {
	return [
		Sn.InvocationStatus.Completed,
		Sn.InvocationStatus.Error,
		Sn.InvocationStatus.Canceled,
		void 0
	].map((t) => ({
		...Kp(t),
		iconWidth: "var(--sys-size-8)",
		iconHeight: "var(--sys-size-8)",
		text: String(e?.get(t) ?? 0),
		status: t
	})).filter(({ text: e }) => e !== "0");
}
function Jp(e) {
	if (e === void 0) return {
		valueObject: void 0,
		valueString: void 0
	};
	if (typeof e == "string") try {
		return {
			valueObject: JSON.parse(e),
			valueString: void 0
		};
	} catch {
		return {
			valueObject: void 0,
			valueString: e
		};
	}
	return {
		valueObject: e,
		valueString: void 0
	};
}
function Yp(e) {
	let t = rm(e.inputSchema), n = /* @__PURE__ */ new Map();
	return n.set(e.name, {
		parameters: t.parameters,
		description: e.description,
		replyArgs: []
	}), {
		metadataByCommand: n,
		typesByName: t.typesByName,
		enumsByName: t.enumsByName
	};
}
var Xp = (e, t, n) => {
	let r = e.tools, i = null, a = Gp(e.toolCalls), o = !!e.filters.text || !!e.filters.toolTypes || !!e.filters.statusTypes, s = (e) => {
		switch (e.result?.status) {
			case Sn.InvocationStatus.Error: return "cross-circle-filled";
			case Sn.InvocationStatus.Canceled: return "record-stop";
			case void 0: return "watch";
			default: return "";
		}
	}, c = (e) => {
		switch (e.result?.status) {
			case Sn.InvocationStatus.Error: return Y(J.error);
			case Sn.InvocationStatus.Canceled: return Y(J.canceled);
			case Sn.InvocationStatus.Completed: return Y(J.completed);
			default: return Y(J.inProgress);
		}
	}, l = (t, n) => {
		let r;
		n === Sn.InvocationStatus.Completed ? r = { completed: !0 } : n === Sn.InvocationStatus.Error ? r = { error: !0 } : n === Sn.InvocationStatus.Canceled ? r = { canceled: !0 } : n === void 0 && (r = { pending: !0 }), e.onFilterChange({
			...e.filters,
			text: t,
			statusTypes: r
		});
	}, u = (e, t) => {
		let n = new bt(e);
		n.defaultSection().appendItem(Y(J.copyName), () => {
			st.copyText(t.name);
		}, { jslogContext: "webmcp.copy-tool-name" }), n.defaultSection().appendItem(Y(J.copyDescription), () => {
			st.copyText(t.description);
		}, { jslogContext: "webmcp.copy-tool-description" }), n.show();
	};
	_(y`
    <style>${zp}</style>
    <style>${xe}</style>
    <devtools-split-view class="webmcp-view" direction="row" sidebar-position="second" name="webmcp-split-view">
      <div slot="main" class="call-log">
        <div class="webmcp-toolbar-container" role="toolbar" jslog=${Qt()}>
          <devtools-toolbar class="webmcp-toolbar" role="presentation" wrappable>
            <devtools-button title=${Y(J.clearLog)}
                             .iconName=${"clear"}
                             .variant=${h.TOOLBAR}
                             @click=${e.onClearLogClick}></devtools-button>
            <div class="toolbar-divider"></div>
            <devtools-toolbar-input type="filter"
                                    placeholder=${Y(J.filter)}
                                    @change=${(t) => e.onFilterChange({
		...e.filters,
		text: t.detail
	})}
                                    .value=${e.filters.text}>
            </devtools-toolbar-input>
            <div class="toolbar-divider"></div>
            ${e.filterButtons.toolTypes.button.element}
            <div class="toolbar-divider"></div>
            ${e.filterButtons.statusTypes.button.element}
            <div class="toolbar-spacer"></div>
            <devtools-button title=${Y(J.clearFilters)}
                             .iconName=${"filter-clear"}
                             .variant=${h.TOOLBAR}
                             @click=${() => e.onFilterChange({ text: "" })}
                             ?hidden=${!o}></devtools-button>
          </devtools-toolbar>
        </div>
        ${e.toolCalls.length > 0 ? y`
          <devtools-split-view name="webmcp-call-split-view"
                               direction="column"
                               sidebar-position="second"
                               sidebar-visibility=${e.selectedCall ? "show" : "hidden"}>
            <div slot="main" style="display: flex; flex-direction: column; overflow: hidden; height: 100%;">
              <devtools-data-grid striped .template=${y`
                <table>
                  <style>${zp}</style>
                  <tr>
                    <th id="name" weight="20">
                      ${Y(J.name)}
                    </th>
                    <th id="status" weight="20">${Y(J.status)}</th>
                            ${e.selectedCall ? b : y`
                    <th id="input" weight="30">${Y(J.input)}</th>
                    <th id="output" weight="30">${Y(J.output)}</th>
                            `}
                  </tr>
                      ${ke(e.toolCalls, (e) => e.invocationId + "-" + (e.result?.status ?? ""), (t) => y`
                    <tr class=${Ze({
		"status-error": t.result?.status === Sn.InvocationStatus.Error,
		"status-cancelled": t.result?.status === Sn.InvocationStatus.Canceled,
		selected: t === e.selectedCall
	})} @click=${() => e.onCallSelect(t)}
                        @contextmenu=${(n) => {
		let r = n.detail, i = !e.tools.includes(t.tool);
		r.defaultSection().appendItem(Y(J.revealTool), () => {
			e.onRevealTool(t.tool);
		}, {
			jslogContext: "webmcp.reveal-tool",
			disabled: i
		}), r.defaultSection().appendItem(Y(J.editAndRun), () => {
			let n = Jp(t.input);
			e.onRevealTool(t.tool, n.valueObject);
		}, {
			jslogContext: "webmcp.edit-and-run",
			disabled: i
		}), t.result === void 0 && r.defaultSection().appendItem(Y(J.cancelCall), () => {
			t.cancel();
		}, { jslogContext: "webmcp.cancel-call" });
	}}>
                      <td @click=${(n) => {
		n.stopPropagation(), e.onCallSelect(t, "webmcp.tool-details");
	}}>
                        <div class="name-cell">
                          <span>${t.tool.name}</span>
                          <button class="run-tool-action-button"
                                  title=${Y(J.editAndRun)}
                                  aria-label=${Y(J.editAndRun)}
                                  @click=${(n) => {
		n.stopPropagation();
		let r = Jp(t.input);
		e.onRevealTool(t.tool, r.valueObject);
	}}>
                            <devtools-icon name="goto-filled"></devtools-icon>
                          </button>
                        </div>
                      </td>
                      <td @click=${(n) => {
		n.stopPropagation(), e.onCallSelect(t, "webmcp.call-outputs");
	}}>
                        <div class="status-cell">
                          ${s(t) ? y`<devtools-icon class="small" name=${s(t)}></devtools-icon>` : ""}
                          <span>${c(t)}</span>
                        </div>
                      </td>
                      ${e.selectedCall ? b : y`
                        <td @click=${(n) => {
		n.stopPropagation(), e.onCallSelect(t, "webmcp.call-inputs");
	}}>${t.input}</td>
                        <td @click=${(n) => {
		n.stopPropagation(), e.onCallSelect(t, "webmcp.call-outputs");
	}}>${t.result?.output ? JSON.stringify(t.result.output) : t.result?.errorText ?? ""}</td>
                        `}
                    </tr>
                  `)}
                  </table>`}>
              </devtools-data-grid>
            </div>
            <div slot="sidebar" style="height: 100%; display: flex; flex-direction: column; overflow: hidden;">
              <devtools-tabbed-pane class="call-details-tabbed-pane">
                <devtools-button
                  slot="left"
                  .iconName=${"cross"}
                  .size=${ft.SMALL}
                  .variant=${h.ICON}
                  title=${Y(J.close)}
                  @click=${() => e.onCallSelect(null)}
                ></devtools-button>
                <devtools-widget
                  id=${"webmcp.tool-details"}
                  ?selected=${e.selectedTab === "webmcp.tool-details"}
                  title=${Y(J.toolDetails)}
                  ${Hp(tm, {
		tool: e.selectedCall?.tool,
		isUnregistered: e.selectedCall ? !e.tools.includes(e.selectedCall.tool) : !1
	})}>
                </devtools-widget>
                <devtools-widget
                  id=${"webmcp.call-inputs"}
                  ?selected=${e.selectedTab === "webmcp.call-inputs"}
                  title=${Y(J.input)}
                  ${Hp($p, Jp(e.selectedCall?.input))}>
                </devtools-widget>
                <devtools-widget
                  id=${"webmcp.call-outputs"}
                  ?selected=${e.selectedTab === "webmcp.call-outputs"}
                  title=${Y(J.output)}
                  ${Hp($p, {
		valueObject: e.selectedCall?.result?.output,
		errorText: e.selectedCall?.result?.errorText,
		exceptionDetails: e.selectedCall?.result?.exceptionDetails
	})}>
                </devtools-widget>
              </devtools-tabbed-pane>
            </div>
          </devtools-split-view>
          <div class="webmcp-toolbar-container" role="toolbar">
            <devtools-toolbar class="webmcp-toolbar" role="presentation" wrappable>
              <span class="toolbar-text">${Y(J.totalCalls, { PH1: e.toolCalls.length })}</span>
              <div class="toolbar-divider"></div>
              <span class="toolbar-text status-error-text">${Y(J.failed, { PH1: a.totals.get(Sn.InvocationStatus.Error) ?? 0 })}</span>
              <div class="toolbar-divider"></div>
              <span class="toolbar-text status-cancelled-text">${Y(J.canceledCount, { PH1: a.totals.get(Sn.InvocationStatus.Canceled) ?? 0 })}</span>
              <div class="toolbar-divider"></div>
              <span class="toolbar-text">${Y(J.inProgressCount, { PH1: a.totals.get(void 0) ?? 0 })}</span>
            </devtools-toolbar>
          </div>
        ` : y`
        ${sn(Ae, {
		header: Y(J.noCallsPlaceholderTitle),
		text: Y(J.noCallsPlaceholder)
	})}
        `}
      </div>
      <devtools-split-view slot="sidebar"
                           direction="column"
                           sidebar-position="second"
                           name="webmcp-details-split-view"
                           sidebar-visibility=${e.selectedTool ? "show" : "hidden"}>
        <div slot="main" class="tool-list">
          <div class="section-title">${Y(J.toolRegistry)}</div>
          ${r.length === 0 ? y`
          ${sn(Ae, {
		header: Y(J.noToolsPlaceholderTitle),
		text: Y(J.noToolsPlaceholder)
	})}
          ` : y`
            <devtools-list class="square-corners">
              ${r.map((t) => y`
                    <div class=${Ze({
		"tool-item": !0,
		selected: t === e.selectedTool?.tool
	})}
                         @click=${() => e.onToolSelect(t)}
                         @contextmenu=${(e) => u(e, t)}>
                    <div class="tool-name-container">
                      <div class="tool-name source-code">${t.name}</div>
                    <div class="tool-icons">
                      ${qp(a.stats.get(t)).map((e) => y`
                        <icon-button
                          .data=${{
		groups: [e],
		compact: !1,
		clickHandler: () => l(t.name, e.status)
	}}
                          @click=${(e) => e.stopPropagation()}></icon-button>`)}
                    </div>
                    </div>
                    <div class="tool-description">${t.description}</div>
                </div>`)}
            </devtools-list>
          `}
        </div>
        <div slot="sidebar" class="tool-details">
          <div class="section-title">
            <devtools-button
              .iconName=${"cross"}
              .size=${ft.SMALL}
              .variant=${h.ICON}
              title=${Y(J.close)}
              @click=${() => e.onToolSelect(null)}
            ></devtools-button>
            <span>${Y(J.toolDetails)}</span>
          </div>
          ${e.selectedTool ? y`
            <div class="sidebar-tool-details">
              ${Hp(tm, { tool: e.selectedTool.tool })}
            </div>
            <div class="section-title">
              <span>${Y(J.runTool)}</span>
              <div style="flex: auto;"></div>
              <devtools-button
                .iconName=${"import"}
                .size=${ft.SMALL}
                .variant=${h.TEXT}
                title=${Y(J.paste)}
                @click=${e.onPaste}
              >${Y(J.paste)}</devtools-button>
            </div>
            <devtools-widget
              class="json-editor-widget"
              ${Hp(ii, {
		displayTargetSelector: !1,
		displayCommandInput: !1,
		displayToolbar: !1,
		...Yp(e.selectedTool.tool),
		commandToDisplay: {
			command: e.selectedTool.tool.name,
			parameters: e.selectedTool.parameters || {}
		}
	})}
              ${Ct(ii, (e) => {
		i = e;
	})}
              @submiteditor=${(t) => e.onRunTool({ data: t.detail })}
            ></devtools-widget>
            <devtools-button
              class="webmcp-run-tool-button"
              .variant=${h.OUTLINED}
              .size=${ft.SMALL}
              jslogContext="webmcp.run-tool"
              @click=${() => {
		if (i && e.selectedTool) {
			let t = i.getParameters();
			e.onRunTool({ data: {
				command: e.selectedTool.tool.name,
				parameters: t
			} });
		}
	}}>Run tool</devtools-button>
          ` : b}
        </div>
      </devtools-split-view>
    </devtools-split-view>
  `, n);
}, Zp = class e extends S {
	#e;
	#t = null;
	#n = null;
	#r = void 0;
	#i = null;
	#a = { text: "" };
	#o;
	static createFilterButtons(e, t) {
		let n = (e, t, n) => {
			let r = new gt(t, !1, !0, n, void 0, !0);
			r.setText(e);
			let i = new Br();
			i.name = "countWrapper";
			let a = document.createElement("span");
			return i.append(a), i.classList.add("active-filters-count"), i.classList.add("hidden"), r.setAdorner(i), {
				button: r,
				setCount: (e) => {
					a.textContent = `${e}`, e === 0 ? i.hide() : i.show();
				}
			};
		};
		return {
			toolTypes: n(Y(J.toolTypes), e, "webmcp.tool-types"),
			statusTypes: n(Y(J.statusTypes), t, "webmcp.status-types")
		};
	}
	constructor(t, n = Xp) {
		super(t), this.#e = n, this.#o = e.createFilterButtons(this.#s.bind(this), this.#c.bind(this)), C.instance().observeModels(Rp, {
			modelAdded: (e) => this.#l(e),
			modelRemoved: (e) => this.#u(e)
		}), this.requestUpdate();
	}
	#s(e) {
		let t = (e) => {
			let t = this.#a.toolTypes ?? {}, n = {
				...t,
				[e]: !t[e]
			}, r = n;
			!n.imperative && !n.declarative && (r = void 0), this.#m({
				...this.#a,
				toolTypes: r
			});
		};
		e.defaultSection().appendCheckboxItem(Y(J.imperative), () => t("imperative"), {
			checked: this.#a.toolTypes?.imperative ?? !1,
			jslogContext: "webmcp.imperative"
		}), e.defaultSection().appendCheckboxItem(Y(J.declarative), () => t("declarative"), {
			checked: this.#a.toolTypes?.declarative ?? !1,
			jslogContext: "webmcp.declarative"
		});
	}
	#c(e) {
		let t = (e) => {
			let t = this.#a.statusTypes ?? {}, n = {
				...t,
				[e]: !t[e]
			}, r = n;
			!n.completed && !n.error && !n.pending && !n.canceled && (r = void 0), this.#m({
				...this.#a,
				statusTypes: r
			});
		};
		e.defaultSection().appendCheckboxItem(Y(J.completed), () => t("completed"), {
			checked: this.#a.statusTypes?.completed ?? !1,
			jslogContext: "webmcp.completed"
		}), e.defaultSection().appendCheckboxItem(Y(J.error), () => t("error"), {
			checked: this.#a.statusTypes?.error ?? !1,
			jslogContext: "webmcp.error"
		}), e.defaultSection().appendCheckboxItem(Y(J.canceled), () => t("canceled"), {
			checked: this.#a.statusTypes?.canceled ?? !1,
			jslogContext: "webmcp.canceled"
		}), e.defaultSection().appendCheckboxItem(Y(J.pending), () => t("pending"), {
			checked: this.#a.statusTypes?.pending ?? !1,
			jslogContext: "webmcp.pending"
		});
	}
	#l(e) {
		e.addEventListener(Fp.TOOLS_ADDED, this.requestUpdate, this), e.addEventListener(Fp.TOOLS_REMOVED, this.#f, this), e.addEventListener(Fp.TOOL_INVOKED, this.#d, this), e.addEventListener(Fp.TOOL_RESPONDED, this.requestUpdate, this);
	}
	#u(e) {
		e.removeEventListener(Fp.TOOLS_ADDED, this.requestUpdate, this), e.removeEventListener(Fp.TOOLS_REMOVED, this.#f, this), e.removeEventListener(Fp.TOOL_INVOKED, this.#d, this), e.removeEventListener(Fp.TOOL_RESPONDED, this.requestUpdate, this);
	}
	#d(e) {
		let t = e.data;
		t.invocationId === this.#i && (this.#n = t, this.#i = null), this.requestUpdate();
	}
	#f(e) {
		this.#t && e.data.includes(this.#t.tool) && (this.#t = null), this.requestUpdate();
	}
	#p = () => {
		let e = C.instance().models(Rp);
		for (let t of e) t.clearCalls();
		this.requestUpdate();
	};
	#m = (e) => {
		this.#a = e;
		let t = this.#a.toolTypes ? Object.values(this.#a.toolTypes).filter(Boolean).length : 0;
		this.#o.toolTypes.setCount(t);
		let n = this.#a.statusTypes ? Object.values(this.#a.statusTypes).filter(Boolean).length : 0;
		this.#o.statusTypes.setCount(n), this.requestUpdate();
	};
	#h() {
		return C.instance().models(Rp).flatMap((e) => e.tools.toArray()).sort((e, t) => e.name.localeCompare(t.name));
	}
	performUpdate() {
		let e = Wp(C.instance().models(Rp).flatMap((e) => e.toolCalls), this.#a), t = {
			tools: this.#h(),
			selectedTool: this.#t,
			onToolSelect: (e) => {
				this.#t = e ? { tool: e } : null, this.requestUpdate();
			},
			onRevealTool: (e, t) => {
				this.#t = {
					tool: e,
					parameters: t
				}, this.requestUpdate();
			},
			selectedCall: this.#n,
			selectedTab: this.#r,
			onCallSelect: (e, t) => {
				e === null ? this.#n = null : this.#n === null ? (this.#n = e, this.#r = t) : this.#n = e, this.requestUpdate();
			},
			toolCalls: e,
			filters: this.#a,
			filterButtons: this.#o,
			onClearLogClick: this.#p,
			onFilterChange: this.#m,
			onRunTool: async (e) => {
				if (this.#t) {
					if (this.#t.parameters = e.data.parameters || {}, this.#i = await this.#t.tool.invoke(this.#t.parameters) ?? null, this.#i) {
						let e = C.instance().models(Rp).flatMap((e) => e.toolCalls).find((e) => e.invocationId === this.#i);
						e && (this.#n = e, this.#i = null);
					}
					this.requestUpdate();
				}
			},
			onPaste: async () => {
				try {
					let e = await navigator.clipboard.readText(), t = JSON.parse(e);
					if (typeof t != "object" || !t || Array.isArray(t)) throw Error("Pasted JSON must be an object");
					this.#t && (this.#t.parameters = t, this.requestUpdate());
				} catch {}
			}
		};
		this.#e(t, {}, this.contentElement), this.#r = void 0;
	}
}, Qp = (e, t, n) => {
	if (!e.valueObject && !e.valueString && !e.errorText && !e.exceptionDetails) {
		_(b, n);
		return;
	}
	let r = e.valueObject !== void 0, i = (e) => {
		let t = new ge(e), n = new vr(new _r(t, {
			readOnly: !0,
			propertiesMode: yr.OWN_AND_INTERNAL_AND_INHERITED
		}));
		return n.title = document.createTextNode(t.description), n.listItemElement.classList.add("source-code", "object-properties-section"), n.childrenListElement.classList.add("source-code", "object-properties-section"), n.expand(), y`<devtools-tree .template=${y`
          <style>${Dr}</style>
          <style>${gr}</style>
          <ul role="tree">
            <devtools-tree-wrapper .treeElement=${n}></devtools-tree-wrapper>
          </ul>
        `}></devtools-tree>`;
	}, a = (e) => y`<div class="payload-value source-code">${e}</div>`, o = (e) => y`<div class="payload-value source-code error-text">${e}</div>`, s = (e, t = new cr()) => y`
      <div class="payload-value source-code error-text">
        ${e.frames.length === 0 && e.description ? y`<span>${e.description}\n</span>` : b}
        <div>${e.frames.map((n, r, i) => {
		let a = r < i.length - 1 ? "\n" : "", { line: o, link: s, isCallFrame: c } = n;
		if (!c) return y`<span>${o}${a}</span>`;
		if (!s) return y`<span class="formatted-builtin-stack-frame">${o}${a}</span>`;
		let l = t.linkifyScriptLocation(e.error.runtimeModel().target(), s.scriptId || null, s.url, s.lineNumber, {
			columnNumber: s.columnNumber,
			inlineFrameIndex: 0,
			showColumnNumber: !0
		});
		return l.tabIndex = -1, y`<span class="formatted-stack-frame">${s.prefix}${l}${s.suffix}${a}</span>`;
	})}</div>
        ${e.cause ? y`\n${Y(J.causedBy)}\n${s(e.cause, t)}` : b}</div>`;
	_(y`
    <style>${zp}</style>
    <div class="call-payload-view">
      <div class="call-payload-content">
            ${r ? i(e.valueObject) : e.valueString === void 0 ? e.exceptionDetails ? s(e.exceptionDetails) : e.errorText ? o(e.errorText) : b : a(e.valueString)}
      </div>
    </div>
  `, n);
}, $p = class extends tn {
	#e;
	#t;
	#n;
	#r;
	#i;
	#a;
	constructor(e, t = Qp) {
		super(e), this.#a = t;
	}
	set valueObject(e) {
		this.#e = e, this.requestUpdate();
	}
	get valueObject() {
		return this.#e;
	}
	set valueString(e) {
		this.#t = e, this.requestUpdate();
	}
	get valueString() {
		return this.#t;
	}
	set errorText(e) {
		this.#n = e, this.requestUpdate();
	}
	get errorText() {
		return this.#n;
	}
	async #o(e) {
		if (this.#r === e) return;
		this.#r = e, this.#i = void 0, this.requestUpdate();
		let t = await e;
		this.#r === e && (this.#i = t, this.requestUpdate());
	}
	set exceptionDetails(e) {
		this.#o(e);
	}
	get exceptionDetails() {
		return this.#r;
	}
	wasShown() {
		super.wasShown(), this.requestUpdate();
	}
	performUpdate() {
		let e = {
			valueObject: this.#e,
			valueString: this.#t,
			errorText: this.#n,
			exceptionDetails: this.#i
		};
		this.#a(e, {}, this.contentElement);
	}
}, em = (e, t, n) => {
	if (!e.tool) {
		_(b, n);
		return;
	}
	let r = e.tool, i = e.origin;
	_(y`
    <style>${zp}</style>
    <div class="tool-details-grid">
      <div class="label">Name</div>
      <div class="value source-code">${r.name}</div>
      <div class="label">Description</div>
      <div class="value">${r.description}</div>
      ${r.frame ? y`
      <div class="label">${Y(J.frame)}</div>
      <div class="value">${cr.linkifyRevealable(r.frame, r.frame.displayName())}</div>
      ` : b}
      ${i instanceof nn ? y`
      <div class="label">Origin</div>
      <div class="value tool-origin-container">
        <span
            class="node-text-container source-code tool-origin-node"
            data-label="true"
            @mouseenter=${() => e.highlightNode(i)}
            @mouseleave=${e.clearHighlight}>
          <devtools-node-text .data=${{
		nodeId: i.getAttribute("id") || void 0,
		nodeTitle: i.nodeNameInCorrectCase(),
		nodeClasses: i.getAttribute("class")?.split(/\s+/).filter((e) => !!e)
	}}>
          </devtools-node-text>
        </span>
        <devtools-button class="show-element"
           .title=${Y(J.viewInElementsPanel)}
           aria-label=${Y(J.viewInElementsPanel)}
           .iconName=${"select-element"}
           .jslogContext=${"elements.select-element"}
           .size=${ft.SMALL}
           .variant=${h.ICON}
           @click=${() => e.revealNode(i)}
           ></devtools-button>
      </div>` : i ? y`
      <div class="label">Origin</div>
      <div class="value stack-trace">
        ${Hp(dr, {
		stackTrace: i,
		options: { expandable: !0 }
	})}
      </div>` : b}
    </div>
    ${e.isUnregistered ? y`
      <div class="call-to-action">
        <div class="call-to-action-body">
          <div class="explanation">
            <devtools-icon class="inline-icon medium" name="warning-filled"></devtools-icon>
            ${Y(J.toolUnregisteredNotice)}
          </div>
        </div>
      </div>
    ` : b}
  `, n);
}, tm = class extends tn {
	#e = null;
	#t;
	#n = !1;
	#r;
	constructor(e, t = em) {
		super(e), this.#r = t;
	}
	set isUnregistered(e) {
		this.#n !== e && (this.#n = e, this.requestUpdate());
	}
	get isUnregistered() {
		return this.#n;
	}
	set tool(e) {
		this.#e !== e && (this.#e = e, this.#t = void 0, this.#e && this.#i(this.#e), this.requestUpdate());
	}
	async #i(e) {
		let t = await (e.node ? e.node.resolvePromise() : e.stackTrace);
		this.#e === e && t && (this.#t = t, this.requestUpdate());
	}
	get tool() {
		return this.#e;
	}
	#a = (e) => {
		e.highlight();
	};
	#o = () => {
		Xt.hideDOMNodeHighlight();
	};
	#s = (e) => {
		r(e), e.scrollIntoView();
	};
	performUpdate() {
		let e = {
			tool: this.#e,
			isUnregistered: this.#n,
			origin: this.#t,
			highlightNode: this.#a,
			clearHighlight: this.#o,
			revealNode: this.#s
		};
		this.#r(e, void 0, this.contentElement);
	}
	wasShown() {
		super.wasShown(), this.requestUpdate();
	}
}, nm = /* @__PURE__ */ new WeakMap();
function rm(e) {
	if (typeof e == "object" && e) {
		let t = nm.get(e);
		if (t) return t;
	}
	let t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), i = 0;
	function a(e) {
		let t = {};
		for (let n of e) t[String(n)] = String(n);
		return t;
	}
	function o(e, t) {
		if (typeof t != "boolean") {
			if (t.type === "string" && t.enum) n.set(e, a(t.enum));
			else if (t.type && typeof t.type == "string" && t.type !== "object" && t.type !== "array") {
				let n = ri.STRING;
				switch (t.type) {
					case "number":
					case "integer":
						n = ri.NUMBER;
						break;
					case "boolean": n = ri.BOOLEAN;
				}
				r.set(e, n);
			}
		}
	}
	function s(e, n) {
		if (typeof n != "boolean" && n.type === "object" && n.properties) {
			let r = [];
			for (let [e, t] of Object.entries(n.properties)) {
				let i = !(n.required || []).includes(e);
				r.push(c(e, t, i));
			}
			t.set(e, r);
		}
	}
	if (e.definitions) for (let [t, n] of Object.entries(e.definitions)) o(t, n);
	if (e.$defs) for (let [t, n] of Object.entries(e.$defs)) o(t, n);
	if (e.definitions) for (let [t, n] of Object.entries(e.definitions)) s(t, n);
	if (e.$defs) for (let [t, n] of Object.entries(e.$defs)) s(t, n);
	function c(e, o, s) {
		if (typeof o == "boolean") return {
			name: e,
			optional: s,
			description: "",
			type: ri.STRING,
			isCorrectType: !0
		};
		let l = o;
		if (l.$ref) {
			let t = l.$ref.split("/").pop() || "", i = ri.OBJECT;
			if (n.has(t)) i = ri.STRING;
			else {
				let e = r.get(t);
				e !== void 0 && (i = e);
			}
			return {
				name: e,
				optional: s,
				description: l.description || "",
				type: i,
				typeRef: t,
				isCorrectType: !0
			};
		}
		let u = Array.isArray(l.type) ? l.type[0] : l.type, d = u === "integer" ? "number" : u;
		u || (d = l.properties ? "object" : l.items ? "array" : "unknown");
		let ee = l.description || "", f = ri.UNKNOWN;
		switch (d) {
			case "string":
				f = ri.STRING;
				break;
			case "number":
				f = ri.NUMBER;
				break;
			case "boolean":
				f = ri.BOOLEAN;
				break;
			case "object":
				f = ri.OBJECT;
				break;
			case "array": f = ri.ARRAY;
		}
		let p = {
			name: e,
			optional: s,
			description: ee,
			type: f,
			isCorrectType: !0
		};
		if (d === "object") {
			if (l.properties) {
				let e = `Object_${++i}`, n = [];
				for (let [e, t] of Object.entries(l.properties)) {
					let r = !(l.required || []).includes(e);
					n.push(c(e, t, r));
				}
				t.set(e, n), p.typeRef = e;
			} else p.isKeyEditable = !0;
		} else if (d === "array") {
			let e = l.items && !Array.isArray(l.items) && typeof l.items != "boolean" ? l.items : void 0;
			if (e) {
				let r = Array.isArray(e.type) ? e.type[0] : e.type;
				if (e.$ref) p.typeRef = e.$ref.split("/").pop() || "";
				else if (r === "object" && e.properties) {
					let n = `Object_${++i}`, r = [];
					for (let [t, n] of Object.entries(e.properties)) {
						let i = !(e.required || []).includes(t);
						r.push(c(t, n, i));
					}
					t.set(n, r), p.typeRef = n;
				} else if (r) {
					let t = r === "integer" ? "number" : r;
					if (t === "string" && e.enum) {
						let t = `Enum_${++i}`;
						n.set(t, a(e.enum)), p.typeRef = t;
					} else p.typeRef = t;
				} else p.typeRef = "string";
			} else p.typeRef = "string";
		} else if (d === "string" && l.enum) {
			let e = `Enum_${++i}`;
			n.set(e, a(l.enum)), p.typeRef = e;
		}
		return p;
	}
	let l = [];
	if ((e.type === "object" || !e.type) && e.properties) for (let [t, n] of Object.entries(e.properties)) {
		let r = !(e.required || []).includes(t);
		l.push(c(t, n, r));
	}
	let u = {
		parameters: l,
		typesByName: t,
		enumsByName: n
	};
	return typeof e == "object" && e && nm.set(e, u), u;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/application/WebMCPTreeElement.ts
var im = /* @__PURE__ */ e({ WebMCPTreeElement: () => am }), am = class extends A {
	#e;
	constructor(e) {
		super(e, "WebMCP", !1, "web-mcp");
		let t = v("document");
		this.setLeadingIcons([t]);
	}
	get itemURL() {
		return "webMcp://";
	}
	onselect(e) {
		return super.onselect(e), this.#e ||= new Zp(), this.showView(this.#e), Yt.instance().panelShown("web-mcp"), !1;
	}
}, om = /* @__PURE__ */ e({
	AppManifestTreeElement: () => mm,
	ApplicationPanelSidebar: () => dm,
	BackgroundServiceTreeElement: () => fm,
	ClearStorageTreeElement: () => hm,
	CookieTreeElement: () => Cm,
	DOMStorageTreeElement: () => bm,
	ExtensionStorageTreeElement: () => xm,
	ExtensionStorageTreeParentElement: () => Sm,
	FrameResourceTreeElement: () => Om,
	FrameTreeElement: () => Em,
	IDBDatabaseTreeElement: () => _m,
	IDBIndexTreeElement: () => ym,
	IDBObjectStoreTreeElement: () => vm,
	IndexedDBTreeElement: () => gm,
	ResourcesSection: () => Tm,
	ServiceWorkersTreeElement: () => pm,
	SharedStorageTreeElementDispatcher: () => um,
	StorageCategoryView: () => wm
}), X = {
	application: "Application",
	storage: "Storage",
	noLocalStorage: "No local storage detected",
	localStorage: "Local storage",
	localStorageDescription: "On this page you can view, add, edit, and delete local storage key-value pairs.",
	sessionStorage: "Session storage",
	noSessionStorage: "No session storage detected",
	sessionStorageDescription: "On this page you can view, add, edit, and delete session storage key-value pairs.",
	extensionStorage: "Extension storage",
	noExtensionStorage: "No extension storage detected",
	extensionStorageDescription: "On this page you can view, add, edit, and delete extension storage key-value pairs.",
	extensionSessionStorage: "Session",
	extensionLocalStorage: "Local",
	extensionSyncStorage: "Sync",
	extensionManagedStorage: "Managed",
	cookies: "Cookies",
	noCookies: "No cookies set",
	cookiesDescription: "On this page you can view, add, edit, and delete cookies.",
	backgroundServices: "Background services",
	frames: "Frames",
	manifest: "Manifest",
	indexeddb: "IndexedDB",
	noIndexeddb: "No indexedDB detected",
	indexeddbDescription: "On this page you can view and delete indexedDB key-value pairs and databases.",
	refreshIndexeddb: "Refresh IndexedDB",
	versionSEmpty: "Version: {PH1} (empty)",
	versionS: "Version: {PH1}",
	clear: "Clear",
	keyPathS: "Key path: {PH1}",
	localFiles: "Local Files",
	cookiesUsedByFramesFromS: "Cookies used by frames from {PH1}",
	openedWindows: "Opened Windows",
	openedWindowsDescription: "On this page you can view windows opened via window.open().",
	webWorkers: "Web Workers",
	documentNotAvailable: "No document detected",
	theContentOfThisDocumentHasBeen: "The content of this document has been generated dynamically via 'document.write()'.",
	windowWithoutTitle: "Window without title",
	worker: "worker",
	workerDescription: "On this page you can view dedicated workers that are created by the parent frame.",
	onInvokeManifestAlert: "Manifest: Invoke to scroll to the top of manifest",
	beforeInvokeAlert: "{PH1}: Invoke to scroll to this section in manifest",
	onInvokeAlert: "Scrolled to {PH1}",
	applicationSidebarPanel: "Application panel sidebar",
	resourceDescription: "On this page you can view the frame's resources."
}, sm = s("panels/application/ApplicationPanelSidebar.ts", X), Z = a.bind(void 0, sm);
function cm(e) {
	if (e === "main") throw Error("Unexpected main target id");
}
function lm(e) {
	switch (e) {
		case ot.StorageArea.Session: return Z(X.extensionSessionStorage);
		case ot.StorageArea.Local: return Z(X.extensionLocalStorage);
		case ot.StorageArea.Sync: return Z(X.extensionSyncStorage);
		case ot.StorageArea.Managed: return Z(X.extensionManagedStorage);
		default: throw Error(`Unrecognized storage type: ${e}`);
	}
}
var um;
(function(e) {
	e.Events = /* @__PURE__ */ function(e) {
		return e.SHARED_STORAGE_TREE_ELEMENT_ADDED = "SharedStorageTreeElementAdded", e;
	}({});
})(um ||= {});
var dm = class extends S {
	panel;
	sidebarTree;
	applicationTreeElement;
	serviceWorkersTreeElement;
	localStorageListTreeElement;
	sessionStorageListTreeElement;
	extensionStorageListTreeElement;
	indexedDBListTreeElement;
	interestGroupTreeElement;
	cookieListTreeElement;
	trustTokensTreeElement;
	cacheStorageListTreeElement;
	sharedStorageListTreeElement;
	storageBucketsTreeElement;
	backForwardCacheListTreeElement;
	backgroundFetchTreeElement;
	backgroundSyncTreeElement;
	bounceTrackingMitigationsTreeElement;
	notificationsTreeElement;
	paymentHandlerTreeElement;
	periodicBackgroundSyncTreeElement;
	pushMessagingTreeElement;
	reportingApiTreeElement;
	webMcpTreeElement;
	deviceBoundSessionsRootTreeElement;
	deviceBoundSessionsModel;
	preloadingSummaryTreeElement;
	resourcesSection;
	domStorageTreeElements;
	extensionIdToStorageTreeParentElement;
	extensionStorageModels;
	extensionStorageTreeElements;
	sharedStorageTreeElements;
	domains;
	target;
	previousHoveredElement;
	sharedStorageTreeElementDispatcher;
	constructor(e) {
		super(), this.panel = e, this.sidebarTree = new an(St.NAVIGATION_TREE), this.sidebarTree.registerRequiredCSS(Gd), this.sidebarTree.element.classList.add("resources-sidebar"), this.sidebarTree.setHideOverflow(!0), this.sidebarTree.element.classList.add("filter-all"), this.sidebarTree.addEventListener(mn.ElementAttached, this.treeElementAdded, this), this.contentElement.appendChild(this.sidebarTree.element);
		let t = Z(X.application);
		this.applicationTreeElement = this.addSidebarSection(t, "application");
		let n = this.applicationTreeElement.treeOutline?.contentElement;
		n && (n.ariaLabel = Z(X.applicationSidebarPanel));
		let r = new mm(e);
		this.applicationTreeElement.appendChild(r), r.generateChildren(), this.serviceWorkersTreeElement = new pm(e), this.applicationTreeElement.appendChild(this.serviceWorkersTreeElement);
		let i = new hm(e);
		this.applicationTreeElement.appendChild(i), zn.devToolsWebMCPSupport?.enabled && (this.webMcpTreeElement = new am(e), this.applicationTreeElement.appendChild(this.webMcpTreeElement));
		let a = Z(X.storage), o = this.addSidebarSection(a, "storage");
		this.localStorageListTreeElement = new si(e, Z(X.localStorage), Z(X.noLocalStorage), Z(X.localStorageDescription), "local-storage"), this.localStorageListTreeElement.setLink("https://developer.chrome.com/docs/devtools/storage/localstorage/");
		let s = v("table");
		this.localStorageListTreeElement.setLeadingIcons([s]), o.appendChild(this.localStorageListTreeElement), this.sessionStorageListTreeElement = new si(e, Z(X.sessionStorage), Z(X.noSessionStorage), Z(X.sessionStorageDescription), "session-storage"), this.sessionStorageListTreeElement.setLink("https://developer.chrome.com/docs/devtools/storage/sessionstorage/");
		let l = v("table");
		this.sessionStorageListTreeElement.setLeadingIcons([l]), o.appendChild(this.sessionStorageListTreeElement), this.extensionStorageListTreeElement = new si(e, Z(X.extensionStorage), Z(X.noExtensionStorage), Z(X.extensionStorageDescription), "extension-storage"), this.extensionStorageListTreeElement.setLink("https://developer.chrome.com/docs/extensions/reference/api/storage/");
		let u = v("table");
		this.extensionStorageListTreeElement.setLeadingIcons([u]), o.appendChild(this.extensionStorageListTreeElement), this.indexedDBListTreeElement = new gm(e), this.indexedDBListTreeElement.setLink("https://developer.chrome.com/docs/devtools/storage/indexeddb/"), o.appendChild(this.indexedDBListTreeElement), this.cookieListTreeElement = new si(e, Z(X.cookies), Z(X.noCookies), Z(X.cookiesDescription), "cookies"), this.cookieListTreeElement.setLink("https://developer.chrome.com/docs/devtools/storage/cookies/");
		let d = v("cookie");
		this.cookieListTreeElement.setLeadingIcons([d]), o.appendChild(this.cookieListTreeElement), this.trustTokensTreeElement = new Dp(e), o.appendChild(this.trustTokensTreeElement), this.interestGroupTreeElement = new Sl(e), o.appendChild(this.interestGroupTreeElement), this.sharedStorageListTreeElement = new Mf(e), o.appendChild(this.sharedStorageListTreeElement), this.cacheStorageListTreeElement = new af(e), o.appendChild(this.cacheStorageListTreeElement), this.storageBucketsTreeElement = new hp(e), o.appendChild(this.storageBucketsTreeElement);
		let ee = Z(X.backgroundServices), f = this.addSidebarSection(ee, "background-services");
		this.backForwardCacheListTreeElement = new as(e), f.appendChild(this.backForwardCacheListTreeElement), this.backgroundFetchTreeElement = new fm(e, Je.ServiceName.BackgroundFetch), f.appendChild(this.backgroundFetchTreeElement), this.backgroundSyncTreeElement = new fm(e, Je.ServiceName.BackgroundSync), f.appendChild(this.backgroundSyncTreeElement), this.bounceTrackingMitigationsTreeElement = new ys(e), f.appendChild(this.bounceTrackingMitigationsTreeElement), this.notificationsTreeElement = new fm(e, Je.ServiceName.Notifications), f.appendChild(this.notificationsTreeElement), this.paymentHandlerTreeElement = new fm(e, Je.ServiceName.PaymentHandler), f.appendChild(this.paymentHandlerTreeElement), this.periodicBackgroundSyncTreeElement = new fm(e, Je.ServiceName.PeriodicBackgroundSync), f.appendChild(this.periodicBackgroundSyncTreeElement), this.preloadingSummaryTreeElement = new Sd(e), f.appendChild(this.preloadingSummaryTreeElement), this.preloadingSummaryTreeElement.constructChildren(e), this.pushMessagingTreeElement = new fm(e, Je.ServiceName.PushMessaging), f.appendChild(this.pushMessagingTreeElement), this.reportingApiTreeElement = new Ud(e), f.appendChild(this.reportingApiTreeElement), zn.deviceBoundSessionsDebugging?.enabled && (this.deviceBoundSessionsModel = new xs(), this.deviceBoundSessionsRootTreeElement = new Ds(e, this.deviceBoundSessionsModel), f.appendChild(this.deviceBoundSessionsRootTreeElement));
		let p = Z(X.frames), te = this.addSidebarSection(p, "frames");
		this.resourcesSection = new Tm(e, te), this.domStorageTreeElements = /* @__PURE__ */ new Map(), this.extensionIdToStorageTreeParentElement = /* @__PURE__ */ new Map(), this.extensionStorageTreeElements = /* @__PURE__ */ new Map(), this.extensionStorageModels = [], this.sharedStorageTreeElements = /* @__PURE__ */ new Map(), this.domains = {}, this.sidebarTree.contentElement.addEventListener("mousemove", this.onmousemove.bind(this), !1), this.sidebarTree.contentElement.addEventListener("mouseleave", this.onmouseleave.bind(this), !1), C.instance().observeTargets(this, { scoped: !0 }), C.instance().addModelListener(qe, g.FrameNavigated, this.frameNavigated, this, { scoped: !0 }), this.panel.lastSelectedItemPath().length || r.select(), C.instance().observeModels(le, {
			modelAdded: (e) => this.domStorageModelAdded(e),
			modelRemoved: (e) => this.domStorageModelRemoved(e)
		}, { scoped: !0 }), C.instance().observeModels(As, {
			modelAdded: (e) => this.extensionStorageModelAdded(e),
			modelRemoved: (e) => this.extensionStorageModelRemoved(e)
		}, { scoped: !0 }), C.instance().observeModels(qc, {
			modelAdded: (e) => this.indexedDBModelAdded(e),
			modelRemoved: (e) => this.indexedDBModelRemoved(e)
		}, { scoped: !0 }), C.instance().observeModels(ll, {
			modelAdded: (e) => this.interestGroupModelAdded(e),
			modelRemoved: (e) => this.interestGroupModelRemoved(e)
		}, { scoped: !0 }), C.instance().observeModels(Ff, {
			modelAdded: (e) => this.sharedStorageModelAdded(e).catch((e) => {
				console.error(e);
			}),
			modelRemoved: (e) => this.sharedStorageModelRemoved(e)
		}, { scoped: !0 }), C.instance().observeModels(vn, {
			modelAdded: (e) => this.storageBucketsModelAdded(e),
			modelRemoved: (e) => this.storageBucketsModelRemoved(e)
		}, { scoped: !0 }), this.sharedStorageTreeElementDispatcher = new c(), this.contentElement.style.contain = "layout style";
	}
	addSidebarSection(e, t) {
		let n = new Ut(e, !0, t);
		return n.listItemElement.classList.add("storage-group-list-item"), n.setCollapsible(!1), n.selectable = !1, this.sidebarTree.appendChild(n), Ve(n.listItemElement, 3), ue(n.childrenListElement, e), n;
	}
	targetAdded(e) {
		if (e !== e.outermostTarget()) return;
		this.target = e;
		let t = e.model(ll);
		t && t.addEventListener(ul.INTEREST_GROUP_ACCESS, this.interestGroupAccess, this);
		let n = e.model(qe);
		n && (n.cachedResourcesLoaded() && this.initialize(), n.addEventListener(g.CachedResourcesLoaded, this.initialize, this), n.addEventListener(g.WillLoadCachedResources, this.resetWithFrames, this));
	}
	targetRemoved(e) {
		if (e !== this.target) return;
		delete this.target;
		let t = e.model(qe);
		t && (t.removeEventListener(g.CachedResourcesLoaded, this.initialize, this), t.removeEventListener(g.WillLoadCachedResources, this.resetWithFrames, this));
		let n = e.model(ll);
		n && n.removeEventListener(ul.INTEREST_GROUP_ACCESS, this.interestGroupAccess, this), this.resetWithFrames();
	}
	focus() {
		this.sidebarTree.focus();
	}
	initialize() {
		for (let e of qe.frames()) this.addCookieDocument(e);
		let e = this.target?.model(ll);
		e && e.enable(), this.cacheStorageListTreeElement.initialize();
		let t = this.target?.model(ss) || null;
		this.backgroundFetchTreeElement.initialize(t), this.backgroundSyncTreeElement.initialize(t), this.notificationsTreeElement.initialize(t), this.paymentHandlerTreeElement.initialize(t), this.periodicBackgroundSyncTreeElement.initialize(t), this.pushMessagingTreeElement.initialize(t), this.storageBucketsTreeElement?.initialize();
		let n = this.target?.model(kt);
		n && this.preloadingSummaryTreeElement?.initialize(n);
	}
	domStorageModelAdded(e) {
		e.enable(), e.storages().forEach(this.addDOMStorage.bind(this)), e.addEventListener(ze.DOM_STORAGE_ADDED, this.domStorageAdded, this), e.addEventListener(ze.DOM_STORAGE_REMOVED, this.domStorageRemoved, this);
	}
	domStorageModelRemoved(e) {
		e.storages().forEach(this.removeDOMStorage.bind(this)), e.removeEventListener(ze.DOM_STORAGE_ADDED, this.domStorageAdded, this), e.removeEventListener(ze.DOM_STORAGE_REMOVED, this.domStorageRemoved, this);
	}
	extensionStorageModelAdded(e) {
		this.extensionStorageModels.push(e), e.enable(), e.storages().forEach(this.addExtensionStorage.bind(this)), e.addEventListener(js.EXTENSION_STORAGE_ADDED, this.extensionStorageAdded, this), e.addEventListener(js.EXTENSION_STORAGE_REMOVED, this.extensionStorageRemoved, this);
	}
	extensionStorageModelRemoved(e) {
		console.assert(this.extensionStorageModels.includes(e)), this.extensionStorageModels.splice(this.extensionStorageModels.indexOf(e), 1), e.storages().forEach(this.removeExtensionStorage.bind(this)), e.removeEventListener(js.EXTENSION_STORAGE_ADDED, this.extensionStorageAdded, this), e.removeEventListener(js.EXTENSION_STORAGE_REMOVED, this.extensionStorageRemoved, this);
	}
	indexedDBModelAdded(e) {
		e.enable(), this.indexedDBListTreeElement.addIndexedDBForModel(e);
	}
	indexedDBModelRemoved(e) {
		this.indexedDBListTreeElement.removeIndexedDBForModel(e);
	}
	interestGroupModelAdded(e) {
		e.enable(), e.addEventListener(ul.INTEREST_GROUP_ACCESS, this.interestGroupAccess, this);
	}
	interestGroupModelRemoved(e) {
		e.disable(), e.removeEventListener(ul.INTEREST_GROUP_ACCESS, this.interestGroupAccess, this);
	}
	async sharedStorageModelAdded(e) {
		await e.enable();
		for (let t of e.storages()) await this.addSharedStorage(t);
		e.addEventListener(If.SHARED_STORAGE_ADDED, this.sharedStorageAdded, this), e.addEventListener(If.SHARED_STORAGE_REMOVED, this.sharedStorageRemoved, this), e.addEventListener(If.SHARED_STORAGE_ACCESS, this.sharedStorageAccess, this);
	}
	sharedStorageModelRemoved(e) {
		e.disable();
		for (let t of e.storages()) this.removeSharedStorage(t);
		e.removeEventListener(If.SHARED_STORAGE_ADDED, this.sharedStorageAdded, this), e.removeEventListener(If.SHARED_STORAGE_REMOVED, this.sharedStorageRemoved, this), e.removeEventListener(If.SHARED_STORAGE_ACCESS, this.sharedStorageAccess, this);
	}
	storageBucketsModelAdded(e) {
		e.enable();
	}
	storageBucketsModelRemoved(e) {
		this.storageBucketsTreeElement?.removeBucketsForModel(e);
	}
	resetWithFrames() {
		this.resourcesSection.reset(), this.reset();
	}
	treeElementAdded(e) {
		let t = this.panel.lastSelectedItemPath();
		if (!t.length) return;
		let n = e.data, r = [n];
		for (let e = n.parent; e && "itemURL" in e && e.itemURL; e = e.parent) r.push(e);
		let i = t.length - 1, a = r.length - 1;
		for (; i >= 0 && a >= 0 && t[i] === r[a].itemURL;) r[a].expanded || (i > 0 && r[a].expand(), r[a].selected || r[a].select()), i--, a--;
	}
	reset() {
		this.domains = {}, this.cookieListTreeElement.removeChildren(), this.interestGroupTreeElement.clearEvents(), this.deviceBoundSessionsModel?.clearVisibleSites(), this.deviceBoundSessionsModel?.clearEvents();
	}
	frameNavigated(e) {
		let t = e.data;
		t.isOutermostFrame() && this.reset(), this.addCookieDocument(t);
	}
	interestGroupAccess(e) {
		this.interestGroupTreeElement.addEvent(e.data);
	}
	addCookieDocument(e) {
		let t = e.unreachableUrl() || e.url, n = re.fromString(t);
		if (!n || n.scheme !== "http" && n.scheme !== "https" && n.scheme !== "file") return;
		let r = n.securityOrigin();
		if (!this.domains[r]) {
			this.domains[r] = !0;
			let t = new Cm(this.panel, e, n);
			this.cookieListTreeElement.appendChild(t), this.deviceBoundSessionsModel && e.resourceTreeModel().target().networkAgent().invoke_fetchSchemefulSite({ origin: r }).then((e) => {
				!e.getError() && this.deviceBoundSessionsModel && this.domains[r] && this.deviceBoundSessionsModel.addVisibleSite(e.schemefulSite);
			});
		}
	}
	domStorageAdded(e) {
		let t = e.data;
		this.addDOMStorage(t);
	}
	addDOMStorage(e) {
		console.assert(!this.domStorageTreeElements.get(e)), console.assert(!!e.storageKey);
		let t = new bm(this.panel, e);
		this.domStorageTreeElements.set(e, t), e.isLocalStorage ? this.localStorageListTreeElement.appendChild(t, n) : this.sessionStorageListTreeElement.appendChild(t, n);
		function n(e, t) {
			let n = e.titleAsText().toLocaleLowerCase(), r = t.titleAsText().toLocaleUpperCase();
			return n.localeCompare(r);
		}
	}
	domStorageRemoved(e) {
		let t = e.data;
		this.removeDOMStorage(t);
	}
	removeDOMStorage(e) {
		let t = this.domStorageTreeElements.get(e);
		if (!t) return;
		let n = t.selected, r = t.parent;
		r && (r.removeChild(t), n && r.select()), this.domStorageTreeElements.delete(e);
	}
	extensionStorageAdded(e) {
		let t = e.data;
		this.addExtensionStorage(t);
	}
	useTreeViewForExtensionStorage(e) {
		return !e.matchesTarget(this.target);
	}
	getExtensionStorageAreaParent(e) {
		if (!this.useTreeViewForExtensionStorage(e)) return this.extensionStorageListTreeElement;
		let t = this.extensionIdToStorageTreeParentElement.get(e.extensionId);
		if (t) return t;
		let n = new Sm(this.panel, e.extensionId, e.name);
		return this.extensionIdToStorageTreeParentElement.set(e.extensionId, n), this.extensionStorageListTreeElement?.appendChild(n), n;
	}
	addExtensionStorage(e) {
		if (this.extensionStorageModels.find((t) => t !== e.model && t.storageForIdAndArea(e.extensionId, e.storageArea))) return;
		console.assert(!!this.extensionStorageListTreeElement), console.assert(!this.extensionStorageTreeElements.get(e.key));
		let t = new xm(this.panel, e);
		this.extensionStorageTreeElements.set(e.key, t), this.getExtensionStorageAreaParent(e)?.appendChild(t, n);
		function n(e, t) {
			let n = (e) => e.storageArea, r = [
				ot.StorageArea.Session,
				ot.StorageArea.Local,
				ot.StorageArea.Sync,
				ot.StorageArea.Managed
			];
			return r.indexOf(n(e)) - r.indexOf(n(t));
		}
	}
	extensionStorageRemoved(e) {
		let t = e.data;
		this.removeExtensionStorage(t);
	}
	removeExtensionStorage(e) {
		if (this.extensionStorageModels.find(((t) => t.storageForIdAndArea(e.extensionId, e.storageArea)))) return;
		let t = this.extensionStorageTreeElements.get(e.key);
		if (!t) return;
		let n = t.selected, r = t.parent;
		r && (r.removeChild(t), this.useTreeViewForExtensionStorage(e) && r.childCount() === 0 ? (this.extensionStorageListTreeElement?.removeChild(r), this.extensionIdToStorageTreeParentElement.delete(e.extensionId)) : n && r.select()), this.extensionStorageTreeElements.delete(e.key);
	}
	async sharedStorageAdded(e) {
		await this.addSharedStorage(e.data);
	}
	async addSharedStorage(e) {
		let t = await up.createElement(this.panel, e);
		this.sharedStorageTreeElements.has(e.securityOrigin) || (this.sharedStorageTreeElements.set(e.securityOrigin, t), this.sharedStorageListTreeElement.appendChild(t), this.sharedStorageTreeElementDispatcher.dispatchEventToListeners(um.Events.SHARED_STORAGE_TREE_ELEMENT_ADDED, { origin: e.securityOrigin }));
	}
	sharedStorageRemoved(e) {
		this.removeSharedStorage(e.data);
	}
	removeSharedStorage(e) {
		let t = this.sharedStorageTreeElements.get(e.securityOrigin);
		if (!t) return;
		let n = t.selected, r = t.parent;
		r && (r.removeChild(t), r.setExpandable(r.childCount() > 0), n && r.select()), this.sharedStorageTreeElements.delete(e.securityOrigin);
	}
	sharedStorageAccess(e) {
		this.sharedStorageListTreeElement.addEvent(e.data);
	}
	async showResource(e, t, n) {
		await this.resourcesSection.revealResource(e, t, n);
	}
	showFrame(e) {
		this.resourcesSection.revealAndSelectFrame(e);
	}
	showPreloadingRuleSetView(e) {
		this.preloadingSummaryTreeElement && this.preloadingSummaryTreeElement.expandAndRevealRuleSet(e);
	}
	showPreloadingAttemptViewWithFilter(e) {
		this.preloadingSummaryTreeElement && this.preloadingSummaryTreeElement.expandAndRevealAttempts(e);
	}
	showStorageBucket(e) {
		let t = C.instance().primaryPageTarget()?.model(vn);
		t && this.storageBucketsTreeElement?.getBucketTreeElement(t, e)?.revealAndSelect(!0);
	}
	onmousemove(e) {
		let t = e.target;
		if (!t) return;
		let n = En(t, "li");
		if (!n) return;
		let r = Ut.getTreeElementBylistItemNode(n);
		this.previousHoveredElement !== r && (this.previousHoveredElement && (this.previousHoveredElement.hovered = !1, delete this.previousHoveredElement), r instanceof Em && (this.previousHoveredElement = r, r.hovered = !0));
	}
	onmouseleave(e) {
		this.previousHoveredElement && (this.previousHoveredElement.hovered = !1, delete this.previousHoveredElement);
	}
}, fm = class extends A {
	serviceName;
	view;
	model;
	#e;
	constructor(e, t) {
		super(e, fs.getUIString(t), !1, Xn(t)), this.serviceName = t, this.#e = !1, this.view = null, this.model = null;
		let n = v(this.getIconType());
		this.setLeadingIcons([n]);
	}
	getIconType() {
		switch (this.serviceName) {
			case Je.ServiceName.BackgroundFetch: return "arrow-up-down";
			case Je.ServiceName.BackgroundSync: return "sync";
			case Je.ServiceName.PushMessaging: return "cloud";
			case Je.ServiceName.Notifications: return "bell";
			case Je.ServiceName.PaymentHandler: return "credit-card";
			case Je.ServiceName.PeriodicBackgroundSync: return "watch";
			default: return console.error(`Service ${this.serviceName} does not have a dedicated icon`), "table";
		}
	}
	initialize(e) {
		this.model = e, this.#e && !this.view && this.onselect(!1);
	}
	get itemURL() {
		return `background-service://${this.serviceName}`;
	}
	get selectable() {
		return this.model ? super.selectable : !1;
	}
	onselect(e) {
		return super.onselect(e), this.#e = !0, this.model ? (this.view ||= new fs(this.serviceName, this.model), this.showView(this.view), jt.instance().setFlavor(fs, this.view), Yt.instance().panelShown("background_service_" + this.serviceName), !1) : !1;
	}
}, pm = class extends A {
	view;
	constructor(e) {
		super(e, d("Service workers"), !1, "service-workers");
		let t = v("gears");
		this.setLeadingIcons([t]);
	}
	get itemURL() {
		return "service-workers://";
	}
	onselect(e) {
		return super.onselect(e), this.view ||= new yf(), this.showView(this.view), Yt.instance().panelShown("service-workers"), !1;
	}
}, mm = class extends A {
	view;
	constructor(e) {
		super(e, Z(X.manifest), !0, "manifest");
		let t = v("document");
		this.setLeadingIcons([t]), self.onInvokeElement(this.listItemElement, this.onInvoke.bind(this)), this.view = new es(), ue(this.listItemElement, Z(X.onInvokeManifestAlert));
		let n = (e) => {
			this.setExpandable(e);
		};
		this.view.addEventListener(ts.MANIFEST_DETECTED, (e) => n(e.data));
	}
	get itemURL() {
		return "manifest://";
	}
	onselect(e) {
		return super.onselect(e), this.showView(this.view), Yt.instance().panelShown("app-manifest"), !1;
	}
	generateChildren() {
		let e = this.view.getStaticSections();
		for (let t of e) {
			let e = t.title, n = new A(this.resourcesPanel, e, !1, t.jslogContext || "");
			n.onselect = (t) => (t && (this.showView(this.view), this.view.scrollToSection(e)), !0);
			let r = v("document");
			n.setLeadingIcons([r]), n.listItemElement.addEventListener("keydown", (t) => {
				t.key !== "Tab" || t.shiftKey || this.view.focusOnSection(e) && t.consume(!0);
			}), ue(n.listItemElement, Z(X.beforeInvokeAlert, { PH1: n.listItemElement.title })), this.appendChild(n);
		}
	}
	onInvoke() {
		this.view.getManifestElement().scrollIntoView(), Ke.alert(Z(X.onInvokeAlert, { PH1: this.listItemElement.title }));
	}
}, hm = class extends A {
	view;
	constructor(e) {
		super(e, Z(X.storage), !1, "storage");
		let t = v("database");
		this.setLeadingIcons([t]);
	}
	get itemURL() {
		return "clear-storage://";
	}
	onselect(e) {
		return super.onselect(e), this.view ||= new bp(), this.showView(this.view), Yt.instance().panelShown(jn[jn.storage]), !1;
	}
}, gm = class extends si {
	idbDatabaseTreeElements;
	storageBucket;
	constructor(e, t) {
		super(e, Z(X.indexeddb), Z(X.noIndexeddb), Z(X.indexeddbDescription), "indexed-db");
		let n = v("database");
		this.setLeadingIcons([n]), this.idbDatabaseTreeElements = [], this.storageBucket = t, this.initialize();
	}
	initialize() {
		C.instance().addModelListener(qc, Jc.DatabaseAdded, this.indexedDBAdded, this, { scoped: !0 }), C.instance().addModelListener(qc, Jc.DatabaseRemoved, this.indexedDBRemoved, this, { scoped: !0 }), C.instance().addModelListener(qc, Jc.DatabaseLoaded, this.indexedDBLoaded, this, { scoped: !0 }), C.instance().addModelListener(qc, Jc.IndexedDBContentUpdated, this.indexedDBContentUpdated, this, { scoped: !0 }), this.idbDatabaseTreeElements = [];
		for (let e of C.instance().models(qc, { scoped: !0 })) {
			let t = e.databases();
			for (let n = 0; n < t.length; ++n) this.addIndexedDB(e, t[n]);
		}
	}
	addIndexedDBForModel(e) {
		for (let t of e.databases()) this.addIndexedDB(e, t);
	}
	removeIndexedDBForModel(e) {
		let t = this.idbDatabaseTreeElements.filter((t) => t.model === e);
		for (let e of t) this.removeIDBDatabaseTreeElement(e);
	}
	onattach() {
		super.onattach(), this.listItemElement.addEventListener("contextmenu", this.handleContextMenuEvent.bind(this), !0);
	}
	handleContextMenuEvent(e) {
		let t = new bt(e);
		t.defaultSection().appendItem(Z(X.refreshIndexeddb), this.refreshIndexedDB.bind(this), { jslogContext: "refresh-indexeddb" }), t.show();
	}
	refreshIndexedDB() {
		for (let e of C.instance().models(qc, { scoped: !0 })) e.refreshDatabaseNames();
	}
	databaseInTree(e) {
		return !this.storageBucket || e.inBucket(this.storageBucket);
	}
	indexedDBAdded({ data: { databaseId: e, model: t } }) {
		this.addIndexedDB(t, e);
	}
	addIndexedDB(e, t) {
		if (!this.databaseInTree(t)) return;
		let n = new _m(this.resourcesPanel, e, t);
		this.idbDatabaseTreeElements.push(n), this.appendChild(n), e.refreshDatabase(t);
	}
	indexedDBRemoved({ data: { databaseId: e, model: t } }) {
		let n = this.idbDatabaseTreeElement(t, e);
		n && this.removeIDBDatabaseTreeElement(n);
	}
	removeIDBDatabaseTreeElement(e) {
		e.clear(), this.removeChild(e), f(this.idbDatabaseTreeElements, e), this.setExpandable(this.childCount() > 0);
	}
	indexedDBLoaded({ data: { database: e, model: t, entriesUpdated: n } }) {
		let r = this.idbDatabaseTreeElement(t, e.databaseId);
		r && (r.update(e, n), this.indexedDBLoadedForTest());
	}
	indexedDBLoadedForTest() {}
	indexedDBContentUpdated({ data: { databaseId: e, objectStoreName: t, model: n } }) {
		let r = this.idbDatabaseTreeElement(n, e);
		r && r.indexedDBContentUpdated(t);
	}
	idbDatabaseTreeElement(e, t) {
		return this.idbDatabaseTreeElements.find((n) => n.databaseId.equals(t) && n.model === e) || null;
	}
}, _m = class extends A {
	model;
	databaseId;
	idbObjectStoreTreeElements;
	database;
	view;
	constructor(e, t, n) {
		super(e, n.name, !1, "indexed-db-database"), this.model = t, this.databaseId = n, this.idbObjectStoreTreeElements = /* @__PURE__ */ new Map();
		let r = v("database");
		this.setLeadingIcons([r]), this.model.addEventListener(Jc.DatabaseNamesRefreshed, this.refreshIndexedDB, this);
	}
	get itemURL() {
		return "indexedDB://" + this.databaseId.storageBucket.storageKey + "/" + (this.databaseId.storageBucket.name ?? "") + "/" + this.databaseId.name;
	}
	onattach() {
		super.onattach(), this.listItemElement.addEventListener("contextmenu", this.handleContextMenuEvent.bind(this), !0);
	}
	handleContextMenuEvent(e) {
		let t = new bt(e);
		t.defaultSection().appendItem(Z(X.refreshIndexeddb), this.refreshIndexedDB.bind(this), { jslogContext: "refresh-indexeddb" }), t.show();
	}
	refreshIndexedDB() {
		this.model.refreshDatabase(this.databaseId);
	}
	indexedDBContentUpdated(e) {
		let t = this.idbObjectStoreTreeElements.get(e);
		t && t.markNeedsRefresh();
	}
	update(e, t) {
		this.database = e;
		let n = /* @__PURE__ */ new Set();
		for (let e of [...this.database.objectStores.keys()].sort()) {
			let r = this.database.objectStores.get(e);
			if (!r) continue;
			n.add(r.name);
			let i = this.idbObjectStoreTreeElements.get(r.name);
			i || (i = new vm(this.resourcesPanel, this.model, this.databaseId, r), this.idbObjectStoreTreeElements.set(r.name, i), this.appendChild(i)), i.update(r, t);
		}
		for (let e of this.idbObjectStoreTreeElements.keys()) n.has(e) || this.objectStoreRemoved(e);
		this.view && this.view.getComponent().update(e), this.updateTooltip();
	}
	updateTooltip() {
		let e = this.database ? this.database.version : "-";
		this.tooltip = Object.keys(this.idbObjectStoreTreeElements).length === 0 ? Z(X.versionSEmpty, { PH1: e }) : Z(X.versionS, { PH1: e });
	}
	get selectable() {
		return this.database ? super.selectable : !1;
	}
	onselect(e) {
		return super.onselect(e), this.database ? (this.view ||= oi(S, new al(this.model, this.database), "indexeddb-data"), this.showView(this.view), Yt.instance().panelShown("indexed-db"), !1) : !1;
	}
	objectStoreRemoved(e) {
		let t = this.idbObjectStoreTreeElements.get(e);
		t && (t.clear(), this.removeChild(t)), this.idbObjectStoreTreeElements.delete(e), this.updateTooltip();
	}
	clear() {
		for (let e of this.idbObjectStoreTreeElements.keys()) this.objectStoreRemoved(e);
	}
}, vm = class extends A {
	model;
	databaseId;
	idbIndexTreeElements;
	objectStore;
	view;
	constructor(e, t, n, r) {
		super(e, r.name, !1, "indexed-db-object-store"), this.model = t, this.databaseId = n, this.idbIndexTreeElements = /* @__PURE__ */ new Map(), this.objectStore = r, this.view = null;
		let i = v("table");
		this.setLeadingIcons([i]);
	}
	get itemURL() {
		return "indexedDB://" + this.databaseId.storageBucket.storageKey + "/" + (this.databaseId.storageBucket.name ?? "") + "/" + this.databaseId.name + "/" + this.objectStore.name;
	}
	onattach() {
		super.onattach(), this.listItemElement.addEventListener("contextmenu", this.handleContextMenuEvent.bind(this), !0);
	}
	markNeedsRefresh() {
		this.view && this.view.markNeedsRefresh();
		for (let e of this.idbIndexTreeElements.values()) e.markNeedsRefresh();
	}
	handleContextMenuEvent(e) {
		let t = new bt(e);
		t.defaultSection().appendItem(Z(X.clear), this.clearObjectStore.bind(this), { jslogContext: "clear" }), t.show();
	}
	refreshObjectStore() {
		this.view && this.view.refreshData();
		for (let e of this.idbIndexTreeElements.values()) e.refreshIndex();
	}
	async clearObjectStore() {
		await this.model.clearObjectStore(this.databaseId, this.objectStore.name), this.update(this.objectStore, !0);
	}
	update(e, t) {
		this.objectStore = e;
		let n = /* @__PURE__ */ new Set();
		for (let e of this.objectStore.indexes.values()) {
			n.add(e.name);
			let r = this.idbIndexTreeElements.get(e.name);
			r || (r = new ym(this.resourcesPanel, this.model, this.databaseId, this.objectStore, e, this.refreshObjectStore.bind(this)), this.idbIndexTreeElements.set(e.name, r), this.appendChild(r)), r.update(this.objectStore, e, t);
		}
		for (let e of this.idbIndexTreeElements.keys()) n.has(e) || this.indexRemoved(e);
		for (let [e, t] of this.idbIndexTreeElements.entries()) n.has(e) || (this.removeChild(t), this.idbIndexTreeElements.delete(e));
		this.childCount() && this.expand(), this.view && t && this.view.update(this.objectStore, null), this.updateTooltip();
	}
	updateTooltip() {
		let e = this.objectStore.keyPathString, t = e === null ? "" : Z(X.keyPathS, { PH1: e });
		this.objectStore.autoIncrement && (t += "\n" + d("autoIncrement")), this.tooltip = t;
	}
	onselect(e) {
		return super.onselect(e), this.view ||= new ol(this.model, this.databaseId, this.objectStore, null, this.refreshObjectStore.bind(this)), this.showView(this.view), Yt.instance().panelShown("indexed-db"), !1;
	}
	indexRemoved(e) {
		let t = this.idbIndexTreeElements.get(e);
		t && (t.clear(), this.removeChild(t)), this.idbIndexTreeElements.delete(e);
	}
	clear() {
		for (let e of this.idbIndexTreeElements.keys()) this.indexRemoved(e);
		this.view && this.view.clear();
	}
}, ym = class extends A {
	model;
	databaseId;
	objectStore;
	index;
	refreshObjectStore;
	view;
	constructor(e, t, n, r, i, a) {
		super(e, i.name, !1, "indexed-db"), this.model = t, this.databaseId = n, this.objectStore = r, this.index = i, this.refreshObjectStore = a;
	}
	get itemURL() {
		return "indexedDB://" + this.databaseId.storageBucket.storageKey + "/" + (this.databaseId.storageBucket.name ?? "") + "/" + this.databaseId.name + "/" + this.objectStore.name + "/" + this.index.name;
	}
	markNeedsRefresh() {
		this.view && this.view.markNeedsRefresh();
	}
	refreshIndex() {
		this.view && this.view.refreshData();
	}
	update(e, t, n) {
		this.objectStore = e, this.index = t, this.view && n && this.view.update(this.objectStore, this.index), this.updateTooltip();
	}
	updateTooltip() {
		let e = [], t = this.index.keyPathString;
		e.push(Z(X.keyPathS, { PH1: t })), this.index.unique && e.push(d("unique")), this.index.multiEntry && e.push(d("multiEntry")), this.tooltip = e.join("\n");
	}
	onselect(e) {
		return super.onselect(e), this.view ||= new ol(this.model, this.databaseId, this.objectStore, this.index, this.refreshObjectStore), this.showView(this.view), Yt.instance().panelShown("indexed-db"), !1;
	}
	clear() {
		this.view && this.view.clear();
	}
}, bm = class extends A {
	domStorage;
	constructor(e, t) {
		super(e, t.storageKey ? pn(t.storageKey).origin : Z(X.localFiles), !1, t.isLocalStorage ? "local-storage-for-domain" : "session-storage-for-domain"), this.domStorage = t;
		let n = v("table");
		this.setLeadingIcons([n]);
	}
	get itemURL() {
		return "storage://" + this.domStorage.storageKey + "/" + (this.domStorage.isLocalStorage ? "local" : "session");
	}
	onselect(e) {
		return super.onselect(e), Yt.instance().panelShown("dom-storage"), this.resourcesPanel.showDOMStorage(this.domStorage), !1;
	}
	onattach() {
		super.onattach(), this.listItemElement.addEventListener("contextmenu", this.handleContextMenuEvent.bind(this), !0);
	}
	handleContextMenuEvent(e) {
		let t = new bt(e);
		t.defaultSection().appendItem(Z(X.clear), () => this.domStorage.clear(), { jslogContext: "clear" }), t.show();
	}
}, xm = class extends A {
	extensionStorage;
	constructor(e, t) {
		super(e, lm(t.storageArea), !1, "extension-storage-for-domain"), this.extensionStorage = t;
		let n = v("table");
		this.setLeadingIcons([n]);
	}
	get storageArea() {
		return this.extensionStorage.storageArea;
	}
	get itemURL() {
		return "extension-storage://" + this.extensionStorage.extensionId + "/" + this.extensionStorage.storageArea;
	}
	onselect(e) {
		return super.onselect(e), this.resourcesPanel.showExtensionStorage(this.extensionStorage), Yt.instance().panelShown("extension-storage"), !1;
	}
	onattach() {
		super.onattach(), this.listItemElement.addEventListener("contextmenu", this.handleContextMenuEvent.bind(this), !0);
	}
	handleContextMenuEvent(e) {
		let t = new bt(e);
		t.defaultSection().appendItem(Z(X.clear), () => this.extensionStorage.clear(), { jslogContext: "clear" }), t.show();
	}
}, Sm = class extends A {
	extensionId;
	constructor(e, t, n) {
		super(e, n || t, !0, "extension-storage-for-domain"), this.extensionId = t;
		let r = v("table");
		this.setLeadingIcons([r]);
	}
	get itemURL() {
		return "extension-storage://" + this.extensionId;
	}
}, Cm = class extends A {
	target;
	#e;
	constructor(e, t, n) {
		super(e, n.securityOrigin() || Z(X.localFiles), !1, "cookies-for-frame"), this.target = t.resourceTreeModel().target(), this.#e = n.securityOrigin(), this.tooltip = Z(X.cookiesUsedByFramesFromS, { PH1: this.#e });
		let r = v("cookie");
		this.setLeadingIcons([r]);
	}
	get itemURL() {
		return "cookies://" + this.#e;
	}
	cookieDomain() {
		return this.#e;
	}
	onattach() {
		super.onattach(), this.listItemElement.addEventListener("contextmenu", this.handleContextMenuEvent.bind(this), !0);
	}
	handleContextMenuEvent(e) {
		let t = new bt(e);
		t.defaultSection().appendItem(Z(X.clear), () => this.resourcesPanel.clearCookies(this.target, this.#e), { jslogContext: "clear" }), t.show();
	}
	onselect(e) {
		return super.onselect(e), this.resourcesPanel.showCookies(this.target, this.#e), Yt.instance().panelShown(jn[jn.cookies]), !1;
	}
}, wm = class extends S {
	emptyWidget;
	constructor() {
		super(), this.element.classList.add("storage-view"), this.emptyWidget = new Ae("", ""), this.emptyWidget.show(this.element);
	}
	setText(e) {
		this.emptyWidget.text = e;
	}
	setHeadline(e) {
		this.emptyWidget.header = e;
	}
	setLink(e) {
		this.emptyWidget.link = e;
	}
}, Tm = class {
	panel;
	treeElement;
	treeElementForFrameId;
	treeElementForTargetId;
	constructor(e, t) {
		this.panel = e, this.treeElement = t, ue(this.treeElement.listItemNode, "Resources Section"), this.treeElementForFrameId = /* @__PURE__ */ new Map(), this.treeElementForTargetId = /* @__PURE__ */ new Map();
		let n = ce.instance();
		n.addEventListener(de.FRAME_ADDED_TO_TARGET, (e) => this.frameAdded(e.data.frame), this), n.addEventListener(de.FRAME_REMOVED, (e) => this.frameDetached(e.data.frameId), this), n.addEventListener(de.FRAME_NAVIGATED, (e) => this.frameNavigated(e.data.frame), this), n.addEventListener(de.RESOURCE_ADDED, (e) => this.resourceAdded(e.data.resource), this), this.panel.mode !== "node" && (C.instance().addModelListener(wt, Mt.TARGET_CREATED, this.windowOpened, this, { scoped: !0 }), C.instance().addModelListener(wt, Mt.TARGET_INFO_CHANGED, this.windowChanged, this, { scoped: !0 }), C.instance().addModelListener(wt, Mt.TARGET_DESTROYED, this.windowDestroyed, this, { scoped: !0 }), C.instance().observeTargets(this, { scoped: !0 }));
	}
	initialize() {
		let e = ce.instance();
		for (let t of e.getAllFrames()) {
			this.treeElementForFrameId.get(t.id) || this.addFrameAndParents(t);
			let e = t.resourceTreeModel().target().model(wt);
			if (e) for (let t of e.targetInfos()) this.windowOpened({ data: t });
		}
	}
	targetAdded(e) {
		(e.type() === Be.Worker || e.type() === Be.ServiceWorker) && this.workerAdded(e), e.type() === Be.FRAME && e === e.outermostTarget() && this.initialize();
	}
	async workerAdded(e) {
		let t = e.parentTarget();
		if (!t) return;
		let n = t.id(), r = this.treeElementForTargetId.get(n), i = e.id();
		cm(i);
		let { targetInfo: a } = await t.targetAgent().invoke_getTargetInfo({ targetId: i });
		r && a && r.workerCreated(a);
	}
	targetRemoved(e) {}
	addFrameAndParents(e) {
		let t = e.parentFrame();
		t && !this.treeElementForFrameId.get(t.id) && this.addFrameAndParents(t), this.frameAdded(e);
	}
	expandFrame(e) {
		if (!e) return !1;
		let t = this.treeElementForFrameId.get(e.id);
		return !t && !this.expandFrame(e.parentFrame()) || (t = this.treeElementForFrameId.get(e.id), !t) ? !1 : (t.expand(), !0);
	}
	async revealResource(e, t, n) {
		if (!this.expandFrame(e.frame())) return;
		let r = Om.forResource(e);
		r && await r.revealResource(t, n);
	}
	revealAndSelectFrame(e) {
		let t = this.treeElementForFrameId.get(e.id);
		t?.reveal(), t?.select();
	}
	frameAdded(e) {
		if (!C.instance().isInScope(e.resourceTreeModel())) return;
		let t = e.parentFrame(), n = t ? this.treeElementForFrameId.get(t.id) : this.treeElement;
		if (!n) return;
		let r = this.treeElementForFrameId.get(e.id);
		r && (this.treeElementForFrameId.delete(e.id), r.parent && r.parent.removeChild(r));
		let i = new Em(this, e);
		this.treeElementForFrameId.set(e.id, i);
		let a = e.resourceTreeModel().target().id();
		this.treeElementForTargetId.get(a) || this.treeElementForTargetId.set(a, i), n.appendChild(i);
		for (let t of e.resources()) this.resourceAdded(t);
	}
	frameDetached(e) {
		let t = this.treeElementForFrameId.get(e);
		t && (this.treeElementForFrameId.delete(e), t.parent && t.parent.removeChild(t));
	}
	frameNavigated(e) {
		if (!C.instance().isInScope(e.resourceTreeModel())) return;
		let t = this.treeElementForFrameId.get(e.id);
		t && t.frameNavigated(e);
	}
	resourceAdded(e) {
		let t = e.frame();
		if (!t || !C.instance().isInScope(t.resourceTreeModel())) return;
		let n = this.treeElementForFrameId.get(t.id);
		n && n.appendResource(e);
	}
	windowOpened(e) {
		let t = e.data;
		if (t.openerId && t.type === "page") {
			let e = this.treeElementForFrameId.get(t.openerId);
			e && (this.treeElementForTargetId.set(t.targetId, e), e.windowOpened(t));
		}
	}
	windowDestroyed(e) {
		let t = e.data, n = this.treeElementForTargetId.get(t);
		n && (n.windowDestroyed(t), this.treeElementForTargetId.delete(t));
	}
	windowChanged(e) {
		let t = e.data;
		if (t.openerId && t.type === "page") {
			let e = this.treeElementForFrameId.get(t.openerId);
			e && e.windowChanged(t);
		}
	}
	reset() {
		this.treeElement.removeChildren(), this.treeElementForFrameId.clear(), this.treeElementForTargetId.clear();
	}
}, Em = class e extends A {
	section;
	frame;
	categoryElements;
	treeElementForResource;
	treeElementForWindow;
	treeElementForWorker;
	view;
	constructor(e, t) {
		super(e.panel, "", !1, "frame"), this.section = e, this.frame = t, this.categoryElements = /* @__PURE__ */ new Map(), this.treeElementForResource = /* @__PURE__ */ new Map(), this.treeElementForWindow = /* @__PURE__ */ new Map(), this.treeElementForWorker = /* @__PURE__ */ new Map(), this.frameNavigated(t), this.view = null;
	}
	getIconTypeForFrame(e) {
		return e.isOutermostFrame() ? e.unreachableUrl() ? "frame-crossed" : "frame" : e.unreachableUrl() ? "iframe-crossed" : "iframe";
	}
	async frameNavigated(e) {
		let t = v(this.getIconTypeForFrame(e));
		if (e.unreachableUrl() && t.classList.add("red-icon"), this.setLeadingIcons([t]), this.invalidateChildren(), this.title !== e.displayName() && (this.title = e.displayName(), ue(this.listItemElement, this.title), this.parent)) {
			let e = this.parent;
			e.removeChild(this), e.appendChild(this);
		}
		if (this.categoryElements.clear(), this.treeElementForResource.clear(), this.treeElementForWorker.clear(), this.selected ? (this.view = new Wc(), this.view.frame = this.frame, this.showView(this.view)) : this.view = null, e.isOutermostFrame()) {
			let t = C.instance().targets();
			for (let n of t) if (n.type() === Be.ServiceWorker && C.instance().isInScope(n)) {
				let t = n.id();
				cm(t);
				let r = (await e.resourceTreeModel().target().targetAgent().invoke_getTargetInfo({ targetId: t })).targetInfo;
				this.workerCreated(r);
			}
		}
	}
	get itemURL() {
		return this.frame.isOutermostFrame() ? "frame://" : "frame://" + encodeURI(this.frame.url);
	}
	onselect(e) {
		return super.onselect(e), this.view || (this.view = new Wc(), this.view.frame = this.frame), Yt.instance().panelShown("frame-details"), this.showView(this.view), this.listItemElement.classList.remove("hovered"), Xt.hideDOMNodeHighlight(), !1;
	}
	set hovered(e) {
		e ? (this.listItemElement.classList.add("hovered"), this.frame.highlight()) : (this.listItemElement.classList.remove("hovered"), Xt.hideDOMNodeHighlight());
	}
	appendResource(t) {
		let n = t.statusCode();
		if (n >= 301 && n <= 303) return;
		let r = t.resourceType(), i = r.name(), a = r === p.Document ? this : this.categoryElements.get(i);
		a || (a = new si(this.section.panel, t.resourceType().category().title(), "", Z(X.resourceDescription), i, i === "Frames"), this.categoryElements.set(r.name(), a), this.appendChild(a, e.presentationOrderCompare));
		let o = new Om(this.section.panel, t);
		a.appendChild(o, e.presentationOrderCompare), this.treeElementForResource.set(t.url, o);
	}
	windowOpened(t) {
		let n = "opened-windows", r = this.categoryElements.get(n);
		if (r || (r = new si(this.section.panel, Z(X.openedWindows), "", Z(X.openedWindowsDescription), n), this.categoryElements.set(n, r), this.appendChild(r, e.presentationOrderCompare)), !this.treeElementForWindow.get(t.targetId)) {
			let e = new km(this.section.panel, t);
			r.appendChild(e), this.treeElementForWindow.set(t.targetId, e);
		}
	}
	workerCreated(t) {
		let n = t.type === "service_worker" ? "service-workers" : "web-workers", r = t.type === "service_worker" ? d("Service workers") : Z(X.webWorkers), i = this.categoryElements.get(n);
		if (i || (i = new si(this.section.panel, r, "", Z(X.workerDescription), n), this.categoryElements.set(n, i), this.appendChild(i, e.presentationOrderCompare)), !this.treeElementForWorker.get(t.targetId)) {
			let e = new Am(this.section.panel, t);
			i.appendChild(e), this.treeElementForWorker.set(t.targetId, e);
		}
	}
	windowChanged(e) {
		let t = this.treeElementForWindow.get(e.targetId);
		t && (t.title !== e.title && (t.title = e.title), t.update(e));
	}
	windowDestroyed(e) {
		let t = this.treeElementForWindow.get(e);
		t && t.windowClosed();
	}
	appendChild(t, n = e.presentationOrderCompare) {
		super.appendChild(t, n);
	}
	static presentationOrderCompare(t, n) {
		function r(t) {
			return t instanceof si ? 2 : t instanceof e ? 1 : 3;
		}
		return r(t) - r(n) || t.titleAsText().localeCompare(n.titleAsText());
	}
}, Dm = /* @__PURE__ */ new WeakMap(), Om = class extends A {
	panel;
	resource;
	previewPromise;
	constructor(e, t) {
		super(e, t.isGenerated ? Z(X.documentNotAvailable) : t.displayName, !1, "frame-resource"), this.panel = e, this.resource = t, this.previewPromise = null, this.tooltip = t.url, Dm.set(this.resource, this);
		let n = v("document", "navigator-file-tree-item");
		n.classList.add("navigator-" + t.resourceType().name() + "-tree-item"), this.setLeadingIcons([n]);
	}
	static forResource(e) {
		return Dm.get(e);
	}
	get itemURL() {
		return this.resource.url;
	}
	preparePreview() {
		if (this.previewPromise) return this.previewPromise;
		let e = qr.createPreview(this.resource, this.resource.mimeType);
		return this.previewPromise = e.then((e) => e || new Ae("", this.resource.url)), this.previewPromise;
	}
	onselect(e) {
		return super.onselect(e), this.resource.isGenerated ? this.panel.showCategoryView("", Z(X.documentNotAvailable), Z(X.theContentOfThisDocumentHasBeen), null) : this.panel.scheduleShowView(this.preparePreview()), Yt.instance().panelShown("frame-resource"), !1;
	}
	ondblclick(e) {
		return st.openInNewTab(this.resource.url), !1;
	}
	onattach() {
		super.onattach(), this.listItemElement.draggable = !0, this.listItemElement.addEventListener("dragstart", this.ondragstart.bind(this), !1), this.listItemElement.addEventListener("contextmenu", this.handleContextMenuEvent.bind(this), !0);
	}
	ondragstart(e) {
		return e.dataTransfer ? (e.dataTransfer.setData("text/plain", this.resource.content || ""), e.dataTransfer.effectAllowed = "copy", !0) : !1;
	}
	handleContextMenuEvent(e) {
		let t = new bt(e);
		t.appendApplicableItems(this.resource), t.show();
	}
	async revealResource(e, t) {
		this.revealAndSelect(!0);
		let n = await this.panel.scheduleShowView(this.preparePreview());
		n instanceof Ur && typeof e == "number" && n.revealPosition({
			lineNumber: e,
			columnNumber: t
		}, !0);
	}
}, km = class extends A {
	targetInfo;
	isWindowClosed;
	view;
	constructor(e, t) {
		super(e, t.title || Z(X.windowWithoutTitle), !1, "window"), this.targetInfo = t, this.isWindowClosed = !1, this.view = null, this.updateIcon(t.canAccessOpener);
	}
	updateIcon(e) {
		let t = v(e ? "popup" : "frame");
		this.setLeadingIcons([t]);
	}
	update(e) {
		e.canAccessOpener !== this.targetInfo.canAccessOpener && this.updateIcon(e.canAccessOpener), this.targetInfo = e, this.view && (this.view.setTargetInfo(e), this.view.requestUpdate());
	}
	windowClosed() {
		this.listItemElement.classList.add("window-closed"), this.isWindowClosed = !0, this.view && (this.view.setIsWindowClosed(!0), this.view.requestUpdate());
	}
	onselect(e) {
		return super.onselect(e), this.view ? this.view.requestUpdate() : this.view = new jl(this.targetInfo, this.isWindowClosed), this.showView(this.view), Yt.instance().panelShown("frame-window"), !1;
	}
	get itemURL() {
		return this.targetInfo.url;
	}
}, Am = class extends A {
	targetInfo;
	view;
	constructor(e, t) {
		super(e, t.title || t.url || Z(X.worker), !1, "worker"), this.targetInfo = t, this.view = null;
		let n = v("gears", "navigator-file-tree-item");
		this.setLeadingIcons([n]);
	}
	onselect(e) {
		return super.onselect(e), this.view ? this.view.requestUpdate() : this.view = new Ml(this.targetInfo), this.showView(this.view), Yt.instance().panelShown("frame-worker"), !1;
	}
	get itemURL() {
		return this.targetInfo.url;
	}
}, jm = "/*\n * Copyright 2019 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n@scope to (devtools-widget > *) {\n  .cookie-preview-widget {\n    padding: 2px 6px;\n  }\n\n  .cookie-preview-widget-header {\n    font-weight: bold;\n    user-select: none;\n    white-space: nowrap;\n    margin-bottom: 4px;\n    flex: 0 0 18px;\n    display: flex;\n    align-items: center;\n  }\n\n  .cookie-preview-widget-header-label {\n    line-height: 18px;\n    flex-shrink: 0;\n  }\n\n  .cookie-preview-widget-cookie-value {\n    user-select: text;\n    word-break: break-all;\n    flex: 1;\n    overflow: auto;\n  }\n\n  .cookie-preview-widget-toggle {\n    margin-left: 12px;\n    font-weight: normal;\n    flex-shrink: 1;\n  }\n}\n", Mm = /* @__PURE__ */ e({
	CookieItemsView: () => Vm,
	DEFAULT_COOKIE_PREVIEW_WIDGET_VIEW: () => Rm,
	DEFAULT_VIEW: () => Bm
}), Nm = {
	showUrlDecoded: "Show URL-decoded",
	noCookieSelected: "No cookie selected",
	selectACookieToPreviewItsValue: "Select a cookie to preview its value",
	onlyShowCookiesWithAnIssue: "Only show cookies with an issue",
	onlyShowCookiesWhichHaveAn: "Only show cookies that have an associated issue",
	clearFilteredCookies: "Clear filtered cookies",
	clearAllCookies: "Clear all cookies",
	numberOfCookiesShownInTableS: "Number of cookies shown in table: {PH1}"
}, Pm = s("panels/application/CookieItemsView.ts", Nm), Fm = a.bind(void 0, Pm), { Size: Im } = dn, { widget: Lm } = Wt, Rm = (e, t, n) => {
	let r = e.cookie ? e.showDecoded ? decodeURIComponent(e.cookie.value()) : e.cookie.value() : "";
	function i(e) {
		e.preventDefault();
		let t = document.createRange();
		t.selectNode(e.currentTarget);
		let n = window.getSelection();
		n && (n.removeAllRanges(), n.addRange(t));
	}
	_(y`<style>${jm}</style>
    <div class="cookie-preview-widget">
      <div class="cookie-preview-widget-header">
        <span class="cookie-preview-widget-header-label">Cookie Value</span>
        <devtools-checkbox
          .checked=${e.showDecoded}
          @change=${(t) => e.onShowDecodedChanged(t.target.checked)}
          title=${Fm(Nm.showUrlDecoded)}
          jslog=${Ft("show-url-decoded").track({ click: !0 })}>
          ${Fm(Nm.showUrlDecoded)}
        </devtools-checkbox>
      </div>
      <div class="cookie-preview-widget-cookie-value"
          @dblclick=${i}>
        ${r}
      </div>
    </div>
  `, n, { container: { attributes: { jslog: `${D("cookie-preview")}` } } });
}, zm = class extends S {
	view;
	#e;
	showDecodedSetting;
	constructor(e, t = Rm) {
		super(e), this.view = t, this.setMinimumSize(230, 45), this.#e = null, this.showDecodedSetting = m.instance().createSetting("cookie-view-show-decoded", !1), this.requestUpdate();
	}
	set cookie(e) {
		this.#e = e, this.requestUpdate();
	}
	performUpdate() {
		let e = {
			cookie: this.#e,
			showDecoded: this.showDecodedSetting.get(),
			onShowDecodedChanged: (e) => {
				this.showDecodedSetting.set(e), this.requestUpdate();
			}
		};
		this.view(e, void 0, this.contentElement);
	}
}, Bm = (e, t, n) => {
	_(y`<style>${jm}</style>
    <devtools-widget class="storage-view" ${Lm(S, { minimumSize: new Im(0, 50) })}>
      <devtools-widget ${Lm(Wf, { filterRegex: null })}
        class=flex-none
        @Refresh=${e.onRefreshItems}
        @DeleteAll=${e.onDeleteAllItems}
        @DeleteSelected=${e.onDeleteSelectedItems}
        ${Ct(Wf, (e) => {
		t.toolbar = e;
	})}
      ></devtools-widget>
      <devtools-split-view sidebar-position="second" name="cookie-items-split-view-state">
        <devtools-widget slot="main" ${Lm(S, { minimumSize: new Im(0, 50) })}>
          <devtools-widget slot="main" ${Lm(Qr, {
		cookieDomain: e.cookieDomain,
		cookiesData: e.cookiesData,
		saveCallback: e.onSaveCookie,
		refreshCallback: e.onRefresh,
		selectedCallback: e.onSelect,
		deleteCallback: e.onDelete,
		editable: !0
	})}
          ></devtools-widget>
        </devtools-widget>
        <devtools-widget slot="sidebar" ${Lm(S, { minimumSize: new Im(0, 50) })}
          jslog=${D("preview").track({ resize: !0 })}>
          ${e.selectedCookie ? y`<devtools-widget ${Lm(zm, { cookie: e.selectedCookie })}>
                 </devtools-widget>` : y`<devtools-widget ${Lm(Ae, {
		header: Fm(Nm.noCookieSelected),
		text: Fm(Nm.selectACookieToPreviewItsValue)
	})}></devtools-widget>`}
        </devtools-widget>
      </devtools-split-view>
    </devtools-widget>
  `, n, { container: { attributes: { jslog: `${D("cookies-data")}` } } });
}, Vm = class extends S {
	view;
	model;
	cookieDomain;
	onlyIssuesFilterUI;
	allCookies;
	shownCookies;
	selectedCookie;
	#e;
	constructor(e, t, n = Bm) {
		super(), this.view = n, this.model = e, this.cookieDomain = t, this.onlyIssuesFilterUI = new pt(Fm(Nm.onlyShowCookiesWithAnIssue), Fm(Nm.onlyShowCookiesWhichHaveAn), () => {
			this.updateWithCookies(this.allCookies);
		}, "only-show-cookies-with-issues"), this.allCookies = [], this.shownCookies = [], this.selectedCookie = null, this.setCookiesDomain(e, t), this.requestUpdate();
	}
	setCookiesDomain(e, t) {
		this.model.removeEventListener(Fn.COOKIE_LIST_UPDATED, this.onCookieListUpdate, this), this.model = e, this.cookieDomain = t, this.refreshItems(), this.model.addEventListener(Fn.COOKIE_LIST_UPDATED, this.onCookieListUpdate, this);
	}
	performUpdate() {
		let e = this, t = { set toolbar(t) {
			e.#e !== t && (e.#e = t, e.#e.appendToolbarItem(e.onlyIssuesFilterUI), e.updateWithCookies(e.allCookies));
		} }, n = {
			cookies: this.shownCookies,
			cookieToBlockedReasons: this.model.getCookieToBlockedReasonsMap()
		}, r = re.fromString(this.cookieDomain), i = {
			cookieDomain: r ? r.host : "",
			cookiesData: n,
			onSaveCookie: this.saveCookie.bind(this),
			onRefresh: this.refreshItems.bind(this),
			onSelect: this.handleCookieSelected.bind(this),
			onDelete: this.deleteCookie.bind(this),
			onDeleteSelectedItems: this.deleteSelectedItem.bind(this),
			onDeleteAllItems: this.deleteAllItems.bind(this),
			onRefreshItems: this.refreshItems.bind(this),
			selectedCookie: this.selectedCookie
		};
		this.view(i, t, this.contentElement);
	}
	wasShown() {
		super.wasShown(), this.refreshItems();
	}
	showPreview(e) {
		e !== this.selectedCookie && (this.selectedCookie = e, this.requestUpdate());
	}
	handleCookieSelected(e) {
		this.#e && (this.#e.setCanDeleteSelected(!!e), this.showPreview(e));
	}
	async saveCookie(e, t) {
		return t && e.key() !== t.key() && await this.model.deleteCookie(t), await this.model.saveCookie(e);
	}
	deleteCookie(e, t) {
		this.model.deleteCookie(e).then(t);
	}
	updateWithCookies(e) {
		this.#e && (this.allCookies = e, this.shownCookies = this.filter(e, (e) => `${e.name()} ${e.value()} ${e.domain()}`), this.#e.hasFilter() ? (this.#e.setDeleteAllTitle(Fm(Nm.clearFilteredCookies)), this.#e.setDeleteAllGlyph("filter-clear")) : (this.#e.setDeleteAllTitle(Fm(Nm.clearAllCookies)), this.#e.setDeleteAllGlyph("clear-list")), Ke.alert(Fm(Nm.numberOfCookiesShownInTableS, { PH1: this.shownCookies.length })), this.#e.setCanFilter(!0), this.#e.setCanDeleteAll(this.shownCookies.length > 0), this.#e.setCanDeleteSelected(!!this.selectedCookie), this.requestUpdate());
	}
	filter(e, t) {
		return e.filter((e) => this.#e?.filterRegex?.test(t(e)) ?? !0).filter((e) => !this.onlyIssuesFilterUI.checked() || e instanceof Se && Or(e));
	}
	deleteAllItems() {
		this.showPreview(null), this.model.deleteCookies(this.shownCookies);
	}
	deleteSelectedItem() {
		let e = this.selectedCookie;
		e && (this.showPreview(null), this.model.deleteCookie(e));
	}
	onCookieListUpdate() {
		this.model.getCookiesForDomain(this.cookieDomain).then(this.updateWithCookies.bind(this));
	}
	refreshItems() {
		this.model.getCookiesForDomain(this.cookieDomain, !0).then(this.updateWithCookies.bind(this));
	}
}, Hm = "/*\n * Copyright 2026 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n.device-bound-session-grid-wrapper {\n  margin: 0 20px 5px;\n}\n\n.device-bound-session-grid-wrapper devtools-data-grid {\n  display: block;\n}\n\n.device-bound-session-view-wrapper, .device-bound-session-sidebar {\n  overflow-y: auto;\n  scroll-behavior: smooth;\n  padding-bottom: 20px;\n}\n\n.device-bound-session-no-events-wrapper, .device-bound-session-no-event-details {\n  padding: 0 20px;\n}\n\n.device-bound-sessions-toolbar {\n  background-color: var(--sys-color-cdt-base-container);\n  border-bottom: var(--sys-size-1) solid var(--sys-color-divider);\n}\n", Um = /* @__PURE__ */ e({
	DEFAULT_VIEW: () => Km,
	DeviceBoundSessionsView: () => qm
}), { widget: Wm } = Wt, Q = {
	keySite: "Site",
	keyId: "ID",
	refreshUrl: "Refresh URL",
	scope: "Scope",
	cookieCravings: "Cookies",
	name: "Name",
	expiryDate: "Expiry date",
	cachedChallenge: "Cached challenge",
	allowedRefreshInitiators: "Allowed refresh initiators",
	sessionConfig: "Session config",
	origin: "Origin",
	includeSite: "Include site",
	yes: "Yes",
	no: "No",
	ruleHostPattern: "Host pattern",
	rulePathPrefix: "Path prefix",
	ruleType: "Rule type",
	ruleTypeExclude: "Exclude",
	ruleTypeInclude: "Include",
	creation: "Creation",
	refresh: "Refresh",
	challenge: "Challenge",
	termination: "Termination",
	unknown: "Unknown",
	events: "Events",
	eventDetails: "Event details",
	sessionDetails: "Session details",
	selectEventToViewDetails: "Select an event row to view more details.",
	type: "Type",
	timestamp: "Date",
	result: "Result",
	success: "Success",
	error: "Error",
	noEvents: "No events have been logged yet.",
	preserveLog: "Preserve log",
	doNotClearLogOnPageReload: "Do not clear log on page reload/navigation.",
	sessionId: "Session ID",
	eventResult: "Event result",
	fetchResult: "Fetch result",
	updatedSessionConfig: "Updated session config",
	refreshResult: "Refresh result",
	causedAnyRequestDeferrals: "Caused any request deferrals",
	challengeResult: "Challenge result",
	deletionReason: "Deletion reason",
	failedRequestUrl: "Failed request URL",
	failedRequestNetError: "Net error",
	failedRequestResponseCode: "Response error code",
	failedRequestResponseBody: "Response body",
	keyError: "Key error",
	signingError: "Signing error",
	serverRequestedTermination: "Server requested termination",
	invalidSessionId: "Invalid session ID",
	invalidChallenge: "Invalid challenge",
	tooManyChallenges: "Too many challenges",
	invalidFetcherUrl: "Invalid fetcher URL",
	invalidRefreshUrl: "Invalid refresh URL",
	transientHttpError: "Transient HTTP error",
	scopeOriginSameSiteMismatch: "Same-site mismatch scope origin",
	refreshUrlSameSiteMismatch: "Same-site mismatch refresh URL",
	mismatchedSessionId: "Mismatched session ID",
	missingScope: "Missing scope",
	noCredentials: "No credentials",
	subdomainRegistrationWellKnownUnavailable: "Subdomain registration .well-known unavailable",
	subdomainRegistrationUnauthorized: ".well-known did not authorize registration by subdomain",
	subdomainRegistrationWellKnownMalformed: "Subdomain registration .well-known content malformed",
	sessionProviderWellKnownUnavailable: "Session provider .well-known unavailable",
	relyingPartyWellKnownUnavailable: "Relying party .well-known unavailable",
	federatedKeyThumbprintMismatch: "Federated key had incorrect thumbprint",
	invalidFederatedSessionUrl: "Federated provider URL not valid",
	invalidFederatedKey: "Federated key invalid",
	tooManyRelyingOriginLabels: "Too many relying origin labels in .well-known",
	boundCookieSetForbidden: "Registration in a context that cannot set bound cookies",
	netError: "Network error",
	proxyError: "Proxy error",
	emptySessionConfig: "Empty session configuration for registration",
	invalidCredentialsConfig: "Invalid credentials configuration",
	invalidCredentialsType: "Invalid credentials - empty or non-cookie type",
	invalidCredentialsEmptyName: "Invalid credentials - empty name",
	invalidCredentialsCookie: "Invalid credentials - cookie invalid",
	persistentHttpError: "Persistent HTTP error",
	registrationAttemptedChallenge: "Registration returned challenge error response code",
	invalidScopeOrigin: "Invalid scope origin",
	scopeOriginContainsPath: "Scope origin contains a path",
	refreshInitiatorNotString: "Allowed refresh initiator is not a string",
	refreshInitiatorInvalidHostPattern: "Allowed refresh initiator has invalid host pattern",
	invalidScopeSpecification: "Invalid scope specification",
	missingScopeSpecificationType: "Missing scope specification type",
	emptyScopeSpecificationDomain: "Empty scope specification domain",
	emptyScopeSpecificationPath: "Empty scope specification path",
	invalidScopeSpecificationType: "Scope specification type is neiher include or exclude",
	invalidScopeIncludeSite: "Invalid include_site in scope",
	missingScopeIncludeSite: "Missing include_site in scope",
	federatedNotAuthorizedByProvider: "Federated session not authorized by provider .well-known",
	federatedNotAuthorizedByRelyingParty: "Federated session not authorized by relying party .well-known",
	sessionProviderWellKnownMalformed: "Session provider .well-known content malformed",
	sessionProviderWellKnownHasProviderOrigin: "Session provider .well-known content has provider_origin",
	relyingPartyWellKnownMalformed: "Relying party .well-known content malformed",
	relyingPartyWellKnownHasRelyingOrigins: "Relying party .well-known content has relying_origins",
	invalidFederatedSessionProviderSessionMissing: "Federated session invalid due to provider session not found",
	invalidFederatedSessionWrongProviderOrigin: "Federated session invalid due to provider origin mismatch",
	invalidCredentialsCookieCreationTime: "Invalid credentials - cookie creation time invalid",
	invalidCredentialsCookieName: "Invalid credentials - cookie name invalid",
	invalidCredentialsCookieParsing: "Invalid credentials - cookie parsing failed",
	invalidCredentialsCookieUnpermittedAttribute: "Invalid credentials - cookie attribute not permitted",
	invalidCredentialsCookieInvalidDomain: "Invalid credentials - cookie invalid domain",
	invalidCredentialsCookiePrefix: "Invalid credentials - cookie invalid prefix",
	invalidScopeRulePath: "Invalid scope rule path",
	invalidScopeRuleHostPattern: "Invalid scope rule host pattern",
	scopeRuleOriginScopedHostPatternMismatch: "Origin-scoped session has mismatch between host pattern and origin",
	scopeRuleSiteScopedHostPatternMismatch: "Site-scoped session has mismatch between host pattern and site",
	signingQuotaExceeded: "Signing quota exceeded",
	invalidConfigJson: "Invalid session configuration JSON",
	invalidFederatedSessionProviderFailedToRestoreKey: "Federated session invalid due to failure to restore session provider key",
	failedToUnwrapKey: "Failed to unwrap key",
	sessionDeletedDuringRefresh: "Session deleted during refresh",
	refreshed: "Refreshed",
	initializedService: "Service initialized",
	unreachable: "Endpoint unreachable",
	serverError: "Endpoint transient error",
	refreshQuotaExceeded: "Refresh quota exceeded",
	fatalError: "Fatal error",
	noSessionId: "No session ID",
	noSessionMatch: "No matching session ID",
	cantSetBoundCookie: "Not allowed to set bound cookie",
	expired: "Expired",
	failedToRestoreKey: "Failed to restore key from disk",
	storagePartitionCleared: "Removed from storage partition",
	clearBrowsingData: "User-initiated browser data removal",
	invalidSessionParams: "Invalid session parameters",
	refreshFatalError: "Fatal error during refresh"
}, Gm = s("panels/application/DeviceBoundSessionsView.ts", Q), $ = a.bind(void 0, Gm), Km = (e, t, n) => {
	let { sessionAndEvents: r, preserveLogSetting: i, defaultTitle: a, defaultDescription: o, selectedEvent: s, onEventRowSelected: c } = e, l = i ? y`
        <devtools-toolbar class="device-bound-sessions-toolbar">
        <devtools-checkbox title=${$(Q.doNotClearLogOnPageReload)} ${ht(i)}>${$(Q.preserveLog)}</devtools-checkbox>
        </devtools-toolbar>
  ` : b;
	if (!r) {
		if (!a || !o) {
			_(b, n);
			return;
		}
		_(y`
      <style>${Ee}</style>
      <style>${Hm}</style>
      ${l}
      <devtools-widget ${Wm(Ae, {
			header: a,
			text: o
		})} jslog=${D("device-bound-sessions-empty")}></devtools-widget>
    `, n, { container: { attributes: { jslog: `${D("device-bound-sessions")}` } } });
		return;
	}
	let u;
	if (r.session) {
		let { key: e, inclusionRules: t, cookieCravings: n } = r.session;
		u = y`
        <devtools-report>
          <devtools-report-section-header role="heading" aria-level="2">${$(Q.sessionConfig)}</devtools-report-section-header>
          <devtools-report-key>${$(Q.keySite)}</devtools-report-key>
          <devtools-report-value>${e.site}</devtools-report-value>
          <devtools-report-key>${$(Q.keyId)}</devtools-report-key>
          <devtools-report-value>${e.id}</devtools-report-value>
          <devtools-report-key>${$(Q.refreshUrl)}</devtools-report-key>
          <devtools-report-value>${r.session.refreshUrl}</devtools-report-value>
          <devtools-report-key>${$(Q.expiryDate)}</devtools-report-key>
          <devtools-report-value>${(/* @__PURE__ */ new Date(r.session.expiryDate * 1e3)).toLocaleString()}</devtools-report-value>
          <devtools-report-key>${$(Q.cachedChallenge)}</devtools-report-key>
          <devtools-report-value>${r.session.cachedChallenge || ""}</devtools-report-value>
          <devtools-report-key>${$(Q.allowedRefreshInitiators)}</devtools-report-key>
          <devtools-report-value>${r.session.allowedRefreshInitiators.join(", ")}</devtools-report-value>
          <devtools-report-section-header role="heading" aria-level="2">${$(Q.scope)}</devtools-report-section-header>
          <devtools-report-key>${$(Q.origin)}</devtools-report-key>
          <devtools-report-value>${t.origin}</devtools-report-value>
          <devtools-report-key>${$(Q.includeSite)}</devtools-report-key>
          <devtools-report-value>${eh(t.includeSite)}</devtools-report-value>
        </devtools-report>
        ${t.urlRules.length > 0 ? y`
          <div class="device-bound-session-grid-wrapper">
            <devtools-data-grid class="device-bound-session-url-rules-grid" striped inline name=${$(Q.scope)}>
              <table>
                <thead>
                  <tr>
                    <th id="should-include" sortable>${$(Q.ruleType)}</th>
                    <th id="host-pattern" sortable>${$(Q.ruleHostPattern)}</th>
                    <th id="path-prefix" sortable>${$(Q.rulePathPrefix)}</th>
                  </tr>
                </thead>
                <tbody>
                  ${t.urlRules.map((e) => y`
                    <tr>
                      <td>${Jm(e.ruleType)}</td>
                      <td>${e.hostPattern}</td>
                      <td>${e.pathPrefix}</td>
                    </tr>
                  `)}
                </tbody>
              </table>
            </devtools-data-grid>
          </div>
        ` : b}
        <devtools-report-section-header role="heading" aria-level="2">${$(Q.cookieCravings)}</devtools-report-section-header>
        ${n.length > 0 ? y`
          <div class="device-bound-session-grid-wrapper">
            <devtools-data-grid class="device-bound-session-cookie-cravings-grid" striped inline name=${$(Q.cookieCravings)}>
              <table>
                <thead>
                  <tr>
                    <th id="name" sortable>${$(Q.name)}</th>
                    <th id="domain" sortable>${d("Domain")}</th>
                    <th id="path" sortable>${d("Path")}</th>
                    <th id="secure" type="boolean" align="center" sortable>${d("Secure")}</th>
                    <th id="http-only" type="boolean" align="center" sortable>${d("HttpOnly")}</th>
                    <th id="same-site" sortable>${d("SameSite")}</th>
                  </tr>
                </thead>
                <tbody>
                  ${n.map((e) => y`
                    <tr>
                      <td>${e.name}</td>
                      <td>${e.domain}</td>
                      <td>${e.path}</td>
                      <td>${e.secure}</td>
                      <td>${e.httpOnly}</td>
                      <td>${e.sameSite}</td>
                    </tr>
                  `)}
                </tbody>
              </table>
            </devtools-data-grid>
          </div>
        ` : b}`;
	}
	let ee = [...r.eventsById.values()], f = y`
      <devtools-report-section-header role="heading" aria-level="2">${$(Q.events)}</devtools-report-section-header>
          ${ee.length > 0 && c ? y`
            <div class="device-bound-session-grid-wrapper">
                <devtools-data-grid class="device-bound-session-events-grid" striped inline name=${$(Q.events)} ${lt((e) => {
		e && e instanceof HTMLElement && (s || e.deselectRow());
	})}>
                <table>
                  <thead>
                    <tr>
                      <th id="type" sortable>${$(Q.type)}</th>
                      <th id="timestamp" sortable>${$(Q.timestamp)}</th>
                      <th id="details" sortable>${$(Q.result)}</th>
                    </tr>
                  </thead>
                  <tbody>${ee.map(({ event: e, timestamp: t }) => y`
                      <tr @select=${() => c(e)}>
                        <td>${Ym(e)}</td>
                        <td>${t.toLocaleString()}</td>
                        <td>${th(e.succeeded)}</td>
                      </tr>
                    `)}
                  </tbody>
                </table>
              </devtools-data-grid>
            </div>
          ` : y`<div class="device-bound-session-no-events-wrapper">${$(Q.noEvents)}</div>`}`, p = (e) => e ? y`${e.requestUrl && y`
          <devtools-report-key>${$(Q.failedRequestUrl)}</devtools-report-key>
          <devtools-report-value>${e.requestUrl}</devtools-report-value>`}
        ${e.netError && y`
          <devtools-report-key>${$(Q.failedRequestNetError)}</devtools-report-key>
          <devtools-report-value>${e.netError}</devtools-report-value>`}
        ${e.responseError === void 0 ? b : y`
          <devtools-report-key>${$(Q.failedRequestResponseCode)}</devtools-report-key>
          <devtools-report-value>${e.responseError}</devtools-report-value>`}
        ${e.responseErrorBody && y`
          <devtools-report-key>${$(Q.failedRequestResponseBody)}</devtools-report-key>
          <devtools-report-value>
            ${Wm(Wr, { jsonObject: nh(e.responseErrorBody) })}
          </devtools-report-value>`}` : b, te = s?.creationEventDetails && y`
          <devtools-report-key>${$(Q.fetchResult)}</devtools-report-key>
          <devtools-report-value>${Xm(s.creationEventDetails.fetchResult)}</devtools-report-value>
            ${s.creationEventDetails.newSession && y`
              <devtools-report-key>${$(Q.updatedSessionConfig)}</devtools-report-key>
              <devtools-report-value>${$(Q.yes)}</devtools-report-value>
            `}
          ${p(s.creationEventDetails.failedRequest)}
      `, ne = s?.refreshEventDetails && y`
          <devtools-report-key>${$(Q.refreshResult)}</devtools-report-key>
          <devtools-report-value>${Zm(s.refreshEventDetails.refreshResult)}</devtools-report-value>
          <devtools-report-key>${$(Q.causedAnyRequestDeferrals)}</devtools-report-key>
          <devtools-report-value>${eh(!s.refreshEventDetails.wasFullyProactiveRefresh)}</devtools-report-value>
            ${s.refreshEventDetails.fetchResult && y`
              <devtools-report-key>${$(Q.fetchResult)}</devtools-report-key>
              <devtools-report-value>${Xm(s.refreshEventDetails.fetchResult)}</devtools-report-value>
            `}
            ${s.refreshEventDetails.newSession && y`
              <devtools-report-key>${$(Q.updatedSessionConfig)}</devtools-report-key>
              <devtools-report-value>${$(Q.yes)}</devtools-report-value>
            `}
          ${p(s.refreshEventDetails.failedRequest)}
      `, m = s?.challengeEventDetails && y`
          <devtools-report-key>${$(Q.challengeResult)}</devtools-report-key>
          <devtools-report-value>${Qm(s.challengeEventDetails.challengeResult)}</devtools-report-value>
          <devtools-report-key>${$(Q.challenge)}</devtools-report-key>
          <devtools-report-value>${s.challengeEventDetails.challenge}</devtools-report-value>
          `, re = s?.terminationEventDetails && y`
          <devtools-report-key>${$(Q.deletionReason)}</devtools-report-key>
          <devtools-report-value>${$m(s.terminationEventDetails.deletionReason)}</devtools-report-value>
          `, ie = s ? y`
        <devtools-report>
          <devtools-report-key>${$(Q.keySite)}</devtools-report-key>
          <devtools-report-value>${s.site}</devtools-report-value>
          <devtools-report-key>${$(Q.sessionId)}</devtools-report-key>
          <devtools-report-value>${s.sessionId}</devtools-report-value>
          <devtools-report-key>${$(Q.type)}</devtools-report-key>
          <devtools-report-value>${Ym(s)}</devtools-report-value>
          <devtools-report-key>${$(Q.eventResult)}</devtools-report-key>
          <devtools-report-value>${th(s.succeeded)}</devtools-report-value>
          ${te}
          ${ne}
          ${m}
          ${re}
        </devtools-report>
    ` : y`<div class="device-bound-session-no-event-details">${$(Q.selectEventToViewDetails)}</div>`, h = y`
      <devtools-report-section-header role="heading" aria-level="2">${$(Q.eventDetails)}</devtools-report-section-header>
      ${ie}
  `;
	_(y`
        <style>${Ee}</style>
        <style>${Hm}</style>
        ${l}
        <devtools-split-view sidebar-position="second">
          <div slot="main" class="device-bound-session-view-wrapper" role="region" aria-label=${$(Q.sessionDetails)}>
            ${u || b}
            ${f}
          </div>
          <div slot="sidebar" class="device-bound-session-sidebar" role="region" aria-label=${$(Q.eventDetails)}>
            ${h}
          </div>
        </devtools-split-view>`, n);
}, qm = class extends S {
	#e;
	#t;
	#n;
	#r;
	#i;
	#a;
	#o;
	constructor(e = Km) {
		super(), this.#r = e;
	}
	showSession(e, t, n) {
		this.#i = void 0, this.#a = void 0, this.#e = t, this.#t = n, this.#s(e), this.performUpdate();
	}
	showDefault(e, t, n) {
		this.#i = t, this.#a = n, this.#e = void 0, this.#t = void 0, this.#s(e), this.performUpdate();
	}
	#s(e) {
		this.#n && (this.#n.removeEventListener(Ss.EVENT_OCCURRED, this.performUpdate, this), this.#n.removeEventListener(Ss.CLEAR_EVENTS, this.performUpdate, this)), this.#n = e, this.#n.addEventListener(Ss.EVENT_OCCURRED, this.performUpdate, this), this.#n.addEventListener(Ss.CLEAR_EVENTS, this.performUpdate, this), this.#o &&= void 0;
	}
	performUpdate() {
		let e, t;
		this.#n && (t = this.#n.getPreserveLogSetting(), this.#e && (e = this.#n.getSession(this.#e, this.#t))), this.#r({
			sessionAndEvents: e,
			preserveLogSetting: t,
			defaultTitle: this.#i,
			defaultDescription: this.#a,
			selectedEvent: this.#o,
			onEventRowSelected: this.#c.bind(this)
		}, {}, this.contentElement);
	}
	#c(e) {
		this.#o = e, this.performUpdate();
	}
};
function Jm(e) {
	switch (e) {
		case x.DeviceBoundSessionUrlRuleRuleType.Exclude: return $(Q.ruleTypeExclude);
		case x.DeviceBoundSessionUrlRuleRuleType.Include: return $(Q.ruleTypeInclude);
		default: return e;
	}
}
function Ym(e) {
	return e.creationEventDetails ? $(Q.creation) : e.refreshEventDetails ? $(Q.refresh) : e.challengeEventDetails ? $(Q.challenge) : e.terminationEventDetails ? $(Q.termination) : $(Q.unknown);
}
function Xm(e) {
	switch (e) {
		case x.DeviceBoundSessionFetchResult.Success: return $(Q.success);
		case x.DeviceBoundSessionFetchResult.KeyError: return $(Q.keyError);
		case x.DeviceBoundSessionFetchResult.SigningError: return $(Q.signingError);
		case x.DeviceBoundSessionFetchResult.ServerRequestedTermination: return $(Q.serverRequestedTermination);
		case x.DeviceBoundSessionFetchResult.InvalidSessionId: return $(Q.invalidSessionId);
		case x.DeviceBoundSessionFetchResult.InvalidChallenge: return $(Q.invalidChallenge);
		case x.DeviceBoundSessionFetchResult.TooManyChallenges: return $(Q.tooManyChallenges);
		case x.DeviceBoundSessionFetchResult.InvalidFetcherUrl: return $(Q.invalidFetcherUrl);
		case x.DeviceBoundSessionFetchResult.InvalidRefreshUrl: return $(Q.invalidRefreshUrl);
		case x.DeviceBoundSessionFetchResult.TransientHttpError: return $(Q.transientHttpError);
		case x.DeviceBoundSessionFetchResult.ScopeOriginSameSiteMismatch: return $(Q.scopeOriginSameSiteMismatch);
		case x.DeviceBoundSessionFetchResult.RefreshUrlSameSiteMismatch: return $(Q.refreshUrlSameSiteMismatch);
		case x.DeviceBoundSessionFetchResult.MismatchedSessionId: return $(Q.mismatchedSessionId);
		case x.DeviceBoundSessionFetchResult.MissingScope: return $(Q.missingScope);
		case x.DeviceBoundSessionFetchResult.NoCredentials: return $(Q.noCredentials);
		case x.DeviceBoundSessionFetchResult.SubdomainRegistrationWellKnownUnavailable: return $(Q.subdomainRegistrationWellKnownUnavailable);
		case x.DeviceBoundSessionFetchResult.SubdomainRegistrationUnauthorized: return $(Q.subdomainRegistrationUnauthorized);
		case x.DeviceBoundSessionFetchResult.SubdomainRegistrationWellKnownMalformed: return $(Q.subdomainRegistrationWellKnownMalformed);
		case x.DeviceBoundSessionFetchResult.SessionProviderWellKnownUnavailable: return $(Q.sessionProviderWellKnownUnavailable);
		case x.DeviceBoundSessionFetchResult.RelyingPartyWellKnownUnavailable: return $(Q.relyingPartyWellKnownUnavailable);
		case x.DeviceBoundSessionFetchResult.FederatedKeyThumbprintMismatch: return $(Q.federatedKeyThumbprintMismatch);
		case x.DeviceBoundSessionFetchResult.InvalidFederatedSessionUrl: return $(Q.invalidFederatedSessionUrl);
		case x.DeviceBoundSessionFetchResult.InvalidFederatedKey: return $(Q.invalidFederatedKey);
		case x.DeviceBoundSessionFetchResult.TooManyRelyingOriginLabels: return $(Q.tooManyRelyingOriginLabels);
		case x.DeviceBoundSessionFetchResult.BoundCookieSetForbidden: return $(Q.boundCookieSetForbidden);
		case x.DeviceBoundSessionFetchResult.NetError: return $(Q.netError);
		case x.DeviceBoundSessionFetchResult.ProxyError: return $(Q.proxyError);
		case x.DeviceBoundSessionFetchResult.EmptySessionConfig: return $(Q.emptySessionConfig);
		case x.DeviceBoundSessionFetchResult.InvalidCredentialsConfig: return $(Q.invalidCredentialsConfig);
		case x.DeviceBoundSessionFetchResult.InvalidCredentialsType: return $(Q.invalidCredentialsType);
		case x.DeviceBoundSessionFetchResult.InvalidCredentialsEmptyName: return $(Q.invalidCredentialsEmptyName);
		case x.DeviceBoundSessionFetchResult.InvalidCredentialsCookie: return $(Q.invalidCredentialsCookie);
		case x.DeviceBoundSessionFetchResult.PersistentHttpError: return $(Q.persistentHttpError);
		case x.DeviceBoundSessionFetchResult.RegistrationAttemptedChallenge: return $(Q.registrationAttemptedChallenge);
		case x.DeviceBoundSessionFetchResult.InvalidScopeOrigin: return $(Q.invalidScopeOrigin);
		case x.DeviceBoundSessionFetchResult.ScopeOriginContainsPath: return $(Q.scopeOriginContainsPath);
		case x.DeviceBoundSessionFetchResult.RefreshInitiatorNotString: return $(Q.refreshInitiatorNotString);
		case x.DeviceBoundSessionFetchResult.RefreshInitiatorInvalidHostPattern: return $(Q.refreshInitiatorInvalidHostPattern);
		case x.DeviceBoundSessionFetchResult.InvalidScopeSpecification: return $(Q.invalidScopeSpecification);
		case x.DeviceBoundSessionFetchResult.MissingScopeSpecificationType: return $(Q.missingScopeSpecificationType);
		case x.DeviceBoundSessionFetchResult.EmptyScopeSpecificationDomain: return $(Q.emptyScopeSpecificationDomain);
		case x.DeviceBoundSessionFetchResult.EmptyScopeSpecificationPath: return $(Q.emptyScopeSpecificationPath);
		case x.DeviceBoundSessionFetchResult.InvalidScopeSpecificationType: return $(Q.invalidScopeSpecificationType);
		case x.DeviceBoundSessionFetchResult.InvalidScopeIncludeSite: return $(Q.invalidScopeIncludeSite);
		case x.DeviceBoundSessionFetchResult.MissingScopeIncludeSite: return $(Q.missingScopeIncludeSite);
		case x.DeviceBoundSessionFetchResult.FederatedNotAuthorizedByProvider: return $(Q.federatedNotAuthorizedByProvider);
		case x.DeviceBoundSessionFetchResult.FederatedNotAuthorizedByRelyingParty: return $(Q.federatedNotAuthorizedByRelyingParty);
		case x.DeviceBoundSessionFetchResult.SessionProviderWellKnownMalformed: return $(Q.sessionProviderWellKnownMalformed);
		case x.DeviceBoundSessionFetchResult.SessionProviderWellKnownHasProviderOrigin: return $(Q.sessionProviderWellKnownHasProviderOrigin);
		case x.DeviceBoundSessionFetchResult.RelyingPartyWellKnownMalformed: return $(Q.relyingPartyWellKnownMalformed);
		case x.DeviceBoundSessionFetchResult.RelyingPartyWellKnownHasRelyingOrigins: return $(Q.relyingPartyWellKnownHasRelyingOrigins);
		case x.DeviceBoundSessionFetchResult.InvalidFederatedSessionProviderSessionMissing: return $(Q.invalidFederatedSessionProviderSessionMissing);
		case x.DeviceBoundSessionFetchResult.InvalidFederatedSessionWrongProviderOrigin: return $(Q.invalidFederatedSessionWrongProviderOrigin);
		case x.DeviceBoundSessionFetchResult.InvalidCredentialsCookieCreationTime: return $(Q.invalidCredentialsCookieCreationTime);
		case x.DeviceBoundSessionFetchResult.InvalidCredentialsCookieName: return $(Q.invalidCredentialsCookieName);
		case x.DeviceBoundSessionFetchResult.InvalidCredentialsCookieParsing: return $(Q.invalidCredentialsCookieParsing);
		case x.DeviceBoundSessionFetchResult.InvalidCredentialsCookieUnpermittedAttribute: return $(Q.invalidCredentialsCookieUnpermittedAttribute);
		case x.DeviceBoundSessionFetchResult.InvalidCredentialsCookieInvalidDomain: return $(Q.invalidCredentialsCookieInvalidDomain);
		case x.DeviceBoundSessionFetchResult.InvalidCredentialsCookiePrefix: return $(Q.invalidCredentialsCookiePrefix);
		case x.DeviceBoundSessionFetchResult.InvalidScopeRulePath: return $(Q.invalidScopeRulePath);
		case x.DeviceBoundSessionFetchResult.InvalidScopeRuleHostPattern: return $(Q.invalidScopeRuleHostPattern);
		case x.DeviceBoundSessionFetchResult.ScopeRuleOriginScopedHostPatternMismatch: return $(Q.scopeRuleOriginScopedHostPatternMismatch);
		case x.DeviceBoundSessionFetchResult.ScopeRuleSiteScopedHostPatternMismatch: return $(Q.scopeRuleSiteScopedHostPatternMismatch);
		case x.DeviceBoundSessionFetchResult.SigningQuotaExceeded: return $(Q.signingQuotaExceeded);
		case x.DeviceBoundSessionFetchResult.InvalidConfigJson: return $(Q.invalidConfigJson);
		case x.DeviceBoundSessionFetchResult.InvalidFederatedSessionProviderFailedToRestoreKey: return $(Q.invalidFederatedSessionProviderFailedToRestoreKey);
		case x.DeviceBoundSessionFetchResult.FailedToUnwrapKey: return $(Q.failedToUnwrapKey);
		case x.DeviceBoundSessionFetchResult.SessionDeletedDuringRefresh: return $(Q.sessionDeletedDuringRefresh);
		default: return e;
	}
}
function Zm(e) {
	switch (e) {
		case x.RefreshEventDetailsRefreshResult.Refreshed: return $(Q.refreshed);
		case x.RefreshEventDetailsRefreshResult.InitializedService: return $(Q.initializedService);
		case x.RefreshEventDetailsRefreshResult.Unreachable: return $(Q.unreachable);
		case x.RefreshEventDetailsRefreshResult.ServerError: return $(Q.serverError);
		case x.RefreshEventDetailsRefreshResult.RefreshQuotaExceeded: return $(Q.refreshQuotaExceeded);
		case x.RefreshEventDetailsRefreshResult.FatalError: return $(Q.fatalError);
		case x.RefreshEventDetailsRefreshResult.SigningQuotaExceeded: return $(Q.signingQuotaExceeded);
		default: return e;
	}
}
function Qm(e) {
	switch (e) {
		case x.ChallengeEventDetailsChallengeResult.Success: return $(Q.success);
		case x.ChallengeEventDetailsChallengeResult.NoSessionId: return $(Q.noSessionId);
		case x.ChallengeEventDetailsChallengeResult.NoSessionMatch: return $(Q.noSessionMatch);
		case x.ChallengeEventDetailsChallengeResult.CantSetBoundCookie: return $(Q.cantSetBoundCookie);
		default: return e;
	}
}
function $m(e) {
	switch (e) {
		case x.TerminationEventDetailsDeletionReason.Expired: return $(Q.expired);
		case x.TerminationEventDetailsDeletionReason.FailedToRestoreKey: return $(Q.failedToRestoreKey);
		case x.TerminationEventDetailsDeletionReason.FailedToUnwrapKey: return $(Q.failedToUnwrapKey);
		case x.TerminationEventDetailsDeletionReason.StoragePartitionCleared: return $(Q.storagePartitionCleared);
		case x.TerminationEventDetailsDeletionReason.ClearBrowsingData: return $(Q.clearBrowsingData);
		case x.TerminationEventDetailsDeletionReason.ServerRequested: return $(Q.serverRequestedTermination);
		case x.TerminationEventDetailsDeletionReason.InvalidSessionParams: return $(Q.invalidSessionParams);
		case x.TerminationEventDetailsDeletionReason.RefreshFatalError: return $(Q.refreshFatalError);
		default: return e;
	}
}
function eh(e) {
	return $(e ? Q.yes : Q.no);
}
function th(e) {
	return $(e ? Q.success : Q.error);
}
function nh(e) {
	let t;
	try {
		t = JSON.parse(e);
	} catch {
		return { body: e };
	}
	return typeof t == "object" && t ? t : { body: t };
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/application/DOMStorageItemsView.ts
var rh = /* @__PURE__ */ e({ DOMStorageItemsView: () => sh }), ih = {
	domStorageItems: "DOM Storage Items",
	domStorageItemsCleared: "DOM Storage Items cleared",
	domStorageItemDeleted: "The storage item was deleted."
}, ah = s("panels/application/DOMStorageItemsView.ts", ih), oh = a.bind(void 0, ah), sh = class extends np {
	domStorage;
	eventListeners;
	constructor(e) {
		super(oh(ih.domStorageItems), "dom-storage", !0, void 0, void 0, void 0, ["storage-view", "table"]), this.domStorage = e, e.storageKey && this.toolbar?.setStorageKey(e.storageKey), this.showPreview(null, null), this.eventListeners = [], this.setStorage(e);
	}
	createPreview(e, t) {
		let n = `${this.domStorage.isLocalStorage ? "localstorage" : "sessionstorage"}://${e}`, r = Wn.fromString(n, p.XHR, t);
		return qr.createPreview(r, "text/plain");
	}
	setStorage(e) {
		yt(this.eventListeners), this.domStorage = e;
		let t = e.isLocalStorage ? "local-storage-data" : "session-storage-data";
		this.element.setAttribute("jslog", `${D().context(t)}`), e.storageKey && this.toolbar?.setStorageKey(e.storageKey), this.eventListeners = [
			this.domStorage.addEventListener(pe.Events.DOM_STORAGE_ITEMS_CLEARED, this.domStorageItemsCleared, this),
			this.domStorage.addEventListener(pe.Events.DOM_STORAGE_ITEM_REMOVED, this.domStorageItemRemoved, this),
			this.domStorage.addEventListener(pe.Events.DOM_STORAGE_ITEM_ADDED, this.domStorageItemAdded, this),
			this.domStorage.addEventListener(pe.Events.DOM_STORAGE_ITEM_UPDATED, this.domStorageItemUpdated, this)
		], this.refreshItems(), this.selectedItemChanged(null);
	}
	domStorageItemsCleared() {
		this.isShowing() && this.itemsCleared();
	}
	itemsCleared() {
		super.itemsCleared(), Ke.alert(oh(ih.domStorageItemsCleared));
	}
	domStorageItemRemoved(e) {
		this.isShowing() && this.itemRemoved(e.data.key);
	}
	itemRemoved(e) {
		super.itemRemoved(e), Ke.alert(oh(ih.domStorageItemDeleted));
	}
	domStorageItemAdded(e) {
		this.isShowing() && this.itemAdded(e.data.key, e.data.value);
	}
	domStorageItemUpdated(e) {
		this.isShowing() && this.itemUpdated(e.data.key, e.data.value);
	}
	refreshItems() {
		this.#e();
	}
	async #e() {
		let e = await this.domStorage.getItems();
		if (!e || !this.toolbar) return;
		let { filterRegex: t } = this.toolbar, n = e.map((e) => ({
			key: e[0],
			value: e[1]
		})).filter((e) => t?.test(`${e.key} ${e.value}`) ?? !0);
		this.showItems(n);
	}
	deleteAllItems() {
		this.domStorage.clear(), this.domStorageItemsCleared();
	}
	selectedItemChanged(e) {
		let t = this.domStorage.storageKey;
		if (!t) return;
		let n = pn(t).origin, r = this.domStorage.isLocalStorage ? "localStorage" : "sessionStorage";
		if (!e) {
			let e = new wr({
				origin: n,
				storageKey: t
			});
			jt.instance().setFlavor(wr, e);
			return;
		}
		let i = new wr({
			origin: n,
			storageKey: t,
			storageType: r,
			key: e.key
		});
		jt.instance().setFlavor(wr, i);
	}
	removeItem(e) {
		this.domStorage?.removeItem(e);
	}
	setItem(e, t) {
		this.domStorage?.setItem(e, t);
	}
}, ch = Object.getOwnPropertyNames, lh = (e, t) => function() {
	return t || (0, e[ch(e)[0]])((t = { exports: {} }).exports, t), t.exports;
}, uh = lh({ "package/lib/unicode.js"(e, t) {
	t.exports.Space_Separator = /[\u1680\u2000-\u200A\u202F\u205F\u3000]/, t.exports.ID_Start = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE83\uDE86-\uDE89\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]/, t.exports.ID_Continue = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u09FC\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9-\u0AFF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D00-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF9\u1D00-\u1DF9\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDE00-\uDE3E\uDE47\uDE50-\uDE83\uDE86-\uDE99\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD47\uDD50-\uDD59]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4A\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/;
} }), dh = lh({ "package/lib/util.js"(e, t) {
	var n = uh();
	t.exports = {
		isSpaceSeparator(e) {
			return typeof e == "string" && n.Space_Separator.test(e);
		},
		isIdStartChar(e) {
			return typeof e == "string" && (e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e === "$" || e === "_" || n.ID_Start.test(e));
		},
		isIdContinueChar(e) {
			return typeof e == "string" && (e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e >= "0" && e <= "9" || e === "$" || e === "_" || e === "‌" || e === "‍" || n.ID_Continue.test(e));
		},
		isDigit(e) {
			return typeof e == "string" && /[0-9]/.test(e);
		},
		isHexDigit(e) {
			return typeof e == "string" && /[0-9A-Fa-f]/.test(e);
		}
	};
} }), fh = lh({ "package/lib/parse.js"(e, t) {
	var n = dh(), r, i, a, o, s, c, l, u, d;
	t.exports = function(e, t) {
		r = String(e), i = "start", a = [], o = 0, s = 1, c = 0, l = void 0, u = void 0, d = void 0;
		do
			l = re(), ue[i]();
		while (l.type !== "eof");
		return typeof t == "function" ? ee({ "": d }, "", t) : d;
	};
	function ee(e, t, n) {
		let r = e[t];
		if (typeof r == "object" && r) {
			if (Array.isArray(r)) for (let e = 0; e < r.length; e++) {
				let t = String(e), i = ee(r, t, n);
				i === void 0 ? delete r[t] : Object.defineProperty(r, t, {
					value: i,
					writable: !0,
					enumerable: !0,
					configurable: !0
				});
			}
			else for (let e in r) {
				let t = ee(r, e, n);
				t === void 0 ? delete r[e] : Object.defineProperty(r, e, {
					value: t,
					writable: !0,
					enumerable: !0,
					configurable: !0
				});
			}
		}
		return n.call(e, t, r);
	}
	var f, p, te, ne, m;
	function re() {
		for (f = "default", p = "", te = !1, ne = 1;;) {
			m = ie();
			let e = ae[f]();
			if (e) return e;
		}
	}
	function ie() {
		if (r[o]) return String.fromCodePoint(r.codePointAt(o));
	}
	function h() {
		let e = ie();
		return e === "\n" ? (s++, c = 0) : e ? c += e.length : c++, e && (o += e.length), e;
	}
	var ae = {
		default() {
			switch (m) {
				case "	":
				case "\v":
				case "\f":
				case " ":
				case "\xA0":
				case "﻿":
				case "\n":
				case "\r":
				case "\u2028":
				case "\u2029":
					h();
					return;
				case "/":
					h(), f = "comment";
					return;
				case void 0: return h(), g("eof");
			}
			if (n.isSpaceSeparator(m)) {
				h();
				return;
			}
			return ae[i]();
		},
		comment() {
			switch (m) {
				case "*":
					h(), f = "multiLineComment";
					return;
				case "/":
					h(), f = "singleLineComment";
					return;
			}
			throw pe(h());
		},
		multiLineComment() {
			switch (m) {
				case "*":
					h(), f = "multiLineCommentAsterisk";
					return;
				case void 0: throw pe(h());
			}
			h();
		},
		multiLineCommentAsterisk() {
			switch (m) {
				case "*":
					h();
					return;
				case "/":
					h(), f = "default";
					return;
				case void 0: throw pe(h());
			}
			h(), f = "multiLineComment";
		},
		singleLineComment() {
			switch (m) {
				case "\n":
				case "\r":
				case "\u2028":
				case "\u2029":
					h(), f = "default";
					return;
				case void 0: return h(), g("eof");
			}
			h();
		},
		value() {
			switch (m) {
				case "{":
				case "[": return g("punctuator", h());
				case "n": return h(), oe("ull"), g("null", null);
				case "t": return h(), oe("rue"), g("boolean", !0);
				case "f": return h(), oe("alse"), g("boolean", !1);
				case "-":
				case "+":
					h() === "-" && (ne = -1), f = "sign";
					return;
				case ".":
					p = h(), f = "decimalPointLeading";
					return;
				case "0":
					p = h(), f = "zero";
					return;
				case "1":
				case "2":
				case "3":
				case "4":
				case "5":
				case "6":
				case "7":
				case "8":
				case "9":
					p = h(), f = "decimalInteger";
					return;
				case "I": return h(), oe("nfinity"), g("numeric", Infinity);
				case "N": return h(), oe("aN"), g("numeric", NaN);
				case "\"":
				case "'":
					te = h() === "\"", p = "", f = "string";
					return;
			}
			throw pe(h());
		},
		identifierNameStartEscape() {
			if (m !== "u") throw pe(h());
			h();
			let e = le();
			switch (e) {
				case "$":
				case "_": break;
				default: if (!n.isIdStartChar(e)) throw me();
			}
			p += e, f = "identifierName";
		},
		identifierName() {
			switch (m) {
				case "$":
				case "_":
				case "‌":
				case "‍":
					p += h();
					return;
				case "\\":
					h(), f = "identifierNameEscape";
					return;
			}
			if (n.isIdContinueChar(m)) {
				p += h();
				return;
			}
			return g("identifier", p);
		},
		identifierNameEscape() {
			if (m !== "u") throw pe(h());
			h();
			let e = le();
			switch (e) {
				case "$":
				case "_":
				case "‌":
				case "‍": break;
				default: if (!n.isIdContinueChar(e)) throw me();
			}
			p += e, f = "identifierName";
		},
		sign() {
			switch (m) {
				case ".":
					p = h(), f = "decimalPointLeading";
					return;
				case "0":
					p = h(), f = "zero";
					return;
				case "1":
				case "2":
				case "3":
				case "4":
				case "5":
				case "6":
				case "7":
				case "8":
				case "9":
					p = h(), f = "decimalInteger";
					return;
				case "I": return h(), oe("nfinity"), g("numeric", ne * Infinity);
				case "N": return h(), oe("aN"), g("numeric", NaN);
			}
			throw pe(h());
		},
		zero() {
			switch (m) {
				case ".":
					p += h(), f = "decimalPoint";
					return;
				case "e":
				case "E":
					p += h(), f = "decimalExponent";
					return;
				case "x":
				case "X":
					p += h(), f = "hexadecimal";
					return;
			}
			return g("numeric", ne * 0);
		},
		decimalInteger() {
			switch (m) {
				case ".":
					p += h(), f = "decimalPoint";
					return;
				case "e":
				case "E":
					p += h(), f = "decimalExponent";
					return;
			}
			if (n.isDigit(m)) {
				p += h();
				return;
			}
			return g("numeric", ne * Number(p));
		},
		decimalPointLeading() {
			if (n.isDigit(m)) {
				p += h(), f = "decimalFraction";
				return;
			}
			throw pe(h());
		},
		decimalPoint() {
			switch (m) {
				case "e":
				case "E":
					p += h(), f = "decimalExponent";
					return;
			}
			if (n.isDigit(m)) {
				p += h(), f = "decimalFraction";
				return;
			}
			return g("numeric", ne * Number(p));
		},
		decimalFraction() {
			switch (m) {
				case "e":
				case "E":
					p += h(), f = "decimalExponent";
					return;
			}
			if (n.isDigit(m)) {
				p += h();
				return;
			}
			return g("numeric", ne * Number(p));
		},
		decimalExponent() {
			switch (m) {
				case "+":
				case "-":
					p += h(), f = "decimalExponentSign";
					return;
			}
			if (n.isDigit(m)) {
				p += h(), f = "decimalExponentInteger";
				return;
			}
			throw pe(h());
		},
		decimalExponentSign() {
			if (n.isDigit(m)) {
				p += h(), f = "decimalExponentInteger";
				return;
			}
			throw pe(h());
		},
		decimalExponentInteger() {
			if (n.isDigit(m)) {
				p += h();
				return;
			}
			return g("numeric", ne * Number(p));
		},
		hexadecimal() {
			if (n.isHexDigit(m)) {
				p += h(), f = "hexadecimalInteger";
				return;
			}
			throw pe(h());
		},
		hexadecimalInteger() {
			if (n.isHexDigit(m)) {
				p += h();
				return;
			}
			return g("numeric", ne * Number(p));
		},
		string() {
			switch (m) {
				case "\\":
					h(), p += se();
					return;
				case "\"":
					if (te) return h(), g("string", p);
					p += h();
					return;
				case "'":
					if (!te) return h(), g("string", p);
					p += h();
					return;
				case "\n":
				case "\r": throw pe(h());
				case "\u2028":
				case "\u2029":
					he(m);
					break;
				case void 0: throw pe(h());
			}
			p += h();
		},
		start() {
			switch (m) {
				case "{":
				case "[": return g("punctuator", h());
			}
			f = "value";
		},
		beforePropertyName() {
			switch (m) {
				case "$":
				case "_":
					p = h(), f = "identifierName";
					return;
				case "\\":
					h(), f = "identifierNameStartEscape";
					return;
				case "}": return g("punctuator", h());
				case "\"":
				case "'":
					te = h() === "\"", f = "string";
					return;
			}
			if (n.isIdStartChar(m)) {
				p += h(), f = "identifierName";
				return;
			}
			throw pe(h());
		},
		afterPropertyName() {
			if (m === ":") return g("punctuator", h());
			throw pe(h());
		},
		beforePropertyValue() {
			f = "value";
		},
		afterPropertyValue() {
			switch (m) {
				case ",":
				case "}": return g("punctuator", h());
			}
			throw pe(h());
		},
		beforeArrayValue() {
			if (m === "]") return g("punctuator", h());
			f = "value";
		},
		afterArrayValue() {
			switch (m) {
				case ",":
				case "]": return g("punctuator", h());
			}
			throw pe(h());
		},
		end() {
			throw pe(h());
		}
	};
	function g(e, t) {
		return {
			type: e,
			value: t,
			line: s,
			column: c
		};
	}
	function oe(e) {
		for (let t of e) {
			if (ie() !== t) throw pe(h());
			h();
		}
	}
	function se() {
		switch (ie()) {
			case "b": return h(), "\b";
			case "f": return h(), "\f";
			case "n": return h(), "\n";
			case "r": return h(), "\r";
			case "t": return h(), "	";
			case "v": return h(), "\v";
			case "0":
				if (h(), n.isDigit(ie())) throw pe(h());
				return "\0";
			case "x": return h(), ce();
			case "u": return h(), le();
			case "\n":
			case "\u2028":
			case "\u2029": return h(), "";
			case "\r": return h(), ie() === "\n" && h(), "";
			case "1":
			case "2":
			case "3":
			case "4":
			case "5":
			case "6":
			case "7":
			case "8":
			case "9": throw pe(h());
			case void 0: throw pe(h());
		}
		return h();
	}
	function ce() {
		let e = "", t = ie();
		if (!n.isHexDigit(t) || (e += h(), t = ie(), !n.isHexDigit(t))) throw pe(h());
		return e += h(), String.fromCodePoint(parseInt(e, 16));
	}
	function le() {
		let e = "", t = 4;
		for (; t-- > 0;) {
			let t = ie();
			if (!n.isHexDigit(t)) throw pe(h());
			e += h();
		}
		return String.fromCodePoint(parseInt(e, 16));
	}
	var ue = {
		start() {
			if (l.type === "eof") throw _();
			de();
		},
		beforePropertyName() {
			switch (l.type) {
				case "identifier":
				case "string":
					u = l.value, i = "afterPropertyName";
					return;
				case "punctuator":
					fe();
					return;
				case "eof": throw _();
			}
		},
		afterPropertyName() {
			if (l.type === "eof") throw _();
			i = "beforePropertyValue";
		},
		beforePropertyValue() {
			if (l.type === "eof") throw _();
			de();
		},
		beforeArrayValue() {
			if (l.type === "eof") throw _();
			if (l.type === "punctuator" && l.value === "]") {
				fe();
				return;
			}
			de();
		},
		afterPropertyValue() {
			if (l.type === "eof") throw _();
			switch (l.value) {
				case ",":
					i = "beforePropertyName";
					return;
				case "}": fe();
			}
		},
		afterArrayValue() {
			if (l.type === "eof") throw _();
			switch (l.value) {
				case ",":
					i = "beforeArrayValue";
					return;
				case "]": fe();
			}
		},
		end() {}
	};
	function de() {
		let e;
		switch (l.type) {
			case "punctuator":
				switch (l.value) {
					case "{":
						e = {};
						break;
					case "[": e = [];
				}
				break;
			case "null":
			case "boolean":
			case "numeric":
			case "string": e = l.value;
		}
		if (d === void 0) d = e;
		else {
			let t = a[a.length - 1];
			Array.isArray(t) ? t.push(e) : Object.defineProperty(t, u, {
				value: e,
				writable: !0,
				enumerable: !0,
				configurable: !0
			});
		}
		if (typeof e == "object" && e) a.push(e), i = Array.isArray(e) ? "beforeArrayValue" : "beforePropertyName";
		else {
			let e = a[a.length - 1];
			i = e == null ? "end" : Array.isArray(e) ? "afterArrayValue" : "afterPropertyValue";
		}
	}
	function fe() {
		a.pop();
		let e = a[a.length - 1];
		i = e == null ? "end" : Array.isArray(e) ? "afterArrayValue" : "afterPropertyValue";
	}
	function pe(e) {
		return _e(e === void 0 ? `JSON5: invalid end of input at ${s}:${c}` : `JSON5: invalid character '${ge(e)}' at ${s}:${c}`);
	}
	function _() {
		return _e(`JSON5: invalid end of input at ${s}:${c}`);
	}
	function me() {
		return c -= 5, _e(`JSON5: invalid identifier character at ${s}:${c}`);
	}
	function he(e) {
		console.warn(`JSON5: '${ge(e)}' in strings is not valid ECMAScript; consider escaping`);
	}
	function ge(e) {
		let t = {
			"'": "\\'",
			"\"": "\\\"",
			"\\": "\\\\",
			"\b": "\\b",
			"\f": "\\f",
			"\n": "\\n",
			"\r": "\\r",
			"	": "\\t",
			"\v": "\\v",
			"\0": "\\0",
			"\u2028": "\\u2028",
			"\u2029": "\\u2029"
		};
		if (t[e]) return t[e];
		if (e < " ") {
			let t = e.charCodeAt(0).toString(16);
			return "\\x" + ("00" + t).substring(t.length);
		}
		return e;
	}
	function _e(e) {
		let t = SyntaxError(e);
		return t.lineNumber = s, t.columnNumber = c, t;
	}
} }), ph = lh({ "package/lib/stringify.js"(e, t) {
	var n = dh();
	t.exports = function(e, t, r) {
		let i = [], a = "", o, s, c = "", l;
		if (typeof t == "object" && t && !Array.isArray(t) && (r = t.space, l = t.quote, t = t.replacer), typeof t == "function") s = t;
		else if (Array.isArray(t)) {
			o = [];
			for (let e of t) {
				let t;
				typeof e == "string" ? t = e : (typeof e == "number" || e instanceof String || e instanceof Number) && (t = String(e)), t !== void 0 && o.indexOf(t) < 0 && o.push(t);
			}
		}
		return r instanceof Number ? r = Number(r) : r instanceof String && (r = String(r)), typeof r == "number" ? r > 0 && (r = Math.min(10, Math.floor(r)), c = "          ".substr(0, r)) : typeof r == "string" && (c = r.substr(0, 10)), u("", { "": e });
		function u(e, t) {
			let n = t[e];
			switch (n != null && (typeof n.toJSON5 == "function" ? n = n.toJSON5(e) : typeof n.toJSON == "function" && (n = n.toJSON(e))), s && (n = s.call(t, e, n)), n instanceof Number ? n = Number(n) : n instanceof String ? n = String(n) : n instanceof Boolean && (n = n.valueOf()), n) {
				case null: return "null";
				case !0: return "true";
				case !1: return "false";
			}
			if (typeof n == "string") return d(n, !1);
			if (typeof n == "number") return String(n);
			if (typeof n == "object") return Array.isArray(n) ? p(n) : ee(n);
		}
		function d(e) {
			let t = {
				"'": .1,
				"\"": .2
			}, r = {
				"'": "\\'",
				"\"": "\\\"",
				"\\": "\\\\",
				"\b": "\\b",
				"\f": "\\f",
				"\n": "\\n",
				"\r": "\\r",
				"	": "\\t",
				"\v": "\\v",
				"\0": "\\0",
				"\u2028": "\\u2028",
				"\u2029": "\\u2029"
			}, i = "";
			for (let a = 0; a < e.length; a++) {
				let o = e[a];
				switch (o) {
					case "'":
					case "\"":
						t[o]++, i += o;
						continue;
					case "\0": if (n.isDigit(e[a + 1])) {
						i += "\\x00";
						continue;
					}
				}
				if (r[o]) {
					i += r[o];
					continue;
				}
				if (o < " ") {
					let e = o.charCodeAt(0).toString(16);
					i += "\\x" + ("00" + e).substring(e.length);
					continue;
				}
				i += o;
			}
			let a = l || Object.keys(t).reduce((e, n) => t[e] < t[n] ? e : n);
			return i = i.replace(new RegExp(a, "g"), r[a]), a + i + a;
		}
		function ee(e) {
			if (i.indexOf(e) >= 0) throw TypeError("Converting circular structure to JSON5");
			i.push(e);
			let t = a;
			a += c;
			let n = o || Object.keys(e), r = [];
			for (let t of n) {
				let n = u(t, e);
				if (n !== void 0) {
					let e = f(t) + ":";
					c !== "" && (e += " "), e += n, r.push(e);
				}
			}
			let s;
			if (r.length === 0) s = "{}";
			else {
				let e;
				if (c === "") e = r.join(","), s = "{" + e + "}";
				else {
					let n = ",\n" + a;
					e = r.join(n), s = "{\n" + a + e + ",\n" + t + "}";
				}
			}
			return i.pop(), a = t, s;
		}
		function f(e) {
			if (e.length === 0) return d(e, !0);
			let t = String.fromCodePoint(e.codePointAt(0));
			if (!n.isIdStartChar(t)) return d(e, !0);
			for (let r = t.length; r < e.length; r++) if (!n.isIdContinueChar(String.fromCodePoint(e.codePointAt(r)))) return d(e, !0);
			return e;
		}
		function p(e) {
			if (i.indexOf(e) >= 0) throw TypeError("Converting circular structure to JSON5");
			i.push(e);
			let t = a;
			a += c;
			let n = [];
			for (let t = 0; t < e.length; t++) {
				let r = u(String(t), e);
				n.push(r === void 0 ? "null" : r);
			}
			let r;
			if (n.length === 0) r = "[]";
			else if (c === "") r = "[" + n.join(",") + "]";
			else {
				let e = ",\n" + a, i = n.join(e);
				r = "[\n" + a + i + ",\n" + t + "]";
			}
			return i.pop(), a = t, r;
		}
	};
} }), mh = lh({ "package/lib/index.js"(e, t) {
	t.exports = {
		parse: fh(),
		stringify: ph()
	};
} })(), hh = mh.parse;
mh.stringify;
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/application/ExtensionStorageItemsView.ts
var gh = /* @__PURE__ */ e({
	ExtensionStorageItemsDispatcher: () => bh,
	ExtensionStorageItemsView: () => xh
}), _h = {
	extensionStorageItems: "Extension Storage Items",
	extensionStorageItemsCleared: "Extension Storage Items cleared"
}, vh = s("panels/application/ExtensionStorageItemsView.ts", _h), yh = a.bind(void 0, vh), bh;
(function(e) {
	e.Events = /* @__PURE__ */ function(e) {
		return e.ITEM_EDITED = "ItemEdited", e.ITEMS_REFRESHED = "ItemsRefreshed", e;
	}({});
})(bh ||= {});
var xh = class extends np {
	#e;
	extensionStorageItemsDispatcher;
	constructor(e, t) {
		super(yh(_h.extensionStorageItems), "extension-storage", !0, t, void 0, `${D().context("extension-storage-data")}`, ["storage-view", "table"]), this.extensionStorageItemsDispatcher = new c(), this.setStorage(e);
	}
	get #t() {
		return this.#e.storageArea !== ot.StorageArea.Managed;
	}
	parseValue(e) {
		try {
			return hh(e);
		} catch {
			return e;
		}
	}
	removeItem(e) {
		this.#e.removeItem(e).then(() => {
			this.refreshItems();
		});
	}
	setItem(e, t) {
		this.#e.setItem(e, this.parseValue(t)).then(() => {
			this.refreshItems(), this.extensionStorageItemsDispatcher.dispatchEventToListeners(bh.Events.ITEM_EDITED);
		});
	}
	createPreview(e, t) {
		let n = "extension-storage://" + this.#e.extensionId + "/" + this.#e.storageArea + "/preview/" + e, r = Wn.fromString(n, p.XHR, t);
		return qr.createPreview(r, "text/plain");
	}
	setStorage(e) {
		this.#e = e, this.editable = this.#t, this.refreshItems();
	}
	#n() {
		this.isShowing() && (this.itemsCleared(), Ke.alert(yh(_h.extensionStorageItemsCleared)));
	}
	deleteSelectedItem() {
		this.#t && this.deleteSelectedItem();
	}
	refreshItems() {
		this.#r();
	}
	async #r() {
		let e = await this.#e.getItems();
		if (!e || !this.toolbar) return;
		let t = Object.entries(e).map(([e, t]) => ({
			key: e,
			value: typeof t == "string" ? t : JSON.stringify(t)
		})).filter((e) => this.toolbar?.filterRegex?.test(`${e.key} ${e.value}`) ?? !0);
		this.showItems(t), this.extensionStorageItemsDispatcher.dispatchEventToListeners(bh.Events.ITEMS_REFRESHED);
	}
	deleteAllItems() {
		this.#t && this.#e.clear().then(() => {
			this.#n();
		}, () => {
			throw Error("Unable to clear storage.");
		});
	}
}, Sh = "/*\n * Copyright (C) 2006, 2007, 2008 Apple Inc.  All rights reserved.\n * Copyright (C) 2009 Anthony Ricaud <rik@webkit.org>\n *\n * Redistribution and use in source and binary forms, with or without\n * modification, are permitted provided that the following conditions\n * are met:\n *\n * 1.  Redistributions of source code must retain the above copyright\n *     notice, this list of conditions and the following disclaimer.\n * 2.  Redistributions in binary form must reproduce the above copyright\n *     notice, this list of conditions and the following disclaimer in the\n *     documentation and/or other materials provided with the distribution.\n * 3.  Neither the name of Apple Computer, Inc. (\"Apple\") nor the names of\n *     its contributors may be used to endorse or promote products derived\n *     from this software without specific prior written permission.\n *\n * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS \"AS IS\" AND ANY\n * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED\n * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE\n * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY\n * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES\n * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;\n * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND\n * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT\n * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF\n * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n */\n\n.resources-toolbar {\n  border-top: 1px solid var(--sys-color-divider);\n  background-color: var(--sys-color-cdt-base-container);\n}\n\n.top-resources-toolbar {\n  border-bottom: 1px solid var(--sys-color-divider);\n  background-color: var(--sys-color-cdt-base-container);\n}\n\n.resources.panel .status {\n  float: right;\n  height: 16px;\n  margin-top: 1px;\n  margin-left: 4px;\n  line-height: 1em;\n}\n\n.storage-view {\n  display: flex;\n  overflow: hidden;\n}\n\n.storage-view .data-grid:not(.inline) {\n  border: none;\n  flex: auto;\n}\n\n.storage-view .storage-table-error {\n  color: var(--sys-color-error);\n  font-size: 24px;\n  font-weight: bold;\n  padding: 10px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.storage-view.query {\n  padding: 2px 0;\n  overflow: hidden auto;\n}\n\n.storage-view .filter-bar {\n  border-top: none;\n  border-bottom: 1px solid var(--sys-color-divider);\n}\n\n.database-query-group-messages {\n  overflow-y: auto;\n}\n\n.database-query-prompt-container {\n  position: relative;\n  padding: 1px 22px 1px 24px;\n  min-height: 16px;\n}\n\n.database-query-prompt {\n  white-space: pre-wrap;\n}\n\n.prompt-icon {\n  position: absolute;\n  display: block;\n  left: 7px;\n  top: 9px;\n  margin-top: -7px;\n  user-select: none;\n}\n\n.database-user-query .prompt-icon {\n  margin-top: -10px;\n}\n\n.database-query-prompt-container .prompt-icon {\n  top: 6px;\n}\n\n.database-user-query {\n  position: relative;\n  border-bottom: 1px solid var(--sys-color-divider);\n  padding: 1px 22px 1px 24px;\n  min-height: 16px;\n  flex-shrink: 0;\n}\n\n.database-user-query:focus-visible {\n  background-color: var(--sys-color-state-focus-highlight);\n}\n\n.database-query-text {\n  color: var(--sys-color-primary-bright);\n  user-select: text;\n}\n\n.database-query-result {\n  position: relative;\n  padding: 1px 22px;\n  min-height: 16px;\n  margin-left: -22px;\n  padding-right: 0;\n}\n\n.database-query-result.error {\n  color: var(--sys-color-token-property-special);\n  user-select: text;\n}\n\n.database-query-result.error .prompt-icon {\n  margin-top: -9px;\n}\n\n.resources-sidebar {\n  padding: 0;\n  overflow-x: auto;\n  background-color: var(--sys-color-cdt-base-container);\n}\n", Ch = /* @__PURE__ */ e({
	AttemptViewWithFilterRevealer: () => kh,
	FrameDetailsRevealer: () => Dh,
	ResourceRevealer: () => Eh,
	ResourcesPanel: () => Th,
	RuleSetViewRevealer: () => Oh,
	StorageBucketRevealer: () => Ah
}), wh, Th = class e extends oe {
	resourcesLastSelectedItemSetting;
	visibleView;
	pendingViewPromise;
	categoryView;
	storageViews;
	storageViewToolbar;
	domStorageView;
	extensionStorageView;
	cookieView;
	deviceBoundSessionsView;
	sidebar;
	mode = "default";
	constructor(e = "default") {
		super("resources"), this.mode = e, this.registerRequiredCSS(Sh), this.resourcesLastSelectedItemSetting = m.instance().createSetting("resources-last-selected-element-path", []), this.visibleView = null, this.pendingViewPromise = null, this.categoryView = null;
		let t = new S();
		t.setMinimumSize(100, 0), this.storageViews = t.element.createChild("div", "vbox flex-auto"), this.storageViewToolbar = t.element.createChild("devtools-toolbar", "resources-toolbar"), this.splitWidget().setMainWidget(t), this.domStorageView = null, this.extensionStorageView = null, this.cookieView = null, this.deviceBoundSessionsView = null, this.sidebar = new dm(this), this.sidebar.show(this.panelSidebarElement());
	}
	static instance(t = {
		forceNew: null,
		mode: "default"
	}) {
		let { forceNew: n, mode: r } = t;
		return (!wh || n) && (wh = new e(r)), wh;
	}
	static shouldCloseOnReset(e) {
		return [
			Ur,
			Hr,
			Kr,
			Wf
		].some((t) => e instanceof t);
	}
	static async showAndGetSidebar() {
		return await qt.instance().showView("resources"), e.instance().sidebar;
	}
	focus() {
		this.sidebar.focus();
	}
	lastSelectedItemPath() {
		return this.resourcesLastSelectedItemSetting.get();
	}
	setLastSelectedItemPath(e) {
		this.resourcesLastSelectedItemSetting.set(e);
	}
	resetView() {
		this.visibleView && e.shouldCloseOnReset(this.visibleView) && this.showView(null);
	}
	showView(e) {
		this.pendingViewPromise = null, this.visibleView !== e && (this.visibleView && this.visibleView.detach(), e && e.show(this.storageViews), this.visibleView = e, this.storageViewToolbar.removeToolbarItems(), this.storageViewToolbar.classList.toggle("hidden", !0), e instanceof $t && e.toolbarItems().then((e) => {
			e.map((e) => this.storageViewToolbar.appendToolbarItem(e)), this.storageViewToolbar.classList.toggle("hidden", !e.length);
		}));
	}
	async scheduleShowView(e) {
		this.pendingViewPromise = e;
		let t = await e;
		return this.pendingViewPromise === e ? (this.showView(t), t) : null;
	}
	showCategoryView(e, t, n, r) {
		this.categoryView ||= new wm(), this.categoryView.element.setAttribute("jslog", `${D().context(Xn(e))}`), this.categoryView.setHeadline(t), this.categoryView.setText(n), this.categoryView.setLink(r), this.showView(this.categoryView);
	}
	showDOMStorage(e) {
		e && (this.domStorageView ? this.domStorageView.setStorage(e) : this.domStorageView = new sh(e), this.showView(this.domStorageView));
	}
	showExtensionStorage(e) {
		e && (this.extensionStorageView ? this.extensionStorageView.setStorage(e) : this.extensionStorageView = new xh(e), this.showView(this.extensionStorageView));
	}
	showCookies(e, t) {
		let n = e.model(We);
		n && (this.cookieView ? this.cookieView.setCookiesDomain(n, t) : this.cookieView = new Vm(n, t), this.showView(this.cookieView));
	}
	clearCookies(e, t) {
		let n = e.model(We);
		n && n.clear(t).then(() => {
			this.cookieView && this.cookieView.refreshItems();
		});
	}
	showDeviceBoundSession(e, t, n) {
		this.deviceBoundSessionsView ||= new qm(), this.deviceBoundSessionsView.showSession(e, t, n), this.showView(this.deviceBoundSessionsView);
	}
	showDeviceBoundSessionDefault(e, t, n) {
		this.deviceBoundSessionsView ||= new qm(), this.deviceBoundSessionsView.showDefault(e, t, n), this.showView(this.deviceBoundSessionsView);
	}
}, Eh = class {
	async reveal(e) {
		await (await Th.showAndGetSidebar()).showResource(e);
	}
}, Dh = class {
	async reveal(e) {
		(await Th.showAndGetSidebar()).showFrame(e);
	}
}, Oh = class {
	async reveal(e) {
		(await Th.showAndGetSidebar()).showPreloadingRuleSetView(e);
	}
}, kh = class {
	async reveal(e) {
		(await Th.showAndGetSidebar()).showPreloadingAttemptViewWithFilter(e);
	}
}, Ah = class {
	async reveal(e) {
		(await Th.showAndGetSidebar()).showStorageBucket(e.bucketInfo);
	}
};
//#endregion
export { Mo as AppManifestView, om as ApplicationPanelSidebar, os as BackgroundServiceModel, us as BackgroundServiceView, hs as BounceTrackingMitigationsTreeElement, jo as Components, Mm as CookieItemsView, Td as CrashReportContextView, rh as DOMStorageItemsView, bs as DeviceBoundSessionsModel, Cs as DeviceBoundSessionsTreeElement, Um as DeviceBoundSessionsView, gh as ExtensionStorageItemsView, Os as ExtensionStorageModel, hc as FrameDetailsView, Gc as IndexedDBModel, tl as IndexedDBViews, cl as InterestGroupStorageModel, fl as InterestGroupStorageView, vl as InterestGroupTreeElement, Gf as KeyValueStorageItemsView, wl as OpenedWindowDetailsView, ec as OriginTrialTreeView, _d as PreloadingTreeElement, td as PreloadingView, zd as ReportingApiTreeElement, jd as ReportingApiView, Ch as ResourcesPanel, qd as ServiceWorkerCacheViews, lf as ServiceWorkerUpdateCycleView, hf as ServiceWorkersView, Sf as SharedStorageEventsView, rp as SharedStorageItemsView, Of as SharedStorageListTreeElement, Nf as SharedStorageModel, lp as SharedStorageTreeElement, dp as StorageBucketsTreeElement, Lf as StorageItemsToolbar, vp as StorageView, Cp as TrustTokensTreeElement, im as WebMCPTreeElement, Bp as WebMCPView };
