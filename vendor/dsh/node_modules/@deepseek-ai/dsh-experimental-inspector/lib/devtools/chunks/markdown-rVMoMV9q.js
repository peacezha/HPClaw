import { $ as e, Cn as t, D as n, F as r, Fn as i, Ft as a, G as o, Ht as s, I as c, Nt as l, Ot as u, P as d, Tt as f, Wt as p, _n as m, an as h, bt as g, cn as ee, d as te, g as ne, h as re, ln as _, nt as ie, o as ae, q as oe, rt as v, x as se, xt as y } from "./codemirror-CENmPHF2.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/third_party/codemirror.next/chunk/markdown.js
var ce = class e {
	static create(t, n, r, i, a) {
		return new e(t, n, r, i + (i << 8) + t + (n << 4) | 0, a, [], []);
	}
	constructor(e, t, n, r, i, a, o) {
		this.type = e, this.value = t, this.from = n, this.hash = r, this.end = i, this.children = a, this.positions = o, this.hashProp = [[h.contextHash, r]];
	}
	addChild(e, t) {
		e.prop(h.contextHash) != this.hash && (e = new r(e.type, e.children, e.positions, e.length, this.hashProp)), this.children.push(e), this.positions.push(t);
	}
	toTree(e, t = this.end) {
		let n = this.children.length - 1;
		return n >= 0 && (t = Math.max(t, this.positions[n] + this.children[n].length + this.from)), new r(e.types[this.type], this.children, this.positions, t - this.from).balance({ makeTree: (e, t, n) => new r(_.none, e, t, n, this.hashProp) });
	}
}, b;
(function(e) {
	e[e.Document = 1] = "Document", e[e.CodeBlock = 2] = "CodeBlock", e[e.FencedCode = 3] = "FencedCode", e[e.Blockquote = 4] = "Blockquote", e[e.HorizontalRule = 5] = "HorizontalRule", e[e.BulletList = 6] = "BulletList", e[e.OrderedList = 7] = "OrderedList", e[e.ListItem = 8] = "ListItem", e[e.ATXHeading1 = 9] = "ATXHeading1", e[e.ATXHeading2 = 10] = "ATXHeading2", e[e.ATXHeading3 = 11] = "ATXHeading3", e[e.ATXHeading4 = 12] = "ATXHeading4", e[e.ATXHeading5 = 13] = "ATXHeading5", e[e.ATXHeading6 = 14] = "ATXHeading6", e[e.SetextHeading1 = 15] = "SetextHeading1", e[e.SetextHeading2 = 16] = "SetextHeading2", e[e.HTMLBlock = 17] = "HTMLBlock", e[e.LinkReference = 18] = "LinkReference", e[e.Paragraph = 19] = "Paragraph", e[e.CommentBlock = 20] = "CommentBlock", e[e.ProcessingInstructionBlock = 21] = "ProcessingInstructionBlock", e[e.Escape = 22] = "Escape", e[e.Entity = 23] = "Entity", e[e.HardBreak = 24] = "HardBreak", e[e.Emphasis = 25] = "Emphasis", e[e.StrongEmphasis = 26] = "StrongEmphasis", e[e.Link = 27] = "Link", e[e.Image = 28] = "Image", e[e.InlineCode = 29] = "InlineCode", e[e.HTMLTag = 30] = "HTMLTag", e[e.Comment = 31] = "Comment", e[e.ProcessingInstruction = 32] = "ProcessingInstruction", e[e.Autolink = 33] = "Autolink", e[e.HeaderMark = 34] = "HeaderMark", e[e.QuoteMark = 35] = "QuoteMark", e[e.ListMark = 36] = "ListMark", e[e.LinkMark = 37] = "LinkMark", e[e.EmphasisMark = 38] = "EmphasisMark", e[e.CodeMark = 39] = "CodeMark", e[e.CodeText = 40] = "CodeText", e[e.CodeInfo = 41] = "CodeInfo", e[e.LinkTitle = 42] = "LinkTitle", e[e.LinkLabel = 43] = "LinkLabel", e[e.URL = 44] = "URL";
})(b ||= {});
var le = class {
	constructor(e, t) {
		this.start = e, this.content = t, this.marks = [], this.parsers = [];
	}
}, ue = class {
	constructor() {
		this.text = "", this.baseIndent = 0, this.basePos = 0, this.depth = 0, this.markers = [], this.pos = 0, this.indent = 0, this.next = -1;
	}
	forward() {
		this.basePos > this.pos && this.forwardInner();
	}
	forwardInner() {
		let e = this.skipSpace(this.basePos);
		this.indent = this.countIndent(e, this.pos, this.indent), this.pos = e, this.next = e == this.text.length ? -1 : this.text.charCodeAt(e);
	}
	skipSpace(e) {
		return S(this.text, e);
	}
	reset(e) {
		for (this.text = e, this.baseIndent = this.basePos = this.pos = this.indent = 0, this.forwardInner(), this.depth = 1; this.markers.length;) this.markers.pop();
	}
	moveBase(e) {
		this.basePos = e, this.baseIndent = this.countIndent(e, this.pos, this.indent);
	}
	moveBaseColumn(e) {
		this.baseIndent = e, this.basePos = this.findColumn(e);
	}
	addMarker(e) {
		this.markers.push(e);
	}
	countIndent(e, t = 0, n = 0) {
		for (let r = t; r < e; r++) n += this.text.charCodeAt(r) == 9 ? 4 - n % 4 : 1;
		return n;
	}
	findColumn(e) {
		let t = 0;
		for (let n = 0; t < this.text.length && n < e; t++) n += this.text.charCodeAt(t) == 9 ? 4 - n % 4 : 1;
		return t;
	}
	scrub() {
		if (!this.baseIndent) return this.text;
		let e = "";
		for (let t = 0; t < this.basePos; t++) e += " ";
		return e + this.text.slice(this.basePos);
	}
};
function de(e, t, n) {
	if (n.pos == n.text.length || e != t.block && n.indent >= t.stack[n.depth + 1].value + n.baseIndent) return !0;
	if (n.indent >= n.baseIndent + 4) return !1;
	let r = (e.type == b.OrderedList ? E : T)(n, t, !1);
	return r > 0 && (e.type != b.BulletList || C(n, t, !1) < 0) && n.text.charCodeAt(n.pos + r - 1) == e.value;
}
var fe = {
	[b.Blockquote]: (e, t, n) => n.next == 62 && (n.markers.push(R(b.QuoteMark, t.lineStart + n.pos, t.lineStart + n.pos + 1)), n.moveBase(n.pos + (x(n.text.charCodeAt(n.pos + 1)) ? 2 : 1)), e.end = t.lineStart + n.text.length, !0),
	[b.ListItem]: (e, t, n) => !(n.indent < n.baseIndent + e.value && n.next > -1) && (n.moveBaseColumn(n.baseIndent + e.value), !0),
	[b.OrderedList]: de,
	[b.BulletList]: de,
	[b.Document]: () => !0
};
function x(e) {
	return e == 32 || e == 9 || e == 10 || e == 13;
}
function S(e, t = 0) {
	for (; t < e.length && x(e.charCodeAt(t));) t++;
	return t;
}
function pe(e, t, n) {
	for (; t > n && x(e.charCodeAt(t - 1));) t--;
	return t;
}
function me(e) {
	if (e.next != 96 && e.next != 126) return -1;
	let t = e.pos + 1;
	for (; t < e.text.length && e.text.charCodeAt(t) == e.next;) t++;
	if (t < e.pos + 3) return -1;
	if (e.next == 96) {
		for (let n = t; n < e.text.length; n++) if (e.text.charCodeAt(n) == 96) return -1;
	}
	return t;
}
function he(e) {
	return e.next == 62 ? e.text.charCodeAt(e.pos + 1) == 32 ? 2 : 1 : -1;
}
function C(e, t, n) {
	if (e.next != 42 && e.next != 45 && e.next != 95) return -1;
	let r = 1;
	for (let t = e.pos + 1; t < e.text.length; t++) {
		let n = e.text.charCodeAt(t);
		if (n == e.next) r++;
		else if (!x(n)) return -1;
	}
	return n && e.next == 45 && ge(e) > -1 && e.depth == t.stack.length && t.parser.leafBlockParsers.indexOf(Ce.SetextHeading) > -1 || r < 3 ? -1 : 1;
}
function w(e, t) {
	for (let n = e.stack.length - 1; n >= 0; n--) if (e.stack[n].type == t) return !0;
	return !1;
}
function T(e, t, n) {
	return e.next != 45 && e.next != 43 && e.next != 42 || e.pos != e.text.length - 1 && !x(e.text.charCodeAt(e.pos + 1)) || !(!n || w(t, b.BulletList) || e.skipSpace(e.pos + 2) < e.text.length) ? -1 : 1;
}
function E(e, t, n) {
	let r = e.pos, i = e.next;
	for (; i >= 48 && i <= 57;) {
		if (r++, r == e.text.length) return -1;
		i = e.text.charCodeAt(r);
	}
	return r == e.pos || r > e.pos + 9 || i != 46 && i != 41 || r < e.text.length - 1 && !x(e.text.charCodeAt(r + 1)) || n && !w(t, b.OrderedList) && (e.skipSpace(r + 1) == e.text.length || r > e.pos + 1 || e.next != 49) ? -1 : r + 1 - e.pos;
}
function D(e) {
	if (e.next != 35) return -1;
	let t = e.pos + 1;
	for (; t < e.text.length && e.text.charCodeAt(t) == 35;) t++;
	if (t < e.text.length && e.text.charCodeAt(t) != 32) return -1;
	let n = t - e.pos;
	return n > 6 ? -1 : n;
}
function ge(e) {
	if (e.next != 45 && e.next != 61 || e.indent >= e.baseIndent + 4) return -1;
	let t = e.pos + 1;
	for (; t < e.text.length && e.text.charCodeAt(t) == e.next;) t++;
	let n = t;
	for (; t < e.text.length && x(e.text.charCodeAt(t));) t++;
	return t == e.text.length ? n : -1;
}
var O = /^[ \t]*$/, _e = /-->/, ve = /\?>/, k = [
	[/^<(?:script|pre|style)(?:\s|>|$)/i, /<\/(?:script|pre|style)>/i],
	[/^\s*<!--/, _e],
	[/^\s*<\?/, ve],
	[/^\s*<![A-Z]/, />/],
	[/^\s*<!\[CDATA\[/, /\]\]>/],
	[/^\s*<\/?(?:address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h1|h2|h3|h4|h5|h6|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul)(?:\s|\/?>|$)/i, O],
	[/^\s*(?:<\/[a-z][\w-]*\s*>|<[a-z][\w-]*(\s+[a-z:_][\w-.]*(?:\s*=\s*(?:[^\s"'=<>`]+|'[^']*'|"[^"]*"))?)*\s*>)\s*$/i, O]
];
function ye(e, t, n) {
	if (e.next != 60) return -1;
	let r = e.text.slice(e.pos);
	for (let e = 0, t = k.length - +!!n; e < t; e++) if (k[e][0].test(r)) return e;
	return -1;
}
function be(e, t) {
	let n = e.countIndent(t, e.pos, e.indent), r = e.countIndent(e.skipSpace(t), t, n);
	return r >= n + 5 ? n + 1 : r;
}
function A(e, t, n) {
	let r = e.length - 1;
	r >= 0 && e[r].to == t && e[r].type == b.CodeText ? e[r].to = n : e.push(R(b.CodeText, t, n));
}
var j = {
	LinkReference: void 0,
	IndentedCode(e, t) {
		let n = t.baseIndent + 4;
		if (t.indent < n) return !1;
		let r = t.findColumn(n), i = e.lineStart + r, a = e.lineStart + t.text.length, o = [], s = [];
		for (A(o, i, a); e.nextLine() && t.depth >= e.stack.length;) if (t.pos == t.text.length) {
			A(s, e.lineStart - 1, e.lineStart);
			for (let e of t.markers) s.push(e);
		} else {
			if (t.indent < n) break;
			{
				if (s.length) {
					for (let e of s) e.type == b.CodeText ? A(o, e.from, e.to) : o.push(e);
					s = [];
				}
				A(o, e.lineStart - 1, e.lineStart);
				for (let e of t.markers) o.push(e);
				a = e.lineStart + t.text.length;
				let n = e.lineStart + t.findColumn(t.baseIndent + 4);
				n < a && A(o, n, a);
			}
		}
		return s.length && (s = s.filter((e) => e.type != b.CodeText), s.length && (t.markers = s.concat(t.markers))), e.addNode(e.buffer.writeElements(o, -i).finish(b.CodeBlock, a - i), i), !0;
	},
	FencedCode(e, t) {
		let n = me(t);
		if (n < 0) return !1;
		let r = e.lineStart + t.pos, i = t.next, a = n - t.pos, o = t.skipSpace(n), s = pe(t.text, t.text.length, o), c = [R(b.CodeMark, r, r + a)];
		o < s && c.push(R(b.CodeInfo, e.lineStart + o, e.lineStart + s));
		for (let n = !0; e.nextLine() && t.depth >= e.stack.length; n = !1) {
			let r = t.pos;
			if (t.indent - t.baseIndent < 4) for (; r < t.text.length && t.text.charCodeAt(r) == i;) r++;
			if (r - t.pos >= a && t.skipSpace(r) == t.text.length) {
				for (let e of t.markers) c.push(e);
				c.push(R(b.CodeMark, e.lineStart + t.pos, e.lineStart + r)), e.nextLine();
				break;
			}
			{
				n || A(c, e.lineStart - 1, e.lineStart);
				for (let e of t.markers) c.push(e);
				let r = e.lineStart + t.basePos, i = e.lineStart + t.text.length;
				r < i && A(c, r, i);
			}
		}
		return e.addNode(e.buffer.writeElements(c, -r).finish(b.FencedCode, e.prevLineEnd() - r), r), !0;
	},
	Blockquote(e, t) {
		let n = he(t);
		return !(n < 0) && (e.startContext(b.Blockquote, t.pos), e.addNode(b.QuoteMark, e.lineStart + t.pos, e.lineStart + t.pos + 1), t.moveBase(t.pos + n), null);
	},
	HorizontalRule(e, t) {
		if (C(t, e, !1) < 0) return !1;
		let n = e.lineStart + t.pos;
		return e.nextLine(), e.addNode(b.HorizontalRule, n), !0;
	},
	BulletList(e, t) {
		let n = T(t, e, !1);
		if (n < 0) return !1;
		e.block.type != b.BulletList && e.startContext(b.BulletList, t.basePos, t.next);
		let r = be(t, t.pos + 1);
		return e.startContext(b.ListItem, t.basePos, r - t.baseIndent), e.addNode(b.ListMark, e.lineStart + t.pos, e.lineStart + t.pos + n), t.moveBaseColumn(r), null;
	},
	OrderedList(e, t) {
		let n = E(t, e, !1);
		if (n < 0) return !1;
		e.block.type != b.OrderedList && e.startContext(b.OrderedList, t.basePos, t.text.charCodeAt(t.pos + n - 1));
		let r = be(t, t.pos + n);
		return e.startContext(b.ListItem, t.basePos, r - t.baseIndent), e.addNode(b.ListMark, e.lineStart + t.pos, e.lineStart + t.pos + n), t.moveBaseColumn(r), null;
	},
	ATXHeading(e, t) {
		let n = D(t);
		if (n < 0) return !1;
		let r = t.pos, i = e.lineStart + r, a = pe(t.text, t.text.length, r), o = a;
		for (; o > r && t.text.charCodeAt(o - 1) == t.next;) o--;
		o != a && o != r && x(t.text.charCodeAt(o - 1)) || (o = t.text.length);
		let s = e.buffer.write(b.HeaderMark, 0, n).writeElements(e.parser.parseInline(t.text.slice(r + n + 1, o), i + n + 1), -i);
		o < t.text.length && s.write(b.HeaderMark, o - r, a - r);
		let c = s.finish(b.ATXHeading1 - 1 + n, t.text.length - r);
		return e.nextLine(), e.addNode(c, i), !0;
	},
	HTMLBlock(e, t) {
		let n = ye(t, 0, !1);
		if (n < 0) return !1;
		let r = e.lineStart + t.pos, i = k[n][1], a = [], o = i != O;
		for (; !i.test(t.text) && e.nextLine();) {
			if (t.depth < e.stack.length) {
				o = !1;
				break;
			}
			for (let e of t.markers) a.push(e);
		}
		o && e.nextLine();
		let s = i == _e ? b.CommentBlock : i == ve ? b.ProcessingInstructionBlock : b.HTMLBlock, c = e.prevLineEnd();
		return e.addNode(e.buffer.writeElements(a, -r).finish(s, c - r), r), !0;
	},
	SetextHeading: void 0
}, xe = class {
	constructor(e) {
		this.stage = 0, this.elts = [], this.pos = 0, this.start = e.start, this.advance(e.content);
	}
	nextLine(e, t, n) {
		if (this.stage == -1) return !1;
		let r = n.content + "\n" + t.scrub(), i = this.advance(r);
		return i > -1 && i < r.length && this.complete(e, n, i);
	}
	finish(e, t) {
		return (this.stage == 2 || this.stage == 3) && S(t.content, this.pos) == t.content.length && this.complete(e, t, t.content.length);
	}
	complete(e, t, n) {
		return e.addLeafElement(t, R(b.LinkReference, this.start, this.start + n, this.elts)), !0;
	}
	nextStage(e) {
		return e ? (this.pos = e.to - this.start, this.elts.push(e), this.stage++, !0) : (!1 === e && (this.stage = -1), !1);
	}
	advance(e) {
		for (;;) {
			if (this.stage == -1) return -1;
			if (this.stage == 0) {
				if (!this.nextStage(Re(e, this.pos, this.start, !0))) return -1;
				if (e.charCodeAt(this.pos) != 58) return this.stage = -1;
				this.elts.push(R(b.LinkMark, this.pos + this.start, this.pos + this.start + 1)), this.pos++;
			} else {
				if (this.stage != 1) {
					if (this.stage == 2) {
						let t = S(e, this.pos), n = 0;
						if (t > this.pos) {
							let r = Le(e, t, this.start);
							if (r) {
								let t = M(e, r.to - this.start);
								t > 0 && (this.nextStage(r), n = t);
							}
						}
						return n ||= M(e, this.pos), n > 0 && n < e.length ? n : -1;
					}
					return M(e, this.pos);
				}
				if (!this.nextStage(Ie(e, S(e, this.pos), this.start))) return -1;
			}
		}
	}
};
function M(e, t) {
	for (; t < e.length; t++) {
		let n = e.charCodeAt(t);
		if (n == 10) break;
		if (!x(n)) return -1;
	}
	return t;
}
var Se = class {
	nextLine(e, t, n) {
		let r = t.depth < e.stack.length ? -1 : ge(t), i = t.next;
		if (r < 0) return !1;
		let a = R(b.HeaderMark, e.lineStart + t.pos, e.lineStart + r);
		return e.nextLine(), e.addLeafElement(n, R(i == 61 ? b.SetextHeading1 : b.SetextHeading2, n.start, e.prevLineEnd(), [...e.parser.parseInline(n.content, n.start), a])), !0;
	}
	finish() {
		return !1;
	}
}, Ce = {
	LinkReference: (e, t) => t.content.charCodeAt(0) == 91 ? new xe(t) : null,
	SetextHeading: () => new Se()
}, we = [
	(e, t) => D(t) >= 0,
	(e, t) => me(t) >= 0,
	(e, t) => he(t) >= 0,
	(e, t) => T(t, e, !0) >= 0,
	(e, t) => E(t, e, !0) >= 0,
	(e, t) => C(t, e, !0) >= 0,
	(e, t) => ye(t, 0, !0) >= 0
], Te = {
	text: "",
	end: 0
}, Ee = class {
	constructor(e, t, n, r) {
		this.parser = e, this.input = t, this.ranges = r, this.line = new ue(), this.atEnd = !1, this.reusePlaceholders = /* @__PURE__ */ new Map(), this.stoppedAt = null, this.rangeI = 0, this.to = r[r.length - 1].to, this.lineStart = this.absoluteLineStart = this.absoluteLineEnd = r[0].from, this.block = ce.create(b.Document, 0, this.lineStart, 0, 0), this.stack = [this.block], this.fragments = n.length ? new Ve(n, t) : null, this.readLine();
	}
	get parsedPos() {
		return this.absoluteLineStart;
	}
	advance() {
		if (this.stoppedAt != null && this.absoluteLineStart > this.stoppedAt) return this.finish();
		let { line: e } = this;
		for (;;) {
			for (let t = 0;;) {
				let n = e.depth < this.stack.length ? this.stack[this.stack.length - 1] : null;
				for (; t < e.markers.length && (!n || e.markers[t].from < n.end);) {
					let n = e.markers[t++];
					this.addNode(n.type, n.from, n.to);
				}
				if (!n) break;
				this.finishContext();
			}
			if (e.pos < e.text.length) break;
			if (!this.nextLine()) return this.finish();
		}
		if (this.fragments && this.reuseFragment(e.basePos)) return null;
		e: for (;;) {
			for (let t of this.parser.blockParsers) if (t) {
				let n = t(this, e);
				if (n != 0) {
					if (n == 1) return null;
					e.forward();
					continue e;
				}
			}
			break;
		}
		let t = new le(this.lineStart + e.pos, e.text.slice(e.pos));
		for (let e of this.parser.leafBlockParsers) if (e) {
			let n = e(this, t);
			n && t.parsers.push(n);
		}
		e: for (; this.nextLine() && e.pos != e.text.length;) {
			if (e.indent < e.baseIndent + 4) {
				for (let n of this.parser.endLeafBlock) if (n(this, e, t)) break e;
			}
			for (let n of t.parsers) if (n.nextLine(this, e, t)) return null;
			t.content += "\n" + e.scrub();
			for (let n of e.markers) t.marks.push(n);
		}
		return this.finishLeaf(t), null;
	}
	stopAt(e) {
		if (this.stoppedAt != null && this.stoppedAt < e) throw RangeError("Can't move stoppedAt forward");
		this.stoppedAt = e;
	}
	reuseFragment(e) {
		if (!this.fragments.moveTo(this.absoluteLineStart + e, this.absoluteLineStart) || !this.fragments.matches(this.block.hash)) return !1;
		let t = this.fragments.takeNodes(this);
		return !!t && (this.absoluteLineStart += t, this.lineStart = He(this.absoluteLineStart, this.ranges), this.moveRangeI(), this.absoluteLineStart < this.to ? (this.lineStart++, this.absoluteLineStart++, this.readLine()) : (this.atEnd = !0, this.readLine()), !0);
	}
	get depth() {
		return this.stack.length;
	}
	parentType(e = this.depth - 1) {
		return this.parser.nodeSet.types[this.stack[e].type];
	}
	nextLine() {
		return this.lineStart += this.line.text.length, this.absoluteLineEnd >= this.to ? (this.absoluteLineStart = this.absoluteLineEnd, this.atEnd = !0, this.readLine(), !1) : (this.lineStart++, this.absoluteLineStart = this.absoluteLineEnd + 1, this.moveRangeI(), this.readLine(), !0);
	}
	peekLine() {
		return this.scanLine(this.absoluteLineEnd + 1).text;
	}
	moveRangeI() {
		for (; this.rangeI < this.ranges.length - 1 && this.absoluteLineStart >= this.ranges[this.rangeI].to;) this.rangeI++, this.absoluteLineStart = Math.max(this.absoluteLineStart, this.ranges[this.rangeI].from);
	}
	scanLine(e) {
		let t = Te;
		if (t.end = e, e >= this.to) t.text = "";
		else if (t.text = this.lineChunkAt(e), t.end += t.text.length, this.ranges.length > 1) {
			let e = this.absoluteLineStart, n = this.rangeI;
			for (; this.ranges[n].to < t.end;) {
				n++;
				let r = this.ranges[n].from, i = this.lineChunkAt(r);
				t.end = r + i.length, t.text = t.text.slice(0, this.ranges[n - 1].to - e) + i, e = t.end - t.text.length;
			}
		}
		return t;
	}
	readLine() {
		let { line: e } = this, { text: t, end: n } = this.scanLine(this.absoluteLineStart);
		for (this.absoluteLineEnd = n, e.reset(t); e.depth < this.stack.length; e.depth++) {
			let t = this.stack[e.depth], n = this.parser.skipContextMarkup[t.type];
			if (!n) throw Error("Unhandled block context " + b[t.type]);
			if (!n(t, this, e)) break;
			e.forward();
		}
	}
	lineChunkAt(e) {
		let t, n = this.input.chunk(e);
		if (this.input.lineChunks) t = n == "\n" ? "" : n;
		else {
			let e = n.indexOf("\n");
			t = e < 0 ? n : n.slice(0, e);
		}
		return e + t.length > this.to ? t.slice(0, this.to - e) : t;
	}
	prevLineEnd() {
		return this.atEnd ? this.lineStart : this.lineStart - 1;
	}
	startContext(e, t, n = 0) {
		this.block = ce.create(e, n, this.lineStart + t, this.block.hash, this.lineStart + this.line.text.length), this.stack.push(this.block);
	}
	startComposite(e, t, n = 0) {
		this.startContext(this.parser.getNodeType(e), t, n);
	}
	addNode(e, t, n) {
		typeof e == "number" && (e = new r(this.parser.nodeSet.types[e], I, I, (n ?? this.prevLineEnd()) - t)), this.block.addChild(e, t - this.block.from);
	}
	addElement(e) {
		this.block.addChild(e.toTree(this.parser.nodeSet), e.from - this.block.from);
	}
	addLeafElement(e, t) {
		this.addNode(this.buffer.writeElements(W(t.children, e.marks), -t.from).finish(t.type, t.to - t.from), t.from);
	}
	finishContext() {
		let e = this.stack.pop(), t = this.stack[this.stack.length - 1];
		t.addChild(e.toTree(this.parser.nodeSet), e.from - t.from), this.block = t;
	}
	finish() {
		for (; this.stack.length > 1;) this.finishContext();
		return this.addGaps(this.block.toTree(this.parser.nodeSet, this.lineStart));
	}
	addGaps(e) {
		return this.ranges.length > 1 ? De(this.ranges, 0, e.topNode, this.ranges[0].from, this.reusePlaceholders) : e;
	}
	finishLeaf(e) {
		for (let t of e.parsers) if (t.finish(this, e)) return;
		let t = W(this.parser.parseInline(e.content, e.start), e.marks);
		this.addNode(this.buffer.writeElements(t, -e.start).finish(b.Paragraph, e.content.length), e.start);
	}
	elt(e, t, n, r) {
		return typeof e == "string" ? R(this.parser.getNodeType(e), t, n, r) : new je(e, t);
	}
	get buffer() {
		return new Ae(this.parser.nodeSet);
	}
};
function De(e, t, n, i, a) {
	let o = e[t].to, s = [], c = [], l = n.from + i;
	function u(n, r) {
		for (; r ? n >= o : n > o;) {
			let r = e[t + 1].from - o;
			i += r, n += r, t++, o = e[t].to;
		}
	}
	for (let r = n.firstChild; r; r = r.nextSibling) {
		u(r.from + i, !0);
		let n, d = r.from + i, f = a.get(r.tree);
		f ? n = f : r.to + i > o ? (n = De(e, t, r, i, a), u(r.to + i, !1)) : n = r.toTree(), s.push(n), c.push(d - l);
	}
	return u(n.to + i, !1), new r(n.type, s, c, n.to + i - l, n.tree ? n.tree.propValues : void 0);
}
var Oe = class e extends ae {
	constructor(e, t, n, r, i, a, o, s, c) {
		super(), this.nodeSet = e, this.blockParsers = t, this.leafBlockParsers = n, this.blockNames = r, this.endLeafBlock = i, this.skipContextMarkup = a, this.inlineParsers = o, this.inlineNames = s, this.wrappers = c, this.nodeTypes = Object.create(null);
		for (let t of e.types) this.nodeTypes[t.name] = t.id;
	}
	createParse(e, t, n) {
		let r = new Ee(this, e, t, n);
		for (let i of this.wrappers) r = i(r, e, t, n);
		return r;
	}
	configure(t) {
		let n = P(t);
		if (!n) return this;
		let { nodeSet: r, skipContextMarkup: i } = this, o = this.blockParsers.slice(), s = this.leafBlockParsers.slice(), l = this.blockNames.slice(), u = this.inlineParsers.slice(), d = this.inlineNames.slice(), p = this.endLeafBlock.slice(), m = this.wrappers;
		if (N(n.defineNodes)) {
			i = Object.assign({}, i);
			let e, t = r.types.slice();
			for (let r of n.defineNodes) {
				let { name: n, block: a, composite: o, style: s } = typeof r == "string" ? { name: r } : r;
				if (t.some((e) => e.name == n)) continue;
				o && (i[t.length] = (e, t, n) => o(t, n, e.value));
				let l = t.length, u = o ? ["Block", "BlockContext"] : a ? l >= b.ATXHeading1 && l <= b.SetextHeading2 ? [
					"Block",
					"LeafBlock",
					"Heading"
				] : ["Block", "LeafBlock"] : void 0;
				t.push(_.define({
					id: l,
					name: n,
					props: u && [[h.group, u]]
				})), s && (e ||= {}, Array.isArray(s) || s instanceof c ? e[n] = s : Object.assign(e, s));
			}
			r = new f(t), e && (r = r.extend(a(e)));
		}
		if (N(n.props) && (r = r.extend(...n.props)), N(n.remove)) for (let e of n.remove) {
			let t = this.blockNames.indexOf(e), n = this.inlineNames.indexOf(e);
			t > -1 && (o[t] = s[t] = void 0), n > -1 && (u[n] = void 0);
		}
		if (N(n.parseBlock)) for (let e of n.parseBlock) {
			let t = l.indexOf(e.name);
			if (t > -1) o[t] = e.parse, s[t] = e.leaf;
			else {
				let t = e.before ? F(l, e.before) : e.after ? F(l, e.after) + 1 : l.length - 1;
				o.splice(t, 0, e.parse), s.splice(t, 0, e.leaf), l.splice(t, 0, e.name);
			}
			e.endLeaf && p.push(e.endLeaf);
		}
		if (N(n.parseInline)) for (let e of n.parseInline) {
			let t = d.indexOf(e.name);
			if (t > -1) u[t] = e.parse;
			else {
				let t = e.before ? F(d, e.before) : e.after ? F(d, e.after) + 1 : d.length - 1;
				u.splice(t, 0, e.parse), d.splice(t, 0, e.name);
			}
		}
		return n.wrap && (m = m.concat(n.wrap)), new e(r, o, s, l, p, i, u, d, m);
	}
	getNodeType(e) {
		let t = this.nodeTypes[e];
		if (t == null) throw RangeError(`Unknown node type '${e}'`);
		return t;
	}
	parseInline(e, t) {
		let n = new ze(this, e, t);
		e: for (let e = t; e < n.end;) {
			let t = n.char(e);
			for (let r of this.inlineParsers) if (r) {
				let i = r(n, t, e);
				if (i >= 0) {
					e = i;
					continue e;
				}
			}
			e++;
		}
		return n.resolveMarkers(0);
	}
};
function N(e) {
	return e != null && e.length > 0;
}
function P(e) {
	if (!Array.isArray(e)) return e;
	if (e.length == 0) return null;
	let t = P(e[0]);
	if (e.length == 1) return t;
	let n = P(e.slice(1));
	if (!n || !t) return t || n;
	let r = (e, t) => (e || I).concat(t || I), i = t.wrap, a = n.wrap;
	return {
		props: r(t.props, n.props),
		defineNodes: r(t.defineNodes, n.defineNodes),
		parseBlock: r(t.parseBlock, n.parseBlock),
		parseInline: r(t.parseInline, n.parseInline),
		remove: r(t.remove, n.remove),
		wrap: i ? a ? (e, t, n, r) => i(a(e, t, n, r), t, n, r) : i : a
	};
}
function F(e, t) {
	let n = e.indexOf(t);
	if (n < 0) throw RangeError(`Position specified relative to unknown parser ${t}`);
	return n;
}
var ke = [_.none];
for (let e, t = 1; e = b[t]; t++) ke[t] = _.define({
	id: t,
	name: e,
	props: t >= b.Escape ? [] : [[h.group, t in fe ? ["Block", "BlockContext"] : ["Block", "LeafBlock"]]],
	top: e == "Document"
});
var I = [], Ae = class {
	constructor(e) {
		this.nodeSet = e, this.content = [], this.nodes = [];
	}
	write(e, t, n, r = 0) {
		return this.content.push(e, t, n, 4 + 4 * r), this;
	}
	writeElements(e, t = 0) {
		for (let n of e) n.writeTo(this, t);
		return this;
	}
	finish(e, t) {
		return r.build({
			buffer: this.content,
			nodeSet: this.nodeSet,
			reused: this.nodes,
			topID: e,
			length: t
		});
	}
}, L = class {
	constructor(e, t, n, r = I) {
		this.type = e, this.from = t, this.to = n, this.children = r;
	}
	writeTo(e, t) {
		let n = e.content.length;
		e.writeElements(this.children, t), e.content.push(this.type, this.from + t, this.to + t, e.content.length + 4 - n);
	}
	toTree(e) {
		return new Ae(e).writeElements(this.children, -this.from).finish(this.type, this.to - this.from);
	}
}, je = class {
	constructor(e, t) {
		this.tree = e, this.from = t;
	}
	get to() {
		return this.from + this.tree.length;
	}
	get type() {
		return this.tree.type.id;
	}
	get children() {
		return I;
	}
	writeTo(e, t) {
		e.nodes.push(this.tree), e.content.push(e.nodes.length - 1, this.from + t, this.to + t, -1);
	}
	toTree() {
		return this.tree;
	}
};
function R(e, t, n, r) {
	return new L(e, t, n, r);
}
var Me = {
	resolve: "Emphasis",
	mark: "EmphasisMark"
}, Ne = {
	resolve: "Emphasis",
	mark: "EmphasisMark"
}, z = {}, B = {}, V = class {
	constructor(e, t, n, r) {
		this.type = e, this.from = t, this.to = n, this.side = r;
	}
}, Pe = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~", H = /[!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~\xA1\u2010-\u2027]/;
try {
	H = /* @__PURE__ */ RegExp("[\\p{S}|\\p{P}]", "u");
} catch {}
var U = {
	Escape(e, t, n) {
		if (t != 92 || n == e.end - 1) return -1;
		let r = e.char(n + 1);
		for (let t = 0; t < 32; t++) if (Pe.charCodeAt(t) == r) return e.append(R(b.Escape, n, n + 2));
		return -1;
	},
	Entity(e, t, n) {
		if (t != 38) return -1;
		let r = /^(?:#\d+|#x[a-f\d]+|\w+);/i.exec(e.slice(n + 1, n + 31));
		return r ? e.append(R(b.Entity, n, n + 1 + r[0].length)) : -1;
	},
	InlineCode(e, t, n) {
		if (t != 96 || n && e.char(n - 1) == 96) return -1;
		let r = n + 1;
		for (; r < e.end && e.char(r) == 96;) r++;
		let i = r - n, a = 0;
		for (; r < e.end; r++) if (e.char(r) == 96) {
			if (a++, a == i && e.char(r + 1) != 96) return e.append(R(b.InlineCode, n, r + 1, [R(b.CodeMark, n, n + i), R(b.CodeMark, r + 1 - i, r + 1)]));
		} else a = 0;
		return -1;
	},
	HTMLTag(e, t, n) {
		if (t != 60 || n == e.end - 1) return -1;
		let r = e.slice(n + 1, e.end), i = /^(?:[a-z][-\w+.]+:[^\s>]+|[a-z\d.!#$%&'*+/=?^_`{|}~-]+@[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?(?:\.[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?)*)>/i.exec(r);
		if (i) return e.append(R(b.Autolink, n, n + 1 + i[0].length, [
			R(b.LinkMark, n, n + 1),
			R(b.URL, n + 1, n + i[0].length),
			R(b.LinkMark, n + i[0].length, n + 1 + i[0].length)
		]));
		let a = /^!--[^>](?:-[^-]|[^-])*?-->/i.exec(r);
		if (a) return e.append(R(b.Comment, n, n + 1 + a[0].length));
		let o = /^\?[^]*?\?>/.exec(r);
		if (o) return e.append(R(b.ProcessingInstruction, n, n + 1 + o[0].length));
		let s = /^(?:![A-Z][^]*?>|!\[CDATA\[[^]*?\]\]>|\/\s*[a-zA-Z][\w-]*\s*>|\s*[a-zA-Z][\w-]*(\s+[a-zA-Z:_][\w-.:]*(?:\s*=\s*(?:[^\s"'=<>`]+|'[^']*'|"[^"]*"))?)*\s*(\/\s*)?>)/.exec(r);
		return s ? e.append(R(b.HTMLTag, n, n + 1 + s[0].length)) : -1;
	},
	Emphasis(e, t, n) {
		if (t != 95 && t != 42) return -1;
		let r = n + 1;
		for (; e.char(r) == t;) r++;
		let i = e.slice(n - 1, n), a = e.slice(r, r + 1), o = H.test(i), s = H.test(a), c = /\s|^$/.test(i), l = /\s|^$/.test(a), u = !l && (!s || c || o), d = !c && (!o || l || s), f = u && (t == 42 || !d || o), p = d && (t == 42 || !u || s);
		return e.append(new V(t == 95 ? Me : Ne, n, r, !!f | (p ? 2 : 0)));
	},
	HardBreak(e, t, n) {
		if (t == 92 && e.char(n + 1) == 10) return e.append(R(b.HardBreak, n, n + 2));
		if (t == 32) {
			let t = n + 1;
			for (; e.char(t) == 32;) t++;
			if (e.char(t) == 10 && t >= n + 2) return e.append(R(b.HardBreak, n, t + 1));
		}
		return -1;
	},
	Link: (e, t, n) => t == 91 ? e.append(new V(z, n, n + 1, 1)) : -1,
	Image: (e, t, n) => t == 33 && e.char(n + 1) == 91 ? e.append(new V(B, n, n + 2, 1)) : -1,
	LinkEnd(e, t, n) {
		if (t != 93) return -1;
		for (let t = e.parts.length - 1; t >= 0; t--) {
			let r = e.parts[t];
			if (r instanceof V && (r.type == z || r.type == B)) {
				if (!r.side || e.skipSpace(r.to) == n && !/[(\[]/.test(e.slice(n + 1, n + 2))) return e.parts[t] = null, -1;
				let i = e.takeContent(t), a = e.parts[t] = Fe(e, i, r.type == z ? b.Link : b.Image, r.from, n + 1);
				if (r.type == z) for (let n = 0; n < t; n++) {
					let t = e.parts[n];
					t instanceof V && t.type == z && (t.side = 0);
				}
				return a.to;
			}
		}
		return -1;
	}
};
function Fe(e, t, n, r, i) {
	let { text: a } = e, o = e.char(i), s = i;
	if (t.unshift(R(b.LinkMark, r, r + (n == b.Image ? 2 : 1))), t.push(R(b.LinkMark, i - 1, i)), o == 40) {
		let n, r = e.skipSpace(i + 1), o = Ie(a, r - e.offset, e.offset);
		o && (r = e.skipSpace(o.to), r != o.to && (n = Le(a, r - e.offset, e.offset), n && (r = e.skipSpace(n.to)))), e.char(r) == 41 && (t.push(R(b.LinkMark, i, i + 1)), s = r + 1, o && t.push(o), n && t.push(n), t.push(R(b.LinkMark, r, s)));
	} else if (o == 91) {
		let n = Re(a, i - e.offset, e.offset, !1);
		n && (t.push(n), s = n.to);
	}
	return R(n, r, s, t);
}
function Ie(e, t, n) {
	if (e.charCodeAt(t) == 60) {
		for (let r = t + 1; r < e.length; r++) {
			let i = e.charCodeAt(r);
			if (i == 62) return R(b.URL, t + n, r + 1 + n);
			if (i == 60 || i == 10) return !1;
		}
		return null;
	}
	{
		let r = 0, i = t;
		for (let t = !1; i < e.length; i++) {
			let n = e.charCodeAt(i);
			if (x(n)) break;
			if (t) t = !1;
			else if (n == 40) r++;
			else if (n == 41) {
				if (!r) break;
				r--;
			} else n == 92 && (t = !0);
		}
		return i > t ? R(b.URL, t + n, i + n) : i == e.length && null;
	}
}
function Le(e, t, n) {
	let r = e.charCodeAt(t);
	if (r != 39 && r != 34 && r != 40) return !1;
	let i = r == 40 ? 41 : r;
	for (let r = t + 1, a = !1; r < e.length; r++) {
		let o = e.charCodeAt(r);
		if (a) a = !1;
		else {
			if (o == i) return R(b.LinkTitle, t + n, r + 1 + n);
			o == 92 && (a = !0);
		}
	}
	return null;
}
function Re(e, t, n, r) {
	for (let i = !1, a = t + 1, o = Math.min(e.length, a + 999); a < o; a++) {
		let o = e.charCodeAt(a);
		if (i) i = !1;
		else {
			if (o == 93) return !r && R(b.LinkLabel, t + n, a + 1 + n);
			if (r && !x(o) && (r = !1), o == 91) return !1;
			o == 92 && (i = !0);
		}
	}
	return null;
}
var ze = class {
	constructor(e, t, n) {
		this.parser = e, this.text = t, this.offset = n, this.parts = [];
	}
	char(e) {
		return e >= this.end ? -1 : this.text.charCodeAt(e - this.offset);
	}
	get end() {
		return this.offset + this.text.length;
	}
	slice(e, t) {
		return this.text.slice(e - this.offset, t - this.offset);
	}
	append(e) {
		return this.parts.push(e), e.to;
	}
	addDelimiter(e, t, n, r, i) {
		return this.append(new V(e, t, n, !!r | (i ? 2 : 0)));
	}
	get hasOpenLink() {
		for (let e = this.parts.length - 1; e >= 0; e--) {
			let t = this.parts[e];
			if (t instanceof V && (t.type == z || t.type == B)) return !0;
		}
		return !1;
	}
	addElement(e) {
		return this.append(e);
	}
	resolveMarkers(e) {
		for (let t = e; t < this.parts.length; t++) {
			let n = this.parts[t];
			if (!(n instanceof V && n.type.resolve && 2 & n.side)) continue;
			let r, i = n.type == Me || n.type == Ne, a = n.to - n.from, o = t - 1;
			for (; o >= e; o--) {
				let e = this.parts[o];
				if (e instanceof V && 1 & e.side && e.type == n.type && !(i && (1 & n.side || 2 & e.side) && (e.to - e.from + a) % 3 == 0 && ((e.to - e.from) % 3 || a % 3))) {
					r = e;
					break;
				}
			}
			if (!r) continue;
			let s = n.type.resolve, c = [], l = r.from, u = n.to;
			if (i) {
				let e = Math.min(2, r.to - r.from, a);
				l = r.to - e, u = n.from + e, s = e == 1 ? "Emphasis" : "StrongEmphasis";
			}
			r.type.mark && c.push(this.elt(r.type.mark, l, r.to));
			for (let e = o + 1; e < t; e++) this.parts[e] instanceof L && c.push(this.parts[e]), this.parts[e] = null;
			n.type.mark && c.push(this.elt(n.type.mark, n.from, u));
			let d = this.elt(s, l, u, c);
			this.parts[o] = i && r.from != l ? new V(r.type, r.from, l, r.side) : null, (this.parts[t] = i && n.to != u ? new V(n.type, u, n.to, n.side) : null) ? this.parts.splice(t, 0, d) : this.parts[t] = d;
		}
		let t = [];
		for (let n = e; n < this.parts.length; n++) {
			let e = this.parts[n];
			e instanceof L && t.push(e);
		}
		return t;
	}
	findOpeningDelimiter(e) {
		for (let t = this.parts.length - 1; t >= 0; t--) {
			let n = this.parts[t];
			if (n instanceof V && n.type == e) return t;
		}
		return null;
	}
	takeContent(e) {
		let t = this.resolveMarkers(e);
		return this.parts.length = e, t;
	}
	skipSpace(e) {
		return S(this.text, e - this.offset) + this.offset;
	}
	elt(e, t, n, r) {
		return typeof e == "string" ? R(this.parser.getNodeType(e), t, n, r) : new je(e, t);
	}
};
function W(e, t) {
	if (!t.length) return e;
	if (!e.length) return t;
	let n = e.slice(), r = 0;
	for (let e of t) {
		for (; r < n.length && n[r].to < e.to;) r++;
		if (r < n.length && n[r].from < e.from) {
			let t = n[r];
			t instanceof L && (n[r] = new L(t.type, t.from, t.to, W(t.children, [e])));
		} else n.splice(r++, 0, e);
	}
	return n;
}
var Be = [
	b.CodeBlock,
	b.ListItem,
	b.OrderedList,
	b.BulletList
], Ve = class {
	constructor(e, t) {
		this.fragments = e, this.input = t, this.i = 0, this.fragment = null, this.fragmentEnd = -1, this.cursor = null, e.length && (this.fragment = e[this.i++]);
	}
	nextFragment() {
		this.fragment = this.i < this.fragments.length ? this.fragments[this.i++] : null, this.cursor = null, this.fragmentEnd = -1;
	}
	moveTo(e, t) {
		for (; this.fragment && this.fragment.to <= e;) this.nextFragment();
		if (!this.fragment || this.fragment.from > (e ? e - 1 : 0)) return !1;
		if (this.fragmentEnd < 0) {
			let e = this.fragment.to;
			for (; e > 0 && this.input.read(e - 1, e) != "\n";) e--;
			this.fragmentEnd = e ? e - 1 : 0;
		}
		let n = this.cursor;
		n || (n = this.cursor = this.fragment.tree.cursor(), n.firstChild());
		let r = e + this.fragment.offset;
		for (; n.to <= r;) if (!n.parent()) return !1;
		for (;;) {
			if (n.from >= r) return this.fragment.from <= t;
			if (!n.childAfter(r)) return !1;
		}
	}
	matches(e) {
		let t = this.cursor.tree;
		return t && t.prop(h.contextHash) == e;
	}
	takeNodes(e) {
		let t = this.cursor, n = this.fragment.offset, i = this.fragmentEnd - +!!this.fragment.openEnd, a = e.absoluteLineStart, o = a, s = e.block.children.length, c = o, l = s;
		for (;;) {
			if (t.to - n > i) {
				if (t.type.isAnonymous && t.firstChild()) continue;
				break;
			}
			let a = He(t.from - n, e.ranges);
			if (t.to - n <= e.ranges[e.rangeI].to) e.addNode(t.tree, a);
			else {
				let n = new r(e.parser.nodeSet.types[b.Paragraph], [], [], 0, e.block.hashProp);
				e.reusePlaceholders.set(n, t.tree), e.addNode(n, a);
			}
			if (t.type.is("Block") && (Be.indexOf(t.type.id) < 0 ? (o = t.to - n, s = e.block.children.length) : (o = c, s = l, c = t.to - n, l = e.block.children.length)), !t.nextSibling()) break;
		}
		for (; e.block.children.length > s;) e.block.children.pop(), e.block.positions.pop();
		return o - a;
	}
};
function He(e, t) {
	let n = e;
	for (let r = 1; r < t.length; r++) {
		let i = t[r - 1].to, a = t[r].from;
		i < e && (n -= a - i);
	}
	return n;
}
var Ue = a({
	"Blockquote/...": y.quote,
	HorizontalRule: y.contentSeparator,
	"ATXHeading1/... SetextHeading1/...": y.heading1,
	"ATXHeading2/... SetextHeading2/...": y.heading2,
	"ATXHeading3/...": y.heading3,
	"ATXHeading4/...": y.heading4,
	"ATXHeading5/...": y.heading5,
	"ATXHeading6/...": y.heading6,
	"Comment CommentBlock": y.comment,
	Escape: y.escape,
	Entity: y.character,
	"Emphasis/...": y.emphasis,
	"StrongEmphasis/...": y.strong,
	"Link/... Image/...": y.link,
	"OrderedList/... BulletList/...": y.list,
	"BlockQuote/...": y.quote,
	"InlineCode CodeText": y.monospace,
	"URL Autolink": y.url,
	"HeaderMark HardBreak QuoteMark ListMark LinkMark EmphasisMark CodeMark": y.processingInstruction,
	"CodeInfo LinkLabel": y.labelName,
	LinkTitle: y.string,
	Paragraph: y.content
}), We = new Oe(new f(ke).extend(Ue), Object.keys(j).map((e) => j[e]), Object.keys(j).map((e) => Ce[e]), Object.keys(j), we, fe, Object.keys(U).map((e) => U[e]), Object.keys(U), []);
function Ge(e, t, n) {
	let r = [];
	for (let i = e.firstChild, a = t;; i = i.nextSibling) {
		let e = i ? i.from : n;
		if (e > a && r.push({
			from: a,
			to: e
		}), !i) break;
		a = i.to;
	}
	return r;
}
var Ke = {
	resolve: "Strikethrough",
	mark: "StrikethroughMark"
}, qe = {
	defineNodes: [{
		name: "Strikethrough",
		style: { "Strikethrough/...": y.strikethrough }
	}, {
		name: "StrikethroughMark",
		style: y.processingInstruction
	}],
	parseInline: [{
		name: "Strikethrough",
		parse(e, t, n) {
			if (t != 126 || e.char(n + 1) != 126 || e.char(n + 2) == 126) return -1;
			let r = e.slice(n - 1, n), i = e.slice(n + 2, n + 3), a = /\s|^$/.test(r), o = /\s|^$/.test(i), s = H.test(r), c = H.test(i);
			return e.addDelimiter(Ke, n, n + 2, !o && (!c || a || s), !a && (!s || o || c));
		},
		after: "Emphasis"
	}]
};
function G(e, t, n = 0, r, i = 0) {
	let a = 0, o = !0, s = -1, c = -1, l = !1, u = () => {
		r.push(e.elt("TableCell", i + s, i + c, e.parser.parseInline(t.slice(s, c), i + s)));
	};
	for (let d = n; d < t.length; d++) {
		let n = t.charCodeAt(d);
		n != 124 || l ? (l || n != 32 && n != 9) && (s < 0 && (s = d), c = d + 1) : ((!o || s > -1) && a++, o = !1, r && (s > -1 && u(), r.push(e.elt("TableDelimiter", d + i, d + i + 1))), s = c = -1), l = !l && n == 92;
	}
	return s > -1 && (a++, r && u()), a;
}
function Je(e, t) {
	for (let n = t; n < e.length; n++) {
		let t = e.charCodeAt(n);
		if (t == 124) return !0;
		t == 92 && n++;
	}
	return !1;
}
var Ye = /^\|?(\s*:?-+:?\s*\|)+(\s*:?-+:?\s*)?$/, Xe = class {
	constructor() {
		this.rows = null;
	}
	nextLine(e, t, n) {
		if (this.rows == null) {
			let r;
			if (this.rows = !1, (t.next == 45 || t.next == 58 || t.next == 124) && Ye.test(r = t.text.slice(t.pos))) {
				let i = [];
				G(e, n.content, 0, i, n.start) == G(e, r, t.pos) && (this.rows = [e.elt("TableHeader", n.start, n.start + n.content.length, i), e.elt("TableDelimiter", e.lineStart + t.pos, e.lineStart + t.text.length)]);
			}
		} else if (this.rows) {
			let n = [];
			G(e, t.text, t.pos, n, e.lineStart), this.rows.push(e.elt("TableRow", e.lineStart + t.pos, e.lineStart + t.text.length, n));
		}
		return !1;
	}
	finish(e, t) {
		return !!this.rows && (e.addLeafElement(t, e.elt("Table", t.start, t.start + t.content.length, this.rows)), !0);
	}
}, Ze = {
	defineNodes: [
		{
			name: "Table",
			block: !0
		},
		{
			name: "TableHeader",
			style: { "TableHeader/...": y.heading }
		},
		"TableRow",
		{
			name: "TableCell",
			style: y.content
		},
		{
			name: "TableDelimiter",
			style: y.processingInstruction
		}
	],
	parseBlock: [{
		name: "Table",
		leaf: (e, t) => Je(t.content, 0) ? new Xe() : null,
		endLeaf(e, t, n) {
			if (n.parsers.some((e) => e instanceof Xe) || !Je(t.text, t.basePos)) return !1;
			let r = e.peekLine();
			return Ye.test(r) && G(e, t.text, t.basePos) == G(e, r, t.basePos);
		},
		before: "SetextHeading"
	}]
}, Qe = class {
	nextLine() {
		return !1;
	}
	finish(e, t) {
		return e.addLeafElement(t, e.elt("Task", t.start, t.start + t.content.length, [e.elt("TaskMarker", t.start, t.start + 3), ...e.parser.parseInline(t.content.slice(3), t.start + 3)])), !0;
	}
}, $e = {
	defineNodes: [{
		name: "Task",
		block: !0,
		style: y.list
	}, {
		name: "TaskMarker",
		style: y.atom
	}],
	parseBlock: [{
		name: "TaskList",
		leaf: (e, t) => /^\[[ xX]\][ \t]/.test(t.content) && e.parentType().name == "ListItem" ? new Qe() : null,
		after: "SetextHeading"
	}]
}, et = /(www\.)|(https?:\/\/)|([\w.+-]{1,100}@)|(mailto:|xmpp:)/gy, tt = /[\w-]+(\.[\w-]+)+(\/[^\s<]*)?/gy, nt = /[\w-]+\.[\w-]+($|\/)/, rt = /[\w.+-]+@[\w-]+(\.[\w.-]+)+/gy, it = /\/[a-zA-Z\d@.]+/gy;
function at(e, t, n, r) {
	let i = 0;
	for (let a = t; a < n; a++) e[a] == r && i++;
	return i;
}
function ot(e, t) {
	rt.lastIndex = t;
	let n = rt.exec(e);
	if (!n) return -1;
	let r = n[0][n[0].length - 1];
	return r == "_" || r == "-" ? -1 : t + n[0].length - +(r == ".");
}
var st = [
	Ze,
	$e,
	qe,
	{ parseInline: [{
		name: "Autolink",
		parse(e, t, n) {
			let r = n - e.offset;
			if (r && /\w/.test(e.text[r - 1])) return -1;
			et.lastIndex = r;
			let i = et.exec(e.text), a = -1;
			return i ? (i[1] || i[2] ? (a = function(e, t) {
				tt.lastIndex = t;
				let n = tt.exec(e);
				if (!n || nt.exec(n[0])[0].indexOf("_") > -1) return -1;
				let r = t + n[0].length;
				for (;;) {
					let n, i = e[r - 1];
					if (/[?!.,:*_~]/.test(i) || i == ")" && at(e, t, r, ")") > at(e, t, r, "(")) r--;
					else {
						if (i != ";" || !(n = /&(?:#\d+|#x[a-f\d]+|\w+);$/.exec(e.slice(t, r)))) break;
						r = t + n.index;
					}
				}
				return r;
			}(e.text, r + i[0].length), a > -1 && e.hasOpenLink && (a = r + /([^\[\]]|\[[^\]]*\])*/.exec(e.text.slice(r, a))[0].length)) : i[3] ? a = ot(e.text, r) : (a = ot(e.text, r + i[0].length), a > -1 && i[0] == "xmpp:" && (it.lastIndex = a, i = it.exec(e.text), i && (a = i.index + i[0].length))), a < 0 ? -1 : (e.addElement(e.elt("URL", n, a + e.offset)), a + e.offset)) : -1;
		}
	}] }
];
function ct(e, t, n) {
	return (r, i, a) => {
		if (i != e || r.char(a + 1) == e) return -1;
		let o = [r.elt(n, a, a + 1)];
		for (let i = a + 1; i < r.end; i++) {
			let s = r.char(i);
			if (s == e) return r.addElement(r.elt(t, a, i + 1, o.concat(r.elt(n, i, i + 1))));
			if (s == 92 && o.push(r.elt("Escape", i, 2 + i++)), x(s)) break;
		}
		return -1;
	};
}
var lt = {
	defineNodes: [{
		name: "Superscript",
		style: y.special(y.content)
	}, {
		name: "SuperscriptMark",
		style: y.processingInstruction
	}],
	parseInline: [{
		name: "Superscript",
		parse: ct(94, "Superscript", "SuperscriptMark")
	}]
}, ut = {
	defineNodes: [{
		name: "Subscript",
		style: y.special(y.content)
	}, {
		name: "SubscriptMark",
		style: y.processingInstruction
	}],
	parseInline: [{
		name: "Subscript",
		parse: ct(126, "Subscript", "SubscriptMark")
	}]
}, dt = {
	defineNodes: [{
		name: "Emoji",
		style: y.character
	}],
	parseInline: [{
		name: "Emoji",
		parse(e, t, n) {
			let r;
			return t == 58 && (r = /^[a-zA-Z_0-9]+:/.exec(e.slice(n + 1, e.end))) ? e.addElement(e.elt("Emoji", n, n + 1 + r[0].length)) : -1;
		}
	}]
}, ft = ie({ commentTokens: { block: {
	open: "<!--",
	close: "-->"
} } }), pt = new h(), mt = We.configure({ props: [
	t.add((e) => !e.is("Block") || e.is("Document") || K(e) != null ? void 0 : (e, t) => ({
		from: t.doc.lineAt(e.from).to,
		to: e.to
	})),
	pt.add(K),
	l.add({ Document: () => null }),
	i.add({ Document: ft })
] });
function K(e) {
	let t = /^(?:ATX|Setext)Heading(\d)$/.exec(e.name);
	return t ? +t[1] : void 0;
}
function ht(e, t) {
	let n = e;
	for (;;) {
		let e, r = n.nextSibling;
		if (!r || (e = K(r.type)) != null && e <= t) break;
		n = r;
	}
	return n.to;
}
var gt = oe.of((e, t, n) => {
	for (let r = p(e).resolveInner(n, -1); r && !(r.from < t); r = r.parent) {
		let e = r.type.prop(pt);
		if (e == null) continue;
		let t = ht(r, e);
		if (t > n) return {
			from: n,
			to: t
		};
	}
	return null;
});
function q(e) {
	return new ne(ft, e, [gt], "markdown");
}
var _t = q(mt), J = q(mt.configure([
	st,
	ut,
	lt,
	dt
])), Y = class {
	constructor(e, t, n, r, i, a, o) {
		this.node = e, this.from = t, this.to = n, this.spaceBefore = r, this.spaceAfter = i, this.type = a, this.item = o;
	}
	blank(e, t = !0) {
		let n = this.spaceBefore + (this.node.name == "Blockquote" ? ">" : "");
		if (e != null) {
			for (; n.length < e;) n += " ";
			return n;
		}
		for (let e = this.to - this.from - n.length - this.spaceAfter.length; e > 0; e--) n += " ";
		return n + (t ? this.spaceAfter : "");
	}
	marker(e, t) {
		let n = this.node.name == "OrderedList" ? String(+yt(this.item, e)[2] + t) : "";
		return this.spaceBefore + n + this.type + this.spaceAfter;
	}
};
function vt(e, t) {
	let n = [];
	for (let t = e; t && t.name != "Document"; t = t.parent) t.name != "ListItem" && t.name != "Blockquote" && t.name != "FencedCode" || n.push(t);
	let r = [];
	for (let e = n.length - 1; e >= 0; e--) {
		let i, a = n[e], o = t.lineAt(a.from), s = a.from - o.from;
		if (a.name == "FencedCode") r.push(new Y(a, s, s, "", "", "", null));
		else if (a.name == "Blockquote" && (i = /^ *>( ?)/.exec(o.text.slice(s)))) r.push(new Y(a, s, s + i[0].length, "", i[1], ">", null));
		else if (a.name == "ListItem" && a.parent.name == "OrderedList" && (i = /^( *)\d+([.)])( *)/.exec(o.text.slice(s)))) {
			let e = i[3], t = i[0].length;
			e.length >= 4 && (e = e.slice(0, e.length - 4), t -= 4), r.push(new Y(a.parent, s, s + t, i[1], e, i[2], a));
		} else if (a.name == "ListItem" && a.parent.name == "BulletList" && (i = /^( *)([-+*])( {1,4}\[[ xX]\])?( +)/.exec(o.text.slice(s)))) {
			let e = i[4], t = i[0].length;
			e.length > 4 && (e = e.slice(0, e.length - 4), t -= 4);
			let n = i[2];
			i[3] && (n += i[3].replace(/[xX]/, " ")), r.push(new Y(a.parent, s, s + t, i[1], e, n, a));
		}
	}
	return r;
}
function yt(e, t) {
	return /^(\s*)(\d+)(?=[.)])/.exec(t.sliceString(e.from, e.from + 10));
}
function X(e, t, n, r = 0) {
	for (let i = -1, a = e;;) {
		if (a.name == "ListItem") {
			let e = yt(a, t), o = +e[2];
			if (i >= 0) {
				if (o != i + 1) return;
				n.push({
					from: a.from + e[1].length,
					to: a.from + e[0].length,
					insert: String(i + 2 + r)
				});
			}
			i = o;
		}
		let e = a.nextSibling;
		if (!e) break;
		a = e;
	}
}
function Z(e, t) {
	let n = /^[ \t]*/.exec(e)[0].length;
	if (!n || t.facet(m) != "	") return e;
	let r = "";
	for (let t = v(e, 4, n); t > 0;) t >= 4 ? (r += "	", t -= 4) : (r += " ", t--);
	return r + e.slice(n);
}
var bt = ({ state: e, dispatch: t }) => {
	let n = p(e), { doc: r } = e, i = null, a = e.changeByRange((t) => {
		if (!t.empty || !J.isActiveAt(e, t.from)) return i = { range: t };
		let a = t.from, o = r.lineAt(a), s = vt(n.resolveInner(a, -1), r);
		for (; s.length && s[s.length - 1].from > a - o.from;) s.pop();
		if (!s.length) return i = { range: t };
		let c = s[s.length - 1];
		if (c.to - c.spaceAfter.length > a - o.from) return i = { range: t };
		let l = a >= c.to - c.spaceAfter.length && !/\S/.test(o.text.slice(c.to));
		if (c.item && l) {
			if (c.node.firstChild.to >= a || o.from > 0 && !/[^\s>]/.test(r.lineAt(o.from - 1).text)) {
				let e, t = s.length > 1 ? s[s.length - 2] : null, n = "";
				t && t.item ? (e = o.from + t.from, n = t.marker(r, 1)) : e = o.from + (t ? t.to : 0);
				let i = [{
					from: e,
					to: a,
					insert: n
				}];
				return c.node.name == "OrderedList" && X(c.item, r, i, -2), t && t.node.name == "OrderedList" && X(t.item, r, i), {
					range: g.cursor(e + n.length),
					changes: i
				};
			}
			{
				let t = "";
				for (let e = 0, n = s.length - 2; e <= n; e++) t += s[e].blank(e < n ? v(o.text, 4, s[e + 1].from) - t.length : null, e < n);
				return t = Z(t, e), {
					range: g.cursor(a + t.length + 1),
					changes: {
						from: o.from,
						insert: t + e.lineBreak
					}
				};
			}
		}
		if (c.node.name == "Blockquote" && l && o.from) {
			let n = r.lineAt(o.from - 1), i = />\s*$/.exec(n.text);
			if (i && i.index == c.from) {
				let r = e.changes([{
					from: n.from + i.index,
					to: n.to
				}, {
					from: o.from + c.from,
					to: o.to
				}]);
				return {
					range: t.map(r),
					changes: r
				};
			}
		}
		let u = [];
		c.node.name == "OrderedList" && X(c.item, r, u);
		let d = c.item && c.item.from < o.from, f = "";
		if (!d || /^[\s\d.)\-+*>]*/.exec(o.text)[0].length >= c.to) for (let e = 0, t = s.length - 1; e <= t; e++) f += e != t || d ? s[e].blank(e < t ? v(o.text, 4, s[e + 1].from) - f.length : null) : s[e].marker(r, 1);
		let p = a;
		for (; p > o.from && /\s/.test(o.text.charAt(p - o.from - 1));) p--;
		return f = Z(f, e), u.push({
			from: p,
			to: a,
			insert: e.lineBreak + f
		}), {
			range: g.cursor(p + f.length + 1),
			changes: u
		};
	});
	return !i && (t(e.update(a, {
		scrollIntoView: !0,
		userEvent: "input"
	})), !0);
};
function xt(e) {
	return e.name == "QuoteMark" || e.name == "ListMark";
}
var St = ({ state: e, dispatch: t }) => {
	let n = p(e), r = null, i = e.changeByRange((t) => {
		let i = t.from, { doc: a } = e;
		if (t.empty && J.isActiveAt(e, t.from)) {
			let t = a.lineAt(i), r = vt(function(e, t) {
				let n = e.resolveInner(t, -1), r = t;
				xt(n) && (r = n.from, n = n.parent);
				for (let e; e = n.childBefore(r);) if (xt(e)) r = e.from;
				else {
					if (e.name != "OrderedList" && e.name != "BulletList") break;
					n = e.lastChild, r = n.to;
				}
				return n;
			}(n, i), a);
			if (r.length) {
				let n = r[r.length - 1], a = n.to - n.spaceAfter.length + +!!n.spaceAfter;
				if (i - t.from > a && !/\S/.test(t.text.slice(a, i - t.from))) return {
					range: g.cursor(t.from + a),
					changes: {
						from: t.from + a,
						to: i
					}
				};
				if (i - t.from == a && (!n.item || t.from <= n.item.from || !/\S/.test(t.text.slice(0, n.to)))) {
					let r = t.from + n.from;
					if (n.item && n.node.from < n.item.from && /\S/.test(t.text.slice(n.from, n.to))) {
						let i = n.blank(v(t.text, 4, n.to) - v(t.text, 4, n.from));
						return r == t.from && (i = Z(i, e)), {
							range: g.cursor(r + i.length),
							changes: {
								from: r,
								to: t.from + n.to,
								insert: i
							}
						};
					}
					if (r < i) return {
						range: g.cursor(r),
						changes: {
							from: r,
							to: i
						}
					};
				}
			}
		}
		return r = { range: t };
	});
	return !r && (t(e.update(i, {
		scrollIntoView: !0,
		userEvent: "delete"
	})), !0);
}, Ct = [{
	key: "Enter",
	run: bt
}, {
	key: "Backspace",
	run: St
}], Q = d({ matchClosingTags: !1 });
function wt(t = {}) {
	let { codeLanguages: n, defaultCodeLanguage: r, addKeymap: i = !0, base: { parser: a } = _t, completeHTMLTags: c = !0 } = t;
	if (!(a instanceof Oe)) throw RangeError("Base parser provided to `markdown` should be a Markdown parser");
	let l, u = t.extensions ? [t.extensions] : [], d = [Q.support];
	r instanceof s ? (d.push(r.support), l = r.language) : r && (l = r);
	let f = n || l ? (p = n, m = l, (t) => {
		if (t && p) {
			let n = null;
			if (t = /\S*/.exec(t)[0], n = typeof p == "function" ? p(t) : ee.matchLanguageName(p, t, !0), n instanceof ee) return n.support ? n.support.language.parser : e.getSkippingParser(n.load());
			if (n) return n.parser;
		}
		return m ? m.parser : null;
	}) : void 0;
	var p, m;
	u.push(function(e) {
		let { codeParser: t, htmlParser: n } = e;
		return { wrap: o((e, r) => {
			let i = e.type.id;
			if (!t || i != b.CodeBlock && i != b.FencedCode) {
				if (n && (i == b.HTMLBlock || i == b.HTMLTag || i == b.CommentBlock)) return {
					parser: n,
					overlay: Ge(e.node, e.from, e.to)
				};
			} else {
				let n = "";
				if (i == b.FencedCode) {
					let t = e.node.getChild(b.CodeInfo);
					t && (n = r.read(t.from, t.to));
				}
				let a = t(n);
				if (a) return {
					parser: a,
					overlay: (e) => e.type.id == b.CodeText
				};
			}
			return null;
		}) };
	}({
		codeParser: f,
		htmlParser: Q.language.parser
	})), i && d.push(se.high(te.of(Ct)));
	let h = q(a.configure(u));
	return c && d.push(h.data.of({ autocomplete: Tt })), new s(h, d);
}
function Tt(e) {
	let { state: t, pos: n } = e, r = /<[:\-\.\w\u00b7-\uffff]*$/.exec(t.sliceDoc(n - 25, n));
	if (!r) return null;
	let i = p(t).resolveInner(n, -1);
	for (; i && !i.type.isTop;) {
		if (i.name == "CodeBlock" || i.name == "FencedCode" || i.name == "ProcessingInstructionBlock" || i.name == "CommentBlock" || i.name == "Link" || i.name == "Image") return null;
		i = i.parent;
	}
	return {
		from: n - r[0].length,
		to: n,
		options: Et(),
		validFor: /^<[:\-\.\w\u00b7-\uffff]*$/
	};
}
var $ = null;
function Et() {
	if ($) return $;
	let e = re(new n(u.create({ extensions: Q }), 0, !0));
	return $ = e ? e.options : [];
}
//#endregion
export { _t as commonmarkLanguage, St as deleteMarkupBackward, bt as insertNewlineContinueMarkup, wt as markdown, Ct as markdownKeymap, J as markdownLanguage };
