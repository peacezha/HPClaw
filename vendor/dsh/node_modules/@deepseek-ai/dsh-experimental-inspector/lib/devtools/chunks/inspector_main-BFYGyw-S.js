import { n as e } from "./rolldown-runtime-DF993M8W.js";
import { H as t, K as n, i as r } from "./common-DMSVbaSb.js";
import { Fo as i, Ja as ee, Nd as a, No as o, Or as s, Pd as c, Qf as te, Uc as l, Ut as u, Xf as d, Yf as f, ac as ne, dc as p, ei as re, fa as m, fc as h, fl as ie, g as ae, in as g, jd as _, kd as v, ml as oe, ni as se, pf as ce, tr as y, vn as le, vr as ue, xn as b, yr as x } from "./legacy-dM_vujv7.js";
import { o as S, p as C } from "./root-DdvV-xPu.js";
import "./platform-D4TUCh2P.js";
import { P as w } from "./StringUtilities-CMDxNrEc.js";
import { p as T } from "./bindings-DyamxTH2.js";
import { g as E } from "./common-Bs7hSOUj.js";
import { i as D } from "./Runnable-Mz0aa-Zm.js";
import { t as O } from "./settings_ui-B3VIsMZM.js";
import { i as k } from "./mobile_throttling-DGhe-4CD.js";
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/entrypoints/inspector_main/renderingOptions.css.mjs
var A = "/*\n * Copyright 2015 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  padding: 12px;\n}\n\ndevtools-checkbox {\n  margin: 0 0 10px;\n  flex: none;\n}\n\n.panel-section-separator {\n  height: 1px;\n  margin-bottom: 10px;\n  background: var(--sys-color-divider);\n  flex: none;\n}\n\n.panel-section-separator:last-child {\n  background: transparent;\n}\n\n.chrome-select-label {\n  margin-bottom: 16px;\n}\n", j = /* @__PURE__ */ e({
	ReloadActionDelegate: () => de,
	RenderingOptionsView: () => z
}), M = {
	paintFlashing: "Paint flashing",
	highlightsAreasOfThePageGreen: "Highlights areas of the page (green) that need to be repainted. May not be suitable for people prone to photosensitive epilepsy.",
	layoutShiftRegions: "Layout shift regions",
	highlightsAreasOfThePageBlueThat: "Highlights areas of the page (blue) that were shifted. May not be suitable for people prone to photosensitive epilepsy.",
	layerBorders: "Layer borders",
	showsLayerBordersOrangeoliveAnd: "Shows layer borders (orange/olive) and tiles (cyan).",
	frameRenderingStats: "Frame Rendering Stats",
	plotsFrameThroughputDropped: "Plots frame throughput, dropped frames distribution, and GPU memory.",
	scrollingPerformanceIssues: "Scrolling performance issues",
	highlightsElementsTealThatCan: "Highlights elements (teal) that can slow down scrolling, including touch & wheel event handlers and other main-thread scrolling situations.",
	highlightAds: "Highlight ads",
	highlightsElementsRedDetectedToBe: "Highlights elements (red) detected to be ads.",
	disableLocalFonts: "Disable local fonts",
	disablesLocalSourcesInFontface: "Disables `local()` sources in `@font-face` rules. Requires a page reload to apply.",
	emulateAFocusedPage: "Emulate a focused page",
	emulatesAFocusedPage: "Keep page focused. Commonly used for debugging disappearing elements.",
	emulateAutoDarkMode: "Enable automatic dark mode",
	emulatesAutoDarkMode: "Enables automatic dark mode and sets `prefers-color-scheme` to `dark`.",
	forcesMediaTypeForTestingPrint: "Forces media type for testing print and screen styles",
	forcesCssPreferscolorschemeMedia: "Forces CSS `prefers-color-scheme` media feature",
	forcesCssPrefersreducedmotion: "Forces CSS `prefers-reduced-motion` media feature",
	forcesCssPreferscontrastMedia: "Forces CSS `prefers-contrast` media feature",
	forcesCssPrefersreduceddataMedia: "Forces CSS `prefers-reduced-data` media feature",
	forcesCssPrefersreducedtransparencyMedia: "Forces CSS `prefers-reduced-transparency` media feature",
	forcesCssColorgamutMediaFeature: "Forces CSS `color-gamut` media feature",
	forcesVisionDeficiencyEmulation: "Forces vision deficiency emulation",
	forcesOsTextScaleEmulation: "Forces OS text scale emulation",
	disableAvifImageFormat: "Disable `AVIF` image format",
	requiresAPageReloadToApplyAnd: "Requires a page reload to apply and disables caching for image requests.",
	disableJpegXlImageFormat: "Disable `JPEG XL` image format",
	disableWebpImageFormat: "Disable `WebP` image format",
	forcesCssForcedColors: "Forces CSS forced-colors media feature"
}, N = n("entrypoints/inspector_main/RenderingOptions.ts", M), P = t.bind(void 0, N), F = () => window.matchMedia("not all and (prefers-reduced-data), (prefers-reduced-data)").matches, I = () => window.matchMedia("not all and (prefers-reduced-transparency), (prefers-reduced-transparency)").matches, L = () => window.matchMedia("not all and (prefers-contrast), (prefers-contrast)").matches, R = () => !!C.devToolsJpegXlImageFormat?.enabled, z = class extends re {
	#e = !1;
	constructor() {
		super({ useShadowDom: !0 }), this.registerRequiredCSS(A), this.element.setAttribute("jslog", `${ee("rendering").track({ resize: !0 })}`), this.#t(P(M.paintFlashing), P(M.highlightsAreasOfThePageGreen), r.instance().moduleSetting("show-paint-rects")), this.#t(P(M.layoutShiftRegions), P(M.highlightsAreasOfThePageBlueThat), r.instance().moduleSetting("show-layout-shift-regions")), this.#t(P(M.layerBorders), P(M.showsLayerBordersOrangeoliveAnd), r.instance().moduleSetting("show-debug-borders")), this.#t(P(M.frameRenderingStats), P(M.plotsFrameThroughputDropped), r.instance().moduleSetting("show-fps-counter")), this.#t(P(M.scrollingPerformanceIssues), P(M.highlightsElementsTealThatCan), r.instance().moduleSetting("show-scroll-bottleneck-rects")), this.#t(P(M.highlightAds), P(M.highlightsElementsRedDetectedToBe), r.instance().moduleSetting("show-ad-highlights")), this.#t(P(M.disableLocalFonts), P(M.disablesLocalSourcesInFontface), r.instance().moduleSetting("local-fonts-disabled")), this.#t(P(M.emulateAFocusedPage), P(M.emulatesAFocusedPage), r.instance().moduleSetting("emulate-page-focus"), { toggle: ce.ToggleEmulateFocusedPageFromRenderingTab }), this.#t(P(M.emulateAutoDarkMode), P(M.emulatesAutoDarkMode), r.instance().moduleSetting("emulate-auto-dark-mode")), this.contentElement.createChild("div").classList.add("panel-section-separator"), this.#r(P(M.forcesCssPreferscolorschemeMedia), r.instance().moduleSetting("emulated-css-media-feature-prefers-color-scheme")), this.#r(P(M.forcesMediaTypeForTestingPrint), r.instance().moduleSetting("emulated-css-media")), this.#r(P(M.forcesCssForcedColors), r.instance().moduleSetting("emulated-css-media-feature-forced-colors")), L() && this.#r(P(M.forcesCssPreferscontrastMedia), r.instance().moduleSetting("emulated-css-media-feature-prefers-contrast")), this.#r(P(M.forcesCssPrefersreducedmotion), r.instance().moduleSetting("emulated-css-media-feature-prefers-reduced-motion")), F() && this.#r(P(M.forcesCssPrefersreduceddataMedia), r.instance().moduleSetting("emulated-css-media-feature-prefers-reduced-data")), I() && this.#r(P(M.forcesCssPrefersreducedtransparencyMedia), r.instance().moduleSetting("emulated-css-media-feature-prefers-reduced-transparency")), this.#r(P(M.forcesCssColorgamutMediaFeature), r.instance().moduleSetting("emulated-css-media-feature-color-gamut")), this.contentElement.createChild("div").classList.add("panel-section-separator"), this.#r(P(M.forcesVisionDeficiencyEmulation), r.instance().moduleSetting("emulated-vision-deficiency")), this.contentElement.createChild("div").classList.add("panel-section-separator"), this.#r(P(M.forcesOsTextScaleEmulation), r.instance().moduleSetting("emulated-os-text-scale")), this.contentElement.createChild("div").classList.add("panel-section-separator");
		let e = r.instance().moduleSetting("avif-format-disabled"), t = r.instance().moduleSetting("jpeg-xl-format-disabled"), n = r.instance().moduleSetting("webp-format-disabled");
		this.#t(P(M.disableAvifImageFormat), P(M.requiresAPageReloadToApplyAnd), e);
		let i = this.#t(P(M.disableWebpImageFormat), P(M.requiresAPageReloadToApplyAnd), n);
		this.#n(i, t), this.contentElement.createChild("div").classList.add("panel-section-separator");
	}
	#t(e, t, n, r) {
		let i = u.create(e, !1, t, n.name);
		return g(i, n, r), this.contentElement.appendChild(i), i;
	}
	#n(e, t) {
		this.#e || !R() || (this.#e = !0, e.before(this.#t(P(M.disableJpegXlImageFormat), P(M.requiresAPageReloadToApplyAnd), t)));
	}
	#r(e, t) {
		let n = O(t, e);
		n && this.contentElement.appendChild(n);
	}
}, de = class {
	handleAction(e, t) {
		let n = r.instance().moduleSetting("emulated-css-media-feature-prefers-color-scheme");
		if (t === "rendering.toggle-prefers-color-scheme") {
			let e = [
				"",
				"light",
				"dark"
			], t = e.findIndex((e) => e === n.get() || "");
			return n.set(e[(t + 1) % 3]), !0;
		}
		return !1;
	}
}, B = "/*\n * Copyright 2017 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.node-icon {\n  width: 28px;\n  height: 26px;\n  /* stylelint-disable-next-line custom-property-pattern */\n  background-image: var(--image-file-nodeIcon);\n  background-size: 17px 17px;\n  background-repeat: no-repeat;\n  background-position: center;\n  opacity: 80%;\n  cursor: auto;\n}\n\n.node-icon:hover {\n  opacity: 100%;\n}\n\n.node-icon.inactive {\n  filter: grayscale(100%);\n}\n", V = /* @__PURE__ */ e({
	BackendSettingsSync: () => X,
	DEFAULT_VIEW: () => K,
	FocusDebuggeeActionDelegate: () => me,
	InspectorMainImpl: () => G,
	NodeIndicator: () => q,
	NodeIndicatorProvider: () => ge,
	ReloadActionDelegate: () => pe,
	SourcesPanelIndicator: () => Y
}), { html: H } = o, U = {
	main: "Main",
	tab: "Tab",
	javascriptIsDisabled: "JavaScript is disabled",
	openDedicatedTools: "Open dedicated DevTools for `Node.js`"
}, fe = n("entrypoints/inspector_main/InspectorMain.ts", U), W = t.bind(void 0, fe), G = class {
	async run() {
		let e = !0;
		await ne(async () => {
			let t = S.queryParam("v8only") ? c.NODE : S.queryParam("targetType") === "tab" || S.isTraceApp() ? c.TAB : c.FRAME, n = t === c.FRAME && S.queryParam("panel") === "sources", r = t === c.FRAME ? W(U.main) : W(U.tab), i = _.instance().createTarget("main", r, t, null, void 0, n);
			if (await new Promise((e) => {
				let t = _.instance();
				t.observeTargets({
					targetAdded: (n) => {
						n === t.primaryPageTarget() && (n.setName(W(U.main)), e(n));
					},
					targetRemoved: (e) => {}
				});
			}), e) {
				if (e = !1, n) {
					let e = i.model(ie);
					e && (e.isReadyToPause() || await e.once(oe.DebuggerIsReadyToPause), e.pause());
				}
				t !== c.TAB && i.runtimeAgent().invoke_runIfWaitingForDebugger();
			}
		}, E.connectionLost), new Y(), new X(), new k(), f.events.addEventListener(te.ReloadInspectedPage, ({ data: e }) => {
			l.reloadAllPages(e);
		});
	}
};
D(() => new G());
var pe = class {
	handleAction(e, t) {
		switch (t) {
			case "inspector-main.reload": return l.reloadAllPages(!1), !0;
			case "inspector-main.hard-reload": return l.reloadAllPages(!0), !0;
		}
		return !1;
	}
}, me = class {
	handleAction(e, t) {
		let n = _.instance().primaryPageTarget();
		return n ? (n.pageAgent().invoke_bringToFront(), !0) : !1;
	}
}, he = (e) => !!e.find((e) => e.type === "node" && !e.attached), K = (e, t, n) => {
	let { nodeProcessRunning: r } = e;
	i(H`
    <style>${B}</style>
    <div
        class="node-icon ${r ? "" : "inactive"}"
        title=${W(U.openDedicatedTools)}
        @click=${() => f.openNodeFrontend()}>
    </div>
    `, n);
}, q = class extends se {
	#e;
	#t = [];
	#n = !1;
	constructor(e, t = K) {
		super(e, { useShadowDom: !0 }), this.#e = t, _.instance().addEventListener(v.AVAILABLE_TARGETS_CHANGED, (e) => {
			this.#t = e.data, this.requestUpdate();
		});
	}
	performUpdate() {
		if (d()) return;
		let e = he(this.#t);
		if (!this.#n && !e) return;
		this.#n = !0;
		let t = { nodeProcessRunning: e };
		this.#e(t, {}, this.contentElement);
	}
}, J, ge = class e {
	#e;
	#t;
	constructor() {
		this.#t = document.createElement("devtools-widget"), new q(this.#t), this.#e = new y(this.#t), this.#e.setVisible(!1);
	}
	item() {
		return this.#e;
	}
	static instance(t = { forceNew: null }) {
		let { forceNew: n } = t;
		return (!J || n) && (J = new e()), J;
	}
}, Y = class {
	constructor() {
		r.instance().moduleSetting("java-script-disabled").addChangeListener(e), e();
		function e() {
			let e = [];
			r.instance().moduleSetting("java-script-disabled").get() && e.push(W(U.javascriptIsDisabled)), s.instance().setPanelWarnings("sources", e);
		}
	}
}, X = class {
	#e;
	#t;
	#n;
	constructor() {
		this.#e = r.instance().moduleSetting("auto-attach-to-created-pages"), this.#e.addChangeListener(this.#i, this), this.#i(), this.#t = r.instance().moduleSetting("network.ad-blocking-enabled"), this.#t.addChangeListener(this.#a, this), this.#n = r.instance().moduleSetting("emulate-page-focus"), this.#n.addChangeListener(this.#a, this), _.instance().addModelListener(p, h.TARGET_INFO_CHANGED, this.#o, this), _.instance().observeTargets(this);
	}
	#r(e) {
		e.type() === c.FRAME && e.parentTarget()?.type() !== c.FRAME && (e.pageAgent().invoke_setAdBlockingEnabled({ enabled: this.#t.get() }), e.emulationAgent().invoke_setFocusEmulationEnabled({ enabled: this.#n.get() }));
	}
	#i() {
		f.setOpenNewWindowForPopups(this.#e.get());
	}
	#a() {
		for (let e of _.instance().targets()) this.#r(e);
	}
	#o(e) {
		let t = _.instance().targetById(e.data.targetId);
		t && t.outermostTarget() === t && this.#r(t);
	}
	targetAdded(e) {
		this.#r(e);
	}
	targetRemoved(e) {}
};
p.install();
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/entrypoints/inspector_main/outermostTargetSelector.css.mjs
var _e = "/*\n * Copyright 2023 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  padding: 2px 1px 2px 2px;\n  white-space: nowrap;\n  display: flex;\n  flex-direction: column;\n  height: 36px;\n  justify-content: center;\n  overflow-y: auto;\n}\n\n.title {\n  overflow: hidden;\n  padding-left: 8px;\n  text-overflow: ellipsis;\n  flex-grow: 0;\n}\n\n.subtitle {\n  color: var(--sys-color-token-subtle);\n  margin-right: 3px;\n  overflow: hidden;\n  padding-left: 8px;\n  text-overflow: ellipsis;\n  flex-grow: 0;\n}\n\n:host(.highlighted) .subtitle {\n  color: inherit;\n}\n", ve = /* @__PURE__ */ e({ OutermostTargetSelector: () => be }), Z = {
	targetNotSelected: "Page: Not selected",
	targetS: "Page: {PH1}"
}, ye = n("entrypoints/inspector_main/OutermostTargetSelector.ts", Z), Q = t.bind(void 0, ye), $, be = class e {
	listItems = new x();
	#e;
	#t;
	constructor() {
		this.#e = new ae(this.listItems, this), this.#e.setRowHeight(36), this.#t = new y(this.#e.element), this.#t.setTitle(Q(Z.targetNotSelected)), this.listItems.addEventListener(ue.ITEMS_REPLACED, () => this.#t.setEnabled(!!this.listItems.length)), this.#t.element.classList.add("toolbar-has-dropdown");
		let e = _.instance();
		e.addModelListener(p, h.TARGET_INFO_CHANGED, this.#r, this), e.addEventListener(v.NAME_CHANGED, this.#i, this), e.observeTargets(this), m.instance().addFlavorChangeListener(a, this.#a, this);
	}
	static instance(t = { forceNew: null }) {
		let { forceNew: n } = t;
		return (!$ || n) && ($ = new e()), $;
	}
	item() {
		return this.#t;
	}
	highlightedItemChanged(e, t, n, r) {
		n && n.classList.remove("highlighted"), r && r.classList.add("highlighted");
	}
	titleFor(e) {
		return e.name();
	}
	targetAdded(e) {
		e.outermostTarget() === e && (this.listItems.insertWithComparator(e, this.#n()), this.#t.setVisible(this.listItems.length > 1), (e === _.instance().primaryPageTarget() || e === m.instance().flavor(a)) && this.#e.selectItem(e));
	}
	targetRemoved(e) {
		let t = this.listItems.indexOf(e);
		t !== -1 && (this.listItems.remove(t), this.#t.setVisible(this.listItems.length > 1));
	}
	#n() {
		return (e, t) => {
			let n = e.targetInfo(), r = t.targetInfo();
			return !n || !r ? 0 : !n.subtype?.length && r.subtype?.length ? -1 : n.subtype?.length && !r.subtype?.length ? 1 : n.url.localeCompare(r.url);
		};
	}
	#r(e) {
		let t = _.instance().targetById(e.data.targetId);
		t && t.outermostTarget() === t && (this.targetRemoved(t), this.targetAdded(t));
	}
	#i(e) {
		let t = e.data;
		t && t.outermostTarget() === t && (this.targetRemoved(t), this.targetAdded(t));
	}
	#a({ data: e }) {
		this.#e.selectItem(e?.outermostTarget() || null);
	}
	createElementForItem(e) {
		let t = document.createElement("div");
		t.classList.add("target");
		let n = le(t, { cssFile: _e }), r = n.createChild("div", "title");
		b(r, w(this.titleFor(e), 100));
		let i = n.createChild("div", "subtitle");
		return b(i, this.#o(e)), t;
	}
	#o(e) {
		let t = e.targetInfo();
		return e === _.instance().primaryPageTarget() && t ? T(t.url) : e.targetInfo()?.subtype || "";
	}
	isItemSelectable(e) {
		return !0;
	}
	itemSelected(e) {
		let t = e ? Q(Z.targetS, { PH1: this.titleFor(e) }) : Q(Z.targetNotSelected);
		this.#t.setTitle(t), e && e !== m.instance().flavor(a)?.outermostTarget() && m.instance().setFlavor(a, e);
	}
};
//#endregion
export { V as InspectorMain, ve as OutermostTargetSelector, j as RenderingOptions };
