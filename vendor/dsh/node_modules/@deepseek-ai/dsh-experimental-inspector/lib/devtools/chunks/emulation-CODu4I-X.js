import { n as e } from "./rolldown-runtime-DF993M8W.js";
import { $ as t, D as n, H as r, K as i, i as a } from "./common-DMSVbaSb.js";
import { $i as o, $t as s, An as c, Bn as l, Bo as u, Fi as d, Fo as f, Ii as p, Io as m, La as h, Li as g, Ml as _, Oa as v, Or as y, Pd as b, Po as x, Qi as S, Qo as ee, Qr as C, Qt as te, Ro as ne, Ua as re, Uc as ie, Ur as ae, Wo as w, Xr as oe, Yf as T, Zo as se, Zr as E, br as D, cl as ce, di as O, ei as k, el as le, ff as ue, fi as de, fp as fe, ha as A, ii as pe, ja as j, jd as M, jn as me, kl as he, ll as ge, mo as _e, na as ve, ni as N, nl as ye, oo as be, pf as xe, to as Se, uo as Ce, v as we, vi as P, zo as Te } from "./legacy-dM_vujv7.js";
import { o as Ee } from "./root-DdvV-xPu.js";
import "./platform-D4TUCh2P.js";
import { I as De, S as Oe, T as ke, i as Ae, k as F } from "./StringUtilities-CMDxNrEc.js";
import { n as je } from "./theme_support-BJ6jI25-.js";
import { f as Me } from "./bindings-DyamxTH2.js";
import { a as I, c as Ne, d as Pe, i as Fe, l as Ie, n as Le, o as L, p as Re, t as ze, u as Be } from "./emulation-CiDWWSyp.js";
import { n as Ve, s as He } from "./mobile_throttling-DGhe-4CD.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/emulation/DeviceModeToolbar.ts
var Ue = /* @__PURE__ */ e({
	DEFAULT_VIEW: () => Ye,
	DeviceModeToolbar: () => Xe
}), R = ne(class e extends Te {
	static itemWidthCache = /* @__PURE__ */ new Map();
	constructor(e) {
		if (super(e), e.type !== u.ELEMENT) throw Error("AutoWidthSelectDirective must be used as an element directive");
	}
	update(t, [n]) {
		let r = t.element, i = e.itemWidthCache.get(n);
		if (!i) {
			let t = document.createElement("select");
			t.className = r.className, t.style.width = "fit-content", t.style.position = "absolute", t.style.visibility = "hidden", t.style.pointerEvents = "none", t.appendChild(document.createElement("option")), t.options[0].textContent = n, r.parentElement?.appendChild(t);
			let a = t.offsetWidth;
			t.remove(), i = a ? `${a}px` : "", a > 0 && e.itemWidthCache.set(n, i);
		}
		return r.style.width = i, this.render(n);
	}
	render(e) {
		return ee;
	}
}), z = {
	dimensions: "Dimensions: {PH1}",
	dpr: "DPR: {PH1}",
	width: "Width",
	heightLeaveEmptyForFull: "Height (leave empty for full)",
	zoom: "Zoom",
	devicePixelRatio: "Device pixel ratio",
	deviceType: "Device type",
	moreOptions: "More options",
	fitToWindowPercentage: "{PH1}% (fit to window)",
	autoadjustZoom: "Auto-adjust zoom",
	defaultF: "{PH1} (default)",
	hideDeviceFrame: "Hide device frame",
	showDeviceFrame: "Show device frame",
	hideMediaQueries: "Hide media queries",
	showMediaQueries: "Show media queries",
	hideRulers: "Hide rulers",
	showRulers: "Show rulers",
	removeDevicePixelRatio: "Remove device pixel ratio",
	addDevicePixelRatio: "Add device pixel ratio",
	removeDeviceType: "Remove device type",
	addDeviceType: "Add device type",
	resetToDefaults: "Reset to defaults",
	closeDevtools: "Close DevTools",
	responsive: "Responsive",
	edit: "Edit…",
	portrait: "Portrait",
	landscape: "Landscape",
	rotate: "Rotate",
	screenOrientationOptions: "Screen orientation options",
	screenOrientationLocked: "Screen orientation is locked by the page",
	toggleDualscreenMode: "Toggle dual-screen mode",
	devicePosture: "Device posture",
	throttling: "Throttling"
}, B = i("panels/emulation/DeviceModeToolbar.ts", z), V = r.bind(void 0, B), { ifDefined: We, live: Ge } = w, { widget: Ke } = pe, { bindToSetting: qe } = te;
function Je(e, t, n, r, i, a) {
	return x`
      <input type="number"
             max=${Fe}
             min=${50}
             title=${e}
             class="device-mode-size-input"
             .disabled=${r ?? !1}
             jslog=${Ce().track({ change: !0 }).context(t)}
             .value=${n ?? ""}
             placeholder=${We(i)}
             @change=${a}
             @keydown=${(e) => {
		let t = e.target, n = l(Number(t.value), e);
		n !== null && (n = Math.min(n, Fe), n = Math.max(n, 50), e.preventDefault(), t.value = String(n), t.dispatchEvent(new Event("change")));
	}}>`;
}
var Ye = (e, t, n) => {
	f(x`
    <devtools-toolbar class="main-toolbar">
      <div class="device-mode-empty-toolbar-element"></div>
      ${m(B, z.dimensions, { PH1: x`
        <select class="dark-text toolbar-has-dropdown-shrinkable"
                ${R(e.deviceText)}
                title=${V(z.deviceType)}
                aria-label=${V(z.deviceType)}
                @change=${e.onDeviceChange}
                .value=${Ge(e.selectedDeviceOption === e.deviceModeOptions.responsive ? "Responsive" : e.selectedDeviceOption?.title || "Responsive")}
                jslog=${j().track({ change: !0 }).context("device")}>
          <option value="Responsive" ?selected=${e.deviceModeOptions.responsive.selected} jslog=${h(e.deviceModeOptions.responsive.jslogContext).track({ click: !0 })}>
            ${e.deviceModeOptions.responsive.title}
          </option>
          ${e.deviceModeOptions.standard.length > 0 ? x`
            <optgroup label="Standard">
              ${e.deviceModeOptions.standard.map((e) => x`<option value=${e.title} ?selected=${e.selected} jslog=${h(e.jslogContext).track({ click: !0 })}>${e.title}</option>`)}
            </optgroup>
          ` : ""}
          ${e.deviceModeOptions.custom.length > 0 ? x`
            <optgroup label="Custom">
              ${e.deviceModeOptions.custom.map((e) => x`<option value=${e.title} ?selected=${e.selected} jslog=${h(e.jslogContext).track({ click: !0 })}>${e.title}</option>`)}
            </optgroup>
          ` : ""}
          <option value="Edit" jslog=${h(e.deviceModeOptions.edit.jslogContext).track({ click: !0 })}>
            ${e.deviceModeOptions.edit.title}
          </option>
        </select>` })}

      ${Je(V(z.width), "width", e.widthValue, !e.isResponsive, "", e.onWidthChange)}

      <div class="device-mode-x">×</div>
      ${Je(V(z.heightLeaveEmptyForFull), "height", e.heightValue, !e.isResponsive, e.heightPlaceholder, e.onHeightChange)}

      <div class="device-mode-empty-toolbar-element"></div>
      <select class="dark-text toolbar-has-dropdown-shrinkable"
              ${R(e.scaleText)}
              title=${V(z.zoom)}
              aria-label=${V(z.zoom)}
              @change=${e.onScaleChange}
              .value=${String(e.scaleOptions.find((e) => e.selected)?.value || "")}
              jslog=${j().track({ change: !0 }).context("scale")}>
        ${e.scaleOptions.map((e) => x`<option value=${e.value} ?selected=${e.selected} jslog=${h(e.jslogContext).track({ click: !0 })}>${e.title}</option>`)}
      </select>

      <devtools-button .data=${{
		variant: o.TOOLBAR,
		iconName: "center-focus-weak",
		toggledIconName: "center-focus-weak",
		toggleType: S.PRIMARY
	}}
                       class="toolbar-button" title=${V(z.autoadjustZoom)}
                       ${qe(e.autoAdjustScaleSetting)}>
      </devtools-button>

      <div class="device-mode-empty-toolbar-element"></div>

      ${e.showDeviceScaleFactorSetting.get() ? x`
        <div class="toolbar-text">
          ${m(B, z.dpr, { PH1: x`
              <select class="dark-text toolbar-has-dropdown-shrinkable"
                      ${R(e.dprText)}
                    title=${V(z.devicePixelRatio)}
                    aria-label=${V(z.devicePixelRatio)}
                    @change=${e.onDeviceScaleChange}
                    .value=${String(e.dprOptions.find((e) => e.selected)?.value || "")}
                    jslog=${j().track({ change: !0 }).context("device-pixel-ratio")}
                    ?disabled=${!e.isResponsive}>
                ${e.dprOptions.map((e) => x`<option value=${e.value} ?selected=${e.selected} jslog=${h(e.jslogContext).track({ click: !0 })}>${e.title}</option>`)}
              </select>` })}
        </div>` : ""}

      <div class="device-mode-empty-toolbar-element"></div>
      ${e.showUserAgentTypeSetting.get() ? x`
        <select class="dark-text toolbar-has-dropdown-shrinkable"
                ${R(e.uaText)}
                title=${V(z.deviceType)}
                aria-label=${V(z.deviceType)}
                @change=${e.onUAChange}
                .value=${e.uaOptions.find((e) => e.selected)?.value || ""}
                jslog=${j().track({ change: !0 }).context("device-type")}
                ?disabled=${!e.isResponsive}>
          ${e.uaOptions.map((e) => x`<option value=${e.value} ?selected=${e.selected} jslog=${h(e.jslogContext).track({ click: !0 })}>${e.title}</option>`)}
        </select>` : ""}
      <select class="dark-text" ${Ke(Ve, {
		title: V(z.throttling),
		bindToGlobalConditions: !0
	})}></select>
      <select class="dark-text toolbar-has-dropdown-shrinkable" ${Ke(He)}></select>

      <div class="device-mode-empty-toolbar-element"></div>
      <devtools-button class="toolbar-button"
                       .data=${{
		variant: o.TOOLBAR,
		iconName: "screen-rotation"
	}}
                       jslog=${A("screen-rotation").track({ click: !0 })}
                       @click=${e.onModeMenuClick}
                       .title=${e.modeButtonTitle}
                       .disabled=${e.modeButtonDisabled}>
      </devtools-button>

      <!-- Show dual screen toolbar -->
      ${e.showSpanButton ? x`
        <devtools-button class="toolbar-button"
                         .data=${{
		variant: o.TOOLBAR,
		iconName: "device-fold"
	}}
                         jslog=${A("device-fold").track({ click: !0 })}
                         .title=${V(z.toggleDualscreenMode)}
                         @click=${e.onSpanClick}>
        </devtools-button>` : ""}

      <!-- Show posture toolbar menu for foldable devices. -->
      <div class="device-mode-empty-toolbar-element"></div>
      ${e.showPostureItem ? x`
        <select class="dark-text toolbar-has-dropdown-shrinkable"
                ${R(e.postureText)}
                title=${V(z.devicePosture)}
                aria-label=${V(z.devicePosture)}
                @change=${e.onPostureChange}
                .value=${e.postureOptions.find((e) => e.selected)?.value || ""}
                jslog=${j().track({ change: !0 }).context("device-posture")}>
          ${e.postureOptions.map((e) => x`<option value=${e.value} ?selected=${e.selected} jslog=${h(e.value.toLowerCase()).track({ click: !0 })}>${e.title}</option>`)}
        </select>` : ""}
    </devtools-toolbar>
    <devtools-toolbar class="device-mode-toolbar-options" wrappable>
      <div class="device-mode-empty-toolbar-element"></div>
      <devtools-button
        .data=${{
		variant: o.TOOLBAR,
		iconName: "dots-vertical",
		title: V(z.moreOptions)
	}}
        @click=${e.onMoreOptionsClick}
        jslog=${j("more-options").track({ click: !0 })}
      ></devtools-button></devtools-toolbar>
  `, n, { container: {
		classes: ["device-mode-toolbar"],
		attributes: { jslog: `${_e("device-mode").track({ resize: !0 })}` }
	} });
}, Xe = class extends N {
	model;
	showMediaInspectorSetting;
	showRulersSetting;
	deviceOutlineSetting;
	showDeviceScaleFactorSetting;
	showUserAgentTypeSetting;
	autoAdjustScaleSetting;
	lastMode;
	emulatedDevicesList;
	persistenceSetting;
	view;
	constructor(e, t, n, r = Ye) {
		super(), this.view = r, this.model = e, this.showMediaInspectorSetting = t, this.showRulersSetting = n, this.deviceOutlineSetting = this.model.deviceOutlineSetting(), this.showDeviceScaleFactorSetting = a.instance().createSetting("emulation.show-device-scale-factor", !1), this.showDeviceScaleFactorSetting.addChangeListener(this.requestUpdate, this), this.showUserAgentTypeSetting = a.instance().createSetting("emulation.show-user-agent-type", !1), this.showUserAgentTypeSetting.addChangeListener(this.requestUpdate, this), this.autoAdjustScaleSetting = a.instance().createSetting("emulation.auto-adjust-scale", !0), this.lastMode = /* @__PURE__ */ new Map(), this.emulatedDevicesList = Ie.instance(), this.emulatedDevicesList.addEventListener(Be.CUSTOM_DEVICES_UPDATED, this.deviceListChanged, this), this.emulatedDevicesList.addEventListener(Be.STANDARD_DEVICES_UPDATED, this.deviceListChanged, this), this.persistenceSetting = a.instance().createSetting("emulation.device-mode-value", {
			device: "",
			orientation: "",
			mode: ""
		}), this.model.toolbarControlsEnabledSetting().addChangeListener(this.requestUpdate, this), this.model.scaleSetting().addChangeListener(this.requestUpdate, this), this.model.uaSetting().addChangeListener(this.requestUpdate, this), this.model.deviceScaleFactorSetting().addChangeListener(this.requestUpdate, this), this.model.addEventListener(Le.UPDATED, this.requestUpdate, this), this.performUpdate();
	}
	performUpdate() {
		let e = this.model.type() === I.Responsive, t = e && this.model.isFullHeight(), n = this.model.appliedDeviceSize(), r = String(n.width), i = t ? "" : String(n.height), a = String(n.height), o = this.model.device();
		this.model.type() === I.Device && o && this.lastMode.set(o, this.model.mode());
		let s = this.persistenceSetting.get(), c = this.model.mode();
		o ? (s.device = o.title, s.orientation = c ? c.orientation : "", s.mode = c ? c.title : "") : (s.device = "", s.orientation = "", s.mode = ""), this.persistenceSetting.set(s);
		let l = V(z.rotate), u = !1;
		if (this.model.isScreenOrientationLocked()) u = !0, l = V(z.screenOrientationLocked);
		else if (o) {
			let e = o.modes.length;
			u = e < 2, l = V(e === 2 ? z.rotate : z.screenOrientationOptions);
		} else e ? (u = !1, l = V(z.rotate)) : u = !0;
		let d = !!o?.isDualScreen, f = !(o?.isDualScreen || !o?.isFoldableScreen), p = this.getDeviceModeOptions(), m = this.getScaleOptions(), h = this.getDeviceScaleFactorOptions(), g = this.getUserAgentOptions(), _ = this.getDevicePostureOptions(), v = [
			p.responsive,
			...p.standard,
			...p.custom
		].find((e) => e.selected), y = v ? v.title : p.responsive.title, b = m.find((e) => e.selected)?.title || "";
		b.includes(" (") && (b = b.substring(0, b.indexOf(" (")));
		let x = h.find((e) => e.selected)?.title || "";
		x.includes(" (") && (x = x.substring(0, x.indexOf(" (")));
		let S = g.find((e) => e.selected)?.title || "", ee = _.find((e) => e.selected)?.title || "", C = this.model.toolbarControlsEnabledSetting().get();
		this.contentElement.classList.toggle("disabled", !C);
		let te = {
			isResponsive: e,
			isFullHeight: t,
			widthValue: r,
			heightValue: i,
			heightPlaceholder: a,
			modeButtonTitle: l,
			modeButtonDisabled: u,
			showSpanButton: d,
			showPostureItem: f,
			deviceModeOptions: p,
			scaleOptions: m,
			dprOptions: h,
			uaOptions: g,
			postureOptions: _,
			selectedDeviceOption: v,
			deviceText: y,
			scaleText: b,
			dprText: x,
			uaText: S,
			postureText: ee,
			onDeviceChange: this.onDeviceChange.bind(this),
			onWidthChange: (e) => {
				let t = Number(e.target.value);
				this.autoAdjustScaleSetting.get() ? this.model.setWidthAndScaleToFit(t) : this.model.setWidth(t);
			},
			onHeightChange: (e) => {
				let t = Number(e.target.value);
				this.autoAdjustScaleSetting.get() ? this.model.setHeightAndScaleToFit(t) : this.model.setHeight(t);
			},
			onScaleChange: this.onScaleChange.bind(this),
			onDeviceScaleChange: this.onDeviceScaleChange.bind(this),
			onUAChange: this.onUAChange.bind(this),
			onPostureChange: this.onPostureChange.bind(this),
			onModeMenuClick: this.modeMenuClicked.bind(this),
			onSpanClick: this.spanClicked.bind(this),
			onMoreOptionsClick: (e) => {
				let t = new D(e);
				this.appendOptionsMenuItems(t), t.show();
			},
			autoAdjustScaleSetting: this.autoAdjustScaleSetting,
			showDeviceScaleFactorSetting: this.showDeviceScaleFactorSetting,
			showUserAgentTypeSetting: this.showUserAgentTypeSetting
		};
		this.view(te, {}, this.contentElement);
	}
	getDevicePostureOptions() {
		let e = this.currentDevicePosture();
		return ["Continuous", "Folded"].map((t) => ({
			title: t,
			value: t,
			selected: e === t
		}));
	}
	onPostureChange(e) {
		e.target.value !== this.currentDevicePosture() && this.spanClicked();
	}
	currentDevicePosture() {
		let e = this.model.mode();
		return e && (e.orientation === "vertical-spanned" || e.orientation === "horizontal-spanned") ? "Folded" : "Continuous";
	}
	getScaleOptions() {
		let e = [
			.5,
			.75,
			1,
			1.25,
			1.5,
			2
		], t = null;
		if (this.model.type() === I.Device) {
			t = this.model.fitScale();
			let n = (t * 100).toFixed(0), r = !1;
			for (let i = 0; i < e.length; ++i) if ((e[i] * 100).toFixed(0) === n) {
				r = !0, e[i] = t;
				break;
			}
			r || (e.push(t), e.sort((e, t) => e - t));
		}
		let n = this.model.scaleSetting().get();
		return e.map((e) => {
			let r = (e * 100).toFixed(0) + "%", i = r;
			return e === t && (r = V(z.fitToWindowPercentage, { PH1: (e * 100).toFixed(0) }), i = "fit-to-window"), {
				title: r,
				value: e,
				selected: n === e,
				jslogContext: i
			};
		});
	}
	onScaleChange(e) {
		let t = Number(e.target.value);
		this.model.scaleSetting().set(t);
	}
	getDeviceScaleFactorOptions() {
		let e = this.model.deviceScaleFactorSetting(), t = this.model.uaSetting().get() === L.MOBILE || this.model.uaSetting().get() === L.MOBILE_NO_TOUCH ? 2 : window.devicePixelRatio, n = [
			1,
			2,
			3
		];
		n.includes(t) || (n.push(t), n.sort((e, t) => e - t));
		let r = e.get();
		return n.map((e) => {
			let n = String(e), i = `dpr-${e}`;
			return e === t && (n = V(z.defaultF, { PH1: e }), i = "dpr-default"), {
				title: n,
				value: e === t ? 0 : e,
				selected: r === e || e === t && r === 0,
				jslogContext: i
			};
		});
	}
	onDeviceScaleChange(e) {
		let t = Number(e.target.value);
		this.model.deviceScaleFactorSetting().set(t);
	}
	getUserAgentOptions() {
		let e = this.model.uaSetting().get();
		return [
			L.MOBILE,
			L.MOBILE_NO_TOUCH,
			L.DESKTOP,
			L.DESKTOP_TOUCH
		].map((t) => ({
			title: t,
			value: t,
			selected: e === t,
			jslogContext: F(t)
		}));
	}
	onUAChange(e) {
		let t = e.target.value;
		this.model.uaSetting().set(t);
	}
	appendOptionsMenuItems(e) {
		let t = this.model;
		n(e.headerSection(), this.deviceOutlineSetting, V(z.hideDeviceFrame), V(z.showDeviceFrame), t.type() !== I.Device, "device-frame"), n(e.headerSection(), this.showMediaInspectorSetting, V(z.hideMediaQueries), V(z.showMediaQueries), void 0, "media-queries"), n(e.headerSection(), this.showRulersSetting, V(z.hideRulers), V(z.showRulers), void 0, "rulers"), n(e.defaultSection(), this.showDeviceScaleFactorSetting, V(z.removeDevicePixelRatio), V(z.addDevicePixelRatio), void 0, "device-pixel-ratio"), n(e.defaultSection(), this.showUserAgentTypeSetting, V(z.removeDeviceType), V(z.addDeviceType), void 0, "device-type"), e.appendItemsAtLocation("deviceModeMenu"), e.footerSection().appendItem(V(z.resetToDefaults), this.reset.bind(this), { jslogContext: "reset-to-defaults" }), e.footerSection().appendItem(V(z.closeDevtools), T.closeWindow.bind(T), { jslogContext: "close-dev-tools" });
		function n(e, n, r, i, a, o) {
			a === void 0 && (a = t.type() === I.None);
			let s = n.get(), c = `${o}-${s ? "disable" : "enable"}`;
			e.appendItem(s ? r : i, n.set.bind(n, !n.get()), {
				disabled: a,
				jslogContext: c
			});
		}
	}
	reset() {
		this.deviceOutlineSetting.set(!1), this.showDeviceScaleFactorSetting.set(!1), this.showUserAgentTypeSetting.set(!1), this.showMediaInspectorSetting.set(!1), this.showRulersSetting.set(!1), this.model.reset();
	}
	emulateDevice(e) {
		let t = this.autoAdjustScaleSetting.get() ? void 0 : this.model.scaleSetting().get();
		this.model.emulate(I.Device, e, this.lastMode.get(e) || e.modes[0], t);
	}
	switchToResponsive() {
		this.model.emulate(I.Responsive, null, null);
	}
	filterDevices(e) {
		return e = e.filter(function(e) {
			return e.show();
		}), e.sort(Ne.deviceComparator), e;
	}
	standardDevices() {
		return this.filterDevices(this.emulatedDevicesList.standard());
	}
	customDevices() {
		return this.filterDevices(this.emulatedDevicesList.custom());
	}
	allDevices() {
		return this.standardDevices().concat(this.customDevices());
	}
	getDeviceModeOptions() {
		return {
			responsive: {
				title: V(z.responsive),
				selected: this.model.type() === I.Responsive,
				jslogContext: "responsive"
			},
			standard: this.standardDevices().map((e) => ({
				device: e,
				title: e.title,
				selected: this.model.device() === e,
				jslogContext: F(e.title)
			})),
			custom: this.customDevices().map((e) => ({
				device: e,
				title: e.title,
				selected: this.model.device() === e,
				jslogContext: F(e.title)
			})),
			edit: {
				title: V(z.edit),
				jslogContext: "edit"
			}
		};
	}
	onDeviceChange(e) {
		let t = e.target.value;
		if (t === "Edit") this.emulatedDevicesList.revealCustomSetting(), this.requestUpdate();
		else if (t === "Responsive") this.switchToResponsive();
		else for (let e of this.allDevices()) if (e.title === t) {
			this.emulateDevice(e);
			break;
		}
	}
	deviceListChanged() {
		this.requestUpdate();
		let e = this.model.device();
		if (!e) return;
		let t = this.allDevices();
		t.indexOf(e) === -1 ? t.length ? this.emulateDevice(t[0]) : this.model.emulate(I.Responsive, null, null) : this.emulateDevice(e);
	}
	spanClicked() {
		let e = this.model.device();
		if (!e || !e.isDualScreen && !e.isFoldableScreen) return;
		let t = this.autoAdjustScaleSetting.get() ? void 0 : this.model.scaleSetting().get(), n = this.model.mode();
		if (!n) return;
		let r = e.getSpanPartner(n);
		r && this.model.emulate(this.model.type(), e, r, t);
	}
	modeMenuClicked(e) {
		if (this.model.isScreenOrientationLocked()) return;
		let t = this.model.device(), n = this.model, r = this.autoAdjustScaleSetting;
		if (n.type() === I.Responsive) {
			let e = n.appliedDeviceSize();
			r.get() ? n.setSizeAndScaleToFit(e.height, e.width) : (n.setWidth(e.height), n.setHeight(e.width));
			return;
		}
		if (!t) return;
		if ((t.isDualScreen || t.isFoldableScreen || t.modes.length === 2) && t.modes[0].orientation !== t.modes[1].orientation) {
			let e = r.get() ? void 0 : n.scaleSetting().get(), i = n.mode();
			if (!i) return;
			let a = t.getRotationPartner(i);
			if (!a) return;
			n.emulate(n.type(), n.device(), a, e);
			return;
		}
		let i = e.target, a = new D(e, {
			x: i.getBoundingClientRect().left,
			y: i.getBoundingClientRect().top + i.offsetHeight
		});
		o(Re, V(z.portrait)), o(Pe, V(z.landscape)), a.show();
		function o(e, n) {
			if (!t) return;
			let r = t.modesForOrientation(e);
			if (r.length) {
				if (r.length === 1) s(r[0], n);
				else for (let e = 0; e < r.length; e++) s(r[e], n + " – " + r[e].title);
			}
		}
		function s(e, t) {
			a.defaultSection().appendCheckboxItem(t, c.bind(null, e), {
				checked: n.mode() === e,
				jslogContext: "device-mode"
			});
		}
		function c(e) {
			let t = r.get() ? void 0 : n.scaleSetting().get();
			n.emulate(n.type(), n.device(), e, t);
		}
	}
	getPrettyFitZoomPercentage() {
		return `${(this.model.fitScale() * 100).toFixed(0)}`;
	}
	getPrettyZoomPercentage() {
		return `${(this.model.scale() * 100).toFixed(0)}`;
	}
	restore() {
		for (let e of this.allDevices()) if (e.title === this.persistenceSetting.get().device) {
			for (let t of e.modes) if (t.orientation === this.persistenceSetting.get().orientation && t.title === this.persistenceSetting.get().mode) {
				this.lastMode.set(e, t), this.emulateDevice(e);
				return;
			}
		}
		this.model.emulate(I.Responsive, null, null);
	}
}, Ze = "/*\n * Copyright 2015 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  overflow: hidden;\n  align-items: stretch;\n  flex: auto;\n  background-color: var(--app-color-toolbar-background);\n}\n\n.device-mode-toolbar {\n  flex: none;\n  background-color: var(--app-color-toolbar-background);\n  border-bottom: 1px solid var(--sys-color-divider);\n  display: flex;\n  flex-direction: row;\n  align-items: stretch;\n}\n\n.device-mode-x {\n  margin: 0 1px;\n  font-size: 16px;\n}\n\n.device-mode-size-input {\n  /*\n   * 4 characters for the maximum size of the value,\n   * 2 characters for the width of the step-buttons,\n   * 2 pixels padding between the characters and the\n   * step-buttons.\n   */\n  width: calc(4ch + 2ch + 2px);\n  max-height: 18px;\n  border: var(--sys-color-neutral-outline);\n  border-radius: 4px;\n  margin: 0 2px;\n  text-align: center;\n  font-size: inherit;\n  font-family: inherit;\n}\n\n.device-mode-size-input:disabled {\n  user-select: none;\n}\n\n.device-mode-size-input:focus::-webkit-input-placeholder {\n  color: transparent;\n}\n\n.device-mode-empty-toolbar-element {\n  width: 0;\n}\n\ndevtools-toolbar {\n  overflow: hidden;\n  flex: 0 100000 auto;\n  padding: 0 5px;\n\n  &[wrappable] {\n    height: var(--toolbar-height);\n  }\n}\n\ndevtools-toolbar.main-toolbar {\n  margin: 0 auto;\n}\n\ndevtools-toolbar.device-mode-toolbar-options {\n  flex: none;\n}\n\n.device-mode-content-clip {\n  overflow: hidden;\n  flex: auto;\n}\n\n.device-mode-media-container {\n  flex: none;\n  overflow: hidden;\n  box-shadow: inset 0 -1px var(--sys-color-divider);\n}\n\n.device-mode-content-clip:not(.device-mode-outline-visible) .device-mode-media-container {\n  margin-bottom: 20px;\n}\n\n.device-mode-presets-container {\n  flex: 0 0 20px;\n  display: flex;\n}\n\n.device-mode-presets-container-inner {\n  flex: auto;\n  justify-content: center;\n  position: relative;\n  background-color: var(--sys-color-surface1);\n  border-bottom: 1px solid var(--sys-color-divider);\n}\n\n.device-mode-presets-container:hover {\n  transition: opacity 0.1s;\n  transition-delay: 50ms;\n  opacity: 100%;\n}\n\n.device-mode-preset-bar-outer {\n  pointer-events: none;\n  display: flex;\n  justify-content: center;\n}\n\n.device-mode-preset-bar {\n  border-left: 2px solid var(--sys-color-divider);\n  border-right: 2px solid var(--sys-color-divider);\n  pointer-events: auto;\n  text-align: center;\n  flex: none;\n  color: var(--sys-color-on-surface);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  white-space: nowrap;\n  margin-bottom: 1px;\n}\n\n.device-mode-preset-bar:hover {\n  transition: background-color 0.1s;\n  transition-delay: 50ms;\n  background-color: var(--sys-color-state-hover-on-subtle);\n}\n\n.device-mode-preset-bar > span {\n  visibility: hidden;\n}\n\n.device-mode-preset-bar:hover > span {\n  transition: visibility 0.1s;\n  transition-delay: 50ms;\n  visibility: visible;\n}\n\n.device-mode-content-area {\n  flex: auto;\n  position: relative;\n  margin: 0;\n}\n\n.device-mode-screen-area {\n  position: absolute;\n  left: 0;\n  right: 0;\n  width: 0;\n  height: 0;\n  background-color: var(--sys-color-inverse-surface);\n}\n\n.device-mode-content-clip:not(.device-mode-outline-visible) .device-mode-screen-area {\n  --override-screen-area-box-shadow: hsl(240deg 3% 84%) 0 0 0 0.5px, hsl(0deg 0% 80% / 40%) 0 0 20px;\n\n  box-shadow: var(--override-screen-area-box-shadow);\n}\n\n.theme-with-dark-background .device-mode-content-clip:not(.device-mode-outline-visible) .device-mode-screen-area,\n:host-context(.theme-with-dark-background) .device-mode-content-clip:not(.device-mode-outline-visible) .device-mode-screen-area {\n  --override-screen-area-box-shadow: rgb(40 40 42) 0 0 0 0.5px, rgb(51 51 51 / 40%) 0 0 20px;\n}\n\n.device-mode-screen-image {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n\n.device-mode-resizer {\n  position: absolute;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  overflow: hidden;\n  transition: background-color 0.1s ease, opacity 0.1s ease;\n}\n\n.device-mode-resizer:hover {\n  background-color: var(--sys-color-state-hover-on-subtle);\n  opacity: 100%;\n}\n\n.device-mode-resizer > div {\n  pointer-events: none;\n}\n\n.device-mode-right-resizer {\n  top: 0;\n  bottom: -1px;\n  right: -20px;\n  width: 20px;\n}\n\n.device-mode-left-resizer {\n  top: 0;\n  bottom: -1px;\n  left: -20px;\n  width: 20px;\n  opacity: 0%;\n}\n\n.device-mode-bottom-resizer {\n  left: 0;\n  right: -1px;\n  bottom: -20px;\n  height: 20px;\n}\n\n.device-mode-bottom-right-resizer {\n  inset: 0 -20px -20px 0;\n  background-color: var(--sys-color-surface1);\n}\n\n.device-mode-bottom-left-resizer {\n  inset: 0 0 -20px -20px;\n  opacity: 0%;\n}\n\n.device-mode-right-resizer > div {\n  /* stylelint-disable-next-line custom-property-pattern */\n  content: var(--image-file-resizeHorizontal);\n  width: 6px;\n  height: 26px;\n}\n\n.device-mode-left-resizer > div {\n  /* stylelint-disable-next-line custom-property-pattern */\n  content: var(--image-file-resizeHorizontal);\n  width: 6px;\n  height: 26px;\n}\n\n.device-mode-bottom-resizer > div {\n  /* stylelint-disable-next-line custom-property-pattern */\n  content: var(--image-file-resizeVertical);\n  margin-bottom: -2px;\n  width: 26px;\n  height: 6px;\n}\n\n.device-mode-bottom-right-resizer > div {\n  position: absolute;\n  bottom: 3px;\n  right: 3px;\n  width: 13px;\n  height: 13px;\n  /* stylelint-disable-next-line custom-property-pattern */\n  content: var(--image-file-resizeDiagonal);\n}\n\n.device-mode-bottom-left-resizer > div {\n  position: absolute;\n  bottom: 3px;\n  left: 3px;\n  width: 13px;\n  height: 13px;\n  /* stylelint-disable-next-line custom-property-pattern */\n  content: var(--image-file-resizeDiagonal);\n  transform: rotate(90deg);\n}\n\n.device-mode-page-area {\n  position: absolute;\n  left: 0;\n  right: 0;\n  width: 0;\n  height: 0;\n  display: flex;\n  background-color: var(--sys-color-cdt-base-container);\n}\n\n.device-mode-ruler {\n  position: absolute;\n  overflow: visible;\n}\n\n.device-mode-ruler-top {\n  height: 20px;\n  right: 0;\n}\n\n.device-mode-ruler-left {\n  width: 20px;\n  bottom: 0;\n}\n\n.device-mode-ruler-content {\n  pointer-events: none;\n  position: absolute;\n  left: -20px;\n  top: -20px;\n}\n\n.device-mode-ruler-top .device-mode-ruler-content {\n  border-top: 1px solid transparent;\n  right: 0;\n  bottom: 20px;\n  background-color: var(--sys-color-cdt-base-container);\n}\n\n.device-mode-ruler-left .device-mode-ruler-content {\n  border-left: 1px solid transparent;\n  border-top: 1px solid transparent;\n  right: 20px;\n  bottom: 0;\n}\n\n.device-mode-content-clip.device-mode-outline-visible .device-mode-ruler-top .device-mode-ruler-content {\n  border-top: 1px solid var(--sys-color-token-subtle);\n}\n\n.device-mode-content-clip.device-mode-outline-visible .device-mode-ruler-left .device-mode-ruler-content {\n  border-left: 1px solid var(--sys-color-token-subtle);\n  border-top: 1px solid var(--sys-color-token-subtle);\n}\n\n.device-mode-ruler-inner {\n  position: absolute;\n}\n\n.device-mode-ruler-top .device-mode-ruler-inner {\n  inset: 0 0 0 20px;\n  border-bottom: 1px solid var(--sys-color-token-subtle);\n}\n\n.device-mode-ruler-left .device-mode-ruler-inner {\n  inset: 19px 0 0;\n  border-right: 1px solid var(--sys-color-token-subtle);\n  background-color: var(--sys-color-cdt-base-container);\n}\n\n.device-mode-ruler-marker {\n  position: absolute;\n}\n\n.device-mode-ruler-top .device-mode-ruler-marker {\n  width: 0;\n  height: 5px;\n  bottom: 0;\n  border-right: 1px solid var(--sys-color-token-subtle);\n  margin-right: -1px;\n}\n\n.device-mode-ruler-top .device-mode-ruler-marker.device-mode-ruler-marker-medium {\n  height: 10px;\n}\n\n.device-mode-ruler-top .device-mode-ruler-marker.device-mode-ruler-marker-large {\n  height: 15px;\n}\n\n.device-mode-ruler-left .device-mode-ruler-marker {\n  height: 0;\n  width: 5px;\n  right: 0;\n  border-bottom: 1px solid var(--sys-color-token-subtle);\n  margin-bottom: -1px;\n}\n\n.device-mode-ruler-left .device-mode-ruler-marker.device-mode-ruler-marker-medium {\n  width: 10px;\n}\n\n.device-mode-ruler-left .device-mode-ruler-marker.device-mode-ruler-marker-large {\n  width: 15px;\n}\n\n.device-mode-ruler-text {\n  color: var(--sys-color-token-subtle);\n  position: relative;\n  pointer-events: auto;\n}\n\n.device-mode-ruler-text:hover {\n  color: var(--sys-color-on-surface);\n}\n\n.device-mode-ruler-top .device-mode-ruler-text {\n  left: 2px;\n  top: -2px;\n}\n\n.device-mode-ruler-left .device-mode-ruler-text {\n  left: -4px;\n  top: -15px;\n  transform: rotate(270deg);\n}\n", Qe = "/*\n * Copyright 2015 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n/* Media query bars */\n\n.media-inspector-view {\n  height: 50px;\n}\n\n.media-inspector-marker-container {\n  height: 14px;\n  margin: 2px 0;\n  position: relative;\n}\n\n.media-inspector-bar {\n  display: flex;\n  flex-direction: row;\n  align-items: stretch;\n  pointer-events: none;\n  position: absolute;\n  inset: 0;\n}\n\n.media-inspector-marker {\n  flex: none;\n  pointer-events: auto;\n  margin: 1px 0;\n  white-space: nowrap;\n  z-index: auto;\n  position: relative;\n}\n\n.media-inspector-marker-spacer {\n  flex: auto;\n}\n\n.media-inspector-marker:hover {\n  margin: -1px 0;\n  opacity: 100%;\n}\n\n.media-inspector-marker-min-width {\n  flex: auto;\n  background-color: var(--sys-color-yellow-container);\n  border-right: 2px solid var(--sys-color-yellow-bright);\n  border-left: 2px solid var(--sys-color-yellow-bright);\n\n  &:hover {\n    background-color: color-mix(in srgb, var(--sys-color-yellow-container), var(--sys-color-yellow-bright) 30%);\n  }\n}\n\n.media-inspector-marker-min-width-right {\n  border-left: 2px solid var(--sys-color-yellow-bright);\n}\n\n.media-inspector-marker-min-width-left {\n  border-right: 2px solid var(--sys-color-yellow-bright);\n}\n\n.media-inspector-marker-min-max-width {\n  background-color: var(--sys-color-tertiary-container);\n  border-left: 2px solid var(--sys-color-tertiary);\n  border-right: 2px solid var(--sys-color-tertiary);\n}\n\n.media-inspector-marker-min-max-width:hover {\n  z-index: 1;\n}\n\n.media-inspector-marker-max-width {\n  background-color: var(--sys-color-inverse-primary);\n  border-right: 2px solid var(--sys-color-primary-bright);\n  border-left: 2px solid var(--sys-color-primary-bright);\n}\n\n/* Clear background colors when query is not active and not hovering */\n\n.media-inspector-marker-inactive .media-inspector-marker-min-width:not(:hover) {\n  background-color: var(--sys-color-surface-yellow);\n}\n\n.media-inspector-marker-inactive .media-inspector-marker-min-max-width:not(:hover) {\n  background-color: color-mix(in srgb, var(--sys-color-tertiary-container), var(--sys-color-cdt-base-container) 30%);\n}\n\n.media-inspector-marker-inactive .media-inspector-marker-max-width:not(:hover) {\n  background-color: var(--sys-color-tonal-container);\n}\n\n/* Media query labels */\n\n.media-inspector-marker-label-container {\n  position: absolute;\n  z-index: 1;\n}\n\n.media-inspector-marker:not(:hover) .media-inspector-marker-label-container {\n  display: none;\n}\n\n.media-inspector-marker-label-container-left {\n  left: -2px;\n}\n\n.media-inspector-marker-label-container-right {\n  right: -2px;\n}\n\n.media-inspector-marker-label {\n  color: var(--sys-color-on-surface);\n  position: absolute;\n  top: 1px;\n  bottom: 0;\n  font-size: 12px;\n  pointer-events: none;\n}\n\n.media-inspector-label-right {\n  right: 4px;\n}\n\n.media-inspector-label-left {\n  left: 4px;\n}\n", $e = /* @__PURE__ */ e({
	DEFAULT_VIEW: () => rt,
	MediaQueryInspector: () => st,
	MediaQueryUIModel: () => lt,
	Section: () => ct
}), et = { revealInSourceCode: "Reveal in source code" }, tt = i("panels/emulation/MediaQueryInspector.ts", et), nt = r.bind(void 0, tt), { classMap: H } = w, rt = (e, t, n) => {
	let r = (e) => ({
		"media-inspector-bar": !0,
		"media-inspector-marker-inactive": !e.active
	});
	f(x`
    <style>${Qe}</style>
    <div class='media-inspector-view'>
    ${e.markers.entries().map(([t, n]) => x`
      <div class='media-inspector-marker-container'>
        ${n.map((n) => x`
          <div
              class=${H(r(n))}
              @click=${() => e.onMediaQueryClicked(n.model)}
              @contextmenu=${(t) => e.onContextMenu(t, n.locations)}
          >
            ${t === 0 ? it(e.zoomFactor, n.model) : t === 1 ? at(e.zoomFactor, n.model) : ot(e.zoomFactor, n.model)}
          </div>
        `)}
      </div>
    `).toArray()}
    </div>`, n, { container: { attributes: { jslog: `${re().track({ click: !0 })}` } } });
};
function it(e, t) {
	return x`
    <div class='media-inspector-marker-spacer'></div>
    <div
        class='media-inspector-marker media-inspector-marker-max-width'
        style=${"width: " + t.maxWidthValue(e) + "px"}
        title=${t.mediaText()}
    >
      ${U(t.maxWidthExpression(), !1, !1)}
      ${U(t.maxWidthExpression(), !0, !0)}
    </div>
    <div class='media-inspector-marker-spacer'></div>
  `;
}
function at(e, t) {
	let n = (t.maxWidthValue(e) - t.minWidthValue(e)) * .5;
	return x`
    <div class='media-inspector-marker-spacer'></div>
    <div
        class='media-inspector-marker media-inspector-marker-min-max-width'
        style=${"width: " + n + "px"}
        title=${t.mediaText()}
    >
      ${U(t.maxWidthExpression(), !0, !1)}
      ${U(t.minWidthExpression(), !1, !0)}
    </div>
    <div class='media-inspector-marker-spacer' style=${"flex: 0 0 " + t.minWidthValue(e) + "px"}></div>
    <div
        class='media-inspector-marker media-inspector-marker-min-max-width'
        style=${"width: " + n + "px"}
        title=${t.mediaText()}
    >
      ${U(t.minWidthExpression(), !0, !1)}
      ${U(t.maxWidthExpression(), !1, !0)}
    </div>
    <div class='media-inspector-marker-spacer'></div>
  `;
}
function ot(e, t) {
	return x`
    <div
        class='media-inspector-marker media-inspector-marker-min-width media-inspector-marker-min-width-left'
        title=${t.mediaText()}
    >${U(t.minWidthExpression(), !1, !1)}</div>
    <div class='media-inspector-marker-spacer' style=${"flex: 0 0 " + t.minWidthValue(e) + "px"}></div>
    <div
        class='media-inspector-marker media-inspector-marker-min-width media-inspector-marker-min-width-right'
        title=${t.mediaText()}
    >${U(t.minWidthExpression(), !0, !0)}</div>
  `;
}
function U(e, t, n) {
	if (!e) return se;
	let r = {
		"media-inspector-marker-label-container": !0,
		"media-inspector-marker-label-container-left": t,
		"media-inspector-marker-label-container-right": !t
	}, i = {
		"media-inspector-marker-label": !0,
		"media-inspector-label-left": n,
		"media-inspector-label-right": !n
	};
	return x`
    <div class=${H(r)}>
      <span class=${H(i)}>${e.value()}${e.unit()}</span>
    </div>
  `;
}
var st = class extends N {
	view;
	mediaThrottler;
	getWidthCallback;
	setWidthCallback;
	scale;
	cssModel;
	cachedQueryModels;
	constructor(e, t, n, r = rt) {
		super({ useShadowDom: "pure" }), this.view = r, this.mediaThrottler = n, this.getWidthCallback = e, this.setWidthCallback = t, this.scale = 1, M.instance().observeModels(he, this), C.instance().addEventListener(E.ZOOM_CHANGED, this.requestUpdate.bind(this), this);
	}
	modelAdded(e) {
		e.target() === M.instance().primaryPageTarget() && (this.cssModel = e, this.cssModel.addEventListener(_.StyleSheetAdded, this.scheduleMediaQueriesUpdate, this), this.cssModel.addEventListener(_.StyleSheetRemoved, this.scheduleMediaQueriesUpdate, this), this.cssModel.addEventListener(_.StyleSheetChanged, this.scheduleMediaQueriesUpdate, this), this.cssModel.addEventListener(_.MediaQueryResultChanged, this.scheduleMediaQueriesUpdate, this));
	}
	modelRemoved(e) {
		e === this.cssModel && (this.cssModel.removeEventListener(_.StyleSheetAdded, this.scheduleMediaQueriesUpdate, this), this.cssModel.removeEventListener(_.StyleSheetRemoved, this.scheduleMediaQueriesUpdate, this), this.cssModel.removeEventListener(_.StyleSheetChanged, this.scheduleMediaQueriesUpdate, this), this.cssModel.removeEventListener(_.MediaQueryResultChanged, this.scheduleMediaQueriesUpdate, this), delete this.cssModel);
	}
	setAxisTransform(e) {
		Math.abs(this.scale - e) < 1e-8 || (this.scale = e, this.performUpdate());
	}
	onMediaQueryClicked(e) {
		let t = e.maxWidthExpression(), n = e.minWidthExpression();
		if (e.section() === 0) {
			this.setWidthCallback(t && t.computedLength() || 0);
			return;
		}
		if (e.section() === 2) {
			this.setWidthCallback(n && n.computedLength() || 0);
			return;
		}
		let r = this.getWidthCallback();
		n && r !== n.computedLength() ? this.setWidthCallback(n.computedLength() || 0) : this.setWidthCallback(t && t.computedLength() || 0);
	}
	onContextMenu(e, t) {
		if (!this.cssModel?.isEnabled()) return;
		let n = /* @__PURE__ */ new Map();
		for (let e = 0; e < t.length; ++e) {
			let r = Me.instance().rawLocationToUILocation(t[e]);
			if (!r) continue;
			let i = typeof r.columnNumber == "number" ? ke("%s:%d:%d", r.uiSourceCode.url(), r.lineNumber + 1, r.columnNumber + 1) : ke("%s:%d", r.uiSourceCode.url(), r.lineNumber + 1);
			n.set(i, r);
		}
		let r = [...n.keys()].sort(), i = new D(e), a = i.defaultSection().appendSubMenuItem(nt(et.revealInSourceCode), void 0, "reveal-in-source-list");
		for (let e = 0; e < r.length; ++e) {
			let t = r[e];
			a.defaultSection().appendItem(t, this.revealSourceLocation.bind(this, n.get(t)), { jslogContext: "reveal-in-source" });
		}
		i.show();
	}
	revealSourceLocation(e) {
		n(e);
	}
	scheduleMediaQueriesUpdate() {
		this.isShowing() && this.mediaThrottler.schedule(this.refetchMediaQueries.bind(this));
	}
	refetchMediaQueries() {
		return !this.isShowing() || !this.cssModel ? Promise.resolve() : this.cssModel.getMediaQueries().then(this.rebuildMediaQueries.bind(this));
	}
	squashAdjacentEqual(e) {
		let t = [];
		for (let n = 0; n < e.length; ++n) t[t.length - 1]?.equals(e[n]) || t.push(e[n]);
		return t;
	}
	rebuildMediaQueries(e) {
		let t = [];
		for (let n = 0; n < e.length; ++n) {
			let r = e[n];
			if (r.mediaList) for (let e = 0; e < r.mediaList.length; ++e) {
				let n = r.mediaList[e], i = lt.createFromMediaQuery(r, n);
				i && t.push(i);
			}
		}
		t.sort(r), t = this.squashAdjacentEqual(t);
		let n = this.cachedQueryModels && this.cachedQueryModels.length === t.length;
		for (let e = 0; n && e < t.length; ++e) n &&= this.cachedQueryModels?.[e].equals(t[e]);
		if (n) return;
		this.cachedQueryModels = t, this.requestUpdate();
		function r(e, t) {
			return e.compareTo(t);
		}
	}
	buildMediaQueryMarkers() {
		if (!this.cachedQueryModels) return [];
		let e = [], t = null;
		for (let n of this.cachedQueryModels) {
			t?.model.dimensionsEqual(n) ? t.active = t.active || n.active() : (t = {
				active: n.active(),
				model: n,
				locations: []
			}, e.push(t));
			let r = n.rawLocation();
			r && t.locations.push(r);
		}
		return e;
	}
	zoomFactor() {
		return C.instance().zoomFactor() / this.scale;
	}
	wasShown() {
		super.wasShown(), this.scheduleMediaQueriesUpdate(), this.performUpdate();
	}
	performUpdate() {
		let e = Map.groupBy(this.buildMediaQueryMarkers(), (e) => e.model.section());
		this.view({
			zoomFactor: this.zoomFactor(),
			markers: e,
			onMediaQueryClicked: this.onMediaQueryClicked.bind(this),
			onContextMenu: this.onContextMenu.bind(this)
		}, {}, this.contentElement);
	}
}, ct = /* @__PURE__ */ function(e) {
	return e[e.MAX = 0] = "MAX", e[e.MIN_MAX = 1] = "MIN_MAX", e[e.MIN = 2] = "MIN", e;
}({}), lt = class e {
	cssMedia;
	#e;
	#t;
	#n;
	#r;
	#i;
	constructor(e, t, n, r) {
		this.cssMedia = e, this.#e = t, this.#t = n, this.#n = r, this.#r = n && !t ? 0 : t && n ? 1 : 2;
	}
	static createFromMediaQuery(t, n) {
		let r = null, i = Number.MAX_VALUE, a = null, o = Number.MIN_VALUE, s = n.expressions();
		if (!s) return null;
		for (let e = 0; e < s.length; ++e) {
			let t = s[e], n = t.feature();
			if (n.indexOf("width") === -1) continue;
			let c = t.computedLength();
			n.startsWith("max-") && c && c < i ? (r = t, i = c) : n.startsWith("min-") && c && c > o && (a = t, o = c);
		}
		return o > i || !r && !a ? null : new e(t, a, r, n.active());
	}
	equals(e) {
		return this.compareTo(e) === 0;
	}
	dimensionsEqual(e) {
		let t = this.minWidthExpression(), n = e.minWidthExpression(), r = this.maxWidthExpression(), i = e.maxWidthExpression(), a = this.section() === e.section(), o = !t || t.computedLength() === n?.computedLength(), s = !r || r.computedLength() === i?.computedLength();
		return a && o && s;
	}
	compareTo(e) {
		if (this.section() !== e.section()) return this.section() - e.section();
		if (this.dimensionsEqual(e)) {
			let t = this.rawLocation(), n = e.rawLocation();
			return !t && !n ? Ae(this.mediaText(), e.mediaText()) : t && !n ? 1 : !t && n ? -1 : this.active() === e.active() ? !t || !n ? 0 : Ae(t.url, n.url) || t.lineNumber - n.lineNumber || t.columnNumber - n.columnNumber : this.active() ? -1 : 1;
		}
		let t = this.maxWidthExpression(), n = e.maxWidthExpression(), r = t && t.computedLength() || 0, i = n && n.computedLength() || 0, a = this.minWidthExpression(), o = e.minWidthExpression(), s = a && a.computedLength() || 0, c = o && o.computedLength() || 0;
		return this.section() === 0 ? i - r : this.section() === 2 ? s - c : s - c || i - r;
	}
	section() {
		return this.#r;
	}
	mediaText() {
		return this.cssMedia.text || "";
	}
	rawLocation() {
		return this.#i ||= this.cssMedia.rawLocation(), this.#i;
	}
	minWidthExpression() {
		return this.#e;
	}
	maxWidthExpression() {
		return this.#t;
	}
	minWidthValue(e) {
		let t = this.minWidthExpression();
		return t ? (t.computedLength() || 0) / e : 0;
	}
	maxWidthValue(e) {
		let t = this.maxWidthExpression();
		return t ? (t.computedLength() || 0) / e : 0;
	}
	active() {
		return this.#n;
	}
}, ut = /* @__PURE__ */ e({
	DeviceModeView: () => K,
	Ruler: () => q
}), W = {
	doubleclickForFullHeight: "Double-click for full height",
	mobileS: "Mobile S",
	mobileM: "Mobile M",
	mobileL: "Mobile L",
	tablet: "Tablet",
	laptop: "Laptop",
	laptopL: "Laptop L"
}, dt = i("panels/emulation/DeviceModeView.ts", W), G = r.bind(void 0, dt), K = class extends k {
	wrapperInstance;
	blockElementToWidth;
	model;
	mediaInspector;
	showMediaInspectorSetting;
	showRulersSetting;
	topRuler;
	leftRuler;
	presetBlocks;
	responsivePresetsContainer;
	screenArea;
	pageArea;
	outlineImage;
	contentClip;
	contentArea;
	rightResizerElement;
	leftResizerElement;
	bottomResizerElement;
	bottomRightResizerElement;
	bottomLeftResizerElement;
	cachedResizable;
	mediaInspectorContainer;
	screenImage;
	toolbar;
	slowPositionStart;
	resizeStart;
	cachedCssScreenRect;
	cachedCssVisiblePageRect;
	cachedOutlineRect;
	cachedMediaInspectorVisible;
	cachedShowRulers;
	cachedScale;
	handleWidth;
	handleHeight;
	constructor() {
		super({ useShadowDom: !0 }), this.blockElementToWidth = /* @__PURE__ */ new WeakMap(), this.setMinimumSize(150, 150), this.element.classList.add("device-mode-view"), this.registerRequiredCSS(Ze), this.model = ze.instance(), this.model.addEventListener(Le.UPDATED, this.updateUI, this), this.mediaInspector = new st(() => this.model.appliedDeviceSize().width, this.model.setWidth.bind(this.model), new fe(0)), this.showMediaInspectorSetting = a.instance().moduleSetting("show-media-query-inspector"), this.showMediaInspectorSetting.addChangeListener(this.updateUI, this), this.showRulersSetting = a.instance().moduleSetting("emulation.show-rulers"), this.showRulersSetting.addChangeListener(this.updateUI, this), this.topRuler = new q(!0, this.model.setWidthAndScaleToFit.bind(this.model)), this.topRuler.element.classList.add("device-mode-ruler-top"), this.leftRuler = new q(!1, this.model.setHeightAndScaleToFit.bind(this.model)), this.leftRuler.element.classList.add("device-mode-ruler-left"), this.createUI(), C.instance().addEventListener(E.ZOOM_CHANGED, this.zoomChanged, this);
	}
	createUI() {
		this.toolbar = new Xe(this.model, this.showMediaInspectorSetting, this.showRulersSetting), this.toolbar.show(this.contentElement), this.contentClip = this.contentElement.createChild("div", "device-mode-content-clip vbox"), this.responsivePresetsContainer = this.contentClip.createChild("div", "device-mode-presets-container"), this.responsivePresetsContainer.setAttribute("jslog", `${Se()}`), this.populatePresetsContainer(), this.mediaInspectorContainer = this.contentClip.createChild("div", "device-mode-media-container"), this.contentArea = this.contentClip.createChild("div", "device-mode-content-area"), this.outlineImage = this.contentArea.createChild("img", "device-mode-outline-image hidden fill"), this.outlineImage.addEventListener("load", this.onImageLoaded.bind(this, this.outlineImage, !0), !1), this.outlineImage.addEventListener("error", this.onImageLoaded.bind(this, this.outlineImage, !1), !1), this.screenArea = this.contentArea.createChild("div", "device-mode-screen-area"), this.screenImage = this.screenArea.createChild("img", "device-mode-screen-image hidden"), this.screenImage.addEventListener("load", this.onImageLoaded.bind(this, this.screenImage, !0), !1), this.screenImage.addEventListener("error", this.onImageLoaded.bind(this, this.screenImage, !1), !1), this.bottomRightResizerElement = this.screenArea.createChild("div", "device-mode-resizer device-mode-bottom-right-resizer"), this.bottomRightResizerElement.createChild("div", ""), this.createResizer(this.bottomRightResizerElement, 2, 1), this.bottomLeftResizerElement = this.screenArea.createChild("div", "device-mode-resizer device-mode-bottom-left-resizer"), this.bottomLeftResizerElement.createChild("div", ""), this.createResizer(this.bottomLeftResizerElement, -2, 1), this.rightResizerElement = this.screenArea.createChild("div", "device-mode-resizer device-mode-right-resizer"), this.rightResizerElement.createChild("div", ""), this.createResizer(this.rightResizerElement, 2, 0), this.leftResizerElement = this.screenArea.createChild("div", "device-mode-resizer device-mode-left-resizer"), this.leftResizerElement.createChild("div", ""), this.createResizer(this.leftResizerElement, -2, 0), this.bottomResizerElement = this.screenArea.createChild("div", "device-mode-resizer device-mode-bottom-resizer"), this.bottomResizerElement.createChild("div", ""), this.createResizer(this.bottomResizerElement, 0, 1), this.bottomResizerElement.addEventListener("dblclick", this.model.setHeight.bind(this.model, 0), !1), ae.install(this.bottomResizerElement, G(W.doubleclickForFullHeight)), this.pageArea = this.screenArea.createChild("div", "device-mode-page-area"), this.pageArea.createChild("slot");
	}
	populatePresetsContainer() {
		let e = [
			320,
			375,
			425,
			768,
			1024,
			1440,
			2560
		], t = [
			G(W.mobileS),
			G(W.mobileM),
			G(W.mobileL),
			G(W.tablet),
			G(W.laptop),
			G(W.laptopL),
			"4K"
		];
		this.presetBlocks = [];
		let n = this.responsivePresetsContainer.createChild("div", "device-mode-presets-container-inner");
		for (let i = e.length - 1; i >= 0; --i) {
			let a = n.createChild("div", "fill device-mode-preset-bar-outer").createChild("div", "device-mode-preset-bar");
			a.createChild("span").textContent = t[i] + " – " + e[i] + "px", a.setAttribute("jslog", `${A().track({ click: !0 }).context(`device-mode-preset-${e[i]}px`)}`), a.addEventListener("click", r.bind(this, e[i]), !1), this.blockElementToWidth.set(a, e[i]), this.presetBlocks.push(a);
		}
		function r(e, t) {
			this.model.emulate(I.Responsive, null, null), this.model.setWidthAndScaleToFit(e), t.consume();
		}
	}
	createResizer(e, t, n) {
		let r = new de();
		e.setAttribute("jslog", `${be("device-mode-resizer").track({ drag: !0 })}`), r.addElement(e);
		let i = t ? "ew-resize" : "ns-resize";
		return t * n > 0 && (i = "nwse-resize"), t * n < 0 && (i = "nesw-resize"), r.setCursor(i), r.addEventListener(O.RESIZE_START, this.onResizeStart, this), r.addEventListener(O.RESIZE_UPDATE_XY, this.onResizeUpdate.bind(this, t, n)), r.addEventListener(O.RESIZE_END, this.onResizeEnd, this), r;
	}
	onResizeStart() {
		this.slowPositionStart = null;
		let e = this.model.screenRect();
		this.resizeStart = new P(e.width, e.height);
	}
	onResizeUpdate(e, t, n) {
		n.data.shiftKey !== !!this.slowPositionStart && (this.slowPositionStart = n.data.shiftKey ? {
			x: n.data.currentX,
			y: n.data.currentY
		} : null);
		let r = n.data.currentX - n.data.startX, i = n.data.currentY - n.data.startY;
		if (this.slowPositionStart && (r = (n.data.currentX - this.slowPositionStart.x) / 10 + this.slowPositionStart.x - n.data.startX, i = (n.data.currentY - this.slowPositionStart.y) / 10 + this.slowPositionStart.y - n.data.startY), e && this.resizeStart) {
			let t = r * C.instance().zoomFactor(), n = this.resizeStart.width + t * e;
			n = Math.round(n / this.model.scale()), n >= 50 && n <= 9999 && this.model.setWidth(n);
		}
		if (t && this.resizeStart) {
			let e = i * C.instance().zoomFactor(), n = this.resizeStart.height + e * t;
			n = Math.round(n / this.model.scale()), n >= 50 && n <= 9999 && this.model.setHeight(n);
		}
	}
	exitHingeMode() {
		this.model && this.model.exitHingeMode();
	}
	onResizeEnd() {
		delete this.resizeStart, ue.actionTaken(xe.ResizedViewInResponsiveMode);
	}
	updateUI() {
		function e(e, t) {
			e.style.left = t.left + "px", e.style.top = t.top + "px", e.style.width = t.width + "px", e.style.height = t.height + "px";
		}
		if (!this.isShowing()) return;
		let t = C.instance().zoomFactor(), n = !1, r = this.showRulersSetting.get() && this.model.type() !== I.None, i = !1, a = !1, o = this.model.screenRect().scale(1 / t);
		(!this.cachedCssScreenRect || !o.isEqual(this.cachedCssScreenRect)) && (e(this.screenArea, o), a = !0, n = !0, this.cachedCssScreenRect = o);
		let s = this.model.visiblePageRect().scale(1 / t);
		(!this.cachedCssVisiblePageRect || !s.isEqual(this.cachedCssVisiblePageRect)) && (e(this.pageArea, s), n = !0, this.cachedCssVisiblePageRect = s);
		let c = this.model.outlineRect();
		if (c) {
			let r = c.scale(1 / t);
			(!this.cachedOutlineRect || !r.isEqual(this.cachedOutlineRect)) && (e(this.outlineImage, r), n = !0, this.cachedOutlineRect = r);
		}
		this.contentClip.classList.toggle("device-mode-outline-visible", !!this.model.outlineImage());
		let l = this.model.type() === I.Responsive;
		l !== this.cachedResizable && (this.rightResizerElement.classList.toggle("hidden", !l), this.leftResizerElement.classList.toggle("hidden", !l), this.bottomResizerElement.classList.toggle("hidden", !l), this.bottomRightResizerElement.classList.toggle("hidden", !l), this.bottomLeftResizerElement.classList.toggle("hidden", !l), this.cachedResizable = l);
		let u = this.showMediaInspectorSetting.get() && this.model.type() !== I.None;
		if (u !== this.cachedMediaInspectorVisible && (u ? this.mediaInspector.show(this.mediaInspectorContainer) : this.mediaInspector.detach(), i = !0, n = !0, this.cachedMediaInspectorVisible = u), r !== this.cachedShowRulers && (this.contentClip.classList.toggle("device-mode-rulers-visible", r), r ? (this.topRuler.show(this.contentArea), this.leftRuler.show(this.contentArea)) : (this.topRuler.detach(), this.leftRuler.detach()), i = !0, n = !0, this.cachedShowRulers = r), this.model.scale() !== this.cachedScale) {
			a = !0, n = !0;
			for (let e of this.presetBlocks) {
				let t = this.blockElementToWidth.get(e);
				if (!t) throw Error("Could not get width for block.");
				e.style.width = t * this.model.scale() + "px";
			}
			this.cachedScale = this.model.scale();
		}
		this.toolbar.requestUpdate(), this.loadImage(this.screenImage, this.model.screenImage()), this.loadImage(this.outlineImage, this.model.outlineImage()), this.mediaInspector.setAxisTransform(this.model.scale()), n && this.doResize(), a && (this.topRuler.render(this.model.scale()), this.leftRuler.render(this.model.scale()), this.topRuler.element.positionAt(this.cachedCssScreenRect ? this.cachedCssScreenRect.left : 0, this.cachedCssScreenRect ? this.cachedCssScreenRect.top : 0), this.leftRuler.element.positionAt(this.cachedCssScreenRect ? this.cachedCssScreenRect.left : 0, this.cachedCssScreenRect ? this.cachedCssScreenRect.top : 0)), i && this.contentAreaResized();
	}
	loadImage(e, t) {
		e.getAttribute("srcset") !== t && (e.setAttribute("srcset", t), t || e.classList.toggle("hidden", !0));
	}
	onImageLoaded(e, t) {
		e.classList.toggle("hidden", !t);
	}
	setNonEmulatedAvailableSize(e) {
		if (this.model.type() !== I.None) return;
		let t = C.instance().zoomFactor(), n = e.getBoundingClientRect(), r = new P(Math.max(n.width * t, 1), Math.max(n.height * t, 1));
		this.model.setAvailableSize(r, r);
	}
	contentAreaResized() {
		let e = C.instance().zoomFactor(), t = this.contentArea.getBoundingClientRect(), n = new P(Math.max(t.width * e, 1), Math.max(t.height * e, 1)), r = new P(Math.max((t.width - 2 * (this.handleWidth || 0)) * e, 1), Math.max((t.height - (this.handleHeight || 0)) * e, 1));
		this.model.setAvailableSize(n, r);
	}
	measureHandles() {
		let e = this.rightResizerElement.classList.contains("hidden");
		this.rightResizerElement.classList.toggle("hidden", !1), this.bottomResizerElement.classList.toggle("hidden", !1), this.handleWidth = this.rightResizerElement.offsetWidth, this.handleHeight = this.bottomResizerElement.offsetHeight, this.rightResizerElement.classList.toggle("hidden", e), this.bottomResizerElement.classList.toggle("hidden", e);
	}
	zoomChanged() {
		delete this.handleWidth, delete this.handleHeight, this.isShowing() && (this.measureHandles(), this.contentAreaResized());
	}
	onResize() {
		this.isShowing() && this.contentAreaResized();
	}
	wasShown() {
		super.wasShown(), this.measureHandles(), this.toolbar.restore();
	}
	willHide() {
		super.willHide(), this.model.emulate(I.None, null, null);
	}
	async captureScreenshot() {
		let e = await this.model.captureScreenshot(!1);
		if (e === null) return;
		let t = new Image();
		t.src = "data:image/png;base64," + e, t.onload = async () => {
			let e = t.naturalWidth / this.model.screenRect().width, n = this.model.outlineRect();
			if (!n) throw Error("Unable to take screenshot: no outlineRect available.");
			let r = n.scale(e), i = this.model.screenRect().scale(e), a = this.model.visiblePageRect().scale(e), o = i.left + a.left - r.left, s = i.top + a.top - r.top, c = document.createElement("canvas");
			c.width = Math.floor(r.width), c.height = Math.min(16384, Math.floor(r.height));
			let l = c.getContext("2d", { willReadFrequently: !0 });
			if (!l) throw Error("Could not get 2d context from canvas.");
			l.imageSmoothingEnabled = !1, this.model.outlineImage() && await this.paintImage(l, this.model.outlineImage(), r.relativeTo(r)), this.model.screenImage() && await this.paintImage(l, this.model.screenImage(), i.relativeTo(r)), l.drawImage(t, Math.floor(o), Math.floor(s)), this.saveScreenshot(c);
		};
	}
	async captureFullSizeScreenshot() {
		let e = await this.model.captureScreenshot(!0);
		if (e !== null) return this.saveScreenshotBase64(e);
	}
	async captureAreaScreenshot(e) {
		let t = await this.model.captureScreenshot(!1, e);
		if (t !== null) return this.saveScreenshotBase64(t);
	}
	saveScreenshotBase64(e) {
		let t = new Image();
		t.src = "data:image/png;base64," + e, t.onload = () => {
			let e = document.createElement("canvas");
			e.width = t.naturalWidth, e.height = Math.min(16384, Math.floor(t.naturalHeight));
			let n = e.getContext("2d", { willReadFrequently: !0 });
			if (!n) throw Error("Could not get 2d context for base64 screenshot.");
			n.imageSmoothingEnabled = !1, n.drawImage(t, 0, 0), this.saveScreenshot(e);
		};
	}
	paintImage(e, t, n) {
		return new Promise((r) => {
			let i = new Image();
			i.crossOrigin = "Anonymous", i.srcset = t, i.onerror = () => r(), i.onload = () => {
				e.drawImage(i, n.left, n.top, n.width, n.height), r();
			};
		});
	}
	saveScreenshot(e) {
		let t = this.model.inspectedURL(), n = "";
		if (t) {
			let e = Oe(t);
			n = De(e);
		}
		let r = this.model.device();
		r && this.model.type() === I.Device && (n += `(${r.title})`);
		let i = document.createElement("a");
		i.download = n + ".png", e.toBlob((e) => {
			e !== null && (i.href = URL.createObjectURL(e), i.click());
		});
	}
}, q = class extends k {
	#e;
	horizontal;
	scale;
	count;
	throttler;
	applyCallback;
	renderedScale;
	renderedZoomFactor;
	constructor(e, t) {
		super({ jslog: `${v().track({ click: !0 })}` }), this.element.classList.add("device-mode-ruler"), this.#e = this.element.createChild("div", "device-mode-ruler-content").createChild("div", "device-mode-ruler-inner"), this.horizontal = e, this.scale = 1, this.count = 0, this.throttler = new fe(0), this.applyCallback = t;
	}
	render(e) {
		this.scale = e, this.throttler.schedule(this.update.bind(this));
	}
	onResize() {
		this.throttler.schedule(this.update.bind(this));
	}
	update() {
		let e = C.instance().zoomFactor(), t = this.horizontal ? this.#e.offsetWidth : this.#e.offsetHeight;
		(this.scale !== this.renderedScale || e !== this.renderedZoomFactor) && (this.#e.removeChildren(), this.count = 0, this.renderedScale = this.scale, this.renderedZoomFactor = e);
		let n = t * e / this.scale, r = Math.ceil(n / 5), i = 1;
		this.scale < .8 && (i = 2), this.scale < .6 && (i = 4), this.scale < .4 && (i = 8), this.scale < .2 && (i = 16), this.scale < .1 && (i = 32);
		for (let e = r; e < this.count; e++) if (!(e % i)) {
			let e = this.#e.lastChild;
			e && e.remove();
		}
		for (let t = this.count; t < r; t++) {
			if (t % i) continue;
			let n = this.#e.createChild("div", "device-mode-ruler-marker");
			if (t && (this.horizontal ? n.style.left = 5 * t * this.scale / e + "px" : n.style.top = 5 * t * this.scale / e + "px", !(t % 20))) {
				let e = n.createChild("div", "device-mode-ruler-text");
				e.textContent = String(t * 5), e.addEventListener("click", this.onMarkerClick.bind(this, t * 5), !1);
			}
			t % 10 ? t % 5 || n.classList.add("device-mode-ruler-marker-medium") : n.classList.add("device-mode-ruler-marker-large");
		}
		this.count = r;
	}
	onMarkerClick(e) {
		this.applyCallback.call(null, e);
	}
}, ft = /* @__PURE__ */ e({
	ActionDelegate: () => pt,
	DeviceModeWrapper: () => Y
}), J, Y = class e extends k {
	inspectedPagePlaceholder;
	deviceModeView;
	toggleDeviceModeAction;
	showDeviceModeSetting;
	constructor(e) {
		super(), this.inspectedPagePlaceholder = e, this.deviceModeView = null, this.toggleDeviceModeAction = ve.instance().getAction("emulation.toggle-device-mode");
		let t = ze.instance();
		this.showDeviceModeSetting = t.enabledSetting(), this.showDeviceModeSetting.setRequiresUserAction(!!Ee.queryParam("hasOtherClients")), this.showDeviceModeSetting.addChangeListener(this.update.bind(this, !1)), M.instance().addModelListener(ge, ce.SCREENSHOT_REQUESTED, this.screenshotRequestedFromOverlay, this), this.update(!0);
	}
	static instance(t = {
		forceNew: null,
		inspectedPagePlaceholder: null
	}) {
		let { forceNew: n, inspectedPagePlaceholder: r } = t;
		if (!J || n) {
			if (!r) throw Error(`Unable to create DeviceModeWrapper: inspectedPagePlaceholder must be provided: ${(/* @__PURE__ */ Error()).stack}`);
			J = new e(r);
		}
		return J;
	}
	toggleDeviceMode() {
		this.showDeviceModeSetting.set(!this.showDeviceModeSetting.get());
	}
	isDeviceModeOn() {
		return this.showDeviceModeSetting.get();
	}
	captureScreenshot(e, t) {
		return this.deviceModeView ||= new K(), this.deviceModeView.setNonEmulatedAvailableSize(this.inspectedPagePlaceholder.element), e ? this.deviceModeView.captureFullSizeScreenshot() : t ? this.deviceModeView.captureAreaScreenshot(t) : this.deviceModeView.captureScreenshot(), !0;
	}
	screenshotRequestedFromOverlay(e) {
		let t = e.data;
		this.captureScreenshot(!1, t);
	}
	update(e) {
		this.toggleDeviceModeAction.setToggled(this.showDeviceModeSetting.get());
		let t = this.showDeviceModeSetting.get();
		(e || t !== this.deviceModeView?.isShowing()) && (t ? (this.deviceModeView ||= new K(), this.deviceModeView.show(this.element), this.inspectedPagePlaceholder.clearMinimumSize(), this.inspectedPagePlaceholder.show(this.deviceModeView.element)) : (this.deviceModeView && (this.deviceModeView.exitHingeMode(), this.deviceModeView.detach()), this.inspectedPagePlaceholder.restoreMinimumSize(), this.inspectedPagePlaceholder.show(this.element)));
	}
}, pt = class {
	handleAction(e, t) {
		switch (t) {
			case "emulation.capture-screenshot": return Y.instance().captureScreenshot();
			case "emulation.capture-node-screenshot": {
				let t = e.flavor(ye);
				if (!t) return !0;
				async function n() {
					if (!t || !await t.resolveToObject()) return;
					let e = await t.boxModel();
					if (!e) throw Error(`Unable to get box model of the node: ${(/* @__PURE__ */ Error()).stack}`);
					let n = e.border, r = await t.domModel().target().pageAgent().invoke_getLayoutMetrics();
					if (r.getError()) throw Error(`Unable to get metrics: ${(/* @__PURE__ */ Error()).stack}`);
					let i = r.cssVisualViewport.pageX, a = r.cssVisualViewport.pageY, { x: o, y: s } = await mt(t.domModel().target()), c = {
						x: o + i + n[0],
						y: s + a + n[1],
						width: e.width,
						height: e.height,
						scale: 1
					}, l = r.cssVisualViewport.zoom ?? 1;
					c.x *= l, c.y *= l, c.width *= l, c.height *= l, Y.instance().captureScreenshot(!1, c);
				}
				return n(), !0;
			}
			case "emulation.capture-full-height-screenshot": return Y.instance().captureScreenshot(!0);
			case "emulation.toggle-device-mode": return Y.instance().toggleDeviceMode(), !0;
		}
		return !1;
	}
};
async function mt(e) {
	if (!e) return {
		x: 0,
		y: 0
	};
	let t = e.parentTarget();
	if (!t || t.type() !== b.FRAME) return {
		x: 0,
		y: 0
	};
	let n = e.model(ie)?.mainFrame?.id;
	if (!n) return {
		x: 0,
		y: 0
	};
	let r = t.model(le);
	if (!r) return {
		x: 0,
		y: 0
	};
	let i = await (await r.getOwnerNodeForFrame(n))?.resolvePromise();
	if (!i) return {
		x: 0,
		y: 0
	};
	let a = await i.boxModel();
	if (!a) return {
		x: 0,
		y: 0
	};
	let o = a.content, s = o[0], c = o[1], l = await t.pageAgent().invoke_getLayoutMetrics();
	if (l.getError()) return {
		x: 0,
		y: 0
	};
	let u = l.cssVisualViewport.pageX, d = l.cssVisualViewport.pageY, f = await mt(t);
	return {
		x: s + u + f.x,
		y: c + d + f.y
	};
}
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/emulation/inspectedPagePlaceholder.css.mjs
var ht = "/*\n * Copyright 2016 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  background-color: var(--sys-color-cdt-base-container);\n}\n", gt = /* @__PURE__ */ e({
	Events: () => _t,
	InspectedPagePlaceholder: () => Z
}), X, Z = class e extends t(N) {
	updateId;
	constructor() {
		super({ useShadowDom: !0 }), this.registerRequiredCSS(ht), C.instance().addEventListener(E.ZOOM_CHANGED, this.onResize, this), this.restoreMinimumSize();
	}
	static instance(t = { forceNew: null }) {
		let { forceNew: n } = t;
		return (!X || n) && (X = new e()), X;
	}
	onResize() {
		this.updateId && this.element.window().cancelAnimationFrame(this.updateId), this.updateId = this.element.window().requestAnimationFrame(this.update.bind(this, !1));
	}
	restoreMinimumSize() {
		this.setMinimumSize(150, 150);
	}
	clearMinimumSize() {
		this.setMinimumSize(1, 1);
	}
	dipPageRect() {
		let e = C.instance().zoomFactor(), t = this.element.getBoundingClientRect(), n = this.element.ownerDocument.body.getBoundingClientRect(), r = Math.max(t.left * e, n.left * e), i = Math.max(t.top * e, n.top * e), a = Math.min(t.bottom * e, n.bottom * e);
		return {
			x: r,
			y: i,
			width: Math.min(t.right * e, n.right * e) - r,
			height: a - i
		};
	}
	update(e) {
		delete this.updateId;
		let t = this.dipPageRect(), n = {
			x: Math.round(t.x),
			y: Math.round(t.y),
			height: Math.max(1, Math.round(t.height)),
			width: Math.max(1, Math.round(t.width))
		};
		e && (--n.height, this.dispatchEventToListeners("Update", n), ++n.height), this.dispatchEventToListeners("Update", n);
	}
}, _t = /* @__PURE__ */ function(e) {
	return e.UPDATE = "Update", e;
}({}), vt = /* @__PURE__ */ e({
	AdvancedApp: () => Q,
	AdvancedAppProvider: () => bt
}), yt, Q = class e {
	rootSplitWidget;
	deviceModeView;
	inspectedPagePlaceholder;
	toolboxWindow;
	toolboxRootView;
	changingDockSide;
	constructor() {
		d.instance().addEventListener(g.BEFORE_DOCK_SIDE_CHANGED, this.openToolboxWindow, this);
	}
	static instance() {
		return yt ||= new e(), yt;
	}
	presentUI(e) {
		let t = new we();
		this.rootSplitWidget = new oe(!1, !0, "inspector-view.split-view-state", 555, 300, !0), this.rootSplitWidget.show(t.element), this.rootSplitWidget.setSidebarWidget(y.instance()), this.rootSplitWidget.setDefaultFocusedChild(y.instance()), y.instance().setOwnerSplit(this.rootSplitWidget), this.inspectedPagePlaceholder = Z.instance(), this.inspectedPagePlaceholder.addEventListener(_t.UPDATE, this.onSetInspectedPageBounds.bind(this), this), this.deviceModeView = Y.instance({
			inspectedPagePlaceholder: this.inspectedPagePlaceholder,
			forceNew: !1
		}), d.instance().addEventListener(g.BEFORE_DOCK_SIDE_CHANGED, this.onBeforeDockSideChange, this), d.instance().addEventListener(g.DOCK_SIDE_CHANGED, this.onDockSideChange, this), d.instance().addEventListener(g.AFTER_DOCK_SIDE_CHANGED, this.onAfterDockSideChange, this), this.onDockSideChange(), console.timeStamp("AdvancedApp.attachToBody"), t.attachToDocument(e), t.focus(), this.inspectedPagePlaceholder.update();
	}
	openToolboxWindow(e) {
		if (e.data.to !== p.UNDOCKED || this.toolboxWindow) return;
		let t = window.location.href.replace("devtools_app.html", "device_mode_emulation_frame.html");
		this.toolboxWindow = window.open(t, void 0);
	}
	deviceModeEmulationFrameLoaded(e) {
		je.instance().addDocumentToTheme(e), c(e), s(e.documentElement), me(e.body), D.installHandler(e), this.toolboxRootView = new we(), this.toolboxRootView.attachToDocument(e), this.updateDeviceModeView();
	}
	updateDeviceModeView() {
		this.isDocked() ? this.rootSplitWidget.setMainWidget(this.deviceModeView) : this.toolboxRootView && this.deviceModeView.show(this.toolboxRootView.element);
	}
	onBeforeDockSideChange(e) {
		e.data.to === p.UNDOCKED && this.toolboxRootView && (this.rootSplitWidget.hideSidebar(), this.inspectedPagePlaceholder.update()), this.changingDockSide = !0;
	}
	onDockSideChange(e) {
		this.updateDeviceModeView();
		let t = e ? e.data.to : d.instance().dockSide();
		if (t === void 0) throw Error("Got onDockSideChange event with unexpected undefined for dockSide()");
		t === p.UNDOCKED ? this.updateForUndocked() : this.toolboxRootView && e && e.data.from === p.UNDOCKED ? this.rootSplitWidget.hideSidebar() : this.updateForDocked(t);
	}
	onAfterDockSideChange(e) {
		this.changingDockSide && (e.data.from && e.data.from === p.UNDOCKED && this.updateForDocked(e.data.to), this.changingDockSide = !1, this.inspectedPagePlaceholder.update());
	}
	updateForDocked(e) {
		let t = this.rootSplitWidget.resizerElement();
		t.style.transform = e === p.RIGHT ? "translateX(2px)" : e === p.LEFT ? "translateX(-2px)" : "", this.rootSplitWidget.setVertical(e === p.RIGHT || e === p.LEFT), this.rootSplitWidget.setSecondIsSidebar(e === p.RIGHT || e === p.BOTTOM), this.rootSplitWidget.toggleResizer(this.rootSplitWidget.resizerElement(), !0), this.rootSplitWidget.toggleResizer(y.instance().topResizerElement(), e === p.BOTTOM), this.rootSplitWidget.showBoth();
	}
	updateForUndocked() {
		this.rootSplitWidget.toggleResizer(this.rootSplitWidget.resizerElement(), !1), this.rootSplitWidget.toggleResizer(y.instance().topResizerElement(), !1), this.rootSplitWidget.hideMain();
	}
	isDocked() {
		return d.instance().dockSide() !== p.UNDOCKED;
	}
	onSetInspectedPageBounds(e) {
		if (this.changingDockSide) return;
		let t = this.inspectedPagePlaceholder.element.window();
		if (!t.innerWidth || !t.innerHeight || !this.inspectedPagePlaceholder.isShowing()) return;
		let n = e.data;
		console.timeStamp("AdvancedApp.setInspectedPageBounds"), T.setInspectedPageBounds(n);
	}
};
globalThis.Emulation = globalThis.Emulation || {}, globalThis.Emulation.AdvancedApp = Q;
var $, bt = class e {
	static instance(t = { forceNew: null }) {
		let { forceNew: n } = t;
		return (!$ || n) && ($ = new e()), $;
	}
	createApp() {
		return Q.instance();
	}
};
//#endregion
export { Y as a, $e as c, pt as i, Ue as l, Z as n, ft as o, gt as r, ut as s, vt as t };
