import { $ as e, H as t, J as n, K as r, _ as i, h as a, i as o, qt as s, r as c, v as ee } from "./common-DMSVbaSb.js";
import { B as te, Ep as ne, Fa as l, Fo as re, L as ie, Mo as ae, No as oe, Po as u, V as se, Xl as ce, Xn as le, Yf as d, Yo as ue, Zo as f, _ as p, br as m, d as de, dr as fe, ei as h, ff as pe, kp as g, l as me, n as _, ni as he, no as ge, or as v, pf as _e, qa as y, s as ve, tr as ye, uo as be, ur as b, yl as xe, zl as Se } from "./legacy-dM_vujv7.js";
import { o as Ce } from "./root-DdvV-xPu.js";
import "./platform-D4TUCh2P.js";
import { C as we, a as Te, f as Ee, g as x, i as De, n as S, o as Oe, t as ke, y as Ae } from "./text_utils-DWSliayn.js";
import { t as je } from "./StringUtilities-CMDxNrEc.js";
import { n as Me } from "./FormatterActions-D6HaA-6R.js";
import { D as C, j as Ne } from "./bindings-DyamxTH2.js";
import { t as Pe } from "./common-Bs7hSOUj.js";
import { n as Fe, t as w } from "./components-CvUVvCxT.js";
import { $t as T, Kt as Ie, Ot as E, R as Le, Rt as Re, S as D, T as O, Xt as k, bn as A, hn as j, k as ze, m as Be, n as Ve, on as He, p as Ue, st as M, wn as We, x as Ge, zt as Ke } from "./codemirror-CENmPHF2.js";
import { d as qe, s as Je } from "./object_ui-Dj5WXMwl.js";
import { A as Ye, C as Xe, O as Ze, S as Qe, b as $e, r as et, v as tt, x as nt, y as rt } from "./text_editor-B6PKcoob.js";
import { i as it } from "./code_highlighter-CNBDhX-D.js";
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/legacy/components/source_frame/resourceSourceFrame.css.mjs
var at = "/*\n * Copyright 2017 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.searchable-view {\n  flex: 1;\n}\n\ndevtools-toolbar {\n  background-color: var(--sys-color-cdt-base-container);\n  border-top: 1px solid var(--sys-color-divider);\n}\n", N = {
	source: "Source",
	prettyPrint: "Pretty print",
	loading: "Loading…",
	dSelectionRegions: "{PH1} selection regions",
	bytecodePositionXs: "Bytecode position `0x`{PH1}",
	lineSColumnS: "Line {PH1}, Column {PH2}",
	dCharactersSelected: "{PH1} characters selected",
	dLinesDCharactersSelected: "{PH1} lines, {PH2} characters selected",
	doYouTrustThisCode: "Do you trust this code?",
	doNotPaste: "Don't paste code you do not understand or have not reviewed yourself into DevTools. This could allow attackers to steal your identity or take control of your computer. Please type “{PH1}” below to allow pasting.",
	allowPasting: "allow pasting",
	typeAllowPasting: "Type “{PH1}”",
	binaryContentError: "Editor can't show binary data. Use the \"Response\" tab in the \"Network\" panel to inspect this resource."
}, ot = r("ui/legacy/components/source_frame/SourceFrame.ts", N), P = t.bind(void 0, ot), st = /* @__PURE__ */ function(e) {
	return e.EDITOR_UPDATE = "EditorUpdate", e.EDITOR_SCROLL = "EditorScroll", e;
}({}), ct = Ue.define({ combine(e) {
	return e.length === 0 ? (e) => e.toString() : e[0];
} }), lt = class extends e(_) {
	options;
	lazyContent;
	prettyInternal;
	rawContent;
	formattedMap;
	prettyToggle;
	shouldAutoPrettyPrint;
	progressToolbarItem;
	textEditorInternal;
	baseDoc;
	prettyBaseDoc = null;
	displayedSelection = null;
	searchConfig;
	delayedFindSearchMatches;
	currentSearchResultIndex;
	searchResults;
	searchRegex;
	loadError;
	sourcePosition;
	searchableView;
	editable;
	positionToReveal;
	lineToScrollTo;
	selectionToSet;
	loadedInternal;
	contentRequested;
	wasmDisassemblyInternal;
	contentSet;
	selfXssWarningDisabledSetting;
	constructor(e, t = {}) {
		super({
			title: P(N.source),
			viewId: "source"
		}), this.options = t, this.lazyContent = e, this.prettyInternal = !1, this.rawContent = null, this.formattedMap = null, this.prettyToggle = new fe(P(N.prettyPrint), "brackets", void 0, "pretty-print"), this.prettyToggle.addEventListener(le.Events.CLICK, () => {
			this.setPretty(this.prettyToggle.isToggled());
		}), this.shouldAutoPrettyPrint = !1, this.prettyToggle.setVisible(!1), this.progressToolbarItem = new ye(document.createElement("div")), this.textEditorInternal = new et(this.placeholderEditorState("")), this.textEditorInternal.style.flexGrow = "1", this.element.appendChild(this.textEditorInternal), this.element.addEventListener("keydown", (e) => {
			e.defaultPrevented && e.stopPropagation();
		}), this.baseDoc = this.textEditorInternal.state.doc, this.searchConfig = null, this.delayedFindSearchMatches = null, this.currentSearchResultIndex = -1, this.searchResults = [], this.searchRegex = null, this.loadError = !1, this.sourcePosition = new b(), this.searchableView = null, this.editable = !1, this.positionToReveal = null, this.lineToScrollTo = null, this.selectionToSet = null, this.loadedInternal = !1, this.contentRequested = !1, this.wasmDisassemblyInternal = null, this.contentSet = !1, this.selfXssWarningDisabledSetting = o.instance().createSetting("disable-self-xss-warning", !1, c.SYNCED), o.instance().moduleSetting("text-editor-indent").addChangeListener(this.#e, this);
	}
	disposeView() {
		o.instance().moduleSetting("text-editor-indent").removeChangeListener(this.#e, this);
	}
	async #e() {
		this.prettyInternal && (await this.setPretty(!1), await this.setPretty(!0));
	}
	placeholderEditorState(e) {
		return E.create({
			doc: e,
			extensions: [
				E.readOnly.of(!0),
				this.options.lineNumbers === !1 ? [] : k(),
				Ye()
			]
		});
	}
	editorConfiguration(e) {
		return [
			M.updateListener.of((e) => this.dispatchEventToListeners("EditorUpdate", e)),
			nt(e),
			Qe.instance(),
			$e.instance(),
			Ze.instance(),
			tt.instance(),
			Ge.lowest(Xe.instance()),
			rt.instance(),
			vt,
			M.domEventHandlers({
				focus: () => this.onFocus(),
				blur: () => this.onBlur(),
				paste: () => this.onPaste(),
				scroll: () => this.dispatchEventToListeners("EditorScroll"),
				contextmenu: (e) => this.onContextMenu(e)
			}),
			k({ domEventHandlers: { contextmenu: (e, t, n) => this.onLineGutterContextMenu(t.from, n) } }),
			M.updateListener.of((e) => {
				(e.selectionSet || e.docChanged) && this.updateSourcePosition(), e.docChanged && this.onTextChanged();
			}),
			R,
			Ge.lowest(pt),
			F.language.of([]),
			this.wasmDisassemblyInternal ? _t(this.wasmDisassemblyInternal) : z,
			this.options.lineWrapping ? M.lineWrapping : [],
			this.options.lineNumbers === !1 ? [] : k(),
			Ke({ colors: {
				light: "var(--sys-color-divider)",
				activeLight: "var(--sys-color-divider-prominent)",
				dark: "var(--sys-color-divider)",
				activeDark: "var(--sys-color-divider-prominent)"
			} }),
			xt
		];
	}
	onBlur() {}
	onFocus() {}
	onPaste() {
		return Ce.queryParam("isChromeForTesting") || Ce.queryParam("disableSelfXssWarnings") || this.selfXssWarningDisabledSetting.get() ? !1 : (this.showSelfXssWarning(), !0);
	}
	async showSelfXssWarning() {
		await Pe.show({
			jslogContext: {
				dialog: "self-xss-warning",
				input: "allow-pasting"
			},
			header: P(N.doYouTrustThisCode),
			message: P(N.doNotPaste, { PH1: P(N.allowPasting) }),
			typePhrase: P(N.allowPasting),
			inputPlaceholder: P(N.typeAllowPasting, { PH1: P(N.allowPasting) })
		}) && (this.selfXssWarningDisabledSetting.set(!0), pe.actionTaken(_e.SelfXssAllowPastingInDialog));
	}
	get wasmDisassembly() {
		return this.wasmDisassemblyInternal;
	}
	editorLocationToUILocation(e, t) {
		return this.wasmDisassemblyInternal ? (t = this.wasmDisassemblyInternal.lineNumberToBytecodeOffset(e), e = 0) : this.prettyInternal && ([e, t] = this.prettyToRawLocation(e, t)), {
			lineNumber: e,
			columnNumber: t
		};
	}
	uiLocationToEditorLocation(e, t = 0) {
		return this.wasmDisassemblyInternal ? (e = this.wasmDisassemblyInternal.bytecodeOffsetToLineNumber(t), t = 0) : this.prettyInternal && ([e, t] = this.rawToPrettyLocation(e, t)), {
			lineNumber: e,
			columnNumber: t
		};
	}
	setCanPrettyPrint(e, t) {
		this.shouldAutoPrettyPrint = t === !0 && o.instance().moduleSetting("auto-pretty-print-minified").get(), this.prettyToggle.setVisible(e);
	}
	setEditable(e) {
		this.editable = e, this.loaded && e !== !this.textEditor.state.readOnly && this.textEditor.dispatch({ effects: F.editable.reconfigure(E.readOnly.of(!e)) });
	}
	async setPretty(e) {
		this.prettyInternal = e, this.prettyToggle.setEnabled(!1);
		let t = this.loaded, { textEditor: n } = this, r = n.state.selection.main, i = n.toLineColumn(r.from), a = n.toLineColumn(r.to), o;
		if (this.prettyInternal) {
			let e = this.rawContent instanceof A ? this.rawContent.sliceString(0) : this.rawContent || "", t = await Se(this.contentType, e);
			this.formattedMap = t.formattedMapping, await this.setContent(t.formattedContent), this.prettyBaseDoc = n.state.doc;
			let r = this.rawToPrettyLocation(i.lineNumber, i.columnNumber), s = this.rawToPrettyLocation(a.lineNumber, a.columnNumber);
			o = n.createSelection({
				lineNumber: r[0],
				columnNumber: r[1]
			}, {
				lineNumber: s[0],
				columnNumber: s[1]
			});
		} else {
			this.formattedMap = null, await this.setContent(this.rawContent || ""), this.baseDoc = n.state.doc;
			let e = this.prettyToRawLocation(i.lineNumber, i.columnNumber), t = this.prettyToRawLocation(a.lineNumber, a.columnNumber);
			o = n.createSelection({
				lineNumber: e[0],
				columnNumber: e[1]
			}, {
				lineNumber: t[0],
				columnNumber: t[1]
			});
		}
		t && n.revealPosition(o, !1), this.prettyToggle.setEnabled(!0), this.updatePrettyPrintState();
	}
	getLineNumberFormatter() {
		if (this.options.lineNumbers === !1) return [];
		let e;
		if (this.wasmDisassemblyInternal) {
			let t = this.wasmDisassemblyInternal, n = t.lineNumberToBytecodeOffset(t.lineNumbers - 1).toString(16).length + 1;
			e = (e) => `0x${t.lineNumberToBytecodeOffset(Math.min(t.lineNumbers, e) - 1).toString(16).padStart(n, "0")}`;
		} else this.prettyInternal && (e = (e, t) => {
			if (e < 2 || e > t.doc.lines) return String(e);
			let [n] = this.prettyToRawLocation(e - 1), [r] = this.prettyToRawLocation(e - 2);
			return n === r ? "-" : String(n + 1);
		});
		return e ? [k({ formatNumber: e }), ct.of(e)] : [];
	}
	updateLineNumberFormatter() {
		this.textEditor.dispatch({ effects: F.lineNumbers.reconfigure(this.getLineNumberFormatter()) }), this.textEditor.shadowRoot?.querySelector(".cm-lineNumbers")?.setAttribute("jslog", `${l("line-numbers").track({ click: !0 })}`);
	}
	updatePrettyPrintState() {
		this.prettyToggle.setToggled(this.prettyInternal), this.textEditorInternal.classList.toggle("pretty-printed", this.prettyInternal), this.updateLineNumberFormatter();
	}
	prettyToRawLocation(e, t = 0) {
		return this.formattedMap ? this.formattedMap.formattedToOriginal(e, t) : [e, t];
	}
	rawToPrettyLocation(e, t) {
		return this.formattedMap ? this.formattedMap.originalToFormatted(e, t) : [e, t];
	}
	hasLoadError() {
		return this.loadError;
	}
	wasShown() {
		super.wasShown(), this.ensureContentLoaded(), this.wasShownOrLoaded();
	}
	willHide() {
		super.willHide(), this.clearPositionToReveal();
	}
	async toolbarItems() {
		return [
			this.prettyToggle,
			this.sourcePosition,
			this.progressToolbarItem
		];
	}
	get loaded() {
		return this.loadedInternal;
	}
	get textEditor() {
		return this.textEditorInternal;
	}
	get pretty() {
		return this.prettyInternal;
	}
	get contentType() {
		return this.loadError ? "" : this.getContentType();
	}
	getContentType() {
		return "";
	}
	async ensureContentLoaded() {
		this.contentRequested || (this.contentRequested = !0, await this.setContentDataOrError(this.lazyContent()), this.contentSet = !0);
	}
	async setContentDataOrError(e) {
		let t = document.createElement("devtools-progress");
		t.title = P(N.loading), t.totalWork = 100, this.progressToolbarItem.element.appendChild(t), t.worked = 1;
		let n = await e, r, i, a = !1;
		x.isError(n) ? (r = n.error, i = n.error) : n instanceof ke ? (i = A.of(n.lines), this.wasmDisassemblyInternal = n) : n.isTextContent ? (i = n.text, a = Ee(n.text), this.wasmDisassemblyInternal = null) : n.mimeType === "application/wasm" ? (this.wasmDisassemblyInternal = await xe(n.base64), i = A.of(this.wasmDisassemblyInternal.lines)) : (r = P(N.binaryContentError), i = null, this.wasmDisassemblyInternal = null), t.worked = 100, t.done = !0, (this.rawContent !== i || r !== void 0) && (this.rawContent = i, this.formattedMap = null, this.prettyToggle.setEnabled(!0), r ? (this.loadError = !0, this.textEditor.state = this.placeholderEditorState(r), this.prettyToggle.setEnabled(!1)) : this.shouldAutoPrettyPrint && a ? await this.setPretty(!0) : await this.setContent(this.rawContent || ""));
	}
	revealPosition(e, t) {
		if (this.lineToScrollTo = null, this.selectionToSet = null, typeof e == "number") {
			let n = 0, r = 0, { doc: i } = this.textEditor.state;
			if (e > i.length) n = i.lines - 1;
			else if (e >= 0) {
				let t = i.lineAt(e);
				n = t.number - 1, r = e - t.from;
			}
			this.positionToReveal = {
				to: {
					lineNumber: n,
					columnNumber: r
				},
				shouldHighlight: t
			};
		} else if ("lineNumber" in e) {
			let { lineNumber: n, columnNumber: r } = e;
			this.positionToReveal = {
				to: {
					lineNumber: n,
					columnNumber: r ?? 0
				},
				shouldHighlight: t
			};
		} else this.positionToReveal = {
			...e,
			shouldHighlight: t
		};
		this.#t();
	}
	#t() {
		if (!this.positionToReveal || !this.loaded || !this.isShowing()) return;
		let { from: e, to: t, shouldHighlight: n } = this.positionToReveal, r = this.uiLocationToEditorLocation(t.lineNumber, t.columnNumber), i = e ? this.uiLocationToEditorLocation(e.lineNumber, e.columnNumber) : void 0, { textEditor: a } = this;
		a.revealPosition(a.createSelection(r, i), n), this.positionToReveal = null;
	}
	clearPositionToReveal() {
		this.positionToReveal = null;
	}
	scrollToLine(e) {
		this.clearPositionToReveal(), this.lineToScrollTo = e, this.#n();
	}
	#n() {
		if (this.lineToScrollTo !== null && this.loaded && this.isShowing()) {
			let { textEditor: e } = this, t = e.toOffset({
				lineNumber: this.lineToScrollTo,
				columnNumber: 0
			});
			e.dispatch({ effects: M.scrollIntoView(t, {
				y: "start",
				yMargin: 0
			}) }), this.lineToScrollTo = null;
		}
	}
	setSelection(e) {
		this.selectionToSet = e, this.#r();
	}
	#r() {
		let e = this.selectionToSet;
		if (e && this.loaded && this.isShowing()) {
			let { textEditor: t } = this;
			t.dispatch({ selection: t.createSelection({
				lineNumber: e.startLine,
				columnNumber: e.startColumn
			}, {
				lineNumber: e.endLine,
				columnNumber: e.endColumn
			}) }), this.selectionToSet = null;
		}
	}
	wasShownOrLoaded() {
		this.#t(), this.#r(), this.#n(), this.textEditor.shadowRoot?.querySelector(".cm-lineNumbers")?.setAttribute("jslog", `${l("line-numbers").track({ click: !0 })}`), this.textEditor.shadowRoot?.querySelector(".cm-foldGutter")?.setAttribute("jslog", `${l("fold")}`), this.textEditor.setAttribute("jslog", `${be().track({ change: !0 })}`);
	}
	onTextChanged() {
		let e = this.pretty;
		this.prettyInternal = !!(this.prettyBaseDoc && this.textEditor.state.doc.eq(this.prettyBaseDoc)), this.prettyInternal !== e && this.updatePrettyPrintState(), this.prettyToggle.setEnabled(this.isClean()), this.searchConfig && this.searchableView && this.performSearch(this.searchConfig, !1, !1);
	}
	isClean() {
		return this.textEditor.state.doc.eq(this.baseDoc) || this.prettyBaseDoc !== null && this.textEditor.state.doc.eq(this.prettyBaseDoc);
	}
	contentCommitted() {
		this.baseDoc = this.textEditorInternal.state.doc, this.prettyBaseDoc = null, this.rawContent = this.textEditor.state.doc.toString(), this.formattedMap = null, this.prettyInternal && (this.prettyInternal = !1, this.updatePrettyPrintState()), this.prettyToggle.setEnabled(!0);
	}
	async getLanguageSupport(e) {
		let { contentType: t } = this;
		t === "text/x.vue" && (e = typeof e == "string" ? e : e.sliceString(0), e.trimStart().startsWith("<") || (t = "text/javascript"));
		let n = await it(t);
		return n ? [n, We.javascriptLanguage.data.of({ autocomplete: Re })] : [];
	}
	async updateLanguageMode(e) {
		let t = await this.getLanguageSupport(e);
		this.textEditor.dispatch({ effects: F.language.reconfigure(t) });
	}
	async setContent(e) {
		let { textEditor: t } = this, n = this.loadedInternal, r = t.editor.scrollDOM.scrollTop;
		this.loadedInternal = !0;
		let i = await this.getLanguageSupport(e), a = E.create({
			doc: e,
			extensions: [
				this.editorConfiguration(e),
				i,
				F.lineNumbers.of(this.getLineNumberFormatter()),
				F.editable.of(this.editable ? [] : E.readOnly.of(!0))
			]
		});
		this.baseDoc = a.doc, t.state = a, n && (t.editor.scrollDOM.scrollTop = r), this.wasShownOrLoaded(), this.delayedFindSearchMatches &&= (this.delayedFindSearchMatches(), null);
	}
	setSearchableView(e) {
		this.searchableView = e;
	}
	doFindSearchMatches(e, t, n) {
		this.currentSearchResultIndex = -1, this.searchRegex = e.toSearchRegex(!0), this.searchResults = this.collectRegexMatches(this.searchRegex), this.searchableView && this.searchableView.updateSearchMatchesCount(this.searchResults.length);
		let r = this.textEditor;
		this.searchResults.length ? t && n ? this.jumpToPreviousSearchResult() : t ? this.jumpToNextSearchResult() : r.dispatch({ effects: L.of(new I(this.searchRegex, null)) }) : r.state.field(R) && r.dispatch({ effects: L.of(null) });
	}
	performSearch(e, t, n) {
		this.searchableView && this.searchableView.updateSearchMatchesCount(0), this.resetSearch(), this.searchConfig = e, this.loaded ? this.doFindSearchMatches(e, t, !!n) : this.delayedFindSearchMatches = this.doFindSearchMatches.bind(this, e, t, !!n), this.ensureContentLoaded();
	}
	resetCurrentSearchResultIndex() {
		if (!this.searchResults.length) return;
		this.currentSearchResultIndex = -1, this.searchableView && this.searchableView.updateCurrentMatchIndex(this.currentSearchResultIndex);
		let e = this.textEditor, t = e.state.field(R);
		t?.currentRange && e.dispatch({ effects: L.of(new I(t.regexp, null)) });
	}
	resetSearch() {
		this.searchConfig = null, this.delayedFindSearchMatches = null, this.currentSearchResultIndex = -1, this.searchResults = [], this.searchRegex = null;
	}
	onSearchCanceled() {
		let e = this.currentSearchResultIndex === -1 ? null : this.searchResults[this.currentSearchResultIndex];
		this.resetSearch(), this.loaded && this.textEditor.dispatch({
			effects: L.of(null),
			selection: e ? {
				anchor: e.from,
				head: e.to
			} : void 0,
			scrollIntoView: !0,
			userEvent: "select.search.cancel"
		});
	}
	jumpToLastSearchResult() {
		this.jumpToSearchResult(this.searchResults.length - 1);
	}
	searchResultIndexForCurrentSelection() {
		return s(this.searchResults, this.textEditor.state.selection.main, (e, t) => e.to - t.to);
	}
	jumpToNextSearchResult() {
		let e = this.searchResultIndexForCurrentSelection(), t = this.currentSearchResultIndex === -1 ? e : e + 1;
		this.jumpToSearchResult(t);
	}
	jumpToPreviousSearchResult() {
		let e = this.searchResultIndexForCurrentSelection();
		this.jumpToSearchResult(e - 1);
	}
	supportsCaseSensitiveSearch() {
		return !0;
	}
	supportsWholeWordSearch() {
		return !0;
	}
	supportsRegexSearch() {
		return !0;
	}
	jumpToSearchResult(e) {
		if (!this.loaded || !this.searchResults.length || !this.searchRegex) return;
		this.currentSearchResultIndex = (e + this.searchResults.length) % this.searchResults.length, this.searchableView && this.searchableView.updateCurrentMatchIndex(this.currentSearchResultIndex);
		let t = this.textEditor, n = this.searchResults[this.currentSearchResultIndex];
		t.dispatch({
			effects: L.of(new I(this.searchRegex, n)),
			selection: {
				anchor: n.from,
				head: n.to
			},
			scrollIntoView: !0,
			userEvent: "select.search"
		});
	}
	replaceSelectionWith(e, t) {
		let n = this.searchResults[this.currentSearchResultIndex];
		if (!n) return;
		let r = this.searchRegex?.fromQuery ? n.insertPlaceholders(t) : t, i = this.textEditor, a = i.state.changes({
			from: n.from,
			to: n.to,
			insert: r
		});
		i.dispatch({
			changes: a,
			selection: { anchor: a.mapPos(i.state.selection.main.to, 1) },
			userEvent: "input.replace"
		});
	}
	replaceAllWith(e, t) {
		this.resetCurrentSearchResultIndex();
		let n = e.toSearchRegex(!0), r = this.collectRegexMatches(n);
		if (!r.length) return;
		let i = n.fromQuery, a = r.map((e) => ({
			from: e.from,
			to: e.to,
			insert: i ? e.insertPlaceholders(t) : t
		}));
		this.textEditor.dispatch({
			changes: a,
			scrollIntoView: !0,
			userEvent: "input.replace.all"
		});
	}
	collectRegexMatches({ regex: e }) {
		let t = [], n = 0;
		for (let r of this.textEditor.state.doc.iterLines()) {
			for (e.lastIndex = 0;;) {
				let i = e.exec(r);
				if (!i) break;
				if (i[0].length) {
					let e = n + i.index;
					t.push(new ut(e, e + i[0].length, i));
				} else e.lastIndex = i.index + 1;
			}
			n += r.length + 1;
		}
		return t;
	}
	canEditSource() {
		return this.editable;
	}
	updateSourcePosition() {
		let { textEditor: e } = this, { state: t } = e, { selection: n } = t;
		if (this.displayedSelection?.eq(n)) return;
		if (this.displayedSelection = n, n.ranges.length > 1) {
			this.sourcePosition.setText(P(N.dSelectionRegions, { PH1: n.ranges.length }));
			return;
		}
		let { main: r } = t.selection;
		if (r.empty) {
			let { lineNumber: t, columnNumber: n } = e.toLineColumn(r.head), i = this.prettyToRawLocation(t, n);
			if (this.wasmDisassemblyInternal) {
				let e = this.wasmDisassemblyInternal, t = e.lineNumberToBytecodeOffset(e.lineNumbers - 1).toString(16).length, n = e.lineNumberToBytecodeOffset(i[0]);
				this.sourcePosition.setText(P(N.bytecodePositionXs, { PH1: n.toString(16).padStart(t, "0") }));
			} else this.sourcePosition.setText(P(N.lineSColumnS, {
				PH1: i[0] + 1,
				PH2: i[1] + 1
			}));
		} else {
			let e = t.doc.lineAt(r.from), n = t.doc.lineAt(r.to);
			e.number === n.number ? this.sourcePosition.setText(P(N.dCharactersSelected, { PH1: r.to - r.from })) : this.sourcePosition.setText(P(N.dLinesDCharactersSelected, {
				PH1: n.number - e.number + 1,
				PH2: r.to - r.from
			}));
		}
	}
	onContextMenu(e) {
		e.consume(!0);
		let t = new m(e), { state: n } = this.textEditor, r = n.selection.main.from, i = n.doc.lineAt(r);
		return this.populateTextAreaContextMenu(t, i.number - 1, r - i.from), t.appendApplicableItems(this), t.show(), !0;
	}
	populateTextAreaContextMenu(e, t, n) {}
	onLineGutterContextMenu(e, t) {
		t.consume(!0);
		let n = new m(t), r = this.textEditor.state.doc.lineAt(e).number - 1;
		return this.populateLineGutterContextMenu(n, r), n.appendApplicableItems(this), n.show(), !0;
	}
	populateLineGutterContextMenu(e, t) {}
	focus() {
		this.textEditor.focus();
	}
}, ut = class {
	from;
	to;
	match;
	constructor(e, t, n) {
		this.from = e, this.to = t, this.match = n;
	}
	insertPlaceholders(e) {
		return e.replace(/\$(\$|&|\d+|<[^>]+>)/g, (e, t) => t === "$" ? "$" : t === "&" ? this.match[0] : t[0] === "<" ? this.match.groups?.[t.slice(1, t.length - 1)] || "" : this.match[Number.parseInt(t, 10)] || "");
	}
}, F = {
	editable: new O(),
	language: new O(),
	lineNumbers: new O()
}, I = class e {
	regexp;
	currentRange;
	constructor(e, t) {
		this.regexp = e, this.currentRange = t;
	}
	map(t) {
		return t.empty || !this.currentRange ? this : new e(this.regexp, {
			from: t.mapPos(this.currentRange.from),
			to: t.mapPos(this.currentRange.to)
		});
	}
	static eq(e, t) {
		return !!(e === t || e && t && e.currentRange?.from === t.currentRange?.from && e.currentRange?.to === t.currentRange?.to && e.regexp.regex.source === t.regexp.regex.source && e.regexp.regex.flags === t.regexp.regex.flags);
	}
}, L = T.define({ map: (e, t) => e?.map(t) }), R = j.define({
	create() {
		return null;
	},
	update(e, t) {
		return t.effects.reduce((e, t) => t.is(L) ? t.value : e, e?.map(t.changes) ?? null);
	}
}), dt = D.mark({ class: "cm-searchMatch" }), ft = D.mark({ class: "cm-searchMatch cm-searchMatch-selected" }), pt = Be.fromClass(class {
	decorations;
	constructor(e) {
		this.decorations = this.computeDecorations(e);
	}
	update(e) {
		let t = e.state.field(R);
		(!I.eq(t, e.startState.field(R)) || t && (e.viewportChanged || e.docChanged)) && (this.decorations = this.computeDecorations(e.view));
	}
	computeDecorations(e) {
		let t = e.state.field(R);
		if (!t) return D.none;
		let n = new Le(), { doc: r } = e.state;
		for (let { from: i, to: a } of e.visibleRanges) {
			let e = i;
			for (let o of r.iterRange(i, a)) {
				if (o !== "\n") for (t.regexp.regex.lastIndex = 0;;) {
					let r = t.regexp.regex.exec(o);
					if (!r) break;
					if (r[0].length) {
						let i = e + r.index, a = i + r[0].length, o = t.currentRange?.from === i && t.currentRange.to === a;
						n.add(i, a, o ? ft : dt);
					} else t.regexp.regex.lastIndex = r.index + 1;
				}
				e += o.length;
			}
		}
		return n.finish();
	}
}, { decorations: (e) => e.decorations }), mt = new class extends ze {
	elementClass = "cm-nonBreakableLine";
}(), ht = T.define(), z = j.define({
	create() {
		return Ve.empty;
	},
	update(e, t) {
		return t.effects.reduce((e, t) => t.is(ht) ? e.update({ add: t.value.map((e) => mt.range(e)) }) : e, e.map(t.changes));
	},
	provide: (e) => He.from(e)
});
function gt(e, t) {
	let n = e.field(z);
	if (!n.size) return !0;
	let r = !1;
	return n.between(t.from, t.from, () => {
		r = !0;
	}), !r;
}
function _t(e) {
	return z.init((t) => {
		let n = [];
		for (let r of e.nonBreakableLineNumbers()) r < t.doc.lines && n.push(mt.range(t.doc.line(r + 1).from));
		return Ve.of(n);
	});
}
var vt = M.theme({
	"&.cm-editor": { height: "100%" },
	".cm-scroller": { overflow: "auto" },
	".cm-lineNumbers .cm-gutterElement.cm-nonBreakableLine": { color: "var(--sys-color-state-disabled) !important" },
	".cm-searchMatch": {
		border: "1px solid var(--sys-color-outline)",
		borderRadius: "3px",
		margin: "0 -1px",
		"&.cm-searchMatch-selected": {
			borderRadius: "1px",
			backgroundColor: "var(--sys-color-yellow-container)",
			borderColor: "var(--sys-color-yellow-outline)",
			"&, & *": { color: "var(--sys-color-on-surface) !important" }
		}
	},
	":host-context(.pretty-printed) & .cm-lineNumbers .cm-gutterElement": { color: "var(--sys-color-primary)" }
}), yt = T.define(), bt = T.define(), xt = j.define({
	create() {
		return [];
	},
	update(e, t) {
		for (let n of t.effects) n.is(yt) ? e = e.concat(n.value) : n.is(bt) && (e = e.filter((e) => e.element !== n.value.element));
		return e;
	},
	provide: (e) => Ie.computeN([e], (t) => t.field(e).sort((e, t) => (e.order ?? 0) - (t.order ?? 0)).map((e) => () => ({ dom: e.element })))
}), St = { find: "Find" }, Ct = r("ui/legacy/components/source_frame/ResourceSourceFrame.ts", St), wt = t.bind(void 0, Ct), B = class extends lt {
	#e;
	#t;
	constructor(e, t, n) {
		let r = we(e);
		super(r ? () => e.requestStreamingContent().then(De) : () => e.requestContentData(), n), this.#t = t, this.#e = e, r && e.requestStreamingContent().then((e) => {
			Te(e) || e.addEventListener(S.CHUNK_ADDED, () => {
				this.setContentDataOrError(Promise.resolve(e.content()));
			});
		});
	}
	static createSearchableView(e, t) {
		return new Tt(e, t);
	}
	getContentType() {
		return this.#t;
	}
	get resource() {
		return this.#e;
	}
	populateTextAreaContextMenu(e, t, n) {
		super.populateTextAreaContextMenu(e, t, n), e.appendApplicableItems(this.#e);
	}
}, Tt = class extends h {
	sourceFrame;
	constructor(e, t, n) {
		super(n, { useShadowDom: !0 }), this.registerRequiredCSS(at);
		let r = a.simplifyContentType(t), i = new B(e, r);
		this.sourceFrame = i;
		let o = Me.includes(r);
		i.setCanPrettyPrint(o, !0);
		let s = new p(i, i);
		s.element.classList.add("searchable-view"), s.setPlaceholder(wt(St.find)), i.show(s.element), i.setSearchableView(s), s.show(this.contentElement);
		let c = this.contentElement.createChild("devtools-toolbar", "toolbar");
		i.toolbarItems().then((e) => {
			e.map((e) => c.appendToolbarItem(e));
		});
	}
	async revealPosition(e) {
		this.sourceFrame.revealPosition(e, !0);
	}
}, V = 1e3, Et = class extends h {
	#e = new Uint8Array([0]);
	#t = 0;
	#n = new Fe();
	constructor() {
		super(), this.#n.addEventListener(w.MEMORY_REQUEST, this.#r, this), this.#n.addEventListener(w.ADDRESS_CHANGED, (e) => {
			this.#t = e.data;
		}), this.#n.show(this.contentElement);
	}
	wasShown() {
		super.wasShown(), this.refreshData();
	}
	setMemory(e) {
		this.#e = e, this.refreshData();
	}
	refreshData() {
		let e = Math.max(0, this.#t - V / 2), t = e + V, n = this.#e.slice(e, t);
		this.#n.memory = n, this.#n.address = this.#t, this.#n.memoryOffset = e, this.#n.outerMemoryLength = this.#e.length, this.#n.hideValueInspector = !0;
	}
	#r(e) {
		let { start: t, end: n, address: r } = e.data;
		if (r < t || r >= n) throw Error("Requested address is out of bounds.");
		if (t < 0 || t > n || t >= this.#e.length) throw Error("Requested range is out of bounds.");
		let i = Math.max(n, t + V), a = this.#e.slice(t, i);
		this.#n.memory = a, this.#n.address = r, this.#n.memoryOffset = t, this.#n.outerMemoryLength = this.#e.length, this.#n.hideValueInspector = !0;
	}
}, Dt = class extends Et {
	#e;
	constructor(e) {
		super(), this.#e = e;
	}
	wasShown() {
		super.wasShown(), this.#t(), this.#e.addEventListener(S.CHUNK_ADDED, this.#t, this);
	}
	willHide() {
		super.willHide(), this.#e.removeEventListener(S.CHUNK_ADDED, this.#t, this);
	}
	#t() {
		let e = window.atob(this.#e.content().base64), t = Uint8Array.from(e, (e) => e.codePointAt(0));
		this.setMemory(t);
	}
}, Ot = class e {
	streamingContent;
	contentUrl;
	resourceType;
	constructor(e, t, n) {
		this.streamingContent = e, this.contentUrl = t, this.resourceType = n;
	}
	hex() {
		let t = window.atob(this.base64()), n = Uint8Array.from(t, (e) => e.codePointAt(0));
		return e.#e(n);
	}
	base64() {
		return this.streamingContent.content().base64;
	}
	utf8() {
		return new x(this.base64(), !0, "text/plain", "utf-8").text;
	}
	createBase64View() {
		let e = new B(Oe.fromString(this.contentUrl, this.resourceType, this.streamingContent.content().base64), this.resourceType.canonicalMimeType(), {
			lineNumbers: !1,
			lineWrapping: !0
		});
		return this.streamingContent.addEventListener(S.CHUNK_ADDED, () => {
			e.setContent(this.base64());
		}), e;
	}
	createHexView() {
		return new Dt(this.streamingContent);
	}
	createUtf8View() {
		let e = new B(Oe.fromString(this.contentUrl, this.resourceType, this.utf8()), this.resourceType.canonicalMimeType(), {
			lineNumbers: !0,
			lineWrapping: !0
		});
		return this.streamingContent.addEventListener(S.CHUNK_ADDED, () => {
			e.setContent(this.utf8());
		}), e;
	}
	static #e(t) {
		let n = "";
		for (let r = 0; r < t.length; r++) n += e.#t(t[r], 2);
		return n;
	}
	static #t(e, t) {
		let n = e.toString(16);
		for (; n.length < t;) n = "0" + n;
		return n;
	}
}, kt = "/*\n * Copyright 2014 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.font-view {\n  font-size: 60px;\n  white-space: pre-wrap;\n  overflow-wrap: break-word;\n  text-align: center;\n  padding: 15px;\n}\n", H = {
	font: "Font",
	previewOfFontFromS: "Preview of font from {PH1}"
}, At = r("ui/legacy/components/source_frame/FontView.ts", H), jt = t.bind(void 0, At), Mt = [
	"ABCDEFGHIJKLM",
	"NOPQRSTUVWXYZ",
	"abcdefghijklm",
	"nopqrstuvwxyz",
	"1234567890"
], Nt = 50, Pt = (e, t, n) => {
	let r;
	re(u`
    <style>${kt}</style>
    <style>${e.fontFaceRule}</style>
    <div class="font-view"
      aria-label=${jt(H.previewOfFontFromS, { PH1: e.url })}
      style="font-family: ${e.fontFamily}; font-size: ${e.previewFontSize}"
      aria-hidden="true"
      ?hidden=${!e.previewVisible}
    >${Mt.map((e, t) => u`${t > 0 ? u`<br>` : ""}${e}`)}</div>
    <div ${ue((e) => {
		r = e;
	})}
      style="visibility: hidden; z-index: -1; display: inline; position: absolute; font-family: ${e.fontFamily}; font-size: ${Nt}px"
    >${Mt.map((e, t) => u`${t > 0 ? u`<br>` : ""}${e}`)}</div>
  `, n), t.measureDimensions = () => r ? {
		width: r.offsetWidth,
		height: r.offsetHeight
	} : {
		width: 0,
		height: 0
	};
}, Ft = class extends _ {
	url;
	contentProvider;
	mimeTypeLabel;
	#e;
	#t = "";
	#n = "";
	#r = "";
	#i = !1;
	#a = !1;
	constructor(e, t, n = Pt) {
		super({
			title: jt(H.font),
			viewId: "font",
			jslog: `${y("font-view")}`
		}), this.#e = n, this.url = t.contentURL(), this.contentProvider = t, this.mimeTypeLabel = new b(e);
	}
	async toolbarItems() {
		return [this.mimeTypeLabel];
	}
	#o() {
		this.#a || (this.#a = !0, this.#n = `WebInspectorFontPreview${++It}`, this.contentProvider.requestContentData().then((e) => {
			let t = x.isError(e) ? this.url : e.asDataUrl();
			if (t) {
				let e = new CSSStyleSheet();
				e.insertRule("@font-face {}");
				let n = e.cssRules[0];
				n.style.setProperty("font-family", this.#n), n.style.setProperty("src", `url(${JSON.stringify(t)})`), this.#t = n.cssText;
			} else this.#t = "";
			this.#i = !0, this.requestUpdate();
		}));
	}
	wasShown() {
		super.wasShown(), this.#o(), this.requestUpdate();
	}
	onResize() {
		this.requestUpdate();
	}
	#s(e) {
		if (!this.#i || !this.isShowing()) return "";
		let t = e.height, n = e.width, r = this.element.offsetWidth - 50, i = this.element.offsetHeight - 30;
		if (!t || !n || !r || !i) return "";
		let a = r / n, o = i / t;
		return `${Math.floor(Nt * Math.min(a, o)) - 2}px`;
	}
	performUpdate() {
		let e = {};
		if (this.#e({
			url: this.url,
			fontFaceRule: this.#t,
			fontFamily: this.#n,
			previewFontSize: this.#r,
			previewVisible: this.#i
		}, e, this.contentElement), !e.measureDimensions) return;
		let t = this.#s(e.measureDimensions());
		t !== this.#r && (this.#r = t, this.requestUpdate());
	}
}, It = 0, Lt = "/*\n * Copyright 2014 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.image-view {\n  overflow: auto;\n}\n\n.image-view > .image {\n  padding: 20px 20px 10px;\n  text-align: center;\n}\n\n.image-view img.resource-image-view {\n  max-width: 100%;\n  max-height: 1000px;\n  background-image: var(--image-file-checker);\n  box-shadow: 0 5px 10px var(--sys-color-outline);\n  user-select: text;\n  -webkit-user-drag: auto;\n}\n\n.resource-image-unavailable {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: var(--sys-size-4);\n}\n\n.resource-image-unavailable devtools-icon {\n  color: var(--sys-color-primary);\n  width: var(--sys-size-7);\n  height: var(--sys-size-7);\n}\n", U = {
	image: "Image",
	dropImageFileHere: "Drop image file here",
	imageFromS: "Image from {PH1}",
	dD: "{PH1} × {PH2}",
	copyImageUrl: "Copy image URL",
	copyImageAsDataUri: "Copy image as data URI",
	openImageInNewTab: "Open image in new tab",
	saveImageAs: "Save image as…",
	download: "download",
	thisImageIsTooBig: "This image is too big to display in DevTools. Click here to open it in a new tab."
}, Rt = r("ui/legacy/components/source_frame/ImageView.ts", U), W = t.bind(void 0, Rt), zt = class extends _ {
	url;
	parsedURL;
	contentProvider;
	uiSourceCode;
	sizeLabel;
	dimensionsLabel;
	aspectRatioLabel;
	mimeTypeLabel;
	container;
	imagePreviewElement;
	imageUnavailableElement;
	cachedContent;
	constructor(e, t) {
		super({
			title: W(U.image),
			viewId: "image",
			jslog: `${y("image-view")}`
		}), this.registerRequiredCSS(Lt), this.element.tabIndex = -1, this.element.classList.add("image-view"), this.url = t.contentURL(), this.parsedURL = new ee(this.url), this.contentProvider = t, this.uiSourceCode = t instanceof Ne ? t : null, this.uiSourceCode && (this.uiSourceCode.addEventListener(C.WorkingCopyCommitted, this.workingCopyCommitted, this), new te(this.element, [se.ImageFile, se.URI], W(U.dropImageFileHere), this.handleDrop.bind(this))), this.sizeLabel = new b(), this.dimensionsLabel = new b(), this.aspectRatioLabel = new b(), this.mimeTypeLabel = new b(e), this.container = this.element.createChild("div", "image"), this.imagePreviewElement = this.container.createChild("img", "resource-image-view"), this.imagePreviewElement.addEventListener("contextmenu", this.contextMenu.bind(this), !0);
		let n = document.createElement("devtools-link");
		n.setAttribute("href", this.url), n.classList.add("resource-image-unavailable", "hidden"), n.appendChild(ae("open-externally")), n.appendChild(document.createTextNode(W(U.thisImageIsTooBig))), this.container.appendChild(n), this.imageUnavailableElement = n;
	}
	async toolbarItems() {
		return await this.updateContentIfNeeded(), [
			this.sizeLabel,
			new v(),
			this.dimensionsLabel,
			new v(),
			this.aspectRatioLabel,
			new v(),
			this.mimeTypeLabel
		];
	}
	wasShown() {
		super.wasShown(), this.updateContentIfNeeded();
	}
	disposeView() {
		this.uiSourceCode && this.uiSourceCode.removeEventListener(C.WorkingCopyCommitted, this.workingCopyCommitted, this);
	}
	workingCopyCommitted() {
		this.updateContentIfNeeded();
	}
	async updateContentIfNeeded() {
		let e = await this.contentProvider.requestContentData();
		if (x.isError(e) || this.cachedContent?.contentEqualTo(e)) return;
		this.cachedContent = e;
		let t = e.asImagePreviewUrl();
		if (t === null) {
			this.imageUnavailableElement.classList.remove("hidden");
			return;
		}
		this.imageUnavailableElement.classList.add("hidden");
		let r = new Promise((e) => {
			this.imagePreviewElement.onload = e;
		});
		this.imagePreviewElement.src = t, this.imagePreviewElement.alt = W(U.imageFromS, { PH1: this.url });
		let i = e.isTextContent ? e.text.length : je(e.base64);
		this.sizeLabel.setText(n(i)), await r, this.dimensionsLabel.setText(W(U.dD, {
			PH1: this.imagePreviewElement.naturalWidth,
			PH2: this.imagePreviewElement.naturalHeight
		})), this.aspectRatioLabel.setText(ne(this.imagePreviewElement.naturalWidth, this.imagePreviewElement.naturalHeight));
	}
	contextMenu(e) {
		let t = new m(e), n = new ee(this.imagePreviewElement.src);
		this.parsedURL.isDataURL() || t.clipboardSection().appendItem(W(U.copyImageUrl), this.copyImageURL.bind(this), { jslogContext: "image-view.copy-image-url" }), n.isDataURL() && t.clipboardSection().appendItem(W(U.copyImageAsDataUri), this.copyImageAsDataURL.bind(this), { jslogContext: "image-view.copy-image-as-data-url" }), t.clipboardSection().appendItem(W(U.openImageInNewTab), this.openInNewTab.bind(this), { jslogContext: "image-view.open-in-new-tab" }), t.clipboardSection().appendItem(W(U.saveImageAs), this.saveImage.bind(this), { jslogContext: "image-view.save-image" }), t.show();
	}
	copyImageAsDataURL() {
		d.copyText(this.imagePreviewElement.src);
	}
	copyImageURL() {
		d.copyText(this.url);
	}
	async saveImage() {
		if (!this.cachedContent) return;
		let e = "";
		if (this.parsedURL.isDataURL()) {
			e = W(U.download);
			let { type: t, subtype: n } = this.parsedURL.extractDataUrlMimeType();
			t === "image" && n && (e += "." + n);
		} else e = decodeURIComponent(this.parsedURL.displayName);
		let t = this.cachedContent.asBlob();
		if (t) try {
			let n = await (await window.showSaveFilePicker({ suggestedName: e })).createWritable();
			await n.write(t), await n.close();
		} catch (e) {
			if (e.name === "AbortError") return;
			throw e;
		}
	}
	openInNewTab() {
		d.openInNewTab(this.url);
	}
	async handleDrop(e) {
		let t = e.items;
		if (!t.length || t[0].kind !== "file") return;
		let n = t[0].getAsFile();
		if (!n) return;
		let r = !n.name.endsWith(".svg");
		((e) => {
			let t = new FileReader();
			t.onloadend = () => {
				let e;
				try {
					e = t.result;
				} catch (t) {
					e = null, console.error("Can't read file: " + t);
				}
				typeof e == "string" && this.uiSourceCode && this.uiSourceCode.setContent(r ? btoa(e) : e, r);
			}, r ? t.readAsBinaryString(e) : t.readAsText(e);
		})(n);
	}
}, Bt = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.json-view {\n  padding: 2px 6px;\n  overflow: auto;\n}\n", G = { find: "Find" }, Vt = r("ui/legacy/components/source_frame/JSONView.ts", G), K = t.bind(void 0, Vt), q = class e extends h {
	initialized;
	parsedJSON;
	startCollapsed;
	searchableView;
	treeOutline;
	currentSearchFocusIndex;
	currentSearchTreeElements;
	searchRegex;
	constructor(e, t) {
		super(), this.initialized = !1, this.registerRequiredCSS(Bt), this.parsedJSON = e, this.startCollapsed = !!t, this.element.classList.add("json-view"), this.element.setAttribute("jslog", `${ge("json-view")}`), this.currentSearchFocusIndex = 0, this.currentSearchTreeElements = [], this.searchRegex = null;
	}
	static async createView(t) {
		let n = await e.parseJSON(t);
		if (!n || typeof n.data != "object") return null;
		let r = new e(n), i = new p(r, null);
		return i.setPlaceholder(K(G.find)), r.searchableView = i, r.show(i.element), i;
	}
	static createViewSync(t, n) {
		let r = new e(new J(t, "", "")), i = new p(r, null, void 0, n);
		return i.setPlaceholder(K(G.find)), r.searchableView = i, r.show(i.element), r.element.tabIndex = 0, i;
	}
	setSearchableView(e) {
		this.searchableView = e;
	}
	static parseJSON(t) {
		let n = null;
		if (t && (n = e.extractJSON(t)), !n) return Promise.resolve(null);
		try {
			let e = JSON.parse(n.data);
			if (!e) return Promise.resolve(null);
			n.data = e;
		} catch {
			n = null;
		}
		return Promise.resolve(n);
	}
	static extractJSON(t) {
		if (t.startsWith("<")) return null;
		let n = e.findBrackets(t, "{", "}"), r = e.findBrackets(t, "[", "]");
		if (n = r.length > n.length ? r : n, n.length === -1 || t.length - n.length > 80) return null;
		let i = t.substring(0, n.start), a = t.substring(n.end + 1);
		return t = t.substring(n.start, n.end + 1), a.trim().length && !(a.trim().startsWith(")") && i.trim().endsWith("(")) ? null : new J(t, i, a);
	}
	static findBrackets(e, t, n) {
		let r = e.indexOf(t), i = e.lastIndexOf(n), a = i - r - 1;
		return (r === -1 || i === -1 || i < r) && (a = -1), {
			start: r,
			end: i,
			length: a
		};
	}
	wasShown() {
		super.wasShown(), this.initialize();
	}
	initialize() {
		if (this.initialized) return;
		this.initialized = !0;
		let e = ce.fromLocalObject(this.parsedJSON.data), t = this.parsedJSON.prefix + e.description + this.parsedJSON.suffix;
		this.treeOutline = new Je(e, t, void 0, !0, !1), this.treeOutline.enableContextMenu(), this.startCollapsed || this.treeOutline.expand(), this.element.appendChild(this.treeOutline.element);
		let n = this.treeOutline.firstChild();
		n && n.select(!0, !1);
	}
	jumpToMatch(e) {
		if (!this.searchRegex) return;
		let t = this.currentSearchTreeElements[this.currentSearchFocusIndex];
		t && t.setSearchRegex(this.searchRegex);
		let n = this.currentSearchTreeElements[e];
		n ? (this.updateSearchIndex(e), n.setSearchRegex(this.searchRegex, de), n.reveal()) : this.updateSearchIndex(0);
	}
	updateSearchCount(e) {
		this.searchableView && this.searchableView.updateSearchMatchesCount(e);
	}
	updateSearchIndex(e) {
		this.currentSearchFocusIndex = e, this.searchableView && this.searchableView.updateCurrentMatchIndex(e);
	}
	onSearchCanceled() {
		this.searchRegex = null, this.currentSearchTreeElements = [];
		let e;
		for (e = this.treeOutline.rootElement(); e; e = e.traverseNextTreeElement(!1)) e instanceof qe && e.revertHighlightChanges();
		this.updateSearchCount(0), this.updateSearchIndex(0);
	}
	performSearch(e, t, n) {
		let r = this.currentSearchFocusIndex, i = this.currentSearchTreeElements[r];
		this.onSearchCanceled(), this.searchRegex = e.toSearchRegex(!0).regex;
		let a;
		for (a = this.treeOutline.rootElement(); a; a = a.traverseNextTreeElement(!1)) {
			if (!(a instanceof qe)) continue;
			let e = a.setSearchRegex(this.searchRegex);
			if (e && this.currentSearchTreeElements.push(a), i === a) {
				let t = this.currentSearchTreeElements.length - 1;
				r = e || n ? t : t + 1;
			}
		}
		if (this.updateSearchCount(this.currentSearchTreeElements.length), !this.currentSearchTreeElements.length) {
			this.updateSearchIndex(-1);
			return;
		}
		r = g(r, this.currentSearchTreeElements.length), this.jumpToMatch(r);
	}
	jumpToNextSearchResult() {
		if (!this.currentSearchTreeElements.length) return;
		let e = g(this.currentSearchFocusIndex + 1, this.currentSearchTreeElements.length);
		this.jumpToMatch(e);
	}
	jumpToPreviousSearchResult() {
		if (!this.currentSearchTreeElements.length) return;
		let e = g(this.currentSearchFocusIndex - 1, this.currentSearchTreeElements.length);
		this.jumpToMatch(e);
	}
	supportsCaseSensitiveSearch() {
		return !0;
	}
	supportsWholeWordSearch() {
		return !0;
	}
	supportsRegexSearch() {
		return !0;
	}
}, J = class {
	data;
	prefix;
	suffix;
	constructor(e, t, n) {
		this.data = e, this.prefix = t, this.suffix = n;
	}
}, Ht = class extends p {
	#e;
	constructor(e) {
		let t = new q(new J("", "", ""));
		super(t, null, void 0, e), this.#e = t, this.setPlaceholder(K(G.find)), t.setSearchableView(this), t.show(this.element), t.element.tabIndex = 0;
	}
	set jsonObject(e) {
		let t = new q(new J(e, "", ""));
		this.#e.detach(), this.#e = t, this.searchProvider = t, t.show(this.element), this.requestUpdate();
	}
}, Ut = "/*\n * Copyright 2016 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n@scope to (devtools-widget > *) {\n.tree-outline ol {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n  padding-inline-start: 16px;\n}\n\nol.tree-outline {\n  padding-inline-start: 0;\n}\n\n.tree-outline li {\n  min-height: 12px;\n}\n\n::part(shadow-xml-view-close-tag) {\n  margin-left: -16px;\n}\n\n::part(shadow-xml-view-close-tag),::part(shadow-xml-view-tag) {\n  color: var(--sys-color-purple);\n}\n\n::part(shadow-xml-view-comment) {\n  color: var(--sys-color-green);\n}\n\n::part(shadow-xml-view-processing-instruction) {\n  color: var(--sys-color-green);\n}\n\n::part(shadow-xml-view-attribute-name) {\n  color: var(--sys-color-orange);\n}\n\n::part(shadow-xml-view-attribute-value) {\n  color: var(--sys-color-blue);\n}\n\n::part(shadow-xml-view-text) {\n  color: var(--sys-color-on-surface);\n  white-space: pre;\n}\n\n::part(shadow-xml-view-cdata) {\n  color: var(--sys-color-on-surface);\n}\n}\n", Wt = "/*\n * Copyright 2014 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.shadow-xml-view {\n  user-select: text;\n  overflow: auto;\n  padding: 0;\n}\n", Gt = { find: "Find" }, Kt = r("ui/legacy/components/source_frame/XMLView.ts", Gt), qt = t.bind(void 0, Kt), { render: Jt, html: Y } = oe, { ifExpanded: Yt } = me;
function* X(e) {
	for (let t = 0; t < e.attributes.length; ++t) {
		let n = e.attributes.item(t);
		n && (yield n);
	}
}
function Z(e) {
	return !!e.childNodes.values().find((e) => e.nodeType !== Node.TEXT_NODE);
}
function Xt(e, t) {
	let { node: n } = e;
	switch (n.nodeType) {
		case Node.ELEMENT_NODE:
			if (n instanceof Element) {
				let e = n.tagName;
				return t ? Z(n) || n.textContent ? "</" + e + ">" : "" : `${"<" + e}${X(n).map((e) => ` ${e.name}="${e.value}"`).toArray().join("")}${Z(n) ? "" : n.textContent ? `>${n.textContent}${"</" + e}` : " /"}>`;
			}
			return "";
		case Node.TEXT_NODE: return n.nodeValue && !t ? `${n.nodeValue}` : "";
		case Node.CDATA_SECTION_NODE: return n.nodeValue && !t ? `<![CDATA[${n.nodeValue}]]>` : "";
		case Node.PROCESSING_INSTRUCTION_NODE: return n.nodeValue && !t ? `${"<?" + n.nodeName + " " + n.nodeValue + "?>"}` : "";
		case Node.COMMENT_NODE: return t ? "" : `${"<!--" + n.nodeValue + "-->"}`;
	}
	return "";
}
function Zt(e) {
	let { node: t } = e;
	switch (t.nodeType) {
		case Node.ELEMENT_NODE:
			if (t instanceof Element) {
				let n = t.tagName;
				return Y`<span part='shadow-xml-view-tag'>${"<" + n}</span>${X(t).map((e) => Y`<span part='shadow-xml-view-tag'>${"\xA0"}</span>
                <span part='shadow-xml-view-attribute-name'>${e.name}</span>
                <span part='shadow-xml-view-tag'>${"=\""}</span>
                <span part='shadow-xml-view-attribute-value'>${e.value}</span>
                <span part='shadow-xml-view-tag'>${"\""}</span>`)}
                <span ?hidden=${e.expanded}>${Z(t) ? Y`<span part='shadow-xml-view-tag'>${">"}</span>
                  <span part='shadow-xml-view-comment'>${"…"}</span>
                  <span part='shadow-xml-view-tag'>${"</" + n}</span>` : t.textContent ? Y`<span part='shadow-xml-view-tag'>${">"}</span>
                  <span part='shadow-xml-view-text'>${t.textContent}</span>
                  <span part='shadow-xml-view-tag'>${"</" + n}</span>` : Y`<span part='shadow-xml-view-tag'>${" /"}</span>`}</span>
                <span part='shadow-xml-view-tag'>${">"}</span>`;
			}
			return f;
		case Node.TEXT_NODE: return t.nodeValue ? Y`<span part='shadow-xml-view-text'>${t.nodeValue}</span>` : f;
		case Node.CDATA_SECTION_NODE: return t.nodeValue ? Y`<span part='shadow-xml-view-cdata'>${"<![CDATA["}</span>
          <span part='shadow-xml-view-text'>${t.nodeValue}</span>
          <span part='shadow-xml-view-cdata'>${"]]>"}</span>` : f;
		case Node.PROCESSING_INSTRUCTION_NODE: return t.nodeValue ? Y`<span part='shadow-xml-view-processing-instruction'>${"<?" + t.nodeName + " " + t.nodeValue + "?>"}</span>` : f;
		case Node.COMMENT_NODE: return Y`<span part='shadow-xml-view-comment'>${"<!--" + t.nodeValue + "-->"}</span>`;
	}
	return f;
}
var Qt = (e, t, n) => {
	function r(t, n) {
		let r = "", i = "";
		if (!e.search) return {
			highlights: r,
			selected: i
		};
		let a = e.search.getResults(t);
		for (let t of a ?? []) if (t.isPostOrderMatch === n) {
			let n = new Ae(t.match.index, t.match[0].length);
			t === e.jumpToNextSearchResult ? i = `${n.offset},${n.length}` : r += `${n.offset},${n.length} `;
		}
		return {
			highlights: r,
			selected: i
		};
	}
	function i(t) {
		let n = (n) => e.onExpand(t, n.detail.expanded), { highlights: i, selected: o } = r(t, !1), s = (t) => {
			if (t === e.jumpToNextSearchResult?.node) return !0;
			for (let e of t.children()) if (s(e)) return !0;
			return !1;
		};
		return Y`
      <li role="treeitem"
          ?selected=${e.jumpToNextSearchResult?.node === t}
          @expand=${n}
          ?open=${s(t)}>
        <devtools-highlight ranges=${i} current-range=${o}>
          ${Zt(t)}
        </devtools-highlight>
        ${t.children().length ? Y`
          <ul role="group">
            ${Yt(a(t))}
          </ul>` : f}
      </li>`;
	}
	function a(e) {
		let t = e.children();
		if (t.length === 0) return f;
		let { highlights: n, selected: a } = r(e, !0);
		return Y`
      ${t.map((e) => i(e))}
      ${e.node instanceof Element ? Y`
        <li role="treeitem">
          <devtools-highlight ranges=${n} current-range=${a}>
            <span part='shadow-xml-view-close-tag'>${"</" + e.node.tagName + ">"}</span>
          </devtools-highlight>
        </li>` : f}`;
	}
	Jt(Y`
    <style>${Wt}</style>
    <style>${Ut}</style>
    <devtools-tree
      class="shadow-xml-view source-code"
      .template=${Y`
        <ul role="tree">
            ${e.xml.children().map((e) => i(e))}
        </ul>`}
      ></devtools-tree>`, n, { container: {
		classes: ["shadow-xml-view", "source-code"],
		attributes: { jslog: `${y("xml-view")}` }
	} });
};
function* $t(e) {
	if (!e || !Z(e)) return;
	let t = e?.firstChild;
	for (; t;) {
		let e = t;
		t = t.nextSibling;
		let n = e.nodeType;
		n === Node.TEXT_NODE && e.nodeValue?.match(/\s+/) || (n === Node.ELEMENT_NODE || n === Node.TEXT_NODE || n === Node.CDATA_SECTION_NODE || n === Node.PROCESSING_INSTRUCTION_NODE || n === Node.COMMENT_NODE) && (yield e);
	}
}
var en = class e {
	node;
	expanded = !1;
	#e;
	constructor(e) {
		this.node = e;
	}
	children() {
		return this.#e ||= $t(this.node).map((t) => new e(t)).toArray(), this.#e;
	}
	match(e, t) {
		return Xt(this, t).matchAll(e);
	}
}, tn = class {
	xmlDocument;
	root;
	constructor(e) {
		this.xmlDocument = e, this.root = new en(e), this.root.expanded = !0;
	}
}, nn = class e extends he {
	searchableView = null;
	#e;
	#t;
	#n;
	#r;
	constructor(e, t = Qt) {
		super(e), this.#n = t;
	}
	set parsedXML(e) {
		this.#t?.xmlDocument !== e && (this.#t = new tn(e), this.requestUpdate());
	}
	performUpdate() {
		this.#t && this.#n({
			xml: this.#t.root,
			onExpand: (e, t) => {
				e.expanded = t, this.requestUpdate();
			},
			search: this.#e,
			jumpToNextSearchResult: this.#r
		}, {}, this.contentElement);
	}
	static createSearchableView(t) {
		let n = new e();
		n.parsedXML = t;
		let r = new p(n, null);
		return r.setPlaceholder(qt(Gt.find)), n.searchableView = r, n.show(r.element), r;
	}
	static parseXML(e, t) {
		let n;
		try {
			switch (t) {
				case "application/xhtml+xml":
				case "application/xml":
				case "image/svg+xml":
				case "text/html":
				case "text/xml": n = new DOMParser().parseFromString(e, t);
			}
		} catch {
			return null;
		}
		return !n || n.body ? null : n;
	}
	onSearchCanceled() {
		this.#e = void 0, this.searchableView?.updateSearchMatchesCount(0), this.searchableView?.updateCurrentMatchIndex(0);
	}
	performSearch(e, t, n) {
		if (!this.#t || !this.searchableView) return;
		let { regex: r } = e.toSearchRegex(!0);
		this.#e ||= new ve(), this.#e.search(this.#t.root, n ?? !1, (e, t) => e.match(r, t).map((n, r) => ({
			node: e,
			matchIndexInNode: r,
			isPostOrderMatch: t,
			match: n
		})).toArray()), this.#r = t ? this.#e.currentMatch() : void 0, this.#e.updateSearchableView(this.searchableView), this.requestUpdate();
	}
	jumpToNextSearchResult() {
		this.#r = this.#e?.next(), this.searchableView && this.#e?.updateSearchableView(this.searchableView), this.requestUpdate();
	}
	jumpToPreviousSearchResult() {
		this.#r = this.#e?.prev(), this.searchableView && this.#e?.updateSearchableView(this.searchableView), this.requestUpdate();
	}
	supportsCaseSensitiveSearch() {
		return !0;
	}
	supportsWholeWordSearch() {
		return !0;
	}
	supportsRegexSearch() {
		return !0;
	}
}, Q = {
	failedToLoadData: "Failed to load data",
	nothingToPreview: "Nothing to preview"
}, rn = r("ui/legacy/components/source_frame/PreviewFactory.ts", Q), $ = t.bind(void 0, rn), an = class {
	static async createPreview(e, t) {
		let n = a.fromMimeType(t);
		switch (n === i.Other && (n = e.contentType()), n) {
			case i.Image: return new zt(t, e);
			case i.Font: return new Ft(t, e);
		}
		let r = await e.requestContentData();
		if (x.isError(r)) return new ie($(Q.failedToLoadData), r.error);
		if (!r.isTextContent) return null;
		if (!r.text) return new ie($(Q.nothingToPreview), "");
		let o = nn.parseXML(r.text, r.mimeType);
		if (o) return nn.createSearchableView(o);
		let s = await q.createView(r.text);
		if (s) return s;
		let c = t.replace(/;.*/, "") || e.contentType().canonicalMimeType();
		return B.createSearchableView(e, c);
	}
};
//#endregion
export { zt as a, B as c, ct as d, lt as f, bt as g, gt as h, Ht as i, Tt as l, yt as m, q as n, Ft as o, ht as p, J as r, Ot as s, an as t, st as u };
