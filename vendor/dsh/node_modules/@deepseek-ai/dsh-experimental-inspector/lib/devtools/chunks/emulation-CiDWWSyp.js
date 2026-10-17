import { B as e, D as t, H as n, K as r, Q as i, i as a, r as o } from "./common-DMSVbaSb.js";
import { Bc as s, Jd as c, Js as l, Uc as u, cs as d, ff as f, jd as p, ls as m, md as h, nf as g, pf as _, qs as v, vi as y } from "./legacy-dM_vujv7.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/emulation/EmulatedDevices.ts
var b = {
	laptopWithTouch: "Laptop with touch",
	laptopWithHiDPIScreen: "Laptop with HiDPI screen",
	laptopWithMDPIScreen: "Laptop with MDPI screen"
}, x = r("models/emulation/EmulatedDevices.ts", b), S = e.bind(void 0, x);
function C(e) {
	return e.replace(/@url\(([^\)]*?)\)/g, (e, t) => new URL(`../../emulated_devices/${t}`, new URL("models/emulation/EmulatedDevices.js", typeof document < "u" ? document.baseURI : new URL("../../", self.location.href).href).href).toString());
}
var w = class e {
	title;
	type;
	order;
	vertical;
	horizontal;
	deviceScaleFactor;
	capabilities;
	userAgent;
	userAgentMetadata;
	modes;
	isDualScreen;
	isFoldableScreen;
	verticalSpanned;
	horizontalSpanned;
	#e;
	#t;
	constructor() {
		this.title = "", this.type = "unknown", this.vertical = {
			width: 0,
			height: 0,
			outlineInsets: null,
			outlineImage: null,
			hinge: null
		}, this.horizontal = {
			width: 0,
			height: 0,
			outlineInsets: null,
			outlineImage: null,
			hinge: null
		}, this.deviceScaleFactor = 1, this.capabilities = ["touch", "mobile"], this.userAgent = "", this.userAgentMetadata = null, this.modes = [], this.isDualScreen = !1, this.isFoldableScreen = !1, this.verticalSpanned = {
			width: 0,
			height: 0,
			outlineInsets: null,
			outlineImage: null,
			hinge: null
		}, this.horizontalSpanned = {
			width: 0,
			height: 0,
			outlineInsets: null,
			outlineImage: null,
			hinge: null
		}, this.#e = "Default", this.#t = !0;
	}
	static fromJSONV1(t) {
		try {
			function n(e, t, n, r) {
				if (typeof e != "object" || !e || !e.hasOwnProperty(t)) {
					if (r !== void 0) return r;
					throw Error("Emulated device is missing required property '" + t + "'");
				}
				let i = e[t];
				if (typeof i !== n || i === null) throw Error("Emulated device property '" + t + "' has wrong type '" + typeof i + "'");
				return i;
			}
			function r(e, t) {
				let r = n(e, t, "number");
				if (r !== Math.abs(r)) throw Error("Emulated device value '" + t + "' must be integer");
				return r;
			}
			function i(e) {
				return new V(r(e, "left"), r(e, "top"), r(e, "right"), r(e, "bottom"));
			}
			function a(e) {
				let t = {};
				if (t.r = r(e, "r"), t.r < 0 || t.r > 255) throw Error("color has wrong r value: " + t.r);
				if (t.g = r(e, "g"), t.g < 0 || t.g > 255) throw Error("color has wrong g value: " + t.g);
				if (t.b = r(e, "b"), t.b < 0 || t.b > 255) throw Error("color has wrong b value: " + t.b);
				if (t.a = n(e, "a", "number"), t.a < 0 || t.a > 1) throw Error("color has wrong a value: " + t.a);
				return t;
			}
			function o(e) {
				let t = {};
				if (t.width = r(e, "width"), t.width < 0 || t.width > 9999) throw Error("Emulated device has wrong hinge width: " + t.width);
				if (t.height = r(e, "height"), t.height < 0 || t.height > 9999) throw Error("Emulated device has wrong hinge height: " + t.height);
				if (t.x = r(e, "x"), t.x < 0 || t.x > 9999) throw Error("Emulated device has wrong x offset: " + t.height);
				if (t.y = r(e, "y"), t.x < 0 || t.x > 9999) throw Error("Emulated device has wrong y offset: " + t.height);
				return e.contentColor && (t.contentColor = a(e.contentColor)), e.outlineColor && (t.outlineColor = a(e.outlineColor)), t;
			}
			function s(e) {
				let t = {};
				if (t.width = r(e, "width"), t.width < 0 || t.width > 9999 || t.width < 50) throw Error("Emulated device has wrong width: " + t.width);
				if (t.height = r(e, "height"), t.height < 0 || t.height > 9999 || t.height < 50) throw Error("Emulated device has wrong height: " + t.height);
				let a = n(e.outline, "insets", "object", null);
				if (a) {
					if (t.outlineInsets = i(a), t.outlineInsets.left < 0 || t.outlineInsets.top < 0) throw Error("Emulated device has wrong outline insets");
					t.outlineImage = n(e.outline, "image", "string");
				}
				return e.hinge && (t.hinge = o(n(e, "hinge", "object", void 0))), t;
			}
			let c = new e();
			c.title = n(t, "title", "string");
			let l = n(t, "type", "string");
			if (!Object.values(k).includes(l)) throw Error("Emulated device has wrong type: " + l);
			c.type = l, c.order = n(t, "order", "number", 0);
			let u = n(t, "user-agent", "string");
			c.userAgent = h.patchUserAgentWithChromeVersion(u);
			let d = n(t, "user-agent-metadata", "object", null);
			c.userAgentMetadata = c.userAgent ? d : null;
			let f = n(t, "capabilities", "object", []);
			if (!Array.isArray(f)) throw Error("Emulated device capabilities must be an array");
			c.capabilities = [];
			for (let e = 0; e < f.length; ++e) {
				if (typeof f[e] != "string") throw Error("Emulated device capability must be a string");
				c.capabilities.push(f[e]);
			}
			if (c.deviceScaleFactor = n(t.screen, "device-pixel-ratio", "number"), c.deviceScaleFactor < 0 || c.deviceScaleFactor > 100) throw Error("Emulated device has wrong deviceScaleFactor: " + c.deviceScaleFactor);
			if (c.vertical = s(n(t.screen, "vertical", "object")), c.horizontal = s(n(t.screen, "horizontal", "object")), c.isDualScreen = n(t, "dual-screen", "boolean", !1), c.isFoldableScreen = n(t, "foldable-screen", "boolean", !1), (c.isDualScreen || c.isFoldableScreen) && (c.verticalSpanned = s(n(t.screen, "vertical-spanned", "object", null)), c.horizontalSpanned = s(n(t.screen, "horizontal-spanned", "object", null))), (c.isDualScreen || c.isFoldableScreen) && (!c.verticalSpanned || !c.horizontalSpanned)) throw Error("Emulated device '" + c.title + "'has dual screen without spanned orientations");
			let p = n(t, "modes", "object", [{
				title: "default",
				orientation: "vertical"
			}, {
				title: "default",
				orientation: "horizontal"
			}]);
			if (!Array.isArray(p)) throw Error("Emulated device modes must be an array");
			c.modes = [];
			for (let e = 0; e < p.length; ++e) {
				let t = {};
				if (t.title = n(p[e], "title", "string"), t.orientation = n(p[e], "orientation", "string"), t.orientation !== "vertical" && t.orientation !== "horizontal" && t.orientation !== "vertical-spanned" && t.orientation !== "horizontal-spanned") throw Error("Emulated device mode has wrong orientation '" + t.orientation + "'");
				let r = c.orientationByName(t.orientation);
				if (t.insets = i(n(p[e], "insets", "object", {
					left: 0,
					top: 0,
					right: 0,
					bottom: 0
				})), t.insets.top < 0 || t.insets.left < 0 || t.insets.right < 0 || t.insets.bottom < 0 || t.insets.top + t.insets.bottom > r.height || t.insets.left + t.insets.right > r.width) throw Error("Emulated device mode '" + t.title + "'has wrong mode insets");
				t.image = n(p[e], "image", "string", null), c.modes.push(t);
			}
			c.#t = n(t, "show-by-default", "boolean", void 0);
			let m = n(t, "show", "string", "Default");
			if (!Object.values(j).includes(m)) throw Error("Emulated device has wrong show mode: " + m);
			return c.#e = m, c;
		} catch {
			return null;
		}
	}
	static deviceComparator(e, t) {
		let n = e.order || 0, r = t.order || 0;
		return n > r ? 1 : r > n || e.title < t.title ? -1 : +(e.title > t.title);
	}
	modesForOrientation(e) {
		let t = [];
		for (let n = 0; n < this.modes.length; n++) this.modes[n].orientation === e && t.push(this.modes[n]);
		return t;
	}
	getSpanPartner(e) {
		switch (e.orientation) {
			case E: return this.modesForOrientation(O)[0];
			case T: return this.modesForOrientation(D)[0];
			case O: return this.modesForOrientation(E)[0];
			default: return this.modesForOrientation(T)[0];
		}
	}
	getRotationPartner(e) {
		switch (e.orientation) {
			case D: return this.modesForOrientation(O)[0];
			case O: return this.modesForOrientation(D)[0];
			case T: return this.modesForOrientation(E)[0];
			default: return this.modesForOrientation(T)[0];
		}
	}
	toJSON() {
		let e = {};
		e.title = this.title, e.type = this.type, e["user-agent"] = this.userAgent, e.capabilities = this.capabilities, e.screen = {
			"device-pixel-ratio": this.deviceScaleFactor,
			vertical: this.orientationToJSON(this.vertical),
			horizontal: this.orientationToJSON(this.horizontal),
			"vertical-spanned": void 0,
			"horizontal-spanned": void 0
		}, (this.isDualScreen || this.isFoldableScreen) && (e.screen["vertical-spanned"] = this.orientationToJSON(this.verticalSpanned), e.screen["horizontal-spanned"] = this.orientationToJSON(this.horizontalSpanned)), e.modes = [];
		for (let t = 0; t < this.modes.length; ++t) {
			let n = {
				title: this.modes[t].title,
				orientation: this.modes[t].orientation,
				insets: {
					left: this.modes[t].insets.left,
					top: this.modes[t].insets.top,
					right: this.modes[t].insets.right,
					bottom: this.modes[t].insets.bottom
				},
				image: this.modes[t].image || void 0
			};
			e.modes.push(n);
		}
		return e["show-by-default"] = this.#t, e["dual-screen"] = this.isDualScreen, e["foldable-screen"] = this.isFoldableScreen, e.show = this.#e, this.userAgent && this.userAgentMetadata && (e["user-agent-metadata"] = this.userAgentMetadata), e;
	}
	orientationToJSON(e) {
		let t = {};
		return t.width = e.width, t.height = e.height, e.outlineInsets && (t.outline = {
			insets: {
				left: e.outlineInsets.left,
				top: e.outlineInsets.top,
				right: e.outlineInsets.right,
				bottom: e.outlineInsets.bottom
			},
			image: e.outlineImage
		}), e.hinge && (t.hinge = {
			width: e.hinge.width,
			height: e.hinge.height,
			x: e.hinge.x,
			y: e.hinge.y
		}, e.hinge.contentColor && (t.hinge.contentColor = {
			r: e.hinge.contentColor.r,
			g: e.hinge.contentColor.g,
			b: e.hinge.contentColor.b,
			a: e.hinge.contentColor.a
		}), e.hinge.outlineColor && (t.hinge.outlineColor = {
			r: e.hinge.outlineColor.r,
			g: e.hinge.outlineColor.g,
			b: e.hinge.outlineColor.b,
			a: e.hinge.outlineColor.a
		})), t;
	}
	modeImage(e) {
		return e.image ? C(e.image) : "";
	}
	outlineImage(e) {
		let t = this.orientationByName(e.orientation);
		return t.outlineImage ? C(t.outlineImage) : "";
	}
	orientationByName(e) {
		switch (e) {
			case O: return this.verticalSpanned;
			case D: return this.horizontalSpanned;
			case E: return this.vertical;
			default: return this.horizontal;
		}
	}
	show() {
		return this.#e === "Default" ? this.#t : this.#e === "Always";
	}
	setShow(e) {
		this.#e = e ? "Always" : "Never";
	}
	copyShowFrom(e) {
		this.#e = e.#e;
	}
	touch() {
		return this.capabilities.indexOf("touch") !== -1;
	}
	mobile() {
		return this.capabilities.indexOf("mobile") !== -1;
	}
}, T = "horizontal", E = "vertical", D = "horizontal-spanned", O = "vertical-spanned", k = /* @__PURE__ */ function(e) {
	return e.Phone = "phone", e.Tablet = "tablet", e.Notebook = "notebook", e.Desktop = "desktop", e.Unknown = "unknown", e;
}(k || {}), A = /* @__PURE__ */ function(e) {
	return e.TOUCH = "touch", e.MOBILE = "mobile", e;
}({}), j = /* @__PURE__ */ function(e) {
	return e.Always = "Always", e.Default = "Default", e.Never = "Never", e;
}(j || {}), M, N = class e extends i {
	#e;
	#t;
	#n;
	#r;
	constructor() {
		super(), this.#e = a.instance().createSetting("standard-emulated-device-list", []), this.#t = /* @__PURE__ */ new Set(), this.listFromJSONV1(this.#e.get(), this.#t), this.updateStandardDevices(), this.#n = a.instance().createSetting("custom-emulated-device-list", []), this.#r = /* @__PURE__ */ new Set(), this.listFromJSONV1(this.#n.get(), this.#r) || this.saveCustomDevices();
	}
	static instance() {
		return M ||= new e(), M;
	}
	updateStandardDevices() {
		let e = /* @__PURE__ */ new Set();
		for (let t of F) {
			let n = w.fromJSONV1(t);
			n && e.add(n);
		}
		this.copyShowValues(this.#t, e), this.#t = e, this.saveStandardDevices();
	}
	listFromJSONV1(e, t) {
		if (!Array.isArray(e)) return !1;
		let n = !0;
		for (let r = 0; r < e.length; ++r) {
			let i = w.fromJSONV1(e[r]);
			i ? (t.add(i), i.modes.length || (i.modes.push({
				title: "",
				orientation: T,
				insets: new V(0, 0, 0, 0),
				image: null
			}), i.modes.push({
				title: "",
				orientation: E,
				insets: new V(0, 0, 0, 0),
				image: null
			}))) : n = !1;
		}
		return n;
	}
	static rawEmulatedDevicesForTest() {
		return F;
	}
	standard() {
		return [...this.#t];
	}
	custom() {
		return [...this.#r];
	}
	revealCustomSetting() {
		t(this.#n);
	}
	addCustomDevice(e) {
		this.#r.add(e), this.saveCustomDevices();
	}
	removeCustomDevice(e) {
		this.#r.delete(e), this.saveCustomDevices();
	}
	saveCustomDevices() {
		let e = [];
		this.#r.forEach((t) => e.push(t.toJSON())), this.#n.set(e), this.dispatchEventToListeners("CustomDevicesUpdated");
	}
	saveStandardDevices() {
		let e = [];
		this.#t.forEach((t) => e.push(t.toJSON())), this.#e.set(e), this.dispatchEventToListeners("StandardDevicesUpdated");
	}
	copyShowValues(e, t) {
		let n = /* @__PURE__ */ new Map();
		for (let t of e) n.set(t.title, t);
		for (let e of t) {
			let t = n.get(e.title);
			t && e.copyShowFrom(t);
		}
	}
}, P = /* @__PURE__ */ function(e) {
	return e.CUSTOM_DEVICES_UPDATED = "CustomDevicesUpdated", e.STANDARD_DEVICES_UPDATED = "StandardDevicesUpdated", e;
}({}), F = [
	{
		order: 10,
		"show-by-default": !0,
		title: "iPhone SE",
		screen: {
			horizontal: {
				width: 667,
				height: 375
			},
			"device-pixel-ratio": 2,
			vertical: {
				width: 375,
				height: 667
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1",
		"user-agent-metadata": {
			platform: "iOS",
			platformVersion: "18.5",
			architecture: "",
			model: "iPhone",
			mobile: !0
		},
		type: "phone"
	},
	{
		order: 12,
		"show-by-default": !0,
		title: "iPhone XR",
		screen: {
			horizontal: {
				width: 896,
				height: 414
			},
			"device-pixel-ratio": 2,
			vertical: {
				width: 414,
				height: 896
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1",
		"user-agent-metadata": {
			platform: "iOS",
			platformVersion: "18.5",
			architecture: "",
			model: "iPhone",
			mobile: !0
		},
		type: "phone"
	},
	{
		order: 14,
		"show-by-default": !0,
		title: "iPhone 12 Pro",
		screen: {
			horizontal: {
				width: 844,
				height: 390
			},
			"device-pixel-ratio": 3,
			vertical: {
				width: 390,
				height: 844
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1",
		"user-agent-metadata": {
			platform: "iOS",
			platformVersion: "18.5",
			architecture: "",
			model: "iPhone",
			mobile: !0
		},
		type: "phone"
	},
	{
		order: 15,
		"show-by-default": !0,
		title: "iPhone 14 Pro Max",
		screen: {
			horizontal: {
				width: 932,
				height: 430
			},
			"device-pixel-ratio": 3,
			vertical: {
				width: 430,
				height: 932
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1",
		"user-agent-metadata": {
			platform: "iOS",
			platformVersion: "18.5",
			architecture: "",
			model: "iPhone",
			mobile: !0
		},
		type: "phone"
	},
	{
		order: 16,
		"show-by-default": !1,
		title: "Pixel 3 XL",
		screen: {
			horizontal: {
				width: 786,
				height: 393
			},
			"device-pixel-ratio": 2.75,
			vertical: {
				width: 393,
				height: 786
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (Linux; Android 11; Pixel 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/%s Mobile Safari/537.36",
		"user-agent-metadata": {
			platform: "Android",
			platformVersion: "11",
			architecture: "",
			model: "Pixel 3",
			mobile: !0
		},
		type: "phone"
	},
	{
		order: 18,
		"show-by-default": !0,
		title: "Pixel 7",
		screen: {
			horizontal: {
				width: 915,
				height: 412
			},
			"device-pixel-ratio": 2.625,
			vertical: {
				width: 412,
				height: 915
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/%s Mobile Safari/537.36",
		"user-agent-metadata": {
			platform: "Android",
			platformVersion: "13",
			architecture: "",
			model: "Pixel 7",
			mobile: !0
		},
		type: "phone"
	},
	{
		order: 20,
		"show-by-default": !0,
		title: "Samsung Galaxy S8+",
		screen: {
			horizontal: {
				width: 740,
				height: 360
			},
			"device-pixel-ratio": 4,
			vertical: {
				width: 360,
				height: 740
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/%s Mobile Safari/537.36",
		"user-agent-metadata": {
			platform: "Android",
			platformVersion: "8.0.0",
			architecture: "",
			model: "SM-G955U",
			mobile: !0
		},
		type: "phone"
	},
	{
		order: 24,
		"show-by-default": !0,
		title: "Samsung Galaxy S20 Ultra",
		screen: {
			horizontal: {
				width: 915,
				height: 412
			},
			"device-pixel-ratio": 3.5,
			vertical: {
				width: 412,
				height: 915
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (Linux; Android 13; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/%s Mobile Safari/537.36",
		"user-agent-metadata": {
			platform: "Android",
			platformVersion: "13",
			architecture: "",
			model: "SM-G981B",
			mobile: !0
		},
		type: "phone"
	},
	{
		order: 26,
		"show-by-default": !0,
		title: "iPad Mini",
		screen: {
			horizontal: {
				width: 1024,
				height: 768
			},
			"device-pixel-ratio": 2,
			vertical: {
				width: 768,
				height: 1024
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (iPad; CPU OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1",
		"user-agent-metadata": {
			platform: "iOS",
			platformVersion: "18.5",
			architecture: "",
			model: "iPad",
			mobile: !0
		},
		type: "tablet"
	},
	{
		order: 28,
		"show-by-default": !0,
		title: "iPad Air",
		screen: {
			horizontal: {
				width: 1180,
				height: 820
			},
			"device-pixel-ratio": 2,
			vertical: {
				width: 820,
				height: 1180
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15",
		"user-agent-metadata": {
			platform: "iOS",
			platformVersion: "18.5",
			architecture: "",
			model: "iPad",
			mobile: !0
		},
		type: "tablet"
	},
	{
		order: 29,
		"show-by-default": !0,
		title: "iPad Pro",
		screen: {
			horizontal: {
				width: 1366,
				height: 1024
			},
			"device-pixel-ratio": 2,
			vertical: {
				width: 1024,
				height: 1366
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15",
		"user-agent-metadata": {
			platform: "iOS",
			platformVersion: "18.5",
			architecture: "",
			model: "iPad",
			mobile: !0
		},
		type: "tablet"
	},
	{
		order: 30,
		"show-by-default": !0,
		title: "Surface Pro 7",
		screen: {
			horizontal: {
				width: 1368,
				height: 912
			},
			"device-pixel-ratio": 2,
			vertical: {
				width: 912,
				height: 1368
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/%s Safari/537.36",
		type: "tablet"
	},
	{
		order: 32,
		"show-by-default": !0,
		"dual-screen": !0,
		title: "Surface Duo",
		screen: {
			horizontal: {
				width: 720,
				height: 540
			},
			"device-pixel-ratio": 2.5,
			vertical: {
				width: 540,
				height: 720
			},
			"vertical-spanned": {
				width: 1114,
				height: 720,
				hinge: {
					width: 34,
					height: 720,
					x: 540,
					y: 0,
					contentColor: {
						r: 38,
						g: 38,
						b: 38,
						a: 1
					}
				}
			},
			"horizontal-spanned": {
				width: 720,
				height: 1114,
				hinge: {
					width: 720,
					height: 34,
					x: 0,
					y: 540,
					contentColor: {
						r: 38,
						g: 38,
						b: 38,
						a: 1
					}
				}
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (Linux; Android 11.0; Surface Duo) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/%s Mobile Safari/537.36",
		"user-agent-metadata": {
			platform: "Android",
			platformVersion: "11.0",
			architecture: "",
			model: "Surface Duo",
			mobile: !0
		},
		type: "phone",
		modes: [
			{
				title: "default",
				orientation: "vertical",
				insets: {
					left: 0,
					top: 0,
					right: 0,
					bottom: 0
				}
			},
			{
				title: "default",
				orientation: "horizontal",
				insets: {
					left: 0,
					top: 0,
					right: 0,
					bottom: 0
				}
			},
			{
				title: "spanned",
				orientation: "vertical-spanned",
				insets: {
					left: 0,
					top: 0,
					right: 0,
					bottom: 0
				}
			},
			{
				title: "spanned",
				orientation: "horizontal-spanned",
				insets: {
					left: 0,
					top: 0,
					right: 0,
					bottom: 0
				}
			}
		]
	},
	{
		order: 34,
		"show-by-default": !0,
		"foldable-screen": !0,
		title: "Galaxy Z Fold 5",
		screen: {
			horizontal: {
				width: 882,
				height: 344
			},
			"device-pixel-ratio": 2.625,
			vertical: {
				width: 344,
				height: 882
			},
			"vertical-spanned": {
				width: 690,
				height: 829,
				hinge: {
					width: 0,
					height: 829,
					x: 345,
					y: 0,
					contentColor: {
						r: 38,
						g: 38,
						b: 38,
						a: .2
					},
					outlineColor: {
						r: 38,
						g: 38,
						b: 38,
						a: .7
					}
				}
			},
			"horizontal-spanned": {
				width: 829,
				height: 690,
				hinge: {
					width: 829,
					height: 0,
					x: 0,
					y: 345,
					contentColor: {
						r: 38,
						g: 38,
						b: 38,
						a: .2
					},
					outlineColor: {
						r: 38,
						g: 38,
						b: 38,
						a: .7
					}
				}
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/%s Mobile Safari/537.36",
		"user-agent-metadata": {
			platform: "Android",
			platformVersion: "10.0",
			architecture: "",
			model: "SM-F946U",
			mobile: !0
		},
		type: "phone",
		modes: [
			{
				title: "default",
				orientation: "vertical",
				insets: {
					left: 0,
					top: 0,
					right: 0,
					bottom: 0
				}
			},
			{
				title: "default",
				orientation: "horizontal",
				insets: {
					left: 0,
					top: 0,
					right: 0,
					bottom: 0
				}
			},
			{
				title: "spanned",
				orientation: "vertical-spanned",
				insets: {
					left: 0,
					top: 0,
					right: 0,
					bottom: 0
				}
			},
			{
				title: "spanned",
				orientation: "horizontal-spanned",
				insets: {
					left: 0,
					top: 0,
					right: 0,
					bottom: 0
				}
			}
		]
	},
	{
		order: 35,
		"show-by-default": !0,
		"foldable-screen": !0,
		title: "Asus Zenbook Fold",
		screen: {
			horizontal: {
				width: 1280,
				height: 853
			},
			"device-pixel-ratio": 1.5,
			vertical: {
				width: 853,
				height: 1280
			},
			"vertical-spanned": {
				width: 1706,
				height: 1280,
				hinge: {
					width: 107,
					height: 1280,
					x: 800,
					y: 0,
					contentColor: {
						r: 38,
						g: 38,
						b: 38,
						a: .2
					},
					outlineColor: {
						r: 38,
						g: 38,
						b: 38,
						a: .7
					}
				}
			},
			"horizontal-spanned": {
				width: 1280,
				height: 1706,
				hinge: {
					width: 1706,
					height: 107,
					x: 0,
					y: 800,
					contentColor: {
						r: 38,
						g: 38,
						b: 38,
						a: .2
					},
					outlineColor: {
						r: 38,
						g: 38,
						b: 38,
						a: .7
					}
				}
			}
		},
		capabilities: ["touch"],
		"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/%s Safari/537.36",
		"user-agent-metadata": {
			platform: "Windows",
			platformVersion: "11.0",
			architecture: "",
			model: "UX9702AA",
			mobile: !1
		},
		type: "tablet",
		modes: [
			{
				title: "default",
				orientation: "vertical",
				insets: {
					left: 0,
					top: 0,
					right: 0,
					bottom: 0
				}
			},
			{
				title: "default",
				orientation: "horizontal",
				insets: {
					left: 0,
					top: 0,
					right: 0,
					bottom: 0
				}
			},
			{
				title: "spanned",
				orientation: "vertical-spanned",
				insets: {
					left: 0,
					top: 0,
					right: 0,
					bottom: 0
				}
			},
			{
				title: "spanned",
				orientation: "horizontal-spanned",
				insets: {
					left: 0,
					top: 0,
					right: 0,
					bottom: 0
				}
			}
		]
	},
	{
		order: 36,
		"show-by-default": !0,
		title: "Samsung Galaxy A51/71",
		screen: {
			horizontal: {
				width: 914,
				height: 412
			},
			"device-pixel-ratio": 2.625,
			vertical: {
				width: 412,
				height: 914
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/%s Mobile Safari/537.36",
		"user-agent-metadata": {
			platform: "Android",
			platformVersion: "8.0.0",
			architecture: "",
			model: "SM-G955U",
			mobile: !0
		},
		type: "phone"
	},
	{
		order: 52,
		"show-by-default": !0,
		title: "Nest Hub Max",
		screen: {
			horizontal: {
				outline: {
					image: "@url(optimized/google-nest-hub-max-horizontal.avif)",
					insets: {
						left: 92,
						top: 96,
						right: 91,
						bottom: 248
					}
				},
				width: 1280,
				height: 800
			},
			"device-pixel-ratio": 2,
			vertical: {
				width: 1280,
				height: 800
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/%s Safari/537.36 CrKey/1.54.250320",
		type: "tablet",
		modes: [{
			title: "default",
			orientation: "horizontal"
		}]
	},
	{
		order: 50,
		"show-by-default": !0,
		title: "Nest Hub",
		screen: {
			horizontal: {
				outline: {
					image: "@url(optimized/google-nest-hub-horizontal.avif)",
					insets: {
						left: 82,
						top: 74,
						right: 83,
						bottom: 222
					}
				},
				width: 1024,
				height: 600
			},
			"device-pixel-ratio": 2,
			vertical: {
				width: 1024,
				height: 600
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (Linux; Android) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/%s Safari/537.36 CrKey/1.54.248666",
		"user-agent-metadata": {
			platform: "Android",
			platformVersion: "",
			architecture: "",
			model: "",
			mobile: !1
		},
		type: "tablet",
		modes: [{
			title: "default",
			orientation: "horizontal"
		}]
	},
	{
		order: 129,
		"show-by-default": !1,
		title: "iPhone 4",
		screen: {
			horizontal: {
				width: 480,
				height: 320
			},
			"device-pixel-ratio": 2,
			vertical: {
				width: 320,
				height: 480
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 7_1_2 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) Version/7.0 Mobile/11D257 Safari/9537.53",
		"user-agent-metadata": {
			platform: "iOS",
			platformVersion: "7.1.2",
			architecture: "",
			model: "iPhone",
			mobile: !0
		},
		type: "phone"
	},
	{
		order: 130,
		"show-by-default": !1,
		title: "iPhone 5/SE",
		screen: {
			horizontal: {
				outline: {
					image: "@url(optimized/iPhone5-landscape.avif)",
					insets: {
						left: 115,
						top: 25,
						right: 115,
						bottom: 28
					}
				},
				width: 568,
				height: 320
			},
			"device-pixel-ratio": 2,
			vertical: {
				outline: {
					image: "@url(optimized/iPhone5-portrait.avif)",
					insets: {
						left: 29,
						top: 105,
						right: 25,
						bottom: 111
					}
				},
				width: 320,
				height: 568
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1",
		"user-agent-metadata": {
			platform: "iOS",
			platformVersion: "10.3.1",
			architecture: "",
			model: "iPhone",
			mobile: !0
		},
		type: "phone"
	},
	{
		order: 131,
		"show-by-default": !1,
		title: "iPhone 6/7/8",
		screen: {
			horizontal: {
				outline: {
					image: "@url(optimized/iPhone6-landscape.avif)",
					insets: {
						left: 106,
						top: 28,
						right: 106,
						bottom: 28
					}
				},
				width: 667,
				height: 375
			},
			"device-pixel-ratio": 2,
			vertical: {
				outline: {
					image: "@url(optimized/iPhone6-portrait.avif)",
					insets: {
						left: 28,
						top: 105,
						right: 28,
						bottom: 105
					}
				},
				width: 375,
				height: 667
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
		"user-agent-metadata": {
			platform: "iOS",
			platformVersion: "13.2.3",
			architecture: "",
			model: "iPhone",
			mobile: !0
		},
		type: "phone"
	},
	{
		order: 132,
		"show-by-default": !1,
		title: "iPhone 6/7/8 Plus",
		screen: {
			horizontal: {
				outline: {
					image: "@url(optimized/iPhone6Plus-landscape.avif)",
					insets: {
						left: 109,
						top: 29,
						right: 109,
						bottom: 27
					}
				},
				width: 736,
				height: 414
			},
			"device-pixel-ratio": 3,
			vertical: {
				outline: {
					image: "@url(optimized/iPhone6Plus-portrait.avif)",
					insets: {
						left: 26,
						top: 107,
						right: 30,
						bottom: 111
					}
				},
				width: 414,
				height: 736
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
		"user-agent-metadata": {
			platform: "iOS",
			platformVersion: "13.2.3",
			architecture: "",
			model: "iPhone",
			mobile: !0
		},
		type: "phone"
	},
	{
		order: 133,
		"show-by-default": !1,
		title: "iPhone X",
		screen: {
			horizontal: {
				width: 812,
				height: 375
			},
			"device-pixel-ratio": 3,
			vertical: {
				width: 375,
				height: 812
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
		"user-agent-metadata": {
			platform: "iOS",
			platformVersion: "13.2.3",
			architecture: "",
			model: "iPhone",
			mobile: !0
		},
		type: "phone"
	},
	{
		"show-by-default": !1,
		title: "BlackBerry Z30",
		screen: {
			horizontal: {
				width: 640,
				height: 360
			},
			"device-pixel-ratio": 2,
			vertical: {
				width: 360,
				height: 640
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (BB10; Touch) AppleWebKit/537.10+ (KHTML, like Gecko) Version/10.0.9.2372 Mobile Safari/537.10+",
		type: "phone"
	},
	{
		"show-by-default": !1,
		title: "Nexus 4",
		screen: {
			horizontal: {
				width: 640,
				height: 384
			},
			"device-pixel-ratio": 2,
			vertical: {
				width: 384,
				height: 640
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (Linux; Android 4.4.2; Nexus 4 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/%s Mobile Safari/537.36",
		"user-agent-metadata": {
			platform: "Android",
			platformVersion: "4.4.2",
			architecture: "",
			model: "Nexus 4",
			mobile: !0
		},
		type: "phone"
	},
	{
		title: "Nexus 5",
		type: "phone",
		"user-agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/%s Mobile Safari/537.36",
		"user-agent-metadata": {
			platform: "Android",
			platformVersion: "6.0",
			architecture: "",
			model: "Nexus 5",
			mobile: !0
		},
		capabilities: ["touch", "mobile"],
		"show-by-default": !1,
		screen: {
			"device-pixel-ratio": 3,
			vertical: {
				width: 360,
				height: 640
			},
			horizontal: {
				width: 640,
				height: 360
			}
		},
		modes: [
			{
				title: "default",
				orientation: "vertical",
				insets: {
					left: 0,
					top: 25,
					right: 0,
					bottom: 48
				},
				image: "@url(optimized/google-nexus-5-vertical-default-1x.avif) 1x, @url(optimized/google-nexus-5-vertical-default-2x.avif) 2x"
			},
			{
				title: "navigation bar",
				orientation: "vertical",
				insets: {
					left: 0,
					top: 80,
					right: 0,
					bottom: 48
				},
				image: "@url(optimized/google-nexus-5-vertical-navigation-1x.avif) 1x, @url(optimized/google-nexus-5-vertical-navigation-2x.avif) 2x"
			},
			{
				title: "keyboard",
				orientation: "vertical",
				insets: {
					left: 0,
					top: 80,
					right: 0,
					bottom: 312
				},
				image: "@url(optimized/google-nexus-5-vertical-keyboard-1x.avif) 1x, @url(optimized/google-nexus-5-vertical-keyboard-2x.avif) 2x"
			},
			{
				title: "default",
				orientation: "horizontal",
				insets: {
					left: 0,
					top: 25,
					right: 42,
					bottom: 0
				},
				image: "@url(optimized/google-nexus-5-horizontal-default-1x.avif) 1x, @url(optimized/google-nexus-5-horizontal-default-2x.avif) 2x"
			},
			{
				title: "navigation bar",
				orientation: "horizontal",
				insets: {
					left: 0,
					top: 80,
					right: 42,
					bottom: 0
				},
				image: "@url(optimized/google-nexus-5-horizontal-navigation-1x.avif) 1x, @url(optimized/google-nexus-5-horizontal-navigation-2x.avif) 2x"
			},
			{
				title: "keyboard",
				orientation: "horizontal",
				insets: {
					left: 0,
					top: 80,
					right: 42,
					bottom: 202
				},
				image: "@url(optimized/google-nexus-5-horizontal-keyboard-1x.avif) 1x, @url(optimized/google-nexus-5-horizontal-keyboard-2x.avif) 2x"
			}
		]
	},
	{
		title: "Nexus 5X",
		type: "phone",
		"user-agent": "Mozilla/5.0 (Linux; Android 8.0.0; Nexus 5X Build/OPR4.170623.006) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/%s Mobile Safari/537.36",
		"user-agent-metadata": {
			platform: "Android",
			platformVersion: "8.0.0",
			architecture: "",
			model: "Nexus 5X",
			mobile: !0
		},
		capabilities: ["touch", "mobile"],
		"show-by-default": !1,
		screen: {
			"device-pixel-ratio": 2.625,
			vertical: {
				outline: {
					image: "@url(optimized/Nexus5X-portrait.avif)",
					insets: {
						left: 18,
						top: 88,
						right: 22,
						bottom: 98
					}
				},
				width: 412,
				height: 732
			},
			horizontal: {
				outline: {
					image: "@url(optimized/Nexus5X-landscape.avif)",
					insets: {
						left: 88,
						top: 21,
						right: 98,
						bottom: 19
					}
				},
				width: 732,
				height: 412
			}
		},
		modes: [
			{
				title: "default",
				orientation: "vertical",
				insets: {
					left: 0,
					top: 24,
					right: 0,
					bottom: 48
				},
				image: "@url(optimized/google-nexus-5x-vertical-default-1x.avif) 1x, @url(optimized/google-nexus-5x-vertical-default-2x.avif) 2x"
			},
			{
				title: "navigation bar",
				orientation: "vertical",
				insets: {
					left: 0,
					top: 80,
					right: 0,
					bottom: 48
				},
				image: "@url(optimized/google-nexus-5x-vertical-navigation-1x.avif) 1x, @url(optimized/google-nexus-5x-vertical-navigation-2x.avif) 2x"
			},
			{
				title: "keyboard",
				orientation: "vertical",
				insets: {
					left: 0,
					top: 80,
					right: 0,
					bottom: 342
				},
				image: "@url(optimized/google-nexus-5x-vertical-keyboard-1x.avif) 1x, @url(optimized/google-nexus-5x-vertical-keyboard-2x.avif) 2x"
			},
			{
				title: "default",
				orientation: "horizontal",
				insets: {
					left: 0,
					top: 24,
					right: 48,
					bottom: 0
				},
				image: "@url(optimized/google-nexus-5x-horizontal-default-1x.avif) 1x, @url(optimized/google-nexus-5x-horizontal-default-2x.avif) 2x"
			},
			{
				title: "navigation bar",
				orientation: "horizontal",
				insets: {
					left: 0,
					top: 80,
					right: 48,
					bottom: 0
				},
				image: "@url(optimized/google-nexus-5x-horizontal-navigation-1x.avif) 1x, @url(optimized/google-nexus-5x-horizontal-navigation-2x.avif) 2x"
			},
			{
				title: "keyboard",
				orientation: "horizontal",
				insets: {
					left: 0,
					top: 80,
					right: 48,
					bottom: 222
				},
				image: "@url(optimized/google-nexus-5x-horizontal-keyboard-1x.avif) 1x, @url(optimized/google-nexus-5x-horizontal-keyboard-2x.avif) 2x"
			}
		]
	},
	{
		"show-by-default": !1,
		title: "Nexus 6",
		screen: {
			horizontal: {
				width: 732,
				height: 412
			},
			"device-pixel-ratio": 3.5,
			vertical: {
				width: 412,
				height: 732
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (Linux; Android 7.1.1; Nexus 6 Build/N6F26U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/%s Mobile Safari/537.36",
		"user-agent-metadata": {
			platform: "Android",
			platformVersion: "7.1.1",
			architecture: "",
			model: "Nexus 6",
			mobile: !0
		},
		type: "phone"
	},
	{
		"show-by-default": !1,
		title: "Nexus 6P",
		screen: {
			horizontal: {
				outline: {
					image: "@url(optimized/Nexus6P-landscape.avif)",
					insets: {
						left: 94,
						top: 17,
						right: 88,
						bottom: 17
					}
				},
				width: 732,
				height: 412
			},
			"device-pixel-ratio": 3.5,
			vertical: {
				outline: {
					image: "@url(optimized/Nexus6P-portrait.avif)",
					insets: {
						left: 16,
						top: 94,
						right: 16,
						bottom: 88
					}
				},
				width: 412,
				height: 732
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (Linux; Android 8.0.0; Nexus 6P Build/OPP3.170518.006) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/%s Mobile Safari/537.36",
		"user-agent-metadata": {
			platform: "Android",
			platformVersion: "8.0.0",
			architecture: "",
			model: "Nexus 6P",
			mobile: !0
		},
		type: "phone"
	},
	{
		order: 120,
		"show-by-default": !1,
		title: "Pixel 2",
		screen: {
			horizontal: {
				width: 731,
				height: 411
			},
			"device-pixel-ratio": 2.625,
			vertical: {
				width: 411,
				height: 731
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/%s Mobile Safari/537.36",
		"user-agent-metadata": {
			platform: "Android",
			platformVersion: "8.0",
			architecture: "",
			model: "Pixel 2",
			mobile: !0
		},
		type: "phone"
	},
	{
		order: 121,
		"show-by-default": !1,
		title: "Pixel 2 XL",
		screen: {
			horizontal: {
				width: 823,
				height: 411
			},
			"device-pixel-ratio": 3.5,
			vertical: {
				width: 411,
				height: 823
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD1.170816.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/%s Mobile Safari/537.36",
		"user-agent-metadata": {
			platform: "Android",
			platformVersion: "8.0.0",
			architecture: "",
			model: "Pixel 2 XL",
			mobile: !0
		},
		type: "phone"
	},
	{
		"show-by-default": !1,
		title: "Pixel 3",
		screen: {
			horizontal: {
				width: 786,
				height: 393
			},
			"device-pixel-ratio": 2.75,
			vertical: {
				width: 393,
				height: 786
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (Linux; Android 9; Pixel 3 Build/PQ1A.181105.017.A1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/%s Mobile Safari/537.36",
		"user-agent-metadata": {
			platform: "Android",
			platformVersion: "9",
			architecture: "",
			model: "Pixel 3",
			mobile: !0
		},
		type: "phone"
	},
	{
		"show-by-default": !1,
		title: "Pixel 4",
		screen: {
			horizontal: {
				width: 745,
				height: 353
			},
			"device-pixel-ratio": 3,
			vertical: {
				width: 353,
				height: 745
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (Linux; Android 10; Pixel 4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/%s Mobile Safari/537.36",
		"user-agent-metadata": {
			platform: "Android",
			platformVersion: "10",
			architecture: "",
			model: "Pixel 4",
			mobile: !0
		},
		type: "phone"
	},
	{
		"show-by-default": !1,
		title: "LG Optimus L70",
		screen: {
			horizontal: {
				width: 640,
				height: 384
			},
			"device-pixel-ratio": 1.25,
			vertical: {
				width: 384,
				height: 640
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (Linux; U; Android 4.4.2; en-us; LGMS323 Build/KOT49I.MS32310c) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/%s Mobile Safari/537.36",
		"user-agent-metadata": {
			platform: "Android",
			platformVersion: "4.4.2",
			architecture: "",
			model: "LGMS323",
			mobile: !0
		},
		type: "phone"
	},
	{
		"show-by-default": !1,
		title: "Nokia N9",
		screen: {
			horizontal: {
				width: 854,
				height: 480
			},
			"device-pixel-ratio": 1,
			vertical: {
				width: 480,
				height: 854
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (MeeGo; NokiaN9) AppleWebKit/534.13 (KHTML, like Gecko) NokiaBrowser/8.5.0 Mobile Safari/534.13",
		type: "phone"
	},
	{
		"show-by-default": !1,
		title: "Nokia Lumia 520",
		screen: {
			horizontal: {
				width: 533,
				height: 320
			},
			"device-pixel-ratio": 1.5,
			vertical: {
				width: 320,
				height: 533
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 520)",
		type: "phone"
	},
	{
		"show-by-default": !1,
		title: "Microsoft Lumia 550",
		screen: {
			horizontal: {
				width: 640,
				height: 360
			},
			"device-pixel-ratio": 2,
			vertical: {
				width: 640,
				height: 360
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; Lumia 550) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/%s Mobile Safari/537.36 Edge/14.14263",
		"user-agent-metadata": {
			platform: "Android",
			platformVersion: "4.2.1",
			architecture: "",
			model: "Lumia 550",
			mobile: !0
		},
		type: "phone"
	},
	{
		"show-by-default": !1,
		title: "Microsoft Lumia 950",
		screen: {
			horizontal: {
				width: 640,
				height: 360
			},
			"device-pixel-ratio": 4,
			vertical: {
				width: 360,
				height: 640
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; Lumia 950) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/%s Mobile Safari/537.36 Edge/14.14263",
		"user-agent-metadata": {
			platform: "Android",
			platformVersion: "4.2.1",
			architecture: "",
			model: "Lumia 950",
			mobile: !0
		},
		type: "phone"
	},
	{
		"show-by-default": !1,
		title: "Galaxy S III",
		screen: {
			horizontal: {
				width: 640,
				height: 360
			},
			"device-pixel-ratio": 2,
			vertical: {
				width: 360,
				height: 640
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (Linux; U; Android 4.0; en-us; GT-I9300 Build/IMM76D) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30",
		"user-agent-metadata": {
			platform: "Android",
			platformVersion: "4.0",
			architecture: "",
			model: "GT-I9300",
			mobile: !0
		},
		type: "phone"
	},
	{
		order: 110,
		"show-by-default": !1,
		title: "Galaxy S5",
		screen: {
			horizontal: {
				width: 640,
				height: 360
			},
			"device-pixel-ratio": 3,
			vertical: {
				width: 360,
				height: 640
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/%s Mobile Safari/537.36",
		"user-agent-metadata": {
			platform: "Android",
			platformVersion: "5.0",
			architecture: "",
			model: "SM-G900P",
			mobile: !0
		},
		type: "phone"
	},
	{
		"show-by-default": !1,
		title: "Galaxy S8",
		screen: {
			horizontal: {
				width: 740,
				height: 360
			},
			"device-pixel-ratio": 3,
			vertical: {
				width: 360,
				height: 740
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (Linux; Android 7.0; SM-G950U Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/%s Mobile Safari/537.36",
		"user-agent-metadata": {
			platform: "Android",
			platformVersion: "7.0",
			architecture: "",
			model: "SM-G950U",
			mobile: !0
		},
		type: "phone"
	},
	{
		"show-by-default": !1,
		title: "Galaxy S9+",
		screen: {
			horizontal: {
				width: 658,
				height: 320
			},
			"device-pixel-ratio": 4.5,
			vertical: {
				width: 320,
				height: 658
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (Linux; Android 8.0.0; SM-G965U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/%s Mobile Safari/537.36",
		"user-agent-metadata": {
			platform: "Android",
			platformVersion: "8.0.0",
			architecture: "",
			model: "SM-G965U",
			mobile: !0
		},
		type: "phone"
	},
	{
		"show-by-default": !1,
		title: "Galaxy Tab S4",
		screen: {
			horizontal: {
				width: 1138,
				height: 712
			},
			"device-pixel-ratio": 2.25,
			vertical: {
				width: 712,
				height: 1138
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; SM-T837A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/%s Safari/537.36",
		"user-agent-metadata": {
			platform: "Android",
			platformVersion: "8.1.0",
			architecture: "",
			model: "SM-T837A",
			mobile: !1
		},
		type: "phone"
	},
	{
		order: 1,
		"show-by-default": !1,
		title: "JioPhone 2",
		screen: {
			horizontal: {
				width: 320,
				height: 240
			},
			"device-pixel-ratio": 1,
			vertical: {
				width: 240,
				height: 320
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (Mobile; LYF/F300B/LYF-F300B-001-01-15-130718-i;Android; rv:48.0) Gecko/48.0 Firefox/48.0 KAIOS/2.5",
		"user-agent-metadata": {
			platform: "Android",
			platformVersion: "",
			architecture: "",
			model: "LYF/F300B/LYF-F300B-001-01-15-130718-i",
			mobile: !0
		},
		type: "phone"
	},
	{
		"show-by-default": !1,
		title: "Kindle Fire HDX",
		screen: {
			horizontal: {
				width: 1280,
				height: 800
			},
			"device-pixel-ratio": 2,
			vertical: {
				width: 800,
				height: 1280
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (Linux; U; en-us; KFAPWI Build/JDQ39) AppleWebKit/535.19 (KHTML, like Gecko) Silk/3.13 Safari/535.19 Silk-Accelerated=true",
		type: "tablet"
	},
	{
		order: 140,
		"show-by-default": !1,
		title: "iPad",
		screen: {
			horizontal: {
				outline: {
					image: "@url(optimized/iPad-landscape.avif)",
					insets: {
						left: 112,
						top: 56,
						right: 116,
						bottom: 52
					}
				},
				width: 1024,
				height: 768
			},
			"device-pixel-ratio": 2,
			vertical: {
				outline: {
					image: "@url(optimized/iPad-portrait.avif)",
					insets: {
						left: 52,
						top: 114,
						right: 55,
						bottom: 114
					}
				},
				width: 768,
				height: 1024
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1",
		"user-agent-metadata": {
			platform: "iOS",
			platformVersion: "11.0",
			architecture: "",
			model: "iPad",
			mobile: !0
		},
		type: "tablet"
	},
	{
		order: 141,
		"show-by-default": !1,
		title: "iPad Pro",
		screen: {
			horizontal: {
				width: 1366,
				height: 1024
			},
			"device-pixel-ratio": 2,
			vertical: {
				width: 1024,
				height: 1366
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1",
		"user-agent-metadata": {
			platform: "iOS",
			platformVersion: "11.0",
			architecture: "",
			model: "iPad",
			mobile: !0
		},
		type: "tablet"
	},
	{
		"show-by-default": !1,
		title: "Blackberry PlayBook",
		screen: {
			horizontal: {
				width: 1024,
				height: 600
			},
			"device-pixel-ratio": 1,
			vertical: {
				width: 600,
				height: 1024
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (PlayBook; U; RIM Tablet OS 2.1.0; en-US) AppleWebKit/536.2+ (KHTML like Gecko) Version/7.2.1.0 Safari/536.2+",
		type: "tablet"
	},
	{
		"show-by-default": !1,
		title: "Nexus 10",
		screen: {
			horizontal: {
				width: 1280,
				height: 800
			},
			"device-pixel-ratio": 2,
			vertical: {
				width: 800,
				height: 1280
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 10 Build/MOB31T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/%s Safari/537.36",
		"user-agent-metadata": {
			platform: "Android",
			platformVersion: "6.0.1",
			architecture: "",
			model: "Nexus 10",
			mobile: !1
		},
		type: "tablet"
	},
	{
		"show-by-default": !1,
		title: "Nexus 7",
		screen: {
			horizontal: {
				width: 960,
				height: 600
			},
			"device-pixel-ratio": 2,
			vertical: {
				width: 600,
				height: 960
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 7 Build/MOB30X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/%s Safari/537.36",
		"user-agent-metadata": {
			platform: "Android",
			platformVersion: "6.0.1",
			architecture: "",
			model: "Nexus 7",
			mobile: !1
		},
		type: "tablet"
	},
	{
		"show-by-default": !1,
		title: "Galaxy Note 3",
		screen: {
			horizontal: {
				width: 640,
				height: 360
			},
			"device-pixel-ratio": 3,
			vertical: {
				width: 360,
				height: 640
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (Linux; U; Android 4.3; en-us; SM-N900T Build/JSS15J) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30",
		"user-agent-metadata": {
			platform: "Android",
			platformVersion: "4.3",
			architecture: "",
			model: "SM-N900T",
			mobile: !0
		},
		type: "phone"
	},
	{
		"show-by-default": !1,
		title: "Galaxy Note II",
		screen: {
			horizontal: {
				width: 640,
				height: 360
			},
			"device-pixel-ratio": 2,
			vertical: {
				width: 360,
				height: 640
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (Linux; U; Android 4.1; en-us; GT-N7100 Build/JRO03C) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30",
		"user-agent-metadata": {
			platform: "Android",
			platformVersion: "4.1",
			architecture: "",
			model: "GT-N7100",
			mobile: !0
		},
		type: "phone"
	},
	{
		"show-by-default": !1,
		title: S(b.laptopWithTouch),
		screen: {
			horizontal: {
				width: 1280,
				height: 950
			},
			"device-pixel-ratio": 1,
			vertical: {
				width: 950,
				height: 1280
			}
		},
		capabilities: ["touch"],
		"user-agent": "",
		type: "notebook",
		modes: [{
			title: "default",
			orientation: "horizontal"
		}]
	},
	{
		"show-by-default": !1,
		title: S(b.laptopWithHiDPIScreen),
		screen: {
			horizontal: {
				width: 1440,
				height: 900
			},
			"device-pixel-ratio": 2,
			vertical: {
				width: 900,
				height: 1440
			}
		},
		capabilities: [],
		"user-agent": "",
		type: "notebook",
		modes: [{
			title: "default",
			orientation: "horizontal"
		}]
	},
	{
		"show-by-default": !1,
		title: S(b.laptopWithMDPIScreen),
		screen: {
			horizontal: {
				width: 1280,
				height: 800
			},
			"device-pixel-ratio": 1,
			vertical: {
				width: 800,
				height: 1280
			}
		},
		capabilities: [],
		"user-agent": "",
		type: "notebook",
		modes: [{
			title: "default",
			orientation: "horizontal"
		}]
	},
	{
		"show-by-default": !1,
		title: "Moto G4",
		screen: {
			horizontal: {
				outline: {
					image: "@url(optimized/MotoG4-landscape.avif)",
					insets: {
						left: 91,
						top: 30,
						right: 74,
						bottom: 30
					}
				},
				width: 640,
				height: 360
			},
			"device-pixel-ratio": 3,
			vertical: {
				outline: {
					image: "@url(optimized/MotoG4-portrait.avif)",
					insets: {
						left: 30,
						top: 91,
						right: 30,
						bottom: 74
					}
				},
				width: 360,
				height: 640
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (Linux; Android 6.0.1; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/%s Mobile Safari/537.36",
		"user-agent-metadata": {
			platform: "Android",
			platformVersion: "6.0.1",
			architecture: "",
			model: "Moto G (4)",
			mobile: !0
		},
		type: "phone"
	},
	{
		"show-by-default": !1,
		title: "Moto G Power",
		screen: {
			"device-pixel-ratio": 1.75,
			horizontal: {
				width: 823,
				height: 412
			},
			vertical: {
				width: 412,
				height: 823
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/%s Mobile Safari/537.36",
		"user-agent-metadata": {
			platform: "Android",
			platformVersion: "11",
			architecture: "",
			model: "moto g power (2022)",
			mobile: !0
		},
		type: "phone"
	},
	{
		order: 200,
		"show-by-default": !1,
		title: "Facebook on Android",
		screen: {
			horizontal: {
				width: 892,
				height: 412
			},
			"device-pixel-ratio": 3.5,
			vertical: {
				width: 412,
				height: 892
			}
		},
		capabilities: ["touch", "mobile"],
		"user-agent": "Mozilla/5.0 (Linux; Android 12; Pixel 6 Build/SQ3A.220705.004; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/%s Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/407.0.0.0.65;]",
		"user-agent-metadata": {
			platform: "Android",
			platformVersion: "12",
			architecture: "",
			model: "Pixel 6",
			mobile: !0
		},
		type: "phone"
	}
], I = {
	widthCannotBeEmpty: "Width cannot be empty.",
	widthMustBeANumber: "Width must be a number.",
	widthMustBeLessThanOrEqualToS: "Width must be less than or equal to {PH1}.",
	widthMustBeGreaterThanOrEqualToS: "Width must be greater than or equal to {PH1}.",
	heightCannotBeEmpty: "Height cannot be empty.",
	heightMustBeANumber: "Height must be a number.",
	heightMustBeLessThanOrEqualToS: "Height must be less than or equal to {PH1}.",
	heightMustBeGreaterThanOrEqualTo: "Height must be greater than or equal to {PH1}.",
	devicePixelRatioMustBeANumberOr: "Device pixel ratio must be a number or blank.",
	devicePixelRatioMustBeLessThanOr: "Device pixel ratio must be less than or equal to {PH1}.",
	devicePixelRatioMustBeGreater: "Device pixel ratio must be greater than or equal to {PH1}."
}, L = r("models/emulation/DeviceModeModel.ts", I), R = n.bind(void 0, L), z, B = class e extends i {
	#e;
	#t;
	#n;
	#r;
	#i;
	#a;
	#o;
	#s;
	#c;
	#l;
	#u;
	#d;
	#f;
	#p;
	#m;
	#h;
	#g;
	#_;
	#v;
	#y;
	#b;
	#x;
	#S;
	#C;
	#w;
	#T;
	constructor() {
		super(), this.#e = new H(0, 0, 1, 1), this.#t = new H(0, 0, 1, 1), this.#n = new y(1, 1), this.#r = new y(1, 1), this.#i = !1, this.#a = new y(1, 1), this.#o = globalThis.devicePixelRatio, this.#s = "Desktop", this.#c = a.instance().createSetting("emulation.device-scale", 1), this.#c.get() || this.#c.set(1), this.#c.addChangeListener(this.scaleSettingChanged, this), this.#l = 1, this.#u = a.instance().createSetting("emulation.device-width", 400), this.#u.get() < 50 && this.#u.set(50), this.#u.get() > 9999 && this.#u.set(K), this.#u.addChangeListener(this.widthSettingChanged, this), this.#d = a.instance().createSetting("emulation.device-height", 0), this.#d.get() && this.#d.get() < 50 && this.#d.set(50), this.#d.get() > 9999 && this.#d.set(K), this.#d.addChangeListener(this.heightSettingChanged, this), this.#f = a.instance().createSetting("emulation.device-ua", "Mobile"), this.#f.addChangeListener(this.uaSettingChanged, this), this.#p = a.instance().createSetting("emulation.device-scale-factor", 0), this.#p.addChangeListener(this.deviceScaleFactorSettingChanged, this), this.#m = a.instance().moduleSetting("emulation.show-device-outline"), this.#m.addChangeListener(this.deviceOutlineSettingChanged, this), this.#h = a.instance().createSetting("emulation.toolbar-controls-enabled", !0, o.SESSION), this.#g = "None", this.#_ = null, this.#v = null, this.#y = 1, this.#b = !1, this.#x = !1, this.#S = null, this.#C = null, this.#T = !1, p.instance().observeModels(v, this);
	}
	static instance(t) {
		return (!z || t?.forceNew) && (z = new e()), z;
	}
	static tryInstance(e) {
		try {
			return this.instance(e);
		} catch {
			return null;
		}
	}
	dispose() {
		p.instance().unobserveModels(v, this);
	}
	static widthValidator(e) {
		let t = !1, n;
		return e ? /^[\d]+$/.test(e) ? Number(e) > 9999 ? n = R(I.widthMustBeLessThanOrEqualToS, { PH1: K }) : Number(e) < 50 ? n = R(I.widthMustBeGreaterThanOrEqualToS, { PH1: 50 }) : t = !0 : n = R(I.widthMustBeANumber) : n = R(I.widthCannotBeEmpty), {
			valid: t,
			errorMessage: n
		};
	}
	static heightValidator(e) {
		let t = !1, n;
		return e ? /^[\d]+$/.test(e) ? Number(e) > 9999 ? n = R(I.heightMustBeLessThanOrEqualToS, { PH1: K }) : Number(e) < 50 ? n = R(I.heightMustBeGreaterThanOrEqualTo, { PH1: 50 }) : t = !0 : n = R(I.heightMustBeANumber) : n = R(I.heightCannotBeEmpty), {
			valid: t,
			errorMessage: n
		};
	}
	static scaleValidator(e) {
		let t = !1, n, r = Number(e.trim());
		return e ? Number.isNaN(r) ? n = R(I.devicePixelRatioMustBeANumberOr) : Number(e) > 10 ? n = R(I.devicePixelRatioMustBeLessThanOr, { PH1: 10 }) : Number(e) < 0 ? n = R(I.devicePixelRatioMustBeGreater, { PH1: 0 }) : t = !0 : t = !0, {
			valid: t,
			errorMessage: n
		};
	}
	get scaleSettingInternal() {
		return this.#c;
	}
	setAvailableSize(e, t) {
		this.#n = e, this.#r = t, this.#i = !0, this.calculateAndEmulate(!1);
	}
	emulate(e, t, n, r) {
		let i = this.#g !== e || this.#_ !== t || this.#v !== n;
		if (this.#g = e, e === "Device" && t && n) {
			if (console.assert(!!t && !!n, "Must pass device and mode for device emulation"), this.#v = n, this.#_ = t, this.#i) {
				let e = t.orientationByName(n.orientation);
				this.#c.set(r || this.calculateFitScale(e.width, e.height, this.currentOutline(), this.currentInsets()));
			}
		} else this.#_ = null, this.#v = null;
		e !== "None" && f.actionTaken(_.DeviceModeEnabled), this.calculateAndEmulate(i);
	}
	setWidth(e) {
		let t = Math.min(K, this.preferredScaledWidth());
		e = Math.max(Math.min(e, t), 1), this.#u.set(e);
	}
	setWidthAndScaleToFit(e) {
		e = Math.max(Math.min(e, K), 1), this.#c.set(this.calculateFitScale(e, this.#d.get())), this.#u.set(e);
	}
	setHeight(e) {
		let t = Math.min(K, this.preferredScaledHeight());
		e = Math.max(Math.min(e, t), 0), e === this.preferredScaledHeight() && (e = 0), this.#d.set(e);
	}
	setHeightAndScaleToFit(e) {
		e = Math.max(Math.min(e, K), 0), this.#c.set(this.calculateFitScale(this.#u.get(), e)), this.#d.set(e);
	}
	setScale(e) {
		this.#c.set(e);
	}
	device() {
		return this.#_;
	}
	mode() {
		return this.#v;
	}
	type() {
		return this.#g;
	}
	screenImage() {
		return this.#_ && this.#v ? this.#_.modeImage(this.#v) : "";
	}
	outlineImage() {
		return this.#_ && this.#v && this.#m.get() ? this.#_.outlineImage(this.#v) : "";
	}
	outlineRect() {
		return this.#w || null;
	}
	screenRect() {
		return this.#e;
	}
	visiblePageRect() {
		return this.#t;
	}
	scale() {
		return this.#l;
	}
	fitScale() {
		return this.#y;
	}
	appliedDeviceSize() {
		return this.#a;
	}
	appliedDeviceScaleFactor() {
		return this.#o;
	}
	appliedUserAgentType() {
		return this.#s;
	}
	isFullHeight() {
		return !this.#d.get();
	}
	isMobile() {
		switch (this.#g) {
			case "Device": return this.#_ ? this.#_.mobile() : !1;
			case "None": return !1;
			case "Responsive": return this.#f.get() === "Mobile" || this.#f.get() === "Mobile (no touch)";
		}
		return !1;
	}
	enabledSetting() {
		return a.instance().createSetting("emulation.show-device-mode", !1);
	}
	scaleSetting() {
		return this.#c;
	}
	uaSetting() {
		return this.#f;
	}
	deviceScaleFactorSetting() {
		return this.#p;
	}
	deviceOutlineSetting() {
		return this.#m;
	}
	toolbarControlsEnabledSetting() {
		return this.#h;
	}
	reset() {
		this.#p.set(0), this.#c.set(1), this.setWidth(400), this.setHeight(0), this.#f.set("Mobile");
	}
	modelAdded(e) {
		if (e.target() === p.instance().primaryPageTarget() && e.supportsDeviceEmulation()) {
			if (this.#S = e, this.#C) {
				let e = this.#C;
				this.#C = null, e();
			}
			e.addEventListener(l.SCREEN_ORIENTATION_LOCK_CHANGED, this.onScreenOrientationLockChanged, this);
			let t = e.target().model(u);
			t && (t.addEventListener(s.FrameResized, this.onFrameChange, this), t.addEventListener(s.FrameNavigated, this.onFrameChange, this));
		} else e.emulateTouch(this.#b, this.#x);
	}
	modelRemoved(e) {
		this.#S === e && (e.removeEventListener(l.SCREEN_ORIENTATION_LOCK_CHANGED, this.onScreenOrientationLockChanged, this), this.#S = null, this.#T = !1, this.dispatchEventToListeners("Updated"));
	}
	inspectedURL() {
		return this.#S ? this.#S.target().inspectedURL() : null;
	}
	onFrameChange() {
		let e = this.#S ? this.#S.overlayModel() : null;
		e && this.showHingeIfApplicable(e);
	}
	onScreenOrientationLockChanged(e) {
		this.#T = e.data.locked, e.data.locked && e.data.orientation && this.applyOrientationLock(e.data.orientation), this.dispatchEventToListeners("Updated");
	}
	applyOrientationLock(e) {
		let t = e.type === c.ScreenOrientationType.LandscapePrimary || e.type === c.ScreenOrientationType.LandscapeSecondary;
		if (this.#g === "Device" && this.#_ && this.#v) {
			if (t !== (this.#v.orientation === "horizontal" || this.#v.orientation === "horizontal-spanned")) {
				let e = this.#_.getRotationPartner(this.#v);
				e && this.emulate(this.#g, this.#_, e);
			}
		} else if (this.#g === "Responsive") {
			let e = this.appliedDeviceSize();
			t !== e.width > e.height && this.setSizeAndScaleToFit(e.height, e.width);
		}
	}
	isScreenOrientationLocked() {
		return this.#T;
	}
	scaleSettingChanged() {
		this.calculateAndEmulate(!1);
	}
	widthSettingChanged() {
		this.calculateAndEmulate(!1);
	}
	heightSettingChanged() {
		this.calculateAndEmulate(!1);
	}
	uaSettingChanged() {
		this.calculateAndEmulate(!0);
	}
	deviceScaleFactorSettingChanged() {
		this.calculateAndEmulate(!1);
	}
	deviceOutlineSettingChanged() {
		this.calculateAndEmulate(!1);
	}
	preferredScaledWidth() {
		return Math.floor(this.#r.width / (this.#c.get() || 1));
	}
	preferredScaledHeight() {
		return Math.floor(this.#r.height / (this.#c.get() || 1));
	}
	currentOutline() {
		let e = new V(0, 0, 0, 0);
		if (this.#g !== "Device" || !this.#_ || !this.#v) return e;
		let t = this.#_.orientationByName(this.#v.orientation);
		return this.#m.get() && (e = t.outlineInsets || e), e;
	}
	currentInsets() {
		return this.#g !== "Device" || !this.#v ? new V(0, 0, 0, 0) : this.#v.insets;
	}
	getScreenOrientationType() {
		if (!this.#v) throw Error("Mode required to get orientation type.");
		switch (this.#v.orientation) {
			case O:
			case E: return c.ScreenOrientationType.PortraitPrimary;
			case D:
			case T:
			default: return c.ScreenOrientationType.LandscapePrimary;
		}
	}
	calculateAndEmulate(t) {
		this.#S || (this.#C = this.calculateAndEmulate.bind(this, t));
		let n = this.isMobile(), r = this.#S ? this.#S.overlayModel() : null;
		if (r && this.showHingeIfApplicable(r), this.#g === "Device" && this.#_ && this.#v) {
			let e = this.#_.orientationByName(this.#v.orientation), r = this.currentOutline(), i = this.currentInsets();
			this.#y = this.calculateFitScale(e.width, e.height, r, i), this.#s = n ? this.#_.touch() ? "Mobile" : "Mobile (no touch)" : this.#_.touch() ? "Desktop (touch)" : "Desktop", this.applyDeviceMetrics(new y(e.width, e.height), i, r, this.#c.get(), this.#_.deviceScaleFactor, n, this.getScreenOrientationType(), t), this.applyUserAgent(this.#_.userAgent, this.#_.userAgentMetadata), this.applyTouch(this.#_.touch(), n);
		} else if (this.#g === "None") this.#y = this.calculateFitScale(this.#n.width, this.#n.height), this.#s = "Desktop", this.applyDeviceMetrics(this.#n, new V(0, 0, 0, 0), new V(0, 0, 0, 0), 1, 0, n, null, t), this.applyUserAgent("", null), this.applyTouch(!1, !1);
		else if (this.#g === "Responsive") {
			let r = this.#u.get();
			(!r || r > this.preferredScaledWidth()) && (r = this.preferredScaledWidth());
			let i = this.#d.get();
			(!i || i > this.preferredScaledHeight()) && (i = this.preferredScaledHeight());
			let a = n ? 2 : 0;
			this.#y = this.calculateFitScale(this.#u.get(), this.#d.get()), this.#s = this.#f.get(), this.applyDeviceMetrics(new y(r, i), new V(0, 0, 0, 0), new V(0, 0, 0, 0), this.#c.get(), this.#p.get() || a, n, i >= r ? c.ScreenOrientationType.PortraitPrimary : c.ScreenOrientationType.LandscapePrimary, t), this.applyUserAgent(n ? e.defaultMobileUserAgent() : "", n ? e.defaultMobileUserAgentMetadata() : null), this.applyTouch(this.#f.get() === "Desktop (touch)" || this.#f.get() === "Mobile", this.#f.get() === "Mobile");
		}
		r && r.setShowViewportSizeOnResize(this.#g === "None"), this.dispatchEventToListeners("Updated");
	}
	calculateFitScale(e, t, n, r) {
		let i = n ? n.left + n.right : 0, a = n ? n.top + n.bottom : 0, o = r ? r.left + r.right : 0, s = r ? r.top + r.bottom : 0, c = Math.min(e ? this.#r.width / (e + i) : 1, t ? this.#r.height / (t + a) : 1);
		c = Math.min(Math.floor(c * 100), 100);
		let l = c;
		for (; l > c * .7;) {
			let n = !0;
			if (e && (n &&= Number.isInteger((e - o) * l / 100)), t && (n &&= Number.isInteger((t - s) * l / 100)), n) return l / 100;
			--l;
		}
		return c / 100;
	}
	setSizeAndScaleToFit(e, t) {
		this.#c.set(this.calculateFitScale(e, t)), this.setWidth(e), this.setHeight(t);
	}
	applyUserAgent(e, t) {
		h.instance().setUserAgentOverride(e, e ? t : null);
	}
	applyDeviceMetrics(e, t, n, r, i, a, o, s) {
		e.width = Math.max(1, Math.floor(e.width)), e.height = Math.max(1, Math.floor(e.height));
		let l = e.width - t.left - t.right, u = e.height - t.top - t.bottom, d = t.left, f = t.top, p = o === c.ScreenOrientationType.LandscapePrimary ? 90 : 0;
		this.#a = e, this.#o = i || window.devicePixelRatio, this.#e = new H(Math.max(0, (this.#n.width - e.width * r) / 2), n.top * r, e.width * r, e.height * r), this.#w = new H(this.#e.left - n.left * r, 0, (n.left + e.width + n.right) * r, (n.top + e.height + n.bottom) * r), this.#t = new H(d * r, f * r, Math.min(l * r, this.#n.width - this.#e.left - d * r), Math.min(u * r, this.#n.height - this.#e.top - f * r)), this.#l = r;
		let m = this.getDisplayFeature();
		if (m || (r === 1 && this.#n.width >= e.width && this.#n.height >= e.height && (l = 0, u = 0), this.#t.width === l * r && this.#t.height === u * r && Number.isInteger(l * r) && Number.isInteger(u * r) && (l = 0, u = 0)), this.#S) {
			if (s && this.#S.resetPageScaleFactor(), l || u || a || i || r !== 1 || o || m) {
				let t = {
					width: l,
					height: u,
					deviceScaleFactor: i,
					mobile: a,
					scale: r,
					screenWidth: e.width,
					screenHeight: e.height,
					positionX: d,
					positionY: f,
					dontSetVisibleSize: !0
				};
				m ? (t.displayFeature = m, t.devicePosture = { type: c.DevicePostureType.Folded }) : t.devicePosture = { type: c.DevicePostureType.Continuous }, o && (t.screenOrientation = {
					type: o,
					angle: p
				}), this.#S.emulateDevice(t);
			} else this.#S.emulateDevice(null);
		}
	}
	exitHingeMode() {
		let e = this.#S ? this.#S.overlayModel() : null;
		e && e.showHingeForDualScreen(null);
	}
	async captureScreenshot(e, t) {
		let n = this.#S ? this.#S.target().model(d) : null;
		if (!n) return null;
		let r;
		r = t ? m.FROM_CLIP : e ? m.FULLPAGE : m.FROM_VIEWPORT;
		let i = this.#S ? this.#S.overlayModel() : null;
		if (i && i.setShowViewportSizeOnResize(!1), this.#S && this.#_ && this.#v) {
			let e = this.#_.orientationByName(this.#v.orientation), t = {
				width: e.width,
				height: e.height,
				deviceScaleFactor: this.#_.deviceScaleFactor,
				mobile: this.isMobile()
			}, n = this.getDisplayFeature();
			n && (t.displayFeature = n), await this.#S.emulateDevice(t);
		}
		try {
			return await n.captureScreenshot(g.CaptureScreenshotRequestFormat.Png, 100, r, t);
		} finally {
			await this.#S?.emulateDevice(null), i?.setShowViewportSizeOnResize(this.#g === "None"), this.calculateAndEmulate(!1);
		}
	}
	applyTouch(e, t) {
		this.#b = e, this.#x = t;
		for (let n of p.instance().models(v)) n.emulateTouch(e, t);
	}
	showHingeIfApplicable(e) {
		let t = this.#_ && this.#v ? this.#_.orientationByName(this.#v.orientation) : null;
		if (t?.hinge) {
			e.showHingeForDualScreen(t.hinge);
			return;
		}
		e.showHingeForDualScreen(null);
	}
	getDisplayFeatureOrientation() {
		if (!this.#v) throw Error("Mode required to get display feature orientation.");
		switch (this.#v.orientation) {
			case O:
			case E: return c.DisplayFeatureOrientation.Vertical;
			case D:
			case T:
			default: return c.DisplayFeatureOrientation.Horizontal;
		}
	}
	getDisplayFeature() {
		if (!this.#_ || !this.#v || this.#v.orientation !== "vertical-spanned" && this.#v.orientation !== "horizontal-spanned") return null;
		let e = this.#_.orientationByName(this.#v.orientation);
		if (!e?.hinge) return null;
		let t = e.hinge;
		return {
			orientation: this.getDisplayFeatureOrientation(),
			offset: this.#v.orientation === "vertical-spanned" ? t.x : t.y,
			maskLength: this.#v.orientation === "vertical-spanned" ? t.width : t.height
		};
	}
	static getDynamicMobileUA() {
		let e = /* @__PURE__ */ new Date(), t = e.getFullYear(), n = e.getMonth() >= 9, r = n ? t - 2010 : t - 2011, i = n ? t - 2016 : t - 2017;
		return {
			userAgent: `Mozilla/5.0 (Linux; Android ${r}; Pixel ${i}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/%s Mobile Safari/537.36`,
			metadata: {
				platform: "Android",
				platformVersion: r.toString(),
				architecture: "",
				model: `Pixel ${i}`,
				mobile: !0
			}
		};
	}
	static defaultMobileUserAgent() {
		return h.patchUserAgentWithChromeVersion(e.getDynamicMobileUA().userAgent);
	}
	static defaultMobileUserAgentMetadata() {
		return e.getDynamicMobileUA().metadata;
	}
}, V = class {
	left;
	top;
	right;
	bottom;
	constructor(e, t, n, r) {
		this.left = e, this.top = t, this.right = n, this.bottom = r;
	}
	isEqual(e) {
		return e !== null && this.left === e.left && this.top === e.top && this.right === e.right && this.bottom === e.bottom;
	}
}, H = class e {
	left;
	top;
	width;
	height;
	constructor(e, t, n, r) {
		this.left = e, this.top = t, this.width = n, this.height = r;
	}
	isEqual(e) {
		return e !== null && this.left === e.left && this.top === e.top && this.width === e.width && this.height === e.height;
	}
	scale(t) {
		return new e(this.left * t, this.top * t, this.width * t, this.height * t);
	}
	relativeTo(t) {
		return new e(this.left - t.left, this.top - t.top, this.width, this.height);
	}
	rebaseTo(t) {
		return new e(this.left + t.left, this.top + t.top, this.width, this.height);
	}
}, U = /* @__PURE__ */ function(e) {
	return e.UPDATED = "Updated", e;
}({}), W = /* @__PURE__ */ function(e) {
	return e.None = "None", e.Responsive = "Responsive", e.Device = "Device", e;
}({}), G = /* @__PURE__ */ function(e) {
	return e.MOBILE = "Mobile", e.MOBILE_NO_TOUCH = "Mobile (no touch)", e.DESKTOP = "Desktop", e.DESKTOP_TOUCH = "Desktop (touch)", e;
}({}), K = 9999;
//#endregion
export { W as a, w as c, T as d, D as f, K as i, N as l, O as m, U as n, G as o, E as p, V as r, A as s, B as t, P as u };
