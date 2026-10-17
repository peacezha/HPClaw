import { La as e, No as t, _o as n } from "./legacy-dM_vujv7.js";
import { a as r, n as i } from "./code_highlighter-CNBDhX-D.js";
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/components/suggestion_input/suggestionInput.css.mjs
var a = "/*\n * Copyright 2023 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n* {\n  box-sizing: border-box;\n  font-size: inherit;\n  margin: 0;\n  padding: 0;\n}\n\n:host {\n  position: relative;\n}\n\ndevtools-editable-content {\n  background: transparent;\n  border: none;\n  color: var(--override-color-recorder-input, var(--sys-color-on-surface));\n  cursor: text;\n  display: inline-block;\n  line-height: 18px;\n  min-height: 18px;\n  min-width: 0.5em;\n  outline: none;\n  overflow-wrap: anywhere;\n}\n\ndevtools-editable-content:hover,\ndevtools-editable-content:focus {\n  box-shadow: 0 0 0 1px var(--sys-color-divider);\n  border-radius: 2px;\n}\n\ndevtools-editable-content[placeholder]:empty::before {\n  content: attr(placeholder);\n  color: var(--sys-color-on-surface);\n  opacity: 50%;\n}\n\ndevtools-editable-content[placeholder]:empty:focus::before {\n  content: \"\";\n}\n\ndevtools-suggestion-box {\n  position: absolute;\n  display: none;\n}\n\ndevtools-editable-content:focus ~ devtools-suggestion-box {\n  display: block;\n}\n\n.suggestions {\n  background-color: var(--sys-color-cdt-base-container);\n  box-shadow: var(--drop-shadow);\n  min-height: 1em;\n  min-width: 150px;\n  overflow: hidden auto;\n  position: relative;\n  z-index: 100;\n  max-height: 350px;\n}\n\n.suggestions > li {\n  padding: 1px;\n  border: 1px solid transparent;\n  white-space: nowrap;\n  font-family: var(--source-code-font-family);\n  font-size: var(--source-code-font-size);\n  color: var(--sys-color-on-surface);\n}\n\n.suggestions > li:hover {\n  background-color: var(--sys-color-state-hover-on-subtle);\n}\n\n.suggestions > li.selected {\n  background-color: var(--sys-color-primary);\n  color: var(--sys-color-cdt-base-container);\n}\n\n.strikethrough {\n  text-decoration: line-through;\n}\n";
//#endregion
//#region \0@oxc-project+runtime@0.148.0/helpers/esm/decorate.js
function o(e, t, n, r) {
	var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, n) : r, o;
	if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(e, t, n, r);
	else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
	return i > 3 && a && Object.defineProperty(t, n, a), a;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/components/suggestion_input/SuggestionInput.ts
