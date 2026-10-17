import { Wt as e, qt as t } from "../../chunks/common-DMSVbaSb.js";
import { o as n } from "../../chunks/root-DdvV-xPu.js";
import { t as r } from "../../chunks/platform-D4TUCh2P.js";
import { x as i } from "../../chunks/text_utils-DWSliayn.js";
import { m as a, y as o } from "../../chunks/StringUtilities-CMDxNrEc.js";
import { a as s, i as c, o as l, r as u, t as d } from "../../chunks/FormatterActions-D6HaA-6R.js";
import { n as f, t as p } from "../../chunks/acorn-yx0Qbj0X.js";
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/third_party/codemirror/package/mode/javascript/javascript.mjs
(function() {
	function e(e, t, n) {
		for (var r in t ||= {}, e) e.hasOwnProperty(r) && (n !== !1 || !t.hasOwnProperty(r)) && (t[r] = e[r]);
		return t;
	}
	function t(e, t, n, r, i) {
		t ?? (t = e.search(/[^\s\u00a0]/), t == -1 && (t = e.length));
		for (var a = r || 0, o = i || 0;;) {
			var s = e.indexOf("	", a);
			if (s < 0 || s >= t) return o + (t - a);
			o += s - a, o += n - o % n, a = s + 1;
		}
	}
	function n() {}
	function r(t, r) {
		var i;
		return Object.create ? i = Object.create(t) : (n.prototype = t, i = new n()), r && e(r, i), i;
	}
	var i = function(e, t, n) {
		this.pos = this.start = 0, this.string = e, this.tabSize = t || 8, this.lastColumnPos = this.lastColumnValue = 0, this.lineStart = 0, this.lineOracle = n;
	};
	i.prototype.eol = function() {
		return this.pos >= this.string.length;
	}, i.prototype.sol = function() {
		return this.pos == this.lineStart;
	}, i.prototype.peek = function() {
		return this.string.charAt(this.pos) || void 0;
	}, i.prototype.next = function() {
		if (this.pos < this.string.length) return this.string.charAt(this.pos++);
	}, i.prototype.eat = function(e) {
		var t = this.string.charAt(this.pos);
		if (typeof e == "string" ? t == e : t && (e.test ? e.test(t) : e(t))) return ++this.pos, t;
	}, i.prototype.eatWhile = function(e) {
		for (var t = this.pos; this.eat(e););
		return this.pos > t;
	}, i.prototype.eatSpace = function() {
		for (var e = this.pos; /[\s\u00a0]/.test(this.string.charAt(this.pos));) ++this.pos;
		return this.pos > e;
	}, i.prototype.skipToEnd = function() {
		this.pos = this.string.length;
	}, i.prototype.skipTo = function(e) {
		var t = this.string.indexOf(e, this.pos);
		if (t > -1) return this.pos = t, !0;
	}, i.prototype.backUp = function(e) {
		this.pos -= e;
	}, i.prototype.column = function() {
		return this.lastColumnPos < this.start && (this.lastColumnValue = t(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue), this.lastColumnPos = this.start), this.lastColumnValue - (this.lineStart ? t(this.string, this.lineStart, this.tabSize) : 0);
	}, i.prototype.indentation = function() {
		return t(this.string, null, this.tabSize) - (this.lineStart ? t(this.string, this.lineStart, this.tabSize) : 0);
	}, i.prototype.match = function(e, t, n) {
		if (typeof e == "string") {
			var r = function(e) {
				return n ? e.toLowerCase() : e;
			};
			if (r(this.string.substr(this.pos, e.length)) == r(e)) return t !== !1 && (this.pos += e.length), !0;
		} else {
			var i = this.string.slice(this.pos).match(e);
			return i && i.index > 0 ? null : (i && t !== !1 && (this.pos += i[0].length), i);
		}
	}, i.prototype.current = function() {
		return this.string.slice(this.start, this.pos);
	}, i.prototype.hideFirstChars = function(e, t) {
		this.lineStart += e;
		try {
			return t();
		} finally {
			this.lineStart -= e;
		}
	}, i.prototype.lookAhead = function(e) {
		var t = this.lineOracle;
		return t && t.lookAhead(e);
	}, i.prototype.baseToken = function() {
		var e = this.lineOracle;
		return e && e.baseToken(this.pos);
	};
	var a = {}, o = {};
	function s(e, t) {
		arguments.length > 2 && (t.dependencies = Array.prototype.slice.call(arguments, 2)), a[e] = t;
	}
	function c(e, t) {
		o[e] = t;
	}
	function l(e) {
		if (typeof e == "string" && o.hasOwnProperty(e)) e = o[e];
		else if (e && typeof e.name == "string" && o.hasOwnProperty(e.name)) {
			var t = o[e.name];
			typeof t == "string" && (t = { name: t }), e = r(t, e), e.name = t.name;
		} else if (typeof e == "string" && /^[\w\-]+\/[\w\-]+\+xml$/.test(e)) return l("application/xml");
		else if (typeof e == "string" && /^[\w\-]+\/[\w\-]+\+json$/.test(e)) return l("application/json");
		return typeof e == "string" ? { name: e } : e || { name: "null" };
	}
	function u(e, t) {
		t = l(t);
		var n = a[t.name];
		if (!n) return u(e, "text/plain");
		var r = n(e, t);
		if (d.hasOwnProperty(t.name)) {
			var i = d[t.name];
			for (var o in i) i.hasOwnProperty(o) && (r.hasOwnProperty(o) && (r["_" + o] = r[o]), r[o] = i[o]);
		}
		if (r.name = t.name, t.helperType && (r.helperType = t.helperType), t.modeProps) for (var s in t.modeProps) r[s] = t.modeProps[s];
		return r;
	}
	var d = {};
	function f(t, n) {
		e(n, d.hasOwnProperty(t) ? d[t] : d[t] = {});
	}
	function p(e, t) {
		if (t === !0) return t;
		if (e.copyState) return e.copyState(t);
		var n = {};
		for (var r in t) {
			var i = t[r];
			i instanceof Array && (i = i.concat([])), n[r] = i;
		}
		return n;
	}
	function m(e, t) {
		for (var n; e.innerMode && (n = e.innerMode(t), n && n.mode != e);) t = n.state, e = n.mode;
		return n || {
			mode: e,
			state: t
		};
	}
	function h(e, t, n) {
		return !e.startState || e.startState(t, n);
	}
	var g = {
		__proto__: null,
		modes: a,
		mimeModes: o,
		defineMode: s,
		defineMIME: c,
		resolveMode: l,
		getMode: u,
		modeExtensions: d,
		extendMode: f,
		copyState: p,
		innerMode: m,
		startState: h
	}, _ = typeof globalThis < "u" ? globalThis : window;
	for (var v in _.CodeMirror = {}, CodeMirror.StringStream = i, g) CodeMirror[v] = g[v];
	CodeMirror.defineMode("null", function() {
		return { token: function(e) {
			return e.skipToEnd();
		} };
	}), CodeMirror.defineMIME("text/plain", "null"), CodeMirror.registerHelper = CodeMirror.registerGlobalHelper = Math.min, CodeMirror.splitLines = function(e) {
		return e.split(/\r?\n|\r/);
	}, CodeMirror.countColumn = t, CodeMirror.defaults = { indentUnit: 2 }, (function(e) {
		typeof define == "function" && define.amd ? define(["../../lib/codemirror"], e) : e(CodeMirror);
	})(function(e) {
		e.runMode = function(t, n, r, i) {
			var a = e.getMode(e.defaults, n), o = i && i.tabSize || e.defaults.tabSize;
			if (r.appendChild) {
				var s = /MSIE \d/.test(navigator.userAgent) && (document.documentMode == null || document.documentMode < 9), c = r, l = 0;
				c.innerHTML = "", r = function(e, t) {
					if (e == "\n") {
						c.appendChild(document.createTextNode(s ? "\r" : e)), l = 0;
						return;
					}
					for (var n = "", r = 0;;) {
						var i = e.indexOf("	", r);
						if (i == -1) {
							n += e.slice(r), l += e.length - r;
							break;
						}
						l += i - r, n += e.slice(r, i);
						var a = o - l % o;
						l += a;
						for (var u = 0; u < a; ++u) n += " ";
						r = i + 1;
					}
					if (t) {
						var d = c.appendChild(document.createElement("span"));
						d.className = "cm-" + t.replace(/ +/g, " cm-"), d.appendChild(document.createTextNode(n));
					} else c.appendChild(document.createTextNode(n));
				};
			}
			for (var u = e.splitLines(t), d = i && i.state || e.startState(a), f = 0, p = u.length; f < p; ++f) {
				f && r("\n");
				var m = new e.StringStream(u[f], null, {
					lookAhead: function(e) {
						return u[f + e];
					},
					baseToken: function() {}
				});
				for (!m.string && a.blankLine && a.blankLine(d); !m.eol();) {
					var h = a.token(m, d);
					r(m.current(), h, f, m.start, d, a), m.start = m.pos;
				}
			}
		};
	});
})(), (function(e) {
	typeof define == "function" && define.amd ? define(["../../lib/codemirror"], e) : e(CodeMirror);
})(function(e) {
	e.defineMode("css", function(t, n) {
		var r = n.inline;
		n.propertyKeywords || (n = e.resolveMode("text/css"));
		var i = t.indentUnit, a = n.tokenHooks, o = n.documentTypes || {}, s = n.mediaTypes || {}, c = n.mediaFeatures || {}, l = n.mediaValueKeywords || {}, u = n.propertyKeywords || {}, d = n.nonStandardPropertyKeywords || {}, f = n.fontProperties || {}, p = n.counterDescriptors || {}, m = n.colorKeywords || {}, h = n.valueKeywords || {}, g = n.allowNested, _ = n.lineComment, v = n.supportsAtComponent === !0, y = t.highlightNonStandardPropertyKeywords !== !1, b, x;
		function S(e, t) {
			return b = t, e;
		}
		function ee(e, t) {
			var n = e.next();
			if (a[n]) {
				var r = a[n](e, t);
				if (r !== !1) return r;
			}
			if (n == "@") return e.eatWhile(/[\w\\\-]/), S("def", e.current());
			if (n == "=" || (n == "~" || n == "|") && e.eat("=")) return S(null, "compare");
			if (n == "\"" || n == "'") return t.tokenize = C(n), t.tokenize(e, t);
			if (n == "#") return e.eatWhile(/[\w\\\-]/), S("atom", "hash");
			if (n == "!") return e.match(/^\s*\w*/), S("keyword", "important");
			if (/\d/.test(n) || n == "." && e.eat(/\d/)) return e.eatWhile(/[\w.%]/), S("number", "unit");
			if (n === "-") {
				if (/[\d.]/.test(e.peek())) return e.eatWhile(/[\w.%]/), S("number", "unit");
				if (e.match(/^-[\w\\\-]*/)) return e.eatWhile(/[\w\\\-]/), e.match(/^\s*:/, !1) ? S("variable-2", "variable-definition") : S("variable-2", "variable");
				if (e.match(/^\w+-/)) return S("meta", "meta");
			} else if (/[,+>*\/]/.test(n)) return S(null, "select-op");
			else if (n == "." && e.match(/^-?[_a-z][_a-z0-9-]*/i)) return S("qualifier", "qualifier");
			else if (/[:;{}\[\]\(\)]/.test(n)) return S(null, n);
			else if (e.match(/^[\w-.]+(?=\()/)) return /^(url(-prefix)?|domain|regexp)$/i.test(e.current()) && (t.tokenize = te), S("variable callee", "variable");
			else if (/[\w\\\-]/.test(n)) return e.eatWhile(/[\w\\\-]/), S("property", "word");
			else return S(null, null);
		}
		function C(e) {
			return function(t, n) {
				for (var r = !1, i; (i = t.next()) != null;) {
					if (i == e && !r) {
						e == ")" && t.backUp(1);
						break;
					}
					r = !r && i == "\\";
				}
				return (i == e || !r && e != ")") && (n.tokenize = null), S("string", "string");
			};
		}
		function te(e, t) {
			return e.next(), t.tokenize = e.match(/^\s*[\"\')]/, !1) ? null : C(")"), S(null, "(");
		}
		function w(e, t, n) {
			this.type = e, this.indent = t, this.prev = n;
		}
		function T(e, t, n, r) {
			return e.context = new w(n, t.indentation() + (r === !1 ? 0 : i), e.context), n;
		}
		function E(e) {
			return e.context.prev && (e.context = e.context.prev), e.context.type;
		}
		function D(e, t, n) {
			return A[n.context.type](e, t, n);
		}
		function O(e, t, n, r) {
			for (var i = r || 1; i > 0; i--) n.context = n.context.prev;
			return D(e, t, n);
		}
		function k(e) {
			var t = e.current().toLowerCase();
			x = h.hasOwnProperty(t) ? "atom" : m.hasOwnProperty(t) ? "keyword" : "variable";
		}
		var A = {};
		return A.top = function(e, t, n) {
			if (e == "{") return T(n, t, "block");
			if (e == "}" && n.context.prev) return E(n);
			if (v && /@component/i.test(e)) return T(n, t, "atComponentBlock");
			if (/^@(-moz-)?document$/i.test(e)) return T(n, t, "documentTypes");
			if (/^@(media|supports|(-moz-)?document|import)$/i.test(e)) return T(n, t, "atBlock");
			if (/^@(font-face|counter-style)/i.test(e)) return n.stateArg = e, "restricted_atBlock_before";
			if (/^@(-(moz|ms|o|webkit)-)?keyframes$/i.test(e)) return "keyframes";
			if (e && e.charAt(0) == "@") return T(n, t, "at");
			if (e == "hash") x = "builtin";
			else if (e == "word") x = "tag";
			else if (e == "variable-definition") return "maybeprop";
			else if (e == "interpolation") return T(n, t, "interpolation");
			else if (e == ":") return "pseudo";
			else if (g && e == "(") return T(n, t, "parens");
			return n.context.type;
		}, A.block = function(e, t, n) {
			if (e == "word") {
				var r = t.current().toLowerCase();
				return u.hasOwnProperty(r) ? (x = "property", "maybeprop") : d.hasOwnProperty(r) ? (x = y ? "string-2" : "property", "maybeprop") : g ? (x = t.match(/^\s*:(?:\s|$)/, !1) ? "property" : "tag", "block") : (x += " error", "maybeprop");
			}
			return e == "meta" ? "block" : !g && (e == "hash" || e == "qualifier") ? (x = "error", "block") : A.top(e, t, n);
		}, A.maybeprop = function(e, t, n) {
			return e == ":" ? T(n, t, "prop") : D(e, t, n);
		}, A.prop = function(e, t, n) {
			if (e == ";") return E(n);
			if (e == "{" && g) return T(n, t, "propBlock");
			if (e == "}" || e == "{") return O(e, t, n);
			if (e == "(") return T(n, t, "parens");
			if (e == "hash" && !/^#([0-9a-fA-f]{3,4}|[0-9a-fA-f]{6}|[0-9a-fA-f]{8})$/.test(t.current())) x += " error";
			else if (e == "word") k(t);
			else if (e == "interpolation") return T(n, t, "interpolation");
			return "prop";
		}, A.propBlock = function(e, t, n) {
			return e == "}" ? E(n) : e == "word" ? (x = "property", "maybeprop") : n.context.type;
		}, A.parens = function(e, t, n) {
			return e == "{" || e == "}" ? O(e, t, n) : e == ")" ? E(n) : e == "(" ? T(n, t, "parens") : e == "interpolation" ? T(n, t, "interpolation") : (e == "word" && k(t), "parens");
		}, A.pseudo = function(e, t, n) {
			return e == "meta" ? "pseudo" : e == "word" ? (x = "variable-3", n.context.type) : D(e, t, n);
		}, A.documentTypes = function(e, t, n) {
			return e == "word" && o.hasOwnProperty(t.current()) ? (x = "tag", n.context.type) : A.atBlock(e, t, n);
		}, A.atBlock = function(e, t, n) {
			if (e == "(") return T(n, t, "atBlock_parens");
			if (e == "}" || e == ";") return O(e, t, n);
			if (e == "{") return E(n) && T(n, t, g ? "block" : "top");
			if (e == "interpolation") return T(n, t, "interpolation");
			if (e == "word") {
				var r = t.current().toLowerCase();
				x = r == "only" || r == "not" || r == "and" || r == "or" ? "keyword" : s.hasOwnProperty(r) ? "attribute" : c.hasOwnProperty(r) ? "property" : l.hasOwnProperty(r) ? "keyword" : u.hasOwnProperty(r) ? "property" : d.hasOwnProperty(r) ? y ? "string-2" : "property" : h.hasOwnProperty(r) ? "atom" : m.hasOwnProperty(r) ? "keyword" : "error";
			}
			return n.context.type;
		}, A.atComponentBlock = function(e, t, n) {
			return e == "}" ? O(e, t, n) : e == "{" ? E(n) && T(n, t, g ? "block" : "top", !1) : (e == "word" && (x = "error"), n.context.type);
		}, A.atBlock_parens = function(e, t, n) {
			return e == ")" ? E(n) : e == "{" || e == "}" ? O(e, t, n, 2) : A.atBlock(e, t, n);
		}, A.restricted_atBlock_before = function(e, t, n) {
			return e == "{" ? T(n, t, "restricted_atBlock") : e == "word" && n.stateArg == "@counter-style" ? (x = "variable", "restricted_atBlock_before") : D(e, t, n);
		}, A.restricted_atBlock = function(e, t, n) {
			return e == "}" ? (n.stateArg = null, E(n)) : e == "word" ? (x = n.stateArg == "@font-face" && !f.hasOwnProperty(t.current().toLowerCase()) || n.stateArg == "@counter-style" && !p.hasOwnProperty(t.current().toLowerCase()) ? "error" : "property", "maybeprop") : "restricted_atBlock";
		}, A.keyframes = function(e, t, n) {
			return e == "word" ? (x = "variable", "keyframes") : e == "{" ? T(n, t, "top") : D(e, t, n);
		}, A.at = function(e, t, n) {
			return e == ";" ? E(n) : e == "{" || e == "}" ? O(e, t, n) : (e == "word" ? x = "tag" : e == "hash" && (x = "builtin"), "at");
		}, A.interpolation = function(e, t, n) {
			return e == "}" ? E(n) : e == "{" || e == ";" ? O(e, t, n) : (e == "word" ? x = "variable" : e != "variable" && e != "(" && e != ")" && (x = "error"), "interpolation");
		}, {
			startState: function(e) {
				return {
					tokenize: null,
					state: r ? "block" : "top",
					stateArg: null,
					context: new w(r ? "block" : "top", e || 0, null)
				};
			},
			token: function(e, t) {
				if (!t.tokenize && e.eatSpace()) return null;
				var n = (t.tokenize || ee)(e, t);
				return n && typeof n == "object" && (b = n[1], n = n[0]), x = n, b != "comment" && (t.state = A[t.state](b, e, t)), x;
			},
			indent: function(e, t) {
				var n = e.context, r = t && t.charAt(0), a = n.indent;
				return n.type == "prop" && (r == "}" || r == ")") && (n = n.prev), n.prev && (r == "}" && (n.type == "block" || n.type == "top" || n.type == "interpolation" || n.type == "restricted_atBlock") ? (n = n.prev, a = n.indent) : (r == ")" && (n.type == "parens" || n.type == "atBlock_parens") || r == "{" && (n.type == "at" || n.type == "atBlock")) && (a = Math.max(0, n.indent - i))), a;
			},
			electricChars: "}",
			blockCommentStart: "/*",
			blockCommentEnd: "*/",
			blockCommentContinue: " * ",
			lineComment: _,
			fold: "brace"
		};
	});
	function t(e) {
		for (var t = {}, n = 0; n < e.length; ++n) t[e[n].toLowerCase()] = !0;
		return t;
	}
	var n = [
		"domain",
		"regexp",
		"url",
		"url-prefix"
	], r = t(n), i = [
		"all",
		"aural",
		"braille",
		"handheld",
		"print",
		"projection",
		"screen",
		"tty",
		"tv",
		"embossed"
	], a = t(i), o = /* @__PURE__ */ "width.min-width.max-width.height.min-height.max-height.device-width.min-device-width.max-device-width.device-height.min-device-height.max-device-height.aspect-ratio.min-aspect-ratio.max-aspect-ratio.device-aspect-ratio.min-device-aspect-ratio.max-device-aspect-ratio.color.min-color.max-color.color-index.min-color-index.max-color-index.monochrome.min-monochrome.max-monochrome.resolution.min-resolution.max-resolution.scan.grid.orientation.device-pixel-ratio.min-device-pixel-ratio.max-device-pixel-ratio.pointer.any-pointer.hover.any-hover.prefers-color-scheme".split("."), s = t(o), c = [
		"landscape",
		"portrait",
		"none",
		"coarse",
		"fine",
		"on-demand",
		"hover",
		"interlace",
		"progressive",
		"dark",
		"light"
	], l = t(c), u = /* @__PURE__ */ "align-content.align-items.align-self.alignment-adjust.alignment-baseline.all.anchor-point.animation.animation-delay.animation-direction.animation-duration.animation-fill-mode.animation-iteration-count.animation-name.animation-play-state.animation-timing-function.appearance.azimuth.backdrop-filter.backface-visibility.background.background-attachment.background-blend-mode.background-clip.background-color.background-image.background-origin.background-position.background-position-x.background-position-y.background-repeat.background-size.baseline-shift.binding.bleed.block-size.bookmark-label.bookmark-level.bookmark-state.bookmark-target.border.border-bottom.border-bottom-color.border-bottom-left-radius.border-bottom-right-radius.border-bottom-style.border-bottom-width.border-collapse.border-color.border-image.border-image-outset.border-image-repeat.border-image-slice.border-image-source.border-image-width.border-left.border-left-color.border-left-style.border-left-width.border-radius.border-right.border-right-color.border-right-style.border-right-width.border-spacing.border-style.border-top.border-top-color.border-top-left-radius.border-top-right-radius.border-top-style.border-top-width.border-width.bottom.box-decoration-break.box-shadow.box-sizing.break-after.break-before.break-inside.caption-side.caret-color.clear.clip.color.color-profile.column-count.column-fill.column-gap.column-rule.column-rule-color.column-rule-style.column-rule-width.column-span.column-width.columns.contain.content.counter-increment.counter-reset.crop.cue.cue-after.cue-before.cursor.direction.display.dominant-baseline.drop-initial-after-adjust.drop-initial-after-align.drop-initial-before-adjust.drop-initial-before-align.drop-initial-size.drop-initial-value.elevation.empty-cells.fit.fit-position.flex.flex-basis.flex-direction.flex-flow.flex-grow.flex-shrink.flex-wrap.float.float-offset.flow-from.flow-into.font.font-family.font-feature-settings.font-kerning.font-language-override.font-optical-sizing.font-size.font-size-adjust.font-stretch.font-style.font-synthesis.font-variant.font-variant-alternates.font-variant-caps.font-variant-east-asian.font-variant-ligatures.font-variant-numeric.font-variant-position.font-variation-settings.font-weight.gap.grid.grid-area.grid-auto-columns.grid-auto-flow.grid-auto-rows.grid-column.grid-column-end.grid-column-gap.grid-column-start.grid-gap.grid-row.grid-row-end.grid-row-gap.grid-row-start.grid-template.grid-template-areas.grid-template-columns.grid-template-rows.hanging-punctuation.height.hyphens.icon.image-orientation.image-rendering.image-resolution.inline-box-align.inset.inset-block.inset-block-end.inset-block-start.inset-inline.inset-inline-end.inset-inline-start.isolation.justify-content.justify-items.justify-self.left.letter-spacing.line-break.line-height.line-height-step.line-stacking.line-stacking-ruby.line-stacking-shift.line-stacking-strategy.list-style.list-style-image.list-style-position.list-style-type.margin.margin-bottom.margin-left.margin-right.margin-top.marks.marquee-direction.marquee-loop.marquee-play-count.marquee-speed.marquee-style.mask-clip.mask-composite.mask-image.mask-mode.mask-origin.mask-position.mask-repeat.mask-size.mask-type.max-block-size.max-height.max-inline-size.max-width.min-block-size.min-height.min-inline-size.min-width.mix-blend-mode.move-to.nav-down.nav-index.nav-left.nav-right.nav-up.object-fit.object-position.offset.offset-anchor.offset-distance.offset-path.offset-position.offset-rotate.opacity.order.orphans.outline.outline-color.outline-offset.outline-style.outline-width.overflow.overflow-style.overflow-wrap.overflow-x.overflow-y.padding.padding-bottom.padding-left.padding-right.padding-top.page.page-break-after.page-break-before.page-break-inside.page-policy.pause.pause-after.pause-before.perspective.perspective-origin.pitch.pitch-range.place-content.place-items.place-self.play-during.position.presentation-level.punctuation-trim.quotes.region-break-after.region-break-before.region-break-inside.region-fragment.rendering-intent.resize.rest.rest-after.rest-before.richness.right.rotate.rotation.rotation-point.row-gap.ruby-align.ruby-overhang.ruby-position.ruby-span.scale.scroll-behavior.scroll-margin.scroll-margin-block.scroll-margin-block-end.scroll-margin-block-start.scroll-margin-bottom.scroll-margin-inline.scroll-margin-inline-end.scroll-margin-inline-start.scroll-margin-left.scroll-margin-right.scroll-margin-top.scroll-padding.scroll-padding-block.scroll-padding-block-end.scroll-padding-block-start.scroll-padding-bottom.scroll-padding-inline.scroll-padding-inline-end.scroll-padding-inline-start.scroll-padding-left.scroll-padding-right.scroll-padding-top.scroll-snap-align.scroll-snap-type.shape-image-threshold.shape-inside.shape-margin.shape-outside.size.speak.speak-as.speak-header.speak-numeral.speak-punctuation.speech-rate.stress.string-set.tab-size.table-layout.target.target-name.target-new.target-position.text-align.text-align-last.text-combine-upright.text-decoration.text-decoration-color.text-decoration-line.text-decoration-skip.text-decoration-skip-ink.text-decoration-style.text-emphasis.text-emphasis-color.text-emphasis-position.text-emphasis-style.text-height.text-indent.text-justify.text-orientation.text-outline.text-overflow.text-rendering.text-shadow.text-size-adjust.text-space-collapse.text-transform.text-underline-position.text-wrap.top.touch-action.transform.transform-origin.transform-style.transition.transition-delay.transition-duration.transition-property.transition-timing-function.translate.unicode-bidi.user-select.vertical-align.visibility.voice-balance.voice-duration.voice-family.voice-pitch.voice-range.voice-rate.voice-stress.voice-volume.volume.white-space.widows.width.will-change.word-break.word-spacing.word-wrap.writing-mode.z-index.clip-path.clip-rule.mask.enable-background.filter.flood-color.flood-opacity.lighting-color.stop-color.stop-opacity.pointer-events.color-interpolation.color-interpolation-filters.color-rendering.fill.fill-opacity.fill-rule.image-rendering.marker.marker-end.marker-mid.marker-start.paint-order.shape-rendering.stroke.stroke-dasharray.stroke-dashoffset.stroke-linecap.stroke-linejoin.stroke-miterlimit.stroke-opacity.stroke-width.text-rendering.baseline-shift.dominant-baseline.glyph-orientation-horizontal.glyph-orientation-vertical.text-anchor.writing-mode".split("."), d = t(u), f = /* @__PURE__ */ "border-block.border-block-color.border-block-end.border-block-end-color.border-block-end-style.border-block-end-width.border-block-start.border-block-start-color.border-block-start-style.border-block-start-width.border-block-style.border-block-width.border-inline.border-inline-color.border-inline-end.border-inline-end-color.border-inline-end-style.border-inline-end-width.border-inline-start.border-inline-start-color.border-inline-start-style.border-inline-start-width.border-inline-style.border-inline-width.margin-block.margin-block-end.margin-block-start.margin-inline.margin-inline-end.margin-inline-start.padding-block.padding-block-end.padding-block-start.padding-inline.padding-inline-end.padding-inline-start.scroll-snap-stop.scrollbar-3d-light-color.scrollbar-arrow-color.scrollbar-base-color.scrollbar-dark-shadow-color.scrollbar-face-color.scrollbar-highlight-color.scrollbar-shadow-color.scrollbar-track-color.searchfield-cancel-button.searchfield-decoration.searchfield-results-button.searchfield-results-decoration.shape-inside.zoom".split("."), p = t(f), m = t([
		"font-display",
		"font-family",
		"src",
		"unicode-range",
		"font-variant",
		"font-feature-settings",
		"font-stretch",
		"font-weight",
		"font-style"
	]), h = t([
		"additive-symbols",
		"fallback",
		"negative",
		"pad",
		"prefix",
		"range",
		"speak-as",
		"suffix",
		"symbols",
		"system"
	]), g = /* @__PURE__ */ "aliceblue.antiquewhite.aqua.aquamarine.azure.beige.bisque.black.blanchedalmond.blue.blueviolet.brown.burlywood.cadetblue.chartreuse.chocolate.coral.cornflowerblue.cornsilk.crimson.cyan.darkblue.darkcyan.darkgoldenrod.darkgray.darkgreen.darkkhaki.darkmagenta.darkolivegreen.darkorange.darkorchid.darkred.darksalmon.darkseagreen.darkslateblue.darkslategray.darkturquoise.darkviolet.deeppink.deepskyblue.dimgray.dodgerblue.firebrick.floralwhite.forestgreen.fuchsia.gainsboro.ghostwhite.gold.goldenrod.gray.grey.green.greenyellow.honeydew.hotpink.indianred.indigo.ivory.khaki.lavender.lavenderblush.lawngreen.lemonchiffon.lightblue.lightcoral.lightcyan.lightgoldenrodyellow.lightgray.lightgreen.lightpink.lightsalmon.lightseagreen.lightskyblue.lightslategray.lightsteelblue.lightyellow.lime.limegreen.linen.magenta.maroon.mediumaquamarine.mediumblue.mediumorchid.mediumpurple.mediumseagreen.mediumslateblue.mediumspringgreen.mediumturquoise.mediumvioletred.midnightblue.mintcream.mistyrose.moccasin.navajowhite.navy.oldlace.olive.olivedrab.orange.orangered.orchid.palegoldenrod.palegreen.paleturquoise.palevioletred.papayawhip.peachpuff.peru.pink.plum.powderblue.purple.rebeccapurple.red.rosybrown.royalblue.saddlebrown.salmon.sandybrown.seagreen.seashell.sienna.silver.skyblue.slateblue.slategray.snow.springgreen.steelblue.tan.teal.thistle.tomato.turquoise.violet.wheat.white.whitesmoke.yellow.yellowgreen".split("."), _ = t(g), v = /* @__PURE__ */ "above.absolute.activeborder.additive.activecaption.afar.after-white-space.ahead.alias.all.all-scroll.alphabetic.alternate.always.amharic.amharic-abegede.antialiased.appworkspace.arabic-indic.armenian.asterisks.attr.auto.auto-flow.avoid.avoid-column.avoid-page.avoid-region.axis-pan.background.backwards.baseline.below.bidi-override.binary.bengali.blink.block.block-axis.bold.bolder.border.border-box.both.bottom.break.break-all.break-word.bullets.button.button-bevel.buttonface.buttonhighlight.buttonshadow.buttontext.calc.cambodian.capitalize.caps-lock-indicator.caption.captiontext.caret.cell.center.checkbox.circle.cjk-decimal.cjk-earthly-branch.cjk-heavenly-stem.cjk-ideographic.clear.clip.close-quote.col-resize.collapse.color.color-burn.color-dodge.column.column-reverse.compact.condensed.contain.content.contents.content-box.context-menu.continuous.copy.counter.counters.cover.crop.cross.crosshair.currentcolor.cursive.cyclic.darken.dashed.decimal.decimal-leading-zero.default.default-button.dense.destination-atop.destination-in.destination-out.destination-over.devanagari.difference.disc.discard.disclosure-closed.disclosure-open.document.dot-dash.dot-dot-dash.dotted.double.down.e-resize.ease.ease-in.ease-in-out.ease-out.element.ellipse.ellipsis.embed.end.ethiopic.ethiopic-abegede.ethiopic-abegede-am-et.ethiopic-abegede-gez.ethiopic-abegede-ti-er.ethiopic-abegede-ti-et.ethiopic-halehame-aa-er.ethiopic-halehame-aa-et.ethiopic-halehame-am-et.ethiopic-halehame-gez.ethiopic-halehame-om-et.ethiopic-halehame-sid-et.ethiopic-halehame-so-et.ethiopic-halehame-ti-er.ethiopic-halehame-ti-et.ethiopic-halehame-tig.ethiopic-numeric.ew-resize.exclusion.expanded.extends.extra-condensed.extra-expanded.fantasy.fast.fill.fill-box.fixed.flat.flex.flex-end.flex-start.footnotes.forwards.from.geometricPrecision.georgian.graytext.grid.groove.gujarati.gurmukhi.hand.hangul.hangul-consonant.hard-light.hebrew.help.hidden.hide.higher.highlight.highlighttext.hiragana.hiragana-iroha.horizontal.hsl.hsla.hue.icon.ignore.inactiveborder.inactivecaption.inactivecaptiontext.infinite.infobackground.infotext.inherit.initial.inline.inline-axis.inline-block.inline-flex.inline-grid.inline-table.inset.inside.intrinsic.invert.italic.japanese-formal.japanese-informal.justify.kannada.katakana.katakana-iroha.keep-all.khmer.korean-hangul-formal.korean-hanja-formal.korean-hanja-informal.landscape.lao.large.larger.left.level.lighter.lighten.line-through.linear.linear-gradient.lines.list-item.listbox.listitem.local.logical.loud.lower.lower-alpha.lower-armenian.lower-greek.lower-hexadecimal.lower-latin.lower-norwegian.lower-roman.lowercase.ltr.luminosity.malayalam.manipulation.match.matrix.matrix3d.media-controls-background.media-current-time-display.media-fullscreen-button.media-mute-button.media-play-button.media-return-to-realtime-button.media-rewind-button.media-seek-back-button.media-seek-forward-button.media-slider.media-sliderthumb.media-time-remaining-display.media-volume-slider.media-volume-slider-container.media-volume-sliderthumb.medium.menu.menulist.menulist-button.menulist-text.menulist-textfield.menutext.message-box.middle.min-intrinsic.mix.mongolian.monospace.move.multiple.multiple_mask_images.multiply.myanmar.n-resize.narrower.ne-resize.nesw-resize.no-close-quote.no-drop.no-open-quote.no-repeat.none.normal.not-allowed.nowrap.ns-resize.numbers.numeric.nw-resize.nwse-resize.oblique.octal.opacity.open-quote.optimizeLegibility.optimizeSpeed.oriya.oromo.outset.outside.outside-shape.overlay.overline.padding.padding-box.painted.page.paused.persian.perspective.pinch-zoom.plus-darker.plus-lighter.pointer.polygon.portrait.pre.pre-line.pre-wrap.preserve-3d.progress.push-button.radial-gradient.radio.read-only.read-write.read-write-plaintext-only.rectangle.region.relative.repeat.repeating-linear-gradient.repeating-radial-gradient.repeat-x.repeat-y.reset.reverse.rgb.rgba.ridge.right.rotate.rotate3d.rotateX.rotateY.rotateZ.round.row.row-resize.row-reverse.rtl.run-in.running.s-resize.sans-serif.saturation.scale.scale3d.scaleX.scaleY.scaleZ.screen.scroll.scrollbar.scroll-position.se-resize.searchfield.searchfield-cancel-button.searchfield-decoration.searchfield-results-button.searchfield-results-decoration.self-start.self-end.semi-condensed.semi-expanded.separate.serif.show.sidama.simp-chinese-formal.simp-chinese-informal.single.skew.skewX.skewY.skip-white-space.slide.slider-horizontal.slider-vertical.sliderthumb-horizontal.sliderthumb-vertical.slow.small.small-caps.small-caption.smaller.soft-light.solid.somali.source-atop.source-in.source-out.source-over.space.space-around.space-between.space-evenly.spell-out.square.square-button.start.static.status-bar.stretch.stroke.stroke-box.sub.subpixel-antialiased.svg_masks.super.sw-resize.symbolic.symbols.system-ui.table.table-caption.table-cell.table-column.table-column-group.table-footer-group.table-header-group.table-row.table-row-group.tamil.telugu.text.text-bottom.text-top.textarea.textfield.thai.thick.thin.threeddarkshadow.threedface.threedhighlight.threedlightshadow.threedshadow.tibetan.tigre.tigrinya-er.tigrinya-er-abegede.tigrinya-et.tigrinya-et-abegede.to.top.trad-chinese-formal.trad-chinese-informal.transform.translate.translate3d.translateX.translateY.translateZ.transparent.ultra-condensed.ultra-expanded.underline.unidirectional-pan.unset.up.upper-alpha.upper-armenian.upper-greek.upper-hexadecimal.upper-latin.upper-norwegian.upper-roman.uppercase.urdu.url.var.vertical.vertical-text.view-box.visible.visibleFill.visiblePainted.visibleStroke.visual.w-resize.wait.wave.wider.window.windowframe.windowtext.words.wrap.wrap-reverse.x-large.x-small.xor.xx-large.xx-small".split("."), y = t(v), b = n.concat(i).concat(o).concat(c).concat(u).concat(f).concat(g).concat(v);
	e.registerHelper("hintWords", "css", b);
	function x(e, t) {
		for (var n = !1, r; (r = e.next()) != null;) {
			if (n && r == "/") {
				t.tokenize = null;
				break;
			}
			n = r == "*";
		}
		return ["comment", "comment"];
	}
	e.defineMIME("text/css", {
		documentTypes: r,
		mediaTypes: a,
		mediaFeatures: s,
		mediaValueKeywords: l,
		propertyKeywords: d,
		nonStandardPropertyKeywords: p,
		fontProperties: m,
		counterDescriptors: h,
		colorKeywords: _,
		valueKeywords: y,
		tokenHooks: { "/": function(e, t) {
			return e.eat("*") ? (t.tokenize = x, x(e, t)) : !1;
		} },
		name: "css"
	}), e.defineMIME("text/x-scss", {
		mediaTypes: a,
		mediaFeatures: s,
		mediaValueKeywords: l,
		propertyKeywords: d,
		nonStandardPropertyKeywords: p,
		colorKeywords: _,
		valueKeywords: y,
		fontProperties: m,
		allowNested: !0,
		lineComment: "//",
		tokenHooks: {
			"/": function(e, t) {
				return e.eat("/") ? (e.skipToEnd(), ["comment", "comment"]) : e.eat("*") ? (t.tokenize = x, x(e, t)) : ["operator", "operator"];
			},
			":": function(e) {
				return e.match(/^\s*\{/, !1) ? [null, null] : !1;
			},
			$: function(e) {
				return e.match(/^[\w-]+/), e.match(/^\s*:/, !1) ? ["variable-2", "variable-definition"] : ["variable-2", "variable"];
			},
			"#": function(e) {
				return e.eat("{") ? [null, "interpolation"] : !1;
			}
		},
		name: "css",
		helperType: "scss"
	}), e.defineMIME("text/x-less", {
		mediaTypes: a,
		mediaFeatures: s,
		mediaValueKeywords: l,
		propertyKeywords: d,
		nonStandardPropertyKeywords: p,
		colorKeywords: _,
		valueKeywords: y,
		fontProperties: m,
		allowNested: !0,
		lineComment: "//",
		tokenHooks: {
			"/": function(e, t) {
				return e.eat("/") ? (e.skipToEnd(), ["comment", "comment"]) : e.eat("*") ? (t.tokenize = x, x(e, t)) : ["operator", "operator"];
			},
			"@": function(e) {
				return e.eat("{") ? [null, "interpolation"] : !e.match(/^(charset|document|font-face|import|(-(moz|ms|o|webkit)-)?keyframes|media|namespace|page|supports)\b/i, !1) && (e.eatWhile(/[\w\\\-]/), e.match(/^\s*:/, !1) ? ["variable-2", "variable-definition"] : ["variable-2", "variable"]);
			},
			"&": function() {
				return ["atom", "atom"];
			}
		},
		name: "css",
		helperType: "less"
	}), e.defineMIME("text/x-gss", {
		documentTypes: r,
		mediaTypes: a,
		mediaFeatures: s,
		propertyKeywords: d,
		nonStandardPropertyKeywords: p,
		fontProperties: m,
		counterDescriptors: h,
		colorKeywords: _,
		valueKeywords: y,
		supportsAtComponent: !0,
		tokenHooks: { "/": function(e, t) {
			return e.eat("*") ? (t.tokenize = x, x(e, t)) : !1;
		} },
		name: "css",
		helperType: "gss"
	});
}), (function(e) {
	typeof define == "function" && define.amd ? define(["../../lib/codemirror"], e) : e(CodeMirror);
})(function(e) {
	var t = {
		autoSelfClosers: {
			area: !0,
			base: !0,
			br: !0,
			col: !0,
			command: !0,
			embed: !0,
			frame: !0,
			hr: !0,
			img: !0,
			input: !0,
			keygen: !0,
			link: !0,
			meta: !0,
			param: !0,
			source: !0,
			track: !0,
			wbr: !0,
			menuitem: !0
		},
		implicitlyClosed: {
			dd: !0,
			li: !0,
			optgroup: !0,
			option: !0,
			p: !0,
			rp: !0,
			rt: !0,
			tbody: !0,
			td: !0,
			tfoot: !0,
			th: !0,
			tr: !0
		},
		contextGrabbers: {
			dd: {
				dd: !0,
				dt: !0
			},
			dt: {
				dd: !0,
				dt: !0
			},
			li: { li: !0 },
			option: {
				option: !0,
				optgroup: !0
			},
			optgroup: { optgroup: !0 },
			p: {
				address: !0,
				article: !0,
				aside: !0,
				blockquote: !0,
				dir: !0,
				div: !0,
				dl: !0,
				fieldset: !0,
				footer: !0,
				form: !0,
				h1: !0,
				h2: !0,
				h3: !0,
				h4: !0,
				h5: !0,
				h6: !0,
				header: !0,
				hgroup: !0,
				hr: !0,
				menu: !0,
				nav: !0,
				ol: !0,
				p: !0,
				pre: !0,
				section: !0,
				table: !0,
				ul: !0
			},
			rp: {
				rp: !0,
				rt: !0
			},
			rt: {
				rp: !0,
				rt: !0
			},
			tbody: {
				tbody: !0,
				tfoot: !0
			},
			td: {
				td: !0,
				th: !0
			},
			tfoot: { tbody: !0 },
			th: {
				td: !0,
				th: !0
			},
			thead: {
				tbody: !0,
				tfoot: !0
			},
			tr: { tr: !0 }
		},
		doNotIndent: { pre: !0 },
		allowUnquoted: !0,
		allowMissing: !0,
		caseFold: !0
	}, n = {
		autoSelfClosers: {},
		implicitlyClosed: {},
		contextGrabbers: {},
		doNotIndent: {},
		allowUnquoted: !1,
		allowMissing: !1,
		allowMissingTagName: !1,
		caseFold: !1
	};
	e.defineMode("xml", function(r, i) {
		var a = r.indentUnit, o = {}, s = i.htmlMode ? t : n;
		for (var c in s) o[c] = s[c];
		for (var c in i) o[c] = i[c];
		var l, u;
		function d(e, t) {
			function n(n) {
				return t.tokenize = n, n(e, t);
			}
			var r = e.next();
			return r == "<" ? e.eat("!") ? e.eat("[") ? e.match("CDATA[") ? n(m("atom", "]]>")) : null : e.match("--") ? n(m("comment", "-->")) : e.match("DOCTYPE", !0, !0) ? (e.eatWhile(/[\w\._\-]/), n(h(1))) : null : e.eat("?") ? (e.eatWhile(/[\w\._\-]/), t.tokenize = m("meta", "?>"), "meta") : (l = e.eat("/") ? "closeTag" : "openTag", t.tokenize = f, "tag bracket") : r == "&" ? (e.eat("#") ? e.eat("x") ? e.eatWhile(/[a-fA-F\d]/) && e.eat(";") : e.eatWhile(/[\d]/) && e.eat(";") : e.eatWhile(/[\w\.\-:]/) && e.eat(";")) ? "atom" : "error" : (e.eatWhile(/[^&<]/), null);
		}
		d.isInText = !0;
		function f(e, t) {
			var n = e.next();
			if (n == ">" || n == "/" && e.eat(">")) return t.tokenize = d, l = n == ">" ? "endTag" : "selfcloseTag", "tag bracket";
			if (n == "=") return l = "equals", null;
			if (n == "<") {
				t.tokenize = d, t.state = y, t.tagName = t.tagStart = null;
				var r = t.tokenize(e, t);
				return r ? r + " tag error" : "tag error";
			}
			return /[\'\"]/.test(n) ? (t.tokenize = p(n), t.stringStartCol = e.column(), t.tokenize(e, t)) : (e.match(/^[^\s\u00a0=<>\"\']*[^\s\u00a0=<>\"\'\/]/), "word");
		}
		function p(e) {
			var t = function(t, n) {
				for (; !t.eol();) if (t.next() == e) {
					n.tokenize = f;
					break;
				}
				return "string";
			};
			return t.isInAttribute = !0, t;
		}
		function m(e, t) {
			return function(n, r) {
				for (; !n.eol();) {
					if (n.match(t)) {
						r.tokenize = d;
						break;
					}
					n.next();
				}
				return e;
			};
		}
		function h(e) {
			return function(t, n) {
				for (var r; (r = t.next()) != null;) if (r == "<") return n.tokenize = h(e + 1), n.tokenize(t, n);
				else if (r == ">") {
					if (e == 1) {
						n.tokenize = d;
						break;
					}
					return n.tokenize = h(e - 1), n.tokenize(t, n);
				}
				return "meta";
			};
		}
		function g(e, t, n) {
			this.prev = e.context, this.tagName = t || "", this.indent = e.indented, this.startOfLine = n, (o.doNotIndent.hasOwnProperty(t) || e.context && e.context.noIndent) && (this.noIndent = !0);
		}
		function _(e) {
			e.context &&= e.context.prev;
		}
		function v(e, t) {
			for (var n;;) {
				if (!e.context || (n = e.context.tagName, !o.contextGrabbers.hasOwnProperty(n) || !o.contextGrabbers[n].hasOwnProperty(t))) return;
				_(e);
			}
		}
		function y(e, t, n) {
			return e == "openTag" ? (n.tagStart = t.column(), b) : e == "closeTag" ? x : y;
		}
		function b(e, t, n) {
			return e == "word" ? (n.tagName = t.current(), u = "tag", C) : o.allowMissingTagName && e == "endTag" ? (u = "tag bracket", C(e, t, n)) : (u = "error", b);
		}
		function x(e, t, n) {
			if (e == "word") {
				var r = t.current();
				return n.context && n.context.tagName != r && o.implicitlyClosed.hasOwnProperty(n.context.tagName) && _(n), n.context && n.context.tagName == r || o.matchClosing === !1 ? (u = "tag", S) : (u = "tag error", ee);
			}
			return o.allowMissingTagName && e == "endTag" ? (u = "tag bracket", S(e, t, n)) : (u = "error", ee);
		}
		function S(e, t, n) {
			return e == "endTag" ? (_(n), y) : (u = "error", S);
		}
		function ee(e, t, n) {
			return u = "error", S(e, t, n);
		}
		function C(e, t, n) {
			if (e == "word") return u = "attribute", te;
			if (e == "endTag" || e == "selfcloseTag") {
				var r = n.tagName, i = n.tagStart;
				return n.tagName = n.tagStart = null, e == "selfcloseTag" || o.autoSelfClosers.hasOwnProperty(r) ? v(n, r) : (v(n, r), n.context = new g(n, r, i == n.indented)), y;
			}
			return u = "error", C;
		}
		function te(e, t, n) {
			return e == "equals" ? w : (o.allowMissing || (u = "error"), C(e, t, n));
		}
		function w(e, t, n) {
			return e == "string" ? T : e == "word" && o.allowUnquoted ? (u = "string", C) : (u = "error", C(e, t, n));
		}
		function T(e, t, n) {
			return e == "string" ? T : C(e, t, n);
		}
		return {
			startState: function(e) {
				var t = {
					tokenize: d,
					state: y,
					indented: e || 0,
					tagName: null,
					tagStart: null,
					context: null
				};
				return e != null && (t.baseIndent = e), t;
			},
			token: function(e, t) {
				if (!t.tagName && e.sol() && (t.indented = e.indentation()), e.eatSpace()) return null;
				l = null;
				var n = t.tokenize(e, t);
				return (n || l) && n != "comment" && (u = null, t.state = t.state(l || n, e, t), u && (n = u == "error" ? n + " error" : u)), n;
			},
			indent: function(t, n, r) {
				var i = t.context;
				if (t.tokenize.isInAttribute) return t.tagStart == t.indented ? t.stringStartCol + 1 : t.indented + a;
				if (i && i.noIndent) return e.Pass;
				if (t.tokenize != f && t.tokenize != d) return r ? r.match(/^(\s*)/)[0].length : 0;
				if (t.tagName) return o.multilineTagIndentPastTag === !1 ? t.tagStart + a * (o.multilineTagIndentFactor || 1) : t.tagStart + t.tagName.length + 2;
				if (o.alignCDATA && /<!\[CDATA\[/.test(n)) return 0;
				var s = n && /^<(\/)?([\w_:\.-]*)/.exec(n);
				if (s && s[1]) for (; i;) if (i.tagName == s[2]) {
					i = i.prev;
					break;
				} else if (o.implicitlyClosed.hasOwnProperty(i.tagName)) i = i.prev;
				else break;
				else if (s) for (; i;) {
					var c = o.contextGrabbers[i.tagName];
					if (c && c.hasOwnProperty(s[2])) i = i.prev;
					else break;
				}
				for (; i && i.prev && !i.startOfLine;) i = i.prev;
				return i ? i.indent + a : t.baseIndent || 0;
			},
			electricInput: /<\/[\s\w:]+>$/,
			blockCommentStart: "<!--",
			blockCommentEnd: "-->",
			configuration: o.htmlMode ? "html" : "xml",
			helperType: o.htmlMode ? "html" : "xml",
			skipAttribute: function(e) {
				e.state == w && (e.state = C);
			},
			xmlCurrentTag: function(e) {
				return e.tagName ? {
					name: e.tagName,
					close: e.type == "closeTag"
				} : null;
			},
			xmlCurrentContext: function(e) {
				for (var t = [], n = e.context; n; n = n.prev) t.push(n.tagName);
				return t.reverse();
			}
		};
	}), e.defineMIME("text/xml", "xml"), e.defineMIME("application/xml", "xml"), e.mimeModes.hasOwnProperty("text/html") || e.defineMIME("text/html", {
		name: "xml",
		htmlMode: !0
	});
}), (function(e) {
	typeof define == "function" && define.amd ? define(["../../lib/codemirror"], e) : e(CodeMirror);
})(function(e) {
	e.defineMode("javascript", function(t, n) {
		var r = t.indentUnit, i = n.statementIndent, a = n.jsonld, o = n.json || a, s = n.trackScope !== !1, c = n.typescript, l = n.wordCharacters || /[\w$\xa1-\uffff]/, u = function() {
			function e(e) {
				return {
					type: e,
					style: "keyword"
				};
			}
			var t = e("keyword a"), n = e("keyword b"), r = e("keyword c"), i = e("keyword d"), a = e("operator"), o = {
				type: "atom",
				style: "atom"
			};
			return {
				if: e("if"),
				while: t,
				with: t,
				else: n,
				do: n,
				try: n,
				finally: n,
				return: i,
				break: i,
				continue: i,
				new: e("new"),
				delete: r,
				void: r,
				throw: r,
				debugger: e("debugger"),
				var: e("var"),
				const: e("var"),
				let: e("var"),
				function: e("function"),
				catch: e("catch"),
				for: e("for"),
				switch: e("switch"),
				case: e("case"),
				default: e("default"),
				in: a,
				typeof: a,
				instanceof: a,
				true: o,
				false: o,
				null: o,
				undefined: o,
				NaN: o,
				Infinity: o,
				this: e("this"),
				class: e("class"),
				super: e("atom"),
				yield: r,
				export: e("export"),
				import: e("import"),
				extends: r,
				await: r
			};
		}(), d = /[+\-*&%=<>!?|~^@]/, f = /^@(context|id|value|language|type|container|list|set|reverse|index|base|vocab|graph)"/;
		function p(e) {
			for (var t = !1, n, r = !1; (n = e.next()) != null;) {
				if (!t) {
					if (n == "/" && !r) return;
					n == "[" ? r = !0 : r && n == "]" && (r = !1);
				}
				t = !t && n == "\\";
			}
		}
		var m, h;
		function g(e, t, n) {
			return m = e, h = n, t;
		}
		function _(e, t) {
			var n = e.next();
			if (n == "\"" || n == "'") return t.tokenize = v(n), t.tokenize(e, t);
			if (n == "." && e.match(/^\d[\d_]*(?:[eE][+\-]?[\d_]+)?/)) return g("number", "number");
			if (n == "." && e.match("..")) return g("spread", "meta");
			if (/[\[\]{}\(\),;\:\.]/.test(n)) return g(n);
			if (n == "=" && e.eat(">")) return g("=>", "operator");
			if (n == "0" && e.match(/^(?:x[\dA-Fa-f_]+|o[0-7_]+|b[01_]+)n?/)) return g("number", "number");
			if (/\d/.test(n)) return e.match(/^[\d_]*(?:n|(?:\.[\d_]*)?(?:[eE][+\-]?[\d_]+)?)?/), g("number", "number");
			if (n == "/") return e.eat("*") ? (t.tokenize = y, y(e, t)) : e.eat("/") ? (e.skipToEnd(), g("comment", "comment")) : nt(e, t, 1) ? (p(e), e.match(/^\b(([gimyus])(?![gimyus]*\2))+\b/), g("regexp", "string-2")) : (e.eat("="), g("operator", "operator", e.current()));
			if (n == "`") return t.tokenize = b, b(e, t);
			if (n == "#" && e.peek() == "!") return e.skipToEnd(), g("meta", "meta");
			if (n == "#" && e.eatWhile(l)) return g("variable", "property");
			if (n == "<" && e.match("!--") || n == "-" && e.match("->") && !/\S/.test(e.string.slice(0, e.start))) return e.skipToEnd(), g("comment", "comment");
			if (d.test(n)) return (n != ">" || !t.lexical || t.lexical.type != ">") && (e.eat("=") ? (n == "!" || n == "=") && e.eat("=") : /[<>*+\-|&?]/.test(n) && (e.eat(n), n == ">" && e.eat(n))), n == "?" && e.eat(".") ? g(".") : g("operator", "operator", e.current());
			if (l.test(n)) {
				e.eatWhile(l);
				var r = e.current();
				if (t.lastType != ".") {
					if (u.propertyIsEnumerable(r)) {
						var i = u[r];
						return g(i.type, i.style, r);
					}
					if (r == "async" && e.match(/^(\s|\/\*([^*]|\*(?!\/))*?\*\/)*[\[\(\w]/, !1)) return g("async", "keyword", r);
				}
				return g("variable", "variable", r);
			}
		}
		function v(e) {
			return function(t, n) {
				var r = !1, i;
				if (a && t.peek() == "@" && t.match(f)) return n.tokenize = _, g("jsonld-keyword", "meta");
				for (; (i = t.next()) != null && (i != e || r);) r = !r && i == "\\";
				return r || (n.tokenize = _), g("string", "string");
			};
		}
		function y(e, t) {
			for (var n = !1, r; r = e.next();) {
				if (r == "/" && n) {
					t.tokenize = _;
					break;
				}
				n = r == "*";
			}
			return g("comment", "comment");
		}
		function b(e, t) {
			for (var n = !1, r; (r = e.next()) != null;) {
				if (!n && (r == "`" || r == "$" && e.eat("{"))) {
					t.tokenize = _;
					break;
				}
				n = !n && r == "\\";
			}
			return g("quasi", "string-2", e.current());
		}
		var x = "([{}])";
		function S(e, t) {
			t.fatArrowAt &&= null;
			var n = e.string.indexOf("=>", e.start);
			if (!(n < 0)) {
				if (c) {
					var r = /:\s*(?:\w+(?:<[^>]*>|\[\])?|\{[^}]*\})\s*$/.exec(e.string.slice(e.start, n));
					r && (n = r.index);
				}
				for (var i = 0, a = !1, o = n - 1; o >= 0; --o) {
					var s = e.string.charAt(o), u = x.indexOf(s);
					if (u >= 0 && u < 3) {
						if (!i) {
							++o;
							break;
						}
						if (--i == 0) {
							s == "(" && (a = !0);
							break;
						}
					} else if (u >= 3 && u < 6) ++i;
					else if (l.test(s)) a = !0;
					else if (/["'\/`]/.test(s)) for (;; --o) {
						if (o == 0) return;
						if (e.string.charAt(o - 1) == s && e.string.charAt(o - 2) != "\\") {
							o--;
							break;
						}
					}
					else if (a && !i) {
						++o;
						break;
					}
				}
				a && !i && (t.fatArrowAt = o);
			}
		}
		var ee = {
			atom: !0,
			number: !0,
			variable: !0,
			string: !0,
			regexp: !0,
			this: !0,
			import: !0,
			"jsonld-keyword": !0
		};
		function C(e, t, n, r, i, a) {
			this.indented = e, this.column = t, this.type = n, this.prev = i, this.info = a, r != null && (this.align = r);
		}
		function te(e, t) {
			if (!s) return !1;
			for (var n = e.localVars; n; n = n.next) if (n.name == t) return !0;
			for (var r = e.context; r; r = r.prev) for (var n = r.vars; n; n = n.next) if (n.name == t) return !0;
		}
		function w(e, t, n, r, i) {
			var a = e.cc;
			for (T.state = e, T.stream = i, T.marked = null, T.cc = a, T.style = t, e.lexical.hasOwnProperty("align") || (e.lexical.align = !0);;) if ((a.length ? a.pop() : o ? B : z)(n, r)) {
				for (; a.length && a[a.length - 1].lex;) a.pop()();
				return T.marked ? T.marked : n == "variable" && te(e, r) ? "variable-2" : t;
			}
		}
		var T = {
			state: null,
			column: null,
			marked: null,
			cc: null
		};
		function E() {
			for (var e = arguments.length - 1; e >= 0; e--) T.cc.push(arguments[e]);
		}
		function D() {
			return E.apply(null, arguments), !0;
		}
		function O(e, t) {
			for (var n = t; n; n = n.next) if (n.name == e) return !0;
			return !1;
		}
		function k(e) {
			var t = T.state;
			if (T.marked = "def", s) {
				if (t.context) {
					if (t.lexical.info == "var" && t.context && t.context.block) {
						var r = A(e, t.context);
						if (r != null) {
							t.context = r;
							return;
						}
					} else if (!O(e, t.localVars)) {
						t.localVars = new N(e, t.localVars);
						return;
					}
				}
				n.globalVars && !O(e, t.globalVars) && (t.globalVars = new N(e, t.globalVars));
			}
		}
		function A(e, t) {
			if (!t) return null;
			if (t.block) {
				var n = A(e, t.prev);
				return n ? n == t.prev ? t : new M(n, t.vars, !0) : null;
			}
			return O(e, t.vars) ? t : new M(t.prev, new N(e, t.vars), !1);
		}
		function j(e) {
			return e == "public" || e == "private" || e == "protected" || e == "abstract" || e == "readonly";
		}
		function M(e, t, n) {
			this.prev = e, this.vars = t, this.block = n;
		}
		function N(e, t) {
			this.name = e, this.next = t;
		}
		var ne = new N("this", new N("arguments", null));
		function P() {
			T.state.context = new M(T.state.context, T.state.localVars, !1), T.state.localVars = ne;
		}
		function re() {
			T.state.context = new M(T.state.context, T.state.localVars, !0), T.state.localVars = null;
		}
		function F() {
			T.state.localVars = T.state.context.vars, T.state.context = T.state.context.prev;
		}
		F.lex = !0;
		function I(e, t) {
			var n = function() {
				var n = T.state, r = n.indented;
				if (n.lexical.type == "stat") r = n.lexical.indented;
				else for (var i = n.lexical; i && i.type == ")" && i.align; i = i.prev) r = i.indented;
				n.lexical = new C(r, T.stream.column(), e, null, n.lexical, t);
			};
			return n.lex = !0, n;
		}
		function L() {
			var e = T.state;
			e.lexical.prev && (e.lexical.type == ")" && (e.indented = e.lexical.indented), e.lexical = e.lexical.prev);
		}
		L.lex = !0;
		function R(e) {
			function t(n) {
				return n == e ? D() : e == ";" || n == "}" || n == ")" || n == "]" ? E() : D(t);
			}
			return t;
		}
		function z(e, t) {
			return e == "var" ? D(I("vardef", t), je, R(";"), L) : e == "keyword a" ? D(I("form"), ae, z, L) : e == "keyword b" ? D(I("form"), z, L) : e == "keyword d" ? T.stream.match(/^\s*$/, !1) ? D() : D(I("stat"), H, R(";"), L) : e == "debugger" ? D(R(";")) : e == "{" ? D(I("}"), re, ye, L, F) : e == ";" ? D() : e == "if" ? (T.state.lexical.info == "else" && T.state.cc[T.state.cc.length - 1] == L && T.state.cc.pop()(), D(I("form"), ae, z, L, Fe)) : e == "function" ? D(Z) : e == "for" ? D(I("form"), re, Ie, z, F, L) : e == "class" || c && t == "interface" ? (T.marked = "keyword", D(I("form", e == "class" ? e : t), He, L)) : e == "variable" ? c && t == "declare" ? (T.marked = "keyword", D(z)) : c && (t == "module" || t == "enum" || t == "type") && T.stream.match(/^\s*\w/, !1) ? (T.marked = "keyword", t == "enum" ? D($e) : t == "type" ? D(Be, R("operator"), q, R(";")) : D(I("form"), Y, R("{"), I("}"), ye, L, L)) : c && t == "namespace" ? (T.marked = "keyword", D(I("form"), B, z, L)) : c && t == "abstract" ? (T.marked = "keyword", D(z)) : D(I("stat"), me) : e == "switch" ? D(I("form"), ae, R("{"), I("}", "switch"), re, ye, L, L, F) : e == "case" ? D(B, R(":")) : e == "default" ? D(R(":")) : e == "catch" ? D(I("form"), P, ie, z, L, F) : e == "export" ? D(I("stat"), Ge, L) : e == "import" ? D(I("stat"), qe, L) : e == "async" ? D(z) : t == "@" ? D(B, z) : E(I("stat"), B, R(";"), L);
		}
		function ie(e) {
			if (e == "(") return D(Q, R(")"));
		}
		function B(e, t) {
			return oe(e, t, !1);
		}
		function V(e, t) {
			return oe(e, t, !0);
		}
		function ae(e) {
			return e == "(" ? D(I(")"), H, R(")"), L) : E();
		}
		function oe(e, t, n) {
			if (T.state.fatArrowAt == T.stream.start) {
				var r = n ? ue : le;
				if (e == "(") return D(P, I(")"), K(Q, ")"), L, R("=>"), r, F);
				if (e == "variable") return E(P, Y, R("=>"), r, F);
			}
			var i = n ? W : U;
			return ee.hasOwnProperty(e) ? D(i) : e == "function" ? D(Z, i) : e == "class" || c && t == "interface" ? (T.marked = "keyword", D(I("form"), Ve, L)) : e == "keyword c" || e == "async" ? D(n ? V : B) : e == "(" ? D(I(")"), H, R(")"), L, i) : e == "operator" || e == "spread" ? D(n ? V : B) : e == "[" ? D(I("]"), Qe, L, i) : e == "{" ? ve(ge, "}", null, i) : e == "quasi" ? E(se, i) : e == "new" ? D(de(n)) : D();
		}
		function H(e) {
			return e.match(/[;\}\)\],]/) ? E() : E(B);
		}
		function U(e, t) {
			return e == "," ? D(H) : W(e, t, !1);
		}
		function W(e, t, n) {
			var r = n == 0 ? U : W, i = n == 0 ? B : V;
			if (e == "=>") return D(P, n ? ue : le, F);
			if (e == "operator") return /\+\+|--/.test(t) || c && t == "!" ? D(r) : c && t == "<" && T.stream.match(/^([^<>]|<[^<>]*>)*>\s*\(/, !1) ? D(I(">"), K(q, ">"), L, r) : t == "?" ? D(B, R(":"), i) : D(i);
			if (e == "quasi") return E(se, r);
			if (e != ";") {
				if (e == "(") return ve(V, ")", "call", r);
				if (e == ".") return D(he, r);
				if (e == "[") return D(I("]"), H, R("]"), L, r);
				if (c && t == "as") return T.marked = "keyword", D(q, r);
				if (e == "regexp") return T.state.lastType = T.marked = "operator", T.stream.backUp(T.stream.pos - T.stream.start - 1), D(i);
			}
		}
		function se(e, t) {
			return e == "quasi" ? t.slice(t.length - 2) == "${" ? D(B, ce) : D(se) : E();
		}
		function ce(e) {
			if (e == "}") return T.marked = "string-2", T.state.tokenize = b, D(se);
		}
		function le(e) {
			return S(T.stream, T.state), E(e == "{" ? z : B);
		}
		function ue(e) {
			return S(T.stream, T.state), E(e == "{" ? z : V);
		}
		function de(e) {
			return function(t) {
				return t == "." ? D(e ? pe : fe) : t == "variable" && c ? D(Oe, e ? W : U) : E(e ? V : B);
			};
		}
		function fe(e, t) {
			if (t == "target") return T.marked = "keyword", D(U);
		}
		function pe(e, t) {
			if (t == "target") return T.marked = "keyword", D(W);
		}
		function me(e) {
			return e == ":" ? D(L, z) : E(U, R(";"), L);
		}
		function he(e) {
			if (e == "variable") return T.marked = "property", D();
		}
		function ge(e, t) {
			if (e == "async") return T.marked = "property", D(ge);
			if (e == "variable" || T.style == "keyword") {
				if (T.marked = "property", t == "get" || t == "set") return D(_e);
				var n;
				return c && T.state.fatArrowAt == T.stream.start && (n = T.stream.match(/^\s*:\s*/, !1)) && (T.state.fatArrowAt = T.stream.pos + n[0].length), D(G);
			}
			if (e == "number" || e == "string") return T.marked = a ? "property" : T.style + " property", D(G);
			if (e == "jsonld-keyword") return D(G);
			if (c && j(t)) return T.marked = "keyword", D(ge);
			if (e == "[") return D(B, be, R("]"), G);
			if (e == "spread") return D(V, G);
			if (t == "*") return T.marked = "keyword", D(ge);
			if (e == ":") return E(G);
		}
		function _e(e) {
			return e == "variable" ? (T.marked = "property", D(Z)) : E(G);
		}
		function G(e) {
			if (e == ":") return D(V);
			if (e == "(") return E(Z);
		}
		function K(e, t, n) {
			function r(i, a) {
				if (n ? n.indexOf(i) > -1 : i == ",") {
					var o = T.state.lexical;
					return o.info == "call" && (o.pos = (o.pos || 0) + 1), D(function(n, r) {
						return n == t || r == t ? E() : E(e);
					}, r);
				}
				return i == t || a == t ? D() : n && n.indexOf(";") > -1 ? E(e) : D(R(t));
			}
			return function(n, i) {
				return n == t || i == t ? D() : E(e, r);
			};
		}
		function ve(e, t, n) {
			for (var r = 3; r < arguments.length; r++) T.cc.push(arguments[r]);
			return D(I(t, n), K(e, t), L);
		}
		function ye(e) {
			return e == "}" ? D() : E(z, ye);
		}
		function be(e, t) {
			if (c) {
				if (e == ":") return D(q);
				if (t == "?") return D(be);
			}
		}
		function xe(e, t) {
			if (c && (e == ":" || t == "in")) return D(q);
		}
		function Se(e) {
			if (c && e == ":") return T.stream.match(/^\s*\w+\s+is\b/, !1) ? D(B, Ce, q) : D(q);
		}
		function Ce(e, t) {
			if (t == "is") return T.marked = "keyword", D();
		}
		function q(e, t) {
			if (t == "keyof" || t == "typeof" || t == "infer" || t == "readonly") return T.marked = "keyword", D(t == "typeof" ? V : q);
			if (e == "variable" || t == "void") return T.marked = "type", D(J);
			if (t == "|" || t == "&") return D(q);
			if (e == "string" || e == "number" || e == "atom") return D(J);
			if (e == "[") return D(I("]"), K(q, "]", ","), L, J);
			if (e == "{") return D(I("}"), Te, L, J);
			if (e == "(") return D(K(De, ")"), we, J);
			if (e == "<") return D(K(q, ">"), q);
		}
		function we(e) {
			if (e == "=>") return D(q);
		}
		function Te(e) {
			return e.match(/[\}\)\]]/) ? D() : e == "," || e == ";" ? D(Te) : E(Ee, Te);
		}
		function Ee(e, t) {
			if (e == "variable" || T.style == "keyword") return T.marked = "property", D(Ee);
			if (t == "?" || e == "number" || e == "string") return D(Ee);
			if (e == ":") return D(q);
			if (e == "[") return D(R("variable"), xe, R("]"), Ee);
			if (e == "(") return E(ze, Ee);
			if (!e.match(/[;\}\)\],]/)) return D();
		}
		function De(e, t) {
			return e == "variable" && T.stream.match(/^\s*[?:]/, !1) || t == "?" ? D(De) : e == ":" ? D(q) : e == "spread" ? D(De) : E(q);
		}
		function J(e, t) {
			if (t == "<") return D(I(">"), K(q, ">"), L, J);
			if (t == "|" || e == "." || t == "&") return D(q);
			if (e == "[") return D(q, R("]"), J);
			if (t == "extends" || t == "implements") return T.marked = "keyword", D(q);
			if (t == "?") return D(q, R(":"), q);
		}
		function Oe(e, t) {
			if (t == "<") return D(I(">"), K(q, ">"), L, J);
		}
		function ke() {
			return E(q, Ae);
		}
		function Ae(e, t) {
			if (t == "=") return D(q);
		}
		function je(e, t) {
			return t == "enum" ? (T.marked = "keyword", D($e)) : E(Y, be, X, Pe);
		}
		function Y(e, t) {
			if (c && j(t)) return T.marked = "keyword", D(Y);
			if (e == "variable") return k(t), D();
			if (e == "spread") return D(Y);
			if (e == "[") return ve(Ne, "]");
			if (e == "{") return ve(Me, "}");
		}
		function Me(e, t) {
			return e == "variable" && !T.stream.match(/^\s*:/, !1) ? (k(t), D(X)) : (e == "variable" && (T.marked = "property"), e == "spread" ? D(Y) : e == "}" ? E() : e == "[" ? D(B, R("]"), R(":"), Me) : D(R(":"), Y, X));
		}
		function Ne() {
			return E(Y, X);
		}
		function X(e, t) {
			if (t == "=") return D(V);
		}
		function Pe(e) {
			if (e == ",") return D(je);
		}
		function Fe(e, t) {
			if (e == "keyword b" && t == "else") return D(I("form", "else"), z, L);
		}
		function Ie(e, t) {
			if (t == "await") return D(Ie);
			if (e == "(") return D(I(")"), Le, L);
		}
		function Le(e) {
			return e == "var" ? D(je, Re) : e == "variable" ? D(Re) : E(Re);
		}
		function Re(e, t) {
			return e == ")" ? D() : e == ";" ? D(Re) : t == "in" || t == "of" ? (T.marked = "keyword", D(B, Re)) : E(B, Re);
		}
		function Z(e, t) {
			if (t == "*") return T.marked = "keyword", D(Z);
			if (e == "variable") return k(t), D(Z);
			if (e == "(") return D(P, I(")"), K(Q, ")"), L, Se, z, F);
			if (c && t == "<") return D(I(">"), K(ke, ">"), L, Z);
		}
		function ze(e, t) {
			if (t == "*") return T.marked = "keyword", D(ze);
			if (e == "variable") return k(t), D(ze);
			if (e == "(") return D(P, I(")"), K(Q, ")"), L, Se, F);
			if (c && t == "<") return D(I(">"), K(ke, ">"), L, ze);
		}
		function Be(e, t) {
			if (e == "keyword" || e == "variable") return T.marked = "type", D(Be);
			if (t == "<") return D(I(">"), K(ke, ">"), L);
		}
		function Q(e, t) {
			return t == "@" && D(B, Q), e == "spread" ? D(Q) : c && j(t) ? (T.marked = "keyword", D(Q)) : c && e == "this" ? D(be, X) : E(Y, be, X);
		}
		function Ve(e, t) {
			return e == "variable" ? He(e, t) : Ue(e, t);
		}
		function He(e, t) {
			if (e == "variable") return k(t), D(Ue);
		}
		function Ue(e, t) {
			if (t == "<") return D(I(">"), K(ke, ">"), L, Ue);
			if (t == "extends" || t == "implements" || c && e == ",") return t == "implements" && (T.marked = "keyword"), D(c ? q : B, Ue);
			if (e == "{") return D(I("}"), $, L);
		}
		function $(e, t) {
			if (e == "async" || e == "variable" && (t == "static" || t == "get" || t == "set" || c && j(t)) && T.stream.match(/^\s+[\w$\xa1-\uffff]/, !1)) return T.marked = "keyword", D($);
			if (e == "variable" || T.style == "keyword") return T.marked = "property", D(We, $);
			if (e == "number" || e == "string") return D(We, $);
			if (e == "[") return D(B, be, R("]"), We, $);
			if (t == "*") return T.marked = "keyword", D($);
			if (c && e == "(") return E(ze, $);
			if (e == ";" || e == ",") return D($);
			if (e == "}") return D();
			if (t == "@") return D(B, $);
		}
		function We(e, t) {
			if (t == "?") return D(We);
			if (e == ":") return D(q, X);
			if (t == "=") return D(V);
			var n = T.state.lexical.prev;
			return E(n && n.info == "interface" ? ze : Z);
		}
		function Ge(e, t) {
			return t == "*" ? (T.marked = "keyword", D(Ze, R(";"))) : t == "default" ? (T.marked = "keyword", D(B, R(";"))) : e == "{" ? D(K(Ke, "}"), Ze, R(";")) : E(z);
		}
		function Ke(e, t) {
			if (t == "as") return T.marked = "keyword", D(R("variable"));
			if (e == "variable") return E(V, Ke);
		}
		function qe(e) {
			return e == "string" ? D() : e == "(" ? E(B) : e == "." ? E(U) : E(Je, Ye, Ze);
		}
		function Je(e, t) {
			return e == "{" ? ve(Je, "}") : (e == "variable" && k(t), t == "*" && (T.marked = "keyword"), D(Xe));
		}
		function Ye(e) {
			if (e == ",") return D(Je, Ye);
		}
		function Xe(e, t) {
			if (t == "as") return T.marked = "keyword", D(Je);
		}
		function Ze(e, t) {
			if (t == "from") return T.marked = "keyword", D(B);
		}
		function Qe(e) {
			return e == "]" ? D() : E(K(V, "]"));
		}
		function $e() {
			return E(I("form"), Y, R("{"), I("}"), K(et, "}"), L, L);
		}
		function et() {
			return E(Y, X);
		}
		function tt(e, t) {
			return e.lastType == "operator" || e.lastType == "," || d.test(t.charAt(0)) || /[,.]/.test(t.charAt(0));
		}
		function nt(e, t, n) {
			return t.tokenize == _ && /^(?:operator|sof|keyword [bcd]|case|new|export|default|spread|[\[{}\(,;:]|=>)$/.test(t.lastType) || t.lastType == "quasi" && /\{\s*$/.test(e.string.slice(0, e.pos - (n || 0)));
		}
		return {
			startState: function(e) {
				var t = {
					tokenize: _,
					lastType: "sof",
					cc: [],
					lexical: new C((e || 0) - r, 0, "block", !1),
					localVars: n.localVars,
					context: n.localVars && new M(null, null, !1),
					indented: e || 0
				};
				return n.globalVars && typeof n.globalVars == "object" && (t.globalVars = n.globalVars), t;
			},
			token: function(e, t) {
				if (e.sol() && (t.lexical.hasOwnProperty("align") || (t.lexical.align = !1), t.indented = e.indentation(), S(e, t)), t.tokenize != y && e.eatSpace()) return null;
				var n = t.tokenize(e, t);
				return m == "comment" ? n : (t.lastType = m == "operator" && (h == "++" || h == "--") ? "incdec" : m, w(t, n, m, h, e));
			},
			indent: function(t, a) {
				if (t.tokenize == y || t.tokenize == b) return e.Pass;
				if (t.tokenize != _) return 0;
				var o = a && a.charAt(0), s = t.lexical, c;
				if (!/^\s*else\b/.test(a)) for (var l = t.cc.length - 1; l >= 0; --l) {
					var u = t.cc[l];
					if (u == L) s = s.prev;
					else if (u != Fe && u != F) break;
				}
				for (; (s.type == "stat" || s.type == "form") && (o == "}" || (c = t.cc[t.cc.length - 1]) && (c == U || c == W) && !/^[,\.=+\-*:?[\(]/.test(a));) s = s.prev;
				i && s.type == ")" && s.prev.type == "stat" && (s = s.prev);
				var d = s.type, f = o == d;
				return d == "vardef" ? s.indented + (t.lastType == "operator" || t.lastType == "," ? s.info.length + 1 : 0) : d == "form" && o == "{" ? s.indented : d == "form" ? s.indented + r : d == "stat" ? s.indented + (tt(t, a) ? i || r : 0) : s.info == "switch" && !f && n.doubleIndentSwitch != 0 ? s.indented + (/^(?:case|default)\b/.test(a) ? r : 2 * r) : s.align ? s.column + +!f : s.indented + (f ? 0 : r);
			},
			electricInput: /^\s*(?:case .*?:|default:|\{|\})$/,
			blockCommentStart: o ? null : "/*",
			blockCommentEnd: o ? null : "*/",
			blockCommentContinue: o ? null : " * ",
			lineComment: o ? null : "//",
			fold: "brace",
			closeBrackets: "()[]{}''\"\"``",
			helperType: o ? "json" : "javascript",
			jsonldMode: a,
			jsonMode: o,
			expressionAllowed: nt,
			skipExpression: function(e) {
				var t = e.cc[e.cc.length - 1];
				(t == B || t == V) && e.cc.pop();
			}
		};
	}), e.registerHelper("wordChars", "javascript", /[\w$]/), e.defineMIME("text/javascript", "javascript"), e.defineMIME("text/ecmascript", "javascript"), e.defineMIME("application/javascript", "javascript"), e.defineMIME("application/x-javascript", "javascript"), e.defineMIME("application/ecmascript", "javascript"), e.defineMIME("application/json", {
		name: "javascript",
		json: !0
	}), e.defineMIME("application/x-json", {
		name: "javascript",
		json: !0
	}), e.defineMIME("application/manifest+json", {
		name: "javascript",
		json: !0
	}), e.defineMIME("application/ld+json", {
		name: "javascript",
		jsonld: !0
	}), e.defineMIME("text/typescript", {
		name: "javascript",
		typescript: !0
	}), e.defineMIME("application/typescript", {
		name: "javascript",
		typescript: !0
	});
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/entrypoints/formatter_worker/FormattedContentBuilder.ts
var m = class {
	indentString;
	#e = 0;
	#t = [];
	#n = 0;
	#r = 0;
	#i = 0;
	#a = 0;
	#o = !0;
	#s = !1;
	#c = 0;
	#l = /* @__PURE__ */ new Map();
	#u = /[$\u200C\u200D\p{ID_Continue}]/u;
	mapping = {
		original: [0],
		formatted: [0]
	};
	constructor(e) {
		this.indentString = e;
	}
	setEnforceSpaceBetweenWords(e) {
		let t = this.#o;
		return this.#o = e, t;
	}
	addToken(e, t) {
		if (this.#o && !this.#c && !this.#s) {
			let t = this.#t.at(-1)?.at(-1) ?? "";
			this.#u.test(t) && this.#u.test(e) && this.addSoftSpace();
		}
		this.#d(), this.#m(t), this.#p(e);
	}
	addSoftSpace() {
		this.#c || (this.#s = !0);
	}
	addHardSpace() {
		this.#s = !1, ++this.#c;
	}
	addNewLine(e) {
		this.#n && (e ? ++this.#a : this.#a = this.#a || 1);
	}
	increaseNestingLevel() {
		this.#i += 1;
	}
	decreaseNestingLevel() {
		this.#i > 0 && --this.#i;
	}
	content() {
		return this.#t.join("") + (this.#a ? "\n" : "");
	}
	#d() {
		if (this.#a) {
			for (let e = 0; e < this.#a; ++e) this.#p("\n");
			this.#p(this.#f());
		} else this.#s && this.#p(" ");
		if (this.#c) for (let e = 0; e < this.#c; ++e) this.#p(" ");
		this.#a = 0, this.#s = !1, this.#c = 0;
	}
	#f() {
		let e = this.#l.get(this.#i);
		if (e) return e;
		let t = "";
		for (let e = 0; e < this.#i; ++e) t += this.indentString;
		return this.#i <= 20 && this.#l.set(this.#i, t), t;
	}
	#p(e) {
		this.#t.push(e), this.#n += e.length;
	}
	#m(e) {
		e - this.#e !== this.#n - this.#r && (this.mapping.original.push(e), this.#e = e, this.mapping.formatted.push(this.#n), this.#r = this.#n);
	}
}, h = class {
	#e;
	#t;
	#n;
	#r;
	#i = 0;
	constructor(e, t) {
		this.#r = t;
		let n = a(e);
		this.#e = new i(n), this.#t = 0, this.#n = 0;
	}
	static punctuator(e, t) {
		return e.type !== f.num && e.type !== f.regexp && e.type !== f.string && e.type !== f.name && !e.type.keyword && (!t || e.type.label.length === 1 && t.indexOf(e.type.label) !== -1);
	}
	static keyword(e, t) {
		return !!e.type.keyword && e.type !== f._true && e.type !== f._false && e.type !== f._null && (!t || e.type.keyword === t);
	}
	static identifier(e, t) {
		return e.type === f.name && (!t || e.value === t);
	}
	static arrowIdentifier(e, t) {
		return e.type === f.arrow && (!t || e.type.label === t);
	}
	static lineComment(e) {
		return e.type === "Line";
	}
	static blockComment(e) {
		return e.type === "Block";
	}
	nextToken() {
		let e = this.#r[this.#i++];
		return !e || e.type === f.eof ? null : (this.#e.advance(e.start), this.#t = this.#e.lineNumber(), this.#e.advance(e.end), this.#n = this.#e.lineNumber(), e);
	}
	peekToken() {
		let e = this.#r[this.#i];
		return !e || e.type === f.eof ? null : e;
	}
	tokenLineStart() {
		return this.#t;
	}
	tokenLineEnd() {
		return this.#n;
	}
}, g = "latest", _ = class {
	#e;
	#t;
	constructor(e, t) {
		this.#e = e, this.#t = t;
	}
	walk(e) {
		this.#n(e, null);
	}
	#n(e, t) {
		if (!e) return;
		e.parent = t, this.#e.call(null, e);
		let n = v[e.type];
		if (!n) {
			console.error("Walk order not defined for " + e.type);
			return;
		}
		if (e.type === "TemplateLiteral") {
			let t = e, n = t.expressions.length;
			for (let e = 0; e < n; ++e) this.#n(t.quasis[e], t), this.#n(t.expressions[e], t);
			this.#n(t.quasis[n], t);
		} else for (let t = 0; t < n.length; ++t) {
			let r = e[n[t]];
			Array.isArray(r) ? this.#r(r, e) : this.#n(r, e);
		}
		this.#t.call(null, e);
	}
	#r(e, t) {
		for (let n = 0; n < e.length; ++n) this.#n(e[n], t);
	}
}, v = {
	AwaitExpression: ["argument"],
	ArrayExpression: ["elements"],
	ArrayPattern: ["elements"],
	ArrowFunctionExpression: ["params", "body"],
	AssignmentExpression: ["left", "right"],
	AssignmentPattern: ["left", "right"],
	BinaryExpression: ["left", "right"],
	BlockStatement: ["body"],
	BreakStatement: ["label"],
	CallExpression: ["callee", "arguments"],
	CatchClause: ["param", "body"],
	ClassBody: ["body"],
	ClassDeclaration: [
		"id",
		"superClass",
		"body"
	],
	ClassExpression: [
		"id",
		"superClass",
		"body"
	],
	ChainExpression: ["expression"],
	ConditionalExpression: [
		"test",
		"consequent",
		"alternate"
	],
	ContinueStatement: ["label"],
	DebuggerStatement: [],
	DoWhileStatement: ["body", "test"],
	EmptyStatement: [],
	ExpressionStatement: ["expression"],
	ForInStatement: [
		"left",
		"right",
		"body"
	],
	ForOfStatement: [
		"left",
		"right",
		"body"
	],
	ForStatement: [
		"init",
		"test",
		"update",
		"body"
	],
	FunctionDeclaration: [
		"id",
		"params",
		"body"
	],
	FunctionExpression: [
		"id",
		"params",
		"body"
	],
	Identifier: [],
	ImportDeclaration: [
		"specifiers",
		"source",
		"attributes"
	],
	ImportAttribute: ["key", "value"],
	ImportDefaultSpecifier: ["local"],
	ImportNamespaceSpecifier: ["local"],
	ImportSpecifier: ["imported", "local"],
	ImportExpression: ["source"],
	ExportAllDeclaration: ["source"],
	ExportDefaultDeclaration: ["declaration"],
	ExportNamedDeclaration: [
		"specifiers",
		"source",
		"declaration"
	],
	ExportSpecifier: ["exported", "local"],
	IfStatement: [
		"test",
		"consequent",
		"alternate"
	],
	LabeledStatement: ["label", "body"],
	Literal: [],
	LogicalExpression: ["left", "right"],
	MemberExpression: ["object", "property"],
	MetaProperty: ["meta", "property"],
	MethodDefinition: ["key", "value"],
	NewExpression: ["callee", "arguments"],
	ObjectExpression: ["properties"],
	ObjectPattern: ["properties"],
	ParenthesizedExpression: ["expression"],
	PrivateIdentifier: [],
	PropertyDefinition: ["key", "value"],
	Program: ["body"],
	Property: ["key", "value"],
	RestElement: ["argument"],
	ReturnStatement: ["argument"],
	SequenceExpression: ["expressions"],
	SpreadElement: ["argument"],
	StaticBlock: ["body"],
	Super: [],
	SwitchCase: ["test", "consequent"],
	SwitchStatement: ["discriminant", "cases"],
	TaggedTemplateExpression: ["tag", "quasi"],
	TemplateElement: [],
	TemplateLiteral: ["quasis", "expressions"],
	ThisExpression: [],
	ThrowStatement: ["argument"],
	TryStatement: [
		"block",
		"handler",
		"finalizer"
	],
	UnaryExpression: ["argument"],
	UpdateExpression: ["argument"],
	VariableDeclaration: ["declarations"],
	VariableDeclarator: ["id", "init"],
	WhileStatement: ["test", "body"],
	WithStatement: ["object", "body"],
	YieldExpression: ["argument"]
}, y = class {
	#e;
	#t;
	#n;
	#r;
	#i;
	#a;
	constructor(e) {
		this.#e = e;
	}
	format(e, t, n, r) {
		this.#r = n, this.#a = r, this.#n = e.substring(this.#r, this.#a), this.#i = 0;
		let i = [], a = p(this.#n, {
			ranges: !1,
			preserveParens: !0,
			allowAwaitOutsideFunction: !0,
			allowImportExportEverywhere: !0,
			ecmaVersion: g,
			allowHashBang: !0,
			onToken: i,
			onComment: i
		});
		this.#t = new h(this.#n, i), new _(this.#s.bind(this), this.#c.bind(this)).walk(a);
	}
	#o(e, t) {
		for (let n = 0; n < t.length; ++n) t[n] === "s" ? this.#e.addSoftSpace() : t[n] === "S" ? this.#e.addHardSpace() : t[n] === "n" ? this.#e.addNewLine() : t[n] === ">" ? this.#e.increaseNestingLevel() : t[n] === "<" ? this.#e.decreaseNestingLevel() : t[n] === "t" && (this.#t.tokenLineStart() - this.#i > 1 && this.#e.addNewLine(!0), this.#i = this.#t.tokenLineEnd(), e && this.#e.addToken(this.#n.substring(e.start, e.end), this.#r + e.start));
	}
	#s(e) {
		if (!e.parent) return;
		e.type === "TemplateLiteral" && this.#e.setEnforceSpaceBetweenWords(!1);
		let t;
		for (; (t = this.#t.peekToken()) && t.start < e.start;) {
			let t = this.#t.nextToken(), n = this.#u(e.parent, t);
			this.#o(t, n);
		}
	}
	#c(e) {
		let t = this.#e.setEnforceSpaceBetweenWords(e.type !== "TemplateElement"), n;
		for (; (n = this.#t.peekToken()) && n.start < e.end;) {
			let t = this.#t.nextToken(), n = this.#u(e, t);
			this.#o(t, n);
		}
		this.#o(null, this.#d(e)), this.#e.setEnforceSpaceBetweenWords(t || e.type === "TemplateLiteral");
	}
	#l(e) {
		let t = e.parent;
		if (!t) return !1;
		if (t.type === "ForStatement") {
			let n = t;
			return e === n.init || e === n.test || e === n.update;
		}
		if (t.type === "ForInStatement" || t.type === "ForOfStatement") {
			let n = t;
			return e === n.left || e === n.right;
		}
		return !1;
	}
	#u(e, t) {
		let n = h;
		if (n.lineComment(t) || n.blockComment(t)) return "tn";
		let r = t, i = e.type;
		if (i === "ContinueStatement" || i === "BreakStatement") return e.label && n.keyword(r) ? "ts" : "t";
		if (i === "Identifier" || i === "PrivateIdentifier") return "t";
		if (i === "ReturnStatement" || i === "AwaitExpression") return n.punctuator(r, ";") ? "t" : e.argument ? "ts" : "t";
		if (i === "Property" || i === "ImportAttribute") return n.punctuator(r, ":") ? "ts" : "t";
		if (i === "ArrayExpression") return n.punctuator(r, ",") ? "ts" : "t";
		if (i === "LabeledStatement") {
			if (n.punctuator(r, ":")) return "ts";
		} else if (i === "LogicalExpression" || i === "AssignmentExpression" || i === "BinaryExpression") {
			if (n.punctuator(r) && !n.punctuator(r, "()")) return "sts";
		} else if (i === "ConditionalExpression") {
			if (n.punctuator(r, "?:")) return "sts";
		} else if (i === "VariableDeclarator") {
			if (n.punctuator(r, "=")) return "sts";
		} else if (i === "ObjectPattern") {
			if (e.parent?.type === "VariableDeclarator" && n.punctuator(r, "{")) return "st";
			if (n.punctuator(r, ",")) return "ts";
		} else if (i === "FunctionDeclaration") {
			if (n.punctuator(r, ",)")) return "ts";
		} else if (i === "FunctionExpression") {
			if (n.punctuator(r, ",)")) return "ts";
			if (n.keyword(r, "function")) return e.id ? "ts" : "t";
		} else if (i === "ArrowFunctionExpression") {
			if (n.punctuator(r, ",)")) return "ts";
			if (n.punctuator(r, "(")) return "st";
			if (n.arrowIdentifier(r, "=>")) return "sts";
		} else if (i === "WithStatement") {
			if (n.punctuator(r, ")")) return e.body?.type === "BlockStatement" ? "ts" : "tn>";
		} else if (i === "SwitchStatement") {
			if (n.punctuator(r, "{")) return "tn>";
			if (n.punctuator(r, "}")) return "n<tn";
			if (n.punctuator(r, ")")) return "ts";
		} else if (i === "SwitchCase") {
			if (n.keyword(r, "case")) return "n<ts";
			if (n.keyword(r, "default")) return "n<t";
			if (n.punctuator(r, ":")) return "tn>";
		} else if (i === "VariableDeclaration") {
			if (n.punctuator(r, ",")) {
				let t = !0, n = e.declarations;
				for (let e = 0; e < n.length; ++e) t &&= !!n[e].init;
				return !this.#l(e) && t ? "nSSts" : "ts";
			}
		} else if (i === "PropertyDefinition") {
			if (n.punctuator(r, "=")) return "sts";
			if (n.punctuator(r, ";")) return "tn";
		} else if (i === "BlockStatement") {
			if (n.punctuator(r, "{")) return e.body.length ? "tn>" : "t";
			if (n.punctuator(r, "}")) return e.body.length ? "n<t" : "t";
		} else if (i === "CatchClause") {
			if (n.punctuator(r, ")")) return "ts";
		} else if (i === "ObjectExpression") {
			if (!e.properties.length) return "t";
			if (n.punctuator(r, "{")) return "tn>";
			if (n.punctuator(r, "}")) return "n<t";
			if (n.punctuator(r, ",")) return "tn";
		} else if (i === "IfStatement") {
			if (n.punctuator(r, ")")) return e.consequent?.type === "BlockStatement" ? "ts" : "tn>";
			if (n.keyword(r, "else")) {
				let t = e.consequent?.type === "BlockStatement" ? "st" : "n<t", n = "n>";
				return e.alternate && (e.alternate.type === "BlockStatement" || e.alternate.type === "IfStatement") && (n = "s"), t + n;
			}
		} else if (i === "CallExpression") {
			if (n.punctuator(r, ",")) return "ts";
		} else if (i === "SequenceExpression" && n.punctuator(r, ",")) return e.parent?.type === "SwitchCase" ? "ts" : "tn";
		else if (i === "ForStatement" || i === "ForOfStatement" || i === "ForInStatement") {
			if (n.punctuator(r, ";")) return "ts";
			if (n.keyword(r, "in") || n.identifier(r, "of")) return "sts";
			if (n.punctuator(r, ")")) return e.body?.type === "BlockStatement" ? "ts" : "tn>";
		} else if (i === "WhileStatement") {
			if (n.punctuator(r, ")")) return e.body?.type === "BlockStatement" ? "ts" : "tn>";
		} else if (i === "DoWhileStatement") {
			let t = e.body?.type === "BlockStatement";
			if (n.keyword(r, "do")) return t ? "ts" : "tn>";
			if (n.keyword(r, "while")) return t ? "sts" : "n<ts";
			if (n.punctuator(r, ";")) return "tn";
		} else if (i === "ClassBody") return n.punctuator(r, "{") ? "stn>" : n.punctuator(r, "}") ? "<ntn" : "t";
		else if (i === "YieldExpression") return "t";
		else if (i === "Super") return "t";
		else if (i === "ImportExpression") return "t";
		else if (i === "ExportAllDeclaration") return n.punctuator(r, "*") ? "sts" : "t";
		else if (i === "ExportNamedDeclaration" || i === "ImportDeclaration") return n.punctuator(r, "{") ? "st" : n.punctuator(r, ",") ? "ts" : n.punctuator(r, "}") ? e.attributes.length > 0 ? "t" : e.source ? "ts" : "t" : n.punctuator(r, "*") || n.keyword(r, "with") ? "sts" : "t";
		else if (i === "MemberExpression") return e.object.type === "Literal" && typeof e.object.value == "number" ? "st" : "t";
		return n.keyword(r) && !n.keyword(r, "this") ? "ts" : "t";
	}
	#d(e) {
		let t = e.type;
		if (t === "WithStatement") {
			if (e.body && e.body.type !== "BlockStatement") return "n<";
		} else if (t === "VariableDeclaration") {
			if (!this.#l(e)) return "n";
		} else if (t === "ForStatement" || t === "ForOfStatement" || t === "ForInStatement") {
			if (e.body && e.body.type !== "BlockStatement") return "n<";
		} else if (t === "BlockStatement") {
			if (e.parent?.type === "IfStatement") {
				let t = e.parent;
				if (t.alternate && t.consequent === e) return "";
			}
			return e.parent?.type === "FunctionExpression" && e.parent.parent?.type === "Property" || e.parent?.type === "FunctionExpression" && e.parent.parent?.type === "VariableDeclarator" || e.parent?.type === "FunctionExpression" && e.parent.parent?.type === "CallExpression" || e.parent?.type === "DoWhileStatement" ? "" : e.parent?.type === "TryStatement" && e.parent.block === e || e.parent?.type === "CatchClause" && e.parent.parent?.finalizer ? "s" : "n";
		} else if (t === "WhileStatement") {
			if (e.body && e.body.type !== "BlockStatement") return "n<";
		} else if (t === "IfStatement") {
			if (e.alternate) {
				if (e.alternate.type !== "BlockStatement" && e.alternate.type !== "IfStatement") return "<";
			} else if (e.consequent && e.consequent.type !== "BlockStatement") return "<";
		} else if (t === "BreakStatement" || t === "ContinueStatement" || t === "ThrowStatement" || t === "ReturnStatement" || t === "ExpressionStatement") return "n";
		else if (t === "ImportDeclaration" || t === "ExportAllDeclaration" || t === "ExportDefaultDeclaration" || t === "ExportNamedDeclaration") return "n";
		return "";
	}
}, b = class {
	builder;
	toOffset;
	fromOffset;
	lineEndings;
	lastLine;
	text;
	constructor(e) {
		this.builder = e, this.lastLine = -1;
	}
	format(e, t, n, r) {
		this.lineEndings = t, this.fromOffset = n, this.toOffset = r, this.lastLine = -1, this.text = e, ie("application/json")(e.substring(this.fromOffset, this.toOffset), this.tokenCallback.bind(this));
	}
	tokenCallback(e, t, n) {
		switch (e.charAt(0)) {
			case "{":
			case "[":
				this.text[n + 1] === "}" || this.text[n + 1] === "]" ? this.builder.addToken(e, n) : (this.builder.addToken(e, n), this.builder.addNewLine(), this.builder.increaseNestingLevel());
				break;
			case "}":
			case "]":
				this.text[n - 1] === "{" || this.text[n - 1] === "[" ? this.builder.addToken(e, n) : (this.builder.decreaseNestingLevel(), this.builder.addNewLine(), this.builder.addToken(e, n));
				break;
			case ":":
				this.builder.addToken(e, n), this.builder.addSoftSpace();
				break;
			case ",":
				this.builder.addToken(e, n), this.builder.addNewLine();
				break;
			case "":
			case " ":
			case "\n": break;
			default: this.builder.addToken(e, n);
		}
	}
}, x = class {
	#e;
	#t;
	#n;
	#r;
	#i;
	#a;
	#o;
	constructor(e) {
		this.#e = e, this.#t = new y(e), this.#n = new b(e), this.#r = new oe(e);
	}
	format(e, t) {
		this.#i = e, this.#a = t, this.#o = new te(e), this.#c(this.#o.document());
	}
	#s(e, t) {
		if (!this.#o) return;
		let n = this.#o.peekToken();
		for (; n && n.startOffset < t;) {
			let t = this.#o.nextToken();
			this.#p(e, t), n = this.#o.peekToken();
		}
	}
	#c(e) {
		if (!e.openTag || !e.closeTag) throw Error("Element is missing open or close tag");
		e.parent && this.#s(e.parent, e.openTag.startOffset), this.#l(e), this.#s(e, e.openTag.endOffset), this.#u(e);
		for (let t = 0; t < e.children.length; ++t) this.#c(e.children[t]);
		this.#s(e, e.closeTag.startOffset), this.#d(e), this.#s(e, e.closeTag.endOffset), this.#f(e);
	}
	#l(e) {
		this.#o && e.children.length && e !== this.#o.document() && this.#e.addNewLine();
	}
	#u(e) {
		this.#o && e.children.length && e !== this.#o.document() && (this.#e.increaseNestingLevel(), this.#e.addNewLine());
	}
	#d(e) {
		this.#o && e.children.length && e !== this.#o.document() && (this.#e.decreaseNestingLevel(), this.#e.addNewLine());
	}
	#f(e) {
		this.#e.addNewLine();
	}
	#p(e, t) {
		if (o(t.value)) return;
		if (C(t.type, "comment") || C(t.type, "meta")) {
			this.#e.addNewLine(), this.#e.addToken(t.value.trim(), t.startOffset), this.#e.addNewLine();
			return;
		}
		if (!e.openTag || !e.closeTag) return;
		let n = e.openTag.endOffset <= t.startOffset && t.startOffset < e.closeTag.startOffset;
		if (n && e.name === "style") {
			this.#e.addNewLine(), this.#e.increaseNestingLevel(), this.#r.format(this.#i || "", this.#a || [], t.startOffset, t.endOffset), this.#e.decreaseNestingLevel();
			return;
		}
		if (n && e.name === "script") {
			this.#e.addNewLine(), this.#e.increaseNestingLevel(), S(e) ? this.#t.format(this.#i || "", this.#a || [], t.startOffset, t.endOffset) : ee(e) ? this.#n.format(this.#i || "", this.#a || [], t.startOffset, t.endOffset) : (this.#e.addToken(t.value, t.startOffset), this.#e.addNewLine()), this.#e.decreaseNestingLevel();
			return;
		}
		!n && C(t.type, "attribute") && this.#e.addSoftSpace(), this.#e.addToken(t.value, t.startOffset);
	}
};
function S(e) {
	if (!e.openTag || !e.openTag.attributes.has("type")) return !0;
	let t = e.openTag.attributes.get("type");
	if (!t) return !0;
	t = t.toLowerCase();
	let n = /^(["\'])(.*)\1$/.exec(t.trim());
	return n && (t = n[2]), [
		"application/ecmascript",
		"application/javascript",
		"application/x-ecmascript",
		"application/x-javascript",
		"module",
		"text/ecmascript",
		"text/javascript",
		"text/javascript1.0",
		"text/javascript1.1",
		"text/javascript1.2",
		"text/javascript1.3",
		"text/javascript1.4",
		"text/javascript1.5",
		"text/jscript",
		"text/livescript",
		"text/x-ecmascript",
		"text/x-javascript"
	].includes(t.trim());
}
function ee(e) {
	if (!e.openTag) return !1;
	let t = e.openTag.attributes.get("type");
	if (!t) return !1;
	t = t.toLowerCase();
	let n = /^(["\'])(.*)\1$/.exec(t.trim());
	return n && (t = n[2]), /^application\/\w+\+json$/.exec(t.trim()) && (t = "application/json"), [
		"application/json",
		"importmap",
		"speculationrules"
	].includes(t.trim());
}
function C(e, t) {
	return e.has(t) || e.has(`xml-${t}`);
}
var te = class {
	#e = "Initial";
	#t;
	#n;
	#r = [];
	#i = 0;
	#a = /* @__PURE__ */ new Map();
	#o = "";
	#s = "";
	#c = !1;
	#l;
	#u;
	constructor(e) {
		this.#t = new O("document"), this.#t.openTag = new D("document", 0, 0, /* @__PURE__ */ new Map(), !0, !1), this.#t.closeTag = new D("document", e.length, e.length, /* @__PURE__ */ new Map(), !1, !1), this.#n = [this.#t], this.#d(e);
	}
	#d(e) {
		let t = ie("text/html"), n = 0, r = 0, i = null, a = (e) => {
			this.#r.push(e), this.#f(e);
			let t = this.#n[this.#n.length - 1];
			if (t && (t.name === "script" || t.name === "style") && t.openTag?.endOffset === r) return B;
		}, o = (e, t, o, s) => {
			o += n, s += n, r = s;
			let c = new E(e, t ? new Set(t.split(" ")) : /* @__PURE__ */ new Set(), o, s);
			if (i) {
				if (e === "/" && t === "attribute" && i.type.has("string")) c.startOffset = i.startOffset, c.value = `${i.value}${e}`, c.type = i.type;
				else if (e.startsWith("&") && t === "error" && i.type.size === 0 || t === null && i.type.has("error")) {
					i.endOffset = c.endOffset, i.value += e, i.type = c.type;
					return;
				} else if (a(i) === B) return B;
				i = null;
			}
			if (t === "string" || t === null) {
				i = c;
				return;
			}
			return a(c);
		};
		for (; n = r, t(e.substring(r), o), i &&= (a(i), null), !(r >= e.length);) {
			let t = this.#n[this.#n.length - 1];
			if (!t) break;
			for (;;) {
				if (r = e.indexOf("</", r), r === -1) {
					r = e.length;
					break;
				}
				if (e.substring(r + 2).toLowerCase().startsWith(t.name)) break;
				r += 2;
			}
			if (!t.openTag) break;
			let n = t.openTag.endOffset, i = r, a = e.substring(n, i);
			this.#r.push(new E(a, /* @__PURE__ */ new Set(), n, i));
		}
		for (; this.#n.length > 1;) {
			let t = this.#n[this.#n.length - 1];
			if (!t) break;
			this.#g(new D(t.name, e.length, e.length, /* @__PURE__ */ new Map(), !1, !1));
		}
	}
	#f(e) {
		let t = e.value, n = e.type;
		switch (this.#e) {
			case "Initial":
				C(n, "bracket") && (t === "<" || t === "</") && (this.#p(e), this.#e = "Tag");
				return;
			case "Tag":
				C(n, "tag") && !C(n, "bracket") ? this.#s = t.trim().toLowerCase() : C(n, "attribute") ? (this.#o = t.trim().toLowerCase(), this.#a.set(this.#o, ""), this.#e = "AttributeName") : C(n, "bracket") && (t === ">" || t === "/>") && (this.#m(e), this.#e = "Initial");
				return;
			case "AttributeName":
				!n.size && t === "=" ? this.#e = "AttributeValue" : C(n, "bracket") && (t === ">" || t === "/>") && (this.#m(e), this.#e = "Initial");
				return;
			case "AttributeValue":
				C(n, "string") ? (this.#a.set(this.#o, t), this.#e = "Tag") : C(n, "bracket") && (t === ">" || t === "/>") && (this.#m(e), this.#e = "Initial");
				return;
		}
	}
	#p(e) {
		this.#s = "", this.#l = e.startOffset, this.#u = null, this.#a = /* @__PURE__ */ new Map(), this.#o = "", this.#c = e.value === "<";
	}
	#m(e) {
		this.#u = e.endOffset;
		let t = e.value === "/>" || w.has(this.#s), n = new D(this.#s, this.#l || 0, this.#u, this.#a, this.#c, t);
		this.#h(n);
	}
	#h(e) {
		if (e.isOpenTag) {
			let t = this.#n[this.#n.length - 1];
			if (t) {
				let r = T.get(t.name);
				t !== this.#t && t.openTag?.selfClosingTag ? this.#g(n(t, t.openTag.endOffset)) : r?.has(e.name) && this.#g(n(t, e.startOffset)), this.#_(e);
			}
			return;
		}
		let t = this.#n[this.#n.length - 1];
		for (; this.#n.length > 1 && t && t.name !== e.name;) this.#g(n(t, e.startOffset)), t = this.#n[this.#n.length - 1];
		if (this.#n.length === 1) return;
		this.#g(e);
		function n(e, t) {
			return new D(e.name, t, t, /* @__PURE__ */ new Map(), !1, !1);
		}
	}
	#g(e) {
		let t = this.#n.pop();
		t && (t.closeTag = e);
	}
	#_(e) {
		let t = this.#n[this.#n.length - 1], n = new O(e.name);
		t && (n.parent = t, t.children.push(n)), n.openTag = e, this.#n.push(n);
	}
	peekToken() {
		return this.#i < this.#r.length ? this.#r[this.#i] : null;
	}
	nextToken() {
		return this.#r[this.#i++];
	}
	document() {
		return this.#t;
	}
}, w = /* @__PURE__ */ new Set([
	"area",
	"base",
	"br",
	"col",
	"command",
	"embed",
	"hr",
	"img",
	"input",
	"keygen",
	"link",
	"meta",
	"param",
	"source",
	"track",
	"wbr"
]), T = /* @__PURE__ */ new Map([
	["head", /* @__PURE__ */ new Set(["body"])],
	["li", /* @__PURE__ */ new Set(["li"])],
	["dt", /* @__PURE__ */ new Set(["dt", "dd"])],
	["dd", /* @__PURE__ */ new Set(["dt", "dd"])],
	["p", /* @__PURE__ */ new Set(/* @__PURE__ */ "address.article.aside.blockquote.div.dl.fieldset.footer.form.h1.h2.h3.h4.h5.h6.header.hgroup.hr.main.nav.ol.p.pre.section.table.ul".split("."))],
	["rb", /* @__PURE__ */ new Set([
		"rb",
		"rt",
		"rtc",
		"rp"
	])],
	["rt", /* @__PURE__ */ new Set([
		"rb",
		"rt",
		"rtc",
		"rp"
	])],
	["rtc", /* @__PURE__ */ new Set([
		"rb",
		"rtc",
		"rp"
	])],
	["rp", /* @__PURE__ */ new Set([
		"rb",
		"rt",
		"rtc",
		"rp"
	])],
	["optgroup", /* @__PURE__ */ new Set(["optgroup"])],
	["option", /* @__PURE__ */ new Set(["option", "optgroup"])],
	["colgroup", /* @__PURE__ */ new Set(["colgroup"])],
	["thead", /* @__PURE__ */ new Set(["tbody", "tfoot"])],
	["tbody", /* @__PURE__ */ new Set(["tbody", "tfoot"])],
	["tfoot", /* @__PURE__ */ new Set(["tbody"])],
	["tr", /* @__PURE__ */ new Set(["tr"])],
	["td", /* @__PURE__ */ new Set(["td", "th"])],
	["th", /* @__PURE__ */ new Set(["td", "th"])]
]), E = class {
	value;
	type;
	startOffset;
	endOffset;
	constructor(e, t, n, r) {
		this.value = e, this.type = t, this.startOffset = n, this.endOffset = r;
	}
}, D = class {
	name;
	startOffset;
	endOffset;
	attributes;
	isOpenTag;
	selfClosingTag;
	constructor(e, t, n, r, i, a) {
		this.name = e, this.startOffset = t, this.endOffset = n, this.attributes = r, this.isOpenTag = i, this.selfClosingTag = a;
	}
}, O = class {
	name;
	children = [];
	parent = null;
	openTag = null;
	closeTag = null;
	constructor(e) {
		this.name = e;
	}
}, k = class {
	builder;
	constructor(e) {
		this.builder = e;
	}
	format(e, t, n, r) {
		let i = e.substring(n, r);
		this.builder.addToken(i, n);
	}
};
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/entrypoints/formatter_worker/ScopeParser.ts
function A(e, t = "script") {
	let n = null;
	try {
		n = p(e, {
			ecmaVersion: g,
			allowAwaitOutsideFunction: !0,
			ranges: !1,
			sourceType: t
		});
	} catch {
		return null;
	}
	return new M(n, e).run();
}
var j = class {
	variables = /* @__PURE__ */ new Map();
	parent;
	start;
	end;
	kind;
	name;
	nameMappingLocations;
	children = [];
	constructor(e, t, n, r, i, a) {
		this.start = e, this.end = t, this.parent = n, this.kind = r, this.name = i, this.nameMappingLocations = a, n && n.children.push(this);
	}
	export() {
		let e = [];
		for (let t of this.variables) {
			let n = [];
			for (let e of t[1].uses) n.push(e.offset);
			e.push({
				name: t[0],
				kind: t[1].definitionKind,
				offsets: n
			});
		}
		let t = this.children.map((e) => e.export());
		return {
			start: this.start,
			end: this.end,
			variables: e,
			kind: this.kind,
			name: this.name,
			nameMappingLocations: this.nameMappingLocations,
			children: t
		};
	}
	addVariable(e, t, n, r) {
		let i = this.variables.get(e), a = {
			offset: t,
			scope: this,
			isShorthandAssignmentProperty: r
		};
		if (!i) {
			this.variables.set(e, {
				definitionKind: n,
				uses: [a]
			});
			return;
		}
		i.definitionKind === d.NONE && (i.definitionKind = n), i.uses.push(a);
	}
	findBinders(e) {
		let t = [], n = this;
		for (; n !== null;) {
			let r = n.variables.get(e);
			r && r.definitionKind !== d.NONE && t.push(r), n = n.parent;
		}
		return t;
	}
	#e(e, t) {
		let n = this.variables.get(e);
		if (!n) {
			this.variables.set(e, t);
			return;
		}
		n.uses.push(...t.uses), t.definitionKind === d.VAR ? (console.assert(n.definitionKind !== d.LET), n.definitionKind === d.NONE && (n.definitionKind = t.definitionKind)) : console.assert(t.definitionKind === d.NONE);
	}
	finalizeToParent(e) {
		if (!this.parent) throw console.error("Internal error: wrong nesting in scope analysis."), Error("Internal error");
		let t = [];
		for (let [n, r] of this.variables.entries()) (r.definitionKind === d.NONE || r.definitionKind === d.VAR && !e) && (this.parent.#e(n, r), t.push(n));
		t.forEach((e) => this.variables.delete(e));
	}
}, M = class {
	#e;
	#t = /* @__PURE__ */ new Set();
	#n;
	#r;
	#i;
	#a;
	#o = [];
	constructor(e, t) {
		this.#r = e, this.#i = t, this.#e = new j(e.start, e.end, null, s.GLOBAL), this.#n = this.#e;
	}
	run() {
		return this.#s(this.#r), this.#e;
	}
	#s(e) {
		if (e !== null) switch (e.type) {
			case "AwaitExpression":
				this.#s(e.argument);
				break;
			case "ArrayExpression":
				e.elements.forEach((e) => this.#s(e));
				break;
			case "ExpressionStatement":
				this.#s(e.expression);
				break;
			case "Program":
				console.assert(this.#n === this.#e), e.body.forEach((e) => this.#s(e)), console.assert(this.#n === this.#e);
				break;
			case "ArrayPattern":
				e.elements.forEach((e) => this.#s(e));
				break;
			case "ArrowFunctionExpression":
				this.#c(e.start, e.end, s.ARROW_FUNCTION, void 0, F(e, this.#i)), e.params.forEach(this.#d.bind(this, d.VAR, !1)), e.body.type === "BlockStatement" ? e.body.body.forEach(this.#s.bind(this)) : this.#s(e.body), this.#l(!0);
				break;
			case "AssignmentExpression":
			case "AssignmentPattern":
			case "BinaryExpression":
			case "LogicalExpression":
				this.#s(e.left), this.#s(e.right);
				break;
			case "BlockStatement":
				this.#c(e.start, e.end, s.BLOCK), e.body.forEach(this.#s.bind(this)), this.#l(!1);
				break;
			case "CallExpression":
				this.#s(e.callee), e.arguments.forEach(this.#s.bind(this));
				break;
			case "VariableDeclaration": {
				let t = e.kind === "var" ? d.VAR : d.LET;
				e.declarations.forEach(this.#f.bind(this, t));
				break;
			}
			case "CatchClause":
				this.#c(e.start, e.end, s.BLOCK), this.#d(d.LET, !1, e.param), this.#s(e.body), this.#l(!1);
				break;
			case "ClassBody":
				e.body.forEach(this.#s.bind(this));
				break;
			case "ClassDeclaration":
				this.#d(d.LET, !1, e.id), this.#s(e.superClass ?? null), this.#s(e.body);
				break;
			case "ClassExpression":
				this.#s(e.superClass ?? null), this.#s(e.body);
				break;
			case "ChainExpression":
				this.#s(e.expression);
				break;
			case "ConditionalExpression":
				this.#s(e.test), this.#s(e.consequent), this.#s(e.alternate);
				break;
			case "DoWhileStatement":
				this.#s(e.body), this.#s(e.test);
				break;
			case "ForInStatement":
			case "ForOfStatement":
				this.#c(e.start, e.end, s.BLOCK), this.#s(e.left), this.#s(e.right), this.#s(e.body), this.#l(!1);
				break;
			case "ForStatement":
				this.#c(e.start, e.end, s.BLOCK), this.#s(e.init ?? null), this.#s(e.test ?? null), this.#s(e.update ?? null), this.#s(e.body), this.#l(!1);
				break;
			case "FunctionDeclaration":
				this.#d(d.VAR, !1, e.id), this.#c(e.id?.end ?? e.start, e.end, s.FUNCTION, e.id.name, N(e, this.#i)), this.#u("this", e.start, d.FIXED), this.#u("arguments", e.start, d.FIXED), e.params.forEach(this.#d.bind(this, d.LET, !1)), e.body.body.forEach(this.#s.bind(this)), this.#l(!0);
				break;
			case "FunctionExpression":
				this.#c(e.id?.end ?? e.start, e.end, s.FUNCTION, this.#a ?? e.id?.name, [...this.#o, ...ne(e, this.#i)]), this.#o = [], this.#a = void 0, this.#u("this", e.start, d.FIXED), this.#u("arguments", e.start, d.FIXED), e.params.forEach(this.#d.bind(this, d.LET, !1)), e.body.body.forEach(this.#s.bind(this)), this.#l(!0);
				break;
			case "Identifier":
				this.#u(e.name, e.start);
				break;
			case "IfStatement":
				this.#s(e.test), this.#s(e.consequent), this.#s(e.alternate ?? null);
				break;
			case "LabeledStatement":
				this.#s(e.body);
				break;
			case "MetaProperty": break;
			case "MethodDefinition":
				e.computed ? this.#s(e.key) : (this.#o = P(e), this.#a = re(e)), this.#s(e.value);
				break;
			case "NewExpression":
				this.#s(e.callee), e.arguments.forEach(this.#s.bind(this));
				break;
			case "MemberExpression":
				this.#s(e.object), e.computed && this.#s(e.property);
				break;
			case "ObjectExpression":
				e.properties.forEach(this.#s.bind(this));
				break;
			case "ObjectPattern":
				e.properties.forEach(this.#s.bind(this));
				break;
			case "PrivateIdentifier": break;
			case "PropertyDefinition":
				e.computed && this.#s(e.key), this.#s(e.value ?? null);
				break;
			case "Property":
				e.shorthand ? (console.assert(e.value.type === "Identifier"), console.assert(e.key.type === "Identifier"), console.assert(e.value.name === e.key.name), this.#u(e.value.name, e.value.start, d.NONE, !0)) : (e.computed ? this.#s(e.key) : e.value.type === "FunctionExpression" && (this.#o = P(e), this.#a = re(e)), this.#s(e.value));
				break;
			case "RestElement":
				this.#d(d.LET, !1, e.argument);
				break;
			case "ReturnStatement":
				this.#s(e.argument ?? null);
				break;
			case "SequenceExpression":
				e.expressions.forEach(this.#s.bind(this));
				break;
			case "SpreadElement":
				this.#s(e.argument);
				break;
			case "SwitchCase":
				this.#s(e.test ?? null), e.consequent.forEach(this.#s.bind(this));
				break;
			case "SwitchStatement":
				this.#s(e.discriminant), e.cases.forEach(this.#s.bind(this));
				break;
			case "TaggedTemplateExpression":
				this.#s(e.tag), this.#s(e.quasi);
				break;
			case "TemplateLiteral":
				e.expressions.forEach(this.#s.bind(this));
				break;
			case "ThisExpression":
				this.#u("this", e.start);
				break;
			case "ThrowStatement":
				this.#s(e.argument);
				break;
			case "TryStatement":
				this.#s(e.block), this.#s(e.handler ?? null), this.#s(e.finalizer ?? null);
				break;
			case "WithStatement":
				this.#s(e.object), this.#s(e.body);
				break;
			case "YieldExpression":
				this.#s(e.argument ?? null);
				break;
			case "UnaryExpression":
			case "UpdateExpression":
				this.#s(e.argument);
				break;
			case "WhileStatement":
				this.#s(e.test), this.#s(e.body);
				break;
			case "BreakStatement":
			case "ContinueStatement":
			case "DebuggerStatement":
			case "EmptyStatement":
			case "Literal":
			case "Super":
			case "TemplateElement": break;
			case "ImportDeclaration":
			case "ImportDefaultSpecifier":
			case "ImportNamespaceSpecifier":
			case "ImportSpecifier":
			case "ImportExpression":
			case "ExportAllDeclaration":
			case "ExportDefaultDeclaration":
			case "ExportNamedDeclaration":
			case "ExportSpecifier": break;
			case "VariableDeclarator": console.error("Should not encounter VariableDeclarator in general traversal.");
		}
	}
	getFreeVariables() {
		let e = /* @__PURE__ */ new Map();
		for (let [t, n] of this.#e.variables) n.definitionKind === d.NONE && e.set(t, n.uses);
		return e;
	}
	getAllNames() {
		return this.#t;
	}
	#c(e, t, n, r, i) {
		this.#n = new j(e, t, this.#n, n, r, i);
	}
	#l(e) {
		if (this.#n.parent === null) throw console.error("Internal error: wrong nesting in scope analysis."), Error("Internal error");
		this.#n.finalizeToParent(e), this.#n = this.#n.parent;
	}
	#u(e, t, n = d.NONE, r = !1) {
		this.#t.add(e), this.#n.addVariable(e, t, n, r);
	}
	#d(e, t, n) {
		if (n !== null) switch (n.type) {
			case "ArrayPattern":
				n.elements.forEach(this.#d.bind(this, e, !1));
				break;
			case "AssignmentPattern":
				this.#d(e, t, n.left), this.#s(n.right);
				break;
			case "Identifier":
				this.#u(n.name, n.start, e, t);
				break;
			case "MemberExpression":
				this.#s(n.object), n.computed && this.#s(n.property);
				break;
			case "ObjectPattern":
				n.properties.forEach(this.#d.bind(this, e, !1));
				break;
			case "Property":
				n.computed && this.#s(n.key), this.#d(e, n.shorthand, n.value);
				break;
			case "RestElement": this.#d(e, !1, n.argument);
		}
	}
	#f(e, t) {
		this.#d(e, !1, t.id), this.#s(t.init ?? null);
	}
};
function N(e, t) {
	let n = [e.id.start], r = e.params.length ? e.params[0].start : e.body.start, i = I(t, "(", e.id.end, r);
	return i >= 0 && n.push(i), n;
}
function ne(e, t) {
	let n = [];
	e.id && n.push(e.id.start);
	let r = I(t, "(", e.id ? e.id.end : e.start, e.params.length ? e.params[0].start : e.body.start);
	return r >= 0 && n.push(r), n;
}
function P(e) {
	return e.key.type === "Identifier" || e.key.type === "PrivateIdentifier" ? [e.key.start] : [];
}
function re(e) {
	if (e.key.type === "Identifier") return e.key.name;
	if (e.key.type === "PrivateIdentifier") return "#" + e.key.name;
}
function F(e, t) {
	let n = [], r = I(t, "(", e.async ? e.start + 5 : e.start, e.params.length ? e.params[0].start : e.body.start);
	r >= 0 && n.push(r);
	let i = I(t, "=", e.params.length ? e.params[e.params.length - 1].end : e.start, e.body.start);
	return i >= 0 && t[i + 1] === ">" && n.push(i), n;
}
function I(e, t, n, r) {
	for (let i = n; i < r; ++i) if (e[i] === t) return i;
	return -1;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/entrypoints/formatter_worker/Substitute.ts
function L(e, t) {
	return z(e, R(e, t));
}
function R(e, t) {
	let n = new M(p(e, {
		ecmaVersion: g,
		allowAwaitOutsideFunction: !0,
		allowImportExportEverywhere: !0,
		checkPrivateFields: !1,
		ranges: !1
	}), e);
	n.run();
	let r = n.getFreeVariables(), i = [], a = n.getAllNames();
	for (let e of t.values()) e && a.add(e);
	function o(e) {
		let t = 1;
		for (; a.has(`${e}_${t}`);) t++;
		let n = `${e}_${t}`;
		return a.add(n), n;
	}
	for (let [e, n] of t.entries()) {
		let t = r.get(e);
		if (!t) continue;
		if (n === null) throw Error(`Cannot substitute '${e}' as the underlying variable '${n}' is unavailable`);
		let a = [];
		for (let r of t) i.push({
			from: e,
			to: n,
			offset: r.offset,
			isShorthandAssignmentProperty: r.isShorthandAssignmentProperty
		}), a.push(...r.scope.findBinders(n));
		for (let e of a) {
			if (e.definitionKind === d.FIXED) throw Error(`Cannot avoid capture of '${n}'`);
			let t = o(n);
			for (let r of e.uses) i.push({
				from: n,
				to: t,
				offset: r.offset,
				isShorthandAssignmentProperty: r.isShorthandAssignmentProperty
			});
		}
	}
	return i.sort((e, t) => e.offset - t.offset), i;
}
function z(e, t) {
	let n = [], r = 0;
	for (let i of t) {
		n.push(e.slice(r, i.offset));
		let t = i.to;
		i.isShorthandAssignmentProperty && (t = `${i.from}: ${i.to}`), n.push(t), r = i.offset + i.from.length;
	}
	return n.push(e.slice(r)), n.join("");
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/entrypoints/formatter_worker/FormatterWorker.ts
function ie(e) {
	let t = CodeMirror.getMode({ indentUnit: 2 }, e), n = CodeMirror.startState(t);
	if (!t || t.name === "null") throw Error(`Could not find CodeMirror mode for MimeType: ${e}`);
	if (!t.token) throw Error(`Could not find CodeMirror mode with token method: ${e}`);
	return (e, r) => {
		let i = new CodeMirror.StringStream(e);
		for (; !i.eol();) {
			let e = t.token(i, n), a = i.current();
			if (r(a, e, i.start, i.start + a.length) === B) return;
			i.start = i.pos;
		}
	};
}
var B = {};
function V(e, t, n) {
	n ||= "    ";
	let r, i = new m(n), o = a(t);
	try {
		switch (e) {
			case u.TEXT_HTML:
				new x(i).format(t, o);
				break;
			case u.TEXT_CSS:
				new oe(i).format(t, o, 0, t.length);
				break;
			case u.APPLICATION_JAVASCRIPT:
			case u.TEXT_JAVASCRIPT:
				new y(i).format(t, o, 0, t.length);
				break;
			case u.APPLICATION_JSON:
			case u.APPLICATION_MANIFEST_JSON:
				new b(i).format(t, o, 0, t.length);
				break;
			default: new k(i).format(t, o, 0, t.length);
		}
		r = {
			mapping: i.mapping,
			content: i.content()
		};
	} catch (e) {
		console.error(e), r = {
			mapping: {
				original: [0],
				formatted: [0]
			},
			content: t
		};
	}
	return r;
}
(function() {
	n.queryParam("test") && (console.error = () => void 0);
})();
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/entrypoints/formatter_worker/CSSFormatter.ts
var ae = (e) => e.replace(/(?:\r?\n|[\t\f\r ])+$/g, ""), oe = class {
	#e;
	#t;
	#n;
	#r;
	#i = -1;
	#a = {};
	constructor(e) {
		this.#e = e;
	}
	format(e, t, n, r) {
		this.#r = t, this.#n = n, this.#t = r, this.#a = {}, this.#i = -1;
		let i = ie("text/css"), a = this.#e.setEnforceSpaceBetweenWords(!1);
		i(e.substring(this.#n, this.#t), this.#o.bind(this)), this.#e.setEnforceSpaceBetweenWords(a);
	}
	#o(n, r, i) {
		i += this.#n;
		let a = t(this.#r, i, e);
		if (a !== this.#i && (this.#a.eatWhitespace = !0), r && (/^property/.test(r) || /^variable-2/.test(r)) && !this.#a.inPropertyValue && (this.#a.seenProperty = !0), this.#i = a, /^(?:\r?\n|[\t\f\r ])+$/.test(n)) {
			this.#a.eatWhitespace || this.#e.addSoftSpace();
			return;
		}
		if (this.#a.eatWhitespace = !1, n !== "\n") {
			if (n !== "}" && (this.#a.afterClosingBrace && this.#e.addNewLine(!0), this.#a.afterClosingBrace = !1), n === "}") this.#a.inPropertyValue && this.#e.addNewLine(), this.#e.decreaseNestingLevel(), this.#a.afterClosingBrace = !0, this.#a.inPropertyValue = !1;
			else if (n === ":" && !this.#a.inPropertyValue && this.#a.seenProperty) {
				this.#e.addToken(n, i), this.#e.addSoftSpace(), this.#a.eatWhitespace = !0, this.#a.inPropertyValue = !0, this.#a.seenProperty = !1;
				return;
			} else if (n === "{") {
				this.#e.addSoftSpace(), this.#e.addToken(n, i), this.#e.addNewLine(), this.#e.increaseNestingLevel();
				return;
			}
			this.#e.addToken(ae(n), i), r === "comment" && !this.#a.inPropertyValue && !this.#a.seenProperty && this.#e.addNewLine(), n === ";" && this.#a.inPropertyValue ? (this.#a.inPropertyValue = !1, this.#e.addNewLine()) : n === "}" && this.#e.addNewLine();
		}
	}
}, H = {
	Initial: "Initial",
	Selector: "Selector",
	Style: "Style",
	PropertyName: "PropertyName",
	PropertyValue: "PropertyValue",
	AtRule: "AtRule"
};
function U(e, t) {
	let n = e.split("\n"), r = [], i = 0, a = H.Initial, o, s, c = /* @__PURE__ */ new Set(), l = [];
	function u(e) {
		l = l.concat(e.chunk);
	}
	function d(e) {
		return e.replace(/^(?:\r?\n|[\t\f\r ])+|(?:\r?\n|[\t\f\r ])+$/g, "");
	}
	function f(e, n, f, p) {
		let g = n ? new Set(n.split(" ")) : c;
		switch (a) {
			case H.Initial:
				g.has("qualifier") || g.has("builtin") || g.has("tag") ? (o = {
					selectorText: e,
					lineNumber: m,
					columnNumber: f,
					properties: []
				}, a = H.Selector) : g.has("def") && (o = {
					atRule: e,
					lineNumber: m,
					columnNumber: f
				}, a = H.AtRule);
				break;
			case H.Selector:
				e === "{" && g === c ? (o.selectorText = d(o.selectorText), o.styleRange = h(m, p), a = H.Style) : o.selectorText += e;
				break;
			case H.AtRule:
				(e === ";" || e === "{") && g === c ? (o.atRule = d(o.atRule), r.push(o), a = H.Initial) : o.atRule += e;
				break;
			case H.Style:
				if (g.has("meta") || g.has("property") || g.has("variable-2")) s = {
					name: e,
					value: "",
					range: h(m, f),
					nameRange: h(m, f)
				}, a = H.PropertyName;
				else if (e === "}" && g === c) o.styleRange.endLine = m, o.styleRange.endColumn = f, r.push(o), a = H.Initial;
				else if (g.has("comment")) {
					if (e.substring(0, 2) !== "/*" || e.substring(e.length - 2) !== "*/") break;
					let t = "a{\n" + e.substring(2, e.length - 2) + "}";
					if (l = [], U(t, u), l.length === 1 && l[0].properties.length === 1) {
						let e = l[0].properties[0];
						e.disabled = !0, e.range = h(m, f), e.range.endColumn = p;
						let t = m - 1, n = f + 2;
						e.nameRange.startLine += t, e.nameRange.startColumn += n, e.nameRange.endLine += t, e.nameRange.endColumn += n, e.valueRange.startLine += t, e.valueRange.startColumn += n, e.valueRange.endLine += t, e.valueRange.endColumn += n, o.properties.push(e);
					}
				}
				break;
			case H.PropertyName:
				e === ":" && g === c ? (s.name = s.name, s.nameRange.endLine = m, s.nameRange.endColumn = f, s.valueRange = h(m, p), a = H.PropertyValue) : g.has("property") && (s.name += e);
				break;
			case H.PropertyValue:
				(e === ";" || e === "}") && g === c ? (s.value = s.value, s.valueRange.endLine = m, s.valueRange.endColumn = f, s.range.endLine = m, s.range.endColumn = e === ";" ? p : f, o.properties.push(s), e === "}" ? (o.styleRange.endLine = m, o.styleRange.endColumn = f, r.push(o), a = H.Initial) : a = H.Style) : g.has("comment") || (s.value += e);
				break;
			default: console.assert(!1, "Unknown CSS parser state.");
		}
		i += p - f, i > 1e5 && (t({
			chunk: r,
			isLastChunk: !1
		}), r = [], i = 0);
	}
	let p = ie("text/css"), m = 0;
	for (; m < n.length; ++m) {
		let e = n[m];
		p(e, f), f("\n", null, e.length, e.length + 1);
	}
	t({
		chunk: r,
		isLastChunk: !0
	});
	function h(e, t) {
		return {
			startLine: e,
			startColumn: t,
			endLine: e,
			endColumn: t
		};
	}
}
r.workerScope.onmessage = function(e) {
	let t = e.data.method, n = e.data.params;
	if (t) switch (t) {
		case c.FORMAT:
			r.workerScope.postMessage(V(n.mimeType, n.content, n.indentString));
			break;
		case c.PARSE_CSS:
			U(n.content, self.postMessage);
			break;
		case c.JAVASCRIPT_SUBSTITUTE:
			r.workerScope.postMessage(L(n.content, n.mapping));
			break;
		case c.JAVASCRIPT_SCOPE_TREE:
			r.workerScope.postMessage(A(n.content, n.sourceType)?.export());
			break;
		default: l(t, `Unsupport method name: ${t}`);
	}
}, r.workerScope.postMessage("workerReady");
//#endregion
