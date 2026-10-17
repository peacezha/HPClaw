import { n as e } from "./rolldown-runtime-DF993M8W.js";
import { $ as t, Et as n, H as r, K as i, N as a, P as o, Q as s, en as c, i as l, m as u, p as d, qt as f } from "./common-DMSVbaSb.js";
import { $a as p, $i as m, $r as h, Ba as g, Bt as _, Df as v, Dn as y, Dp as b, Dt as x, Fo as ee, Ft as te, Gi as ne, Ht as re, Jn as ie, Mn as S, Mo as ae, Of as oe, Po as se, Tl as ce, U as C, Ur as w, Vt as le, Wi as ue, Xa as de, Xi as fe, Xo as pe, Ya as me, Z as he, Za as ge, _n as T, _t as _e, bn as ve, br as ye, do as be, dt as xe, ef as E, ei as D, en as Se, fl as Ce, fp as we, ft as Te, gt as Ee, ha as De, jd as Oe, li as ke, ni as Ae, no as je, q as Me, qn as Ne, vn as Pe, vt as O, wo as Fe, xa as Ie, zn as k, zt as Le } from "./legacy-dM_vujv7.js";
import "./platform-D4TUCh2P.js";
import { F as Re } from "./StringUtilities-CMDxNrEc.js";
import { o as ze } from "./FormatterActions-D6HaA-6R.js";
import { n as A, t as j } from "./theme_support-BJ6jI25-.js";
import { E as Be, g as Ve, s as He, w as Ue } from "./bindings-DyamxTH2.js";
import { En as M, Ln as We, On as Ge, Pn as Ke, Qr as N, Vt as qe, Zr as Je, jn as Ye, t as Xe } from "./snackbars-Dq3yf1tP.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/legacy/components/perf_ui/BrickBreaker.ts
var Ze = /* @__PURE__ */ e({ BrickBreaker: () => it }), Qe = {
	congrats: "Congrats, you win!",
	ps: "PS: You can also open the game by typing `fixme`"
}, $e = i("ui/legacy/components/perf_ui/BrickBreaker.ts", Qe), et = r.bind(void 0, $e), tt = 10, nt = 150, P = 15, F = 10, rt = [
	{
		light: "rgb(224,240,255)",
		mediumLighter: "rgb(176,208,255)",
		mediumDarker: "rgb(112,160,221)",
		dark: "rgb(0,92,153)"
	},
	{
		light: "rgb(253, 216, 229)",
		mediumLighter: "rgb(250, 157, 188)",
		mediumDarker: "rgb(249, 98, 154)",
		dark: "rgb(254, 5, 105)"
	},
	{
		light: "rgb(254, 234, 234)",
		mediumLighter: "rgb(255, 216, 216)",
		mediumDarker: "rgb(255, 195, 195)",
		dark: "rgb(235, 125, 138)"
	},
	{
		light: "rgb(226,183,206)",
		mediumLighter: "rgb(219,124,165)",
		mediumDarker: "rgb(146,60,129)",
		dark: "rgb(186, 85, 255)"
	},
	{
		light: "rgb(206,255,206)",
		mediumLighter: "rgb(128,255,128)",
		mediumDarker: "rgb(0,246,0)",
		dark: "rgb(0,187,0)"
	},
	{
		light: "rgb(255, 188, 181)",
		mediumLighter: "rgb(254, 170, 170)",
		mediumDarker: "rgb(215, 59, 43)",
		dark: "rgb(187, 37, 23)"
	},
	{
		light: "rgb(236, 254, 250)",
		mediumLighter: "rgb(204, 255, 245)",
		mediumDarker: "rgb(164, 240, 233)",
		dark: "rgb(72,189,144)"
	},
	{
		light: "rgb(255, 225, 185)",
		mediumLighter: "rgb(255, 204, 141)",
		mediumDarker: "rgb(240, 140, 115)",
		dark: "rgb(211, 96, 117)"
	},
	{
		light: "rgb(218, 255, 248)",
		mediumLighter: "rgb(177, 235, 236)",
		mediumDarker: "rgb(112, 214, 214)",
		dark: "rgb(34, 205, 181)"
	}
], it = class extends HTMLElement {
	timelineFlameChart;
	#e;
	#t;
	#n;
	#r;
	#i;
	#a = 0;
	#o = /* @__PURE__ */ new Set();
	#s = /* @__PURE__ */ new Map();
	#c = this.#B.bind(this);
	#l = this.#R.bind(this);
	#u = this.#z.bind(this);
	#d = this.#F.bind(this);
	#f = this.#V.bind(this);
	#p = y();
	#m = 0;
	#h = !1;
	#g = devicePixelRatio;
	#_ = 0;
	#v = 0;
	#y = 0;
	#b = 0;
	#x = 0;
	#S = !1;
	#C = !1;
	#w = 0;
	#T = 0;
	#E = 0;
	#D = nt;
	#O = 150;
	#k = 1500;
	#A = this.#k - this.#O;
	#j = 0;
	#M = 0;
	#N;
	constructor(e) {
		super(), this.timelineFlameChart = e, this.#e = this.createChild("canvas", "fill"), this.#t = this.#e.getContext("2d"), this.#n = document.createElement("canvas"), this.#r = this.#n.getContext("2d");
		let t = Math.floor(Math.random() * rt.length);
		this.#N = rt[t], this.#i = this.createChild("div"), this.#i.classList.add("scorePanel"), this.#i.style.borderImage = "linear-gradient(" + this.#N.mediumDarker + "," + this.#N.dark + ") 1", this.initButton();
	}
	initButton() {
		let e = this.createChild("div");
		e.classList.add("game-close-button"), e.innerHTML = "<b><span style='font-size: 1.2em; color: white'>x</span></b>", e.style.background = this.#N.dark, e.style.boxShadow = this.#N.dark + " 1px 1px, " + this.#N.mediumDarker + " 3px 3px, " + this.#N.mediumLighter + " 5px 5px", e.addEventListener("click", this.#F.bind(this)), this.appendChild(e);
	}
	connectedCallback() {
		this.#h = !0, this.#I(), this.#p.addEventListener("keydown", this.#c), document.addEventListener("keydown", this.#c, !1), document.addEventListener("keyup", this.#l, !1), document.addEventListener("keypress", this.#u, !1), window.addEventListener("resize", this.#d), document.addEventListener("mousemove", this.#f, !1), this.tabIndex = 1, this.focus();
	}
	disconnectedCallback() {
		this.#p.removeEventListener("keydown", this.#c), window.removeEventListener("resize", this.#d), document.removeEventListener("keydown", this.#c, !1), document.removeEventListener("keyup", this.#l, !1), window.removeEventListener("resize", this.#d), document.removeEventListener("keypress", this.#u, !1), document.removeEventListener("mousemove", this.#f, !1);
	}
	#P() {
		let e = window.devicePixelRatio, t = Math.round(this.offsetHeight * e), n = Math.round(this.offsetWidth * e);
		this.#e.height = t, this.#e.width = n, this.#e.style.height = t / e + "px", this.#e.style.width = n / e + "px";
	}
	#F() {
		this.#h = !1, this.remove();
	}
	#I() {
		this.#P(), this.#j = Math.max(.1, (this.offsetHeight - this.#O) / this.#A), this.#M = tt * this.#j;
		let e = this.timelineFlameChart.drawTrackOnCanvas("Main", this.#t, F);
		if (e === null || e.visibleEntries.size === 0) {
			console.error("Could not draw game"), this.#F();
			return;
		}
		this.#a = e.top, this.#o = e.visibleEntries, this.#m = this.#a + this.timelineFlameChart.getCanvas().getBoundingClientRect().top - this.timelineFlameChart.getScrollOffset(), requestAnimationFrame(() => this.#L(e.top, e.height));
	}
	#L(e, t) {
		if (e === 0) {
			this.#H();
			return;
		}
		let n = window.devicePixelRatio, r = Math.round(e * n), i = Math.max(e - 4, 0), a = Math.round(i * n), o = this.#e;
		this.#n.height = o.height, this.#n.width = o.width, this.#n.style.height = o.style.height, this.#n.style.width = o.style.width, this.#r.drawImage(o, 0, r, o.width, t * n, 0, a, o.width, t * n), this.#P(), this.#t.drawImage(this.#n, 0, 0), requestAnimationFrame(() => this.#L(i, t));
	}
	#R(e) {
		e.key === "Right" || e.key === "ArrowRight" || e.key === "d" ? (this.#S = !1, e.preventDefault()) : e.key === "Left" || e.key === "ArrowLeft" || e.key === "a" ? (this.#C = !1, e.preventDefault()) : e.stopImmediatePropagation();
	}
	#z(e) {
		e.stopImmediatePropagation(), e.preventDefault();
	}
	#B(e) {
		e.key === "Escape" ? (this.#F(), e.stopImmediatePropagation()) : e.key === "Right" || e.key === "ArrowRight" || e.key === "d" ? (this.#S = !0, e.preventDefault()) : e.key === "Left" || e.key === "ArrowLeft" || e.key === "a" ? (this.#C = !0, e.preventDefault()) : (e.preventDefault(), e.stopImmediatePropagation());
	}
	#V(e) {
		this.#x = Math.max(e.offsetX - this.#D / 2, 0), this.#x = Math.min(this.#x, this.offsetWidth - this.#D);
	}
	#H() {
		this.#_ = this.offsetWidth / 2, this.#v = this.offsetHeight - P - F, this.#y = 0, this.#b = -Math.SQRT2 * this.#M, this.#x = (this.#e.width - this.#D) / 2, this.#S = !1, this.#C = !1, this.#w = this.timelineFlameChart.getBarHeight(), this.#E = this.#o.size, this.#T = Math.max(Math.round(this.#E / 17), 2), this.#q();
	}
	#U() {
		this.#_ = this.offsetWidth / 2, this.#v = this.offsetHeight - P - F, this.#y = 0, this.#b = -Math.SQRT2 * this.#M;
	}
	#W() {
		if (!this.#t) return;
		let e = this.#t.createRadialGradient(this.#_ + F / 4, this.#v - F / 4, 0, this.#_ + F / 4, this.#v - F / 4, F);
		e.addColorStop(.3, this.#N.mediumLighter), e.addColorStop(.6, this.#N.mediumDarker), e.addColorStop(1, this.#N.dark), this.#t.beginPath(), this.#t.arc(this.#_, this.#v, F, 0, Math.PI * 2), this.#t.fillStyle = e, this.#t.fill(), this.#t.closePath();
	}
	#G() {
		if (!this.#t) return;
		let e = this.#t.createRadialGradient(this.#x + this.#D / 3, this.offsetHeight - P - P / 4, 0, this.#x + this.#D / 3, this.offsetHeight - P - P / 4, this.#D / 2);
		e.addColorStop(.3, this.#N.dark), e.addColorStop(1, this.#N.mediumDarker), this.#t.beginPath(), this.#t.rect(this.#x, this.offsetHeight - P, this.#D, P), this.#t.fillStyle = e, this.#t.fill(), this.#t.closePath();
	}
	#K() {
		if (this.#t) for (let e of this.#s.values()) this.#t.beginPath(), this.#t.rect(e.x, e.y, e.width + .5, this.#w + .5), this.#t.fillStyle = A.instance().getComputedValue("--sys-color-neutral-container", this), this.#t.fill(), this.#t.closePath();
	}
	#q() {
		if (this.#g !== devicePixelRatio && (this.#h = !1), this.#T === 0) {
			window.alert("GAME OVER"), this.#F();
			return;
		}
		if (this.#E === 0) {
			this.#X();
			return;
		}
		this.#t.clearRect(0, 0, this.#e.width, this.#e.height), this.#t.drawImage(this.#n, 0, 0), this.#t.save(), this.#t.scale(devicePixelRatio, devicePixelRatio), this.#r.save(), this.#r.scale(devicePixelRatio, devicePixelRatio), this.#K(), this.#W(), this.#G(), this.#J();
		let e = `<div><b><span style='font-size: 1.3em; color:  ${this.#N.dark}'>&#x2764;&#xfe0f; ${this.#T}</span></b></div>`, t = `<div><b><span style='font-size: 1.3em; color: ${this.#N.dark}'> 🧱 ${this.#E}</span></b></div>`;
		if (this.#i.innerHTML = e + t, this.#E = this.#o.size - this.#s.size, this.#M = (tt + 6 * this.#s.size / this.#o.size) * this.#j, this.#D = nt - 65 * this.#s.size / this.#o.size, (this.#_ + this.#y > this.offsetWidth - F || this.#_ + this.#y < F) && (this.#y = -this.#y), this.#v + this.#b < F) this.#b = -this.#b;
		else if (this.#v + this.#b > this.offsetHeight - F && this.#b > 0) {
			if (this.#_ > this.#x - F && this.#_ < this.#x + this.#D + F) {
				let e = Math.min(this.#_, this.#x + this.#D);
				e = Math.max(e, this.#x);
				let t = (e - this.#x) * this.#M * 2 / this.#D;
				this.#y = -this.#M + t, this.#b = -Math.sqrt(2 * this.#M ** 2 - this.#y ** 2);
			} else this.#U(), this.#x = (this.offsetWidth - this.#D) / 2, this.#T--;
		}
		let n = Math.round(this.clientWidth / 60);
		this.#S && this.#x < this.offsetWidth - this.#D ? this.#x += n : this.#C && this.#x > 0 && (this.#x -= n), this.#_ += Math.round(this.#y), this.#v += Math.round(this.#b), this.#t.restore(), this.#r.restore(), this.#h && requestAnimationFrame(this.#q.bind(this));
	}
	#J() {
		let e = this.timelineFlameChart.getCanvas().getBoundingClientRect(), t = this.#v + this.#m - e.top, n = this.timelineFlameChart.coordinatesToEntryIndex(this.#_, t + F), r = this.timelineFlameChart.coordinatesToEntryIndex(this.#_, t - F), i = this.timelineFlameChart.coordinatesToEntryIndex(this.#_ + F, t), a = this.timelineFlameChart.coordinatesToEntryIndex(this.#_ - F, t), o = F / Math.SQRT2, s = this.timelineFlameChart.coordinatesToEntryIndex(this.#_ + o, t + o), c = this.timelineFlameChart.coordinatesToEntryIndex(this.#_ - o, t + o), l = this.timelineFlameChart.coordinatesToEntryIndex(this.#_ + o, t - o), u = this.timelineFlameChart.coordinatesToEntryIndex(this.#_ - o, t - o), d = (t) => {
			let n = this.timelineFlameChart.entryIndexToCoordinates(t);
			if (n) {
				let r = Math.max(n.x - e.left, 0);
				this.#s.set(t, {
					x: r - .5,
					y: n.y - this.#m - .5,
					width: this.timelineFlameChart.entryWidth(t)
				});
			}
		};
		if (n > -1 && !this.#s.has(n) && this.#o.has(n)) {
			this.#b = -this.#b, d(n);
			return;
		}
		if (r > -1 && !this.#s.has(r) && this.#o.has(r)) {
			this.#b = -this.#b, d(r);
			return;
		}
		if (i > -1 && !this.#s.has(i) && this.#o.has(i)) {
			this.#y = -this.#y, d(i);
			return;
		}
		if (a > -1 && !this.#s.has(a) && this.#o.has(a)) {
			this.#y = -this.#y, d(a);
			return;
		}
		let f = [
			s,
			c,
			l,
			u
		];
		for (let e of f) if (e > -1 && !this.#s.has(e) && this.#o.has(e)) {
			this.#y = -this.#y, this.#b = -this.#b, d(e);
			return;
		}
	}
	#Y(e, t) {
		return Math.floor(Math.random() * (t - e) + e);
	}
	#X() {
		this.#P();
		let e = 0, t = this.offsetWidth / 15, n = this.offsetHeight * .7 / 15, r = [], i = () => -20 + Math.random() * 40, a = () => {
			for (let e = 0; e < 75; e++) {
				let a = document.createElement("span");
				a.className = "confetti-100", a.append(this.#Z(e % 15 * t + i(), e % 5 * n + i())), r.push(window.setTimeout(() => this.append(a), Math.random() * 100)), r.push(window.setTimeout(() => {
					a.remove();
				}, 1e3));
			}
			if (++e < 6) {
				setTimeout(a, Math.random() * 100 + 400);
				return;
			}
			window.alert(`${et(Qe.congrats)}\n${et(Qe.ps)}`), r.forEach((e) => clearTimeout(e)), this.#F();
		};
		a();
	}
	#Z(e, t) {
		let n = [
			"💯",
			"🎉",
			"🎊"
		], r = document.createElement("span");
		return r.textContent = n[this.#Y(0, n.length)], r.className = "confetti-100-particle", r.style.setProperty("--rotation", this.#Y(-1080, 1080) + "deg"), r.style.setProperty("--to-X", this.#Y(-400, 400) + "px"), r.style.setProperty("--to-Y", this.#Y(-400, 400) + "px"), r.style.left = e + "px", r.style.top = t + "px", r;
	}
};
customElements.define("brick-breaker", it);
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/legacy/components/perf_ui/chartViewport.css.mjs
var at = "/*\n * Copyright 2017 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.chart-viewport-v-scroll {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  overflow-x: hidden;\n  z-index: 200;\n  padding-left: 1px;\n}\n\n.chart-viewport-v-scroll.always-show-scrollbar {\n  overflow-y: scroll;\n}\n/* force non overlay scrollbars for Mac */\n\n:host-context(.platform-mac) .chart-viewport-v-scroll {\n  right: 2px;\n  top: 3px;\n  bottom: 3px;\n}\n\n:host-context(.platform-mac) ::-webkit-scrollbar {\n  width: 8px;\n}\n\n:host-context(.platform-mac) ::-webkit-scrollbar-thumb {\n  background-color: var(--color-scrollbar-mac);\n  border-radius: 50px;\n}\n\n:host-context(.platform-mac) .chart-viewport-v-scroll:hover::-webkit-scrollbar-thumb {\n  background-color: var(--color-scrollbar-mac-hover);\n}\n/* force non overlay scrollbars for Aura Overlay Scrollbar enabled */\n\n:host-context(.overlay-scrollbar-enabled) ::-webkit-scrollbar {\n  width: 10px;\n}\n\n:host-context(.overlay-scrollbar-enabled) ::-webkit-scrollbar-thumb {\n  background-color: var(--color-scrollbar-other);\n}\n\n:host-context(.overlay-scrollbar-enabled) .chart-viewport-v-scroll:hover::-webkit-scrollbar-thumb {\n  background-color: var(--color-scrollbar-other-hover);\n}\n\n.chart-viewport-selection-overlay {\n  position: absolute;\n  z-index: 100;\n  background-color: var(--sys-color-state-ripple-primary);\n  border-color: var(--sys-color-primary);\n  border-width: 0 1px;\n  border-style: solid;\n  pointer-events: none;\n  top: 0;\n  bottom: 0;\n  text-align: center;\n}\n\n.chart-viewport-selection-overlay .time-span {\n  white-space: nowrap;\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n}\n";
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/legacy/components/perf_ui/CanvasHelper.ts
function ot(e, t, n) {
	e.moveTo(0, n), e.lineTo(t, n);
}
function st(e, t, n, r) {
	let i = 8 * Math.sqrt(3) / 2, a = Math.round(i / 2);
	e.save(), e.beginPath(), e.translate(t, n), e.rotate(r ? Math.PI / 2 : 0), e.moveTo(-a, -4), e.lineTo(-a, 4), e.lineTo(i - a, 0), e.fill(), e.restore();
}
function ct(e, t, n, r, i, a = "--sys-color-on-surface") {
	let o = new Path2D(i);
	e.save(), e.translate(t, n), e.fillStyle = A.instance().getComputedValue("--sys-color-cdt-base-container"), e.fillRect(0, 0, r, r), e.fillStyle = A.instance().getComputedValue(a);
	let s = r / 20;
	e.scale(s, s), e.fill(o), e.restore();
}
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/legacy/components/perf_ui/flameChart.css.mjs
var lt = "/*\n * Copyright 2017 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.flame-chart-main-pane {\n  overflow: hidden;\n\n  --selected-group-border: hsl(216deg 68% 54%);\n}\n\n:host-context(.theme-with-dark-background) .flame-chart-main-pane {\n  --selected-group-border: hsl(216deg 68% 46%);\n}\n\n.flame-chart-marker-highlight-element {\n  position: absolute;\n  top: 1px;\n  height: 18px;\n  width: 6px;\n  margin: 0 -3px;\n  content: \"\";\n  display: block;\n}\n\n.flame-chart-canvas:focus-visible {\n  border-top: 1px solid var(--sys-color-state-focus-ring);\n  border-bottom: 1px solid var(--sys-color-state-focus-ring);\n}\n\n.flame-chart-highlight-element {\n  position: absolute;\n  pointer-events: none;\n  background-color: var(--sys-color-state-hover-on-subtle);\n}\n\n.reveal-descendants-arrow-highlight-element {\n  position: absolute;\n  pointer-events: none;\n  background-color: var(--sys-color-state-hover-on-subtle);\n}\n\n.flame-chart-selected-element {\n  position: absolute;\n  pointer-events: none;\n  outline: 2px solid var(--sys-color-primary);\n  background-color: var(--sys-color-state-ripple-primary);\n}\n\n.chart-cursor-element {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  z-index: 100;\n  width: 2px;\n  background-color: var(--ref-palette-pink50);\n  pointer-events: none;\n}\n\n.flame-chart-entry-info:not(:empty) {\n  z-index: 2000;\n  position: absolute;\n  contain: content;\n  background-color: var(--sys-color-cdt-base-container);\n  pointer-events: none;\n  padding: 4px 8px;\n  white-space: nowrap;\n  max-width: 80%;\n  box-shadow: var(--drop-shadow);\n}\n\n.flame-chart-entry-info table tr td:empty {\n  padding: 0;\n}\n\n.flame-chart-entry-info table tr td:not(:empty) {\n  padding: 0 5px;\n  white-space: nowrap;\n}\n\n.flame-chart-entry-info table tr td:first-child {\n  font-weight: bold;\n}\n\n.flame-chart-entry-info table tr td span {\n  margin-right: 5px;\n}\n\n.flame-chart-edit-confirm {\n  position: fixed;\n  bottom: 10px;\n  right: 10px;\n}\n", ut = /* @__PURE__ */ e({
	DEFAULT_FONT_SIZE: () => L,
	getFontFamilyForCanvas: () => I
});
function I() {
	return v();
}
var L = "11px", dt = "/*\n * Copyright 2015 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.resources-dividers {\n  position: absolute;\n  inset: 0;\n  z-index: -100;\n}\n\n.resources-event-dividers {\n  position: absolute;\n  left: 0;\n  right: 0;\n  height: 100%;\n  top: 0;\n  z-index: 300;\n  pointer-events: none;\n}\n\n.resources-dividers-label-bar {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  background-clip: padding-box;\n  height: 20px;\n  z-index: 200;\n  pointer-events: none;\n  overflow: hidden;\n}\n\n.resources-divider {\n  position: absolute;\n  width: 1px;\n  top: 0;\n  bottom: 0;\n  background-color: var(--sys-color-divider);\n}\n\n.resources-event-divider {\n  position: absolute;\n  width: 1px;\n  top: 0;\n  bottom: 0;\n  z-index: 300;\n}\n\n.resources-divider-label {\n  position: absolute;\n  top: 4px;\n  right: 3px;\n  font-size: 80%;\n  white-space: nowrap;\n  pointer-events: none;\n}\n\n.timeline-grid-header {\n  height: 20px;\n  pointer-events: none;\n}\n", ft = /* @__PURE__ */ e({ TimelineGrid: () => R }), pt = /* @__PURE__ */ new Map(), R = class e {
	element;
	#e;
	gridHeaderElement;
	eventDividersElement;
	#t;
	constructor() {
		this.element = document.createElement("div"), ke(this.element, dt), this.#e = this.element.createChild("div", "resources-dividers"), this.gridHeaderElement = document.createElement("div"), this.gridHeaderElement.classList.add("timeline-grid-header"), this.eventDividersElement = this.gridHeaderElement.createChild("div", "resources-event-dividers"), this.#t = this.gridHeaderElement.createChild("div", "resources-dividers-label-bar"), this.element.appendChild(this.gridHeaderElement);
	}
	static calculateGridOffsets(e, t) {
		let n = e.computePosition(e.maximumBoundary()), r = n / 64, i = e.boundarySpan() / r, a = n / e.boundarySpan();
		i = 10 ** Math.ceil(Math.log(i) / Math.LN10), i * a >= 320 && (i /= 5), i * a >= 128 && (i /= 2);
		let o = Math.ceil((e.minimumBoundary() - e.zeroTime()) / i) * i + e.zeroTime(), s = e.maximumBoundary();
		s += 64 / a, r = Math.ceil((s - o) / i), i || (r = 0);
		let c = [];
		for (let n = 0; n < r; ++n) {
			let r = o + i * 100 * n / 100, a = e.computePosition(r);
			a < (t || 0) || c.push({
				position: Math.floor(a),
				time: r
			});
		}
		return {
			offsets: c,
			precision: Math.max(0, -Math.floor(Math.log(i * 1.01) / Math.LN10))
		};
	}
	static drawCanvasGrid(e, t) {
		e.save(), e.scale(window.devicePixelRatio, window.devicePixelRatio);
		let n = Math.floor(e.canvas.height / window.devicePixelRatio);
		e.strokeStyle = getComputedStyle(document.body).getPropertyValue("--app-color-strokestyle"), e.lineWidth = 1, e.translate(.5, .5), e.beginPath();
		for (let r of t.offsets) e.moveTo(r.position, 0), e.lineTo(r.position, n);
		e.stroke(), e.restore();
	}
	static drawCanvasHeaders(e, t, n, r, i, a) {
		e.save(), e.scale(window.devicePixelRatio, window.devicePixelRatio);
		let o = Math.ceil(e.canvas.width / window.devicePixelRatio);
		e.beginPath(), e.fillStyle = A.instance().getComputedValue("--color-background-opacity-80"), e.fillRect(0, 0, o, i), e.fillStyle = A.instance().getComputedValue("--sys-color-on-surface"), e.textBaseline = "hanging", e.font = `${L} ${I()}`;
		for (let i of t.offsets) {
			let t = n(i.time), o = e.measureText(t).width, s = i.position - o - 4;
			(!a || a < s) && e.fillText(t, s, r);
		}
		e.restore();
	}
	get dividersElement() {
		return this.#e;
	}
	get dividersLabelBarElement() {
		return this.#t;
	}
	updateDividers(t, n) {
		let r = e.calculateGridOffsets(t, n), i = r.offsets, a = r.precision, o = this.#e.clientWidth, s = this.#e.firstChild, c = this.#t.firstChild;
		for (let e = 0; e < i.length; ++e) {
			if (!s) {
				s = document.createElement("div"), s.className = "resources-divider", this.#e.appendChild(s), c = document.createElement("div"), c.className = "resources-divider";
				let e = document.createElement("div");
				e.className = "resources-divider-label", pt.set(c, e), c.appendChild(e), this.#t.appendChild(c);
			}
			let n = i[e].time, r = i[e].position;
			if (c) {
				let e = pt.get(c);
				e && (e.textContent = t.formatValue(n, a));
			}
			let l = 100 * r / o;
			s.style.left = l + "%", c && (c.style.left = l + "%"), s = s.nextSibling, c &&= c.nextSibling;
		}
		for (; s;) {
			let e = s.nextSibling;
			if (this.#e.removeChild(s), e) s = e;
			else break;
		}
		for (; c;) {
			let e = c.nextSibling;
			if (this.#t.removeChild(c), e) c = e;
			else break;
		}
		return !0;
	}
	addEventDividers(e) {
		this.gridHeaderElement.removeChild(this.eventDividersElement);
		for (let t of e) this.eventDividersElement.appendChild(t);
		this.gridHeaderElement.appendChild(this.eventDividersElement);
	}
	removeEventDividers() {
		this.eventDividersElement.removeChildren();
	}
	hideEventDividers() {
		this.eventDividersElement.classList.add("hidden");
	}
	showEventDividers() {
		this.eventDividersElement.classList.remove("hidden");
	}
	setScrollTop(e) {
		this.#t.style.top = e + "px", this.eventDividersElement.style.top = e + "px";
	}
}, mt = /* @__PURE__ */ e({
	ARROW_SIDE: () => 8,
	EDIT_ICON_WIDTH: () => 16,
	Events: () => zt,
	FilterAction: () => Mt,
	FlameChart: () => Nt,
	FlameChartDecorationType: () => Ft,
	FlameChartTimelineData: () => Rt,
	GroupCollapsibleState: () => jt,
	HoverType: () => At,
	MinimalTimeWindowMs: () => Pt,
	RulerHeight: () => 15,
	sortDecorationsForRenderingOrder: () => Lt
}), ht = -1, gt = "italic 10px", z = {
	eventSelectedFromGroup: "Selected a {PH1} event within {PH2}. Press \"enter\" to focus this event.",
	flameChart: "Flame Chart",
	sHovered: "{PH1} hovered",
	sSelected: "{PH1} selected",
	sExpanded: "{PH1} expanded",
	sCollapsed: "{PH1} collapsed",
	labelEntry: "Label entry",
	linkEntries: "Link entries",
	enterTrackConfigurationMode: "Configure tracks",
	exitTrackConfigurationMode: "Finish configuring tracks"
}, _t = i("ui/legacy/components/perf_ui/FlameChart.ts", z), B = r.bind(void 0, _t), V = 6, vt = 10, yt = 3, bt = 2, xt = 6, St = V, Ct = 25, wt = 44, Tt = 63, Et = "M9.25 17V5.875L7.062 8.062L6 7L10 3L14 7L12.938 8.062L10.75 5.875V17H9.25Z", Dt = "M9.25 3V14.125L7.062 11.938L6 13L10 17L14 13L12.938 11.938L10.75 14.125V3H9.25Z", Ot = "M13.2708 11.1459L11.9792 9.85419C12.0347 9.32641 11.875 8.87155 11.5 8.4896C11.125 8.10766 10.6736 7.94446 10.1458 8.00002L8.85417 6.70835C9.03472 6.63891 9.22222 6.58683 9.41667 6.5521C9.61111 6.51738 9.80556 6.50002 10 6.50002C10.9722 6.50002 11.7986 6.8403 12.4792 7.52085C13.1597 8.20141 13.5 9.0278 13.5 10C13.5 10.1945 13.4826 10.3889 13.4479 10.5834C13.4132 10.7778 13.3542 10.9653 13.2708 11.1459ZM16.0417 13.9167L14.9583 12.8334C15.4583 12.4445 15.9132 12.0174 16.3229 11.5521C16.7326 11.0868 17.0764 10.5695 17.3542 10C16.6736 8.59724 15.6701 7.49655 14.3438 6.69794C13.0174 5.89933 11.5694 5.50002 10 5.50002C9.63889 5.50002 9.28472 5.52085 8.9375 5.56252C8.59028 5.60419 8.25 5.67363 7.91667 5.77085L6.70833 4.56252C7.23611 4.35419 7.77431 4.20835 8.32292 4.12502C8.87153 4.04169 9.43056 4.00002 10 4.00002C11.9861 4.00002 13.8021 4.53821 15.4479 5.6146C17.0938 6.69099 18.2778 8.1528 19 10C18.6944 10.7917 18.2882 11.5104 17.7813 12.1563C17.2743 12.8021 16.6944 13.3889 16.0417 13.9167ZM16 18.125L13.2917 15.4167C12.7639 15.6111 12.2257 15.757 11.6771 15.8542C11.1285 15.9514 10.5694 16 10 16C8.01389 16 6.19792 15.4618 4.55208 14.3854C2.90625 13.309 1.72222 11.8472 1 10C1.30556 9.20835 1.70833 8.48613 2.20833 7.83335C2.70833 7.18058 3.29167 6.5903 3.95833 6.06252L1.875 3.97919L2.9375 2.91669L17.0625 17.0625L16 18.125ZM5.02083 7.14585C4.53472 7.53474 4.08333 7.96183 3.66667 8.4271C3.25 8.89238 2.90972 9.41669 2.64583 10C3.32639 11.4028 4.32986 12.5035 5.65625 13.3021C6.98264 14.1007 8.43056 14.5 10 14.5C10.3611 14.5 10.7153 14.4757 11.0625 14.4271C11.4097 14.3785 11.7569 14.3125 12.1042 14.2292L11.1667 13.2917C10.9722 13.3611 10.7778 13.4132 10.5833 13.4479C10.3889 13.4827 10.1944 13.5 10 13.5C9.02778 13.5 8.20139 13.1597 7.52083 12.4792C6.84028 11.7986 6.5 10.9722 6.5 10C6.5 9.80558 6.52431 9.61113 6.57292 9.41669C6.62153 9.22224 6.66667 9.0278 6.70833 8.83335L5.02083 7.14585Z", kt = "M10 13.5C10.972 13.5 11.7983 13.1597 12.479 12.479C13.1597 11.7983 13.5 10.972 13.5 10C13.5 9.028 13.1597 8.20167 12.479 7.521C11.7983 6.84033 10.972 6.5 10 6.5C9.028 6.5 8.20167 6.84033 7.521 7.521C6.84033 8.20167 6.5 9.028 6.5 10C6.5 10.972 6.84033 11.7983 7.521 12.479C8.20167 13.1597 9.028 13.5 10 13.5ZM10 12C9.44467 12 8.97233 11.8057 8.583 11.417C8.19433 11.0277 8 10.5553 8 10C8 9.44467 8.19433 8.97233 8.583 8.583C8.97233 8.19433 9.44467 8 10 8C10.5553 8 11.0277 8.19433 11.417 8.583C11.8057 8.97233 12 9.44467 12 10C12 10.5553 11.8057 11.0277 11.417 11.417C11.0277 11.8057 10.5553 12 10 12ZM10 16C8.014 16 6.20833 15.455 4.583 14.365C2.95833 13.2743 1.764 11.8193 1 10C1.764 8.18067 2.95833 6.72567 4.583 5.635C6.20833 4.545 8.014 4 10 4C11.986 4 13.7917 4.545 15.417 5.635C17.0417 6.72567 18.236 8.18067 19 10C18.236 11.8193 17.0417 13.2743 15.417 14.365C13.7917 15.455 11.986 16 10 16ZM10 14.5C11.5553 14.5 12.9927 14.0973 14.312 13.292C15.632 12.486 16.646 11.3887 17.354 10C16.646 8.61133 15.632 7.514 14.312 6.708C12.9927 5.90267 11.5553 5.5 10 5.5C8.44467 5.5 7.00733 5.90267 5.688 6.708C4.368 7.514 3.354 8.61133 2.646 10C3.354 11.3887 4.368 12.486 5.688 13.292C7.00733 14.0973 8.44467 14.5 10 14.5Z", At = /* @__PURE__ */ function(e) {
	return e.TRACK_CONFIG_UP_BUTTON = "TRACK_CONFIG_UP_BUTTON", e.TRACK_CONFIG_DOWN_BUTTON = "TRACK_CONFIG_DOWN_BUTTON", e.TRACK_CONFIG_HIDE_BUTTON = "TRACK_CONFIG_HIDE_BUTTON", e.TRACK_CONFIG_SHOW_BUTTON = "TRACK_CONFIG_SHOW_BUTTON", e.INSIDE_TRACK_HEADER = "INSIDE_TRACK_HEADER", e.INSIDE_TRACK = "INSIDE_TRACK", e.OUTSIDE_TRACKS = "OUTSIDE_TRACKS", e.ERROR = "ERROR", e;
}({}), jt = /* @__PURE__ */ function(e) {
	return e[e.ALWAYS = 0] = "ALWAYS", e[e.NEVER = 1] = "NEVER", e[e.IF_MULTI_ROW = 2] = "IF_MULTI_ROW", e;
}({}), Mt = /* @__PURE__ */ function(e) {
	return e.MERGE_FUNCTION = "MERGE_FUNCTION", e.COLLAPSE_FUNCTION = "COLLAPSE_FUNCTION", e.COLLAPSE_REPEATING_DESCENDANTS = "COLLAPSE_REPEATING_DESCENDANTS", e.RESET_CHILDREN = "RESET_CHILDREN", e.UNDO_ALL_ACTIONS = "UNDO_ALL_ACTIONS", e;
}({}), Nt = class extends t(D) {
	flameChartDelegate;
	chartViewport;
	dataProvider;
	candyStripePattern;
	candyStripePatternGray;
	contextMenu;
	viewportElement;
	canvas;
	context;
	popoverElement;
	markerHighlighElement;
	highlightElement;
	revealDescendantsArrowHighlightElement;
	selectedElement = null;
	rulerEnabled;
	barHeight;
	hitMarginPx;
	textBaseline;
	textPadding;
	highlightedMarkerIndex;
	highlightedEntryIndex;
	selectedEntryIndex;
	rawTimelineDataLength;
	markerPositions;
	customDrawnPositions;
	lastMouseOffsetX;
	selectedGroupIndex;
	keyboardFocusedGroup;
	offsetWidth;
	offsetHeight;
	dragStartX;
	dragStartY;
	lastMouseOffsetY;
	#e;
	maxDragOffset;
	timelineLevels;
	visibleLevelOffsets;
	visibleLevels;
	visibleLevelHeights;
	groupOffsets;
	rawTimelineData;
	forceDecorationCache;
	entryColorsCache;
	colorDimmingCache = /* @__PURE__ */ new Map();
	totalTime;
	lastPopoverState;
	dimIndices;
	dimShouldOutlineUndimmedEntries = !1;
	#t = 0;
	#n;
	#r;
	#i;
	#a = null;
	#o = !1;
	#s = !1;
	#c = null;
	#l = !0;
	#u = /* @__PURE__ */ new Map();
	#d = null;
	#f = this.#p.bind(this);
	constructor(e, t, n = {}) {
		super({ useShadowDom: !0 }), this.#n = `${L} ${I()}`, this.#r = `${gt} ${I()}`, this.registerRequiredCSS(lt), this.registerRequiredCSS(ie), this.contentElement.classList.add("flame-chart-main-pane"), typeof n.selectedElementOutline == "boolean" && (this.#l = n.selectedElementOutline), this.flameChartDelegate = t;
		let r = !0;
		if (typeof n.useOverlaysForCursorRuler == "boolean" && (r = !n.useOverlaysForCursorRuler), this.chartViewport = new Vt(this, { enableCursorElement: r }), this.chartViewport.show(this.contentElement), this.dataProvider = e, this.viewportElement = this.chartViewport.viewportElement, this.canvas = this.viewportElement.createChild("canvas", "fill"), n.canvasVELogContext) {
			let e = Ie(n.canvasVELogContext).track({ hover: !0 });
			this.canvas.setAttribute("jslog", `${e}`);
		}
		this.context = this.canvas.getContext("2d"), this.candyStripePattern = this.candyStripePatternGray = null, this.canvas.tabIndex = 0, x(this.canvas, B(z.flameChart)), Te(this.canvas), this.setDefaultFocusedElement(this.canvas), this.canvas.classList.add("flame-chart-canvas"), this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this), !1), this.canvas.addEventListener("mouseout", this.onMouseOut.bind(this), !1), this.canvas.addEventListener("click", this.onClick.bind(this), !1), this.canvas.addEventListener("dblclick", this.#x.bind(this), !1), this.canvas.addEventListener("keydown", this.onKeyDown.bind(this), !1), this.canvas.addEventListener("contextmenu", this.onContextMenu.bind(this), !1), this.popoverElement = n.tooltipElement || this.viewportElement.createChild("div", "flame-chart-entry-info"), this.markerHighlighElement = this.viewportElement.createChild("div", "flame-chart-marker-highlight-element"), this.highlightElement = this.viewportElement.createChild("div", "flame-chart-highlight-element"), this.revealDescendantsArrowHighlightElement = this.viewportElement.createChild("div", "reveal-descendants-arrow-highlight-element"), this.#l && (this.selectedElement = this.viewportElement.createChild("div", "flame-chart-selected-element")), this.canvas.addEventListener("focus", () => {
			this.dispatchEventToListeners("CanvasFocused");
		}, !1), S(this.viewportElement, this.startDragging.bind(this), this.dragging.bind(this), this.endDragging.bind(this), null), this.rulerEnabled = !0, this.barHeight = 17, this.hitMarginPx = 3, this.textBaseline = 5, this.textPadding = 5, this.chartViewport.setWindowTimes(e.minimumBoundary(), e.minimumBoundary() + e.totalTime()), this.highlightedMarkerIndex = -1, this.highlightedEntryIndex = -1, this.selectedEntryIndex = -1, this.#a = null, this.rawTimelineDataLength = 0, this.markerPositions = /* @__PURE__ */ new Map(), this.customDrawnPositions = /* @__PURE__ */ new Map(), this.lastMouseOffsetX = 0, this.selectedGroupIndex = -1, this.lastPopoverState = {
			entryIndex: -1,
			groupIndex: -1,
			hiddenEntriesPopover: !1
		}, this.keyboardFocusedGroup = -1;
	}
	#p() {
		this.scheduleUpdate();
	}
	wasShown() {
		super.wasShown(), A.instance().addEventListener(j.eventName, this.#f);
	}
	willHide() {
		A.instance().removeEventListener(j.eventName, this.#f), this.hideHighlight(), super.willHide();
	}
	canvasBoundingClientRect() {
		return this.#c && this.#c.width > 0 && this.#c.height > 0 || (this.#c = this.canvas.getBoundingClientRect()), this.#c;
	}
	verticalScrollBarVisible() {
		return this.chartViewport.verticalScrollBarVisible();
	}
	setTooltipYPixelAdjustment(e) {
		e !== this.#t && (this.#t = e, this.popoverElement.children.length && this.updatePopoverOffset());
	}
	getBarHeight() {
		return this.barHeight;
	}
	setBarHeight(e) {
		this.barHeight = e;
	}
	setTextBaseline(e) {
		this.textBaseline = e;
	}
	setTextPadding(e) {
		this.textPadding = e;
	}
	enableRuler(e) {
		this.rulerEnabled = e;
	}
	alwaysShowVerticalScroll() {
		this.chartViewport.alwaysShowVerticalScroll();
	}
	disableRangeSelection() {
		this.chartViewport.disableRangeSelection();
	}
	#m(e) {
		return this.dimIndices ? this.dimIndices[e] !== 0 : !1;
	}
	#h(e) {
		return !this.isDimming() || this.#m(e) ? !1 : ArrayBuffer.isView(this.dimShouldOutlineUndimmedEntries) ? this.dimShouldOutlineUndimmedEntries[e] !== 0 : this.dimShouldOutlineUndimmedEntries;
	}
	#g(e, t) {
		let n = new Uint8Array(this.rawTimelineDataLength);
		if (t) for (let t of e) n[t] = 1;
		else {
			n.fill(1);
			for (let t of e) n[t] = 0;
		}
		return n;
	}
	enableDimming(e, t, n) {
		this.dimIndices = this.#g(e, t), this.dimShouldOutlineUndimmedEntries = Array.isArray(n) ? this.#g(n, !0) : n, this.draw();
	}
	disableDimming() {
		this.dimIndices = null, this.dimShouldOutlineUndimmedEntries = !1, this.draw();
	}
	isDimming() {
		return !!this.dimIndices;
	}
	#_(e, t) {
		if (this.#m(e)) {
			let e = this.colorDimmingCache.get(t);
			if (e) return e;
			let r = n(t);
			return e = r ? r.asLegacyColor().grayscale().asString() : "lightgrey", this.colorDimmingCache.set(t, e), e;
		}
		return t;
	}
	getColorForEntry(e) {
		return this.entryColorsCache ? this.#_(e, this.entryColorsCache[e]) : "";
	}
	highlightEntry(e) {
		this.highlightedEntryIndex !== e && this.dataProvider.entryColor(e) && (this.highlightedEntryIndex = e, this.updateElementPosition(this.highlightElement, this.highlightedEntryIndex), this.dispatchEventToListeners("EntryHovered", e));
	}
	hideHighlight() {
		this.#a === null && (this.popoverElement.removeChildren(), this.lastPopoverState = {
			entryIndex: -1,
			groupIndex: -1,
			hiddenEntriesPopover: !1
		}), this.highlightedEntryIndex !== -1 && (this.highlightedEntryIndex = -1, this.updateElementPosition(this.highlightElement, this.highlightedEntryIndex), this.dispatchEventToListeners("EntryHovered", -1));
	}
	createCandyStripePattern(e) {
		let t = document.createElement("canvas");
		t.width = 17, t.height = 17;
		let n = t.getContext("2d", { willReadFrequently: !0 });
		n.translate(8.5, 8.5), n.rotate(Math.PI * .25), n.translate(-8.5, -8.5), n.fillStyle = e;
		for (let e = -17; e < 34; e += 3) n.fillRect(e, -17, 1, 51);
		return n.createPattern(t, "repeat");
	}
	resetCanvas() {
		let e = window.devicePixelRatio, t = Math.round(this.offsetWidth * e), n = Math.round(this.offsetHeight * e);
		this.canvas.width = t, this.canvas.height = n, this.canvas.style.width = `${t / e}px`, this.canvas.style.height = `${n / e}px`;
	}
	windowChanged(e, t, n) {
		this.flameChartDelegate.windowChanged(e, t, n);
	}
	updateRangeSelection(e, t) {
		this.flameChartDelegate.updateRangeSelection(e, t);
	}
	setSize(e, t) {
		this.offsetWidth = e, this.offsetHeight = t;
	}
	startDragging(e) {
		return this.hideHighlight(), this.maxDragOffset = 0, this.dragStartX = e.pageX, this.dragStartY = e.pageY, !0;
	}
	dragging(e) {
		let t = e.pageX - this.dragStartX, n = e.pageY - this.dragStartY;
		this.maxDragOffset = Math.max(this.maxDragOffset, Math.sqrt(t * t + n * n));
	}
	endDragging(e) {
		this.updateHighlight();
	}
	timelineData(e) {
		if (!this.dataProvider) return null;
		let t = this.dataProvider.timelineData(e);
		return (t !== this.rawTimelineData || t && t.entryStartTimes.length !== this.rawTimelineDataLength) && this.processTimelineData(t), this.rawTimelineData || null;
	}
	revealEntryVertically(e) {
		let t = this.timelineData();
		if (!t) return;
		let n = t.entryLevels[e];
		this.chartViewport.setScrollOffset(this.levelToOffset(n), this.levelHeight(n), !0);
	}
	revealEntry(e) {
		let t = this.timelineData();
		if (!t) return;
		let n = this.chartViewport.windowLeftTime(), r = this.chartViewport.windowRightTime(), i = t.entryStartTimes[e], a = t.entryTotalTimes[e];
		Number.isNaN(a) && (a = 1);
		let o = i + a, s = Math.min(a, r - n), c = t.entryLevels[e];
		this.chartViewport.setScrollOffset(this.levelToOffset(c), this.levelHeight(c));
		let l = (r - n) / this.offsetWidth;
		if (s = Math.max(s, l * 30), n > o) {
			let e = n - o + s;
			this.windowChanged(n - e, r - e, !0);
		} else if (r < i) {
			let e = i - r + s;
			this.windowChanged(n + e, r + e, !0);
		}
	}
	setWindowTimes(e, t, n) {
		this.chartViewport.setWindowTimes(e, t, n), this.updateHighlight();
	}
	onMouseMove(e) {
		if (this.#a = null, this.lastMouseOffsetX = e.offsetX, this.lastMouseOffsetY = e.offsetY, !this.enabled() || this.chartViewport.isDragging()) return;
		let t = N(this.chartViewport.pixelToTime(e.offsetX));
		this.dispatchEventToListeners("MouseMove", {
			mouseEvent: e,
			timeInMicroSeconds: Ge(t)
		});
		let { groupIndex: n, hoverType: r } = this.coordinatesToGroupIndexAndHoverType(e.offsetX, e.offsetY);
		switch (r) {
			case "TRACK_CONFIG_UP_BUTTON":
			case "TRACK_CONFIG_DOWN_BUTTON":
			case "TRACK_CONFIG_HIDE_BUTTON":
			case "TRACK_CONFIG_SHOW_BUTTON": {
				this.hideHighlight(), this.viewportElement.style.cursor = "pointer";
				let e = this.#v(n, r);
				e && (this.popoverElement.appendChild(e), this.updatePopoverOffset());
				return;
			}
			case "INSIDE_TRACK_HEADER":
				this.updateHighlight(), this.viewportElement.style.cursor = "pointer";
				return;
			case "INSIDE_TRACK":
			case "OUTSIDE_TRACKS":
				this.updateHighlight();
				return;
			case "ERROR": return;
			default: ze(r, `Invalid hovering type: ${r}`);
		}
	}
	#v(e, t) {
		let n = this.rawTimelineData?.groups[e];
		if (!n) return null;
		let r = Re(n.name, 20), i = "";
		switch (t) {
			case "TRACK_CONFIG_UP_BUTTON":
				i = `Move ${r} track up`;
				break;
			case "TRACK_CONFIG_DOWN_BUTTON":
				i = `Move ${r} track down`;
				break;
			case "TRACK_CONFIG_HIDE_BUTTON":
				i = this.groupIsLastVisibleTopLevel(e) ? "Can not hide the last top level track" : `Hide ${r} track`;
				break;
			case "TRACK_CONFIG_SHOW_BUTTON":
				i = `Show ${r} track`;
				break;
			default: return null;
		}
		let a = document.createElement("div");
		return a.createChild("span", "popoverinfo-title").textContent = i, a;
	}
	updateHighlight() {
		let e = this.coordinatesToEntryIndex(this.lastMouseOffsetX, this.lastMouseOffsetY);
		if (this.updateHiddenChildrenArrowHighlighPosition(e), e === -1) {
			this.hideHighlight();
			let { groupIndex: e, hoverType: t } = this.coordinatesToGroupIndexAndHoverType(this.lastMouseOffsetX, this.lastMouseOffsetY);
			t === "INSIDE_TRACK_HEADER" && this.#b(e), e >= 0 && this.rawTimelineData?.groups?.[e].selectable ? this.viewportElement.style.cursor = "pointer" : this.viewportElement.style.cursor = "default";
			return;
		}
		this.chartViewport.isDragging() || (this.#y(e), this.viewportElement.style.cursor = this.dataProvider.canJumpToEntry(e) ? "pointer" : "default", this.highlightEntry(e));
	}
	onMouseOut() {
		this.lastMouseOffsetX = -1, this.lastMouseOffsetY = -1, this.hideHighlight();
	}
	showPopoverForSearchResult(e) {
		this.#a = e, this.#y(e);
	}
	#y(e) {
		let t = e !== null && this.isMouseOverRevealChildrenArrow(this.lastMouseOffsetX, e);
		if (e === this.lastPopoverState.entryIndex && t === this.lastPopoverState.hiddenEntriesPopover) return this.updatePopoverOffset();
		let n = this.timelineData();
		if (!n) return;
		let r = n.groups.at(this.selectedGroupIndex), i = t && r ? this.dataProvider.preparePopoverForCollapsedArrow?.(e) : e !== null && this.dataProvider.preparePopoverElement(e);
		i && this.updatePopoverContents(i), this.lastPopoverState = {
			entryIndex: e,
			groupIndex: -1,
			hiddenEntriesPopover: t
		};
	}
	updatePopoverContents(e) {
		this.popoverElement.removeChildren(), this.popoverElement.appendChild(e), this.updatePopoverOffset(), this.lastPopoverState.entryIndex = -1;
	}
	updateMouseOffset(e, t) {
		this.lastMouseOffsetX = e, this.lastMouseOffsetY = t;
	}
	#b(e) {
		if (e === this.lastPopoverState.groupIndex) return this.updatePopoverOffset();
		this.popoverElement.removeChildren();
		let t = this.timelineData();
		if (!t) return;
		let n = t.groups.at(e);
		n?.description && (this.popoverElement.innerText = n?.description, this.updatePopoverOffset()), this.lastPopoverState = {
			groupIndex: e,
			entryIndex: -1,
			hiddenEntriesPopover: !1
		};
	}
	updatePopoverOffset() {
		let e = this.lastMouseOffsetX, t = this.lastMouseOffsetY;
		if (this.#a !== null) {
			let n = this.entryIndexToCoordinates(this.selectedEntryIndex), { x: r, y: i } = this.canvas.getBoundingClientRect();
			e = n?.x ? n.x - r : e, t = n?.y ? n.y - i : t;
		}
		let n = this.popoverElement.parentElement ? this.popoverElement.parentElement.clientWidth : 0, r = this.popoverElement.parentElement ? this.popoverElement.parentElement.clientHeight : 0, i = this.popoverElement.clientWidth, a = this.popoverElement.clientHeight, o = 6 + this.#t, s, c;
		for (let l = 0; l < 2; ++l) for (let u = 0; u < 4; ++u) {
			let d = u & 2 ? -10 - i : 10, f = u & 1 ? -o - a : o;
			if (s = b(e + d, 0, n - i), c = b(t + f, 0, r - a), l === 0 ? (s >= e || e >= s + i) && (c >= t || t >= c + a) : s >= e || e >= s + i || c >= t || t >= c + a) break;
		}
		this.popoverElement.style.left = s + "px", this.popoverElement.style.top = c + "px";
	}
	#x(e) {
		this.focus();
		let { groupIndex: t } = this.coordinatesToGroupIndexAndHoverType(e.offsetX, e.offsetY);
		if (this.highlightedEntryIndex !== -1) {
			this.#S(t), this.dispatchEventToListeners("EntryLabelAnnotationAdded", {
				entryIndex: this.highlightedEntryIndex,
				withLinkCreationButton: !0
			});
			let n = this.flameChartDelegate.containingElement?.();
			n && g(n, e, { doubleClick: !0 });
		}
	}
	onClick(e) {
		if (this.focus(), this.maxDragOffset > 5) return;
		let { groupIndex: t, hoverType: n } = this.coordinatesToGroupIndexAndHoverType(e.offsetX, e.offsetY);
		switch (n) {
			case "TRACK_CONFIG_UP_BUTTON":
				this.moveGroupUp(t);
				return;
			case "TRACK_CONFIG_DOWN_BUTTON":
				this.moveGroupDown(t);
				return;
			case "TRACK_CONFIG_HIDE_BUTTON":
				if (this.groupIsLastVisibleTopLevel(t)) return;
				this.hideGroup(t);
				return;
			case "TRACK_CONFIG_SHOW_BUTTON":
				this.showGroup(t);
				return;
			case "INSIDE_TRACK_HEADER":
				this.#S(t), this.toggleGroupExpand(t);
				return;
			case "INSIDE_TRACK":
			case "OUTSIDE_TRACKS": {
				this.#S(t);
				let n = this.timelineData();
				if (e.shiftKey && this.highlightedEntryIndex !== -1 && n) {
					let e = n.entryStartTimes[this.highlightedEntryIndex], t = e + n.entryTotalTimes[this.highlightedEntryIndex];
					this.chartViewport.setRangeSelection(e, t);
				} else this.chartViewport.onClick(e), this.dispatchEventToListeners("EntryInvoked", this.highlightedEntryIndex);
				return;
			}
		}
	}
	setLinkSelectionAnnotationIsInProgress(e) {
		this.#s = e;
	}
	#S(e) {
		if (e < 0 || this.selectedGroupIndex === e || !this.rawTimelineData) return;
		let t = this.rawTimelineData.groups;
		if (!t) return;
		this.keyboardFocusedGroup = e, this.#s || this.scrollGroupIntoView(e);
		let n = t[e].name;
		t[e].selectable ? (this.selectedGroupIndex = e, this.flameChartDelegate.updateSelectedGroup(this, t[e]), this.draw(), C.alert(B(z.sSelected, { PH1: n }))) : (this.deselectAllGroups(), C.alert(B(z.sHovered, { PH1: n })));
	}
	deselectAllGroups() {
		this.selectedGroupIndex = -1, this.flameChartDelegate.updateSelectedGroup(this, null), this.draw();
	}
	deselectAllEntries() {
		this.selectedEntryIndex = -1, this.rawTimelineData?.emptyInitiators(), this.draw();
	}
	isGroupFocused(e) {
		return e === this.selectedGroupIndex || e === this.keyboardFocusedGroup;
	}
	scrollGroupIntoView(e) {
		if (e < 0 || !this.rawTimelineData) return;
		let t = this.rawTimelineData.groups, n = this.groupOffsets;
		if (!n || !t) return;
		let r = n[e], i = n[e + 1];
		e === t.length - 1 && (i += t[e].style.padding);
		let a = e === 0 ? 0 : r, o = Math.min(i - a, this.chartViewport.chartHeight());
		this.chartViewport.setScrollOffset(a, o);
	}
	toggleGroupExpand(e) {
		e < 0 || !this.isGroupCollapsible(e) || this.rawTimelineData?.groups && this.expandGroup(e, !this.rawTimelineData.groups[e].expanded);
	}
	bulkExpandGroups(e) {
		if (e.length === 0 || !this.rawTimelineData) return;
		let t = this.rawTimelineData.groups;
		if (!t) return;
		let n = !1;
		for (let r of e) this.isGroupCollapsible(r) && !t[r].expanded && (n = !0, t[r].expanded = !0);
		n && this.#C();
	}
	#C() {
		this.updateLevelPositions(), this.updateHeight(), this.draw(), this.#w();
	}
	expandGroup(e, t = !0, n = !1) {
		if (e < 0 || !this.isGroupCollapsible(e) || !this.rawTimelineData) return;
		let r = this.rawTimelineData.groups;
		if (!r) return;
		let i = r[e];
		if (!t) {
			let t = this.timelineData();
			if (t) {
				let n = t.entryLevels[this.selectedEntryIndex];
				this.selectedEntryIndex >= 0 && n >= i.startLevel && (e >= r.length - 1 || r[e + 1].startLevel > n) && (this.selectedEntryIndex = -1, this.rawTimelineData.emptyInitiators());
			}
		}
		if (i.expanded !== t && (i.expanded = t, this.#C(), this.scrollGroupIntoView(e), !n)) {
			let t = r[e].name, n = i.expanded ? B(z.sExpanded, { PH1: t }) : B(z.sCollapsed, { PH1: t });
			C.alert(n);
		}
	}
	moveGroupUp(e) {
		if (!(e < 0) && this.rawTimelineData?.groups && this.#i) {
			for (let t = 0; t < this.#i.children.length; t++) {
				let n = this.#i.children[t];
				if (n.index === e && t >= 1) {
					this.#i.children[t] = this.#i.children[t - 1], this.#i.children[t - 1] = n;
					break;
				}
			}
			this.updateLevelPositions(), this.updateHighlight(), this.updateHeight(), this.draw(), this.#w();
		}
	}
	#w() {
		if (!this.#i || !this.dataProvider.handleTrackConfigurationChange) return;
		let e = this.rawTimelineData?.groups;
		if (!e) return;
		let t = this.#T(this.#i);
		this.dataProvider.handleTrackConfigurationChange(e, t);
	}
	#T(e) {
		let t = [];
		function n(e) {
			e.index !== -1 && t.push(e.index);
			for (let t of e.children) n(t);
		}
		return n(e), t;
	}
	moveGroupDown(e) {
		if (!(e < 0) && this.rawTimelineData?.groups && this.#i) {
			for (let t = 0; t < this.#i.children.length; t++) {
				let n = this.#i.children[t];
				if (n.index === e && t <= this.#i.children.length - 2) {
					this.#i.children[t] = this.#i.children[t + 1], this.#i.children[t + 1] = n;
					break;
				}
			}
			this.updateLevelPositions(), this.updateHighlight(), this.updateHeight(), this.draw(), this.#w();
		}
	}
	hideGroup(e) {
		this.#E(e, !0);
	}
	showGroup(e) {
		this.#E(e, !1);
	}
	showAllGroups() {
		if (this.rawTimelineData?.groups) {
			for (let e of this.rawTimelineData.groups) e.hidden = !1;
			this.updateLevelPositions(), this.updateHighlight(), this.updateHeight(), this.draw(), this.#w(), this.scrollGroupIntoView(0);
		}
	}
	#E(e, t) {
		if (e < 0 || !this.rawTimelineData?.groups) return;
		let n = this.rawTimelineData.groups;
		if (!n) return;
		let r = n[e];
		r.hidden = t, this.updateLevelPositions(), this.updateHighlight(), this.updateHeight(), this.draw(), this.#w();
	}
	modifyTree(e, t) {
		this.timelineData() && this.dataProvider.modifyTree && (this.dataProvider.modifyTree(e, t), this.update());
	}
	#D(e) {
		if (this.#o) return;
		this.contextMenu = new ye(e);
		let t = B(z.enterTrackConfigurationMode);
		this.contextMenu.defaultSection().appendItem(t, () => {
			this.enterTrackConfigurationMode();
		}, { jslogContext: "track-configuration-enter" }), this.contextMenu.show();
	}
	#O(e) {
		if (this.#o === !1) return;
		this.contextMenu = new ye(e);
		let t = B(z.exitTrackConfigurationMode);
		this.contextMenu.defaultSection().appendItem(t, () => {
			this.#N();
		}, { jslogContext: "track-configuration-exit" }), this.contextMenu.show();
	}
	#k() {
		return !!this.dataProvider.hasTrackConfigurationMode?.();
	}
	onContextMenu(e) {
		let { groupIndex: t, hoverType: n } = this.coordinatesToGroupIndexAndHoverType(e.offsetX, e.offsetY);
		if (this.#o) {
			this.#O(e);
			return;
		}
		n === "INSIDE_TRACK_HEADER" && this.#k() && this.#D(e);
		let r = e.detail === ht, i = r ? this.selectedEntryIndex : this.highlightedEntryIndex;
		if (i === -1) return;
		r || (this.dispatchEventToListeners("EntryInvoked", i), this.setSelectedEntry(i), this.#S(t)), this.contextMenu = this.dataProvider.customizedContextMenu?.(e, this.selectedEntryIndex, t) ?? new ye(e);
		let a = this.contextMenu.annotationSection();
		a.appendItem(B(z.labelEntry), () => {
			this.dispatchEventToListeners("EntryLabelAnnotationAdded", {
				entryIndex: this.selectedEntryIndex,
				withLinkCreationButton: !1
			});
		}, { jslogContext: "timeline.annotations.create-entry-label" }), a.appendItem(B(z.linkEntries), () => {
			this.dispatchEventToListeners("EntriesLinkAnnotationCreated", { entryFromIndex: this.selectedEntryIndex });
		}, { jslogContext: "timeline.annotations.create-entries-link" }), this.contextMenu.show();
	}
	#A(e) {
		this.selectedEntryIndex !== -1 && this.dataProvider.handleFlameChartTransformKeyboardEvent?.(e, this.selectedEntryIndex, this.selectedGroupIndex);
	}
	#j() {
		let e = this.timelineData()?.entryStartTimes[this.selectedEntryIndex], t = this.timelineData()?.entryLevels[this.selectedEntryIndex];
		if (!e || !t) return;
		let n = this.canvasBoundingClientRect();
		if (!n) return;
		let r = this.chartViewport.timeToPosition(e) + n.left, i = this.levelToOffset(t) - this.getScrollOffset() + n.top, a = new MouseEvent("contextmenu", {
			clientX: r,
			clientY: i,
			detail: ht
		});
		this.canvas.dispatchEvent(a);
	}
	onKeyDown(e) {
		if (ue.hasAtLeastOneModifier(e) || !this.timelineData()) return;
		e.key === " " && this.selectedEntryIndex > -1 && this.#j();
		let t = this.handleSelectionNavigation(e);
		!t && this.rawTimelineData?.groups && (t = this.handleKeyboardGroupNavigation(e)), t || this.#A(e);
	}
	bindCanvasEvent(e, t) {
		this.canvas.addEventListener(e, t);
	}
	drawTrackOnCanvas(e, t, n) {
		let r = this.timelineData();
		if (!r) return null;
		let i = this.offsetWidth, a = this.offsetHeight;
		t.save();
		let o = window.devicePixelRatio;
		t.scale(o, o), t.fillStyle = "rgba(0, 0, 0, 0)", t.fillRect(0, 0, i, a), t.font = this.#n;
		let s = this.rawTimelineData?.groups || [], c = this.groupOffsets;
		if (!s.length || !c) return null;
		let l = s.findIndex((t) => t.name.includes(e));
		if (l < 0) return null;
		this.scrollGroupIntoView(l);
		let u = s[l].startLevel, d = s[l + 1].startLevel, f = c[l], p = c[l + 1], { drawBatches: m, titleIndices: h } = this.getDrawBatches(t, r), g = (e) => {
			let t = Math.min(this.#R(r, e), i);
			return r.entryLevels[e] >= u && r.entryLevels[e] < d && t > n;
		}, _ = [];
		for (let [{ color: e, outline: n }, { indexes: i }] of m) {
			let a = i.filter(g);
			_ = [..._, ...a], this.#P(t, r, e, a, n);
		}
		let v = h.filter(g);
		return this.drawEventTitles(t, r, v, i), t.restore(), {
			top: c[l],
			height: p - f,
			visibleEntries: new Set(_)
		};
	}
	handleKeyboardGroupNavigation(e) {
		let t = e, n = !1, r = !1;
		return t.code === "ArrowUp" ? n = this.selectPreviousGroup() : t.code === "ArrowDown" ? n = this.selectNextGroup() : t.code === "ArrowLeft" ? this.keyboardFocusedGroup >= 0 && (this.expandGroup(this.keyboardFocusedGroup, !1), n = !0) : t.code === "ArrowRight" ? this.keyboardFocusedGroup >= 0 && (this.expandGroup(this.keyboardFocusedGroup, !0), this.selectFirstChild(), n = !0) : t.key === "Enter" && (r = this.selectFirstEntryInCurrentGroup(), n = r), n && !r && this.deselectAllEntries(), n && t.consume(!0), n;
	}
	selectFirstEntryInCurrentGroup() {
		if (!this.rawTimelineData) return !1;
		let e = this.rawTimelineData.groups;
		if (this.keyboardFocusedGroup < 0 || !e) return !1;
		let t = e[this.keyboardFocusedGroup], n = t.startLevel;
		if (n < 0 || this.keyboardFocusedGroup < e.length - 1 && e[this.keyboardFocusedGroup + 1].startLevel === n || !this.timelineLevels) return !1;
		let r = this.timelineData();
		if (!r) return !1;
		let i = N(1), a = this.timelineLevels[n].find(((e) => {
			let t = r.entryTotalTimes[e];
			return !Number.isNaN(t) && t >= i;
		}));
		a === void 0 && (a = this.timelineLevels[n][0]), this.expandGroup(this.keyboardFocusedGroup, !0);
		let o = this.dataProvider.entryTitle(a);
		return o && C.alert(B(z.eventSelectedFromGroup, {
			PH1: o,
			PH2: t.name
		})), this.setSelectedEntry(a), !0;
	}
	selectPreviousGroup() {
		if (this.keyboardFocusedGroup <= 0) return !1;
		let e = this.getGroupIndexToSelect(-1);
		return this.#S(e), !0;
	}
	selectNextGroup() {
		if (!this.rawTimelineData?.groups || this.keyboardFocusedGroup >= this.rawTimelineData.groups.length - 1) return !1;
		let e = this.getGroupIndexToSelect(1);
		return this.#S(e), !0;
	}
	getGroupIndexToSelect(e) {
		if (!this.rawTimelineData?.groups) throw Error("No raw timeline data");
		let t = this.rawTimelineData.groups, n = this.keyboardFocusedGroup, r, i;
		do
			n += e, r = this.rawTimelineData.groups[n].name, i = this.keyboardFocusedGroup !== -1 && t[n].style.nestingLevel > t[this.keyboardFocusedGroup].style.nestingLevel;
		while (n > 0 && n < t.length - 1 && (!r || i));
		return n;
	}
	selectFirstChild() {
		if (!this.rawTimelineData?.groups) return;
		let e = this.rawTimelineData.groups;
		if (this.keyboardFocusedGroup < 0 || this.keyboardFocusedGroup >= e.length - 1) return;
		let t = this.keyboardFocusedGroup + 1;
		e[t].style.nestingLevel > e[this.keyboardFocusedGroup].style.nestingLevel && this.#S(t);
	}
	handleSelectionNavigation(e) {
		if (this.selectedEntryIndex === -1) return !1;
		let t = this.timelineData();
		if (!t) return !1;
		function n(e, n) {
			if (!t) throw Error("No timeline data");
			return e - t.entryStartTimes[n];
		}
		function r(e, n) {
			if (!t) throw Error("No timeline data");
			let r = t.entryStartTimes[e], i = t.entryStartTimes[n], a = r + t.entryTotalTimes[e];
			return r < i + t.entryTotalTimes[n] && i < a;
		}
		let i = e, a = ne;
		if (i.keyCode === a.Left.code || i.keyCode === a.Right.code) {
			let n = t.entryLevels[this.selectedEntryIndex], r = this.timelineLevels ? this.timelineLevels[n] : [], o = f(r, this.selectedEntryIndex, (e, t) => e - t);
			return o += i.keyCode === a.Left.code ? -1 : 1, e.consume(!0), o >= 0 && o < r.length && this.dispatchEventToListeners("EntrySelected", r[o]), !0;
		}
		if (i.keyCode === a.Up.code || i.keyCode === a.Down.code) {
			let e = t.entryLevels[this.selectedEntryIndex];
			if (e += i.keyCode === a.Up.code ? -1 : 1, e < 0 || this.timelineLevels && e >= this.timelineLevels.length) return this.deselectAllEntries(), i.consume(!0), !0;
			let o = t.entryStartTimes[this.selectedEntryIndex] + t.entryTotalTimes[this.selectedEntryIndex] / 2, s = this.timelineLevels ? this.timelineLevels[e] : [], l = c(s, o, n) - 1;
			return !r(this.selectedEntryIndex, s[l]) && (++l, l >= s.length || !r(this.selectedEntryIndex, s[l])) ? i.code !== "ArrowDown" && (this.deselectAllEntries(), i.consume(!0), !0) : (i.consume(!0), this.dispatchEventToListeners("EntrySelected", s[l]), !0);
		}
		return e.key === "Enter" && (e.consume(!0), this.dispatchEventToListeners("EntryInvoked", this.selectedEntryIndex), this.dispatchEventToListeners("EntryLabelAnnotationAdded", {
			entryIndex: this.selectedEntryIndex,
			withLinkCreationButton: !0
		}), !0);
	}
	coordinatesToEntryIndex(e, t) {
		if (e < 0 || t < 0) return -1;
		let n = this.timelineData();
		if (!n) return -1;
		if (t += this.chartViewport.scrollOffset(), !this.visibleLevelOffsets || !this.visibleLevelHeights || !this.visibleLevels) throw Error("No visible level offsets or heights");
		let r = -1;
		for (let e = 0; e < this.dataProvider.maxStackDepth(); e++) if (t >= this.visibleLevelOffsets[e] && t < this.visibleLevelOffsets[e] + (this.visibleLevels[e] ? this.visibleLevelHeights[e] : 0)) {
			r = e;
			break;
		}
		if (r < 0 || !this.visibleLevels[r] || t - this.visibleLevelOffsets[r] > this.levelHeight(r)) return -1;
		for (let [t, i] of this.customDrawnPositions) if (n.entryLevels[t] === r && i.x <= e && e < i.x + i.width) return t;
		for (let [t, i] of this.markerPositions) if (n.entryLevels[t] === r && i.x <= e && e < i.x + i.width) return t;
		let i = n.entryStartTimes, a = this.timelineLevels ? this.timelineLevels[r] : [];
		if (!a?.length) return -1;
		let o = this.chartViewport.pixelToTime(e), s = Math.max(c(a, o, (e, t) => e - i[t]) - 1, 0);
		function l(t) {
			if (t === void 0 || !n) return !1;
			let r = i[t], a = n.entryTotalTimes[t], o = this.chartViewport.timeToPosition(r), s = this.chartViewport.timeToPosition(r + a);
			return o - this.hitMarginPx < e && e < s + this.hitMarginPx;
		}
		let u = a[s];
		return l.call(this, u) || (u = a[s + 1], l.call(this, u)) ? u : -1;
	}
	isMouseOverRevealChildrenArrow(e, t) {
		if (!this.entryHasDecoration(t, "HIDDEN_DESCENDANTS_ARROW")) return !1;
		let n = this.timelineData();
		if (!n) return !1;
		let r = n.entryStartTimes[t], i = n.entryTotalTimes[t], a = this.chartViewport.timeToPosition(r + i);
		return a - this.#L(n, t) - this.hitMarginPx < e && e < a + this.hitMarginPx;
	}
	entryIndexToCoordinates(e) {
		let t = this.timelineData(), { x: n, y: r } = this.canvas.getBoundingClientRect();
		return !t || !this.visibleLevelOffsets ? null : {
			x: this.chartViewport.timeToPosition(t.entryStartTimes[e]) + n,
			y: this.visibleLevelOffsets[t.entryLevels[e]] - this.chartViewport.scrollOffset() + r
		};
	}
	entryTitle(e) {
		return this.dataProvider.entryTitle(e);
	}
	getCanvasOffset() {
		return this.canvas.getBoundingClientRect();
	}
	getCanvas() {
		return this.canvas;
	}
	getScrollOffset() {
		return this.chartViewport.scrollOffset();
	}
	getContextMenu() {
		return this.contextMenu;
	}
	coordinatesToGroupIndexAndHoverType(e, t) {
		if (!this.rawTimelineData?.groups || !this.groupOffsets || e < 0 || t < 0) return {
			groupIndex: -1,
			hoverType: "ERROR"
		};
		t += this.chartViewport.scrollOffset();
		let n = this.rawTimelineData.groups || [];
		if (this.#i) {
			let r = this.#T(this.#i);
			if (r.length !== n.length) return console.warn("The data from the group tree doesn't match the data from DataProvider."), {
				groupIndex: -1,
				hoverType: "ERROR"
			};
			r.push(n.length);
			for (let i = 0; i < r.length; i++) {
				let a = r[i], o = r[i + 1] ?? r.length;
				if (t >= this.groupOffsets[a] && t < this.groupOffsets[o]) {
					let r = this.context;
					r.save(), r.font = this.#n;
					let i = V + (this.#o ? Tt : 0) + this.labelWidthForGroup(r, n[a]);
					r.restore();
					let o = t >= this.groupOffsets[a] && t < this.groupOffsets[a] + n[a].style.height;
					if (this.#o) {
						if (o) {
							if (St <= e && e < 22) return {
								groupIndex: a,
								hoverType: "TRACK_CONFIG_UP_BUTTON"
							};
							if (Ct <= e && e < 41) return {
								groupIndex: a,
								hoverType: "TRACK_CONFIG_DOWN_BUTTON"
							};
							if (wt <= e && e < 60) return {
								groupIndex: a,
								hoverType: n[a].hidden ? "TRACK_CONFIG_SHOW_BUTTON" : "TRACK_CONFIG_HIDE_BUTTON"
							};
							if (o && e <= i) return {
								groupIndex: a,
								hoverType: "INSIDE_TRACK_HEADER"
							};
						}
					} else return o && e <= i ? {
						groupIndex: a,
						hoverType: "INSIDE_TRACK_HEADER"
					} : {
						groupIndex: a,
						hoverType: "INSIDE_TRACK"
					};
				}
			}
		}
		return {
			groupIndex: -1,
			hoverType: "OUTSIDE_TRACKS"
		};
	}
	enterTrackConfigurationMode() {
		if (!this.#k()) return;
		let e = document.createElement("div");
		e.classList.add("flame-chart-edit-confirm");
		let t = new fe();
		t.data = {
			variant: m.PRIMARY,
			jslogContext: "track-configuration-exit"
		}, t.innerText = B(z.exitTrackConfigurationMode), e.appendChild(t), t.addEventListener("click", () => {
			this.#N();
		}), this.viewportElement.appendChild(e), this.#o = !0, this.dispatchEventToListeners("TracksReorderStateChange", !0), this.updateLevelPositions(), this.draw(), this.scrollGroupIntoView(0);
	}
	#M() {
		let e = this.viewportElement.querySelector(".flame-chart-edit-confirm");
		e && this.viewportElement.removeChild(e);
	}
	#N() {
		this.#M(), this.#o = !1, this.dispatchEventToListeners("TracksReorderStateChange", !1), this.updateLevelPositions(), this.draw();
	}
	markerIndexBeforeTime(e) {
		let t = this.timelineData();
		if (!t) throw Error("No timeline data");
		if (!t.markers) throw Error("No timeline markers");
		return f(t.markers, e, (e, t) => e - t.startTime());
	}
	draw() {
		let e = this.timelineData();
		if (!e) return;
		this.resetCanvas(), this.dispatchEventToListeners("LatestDrawDimensions", {
			chart: {
				widthPixels: this.offsetWidth,
				heightPixels: this.offsetHeight,
				scrollOffsetPixels: this.chartViewport.scrollOffset(),
				allGroupsCollapsed: this.rawTimelineData?.groups.every((e) => !e.expanded) ?? !0
			},
			traceWindow: Ke(this.minimumBoundary(), this.maximumBoundary())
		});
		let t = this.offsetWidth, n = this.offsetHeight, r = this.context;
		r.save();
		let i = window.devicePixelRatio, a = this.chartViewport.scrollOffset();
		r.scale(i, i), r.fillStyle = "rgba(0, 0, 0, 0)", r.fillRect(0, 0, t, n), r.translate(0, -a), r.font = this.#n;
		let { markerIndices: o, drawBatches: s, titleIndices: c } = this.getDrawBatches(r, e);
		for (let [{ color: t, outline: n }, { indexes: i }] of s) this.#P(r, e, t, i, n);
		this.#o || (this.#z(r, e), this.drawMarkers(r, e, o)), this.drawEventTitles(r, e, c, t);
		let l = Array.from(s.values()).map((e) => e.indexes).flat();
		this.#F(r, e, l), r.restore(), this.drawGroupHeaders(t, n), this.drawFlowEvents(r, e), this.drawMarkerLines();
		let u = R.calculateGridOffsets(this), d = this.dataProvider.mainFrameNavigationStartEvents?.() || [], f = 0;
		R.drawCanvasGrid(r, u), this.rulerEnabled && R.drawCanvasHeaders(r, u, (e) => {
			if (d.length === 0) return this.formatValue(e, u.precision);
			if (d.length > f + 1) {
				let t = d[f + 1], n = M(t.ts);
				e > n && f++;
			}
			let t = d[f];
			if (t) {
				let n = M(t.ts);
				e -= n - this.zeroTime();
			}
			return this.formatValue(e, u.precision);
		}, 3, 15), this.updateElementPosition(this.highlightElement, this.highlightedEntryIndex), this.updateElementPosition(this.selectedElement, this.selectedEntryIndex), this.#a !== null && this.showPopoverForSearchResult(this.#a), this.updateMarkerHighlight();
	}
	#P(e, t, n, r, i) {
		e.save(), e.beginPath();
		for (let n = 0; n < r.length; ++n) {
			let i = r[n];
			this.#u.has(i) || this.#I(e, t, i);
		}
		i && (e.strokeStyle = `color-mix(in srgb, ${n}, ${A.instance().getComputedValue("--ref-palette-neutral10")} 60%)`, e.stroke()), e.fillStyle = n, e.fill(), e.restore();
	}
	#F(e, t, r) {
		let { entryTotalTimes: i, entryStartTimes: a, entryLevels: o } = t;
		e.save();
		for (let s = 0; s < r.length; ++s) {
			let c = r[s], l = t.entryDecorations.at(c);
			if (!l || l.length < 1) continue;
			l.length > 1 && Lt(l);
			let u = a[c], d = i[c], f = this.timeToPositionClipped(u), p = o[c], m = this.#L(t, c), h = this.levelToOffset(p), g = this.#R(t, c);
			for (let r of l) switch (r.type) {
				case "CANDY": {
					let i = M(r.startAtTime);
					if (d < i) continue;
					if (!this.candyStripePattern || !this.candyStripePatternGray) {
						let e = "rgba(255, 0, 0, 0.8)";
						this.candyStripePattern = this.createCandyStripePattern(e);
						let t = n(e)?.asLegacyColor().grayscale().asString() ?? "lightgrey";
						this.candyStripePatternGray = this.createCandyStripePattern(t);
					}
					e.save(), e.beginPath();
					let a = this.timeToPositionClipped(u + i), o = this.timeToPositionClipped(u + d);
					this.#I(e, t, c, {
						startX: a,
						width: o - a
					}), e.fillStyle = this.#m(c) ? this.candyStripePatternGray : this.candyStripePattern, e.fill(), e.restore();
					break;
				}
				case "WARNING_TRIANGLE": {
					let t = f + g;
					if (r.customEndTime !== void 0) {
						let e = M(r.customEndTime);
						t = this.timeToPositionClipped(e), g = t - f;
					}
					let n = 8;
					if (r.customStartTime !== void 0) {
						let e = M(r.customStartTime), i = this.timeToPositionClipped(e);
						n = Math.min(t - i, 8);
					}
					e.save(), e.beginPath(), e.rect(f, h, g, m), e.clip(), e.beginPath(), e.fillStyle = this.#_(c, "red"), e.moveTo(f + g - n, h), e.lineTo(f + g, h), e.lineTo(f + g, h + 8), e.fill(), e.restore();
					break;
				}
				case "HIDDEN_DESCENDANTS_ARROW":
					if (e.save(), e.beginPath(), e.rect(f, h, g, m), g > m * 2) {
						e.clip(), e.beginPath(), e.fillStyle = "#474747";
						let t = f + g - 7 - 5, n = h + 6;
						e.moveTo(t, n);
						let r = f + g - 5, i = h + 6;
						e.lineTo(r, i);
						let a = f + g - 5 - 7 / 2, o = h + m - 6;
						e.lineTo(a, o);
					} else e.clip(), e.beginPath(), e.fillStyle = "#474747", e.moveTo(f + g - 8, h + m), e.lineTo(f + g, h + m), e.lineTo(f + g, h + 8);
					e.fill(), e.restore();
			}
		}
		e.restore();
	}
	#I(e, t, n, r) {
		let { entryTotalTimes: i, entryStartTimes: a, entryLevels: o } = t, s = i[n];
		if (isNaN(s)) return;
		let c = a[n], l = r?.startX ?? this.timeToPositionClipped(c), u = o[n], d = this.#L(t, n), f = this.levelToOffset(u), p = r?.width ?? this.#R(t, n);
		p !== 0 && e.rect(l, f, p - .5, d - 1);
	}
	#L(e, t) {
		let { entryLevels: n } = e, r = n[t];
		return this.levelHeight(r);
	}
	entryWidth(e) {
		let t = this.timelineData();
		return t ? this.#R(t, e) : 0;
	}
	#R(e, t) {
		let { entryTotalTimes: n, entryStartTimes: r } = e, i = n[t], a = r[t], o = this.timeToPositionClipped(a), s = this.timeToPositionClipped(a + i);
		return Math.max(s - o, 1);
	}
	getDrawBatches(e, t) {
		let n = [], r = [], { entryTotalTimes: i, entryStartTimes: a } = t, o = this.chartViewport.scrollOffset(), s = 2 * this.textPadding + k(e, "…"), c = this.chartViewport.pixelToTimeOffset(s), l = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map(), d = (e, t) => {
			let n = t ? l : u, r = n.get(e);
			if (r) return r;
			let i = {
				color: e,
				outline: t
			};
			return n.set(e, i), i;
		}, p = /* @__PURE__ */ new Map();
		for (let e = 0; e < this.dataProvider.maxStackDepth(); ++e) {
			if (this.levelToOffset(e) + this.levelHeight(e) < o || this.levelToOffset(e) > o + this.offsetHeight || !this.visibleLevels?.[e]) continue;
			if (!this.timelineLevels) break;
			let t = this.timelineLevels[e], s = f(t, this.chartViewport.windowRightTime(), (e, t) => e - a[t]) - 1, l = Infinity;
			for (let o = s; o >= 0; --o) {
				let s = t[o], u = i[s];
				if (isNaN(u)) {
					r.push(s);
					continue;
				}
				(u >= c || this.forceDecorationCache?.[s]) && n.push(s);
				let f = a[s], m = f + u, h = !!this.dataProvider.forceDrawableLevel?.(e);
				if (m <= this.chartViewport.windowLeftTime() && !h) break;
				let g = this.timeToPositionClipped(f);
				if (!(g >= l) && (l = g, this.entryColorsCache)) {
					let e = d(this.getColorForEntry(s), this.#h(s)), t = p.get(e);
					t || (t = { indexes: [] }, p.set(e, t)), t.indexes.push(s);
				}
			}
		}
		return {
			drawBatches: p,
			titleIndices: n,
			markerIndices: r
		};
	}
	drawGroupHeaders(e, t) {
		let r = this.context, i = this.chartViewport.scrollOffset(), a = window.devicePixelRatio;
		if (!this.rawTimelineData) return;
		let o = this.rawTimelineData.groups || [];
		if (!o.length) return;
		let s = this.groupOffsets;
		if (s == null) return;
		let c = s[s.length - 1];
		r.save(), r.scale(a, a), r.translate(0, -i), r.font = this.#n, r.fillStyle = A.instance().getComputedValue("--sys-color-cdt-base-container"), this.forEachGroupInViewport((t, n, i) => {
			let a = i.style.padding;
			a < 5 || r.fillRect(0, t - a + 2, e, a - 4);
		}), o.length && c < i + t && r.fillRect(0, c + 2, e, i + t - c), r.strokeStyle = A.instance().getComputedValue("--sys-color-neutral-container"), r.beginPath(), this.forEachGroupInViewport((t, n, i, a) => {
			a || i.style.padding < 4 || ot(r, e, t - 2.5);
		}), ot(r, e, c + 1.5), r.stroke(), this.forEachGroupInViewport((t, n, i) => {
			if (i.style.useFirstLineForOverview) return;
			if (!this.isGroupCollapsible(n) || i.expanded) {
				!i.style.shareHeaderLine && this.isGroupFocused(n) && (r.fillStyle = i.style.backgroundColor, r.fillRect(0, t, e, i.style.height));
				return;
			}
			let a = n + 1;
			for (; a < o.length && o[a].style.nestingLevel > i.style.nestingLevel;) a++;
			let s = a < o.length ? o[a].startLevel : this.dataProvider.maxStackDepth();
			this.drawCollapsedOverviewForGroup(i, t, s);
		}), r.save();
		let l = o.length > 1, u = this.#o ? Tt : 0;
		this.forEachGroupInViewport((e, t, i) => {
			if (r.font = this.#n, this.isGroupCollapsible(t) && !i.expanded || i.style.shareHeaderLine) {
				let t = this.labelWidthForGroup(r, i), a = n(i.style.backgroundColor);
				a && (r.fillStyle = a.setAlpha(.8).asString()), r.fillRect(u + V, e + bt, t, i.style.height - 4);
			}
			r.fillStyle = this.#o && i.hidden ? A.instance().getComputedValue("--sys-color-token-subtle", this.contentElement) : i.style.color;
			let a = u + vt * (i.style.nestingLevel + 1) + 4 + yt, o = e + i.style.height - this.textBaseline;
			if (r.fillText(i.name, a, o), i.subtitle) {
				let e = r.measureText(i.name);
				r.font = this.#r, r.fillText(i.subtitle, a + e.width + xt, o - 1), r.font = this.#n;
			}
			if (this.#o && i.hidden && r.fillRect(a, e + i.style.height / 2, k(r, i.name), 1), l && this.#o) {
				let n = i.hidden ? "--sys-color-token-subtle" : "--sys-color-on-surface";
				i.style.nestingLevel === 0 && (ct(r, St, e, 16, Et, n), ct(r, Ct, e, 16, Dt, n)), ct(r, wt, e, 16, i.hidden ? kt : Ot, this.groupIsLastVisibleTopLevel(t) ? "--sys-color-state-disabled" : n);
			}
		}), r.restore(), r.fillStyle = A.instance().getComputedValue("--sys-color-token-subtle"), this.forEachGroupInViewport((e, t, n) => {
			this.isGroupCollapsible(t) && st(r, u + vt * (n.style.nestingLevel + 1), e + n.style.height - this.textBaseline - 4, !this.#o && !!n.expanded);
		}), r.strokeStyle = A.instance().getComputedValue("--sys-color-neutral-outline"), r.beginPath(), r.stroke(), this.forEachGroupInViewport((e, t, n, i, a) => {
			this.isGroupFocused(t) && (r.fillStyle = A.instance().getComputedValue("--selected-group-border", this.contentElement), r.fillRect(0, e - 2, 2, a - n.style.padding + 4), r.fillRect(0, e - 2, 10, 2), r.fillRect(0, e + a - n.style.padding, 10, 2));
		}), r.restore();
	}
	drawMarkers(e, t, n) {
		let { entryStartTimes: r, entryLevels: i } = t;
		this.markerPositions.clear(), e.textBaseline = "alphabetic", e.save(), e.beginPath();
		let a = -1, o = -Infinity;
		for (let t = n.length - 1; t >= 0; --t) {
			let s = n[t], c = this.entryTitle(s);
			if (!c) continue;
			let l = r[s], u = i[s];
			a !== u && (o = -Infinity);
			let d = Math.max(this.chartViewport.timeToPosition(l), o), f = this.levelToOffset(u), p = this.levelHeight(u), m = Math.ceil(k(e, c)) + 8;
			o = d + m + 1, a = u, this.markerPositions.set(s, {
				x: d,
				width: m
			}), e.fillStyle = this.getColorForEntry(s), e.fillRect(d, f, m, p - 1), e.fillStyle = "white", e.fillText(c, d + 4, f + p - this.textBaseline);
		}
		e.strokeStyle = "rgba(0, 0, 0, 0.2)", e.stroke(), e.restore();
	}
	#z(e, t) {
		let { entryStartTimes: n, entryTotalTimes: r, entryLevels: i } = t;
		this.customDrawnPositions.clear(), e.save();
		let a = [];
		for (let [t, o] of this.#u.entries()) {
			let s = n[t], c = r[t], l = i[t];
			if (this.dataProvider.groupForEvent?.(t)?.hidden) continue;
			let u = this.chartViewport.timeToPosition(s), d = this.chartViewport.timeToPosition(s + c), f = u, p = this.levelToOffset(l), m = this.levelHeight(l), h = o(e, f, p, d - u, m, (e) => this.chartViewport.timeToPosition(e), (e) => this.#_(t, e));
			a.push({
				entryIndex: t,
				pos: h
			});
		}
		a.sort((e, t) => (t.pos.z ?? 0) - (e.pos.z ?? 0));
		for (let { entryIndex: e, pos: t } of a) this.customDrawnPositions.set(e, t);
		e.restore();
	}
	drawEventTitles(e, t, n, r) {
		let i = this.chartViewport.timeToPixel(), a = this.textPadding;
		e.save(), e.beginPath();
		let { entryStartTimes: o, entryLevels: s } = t;
		for (let c = 0; c < n.length; ++c) {
			let l = n[c], u = o[l], d = this.timeToPositionClipped(u), f = Math.min(this.#R(t, l), r), p = s[l], m = this.levelToOffset(p), h = this.dataProvider.entryTitle(l), g = this.#L(t, l);
			if (h?.length) {
				e.font = this.#n;
				let t = this.entryHasDecoration(l, "HIDDEN_DESCENDANTS_ARROW") && f > g * 2 ? f - a - this.barHeight : f - 2 * a;
				h = Ne(e, h, t);
			}
			let _ = this.chartViewport.timeToPosition(u);
			this.dataProvider.decorateEntry(l, e, h, d, m, f, g, _, i, (e) => this.#_(l, e)) || h?.length && (e.fillStyle = this.#_(l, this.dataProvider.textColor(l)), e.fillText(h, d + a, m + g - this.textBaseline));
		}
		e.restore();
	}
	forEachGroup(e) {
		if (!this.rawTimelineData) return;
		let t = this.rawTimelineData.groups || [];
		if (!t.length) return;
		let n = this.groupOffsets;
		if (!n) return;
		let r = [{
			nestingLevel: -1,
			visible: !0
		}];
		for (let i = 0; i < t.length; ++i) {
			let a = n[i], o = t[i], s = !0, c = r[r.length - 1];
			for (; c && c.nestingLevel >= o.style.nestingLevel;) r.pop(), s = !1, c = r[r.length - 1];
			c = r[r.length - 1];
			let l = c ? c.visible : !1, u = !o.hidden && l && (!this.isGroupCollapsible(i) || o.expanded);
			if (r.push({
				nestingLevel: o.style.nestingLevel,
				visible: !!u
			}), !this.#i) return;
			let d = [];
			function f(e) {
				d.push(e.index);
				for (let t of e.children) f(t);
			}
			if (f(this.#i), d.shift(), d.length !== t.length) {
				console.warn("The data from the group tree doesn't match the data from DataProvider.");
				return;
			}
			d.push(t.length);
			let p = n[d[d.indexOf(i) + 1]];
			(this.#o || l && !o.hidden) && e(a, i, o, s, p - a);
		}
	}
	forEachGroupInViewport(e) {
		let t = this.chartViewport.scrollOffset();
		this.forEachGroup((n, r, i, a, o) => {
			n - i.style.padding > t + this.offsetHeight || n + o < t || e(n, r, i, a, o);
		});
	}
	labelWidthForGroup(e, t) {
		return vt * (t.style.nestingLevel + 1) + 4 + yt + k(e, t.name) + yt - V;
	}
	drawCollapsedOverviewForGroup(e, t, n) {
		let r = new u(g), i = this.chartViewport.windowLeftTime(), a = this.chartViewport.windowRightTime(), o = this.context, s = e.style.height;
		if (!this.rawTimelineData) return;
		let c = this.rawTimelineData.entryStartTimes, l = this.rawTimelineData.entryTotalTimes, p = this.chartViewport.timeToPixel();
		for (let u = e.startLevel; u < n; ++u) {
			let n = this.timelineLevels ? this.timelineLevels[u] : [], m = f(n, a, (e, t) => e - c[t]) - 1, h = Infinity;
			for (let a = m; a >= 0; --a) {
				let u = n[a], f = c[u], m = this.timeToPositionClipped(f), g = f + l[u];
				if (isNaN(g) || m >= h) continue;
				if (g <= i) break;
				h = m;
				let _ = this.getColorForEntry(u), v = this.timeToPositionClipped(g);
				if (e.style.useDecoratorsForOverview && this.dataProvider.forceDecoration(u)) {
					let e = this.chartViewport.timeToPosition(f), n = this.#R(this.rawTimelineData, u);
					o.beginPath(), o.fillStyle = _, o.fillRect(m, t, n, s - 1), this.dataProvider.decorateEntry(u, o, "", m, t, n, s, e, p, (e) => this.#_(u, e));
					continue;
				}
				r.append(new d(m, v, _));
			}
		}
		let m = r.segments().slice().sort((e, t) => e.data.localeCompare(t.data)), h;
		o.beginPath();
		for (let e = 0; e < m.length; ++e) {
			let n = m[e];
			h !== m[e].data && (o.fill(), o.beginPath(), h = m[e].data, o.fillStyle = h), o.rect(n.begin, t, n.end - n.begin, s);
		}
		o.fill();
		function g(e, t) {
			return e.data === t.data && e.end + .4 > t.end ? e : null;
		}
	}
	drawFlowEvents(e, t) {
		let n = this.timelineData();
		if (!n) return;
		let { entryTotalTimes: r, entryStartTimes: i, entryLevels: a } = t, o = window.devicePixelRatio, s = this.chartViewport.scrollOffset();
		e.save(), e.scale(o, o), e.translate(0, -s);
		let c = A.instance().getComputedValue("--sys-color-on-surface-subtle");
		e.fillStyle = c, e.strokeStyle = c;
		for (let o = 0; o < n.initiatorsData.length; ++o) {
			let s = n.initiatorsData[o], c = i[s.initiatorIndex], l = i[s.initiatorIndex] + r[s.initiatorIndex], u = i[s.eventIndex], d = l < u, f = d ? l : Math.max(c, this.chartViewport.pixelToTime(5)), p = u;
			if (p < this.chartViewport.windowLeftTime()) continue;
			let m = this.chartViewport.timeToPosition(f), h = this.chartViewport.timeToPosition(p);
			if (s.isInitiatorHidden) {
				let { circleEndX: n } = this.drawCircleAroundCollapseArrow(s.initiatorIndex, e, t);
				n && (m = n);
			}
			if (s.isEntryHidden) {
				let { circleStartX: n } = this.drawCircleAroundCollapseArrow(s.eventIndex, e, t);
				n && (h = n);
			}
			let g = a[s.initiatorIndex], _ = a[s.eventIndex], v = this.levelToOffset(g) + this.levelHeight(g) / 2, y = this.levelToOffset(_) + this.levelHeight(_) / 2, b = h - m;
			e.lineWidth = 1, e.shadowColor = "rgba(0, 0, 0, 0.3)", e.shadowOffsetX = 2, e.shadowOffsetY = 2, e.shadowBlur = 3, b > 3 && (e.beginPath(), e.moveTo(h, y), e.lineTo(h - 6, y - 3), e.lineTo(h - 6, y + 3), e.fill()), d ? (e.beginPath(), e.moveTo(m, v), e.lineTo(m + b / 2, v), e.lineTo(m + b / 2, y), e.lineTo(h, y), e.stroke()) : (e.beginPath(), e.moveTo(m, v), e.lineTo(m, y), e.lineTo(h, y), e.stroke());
		}
		e.restore();
	}
	drawCircleAroundCollapseArrow(e, t, n) {
		if (!n.entryDecorations.at(e)?.find((e) => e.type === "HIDDEN_DESCENDANTS_ARROW")) return {};
		let { entryStartTimes: r, entryLevels: i } = n, a = this.#R(n, e);
		if (a < this.barHeight * 2) return {};
		let o = r[e], s = this.timeToPositionClipped(o), c = i[e], l = this.#L(n, e), u = this.levelToOffset(c);
		t.save(), t.beginPath(), t.rect(s, u, a, l), t.clip(), t.lineWidth = 1, t.beginPath(), t.fillStyle = "#474747";
		let d = s + a - this.barHeight / 2, f = u + this.barHeight / 2;
		return t.beginPath(), t.arc(d, f, 6, 0, 2 * Math.PI), t.stroke(), t.restore(), {
			circleStartX: d - 6,
			circleEndX: d + 6
		};
	}
	drawMarkerLines() {
		let e = this.timelineData();
		if (!e) return;
		let t = e.markers, n = this.markerIndexBeforeTime(this.minimumBoundary()), r = this.maximumBoundary(), i = this.chartViewport.timeToPixel(), a = this.context;
		a.save();
		let o = window.devicePixelRatio;
		a.scale(o, o), a.translate(0, 3);
		for (let e = n; e < t.length; e++) {
			let n = t[e].startTime();
			if (n > r) break;
			t[e].draw(a, this.chartViewport.timeToPosition(n), 14, i);
		}
		a.restore();
	}
	updateMarkerHighlight() {
		let e = this.markerHighlighElement;
		e.parentElement && e.remove();
		let t = this.highlightedMarkerIndex;
		if (t === -1) return;
		let n = this.timelineData();
		if (!n) return;
		let r = n.markers[t], i = this.timeToPositionClipped(r.startTime());
		w.install(e, r.title() || "");
		let a = e.style;
		a.left = i + "px", a.backgroundColor = r.color(), this.viewportElement.appendChild(e);
	}
	processTimelineData(e) {
		if (!e) {
			this.timelineLevels = null, this.visibleLevelOffsets = null, this.visibleLevels = null, this.groupOffsets = null, this.rawTimelineData = null, this.forceDecorationCache = null, this.entryColorsCache = null, this.dimIndices = null, this.colorDimmingCache.clear(), this.rawTimelineDataLength = 0, this.#i = null, this.selectedGroupIndex = -1, this.keyboardFocusedGroup = -1, this.flameChartDelegate.updateSelectedGroup(this, null);
			return;
		}
		this.rawTimelineData = e, this.rawTimelineDataLength = e.entryStartTimes.length, this.forceDecorationCache = Array(this.rawTimelineDataLength), this.entryColorsCache = Array(this.rawTimelineDataLength), this.#u.clear();
		for (let e = 0; e < this.rawTimelineDataLength; ++e) {
			this.forceDecorationCache[e] = this.dataProvider.forceDecoration(e) ?? !1, this.entryColorsCache[e] = this.dataProvider.entryColor(e);
			let t = this.dataProvider.getDrawOverride?.(e);
			t && this.#u.set(e, t);
		}
		let t = new Uint32Array(this.dataProvider.maxStackDepth() + 1);
		for (let n = 0; n < e.entryLevels.length; ++n) ++t[e.entryLevels[n]];
		let n = Array(t.length);
		for (let e = 0; e < n.length; ++e) n[e] = new Uint32Array(t[e]), t[e] = 0;
		for (let r = 0; r < e.entryLevels.length; ++r) {
			let i = e.entryLevels[r];
			n[i][t[i]++] = r;
		}
		this.timelineLevels = n;
		let r = this.rawTimelineData.groups || [];
		for (let e = 0; e < r.length; ++e) {
			let t = this.#d?.find((t) => t.trackName === r[e].name), n = t?.expanded ?? r[e].expanded ?? !1, i = t?.hidden ?? r[e].hidden ?? !1;
			r[e].expanded = n, r[e].hidden = i;
		}
		this.#i ? this.updateGroupTree(r, this.#i) : this.#i = this.buildGroupTree(r), this.#d && r.length > 0 && this.#i && this.#d.length === r.length && this.#B(this.#d, this.#i), this.updateLevelPositions(), this.updateHeight(), this.selectedGroupIndex === -1 && (this.selectedGroupIndex = e.selectedGroup ? r.indexOf(e.selectedGroup) : -1), this.keyboardFocusedGroup = this.selectedGroupIndex, this.flameChartDelegate.updateSelectedGroup(this, e.selectedGroup);
	}
	#B(e, t) {
		function n(t) {
			t.children.length && t.children.sort((t, n) => e[t.index].visualIndex - e[n.index].visualIndex), t.children.forEach(n);
		}
		n(t);
	}
	#V(e, t, n) {
		return {
			index: t,
			nestingLevel: e.style.nestingLevel,
			startLevel: e.startLevel,
			endLevel: n,
			children: []
		};
	}
	buildGroupTree(e) {
		let t = {
			index: -1,
			nestingLevel: -1,
			startLevel: 0,
			endLevel: e.length ? e[0].startLevel : this.dataProvider.maxStackDepth(),
			children: []
		}, n = [t];
		for (let t = 0; t < e.length; t++) {
			let r = e[t], i = r.style.nestingLevel, a = n[n.length - 1];
			for (; a && a.nestingLevel >= i;) n.pop(), a = n[n.length - 1];
			let o = e[t + 1]?.startLevel ?? this.dataProvider.maxStackDepth(), s = this.#V(r, t, o);
			a.children.push(s), n.push(s);
		}
		return t;
	}
	updateGroupTree(e, t) {
		let n = this.dataProvider.maxStackDepth();
		function r(t) {
			let i = t.index;
			if (i < 0) t.startLevel = 0, t.endLevel = e.length ? e[0].startLevel : n;
			else {
				if (!e[i]) {
					console.warn("The |groups| is changed. Please make sure the flamechart is reset after data change in the data provider");
					return;
				}
				t.startLevel = e[i].startLevel, t.endLevel = e[i + 1]?.startLevel ?? n;
			}
			for (let e of t.children) r(e);
		}
		r(t);
	}
	#H(e, t, n) {
		if (!this.visibleLevels || !this.visibleLevelOffsets || !this.visibleLevelHeights || !this.groupOffsets) return t;
		let r = this.rawTimelineData?.groups;
		if (!r) return t;
		if (e.index >= r.length) return console.warn("The data from the group tree is outdated. Please make sure the flamechart is reset after data change in the data provider"), t;
		e.index >= 0 && (this.groupOffsets[e.index] = t, (this.#o && r[e.index].name || !r[e.index].hidden && n && !r[e.index].style.shareHeaderLine) && (t += r[e.index].style.height));
		let i = !1;
		if (e.index < 0) i = !0;
		else {
			let t = !(this.isGroupCollapsible(e.index) && !r[e.index].expanded);
			i = !r[e.index].hidden && t;
		}
		let a = i && n;
		for (let i = e.startLevel; i < e.endLevel; i++) {
			if (i >= this.dataProvider.maxStackDepth()) return console.warn("The data from the group tree is outdated. Please make sure the flamechart is reset after data change in the data provider"), t;
			let o = i === e.startLevel, s;
			if (e.index < 0) s = !0;
			else {
				let t = o && r[e.index].style.useFirstLineForOverview;
				s = !r[e.index].hidden && n && (a || t);
			}
			let c;
			if (r[e.index]) {
				let t = o && !r[e.index].style.shareHeaderLine, n = this.isGroupCollapsible(e.index) && !r[e.index].expanded;
				c = t || n ? r[e.index].style.height : r[e.index].style.itemsHeight ?? this.barHeight;
			} else c = this.barHeight;
			this.visibleLevels[i] = !this.#o && !!s, this.visibleLevelOffsets[i] = t, this.visibleLevelHeights[i] = this.#o ? 0 : c, (e.index < 0 || !r[e.index].hidden && (s || n && r[e.index].style.shareHeaderLine && o)) && (t += this.visibleLevelHeights[i]);
		}
		if (e.children.length === 0) return t;
		for (let n of e.children) (this.#o && r[n.index].name || a && !r[n.index]?.hidden && n !== e.children[0]) && (t += r[n.index].style.padding ?? 0), t = this.#H(n, t, a);
		return t;
	}
	updateLevelPositions() {
		if (!this.#i) {
			console.warn("Please make sure the new timeline data is processed before update the level positions.");
			return;
		}
		let e = this.dataProvider.maxStackDepth(), t = this.rawTimelineData?.groups || [];
		this.visibleLevelOffsets = new Uint32Array(e + 1), this.visibleLevelHeights = new Uint32Array(e), this.visibleLevels = Array(e), this.groupOffsets = new Uint32Array(t.length + 1);
		let n = this.rulerEnabled ? 17 : 2;
		n = this.#H(this.#i, n, !0), this.groupOffsets[t.length] = n, this.visibleLevelOffsets[e] = n;
	}
	isGroupCollapsible(e) {
		if (!this.rawTimelineData || e < 0) return;
		let t = this.rawTimelineData.groups || [], n = t[e].style;
		if (n.collapsible === 1) return !1;
		if (!n.shareHeaderLine) return n.collapsible === 0;
		let r = e + 1 >= t.length;
		return n.collapsible === 2 && (r ? this.dataProvider.maxStackDepth() : t[e + 1].startLevel) - t[e].startLevel < 2 ? !1 : !r && t[e + 1].style.nestingLevel > n.nestingLevel || (r ? this.dataProvider.maxStackDepth() : t[e + 1].startLevel) !== t[e].startLevel + 1 || n.height !== n.itemsHeight;
	}
	groupIsLastVisibleTopLevel(e) {
		if (e < 0 || !this.rawTimelineData) return !0;
		let t = this.rawTimelineData.groups[e];
		return this.#i?.children.filter((e) => !this.rawTimelineData?.groups[e.index].hidden).length === 1 && t.style.nestingLevel === 0 && !t.hidden;
	}
	setSelectedEntry(e) {
		this.isMouseOverRevealChildrenArrow(this.lastMouseOffsetX, e) && this.modifyTree("RESET_CHILDREN", e), this.selectedEntryIndex !== e && (e !== -1 && this.chartViewport.hideRangeSelection(), this.selectedEntryIndex = e, this.revealEntry(e), this.updateElementPosition(this.selectedElement, this.selectedEntryIndex), this.update());
	}
	entryHasDecoration(e, t) {
		let n = this.timelineData();
		if (!n) return !1;
		let r = n.entryDecorations.at(e);
		return r && r.length >= 1 ? r.some((e) => e.type === t) : !1;
	}
	getCustomDrawnPositionForEntryIndex(e) {
		return this.customDrawnPositions.get(e) || (this.markerPositions.get(e) ?? null);
	}
	updateElementPosition(e, t, n) {
		if (!e || (e.classList.add("hidden"), t === -1)) return;
		let r = this.timelineData();
		if (!r) return;
		let i = r.entryStartTimes[t], a = r.entryTotalTimes[t], o = 0, s = 0, c = !0, l = this.customDrawnPositions.get(t);
		if (l) o = l.x, s = l.width;
		else if (Number.isNaN(a)) {
			let e = this.markerPositions.get(t);
			e ? (o = e.x, s = e.width) : c = !1;
		} else o = this.chartViewport.timeToPosition(i), s = a * this.chartViewport.timeToPixel();
		if (o + s <= 0 || o >= this.offsetWidth) return;
		let u = o + s / 2;
		s = Math.max(s, 2), o = u - s / 2;
		let d = r.entryLevels[t], f = this.levelToOffset(d) - this.chartViewport.scrollOffset(), p = this.levelHeight(d), m = e.style;
		n ? (m.top = f + "px", m.width = p + "px", m.height = p + "px", m.left = o + s - p + "px") : (m.top = f + "px", m.width = s + "px", m.height = p - 1 + "px", m.left = o + "px"), e.classList.toggle("hidden", !c), this.viewportElement.appendChild(e);
	}
	updateHiddenChildrenArrowHighlighPosition(e) {
		this.revealDescendantsArrowHighlightElement.classList.add("hidden"), e !== -1 && this.isMouseOverRevealChildrenArrow(this.lastMouseOffsetX, e) && this.updateElementPosition(this.revealDescendantsArrowHighlightElement, e, !0);
	}
	timeToPositionClipped(e) {
		return b(this.chartViewport.timeToPosition(e), 0, this.offsetWidth);
	}
	groupIndexToOffsetForTest(e) {
		if (!this.groupOffsets) throw Error("No visible group offsets");
		return this.groupOffsets[e];
	}
	setEditModeForTest(e) {
		this.#o = e;
	}
	levelIsVisible(e) {
		if (!this.visibleLevels) throw Error("No level visiblibities");
		return this.visibleLevels[e];
	}
	levelToOffset(e) {
		if (!this.visibleLevelOffsets) throw Error("No visible level offsets");
		return this.visibleLevelOffsets[e];
	}
	levelHeight(e) {
		if (!this.visibleLevelHeights) throw Error("No visible level heights");
		return this.visibleLevelHeights[e];
	}
	updateBoundaries() {
		this.totalTime = this.dataProvider.totalTime(), this.#e = this.dataProvider.minimumBoundary(), this.chartViewport.setBoundaries(this.#e, this.totalTime);
	}
	updateHeight() {
		this.chartViewport.setContentHeight(this.totalContentHeight());
	}
	totalContentHeight() {
		return this.levelToOffset(this.dataProvider.maxStackDepth()) + 2;
	}
	onResize() {
		this.#c = null, this.scheduleUpdate();
	}
	setPersistedConfig(e) {
		this.#d = e;
	}
	update() {
		this.timelineData() && (this.updateHeight(), this.updateBoundaries(), this.draw(), this.chartViewport.isDragging() || this.updateHighlight());
	}
	reset() {
		this.#o &&= (this.#M(), !1), this.chartViewport.reset(), this.rawTimelineData = null, this.rawTimelineDataLength = 0, this.#i = null, this.dimIndices = null, this.colorDimmingCache.clear(), this.highlightedMarkerIndex = -1, this.highlightedEntryIndex = -1, this.selectedEntryIndex = -1, this.selectedGroupIndex = -1, this.#d = null;
	}
	scheduleUpdate() {
		this.chartViewport.scheduleUpdate();
	}
	enabled() {
		return this.rawTimelineDataLength !== 0;
	}
	computePosition(e) {
		return this.chartViewport.timeToPosition(e);
	}
	formatValue(e, t) {
		return this.dataProvider.formatValue(e - this.zeroTime(), t);
	}
	maximumBoundary() {
		return N(this.chartViewport.windowRightTime());
	}
	minimumBoundary() {
		return N(this.chartViewport.windowLeftTime());
	}
	zeroTime() {
		return N(this.dataProvider.minimumBoundary());
	}
	boundarySpan() {
		return N(this.maximumBoundary() - this.minimumBoundary());
	}
	getDimIndices() {
		return this.dimIndices || null;
	}
}, Pt = .5, Ft = /* @__PURE__ */ function(e) {
	return e.CANDY = "CANDY", e.WARNING_TRIANGLE = "WARNING_TRIANGLE", e.HIDDEN_DESCENDANTS_ARROW = "HIDDEN_DESCENDANTS_ARROW", e;
}({}), It = {
	CANDY: 1,
	WARNING_TRIANGLE: 2,
	HIDDEN_DESCENDANTS_ARROW: 3
};
function Lt(e) {
	e.sort((e, t) => It[e.type] - It[t.type]);
}
var Rt = class e {
	entryLevels;
	entryTotalTimes;
	entryStartTimes;
	entryDecorations;
	groups;
	markers;
	initiatorsData;
	selectedGroup;
	constructor(e, t, n, r, i = [], a = []) {
		this.entryLevels = e, this.entryTotalTimes = t, this.entryStartTimes = n, this.entryDecorations = i, this.groups = r || [], this.markers = [], this.initiatorsData = a || [], this.selectedGroup = null;
	}
	static create(t) {
		return new e(t.entryLevels, t.entryTotalTimes, t.entryStartTimes, t.groups, t.entryDecorations || [], t.initiatorsData || []);
	}
	static createEmpty() {
		return new e([], [], [], []);
	}
	emptyInitiators() {
		this.initiatorsData = [];
	}
}, zt = /* @__PURE__ */ function(e) {
	return e.CANVAS_FOCUSED = "CanvasFocused", e.ENTRY_INVOKED = "EntryInvoked", e.ENTRY_LABEL_ANNOTATION_ADDED = "EntryLabelAnnotationAdded", e.ENTRIES_LINK_ANNOTATION_CREATED = "EntriesLinkAnnotationCreated", e.TRACKS_REORDER_STATE_CHANGED = "TracksReorderStateChange", e.ENTRY_SELECTED = "EntrySelected", e.ENTRY_HOVERED = "EntryHovered", e.LATEST_DRAW_DIMENSIONS = "LatestDrawDimensions", e.MOUSE_MOVE = "MouseMove", e;
}({}), Bt = /* @__PURE__ */ e({ ChartViewport: () => Vt }), Vt = class extends D {
	delegate;
	viewportElement;
	#e;
	rangeSelectionEnabled;
	vScrollElement;
	vScrollContent;
	selectionOverlay;
	cursorElement;
	#t;
	totalHeight;
	offsetHeight;
	scrollTop;
	rangeSelectionStart;
	rangeSelectionEnd;
	dragStartPointX;
	dragStartPointY;
	dragStartScrollTop;
	visibleLeftTime;
	visibleRightTime;
	offsetWidth;
	targetLeftTime;
	targetRightTime;
	selectionOffsetShiftX;
	selectionStartX;
	lastMouseOffsetX;
	minimumBoundary;
	totalTime;
	isUpdateScheduled;
	cancelWindowTimesAnimation;
	#n;
	constructor(e, t) {
		super(), this.#n = t, this.registerRequiredCSS(at), this.delegate = e, this.viewportElement = this.contentElement.createChild("div", "fill"), this.viewportElement.addEventListener("mousemove", this.updateCursorPosition.bind(this), !1), this.viewportElement.addEventListener("mouseout", this.onMouseOut.bind(this), !1), this.viewportElement.addEventListener("wheel", this.onMouseWheel.bind(this), !1), this.viewportElement.addEventListener("keydown", this.onChartKeyDown.bind(this), !1), this.viewportElement.addEventListener("keyup", this.onChartKeyUp.bind(this), !1), S(this.viewportElement, this.startDragging.bind(this), this.dragging.bind(this), this.endDragging.bind(this), "-webkit-grabbing", null), S(this.viewportElement, this.startRangeSelection.bind(this), this.rangeSelectionDragging.bind(this), this.endRangeSelection.bind(this), "text", null), this.#e = !1, this.rangeSelectionEnabled = !0, this.vScrollElement = this.contentElement.createChild("div", "chart-viewport-v-scroll"), this.vScrollContent = this.vScrollElement.createChild("div"), this.vScrollElement.addEventListener("scroll", this.onScroll.bind(this), !1), this.selectionOverlay = this.contentElement.createChild("div", "chart-viewport-selection-overlay hidden"), this.cursorElement = this.contentElement.createChild("div", "chart-cursor-element hidden"), this.reset(), this.rangeSelectionStart = null, this.rangeSelectionEnd = null;
	}
	alwaysShowVerticalScroll() {
		this.#e = !0, this.vScrollElement.classList.add("always-show-scrollbar");
	}
	disableRangeSelection() {
		this.rangeSelectionEnabled = !1, this.rangeSelectionStart = null, this.rangeSelectionEnd = null;
	}
	isDragging() {
		return this.#t;
	}
	elementsToRestoreScrollPositionsFor() {
		return [this.vScrollElement];
	}
	verticalScrollBarVisible() {
		return !this.vScrollElement.classList.contains("hidden");
	}
	updateScrollBar() {
		let e = this.#e || this.totalHeight > this.offsetHeight;
		this.vScrollElement.classList.contains("hidden") === e && (this.vScrollElement.classList.toggle("hidden", !e), this.updateContentElementSize());
	}
	onResize() {
		this.updateScrollBar(), this.updateContentElementSize(), this.scheduleUpdate();
	}
	reset() {
		this.vScrollElement.scrollTop = 0, this.scrollTop = 0, this.rangeSelectionStart = null, this.rangeSelectionEnd = null, this.#t = !1, this.dragStartPointX = 0, this.dragStartPointY = 0, this.dragStartScrollTop = 0, this.visibleLeftTime = 0, this.visibleRightTime = 0, this.offsetWidth = 0, this.offsetHeight = 0, this.totalHeight = 0, this.targetLeftTime = 0, this.targetRightTime = 0, this.isUpdateScheduled = !1, this.updateContentElementSize();
	}
	updateContentElementSize() {
		let e = this.vScrollElement.offsetLeft;
		e ||= this.contentElement.offsetWidth, this.offsetWidth = e, this.offsetHeight = this.contentElement.offsetHeight, this.delegate.setSize(this.offsetWidth, this.offsetHeight);
	}
	setContentHeight(e) {
		this.totalHeight = e, this.vScrollContent.style.height = e + "px", this.updateScrollBar(), this.updateContentElementSize(), !(this.scrollTop + this.offsetHeight <= e) && (this.scrollTop = Math.max(0, e - this.offsetHeight), this.vScrollElement.scrollTop = this.scrollTop);
	}
	setScrollOffset(e, t, n) {
		if (t ||= 0, n) {
			let n = Math.floor(this.offsetHeight / 2);
			this.vScrollElement.scrollTop > e && (this.vScrollElement.scrollTop = e - (t + n));
		} else this.vScrollElement.scrollTop > e && (this.vScrollElement.scrollTop = e);
		this.vScrollElement.scrollTop < e - this.offsetHeight + t && (this.vScrollElement.scrollTop = e - this.offsetHeight + t);
	}
	scrollOffset() {
		return this.scrollTop;
	}
	chartHeight() {
		return this.offsetHeight;
	}
	setBoundaries(e, t) {
		this.minimumBoundary = e, this.totalTime = t;
	}
	onMouseWheel(e) {
		let t = l.instance().moduleSetting("flamechart-selected-navigation").get(), n = (e.deltaY || e.deltaX) / 53 * this.offsetHeight / 8, r = 1.2 ** ((e.deltaY || e.deltaX) * 1 / 53) - 1;
		if (t === "classic") e.shiftKey ? this.vScrollElement.scrollTop += n : Math.abs(e.deltaX) > Math.abs(e.deltaY) ? this.handleHorizontalPanGesture(e.deltaX, !0) : this.handleZoomGesture(r);
		else if (t === "modern") {
			let t = ue.eventHasCtrlEquivalentKey(e);
			e.shiftKey ? this.handleHorizontalPanGesture(n, !0) : Math.abs(e.deltaX) > Math.abs(e.deltaY) ? this.handleHorizontalPanGesture(e.deltaX, !0) : t ? this.handleZoomGesture(r) : this.vScrollElement.scrollTop += n;
		}
		e.consume(!0);
	}
	startDragging(e) {
		return !e.shiftKey && (this.#t = !0, this.dragStartPointX = e.pageX, this.dragStartPointY = e.pageY, this.dragStartScrollTop = this.vScrollElement.scrollTop, this.viewportElement.style.cursor = "", !0);
	}
	dragging(e) {
		let t = this.dragStartPointX - e.pageX;
		this.dragStartPointX = e.pageX, this.handleHorizontalPanGesture(t);
		let n = this.dragStartPointY - e.pageY;
		this.vScrollElement.scrollTop = this.dragStartScrollTop + n;
	}
	endDragging() {
		this.#t = !1;
	}
	startRangeSelection(e) {
		return !e.shiftKey || !this.rangeSelectionEnabled ? !1 : (this.#t = !0, this.selectionOffsetShiftX = e.offsetX - e.pageX, this.selectionStartX = e.offsetX, !0);
	}
	endRangeSelection() {
		this.#t = !1, this.selectionStartX = null;
	}
	hideRangeSelection() {
		this.selectionOverlay.classList.add("hidden"), this.rangeSelectionStart = null, this.rangeSelectionEnd = null;
	}
	setRangeSelection(e, t) {
		this.rangeSelectionEnabled && (this.rangeSelectionStart = Math.min(e, t), this.rangeSelectionEnd = Math.max(e, t), this.delegate.updateRangeSelection(this.rangeSelectionStart, this.rangeSelectionEnd));
	}
	onClick(e) {
		let t = e, n = this.pixelToTime(t.offsetX);
		this.rangeSelectionStart !== null && this.rangeSelectionEnd !== null && n >= this.rangeSelectionStart && n <= this.rangeSelectionEnd || this.hideRangeSelection();
	}
	rangeSelectionDragging(e) {
		let t = b(e.pageX + this.selectionOffsetShiftX, 0, this.offsetWidth), n = this.pixelToTime(this.selectionStartX || 0), r = this.pixelToTime(t);
		this.setRangeSelection(n, r);
	}
	onScroll() {
		this.scrollTop = this.vScrollElement.scrollTop, this.scheduleUpdate();
	}
	onMouseOut() {
		this.lastMouseOffsetX = -1, this.showCursor(!1);
	}
	updateCursorPosition(e) {
		let t = e;
		this.lastMouseOffsetX = t.offsetX;
		let n = this.#n.enableCursorElement && t.shiftKey && !t.metaKey;
		this.showCursor(n), n && (this.cursorElement.style.left = t.offsetX + "px");
	}
	pixelToTime(e) {
		return this.pixelToTimeOffset(e) + this.visibleLeftTime;
	}
	pixelToTimeOffset(e) {
		return e * (this.visibleRightTime - this.visibleLeftTime) / this.offsetWidth;
	}
	timeToPosition(e) {
		return Math.floor((e - this.visibleLeftTime) / (this.visibleRightTime - this.visibleLeftTime) * this.offsetWidth);
	}
	timeToPixel() {
		return this.offsetWidth / (this.visibleRightTime - this.visibleLeftTime);
	}
	showCursor(e) {
		this.cursorElement.classList.toggle("hidden", !e || this.#t);
	}
	onChartKeyDown(e) {
		this.showCursor(e.shiftKey), this.handleZoomPanScrollKeys(e);
	}
	onChartKeyUp(e) {
		this.showCursor(e.shiftKey);
	}
	handleZoomPanScrollKeys(e) {
		if (ue.hasAtLeastOneModifier(e) && !e.shiftKey) return;
		let t = e.shiftKey ? .8 : .3;
		switch (e.code) {
			case "KeyA":
				this.handleHorizontalPanGesture(-160, !0);
				break;
			case "KeyD":
				this.handleHorizontalPanGesture(160, !0);
				break;
			case "Equal":
			case "KeyW":
				this.handleZoomGesture(-t);
				break;
			case "Minus":
			case "KeyS":
				this.handleZoomGesture(t);
				break;
			case "ArrowUp":
				e.shiftKey && (this.vScrollElement.scrollTop -= 50);
				break;
			case "ArrowDown":
				e.shiftKey && (this.vScrollElement.scrollTop += 50);
				break;
			case "ArrowLeft":
				e.shiftKey && this.handleHorizontalPanGesture(-160, !0);
				break;
			case "ArrowRight":
				e.shiftKey && this.handleHorizontalPanGesture(160, !0);
				break;
			default: return;
		}
		e.consume(!0);
	}
	handleZoomGesture(e) {
		let t = {
			left: this.targetLeftTime,
			right: this.targetRightTime
		}, n = this.pixelToTime(this.lastMouseOffsetX || 0);
		t.left += (t.left - n) * e, t.right += (t.right - n) * e, this.requestWindowTimes(t, !0);
	}
	handleHorizontalPanGesture(e, t) {
		let n = {
			left: this.targetLeftTime,
			right: this.targetRightTime
		}, r = b(this.pixelToTimeOffset(e), this.minimumBoundary - n.left, this.totalTime + this.minimumBoundary - n.right);
		n.left += r, n.right += r, this.requestWindowTimes(n, !!t);
	}
	requestWindowTimes(e, t) {
		let n = this.minimumBoundary + this.totalTime;
		e.left < this.minimumBoundary ? (e.right = Math.min(e.right + this.minimumBoundary - e.left, n), e.left = this.minimumBoundary) : e.right > n && (e.left = Math.max(e.left - e.right + n, this.minimumBoundary), e.right = n), !(e.right - e.left < .5) && this.delegate.windowChanged(e.left, e.right, t);
	}
	scheduleUpdate() {
		this.cancelWindowTimesAnimation || this.isUpdateScheduled || (this.isUpdateScheduled = !0, Fe(() => {
			this.isUpdateScheduled = !1, this.update();
		}));
	}
	update() {
		this.delegate.update();
	}
	willHide() {
		super.willHide(), this.cancelWindowTimesAnimation && (this.cancelWindowTimesAnimation(), this.setWindowTimes(this.targetLeftTime, this.targetRightTime, !1));
	}
	setWindowTimes(e, t, n) {
		if (e === this.targetLeftTime && t === this.targetRightTime) return;
		if (!n || this.visibleLeftTime === 0 || this.visibleRightTime === Infinity || e === 0 && t === Infinity || e === Infinity && t === Infinity) {
			this.targetLeftTime = e, this.targetRightTime = t, this.visibleLeftTime = e, this.visibleRightTime = t, this.scheduleUpdate();
			return;
		}
		this.cancelWindowTimesAnimation && (this.cancelWindowTimesAnimation(), this.visibleLeftTime = this.targetLeftTime, this.visibleRightTime = this.targetRightTime), this.targetLeftTime = e, this.targetRightTime = t, this.cancelWindowTimesAnimation = Se(this.element.window(), r.bind(this), [{
			from: this.visibleLeftTime,
			to: e
		}, {
			from: this.visibleRightTime,
			to: t
		}], 100, () => {
			this.cancelWindowTimesAnimation = null;
		});
		function r(e, t) {
			this.isShowing() && (this.visibleLeftTime = e, this.visibleRightTime = t, this.update());
		}
	}
	windowLeftTime() {
		return this.visibleLeftTime;
	}
	windowRightTime() {
		return this.visibleRightTime;
	}
}, Ht = "/*\n * Copyright 2015 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.film-strip-view {\n  overflow: auto hidden;\n  align-content: flex-start;\n  min-height: 81px;\n}\n\n.film-strip-view .frame .time {\n  font-size: 10px;\n  margin-top: 2px;\n}\n\n.film-strip-view .gray-info-message {\n  margin: auto;\n}\n\n.film-strip-view .frame {\n  background: none;\n  border: none;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding: 4px;\n  flex: none;\n  cursor: pointer;\n}\n\n.film-strip-view .frame .thumbnail {\n  min-width: 24px;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  pointer-events: none;\n  margin: 4px 0 2px;\n  border: 2px solid transparent;\n}\n\n.film-strip-view .frame:hover .thumbnail,\n.film-strip-view .frame:focus .thumbnail {\n  border-color: var(--sys-color-primary);\n}\n\n.film-strip-view .frame .thumbnail img {\n  height: auto;\n  width: auto;\n  max-width: 80px;\n  max-height: 50px;\n  pointer-events: none;\n  box-shadow: 0 0 3px var(--box-shadow-outline-color);\n  flex: 0 0 auto;\n}\n\n.film-strip-view .frame:hover .thumbnail img,\n.film-strip-view .frame:focus .thumbnail img {\n  box-shadow: none;\n}\n\n.film-strip-image-dialog {\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n\n  .image-box {\n    overflow: auto;\n    margin: var(--sys-size-7) var(--sys-size-8) var(--sys-size-8)\n      var(--sys-size-8);\n    border: var(--sys-size-1) solid var(--sys-color-divider);\n  }\n\n  img {\n    max-height: 80vh;\n    max-width: 80vw;\n  }\n\n  .time-box {\n    margin: 0 var(--sys-size-3);\n  }\n\n  .button-box {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    margin: var(--sys-size-6) 0 var(--sys-size-5);\n  }\n}\n", Ut = /* @__PURE__ */ e({
	Dialog: () => qt,
	Events: () => Kt,
	FilmStripView: () => Gt
}), H = {
	doubleclickToZoomImageClickTo: "Doubleclick to zoom image. Click to view preceding requests.",
	screenshotForSSelectToView: "Screenshot for {PH1} - select to view preceding requests.",
	screenshot: "Screenshot",
	previousFrame: "Previous frame",
	nextFrame: "Next frame"
}, Wt = i("ui/legacy/components/perf_ui/FilmStripView.ts", H), U = r.bind(void 0, Wt), Gt = class e extends t(h) {
	statusLabel;
	zeroTime = N(0);
	#e = null;
	constructor() {
		super({ useShadowDom: !0 }), this.registerRequiredCSS(Ht), this.contentElement.classList.add("film-strip-view"), this.statusLabel = this.contentElement.createChild("div", "gray-info-message"), this.reset();
	}
	static setImageData(e, t) {
		t && (e.src = t);
	}
	setModel(e) {
		if (this.#e = e, this.zeroTime = M(e.zeroTime), !this.#e.frames.length) {
			this.reset();
			return;
		}
		this.update();
	}
	createFrameElement(t) {
		let n = M(t.screenshotEvent.ts), r = a(n - this.zeroTime), i = document.createElement("button");
		i.classList.add("frame"), w.install(i, U(H.doubleclickToZoomImageClickTo)), i.createChild("div", "time").textContent = r, i.tabIndex = 0, i.setAttribute("jslog", `${p("film-strip").track({
			click: !0,
			dblclick: !0
		})}`), i.setAttribute("aria-label", U(H.screenshotForSSelectToView, { PH1: r })), Me(i);
		let o = i.createChild("div", "thumbnail").createChild("img");
		o.alt = U(H.screenshot), i.addEventListener("mousedown", this.onMouseEvent.bind(this, "FrameSelected", n), !1), i.addEventListener("mouseenter", this.onMouseEvent.bind(this, "FrameEnter", n), !1), i.addEventListener("mouseout", this.onMouseEvent.bind(this, "FrameExit", n), !1), i.addEventListener("dblclick", this.onDoubleClick.bind(this, t), !1), i.addEventListener("focusin", this.onMouseEvent.bind(this, "FrameEnter", n), !1), i.addEventListener("focusout", this.onMouseEvent.bind(this, "FrameExit", n), !1);
		let s = qe(t.screenshotEvent);
		return e.setImageData(o, s), i;
	}
	update() {
		let e = this.#e?.frames;
		if (!e || e.length < 1) return;
		let t = e.map((e) => this.createFrameElement(e));
		this.contentElement.removeChildren();
		for (let e of t) this.contentElement.appendChild(e);
	}
	onMouseEvent(e, t) {
		this.dispatchEventToListeners(e, t);
	}
	onDoubleClick(e) {
		this.#e && qt.fromFilmStrip(this.#e, e.index);
	}
	reset() {
		this.zeroTime = N(0), this.contentElement.removeChildren(), this.contentElement.appendChild(this.statusLabel);
	}
	setStatusText(e) {
		this.statusLabel.textContent = e;
	}
}, Kt = /* @__PURE__ */ function(e) {
	return e.FRAME_SELECTED = "FrameSelected", e.FRAME_ENTER = "FrameEnter", e.FRAME_EXIT = "FrameExit", e;
}({}), qt = class e {
	widget;
	index;
	dialog = null;
	#e;
	static fromFilmStrip(t, n) {
		let r = {
			source: "Trace",
			frames: t.frames,
			index: n,
			zeroTime: M(t.zeroTime)
		};
		return new e(r);
	}
	constructor(e) {
		this.#e = e, this.index = e.index;
		let t = ve("◀", this.onPrevFrame.bind(this));
		w.install(t, U(H.previousFrame));
		let n = ve("▶", this.onNextFrame.bind(this));
		w.install(n, U(H.nextFrame)), this.widget = new Ae({ classes: ["film-strip-image-dialog"] }), this.widget.registerRequiredCSS(Ht);
		let r = document.createElement("div");
		r.classList.add("image-box");
		let i = document.createElement("img");
		i.setAttribute("data-film-strip-dialog-img", ""), r.append(i);
		let a = document.createElement("div");
		a.classList.add("button-box");
		let o = document.createElement("div");
		o.classList.add("time-box"), a.append(t), a.append(o), a.append(n), this.widget.contentElement.append(r), this.widget.contentElement.append(a), this.widget.element.tabIndex = 0, this.widget.contentElement.append(), this.widget.contentElement.addEventListener("keydown", this.keyDown.bind(this), !1), this.dialog = null, this.render();
	}
	hide() {
		this.dialog && this.dialog.hide();
	}
	#t() {
		return this.#e.frames.length;
	}
	#n() {
		return this.#e.zeroTime;
	}
	resize() {
		this.dialog || (this.dialog = new te(), this.widget.show(this.dialog.contentElement), this.dialog.setDefaultFocusedElement(this.widget.element), this.dialog.show()), this.dialog.setSizeBehavior(re.MEASURE_CONTENT);
	}
	keyDown(e) {
		let t = e;
		switch (t.key) {
			case "ArrowLeft":
				oe() && t.metaKey ? this.onFirstFrame() : this.onPrevFrame();
				break;
			case "ArrowRight":
				oe() && t.metaKey ? this.onLastFrame() : this.onNextFrame();
				break;
			case "Home":
				this.onFirstFrame();
				break;
			case "End": this.onLastFrame();
		}
	}
	onPrevFrame() {
		this.index > 0 && --this.index, this.render();
	}
	onNextFrame() {
		this.index < this.#t() - 1 && ++this.index, this.render();
	}
	onFirstFrame() {
		this.index = 0, this.render();
	}
	onLastFrame() {
		this.index = this.#t() - 1, this.render();
	}
	render() {
		let e = this.#e.frames[this.index], t = M(e.screenshotEvent.ts), n = this.widget.contentElement.querySelector(".time-box");
		n && (n.textContent = a(t - this.#n()));
		let r = this.widget.contentElement.querySelector("img");
		if (!r) return;
		r.setAttribute("data-frame-index", this.index.toString());
		let i = qe(e.screenshotEvent);
		Gt.setImageData(r, i), this.resize();
	}
}, Jt = /* @__PURE__ */ e({ GCActionDelegate: () => Qt }), Yt = { garbageCollectionCompleted: "Garbage collection completed" }, Xt = i("ui/legacy/components/perf_ui/GCActionDelegate.ts", Yt), Zt = r.bind(void 0, Xt), Qt = class {
	handleAction(e, t) {
		let n = Oe.instance().models(ce).map((e) => e.collectGarbage());
		return Promise.all(n).then(() => {
			Xe.show({ message: Zt(Yt.garbageCollectionCompleted) });
		}), !0;
	}
}, $t = /* @__PURE__ */ e({
	Helper: () => nn,
	Performance: () => tn
}), en, tn = class e {
	helper;
	constructor() {
		this.helper = new nn(Be.PERFORMANCE);
	}
	static instance(t = { forceNew: null }) {
		let { forceNew: n } = t;
		return (!en || n) && (en = new e()), en;
	}
	initialize(e, t) {
		this.helper.reset();
		for (let n of e) this.appendCPUProfile(n, t);
		this.helper.update();
	}
	appendLegacyCPUProfile(e, t) {
		let n = [e.profileHead], r = (e.profileEndTime - e.profileStartTime) / e.totalHitCount;
		for (; n.length;) {
			let e = n.pop()?.children ?? [];
			for (let i = 0; i < e.length; ++i) {
				let a = e[i];
				if (n.push(a), a.url && a.positionTicks) for (let e = 0; e < a.positionTicks.length; ++e) {
					let n = a.positionTicks[e], i = n.line, o = n.ticks * r;
					this.helper.addLocationData(t, a.url, {
						line: i,
						column: 1
					}, o);
				}
			}
		}
	}
	appendCPUProfile(e, t) {
		if (!e.lines) {
			this.appendLegacyCPUProfile(e, t);
			return;
		}
		if (e.samples && e.columns) for (let n = 1; n < e.samples.length; ++n) {
			let r = e.lines[n], i = e.columns?.[n];
			if (!r || !i) continue;
			let a = e.nodeByIndex(n);
			if (!a) continue;
			let o = Number(a.scriptId) || a.url;
			if (!o) continue;
			let s = e.timestamps[n] - e.timestamps[n - 1];
			this.helper.addLocationData(t, o, {
				line: r,
				column: i
			}, s);
		}
	}
}, nn = class {
	type;
	locationPool = new Ve();
	locationData = /* @__PURE__ */ new Map();
	constructor(e) {
		this.type = e, this.reset();
	}
	reset() {
		this.locationData = /* @__PURE__ */ new Map();
	}
	addLocationData(e, t, { line: n, column: r }, i) {
		let a = this.locationData.get(e);
		a || (a = /* @__PURE__ */ new Map(), this.locationData.set(e, a));
		let o = a.get(t);
		o || (o = /* @__PURE__ */ new Map(), a.set(t, o));
		let s = o.get(n);
		s || (s = /* @__PURE__ */ new Map(), o.set(n, s)), s.set(r, (s.get(r) || 0) + i);
	}
	async update() {
		this.locationPool.disposeAll();
		let e = /* @__PURE__ */ new Map(), t = [];
		for (let [n, r] of this.locationData) {
			let i = n ? n.model(Ce) : null;
			for (let [a, o] of r) {
				let r = Ue.instance();
				if (i) {
					let r = He.instance();
					for (let [s, c] of o) for (let [o, l] of c) {
						let c = s - 1, u = o - 1;
						if (n) {
							let n = typeof a == "string" ? i.createRawLocationByURL(a, c, u || 0) : i.createRawLocationByScriptId(String(a), c, u || 0);
							n && t.push(r.rawLocationToUILocation(n).then((t) => {
								if (t && (this.addLineColumnData(e, t.uiSourceCode, t.lineNumber + 1, (t.columnNumber ?? 0) + 1, l), t.uiSourceCode.contentType().isFromSourceMap())) {
									let t = n.script(), i = t ? r.uiSourceCodeForScript(t) : null;
									i && this.addLineColumnData(e, i, s, o, l);
								}
							}));
						}
					}
				} else if (typeof a == "string") {
					let t = r.uiSourceCodeForURL(a);
					t && e.set(t, o);
				}
			}
			await Promise.all(t);
			for (let [t, n] of e) t.setDecorationData(this.type, n);
		}
		for (let t of Ue.instance().uiSourceCodes()) e.has(t) || t.setDecorationData(this.type, void 0);
	}
	addLineColumnData(e, t, n, r, i) {
		let a = e.get(t);
		a || (a = /* @__PURE__ */ new Map(), e.set(t, a));
		let o = a.get(n);
		o || (o = /* @__PURE__ */ new Map(), a.set(n, o)), o.set(r, (o.get(r) ?? 0) + i);
	}
}, rn = /* @__PURE__ */ e({
	networkPriorityWeight: () => un,
	priorityUILabelMap: () => ln,
	uiLabelForNetworkPriority: () => on,
	uiLabelToNetworkPriority: () => cn
}), W = {
	lowest: "Lowest",
	low: "Low",
	medium: "Medium",
	high: "High",
	highest: "Highest"
}, an = i("ui/legacy/components/perf_ui/NetworkPriorities.ts", W), G = r.bind(void 0, an);
function on(e) {
	return ln().get(e) || "";
}
var sn = /* @__PURE__ */ new Map();
function cn(e) {
	sn.size === 0 && ln().forEach((e, t) => sn.set(e, t));
	let t = sn.get(e);
	if (t) return t;
	throw Error("Priority not found");
}
var K = /* @__PURE__ */ new Map();
function ln() {
	return K.size === 0 && (K.set(E.ResourcePriority.VeryLow, G(W.lowest)), K.set(E.ResourcePriority.Low, G(W.low)), K.set(E.ResourcePriority.Medium, G(W.medium)), K.set(E.ResourcePriority.High, G(W.high)), K.set(E.ResourcePriority.VeryHigh, G(W.highest))), K;
}
var q = /* @__PURE__ */ new Map();
function un(e) {
	return q.size === 0 && (q.set(E.ResourcePriority.VeryLow, 1), q.set(E.ResourcePriority.Low, 2), q.set(E.ResourcePriority.Medium, 3), q.set(E.ResourcePriority.High, 4), q.set(E.ResourcePriority.VeryHigh, 5)), q.get(e) || 0;
}
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/legacy/components/perf_ui/overviewGrid.css.mjs
var dn = "/*\n * Copyright 2014 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.overview-grid-window-selector {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  background-color: var(--sys-color-state-ripple-primary);\n  z-index: 250;\n  pointer-events: none;\n}\n\n.overview-grid-window-resizer {\n  position: absolute;\n  top: 0;\n  height: 19px;\n  width: 10px;\n  margin-left: -5px; /* half width (incl the border) */\n  background-color: var(--sys-color-tonal-container);\n  border: 1px solid var(--sys-color-tonal-outline);\n  z-index: 500;\n  border-radius: 3px;\n}\n\n/* Grip lines within the handle */\n.overview-grid-window-resizer::before,\n.overview-grid-window-resizer::after {\n  content: \"\";\n  width: 1px;\n  background: var(--sys-color-primary);\n  height: 7px;\n  position: absolute;\n  left: 2px;\n  top: 5px;\n  border-radius: 1px;\n}\n\n.overview-grid-window-resizer::after {\n  left: 5px;\n}\n\n.overview-grid-window-resizer:focus-visible {\n  background-color: var(--sys-color-state-focus-highlight);\n}\n\n.overview-grid-cursor-area {\n  position: absolute;\n  inset: 20px 0 0;\n  z-index: 500;\n  cursor: text;\n}\n\n.overview-grid-cursor-position {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  width: 2px;\n  background-color: var(--sys-color-primary);\n  z-index: 500;\n  pointer-events: none;\n  visibility: hidden;\n  overflow: hidden;\n}\n\n.window-curtain-left,\n.window-curtain-right {\n  background-color: var(--sys-color-state-ripple-primary);\n  position: absolute;\n  top: 0;\n  height: 100%;\n  z-index: 300;\n  pointer-events: none;\n  border: 2px none var(--sys-color-tonal-outline);\n}\n\n.window-curtain-left {\n  left: 0;\n  border-right-style: solid;\n}\n\n.window-curtain-right {\n  right: 0;\n  border-left-style: solid;\n}\n\n.create-breadcrumb-button-container {\n  visibility: hidden;\n  opacity: 0%;\n  transition: opacity 100ms 250ms;\n  display: flex;\n  position: absolute;\n  top: 15px;\n  justify-content: center;\n  z-index: 600;\n  left: 0;\n  right: 0;\n}\n\n.is-breadcrumb-button-visible {\n  visibility: visible;\n  opacity: 100%;\n}\n\n.create-breadcrumb-button-container.with-screenshots {\n  /* We have more room when screenshots are enabled,\n   * so push the button down slightly */\n  top: 20px;\n}\n\n.create-breadcrumb-button {\n  display: flex;\n  flex-shrink: 0;\n  align-items: center;\n  background: var(--sys-color-cdt-base-container);\n  box-shadow: var(--drop-shadow-depth-3);\n  border-radius: 50px;\n  padding: 1px 6px;\n  gap: 2px;\n}\n\n.create-breadcrumb-button:active {\n  /* On minimap cursor changes to text to selected an area,\n  * so keep it as default on the breadcrumb button */\n  cursor: default;\n}\n\n.create-breadcrumb-button:hover {\n  background: var(--sys-color-neutral-container);\n}\n\n@media (forced-colors: active) {\n  .overview-grid-cursor-position {\n    forced-color-adjust: none;\n    background-color: Highlight;\n  }\n\n  .window-curtain-left,\n  .window-curtain-right {\n    background-color: transparent;\n    border-color: ButtonText;\n  }\n\n  .overview-grid-window-resizer {\n    background-color: ButtonText;\n  }\n\n  .overview-grid-window-resizer:hover,\n  .overview-grid-window-resizer:active,\n  .overview-grid-window-resizer:focus-visible {\n    forced-color-adjust: none;\n    background-color: Highlight;\n  }\n}\n", fn = /* @__PURE__ */ e({
	Events: () => Z,
	OverviewGrid: () => hn,
	Window: () => vn,
	WindowSelector: () => yn
}), J = {
	overviewGridWindow: "Overview grid window",
	leftResizer: "Left Resizer",
	rightResizer: "Right Resizer"
}, pn = i("ui/legacy/components/perf_ui/OverviewGrid.ts", J), mn = r.bind(void 0, pn), hn = class {
	element;
	grid;
	window;
	constructor(e, t) {
		this.element = document.createElement("div"), this.element.id = e + "-overview-container", this.grid = new R(), this.grid.element.id = e + "-overview-grid", this.grid.setScrollTop(0), this.element.appendChild(this.grid.element), this.window = new vn(this.element, this.grid.dividersLabelBarElement, t);
	}
	enableCreateBreadcrumbsButton() {
		return this.window.enableCreateBreadcrumbsButton();
	}
	set showingScreenshots(e) {
		this.window.showingScreenshots = e;
	}
	clientWidth() {
		return this.element.clientWidth;
	}
	updateDividers(e) {
		this.grid.updateDividers(e);
	}
	addEventDividers(e) {
		this.grid.addEventDividers(e);
	}
	removeEventDividers() {
		this.grid.removeEventDividers();
	}
	reset() {
		this.window.reset();
	}
	windowLeftRatio() {
		return this.window.windowLeftRatio || 0;
	}
	windowRightRatio() {
		return this.window.windowRightRatio || 0;
	}
	calculateWindowValue() {
		return this.window.calculateWindowValue();
	}
	setWindowRatio(e, t) {
		this.window.setWindowRatio(e, t);
	}
	addEventListener(e, t, n) {
		return this.window.addEventListener(e, t, n);
	}
	setClickHandler(e) {
		this.window.setClickHandler(e);
	}
	zoom(e, t) {
		this.window.zoom(e, t);
	}
	setResizeEnabled(e) {
		this.window.setResizeEnabled(e);
	}
}, Y = 14, gn = .3, _n = 5, X = 10, vn = class extends s {
	parentElement;
	calculator;
	leftResizeElement;
	rightResizeElement;
	leftCurtainElement;
	rightCurtainElement;
	breadcrumbButtonContainerElement;
	createBreadcrumbButton;
	curtainsRange;
	breadcrumbZoomIcon;
	overviewWindowSelector;
	offsetLeft;
	dragStartPointPixel;
	dragStartLeftRatio;
	dragStartRightRatio;
	windowLeftRatio = 0;
	windowRightRatio = 1;
	resizeEnabled;
	clickHandler;
	resizerParentOffsetLeft;
	#e = !1;
	#t = !1;
	constructor(e, t, n) {
		super(), this.parentElement = e, this.parentElement.classList.add("parent-element"), he(this.parentElement), this.calculator = n, x(this.parentElement, mn(J.overviewGridWindow)), S(this.parentElement, this.startWindowSelectorDragging.bind(this), this.windowSelectorDragging.bind(this), this.endWindowSelectorDragging.bind(this), "text", null), t && S(t, this.startWindowDragging.bind(this), this.windowDragging.bind(this), null, "-webkit-grabbing", "-webkit-grab"), this.parentElement.addEventListener("wheel", this.onMouseWheel.bind(this), !0), this.parentElement.addEventListener("dblclick", this.resizeWindowMaximum.bind(this), !0), ke(this.parentElement, dn), this.leftResizeElement = e.createChild("div", "overview-grid-window-resizer"), S(this.leftResizeElement, this.resizerElementStartDragging.bind(this), this.leftResizeElementDragging.bind(this), null, "ew-resize"), this.rightResizeElement = e.createChild("div", "overview-grid-window-resizer"), S(this.rightResizeElement, this.resizerElementStartDragging.bind(this), this.rightResizeElementDragging.bind(this), null, "ew-resize"), x(this.leftResizeElement, mn(J.leftResizer)), xe(this.leftResizeElement), this.leftResizeElement.addEventListener("keydown", (e) => this.handleKeyboardResizing(e, !1)), this.leftResizeElement.addEventListener("click", this.onResizerClicked), x(this.rightResizeElement, mn(J.rightResizer)), xe(this.rightResizeElement), this.rightResizeElement.addEventListener("keydown", (e) => this.handleKeyboardResizing(e, !0)), this.rightResizeElement.addEventListener("focus", this.onRightResizeElementFocused.bind(this)), this.rightResizeElement.addEventListener("click", this.onResizerClicked), this.leftCurtainElement = e.createChild("div", "window-curtain-left"), this.rightCurtainElement = e.createChild("div", "window-curtain-right"), this.breadcrumbButtonContainerElement = e.createChild("div", "create-breadcrumb-button-container"), this.createBreadcrumbButton = this.breadcrumbButtonContainerElement.createChild("div", "create-breadcrumb-button"), this.createBreadcrumbButton.setAttribute("jslog", `${De("timeline.create-breadcrumb").track({ click: !0 })}`), this.reset();
	}
	enableCreateBreadcrumbsButton() {
		return this.curtainsRange = this.createBreadcrumbButton.createChild("div"), this.breadcrumbZoomIcon = ae("zoom-in"), this.createBreadcrumbButton.appendChild(this.breadcrumbZoomIcon), this.createBreadcrumbButton.addEventListener("click", () => {
			this.#i();
		}), this.#e = !0, this.#n(this.parentElement), this.#n(this.rightResizeElement), this.#n(this.leftResizeElement), this.breadcrumbButtonContainerElement;
	}
	set showingScreenshots(e) {
		this.breadcrumbButtonContainerElement.classList.toggle("with-screenshots", e);
	}
	#n(e) {
		this.#e && (e.addEventListener("mouseover", () => {
			this.windowLeftRatio <= 0 && this.windowRightRatio >= 1 ? (this.breadcrumbButtonContainerElement.classList.toggle("is-breadcrumb-button-visible", !1), this.#t = !1) : (this.breadcrumbButtonContainerElement.classList.toggle("is-breadcrumb-button-visible", !0), this.#t = !0);
		}), e.addEventListener("mouseout", () => {
			this.breadcrumbButtonContainerElement.classList.toggle("is-breadcrumb-button-visible", !1), this.#t = !1;
		}));
	}
	onResizerClicked(e) {
		e.target && e.target.focus();
	}
	onRightResizeElementFocused() {
		this.parentElement.scrollLeft = 0;
	}
	reset() {
		this.windowLeftRatio = 0, this.windowRightRatio = 1, this.setResizeEnabled(!0), this.updateCurtains();
	}
	setResizeEnabled(e) {
		this.resizeEnabled = e, this.rightResizeElement.tabIndex = e ? 0 : -1, this.leftResizeElement.tabIndex = e ? 0 : -1;
	}
	setClickHandler(e) {
		this.clickHandler = e;
	}
	resizerElementStartDragging(e) {
		let t = e, n = e.target;
		return this.resizeEnabled ? (this.resizerParentOffsetLeft = t.pageX - t.offsetX - n.offsetLeft, e.stopPropagation(), !0) : !1;
	}
	leftResizeElementDragging(e) {
		let t = e;
		this.resizeWindowLeft(t.pageX - (this.resizerParentOffsetLeft || 0)), e.preventDefault();
	}
	rightResizeElementDragging(e) {
		let t = e;
		this.resizeWindowRight(t.pageX - (this.resizerParentOffsetLeft || 0)), e.preventDefault();
	}
	handleKeyboardResizing(e, t) {
		let n = e, r = e.target, i = !1;
		if (n.key === "ArrowLeft" || n.key === "ArrowRight") {
			n.key === "ArrowRight" && (i = !0);
			let a = this.getNewResizerPosition(r.offsetLeft, i, n.ctrlKey);
			t ? this.resizeWindowRight(a) : this.resizeWindowLeft(a), e.consume(!0);
		}
	}
	getNewResizerPosition(e, t, n) {
		let r, i = n ? 10 : 2;
		return i = t ? i : -Math.abs(i), r = e + _n + i, t && r < X ? r = X : !t && r > this.parentElement.clientWidth - X && (r = this.parentElement.clientWidth - X), r;
	}
	startWindowSelectorDragging(e) {
		if (!this.resizeEnabled) return !1;
		let t = e;
		this.offsetLeft = this.parentElement.getBoundingClientRect().left;
		let n = t.x - this.offsetLeft;
		return this.overviewWindowSelector = new yn(this.parentElement, n), !0;
	}
	windowSelectorDragging(e) {
		if (this.#t = !0, !this.overviewWindowSelector) return;
		let t = e;
		this.overviewWindowSelector.updatePosition(t.x - this.offsetLeft), e.preventDefault();
	}
	endWindowSelectorDragging(e) {
		if (!this.overviewWindowSelector) return;
		let t = e, n = this.overviewWindowSelector.close(t.x - this.offsetLeft);
		if (!(this.#e && n.start === n.end)) {
			if (delete this.overviewWindowSelector, n.end - n.start < 3) {
				if (this.clickHandler?.call(null, e)) return;
				let t = n.end;
				n.start = Math.max(0, t - Y / 2), n.end = Math.min(this.parentElement.clientWidth, t + Y / 2);
			} else n.end - n.start < Y && (this.parentElement.clientWidth - n.end > Y ? n.end = n.start + Y : n.start = n.end - Y);
			this.setWindowPosition(n.start, n.end);
		}
	}
	startWindowDragging(e) {
		let t = e;
		return this.dragStartPointPixel = t.pageX, this.dragStartLeftRatio = this.windowLeftRatio, this.dragStartRightRatio = this.windowRightRatio, e.stopPropagation(), !0;
	}
	windowDragging(e) {
		this.#t = !0, this.#e && this.breadcrumbButtonContainerElement.classList.toggle("is-breadcrumb-button-visible", !0);
		let t = e;
		t.preventDefault();
		let n = (t.pageX - this.dragStartPointPixel) / this.parentElement.clientWidth;
		this.dragStartLeftRatio + n < 0 && (n = -this.dragStartLeftRatio), this.dragStartRightRatio + n > 1 && (n = 1 - this.dragStartRightRatio), this.setWindowRatio(this.dragStartLeftRatio + n, this.dragStartRightRatio + n);
	}
	resizeWindowLeft(e) {
		this.#t = !0, e < X ? e = 0 : e > this.rightResizeElement.offsetLeft - 4 && (e = this.rightResizeElement.offsetLeft - 4), this.setWindowPosition(e, null);
	}
	resizeWindowRight(e) {
		this.#t = !0, e > this.parentElement.clientWidth - X ? e = this.parentElement.clientWidth : e < this.leftResizeElement.offsetLeft + Y && (e = this.leftResizeElement.offsetLeft + Y), this.setWindowPosition(null, e);
	}
	resizeWindowMaximum() {
		this.setWindowPosition(0, this.parentElement.clientWidth);
	}
	getRawSliderValue(e) {
		if (!this.calculator) throw Error("No calculator to calculate boundaries");
		let t = this.calculator.minimumBoundary(), n = this.calculator.maximumBoundary() - t;
		return e ? t + n * this.windowLeftRatio : t + n * this.windowRightRatio;
	}
	updateResizeElementAriaValue(e, t) {
		let n = e.toFixed(2), r = t.toFixed(2);
		_e(this.leftResizeElement, n), _e(this.rightResizeElement, r);
		let i = Number(r) - .5, a = Number(n) + .5;
		Ee(this.leftResizeElement, "0", i.toString()), Ee(this.rightResizeElement, a.toString(), "100");
	}
	updateResizeElementPositionLabels() {
		if (!this.calculator) return;
		let e = this.calculator.formatValue(this.getRawSliderValue(!0)), t = this.calculator.formatValue(this.getRawSliderValue(!1));
		O(this.leftResizeElement, String(e)), O(this.rightResizeElement, String(t));
	}
	updateResizeElementPercentageLabels(e, t) {
		O(this.leftResizeElement, e), O(this.rightResizeElement, t);
	}
	calculateWindowValue() {
		return {
			rawStartValue: this.getRawSliderValue(!0),
			rawEndValue: this.getRawSliderValue(!1)
		};
	}
	setWindowRatio(e, t) {
		this.windowLeftRatio = e, this.windowRightRatio = t, this.updateCurtains(), this.calculator && this.dispatchEventToListeners("WindowChangedWithPosition", this.calculateWindowValue()), this.dispatchEventToListeners("WindowChanged"), this.#r(e, t);
	}
	#r(e, t) {
		this.#e && (t >= 1 && e <= 0 || !this.#t ? this.breadcrumbButtonContainerElement.classList.toggle("is-breadcrumb-button-visible", !1) : this.breadcrumbButtonContainerElement.classList.toggle("is-breadcrumb-button-visible", !0));
	}
	#i() {
		this.dispatchEventToListeners("BreadcrumbAdded", this.calculateWindowValue());
	}
	updateCurtains() {
		let e = this.windowLeftRatio, t = this.windowRightRatio, n = e, r = t, i = r - n;
		if (this.parentElement.clientWidth !== 0) {
			let a = i * this.parentElement.clientWidth, o = Y / 2;
			if (a < o) {
				let s = o / a;
				n = (t + e - i * s) / 2, r = (t + e + i * s) / 2;
			}
		}
		let a = 100 * n, o = 100 * r, s = 100 - 100 * r, c = a + "%", l = o + "%";
		this.leftResizeElement.style.left = c, this.rightResizeElement.style.left = l, this.leftCurtainElement.style.width = c, this.rightCurtainElement.style.width = s + "%", this.breadcrumbButtonContainerElement.style.marginLeft = a > 0 ? a + "%" : "0%", this.breadcrumbButtonContainerElement.style.marginRight = s > 0 ? s + "%" : "0%", this.curtainsRange && (this.curtainsRange.textContent = this.getWindowRange().toFixed(0) + " ms"), this.updateResizeElementAriaValue(a, o), this.calculator ? this.updateResizeElementPositionLabels() : this.updateResizeElementPercentageLabels(c, l), this.toggleBreadcrumbZoomButtonDisplay();
	}
	toggleBreadcrumbZoomButtonDisplay() {
		this.breadcrumbZoomIcon && (this.getWindowRange() < 4.5 ? (this.breadcrumbZoomIcon.style.display = "none", this.breadcrumbButtonContainerElement.style.pointerEvents = "none") : (this.breadcrumbZoomIcon.style.display = "flex", this.breadcrumbButtonContainerElement.style.pointerEvents = "auto"));
	}
	getWindowRange() {
		if (!this.calculator) throw Error("No calculator to calculate window range");
		let e = this.windowLeftRatio > 0 ? this.windowLeftRatio : 0, t = this.windowRightRatio < 1 ? this.windowRightRatio : 1;
		return this.calculator.boundarySpan() * (t - e);
	}
	setWindowPosition(e, t) {
		let n = this.parentElement.clientWidth, r = typeof e == "number" ? e / n : this.windowLeftRatio, i = typeof t == "number" ? t / n : this.windowRightRatio;
		this.setWindowRatio(r || 0, i || 0);
	}
	onMouseWheel(e) {
		let t = e;
		if (this.resizeEnabled) {
			if (t.deltaY) {
				let e = t.offsetX / this.parentElement.clientWidth;
				this.zoom(1.1 ** (t.deltaY * .018867924528301886), e);
			}
			if (t.deltaX) {
				let e = Math.round(t.deltaX * gn), n = this.leftResizeElement.offsetLeft + _n, r = this.rightResizeElement.offsetLeft + _n;
				n - e < 0 && (e = n), r - e > this.parentElement.clientWidth && (e = r - this.parentElement.clientWidth), this.setWindowPosition(n - e, r - e), t.preventDefault();
			}
		}
	}
	zoom(e, t) {
		let n = this.windowLeftRatio || 0, r = this.windowRightRatio || 0, i = r - n, a = e * i;
		a > 1 && (a = 1, e = a / i), n = t + (n - t) * e, n = b(n, 0, 1 - a), r = t + (r - t) * e, r = b(r, a, 1), this.setWindowRatio(n, r);
	}
}, Z = /* @__PURE__ */ function(e) {
	return e.WINDOW_CHANGED = "WindowChanged", e.WINDOW_CHANGED_WITH_POSITION = "WindowChangedWithPosition", e.BREADCRUMB_ADDED = "BreadcrumbAdded", e;
}({}), yn = class {
	startPosition;
	width;
	windowSelector;
	constructor(e, t) {
		this.startPosition = t, this.width = e.offsetWidth, this.windowSelector = document.createElement("div"), this.windowSelector.className = "overview-grid-window-selector", this.windowSelector.style.left = this.startPosition + "px", this.windowSelector.style.right = this.width - this.startPosition + "px", e.appendChild(this.windowSelector);
	}
	close(e) {
		return e = Math.max(0, Math.min(e, this.width)), this.windowSelector.remove(), this.startPosition < e ? {
			start: this.startPosition,
			end: e
		} : {
			start: e,
			end: this.startPosition
		};
	}
	updatePosition(e) {
		e = Math.max(0, Math.min(e, this.width)), e < this.startPosition ? (this.windowSelector.style.left = e + "px", this.windowSelector.style.right = this.width - this.startPosition + "px") : (this.windowSelector.style.left = this.startPosition + "px", this.windowSelector.style.right = this.width - e + "px");
	}
}, bn = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.root {\n  align-items: flex-start; /* keep chart at top so it doesnt change position as the legend changes height */\n  display: flex;\n  min-width: fit-content;\n  white-space: nowrap;\n}\n\n.chart-root {\n  position: relative;\n  overflow: hidden;\n}\n\n.pie-chart-foreground {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  z-index: 10;\n  top: 0;\n  display: flex;\n  pointer-events: none;\n}\n\n.pie-chart-total {\n  margin: auto;\n  padding: 2px 5px;\n  pointer-events: auto;\n}\n\n:focus {\n  outline-style: none;\n}\n\n.pie-chart-total.selected {\n  font-weight: bold;\n}\n\n.chart-root .slice.selected {\n  stroke: var(--sys-color-primary);\n  stroke-opacity: 100%;\n  stroke-width: 0.04;\n  stroke-linecap: round;\n  stroke-linejoin: round;\n}\n\n.pie-chart-legend {\n  margin-left: 30px;\n}\n\n.pie-chart-legend-row {\n  margin: 5px 2px 5px auto;\n  padding-right: 25px;\n}\n\n.pie-chart-legend-row.selected {\n  font-weight: bold;\n}\n\n.pie-chart-legend-row:focus-visible {\n  box-shadow: 0 0 0 2px var(--sys-color-state-focus-ring) !important; /* stylelint-disable-line declaration-no-important */\n}\n\n.pie-chart-swatch {\n  display: inline-block;\n  width: 11px;\n  height: 11px;\n  margin: 0 6px;\n  top: 1px;\n  position: relative;\n  border: 1px solid var(--sys-color-neutral-outline);\n}\n\n.pie-chart-name {\n  display: inline-block;\n}\n\n.pie-chart-size {\n  display: inline-block;\n  text-align: right;\n  width: 70px;\n}\n\n@media (forced-colors: active) {\n  .pie-chart-swatch {\n    forced-color-adjust: none;\n    border-color: ButtonText;\n  }\n\n  .pie-chart-total {\n    forced-color-adjust: none;\n    background-color: canvas;\n  }\n}\n", xn = /* @__PURE__ */ e({ PieChart: () => Tn }), Sn = { total: "Total" }, Cn = i("ui/legacy/components/perf_ui/PieChart.ts", Sn), wn = r.bind(void 0, Cn), Tn = class extends HTMLElement {
	shadow = this.attachShadow({ mode: "open" });
	chartName = "";
	size = 0;
	formatter = (e) => String(e);
	showLegend = !1;
	total = 0;
	slices = [];
	totalSelected = !0;
	sliceSelected = -1;
	innerR = .618;
	lastAngle = -Math.PI / 2;
	set data(e) {
		this.chartName = e.chartName, this.size = e.size, this.formatter = e.formatter, this.showLegend = e.showLegend, this.total = e.total, this.slices = e.slices, this.render();
	}
	render() {
		this.lastAngle = -Math.PI / 2;
		let e = se`
      <style>${bn}</style>
      <div class="root" role="group" @keydown=${this.onKeyDown} aria-label=${this.chartName}
          jslog=${me().track({ keydown: "ArrowUp|ArrowDown" })}>
        <div class="chart-root" style="width: ${this.size}px; height: ${this.size}px;">
          ${pe`
          <svg>
          <g transform="scale(${this.size / 2}) translate(1, 1) scale(0.99, 0.99)">
            <circle r="1" stroke="hsl(0, 0%, 80%)" fill="transparent" stroke-width=${1 / this.size}></circle>
            <circle r=${this.innerR} stroke="hsl(0, 0%, 80%)" fill="transparent" stroke-width=${1 / this.size}></circle>
            ${this.slices.map((e, t) => {
			let n = this.sliceSelected === t, r = n && !this.showLegend ? "0" : "-1";
			return pe`<path class="slice ${n ? "selected" : ""}"
                  jslog=${de().track({ click: !0 })}
                  @click=${this.onSliceClicked(t)} tabIndex=${r}
                  fill=${e.color} d=${this.getPathStringForSlice(e)}
                  aria-label=${e.title} id=${n ? "selectedSlice" : ""}></path>`;
		})}
            <!-- This is so that the selected slice is re-drawn on top, to avoid re-ordering slices
            just to render them properly. -->
            <use href="#selectedSlice" />
            </g>
          </svg>
          `}
          <div class="pie-chart-foreground">
            <div class="pie-chart-total ${this.totalSelected ? "selected" : ""}" @click=${this.selectTotal}
                jslog=${ge("select-total").track({ click: !0 })}
                tabIndex=${this.totalSelected && !this.showLegend ? "1" : "-1"}>
              ${this.total ? this.formatter(this.total) : ""}
            </div>
          </div>
        </div>
        ${this.showLegend ? se`
        <div class="pie-chart-legend" jslog=${je("legend")}>
          ${this.slices.map((e, t) => {
			let n = this.sliceSelected === t;
			return se`
              <div class="pie-chart-legend-row ${n ? "selected" : ""}"
                  jslog=${de().track({ click: !0 })}
                  @click=${this.onSliceClicked(t)} tabIndex=${n ? "0" : "-1"}>
                <div class="pie-chart-size">${this.formatter(e.value)}</div>
                <div class="pie-chart-swatch" style="background-color: ${e.color};"></div>
                <div class="pie-chart-name">${e.title}</div>
              </div>`;
		})}
          <div class="pie-chart-legend-row ${this.totalSelected ? "selected" : ""}"
              jslog=${ge("select-total").track({ click: !0 })}
              @click=${this.selectTotal} tabIndex=${this.totalSelected ? "0" : "-1"}>
            <div class="pie-chart-size">${this.formatter(this.total)}</div>
            <div class="pie-chart-swatch"></div>
            <div class="pie-chart-name">${wn(Sn.total)}</div>
          </div>
        </div>
        ` : ""}
      </div>
    `;
		ee(e, this.shadow, { host: this });
	}
	onSliceClicked(e) {
		return () => {
			this.selectSlice(e);
		};
	}
	selectSlice(e) {
		this.totalSelected = !1, this.sliceSelected = e, this.render();
	}
	selectTotal() {
		this.totalSelected = !0, this.sliceSelected = -1, this.render();
	}
	selectAndFocusTotal() {
		this.selectTotal();
		let e = this.shadow.querySelector(".pie-chart-legend > :last-child");
		e && e.focus();
	}
	selectAndFocusSlice(e) {
		this.selectSlice(e);
		let t = this.shadow.querySelector(`.pie-chart-legend > :nth-child(${e + 1})`);
		t && t.focus();
	}
	focusNextElement() {
		this.totalSelected ? this.selectAndFocusSlice(0) : this.sliceSelected === this.slices.length - 1 ? this.selectAndFocusTotal() : this.selectAndFocusSlice(this.sliceSelected + 1);
	}
	focusPreviousElement() {
		this.totalSelected ? this.selectAndFocusSlice(this.slices.length - 1) : this.sliceSelected === 0 ? this.selectAndFocusTotal() : this.selectAndFocusSlice(this.sliceSelected - 1);
	}
	onKeyDown(e) {
		let t = !1;
		e.key === "ArrowDown" ? (this.focusNextElement(), t = !0) : e.key === "ArrowUp" && (this.focusPreviousElement(), t = !0), t && (e.stopImmediatePropagation(), e.preventDefault());
	}
	getPathStringForSlice(e) {
		let t = e.value / this.total * 2 * Math.PI;
		if (!isFinite(t)) return;
		t = Math.min(t, 2 * Math.PI * .9999);
		let n = Math.cos(this.lastAngle), r = Math.sin(this.lastAngle);
		this.lastAngle += t;
		let i = Math.cos(this.lastAngle), a = Math.sin(this.lastAngle), o = this.innerR, s = i * o, c = a * o, l = n * o, u = r * o, d = +(t > Math.PI);
		return `M${n},${r} A1,1,0,${d},1,${i},${a} L${s},${c} A${o},${o},0,${d},0,${l},${u} Z`;
	}
};
customElements.define("devtools-perf-piechart", Tn);
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/legacy/components/perf_ui/TimelineOverviewCalculator.ts
var En = /* @__PURE__ */ e({ TimelineOverviewCalculator: () => Dn }), Dn = class {
	#e = N(0);
	#t = N(100);
	#n = 0;
	navStartTimes;
	computePosition(e) {
		return (e - this.#e) / this.boundarySpan() * this.#n;
	}
	positionToTime(e) {
		return this.#n === 0 ? N(0) : N(e / this.#n * this.boundarySpan() + this.#e);
	}
	setBounds(e, t) {
		this.#e = e, this.#t = t;
	}
	setNavStartTimes(e) {
		this.navStartTimes = e;
	}
	setDisplayWidth(e) {
		this.#n = e;
	}
	reset() {
		this.setBounds(N(0), N(100));
	}
	formatValue(e, t) {
		if (this.navStartTimes) for (let t = this.navStartTimes.length - 1; t >= 0; t--) {
			let n = M(this.navStartTimes[t].ts);
			if (e > n) {
				e = N(e - (n - this.zeroTime()));
				break;
			}
		}
		return o(e - this.zeroTime(), t);
	}
	maximumBoundary() {
		return this.#t;
	}
	minimumBoundary() {
		return this.#e;
	}
	zeroTime() {
		return this.#e;
	}
	boundarySpan() {
		return N(this.#t - this.#e);
	}
}, Q = null, $ = class e extends Event {
	state;
	updateType;
	options;
	static eventName = "traceboundsstatechanged";
	constructor(t, n, r = { shouldAnimate: !1 }) {
		super(e.eventName, {
			composed: !0,
			bubbles: !0
		}), this.state = t, this.updateType = n, this.options = r;
	}
};
function On(e) {
	kn.instance().addEventListener($.eventName, e);
}
var kn = class e extends EventTarget {
	static instance(t = { forceNew: null }) {
		let n = !!t.forceNew;
		return (!Q || n) && (Q = new e()), Q;
	}
	static removeInstance() {
		Q = null;
	}
	#e = null;
	constructor() {
		super();
	}
	resetWithNewBounds(e) {
		return this.#e = {
			entireTraceBounds: e,
			minimapTraceBounds: e,
			timelineTraceWindow: e
		}, this.dispatchEvent(new $(this.state(), "RESET")), this;
	}
	state() {
		if (this.#e === null) return null;
		let e = We(this.#e.entireTraceBounds), t = We(this.#e.minimapTraceBounds), n = We(this.#e.timelineTraceWindow);
		return {
			micro: this.#e,
			milli: {
				entireTraceBounds: e,
				minimapTraceBounds: t,
				timelineTraceWindow: n
			}
		};
	}
	setMiniMapBounds(e) {
		if (!this.#e) {
			console.error("TraceBounds.setMiniMapBounds could not set bounds because there is no existing trace window set.");
			return;
		}
		let t = this.#e.minimapTraceBounds;
		(e.min !== t.min || e.max !== t.max) && (e.range < 1e3 || (this.#e.minimapTraceBounds = e, this.dispatchEvent(new $(this.state(), "MINIMAP_BOUNDS"))));
	}
	setTimelineVisibleWindow(e, t = {
		shouldAnimate: !1,
		ignoreMiniMapBounds: !1
	}) {
		if (!this.#e) {
			console.error("TraceBounds.setTimelineVisibleWindow could not set bounds because there is no existing trace window set.");
			return;
		}
		let n = this.#e.timelineTraceWindow;
		e.range < 1e3 || (e.min !== n.min || e.max !== n.max) && (t.ignoreMiniMapBounds || (e.min = Je(Math.max(this.#e.minimapTraceBounds.min, e.min)), e.max = Je(Math.min(this.#e.minimapTraceBounds.max, e.max))), (e.min !== n.min || e.max !== n.max) && (this.#e.timelineTraceWindow = e, this.dispatchEvent(new $(this.state(), "VISIBLE_WINDOW", { shouldAnimate: t.shouldAnimate }))));
	}
}, An = "/*\n * Copyright 2017 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.overview-info:not(:empty) {\n  display: flex;\n  background: var(--sys-color-cdt-base-container);\n  box-shadow: var(--sys-elevation-level2);\n  padding: var(--sys-size-4);\n  border-radius: var(--sys-shape-corner-small);\n}\n\n.overview-info .frame .time {\n  display: none;\n}\n\n.overview-info .frame .thumbnail img {\n  max-width: 50vw;\n  max-height: 50vh;\n}\n", jn = /* @__PURE__ */ e({
	Events: () => Nn,
	OverviewInfo: () => Fn,
	TimelineOverviewBase: () => Pn,
	TimelineOverviewPane: () => Mn
}), Mn = class extends t(D) {
	overviewCalculator;
	overviewGrid;
	cursorArea;
	cursorElement;
	overviewControls = [];
	markers = /* @__PURE__ */ new Map();
	overviewInfo;
	updateThrottler = new we(100);
	cursorEnabled = !1;
	cursorPosition = 0;
	lastWidth = 0;
	windowStartTime = N(0);
	windowEndTime = N(Infinity);
	muteOnWindowChanged = !1;
	hasPointer = !1;
	#e;
	#t = this.#n.bind(this);
	constructor(e) {
		super(), this.element.id = e + "-overview-pane", this.overviewCalculator = new Dn(), this.overviewGrid = new hn(e, this.overviewCalculator), this.overviewGrid.element.setAttribute("jslog", `${be(`${e}-overview`).track({
			click: !0,
			drag: !0,
			hover: !0
		})}`), this.element.appendChild(this.overviewGrid.element), this.cursorArea = this.overviewGrid.element.createChild("div", "overview-grid-cursor-area"), this.cursorElement = this.overviewGrid.element.createChild("div", "overview-grid-cursor-position"), this.cursorArea.addEventListener("pointerdown", this.onMouseDown.bind(this), !0), this.cursorArea.addEventListener("pointerup", this.onMouseCancel.bind(this), !0), this.cursorArea.addEventListener("pointercancel", this.onMouseCancel.bind(this), !0), this.cursorArea.addEventListener("pointermove", this.onMouseMove.bind(this), !0), this.cursorArea.addEventListener("pointerleave", this.hideCursor.bind(this), !0), this.overviewGrid.setResizeEnabled(!1), this.overviewGrid.addEventListener(Z.WINDOW_CHANGED_WITH_POSITION, this.onWindowChanged, this), this.overviewGrid.addEventListener(Z.BREADCRUMB_ADDED, this.onBreadcrumbAdded, this), this.overviewGrid.setClickHandler(this.onClick.bind(this)), this.overviewInfo = new Fn(this.cursorElement), this.#e = T(this.element, "svg", "timeline-minimap-dim-highlight-svg hidden"), this.#i();
	}
	enableCreateBreadcrumbsButton() {
		let e = this.overviewGrid.enableCreateBreadcrumbsButton();
		e.addEventListener("pointerdown", this.onMouseDown.bind(this), !0), e.addEventListener("pointerup", this.onMouseCancel.bind(this), !0), e.addEventListener("pointercancel", this.onMouseCancel.bind(this), !0), e.addEventListener("pointermove", this.onMouseMove.bind(this), !0), e.addEventListener("pointerleave", this.hideCursor.bind(this), !0);
	}
	onMouseDown(e) {
		e.target instanceof HTMLElement && (e.target.setPointerCapture(e.pointerId), this.overviewInfo.hide(), this.hasPointer = !0);
	}
	onMouseCancel(e) {
		e.target instanceof HTMLElement && (e.target.releasePointerCapture(e.pointerId), this.overviewInfo.show(), this.hasPointer = !1);
	}
	onMouseMove(e) {
		if (!this.cursorEnabled) return;
		let t = e, n = e.target.getBoundingClientRect().left - this.cursorArea.getBoundingClientRect().left;
		this.cursorPosition = t.offsetX + n, this.cursorElement.style.left = this.cursorPosition + "px", this.cursorElement.style.visibility = "visible";
		let r = this.overviewCalculator.positionToTime(this.cursorPosition), i = this.overviewGrid.calculateWindowValue();
		if (N(i.rawStartValue) <= r && r <= N(i.rawEndValue)) {
			let e = Ge(r);
			this.dispatchEventToListeners("OverviewPaneMouseMove", { timeInMicroSeconds: e });
		} else this.dispatchEventToListeners("OverviewPaneMouseLeave");
		this.hasPointer || this.overviewInfo.setContent(this.buildOverviewInfo());
	}
	async buildOverviewInfo() {
		let e = this.element.ownerDocument, t = this.cursorPosition, n = await Promise.all(this.overviewControls.map((e) => e.overviewInfoPromise(t))), r = e.createDocumentFragment(), i = n.filter((e) => e !== null);
		return r.append(...i), r;
	}
	hideCursor() {
		this.cursorElement.style.visibility = "hidden", this.dispatchEventToListeners("OverviewPaneMouseLeave"), this.overviewInfo.hide();
	}
	#n() {
		this.scheduleUpdate();
	}
	wasShown() {
		super.wasShown();
		let e = kn.instance().state()?.milli.minimapTraceBounds.min, t = kn.instance().state()?.milli.minimapTraceBounds.max;
		this.update(e, t), A.instance().addEventListener(j.eventName, this.#t);
	}
	willHide() {
		A.instance().removeEventListener(j.eventName, this.#t), this.overviewInfo.hide(), super.willHide();
	}
	onResize() {
		let e = this.element.offsetWidth;
		e !== this.lastWidth && (this.lastWidth = e, this.scheduleUpdate());
	}
	setOverviewControls(e) {
		for (let e = 0; e < this.overviewControls.length; ++e) this.overviewControls[e].dispose();
		for (let t = 0; t < e.length; ++t) e[t].setCalculator(this.overviewCalculator), e[t].show(this.overviewGrid.element);
		this.overviewControls = e, this.update();
	}
	set showingScreenshots(e) {
		this.overviewGrid.showingScreenshots = e;
	}
	setBounds(e, t) {
		(e !== this.overviewCalculator.minimumBoundary() || t !== this.overviewCalculator.maximumBoundary()) && (this.overviewCalculator.setBounds(e, t), this.overviewGrid.setResizeEnabled(!0), this.cursorEnabled = !0, this.scheduleUpdate(e, t));
	}
	setNavStartTimes(e) {
		this.overviewCalculator.setNavStartTimes(e);
	}
	scheduleUpdate(e, t) {
		this.updateThrottler.schedule(async () => {
			this.update(e, t);
		});
	}
	update(e, t) {
		if (this.isShowing()) {
			this.overviewCalculator.setDisplayWidth(this.overviewGrid.clientWidth());
			for (let n = 0; n < this.overviewControls.length; ++n) this.overviewControls[n].update(e, t);
			this.overviewGrid.updateDividers(this.overviewCalculator), this.updateMarkers(), this.updateWindow();
		}
	}
	setMarkers(e) {
		this.markers = e;
	}
	#r(e) {
		for (let t of this.markers.keys()) {
			let n = this.markers.get(t);
			if (!n) continue;
			let r = Ge(N(t)), i = e && !Ye(e, r);
			n.style.filter = `grayscale(${+!!i})`;
		}
	}
	updateMarkers() {
		let e = /* @__PURE__ */ new Map();
		for (let t of this.markers.keys()) {
			let n = this.markers.get(t), r = Math.round(this.overviewCalculator.computePosition(N(t)));
			e.has(r) || (e.set(r, n), n.style.left = r + "px");
		}
		this.overviewGrid.removeEventDividers(), this.overviewGrid.addEventDividers([...e.values()]);
	}
	reset() {
		this.windowStartTime = N(0), this.windowEndTime = N(Infinity), this.overviewCalculator.reset(), this.overviewGrid.reset(), this.overviewGrid.setResizeEnabled(!1), this.cursorEnabled = !1, this.hideCursor(), this.markers = /* @__PURE__ */ new Map();
		for (let e of this.overviewControls) e.reset();
		this.overviewInfo.hide(), this.scheduleUpdate();
	}
	onClick(e) {
		return this.overviewControls.some((t) => t.onClick(e));
	}
	onBreadcrumbAdded() {
		this.dispatchEventToListeners("OverviewPaneBreadcrumbAdded", {
			startTime: N(this.windowStartTime),
			endTime: N(this.windowEndTime)
		});
	}
	onWindowChanged(e) {
		if (this.muteOnWindowChanged || !this.overviewControls.length) return;
		this.windowStartTime = N(e.data.rawStartValue === this.overviewCalculator.minimumBoundary() ? 0 : e.data.rawStartValue), this.windowEndTime = N(e.data.rawEndValue === this.overviewCalculator.maximumBoundary() ? Infinity : e.data.rawEndValue);
		let t = {
			startTime: N(this.windowStartTime),
			endTime: N(this.windowEndTime)
		};
		this.dispatchEventToListeners("OverviewPaneWindowChanged", t);
	}
	setWindowTimes(e, t) {
		(e !== this.windowStartTime || t !== this.windowEndTime) && (this.windowStartTime = e, this.windowEndTime = t, this.updateWindow(), this.dispatchEventToListeners("OverviewPaneWindowChanged", {
			startTime: N(e),
			endTime: N(t)
		}));
	}
	updateWindow() {
		if (!this.overviewControls.length) return;
		let e = this.overviewCalculator.minimumBoundary(), t = this.overviewCalculator.maximumBoundary() - e, n = e > 0, r = n && this.windowStartTime ? Math.min((this.windowStartTime - e) / t, 1) : 0, i = n && this.windowEndTime < Infinity ? (this.windowEndTime - e) / t : 1;
		this.muteOnWindowChanged = !0, this.overviewGrid.setWindowRatio(r, i), this.muteOnWindowChanged = !1;
	}
	#i() {
		let e = T(this.#e, "defs"), t = T(e, "mask");
		t.id = "dim-highlight-cutouts";
		let n = T(t, "rect");
		n.setAttribute("width", "100%"), n.setAttribute("height", "100%"), n.setAttribute("fill", "hsl(0deg 0% 95%)");
		let r = T(this.#e, "rect", "background");
		r.setAttribute("width", "100%"), r.setAttribute("height", "100%"), r.setAttribute("fill", A.instance().getComputedValue("--color-background")), r.setAttribute("mask", `url(#${t.id})`), r.style.mixBlendMode = "saturation";
		let i = T(t, "rect", "punch");
		i.setAttribute("y", "0"), i.setAttribute("height", "100%"), i.setAttribute("fill", "black");
		let a = A.instance().getComputedValue("--sys-color-state-on-header-hover");
		T(this.#e, "polygon").setAttribute("fill", a), A.instance().addEventListener(j.eventName, () => {
			this.#e.querySelector("rect.background")?.setAttribute("fill", A.instance().getComputedValue("--color-background")), this.#e.querySelector("polygon")?.setAttribute("fill", A.instance().getComputedValue("--sys-color-state-on-header-hover"));
		});
	}
	#a(e, t) {
		let n = this.#e.querySelector("polygon");
		n?.setAttribute("points", `${e},0 ${e},5 ${e + 5 - 1},1 ${t - 5 - 1},1 ${t},5 ${t},0`), n?.classList.remove("hidden");
	}
	#o() {
		this.#e.querySelector("polygon")?.classList.add("hidden");
	}
	highlightBounds(e, t) {
		let n = this.overviewCalculator.computePosition(M(e.min)), r = this.overviewCalculator.computePosition(M(e.max));
		this.#r(e);
		let i = this.#e.querySelector("rect.punch");
		i?.setAttribute("x", n.toString()), i?.setAttribute("width", (r - n).toString()), t ? this.#a(n, r) : this.#o(), this.#e.classList.remove("hidden");
	}
	clearBoundsHighlight() {
		this.#r(), this.#e.classList.add("hidden");
	}
}, Nn = /* @__PURE__ */ function(e) {
	return e.OVERVIEW_PANE_WINDOW_CHANGED = "OverviewPaneWindowChanged", e.OVERVIEW_PANE_BREADCRUMB_ADDED = "OverviewPaneBreadcrumbAdded", e.OVERVIEW_PANE_MOUSE_MOVE = "OverviewPaneMouseMove", e.OVERVIEW_PANE_MOUSE_LEAVE = "OverviewPaneMouseLeave", e;
}({}), Pn = class extends D {
	#e;
	canvas;
	#t;
	constructor() {
		super(), this.#e = null, this.canvas = this.element.createChild("canvas", "fill"), this.#t = this.canvas.getContext("2d");
	}
	width() {
		return this.canvas.width;
	}
	height() {
		return this.canvas.height;
	}
	context() {
		if (!this.#t) throw Error("Unable to retrieve canvas context");
		return this.#t;
	}
	calculator() {
		return this.#e;
	}
	update() {
		throw Error("Not implemented");
	}
	dispose() {
		this.detach();
	}
	reset() {}
	async overviewInfoPromise(e) {
		return null;
	}
	setCalculator(e) {
		this.#e = e;
	}
	onClick(e) {
		return !1;
	}
	resetCanvas() {
		this.element.clientWidth && this.setCanvasSize(this.element.clientWidth, this.element.clientHeight);
	}
	setCanvasSize(e, t) {
		this.canvas.width = e * window.devicePixelRatio, this.canvas.height = t * window.devicePixelRatio;
	}
}, Fn = class {
	anchorElement;
	glassPane;
	visible;
	element;
	constructor(e) {
		this.anchorElement = e, this.glassPane = new Le(), this.glassPane.setPointerEventsBehavior(le.PIERCE_CONTENTS), this.glassPane.setMarginBehavior(_.DEFAULT_MARGIN), this.glassPane.setSizeBehavior(re.MEASURE_CONTENT), this.visible = !1, this.element = Pe(this.glassPane.contentElement, { cssFile: An }).createChild("div", "overview-info");
	}
	async setContent(e) {
		this.visible = !0;
		let t = await e;
		this.visible && (this.element.removeChildren(), this.element.appendChild(t), this.glassPane.setContentAnchorBox(this.anchorElement.boxInWindow()), this.glassPane.isShowing() || this.glassPane.show(this.anchorElement.ownerDocument));
	}
	hide() {
		this.visible = !1, this.glassPane.hide();
	}
	show() {
		this.visible = !0, this.glassPane.show(window.document);
	}
};
//#endregion
export { Rt as A, Gt as C, Mt as D, zt as E, L as F, ut as I, I as L, jt as M, R as N, Nt as O, ft as P, it as R, Kt as S, Bt as T, cn as _, kn as a, Jt as b, Tn as c, hn as d, fn as f, on as g, un as h, jn as i, mt as j, Ft as k, xn as l, rn as m, Pn as n, On as o, vn as p, Mn as r, En as s, Nn as t, Z as u, $t as v, Ut as w, qt as x, tn as y, Ze as z };
