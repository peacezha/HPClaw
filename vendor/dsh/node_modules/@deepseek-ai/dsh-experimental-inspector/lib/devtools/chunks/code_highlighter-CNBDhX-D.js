import "./text_utils-DWSliayn.js";
import { A as e, An as t, At as n, C as r, Dn as i, F as a, Ht as o, J as s, Jt as c, K as l, Nn as u, V as d, W as f, X as p, at as m, f as h, ft as g, ln as _, mn as v, mt as y, r as b, s as x, u as S, v as C, vt as w, wn as T, wt as E, xt as D, z as O } from "./codemirror-CENmPHF2.js";
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/components/code_highlighter/codeHighlighter.css.mjs
var k = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.token-variable {\n  color: var(--sys-color-token-variable);\n}\n\n.token-property {\n  color: var(--sys-color-token-property);\n}\n\n.token-type {\n  color: var(--sys-color-token-type);\n}\n\n.token-variable-special {\n  color: var(--sys-color-token-variable-special);\n}\n\n.token-definition {\n  color: var(--sys-color-token-definition);\n}\n\n.token-builtin {\n  color: var(--sys-color-token-builtin);\n}\n\n.token-number {\n  color: var(--sys-color-token-number);\n}\n\n.token-string {\n  color: var(--sys-color-token-string);\n}\n\n.token-string-special {\n  color: var(--sys-color-token-string-special);\n}\n\n.token-atom {\n  color: var(--sys-color-token-atom);\n}\n\n.token-keyword {\n  color: var(--sys-color-token-keyword);\n}\n\n.token-comment {\n  color: var(--sys-color-token-comment);\n}\n\n.token-meta {\n  color: var(--sys-color-token-meta);\n}\n\n.token-invalid {\n  color: var(--sys-color-error);\n}\n\n.token-tag {\n  color: var(--sys-color-token-tag);\n}\n\n.token-attribute {\n  color: var(--sys-color-token-attribute);\n}\n\n.token-attribute-value {\n  color: var(--sys-color-token-attribute-value);\n}\n\n.token-inserted {\n  color: var(--sys-color-token-inserted);\n}\n\n.token-deleted {\n  color: var(--sys-color-token-deleted);\n}\n\n.token-heading {\n  color: var(--sys-color-token-variable-special);\n  font-weight: bold;\n}\n\n.token-link {\n  color: var(--sys-color-token-variable-special);\n  text-decoration: underline;\n}\n\n.token-strikethrough {\n  text-decoration: line-through;\n}\n\n.token-strong {\n  font-weight: bold;\n}\n\n.token-emphasis {\n  font-style: italic;\n}\n", A = D, j = S.define([
	{
		tag: A.variableName,
		class: "token-variable"
	},
	{
		tag: A.definition(A.variableName),
		class: "token-definition"
	},
	{
		tag: A.propertyName,
		class: "token-property"
	},
	{
		tag: [
			A.typeName,
			A.className,
			A.namespace,
			A.macroName
		],
		class: "token-type"
	},
	{
		tag: [A.special(A.name), A.constant(A.className)],
		class: "token-variable-special"
	},
	{
		tag: A.standard(A.variableName),
		class: "token-builtin"
	},
	{
		tag: [
			A.number,
			A.literal,
			A.unit
		],
		class: "token-number"
	},
	{
		tag: A.string,
		class: "token-string"
	},
	{
		tag: [
			A.special(A.string),
			A.regexp,
			A.escape
		],
		class: "token-string-special"
	},
	{
		tag: [
			A.atom,
			A.labelName,
			A.bool
		],
		class: "token-atom"
	},
	{
		tag: A.keyword,
		class: "token-keyword"
	},
	{
		tag: [A.comment, A.quote],
		class: "token-comment"
	},
	{
		tag: A.meta,
		class: "token-meta"
	},
	{
		tag: A.invalid,
		class: "token-invalid"
	},
	{
		tag: A.tagName,
		class: "token-tag"
	},
	{
		tag: A.attributeName,
		class: "token-attribute"
	},
	{
		tag: A.attributeValue,
		class: "token-attribute-value"
	},
	{
		tag: A.inserted,
		class: "token-inserted"
	},
	{
		tag: A.deleted,
		class: "token-deleted"
	},
	{
		tag: A.heading,
		class: "token-heading"
	},
	{
		tag: A.link,
		class: "token-link"
	},
	{
		tag: A.strikethrough,
		class: "token-strikethrough"
	},
	{
		tag: A.strong,
		class: "token-strong"
	},
	{
		tag: A.emphasis,
		class: "token-emphasis"
	}
]);
async function M(e, t) {
	let n = await P(t), r;
	return r = n ? n.language.parser.parse(e) : new a(_.none, [], [], e.length), new F(e, r);
}
async function N(e, t) {
	let n = await M(e.textContent || "", t);
	e.removeChildren(), n.highlight((t, n) => {
		let r = document.createTextNode(t);
		if (n) {
			let e = document.createElement("span");
			e.className = n, e.appendChild(r), r = e;
		}
		e.appendChild(r);
	});
}
async function P(a) {
	switch (a) {
		case "application/javascript":
		case "application/ecmascript":
		case "application/x-ecmascript":
		case "application/x-javascript":
		case "text/ecmascript":
		case "text/javascript1.0":
		case "text/javascript1.1":
		case "text/javascript1.2":
		case "text/javascript1.3":
		case "text/javascript1.4":
		case "text/javascript1.5":
		case "text/jscript":
		case "text/livescript ":
		case "text/x-ecmascript":
		case "text/x-javascript":
		case "text/javascript":
		case "text/jsx": return T.javascript({ jsx: !0 });
		case "text/typescript": return T.javascript({ typescript: !0 });
		case "text/typescript-jsx": return T.javascript({
			typescript: !0,
			jsx: !0
		});
		case "text/css": return u.css();
		case "text/html": return r.html({
			autoCloseTags: !1,
			selfClosingTags: !0
		});
		case "application/xml":
		case "application/xhtml+xml":
		case "image/svg+xml": return (await C()).xml();
		case "application/wasm": return (await v()).wast();
		case "text/x-c++src": return (await s()).cpp();
		case "text/x-go": return new o(await b());
		case "text/x-java": return (await O()).java();
		case "text/x-kotlin": return new o(await p());
		case "application/json":
		case "application/manifest+json": {
			let e = T.javascriptLanguage.configure({ top: "SingleExpression" });
			return new o(e);
		}
		case "application/x-httpd-php": return (await x()).php();
		case "text/x-python": return (await h()).python();
		case "text/markdown": return (await g()).markdown();
		case "text/x-sh": return new o(await E());
		case "text/x-coffeescript": return new o(await n());
		case "text/x-clojure": return new o(await i());
		case "application/vnd.dart": return new o(await t());
		case "text/x-gss": return new o(await c());
		case "text/x-less": return (await w()).less();
		case "text/x-sass": return (await l()).sass({ indented: !0 });
		case "text/x-scala": return new o(await e());
		case "text/x-scss": return (await l()).sass({ indented: !1 });
		case "text/x.angular": return (await f()).angular();
		case "text/x.svelte": return (await y()).svelte();
		case "text/x.vue": return (await m()).vue();
		default: return null;
	}
}
var F = class {
	code;
	tree;
	constructor(e, t) {
		this.code = e, this.tree = t;
	}
	highlight(e) {
		this.highlightRange(0, this.code.length, e);
	}
	highlightRange(e, t, n) {
		let r = e, i = (e, t) => {
			e > r && (n(this.code.slice(r, e), t), r = e);
		};
		d(this.tree, j, (e, t, n) => {
			i(e, ""), i(t, n);
		}, e, t), i(t, "");
	}
};
//#endregion
export { k as a, P as i, N as n, j as r, M as t };
