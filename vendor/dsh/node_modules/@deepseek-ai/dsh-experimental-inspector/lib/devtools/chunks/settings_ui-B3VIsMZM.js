import { D as e, H as t, K as n, c as r } from "./common-DMSVbaSb.js";
import { $i as i, Fo as a, La as o, No as s, Or as c, Po as l, Ur as u, Ut as d, Vo as f, Wo as p, Yf as m, Zi as h, Zo as g, fo as _, in as v, ja as y, pt as b } from "./legacy-dM_vujv7.js";
import "./platform-D4TUCh2P.js";
import { k as x } from "./StringUtilities-CMDxNrEc.js";
import "./common-Bs7hSOUj.js";
import { t as S } from "./checkbox.css-CtBDUlMG.js";
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/components/settings/settingDeprecationWarning.css.mjs
var C = "/*\n * Copyright 2022 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.clickable {\n  cursor: pointer;\n}\n\ndevtools-icon {\n  vertical-align: text-bottom;\n  padding-left: 2px;\n}\n", { html: w } = s, T = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	set data(e) {
		this.#t(e);
	}
	#t({ disabled: t, warning: n, experiment: r }) {
		let i = {
			clickable: !1,
			medium: !0
		}, o;
		t && r && (i.clickable = !0, o = () => {
			e(r);
		}), a(w`
        <style>${C}</style>
        <devtools-icon class=${f(i)} name="info" title=${n} @click=${o}></devtools-icon>`, this.#e, { host: this });
	}
};
customElements.define("devtools-setting-deprecation-warning", T);
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/components/settings/settingCheckbox.css.mjs
var E = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  padding: 0;\n  margin: 0;\n}\n\ninput {\n  height: 12px;\n  width: 12px;\n  min-height: 12px;\n  min-width: 12px;\n  margin: 6px;\n}\n\nlabel {\n  display: inline-flex;\n  align-items: center;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\np {\n  margin: 6px 0;\n}\n\n.disabled-reason {\n  box-sizing: border-box;\n  margin-left: var(--sys-size-2);\n  width: var(--sys-size-9);\n  height: var(--sys-size-9);\n}\n\n.info-icon {\n  cursor: pointer;\n  position: relative;\n  margin-left: var(--sys-size-2);\n  top: var(--sys-size-2);\n  width: var(--sys-size-9);\n  height: var(--sys-size-9);\n}\n\n.link {\n  color: var(--text-link);\n  text-decoration: underline;\n}\n", { html: D, Directives: { ifDefined: O } } = s, k = { learnMore: "Learn more" }, A = n("ui/components/settings/SettingCheckbox.ts", k), j = t.bind(void 0, A), M = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t;
	#n;
	#r;
	set data(e) {
		this.#n && this.#t && this.#t.removeChangeListener(this.#n.listener), this.#t = e.setting, this.#r = e.textOverride, this.#n = this.#t.addChangeListener(() => {
			this.#i();
		}), this.#i();
	}
	icon() {
		if (!this.#t) return;
		if (this.#t.deprecation) return D`<devtools-setting-deprecation-warning .data=${this.#t.deprecation}></devtools-setting-deprecation-warning>`;
		let e = this.#t.learnMore();
		if (e) {
			let t = `${this.#t.name}-documentation`, n = {
				iconName: "info",
				variant: i.ICON,
				size: h.SMALL,
				jslogContext: t
			}, r = e.url;
			if (e.tooltip) {
				let i = `${this.#t.name}-information`;
				return D`
          <devtools-button
            class="info-icon"
            aria-details=${i}
            aria-disabled=true
            accessibleLabel=${e.tooltip()}
            .data=${n}
          ></devtools-button>
          <devtools-tooltip id=${i} variant="rich">
            <span>${e.tooltip()}</span><br />
            ${r ? D`<devtools-link
                  href=${r}
                  class="link"
                  .jslogContext=${t}
                  >${j(k.learnMore)}</devtools-link
                >` : g}
          </devtools-tooltip>
        `;
			}
			if (r) return n.iconName = "help", n.title = j(k.learnMore), D`<devtools-button
          class="info-icon"
          @click=${(e) => {
				m.openInNewTab(r), e.consume();
			}}
          .data=${n}
        ></devtools-button>`;
		}
	}
	get checked() {
		return !this.#t || this.#t.disabledReasons().length > 0 ? !1 : this.#t.get();
	}
	#i() {
		if (!this.#t) throw Error("No \"Setting\" object provided for rendering");
		let e = this.icon(), t = `${this.#t.learnMore() ? this.#t.learnMore()?.tooltip?.() : ""}`, n = this.#t.disabledReasons(), r = n.length ? D`
      <devtools-button class="disabled-reason" .iconName=${"info"} .variant=${i.ICON} .size=${h.SMALL} title=${O(n.join("\n"))} @click=${onclick}></devtools-button>
    ` : g;
		a(D`
      <style>${S}</style>
      <style>${E}</style>
      <p>
        <label title=${t}>
          <input
            type="checkbox"
            .checked=${this.checked}
            ?disabled=${this.#t.disabled()}
            @change=${this.#a}
            jslog=${_().track({ change: !0 }).context(this.#t.name)}
            aria-label=${this.#t.title()}
          />
          ${this.#r || this.#t.title()}${r}
        </label>
        ${e}
      </p>`, this.#e, { host: this });
	}
	#a(e) {
		this.#t?.set(e.target.checked), this.dispatchEvent(new CustomEvent("change", {
			bubbles: !0,
			composed: !1
		}));
	}
};
customElements.define("setting-checkbox", M);
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/legacy/components/settings_ui/SettingsUI.ts
var { createRef: N, ref: P } = p, F = {
	srequiresReload: "*Requires reload",
	settingsChangedReloadDevTools: "Settings changed. To apply, reload DevTools."
}, I = n("ui/legacy/components/settings_ui/SettingsUI.ts", F), L = t.bind(void 0, I);
function R(e, t, n) {
	let r = d.create(e, void 0, void 0, t.name);
	return r.name = e, v(r, t), n && u.install(r, n), r;
}
function z(e, t) {
	let n = e.title(), r = e.options(), i = e.reloadRequired(), { deprecation: a } = e, s = b("labelledControl"), u = N();
	return l`
    <div class=${f({ "chrome-select-label": !!t })}>
      <p class="settings-select">
        <label for=${s}>
          ${n}
          ${t ? l`<p>${t}</p>` : g}
          ${a ? l`<devtools-setting-deprecation-warning .data=${a}></devtools-setting-deprecation-warning>` : g}
        </label>
        <select
          id=${s}
          aria-label=${n}
          .disabled=${e.disabled()}
          @change=${(t) => {
		let n = t.target;
		e.set(r[n.selectedIndex].value), i && (c.instance().displayReloadRequiredWarning(L(F.settingsChangedReloadDevTools)), u.value && u.value.classList.remove("hidden"));
	}}
          jslog=${y().track({ change: !0 }).context(e.name)}
        >
          ${r.map((t) => t.text && typeof t.value == "string" ? l`
                <option
                  value=${t.value}
                  ?selected=${e.get() === t.value}
                  jslog=${o(x(t.value)).track({ click: !0 })}
                >
                  ${t.text}
                </option>
              ` : g)}
        </select>
      </p>
      ${i ? l`
        <p ${P(u)} class="reload-warning hidden" role="alert" aria-live="polite">
          ${L(F.srequiresReload)}
        </p>` : g}
    </div>
  `;
}
var B = function(e, t) {
	switch (e.type()) {
		case r.BOOLEAN: return l`<setting-checkbox .data=${{ setting: e }} @change=${() => {
			e.reloadRequired() && c.instance().displayReloadRequiredWarning(L(F.settingsChangedReloadDevTools));
		}}></setting-checkbox>`;
		case r.ENUM: return z(e, t);
		default: return console.error("Invalid setting type: " + e.type()), g;
	}
}, V = function(e, t) {
	let n = B(e, t);
	if (n === g) return null;
	let r = document.createDocumentFragment();
	return a(n, r), r.firstElementChild;
};
//#endregion
export { R as n, V as t };
