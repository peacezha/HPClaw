import { n as e } from "./rolldown-runtime-DF993M8W.js";
import { i as t, n, t as r } from "./dom_extension-BLny9Waw.js";
import { $ as i, D as a, H as o, K as s, en as c, i as l, l as u } from "./common-DMSVbaSb.js";
import { Ba as d, Dp as f, Dt as p, Fo as m, Ft as ee, H as te, Hi as ne, Ht as re, Ir as ie, It as ae, La as oe, Lr as se, Nr as h, Or as g, Po as _, Rn as ce, U as v, Y as le, Yf as ue, Yt as y, Zo as b, _r as de, ct as fe, ei as pe, ff as x, gf as me, gr as he, ht as ge, ia as _e, jr as S, la as ve, na as ye, pf as C, tt as be, uo as xe, vi as Se, wt as w, xt as T, yr as E, yt as D } from "./legacy-dM_vujv7.js";
import "./platform-D4TUCh2P.js";
import { y as O } from "./text_utils-DWSliayn.js";
import { i as k, k as A, p as j } from "./StringUtilities-CMDxNrEc.js";
import { n as M, t as N } from "./diff-DXcO6Sla.js";
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/components/text_prompt/textPrompt.css.mjs
var Ce = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  white-space: pre;\n  overflow: hidden;\n  display: flex;\n}\n\ninput {\n  font-size: var(--sys-typescale-body3-size);\n}\n\n.prefix {\n  flex: none;\n  font-weight: var(--ref-typeface-weight-medium);\n  font-size: var(--sys-typescale-body3-size);\n  color: var(--sys-color-primary);\n}\n\n.text-prompt-input {\n  flex: auto;\n  position: relative;\n}\n\n.text-prompt-input input {\n  width: 100%;\n  border: none;\n  outline: none;\n  position: absolute;\n  left: 0;\n  padding: 0;\n  z-index: 2;\n  color: var(--sys-color-on-surface);\n  background-color: transparent;\n  line-height: var(--sys-typescale-body3-line-height);\n}\n\n.text-prompt-input .suggestion {\n  color: var(--sys-color-on-surface-subtle);\n  line-height: var(--sys-typescale-body3-line-height);\n  position: absolute;\n  left: 0;\n  z-index: 1;\n}\n", P = class e extends Event {
	static eventName = "promptinputchanged";
	data;
	constructor(t) {
		super(e.eventName), this.data = t;
	}
}, F = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t = "";
	#n = "";
	#r = "";
	set data(e) {
		this.#t = e.ariaLabel, this.#n = e.prefix, this.#r = e.suggestion, this.#s();
	}
	get data() {
		return {
			ariaLabel: this.#t,
			prefix: this.#n,
			suggestion: this.#r
		};
	}
	focus() {
		this.#i().focus();
	}
	#i() {
		let e = this.#e.querySelector(".input");
		if (!e) throw Error("Expected an input element!");
		return e;
	}
	moveCaretToEndOfInput() {
		this.setSelectedRange(this.#o().length, this.#o().length);
	}
	onKeyDown(e) {
		e.key === "Enter" && e.preventDefault();
	}
	setSelectedRange(e, t) {
		if (e < 0) throw RangeError("Selected range start must be a nonnegative integer");
		let n = this.#o().length;
		t > n && (t = n), t < e && (t = e), this.#i().setSelectionRange(e, t);
	}
	setPrefix(e) {
		this.#n = e, this.#s();
	}
	setSuggestion(e) {
		this.#r = e, this.#a().value = this.#r, this.#s();
	}
	setText(e) {
		this.#i().value = e, this.#i().hasFocus() && (this.moveCaretToEndOfInput(), this.#i().scrollIntoView());
	}
	#a() {
		let e = this.#e.querySelector(".suggestion");
		if (!e) throw Error("Expected an suggestion element!");
		return e;
	}
	#o() {
		return this.#i().value || "";
	}
	connectedCallback() {
		new MutationObserver((e) => {
			for (let t of e) if (t.type === "attributes" && t.attributeName === "dir") {
				let e = this.#i().getAttribute("dir");
				if (!e) {
					this.#a().removeAttribute("dir");
					return;
				}
				this.#a().setAttribute("dir", e);
			}
		}).observe(this.#i(), { attributeFilter: ["dir"] });
	}
	#s() {
		let e = _`
      <style>${Ce}</style>
      <span class="prefix">${this.#n} </span>
      <span class="text-prompt-input">
        <input
            class="input" aria-label=${this.#t} spellcheck="false"
            @input=${() => this.dispatchEvent(new P(this.#o()))}
            @keydown=${this.onKeyDown}>
        <input class="suggestion" tabindex=-1 aria-label=${this.#t + " Suggestion"}>
      </span>`;
		m(e, this.#e, { host: this });
	}
};
customElements.define("devtools-text-prompt", F);
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/legacy/components/quick_open/filteredListWidget.css.mjs
var we = "/*\n * Copyright 2015 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.filtered-list-widget {\n  display: flex;\n  flex-direction: column;\n  flex: auto;\n  border: 1px solid transparent;\n}\n\n.hbox {\n  flex: 0 0 var(--sys-size-14);\n  padding: 0 var(--sys-size-8);\n  gap: var(--sys-size-3);\n  align-items: center;\n}\n\n.filtered-list-widget-hint {\n  color: var(--sys-color-on-surface-subtle);\n  font-size: var(--sys-typescale-body4-size);\n  line-height: 18px;\n}\n\ndevtools-text-prompt {\n  flex-grow: 1;\n  font-size: var(--sys-typescale-body3-size);\n  gap: var(--sys-size-3);\n  font-family: \".SFNSDisplay-Regular\", \"Helvetica Neue\", \"Lucida Grande\", sans-serif;\n  line-height: var(--sys-typescale-body3-line-height);\n}\n\n.filtered-list-widget-progress {\n  flex: none;\n  background: var(--sys-color-divider);\n  height: var(--sys-size-1);\n}\n\n.filtered-list-widget-progress-bar {\n  background-color: var(--sys-color-primary-bright);\n  height: var(--sys-size-2);\n  width: 100%;\n  transform: scaleX(0);\n  transform-origin: top left;\n  opacity: 100%;\n  transition: none;\n}\n\n.filtered-widget-progress-fade {\n  opacity: 0%;\n  transition: opacity 500ms;\n}\n\n.filtered-list-widget .vbox > div.container {\n  flex: auto;\n  overflow: hidden auto;\n}\n\n.filtered-list-widget-item {\n  color: var(--sys-color-on-surface);\n  display: flex;\n  font-family: \".SFNSDisplay-Regular\", \"Helvetica Neue\", \"Lucida Grande\", sans-serif;\n  padding: 0 var(--sys-size-7);\n  gap: var(--sys-size-7);\n  height: var(--sys-size-14);\n  white-space: break-spaces;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  font-size: var(--sys-typescale-body4-size);\n}\n\n.filtered-list-widget-item devtools-icon {\n  align-self: center;\n  flex: none;\n  width: 18px;\n  height: 18px;\n\n  &.snippet {\n    color: var(--sys-color-orange-bright);\n  }\n}\n\n.filtered-list-widget-item.selected {\n  background-color: var(--sys-color-state-hover-on-subtle);\n}\n\n.filtered-list-widget-item > div {\n  flex: auto;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  line-height: var(--sys-typescale-body3-line-height);\n  align-items: center;\n  align-content: center;\n  display: flex;\n  gap: var(--sys-size-4);\n}\n\n.filtered-list-widget-item span.highlight {\n  font-weight: var(--ref-typeface-weight-bold);\n}\n\n.filtered-list-widget-item .tag {\n  font-size: var(--sys-typescale-body5-size);\n  line-height: var(--sys-typescale-headline5-line-height);\n  align-self: center;\n  flex-shrink: 0;\n}\n\n.filtered-list-widget-item .deprecated-tag {\n  font-size: 11px;\n  color: var(--sys-color-token-subtle);\n}\n\n.not-found-text {\n  height: 34px;\n  line-height: 34px;\n  padding-left: 8px;\n  font-style: italic;\n  color: var(--sys-color-state-disabled);\n  background: var(--sys-color-state-disabled-container);\n}\n\n.quickpick-description {\n  flex: none;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  color: var(--sys-color-state-disabled);\n  padding-left: 15px;\n}\n\n@media (forced-colors: active) {\n  .filtered-list-widget {\n    forced-color-adjust: none;\n    border-color: ButtonText;\n  }\n\n  .filtered-list-widget-item,\n  .quickpick-description {\n    color: ButtonText;\n  }\n\n  .filtered-list-widget-item.selected {\n    background-color: Highlight;\n    color: HighlightText;\n  }\n\n  devtools-text-prompt {\n    border-color: ButtonText;\n  }\n}\n", Te = /* @__PURE__ */ e({
	Events: () => De,
	FilteredListWidget: () => R,
	Provider: () => z,
	getRegisteredProviders: () => H,
	registerProvider: () => V
}), I = {
	quickOpenPrompt: "Quick open prompt",
	quickOpen: "Quick open",
	noResultsFound: "No results found",
	sItemSOfS: "{PH1}, item {PH2} of {PH3}",
	newFeature: "This is a new feature"
}, Ee = s("ui/legacy/components/quick_open/FilteredListWidget.ts", I), L = o.bind(void 0, Ee), R = class extends i(pe) {
	promptHistory;
	scoringTimer;
	filterTimer;
	loadTimeout;
	refreshListWithCurrentResult;
	dialog;
	query = "";
	inputBoxElement;
	hintElement;
	bottomElementsContainer;
	progressElement;
	progressBarElement;
	items;
	list;
	itemElementsContainer;
	notFoundElement;
	prefix = "";
	provider;
	queryChangedCallback;
	constructor(e, t, n) {
		super({ useShadowDom: !0 }), this.registerRequiredCSS(we), this.promptHistory = t || [], this.scoringTimer = 0, this.filterTimer = 0, this.loadTimeout = 0, this.contentElement.classList.add("filtered-list-widget");
		let r = this.onKeyDown.bind(this);
		this.contentElement.addEventListener("keydown", r), le(this.contentElement);
		let i = this.contentElement.createChild("div", "hbox");
		this.inputBoxElement = new F(), this.inputBoxElement.data = {
			ariaLabel: L(I.quickOpenPrompt),
			prefix: "",
			suggestion: ""
		}, this.inputBoxElement.addEventListener(P.eventName, this.onInput.bind(this), !1), this.inputBoxElement.setAttribute("jslog", `${xe().track({
			change: !0,
			keydown: "ArrowUp|ArrowDown|PageUp|PageDown|Enter|Tab|>|@|:|?|!"
		})}`), i.appendChild(this.inputBoxElement), this.hintElement = i.createChild("span", "filtered-list-widget-hint"), this.bottomElementsContainer = this.contentElement.createChild("div", "vbox"), this.progressElement = this.bottomElementsContainer.createChild("div", "filtered-list-widget-progress"), this.progressBarElement = this.progressElement.createChild("div", "filtered-list-widget-progress-bar"), this.items = new E(), this.list = new he(this.items, this, de.EqualHeightItems), this.itemElementsContainer = this.list.element, this.itemElementsContainer.classList.add("container"), this.bottomElementsContainer.appendChild(this.itemElementsContainer), this.itemElementsContainer.addEventListener("click", this.onClick.bind(this), !1), this.itemElementsContainer.addEventListener("mousemove", this.onMouseMove.bind(this), !1), be(this.itemElementsContainer), T(this.inputBoxElement, this.itemElementsContainer), D(this.inputBoxElement, te.LIST), this.notFoundElement = this.bottomElementsContainer.createChild("div", "not-found-text"), this.notFoundElement.classList.add("hidden"), this.setDefaultFocusedElement(this.inputBoxElement), this.provider = e, this.queryChangedCallback = n;
	}
	static getHighlightRanges(e, t, n) {
		if (!t) return "";
		function r(e, t) {
			let n = N.charDiff(t, e), r = 0, i = [];
			for (let e = 0; e < n.length; ++e) {
				let t = n[e];
				if (t[0] === M.Equal) i.push(new O(r, t[1].length));
				else if (t[0] !== M.Insert) return null;
				r += t[1].length;
			}
			return i;
		}
		let i = r(e, t);
		return (!i || n) && (i = r(e.toUpperCase(), t.toUpperCase())), i?.map((e) => `${e.offset},${e.length}`).join(" ") || "";
	}
	setCommandPrefix(e) {
		this.inputBoxElement.setPrefix(e);
	}
	setCommandSuggestion(e) {
		this.inputBoxElement.setSuggestion(e);
	}
	setHintElement(e) {
		this.hintElement.textContent = e;
	}
	showAsDialog(e) {
		e ||= L(I.quickOpen), this.dialog = new ee("quick-open"), p(this.dialog.contentElement, e), this.dialog.setMaxContentSize(new Se(576, 320)), this.dialog.setSizeBehavior(re.SET_EXACT_WIDTH_MAX_HEIGHT), this.dialog.setContentPosition(null, 22), this.dialog.contentElement.style.setProperty("border-radius", "var(--sys-shape-corner-medium)"), this.dialog.contentElement.style.setProperty("box-shadow", "var(--sys-elevation-level3)"), this.show(this.dialog.contentElement), w(this.contentElement, !0), this.dialog.once(ae.HIDDEN).then(() => {
			this.dispatchEventToListeners("hidden");
		}), this.dialog.show();
	}
	setPrefix(e) {
		this.prefix = e;
	}
	setProvider(e) {
		e !== this.provider && (this.provider && this.provider.detach(), this.clearTimers(), this.provider = e, this.isShowing() && this.attachProvider());
	}
	setQuerySelectedRange(e, t) {
		this.inputBoxElement.setSelectedRange(e, t);
	}
	attachProvider() {
		this.items.replaceAll([]), this.list.invalidateItemHeight(), this.provider && (this.provider.setRefreshCallback(this.itemsLoaded.bind(this, this.provider)), this.provider.attach()), this.itemsLoaded(this.provider);
	}
	cleanValue() {
		return this.query.substring(this.prefix.length).trim();
	}
	wasShown() {
		super.wasShown(), this.attachProvider();
	}
	willHide() {
		super.willHide(), this.provider && this.provider.detach(), this.clearTimers(), w(this.contentElement, !1);
	}
	clearTimers() {
		clearTimeout(this.filterTimer), clearTimeout(this.scoringTimer), clearTimeout(this.loadTimeout), this.filterTimer = 0, this.scoringTimer = 0, this.loadTimeout = 0, this.refreshListWithCurrentResult = void 0;
	}
	onEnter(e) {
		if (!this.provider) return;
		e.preventDefault();
		let t = this.list.selectedIndex();
		if (t < 0) return;
		let n = this.list.elementAtIndex(t);
		n && d(n, e);
		let r = this.provider.itemCount() ? this.list.selectedItem() : null;
		this.selectItem(r), this.dialog && this.dialog.hide();
	}
	itemsLoaded(e) {
		this.loadTimeout || e !== this.provider || (this.loadTimeout = window.setTimeout(this.updateAfterItemsLoaded.bind(this), 0));
	}
	updateAfterItemsLoaded() {
		this.loadTimeout = 0, this.filterItems();
	}
	createElementForItem(e) {
		let t = document.createElement("div");
		return t.className = "filtered-list-widget-item", this.provider && (m(this.provider.renderItem(e, this.cleanValue()), t), t.setAttribute("jslog", `${oe(this.provider.jslogContextAt(e)).track({
			click: !0,
			resize: !0
		})}`)), fe(t), t;
	}
	heightForItem(e) {
		return 0;
	}
	isItemSelectable(e) {
		return !0;
	}
	selectedItemChanged(e, t, n, r) {
		n && n.classList.remove("selected"), r && r.classList.add("selected"), ge(this.inputBoxElement, r);
	}
	onClick(e) {
		let t = this.list.itemForNode(e.target);
		t !== null && (e.consume(!0), this.selectItem(t), this.dialog && this.dialog.hide());
	}
	onMouseMove(e) {
		let t = this.list.itemForNode(e.target);
		if (t === null) return;
		this.list.selectItem(t);
		let n = this.list.elementAtIndex(this.list.selectedIndex()).querySelectorAll("*"), r = Array.from(n).filter((e) => !e.children.length).map((e) => e.classList.contains("new-badge") ? L(I.newFeature) : e.textContent).join();
		r && v.alert(L(I.sItemSOfS, {
			PH1: r,
			PH2: this.list.selectedIndex() + 1,
			PH3: this.items.length
		}));
	}
	setQuery(e) {
		this.query = e, this.inputBoxElement.focus(), this.inputBoxElement.setText(e), this.queryChanged(), this.scheduleFilter();
	}
	tabKeyPressed() {
		let e = this.query, t;
		for (let n = this.promptHistory.length - 1; n >= 0; n--) if (this.promptHistory[n] !== e && this.promptHistory[n].startsWith(e)) {
			t = this.promptHistory[n];
			break;
		}
		if (t) {
			let n = this.inputBoxElement.getComponentSelection();
			return n && n.toString().trim() !== "" ? (this.setQuery(t), !0) : (this.inputBoxElement.focus(), this.inputBoxElement.setText(t), this.inputBoxElement.setSuggestion(""), this.setQuerySelectedRange(e.length, t.length), !0);
		}
		return this.list.selectNextItem(!0, !1);
	}
	itemsFilteredForTest() {}
	filterItems() {
		if (this.filterTimer = 0, this.scoringTimer && (clearTimeout(this.scoringTimer), this.scoringTimer = 0, this.refreshListWithCurrentResult && this.refreshListWithCurrentResult()), !this.provider) {
			this.bottomElementsContainer.classList.toggle("hidden", !0), this.itemsFilteredForTest();
			return;
		}
		this.bottomElementsContainer.classList.toggle("hidden", !1), this.progressBarElement.style.transform = "scaleX(0)", this.progressBarElement.classList.remove("filtered-widget-progress-fade", "hidden");
		let e = this.provider.rewriteQuery(this.cleanValue()), t = e ? j(e) : null, n = [], r = [], i = [], a = 0, o = [], s = window.performance.now(), l = f(10, 500, this.provider.itemCount() / 10 | 0);
		d.call(this, 0);
		function u(e, t) {
			return t - e;
		}
		function d(f) {
			if (!this.provider) return;
			this.scoringTimer = 0;
			let p = 0, m;
			for (m = f; m < this.provider.itemCount() && p < l; ++m) {
				if (t && !t.test(this.provider.itemKeyAt(m))) continue;
				let s = this.provider.itemScoreAt(m, e);
				if (e && p++, s > a || r.length < 100) {
					let e = c(r, s, u);
					if (r.splice(e, 0, s), i.splice(e, 0, m), r.length > 100) {
						let e = i[i.length - 1];
						e && o.push(e), r.length = 100, i.length = 100;
					}
					let t = r[r.length - 1];
					t && (a = t);
				} else n.push(m);
			}
			if (this.refreshListWithCurrentResult = this.refreshList.bind(this, i, o, n), m < this.provider.itemCount()) {
				this.scoringTimer = window.setTimeout(d.bind(this, m), 0), window.performance.now() - s > 50 && (this.progressBarElement.style.transform = "scaleX(" + m / this.provider.itemCount() + ")");
				return;
			}
			window.performance.now() - s > 100 ? (this.progressBarElement.style.transform = "scaleX(1)", this.progressBarElement.classList.add("filtered-widget-progress-fade")) : this.progressBarElement.classList.add("hidden"), this.refreshListWithCurrentResult();
		}
	}
	refreshList(e, t, n) {
		this.refreshListWithCurrentResult = void 0, n = [
			...e,
			...t,
			...n
		], this.updateNotFoundMessage(!!n.length);
		let r = this.list.element.offsetHeight;
		this.items.replaceAll(n), n.length && this.list.selectItem(n[0]), this.list.element.offsetHeight !== r && this.list.viewportResized(), this.itemsFilteredForTest();
	}
	updateNotFoundMessage(e) {
		this.list.element.classList.toggle("hidden", !e), this.notFoundElement.classList.toggle("hidden", e), !e && this.provider && (this.notFoundElement.textContent = this.provider.notFoundText(this.cleanValue()), v.alert(this.notFoundElement.textContent));
	}
	onInput(e) {
		this.query = e.data, this.queryChanged(), this.scheduleFilter();
	}
	async queryChanged() {
		this.hintElement.classList.toggle("hidden", !!this.query), this.queryChangedCallback && await this.queryChangedCallback(this.query), this.provider && this.provider.queryChanged(this.cleanValue());
	}
	updateSelectedItemARIA(e, t) {
		return !1;
	}
	onKeyDown(e) {
		let i = !1;
		switch (e.key) {
			case n:
				e.isComposing || this.onEnter(e);
				return;
			case "Tab":
				if (e.shiftKey) {
					i = this.list.selectPreviousItem(!0, !1);
					break;
				}
				i = this.tabKeyPressed();
				break;
			case r.UP:
				i = this.list.selectPreviousItem(!0, !1);
				break;
			case r.DOWN:
				i = this.list.selectNextItem(!0, !1);
				break;
			case t.UP:
				i = this.list.selectItemPreviousPage(!1);
				break;
			case t.DOWN: i = this.list.selectItemNextPage(!1);
		}
		if (i) {
			e.consume(!0);
			let t = this.list.elementAtIndex(this.list.selectedIndex())?.textContent;
			t && v.alert(L(I.sItemSOfS, {
				PH1: t,
				PH2: this.list.selectedIndex() + 1,
				PH3: this.items.length
			}));
		}
	}
	scheduleFilter() {
		this.filterTimer ||= window.setTimeout(this.filterItems.bind(this), 0);
	}
	selectItem(e) {
		this.promptHistory.push(this.query), this.promptHistory.length > 100 && this.promptHistory.shift(), this.provider && this.provider.selectItem(e, this.cleanValue());
	}
}, De = /* @__PURE__ */ function(e) {
	return e.HIDDEN = "hidden", e;
}({}), z = class {
	refreshCallback;
	jslogContext = "";
	setRefreshCallback(e) {
		this.refreshCallback = e;
	}
	attach() {}
	itemCount() {
		return 0;
	}
	itemKeyAt(e) {
		return "";
	}
	itemScoreAt(e, t) {
		return 1;
	}
	renderItem(e, t) {
		return b;
	}
	jslogContextAt(e) {
		return this.jslogContext;
	}
	selectItem(e, t) {}
	refresh() {
		this.refreshCallback && this.refreshCallback();
	}
	rewriteQuery(e) {
		return e;
	}
	queryChanged(e) {}
	notFoundText(e) {
		return L(I.noResultsFound);
	}
	detach() {}
}, B = [];
function V(e) {
	B.push(e);
}
function H() {
	return B;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/legacy/components/quick_open/QuickOpen.ts
var Oe = /* @__PURE__ */ e({
	QuickOpenImpl: () => G,
	ShowActionDelegate: () => je,
	history: () => W
}), U = { typeToSeeAvailableCommands: "Type ? to see available commands" }, ke = s("ui/legacy/components/quick_open/QuickOpen.ts", U), Ae = o.bind(void 0, ke), W = [], G = class {
	prefix = null;
	prefixes = [];
	providers = /* @__PURE__ */ new Map();
	filteredListWidget = null;
	constructor() {
		H().forEach(this.addProvider.bind(this)), this.prefixes.sort((e, t) => t.length - e.length);
	}
	static show(e) {
		let t = new this(), n = new R(null, W, t.queryChanged.bind(t));
		t.filteredListWidget = n, n.setHintElement(Ae(U.typeToSeeAvailableCommands)), n.showAsDialog(), n.setQuery(e);
	}
	addProvider(e) {
		let t = e.prefix;
		t !== null && (this.prefixes.push(t), this.providers.set(t, {
			provider: async () => {
				let t = await e.provider();
				return t.jslogContext = e.jslogContext, t;
			},
			titlePrefix: e.titlePrefix,
			titleSuggestion: e.titleSuggestion
		}));
	}
	async queryChanged(e) {
		let t = this.prefixes.find((t) => e.startsWith(t));
		if (typeof t != "string" || !this.filteredListWidget) return;
		this.filteredListWidget.setPrefix(t);
		let n = this.providers.get(t)?.titlePrefix;
		this.filteredListWidget.setCommandPrefix(n ? n() : "");
		let r = e === t && this.providers.get(t)?.titleSuggestion;
		if (this.filteredListWidget.setCommandSuggestion(r ? t + r() : ""), this.prefix === t) return;
		this.prefix = t, this.filteredListWidget.setProvider(null);
		let i = this.providers.get(t)?.provider;
		if (!i) return;
		let a = await i();
		this.prefix === t && this.filteredListWidget && (this.filteredListWidget.setProvider(a), this.providerLoadedForTest(a));
	}
	providerLoadedForTest(e) {}
}, je = class {
	handleAction(e, t) {
		return t === "quick-open.show" && (G.show(""), !0);
	}
}, Me = /* @__PURE__ */ e({
	Command: () => Q,
	CommandMenu: () => Y,
	CommandMenuProvider: () => Z,
	PanelOrDrawer: () => X,
	ShowActionDelegate: () => Fe
}), K = {
	settingsChangedReloadDevTools: "Settings changed. To apply, reload DevTools.",
	noCommandsFound: "No commands found",
	run: "Run",
	command: "Command",
	runCommand: "Run command",
	deprecated: "— deprecated"
}, Ne = s("ui/legacy/components/quick_open/CommandMenu.ts", K), q = o.bind(void 0, Ne), J, Y = class e {
	#e;
	constructor() {
		this.#e = [], this.loadCommands();
	}
	static instance(t = { forceNew: null }) {
		let { forceNew: n } = t;
		return (!J || n) && (J = new e()), J;
	}
	static createCommand(e) {
		let { category: t, keys: n, title: r, shortcut: i, jslogContext: a, executeHandler: o, availableHandler: s, userActionCode: c, deprecationWarning: l, isPanelOrDrawer: u, featurePromotionId: d } = e, f = o;
		if (c) {
			let e = c;
			f = () => {
				x.actionTaken(e), o();
			};
		}
		return new Q(t, r, n, i, a, f, s, l, u, d);
	}
	static createSettingCommand(t, n, r) {
		let i = t.category();
		if (!i) throw Error(`Creating '${n}' setting command failed. Setting has no category.`);
		let o = t.tags() || "", s = !!t.reloadRequired();
		return e.createCommand({
			category: u(i),
			keys: o,
			title: n,
			shortcut: "",
			jslogContext: A(`${t.name}-${r}`),
			executeHandler: () => {
				if (t.deprecation?.disabled && (!t.deprecation?.experiment || t.deprecation.experiment.isEnabled())) {
					a(t);
					return;
				}
				t.set(r), t.name === "emulate-page-focus" && x.actionTaken(C.ToggleEmulateFocusedPageFromCommandMenu), s && g.instance().displayReloadRequiredWarning(q(K.settingsChangedReloadDevTools));
			},
			availableHandler: c,
			deprecationWarning: t.deprecation?.warning
		});
		function c() {
			return t.get() !== r;
		}
	}
	static createActionCommand(t) {
		let { action: n, userActionCode: r } = t, i = n.category();
		if (!i) throw Error(`Creating '${n.title()}' action command failed. Action has no category.`);
		let a;
		i === _e.DRAWER && (a = "DRAWER");
		let o = ne.instance().shortcutTitleForAction(n.id()) || "";
		return e.createCommand({
			category: ve(i),
			keys: n.tags() || "",
			title: n.title(),
			shortcut: o,
			jslogContext: n.id(),
			executeHandler: n.execute.bind(n),
			userActionCode: r,
			isPanelOrDrawer: a
		});
	}
	static createRevealViewCommand(t) {
		let { title: n, tags: r, category: i, userActionCode: a, id: o, featurePromotionId: s } = t;
		if (!i) throw Error(`Creating '${n}' reveal view command failed. Reveal view has no category.`);
		let c;
		return i === h.PANEL ? c = "PANEL" : i === h.DRAWER && (c = "DRAWER"), e.createCommand({
			category: ie(i),
			keys: r,
			title: n,
			shortcut: "",
			jslogContext: o,
			executeHandler: () => (o === "issues-pane" && x.issuesPanelOpenedFrom(me.COMMAND_MENU), s && y.instance().recordFeatureInteraction(s), S.instance().showView(o, !0)),
			userActionCode: a,
			isPanelOrDrawer: c,
			featurePromotionId: s
		});
	}
	loadCommands() {
		let t = /* @__PURE__ */ new Map();
		for (let { category: e, name: n } of se()) e && n && t.set(n, e);
		let n = S.instance().getRegisteredViewExtensions();
		for (let r of n) {
			let n = r.location(), i = n && t.get(n);
			if (!i) continue;
			let a = {
				title: r.commandPrompt(),
				tags: r.tags() || "",
				category: i,
				id: r.viewId(),
				featurePromotionId: r.featurePromotionId()
			};
			this.#e.push(e.createRevealViewCommand(a));
		}
		let r = l.instance().getRegisteredSettings();
		for (let t of r) {
			let n = t.options;
			if (n && t.category) for (let r of n) {
				let n = l.instance().moduleSetting(t.settingName);
				this.#e.push(e.createSettingCommand(n, r.title(), r.value));
			}
		}
	}
	commands() {
		return this.#e;
	}
}, X = /* @__PURE__ */ function(e) {
	return e.PANEL = "PANEL", e.DRAWER = "DRAWER", e;
}({}), Z = class extends z {
	commands;
	constructor(e = []) {
		super(), this.commands = e;
	}
	attach() {
		let e = Y.instance().commands(), t = ye.instance().availableActions();
		for (let e of t) e.category() && this.commands.push(Y.createActionCommand({ action: e }));
		for (let t of e) t.available() && (this.commands.find(({ title: e, category: n }) => e === t.title && n === t.category) || this.commands.push(t));
		this.commands = this.commands.sort(n);
		function n(e, t) {
			return k(e.category, t.category) || k(e.title, t.title);
		}
	}
	detach() {
		this.commands = [];
	}
	itemCount() {
		return this.commands.length;
	}
	itemKeyAt(e) {
		return this.commands[e].key;
	}
	itemScoreAt(e, t) {
		let n = this.commands[e], r = N.characterScore(t.toLowerCase(), n.title.toLowerCase()), i = n.featurePromotionId;
		return i && y.instance().canShowPromotion(i) ? (r = Number.MAX_VALUE, r) : (n.isPanelOrDrawer === "PANEL" ? r += 2 : n.isPanelOrDrawer === "DRAWER" && (r += 1), r);
	}
	renderItem(e, t) {
		let n = this.commands[e], r = n.featurePromotionId ? ce(n.featurePromotionId) : void 0, i = n.deprecationWarning;
		return _`
      <devtools-icon name=${Pe[n.category]}></devtools-icon>
      <div>
        <devtools-highlight type="markup" ranges=${R.getHighlightRanges(n.title, t, !0)}>
          ${n.title}
        </devtools-highlight>
        ${r ?? b}
        <div>${n.shortcut}</div>
        ${i ? _`
          <span class="deprecated-tag" title=${i}>
            ${q(K.deprecated)}
          </span>` : b}
      </div>
      <span class="tag">${n.category}</span>`;
	}
	jslogContextAt(e) {
		return this.commands[e].jslogContext;
	}
	selectItem(e, t) {
		e !== null && (this.commands[e].execute(), x.actionTaken(C.SelectCommandFromCommandMenu));
	}
	notFoundText() {
		return q(K.noCommandsFound);
	}
}, Pe = {
	Appearance: "palette",
	Console: "terminal",
	Debugger: "bug",
	Drawer: "keyboard-full",
	Elements: "code",
	Global: "global",
	Grid: "grid-on",
	Help: "help",
	Mobile: "devices",
	Navigation: "refresh",
	Network: "arrow-up-down",
	Panel: "frame",
	Performance: "performance",
	Persistence: "override",
	Recorder: "record-start",
	Rendering: "tonality",
	Resources: "bin",
	Screenshot: "photo-camera",
	Settings: "gear",
	Sources: "label"
}, Q = class {
	category;
	title;
	key;
	shortcut;
	jslogContext;
	deprecationWarning;
	isPanelOrDrawer;
	featurePromotionId;
	#e;
	#t;
	constructor(e, t, n, r, i, a, o, s, c, l) {
		this.category = e, this.title = t, this.key = e + "\0" + t + "\0" + n, this.shortcut = r, this.jslogContext = i, this.#e = a, this.#t = o, this.deprecationWarning = s, this.isPanelOrDrawer = c, this.featurePromotionId = l;
	}
	available() {
		return !this.#t || this.#t();
	}
	execute() {
		return this.#e();
	}
}, Fe = class {
	handleAction(e, t) {
		return ue.bringToFront(), G.show(">"), !0;
	}
};
V({
	prefix: ">",
	iconName: "chevron-right",
	provider: () => Promise.resolve(new Z()),
	helpTitle: () => q(K.runCommand),
	titlePrefix: () => q(K.run),
	titleSuggestion: () => q(K.command),
	jslogContext: "command"
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/legacy/components/quick_open/HelpQuickOpen.ts
var Ie = /* @__PURE__ */ e({ HelpQuickOpen: () => $ }), $ = class extends z {
	providers;
	constructor() {
		super(), this.providers = [], H().forEach(this.addProvider.bind(this));
	}
	async addProvider(e) {
		e.prefix !== "?" && this.providers.push({
			prefix: e.prefix || "",
			iconName: e.iconName,
			title: e.helpTitle(),
			jslogContext: e.jslogContext
		});
	}
	itemCount() {
		return this.providers.length;
	}
	itemKeyAt(e) {
		return this.providers[e].prefix;
	}
	itemScoreAt(e, t) {
		return -this.providers[e].prefix.length;
	}
	renderItem(e, t) {
		let n = this.providers[e];
		return _`
      <devtools-icon class="large" name=${n.iconName}></devtools-icon>
      <div>
        <div>${n.title}</div>
      </div>`;
	}
	jslogContextAt(e) {
		return this.providers[e].jslogContext;
	}
	selectItem(e, t) {
		e !== null && G.show(this.providers[e].prefix);
	}
};
V({
	prefix: "?",
	iconName: "help",
	provider: () => Promise.resolve(new $()),
	helpTitle: () => "Help",
	titlePrefix: () => "Help",
	jslogContext: "help"
});
//#endregion
export { R as a, V as c, Oe as i, Me as n, Te as o, G as r, z as s, Ie as t };
