import { Fo as e, Po as t, on as n } from "./legacy-dM_vujv7.js";
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/components/adorners/adorner.css.mjs
var r = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  display: inline-flex;\n}\n\n:host(.hidden) {\n  display: none;\n}\n\nslot {\n  display: inline-flex;\n  box-sizing: border-box;\n  height: 14px;\n  line-height: 13px;\n  padding: 0 6px;\n  font-size: var(--override-adorner-font-size, 8.5px);\n  color: var(--override-adorner-text-color, var(--sys-color-primary));\n  background-color: var(--override-adorner-background-color, var(--sys-color-cdt-base-container));\n  border: 1px solid var(--override-adorner-border-color, var(--sys-color-tonal-outline));\n  border-radius: 10px;\n  position: relative;\n\n  &:hover::after,\n  &:active::before {\n    content: \"\";\n    height: 100%;\n    width: 100%;\n    border-radius: inherit;\n    position: absolute;\n    top: 0;\n    left: 0;\n  }\n\n  &:hover::after {\n    background-color: var(--sys-color-state-hover-on-subtle);\n  }\n\n  &:active::before {\n    background-color: var(--sys-color-state-ripple-neutral-on-subtle);\n  }\n}\n\n:host(:focus-visible) slot {\n  outline: 2px solid var(--sys-color-state-focus-ring);\n  outline-offset: 2px;\n  z-index: 999;\n}\n\n:host([aria-pressed=\"true\"]) slot {\n  color: var(--override-adorner-active-text-color, var(--sys-color-on-primary));\n  background-color: var(--override-adorner-active-background-color, var(--sys-color-primary));\n  border: 1px solid var(--override-adorner-active-background-color, var(--sys-color-primary));\n\n  &:hover::after {\n    background-color: var(--sys-color-state-hover-on-prominent);\n  }\n\n  &:active::before {\n    background-color: var(--sys-color-state-ripple-primary);\n  }\n}\n\n::slotted(*) {\n  height: 10px;\n}\n", i = class extends HTMLElement {
	name = "";
	#e = this.attachShadow({ mode: "open" });
	#t = !1;
	cloneNode(e) {
		let t = n(this, e);
		return t.name = this.name, t.#t = this.#t, t;
	}
	connectedCallback() {
		this.getAttribute("aria-label") || this.setAttribute("aria-label", this.name), this.#r();
	}
	static observedAttributes = ["active", "toggleable"];
	attributeChangedCallback(e, t, n) {
		if (t !== n) switch (e) {
			case "active":
				this.#n(n === "true");
				break;
			case "toggleable": this.#t = n === "true", this.#n(this.getAttribute("active") === "true");
		}
	}
	isActive() {
		return this.getAttribute("aria-pressed") === "true";
	}
	#n(e) {
		if (!this.#t) return;
		let t = e === void 0 ? !this.isActive() : e;
		this.setAttribute("role", "button"), this.setAttribute("aria-pressed", (!!t).toString());
	}
	show() {
		this.classList.remove("hidden");
	}
	hide() {
		this.classList.add("hidden");
	}
	#r() {
		e(t`<style>${r}</style><slot></slot>`, this.#e, { host: this });
	}
};
customElements.define("devtools-adorner", i);
//#endregion
export { i as t };
