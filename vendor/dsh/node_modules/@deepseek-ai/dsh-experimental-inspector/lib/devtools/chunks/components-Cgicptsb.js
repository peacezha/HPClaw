import { H as e, K as t } from "./common-DMSVbaSb.js";
import { $i as n, Fo as r, No as i, Zo as a, fo as o, no as s, po as ee, ro as c, uo as l } from "./legacy-dM_vujv7.js";
import "./platform-D4TUCh2P.js";
import { k as u } from "./StringUtilities-CMDxNrEc.js";
import { t as d } from "./checkbox.css-CtBDUlMG.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/settings/emulation/utils/StructuredHeaders.ts
var f = /* @__PURE__ */ function(e) {
	return e[e.ERROR = 0] = "ERROR", e[e.PARAM_NAME = 1] = "PARAM_NAME", e[e.PARAMETER = 2] = "PARAMETER", e[e.PARAMETERS = 3] = "PARAMETERS", e[e.ITEM = 4] = "ITEM", e[e.INTEGER = 5] = "INTEGER", e[e.DECIMAL = 6] = "DECIMAL", e[e.STRING = 7] = "STRING", e[e.TOKEN = 8] = "TOKEN", e[e.BINARY = 9] = "BINARY", e[e.BOOLEAN = 10] = "BOOLEAN", e[e.LIST = 11] = "LIST", e[e.INNER_LIST = 12] = "INNER_LIST", e[e.SERIALIZATION_RESULT = 13] = "SERIALIZATION_RESULT", e;
}({}), p = 45, m = 48, h = 57, g = 65, _ = 90, v = 97, y = 122, b = 58, x = 42, S = 95, C = 46, w = 47, T = 43, te = 33, ne = 35, re = 36, ie = 37, ae = 38, oe = 39, se = 94, E = 96, D = 124, O = 126, k = 32, A = 126;
function j(e) {
	return e !== void 0 && e >= m && e <= h;
}
function M(e) {
	return e === void 0 ? !1 : e >= g && e <= _ || e >= v && e <= y;
}
function N(e) {
	return e !== void 0 && e >= v && e <= y;
}
function P(e) {
	if (e === void 0) return !1;
	if (j(e) || M(e)) return !0;
	switch (e) {
		case te:
		case ne:
		case re:
		case ie:
		case ae:
		case oe:
		case x:
		case T:
		case p:
		case C:
		case se:
		case S:
		case E:
		case D:
		case O: return !0;
		default: return !1;
	}
}
function F() {
	return { kind: 0 };
}
function I(e) {
	let t = z(e.value);
	if (t.kind === 0) return t;
	let n = L(e.parameters);
	return n.kind === 0 ? n : {
		kind: 13,
		value: t.value + n.value
	};
}
function L(e) {
	let t = "";
	for (let n of e.items) {
		t += ";";
		let e = R(n.name);
		if (e.kind === 0) return e;
		t += e.value;
		let r = n.value;
		if (r.kind !== 10 || !r.value) {
			t += "=";
			let e = z(r);
			if (e.kind === 0) return e;
			t += e.value;
		}
	}
	return {
		kind: 13,
		value: t
	};
}
function R(e) {
	if (e.value.length === 0) return F();
	let t = e.value.charCodeAt(0);
	if (!N(t) && t !== x) return F();
	for (let t = 1; t < e.value.length; ++t) {
		let n = e.value.charCodeAt(t);
		if (!N(n) && !j(n) && n !== S && n !== p && n !== C && n !== x) return F();
	}
	return {
		kind: 13,
		value: e.value
	};
}
function z(e) {
	return e.kind === 5 ? B(e) : e.kind === 6 ? V(e) : e.kind === 7 ? H(e) : e.kind === 8 ? U(e) : e.kind === 10 ? G(e) : e.kind === 9 ? W(e) : F();
}
function B(e) {
	return e.value < -999999999999999 || e.value > 999999999999999 || !Number.isInteger(e.value) ? F() : {
		kind: 13,
		value: e.value.toString(10)
	};
}
function V(e) {
	throw Error("Unimplemented");
}
function H(e) {
	for (let t = 0; t < e.value.length; ++t) {
		let n = e.value.charCodeAt(t);
		if (n < k || n > A) return F();
	}
	let t = "\"";
	for (let n = 0; n < e.value.length; ++n) {
		let r = e.value[n];
		(r === "\"" || r === "\\") && (t += "\\"), t += r;
	}
	return t += "\"", {
		kind: 13,
		value: t
	};
}
function U(e) {
	if (e.value.length === 0) return F();
	let t = e.value.charCodeAt(0);
	if (!M(t) && t !== x) return F();
	for (let t = 1; t < e.value.length; ++t) {
		let n = e.value.charCodeAt(t);
		if (!P(n) && n !== b && n !== w) return F();
	}
	return {
		kind: 13,
		value: e.value
	};
}
function W(e) {
	throw Error("Unimplemented");
}
function G(e) {
	return {
		kind: 13,
		value: e.value ? "?1" : "?0"
	};
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/settings/emulation/utils/UserAgentMetadata.ts
function K(e, t) {
	return I({
		kind: f.ITEM,
		value: {
			kind: f.STRING,
			value: e
		},
		parameters: {
			kind: f.PARAMETERS,
			items: []
		}
	}).kind === f.ERROR ? {
		valid: !1,
		errorMessage: t
	} : { valid: !0 };
}
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/settings/emulation/components/userAgentClientHintsForm.css.mjs
var ce = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.root {\n  color: var(--sys-color-on-surface);\n  width: 100%;\n}\n\n.tree-title {\n  font-weight: 700;\n  display: flex;\n  align-items: center;\n\n  & > [aria-controls=\"form-container\"] {\n    margin-left: var(--sys-size-2);\n    padding-right: var(--sys-size-3);\n\n    & > [name=\"triangle-right\"],\n    & > [name=\"triangle-down\"] {\n      vertical-align: bottom;\n    }\n\n    &[aria-expanded=\"true\"] > [name=\"triangle-right\"] {\n      display: none;\n    }\n\n    &[aria-expanded=\"false\"] > [name=\"triangle-down\"] {\n      display: none;\n    }\n  }\n}\n\n.form-container {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr auto;\n  align-items: center;\n  gap: 8px 10px;\n  padding: 0 10px;\n}\n\n.full-row {\n  grid-column: 1 / 5;\n}\n\n.form-factors-checkbox-group {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 6px 10px;\n}\n\n.form-factor-checkbox-label {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  white-space: nowrap;\n}\n\nhr.section-separator {\n  grid-column: 1 / 5; /* Ensures the separator spans all columns */\n  border: none;\n  margin-top: 1px;\n}\n\n.half-row {\n  grid-column: span 2;\n}\n\n.mobile-checkbox-container {\n  display: flex;\n}\n\n.device-model-input {\n  grid-column: 1 / 4;\n}\n\n.input-field {\n  color: var(--sys-color-on-surface);\n  padding: 3px 6px;\n  border-radius: 2px;\n  border: 1px solid var(--sys-color-neutral-outline);\n  background-color: var(--sys-color-cdt-base-container);\n  font-size: inherit;\n  height: 18px;\n}\n\n.input-field::placeholder {\n    color: var(--sys-color-on-surface-subtle);\n}\n\n.input-field:focus {\n  border: 1px solid var(--sys-color-state-focus-ring);\n  outline-style: none;\n}\n\n.add-container {\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n}\n\n.add-icon {\n  margin-right: 5px;\n}\n\n.brand-row {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  justify-content: space-between;\n}\n\n.brand-row > input {\n  width: 100%;\n}\n\n.info-icon {\n  margin-left: 5px;\n  margin-right: 1px;\n  height: var(--sys-size-8);\n  width: var(--sys-size-8);\n}\n\n.link,\n.devtools-link {\n  color: var(--sys-color-primary);\n  text-decoration: underline;\n  cursor: pointer;\n  outline-offset: 2px;\n  font-weight: 400;\n}\n\ndevtools-icon + .link {\n  margin-inline-start: 2px;\n}\n\n.hide-container {\n  display: none;\n}\n\n.input-field-label-container {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n\n@media (forced-colors: active) {\n  .input-field {\n    border: 1px solid;\n  }\n\n  .tree-title[aria-disabled=\"true\"] {\n    color: GrayText;\n  }\n}\n", { html: q } = i, J = {
	title: "User agent client hints",
	useragent: "User agent (Sec-CH-UA)",
	fullVersionList: "Full version list (Sec-CH-UA-Full-Version-List)",
	brandProperties: "User agent properties",
	brandName: "Brand",
	brandNameAriaLabel: "Brand {PH1}",
	significantBrandVersionPlaceholder: "Significant version (e.g. 87)",
	brandVersionPlaceholder: "Version (e.g. 87.0.4280.88)",
	brandVersionAriaLabel: "Version {PH1}",
	addBrand: "Add Brand",
	brandUserAgentDelete: "Delete brand from user agent section",
	brandFullVersionListDelete: "Delete brand from full version list",
	formFactorsTitle: "Form Factors (Sec-CH-UA-Form-Factors)",
	formFactorsGroupAriaLabel: "Available Form Factors",
	formFactorDesktop: "Desktop",
	formFactorAutomotive: "Automotive",
	formFactorMobile: "Mobile",
	formFactorTablet: "Tablet",
	formFactorXR: "XR",
	formFactorEInk: "EInk",
	formFactorWatch: "Watch",
	fullBrowserVersion: "Full browser version (Sec-CH-UA-Full-Version)",
	fullBrowserVersionPlaceholder: "Full browser version (e.g. 87.0.4280.88)",
	platformLabel: "Platform (Sec-CH-UA-Platform / Sec-CH-UA-Platform-Version)",
	platformProperties: "Platform properties",
	platformVersion: "Platform version",
	platformPlaceholder: "Platform (e.g. Android)",
	architecture: "Architecture (Sec-CH-UA-Arch)",
	architecturePlaceholder: "Architecture (e.g. x86)",
	deviceProperties: "Device properties",
	deviceModel: "Device model (Sec-CH-UA-Model)",
	mobileCheckboxLabel: "Mobile",
	update: "Update",
	notRepresentable: "Not representable as structured headers string.",
	userAgentClientHintsInfo: "User agent client hints are an alternative to the user agent string that identify the browser and the device in a more structured way with better privacy accounting.",
	addedBrand: "Added brand row",
	deletedBrand: "Deleted brand row",
	learnMore: "Learn more"
}, le = t("panels/settings/emulation/components/UserAgentClientHintsForm.ts", J), Y = e.bind(void 0, le), X = class e extends Event {
	static eventName = "clienthintschange";
	constructor() {
		super(e.eventName);
	}
}, ue = class e extends Event {
	static eventName = "clienthintssubmit";
	detail;
	constructor(t) {
		super(e.eventName), this.detail = { value: t };
	}
}, Z = {
	brands: [{
		brand: "",
		version: ""
	}],
	fullVersionList: [{
		brand: "",
		version: ""
	}],
	fullVersion: "",
	platform: "",
	platformVersion: "",
	architecture: "",
	model: "",
	mobile: !1,
	formFactors: []
}, Q = [
	J.formFactorDesktop,
	J.formFactorAutomotive,
	J.formFactorMobile,
	J.formFactorTablet,
	J.formFactorXR,
	J.formFactorEInk,
	J.formFactorWatch
], $ = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t = !1;
	#n = !1;
	#r = Z;
	#i = !1;
	#a = !1;
	#o = "";
	set value(e) {
		let { metaData: t = Z, showMobileCheckbox: n = !1, showSubmitButton: r = !1 } = e;
		this.#r = {
			...this.#r,
			...t
		}, this.#i = n, this.#a = r, this.#E();
	}
	get value() {
		return { metaData: this.#r };
	}
	set disabled(e) {
		this.#n = e, this.#t = !1, this.#E();
	}
	get disabled() {
		return this.#n;
	}
	#s = (e) => {
		(e.code === "Space" || e.code === "Enter" || e.code === "ArrowLeft" || e.code === "ArrowRight") && (e.consume(!0), this.#c(e.code));
	};
	#c = (e) => {
		this.#n || e === "ArrowLeft" && !this.#t || e === "ArrowRight" && this.#t || (this.#t = !this.#t, this.#E());
	};
	#l = (e, t, n) => {
		let r = this.#r.brands?.map((r, i) => {
			if (i === t) {
				let { brand: t, version: i } = r;
				return n === "brandName" ? {
					brand: e,
					version: i
				} : {
					brand: t,
					version: e
				};
			}
			return r;
		});
		this.#r = {
			...this.#r,
			brands: r
		}, this.dispatchEvent(new X()), this.#E();
	};
	#u = (e, t, n) => {
		let r = this.#r.fullVersionList?.map((r, i) => {
			if (i === t) {
				let { brand: t, version: i } = r;
				return n === "brandName" ? {
					brand: e,
					version: i
				} : {
					brand: t,
					version: e
				};
			}
			return r;
		});
		this.#r = {
			...this.#r,
			fullVersionList: r
		}, this.dispatchEvent(new X()), this.#E();
	};
	#d = (e) => {
		let { brands: t = [] } = this.#r;
		t.splice(e, 1), this.#r = {
			...this.#r,
			brands: t
		}, this.dispatchEvent(new X()), this.#o = Y(J.deletedBrand), this.#E();
		let n = this.shadowRoot?.getElementById(`ua-brand-${e + 1}-input`);
		n ||= this.shadowRoot?.getElementById("add-brand-button"), n?.focus();
	};
	#f = (e) => {
		let { fullVersionList: t = [] } = this.#r;
		t.splice(e, 1), this.#r = {
			...this.#r,
			fullVersionList: t
		}, this.dispatchEvent(new X()), this.#o = Y(J.deletedBrand), this.#E();
		let n = this.shadowRoot?.getElementById(`fvl-brand-${e + 1}-input`);
		n ||= this.shadowRoot?.getElementById("add-fvl-brand-button"), n?.focus();
	};
	#p = () => {
		let { brands: e } = this.#r;
		this.#r = {
			...this.#r,
			brands: [...Array.isArray(e) ? e : [], {
				brand: "",
				version: ""
			}]
		}, this.dispatchEvent(new X()), this.#o = Y(J.addedBrand), this.#E();
		let t = this.shadowRoot?.querySelectorAll(".ua-brand-name-input");
		if (t) {
			let e = Array.from(t).pop();
			e && e.focus();
		}
	};
	#m = (e) => {
		(e.code === "Space" || e.code === "Enter") && (e.preventDefault(), this.#p());
	};
	#h = () => {
		let { fullVersionList: e } = this.#r;
		this.#r = {
			...this.#r,
			fullVersionList: [...Array.isArray(e) ? e : [], {
				brand: "",
				version: ""
			}]
		}, this.dispatchEvent(new X()), this.#o = Y(J.addedBrand), this.#E();
		let t = this.shadowRoot?.querySelectorAll(".fvl-brand-name-input");
		if (t) {
			let e = Array.from(t).pop();
			e && e.focus();
		}
	};
	#g = (e) => {
		(e.code === "Space" || e.code === "Enter") && (e.preventDefault(), this.#h());
	};
	#_ = (e, t) => {
		let n = [...this.#r.formFactors || []];
		t ? n.includes(e) || n.push(e) : n = n.filter((t) => t !== e), this.#r = {
			...this.#r,
			formFactors: n
		}, this.dispatchEvent(new X()), this.#E();
	};
	#v = (e, t) => {
		e in this.#r && (this.#r = {
			...this.#r,
			[e]: t
		}, this.#E()), this.dispatchEvent(new X());
	};
	#y = (e) => {
		e.preventDefault(), this.#a && (this.dispatchEvent(new ue(this.#r)), this.#E());
	};
	#b(e, t, n, r) {
		return q`
      <label class="full-row label input-field-label-container">
        ${e}
        <input
          class="input-field"
          type="text"
          @input=${(e) => {
			let t = e.target.value;
			this.#v(r, t);
		}}
          .value=${n}
          placeholder=${t}
          jslog=${l().track({ change: !0 }).context(u(r))}
          />
      </label>
    `;
	}
	#x() {
		let { platform: e, platformVersion: t } = this.#r;
		return q`
      <span class="full-row label">${Y(J.platformLabel)}</span>
      <div class="full-row brand-row" aria-label=${Y(J.platformProperties)} role="group">
        <input
          class="input-field half-row"
          type="text"
          @input=${(e) => {
			let t = e.target.value;
			this.#v("platform", t);
		}}
          .value=${e}
          placeholder=${Y(J.platformPlaceholder)}
          aria-label=${Y(J.platformLabel)}
          jslog=${l("platform").track({ change: !0 })}
        />
        <input
          class="input-field half-row"
          type="text"
          @input=${(e) => {
			let t = e.target.value;
			this.#v("platformVersion", t);
		}}
          .value=${t}
          placeholder=${Y(J.platformVersion)}
          aria-label=${Y(J.platformVersion)}
          jslog=${l("platform-version").track({ change: !0 })}
        />
      </div>
    `;
	}
	#S() {
		let { model: e, mobile: t } = this.#r, n = (e) => {
			let t = e.target.value;
			this.#v("model", t);
		}, r = this.#i ? q`
      <label class="mobile-checkbox-container">
        <input type="checkbox" @input=${(e) => {
			let t = e.target.checked;
			this.#v("mobile", t);
		}} .checked=${t}
          jslog=${o("mobile").track({ click: !0 })}
        />
        ${Y(J.mobileCheckboxLabel)}
      </label>
    ` : a;
		return q`
      <span class="full-row label">${Y(J.deviceModel)}</span>
      <div class="full-row brand-row" aria-label=${Y(J.deviceProperties)} role="group">
        <input
          class="input-field ${this.#i ? "device-model-input" : "full-row"}"
          type="text"
          @input=${n}
          .value=${e}
          placeholder=${Y(J.deviceModel)}
          jslog=${l("model").track({ change: !0 })}
        />
        ${r}
      </div>
    `;
	}
	#C() {
		let { brands: e = [{
			brand: "",
			version: ""
		}] } = this.#r, t = e.map((e, t) => {
			let { brand: n, version: r } = e, i = () => {
				this.#d(t);
			};
			return q`
        <div class="full-row brand-row" aria-label=${Y(J.brandProperties)} role="group">
          <input
            class="input-field ua-brand-name-input"
            type="text"
            @input=${(e) => {
				let n = e.target.value;
				this.#l(n, t, "brandName");
			}}
            .value=${n}
            id="ua-brand-${t + 1}-input"
            placeholder=${Y(J.brandName)}
            aria-label=${Y(J.brandNameAriaLabel, { PH1: t + 1 })}
            jslog=${l("brand-name").track({ change: !0 })}
          />
          <input
            class="input-field"
            type="text"
            @input=${(e) => {
				let n = e.target.value;
				this.#l(n, t, "brandVersion");
			}}
            .value=${r}
            placeholder=${Y(J.significantBrandVersionPlaceholder)}
            aria-label=${Y(J.brandVersionAriaLabel, { PH1: t + 1 })}
            jslog=${l("brand-version").track({ change: !0 })}
          />
          <devtools-icon name="bin"
            title=${Y(J.brandUserAgentDelete)}
            class="medium delete-icon"
            tabindex="0"
            role="button"
            @click=${i}
            @keypress=${(e) => {
				(e.code === "Space" || e.code === "Enter") && (e.preventDefault(), i());
			}}
            aria-label=${Y(J.brandUserAgentDelete)}
          >
          </devtools-icon>
        </div>
      `;
		});
		return q`
      <span class="full-row label">${Y(J.useragent)}</span>
      ${t}
      <div
        class="add-container full-row"
        role="button"
        tabindex="0"
        id="add-brand-button"
        aria-label=${Y(J.addBrand)}
        @click=${this.#p}
        @keypress=${this.#m}
      >
        <devtools-icon
          aria-hidden="true" name="plus" class="medium">
        </devtools-icon>
        ${Y(J.addBrand)}
      </div>
    `;
	}
	#w() {
		let { fullVersionList: e = [{
			brand: "",
			version: ""
		}] } = this.#r, t = e.map((e, t) => {
			let { brand: n, version: r } = e, i = () => {
				this.#f(t);
			};
			return q`
        <div
          class="full-row brand-row"
          aria-label=${Y(J.brandProperties)}
          jslog=${s("full-version")}
          role="group">
          <input
            class="input-field fvl-brand-name-input"
            type="text"
            @input=${(e) => {
				let n = e.target.value;
				this.#u(n, t, "brandName");
			}}
            .value=${n}
            id="fvl-brand-${t + 1}-input"
            placeholder=${Y(J.brandName)}
            aria-label=${Y(J.brandNameAriaLabel, { PH1: t + 1 })}
            jslog=${l("brand-name").track({ change: !0 })}
          />
          <input
            class="input-field"
            type="text"
            @input=${(e) => {
				let n = e.target.value;
				this.#u(n, t, "brandVersion");
			}}
            .value=${r}
            placeholder=${Y(J.brandVersionPlaceholder)}
            aria-label=${Y(J.brandVersionAriaLabel, { PH1: t + 1 })}
            jslog=${l("brand-version").track({ change: !0 })}
          />
          <devtools-icon name="bin" 
            title=${Y(J.brandFullVersionListDelete)}
            class="medium delete-icon"
            tabindex="0"
            role="button"
            @click=${i}
            @keypress=${(e) => {
				(e.code === "Space" || e.code === "Enter") && (e.preventDefault(), i());
			}}
            aria-label=${Y(J.brandFullVersionListDelete)}
          >
          </devtools-icon>
        </div>
      `;
		});
		return q`
      <span class="full-row label">${Y(J.fullVersionList)}</span>
      ${t}
      <div
        class="add-container full-row"
        role="button"
        tabindex="0"
        id="add-fvl-brand-button"
        aria-label=${Y(J.addBrand)}
        @click=${this.#h}
        @keypress=${this.#g}
      >
        <devtools-icon name="plus" class="medium"
          aria-hidden="true">
        </devtools-icon>
        ${Y(J.addBrand)}
      </div>
    `;
	}
	#T() {
		let e = Q.map((e) => {
			let t = this.#r.formFactors?.includes(e) || !1, n = Y(J[`formFactor${e}`]);
			return q`
        <label class="form-factor-checkbox-label">
          <input
            type="checkbox"
            .checked=${t}
            value=${e}
            jslog=${o(u(e)).track({ click: !0 })}
            @change=${(t) => this.#_(e, t.target.checked)}
          />
          ${n}
        </label>
      `;
		});
		return q`
      <span class="full-row label" jslog=${c("form-factors")}>
        ${Y(J.formFactorsTitle)}
      </span>
      <div class="full-row form-factors-checkbox-group" role="group" aria-label=${Y(J.formFactorsGroupAriaLabel)}>
        ${e}
      </div>
    `;
	}
	#E() {
		let { fullVersion: e, architecture: t } = this.#r, i = this.#C(), o = this.#w(), s = this.#b(Y(J.fullBrowserVersion), Y(J.fullBrowserVersionPlaceholder), e || "", "fullVersion"), c = this.#T(), l = this.#x(), u = this.#b(Y(J.architecture), Y(J.architecturePlaceholder), t, "architecture"), f = this.#S(), p = this.#a ? q`
      <devtools-button
        .variant=${n.OUTLINED}
        .type=${"submit"}
      >
        ${Y(J.update)}
      </devtools-button>
    ` : a, m = q`
      <style>${d}</style>
      <style>${ce}</style>
      <section class="root">
        <div class="tree-title">
          <div
            role=button
            @click=${this.#c}
            tabindex=${this.#n ? "-1" : "0"}
            @keydown=${this.#s}
            aria-expanded=${this.#t}
            aria-controls=form-container
            aria-disabled=${this.#n}
            aria-label=${Y(J.title)}
            jslog=${ee().track({ click: !0 })}>
            <devtools-icon name=triangle-right></devtools-icon>
            <devtools-icon name=triangle-down></devtools-icon>
            ${Y(J.title)}
          </div>
          <devtools-icon tabindex=${this.#n ? "-1" : "0"} class=info-icon name=info aria-label=${Y(J.userAgentClientHintsInfo)} title=${Y(J.userAgentClientHintsInfo)}></devtools-icon>
          <devtools-link
           tabindex=${this.#n ? "-1" : "0"}
           href="https://web.dev/user-agent-client-hints/"
           class="link"
           aria-label=${Y(J.learnMore)}
           jslogcontext="learn-more"
          >
            ${Y(J.learnMore)}
          </devtools-link>
        </div>
        <form
          id="form-container"
          class="form-container ${this.#t ? "" : "hide-container"}"
          @submit=${this.#y}
        >
          ${i}
          <hr class="section-separator">
          ${o}
          <hr class="section-separator">
          ${s}
          <hr class="section-separator">
          ${c}
          <hr class="section-separator">
          ${l}
          <hr class="section-separator">
          ${u}
          <hr class="section-separator">
          ${f}
          ${p}
        </form>
        <div aria-live="polite" aria-label=${this.#o}></div>
      </section>
    `;
		r(m, this.#e, { host: this });
	}
	validate = () => {
		for (let [e, t] of Object.entries(this.#r)) if (e === "brands" || e === "fullVersionList") {
			if (!this.#r.brands?.every(({ brand: e, version: t }) => {
				let n = K(e, Y(J.notRepresentable)), r = K(t, Y(J.notRepresentable));
				return n.valid && r.valid;
			})) return {
				valid: !1,
				errorMessage: Y(J.notRepresentable)
			};
		} else if (e === "formFactors") {
			let e = t;
			if (e) for (let t of e) {
				if (!Q.includes(t)) return {
					valid: !1,
					errorMessage: Y(J.notRepresentable) + ` (Invalid form factor: ${t})`
				};
				let e = K(t, Y(J.notRepresentable));
				if (!e.valid) return e;
			}
		} else {
			let e = K(t, Y(J.notRepresentable));
			if (!e.valid) return e;
		}
		return { valid: !0 };
	};
};
customElements.define("devtools-user-agent-client-hints-form", $);
//#endregion
export { $ as t };
