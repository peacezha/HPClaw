import { $ as e, H as t, K as n, W as r } from "./common-DMSVbaSb.js";
import { $i as i, Fo as a, Jn as o, La as s, No as c, Po as l, Qi as u, Vo as d, Wo as ee, Zi as te, Zo as ne, fo as re, ha as f, ii as p, ja as m, ni as h, no as ie, po as ae, qa as oe, so as g, uo as se } from "./legacy-dM_vujv7.js";
import "./platform-D4TUCh2P.js";
import { k as _ } from "./StringUtilities-CMDxNrEc.js";
import { o as v } from "./FormatterActions-D6HaA-6R.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/core/common/SimpleHistoryManager.ts
var ce = class {
	#e;
	#t;
	#n;
	#r;
	constructor(e) {
		this.#e = [], this.#t = -1, this.#n = 0, this.#r = e;
	}
	readOnlyLock() {
		++this.#n;
	}
	releaseReadOnlyLock() {
		--this.#n;
	}
	getPreviousValidIndex() {
		if (this.empty()) return -1;
		let e = this.#t - 1;
		for (; e >= 0 && !this.#e[e].valid();) --e;
		return e < 0 ? -1 : e;
	}
	getNextValidIndex() {
		let e = this.#t + 1;
		for (; e < this.#e.length && !this.#e[e].valid();) ++e;
		return e >= this.#e.length ? -1 : e;
	}
	readOnly() {
		return !!this.#n;
	}
	empty() {
		return !this.#e.length;
	}
	active() {
		return this.empty() ? null : this.#e[this.#t];
	}
	push(e) {
		this.readOnly() || (this.empty() || this.#e.splice(this.#t + 1), this.#e.push(e), this.#e.length > this.#r && this.#e.shift(), this.#t = this.#e.length - 1);
	}
	canRollback() {
		return this.getPreviousValidIndex() >= 0;
	}
	canRollover() {
		return this.getNextValidIndex() >= 0;
	}
	rollback() {
		let e = this.getPreviousValidIndex();
		return e !== -1 && (this.readOnlyLock(), this.#t = e, this.#e[e].reveal(), this.releaseReadOnlyLock(), !0);
	}
	rollover() {
		let e = this.getNextValidIndex();
		return e !== -1 && (this.readOnlyLock(), this.#t = e, this.#e[e].reveal(), this.releaseReadOnlyLock(), !0);
	}
}, le = "/*\n * Copyright 2022 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.highlight-chip-list {\n  min-height: 20px;\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: left;\n  align-items: center;\n  background-color: var(--sys-color-cdt-base-container);\n  margin: 8px 0;\n  gap: 8px;\n  row-gap: 6px;\n}\n\n.highlight-chip {\n  background: var(--sys-color-cdt-base-container);\n  border: 1px solid var(--sys-color-divider);\n  height: 18px;\n  border-radius: 4px;\n  flex: 0 0 auto;\n  max-width: 250px;\n  position: relative;\n  padding: 0 6px;\n}\n\n.highlight-chip:hover {\n  background-color: var(--sys-color-state-hover-on-subtle);\n}\n\n.delete-highlight-container {\n  display: none;\n  height: 100%;\n  position: absolute;\n  right: 0;\n  top: 0;\n  border-radius: 4px;\n  width: 24px;\n  align-items: center;\n  justify-content: center;\n}\n\n.delete-highlight-button {\n  cursor: pointer;\n  width: 13px;\n  height: 13px;\n  border: none;\n  background-color: transparent;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.delete-highlight-button:hover {\n  background-color: var(--sys-color-state-hover-on-subtle);\n  border-radius: 50%;\n}\n\n.jump-to-highlight-button {\n  cursor: pointer;\n  padding: 0;\n  border: none;\n  background: none;\n  height: 100%;\n  align-items: center;\n  max-width: 100%;\n  overflow: hidden;\n}\n\n.delete-highlight-button devtools-icon {\n  width: 13px;\n  height: 13px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 50%;\n}\n\n.source-code {\n  font-family: var(--source-code-font-family);\n  font-size: var(--source-code-font-size);\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  color: var(--sys-color-on-surface);\n}\n\n.value {\n  color: var(--sys-color-token-tag);\n}\n\n.separator {\n  white-space: pre;\n  flex-shrink: 0;\n}\n\n.highlight-chip.focused {\n  outline: 2px solid var(--sys-color-state-focus-ring);\n  outline-offset: 2px;\n}\n\n.highlight-chip:hover > .delete-highlight-container {\n  display: flex;\n  /* To avoid issues with stacking semi-transparent colors, we use a hardcoded solid color here. */\n  /* stylelint-disable-next-line plugin/use_theme_colors */\n  background: linear-gradient(90deg, transparent 0%, rgb(241 243 244) 25%)\n}\n\n.highlight-chip.focused:hover > .delete-highlight-container {\n  /* To avoid issues with stacking semi-transparent colors, we use a hardcoded solid color here. */\n  /* stylelint-disable-next-line plugin/use_theme_colors */\n  background: linear-gradient(90deg, transparent 0%, rgb(231 241 253) 25%);\n}\n\n:host-context(.theme-with-dark-background) .highlight-chip:hover > .delete-highlight-container {\n  display: flex;\n  /* To avoid issues with stacking semi-transparent colors, we use a hardcoded solid color here. */\n  /* stylelint-disable-next-line plugin/use_theme_colors */\n  background: linear-gradient(90deg, transparent 0%, rgb(41 42 45) 25%);\n}\n\n:host-context(.theme-with-dark-background) .highlight-chip.focused:hover > .delete-highlight-container {\n  /* To avoid issues with stacking semi-transparent colors, we use a hardcoded solid color here. */\n  /* stylelint-disable-next-line plugin/use_theme_colors */\n  background: linear-gradient(90deg, transparent 0%, rgb(48 55 68) 25%);\n}\n", y = {
	jumpToAddress: "Jump to this memory",
	deleteHighlight: "Stop highlighting this memory"
}, ue = n("panels/linear_memory_inspector/components/LinearMemoryHighlightChipList.ts", y), b = t.bind(void 0, ue), { classMap: de } = ee, fe = (e, t, n) => {
	a(l`
    <style>${le}</style>
    <div class="highlight-chip-list">
      ${e.highlightInfos.map((t) => pe(t, e))}
    </div>`, n);
};
function pe(e, t) {
	let n = e.name || "<anonymous>", r = e.type, i = e === t.focusedMemoryHighlight;
	return l`
    <div class=${de({
		focused: i,
		"highlight-chip": !0
	})}>
      <button class="jump-to-highlight-button"
              title=${b(y.jumpToAddress)}
              jslog=${f("linear-memory-inspector.jump-to-highlight").track({ click: !0 })}
              @click=${() => t.onJumpToAddress(e.startAddress)}>
        <span class="source-code">
          <span class="value">${n}</span>
          <span class="separator">: </span>
          <span>${r}</span>
        </span>
      </button>
      <div class="delete-highlight-container">
        <button class="delete-highlight-button" title=${b(y.deleteHighlight)}
            jslog=${f("linear-memory-inspector.delete-highlight").track({ click: !0 })}
            @click=${() => t.onDeleteHighlight(e)}>
          <devtools-icon name="cross" class="medium">
          </devtools-icon>
        </button>
      </div>
    </div>`;
}
var me = class extends h {
	#e = [];
	#t;
	#n = (e) => {};
	#r = (e) => {};
	#i;
	constructor(e, t = fe) {
		super(e, { useShadowDom: !0 }), this.#i = t;
	}
	set highlightInfos(e) {
		this.#e = e, this.requestUpdate();
	}
	get highlightInfos() {
		return this.#e;
	}
	set focusedMemoryHighlight(e) {
		this.#t = e, this.requestUpdate();
	}
	get focusedMemoryHighlight() {
		return this.#t;
	}
	set jumpToAddress(e) {
		this.#n = e, this.requestUpdate();
	}
	get jumpToAddress() {
		return this.#n;
	}
	set deleteHighlight(e) {
		this.#r = e, this.requestUpdate();
	}
	get deleteHighlight() {
		return this.#r;
	}
	performUpdate() {
		this.#i({
			highlightInfos: this.#e,
			focusedMemoryHighlight: this.#t,
			onJumpToAddress: this.#n,
			onDeleteHighlight: this.#r
		}, void 0, this.contentElement);
	}
}, he = /^0x[a-fA-F0-9]+$/, ge = /^0$|[1-9]\d*$/;
function x(e) {
	let t = e.number.toString(16).padStart(e.pad, "0").toUpperCase();
	return e.prefix ? "0x" + t : t;
}
function S(e) {
	return x({
		number: e,
		pad: 8,
		prefix: !0
	});
}
function C(e) {
	let t = e.match(he), n = e.match(ge), r;
	return t && t[0].length === e.length ? r = parseInt(e, 16) : n && n[0].length === e.length && (r = parseInt(e, 10)), r;
}
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/linear_memory_inspector/components/linearMemoryViewer.css.mjs
var _e = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  flex: auto;\n  display: flex;\n  min-height: 20px;\n}\n\n.view {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  box-sizing: border-box;\n  background: var(--sys-color-cdt-base-container);\n  outline: none;\n}\n\n.row {\n  display: flex;\n  height: 20px;\n  align-items: center;\n}\n\n.cell {\n  text-align: center;\n  border: 1px solid transparent;\n  border-radius: 2px;\n\n  &.focused-area {\n    background-color: var(--sys-color-tonal-container);\n    color: var(--sys-color-on-tonal-container);\n  }\n\n  &.selected {\n    border-color: var(--sys-color-state-focus-ring);\n    color: var(--sys-color-on-tonal-container);\n    background-color: var(--sys-color-state-focus-select);\n  }\n}\n\n.byte-cell {\n  min-width: 21px;\n  color: var(--sys-color-on-surface);\n}\n\n.byte-group-margin {\n  margin-left: var(--byte-group-margin);\n}\n\n.text-cell {\n  min-width: 14px;\n  color: var(--sys-color-on-surface-subtle);\n}\n\n.address {\n  color: var(--sys-color-state-disabled);\n}\n\n.address.selected {\n  font-weight: bold;\n  color: var(--sys-color-on-surface);\n}\n\n.divider {\n  width: 1px;\n  height: inherit;\n  background-color: var(--sys-color-divider);\n  margin: 0 4px;\n}\n\n.highlight-area {\n  background-color: var(--sys-color-surface-variant);\n}\n", { render: ve, html: w } = c, T = class e extends Event {
	static eventName = "byteselected";
	data;
	constructor(t) {
		super(e.eventName), this.data = t;
	}
}, ye = class e extends Event {
	static eventName = "resize";
	data;
	constructor(t) {
		super(e.eventName), this.data = t;
	}
}, E = 8, D = 4, be = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t = new ResizeObserver(() => requestAnimationFrame(this.#m.bind(this)));
	#n = !1;
	#r = /* @__PURE__ */ new Uint8Array();
	#i = 0;
	#a = 0;
	#o;
	#s;
	#c = 1;
	#l = D;
	#u = !0;
	#d = void 0;
	set data(e) {
		if (e.address < e.memoryOffset || e.address > e.memoryOffset + e.memory.length || e.address < 0) throw Error("Address is out of bounds.");
		if (e.memoryOffset < 0) throw Error("Memory offset has to be greater or equal to zero.");
		this.#r = e.memory, this.#i = e.address, this.#o = e.highlightInfo, this.#s = e.focusedMemoryHighlight, this.#a = e.memoryOffset, this.#u = e.focus, this.#f();
	}
	connectedCallback() {
		this.style.setProperty("--byte-group-margin", `${E}px`);
	}
	disconnectedCallback() {
		this.#n = !1, this.#t.disconnect();
	}
	#f() {
		this.#h(), this.#_(), this.#p(), this.#g();
	}
	#p() {
		if (this.#u) {
			let e = this.#e.querySelector(".view");
			e && e.focus();
		}
	}
	#m() {
		this.#f(), this.dispatchEvent(new ye(this.#l * this.#c));
	}
	#h() {
		if (this.clientWidth === 0 || this.clientHeight === 0 || !this.shadowRoot) {
			this.#l = D, this.#c = 1;
			return;
		}
		let e = this.shadowRoot.querySelector(".byte-cell"), t = this.shadowRoot.querySelector(".text-cell"), n = this.shadowRoot.querySelector(".divider"), r = this.shadowRoot.querySelector(".row"), i = this.shadowRoot.querySelector(".address");
		if (!e || !t || !n || !r || !i) {
			this.#l = D, this.#c = 1;
			return;
		}
		let a = D * (e.getBoundingClientRect().width + t.getBoundingClientRect().width) + E, o = n.getBoundingClientRect().width, s = e.getBoundingClientRect().left - i.getBoundingClientRect().left, c = this.clientWidth - 1 - s - o;
		if (c < a) {
			this.#l = D, this.#c = 1;
			return;
		}
		this.#l = Math.floor(c / a) * D, this.#c = Math.floor(this.clientHeight / r.clientHeight);
	}
	#g() {
		!this.#t || this.#n || (this.#t.observe(this), this.#n = !0);
	}
	#_() {
		let e = ie().track({ keydown: "ArrowUp|ArrowDown|ArrowLeft|ArrowRight|PageUp|PageDown" }).context("linear-memory-inspector.viewer");
		ve(w`
      <style>${_e}</style>
      <div class="view" tabindex="0" @keydown=${this.#v} jslog=${e}>
        ${this.#y()}
      </div>
      `, this.#e, { host: this });
	}
	#v(e) {
		let t = e, n;
		t.code === "ArrowUp" ? n = this.#i - this.#l : t.code === "ArrowDown" ? n = this.#i + this.#l : t.code === "ArrowLeft" ? n = this.#i - 1 : t.code === "ArrowRight" ? n = this.#i + 1 : t.code === "PageUp" ? n = this.#i - this.#l * this.#c : t.code === "PageDown" && (n = this.#i + this.#l * this.#c), n !== void 0 && n !== this.#d && (this.#d = n, this.dispatchEvent(new T(n)));
	}
	#y() {
		let e = [];
		for (let t = 0; t < this.#c; ++t) e.push(this.#b(t));
		return w`${e}`;
	}
	#b(e) {
		let { startIndex: t, endIndex: n } = {
			startIndex: e * this.#l,
			endIndex: (e + 1) * this.#l
		}, r = {
			address: !0,
			selected: Math.floor((this.#i - this.#a) / this.#l) === e
		};
		return w`
    <div class="row">
      <span class=${d(r)}>${x({
			number: t + this.#a,
			pad: 8,
			prefix: !1
		})}</span>
      <span class="divider"></span>
      ${this.#x(t, n)}
      <span class="divider"></span>
      ${this.#S(t, n)}
    </div>
    `;
	}
	#x(e, t) {
		let n = [];
		for (let r = e; r < t; ++r) {
			let t = r + this.#a, i = {
				cell: !0,
				"byte-cell": !0,
				"byte-group-margin": r !== e && (r - e) % D === 0,
				selected: r === this.#i - this.#a,
				"highlight-area": this.#T(t),
				"focused-area": this.#E(t)
			}, a = r < this.#r.length, o = a ? w`${x({
				number: this.#r[r],
				pad: 2,
				prefix: !1
			})}` : "", s = a ? this.#w.bind(this, t) : "", c = g("linear-memory-inspector.byte-cell").track({ click: !0 });
			n.push(w`<span class=${d(i)} @click=${s} jslog=${c}>${o}</span>`);
		}
		return w`${n}`;
	}
	#S(e, t) {
		let n = [];
		for (let r = e; r < t; ++r) {
			let e = r + this.#a, t = this.#T(e), i = this.#E(e), a = {
				cell: !0,
				"text-cell": !0,
				selected: this.#i - this.#a === r,
				"highlight-area": t,
				"focused-area": i
			}, o = r < this.#r.length, s = o ? w`${this.#C(this.#r[r])}` : "", c = o ? this.#w.bind(this, r + this.#a) : "", l = g("linear-memory-inspector.text-cell").track({ click: !0 });
			n.push(w`<span class=${d(a)} @click=${c} jslog=${l}>${s}</span>`);
		}
		return w`${n}`;
	}
	#C(e) {
		return e >= 20 && e <= 127 ? String.fromCharCode(e) : ".";
	}
	#w(e) {
		this.dispatchEvent(new T(e));
	}
	#T(e) {
		return this.#o !== void 0 && this.#o.startAddress <= e && e < this.#o.startAddress + this.#o.size;
	}
	#E(e) {
		return this.#s ? this.#s.startAddress <= e && e < this.#s.startAddress + this.#s.size : !1;
	}
};
customElements.define("devtools-linear-memory-inspector-viewer", be);
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/linear_memory_inspector/components/linearMemoryInspector.css.mjs
var xe = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n@scope to (devtools-widget > *) {\n  :scope {\n    flex: auto;\n    display: flex;\n  }\n\n  * {\n      min-width: unset;\n      box-sizing: content-box;\n  }\n\n  .view {\n    width: 100%;\n    display: flex;\n    flex: 1;\n    flex-direction: column;\n    font-family: var(--monospace-font-family);\n    font-size: var(--monospace-font-size);\n    padding: 9px 12px 9px 7px;\n  }\n\n  devtools-linear-memory-inspector-viewer {\n    justify-content: center;\n  }\n\n  devtools-linear-memory-inspector-navigator + devtools-linear-memory-inspector-viewer {\n    margin-top: 12px;\n  }\n\n  .value-interpreter {\n    display: flex;\n}\n}\n", Se = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.navigator {\n  min-height: 24px;\n  display: flex;\n  flex-wrap: nowrap;\n  justify-content: space-between;\n  overflow: hidden;\n  align-items: center;\n  background-color: var(--sys-color-cdt-base-container);\n  color: var(--sys-color-on-surface);\n}\n\n.navigator-item {\n  display: flex;\n  white-space: nowrap;\n  overflow: hidden;\n}\n\n.address-input {\n  height: var(--sys-size-11);\n  padding: 0 var(--sys-size-5);\n  margin: 0 var(--sys-size-3);\n  text-align: center;\n  align-items: center;\n  outline: none;\n  color: var(--sys-color-on-surface);\n  border: var(--sys-size-1) solid var(--sys-color-neutral-outline);\n  border-radius: var(--sys-shape-corner-extra-small);\n  background: transparent;\n}\n\n.address-input.invalid {\n  color: var(--sys-color-error);\n}\n\n.navigator-button {\n  display: flex;\n  background: transparent;\n  overflow: hidden;\n  border: none;\n  padding: 0;\n  outline: none;\n  justify-content: center;\n  align-items: center;\n}\n\n.navigator-button:disabled devtools-icon {\n  opacity: 50%;\n}\n\n.navigator-button:enabled:hover devtools-icon {\n  color: var(--icon-default-hover);\n}\n\n.navigator-button:enabled:focus devtools-icon {\n  color: var(--icon-default-hover);\n}\n", O = {
	enterAddress: "Enter address",
	goBackInAddressHistory: "Go back in address history",
	goForwardInAddressHistory: "Go forward in address history",
	previousPage: "Previous page",
	nextPage: "Next page",
	refresh: "Refresh"
}, Ce = n("panels/linear_memory_inspector/components/LinearMemoryNavigator.ts", O), k = t.bind(void 0, Ce), { render: we, html: A, Directives: { ifDefined: Te } } = c, j = /* @__PURE__ */ function(e) {
	return e.BACKWARD = "Backward", e.FORWARD = "Forward", e;
}({}), Ee = class e extends Event {
	static eventName = "addressinputchanged";
	data;
	constructor(t, n) {
		super(e.eventName), this.data = {
			address: t,
			mode: n
		};
	}
}, M = class e extends Event {
	static eventName = "pagenavigation";
	data;
	constructor(t) {
		super(e.eventName, {}), this.data = t;
	}
}, N = class e extends Event {
	static eventName = "historynavigation";
	data;
	constructor(t) {
		super(e.eventName, {}), this.data = t;
	}
}, De = class e extends Event {
	static eventName = "refreshrequested";
	constructor() {
		super(e.eventName, {});
	}
}, P = /* @__PURE__ */ function(e) {
	return e.EDIT = "Edit", e.SUBMITTED = "Submitted", e.INVALID_SUBMIT = "InvalidSubmit", e;
}({}), Oe = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t = "0";
	#n = void 0;
	#r = !0;
	#i = !1;
	#a = !1;
	set data(e) {
		this.#t = e.address, this.#n = e.error, this.#r = e.valid, this.#i = e.canGoBackInHistory, this.#a = e.canGoForwardInHistory, this.#o();
		let t = this.#e.querySelector(".address-input");
		t && (e.mode === "Submitted" ? t.blur() : e.mode === "InvalidSubmit" && t.select());
	}
	#o() {
		we(A`
      <style>${Se}</style>
      <div class="navigator">
        <div class="navigator-item">
          ${this.#l({
			icon: "undo",
			title: k(O.goBackInAddressHistory),
			event: new N("Backward"),
			enabled: this.#i,
			jslogContext: "linear-memory-inspector.history-back"
		})}
          ${this.#l({
			icon: "redo",
			title: k(O.goForwardInAddressHistory),
			event: new N("Forward"),
			enabled: this.#a,
			jslogContext: "linear-memory-inspector.history-forward"
		})}
        </div>
        <div class="navigator-item">
          ${this.#l({
			icon: "chevron-left",
			title: k(O.previousPage),
			event: new M("Backward"),
			enabled: !0,
			jslogContext: "linear-memory-inspector.previous-page"
		})}
          ${this.#s()}
          ${this.#l({
			icon: "chevron-right",
			title: k(O.nextPage),
			event: new M("Forward"),
			enabled: !0,
			jslogContext: "linear-memory-inspector.next-page"
		})}
        </div>
        ${this.#l({
			icon: "refresh",
			title: k(O.refresh),
			event: new De(),
			enabled: !0,
			jslogContext: "linear-memory-inspector.refresh"
		})}
      </div>
      `, this.#e, { host: this });
	}
	#s() {
		let e = {
			"address-input": !0,
			invalid: !this.#r
		};
		return A`<input
      class=${d(e)}
      data-input="true"
      .value=${this.#t}
      jslog=${se("linear-memory-inspector.address").track({ change: !0 })}
      title=${Te(this.#r ? k(O.enterAddress) : this.#n)}
      @change=${this.#c.bind(this, "Submitted")}
      @input=${this.#c.bind(this, "Edit")}
    />`;
	}
	#c(e, t) {
		let n = t.target;
		this.dispatchEvent(new Ee(n.value, e));
	}
	#l(e) {
		return A`
      <devtools-button class="navigator-button"
        .data=${{
			variant: i.ICON,
			iconName: e.icon,
			disabled: !e.enabled
		}}
        jslog=${f().track({
			click: !0,
			keydown: "Enter"
		}).context(e.jslogContext)}
        data-button=${e.event.type} title=${e.title}
        @click=${this.dispatchEvent.bind(this, e.event)}
      ></devtools-button>`;
	}
};
customElements.define("devtools-linear-memory-inspector-navigator", Oe);
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/linear_memory_inspector/components/linearMemoryValueInterpreter.css.mjs
var ke = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n@scope to (devtools-widget > *) {\n  :scope {\n    flex: auto;\n    display: flex;\n  }\n\n  .value-interpreter {\n    border: 1px solid var(--sys-color-divider);\n    background-color: var(--sys-color-cdt-base-container);\n    overflow: hidden;\n    width: 400px;\n  }\n\n  .settings-toolbar {\n    min-height: 26px;\n    display: flex;\n    flex-wrap: nowrap;\n    justify-content: space-between;\n    padding-left: var(--sys-size-3);\n    padding-right: var(--sys-size-3);\n    align-items: center;\n  }\n\n  .settings-toolbar-button {\n    padding: 0;\n    width: 20px;\n    height: 20px;\n    border: none;\n    outline: none;\n    background-color: transparent;\n  }\n\n  .settings-toolbar-button.active devtools-icon {\n    color: var(--icon-toggled);\n  }\n\n  .divider {\n    display: block;\n    height: 1px;\n    margin-bottom: 12px;\n    background-color: var(--sys-color-divider);\n  }\n}\n", Ae = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  flex: auto;\n  display: flex;\n}\n\n.value-types {\n  width: 100%;\n  display: grid;\n  grid-template-columns: auto auto 1fr;\n  gap: 4px 24px;\n  min-height: 24px;\n  overflow: hidden;\n  padding: 2px 12px;\n  align-items: baseline;\n  justify-content: start;\n}\n\n.value-type-cell {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n  min-height: 24px;\n}\n\n.value-type-value-with-link {\n  display: flex;\n  align-items: center;\n}\n\n.value-type-cell-no-mode {\n  grid-column: 1 / 3;\n}\n\n.signed-divider {\n  width: 1px;\n  height: 15px;\n  background-color: var(--sys-color-divider);\n  margin: 0 4px;\n}\n\n.selectable-text {\n  user-select: text;\n}\n\n.selectable-text::selection {\n  background-color: var(--sys-color-tonal-container);\n  color: currentcolor;\n}\n", F = { notApplicable: "N/A" }, je = n("panels/linear_memory_inspector/components/ValueInterpreterDisplayUtils.ts", F), I = t.bind(void 0, je), L = /* @__PURE__ */ function(e) {
	return e.INT8 = "Integer 8-bit", e.INT16 = "Integer 16-bit", e.INT32 = "Integer 32-bit", e.INT64 = "Integer 64-bit", e.FLOAT32 = "Float 32-bit", e.FLOAT64 = "Float 64-bit", e.POINTER32 = "Pointer 32-bit", e.POINTER64 = "Pointer 64-bit", e;
}({}), R = /* @__PURE__ */ function(e) {
	return e.LITTLE = "Little Endian", e.BIG = "Big Endian", e;
}({}), z = /* @__PURE__ */ function(e) {
	return e.DECIMAL = "dec", e.HEXADECIMAL = "hex", e.OCTAL = "oct", e.SCIENTIFIC = "sci", e;
}({});
function B() {
	return new Map(Me);
}
var Me = /* @__PURE__ */ new Map([
	["Integer 8-bit", "dec"],
	["Integer 16-bit", "dec"],
	["Integer 32-bit", "dec"],
	["Integer 64-bit", "dec"],
	["Float 32-bit", "dec"],
	["Float 64-bit", "dec"],
	["Pointer 32-bit", "hex"],
	["Pointer 64-bit", "hex"]
]), Ne = [
	"dec",
	"hex",
	"oct",
	"sci"
];
function V(e) {
	return r(e);
}
function H(e, t) {
	switch (e) {
		case "Integer 8-bit":
		case "Integer 16-bit":
		case "Integer 32-bit":
		case "Integer 64-bit": return t === "dec" || t === "hex" || t === "oct";
		case "Float 32-bit":
		case "Float 64-bit": return t === "sci" || t === "dec";
		case "Pointer 32-bit":
		case "Pointer 64-bit": return t === "hex";
		default: return v(e, `Unknown value type: ${e}`);
	}
}
function Pe(e) {
	switch (e) {
		case "Integer 8-bit":
		case "Integer 16-bit":
		case "Integer 32-bit":
		case "Integer 64-bit":
		case "Float 32-bit":
		case "Float 64-bit": return !0;
		default: return !1;
	}
}
function Fe(e, t, n) {
	if (!U(e)) return console.error(`Requesting address of a non-pointer type: ${e}.\n`), NaN;
	try {
		let r = new DataView(t), i = n === "Little Endian";
		return e === "Pointer 32-bit" ? r.getUint32(0, i) : r.getBigUint64(0, i);
	} catch {
		return NaN;
	}
}
function U(e) {
	return e === "Pointer 32-bit" || e === "Pointer 64-bit";
}
function Ie(e) {
	if (!e.mode) return console.error(`No known way of showing value for ${e.type}`), I(F.notApplicable);
	let t = new DataView(e.buffer), n = e.endianness === "Little Endian", r;
	try {
		switch (e.type) {
			case "Integer 8-bit": return r = e.signed ? t.getInt8(0) : t.getUint8(0), G(r, e.mode);
			case "Integer 16-bit": return r = e.signed ? t.getInt16(0, n) : t.getUint16(0, n), G(r, e.mode);
			case "Integer 32-bit": return r = e.signed ? t.getInt32(0, n) : t.getUint32(0, n), G(r, e.mode);
			case "Integer 64-bit": return r = e.signed ? t.getBigInt64(0, n) : t.getBigUint64(0, n), G(r, e.mode);
			case "Float 32-bit": return r = t.getFloat32(0, n), W(r, e.mode);
			case "Float 64-bit": return r = t.getFloat64(0, n), W(r, e.mode);
			case "Pointer 32-bit": return r = t.getUint32(0, n), G(r, "hex");
			case "Pointer 64-bit": return r = t.getBigUint64(0, n), G(r, "hex");
			default: return v(e.type, `Unknown value type: ${e.type}`);
		}
	} catch {
		return I(F.notApplicable);
	}
}
function W(e, t) {
	switch (t) {
		case "dec": return e.toFixed(2).toString();
		case "sci": return e.toExponential(2).toString();
		default: throw Error(`Unknown mode for floats: ${t}.`);
	}
}
function G(e, t) {
	switch (t) {
		case "dec": return e.toString();
		case "hex": return e < 0 ? I(F.notApplicable) : "0x" + e.toString(16).toUpperCase();
		case "oct": return e < 0 ? I(F.notApplicable) : e.toString(8);
		default: throw Error(`Unknown mode for integers: ${t}.`);
	}
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/linear_memory_inspector/components/ValueInterpreterDisplay.ts
var K = {
	unsignedValue: "`Unsigned` value",
	changeValueTypeMode: "Change mode",
	signedValue: "`Signed` value",
	jumpToPointer: "Jump to address",
	addressOutOfRange: "Address out of memory range"
}, Le = n("panels/linear_memory_inspector/components/ValueInterpreterDisplay.ts", K), q = t.bind(void 0, Le), { render: Re, nothing: ze, html: J } = c, Be = Array.from(B().keys()), Ve = (e, t, n) => {
	function a(t, n) {
		return Ie({
			buffer: e.buffer,
			endianness: e.endianness,
			type: n,
			signed: t,
			mode: e.valueTypeModes.get(n)
		});
	}
	let c = a.bind(void 0, !0), l = a.bind(void 0, !1);
	Re(J`
      <style>${o}</style>
      <style>${Ae}</style>
      <div class="value-types">
        ${e.valueTypes.map((t) => {
		let n = U(t) ? Fe(t, e.buffer, e.endianness) : 0, a = Number.isNaN(n) || BigInt(n) >= BigInt(e.memoryLength), o = c(t), u = l(t);
		return Pe(t) ? J`
            <span class="value-type-cell selectable-text">${r(t)}</span>
              <div>
                <select title=${q(K.changeValueTypeMode)}
                  data-mode-settings="true"
                  jslog=${m("linear-memory-inspector.value-type-mode").track({ change: !0 })}
                  @change=${(n) => e.onValueTypeModeChange(t, n.target.value)}>
                    ${Ne.filter((e) => H(t, e)).map((n) => J`
                        <option value=${n} .selected=${e.valueTypeModes.get(t) === n}
                                jslog=${s(n).track({
			click: !0,
			resize: !0
		})}>${r(n)}
                        </option>`)}
                </select>
              </div>
            ${He(o, u, t, e.valueTypeModes.get(t))}` : U(t) ? J`
            <span class="value-type-cell-no-mode value-type-cell selectable-text">${r(t)}</span>
            <div class="value-type-cell">
              <div class="value-type-value-with-link" data-value="true">
              <span class="selectable-text">${u}</span>
                <devtools-button
                  data-jump="true"
                  title=${q(a ? K.addressOutOfRange : K.jumpToPointer)}
                  .disabled=${a}
                  jslog=${f("linear-memory-inspector.jump-to-address").track({ click: !0 })}
                  @click=${() => e.onJumpToAddressClicked(Number(n))}
                  .variant=${i.ICON_TOGGLE}
                  .iconName=${"open-externally"}
                  .size=${te.SMALL}>
                </devtools-button>
              </div>
            </div>` : ze;
	})}
      </div>
    `, n);
};
function He(e, t, n, r) {
	let i = e !== t && r !== z.HEXADECIMAL && r !== z.OCTAL, a = J`<span class="value-type-cell selectable-text"  title=${q(K.unsignedValue)} data-value="true">${t}</span>`;
	if (!i) return a;
	let o = n === L.INT32 || n === L.INT64, s = J`<span class="selectable-text" data-value="true" title=${q(K.signedValue)}>${e}</span>`;
	return o ? J`
        <div class="value-type-cell">
          ${a}
          ${s}
        </div>
        ` : J`
      <div class="value-type-cell" style="flex-direction: row;">
        ${a}
        <span class="signed-divider"></span>
        ${s}
      </div>
    `;
}
var Ue = class extends h {
	#e;
	#t = R.LITTLE;
	#n = /* @__PURE__ */ new ArrayBuffer(0);
	#r = /* @__PURE__ */ new Set();
	#i = B();
	#a = 0;
	#o = () => {};
	#s = () => {};
	constructor(e, t = Ve) {
		super(e), this.#e = t;
	}
	set onValueTypeModeChange(e) {
		this.#o = e, this.performUpdate();
	}
	get onValueTypeModeChange() {
		return this.#o;
	}
	set onJumpToAddressClicked(e) {
		this.#s = e, this.performUpdate();
	}
	get onJumpToAddressClicked() {
		return this.#s;
	}
	get valueTypeModes() {
		return this.#i;
	}
	set valueTypeModes(e) {
		let t = B();
		e.forEach((e, n) => {
			H(n, e) && t.set(n, e);
		}), this.#i = t, this.requestUpdate();
	}
	get valueTypes() {
		return this.#r;
	}
	set valueTypes(e) {
		this.#r = e, this.requestUpdate();
	}
	get buffer() {
		return this.#n;
	}
	set buffer(e) {
		this.#n = e, this.requestUpdate();
	}
	get endianness() {
		return this.#t;
	}
	set endianness(e) {
		this.#t = e, this.requestUpdate();
	}
	get memoryLength() {
		return this.#a;
	}
	set memoryLength(e) {
		this.#a = e, this.requestUpdate();
	}
	performUpdate() {
		let e = Be.filter((e) => this.#r.has(e));
		this.#e({
			buffer: this.#n,
			valueTypes: e,
			endianness: this.#t,
			memoryLength: this.#a,
			valueTypeModes: this.#i,
			onValueTypeModeChange: this.#o,
			onJumpToAddressClicked: this.#s
		}, void 0, this.contentElement);
	}
}, We = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n@scope to (devtools-widget > *) {\n  :scope {\n    flex: auto;\n    display: flex;\n    min-height: 20px;\n  }\n\n  .settings {\n    display: flex;\n    flex-wrap: wrap;\n    margin: 0 12px 12px;\n    gap: 15px 45px;\n  }\n\n  .value-types-selection {\n    display: flex;\n    flex-direction: column;\n  }\n\n  .group {\n    font-weight: bold;\n    margin-bottom: var(--sys-size-6);\n  }\n}\n", { render: Ge, html: Y } = c, Ke = { otherGroup: "Other" }, qe = n("panels/linear_memory_inspector/components/ValueInterpreterSettings.ts", Ke), Je = t.bind(void 0, qe), Ye = /* @__PURE__ */ new Map([
	["Integer", [
		L.INT8,
		L.INT16,
		L.INT32,
		L.INT64
	]],
	["Floating point", [L.FLOAT32, L.FLOAT64]],
	["Other", [L.POINTER32, L.POINTER64]]
]);
function Xe(e) {
	return e === "Other" ? Je(Ke.otherGroup) : e;
}
var Ze = (e, t, n) => {
	Ge(Y`
      <style>${We}</style>
      <div class="settings" jslog=${oe("settings")}>
       ${[...Ye.keys()].map((t) => {
		let n = Ye.get(t) ?? [];
		return Y`
          <div class="value-types-selection">
            <span class="group">${Xe(t)}</span>
            ${n.map((t) => Y`
                <devtools-checkbox
                  title=${V(t)}
                  ?checked=${e.valueTypes.has(t)}
                  @change=${(n) => {
			let r = n.target;
			e.onToggle(t, r.checked);
		}} jslog=${re().track({ change: !0 }).context(_(t))}
                  }>${V(t)}</devtools-checkbox>
         `)}
          </div>
        `;
	})}
      </div>
      `, n);
}, Qe = class extends h {
	#e;
	#t = /* @__PURE__ */ new Set();
	#n = () => {};
	constructor(e, t = Ze) {
		super(e), this.#e = t;
	}
	get valueTypes() {
		return this.#t;
	}
	set valueTypes(e) {
		this.#t = e, this.requestUpdate();
	}
	get onToggle() {
		return this.#n;
	}
	set onToggle(e) {
		this.#n = e, this.requestUpdate();
	}
	performUpdate() {
		let e = {
			valueTypes: this.#t,
			onToggle: this.#n
		};
		this.#e(e, void 0, this.contentElement);
	}
}, X = {
	toggleValueTypeSettings: "Toggle value type settings",
	changeEndianness: "Change `Endianness`"
}, $e = n("panels/linear_memory_inspector/components/LinearMemoryValueInterpreter.ts", X), Z = t.bind(void 0, $e), { render: et, html: Q } = c, { widget: tt } = p;
function nt(e, t) {
	return Q`
    <label data-endianness-setting="true" title=${Z(X.changeEndianness)}>
      <select
        jslog=${m("linear-memory-inspector.endianess").track({ change: !0 })}
        style="border: none;"
        data-endianness="true" @change=${(t) => e(t.target.value)}>
        ${[R.LITTLE, R.BIG].map((e) => Q`<option value=${e} .selected=${t === e}
            jslog=${s(_(e)).track({
		click: !0,
		resize: !0
	})}>${r(e)}</option>`)}
      </select>
    </label>
    `;
}
var rt = (e, t, n) => {
	et(Q`
    <style>${o}</style>
    <style>${ke}</style>
    <div class="value-interpreter">
      <div class="settings-toolbar">
        ${nt(e.onEndiannessChanged, e.endianness)}
        <devtools-button data-settings="true" class="toolbar-button ${e.showSettings ? "" : "disabled"}"
            title=${Z(X.toggleValueTypeSettings)} @click=${e.onSettingsToggle}
            jslog=${ae("linear-memory-inspector.toggle-value-settings").track({ click: !0 })}
            .iconName=${"gear"}
            .toggledIconName=${"gear-filled"}
            .toggleType=${u.PRIMARY}
            .variant=${i.ICON_TOGGLE}
        ></devtools-button>
      </div>
      <span class="divider"></span>
      <div>
        ${e.showSettings ? tt(Qe, {
		valueTypes: e.valueTypes,
		onToggle: e.onValueTypeToggled
	}) : tt(Ue, {
		buffer: e.buffer,
		valueTypes: e.valueTypes,
		endianness: e.endianness,
		valueTypeModes: e.valueTypeModes,
		memoryLength: e.memoryLength,
		onValueTypeModeChange: e.onValueTypeModeChange,
		onJumpToAddressClicked: e.onJumpToAddressClicked
	})}
      </div>
    </div>
  `, n);
}, it = class extends h {
	#e;
	#t = R.LITTLE;
	#n = /* @__PURE__ */ new ArrayBuffer(0);
	#r = /* @__PURE__ */ new Set();
	#i = /* @__PURE__ */ new Map();
	#a = 0;
	#o = !1;
	#s = () => {};
	#c = () => {};
	#l = () => {};
	#u = () => {};
	constructor(e, t = rt) {
		super(e), this.#e = t;
	}
	set buffer(e) {
		this.#n = e, this.requestUpdate();
	}
	get buffer() {
		return this.#n;
	}
	set valueTypes(e) {
		this.#r = e, this.requestUpdate();
	}
	get valueTypes() {
		return this.#r;
	}
	set valueTypeModes(e) {
		this.#i = e, this.requestUpdate();
	}
	get valueTypeModes() {
		return this.#i;
	}
	set endianness(e) {
		this.#t = e, this.requestUpdate();
	}
	get endianness() {
		return this.#t;
	}
	set memoryLength(e) {
		this.#a = e, this.requestUpdate();
	}
	get memoryLength() {
		return this.#a;
	}
	get onValueTypeModeChange() {
		return this.#s;
	}
	set onValueTypeModeChange(e) {
		this.#s = e, this.requestUpdate();
	}
	get onJumpToAddressClicked() {
		return this.#c;
	}
	set onJumpToAddressClicked(e) {
		this.#c = e, this.requestUpdate();
	}
	get onEndiannessChanged() {
		return this.#l;
	}
	set onEndiannessChanged(e) {
		this.#l = e, this.performUpdate();
	}
	get onValueTypeToggled() {
		return this.#u;
	}
	set onValueTypeToggled(e) {
		this.#u = e, this.performUpdate();
	}
	performUpdate() {
		let e = {
			endianness: this.#t,
			buffer: this.#n,
			valueTypes: this.#r,
			valueTypeModes: this.#i,
			memoryLength: this.#a,
			showSettings: this.#o,
			onValueTypeModeChange: this.#s,
			onJumpToAddressClicked: this.#c,
			onEndiannessChanged: this.#l,
			onValueTypeToggled: this.#u,
			onSettingsToggle: this.#d.bind(this)
		};
		this.#e(e, void 0, this.contentElement);
	}
	#d() {
		this.#o = !this.#o, this.requestUpdate();
	}
}, at = { addressHasToBeANumberBetweenSAnd: "Address has to be a number between {PH1} and {PH2}" }, ot = n("panels/linear_memory_inspector/components/LinearMemoryInspector.ts", at), st = t.bind(void 0, ot), { widget: ct } = p, lt = /* @__PURE__ */ function(e) {
	return e.MEMORY_REQUEST = "MemoryRequest", e.ADDRESS_CHANGED = "AddressChanged", e.SETTINGS_CHANGED = "SettingsChanged", e.DELETE_MEMORY_HIGHLIGHT = "DeleteMemoryHighlight", e;
}({}), ut = class {
	#e = 0;
	#t;
	constructor(e, t) {
		if (e < 0) throw Error("Address should be a greater or equal to zero");
		this.#e = e, this.#t = t;
	}
	valid() {
		return !0;
	}
	reveal() {
		this.#t(this.#e);
	}
}, dt = (e, t, n) => {
	let r = e.currentNavigatorMode === P.SUBMITTED ? S(e.address) : e.currentNavigatorAddressLine, i = $(r, e.outerMemoryLength), o = st(at.addressHasToBeANumberBetweenSAnd, {
		PH1: S(0),
		PH2: S(e.outerMemoryLength)
	}), s = i ? void 0 : o, c = e.highlightInfo ? [e.highlightInfo] : [], u = pt(c, e.address);
	a(l`
    <style>${xe}</style>
    <div class="view">
      <devtools-linear-memory-inspector-navigator
        .data=${{
		address: r,
		valid: i,
		mode: e.currentNavigatorMode,
		error: s,
		canGoBackInHistory: e.canGoBackInHistory,
		canGoForwardInHistory: e.canGoForwardInHistory
	}}
        @refreshrequested=${e.onRefreshRequest}
        @addressinputchanged=${e.onAddressChange}
        @pagenavigation=${e.onNavigatePage}
        @historynavigation=${e.onNavigateHistory}></devtools-linear-memory-inspector-navigator>
      ${ct(me, {
		highlightInfos: c,
		focusedMemoryHighlight: u,
		jumpToAddress: (t) => e.onJumpToAddress(t),
		deleteHighlight: e.onDeleteMemoryHighlight
	})}
      <devtools-linear-memory-inspector-viewer
        .data=${{
		memory: e.memorySlice,
		address: e.address,
		memoryOffset: e.viewerStart,
		focus: e.currentNavigatorMode === P.SUBMITTED,
		highlightInfo: e.highlightInfo,
		focusedMemoryHighlight: u
	}}
        @byteselected=${e.onByteSelected}
        @resize=${e.onResize}>
      </devtools-linear-memory-inspector-viewer>
    </div>
    ${e.hideValueInspector ? ne : l`
    <div class="value-interpreter">
      ${ct(it, {
		buffer: e.memory.slice(e.address - e.memoryOffset, e.address + 8).buffer,
		valueTypes: e.valueTypes,
		valueTypeModes: e.valueTypeModes,
		endianness: e.endianness,
		memoryLength: e.outerMemoryLength,
		onValueTypeModeChange: e.onValueTypeModeChanged,
		onJumpToAddressClicked: e.onJumpToAddress,
		onValueTypeToggled: e.onValueTypeToggled,
		onEndiannessChanged: e.onEndiannessChanged
	})}
    </div>`}
    `, n);
};
function ft(e, t, n) {
	let r = Math.floor(e / t) * t;
	return {
		start: r,
		end: Math.min(r + t, n)
	};
}
function $(e, t) {
	let n = C(e);
	return n !== void 0 && n >= 0 && n < t;
}
function pt(e, t) {
	let n;
	for (let r of e) r.startAddress <= t && t < r.startAddress + r.size && (n ? r.size < n.size && (n = r) : n = r);
	return n;
}
var mt = class extends e(h) {
	#e = new ce(10);
	#t = /* @__PURE__ */ new Uint8Array();
	#n = 0;
	#r = 0;
	#i = -1;
	#a;
	#o = P.SUBMITTED;
	#s = `${this.#i}`;
	#c = 4;
	#l = B();
	#u = new Set(this.#l.keys());
	#d = R.LITTLE;
	#f = !1;
	#p;
	constructor(e, t) {
		super(e), this.#p = t ?? dt;
	}
	set memory(e) {
		this.#t = e, this.requestUpdate();
	}
	set memoryOffset(e) {
		this.#n = e, this.requestUpdate();
	}
	set outerMemoryLength(e) {
		this.#r = e, this.requestUpdate();
	}
	set highlightInfo(e) {
		this.#a = e, this.requestUpdate();
	}
	set valueTypeModes(e) {
		this.#l = e, this.requestUpdate();
	}
	set valueTypes(e) {
		this.#u = e, this.requestUpdate();
	}
	set endianness(e) {
		this.#d = e, this.requestUpdate();
	}
	set hideValueInspector(e) {
		this.#f = e, this.requestUpdate();
	}
	get hideValueInspector() {
		return this.#f;
	}
	performUpdate() {
		let { start: e, end: t } = ft(this.#i, this.#c, this.#r);
		if (e < this.#n || t > this.#n + this.#t.length) {
			this.dispatchEventToListeners("MemoryRequest", {
				start: e,
				end: t,
				address: this.#i
			});
			return;
		}
		if (this.#i < this.#n || this.#i > this.#n + this.#t.length || this.#i < 0) throw Error("Address is out of bounds.");
		if (this.#a) {
			if (this.#a.size < 0) throw this.#a = void 0, Error("Object size has to be greater than or equal to zero");
			if (this.#a.startAddress < 0 || this.#a.startAddress >= this.#r) throw this.#a = void 0, Error("Object start address is out of bounds.");
		}
		let n = {
			memory: this.#t,
			address: this.#i,
			memoryOffset: this.#n,
			outerMemoryLength: this.#r,
			valueTypes: this.#u,
			valueTypeModes: this.#l,
			endianness: this.#d,
			highlightInfo: this.#a,
			hideValueInspector: this.#f,
			currentNavigatorMode: this.#o,
			currentNavigatorAddressLine: this.#s,
			canGoBackInHistory: this.#e.canRollback(),
			canGoForwardInHistory: this.#e.canRollover(),
			onRefreshRequest: this.#g.bind(this),
			onAddressChange: this.#b.bind(this),
			onNavigatePage: this.#w.bind(this),
			onNavigateHistory: this.#C.bind(this),
			onJumpToAddress: this.#m.bind(this),
			onDeleteMemoryHighlight: this.#h.bind(this),
			onByteSelected: this.#_.bind(this),
			onResize: this.#E.bind(this),
			onValueTypeToggled: this.#x.bind(this),
			onValueTypeModeChanged: this.#S.bind(this),
			onEndiannessChanged: this.#y.bind(this),
			memorySlice: this.#t.slice(e - this.#n, t - this.#n),
			viewerStart: e
		};
		this.#p(n, {}, this.contentElement);
	}
	#m(e) {
		this.#o = P.SUBMITTED;
		let t = Math.max(0, Math.min(e, this.#r - 1));
		this.#T(t);
	}
	#h(e) {
		this.dispatchEventToListeners("DeleteMemoryHighlight", e);
	}
	#g() {
		let { start: e, end: t } = ft(this.#i, this.#c, this.#r);
		this.dispatchEventToListeners("MemoryRequest", {
			start: e,
			end: t,
			address: this.#i
		});
	}
	#_(e) {
		this.#o = P.SUBMITTED;
		let t = Math.max(0, Math.min(e.data, this.#r - 1));
		this.#T(t);
	}
	#v() {
		return {
			valueTypes: this.#u,
			modes: this.#l,
			endianness: this.#d
		};
	}
	#y(e) {
		this.#d = e, this.dispatchEventToListeners("SettingsChanged", this.#v()), this.requestUpdate();
	}
	#b(e) {
		let { address: t, mode: n } = e.data, r = $(t, this.#r), i = C(t);
		if (this.#s = t, i !== void 0 && r) {
			this.#o = n, this.#T(i);
			return;
		}
		this.#o = n === P.SUBMITTED && !r ? P.INVALID_SUBMIT : P.EDIT, this.requestUpdate();
	}
	#x(e, t) {
		let n = new Set(this.#u);
		t ? n.add(e) : n.delete(e), this.#u = n, this.dispatchEventToListeners("SettingsChanged", this.#v()), this.requestUpdate();
	}
	#S(e, t) {
		let n = new Map(this.#l);
		n.set(e, t), this.#l = n, this.dispatchEventToListeners("SettingsChanged", this.#v()), this.requestUpdate();
	}
	#C(e) {
		return e.data === j.FORWARD ? this.#e.rollover() : this.#e.rollback();
	}
	#w(e) {
		let t = e.data === j.FORWARD ? this.#i + this.#c : this.#i - this.#c, n = Math.max(0, Math.min(t, this.#r - 1));
		this.#T(n);
	}
	#T(e) {
		if (e < 0 || e >= this.#r) {
			console.warn(`Specified address is out of bounds: ${e}`);
			return;
		}
		this.address = e, this.requestUpdate();
	}
	#E(e) {
		this.#c = e.data, this.requestUpdate();
	}
	set address(e) {
		if (this.#i === e) return;
		let t = new ut(e, () => this.#T(e));
		this.#e.push(t), this.#i = e, this.dispatchEventToListeners("AddressChanged", this.#i), this.requestUpdate();
	}
};
//#endregion
export { B as i, mt as n, R as r, lt as t };
