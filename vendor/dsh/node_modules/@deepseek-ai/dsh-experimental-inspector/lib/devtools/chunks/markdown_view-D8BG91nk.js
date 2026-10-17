import { H as e, K as t } from "./common-DMSVbaSb.js";
import { $i as n, Fo as r, No as i, Po as a, Vo as o, Zi as s, Zo as c, ln as l, no as u, qr as d, za as f } from "./legacy-dM_vujv7.js";
import "./text_utils-DWSliayn.js";
import { An as p, C as m, Ht as h, J as g, Nn as _, Ot as v, S as y, T as b, W as x, X as S, at as C, f as w, ft as T, mt as E, r as ee, s as D, st as O, v as k, wn as A, wt as j, z as M } from "./codemirror-CENmPHF2.js";
import { x as N } from "./text_editor-B6PKcoob.js";
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/components/markdown_view/codeBlock.css.mjs
var P = "/*\n * Copyright 2023 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\n:host {\n  display: block;\n  /**\n    Adjusts the max height of the code area.\n    This can be changed from outside by targeting `devtools-code-block` element.\n  */\n  --code-block-max-code-height: none;\n  /**\n    Adjusts the background color of the code block element.\n    This can be changed from outside by targeting `devtools-code-block` element.\n  */\n  --code-block-background-color: var(--sys-color-surface2);\n}\n\n.codeblock {\n  box-sizing: border-box;\n  color: var(--sys-color-on-surface);\n}\n\n.codeblock .editor-wrapper {\n  color: var(--sys-color-on-surface);\n  background: var(--code-block-background-color); /* stylelint-disable-line plugin/use_theme_colors */\n  padding: 10px 5px 0;\n  border-bottom-left-radius: var(--sys-shape-corner-extra-small);\n  border-bottom-right-radius: var(--sys-shape-corner-extra-small);\n}\n\n.codeblock .editor-wrapper:has(.heading) {\n  padding: var(--sys-size-3) var(--sys-size-4) 0 5px;\n}\n\n.codeblock:not(:has(.toolbar)) .editor-wrapper {\n  border-radius: var(--sys-shape-corner-extra-small);\n}\n\n.codeblock .editor-wrapper .code {\n  max-height: var(--code-block-max-code-height);\n  overflow: auto;\n  padding-bottom: 10px;\n}\n\n.heading {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  height: var(--sys-size-11);\n}\n\n.heading-text-wrapper {\n  display: flex;\n\n  .citation {\n    text-decoration: underline;\n    color: var(--sys-color-primary);\n    background-color: transparent;\n    cursor: pointer;\n    outline-offset: var(--sys-size-2);\n    border: none;\n    padding-bottom: 2px;\n    font-size: 11px;\n    font-family: var(--default-font-family);\n  }\n}\n\n.heading-text {\n  font: var(--sys-typescale-body5-bold);\n  padding-left: var(--sys-size-4);\n  padding-right: var(--sys-size-2);\n}\n\n.codeblock .lang {\n  padding: var(--sys-size-4) 0;\n  flex: 1;\n}\n\n.codeblock .copy-button-container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  font-size: var(--sys-typescale-body5-size);\n\n  span {\n    padding-right: var(--sys-size-4);\n  }\n}\n\n.notice {\n  margin-top: var(--sys-size-2);\n  padding: var(--sys-size-4) var(--sys-size-5);\n  background-color: var(--code-block-background-color); /* stylelint-disable-line plugin/use_theme_colors */\n  border-radius: var(--sys-shape-corner-extra-small);\n\n  .link {\n    font: var(--sys-typescale-body4-regular);\n    color: var(--sys-color-primary);\n    text-decoration-line: underline;\n  }\n}\n\n.show-all-container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  padding: var(--sys-size-4) 0;\n  background-color: var(--code-block-background-color); /* stylelint-disable-line plugin/use_theme_colors */\n}\n", { html: F } = i, I = {
	code: "Code",
	copy: "Copy code",
	copyCodeSnippet: "Copy {PH1} code snippet",
	copied: "Copied to clipboard",
	disclaimer: "Use code snippets with caution",
	showAllLines: "Show all lines ({PH1} more)"
}, L = t("ui/components/markdown_view/CodeBlock.ts", I), R = e.bind(void 0, L);
async function z(e) {
	switch (e) {
		case "javascript":
		case "js":
		case "jsx": return A.javascript({ jsx: !0 });
		case "typescript":
		case "ts": return A.javascript({ typescript: !0 });
		case "tsx": return A.javascript({
			typescript: !0,
			jsx: !0
		});
		case "less":
		case "scss":
		case "sass":
		case "css": return _.css();
		case "html": return m.html({
			autoCloseTags: !1,
			selfClosingTags: !0
		});
		case "xml": return (await k()).xml();
		case "cpp": return (await g()).cpp();
		case "go": return new h(await ee());
		case "java": return (await M()).java();
		case "kotlin": return new h(await S());
		case "json": {
			let e = A.javascriptLanguage.configure({ top: "SingleExpression" });
			return new h(e);
		}
		case "php": return (await D()).php();
		case "python":
		case "py": return (await w()).python();
		case "markdown":
		case "md": return (await T()).markdown();
		case "sh":
		case "bash": return new h(await j());
		case "dart": return new h(await p());
		case "angular": return (await x()).angular();
		case "svelte": return (await E()).svelte();
		case "vue": return (await C()).vue();
		default: return m.html({
			autoCloseTags: !1,
			selfClosingTags: !0
		});
	}
}
var B = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t = "";
	#n = "";
	#r = 1e3;
	#i;
	#a = !1;
	#o;
	#s = new b();
	#c = new b();
	#l = !1;
	#u;
	#d = !0;
	#f = [];
	#p = Number.MAX_VALUE;
	connectedCallback() {
		this.#v();
	}
	set code(e) {
		this.#t = e, this.#o = v.create({
			doc: this.#t,
			extensions: [
				N(this.#t),
				v.readOnly.of(!0),
				O.lineWrapping,
				this.#s.of(A.javascript()),
				this.#c.of([])
			]
		}), this.#v();
	}
	get code() {
		return this.#t;
	}
	set codeLang(e) {
		this.#n = e, this.#v();
	}
	set timeout(e) {
		this.#r = e, this.#v();
	}
	set displayNotice(e) {
		this.#l = e, this.#v();
	}
	set header(e) {
		this.#u = e, this.#v();
	}
	set showCopyButton(e) {
		this.#d = e, this.#v();
	}
	set citations(e) {
		this.#f = e;
	}
	set displayLimit(e) {
		this.#p = e, this.#v();
	}
	get displayLimit() {
		return this.#p;
	}
	#m() {
		l(this.#t, R(I.copied)), this.#a = !0, this.#v(), clearTimeout(this.#i), this.#i = setTimeout(() => {
			this.#a = !1, this.#v();
		}, this.#r);
	}
	#h() {
		return F`<p class="notice">
      <devtools-link class="link" href="https://support.google.com/legal/answer/13505487" jslogcontext="code-disclaimer">
        ${R(I.disclaimer)}
      </devtools-link>
    </p>`;
	}
	#g() {
		return F`
      <div class="copy-button-container">
        <devtools-button
          .data=${{
			variant: n.ICON,
			size: s.SMALL,
			jslogContext: "copy",
			iconName: "copy",
			title: R(I.copy)
		}}
          .accessibleLabel=${this.#u ? R(I.copyCodeSnippet, { PH1: this.#u }) : R(I.copy)}
          @click=${this.#m}
        ></devtools-button>
        ${this.#a ? F`<span>${R(I.copied)}</span>` : c}
      </div>`;
	}
	#_() {
		return this.#f.length ? F`
      ${this.#f.map((e) => F`
        <button
          class="citation"
          jslog=${f("inline-citation").track({ click: !0 })}
          @click=${e.clickHandler}
        >[${e.index}]</button>
      `)}
    ` : c;
	}
	async #v() {
		let e = (this.#u ?? this.#n) || R(I.code);
		if (!this.#o) throw Error("Unexpected: trying to render the text editor without editorState");
		let t = this.#o.doc.lines, i = t > this.#p;
		r(F`<div class='codeblock' jslog=${u("code")}>
      <style>${P}</style>
        <div class="editor-wrapper">
        <div class="heading">
          <div class="heading-text-wrapper">
            <h4 class="heading-text">${e}</h4>
            ${this.#_()}
          </div>
          ${this.#d ? this.#g() : c}
        </div>
        <div class="code">
          <devtools-text-editor .state=${this.#o}></devtools-text-editor>
        </div>
        ${i ? F`
          <div class="show-all-container">
            <devtools-button
              .variant=${n.OUTLINED}
              .size=${s.SMALL}
              .jslogContext=${"show-all"}
              .title=${R(I.showAllLines, { PH1: t - this.#p })}
              @click=${() => {
			this.displayLimit = Number.MAX_VALUE;
		}}
            >${R(I.showAllLines, { PH1: t - this.#p })}</devtools-button>
          </div>
        ` : c}
      </div>
      ${this.#l ? this.#h() : c}
    </div>`, this.#e, { host: this });
		let a = this.#e?.querySelector("devtools-text-editor")?.editor;
		if (!a) return;
		let o = await z(this.#n), l = [];
		i && (l = O.decorations.of(y.set(y.replace({}).range(this.#o.doc.line(this.#p).to, this.#o.doc.length)))), a.dispatch({ effects: [this.#s.reconfigure(o), this.#c.reconfigure(l)] });
	}
};
customElements.define("devtools-code-block", B);
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/components/markdown_view/markdownImage.css.mjs
var V = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.markdown-image {\n  display: block;\n}\n", H = /* @__PURE__ */ new Map([]), U = (e) => {
	let t = H.get(e);
	if (!t) throw Error(`Markdown image with key '${e}' is not available, please check MarkdownImagesMap.ts`);
	return t;
}, { html: W, Directives: { ifDefined: G } } = i, K = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t;
	#n;
	set data(e) {
		let { key: t, title: n } = e, r = U(t);
		this.#t = r, this.#n = n, this.#a();
	}
	#r() {
		if (!this.#t) return c;
		let { src: e, color: t, width: n = "100%", height: r = "100%" } = this.#t;
		return W`
      <devtools-icon .data=${{
			iconPath: e,
			color: t,
			width: n,
			height: r
		}}></devtools-icon>
    `;
	}
	#i() {
		if (!this.#t) return c;
		let { src: e, width: t = "100%", height: n = "100%" } = this.#t;
		return W`
      <img class="markdown-image" src=${e} alt=${G(this.#n)} width=${t} height=${n} />
    `;
	}
	#a() {
		if (!this.#t) return;
		let { isIcon: e } = this.#t, t = e ? this.#r() : this.#i();
		r(W`
      <style>${V}</style>
      ${t}
    `, this.#e, { host: this });
	}
};
customElements.define("devtools-markdown-image", K);
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/components/markdown_view/MarkdownLinksMap.ts
var q = /* @__PURE__ */ new Map([
	["issuesContrastWCAG21AA", "https://www.w3.org/TR/WCAG21/#contrast-minimum"],
	["issuesContrastWCAG21AAA", "https://www.w3.org/TR/WCAG21/#contrast-enhanced"],
	["issuesContrastSuggestColor", "https://developers.google.com/web/updates/2020/08/devtools#accessible-color"],
	["issuesCSPSetStrict", "https://web.dev/strict-csp"],
	["issuesCSPWhyStrictOverAllowlist", "https://web.dev/strict-csp/#why-a-strict-csp-is-recommended-over-allowlist-csps"],
	["issueCorsPreflightRequest", "https://web.dev/cross-origin-resource-sharing/#preflight-requests-for-complex-http-calls"],
	["issueQuirksModeDoctype", "https://web.dev/doctype/"],
	["sameSiteAndSameOrigin", "https://web.dev/same-site-same-origin/"],
	["punycodeReference", "https://wikipedia.org/wiki/Punycode"],
	["https://xhr.spec.whatwg.org/", "https://xhr.spec.whatwg.org/"],
	["https://goo.gle/chrome-insecure-origins", "https://goo.gle/chrome-insecure-origins"],
	["https://webrtc.org/web-apis/chrome/unified-plan/", "https://webrtc.org/web-apis/chrome/unified-plan/"],
	["https://developer.chrome.com/blog/enabling-shared-array-buffer/", "https://developer.chrome.com/blog/enabling-shared-array-buffer/"],
	["https://developer.chrome.com/docs/extensions/mv3/", "https://developer.chrome.com/docs/extensions/mv3/"],
	["https://developer.chrome.com/blog/immutable-document-domain/", "https://developer.chrome.com/blog/immutable-document-domain/"],
	["https://github.com/WICG/shared-element-transitions/blob/main/debugging_overflow_on_images.md", "https://github.com/WICG/shared-element-transitions/blob/main/debugging_overflow_on_images.md"],
	["https://developer.chrome.com/docs/extensions/reference/privacy/#property-websites-privacySandboxEnabled", "https://developer.chrome.com/docs/extensions/reference/privacy/#property-websites-privacySandboxEnabled"],
	["PNASecureContextRestrictionFeatureStatus", "https://chromestatus.com/feature/5954091755241472"],
	["https://w3c.github.io/uievents/#legacy-event-types", "https://w3c.github.io/uievents/#legacy-event-types"],
	["manageCookiesHelpPage", "https://support.google.com/chrome/answer/95647"],
	["gracePeriodStagedControlExplainer", "https://developers.google.com/privacy-sandbox/blog/grace-period-opt-out"],
	["signatureHeader", "https://www.rfc-editor.org/rfc/rfc9421.html#name-the-signature-http-field"],
	["signatureInputHeader", "https://www.rfc-editor.org/rfc/rfc9421.html#name-the-signature-input-http-fi"],
	["signatureParameters", "https://www.rfc-editor.org/rfc/rfc9421.html#name-signature-parameters"],
	["sfByteSequence", "https://www.rfc-editor.org/rfc/rfc8941.html#name-byte-sequences"],
	["sfDictionary", "https://www.rfc-editor.org/rfc/rfc8941.html#name-dictionaries"],
	["sfInnerList", "https://www.rfc-editor.org/rfc/rfc8941.html#name-inner-lists"],
	["sfList", "https://www.rfc-editor.org/rfc/rfc8941.html#name-lists"],
	["sfString", "https://www.rfc-editor.org/rfc/rfc8941.html#name-strings"],
	["sfToken", "https://www.rfc-editor.org/rfc/rfc8941.html#name-tokens"],
	["componentParameterSf", "https://www.rfc-editor.org/rfc/rfc9421.html#name-strict-serialization-of-htt"],
	["componentParameterReq", "https://www.rfc-editor.org/rfc/rfc9421.html#content-request-response"],
	["unencodedDigestHeader", "https://lpardue.github.io/draft-pardue-http-identity-digest/draft-pardue-httpbis-identity-digest.html"],
	["storagePartitioningExplainer", "https://developers.google.com/privacy-sandbox/cookies/storage-partitioning"],
	["storageAccessAPI", "https://developer.mozilla.org/en-US/docs/Web/API/StorageAccessHandle/createObjectURL"],
	["https://goo.gle/ps-status", "https://goo.gle/ps-status"],
	["https://privacysandbox.com/news/update-on-plans-for-privacy-sandbox-technologies/", "https://privacysandbox.com/news/update-on-plans-for-privacy-sandbox-technologies/"],
	["urlPatternSpec", "https://urlpattern.spec.whatwg.org/"],
	["SelectivePermissionsInterventionIssue", "https://issues.chromium.org/issues/new?component=1456114&title=Selective%20Permissions%20Intervention%20Breakage:%20%3Cyour%20domain%20here%3E&template=0"],
	["ChromeFilterlistRepository", "https://github.com/chromium/chromium-ads-detection"]
]), J = (e) => {
	if (/^https:\/\/www\.chromestatus\.com\//.test(e) || /^https:\/\/developer\.chrome\.com\//.test(e) || /^https:\/\/developers\.google\.com\//.test(e) || /^https:\/\/web\.dev\//.test(e) || /^https:\/\/developer\.mozilla\.org\//.test(e) || e === "https://philipwalton.com/articles/the-state-of-es5-on-the-web/") return e;
	let t = q.get(e);
	if (!t) {
		if (d.instance().isEnabled("beyondStylingAntigravity") || d.instance().isEnabled("beyondStylingGemini")) return e;
		throw Error(`Markdown link with key '${e}' is not available, please check MarkdownLinksMap.ts`);
	}
	return t;
}, Y = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  --code-background-color: var(--sys-color-surface4);\n}\n\n@keyframes typing {\n  from { width: 0; }\n  to { width: 100%; }\n}\n\n@keyframes expand {\n  from { height: 0; }\n  to { height: auto; }\n}\n\ndevtools-link {\n  color: var(--sys-color-primary);\n  outline-offset: 2px;\n  text-decoration: underline;\n}\n\n.animating {\n  overflow: hidden;\n  white-space: nowrap;\n  animation: typing 0.4s steps(40, end);\n}\n\ndevtools-code-block.animating {\n  animation: expand 0.1s linear;\n}\n\n.pending {\n  display: none !important; /* stylelint-disable-line declaration-no-important */\n}\n\n.message {\n  line-height: 18px;\n  font-size: 12px;\n  color: var(--sys-color-on-surface);\n  user-select: text;\n}\n\n.message p {\n  margin: 0;\n}\n\n.message p:not(:first-child) {\n  margin-block-start: 2px;\n}\n\n.message p:not(:last-child) {\n  margin-bottom: 10px;\n}\n\n.message ul {\n  list-style-type: none;\n  padding-inline-start: var(--sys-size-8);\n}\n\n.message ul ul {\n  padding-inline-start: 19px;\n}\n\n.message li {\n  margin-top: 8px;\n  display: list-item;\n  list-style-type: disc;\n}\n\n.message code {\n  color: var(--sys-color-on-surface);\n  font-family: var(--monospace-font-family);\n  font-size: 11px;\n  user-select: text;\n  cursor: text;\n  /* This is still using design tokens because `--code-background-color` is defined with them by default */\n  /* stylelint-disable-next-line plugin/use_theme_colors */\n  background-color: var(--code-background-color);\n  border-radius: 2px;\n  padding: 1px 3px;\n}\n\ndevtools-code-block {\n  margin-bottom: var(--sys-size-5);\n}\n\n.citation {\n  text-decoration: underline;\n  color: var(--sys-color-primary);\n  background-color: transparent;\n  cursor: pointer;\n  outline-offset: var(--sys-size-2);\n  border: none;\n  padding: 0;\n  font-size: 10px;\n  font-family: var(--default-font-family);\n}\n\nh1.insight, h2.insight, h3.insight, h4.insight, h5.insight, h6.insight {\n  font: var(--sys-typescale-body4-bold);\n  margin: var(--sys-size-1) 0 10px;\n}\n", X = a, Z = r, Q = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t = [];
	#n = new $();
	#r = !1;
	#i = !1;
	set data(e) {
		this.#t = e.tokens, e.renderer && (this.#n = e.renderer), e.animationEnabled ? (this.#r = !0, this.#n.addCustomClasses({
			paragraph: "pending",
			heading: "pending",
			list_item: "pending",
			code: "pending"
		})) : this.#a(), this.#s();
	}
	#a() {
		let e = this.#e.querySelectorAll(".animating");
		for (let t of e) t.classList.remove("animating");
		let t = this.#e.querySelectorAll(".pending");
		for (let e of t) e.classList.remove("pending");
		this.#i = !1, this.#r = !1, this.#n.removeCustomClasses({
			paragraph: "pending",
			heading: "pending",
			list_item: "pending",
			code: "pending"
		});
	}
	#o() {
		if (this.#i) return;
		this.#i = !0;
		let e = () => {
			let t = this.#e.querySelector(".pending");
			if (!t) {
				this.#i = !1;
				return;
			}
			t.addEventListener("animationend", () => {
				t.classList.remove("animating"), e();
			}, { once: !0 }), t.classList.remove("pending"), t.classList.add("animating");
		};
		e();
	}
	#s() {
		this.#c(), this.#r && this.#o();
	}
	#c() {
		Z(X`
      <style>${Y}</style>
      <div class='message'>
        ${this.#t.map((e) => this.#n.renderToken(e))}
      </div>
    `, this.#e, { host: this });
	}
};
customElements.define("devtools-markdown-view", Q);
var $ = class {
	#e = {};
	addCustomClasses(e) {
		for (let [t, n] of Object.entries(e)) this.#e[t] || (this.#e[t] = /* @__PURE__ */ new Set()), this.#e[t].add(n);
	}
	removeCustomClasses(e) {
		for (let [t, n] of Object.entries(e)) this.#e[t] && this.#e[t].delete(n);
	}
	customClassMapForToken(e) {
		let t = this.#e[e] || /* @__PURE__ */ new Set(), n = Object.fromEntries([...t].map((e) => [e, !0]));
		return o(n);
	}
	renderChildTokens(e) {
		if ("tokens" in e && e.tokens) return e.tokens.map((e) => this.renderToken(e));
		throw Error("Tokens not found");
	}
	unescape(e) {
		let t = /* @__PURE__ */ new Map([
			["&amp;", "&"],
			["&lt;", "<"],
			["&gt;", ">"],
			["&quot;", "\""],
			["&#39;", "'"]
		]);
		return e.replace(/&(amp|lt|gt|quot|#39);/g, (e) => t.get(e) || e);
	}
	renderText(e) {
		return "tokens" in e && e.tokens ? X`${this.renderChildTokens(e)}` : X`${this.unescape("text" in e ? e.text : "")}`;
	}
	renderHeading(e) {
		let t = this.customClassMapForToken("heading");
		switch (e.depth) {
			case 1: return X`<h1 class=${t}>${this.renderText(e)}</h1>`;
			case 2: return X`<h2 class=${t}>${this.renderText(e)}</h2>`;
			case 3: return X`<h3 class=${t}>${this.renderText(e)}</h3>`;
			case 4: return X`<h4 class=${t}>${this.renderText(e)}</h4>`;
			case 5: return X`<h5 class=${t}>${this.renderText(e)}</h5>`;
			default: return X`<h6 class=${t}>${this.renderText(e)}</h6>`;
		}
	}
	renderCodeBlock(e) {
		return X`<devtools-code-block
      class=${this.customClassMapForToken("code")}
      .code=${this.unescape(e.text)}
      .codeLang=${e.lang || ""}>
    </devtools-code-block>`;
	}
	templateForToken(e) {
		switch (e.type) {
			case "paragraph": return X`<p class=${this.customClassMapForToken("paragraph")}>${this.renderChildTokens(e)}</p>`;
			case "list": return X`<ul class=${this.customClassMapForToken("list")}>${e.items.map((e) => this.renderToken(e))}</ul>`;
			case "list_item": return X`<li class=${this.customClassMapForToken("list_item")}>${this.renderChildTokens(e)}</li>`;
			case "text": return this.renderText(e);
			case "codespan": return X`<code class=${this.customClassMapForToken("codespan")}>${this.unescape(e.text)}</code>`;
			case "code": return this.renderCodeBlock(e);
			case "space": return c;
			case "link": return X`<devtools-link
        class=${this.customClassMapForToken("link")}
        href=${J(e.href)}
        >${e.text}</devtools-link>`;
			case "image": return X`<devtools-markdown-image
        class=${this.customClassMapForToken("image")}
        .data=${{
				key: e.href,
				title: e.text
			}}></devtools-markdown-image>`;
			case "heading": return this.renderHeading(e);
			case "strong": return X`<strong class=${this.customClassMapForToken("strong")}>${this.renderText(e)}</strong>`;
			case "em": return X`<em class=${this.customClassMapForToken("em")}>${this.renderText(e)}</em>`;
			default: return null;
		}
	}
	renderToken(e) {
		let t = this.templateForToken(e);
		if (t === null) throw Error(`Markdown token type '${e.type}' not supported.`);
		return t;
	}
}, te = class extends $ {
	#e;
	constructor(e) {
		super(), this.#e = e || (() => {}), this.addCustomClasses({ heading: "insight" });
	}
	renderToken(e) {
		let t = this.templateForToken(e);
		return t === null ? X`${e.raw}` : t;
	}
	sanitizeUrl(e) {
		try {
			let t = new URL(e);
			return t.protocol === "https:" || t.protocol === "http:" ? t.toString() : null;
		} catch {
			return null;
		}
	}
	detectCodeLanguage(e) {
		return e.lang ? e.lang : /^(\.|#)?[\w:\[\]="'-\.]+ ?{/m.test(e.text) || /^@import/.test(e.text) ? "css" : /^(var|const|let|function|async|import)\s/.test(e.text) ? "js" : "";
	}
	templateForToken(e) {
		switch (e.type) {
			case "heading": return this.renderHeading(e);
			case "link":
			case "image": return this.sanitizeUrl(e.href) ? X`${e.text ?? e.href}` : null;
			case "code": return X`<devtools-code-block
          class=${this.customClassMapForToken("code")}
          .code=${this.unescape(e.text)}
          .codeLang=${this.detectCodeLanguage(e)}
          .citations=${e.citations || []}
          .displayNotice=${!0}>
        </devtools-code-block>`;
			case "citation": return X`<sup><button
            class="citation"
            jslog=${f("inline-citation").track({ click: !0 })}
            @click=${this.#e.bind(this, Number(e.linkText))}
          >[${e.linkText}]</button></sup>`;
		}
		return super.templateForToken(e);
	}
};
//#endregion
export { Q as n, q as r, te as t };
