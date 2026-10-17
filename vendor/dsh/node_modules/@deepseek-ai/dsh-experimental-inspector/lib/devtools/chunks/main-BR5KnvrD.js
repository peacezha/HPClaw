import { n as e } from "./rolldown-runtime-DF993M8W.js";
import { D as t, G as n, H as r, K as i, R as a, S as o, X as s, a as c, et as ee, i as l, nt as u, r as d, u as te, v as ne, x as f } from "./common-DMSVbaSb.js";
import { $i as p, $t as re, Af as ie, An as ae, Ao as oe, Cl as m, Dl as se, Do as ce, Dp as le, Dr as ue, Dt as de, Ef as fe, Eo as pe, Fi as h, Fo as me, Hi as g, Hl as _, Ia as he, Ii as v, La as ge, Lf as _e, Li as ve, Nd as y, Nf as ye, No as be, Or as b, Pd as x, Po as xe, Qf as Se, Qi as S, Qr as Ce, Rn as we, Sl as C, Sp as w, To as Te, U as Ee, Uc as De, Xf as T, Yf as E, Yn as Oe, _ as ke, ar as Ae, bo as je, br as D, ea as Me, fa as O, ff as k, fl as Ne, fo as A, fp as j, gf as Pe, ha as Fe, io as Ie, jd as M, jn as Le, jr as N, kd as Re, ks as ze, md as Be, ml as Ve, na as P, ni as He, rr as Ue, ui as We, v as Ge, vo as Ke, xl as F, yo as qe } from "./legacy-dM_vujv7.js";
import { l as I, o as L, p as R } from "./root-DdvV-xPu.js";
import "./platform-D4TUCh2P.js";
import { n as z } from "./theme_support-BJ6jI25-.js";
import { P as Je, S as Ye, f as Xe, n as Ze, r as Qe, s as B, w as V, x as $e, y as et } from "./bindings-DyamxTH2.js";
import { $t as tt, C as nt, G as rt, Ht as it, K as at, Qt as ot, U as st, Wt as ct, _ as lt, at as ut, cn as dt, fn as ft, gn as pt, hn as mt, in as ht, kn as gt, l as _t, mn as vt, nn as yt, on as bt, ot as xt, p as St, un as Ct, wt } from "./common-Bs7hSOUj.js";
import { n as Tt, t as Et } from "./Runnable-Mz0aa-Zm.js";
import { i as Dt } from "./protocol_client-L4-X1Qrb.js";
import { t as Ot } from "./snackbars-Dq3yf1tP.js";
import { k as kt, o as At, s as jt } from "./issues_manager-Ba4w-pt1.js";
import { t as Mt } from "./autofill_manager-BMi-l6xF.js";
import { n as Nt } from "./live-metrics-TfuE0SdD.js";
import { t as Pt } from "./snippets-BWb8aXVv.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/entrypoints/main/ExecutionContextSelector.ts
var Ft = /* @__PURE__ */ e({ ExecutionContextSelector: () => It }), It = class {
	#e;
	#t;
	#n;
	#r;
	constructor(e, t) {
		t.addFlavorChangeListener(C, this.#i, this), t.addFlavorChangeListener(y, this.#o, this), e.addModelListener(m, F.ExecutionContextCreated, this.#l, this), e.addModelListener(m, F.ExecutionContextDestroyed, this.#u, this), e.addModelListener(m, F.ExecutionContextOrderChanged, this.#d, this), this.#e = e, this.#t = t, e.observeModels(m, this);
	}
	modelAdded(e) {
		queueMicrotask(t.bind(this));
		function t() {
			this.#t.flavor(y) || this.#t.setFlavor(y, e.target());
		}
	}
	modelRemoved(e) {
		this.#t.flavor(C)?.runtimeModel === e && this.#p();
		let t = this.#e.models(m);
		this.#t.flavor(y) === e.target() && t.length && this.#t.setFlavor(y, t[0].target());
	}
	#i({ data: e }) {
		e && (this.#t.setFlavor(y, e.target()), this.#r || (this.#n = this.#a(e)));
	}
	#a(e) {
		return e.isDefault ? e.target().name() + ":" + e.frameId : "";
	}
	#o({ data: e }) {
		let t = this.#t.flavor(C);
		if (!e || t && t.target() === e) return;
		let n = e.model(m), r = n ? n.executionContexts() : [];
		if (!r.length) return;
		let i = null;
		for (let e = 0; e < r.length && !i; ++e) this.#s(r[e]) && (i = r[e]);
		for (let e = 0; e < r.length && !i; ++e) this.#c(r[e]) && (i = r[e]);
		this.#r = !0, this.#t.setFlavor(C, i || r[0]), this.#r = !1;
	}
	#s(e) {
		return e.target().targetInfo()?.subtype ? !1 : this.#n && this.#n === this.#a(e) ? !0 : !this.#n && this.#c(e);
	}
	#c(e) {
		return !e.isDefault || !e.frameId || e.target().parentTarget()?.type() === x.FRAME ? !1 : !!(e.target().model(De)?.frameForId(e.frameId))?.isOutermostFrame();
	}
	#l(e) {
		if (this.#n === void 0) {
			this.#f(e.data);
			return;
		}
		switch (e.data.target().type()) {
			case x.AUCTION_WORKLET:
			case x.SHARED_STORAGE_WORKLET:
			case x.SHARED_WORKER:
			case x.ServiceWorker:
			case x.WORKLET:
			case x.Worker: return;
			case x.BROWSER:
			case x.FRAME:
			case x.NODE:
			case x.TAB: this.#f(e.data);
		}
	}
	#u(e) {
		let t = e.data;
		this.#t.flavor(C) === t && this.#p();
	}
	#d(e) {
		let t = e.data.executionContexts();
		for (let e = 0; e < t.length && !this.#f(t[e]); e++);
	}
	#f(e) {
		return !this.#t.flavor(C) || this.#s(e) ? (this.#r = !0, this.#t.setFlavor(C, e), this.#r = !1, !0) : !1;
	}
	#p() {
		let e = this.#e.models(m), t = null;
		for (let n = 0; n < e.length && !t; ++n) {
			let r = e[n].executionContexts();
			for (let e of r) if (this.#c(e)) {
				t = e;
				break;
			}
		}
		if (!t) for (let n = 0; n < e.length && !t; ++n) {
			let r = e[n].executionContexts();
			if (r.length) {
				t = r[0];
				break;
			}
		}
		this.#r = !0, this.#t.setFlavor(C, t), this.#r = !1;
	}
}, Lt = "/*\n * Copyright 2025 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n@scope to (devtools-widget > *) {\n  .global-ai-button-container {\n    margin-left: var(--sys-size-3);\n    margin-right: var(--sys-size-2);\n  }\n\n  .global-ai-button {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    width: var(--sys-size-9);\n    height: var(--sys-size-9);\n    border-radius: var(--sys-shape-corner-full);\n    background-image: var(--app-gradient-google-ai);\n    font: var(--sys-typescale-body4-medium);\n    color: var(--ref-palette-neutral100);\n    transition: width 1s, padding 1s;\n    margin-left: auto;\n    overflow: hidden;\n    position: relative;\n    border: 0;\n\n    &:focus-visible {\n      outline: var(--sys-size-2) solid var(--sys-color-state-focus-ring);\n    }\n\n    &:hover::after,\n    &:active::after {\n      content: \"\";\n      height: 100%;\n      width: 100%;\n      border-radius: inherit;\n      position: absolute;\n      top: 0;\n      left: 0;\n    }\n\n    &:hover::after {\n      background-color: var(--sys-color-state-hover-on-prominent);\n    }\n\n    &:active::after {\n      background-color: var(--sys-color-state-ripple-primary);\n    }\n\n    devtools-icon {\n      width: var(--sys-size-7);\n      height: var(--sys-size-7);\n      color: var(--ref-palette-neutral100);\n    }\n\n    .button-text {\n      opacity: 0%;\n      transition: opacity 1s;\n    }\n  }\n\n  .global-ai-button.expanded {\n    width: auto;\n    padding: 0 var(--sys-size-6) 0 var(--sys-size-5);\n\n    .button-text {\n      opacity: 100%;\n    }\n  }\n}\n", Rt = /* @__PURE__ */ e({
	DEFAULT_VIEW: () => Jt,
	GlobalAiButton: () => W,
	GlobalAiButtonState: () => qt,
	GlobalAiButtonToolbarProvider: () => Yt
}), { render: zt, html: Bt, Directives: { classMap: Vt } } = be, H = {
	aiAssistance: "AI assistance",
	openAiAssistance: "Open AI assistance panel",
	gemini: "Gemini",
	openGemini: "Open Gemini panel"
}, Ht = i("entrypoints/main/GlobalAiButton.ts", H), U = r.bind(void 0, Ht), Ut = 5e3, Wt = /* @__PURE__ */ new Date("2026-09-30");
function Gt() {
	return l.instance().createSetting("global-ai-button-click-count", 0, d.SYNCED);
}
function Kt() {
	let e = Gt();
	e.set(e.get() + 1);
}
var qt = /* @__PURE__ */ function(e) {
	return e.PROMOTION = "promotion", e.DEFAULT = "default", e;
}({}), Jt = (e, t, n) => {
	let r = Vt({
		"global-ai-button": !0,
		expanded: e.state === "promotion"
	}), i = tt() ? {
		title: U(H.openGemini),
		label: U(H.gemini)
	} : {
		title: U(H.openAiAssistance),
		label: U(H.aiAssistance)
	}, a = ot();
	zt(Bt`
    <style>${Lt}</style>
    <div class="global-ai-button-container">
      <button class=${r} @click=${e.onClick} title=${i.title} jslog=${Fe().track({ click: !0 }).context("global-ai-button")}>
        <devtools-icon name=${a}></devtools-icon>
        <span class="button-text">${` ${i.label}`}</span>
      </button>
    </div>
  `, n);
}, W = class extends He {
	#e;
	#t = "default";
	#n = !1;
	#r;
	constructor(e, t) {
		super(e), this.#e = t ?? Jt, this.requestUpdate(), this.#c() && this.#l();
	}
	willHide() {
		super.willHide(), this.#s(), this.#r && window.clearTimeout(this.#r);
	}
	#i = () => {
		this.#n = !0;
	};
	#a = () => {
		this.#n = !1;
	};
	#o() {
		b.instance().tabbedPane.headerElement().addEventListener("mouseenter", this.#i), b.instance().tabbedPane.headerElement().addEventListener("mouseleave", this.#a);
	}
	#s() {
		b.instance().tabbedPane.headerElement().removeEventListener("mouseenter", this.#i), b.instance().tabbedPane.headerElement().removeEventListener("mouseleave", this.#a);
	}
	#c() {
		return !!R.devToolsGlobalAiButton?.promotionEnabled && /* @__PURE__ */ new Date() < Wt && Gt().get() < 2;
	}
	#l() {
		this.#t = "promotion", this.requestUpdate(), this.#o(), this.#u();
	}
	#u() {
		this.#r && window.clearTimeout(this.#r), this.#r = window.setTimeout(() => {
			if (this.#n) {
				this.#u();
				return;
			}
			this.#t = "default", this.requestUpdate(), this.#s();
		}, Ut);
	}
	#d() {
		N.instance().showViewInLocation("freestyler", "drawer-view"), Kt();
		let e = b.instance().isUserExplicitlyUpdatedDrawerOrientation();
		R.devToolsFlexibleLayout?.verticalDrawerEnabled && !e && (b.instance().showDrawer({
			focus: !0,
			hasTargetDrawer: !1
		}), b.instance().toggleDrawerOrientation({ force: ue.VERTICAL }));
	}
	performUpdate() {
		this.#e({
			state: this.#t,
			onClick: this.#d.bind(this)
		}, void 0, this.contentElement);
	}
}, G, Yt = class e {
	#e;
	#t;
	constructor() {
		this.#t = document.createElement("devtools-widget"), new W(this.#t), this.#e = new Ue(this.#t), this.#e.setVisible(!1);
	}
	item() {
		return this.#e;
	}
	static instance(t = { forceNew: null }) {
		let { forceNew: n } = t;
		return (!G || n) && (G = new e()), G;
	}
}, Xt = class {
	context;
	constructor(e) {
		let t = new ee();
		this.context = t;
		let n = l.instance({
			forceNew: !0,
			...e.settingsCreationOptions
		});
		t.set(l, n);
		let r = new f();
		t.set(f, r);
		let i = new M(t, e.overrideAutoStartModels);
		t.set(M, i);
		let a = new se(i);
		t.set(se, a);
		let o = new Be(i);
		t.set(Be, o);
		let s = new _(i, n, o, null);
		t.set(_, s);
		let c = new V();
		t.set(V, c);
		let u = new $e(n, i);
		t.set($e, u);
		let d = new Ze(i, c), te = new Xe(d, i);
		t.set(Xe, te);
		let ne = new B(d, i, u, c);
		t.set(B, ne);
	}
}, Zt = /* @__PURE__ */ e({
	MainImpl: () => Y,
	MainMenuItem: () => an,
	PauseListener: () => sn,
	ReloadActionDelegate: () => ln,
	SearchActionDelegate: () => rn,
	SettingsButtonProvider: () => on,
	ZoomActionDelegate: () => nn,
	sendOverProtocol: () => cn
}), K = {
	customizeAndControlDevtools: "Customize and control DevTools",
	dockSide: "Dock side",
	placementOfDevtoolsRelativeToThe: "Placement of DevTools relative to the page. ({PH1} to restore last position)",
	undockIntoSeparateWindow: "Undock into separate window",
	dockToBottom: "Dock to bottom",
	dockToRight: "Dock to right",
	dockToLeft: "Dock to left",
	focusDebuggee: "Focus page",
	hideConsoleDrawer: "Hide console drawer",
	showConsoleDrawer: "Show console drawer",
	moreTools: "More tools",
	help: "Help",
	dockSideNavigation: "Use left and right arrow keys to navigate the options",
	aiModelDownloaded: "AI model downloaded",
	getDevToolsMcp: "Get `DevTools MCP`"
}, Qt = i("entrypoints/main/MainImpl.ts", K), q = r.bind(void 0, Qt), $t, en = {
	register(e) {},
	async get(e) {
		return window.localStorage.getItem(e);
	},
	set(e, t) {
		window.localStorage.setItem(e, t);
	},
	remove(e) {
		window.localStorage.removeItem(e);
	},
	clear: () => window.localStorage.clear()
}, J;
function tn() {
	return J === void 0 && (J = window.location.toString().startsWith("devtools://devtools/custom/")), J;
}
var Y = class e {
	#e = Promise.withResolvers();
	#t;
	#n;
	constructor() {
		e.instanceForTest = this, this.#r();
	}
	static time(e) {
		T() || console.time(e);
	}
	static timeEnd(e) {
		T() || console.timeEnd(e);
	}
	async #r() {
		console.timeStamp("Main._loaded"), L.setPlatform(ie());
		let [e, t] = await Promise.all([new Promise((e) => {
			E.getHostConfig(e);
		}), new Promise((e) => E.getPreferences(e))]);
		console.timeStamp("Main._gotPreferences"), this.#i(), Object.assign(R, e);
		let n = { settingsCreationOptions: {
			...this.createSettingsStorage(t),
			settingRegistrations: te(),
			logSettingAccess: je,
			runSettingsMigration: !T()
		} };
		this.#n = new Xt(n), u(this.#n.context), I.cleanUpStaleExperiments(), await this.requestAndRegisterLocaleData(), k.syncSetting(l.instance().moduleSetting("sync-preferences").get());
		let r = e.devToolsVeLogging, i = l.instance().createSetting("veLogsTestMode", !1).get();
		if (r?.enabled) {
			if (r?.testing || i) {
				pe(!0, Te.TEST);
				let e = {
					processingThrottler: new j(0),
					keyboardLogThrottler: new j(10),
					hoverLogThrottler: new j(50),
					dragLogThrottler: new j(50),
					clickLogThrottler: new j(10),
					resizeLogThrottler: new j(10)
				};
				this.#t = Ke(e);
			} else this.#t = Ke();
		}
		this.#s();
	}
	#i() {
		self.Extensions ||= {}, self.Host ||= {}, self.Host.userMetrics ||= k, self.Host.UserMetrics ||= fe, self.ProtocolClient ||= {}, self.ProtocolClient.test ||= Dt;
	}
	async requestAndRegisterLocaleData() {
		let e = l.instance().moduleSetting("language").get(), t = s.instance({
			create: !0,
			data: {
				navigatorLanguage: navigator.language,
				settingLanguage: e,
				lookupClosestDevToolsLocale: n
			}
		});
		k.language(t.locale), t.locale !== "en-US" && await a("en-US");
		try {
			await a(t.locale);
		} catch (e) {
			console.warn(`Unable to fetch & register locale data for '${t.locale}', falling back to 'en-US'. Cause: `, e), t.forceFallbackLocale();
		}
	}
	createSettingsStorage(e) {
		this.#o();
		let t = "";
		tn() ? t = "__custom__" : !L.queryParam("can_dock") && L.queryParam("debugFrontend") && !T() && (t = "__bundled__");
		let n;
		n = !T() && window.localStorage ? new c(window.localStorage, en, t) : new c({}, void 0, t);
		let r = {
			register: (e) => E.registerPreference(e, { synced: !1 }),
			set: E.setPreference,
			get: (e) => new Promise((t) => {
				E.getPreference(e, t);
			}),
			remove: E.removePreference,
			clear: E.clearPreferences
		}, i = {
			...r,
			register: (e) => E.registerPreference(e, { synced: !0 })
		};
		return {
			syncedStorage: new c(e, i, t),
			globalStorage: new c(e, r, t),
			localStorage: n
		};
	}
	#a(e, t) {
		let n = I.getValueFromStorage(e);
		n !== void 0 && t.aboutFlag && (t.setEnabled(n), E.setChromeFlag(t.aboutFlag, n));
	}
	#o() {
		let e = (R.devToolsProtocolMonitor?.enabled ?? !1) || !!L.queryParam("isChromeForTesting"), t = I.registerHostExperiment({
			name: w.PROTOCOL_MONITOR,
			title: "Protocol Monitor",
			aboutFlag: "devtools-protocol-monitor",
			isEnabled: e,
			requiresChromeRestart: !1,
			docLink: "https://developer.chrome.com/blog/new-in-devtools-92/#protocol-monitor"
		});
		this.#a(w.PROTOCOL_MONITOR, t), I.register(w.INSTRUMENTATION_BREAKPOINTS, "Instrumentation breakpoints"), I.register(w.USE_SOURCE_MAP_SCOPES, "Use scope information from source maps"), I.registerHostExperiment({
			name: w.DURABLE_MESSAGES,
			title: "Durable Messages",
			aboutFlag: "devtools-enable-durable-messages",
			isEnabled: R.devToolsEnableDurableMessages?.enabled ?? !1,
			requiresChromeRestart: !1
		}), I.registerHostExperiment({
			name: w.JPEG_XL,
			title: "JPEG XL support",
			aboutFlag: "enable-jxl-image-format",
			isEnabled: R.devToolsJpegXlImageFormat?.enabled ?? !1,
			requiresChromeRestart: !0
		}), I.registerHostExperiment({
			name: w.PLUS_BUTTON,
			title: "Show \"+\" button on the tab strip for adding tools",
			aboutFlag: "devtools-plus-button",
			isEnabled: R.devToolsPlusButton?.enabled ?? !1,
			requiresChromeRestart: !1
		}), I.enableExperimentsByDefault([w.USE_SOURCE_MAP_SCOPES]);
		let n = L.queryParam("enabledExperiments");
		n && I.setServerEnabledExperiments(n.split(";"));
		for (let e of I.allConfigurableExperiments()) e.isEnabled() ? k.experimentEnabledAtLaunch(e.name) : k.experimentDisabledAtLaunch(e.name);
	}
	async #s() {
		e.time("Main._createAppUI");
		let t = pt.instance();
		t.addEventListener(mt.FileSystemError, (e) => Ot.show({ message: e.data }));
		let n = l.instance().createSetting("ui-theme", "systemPreferred");
		ae(document), z.hasInstance() || z.instance({
			forceNew: !0,
			setting: n
		}), re(document.documentElement), Le(document.body), this.#_(document);
		let r = !!L.queryParam("can_dock");
		Ce.instance({
			forceNew: !0,
			win: window,
			frontendHost: E
		}), D.initialize(), D.installHandler(document), N.instance({
			forceNew: !0,
			universe: this.#n
		}), ct.instance(), it.instance(), At.instance({
			forceNew: !0,
			ensureFirst: !0,
			showThirdPartyIssuesSetting: kt(),
			hideIssueSetting: jt()
		}), h.instance({
			forceNew: !0,
			canDock: r
		}), ze.instance({ forceNew: !0 });
		let i = M.instance();
		i.addEventListener(Re.SUSPEND_STATE_CHANGED, this.#v.bind(this)), Je.instance({ forceNew: !0 }), et.instance(), new Qe(), i.setScopeTarget(i.primaryPageTarget()), O.instance().addFlavorChangeListener(y, ({ data: e }) => {
			let t = e?.outermostTarget();
			i.setScopeTarget(t);
		}), gt.instance({
			forceNew: !0,
			workspace: V.instance(),
			targetManager: i,
			debuggerWorkspaceBinding: B.instance(),
			settings: l.instance()
		}), self.Extensions.extensionServer = St.instance({ forceNew: !0 }), new vt(t, V.instance()), t.addPlatformFileSystem("snippet://", new Pt());
		let a = ft.instance({
			forceNew: !0,
			workspace: V.instance(),
			breakpointManager: gt.instance()
		}), o = new _t(a);
		nt.setLinkDecorator(o), ht.instance({
			forceNew: !0,
			workspace: V.instance()
		}), new It(i, O.instance());
		let s = Ct.instance({
			forceNew: !0,
			hostConfig: R,
			pageResourceLoader: _.instance(),
			targetManager: i
		}), c = dt.instance({
			forceNew: !0,
			inspectorFrontendHost: E,
			projectSettingsModel: s
		});
		bt.instance({
			forceNew: !0,
			automaticFileSystemManager: c,
			isolatedFileSystemManager: t,
			workspace: V.instance()
		}), Mt.instance(), Nt.instance(), wt.instance(), ut.instance().addEventListener(xt.DOWNLOADED_AND_SESSION_CREATED, () => Ot.show({ message: q(K.aiModelDownloaded) })), new sn();
		let ee = P.instance({ forceNew: !0 });
		g.instance({
			forceNew: !0,
			actionRegistry: ee
		}), this.#f(), _e() && (ye.instance().getProfile().then((e) => {
			if (!e) return;
			let { profile: t, isEligible: n } = e;
			qe("gdp-client-initialize", t ? "has-profile" : n ? "no-profile-and-eligible" : "no-profile-and-not-eligible");
		}), at.instance().initialize(), at.instance().addEventListener(rt.BADGE_TRIGGERED, async (e) => {
			$t ??= await import("./common-DfB2Jn7T.js");
			let t = new $t.BadgeNotification(), { badge: n, reason: r } = e.data;
			t.present(n, r);
		})), R.devToolsGeminiRebranding?.enabled && await st.maybeShow(), e.timeEnd("Main._createAppUI");
		let u = Me()[0];
		if (!u) throw Error("Unable to boot DevTools, as the appprovider is missing");
		await this.#c(await u.loadAppProvider());
	}
	async #c(t) {
		e.time("Main._showAppUI");
		let n = t.createApp();
		if (h.instance().initialize(), z.instance().fetchColorsAndApplyHostTheme(), n.presentUI(document), P.instance().hasAction("elements.toggle-element-search")) {
			let e = P.instance().getAction("elements.toggle-element-search");
			E.events.addEventListener(Se.EnterInspectElementMode, () => {
				e.execute();
			}, this);
		}
		E.events.addEventListener(Se.RevealSourceLine, this.#p, this);
		let r = b.instance();
		ht.instance().addEventListener(yt.LOCAL_OVERRIDES_REQUESTED, (e) => {
			r.displaySelectOverrideFolderInfobar(e.data);
		}), await r.createToolbars(), E.loadCompleted(), Ee.initializeAnnouncerElements(), h.instance().announceDockLocation(), window.setTimeout(this.#l.bind(this), 0), e.timeEnd("Main._showAppUI");
	}
	async #l() {
		e.time("Main._initializeTarget");
		for (let e of Et()) await e().run();
		await this.#t, E.readyForTest(), this.#e.resolve(), window.setTimeout(this.#d.bind(this), 100), await this.#u(), e.timeEnd("Main._initializeTarget");
	}
	async #u() {
		let e = M.instance().primaryPageTarget(), t = e?.targetInfo()?.url, n = t ? ne.extractOrigin(t) : void 0, r = "__devtools_ve_inspection_binding__";
		if (e && await he(n)) {
			let t = e.model(m);
			await t?.addBinding({ name: r }), t?.addEventListener(F.BindingCalled, (e) => {
				e.data.name === r && (e.data.payload === "true" || e.data.payload === "false" ? ce(e.data.payload === "true", (e) => {
					ce(!1), t?.defaultExecutionContext()?.evaluate({
						expression: `window.inspect(${JSON.stringify(e)})`,
						includeCommandLineAPI: !1,
						silent: !0,
						returnByValue: !1,
						generatePreview: !1
					}, !1, !1);
				}) : Ie(e.data.payload === "null" ? null : e.data.payload));
			});
		}
	}
	async #d() {
		e.time("Main._lateInitialization"), St.instance().initializeExtensions(), Promise.all(Tt().map(async (e) => await (await e()).run())), e.timeEnd("Main._lateInitialization");
	}
	readyForTest() {
		return this.#e.promise;
	}
	#f() {
		f.instance().addEventListener(o.MESSAGE_ADDED, e);
		function e({ data: e }) {
			e.show && f.instance().show();
		}
	}
	#p(e) {
		let { url: n, lineNumber: r, columnNumber: i } = e.data, a = V.instance().uiSourceCodeForURL(n);
		if (a) {
			t(a.uiLocation(r, i));
			return;
		}
		function o(e) {
			let a = e.data;
			a.url() === n && (t(a.uiLocation(r, i)), V.instance().removeEventListener(Ye.UISourceCodeAdded, o));
		}
		V.instance().addEventListener(Ye.UISourceCodeAdded, o);
	}
	#m(e) {
		e.handled || g.instance().handleShortcut(e);
	}
	#h(e) {
		let t = new CustomEvent("clipboard-" + e.type, { bubbles: !0 });
		t.original = e;
		let n = e.target && e.target.ownerDocument, r = n ? We(n) : null;
		r && r.dispatchEvent(t), t.handled && e.preventDefault();
	}
	#g(e) {
		(e.handled || e.target.classList.contains("popup-glasspane")) && e.preventDefault();
	}
	#_(e) {
		e.addEventListener("keydown", this.#m.bind(this), !1), e.addEventListener("beforecopy", this.#h.bind(this), !0), e.addEventListener("copy", this.#h.bind(this), !1), e.addEventListener("cut", this.#h.bind(this), !1), e.addEventListener("paste", this.#h.bind(this), !1), e.addEventListener("contextmenu", this.#g.bind(this), !0);
	}
	#v() {
		let e = M.instance().allTargetsSuspended();
		b.instance().onSuspendStateChanged(e);
	}
	static instanceForTest = null;
};
globalThis.Main = globalThis.Main || {}, globalThis.Main.Main = Y;
var nn = class {
	handleAction(e, t) {
		if (E.isHostedMode()) return !1;
		switch (t) {
			case "main.zoom-in": return E.zoomIn(), !0;
			case "main.zoom-out": return E.zoomOut(), !0;
			case "main.zoom-reset": return E.resetZoom(), !0;
		}
		return !1;
	}
}, rn = class {
	handleAction(e, t) {
		let n = ke.fromElement(We(document));
		if (!n) {
			let e = b.instance().currentPanelDeprecated();
			if (e?.searchableView && (n = e.searchableView()), !n) return !1;
		}
		switch (t) {
			case "main.search-in-panel.find": return n.handleFindShortcut();
			case "main.search-in-panel.cancel": return n.handleCancelSearchShortcut();
			case "main.search-in-panel.find-next": return n.handleFindNextShortcut();
			case "main.search-in-panel.find-previous": return n.handleFindPreviousShortcut();
		}
		return !1;
	}
}, X, an = class e {
	#e;
	constructor() {
		this.#e = new Ae(this.#t.bind(this), !0, !0, "main-menu", "dots-vertical"), this.#e.element.classList.add("main-menu"), this.#e.setTitle(q(K.customizeAndControlDevtools));
	}
	static instance(t = { forceNew: null }) {
		let { forceNew: n } = t;
		return (!X || n) && (X = new e()), X;
	}
	item() {
		return this.#e;
	}
	#t(e) {
		let t = h.instance();
		if (t.canDock()) {
			let n = document.createElement("div");
			n.classList.add("flex-auto", "flex-centered", "location-menu"), n.setAttribute("jslog", `${ge("dock-side").track({ keydown: "ArrowDown|ArrowLeft|ArrowRight" })}`), n.tabIndex = -1, de(n, K.dockSide + K.dockSideNavigation);
			let [i] = g.instance().shortcutsForAction("main.toggle-dock");
			me(xe`
        <span class="dockside-title"
              title=${q(K.placementOfDevtoolsRelativeToThe, { PH1: i.title() })}>
          ${q(K.dockSide)}
        </span>
        <devtools-toolbar @mousedown=${(e) => e.consume()}>
          <devtools-button class="toolbar-button"
                           jslog=${A().track({ click: !0 }).context("current-dock-state-undock")}
                           title=${q(K.undockIntoSeparateWindow)}
                           aria-label=${q(K.undockIntoSeparateWindow)}
                           .iconName=${"dock-window"}
                           .toggled=${t.dockSide() === v.UNDOCKED}
                           .toggledIconName=${"dock-window"}
                           .toggleType=${S.PRIMARY}
                           .variant=${p.ICON_TOGGLE}
                           @click=${r.bind(null, v.UNDOCKED)}></devtools-button>
          <devtools-button class="toolbar-button"
                           jslog=${A().track({ click: !0 }).context("current-dock-state-left")}
                           title=${q(K.dockToLeft)}
                           aria-label=${q(K.dockToLeft)}
                           .iconName=${"dock-left"}
                           .toggled=${t.dockSide() === v.LEFT}
                           .toggledIconName=${"dock-left"}
                           .toggleType=${S.PRIMARY}
                           .variant=${p.ICON_TOGGLE}
                           @click=${r.bind(null, v.LEFT)}></devtools-button>
          <devtools-button class="toolbar-button"
                           jslog=${A().track({ click: !0 }).context("current-dock-state-bottom")}
                           title=${q(K.dockToBottom)}
                           aria-label=${q(K.dockToBottom)}
                           .iconName=${"dock-bottom"}
                           .toggled=${t.dockSide() === v.BOTTOM}
                           .toggledIconName=${"dock-bottom"}
                           .toggleType=${S.PRIMARY}
                           .variant=${p.ICON_TOGGLE}
                           @click=${r.bind(null, v.BOTTOM)}></devtools-button>
          <devtools-button class="toolbar-button"
                           jslog=${A().track({ click: !0 }).context("current-dock-state-right")}
                           title=${q(K.dockToRight)}
                           aria-label=${q(K.dockToRight)}
                           .iconName=${"dock-right"}
                           .toggled=${t.dockSide() === v.RIGHT}
                           .toggledIconName=${"dock-right"}
                           .toggleType=${S.PRIMARY}
                           .variant=${p.ICON_TOGGLE}
                           @click=${r.bind(null, v.RIGHT)}></devtools-button>
        </devtools-toolbar>
      `, n, { host: this }), n.addEventListener("keydown", (e) => {
				let t = 0;
				if (e.key === "ArrowLeft") t = -1;
				else if (e.key === "ArrowRight") t = 1;
				else if (e.key === "ArrowDown") {
					n.closest(".soft-context-menu")?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
					return;
				} else return;
				let r = Array.from(n.querySelectorAll("devtools-button")), i = r.findIndex((e) => e.hasFocus());
				i = le(i + t, 0, r.length - 1), r[i].focus(), e.consume(!0);
			}), e.headerSection().appendCustomItem(n, "dock-side");
		}
		let n = this.#e.element;
		function r(r) {
			t.once(ve.AFTER_DOCK_SIDE_CHANGED).then(() => n.focus()), t.setDockSide(r), e.discard();
		}
		if (e.defaultSection().appendAction("freestyler.main-menu", void 0, !0), e.defaultSection().appendItem(q(K.getDevToolsMcp), () => {
			oe("https://github.com/ChromeDevTools/chrome-devtools-mcp");
		}, {
			additionalElement: we("get-devtools-mcp"),
			jslogContext: "get-devtools-mcp"
		}), e.defaultSection().appendSeparator(), t.dockSide() === v.UNDOCKED) {
			let t = M.instance().primaryPageTarget();
			t && t.type() === x.FRAME && e.defaultSection().appendAction("inspector-main.focus-debuggee", q(K.focusDebuggee));
		}
		e.defaultSection().appendAction("main.toggle-drawer", b.instance().drawerVisible() ? q(K.hideConsoleDrawer) : q(K.showConsoleDrawer)), e.appendItemsAtLocation("mainMenu");
		let i = e.defaultSection().appendSubMenuItem(q(K.moreTools), !1, "more-tools"), a = N.instance().getRegisteredViewExtensions();
		a.sort((e, t) => {
			let n = e.title(), r = t.title();
			return n.localeCompare(r);
		});
		for (let e of a) {
			let t = e.location(), n = e.persistence(), r = e.title(), a = e.viewId();
			if (a === "issues-pane") {
				i.defaultSection().appendItem(r, () => {
					k.issuesPanelOpenedFrom(Pe.HAMBURGER_MENU), N.instance().showView("issues-pane", !0);
				}, { jslogContext: a });
				continue;
			}
			n === "closeable" && (t === "drawer-view" || t === "panel") && i.defaultSection().appendItem(r, () => {
				N.instance().showView(a, !0, !1);
			}, {
				isPreviewFeature: e.isPreviewFeature(),
				jslogContext: a
			});
		}
		e.footerSection().appendSubMenuItem(q(K.help), !1, "help").appendItemsAtLocation("mainMenuHelp");
	}
}, Z, on = class e {
	#e;
	constructor() {
		this.#e = Oe.createActionButton("settings.show");
	}
	static instance(t = { forceNew: null }) {
		let { forceNew: n } = t;
		return (!Z || n) && (Z = new e()), Z;
	}
	item() {
		return this.#e;
	}
}, sn = class {
	constructor() {
		M.instance().addModelListener(Ne, Ve.DebuggerPaused, this.#e, this);
	}
	#e(e) {
		M.instance().removeModelListener(Ne, Ve.DebuggerPaused, this.#e, this);
		let n = e.data, r = n.debuggerPausedDetails();
		O.instance().setFlavor(y, n.target()), t(r);
	}
};
function cn(e, t) {
	return new Promise((n, r) => {
		let i = Dt.sendRawMessage;
		if (!i) return r("Unable to send message to test client");
		i(e, t, (e, ...t) => e ? r(e) : n(t));
	});
}
var ln = class {
	handleAction(e, t) {
		return t === "main.debug-reload" && (lt(), !0);
	}
}, un = /* @__PURE__ */ e({
	SimpleApp: () => Q,
	SimpleAppProvider: () => dn
}), Q = class {
	presentUI(e) {
		let t = new Ge();
		b.instance().show(t.element), t.attachToDocument(e), t.focus();
	}
}, $, dn = class e {
	static instance(t = { forceNew: null }) {
		let { forceNew: n } = t;
		return (!$ || n) && ($ = new e()), $;
	}
	createApp() {
		return new Q();
	}
};
//#endregion
export { Ft as a, Rt as i, Y as n, Zt as r, un as t };
