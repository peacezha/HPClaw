import { a as e, o as t } from "./dom_extension-BLny9Waw.js";
import { $ as n, At as r, Ct as i, Et as a, Ft as o, H as s, It as c, K as l, Lt as u, Mt as d, Nt as f, Ot as p, Pt as m, Q as h, Rt as g, St as _, Tt as v, at as y, bt as ee, ft as b, i as x, it as S, jt as C, kt as w, pt as T, rt as E, vt as D, xt as te } from "./common-DMSVbaSb.js";
import { Ao as ne, At as O, Ca as k, Cn as re, Dp as A, Dt as j, Fo as ie, Hi as ae, K as oe, Ka as se, La as ce, Mn as M, Mo as N, Nt as le, Op as ue, Po as de, Pt as fe, Qf as P, Sa as pe, Ur as F, Wn as me, Xn as I, Yf as L, _n as R, _o as he, br as ge, dr as _e, dt as ve, ei as ye, fn as be, fp as xe, gn as Se, ha as Ce, ja as we, jd as Te, jo as Ee, ka as De, kl as Oe, lt as ke, no as Ae, oo as je, q as z, qt as Me, wo as Ne, wt as Pe, xa as Fe, xn as Ie, xt as Le } from "./legacy-dM_vujv7.js";
import "./platform-D4TUCh2P.js";
import { g as Re } from "./text_utils-DWSliayn.js";
import { E as ze, T as Be } from "./StringUtilities-CMDxNrEc.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/legacy/components/color_picker/ColorFormatSpec.ts
var B = (e) => e.map((e) => ze(e, 2)), V = (e) => `${e[0]} ${e[1]} ${e[2]} / ${e[3]}`, Ve = {
	[y.RGB]: {
		label: "RGBA",
		toValues: function(e) {
			return B(e.as(y.RGBA).canonicalRGBA());
		},
		fromValues: function(e) {
			return a(`rgb(${V(e)})`);
		}
	},
	[y.HSL]: {
		label: "HSLA",
		toValues: function(e) {
			let t = B(e.as(y.HSLA).canonicalHSLA());
			return t[1] += "%", t[2] += "%", t;
		},
		fromValues: function(e) {
			return a(`hsl(${V(e)})`);
		}
	},
	[y.HWB]: {
		label: "HWBA",
		toValues: function(e) {
			let t = B(e.as(y.HWBA).canonicalHWBA());
			return t[1] += "%", t[2] += "%", t;
		},
		fromValues: function(e) {
			return a(`hwb(${V(e)})`);
		}
	},
	[y.LCH]: {
		label: "lchA",
		toValues: function(e) {
			let t = e.as(y.LCH);
			return B([
				t.l,
				t.c,
				t.h,
				t.alpha ?? 1
			]);
		},
		fromValues: function(e) {
			return a(`lch(${V(e)})`);
		}
	},
	[y.OKLCH]: {
		label: "lchA",
		toValues: function(e) {
			let t = e.as(y.OKLCH);
			return B([
				t.l,
				t.c,
				t.h,
				t.alpha ?? 1
			]);
		},
		fromValues: function(e) {
			return a(`oklch(${V(e)})`);
		}
	},
	[y.LAB]: {
		label: "labA",
		toValues: function(e) {
			let t = e.as(y.LAB);
			return B([
				t.l,
				t.a,
				t.b,
				t.alpha ?? 1
			]);
		},
		fromValues: function(e) {
			return a(`lab(${V(e)})`);
		}
	},
	[y.OKLAB]: {
		label: "labA",
		toValues: function(e) {
			let t = e.as(y.OKLAB);
			return B([
				t.l,
				t.a,
				t.b,
				t.alpha ?? 1
			]);
		},
		fromValues: function(e) {
			return a(`oklab(${V(e)})`);
		}
	},
	[y.SRGB]: {
		label: "RGBA",
		toValues: function(e) {
			let t = e.as(y.SRGB);
			return B([
				t.p0,
				t.p1,
				t.p2,
				t.alpha ?? 1
			]);
		},
		fromValues: function(e) {
			return a(`color(${y.SRGB} ${V(e)})`);
		}
	},
	[y.SRGB_LINEAR]: {
		label: "RGBA",
		toValues: function(e) {
			let t = e.as(y.SRGB_LINEAR);
			return B([
				t.p0,
				t.p1,
				t.p2,
				t.alpha ?? 1
			]);
		},
		fromValues: function(e) {
			return a(`color(${y.SRGB_LINEAR} ${V(e)})`);
		}
	},
	[y.DISPLAY_P3]: {
		label: "RGBA",
		toValues(e) {
			let t = e.as(y.DISPLAY_P3);
			return B([
				t.p0,
				t.p1,
				t.p2,
				1
			]);
		},
		fromValues(e) {
			return a(`color(${y.DISPLAY_P3} ${V(e)})`);
		}
	},
	[y.A98_RGB]: {
		label: "RGBA",
		toValues: function(e) {
			let t = e.as(y.A98_RGB);
			return B([
				t.p0,
				t.p1,
				t.p2,
				t.alpha ?? 1
			]);
		},
		fromValues: function(e) {
			return a(`color(${y.A98_RGB} ${V(e)})`);
		}
	},
	[y.PROPHOTO_RGB]: {
		label: "RGBA",
		toValues: function(e) {
			let t = e.as(y.PROPHOTO_RGB);
			return B([
				t.p0,
				t.p1,
				t.p2,
				t.alpha ?? 1
			]);
		},
		fromValues: function(e) {
			return a(`color(${y.PROPHOTO_RGB} ${V(e)})`);
		}
	},
	[y.REC_2020]: {
		label: "RGBA",
		toValues: function(e) {
			let t = e.as(y.REC_2020);
			return B([
				t.p0,
				t.p1,
				t.p2,
				t.alpha ?? 1
			]);
		},
		fromValues: function(e) {
			return a(`color(${y.REC_2020} ${V(e)})`);
		}
	},
	[y.XYZ]: {
		label: "xyzA",
		toValues: function(e) {
			let t = e.as(y.XYZ);
			return B([
				t.p0,
				t.p1,
				t.p2,
				t.alpha ?? 1
			]);
		},
		fromValues: function(e) {
			return a(`color(${y.XYZ} ${V(e)})`);
		}
	},
	[y.XYZ_D50]: {
		label: "xyzA",
		toValues: function(e) {
			let t = e.as(y.XYZ_D50);
			return B([
				t.p0,
				t.p1,
				t.p2,
				t.alpha ?? 1
			]);
		},
		fromValues: function(e) {
			return a(`color(${y.XYZ_D50} ${V(e)})`);
		}
	},
	[y.XYZ_D65]: {
		label: "xyzA",
		toValues: function(e) {
			let t = e.as(y.XYZ_D65);
			return B([
				t.p0,
				t.p1,
				t.p2,
				t.alpha ?? 1
			]);
		},
		fromValues: function(e) {
			return a(`color(${y.XYZ_D65} ${V(e)})`);
		}
	}
}, He = class extends h {
	#e;
	#t;
	#n;
	contrastRatioThresholds;
	#r;
	fgColor;
	#i;
	#a;
	constructor(e) {
		if (super(), this.#e = !0, this.#t = null, this.#n = null, this.contrastRatioThresholds = null, this.#r = 0, this.fgColor = null, this.#i = null, !e || !e.computedFontSize || !e.computedFontWeight || (this.#e = !1, this.contrastRatioThresholds = o(e.computedFontSize, e.computedFontWeight), this.#r = m(e.computedFontSize, e.computedFontWeight), e.backgroundColors?.length !== 1)) return;
		let t = e.backgroundColors[0], n = a(t)?.asLegacyColor();
		n && this.#o(n);
	}
	isNull() {
		return this.#e;
	}
	setColor(e, t) {
		this.fgColor = e, this.#a = t, this.updateContrastRatio(), this.dispatchEventToListeners("ContrastInfoUpdated");
	}
	colorFormat() {
		return this.#a;
	}
	color() {
		return this.fgColor;
	}
	contrastRatio() {
		return this.#t;
	}
	contrastRatioAPCA() {
		return this.#n;
	}
	contrastRatioAPCAThreshold() {
		return this.#r;
	}
	setBgColor(e) {
		this.#o(e), this.dispatchEventToListeners("ContrastInfoUpdated");
	}
	#o(e) {
		if (this.#i = e, !this.fgColor) return;
		let t = this.fgColor.rgba();
		if (e.hasAlpha()) {
			let n = w(e.rgba(), t);
			this.#i = new b(n, y.RGBA);
		}
		this.#t = r(t, this.#i.rgba()), this.#n = C(this.fgColor.rgba(), this.#i.rgba());
	}
	bgColor() {
		return this.#i;
	}
	updateContrastRatio() {
		this.#i && this.fgColor && (this.#t = r(this.fgColor.rgba(), this.#i.rgba()), this.#n = C(this.fgColor.rgba(), this.#i.rgba()));
	}
	contrastRatioThreshold(e) {
		return this.contrastRatioThresholds ? this.contrastRatioThresholds[e] : null;
	}
}, Ue = /* @__PURE__ */ function(e) {
	return e.CONTRAST_INFO_UPDATED = "ContrastInfoUpdated", e;
}({}), H = {
	noContrastInformationAvailable: "No contrast information available",
	contrastRatio: "Contrast ratio",
	showMore: "Show more",
	pickBackgroundColor: "Pick background color",
	toggleBackgroundColorPicker: "Toggle background color picker",
	useSuggestedColorStoFixLow: "Use suggested color {PH1}to fix low contrast",
	apca: "APCA",
	aa: "AA",
	placeholderWithColon: ": {PH1}",
	aaa: "AAA",
	showLess: "Show less"
}, We = l("ui/legacy/components/color_picker/ContrastDetails.ts", H), U = s.bind(void 0, We), Ge = class e extends h {
	contrastInfo;
	#e;
	toggleMainColorPicker;
	expandedChangedCallback;
	colorSelectedCallback;
	#t;
	passesAA;
	contrastUnknown;
	#n;
	noContrastInfoAvailable;
	contrastValueBubble;
	contrastValue;
	contrastValueBubbleIcons;
	expandButton;
	expandedDetails;
	contrastThresholds;
	contrastAA;
	contrastPassFailAA;
	contrastAAA;
	contrastPassFailAAA;
	contrastAPCA;
	contrastPassFailAPCA;
	chooseBgColor;
	bgColorPickerButton;
	bgColorPickedBound;
	bgColorSwatch;
	constructor(t, n, r, i, a) {
		super(), this.contrastInfo = t, this.#e = n.createChild("div", "spectrum-contrast-details collapsed"), this.toggleMainColorPicker = r, this.expandedChangedCallback = i, this.colorSelectedCallback = a, this.#t = !1, this.passesAA = !0, this.contrastUnknown = !1, this.#n = !1, this.noContrastInfoAvailable = n.createChild("div", "no-contrast-info-available"), this.noContrastInfoAvailable.textContent = U(H.noContrastInformationAvailable), this.noContrastInfoAvailable.classList.add("hidden");
		let o = this.#e.createChild("div");
		o.addEventListener("click", this.topRowClicked.bind(this));
		let s = o.createChild("div", "container");
		Ie(s, U(H.contrastRatio)), this.contrastValueBubble = s.createChild("span", "contrast-details-value"), this.contrastValue = this.contrastValueBubble.createChild("span"), this.contrastValueBubbleIcons = [], this.contrastValueBubbleIcons.push(this.contrastValueBubble.appendChild(N("checkmark"))), this.contrastValueBubbleIcons.push(this.contrastValueBubble.appendChild(N("check-double"))), this.contrastValueBubbleIcons.push(this.contrastValueBubble.appendChild(N("clear"))), this.contrastValueBubbleIcons.forEach((t) => t.addEventListener("click", (t) => {
			e.showHelp(), t.consume(!1);
		}));
		let c = s.createChild("devtools-toolbar", "expand");
		this.expandButton = new I(U(H.showMore), "chevron-down"), this.expandButton.addEventListener(I.Events.CLICK, this.expandButtonClicked.bind(this)), Pe(this.expandButton.element, !1), c.appendToolbarItem(this.expandButton), this.expandedDetails = this.#e.createChild("div", "expanded-details"), Le(this.expandButton.element, this.expandedDetails), this.contrastThresholds = this.expandedDetails.createChild("div", "contrast-thresholds"), this.contrastAA = this.contrastThresholds.createChild("div", "contrast-threshold"), this.contrastPassFailAA = this.contrastAA.createChild("div", "contrast-pass-fail"), this.contrastAAA = this.contrastThresholds.createChild("div", "contrast-threshold"), this.contrastPassFailAAA = this.contrastAAA.createChild("div", "contrast-pass-fail"), this.contrastAPCA = this.contrastThresholds.createChild("div", "contrast-threshold"), this.contrastPassFailAPCA = this.contrastAPCA.createChild("div", "contrast-pass-fail"), this.chooseBgColor = this.expandedDetails.createChild("div", "contrast-choose-bg-color"), this.chooseBgColor.textContent = U(H.pickBackgroundColor);
		let l = this.expandedDetails.createChild("div", "background-color"), u = l.createChild("devtools-toolbar", "spectrum-eye-dropper");
		this.bgColorPickerButton = new _e(U(H.toggleBackgroundColorPicker), "color-picker", "color-picker-filled"), this.bgColorPickerButton.addEventListener(I.Events.CLICK, this.#r.bind(this, void 0, !0)), u.appendToolbarItem(this.bgColorPickerButton), this.bgColorPickedBound = this.bgColorPicked.bind(this), this.bgColorSwatch = new qe(l), this.contrastInfo.addEventListener(Ue.CONTRAST_INFO_UPDATED, this.update.bind(this));
	}
	showNoContrastInfoAvailableMessage() {
		this.noContrastInfoAvailable.classList.remove("hidden");
	}
	hideNoContrastInfoAvailableMessage() {
		this.noContrastInfoAvailable.classList.add("hidden");
	}
	computeSuggestedColor(e) {
		let t = this.contrastInfo.color(), n = this.contrastInfo.bgColor();
		if (!t || !n) return;
		if (e === "APCA") {
			let e = this.contrastInfo.contrastRatioAPCAThreshold();
			return e === null ? void 0 : i(t, n, e + 1);
		}
		let r = this.contrastInfo.contrastRatioThreshold(e);
		if (r) return _(t, n, r + .1);
	}
	onSuggestColor(e) {
		let t = this.computeSuggestedColor(e);
		t && this.colorSelectedCallback(t);
	}
	createFixColorButton(e, t) {
		let n = e.createChild("button", "contrast-fix-button"), r = t.asString(this.contrastInfo.colorFormat()), i = r ? r + " " : "", a = U(H.useSuggestedColorStoFixLow, { PH1: i });
		return j(n, a), F.install(n, a), n.tabIndex = 0, n.style.backgroundColor = i, n;
	}
	update() {
		if (this.contrastInfo.isNull()) {
			this.showNoContrastInfoAvailableMessage(), this.setVisible(!1);
			return;
		}
		this.setVisible(!0), this.hideNoContrastInfoAvailableMessage();
		let t = x.instance().moduleSetting("apca").get(), n = this.contrastInfo.color(), r = this.contrastInfo.bgColor();
		if (t) {
			let t = this.contrastInfo.contrastRatioAPCA();
			if (t === null || !r || !n) {
				this.contrastUnknown = !0, this.contrastValue.textContent = "", this.contrastValueBubble.classList.add("contrast-unknown"), this.chooseBgColor.classList.remove("hidden"), this.contrastThresholds.classList.add("hidden"), this.showNoContrastInfoAvailableMessage();
				return;
			}
			this.contrastUnknown = !1, this.chooseBgColor.classList.add("hidden"), this.contrastThresholds.classList.remove("hidden"), this.contrastValueBubble.classList.remove("contrast-unknown"), this.contrastValue.textContent = `${ue(t, 2)}%`;
			let i = this.contrastInfo.contrastRatioAPCAThreshold(), a = t && i ? Math.abs(t) >= i : !1;
			this.contrastPassFailAPCA.removeChildren();
			let o = this.contrastPassFailAPCA.createChild("span", "contrast-link-label");
			if (o.textContent = U(H.apca), i !== null && (this.contrastPassFailAPCA.createChild("span").textContent = `: ${i.toFixed(2)}%`), a) {
				let e = W();
				this.contrastPassFailAPCA.appendChild(e);
			} else {
				let e = G();
				this.contrastPassFailAPCA.appendChild(e);
				let t = this.computeSuggestedColor("APCA");
				t && this.createFixColorButton(this.contrastPassFailAPCA, t).addEventListener("click", () => this.onSuggestColor("APCA"));
			}
			o.addEventListener("click", (t) => e.showHelp()), this.#e.classList.toggle("contrast-fail", !a), this.contrastValueBubble.classList.toggle("contrast-aa", a), this.bgColorSwatch.setColors(n, r);
			return;
		}
		let i = this.contrastInfo.contrastRatio();
		if (!i || !r || !n) {
			this.contrastUnknown = !0, this.contrastValue.textContent = "", this.contrastValueBubble.classList.add("contrast-unknown"), this.chooseBgColor.classList.remove("hidden"), this.contrastThresholds.classList.add("hidden"), this.showNoContrastInfoAvailableMessage();
			return;
		}
		this.contrastUnknown = !1, this.chooseBgColor.classList.add("hidden"), this.contrastThresholds.classList.remove("hidden"), this.contrastValueBubble.classList.remove("contrast-unknown"), this.contrastValue.textContent = String(ue(i, 2)), this.bgColorSwatch.setColors(n, r);
		let a = this.contrastInfo.contrastRatioThreshold("aa") || 0;
		this.passesAA = (this.contrastInfo.contrastRatio() || 0) >= a, this.contrastPassFailAA.removeChildren();
		let o = this.contrastPassFailAA.createChild("span", "contrast-link-label");
		if (o.textContent = U(H.aa), this.contrastPassFailAA.createChild("span").textContent = U(H.placeholderWithColon, { PH1: a.toFixed(1) }), this.passesAA) {
			let e = W();
			this.contrastPassFailAA.appendChild(e);
		} else {
			let e = G();
			this.contrastPassFailAA.appendChild(e);
			let t = this.computeSuggestedColor("aa");
			t && this.createFixColorButton(this.contrastPassFailAA, t).addEventListener("click", () => this.onSuggestColor("aa"));
		}
		let s = this.contrastInfo.contrastRatioThreshold("aaa") || 0, c = (this.contrastInfo.contrastRatio() || 0) >= s;
		this.contrastPassFailAAA.removeChildren();
		let l = this.contrastPassFailAAA.createChild("span", "contrast-link-label");
		if (l.textContent = U(H.aaa), this.contrastPassFailAAA.createChild("span").textContent = U(H.placeholderWithColon, { PH1: s.toFixed(1) }), c) {
			let e = W();
			this.contrastPassFailAAA.appendChild(e);
		} else {
			let e = G();
			this.contrastPassFailAAA.appendChild(e);
			let t = this.computeSuggestedColor("aaa");
			t && this.createFixColorButton(this.contrastPassFailAAA, t).addEventListener("click", () => this.onSuggestColor("aaa"));
		}
		[o, l].forEach((t) => t.addEventListener("click", () => e.showHelp())), this.#e.classList.toggle("contrast-fail", !this.passesAA), this.contrastValueBubble.classList.toggle("contrast-aa", this.passesAA && !c), this.contrastValueBubble.classList.toggle("contrast-aaa", c);
	}
	static showHelp() {
		ne("https://web.dev/color-and-contrast-accessibility/");
	}
	setVisible(e) {
		this.#n = e, this.#e.classList.toggle("hidden", !e);
	}
	visible() {
		return this.#n;
	}
	element() {
		return this.#e;
	}
	expandButtonClicked() {
		let e = this.contrastValueBubble.getComponentSelection();
		e && e.empty(), this.toggleExpanded();
	}
	topRowClicked(e) {
		let t = this.contrastValueBubble.getComponentSelection();
		t && t.empty(), this.toggleExpanded(), e.consume(!0);
	}
	toggleExpanded() {
		this.#t = !this.#t, Pe(this.expandButton.element, this.#t), this.#e.classList.toggle("collapsed", !this.#t), this.#t ? (this.toggleMainColorPicker(!1), this.expandButton.setGlyph("chevron-up"), this.expandButton.setTitle(U(H.showLess)), this.contrastUnknown && this.#r(!0)) : (this.#r(!1), this.expandButton.setGlyph("chevron-down"), this.expandButton.setTitle(U(H.showMore))), this.expandedChangedCallback();
	}
	collapse() {
		this.#e.classList.remove("expanded"), this.#r(!1), this.toggleMainColorPicker(!1);
	}
	expanded() {
		return this.#t;
	}
	backgroundColorPickerEnabled() {
		return this.bgColorPickerButton.isToggled();
	}
	toggleBackgroundColorPicker(e) {
		this.#r(e, !1);
	}
	#r(e, t = !0) {
		e === void 0 && (e = this.bgColorPickerButton.isToggled()), t && this.dispatchEventToListeners("BackgroundColorPickerWillBeToggled", e), L.setEyeDropperActive(e), e ? L.events.addEventListener(P.EyeDropperPickedColor, this.bgColorPickedBound) : L.events.removeEventListener(P.EyeDropperPickedColor, this.bgColorPickedBound);
	}
	bgColorPicked({ data: e }) {
		let t = [
			e.r,
			e.g,
			e.b,
			(e.a / 2.55 | 0) / 100
		], n = b.fromRGBA(t);
		this.contrastInfo.setBgColor(n), this.#r(!1), this.bgColorPickerButton.toggled(!1), L.bringToFront();
	}
}, Ke = /* @__PURE__ */ function(e) {
	return e.BACKGROUND_COLOR_PICKER_WILL_BE_TOGGLED = "BackgroundColorPickerWillBeToggled", e;
}({}), qe = class {
	swatchElement;
	swatchInnerElement;
	textPreview;
	constructor(e) {
		this.swatchElement = e.createChild("span", "swatch contrast swatch-inner-white"), this.swatchInnerElement = this.swatchElement.createChild("span", "swatch-inner"), this.textPreview = this.swatchElement.createChild("div", "text-preview"), this.textPreview.textContent = "Aa";
	}
	setColors(e, t) {
		this.textPreview.style.color = e.asString(y.RGBA), this.swatchInnerElement.style.backgroundColor = t.asString(y.RGBA), this.swatchElement.classList.toggle("swatch-inner-white", t.as(y.HSL).l > .9);
	}
};
function W() {
	let e = new Ee();
	return e.name = "checkmark", e.style.color = "var(--icon-checkmark-green)", e.style.width = "var(--sys-size-9)", e.style.height = "var(--sys-size-7)", e;
}
function G() {
	let e = new Ee();
	return e.name = "clear", e.style.color = "var(--icon-error)", e.classList.add("small"), e;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/legacy/components/color_picker/ContrastOverlay.ts
var Je = class {
	contrastInfo;
	visible;
	contrastRatioSVG;
	contrastRatioLines;
	width;
	height;
	contrastRatioLineBuilder;
	contrastRatioLinesThrottler;
	drawContrastRatioLinesBound;
	constructor(e, t) {
		this.contrastInfo = e, this.visible = !1, this.contrastRatioSVG = R(t, "svg", "spectrum-contrast-container fill"), this.contrastRatioLines = /* @__PURE__ */ new Map(), x.instance().moduleSetting("apca").get() ? this.contrastRatioLines.set("APCA", R(this.contrastRatioSVG, "path", "spectrum-contrast-line")) : (this.contrastRatioLines.set("aa", R(this.contrastRatioSVG, "path", "spectrum-contrast-line")), this.contrastRatioLines.set("aaa", R(this.contrastRatioSVG, "path", "spectrum-contrast-line"))), this.width = 0, this.height = 0, this.contrastRatioLineBuilder = new Ye(this.contrastInfo), this.contrastRatioLinesThrottler = new xe(0), this.drawContrastRatioLinesBound = this.drawContrastRatioLines.bind(this), this.contrastInfo.addEventListener(Ue.CONTRAST_INFO_UPDATED, this.update.bind(this));
	}
	update() {
		this.visible && !this.contrastInfo.isNull() && (x.instance().moduleSetting("apca").get() && this.contrastInfo.contrastRatioAPCA() === null || this.contrastInfo.contrastRatio() && this.contrastRatioLinesThrottler.schedule(this.drawContrastRatioLinesBound));
	}
	setDimensions(e, t) {
		this.width = e, this.height = t, this.update();
	}
	setVisible(e) {
		this.visible = e, this.contrastRatioSVG.classList.toggle("hidden", !e), this.update();
	}
	async drawContrastRatioLines() {
		for (let [e, t] of this.contrastRatioLines) {
			let n = this.contrastRatioLineBuilder.drawContrastRatioLine(this.width, this.height, e);
			n ? t.setAttribute("d", n) : t.removeAttribute("d");
		}
	}
}, Ye = class {
	contrastInfo;
	constructor(e) {
		this.contrastInfo = e;
	}
	drawContrastRatioLine(e, t, n) {
		let r = x.instance().moduleSetting("apca").get(), i = r ? this.contrastInfo.contrastRatioAPCAThreshold() : this.contrastInfo.contrastRatioThreshold(n);
		if (!e || !t || i === null) return null;
		let a = .02, o = this.contrastInfo.color(), s = this.contrastInfo.bgColor();
		if (!o || !s) return null;
		let l = o.rgba(), p = o.as(y.HSL).hsva(), m = s.rgba(), h = c(m), g = w(l, m), _ = c(g) > h, S = r ? f(h, i, _) : te(h, i, _);
		if (r && Math.abs(Math.round(d(S, h))) < i) return null;
		let C = p[2], T = 0, E = [
			p[0],
			0,
			0,
			p[3]
		], D = [], ne = v(E);
		g = w(ne, m);
		let O = (e) => c(w(b.fromHSVA(e).rgba(), m));
		x.instance().moduleSetting("apca").get() && (O = (e) => u(w(b.fromHSVA(e).rgba(), m)));
		let k = 0;
		for (; k < 1.02; k += a) {
			k = Math.min(1, k), E[1] = k, E[2] = C + T * a;
			let n = ee(E, 2, S, O);
			if (n === null) break;
			T = k === 0 ? 0 : (n - C) / a, C = n, D.push(D.length ? "L" : "M"), D.push((k * e).toFixed(2)), D.push(((1 - n) * t).toFixed(2));
		}
		return k < 1.02 && (k -= a, E[2] = 1, k = ee(E, 1, S, O), k !== null && (D = D.concat([
			"L",
			(k * e).toFixed(2),
			"-0.1"
		]))), D.length === 0 ? null : D.join(" ");
	}
}, Xe = { colorShiftWarning: "⚠️ Conversion to a narrow gamut will cause color shifts" }, Ze = l("ui/legacy/components/color_picker/FormatPickerContextMenu.ts", Xe), Qe = s.bind(void 0, Ze), $e = class {
	#e;
	constructor(e) {
		this.#e = e;
	}
	async show(e, t) {
		let { resolve: n, promise: r } = Promise.withResolvers(), i = [
			y.HEX,
			y.HEXA,
			y.RGB,
			y.RGBA,
			y.HSL,
			y.HWB
		], a = [
			y.LCH,
			y.OKLCH,
			y.LAB,
			y.OKLAB,
			y.SRGB,
			y.SRGB_LINEAR,
			y.DISPLAY_P3,
			y.A98_RGB,
			y.PROPHOTO_RGB,
			y.REC_2020,
			y.XYZ,
			y.XYZ_D50,
			y.XYZ_D65
		], o = new ge(e, { onSoftMenuClosed: () => n() }), s = o.section("disclaimer"), c = o.section("legacy"), l = o.section("wide"), u = o.section("color-function").appendSubMenuItem("color()", !1, "color").section(), d = !1;
		if (!(this.#e instanceof T)) {
			let e = this.#e.asLegacyColor().nickname();
			e && (d ||= e.isGamutClipped(), this.addColorToSection(e, c, t));
		}
		if (!(this.#e instanceof D)) {
			let e = this.#e.as((this.#e.alpha ?? 1) === 1 ? y.HEX : y.HEXA).shortHex();
			e && (d ||= e.isGamutClipped(), this.addColorToSection(e, c, t));
		}
		for (let e of [...i, ...a]) {
			if (e === this.#e.format()) continue;
			let n = this.#e.as(e), r = i.includes(e) ? c : n instanceof S ? u : l;
			d ||= n.isGamutClipped(), this.addColorToSection(n, r, t);
		}
		d && s.appendItem(Qe(Xe.colorShiftWarning), () => {}, { disabled: !0 }), await o.show(), await r;
	}
	addColorToSection(e, t, n) {
		if (e instanceof b) {
			let t = (this.#e.alpha ?? 1) !== 1;
			if (e.alpha !== null !== t) return;
		}
		let r = e.isGamutClipped() ? e.asString() + " ⚠️" : e.asString();
		r && t.appendItem(r, () => n(e), { jslogContext: e.isGamutClipped() ? "color" : "clipped-color" });
	}
}, et = "/*\n * Copyright 2023 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n\n.gamut-line {\n  /* We want to show 50% white color in all themes since this is drawn over a color rectangle */\n  stroke: color-mix(in srgb, var(--ref-palette-neutral100) 50%, transparent);\n  fill: none;\n}\n\n.label {\n  position: absolute;\n  bottom: 3px;\n  margin-right: 5px;\n  /* We want to show 50% white color in all themes since this is drawn over a color rectangle */\n  color: color-mix(in srgb, var(--ref-palette-neutral100) 50%, transparent);\n}\n", tt = 13, nt = .001;
function rt(e) {
	let t = v([...e, 1]), n = g.displayP3ToXyzd50(t[0], t[1], t[2]);
	return g.xyzd50ToSrgb(n[0], n[1], n[2]).every((e) => e + nt >= 0 && e - nt <= 1);
}
var it = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t({ hue: e, width: t, height: n }) {
		if (t === 0 || n === 0) return null;
		let r = 1 / window.devicePixelRatio, i = [], a = 0;
		for (let o = 0; o < n; o += r) {
			let s = 1 - o / n;
			for (; a < t; a += r) if (!rt([
				e,
				a / t,
				s
			])) {
				i.push({
					x: a,
					y: o
				});
				break;
			}
		}
		if (i.length === 0) return null;
		let o = i[i.length - 1];
		return o.x < t && i.push({
			y: o.y,
			x: t
		}), i;
	}
	#n(e, t) {
		let n = Infinity, r = null;
		for (let i of e) Math.abs(t - i.y) <= n && (n = Math.abs(t - i.y), r = i);
		return r;
	}
	render({ hue: e, width: t, height: n }) {
		return Ne("Srgb Overlay render", () => {
			let r = this.#t({
				hue: e,
				width: t,
				height: n
			});
			if (!r || r.length === 0) return;
			let i = this.#n(r, n - tt);
			i && ie(de`
          <style>${et}</style>
          <span class="label" style="right: ${t - i.x}px">sRGB</span>
          <svg>
            <polyline points=${r.map((e) => `${e.x.toFixed(2)},${e.y.toFixed(2)}`).join(" ")} class="gamut-line" />
          </svg>
        `, this.#e, { host: this });
		});
	}
};
customElements.define("devtools-spectrum-srgb-overlay", it);
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/legacy/components/color_picker/spectrum.css.mjs
var at = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n/* https://github.com/bgrins/spectrum */\n\n:host {\n  width: 232px;\n  height: 319px;\n  user-select: none;\n  overflow: hidden;\n}\n\n/* stylelint-disable-next-line selector-pseudo-class-no-unknown */\n:selection {\n  background-color: var(--sys-color-tonal-container);\n  color: var(--sys-color-on-tonal-container);\n}\n\n.spectrum-color {\n  position: relative;\n  width: 232px;\n  height: 127px;\n  border-radius: 2px 2px 0 0;\n  overflow: hidden;\n  flex: none;\n  touch-action: none;\n}\n\n.spectrum-dragger,\n.spectrum-slider {\n  user-select: none;\n}\n\n.spectrum-dragger {\n  border-radius: 12px;\n  height: 12px;\n  width: 12px;\n  border: 1px solid var(--sys-color-surface);\n  cursor: move;\n  z-index: 1;\n  position: absolute;\n  top: 0;\n  left: 0;\n  background: var(--sys-color-inverse-surface);\n  box-shadow: var(--drop-shadow);\n}\n\n.spectrum-slider {\n  position: absolute;\n  top: -1px;\n  cursor: ew-resize;\n  width: 13px;\n  height: 13px;\n  border-radius: 13px;\n  background-color: var(--sys-color-neutral-container);\n  box-shadow: var(--drop-shadow);\n}\n\n.spectrum-color:focus .spectrum-dragger {\n  border: 1px solid var(--sys-color-state-focus-ring);\n}\n\n.spectrum-tools {\n  position: relative;\n  height: 110px;\n  width: 100%;\n  flex: none;\n}\n\n.spectrum-hue {\n  top: 16px;\n  /* stylelint-disable-next-line plugin/use_theme_colors, declaration-property-value-no-unknown */\n  background: linear-gradient(to left in hsl longer hue, #f00 0 100%);\n}\n\n.spectrum-hue.display-p3 {\n  /* stylelint-disable-next-line declaration-property-value-no-unknown */\n  background: linear-gradient(\n    to left in hsl longer hue,\n    color(display-p3 1 0 0) 0 100%\n  );\n}\n\n.spectrum-alpha {\n  top: 35px;\n  background-image: var(--image-file-checker);\n  background-size: 12px 11px;\n}\n\n.spectrum-alpha-background {\n  height: 100%;\n  border-radius: 2px;\n}\n\n.spectrum-hue,\n.spectrum-alpha {\n  position: absolute;\n  left: 86px;\n  width: 130px;\n  height: 11px;\n  border-radius: 2px;\n  touch-action: none;\n}\n\n.spectrum-hue:focus-visible .spectrum-slider,\n.spectrum-alpha:focus-visible .spectrum-slider {\n  border: 1px solid var(--sys-color-state-focus-ring);\n  width: 14px;\n  height: 14px;\n  border-radius: 14px;\n}\n\n.spectrum-sat,\n.-theme-preserve {\n  /* stylelint-disable-next-line plugin/use_theme_colors */\n  background-image: linear-gradient(to right, #fff, rgb(204 154 129 / 0%));\n}\n\n.spectrum-val,\n.-theme-preserve {\n  /* stylelint-disable-next-line plugin/use_theme_colors */\n  background-image: linear-gradient(to top, #000, rgb(204 154 129 / 0%));\n}\n\n.spectrum-contrast-details {\n  position: relative;\n  background-color: var(--sys-color-cdt-base-container);\n  width: 100%;\n  height: 83px;\n  top: 0;\n  font-size: 13px;\n  color: var(--sys-color-on-surface);\n  border-top: 1px solid var(--sys-color-divider);\n  line-height: initial;\n  overflow: hidden;\n  flex: none;\n}\n\n.spectrum-contrast-details.collapsed {\n  height: 36px;\n  flex: none;\n}\n\n.spectrum-contrast-details devtools-toolbar.expand {\n  position: absolute;\n  right: 6px;\n  top: 6px;\n  margin: 0;\n}\n\n.spectrum-contrast-details.visible {\n  display: initial;\n}\n\n.spectrum-contrast-details div.container {\n  margin: 10px;\n}\n\n.spectrum-contrast-details .expanded-details {\n  display: flex;\n  margin: 12px 12px 0 4px;\n}\n\n.spectrum-contrast-details.collapsed .expanded-details {\n  display: none;\n}\n\n.contrast-pass-fail {\n  margin-left: 0.5em;\n  display: flex;\n  align-items: center;\n}\n\n.contrast-choose-bg-color {\n  margin: 8px 0 0 5px;\n  font-style: italic;\n}\n\n.spectrum-contrast-details .contrast-choose-bg-color,\n.spectrum-contrast-details .contrast-thresholds {\n  width: 150px;\n}\n\n.contrast-threshold:first-child {\n  margin-bottom: 5px;\n}\n\n.contrast-fix-button {\n  cursor: pointer;\n  font-size: 13px;\n  padding: 0;\n  margin: 0 0 0 10px;\n  background: 0;\n  width: 12px;\n  height: 12px;\n  border: 1px solid var(--sys-color-neutral-outline);\n  display: inline-block;\n  position: relative;\n}\n\n.contrast-fix-button::after {\n  content: ' ';\n  width: 13px;\n  height: 13px;\n  background-image: var(--image-file-refresh);\n  background-size: contain;\n  position: absolute;\n  left: 5.5px;\n  top: 3.5px;\n  background-color: var(--sys-color-cdt-base-container);\n  border-radius: 50%;\n}\n\n.contrast-fix-button:hover,\n.contrast-fix-button:focus {\n  border: 1px solid var(--sys-color-state-focus-ring);\n  transform: scale(1.2);\n}\n\n.contrast-link-label {\n  cursor: pointer;\n}\n\n.contrast-link-label:hover {\n  text-decoration: underline;\n}\n\n.spectrum-contrast-details .background-color {\n  position: absolute;\n  flex: none;\n  right: 12px;\n}\n\n.spectrum-eye-dropper {\n  width: 32px;\n  height: 24px;\n  position: relative;\n  left: 8px;\n  top: 17px;\n  cursor: pointer;\n}\n\n.spectrum-contrast-details .spectrum-eye-dropper {\n  top: 2px;\n  right: 34px;\n  position: absolute;\n  left: auto;\n}\n\n.contrast-details-value {\n  color: var(--sys-color-on-surface);\n  margin: 1px 5px;\n  user-select: text;\n}\n\n.contrast-pass-fail devtools-icon {\n  margin-left: 5px;\n}\n\n.contrast-details-value devtools-icon {\n  display: none;\n  margin-left: 5px;\n  color: var(--sys-color-on-surface);\n}\n\n.spectrum-contrast-details .toolbar-state-on devtools-icon {\n  color: var(--sys-color-token-subtle);\n}\n\ndevtools-icon.clear {\n  transform: scale(0.7);\n  color: var(--icon-error);\n}\n\ndevtools-icon.checkmark,\ndevtools-icon.check-double {\n  color: var(--icon-checkmark-green);\n}\n\n.spectrum-contrast-details .contrast-details-value.contrast-unknown {\n  background-color: var(--sys-color-cdt-base-container);\n  color: var(--sys-color-on-surface);\n  width: 3em;\n  text-align: center;\n}\n\n.contrast-details-value .clear,\n.contrast-details-value .checkmark,\n.contrast-details-value .check-double {\n  cursor: pointer;\n  vertical-align: -5px;\n}\n\n.spectrum-contrast-details.contrast-fail .contrast-details-value .clear,\n.contrast-details-value.contrast-aa .checkmark,\n.contrast-details-value.contrast-aaa .check-double {\n  display: inline-block;\n}\n\n.swatch {\n  width: 32px;\n  height: 32px;\n  margin: 0;\n  position: absolute;\n  top: 15px;\n  left: 44px;\n  background-image: var(--image-file-checker);\n  border-radius: 16px;\n}\n\n.swatch-inner,\n.swatch-overlay {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  display: inline-block;\n  border-radius: 16px;\n}\n\n.swatch-inner-white {\n  border: 1px solid var(--sys-color-neutral-outline);\n}\n\n.swatch-overlay {\n  cursor: pointer;\n  opacity: 0%;\n  padding: 4px;\n}\n\n.swatch-overlay:hover,\n.swatch-overlay:focus-visible {\n  background-color: var(--color-background-inverted-opacity-30);\n  opacity: 100%;\n}\n\n.swatch-overlay:active {\n  background-color: var(--color-background-inverted-opacity-50);\n}\n\ndevtools-icon.copy-color-icon {\n  color: var(--sys-color-cdt-base-container);\n  margin-top: 2px;\n  margin-left: 2px;\n}\n\n.spectrum-text {\n  position: absolute;\n  top: 60px;\n  left: 16px;\n}\n\n.spectrum-text-value {\n  display: inline-block;\n  width: 40px;\n  overflow: hidden;\n  text-align: center;\n  margin-right: 6px;\n  line-height: 20px;\n  padding: 0;\n  color: var(--sys-color-on-surface);\n  border: 1px solid var(--sys-color-neutral-outline);\n  white-space: nowrap;\n}\n\n.spectrum-text-label {\n  letter-spacing: 39.5px;\n  margin-top: 8px;\n  display: block;\n  color: var(--sys-color-state-disabled);\n  margin-left: 16px;\n  width: 174px;\n}\n\n.spectrum-text-hex > .spectrum-text-value {\n  width: 178px;\n}\n\n.spectrum-text-hex > .spectrum-text-label {\n  letter-spacing: normal;\n  margin-left: 0;\n  text-align: center;\n}\n\n.spectrum-switcher {\n  border-radius: 2px;\n  height: 20px;\n  width: 20px;\n  padding: 2px;\n  border: none;\n  background: none;\n  margin: 0;\n}\n\n.spectrum-display-switcher {\n  top: 72px;\n  position: absolute;\n  right: 10px;\n}\n\n.spectrum-switcher:hover {\n  background-color: var(--sys-color-state-hover-on-subtle);\n}\n\n.spectrum-switcher:focus-visible {\n  background-color: var(--sys-color-state-focus-highlight);\n}\n\n.spectrum-palette-container {\n  border-top: 1px solid var(--sys-color-divider);\n  position: relative;\n  width: 100%;\n  padding: 6px 24px 6px 6px;\n  display: flex;\n  flex-wrap: wrap;\n}\n\n.spectrum-palette {\n  display: flex;\n  flex-wrap: wrap;\n  width: 198px;\n}\n\n.spectrum-palette-color {\n  width: 12px;\n  height: 12px;\n  flex: 0 0 12px;\n  border-radius: 2px;\n  margin: 6px;\n  cursor: pointer;\n  position: relative;\n  border: 1px solid var(--sys-color-divider);\n  background-position: -1px !important; /* stylelint-disable-line declaration-no-important */\n  z-index: 14;\n}\n\n.spectrum-palette-color-shadow {\n  position: absolute;\n  opacity: 0%;\n  margin: 0;\n  top: -5px;\n  left: 3px;\n  border: 0;\n  border-radius: 1px;\n  width: 11px;\n  height: 11px;\n}\n\n.spectrum-palette-color:hover:not(.spectrum-shades-shown)\n  > .spectrum-palette-color-shadow,\n.spectrum-palette-color:focus:not(.spectrum-shades-shown)\n  > .spectrum-palette-color-shadow {\n  opacity: 20%;\n}\n\n.spectrum-palette-color:hover:not(.spectrum-shades-shown)\n  > .spectrum-palette-color-shadow:first-child,\n.spectrum-palette-color:focus:not(.spectrum-shades-shown)\n  > .spectrum-palette-color-shadow:first-child {\n  opacity: 60%;\n  top: -3px;\n  left: 1px;\n}\n\n.palette-color-shades {\n  position: absolute;\n  background-color: var(--sys-color-cdt-base-container);\n  height: 228px;\n  width: 28px;\n  box-shadow: var(--drop-shadow);\n  z-index: 14;\n  border-radius: 2px;\n  transform-origin: 0 228px;\n  margin-top: 16px;\n  margin-left: -8px;\n}\n\n.spectrum-palette > .spectrum-palette-color.spectrum-shades-shown {\n  z-index: 15;\n}\n\n.palette-color-shades > .spectrum-palette-color {\n  margin: 8px 0 0;\n  margin-left: 8px;\n  width: 12px;\n}\n\n.spectrum-palette > .spectrum-palette-color {\n  transition: transform 100ms cubic-bezier(0, 0, 0.2, 1);\n  will-change: transform;\n  z-index: 13;\n}\n\n.palette-preview > .spectrum-palette-color {\n  margin-top: 1px;\n}\n\n.spectrum-palette > .spectrum-palette-color.empty-color {\n  border-color: transparent;\n}\n\n.spectrum-palette-color:not(.has-material-shades):focus {\n  border: 1px solid var(--sys-color-state-focus-ring);\n  transform: scale(1.4);\n}\n\n.palette-color-shades > .spectrum-palette-color:not(.empty-color):hover,\n.spectrum-palette\n  > .spectrum-palette-color:not(.empty-color, .has-material-shades):hover {\n  transform: scale(1.15);\n}\n\n.add-color-toolbar {\n  margin-left: -3px;\n  margin-top: -1px;\n}\n\n.spectrum-palette-switcher {\n  right: 10px;\n  top: 0;\n  margin-top: 9px;\n  position: absolute;\n}\n\n.palette-panel {\n  width: 100%;\n  position: absolute;\n  top: 100%;\n  display: flex;\n  flex-direction: column;\n  background-color: var(--sys-color-cdt-base-container);\n  z-index: 14;\n  transition: transform 200ms cubic-bezier(0, 0, 0.2, 1), visibility 0s 200ms;\n  border-top: 1px solid var(--sys-color-divider);\n  visibility: hidden;\n}\n\n.palette-panel-showing > .palette-panel {\n  transform: translateY(-100%);\n  transition-delay: 0s;\n  visibility: visible;\n}\n\n.palette-panel > devtools-toolbar {\n  position: absolute;\n  right: 6px;\n  top: 6px;\n}\n\n.palette-panel > div {\n  flex: 0 0 38px;\n  border-bottom: 1px solid var(--sys-color-divider);\n  padding: 12px;\n  line-height: 14px;\n  color: var(--sys-color-on-surface);\n}\n\n.palette-panel > div.palette-title {\n  font-size: 14px;\n  line-height: 16px;\n  color: var(--sys-color-on-surface);\n  flex-basis: 40px;\n}\n\ndiv.palette-preview {\n  display: flex;\n  cursor: pointer;\n}\n\n.palette-preview-title {\n  flex: 0 0 84px;\n}\n\n.palette-preview:focus-visible,\n.palette-preview:hover {\n  background-color: var(--sys-color-state-hover-on-subtle);\n}\n\n.spectrum-overlay {\n  z-index: 13;\n  visibility: hidden;\n  /* stylelint-disable-next-line plugin/use_theme_colors */\n  background-color: hsl(0deg 0% 0% / 50%);\n  /* See: crbug.com/1152736 for color variable migration. */\n  opacity: 0%;\n  transition: opacity 100ms cubic-bezier(0, 0, 0.2, 1), visibility 0s 100ms;\n}\n\n.palette-panel-showing > .spectrum-overlay {\n  transition-delay: 0s;\n  visibility: visible;\n  opacity: 100%;\n}\n\n.spectrum-contrast-container {\n  width: 100%;\n  height: 100%;\n}\n\n.spectrum-contrast-line,\n:host-context(.theme-with-dark-background) .spectrum-contrast-line {\n  fill: none;\n  stroke: #fff; /* stylelint-disable-line plugin/use_theme_colors */\n  opacity: 70%;\n  stroke-width: 1.5px;\n}\n\n.delete-color-toolbar {\n  position: absolute;\n  right: 0;\n  top: 0;\n  background-color: var(--sys-color-cdt-base-container);\n  visibility: hidden;\n  z-index: 3;\n  width: 36px;\n  display: flex;\n  align-items: center;\n  padding-left: 4px;\n  bottom: 2px;\n  border-bottom-right-radius: 2px;\n}\n\n@keyframes showDeleteToolbar {\n  from {\n    opacity: 0%;\n  }\n\n  to {\n    opacity: 100%;\n  }\n}\n\n.delete-color-toolbar.dragging {\n  visibility: visible;\n  animation: showDeleteToolbar 100ms 150ms cubic-bezier(0, 0, 0.2, 1) backwards;\n}\n\n.delete-color-toolbar-active {\n  background-color: var(--sys-color-state-hover-on-subtle);\n  color: var(--sys-color-cdt-base-container);\n}\n\n.swatch.contrast {\n  width: 30px;\n  height: 30px;\n  position: absolute;\n  top: 0;\n  right: 0;\n  left: auto;\n  background-image: var(--image-file-checker);\n  border-radius: 15px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.swatch.contrast .swatch-overlay {\n  padding: 0;\n}\n\n.background-color .text-preview {\n  color: var(--sys-color-inverse-surface);\n  font-size: 16px;\n  position: relative;\n  padding-bottom: 2px;\n}\n\n.swatch.contrast devtools-icon {\n  margin: -2px;\n}\n\n.no-contrast-info-available {\n  border-top: 1px solid var(--sys-color-divider);\n  position: relative;\n  width: 100%;\n  padding: 10px;\n  justify-content: center;\n  display: flex;\n  flex-wrap: wrap;\n}\n\n@media (forced-colors: active) {\n  :host {\n    border: 1px solid canvastext !important; /* stylelint-disable-line declaration-no-important */\n  }\n\n  .spectrum-color {\n    forced-color-adjust: none;\n  }\n\n  .spectrum-switcher:hover,\n  .spectrum-switcher:focus-visible {\n    forced-color-adjust: none;\n    background-color: Highlight !important; /* stylelint-disable-line declaration-no-important */\n  }\n\n  :host-context(.theme-with-dark-background) .spectrum-switcher {\n    filter: unset;\n  }\n\n  .spectrum-switcher:hover svg,\n  .spectrum-switcher:focus-visible svg {\n    fill: HighlightText;\n  }\n\n  .swatch {\n    forced-color-adjust: none;\n  }\n\n  .swatch-inner,\n  .swatch-overlay,\n  .swatch-inner-white {\n    border: 1px solid ButtonText;\n  }\n\n  .swatch-overlay:hover,\n  .swatch-overlay:focus-visible {\n    background-color: canvas !important; /* stylelint-disable-line declaration-no-important */\n  }\n\n  .spectrum-slider {\n    forced-color-adjust: none;\n    background-color: ButtonText !important; /* stylelint-disable-line declaration-no-important */\n    box-shadow: 0 1px 4px 0 ButtonFace !important; /* stylelint-disable-line declaration-no-important */\n  }\n}\n", K = {
	toggleColorPicker: "Eye dropper [{PH1}]",
	changeHue: "Change hue",
	changeAlpha: "Change alpha",
	hex: "HEX",
	changeColorFormat: "Change color format",
	previewPalettes: "Preview palettes",
	addToPalette: "Add to palette",
	colorPalettes: "Color Palettes",
	returnToColorPicker: "Return to color picker",
	colorS: "Color {PH1}",
	longclickOrLongpressSpaceToShow: "Long-click or long-press space to show alternate shades of {PH1}",
	removeColor: "Remove color",
	removeAllToTheRight: "Remove all to the right",
	clearPalette: "Clear palette",
	sInS: "{PH1} in {PH2}",
	copyColorToClipboard: "Copy color to clipboard",
	pressArrowKeysMessage: "Press arrow keys with or without modifiers to move swatch position. Arrow key with Shift key moves position largely, with Ctrl key it is less and with Alt key it is even less"
}, ot = l("ui/legacy/components/color_picker/Spectrum.ts", K), q = s.bind(void 0, ot), st = /* @__PURE__ */ new WeakMap(), ct = /* @__PURE__ */ new WeakMap(), lt = [
	y.SRGB,
	y.RGB,
	y.HEX,
	y.HSL,
	y.HWB
], J = "EyeDropper" in window;
function ut(e) {
	return !lt.includes(e);
}
function dt(e) {
	return e === y.RGBA ? y.RGB : e === y.HSLA ? y.HSL : e === y.HWBA ? y.HWB : e === y.HEXA ? y.HEX : e;
}
function ft(e, t) {
	switch (e) {
		case "display-p3": {
			let e = t.as(y.DISPLAY_P3);
			return [...p([
				e.p0,
				e.p1,
				e.p2
			]), e.alpha || 1];
		}
		case "srgb": return t.as(y.HSL).hsva();
	}
}
function Y(e, t) {
	let n = b.fromHSVA(t);
	switch (e) {
		case "display-p3": {
			let e = v(t);
			return new S(y.DISPLAY_P3, e[0], e[1], e[2], e[3], void 0);
		}
		case "srgb": return n;
	}
}
var pt = class extends n(ye) {
	#e;
	gamut = "srgb";
	colorElement;
	colorDragElement;
	dragX;
	dragY;
	colorPickerButton;
	swatch;
	hueElement;
	hueSlider;
	alphaElement;
	alphaElementBackground;
	alphaSlider;
	displayContainer;
	textValues;
	textLabels;
	hexContainer;
	hexValue;
	contrastInfo;
	srgbOverlay;
	contrastOverlay;
	contrastDetails;
	contrastDetailsBackgroundColorPickerToggledBound;
	palettes;
	palettePanel;
	palettePanelShowing;
	paletteSectionContainer;
	paletteContainer;
	shadesContainer;
	deleteIconToolbar;
	deleteButton;
	addColorToolbar;
	colorPickedBound;
	hsv;
	hueAlphaWidth;
	dragWidth;
	dragHeight;
	colorDragElementHeight;
	slideHelperWidth;
	numPaletteRowsShown;
	selectedColorPalette;
	customPaletteSetting;
	colorOffset;
	closeButton;
	paletteContainerMutable;
	shadesCloseHandler;
	dragElement;
	dragHotSpotX;
	dragHotSpotY;
	#t;
	colorFormat = y.RGB;
	eyeDropperAbortController = null;
	isFormatPickerShown = !1;
	#n;
	constructor(e) {
		super({ useShadowDom: !0 }), this.registerRequiredCSS(at), this.contentElement.tabIndex = 0, this.contentElement.setAttribute("jslog", `${De("colorPicker").parent("mapped").track({ keydown: "Enter|Escape" })}`), this.colorElement = this.contentElement.createChild("div", "spectrum-color"), this.colorElement.tabIndex = 0, this.colorElement.setAttribute("jslog", `${Fe("color").track({
			click: !0,
			drag: !0,
			keydown: "ArrowLeft|ArrowRight|ArrowDown|ArrowUp"
		})}`), this.setDefaultFocusedElement(this.colorElement), this.colorElement.addEventListener("keydown", this.onSliderKeydown.bind(this, f.bind(this)));
		let t = q(K.pressArrowKeysMessage);
		j(this.colorElement, t), oe(this.colorElement), this.colorDragElement = this.colorElement.createChild("div", "spectrum-sat fill").createChild("div", "spectrum-val fill").createChild("div", "spectrum-dragger"), this.dragX = 0, this.dragY = 0;
		let n = this.contentElement.createChild("div", "spectrum-tools"), r = n.createChild("devtools-toolbar", "spectrum-eye-dropper"), i = ae.instance().shortcutsForAction("elements.toggle-eye-dropper")[0]?.descriptors.flatMap((e) => e.name.split(" + "))[0];
		this.colorPickerButton = new _e(q(K.toggleColorPicker, { PH1: i || "" }), "color-picker", "color-picker-filled", "color-eye-dropper"), this.colorPickerButton.setToggled(!0), this.colorPickerButton.addEventListener(I.Events.CLICK, this.toggleColorPicker.bind(this, void 0)), r.appendToolbarItem(this.colorPickerButton), this.colorPickerButton.element.setAttribute("jslog", `${k().track({ click: !0 })}`), this.swatch = new vt(n), this.hueElement = n.createChild("div", "spectrum-hue"), this.hueElement.setAttribute("jslog", `${je("hue").track({
			click: !0,
			drag: !0,
			keydown: "ArrowLeft|ArrowRight|ArrowDown|ArrowUp"
		})}`), this.hueElement.tabIndex = 0, this.hueElement.addEventListener("keydown", this.onSliderKeydown.bind(this, u.bind(this))), j(this.hueElement, q(K.changeHue)), ve(this.hueElement, 0, 360), this.hueSlider = this.hueElement.createChild("div", "spectrum-slider"), this.alphaElement = n.createChild("div", "spectrum-alpha"), this.alphaElement.setAttribute("jslog", `${je("alpha").track({
			click: !0,
			drag: !0,
			keydown: "ArrowLeft|ArrowRight|ArrowDown|ArrowUp"
		})}`), this.alphaElement.tabIndex = 0, this.alphaElement.addEventListener("keydown", this.onSliderKeydown.bind(this, d.bind(this))), j(this.alphaElement, q(K.changeAlpha)), ve(this.alphaElement, 0, 1), this.alphaElementBackground = this.alphaElement.createChild("div", "spectrum-alpha-background"), this.alphaSlider = this.alphaElement.createChild("div", "spectrum-slider"), this.displayContainer = n.createChild("div", "spectrum-text source-code"), ke(this.displayContainer, !0), this.textValues = [];
		for (let e = 0; e < 4; ++e) {
			let t = be("spectrum-text-value");
			t.setAttribute("jslog", `${he().track({
				change: !0,
				keydown: "ArrowUp|ArrowDown"
			}).context(e)}`), this.displayContainer.appendChild(t), t.maxLength = 4, this.textValues.push(t), t.addEventListener("keydown", this.inputChanged.bind(this), !1), t.addEventListener("input", this.inputChanged.bind(this), !1), t.addEventListener("wheel", this.inputChanged.bind(this), !1), t.addEventListener("paste", this.pasted.bind(this), !1);
		}
		this.textLabels = this.displayContainer.createChild("div", "spectrum-text-label"), this.hexContainer = n.createChild("div", "spectrum-text spectrum-text-hex source-code"), ke(this.hexContainer, !0), this.hexValue = be("spectrum-text-value"), this.hexValue.setAttribute("jslog", `${he("hex").track({
			keydown: "ArrowUp|ArrowDown",
			change: !0
		})}`), this.hexContainer.appendChild(this.hexValue), this.hexValue.maxLength = 9, this.hexValue.addEventListener("keydown", this.inputChanged.bind(this), !1), this.hexValue.addEventListener("input", this.inputChanged.bind(this), !1), this.hexValue.addEventListener("wheel", this.inputChanged.bind(this), !1), this.hexValue.addEventListener("paste", this.pasted.bind(this), !1);
		let a = this.hexContainer.createChild("div", "spectrum-text-label");
		a.textContent = q(K.hex), j(this.hexValue, a.textContent);
		let o = n.createChild("button", "spectrum-display-switcher spectrum-switcher");
		o.setAttribute("jslog", `${we("color-format").track({ click: !0 })}`), h(o), me(o, q(K.changeColorFormat)), o.tabIndex = 0, o.addEventListener("click", (e) => {
			this.showFormatPicker(e);
		}), M(this.hueElement, this.dragStart.bind(this, u.bind(this)), u.bind(this), null, "ew-resize", "crosshair"), M(this.alphaElement, this.dragStart.bind(this, d.bind(this)), d.bind(this), null, "ew-resize", "crosshair"), M(this.colorElement, this.dragStart.bind(this, f.bind(this)), f.bind(this), null, "move", "crosshair"), e && (this.contrastInfo = e, this.contrastOverlay = new Je(this.contrastInfo, this.colorElement), this.contrastDetails = new Ge(this.contrastInfo, this.contentElement, this.toggleColorPicker.bind(this), this.contrastPanelExpandedChanged.bind(this), this.colorSelected.bind(this)), this.contrastDetailsBackgroundColorPickerToggledBound = this.contrastDetailsBackgroundColorPickerToggled.bind(this)), this.element.classList.add("flex-none"), this.palettes = /* @__PURE__ */ new Map(), this.palettePanel = this.contentElement.createChild("div", "palette-panel"), this.palettePanel.setAttribute("jslog", `${Ae("palette-panel")}`), this.palettePanelShowing = !1, this.paletteSectionContainer = this.contentElement.createChild("div", "spectrum-palette-container"), this.paletteContainer = this.paletteSectionContainer.createChild("div", "spectrum-palette"), this.paletteContainer.addEventListener("contextmenu", this.showPaletteColorContextMenu.bind(this, -1)), this.shadesContainer = this.contentElement.createChild("div", "palette-color-shades hidden"), this.shadesContainer.setAttribute("jslog", `${se()}`), M(this.paletteContainer, this.paletteDragStart.bind(this), this.paletteDrag.bind(this), this.paletteDragEnd.bind(this), "default");
		let s = this.paletteSectionContainer.createChild("div", "spectrum-palette-switcher spectrum-switcher");
		s.setAttribute("jslog", `${we("palette-switcher").track({ click: !0 })}`), h(s), me(s, q(K.previewPalettes)), z(s), s.tabIndex = 0, self.onInvokeElement(s, (e) => {
			this.togglePalettePanel(!0), e.consume(!0);
		}), this.deleteIconToolbar = document.createElement("devtools-toolbar"), this.deleteIconToolbar.classList.add("delete-color-toolbar"), this.deleteButton = new I("", "bin"), this.deleteIconToolbar.appendToolbarItem(this.deleteButton), this.contentElement.createChild("div", "spectrum-overlay fill").addEventListener("click", this.togglePalettePanel.bind(this, !1)), this.addColorToolbar = document.createElement("devtools-toolbar"), this.addColorToolbar.classList.add("add-color-toolbar");
		let c = new I(q(K.addToPalette), "plus", void 0, "add-color");
		c.addEventListener(I.Events.CLICK, this.onAddColorMousedown.bind(this)), c.element.addEventListener("keydown", this.onAddColorKeydown.bind(this)), this.addColorToolbar.appendToolbarItem(c), this.colorPickedBound = this.colorPicked.bind(this), this.numPaletteRowsShown = -1, this.contentElement.addEventListener("focusout", (e) => {
			this.isFormatPickerShown && e.stopImmediatePropagation();
		}), this.srgbOverlay = new it(), this.loadPalettes(), new gt((e) => {
			e.colors.length ? this.addPalette(e) : this.selectedColorPalette.get() === e.title && this.paletteSelected($);
		});
		function l(e, t) {
			let n = t, r = e.getBoundingClientRect();
			switch (n.key) {
				case "ArrowLeft":
				case "ArrowDown": return r.left - 1;
				case "ArrowRight":
				case "ArrowUp": return r.right + 1;
				default: return t.x;
			}
		}
		function u(e) {
			let t = this.hsv.slice(), n = 1 - (l(this.hueSlider, e) - this.hueElement.getBoundingClientRect().left) / this.hueAlphaWidth;
			t[0] = A(n, 0, 1), this.#i(t, "", void 0, void 0, X.Other);
			let r = Y(this.gamut, t).as(y.HSL).canonicalHSLA();
			le(this.hueElement, r[0]);
		}
		function d(e) {
			let t = this.hsv.slice(), n = (l(this.alphaSlider, e) - this.hueElement.getBoundingClientRect().left) / this.hueAlphaWidth, r = Math.round(n * 100) / 100;
			t[3] = A(r, 0, 1), this.#i(t, "", void 0, void 0, X.Other);
			let i = Y(this.gamut, t).as(y.HSL).canonicalHSLA();
			fe(this.alphaElement, i[3]);
		}
		function f(e) {
			let t = this.hsv.slice(), n = p(this.colorDragElement, e);
			this.colorOffset = this.colorElement.getBoundingClientRect(), t[1] = A((n.x - this.colorOffset.left) / this.dragWidth, 0, 1), t[2] = A(1 - (n.y - this.colorOffset.top) / this.dragHeight, 0, 1), this.#i(t, "", void 0, void 0, X.Other);
		}
		function p(e, t) {
			let n = e.getBoundingClientRect(), r = n.x + n.width / 2, i = n.y + n.width / 2, a = m(n.width / 4, t);
			switch (t.key) {
				case "ArrowLeft": return {
					x: n.left - a,
					y: i
				};
				case "ArrowRight": return {
					x: n.right + a,
					y: i
				};
				case "ArrowDown": return {
					x: r,
					y: n.bottom + a
				};
				case "ArrowUp": return {
					x: r,
					y: n.top - a
				};
				default: return {
					x: t.x,
					y: t.y
				};
			}
		}
		function m(e, t) {
			let n = t;
			return n.altKey ? e = 1 : n.ctrlKey ? e = 10 : n.shiftKey && (e = 20), e;
		}
		function h(e) {
			let t = new Ee();
			t.name = "fold-more", t.classList.add("medium"), e.appendChild(t);
		}
	}
	dragStart(e, t) {
		return this.colorOffset = this.colorElement.getBoundingClientRect(), e(t), !0;
	}
	contrastDetailsBackgroundColorPickerToggled(e) {
		e.data && this.toggleColorPicker(!1);
	}
	contrastPanelExpandedChanged() {
		this.contrastOverlay && this.contrastDetails && (this.contrastOverlay.setVisible(this.contrastDetails.expanded()), this.resizeForSelectedPalette(!0), this.contrastDetails.expanded() ? this.hideSrgbOverlay() : this.showSrgbOverlay());
	}
	updatePalettePanel() {
		this.palettePanel.removeChildren();
		let e = this.palettePanel.createChild("div", "palette-title");
		e.textContent = q(K.colorPalettes);
		let t = this.palettePanel.createChild("devtools-toolbar");
		this.closeButton = new I(q(K.returnToColorPicker), "cross"), this.closeButton.addEventListener(I.Events.CLICK, this.togglePalettePanel.bind(this, !1)), this.closeButton.element.addEventListener("keydown", this.onCloseBtnKeydown.bind(this)), this.closeButton.element.setAttribute("jslog", `${pe().track({ click: !0 })}`), t.appendToolbarItem(this.closeButton);
		for (let e of this.palettes.values()) this.palettePanel.appendChild(this.createPreviewPaletteElement(e));
		this.contentElement.scrollIntoView({ block: "end" });
	}
	togglePalettePanel(e) {
		this.palettePanelShowing !== e && (e && this.updatePalettePanel(), this.palettePanelShowing = e, this.contentElement.classList.toggle("palette-panel-showing", e), this.#r());
	}
	onCloseBtnKeydown(n) {
		(t(n) || e(n)) && (this.togglePalettePanel(!1), n.consume(!0));
	}
	onSliderKeydown(e, t) {
		switch (t.key) {
			case "ArrowLeft":
			case "ArrowRight":
			case "ArrowDown":
			case "ArrowUp": e(t), t.consume(!0);
		}
	}
	#r() {
		this.isShowing() && (this.palettePanelShowing && this.closeButton ? this.closeButton.element.focus({ preventScroll: !0 }) : this.contentElement.focus());
	}
	createPaletteColor(e, t, n) {
		let r = document.createElement("div");
		return r.classList.add("spectrum-palette-color"), r.setAttribute("jslog", `${ce().track({
			click: !0,
			drag: !0,
			keydown: "ArrowUp|ArrowDown|ArrowLeft|ArrowRight|Escape|Tab"
		})}`), r.style.background = Be("linear-gradient(%s, %s), var(--image-file-checker)", e, e), n && r.animate([{ opacity: 0 }, { opacity: 1 }], {
			duration: 100,
			delay: n,
			fill: "backwards"
		}), F.install(r, t || e), r;
	}
	showPalette(e, t, n) {
		this.resizeForSelectedPalette(), this.paletteContainer.removeChildren();
		for (let n = 0; n < e.colors.length; n++) {
			let r = t ? n * 100 / e.colors.length : 0, i = this.createPaletteColor(e.colors[n], e.colorNames[n], r);
			if (z(i), j(i, q(K.colorS, { PH1: e.colors[n] })), i.tabIndex = -1, i.addEventListener("mousedown", this.onPaletteColorKeydown.bind(this, e, n)), i.addEventListener("keydown", this.onPaletteColorKeydown.bind(this, e, n)), e.mutable) st.set(i, !0), ct.set(i, e.colors[n]), i.addEventListener("contextmenu", this.showPaletteColorContextMenu.bind(this, n));
			else if (e === $) {
				i.classList.add("has-material-shades");
				let t = i.createChild("div", "spectrum-palette-color spectrum-palette-color-shadow");
				t.style.background = e.colors[n], t = i.createChild("div", "spectrum-palette-color spectrum-palette-color-shadow"), t.style.background = e.colors[n];
				let r = q(K.longclickOrLongpressSpaceToShow, { PH1: e.colors[n] });
				F.install(i, r), j(i, r), new Me(i, this.showLightnessShades.bind(this, i, e.colors[n]));
			}
			this.paletteContainer.appendChild(i);
		}
		this.paletteContainer.childNodes.length > 0 && (this.paletteContainer.childNodes[0].tabIndex = 0), this.paletteContainerMutable = e.mutable, e.mutable ? (this.paletteContainer.appendChild(this.addColorToolbar), this.paletteContainer.appendChild(this.deleteIconToolbar)) : (this.addColorToolbar.remove(), this.deleteIconToolbar.remove()), this.togglePalettePanel(!1), this.#r();
	}
	showLightnessShades(e, t, n) {
		function r(e) {
			this.shadesContainer.classList.add("hidden"), e.classList.remove("spectrum-shades-shown"), this.shadesCloseHandler && this.shadesContainer.ownerDocument.removeEventListener("mousedown", this.shadesCloseHandler, !0), delete this.shadesCloseHandler;
		}
		this.shadesCloseHandler && this.shadesCloseHandler(), this.shadesContainer.classList.remove("hidden"), this.shadesContainer.removeChildren(), this.shadesContainer.animate([{
			transform: "scaleY(0)",
			opacity: "0"
		}, {
			transform: "scaleY(1)",
			opacity: "1"
		}], {
			duration: 200,
			easing: "cubic-bezier(0.4, 0, 0.2, 1)"
		});
		let i = this.paletteContainer.offsetTop + e.offsetTop + (e.parentElement ? e.parentElement.offsetTop : 0);
		this.contrastDetails && (i += this.contrastDetails.element().offsetHeight), this.shadesContainer.style.top = i + "px", this.shadesContainer.style.left = e.offsetLeft + "px", e.classList.add("spectrum-shades-shown");
		let a = _t.get(t);
		if (a !== void 0) for (let t = a.length - 1; t >= 0; t--) {
			let n = this.createPaletteColor(a[t], void 0, t * 200 / a.length + 100);
			z(n), j(n, q(K.colorS, { PH1: a[t] })), n.tabIndex = -1, n.addEventListener("mousedown", this.onShadeColorKeydown.bind(this, a[t], e)), n.addEventListener("keydown", this.onShadeColorKeydown.bind(this, a[t], e)), this.shadesContainer.appendChild(n);
		}
		this.shadesContainer.childNodes.length > 0 && this.shadesContainer.childNodes[this.shadesContainer.childNodes.length - 1].focus(), this.shadesCloseHandler = r.bind(this, e), this.shadesContainer.ownerDocument.addEventListener("mousedown", this.shadesCloseHandler, !0);
	}
	slotIndexForEvent(e) {
		let t = e, n = t.pageX - this.paletteContainer.getBoundingClientRect().left, r = t.pageY - this.paletteContainer.getBoundingClientRect().top, i = Math.min(n / Z | 0, Q - 1), a = r / Z | 0;
		return Math.min(a * Q + i, this.customPaletteSetting.get().colors.length - 1);
	}
	isDraggingToBin(e) {
		return e.pageX > this.deleteIconToolbar.getBoundingClientRect().left;
	}
	paletteDragStart(e) {
		let t = re(e);
		if (!t || !st.get(t)) return !1;
		let n = this.slotIndexForEvent(e);
		this.dragElement = t;
		let r = e;
		return this.dragHotSpotX = r.pageX - n % Q * Z, this.dragHotSpotY = r.pageY - (n / Q | 0) * Z, !0;
	}
	paletteDrag(e) {
		let t = e;
		if (t.pageX < this.paletteContainer.getBoundingClientRect().left || t.pageY < this.paletteContainer.getBoundingClientRect().top || !this.dragElement || this.dragHotSpotX === void 0 || this.dragHotSpotY === void 0) return;
		let n = this.slotIndexForEvent(e), r = t.pageX - n % Q * Z, i = t.pageY - (n / Q | 0) * Z, a = this.isDraggingToBin(e);
		this.deleteIconToolbar.classList.add("dragging"), this.deleteIconToolbar.classList.toggle("delete-color-toolbar-active", a);
		let o = "translateX(" + (r - this.dragHotSpotX) + "px) translateY(" + (i - this.dragHotSpotY) + "px)";
		this.dragElement.style.transform = a ? o + " scale(0.8)" : o;
		let s = [...this.paletteContainer.children], c = s.indexOf(this.dragElement), l = /* @__PURE__ */ new Map();
		for (let e of s) l.set(e, e.getBoundingClientRect());
		c !== n && this.paletteContainer.insertBefore(this.dragElement, s[n > c ? n + 1 : n]);
		for (let e of s) {
			if (e === this.dragElement) continue;
			let t = l.get(e), n = e.getBoundingClientRect();
			t && (t.left !== n.left || t.top !== n.top) && e.animate([{ transform: "translateX(" + (t.left - n.left) + "px) translateY(" + (t.top - n.top) + "px)" }, { transform: "none" }], {
				duration: 100,
				easing: "cubic-bezier(0, 0, 0.2, 1)"
			});
		}
	}
	paletteDragEnd(e) {
		if (!this.dragElement) return;
		this.isDraggingToBin(e) && this.dragElement.remove(), this.dragElement.style.removeProperty("transform");
		let t = this.paletteContainer.children, n = [];
		for (let e = 0; e < t.length; ++e) {
			let r = ct.get(t[e]);
			r && n.push(r);
		}
		let r = this.customPaletteSetting.get();
		r.colors = n, this.customPaletteSetting.set(r), this.showPalette(r, !1), this.deleteIconToolbar.classList.remove("dragging"), this.deleteIconToolbar.classList.remove("delete-color-toolbar-active");
	}
	loadPalettes() {
		this.palettes.set($.title, $);
		let e = {
			title: "Custom",
			colors: [],
			colorNames: [],
			mutable: !0
		};
		this.customPaletteSetting = x.instance().createSetting("custom-color-palette", e);
		let t = this.customPaletteSetting.get();
		t.colorNames = t.colorNames || [], this.palettes.set(t.title, t), this.selectedColorPalette = x.instance().createSetting("selected-color-palette", ht);
		let n = this.palettes.get(this.selectedColorPalette.get());
		n && this.showPalette(n, !0);
	}
	addPalette(e) {
		this.palettes.set(e.title, e), this.selectedColorPalette.get() === e.title && this.showPalette(e, !0);
	}
	createPreviewPaletteElement(e) {
		let t = document.createElement("div");
		t.classList.add("palette-preview"), z(t), t.tabIndex = 0;
		let n = t.createChild("div", "palette-preview-title");
		n.textContent = e.title;
		let r = 0;
		for (; r < 5 && r < e.colors.length; r++) t.appendChild(this.createPaletteColor(e.colors[r], e.colorNames[r]));
		for (; r < 5; r++) t.createChild("div", "spectrum-palette-color empty-color");
		return self.onInvokeElement(t, (t) => {
			this.paletteSelected(e), t.consume(!0);
		}), t;
	}
	paletteSelected(e) {
		this.selectedColorPalette.set(e.title), this.showPalette(e, !0);
	}
	resizeForSelectedPalette(e) {
		let t = this.palettes.get(this.selectedColorPalette.get());
		if (!t) return;
		let n = t.colors.length;
		t === this.customPaletteSetting.get() && n++;
		let r = Math.max(1, Math.ceil(n / Q));
		if (this.numPaletteRowsShown === r && !e) return;
		this.numPaletteRowsShown = r;
		let i = 236;
		this.contrastDetails && (this.contrastDetails.expanded() ? i += 78 : i += 36), this.element.style.height = i + 12 + 24 * r + "px", this.dispatchEventToListeners("SizeChanged");
	}
	onPaletteColorKeydown(t, n, r) {
		if (r instanceof MouseEvent || e(r)) {
			let e = t.colors[n], r = t.colorNames[n], i = a(e);
			i && this.#i(i, e, r, t.matchUserFormat ? this.colorFormat : i.format(), X.Other);
			return;
		}
		let i;
		switch (r.key) {
			case "ArrowLeft":
				i = n - 1;
				break;
			case "ArrowRight":
				i = n + 1;
				break;
			case "ArrowUp":
				i = n - Q;
				break;
			case "ArrowDown": i = n + Q;
		}
		i !== void 0 && i > -1 && i < this.paletteContainer.childNodes.length && this.paletteContainer.childNodes[i].focus();
	}
	onShadeColorKeydown(n, r, i) {
		if (i instanceof MouseEvent || e(i)) {
			let e = a(n);
			e && this.#i(e, n, n, e.format(), X.Other);
			return;
		}
		let o = i.target;
		t(i) || i.key === "Tab" ? (r.focus(), this.shadesCloseHandler && this.shadesCloseHandler(), i.consume(!0)) : i.key === "ArrowUp" && o.previousElementSibling ? (o.previousElementSibling.focus(), i.consume(!0)) : i.key === "ArrowDown" && o.nextElementSibling && (o.nextElementSibling.focus(), i.consume(!0));
	}
	onAddColorMousedown() {
		this.addColorToCustomPalette();
	}
	onAddColorKeydown(t) {
		e(t) && (this.addColorToCustomPalette(), t.consume(!0));
	}
	addColorToCustomPalette() {
		let e = this.customPaletteSetting.get();
		e.colors.push(this.colorString()), this.customPaletteSetting.set(e), this.showPalette(e, !1);
		let t = this.paletteContainer.querySelectorAll(".spectrum-palette-color");
		t[t.length - 1].focus();
	}
	showPaletteColorContextMenu(e, t) {
		if (!this.paletteContainerMutable) return;
		let n = new ge(t);
		e !== -1 && (n.defaultSection().appendItem(q(K.removeColor), this.deletePaletteColors.bind(this, e, !1), { jslogContext: "remove-color" }), n.defaultSection().appendItem(q(K.removeAllToTheRight), this.deletePaletteColors.bind(this, e, !0), { jslogContext: "remove-all-to-the-right" })), n.defaultSection().appendItem(q(K.clearPalette), this.deletePaletteColors.bind(this, -1, !0), { jslogContext: "clear-palette" }), n.show();
	}
	deletePaletteColors(e, t) {
		let n = this.customPaletteSetting.get();
		t ? n.colors.splice(e + 1, n.colors.length - e - 1) : n.colors.splice(e, 1), this.customPaletteSetting.set(n), this.showPalette(n, !1);
	}
	setColor(e) {
		this.#i(e, "", void 0, e.format(), X.Model);
		let t = e.as(y.HSL).canonicalHSLA();
		le(this.hueElement, t[0]), fe(this.alphaElement, t[3]);
	}
	colorSelected(e) {
		this.#i(e, "", void 0, void 0, X.Other);
	}
	get color() {
		return this.#e ? this.#e : Y(this.gamut, this.hsv);
	}
	#i(e, t, n, r, i) {
		if (t !== void 0 && (this.#n = t), r !== void 0 && (this.colorFormat = dt(r), this.gamut = ut(this.colorFormat) ? "display-p3" : "srgb"), Array.isArray(e)) this.#e = void 0, this.hsv = e;
		else if (e !== void 0) {
			this.#e = e;
			let t = this.hsv ? this.hsv[0] : null;
			this.hsv = ft(this.gamut, e), t !== null && e.as(y.LCH).isHuePowerless() && (this.hsv[0] = t);
		}
		this.#t = n, this.contrastInfo && this.contrastInfo.setColor(b.fromHSVA(this.hsv), this.colorFormat), this.updateHelperLocations(), this.updateUI(), i !== X.Input && this.updateInput(), i !== X.Model && this.dispatchEventToListeners("ColorChanged", this.colorString());
	}
	colorName() {
		return this.#t;
	}
	colorString() {
		if (this.#n) return this.#n;
		let e = this.color, t = this.colorFormat && this.colorFormat !== e.format() ? e.asString(this.colorFormat) : e.getAuthoredText() ?? e.asString();
		return t || (t = this.colorFormat === y.HEX ? e.asString(y.HEXA) : this.colorFormat === y.HSL ? e.asString(y.HSLA) : this.colorFormat === y.HWB ? e.asString(y.HWBA) : e.asString(y.RGBA), console.assert(!!t), t || "");
	}
	updateHelperLocations() {
		let e = this.hsv[0], t = this.hsv[1], n = this.hsv[2], r = this.hsv[3];
		this.dragX = t * this.dragWidth, this.dragY = this.dragHeight - n * this.dragHeight;
		let i = Math.max(-this.colorDragElementHeight, Math.min(this.dragWidth - this.colorDragElementHeight, this.dragX - this.colorDragElementHeight)), a = Math.max(-this.colorDragElementHeight, Math.min(this.dragHeight - this.colorDragElementHeight, this.dragY - this.colorDragElementHeight));
		this.colorDragElement.positionAt(i, a);
		let o = (1 - e) * this.hueAlphaWidth - this.slideHelperWidth;
		this.hueSlider.style.left = o + "px";
		let s = r * this.hueAlphaWidth - this.slideHelperWidth;
		this.alphaSlider.style.left = s + "px";
	}
	updateInput() {
		if (this.colorFormat === y.HEX) this.hexContainer.hidden = !1, this.displayContainer.hidden = !0, this.hexValue.value = this.color.asString((this.color.alpha ?? 1) === 1 ? y.HEX : y.HEXA);
		else {
			this.hexContainer.hidden = !0, this.displayContainer.hidden = !1;
			let e = Ve[this.colorFormat], t = e.toValues(this.color);
			this.textLabels.textContent = e.label;
			for (let e = 0; e < this.textValues.length; ++e) j(this.textValues[e], q(K.sInS, {
				PH1: this.textLabels.textContent.charAt(e),
				PH2: this.textLabels.textContent
			})), this.textValues[e].value = String(t[e]);
		}
	}
	hideSrgbOverlay() {
		this.colorElement.contains(this.srgbOverlay) && this.colorElement.removeChild(this.srgbOverlay);
	}
	showSrgbOverlay() {
		this.contrastDetails?.expanded() || this.gamut !== "display-p3" || (this.srgbOverlay.render({
			hue: this.hsv[0],
			width: this.dragWidth,
			height: this.dragHeight
		}), this.colorElement.contains(this.srgbOverlay) || this.colorElement.appendChild(this.srgbOverlay));
	}
	updateSrgbOverlay() {
		this.gamut === "display-p3" ? this.showSrgbOverlay() : this.hideSrgbOverlay();
	}
	updateUI() {
		this.colorElement.style.backgroundColor = Y(this.gamut, [
			this.hsv[0],
			1,
			1,
			1
		]).asString(), this.contrastOverlay && this.contrastOverlay.setDimensions(this.dragWidth, this.dragHeight), this.updateSrgbOverlay(), this.swatch.setColor(this.color, this.colorString()), this.colorDragElement.style.backgroundColor = this.color.asString(y.LCH);
		let e = b.fromHSVA(this.hsv.slice(0, 3).concat(1));
		this.alphaElementBackground.style.backgroundImage = Be("linear-gradient(to right, rgba(0,0,0,0), %s)", e.asString(y.LCH)), this.hueElement.classList.toggle("display-p3", ut(this.colorFormat));
	}
	async showFormatPicker(e) {
		let t = new $e(this.color);
		this.isFormatPickerShown = !0, await t.show(e, (e) => {
			this.#i(e, void 0, void 0, e.format(), X.Other);
		}), this.isFormatPickerShown = !1;
	}
	pasted(e) {
		if (!e.clipboardData) return;
		let t = e.clipboardData.getData("text"), n = a(t);
		n && (this.#i(n, t, void 0, void 0, X.Other), e.preventDefault());
	}
	#a(e) {
		switch (this.color.channels[this.textValues.indexOf(e)]) {
			case E.R:
			case E.G:
			case E.B: return this.color instanceof S ? {
				step: .01,
				range: {
					min: 0,
					max: 1
				}
			} : {
				step: 1,
				range: {
					min: 0,
					max: 255
				}
			};
			case E.ALPHA:
			case E.X:
			case E.Y:
			case E.Z: return {
				step: .01,
				range: {
					min: 0,
					max: 1
				}
			};
			default: return;
		}
	}
	inputChanged(e) {
		let t = e.currentTarget, n = Se(t.value, e, void 0, this.#a(t));
		n && (t.value = n, t.selectionStart = 0, t.selectionEnd = n.length, e.consume(!0));
		let r = null, i;
		if (this.colorFormat === y.HEX) r = a(this.hexValue.value);
		else {
			let e = Ve[this.colorFormat], t = this.textValues.map((e) => e.value);
			if (t.length !== 4) return;
			r = e.fromValues(t);
		}
		r && this.#i(r, void 0, void 0, i, X.Input);
	}
	wasShown() {
		super.wasShown(), this.hueAlphaWidth = this.hueElement.offsetWidth, this.slideHelperWidth = this.hueSlider.offsetWidth / 2, this.dragWidth = this.colorElement.offsetWidth, this.dragHeight = this.colorElement.offsetHeight, this.colorDragElementHeight = this.colorDragElement.offsetHeight / 2, this.#i(void 0, void 0, void 0, void 0, X.Model), J ? this.colorPickerButton.setToggled(!1) : this.toggleColorPicker(!0), this.contrastDetails && this.contrastDetailsBackgroundColorPickerToggledBound && this.contrastDetails.addEventListener(Ke.BACKGROUND_COLOR_PICKER_WILL_BE_TOGGLED, this.contrastDetailsBackgroundColorPickerToggledBound);
	}
	willHide() {
		super.willHide(), this.toggleColorPicker(!1), this.contrastDetails && this.contrastDetailsBackgroundColorPickerToggledBound && this.contrastDetails.removeEventListener(Ke.BACKGROUND_COLOR_PICKER_WILL_BE_TOGGLED, this.contrastDetailsBackgroundColorPickerToggledBound);
	}
	async toggleColorPicker(e) {
		if (e === void 0 && (e = this.colorPickerButton.isToggled()), this.contrastDetails?.backgroundColorPickerEnabled() && this.contrastDetails.toggleBackgroundColorPicker(!1), !J) L.setEyeDropperActive(e), e ? L.events.addEventListener(P.EyeDropperPickedColor, this.colorPickedBound) : L.events.removeEventListener(P.EyeDropperPickedColor, this.colorPickedBound);
		else if (J && e) {
			let e = new window.EyeDropper();
			this.eyeDropperAbortController = new AbortController();
			try {
				let t = await e.open({ signal: this.eyeDropperAbortController.signal }), n = a(t.sRGBHex);
				this.#i(n ?? void 0, "", void 0, void 0, X.Other);
			} catch (e) {
				e.name !== "AbortError" && console.error(e);
			}
			this.colorPickerButton.setToggled(!1);
		} else J && !e && (this.eyeDropperAbortController?.abort(), this.eyeDropperAbortController = null);
	}
	colorPicked({ data: e }) {
		let t = [
			e.r,
			e.g,
			e.b,
			(e.a / 2.55 | 0) / 100
		], n = b.fromRGBA(t);
		this.#i(n, "", void 0, void 0, X.Other), L.bringToFront();
	}
}, X = {
	Input: "Input",
	Model: "Model",
	Other: "Other"
}, mt = /* @__PURE__ */ function(e) {
	return e.COLOR_CHANGED = "ColorChanged", e.SIZE_CHANGED = "SizeChanged", e;
}({}), Z = 24, Q = 8, ht = "Page colors", gt = class {
	callback;
	frequencyMap = /* @__PURE__ */ new Map();
	constructor(e) {
		this.callback = e;
		let t = [];
		for (let e of Te.instance().models(Oe)) for (let n of e.allStyleSheets()) t.push(this.processStylesheet(n));
		Promise.all(t).catch((e) => {
			console.error(e);
		}).then(this.finish.bind(this));
	}
	frequencyComparator(e, t) {
		return this.frequencyMap.get(t) - this.frequencyMap.get(e);
	}
	finish() {
		function e(e, t) {
			let r = n.get(e).as(y.HSL).hsva(), i = n.get(t).as(y.HSL).hsva();
			return i[1] < .12 && r[1] < .12 ? i[2] * i[3] - r[2] * r[3] : i[1] < .12 ? -1 : r[1] < .12 ? 1 : i[0] === r[0] ? i[1] * i[3] - r[1] * r[3] : (i[0] + .94) % 1 - (r[0] + .94) % 1;
		}
		let t = [...this.frequencyMap.keys()];
		t = t.sort(this.frequencyComparator.bind(this));
		let n = /* @__PURE__ */ new Map();
		for (; n.size < 24 && t.length;) {
			let e = t.shift(), r = a(e);
			r && n.set(e, r);
		}
		this.callback({
			title: ht,
			colors: [...n.keys()].sort(e),
			colorNames: [],
			mutable: !1
		});
	}
	async processStylesheet(e) {
		let t = await e.requestContentData(), n = Re.textOr(t, "").toLowerCase(), r = n.matchAll(/((?:rgb|hsl|hwb)a?\([^)]+\)|#[0-9a-f]{6}|#[0-9a-f]{3})/g);
		for (let { 0: e, index: t } of r) {
			if (n.indexOf(";", t) < 0 || n.indexOf(":", t) > -1 && n.indexOf(":", t) < n.indexOf(";", t)) continue;
			let r = 1 + (this.frequencyMap.get(e) ?? 0);
			this.frequencyMap.set(e, r);
		}
	}
}, _t = /* @__PURE__ */ new Map([
	["#F44336", [
		"#FFEBEE",
		"#FFCDD2",
		"#EF9A9A",
		"#E57373",
		"#EF5350",
		"#F44336",
		"#E53935",
		"#D32F2F",
		"#C62828",
		"#B71C1C"
	]],
	["#E91E63", [
		"#FCE4EC",
		"#F8BBD0",
		"#F48FB1",
		"#F06292",
		"#EC407A",
		"#E91E63",
		"#D81B60",
		"#C2185B",
		"#AD1457",
		"#880E4F"
	]],
	["#9C27B0", [
		"#F3E5F5",
		"#E1BEE7",
		"#CE93D8",
		"#BA68C8",
		"#AB47BC",
		"#9C27B0",
		"#8E24AA",
		"#7B1FA2",
		"#6A1B9A",
		"#4A148C"
	]],
	["#673AB7", [
		"#EDE7F6",
		"#D1C4E9",
		"#B39DDB",
		"#9575CD",
		"#7E57C2",
		"#673AB7",
		"#5E35B1",
		"#512DA8",
		"#4527A0",
		"#311B92"
	]],
	["#3F51B5", [
		"#E8EAF6",
		"#C5CAE9",
		"#9FA8DA",
		"#7986CB",
		"#5C6BC0",
		"#3F51B5",
		"#3949AB",
		"#303F9F",
		"#283593",
		"#1A237E"
	]],
	["#2196F3", [
		"#E3F2FD",
		"#BBDEFB",
		"#90CAF9",
		"#64B5F6",
		"#42A5F5",
		"#2196F3",
		"#1E88E5",
		"#1976D2",
		"#1565C0",
		"#0D47A1"
	]],
	["#03A9F4", [
		"#E1F5FE",
		"#B3E5FC",
		"#81D4FA",
		"#4FC3F7",
		"#29B6F6",
		"#03A9F4",
		"#039BE5",
		"#0288D1",
		"#0277BD",
		"#01579B"
	]],
	["#00BCD4", [
		"#E0F7FA",
		"#B2EBF2",
		"#80DEEA",
		"#4DD0E1",
		"#26C6DA",
		"#00BCD4",
		"#00ACC1",
		"#0097A7",
		"#00838F",
		"#006064"
	]],
	["#009688", [
		"#E0F2F1",
		"#B2DFDB",
		"#80CBC4",
		"#4DB6AC",
		"#26A69A",
		"#009688",
		"#00897B",
		"#00796B",
		"#00695C",
		"#004D40"
	]],
	["#4CAF50", [
		"#E8F5E9",
		"#C8E6C9",
		"#A5D6A7",
		"#81C784",
		"#66BB6A",
		"#4CAF50",
		"#43A047",
		"#388E3C",
		"#2E7D32",
		"#1B5E20"
	]],
	["#8BC34A", [
		"#F1F8E9",
		"#DCEDC8",
		"#C5E1A5",
		"#AED581",
		"#9CCC65",
		"#8BC34A",
		"#7CB342",
		"#689F38",
		"#558B2F",
		"#33691E"
	]],
	["#CDDC39", [
		"#F9FBE7",
		"#F0F4C3",
		"#E6EE9C",
		"#DCE775",
		"#D4E157",
		"#CDDC39",
		"#C0CA33",
		"#AFB42B",
		"#9E9D24",
		"#827717"
	]],
	["#FFEB3B", [
		"#FFFDE7",
		"#FFF9C4",
		"#FFF59D",
		"#FFF176",
		"#FFEE58",
		"#FFEB3B",
		"#FDD835",
		"#FBC02D",
		"#F9A825",
		"#F57F17"
	]],
	["#FFC107", [
		"#FFF8E1",
		"#FFECB3",
		"#FFE082",
		"#FFD54F",
		"#FFCA28",
		"#FFC107",
		"#FFB300",
		"#FFA000",
		"#FF8F00",
		"#FF6F00"
	]],
	["#FF9800", [
		"#FFF3E0",
		"#FFE0B2",
		"#FFCC80",
		"#FFB74D",
		"#FFA726",
		"#FF9800",
		"#FB8C00",
		"#F57C00",
		"#EF6C00",
		"#E65100"
	]],
	["#FF5722", [
		"#FBE9E7",
		"#FFCCBC",
		"#FFAB91",
		"#FF8A65",
		"#FF7043",
		"#FF5722",
		"#F4511E",
		"#E64A19",
		"#D84315",
		"#BF360C"
	]],
	["#795548", [
		"#EFEBE9",
		"#D7CCC8",
		"#BCAAA4",
		"#A1887F",
		"#8D6E63",
		"#795548",
		"#6D4C41",
		"#5D4037",
		"#4E342E",
		"#3E2723"
	]],
	["#9E9E9E", [
		"#FAFAFA",
		"#F5F5F5",
		"#EEEEEE",
		"#E0E0E0",
		"#BDBDBD",
		"#9E9E9E",
		"#757575",
		"#616161",
		"#424242",
		"#212121"
	]],
	["#607D8B", [
		"#ECEFF1",
		"#CFD8DC",
		"#B0BEC5",
		"#90A4AE",
		"#78909C",
		"#607D8B",
		"#546E7A",
		"#455A64",
		"#37474F",
		"#263238"
	]]
]), $ = {
	title: "Material",
	mutable: !1,
	matchUserFormat: !0,
	colors: [..._t.keys()],
	colorNames: []
}, vt = class {
	colorString;
	swatchInnerElement;
	swatchOverlayElement;
	swatchCopyIcon;
	constructor(e) {
		let t = e.createChild("span", "swatch");
		t.setAttribute("jslog", `${Ce("copy-color").track({ click: !0 })}`), this.swatchInnerElement = t.createChild("span", "swatch-inner"), this.swatchOverlayElement = t.createChild("span", "swatch-overlay"), z(this.swatchOverlayElement), O(this.swatchOverlayElement, !1), this.swatchOverlayElement.tabIndex = 0, self.onInvokeElement(this.swatchOverlayElement, this.onCopyText.bind(this)), this.swatchOverlayElement.addEventListener("mouseout", this.onCopyIconMouseout.bind(this)), this.swatchOverlayElement.addEventListener("blur", this.onCopyIconMouseout.bind(this)), this.swatchCopyIcon = N("copy", "copy-color-icon"), F.install(this.swatchCopyIcon, q(K.copyColorToClipboard)), this.swatchOverlayElement.appendChild(this.swatchCopyIcon), j(this.swatchOverlayElement, this.swatchCopyIcon.title);
	}
	setColor(e, t) {
		let n = e.as(y.LCH);
		this.swatchInnerElement.style.backgroundColor = n.asString(), this.swatchInnerElement.classList.toggle("swatch-inner-white", n.l > 90), this.colorString = t || null, t ? this.swatchOverlayElement.hidden = !1 : this.swatchOverlayElement.hidden = !0;
	}
	onCopyText(e) {
		this.swatchCopyIcon.name = "checkmark", L.copyText(this.colorString), O(this.swatchOverlayElement, !0), e.consume();
	}
	onCopyIconMouseout() {
		this.swatchCopyIcon.name = "copy", O(this.swatchOverlayElement, !1);
	}
};
//#endregion
export { He as i, pt as n, $e as r, mt as t };
