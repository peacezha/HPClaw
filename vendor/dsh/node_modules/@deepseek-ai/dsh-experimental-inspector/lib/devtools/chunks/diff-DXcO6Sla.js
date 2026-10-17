import "./common-DMSVbaSb.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/core/common/CharacterIdMap.ts
var e = class {
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ new Map();
	#n = 33;
	toChar(e) {
		let t = this.#e.get(e);
		if (!t) {
			if (this.#n >= 65535) throw Error("CharacterIdMap ran out of capacity!");
			t = String.fromCharCode(this.#n++), this.#e.set(e, t), this.#t.set(t, e);
		}
		return t;
	}
	fromChar(e) {
		let t = this.#t.get(e);
		return t === void 0 ? null : t;
	}
}, t = {
	charDiff: function(e, t, n) {
		let r = new diff_match_patch(), i = r.diff_main(e, t);
		return n && r.diff_cleanupSemantic(i), i;
	},
	lineDiff: function(n, r) {
		let i = new e(), a = n.map((e) => i.toChar(e)).join(""), o = r.map((e) => i.toChar(e)).join("");
		if (a === o) return [];
		let s = t.charDiff(a, o), c = [];
		for (let e = 0; e < s.length; e++) {
			let t = [];
			for (let n = 0; n < s[e][1].length; n++) t.push(i.fromChar(s[e][1][n]) || "");
			c.push({
				0: s[e][0],
				1: t
			});
		}
		return c;
	},
	convertToEditDiff: function(e) {
		let t = [], n = 0, r = 0;
		for (let a = 0; a < e.length; ++a) {
			let o = e[a];
			o[0] === 0 ? (i(), t.push([0, o[1].length])) : o[0] === -1 ? r += o[1].length : n += o[1].length;
		}
		return i(), t;
		function i() {
			if (n && r) {
				let e = Math.min(n, r);
				t.push([2, e]), n -= e, r -= e;
			}
			if (n || r) {
				let e = n - r, i = e < 0 ? -1 : 1;
				t.push([i, Math.abs(e)]), n = 0, r = 0;
			}
		}
	},
	characterScore: function(e, n) {
		let r = 0, i = t.charDiff(e, n);
		for (let e = 0; e < i.length; ++e) i[e][0] === 0 && (r += i[e][1].length * i[e][1].length);
		return r;
	}
}, n = /* @__PURE__ */ function(e) {
	return e[e.Equal = 0] = "Equal", e[e.Insert = 1] = "Insert", e[e.Delete = -1] = "Delete", e[e.Edit = 2] = "Edit", e;
}({});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/third_party/diff/diff_match_patch.js
(function() {
	function e() {
		this.Diff_Timeout = 1, this.Diff_EditCost = 4, this.Match_Threshold = .5, this.Match_Distance = 1e3, this.Patch_DeleteThreshold = .5, this.Patch_Margin = 4, this.Match_MaxBits = 32;
	}
	e.prototype.diff_main = function(e, t, n, r) {
		if (r === void 0 && (r = 0 >= this.Diff_Timeout ? Number.MAX_VALUE : (/* @__PURE__ */ new Date()).getTime() + 1e3 * this.Diff_Timeout), e == null || t == null) throw Error("Null input. (diff_main)");
		if (e == t) return e ? [[0, e]] : [];
		n === void 0 && (n = !0);
		var i = n, a = this.diff_commonPrefix(e, t);
		n = e.substring(0, a), e = e.substring(a), t = t.substring(a);
		var a = this.diff_commonSuffix(e, t), o = e.substring(e.length - a);
		return e = e.substring(0, e.length - a), t = t.substring(0, t.length - a), e = this.diff_compute_(e, t, i, r), n && e.unshift([0, n]), o && e.push([0, o]), this.diff_cleanupMerge(e), e;
	}, e.prototype.diff_compute_ = function(e, t, n, r) {
		if (!e) return [[1, t]];
		if (!t) return [[-1, e]];
		var i = e.length > t.length ? e : t, a = e.length > t.length ? t : e, o = i.indexOf(a);
		return o == -1 ? a.length == 1 ? [[-1, e], [1, t]] : (i = this.diff_halfMatch_(e, t)) ? (a = i[0], e = i[1], o = i[2], t = i[3], i = i[4], a = this.diff_main(a, o, n, r), n = this.diff_main(e, t, n, r), a.concat([[0, i]], n)) : n && 100 < e.length && 100 < t.length ? this.diff_lineMode_(e, t, r) : this.diff_bisect_(e, t, r) : (n = [
			[1, i.substring(0, o)],
			[0, a],
			[1, i.substring(o + a.length)]
		], e.length > t.length && (n[0][0] = n[2][0] = -1), n);
	}, e.prototype.diff_lineMode_ = function(e, t, n) {
		var r = this.diff_linesToChars_(e, t);
		e = r.chars1, t = r.chars2, r = r.lineArray, e = this.diff_main(e, t, !1, n), this.diff_charsToLines_(e, r), this.diff_cleanupSemantic(e), e.push([0, ""]);
		for (var i = r = t = 0, a = "", o = ""; t < e.length;) {
			switch (e[t][0]) {
				case 1:
					i++, o += e[t][1];
					break;
				case -1:
					r++, a += e[t][1];
					break;
				case 0:
					if (1 <= r && 1 <= i) {
						for (e.splice(t - r - i, r + i), t = t - r - i, r = this.diff_main(a, o, !1, n), i = r.length - 1; 0 <= i; i--) e.splice(t, 0, r[i]);
						t += r.length;
					}
					r = i = 0, o = a = "";
			}
			t++;
		}
		return e.pop(), e;
	}, e.prototype.diff_bisect_ = function(e, t, n) {
		for (var r = e.length, i = t.length, a = Math.ceil((r + i) / 2), o = a, s = 2 * a, c = Array(s), l = Array(s), u = 0; u < s; u++) c[u] = -1, l[u] = -1;
		c[o + 1] = 0, l[o + 1] = 0;
		for (var u = r - i, d = u % 2 != 0, f = 0, p = 0, m = 0, h = 0, g = 0; g < a && !((/* @__PURE__ */ new Date()).getTime() > n); g++) {
			for (var _ = -g + f; _ <= g - p; _ += 2) {
				for (var v = o + _, y = _ == -g || _ != g && c[v - 1] < c[v + 1] ? c[v + 1] : c[v - 1] + 1, b = y - _; y < r && b < i && e.charAt(y) == t.charAt(b);) y++, b++;
				if (c[v] = y, y > r) p += 2;
				else if (b > i) f += 2;
				else if (d && (v = o + u - _, 0 <= v && v < s && l[v] != -1)) {
					var x = r - l[v];
					if (y >= x) return this.diff_bisectSplit_(e, t, y, b, n);
				}
			}
			for (_ = -g + m; _ <= g - h; _ += 2) {
				for (v = o + _, x = _ == -g || _ != g && l[v - 1] < l[v + 1] ? l[v + 1] : l[v - 1] + 1, y = x - _; x < r && y < i && e.charAt(r - x - 1) == t.charAt(i - y - 1);) x++, y++;
				if (l[v] = x, x > r) h += 2;
				else if (y > i) m += 2;
				else if (!d && (v = o + u - _, 0 <= v && v < s && c[v] != -1 && (y = c[v], b = o + y - v, x = r - x, y >= x))) return this.diff_bisectSplit_(e, t, y, b, n);
			}
		}
		return [[-1, e], [1, t]];
	}, e.prototype.diff_bisectSplit_ = function(e, t, n, r, i) {
		var a = e.substring(0, n), o = t.substring(0, r);
		return e = e.substring(n), t = t.substring(r), a = this.diff_main(a, o, !1, i), i = this.diff_main(e, t, !1, i), a.concat(i);
	}, e.prototype.diff_linesToChars_ = function(e, t) {
		function n(e) {
			for (var t = "", n = 0, a = -1, o = r.length; a < e.length - 1;) {
				a = e.indexOf("\n", n), a == -1 && (a = e.length - 1);
				var s = e.substring(n, a + 1), n = a + 1;
				(i.hasOwnProperty ? i.hasOwnProperty(s) : i[s] !== void 0) ? t += String.fromCharCode(i[s]) : (t += String.fromCharCode(o), i[s] = o, r[o++] = s);
			}
			return t;
		}
		var r = [], i = {};
		return r[0] = "", {
			chars1: n(e),
			chars2: n(t),
			lineArray: r
		};
	}, e.prototype.diff_charsToLines_ = function(e, t) {
		for (var n = 0; n < e.length; n++) {
			for (var r = e[n][1], i = [], a = 0; a < r.length; a++) i[a] = t[r.charCodeAt(a)];
			e[n][1] = i.join("");
		}
	}, e.prototype.diff_commonPrefix = function(e, t) {
		if (!e || !t || e.charAt(0) != t.charAt(0)) return 0;
		for (var n = 0, r = Math.min(e.length, t.length), i = r, a = 0; n < i;) e.substring(a, i) == t.substring(a, i) ? a = n = i : r = i, i = Math.floor((r - n) / 2 + n);
		return i;
	}, e.prototype.diff_commonSuffix = function(e, t) {
		if (!e || !t || e.charAt(e.length - 1) != t.charAt(t.length - 1)) return 0;
		for (var n = 0, r = Math.min(e.length, t.length), i = r, a = 0; n < i;) e.substring(e.length - i, e.length - a) == t.substring(t.length - i, t.length - a) ? a = n = i : r = i, i = Math.floor((r - n) / 2 + n);
		return i;
	}, e.prototype.diff_commonOverlap_ = function(e, t) {
		var n = e.length, r = t.length;
		if (n == 0 || r == 0) return 0;
		if (n > r ? e = e.substring(n - r) : n < r && (t = t.substring(0, n)), n = Math.min(n, r), e == t) return n;
		for (var r = 0, i = 1;;) {
			var a = e.substring(n - i), a = t.indexOf(a);
			if (a == -1) return r;
			i += a, (a == 0 || e.substring(n - i) == t.substring(0, i)) && (r = i, i++);
		}
	}, e.prototype.diff_halfMatch_ = function(e, t) {
		function n(e, t, n) {
			for (var r = e.substring(n, n + Math.floor(e.length / 4)), i = -1, o = "", s, c, l, u; (i = t.indexOf(r, i + 1)) != -1;) {
				var d = a.diff_commonPrefix(e.substring(n), t.substring(i)), f = a.diff_commonSuffix(e.substring(0, n), t.substring(0, i));
				o.length < f + d && (o = t.substring(i - f, i) + t.substring(i, i + d), s = e.substring(0, n - f), c = e.substring(n + d), l = t.substring(0, i - f), u = t.substring(i + d));
			}
			return 2 * o.length >= e.length ? [
				s,
				c,
				l,
				u,
				o
			] : null;
		}
		if (0 >= this.Diff_Timeout) return null;
		var r = e.length > t.length ? e : t, i = e.length > t.length ? t : e;
		if (4 > r.length || 2 * i.length < r.length) return null;
		var a = this, o = n(r, i, Math.ceil(r.length / 4)), r = n(r, i, Math.ceil(r.length / 2)), s;
		if (!o && !r) return null;
		s = r ? o && o[4].length > r[4].length ? o : r : o;
		var c;
		return e.length > t.length ? (o = s[0], r = s[1], i = s[2], c = s[3]) : (i = s[0], c = s[1], o = s[2], r = s[3]), s = s[4], [
			o,
			r,
			i,
			c,
			s
		];
	}, e.prototype.diff_cleanupSemantic = function(e) {
		for (var t = !1, n = [], r = 0, i = null, a = 0, o = 0, s = 0, c = 0, l = 0; a < e.length;) e[a][0] == 0 ? (n[r++] = a, o = c, s = l, l = c = 0, i = e[a][1]) : (e[a][0] == 1 ? c += e[a][1].length : l += e[a][1].length, i && i.length <= Math.max(o, s) && i.length <= Math.max(c, l) && (e.splice(n[r - 1], 0, [-1, i]), e[n[r - 1] + 1][0] = 1, r--, r--, a = 0 < r ? n[r - 1] : -1, l = c = s = o = 0, i = null, t = !0)), a++;
		for (t && this.diff_cleanupMerge(e), this.diff_cleanupSemanticLossless(e), a = 1; a < e.length;) e[a - 1][0] == -1 && e[a][0] == 1 && (t = e[a - 1][1], n = e[a][1], r = this.diff_commonOverlap_(t, n), i = this.diff_commonOverlap_(n, t), r >= i ? (r >= t.length / 2 || r >= n.length / 2) && (e.splice(a, 0, [0, n.substring(0, r)]), e[a - 1][1] = t.substring(0, t.length - r), e[a + 1][1] = n.substring(r), a++) : (i >= t.length / 2 || i >= n.length / 2) && (e.splice(a, 0, [0, t.substring(0, i)]), e[a - 1][0] = 1, e[a - 1][1] = n.substring(0, n.length - i), e[a + 1][0] = -1, e[a + 1][1] = t.substring(i), a++), a++), a++;
	}, e.prototype.diff_cleanupSemanticLossless = function(t) {
		function n(t, n) {
			if (!t || !n) return 6;
			var r = t.charAt(t.length - 1), i = n.charAt(0), a = r.match(e.nonAlphaNumericRegex_), o = i.match(e.nonAlphaNumericRegex_), s = a && r.match(e.whitespaceRegex_), c = o && i.match(e.whitespaceRegex_), r = s && r.match(e.linebreakRegex_), i = c && i.match(e.linebreakRegex_), l = r && t.match(e.blanklineEndRegex_), u = i && n.match(e.blanklineStartRegex_);
			return l || u ? 5 : r || i ? 4 : a && !s && c ? 3 : s || c ? 2 : a || o ? 1 : 0;
		}
		for (var r = 1; r < t.length - 1;) {
			if (t[r - 1][0] == 0 && t[r + 1][0] == 0) {
				var i = t[r - 1][1], a = t[r][1], o = t[r + 1][1], s = this.diff_commonSuffix(i, a);
				if (s) var c = a.substring(a.length - s), i = i.substring(0, i.length - s), a = c + a.substring(0, a.length - s), o = c + o;
				for (var s = i, c = a, l = o, u = n(i, a) + n(a, o); a.charAt(0) === o.charAt(0);) {
					var i = i + a.charAt(0), a = a.substring(1) + o.charAt(0), o = o.substring(1), d = n(i, a) + n(a, o);
					d >= u && (u = d, s = i, c = a, l = o);
				}
				t[r - 1][1] != s && (s ? t[r - 1][1] = s : (t.splice(r - 1, 1), r--), t[r][1] = c, l ? t[r + 1][1] = l : (t.splice(r + 1, 1), r--));
			}
			r++;
		}
	}, e.nonAlphaNumericRegex_ = /[^a-zA-Z0-9]/, e.whitespaceRegex_ = /\s/, e.linebreakRegex_ = /[\r\n]/, e.blanklineEndRegex_ = /\n\r?\n$/, e.blanklineStartRegex_ = /^\r?\n\r?\n/, e.prototype.diff_cleanupEfficiency = function(e) {
		for (var t = !1, n = [], r = 0, i = null, a = 0, o = !1, s = !1, c = !1, l = !1; a < e.length;) e[a][0] == 0 ? (e[a][1].length < this.Diff_EditCost && (c || l) ? (n[r++] = a, o = c, s = l, i = e[a][1]) : (r = 0, i = null), c = l = !1) : (e[a][0] == -1 ? l = !0 : c = !0, i && (o && s && c && l || i.length < this.Diff_EditCost / 2 && o + s + c + l == 3) && (e.splice(n[r - 1], 0, [-1, i]), e[n[r - 1] + 1][0] = 1, r--, i = null, o && s ? (c = l = !0, r = 0) : (r--, a = 0 < r ? n[r - 1] : -1, c = l = !1), t = !0)), a++;
		t && this.diff_cleanupMerge(e);
	}, e.prototype.diff_cleanupMerge = function(e) {
		e.push([0, ""]);
		for (var t = 0, n = 0, r = 0, i = "", a = "", o; t < e.length;) switch (e[t][0]) {
			case 1:
				r++, a += e[t][1], t++;
				break;
			case -1:
				n++, i += e[t][1], t++;
				break;
			case 0: 1 < n + r ? (n !== 0 && r !== 0 && (o = this.diff_commonPrefix(a, i), o !== 0 && (0 < t - n - r && e[t - n - r - 1][0] == 0 ? e[t - n - r - 1][1] += a.substring(0, o) : (e.splice(0, 0, [0, a.substring(0, o)]), t++), a = a.substring(o), i = i.substring(o)), o = this.diff_commonSuffix(a, i), o !== 0 && (e[t][1] = a.substring(a.length - o) + e[t][1], a = a.substring(0, a.length - o), i = i.substring(0, i.length - o))), n === 0 ? e.splice(t - r, n + r, [1, a]) : r === 0 ? e.splice(t - n, n + r, [-1, i]) : e.splice(t - n - r, n + r, [-1, i], [1, a]), t = t - n - r + +!!n + +!!r + 1) : t !== 0 && e[t - 1][0] == 0 ? (e[t - 1][1] += e[t][1], e.splice(t, 1)) : t++, n = r = 0, a = i = "";
		}
		for (e[e.length - 1][1] === "" && e.pop(), n = !1, t = 1; t < e.length - 1;) e[t - 1][0] == 0 && e[t + 1][0] == 0 && (e[t][1].substring(e[t][1].length - e[t - 1][1].length) == e[t - 1][1] ? (e[t][1] = e[t - 1][1] + e[t][1].substring(0, e[t][1].length - e[t - 1][1].length), e[t + 1][1] = e[t - 1][1] + e[t + 1][1], e.splice(t - 1, 1), n = !0) : e[t][1].substring(0, e[t + 1][1].length) == e[t + 1][1] && (e[t - 1][1] += e[t + 1][1], e[t][1] = e[t][1].substring(e[t + 1][1].length) + e[t + 1][1], e.splice(t + 1, 1), n = !0)), t++;
		n && this.diff_cleanupMerge(e);
	}, e.prototype.diff_xIndex = function(e, t) {
		for (var n = 0, r = 0, i = 0, a = 0, o = 0; o < e.length && (e[o][0] !== 1 && (n += e[o][1].length), e[o][0] !== -1 && (r += e[o][1].length), !(n > t)); o++) i = n, a = r;
		return e.length != o && e[o][0] === -1 ? a : a + (t - i);
	}, e.prototype.diff_prettyHtml = function(e) {
		for (var t = [], n = /&/g, r = /</g, i = />/g, a = /\n/g, o = 0; o < e.length; o++) {
			var s = e[o][0], c = e[o][1], c = c.replace(n, "&amp;").replace(r, "&lt;").replace(i, "&gt;").replace(a, "&para;<br>");
			switch (s) {
				case 1:
					t[o] = "<ins style=\"background:#e6ffe6;\">" + c + "</ins>";
					break;
				case -1:
					t[o] = "<del style=\"background:#ffe6e6;\">" + c + "</del>";
					break;
				case 0: t[o] = "<span>" + c + "</span>";
			}
		}
		return t.join("");
	}, e.prototype.diff_text1 = function(e) {
		for (var t = [], n = 0; n < e.length; n++) e[n][0] !== 1 && (t[n] = e[n][1]);
		return t.join("");
	}, e.prototype.diff_text2 = function(e) {
		for (var t = [], n = 0; n < e.length; n++) e[n][0] !== -1 && (t[n] = e[n][1]);
		return t.join("");
	}, e.prototype.diff_levenshtein = function(e) {
		for (var t = 0, n = 0, r = 0, i = 0; i < e.length; i++) {
			var a = e[i][0], o = e[i][1];
			switch (a) {
				case 1:
					n += o.length;
					break;
				case -1:
					r += o.length;
					break;
				case 0: t += Math.max(n, r), r = n = 0;
			}
		}
		return t += Math.max(n, r);
	}, e.prototype.diff_toDelta = function(e) {
		for (var t = [], n = 0; n < e.length; n++) switch (e[n][0]) {
			case 1:
				t[n] = "+" + encodeURI(e[n][1]);
				break;
			case -1:
				t[n] = "-" + e[n][1].length;
				break;
			case 0: t[n] = "=" + e[n][1].length;
		}
		return t.join("	").replace(/%20/g, " ");
	}, e.prototype.diff_fromDelta = function(e, t) {
		for (var n = [], r = 0, i = 0, a = t.split(/\t/g), o = 0; o < a.length; o++) {
			var s = a[o].substring(1);
			switch (a[o].charAt(0)) {
				case "+":
					try {
						n[r++] = [1, decodeURI(s)];
					} catch {
						throw Error("Illegal escape in diff_fromDelta: " + s);
					}
					break;
				case "-":
				case "=":
					var c = parseInt(s, 10);
					if (isNaN(c) || 0 > c) throw Error("Invalid number in diff_fromDelta: " + s);
					s = e.substring(i, i += c), a[o].charAt(0) == "=" ? n[r++] = [0, s] : n[r++] = [-1, s];
					break;
				default: if (a[o]) throw Error("Invalid diff operation in diff_fromDelta: " + a[o]);
			}
		}
		if (i != e.length) throw Error("Delta length (" + i + ") does not equal source text length (" + e.length + ").");
		return n;
	}, e.prototype.match_main = function(e, t, n) {
		if (e == null || t == null || n == null) throw Error("Null input. (match_main)");
		return n = Math.max(0, Math.min(n, e.length)), e == t ? 0 : e.length ? e.substring(n, n + t.length) == t ? n : this.match_bitap_(e, t, n) : -1;
	}, e.prototype.match_bitap_ = function(e, t, n) {
		function r(e, r) {
			var i = e / t.length, o = Math.abs(n - r);
			return a.Match_Distance ? i + o / a.Match_Distance : o ? 1 : i;
		}
		if (t.length > this.Match_MaxBits) throw Error("Pattern too long for this browser.");
		var i = this.match_alphabet_(t), a = this, o = this.Match_Threshold, s = e.indexOf(t, n);
		s != -1 && (o = Math.min(r(0, s), o), s = e.lastIndexOf(t, n + t.length), s != -1 && (o = Math.min(r(0, s), o)));
		for (var c = 1 << t.length - 1, s = -1, l, u, d = t.length + e.length, f, p = 0; p < t.length; p++) {
			for (l = 0, u = d; l < u;) r(p, n + u) <= o ? l = u : d = u, u = Math.floor((d - l) / 2 + l);
			d = u, l = Math.max(1, n - u + 1);
			var m = Math.min(n + u, e.length) + t.length;
			for (u = Array(m + 2), u[m + 1] = (1 << p) - 1; m >= l; m--) {
				var h = i[e.charAt(m - 1)];
				if (u[m] = p === 0 ? (u[m + 1] << 1 | 1) & h : (u[m + 1] << 1 | 1) & h | (f[m + 1] | f[m]) << 1 | 1 | f[m + 1], u[m] & c && (h = r(p, m - 1), h <= o)) {
					if (o = h, s = m - 1, s > n) l = Math.max(1, 2 * n - s);
					else break;
				}
			}
			if (r(p + 1, n) > o) break;
			f = u;
		}
		return s;
	}, e.prototype.match_alphabet_ = function(e) {
		for (var t = {}, n = 0; n < e.length; n++) t[e.charAt(n)] = 0;
		for (n = 0; n < e.length; n++) t[e.charAt(n)] |= 1 << e.length - n - 1;
		return t;
	}, e.prototype.patch_addContext_ = function(e, t) {
		if (t.length != 0) {
			for (var n = t.substring(e.start2, e.start2 + e.length1), r = 0; t.indexOf(n) != t.lastIndexOf(n) && n.length < this.Match_MaxBits - this.Patch_Margin - this.Patch_Margin;) r += this.Patch_Margin, n = t.substring(e.start2 - r, e.start2 + e.length1 + r);
			r += this.Patch_Margin, (n = t.substring(e.start2 - r, e.start2)) && e.diffs.unshift([0, n]), (r = t.substring(e.start2 + e.length1, e.start2 + e.length1 + r)) && e.diffs.push([0, r]), e.start1 -= n.length, e.start2 -= n.length, e.length1 += n.length + r.length, e.length2 += n.length + r.length;
		}
	}, e.prototype.patch_make = function(t, n, r) {
		var i;
		if (typeof t == "string" && typeof n == "string" && r === void 0) i = t, n = this.diff_main(i, n, !0), 2 < n.length && (this.diff_cleanupSemantic(n), this.diff_cleanupEfficiency(n));
		else if (t && typeof t == "object" && n === void 0 && r === void 0) n = t, i = this.diff_text1(n);
		else if (typeof t == "string" && n && typeof n == "object" && r === void 0) i = t;
		else if (typeof t == "string" && typeof n == "string" && r && typeof r == "object") i = t, n = r;
		else throw Error("Unknown call format to patch_make.");
		if (n.length === 0) return [];
		r = [], t = new e.patch_obj();
		for (var a = 0, o = 0, s = 0, c = i, l = 0; l < n.length; l++) {
			var u = n[l][0], d = n[l][1];
			switch (!a && u !== 0 && (t.start1 = o, t.start2 = s), u) {
				case 1:
					t.diffs[a++] = n[l], t.length2 += d.length, i = i.substring(0, s) + d + i.substring(s);
					break;
				case -1:
					t.length1 += d.length, t.diffs[a++] = n[l], i = i.substring(0, s) + i.substring(s + d.length);
					break;
				case 0: d.length <= 2 * this.Patch_Margin && a && n.length != l + 1 ? (t.diffs[a++] = n[l], t.length1 += d.length, t.length2 += d.length) : d.length >= 2 * this.Patch_Margin && a && (this.patch_addContext_(t, c), r.push(t), t = new e.patch_obj(), a = 0, c = i, o = s);
			}
			u !== 1 && (o += d.length), u !== -1 && (s += d.length);
		}
		return a && (this.patch_addContext_(t, c), r.push(t)), r;
	}, e.prototype.patch_deepCopy = function(t) {
		for (var n = [], r = 0; r < t.length; r++) {
			var i = t[r], a = new e.patch_obj();
			a.diffs = [];
			for (var o = 0; o < i.diffs.length; o++) a.diffs[o] = i.diffs[o].slice();
			a.start1 = i.start1, a.start2 = i.start2, a.length1 = i.length1, a.length2 = i.length2, n[r] = a;
		}
		return n;
	}, e.prototype.patch_apply = function(e, t) {
		if (e.length == 0) return [t, []];
		e = this.patch_deepCopy(e);
		var n = this.patch_addPadding(e);
		t = n + t + n, this.patch_splitMax(e);
		for (var r = 0, i = [], a = 0; a < e.length; a++) {
			var o = e[a].start2 + r, s = this.diff_text1(e[a].diffs), c, l = -1;
			if (s.length > this.Match_MaxBits ? (c = this.match_main(t, s.substring(0, this.Match_MaxBits), o), c != -1 && (l = this.match_main(t, s.substring(s.length - this.Match_MaxBits), o + s.length - this.Match_MaxBits), l == -1 || c >= l) && (c = -1)) : c = this.match_main(t, s, o), c == -1) i[a] = !1, r -= e[a].length2 - e[a].length1;
			else if (i[a] = !0, r = c - o, o = l == -1 ? t.substring(c, c + s.length) : t.substring(c, l + this.Match_MaxBits), s == o) t = t.substring(0, c) + this.diff_text2(e[a].diffs) + t.substring(c + s.length);
			else if (o = this.diff_main(s, o, !1), s.length > this.Match_MaxBits && this.diff_levenshtein(o) / s.length > this.Patch_DeleteThreshold) i[a] = !1;
			else {
				this.diff_cleanupSemanticLossless(o);
				for (var s = 0, u, l = 0; l < e[a].diffs.length; l++) {
					var d = e[a].diffs[l];
					d[0] !== 0 && (u = this.diff_xIndex(o, s)), d[0] === 1 ? t = t.substring(0, c + u) + d[1] + t.substring(c + u) : d[0] === -1 && (t = t.substring(0, c + u) + t.substring(c + this.diff_xIndex(o, s + d[1].length))), d[0] !== -1 && (s += d[1].length);
				}
			}
		}
		return t = t.substring(n.length, t.length - n.length), [t, i];
	}, e.prototype.patch_addPadding = function(e) {
		for (var t = this.Patch_Margin, n = "", r = 1; r <= t; r++) n += String.fromCharCode(r);
		for (r = 0; r < e.length; r++) e[r].start1 += t, e[r].start2 += t;
		var r = e[0], i = r.diffs;
		if (i.length == 0 || i[0][0] != 0) i.unshift([0, n]), r.start1 -= t, r.start2 -= t, r.length1 += t, r.length2 += t;
		else if (t > i[0][1].length) {
			var a = t - i[0][1].length;
			i[0][1] = n.substring(i[0][1].length) + i[0][1], r.start1 -= a, r.start2 -= a, r.length1 += a, r.length2 += a;
		}
		return r = e[e.length - 1], i = r.diffs, i.length == 0 || i[i.length - 1][0] != 0 ? (i.push([0, n]), r.length1 += t, r.length2 += t) : t > i[i.length - 1][1].length && (a = t - i[i.length - 1][1].length, i[i.length - 1][1] += n.substring(0, a), r.length1 += a, r.length2 += a), n;
	}, e.prototype.patch_splitMax = function(t) {
		for (var n = this.Match_MaxBits, r = 0; r < t.length; r++) if (!(t[r].length1 <= n)) {
			var i = t[r];
			t.splice(r--, 1);
			for (var a = i.start1, o = i.start2, s = ""; i.diffs.length !== 0;) {
				var c = new e.patch_obj(), l = !0;
				for (c.start1 = a - s.length, c.start2 = o - s.length, s !== "" && (c.length1 = c.length2 = s.length, c.diffs.push([0, s])); i.diffs.length !== 0 && c.length1 < n - this.Patch_Margin;) {
					var s = i.diffs[0][0], u = i.diffs[0][1];
					s === 1 ? (c.length2 += u.length, o += u.length, c.diffs.push(i.diffs.shift()), l = !1) : s === -1 && c.diffs.length == 1 && c.diffs[0][0] == 0 && u.length > 2 * n ? (c.length1 += u.length, a += u.length, l = !1, c.diffs.push([s, u]), i.diffs.shift()) : (u = u.substring(0, n - c.length1 - this.Patch_Margin), c.length1 += u.length, a += u.length, s === 0 ? (c.length2 += u.length, o += u.length) : l = !1, c.diffs.push([s, u]), u == i.diffs[0][1] ? i.diffs.shift() : i.diffs[0][1] = i.diffs[0][1].substring(u.length));
				}
				s = this.diff_text2(c.diffs), s = s.substring(s.length - this.Patch_Margin), u = this.diff_text1(i.diffs).substring(0, this.Patch_Margin), u !== "" && (c.length1 += u.length, c.length2 += u.length, c.diffs.length !== 0 && c.diffs[c.diffs.length - 1][0] === 0 ? c.diffs[c.diffs.length - 1][1] += u : c.diffs.push([0, u])), l || t.splice(++r, 0, c);
			}
		}
	}, e.prototype.patch_toText = function(e) {
		for (var t = [], n = 0; n < e.length; n++) t[n] = e[n];
		return t.join("");
	}, e.prototype.patch_fromText = function(t) {
		var n = [];
		if (!t) return n;
		t = t.split("\n");
		for (var r = 0, i = /^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@$/; r < t.length;) {
			var a = t[r].match(i);
			if (!a) throw Error("Invalid patch string: " + t[r]);
			var o = new e.patch_obj();
			for (n.push(o), o.start1 = parseInt(a[1], 10), a[2] === "" ? (o.start1--, o.length1 = 1) : a[2] == "0" ? o.length1 = 0 : (o.start1--, o.length1 = parseInt(a[2], 10)), o.start2 = parseInt(a[3], 10), a[4] === "" ? (o.start2--, o.length2 = 1) : a[4] == "0" ? o.length2 = 0 : (o.start2--, o.length2 = parseInt(a[4], 10)), r++; r < t.length;) {
				a = t[r].charAt(0);
				try {
					var s = decodeURI(t[r].substring(1));
				} catch {
					throw Error("Illegal escape in patch_fromText: " + s);
				}
				if (a == "-") o.diffs.push([-1, s]);
				else if (a == "+") o.diffs.push([1, s]);
				else if (a == " ") o.diffs.push([0, s]);
				else if (a == "@") break;
				else if (a !== "") throw Error("Invalid patch mode \"" + a + "\" in: " + s);
				r++;
			}
		}
		return n;
	}, e.patch_obj = function() {
		this.diffs = [], this.start2 = this.start1 = null, this.length2 = this.length1 = 0;
	}, e.patch_obj.prototype.toString = function() {
		var e = this.length1 === 0 ? this.start1 + ",0" : this.length1 == 1 ? this.start1 + 1 : this.start1 + 1 + "," + this.length1, t = this.length2 === 0 ? this.start2 + ",0" : this.length2 == 1 ? this.start2 + 1 : this.start2 + 1 + "," + this.length2;
		e = ["@@ -" + e + " +" + t + " @@\n"];
		var n;
		for (t = 0; t < this.diffs.length; t++) {
			switch (this.diffs[t][0]) {
				case 1:
					n = "+";
					break;
				case -1:
					n = "-";
					break;
				case 0: n = " ";
			}
			e[t + 1] = n + encodeURI(this.diffs[t][1]) + "\n";
		}
		return e.join("").replace(/%20/g, " ");
	}, globalThis.diff_match_patch = e, globalThis.DIFF_DELETE = -1, globalThis.DIFF_INSERT = 1, globalThis.DIFF_EQUAL = 0;
})();
//#endregion
export { n, t };
