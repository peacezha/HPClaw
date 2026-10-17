import { f as e, l as t, o as n, p as r } from "./root-DdvV-xPu.js";
import { t as i } from "./platform-D4TUCh2P.js";
import { A as a, E as o, P as s, T as c, _ as l, k as u } from "./StringUtilities-CMDxNrEc.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/core/platform/ArrayUtilities.ts
var d = (e, t, n) => {
	let r = e.indexOf(t);
	if (r === -1) return !1;
	if (n) return e.splice(r, 1), !0;
	for (let n = r + 1, i = e.length; n < i; ++n) e[n] !== t && (e[r++] = e[n]);
	return e.length = r, !0;
};
function f(e, t, n) {
	let r = e[t];
	e[t] = e[n], e[n] = r;
}
function ee(e, t, n, r, i) {
	let a = e[i];
	f(e, r, i);
	let o = n;
	for (let i = n; i < r; ++i) t(e[i], a) < 0 && (f(e, o, i), ++o);
	return f(e, r, o), o;
}
function te(e, t, n, r, i, a) {
	if (r <= n) return;
	let o = ee(e, t, n, r, Math.floor(Math.random() * (r - n)) + n);
	i < o && te(e, t, n, o - 1, i, a), o < a && te(e, t, o + 1, r, i, a);
}
function ne(e, t, n, r, i, a) {
	return n === 0 && r === e.length - 1 && i === 0 && a >= r ? e.sort(t) : te(e, t, n, r, i, a), e;
}
function re(e, t, n, r) {
	let i = [], a = 0, o = 0;
	for (; a < e.length && o < t.length;) {
		let s = n(e[a], t[o]);
		(r || !s) && i.push(s <= 0 ? e[a] : t[o]), s <= 0 && a++, s >= 0 && o++;
	}
	if (r) {
		for (; a < e.length;) i.push(e[a++]);
		for (; o < t.length;) i.push(t[o++]);
	}
	return i;
}
var ie = (e, t, n) => re(e, t, n, !1), ae = (e, t, n) => re(e, t, n, !0), oe = (e, t) => e < t ? -1 : +(e > t);
function se(e, t, n, r, i) {
	let a = r || 0, o = i === void 0 ? e.length : i;
	for (; a < o;) {
		let r = a + o >> 1;
		n(t, e[r]) > 0 ? a = r + 1 : o = r;
	}
	return o;
}
function ce(e, t, n, r, i) {
	let a = r || 0, o = i === void 0 ? e.length : i;
	for (; a < o;) {
		let r = a + o >> 1;
		n(t, e[r]) >= 0 ? a = r + 1 : o = r;
	}
	return o;
}
function le(e, t, n) {
	let r = n === "END";
	if (e.length === 0) return null;
	let i = 0, a = e.length - 1, o = 0, s = !1, c = !1, l = 0;
	do
		l = i + (a - i) / 2, o = r ? Math.ceil(l) : Math.floor(l), s = t(e[o]), c = s === r, c ? i = Math.min(a, o + +(i === o)) : a = Math.max(i, o + (a === o ? -1 : 0));
	while (a !== i);
	return t(e[i]) ? i : null;
}
function ue(e, t) {
	return le(e, t, "BEGINNING");
}
function de(e, t) {
	return le(e, t, "END");
}
function fe(e) {
	return !e.includes(null) && !e.includes(void 0);
}
function pe(e, t) {
	let n = t || oe;
	for (let t = 0; t < e.length - 1; t++) {
		let r = e[t], i = e[t + 1];
		if (n(r, i) > 0) throw Error(`Array is not sorted at index ${t}: ${JSON.stringify(r)} > ${JSON.stringify(i)}`);
	}
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/core/platform/Timing.ts
function me(e) {
	return e / 1e3;
}
function he(e) {
	return e / 1e3;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/core/common/Base64.ts
var ge = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", _e = /* @__PURE__ */ new Uint8Array(123);
for (let e = 0; e < 64; ++e) _e[ge.charCodeAt(e)] = e;
function ve(e) {
	let t = e.length * 3 / 4 >>> 0;
	e.charCodeAt(e.length - 2) === 61 ? t -= 2 : e.charCodeAt(e.length - 1) === 61 && --t;
	let n = new Uint8Array(t);
	for (let t = 0, r = 0; t < e.length; t += 4) {
		let i = _e[e.charCodeAt(t + 0)], a = _e[e.charCodeAt(t + 1)], o = _e[e.charCodeAt(t + 2)], s = _e[e.charCodeAt(t + 3)];
		n[r++] = i << 2 | a >> 4, n[r++] = (a & 15) << 4 | o >> 2, n[r++] = (o & 3) << 6 | s & 63;
	}
	return n;
}
async function ye(e) {
	if (typeof FileReader > "u") {
		let t = await new Blob([e]).arrayBuffer();
		return globalThis.Buffer.from(t).toString("base64");
	}
	return await new Promise((t, n) => {
		let r = new FileReader();
		r.onerror = () => n(/* @__PURE__ */ Error("failed to convert to base64: internal error")), r.onload = () => {
			if (r.result === "") {
				n(/* @__PURE__ */ Error("failed to convert to base64: input too large to encode as base64 string"));
				return;
			}
			let e = r.result, i = e.indexOf(",");
			t(e.slice(i + 1));
		}, r.readAsDataURL(new Blob([e]));
	});
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/core/common/ColorConverter.ts
var be = .9642, xe = 1, Se = .8251, p = class {
	values = [
		0,
		0,
		0
	];
	constructor(e) {
		e && (this.values = e);
	}
}, m = class {
	values = [
		[
			0,
			0,
			0
		],
		[
			0,
			0,
			0
		],
		[
			0,
			0,
			0
		]
	];
	constructor(e) {
		e && (this.values = e);
	}
	multiply(e) {
		let t = new p();
		for (let n = 0; n < 3; ++n) t.values[n] = this.values[n][0] * e.values[0] + this.values[n][1] * e.values[1] + this.values[n][2] * e.values[2];
		return t;
	}
}, Ce = class {
	g;
	a;
	b;
	c;
	d;
	e;
	f;
	constructor(e, t, n = 0, r = 0, i = 0, a = 0, o = 0) {
		this.g = e, this.a = t, this.b = n, this.c = r, this.d = i, this.e = a, this.f = o;
	}
	eval(e) {
		let t = e < 0 ? -1 : 1, n = e * t;
		return n < this.d ? t * (this.c * n + this.f) : t * ((this.a * n + this.b) ** +this.g + this.e);
	}
}, h = {
	sRGB: new Ce(2.4, 1 / 1.055, .055 / 1.055, 1 / 12.92, .04045, 0, 0),
	sRGB_INVERSE: new Ce(.416667, 1.13728, -0, 12.92, .0031308, -.0549698, -0),
	proPhotoRGB: new Ce(1.8, 1),
	proPhotoRGB_INVERSE: new Ce(.555556, 1, -0, 0, 0, 0, 0),
	k2Dot2: new Ce(2.2, 1),
	k2Dot2_INVERSE: new Ce(.454545, 1),
	rec2020: new Ce(2.22222, .909672, .0903276, .222222, .0812429, 0, 0),
	rec2020_INVERSE: new Ce(.45, 1.23439, -0, 4.5, .018054, -.0993195, -0)
}, g = {
	sRGB: new m([
		[
			.436065674,
			.385147095,
			.143066406
		],
		[
			.222488403,
			.716873169,
			.06060791
		],
		[
			.013916016,
			.097076416,
			.714096069
		]
	]),
	sRGB_INVERSE: new m([
		[
			3.134112151374599,
			-1.6173924597114966,
			-.4906334036481285
		],
		[
			-.9787872938826594,
			1.9162795854799963,
			.0334547139520088
		],
		[
			.07198304248352326,
			-.2289858493321844,
			1.4053851325241447
		]
	]),
	displayP3: new m([
		[
			.515102,
			.291965,
			.157153
		],
		[
			.241182,
			.692236,
			.0665819
		],
		[
			-.00104941,
			.0418818,
			.784378
		]
	]),
	displayP3_INVERSE: new m([
		[
			2.404045155982687,
			-.9898986932663839,
			-.3976317191366333
		],
		[
			-.8422283799266768,
			1.7988505115115485,
			.016048170293157416
		],
		[
			.04818705979712955,
			-.09737385156228891,
			1.2735066448052303
		]
	]),
	adobeRGB: new m([
		[
			.60974,
			.20528,
			.14919
		],
		[
			.31111,
			.62567,
			.06322
		],
		[
			.01947,
			.06087,
			.74457
		]
	]),
	adobeRGB_INVERSE: new m([
		[
			1.9625385510109137,
			-.6106892546501431,
			-.3413827467482388
		],
		[
			-.9787580455521,
			1.9161624707082339,
			.03341676594241408
		],
		[
			.028696263137883395,
			-.1406807819331586,
			1.349252109991369
		]
	]),
	rec2020: new m([
		[
			.673459,
			.165661,
			.1251
		],
		[
			.279033,
			.675338,
			.0456288
		],
		[
			-.00193139,
			.0299794,
			.797162
		]
	]),
	rec2020_INVERSE: new m([
		[
			1.647275201661012,
			-.3936024771460771,
			-.23598028884792507
		],
		[
			-.6826176165196962,
			1.647617775014935,
			.01281626807852422
		],
		[
			.029662725298529837,
			-.06291668721366285,
			1.2533964313435522
		]
	]),
	xyz: new m([
		[
			1,
			0,
			0
		],
		[
			0,
			1,
			0
		],
		[
			0,
			0,
			1
		]
	])
};
function we(e) {
	return Math.PI / 180 * e;
}
function Te(e) {
	return 180 / Math.PI * e;
}
function _(e, t, n, r) {
	return [
		e.eval(t),
		e.eval(n),
		e.eval(r)
	];
}
var Ee = new m([
	[
		.9999999984505198,
		.39633779217376786,
		.2158037580607588
	],
	[
		1.0000000088817609,
		-.10556134232365635,
		-.06385417477170591
	],
	[
		1.0000000546724108,
		-.08948418209496575,
		-1.2914855378640917
	]
]), De = new m([
	[
		.2104542553,
		.7936177849999999,
		-.0040720468
	],
	[
		1.9779984951000003,
		-2.4285922049999997,
		.4505937099000001
	],
	[
		.025904037099999982,
		.7827717662,
		-.8086757660000001
	]
]), Oe = new m([
	[
		.8190224432164319,
		.3619062562801221,
		-.12887378261216414
	],
	[
		.0329836671980271,
		.9292868468965546,
		.03614466816999844
	],
	[
		.048177199566046255,
		.26423952494422764,
		.6335478258136937
	]
]), ke = new m([
	[
		1.226879873374156,
		-.5578149965554814,
		.2813910501772159
	],
	[
		-.040575762624313734,
		1.1122868293970596,
		-.07171106666151703
	],
	[
		-.07637294974672144,
		-.4214933239627915,
		1.586924024427242
	]
]), Ae = new m([
	[
		.7976700747153241,
		.13519395152800417,
		.03135596341127167
	],
	[
		.28803902352472205,
		.7118744007923554,
		8661179538844252e-20
	],
	[
		2.739876695467402e-7,
		-14405226518969991e-22,
		.825211112593861
	]
]), je = new m([
	[
		1.3459533710138858,
		-.25561367037652133,
		-.051116041522131374
	],
	[
		-.544600415668951,
		1.5081687311475767,
		.020535163968720935
	],
	[
		-13975622054109725e-22,
		2717590904589903e-21,
		1.2118111696814942
	]
]), Me = new m([
	[
		1.0478573189120088,
		.022907374491829943,
		-.050162247377152525
	],
	[
		.029570500050499514,
		.9904755577034089,
		-.017061518194840468
	],
	[
		-.00924047197558879,
		.015052921526981566,
		.7519708530777581
	]
]), Ne = new m([
	[
		.9555366447632887,
		-.02306009252137888,
		.06321844147263304
	],
	[
		-.028315378228764922,
		1.009951351591575,
		.021026001591792402
	],
	[
		.012308773293784308,
		-.02050053471777469,
		1.3301947294775631
	]
]), v = class e {
	static labToXyzd50(e, t, n) {
		let r = (e + 16) / 116, i = r + t / 500, a = r - n / 200;
		function o(e) {
			return e <= 24 / 116 ? 108 / 841 * (e - 16 / 116) : e * e * e;
		}
		return i = o(i) * be, r = o(r) * xe, a = o(a) * Se, [
			i,
			r,
			a
		];
	}
	static xyzd50ToLab(e, t, n) {
		function r(e) {
			return e <= .008856451679035631 ? 841 / 108 * e + 16 / 116 : e ** (1 / 3);
		}
		return e = r(e / be), t = r(t / xe), n = r(n / Se), [
			116 * t - 16,
			500 * (e - t),
			200 * (t - n)
		];
	}
	static oklabToXyzd65(e, t, n) {
		let r = new p([
			e,
			t,
			n
		]), i = Ee.multiply(r);
		return i.values[0] = i.values[0] * i.values[0] * i.values[0], i.values[1] = i.values[1] * i.values[1] * i.values[1], i.values[2] = i.values[2] * i.values[2] * i.values[2], ke.multiply(i).values;
	}
	static xyzd65ToOklab(e, t, n) {
		let r = new p([
			e,
			t,
			n
		]), i = Oe.multiply(r);
		i.values[0] = i.values[0] ** (1 / 3), i.values[1] = i.values[1] ** (1 / 3), i.values[2] = i.values[2] ** (1 / 3);
		let a = De.multiply(i);
		return [
			a.values[0],
			a.values[1],
			a.values[2]
		];
	}
	static lchToLab(e, t, n) {
		return n === void 0 ? [
			e,
			0,
			0
		] : [
			e,
			t * Math.cos(we(n)),
			t * Math.sin(we(n))
		];
	}
	static labToLch(e, t, n) {
		return [
			e,
			Math.sqrt(t * t + n * n),
			Te(Math.atan2(n, t))
		];
	}
	static displayP3ToXyzd50(e, t, n) {
		let [r, i, a] = _(h.sRGB, e, t, n), o = new p([
			r,
			i,
			a
		]);
		return g.displayP3.multiply(o).values;
	}
	static xyzd50ToDisplayP3(e, t, n) {
		let r = new p([
			e,
			t,
			n
		]), i = g.displayP3_INVERSE.multiply(r);
		return _(h.sRGB_INVERSE, i.values[0], i.values[1], i.values[2]);
	}
	static proPhotoToXyzd50(e, t, n) {
		let [r, i, a] = _(h.proPhotoRGB, e, t, n), o = new p([
			r,
			i,
			a
		]);
		return Ae.multiply(o).values;
	}
	static xyzd50ToProPhoto(e, t, n) {
		let r = new p([
			e,
			t,
			n
		]), i = je.multiply(r);
		return _(h.proPhotoRGB_INVERSE, i.values[0], i.values[1], i.values[2]);
	}
	static adobeRGBToXyzd50(e, t, n) {
		let [r, i, a] = _(h.k2Dot2, e, t, n), o = new p([
			r,
			i,
			a
		]);
		return g.adobeRGB.multiply(o).values;
	}
	static xyzd50ToAdobeRGB(e, t, n) {
		let r = new p([
			e,
			t,
			n
		]), i = g.adobeRGB_INVERSE.multiply(r);
		return _(h.k2Dot2_INVERSE, i.values[0], i.values[1], i.values[2]);
	}
	static rec2020ToXyzd50(e, t, n) {
		let [r, i, a] = _(h.rec2020, e, t, n), o = new p([
			r,
			i,
			a
		]);
		return g.rec2020.multiply(o).values;
	}
	static xyzd50ToRec2020(e, t, n) {
		let r = new p([
			e,
			t,
			n
		]), i = g.rec2020_INVERSE.multiply(r);
		return _(h.rec2020_INVERSE, i.values[0], i.values[1], i.values[2]);
	}
	static xyzd50ToD65(e, t, n) {
		let r = new p([
			e,
			t,
			n
		]);
		return Ne.multiply(r).values;
	}
	static xyzd65ToD50(e, t, n) {
		let r = new p([
			e,
			t,
			n
		]);
		return Me.multiply(r).values;
	}
	static xyzd50TosRGBLinear(e, t, n) {
		let r = new p([
			e,
			t,
			n
		]);
		return g.sRGB_INVERSE.multiply(r).values;
	}
	static srgbLinearToXyzd50(e, t, n) {
		let r = new p([
			e,
			t,
			n
		]);
		return g.sRGB.multiply(r).values;
	}
	static srgbToXyzd50(e, t, n) {
		let [r, i, a] = _(h.sRGB, e, t, n), o = new p([
			r,
			i,
			a
		]);
		return g.sRGB.multiply(o).values;
	}
	static xyzd50ToSrgb(e, t, n) {
		let r = new p([
			e,
			t,
			n
		]), i = g.sRGB_INVERSE.multiply(r);
		return _(h.sRGB_INVERSE, i.values[0], i.values[1], i.values[2]);
	}
	static oklchToXyzd50(t, n, r) {
		let [i, a, o] = e.lchToLab(t, n, r), [s, c, l] = e.oklabToXyzd65(i, a, o);
		return e.xyzd65ToD50(s, c, l);
	}
	static xyzd50ToOklch(t, n, r) {
		let [i, a, o] = e.xyzd50ToD65(t, n, r), [s, c, l] = e.xyzd65ToOklab(i, a, o);
		return e.labToLch(s, c, l);
	}
};
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/core/common/ColorUtils.ts
function Pe(e, t) {
	let n = e[3];
	return [
		(1 - n) * t[0] + n * e[0],
		(1 - n) * t[1] + n * e[1],
		(1 - n) * t[2] + n * e[2],
		n + t[3] * (1 - n)
	];
}
function Fe([e, t, n]) {
	let r = Math.max(e, t, n), i = Math.min(e, t, n), a = r - i, o;
	return o = i === r ? 0 : e === r ? (1 / 6 * (t - n) / a + 1) % 1 : t === r ? 1 / 6 * (n - e) / a + 1 / 3 : 1 / 6 * (e - t) / a + 2 / 3, o;
}
function y(e) {
	let [t, n, r] = Ie([...e, void 0]);
	return [
		t,
		n,
		r
	];
}
function Ie([e, t, n, r]) {
	let i = Math.max(e, t, n), a = Math.min(e, t, n), o = i - a, s = i + a, c = Fe([
		e,
		t,
		n
	]), l = .5 * s, u;
	return u = l === 0 || l === 1 ? 0 : l <= .5 ? o / s : o / (2 - s), [
		c,
		u,
		l,
		r
	];
}
function b(e) {
	let [t, n, r] = Le([...e, void 0]);
	return [
		t,
		n,
		r
	];
}
function Le([e, t, n, r]) {
	return [
		Fe([
			e,
			t,
			n
		]),
		Math.min(e, t, n),
		1 - Math.max(e, t, n),
		r
	];
}
function Re([e, t, n]) {
	let r = e <= .04045 ? e / 12.92 : ((e + .055) / 1.055) ** 2.4, i = t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4, a = n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4;
	return .2126 * r + .7152 * i + .0722 * a;
}
function ze(e, t) {
	let n = Re(Pe(e, t)), r = Re(t);
	return (Math.max(n, r) + .05) / (Math.min(n, r) + .05);
}
var Be = 2.4, Ve = .56, He = .57, Ue = .65, We = .62, Ge = .022, Ke = 1.414, qe = 1.14, Je = 1.14, Ye = .027, Xe = .1, Ze = 5e-4;
function Qe([e, t, n]) {
	let r = e ** +Be, i = t ** +Be, a = n ** +Be;
	return .2126729 * r + .7151522 * i + .072175 * a;
}
function $e(e, t) {
	return tt(Qe(Pe(e, t)), Qe(t));
}
function et(e) {
	return e > Ge ? e : e + (Ge - e) ** +Ke;
}
function tt(e, t) {
	if (e = et(e), t = et(t), Math.abs(e - t) < Ze) return 0;
	let n = 0;
	return t > e ? (n = (t ** +Ve - e ** +He) * qe, n = n < Xe ? 0 : n - Ye) : (n = (t ** +Ue - e ** +We) * Je, n = n > -.1 ? 0 : n + Ye), n * 100;
}
function nt(e, t, n) {
	e = et(e), t /= 100;
	function r() {
		return n ? Math.abs(e ** +Ue - (-t - Ye) / Je) ** (1 / We) : Math.abs(e ** +Ve - (t + Ye) / qe) ** (1 / He);
	}
	let i = r();
	return (i < 0 || i > 1) && (n = !n, i = r()), i;
}
var rt = [
	[
		12,
		-1,
		-1,
		-1,
		-1,
		100,
		90,
		80,
		-1,
		-1
	],
	[
		14,
		-1,
		-1,
		-1,
		100,
		90,
		80,
		60,
		60,
		-1
	],
	[
		16,
		-1,
		-1,
		100,
		90,
		80,
		60,
		55,
		50,
		50
	],
	[
		18,
		-1,
		-1,
		90,
		80,
		60,
		55,
		50,
		40,
		40
	],
	[
		24,
		-1,
		100,
		80,
		60,
		55,
		50,
		40,
		38,
		35
	],
	[
		30,
		-1,
		90,
		70,
		55,
		50,
		40,
		38,
		35,
		40
	],
	[
		36,
		-1,
		80,
		60,
		50,
		40,
		38,
		35,
		30,
		25
	],
	[
		48,
		100,
		70,
		55,
		40,
		38,
		35,
		30,
		25,
		20
	],
	[
		60,
		90,
		60,
		50,
		38,
		35,
		30,
		25,
		20,
		20
	],
	[
		72,
		80,
		55,
		40,
		35,
		30,
		25,
		20,
		20,
		20
	],
	[
		96,
		70,
		50,
		35,
		30,
		25,
		20,
		20,
		20,
		20
	],
	[
		120,
		60,
		40,
		30,
		25,
		20,
		20,
		20,
		20,
		20
	]
];
rt.reverse();
function it(e, t) {
	let n = parseFloat(e.replace("px", "")), r = parseFloat(t);
	for (let [e, ...t] of rt) if (n >= e) {
		for (let [e, n] of [
			900,
			800,
			700,
			600,
			500,
			400,
			300,
			200,
			100
		].entries()) if (r >= n) {
			let n = t[t.length - 1 - e];
			return n === -1 ? null : n;
		}
	}
	return null;
}
function at(e, t) {
	let n = ["bold", "bolder"], r = parseFloat(e.replace("px", "")), i = isNaN(Number(t)) ? n.includes(t) : Number(t) >= 600, a = r * 72 / 96;
	return i ? a >= 14 : a >= 18;
}
var ot = {
	largeFont: {
		aa: 3,
		aaa: 4.5
	},
	normalFont: {
		aa: 4.5,
		aaa: 7
	}
};
function st(e, t) {
	return at(e, t) ? ot.largeFont : ot.normalFont;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/core/common/Color.ts
function ct(e) {
	return (e % 360 + 360) % 360;
}
function lt(e) {
	let t = e.replace(/(deg|g?rad|turn)$/, "");
	if (isNaN(t) || e.match(/\s+(deg|g?rad|turn)/)) return null;
	let n = parseFloat(t);
	return e.includes("turn") ? n * 360 : e.includes("grad") ? n * 9 / 10 : e.includes("rad") ? n * 180 / Math.PI : n;
}
function ut(e) {
	switch (e) {
		case "hex": return "hex";
		case "hexa": return "hexa";
		case "rgb": return "rgb";
		case "rgba": return "rgba";
		case "hsl": return "hsl";
		case "hsla": return "hsla";
		case "hwb": return "hwb";
		case "hwba": return "hwba";
		case "lch": return "lch";
		case "oklch": return "oklch";
		case "lab": return "lab";
		case "oklab": return "oklab";
	}
	return dt(e);
}
function dt(e) {
	switch (e) {
		case "srgb": return "srgb";
		case "srgb-linear": return "srgb-linear";
		case "display-p3": return "display-p3";
		case "a98-rgb": return "a98-rgb";
		case "prophoto-rgb": return "prophoto-rgb";
		case "rec2020": return "rec2020";
		case "xyz": return "xyz";
		case "xyz-d50": return "xyz-d50";
		case "xyz-d65": return "xyz-d65";
	}
	return null;
}
var ft = /* @__PURE__ */ function(e) {
	return e.A = "a", e.ALPHA = "alpha", e.B = "b", e.C = "c", e.G = "g", e.H = "h", e.L = "l", e.R = "r", e.S = "s", e.W = "w", e.X = "x", e.Y = "y", e.Z = "z", e;
}({});
function pt(e, t) {
	let n = Math.sign(e), r = Math.abs(e), [i, a] = t;
	return n * (r * (a - i) / 100 + i);
}
function mt(e) {
	if (!e.match(/\s/)) {
		let t = e.toLowerCase().match(/^(?:#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})|(\w+))$/i);
		if (t) return t[1] ? F.fromHex(t[1], e) : t[2] ? It.fromName(t[2], e) : null;
	}
	let t = e.toLowerCase().match(/^\s*(?:(rgba?)|(hsla?)|(hwba?)|(lch)|(oklch)|(lab)|(oklab)|(color))\((.*)\)\s*$/);
	if (t) {
		let n = !!t[1], r = !!t[2], i = !!t[3], a = !!t[4], o = !!t[5], s = !!t[6], c = !!t[7], l = !!t[8], u = t[9];
		if (l) return j.fromSpec(e, u);
		let d = ht(u, {
			allowCommas: n || r,
			convertNoneToZero: !(n || r || i)
		});
		if (!d) return null;
		let f = [
			d[0],
			d[1],
			d[2],
			d[3]
		];
		if (n) return F.fromRGBAFunction(d[0], d[1], d[2], d[3], e);
		if (r) return M.fromSpec(f, e);
		if (i) return N.fromSpec(f, e);
		if (a) return O.fromSpec(f, e);
		if (o) return A.fromSpec(f, e);
		if (s) return D.fromSpec(f, e);
		if (c) return k.fromSpec(f, e);
	}
	return null;
}
function ht(e, { allowCommas: t, convertNoneToZero: n }) {
	let r = e.trim(), i = [];
	if (t && (i = r.split(/\s*,\s*/)), !t || i.length === 1) {
		if (i = r.split(/\s+/), i[3] === "/") {
			if (i.splice(3, 1), i.length !== 4) return null;
		} else if (i.length > 2 && i[2].indexOf("/") !== -1 || i.length > 3 && i[3].indexOf("/") !== -1) {
			let e = i.slice(2, 4).join("");
			i = i.slice(0, 2).concat(e.split(/\//)).concat(i.slice(4));
		} else if (i.length >= 4) return null;
	}
	return i.length !== 3 && i.length !== 4 || i.indexOf("") > -1 ? null : n ? i.map((e) => e === "none" ? "0" : e) : i;
}
function x(e, { min: t, max: n }) {
	return e === null ? e : (t !== void 0 && (e = Math.max(e, t)), n !== void 0 && (e = Math.min(e, n)), e);
}
function S(e, t) {
	if (!e.endsWith("%")) return null;
	let n = parseFloat(e.substr(0, e.length - 1));
	return isNaN(n) ? null : pt(n, t);
}
function C(e) {
	let t = parseFloat(e);
	return isNaN(t) ? null : t;
}
function gt(e) {
	return e === void 0 ? null : x(S(e, [0, 1]) ?? C(e), {
		min: 0,
		max: 1
	});
}
function _t(e, t = [0, 1]) {
	if (isNaN(e.replace("%", ""))) return null;
	let n = parseFloat(e);
	return e.indexOf("%") === -1 ? n : e.indexOf("%") === e.length - 1 ? pt(n, t) : null;
}
function vt(e) {
	let t = _t(e);
	return t === null ? null : e.indexOf("%") === -1 ? t / 255 : t;
}
function yt(e) {
	let t = e.replace(/(deg|g?rad|turn)$/, "");
	if (isNaN(t) || e.match(/\s+(deg|g?rad|turn)/)) return null;
	let n = parseFloat(t);
	return e.indexOf("turn") === -1 ? e.indexOf("grad") === -1 ? e.indexOf("rad") === -1 ? n / 360 % 1 : n / (2 * Math.PI) % 1 : n / 400 % 1 : n % 1;
}
function bt(e) {
	return e.indexOf("%") !== e.length - 1 || isNaN(e.replace("%", "")) ? null : parseFloat(e) / 100;
}
function xt(e) {
	return _t(e);
}
function St(e) {
	let t = e[0], n = e[1], r = e[2], i = (2 - n) * r;
	return r === 0 || n === 0 ? n = 0 : n *= r / (i < 1 ? i : 2 - i), [
		t,
		n,
		i / 2,
		e[3]
	];
}
function Ct(e) {
	let t = e[0], n = e[1], r = e[2];
	function i(e, t, n) {
		return n < 0 ? n += 1 : n > 1 && --n, n * 6 < 1 ? e + (t - e) * n * 6 : n * 2 < 1 ? t : n * 3 < 2 ? e + (t - e) * (2 / 3 - n) * 6 : e;
	}
	n < 0 && (n = 0);
	let a;
	a = r <= .5 ? r * (1 + n) : r + n - r * n;
	let o = 2 * r - a, s = t + 1 / 3, c = t, l = t - 1 / 3;
	return [
		i(o, a, s),
		i(o, a, c),
		i(o, a, l),
		e[3]
	];
}
function wt(e) {
	let t = e[0], n = e[1], r = e[2], i = n / (n + r), a = [
		i,
		i,
		i,
		e[3]
	];
	if (n + r < 1) {
		a = Ct([
			t,
			1,
			.5,
			e[3]
		]);
		for (let e = 0; e < 3; ++e) a[e] += n - (n + r) * a[e];
	}
	return a;
}
function Tt(e) {
	return Ct(St(e));
}
function Et(e) {
	let t = y(e), n = t[0], r = t[1], i = t[2];
	return r *= i < .5 ? i : 1 - i, [
		n,
		r === 0 ? 0 : 2 * r / (i + r),
		i + r
	];
}
function Dt(e, t, n) {
	function r() {
		return n ? (e + .05) * t - .05 : (e + .05) / t - .05;
	}
	let i = r();
	return (i < 0 || i > 1) && (n = !n, i = r()), i;
}
function Ot(e, t, n, r) {
	let i = e[t], a = 1, o = r(e) - n, s = Math.sign(o);
	for (let c = 100; c; c--) {
		if (Math.abs(o) < 2e-4) return e[t] = i, i;
		let c = Math.sign(o);
		if (c !== s) a /= 2, s = c;
		else if (i < 0 || i > 1) return null;
		i += a * (t === 2 ? -o : o), e[t] = i, o = r(e) - n;
	}
	return null;
}
function kt(e, t, n) {
	let r = e.as("hsl").hsva(), i = t.rgba(), a = (e) => Re(Pe(F.fromHSVA(e).rgba(), i)), o = Re(t.rgba()), s = Dt(o, n, a(r) > o);
	return Ot(r, 2, s, a) || (r[2] = 1, Ot(r, 1, s, a)) ? F.fromHSVA(r) : null;
}
function At(e, t, n) {
	let r = e.as("hsl").hsva(), i = (e) => Qe(F.fromHSVA(e).rgba()), a = Qe(t.rgba()), o = nt(a, n, i(r) >= a);
	if (Ot(r, 2, o, i)) {
		let e = F.fromHSVA(r);
		if (Math.abs($e(t.rgba(), e.rgba())) >= n) return e;
	}
	if (r[2] = 1, Ot(r, 1, o, i)) {
		let e = F.fromHSVA(r);
		if (Math.abs($e(t.rgba(), e.rgba())) >= n) return e;
	}
	return null;
}
var jt = .01, w = 1, Mt = 1e-4;
function T(e, t, n = jt) {
	if (Array.isArray(e) && Array.isArray(t)) {
		if (e.length !== t.length) return !1;
		for (let n in e) if (!T(e[n], t[n])) return !1;
		return !0;
	}
	return Array.isArray(e) || Array.isArray(t) ? !1 : e === null || t === null ? e === t : Math.abs(e - t) < n;
}
function E(e, t, n = jt) {
	return e - t <= n;
}
var Nt = /* @__PURE__ */ function(e) {
	return e.HEX = "hex", e.HEXA = "hexa", e.RGB = "rgb", e.RGBA = "rgba", e.HSL = "hsl", e.HSLA = "hsla", e.HWB = "hwb", e.HWBA = "hwba", e.LCH = "lch", e.OKLCH = "oklch", e.LAB = "lab", e.OKLAB = "oklab", e.SRGB = "srgb", e.SRGB_LINEAR = "srgb-linear", e.DISPLAY_P3 = "display-p3", e.A98_RGB = "a98-rgb", e.PROPHOTO_RGB = "prophoto-rgb", e.REC_2020 = "rec2020", e.XYZ = "xyz", e.XYZ_D50 = "xyz-d50", e.XYZ_D65 = "xyz-d65", e;
}({}), D = class e {
	l;
	a;
	b;
	alpha;
	#e;
	#t;
	channels = [
		"l",
		"a",
		"b",
		"alpha"
	];
	static #n = {
		hex: (e) => new F(e.#i(!1), "hex"),
		hexa: (e) => new F(e.#i(!0), "hexa"),
		rgb: (e) => new F(e.#i(!1), "rgb"),
		rgba: (e) => new F(e.#i(!0), "rgba"),
		hsl: (e) => new M(...y(e.#i(!1)), e.alpha),
		hsla: (e) => new M(...y(e.#i(!1)), e.alpha),
		hwb: (e) => new N(...b(e.#i(!1)), e.alpha),
		hwba: (e) => new N(...b(e.#i(!1)), e.alpha),
		lch: (e) => new O(...v.labToLch(e.l, e.a, e.b), e.alpha),
		oklch: (e) => new A(...v.xyzd50ToOklch(...e.#r()), e.alpha),
		lab: (e) => e,
		oklab: (e) => new k(...v.xyzd65ToOklab(...v.xyzd50ToD65(...e.#r())), e.alpha),
		srgb: (e) => new j("srgb", ...v.xyzd50ToSrgb(...e.#r()), e.alpha),
		"srgb-linear": (e) => new j("srgb-linear", ...v.xyzd50TosRGBLinear(...e.#r()), e.alpha),
		"display-p3": (e) => new j("display-p3", ...v.xyzd50ToDisplayP3(...e.#r()), e.alpha),
		"a98-rgb": (e) => new j("a98-rgb", ...v.xyzd50ToAdobeRGB(...e.#r()), e.alpha),
		"prophoto-rgb": (e) => new j("prophoto-rgb", ...v.xyzd50ToProPhoto(...e.#r()), e.alpha),
		rec2020: (e) => new j("rec2020", ...v.xyzd50ToRec2020(...e.#r()), e.alpha),
		xyz: (e) => new j("xyz", ...v.xyzd50ToD65(...e.#r()), e.alpha),
		"xyz-d50": (e) => new j("xyz-d50", ...e.#r(), e.alpha),
		"xyz-d65": (e) => new j("xyz-d65", ...v.xyzd50ToD65(...e.#r()), e.alpha)
	};
	#r() {
		return v.labToXyzd50(this.l, this.a, this.b);
	}
	#i(e = !0) {
		let t = v.xyzd50ToSrgb(...this.#r());
		return e ? [...t, this.alpha ?? void 0] : t;
	}
	constructor(e, t, n, r, i) {
		this.#t = [
			e,
			t,
			n
		], this.l = x(e, {
			min: 0,
			max: 100
		}), (T(this.l, 0, w) || T(this.l, 100, w)) && (t = n = 0), this.a = t, this.b = n, this.alpha = x(r, {
			min: 0,
			max: 1
		}), this.#e = i;
	}
	is(e) {
		return e === this.format();
	}
	as(t) {
		return e.#n[t](this);
	}
	asLegacyColor() {
		return this.as("rgba");
	}
	equal(e) {
		let t = e.as("lab");
		return T(t.l, this.l, w) && T(t.a, this.a) && T(t.b, this.b) && T(t.alpha, this.alpha);
	}
	format() {
		return "lab";
	}
	setAlpha(t) {
		return new e(this.l, this.a, this.b, t, void 0);
	}
	asString(e) {
		return e ? this.as(e).asString() : this.#a(this.l, this.a, this.b);
	}
	#a(e, t, n) {
		let r = this.alpha === null || T(this.alpha, 1) ? "" : ` / ${o(this.alpha)}`;
		return `lab(${o(e, 0)} ${o(t)} ${o(n)}${r})`;
	}
	getAuthoredText() {
		return this.#e ?? null;
	}
	getRawParameters() {
		return [...this.#t];
	}
	getAsRawString(e) {
		return e ? this.as(e).getAsRawString() : this.#a(...this.#t);
	}
	isGamutClipped() {
		return !1;
	}
	static fromSpec(t, n) {
		let r = S(t[0], [0, 100]) ?? C(t[0]);
		if (r === null) return null;
		let i = S(t[1], [0, 125]) ?? C(t[1]);
		if (i === null) return null;
		let a = S(t[2], [0, 125]) ?? C(t[2]);
		if (a === null) return null;
		let o = gt(t[3]);
		return new e(r, i, a, o, n);
	}
}, O = class e {
	#e;
	l;
	c;
	h;
	alpha;
	#t;
	channels = [
		"l",
		"c",
		"h",
		"alpha"
	];
	static #n = {
		hex: (e) => new F(e.#i(!1), "hex"),
		hexa: (e) => new F(e.#i(!0), "hexa"),
		rgb: (e) => new F(e.#i(!1), "rgb"),
		rgba: (e) => new F(e.#i(!0), "rgba"),
		hsl: (e) => new M(...y(e.#i(!1)), e.alpha),
		hsla: (e) => new M(...y(e.#i(!1)), e.alpha),
		hwb: (e) => new N(...b(e.#i(!1)), e.alpha),
		hwba: (e) => new N(...b(e.#i(!1)), e.alpha),
		lch: (e) => e,
		oklch: (e) => new A(...v.xyzd50ToOklch(...e.#r()), e.alpha),
		lab: (e) => new D(...v.lchToLab(e.l, e.c, e.h), e.alpha),
		oklab: (e) => new k(...v.xyzd65ToOklab(...v.xyzd50ToD65(...e.#r())), e.alpha),
		srgb: (e) => new j("srgb", ...v.xyzd50ToSrgb(...e.#r()), e.alpha),
		"srgb-linear": (e) => new j("srgb-linear", ...v.xyzd50TosRGBLinear(...e.#r()), e.alpha),
		"display-p3": (e) => new j("display-p3", ...v.xyzd50ToDisplayP3(...e.#r()), e.alpha),
		"a98-rgb": (e) => new j("a98-rgb", ...v.xyzd50ToAdobeRGB(...e.#r()), e.alpha),
		"prophoto-rgb": (e) => new j("prophoto-rgb", ...v.xyzd50ToProPhoto(...e.#r()), e.alpha),
		rec2020: (e) => new j("rec2020", ...v.xyzd50ToRec2020(...e.#r()), e.alpha),
		xyz: (e) => new j("xyz", ...v.xyzd50ToD65(...e.#r()), e.alpha),
		"xyz-d50": (e) => new j("xyz-d50", ...e.#r(), e.alpha),
		"xyz-d65": (e) => new j("xyz-d65", ...v.xyzd50ToD65(...e.#r()), e.alpha)
	};
	#r() {
		return v.labToXyzd50(...v.lchToLab(this.l, this.c, this.h));
	}
	#i(e = !0) {
		let t = v.xyzd50ToSrgb(...this.#r());
		return e ? [...t, this.alpha ?? void 0] : t;
	}
	constructor(e, t, n, r, i) {
		this.#e = [
			e,
			t,
			n
		], this.l = x(e, {
			min: 0,
			max: 100
		}), t = T(this.l, 0, w) || T(this.l, 100, w) ? 0 : t, this.c = x(t, { min: 0 }), n = T(t, 0) ? 0 : n, this.h = ct(n), this.alpha = x(r, {
			min: 0,
			max: 1
		}), this.#t = i;
	}
	asLegacyColor() {
		return this.as("rgba");
	}
	is(e) {
		return e === this.format();
	}
	as(t) {
		return e.#n[t](this);
	}
	equal(e) {
		let t = e.as("lch");
		return T(t.l, this.l, w) && T(t.c, this.c) && T(t.h, this.h) && T(t.alpha, this.alpha);
	}
	format() {
		return "lch";
	}
	setAlpha(t) {
		return new e(this.l, this.c, this.h, t);
	}
	asString(e) {
		return e ? this.as(e).asString() : this.#a(this.l, this.c, this.h);
	}
	#a(e, t, n) {
		let r = this.alpha === null || T(this.alpha, 1) ? "" : ` / ${o(this.alpha)}`;
		return `lch(${o(e, 0)} ${o(t)} ${o(n)}${r})`;
	}
	getAuthoredText() {
		return this.#t ?? null;
	}
	getRawParameters() {
		return [...this.#e];
	}
	getAsRawString(e) {
		return e ? this.as(e).getAsRawString() : this.#a(...this.#e);
	}
	isGamutClipped() {
		return !1;
	}
	isHuePowerless() {
		return T(this.c, 0, Mt);
	}
	static fromSpec(t, n) {
		let r = S(t[0], [0, 100]) ?? C(t[0]);
		if (r === null) return null;
		let i = S(t[1], [0, 150]) ?? C(t[1]);
		if (i === null) return null;
		let a = lt(t[2]);
		if (a === null) return null;
		let o = gt(t[3]);
		return new e(r, i, a, o, n);
	}
}, k = class e {
	#e;
	l;
	a;
	b;
	alpha;
	#t;
	channels = [
		"l",
		"a",
		"b",
		"alpha"
	];
	static #n = {
		hex: (e) => new F(e.#i(!1), "hex"),
		hexa: (e) => new F(e.#i(!0), "hexa"),
		rgb: (e) => new F(e.#i(!1), "rgb"),
		rgba: (e) => new F(e.#i(!0), "rgba"),
		hsl: (e) => new M(...y(e.#i(!1)), e.alpha),
		hsla: (e) => new M(...y(e.#i(!1)), e.alpha),
		hwb: (e) => new N(...b(e.#i(!1)), e.alpha),
		hwba: (e) => new N(...b(e.#i(!1)), e.alpha),
		lch: (e) => new O(...v.labToLch(...v.xyzd50ToLab(...e.#r())), e.alpha),
		oklch: (e) => new A(...v.xyzd50ToOklch(...e.#r()), e.alpha),
		lab: (e) => new D(...v.xyzd50ToLab(...e.#r()), e.alpha),
		oklab: (e) => e,
		srgb: (e) => new j("srgb", ...v.xyzd50ToSrgb(...e.#r()), e.alpha),
		"srgb-linear": (e) => new j("srgb-linear", ...v.xyzd50TosRGBLinear(...e.#r()), e.alpha),
		"display-p3": (e) => new j("display-p3", ...v.xyzd50ToDisplayP3(...e.#r()), e.alpha),
		"a98-rgb": (e) => new j("a98-rgb", ...v.xyzd50ToAdobeRGB(...e.#r()), e.alpha),
		"prophoto-rgb": (e) => new j("prophoto-rgb", ...v.xyzd50ToProPhoto(...e.#r()), e.alpha),
		rec2020: (e) => new j("rec2020", ...v.xyzd50ToRec2020(...e.#r()), e.alpha),
		xyz: (e) => new j("xyz", ...v.xyzd50ToD65(...e.#r()), e.alpha),
		"xyz-d50": (e) => new j("xyz-d50", ...e.#r(), e.alpha),
		"xyz-d65": (e) => new j("xyz-d65", ...v.xyzd50ToD65(...e.#r()), e.alpha)
	};
	#r() {
		return v.xyzd65ToD50(...v.oklabToXyzd65(this.l, this.a, this.b));
	}
	#i(e = !0) {
		let t = v.xyzd50ToSrgb(...this.#r());
		return e ? [...t, this.alpha ?? void 0] : t;
	}
	constructor(e, t, n, r, i) {
		this.#e = [
			e,
			t,
			n
		], this.l = x(e, {
			min: 0,
			max: 1
		}), (T(this.l, 0) || T(this.l, 1)) && (t = n = 0), this.a = t, this.b = n, this.alpha = x(r, {
			min: 0,
			max: 1
		}), this.#t = i;
	}
	asLegacyColor() {
		return this.as("rgba");
	}
	is(e) {
		return e === this.format();
	}
	as(t) {
		return e.#n[t](this);
	}
	equal(e) {
		let t = e.as("oklab");
		return T(t.l, this.l) && T(t.a, this.a) && T(t.b, this.b) && T(t.alpha, this.alpha);
	}
	format() {
		return "oklab";
	}
	setAlpha(t) {
		return new e(this.l, this.a, this.b, t);
	}
	asString(e) {
		return e ? this.as(e).asString() : this.#a(this.l, this.a, this.b);
	}
	#a(e, t, n) {
		let r = this.alpha === null || T(this.alpha, 1) ? "" : ` / ${o(this.alpha)}`;
		return `oklab(${o(e)} ${o(t)} ${o(n)}${r})`;
	}
	getAuthoredText() {
		return this.#t ?? null;
	}
	getRawParameters() {
		return [...this.#e];
	}
	getAsRawString(e) {
		return e ? this.as(e).getAsRawString() : this.#a(...this.#e);
	}
	isGamutClipped() {
		return !1;
	}
	static fromSpec(t, n) {
		let r = S(t[0], [0, 1]) ?? C(t[0]);
		if (r === null) return null;
		let i = S(t[1], [0, .4]) ?? C(t[1]);
		if (i === null) return null;
		let a = S(t[2], [0, .4]) ?? C(t[2]);
		if (a === null) return null;
		let o = gt(t[3]);
		return new e(r, i, a, o, n);
	}
}, A = class e {
	#e;
	l;
	c;
	h;
	alpha;
	#t;
	channels = [
		"l",
		"c",
		"h",
		"alpha"
	];
	static #n = {
		hex: (e) => new F(e.#i(!1), "hex"),
		hexa: (e) => new F(e.#i(!0), "hexa"),
		rgb: (e) => new F(e.#i(!1), "rgb"),
		rgba: (e) => new F(e.#i(!0), "rgba"),
		hsl: (e) => new M(...y(e.#i(!1)), e.alpha),
		hsla: (e) => new M(...y(e.#i(!1)), e.alpha),
		hwb: (e) => new N(...b(e.#i(!1)), e.alpha),
		hwba: (e) => new N(...b(e.#i(!1)), e.alpha),
		lch: (e) => new O(...v.labToLch(...v.xyzd50ToLab(...e.#r())), e.alpha),
		oklch: (e) => e,
		lab: (e) => new D(...v.xyzd50ToLab(...e.#r()), e.alpha),
		oklab: (e) => new k(...v.xyzd65ToOklab(...v.xyzd50ToD65(...e.#r())), e.alpha),
		srgb: (e) => new j("srgb", ...v.xyzd50ToSrgb(...e.#r()), e.alpha),
		"srgb-linear": (e) => new j("srgb-linear", ...v.xyzd50TosRGBLinear(...e.#r()), e.alpha),
		"display-p3": (e) => new j("display-p3", ...v.xyzd50ToDisplayP3(...e.#r()), e.alpha),
		"a98-rgb": (e) => new j("a98-rgb", ...v.xyzd50ToAdobeRGB(...e.#r()), e.alpha),
		"prophoto-rgb": (e) => new j("prophoto-rgb", ...v.xyzd50ToProPhoto(...e.#r()), e.alpha),
		rec2020: (e) => new j("rec2020", ...v.xyzd50ToRec2020(...e.#r()), e.alpha),
		xyz: (e) => new j("xyz", ...v.xyzd50ToD65(...e.#r()), e.alpha),
		"xyz-d50": (e) => new j("xyz-d50", ...e.#r(), e.alpha),
		"xyz-d65": (e) => new j("xyz-d65", ...v.xyzd50ToD65(...e.#r()), e.alpha)
	};
	#r() {
		return v.oklchToXyzd50(this.l, this.c, this.h);
	}
	#i(e = !0) {
		let t = v.xyzd50ToSrgb(...this.#r());
		return e ? [...t, this.alpha ?? void 0] : t;
	}
	constructor(e, t, n, r, i) {
		this.#e = [
			e,
			t,
			n
		], this.l = x(e, {
			min: 0,
			max: 1
		}), t = T(this.l, 0) || T(this.l, 1) ? 0 : t, this.c = x(t, { min: 0 }), n = T(t, 0) ? 0 : n, this.h = ct(n), this.alpha = x(r, {
			min: 0,
			max: 1
		}), this.#t = i;
	}
	asLegacyColor() {
		return this.as("rgba");
	}
	is(e) {
		return e === this.format();
	}
	as(t) {
		return e.#n[t](this);
	}
	equal(e) {
		let t = e.as("oklch");
		return T(t.l, this.l) && T(t.c, this.c) && T(t.h, this.h) && T(t.alpha, this.alpha);
	}
	format() {
		return "oklch";
	}
	setAlpha(t) {
		return new e(this.l, this.c, this.h, t);
	}
	asString(e) {
		return e ? this.as(e).asString() : this.#a(this.l, this.c, this.h);
	}
	#a(e, t, n) {
		let r = this.alpha === null || T(this.alpha, 1) ? "" : ` / ${o(this.alpha)}`;
		return `oklch(${o(e)} ${o(t)} ${o(n)}${r})`;
	}
	getAuthoredText() {
		return this.#t ?? null;
	}
	getRawParameters() {
		return [...this.#e];
	}
	getAsRawString(e) {
		return e ? this.as(e).getAsRawString() : this.#a(...this.#e);
	}
	isGamutClipped() {
		return !1;
	}
	static fromSpec(t, n) {
		let r = S(t[0], [0, 1]) ?? C(t[0]);
		if (r === null) return null;
		let i = S(t[1], [0, .4]) ?? C(t[1]);
		if (i === null) return null;
		let a = lt(t[2]);
		if (a === null) return null;
		let o = gt(t[3]);
		return new e(r, i, a, o, n);
	}
}, j = class e {
	#e;
	p0;
	p1;
	p2;
	alpha;
	colorSpace;
	#t;
	get channels() {
		return this.isXYZ() ? [
			"x",
			"y",
			"z",
			"alpha"
		] : [
			"r",
			"g",
			"b",
			"alpha"
		];
	}
	static #n = {
		hex: (e) => new F(e.#i(!1), "hex"),
		hexa: (e) => new F(e.#i(!0), "hexa"),
		rgb: (e) => new F(e.#i(!1), "rgb"),
		rgba: (e) => new F(e.#i(!0), "rgba"),
		hsl: (e) => new M(...y(e.#i(!1)), e.alpha),
		hsla: (e) => new M(...y(e.#i(!1)), e.alpha),
		hwb: (e) => new N(...b(e.#i(!1)), e.alpha),
		hwba: (e) => new N(...b(e.#i(!1)), e.alpha),
		lch: (e) => new O(...v.labToLch(...v.xyzd50ToLab(...e.#r())), e.alpha),
		oklch: (e) => new A(...v.xyzd50ToOklch(...e.#r()), e.alpha),
		lab: (e) => new D(...v.xyzd50ToLab(...e.#r()), e.alpha),
		oklab: (e) => new k(...v.xyzd65ToOklab(...v.xyzd50ToD65(...e.#r())), e.alpha),
		srgb: (t) => new e("srgb", ...v.xyzd50ToSrgb(...t.#r()), t.alpha),
		"srgb-linear": (t) => new e("srgb-linear", ...v.xyzd50TosRGBLinear(...t.#r()), t.alpha),
		"display-p3": (t) => new e("display-p3", ...v.xyzd50ToDisplayP3(...t.#r()), t.alpha),
		"a98-rgb": (t) => new e("a98-rgb", ...v.xyzd50ToAdobeRGB(...t.#r()), t.alpha),
		"prophoto-rgb": (t) => new e("prophoto-rgb", ...v.xyzd50ToProPhoto(...t.#r()), t.alpha),
		rec2020: (t) => new e("rec2020", ...v.xyzd50ToRec2020(...t.#r()), t.alpha),
		xyz: (t) => new e("xyz", ...v.xyzd50ToD65(...t.#r()), t.alpha),
		"xyz-d50": (t) => new e("xyz-d50", ...t.#r(), t.alpha),
		"xyz-d65": (t) => new e("xyz-d65", ...v.xyzd50ToD65(...t.#r()), t.alpha)
	};
	#r() {
		let [e, t, n] = this.#e;
		switch (this.colorSpace) {
			case "srgb": return v.srgbToXyzd50(e, t, n);
			case "srgb-linear": return v.srgbLinearToXyzd50(e, t, n);
			case "display-p3": return v.displayP3ToXyzd50(e, t, n);
			case "a98-rgb": return v.adobeRGBToXyzd50(e, t, n);
			case "prophoto-rgb": return v.proPhotoToXyzd50(e, t, n);
			case "rec2020": return v.rec2020ToXyzd50(e, t, n);
			case "xyz-d50": return [
				e,
				t,
				n
			];
			case "xyz":
			case "xyz-d65": return v.xyzd65ToD50(e, t, n);
		}
		throw Error("Invalid color space");
	}
	#i(e = !0) {
		let [t, n, r] = this.#e, i = this.colorSpace === "srgb" ? [
			t,
			n,
			r
		] : [...v.xyzd50ToSrgb(...this.#r())];
		return e ? [...i, this.alpha ?? void 0] : i;
	}
	constructor(e, t, n, r, i, a) {
		this.#e = [
			t,
			n,
			r
		], this.colorSpace = e, this.#t = a, this.colorSpace !== "xyz-d50" && this.colorSpace !== "xyz-d65" && this.colorSpace !== "xyz" && (t = x(t, {
			min: 0,
			max: 1
		}), n = x(n, {
			min: 0,
			max: 1
		}), r = x(r, {
			min: 0,
			max: 1
		})), this.p0 = t, this.p1 = n, this.p2 = r, this.alpha = x(i, {
			min: 0,
			max: 1
		});
	}
	asLegacyColor() {
		return this.as("rgba");
	}
	is(e) {
		return e === this.format();
	}
	as(t) {
		return this.colorSpace === t ? this : e.#n[t](this);
	}
	equal(e) {
		let t = e.as(this.colorSpace);
		return T(this.p0, t.p0) && T(this.p1, t.p1) && T(this.p2, t.p2) && T(this.alpha, t.alpha);
	}
	format() {
		return this.colorSpace;
	}
	setAlpha(t) {
		return new e(this.colorSpace, this.p0, this.p1, this.p2, t);
	}
	asString(e) {
		return e ? this.as(e).asString() : this.#a(this.p0, this.p1, this.p2);
	}
	#a(e, t, n) {
		let r = this.alpha === null || T(this.alpha, 1) ? "" : ` / ${o(this.alpha)}`;
		return `color(${this.colorSpace} ${o(e)} ${o(t)} ${o(n)}${r})`;
	}
	getAuthoredText() {
		return this.#t ?? null;
	}
	getRawParameters() {
		return [...this.#e];
	}
	getAsRawString(e) {
		return e ? this.as(e).getAsRawString() : this.#a(...this.#e);
	}
	isGamutClipped() {
		return this.colorSpace !== "xyz-d50" && this.colorSpace !== "xyz-d65" && this.colorSpace !== "xyz" && !T(this.#e, [
			this.p0,
			this.p1,
			this.p2
		]);
	}
	isXYZ() {
		switch (this.colorSpace) {
			case "xyz":
			case "xyz-d50":
			case "xyz-d65": return !0;
		}
		return !1;
	}
	static fromSpec(t, n) {
		let [r, i] = n.split("/", 2), [a, ...o] = r.trim().split(/\s+/), s = dt(a);
		if (!s) return null;
		if (o.length === 0 && i === void 0) return new e(s, 0, 0, 0, null, t);
		if (o.length === 0 && i !== void 0 && i.trim().split(/\s+/).length > 1 || o.length > 3) return null;
		let c = o.map((e) => e === "none" ? "0" : e).map((e) => _t(e, [0, 1]));
		if (c.includes(null)) return null;
		let l = i ? _t(i, [0, 1]) ?? 1 : 1, u = [
			c[0] ?? 0,
			c[1] ?? 0,
			c[2] ?? 0,
			l
		];
		return new e(s, ...u, t);
	}
}, M = class e {
	h;
	s;
	l;
	alpha;
	#e;
	#t;
	channels = [
		"h",
		"s",
		"l",
		"alpha"
	];
	static #n = {
		hex: (e) => new F(e.#r(!1), "hex"),
		hexa: (e) => new F(e.#r(!0), "hexa"),
		rgb: (e) => new F(e.#r(!1), "rgb"),
		rgba: (e) => new F(e.#r(!0), "rgba"),
		hsl: (e) => e,
		hsla: (e) => e,
		hwb: (e) => new N(...b(e.#r(!1)), e.alpha),
		hwba: (e) => new N(...b(e.#r(!1)), e.alpha),
		lch: (e) => new O(...v.labToLch(...v.xyzd50ToLab(...e.#i())), e.alpha),
		oklch: (e) => new A(...v.xyzd50ToOklch(...e.#i()), e.alpha),
		lab: (e) => new D(...v.xyzd50ToLab(...e.#i()), e.alpha),
		oklab: (e) => new k(...v.xyzd65ToOklab(...v.xyzd50ToD65(...e.#i())), e.alpha),
		srgb: (e) => new j("srgb", ...v.xyzd50ToSrgb(...e.#i()), e.alpha),
		"srgb-linear": (e) => new j("srgb-linear", ...v.xyzd50TosRGBLinear(...e.#i()), e.alpha),
		"display-p3": (e) => new j("display-p3", ...v.xyzd50ToDisplayP3(...e.#i()), e.alpha),
		"a98-rgb": (e) => new j("a98-rgb", ...v.xyzd50ToAdobeRGB(...e.#i()), e.alpha),
		"prophoto-rgb": (e) => new j("prophoto-rgb", ...v.xyzd50ToProPhoto(...e.#i()), e.alpha),
		rec2020: (e) => new j("rec2020", ...v.xyzd50ToRec2020(...e.#i()), e.alpha),
		xyz: (e) => new j("xyz", ...v.xyzd50ToD65(...e.#i()), e.alpha),
		"xyz-d50": (e) => new j("xyz-d50", ...e.#i(), e.alpha),
		"xyz-d65": (e) => new j("xyz-d65", ...v.xyzd50ToD65(...e.#i()), e.alpha)
	};
	#r(e = !0) {
		let t = Ct([
			this.h,
			this.s,
			this.l,
			0
		]);
		return e ? [
			t[0],
			t[1],
			t[2],
			this.alpha ?? void 0
		] : [
			t[0],
			t[1],
			t[2]
		];
	}
	#i() {
		let e = this.#r(!1);
		return v.srgbToXyzd50(e[0], e[1], e[2]);
	}
	constructor(e, t, n, r, i) {
		this.#e = [
			e,
			t,
			n
		], this.l = x(n, {
			min: 0,
			max: 1
		}), t = T(this.l, 0) || T(this.l, 1) ? 0 : t, this.s = x(t, {
			min: 0,
			max: 1
		}), e = T(this.s, 0, Mt) ? 0 : e, this.h = ct(e * 360) / 360, this.alpha = x(r ?? null, {
			min: 0,
			max: 1
		}), this.#t = i;
	}
	equal(e) {
		let t = e.as("hsl");
		return T(this.h, t.h) && T(this.s, t.s) && T(this.l, t.l) && T(this.alpha, t.alpha);
	}
	asString(e) {
		return e ? this.as(e).asString() : this.#a(this.h, this.s, this.l);
	}
	#a(e, t, n) {
		let r = c("hsl(%sdeg %s% %s%", o(e * 360), o(t * 100), o(n * 100));
		return this.alpha !== null && this.alpha !== 1 ? r + c(" / %s%)", o(this.alpha * 100)) : r + ")";
	}
	setAlpha(t) {
		return new e(this.h, this.s, this.l, t);
	}
	format() {
		return this.alpha === null || this.alpha === 1 ? "hsl" : "hsla";
	}
	is(e) {
		return e === this.format();
	}
	as(t) {
		return t === this.format() ? this : e.#n[t](this);
	}
	asLegacyColor() {
		return this.as("rgba");
	}
	getAuthoredText() {
		return this.#t ?? null;
	}
	getRawParameters() {
		return [...this.#e];
	}
	getAsRawString(e) {
		return e ? this.as(e).getAsRawString() : this.#a(...this.#e);
	}
	isGamutClipped() {
		return !E(this.#e[1], 1) || !E(0, this.#e[1]);
	}
	static fromSpec(t, n) {
		let r = yt(t[0]);
		if (r === null) return null;
		let i = bt(t[1]);
		if (i === null) return null;
		let a = bt(t[2]);
		if (a === null) return null;
		let o = gt(t[3]);
		return new e(r, i, a, o, n);
	}
	hsva() {
		let e = this.s * (this.l < .5 ? this.l : 1 - this.l);
		return [
			this.h,
			e === 0 ? 0 : 2 * e / (this.l + e),
			this.l + e,
			this.alpha ?? 1
		];
	}
	canonicalHSLA() {
		return [
			Math.round(this.h * 360),
			Math.round(this.s * 100),
			Math.round(this.l * 100),
			this.alpha ?? 1
		];
	}
}, N = class e {
	h;
	w;
	b;
	alpha;
	#e;
	#t;
	channels = [
		"h",
		"w",
		"b",
		"alpha"
	];
	static #n = {
		hex: (e) => new F(e.#r(!1), "hex"),
		hexa: (e) => new F(e.#r(!0), "hexa"),
		rgb: (e) => new F(e.#r(!1), "rgb"),
		rgba: (e) => new F(e.#r(!0), "rgba"),
		hsl: (e) => new M(...y(e.#r(!1)), e.alpha),
		hsla: (e) => new M(...y(e.#r(!1)), e.alpha),
		hwb: (e) => e,
		hwba: (e) => e,
		lch: (e) => new O(...v.labToLch(...v.xyzd50ToLab(...e.#i())), e.alpha),
		oklch: (e) => new A(...v.xyzd50ToOklch(...e.#i()), e.alpha),
		lab: (e) => new D(...v.xyzd50ToLab(...e.#i()), e.alpha),
		oklab: (e) => new k(...v.xyzd65ToOklab(...v.xyzd50ToD65(...e.#i())), e.alpha),
		srgb: (e) => new j("srgb", ...v.xyzd50ToSrgb(...e.#i()), e.alpha),
		"srgb-linear": (e) => new j("srgb-linear", ...v.xyzd50TosRGBLinear(...e.#i()), e.alpha),
		"display-p3": (e) => new j("display-p3", ...v.xyzd50ToDisplayP3(...e.#i()), e.alpha),
		"a98-rgb": (e) => new j("a98-rgb", ...v.xyzd50ToAdobeRGB(...e.#i()), e.alpha),
		"prophoto-rgb": (e) => new j("prophoto-rgb", ...v.xyzd50ToProPhoto(...e.#i()), e.alpha),
		rec2020: (e) => new j("rec2020", ...v.xyzd50ToRec2020(...e.#i()), e.alpha),
		xyz: (e) => new j("xyz", ...v.xyzd50ToD65(...e.#i()), e.alpha),
		"xyz-d50": (e) => new j("xyz-d50", ...e.#i(), e.alpha),
		"xyz-d65": (e) => new j("xyz-d65", ...v.xyzd50ToD65(...e.#i()), e.alpha)
	};
	#r(e = !0) {
		let t = wt([
			this.h,
			this.w,
			this.b,
			0
		]);
		return e ? [
			t[0],
			t[1],
			t[2],
			this.alpha ?? void 0
		] : [
			t[0],
			t[1],
			t[2]
		];
	}
	#i() {
		let e = this.#r(!1);
		return v.srgbToXyzd50(e[0], e[1], e[2]);
	}
	constructor(e, t, n, r, i) {
		if (this.#e = [
			e,
			t,
			n
		], this.w = x(t, {
			min: 0,
			max: 1
		}), this.b = x(n, {
			min: 0,
			max: 1
		}), e = E(1, this.w + this.b) ? 0 : e, this.h = ct(e * 360) / 360, this.alpha = x(r, {
			min: 0,
			max: 1
		}), E(1, this.w + this.b)) {
			let e = this.w / this.b;
			this.b = 1 / (1 + e), this.w = 1 - this.b;
		}
		this.#t = i;
	}
	equal(e) {
		let t = e.as("hwb");
		return T(this.h, t.h) && T(this.w, t.w) && T(this.b, t.b) && T(this.alpha, t.alpha);
	}
	asString(e) {
		return e ? this.as(e).asString() : this.#a(this.h, this.w, this.b);
	}
	#a(e, t, n) {
		let r = c("hwb(%sdeg %s% %s%", o(e * 360), o(t * 100), o(n * 100));
		return this.alpha !== null && this.alpha !== 1 ? r + c(" / %s%)", o(this.alpha * 100)) : r + ")";
	}
	setAlpha(t) {
		return new e(this.h, this.w, this.b, t, this.#t);
	}
	format() {
		return this.alpha !== null && !T(this.alpha, 1) ? "hwba" : "hwb";
	}
	is(e) {
		return e === this.format();
	}
	as(t) {
		return t === this.format() ? this : e.#n[t](this);
	}
	asLegacyColor() {
		return this.as("rgba");
	}
	getAuthoredText() {
		return this.#t ?? null;
	}
	canonicalHWBA() {
		return [
			Math.round(this.h * 360),
			Math.round(this.w * 100),
			Math.round(this.b * 100),
			this.alpha ?? 1
		];
	}
	getRawParameters() {
		return [...this.#e];
	}
	getAsRawString(e) {
		return e ? this.as(e).getAsRawString() : this.#a(...this.#e);
	}
	isGamutClipped() {
		return !E(this.#e[1], 1) || !E(0, this.#e[1]) || !E(this.#e[2], 1) || !E(0, this.#e[2]);
	}
	static fromSpec(t, n) {
		let r = yt(t[0]);
		if (r === null) return null;
		let i = bt(t[1]);
		if (i === null) return null;
		let a = bt(t[2]);
		if (a === null) return null;
		let o = gt(t[3]);
		return new e(r, i, a, o, n);
	}
};
function P(e) {
	return Math.round(e * 255);
}
var Pt = class {
	color;
	channels = [
		"r",
		"g",
		"b",
		"alpha"
	];
	constructor(e) {
		this.color = e;
	}
	get alpha() {
		return this.color.alpha;
	}
	rgba() {
		return this.color.rgba();
	}
	equal(e) {
		return this.color.equal(e);
	}
	setAlpha(e) {
		return this.color.setAlpha(e);
	}
	format() {
		return (this.alpha ?? 1) === 1 ? "hex" : "hexa";
	}
	as(e) {
		return this.color.as(e);
	}
	is(e) {
		return this.color.is(e);
	}
	asLegacyColor() {
		return this.color.asLegacyColor();
	}
	getAuthoredText() {
		return this.color.getAuthoredText();
	}
	getRawParameters() {
		return this.color.getRawParameters();
	}
	isGamutClipped() {
		return this.color.isGamutClipped();
	}
	asString(e) {
		if (e) return this.as(e).asString();
		let [t, n, r] = this.color.rgba();
		return this.stringify(t, n, r);
	}
	getAsRawString(e) {
		if (e) return this.as(e).getAsRawString();
		let [t, n, r] = this.getRawParameters();
		return this.stringify(t, n, r);
	}
}, Ft = class e extends Pt {
	setAlpha(t) {
		return new e(this.color.setAlpha(t));
	}
	asString(e) {
		return e && e !== this.format() ? super.as(e).asString() : super.asString();
	}
	stringify(e, t, n) {
		function r(e) {
			return (Math.round(e * 255) / 17).toString(16);
		}
		return this.color.hasAlpha() ? c("#%s%s%s%s", r(e), r(t), r(n), r(this.alpha ?? 1)).toLowerCase() : c("#%s%s%s", r(e), r(t), r(n)).toLowerCase();
	}
}, It = class e extends Pt {
	nickname;
	constructor(e, t) {
		super(t), this.nickname = e;
	}
	static fromName(t, n) {
		let r = t.toLowerCase(), i = Rt.get(r);
		return i === void 0 ? null : new e(r, F.fromRGBA(i, n));
	}
	stringify() {
		return this.nickname;
	}
	getAsRawString(e) {
		return this.color.getAsRawString(e);
	}
}, F = class e {
	#e;
	#t;
	#n;
	#r;
	channels = [
		"r",
		"g",
		"b",
		"alpha"
	];
	static #i = {
		hex: (t) => new e(t.#t, "hex"),
		hexa: (t) => new e(t.#t, "hexa"),
		rgb: (t) => new e(t.#t, "rgb"),
		rgba: (t) => new e(t.#t, "rgba"),
		hsl: (e) => new M(...y([
			e.#t[0],
			e.#t[1],
			e.#t[2]
		]), e.alpha),
		hsla: (e) => new M(...y([
			e.#t[0],
			e.#t[1],
			e.#t[2]
		]), e.alpha),
		hwb: (e) => new N(...b([
			e.#t[0],
			e.#t[1],
			e.#t[2]
		]), e.alpha),
		hwba: (e) => new N(...b([
			e.#t[0],
			e.#t[1],
			e.#t[2]
		]), e.alpha),
		lch: (e) => new O(...v.labToLch(...v.xyzd50ToLab(...e.#a())), e.alpha),
		oklch: (e) => new A(...v.xyzd50ToOklch(...e.#a()), e.alpha),
		lab: (e) => new D(...v.xyzd50ToLab(...e.#a()), e.alpha),
		oklab: (e) => new k(...v.xyzd65ToOklab(...v.xyzd50ToD65(...e.#a())), e.alpha),
		srgb: (e) => new j("srgb", ...v.xyzd50ToSrgb(...e.#a()), e.alpha),
		"srgb-linear": (e) => new j("srgb-linear", ...v.xyzd50TosRGBLinear(...e.#a()), e.alpha),
		"display-p3": (e) => new j("display-p3", ...v.xyzd50ToDisplayP3(...e.#a()), e.alpha),
		"a98-rgb": (e) => new j("a98-rgb", ...v.xyzd50ToAdobeRGB(...e.#a()), e.alpha),
		"prophoto-rgb": (e) => new j("prophoto-rgb", ...v.xyzd50ToProPhoto(...e.#a()), e.alpha),
		rec2020: (e) => new j("rec2020", ...v.xyzd50ToRec2020(...e.#a()), e.alpha),
		xyz: (e) => new j("xyz", ...v.xyzd50ToD65(...e.#a()), e.alpha),
		"xyz-d50": (e) => new j("xyz-d50", ...e.#a(), e.alpha),
		"xyz-d65": (e) => new j("xyz-d65", ...v.xyzd50ToD65(...e.#a()), e.alpha)
	};
	#a() {
		let [e, t, n] = this.#t;
		return v.srgbToXyzd50(e, t, n);
	}
	get alpha() {
		switch (this.format()) {
			case "hexa":
			case "rgba": return this.#t[3];
			default: return null;
		}
	}
	asLegacyColor() {
		return this;
	}
	nickname() {
		let e = zt.get(String(this.canonicalRGBA()));
		return e ? new It(e, this) : null;
	}
	shortHex() {
		for (let e = 0; e < 4; ++e) if (Math.round(this.#t[e] * 255) % 17) return null;
		return new Ft(this);
	}
	constructor(e, t, n) {
		this.#n = n || null, this.#r = t, this.#e = [
			e[0],
			e[1],
			e[2]
		], this.#t = [
			x(e[0], {
				min: 0,
				max: 1
			}),
			x(e[1], {
				min: 0,
				max: 1
			}),
			x(e[2], {
				min: 0,
				max: 1
			}),
			x(e[3] ?? 1, {
				min: 0,
				max: 1
			})
		];
	}
	static fromHex(t, n) {
		t = t.toLowerCase();
		let r = t.length === 4 || t.length === 8 ? "hexa" : "hex", i = t.length <= 4;
		i && (t = t.charAt(0) + t.charAt(0) + t.charAt(1) + t.charAt(1) + t.charAt(2) + t.charAt(2) + t.charAt(3) + t.charAt(3));
		let a = parseInt(t.substring(0, 2), 16), o = parseInt(t.substring(2, 4), 16), s = parseInt(t.substring(4, 6), 16), c = 1;
		t.length === 8 && (c = parseInt(t.substring(6, 8), 16) / 255);
		let l = new e([
			a / 255,
			o / 255,
			s / 255,
			c
		], r, n);
		return i ? new Ft(l) : l;
	}
	static fromRGBAFunction(t, n, r, i, a) {
		let o = [
			vt(t),
			vt(n),
			vt(r),
			i ? xt(i) : 1
		];
		return fe(o) ? new e(o, i ? "rgba" : "rgb", a) : null;
	}
	static fromRGBA(t, n) {
		return new e([
			t[0] / 255,
			t[1] / 255,
			t[2] / 255,
			t[3]
		], "rgba", n);
	}
	static fromHSVA(t) {
		let n = Tt(t);
		return new e(n, "rgba");
	}
	is(e) {
		return e === this.format();
	}
	as(t) {
		return t === this.format() ? this : e.#i[t](this);
	}
	format() {
		return this.#r;
	}
	hasAlpha() {
		return this.#t[3] !== 1;
	}
	detectHEXFormat() {
		return this.hasAlpha() ? "hexa" : "hex";
	}
	asString(e) {
		return e ? this.as(e).asString() : this.#o(e, this.#t[0], this.#t[1], this.#t[2]);
	}
	#o(e, t, n, r) {
		e ||= this.#r;
		function i(e) {
			let t = Math.round(e * 255).toString(16);
			return t.length === 1 ? "0" + t : t;
		}
		switch (e) {
			case "rgb":
			case "rgba": {
				let e = c("rgb(%d %d %d", P(t), P(n), P(r));
				return this.hasAlpha() ? e + c(" / %d%)", Math.round(this.#t[3] * 100)) : e + ")";
			}
			case "hex":
			case "hexa": return this.hasAlpha() ? c("#%s%s%s%s", i(t), i(n), i(r), i(this.#t[3])).toLowerCase() : c("#%s%s%s", i(t), i(n), i(r)).toLowerCase();
		}
	}
	getAuthoredText() {
		return this.#n ?? null;
	}
	getRawParameters() {
		return [...this.#e];
	}
	getAsRawString(e) {
		return e ? this.as(e).getAsRawString() : this.#o(e, ...this.#e);
	}
	isGamutClipped() {
		return !T(this.#e.map(P), [
			this.#t[0],
			this.#t[1],
			this.#t[2]
		].map(P), w);
	}
	rgba() {
		return [...this.#t];
	}
	canonicalRGBA() {
		let e = [
			,
			,
			,
			,
		];
		for (let t = 0; t < 3; ++t) e[t] = Math.round(this.#t[t] * 255);
		return e[3] = this.#t[3], e;
	}
	toProtocolRGBA() {
		let e = this.canonicalRGBA(), t = {
			r: e[0],
			g: e[1],
			b: e[2]
		};
		return e[3] !== 1 && (t.a = e[3]), t;
	}
	invert() {
		let t = [
			0,
			0,
			0,
			0
		];
		return t[0] = 1 - this.#t[0], t[1] = 1 - this.#t[1], t[2] = 1 - this.#t[2], t[3] = this.#t[3], new e(t, "rgba");
	}
	grayscale() {
		let [t, n, r] = this.#t, i = t * .299 + n * .587 + r * .114;
		return new e([
			i,
			i,
			i,
			.5
		], "rgba");
	}
	setAlpha(t) {
		let n = [...this.#t];
		return n[3] = t, new e(n, "rgba");
	}
	blendWith(t) {
		let n = Pe(t.#t, this.#t);
		return new e(n, "rgba");
	}
	blendWithAlpha(t) {
		let n = [...this.#t];
		return n[3] *= t, new e(n, "rgba");
	}
	setFormat(e) {
		this.#r = e;
	}
	equal(e) {
		let t = e.as(this.#r);
		return T(P(this.#t[0]), P(t.#t[0]), w) && T(P(this.#t[1]), P(t.#t[1]), w) && T(P(this.#t[2]), P(t.#t[2]), w) && T(this.#t[3], t.#t[3]);
	}
}, Lt = [
	["aliceblue", [
		240,
		248,
		255
	]],
	["antiquewhite", [
		250,
		235,
		215
	]],
	["aqua", [
		0,
		255,
		255
	]],
	["aquamarine", [
		127,
		255,
		212
	]],
	["azure", [
		240,
		255,
		255
	]],
	["beige", [
		245,
		245,
		220
	]],
	["bisque", [
		255,
		228,
		196
	]],
	["black", [
		0,
		0,
		0
	]],
	["blanchedalmond", [
		255,
		235,
		205
	]],
	["blue", [
		0,
		0,
		255
	]],
	["blueviolet", [
		138,
		43,
		226
	]],
	["brown", [
		165,
		42,
		42
	]],
	["burlywood", [
		222,
		184,
		135
	]],
	["cadetblue", [
		95,
		158,
		160
	]],
	["chartreuse", [
		127,
		255,
		0
	]],
	["chocolate", [
		210,
		105,
		30
	]],
	["coral", [
		255,
		127,
		80
	]],
	["cornflowerblue", [
		100,
		149,
		237
	]],
	["cornsilk", [
		255,
		248,
		220
	]],
	["crimson", [
		237,
		20,
		61
	]],
	["cyan", [
		0,
		255,
		255
	]],
	["darkblue", [
		0,
		0,
		139
	]],
	["darkcyan", [
		0,
		139,
		139
	]],
	["darkgoldenrod", [
		184,
		134,
		11
	]],
	["darkgray", [
		169,
		169,
		169
	]],
	["darkgrey", [
		169,
		169,
		169
	]],
	["darkgreen", [
		0,
		100,
		0
	]],
	["darkkhaki", [
		189,
		183,
		107
	]],
	["darkmagenta", [
		139,
		0,
		139
	]],
	["darkolivegreen", [
		85,
		107,
		47
	]],
	["darkorange", [
		255,
		140,
		0
	]],
	["darkorchid", [
		153,
		50,
		204
	]],
	["darkred", [
		139,
		0,
		0
	]],
	["darksalmon", [
		233,
		150,
		122
	]],
	["darkseagreen", [
		143,
		188,
		143
	]],
	["darkslateblue", [
		72,
		61,
		139
	]],
	["darkslategray", [
		47,
		79,
		79
	]],
	["darkslategrey", [
		47,
		79,
		79
	]],
	["darkturquoise", [
		0,
		206,
		209
	]],
	["darkviolet", [
		148,
		0,
		211
	]],
	["deeppink", [
		255,
		20,
		147
	]],
	["deepskyblue", [
		0,
		191,
		255
	]],
	["dimgray", [
		105,
		105,
		105
	]],
	["dimgrey", [
		105,
		105,
		105
	]],
	["dodgerblue", [
		30,
		144,
		255
	]],
	["firebrick", [
		178,
		34,
		34
	]],
	["floralwhite", [
		255,
		250,
		240
	]],
	["forestgreen", [
		34,
		139,
		34
	]],
	["fuchsia", [
		255,
		0,
		255
	]],
	["gainsboro", [
		220,
		220,
		220
	]],
	["ghostwhite", [
		248,
		248,
		255
	]],
	["gold", [
		255,
		215,
		0
	]],
	["goldenrod", [
		218,
		165,
		32
	]],
	["gray", [
		128,
		128,
		128
	]],
	["grey", [
		128,
		128,
		128
	]],
	["green", [
		0,
		128,
		0
	]],
	["greenyellow", [
		173,
		255,
		47
	]],
	["honeydew", [
		240,
		255,
		240
	]],
	["hotpink", [
		255,
		105,
		180
	]],
	["indianred", [
		205,
		92,
		92
	]],
	["indigo", [
		75,
		0,
		130
	]],
	["ivory", [
		255,
		255,
		240
	]],
	["khaki", [
		240,
		230,
		140
	]],
	["lavender", [
		230,
		230,
		250
	]],
	["lavenderblush", [
		255,
		240,
		245
	]],
	["lawngreen", [
		124,
		252,
		0
	]],
	["lemonchiffon", [
		255,
		250,
		205
	]],
	["lightblue", [
		173,
		216,
		230
	]],
	["lightcoral", [
		240,
		128,
		128
	]],
	["lightcyan", [
		224,
		255,
		255
	]],
	["lightgoldenrodyellow", [
		250,
		250,
		210
	]],
	["lightgreen", [
		144,
		238,
		144
	]],
	["lightgray", [
		211,
		211,
		211
	]],
	["lightgrey", [
		211,
		211,
		211
	]],
	["lightpink", [
		255,
		182,
		193
	]],
	["lightsalmon", [
		255,
		160,
		122
	]],
	["lightseagreen", [
		32,
		178,
		170
	]],
	["lightskyblue", [
		135,
		206,
		250
	]],
	["lightslategray", [
		119,
		136,
		153
	]],
	["lightslategrey", [
		119,
		136,
		153
	]],
	["lightsteelblue", [
		176,
		196,
		222
	]],
	["lightyellow", [
		255,
		255,
		224
	]],
	["lime", [
		0,
		255,
		0
	]],
	["limegreen", [
		50,
		205,
		50
	]],
	["linen", [
		250,
		240,
		230
	]],
	["magenta", [
		255,
		0,
		255
	]],
	["maroon", [
		128,
		0,
		0
	]],
	["mediumaquamarine", [
		102,
		205,
		170
	]],
	["mediumblue", [
		0,
		0,
		205
	]],
	["mediumorchid", [
		186,
		85,
		211
	]],
	["mediumpurple", [
		147,
		112,
		219
	]],
	["mediumseagreen", [
		60,
		179,
		113
	]],
	["mediumslateblue", [
		123,
		104,
		238
	]],
	["mediumspringgreen", [
		0,
		250,
		154
	]],
	["mediumturquoise", [
		72,
		209,
		204
	]],
	["mediumvioletred", [
		199,
		21,
		133
	]],
	["midnightblue", [
		25,
		25,
		112
	]],
	["mintcream", [
		245,
		255,
		250
	]],
	["mistyrose", [
		255,
		228,
		225
	]],
	["moccasin", [
		255,
		228,
		181
	]],
	["navajowhite", [
		255,
		222,
		173
	]],
	["navy", [
		0,
		0,
		128
	]],
	["oldlace", [
		253,
		245,
		230
	]],
	["olive", [
		128,
		128,
		0
	]],
	["olivedrab", [
		107,
		142,
		35
	]],
	["orange", [
		255,
		165,
		0
	]],
	["orangered", [
		255,
		69,
		0
	]],
	["orchid", [
		218,
		112,
		214
	]],
	["palegoldenrod", [
		238,
		232,
		170
	]],
	["palegreen", [
		152,
		251,
		152
	]],
	["paleturquoise", [
		175,
		238,
		238
	]],
	["palevioletred", [
		219,
		112,
		147
	]],
	["papayawhip", [
		255,
		239,
		213
	]],
	["peachpuff", [
		255,
		218,
		185
	]],
	["peru", [
		205,
		133,
		63
	]],
	["pink", [
		255,
		192,
		203
	]],
	["plum", [
		221,
		160,
		221
	]],
	["powderblue", [
		176,
		224,
		230
	]],
	["purple", [
		128,
		0,
		128
	]],
	["rebeccapurple", [
		102,
		51,
		153
	]],
	["red", [
		255,
		0,
		0
	]],
	["rosybrown", [
		188,
		143,
		143
	]],
	["royalblue", [
		65,
		105,
		225
	]],
	["saddlebrown", [
		139,
		69,
		19
	]],
	["salmon", [
		250,
		128,
		114
	]],
	["sandybrown", [
		244,
		164,
		96
	]],
	["seagreen", [
		46,
		139,
		87
	]],
	["seashell", [
		255,
		245,
		238
	]],
	["sienna", [
		160,
		82,
		45
	]],
	["silver", [
		192,
		192,
		192
	]],
	["skyblue", [
		135,
		206,
		235
	]],
	["slateblue", [
		106,
		90,
		205
	]],
	["slategray", [
		112,
		128,
		144
	]],
	["slategrey", [
		112,
		128,
		144
	]],
	["snow", [
		255,
		250,
		250
	]],
	["springgreen", [
		0,
		255,
		127
	]],
	["steelblue", [
		70,
		130,
		180
	]],
	["tan", [
		210,
		180,
		140
	]],
	["teal", [
		0,
		128,
		128
	]],
	["thistle", [
		216,
		191,
		216
	]],
	["tomato", [
		255,
		99,
		71
	]],
	["turquoise", [
		64,
		224,
		208
	]],
	["violet", [
		238,
		130,
		238
	]],
	["wheat", [
		245,
		222,
		179
	]],
	["white", [
		255,
		255,
		255
	]],
	["whitesmoke", [
		245,
		245,
		245
	]],
	["yellow", [
		255,
		255,
		0
	]],
	["yellowgreen", [
		154,
		205,
		50
	]],
	["transparent", [
		0,
		0,
		0,
		0
	]]
];
console.assert(Lt.every(([e]) => e.toLowerCase() === e), "All color nicknames must be lowercase.");
var Rt = new Map(Lt), zt = new Map(Lt.map(([e, [t, n, r, i = 1]]) => [String([
	t,
	n,
	r,
	i
]), e])), Bt = [
	127,
	32,
	210
], Vt = {
	Content: F.fromRGBA([
		111,
		168,
		220,
		.66
	]),
	ContentLight: F.fromRGBA([
		111,
		168,
		220,
		.5
	]),
	ContentOutline: F.fromRGBA([
		9,
		83,
		148
	]),
	Padding: F.fromRGBA([
		147,
		196,
		125,
		.55
	]),
	PaddingLight: F.fromRGBA([
		147,
		196,
		125,
		.4
	]),
	Border: F.fromRGBA([
		255,
		229,
		153,
		.66
	]),
	BorderLight: F.fromRGBA([
		255,
		229,
		153,
		.5
	]),
	Margin: F.fromRGBA([
		246,
		178,
		107,
		.66
	]),
	MarginLight: F.fromRGBA([
		246,
		178,
		107,
		.5
	]),
	EventTarget: F.fromRGBA([
		255,
		196,
		196,
		.66
	]),
	Shape: F.fromRGBA([
		96,
		82,
		177,
		.8
	]),
	ShapeMargin: F.fromRGBA([
		96,
		82,
		127,
		.6
	]),
	CssGrid: F.fromRGBA([
		75,
		0,
		130,
		1
	]),
	LayoutLine: F.fromRGBA([...Bt, 1]),
	GridBorder: F.fromRGBA([...Bt, 1]),
	GapBackground: F.fromRGBA([...Bt, .3]),
	GapHatch: F.fromRGBA([...Bt, .8]),
	GridAreaBorder: F.fromRGBA([
		26,
		115,
		232,
		1
	])
}, Ht = {
	ParentOutline: F.fromRGBA([
		224,
		90,
		183,
		1
	]),
	ChildOutline: F.fromRGBA([
		0,
		120,
		212,
		1
	])
}, Ut = {
	Resizer: F.fromRGBA([
		222,
		225,
		230,
		1
	]),
	ResizerHandle: F.fromRGBA([
		166,
		166,
		166,
		1
	]),
	Mask: F.fromRGBA([
		248,
		249,
		249,
		1
	])
}, Wt = class {
	#e;
	#t;
	#n;
	#r;
	#i = /* @__PURE__ */ new Map();
	constructor(e, t, n, r) {
		this.#e = e || {
			min: 0,
			max: 360
		}, this.#t = t || 67, this.#n = n || 80, this.#r = r || 1;
	}
	setColorForID(e, t) {
		this.#i.set(e, t);
	}
	colorForID(e) {
		let t = this.#i.get(e);
		return t || (t = this.generateColorForID(e), this.#i.set(e, t)), t;
	}
	generateColorForID(e) {
		let t = l(e), n = this.indexToValueInSpace(t, this.#e), r = this.indexToValueInSpace(t >> 8, this.#t), i = this.indexToValueInSpace(t >> 16, this.#n), a = this.indexToValueInSpace(t >> 24, this.#r), o = `hsl(${n}deg ${r}% ${i}%`;
		return a === 1 ? `${o})` : `${o} / ${Math.floor(a * 100)}%)`;
	}
	indexToValueInSpace(e, t) {
		if (typeof t == "number") return t;
		let n = t.count || t.max - t.min;
		return e %= n, t.min + Math.floor(e / (n - 1) * (t.max - t.min));
	}
}, Gt = class {
	#e = /* @__PURE__ */ new Map();
	get(e) {
		let t = this.#e.get(e);
		if (!t) throw Error(`No instance for ${e.name}. Ensure the bootstrapper creates it.`);
		return t;
	}
	has(e) {
		return this.#e.has(e);
	}
	set(e, t) {
		this.#e.set(e, t);
	}
	delete(e) {
		this.#e.delete(e);
	}
}, Kt = null;
function I() {
	return Kt ||= new Gt(), Kt;
}
function qt(e) {
	Kt = e;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/core/common/Object.ts
var Jt = class {
	listeners;
	addEventListener(e, t, n) {
		this.listeners ||= /* @__PURE__ */ new Map();
		let r = this.listeners.get(e);
		return r || (r = /* @__PURE__ */ new Set(), this.listeners.set(e, r)), r.add({
			thisObject: n,
			listener: t
		}), {
			eventTarget: this,
			eventType: e,
			thisObject: n,
			listener: t
		};
	}
	once(e) {
		return new Promise((t) => {
			let n = this.addEventListener(e, (r) => {
				this.removeEventListener(e, n.listener), t(r.data);
			});
		});
	}
	removeEventListener(e, t, n) {
		let r = this.listeners?.get(e);
		if (r) {
			for (let e of r) e.listener === t && e.thisObject === n && (e.disposed = !0, r.delete(e));
			r.size || this.listeners?.delete(e);
		}
	}
	hasEventListeners(e) {
		return !!this.listeners?.has(e);
	}
	dispatchEventToListeners(e, ...[t]) {
		let n = this.listeners?.get(e);
		if (!n) return;
		let r = {
			data: t,
			source: this
		};
		for (let t of [...n]) if (!t.disposed) try {
			t.listener.call(t.thisObject, r);
		} catch (t) {
			console.error(`Event listener for ${String(e)} throw an error:`, t);
		}
	}
};
function Yt(e) {
	return console.assert(e !== HTMLElement), class extends e {
		__events = new Jt();
		addEventListener(e, t, n) {
			return this.__events.addEventListener(e, t, n);
		}
		once(e) {
			return this.__events.once(e);
		}
		removeEventListener(e, t, n) {
			this.__events.removeEventListener(e, t, n);
		}
		hasEventListeners(e) {
			return this.__events.hasEventListeners(e);
		}
		dispatchEventToListeners(e, ...t) {
			this.__events.dispatchEventToListeners(e, ...t), typeof this.dispatchDOMEvent == "function" && this.dispatchDOMEvent(new CustomEvent(e, { detail: t[0] }));
		}
	};
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/core/i18n/DevToolsLocale.ts
var Xt = null, Zt = class e {
	locale;
	lookupClosestDevToolsLocale;
	constructor(e) {
		this.lookupClosestDevToolsLocale = e.lookupClosestDevToolsLocale, this.locale = e.settingLanguage === "browserLanguage" ? e.navigatorLanguage || "en-US" : e.settingLanguage, this.locale = this.lookupClosestDevToolsLocale(this.locale);
	}
	static instance(t = { create: !1 }) {
		if (!Xt && !t.create) throw Error("No LanguageSelector instance exists yet.");
		return t.create && (Xt = new e(t.data)), Xt;
	}
	static removeInstance() {
		Xt = null;
	}
	forceFallbackLocale() {
		this.locale = "en-US";
	}
	languageIsSupportedByDevTools(e) {
		return Qt(e, this.lookupClosestDevToolsLocale(e));
	}
};
function Qt(e, t) {
	let n = new Intl.Locale(e), r = new Intl.Locale(t);
	return n.language === r.language;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/core/i18n/NumberFormatter.ts
function L(e) {
	let t;
	return {
		format(n, r) {
			return t ||= new Intl.NumberFormat(Zt.instance().locale, e), $t(t, n, r);
		},
		formatToParts(n) {
			return t ||= new Intl.NumberFormat(Zt.instance().locale, e), t.formatToParts(n);
		}
	};
}
function $t(e, t, n = "\xA0") {
	let r = e.formatToParts(t), i = !1;
	for (let e of r) e.type === "literal" && (e.value === " " ? (i = !0, e.value = n) : e.value === n && (i = !0));
	if (i) return r.map((e) => e.value).join("");
	let a = r.findIndex((e) => e.type === "unit");
	return a === -1 ? r.map((e) => e.value).join("") : a === 0 ? r[0].value + n + r.slice(1).map((e) => e.value).join("") : r.slice(0, a).map((e) => e.value).join("") + n + r.slice(a).map((e) => e.value).join("");
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/core/i18n/ByteUtilities.ts
var en = L({
	style: "unit",
	unit: "byte",
	unitDisplay: "narrow",
	minimumFractionDigits: 0,
	maximumFractionDigits: 0
}), tn = L({
	style: "unit",
	unit: "kilobyte",
	unitDisplay: "narrow",
	minimumFractionDigits: 1,
	maximumFractionDigits: 1
}), nn = L({
	style: "unit",
	unit: "kilobyte",
	unitDisplay: "narrow",
	minimumFractionDigits: 0,
	maximumFractionDigits: 0
}), rn = L({
	style: "unit",
	unit: "megabyte",
	unitDisplay: "narrow",
	minimumFractionDigits: 1,
	maximumFractionDigits: 1
}), an = L({
	style: "unit",
	unit: "megabyte",
	unitDisplay: "narrow",
	minimumFractionDigits: 0,
	maximumFractionDigits: 0
}), on = (e) => {
	if (e < 1e3) return en.format(e);
	let t = e / 1e3;
	if (t < 100) return tn.format(t);
	if (t < 1e3) return nn.format(t);
	let n = t / 1e3;
	return n < 100 ? rn.format(n) : an.format(n);
}, sn = (e) => {
	let t = e / 1e3;
	return t < 100 ? tn.format(t) : nn.format(t);
}, R = function() {
	return R = Object.assign || function(e) {
		for (var t, n = 1, r = arguments.length; n < r; n++) for (var i in t = arguments[n], t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
		return e;
	}, R.apply(this, arguments);
}, z;
(function(e) {
	e[e.EXPECT_ARGUMENT_CLOSING_BRACE = 1] = "EXPECT_ARGUMENT_CLOSING_BRACE", e[e.EMPTY_ARGUMENT = 2] = "EMPTY_ARGUMENT", e[e.MALFORMED_ARGUMENT = 3] = "MALFORMED_ARGUMENT", e[e.EXPECT_ARGUMENT_TYPE = 4] = "EXPECT_ARGUMENT_TYPE", e[e.INVALID_ARGUMENT_TYPE = 5] = "INVALID_ARGUMENT_TYPE", e[e.EXPECT_ARGUMENT_STYLE = 6] = "EXPECT_ARGUMENT_STYLE", e[e.INVALID_NUMBER_SKELETON = 7] = "INVALID_NUMBER_SKELETON", e[e.INVALID_DATE_TIME_SKELETON = 8] = "INVALID_DATE_TIME_SKELETON", e[e.EXPECT_NUMBER_SKELETON = 9] = "EXPECT_NUMBER_SKELETON", e[e.EXPECT_DATE_TIME_SKELETON = 10] = "EXPECT_DATE_TIME_SKELETON", e[e.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE = 11] = "UNCLOSED_QUOTE_IN_ARGUMENT_STYLE", e[e.EXPECT_SELECT_ARGUMENT_OPTIONS = 12] = "EXPECT_SELECT_ARGUMENT_OPTIONS", e[e.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE = 13] = "EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE", e[e.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE = 14] = "INVALID_PLURAL_ARGUMENT_OFFSET_VALUE", e[e.EXPECT_SELECT_ARGUMENT_SELECTOR = 15] = "EXPECT_SELECT_ARGUMENT_SELECTOR", e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR = 16] = "EXPECT_PLURAL_ARGUMENT_SELECTOR", e[e.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT = 17] = "EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT", e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT = 18] = "EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT", e[e.INVALID_PLURAL_ARGUMENT_SELECTOR = 19] = "INVALID_PLURAL_ARGUMENT_SELECTOR", e[e.DUPLICATE_PLURAL_ARGUMENT_SELECTOR = 20] = "DUPLICATE_PLURAL_ARGUMENT_SELECTOR", e[e.DUPLICATE_SELECT_ARGUMENT_SELECTOR = 21] = "DUPLICATE_SELECT_ARGUMENT_SELECTOR", e[e.MISSING_OTHER_CLAUSE = 22] = "MISSING_OTHER_CLAUSE", e[e.INVALID_TAG = 23] = "INVALID_TAG", e[e.INVALID_TAG_NAME = 25] = "INVALID_TAG_NAME", e[e.UNMATCHED_CLOSING_TAG = 26] = "UNMATCHED_CLOSING_TAG", e[e.UNCLOSED_TAG = 27] = "UNCLOSED_TAG";
})(z ||= {});
var B;
(function(e) {
	e[e.literal = 0] = "literal", e[e.argument = 1] = "argument", e[e.number = 2] = "number", e[e.date = 3] = "date", e[e.time = 4] = "time", e[e.select = 5] = "select", e[e.plural = 6] = "plural", e[e.pound = 7] = "pound", e[e.tag = 8] = "tag";
})(B ||= {});
var cn;
(function(e) {
	e[e.number = 0] = "number", e[e.dateTime = 1] = "dateTime";
})(cn ||= {});
function ln(e) {
	return e.type === B.literal;
}
function un(e) {
	return e.type === B.argument;
}
function dn(e) {
	return e.type === B.number;
}
function fn(e) {
	return e.type === B.date;
}
function pn(e) {
	return e.type === B.time;
}
function mn(e) {
	return e.type === B.select;
}
function hn(e) {
	return e.type === B.plural;
}
function gn(e) {
	return e.type === B.pound;
}
function _n(e) {
	return e.type === B.tag;
}
function vn(e) {
	return !!(e && typeof e == "object" && e.type === cn.number);
}
function yn(e) {
	return !!(e && typeof e == "object" && e.type === cn.dateTime);
}
var bn = /[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/, xn = /(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;
function Sn(e) {
	var t = {};
	return e.replace(xn, function(e) {
		var n = e.length;
		switch (e[0]) {
			case "G":
				t.era = n === 4 ? "long" : n === 5 ? "narrow" : "short";
				break;
			case "y":
				t.year = n === 2 ? "2-digit" : "numeric";
				break;
			case "Y":
			case "u":
			case "U":
			case "r": throw RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");
			case "q":
			case "Q": throw RangeError("`q/Q` (quarter) patterns are not supported");
			case "M":
			case "L":
				t.month = [
					"numeric",
					"2-digit",
					"short",
					"long",
					"narrow"
				][n - 1];
				break;
			case "w":
			case "W": throw RangeError("`w/W` (week) patterns are not supported");
			case "d":
				t.day = ["numeric", "2-digit"][n - 1];
				break;
			case "D":
			case "F":
			case "g": throw RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");
			case "E":
				t.weekday = n === 4 ? "short" : n === 5 ? "narrow" : "short";
				break;
			case "e":
				if (n < 4) throw RangeError("`e..eee` (weekday) patterns are not supported");
				t.weekday = [
					"short",
					"long",
					"narrow",
					"short"
				][n - 4];
				break;
			case "c":
				if (n < 4) throw RangeError("`c..ccc` (weekday) patterns are not supported");
				t.weekday = [
					"short",
					"long",
					"narrow",
					"short"
				][n - 4];
				break;
			case "a":
				t.hour12 = !0;
				break;
			case "b":
			case "B": throw RangeError("`b/B` (period) patterns are not supported, use `a` instead");
			case "h":
				t.hourCycle = "h12", t.hour = ["numeric", "2-digit"][n - 1];
				break;
			case "H":
				t.hourCycle = "h23", t.hour = ["numeric", "2-digit"][n - 1];
				break;
			case "K":
				t.hourCycle = "h11", t.hour = ["numeric", "2-digit"][n - 1];
				break;
			case "k":
				t.hourCycle = "h24", t.hour = ["numeric", "2-digit"][n - 1];
				break;
			case "j":
			case "J":
			case "C": throw RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");
			case "m":
				t.minute = ["numeric", "2-digit"][n - 1];
				break;
			case "s":
				t.second = ["numeric", "2-digit"][n - 1];
				break;
			case "S":
			case "A": throw RangeError("`S/A` (second) patterns are not supported, use `s` instead");
			case "z":
				t.timeZoneName = n < 4 ? "short" : "long";
				break;
			case "Z":
			case "O":
			case "v":
			case "V":
			case "X":
			case "x": throw RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead");
		}
		return "";
	}), t;
}
var Cn = /[\t-\r \x85\u200E\u200F\u2028\u2029]/i;
function wn(e) {
	if (e.length === 0) throw Error("Number skeleton cannot be empty");
	for (var t = e.split(Cn).filter(function(e) {
		return e.length > 0;
	}), n = [], r = 0, i = t; r < i.length; r++) {
		var a = i[r].split("/");
		if (a.length === 0) throw Error("Invalid number skeleton");
		for (var o = a[0], s = a.slice(1), c = 0, l = s; c < l.length; c++) if (l[c].length === 0) throw Error("Invalid number skeleton");
		n.push({
			stem: o,
			options: s
		});
	}
	return n;
}
function Tn(e) {
	return e.replace(/^(.*?)-/, "");
}
var En = /^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g, Dn = /^(@+)?(\+|#+)?$/g, On = /(\*)(0+)|(#+)(0+)|(0+)/g, kn = /^(0+)$/;
function An(e) {
	var t = {};
	return e.replace(Dn, function(e, n, r) {
		return typeof r == "string" ? r === "+" ? t.minimumSignificantDigits = n.length : n[0] === "#" ? t.maximumSignificantDigits = n.length : (t.minimumSignificantDigits = n.length, t.maximumSignificantDigits = n.length + (typeof r == "string" ? r.length : 0)) : (t.minimumSignificantDigits = n.length, t.maximumSignificantDigits = n.length), "";
	}), t;
}
function jn(e) {
	switch (e) {
		case "sign-auto": return { signDisplay: "auto" };
		case "sign-accounting":
		case "()": return { currencySign: "accounting" };
		case "sign-always":
		case "+!": return { signDisplay: "always" };
		case "sign-accounting-always":
		case "()!": return {
			signDisplay: "always",
			currencySign: "accounting"
		};
		case "sign-except-zero":
		case "+?": return { signDisplay: "exceptZero" };
		case "sign-accounting-except-zero":
		case "()?": return {
			signDisplay: "exceptZero",
			currencySign: "accounting"
		};
		case "sign-never":
		case "+_": return { signDisplay: "never" };
	}
}
function Mn(e) {
	var t;
	if (e[0] === "E" && e[1] === "E" ? (t = { notation: "engineering" }, e = e.slice(2)) : e[0] === "E" && (t = { notation: "scientific" }, e = e.slice(1)), t) {
		var n = e.slice(0, 2);
		if (n === "+!" ? (t.signDisplay = "always", e = e.slice(2)) : n === "+?" && (t.signDisplay = "exceptZero", e = e.slice(2)), !kn.test(e)) throw Error("Malformed concise eng/scientific notation");
		t.minimumIntegerDigits = e.length;
	}
	return t;
}
function Nn(e) {
	return jn(e) || {};
}
function Pn(e) {
	for (var t = {}, n = 0, r = e; n < r.length; n++) {
		var i = r[n];
		switch (i.stem) {
			case "percent":
			case "%":
				t.style = "percent";
				continue;
			case "%x100":
				t.style = "percent", t.scale = 100;
				continue;
			case "currency":
				t.style = "currency", t.currency = i.options[0];
				continue;
			case "group-off":
			case ",_":
				t.useGrouping = !1;
				continue;
			case "precision-integer":
			case ".":
				t.maximumFractionDigits = 0;
				continue;
			case "measure-unit":
			case "unit":
				t.style = "unit", t.unit = Tn(i.options[0]);
				continue;
			case "compact-short":
			case "K":
				t.notation = "compact", t.compactDisplay = "short";
				continue;
			case "compact-long":
			case "KK":
				t.notation = "compact", t.compactDisplay = "long";
				continue;
			case "scientific":
				t = R(R(R({}, t), { notation: "scientific" }), i.options.reduce(function(e, t) {
					return R(R({}, e), Nn(t));
				}, {}));
				continue;
			case "engineering":
				t = R(R(R({}, t), { notation: "engineering" }), i.options.reduce(function(e, t) {
					return R(R({}, e), Nn(t));
				}, {}));
				continue;
			case "notation-simple":
				t.notation = "standard";
				continue;
			case "unit-width-narrow":
				t.currencyDisplay = "narrowSymbol", t.unitDisplay = "narrow";
				continue;
			case "unit-width-short":
				t.currencyDisplay = "code", t.unitDisplay = "short";
				continue;
			case "unit-width-full-name":
				t.currencyDisplay = "name", t.unitDisplay = "long";
				continue;
			case "unit-width-iso-code":
				t.currencyDisplay = "symbol";
				continue;
			case "scale":
				t.scale = parseFloat(i.options[0]);
				continue;
			case "integer-width":
				if (i.options.length > 1) throw RangeError("integer-width stems only accept a single optional option");
				i.options[0].replace(On, function(e, n, r, i, a, o) {
					if (n) t.minimumIntegerDigits = r.length;
					else if (i && a) throw Error("We currently do not support maximum integer digits");
					else if (o) throw Error("We currently do not support exact integer digits");
					return "";
				});
				continue;
		}
		if (kn.test(i.stem)) {
			t.minimumIntegerDigits = i.stem.length;
			continue;
		}
		if (En.test(i.stem)) {
			if (i.options.length > 1) throw RangeError("Fraction-precision stems only accept a single optional option");
			i.stem.replace(En, function(e, n, r, i, a, o) {
				return r === "*" ? t.minimumFractionDigits = n.length : i && i[0] === "#" ? t.maximumFractionDigits = i.length : a && o ? (t.minimumFractionDigits = a.length, t.maximumFractionDigits = a.length + o.length) : (t.minimumFractionDigits = n.length, t.maximumFractionDigits = n.length), "";
			}), i.options.length && (t = R(R({}, t), An(i.options[0])));
			continue;
		}
		if (Dn.test(i.stem)) {
			t = R(R({}, t), An(i.stem));
			continue;
		}
		var a = jn(i.stem);
		a && (t = R(R({}, t), a));
		var o = Mn(i.stem);
		o && (t = R(R({}, t), o));
	}
	return t;
}
var Fn = RegExp("^" + bn.source + "*"), In = RegExp(bn.source + "*$");
function V(e, t) {
	return {
		start: e,
		end: t
	};
}
var Ln = !!String.prototype.startsWith, Rn = !!String.fromCodePoint, zn = !!Object.fromEntries, Bn = !!String.prototype.codePointAt, Vn = !!String.prototype.trimStart, Hn = !!String.prototype.trimEnd, Un = Number.isSafeInteger ? Number.isSafeInteger : function(e) {
	return typeof e == "number" && isFinite(e) && Math.floor(e) === e && Math.abs(e) <= 9007199254740991;
}, Wn = !0;
try {
	Gn = Qn("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu"), Wn = Gn.exec("a")?.[0] === "a";
} catch {
	Wn = !1;
}
var Gn, Kn = Ln ? function(e, t, n) {
	return e.startsWith(t, n);
} : function(e, t, n) {
	return e.slice(n, n + t.length) === t;
}, qn = Rn ? String.fromCodePoint : function() {
	for (var e = [...arguments], t = "", n = e.length, r = 0, i; n > r;) {
		if (i = e[r++], i > 1114111) throw RangeError(i + " is not a valid code point");
		t += i < 65536 ? String.fromCharCode(i) : String.fromCharCode(((i -= 65536) >> 10) + 55296, i % 1024 + 56320);
	}
	return t;
}, Jn = zn ? Object.fromEntries : function(e) {
	for (var t = {}, n = 0, r = e; n < r.length; n++) {
		var i = r[n], a = i[0];
		t[a] = i[1];
	}
	return t;
}, Yn = Bn ? function(e, t) {
	return e.codePointAt(t);
} : function(e, t) {
	var n = e.length;
	if (!(t < 0 || t >= n)) {
		var r = e.charCodeAt(t), i;
		return r < 55296 || r > 56319 || t + 1 === n || (i = e.charCodeAt(t + 1)) < 56320 || i > 57343 ? r : (r - 55296 << 10) + (i - 56320) + 65536;
	}
}, Xn = Vn ? function(e) {
	return e.trimStart();
} : function(e) {
	return e.replace(Fn, "");
}, Zn = Hn ? function(e) {
	return e.trimEnd();
} : function(e) {
	return e.replace(In, "");
};
function Qn(e, t) {
	return new RegExp(e, t);
}
var $n;
Wn ? (er = Qn("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu"), $n = function(e, t) {
	return er.lastIndex = t, er.exec(e)[1] ?? "";
}) : $n = function(e, t) {
	for (var n = [];;) {
		var r = Yn(e, t);
		if (r === void 0 || ar(r) || or(r)) break;
		n.push(r), t += r >= 65536 ? 2 : 1;
	}
	return qn.apply(void 0, n);
};
var er, tr = function() {
	function e(e, t) {
		t === void 0 && (t = {}), this.message = e, this.position = {
			offset: 0,
			line: 1,
			column: 1
		}, this.ignoreTag = !!t.ignoreTag, this.requiresOtherClause = !!t.requiresOtherClause, this.shouldParseSkeletons = !!t.shouldParseSkeletons;
	}
	return e.prototype.parse = function() {
		if (this.offset() !== 0) throw Error("parser can only be used once");
		return this.parseMessage(0, "", !1);
	}, e.prototype.parseMessage = function(e, t, n) {
		for (var r = []; !this.isEOF();) {
			var i = this.char();
			if (i === 123) {
				var a = this.parseArgument(e, n);
				if (a.err) return a;
				r.push(a.val);
			} else if (i === 125 && e > 0) break;
			else if (i === 35 && (t === "plural" || t === "selectordinal")) {
				var o = this.clonePosition();
				this.bump(), r.push({
					type: B.pound,
					location: V(o, this.clonePosition())
				});
			} else if (i === 60 && !this.ignoreTag && this.peek() === 47) {
				if (n) break;
				return this.error(z.UNMATCHED_CLOSING_TAG, V(this.clonePosition(), this.clonePosition()));
			} else if (i === 60 && !this.ignoreTag && nr(this.peek() || 0)) {
				var a = this.parseTag(e, t);
				if (a.err) return a;
				r.push(a.val);
			} else {
				var a = this.parseLiteral(e, t);
				if (a.err) return a;
				r.push(a.val);
			}
		}
		return {
			val: r,
			err: null
		};
	}, e.prototype.parseTag = function(e, t) {
		var n = this.clonePosition();
		this.bump();
		var r = this.parseTagName();
		if (this.bumpSpace(), this.bumpIf("/>")) return {
			val: {
				type: B.literal,
				value: "<" + r + "/>",
				location: V(n, this.clonePosition())
			},
			err: null
		};
		if (this.bumpIf(">")) {
			var i = this.parseMessage(e + 1, t, !0);
			if (i.err) return i;
			var a = i.val, o = this.clonePosition();
			if (this.bumpIf("</")) {
				if (this.isEOF() || !nr(this.char())) return this.error(z.INVALID_TAG, V(o, this.clonePosition()));
				var s = this.clonePosition();
				return r === this.parseTagName() ? (this.bumpSpace(), this.bumpIf(">") ? {
					val: {
						type: B.tag,
						value: r,
						children: a,
						location: V(n, this.clonePosition())
					},
					err: null
				} : this.error(z.INVALID_TAG, V(o, this.clonePosition()))) : this.error(z.UNMATCHED_CLOSING_TAG, V(s, this.clonePosition()));
			}
			return this.error(z.UNCLOSED_TAG, V(n, this.clonePosition()));
		}
		return this.error(z.INVALID_TAG, V(n, this.clonePosition()));
	}, e.prototype.parseTagName = function() {
		var e = this.offset();
		for (this.bump(); !this.isEOF() && ir(this.char());) this.bump();
		return this.message.slice(e, this.offset());
	}, e.prototype.parseLiteral = function(e, t) {
		for (var n = this.clonePosition(), r = "";;) {
			var i = this.tryParseQuote(t);
			if (i) {
				r += i;
				continue;
			}
			var a = this.tryParseUnquoted(e, t);
			if (a) {
				r += a;
				continue;
			}
			var o = this.tryParseLeftAngleBracket();
			if (o) {
				r += o;
				continue;
			}
			break;
		}
		var s = V(n, this.clonePosition());
		return {
			val: {
				type: B.literal,
				value: r,
				location: s
			},
			err: null
		};
	}, e.prototype.tryParseLeftAngleBracket = function() {
		return !this.isEOF() && this.char() === 60 && (this.ignoreTag || !rr(this.peek() || 0)) ? (this.bump(), "<") : null;
	}, e.prototype.tryParseQuote = function(e) {
		if (this.isEOF() || this.char() !== 39) return null;
		switch (this.peek()) {
			case 39: return this.bump(), this.bump(), "'";
			case 123:
			case 60:
			case 62:
			case 125: break;
			case 35:
				if (e === "plural" || e === "selectordinal") break;
				return null;
			default: return null;
		}
		this.bump();
		var t = [this.char()];
		for (this.bump(); !this.isEOF();) {
			var n = this.char();
			if (n === 39) {
				if (this.peek() === 39) t.push(39), this.bump();
				else {
					this.bump();
					break;
				}
			} else t.push(n);
			this.bump();
		}
		return qn.apply(void 0, t);
	}, e.prototype.tryParseUnquoted = function(e, t) {
		if (this.isEOF()) return null;
		var n = this.char();
		return n === 60 || n === 123 || n === 35 && (t === "plural" || t === "selectordinal") || n === 125 && e > 0 ? null : (this.bump(), qn(n));
	}, e.prototype.parseArgument = function(e, t) {
		var n = this.clonePosition();
		if (this.bump(), this.bumpSpace(), this.isEOF()) return this.error(z.EXPECT_ARGUMENT_CLOSING_BRACE, V(n, this.clonePosition()));
		if (this.char() === 125) return this.bump(), this.error(z.EMPTY_ARGUMENT, V(n, this.clonePosition()));
		var r = this.parseIdentifierIfPossible().value;
		if (!r) return this.error(z.MALFORMED_ARGUMENT, V(n, this.clonePosition()));
		if (this.bumpSpace(), this.isEOF()) return this.error(z.EXPECT_ARGUMENT_CLOSING_BRACE, V(n, this.clonePosition()));
		switch (this.char()) {
			case 125: return this.bump(), {
				val: {
					type: B.argument,
					value: r,
					location: V(n, this.clonePosition())
				},
				err: null
			};
			case 44: return this.bump(), this.bumpSpace(), this.isEOF() ? this.error(z.EXPECT_ARGUMENT_CLOSING_BRACE, V(n, this.clonePosition())) : this.parseArgumentOptions(e, t, r, n);
			default: return this.error(z.MALFORMED_ARGUMENT, V(n, this.clonePosition()));
		}
	}, e.prototype.parseIdentifierIfPossible = function() {
		var e = this.clonePosition(), t = this.offset(), n = $n(this.message, t), r = t + n.length;
		return this.bumpTo(r), {
			value: n,
			location: V(e, this.clonePosition())
		};
	}, e.prototype.parseArgumentOptions = function(e, t, n, r) {
		var i = this.clonePosition(), a = this.parseIdentifierIfPossible().value, o = this.clonePosition();
		switch (a) {
			case "": return this.error(z.EXPECT_ARGUMENT_TYPE, V(i, o));
			case "number":
			case "date":
			case "time":
				this.bumpSpace();
				var s = null;
				if (this.bumpIf(",")) {
					this.bumpSpace();
					var c = this.clonePosition(), l = this.parseSimpleArgStyleIfPossible();
					if (l.err) return l;
					var u = Zn(l.val);
					if (u.length === 0) return this.error(z.EXPECT_ARGUMENT_STYLE, V(this.clonePosition(), this.clonePosition()));
					s = {
						style: u,
						styleLocation: V(c, this.clonePosition())
					};
				}
				var d = this.tryParseArgumentClose(r);
				if (d.err) return d;
				var f = V(r, this.clonePosition());
				if (s && Kn(s?.style, "::", 0)) {
					var ee = Xn(s.style.slice(2));
					if (a === "number") {
						var l = this.parseNumberSkeletonFromString(ee, s.styleLocation);
						return l.err ? l : {
							val: {
								type: B.number,
								value: n,
								location: f,
								style: l.val
							},
							err: null
						};
					}
					if (ee.length === 0) return this.error(z.EXPECT_DATE_TIME_SKELETON, f);
					var u = {
						type: cn.dateTime,
						pattern: ee,
						location: s.styleLocation,
						parsedOptions: this.shouldParseSkeletons ? Sn(ee) : {}
					};
					return {
						val: {
							type: a === "date" ? B.date : B.time,
							value: n,
							location: f,
							style: u
						},
						err: null
					};
				}
				return {
					val: {
						type: a === "number" ? B.number : a === "date" ? B.date : B.time,
						value: n,
						location: f,
						style: s?.style ?? null
					},
					err: null
				};
			case "plural":
			case "selectordinal":
			case "select":
				var te = this.clonePosition();
				if (this.bumpSpace(), !this.bumpIf(",")) return this.error(z.EXPECT_SELECT_ARGUMENT_OPTIONS, V(te, R({}, te)));
				this.bumpSpace();
				var ne = this.parseIdentifierIfPossible(), re = 0;
				if (a !== "select" && ne.value === "offset") {
					if (!this.bumpIf(":")) return this.error(z.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE, V(this.clonePosition(), this.clonePosition()));
					this.bumpSpace();
					var l = this.tryParseDecimalInteger(z.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE, z.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);
					if (l.err) return l;
					this.bumpSpace(), ne = this.parseIdentifierIfPossible(), re = l.val;
				}
				var ie = this.tryParsePluralOrSelectOptions(e, a, t, ne);
				if (ie.err) return ie;
				var d = this.tryParseArgumentClose(r);
				if (d.err) return d;
				var ae = V(r, this.clonePosition());
				return a === "select" ? {
					val: {
						type: B.select,
						value: n,
						options: Jn(ie.val),
						location: ae
					},
					err: null
				} : {
					val: {
						type: B.plural,
						value: n,
						options: Jn(ie.val),
						offset: re,
						pluralType: a === "plural" ? "cardinal" : "ordinal",
						location: ae
					},
					err: null
				};
			default: return this.error(z.INVALID_ARGUMENT_TYPE, V(i, o));
		}
	}, e.prototype.tryParseArgumentClose = function(e) {
		return this.isEOF() || this.char() !== 125 ? this.error(z.EXPECT_ARGUMENT_CLOSING_BRACE, V(e, this.clonePosition())) : (this.bump(), {
			val: !0,
			err: null
		});
	}, e.prototype.parseSimpleArgStyleIfPossible = function() {
		for (var e = 0, t = this.clonePosition(); !this.isEOF();) switch (this.char()) {
			case 39:
				this.bump();
				var n = this.clonePosition();
				if (!this.bumpUntil("'")) return this.error(z.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE, V(n, this.clonePosition()));
				this.bump();
				break;
			case 123:
				e += 1, this.bump();
				break;
			case 125:
				if (e > 0) --e;
				else return {
					val: this.message.slice(t.offset, this.offset()),
					err: null
				};
				break;
			default: this.bump();
		}
		return {
			val: this.message.slice(t.offset, this.offset()),
			err: null
		};
	}, e.prototype.parseNumberSkeletonFromString = function(e, t) {
		var n = [];
		try {
			n = wn(e);
		} catch {
			return this.error(z.INVALID_NUMBER_SKELETON, t);
		}
		return {
			val: {
				type: cn.number,
				tokens: n,
				location: t,
				parsedOptions: this.shouldParseSkeletons ? Pn(n) : {}
			},
			err: null
		};
	}, e.prototype.tryParsePluralOrSelectOptions = function(e, t, n, r) {
		for (var i, a = !1, o = [], s = /* @__PURE__ */ new Set(), c = r.value, l = r.location;;) {
			if (c.length === 0) {
				var u = this.clonePosition();
				if (t !== "select" && this.bumpIf("=")) {
					var d = this.tryParseDecimalInteger(z.EXPECT_PLURAL_ARGUMENT_SELECTOR, z.INVALID_PLURAL_ARGUMENT_SELECTOR);
					if (d.err) return d;
					l = V(u, this.clonePosition()), c = this.message.slice(u.offset, this.offset());
				} else break;
			}
			if (s.has(c)) return this.error(t === "select" ? z.DUPLICATE_SELECT_ARGUMENT_SELECTOR : z.DUPLICATE_PLURAL_ARGUMENT_SELECTOR, l);
			c === "other" && (a = !0), this.bumpSpace();
			var f = this.clonePosition();
			if (!this.bumpIf("{")) return this.error(t === "select" ? z.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT : z.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT, V(this.clonePosition(), this.clonePosition()));
			var ee = this.parseMessage(e + 1, t, n);
			if (ee.err) return ee;
			var te = this.tryParseArgumentClose(f);
			if (te.err) return te;
			o.push([c, {
				value: ee.val,
				location: V(f, this.clonePosition())
			}]), s.add(c), this.bumpSpace(), i = this.parseIdentifierIfPossible(), c = i.value, l = i.location;
		}
		return o.length === 0 ? this.error(t === "select" ? z.EXPECT_SELECT_ARGUMENT_SELECTOR : z.EXPECT_PLURAL_ARGUMENT_SELECTOR, V(this.clonePosition(), this.clonePosition())) : this.requiresOtherClause && !a ? this.error(z.MISSING_OTHER_CLAUSE, V(this.clonePosition(), this.clonePosition())) : {
			val: o,
			err: null
		};
	}, e.prototype.tryParseDecimalInteger = function(e, t) {
		var n = 1, r = this.clonePosition();
		this.bumpIf("+") || this.bumpIf("-") && (n = -1);
		for (var i = !1, a = 0; !this.isEOF();) {
			var o = this.char();
			if (o >= 48 && o <= 57) i = !0, a = a * 10 + (o - 48), this.bump();
			else break;
		}
		var s = V(r, this.clonePosition());
		return i ? (a *= n, Un(a) ? {
			val: a,
			err: null
		} : this.error(t, s)) : this.error(e, s);
	}, e.prototype.offset = function() {
		return this.position.offset;
	}, e.prototype.isEOF = function() {
		return this.offset() === this.message.length;
	}, e.prototype.clonePosition = function() {
		return {
			offset: this.position.offset,
			line: this.position.line,
			column: this.position.column
		};
	}, e.prototype.char = function() {
		var e = this.position.offset;
		if (e >= this.message.length) throw Error("out of bound");
		var t = Yn(this.message, e);
		if (t === void 0) throw Error("Offset " + e + " is at invalid UTF-16 code unit boundary");
		return t;
	}, e.prototype.error = function(e, t) {
		return {
			val: null,
			err: {
				kind: e,
				message: this.message,
				location: t
			}
		};
	}, e.prototype.bump = function() {
		if (!this.isEOF()) {
			var e = this.char();
			e === 10 ? (this.position.line += 1, this.position.column = 1, this.position.offset += 1) : (this.position.column += 1, this.position.offset += e < 65536 ? 1 : 2);
		}
	}, e.prototype.bumpIf = function(e) {
		if (Kn(this.message, e, this.offset())) {
			for (var t = 0; t < e.length; t++) this.bump();
			return !0;
		}
		return !1;
	}, e.prototype.bumpUntil = function(e) {
		var t = this.offset(), n = this.message.indexOf(e, t);
		return n >= 0 ? (this.bumpTo(n), !0) : (this.bumpTo(this.message.length), !1);
	}, e.prototype.bumpTo = function(e) {
		if (this.offset() > e) throw Error("targetOffset " + e + " must be greater than or equal to the current offset " + this.offset());
		for (e = Math.min(e, this.message.length);;) {
			var t = this.offset();
			if (t === e) break;
			if (t > e) throw Error("targetOffset " + e + " is at invalid UTF-16 code unit boundary");
			if (this.bump(), this.isEOF()) break;
		}
	}, e.prototype.bumpSpace = function() {
		for (; !this.isEOF() && ar(this.char());) this.bump();
	}, e.prototype.peek = function() {
		if (this.isEOF()) return null;
		var e = this.char(), t = this.offset();
		return this.message.charCodeAt(t + (e >= 65536 ? 2 : 1)) ?? null;
	}, e;
}();
function nr(e) {
	return e >= 97 && e <= 122 || e >= 65 && e <= 90;
}
function rr(e) {
	return nr(e) || e === 47;
}
function ir(e) {
	return e === 45 || e === 46 || e >= 48 && e <= 57 || e === 95 || e >= 97 && e <= 122 || e >= 65 && e <= 90 || e == 183 || e >= 192 && e <= 214 || e >= 216 && e <= 246 || e >= 248 && e <= 893 || e >= 895 && e <= 8191 || e >= 8204 && e <= 8205 || e >= 8255 && e <= 8256 || e >= 8304 && e <= 8591 || e >= 11264 && e <= 12271 || e >= 12289 && e <= 55295 || e >= 63744 && e <= 64975 || e >= 65008 && e <= 65533 || e >= 65536 && e <= 983039;
}
function ar(e) {
	return e >= 9 && e <= 13 || e === 32 || e === 133 || e >= 8206 && e <= 8207 || e === 8232 || e === 8233;
}
function or(e) {
	return e >= 33 && e <= 35 || e === 36 || e >= 37 && e <= 39 || e === 40 || e === 41 || e === 42 || e === 43 || e === 44 || e === 45 || e >= 46 && e <= 47 || e >= 58 && e <= 59 || e >= 60 && e <= 62 || e >= 63 && e <= 64 || e === 91 || e === 92 || e === 93 || e === 94 || e === 96 || e === 123 || e === 124 || e === 125 || e === 126 || e === 161 || e >= 162 && e <= 165 || e === 166 || e === 167 || e === 169 || e === 171 || e === 172 || e === 174 || e === 176 || e === 177 || e === 182 || e === 187 || e === 191 || e === 215 || e === 247 || e >= 8208 && e <= 8213 || e >= 8214 && e <= 8215 || e === 8216 || e === 8217 || e === 8218 || e >= 8219 && e <= 8220 || e === 8221 || e === 8222 || e === 8223 || e >= 8224 && e <= 8231 || e >= 8240 && e <= 8248 || e === 8249 || e === 8250 || e >= 8251 && e <= 8254 || e >= 8257 && e <= 8259 || e === 8260 || e === 8261 || e === 8262 || e >= 8263 && e <= 8273 || e === 8274 || e === 8275 || e >= 8277 && e <= 8286 || e >= 8592 && e <= 8596 || e >= 8597 && e <= 8601 || e >= 8602 && e <= 8603 || e >= 8604 && e <= 8607 || e === 8608 || e >= 8609 && e <= 8610 || e === 8611 || e >= 8612 && e <= 8613 || e === 8614 || e >= 8615 && e <= 8621 || e === 8622 || e >= 8623 && e <= 8653 || e >= 8654 && e <= 8655 || e >= 8656 && e <= 8657 || e === 8658 || e === 8659 || e === 8660 || e >= 8661 && e <= 8691 || e >= 8692 && e <= 8959 || e >= 8960 && e <= 8967 || e === 8968 || e === 8969 || e === 8970 || e === 8971 || e >= 8972 && e <= 8991 || e >= 8992 && e <= 8993 || e >= 8994 && e <= 9e3 || e === 9001 || e === 9002 || e >= 9003 && e <= 9083 || e === 9084 || e >= 9085 && e <= 9114 || e >= 9115 && e <= 9139 || e >= 9140 && e <= 9179 || e >= 9180 && e <= 9185 || e >= 9186 && e <= 9254 || e >= 9255 && e <= 9279 || e >= 9280 && e <= 9290 || e >= 9291 && e <= 9311 || e >= 9472 && e <= 9654 || e === 9655 || e >= 9656 && e <= 9664 || e === 9665 || e >= 9666 && e <= 9719 || e >= 9720 && e <= 9727 || e >= 9728 && e <= 9838 || e === 9839 || e >= 9840 && e <= 10087 || e === 10088 || e === 10089 || e === 10090 || e === 10091 || e === 10092 || e === 10093 || e === 10094 || e === 10095 || e === 10096 || e === 10097 || e === 10098 || e === 10099 || e === 10100 || e === 10101 || e >= 10132 && e <= 10175 || e >= 10176 && e <= 10180 || e === 10181 || e === 10182 || e >= 10183 && e <= 10213 || e === 10214 || e === 10215 || e === 10216 || e === 10217 || e === 10218 || e === 10219 || e === 10220 || e === 10221 || e === 10222 || e === 10223 || e >= 10224 && e <= 10239 || e >= 10240 && e <= 10495 || e >= 10496 && e <= 10626 || e === 10627 || e === 10628 || e === 10629 || e === 10630 || e === 10631 || e === 10632 || e === 10633 || e === 10634 || e === 10635 || e === 10636 || e === 10637 || e === 10638 || e === 10639 || e === 10640 || e === 10641 || e === 10642 || e === 10643 || e === 10644 || e === 10645 || e === 10646 || e === 10647 || e === 10648 || e >= 10649 && e <= 10711 || e === 10712 || e === 10713 || e === 10714 || e === 10715 || e >= 10716 && e <= 10747 || e === 10748 || e === 10749 || e >= 10750 && e <= 11007 || e >= 11008 && e <= 11055 || e >= 11056 && e <= 11076 || e >= 11077 && e <= 11078 || e >= 11079 && e <= 11084 || e >= 11085 && e <= 11123 || e >= 11124 && e <= 11125 || e >= 11126 && e <= 11157 || e === 11158 || e >= 11159 && e <= 11263 || e >= 11776 && e <= 11777 || e === 11778 || e === 11779 || e === 11780 || e === 11781 || e >= 11782 && e <= 11784 || e === 11785 || e === 11786 || e === 11787 || e === 11788 || e === 11789 || e >= 11790 && e <= 11798 || e === 11799 || e >= 11800 && e <= 11801 || e === 11802 || e === 11803 || e === 11804 || e === 11805 || e >= 11806 && e <= 11807 || e === 11808 || e === 11809 || e === 11810 || e === 11811 || e === 11812 || e === 11813 || e === 11814 || e === 11815 || e === 11816 || e === 11817 || e >= 11818 && e <= 11822 || e === 11823 || e >= 11824 && e <= 11833 || e >= 11834 && e <= 11835 || e >= 11836 && e <= 11839 || e === 11840 || e === 11841 || e === 11842 || e >= 11843 && e <= 11855 || e >= 11856 && e <= 11857 || e === 11858 || e >= 11859 && e <= 11903 || e >= 12289 && e <= 12291 || e === 12296 || e === 12297 || e === 12298 || e === 12299 || e === 12300 || e === 12301 || e === 12302 || e === 12303 || e === 12304 || e === 12305 || e >= 12306 && e <= 12307 || e === 12308 || e === 12309 || e === 12310 || e === 12311 || e === 12312 || e === 12313 || e === 12314 || e === 12315 || e === 12316 || e === 12317 || e >= 12318 && e <= 12319 || e === 12320 || e === 12336 || e === 64830 || e === 64831 || e >= 65093 && e <= 65094;
}
function sr(e) {
	e.forEach(function(e) {
		if (delete e.location, mn(e) || hn(e)) for (var t in e.options) delete e.options[t].location, sr(e.options[t].value);
		else dn(e) && vn(e.style) || (fn(e) || pn(e)) && yn(e.style) ? delete e.style.location : _n(e) && sr(e.children);
	});
}
function cr(e, t) {
	t === void 0 && (t = {}), t = R({
		shouldParseSkeletons: !0,
		requiresOtherClause: !0
	}, t);
	var n = new tr(e, t).parse();
	if (n.err) {
		var r = SyntaxError(z[n.err.kind]);
		throw r.location = n.err.location, r.originalMessage = n.err.message, r;
	}
	return t?.captureLocation || sr(n.val), n.val;
}
function lr(e, t) {
	var n = t && t.cache ? t.cache : yr, r = t && t.serializer ? t.serializer : _r;
	return (t && t.strategy ? t.strategy : mr)(e, {
		cache: n,
		serializer: r
	});
}
function ur(e) {
	return e == null || typeof e == "number" || typeof e == "boolean";
}
function dr(e, t, n, r) {
	var i = ur(r) ? r : n(r), a = t.get(i);
	return a === void 0 && (a = e.call(this, r), t.set(i, a)), a;
}
function fr(e, t, n) {
	var r = Array.prototype.slice.call(arguments, 3), i = n(r), a = t.get(i);
	return a === void 0 && (a = e.apply(this, r), t.set(i, a)), a;
}
function pr(e, t, n, r, i) {
	return n.bind(t, e, r, i);
}
function mr(e, t) {
	var n = e.length === 1 ? dr : fr;
	return pr(e, this, n, t.cache.create(), t.serializer);
}
function hr(e, t) {
	return pr(e, this, fr, t.cache.create(), t.serializer);
}
function gr(e, t) {
	return pr(e, this, dr, t.cache.create(), t.serializer);
}
var _r = function() {
	return JSON.stringify(arguments);
};
function vr() {
	this.cache = Object.create(null);
}
vr.prototype.has = function(e) {
	return e in this.cache;
}, vr.prototype.get = function(e) {
	return this.cache[e];
}, vr.prototype.set = function(e, t) {
	this.cache[e] = t;
};
var yr = { create: function() {
	return new vr();
} }, br = {
	variadic: hr,
	monadic: gr
}, xr;
(function(e) {
	e.MISSING_VALUE = "MISSING_VALUE", e.INVALID_VALUE = "INVALID_VALUE", e.MISSING_INTL_API = "MISSING_INTL_API";
})(xr ||= {});
var Sr = class extends Error {
	constructor(e, t, n) {
		super(e), this.code = t, this.originalMessage = n;
	}
	toString() {
		return `[formatjs Error: ${this.code}] ${this.message}`;
	}
}, Cr = class extends Sr {
	constructor(e, t, n, r) {
		super(`Invalid values for "${e}": "${t}". Options are "${Object.keys(n).join("\", \"")}"`, xr.INVALID_VALUE, r);
	}
}, wr = class extends Sr {
	constructor(e, t, n) {
		super(`Value for "${e}" must be of type ${t}`, xr.INVALID_VALUE, n);
	}
}, Tr = class extends Sr {
	constructor(e, t) {
		super(`The intl string context variable "${e}" was not provided to the string "${t}"`, xr.MISSING_VALUE, t);
	}
}, H;
(function(e) {
	e[e.literal = 0] = "literal", e[e.object = 1] = "object";
})(H ||= {});
function Er(e) {
	return e.length < 2 ? e : e.reduce((e, t) => {
		let n = e[e.length - 1];
		return !n || n.type !== H.literal || t.type !== H.literal ? e.push(t) : n.value += t.value, e;
	}, []);
}
function Dr(e) {
	return typeof e == "function";
}
function Or(e, t, n, r, i, a, o) {
	if (e.length === 1 && ln(e[0])) return [{
		type: H.literal,
		value: e[0].value
	}];
	let s = [];
	for (let c of e) {
		if (ln(c)) {
			s.push({
				type: H.literal,
				value: c.value
			});
			continue;
		}
		if (gn(c)) {
			typeof a == "number" && s.push({
				type: H.literal,
				value: n.getNumberFormat(t).format(a)
			});
			continue;
		}
		let { value: e } = c;
		if (!(i && e in i)) throw new Tr(e, o);
		let l = i[e];
		if (un(c)) {
			(!l || typeof l == "string" || typeof l == "number") && (l = typeof l == "string" || typeof l == "number" ? String(l) : ""), s.push({
				type: typeof l == "string" ? H.literal : H.object,
				value: l
			});
			continue;
		}
		if (fn(c)) {
			let e = typeof c.style == "string" ? r.date[c.style] : yn(c.style) ? c.style.parsedOptions : void 0;
			s.push({
				type: H.literal,
				value: n.getDateTimeFormat(t, e).format(l)
			});
			continue;
		}
		if (pn(c)) {
			let e = typeof c.style == "string" ? r.time[c.style] : yn(c.style) ? c.style.parsedOptions : void 0;
			s.push({
				type: H.literal,
				value: n.getDateTimeFormat(t, e).format(l)
			});
			continue;
		}
		if (dn(c)) {
			let e = typeof c.style == "string" ? r.number[c.style] : vn(c.style) ? c.style.parsedOptions : void 0;
			e && e.scale && (l *= e.scale || 1), s.push({
				type: H.literal,
				value: n.getNumberFormat(t, e).format(l)
			});
			continue;
		}
		if (_n(c)) {
			let { children: e, value: l } = c, u = i[l];
			if (!Dr(u)) throw new wr(l, "function", o);
			let d = u(Or(e, t, n, r, i, a).map((e) => e.value));
			Array.isArray(d) || (d = [d]), s.push(...d.map((e) => ({
				type: typeof e == "string" ? H.literal : H.object,
				value: e
			})));
		}
		if (mn(c)) {
			let e = c.options[l] || c.options.other;
			if (!e) throw new Cr(c.value, l, Object.keys(c.options), o);
			s.push(...Or(e.value, t, n, r, i));
			continue;
		}
		if (hn(c)) {
			let e = c.options[`=${l}`];
			if (!e) {
				if (!Intl.PluralRules) throw new Sr("Intl.PluralRules is not available in this environment.\nTry polyfilling it using \"@formatjs/intl-pluralrules\"\n", xr.MISSING_INTL_API, o);
				let r = n.getPluralRules(t, { type: c.pluralType }).select(l - (c.offset || 0));
				e = c.options[r] || c.options.other;
			}
			if (!e) throw new Cr(c.value, l, Object.keys(c.options), o);
			s.push(...Or(e.value, t, n, r, i, l - (c.offset || 0)));
			continue;
		}
	}
	return Er(s);
}
function kr(e, t) {
	return t ? {
		...e || {},
		...t || {},
		...Object.keys(e).reduce((n, r) => (n[r] = {
			...e[r],
			...t[r] || {}
		}, n), {})
	} : e;
}
function Ar(e, t) {
	return t ? Object.keys(e).reduce((n, r) => (n[r] = kr(e[r], t[r]), n), { ...e }) : e;
}
function jr(e) {
	return { create() {
		return {
			has(t) {
				return t in e;
			},
			get(t) {
				return e[t];
			},
			set(t, n) {
				e[t] = n;
			}
		};
	} };
}
function Mr(e = {
	number: {},
	dateTime: {},
	pluralRules: {}
}) {
	return {
		getNumberFormat: lr((...e) => new Intl.NumberFormat(...e), {
			cache: jr(e.number),
			strategy: br.variadic
		}),
		getDateTimeFormat: lr((...e) => new Intl.DateTimeFormat(...e), {
			cache: jr(e.dateTime),
			strategy: br.variadic
		}),
		getPluralRules: lr((...e) => new Intl.PluralRules(...e), {
			cache: jr(e.pluralRules),
			strategy: br.variadic
		})
	};
}
var U = class {
	constructor(e, t = U.defaultLocale, n, r) {
		if (this.formatterCache = {
			number: {},
			dateTime: {},
			pluralRules: {}
		}, this.format = (e) => {
			let t = this.formatToParts(e);
			if (t.length === 1) return t[0].value;
			let n = t.reduce((e, t) => (!e.length || t.type !== H.literal || typeof e[e.length - 1] != "string" ? e.push(t.value) : e[e.length - 1] += t.value, e), []);
			return n.length <= 1 ? n[0] || "" : n;
		}, this.formatToParts = (e) => Or(this.ast, this.locales, this.formatters, this.formats, e, void 0, this.message), this.resolvedOptions = () => ({ locale: Intl.NumberFormat.supportedLocalesOf(this.locales)[0] }), this.getAst = () => this.ast, typeof e == "string") {
			if (this.message = e, !U.__parse) throw TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");
			this.ast = U.__parse(e, { ignoreTag: r?.ignoreTag });
		} else this.ast = e;
		if (!Array.isArray(this.ast)) throw TypeError("A message must be provided as a String or AST.");
		this.formats = Ar(U.formats, n), this.locales = t, this.formatters = r && r.formatters || Mr(this.formatterCache);
	}
	static get defaultLocale() {
		return U.memoizedDefaultLocale ||= new Intl.NumberFormat().resolvedOptions().locale, U.memoizedDefaultLocale;
	}
};
U.memoizedDefaultLocale = null, U.__parse = cr, U.formats = {
	number: {
		integer: { maximumFractionDigits: 0 },
		currency: { style: "currency" },
		percent: { style: "percent" }
	},
	date: {
		short: {
			month: "numeric",
			day: "numeric",
			year: "2-digit"
		},
		medium: {
			month: "short",
			day: "numeric",
			year: "numeric"
		},
		long: {
			month: "long",
			day: "numeric",
			year: "numeric"
		},
		full: {
			weekday: "long",
			month: "long",
			day: "numeric",
			year: "numeric"
		}
	},
	time: {
		short: {
			hour: "numeric",
			minute: "numeric"
		},
		medium: {
			hour: "numeric",
			minute: "numeric",
			second: "numeric"
		},
		long: {
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
			timeZoneName: "short"
		},
		full: {
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
			timeZoneName: "short"
		}
	}
};
var Nr = U, Pr = {}, Fr = class {
	filename;
	stringStructure;
	localizedMessages;
	localizedStringSet;
	constructor(e, t, n) {
		this.filename = e, this.stringStructure = t, this.localizedMessages = n;
	}
	getLocalizedStringSetFor(e) {
		if (this.localizedStringSet) return this.localizedStringSet;
		let t = this.localizedMessages.get(e);
		if (!t) throw Error(`No locale data registered for '${e}'`);
		return this.localizedStringSet = new Ir(this.filename, this.stringStructure, e, t), this.localizedStringSet;
	}
}, Ir = class {
	filename;
	stringStructure;
	localizedMessages;
	cachedSimpleStrings = /* @__PURE__ */ new Map();
	cachedMessageFormatters = /* @__PURE__ */ new Map();
	localeForFormatter;
	constructor(e, t, n, r) {
		this.filename = e, this.stringStructure = t, this.localizedMessages = r, this.localeForFormatter = n === "en-XA" || n === "en-XL" ? "de-DE" : n;
	}
	getLocalizedString(e, t = Pr) {
		return t === Pr || Object.keys(t).length === 0 ? this.getSimpleLocalizedString(e) : this.getFormattedLocalizedString(e, t);
	}
	getMessageFormatterFor(e) {
		let t = Object.keys(this.stringStructure).find((t) => this.stringStructure[t] === e);
		if (!t) throw Error(`Unable to locate '${e}' in UIStrings object`);
		let n = `${this.filename} | ${t}`, r = this.localizedMessages[n];
		return new Nr(r ? r.message : e, this.localeForFormatter, void 0, { ignoreTag: !0 });
	}
	getSimpleLocalizedString(e) {
		let t = this.cachedSimpleStrings.get(e);
		if (t) return t;
		let n = this.getMessageFormatterFor(e);
		try {
			let t = n.format();
			return this.cachedSimpleStrings.set(e, t), t;
		} catch {
			let t = new Nr(e, this.localeForFormatter, void 0, { ignoreTag: !0 }).format();
			return this.cachedSimpleStrings.set(e, t), t;
		}
	}
	getFormattedLocalizedString(e, t) {
		let n = this.cachedMessageFormatters.get(e);
		n || (n = this.getMessageFormatterFor(e), this.cachedMessageFormatters.set(e, n));
		try {
			return n.format(t);
		} catch {
			return new Nr(e, this.localeForFormatter, void 0, { ignoreTag: !0 }).format(t);
		}
	}
}, Lr = class {
	supportedLocales;
	localeData = /* @__PURE__ */ new Map();
	defaultLocale;
	constructor(e, t) {
		this.defaultLocale = t, this.supportedLocales = new Set(e);
	}
	registerLocaleData(e, t) {
		this.localeData.set(e, t);
	}
	hasLocaleDataForTest(e) {
		return this.localeData.has(e);
	}
	resetLocaleDataForTest() {
		this.localeData.clear();
	}
	registerFileStrings(e, t) {
		return new Fr(e, t, this.localeData);
	}
	lookupClosestSupportedLocale(e) {
		let t = Intl.getCanonicalLocales(e)[0].split("-");
		for (; t.length;) {
			let e = t.join("-");
			if (this.supportedLocales.has(e)) return e;
			t.pop();
		}
		return this.defaultLocale;
	}
}, Rr = ["en-US"], zr = Rr, Br = "en-US", Vr = "data:application/json,{}", Hr = Vr, Ur = new Lr(Rr, Br), Wr = /* @__PURE__ */ new Set([...zr]);
function Gr(e) {
	return Ur.lookupClosestSupportedLocale(e);
}
function Kr() {
	return [...Ur.supportedLocales];
}
function qr(t, n) {
	let r = e(n);
	if (r?.version && !Wr.has(t)) return Hr.replace("@HOST@", "devtools://devtools").replace("@VERSION@", r.version).replace("@LOCALE@", t);
	let i = Vr.replace("@LOCALE@", t);
	return new URL(i, new URL("core/i18n/i18nImpl.js", typeof document < "u" ? document.baseURI : new URL("../../", self.location.href).href).href).toString();
}
async function Jr(e, t = globalThis.location?.toString() ?? "") {
	let n = fetch(qr(e, t)).then((e) => e.json()), r = new Promise((e, t) => globalThis.setTimeout(() => t(/* @__PURE__ */ Error("timed out fetching locale")), 5e3)), i = await Promise.race([r, n]);
	Ur.registerLocaleData(e, i);
}
function Yr(e, t, n = {}) {
	return () => Xr(e, t, n);
}
function Xr(e, t, n = {}) {
	return e.getLocalizedStringSetFor(Zt.instance().locale).getLocalizedString(t, n);
}
function Zr(e, t) {
	return Ur.registerFileStrings(e, t);
}
function Qr(e, t = {}) {
	return JSON.stringify({
		string: e,
		values: t
	});
}
function $r(e) {
	return e ? JSON.parse(e) : {
		string: "",
		values: {}
	};
}
function ei(e) {
	return e;
}
function ti(e) {
	return () => e;
}
function ni(e, t) {
	let n = new Intl.Locale(e), { language: r, baseName: i } = n, a = r === new Intl.Locale(t.locale).language ? "en" : i, o = new Intl.DisplayNames([t.locale], { type: "language" }).of(r), s = new Intl.DisplayNames([a], { type: "language" }).of(r), c = "", l = "";
	if (n.region) {
		let e = new Intl.DisplayNames([t.locale], {
			type: "region",
			style: "short"
		}).of(n.region), r = new Intl.DisplayNames([a], {
			type: "region",
			style: "short"
		}).of(n.region);
		c = ` (${e})`, l = ` (${r})`;
	}
	return `${o}${c} - ${s}${l}`;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/core/i18n/time-utilities.ts
var ri = L({
	style: "unit",
	unit: "millisecond",
	unitDisplay: "narrow",
	minimumFractionDigits: 0,
	maximumFractionDigits: 0
}), ii = L({
	style: "unit",
	unit: "millisecond",
	unitDisplay: "long",
	minimumFractionDigits: 0,
	maximumFractionDigits: 0
}), ai = L({
	style: "unit",
	unit: "microsecond",
	unitDisplay: "narrow",
	minimumFractionDigits: 0,
	maximumFractionDigits: 0
}), oi = L({
	style: "unit",
	unit: "millisecond",
	unitDisplay: "narrow",
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
}), si = L({
	style: "unit",
	unit: "second",
	unitDisplay: "narrow",
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
}), ci = L({
	style: "unit",
	unit: "minute",
	unitDisplay: "short",
	minimumFractionDigits: 0,
	maximumFractionDigits: 1
}), li = L({
	style: "unit",
	unit: "hour",
	unitDisplay: "short",
	minimumFractionDigits: 0,
	maximumFractionDigits: 1
}), ui = L({
	style: "unit",
	unit: "day",
	unitDisplay: "long",
	minimumFractionDigits: 0,
	maximumFractionDigits: 1
});
function di(e) {
	return hi(he(e), !0);
}
function fi(e) {
	let t = me(he(e));
	return si.format(t);
}
function pi(e) {
	let t = he(e);
	return ri.format(t);
}
function mi(e) {
	let t = he(e);
	return ii.format(t);
}
function hi(e, t) {
	if (!isFinite(e)) return "-";
	if (t && e < .1) return ai.format(e * 1e3);
	if (t && e < 1e3) return oi.format(e);
	if (e < 1e3) return ri.format(e);
	let n = e / 1e3;
	if (n < 60) return si.format(n);
	let r = n / 60;
	if (r < 60) return ci.format(r);
	let i = r / 60;
	if (i < 24) return li.format(i);
	let a = i / 24;
	return ui.format(a);
}
var gi = /* @__PURE__ */ new Map();
function _i(e, t = 0, n) {
	let r = gi.get(t);
	return r || (r = L({
		style: "unit",
		unit: "millisecond",
		unitDisplay: "narrow",
		minimumFractionDigits: t,
		maximumFractionDigits: t
	}), gi.set(t, r)), r.format(e, n);
}
var vi = /* @__PURE__ */ new Map();
function yi(e, t = 0) {
	let n = vi.get(t);
	return n || (n = L({
		style: "unit",
		unit: "second",
		unitDisplay: "narrow",
		minimumFractionDigits: t,
		maximumFractionDigits: t
	}), vi.set(t, n)), n.format(e);
}
function bi(e, t) {
	return isFinite(e) ? hi(e * 1e3, t) : "-";
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/core/common/Revealer.ts
var W = {
	elementsPanel: "Elements panel",
	stylesSidebar: "styles sidebar",
	changesDrawer: "Changes drawer",
	issuesView: "Issues view",
	networkPanel: "Network panel",
	requestConditionsDrawer: "Request conditions drawer",
	applicationPanel: "Application panel",
	sourcesPanel: "Sources panel",
	timelinePanel: "Performance panel",
	memoryInspectorPanel: "Memory inspector panel",
	developerResourcesPanel: "Developer Resources panel",
	animationsPanel: "Animations panel",
	lighthousePanel: "Lighthouse panel"
}, xi = Zr("core/common/Revealer.ts", W), G = Yr.bind(void 0, xi), Si, Ci = class e {
	registeredRevealers = [];
	static instance() {
		return Si === void 0 && (Si = new e()), Si;
	}
	static removeInstance() {
		Si = void 0;
	}
	register(e) {
		this.registeredRevealers.push(e);
	}
	async reveal(e, t) {
		let n = await Promise.all(this.getApplicableRegisteredRevealers(e).map((e) => e.loadRevealer()));
		if (n.length < 1) throw Error(`No revealers found for ${e}`);
		if (n.length > 1) throw Error(`Conflicting reveals found for ${e}`);
		return await n[0].reveal(e, t);
	}
	getApplicableRegisteredRevealers(e) {
		return this.registeredRevealers.filter((t) => {
			for (let n of t.contextTypes()) if (e instanceof n) return !0;
			return !1;
		});
	}
};
function wi(e) {
	let t = Ci.instance().getApplicableRegisteredRevealers(e);
	for (let { destination: e } of t) if (e) return e();
	return null;
}
function Ti(e) {
	Ci.instance().register(e);
}
async function Ei(e, t = !1) {
	await Ci.instance().reveal(e, t);
}
var Di = {
	DEVELOPER_RESOURCES_PANEL: G(W.developerResourcesPanel),
	ELEMENTS_PANEL: G(W.elementsPanel),
	STYLES_SIDEBAR: G(W.stylesSidebar),
	CHANGES_DRAWER: G(W.changesDrawer),
	ISSUES_VIEW: G(W.issuesView),
	NETWORK_PANEL: G(W.networkPanel),
	REQUEST_CONDITIONS_DRAWER: G(W.requestConditionsDrawer),
	TIMELINE_PANEL: G(W.timelinePanel),
	APPLICATION_PANEL: G(W.applicationPanel),
	SOURCES_PANEL: G(W.sourcesPanel),
	MEMORY_INSPECTOR_PANEL: G(W.memoryInspectorPanel),
	ANIMATIONS_PANEL: G(W.animationsPanel),
	LIGHTHOUSE_PANEL: G(W.lighthousePanel)
}, Oi = class e extends Jt {
	#e = [];
	static instance(t) {
		return (!I().has(e) || t?.forceNew) && I().set(e, new e()), I().get(e);
	}
	static removeInstance() {
		I().delete(e);
	}
	addMessage(e, t = "info", n = !1, r) {
		let i = new Mi(e, t, Date.now(), n, r);
		this.#e.push(i), this.dispatchEventToListeners("messageAdded", i);
	}
	log(e) {
		this.addMessage(e, "info");
	}
	warn(e, t) {
		this.addMessage(e, "warning", void 0, t);
	}
	error(e, t = !0) {
		this.addMessage(e, "error", t);
	}
	messages() {
		return this.#e;
	}
	show() {
		this.showPromise();
	}
	showPromise() {
		return Ei(this);
	}
}, ki = /* @__PURE__ */ function(e) {
	return e.MESSAGE_ADDED = "messageAdded", e;
}({}), Ai = /* @__PURE__ */ function(e) {
	return e.INFO = "info", e.WARNING = "warning", e.ERROR = "error", e;
}({}), ji = /* @__PURE__ */ function(e) {
	return e.CSS = "css", e.ConsoleAPI = "console-api", e.ISSUE_PANEL = "issue-panel", e.SELF_XSS = "self-xss", e;
}({}), Mi = class {
	text;
	level;
	timestamp;
	show;
	source;
	constructor(e, t, n, r, i) {
		this.text = e, this.level = t, this.timestamp = typeof n == "number" ? n : Date.now(), this.show = r, i && (this.source = i);
	}
};
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/core/common/ParsedURL.ts
function Ni(e) {
	if (e.indexOf("..") === -1 && e.indexOf(".") === -1) return e;
	let t = (e[0] === "/" ? e.substring(1) : e).split("/"), n = [];
	for (let e of t) if (e === ".") continue;
	else e === ".." ? n.pop() : n.push(e);
	let r = n.join("/");
	return e[0] === "/" && r && (r = "/" + r), r[r.length - 1] !== "/" && (e[e.length - 1] === "/" || t[t.length - 1] === "." || t[t.length - 1] === "..") && (r += "/"), r;
}
function Pi(e, t) {
	try {
		return new URL(e).protocol === t;
	} catch {
		return !1;
	}
}
var Fi = class e {
	isValid = !1;
	url;
	scheme = "";
	user = "";
	host = "";
	port = "";
	path = "";
	queryParams = "";
	fragment = "";
	folderPathComponents = "";
	lastPathComponent = "";
	blobInnerScheme;
	#e;
	#t;
	constructor(t) {
		this.url = t;
		let n = this.url.startsWith("blob:"), r = (n ? t.substring(5) : t).match(e.urlRegex());
		if (r) this.isValid = !0, n ? (this.blobInnerScheme = r[2].toLowerCase(), this.scheme = "blob") : this.scheme = r[2].toLowerCase(), this.user = r[3] ?? "", this.host = r[4] ?? "", this.port = r[5] ?? "", this.path = r[6] ?? "/", this.queryParams = r[7] ?? "", this.fragment = r[8] ?? "";
		else {
			if (this.url.startsWith("data:")) {
				this.scheme = "data";
				return;
			}
			if (this.url.startsWith("blob:")) {
				this.scheme = "blob";
				return;
			}
			if (this.url === "about:blank") {
				this.scheme = "about";
				return;
			}
			this.path = this.url;
		}
		let i = this.path.lastIndexOf("/", this.path.length - 2);
		this.lastPathComponent = i === -1 ? this.path : this.path.substring(i + 1);
		let a = this.path.lastIndexOf("/");
		a !== -1 && (this.folderPathComponents = this.path.substring(0, a));
	}
	static fromString(t) {
		let n = new e(t.toString());
		return n.isValid ? n : null;
	}
	static preEncodeSpecialCharactersInPath(e) {
		for (let t of [
			"%",
			";",
			"#",
			"?",
			" "
		]) e = e.replaceAll(t, encodeURIComponent(t));
		return e;
	}
	static rawPathToEncodedPathString(t) {
		let n = e.preEncodeSpecialCharactersInPath(t);
		return t.startsWith("/") ? new URL(n, "file:///").pathname : new URL("/" + n, "file:///").pathname.substr(1);
	}
	static encodedFromParentPathAndName(t, n) {
		return e.concatenate(t, "/", e.preEncodeSpecialCharactersInPath(n));
	}
	static urlFromParentUrlAndName(t, n) {
		return e.concatenate(t, "/", e.preEncodeSpecialCharactersInPath(n));
	}
	static encodedPathToRawPathString(e) {
		return decodeURIComponent(e);
	}
	static rawPathToUrlString(t) {
		let n = e.preEncodeSpecialCharactersInPath(t.replace(/\\/g, "/"));
		return n = n.replace(/\\/g, "/"), n.startsWith("file://") || (n = n.startsWith("/") ? "file://" + n : "file:///" + n), new URL(n).toString();
	}
	static relativePathToUrlString(t, n) {
		let r = e.preEncodeSpecialCharactersInPath(t.replace(/\\/g, "/"));
		return new URL(r, n).toString();
	}
	static urlToRawPathString(e, t) {
		console.assert(e.startsWith("file://"), "This must be a file URL.");
		let n = decodeURIComponent(e);
		return t ? n.substr(8).replace(/\//g, "\\") : n.substr(7);
	}
	static sliceUrlToEncodedPathString(e, t) {
		return e.substring(t);
	}
	static substr(e, t, n) {
		return e.substr(t, n);
	}
	static substring(e, t, n) {
		return e.substring(t, n);
	}
	static prepend(e, t) {
		return e + t;
	}
	static concatenate(e, ...t) {
		return e.concat(...t);
	}
	static trim(e) {
		return e.trim();
	}
	static slice(e, t, n) {
		return e.slice(t, n);
	}
	static join(e, t) {
		return e.join(t);
	}
	static split(e, t, n) {
		return e.split(t, n);
	}
	static toLowerCase(e) {
		return e.toLowerCase();
	}
	static isValidUrlString(t) {
		return new e(t).isValid;
	}
	static urlWithoutHash(e) {
		let t = e.indexOf("#");
		return t === -1 ? e : e.substr(0, t);
	}
	static urlRegex() {
		return e.urlRegexInstance ||= /* @__PURE__ */ RegExp("^(([A-Za-z][A-Za-z0-9+.-]*):\\/\\/(?:([A-Za-z0-9\\-._~%!$&'()*+,;=:]*)@)?((?:\\[::\\d?\\])|(?:[^\\s\\/:]*))(?::([\\d]+))?)(\\/[^#?]*)?(?:\\?([^#]*))?(?:#(.*))?$"), e.urlRegexInstance;
	}
	static extractPath(e) {
		let t = this.fromString(e);
		return t ? t.path : "";
	}
	static extractOrigin(e) {
		let t = this.fromString(e);
		return t ? t.securityOrigin() : "";
	}
	static extractExtension(t) {
		t = e.urlWithoutHash(t);
		let n = t.indexOf("?");
		n !== -1 && (t = t.substr(0, n));
		let r = t.lastIndexOf("/");
		r !== -1 && (t = t.substr(r + 1));
		let i = t.lastIndexOf(".");
		if (i !== -1) {
			t = t.substr(i + 1);
			let e = t.indexOf("%");
			return e === -1 ? t : t.substr(0, e);
		}
		return "";
	}
	static extractName(e) {
		e.endsWith("/") && (e = e.slice(0, -1));
		let t = e.lastIndexOf("/"), n = t === -1 ? e : e.substr(t + 1);
		return t = n.indexOf("?"), t < 0 ? n : n.substr(0, t);
	}
	static completeURL(e, t) {
		if (t.startsWith("data:") || t.startsWith("blob:") || t.startsWith("javascript:") || t.startsWith("mailto:")) return t;
		let n = t.trim(), r = this.fromString(n);
		if (r?.scheme) {
			let e = r.securityOrigin(), t = Ni(r.path), n = r.queryParams && `?${r.queryParams}`, i = r.fragment && `#${r.fragment}`;
			return e + t + n + i;
		}
		let i = this.fromString(e);
		if (!i) return null;
		if (i.isDataURL()) return t;
		if (t.length > 1 && t.charAt(0) === "/" && t.charAt(1) === "/") return i.scheme + ":" + t;
		let a = i.securityOrigin(), o = i.path, s = i.queryParams ? "?" + i.queryParams : "";
		if (!t.length) return a + o + s;
		if (t.charAt(0) === "#") return a + o + s + t;
		if (t.charAt(0) === "?") return a + o + t;
		let c = t.match(/^[^#?]*/);
		if (!c || !t.length) throw Error("Invalid href");
		let l = c[0], u = t.substring(l.length);
		return l.charAt(0) !== "/" && (l = i.folderPathComponents + "/" + l), a + Ni(l) + u;
	}
	static splitLineAndColumn(t) {
		let n = t.match(e.urlRegex()), r = "", i = t;
		n && (r = n[1], i = t.substring(n[1].length));
		let a = /(?::(\d+))?(?::(\d+))?$/.exec(i), o, s;
		if (console.assert(!!a), !a) return {
			url: t,
			lineNumber: 0,
			columnNumber: 0
		};
		typeof a[1] == "string" && (o = parseInt(a[1], 10), o = isNaN(o) ? void 0 : o - 1), typeof a[2] == "string" && (s = parseInt(a[2], 10), s = isNaN(s) ? void 0 : s - 1);
		let c = r + i.substring(0, i.length - a[0].length);
		if (a[1] === void 0 && a[2] === void 0) {
			let t = /wasm-function\[\d+\]:0x([a-z0-9]+)$/g.exec(i);
			t && typeof t[1] == "string" && (c = e.removeWasmFunctionInfoFromURL(c), s = parseInt(t[1], 16), s = isNaN(s) ? void 0 : s);
		}
		return {
			url: c,
			lineNumber: o,
			columnNumber: s
		};
	}
	static removeWasmFunctionInfoFromURL(t) {
		let n = t.search(/:wasm-function\[\d+\]/);
		return n === -1 ? t : e.substring(t, 0, n);
	}
	static beginsWithWindowsDriveLetter(e) {
		return /^[A-Za-z]:/.test(e);
	}
	static beginsWithScheme(e) {
		return /^[A-Za-z][A-Za-z0-9+.-]*:/.test(e);
	}
	static isRelativeURL(e) {
		return !this.beginsWithScheme(e) || this.beginsWithWindowsDriveLetter(e);
	}
	get displayName() {
		return this.#e ? this.#e : this.isDataURL() ? this.dataURLDisplayName() : this.isBlobURL() || this.isAboutBlank() ? this.url : (this.#e = this.lastPathComponent, this.#e ||= (this.host || "") + "/", this.#e === "/" && (this.#e = this.url), this.#e);
	}
	dataURLDisplayName() {
		return this.#t ? this.#t : this.isDataURL() ? (this.#t = s(this.url, 20), this.#t) : "";
	}
	isAboutBlank() {
		return this.url === "about:blank";
	}
	isDataURL() {
		return this.scheme === "data";
	}
	extractDataUrlMimeType() {
		let e = this.url.match(/^data:((?<type>\w+)\/(?<subtype>\w+))?(;base64)?,/);
		return {
			type: e?.groups?.type,
			subtype: e?.groups?.subtype
		};
	}
	isBlobURL() {
		return this.url.startsWith("blob:");
	}
	lastPathComponentWithFragment() {
		return this.lastPathComponent + (this.fragment ? "#" + this.fragment : "");
	}
	domain() {
		return this.isDataURL() ? "data:" : this.host + (this.port ? ":" + this.port : "");
	}
	securityOrigin() {
		return this.isDataURL() ? "data:" : (this.isBlobURL() ? this.blobInnerScheme : this.scheme) + "://" + this.domain();
	}
	urlWithoutScheme() {
		return this.scheme && this.url.startsWith(this.scheme + "://") ? this.url.substring(this.scheme.length + 3) : this.url;
	}
	static urlRegexInstance = null;
}, K = {
	fetchAndXHR: "`Fetch` and `XHR`",
	javascript: "JavaScript",
	js: "JS",
	css: "CSS",
	img: "Img",
	media: "Media",
	font: "Font",
	doc: "Doc",
	socketShort: "Socket",
	webassembly: "WebAssembly",
	wasm: "Wasm",
	manifest: "Manifest",
	other: "Other",
	document: "Document",
	stylesheet: "Stylesheet",
	image: "Image",
	script: "Script",
	texttrack: "TextTrack",
	fetch: "Fetch",
	eventsource: "EventSource",
	websocket: "WebSocket",
	webtransport: "WebTransport",
	directsocket: "DirectSocket",
	signedexchange: "SignedExchange",
	ping: "Ping",
	cspviolationreport: "CSPViolationReport",
	preflight: "Preflight",
	fedcm: "FedCM"
}, Ii = Zr("core/common/ResourceType.ts", K), q = Yr.bind(void 0, Ii), J = class {
	#e;
	#t;
	#n;
	#r;
	constructor(e, t, n, r) {
		this.#e = e, this.#t = t, this.#n = n, this.#r = r;
	}
	static fromMimeType(e) {
		return e ? e.startsWith("text/html") ? Z.Document : e.startsWith("text/css") ? Z.Stylesheet : e.startsWith("image/") ? Z.Image : e.startsWith("text/") ? Z.Script : e.includes("font") ? Z.Font : e.includes("script") ? Z.Script : e.includes("octet") ? Z.Other : e.includes("application") ? Z.Script : Z.Other : Z.Other;
	}
	static fromMimeTypeOverride(e) {
		return e === "application/manifest+json" ? Z.Manifest : e === "application/wasm" ? Z.Wasm : null;
	}
	static fromURL(e) {
		return Ri.get(Fi.extractExtension(e)) || null;
	}
	static fromName(e) {
		for (let t of Object.values(Z)) if (t.name() === e) return t;
		return null;
	}
	static mimeFromURL(e) {
		if (e.startsWith("snippet://") || e.startsWith("debugger://")) return "text/javascript";
		let t = Fi.extractName(e);
		if (Li.has(t)) return Li.get(t);
		let n = Fi.extractExtension(e).toLowerCase();
		return n === "html" && t.endsWith(".component.html") && (n = "component.html"), zi.get(n);
	}
	static mimeFromExtension(e) {
		return zi.get(e);
	}
	static simplifyContentType(e) {
		return (/* @__PURE__ */ RegExp("^application(.*json$|/json+.*)")).test(e) ? "application/json" : e;
	}
	static isJavaScriptMimeType(e) {
		return e === "application/javascript" || e === "text/javascript";
	}
	static mediaTypeForMetrics(e, t, n, r, i) {
		return e === "text/javascript" ? t ? "text/javascript+sourcemapped" : n ? "text/javascript+minified" : r ? "text/javascript+snippet" : i ? "text/javascript+eval" : "text/javascript+plain" : e;
	}
	name() {
		return this.#e;
	}
	title() {
		return this.#t();
	}
	category() {
		return this.#n;
	}
	isTextType() {
		return this.#r;
	}
	isScript() {
		return this.#e === "script" || this.#e === "sm-script";
	}
	hasScripts() {
		return this.isScript() || this.isDocument();
	}
	isStyleSheet() {
		return this.#e === "stylesheet" || this.#e === "sm-stylesheet";
	}
	hasStyleSheets() {
		return this.isStyleSheet() || this.isDocument();
	}
	isDocument() {
		return this.#e === "document";
	}
	isDocumentOrScriptOrStyleSheet() {
		return this.isDocument() || this.isScript() || this.isStyleSheet();
	}
	isFont() {
		return this.#e === "font";
	}
	isImage() {
		return this.#e === "image";
	}
	isFromSourceMap() {
		return this.#e.startsWith("sm-");
	}
	toString() {
		return this.#e;
	}
	canonicalMimeType() {
		return this.isDocument() ? "text/html" : this.isScript() ? "text/javascript" : this.isStyleSheet() ? "text/css" : "";
	}
}, Y = class {
	name;
	title;
	shortTitle;
	constructor(e, t, n) {
		this.name = e, this.title = t, this.shortTitle = n;
	}
}, X = {
	XHR: new Y("Fetch and XHR", q(K.fetchAndXHR), ti("Fetch/XHR")),
	Document: new Y(K.document, q(K.document), q(K.doc)),
	Stylesheet: new Y(K.css, q(K.css), q(K.css)),
	Script: new Y(K.javascript, q(K.javascript), q(K.js)),
	Font: new Y(K.font, q(K.font), q(K.font)),
	Image: new Y(K.image, q(K.image), q(K.img)),
	Media: new Y(K.media, q(K.media), q(K.media)),
	Manifest: new Y(K.manifest, q(K.manifest), q(K.manifest)),
	Socket: new Y("Socket", ti("WebSocket | WebTransport | DirectSocket"), q(K.socketShort)),
	Wasm: new Y(K.webassembly, q(K.webassembly), q(K.wasm)),
	Other: new Y(K.other, q(K.other), q(K.other))
}, Z = {
	Document: new J("document", q(K.document), X.Document, !0),
	Stylesheet: new J("stylesheet", q(K.stylesheet), X.Stylesheet, !0),
	Image: new J("image", q(K.image), X.Image, !1),
	Media: new J("media", q(K.media), X.Media, !1),
	Font: new J("font", q(K.font), X.Font, !1),
	Script: new J("script", q(K.script), X.Script, !0),
	TextTrack: new J("texttrack", q(K.texttrack), X.Other, !0),
	XHR: new J("xhr", ti("XHR"), X.XHR, !0),
	Fetch: new J("fetch", q(K.fetch), X.XHR, !0),
	Prefetch: new J("prefetch", ti("Prefetch"), X.Document, !0),
	EventSource: new J("eventsource", q(K.eventsource), X.XHR, !0),
	WebSocket: new J("websocket", q(K.websocket), X.Socket, !1),
	WebTransport: new J("webtransport", q(K.webtransport), X.Socket, !1),
	DirectSocket: new J("directsocket", q(K.directsocket), X.Socket, !1),
	Wasm: new J("wasm", q(K.wasm), X.Wasm, !1),
	Manifest: new J("manifest", q(K.manifest), X.Manifest, !0),
	SignedExchange: new J("signed-exchange", q(K.signedexchange), X.Other, !1),
	Ping: new J("ping", q(K.ping), X.Other, !1),
	CSPViolationReport: new J("csp-violation-report", q(K.cspviolationreport), X.Other, !1),
	Other: new J("other", q(K.other), X.Other, !1),
	Preflight: new J("preflight", q(K.preflight), X.Other, !0),
	SourceMapScript: new J("sm-script", q(K.script), X.Script, !0),
	SourceMapStyleSheet: new J("sm-stylesheet", q(K.stylesheet), X.Stylesheet, !0),
	FedCM: new J("fedcm", q(K.fedcm), X.Other, !1)
}, Li = /* @__PURE__ */ new Map([["Cakefile", "text/x-coffeescript"]]), Ri = /* @__PURE__ */ new Map([
	["js", Z.Script],
	["mjs", Z.Script],
	["css", Z.Stylesheet],
	["xsl", Z.Stylesheet],
	["avif", Z.Image],
	["bmp", Z.Image],
	["gif", Z.Image],
	["ico", Z.Image],
	["jpeg", Z.Image],
	["jpg", Z.Image],
	["jxl", Z.Image],
	["png", Z.Image],
	["svg", Z.Image],
	["tif", Z.Image],
	["tiff", Z.Image],
	["vue", Z.Document],
	["webmanifest", Z.Manifest],
	["webp", Z.Media],
	["otf", Z.Font],
	["ttc", Z.Font],
	["ttf", Z.Font],
	["woff", Z.Font],
	["woff2", Z.Font],
	["wasm", Z.Wasm]
]), zi = /* @__PURE__ */ new Map([
	["js", "text/javascript"],
	["mjs", "text/javascript"],
	["css", "text/css"],
	["html", "text/html"],
	["htm", "text/html"],
	["xml", "application/xml"],
	["xsl", "application/xml"],
	["wasm", "application/wasm"],
	["webmanifest", "application/manifest+json"],
	["asp", "application/x-aspx"],
	["aspx", "application/x-aspx"],
	["jsp", "application/x-jsp"],
	["c", "text/x-c++src"],
	["cc", "text/x-c++src"],
	["cpp", "text/x-c++src"],
	["h", "text/x-c++src"],
	["m", "text/x-c++src"],
	["mm", "text/x-c++src"],
	["coffee", "text/x-coffeescript"],
	["dart", "application/vnd.dart"],
	["ts", "text/typescript"],
	["tsx", "text/typescript-jsx"],
	["json", "application/json"],
	["gyp", "application/json"],
	["gypi", "application/json"],
	["map", "application/json"],
	["cs", "text/x-csharp"],
	["go", "text/x-go"],
	["java", "text/x-java"],
	["kt", "text/x-kotlin"],
	["scala", "text/x-scala"],
	["less", "text/x-less"],
	["php", "application/x-httpd-php"],
	["phtml", "application/x-httpd-php"],
	["py", "text/x-python"],
	["sh", "text/x-sh"],
	["gss", "text/x-gss"],
	["sass", "text/x-sass"],
	["scss", "text/x-scss"],
	["vtt", "text/vtt"],
	["ls", "text/x-livescript"],
	["md", "text/markdown"],
	["cljs", "text/x-clojure"],
	["cljc", "text/x-clojure"],
	["cljx", "text/x-clojure"],
	["styl", "text/x-styl"],
	["jsx", "text/jsx"],
	["avif", "image/avif"],
	["bmp", "image/bmp"],
	["gif", "image/gif"],
	["ico", "image/ico"],
	["jpeg", "image/jpeg"],
	["jpg", "image/jpeg"],
	["jxl", "image/jxl"],
	["png", "image/png"],
	["svg", "image/svg+xml"],
	["tif", "image/tif"],
	["tiff", "image/tiff"],
	["webp", "image/webp"],
	["otf", "font/otf"],
	["ttc", "font/collection"],
	["ttf", "font/ttf"],
	["woff", "font/woff"],
	["woff2", "font/woff2"],
	["component.html", "text/x.angular"],
	["svelte", "text/x.svelte"],
	["vue", "text/x.vue"]
]), Bi = class {
	begin;
	end;
	data;
	constructor(e, t, n) {
		if (e > t) throw Error("Invalid segment");
		this.begin = e, this.end = t, this.data = n;
	}
	intersects(e) {
		return this.begin < e.end && e.begin < this.end;
	}
}, Vi = class {
	#e = [];
	#t;
	constructor(e) {
		this.#t = e;
	}
	append(e) {
		let t = se(this.#e, e, (e, t) => e.begin - t.begin), n = t, r = null;
		if (t > 0) {
			let n = this.#e[t - 1];
			r = this.tryMerge(n, e), r ? (--t, e = r) : this.#e[t - 1].end >= e.begin && (e.end < n.end && this.#e.splice(t, 0, new Bi(e.end, n.end, n.data)), n.end = e.begin);
		}
		for (; n < this.#e.length && this.#e[n].end <= e.end;) ++n;
		n < this.#e.length && (r = this.tryMerge(e, this.#e[n]), r ? (n++, e = r) : e.intersects(this.#e[n]) && (this.#e[n].begin = e.end)), this.#e.splice(t, n - t, e);
	}
	segments() {
		return this.#e;
	}
	tryMerge(e, t) {
		let n = this.#t && this.#t(e, t);
		return n ? (n.begin = e.begin, n.end = Math.max(e.end, t.end), n) : null;
	}
}, Q = {
	elements: "Elements",
	ai: "AI",
	appearance: "Appearance",
	sources: "Sources",
	network: "Network",
	performance: "Performance",
	console: "Console",
	persistence: "Persistence",
	debugger: "Debugger",
	global: "Global",
	rendering: "Rendering",
	grid: "Grid",
	mobile: "Mobile",
	memory: "Memory",
	extension: "Extension",
	adorner: "Adorner",
	account: "Account",
	privacy: "Privacy"
}, Hi = Zr("core/common/SettingRegistration.ts", Q), $ = Xr.bind(void 0, Hi), Ui = [], Wi = /* @__PURE__ */ new Set();
function Gi(e) {
	let t = e.settingName;
	if (Wi.has(t)) throw Error(`Duplicate setting name '${t}'`);
	Wi.add(t), Ui.push(e);
}
function Ki() {
	return Ui.filter((e) => n.isDescriptorEnabled(e));
}
function qi(e) {
	let t = Ui.findIndex((t) => t.settingName === e);
	return t < 0 || !Wi.delete(e) ? !1 : (Ui.splice(t, 1), !0);
}
var Ji = /* @__PURE__ */ function(e) {
	return e.NONE = "", e.ELEMENTS = "ELEMENTS", e.AI = "AI", e.APPEARANCE = "APPEARANCE", e.SOURCES = "SOURCES", e.NETWORK = "NETWORK", e.PERFORMANCE = "PERFORMANCE", e.CONSOLE = "CONSOLE", e.PERSISTENCE = "PERSISTENCE", e.DEBUGGER = "DEBUGGER", e.GLOBAL = "GLOBAL", e.RENDERING = "RENDERING", e.GRID = "GRID", e.MOBILE = "MOBILE", e.EMULATION = "EMULATION", e.MEMORY = "MEMORY", e.EXTENSIONS = "EXTENSIONS", e.ADORNER = "ADORNER", e.ACCOUNT = "ACCOUNT", e.PRIVACY = "PRIVACY", e;
}({});
function Yi(e) {
	switch (e) {
		case "ELEMENTS": return $(Q.elements);
		case "AI": return $(Q.ai);
		case "APPEARANCE": return $(Q.appearance);
		case "SOURCES": return $(Q.sources);
		case "NETWORK": return $(Q.network);
		case "PERFORMANCE": return $(Q.performance);
		case "CONSOLE": return $(Q.console);
		case "PERSISTENCE": return $(Q.persistence);
		case "DEBUGGER": return $(Q.debugger);
		case "GLOBAL": return $(Q.global);
		case "RENDERING": return $(Q.rendering);
		case "GRID": return $(Q.grid);
		case "MOBILE": return $(Q.mobile);
		case "EMULATION": return $(Q.console);
		case "MEMORY": return $(Q.memory);
		case "EXTENSIONS": return $(Q.extension);
		case "ADORNER": return $(Q.adorner);
		case "": return ei("");
		case "ACCOUNT": return $(Q.account);
		case "PRIVACY": return $(Q.privacy);
	}
}
var Xi = /* @__PURE__ */ function(e) {
	return e.ARRAY = "array", e.REGEX = "regex", e.ENUM = "enum", e.BOOLEAN = "boolean", e;
}({}), Zi = class e {
	static GLOBAL_VERSION_SETTING_NAME = "inspectorVersion";
	static SYNCED_VERSION_SETTING_NAME = "syncedInspectorVersion";
	static LOCAL_VERSION_SETTING_NAME = "localInspectorVersion";
	static CURRENT_VERSION = 46;
	#e;
	#t;
	#n;
	#r;
	constructor(t) {
		this.#e = t, this.#t = this.#e.createSetting(e.GLOBAL_VERSION_SETTING_NAME, e.CURRENT_VERSION, ia.GLOBAL), this.#n = this.#e.createSetting(e.SYNCED_VERSION_SETTING_NAME, e.CURRENT_VERSION, ia.SYNCED), this.#r = this.#e.createSetting(e.LOCAL_VERSION_SETTING_NAME, e.CURRENT_VERSION, ia.LOCAL);
	}
	resetToCurrent() {
		this.#t.set(e.CURRENT_VERSION), this.#n.set(e.CURRENT_VERSION), this.#r.set(e.CURRENT_VERSION);
	}
	#i(e) {
		let t = e.name;
		this.#e.getRegistry().delete(t), this.#e.moduleSettings.delete(t), e.storage.remove(t);
	}
	updateVersion() {
		let t = e.CURRENT_VERSION, n = Math.min(this.#t.get(), this.#n.get(), this.#r.get()), r = this.methodsToRunToUpdateVersion(n, t);
		console.assert(this[`updateVersionFrom${t}To${t + 1}`] === void 0, "Unexpected migration method found. Increment CURRENT_VERSION or remove the method.");
		for (let e of r) this[e].call(this);
		this.resetToCurrent();
	}
	methodsToRunToUpdateVersion(e, t) {
		let n = [];
		for (let r = e; r < t; ++r) n.push("updateVersionFrom" + r + "To" + (r + 1));
		return n;
	}
	updateVersionFrom0To1() {
		this.clearBreakpointsWhenTooMany(this.#e.createLocalSetting("breakpoints", []), 5e5);
	}
	updateVersionFrom1To2() {
		this.#e.createSetting("previouslyViewedFiles", []).set([]);
	}
	updateVersionFrom2To3() {
		this.#e.createSetting("fileSystemMapping", {}).set({}), this.#i(this.#e.createSetting("fileMappingEntries", []));
	}
	updateVersionFrom3To4() {
		let e = this.#e.createSetting("showHeaSnapshotObjectsHiddenProperties", !1);
		this.#e.moduleSetting("showAdvancedHeapSnapshotProperties").set(e.get()), this.#i(e);
	}
	updateVersionFrom4To5() {
		let e = {
			FileSystemViewSidebarWidth: "fileSystemViewSplitViewState",
			elementsSidebarWidth: "elementsPanelSplitViewState",
			StylesPaneSplitRatio: "stylesPaneSplitViewState",
			heapSnapshotRetainersViewSize: "heapSnapshotSplitViewState",
			"InspectorView.splitView": "InspectorView.splitViewState",
			"InspectorView.screencastSplitView": "InspectorView.screencastSplitViewState",
			"Inspector.drawerSplitView": "Inspector.drawerSplitViewState",
			layerDetailsSplitView: "layerDetailsSplitViewState",
			networkSidebarWidth: "networkPanelSplitViewState",
			sourcesSidebarWidth: "sourcesPanelSplitViewState",
			scriptsPanelNavigatorSidebarWidth: "sourcesPanelNavigatorSplitViewState",
			sourcesPanelSplitSidebarRatio: "sourcesPanelDebuggerSidebarSplitViewState",
			"timeline-details": "timelinePanelDetailsSplitViewState",
			"timeline-split": "timelinePanelRecorsSplitViewState",
			"timeline-view": "timelinePanelTimelineStackSplitViewState",
			auditsSidebarWidth: "auditsPanelSplitViewState",
			layersSidebarWidth: "layersPanelSplitViewState",
			profilesSidebarWidth: "profilesPanelSplitViewState",
			resourcesSidebarWidth: "resourcesPanelSplitViewState"
		}, t = {};
		for (let n in e) {
			let r = e[n], i = n + "H", a = null, o = this.#e.createSetting(n, t);
			o.get() !== t && (a ||= {}, a.vertical = {}, a.vertical.size = o.get(), this.#i(o));
			let s = this.#e.createSetting(i, t);
			s.get() !== t && (a ||= {}, a.horizontal = {}, a.horizontal.size = s.get(), this.#i(s)), a && this.#e.createSetting(r, {}).set(a);
		}
	}
	updateVersionFrom5To6() {
		let e = {
			debuggerSidebarHidden: "sourcesPanelSplitViewState",
			navigatorHidden: "sourcesPanelNavigatorSplitViewState",
			"WebInspector.Drawer.showOnLoad": "Inspector.drawerSplitViewState"
		};
		for (let t in e) {
			let n = this.#e.createSetting(t, null);
			if (n.get() === null) {
				this.#i(n);
				continue;
			}
			let r = e[t], i = t === "WebInspector.Drawer.showOnLoad", a = n.get() !== i;
			this.#i(n);
			let o = a ? "OnlyMain" : "Both", s = this.#e.createSetting(r, {}), c = s.get() || {};
			c.vertical = c.vertical || {}, c.vertical.showMode = o, c.horizontal = c.horizontal || {}, c.horizontal.showMode = o, s.set(c);
		}
	}
	updateVersionFrom6To7() {
		let e = {
			sourcesPanelNavigatorSplitViewState: "sourcesPanelNavigatorSplitViewState",
			elementsPanelSplitViewState: "elementsPanelSplitViewState",
			stylesPaneSplitViewState: "stylesPaneSplitViewState",
			sourcesPanelDebuggerSidebarSplitViewState: "sourcesPanelDebuggerSidebarSplitViewState"
		}, t = {};
		for (let n in e) {
			let e = this.#e.createSetting(n, t), r = e.get();
			r !== t && (r.vertical?.size && r.vertical.size < 1 && (r.vertical.size = 0), r.horizontal?.size && r.horizontal.size < 1 && (r.horizontal.size = 0), e.set(r));
		}
	}
	updateVersionFrom7To8() {}
	updateVersionFrom8To9() {
		let e = ["skipStackFramesPattern", "workspaceFolderExcludePattern"];
		for (let t = 0; t < e.length; ++t) {
			let n = this.#e.createSetting(e[t], ""), r = n.get();
			if (!r) return;
			typeof r == "string" && (r = [r]);
			for (let e = 0; e < r.length; ++e) typeof r[e] == "string" && (r[e] = { pattern: r[e] });
			n.set(r);
		}
	}
	updateVersionFrom9To10() {
		let e = i.getLocalStorage();
		if (e) for (let t in e) t.startsWith("revision-history") && e.removeItem(t);
	}
	updateVersionFrom10To11() {
		let e = this.#e.createSetting("customDevicePresets", void 0), t = e.get();
		if (!Array.isArray(t)) return;
		let n = [];
		for (let e = 0; e < t.length; ++e) {
			let r = t[e], i = {};
			i.title = r.title, i.type = "unknown", i["user-agent"] = r.userAgent, i.capabilities = [], r.touch && i.capabilities.push("touch"), r.mobile && i.capabilities.push("mobile"), i.screen = {}, i.screen.vertical = {
				width: r.width,
				height: r.height
			}, i.screen.horizontal = {
				width: r.height,
				height: r.width
			}, i.screen["device-pixel-ratio"] = r.deviceScaleFactor, i.modes = [], i["show-by-default"] = !0, i.show = "Default", n.push(i);
		}
		n.length && this.#e.createSetting("customEmulatedDeviceList", []).set(n), this.#i(e);
	}
	updateVersionFrom11To12() {
		this.migrateSettingsFromLocalStorage();
	}
	updateVersionFrom12To13() {
		this.migrateSettingsFromLocalStorage(), this.#i(this.#e.createSetting("timelineOverviewMode", ""));
	}
	updateVersionFrom13To14() {
		let e = {
			throughput: -1,
			latency: 0
		};
		this.#e.createSetting("networkConditions", e).set(e);
	}
	updateVersionFrom14To15() {
		let e = this.#e.createLocalSetting("workspaceExcludedFolders", {}), t = e.get(), n = {};
		for (let e in t) {
			n[e] = [];
			for (let r of t[e]) n[e].push(r.path);
		}
		e.set(n);
	}
	updateVersionFrom15To16() {
		let e = this.#e.createSetting("InspectorView.panelOrder", {}), t = e.get();
		for (let e of Object.keys(t)) t[e] = (t[e] + 1) * 10;
		e.set(t);
	}
	updateVersionFrom16To17() {
		let e = this.#e.createSetting("networkConditionsCustomProfiles", []), t = e.get(), n = [];
		if (Array.isArray(t)) for (let e of t) typeof e.title == "string" && typeof e.value == "object" && typeof e.value.throughput == "number" && typeof e.value.latency == "number" && n.push({
			title: e.title,
			value: {
				download: e.value.throughput,
				upload: e.value.throughput,
				latency: e.value.latency
			}
		});
		e.set(n);
	}
	updateVersionFrom17To18() {
		let e = this.#e.createLocalSetting("workspaceExcludedFolders", {}), t = e.get(), n = {};
		for (let e in t) {
			let r = e.replace(/\\/g, "/");
			r.startsWith("file://") || (r = r.startsWith("/") ? "file://" + r : "file:///" + r), n[r] = t[e];
		}
		e.set(n);
	}
	updateVersionFrom18To19() {
		let e = this.#e.createSetting("networkLogColumnsVisibility", {
			status: !0,
			type: !0,
			initiator: !0,
			size: !0,
			time: !0
		}), t = e.get();
		t.name = !0, t.timeline = !0;
		let n = {};
		for (let e in t) t.hasOwnProperty(e) && (n[e.toLowerCase()] = { visible: t[e] });
		this.#e.createSetting("networkLogColumns", {}).set(n), this.#i(e);
	}
	updateVersionFrom19To20() {
		let e = this.#e.createSetting("InspectorView.panelOrder", {});
		this.#e.createSetting("panel-tabOrder", {}).set(e.get()), this.#i(e);
	}
	updateVersionFrom20To21() {
		let e = this.#e.createSetting("networkLogColumns", {}), t = e.get();
		delete t.timeline, delete t.waterfall, e.set(t);
	}
	updateVersionFrom21To22() {
		let e = this.#e.createLocalSetting("breakpoints", []), t = e.get();
		for (let e of t) e.url = e.sourceFileId, delete e.sourceFileId;
		e.set(t);
	}
	updateVersionFrom22To23() {}
	updateVersionFrom23To24() {
		let e = this.#e.createSetting("searchInContentScripts", !1);
		this.#e.createSetting("searchInAnonymousAndContentScripts", !1).set(e.get()), this.#i(e);
	}
	updateVersionFrom24To25() {
		let e = this.#e.createSetting("networkLogColumns", {
			status: !0,
			type: !0,
			initiator: !0,
			size: !0,
			time: !0
		}), t = e.get();
		delete t.product, e.set(t);
	}
	updateVersionFrom25To26() {
		let e = this.#e.createSetting("messageURLFilters", {}), t = Object.keys(e.get()).map((e) => `-url:${e}`).join(" ");
		if (t) {
			let e = this.#e.createSetting("console.textFilter", ""), n = e.get() ? ` ${e.get()}` : "";
			e.set(`${t}${n}`);
		}
		this.#i(e);
	}
	updateVersionFrom26To27() {
		let e = this.#e;
		function t(t, n, r) {
			let i = e.createSetting(t, {}), a = i.get();
			n in a && (a[r] = a[n], delete a[n], i.set(a));
		}
		function n(t, n, r) {
			let i = e.createSetting(t, "");
			i.get() === n && i.set(r);
		}
		t("panel-tabOrder", "audits2", "audits"), t("panel-closeableTabs", "audits2", "audits"), n("panel-selectedTab", "audits2", "audits");
	}
	updateVersionFrom27To28() {
		let e = this.#e.createSetting("uiTheme", "systemPreferred");
		e.get() === "default" && e.set("systemPreferred");
	}
	updateVersionFrom28To29() {
		let e = this.#e;
		function t(t, n, r) {
			let i = e.createSetting(t, {}), a = i.get();
			n in a && (a[r] = a[n], delete a[n], i.set(a));
		}
		function n(t, n, r) {
			let i = e.createSetting(t, "");
			i.get() === n && i.set(r);
		}
		t("panel-tabOrder", "audits", "lighthouse"), t("panel-closeableTabs", "audits", "lighthouse"), n("panel-selectedTab", "audits", "lighthouse");
	}
	updateVersionFrom29To30() {
		let e = this.#e.createSetting("closeableTabs", {}), t = this.#e.createSetting("panel-closeableTabs", {}), n = this.#e.createSetting("drawer-view-closeableTabs", {}), r = t.get(), i = t.get(), a = Object.assign(i, r);
		e.set(a), this.#i(t), this.#i(n);
	}
	updateVersionFrom30To31() {
		let e = this.#e.createSetting("recorder_recordings", []);
		this.#i(e);
	}
	updateVersionFrom31To32() {
		let e = this.#e.createLocalSetting("breakpoints", []), t = e.get();
		for (let e of t) e.resourceTypeName = "script";
		e.set(t);
	}
	updateVersionFrom32To33() {
		let e = this.#e.createLocalSetting("previouslyViewedFiles", []), t = e.get();
		t = t.filter((e) => "url" in e);
		for (let e of t) e.resourceTypeName = "script";
		e.set(t);
	}
	updateVersionFrom33To34() {
		let e = this.#e.createLocalSetting("breakpoints", []), t = e.get();
		for (let e of t) e.isLogpoint = e.condition.startsWith("/** DEVTOOLS_LOGPOINT */ console.log(") && e.condition.endsWith(")");
		e.set(t);
	}
	updateVersionFrom34To35() {
		let e = this.#e.createLocalSetting("breakpoints", []), t = e.get();
		for (let e of t) {
			let { condition: t, isLogpoint: n } = e;
			n && (e.condition = t.slice(37, t.length - 1));
		}
		e.set(t);
	}
	updateVersionFrom35To36() {
		this.#e.createSetting("showThirdPartyIssues", !0).set(!0);
	}
	updateVersionFrom36To37() {
		let e = (e) => {
			for (let t of e.keys()) {
				let n = Qi.normalizeSettingName(t);
				if (n !== t) {
					let r = e.get(t);
					this.#i({
						name: t,
						storage: e
					}), e.set(n, r);
				}
			}
		};
		e(this.#e.globalStorage), e(this.#e.syncedStorage), e(this.#e.localStorage);
		for (let e of this.#e.globalStorage.keys()) {
			if (e.startsWith("data-grid-") && e.endsWith("-column-weights") || e.endsWith("-tab-order") || e === "views-location-override" || e === "closeable-tabs") {
				let t = this.#e.createSetting(e, {});
				t.set(a(t.get()));
			}
			if (e.endsWith("-selected-tab")) {
				let t = this.#e.createSetting(e, "");
				t.set(u(t.get()));
			}
		}
	}
	updateVersionFrom37To38() {
		let e = (() => {
			try {
				return this.#e.moduleSetting("console-insights-enabled");
			} catch {
				return;
			}
		})(), t = this.#e.createLocalSetting("console-insights-onboarding-finished", !1);
		e && e.get() === !0 && t.get() === !1 && e.set(!1), e && e.get() === !1 && t.set(!1);
	}
	updateVersionFrom38To39() {
		let e = "preferred-network-condition", t = this.#e.globalStorage.get(e);
		if (t) try {
			let n = JSON.parse(t);
			n.title === "Slow 3G" ? (n.title = "3G", n.i18nTitleKey = "3G", this.#e.globalStorage.set(e, JSON.stringify(n))) : n.title === "Fast 3G" && (n.title = "Slow 4G", n.i18nTitleKey = "Slow 4G", this.#e.globalStorage.set(e, JSON.stringify(n)));
		} catch {
			this.#e.globalStorage.remove(e);
		}
	}
	updateVersionFrom39To40() {
		if ((() => {
			try {
				return this.#e.moduleSetting("custom-network-conditions"), !0;
			} catch {
				return !1;
			}
		})()) {
			let e = this.#e.moduleSetting("custom-network-conditions"), t = e.get();
			t?.length > 0 && (t.forEach((e, t) => {
				e.key ||= `USER_CUSTOM_SETTING_${t + 1}`;
			}), e.set(t));
		}
		let e = "preferred-network-condition", t = this.#e.globalStorage.get(e);
		if (!t) return;
		let n = {
			"Fast 4G": "SPEED_FAST_4G",
			"Slow 4G": "SPEED_SLOW_4G",
			"3G": "SPEED_3G",
			"No throttling": "NO_THROTTLING",
			Offline: "OFFLINE"
		};
		try {
			let e = JSON.parse(t);
			if (e.i18nTitleKey && n.hasOwnProperty(e.i18nTitleKey)) {
				let t = n[e.i18nTitleKey];
				this.#e.createSetting("active-network-condition-key", "NO_THROTTLING").set(t);
			}
		} finally {
			this.#e.globalStorage.remove(e);
		}
	}
	updateVersionFrom40To41() {
		if (this.#e.syncedStorage.has("hide-network-messages")) {
			let e = this.#e.createSetting("hide-network-messages", !1, ia.SYNCED);
			this.#e.syncedStorage.has("network-messages") || this.#e.createSetting("network-messages", !0, ia.SYNCED).set(!e.get()), this.#i(e);
		}
		if (this.#e.syncedStorage.has("frame-viewer-hide-chrome-window")) {
			let e = this.#e.createSetting("frame-viewer-hide-chrome-window", !1, ia.SYNCED);
			this.#e.syncedStorage.has("frame-viewer-chrome-window") || this.#e.createSetting("frame-viewer-chrome-window", !0, ia.SYNCED).set(!e.get()), this.#i(e);
		}
	}
	updateVersionFrom41To42() {
		let e = this.#e.createSetting("recorder-recordings-ng", []), t = e.get();
		if (t.length !== 0) {
			for (let e of t) e.flow.title = s(e.flow.title, 300), e.flow.steps = e.flow.steps.slice(0, 4096);
			e.set(t);
		}
	}
	updateVersionFrom42To43() {
		let e = t.getValueFromStorage("timeline-show-all-events");
		if (e !== void 0) {
			if (this.#e.syncedStorage.has("timeline-show-all-events")) return;
			try {
				this.#e.moduleSetting("timeline-show-all-events").set(e);
			} catch {}
		}
	}
	updateVersionFrom43To44() {
		let e = t.getValueFromStorage("apca");
		if (e !== void 0) {
			if (this.#e.syncedStorage.has("apca")) return;
			try {
				this.#e.moduleSetting("apca").set(e);
			} catch {}
		}
	}
	updateVersionFrom44To45() {
		let e = t.getValueFromStorage("timeline-debug-mode");
		if (e !== void 0) {
			if (this.#e.syncedStorage.has("timeline-debug-mode")) return;
			try {
				this.#e.moduleSetting("timeline-debug-mode").set(e);
			} catch {}
		}
	}
	updateVersionFrom45To46() {
		let e = t.getValueFromStorage("timeline-invalidation-tracking");
		if (e !== void 0) {
			if (this.#e.syncedStorage.has("timeline-invalidation-tracking")) return;
			try {
				this.#e.moduleSetting("timeline-invalidation-tracking").set(e);
			} catch {}
		}
	}
	migrateSettingsFromLocalStorage() {
		let e = /* @__PURE__ */ new Set([
			"advancedSearchConfig",
			"breakpoints",
			"consoleHistory",
			"domBreakpoints",
			"eventListenerBreakpoints",
			"fileSystemMapping",
			"lastSelectedSourcesSidebarPaneTab",
			"previouslyViewedFiles",
			"savedURLs",
			"watchExpressions",
			"workspaceExcludedFolders",
			"xhrBreakpoints"
		]), t = i.getLocalStorage();
		if (t) for (let n in t) {
			if (e.has(n)) continue;
			let r = t[n];
			t.removeItem(n), this.#e.globalStorage.set(n, r);
		}
	}
	clearBreakpointsWhenTooMany(e, t) {
		e.get().length > t && e.set([]);
	}
}, Qi = class e {
	syncedStorage;
	globalStorage;
	localStorage;
	#e;
	#t = new ea({});
	settingNameSet = /* @__PURE__ */ new Set();
	orderValuesBySettingCategory = /* @__PURE__ */ new Map();
	#n = new Jt();
	#r = /* @__PURE__ */ new Map();
	moduleSettings = /* @__PURE__ */ new Map();
	#i;
	constructor({ syncedStorage: e, globalStorage: t, localStorage: i, settingRegistrations: a, logSettingAccess: o, runSettingsMigration: s }) {
		this.syncedStorage = e, this.globalStorage = t, this.localStorage = i, this.#e = a, this.#i = o;
		for (let e of this.#e) {
			let { settingName: t, defaultValue: i, storageType: a } = e, o = e.settingType === Xi.REGEX, s = typeof i == "function" ? i(r) : i, c = o && typeof s == "string" ? this.createRegExpSetting(t, s, void 0, a) : this.createSetting(t, s, a);
			c.setTitleFunction(e.title), e.userActionCondition && c.setRequiresUserAction(!!n.queryParam(e.userActionCondition)), c.setRegistration(e), this.registerModuleSetting(c);
		}
		s && new Zi(this).updateVersion();
	}
	getRegisteredSettings() {
		return this.#e;
	}
	static hasInstance() {
		return I().has(e);
	}
	static instance(t = {
		forceNew: null,
		syncedStorage: null,
		globalStorage: null,
		localStorage: null,
		settingRegistrations: null
	}) {
		let { forceNew: n, syncedStorage: r, globalStorage: i, localStorage: a, settingRegistrations: o, logSettingAccess: s, runSettingsMigration: c } = t;
		if (!I().has(e) || n) {
			if (!r || !i || !a || !o) throw Error(`Unable to create settings: global and local storage must be provided: ${(/* @__PURE__ */ Error()).stack}`);
			I().set(e, new e({
				syncedStorage: r,
				globalStorage: i,
				localStorage: a,
				settingRegistrations: o,
				logSettingAccess: s,
				runSettingsMigration: c
			}));
		}
		return I().get(e);
	}
	static removeInstance() {
		I().delete(e);
	}
	registerModuleSetting(e) {
		let t = e.name, n = e.category(), r = e.order();
		if (this.settingNameSet.has(t)) throw Error(`Duplicate Setting name '${t}'`);
		if (n && r) {
			let e = this.orderValuesBySettingCategory.get(n) || /* @__PURE__ */ new Set();
			if (e.has(r)) throw Error(`Duplicate order value '${r}' for settings category '${n}'`);
			e.add(r), this.orderValuesBySettingCategory.set(n, e);
		}
		this.settingNameSet.add(t), this.moduleSettings.set(e.name, e);
	}
	static normalizeSettingName(e) {
		return [
			Zi.GLOBAL_VERSION_SETTING_NAME,
			Zi.SYNCED_VERSION_SETTING_NAME,
			Zi.LOCAL_VERSION_SETTING_NAME,
			"currentDockState",
			"isUnderTest"
		].includes(e) ? e : u(e);
	}
	moduleSetting(e) {
		let t = this.moduleSettings.get(e);
		if (!t) throw Error("No setting registered: " + e);
		return t;
	}
	settingForTest(e) {
		let t = this.#r.get(e);
		if (!t) throw Error("No setting registered: " + e);
		return t;
	}
	createSetting(e, t, n) {
		let r = this.storageFromType(n), i = this.#r.get(e);
		return i || (i = new na(e, t, this.#n, r, this.#i), this.#r.set(e, i)), i;
	}
	createLocalSetting(e, t) {
		return this.createSetting(e, t, "Local");
	}
	createRegExpSetting(e, t, n, r) {
		return this.#r.get(e) || this.#r.set(e, new ra(e, t, this.#n, this.storageFromType(r), n, this.#i)), this.#r.get(e);
	}
	clearAll() {
		this.globalStorage.removeAll(), this.syncedStorage.removeAll(), this.localStorage.removeAll(), new Zi(this).resetToCurrent();
	}
	storageFromType(e) {
		switch (e) {
			case "Local": return this.localStorage;
			case "Session": return this.#t;
			case "Global": return this.globalStorage;
			case "Synced": return this.syncedStorage;
		}
		return this.globalStorage;
	}
	getRegistry() {
		return this.#r;
	}
}, $i = class {
	#e = /* @__PURE__ */ new Map();
	register(e) {}
	set(e, t) {
		this.#e.set(e, t);
	}
	get(e) {
		return this.#e.get(e);
	}
	remove(e) {
		this.#e.delete(e);
	}
	clear() {
		this.#e.clear();
	}
}, ea = class {
	object;
	backingStore;
	storagePrefix;
	constructor(e, t = new $i(), n = "") {
		this.object = e, this.backingStore = t, this.storagePrefix = n;
	}
	register(e) {
		e = this.storagePrefix + e, this.backingStore.register(e);
	}
	set(e, t) {
		e = this.storagePrefix + e, this.object[e] = t, this.backingStore.set(e, t);
	}
	has(e) {
		return e = this.storagePrefix + e, e in this.object;
	}
	get(e) {
		return e = this.storagePrefix + e, this.object[e];
	}
	async forceGet(e) {
		let t = this.storagePrefix + e, n = await this.backingStore.get(t);
		return n && n !== this.object[t] ? this.set(e, n) : n || this.remove(e), n;
	}
	remove(e) {
		e = this.storagePrefix + e, delete this.object[e], this.backingStore.remove(e);
	}
	removeAll() {
		this.object = {}, this.backingStore.clear();
	}
	keys() {
		return Object.keys(this.object);
	}
	dumpSizes() {
		Oi.instance().log("Ten largest settings: ");
		let e = { __proto__: null };
		for (let t in this.object) e[t] = this.object[t].length;
		let t = Object.keys(e);
		function n(t, n) {
			return e[n] - e[t];
		}
		t.sort(n);
		for (let n = 0; n < 10 && n < t.length; ++n) Oi.instance().log("Setting: '" + t[n] + "', size: " + e[t[n]]);
	}
}, ta = class {
	disabled;
	warning;
	experiment;
	constructor({ deprecationNotice: e }) {
		if (!e) throw Error("Cannot create deprecation info for a non-deprecated setting");
		this.disabled = e.disabled, this.warning = e.warning(), this.experiment = e.experiment ? t.allConfigurableExperiments().find((t) => t.name === e.experiment) : void 0;
	}
}, na = class {
	name;
	defaultValue;
	eventSupport;
	storage;
	#e;
	#t;
	#n = null;
	#r;
	#i;
	#a = JSON;
	#o;
	#s;
	#c = null;
	#l = !1;
	#u;
	constructor(e, t, n, r, i) {
		this.name = e, this.defaultValue = t, this.eventSupport = n, this.storage = r, r.register(this.name), this.#u = i;
	}
	setSerializer(e) {
		this.#a = e;
	}
	addChangeListener(e, t) {
		return this.eventSupport.addEventListener(this.name, e, t);
	}
	removeChangeListener(e, t) {
		this.eventSupport.removeEventListener(this.name, e, t);
	}
	title() {
		return this.#t ? this.#t : this.#e ? this.#e() : "";
	}
	setTitleFunction(e) {
		e && (this.#e = e);
	}
	setTitle(e) {
		this.#t = e;
	}
	setRequiresUserAction(e) {
		this.#r = e;
	}
	disabled() {
		if (this.#n?.disabledCondition) {
			let { disabled: e } = this.#n.disabledCondition(r);
			if (e) return !0;
		}
		return this.#s || !1;
	}
	disabledReasons() {
		if (this.#n?.disabledCondition) {
			let e = this.#n.disabledCondition(r);
			if (e.disabled) return e.reasons;
		}
		return [];
	}
	setDisabled(e) {
		this.#s = e, this.eventSupport.dispatchEventToListeners(this.name);
	}
	#d(e) {
		try {
			let t = typeof e == "string" || typeof e == "number" || typeof e == "boolean" ? e : this.#a?.stringify(e);
			t !== void 0 && this.#u && this.#u(this.name, t);
		} catch {}
	}
	#f(e) {
		this.#l ||= (this.#d(e), !0);
	}
	get() {
		if (this.#r && !this.#o) return this.#f(this.defaultValue), this.defaultValue;
		if (this.#i !== void 0) return this.#f(this.#i), this.#i;
		if (this.#i = this.defaultValue, this.storage.has(this.name)) try {
			this.#i = this.#a.parse(this.storage.get(this.name));
		} catch {
			this.storage.remove(this.name);
		}
		return this.#f(this.#i), this.#i;
	}
	getIfNotDisabled() {
		if (!this.disabled()) return this.get();
	}
	async forceGet() {
		let e = this.name, t = this.storage.get(e), n = await this.storage.forceGet(e);
		if (this.#i = this.defaultValue, n) try {
			this.#i = this.#a.parse(n);
		} catch {
			this.storage.remove(this.name);
		}
		return t !== n && this.eventSupport.dispatchEventToListeners(this.name, this.#i), this.#f(this.#i), this.#i;
	}
	set(e) {
		this.#d(e), this.#o = !0, this.#i = e;
		try {
			let t = this.#a.stringify(e);
			try {
				this.storage.set(this.name, t);
			} catch (e) {
				this.printSettingsSavingError(e.message, t);
			}
		} catch (e) {
			Oi.instance().error("Cannot stringify setting with name: " + this.name + ", error: " + e.message);
		}
		this.eventSupport.dispatchEventToListeners(this.name, e);
	}
	setRegistration(e) {
		this.#n = e;
		let { deprecationNotice: n } = e;
		if (n?.disabled) {
			let e = n.experiment ? t.allConfigurableExperiments().find((e) => e.name === n.experiment) : void 0;
			(!e || e.isEnabled()) && (this.set(this.defaultValue), this.setDisabled(!0));
		}
	}
	type() {
		return this.#n ? this.#n.settingType : null;
	}
	options() {
		return this.#n && this.#n.options ? this.#n.options.map((e) => {
			let { value: t, title: n, text: r, raw: i } = e;
			return {
				value: t,
				title: n(),
				text: typeof r == "function" ? r() : r,
				raw: i
			};
		}) : [];
	}
	reloadRequired() {
		return this.#n && this.#n.reloadRequired || null;
	}
	category() {
		return this.#n && this.#n.category || null;
	}
	tags() {
		return this.#n && this.#n.tags ? this.#n.tags.map((e) => e()).join("\0") : null;
	}
	order() {
		return this.#n && this.#n.order || null;
	}
	learnMore() {
		return this.#n?.learnMore ?? null;
	}
	get deprecation() {
		return !this.#n || !this.#n.deprecationNotice ? null : (this.#c ||= new ta(this.#n), this.#c);
	}
	printSettingsSavingError(e, t) {
		let n = "Error saving setting with name: " + this.name + ", value length: " + t.length + ". Error: " + e;
		console.error(n), Oi.instance().error(n), this.storage.dumpSizes();
	}
}, ra = class extends na {
	#e;
	#t;
	constructor(e, t, n, r, i, a) {
		super(e, t ? [{ pattern: t }] : [], n, r, a), this.#e = i;
	}
	get() {
		let e = [], t = this.getAsArray();
		for (let n = 0; n < t.length; ++n) {
			let r = t[n];
			r.pattern && !r.disabled && e.push(r.pattern);
		}
		return e.join("|");
	}
	getAsArray() {
		return super.get();
	}
	set(e) {
		this.setAsArray([{
			pattern: e,
			disabled: !1
		}]);
	}
	setAsArray(e) {
		this.#t = void 0, super.set(e);
	}
	asRegExp() {
		if (this.#t !== void 0) return this.#t;
		this.#t = null;
		try {
			let e = this.get();
			e && (this.#t = new RegExp(e, this.#e || ""));
		} catch {}
		return this.#t;
	}
}, ia = /* @__PURE__ */ function(e) {
	return e.SYNCED = "Synced", e.GLOBAL = "Global", e.LOCAL = "Local", e.SESSION = "Session", e;
}({});
function aa(e) {
	return Qi.instance().moduleSetting(e);
}
//#endregion
export { Yt as $, f as $t, mi as A, ze as At, Yr as B, ve as Bt, ji as C, At as Ct, Ei as D, yt as Dt, Ti as E, mt as Et, yi as F, st as Ft, Gr as G, pe as Gt, Xr as H, he as Ht, bi as I, Re as It, on as J, ae as Jt, Zr as K, ie as Kt, $r as L, Qe as Lt, di as M, tt as Mt, hi as N, nt as Nt, wi as O, Et as Ot, _i as P, it as Pt, Jt as Q, ne as Qt, Jr as R, v as Rt, ki as S, kt as St, Di as T, Tt, ti as U, me as Ut, ni as V, ye as Vt, ei as W, oe as Wt, Zt as X, de as Xt, sn as Y, ue as Yt, Qt as Z, d as Zt, Z as _, Vt as _t, ea as a, Nt as at, Pi as b, Ot as bt, Xi as c, N as ct, qi as d, D as dt, ce as en, Gt as et, Gi as f, F as ft, X as g, A as gt, J as h, k as ht, Qi as i, j as it, fi as j, $e as jt, pi as k, Pe as kt, Yi as l, Ut as lt, Vi as m, Rt as mt, na as n, qt as nt, aa as o, Wt as ot, Bi as p, It as pt, Qr as q, se as qt, ia as r, ft as rt, Ji as s, M as st, ra as t, I as tt, Ki as u, O as ut, Fi as v, Ft as vt, Ai as w, ut as wt, Oi as x, Dt as xt, Ni as y, Ht as yt, Kr as z, _e as zt };
