//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/core/platform/StringUtilities.ts
var e = (e, t) => {
	let n = !1;
	for (let r = 0; r < t.length; ++r) if (e.indexOf(t.charAt(r)) !== -1) {
		n = !0;
		break;
	}
	if (!n) return String(e);
	let r = "";
	for (let n = 0; n < e.length; ++n) t.indexOf(e.charAt(n)) !== -1 && (r += "\\"), r += e.charAt(n);
	return r;
}, t = (e, t) => e.toString(16).toUpperCase().padStart(t, "0"), n = /* @__PURE__ */ new Map([
	["\b", "\\b"],
	["\f", "\\f"],
	["\n", "\\n"],
	["\r", "\\r"],
	["	", "\\t"],
	["\v", "\\v"],
	["'", "\\'"],
	["\\", "\\\\"],
	["<!--", "\\x3C!--"],
	["<script", "\\x3Cscript"],
	["<\/script", "\\x3C/script"]
]), r = (e) => {
	let r = /(\\|<(?:!--|\/?script))|(\p{Control})|(\p{Surrogate})/gu, i = /(\\|'|<(?:!--|\/?script))|(\p{Control})|(\p{Surrogate})/gu, a = (e, r, i, a) => i ? n.has(i) ? n.get(i) : "\\x" + t(i.charCodeAt(0), 2) : a ? "\\u" + t(a.charCodeAt(0), 4) : r ? n.get(r) || "" : e, o = "", s = "";
	return e.includes("'") ? e.includes("\"") ? !e.includes("`") && !e.includes("${") ? (s = "`", o = e.replaceAll(r, a)) : (s = "'", o = e.replaceAll(i, a)) : (s = "\"", o = e.replaceAll(r, a)) : (s = "'", o = e.replaceAll(r, a)), `${s}${o}${s}`;
}, i = (e, ...t) => {
	let n = 0;
	return e.replaceAll(/%(?:(\d+)\$)?(?:\.(\d*))?([%dfs])/g, (e, r, i, a) => {
		if (a === "%") return "%";
		if (r !== void 0 && (n = parseInt(r, 10) - 1, n < 0)) throw RangeError(`Invalid parameter index ${n + 1}`);
		if (n >= t.length) throw RangeError(`Expected at least ${n + 1} format parameters, but only ${t.length} where given.`);
		if (a === "s") {
			let e = String(t[n++]);
			return i === void 0 ? e : e.substring(0, Number(i));
		}
		let o = Number(t[n++]);
		return isNaN(o) && (o = 0), a === "d" ? String(Math.floor(o)).padStart(Number(i), "0") : i === void 0 ? String(o) : o.toFixed(Number(i));
	});
}, a = (e) => {
	function t(e) {
		return e < 26 ? e + 65 : e < 52 ? e + 71 : e < 62 ? e - 4 : e === 62 ? 43 : e === 63 ? 47 : 65;
	}
	let n = new TextEncoder().encode(e.toString()), r = n.length, i = "";
	if (r === 0) return i;
	let a, o = 0;
	for (let e = 0; e < r; e++) a = e % 3, o |= n[e] << (16 >>> a & 24), a === 2 && (i += String.fromCharCode(t(o >>> 18 & 63), t(o >>> 12 & 63), t(o >>> 6 & 63), t(o & 63)), o = 0);
	return a === 0 ? i += String.fromCharCode(t(o >>> 18 & 63), t(o >>> 12 & 63), 61, 61) : a === 1 && (i += String.fromCharCode(t(o >>> 18 & 63), t(o >>> 12 & 63), t(o >>> 6 & 63), 61)), i;
}, o = (e, t) => {
	let n = [], r = e.indexOf(t);
	for (; r !== -1;) n.push(r), r = e.indexOf(t, r + t.length);
	return n;
}, s = (e) => {
	let t = o(e, "\n");
	return t.push(e.length), t;
}, c = (e) => /^\s*$/.test(e), l = (e, t) => {
	let n = e.replace(/^(https|http|file):\/\//i, "");
	return t && n.toLowerCase().startsWith(t.toLowerCase()) && (n = n.substr(t.length)), n;
}, u = (e) => e.replace(/[\s\xA0]+/g, " "), d = (e) => e.replace(/[\0-\x08\x0B\f\x0E-\x1F\x80-\x9F]/g, "�"), f = (e) => {
	let t = 0;
	for (let n = 0; n < e.length; n++) {
		let r = e.charCodeAt(n);
		if (r <= 127) t++;
		else if (r <= 2047) t += 2;
		else if (r < 55296 || 57343 < r) t += 3;
		else {
			if (r <= 56319 && n + 1 < e.length) {
				let r = e.charCodeAt(n + 1);
				if (56320 <= r && r <= 57343) {
					t += 4, n++;
					continue;
				}
			}
			t += 3;
		}
	}
	return t;
}, p = (e) => e.replace(/(\r)?\n/g, ""), m = /^([a-z0-9]+(?:-[a-z0-9]+)*\.)*[a-z0-9]+(?:-[a-z0-9]+)*$/, h = (e) => m.test(e), g = (e) => e.substring(0, 1).toUpperCase() + e.substring(1), _ = (e) => {
	let t = new URL(e);
	return t.hash = "", t.toString();
}, v = "^[]{}()\\.^$*+?|-,", y = "?+*(){}\\:", b = function() {
	return v;
}, x = function(e) {
	let t = "^(?:.*\\0)?";
	for (let n = 0; n < e.length; ++n) {
		let r = e.charAt(n);
		v.indexOf(r) !== -1 && (r = "\\" + r), t += "[^\\0" + r + "]*" + r;
	}
	return new RegExp(t, "i");
}, S = function(e, t, n, r = !1) {
	let i = t ? "g" : "gi", a;
	if (n) try {
		a = new RegExp(e, i);
	} catch {}
	return a ||= F(e, i), r && a && (a = RegExp(`\\b${a.source}\\b`, i)), a;
}, C = function(e, t) {
	return e = e.toUpperCase(), t = t.toUpperCase(), e === t ? 0 : e > t ? 1 : -1;
}, w = function(e) {
	if (!e) return 0;
	let t = (1 << 30) * 4 - 5, n = 0, r = 1;
	for (let i = 0; i < e.length; i++) {
		let a = e.charCodeAt(i) * 1506996573;
		n = (n + r * a) % t, r = r * 1345575271 % t;
	}
	return n = (n + r * 4294967290) % t, Math.abs(n | 0);
}, T = (e, t) => e > t ? 1 : e < t ? -1 : 0, E = (e, t) => {
	if (e.length <= t) return e;
	let n = new Intl.Segmenter(void 0, { granularity: "grapheme" });
	if (t <= 1) return "…";
	let r = t - 1, i = Math.ceil(r / 2), a = Math.floor(r / 2), o = 0, s = 0, c = [];
	for (let { segment: t, index: r } of n.segment(e)) o++, o === i && (s = r + t.length), a > 0 && (c.push(r), c.length > a && c.shift());
	if (o <= t) return e;
	let l = a > 0 ? c[0] : e.length;
	return e.slice(0, s) + "…" + e.slice(l);
}, D = (e, t) => {
	if (e.length <= t) return e;
	let n = new Intl.Segmenter(void 0, { granularity: "grapheme" }).segment(e)[Symbol.iterator](), r = 0;
	for (let i = 0; i <= t - 1; i++) {
		let t = n.next();
		if (t.done) return e;
		r = t.value.index;
	}
	for (let t = 0; t < 1; t++) if (n.next().done) return e;
	return e.slice(0, r) + "…";
}, O = (t) => e(t, v), k = (t) => e(t, y), A = (e, t) => {
	let n = /^\d+|^\D+/, r, i, a, o;
	for (;;) {
		if (e) {
			if (!t) return 1;
		} else return t ? -1 : 0;
		if (r = e.match(n)[0], i = t.match(n)[0], a = !Number.isNaN(Number(r)), o = !Number.isNaN(Number(i)), a && !o) return -1;
		if (o && !a) return 1;
		if (a && o) {
			let e = Number(r) - Number(i);
			if (e) return e;
			if (r.length !== i.length) return !Number(r) && !Number(i) ? r.length - i.length : i.length - r.length;
		} else if (r !== i) return r < i ? -1 : 1;
		e = e.substring(r.length), t = t.substring(i.length);
	}
}, j = function(e) {
	if (!e) return 0;
	let t = e.length * 3 / 4;
	return e[e.length - 1] === "=" && t--, e.length > 1 && e[e.length - 2] === "=" && t--, t;
}, M = "\\", N = function(e) {
	let t = "";
	for (let n = 0; n < e.length; ++n) {
		let r = e[n];
		if (r === M) {
			n++;
			continue;
		}
		(r === "'" || r === "\"") && (t === r ? t = "" : t === "" && (t = r));
	}
	return t;
}, P = (e) => {
	let t = e.replace(/'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"/g, ""), n = 0;
	for (let e of t) e === "(" ? n++ : e === ")" && n > 0 && n--;
	return n;
}, F = function(e, t) {
	let n = "";
	for (let t = 0; t < e.length; ++t) {
		let r = e.charAt(t);
		b().indexOf(r) !== -1 && (n += "\\"), n += r;
	}
	return new RegExp(n, t || "");
}, I = function(e) {
	return e.toLowerCase();
}, L = /[A-Z]{2,}(?=[A-Z0-9][a-z0-9]+|\b|_)|[A-Za-z][0-9]+[a-z]?|[A-Z]?[a-z]+|[0-9][A-Za-z]+|[A-Z]|[0-9]+|[.]/g, R = function(e) {
	return e.match?.(L)?.map((e) => e.toLowerCase()).join("-").replaceAll("-.-", ".") || e;
};
function z(e) {
	return Object.fromEntries(Object.entries(e).map(([e, t]) => [R(e), t]));
}
function B(e) {
	return e ? e.replace(/(\p{L})(\p{N})/gu, "$1_$2").replace(/(\p{Lu}+)(\p{Lu}\p{Ll})/gu, "$1_$2").replace(/(\p{Ll}|\p{N})(\p{Lu})/gu, "$1_$2").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "_").replace(/^_|_$/g, "") : "";
}
var V = function(e, t, n) {
	let r = e.lastIndexOf(t);
	return r === -1 ? e : e.slice(0, r) + e.slice(r).replace(t, n);
}, H = function(e, t = 2) {
	if (t === 0) return e.toFixed(0);
	let n = e.toFixed(t).replace(/\.?0*$/, "");
	return n === "-0" ? "0" : n;
}, U = function(e, t) {
	if (e.length === 0 || !e.endsWith("=")) return e + t;
	let n = e.substring(0, e.length - 4), r = e.substring(e.length - 4);
	return n + globalThis.btoa(globalThis.atob(r) + globalThis.atob(t));
};
//#endregion
export { z as A, d as C, p as D, H as E, E as F, l as I, B as M, g as N, a as O, D as P, _ as S, i as T, w as _, U as a, A as b, F as c, O as d, k as f, r as g, N as h, T as i, I as j, R as k, S as l, s as m, C as n, P as o, x as p, u as r, f as s, j as t, e as u, h as v, V as w, b as x, c as y };
