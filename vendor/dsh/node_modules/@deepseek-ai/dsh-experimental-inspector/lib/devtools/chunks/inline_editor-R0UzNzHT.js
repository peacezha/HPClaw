import { a as e } from "./dom_extension-BLny9Waw.js";
import { $ as t, Et as n, H as r, K as i, Q as a, W as o } from "./common-DMSVbaSb.js";
import { $a as s, Bt as c, Ci as ee, Di as l, Dp as u, Ea as te, Ei as ne, Fo as re, Ht as ie, Ji as ae, Jo as d, Mn as f, No as p, Oi as oe, On as se, Po as ce, Vo as le, Wi as ue, _i as m, _n as h, _o as de, ao as fe, ei as g, fn as pe, fp as me, gi as he, gn as ge, ha as _e, ji as ve, ka as _, ko as ye, mi as v, oo as be, ri as xe, va as Se, wa as y, wi as Ce, xp as we, ya as Te, yn as Ee, za as De, zt as Oe } from "./legacy-dM_vujv7.js";
import "./platform-D4TUCh2P.js";
import "./text_utils-DWSliayn.js";
import { w as ke } from "./StringUtilities-CMDxNrEc.js";
import { o as Ae } from "./FormatterActions-D6HaA-6R.js";
import { Nn as je } from "./codemirror-CENmPHF2.js";
import { r as Me } from "./color_picker-Dp-vkqgw.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/legacy/components/inline_editor/CSSLinearEasingModel.ts
var Ne = je.cssLanguage.parser, b = new Intl.NumberFormat("en", { maximumFractionDigits: 2 });
function Pe(e, t) {
	for (let n = t; n < e.length; n++) if (!isNaN(e[n].input)) return n;
	return -1;
}
function Fe(e, t) {
	let n = [];
	for (; e.type.name !== "," && e.type.name !== ")";) {
		let r = t.substring(e.from, e.to);
		if (e.type.name !== "NumberLiteral") return null;
		n.push(r), e.next(!1);
	}
	if (n.length > 3) return null;
	let r = n.filter((e) => e.includes("%"));
	if (r.length > 2) return null;
	let i = n.filter((e) => !e.includes("%"));
	return i.length === 1 ? {
		number: Number(i[0]),
		lengthA: r[0] ? Number(r[0].substring(0, r[0].length - 1)) : void 0,
		lengthB: r[1] ? Number(r[1].substring(0, r[1].length - 1)) : void 0
	} : null;
}
function Ie(e) {
	let t = `*{--a: ${e}}`, n = Ne.parse(t).cursorAt(t.indexOf(":") + 1);
	for (; n.name !== "ArgList" && n.next(!0);) if (n.name === "Callee" && t.substring(n.from, n.to) !== "linear") return null;
	if (n.name !== "ArgList") return null;
	n.firstChild();
	let r = [];
	for (; n.type.name !== ")" && n.next(!1);) {
		let e = Fe(n, t);
		if (!e) return null;
		r.push(e);
	}
	return r;
}
var x = { linear: "linear(0 0%, 1 100%)" }, S = class e {
	#e;
	constructor(e) {
		this.#e = e;
	}
	static parse(t) {
		if (x[t]) return e.parse(x[t]);
		let n = Ie(t);
		if (!n || n.length < 2) return null;
		let r = -Infinity, i = [];
		for (let e = 0; e < n.length; e++) {
			let t = n[e], a = {
				input: NaN,
				output: t.number
			};
			if (i.push(a), t.lengthA !== void 0) {
				if (a.input = Math.max(t.lengthA, r), r = a.input, t.lengthB !== void 0) {
					let e = {
						input: NaN,
						output: a.output
					};
					i.push(e), e.input = Math.max(t.lengthB, r), r = e.input;
				}
			} else e === 0 ? (a.input = 0, r = 0) : e === n.length - 1 && (a.input = Math.max(100, r));
		}
		let a = 0;
		for (let e = 1; e < i.length; e++) isNaN(i[e].input) && (e > a && (a = Pe(i, e)), i[e].input = i[e - 1].input + (i[a].input - i[e - 1].input) / (a - (e - 1)));
		return new e(i);
	}
	addPoint(e, t) {
		if (t !== void 0) {
			this.#e.splice(t, 0, e);
			return;
		}
		this.#e.push(e);
	}
	removePoint(e) {
		this.#e.splice(e, 1);
	}
	setPoint(e, t) {
		this.#e[e] = t;
	}
	points() {
		return this.#e;
	}
	asCSSText() {
		let e = `linear(${this.#e.map((e) => `${b.format(e.output)} ${b.format(e.input)}%`).join(", ")})`;
		for (let [t, n] of Object.entries(x)) if (n === e) return t;
		return e;
	}
}, C = class {
	static parse(e) {
		return S.parse(e) || v.parse(e) || null;
	}
}, Le = he, w = class {
	width;
	height;
	marginTop;
	radius;
	shouldDrawLine;
	constructor({ width: e, height: t, marginTop: n, controlPointRadius: r, shouldDrawLine: i }) {
		this.width = e, this.height = t, this.marginTop = n, this.radius = r, this.shouldDrawLine = i;
	}
	static drawVelocityChart(e, t, n) {
		let r = [
			"M",
			0,
			26
		], i = 1 / 40, a = e.evaluateAt(0);
		for (let t = i; t < 1.025; t += i) {
			let i = e.evaluateAt(t), o = (i.y - a.y) / (i.x - a.x), s = a.x * (1 - t) + i.x * t;
			o = Math.tanh(o / 1.5), r = r.concat([
				"L",
				(s * n).toFixed(2),
				(26 - o * 26).toFixed(2)
			]), a = i;
		}
		r = r.concat([
			"L",
			n.toFixed(2),
			26,
			"Z"
		]), t.setAttribute("d", r.join(" "));
	}
	curveWidth() {
		return this.width - this.radius * 2;
	}
	curveHeight() {
		return this.height - this.radius * 2 - this.marginTop * 2;
	}
	drawLine(e, t, n, r, i, a) {
		let o = h(e, "line", t);
		o.setAttribute("x1", String(n + this.radius)), o.setAttribute("y1", String(r + this.radius + this.marginTop)), o.setAttribute("x2", String(i + this.radius)), o.setAttribute("y2", String(a + this.radius + this.marginTop));
	}
	drawControlPoints(e, t, n, r, i) {
		this.drawLine(e, "bezier-control-line", t, n, r, i);
		let a = h(e, "circle", "bezier-control-circle");
		a.setAttribute("jslog", `${y("bezier.control-circle").track({ drag: !0 })}`), a.setAttribute("cx", String(r + this.radius)), a.setAttribute("cy", String(i + this.radius + this.marginTop)), a.setAttribute("r", String(this.radius));
	}
	drawCurve(e, t) {
		if (!e) return;
		let n = this.curveWidth(), r = this.curveHeight();
		t.setAttribute("width", String(this.width)), t.setAttribute("height", String(this.height)), t.removeChildren();
		let i = h(t, "g");
		this.shouldDrawLine && this.drawLine(i, "linear-line", 0, r, n, 0);
		let a = h(i, "path", "bezier-path"), o = [
			new m(e.controlPoints[0].x * n + this.radius, (1 - e.controlPoints[0].y) * r + this.radius + this.marginTop),
			new m(e.controlPoints[1].x * n + this.radius, (1 - e.controlPoints[1].y) * r + this.radius + this.marginTop),
			new m(n + this.radius, this.marginTop + this.radius)
		];
		a.setAttribute("d", "M" + this.radius + "," + (r + this.radius + this.marginTop) + " C" + o.join(" ")), this.drawControlPoints(i, 0, r, e.controlPoints[0].x * n, (1 - e.controlPoints[0].y) * r), this.drawControlPoints(i, n, 0, e.controlPoints[1].x * n, (1 - e.controlPoints[1].y) * r);
	}
}, Re = 500, T = class {
	#e;
	#t;
	#n;
	#r;
	#i;
	#a;
	#o;
	constructor({ bezier: e, container: t, onBezierChange: n }) {
		this.#t = e, this.#e = new w({
			width: 150,
			height: 250,
			marginTop: 50,
			controlPointRadius: 7,
			shouldDrawLine: !0
		}), this.#n = h(t, "svg", "bezier-curve"), this.#o = n, f(this.#n, this.dragStart.bind(this), this.dragMove.bind(this), this.dragEnd.bind(this), "default");
	}
	dragStart(e) {
		this.#r = new m(e.x, e.y);
		let t = this.#e;
		this.#i = new m(u((e.offsetX - t.radius) / t.curveWidth(), 0, 1), (t.curveHeight() + t.marginTop + t.radius - e.offsetY) / t.curveHeight());
		let n = this.#i.distanceTo(this.#t.controlPoints[0]) < this.#i.distanceTo(this.#t.controlPoints[1]);
		return this.#a = +!n, this.#t.controlPoints[this.#a] = this.#i, this.#o(this.#t), e.consume(!0), !0;
	}
	updateControlPosition(e, t) {
		if (this.#r === void 0 || this.#i === void 0 || this.#a === void 0) return;
		let n = (e - this.#r.x) / this.#e.curveWidth(), r = (t - this.#r.y) / this.#e.curveHeight(), i = new m(u(this.#i.x + n, 0, 1), this.#i.y - r);
		this.#t.controlPoints[this.#a] = i;
	}
	dragMove(e) {
		this.updateControlPosition(e.x, e.y), this.#o(this.#t);
	}
	dragEnd(e) {
		this.updateControlPosition(e.x, e.y), this.#o(this.#t);
	}
	setBezier(e) {
		this.#t = e, this.draw();
	}
	draw() {
		this.#e.drawCurve(this.#t, this.#n);
	}
}, E = class {
	params;
	renderedPositions;
	constructor(e) {
		this.params = e;
	}
	#e() {
		return this.params.width - this.params.pointRadius * 2;
	}
	#t() {
		return this.params.height - this.params.pointRadius * 2 - this.params.marginTop * 2;
	}
	#n(e, t, n, r) {
		let i = h(e, "circle", "bezier-control-circle");
		i.setAttribute("jslog", `${y("bezier.linear-control-circle").track({
			drag: !0,
			dblclick: !0
		})}`), i.setAttribute("data-point-index", String(r)), i.setAttribute("cx", String(t)), i.setAttribute("cy", String(n)), i.setAttribute("r", String(this.params.pointRadius));
	}
	timingPointToPosition(e) {
		return {
			x: e.input / 100 * this.#e() + this.params.pointRadius,
			y: (1 - e.output) * this.#t() + this.params.pointRadius
		};
	}
	positionToTimingPoint(e) {
		return {
			input: (e.x - this.params.pointRadius) / this.#e() * 100,
			output: 1 - (e.y - this.params.pointRadius) / this.#t()
		};
	}
	draw(e, t) {
		t.setAttribute("width", String(this.#e())), t.setAttribute("height", String(this.#t())), t.removeChildren();
		let n = h(t, "g"), r = e.points().map((e) => this.timingPointToPosition(e));
		this.renderedPositions = r;
		let i = r[0];
		for (let e = 1; e < r.length; e++) {
			let t = r[e], a = h(n, "path", "bezier-path linear-path");
			a.setAttribute("d", `M ${i.x} ${i.y} L ${t.x} ${t.y}`), a.setAttribute("data-line-index", String(e)), i = t;
		}
		for (let e = 0; e < r.length; e++) {
			let t = r[e];
			this.#n(n, t.x, t.y, e);
		}
	}
}, D = class {
	#e;
	#t;
	#n;
	#r;
	#i;
	#a;
	#o;
	#s;
	constructor({ model: e, container: t, onChange: n }) {
		this.#e = e, this.#t = n, this.#n = new E({
			width: 150,
			height: 250,
			pointRadius: 7,
			marginTop: 50
		}), this.#s = h(t, "svg", "bezier-curve linear"), f(this.#s, this.#u.bind(this), this.#f.bind(this), this.#p.bind(this), "default");
	}
	#c(e, t) {
		let n = this.#n.positionToTimingPoint({
			x: e.offsetX,
			y: e.offsetY
		});
		this.#e.addPoint(n, t), this.#r = void 0, this.#o = void 0;
	}
	#l(e, t) {
		if (this.#r = t, this.#o = {
			x: e.x,
			y: e.y
		}, clearTimeout(this.#i), this.#a === this.#r) {
			this.#e.removePoint(this.#r), this.#a = void 0, this.#r = void 0, this.#o = void 0;
			return;
		}
		this.#a = this.#r, this.#i = window.setTimeout(() => {
			this.#a = void 0;
		}, Re);
	}
	#u(e) {
		return e.target instanceof SVGElement ? e.target.dataset.lineIndex === void 0 ? e.target.dataset.pointIndex !== void 0 && (this.#l(e, Number(e.target.dataset.pointIndex)), e.consume(!0), !0) : (this.#c(e, Number(e.target.dataset.lineIndex)), e.consume(!0), !0) : !1;
	}
	#d(e, t) {
		if (this.#r === void 0 || this.#o === void 0) return;
		let n = this.#n.renderedPositions?.[this.#r];
		if (!n) return;
		let r = e - this.#o.x, i = t - this.#o.y;
		this.#o = {
			x: e,
			y: t
		};
		let a = {
			x: n.x + r,
			y: n.y + i
		};
		this.#e.setPoint(this.#r, this.#n.positionToTimingPoint(a));
	}
	#f(e) {
		this.#d(e.x, e.y), this.#t(this.#e);
	}
	#p(e) {
		this.#d(e.x, e.y), this.#t(this.#e);
	}
	setCSSLinearEasingModel(e) {
		this.#e = e, this.draw();
	}
	draw() {
		this.#n.draw(this.#e, this.#s);
	}
}, ze = class {
	#e;
	#t;
	constructor() {
		this.#e = new E({
			width: 40,
			height: 40,
			marginTop: 0,
			pointRadius: 2
		}), this.#t = new w({
			width: 40,
			height: 40,
			marginTop: 0,
			controlPointRadius: 2,
			shouldDrawLine: !1
		});
	}
	draw(e, t) {
		e instanceof S ? this.#e.draw(e, t) : e instanceof v && this.#t.drawCurve(e, t);
	}
}, Be = class {
	#e;
	#t;
	#n;
	#r;
	#i;
	#a;
	#o;
	constructor({ model: e, onChange: t }) {
		this.#e = document.createElement("div"), this.#e.className = "animation-timing-ui", this.#e.style.width = "150px", this.#e.style.height = "250px", this.#t = document.createElement("div"), this.#t.classList.add("bezier-ui-container"), this.#n = document.createElement("div"), this.#n.classList.add("linear-easing-ui-container"), this.#e.appendChild(this.#t), this.#e.appendChild(this.#n), this.#r = e, this.#i = t, this.#r instanceof v ? this.#a = new T({
			bezier: this.#r,
			container: this.#t,
			onBezierChange: this.#i
		}) : this.#r instanceof S && (this.#o = new D({
			model: this.#r,
			container: this.#n,
			onChange: this.#i
		}));
	}
	element() {
		return this.#e;
	}
	setModel(e) {
		this.#r = e, this.#r instanceof v ? this.#a ? this.#a.setBezier(this.#r) : this.#a = new T({
			bezier: this.#r,
			container: this.#t,
			onBezierChange: this.#i
		}) : this.#r instanceof S && (this.#o ? this.#o.setCSSLinearEasingModel(this.#r) : this.#o = new D({
			model: this.#r,
			container: this.#n,
			onChange: this.#i
		})), this.draw();
	}
	draw() {
		this.#n.classList.toggle("hidden", !(this.#r instanceof S)), this.#t.classList.toggle("hidden", !(this.#r instanceof v)), this.#a && this.#a.draw(), this.#o && this.#o.draw();
	}
}, Ve = "/*\n * Copyright 2015 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  width: 270px;\n  height: 350px;\n  user-select: none;\n  padding: 16px;\n  overflow: hidden;\n}\n\n.bezier-preset-selected > svg {\n  background-color: var(--sys-color-tonal-container);\n}\n\n.bezier-container {\n  --override-bezier-control-color: var(--sys-color-purple-bright);\n\n  display: flex;\n  margin-top: 38px;\n  flex-shrink: 0;\n  /* overflown bezier visualization must be on top of the source text */\n  z-index: 2;\n  background-image: radial-gradient(circle, var(--sys-color-surface-variant) 1px, var(--color-background-inverted-opacity-0) 1px);\n  background-size: 17px 17px;\n  background-position: -5px -10px;\n}\n\n.bezier-preset {\n  width: 50px;\n  height: 50px;\n  padding: 5px;\n  margin: auto;\n  background-color: var(--sys-color-surface1);\n  border-radius: 3px;\n}\n\n.bezier-preset line.bezier-control-line {\n  stroke: var(--sys-color-token-subtle);\n  stroke-width: 1;\n  stroke-linecap: round;\n  fill: none;\n}\n\n.bezier-preset circle.bezier-control-circle {\n  fill: var(--sys-color-token-subtle);\n}\n\n.bezier-preset path.bezier-path {\n  stroke: var(--sys-color-inverse-surface);\n  stroke-width: 2;\n  stroke-linecap: round;\n  fill: none;\n}\n\n.bezier-preset-selected path.bezier-path,\n.bezier-preset-selected line.bezier-control-line {\n  stroke: var(--sys-color-on-tonal-container);\n}\n\n.bezier-preset-selected circle.bezier-control-circle {\n  fill: var(--sys-color-on-tonal-container);\n}\n\n.bezier-curve line.linear-line {\n  stroke: var(--sys-color-neutral-outline);\n  stroke-width: 2;\n  stroke-linecap: round;\n  fill: none;\n}\n\n.bezier-curve line.bezier-control-line {\n  stroke: var(--override-bezier-control-color);\n  stroke-width: 2;\n  stroke-linecap: round;\n  fill: none;\n  opacity: 60%;\n}\n\n.bezier-curve circle.bezier-control-circle {\n  fill: var(--override-bezier-control-color);\n  cursor: pointer;\n}\n\n.bezier-curve path.bezier-path {\n  stroke: var(--sys-color-inverse-surface);\n  stroke-width: 3;\n  stroke-linecap: round;\n  fill: none;\n}\n\n.bezier-curve path.bezier-path.linear-path {\n  cursor: pointer;\n}\n\n.bezier-preview-container {\n  position: relative;\n  background-color: var(--sys-color-cdt-base-container);\n  overflow: hidden;\n  border-radius: 20px;\n  width: 200%;\n  height: 20px;\n  z-index: 2;\n  flex-shrink: 0;\n  opacity: 0%;\n}\n\n.bezier-preview-animation {\n  background-color: var(--sys-color-purple-bright);\n  width: 20px;\n  height: 20px;\n  border-radius: 20px;\n  position: absolute;\n}\n\n.bezier-preview-onion {\n  margin-top: -20px;\n  position: relative;\n  z-index: 1;\n}\n\n.bezier-preview-onion > .bezier-preview-animation {\n  opacity: 10%;\n}\n\nsvg.bezier-preset-modify {\n  background-color: var(--sys-color-cdt-base-container);\n  border-radius: 35px;\n  display: inline-block;\n  visibility: hidden;\n  transition: transform 100ms cubic-bezier(0.4, 0, 0.2, 1);\n  cursor: pointer;\n  position: absolute;\n}\n\nsvg.bezier-preset-modify:hover,\n.bezier-preset:hover {\n  background-color: var(--sys-color-state-hover-on-subtle);\n}\n\n.bezier-preset-selected .bezier-preset:hover {\n  background-color: var(--sys-color-tonal-container);\n}\n\n.bezier-preset-modify path {\n  stroke-width: 2;\n  stroke: var(--sys-color-on-surface-subtle);\n  fill: none;\n}\n\n.bezier-presets {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n}\n\n.bezier-preset-selected .bezier-preset-modify {\n  opacity: 100%;\n}\n\n.bezier-preset-category {\n  width: 50px;\n  cursor: pointer;\n  transition: transform 100ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n\nspan.bezier-display-value {\n  width: 100%;\n  user-select: text;\n  display: block;\n  text-align: center;\n  line-height: 20px;\n  min-height: 20px;\n  cursor: text;\n}\n\nsvg.bezier-curve {\n  margin-left: 32px;\n  margin-top: -8px;\n}\n\nsvg.bezier-curve.linear {\n  margin-top: 42px;\n  overflow: visible;\n}\n\nsvg.bezier-preset-modify.bezier-preset-plus {\n  right: 0;\n}\n\n.bezier-header {\n  margin-top: 16px;\n  z-index: 1;\n}\n\nsvg.bezier-preset-modify:active {\n  transform: scale(1.1);\n  background-color: var(--sys-color-state-ripple-neutral-on-subtle);\n}\n\n.bezier-preset-category:active {\n  transform: scale(1.05);\n}\n\n.bezier-header-active > svg.bezier-preset-modify {\n  visibility: visible;\n}\n\n.bezier-preset-modify:active path {\n  stroke: var(--sys-color-on-surface-subtle);\n}\n", He = 300, Ue = class extends t(g) {
	model;
	previewElement;
	previewOnion;
	outerContainer;
	selectedCategory;
	presetsContainer;
	presetUI;
	presetCategories;
	animationTimingUI;
	header;
	label;
	previewAnimation;
	debouncedStartPreviewAnimation;
	constructor(e) {
		super({ useShadowDom: !0 }), this.registerRequiredCSS(Ve), this.model = e, this.contentElement.tabIndex = 0, this.contentElement.setAttribute("jslog", `${_("bezierEditor").parent("mapped").track({ keydown: "Enter|Escape" })}`), this.setDefaultFocusedElement(this.contentElement), this.element.style.overflowY = "auto", this.previewElement = this.contentElement.createChild("div", "bezier-preview-container"), this.previewElement.setAttribute("jslog", `${s().track({ click: !0 })}`), this.previewElement.createChild("div", "bezier-preview-animation"), this.previewElement.addEventListener("click", this.startPreviewAnimation.bind(this)), this.previewOnion = this.contentElement.createChild("div", "bezier-preview-onion"), this.previewOnion.setAttribute("jslog", `${s().track({ click: !0 })}`), this.previewOnion.addEventListener("click", this.startPreviewAnimation.bind(this)), this.outerContainer = this.contentElement.createChild("div", "bezier-container"), this.selectedCategory = null, this.presetsContainer = this.outerContainer.createChild("div", "bezier-presets"), this.presetUI = new ze(), this.presetCategories = [];
		for (let e = 0; e < O.length; e++) {
			let t = this.createCategory(O[e]);
			t && (this.presetCategories[e] = t, this.presetsContainer.appendChild(this.presetCategories[e].icon));
		}
		this.debouncedStartPreviewAnimation = we(this.startPreviewAnimation.bind(this), He), this.animationTimingUI = new Be({
			model: this.model,
			onChange: (e) => {
				this.setModel(e), this.onchange(), this.unselectPresets(), this.debouncedStartPreviewAnimation();
			}
		}), this.animationTimingUI.element().setAttribute("jslog", `${Se().track({
			click: !0,
			drag: !0
		})}`), this.outerContainer.appendChild(this.animationTimingUI.element()), this.header = this.contentElement.createChild("div", "bezier-header");
		let t = this.createPresetModifyIcon(this.header, "bezier-preset-minus", "M 12 6 L 8 10 L 12 14");
		t.addEventListener("click", this.presetModifyClicked.bind(this, !1)), t.setAttribute("jslog", `${_e("bezier.prev-preset").track({ click: !0 })}`);
		let n = this.createPresetModifyIcon(this.header, "bezier-preset-plus", "M 8 6 L 12 10 L 8 14");
		n.addEventListener("click", this.presetModifyClicked.bind(this, !0)), n.setAttribute("jslog", `${_e("bezier.next-preset").track({ click: !0 })}`), this.label = this.header.createChild("span", "source-code bezier-display-value");
	}
	setModel(e) {
		this.model = e, this.animationTimingUI?.setModel(this.model), this.updateUI();
	}
	wasShown() {
		super.wasShown(), this.unselectPresets();
		for (let e of this.presetCategories) for (let t = 0; t < e.presets.length; t++) this.model.asCSSText() === e.presets[t].value && (e.presetIndex = t, this.presetCategorySelected(e));
		this.updateUI(), this.startPreviewAnimation();
	}
	onchange() {
		this.updateUI(), this.dispatchEventToListeners("BezierChanged", this.model.asCSSText());
	}
	updateUI() {
		let e = this.selectedCategory ? this.selectedCategory.presets[this.selectedCategory.presetIndex].name : this.model.asCSSText().replace(/\s(-\d\.\d)/g, "$1");
		this.label.textContent = e, this.animationTimingUI?.draw();
	}
	createCategory(e) {
		let t = C.parse(e[0].value);
		if (!t) return null;
		let n = document.createElement("div");
		n.classList.add("bezier-preset-category"), n.setAttribute("jslog", `${Te().track({ click: !0 }).context(e[0].name)}`);
		let r = h(n, "svg", "bezier-preset monospace"), i = {
			presets: e,
			presetIndex: 0,
			icon: n
		};
		return this.presetUI.draw(t, r), r.addEventListener("click", this.presetCategorySelected.bind(this, i)), i;
	}
	createPresetModifyIcon(e, t, n) {
		let r = h(e, "svg", "bezier-preset-modify " + t);
		return r.setAttribute("width", "20"), r.setAttribute("height", "20"), h(r, "path").setAttribute("d", n), r;
	}
	unselectPresets() {
		for (let e of this.presetCategories) e.icon.classList.remove("bezier-preset-selected");
		this.selectedCategory = null, this.header.classList.remove("bezier-header-active");
	}
	presetCategorySelected(e, t) {
		if (this.selectedCategory === e) return;
		this.unselectPresets(), this.header.classList.add("bezier-header-active"), this.selectedCategory = e, this.selectedCategory.icon.classList.add("bezier-preset-selected");
		let n = C.parse(e.presets[e.presetIndex].value);
		n && (this.setModel(n), this.onchange(), this.startPreviewAnimation()), t && t.consume(!0);
	}
	presetModifyClicked(e, t) {
		if (this.selectedCategory === null) return;
		let n = this.selectedCategory.presets.length;
		this.selectedCategory.presetIndex = (this.selectedCategory.presetIndex + (e ? 1 : -1) + n) % n;
		let r = this.selectedCategory.presets[this.selectedCategory.presetIndex].value, i = C.parse(r);
		i && (this.setModel(i), this.onchange(), this.startPreviewAnimation());
	}
	startPreviewAnimation() {
		this.previewOnion.removeChildren(), this.previewAnimation && this.previewAnimation.cancel();
		let e = 1600, t = [{
			offset: 0,
			transform: "translateX(0px)",
			opacity: 1
		}, {
			offset: 1,
			transform: "translateX(218px)",
			opacity: 1
		}];
		this.previewAnimation = this.previewElement.animate(t, {
			easing: this.model.asCSSText(),
			duration: e
		}), this.previewOnion.removeChildren();
		for (let t = 0; t <= 20; t++) {
			let n = this.previewOnion.createChild("div", "bezier-preview-animation").animate([{
				transform: "translateX(0px)",
				easing: this.model.asCSSText()
			}, { transform: "translateX(218px)" }], {
				duration: e,
				fill: "forwards"
			});
			n.pause(), n.currentTime = e * t / 20;
		}
	}
}, We = /* @__PURE__ */ function(e) {
	return e.BEZIER_CHANGED = "BezierChanged", e;
}({}), O = [
	[
		{
			name: "linear",
			value: "linear"
		},
		{
			name: "elastic",
			value: "linear(0 0%, 0.22 2.1%, 0.86 6.5%, 1.11 8.6%, 1.3 10.7%, 1.35 11.8%, 1.37 12.9%, 1.37 13.7%, 1.36 14.5%, 1.32 16.2%, 1.03 21.8%, 0.94 24%, 0.89 25.9%, 0.88 26.85%, 0.87 27.8%, 0.87 29.25%, 0.88 30.7%, 0.91 32.4%, 0.98 36.4%, 1.01 38.3%, 1.04 40.5%, 1.05 42.7%, 1.05 44.1%, 1.04 45.7%, 1 53.3%, 0.99 55.4%, 0.98 57.5%, 0.99 60.7%, 1 68.1%, 1.01 72.2%, 1 86.7%, 1 100%)"
		},
		{
			name: "bounce",
			value: "linear(0 0%, 0 2.27%, 0.02 4.53%, 0.04 6.8%, 0.06 9.07%, 0.1 11.33%, 0.14 13.6%, 0.25 18.15%, 0.39 22.7%, 0.56 27.25%, 0.77 31.8%, 1 36.35%, 0.89 40.9%, 0.85 43.18%, 0.81 45.45%, 0.79 47.72%, 0.77 50%, 0.75 52.27%, 0.75 54.55%, 0.75 56.82%, 0.77 59.1%, 0.79 61.38%, 0.81 63.65%, 0.85 65.93%, 0.89 68.2%, 1 72.7%, 0.97 74.98%, 0.95 77.25%, 0.94 79.53%, 0.94 81.8%, 0.94 84.08%, 0.95 86.35%, 0.97 88.63%, 1 90.9%, 0.99 93.18%, 0.98 95.45%, 0.99 97.73%, 1 100%)"
		},
		{
			name: "emphasized",
			value: "linear(0 0%, 0 1.8%, 0.01 3.6%, 0.03 6.35%, 0.07 9.1%, 0.13 11.4%, 0.19 13.4%, 0.27 15%, 0.34 16.1%, 0.54 18.35%, 0.66 20.6%, 0.72 22.4%, 0.77 24.6%, 0.81 27.3%, 0.85 30.4%, 0.88 35.1%, 0.92 40.6%, 0.94 47.2%, 0.96 55%, 0.98 64%, 0.99 74.4%, 1 86.4%, 1 100%)"
		}
	],
	[
		{
			name: "ease-in-out",
			value: "ease-in-out"
		},
		{
			name: "In Out · Sine",
			value: "cubic-bezier(0.45, 0.05, 0.55, 0.95)"
		},
		{
			name: "In Out · Quadratic",
			value: "cubic-bezier(0.46, 0.03, 0.52, 0.96)"
		},
		{
			name: "In Out · Cubic",
			value: "cubic-bezier(0.65, 0.05, 0.36, 1)"
		},
		{
			name: "Fast Out, Slow In",
			value: "cubic-bezier(0.4, 0, 0.2, 1)"
		},
		{
			name: "In Out · Back",
			value: "cubic-bezier(0.68, -0.55, 0.27, 1.55)"
		}
	],
	[
		{
			name: "Fast Out, Linear In",
			value: "cubic-bezier(0.4, 0, 1, 1)"
		},
		{
			name: "ease-in",
			value: "ease-in"
		},
		{
			name: "In · Sine",
			value: "cubic-bezier(0.47, 0, 0.75, 0.72)"
		},
		{
			name: "In · Quadratic",
			value: "cubic-bezier(0.55, 0.09, 0.68, 0.53)"
		},
		{
			name: "In · Cubic",
			value: "cubic-bezier(0.55, 0.06, 0.68, 0.19)"
		},
		{
			name: "In · Back",
			value: "cubic-bezier(0.6, -0.28, 0.74, 0.05)"
		}
	],
	[
		{
			name: "ease-out",
			value: "ease-out"
		},
		{
			name: "Out · Sine",
			value: "cubic-bezier(0.39, 0.58, 0.57, 1)"
		},
		{
			name: "Out · Quadratic",
			value: "cubic-bezier(0.25, 0.46, 0.45, 0.94)"
		},
		{
			name: "Out · Cubic",
			value: "cubic-bezier(0.22, 0.61, 0.36, 1)"
		},
		{
			name: "Linear Out, Slow In",
			value: "cubic-bezier(0, 0, 0.2, 1)"
		},
		{
			name: "Out · Back",
			value: "cubic-bezier(0.18, 0.89, 0.32, 1.28)"
		}
	]
], Ge = "/*\n * Copyright 2022 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.swatch-icon {\n  display: inline-grid;\n  inline-size: 15px;\n  grid: [stack] 1fr / [stack] 1fr;\n  margin-left: 1px;\n  margin-right: 1px;\n  vertical-align: -1px;\n  color: var(--color); /* stylelint-disable-line plugin/use_theme_colors */\n}\n\n.swatch {\n  aspect-ratio: 1 / 1;\n  display: inline-block;\n  width: 10px;\n  border-radius: 1e5px;\n  /* stylelint-disable-next-line plugin/use_theme_colors */\n  background: linear-gradient(var(--color), var(--color)),\n    var(--image-file-checker);\n  box-shadow: inset 0 0 0 0.5px rgb(128 128 128 / 60%); /* stylelint-disable-line plugin/use_theme_colors */\n  grid-area: stack;\n}\n\n.swatch-right {\n  justify-self: end;\n}\n\n.swatch-mix {\n  box-shadow: none;\n  justify-self: end;\n  mask: radial-gradient(\n    circle at 0% center,\n    rgb(0 0 0) 50%,\n    rgb(0 0 0 / 0%) calc(50% + 0.5px)\n  );\n}\n", { html: Ke, render: qe, Directives: { ref: Je } } = p, k = class e extends Event {
	static eventName = "colormixchanged";
	data;
	constructor(t) {
		super(e.eventName, {}), this.data = { text: t };
	}
}, Ye = class extends HTMLElement {
	shadow = this.attachShadow({ mode: "open" });
	colorMixText = "";
	firstColorText = "";
	secondColorText = "";
	#e = null;
	mixedColor() {
		let e = this.#e?.computedStyleMap().get("color")?.toString() ?? null;
		return e ? n(e) : null;
	}
	setFirstColor(e) {
		this.firstColorText && (this.colorMixText = this.colorMixText.replace(this.firstColorText, e)), this.firstColorText = e, this.dispatchEvent(new k(this.colorMixText)), this.#t();
	}
	setSecondColor(e) {
		this.secondColorText && (this.colorMixText = ke(this.colorMixText, this.secondColorText, e)), this.secondColorText = e, this.dispatchEvent(new k(this.colorMixText)), this.#t();
	}
	setColorMixText(e) {
		this.colorMixText = e, this.dispatchEvent(new k(this.colorMixText)), this.#t();
	}
	getText() {
		return this.colorMixText;
	}
	#t() {
		if (!this.colorMixText || !this.firstColorText || !this.secondColorText) {
			qe(this.colorMixText, this.shadow, { host: this });
			return;
		}
		qe(Ke`<style>${Ge}</style><div class="swatch-icon"
      ${Je((e) => {
			this.#e = e;
		})}
      jslog=${te()}
      style="--color: ${this.colorMixText}">
        <span class="swatch swatch-left" id="swatch-1" style="--color: ${this.firstColorText}"></span>
        <span class="swatch swatch-right" id="swatch-2" style="--color: ${this.secondColorText}"></span>
        <span class="swatch swatch-mix" id="mix-result" style="--color: ${this.colorMixText}"></span></div>`, this.shadow, { host: this });
	}
};
customElements.define("devtools-color-mix-swatch", Ye);
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/legacy/components/inline_editor/colorSwatch.css.mjs
var Xe = "/*\n * Copyright 2015 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  white-space: nowrap;\n}\n\n.color-swatch {\n  position: relative;\n  margin-left: 1px;\n  margin-right: 2px;\n  width: 12px;\n  height: 12px;\n  transform: scale(0.8);\n  vertical-align: -2px;\n  display: inline-block;\n  user-select: none;\n  background-image: var(--image-file-checker);\n  line-height: 10px;\n}\n\n.color-swatch-inner {\n  width: 100%;\n  height: 100%;\n  display: inline-block;\n  border: 1px solid var(--sys-color-neutral-outline);\n  box-sizing: border-box;\n  cursor: pointer;\n}\n\n.color-swatch.readonly .color-swatch-inner {\n  cursor: unset;\n}\n\n.color-swatch:not(.readonly) .color-swatch-inner:hover {\n  border: 1px solid var(--sys-color-outline);\n}\n\n@media (forced-colors: active) {\n  .color-swatch {\n    forced-color-adjust: none;\n  }\n}\n", { html: Ze } = p, Qe = { shiftclickToChangeColorFormat: "Shift-click to change color format" }, $e = i("ui/legacy/components/inline_editor/ColorSwatch.ts", Qe), et = r.bind(void 0, $e), tt = class e extends Event {
	static eventName = "colorformatchanged";
	data;
	constructor(t) {
		super(e.eventName, {}), this.data = { color: t };
	}
}, nt = class e extends Event {
	static eventName = "colorchanged";
	data;
	constructor(t) {
		super(e.eventName, {}), this.data = { color: t };
	}
}, A = class e extends Event {
	static eventName = "swatchclick";
	constructor() {
		super(e.eventName, {});
	}
}, j = class extends HTMLElement {
	shadow = this.attachShadow({ mode: "open" });
	tooltip = et(Qe.shiftclickToChangeColorFormat);
	#e = null;
	readonly = !1;
	constructor(e) {
		super(), e && (this.tooltip = e), this.tabIndex = -1, this.addEventListener("keydown", (e) => this.onActivate(e));
	}
	static isColorSwatch(e) {
		return e.localName === "devtools-color-swatch";
	}
	setReadonly(e) {
		this.readonly !== e && (this.readonly = e, this.#e && this.renderColor(this.#e));
	}
	set color(e) {
		this.renderColor(e);
	}
	get color() {
		return this.#e;
	}
	get anchorBox() {
		let e = this.shadow.querySelector(".color-swatch");
		return e ? e.boxInWindow() : null;
	}
	getText() {
		return this.#e?.getAuthoredText() ?? this.#e?.asString();
	}
	renderColor(e) {
		this.#e = e;
		let t = le({
			"color-swatch": !0,
			readonly: this.readonly
		});
		re(Ze`<style>${Xe}</style><span
          class=${t}
          title=${this.tooltip}><span
            class="color-swatch-inner"
            style="background-color: ${e.asString()};"
            jslog=${fe("color").track({ click: !0 })}
            @click=${this.onActivate}
            @mousedown=${this.consume}
            @dblclick=${this.consume}></span></span>`, this.shadow, { host: this });
	}
	onActivate(e) {
		if (!this.readonly && !(e instanceof KeyboardEvent && e.key !== "Enter" && e.key !== " " || e instanceof MouseEvent && e.button > 1)) {
			if (e.shiftKey) {
				e.stopPropagation(), this.showFormatPicker(e);
				return;
			}
			this.dispatchEvent(new A()), this.consume(e);
		}
	}
	consume(e) {
		e.stopPropagation();
	}
	setColor(e) {
		this.renderColor(e), this.dispatchEvent(new nt(e));
	}
	showFormatPicker(e) {
		this.#e && new Me(this.#e).show(e, (e) => {
			this.dispatchEvent(new tt(e));
		});
	}
};
customElements.define("devtools-color-swatch", j);
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/legacy/components/inline_editor/cssAngleEditor.css.mjs
var rt = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.editor.interacting::before {\n  content: '';\n  position: fixed;\n  inset: 0;\n}\n\n.clock,\n.pointer,\n.center,\n.hand,\n.dial {\n  position: absolute;\n}\n\n.clock {\n  top: 6px;\n  width: 6em;\n  height: 6em;\n  background-color: var(--sys-color-cdt-base-container);\n  border: 0.5em solid var(--sys-color-neutral-outline);\n  border-radius: 9em;\n  box-shadow: var(--drop-shadow), inset 0 0 15px var(--box-shadow-outline-color);\n  transform: translateX(-3em);\n}\n\n.center,\n.hand {\n  box-shadow: 0 0 2px var(--box-shadow-outline-color);\n}\n\n.pointer {\n  margin: auto;\n  top: 0;\n  left: -0.4em;\n  right: 0;\n  width: 0;\n  height: 0;\n  border-style: solid;\n  border-width: 0 0.9em 0.9em;\n  border-color: transparent transparent var(--sys-color-neutral-outline)\n    transparent;\n}\n\n.center,\n.hand,\n.dial {\n  margin: auto;\n  inset: 0;\n}\n\n.center {\n  width: 0.7em;\n  height: 0.7em;\n  border-radius: 10px;\n}\n\n.dial {\n  width: 2px;\n  height: var(--clock-dial-length);\n  background-color: var(--override-dial-color);\n  border-radius: 1px;\n}\n\n.hand {\n  height: 50%;\n  width: 0.3em;\n  background: var(--sys-color-tonal-container);\n}\n\n.hand::before {\n  content: '';\n  display: inline-block;\n  position: absolute;\n  top: -0.6em;\n  left: -0.35em;\n  width: 1em;\n  height: 1em;\n  border-radius: 50%;\n  cursor: pointer;\n  box-shadow: 0 0 5px var(--box-shadow-outline-color);\n}\n\n.hand::before,\n.center {\n  background-color: var(--sys-color-tonal-container);\n}\n\n:host-context(.theme-with-dark-background) .hand::before {\n  /* stylelint-disable-next-line plugin/use_theme_colors */\n  box-shadow: 0 0 5px hsl(0deg 0% 0% / 80%);\n}\n\n:host-context(.theme-with-dark-background) .center,\n:host-context(.theme-with-dark-background) .hand {\n  /* stylelint-disable-next-line plugin/use_theme_colors */\n  box-shadow: 0 0 2px hsl(0deg 0% 0% / 60%);\n}\n\n:host-context(.theme-with-dark-background) .clock {\n  /* stylelint-disable-next-line plugin/use_theme_colors */\n  background-color: hsl(225deg 5% 27%);\n}\n", it = /(?<value>[+-]?\d*\.?\d+)(?<unit>deg|grad|rad|turn)/, M = /* @__PURE__ */ function(e) {
	return e.DEG = "deg", e.GRAD = "grad", e.RAD = "rad", e.TURN = "turn", e;
}({}), at = (e) => {
	let t = e.match(it);
	return t?.groups ? {
		value: Number(t.groups.value),
		unit: t.groups.unit
	} : null;
}, N = (e, t) => {
	let n = e;
	switch (t) {
		case "grad":
			n = l(e);
			break;
		case "deg":
			n = ne(e);
			break;
		case "turn": n = oe(e);
	}
	return {
		value: n,
		unit: t
	};
}, P = (e) => {
	switch (e.unit) {
		case "deg": return ee(e.value);
		case "grad": return Ce(e.value);
		case "turn": return ve(e.value);
	}
	return e.value;
}, F = (e, t) => {
	let n = P(e);
	return {
		translateX: Math.sin(n) * t,
		translateY: -Math.cos(n) * t
	};
}, I = (e) => {
	let t = e.value;
	switch (e.unit) {
		case "deg":
		case "grad":
			t = Math.round(e.value);
			break;
		case "rad":
			t = Math.round(e.value * 1e4) / 1e4;
			break;
		case "turn":
			t = Math.round(e.value * 100) / 100;
			break;
		default: Ae(e.unit, `Unknown angle unit: ${e.unit}`);
	}
	return {
		value: t,
		unit: e.unit
	};
}, ot = (e) => {
	switch (e) {
		case "deg": return "grad";
		case "grad": return "rad";
		case "rad": return "turn";
		default: return "deg";
	}
}, L = (e, t) => e.unit === t ? e : N(P(e), t), R = (e, t) => {
	let n = se(t);
	if (n === null) return;
	let r = n === "Up" ? Math.PI / 180 : -Math.PI / 180;
	return t.shiftKey && (r *= 10), N(P(e) + r, e.unit);
}, { render: st, html: z } = p, B = d, V = 6, ct = class extends HTMLElement {
	shadow = this.attachShadow({ mode: "open" });
	angle = {
		value: 0,
		unit: M.RAD
	};
	onAngleUpdate;
	background = "";
	clockRadius = 77 / 2;
	dialTemplates;
	mousemoveThrottler = new me(16.67);
	mousemoveListener = this.onMousemove.bind(this);
	connectedCallback() {
		this.style.setProperty("--clock-dial-length", `${V}px`);
	}
	set data(e) {
		this.angle = e.angle, this.onAngleUpdate = e.onAngleUpdate, this.background = e.background, this.render();
	}
	updateAngleFromMousePosition(e, t, n) {
		let r = this.shadow.querySelector(".clock");
		if (!r || !this.onAngleUpdate) return;
		let { top: i, right: a, bottom: o, left: s } = r.getBoundingClientRect();
		this.clockRadius = (a - s) / 2;
		let c = (s + a) / 2, ee = (o + i) / 2, l = -Math.atan2(e - c, t - ee) + Math.PI;
		if (n) {
			let e = P({
				value: 15,
				unit: M.DEG
			}), t = Math.round(l / e) * e;
			this.onAngleUpdate(N(t, this.angle.unit));
		} else this.onAngleUpdate(N(l, this.angle.unit));
	}
	onEditorMousedown(e) {
		e.stopPropagation(), this.updateAngleFromMousePosition(e.pageX, e.pageY, e.shiftKey);
		let t = e.target instanceof Node && e.target.ownerDocument, n = this.shadow.querySelector(".editor");
		t && n && (t.addEventListener("mousemove", this.mousemoveListener, { capture: !0 }), n.classList.add("interacting"), t.addEventListener("mouseup", () => {
			t.removeEventListener("mousemove", this.mousemoveListener, { capture: !0 }), n.classList.remove("interacting");
		}, { once: !0 }));
	}
	onMousemove(e) {
		e.buttons === 1 && (e.preventDefault(), this.mousemoveThrottler.schedule(() => (this.updateAngleFromMousePosition(e.pageX, e.pageY, e.shiftKey), Promise.resolve())));
	}
	onEditorWheel(e) {
		if (!this.onAngleUpdate) return;
		let t = R(this.angle, e);
		t && this.onAngleUpdate(t), e.preventDefault();
	}
	render() {
		let e = { background: this.background }, { translateX: t, translateY: n } = F(this.angle, this.clockRadius / 2), r = { transform: `translate(${t}px, ${n}px) rotate(${this.angle.value}${this.angle.unit})` };
		st(z`
      <style>${rt}</style>
      <div class="editor" jslog=${_("cssAngleEditor").track({
			click: !0,
			drag: !0,
			resize: !0,
			keydown: "Enter|Escape"
		})}>
        <span class="pointer"></span>
        <div
          class="clock"
          style=${B(e)}
          @mousedown=${this.onEditorMousedown}
          @wheel=${this.onEditorWheel}>
          ${this.renderDials()}
          <div class="hand" style=${B(r)}></div>
          <span class="center"></span>
        </div>
      </div>
    `, this.shadow, { host: this });
	}
	renderDials() {
		return this.dialTemplates ||= [
			0,
			45,
			90,
			135,
			180,
			225,
			270,
			315
		].map((e) => {
			let t = this.clockRadius - V - 3, { translateX: n, translateY: r } = F({
				value: e,
				unit: M.DEG
			}, t);
			return z`<span class="dial" style=${B({ transform: `translate(${n}px, ${r}px) rotate(${e}deg)` })}></span>`;
		}), this.dialTemplates;
	}
};
customElements.define("devtools-css-angle-editor", ct);
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/legacy/components/inline_editor/cssAngleSwatch.css.mjs
var lt = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.swatch {\n  position: relative;\n  display: inline-block;\n  margin-bottom: -2px;\n  width: 1em;\n  height: 1em;\n  border: 1px solid var(--sys-color-neutral-outline);\n  border-radius: 50%;\n  overflow: hidden;\n  cursor: pointer;\n  background-color: var(--sys-color-neutral-container);\n}\n\n.mini-hand {\n  position: absolute;\n  margin: auto;\n  inset: 0;\n  height: 55%;\n  width: 2px;\n  background-color: var(--sys-color-tonal-container);\n  border-radius: 5px;\n}\n", { render: ut, html: dt } = p, ft = d, pt = 11, mt = class extends HTMLElement {
	shadow = this.attachShadow({ mode: "open" });
	angle = {
		value: 0,
		unit: M.RAD
	};
	set data(e) {
		this.angle = e.angle, this.render();
	}
	render() {
		let { translateX: e, translateY: t } = F(this.angle, pt / 4);
		ut(dt`
      <style>${lt}</style>
      <div class="swatch">
        <span class="mini-hand" style=${ft({ transform: `translate(${e}px, ${t}px) rotate(${this.angle.value}${this.angle.unit})` })}></span>
      </div>
    `, this.shadow, { host: this });
	}
};
customElements.define("devtools-css-angle-swatch", mt);
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/legacy/components/inline_editor/cssAngle.css.mjs
var ht = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.css-angle {\n  display: inline-block;\n  position: relative;\n  outline: none;\n\n  .preview {\n    display: inline-block;\n  }\n}\n\ndevtools-css-angle-swatch {\n  display: inline-block;\n  user-select: none;\n}\n\ndevtools-css-angle-editor {\n  --override-dial-color: var(--sys-color-neutral-outline);\n\n  position: fixed;\n  z-index: 2;\n}\n", H = class e extends Event {
	static eventName = "valuechanged";
	data;
	constructor(t) {
		super(e.eventName, {}), this.data = { value: t };
	}
}, { render: gt, html: U } = p, _t = d, W = class e extends Event {
	static eventName = "popovertoggled";
	data;
	constructor(t) {
		super(e.eventName, {}), this.data = { open: t };
	}
}, vt = class e extends Event {
	static eventName = "unitchanged";
	data;
	constructor(t) {
		super(e.eventName, {}), this.data = { value: t };
	}
}, G = {
	value: 0,
	unit: M.RAD
}, yt = class extends HTMLElement {
	angle = G;
	displayedAngle = G;
	propertyValue = "";
	containingPane;
	angleElement = null;
	swatchElement = null;
	popoverOpen = !1;
	popoverStyleTop = "";
	popoverStyleLeft = "";
	onMinifyingAction = this.minify.bind(this);
	set data(e) {
		let t = at(e.angleText);
		t && (this.angle = t, this.displayedAngle = { ...t }, this.containingPane = e.containingPane, this.render());
	}
	disconnectedCallback() {
		this.unbindMinifyingAction();
	}
	popOver() {
		if (!this.containingPane || (this.angleElement ||= this.querySelector(".css-angle"), this.swatchElement ||= this.querySelector("devtools-css-angle-swatch"), !this.angleElement || !this.swatchElement)) return;
		this.dispatchEvent(new W(!0)), this.bindMinifyingAction();
		let e = this.swatchElement.getBoundingClientRect().bottom, t = this.swatchElement.getBoundingClientRect().left;
		if (e && t) {
			let n = this.containingPane.getBoundingClientRect().top, r = this.containingPane.getBoundingClientRect().left;
			this.popoverStyleTop = `${e - n}px`, this.popoverStyleLeft = `${t - r}px`;
		}
		this.popoverOpen = !0, this.render(), this.angleElement.focus();
	}
	addEventListener(e, t, n) {
		super.addEventListener(e, t, n);
	}
	minify() {
		this.popoverOpen !== !1 && (this.popoverOpen = !1, this.dispatchEvent(new W(!1)), this.unbindMinifyingAction(), this.render());
	}
	updateProperty(e) {
		this.propertyValue = e, this.render();
	}
	updateAngle(e) {
		this.displayedAngle = I(L(e, this.displayedAngle.unit)), this.angle = this.displayedAngle, this.dispatchEvent(new H(`${this.angle.value}${this.angle.unit}`)), this.render();
	}
	displayNextUnit() {
		let e = ot(this.displayedAngle.unit);
		this.displayedAngle = I(L(this.angle, e)), this.dispatchEvent(new vt(`${this.displayedAngle.value}${this.displayedAngle.unit}`));
	}
	bindMinifyingAction() {
		document.addEventListener("mousedown", this.onMinifyingAction), this.containingPane && this.containingPane.addEventListener("scroll", this.onMinifyingAction);
	}
	unbindMinifyingAction() {
		document.removeEventListener("mousedown", this.onMinifyingAction), this.containingPane && this.containingPane.removeEventListener("scroll", this.onMinifyingAction);
	}
	onMiniIconClick(e) {
		if (e.stopPropagation(), e.shiftKey && !this.popoverOpen) {
			this.displayNextUnit();
			return;
		}
		this.popoverOpen ? this.minify() : this.popOver();
	}
	consume(e) {
		e.stopPropagation();
	}
	onKeydown(t) {
		if (!this.popoverOpen) {
			e(t) && (this.onMiniIconClick(t), t.preventDefault());
			return;
		}
		switch (t.key) {
			case "Escape":
				t.stopPropagation(), this.minify(), this.blur();
				break;
			case "ArrowUp":
			case "ArrowDown": {
				let e = R(this.angle, t);
				e && this.updateAngle(e), t.preventDefault();
				break;
			}
		}
	}
	render() {
		gt(U`
      <style>${ht}</style>
      <div class="css-angle" @focusout=${this.minify} @keydown=${this.onKeydown} tabindex="-1">
        <div class="preview">
          <devtools-css-angle-swatch
            @click=${this.onMiniIconClick}
            @mousedown=${this.consume}
            @dblclick=${this.consume}
            .data=${{ angle: this.angle }}>
          </devtools-css-angle-swatch>
          <slot></slot>
        </div>
        ${this.popoverOpen ? this.renderPopover() : null}
      </div>
    `, this, { host: this });
	}
	renderPopover() {
		let e = "";
		return this.propertyValue && !this.propertyValue.match(/url\(.*\)/i) && (e = this.propertyValue), U`
      <devtools-css-angle-editor
        class="popover popover-css-angle"
        style=${_t({
			top: this.popoverStyleTop,
			left: this.popoverStyleLeft
		})}
        .data=${{
			angle: this.angle,
			onAngleUpdate: (e) => {
				this.updateAngle(e);
			},
			background: e
		}}>
      </devtools-css-angle-editor>`;
	}
};
customElements.define("devtools-css-angle", yt);
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/legacy/components/inline_editor/cssShadowEditor.css.mjs
var bt = "/*\n * Copyright 2016 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  user-select: none;\n  border: 1px solid transparent;\n}\n\n.shadow-editor-field {\n  height: 24px;\n  margin-top: 8px;\n  font-size: 12px;\n  flex-shrink: 0;\n}\n\n.shadow-editor-field:last-of-type {\n  margin-bottom: 8px;\n}\n\n.shadow-editor-flex-field {\n  display: flex;\n  align-items: center;\n  flex-direction: row;\n}\n\n.shadow-editor-field.shadow-editor-blur-field {\n  margin-top: 40px;\n}\n\n.shadow-editor-2D-slider {\n  position: absolute;\n  height: 88px;\n  width: 88px;\n  border: 1px solid var(--divider-line);\n  border-radius: 2px;\n}\n\n.shadow-editor-label {\n  display: inline-block;\n  width: 52px;\n  height: 24px;\n  line-height: 24px;\n  margin-right: 8px;\n  text-align: right;\n}\n\n.shadow-editor-button-left,\n.shadow-editor-button-right {\n  width: 74px;\n  height: 24px;\n  padding: 3px 7px;\n  line-height: 16px;\n  border: 1px solid var(--divider-line);\n  color: var(--sys-color-on-surface);\n  background-color: var(--sys-color-cdt-base-container);\n  text-align: center;\n  font-weight: 500;\n}\n\n.shadow-editor-button-left {\n  border-radius: 2px 0 0 2px;\n}\n\n.shadow-editor-button-right {\n  border-radius: 0 2px 2px 0;\n  border-left-width: 0;\n}\n\n.shadow-editor-button-left:hover,\n.shadow-editor-button-right:hover {\n  box-shadow: 0 1px 1px var(--color-background-elevation-1);\n}\n\n.shadow-editor-button-left:focus,\n.shadow-editor-button-right:focus {\n  background-color: var(--color-background-elevation-1);\n}\n\n.shadow-editor-button-left.enabled,\n.shadow-editor-button-right.enabled {\n  --override-button-text-color: #fff;\n\n  background-color: var(--color-primary-old);\n  color: var(--override-button-text-color);\n}\n\n.shadow-editor-button-left.enabled:focus,\n.shadow-editor-button-right.enabled:focus {\n  background-color: var(--color-primary-variant);\n}\n\n.shadow-editor-text-input {\n  width: 52px;\n  margin-right: 8px;\n  text-align: right;\n  box-shadow: var(--legacy-focus-ring-inactive-shadow);\n}\n\n@media (forced-colors: active) {\n  .shadow-editor-button-left:hover,\n  .shadow-editor-button-left.enabled:focus,\n  .shadow-editor-button-right:hover .shadow-editor-button-left.enabled,\n  .shadow-editor-button-right.enabled,\n  .shadow-editor-button-right.enabled:focus {\n    forced-color-adjust: none;\n    background-color: Highlight;\n    color: HighlightText;\n  }\n}\n", K = {
	type: "Type",
	xOffset: "X offset",
	yOffset: "Y offset",
	blur: "Blur",
	spread: "Spread"
}, xt = i("ui/legacy/components/inline_editor/CSSShadowEditor.ts", K), q = r.bind(void 0, xt), J = 20, Y = "px", X = 6, Z = 88, St = (function() {
	return (/* @__PURE__ */ RegExp("([+-]?(?:[0-9]*[.])?[0-9]+(?:[eE][+-]?[0-9]+)?)(ch|cm|em|ex|in|mm|pc|pt|px|rem|vh|vmax|vmin|vw)|[+-]?(?:0*[.])?0+(?:[eE][+-]?[0-9]+)?", "gi")).source;
})(), Q = class e {
	amount;
	unit;
	constructor(e, t) {
		this.amount = e, this.unit = t;
	}
	static parse(t) {
		let n = RegExp("^(?:" + St + ")$", "i"), r = t.match(n);
		return r ? r.length > 2 && r[2] ? new e(parseFloat(r[1]), r[2]) : e.zero() : null;
	}
	static zero() {
		return new e(0, "");
	}
	asCSSText() {
		return this.amount + this.unit;
	}
}, Ct = class extends t(g) {
	typeField;
	outsetButton;
	insetButton;
	xInput;
	yInput;
	xySlider;
	halfCanvasSize;
	innerCanvasSize;
	blurInput;
	blurSlider;
	spreadField;
	spreadInput;
	spreadSlider;
	model;
	canvasOrigin;
	changedElement;
	constructor() {
		super({ useShadowDom: !0 }), this.registerRequiredCSS(bt), this.contentElement.tabIndex = 0, this.contentElement.setAttribute("jslog", `${_("cssShadowEditor").parent("mapped").track({ keydown: "Enter|Escape" })}`), this.setDefaultFocusedElement(this.contentElement), this.typeField = this.contentElement.createChild("div", "shadow-editor-field shadow-editor-flex-field"), this.typeField.createChild("label", "shadow-editor-label").textContent = q(K.type), this.outsetButton = this.typeField.createChild("button", "shadow-editor-button-left"), this.outsetButton.textContent = o("Outset"), this.outsetButton.addEventListener("click", this.onButtonClick.bind(this), !1), this.insetButton = this.typeField.createChild("button", "shadow-editor-button-right"), this.insetButton.textContent = o("Inset"), this.insetButton.addEventListener("click", this.onButtonClick.bind(this), !1);
		let e = this.contentElement.createChild("div", "shadow-editor-field");
		this.xInput = this.createTextInput(e, q(K.xOffset), "x-offset");
		let t = this.contentElement.createChild("div", "shadow-editor-field");
		this.yInput = this.createTextInput(t, q(K.yOffset), "y-offset"), this.xySlider = e.createChild("canvas", "shadow-editor-2D-slider"), this.xySlider.setAttribute("jslog", `${be("xy").track({
			click: !0,
			drag: !0,
			keydown: "ArrowUp|ArrowDown|ArrowLeft|ArrowRight"
		})}`), this.xySlider.width = Z, this.xySlider.height = Z, this.xySlider.tabIndex = -1, this.halfCanvasSize = Z / 2, this.innerCanvasSize = this.halfCanvasSize - X, f(this.xySlider, this.dragStart.bind(this), this.dragMove.bind(this), null, "default"), this.xySlider.addEventListener("keydown", this.onCanvasArrowKey.bind(this), !1), this.xySlider.addEventListener("blur", this.onCanvasBlur.bind(this), !1);
		let n = this.contentElement.createChild("div", "shadow-editor-field shadow-editor-flex-field shadow-editor-blur-field");
		this.blurInput = this.createTextInput(n, q(K.blur), "blur"), this.blurSlider = this.createSlider(n, "blur"), this.spreadField = this.contentElement.createChild("div", "shadow-editor-field shadow-editor-flex-field"), this.spreadInput = this.createTextInput(this.spreadField, q(K.spread), "spread"), this.spreadSlider = this.createSlider(this.spreadField, "spread");
	}
	createTextInput(e, t, n) {
		let r = e.createChild("label", "shadow-editor-label");
		r.textContent = t, r.setAttribute("for", t);
		let i = pe("shadow-editor-text-input", "text");
		return e.appendChild(i), i.id = t, i.addEventListener("keydown", this.handleValueModification.bind(this), !1), i.addEventListener("wheel", this.handleValueModification.bind(this), !1), i.addEventListener("input", this.onTextInput.bind(this), !1), i.addEventListener("blur", this.onTextBlur.bind(this), !1), i.setAttribute("jslog", `${de().track({
			change: !0,
			keydown: "ArrowUp|ArrowDown"
		}).context(n)}`), i;
	}
	createSlider(e, t) {
		let n = Ee(0, J, -1);
		return n.addEventListener("input", this.onSliderInput.bind(this), !1), n.setAttribute("jslog", `${be().track({
			click: !0,
			drag: !0
		}).context(t)}`), e.appendChild(n), n;
	}
	wasShown() {
		super.wasShown(), this.updateUI();
	}
	setModel(e) {
		this.model = e, this.typeField.classList.toggle("hidden", !e.isBoxShadow()), this.spreadField.classList.toggle("hidden", !e.isBoxShadow()), this.updateUI();
	}
	updateUI() {
		this.updateButtons(), this.xInput.value = this.model.offsetX().asCSSText(), this.yInput.value = this.model.offsetY().asCSSText(), this.blurInput.value = this.model.blurRadius().asCSSText(), this.spreadInput.value = this.model.spreadRadius().asCSSText(), this.blurSlider.value = this.model.blurRadius().amount.toString(), this.spreadSlider.value = this.model.spreadRadius().amount.toString(), this.updateCanvas(!1);
	}
	updateButtons() {
		this.insetButton.classList.toggle("enabled", this.model.inset()), this.outsetButton.classList.toggle("enabled", !this.model.inset());
	}
	updateCanvas(e) {
		let t = this.xySlider.getContext("2d");
		if (!t) throw Error("Unable to obtain canvas context");
		t.clearRect(0, 0, this.xySlider.width, this.xySlider.height), t.save(), t.setLineDash([1, 1]), t.strokeStyle = "rgba(210, 210, 210, 0.8)", t.beginPath(), t.moveTo(this.halfCanvasSize, 0), t.lineTo(this.halfCanvasSize, Z), t.moveTo(0, this.halfCanvasSize), t.lineTo(Z, this.halfCanvasSize), t.stroke(), t.restore();
		let n = this.sliderThumbPosition();
		t.save(), t.translate(this.halfCanvasSize, this.halfCanvasSize), t.lineWidth = 2, t.strokeStyle = "rgba(130, 130, 130, 0.75)", t.beginPath(), t.moveTo(0, 0), t.lineTo(n.x, n.y), t.stroke(), e && (t.beginPath(), t.fillStyle = "rgba(66, 133, 244, 0.4)", t.arc(n.x, n.y, 8, 0, 2 * Math.PI), t.fill()), t.beginPath(), t.fillStyle = "#4285F4", t.arc(n.x, n.y, X, 0, 2 * Math.PI), t.fill(), t.restore();
	}
	onButtonClick(e) {
		let t = e.currentTarget === this.insetButton;
		t && this.model.inset() || !t && !this.model.inset() || (this.model.setInset(t), this.updateButtons(), this.dispatchEventToListeners("ShadowChanged", this.model));
	}
	handleValueModification(e) {
		let t = e.currentTarget, n = ge(t.value, e, i);
		if (!n) return;
		let r = Q.parse(n);
		if (!r) return;
		e.currentTarget === this.blurInput && r.amount < 0 && (r.amount = 0), t.value = r.asCSSText(), t.selectionStart = 0, t.selectionEnd = t.value.length, this.onTextInput(e), e.consume(!0);
		function i(e, t, n) {
			return n.length || (n = Y), e + t + n;
		}
	}
	onTextInput(e) {
		let t = e.currentTarget;
		this.changedElement = t, this.changedElement.classList.remove("invalid");
		let n = Q.parse(t.value);
		!n || t === this.blurInput && n.amount < 0 || (t === this.xInput ? (this.model.setOffsetX(n), this.updateCanvas(!1)) : t === this.yInput ? (this.model.setOffsetY(n), this.updateCanvas(!1)) : t === this.blurInput ? (this.model.setBlurRadius(n), this.blurSlider.value = n.amount.toString()) : t === this.spreadInput && (this.model.setSpreadRadius(n), this.spreadSlider.value = n.amount.toString()), this.dispatchEventToListeners("ShadowChanged", this.model));
	}
	onTextBlur() {
		if (!this.changedElement) return;
		let e = this.changedElement.value.trim() ? Q.parse(this.changedElement.value) : Q.zero();
		if (e ||= Q.parse(this.changedElement.value + Y), !e) {
			this.changedElement.classList.add("invalid"), this.changedElement = null;
			return;
		}
		this.changedElement === this.xInput ? (this.model.setOffsetX(e), this.xInput.value = e.asCSSText(), this.updateCanvas(!1)) : this.changedElement === this.yInput ? (this.model.setOffsetY(e), this.yInput.value = e.asCSSText(), this.updateCanvas(!1)) : this.changedElement === this.blurInput ? (e.amount < 0 && (e = Q.zero()), this.model.setBlurRadius(e), this.blurInput.value = e.asCSSText(), this.blurSlider.value = e.amount.toString()) : this.changedElement === this.spreadInput && (this.model.setSpreadRadius(e), this.spreadInput.value = e.asCSSText(), this.spreadSlider.value = e.amount.toString()), this.changedElement = null, this.dispatchEventToListeners("ShadowChanged", this.model);
	}
	onSliderInput(e) {
		e.currentTarget === this.blurSlider ? (this.model.setBlurRadius(new Q(Number(this.blurSlider.value), this.model.blurRadius().unit || Y)), this.blurInput.value = this.model.blurRadius().asCSSText(), this.blurInput.classList.remove("invalid")) : e.currentTarget === this.spreadSlider && (this.model.setSpreadRadius(new Q(Number(this.spreadSlider.value), this.model.spreadRadius().unit || Y)), this.spreadInput.value = this.model.spreadRadius().asCSSText(), this.spreadInput.classList.remove("invalid")), this.dispatchEventToListeners("ShadowChanged", this.model);
	}
	dragStart(e) {
		this.xySlider.focus(), this.updateCanvas(!0), this.canvasOrigin = new m(this.xySlider.getBoundingClientRect().left + this.halfCanvasSize, this.xySlider.getBoundingClientRect().top + this.halfCanvasSize);
		let t = new m(e.x - this.canvasOrigin.x, e.y - this.canvasOrigin.y), n = this.sliderThumbPosition();
		return t.distanceTo(n) >= X && this.dragMove(e), !0;
	}
	dragMove(e) {
		let t = new m(e.x - this.canvasOrigin.x, e.y - this.canvasOrigin.y);
		e.shiftKey && (t = this.snapToClosestDirection(t));
		let n = this.constrainPoint(t, this.innerCanvasSize), r = Math.round(n.x / this.innerCanvasSize * J), i = Math.round(n.y / this.innerCanvasSize * J);
		e.shiftKey ? (this.model.setOffsetX(new Q(r, this.model.offsetX().unit || Y)), this.model.setOffsetY(new Q(i, this.model.offsetY().unit || Y))) : (e.altKey || this.model.setOffsetX(new Q(r, this.model.offsetX().unit || Y)), ue.eventHasCtrlEquivalentKey(e) || this.model.setOffsetY(new Q(i, this.model.offsetY().unit || Y))), this.xInput.value = this.model.offsetX().asCSSText(), this.yInput.value = this.model.offsetY().asCSSText(), this.xInput.classList.remove("invalid"), this.yInput.classList.remove("invalid"), this.updateCanvas(!0), this.dispatchEventToListeners("ShadowChanged", this.model);
	}
	onCanvasBlur() {
		this.updateCanvas(!1);
	}
	onCanvasArrowKey(e) {
		let t = e, n = 0, r = 0;
		if (t.key === "ArrowRight" ? n = 1 : t.key === "ArrowLeft" ? n = -1 : t.key === "ArrowUp" ? r = -1 : t.key === "ArrowDown" && (r = 1), n || r) {
			if (e.consume(!0), n) {
				let e = this.model.offsetX(), t = u(e.amount + n, -20, J);
				if (t === e.amount) return;
				this.model.setOffsetX(new Q(t, e.unit || Y)), this.xInput.value = this.model.offsetX().asCSSText(), this.xInput.classList.remove("invalid");
			}
			if (r) {
				let e = this.model.offsetY(), t = u(e.amount + r, -20, J);
				if (t === e.amount) return;
				this.model.setOffsetY(new Q(t, e.unit || Y)), this.yInput.value = this.model.offsetY().asCSSText(), this.yInput.classList.remove("invalid");
			}
			this.updateCanvas(!0), this.dispatchEventToListeners("ShadowChanged", this.model);
		}
	}
	constrainPoint(e, t) {
		return Math.abs(e.x) <= t && Math.abs(e.y) <= t ? new m(e.x, e.y) : e.scale(t / Math.max(Math.abs(e.x), Math.abs(e.y)));
	}
	snapToClosestDirection(e) {
		let t = Number.MAX_VALUE, n = e, r = [
			new m(0, -1),
			new m(1, -1),
			new m(1, 0),
			new m(1, 1)
		];
		for (let i of r) {
			let r = e.projectOn(i), a = e.distanceTo(r);
			a < t && (t = a, n = r);
		}
		return n;
	}
	sliderThumbPosition() {
		let e = this.model.offsetX().amount / J * this.innerCanvasSize, t = this.model.offsetY().amount / J * this.innerCanvasSize;
		return this.constrainPoint(new m(e, t), this.innerCanvasSize);
	}
}, wt = /* @__PURE__ */ function(e) {
	return e.SHADOW_CHANGED = "ShadowChanged", e;
}({}), Tt = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.link-swatch-link {\n  display: inline;\n}\n\n.link-swatch-link:not(.undefined) {\n  cursor: pointer;\n  text-underline-offset: 2px;\n  color: var(--text-link);\n}\n\n.link-swatch-link:hover:not(.undefined) {\n  text-decoration: underline;\n}\n\n.link-swatch-link:focus:not(:focus-visible) {\n  outline: none;\n}\n\n.link-swatch-link.undefined {\n  opacity: 100%;\n  color: var(--text-disabled);\n}\n", { render: Et, html: Dt, nothing: Ot, Directives: { ref: kt, ifDefined: $, classMap: At } } = p, jt = class extends HTMLElement {
	onLinkActivate = () => void 0;
	#e;
	connectedCallback() {}
	set data(e) {
		this.onLinkActivate = (t, n) => {
			n instanceof MouseEvent && n.button !== 0 || n instanceof KeyboardEvent && n.key !== "Enter" && n.key !== " " || (e.onLinkActivate(t), n.consume(!0));
		}, this.render(e);
	}
	get linkElement() {
		return this.#e;
	}
	render(e) {
		let { isDefined: t, text: n, jslogContext: r, tooltip: i } = e, a = At({
			"link-style": !0,
			"text-button": !0,
			"link-swatch-link": !0,
			undefined: !t
		}), o = t ? this.onLinkActivate.bind(this, n.trim()) : null, s = i && "title" in i && i.title || void 0, c = i && "tooltipId" in i && i.tooltipId || void 0;
		Et(Dt`
        <style>${ae}</style>
        <style>${Tt}</style>
        <button .disabled=${!t} class=${a} type="button" title=${$(s)}
                aria-details=${$(c)} @click=${o} @keydown=${o}
                role="link"
                jslog=${r ? De().track({ click: !0 }).context(r) : Ot}
                tabindex=${$(t ? -1 : void 0)}
                ${kt((e) => {
			this.#e = e;
		})}>
           ${n}
        </button>`, this);
	}
};
customElements.define("devtools-link-swatch", jt);
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/legacy/components/inline_editor/cssShadowSwatch.css.mjs
var Mt = "/*\n * Copyright 2016 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\ndevtools-icon.shadow-swatch-icon {\n  color: var(--icon-css);\n  transform: scale(0.7);\n  position: relative;\n  margin: -5px -2px -5px -4px;\n  user-select: none;\n  vertical-align: baseline;\n  cursor: pointer;\n\n  &:hover {\n    color: var(--icon-css-hover);\n  }\n}\n", Nt = class extends HTMLElement {
	#e;
	#t;
	constructor(e) {
		super(), this.#t = e, re(ce`
        <style>${Mt}</style>
        <devtools-icon tabindex=-1 name="shadow" class="shadow-swatch-icon"></devtools-icon>`, this, { host: this }), this.#e = this.querySelector("devtools-icon");
	}
	model() {
		return this.#t;
	}
	iconElement() {
		return this.#e;
	}
};
customElements.define("css-shadow-swatch", Nt);
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/legacy/components/inline_editor/swatchPopover.css.mjs
var Pt = "/*\n * Copyright 2017 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.widget {\n  display: flex;\n  overflow: auto;\n  user-select: text;\n  font: var(--sys-typescale-body4-regular);\n  line-height: 11px;\n  box-shadow: var(--sys-elevation-level2);\n  background-color: var(--sys-color-base-container-elevated);\n  border-radius: var(--sys-shape-corner-extra-small);\n}\n\n.with-padding {\n  padding: var(--sys-size-4);\n  border-radius: var(--sys-shape-corner-small);\n}\n", Ft = class extends a {
	popover;
	hideProxy;
	boundOnKeyDown;
	boundFocusOut;
	isHidden;
	anchorElement;
	view;
	hiddenCallback;
	focusRestorer;
	constructor() {
		super(), this.popover = new Oe(), this.popover.setSizeBehavior(ie.MEASURE_CONTENT), this.popover.setMarginBehavior(c.DEFAULT_MARGIN), this.popover.element.addEventListener("mousedown", (e) => e.consume(), !1), this.hideProxy = this.hide.bind(this, !0), this.boundOnKeyDown = this.onKeyDown.bind(this), this.boundFocusOut = this.onFocusOut.bind(this), this.isHidden = !0, this.anchorElement = null;
	}
	onFocusOut(e) {
		let t = e.relatedTarget;
		!this.isHidden && t && this.view && !t.isSelfOrDescendant(this.view.contentElement) && this.hideProxy();
	}
	setAnchorElement(e) {
		this.anchorElement = e;
	}
	isShowing(e) {
		return this.popover.isShowing() && (e && this.view === e || !e);
	}
	show(e, t, n) {
		if (this.popover.isShowing()) {
			if (this.anchorElement === t) return;
			this.hide(!0);
		}
		ye(e.contentElement, t), this.popover.registerRequiredCSS(Pt), this.dispatchEventToListeners("WillShowPopover"), this.isHidden = !1, this.anchorElement = t, this.view = e, this.hiddenCallback = n, this.reposition(), e.focus();
		let r = this.popover.element.ownerDocument;
		r.addEventListener("mousedown", this.hideProxy, !1), r.defaultView && r.defaultView.addEventListener("resize", this.hideProxy, !1), this.view.contentElement.addEventListener("keydown", this.boundOnKeyDown, !1);
	}
	reposition() {
		if (!this.isHidden && this.view) {
			if (this.view.contentElement.removeEventListener("focusout", this.boundFocusOut, !1), this.view.show(this.popover.contentElement), this.anchorElement) {
				let e = this.anchorElement.boxInWindow();
				if (j.isColorSwatch(this.anchorElement)) {
					let t = this.anchorElement;
					if (!t.anchorBox) return;
					e = t.anchorBox;
				}
				this.popover.setContentAnchorBox(e), this.popover.show(this.anchorElement.ownerDocument);
			}
			this.view.contentElement.addEventListener("focusout", this.boundFocusOut, !1), this.focusRestorer ||= new xe(this.view);
		}
	}
	hide(e) {
		if (this.isHidden) return;
		let t = this.popover.element.ownerDocument;
		this.isHidden = !0, this.popover.hide(), t.removeEventListener("mousedown", this.hideProxy, !1), t.defaultView && t.defaultView.removeEventListener("resize", this.hideProxy, !1), this.hiddenCallback && this.hiddenCallback.call(null, !!e), this.focusRestorer && this.focusRestorer.restore(), this.anchorElement = null, this.view && (this.view.detach(), this.view.contentElement.removeEventListener("keydown", this.boundOnKeyDown, !1), this.view.contentElement.removeEventListener("focusout", this.boundFocusOut, !1), delete this.view);
	}
	onKeyDown(e) {
		if (e.key === "Enter") {
			this.hide(!0), e.consume(!0);
			return;
		}
		e.key === "Escape" && (this.hide(!1), e.consume(!0));
	}
}, It = /* @__PURE__ */ function(e) {
	return e.WILL_SHOW_POPOVER = "WillShowPopover", e;
}({});
//#endregion
export { We as _, Q as a, Le as b, yt as c, nt as d, tt as f, Ue as g, Ye as h, jt as i, H as l, k as m, Ft as n, Ct as o, j as p, Nt as r, wt as s, It as t, A as u, w as v, C as y };
