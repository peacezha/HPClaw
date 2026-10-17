import { H as e, K as t, _ as n, h as r } from "./common-DMSVbaSb.js";
import { Bl as i, Fo as a, No as o, Po as s, Wo as c, md as l, za as u } from "./legacy-dM_vujv7.js";
import { n as d, t as f } from "./diff-DXcO6Sla.js";
import { fn as p, in as m, u as h } from "./common-Bs7hSOUj.js";
import { a as g, t as _ } from "./code_highlighter-CNBDhX-D.js";
import "./icon_button-DGIafxYW.js";
import { a as v } from "./snippets-BWb8aXVv.js";
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/components/diff_view/diffView.css.mjs
var y = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.diff-listing {\n  display: grid;\n  grid-template-columns: max-content max-content max-content auto;\n  font-family: var(--source-code-font-family);\n  font-size: var(--source-code-font-size);\n  white-space: pre;\n  line-height: 1.2em;\n  user-select: text;\n}\n\n.diff-line-number {\n  color: var(--sys-color-token-subtle);\n  padding: 0 3px 0 9px;\n  text-align: right;\n  user-select: none;\n}\n\n.diff-line-marker {\n  user-select: none;\n  border-right: 1px solid var(--sys-color-divider);\n  width: 20px;\n  text-align: center;\n}\n\n.diff-line-content {\n  padding: 0 4px;\n}\n\n.diff-line-marker-addition,\n.diff-line-addition {\n  background-color: var(--sys-color-surface-green);\n}\n\n.diff-line-marker-deletion,\n.diff-line-deletion {\n  background-color: var(--sys-color-surface-error);\n}\n\n.diff-line-addition .inner-diff {\n  background-color: color-mix(\n    in srgb,\n    var(--ref-palette-green70) 40%,\n    transparent\n  );\n}\n\n.diff-line-deletion .inner-diff {\n  background-color: color-mix(\n    in srgb,\n    var(--ref-palette-error60) 40%,\n    transparent\n  );\n}\n\n.diff-hidden-text {\n  display: inline-block;\n  width: 0;\n  overflow: hidden;\n}\n\n.diff-line-equal {\n  opacity: 50%;\n}\n\n.diff-line-spacer {\n  text-align: center;\n  background-color: var(--sys-color-surface5);\n}\n\n.diff-listing-no-diff {\n  user-select: auto;\n  font-family: var(--source-code-font-family);\n  font-size: var(--source-code-font-size);\n  margin: 0;\n  padding: var(--sys-size-5) 9px;\n}\n", { html: b } = o, x = {
	deletions: "Deletion:",
	additions: "Addition:",
	changesDiffViewer: "Changes diff viewer",
	SkippingDMatchingLines: "( … Skipping {PH1} matching lines … )",
	noDiff: "File is identical to its unmodified state"
}, S = t("ui/components/diff_view/DiffView.ts", x), C = e.bind(void 0, S), w = /* @__PURE__ */ function(e) {
	return e.DELETION = "deletion", e.ADDITION = "addition", e.EQUAL = "equal", e.SPACER = "spacer", e;
}({});
function T(e) {
	let t = 0, n = 0, r = [], i = [], a = [];
	for (let t = 0; t < e.length; ++t) {
		let n = e[t];
		switch (n[0]) {
			case d.Equal:
				a.push(...o(n[1], t === 0, t === e.length - 1)), r.push(...n[1]), i.push(...n[1]);
				break;
			case d.Insert:
				for (let e of n[1]) a.push(c(e, "addition"));
				i.push(...n[1]);
				break;
			case d.Delete: if (r.push(...n[1]), e[t + 1] && e[t + 1][0] === d.Insert) t++, a.push(...s(n[1].join("\n"), e[t][1].join("\n"))), i.push(...e[t][1]);
			else for (let e of n[1]) a.push(c(e, "deletion"));
		}
	}
	return {
		originalLines: r,
		currentLines: i,
		rows: a
	};
	function o(e, r, i) {
		let a = [];
		if (!r) {
			for (let t = 0; t < 3 && t < e.length; t++) a.push(c(e[t], "equal"));
			e.length > 7 && !i && a.push(c(C(x.SkippingDMatchingLines, { PH1: e.length - 6 }), "spacer"));
		}
		if (!i) {
			let i = Math.max(e.length - 3 - 1, r ? 0 : 3), o = e.length - 3 - 1;
			r || (o -= 3), o > 0 && (n += o, t += o);
			for (let t = i; t < e.length; t++) a.push(c(e[t], "equal"));
		}
		return a;
	}
	function s(e, t) {
		let n = f.charDiff(e, t, !0), r = [c("", "deletion")], i = [c("", "addition")];
		for (let e of n) {
			let t = e[1], n = e[0], a = n === d.Equal ? "" : "inner-diff", o = t.split("\n");
			for (let e = 0; e < o.length; e++) e > 0 && n !== d.Insert && r.push(c("", "deletion")), e > 0 && n !== d.Delete && i.push(c("", "addition")), o[e] && (n !== d.Insert && r[r.length - 1].tokens.push({
				text: o[e],
				className: a
			}), n !== d.Delete && i[i.length - 1].tokens.push({
				text: o[e],
				className: a
			}));
		}
		return r.concat(i);
	}
	function c(e, r) {
		return r === "addition" && t++, r === "deletion" && n++, r === "equal" && (n++, t++), {
			originalLineNumber: n,
			currentLineNumber: t,
			tokens: e ? [{
				text: e,
				className: "inner-diff"
			}] : [],
			type: r
		};
	}
}
function E(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n = 0, r = 0; r < e.length; r++) t.set(r + 1, n), n += e[r].length + 1;
	return t;
}
var D = class e {
	originalHighlighter;
	originalMap;
	currentHighlighter;
	currentMap;
	constructor(e, t, n, r) {
		this.originalHighlighter = e, this.originalMap = t, this.currentHighlighter = n, this.currentMap = r;
	}
	#e(e) {
		return b`
      <style>${y}</style>
      <style>${g}</style>
      <div class="diff-listing" aria-label=${C(x.changesDiffViewer)}>
        ${e.map((e) => this.#t(e))}
      </div>`;
	}
	#t(e) {
		let t = e.type === "equal" || e.type === "deletion" ? String(e.originalLineNumber) : "", n = e.type === "equal" || e.type === "addition" ? String(e.currentLineNumber) : "", r = "", i = "diff-line-marker", a = null;
		return e.type === "addition" ? (r = "+", i += " diff-line-addition", a = b`<span class="diff-hidden-text">${C(x.additions)}</span>`) : e.type === "deletion" && (r = "-", i += " diff-line-deletion", a = b`<span class="diff-hidden-text">${C(x.deletions)}</span>`), b`
      <div class="diff-line-number" aria-hidden="true">${t}</div>
      <div class="diff-line-number" aria-hidden="true">${n}</div>
      <div class=${i} aria-hidden="true">${r}</div>
      <div class="diff-line-content diff-line-${e.type}" data-line-number=${n} jslog=${u("changes.reveal-source").track({ click: !0 })}>${a}${this.#n(e)}</div>`;
	}
	#n(e) {
		if (e.type === "spacer") return e.tokens.map((e) => b`${e.text}`);
		let [t, n] = e.type === "deletion" ? [this.originalHighlighter, this.originalMap.get(e.originalLineNumber)] : [this.currentHighlighter, this.currentMap.get(e.currentLineNumber)], r = [], i = n;
		for (let n of e.tokens) {
			let e = [];
			t.highlightRange(i, i + n.text.length, (t, n) => {
				e.push(n ? b`<span class=${n}>${t}</span>` : t);
			}), r.push(n.className ? b`<span class=${n.className}>${e}</span>` : b`${e}`), i += n.text.length;
		}
		return r;
	}
	static async render(t, n, r) {
		let { originalLines: i, currentLines: o, rows: s } = T(t), c = new e(await _(i.join("\n"), n), E(i), await _(o.join("\n"), n), E(o));
		a(c.#e(s), r, { host: this });
	}
};
function O(e) {
	a(b`
    <style>${y}</style>
    <p class="diff-listing-no-diff" data-testid="no-diff">${C(x.noDiff)}</p>`, e, { host: e });
}
var k = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	loaded;
	constructor(e) {
		super(), this.loaded = this.#t(e);
	}
	set data(e) {
		this.loaded = this.#t(e);
	}
	async #t(e) {
		if (!e || e.diff.length === 0) {
			O(this.#e);
			return;
		}
		await D.render(e.diff, e.mimeType, this.#e);
	}
};
customElements.define("devtools-diff-view", k);
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/utils/utils.ts
var { ref: A, styleMap: j, ifDefined: M } = c, N = {
	requestContentHeadersOverridden: "Both request content and headers are overridden",
	requestContentOverridden: "Request content is overridden",
	requestHeadersOverridden: "Request headers are overridden",
	thirdPartyPhaseout: "Cookies for this request are blocked either because of Chrome flags or browser configuration. Learn more in the Issues panel.",
	resourceTypeWithThrottling: "{PH1} (throttled to {PH2})",
	requestFailed: "{PH1} request failed",
	prefetchFailed: "{PH1} prefetch request failed"
}, P = t("panels/utils/utils.ts", N), F = e.bind(void 0, P), I = class e {
	static isFailedNetworkRequest(e) {
		if (!e) return !1;
		if (e.failed && !e.statusCode || e.statusCode >= 400) return !0;
		let t = e.signedExchangeInfo();
		return !!(t !== null && t.errors || e.corsErrorStatus());
	}
	static getIconForNetworkRequest(t) {
		let i = t.resourceType();
		if (e.isFailedNetworkRequest(t)) {
			let e, r;
			return t.resourceType() === n.Prefetch ? (r = F(N.prefetchFailed, { PH1: i.title() }), e = "warning-filled") : (r = F(N.requestFailed, { PH1: i.title() }), e = "cross-circle-filled"), s`<devtools-icon
          class="icon"
          name=${e}
          title=${r}
          role=img
        ></devtools-icon>`;
		}
		if (t.hasThirdPartyCookiePhaseoutIssue()) return s`<devtools-icon
        class="icon"
        name="warning-filled"
        role=img
        title=${F(N.thirdPartyPhaseout)}
      ></devtools-icon>`;
		let a = t.hasOverriddenHeaders(), o = t.hasOverriddenContent;
		if (a || o) {
			let e;
			return e = F(a && o ? N.requestContentHeadersOverridden : o ? N.requestContentOverridden : N.requestHeadersOverridden), s`<div class="network-override-marker">
          <devtools-icon class="icon" name="document" role=img title=${e}></devtools-icon>
        </div>`;
		}
		let c = r.fromMimeType(t.mimeType);
		if (c !== i && c !== n.Other && (i === n.Fetch || c === n.Image || i === n.Other && c === n.Script) && (i = c), i === n.Image) return s`<div class="image icon">
        <img
          class="image-network-icon-preview"
          title=${f(t)}
          alt=${f(t)}
          ${A((e) => {
			e && t.populateImageSource(e);
		})}
        />
      </div>`;
		if (i !== n.Manifest && r.simplifyContentType(t.mimeType) === "application/json") return s`<devtools-icon
          class="icon" name="file-json" title=${f(t)} role=img
          style="color:var(--icon-file-script)">
        </devtools-icon>`;
		let { iconName: u, color: d } = e.iconDataForResourceType(i);
		return s`<devtools-icon
        class="icon" name=${u} title=${f(t)}
        style=${j({ color: d })}>
      </devtools-icon>`;
		function f(e) {
			let t = l.instance().appliedRequestConditions(e);
			if (!t?.urlPattern) return e.resourceType().title();
			let n = typeof t?.conditions.title == "string" ? t?.conditions.title : t?.conditions.title();
			return F(N.resourceTypeWithThrottling, {
				PH1: e.resourceType().title(),
				PH2: n
			});
		}
	}
	static iconDataForResourceType(e) {
		return e.isDocument() ? { iconName: "file-document" } : e.isImage() ? {
			iconName: "file-image",
			color: "var(--icon-file-image)"
		} : e.isFont() ? { iconName: "file-font" } : e.isScript() ? { iconName: "file-script" } : e.isStyleSheet() ? { iconName: "file-stylesheet" } : e.name() === n.Manifest.name() ? { iconName: "file-manifest" } : e.name() === n.Wasm.name() ? { iconName: "file-wasm" } : e.name() === n.WebSocket.name() || e.name() === n.DirectSocket.name() ? { iconName: "file-websocket" } : e.name() === n.Media.name() ? { iconName: "file-media" } : e.name() === n.Fetch.name() || e.name() === n.XHR.name() ? { iconName: "file-fetch-xhr" } : { iconName: "file-generic" };
	}
	static getIconForSourceFile(e) {
		let t = p.instance().binding(e), n = m.instance(), r = "document", i = !1, a = !1;
		t ? (v(t.fileSystem) && (r = "snippet"), i = !0, a = n.project() === t.fileSystem.project()) : n.isActiveHeaderOverrides(e) ? (i = !0, a = !0) : v(e) && (r = "snippet");
		let o = t ? h.tooltipForUISourceCode(e) : void 0;
		return s`<devtools-file-source-icon
        class="icon"
        name=${r} 
        title=${M(o)} 
        .data=${{
			contentType: e.contentType().name(),
			hasDotBadge: i,
			isDotPurple: a,
			iconType: r
		}}></devtools-file-source-icon>`;
	}
	static async formatCSSChangesFromDiff(e) {
		let { originalLines: t, currentLines: n, rows: r } = T(e), i = await L(t.join("\n")), a = await L(n.join("\n")), o = "", s, c, l = !1;
		for (let { currentLineNumber: e, originalLineNumber: u, type: d } of r) {
			if (d !== w.DELETION && d !== w.ADDITION) continue;
			let r = d === w.DELETION, f = r ? t : n, p = r ? u - 1 : e - 1, m = f[p].trim(), { declarationIDToStyleRule: h, styleRuleIDToStyleRule: g } = r ? i : a, _, v = "";
			if (h.has(p)) {
				_ = h.get(p);
				let e = _.selector;
				e !== s && e !== c && (v += `${e} {\n`), v += "  ", l = !0;
			} else l &&= (v = "}\n\n", !1), g.has(p) && (_ = g.get(p));
			let y = r ? `/* ${m} */` : m;
			o += v + y + "\n", r ? s = _?.selector : c = _?.selector;
		}
		return o.length > 0 && (o += "}"), o;
	}
	static highlightElement(e) {
		e.scrollIntoViewIfNeeded(), e.animate([
			{
				offset: 0,
				backgroundColor: "rgba(255, 255, 0, 0.2)"
			},
			{
				offset: .1,
				backgroundColor: "rgba(255, 255, 0, 0.7)"
			},
			{
				offset: 1,
				backgroundColor: "transparent"
			}
		], {
			duration: 2e3,
			easing: "cubic-bezier(0, 0, 0.2, 1)"
		});
	}
};
async function L(e) {
	let t = await new Promise((t) => {
		let n = [];
		i().parseCSS(e, (e, r) => {
			n.push(...r), e && t(n);
		});
	}), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
	for (let e of t) if ("styleRange" in e) {
		let t = e.selectorText.split("\n").pop()?.trim();
		if (!t) continue;
		let i = {
			rule: e,
			selector: t
		};
		r.set(e.styleRange.startLine, i);
		for (let t of e.properties) n.set(t.range.startLine, i);
	}
	return {
		declarationIDToStyleRule: n,
		styleRuleIDToStyleRule: r
	};
}
//#endregion
export { I as t };
