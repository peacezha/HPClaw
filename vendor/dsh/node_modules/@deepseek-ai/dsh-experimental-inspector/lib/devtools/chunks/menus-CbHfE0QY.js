import { n as e, s as t, t as n } from "./dom_extension-BLny9Waw.js";
import { H as r, K as i } from "./common-DMSVbaSb.js";
import { $i as a, Dn as o, Fo as s, No as c, Po as l, Sa as u, So as d, Vo as f, Wa as p, Wo as m, Zi as h, Zo as g, ja as _, ka as ee, ko as te, wo as v, xo as y } from "./legacy-dM_vujv7.js";
import "./platform-D4TUCh2P.js";
import { o as b } from "./FormatterActions-D6HaA-6R.js";
import { n as x, t as S } from "./helpers-CsoC22BH.js";
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/components/dialogs/buttonDialog.css.mjs
var C = "/*\n * Copyright 2024 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  white-space: normal;\n}\n", ne = "/*\n * Copyright 2023 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  --override-transparent: rgb(0 0 0 / 0%);\n\n  display: var(--dialog-display);\n}\n\ndialog::backdrop {\n  background: var(--override-transparent);\n}\n\ndialog {\n  background: transparent;\n  border: none;\n  top: var(--dialog-top);\n  padding: var(--dialog-padding);\n  left: var(--dialog-left);\n  right: var(--dialog-right);\n  margin: var(--dialog-margin);\n  margin-left: var(--dialog-margin-left, 0);\n  margin-bottom: var(--dialog-margin-bottom);\n  animation-name: slideIn;\n  animation-duration: 100ms;\n  animation-timing-function: cubic-bezier(0, 0, 0.3, 1);\n  overflow: hidden;\n  filter: drop-shadow(0 4px 8px rgb(0 0 0 / 15%)) drop-shadow(0 1px 3px rgb(0 0 0 / 30%));\n}\n\ndialog:focus,\ndialog:focus-visible {\n  outline: none;\n}\n\n#content {\n  min-width: var(--content-min-width);\n  background: var(--color-background-elevation-dark-only);\n  border-radius: var(--sys-size-5);\n  max-height: var(--dialog-max-height);\n  max-width: var(--dialog-max-width);\n  overflow: auto;\n  outline: none;\n}\n\n.dialog-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: var(--sys-size-5) var(--sys-size-5) var(--sys-size-5) var(--sys-size-8);\n\n  &:empty {\n    padding: 0;\n    height: var(--sys-size-7);\n  }\n\n  .dialog-header-text {\n    font: var(--sys-typescale-body2-medium);\n    padding-top: var(--sys-size-3);\n  }\n\n  devtools-button {\n    margin: 3px;\n  }\n}\n\n.dialog-content {\n  padding: 0 var(--sys-size-8) var(--sys-size-7) var(--sys-size-8);\n  overflow: hidden;\n}\n\n@keyframes slideIn {\n  from {\n    transform: translateY(var(--dialog-offset-y));\n    opacity: 0%;\n  }\n\n  to {\n    opacity: 100%;\n  }\n}\n", { html: w } = c, T = { close: "Close" }, E = i("ui/components/dialogs/Dialog.ts", T), D = r.bind(void 0, E), O = "HTMLDialogElement" in globalThis, k = 20, A = 20, j = "MODAL", re = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t = this.#A.bind(this);
	#n = this.#D.bind(this);
	#r = {
		origin: j,
		position: "bottom",
		horizontalAlignment: "center",
		getConnectorCustomXPosition: null,
		dialogShownCallback: null,
		closeOnESC: !0,
		closeOnScroll: !0,
		closeButton: !1,
		dialogTitle: "",
		jslogContext: "",
		state: "expanded"
	};
	#i = null;
	#a = !1;
	#o = !1;
	#s = new DOMRect(0, 0, 0, 0);
	#c = new DOMRect(0, 0, 0, 0);
	#l = null;
	#u = null;
	#d = new MutationObserver((e) => {
		this.#r.expectedMutationsSelector && e.every((e) => e.target instanceof Element && e.target.matches(this.#r.expectedMutationsSelector ?? "")) || this.#t();
	});
	#f = new ResizeObserver(this.#h.bind(this));
	#p = o();
	#m = this.#O.bind(this);
	get origin() {
		return this.#r.origin;
	}
	set origin(e) {
		this.#r.origin = e, this.#g();
	}
	set expectedMutationsSelector(e) {
		this.#r.expectedMutationsSelector = e;
	}
	get expectedMutationsSelector() {
		return this.#r.expectedMutationsSelector;
	}
	get position() {
		return this.#r.position;
	}
	set position(e) {
		this.#r.position = e, this.#g();
	}
	get horizontalAlignment() {
		return this.#r.horizontalAlignment;
	}
	set horizontalAlignment(e) {
		this.#r.horizontalAlignment = e, this.#g();
	}
	get bestVerticalPosition() {
		return this.#l;
	}
	get bestHorizontalAlignment() {
		return this.#u;
	}
	get getConnectorCustomXPosition() {
		return this.#r.getConnectorCustomXPosition;
	}
	set getConnectorCustomXPosition(e) {
		this.#r.getConnectorCustomXPosition = e, this.#g();
	}
	get dialogShownCallback() {
		return this.#r.dialogShownCallback;
	}
	get jslogContext() {
		return this.#r.jslogContext;
	}
	set dialogShownCallback(e) {
		this.#r.dialogShownCallback = e, this.#g();
	}
	set closeOnESC(e) {
		this.#r.closeOnESC = e, this.#g();
	}
	set closeOnScroll(e) {
		this.#r.closeOnScroll = e, this.#g();
	}
	set closeButton(e) {
		this.#r.closeButton = e, this.#g();
	}
	set dialogTitle(e) {
		this.#r.dialogTitle = e, this.#g();
	}
	set jslogContext(e) {
		this.#r.jslogContext = e, this.#g();
	}
	set state(e) {
		this.#r.state = e, (this.#r.state === "collapsed" || this.#r.state === "disabled") && this.#t(), this.#g();
	}
	#h() {
		this.#c = this.#_().getBoundingClientRect();
	}
	#g() {
		x(this, this.#N);
	}
	connectedCallback() {
		window.addEventListener("resize", this.#t), this.#d.observe(this.#p, {
			childList: !0,
			subtree: !0
		}), this.#p.addEventListener("wheel", this.#n), this.style.setProperty("--dialog-padding", "0"), this.style.setProperty("--dialog-display", O ? "block" : "none"), this.style.setProperty("--override-dialog-content-border", "10px solid transparent"), this.style.setProperty("--dialog-padding", "3px 5px");
	}
	disconnectedCallback() {
		window.removeEventListener("resize", this.#t), this.#p.removeEventListener("wheel", this.#n), this.#d.disconnect(), this.#f.disconnect();
	}
	#_() {
		if (!this.#i) {
			if (this.#i = this.#e.querySelector("dialog"), !this.#i) throw Error("Dialog not found");
			this.#f.observe(this.#i);
		}
		return this.#i;
	}
	getHitArea() {
		return this.#s;
	}
	async setDialogVisible(e) {
		if (e) {
			await this.#E();
			return;
		}
		this.#j();
	}
	async #v(e) {
		if (e.stopPropagation(), e instanceof PointerEvent && e.pointerType === "") return;
		let t = this.#b(e), n = this.#x(e);
		if (!t) {
			if (e.type === "pointermove") {
				if (n) return;
				this.dispatchEvent(new ie());
				return;
			}
			this.dispatchEvent(new ae());
		}
	}
	#y() {
		this.dispatchEvent(new oe());
	}
	#b(e) {
		let t = this.#c, n = this.bestVerticalPosition === "bottom" ? A : -20;
		this.#r.origin === "MODAL" && (n = 0);
		let r = e.pageX >= t.left && e.pageX <= t.left + t.width, i = e.pageY >= t.top + n && e.pageY <= t.top + t.height + n;
		return r && i;
	}
	#x(e) {
		let t = this.#s, n = e.pageX >= t.left && e.pageX <= t.left + t.width, r = e.pageY >= t.top && e.pageY <= t.top + t.height;
		return n && r;
	}
	#S(e) {
		if (!e || e === "MODAL") throw Error("Dialog origin is null");
		let t = e instanceof Function ? e() : e;
		return t instanceof DOMPoint ? {
			top: t.y,
			bottom: t.y,
			left: t.x,
			right: t.x
		} : t instanceof HTMLElement ? t.getBoundingClientRect() : t;
	}
	#C(e, t) {
		return t.right - e.left > e.right - t.left ? "left" : "right";
	}
	#w(e, t, n) {
		return e.bottom + t > n.height && e.top - t > n.top ? "top" : "bottom";
	}
	#T() {
		this.#r.origin && (this.#a = !0, d(() => {
			let e = this.#p.getBoundingClientRect(), t = e.width, n = e.height, r = e.left, i = e.top, a = e.right;
			if (this.#r.origin === "MODAL") {
				v(() => {
					this.style.setProperty("--dialog-top", `${i}px`), this.style.setProperty("--dialog-left", `${r}px`), this.style.setProperty("--dialog-margin", "auto"), this.style.setProperty("--dialog-margin-left", "auto"), this.style.setProperty("--dialog-margin-bottom", "auto"), this.style.setProperty("--dialog-max-height", `${n - 30}px`), this.style.setProperty("--dialog-max-width", `${t - 30}px`), this.style.setProperty("--dialog-right", `${document.body.clientWidth - a}px`);
				});
				return;
			}
			let o = this.#r.origin, s = this.#S(o), { top: c, right: l, bottom: u, left: d } = s, f = (d + l) / 2, p = l - d + 10, m = document.body.clientWidth, h = this.#r.getConnectorCustomXPosition ? this.#r.getConnectorCustomXPosition() : f;
			v(() => {
				this.style.setProperty("--dialog-top", "0");
				let o = this.#_();
				if (o.style.visibility = "hidden", this.#a && !o.hasAttribute("open")) {
					if (!o.isConnected) return;
					o.showModal(), this.setAttribute("open", ""), this.#a = !1;
				}
				let { width: g, height: _ } = o.getBoundingClientRect();
				if (this.#u = this.#r.horizontalAlignment === "auto" ? this.#C(s, e) : this.#r.horizontalAlignment, this.#l = this.#r.position === "auto" ? this.#w(s, _, e) : this.#r.position, this.#u !== "auto" && this.#l !== "auto") {
					switch (this.#s.height = u - c + 10, this.#s.width = p, this.style.setProperty("--content-min-width", `${h - d + k + 10}px`), this.style.setProperty("--dialog-left", "auto"), this.style.setProperty("--dialog-right", "auto"), this.style.setProperty("--dialog-margin", "0"), this.#u) {
						case "left": {
							let e = Math.max(d, r), t = a - e - 30;
							this.style.setProperty("--dialog-left", `${e}px`), this.#s.x = d, this.style.setProperty("--dialog-max-width", `${t}px`);
							break;
						}
						case "right": {
							let e = m - l, t = m - a, n = Math.max(e, t), i = m - n - r - 30;
							this.#s.x = m - n - p, this.style.setProperty("--dialog-right", `${n}px`), this.style.setProperty("--dialog-max-width", `${i}px`);
							break;
						}
						case "center": {
							let e = Math.min(t - 30, g), n = Math.max(f - e * .5, r);
							n = Math.min(n, a - e), this.style.setProperty("--dialog-left", `${n}px`), this.#s.x = f - p * .5, this.style.setProperty("--dialog-max-width", `${t - 30}px`);
							break;
						}
						default: b(this.#u, `Unknown alignment type: ${this.#u}`);
					}
					switch (this.#l) {
						case "top":
							this.style.setProperty("--dialog-top", "0"), this.style.setProperty("--dialog-margin", "auto"), this.style.setProperty("--dialog-margin-bottom", `${innerHeight - c}px`), this.#s.y = c - 10, this.style.setProperty("--dialog-offset-y", `${A}px`), this.style.setProperty("--dialog-max-height", `${n - (innerHeight - c) - 30}px`);
							break;
						case "bottom":
							this.style.setProperty("--dialog-top", `${u}px`), this.#s.y = c, this.style.setProperty("--dialog-offset-y", `-${A}px`), this.style.setProperty("--dialog-max-height", `${n - (u - i) - 30}px`);
							break;
						default: b(this.#l, `Unknown position type: ${this.#l}`);
					}
					o.close(), o.style.visibility = "";
				}
			});
		}));
	}
	async #E() {
		if (!O || this.#a || this.hasAttribute("open")) return;
		this.#a = !0, this.#T(), await y(), this.#a = !1;
		let e = this.#_();
		e.isConnected && (e.hasAttribute("open") || e.showModal(), this.#r.dialogShownCallback && await this.#r.dialogShownCallback(), this.#h(), document.body.addEventListener("keydown", this.#m));
	}
	#D(e) {
		!this.#b(e) && this.#r.closeOnScroll && this.#_().hasAttribute("open") && (this.#j(), this.dispatchEvent(new M()));
	}
	#O(e) {
		this.#_().hasAttribute("open") && this.#r.closeOnESC && e.key === "Escape" && (e.stopPropagation(), e.preventDefault(), this.#j(), this.dispatchEvent(new M()));
	}
	#k(e) {
		e.stopPropagation(), e.preventDefault(), this.#_().hasAttribute("open") && this.#r.closeOnESC && this.dispatchEvent(new M());
	}
	#A() {
		this.#i?.hasAttribute("open") && this.#p !== document.body && (this.#j(), this.dispatchEvent(new M()));
	}
	#j() {
		this.#o || !this.#_().hasAttribute("open") || (this.#o = !0, v(() => {
			this.#s.width = 0, this.removeAttribute("open"), this.#_().close(), this.#o = !1, document.body.removeEventListener("keydown", this.#m);
		}));
	}
	getDialogBounds() {
		return this.#c;
	}
	#M() {
		return !this.#r.dialogTitle && !this.#r.closeButton ? null : w`
        <span class="dialog-header-text">${this.#r.dialogTitle}</span>
        ${this.#r.closeButton ? w`
          <devtools-button
            @click=${this.#j}
            .data=${{
			variant: a.TOOLBAR,
			iconName: "cross",
			title: D(T.close),
			size: h.SMALL
		}}
            jslog=${u().track({ click: !0 })}
          ></devtools-button>
        ` : g}
    `;
	}
	#N() {
		if (!S(this)) throw Error("Dialog render was not scheduled");
		if (!O) {
			s(w`
        <slot></slot>
      `, this.#e, { host: this });
			return;
		}
		let e = g;
		this.#r.state === "expanded" && (e = w`
    <div id="content">
          <div class="dialog-header">${this.#M()}</div>
          <div class='dialog-content'>
            <slot></slot>
          </div>
    </div>
    `), s(w`
      <style>${ne}</style>
      <dialog @click=${this.#v} @pointermove=${this.#v} @cancel=${this.#k} @animationend=${this.#y}
              jslog=${ee(this.#r.jslogContext).track({
			resize: !0,
			keydown: "Escape"
		}).parent("mapped")}>
        ${e}
      </dialog>
    `, this.#e, { host: this }), te(this.#_(), this.parentElementOrShadowHost());
	}
	setBoundingElementForTesting(e) {
		this.#p = e, this.#g();
	}
};
customElements.define("devtools-dialog", re);
var ie = class e extends Event {
	static eventName = "pointerleftdialog";
	constructor() {
		super(e.eventName, {
			bubbles: !0,
			composed: !0
		});
	}
}, ae = class e extends Event {
	static eventName = "clickoutsidedialog";
	constructor() {
		super(e.eventName, {
			bubbles: !0,
			composed: !0
		});
	}
}, oe = class e extends Event {
	static eventName = "animationended";
	constructor() {
		super(e.eventName, {
			bubbles: !0,
			composed: !0
		});
	}
}, M = class e extends Event {
	static eventName = "forceddialogclose";
	constructor() {
		super(e.eventName, {
			bubbles: !0,
			composed: !0
		});
	}
}, N = /* @__PURE__ */ function(e) {
	return e.TOP = "top", e.BOTTOM = "bottom", e.AUTO = "auto", e;
}({}), P = /* @__PURE__ */ function(e) {
	return e.EXPANDED = "expanded", e.COLLAPSED = "collapsed", e.DISABLED = "disabled", e;
}({}), F = /* @__PURE__ */ function(e) {
	return e.LEFT = "left", e.RIGHT = "right", e.CENTER = "center", e.AUTO = "auto", e;
}({}), { ref: I } = m, L = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t = null;
	#n = null;
	#r = null;
	set data(e) {
		this.#r = e, x(this, this.#o);
	}
	#i() {
		if (!this.#t) throw Error("Dialog not found");
		this.#r?.state === P.DISABLED ? this.#t.setDialogVisible(!1) : this.#t.setDialogVisible(!0), x(this, this.#o);
	}
	#a(e) {
		if (!this.#t) throw Error("Dialog not found");
		this.#t.setDialogVisible(!1), e && e.stopImmediatePropagation(), x(this, this.#o);
	}
	set state(e) {
		this.#r && (this.#r.state = e, x(this, this.#o));
	}
	#o() {
		if (!this.#r) throw Error("ButtonDialog.data is not set");
		if (!S(this)) throw Error("Button dialog render was not scheduled");
		s(l`
      <style>${C}</style>
      <devtools-button
        @click=${this.#i}
        ${I((e) => {
			e instanceof HTMLElement && (this.#n = e);
		})}
        .data=${{
			variant: this.#r.variant,
			iconName: this.#r.iconName,
			disabled: this.#r.disabled,
			title: this.#r.iconTitle,
			jslogContext: this.#r.jslogContext
		}}
      ></devtools-button>
      <devtools-dialog
        @clickoutsidedialog=${this.#a}
        .origin=${() => {
			if (!this.#n) throw Error("Button not found");
			return this.#n;
		}}
        .position=${this.#r.position ?? N.BOTTOM}
        .horizontalAlignment=${this.#r.horizontalAlignment ?? F.RIGHT}
        .closeOnESC=${this.#r.closeOnESC ?? !1}
        .closeOnScroll=${this.#r.closeOnScroll ?? !1}
        .closeButton=${this.#r.closeButton ?? !1}
        .dialogTitle=${this.#r.dialogTitle}
        .jslogContext=${this.#r.jslogContext ?? ""}
        .state=${this.#r.state ?? P.EXPANDED}
        ${I((e) => {
			e instanceof HTMLElement && (this.#t = e);
		})}
      >
        <slot></slot>
      </devtools-dialog>
      `, this.#e, { host: this }), this.#r.openOnRender && (this.#i(), this.#r.openOnRender = !1);
	}
};
customElements.define("devtools-button-dialog", L);
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/components/dialogs/shortcutDialog.css.mjs
var R = "/*\n * Copyright 2023 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.keybinds-list {\n  display: flex;\n  flex-direction: column;\n  /* overwrite default`margin` and `padding` for the <ul> element */\n  margin: 0;\n  padding: 0;\n}\n\n.keybinds-list-item {\n  display: block;\n  min-width: 315px;\n  align-items: baseline;\n  border-bottom: var(--sys-size-1) solid var(--sys-color-divider);\n  padding: var(--sys-size-4) 0;\n  position: relative;\n\n\n  &:last-of-type {\n    border-bottom: unset;\n  }\n\n  .keybinds-list-title {\n    /* Put the list title absolute so it is out the flow, this enables the\n     * shortcuts to sit on the same row as the title */\n    position: absolute;\n    top: var(--sys-size-4);\n    left: 0;\n    /* Put the text vertically central so it aligns with the shortcuts shown  */\n    display: flex;\n    align-items: center;\n    height: var(--sys-size-11); /* IMPORTANT: this has to be the same height as .keybinds-key to maintain text alignment */\n  }\n}\n\n.row-container {\n  display: flex;\n  gap: var(--sys-size-5);\n  align-items: center;\n\n  .keybinds-join-text, .footnote {\n    color: var(--sys-color-on-surface-subtle);\n  }\n\n  .footnote {\n    display: block;\n    height: 15px;\n  }\n}\n\n.shortcuts-for-actions {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  gap: var(--sys-size-3);\n}\n\n.nav-radio-buttons {\n  display: flex;\n  flex-direction: column;\n  border-bottom: var(--sys-size-1) solid var(--sys-color-divider);\n  padding-bottom: var(--sys-size-5);\n\n  & label {\n    display: flex;\n    font: var(--sys-typescale-body3-regular);\n    gap: var(--sys-size-2);\n  }\n\n  input[type=\"radio\"] {\n    margin-left: 0;\n  }\n}\n\n.keybinds-key {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  padding: var(--sys-size-4);\n  min-width: var(--sys-size-11);\n  height: var(--sys-size-11);\n  font: var(--sys-typescale-body5-medium);\n  white-space: nowrap;\n  border-radius: var(--sys-shape-corner-small);\n  background: var(--sys-color-base-container);\n}\n", z = {
	showShortcutTitle: "Show shortcuts",
	dialogTitle: "Keyboard shortcuts"
}, B = i("ui/components/dialogs/ShortcutDialog.ts", z), V = r.bind(void 0, B), H = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t = [];
	#n = !1;
	#r;
	#i = null;
	get data() {
		return {
			shortcuts: this.#t,
			open: this.#n,
			customTitle: this.#r
		};
	}
	set data(e) {
		this.#t = e.shortcuts, e.open && (this.#n = e.open), e.customTitle && (this.#r = e.customTitle), x(this, this.#o);
	}
	prependElement(e) {
		this.#i = e;
	}
	#a(e) {
		return Array.isArray(e) ? l`${e.map((e) => "key" in e ? l`<span class="keybinds-key">${e.key}</span>` : l`<span class="keybinds-join-text">${e.joinText}</span>`)}
    ` : l`<span class="footnote">${e.footnote}</span>`;
	}
	#o() {
		if (!S(this)) throw Error("Shortcut dialog render was not scheduled");
		s(l`
      <style>${R}</style>
      <devtools-button-dialog .data=${{
			openOnRender: this.#n,
			closeButton: !0,
			dialogTitle: this.#r ?? V(z.dialogTitle),
			variant: a.TOOLBAR,
			iconName: "help",
			iconTitle: V(z.showShortcutTitle)
		}}>
        <ul class="keybinds-list">
          ${this.#i ? l`${this.#i}` : g}
          ${this.#t.map((e) => l`
              <li class="keybinds-list-item">
                <div class="keybinds-list-title">${e.title}</div>
                <div class="shortcuts-for-actions">
                  ${e.rows.map((e) => l`<div class="row-container">${this.#a(e)}</div>
                  `)}
                </div>
              </li>`)}
        </ul>
      </devtools-button-dialog>
      `, this.#e, { host: this });
	}
};
customElements.define("devtools-shortcut-dialog", H);
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/components/menus/menu.css.mjs
var U = "/*\n * Copyright 2023 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  border-radius: 3px;\n  width: fit-content;\n  display: flex;\n  align-items: center;\n  background-color: var(--override-menu-background-color, var(--sys-color-cdt-base-container));\n}\n\n:host([has-open-dialog]) {\n  background-color: var(--override-menu-active-background-color, var(--sys-color-neutral-container));\n}\n\n#container {\n  list-style-type: none;\n  margin-top: var(--sys-size-4);\n  padding: 0;\n  width: fit-content;\n  display: block;\n}\n\n#container:focus {\n  outline: none;\n}\n\n@keyframes slideIn {\n  from {\n    transform: var(--translate-dialog);\n    opacity: 0%;\n  }\n\n  to {\n    transform: none;\n    opacity: 100%;\n  }\n}\n", W = "/*\n * Copyright 2023 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.menu-group-label {\n  font-size: 12px;\n  line-height: 16px;\n  position: relative;\n  color: var(--sys-color-token-subtle);\n  display: block;\n}\n", G = "/*\n * Copyright 2023 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.menu-item {\n  padding: var(--sys-size-3) 0 var(--sys-size-3) var(--sys-size-9);\n  font-size: 12px;\n  line-height: 16px;\n  position: relative;\n  display: block;\n  color: var(--sys-color-on-surface);\n}\n\n.menu-item:focus {\n  outline: none;\n}\n\n:host(.no-checkmark) .menu-item {\n  padding-left: 0;\n}\n\n:host(:not(:first-child)) .menu-item {\n  border-top: var(--override-divider-line);\n}\n\n:host-context(devtools-menu-group) .menu-item {\n  padding: var(--sys-size-3) 0 var(--sys-size-3) var(--sys-size-9);\n}\n\n.is-selected-item::before {\n  content: \"\";\n  position: absolute;\n  left: var(--sys-size-2);\n  top: 50%;\n  transform: translateY(-50%);\n  display: inline-block;\n  mask-repeat: no-repeat;\n  mask-position: center;\n  width: calc(var(--menu-checkmark-width) - 10px);\n  height: var(--menu-checkmark-height);\n  mask-image: var(--selected-item-check);\n  background: var(--sys-color-token-subtle);\n}\n\n.is-disabled-item {\n  opacity: 60%;\n}\n\n:host(:hover:not(.prevents-close)) .menu-item::after,\n:host(:focus-visible:not(.prevents-close)) .menu-item::after {\n  content: \"\";\n  height: 100%;\n  width: calc(100% + 2* var(--sys-size-8));\n  border-radius: inherit;\n  position: absolute;\n  top: 0;\n  left: calc(-1 * var(--sys-size-8));\n  background-color: var(--sys-color-state-hover-on-subtle);\n}\n\n:host(:focus) {\n  outline: none;\n}\n", { html: K, Directives: { ref: se } } = c, ce = new URL("../../../Images/checkmark.svg", new URL("ui/components/menus/Menu.js", typeof document < "u" ? document.baseURI : new URL("../../", self.location.href).href).href).toString(), le = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t = null;
	#n = !1;
	#r = {
		origin: null,
		open: !1,
		position: N.AUTO,
		showDivider: !1,
		showSelectedItem: !0,
		horizontalAlignment: F.AUTO,
		getConnectorCustomXPosition: null
	};
	get origin() {
		return this.#r.origin;
	}
	set origin(e) {
		this.#r.origin = e, x(this, this.#_);
	}
	get open() {
		return this.#r.open;
	}
	set open(e) {
		e !== this.open && (this.#r.open = e, this.toggleAttribute("has-open-dialog", this.open), this.#i().setDialogVisible(this.open), x(this, this.#_));
	}
	get position() {
		return this.#r.position;
	}
	set position(e) {
		this.#r.position = e, x(this, this.#_);
	}
	get showDivider() {
		return this.#r.showDivider;
	}
	set showDivider(e) {
		this.#r.showDivider = e, x(this, this.#_);
	}
	get showSelectedItem() {
		return this.#r.showSelectedItem;
	}
	set showSelectedItem(e) {
		this.#r.showSelectedItem = e, x(this, this.#_);
	}
	get horizontalAlignment() {
		return this.#r.horizontalAlignment;
	}
	set horizontalAlignment(e) {
		this.#r.horizontalAlignment = e, x(this, this.#_);
	}
	get getConnectorCustomXPosition() {
		return this.#r.getConnectorCustomXPosition;
	}
	set getConnectorCustomXPosition(e) {
		this.#r.getConnectorCustomXPosition = e, x(this, this.#_);
	}
	connectedCallback() {
		v(() => {
			this.style.setProperty("--selected-item-check", `url(${ce})`), this.style.setProperty("--menu-checkmark-width", this.#r.showSelectedItem ? "26px" : "0px"), this.style.setProperty("--menu-checkmark-height", this.#r.showSelectedItem ? "12px" : "0px");
			let e = this.showDivider ? "1px var(--divider-line) solid" : "none";
			this.style.setProperty("--override-divider-line", e);
		});
	}
	#i() {
		if (!this.#t) throw Error("Dialog not found");
		return this.#t;
	}
	async #a() {
		await v(() => {
			this.setAttribute("has-open-dialog", "has-open-dialog");
			let e = this.#e.querySelector("#container");
			e instanceof HTMLElement && e.focus();
		});
	}
	#o() {
		this.#s().focus();
	}
	#s() {
		let e = (this.#e.querySelector("slot")?.assignedElements())[0];
		if (e instanceof HTMLSlotElement && (e = e?.assignedElements()[0]), e instanceof J && (e = (e.shadowRoot?.querySelector("slot"))?.assignedElements()[0]), e instanceof HTMLElement) return e;
		throw Error("First item not found");
	}
	#c(e) {
		let t = e.composedPath();
		if (e.stopPropagation(), t.find((e) => e instanceof HTMLInputElement)) return;
		let n = e.composedPath().find((e) => e instanceof q);
		n instanceof q && (n.disabled || this.#u(n));
	}
	#l(e) {
		let r = e.key;
		e.stopImmediatePropagation();
		let i = e.target, a = e.composedPath(), o = r === n.DOWN || r === n.RIGHT;
		if (!this.#n && o) {
			this.#o(), this.#n = !0;
			return;
		}
		if (!this.#n && r === n.UP) {
			this.#h(), this.#n = !0;
			return;
		}
		!(i instanceof q) && (i = a.find((e) => e instanceof q), !(i instanceof q)) || (t(r) ? this.#d(r, i) : r === "Home" ? this.#m(i) : r === "End" ? this.#h() : r === "Enter" || e.code === "Space" ? this.#u(i) : r === "Escape" && (e.preventDefault(), this.#g()));
	}
	#u(e) {
		e.value !== "" && (this.dispatchEvent(new Y(e.value)), !e.preventMenuCloseOnSelection && this.#g());
	}
	#d(e, t) {
		let r = t;
		e === n.DOWN ? (r = t.nextElementSibling, r === null && t.parentElement instanceof J && (r = this.#f(t))) : e === n.UP && (r = t.previousElementSibling, r === null && t.parentElement instanceof J && (r = this.#p(t))), r instanceof q && r.focus();
	}
	#f(e) {
		let t = e.parentElement;
		if (!(t instanceof J)) return null;
		let n = t.nextElementSibling;
		if (n instanceof q) return n;
		if (!(n instanceof J)) return null;
		for (let e of n.children) if (e instanceof q) return e;
		return null;
	}
	#p(e) {
		let t = e.parentElement;
		if (!(t instanceof J)) return null;
		let n = t.previousElementSibling;
		return n instanceof q ? n : n instanceof J && n.lastElementChild instanceof q ? n.lastElementChild : null;
	}
	#m(e) {
		let t = e;
		for (e.parentElement instanceof J && (t = e.parentElement); t?.previousElementSibling;) t = t?.previousElementSibling;
		if (t instanceof q) {
			t.focus();
			return;
		}
		for (let e of t.children) if (e instanceof q) {
			e.focus();
			return;
		}
	}
	#h() {
		let e = this.#s(), t = e;
		for (e.parentElement instanceof J && (t = e.parentElement); t?.nextElementSibling;) t = t?.nextElementSibling;
		if (t instanceof q) {
			t.focus();
			return;
		}
		t instanceof J && t.lastElementChild instanceof q && t.lastElementChild.focus();
	}
	#g(e) {
		e && e.stopImmediatePropagation(), this.dispatchEvent(new X()), this.#i().setDialogVisible(!1), this.#n = !1;
	}
	async #_() {
		if (!S(this)) throw Error("Menu render was not scheduled");
		s(K`
      <style>${U}</style>
      <devtools-dialog
        @clickoutsidedialog=${this.#g}
        @forceddialogclose=${this.#g}
        .position=${this.position}
        .origin=${this.origin}
        .dialogShownCallback=${this.#a.bind(this)}
        .horizontalAlignment=${this.horizontalAlignment}
        .getConnectorCustomXPosition=${this.getConnectorCustomXPosition}
        ${se((e) => {
			e instanceof HTMLElement && (this.#t = e);
		})}
        >
        <span id="container" role="menu" tabIndex="0" @keydown=${this.#l} jslog=${p().track({
			resize: !0,
			keydown: "Escape"
		})}>
          <slot @click=${this.#c}>
          </slot>
        </span>
      </devtools-dialog>
    `, this.#e, { host: this });
	}
}, q = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	connectedCallback() {
		this.tabIndex = 0, this.setAttribute("role", "menuitem"), this.setAttribute("aria-selected", String(this.#t.selected));
	}
	#t = {
		value: "",
		preventMenuCloseOnSelection: !1,
		selected: !1,
		disabled: !1
	};
	get preventMenuCloseOnSelection() {
		return this.#t.preventMenuCloseOnSelection;
	}
	set preventMenuCloseOnSelection(e) {
		this.#t.preventMenuCloseOnSelection = e, x(this, this.#n);
	}
	get value() {
		return this.#t.value;
	}
	set value(e) {
		this.#t.value = e, x(this, this.#n);
	}
	get selected() {
		return this.#t.selected;
	}
	set selected(e) {
		this.#t.selected = e, this.setAttribute("aria-selected", String(e)), x(this, this.#n);
	}
	get disabled() {
		return this.#t.disabled;
	}
	set disabled(e) {
		this.#t.disabled = e, x(this, this.#n);
	}
	async #n() {
		if (!S(this)) throw Error("MenuItem render was not scheduled");
		s(K`
      <style>${G}</style>
      <span class=${f({
			"menu-item": !0,
			"is-selected-item": this.selected,
			"is-disabled-item": this.disabled,
			"prevents-close": this.preventMenuCloseOnSelection
		})}
      >
        <slot></slot>
      </span>
    `, this.#e, { host: this });
	}
}, J = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t = { name: null };
	get name() {
		return this.#t.name;
	}
	set name(e) {
		this.#t.name = e, x(this, this.#n);
	}
	async #n() {
		if (!S(this)) throw Error("MenuGroup render was not scheduled");
		s(K`
      <style>${W}</style>
      <span class="menu-group">
        <span class="menu-group-label">${this.name}</span>
        <slot></slot>
      </span>
    `, this.#e, { host: this });
	}
};
customElements.define("devtools-menu", le), customElements.define("devtools-menu-item", q), customElements.define("devtools-menu-group", J);
var Y = class e extends Event {
	itemValue;
	static eventName = "menuitemselected";
	constructor(t) {
		super(e.eventName, {
			bubbles: !0,
			composed: !0
		}), this.itemValue = t;
	}
}, X = class e extends Event {
	static eventName = "menucloserequest";
	constructor() {
		super(e.eventName, {
			bubbles: !0,
			composed: !0
		});
	}
}, ue = "/*\n * Copyright 2023 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  border: 1px solid var(--sys-color-neutral-outline);\n  border-radius: var(--sys-shape-corner-extra-small);\n  width: fit-content;\n  display: flex;\n  align-items: center;\n  background-color: var(--sys-color-cdt-base-container);\n}\n\n:host([has-open-dialog]) {\n  outline: var(--sys-size-2) solid var(--sys-color-state-focus-ring);\n  background:\n    linear-gradient(var(--sys-color-state-hover-on-subtle), var(--sys-color-state-hover-on-subtle)),\n    linear-gradient(var(--sys-color-state-ripple-neutral-on-subtle), var(--sys-color-state-ripple-neutral-on-subtle));\n}\n\nbutton {\n  background: none;\n}\n\n#side-button {\n  border: 1px solid var(--sys-color-neutral-outline);\n  border-radius: 3px 0 0 3px;\n  border-right: none;\n  height: 100%;\n  position: relative;\n  padding: var(--override-select-button-padding);\n}\n\nbutton:disabled {\n  pointer-events: none;\n}\n\n@keyframes slideIn {\n  from {\n    transform: var(--translate-dialog);\n    opacity: 0%;\n  }\n\n  to {\n    transform: none;\n    opacity: 100%;\n  }\n}\n", de = "/*\n * Copyright 2023 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  height: var(--sys-size-9);\n  width: 100%;\n  display: block;\n}\n\n.show {\n  display: block;\n  font-size: 12px;\n  color: var(--sys-color-on-surface);\n  height: 100%;\n  width: 100%;\n  border: none;\n  border-radius: var(--sys-shape-corner-extra-small);\n  padding: 0 var(--sys-size-4) 0 var(--sys-size-5);\n\n  &:hover {\n    background-color: var(--sys-color-state-hover-on-subtle);\n  }\n\n  &:active {\n    background-color: var(--sys-color-state-ripple-neutral-on-subtle);\n  }\n\n  &:hover:active {\n    background:\n      linear-gradient(var(--sys-color-state-hover-on-subtle), var(--sys-color-state-hover-on-subtle)),\n      linear-gradient(var(--sys-color-state-ripple-neutral-on-subtle), var(--sys-color-state-ripple-neutral-on-subtle));\n  }\n\n  &:focus-visible {\n    outline: var(--sys-size-2) solid var(--sys-color-state-focus-ring);\n    outline-offset: -1px;\n  }\n}\n\n#button-label-wrapper {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n#label {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  width: fit-content;\n  height: 100%;\n}\n\n#label[witharrow].single-arrow {\n  padding: 0;\n}\n\n#label[witharrow] {\n  padding: 0 10px 0 0;\n  text-align: left;\n}\n\n.single-arrow + span#arrow {\n  margin: 0;\n}\n\n#arrow {\n  mask-image: var(--deploy-menu-arrow);\n  -webkit-mask-position-y: center;\n  margin-left: 5px;\n  width: 14px;\n  flex-shrink: 0;\n  height: 14px;\n  display: inline-block;\n  mask-repeat: no-repeat;\n  background-color: var(--sys-color-on-surface-subtle);\n}\n\n.single-arrow {\n  border-radius: 0 3px 3px 0;\n  border: var(--sys-size-1) solid var(--sys-color-neutral-outline);\n  height: 100%;\n  aspect-ratio: 1 / 1;\n  padding: 0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\nbutton {\n  background: none;\n}\n\nbutton[disabled] {\n  color: var(--sys-color-state-disabled);\n  background-color: var(--sys-color-state-disabled-container);\n\n  #arrow {\n    background-color: var(--sys-color-state-disabled);\n  }\n}\n", { html: Z } = c, fe = new URL("../../../Images/triangle-down.svg", new URL("ui/components/menus/SelectMenu.js", typeof document < "u" ? document.baseURI : new URL("../../", self.location.href).href).href).toString(), Q = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t = null;
	#n = !1;
	#r = {
		buttonTitle: "",
		position: N.BOTTOM,
		horizontalAlignment: F.AUTO,
		showArrow: !1,
		sideButton: !1,
		showDivider: !1,
		disabled: !1,
		showSelectedItem: !0,
		jslogContext: ""
	};
	get buttonTitle() {
		return this.#r.buttonTitle;
	}
	set buttonTitle(e) {
		this.#r.buttonTitle = e, x(this, this.#d);
	}
	get position() {
		return this.#r.position;
	}
	set position(e) {
		this.#r.position = e, x(this, this.#d);
	}
	get horizontalAlignment() {
		return this.#r.horizontalAlignment;
	}
	set horizontalAlignment(e) {
		this.#r.horizontalAlignment = e, x(this, this.#d);
	}
	get showArrow() {
		return this.#r.showArrow;
	}
	set showArrow(e) {
		this.#r.showArrow = e, x(this, this.#d);
	}
	get sideButton() {
		return this.#r.sideButton;
	}
	set sideButton(e) {
		this.#r.sideButton = e, x(this, this.#d);
	}
	get disabled() {
		return this.#r.disabled;
	}
	set disabled(e) {
		this.#r.disabled = e, x(this, this.#d);
	}
	get showDivider() {
		return this.#r.showDivider;
	}
	set showDivider(e) {
		this.#r.showDivider = e, x(this, this.#d);
	}
	get showSelectedItem() {
		return this.#r.showSelectedItem;
	}
	set showSelectedItem(e) {
		this.#r.showSelectedItem = e, x(this, this.#d);
	}
	get jslogContext() {
		return this.#r.jslogContext;
	}
	set jslogContext(e) {
		this.#r.jslogContext = e, x(this, this.#d);
	}
	#i() {
		if (!this.#t && (this.#t = this.#e.querySelector("devtools-select-menu-button"), !this.#t)) throw Error("Arrow not found");
		return this.#t;
	}
	#a() {
		this.#n = !0, this.setAttribute("has-open-dialog", "has-open-dialog"), x(this, this.#d);
	}
	click() {
		this.#i().click();
	}
	#o() {
		this.dispatchEvent(new he());
	}
	#s() {
		return this.buttonTitle instanceof Function ? this.buttonTitle() : this.buttonTitle;
	}
	#c() {
		let e = this.#s();
		return this.sideButton ? Z`
      <button id="side-button" @click=${this.#o} ?disabled=${this.disabled}>
        ${e}
      </button>
      <devtools-select-menu-button
        @click=${this.#a}
        @selectmenubuttontrigger=${this.#a}
        .singleArrow=${!0}
        .open=${this.#n}
        .showArrow=${!0}
        .arrowDirection=${this.position}
        .disabled=${this.disabled}>
      </devtools-select-menu-button>
    ` : Z`
          <devtools-select-menu-button
            @selectmenubuttontrigger=${this.#a}
            .open=${this.#n} .showArrow=${this.showArrow}
            .arrowDirection=${this.position}
            .disabled=${this.disabled}
            .jslogContext=${this.jslogContext}>
              ${e}
            </devtools-select-menu-button>
        `;
	}
	#l(e) {
		e && e.stopImmediatePropagation(), v(() => {
			this.removeAttribute("has-open-dialog");
		}), this.#n = !1, x(this, this.#d);
	}
	#u(e) {
		this.dispatchEvent(new me(e.itemValue));
	}
	async #d() {
		if (!S(this)) throw Error("SelectMenu render was not scheduled");
		s(Z`
        <style>${ue}</style>
        <devtools-menu
            @menucloserequest=${this.#l}
            @menuitemselected=${this.#u}
            .position=${this.position}
            .origin=${this}
            .showDivider=${this.showDivider}
            .showSelectedItem=${this.showSelectedItem}
            .open=${this.#n}
            .getConnectorCustomXPosition=${null}>
          <slot></slot>
        </devtools-menu>
        ${this.#c()}`, this.#e, { host: this });
	}
}, pe = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t = null;
	connectedCallback() {
		this.style.setProperty("--deploy-menu-arrow", `url(${fe})`), v(() => {
			switch (this.arrowDirection) {
				case N.AUTO:
				case N.TOP:
					this.style.setProperty("--arrow-angle", "180deg");
					break;
				case N.BOTTOM:
					this.style.setProperty("--arrow-angle", "0deg");
					break;
				default: b(this.arrowDirection, `Unknown position type: ${this.arrowDirection}`);
			}
		});
	}
	#n = {
		showArrow: !1,
		arrowDirection: N.BOTTOM,
		disabled: !1,
		singleArrow: !1,
		jslogContext: ""
	};
	get showArrow() {
		return this.#n.showArrow;
	}
	set showArrow(e) {
		this.#n.showArrow = e, x(this, this.#o);
	}
	get arrowDirection() {
		return this.#n.arrowDirection;
	}
	set arrowDirection(e) {
		this.#n.arrowDirection = e, x(this, this.#o);
	}
	get disabled() {
		return this.#n.disabled;
	}
	set disabled(e) {
		this.#n.disabled = e, x(this, this.#o);
	}
	set open(e) {
		v(() => {
			this.#r()?.setAttribute("aria-expanded", String(e));
		});
	}
	set singleArrow(e) {
		this.#n.singleArrow = e, x(this, this.#o);
	}
	get jslogContext() {
		return this.#n.jslogContext;
	}
	set jslogContext(e) {
		this.#n.jslogContext = e, x(this, this.#o);
	}
	click() {
		this.#r()?.click();
	}
	#r() {
		return this.#t ||= this.#e.querySelector("button"), this.#t;
	}
	#i(t) {
		let r = t.key, i = this.arrowDirection === N.BOTTOM && r === n.DOWN, a = this.arrowDirection === N.TOP && r === n.UP, o = r === e, s = t.code === "Space";
		(i || a || o || s) && (this.dispatchEvent(new $()), t.preventDefault());
	}
	#a() {
		this.dispatchEvent(new $());
	}
	async #o() {
		if (!S(this)) throw Error("SelectMenuItem render was not scheduled");
		let e = this.#n.showArrow ? Z`<span id="arrow"></span>` : g, t = { "single-arrow": this.#n.singleArrow }, n = Z`
      <span id="button-label-wrapper">
        <span id="label" ?witharrow=${this.showArrow} class=${f(t)}>
          <slot></slot>
        </span>
        ${e}
      </span>`;
		s(Z`
        <style>${de}</style>
        <button
            aria-haspopup="true" aria-expanded="false" class="show"
            @keydown=${this.#i} @click=${this.#a}
            ?disabled=${this.disabled}
            jslog=${_(this.jslogContext)}>
          ${n}
        </button>`, this.#e, { host: this });
	}
};
customElements.define("devtools-select-menu", Q), customElements.define("devtools-select-menu-button", pe);
var me = class e extends Event {
	itemValue;
	static eventName = "selectmenuselected";
	constructor(t) {
		super(e.eventName, {
			bubbles: !0,
			composed: !0
		}), this.itemValue = t;
	}
}, he = class e extends Event {
	static eventName = "selectmenusidebuttonclick";
	constructor() {
		super(e.eventName, {
			bubbles: !0,
			composed: !0
		});
	}
}, $ = class e extends Event {
	static eventName = "selectmenubuttontrigger";
	constructor() {
		super(e.eventName, {
			bubbles: !0,
			composed: !0
		});
	}
};
//#endregion
export { F as a, H as i, q as n, P as o, Y as r, N as s, Q as t };
