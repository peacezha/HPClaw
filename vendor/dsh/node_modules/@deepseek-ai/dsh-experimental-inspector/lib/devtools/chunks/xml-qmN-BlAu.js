import { Bt as e, Cn as t, Ft as n, Ht as r, Nt as i, Wt as a, Zt as o, ct as s, en as c, et as l, xt as u } from "./codemirror-CENmPHF2.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/third_party/codemirror.next/chunk/xml.js
function d(e) {
	return e == 45 || e == 46 || e == 58 || e >= 65 && e <= 90 || e == 95 || e >= 97 && e <= 122 || e >= 161;
}
function f(e) {
	return e == 9 || e == 10 || e == 13 || e == 32;
}
var p = null, m = null, h = 0;
function g(e, t) {
	let n = e.pos + t;
	if (m == e && h == n) return p;
	for (; f(e.peek(t));) t++;
	let r = "";
	for (;;) {
		let n = e.peek(t);
		if (!d(n)) break;
		r += String.fromCharCode(n), t++;
	}
	return m = e, h = n, p = r || null;
}
function _(e, t) {
	this.name = e, this.parent = t;
}
var v = new o({
	start: null,
	shift: (e, t, n, r) => t == 1 ? new _(g(r, 1) || "", e) : e,
	reduce: (e, t) => t == 11 && e ? e.parent : e,
	reuse(e, t, n, r) {
		let i = t.type.id;
		return i == 1 || i == 13 ? new _(g(r, 1) || "", e) : e;
	},
	strict: !1
}), y = new l((e, t) => {
	if (e.next == 60) {
		if (e.advance(), e.next == 47) {
			e.advance();
			let n = g(e, 0);
			if (!n) return e.acceptToken(5);
			if (t.context && n == t.context.name) return e.acceptToken(2);
			for (let r = t.context; r; r = r.parent) if (r.name == n) return e.acceptToken(3, -2);
			e.acceptToken(4);
		} else if (e.next != 33 && e.next != 63) return e.acceptToken(1);
	}
}, { contextual: !0 });
function b(e, t) {
	return new l((n) => {
		let r = 0, i = t.charCodeAt(0);
		O: for (; !(n.next < 0); n.advance(), r++) if (n.next == i) {
			for (let e = 1; e < t.length; e++) if (n.peek(e) != t.charCodeAt(e)) continue O;
			break;
		}
		r && n.acceptToken(e);
	});
}
var x = b(36, "-->"), S = b(37, "?>"), C = b(38, "]]>"), w = n({
	Text: u.content,
	"StartTag StartCloseTag EndTag SelfCloseEndTag": u.angleBracket,
	TagName: u.tagName,
	"MismatchedCloseTag/TagName": [u.tagName, u.invalid],
	AttributeName: u.attributeName,
	AttributeValue: u.attributeValue,
	Is: u.definitionOperator,
	"EntityReference CharacterReference": u.character,
	Comment: u.blockComment,
	ProcessingInst: u.processingInstruction,
	DoctypeDecl: u.documentMeta,
	Cdata: u.special(u.string)
}), T = e.deserialize({
	version: 14,
	states: ",lOQOaOOOrOxO'#CfOzOpO'#CiO!tOaO'#CgOOOP'#Cg'#CgO!{OrO'#CrO#TOtO'#CsO#]OpO'#CtOOOP'#DT'#DTOOOP'#Cv'#CvQQOaOOOOOW'#Cw'#CwO#eOxO,59QOOOP,59Q,59QOOOO'#Cx'#CxO#mOpO,59TO#uO!bO,59TOOOP'#C|'#C|O$TOaO,59RO$[OpO'#CoOOOP,59R,59ROOOQ'#C}'#C}O$dOrO,59^OOOP,59^,59^OOOS'#DO'#DOO$lOtO,59_OOOP,59_,59_O$tOpO,59`O$|OpO,59`OOOP-E6t-E6tOOOW-E6u-E6uOOOP1G.l1G.lOOOO-E6v-E6vO%UO!bO1G.oO%UO!bO1G.oO%dOpO'#CkO%lO!bO'#CyO%zO!bO1G.oOOOP1G.o1G.oOOOP1G.w1G.wOOOP-E6z-E6zOOOP1G.m1G.mO&VOpO,59ZO&_OpO,59ZOOOQ-E6{-E6{OOOP1G.x1G.xOOOS-E6|-E6|OOOP1G.y1G.yO&gOpO1G.zO&gOpO1G.zOOOP1G.z1G.zO&oO!bO7+$ZO&}O!bO7+$ZOOOP7+$Z7+$ZOOOP7+$c7+$cO'YOpO,59VO'bOpO,59VO'mO!bO,59eOOOO-E6w-E6wO'{OpO1G.uO'{OpO1G.uOOOP1G.u1G.uO(TOpO7+$fOOOP7+$f7+$fO(]O!bO<<GuOOOP<<Gu<<GuOOOP<<G}<<G}O'bOpO1G.qO'bOpO1G.qO(hO#tO'#CnO(vO&jO'#CnOOOO1G.q1G.qO)UOpO7+$aOOOP7+$a7+$aOOOP<<HQ<<HQOOOPAN=aAN=aOOOPAN=iAN=iO'bOpO7+$]OOOO7+$]7+$]OOOO'#Cz'#CzO)^O#tO,59YOOOO,59Y,59YOOOO'#C{'#C{O)lO&jO,59YOOOP<<G{<<G{OOOO<<Gw<<GwOOOO-E6x-E6xOOOO1G.t1G.tOOOO-E6y-E6y",
	stateData: ")z~OPQOSVOTWOVWOWWOXWOiXOyPO!QTO!SUO~OvZOx]O~O^`Oz^O~OPQOQcOSVOTWOVWOWWOXWOyPO!QTO!SUO~ORdO~P!SOteO!PgO~OuhO!RjO~O^lOz^O~OvZOxoO~O^qOz^O~O[vO`sOdwOz^O~ORyO~P!SO^{Oz^O~OteO!P}O~OuhO!R!PO~O^!QOz^O~O[!SOz^O~O[!VO`sOd!WOz^O~Oa!YOz^O~Oz^O[mX`mXdmX~O[!VO`sOd!WO~O^!]Oz^O~O[!_Oz^O~O[!aOz^O~O[!cO`sOd!dOz^O~O[!cO`sOd!dO~Oa!eOz^O~Oz^O{!gO}!hO~Oz^O[ma`madma~O[!kOz^O~O[!lOz^O~O[!mO`sOd!nO~OW!qOX!qO{!sO|!qO~OW!tOX!tO}!sO!O!tO~O[!vOz^O~OW!qOX!qO{!yO|!qO~OW!tOX!tO}!yO!O!tO~O",
	goto: "%cxPPPPPPPPPPyyP!PP!VPP!`!jP!pyyyP!v!|#S$[$k$q$w$}%TPPPP%ZXWORYbXRORYb_t`qru!T!U!bQ!i!YS!p!e!fR!w!oQdRRybXSORYbQYORmYQ[PRn[Q_QQkVjp_krz!R!T!X!Z!^!`!f!j!oQr`QzcQ!RlQ!TqQ!XsQ!ZtQ!^{Q!`!QQ!f!YQ!j!]R!o!eQu`S!UqrU![u!U!bR!b!TQ!r!gR!x!rQ!u!hR!z!uQbRRxbQfTR|fQiUR!OiSXOYTaRb",
	nodeNames: "⚠ StartTag StartCloseTag MissingCloseTag StartCloseTag StartCloseTag Document Text EntityReference CharacterReference Cdata Element EndTag OpenTag TagName Attribute AttributeName Is AttributeValue CloseTag SelfCloseEndTag SelfClosingTag Comment ProcessingInst MismatchedCloseTag DoctypeDecl",
	maxTerm: 50,
	context: v,
	nodeProps: [
		[
			"closedBy",
			1,
			"SelfCloseEndTag EndTag",
			13,
			"CloseTag MissingCloseTag"
		],
		[
			"openedBy",
			12,
			"StartTag StartCloseTag",
			19,
			"OpenTag",
			20,
			"StartTag"
		],
		[
			"isolate",
			-6,
			13,
			18,
			19,
			21,
			22,
			24,
			""
		]
	],
	propSources: [w],
	skippedNodes: [0],
	repeatNodeCount: 9,
	tokenData: "!)v~R!YOX$qXY)iYZ)iZ]$q]^)i^p$qpq)iqr$qrs*vsv$qvw+fwx/ix}$q}!O0[!O!P$q!P!Q2z!Q![$q![!]4n!]!^$q!^!_8U!_!`!#t!`!a!$l!a!b!%d!b!c$q!c!}4n!}#P$q#P#Q!'W#Q#R$q#R#S4n#S#T$q#T#o4n#o%W$q%W%o4n%o%p$q%p&a4n&a&b$q&b1p4n1p4U$q4U4d4n4d4e$q4e$IS4n$IS$I`$q$I`$Ib4n$Ib$Kh$q$Kh%#t4n%#t&/x$q&/x&Et4n&Et&FV$q&FV;'S4n;'S;:j8O;:j;=`)c<%l?&r$q?&r?Ah4n?Ah?BY$q?BY?Mn4n?MnO$qi$zXVP|W!O`Or$qrs%gsv$qwx'^x!^$q!^!_(o!_;'S$q;'S;=`)c<%lO$qa%nVVP!O`Ov%gwx&Tx!^%g!^!_&o!_;'S%g;'S;=`'W<%lO%gP&YTVPOv&Tw!^&T!_;'S&T;'S;=`&i<%lO&TP&lP;=`<%l&T`&tS!O`Ov&ox;'S&o;'S;=`'Q<%lO&o`'TP;=`<%l&oa'ZP;=`<%l%gX'eWVP|WOr'^rs&Tsv'^w!^'^!^!_'}!_;'S'^;'S;=`(i<%lO'^W(ST|WOr'}sv'}w;'S'};'S;=`(c<%lO'}W(fP;=`<%l'}X(lP;=`<%l'^h(vV|W!O`Or(ors&osv(owx'}x;'S(o;'S;=`)]<%lO(oh)`P;=`<%l(oi)fP;=`<%l$qo)t`VP|W!O`zUOX$qXY)iYZ)iZ]$q]^)i^p$qpq)iqr$qrs%gsv$qwx'^x!^$q!^!_(o!_;'S$q;'S;=`)c<%lO$qk+PV{YVP!O`Ov%gwx&Tx!^%g!^!_&o!_;'S%g;'S;=`'W<%lO%g~+iast,n![!]-r!c!}-r#R#S-r#T#o-r%W%o-r%p&a-r&b1p-r4U4d-r4e$IS-r$I`$Ib-r$Kh%#t-r&/x&Et-r&FV;'S-r;'S;:j/c?&r?Ah-r?BY?Mn-r~,qQ!Q![,w#l#m-V~,zQ!Q![,w!]!^-Q~-VOX~~-YR!Q![-c!c!i-c#T#Z-c~-fS!Q![-c!]!^-Q!c!i-c#T#Z-c~-ug}!O-r!O!P-r!Q![-r![!]-r!]!^/^!c!}-r#R#S-r#T#o-r$}%O-r%W%o-r%p&a-r&b1p-r1p4U-r4U4d-r4e$IS-r$I`$Ib-r$Je$Jg-r$Kh%#t-r&/x&Et-r&FV;'S-r;'S;:j/c?&r?Ah-r?BY?Mn-r~/cOW~~/fP;=`<%l-rk/rW}bVP|WOr'^rs&Tsv'^w!^'^!^!_'}!_;'S'^;'S;=`(i<%lO'^k0eZVP|W!O`Or$qrs%gsv$qwx'^x}$q}!O1W!O!^$q!^!_(o!_;'S$q;'S;=`)c<%lO$qk1aZVP|W!O`Or$qrs%gsv$qwx'^x!^$q!^!_(o!_!`$q!`!a2S!a;'S$q;'S;=`)c<%lO$qk2_X!PQVP|W!O`Or$qrs%gsv$qwx'^x!^$q!^!_(o!_;'S$q;'S;=`)c<%lO$qm3TZVP|W!O`Or$qrs%gsv$qwx'^x!^$q!^!_(o!_!`$q!`!a3v!a;'S$q;'S;=`)c<%lO$qm4RXdSVP|W!O`Or$qrs%gsv$qwx'^x!^$q!^!_(o!_;'S$q;'S;=`)c<%lO$qo4{!P`S^QVP|W!O`Or$qrs%gsv$qwx'^x}$q}!O4n!O!P4n!P!Q$q!Q![4n![!]4n!]!^$q!^!_(o!_!c$q!c!}4n!}#R$q#R#S4n#S#T$q#T#o4n#o$}$q$}%O4n%O%W$q%W%o4n%o%p$q%p&a4n&a&b$q&b1p4n1p4U4n4U4d4n4d4e$q4e$IS4n$IS$I`$q$I`$Ib4n$Ib$Je$q$Je$Jg4n$Jg$Kh$q$Kh%#t4n%#t&/x$q&/x&Et4n&Et&FV$q&FV;'S4n;'S;:j8O;:j;=`)c<%l?&r$q?&r?Ah4n?Ah?BY$q?BY?Mn4n?MnO$qo8RP;=`<%l4ni8]Y|W!O`Oq(oqr8{rs&osv(owx'}x!a(o!a!b!#U!b;'S(o;'S;=`)]<%lO(oi9S_|W!O`Or(ors&osv(owx'}x}(o}!O:R!O!f(o!f!g;e!g!}(o!}#ODh#O#W(o#W#XLp#X;'S(o;'S;=`)]<%lO(oi:YX|W!O`Or(ors&osv(owx'}x}(o}!O:u!O;'S(o;'S;=`)]<%lO(oi;OV!QP|W!O`Or(ors&osv(owx'}x;'S(o;'S;=`)]<%lO(oi;lX|W!O`Or(ors&osv(owx'}x!q(o!q!r<X!r;'S(o;'S;=`)]<%lO(oi<`X|W!O`Or(ors&osv(owx'}x!e(o!e!f<{!f;'S(o;'S;=`)]<%lO(oi=SX|W!O`Or(ors&osv(owx'}x!v(o!v!w=o!w;'S(o;'S;=`)]<%lO(oi=vX|W!O`Or(ors&osv(owx'}x!{(o!{!|>c!|;'S(o;'S;=`)]<%lO(oi>jX|W!O`Or(ors&osv(owx'}x!r(o!r!s?V!s;'S(o;'S;=`)]<%lO(oi?^X|W!O`Or(ors&osv(owx'}x!g(o!g!h?y!h;'S(o;'S;=`)]<%lO(oi@QY|W!O`Or?yrs@psv?yvwA[wxBdx!`?y!`!aCr!a;'S?y;'S;=`Db<%lO?ya@uV!O`Ov@pvxA[x!`@p!`!aAy!a;'S@p;'S;=`B^<%lO@pPA_TO!`A[!`!aAn!a;'SA[;'S;=`As<%lOA[PAsOiPPAvP;=`<%lA[aBQSiP!O`Ov&ox;'S&o;'S;=`'Q<%lO&oaBaP;=`<%l@pXBiX|WOrBdrsA[svBdvwA[w!`Bd!`!aCU!a;'SBd;'S;=`Cl<%lOBdXC]TiP|WOr'}sv'}w;'S'};'S;=`(c<%lO'}XCoP;=`<%lBdiC{ViP|W!O`Or(ors&osv(owx'}x;'S(o;'S;=`)]<%lO(oiDeP;=`<%l?yiDoZ|W!O`Or(ors&osv(owx'}x!e(o!e!fEb!f#V(o#V#WIr#W;'S(o;'S;=`)]<%lO(oiEiX|W!O`Or(ors&osv(owx'}x!f(o!f!gFU!g;'S(o;'S;=`)]<%lO(oiF]X|W!O`Or(ors&osv(owx'}x!c(o!c!dFx!d;'S(o;'S;=`)]<%lO(oiGPX|W!O`Or(ors&osv(owx'}x!v(o!v!wGl!w;'S(o;'S;=`)]<%lO(oiGsX|W!O`Or(ors&osv(owx'}x!c(o!c!dH`!d;'S(o;'S;=`)]<%lO(oiHgX|W!O`Or(ors&osv(owx'}x!}(o!}#OIS#O;'S(o;'S;=`)]<%lO(oiI]V|W!O`yPOr(ors&osv(owx'}x;'S(o;'S;=`)]<%lO(oiIyX|W!O`Or(ors&osv(owx'}x#W(o#W#XJf#X;'S(o;'S;=`)]<%lO(oiJmX|W!O`Or(ors&osv(owx'}x#T(o#T#UKY#U;'S(o;'S;=`)]<%lO(oiKaX|W!O`Or(ors&osv(owx'}x#h(o#h#iK|#i;'S(o;'S;=`)]<%lO(oiLTX|W!O`Or(ors&osv(owx'}x#T(o#T#UH`#U;'S(o;'S;=`)]<%lO(oiLwX|W!O`Or(ors&osv(owx'}x#c(o#c#dMd#d;'S(o;'S;=`)]<%lO(oiMkX|W!O`Or(ors&osv(owx'}x#V(o#V#WNW#W;'S(o;'S;=`)]<%lO(oiN_X|W!O`Or(ors&osv(owx'}x#h(o#h#iNz#i;'S(o;'S;=`)]<%lO(oi! RX|W!O`Or(ors&osv(owx'}x#m(o#m#n! n#n;'S(o;'S;=`)]<%lO(oi! uX|W!O`Or(ors&osv(owx'}x#d(o#d#e!!b#e;'S(o;'S;=`)]<%lO(oi!!iX|W!O`Or(ors&osv(owx'}x#X(o#X#Y?y#Y;'S(o;'S;=`)]<%lO(oi!#_V!SP|W!O`Or(ors&osv(owx'}x;'S(o;'S;=`)]<%lO(ok!$PXaQVP|W!O`Or$qrs%gsv$qwx'^x!^$q!^!_(o!_;'S$q;'S;=`)c<%lO$qo!$wX[UVP|W!O`Or$qrs%gsv$qwx'^x!^$q!^!_(o!_;'S$q;'S;=`)c<%lO$qk!%mZVP|W!O`Or$qrs%gsv$qwx'^x!^$q!^!_(o!_!`$q!`!a!&`!a;'S$q;'S;=`)c<%lO$qk!&kX!RQVP|W!O`Or$qrs%gsv$qwx'^x!^$q!^!_(o!_;'S$q;'S;=`)c<%lO$qk!'aZVP|W!O`Or$qrs%gsv$qwx'^x!^$q!^!_(o!_#P$q#P#Q!(S#Q;'S$q;'S;=`)c<%lO$qk!(]ZVP|W!O`Or$qrs%gsv$qwx'^x!^$q!^!_(o!_!`$q!`!a!)O!a;'S$q;'S;=`)c<%lO$qk!)ZXxQVP|W!O`Or$qrs%gsv$qwx'^x!^$q!^!_(o!_;'S$q;'S;=`)c<%lO$q",
	tokenizers: [
		y,
		x,
		S,
		C,
		0,
		1,
		2,
		3,
		4
	],
	topRules: { Document: [0, 6] },
	tokenPrec: 0
});
function E(e, t) {
	let n = t && t.getChild("TagName");
	return n ? e.sliceString(n.from, n.to) : "";
}
function D(e, t) {
	let n = t && t.firstChild;
	return n && n.name == "OpenTag" ? E(e, n) : "";
}
function O(e) {
	for (let t = e && e.parent; t; t = t.parent) if (t.name == "Element") return t;
	return null;
}
var k = class {
	constructor(e, t, n) {
		this.attrs = t, this.attrValues = n, this.children = [], this.name = e.name, this.completion = Object.assign(Object.assign({ type: "type" }, e.completion || {}), { label: this.name }), this.openCompletion = Object.assign(Object.assign({}, this.completion), { label: "<" + this.name }), this.closeCompletion = Object.assign(Object.assign({}, this.completion), {
			label: "</" + this.name + ">",
			boost: 2
		}), this.closeNameCompletion = Object.assign(Object.assign({}, this.completion), { label: this.name + ">" }), this.text = e.textContent ? e.textContent.map((e) => ({
			label: e,
			type: "text"
		})) : [];
	}
}, A = /^[:\-\.\w\u00b7-\uffff]*$/;
function j(e) {
	return Object.assign(Object.assign({ type: "property" }, e.completion || {}), { label: e.name });
}
function M(e) {
	return typeof e == "string" ? {
		label: `"${e}"`,
		type: "constant"
	} : /^"/.test(e.label) ? e : Object.assign(Object.assign({}, e), { label: `"${e.label}"` });
}
function N(e, t) {
	let n = [], r = [], i = Object.create(null);
	for (let e of t) {
		let t = j(e);
		n.push(t), e.global && r.push(t), e.values && (i[e.name] = e.values.map(M));
	}
	let o = [], s = [], c = Object.create(null);
	for (let t of e) {
		let e = r, a = i;
		t.attributes && (e = e.concat(t.attributes.map((e) => typeof e == "string" ? n.find((t) => t.label == e) || {
			label: e,
			type: "property"
		} : (e.values && (a == i && (a = Object.create(a)), a[e.name] = e.values.map(M)), j(e)))));
		let l = new k(t, e, a);
		c[l.name] = l, o.push(l), t.top && s.push(l);
	}
	s.length || (s = o);
	for (let t = 0; t < o.length; t++) {
		let n = e[t], r = o[t];
		if (n.children) for (let e of n.children) c[e] && r.children.push(c[e]);
		else r.children = o;
	}
	return (e) => {
		let { doc: t } = e.state, n = function(e, t) {
			let n = a(e).resolveInner(t, -1), r = null;
			for (let e = n; !r && e.parent; e = e.parent) e.name != "OpenTag" && e.name != "CloseTag" && e.name != "SelfClosingTag" && e.name != "MismatchedCloseTag" || (r = e);
			if (r && (r.to > t || r.lastChild.type.isError)) {
				let e = r.parent;
				if (n.name == "TagName") return r.name == "CloseTag" || r.name == "MismatchedCloseTag" ? {
					type: "closeTag",
					from: n.from,
					context: e
				} : {
					type: "openTag",
					from: n.from,
					context: O(e)
				};
				if (n.name == "AttributeName") return {
					type: "attrName",
					from: n.from,
					context: r
				};
				if (n.name == "AttributeValue") return {
					type: "attrValue",
					from: n.from,
					context: r
				};
				let i = n == r || n.name == "Attribute" ? n.childBefore(t) : n;
				return i?.name == "StartTag" ? {
					type: "openTag",
					from: t,
					context: O(e)
				} : i?.name == "StartCloseTag" && i.to <= t ? {
					type: "closeTag",
					from: t,
					context: e
				} : i?.name == "Is" ? {
					type: "attrValue",
					from: t,
					context: r
				} : i ? {
					type: "attrName",
					from: t,
					context: r
				} : null;
			}
			if (n.name == "StartCloseTag") return {
				type: "closeTag",
				from: t,
				context: n.parent
			};
			for (; n.parent && n.to == t && !n.lastChild?.type.isError;) n = n.parent;
			return n.name == "Element" || n.name == "Text" || n.name == "Document" ? {
				type: "tag",
				from: t,
				context: n.name == "Element" ? n : O(n)
			} : null;
		}(e.state, e.pos);
		if (!n || n.type == "tag" && !e.explicit) return null;
		let { type: l, from: u, context: d } = n;
		if (l == "openTag") {
			let e = s, n = D(t, d);
			return n && (e = c[n]?.children || o), {
				from: u,
				options: e.map((e) => e.completion),
				validFor: A
			};
		}
		if (l == "closeTag") {
			let n = D(t, d);
			return n ? {
				from: u,
				to: e.pos + +(t.sliceString(e.pos, e.pos + 1) == ">"),
				options: [c[n]?.closeNameCompletion || {
					label: n + ">",
					type: "type"
				}],
				validFor: A
			} : null;
		}
		if (l == "attrName") return {
			from: u,
			options: c[E(t, d)]?.attrs || r,
			validFor: A
		};
		if (l == "attrValue") {
			let n = function(e, t, n) {
				let r = t && t.getChildren("Attribute").find((e) => e.from <= n && e.to >= n), i = r && r.getChild("AttributeName");
				return i ? e.sliceString(i.from, i.to) : "";
			}(t, d, u);
			if (!n) return null;
			let r = (c[E(t, d)]?.attrValues || i)[n];
			return r && r.length ? {
				from: u,
				to: e.pos + +(t.sliceString(e.pos, e.pos + 1) == "\""),
				options: r,
				validFor: /^"[^"]*"?$/
			} : null;
		}
		if (l == "tag") {
			let n = D(t, d), r = c[n], i = [], a = d && d.lastChild;
			!n || a && a.name == "CloseTag" && E(t, a) == n || i.push(r ? r.closeCompletion : {
				label: "</" + n + ">",
				type: "type",
				boost: 2
			});
			let l = i.concat((r?.children || (d ? o : s)).map((e) => e.openCompletion));
			if (d && r?.text.length) {
				let t = d.firstChild;
				t.to > e.pos - 20 && !/\S/.test(e.state.sliceDoc(t.to, e.pos)) && (l = l.concat(r.text));
			}
			return {
				from: u,
				options: l,
				validFor: /^<\/?[:\-\.\w\u00b7-\uffff]*$/
			};
		}
		return null;
	};
}
var P = s.define({
	name: "xml",
	parser: T.configure({ props: [
		i.add({
			Element(e) {
				let t = /^\s*<\//.test(e.textAfter);
				return e.lineIndent(e.node.from) + (t ? 0 : e.unit);
			},
			"OpenTag CloseTag SelfClosingTag": (e) => e.column(e.node.from) + e.unit
		}),
		t.add({ Element(e) {
			let t = e.firstChild, n = e.lastChild;
			return t && t.name == "OpenTag" ? {
				from: t.to,
				to: n.name == "CloseTag" ? n.from : e.to
			} : null;
		} }),
		c.add({ "OpenTag CloseTag": (e) => e.getChild("TagName") })
	] }),
	languageData: {
		commentTokens: { block: {
			open: "<!--",
			close: "-->"
		} },
		indentOnInput: /^\s*<\/$/
	}
});
function F(e = {}) {
	return new r(P, P.data.of({ autocomplete: N(e.elements || [], e.attributes || []) }));
}
//#endregion
export { N as completeFromSchema, F as xml, P as xmlLanguage };
