import { n as e } from "./rolldown-runtime-DF993M8W.js";
import { $ as t, D as n, H as r, K as i, Q as a, W as o, i as s, r as c } from "./common-DMSVbaSb.js";
import { $i as l, Bs as u, Cd as d, Cl as f, Dd as p, Dt as ee, Fo as te, Fs as ne, Gs as m, Hs as re, Is as h, La as ie, Ls as g, Mo as ae, No as oe, Od as _, Or as v, Po as se, Ps as y, Qn as ce, Rs as b, Sd as x, St as le, T as ue, Td as de, Ur as fe, Us as S, Ut as pe, Vs as me, Ws as he, Xi as C, Xn as ge, Zn as _e, _d as w, ai as ve, ar as ye, ei as be, fd as T, ff as xe, fn as Se, fo as Ce, gd as E, ha as we, ja as Te, jd as Ee, jo as De, md as D, ni as Oe, pf as ke, qa as Ae, qs as je, si as Me, tr as Ne, ud as Pe, w as Fe, wd as O, xd as k, zs as Ie } from "./legacy-dM_vujv7.js";
import "./platform-D4TUCh2P.js";
import { k as Le } from "./StringUtilities-CMDxNrEc.js";
import { Et as A, r as Re, wt as j } from "./common-Bs7hSOUj.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/mobile_throttling/ThrottlingPresets.ts
var ze = /* @__PURE__ */ e({ ThrottlingPresets: () => P }), M = {
	noThrottling: "No CPU and no network throttling",
	noInternetConnectivity: "No internet connectivity",
	lowTierMobile: "Low-tier mobile",
	slowGXCpuSlowdown: "Slow 3G & 6x CPU slowdown",
	slowGXCpuSlowdownCalibrated: "Slow 3G & {PH1}x CPU slowdown",
	midtierMobile: "Mid-tier mobile",
	fastGXCpuSlowdown: "Fast 3G & 4x CPU slowdown",
	fastGXCpuSlowdownCalibrated: "Fast 3G & {PH1}x CPU slowdown",
	custom: "Custom",
	checkNetworkAndPerformancePanels: "Check Network and Performance panels"
}, Be = i("panels/mobile_throttling/ThrottlingPresets.ts", M), N = r.bind(void 0, Be), P = class e {
	static getNoThrottlingConditions() {
		return {
			title: typeof E.title == "function" ? E.title() : E.title,
			description: N(M.noThrottling),
			network: E,
			cpuThrottlingOption: S,
			jslogContext: "no-throttling"
		};
	}
	static getOfflineConditions() {
		return {
			title: typeof w.title == "function" ? w.title() : w.title,
			description: N(M.noInternetConnectivity),
			network: w,
			cpuThrottlingOption: S,
			jslogContext: "offline"
		};
	}
	static getLowEndMobileConditions() {
		let e = h.rate() !== 0, t = e ? h : me, n = e ? N(M.slowGXCpuSlowdownCalibrated, { PH1: t.rate() }) : N(M.slowGXCpuSlowdown);
		return {
			title: N(M.lowTierMobile),
			description: n,
			network: k,
			cpuThrottlingOption: t,
			jslogContext: "low-end-mobile"
		};
	}
	static getMidTierMobileConditions() {
		let e = g.rate() !== 0, t = e ? g : re, n = e ? N(M.fastGXCpuSlowdownCalibrated, { PH1: t.rate() }) : N(M.fastGXCpuSlowdown);
		return {
			title: N(M.midtierMobile),
			description: n,
			network: x,
			cpuThrottlingOption: t,
			jslogContext: "mid-tier-mobile"
		};
	}
	static getCustomConditions() {
		return {
			title: N(M.custom),
			description: N(M.checkNetworkAndPerformancePanels),
			jslogContext: "custom"
		};
	}
	static getMobilePresets() {
		return [
			e.getMidTierMobileConditions(),
			e.getLowEndMobileConditions(),
			e.getCustomConditions()
		];
	}
	static getAdvancedMobilePresets() {
		return [e.getOfflineConditions()];
	}
	static networkPresets = [
		T,
		x,
		k,
		w
	];
	static cpuThrottlingPresets = [
		S,
		re,
		me,
		u,
		h,
		g
	];
};
globalThis.MobileThrottling = globalThis.MobileThrottling || {}, globalThis.MobileThrottling.networkPresets = P.networkPresets;
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/mobile_throttling/ThrottlingManager.ts
var Ve = /* @__PURE__ */ e({
	ActionDelegate: () => Ge,
	DEFAULT_SAVE_DATA_VIEW: () => We,
	SaveDataOverrideSelect: () => z,
	ThrottlingManager: () => R,
	throttlingManager: () => B
}), F = {
	offline: "Offline",
	forceDisconnectedFromNetwork: "Force disconnected from network",
	throttling: "Throttling",
	cpuThrottlingIsEnabled: "CPU throttling is enabled",
	cpuThrottling: "CPU throttling",
	excessConcurrency: "Exceeding the default value may degrade system performance.",
	resetConcurrency: "Reset to the default value",
	hardwareConcurrency: "Hardware concurrency",
	hardwareConcurrencySettingLabel: "Override the value reported by navigator.hardwareConcurrency",
	recommendedThrottling: "{PH1} – recommended",
	calibrate: "Calibrate…",
	recalibrate: "Recalibrate…",
	noSaveDataOverride: "'Save-Data': default",
	saveDataOn: "'Save-Data': on",
	saveDataOff: "'Save-Data': off",
	saveDataSettingTooltip: "Override the value reported by navigator.connection.saveData on the page"
}, He = i("panels/mobile_throttling/ThrottlingManager.ts", F), I = r.bind(void 0, He), L, Ue = class {
	#e = Promise.resolve();
	push(e) {
		return new Promise((t) => {
			this.#e = this.#e.then(async () => t(await e));
		});
	}
}, R = class e extends a {
	cpuThrottlingControls;
	cpuThrottlingOptions;
	customNetworkConditionsSetting;
	currentNetworkThrottlingConditionKeySetting;
	calibratedCpuThrottlingSetting;
	lastNetworkThrottlingConditions;
	cpuThrottlingManager;
	#e = !1;
	#t = new Ue();
	get hardwareConcurrencyOverrideEnabled() {
		return this.#e;
	}
	constructor() {
		super(), this.cpuThrottlingManager = y.instance(), this.cpuThrottlingManager.addEventListener(Ie.RATE_CHANGED, (e) => this.onCPUThrottlingRateChangedOnSDK(e.data)), this.cpuThrottlingControls = /* @__PURE__ */ new Set(), this.cpuThrottlingOptions = P.cpuThrottlingPresets, this.customNetworkConditionsSetting = O(), this.currentNetworkThrottlingConditionKeySetting = d(), this.calibratedCpuThrottlingSetting = s.instance().createSetting("calibrated-cpu-throttling", {}, c.GLOBAL), D.instance().addEventListener(D.Events.CONDITIONS_CHANGED, () => {
			this.lastNetworkThrottlingConditions = this.#n();
			let e = D.instance().networkConditions();
			this.currentNetworkThrottlingConditionKeySetting.set(e.key);
		}), this.isDirty() && D.instance().setNetworkConditions(this.#n());
	}
	#n() {
		let e = this.currentNetworkThrottlingConditionKeySetting.get();
		return de(e) || (this.customNetworkConditionsSetting.get().find((t) => t.key === e) ?? E);
	}
	static instance(t = { forceNew: null }) {
		let { forceNew: n } = t;
		return (!L || n) && (L = new e()), L;
	}
	createOfflineToolbarCheckbox() {
		let e = new _e(I(F.offline), I(F.forceDisconnectedFromNetwork), t.bind(this));
		e.element.setAttribute("jslog", `${Ce("disconnect-from-network").track({ click: !0 })}`), D.instance().addEventListener(D.Events.CONDITIONS_CHANGED, n), e.setChecked(D.instance().isOffline());
		function t() {
			if (e.checked()) D.instance().setNetworkConditions(w);
			else {
				let e = !this.lastNetworkThrottlingConditions.download && !this.lastNetworkThrottlingConditions.upload ? E : this.lastNetworkThrottlingConditions;
				D.instance().setNetworkConditions(e);
			}
		}
		function n() {
			e.setChecked(D.instance().isOffline());
		}
		return e;
	}
	createMobileThrottlingButton() {
		let e = new ye(i, void 0, void 0, "mobile-throttling");
		e.setTitle(I(F.throttling)), e.setDarkText();
		let t = [], n = -1, r = new Je(a, o);
		return e;
		function i(e) {
			for (let i = 0; i < t.length; ++i) {
				let a = t[i];
				a && (a.title !== P.getCustomConditions().title || a.description !== P.getCustomConditions().description) && e.defaultSection().appendCheckboxItem(a.title, r.optionSelected.bind(r, a), {
					checked: n === i,
					jslogContext: a.jslogContext
				});
			}
		}
		function a(e) {
			t = [];
			for (let n of e) {
				for (let e of n.items) t.push(e);
				t.push(null);
			}
			return t;
		}
		function o(r) {
			n = r;
			let i = t[r];
			i && (e.setText(i.title), e.setTitle(`${i.title}: ${i.description}`));
		}
	}
	updatePanelIcon() {
		let e = [];
		this.cpuThrottlingManager.cpuThrottlingRate() !== ne.NO_THROTTLING && e.push(I(F.cpuThrottlingIsEnabled)), v.instance().setPanelWarnings("timeline", e);
	}
	setCPUThrottlingOption(e) {
		this.cpuThrottlingManager.setCPUThrottlingOption(e);
	}
	onCPUThrottlingRateChangedOnSDK(e) {
		e !== ne.NO_THROTTLING && xe.actionTaken(ke.CpuThrottlingEnabled);
		let t = this.cpuThrottlingOptions.indexOf(this.cpuThrottlingManager.cpuThrottlingOption());
		for (let e of this.cpuThrottlingControls) e.setSelectedIndex(t);
		this.updatePanelIcon();
	}
	createCPUThrottlingSelector() {
		let e = () => {
			let e = this.calibratedCpuThrottlingSetting.get();
			return e.low || e.mid ? I(F.recalibrate) : I(F.calibrate);
		}, t = new ce(() => {
			if (t.selectedIndex() === t.options().length - 1) {
				let e = this.cpuThrottlingOptions.indexOf(this.cpuThrottlingManager.cpuThrottlingOption());
				t.setSelectedIndex(e), n(this.calibratedCpuThrottlingSetting);
			} else this.setCPUThrottlingOption(this.cpuThrottlingOptions[t.selectedIndex()]);
		}, I(F.cpuThrottling), "", "cpu-throttling");
		this.cpuThrottlingControls.add(t);
		let r = this.cpuThrottlingManager.cpuThrottlingOption(), i = [], a = this.cpuThrottlingOptions;
		for (let e = 0; e < this.cpuThrottlingOptions.length; ++e) {
			let n = this.cpuThrottlingOptions[e], a = n.title(), o = n.jslogContext, s = t.createOption(a, o);
			t.addOption(s), r === n && t.setSelectedIndex(e), i.push(s);
		}
		let o = t.createOption(e(), "");
		return t.addOption(o), i.push(o), {
			control: t,
			updateRecommendedOption(t) {
				for (let e = 0; e < i.length - 1; e++) {
					let n = a[e];
					i[e].text = n === t ? I(F.recommendedThrottling, { PH1: n.title() }) : n.title(), i[e].disabled = n.rate() === 0;
				}
				i[i.length - 1].textContent = e();
			}
		};
	}
	setSaveDataOverride(t) {
		let n = m.UNSET;
		t === 1 ? n = m.ENABLED : t === 2 && (n = m.DISABLED);
		for (let e of Ee.instance().models(je)) this.#t.push(e.setDataSaverOverride(n));
		this.dispatchEventToListeners(e.Events.SAVE_DATA_OVERRIDE_CHANGED, t);
	}
	createSaveDataOverrideSelector(e) {
		let t = document.createElement("select");
		return t.title = I(F.saveDataSettingTooltip), ee(t, I(F.saveDataSettingTooltip)), e && (t.className = e), ve(t, Me(z)), t;
	}
	createHardwareConcurrencySelector() {
		let e = new Ne(Se("devtools-text-input", "number", "hardware-concurrency"));
		e.setTitle(I(F.hardwareConcurrencySettingLabel));
		let t = e.element;
		t.min = "1", e.setEnabled(!1);
		let n = pe.create(I(F.hardwareConcurrency), !1, I(F.hardwareConcurrencySettingLabel), "hardware-concurrency"), r = new ge("Reset concurrency", "undo", void 0, "hardware-concurrency-reset");
		r.setTitle(I(F.resetConcurrency));
		let i = new De();
		i.name = "warning-filled", i.classList.add("small");
		let a = new Ne(i);
		return a.setTitle(I(F.excessConcurrency)), n.disabled = !0, r.element.classList.add("concurrency-hidden"), a.element.classList.add("concurrency-hidden"), this.cpuThrottlingManager.getHardwareConcurrency().then((i) => {
			if (i === void 0) return;
			let o = (e) => {
				e >= 1 && this.cpuThrottlingManager.setHardwareConcurrency(e), e > i ? a.element.classList.remove("concurrency-hidden") : a.element.classList.add("concurrency-hidden"), e === i ? r.element.classList.add("concurrency-hidden") : r.element.classList.remove("concurrency-hidden");
			};
			t.value = `${i}`, t.oninput = () => o(Number(t.value)), n.disabled = !1, n.addEventListener("change", () => {
				this.#e = n.checked, e.setEnabled(this.hardwareConcurrencyOverrideEnabled), o(this.hardwareConcurrencyOverrideEnabled ? Number(t.value) : i);
			}), r.addEventListener(ge.Events.CLICK, () => {
				t.value = `${i}`, o(i);
			});
		}), {
			numericInput: e,
			reset: r,
			warning: a,
			checkbox: n
		};
	}
	setHardwareConcurrency(e) {
		this.cpuThrottlingManager.setHardwareConcurrency(e);
	}
	isDirty() {
		let e = D.instance().networkConditions(), t = this.#n();
		return !_(e, t);
	}
}, We = (e, t, n) => {
	te(se`
    <option value="unset" ?selected=${e.selectedIndex === 0}>${I(F.noSaveDataOverride)}</option>
    <option value="enabled" ?selected=${e.selectedIndex === 1}>${I(F.saveDataOn)}</option>
    <option value="disabled" ?selected=${e.selectedIndex === 2}>${I(F.saveDataOff)}</option>
  `, n, { container: { listeners: { change: (t) => e.onSelect(t.target.selectedIndex) } } });
}, z = class extends t(Oe) {
	#e = 0;
	#t;
	constructor(e, t = We) {
		super(e), this.#t = t, R.instance().addEventListener(R.Events.SAVE_DATA_OVERRIDE_CHANGED, ({ data: e }) => {
			this.#e = e, this.requestUpdate();
		}), this.performUpdate();
	}
	performUpdate() {
		this.#t({
			selectedIndex: this.#e,
			onSelect: (e) => {
				R.instance().setSaveDataOverride(e);
			}
		}, void 0, this.contentElement);
	}
};
(function(e) {
	e.Events = /* @__PURE__ */ function(e) {
		return e.SAVE_DATA_OVERRIDE_CHANGED = "SaveDataOverrideChanged", e;
	}({});
})(R ||= {});
var Ge = class {
	handleAction(e, t) {
		return t === "network-conditions.network-online" ? (D.instance().setNetworkConditions(E), !0) : t === "network-conditions.network-low-end-mobile" ? (D.instance().setNetworkConditions(k), !0) : t === "network-conditions.network-mid-tier-mobile" ? (D.instance().setNetworkConditions(x), !0) : t === "network-conditions.network-offline" && (D.instance().setNetworkConditions(w), !0);
	}
};
function B() {
	return R.instance();
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/mobile_throttling/MobileThrottlingSelector.ts
var Ke = /* @__PURE__ */ e({ MobileThrottlingSelector: () => Je }), V = {
	disabled: "Disabled",
	presets: "Presets",
	advanced: "Advanced"
}, qe = i("panels/mobile_throttling/MobileThrottlingSelector.ts", V), H = r.bind(void 0, qe), Je = class {
	populateCallback;
	selectCallback;
	options;
	constructor(e, t) {
		this.populateCallback = e, this.selectCallback = t, y.instance().addEventListener(Ie.RATE_CHANGED, this.conditionsChanged, this), D.instance().addEventListener(D.Events.CONDITIONS_CHANGED, this.conditionsChanged, this), this.options = this.populateOptions(), this.conditionsChanged();
	}
	optionSelected(e) {
		D.instance().setNetworkConditions(e.network), B().setCPUThrottlingOption(e.cpuThrottlingOption);
	}
	populateOptions() {
		let e = {
			title: H(V.disabled),
			items: [P.getNoThrottlingConditions()]
		}, t = {
			title: H(V.presets),
			items: P.getMobilePresets()
		}, n = {
			title: H(V.advanced),
			items: P.getAdvancedMobilePresets()
		};
		return this.populateCallback([
			e,
			t,
			n
		]);
	}
	conditionsChanged() {
		this.populateOptions();
		let e = D.instance().networkConditions(), t = y.instance().cpuThrottlingOption();
		for (let n = 0; n < this.options.length; ++n) {
			let r = this.options[n];
			if (r && "network" in r && r.network === e && r.cpuThrottlingOption === t) {
				this.selectCallback(n);
				return;
			}
		}
		let n = P.getCustomConditions();
		for (let e = 0; e < this.options.length; ++e) {
			let t = this.options[e];
			if (t && t.title === n.title && t.description === n.description) {
				this.selectCallback(e);
				return;
			}
		}
	}
}, Ye = /* @__PURE__ */ e({ NetworkPanelIndicator: () => Ze }), U = {
	networkThrottlingIsEnabled: "Network throttling is enabled",
	requestsMayBeOverridden: "Requests may be overridden locally, see the Sources panel",
	requestsMayBeBlocked: "Requests may be blocked, see the Network request blocking panel",
	acceptedEncodingOverrideSet: "The set of accepted `Content-Encoding` headers has been modified by DevTools, see the Network conditions panel"
}, Xe = i("panels/mobile_throttling/NetworkPanelIndicator.ts", U), W = r.bind(void 0, Xe), Ze = class {
	constructor() {
		if (!v.instance().hasPanel("network")) return;
		let e = D.instance();
		e.addEventListener(D.Events.CONDITIONS_CHANGED, t), e.addEventListener(D.Events.BLOCKED_PATTERNS_CHANGED, t), e.addEventListener(D.Events.INTERCEPTORS_CHANGED, t), e.addEventListener(D.Events.ACCEPTED_ENCODINGS_CHANGED, t), s.instance().moduleSetting("cache-disabled").addChangeListener(t, this), t();
		function t() {
			let t = [];
			e.isThrottling() && t.push(W(U.networkThrottlingIsEnabled)), D.instance().isIntercepting() && t.push(W(U.requestsMayBeOverridden)), e.isBlocking() && t.push(W(U.requestsMayBeBlocked)), e.isAcceptedEncodingOverrideSet() && t.push(W(U.acceptedEncodingOverrideSet)), v.instance().setPanelWarnings("network", t);
		}
	}
}, Qe = /* @__PURE__ */ e({
	DEFAULT_VIEW: () => nt,
	Events: () => rt,
	NetworkThrottlingSelect: () => J
}), { render: $e, html: G, Directives: et } = oe, K = {
	disabled: "Disabled",
	presets: "Presets",
	custom: "Custom",
	blockingGroup: "Blocking",
	sS: "{PH1}: {PH2}",
	addS: "Add {PH1}",
	add: "Add…",
	recommendedThrottling: "{PH1} – recommended"
}, tt = i("panels/mobile_throttling/NetworkThrottlingSelector.ts", K), q = r.bind(void 0, tt), nt = (e, t, n) => {
	let r = (e) => typeof e.title == "function" ? e.title() : e.title, i = (e, t) => `${ie(Le("i18nTitleKey" in t && t.i18nTitleKey || r(t))).track({ click: !0 })}`, a = /* @__PURE__ */ new WeakMap(), o = e.selectedConditions;
	function s(t) {
		let n = t.target;
		if (!n) return;
		let i = n.selectedOptions[0];
		if (i) {
			if (i === n.options[n.options.length - 1]) e.onAddCustomConditions(), t.consume(!0), o && (n.value = r(o));
			else {
				let t = a.get(i);
				t && (o = t, e.onSelect(t));
			}
		}
	}
	$e(G`${e.throttlingGroups.map((t) => G`<optgroup
            label=${t.title}>
            ${t.items.map((n) => G`<option
              ${et.ref((e) => e && a.set(e, n))}
              ?selected=${o ? _(n, o) : t === e.throttlingGroups[0]}
              value=${r(n)}
              aria-label=${q(K.sS, {
		PH1: t.title,
		PH2: r(n)
	})}
              jslog=${i(t, n)}>
                ${n === e.recommendedConditions ? q(K.recommendedThrottling, { PH1: r(n) }) : r(n)}
            </option>`)}
        </optgroup>`)}
        <optgroup label=${e.customConditionsGroup.title}>
          ${e.customConditionsGroup.items.map((t) => G`<option
              ${et.ref((e) => e && a.set(e, t))}
              ?selected=${o && _(t, o)}
              value=${r(t)}
              aria-label=${q(K.sS, {
		PH1: e.customConditionsGroup.title,
		PH2: r(t)
	})}
              jslog=${ie("custom-network-throttling-item").track({ click: !0 })}>
                ${t === e.recommendedConditions ? q(K.recommendedThrottling, { PH1: r(t) }) : r(t)}
          </option>`)}
          <option
            value=${q(K.add)}
            aria-label=${q(K.addS, { PH1: e.customConditionsGroup.title })}
            jslog=${we("add").track({ click: !0 })}>
              ${q(K.add)}
          </option>
        </optgroup>`, n, { container: {
		listeners: { change: s },
		attributes: {
			disabled: e.disabled,
			"aria-label": e.title,
			jslog: `${Te(e.jslogContext).track({ change: !0 })}`
		}
	} });
}, rt = /* @__PURE__ */ function(e) {
	return e.CONDITIONS_CHANGED = "ConditionsChanged", e;
}({}), J = class e extends t(Oe) {
	#e = null;
	#t;
	#n;
	#r;
	#i;
	#a = e.Variant.GLOBAL_CONDITIONS;
	#o = !1;
	static createForGlobalConditions(t, n) {
		let r = t.createChild("select"), i = new e(r, { title: n });
		return i.bindToGlobalConditions = !0, i.show(t, void 0, !0), i.performUpdate(), i;
	}
	constructor(e, t = {}, n = nt) {
		super(e), O().addChangeListener(this.requestUpdate, this), this.#t = t.jslogContext, this.#n = t.currentConditions, this.#r = t.title, this.#i = n, this.performUpdate();
	}
	get disabled() {
		return this.#o;
	}
	set disabled(e) {
		this.#o = e, this.requestUpdate();
	}
	get recommendedConditions() {
		return this.#e;
	}
	set recommendedConditions(e) {
		this.#e = e, this.requestUpdate();
	}
	get currentConditions() {
		return this.#n;
	}
	set currentConditions(e) {
		this.#n = e, this.requestUpdate();
	}
	get jslogContext() {
		return this.#t;
	}
	set jslogContext(e) {
		this.#t = e, this.requestUpdate();
	}
	#s = (e) => {
		let t = e.data;
		"block" in t || D.instance().setNetworkConditions(t);
	};
	#c = () => {
		this.currentConditions = D.instance().networkConditions();
	};
	#l = () => {
		let e = j.instance().getSelectedFieldMetricData("round_trip_time");
		this.recommendedConditions = Re(e);
	};
	set bindToGlobalConditions(e) {
		let t = j.instance(), n = D.instance();
		e ? (this.#t = d().name, R.instance(), this.#n = n.networkConditions(), this.addEventListener("ConditionsChanged", this.#s), n.addEventListener(D.Events.CONDITIONS_CHANGED, this.#c), t.addEventListener(A.FIELD_DATA_CHANGED, this.#l), this.#l()) : (this.removeEventListener("ConditionsChanged", this.#s), n.removeEventListener(D.Events.CONDITIONS_CHANGED, this.#c), t.removeEventListener(A.FIELD_DATA_CHANGED, this.#l)), this.requestUpdate();
	}
	get variant() {
		return this.#a;
	}
	set variant(e) {
		this.#a = e, this.requestUpdate();
	}
	get title() {
		return this.#r;
	}
	set title(e) {
		this.#r = e, this.requestUpdate();
	}
	performUpdate() {
		let t = O().get(), r = () => {
			n(O());
		}, i = (e) => {
			this.dispatchEventToListeners("ConditionsChanged", e);
		}, a = [];
		switch (this.#a) {
			case e.Variant.GLOBAL_CONDITIONS:
				a.push({
					title: q(K.disabled),
					items: [E]
				}, {
					title: q(K.presets),
					items: [
						T,
						x,
						k,
						w
					]
				});
				break;
			case e.Variant.INDIVIDUAL_REQUEST_CONDITIONS: a.push({
				title: q(K.blockingGroup),
				items: [Pe]
			}, {
				title: q(K.presets),
				items: [
					T,
					x,
					k
				]
			});
		}
		let o = {
			title: q(K.custom),
			items: t
		}, s = {
			recommendedConditions: this.#e,
			selectedConditions: this.#n,
			jslogContext: this.#t,
			title: this.#r,
			disabled: this.#o,
			onSelect: i,
			onAddCustomConditions: r,
			throttlingGroups: a,
			customConditionsGroup: o
		};
		this.#i(s, {}, this.contentElement);
	}
};
(function(e) {
	e.Variant = /* @__PURE__ */ function(e) {
		return e.GLOBAL_CONDITIONS = "global-conditions", e.INDIVIDUAL_REQUEST_CONDITIONS = "individual-request-conditions", e;
	}({});
})(J ||= {});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/mobile_throttling/CalibrationController.ts
var Y = { runningCalibration: "Running CPU calibration, please do not leave this tab or close DevTools." }, it = i("panels/mobile_throttling/CalibrationController.ts", Y), at = r.bind(void 0, it), ot = 250, X = 1e3, Z = 264;
function st(e) {
	return Number(e.toFixed(2));
}
var ct = class {
	#e;
	#t;
	#n;
	#r;
	#i = "idle";
	async start() {
		let e = Ee.instance().primaryPageTarget();
		if (!e) return !1;
		let t = e.model(f), n = e.model(je);
		if (!t || !n) return !1;
		this.#i = "running", this.#e = t, this.#t = n, this.#n = e.inspectedURL();
		function r(e) {
			let t = document.createElement("span");
			t.textContent = e, document.body.append(t), document.body.style.cssText = "\n        font-family: system-ui, sans-serif;\n        height: 100vh;\n        margin: 0;\n        background-color: antiquewhite;\n        font-size: 18px;\n        text-align: center;\n\n        display: flex;\n        flex-direction: column;\n        align-items: center;\n        justify-content: center;\n      ";
			let n = document.createElement("span");
			document.body.append(n), n.id = "moon", n.textContent = "🌑", n.style.cssText = "font-size: 5em";
		}
		return await e.pageAgent().invoke_navigate({ url: "about:blank" }), await t.agent.invoke_evaluate({ expression: `
          (${r})(${JSON.stringify(at(Y.runningCalibration))});

          window.runBenchmark = () => {
            window.runs = window.runs ?? 0;
            moon.textContent = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'][window.runs++ % 8];
            return (${lt})(${ot});
          }` }), await this.#o(), !0;
	}
	async #a(e) {
		if (this.#i !== "running") throw this.#r = void 0, Error("Calibration has been canceled");
		await this.#t.setCPUThrottlingRate(e);
	}
	async #o() {
		if (this.#i !== "running") throw this.#r = void 0, Error("Calibration has been canceled");
		let { result: e } = await this.#e.agent.invoke_evaluate({ expression: "runBenchmark()" });
		if (!Number.isFinite(e.value)) {
			let t = `unexpected score from benchmark: ${e.value}`;
			throw e.description && (t += `\n${e.description}`), Error(t);
		}
		return e.value;
	}
	async *iterator() {
		let e = this, t = !1;
		yield { progress: 0 };
		let n = /* @__PURE__ */ new Map();
		async function r(t) {
			let r = n.get(t);
			if (r !== void 0) return r;
			await e.#a(t);
			let i = await e.#o();
			return n.set(t, i), i;
		}
		async function* i(e, n, i) {
			let a = {
				rate: n,
				score: await r(n)
			}, o = {
				rate: i,
				score: await r(i)
			}, s = 0, c = 0;
			for (; c++ < 8;) {
				s = st((o.rate + a.rate) / 2);
				let n = await r(s);
				if (Math.abs(e - n) < 10) break;
				n < e ? (o.rate = s, o.score = n) : (a.rate = s, a.score = n), yield { progress: c / 8 / 2 + (t ? .5 : 0) };
			}
			return st(s);
		}
		this.#r = {};
		let a = await r(1);
		if (a < X && (n.clear(), a = await r(1), a < X)) {
			if (a < Z) {
				this.#r = {
					low: b.DEVICE_TOO_WEAK,
					mid: b.DEVICE_TOO_WEAK
				};
				return;
			}
			this.#r = { mid: b.DEVICE_TOO_WEAK }, t = !0;
		}
		let o = yield* i(Z, 1, a / Z * 1.5);
		if (this.#r.low = o, !this.#r.mid) {
			t = !0, yield { progress: .5 };
			let e = o / (X / Z), n = yield* i(X, e - e / 4, e + e / 4);
			this.#r.mid = n;
		}
		yield { progress: 1 };
	}
	abort() {
		this.#i === "running" && (this.#i = "aborting");
	}
	result() {
		return this.#r;
	}
	async end() {
		this.#i !== "idle" && (this.#i = "idle", this.#n.startsWith("chrome://") ? await this.#e.agent.invoke_evaluate({ expression: "history.back()" }) : await this.#e.agent.invoke_evaluate({ expression: `window.location.href = ${JSON.stringify(this.#n)}` }));
	}
};
function lt(e = 1e3) {
	let t = e / 2;
	function n() {
		let e = Date.now(), n = 0;
		for (; Date.now() - e < t;) {
			let e = "";
			for (let t = 0; t < 1e4; t++) e += "a";
			if (e.length === 1) throw Error("will never happen, but prevents compiler optimizations");
			n++;
		}
		let r = (Date.now() - e) / 1e3;
		return Math.round(n / 10 / r);
	}
	function r() {
		let e = [], n = [];
		for (let t = 0; t < 1e5; t++) e[t] = n[t] = t;
		let r = Date.now(), i = 0;
		for (; i % 10 != 0 || Date.now() - r < t;) {
			let t = i % 2 == 0 ? e : n, r = i % 2 == 0 ? n : e;
			for (let e = 0; e < t.length; e++) r[e] = t[e];
			i++;
		}
		let a = (Date.now() - r) / 1e3;
		return Math.round(i / 10 / a);
	}
	return (n() + r()) / 2;
}
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/mobile_throttling/throttlingSettingsTab.css.mjs
var ut = "/*\n * Copyright 2015 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.add-conditions-button {\n  margin: var(--sys-size-5) 0;\n  border: none;\n}\n\n.conditions-list {\n  flex: auto;\n\n  &:has(.list-item) {\n    margin-top: var(--sys-size-3);\n  }\n}\n\n.settings-container {\n  display: flex;\n  overflow-x: auto;\n}\n\n.settings-container::-webkit-scrollbar {\n  -webkit-appearance: none;\n  height: var(--sys-size-4);\n}\n\n.settings-container::-webkit-scrollbar-thumb {\n  border-radius: var( --sys-size-3);\n  background-color: var(--sys-color-primary);\n}\n\n.setting {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  align-items: flex-start;\n  gap: var( --sys-size-3);\n  padding: var( --sys-size-4);\n  flex-shrink: 0;\n  width: 74px;\n}\n\n.input {\n  width: 100%;\n}\n\n.conditions-list-item {\n  padding: 3px 5px;\n  height: 30px;\n  display: flex;\n  align-items: center;\n  position: relative;\n  flex: auto 1 1;\n}\n\n.conditions-list-text {\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  flex-basis: var( --sys-size-24);\n  user-select: none;\n  color: var(--sys-color-on-surface);\n  text-align: center;\n  position: relative;\n\n  & > input {\n    scroll-margin-left: 5px;\n  }\n}\n\n.conditions-list-text:last-child {\n  flex-basis: 100px;\n  text-align: left;\n}\n\n.conditions-list-title {\n  text-align: start;\n  display: flex;\n  flex-grow: 1;\n  align-items: flex-start;\n}\n\n.conditions-list-title-text {\n  flex: auto;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  white-space: nowrap;\n}\n\n.conditions-list-separator {\n  flex: 0 0 1px;\n  background-color: var(--sys-color-divider);\n  height: 30px;\n  margin: 0 4px;\n}\n\n.conditions-list-separator-invisible {\n  visibility: hidden;\n  height: 100% !important; /* stylelint-disable-line declaration-no-important */\n}\n\n.settings-card-container-wrapper {\n  scrollbar-gutter: stable;\n  padding: var(--sys-size-8) 0;\n  overflow: auto;\n  position: absolute;\n  inset: var(--sys-size-8) 0 0;\n}\n\n.settings-card-container {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: var(--sys-size-9);\n}\n\n.cpu-preset-section {\n  padding: 14px;\n  display: flex;\n  justify-content: space-between;\n}\n\n.cpu-preset-result.not-calibrated {\n  font-style: italic;\n}\n\n.cpu-preset-calibrate {\n  flex-direction: column;\n  gap: 14px;\n}\n\n.cpu-preset-calibrate .button-container {\n  display: flex;\n  gap: 10px;\n}\n\n.cpu-preset-calibrate .text-container {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n\n.text-with-icon {\n  display: flex;\n  align-items: center;\n  gap: 5px;\n}\n", dt = /* @__PURE__ */ e({
	CPUThrottlingCard: () => mt,
	ThrottlingSettingsTab: () => gt
}), Q = {
	networkThrottlingProfiles: "Network throttling profiles",
	addCustomProfile: "Add profile",
	dms: "{PH1} `ms`",
	profileName: "Profile Name",
	download: "Download",
	upload: "Upload",
	latency: "Latency",
	packetLoss: "Packet Loss",
	packetQueueLength: "Packet Queue Length",
	packetReordering: "Packet Reordering",
	packet: "packet",
	optional: "optional",
	profileNameCharactersLengthMust: "Profile Name characters length must be between 1 to {PH1} inclusive",
	sMustBeANumberBetweenSkbsToSkbs: "{PH1} must be a number between {PH2} `kbit/s` to {PH3} `kbit/s` inclusive",
	latencyMustBeAnIntegerBetweenSms: "Latency must be an integer between {PH1} `ms` to {PH2} `ms` inclusive",
	packetLossMustBeAnIntegerBetweenSpct: "Packet Loss must be a number between {PH1} `%` to {PH2} `%` inclusive",
	packetQueueLengthMustBeAnIntegerGreaterOrEqualToZero: "Packet Queue Length must be greater or equal to 0",
	dskbits: "{PH1} `kbit/s`",
	fsmbits: "{PH1} `Mbit/s`",
	on: "On",
	off: "Off",
	cpuThrottlingPresets: "CPU throttling presets",
	calibrate: "Calibrate",
	recalibrate: "Recalibrate",
	continue: "Continue",
	cancel: "Cancel",
	needsCalibration: "Needs calibration",
	calibrationCTA: "To use the CPU throttling presets, run the calibration process to determine the ideal throttling rate for your device.",
	cpuCalibrationDescription: "These presets throttle your CPU to approximate the performance of typical low or mid-tier mobile devices.",
	calibrationConfirmationPrompt: "Calibration will take ~5 seconds, and temporarily navigate away from your current page. Do you wish to continue?",
	calibrationWarningHighCPU: "CPU utilization is too high",
	calibrationWarningRunningOnBattery: "Device is running on battery, please plug in charger for best results",
	calibrationWarningLowBattery: "Device battery is low (<20%), results may be impacted by CPU throttling",
	dSlowdown: "{PH1}× slowdown"
}, ft = i("panels/mobile_throttling/ThrottlingSettingsTab.ts", Q), $ = r.bind(void 0, ft);
function pt() {
	let e = { state: "" };
	return new Promise((t) => {
		new PressureObserver((n) => {
			e.state = n.at(-1).state, t(e);
		}).observe("cpu", { sampleInterval: 1e3 });
	});
}
var mt = class {
	element;
	setting;
	computePressurePromise;
	controller;
	lowTierMobileDeviceEl;
	midTierMobileDeviceEl;
	calibrateEl;
	textEl;
	calibrateButton;
	cancelButton;
	progress;
	state = "cta";
	warnings = [];
	constructor() {
		this.setting = s.instance().createSetting("calibrated-cpu-throttling", {}, c.GLOBAL), this.element = document.createElement("devtools-card"), this.element.heading = $(Q.cpuThrottlingPresets);
		let e = this.element.createChild("span");
		e.textContent = $(Q.cpuCalibrationDescription), this.lowTierMobileDeviceEl = this.element.createChild("div", "cpu-preset-section"), this.lowTierMobileDeviceEl.append("Low-tier mobile device"), this.lowTierMobileDeviceEl.createChild("div", "cpu-preset-result"), this.midTierMobileDeviceEl = this.element.createChild("div", "cpu-preset-section"), this.midTierMobileDeviceEl.append("Mid-tier mobile device"), this.midTierMobileDeviceEl.createChild("div", "cpu-preset-result"), this.calibrateEl = this.element.createChild("div", "cpu-preset-section cpu-preset-calibrate");
		let t = this.calibrateEl.createChild("div", "button-container");
		this.calibrateButton = new C(), this.calibrateButton.classList.add("calibrate-button"), this.calibrateButton.data = {
			variant: l.PRIMARY,
			jslogContext: "throttling.calibrate"
		}, this.calibrateButton.addEventListener("click", () => this.calibrateButtonClicked()), t.append(this.calibrateButton), this.cancelButton = new C(), this.cancelButton.classList.add("cancel-button"), this.cancelButton.data = {
			variant: l.OUTLINED,
			jslogContext: "throttling.calibrate-cancel"
		}, this.cancelButton.textContent = $(Q.cancel), this.cancelButton.addEventListener("click", () => this.cancelButtonClicked()), t.append(this.cancelButton), this.textEl = this.calibrateEl.createChild("div", "text-container"), this.progress = this.calibrateEl.createChild("devtools-progress"), this.progress.setAttribute("no-stop-button", ""), this.updateState();
	}
	wasShown() {
		this.computePressurePromise = pt(), this.state = "cta", this.updateState();
	}
	willHide() {
		this.computePressurePromise = void 0, this.controller && this.controller.abort();
	}
	updateState() {
		this.state !== "calibrating" && (this.controller = void 0);
		let e = this.setting.get(), t = e.low || e.mid;
		if (this.calibrateButton.style.display = "none", this.textEl.style.display = "none", this.cancelButton.style.display = "none", this.progress.style.display = "none", this.state === "cta") this.calibrateButton.style.display = "", this.calibrateButton.textContent = $(t ? Q.recalibrate : Q.calibrate), t || (this.textEl.style.display = "", this.textEl.textContent = "", this.textEl.append(this.createTextWithIcon($(Q.calibrationCTA), "info")));
		else if (this.state === "prompting") {
			this.calibrateButton.style.display = "", this.calibrateButton.textContent = $(Q.continue), this.cancelButton.style.display = "", this.textEl.style.display = "", this.textEl.textContent = "";
			for (let e of this.warnings) this.textEl.append(this.createTextWithIcon(e, "warning"));
			this.textEl.append(this.createTextWithIcon($(Q.calibrationConfirmationPrompt), "info"));
		} else this.state === "calibrating" && (this.cancelButton.style.display = "", this.progress.style.display = "");
		let n = (e) => e === void 0 ? $(Q.needsCalibration) : typeof e == "string" ? he(e) : typeof e == "number" ? $(Q.dSlowdown, { PH1: e.toFixed(1) }) : `Invalid: ${e}`, r = (e, t) => {
			if (!e) throw Error("expected HTMLElement");
			e.textContent = n(t), e.classList.toggle("not-calibrated", t === void 0);
		};
		r(this.lowTierMobileDeviceEl.querySelector(".cpu-preset-result"), e.low), r(this.midTierMobileDeviceEl.querySelector(".cpu-preset-result"), e.mid);
	}
	createTextWithIcon(e, t) {
		let n = document.createElement("div");
		return n.classList.add("text-with-icon"), n.append(ae(t)), n.append(e), n;
	}
	async getCalibrationWarnings() {
		let e = [];
		if (this.computePressurePromise) {
			let t = await this.computePressurePromise;
			(t.state === "critical" || t.state === "serious") && e.push($(Q.calibrationWarningHighCPU));
		}
		let t = await navigator.getBattery();
		return t.charging ? t.level < .2 && e.push($(Q.calibrationWarningLowBattery)) : e.push($(Q.calibrationWarningRunningOnBattery)), e;
	}
	async calibrateButtonClicked() {
		this.state === "cta" ? (this.warnings = await this.getCalibrationWarnings(), this.state = "prompting", this.updateState()) : this.state === "prompting" && (this.state = "calibrating", this.updateState(), this.runCalibration());
	}
	cancelButtonClicked() {
		this.controller ? this.controller.abort() : (this.state = "cta", this.updateState());
	}
	async runCalibration() {
		this.progress.worked = 0, this.progress.totalWork = 1, this.controller = new ct();
		try {
			if (!await this.controller.start()) {
				console.error("Calibration failed to start");
				return;
			}
			for await (let e of this.controller.iterator()) this.progress.worked = e.progress;
		} catch (e) {
			console.error(e);
		} finally {
			await this.controller.end();
		}
		let e = this.controller.result();
		e && (e.low || e.mid) && (this.setting.set(e), this.progress.worked = 1, await new Promise((e) => setTimeout(e, 200))), this.state = "cta", this.updateState();
	}
};
function ht(e) {
	let t = e.match(/USER_CUSTOM_SETTING_(\d+)/);
	return t?.[1] ? parseInt(t[1], 10) : 0;
}
var gt = class extends be {
	list;
	customUserConditions;
	editor;
	cpuThrottlingCard;
	#e;
	constructor() {
		super({
			jslog: `${Ae("throttling-conditions")}`,
			useShadowDom: !0
		}), this.registerRequiredCSS(ut);
		let e = this.contentElement.createChild("div", "settings-card-container-wrapper").createChild("div");
		e.classList.add("settings-card-container", "throttling-conditions-settings"), this.cpuThrottlingCard = new mt(), e.append(this.cpuThrottlingCard.element);
		let t = new C();
		t.classList.add("add-conditions-button"), t.data = {
			variant: l.OUTLINED,
			iconName: "plus",
			jslogContext: "network.add-conditions"
		}, t.textContent = $(Q.addCustomProfile), t.addEventListener("click", () => this.addButtonClicked());
		let n = e.createChild("devtools-card");
		n.heading = $(Q.networkThrottlingProfiles);
		let r = n.createChild("div");
		this.list = new ue(this), this.list.element.classList.add("conditions-list"), this.list.registerRequiredCSS(ut), this.list.show(r), r.appendChild(t), this.customUserConditions = O(), this.customUserConditions.addChangeListener(this.conditionsUpdated, this);
		let i = this.customUserConditions.get().at(-1)?.key;
		if (i && p(i)) {
			let e = ht(i);
			this.#e = e;
		} else this.#e = 0;
	}
	wasShown() {
		super.wasShown(), this.cpuThrottlingCard.wasShown(), this.conditionsUpdated();
	}
	willHide() {
		super.willHide(), this.cpuThrottlingCard.willHide();
	}
	conditionsUpdated() {
		this.list.clear();
		let e = this.customUserConditions.get();
		for (let t = 0; t < e.length; ++t) this.list.appendItem(e[t], !0);
		this.list.appendSeparator();
	}
	addButtonClicked() {
		this.#e++, this.list.addNewItem(this.customUserConditions.get().length, {
			key: `USER_CUSTOM_SETTING_${this.#e}`,
			title: () => "",
			download: -1,
			upload: -1,
			latency: 0,
			packetLoss: 0,
			packetReordering: !1
		});
	}
	renderItem(e, t) {
		let n = document.createElement("div");
		n.classList.add("conditions-list-item");
		let r = n.createChild("div", "conditions-list-text conditions-list-title").createChild("div", "conditions-list-title-text"), i = this.retrieveOptionsTitle(e);
		return r.textContent = i, fe.install(r, i), n.createChild("div", "conditions-list-separator"), n.createChild("div", "conditions-list-text").textContent = _t(e.download), n.createChild("div", "conditions-list-separator"), n.createChild("div", "conditions-list-text").textContent = _t(e.upload), n.createChild("div", "conditions-list-separator"), n.createChild("div", "conditions-list-text").textContent = $(Q.dms, { PH1: e.latency }), n.createChild("div", "conditions-list-separator"), n.createChild("div", "conditions-list-text").textContent = vt(e.packetLoss ?? 0), n.createChild("div", "conditions-list-separator"), n.createChild("div", "conditions-list-text").textContent = String(e.packetQueueLength ?? 0), n.createChild("div", "conditions-list-separator"), n.createChild("div", "conditions-list-text").textContent = e.packetReordering ? $(Q.on) : $(Q.off), n;
	}
	removeItemRequested(e, t) {
		let n = this.customUserConditions.get();
		n.splice(t, 1), this.customUserConditions.set(n);
	}
	retrieveOptionsTitle(e) {
		return typeof e.title == "function" ? e.title() : e.title;
	}
	commitEdit(e, t, n) {
		e.title = t.control("title").value.trim();
		let r = t.control("download").value.trim();
		e.download = r ? parseInt(r, 10) * 125 : -1;
		let i = t.control("upload").value.trim();
		e.upload = i ? parseInt(i, 10) * 125 : -1;
		let a = t.control("latency").value.trim();
		e.latency = a ? parseInt(a, 10) : 0;
		let o = t.control("packetLoss").value.trim();
		e.packetLoss = o ? parseFloat(o) : 0;
		let s = t.control("packetQueueLength").value.trim();
		e.packetQueueLength = s ? parseFloat(s) : 0, e.packetReordering = t.control("packetReordering").checked;
		let c = this.customUserConditions.get();
		n && c.push(e), this.customUserConditions.set(c);
	}
	beginEdit(e) {
		let t = this.createEditor();
		return t.control("title").value = this.retrieveOptionsTitle(e), t.control("download").value = e.download <= 0 ? "" : String(e.download / 125), t.control("upload").value = e.upload <= 0 ? "" : String(e.upload / 125), t.control("latency").value = e.latency ? String(e.latency) : "", t.control("packetLoss").value = e.packetLoss ? String(e.packetLoss) : "", t.control("packetQueueLength").value = e.packetQueueLength ? String(e.packetQueueLength) : "", t.control("packetReordering").checked = e.packetReordering ?? !1, t;
	}
	createEditor() {
		if (this.editor) return this.editor;
		let e = [
			{
				name: "title",
				labelText: $(Q.profileName),
				inputType: "text",
				placeholder: "",
				validator: i,
				isOptional: !1
			},
			{
				name: "download",
				labelText: $(Q.download),
				inputType: "text",
				placeholder: o("kbit/s"),
				validator: a
			},
			{
				name: "upload",
				labelText: $(Q.upload),
				inputType: "text",
				placeholder: o("kbit/s"),
				validator: a
			},
			{
				name: "latency",
				labelText: $(Q.latency),
				inputType: "text",
				placeholder: o("ms"),
				validator: s
			},
			{
				name: "packetLoss",
				labelText: $(Q.packetLoss),
				inputType: "text",
				placeholder: o("percent"),
				validator: c
			},
			{
				name: "packetQueueLength",
				labelText: $(Q.packetQueueLength),
				inputType: "text",
				placeholder: $(Q.packet),
				validator: l
			},
			{
				name: "packetReordering",
				labelText: $(Q.packetReordering),
				inputType: "checkbox",
				placeholder: "",
				validator: u,
				isOptional: !1
			}
		], t = new Fe();
		this.editor = t;
		let n = t.contentElement().createChild("div", "settings-container"), r = (e, r, i, a, o, s = !0) => {
			let c = n.createChild("div", "setting"), l = c.createChild("div");
			l.textContent = r;
			let u = c.createChild("div"), d = t.createInput(e, i, a, o);
			d.classList.add("input"), ee(d, r), u.appendChild(d);
			let f = u.createChild("div"), p = $(Q.optional);
			f.textContent = p, le(d, p), s || (f.style.visibility = "hidden");
		};
		return e.forEach((e) => {
			r(e.name, e.labelText, e.inputType, e.placeholder, e.validator, e.isOptional);
		}), t;
		function i(e, t, n) {
			let r = n.value.trim(), i = r.length > 0 && r.length <= 49;
			return i ? { valid: i } : {
				valid: i,
				errorMessage: $(Q.profileNameCharactersLengthMust, { PH1: 49 })
			};
		}
		function a(e, t, n) {
			let r = 1e7, i = n.value.trim(), a = Number(i), o = n.getAttribute("aria-label"), s = !Number.isNaN(a) && a >= 0 && a <= r;
			return s ? { valid: s } : {
				valid: s,
				errorMessage: $(Q.sMustBeANumberBetweenSkbsToSkbs, {
					PH1: String(o),
					PH2: 0,
					PH3: r
				})
			};
		}
		function s(e, t, n) {
			let r = 1e6, i = n.value.trim(), a = Number(i), o = Number.isInteger(a) && a >= 0 && a <= r;
			return o ? { valid: o } : {
				valid: o,
				errorMessage: $(Q.latencyMustBeAnIntegerBetweenSms, {
					PH1: 0,
					PH2: r
				})
			};
		}
		function c(e, t, n) {
			let r = n.value.trim(), i = Number(r), a = i >= 0 && i <= 100;
			return a ? { valid: a } : {
				valid: a,
				errorMessage: $(Q.packetLossMustBeAnIntegerBetweenSpct, {
					PH1: 0,
					PH2: 100
				})
			};
		}
		function l(e, t, n) {
			let r = n.value.trim(), i = Number(r) >= 0;
			return i ? { valid: i } : {
				valid: i,
				errorMessage: $(Q.packetQueueLengthMustBeAnIntegerGreaterOrEqualToZero)
			};
		}
		function u(e, t, n) {
			return { valid: !0 };
		}
	}
};
function _t(e) {
	if (e < 0) return "";
	let t = e / 125;
	if (t < 1e3) return $(Q.dskbits, { PH1: t });
	if (t < 1e4) {
		let e = (t / 1e3).toFixed(1);
		return $(Q.fsmbits, { PH1: e });
	}
	return $(Q.fsmbits, { PH1: t / 1e3 | 0 });
}
function vt(e) {
	return e < 0 ? "" : String(e) + "%";
}
//#endregion
export { Ye as a, Ve as c, ze as d, Ze as i, B as l, J as n, Ke as o, Qe as r, z as s, dt as t, P as u };
