import { n as e } from "./rolldown-runtime-DF993M8W.js";
import { D as t, H as n, K as r, i } from "./common-DMSVbaSb.js";
import { $a as a, $i as o, Bn as s, Fo as c, Ja as l, Ks as u, La as d, Mn as f, Of as p, Po as m, Si as h, T as g, U as _, Ur as v, Xi as y, Yo as b, Ys as x, ei as S, ha as C, hi as w, ja as T, jd as E, jr as D, no as O, qa as k, qs as A, uo as j, w as M, xi as N, yi as P } from "./legacy-dM_vujv7.js";
import { t as F } from "./settings_ui-B3VIsMZM.js";
import { l as I } from "./mobile_throttling-DGhe-4CD.js";
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/sensors/locationsSettingsTab.css.mjs
var L = "/*\n * Copyright 2018 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.add-locations-button {\n  margin-bottom: var(--sys-size-5);\n  border: none;\n}\n\n.locations-list {\n  margin-top: var(--sys-size-3);\n  flex: auto;\n}\n\n.locations-list-item {\n  padding: 3px 6px;\n  height: 30px;\n  display: flex;\n  align-items: center;\n  position: relative;\n  flex: auto 1 1;\n}\n\n.locations-list-text {\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  flex-basis: 170px;\n  user-select: none;\n  color: var(--sys-color-on-surface);\n  position: relative;\n  overflow: hidden;\n}\n\n.locations-list-title {\n  text-align: start;\n}\n\n.locations-list-title-text {\n  overflow: hidden;\n  flex: auto;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n\n.locations-list-separator {\n  flex: 0 0 1px;\n  background-color: var(--sys-color-divider);\n  height: 30px;\n  margin: 0 4px;\n}\n\n.locations-list-separator-invisible {\n  visibility: hidden;\n  height: 100% !important; /* stylelint-disable-line declaration-no-important */\n}\n\n.locations-edit-row {\n  display: flex;\n  flex-direction: row;\n  margin: 6px 5px;\n}\n\n.locations-edit-row input {\n  width: 100%;\n  text-align: inherit;\n}\n\n.locations-input-container {\n  padding: 1px;\n}\n\n.settings-card-container-wrapper {\n  scrollbar-gutter: stable;\n  padding: var(--sys-size-8) 0;\n  overflow: auto;\n  position: absolute;\n  inset: var(--sys-size-8) 0 0;\n}\n\n.settings-card-container {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: var(--sys-size-9);\n}\n", R = /* @__PURE__ */ e({ LocationsSettingsTab: () => H }), z = {
	locations: "Locations",
	locationName: "Location name",
	lat: "Lat",
	long: "Long",
	timezoneId: "Timezone ID",
	locale: "Locale",
	latitude: "Latitude",
	longitude: "Longitude",
	accuracy: "Accuracy",
	locationNameCannotBeEmpty: "Location name cannot be empty",
	locationNameMustBeLessThanS: "Location name must be less than {PH1} characters",
	latitudeMustBeANumber: "Latitude must be a number",
	latitudeMustBeGreaterThanOrEqual: "Latitude must be greater than or equal to {PH1}",
	latitudeMustBeLessThanOrEqualToS: "Latitude must be less than or equal to {PH1}",
	longitudeMustBeANumber: "Longitude must be a number",
	longitudeMustBeGreaterThanOr: "Longitude must be greater than or equal to {PH1}",
	longitudeMustBeLessThanOrEqualTo: "Longitude must be less than or equal to {PH1}",
	timezoneIdMustContainAlphabetic: "Timezone ID must contain alphabetic characters",
	localeMustContainAlphabetic: "Locale must contain alphabetic characters",
	accuracyMustBeANumber: "Accuracy must be a number",
	accuracyMustBeGreaterThanOrEqual: "Accuracy must be greater than or equal to {PH1}",
	addLocation: "Add location"
}, B = r("panels/sensors/LocationsSettingsTab.ts", z), V = n.bind(void 0, B), H = class extends S {
	list;
	customSetting;
	editor;
	constructor() {
		super({
			jslog: `${k("emulation-locations")}`,
			useShadowDom: !0
		}), this.registerRequiredCSS(L);
		let e = this.contentElement.createChild("div", "settings-card-container-wrapper").createChild("div");
		e.classList.add("settings-card-container");
		let t = e.createChild("devtools-card");
		t.heading = V(z.locations);
		let n = t.createChild("div");
		this.list = new g(this, void 0, !0), this.list.element.classList.add("locations-list"), this.list.registerRequiredCSS(L), this.list.show(n), this.customSetting = i.instance().moduleSetting("emulation.locations");
		let r = this.customSetting.get().map((e) => a(e, this.customSetting.defaultValue));
		function a(e, t) {
			if (!e.title) {
				let n = t.find((t) => t.lat === e.lat && t.long === e.long && t.timezoneId === e.timezoneId && t.locale === e.locale);
				if (!n) console.error("Could not determine a location setting title");
				else return n;
			}
			return e;
		}
		let s = new y();
		s.classList.add("add-locations-button"), s.data = {
			variant: o.OUTLINED,
			iconName: "plus",
			jslogContext: "emulation.add-location"
		}, s.textContent = V(z.addLocation), s.addEventListener("click", () => this.addButtonClicked()), t.append(s), this.customSetting.set(r), this.customSetting.addChangeListener(this.locationsUpdated, this);
	}
	wasShown() {
		super.wasShown(), this.locationsUpdated();
	}
	locationsUpdated() {
		this.list.clear();
		let e = this.customSetting.get();
		for (let t of e) this.list.appendItem(t, !0);
		this.list.appendSeparator();
	}
	addButtonClicked() {
		this.list.addNewItem(this.customSetting.get().length, {
			title: "",
			lat: 0,
			long: 0,
			timezoneId: "",
			locale: "",
			accuracy: x.DEFAULT_ACCURACY
		});
	}
	renderItem(e, t) {
		let n = document.createElement("div");
		n.role = "row", n.classList.add("locations-list-item");
		let r = n.createChild("div", "locations-list-text locations-list-title");
		r.role = "cell";
		let i = r.createChild("div", "locations-list-title-text");
		i.textContent = e.title, v.install(i, e.title), n.createChild("div", "locations-list-separator");
		let a = n.createChild("div", "locations-list-text");
		a.textContent = String(e.lat), a.role = "cell", n.createChild("div", "locations-list-separator");
		let o = n.createChild("div", "locations-list-text");
		o.textContent = String(e.long), o.role = "cell", n.createChild("div", "locations-list-separator");
		let s = n.createChild("div", "locations-list-text");
		s.textContent = e.timezoneId, s.role = "cell", n.createChild("div", "locations-list-separator");
		let c = n.createChild("div", "locations-list-text");
		return c.textContent = e.locale, c.role = "cell", n.createChild("div", "locations-list-separator"), n.createChild("div", "locations-list-text").textContent = String(e.accuracy || x.DEFAULT_ACCURACY), n;
	}
	removeItemRequested(e, t) {
		let n = this.customSetting.get();
		n.splice(t, 1), this.customSetting.set(n);
	}
	commitEdit(e, t, n) {
		e.title = t.control("title").value.trim();
		let r = t.control("lat").value.trim();
		e.lat = r ? parseFloat(r) : 0;
		let i = t.control("long").value.trim();
		e.long = i ? parseFloat(i) : 0, e.timezoneId = t.control("timezone-id").value.trim(), e.locale = t.control("locale").value.trim();
		let a = t.control("accuracy").value.trim();
		e.accuracy = a ? parseFloat(a) : x.DEFAULT_ACCURACY;
		let o = this.customSetting.get();
		n && o.push(e), this.customSetting.set(o);
	}
	beginEdit(e) {
		let t = this.createEditor();
		return t.control("title").value = e.title, t.control("lat").value = String(e.lat), t.control("long").value = String(e.long), t.control("timezone-id").value = e.timezoneId, t.control("locale").value = e.locale, t.control("accuracy").value = String(e.accuracy || x.DEFAULT_ACCURACY), t;
	}
	createEditor() {
		if (this.editor) return this.editor;
		let e = new M();
		this.editor = e;
		let t = e.contentElement(), n = t.createChild("div", "locations-edit-row");
		n.createChild("div", "locations-list-text locations-list-title").textContent = V(z.locationName), n.createChild("div", "locations-list-separator locations-list-separator-invisible"), n.createChild("div", "locations-list-text").textContent = V(z.lat), n.createChild("div", "locations-list-separator locations-list-separator-invisible"), n.createChild("div", "locations-list-text").textContent = V(z.long), n.createChild("div", "locations-list-separator locations-list-separator-invisible"), n.createChild("div", "locations-list-text").textContent = V(z.timezoneId), n.createChild("div", "locations-list-separator locations-list-separator-invisible"), n.createChild("div", "locations-list-text").textContent = V(z.locale), n.createChild("div", "locations-list-separator locations-list-separator-invisible"), n.createChild("div", "locations-list-text").textContent = V(z.accuracy);
		let r = t.createChild("div", "locations-edit-row");
		r.createChild("div", "locations-list-text locations-list-title locations-input-container").appendChild(e.createInput("title", "text", V(z.locationName), a)), r.createChild("div", "locations-list-separator locations-list-separator-invisible");
		let i = r.createChild("div", "locations-list-text locations-input-container");
		return i.appendChild(e.createInput("lat", "text", V(z.latitude), o)), r.createChild("div", "locations-list-separator locations-list-separator-invisible"), i = r.createChild("div", "locations-list-text locations-list-text-longitude locations-input-container"), i.appendChild(e.createInput("long", "text", V(z.longitude), s)), r.createChild("div", "locations-list-separator locations-list-separator-invisible"), i = r.createChild("div", "locations-list-text locations-input-container"), i.appendChild(e.createInput("timezone-id", "text", V(z.timezoneId), c)), r.createChild("div", "locations-list-separator locations-list-separator-invisible"), i = r.createChild("div", "locations-list-text locations-input-container"), i.appendChild(e.createInput("locale", "text", V(z.locale), l)), r.createChild("div", "locations-list-separator locations-list-separator-invisible"), i = r.createChild("div", "locations-list-text locations-input-container"), i.appendChild(e.createInput("accuracy", "text", V(z.accuracy), u)), e;
		function a(e, t, n) {
			let r = n.value.trim(), i;
			return r.length ? r.length > 50 && (i = V(z.locationNameMustBeLessThanS, { PH1: 50 })) : i = V(z.locationNameCannotBeEmpty), i ? {
				valid: !1,
				errorMessage: i
			} : { valid: !0 };
		}
		function o(e, t, n) {
			let r = n.value.trim(), i = Number(r);
			if (!r) return { valid: !0 };
			let a;
			return Number.isNaN(i) ? a = V(z.latitudeMustBeANumber) : parseFloat(r) < -90 ? a = V(z.latitudeMustBeGreaterThanOrEqual, { PH1: -90 }) : parseFloat(r) > 90 && (a = V(z.latitudeMustBeLessThanOrEqualToS, { PH1: 90 })), a ? {
				valid: !1,
				errorMessage: a
			} : { valid: !0 };
		}
		function s(e, t, n) {
			let r = -180, i = n.value.trim(), a = Number(i);
			if (!i) return { valid: !0 };
			let o;
			return Number.isNaN(a) ? o = V(z.longitudeMustBeANumber) : parseFloat(i) < r ? o = V(z.longitudeMustBeGreaterThanOr, { PH1: r }) : parseFloat(i) > 180 && (o = V(z.longitudeMustBeLessThanOrEqualTo, { PH1: 180 })), o ? {
				valid: !1,
				errorMessage: o
			} : { valid: !0 };
		}
		function c(e, t, n) {
			let r = n.value.trim();
			return r === "" || /[a-zA-Z]/.test(r) ? { valid: !0 } : {
				valid: !1,
				errorMessage: V(z.timezoneIdMustContainAlphabetic)
			};
		}
		function l(e, t, n) {
			let r = n.value.trim();
			return r === "" || /[a-zA-Z]{2}/.test(r) ? { valid: !0 } : {
				valid: !1,
				errorMessage: V(z.localeMustContainAlphabetic)
			};
		}
		function u(e, t, n) {
			let r = n.value.trim(), i = Number(r);
			if (!r) return { valid: !0 };
			let a;
			return Number.isNaN(i) ? a = V(z.accuracyMustBeANumber) : parseFloat(r) < 0 && (a = V(z.accuracyMustBeGreaterThanOrEqual, { PH1: 0 })), a ? {
				valid: !1,
				errorMessage: a
			} : { valid: !0 };
		}
	}
}, U = "/*\n * Copyright 2015 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.sensors-view {\n  padding: 12px;\n  display: block;\n}\n\n.sensors-view input {\n  width: 100%;\n  max-width: 120px;\n  margin: -5px 10px 0 0;\n  text-align: end;\n}\n\n.sensors-view input[readonly] {\n  background-color: var(--sys-color-neutral-container);\n}\n\n.sensors-view fieldset {\n  border: none;\n  padding: 10px 0;\n  flex: 0 0 auto;\n  margin: 0;\n}\n\n.sensors-view fieldset[disabled] {\n  opacity: 50%;\n}\n\n.orientation-axis-input-container input {\n  max-width: 120px;\n}\n\n.concurrency-details {\n  margin: var(--sys-size-5) var(--sys-size-10);\n  display: flex;\n  align-items: center;\n}\n\n.concurrency-details input {\n  width: 50px;\n  /* Clear out unexpected margin applied to `.sensors-view input` */\n  margin: 0;\n}\n\n.concurrency-hidden {\n  visibility: hidden;\n}\n\n.sensors-view input:focus::-webkit-input-placeholder {\n  color: transparent !important; /* stylelint-disable-line declaration-no-important */\n}\n\n.sensors-view select {\n  width: 200px;\n}\n\n.sensors-group-title {\n  width: 80px;\n  line-height: 24px;\n}\n\n.sensors-group {\n  display: flex;\n  flex-wrap: wrap;\n  margin-bottom: 10px;\n}\n\n.manage-locations {\n  margin-left: var(--sys-size-4);\n}\n\n.geo-fields {\n  flex: 2 0 200px;\n}\n\n.latlong-group {\n  display: flex;\n  margin-bottom: 10px;\n}\n\n.latlong-title {\n  width: 70px;\n}\n\n.timezone-error,\n.locale-error {\n  margin-left: 10px;\n  color: var(--legacy-input-validation-error);\n}\n\n/* Device Orientation */\n\n.orientation-content {\n  display: flex;\n  flex-wrap: wrap;\n}\n\n.orientation-fields {\n  margin-right: 10px;\n}\n\n.orientation-stage {\n  --override-gradient-color-1: var(--ref-palette-cyan95);\n  --override-gradient-color-2: var(--ref-palette-cyan90);\n\n  perspective: 700px;\n  perspective-origin: 50% 50%;\n  width: 160px;\n  height: 150px;\n  background: linear-gradient(var(--override-gradient-color-1) 0%, var(--override-gradient-color-1) 64%, var(--override-gradient-color-2) 64%, var(--override-gradient-color-1) 100%);\n  transition: 0.2s ease opacity, 0.2s ease filter;\n  overflow: hidden;\n  margin-bottom: 10px;\n}\n\n.theme-with-dark-background .orientation-stage,\n:host-context(.theme-with-dark-background) .orientation-stage {\n  --override-gradient-color-1: var(--ref-palette-cyan10);\n  --override-gradient-color-2: var(--ref-palette-cyan30);\n}\n\n.orientation-stage.disabled {\n  filter: grayscale();\n  opacity: 50%;\n}\n\n.orientation-element,\n.orientation-element::before,\n.orientation-element::after {\n  position: absolute;\n  box-sizing: border-box;\n  transform-style: preserve-3d;\n  background: no-repeat;\n  background-size: cover;\n  backface-visibility: hidden;\n}\n\n.orientation-box {\n  width: 62px;\n  height: 122px;\n  inset: 0;\n  margin: auto;\n  transform: rotate3d(1, 0, 0, 90deg);\n}\n\n.orientation-layer {\n  width: 100%;\n  height: 100%;\n  transform-style: preserve-3d;\n}\n\n.orientation-box.is-animating,\n.is-animating .orientation-layer {\n  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;\n}\n\n.orientation-front,\n.orientation-back {\n  width: 62px;\n  height: 122px;\n  border-radius: 8px;\n}\n\n.orientation-front {\n  background-image: var(--image-file-accelerometer-front);\n}\n\n.orientation-back {\n  transform: rotateY(180deg) translateZ(8px);\n  background-image: var(--image-file-accelerometer-back);\n}\n\n.orientation-left,\n.orientation-right {\n  width: 8px;\n  height: 106px;\n  top: 8px;\n  background-position: center center;\n}\n\n.orientation-left {\n  left: -8px;\n  transform-origin: right center;\n  transform: rotateY(-90deg);\n  background-image: var(--image-file-accelerometer-left);\n}\n\n.orientation-right {\n  right: -8px;\n  transform-origin: left center;\n  transform: rotateY(90deg);\n  background-image: var(--image-file-accelerometer-right);\n}\n\n.orientation-left::before,\n.orientation-left::after,\n.orientation-right::before,\n.orientation-right::after {\n  content: \"\";\n  width: 8px;\n  height: 6px;\n}\n\n.orientation-left::before,\n.orientation-left::after {\n  background-image: var(--image-file-accelerometer-left);\n}\n\n.orientation-right::before,\n.orientation-right::after {\n  background-image: var(--image-file-accelerometer-right);\n}\n\n.orientation-left::before,\n.orientation-right::before {\n  top: -6px;\n  transform-origin: center bottom;\n  transform: rotateX(26deg);\n  background-position: center top;\n}\n\n.orientation-left::after,\n.orientation-right::after {\n  bottom: -6px;\n  transform-origin: center top;\n  transform: rotateX(-25deg);\n  background-position: center bottom;\n}\n\n.orientation-top,\n.orientation-bottom {\n  width: 50px;\n  height: 8px;\n  left: 8px;\n  background-position: center center;\n}\n\n.orientation-top {\n  top: -8px;\n  transform-origin: center bottom;\n  transform: rotateX(90deg);\n  background-image: var(--image-file-accelerometer-top);\n}\n\n.orientation-bottom {\n  bottom: -8px;\n  transform-origin: center top;\n  transform: rotateX(-90deg);\n  background-image: var(--image-file-accelerometer-bottom);\n}\n\n.orientation-top::before,\n.orientation-top::after,\n.orientation-bottom::before,\n.orientation-bottom::after {\n  content: \"\";\n  width: 8px;\n  height: 8px;\n}\n\n.orientation-top::before,\n.orientation-top::after {\n  background-image: var(--image-file-accelerometer-top);\n}\n\n.orientation-bottom::before,\n.orientation-bottom::after {\n  background-image: var(--image-file-accelerometer-bottom);\n}\n\n.orientation-top::before,\n.orientation-bottom::before {\n  left: -6px;\n  transform-origin: right center;\n  transform: rotateY(-26deg);\n  background-position: left center;\n}\n\n.orientation-top::after,\n.orientation-bottom::after {\n  right: -6px;\n  transform-origin: left center;\n  transform: rotateY(26deg);\n  background-position: right center;\n}\n\n.orientation-axis-input-container {\n  margin-bottom: 10px;\n}\n\n.orientation-reset-button {\n  min-width: 80px;\n}\n\nfieldset.device-orientation-override-section {\n  margin: 0;\n  display: flex;\n}\n\n.panel-section-separator {\n  height: 1px;\n  margin-bottom: 20px;\n  margin-left: -12px;\n  margin-right: -12px;\n  background: var(--sys-color-divider);\n}\n\nbutton.text-button {\n  margin: 4px 0 0 10px;\n}\n\n@media (forced-colors: active) {\n  .sensors-view fieldset[disabled] {\n    opacity: 100%;\n  }\n}\n\n.chrome-select-label {\n  margin-bottom: 16px;\n}\n", W = /* @__PURE__ */ e({
	DeviceOrientationModificationSource: () => Y,
	NonPresetOptions: () => Z,
	PressureOptions: () => X,
	SensorsView: () => J,
	ShiftDragOrientationSpeed: () => 16,
	ShowActionDelegate: () => Q
}), G = {
	location: "Location",
	noOverride: "No override",
	overrides: "Overrides",
	manage: "Manage",
	manageTheListOfLocations: "Manage the list of locations",
	other: "Other…",
	error: "Error",
	locationUnavailable: "Location unavailable",
	adjustWithMousewheelOrUpdownKeys: "Adjust with mousewheel or up/down keys. {PH1}: ±10, Shift: ±1, Alt: ±0.01",
	latitude: "Latitude",
	longitude: "Longitude",
	timezoneId: "Timezone ID",
	locale: "Locale",
	accuracy: "Accuracy",
	orientation: "Orientation",
	off: "Off",
	customOrientation: "Custom orientation",
	enableOrientationToRotate: "Enable orientation to rotate",
	shiftdragHorizontallyToRotate: "Shift+drag horizontally to rotate around the y-axis",
	deviceOrientationSetToAlphaSBeta: "Device orientation set to alpha: {PH1}, beta: {PH2}, gamma: {PH3}",
	reset: "Reset",
	resetDeviceOrientation: "Reset device orientation",
	forcesTouchInsteadOfClick: "Forces touch instead of click",
	forcesSelectedIdleStateEmulation: "Forces selected idle state emulation",
	forcesSelectedPressureStateEmulation: "Forces selected pressure state emulation",
	presets: "Presets",
	portrait: "Portrait",
	portraitUpsideDown: "Portrait upside down",
	landscapeLeft: "Landscape left",
	landscapeRight: "Landscape right",
	displayUp: "Display up",
	displayDown: "Display down",
	alpha: "α (alpha)",
	beta: "β (beta)",
	gamma: "γ (gamma)"
}, K = r("panels/sensors/SensorsView.ts", G), q = n.bind(void 0, K), J = class extends S {
	#e;
	#t;
	#n;
	#r;
	fieldsetElement;
	timezoneError;
	locationSelectElement;
	latitudeInput;
	longitudeInput;
	timezoneInput;
	localeInput;
	accuracyInput;
	localeError;
	accuracyError;
	deviceOrientationSetting;
	deviceOrientation;
	deviceOrientationOverrideEnabled;
	deviceOrientationFieldset;
	stageElement;
	orientationSelectElement;
	alphaElement;
	betaElement;
	gammaElement;
	orientationLayer;
	boxMatrix;
	mouseDownVector;
	originalBoxMatrix;
	constructor() {
		super({
			jslog: `${l("sensors").track({ resize: !0 })}`,
			useShadowDom: !0
		}), this.registerRequiredCSS(U), this.contentElement.classList.add("sensors-view"), this.#e = i.instance().createSetting("emulation.location-override", ""), this.#t = x.parseSetting(this.#e.get()), this.#n = !1, this.#r = this.contentElement.createChild("section", "sensors-group");
		let e = i.instance().moduleSetting("emulation.locations");
		this.renderLocationSection(this.#t, e), e.addChangeListener(() => this.renderLocationSection(this.#t, e)), this.createPanelSeparator(), this.deviceOrientationSetting = i.instance().createSetting("emulation.device-orientation-override", ""), this.deviceOrientation = u.parseSetting(this.deviceOrientationSetting.get()), this.deviceOrientationOverrideEnabled = !1, this.createDeviceOrientationSection(), this.createPanelSeparator(), this.appendTouchControl(), this.createPanelSeparator(), this.appendIdleEmulator(), this.createPanelSeparator(), this.createHardwareConcurrencySection(), this.createPanelSeparator(), this.createPressureSection(), this.createPanelSeparator();
	}
	createPanelSeparator() {
		this.contentElement.createChild("div").classList.add("panel-section-separator");
	}
	renderLocationSection(e, n) {
		let r = n.get(), i = 0;
		if (this.#n) {
			if (e.unavailable) i = r.length + 2;
			else {
				i = r.length + 1;
				for (let [t, n] of r.entries()) if (e.latitude === n.lat && e.longitude === n.long && e.timezoneId === n.timezoneId && e.locale === n.locale) {
					i = t + 1;
					break;
				}
			}
		}
		let a = p() ? "⌘" : "Ctrl", s = q(G.adjustWithMousewheelOrUpdownKeys, { PH1: a });
		this.#r.setAttribute("jslog", `${O("location")}`), c(m`
      <label class="sensors-group-title" id="location-select-label" for="location-select">${q(G.location)}</label>
      <div class="geo-fields">
        <select
          id="location-select"
          ${b((e) => {
			e && (this.locationSelectElement = e);
		})}
          .selectedIndex=${i}
          @change=${this.#i.bind(this)}
          jslog=${T().track({ change: !0 })}
        >
          <option value=${Z.NoOverride} jslog=${d("no-override")}>${q(G.noOverride)}</option>
          <optgroup label=${q(G.overrides)}>
            ${r.map((e) => m`
              <option value=${JSON.stringify(e)} jslog=${d("custom")}>${e.title}</option>
            `)}
          </optgroup>
          <option value=${Z.Custom} jslog=${d("other")}>${q(G.other)}</option>
          <optgroup label=${q(G.error)}>
            <option value=${Z.Unavailable} jslog=${d("unavailable")}>${q(G.locationUnavailable)}</option>
          </optgroup>
        </select>
        <devtools-button
          .variant=${o.OUTLINED}
          class="manage-locations"
          @click=${() => t(n)}
          aria-label=${q(G.manageTheListOfLocations)}
          jslog=${C("sensors.manage-locations").track({ click: !0 })}
        >
          ${q(G.manage)}
        </devtools-button>
        <fieldset
          id="location-override-section"
          ?disabled=${!this.#n}
          ${b((e) => {
			e && (this.fieldsetElement = e);
		})}
        >
          <div class="latlong-group">
            <!-- @ts-ignore -->
            <input
              id="latitude-input"
              type="number"
              min="-90"
              max="90"
              step="any"
              required
              .value=${String(e.latitude)}
              name="latitude"
              title=${s}
              jslog=${j("latitude").track({ change: !0 })}
              ${b((e) => {
			e && (this.latitudeInput = e);
		})}
              @change=${this.#a.bind(this)}
              @keydown=${this.#o.bind(this)}
              @focus=${this.#s.bind(this)}
            >
            <label class="latlong-title" for="latitude-input">${q(G.latitude)}</label>
          </div>
          <div class="latlong-group">
            <!-- @ts-ignore -->
            <input
              id="longitude-input"
              type="number"
              min="-180"
              max="180"
              step="any"
              required
              .value=${String(e.longitude)}
              name="longitude"
              title=${s}
              jslog=${j("longitude").track({ change: !0 })}
              ${b((e) => {
			e && (this.longitudeInput = e);
		})}
              @change=${this.#a.bind(this)}
              @keydown=${this.#o.bind(this)}
              @focus=${this.#s.bind(this)}
            >
            <label class="latlong-title" for="longitude-input">${q(G.longitude)}</label>
          </div>
          <div class="latlong-group">
            <input
              id="timezone-input"
              type="text"
              pattern=".*[a-zA-Z].*"
              .value=${e.timezoneId}
              name="timezone"
              jslog=${j("timezone").track({ change: !0 })}
              ${b((e) => {
			e && (this.timezoneInput = e);
		})}
              @change=${this.#a.bind(this)}
              @keydown=${this.#o.bind(this)}
              @focus=${this.#s.bind(this)}
            >
            <label class="timezone-title" for="timezone-input">${q(G.timezoneId)}</label>
            <div class="timezone-error" ${b((e) => {
			e && (this.timezoneError = e);
		})}></div>
          </div>
          <div class="latlong-group">
            <input
              id="locale-input"
              type="text"
              pattern=".*[a-zA-Z]{2}.*"
              .value=${e.locale}
              name="locale"
              jslog=${j("locale").track({ change: !0 })}
              ${b((e) => {
			e && (this.localeInput = e);
		})}
              @change=${this.#a.bind(this)}
              @keydown=${this.#o.bind(this)}
              @focus=${this.#s.bind(this)}
            >
            <label class="locale-title" for="locale-input">${q(G.locale)}</label>
            <div class="locale-error" ${b((e) => {
			e && (this.localeError = e);
		})}></div>
          </div>
          <div class="latlong-group">
            <!-- @ts-ignore -->
            <input
              id="accuracy-input"
              type="number"
              min="0"
              step="any"
              .value=${String(e.accuracy || x.DEFAULT_ACCURACY)}
              name="accuracy"
              jslog=${j("accuracy").track({ change: !0 })}
              ${b((e) => {
			e && (this.accuracyInput = e);
		})}
              @change=${this.#a.bind(this)}
              @keydown=${this.#o.bind(this)}
              @focus=${this.#s.bind(this)}
            >
            <label class="accuracy-title" for="accuracy-input">${q(G.accuracy)}</label>
            <div class="accuracy-error" ${b((e) => {
			e && (this.accuracyError = e);
		})}></div>
          </div>
        </fieldset>
      </div>
    `, this.#r);
	}
	#i() {
		this.fieldsetElement.disabled = !1, this.timezoneError.textContent = "", this.accuracyError.textContent = "";
		let e = this.locationSelectElement.options[this.locationSelectElement.selectedIndex].value;
		if (e === Z.NoOverride) this.#n = !1, this.clearFieldsetElementInputs(), this.fieldsetElement.disabled = !0;
		else if (e === Z.Custom) {
			this.#n = !0;
			let e = x.parseUserInput(this.latitudeInput.value.trim(), this.longitudeInput.value.trim(), this.timezoneInput.value.trim(), this.localeInput.value.trim(), this.accuracyInput.value.trim());
			if (!e) return;
			this.#t = e;
		} else if (e === Z.Unavailable) this.#n = !0, this.#t = new x(0, 0, "", "", x.DEFAULT_ACCURACY, !0);
		else {
			this.#n = !0;
			let t = JSON.parse(e);
			this.#t = new x(t.lat, t.long, t.timezoneId, t.locale, t.accuracy || x.DEFAULT_ACCURACY, !1), this.latitudeInput.value = t.lat, this.longitudeInput.value = t.long, this.timezoneInput.value = t.timezoneId, this.localeInput.value = t.locale, this.accuracyInput.value = String(t.accuracy || x.DEFAULT_ACCURACY);
		}
		this.applyLocation(), e === Z.Custom && this.latitudeInput.focus();
	}
	#a(e) {
		e.currentTarget.checkValidity() && this.applyLocationUserInput();
	}
	#o(e) {
		let t = e.currentTarget;
		if (e.key === "Enter") {
			t.checkValidity() && this.applyLocationUserInput(), e.preventDefault();
			return;
		}
		if (t !== this.latitudeInput && t !== this.longitudeInput && t !== this.accuracyInput) return;
		let n = t === this.accuracyInput ? 1 : .1, r = s(parseFloat(t.value), e, n);
		if (r === null) return;
		let i = t.value;
		t.value = String(r), t.checkValidity() ? this.applyLocationUserInput() : t.value = i, e.preventDefault();
	}
	#s(e) {
		e.currentTarget.select();
	}
	applyLocationUserInput() {
		let e = x.parseUserInput(this.latitudeInput.value.trim(), this.longitudeInput.value.trim(), this.timezoneInput.value.trim(), this.localeInput.value.trim(), this.accuracyInput.value.trim());
		e && (this.timezoneError.textContent = "", this.accuracyError.textContent = "", this.setSelectElementLabel(this.locationSelectElement, Z.Custom), this.#t = e, this.applyLocation());
	}
	applyLocation() {
		this.#n ? this.#e.set(this.#t.toSetting()) : this.#e.set("");
		for (let e of E.instance().models(A)) e.emulateLocation(this.#n ? this.#t : null).catch((e) => {
			switch (e.type) {
				case "emulation-set-timezone":
					this.timezoneError.textContent = e.message;
					break;
				case "emulation-set-locale":
					this.localeError.textContent = e.message;
					break;
				case "emulation-set-accuracy": this.accuracyError.textContent = e.message;
			}
		});
	}
	clearFieldsetElementInputs() {
		this.latitudeInput.value = "0", this.longitudeInput.value = "0", this.timezoneInput.value = "", this.localeInput.value = "", this.accuracyInput.value = x.DEFAULT_ACCURACY.toString();
	}
	createDeviceOrientationSection() {
		let e = this.contentElement.createChild("section", "sensors-group");
		e.setAttribute("jslog", `${O("device-orientation")}`);
		let t = {
			title: q(G.off),
			orientation: Z.NoOverride,
			jslogContext: "off"
		}, n = {
			title: q(G.customOrientation),
			orientation: Z.Custom
		}, r = [{
			title: q(G.presets),
			value: [
				{
					title: q(G.portrait),
					orientation: "[0, 90, 0]",
					jslogContext: "portrait"
				},
				{
					title: q(G.portraitUpsideDown),
					orientation: "[180, -90, 0]",
					jslogContext: "portrait-upside-down"
				},
				{
					title: q(G.landscapeLeft),
					orientation: "[90, 0, -90]",
					jslogContext: "landscape-left"
				},
				{
					title: q(G.landscapeRight),
					orientation: "[90, -180, -90]",
					jslogContext: "landscape-right"
				},
				{
					title: q(G.displayUp),
					orientation: "[0, 0, 0]",
					jslogContext: "display-up"
				},
				{
					title: q(G.displayDown),
					orientation: "[0, -180, 0]",
					jslogContext: "displayUp-down"
				}
			]
		}];
		c(m`
        <label class="sensors-group-title" for="orientation-select">${q(G.orientation)}</label>
        <div class="orientation-content">
          <div class="orientation-fields">
            <select
              id="orientation-select"
              ${b((e) => {
			e && (this.orientationSelectElement = e);
		})}
              @change=${this.orientationSelectChanged.bind(this)}
              jslog=${T().track({ change: !0 })}
            >
              <option value=${t.orientation} jslog=${d(t.jslogContext)}>${t.title}</option>
              <option value=${n.orientation} jslog=${d("custom")}>${n.title}</option>
              ${r.map((e) => m`
                <optgroup label=${e.title}>
                  ${e.value.map((e) => m`
                    <option value=${e.orientation} jslog=${d(e.jslogContext)}>${e.title}</option>
                  `)}
                </optgroup>
              `)}
            </select>
            <fieldset
              class="device-orientation-override-section"
              ${b((e) => {
			e && (this.deviceOrientationFieldset = e);
		})}
            >
              <div class="orientation-inputs-cell">
                <div class="orientation-axis-input-container">
                  <!-- @ts-ignore -->
                  <input
                    id="alpha-input"
                    type="number"
                    min="0"
                    max="359.9999"
                    step="any"
                    required
                    ${b((e) => {
			e && (this.alphaElement = e);
		})}
                    @change=${this.#c.bind(this)}
                    @keydown=${this.#l.bind(this)}
                    @focus=${this.#u.bind(this)}
                  >
                  <label for="alpha-input">${q(G.alpha)}</label>
                </div>
                <div class="orientation-axis-input-container">
                  <!-- @ts-ignore -->
                  <input
                    id="beta-input"
                    type="number"
                    min="-180"
                    max="179.9999"
                    step="any"
                    required
                    ${b((e) => {
			e && (this.betaElement = e);
		})}
                    @change=${this.#c.bind(this)}
                    @keydown=${this.#l.bind(this)}
                    @focus=${this.#u.bind(this)}
                  >
                  <label for="beta-input">${q(G.beta)}</label>
                </div>
                <div class="orientation-axis-input-container">
                  <!-- @ts-ignore -->
                  <input
                    id="gamma-input"
                    type="number"
                    min="-90"
                    max="89.9999"
                    step="any"
                    required
                    ${b((e) => {
			e && (this.gammaElement = e);
		})}
                    @change=${this.#c.bind(this)}
                    @keydown=${this.#l.bind(this)}
                    @focus=${this.#u.bind(this)}
                  >
                  <label for="gamma-input">${q(G.gamma)}</label>
                </div>
                <devtools-button
                  .variant=${o.OUTLINED}
                  class="orientation-reset-button"
                  type="reset"
                  aria-label=${q(G.resetDeviceOrientation)}
                  @click=${this.resetDeviceOrientation.bind(this)}
                  jslog=${C("sensors.reset-device-orientiation").track({ click: !0 })}
                >
                  ${q(G.reset)}
                </devtools-button>
              </div>
            </fieldset>
          </div>
          <div
            class="orientation-stage"
            jslog=${a().track({ drag: !0 })}
            ${b((e) => {
			e && !this.stageElement && (this.stageElement = e, f(this.stageElement, this.onBoxDragStart.bind(this), (e) => {
				this.onBoxDrag(e);
			}, null, "-webkit-grabbing", "-webkit-grab"));
		})}
          >
            <div class="orientation-layer" ${b((e) => {
			e && (this.orientationLayer = e);
		})}>
              <section
                class="orientation-box orientation-element"
              >
                <section class="orientation-front orientation-element"></section>
                <section class="orientation-top orientation-element"></section>
                <section class="orientation-back orientation-element"></section>
                <section class="orientation-left orientation-element"></section>
                <section class="orientation-right orientation-element"></section>
                <section class="orientation-bottom orientation-element"></section>
              </section>
            </div>
          </div>
        </div>
      `, e), this.enableOrientationFields(!0), this.setBoxOrientation(this.deviceOrientation, !1), this.alphaElement.value = String(this.deviceOrientation.alpha), this.betaElement.value = String(this.deviceOrientation.beta), this.gammaElement.value = String(this.deviceOrientation.gamma);
	}
	createPressureSection() {
		let e = this.contentElement.createChild("div", "pressure-section"), t = F(i.instance().moduleSetting("emulation.cpu-pressure"), q(G.forcesSelectedPressureStateEmulation));
		t && e.appendChild(t);
	}
	enableOrientationFields(e) {
		e ? (this.deviceOrientationFieldset.disabled = !0, this.stageElement.classList.add("disabled"), v.install(this.stageElement, q(G.enableOrientationToRotate))) : (this.deviceOrientationFieldset.disabled = !1, this.stageElement.classList.remove("disabled"), v.install(this.stageElement, q(G.shiftdragHorizontallyToRotate)));
	}
	orientationSelectChanged() {
		let e = this.orientationSelectElement.options[this.orientationSelectElement.selectedIndex].value;
		if (this.enableOrientationFields(!1), e === Z.NoOverride) this.deviceOrientationOverrideEnabled = !1, this.enableOrientationFields(!0), this.applyDeviceOrientation();
		else if (e === Z.Custom) this.deviceOrientationOverrideEnabled = !0, this.resetDeviceOrientation(), this.alphaElement.focus();
		else {
			let t = JSON.parse(e);
			this.deviceOrientationOverrideEnabled = !0, this.deviceOrientation = new u(t[0], t[1], t[2]), this.setDeviceOrientation(this.deviceOrientation, "selectPreset");
		}
	}
	applyDeviceOrientation() {
		this.deviceOrientationOverrideEnabled && this.deviceOrientationSetting.set(this.deviceOrientation.toSetting());
		for (let e of E.instance().models(A)) e.emulateDeviceOrientation(this.deviceOrientationOverrideEnabled ? this.deviceOrientation : null);
	}
	setSelectElementLabel(e, t) {
		e.selectedIndex = Array.prototype.map.call(e.options, (e) => e.value).indexOf(t);
	}
	applyDeviceOrientationUserInput() {
		this.setDeviceOrientation(u.parseUserInput(this.alphaElement.value.trim(), this.betaElement.value.trim(), this.gammaElement.value.trim()), "userInput"), this.setSelectElementLabel(this.orientationSelectElement, Z.Custom);
	}
	resetDeviceOrientation() {
		this.setDeviceOrientation(new u(0, 90, 0), "resetButton"), this.setSelectElementLabel(this.orientationSelectElement, "[0, 90, 0]");
	}
	setDeviceOrientation(e, t) {
		if (!e) return;
		function n(e) {
			return Math.round(e * 1e4) / 1e4;
		}
		t !== "userInput" && (this.alphaElement.value = String(n(e.alpha)), this.betaElement.value = String(n(e.beta)), this.gammaElement.value = String(n(e.gamma)));
		let r = t !== "userDrag";
		this.setBoxOrientation(e, r), this.deviceOrientation = e, this.applyDeviceOrientation(), _.alert(q(G.deviceOrientationSetToAlphaSBeta, {
			PH1: e.alpha,
			PH2: e.beta,
			PH3: e.gamma
		}));
	}
	#c(e) {
		e.currentTarget.checkValidity() && this.applyDeviceOrientationUserInput();
	}
	#l(e) {
		let t = e.currentTarget;
		if (e.key === "Enter") {
			t.checkValidity() && this.applyDeviceOrientationUserInput(), e.preventDefault();
			return;
		}
		let n = s(parseFloat(t.value), e, 1);
		if (n === null) return;
		let r = t.value;
		t.value = String(n), t.checkValidity() ? this.applyDeviceOrientationUserInput() : t.value = r, e.preventDefault();
	}
	#u(e) {
		e.currentTarget.select();
	}
	setBoxOrientation(e, t) {
		t ? this.stageElement.classList.add("is-animating") : this.stageElement.classList.remove("is-animating");
		let { alpha: n, beta: r, gamma: i } = e;
		this.boxMatrix = new DOMMatrixReadOnly().rotate(0, 0, n).rotate(r, 0, 0).rotate(0, i, 0), this.orientationLayer.style.transform = `rotateY(${n}deg) rotateX(${-r}deg) rotateZ(${i}deg)`;
	}
	onBoxDrag(e) {
		let t = this.calculateRadiusVector(e.x, e.y);
		if (!t || !this.mouseDownVector) return !0;
		e.consume(!0);
		let n, r;
		e.shiftKey ? (n = new P(0, 0, 1), r = (t.x - this.mouseDownVector.x) * 16) : (n = h(this.mouseDownVector, t), r = N(this.mouseDownVector, t));
		let i = new DOMMatrixReadOnly().rotateAxisAngle(-n.x, n.z, n.y, r).multiply(this.originalBoxMatrix), a = w.fromDeviceOrientationRotationMatrix(i), o = new u(a.alpha, a.beta, a.gamma);
		return this.setDeviceOrientation(o, "userDrag"), this.setSelectElementLabel(this.orientationSelectElement, Z.Custom), !1;
	}
	onBoxDragStart(e) {
		return !this.deviceOrientationOverrideEnabled || (this.mouseDownVector = this.calculateRadiusVector(e.x, e.y), this.originalBoxMatrix = this.boxMatrix, !this.mouseDownVector) ? !1 : (e.consume(!0), !0);
	}
	calculateRadiusVector(e, t) {
		let n = this.stageElement.getBoundingClientRect(), r = Math.max(n.width, n.height) / 2, i = (e - n.left - n.width / 2) / r, a = (t - n.top - n.height / 2) / r, o = i * i + a * a;
		return o > .5 ? new P(i, a, .5 / Math.sqrt(o)) : new P(i, a, Math.sqrt(1 - o));
	}
	appendTouchControl() {
		let e = this.contentElement.createChild("div", "touch-section"), t = F(i.instance().moduleSetting("emulation.touch"), q(G.forcesTouchInsteadOfClick));
		t && e.appendChild(t);
	}
	appendIdleEmulator() {
		let e = this.contentElement.createChild("div", "idle-section"), t = F(i.instance().moduleSetting("emulation.idle-detection"), q(G.forcesSelectedIdleStateEmulation));
		t && e.appendChild(t);
	}
	createHardwareConcurrencySection() {
		let e = this.contentElement.createChild("div", "concurrency-section"), { checkbox: t, numericInput: n, reset: r, warning: i } = I().createHardwareConcurrencySelector(), a = document.createElement("div");
		a.classList.add("concurrency-details"), a.append(n.element, r.element, i.element), e.append(t, a);
	}
}, Y = /* @__PURE__ */ function(e) {
	return e.USER_INPUT = "userInput", e.USER_DRAG = "userDrag", e.RESET_BUTTON = "resetButton", e.SELECT_PRESET = "selectPreset", e;
}({}), X = {
	NoOverride: "no-override",
	Nominal: "nominal",
	Fair: "fair",
	Serious: "serious",
	Critical: "critical"
}, Z = {
	NoOverride: "noOverride",
	Custom: "custom",
	Unavailable: "unavailable"
}, Q = class {
	handleAction(e, t) {
		return D.instance().showView("sensors"), !0;
	}
};
//#endregion
export { R as LocationsSettingsTab, W as SensorsView };
