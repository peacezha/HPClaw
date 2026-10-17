//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/third_party/marked/package/lib/marked.esm.js
function e() {
	return {
		async: !1,
		breaks: !1,
		extensions: null,
		gfm: !0,
		hooks: null,
		pedantic: !1,
		renderer: null,
		silent: !1,
		tokenizer: null,
		walkTokens: null
	};
}
var t = e();
function n(e) {
	t = e;
}
var r = /[&<>"']/, i = new RegExp(r.source, "g"), a = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, o = new RegExp(a.source, "g"), s = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
}, c = (e) => s[e];
function l(e, t) {
	if (t) {
		if (r.test(e)) return e.replace(i, c);
	} else if (a.test(e)) return e.replace(o, c);
	return e;
}
var u = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi;
function d(e) {
	return e.replace(u, (e, t) => (t = t.toLowerCase(), t === "colon" ? ":" : t.charAt(0) === "#" ? t.charAt(1) === "x" ? String.fromCharCode(parseInt(t.substring(2), 16)) : String.fromCharCode(+t.substring(1)) : ""));
}
var f = /(^|[^\[])\^/g;
function p(e, t) {
	let n = typeof e == "string" ? e : e.source;
	t ||= "";
	let r = {
		replace: (e, t) => {
			let i = typeof t == "string" ? t : t.source;
			return i = i.replace(f, "$1"), n = n.replace(e, i), r;
		},
		getRegex: () => new RegExp(n, t)
	};
	return r;
}
function m(e) {
	try {
		e = encodeURI(e).replace(/%25/g, "%");
	} catch {
		return null;
	}
	return e;
}
var h = { exec: () => null };
function g(e, t) {
	let n = e.replace(/\|/g, (e, t, n) => {
		let r = !1, i = t;
		for (; --i >= 0 && n[i] === "\\";) r = !r;
		return r ? "|" : " |";
	}).split(/ \|/), r = 0;
	if (n[0].trim() || n.shift(), n.length > 0 && !n[n.length - 1].trim() && n.pop(), t) {
		if (n.length > t) n.splice(t);
		else for (; n.length < t;) n.push("");
	}
	for (; r < n.length; r++) n[r] = n[r].trim().replace(/\\\|/g, "|");
	return n;
}
function _(e, t, n) {
	let r = e.length;
	if (r === 0) return "";
	let i = 0;
	for (; i < r;) {
		let a = e.charAt(r - i - 1);
		if (a === t && !n) i++;
		else if (a !== t && n) i++;
		else break;
	}
	return e.slice(0, r - i);
}
function ee(e, t) {
	if (e.indexOf(t[1]) === -1) return -1;
	let n = 0;
	for (let r = 0; r < e.length; r++) if (e[r] === "\\") r++;
	else if (e[r] === t[0]) n++;
	else if (e[r] === t[1] && (n--, n < 0)) return r;
	return -1;
}
function v(e, t, n, r) {
	let i = t.href, a = t.title ? l(t.title) : null, o = e[1].replace(/\\([\[\]])/g, "$1");
	if (e[0].charAt(0) !== "!") {
		r.state.inLink = !0;
		let e = {
			type: "link",
			raw: n,
			href: i,
			title: a,
			text: o,
			tokens: r.inlineTokens(o)
		};
		return r.state.inLink = !1, e;
	}
	return {
		type: "image",
		raw: n,
		href: i,
		title: a,
		text: l(o)
	};
}
function te(e, t) {
	let n = e.match(/^(\s+)(?:```)/);
	if (n === null) return t;
	let r = n[1];
	return t.split("\n").map((e) => {
		let t = e.match(/^\s+/);
		if (t === null) return e;
		let [n] = t;
		return n.length >= r.length ? e.slice(r.length) : e;
	}).join("\n");
}
var y = class {
	options;
	rules;
	lexer;
	constructor(e) {
		this.options = e || t;
	}
	space(e) {
		let t = this.rules.block.newline.exec(e);
		if (t && t[0].length > 0) return {
			type: "space",
			raw: t[0]
		};
	}
	code(e) {
		let t = this.rules.block.code.exec(e);
		if (t) {
			let e = t[0].replace(/^ {1,4}/gm, "");
			return {
				type: "code",
				raw: t[0],
				codeBlockStyle: "indented",
				text: this.options.pedantic ? e : _(e, "\n")
			};
		}
	}
	fences(e) {
		let t = this.rules.block.fences.exec(e);
		if (t) {
			let e = t[0], n = te(e, t[3] || "");
			return {
				type: "code",
				raw: e,
				lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2],
				text: n
			};
		}
	}
	heading(e) {
		let t = this.rules.block.heading.exec(e);
		if (t) {
			let e = t[2].trim();
			if (/#$/.test(e)) {
				let t = _(e, "#");
				(this.options.pedantic || !t || / $/.test(t)) && (e = t.trim());
			}
			return {
				type: "heading",
				raw: t[0],
				depth: t[1].length,
				text: e,
				tokens: this.lexer.inline(e)
			};
		}
	}
	hr(e) {
		let t = this.rules.block.hr.exec(e);
		if (t) return {
			type: "hr",
			raw: _(t[0], "\n")
		};
	}
	blockquote(e) {
		let t = this.rules.block.blockquote.exec(e);
		if (t) {
			let e = _(t[0], "\n").split("\n"), n = "", r = "", i = [];
			for (; e.length > 0;) {
				let t = !1, a = [], o = 0;
				for (; o < e.length; o++) if (/^ {0,3}>/.test(e[o])) a.push(e[o]), t = !0;
				else if (!t) a.push(e[o]);
				else break;
				e = e.slice(o);
				let s = a.join("\n"), c = s.replace(/\n {0,3}((?:=+|-+) *)(?=\n|$)/g, "\n    $1").replace(/^ {0,3}>[ \t]?/gm, "");
				n = n ? `${n}\n${s}` : s, r = r ? `${r}\n${c}` : c;
				let l = this.lexer.state.top;
				if (this.lexer.state.top = !0, this.lexer.blockTokens(c, i, !0), this.lexer.state.top = l, e.length === 0) break;
				let u = i[i.length - 1];
				if (u?.type === "code") break;
				if (u?.type === "blockquote") {
					let t = u, a = t.raw + "\n" + e.join("\n"), o = this.blockquote(a);
					i[i.length - 1] = o, n = n.substring(0, n.length - t.raw.length) + o.raw, r = r.substring(0, r.length - t.text.length) + o.text;
					break;
				}
				if (u?.type === "list") {
					let t = u, a = t.raw + "\n" + e.join("\n"), o = this.list(a);
					i[i.length - 1] = o, n = n.substring(0, n.length - u.raw.length) + o.raw, r = r.substring(0, r.length - t.raw.length) + o.raw, e = a.substring(i[i.length - 1].raw.length).split("\n");
					continue;
				}
			}
			return {
				type: "blockquote",
				raw: n,
				tokens: i,
				text: r
			};
		}
	}
	list(e) {
		let t = this.rules.block.list.exec(e);
		if (t) {
			let n = t[1].trim(), r = n.length > 1, i = {
				type: "list",
				raw: "",
				ordered: r,
				start: r ? +n.slice(0, -1) : "",
				loose: !1,
				items: []
			};
			n = r ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = r ? n : "[*+-]");
			let a = RegExp(`^( {0,3}${n})((?:[\t ][^\\n]*)?(?:\\n|$))`), o = "", s = "", c = !1;
			for (; e;) {
				let n = !1;
				if (!(t = a.exec(e)) || this.rules.block.hr.test(e)) break;
				o = t[0], e = e.substring(o.length);
				let r = t[2].split("\n", 1)[0].replace(/^\t+/, (e) => " ".repeat(3 * e.length)), l = e.split("\n", 1)[0], u = 0;
				this.options.pedantic ? (u = 2, s = r.trimStart()) : (u = t[2].search(/[^ ]/), u = u > 4 ? 1 : u, s = r.slice(u), u += t[1].length);
				let d = !1;
				if (!r && /^ *$/.test(l) && (o += l + "\n", e = e.substring(l.length + 1), n = !0), !n) {
					let t = RegExp(`^ {0,${Math.min(3, u - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ \t][^\\n]*)?(?:\\n|$))`), n = RegExp(`^ {0,${Math.min(3, u - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), i = RegExp(`^ {0,${Math.min(3, u - 1)}}(?:\`\`\`|~~~)`), a = RegExp(`^ {0,${Math.min(3, u - 1)}}#`);
					for (; e;) {
						let c = e.split("\n", 1)[0];
						if (l = c, this.options.pedantic && (l = l.replace(/^ {1,4}(?=( {4})*[^ ])/g, "  ")), i.test(l) || a.test(l) || t.test(l) || n.test(e)) break;
						if (l.search(/[^ ]/) >= u || !l.trim()) s += "\n" + l.slice(u);
						else {
							if (d || r.search(/[^ ]/) >= 4 || i.test(r) || a.test(r) || n.test(r)) break;
							s += "\n" + l;
						}
						!d && !l.trim() && (d = !0), o += c + "\n", e = e.substring(c.length + 1), r = l.slice(u);
					}
				}
				i.loose || (c ? i.loose = !0 : /\n *\n *$/.test(o) && (c = !0));
				let f = null, p;
				this.options.gfm && (f = /^\[[ xX]\] /.exec(s), f && (p = f[0] !== "[ ] ", s = s.replace(/^\[[ xX]\] +/, ""))), i.items.push({
					type: "list_item",
					raw: o,
					task: !!f,
					checked: p,
					loose: !1,
					text: s,
					tokens: []
				}), i.raw += o;
			}
			i.items[i.items.length - 1].raw = o.trimEnd(), i.items[i.items.length - 1].text = s.trimEnd(), i.raw = i.raw.trimEnd();
			for (let e = 0; e < i.items.length; e++) if (this.lexer.state.top = !1, i.items[e].tokens = this.lexer.blockTokens(i.items[e].text, []), !i.loose) {
				let t = i.items[e].tokens.filter((e) => e.type === "space");
				i.loose = t.length > 0 && t.some((e) => /\n.*\n/.test(e.raw));
			}
			if (i.loose) for (let e = 0; e < i.items.length; e++) i.items[e].loose = !0;
			return i;
		}
	}
	html(e) {
		let t = this.rules.block.html.exec(e);
		if (t) return {
			type: "html",
			block: !0,
			raw: t[0],
			pre: t[1] === "pre" || t[1] === "script" || t[1] === "style",
			text: t[0]
		};
	}
	def(e) {
		let t = this.rules.block.def.exec(e);
		if (t) {
			let e = t[1].toLowerCase().replace(/\s+/g, " "), n = t[2] ? t[2].replace(/^<(.*)>$/, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", r = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
			return {
				type: "def",
				tag: e,
				raw: t[0],
				href: n,
				title: r
			};
		}
	}
	table(e) {
		let t = this.rules.block.table.exec(e);
		if (!t || !/[:|]/.test(t[2])) return;
		let n = g(t[1]), r = t[2].replace(/^\||\| *$/g, "").split("|"), i = t[3] && t[3].trim() ? t[3].replace(/\n[ \t]*$/, "").split("\n") : [], a = {
			type: "table",
			raw: t[0],
			header: [],
			align: [],
			rows: []
		};
		if (n.length === r.length) {
			for (let e of r) /^ *-+: *$/.test(e) ? a.align.push("right") : /^ *:-+: *$/.test(e) ? a.align.push("center") : /^ *:-+ *$/.test(e) ? a.align.push("left") : a.align.push(null);
			for (let e = 0; e < n.length; e++) a.header.push({
				text: n[e],
				tokens: this.lexer.inline(n[e]),
				header: !0,
				align: a.align[e]
			});
			for (let e of i) a.rows.push(g(e, a.header.length).map((e, t) => ({
				text: e,
				tokens: this.lexer.inline(e),
				header: !1,
				align: a.align[t]
			})));
			return a;
		}
	}
	lheading(e) {
		let t = this.rules.block.lheading.exec(e);
		if (t) return {
			type: "heading",
			raw: t[0],
			depth: t[2].charAt(0) === "=" ? 1 : 2,
			text: t[1],
			tokens: this.lexer.inline(t[1])
		};
	}
	paragraph(e) {
		let t = this.rules.block.paragraph.exec(e);
		if (t) {
			let e = t[1].charAt(t[1].length - 1) === "\n" ? t[1].slice(0, -1) : t[1];
			return {
				type: "paragraph",
				raw: t[0],
				text: e,
				tokens: this.lexer.inline(e)
			};
		}
	}
	text(e) {
		let t = this.rules.block.text.exec(e);
		if (t) return {
			type: "text",
			raw: t[0],
			text: t[0],
			tokens: this.lexer.inline(t[0])
		};
	}
	escape(e) {
		let t = this.rules.inline.escape.exec(e);
		if (t) return {
			type: "escape",
			raw: t[0],
			text: l(t[1])
		};
	}
	tag(e) {
		let t = this.rules.inline.tag.exec(e);
		if (t) return !this.lexer.state.inLink && /^<a /i.test(t[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && /^<\/a>/i.test(t[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(t[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(t[0]) && (this.lexer.state.inRawBlock = !1), {
			type: "html",
			raw: t[0],
			inLink: this.lexer.state.inLink,
			inRawBlock: this.lexer.state.inRawBlock,
			block: !1,
			text: t[0]
		};
	}
	link(e) {
		let t = this.rules.inline.link.exec(e);
		if (t) {
			let e = t[2].trim();
			if (!this.options.pedantic && /^</.test(e)) {
				if (!/>$/.test(e)) return;
				let t = _(e.slice(0, -1), "\\");
				if ((e.length - t.length) % 2 == 0) return;
			} else {
				let e = ee(t[2], "()");
				if (e > -1) {
					let n = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + e;
					t[2] = t[2].substring(0, e), t[0] = t[0].substring(0, n).trim(), t[3] = "";
				}
			}
			let n = t[2], r = "";
			if (this.options.pedantic) {
				let e = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(n);
				e && (n = e[1], r = e[3]);
			} else r = t[3] ? t[3].slice(1, -1) : "";
			return n = n.trim(), /^</.test(n) && (n = this.options.pedantic && !/>$/.test(e) ? n.slice(1) : n.slice(1, -1)), v(t, {
				href: n && n.replace(this.rules.inline.anyPunctuation, "$1"),
				title: r && r.replace(this.rules.inline.anyPunctuation, "$1")
			}, t[0], this.lexer);
		}
	}
	reflink(e, t) {
		let n;
		if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
			let e = t[(n[2] || n[1]).replace(/\s+/g, " ").toLowerCase()];
			if (!e) {
				let e = n[0].charAt(0);
				return {
					type: "text",
					raw: e,
					text: e
				};
			}
			return v(n, e, n[0], this.lexer);
		}
	}
	emStrong(e, t, n = "") {
		let r = this.rules.inline.emStrongLDelim.exec(e);
		if (r && !(r[3] && n.match(/[\p{L}\p{N}]/u)) && (!(r[1] || r[2]) || !n || this.rules.inline.punctuation.exec(n))) {
			let n = [...r[0]].length - 1, i, a, o = n, s = 0, c = r[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
			for (c.lastIndex = 0, t = t.slice(-1 * e.length + n); (r = c.exec(t)) != null;) {
				if (i = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !i) continue;
				if (a = [...i].length, r[3] || r[4]) {
					o += a;
					continue;
				}
				if ((r[5] || r[6]) && n % 3 && !((n + a) % 3)) {
					s += a;
					continue;
				}
				if (o -= a, o > 0) continue;
				a = Math.min(a, a + o + s);
				let t = [...r[0]][0].length, c = e.slice(0, n + r.index + t + a);
				if (Math.min(n, a) % 2) {
					let e = c.slice(1, -1);
					return {
						type: "em",
						raw: c,
						text: e,
						tokens: this.lexer.inlineTokens(e)
					};
				}
				let l = c.slice(2, -2);
				return {
					type: "strong",
					raw: c,
					text: l,
					tokens: this.lexer.inlineTokens(l)
				};
			}
		}
	}
	codespan(e) {
		let t = this.rules.inline.code.exec(e);
		if (t) {
			let e = t[2].replace(/\n/g, " "), n = /[^ ]/.test(e), r = /^ /.test(e) && / $/.test(e);
			return n && r && (e = e.substring(1, e.length - 1)), e = l(e, !0), {
				type: "codespan",
				raw: t[0],
				text: e
			};
		}
	}
	br(e) {
		let t = this.rules.inline.br.exec(e);
		if (t) return {
			type: "br",
			raw: t[0]
		};
	}
	del(e) {
		let t = this.rules.inline.del.exec(e);
		if (t) return {
			type: "del",
			raw: t[0],
			text: t[2],
			tokens: this.lexer.inlineTokens(t[2])
		};
	}
	autolink(e) {
		let t = this.rules.inline.autolink.exec(e);
		if (t) {
			let e, n;
			return t[2] === "@" ? (e = l(t[1]), n = "mailto:" + e) : (e = l(t[1]), n = e), {
				type: "link",
				raw: t[0],
				text: e,
				href: n,
				tokens: [{
					type: "text",
					raw: e,
					text: e
				}]
			};
		}
	}
	url(e) {
		let t;
		if (t = this.rules.inline.url.exec(e)) {
			let e, n;
			if (t[2] === "@") e = l(t[0]), n = "mailto:" + e;
			else {
				let r;
				do
					r = t[0], t[0] = this.rules.inline._backpedal.exec(t[0])?.[0] ?? "";
				while (r !== t[0]);
				e = l(t[0]), n = t[1] === "www." ? "http://" + t[0] : t[0];
			}
			return {
				type: "link",
				raw: t[0],
				text: e,
				href: n,
				tokens: [{
					type: "text",
					raw: e,
					text: e
				}]
			};
		}
	}
	inlineText(e) {
		let t = this.rules.inline.text.exec(e);
		if (t) {
			let e;
			return e = this.lexer.state.inRawBlock ? t[0] : l(t[0]), {
				type: "text",
				raw: t[0],
				text: e
			};
		}
	}
}, ne = /^(?: *(?:\n|$))+/, re = /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/, b = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, x = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, ie = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, S = /(?:[*+-]|\d{1,9}[.)])/, C = p(/^(?!bull |blockCode|fences|blockquote|heading|html)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html))+?)\n {0,3}(=+|-+) *(?:\n+|$)/).replace(/bull/g, S).replace(/blockCode/g, / {4}/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).getRegex(), w = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, ae = /^[^\n]+/, T = /(?!\s*\])(?:\\.|[^\[\]\\])+/, oe = p(/^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/).replace("label", T).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), se = p(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, S).getRegex(), E = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", D = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, ce = p("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))", "i").replace("comment", D).replace("tag", E).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), O = p(w).replace("hr", x).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", E).getRegex(), k = {
	blockquote: p(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", O).getRegex(),
	code: re,
	def: oe,
	fences: b,
	heading: ie,
	hr: x,
	html: ce,
	lheading: C,
	list: se,
	newline: ne,
	paragraph: O,
	table: h,
	text: ae
}, A = p("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", x).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", " {4}[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", E).getRegex(), le = {
	...k,
	table: A,
	paragraph: p(w).replace("hr", x).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", A).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", E).getRegex()
}, ue = {
	...k,
	html: p("^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))").replace("comment", D).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
	def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
	heading: /^(#{1,6})(.*)(?:\n+|$)/,
	fences: h,
	lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
	paragraph: p(w).replace("hr", x).replace("heading", " *#{1,6} *[^\n]").replace("lheading", C).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, j = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, de = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, M = /^( {2,}|\\)\n(?!\s*$)/, fe = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, N = "\\p{P}\\p{S}", P = p(/^((?![*_])[\spunctuation])/, "u").replace(/punctuation/g, N).getRegex(), pe = /\[[^[\]]*?\]\([^\(\)]*?\)|`[^`]*?`|<[^<>]*?>/g, me = p(/^(?:\*+(?:((?!\*)[punct])|[^\s*]))|^_+(?:((?!_)[punct])|([^\s_]))/, "u").replace(/punct/g, N).getRegex(), F = p("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)[punct](\\*+)(?=[\\s]|$)|[^punct\\s](\\*+)(?!\\*)(?=[punct\\s]|$)|(?!\\*)[punct\\s](\\*+)(?=[^punct\\s])|[\\s](\\*+)(?!\\*)(?=[punct])|(?!\\*)[punct](\\*+)(?!\\*)(?=[punct])|[^punct\\s](\\*+)(?=[^punct\\s])", "gu").replace(/punct/g, N).getRegex(), I = p("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)[punct](_+)(?=[\\s]|$)|[^punct\\s](_+)(?!_)(?=[punct\\s]|$)|(?!_)[punct\\s](_+)(?=[^punct\\s])|[\\s](_+)(?!_)(?=[punct])|(?!_)[punct](_+)(?!_)(?=[punct])", "gu").replace(/punct/g, N).getRegex(), L = p(/\\([punct])/, "gu").replace(/punct/g, N).getRegex(), R = p(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), he = p(D).replace("(?:-->|$)", "-->").getRegex(), ge = p("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", he).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), z = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, _e = p(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/).replace("label", z).replace("href", /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), B = p(/^!?\[(label)\]\[(ref)\]/).replace("label", z).replace("ref", T).getRegex(), V = p(/^!?\[(ref)\](?:\[\])?/).replace("ref", T).getRegex(), H = {
	_backpedal: h,
	anyPunctuation: L,
	autolink: R,
	blockSkip: pe,
	br: M,
	code: de,
	del: h,
	emStrongLDelim: me,
	emStrongRDelimAst: F,
	emStrongRDelimUnd: I,
	escape: j,
	link: _e,
	nolink: V,
	punctuation: P,
	reflink: B,
	reflinkSearch: p("reflink|nolink(?!\\()", "g").replace("reflink", B).replace("nolink", V).getRegex(),
	tag: ge,
	text: fe,
	url: h
}, ve = {
	...H,
	link: p(/^!?\[(label)\]\((.*?)\)/).replace("label", z).getRegex(),
	reflink: p(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", z).getRegex()
}, U = {
	...H,
	escape: p(j).replace("])", "~|])").getRegex(),
	url: p(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
	_backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
	del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
	text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
}, ye = {
	...U,
	br: p(M).replace("{2,}", "*").getRegex(),
	text: p(U.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, W = {
	normal: k,
	gfm: le,
	pedantic: ue
}, G = {
	normal: H,
	gfm: U,
	breaks: ye,
	pedantic: ve
}, K = class e {
	tokens;
	options;
	state;
	tokenizer;
	inlineQueue;
	constructor(e) {
		this.tokens = [], this.tokens.links = Object.create(null), this.options = e || t, this.options.tokenizer = this.options.tokenizer || new y(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
			inLink: !1,
			inRawBlock: !1,
			top: !0
		};
		let n = {
			block: W.normal,
			inline: G.normal
		};
		this.options.pedantic ? (n.block = W.pedantic, n.inline = G.pedantic) : this.options.gfm && (n.block = W.gfm, n.inline = this.options.breaks ? G.breaks : G.gfm), this.tokenizer.rules = n;
	}
	static get rules() {
		return {
			block: W,
			inline: G
		};
	}
	static lex(t, n) {
		return new e(n).lex(t);
	}
	static lexInline(t, n) {
		return new e(n).inlineTokens(t);
	}
	lex(e) {
		e = e.replace(/\r\n|\r/g, "\n"), this.blockTokens(e, this.tokens);
		for (let e = 0; e < this.inlineQueue.length; e++) {
			let t = this.inlineQueue[e];
			this.inlineTokens(t.src, t.tokens);
		}
		return this.inlineQueue = [], this.tokens;
	}
	blockTokens(e, t = [], n = !1) {
		e = this.options.pedantic ? e.replace(/\t/g, "    ").replace(/^ +$/gm, "") : e.replace(/^( *)(\t+)/gm, (e, t, n) => t + "    ".repeat(n.length));
		let r, i, a;
		for (; e;) if (!(this.options.extensions && this.options.extensions.block && this.options.extensions.block.some((n) => (r = n.call({ lexer: this }, e, t)) ? (e = e.substring(r.raw.length), t.push(r), !0) : !1))) {
			if (r = this.tokenizer.space(e)) {
				e = e.substring(r.raw.length), r.raw.length === 1 && t.length > 0 ? t[t.length - 1].raw += "\n" : t.push(r);
				continue;
			}
			if (r = this.tokenizer.code(e)) {
				e = e.substring(r.raw.length), i = t[t.length - 1], i && (i.type === "paragraph" || i.type === "text") ? (i.raw += "\n" + r.raw, i.text += "\n" + r.text, this.inlineQueue[this.inlineQueue.length - 1].src = i.text) : t.push(r);
				continue;
			}
			if (r = this.tokenizer.fences(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.heading(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.hr(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.blockquote(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.list(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.html(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.def(e)) {
				e = e.substring(r.raw.length), i = t[t.length - 1], i && (i.type === "paragraph" || i.type === "text") ? (i.raw += "\n" + r.raw, i.text += "\n" + r.raw, this.inlineQueue[this.inlineQueue.length - 1].src = i.text) : this.tokens.links[r.tag] || (this.tokens.links[r.tag] = {
					href: r.href,
					title: r.title
				});
				continue;
			}
			if (r = this.tokenizer.table(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (r = this.tokenizer.lheading(e)) {
				e = e.substring(r.raw.length), t.push(r);
				continue;
			}
			if (a = e, this.options.extensions && this.options.extensions.startBlock) {
				let t = Infinity, n = e.slice(1), r;
				this.options.extensions.startBlock.forEach((e) => {
					r = e.call({ lexer: this }, n), typeof r == "number" && r >= 0 && (t = Math.min(t, r));
				}), t < Infinity && t >= 0 && (a = e.substring(0, t + 1));
			}
			if (this.state.top && (r = this.tokenizer.paragraph(a))) {
				i = t[t.length - 1], n && i?.type === "paragraph" ? (i.raw += "\n" + r.raw, i.text += "\n" + r.text, this.inlineQueue.pop(), this.inlineQueue[this.inlineQueue.length - 1].src = i.text) : t.push(r), n = a.length !== e.length, e = e.substring(r.raw.length);
				continue;
			}
			if (r = this.tokenizer.text(e)) {
				e = e.substring(r.raw.length), i = t[t.length - 1], i && i.type === "text" ? (i.raw += "\n" + r.raw, i.text += "\n" + r.text, this.inlineQueue.pop(), this.inlineQueue[this.inlineQueue.length - 1].src = i.text) : t.push(r);
				continue;
			}
			if (e) {
				let t = "Infinite loop on byte: " + e.charCodeAt(0);
				if (this.options.silent) {
					console.error(t);
					break;
				}
				throw Error(t);
			}
		}
		return this.state.top = !0, t;
	}
	inline(e, t = []) {
		return this.inlineQueue.push({
			src: e,
			tokens: t
		}), t;
	}
	inlineTokens(e, t = []) {
		let n, r, i, a = e, o, s, c;
		if (this.tokens.links) {
			let e = Object.keys(this.tokens.links);
			if (e.length > 0) for (; (o = this.tokenizer.rules.inline.reflinkSearch.exec(a)) != null;) e.includes(o[0].slice(o[0].lastIndexOf("[") + 1, -1)) && (a = a.slice(0, o.index) + "[" + "a".repeat(o[0].length - 2) + "]" + a.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
		}
		for (; (o = this.tokenizer.rules.inline.blockSkip.exec(a)) != null;) a = a.slice(0, o.index) + "[" + "a".repeat(o[0].length - 2) + "]" + a.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
		for (; (o = this.tokenizer.rules.inline.anyPunctuation.exec(a)) != null;) a = a.slice(0, o.index) + "++" + a.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
		for (; e;) if (s || (c = ""), s = !1, !(this.options.extensions && this.options.extensions.inline && this.options.extensions.inline.some((r) => (n = r.call({ lexer: this }, e, t)) ? (e = e.substring(n.raw.length), t.push(n), !0) : !1))) {
			if (n = this.tokenizer.escape(e)) {
				e = e.substring(n.raw.length), t.push(n);
				continue;
			}
			if (n = this.tokenizer.tag(e)) {
				e = e.substring(n.raw.length), r = t[t.length - 1], r && n.type === "text" && r.type === "text" ? (r.raw += n.raw, r.text += n.text) : t.push(n);
				continue;
			}
			if (n = this.tokenizer.link(e)) {
				e = e.substring(n.raw.length), t.push(n);
				continue;
			}
			if (n = this.tokenizer.reflink(e, this.tokens.links)) {
				e = e.substring(n.raw.length), r = t[t.length - 1], r && n.type === "text" && r.type === "text" ? (r.raw += n.raw, r.text += n.text) : t.push(n);
				continue;
			}
			if (n = this.tokenizer.emStrong(e, a, c)) {
				e = e.substring(n.raw.length), t.push(n);
				continue;
			}
			if (n = this.tokenizer.codespan(e)) {
				e = e.substring(n.raw.length), t.push(n);
				continue;
			}
			if (n = this.tokenizer.br(e)) {
				e = e.substring(n.raw.length), t.push(n);
				continue;
			}
			if (n = this.tokenizer.del(e)) {
				e = e.substring(n.raw.length), t.push(n);
				continue;
			}
			if (n = this.tokenizer.autolink(e)) {
				e = e.substring(n.raw.length), t.push(n);
				continue;
			}
			if (!this.state.inLink && (n = this.tokenizer.url(e))) {
				e = e.substring(n.raw.length), t.push(n);
				continue;
			}
			if (i = e, this.options.extensions && this.options.extensions.startInline) {
				let t = Infinity, n = e.slice(1), r;
				this.options.extensions.startInline.forEach((e) => {
					r = e.call({ lexer: this }, n), typeof r == "number" && r >= 0 && (t = Math.min(t, r));
				}), t < Infinity && t >= 0 && (i = e.substring(0, t + 1));
			}
			if (n = this.tokenizer.inlineText(i)) {
				e = e.substring(n.raw.length), n.raw.slice(-1) !== "_" && (c = n.raw.slice(-1)), s = !0, r = t[t.length - 1], r && r.type === "text" ? (r.raw += n.raw, r.text += n.text) : t.push(n);
				continue;
			}
			if (e) {
				let t = "Infinite loop on byte: " + e.charCodeAt(0);
				if (this.options.silent) {
					console.error(t);
					break;
				}
				throw Error(t);
			}
		}
		return t;
	}
}, q = class {
	options;
	parser;
	constructor(e) {
		this.options = e || t;
	}
	space(e) {
		return "";
	}
	code({ text: e, lang: t, escaped: n }) {
		let r = (t || "").match(/^\S*/)?.[0], i = e.replace(/\n$/, "") + "\n";
		return r ? "<pre><code class=\"language-" + l(r) + "\">" + (n ? i : l(i, !0)) + "</code></pre>\n" : "<pre><code>" + (n ? i : l(i, !0)) + "</code></pre>\n";
	}
	blockquote({ tokens: e }) {
		return `<blockquote>\n${this.parser.parse(e)}</blockquote>\n`;
	}
	html({ text: e }) {
		return e;
	}
	heading({ tokens: e, depth: t }) {
		return `<h${t}>${this.parser.parseInline(e)}</h${t}>\n`;
	}
	hr(e) {
		return "<hr>\n";
	}
	list(e) {
		let t = e.ordered, n = e.start, r = "";
		for (let t = 0; t < e.items.length; t++) {
			let n = e.items[t];
			r += this.listitem(n);
		}
		let i = t ? "ol" : "ul", a = t && n !== 1 ? " start=\"" + n + "\"" : "";
		return "<" + i + a + ">\n" + r + "</" + i + ">\n";
	}
	listitem(e) {
		let t = "";
		if (e.task) {
			let n = this.checkbox({ checked: !!e.checked });
			e.loose ? e.tokens.length > 0 && e.tokens[0].type === "paragraph" ? (e.tokens[0].text = n + " " + e.tokens[0].text, e.tokens[0].tokens && e.tokens[0].tokens.length > 0 && e.tokens[0].tokens[0].type === "text" && (e.tokens[0].tokens[0].text = n + " " + e.tokens[0].tokens[0].text)) : e.tokens.unshift({
				type: "text",
				raw: n + " ",
				text: n + " "
			}) : t += n + " ";
		}
		return t += this.parser.parse(e.tokens, !!e.loose), `<li>${t}</li>\n`;
	}
	checkbox({ checked: e }) {
		return "<input " + (e ? "checked=\"\" " : "") + "disabled=\"\" type=\"checkbox\">";
	}
	paragraph({ tokens: e }) {
		return `<p>${this.parser.parseInline(e)}</p>\n`;
	}
	table(e) {
		let t = "", n = "";
		for (let t = 0; t < e.header.length; t++) n += this.tablecell(e.header[t]);
		t += this.tablerow({ text: n });
		let r = "";
		for (let t = 0; t < e.rows.length; t++) {
			let i = e.rows[t];
			n = "";
			for (let e = 0; e < i.length; e++) n += this.tablecell(i[e]);
			r += this.tablerow({ text: n });
		}
		return r &&= `<tbody>${r}</tbody>`, "<table>\n<thead>\n" + t + "</thead>\n" + r + "</table>\n";
	}
	tablerow({ text: e }) {
		return `<tr>\n${e}</tr>\n`;
	}
	tablecell(e) {
		let t = this.parser.parseInline(e.tokens), n = e.header ? "th" : "td";
		return (e.align ? `<${n} align="${e.align}">` : `<${n}>`) + t + `</${n}>\n`;
	}
	strong({ tokens: e }) {
		return `<strong>${this.parser.parseInline(e)}</strong>`;
	}
	em({ tokens: e }) {
		return `<em>${this.parser.parseInline(e)}</em>`;
	}
	codespan({ text: e }) {
		return `<code>${e}</code>`;
	}
	br(e) {
		return "<br>";
	}
	del({ tokens: e }) {
		return `<del>${this.parser.parseInline(e)}</del>`;
	}
	link({ href: e, title: t, tokens: n }) {
		let r = this.parser.parseInline(n), i = m(e);
		if (i === null) return r;
		e = i;
		let a = "<a href=\"" + e + "\"";
		return t && (a += " title=\"" + t + "\""), a += ">" + r + "</a>", a;
	}
	image({ href: e, title: t, text: n }) {
		let r = m(e);
		if (r === null) return n;
		e = r;
		let i = `<img src="${e}" alt="${n}"`;
		return t && (i += ` title="${t}"`), i += ">", i;
	}
	text(e) {
		return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : e.text;
	}
}, J = class {
	strong({ text: e }) {
		return e;
	}
	em({ text: e }) {
		return e;
	}
	codespan({ text: e }) {
		return e;
	}
	del({ text: e }) {
		return e;
	}
	html({ text: e }) {
		return e;
	}
	text({ text: e }) {
		return e;
	}
	link({ text: e }) {
		return "" + e;
	}
	image({ text: e }) {
		return "" + e;
	}
	br() {
		return "";
	}
}, Y = class e {
	options;
	renderer;
	textRenderer;
	constructor(e) {
		this.options = e || t, this.options.renderer = this.options.renderer || new q(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new J();
	}
	static parse(t, n) {
		return new e(n).parse(t);
	}
	static parseInline(t, n) {
		return new e(n).parseInline(t);
	}
	parse(e, t = !0) {
		let n = "";
		for (let r = 0; r < e.length; r++) {
			let i = e[r];
			if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[i.type]) {
				let e = i, t = this.options.extensions.renderers[e.type].call({ parser: this }, e);
				if (t !== !1 || ![
					"space",
					"hr",
					"heading",
					"code",
					"table",
					"blockquote",
					"list",
					"html",
					"paragraph",
					"text"
				].includes(e.type)) {
					n += t || "";
					continue;
				}
			}
			let a = i;
			switch (a.type) {
				case "space":
					n += this.renderer.space(a);
					continue;
				case "hr":
					n += this.renderer.hr(a);
					continue;
				case "heading":
					n += this.renderer.heading(a);
					continue;
				case "code":
					n += this.renderer.code(a);
					continue;
				case "table":
					n += this.renderer.table(a);
					continue;
				case "blockquote":
					n += this.renderer.blockquote(a);
					continue;
				case "list":
					n += this.renderer.list(a);
					continue;
				case "html":
					n += this.renderer.html(a);
					continue;
				case "paragraph":
					n += this.renderer.paragraph(a);
					continue;
				case "text": {
					let i = a, o = this.renderer.text(i);
					for (; r + 1 < e.length && e[r + 1].type === "text";) i = e[++r], o += "\n" + this.renderer.text(i);
					n += t ? this.renderer.paragraph({
						type: "paragraph",
						raw: o,
						text: o,
						tokens: [{
							type: "text",
							raw: o,
							text: o
						}]
					}) : o;
					continue;
				}
				default: {
					let e = "Token with \"" + a.type + "\" type was not found.";
					if (this.options.silent) return console.error(e), "";
					throw Error(e);
				}
			}
		}
		return n;
	}
	parseInline(e, t) {
		t ||= this.renderer;
		let n = "";
		for (let r = 0; r < e.length; r++) {
			let i = e[r];
			if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[i.type]) {
				let e = this.options.extensions.renderers[i.type].call({ parser: this }, i);
				if (e !== !1 || ![
					"escape",
					"html",
					"link",
					"image",
					"strong",
					"em",
					"codespan",
					"br",
					"del",
					"text"
				].includes(i.type)) {
					n += e || "";
					continue;
				}
			}
			let a = i;
			switch (a.type) {
				case "escape":
					n += t.text(a);
					break;
				case "html":
					n += t.html(a);
					break;
				case "link":
					n += t.link(a);
					break;
				case "image":
					n += t.image(a);
					break;
				case "strong":
					n += t.strong(a);
					break;
				case "em":
					n += t.em(a);
					break;
				case "codespan":
					n += t.codespan(a);
					break;
				case "br":
					n += t.br(a);
					break;
				case "del":
					n += t.del(a);
					break;
				case "text":
					n += t.text(a);
					break;
				default: {
					let e = "Token with \"" + a.type + "\" type was not found.";
					if (this.options.silent) return console.error(e), "";
					throw Error(e);
				}
			}
		}
		return n;
	}
}, X = class {
	options;
	constructor(e) {
		this.options = e || t;
	}
	static passThroughHooks = /* @__PURE__ */ new Set([
		"preprocess",
		"postprocess",
		"processAllTokens"
	]);
	preprocess(e) {
		return e;
	}
	postprocess(e) {
		return e;
	}
	processAllTokens(e) {
		return e;
	}
}, Z = class {
	defaults = e();
	options = this.setOptions;
	parse = this.#t(K.lex, Y.parse);
	parseInline = this.#t(K.lexInline, Y.parseInline);
	Parser = Y;
	Renderer = q;
	TextRenderer = J;
	Lexer = K;
	Tokenizer = y;
	Hooks = X;
	constructor(...e) {
		this.use(...e);
	}
	walkTokens(e, t) {
		let n = [];
		for (let r of e) switch (n = n.concat(t.call(this, r)), r.type) {
			case "table": {
				let e = r;
				for (let r of e.header) n = n.concat(this.walkTokens(r.tokens, t));
				for (let r of e.rows) for (let e of r) n = n.concat(this.walkTokens(e.tokens, t));
				break;
			}
			case "list": {
				let e = r;
				n = n.concat(this.walkTokens(e.items, t));
				break;
			}
			default: {
				let e = r;
				this.defaults.extensions?.childTokens?.[e.type] ? this.defaults.extensions.childTokens[e.type].forEach((r) => {
					let i = e[r].flat(Infinity);
					n = n.concat(this.walkTokens(i, t));
				}) : e.tokens && (n = n.concat(this.walkTokens(e.tokens, t)));
			}
		}
		return n;
	}
	use(...e) {
		let t = this.defaults.extensions || {
			renderers: {},
			childTokens: {}
		};
		return e.forEach((e) => {
			let n = { ...e };
			if (n.async = this.defaults.async || n.async || !1, e.extensions && (e.extensions.forEach((e) => {
				if (!e.name) throw Error("extension name required");
				if ("renderer" in e) {
					let n = t.renderers[e.name];
					n ? t.renderers[e.name] = function(...t) {
						let r = e.renderer.apply(this, t);
						return r === !1 && (r = n.apply(this, t)), r;
					} : t.renderers[e.name] = e.renderer;
				}
				if ("tokenizer" in e) {
					if (!e.level || e.level !== "block" && e.level !== "inline") throw Error("extension level must be 'block' or 'inline'");
					let n = t[e.level];
					n ? n.unshift(e.tokenizer) : t[e.level] = [e.tokenizer], e.start && (e.level === "block" ? t.startBlock ? t.startBlock.push(e.start) : t.startBlock = [e.start] : e.level === "inline" && (t.startInline ? t.startInline.push(e.start) : t.startInline = [e.start]));
				}
				"childTokens" in e && e.childTokens && (t.childTokens[e.name] = e.childTokens);
			}), n.extensions = t), e.renderer) {
				let t = this.defaults.renderer || new q(this.defaults);
				for (let n in e.renderer) {
					if (!(n in t)) throw Error(`renderer '${n}' does not exist`);
					if (["options", "parser"].includes(n)) continue;
					let r = n, i = e.renderer[r], a = t[r];
					t[r] = (...n) => {
						e.useNewRenderer || (i = this.#e(i, r, t));
						let o = i.apply(t, n);
						return o === !1 && (o = a.apply(t, n)), o || "";
					};
				}
				n.renderer = t;
			}
			if (e.tokenizer) {
				let t = this.defaults.tokenizer || new y(this.defaults);
				for (let n in e.tokenizer) {
					if (!(n in t)) throw Error(`tokenizer '${n}' does not exist`);
					if ([
						"options",
						"rules",
						"lexer"
					].includes(n)) continue;
					let r = n, i = e.tokenizer[r], a = t[r];
					t[r] = (...e) => {
						let n = i.apply(t, e);
						return n === !1 && (n = a.apply(t, e)), n;
					};
				}
				n.tokenizer = t;
			}
			if (e.hooks) {
				let t = this.defaults.hooks || new X();
				for (let n in e.hooks) {
					if (!(n in t)) throw Error(`hook '${n}' does not exist`);
					if (n === "options") continue;
					let r = n, i = e.hooks[r], a = t[r];
					t[r] = X.passThroughHooks.has(n) ? (e) => {
						if (this.defaults.async) return Promise.resolve(i.call(t, e)).then((e) => a.call(t, e));
						let n = i.call(t, e);
						return a.call(t, n);
					} : (...e) => {
						let n = i.apply(t, e);
						return n === !1 && (n = a.apply(t, e)), n;
					};
				}
				n.hooks = t;
			}
			if (e.walkTokens) {
				let t = this.defaults.walkTokens, r = e.walkTokens;
				n.walkTokens = function(e) {
					let n = [];
					return n.push(r.call(this, e)), t && (n = n.concat(t.call(this, e))), n;
				};
			}
			this.defaults = {
				...this.defaults,
				...n
			};
		}), this;
	}
	#e(e, t, n) {
		switch (t) {
			case "heading": return function(r) {
				return !r.type || r.type !== t ? e.apply(this, arguments) : e.call(this, n.parser.parseInline(r.tokens), r.depth, d(n.parser.parseInline(r.tokens, n.parser.textRenderer)));
			};
			case "code": return function(n) {
				return !n.type || n.type !== t ? e.apply(this, arguments) : e.call(this, n.text, n.lang, !!n.escaped);
			};
			case "table": return function(n) {
				if (!n.type || n.type !== t) return e.apply(this, arguments);
				let r = "", i = "";
				for (let e = 0; e < n.header.length; e++) i += this.tablecell({
					text: n.header[e].text,
					tokens: n.header[e].tokens,
					header: !0,
					align: n.align[e]
				});
				r += this.tablerow({ text: i });
				let a = "";
				for (let e = 0; e < n.rows.length; e++) {
					let t = n.rows[e];
					i = "";
					for (let e = 0; e < t.length; e++) i += this.tablecell({
						text: t[e].text,
						tokens: t[e].tokens,
						header: !1,
						align: n.align[e]
					});
					a += this.tablerow({ text: i });
				}
				return e.call(this, r, a);
			};
			case "blockquote": return function(n) {
				if (!n.type || n.type !== t) return e.apply(this, arguments);
				let r = this.parser.parse(n.tokens);
				return e.call(this, r);
			};
			case "list": return function(n) {
				if (!n.type || n.type !== t) return e.apply(this, arguments);
				let r = n.ordered, i = n.start, a = n.loose, o = "";
				for (let e = 0; e < n.items.length; e++) {
					let t = n.items[e], r = t.checked, i = t.task, s = "";
					if (t.task) {
						let e = this.checkbox({ checked: !!r });
						a ? t.tokens.length > 0 && t.tokens[0].type === "paragraph" ? (t.tokens[0].text = e + " " + t.tokens[0].text, t.tokens[0].tokens && t.tokens[0].tokens.length > 0 && t.tokens[0].tokens[0].type === "text" && (t.tokens[0].tokens[0].text = e + " " + t.tokens[0].tokens[0].text)) : t.tokens.unshift({
							type: "text",
							text: e + " "
						}) : s += e + " ";
					}
					s += this.parser.parse(t.tokens, a), o += this.listitem({
						type: "list_item",
						raw: s,
						text: s,
						task: i,
						checked: !!r,
						loose: a,
						tokens: t.tokens
					});
				}
				return e.call(this, o, r, i);
			};
			case "html": return function(n) {
				return !n.type || n.type !== t ? e.apply(this, arguments) : e.call(this, n.text, n.block);
			};
			case "paragraph": return function(n) {
				return !n.type || n.type !== t ? e.apply(this, arguments) : e.call(this, this.parser.parseInline(n.tokens));
			};
			case "escape": return function(n) {
				return !n.type || n.type !== t ? e.apply(this, arguments) : e.call(this, n.text);
			};
			case "link": return function(n) {
				return !n.type || n.type !== t ? e.apply(this, arguments) : e.call(this, n.href, n.title, this.parser.parseInline(n.tokens));
			};
			case "image": return function(n) {
				return !n.type || n.type !== t ? e.apply(this, arguments) : e.call(this, n.href, n.title, n.text);
			};
			case "strong": return function(n) {
				return !n.type || n.type !== t ? e.apply(this, arguments) : e.call(this, this.parser.parseInline(n.tokens));
			};
			case "em": return function(n) {
				return !n.type || n.type !== t ? e.apply(this, arguments) : e.call(this, this.parser.parseInline(n.tokens));
			};
			case "codespan": return function(n) {
				return !n.type || n.type !== t ? e.apply(this, arguments) : e.call(this, n.text);
			};
			case "del": return function(n) {
				return !n.type || n.type !== t ? e.apply(this, arguments) : e.call(this, this.parser.parseInline(n.tokens));
			};
			case "text": return function(n) {
				return !n.type || n.type !== t ? e.apply(this, arguments) : e.call(this, n.text);
			};
		}
		return e;
	}
	setOptions(e) {
		return this.defaults = {
			...this.defaults,
			...e
		}, this;
	}
	lexer(e, t) {
		return K.lex(e, t ?? this.defaults);
	}
	parser(e, t) {
		return Y.parse(e, t ?? this.defaults);
	}
	#t(e, t) {
		return (n, r) => {
			let i = { ...r }, a = {
				...this.defaults,
				...i
			};
			this.defaults.async === !0 && i.async === !1 && (a.silent || console.warn("marked(): The async option was set to true by an extension. The async: false option sent to parse will be ignored."), a.async = !0);
			let o = this.#n(!!a.silent, !!a.async);
			if (n == null) return o(/* @__PURE__ */ Error("marked(): input parameter is undefined or null"));
			if (typeof n != "string") return o(/* @__PURE__ */ Error("marked(): input parameter is of type " + Object.prototype.toString.call(n) + ", string expected"));
			if (a.hooks && (a.hooks.options = a), a.async) return Promise.resolve(a.hooks ? a.hooks.preprocess(n) : n).then((t) => e(t, a)).then((e) => a.hooks ? a.hooks.processAllTokens(e) : e).then((e) => a.walkTokens ? Promise.all(this.walkTokens(e, a.walkTokens)).then(() => e) : e).then((e) => t(e, a)).then((e) => a.hooks ? a.hooks.postprocess(e) : e).catch(o);
			try {
				a.hooks && (n = a.hooks.preprocess(n));
				let r = e(n, a);
				a.hooks && (r = a.hooks.processAllTokens(r)), a.walkTokens && this.walkTokens(r, a.walkTokens);
				let i = t(r, a);
				return a.hooks && (i = a.hooks.postprocess(i)), i;
			} catch (e) {
				return o(e);
			}
		};
	}
	#n(e, t) {
		return (n) => {
			if (n.message += "\nPlease report this to https://github.com/markedjs/marked.", e) {
				let e = "<p>An error occurred:</p><pre>" + l(n.message + "", !0) + "</pre>";
				return t ? Promise.resolve(e) : e;
			}
			if (t) return Promise.reject(n);
			throw n;
		};
	}
}, Q = new Z();
function $(e, t) {
	return Q.parse(e, t);
}
$.options = $.setOptions = function(e) {
	return Q.setOptions(e), $.defaults = Q.defaults, n($.defaults), $;
}, $.getDefaults = e, $.defaults = t, $.use = function(...e) {
	return Q.use(...e), $.defaults = Q.defaults, n($.defaults), $;
}, $.walkTokens = function(e, t) {
	return Q.walkTokens(e, t);
}, $.parseInline = Q.parseInline, $.Parser = Y, $.parser = Y.parse, $.Renderer = q, $.TextRenderer = J, $.Lexer = K, $.lexer = K.lex, $.Tokenizer = y, $.Hooks = X, $.parse = $, $.options, $.setOptions, $.use, $.walkTokens, $.parseInline, Y.parse;
var be = K.lex;
//#endregion
export { be as n, Z as t };
