import { n as e } from "./rolldown-runtime-DF993M8W.js";
import { H as t, K as n, i as r } from "./common-DMSVbaSb.js";
import { $i as i, Ao as a, Fo as o, Po as s, S as c, Xf as l, jr as u, no as d } from "./legacy-dM_vujv7.js";
import { n as f } from "./marked-CGxJO_CC.js";
import { r as p } from "./markdown_view-D8BG91nk.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/whats_new/ReleaseNoteText.ts
var m = /* @__PURE__ */ e({
	VideoType: () => g,
	getReleaseNote: () => v,
	setReleaseNoteForTest: () => _
}), h = !1, g = /* @__PURE__ */ function(e) {
	return e.WHATS_NEW = "WhatsNew", e.DEVTOOLS_TIPS = "DevtoolsTips", e.OTHER = "Other", e;
}({});
function _(e) {
	y = e;
}
function v() {
	if (!h) {
		for (let { key: e, link: t } of y.markdownLinks) p.set(e, t);
		h = !0;
	}
	return y;
}
var y = {
	version: 149,
	header: "What’s new in DevTools 149",
	markdownLinks: [
		{
			key: "devtools-for-agents",
			link: "https://developer.chrome.com/blog/new-in-devtools-149/#devtools-for-agents"
		},
		{
			key: "ai-assistance",
			link: "https://developer.chrome.com/blog/new-in-devtools-149/#ai-assistance"
		},
		{
			key: "css-code-completion",
			link: "https://developer.chrome.com/blog/new-in-devtools-149/#css-code-completion"
		}
	],
	videoLinks: [],
	link: "https://developer.chrome.com/blog/new-in-devtools-149/"
}, b = "/*\n * Copyright 2024 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n@scope to (devtools-widget > *) {\n  .whatsnew {\n    background: var(--sys-color-header-container);\n    flex-grow: 1;\n    flex-shrink: 0;\n    display: flex;\n    width: 100%;\n    height: 100%;\n    overflow: auto;\n    justify-content: center;\n  }\n\n  .whatsnew-content {\n    max-width: var(--sys-size-35);\n    padding: var(--sys-size-9) 0 0;\n\n    >* {\n      padding: 0 var(--sys-size-9) var(--sys-size-9) var(--sys-size-9);\n    }\n  }\n\n  .header {\n    display: flex;\n    align-items: center;\n    font: var(--sys-typescale-headline4);\n\n    &::before {\n      content: \"\";\n      width: var(--sys-size-9);\n      height: var(--sys-size-9);\n      transform: scale(1.6);\n      margin: 0 var(--sys-size-8) 0 var(--sys-size-4);\n      background-image: var(--image-file-devtools);\n      flex-shrink: 0;\n    }\n  }\n\n  .feature-container {\n    flex-grow: 1;\n    padding: 0;\n    background-color: var(--sys-color-surface);\n    border-radius: var(--sys-shape-corner-large) var(--sys-shape-corner-large) 0 0;\n    display: flex;\n    flex-direction: column;\n  }\n\n  .feature {\n    background-color: var(--sys-color-surface3);\n    padding: 0 var(--sys-size-8) var(--sys-size-8);\n    border-radius: var(--sys-shape-corner-medium);\n    margin: 0 var(--sys-size-9) var(--sys-size-9);\n  }\n\n  .video-container {\n    margin-bottom: var(--sys-size-9);\n\n    &:has(.video) {\n      --video-bottom-padding: var(--sys-size-6);\n\n      overflow: auto;\n      display: flex;\n      flex-direction: row;\n      gap: var(--sys-size-5);\n      padding: var(--sys-size-9) var(--sys-size-9) var(--video-bottom-padding);\n\n      /* This extra margin makes sure that we have some space between\n        the scrollable container for videos and the cards below it. */\n      margin-bottom: calc(var(--sys-size-9) - var(--video-bottom-padding));\n\n      > * {\n        min-width: auto;\n      }\n    }\n  }\n\n  .video {\n    align-items: center;\n    display: flex;\n    flex-direction: row;\n    border-radius: var(--sys-shape-corner-medium);\n    background-color: var(--sys-color-surface3);\n    font: var(--sys-typescale-body5-regular);\n    min-width: var(--sys-size-29);\n    max-width: var(--sys-size-32);\n    overflow: hidden;\n    height: 72px;\n\n    &:hover {\n      box-shadow: var(--sys-elevation-level3);\n    }\n\n    .thumbnail {\n      border-radius: var(--sys-shape-corner-medium) 0 0 var(--sys-shape-corner-medium);\n      flex-shrink: 0;\n    }\n\n    .thumbnail-description {\n      --description-margin: var(--sys-size-6);\n\n      margin: var(--description-margin);\n      height: calc(100% - var(--description-margin) * 2);\n      overflow: hidden;\n    }\n  }\n\n  devtools-link:focus .video {\n    outline: var(--sys-size-2) solid var(--sys-color-state-focus-ring);\n  }\n\n  @media (forced-colors: active) {\n    .feature,\n    .video {\n      border: var(--sys-size-1) solid ButtonText;\n    }\n  }\n}\n", x = /* @__PURE__ */ e({
	DEVTOOLS_TIPS_THUMBNAIL: () => E,
	GENERAL_THUMBNAIL: () => D,
	ReleaseNoteView: () => k,
	WHATS_NEW_THUMBNAIL: () => T,
	getMarkdownContent: () => O
}), S = { seeFeatures: "See all new features" }, C = n("panels/whats_new/ReleaseNoteView.ts", S), w = t.bind(void 0, C), T = "../../Images/whatsnew.svg", E = "../../Images/devtools-tips.svg", D = "../../Images/devtools-thumbnail.svg";
async function O() {
	let e = await k.getFileContent(), t = f(e), n = [], r = 2 ** 53 - 1;
	return t.forEach((e) => {
		e.type === "heading" && r >= e.depth ? (n.push([e]), r = e.depth) : n.length > 0 ? n[n.length - 1].push(e) : n.push([e]);
	}), n;
}
var k = class extends c {
	#e;
	constructor(e = (e, t, n) => {
		let r = e.getReleaseNote(), a = e.markdownContent;
		o(s`
      <style>${b}</style>
      <div class="whatsnew" jslog=${d().context("release-notes")}>
        <div class="whatsnew-content">
          <div class="header">
            ${r.header}
          </div>
          <div>
            <devtools-button
                  .variant=${i.PRIMARY}
                  .jslogContext=${"learn-more"}
                  @click=${() => e.openNewTab(r.link)}
              >${w(S.seeFeatures)}</devtools-button>
          </div>

          <div class="feature-container">
            <div class="video-container">
              ${r.videoLinks.map((t) => s`
                  <devtools-link
                  href=${t.link}
                  jslogcontext="learn-more">
                    <div class="video">
                      <img class="thumbnail" src=${e.getThumbnailPath(t.type ?? g.WHATS_NEW)}>
                      <div class="thumbnail-description"><span>${t.description}</span></div>
                    </div>
                </devtools-link>
                `)}
            </div>
            ${a.map((e) => s`
                  <div class="feature">
                    <devtools-markdown-view slot="content" .data=${{ tokens: e }}>
                    </devtools-markdown-view>
                  </div>`)}
          </div>
        </div>
      </div>
    `, n);
	}) {
		super("whats-new", !0), this.#e = e, this.requestUpdate();
	}
	static async getFileContent() {
		let e = new URL("./resources/WNDT.md", new URL("panels/whats_new/ReleaseNoteView.js", typeof document < "u" ? document.baseURI : new URL("../../", self.location.href).href).href);
		try {
			return await (await fetch(e.toString())).text();
		} catch {
			throw Error(`Markdown file ${e.toString()} not found. Make sure it is correctly listed in the relevant BUILD.gn files.`);
		}
	}
	async performUpdate() {
		let e = await O();
		this.#e({
			getReleaseNote: v,
			openNewTab: a,
			markdownContent: e,
			getThumbnailPath: this.#t
		}, this, this.contentElement);
	}
	#t(e) {
		let t;
		switch (e) {
			case g.WHATS_NEW:
				t = T;
				break;
			case g.DEVTOOLS_TIPS:
				t = E;
				break;
			case g.OTHER: t = D;
		}
		return new URL(t, new URL("panels/whats_new/ReleaseNoteView.js", typeof document < "u" ? document.baseURI : new URL("../../", self.location.href).href).href).toString();
	}
}, A = /* @__PURE__ */ e({
	HelpLateInitialization: () => R,
	ReleaseNotesActionDelegate: () => B,
	ReportIssueActionDelegate: () => H,
	getReleaseNoteVersionSetting: () => F,
	releaseNoteViewId: () => M,
	releaseVersionSeen: () => j,
	showReleaseNoteIfNeeded: () => P
}), j = "releaseNoteVersionSeen", M = "release-note", N;
function P() {
	return I(r.instance().createSetting(j, 0).get(), v().version, r.instance().moduleSetting("help.show-release-note").get());
}
function F() {
	return N ||= r.instance().createSetting(j, 0), N;
}
function I(e, t, n) {
	let i = r.instance().createSetting(j, 0);
	return e ? !n || e >= t ? !1 : (i.set(t), u.instance().showView(M, !0), !0) : (i.set(t), !1);
}
var L, R = class e {
	static instance(t = { forceNew: null }) {
		let { forceNew: n } = t;
		return (!L || n) && (L = new e()), L;
	}
	async run() {
		l() || P();
	}
}, z, B = class e {
	handleAction(e, t) {
		let n = v();
		return a(n.link), !0;
	}
	static instance(t = { forceNew: null }) {
		let { forceNew: n } = t;
		return (!z || n) && (z = new e()), z;
	}
}, V, H = class e {
	handleAction(e, t) {
		return a("https://goo.gle/devtools-bug"), !0;
	}
	static instance(t = { forceNew: null }) {
		let { forceNew: n } = t;
		return (!V || n) && (V = new e()), V;
	}
};
//#endregion
export { m as ReleaseNoteText, x as ReleaseNoteView, A as WhatsNew };
