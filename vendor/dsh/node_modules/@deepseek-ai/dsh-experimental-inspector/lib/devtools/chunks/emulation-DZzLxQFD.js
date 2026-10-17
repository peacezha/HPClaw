import { n as e } from "./rolldown-runtime-DF993M8W.js";
import { H as t, K as n } from "./common-DMSVbaSb.js";
import { T as r, bn as i, ei as a, fo as o, lt as s, qa as c, w as l, xn as u } from "./legacy-dM_vujv7.js";
import { c as d, d as f, l as p, o as m, p as h, r as g, s as _, t as v, u as y } from "./emulation-CiDWWSyp.js";
import { t as b } from "./components-Cgicptsb.js";
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/settings/emulation/devicesSettingsTab.css.mjs
var x = "/*\n * Copyright 2015 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.device-card-content {\n  padding-left: 0;\n  padding-right: 0;\n}\n\n.list {\n  &:has(div) {\n    border: none;\n  }\n}\n\n#custom-device-add-button {\n  padding: var(--sys-size-5) var(--sys-size-6);\n}\n\n.devices-settings-tab .devices-button-row {\n  flex: none;\n  display: flex;\n\n  devtools-button {\n    margin: 4px 0 0 5px;\n  }\n}\n\n.devices-settings-tab .devices-list {\n  width: min(350px, 100%);\n  margin-top: 10px;\n}\n\n.devices-list-item {\n  padding: var(--sys-size-3) var(--sys-size-6);\n  height: var(--sys-size-13);\n  display: flex;\n  align-items: center;\n  flex: auto 1 1;\n  overflow: hidden;\n  color: var(--sys-color-on-surface);\n  user-select: none;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n\n.devices-list-checkbox {\n  height: 12px;\n  width: 12px;\n  margin: 2px 5px 2px 2px;\n  flex: none;\n  pointer-events: none;\n}\n\n.device-name {\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  overflow: hidden;\n}\n\n.devices-edit-fields {\n  flex: auto;\n  display: flex;\n  flex-direction: column;\n  align-items: stretch;\n  padding-left: 4px;\n  margin-bottom: 5px;\n}\n\n.devices-edit-fields b {\n  margin-top: 8px;\n  margin-bottom: 0;\n}\n\n.devices-edit-client-hints-heading {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  margin-bottom: 5px;\n}\n/* Don't want the bottom margin in the specific case of the folding one;\n * it messes with alignment with the arrow (which is a ::before) and  it's\n * spaced reasonably without it anyway\n */\nli .devices-edit-client-hints-heading {\n  margin-bottom: 0;\n}\n\n.devices-edit-client-hints-heading b {\n  margin-inline-end: 2px;\n}\n\n.devices-edit-client-hints-heading .help-icon {\n  margin-left: 2px;\n  margin-right: 2px;\n  vertical-align: middle;\n}\n\n.devices-edit-client-hints-heading a:focus {\n  box-shadow: var(--sys-color-state-focus-ring);\n}\n\n.devices-edit-fields input {\n  flex: auto;\n  margin: 8px 5px 0;\n}\n\nli.devices-edit-client-hints-field {\n  /* Cancel out padding from treeview's .tree-outline ol */\n  left: -12px;\n}\n\n.devices-edit-client-hints-field input {\n  flex: auto;\n  margin: 8px 5px 0;\n}\n\n.devices-edit-fields .device-edit-fixed {\n  flex: 0 0 140px;\n}\n\n.devices-edit-fields select {\n  margin: 8px 5px 0;\n}\n", S = /* @__PURE__ */ e({ DevicesSettingsTab: () => E }), C = {
	customDevices: "Custom devices",
	defaultDevices: "Default devices",
	addCustomDevice: "Add custom device",
	device: "Device",
	deviceName: "Device Name",
	width: "Width",
	height: "Height",
	devicePixelRatio: "Device pixel ratio",
	userAgentString: "User agent string",
	userAgentType: "User agent type",
	deviceNameMustBeLessThanS: "Device name must be less than {PH1} characters.",
	deviceNameCannotBeEmpty: "Device name cannot be empty.",
	deviceAddedOrUpdated: "Device {PH1} successfully added/updated.",
	userAgentStringCannotBeEmpty: "User agent string cannot be empty."
}, w = n("panels/settings/emulation/DevicesSettingsTab.ts", C), T = t.bind(void 0, w), E = class extends a {
	containerElement;
	addCustomButton;
	ariaSuccessMessageElement;
	#e;
	#t;
	muteUpdate;
	emulatedDevicesList;
	editor;
	constructor() {
		super({ jslog: `${c("devices")}` }), this.registerRequiredCSS(x), this.containerElement = this.contentElement.createChild("div", "settings-card-container-wrapper").createChild("div"), this.containerElement.classList.add("settings-card-container", "ignore-list-settings"), this.#t = new r(this, !1), this.#t.registerRequiredCSS(x), this.#t.element.classList.add("devices-list", "device-card-content"), this.muteUpdate = !1, this.emulatedDevicesList = p.instance(), this.emulatedDevicesList.addEventListener(y.CUSTOM_DEVICES_UPDATED, this.devicesUpdated, this), this.emulatedDevicesList.addEventListener(y.STANDARD_DEVICES_UPDATED, this.devicesUpdated, this), this.ariaSuccessMessageElement = this.contentElement.createChild("div", "device-success-message"), s(this.ariaSuccessMessageElement, !1), this.addCustomButton = i(T(C.addCustomDevice), this.addCustomDevice.bind(this), { jslogContext: "add-custom-device" }), this.addCustomButton.id = "custom-device-add-button";
		let e = document.createElement("div");
		e.classList.add("device-card-content"), e.appendChild(this.ariaSuccessMessageElement);
		let t = e.createChild("div");
		e.appendChild(this.addCustomButton);
		let n = this.containerElement.createChild("devtools-card");
		n.heading = T(C.customDevices), n.append(e), this.#e = new r(this, !1), this.#e.registerRequiredCSS(x), this.#e.element.classList.add("devices-list"), this.#e.show(t);
		let a = this.containerElement.createChild("devtools-card");
		a.heading = T(C.defaultDevices), a.append(this.#t.element);
	}
	wasShown() {
		super.wasShown(), this.devicesUpdated();
	}
	devicesUpdated() {
		if (this.muteUpdate) return;
		this.#t.clear(), this.#e.clear();
		let e = this.emulatedDevicesList.custom().slice();
		for (let t = 0; t < e.length; ++t) this.#e.appendItem(e[t], !0);
		e = this.emulatedDevicesList.standard().slice(), e.sort(d.deviceComparator);
		for (let t = 0; t < e.length; ++t) this.#t.appendItem(e[t], !1);
	}
	muteAndSaveDeviceList(e) {
		this.muteUpdate = !0, e ? this.emulatedDevicesList.saveCustomDevices() : this.emulatedDevicesList.saveStandardDevices(), this.muteUpdate = !1;
	}
	addCustomDevice() {
		let e = new d();
		e.deviceScaleFactor = 0, e.horizontal.width = 700, e.horizontal.height = 400, e.vertical.width = 400, e.vertical.height = 700, this.#e.addNewItem(this.emulatedDevicesList.custom().length, e);
	}
	toNumericInputValue(e) {
		return e ? String(e) : "";
	}
	renderItem(e, t) {
		let n = document.createElement("label");
		n.classList.add("devices-list-item");
		let r = n.createChild("input", "devices-list-checkbox");
		r.type = "checkbox", r.checked = e.show(), r.addEventListener("click", a.bind(this), !1), r.setAttribute("jslog", `${o().track({ click: !0 })}`);
		let i = document.createElement("span");
		return i.classList.add("device-name"), i.appendChild(document.createTextNode(e.title)), n.appendChild(i), n;
		function a(n) {
			let i = r.checked;
			e.setShow(i), this.muteAndSaveDeviceList(t), n.consume();
		}
	}
	removeItemRequested(e) {
		this.emulatedDevicesList.removeCustomDevice(e);
	}
	commitEdit(e, t, n) {
		e.title = t.control("title").value.trim(), e.vertical.width = t.control("width").value ? parseInt(t.control("width").value, 10) : 0, e.vertical.height = t.control("height").value ? parseInt(t.control("height").value, 10) : 0, e.horizontal.width = e.vertical.height, e.horizontal.height = e.vertical.width, e.deviceScaleFactor = t.control("scale").value ? parseFloat(t.control("scale").value) : 0, e.userAgent = t.control("user-agent").value, e.modes = [], e.modes.push({
			title: "",
			orientation: h,
			insets: new g(0, 0, 0, 0),
			image: null
		}), e.modes.push({
			title: "",
			orientation: f,
			insets: new g(0, 0, 0, 0),
			image: null
		}), e.capabilities = [];
		let r = t.control("ua-type").value;
		(r === m.MOBILE || r === m.MOBILE_NO_TOUCH) && e.capabilities.push(_.MOBILE), (r === m.MOBILE || r === m.DESKTOP_TOUCH) && e.capabilities.push(_.TOUCH);
		let i = t.control("ua-metadata").value.metaData, a = e.userAgent.trim().length > 0;
		e.userAgentMetadata = null, a && i && (e.userAgentMetadata = {
			...i,
			mobile: r === m.MOBILE || r === m.MOBILE_NO_TOUCH
		}), n ? this.emulatedDevicesList.addCustomDevice(e) : this.emulatedDevicesList.saveCustomDevices(), this.addCustomButton.scrollIntoViewIfNeeded(), this.addCustomButton.focus(), this.ariaSuccessMessageElement.setAttribute("aria-label", T(C.deviceAddedOrUpdated, { PH1: e.title }));
	}
	beginEdit(e) {
		let t = this.createEditor();
		t.control("title").value = e.title, t.control("width").value = this.toNumericInputValue(e.vertical.width), t.control("height").value = this.toNumericInputValue(e.vertical.height), t.control("scale").value = this.toNumericInputValue(e.deviceScaleFactor), t.control("user-agent").value = e.userAgent;
		let n;
		return n = e.mobile() ? e.touch() ? m.MOBILE : m.MOBILE_NO_TOUCH : e.touch() ? m.DESKTOP_TOUCH : m.DESKTOP, t.control("ua-type").value = n, t.control("ua-metadata").value = { metaData: e.userAgentMetadata || void 0 }, t;
	}
	createEditor() {
		if (this.editor) return this.editor;
		let e = new l();
		this.editor = e;
		let t = e.contentElement(), n = t.createChild("div", "devices-edit-fields");
		u(n.createChild("b"), T(C.device));
		let r = e.createInput("title", "text", T(C.deviceName), g);
		n.createChild("div", "hbox").appendChild(r), r.id = "custom-device-name-field";
		let i = n.createChild("div", "hbox");
		i.appendChild(e.createInput("width", "text", T(C.width), _)), i.appendChild(e.createInput("height", "text", T(C.height), y));
		let a = e.createInput("scale", "text", T(C.devicePixelRatio), x);
		a.classList.add("device-edit-fixed"), i.appendChild(a);
		let o = t.createChild("div", "devices-edit-fields");
		u(o.createChild("b"), T(C.userAgentString));
		let s = o.createChild("div", "hbox");
		s.appendChild(e.createInput("user-agent", "text", T(C.userAgentString), h));
		let c = [
			m.MOBILE,
			m.MOBILE_NO_TOUCH,
			m.DESKTOP,
			m.DESKTOP_TOUCH
		], d = e.createSelect("ua-type", c, () => ({ valid: !0 }), T(C.userAgentType));
		d.classList.add("device-edit-fixed"), s.appendChild(d);
		let f = e.createCustomControl("ua-metadata", b, p);
		return f.value = {}, f.addEventListener("clienthintschange", () => e.requestValidation(), !1), t.appendChild(f), e;
		function p() {
			return f.validate();
		}
		function h(e, t, n) {
			return n.value.trim().length > 0 ? { valid: !0 } : {
				valid: !1,
				errorMessage: T(C.userAgentStringCannotBeEmpty)
			};
		}
		function g(e, t, n) {
			let r = !1, i, a = n.value.trim();
			return a.length >= 50 ? i = T(C.deviceNameMustBeLessThanS, { PH1: 50 }) : a.length === 0 ? i = T(C.deviceNameCannotBeEmpty) : r = !0, {
				valid: r,
				errorMessage: i
			};
		}
		function _(e, t, n) {
			return v.widthValidator(n.value);
		}
		function y(e, t, n) {
			return v.heightValidator(n.value);
		}
		function x(e, t, n) {
			return v.scaleValidator(n.value);
		}
	}
};
//#endregion
export { S as DevicesSettingsTab };
