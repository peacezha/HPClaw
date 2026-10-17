import { B as e, H as t, K as n, _ as r, b as i, i as a, v as o, x as s } from "./common-DMSVbaSb.js";
import { $d as c, Po as l, Sl as u, Xs as d, Zs as f, fa as p, ic as m } from "./legacy-dM_vujv7.js";
import "./platform-D4TUCh2P.js";
import { g as h } from "./text_utils-DWSliayn.js";
import { d as g } from "./StringUtilities-CMDxNrEc.js";
import { T as _, w as v } from "./bindings-DyamxTH2.js";
import { mn as y, vn as b, yn as x } from "./common-Bs7hSOUj.js";
import { a as S, c as C, s as w } from "./quick_open-thOwmkpR.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/snippets/ScriptSnippetFileSystem.ts
var T = {
	scriptSnippet: "Script snippet #{PH1}",
	linkedTo: "Linked to {PH1}"
}, E = n("panels/snippets/ScriptSnippetFileSystem.ts", T), D = t.bind(void 0, E);
function O(e) {
	return o.rawPathToEncodedPathString(e);
}
function k(e) {
	return o.encodedPathToRawPathString(e);
}
var A = class extends b {
	lastSnippetIdentifierSetting;
	snippetsSetting;
	constructor() {
		super("snippet://", x.SNIPPETS, !1), this.lastSnippetIdentifierSetting = a.instance().createSetting("script-snippets-last-identifier", 0), this.snippetsSetting = a.instance().createSetting("script-snippets", []);
	}
	initialFilePaths() {
		return this.snippetsSetting.get().map((e) => O(e.name));
	}
	async createFile(e, t) {
		let n = this.lastSnippetIdentifierSetting.get() + 1;
		this.lastSnippetIdentifierSetting.set(n);
		let r = D(T.scriptSnippet, { PH1: n }), i = this.snippetsSetting.get();
		return i.push({
			name: r,
			content: ""
		}), this.snippetsSetting.set(i), O(r);
	}
	async deleteFile(e) {
		let t = k(o.substring(e, 1)), n = this.snippetsSetting.get(), r = n.filter((e) => e.name !== t);
		return n.length !== r.length && (this.snippetsSetting.set(r), !0);
	}
	async requestFileContent(e) {
		let t = k(o.substring(e, 1)), n = this.snippetsSetting.get().find((e) => e.name === t);
		return n ? new h(n.content, !1, "text/javascript") : { error: `A snippet with name '${t}' was not found` };
	}
	async setFileContent(e, t, n) {
		let r = k(o.substring(e, 1)), i = this.snippetsSetting.get(), a = i.find((e) => e.name === r);
		return a ? (a.content = t, this.snippetsSetting.set(i), !0) : !1;
	}
	renameFile(e, t, n) {
		let r = k(o.substring(e, 1)), i = this.snippetsSetting.get(), a = i.find((e) => e.name === r);
		if (t = o.trim(t), !a || t.length === 0 || i.find((e) => e.name === t)) {
			n(!1);
			return;
		}
		a.name = t, this.snippetsSetting.set(i), n(!0, t);
	}
	async searchInPath(e, t) {
		let n = new RegExp(g(e), "i");
		return this.snippetsSetting.get().filter((e) => e.content.match(n)).map((e) => `snippet:///${O(e.name)}`);
	}
	mimeFromPath(e) {
		return "text/javascript";
	}
	contentType(e) {
		return r.Script;
	}
	tooltipForURL(e) {
		return D(T.linkedTo, { PH1: k(o.sliceUrlToEncodedPathString(e, this.path().length)) });
	}
	supportsAutomapping() {
		return !0;
	}
};
async function j(e) {
	if (!i(e.url(), "snippet:")) return;
	let t = p.instance().flavor(u);
	if (!t) return;
	let n = t.runtimeModel, r = t.target().model(f);
	await e.requestContentData(), e.commitWorkingCopy();
	let a = e.workingCopy();
	s.instance().show();
	let o = e.url(), l = await t.evaluate({
		expression: `${a}\n//# sourceURL=${o}`,
		objectGroup: "console",
		silent: !1,
		includeCommandLineAPI: !0,
		returnByValue: !1,
		generatePreview: !0,
		replMode: !0
	}, !0, !0);
	if ("exceptionDetails" in l && l.exceptionDetails) {
		r?.addMessage(d.fromException(n, l.exceptionDetails, void 0, void 0, o));
		return;
	}
	if (!("object" in l) || !l.object) return;
	let h = t.debuggerModel.scriptsForSourceURL(o);
	if (h.length < 1) return;
	let g = h[h.length - 1].scriptId, _ = {
		type: m.Result,
		url: o,
		parameters: [l.object],
		executionContextId: t.id,
		scriptId: g
	};
	r?.addMessage(new d(n, c.LogEntrySource.Javascript, c.LogEntryLevel.Info, "", _));
}
function M(e) {
	return i(e.url(), "snippet:");
}
function N(e) {
	return e.type() === _.FileSystem && y.fileSystemType(e) === x.SNIPPETS;
}
function P() {
	let e = v.instance().projectsForType(_.FileSystem).find((e) => y.fileSystemType(e) === "snippets");
	if (!e) throw Error("Unable to find workspace project for the snippets file system");
	return e;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/snippets/SnippetsQuickOpen.ts
var F = {
	noSnippetsFound: "No snippets found.",
	run: "Run",
	snippet: "Snippet",
	runSnippet: "Run snippet"
}, I = n("panels/snippets/SnippetsQuickOpen.ts", F), L = t.bind(void 0, I), R = e.bind(void 0, I), z, B = class e extends w {
	snippets = [];
	static instance(t = { forceNew: null }) {
		let { forceNew: n } = t;
		return (!z || n) && (z = new e()), z;
	}
	selectItem(e, t) {
		e !== null && j(this.snippets[e]);
	}
	notFoundText(e) {
		return L(F.noSnippetsFound);
	}
	attach() {
		this.snippets = [...P().uiSourceCodes()];
	}
	detach() {
		this.snippets = [];
	}
	itemScoreAt(e, t) {
		return t.length / this.snippets[e].name().length;
	}
	itemCount() {
		return this.snippets.length;
	}
	itemKeyAt(e) {
		return this.snippets[e].name();
	}
	renderItem(e, t) {
		let n = this.snippets[e].name(), r = S.getHighlightRanges(n, t, !0);
		return l`
      <devtools-icon class="snippet" name="snippet"></devtools-icon>
      <div>
        <devtools-highlight type="markup" ranges=${r}>
          ${n}
        </devtools-highlight>
      </div>`;
	}
};
C({
	prefix: "!",
	iconName: "exclamation",
	provider: () => Promise.resolve(B.instance()),
	helpTitle: R(F.runSnippet),
	titlePrefix: R(F.run),
	titleSuggestion: R(F.snippet),
	jslogContext: "snippet"
});
//#endregion
export { M as a, N as i, j as n, P as r, A as t };
