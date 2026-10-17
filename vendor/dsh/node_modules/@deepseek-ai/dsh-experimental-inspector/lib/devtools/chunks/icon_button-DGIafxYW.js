import { Fo as e, Ho as t, No as n, Po as r, Vo as i, Wo as a, Zo as o } from "./legacy-dM_vujv7.js";
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/components/icon_button/fileSourceIcon.css.mjs
var s = "/*\n * Copyright 2024 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  height: var(--sys-size-9);\n  width: var(--sys-size-9);\n\n  devtools-icon {\n    height: 100%;\n    width: 100%;\n  }\n\n  devtools-icon.document {\n    color: var(--override-file-source-icon-color, var(--icon-default));\n  }\n\n  devtools-icon.script,\n  devtools-icon.sm-script,\n  devtools-icon.snippet {\n    color: var(--override-file-source-icon-color, var(--icon-file-script));\n  }\n\n  devtools-icon.stylesheet,\n  devtools-icon.sm-stylesheet {\n    color: var(--override-file-source-icon-color, var(--icon-file-styles));\n  }\n\n  devtools-icon.image,\n  devtools-icon.font {\n    color: var(--override-file-source-icon-color, var(--icon-file-image));\n  }\n\n  devtools-icon.dot::before {\n    content: var(--image-file-empty);\n    width: 35%;\n    height: 35%;\n    border-radius: 50%;\n    outline: var(--sys-size-1) solid var(--icon-gap-focus-selected);\n    top: 60%;\n    left: 55%;\n    position: absolute;\n    z-index: 1;\n  }\n\n  devtools-icon.purple.dot::before {\n    background-color: var(--sys-color-purple-bright);\n  }\n\n  devtools-icon.green.dot::before {\n    background-color: var(--sys-color-green-bright);\n  }\n}\n", { classMap: c } = a, l = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t;
	#n;
	#r;
	#i;
	set data(e) {
		this.#n = e.contentType, this.#r = e.hasDotBadge, this.#i = e.isDotPurple, this.#t = e.iconType, this.#a();
	}
	get data() {
		return {
			iconType: this.#t,
			contentType: this.#n,
			hasDotBadge: this.#r,
			isDotPurple: this.#i
		};
	}
	connectedCallback() {
		this.#a();
	}
	#a() {
		let t = c({
			dot: !!this.#r,
			purple: !!(this.#r && this.#i),
			green: !!(this.#r && !this.#i),
			...this.#n ? { [this.#n]: this.#n } : null
		});
		e(r`
      <style>${s}</style>
      <devtools-icon .name=${this.#t ?? null} class=${t}></devtools-icon>`, this.#e, { host: this });
	}
};
customElements.define("devtools-file-source-icon", l);
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/components/icon_button/iconButton.css.mjs
var u = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  white-space: normal;\n  display: inline-block;\n  margin-right: var(--sys-size-1);\n  margin-left: var(--sys-size-1);\n}\n\n.icon-button {\n  border: none;\n  margin-right: 2px;\n  margin-top: 4px;\n  display: inline-flex;\n  align-items: center;\n  color: inherit;\n  font-size: inherit;\n  font-family: inherit;\n  background-color: inherit;\n  cursor: inherit;\n}\n\n.icon-button.with-click-handler {\n  padding: 0;\n  margin: 0;\n  height: 18px;\n  border-radius: var(--sys-shape-corner-extra-small);\n}\n\n.icon-button.with-click-handler:hover {\n  background-color: var(--sys-color-state-hover-on-subtle);\n}\n\n.icon-button:focus-visible {\n  outline: var(--sys-size-2) solid var(--sys-color-state-focus-ring);\n}\n\n.compact .icon-button-title {\n  display: none;\n}\n\n.icon-button-title {\n  margin-right: var(--sys-size-2);\n\n  + devtools-icon {\n    margin-left: var(--sys-size-3);\n  }\n}\n\n.status-icon {\n  margin-right: var(--sys-size-1);\n  margin-left: var(--sys-size-2);\n}\n\n@media (forced-colors: active) {\n  .icon-button {\n    forced-color-adjust: none;\n    background-color: ButtonFace;\n  }\n\n  .icon-button:focus-visible,\n  .icon-button.with-click-handler:hover {\n    background-color: Highlight;\n    color: HighlightText;\n  }\n}\n", { html: d } = n, f = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t;
	#n = [];
	#r = !1;
	#i = "";
	#a = "";
	#o;
	set data(e) {
		this.#n = e.groups.map((e) => ({ ...e })), this.#t = e.clickHandler, this.#a = e.trailingText ?? "", this.#i = e.leadingText ?? "", this.#o = e.accessibleName, this.#r = !!e.compact, this.#c();
	}
	get data() {
		return {
			groups: this.#n.map((e) => ({ ...e })),
			accessibleName: this.#o,
			clickHandler: this.#t,
			leadingText: this.#i,
			trailingText: this.#a,
			compact: this.#r
		};
	}
	#s(e) {
		this.#t && (e.preventDefault(), this.#t());
	}
	#c() {
		let n = i({
			"icon-button": !0,
			"with-click-handler": !!this.#t,
			compact: this.#r
		}), r = this.#n.filter((e) => e.text !== void 0).filter((e, t) => !this.#r || t === 0);
		e(d`
      <style>${u}</style>
      <button class=${n} @click=${this.#s} aria-label=${t(this.#o)}>
      ${!this.#r && this.#i ? d`<span class="icon-button-title">${this.#i}</span>` : o}
      ${r.map((e) => d`
      <devtools-icon class="status-icon" name=${e.iconName} style="color: ${e.iconColor}; width: ${e.iconWidth || "var(--sys-size-7)"}; height: ${e.iconHeight || "var(--sys-size-7)"}">
      </devtools-icon>
      ${this.#r ? d`<!-- Force line-height for this element --><span>&#8203;</span>` : o}
      <span class="icon-button-title">${e.text}</span>`)}
      </button>
      ${!this.#r && this.#a ? d`<span class="icon-button-title">${this.#a}</span>` : o}
    `, this.#e, { host: this });
	}
};
customElements.define("icon-button", f);
//#endregion