var s = (e, t) => (e % t + t) % t;
function c(e, t = "Assertion failed!") {
	if (!e) throw Error(t);
}
var { html: l, Decorators: u, Directives: d, LitElement: f } = t, { customElement: p, property: m, state: h } = u, { classMap: g } = d, _ = {
	hasChanged(e, t) {
		return JSON.stringify(e) !== JSON.stringify(t);
	},
	attribute: !1
}, v = class extends HTMLElement {
	static get observedAttributes() {
		return ["disabled", "placeholder"];
	}
	set disabled(e) {
		this.contentEditable = String(!e);
	}
	get disabled() {
		return this.contentEditable !== "true";
	}
	set value(e) {
		this.innerText = e, this.#t();
	}
	get value() {
		return this.innerText;
	}
	set mimeType(e) {
		this.#e = e, this.#t();
	}
	get mimeType() {
		return this.#e;
	}
	#e = "";
	constructor() {
		super(), this.contentEditable = "true", this.tabIndex = 0, this.addEventListener("focus", () => {
			this.textContent = this.innerText;
		}), this.addEventListener("blur", this.#t.bind(this));
	}
	#t() {
		this.#e && i(this, this.#e);
	}
	attributeChangedCallback(e, t, n) {
		e === "disabled" && (this.disabled = n !== null);
	}
};
v = o([p("devtools-editable-content")], v);
var y = class e extends Event {
	static eventName = "suggest";
	constructor(t) {
		super(e.eventName), this.suggestion = t;
	}
}, b = class e extends Event {
	static eventName = "suggestioninit";
	listeners;
	constructor(t) {
		super(e.eventName), this.listeners = t;
	}
}, x = (e, t) => e.toLowerCase().startsWith(t.toLowerCase()), S = class extends f {
	#e = [];
	constructor() {
		super(), this.options = [], this.expression = "", this.cursor = 0;
	}
	#t = (e) => {
		if (c(e instanceof KeyboardEvent, "Bound to the wrong event."), this.#e.length > 0) switch (e.key) {
			case "ArrowDown":
				e.stopPropagation(), e.preventDefault(), this.#n(1);
				break;
			case "ArrowUp": e.stopPropagation(), e.preventDefault(), this.#n(-1);
		}
		e.key === "Enter" && (this.#e[this.cursor] && this.#r(this.#e[this.cursor]), e.preventDefault());
	};
	#n(e) {
		this.cursor = s(this.cursor + e, this.#e.length);
	}
	#r(e) {
		this.dispatchEvent(new y(e));
	}
	connectedCallback() {
		super.connectedCallback(), this.dispatchEvent(new b([["keydown", this.#t]]));
	}
	willUpdate(e) {
		e.has("options") && (this.options = Object.freeze([...this.options].sort())), (e.has("expression") || e.has("options")) && (this.cursor = 0, this.#e = this.options.filter((e) => (this.suggestionFilter || x)(e, this.expression)));
	}
	render() {
		if (this.#e.length !== 0) return l`<style>${a}</style><ul class="suggestions">
      ${this.#e.map((t, n) => l`
        <li class=${g({ selected: n === this.cursor })}
            @mousedown=${this.#r.bind(this, t)}
            jslog=${e("suggestion").track({
			click: !0,
			resize: !0
		})}>
          ${t}
        </li>`)}
    </ul>`;
	}
};
o([m(_)], S.prototype, "options", void 0), o([m()], S.prototype, "expression", void 0), o([m()], S.prototype, "suggestionFilter", void 0), o([h()], S.prototype, "cursor", void 0), S = o([p("devtools-suggestion-box")], S);
var C = class extends f {
	static shadowRootOptions = {
		...f.shadowRootOptions,
		delegatesFocus: !0
	};
	constructor() {
		super(), this.options = [], this.expression = "", this.placeholder = "", this.value = "", this.disabled = !1, this.strikethrough = !0, this.mimeType = "", this.autocomplete = !0, this.addEventListener("blur", this.#n);
		let e = n().track({
			keydown: "ArrowUp|ArrowDown|Enter",
			change: !0,
			click: !0
		});
		this.jslogContext && (e = e.context(this.jslogContext)), this.setAttribute("jslog", e.toString());
	}
	#e;
	get #t() {
		if (this.#e) return this.#e;
		let e = this.renderRoot.querySelector("devtools-editable-content");
		if (!e) throw Error("Attempted to query node before rendering.");
		return this.#e = e, e;
	}
	#n = () => {
		window.getSelection()?.removeAllRanges(), this.value = this.#t.value, this.expression = this.#t.value;
	};
	#r = (e) => {
		c(e.target instanceof Node);
		let t = document.createRange();
		t.selectNodeContents(e.target);
		let n = window.getSelection();
		n.removeAllRanges(), n.addRange(t);
	};
	#i = (e) => {
		e.key === "Enter" && e.preventDefault();
	};
	#a = (e) => {
		this.expression = e.target.value;
	};
	#o = (e) => {
		for (let [t, n] of e.listeners) this.addEventListener(t, n);
	};
	#s = (e) => {
		this.#t.value = e.suggestion, setTimeout(this.blur.bind(this), 0);
	};
	willUpdate(e) {
		e.has("value") && (this.expression = this.value);
	}
	render() {
		return l`<style>${a}</style>
      <style>${r}</style>
      <devtools-editable-content
        ?disabled=${this.disabled}
        class=${g({ strikethrough: !this.strikethrough })}
        .enterKeyHint=${"done"}
        .value=${this.value}
        .mimeType=${this.mimeType}
        @focus=${this.#r}
        @input=${this.#a}
        @keydown=${this.#i}
        autocapitalize="off"
        inputmode="text"
        placeholder=${this.placeholder}
        spellcheck="false"
      ></devtools-editable-content>
      <devtools-suggestion-box
        @suggestioninit=${this.#o}
        @suggest=${this.#s}
        .options=${this.options}
        .suggestionFilter=${this.suggestionFilter}
        .expression=${this.autocomplete ? this.expression : ""}
      ></devtools-suggestion-box>`;
	}
};
o([m(_)], C.prototype, "options", void 0), o([m({ type: Boolean })], C.prototype, "autocomplete", void 0), o([m()], C.prototype, "suggestionFilter", void 0), o([h()], C.prototype, "expression", void 0), o([m()], C.prototype, "placeholder", void 0), o([m()], C.prototype, "value", void 0), o([m({ type: Boolean })], C.prototype, "disabled", void 0), o([m({ type: Boolean })], C.prototype, "strikethrough", void 0), o([m()], C.prototype, "mimeType", void 0), o([m()], C.prototype, "jslogContext", void 0), C = o([p("devtools-suggestion-input")], C);
//#endregion
export { o as n, C as t };
