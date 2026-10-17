import { n as e } from "./rolldown-runtime-DF993M8W.js";
import { $ as t, D as n, H as r, I as i, J as a, K as o, L as s, P as c, Q as l, Wt as u, X as d, Y as f, Zt as ee, en as p, i as m, ot as h, qt as te, v as ne, x as g } from "./common-DMSVbaSb.js";
import { $i as re, $n as ie, C as ae, Cl as oe, Cs as se, D as ce, Dp as le, Dt as ue, Fo as de, Ho as fe, Hr as pe, Jt as me, Mo as he, Mp as ge, O as _e, Or as ve, Po as ye, Qn as be, Sl as xe, Ss as Se, St as Ce, Tl as _, Ur as v, Xi as we, Xl as Te, Xn as y, Xr as Ee, Yn as De, Yo as Oe, Zs as ke, _ as Ae, _o as je, _r as Me, bn as Ne, br as Pe, ct as Fe, ei as b, el as Ie, er as Le, fa as x, ff as Re, fo as ze, fp as Be, gr as Ve, hn as He, i as Ue, ja as We, jd as S, jo as Ge, jp as Ke, kd as qe, kr as Je, mo as Ye, n as Xe, na as Ze, nc as Qe, ni as $e, nl as et, no as tt, o as nt, pf as rt, qa as it, rn as at, so as ot, tn as st, ui as ct, un as lt, ur as ut, ut as dt, wl as C, wn as ft, x as pt, xn as mt, xs as ht, yr as gt } from "./legacy-dM_vujv7.js";
import "./platform-D4TUCh2P.js";
import { F as _t, I as vt, c as yt } from "./StringUtilities-CMDxNrEc.js";
import { n as w, t as bt } from "./theme_support-BJ6jI25-.js";
import { a as xt, o as St, s as Ct, t as wt } from "./bindings-DyamxTH2.js";
import { C as T } from "./common-Bs7hSOUj.js";
import { m as Tt } from "./elements-CiWscFTo.js";
import { t as Et } from "./object_ui-Dj5WXMwl.js";
import { $t as Dt, en as Ot } from "./snackbars-Dq3yf1tP.js";
import { t as kt } from "./objectValue.css-JafYDKlR.js";
import { c as At, d as E, l as jt, n as Mt, u as D } from "./data_grid-C6uthMeA.js";
import { n as Nt } from "./settings_ui-B3VIsMZM.js";
import { A as Pt, E as Ft, F as It, L as Lt, O as Rt, c as zt, d as Bt, u as Vt } from "./perf_ui-B15al1e8.js";
import { c as Ht, f as Ut, h as Wt, l as Gt, n as Kt, o as O, p as k, u as qt, v as Jt, y as Yt } from "./heap_snapshot-CTdRQlts.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/profiler/ProfileDataGrid.ts
var Xt = /* @__PURE__ */ e({
	ProfileDataGridNode: () => A,
	ProfileDataGridTree: () => en
}), Zt = {
	notOptimizedS: "Not optimized: {PH1}",
	genericTextTwoPlaceholders: "{PH1}, {PH2}"
}, Qt = o("panels/profiler/ProfileDataGrid.ts", Zt), $t = r.bind(void 0, Qt), A = class e extends jt {
	searchMatchedSelfColumn;
	searchMatchedTotalColumn;
	searchMatchedFunctionColumn;
	profileNode;
	tree;
	childrenByCallUID;
	lastComparator;
	callUID;
	self;
	total;
	functionName;
	deoptReason;
	url;
	linkElement;
	populated;
	savedSelf;
	savedTotal;
	savedChildren;
	constructor(e, t, n) {
		super(null, n), this.searchMatchedSelfColumn = !1, this.searchMatchedTotalColumn = !1, this.searchMatchedFunctionColumn = !1, this.profileNode = e, this.tree = t, this.childrenByCallUID = /* @__PURE__ */ new Map(), this.lastComparator = null, this.callUID = e.callUID, this.self = e.self, this.total = e.total, this.functionName = at(e.functionName), this.deoptReason = e.deoptReason || "", this.url = e.url, this.linkElement = null, this.populated = !1;
	}
	static sort(e, t, n) {
		for (let r = 0; r < e.length; ++r) {
			let i = e[r], a = i.length;
			for (let r = 0; r < a; ++r) {
				let a = i[r];
				if (!n && (!a.expanded || a.lastComparator === t)) {
					a.children.length && (a.shouldRefreshChildren = !0);
					continue;
				}
				a.lastComparator = t;
				let o = a.children, s = o.length;
				if (s) {
					o.sort(t);
					for (let e = 0; e < s; ++e) o[e].recalculateSiblings(e);
					e.push(o);
				}
			}
		}
	}
	static merge(e, t, n) {
		e.self += t.self, n || (e.total += t.total);
		let r = e.children.slice();
		e.removeChildren();
		let i = r.length;
		for (let a = 0; a < i; ++a) (!n || r[a] !== t) && e.appendChild(r[a]);
		r = t.children.slice(), i = r.length;
		for (let t = 0; t < i; ++t) {
			let n = r[t], i = e.childrenByCallUID.get(n.callUID);
			i ? i.merge(n, !1) : e.appendChild(n);
		}
	}
	static populate(e) {
		if (e.populated) return;
		e.populated = !0, e.populateChildren();
		let t = e.tree.lastComparator;
		t && e.sort(t, !0);
	}
	createCell(e) {
		switch (e) {
			case "self": {
				let t = this.createValueCell(this.self, this.selfPercent, e);
				return t.classList.toggle("highlight", this.searchMatchedSelfColumn), t;
			}
			case "total": {
				let t = this.createValueCell(this.total, this.totalPercent, e);
				return t.classList.toggle("highlight", this.searchMatchedTotalColumn), t;
			}
			case "function": {
				let t = this.createTD(e);
				if (t.classList.toggle("highlight", this.searchMatchedFunctionColumn), this.deoptReason) {
					t.classList.add("not-optimized");
					let e = new Ge();
					e.name = "warning-filled", e.classList.add("profile-warn-marker", "small"), v.install(e, $t(Zt.notOptimizedS, { PH1: this.deoptReason })), t.appendChild(e);
				}
				if (mt(t, this.functionName), this.profileNode.scriptId === "0") return t;
				let n = this.tree.formatter.linkifyNode(this);
				return n ? (n.style.maxWidth = "75%", t.appendChild(n), this.linkElement = n, t) : t;
			}
		}
		return super.createCell(e);
	}
	createValueCell(e, t, n) {
		let r = document.createElement("td");
		r.classList.add("numeric-column");
		let i = r.createChild("div", "profile-multiple-values"), a = i.createChild("span");
		a.textContent = this.tree.formatter.formatValue(e, this);
		let o = i.createChild("span", "percent-column"), s = this.tree.formatter.formatPercent(t, this);
		o.textContent = s;
		let c = this.tree.formatter.formatValueAccessibleText(e, this);
		return this.setCellAccessibleName($t(Zt.genericTextTwoPlaceholders, {
			PH1: c,
			PH2: s
		}), r, n), r;
	}
	sort(t, n) {
		let r = t;
		return e.sort([[this]], r, n);
	}
	insertChild(e, t) {
		let n = e;
		super.insertChild(n, t), this.childrenByCallUID.set(n.callUID, n);
	}
	removeChild(e) {
		super.removeChild(e), this.childrenByCallUID.delete(e.callUID);
	}
	removeChildren() {
		super.removeChildren(), this.childrenByCallUID.clear();
	}
	findChild(e) {
		return e && this.childrenByCallUID.get(e.callUID) || null;
	}
	get selfPercent() {
		return this.self / this.tree.total * 100;
	}
	get totalPercent() {
		return this.total / this.tree.total * 100;
	}
	populate() {
		e.populate(this);
	}
	populateChildren() {}
	save() {
		this.savedChildren ||= (this.savedSelf = this.self, this.savedTotal = this.total, this.children.slice());
	}
	restore() {
		if (!this.savedChildren) return;
		this.savedSelf && this.savedTotal && (this.self = this.savedSelf, this.total = this.savedTotal), this.removeChildren();
		let e = this.savedChildren, t = e.length;
		for (let n = 0; n < t; ++n) e[n].restore(), this.appendChild(e[n]);
	}
	merge(t, n) {
		e.merge(this, t, n);
	}
}, en = class {
	tree;
	self;
	children;
	formatter;
	searchableView;
	total;
	lastComparator;
	childrenByCallUID;
	deepSearch;
	populated;
	searchResults;
	savedTotal;
	savedChildren;
	searchResultIndex = -1;
	constructor(e, t, n) {
		this.tree = this, this.self = 0, this.children = [], this.formatter = e, this.searchableView = t, this.total = n, this.lastComparator = null, this.childrenByCallUID = /* @__PURE__ */ new Map(), this.deepSearch = !0, this.populated = !1;
	}
	static propertyComparator(e, t) {
		let n = tn[+!!t][e];
		return n || (n = t ? function(t, n) {
			return t[e] < n[e] ? -1 : +(t[e] > n[e]);
		} : function(t, n) {
			return t[e] > n[e] ? -1 : +(t[e] < n[e]);
		}, tn[+!!t][e] = n), n;
	}
	get expanded() {
		return !0;
	}
	appendChild(e) {
		this.insertChild(e, this.children.length);
	}
	focus(e) {}
	exclude(e) {}
	insertChild(e, t) {
		let n = e;
		this.children.splice(t, 0, n), this.childrenByCallUID.set(n.callUID, e);
	}
	removeChildren() {
		this.children = [], this.childrenByCallUID.clear();
	}
	populateChildren() {}
	findChild(e) {
		return e && this.childrenByCallUID.get(e.callUID) || null;
	}
	sort(e, t) {
		return A.sort([[this]], e, t);
	}
	save() {
		this.savedChildren ||= (this.savedTotal = this.total, this.children.slice());
	}
	restore() {
		if (!this.savedChildren) return;
		this.children = this.savedChildren, this.savedTotal && (this.total = this.savedTotal);
		let e = this.children, t = e.length;
		for (let n = 0; n < t; ++n) e[n].restore();
		this.savedChildren = null;
	}
	matchFunction(e) {
		let t = e.query.trim();
		if (!t.length) return null;
		let n = t.startsWith(">"), r = t.startsWith("<"), i = t.startsWith("=") || (n || r) && t.indexOf("=") === 1, a = t.endsWith("%"), o = t.length > 2 && t.endsWith("ms"), s = !o && t.endsWith("s"), c = parseFloat(t);
		(n || r || i) && (c = parseFloat(i && (n || r) ? t.substring(2) : t.substring(1)));
		let l = s ? c * 1e3 : c;
		!isNaN(c) && !(n || r) && (i = !0);
		let u = yt(t, "i");
		function d(e) {
			return e.searchMatchedSelfColumn = !1, e.searchMatchedTotalColumn = !1, e.searchMatchedFunctionColumn = !1, a ? (r ? (e.selfPercent < c && (e.searchMatchedSelfColumn = !0), e.totalPercent < c && (e.searchMatchedTotalColumn = !0)) : n && (e.selfPercent > c && (e.searchMatchedSelfColumn = !0), e.totalPercent > c && (e.searchMatchedTotalColumn = !0)), i && (e.selfPercent === c && (e.searchMatchedSelfColumn = !0), e.totalPercent === c && (e.searchMatchedTotalColumn = !0))) : (o || s) && (r ? (e.self < l && (e.searchMatchedSelfColumn = !0), e.total < l && (e.searchMatchedTotalColumn = !0)) : n && (e.self > l && (e.searchMatchedSelfColumn = !0), e.total > l && (e.searchMatchedTotalColumn = !0)), i && (e.self === l && (e.searchMatchedSelfColumn = !0), e.total === l && (e.searchMatchedTotalColumn = !0))), (e.functionName.match(u) || e.url && e.url.match(u)) && (e.searchMatchedFunctionColumn = !0), e.searchMatchedSelfColumn || e.searchMatchedTotalColumn || e.searchMatchedFunctionColumn ? (e.refresh(), !0) : !1;
		}
		return d;
	}
	performSearch(e, t, n) {
		this.onSearchCanceled();
		let r = this.matchFunction(e);
		if (!r) return;
		this.searchResults = [];
		let i = this.deepSearch, a;
		for (a = this.children[0]; a; a = a.traverseNextNode(!i, null, !i)) {
			let e = a;
			if (!e) break;
			r(e) && this.searchResults.push({ profileNode: e });
		}
		this.searchResultIndex = n ? 0 : this.searchResults.length - 1, this.searchableView.updateSearchMatchesCount(this.searchResults.length), this.searchableView.updateCurrentMatchIndex(this.searchResultIndex);
	}
	onSearchCanceled() {
		if (this.searchResults) for (let e = 0; e < this.searchResults.length; ++e) {
			let t = this.searchResults[e].profileNode;
			t.searchMatchedSelfColumn = !1, t.searchMatchedTotalColumn = !1, t.searchMatchedFunctionColumn = !1, t.refresh();
		}
		this.searchResults = [], this.searchResultIndex = -1;
	}
	jumpToNextSearchResult() {
		this.searchResults?.length && (this.searchResultIndex = (this.searchResultIndex + 1) % this.searchResults.length, this.jumpToSearchResult(this.searchResultIndex));
	}
	jumpToPreviousSearchResult() {
		this.searchResults?.length && (this.searchResultIndex = (this.searchResultIndex - 1 + this.searchResults.length) % this.searchResults.length, this.jumpToSearchResult(this.searchResultIndex));
	}
	supportsCaseSensitiveSearch() {
		return !0;
	}
	supportsWholeWordSearch() {
		return !1;
	}
	supportsRegexSearch() {
		return !1;
	}
	jumpToSearchResult(e) {
		let t = this.searchResults[e];
		t && (t.profileNode.revealAndSelect(), this.searchableView.updateCurrentMatchIndex(e));
	}
}, tn = [{}, {}], nn = /* @__PURE__ */ e({
	BottomUpProfileDataGridNode: () => rn,
	BottomUpProfileDataGridTree: () => an
}), rn = class e extends A {
	remainingNodeInfos;
	constructor(e, t) {
		super(e, t, e.parent !== null && !!e.parent.parent), this.remainingNodeInfos = [];
	}
	static sharedPopulate(t) {
		if (t.remainingNodeInfos === void 0) return;
		let n = t.remainingNodeInfos, r = n.length;
		for (let i = 0; i < r; ++i) {
			let r = n[i], a = r.ancestor, o = r.focusNode, s = t.findChild(a);
			if (s) {
				let e = r.totalAccountedFor;
				s.self += o.self, e || (s.total += o.total);
			} else s = new e(a, t.tree), a !== o && (s.self = o.self, s.total = o.total), t.appendChild(s);
			let c = a.parent;
			c?.parent && (r.ancestor = c, s.remainingNodeInfos || (s.remainingNodeInfos = []), s.remainingNodeInfos.push(r));
		}
		delete t.remainingNodeInfos;
	}
	takePropertiesFromProfileDataGridNode(e) {
		this.save(), this.self = e.self, this.total = e.total;
	}
	keepOnlyChild(e) {
		this.save(), this.removeChildren(), this.appendChild(e);
	}
	exclude(e) {
		this.remainingNodeInfos && this.populate(), this.save();
		let t = this.children, n = this.children.length;
		for (; n--;) t[n].exclude(e);
		let r = this.childrenByCallUID.get(e);
		r && this.merge(r, !0);
	}
	restore() {
		super.restore(), this.children.length || this.setHasChildren(this.willHaveChildren(this.profileNode));
	}
	merge(e, t) {
		this.self -= e.self, super.merge(e, t);
	}
	populateChildren() {
		e.sharedPopulate(this);
	}
	willHaveChildren(e) {
		return !!e.parent?.parent;
	}
}, an = class extends en {
	deepSearch;
	remainingNodeInfos;
	constructor(e, t, n, r) {
		super(e, t, r), this.deepSearch = !1;
		let i = 0, a = [[], [n]], o = /* @__PURE__ */ new Map();
		this.remainingNodeInfos = [];
		for (let e = 0; e < a.length; ++e) {
			let t = a[e], n = a[++e], r = n.length, s = /* @__PURE__ */ new WeakMap();
			for (let e = 0; e < r; ++e) {
				let r = n[e];
				if (s.get(r) || s.set(r, ++i), r.parent) {
					let e = o.get(r.callUID), n = !1;
					if (!e) e = /* @__PURE__ */ new Set(), o.set(r.callUID, e);
					else {
						let r = t.length;
						for (let i = 0; i < r; ++i) {
							let r = s.get(t[i]);
							if (r && e.has(r)) {
								n = !0;
								break;
							}
						}
					}
					let i = s.get(r);
					i && e.add(i), this.remainingNodeInfos.push({
						ancestor: r,
						focusNode: r,
						totalAccountedFor: n
					});
				}
				let c = r.children;
				c.length && (a.push(t.concat([r])), a.push(c));
			}
		}
		return A.populate(this), this;
	}
	focus(e) {
		if (!e) return;
		this.save();
		let t = e, n = e;
		for (; t.parent && t instanceof rn;) t.takePropertiesFromProfileDataGridNode(e), n = t, t = t.parent, t instanceof rn && t.keepOnlyChild(n);
		this.children = [n], this.total = e.total;
	}
	exclude(e) {
		if (!e) return;
		this.save();
		let t = e.callUID, n = this.childrenByCallUID.get(t);
		n && ee(this.children, n);
		let r = this.children, i = r.length;
		for (let e = 0; e < i; ++e) r[e].exclude(t);
		this.lastComparator && this.sort(this.lastComparator, !0);
	}
	populateChildren() {
		rn.sharedPopulate(this);
	}
}, on = {
	detachedNodes: "Detached nodes",
	nodeSize: "Node count",
	detachedElementsList: "Detached elements list"
}, sn = o("panels/profiler/HeapDetachedElementsDataGrid.ts", on), cn = r.bind(void 0, sn), ln = class extends At {
	constructor() {
		let e = [];
		e.push({
			id: "detached-node",
			title: cn(on.detachedNodes),
			sortable: !1
		}), e.push({
			id: "detached-node-count",
			title: cn(on.nodeSize),
			sortable: !1,
			disclosure: !0
		}), super({
			displayName: cn(on.detachedElementsList),
			columns: e
		}), this.setStriped(!0);
	}
}, un = class extends jt {
	detachedElementInfo;
	domModel;
	retainedNodeIds = /* @__PURE__ */ new Set();
	constructor(e, t) {
		super(null), this.detachedElementInfo = e, this.domModel = t;
		for (let t of e.retainedNodeIds) this.retainedNodeIds.add(t);
	}
	createCell(e) {
		let t = this.createTD(e);
		switch (e) {
			case "detached-node": {
				let e = et.create(this.domModel, null, !1, this.detachedElementInfo.treeNode, this.retainedNodeIds);
				return e.detached = !0, this.#t(e, t), t;
			}
			case "detached-node-count": {
				let e = this.#e(this.detachedElementInfo);
				return mt(t, e.toString()), t;
			}
		}
		return t;
	}
	#e(e) {
		let t = 1, n = [], r;
		for (n.push(e.treeNode); n.length > 0 && (r = n.shift(), r);) if (r.childNodeCount && (t += r.childNodeCount), r.children) for (let e of r.children) n.push(e);
		return t;
	}
	#t(e, t) {
		let n = new Tt();
		n.omitRootDOMNode = !1, n.selectEnabled = !0, n.hideGutter = !0, n.rootDOMNode = e, n.showSelectionOnKeyboardFocus = !0, n.preventTabOrder = !0, n.deindentSingleNode = !0, n.show(t, void 0, !0);
	}
}, dn = /* @__PURE__ */ e({
	Events: () => M,
	ProfileEvents: () => N,
	ProfileHeader: () => j,
	ProfileType: () => pn,
	StatusUpdate: () => fn
}), j = class extends l {
	#e;
	title;
	uid;
	#t = !1;
	tempFile = null;
	constructor(e, t) {
		super(), this.#e = e, this.title = t, this.uid = e.incrementProfileUid();
	}
	setTitle(e) {
		this.title = e, this.dispatchEventToListeners("ProfileTitleChanged", this);
	}
	profileType() {
		return this.#e;
	}
	updateStatus(e, t) {
		this.dispatchEventToListeners("UpdateStatus", new fn(e, t));
	}
	removeTempFile() {
		this.tempFile && this.tempFile.remove();
	}
	dispose() {}
	canSaveToFile() {
		return !1;
	}
	saveToFile() {
		throw Error("Not implemented.");
	}
	loadFromFile(e) {
		throw Error("Not implemented.");
	}
	fromFile() {
		return this.#t;
	}
	setFromFile() {
		this.#t = !0;
	}
	setProfile(e) {}
}, fn = class {
	subtitle;
	wait;
	constructor(e, t) {
		this.subtitle = e, this.wait = t;
	}
}, M = /* @__PURE__ */ function(e) {
	return e.UPDATE_STATUS = "UpdateStatus", e.PROFILE_TITLE_CHANGED = "ProfileTitleChanged", e;
}({}), pn = class extends l {
	#e;
	#t;
	profiles = [];
	#n = null;
	#r = 1;
	constructor(e, t) {
		super(), this.#e = e, this.#t = t, window.opener || window.addEventListener("pagehide", this.clearTempStorage.bind(this), !1);
	}
	typeName() {
		return "";
	}
	nextProfileUid() {
		return this.#r;
	}
	incrementProfileUid() {
		return this.#r++;
	}
	hasTemporaryView() {
		return !1;
	}
	fileExtension() {
		return null;
	}
	get buttonTooltip() {
		return "";
	}
	get id() {
		return this.#e;
	}
	get treeItemTitle() {
		return this.#t;
	}
	get name() {
		return this.#t;
	}
	buttonClicked() {
		return !1;
	}
	get description() {
		return "";
	}
	isInstantProfile() {
		return !1;
	}
	isEnabled() {
		return !0;
	}
	getProfiles() {
		return this.profiles.filter((e) => this.#n !== e);
	}
	customContent() {
		return null;
	}
	setCustomContentEnabled(e) {}
	loadFromFile(e) {
		let t = e.name, n = this.fileExtension();
		n && t.endsWith(n) && (t = t.substr(0, t.length - n.length));
		let r = this.createProfileLoadedFromFile(t);
		return r.setFromFile(), this.setProfileBeingRecorded(r), this.addProfile(r), r.loadFromFile(e);
	}
	createProfileLoadedFromFile(e) {
		throw Error("Not implemented");
	}
	addProfile(e) {
		this.profiles.push(e), this.dispatchEventToListeners("add-profile-header", e);
	}
	removeProfile(e) {
		let t = this.profiles.indexOf(e);
		t !== -1 && (this.profiles.splice(t, 1), this.disposeProfile(e));
	}
	clearTempStorage() {
		for (let e = 0; e < this.profiles.length; ++e) this.profiles[e].removeTempFile();
	}
	profileBeingRecorded() {
		return this.#n;
	}
	setProfileBeingRecorded(e) {
		this.#n = e;
	}
	profileBeingRecordedRemoved() {}
	reset() {
		for (let e of this.profiles.slice()) this.disposeProfile(e);
		this.profiles = [], this.#r = 1;
	}
	disposeProfile(e) {
		this.dispatchEventToListeners("remove-profile-header", e), e.dispose(), this.#n === e && (this.profileBeingRecordedRemoved(), this.setProfileBeingRecorded(null));
	}
}, N = /* @__PURE__ */ function(e) {
	return e.ADD_PROFILE_HEADER = "add-profile-header", e.PROFILE_COMPLETE = "profile-complete", e.REMOVE_PROFILE_HEADER = "remove-profile-header", e.VIEW_UPDATED = "view-updated", e;
}({}), mn = /* @__PURE__ */ e({
	OverviewCalculator: () => vn,
	OverviewPane: () => yn,
	OverviewPaneEvents: () => bn,
	ProfileFlameChart: () => _n,
	ProfileFlameChartDataProvider: () => gn
}), hn = null, gn = class e {
	#e;
	maxStackDepthInternal;
	timelineDataInternal;
	entryNodes;
	#t;
	boldFont;
	constructor() {
		this.#e = e.colorGenerator(), this.maxStackDepthInternal = 0, this.timelineDataInternal = null, this.entryNodes = [], this.#t = `${It} ${Lt()}`;
	}
	static colorGenerator() {
		return hn || (hn = new h({
			min: 30,
			max: 330
		}, {
			min: 50,
			max: 80,
			count: 5
		}, {
			min: 80,
			max: 90,
			count: 3
		}), hn.setColorForID("(idle)", "hsl(0, 0%, 94%)"), hn.setColorForID("(program)", "hsl(0, 0%, 80%)"), hn.setColorForID("(garbage collector)", "hsl(0, 0%, 80%)")), hn;
	}
	minimumBoundary() {
		throw Error("Not implemented");
	}
	totalTime() {
		throw Error("Not implemented");
	}
	formatValue(e, t) {
		return c(e, t);
	}
	maxStackDepth() {
		return this.maxStackDepthInternal;
	}
	hasTrackConfigurationMode() {
		return !1;
	}
	timelineData() {
		return this.timelineDataInternal || this.calculateTimelineData();
	}
	calculateTimelineData() {
		throw Error("Not implemented");
	}
	preparePopoverElement(e) {
		throw Error("Not implemented");
	}
	canJumpToEntry(e) {
		return this.entryNodes[e].scriptId !== "0";
	}
	entryTitle(e) {
		let t = this.entryNodes[e];
		return at(t.functionName);
	}
	entryFont(e) {
		let t = "bold " + this.#t;
		return this.entryHasDeoptReason(e) ? t : this.#t;
	}
	entryHasDeoptReason(e) {
		throw Error("Not implemented");
	}
	entryColor(e) {
		let t = this.entryNodes[e];
		return this.#e.colorForID(t.url || (t.scriptId === "0" ? t.functionName : t.scriptId));
	}
	decorateEntry(e, t, n, r, i, a, o) {
		return !1;
	}
	forceDecoration(e) {
		return !1;
	}
	textColor(e) {
		return "#333";
	}
	entryNodesLength() {
		return this.entryNodes.length;
	}
}, _n = class extends t(b) {
	searchableView;
	overviewPane;
	mainPane;
	entrySelected;
	dataProvider;
	searchResults;
	searchResultIndex = -1;
	constructor(e, t) {
		super(), this.element.id = "cpu-flame-chart", this.searchableView = e, this.overviewPane = new yn(t), this.overviewPane.show(this.element), this.mainPane = new Rt(t, this.overviewPane), this.mainPane.setBarHeight(15), this.mainPane.setTextBaseline(4), this.mainPane.setTextPadding(2), this.mainPane.show(this.element), this.mainPane.addEventListener(Ft.ENTRY_SELECTED, this.onEntrySelected, this), this.mainPane.addEventListener(Ft.ENTRY_INVOKED, this.onEntryInvoked, this), this.entrySelected = !1, this.mainPane.addEventListener(Ft.CANVAS_FOCUSED, this.onEntrySelected, this), this.overviewPane.addEventListener("WindowChanged", this.onWindowChanged, this), this.dataProvider = t, this.searchResults = [];
	}
	focus() {
		this.mainPane.focus();
	}
	onWindowChanged(e) {
		let { windowTimeLeft: t, windowTimeRight: n } = e.data;
		this.mainPane.setWindowTimes(t, n, !0);
	}
	selectRange(e, t) {
		this.overviewPane.selectRange(e, t);
	}
	onEntrySelected(e) {
		if (e.data) {
			let t = e.data;
			this.mainPane.setSelectedEntry(t), this.entrySelected = t !== -1;
		} else this.entrySelected ||= (this.mainPane.setSelectedEntry(0), !0);
	}
	onEntryInvoked(e) {
		this.onEntrySelected(e), this.dispatchEventToListeners(Ft.ENTRY_INVOKED, e.data);
	}
	update() {
		this.overviewPane.update(), this.mainPane.update();
	}
	performSearch(e, t, n) {
		let r = yt(e.query, e.caseSensitive ? "" : "i"), i = this.searchResultIndex === -1 ? -1 : this.searchResults[this.searchResultIndex];
		this.searchResults = [];
		let a = this.dataProvider.entryNodesLength();
		for (let e = 0; e < a; ++e) this.dataProvider.entryTitle(e).match(r) && this.searchResults.push(e);
		this.searchResults.length ? (this.searchResultIndex = this.searchResults.indexOf(i), this.searchResultIndex === -1 && (this.searchResultIndex = n ? this.searchResults.length - 1 : 0), this.mainPane.setSelectedEntry(this.searchResults[this.searchResultIndex])) : this.onSearchCanceled(), this.searchableView.updateSearchMatchesCount(this.searchResults.length), this.searchableView.updateCurrentMatchIndex(this.searchResultIndex);
	}
	onSearchCanceled() {
		this.mainPane.setSelectedEntry(-1), this.searchResults = [], this.searchResultIndex = -1;
	}
	jumpToNextSearchResult() {
		this.searchResultIndex = (this.searchResultIndex + 1) % this.searchResults.length, this.mainPane.setSelectedEntry(this.searchResults[this.searchResultIndex]), this.searchableView.updateCurrentMatchIndex(this.searchResultIndex);
	}
	jumpToPreviousSearchResult() {
		this.searchResultIndex = (this.searchResultIndex - 1 + this.searchResults.length) % this.searchResults.length, this.mainPane.setSelectedEntry(this.searchResults[this.searchResultIndex]), this.searchableView.updateCurrentMatchIndex(this.searchResultIndex);
	}
	supportsCaseSensitiveSearch() {
		return !0;
	}
	supportsWholeWordSearch() {
		return !1;
	}
	supportsRegexSearch() {
		return !1;
	}
}, vn = class {
	formatter;
	minimumBoundaries;
	maximumBoundaries;
	xScaleFactor;
	constructor(e) {
		this.formatter = e;
	}
	updateBoundaries(e) {
		this.minimumBoundaries = e.dataProvider.minimumBoundary();
		let t = e.dataProvider.totalTime();
		this.maximumBoundaries = this.minimumBoundaries + t, this.xScaleFactor = e.overviewContainer.clientWidth / t;
	}
	computePosition(e) {
		return (e - this.minimumBoundaries) * this.xScaleFactor;
	}
	formatValue(e, t) {
		return this.formatter(e - this.minimumBoundaries, t);
	}
	maximumBoundary() {
		return this.maximumBoundaries;
	}
	minimumBoundary() {
		return this.minimumBoundaries;
	}
	zeroTime() {
		return this.minimumBoundaries;
	}
	boundarySpan() {
		return this.maximumBoundaries - this.minimumBoundaries;
	}
}, yn = class extends t(b) {
	overviewContainer;
	overviewCalculator;
	overviewGrid;
	overviewCanvas;
	dataProvider;
	windowTimeLeft;
	windowTimeRight;
	updateTimerId;
	constructor(e) {
		super(), this.element.classList.add("cpu-profile-flame-chart-overview-pane"), this.overviewContainer = this.element.createChild("div", "cpu-profile-flame-chart-overview-container"), this.overviewCalculator = new vn(e.formatValue), this.overviewGrid = new Bt("cpu-profile-flame-chart", this.overviewCalculator), this.overviewGrid.element.classList.add("fill"), this.overviewCanvas = this.overviewContainer.createChild("canvas", "cpu-profile-flame-chart-overview-canvas"), this.overviewContainer.appendChild(this.overviewGrid.element), this.dataProvider = e, this.overviewGrid.addEventListener(Vt.WINDOW_CHANGED_WITH_POSITION, this.onWindowChanged, this);
	}
	windowChanged(e, t) {
		this.selectRange(e, t);
	}
	updateRangeSelection(e, t) {}
	updateSelectedGroup(e, t) {}
	selectRange(e, t) {
		let n = this.dataProvider.minimumBoundary(), r = this.dataProvider.totalTime();
		this.overviewGrid.setWindowRatio((e - n) / r, (t - n) / r);
	}
	onWindowChanged(e) {
		let t = {
			windowTimeLeft: e.data.rawStartValue,
			windowTimeRight: e.data.rawEndValue
		};
		this.windowTimeLeft = t.windowTimeLeft, this.windowTimeRight = t.windowTimeRight, this.dispatchEventToListeners("WindowChanged", t);
	}
	timelineData() {
		return this.dataProvider.timelineData();
	}
	onResize() {
		this.scheduleUpdate();
	}
	scheduleUpdate() {
		this.updateTimerId ||= this.element.window().requestAnimationFrame(this.update.bind(this));
	}
	update() {
		this.updateTimerId = 0, this.timelineData() && (this.resetCanvas(this.overviewContainer.clientWidth, this.overviewContainer.clientHeight - 15), this.overviewCalculator.updateBoundaries(this), this.overviewGrid.updateDividers(this.overviewCalculator), this.drawOverviewCanvas());
	}
	drawOverviewCanvas() {
		let e = this.overviewCanvas.width, t = this.overviewCanvas.height, n = this.calculateDrawData(e), r = this.overviewCanvas.getContext("2d");
		if (!r) throw Error("Failed to get canvas context");
		let i = window.devicePixelRatio, a = t / (this.dataProvider.maxStackDepth() * 1.1);
		r.lineWidth = 1, r.translate(.5, .5), r.strokeStyle = "rgba(20,0,0,0.4)", r.fillStyle = "rgba(214,225,254,0.8)", r.moveTo(-1, t + 1), r.lineTo(-1, Math.round(t - n[0] * a - i));
		let o = 0;
		for (let s = 0; s < e; ++s) o = Math.round(t - n[s] * a - i), r.lineTo(s, o);
		r.lineTo(e + 1, o), r.lineTo(e + 1, t + 1), r.fill(), r.stroke(), r.closePath();
	}
	calculateDrawData(e) {
		let t = this.dataProvider, n = this.timelineData(), r = n.entryStartTimes, i = n.entryTotalTimes, a = n.entryLevels, o = r.length, s = this.dataProvider.minimumBoundary(), c = new Uint8Array(e), l = e / t.totalTime();
		for (let e = 0; e < o; ++e) {
			let t = Math.floor((r[e] - s) * l), n = Math.floor((r[e] - s + i[e]) * l);
			for (let r = t; r <= n; ++r) c[r] = Math.max(c[r], a[e] + 1);
		}
		return c;
	}
	resetCanvas(e, t) {
		let n = window.devicePixelRatio;
		this.overviewCanvas.width = e * n, this.overviewCanvas.height = t * n, this.overviewCanvas.style.width = e + "px", this.overviewCanvas.style.height = t + "px";
	}
}, bn = /* @__PURE__ */ function(e) {
	return e.WINDOW_CHANGED = "WindowChanged", e;
}({}), xn = /* @__PURE__ */ e({
	TopDownProfileDataGridNode: () => Sn,
	TopDownProfileDataGridTree: () => Cn
}), Sn = class e extends A {
	remainingChildren;
	constructor(e, t) {
		let n = !!e.children?.length;
		super(e, t, n), this.remainingChildren = e.children;
	}
	static sharedPopulate(t) {
		let n = t.remainingChildren, r = n.length;
		for (let i = 0; i < r; ++i) t.appendChild(new e(n[i], t.tree));
		t.remainingChildren = [];
	}
	static excludeRecursively(t, n) {
		t.remainingChildren.length > 0 && t.populate(), t.save();
		let r = t.children, i = t.children.length;
		for (; i--;) e.excludeRecursively(r[i], n);
		let a = t.childrenByCallUID.get(n);
		a && A.merge(t, a, !0);
	}
	populateChildren() {
		e.sharedPopulate(this);
	}
}, Cn = class extends en {
	remainingChildren;
	constructor(e, t, n, r) {
		super(e, t, r), this.remainingChildren = n.children, A.populate(this);
	}
	focus(e) {
		e && (this.save(), e.savePosition(), this.children = [e], this.total = e.total);
	}
	exclude(e) {
		e && (this.save(), Sn.excludeRecursively(this, e.callUID), this.lastComparator && this.sort(this.lastComparator, !0));
	}
	restore() {
		this.savedChildren && (this.children[0].restorePosition(), super.restore());
	}
	populateChildren() {
		Sn.sharedPopulate(this);
	}
}, wn = /* @__PURE__ */ e({
	ProfileView: () => En,
	ViewTypes: () => Dn,
	WritableProfileHeader: () => On,
	maxLinkLength: () => 30
}), P = {
	profile: "Profile",
	findByCostMsNameOrFile: "Find by cost (>50ms), name or file",
	function: "Function",
	profiler: "Profiler",
	profileViewMode: "Profile view mode",
	focusSelectedFunction: "Focus selected function",
	excludeSelectedFunction: "Exclude selected function",
	restoreAllFunctions: "Restore all functions",
	chart: "Chart",
	heavyBottomUp: "Heavy (Bottom Up)",
	treeTopDown: "Tree (Top Down)",
	profileD: "Profile {PH1}",
	loadingD: "Loading… {PH1}%",
	fileSReadErrorS: "File ''{PH1}'' read error: {PH2}",
	loading: "Loading…",
	failedToReadFile: "Failed to read file",
	parsing: "Parsing…",
	loaded: "Loaded"
}, Tn = o("panels/profiler/ProfileView.ts", P), F = r.bind(void 0, Tn), En = class extends Xe {
	profileInternal;
	searchableViewInternal;
	dataGrid;
	viewSelectComboBox;
	focusButton;
	excludeButton;
	resetButton;
	linkifierInternal;
	nodeFormatter;
	viewType;
	adjustedTotal;
	profileHeader;
	bottomUpProfileDataGridTree;
	topDownProfileDataGridTree;
	currentSearchResultIndex;
	dataProvider;
	flameChart;
	visibleView;
	searchableElement;
	profileDataGridTree;
	constructor() {
		super({
			title: F(P.profile),
			viewId: "profile"
		}), this.profileInternal = null, this.searchableViewInternal = new Ae(this, null), this.searchableViewInternal.setPlaceholder(F(P.findByCostMsNameOrFile)), this.searchableViewInternal.show(this.element);
		let e = [];
		e.push({
			id: "self",
			title: this.columnHeader("self"),
			width: "120px",
			fixedWidth: !0,
			sortable: !0,
			sort: E.Descending
		}), e.push({
			id: "total",
			title: this.columnHeader("total"),
			width: "120px",
			fixedWidth: !0,
			sortable: !0
		}), e.push({
			id: "function",
			title: F(P.function),
			disclosure: !0,
			sortable: !0
		}), this.dataGrid = new At({
			displayName: F(P.profiler),
			columns: e
		}), this.dataGrid.addEventListener(D.SORTING_CHANGED, this.sortProfile, this), this.dataGrid.addEventListener(D.SELECTED_NODE, this.nodeSelected.bind(this, !0)), this.dataGrid.addEventListener(D.DESELECTED_NODE, this.nodeSelected.bind(this, !1)), this.dataGrid.setRowContextMenuCallback(this.populateContextMenu.bind(this)), this.viewSelectComboBox = new be(this.changeView.bind(this), F(P.profileViewMode), void 0, "profile-view.selected-view"), this.focusButton = new y(F(P.focusSelectedFunction), "eye", void 0, "profile-view.focus-selected-function"), this.focusButton.setEnabled(!1), this.focusButton.addEventListener(y.Events.CLICK, this.focusClicked, this), this.excludeButton = new y(F(P.excludeSelectedFunction), "cross", void 0, "profile-view.exclude-selected-function"), this.excludeButton.setEnabled(!1), this.excludeButton.addEventListener(y.Events.CLICK, this.excludeClicked, this), this.resetButton = new y(F(P.restoreAllFunctions), "refresh", void 0, "profile-view.restore-all-functions"), this.resetButton.setEnabled(!1), this.resetButton.addEventListener(y.Events.CLICK, this.resetClicked, this), this.linkifierInternal = new T(30);
	}
	static buildPopoverTable(e) {
		let t = document.createElement("table");
		for (let n of e) {
			let e = t.createChild("tr");
			e.createChild("td").textContent = n.title, e.createChild("td").textContent = n.value;
		}
		return t;
	}
	setProfile(e) {
		this.profileInternal = e, this.bottomUpProfileDataGridTree = null, this.topDownProfileDataGridTree = null, this.changeView(), this.refresh();
	}
	profile() {
		return this.profileInternal;
	}
	initialize(e) {
		this.nodeFormatter = e, this.viewType = m.instance().createSetting("profile-view", "Heavy");
		let t = [
			"Flame",
			"Heavy",
			"Tree"
		], n = /* @__PURE__ */ new Map([
			["Flame", F(P.chart)],
			["Heavy", F(P.heavyBottomUp)],
			["Tree", F(P.treeTopDown)]
		]), r = new Map(t.map((e) => [e, this.viewSelectComboBox.createOption(n.get(e), e)])), i = this.viewType.get() || t[0], a = r.get(i) || r.get(t[0]);
		this.viewSelectComboBox.select(a), this.changeView(), this.flameChart && this.flameChart.update();
	}
	focus() {
		this.flameChart ? this.flameChart.focus() : super.focus();
	}
	columnHeader(e) {
		throw Error("Not implemented");
	}
	selectRange(e, t) {
		this.flameChart && this.flameChart.selectRange(e, t);
	}
	async toolbarItems() {
		return [
			this.viewSelectComboBox,
			this.focusButton,
			this.excludeButton,
			this.resetButton
		];
	}
	getBottomUpProfileDataGridTree() {
		return this.bottomUpProfileDataGridTree ||= new an(this.nodeFormatter, this.searchableViewInternal, this.profileInternal.root, this.adjustedTotal), this.bottomUpProfileDataGridTree;
	}
	getTopDownProfileDataGridTree() {
		return this.topDownProfileDataGridTree ||= new Cn(this.nodeFormatter, this.searchableViewInternal, this.profileInternal.root, this.adjustedTotal), this.topDownProfileDataGridTree;
	}
	populateContextMenu(e, t) {
		let n = t;
		n.linkElement && e.appendApplicableItems(n.linkElement);
	}
	willHide() {
		super.willHide(), this.currentSearchResultIndex = -1;
	}
	refresh() {
		if (!this.profileDataGridTree) return;
		this.dataGrid.rootNode().removeChildren();
		let e = this.profileDataGridTree.children, t = e.length;
		for (let n = 0; n < t; ++n) this.dataGrid.rootNode().appendChild(e[n]);
	}
	refreshVisibleData() {
		let e = this.dataGrid.rootNode().children[0];
		for (; e;) e.refresh(), e = e.traverseNextNode(!1, null, !0);
	}
	searchableView() {
		return this.searchableViewInternal;
	}
	supportsCaseSensitiveSearch() {
		return !0;
	}
	supportsWholeWordSearch() {
		return !1;
	}
	supportsRegexSearch() {
		return !1;
	}
	onSearchCanceled() {
		this.searchableElement && this.searchableElement.onSearchCanceled();
	}
	performSearch(e, t, n) {
		this.searchableElement && this.searchableElement.performSearch(e, t, n);
	}
	jumpToNextSearchResult() {
		this.searchableElement && this.searchableElement.jumpToNextSearchResult();
	}
	jumpToPreviousSearchResult() {
		this.searchableElement && this.searchableElement.jumpToPreviousSearchResult();
	}
	linkifier() {
		return this.linkifierInternal;
	}
	createFlameChartDataProvider() {
		throw Error("Not implemented");
	}
	ensureFlameChartCreated() {
		this.flameChart || (this.dataProvider = this.createFlameChartDataProvider(), this.flameChart = new _n(this.searchableViewInternal, this.dataProvider), this.flameChart.addEventListener(Ft.ENTRY_INVOKED, (e) => {
			this.onEntryInvoked(e);
		}));
	}
	async onEntryInvoked(e) {
		if (!this.dataProvider) return;
		let t = e.data, r = this.dataProvider.entryNodes[t], i = this.profileHeader.debuggerModel;
		if (!r || !r.scriptId || !i) return;
		let a = i.scriptForId(r.scriptId);
		if (!a) return;
		let o = i.createRawLocation(a, r.lineNumber, r.columnNumber), s = await Ct.instance().rawLocationToUILocation(o);
		n(s);
	}
	changeView() {
		if (!this.profileInternal) return;
		switch (this.searchableViewInternal.closeSearch(), this.visibleView && this.visibleView.detach(), this.viewType.set(this.viewSelectComboBox.selectedOption().value), this.viewType.get()) {
			case "Flame":
				this.ensureFlameChartCreated(), this.visibleView = this.flameChart, this.searchableElement = this.flameChart;
				break;
			case "Tree":
				this.profileDataGridTree = this.getTopDownProfileDataGridTree(), this.sortProfile(), this.visibleView = this.dataGrid.asWidget(), this.searchableElement = this.profileDataGridTree;
				break;
			case "Heavy": this.profileDataGridTree = this.getBottomUpProfileDataGridTree(), this.sortProfile(), this.visibleView = this.dataGrid.asWidget(), this.searchableElement = this.profileDataGridTree;
		}
		let e = this.viewType.get() === "Flame";
		this.focusButton.setVisible(!e), this.excludeButton.setVisible(!e), this.resetButton.setVisible(!e), this.visibleView && this.visibleView.show(this.searchableViewInternal.element);
	}
	nodeSelected(e) {
		this.focusButton.setEnabled(e), this.excludeButton.setEnabled(e);
	}
	focusClicked() {
		this.dataGrid.selectedNode && (this.resetButton.setEnabled(!0), this.resetButton.element.focus(), this.profileDataGridTree && this.profileDataGridTree.focus(this.dataGrid.selectedNode), this.refresh(), this.refreshVisibleData(), Re.actionTaken(rt.CpuProfileNodeFocused));
	}
	excludeClicked() {
		let e = this.dataGrid.selectedNode;
		e && (this.resetButton.setEnabled(!0), this.resetButton.element.focus(), e.deselect(), this.profileDataGridTree && this.profileDataGridTree.exclude(e), this.refresh(), this.refreshVisibleData(), Re.actionTaken(rt.CpuProfileNodeExcluded));
	}
	resetClicked() {
		this.viewSelectComboBox.element.focus(), this.resetButton.setEnabled(!1), this.profileDataGridTree && this.profileDataGridTree.restore(), this.linkifierInternal.reset(), this.refresh(), this.refreshVisibleData();
	}
	sortProfile() {
		if (!this.profileDataGridTree) return;
		let e = this.dataGrid.isSortOrderAscending(), t = this.dataGrid.sortColumnId(), n = t === "function" ? "functionName" : t || "";
		this.profileDataGridTree.sort(en.propertyComparator(n, e), !1), this.refresh();
	}
}, Dn = /* @__PURE__ */ function(e) {
	return e.FLAME = "Flame", e.TREE = "Tree", e.HEAVY = "Heavy", e;
}({}), On = class extends j {
	debuggerModel;
	fileName;
	jsonifiedProfile;
	profile;
	protocolProfileInternal;
	#e = Promise.withResolvers();
	constructor(e, t, n) {
		super(t, n || F(P.profileD, { PH1: t.nextProfileUid() })), this.debuggerModel = e;
	}
	onChunkTransferred(e) {
		this.jsonifiedProfile && this.updateStatus(F(P.loadingD, { PH1: a(this.jsonifiedProfile.length) }));
	}
	onError(e) {
		let t = e.error();
		t && this.updateStatus(F(P.fileSReadErrorS, {
			PH1: e.fileName(),
			PH2: t.message
		}));
	}
	async write(e) {
		this.jsonifiedProfile += e;
	}
	async close() {}
	dispose() {
		this.removeTempFile();
	}
	canSaveToFile() {
		return !this.fromFile();
	}
	async saveToFile() {
		await this.#e.promise;
		let e = new St();
		if (!this.fileName) {
			let e = ge(/* @__PURE__ */ new Date()), t = this.profileType().fileExtension();
			this.fileName = `${this.profileType().typeName()}-${e}${t}`;
		}
		if (!await e.open(this.fileName) || !this.tempFile) return;
		let t = await this.tempFile.read();
		t && await e.write(t), e.close();
	}
	async loadFromFile(e) {
		this.updateStatus(F(P.loading), !0);
		let t = new xt(e, 1e7, this.onChunkTransferred.bind(this));
		if (this.jsonifiedProfile = "", !await t.read(this)) return this.onError(t), Error(F(P.failedToReadFile));
		this.updateStatus(F(P.parsing), !0);
		let n = null;
		try {
			this.profile = JSON.parse(this.jsonifiedProfile), this.setProfile(this.profile), this.updateStatus(F(P.loaded), !1);
		} catch (e) {
			n = e, this.profileType().removeProfile(this);
		}
		return this.jsonifiedProfile = null, this.profileType().profileBeingRecorded() === this && this.profileType().setProfileBeingRecorded(null), n;
	}
	setProtocolProfile(e) {
		this.setProfile(e), this.protocolProfileInternal = e, this.tempFile = new wt(), this.tempFile.write([JSON.stringify(e)]), this.#e.resolve();
	}
}, I = {
	startDetachedElements: "Obtain detached elements",
	detachedElementsTitle: "Detached elements",
	detachedElementsDescription: "Detached elements shows objects that are retained by a JS reference.",
	detachedElementProfile: "Detached elements {PH1}"
}, kn = o("panels/profiler/HeapDetachedElementsView.ts", I), L = r.bind(void 0, kn), An = class extends Xe {
	selectedSizeText;
	dataGrid;
	profile;
	parentDataDisplayDelegate;
	constructor(e, t) {
		super({
			title: L(I.detachedElementsTitle),
			viewId: "detached-elements"
		}), this.element.classList.add("detached-elements-view"), this.profile = t, this.parentDataDisplayDelegate = e, this.selectedSizeText = new ut(), this.dataGrid = new ln(), this.populateElementsGrid(t.detachedElements), this.dataGrid.asWidget().show(this.element);
	}
	showProfile(e) {
		return this.parentDataDisplayDelegate.showProfile(e);
	}
	showObject(e, t) {
		this.parentDataDisplayDelegate.showObject(e, t);
	}
	async linkifyObject() {
		return null;
	}
	populateElementsGrid(e) {
		if (!e) return;
		let t = this.profile.heapProfilerModel()?.target().model(Ie);
		if (t) for (let n of e) this.dataGrid.rootNode().appendChild(new un(n, t));
	}
	async toolbarItems() {
		return [...await super.toolbarItems(), this.selectedSizeText];
	}
}, jn = class extends t(pn) {
	constructor(e, t) {
		super(e || L(I.detachedElementsTitle), t || L(I.detachedElementsTitle));
	}
	profileBeingRecorded() {
		return super.profileBeingRecorded();
	}
	get buttonTooltip() {
		return L(I.startDetachedElements);
	}
	buttonClicked() {
		return this.getDetachedElements(), !1;
	}
	async getDetachedElements() {
		if (this.profileBeingRecorded()) return;
		let e = x.instance().flavor(_), t = e?.target(), n = t?.model(Ie);
		if (!e || !t || !n) return;
		let r = await n.getDetachedDOMNodes(), i = new Mn(e, this, r);
		this.addProfile(i), this.dispatchEventToListeners(N.PROFILE_COMPLETE, i);
	}
	get treeItemTitle() {
		return L(I.detachedElementsTitle);
	}
	get description() {
		return L(I.detachedElementsDescription);
	}
	isInstantProfile() {
		return !0;
	}
	static TypeId = "DetachedElements";
};
(function(e) {
	e.Events = /* @__PURE__ */ function(e) {
		return e.RECORDING_STOPPED = "RecordingStopped", e.STATS_UPDATE = "StatsUpdate", e.DETACHED_ELEMENTS_OBTAINED = "DetachedElementsObtained", e;
	}({});
})(jn ||= {});
var Mn = class extends On {
	#e;
	detachedElements;
	constructor(e, t, n, r) {
		super(e?.debuggerModel() ?? null, t, r || L(I.detachedElementProfile, { PH1: t.nextProfileUid() })), this.detachedElements = n, this.#e = e;
	}
	heapProfilerModel() {
		return this.#e;
	}
	profileType() {
		return super.profileType();
	}
}, Nn = "/*\n * Copyright (C) 2009 Google Inc. All rights reserved.\n * Copyright (C) 2010 Apple Inc. All rights reserved.\n *\n * Redistribution and use in source and binary forms, with or without\n * modification, are permitted provided that the following conditions are\n * met:\n *\n *     * Redistributions of source code must retain the above copyright\n * notice, this list of conditions and the following disclaimer.\n *     * Redistributions in binary form must reproduce the above\n * copyright notice, this list of conditions and the following disclaimer\n * in the documentation and/or other materials provided with the\n * distribution.\n *     * Neither the name of Google Inc. nor the names of its\n * contributors may be used to endorse or promote products derived from\n * this software without specific prior written permission.\n *\n * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS\n * \"AS IS\" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT\n * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR\n * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT\n * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,\n * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT\n * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,\n * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY\n * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT\n * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\n * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n */\n\n.heap-snapshot-view {\n  overflow: hidden;\n}\n\n.heap-snapshot-view .data-grid {\n  border: none;\n  flex: auto;\n\n  .data-container {\n    overflow-x: scroll;\n  }\n\n  .corner {\n    width: 100%;\n  }\n}\n\n.heap-snapshot-view .data-grid tr:empty {\n  height: 16px;\n  visibility: hidden;\n}\n\n.heap-snapshot-view .data-grid span.percent-column {\n  width: 35px !important; /* stylelint-disable-line declaration-no-important */\n}\n\n.heap-snapshot-view .object-value-object,\n.object-value-node {\n  display: inline;\n  position: static;\n}\n\n.heap-snapshot-view .object-value-string {\n  white-space: nowrap;\n}\n\n.heap-snapshot-view td.object-column .objects-count {\n  margin-left: 10px;\n  font-size: 11px;\n  color: var(--sys-color-token-subtle);\n}\n\n.heap-snapshot-view tr:not(.selected) .object-value-id {\n  color: var(--sys-color-token-subtle);\n}\n\n.profile-view .heap-tracking-overview {\n  flex: 0 0 80px;\n  height: 80px;\n}\n\n.heap-snapshot-view .retaining-paths-view {\n  overflow: hidden;\n}\n\n.heap-snapshot-view .heap-snapshot-view-resizer {\n  background-color: var(--sys-color-surface1);\n  display: flex;\n  flex: 0 0 21px;\n}\n\n.heap-snapshot-view td.object-column > div > span {\n  margin-right: 6px;\n}\n\n.heap-snapshot-view .heap-snapshot-view-resizer .title {\n  flex: 0 1 auto;\n  overflow: hidden;\n  white-space: nowrap;\n}\n\n.heap-snapshot-view .heap-snapshot-view-resizer .verticalResizerIcon {\n  /* stylelint-disable-next-line custom-property-pattern */\n  background-image: var(--image-file-toolbarResizerVertical);\n  background-repeat: no-repeat;\n  background-position: center;\n  flex: 0 0 28px;\n  margin-left: auto;\n}\n\n.heap-snapshot-view .heap-snapshot-view-resizer .title > span {\n  display: inline-block;\n  padding-top: 3px;\n  vertical-align: middle;\n  margin-left: 4px;\n  margin-right: 8px;\n}\n\n.heap-snapshot-view .heap-snapshot-view-resizer * {\n  pointer-events: none;\n}\n\n.heap-snapshot-view tr:not(.selected) td.object-column span.highlight {\n  background-color: inherit;\n}\n\n.heap-snapshot-view td.object-column span.heap-object-source-link {\n  float: right;\n\n  & > button.text-button.devtools-link {\n    background-color: inherit;\n    outline-offset: calc(-1 * var(--sys-size-1));\n    padding-inline: var(--sys-size-2) !important;  /* stylelint-disable-line declaration-no-important */\n  }\n}\n\n.heap-snapshot-view td.object-column span.heap-object-source-link:empty {\n  animation: fadeInOut 2s infinite;\n}\n\n.heap-snapshot-view td.object-column span.heap-object-source-link:empty::before {\n  content: \"\\b7\\b7\";\n  font-weight: bold;\n}\n\n@keyframes fadeInOut {\n  0% {\n    transform: rotate(0);\n  }\n\n  50% {\n    transform: rotate(0.5turn);\n  }\n\n  100% {\n    transform: rotate(1turn);\n  }\n}\n\n.heap-object-tag {\n  height: 14px;\n  width: 14px;\n}\n\n.heap-snapshot-view tr:not(.selected) td.object-column span.heap-object-tag,\n.heap-snapshot-view tr:not(.selected) td.object-column span.grayed {\n  color: var(--sys-color-token-subtle);\n}\n\n.heap-snapshot-view tr:not(.selected) .cycled-ancestor-node,\n.heap-snapshot-view tr:not(.selected) .unreachable-ancestor-node {\n  opacity: 60%;\n}\n\n#heap-recording-view .profile-view {\n  top: 80px;\n}\n\n.heap-overview-container {\n  overflow: hidden;\n  position: absolute;\n  top: 0;\n  width: 100%;\n  height: 80px;\n}\n\n#heap-recording-overview-grid .resources-dividers-label-bar {\n  pointer-events: auto;\n}\n\n.heap-recording-overview-canvas {\n  position: absolute;\n  inset: 20px 0 0;\n}\n\n.heap-snapshot-statistics-view {\n  overflow: auto;\n}\n\n.heap-snapshot-stats-pie-chart {\n  margin: 12px 30px;\n  flex-shrink: 0;\n}\n\n.heap-allocation-stack .stack-frame {\n  display: flex;\n  justify-content: space-between;\n  border-bottom: 1px solid var(--sys-color-divider);\n  padding: 2px;\n}\n\n.heap-allocation-stack .stack-frame:focus {\n  background-color: var(--sys-color-tonal-container);\n  color: var(--sys-color-on-tonal-container);\n}\n\n.heap-allocation-stack .stack-frame:hover:not(:focus) {\n  background-color: var(--sys-color-state-hover-on-subtle);\n}\n\n.heap-allocation-stack .stack-frame .devtools-link {\n  color: var(--sys-color-primary);\n}\n\n.no-heap-allocation-stack {\n  padding: 5px;\n}\n\n@media (forced-colors: active) {\n  .cycled-ancestor-node {\n    opacity: 100%;\n  }\n\n  .heap-snapshot-view td.object-column .objects-count,\n  .heap-snapshot-view tr:not(.selected) td.object-column span.heap-object-tag,\n  .heap-snapshot-view tr:not(.selected) .object-value-id {\n    color: ButtonText;\n  }\n}\n\n.detached-elements-view {\n  overflow: auto;\n}\n", Pn = /* @__PURE__ */ e({
	Events: () => In,
	HeapTimelineOverview: () => Fn,
	OverviewCalculator: () => zn,
	Samples: () => Rn,
	SmoothScale: () => Ln
}), Fn = class extends t(b) {
	overviewCalculator;
	overviewContainer;
	overviewGrid;
	overviewCanvas;
	windowLeftRatio;
	windowRightRatio;
	yScale;
	xScale;
	profileSamples;
	running;
	updateOverviewCanvas;
	updateGridTimerId;
	updateTimerId;
	windowWidthRatio;
	constructor() {
		super({ jslog: `${tt("heap-tracking-overview")}` }), this.element.id = "heap-recording-view", this.element.classList.add("heap-tracking-overview"), this.overviewCalculator = new zn(), this.overviewContainer = this.element.createChild("div", "heap-overview-container"), this.overviewGrid = new Bt("heap-recording", this.overviewCalculator), this.overviewGrid.element.classList.add("fill"), this.overviewCanvas = this.overviewContainer.createChild("canvas", "heap-recording-overview-canvas"), this.overviewContainer.appendChild(this.overviewGrid.element), this.overviewGrid.addEventListener(Vt.WINDOW_CHANGED, this.onWindowChanged, this), this.windowLeftRatio = 0, this.windowRightRatio = 1, this.overviewGrid.setWindowRatio(this.windowLeftRatio, this.windowRightRatio), this.yScale = new Ln(), this.xScale = new Ln(), this.profileSamples = new Rn(), w.instance().addEventListener(bt.eventName, () => this.update());
	}
	start() {
		this.running = !0;
		let e = () => {
			this.update(), this.running && this.element.window().requestAnimationFrame(e);
		};
		e();
	}
	stop() {
		this.running = !1;
	}
	setSamples(e) {
		this.profileSamples = e, this.running || this.update();
	}
	drawOverviewCanvas(e, t) {
		if (!this.profileSamples) return;
		let n = this.profileSamples, r = n.sizes, i = n.max, o = n.timestamps, s = o[0], c = this.xScale.nextScale(e / n.totalTime), l = 0;
		function u(e, t) {
			let n = 0, r = 0;
			for (let i = 1; i < o.length; ++i) {
				let a = Math.floor((o[i] - s) * c);
				a !== r && (n && t(r, n), n = 0, r = a), n += e[i];
			}
			t(r, n);
		}
		function d(e, t) {
			l = Math.max(l, t);
		}
		u(r, d);
		let f = this.yScale.nextScale(l ? t / (l * 1.1) : 0);
		this.overviewCanvas.width = e * window.devicePixelRatio, this.overviewCanvas.height = t * window.devicePixelRatio, this.overviewCanvas.style.width = e + "px", this.overviewCanvas.style.height = t + "px";
		let ee = this.overviewCanvas.getContext("2d");
		if (!ee) throw Error("Failed to get canvas context");
		let p = ee;
		if (p.scale(window.devicePixelRatio, window.devicePixelRatio), this.running) {
			p.beginPath(), p.lineWidth = 2, p.strokeStyle = w.instance().getComputedValue("--sys-color-neutral-outline");
			let e = (Date.now() - s) * c;
			p.moveTo(e, t - 1), p.lineTo(e, 0), p.stroke(), p.closePath();
		}
		let m = 0, h;
		if (f) {
			let n = (t - 14) / f;
			h = 1024 ** Math.floor(Math.log(n) / Math.log(1024)), h *= 10 ** Math.floor(Math.log(n / h) / Math.LN10), h * 5 <= n && (h *= 5), m = Math.round(t - h * f - .5) + .5, p.beginPath(), p.lineWidth = 1, p.strokeStyle = w.instance().getComputedValue("--sys-color-on-surface-subtle"), p.moveTo(0, m), p.lineTo(e, m), p.stroke(), p.closePath();
		}
		function te(e, n) {
			p.moveTo(e, t - 1), p.lineTo(e, Math.round(t - n * f - 1));
		}
		if (p.beginPath(), p.lineWidth = 2, p.strokeStyle = w.instance().getComputedValue("--sys-color-neutral-outline"), u(i, te), p.stroke(), p.closePath(), p.beginPath(), p.lineWidth = 2, p.strokeStyle = w.instance().getComputedValue("--sys-color-primary-bright"), u(r, te), p.stroke(), p.closePath(), h) {
			let e = a(h), t = m - .5, n = 8 + p.measureText(e).width;
			p.beginPath(), p.textBaseline = "bottom", p.font = "10px " + window.getComputedStyle(this.element, null).getPropertyValue("font-family"), p.fillStyle = w.instance().getComputedValue("--color-background-opacity-80"), p.fillRect(0, t - 14, n, 14), p.fillStyle = w.instance().getComputedValue("--sys-color-on-surface-subtle"), p.fillText(e, 4, t), p.fill(), p.closePath();
		}
	}
	onResize() {
		this.updateOverviewCanvas = !0, this.scheduleUpdate();
	}
	onWindowChanged() {
		this.updateGridTimerId ||= window.setTimeout(this.updateGrid.bind(this), 10);
	}
	scheduleUpdate() {
		this.updateTimerId ||= window.setTimeout(this.update.bind(this), 10);
	}
	updateBoundaries() {
		this.windowLeftRatio = this.overviewGrid.windowLeftRatio(), this.windowRightRatio = this.overviewGrid.windowRightRatio(), this.windowWidthRatio = this.windowRightRatio - this.windowLeftRatio;
	}
	update() {
		this.updateTimerId = null, this.isShowing() && (this.updateBoundaries(), this.overviewCalculator.updateBoundaries(this), this.overviewGrid.updateDividers(this.overviewCalculator), this.drawOverviewCanvas(this.overviewContainer.clientWidth, this.overviewContainer.clientHeight - 20));
	}
	updateGrid() {
		this.updateGridTimerId = 0, this.updateBoundaries();
		let e = this.profileSamples.ids;
		if (!e.length) return;
		let t = this.profileSamples.timestamps, n = this.profileSamples.sizes, r = t[0], i = this.profileSamples.totalTime, a = r + i * this.windowLeftRatio, o = r + i * this.windowRightRatio, s = te(t, a, u), c = p(t, o, u), l = 0;
		for (let e = s; e < c; ++e) l += n[e];
		let d = s > 0 ? e[s - 1] : 0, f = c < e.length ? e[c] : Infinity;
		this.dispatchEventToListeners("IdsRangeChanged", {
			minId: d,
			maxId: f,
			size: l
		});
	}
}, In = /* @__PURE__ */ function(e) {
	return e.IDS_RANGE_CHANGED = "IdsRangeChanged", e;
}({}), Ln = class {
	lastUpdate;
	currentScale;
	constructor() {
		this.lastUpdate = 0, this.currentScale = 0;
	}
	nextScale(e) {
		if (e ||= this.currentScale, this.currentScale) {
			let t = Date.now(), n = t - this.lastUpdate;
			this.lastUpdate = t;
			let r = 20 ** (n / 1e3), i = e / this.currentScale;
			this.currentScale *= le(i, 1 / r, r);
		} else this.currentScale = e;
		return this.currentScale;
	}
}, Rn = class {
	sizes;
	ids;
	timestamps;
	max;
	totalTime;
	constructor() {
		this.sizes = [], this.ids = [], this.timestamps = [], this.max = [], this.totalTime = 3e4;
	}
}, zn = class {
	maximumBoundaries;
	minimumBoundaries;
	xScaleFactor;
	constructor() {
		this.maximumBoundaries = 0, this.minimumBoundaries = 0, this.xScaleFactor = 0;
	}
	updateBoundaries(e) {
		this.minimumBoundaries = 0, this.maximumBoundaries = e.profileSamples.totalTime, this.xScaleFactor = e.overviewContainer.clientWidth / this.maximumBoundaries;
	}
	computePosition(e) {
		return (e - this.minimumBoundaries) * this.xScaleFactor;
	}
	formatValue(e, t) {
		return i(e / 1e3, !!t);
	}
	maximumBoundary() {
		return this.maximumBoundaries;
	}
	minimumBoundary() {
		return this.minimumBoundaries;
	}
	zeroTime() {
		return this.minimumBoundaries;
	}
	boundarySpan() {
		return this.maximumBoundaries - this.minimumBoundaries;
	}
}, Bn = /* @__PURE__ */ e({
	HeapFlameChartDataProvider: () => Zn,
	HeapProfileView: () => Un,
	NodeFormatter: () => Xn,
	SamplingHeapProfileHeader: () => qn,
	SamplingHeapProfileModel: () => Yn,
	SamplingHeapProfileNode: () => Jn,
	SamplingHeapProfileType: () => Kn,
	SamplingHeapProfileTypeBase: () => Wn
}), R = {
	selectedSizeS: "Selected size: {PH1}",
	selfSizeBytes: "Self size",
	totalSizeBytes: "Total size",
	stopHeapProfiling: "Stop heap profiling",
	startHeapProfiling: "Start heap profiling",
	recording: "Recording…",
	heapProfilerIsRecording: "Heap profiler is recording",
	stopping: "Stopping…",
	allocationSampling: "Allocation sampling",
	samplingProfiles: "Sampling profiles",
	recordMemoryAllocations: "Approximate memory allocations by sampling long operations with minimal overhead and get a breakdown by JavaScript execution stack",
	profileD: "Profile {PH1}",
	sBytes: "{PH1} bytes",
	formatPercent: "{PH1}\xA0%",
	skb: "{PH1}\xA0kB",
	name: "Name",
	selfSize: "Self size",
	totalSize: "Total size",
	url: "URL",
	samplingHeapProfilerTimeline: "Sampling heap profiler timeline"
}, Vn = o("panels/profiler/HeapProfileView.ts", R), z = r.bind(void 0, Vn);
function Hn(e) {
	return e.profile || e.protocolProfile();
}
var Un = class extends En {
	profileHeader;
	profileType;
	adjustedTotal;
	selectedSizeText;
	timestamps;
	sizes;
	max;
	ordinals;
	totalTime;
	lastOrdinal;
	timelineOverview;
	constructor(e) {
		super(), this.profileHeader = e, this.profileType = e.profileType(), this.initialize(new Xn(this));
		let t = new Yn(Hn(e));
		this.adjustedTotal = t.total, this.setProfile(t), this.selectedSizeText = new ut(), this.timestamps = [], this.sizes = [], this.max = [], this.ordinals = [], this.totalTime = 0, this.lastOrdinal = 0, this.timelineOverview = new Fn(), this.profileType.hasTemporaryView() && (this.timelineOverview.addEventListener(In.IDS_RANGE_CHANGED, this.onIdsRangeChanged.bind(this)), this.timelineOverview.show(this.element, this.element.firstChild), this.timelineOverview.start(), this.profileType.addEventListener(Kn.Events.STATS_UPDATE, this.onStatsUpdate, this), this.profileType.once(N.PROFILE_COMPLETE).then(() => {
			this.profileType.removeEventListener(Kn.Events.STATS_UPDATE, this.onStatsUpdate, this), this.timelineOverview.stop(), this.timelineOverview.updateGrid();
		}));
	}
	async toolbarItems() {
		return [...await super.toolbarItems(), this.selectedSizeText];
	}
	onIdsRangeChanged(e) {
		let { minId: t, maxId: n } = e.data;
		this.selectedSizeText.setText(z(R.selectedSizeS, { PH1: a(e.data.size) })), this.setSelectionRange(t, n);
	}
	setSelectionRange(e, t) {
		let n = new Yn(Hn(this.profileHeader), e, t);
		this.adjustedTotal = n.total, this.setProfile(n);
	}
	onStatsUpdate(e) {
		let t = e.data;
		this.totalTime || (this.timestamps = [], this.sizes = [], this.max = [], this.ordinals = [], this.totalTime = 3e4, this.lastOrdinal = 0), this.sizes.fill(0), this.sizes.push(0), this.timestamps.push(Date.now()), this.ordinals.push(this.lastOrdinal + 1);
		for (let e of t?.samples ?? []) {
			this.lastOrdinal = Math.max(this.lastOrdinal, e.ordinal);
			let t = p(this.ordinals, e.ordinal, u) - 1;
			this.sizes[t] += e.size;
		}
		this.max.push(this.sizes[this.sizes.length - 1]), this.timestamps[this.timestamps.length - 1] - this.timestamps[0] > this.totalTime && (this.totalTime *= 2);
		let n = {
			sizes: this.sizes,
			max: this.max,
			ids: this.ordinals,
			timestamps: this.timestamps,
			totalTime: this.totalTime
		};
		this.timelineOverview.setSamples(n);
	}
	columnHeader(e) {
		switch (e) {
			case "self": return z(R.selfSizeBytes);
			case "total": return z(R.totalSizeBytes);
		}
		return "";
	}
	createFlameChartDataProvider() {
		return new Zn(this.profile(), this.profileHeader.heapProfilerModel());
	}
}, Wn = class extends t(pn) {
	recording;
	clearedDuringRecording;
	constructor(e, t) {
		super(e, t), this.recording = !1, this.clearedDuringRecording = !1;
	}
	profileBeingRecorded() {
		return super.profileBeingRecorded();
	}
	typeName() {
		return "Heap";
	}
	fileExtension() {
		return ".heapprofile";
	}
	get buttonTooltip() {
		return this.recording ? z(R.stopHeapProfiling) : z(R.startHeapProfiling);
	}
	buttonClicked() {
		return this.recording ? this.stopRecordingProfile() : this.startRecordingProfile(), this.recording;
	}
	async startRecordingProfile() {
		let e = x.instance().flavor(_);
		if (this.profileBeingRecorded() || !e) return;
		let t = new qn(e, this);
		this.setProfileBeingRecorded(t), this.addProfile(t), t.updateStatus(z(R.recording));
		let n = [z(R.heapProfilerIsRecording)];
		ve.instance().setPanelWarnings("heap-profiler", n), this.recording = !0, this.startSampling();
	}
	async stopRecordingProfile() {
		this.recording = !1;
		let e = this.profileBeingRecorded();
		if (!e?.heapProfilerModel()) return;
		e.updateStatus(z(R.stopping));
		let t = await this.stopSampling();
		e && (console.assert(t !== void 0), e.setProtocolProfile(t), e.updateStatus(""), this.setProfileBeingRecorded(null)), ve.instance().setPanelWarnings("heap-profiler", []);
		let n = this.clearedDuringRecording;
		this.clearedDuringRecording = !1, !n && this.dispatchEventToListeners(N.PROFILE_COMPLETE, e);
	}
	createProfileLoadedFromFile(e) {
		return new qn(null, this, e);
	}
	profileBeingRecordedRemoved() {
		this.clearedDuringRecording = !0, this.stopRecordingProfile();
	}
	startSampling() {
		throw Error("Not implemented");
	}
	stopSampling() {
		throw Error("Not implemented");
	}
}, Gn, Kn = class e extends Wn {
	updateTimer;
	updateIntervalMs;
	#e;
	customContentInternal = null;
	constructor() {
		super(e.TypeId, z(R.allocationSampling)), Gn ||= this, this.updateTimer = 0, this.updateIntervalMs = 200, this.#e = m.instance().createSetting("record-sampling-heap-profiler-timeline", !1);
	}
	static get instance() {
		return Gn;
	}
	get treeItemTitle() {
		return z(R.samplingProfiles);
	}
	get description() {
		return [z(R.recordMemoryAllocations)].join("\n");
	}
	hasTemporaryView() {
		return this.#e.get();
	}
	customContent() {
		let e = Nt(z(R.samplingHeapProfilerTimeline), this.#e);
		return this.customContentInternal = e, e.setAttribute("jslog", `${ze("record-sampling-heap-profiler-timeline").track({ click: !0 })}`), e;
	}
	setCustomContentEnabled(e) {
		this.customContentInternal && (this.customContentInternal.disabled = !e);
	}
	startSampling() {
		let e = this.obtainRecordingProfile();
		e && (e.startSampling(), this.#e.get() && (this.updateTimer = window.setTimeout(() => {
			this.updateStats();
		}, this.updateIntervalMs)));
	}
	obtainRecordingProfile() {
		let e = this.profileBeingRecorded();
		return e ? e.heapProfilerModel() : null;
	}
	async stopSampling() {
		window.clearTimeout(this.updateTimer), this.updateTimer = 0, this.dispatchEventToListeners(e.Events.RECORDING_STOPPED);
		let t = this.obtainRecordingProfile();
		if (!t) throw Error("No heap profiler model");
		let n = await t.stopSampling();
		if (!n) throw Error("No sampling profile found");
		return n;
	}
	async updateStats() {
		let t = this.obtainRecordingProfile();
		if (!t) return;
		let n = await t.getSamplingProfile();
		this.updateTimer &&= (this.dispatchEventToListeners(e.Events.STATS_UPDATE, n), window.setTimeout(() => {
			this.updateStats();
		}, this.updateIntervalMs));
	}
	static TypeId = "SamplingHeap";
};
(function(e) {
	e.Events = /* @__PURE__ */ function(e) {
		return e.RECORDING_STOPPED = "RecordingStopped", e.STATS_UPDATE = "StatsUpdate", e;
	}({});
})(Kn ||= {});
var qn = class extends On {
	heapProfilerModelInternal;
	protocolProfileInternal;
	constructor(e, t, n) {
		super(e?.debuggerModel() ?? null, t, n || z(R.profileD, { PH1: t.nextProfileUid() })), this.heapProfilerModelInternal = e, this.protocolProfileInternal = {
			head: {
				callFrame: {
					functionName: "",
					scriptId: "",
					url: "",
					lineNumber: 0,
					columnNumber: 0
				},
				children: [],
				selfSize: 0,
				id: 0
			},
			samples: [],
			startTime: 0,
			endTime: 0,
			nodes: []
		};
	}
	protocolProfile() {
		return this.protocolProfileInternal;
	}
	heapProfilerModel() {
		return this.heapProfilerModelInternal;
	}
	profileType() {
		return super.profileType();
	}
}, Jn = class extends Dt {
	self;
	constructor(e) {
		let t = e.callFrame || {
			functionName: e.functionName,
			scriptId: e.scriptId,
			url: e.url,
			lineNumber: e.lineNumber - 1,
			columnNumber: e.columnNumber - 1
		};
		super(t), this.self = e.selfSize;
	}
}, Yn = class extends Ot {
	modules;
	constructor(e, t, n) {
		super(), this.modules = e.modules || [];
		let r = null;
		if (t || n) {
			r = /* @__PURE__ */ new Map(), t ||= 0, n ||= Infinity;
			for (let i of e.samples) {
				if (i.ordinal < t || i.ordinal > n) continue;
				let e = r.get(i.nodeId) || 0;
				r.set(i.nodeId, e + i.size);
			}
		}
		this.initialize(i(e.head));
		function i(e) {
			let t = new Jn(e), n = [e], i = [t];
			for (; n.length;) {
				let e = n.pop(), t = i.pop();
				t.children = e.children.map((e) => {
					let t = new Jn(e);
					return r && (t.self = r.get(e.id) || 0), t;
				}), n.push(...e.children), i.push(...t.children);
			}
			return a(t), t;
		}
		function a(e) {
			return e.children = e.children.filter(a), !!(e.children.length || e.self);
		}
	}
}, Xn = class {
	profileView;
	constructor(e) {
		this.profileView = e;
	}
	formatValue(e) {
		return a(e);
	}
	formatValueAccessibleText(e) {
		return z(R.sBytes, { PH1: e });
	}
	formatPercent(e, t) {
		return z(R.formatPercent, { PH1: e.toFixed(2) });
	}
	linkifyNode(e) {
		let t = this.profileView.profileHeader.heapProfilerModel(), n = t ? t.target() : null;
		return this.profileView.linkifier().maybeLinkifyConsoleCallFrame(n, e.profileNode.callFrame, {
			className: "profile-node-file",
			inlineFrameIndex: 0
		});
	}
}, Zn = class extends gn {
	profile;
	heapProfilerModel;
	constructor(e, t) {
		super(), this.profile = e, this.heapProfilerModel = t;
	}
	minimumBoundary() {
		return 0;
	}
	totalTime() {
		return this.profile.root.total;
	}
	entryHasDeoptReason(e) {
		return !1;
	}
	formatValue(e, t) {
		return z(R.skb, { PH1: Ke(e / 1e3) });
	}
	calculateTimelineData() {
		function e(t) {
			return t.children.reduce((t, n) => t + e(n), 1);
		}
		let t = e(this.profile.root), n = Array(t), r = new Uint16Array(t), i = new Float32Array(t), a = new Float64Array(t), o = 0, s = 0, c = 0, l = 0;
		function u(e) {
			let t = c;
			n[l] = e, r[l] = o, i[l] = e.total, a[l] = c, ++l, ++o, e.children.forEach(u), --o, s = Math.max(s, o), c = t + e.total;
		}
		return u(this.profile.root), this.maxStackDepthInternal = s + 1, this.entryNodes = n, this.timelineDataInternal = Pt.create({
			entryLevels: r,
			entryTotalTimes: i,
			entryStartTimes: a,
			groups: null
		}), this.timelineDataInternal;
	}
	preparePopoverElement(e) {
		let t = this.entryNodes[e];
		if (!t) return null;
		let n = [];
		function r(e, t) {
			n.push({
				title: e,
				value: t
			});
		}
		r(z(R.name), at(t.functionName)), r(z(R.selfSize), a(t.self)), r(z(R.totalSize), a(t.total));
		let i = new T(), o = i.maybeLinkifyConsoleCallFrame(this.heapProfilerModel ? this.heapProfilerModel.target() : null, t.callFrame);
		return o && r(z(R.url), o.textContent), i.dispose(), En.buildPopoverTable(n);
	}
}, Qn = /* @__PURE__ */ e({
	AllocationGridNode: () => cr,
	HeapSnapshotConstructorNode: () => ar,
	HeapSnapshotDiffNode: () => sr,
	HeapSnapshotDiffNodesProvider: () => or,
	HeapSnapshotGenericObjectNode: () => tr,
	HeapSnapshotGridNode: () => H,
	HeapSnapshotInstanceNode: () => ir,
	HeapSnapshotObjectNode: () => nr,
	HeapSnapshotRetainingObjectNode: () => rr
}), B = {
	genericStringsTwoPlaceholders: "{PH1}, {PH2}",
	internalArray: "(internal array)[]",
	userObjectReachableFromWindow: "User object reachable from window",
	detachedFromDomTree: "Detached from DOM tree",
	previewIsNotAvailable: "Preview is not available",
	revealInSummaryView: "Reveal in Summary view",
	summary: "Summary",
	revealObjectSWithIdSInSummary: "Reveal object ''{PH1}'' with id @{PH2} in Summary view",
	storeAsGlobalVariable: "Store as global variable",
	ignoreThisRetainer: "Ignore this retainer",
	stopIgnoringThisRetainer: "Stop ignoring this retainer",
	ignored: "ignored",
	inElement: "in",
	compiledCodeSummary: "Internal data which V8 uses to run functions defined by JavaScript or WebAssembly.",
	concatenatedStringSummary: "A string which represents the contents of two other strings joined together.",
	contextSummary: "An internal object containing variables from a JavaScript scope which may be needed by a function created within that scope.",
	descriptorArraySummary: "A list of the property names used by a JavaScript Object.",
	internalArraySummary: "An internal array-like data structure (not a JavaScript Array).",
	internalNodeSummary: "An object allocated by a component other than V8, such as C++ objects defined by Blink.",
	mapSummary: "An internal object representing the shape of a JavaScript Object (not a JavaScript Map).",
	objectElementsSummary: "An internal object which stores the indexed properties in a JavaScript Object, such as the contents of an Array.",
	objectPropertiesSummary: "An internal object which stores the named properties in a JavaScript Object.",
	slicedStringSummary: "A string which represents some of the characters from another string."
}, $n = o("panels/profiler/HeapSnapshotGridNodes.ts", B), V = r.bind(void 0, $n), er = class extends jt {}, H = class e extends t(er) {
	dataGridInternal;
	instanceCount = 0;
	savedChildren = /* @__PURE__ */ new Map();
	retrievedChildrenRanges = [];
	providerObject = null;
	reachableFromWindow = !1;
	populated;
	constructor(e, t) {
		super(null, t), this.dataGridInternal = e;
	}
	get name() {}
	createProvider() {
		throw Error("Not implemented.");
	}
	comparator() {
		throw Error("Not implemented.");
	}
	getHash() {
		throw Error("Not implemented.");
	}
	createChildNode(e) {
		throw Error("Not implemented.");
	}
	retainersDataSource() {
		return null;
	}
	provider() {
		return this.providerObject ||= this.createProvider(), this.providerObject;
	}
	createCell(e) {
		return super.createCell(e);
	}
	collapse() {
		super.collapse(), this.dataGridInternal.updateVisibleNodes(!0);
	}
	expand() {
		super.expand(), this.dataGridInternal.updateVisibleNodes(!0);
	}
	dispose() {
		this.providerObject && this.providerObject.dispose();
		for (let e = this.children[0]; e; e = e.traverseNextNode(!0, this, !0)) e.dispose();
	}
	queryObjectContent(e, t) {
		throw Error("Not implemented.");
	}
	tryQueryObjectContent(e, t) {
		throw Error("Not implemented.");
	}
	populateContextMenu(e, t, n) {}
	toPercentString(e) {
		return e.toFixed(0) + "\xA0%";
	}
	toUIDistance(e) {
		return e >= 0 && e < Jt ? e.toString() : "−";
	}
	allChildren() {
		return this.dataGridInternal.allChildren(this);
	}
	removeChildByIndex(e) {
		this.dataGridInternal.removeChildByIndex(this, e);
	}
	childForPosition(e) {
		let t = 0;
		for (let n = 0; n < this.retrievedChildrenRanges.length; n++) {
			let r = this.retrievedChildrenRanges[n];
			if (r.from <= e && e < r.to) {
				let n = t + e - r.from;
				return this.allChildren()[n];
			}
			t += r.to - r.from + 1;
		}
		return null;
	}
	createValueCell(e) {
		let t = ot("numeric-column").track({ click: !0 }), n = document.createElement("td");
		n.className = "numeric-column", n.setAttribute("jslog", t.toString());
		let r = this.dataGrid;
		if (r.snapshot && r.snapshot.totalSize !== 0) {
			let t = this.data[e], r = e + "-percent", i = this.data[r], a = `${e}-tooltip`, o = this.data[a];
			i ? (de(ye`
          <div class="profile-multiple-values">
            <span aria-hidden="true" title=${fe(o)}>${t}</span>
            <span class="percent-column" aria-hidden="true">${i}</span>
          </div>`, n), this.setCellAccessibleName(V(B.genericStringsTwoPlaceholders, {
				PH1: t,
				PH2: i
			}), n, e)) : de(ye`
          <div>
            <span title=${fe(o)}>${t}</span>
          </div>`, n);
		}
		return n;
	}
	populate() {
		this.populated || (this.populated = !0, this.provider().sortAndRewind(this.comparator()).then(() => this.populateChildren()));
	}
	expandWithoutPopulate() {
		return this.populated = !0, this.expand(), this.provider().sortAndRewind(this.comparator());
	}
	childHashForEntity(e) {
		return "edgeIndex" in e ? e.edgeIndex : e.id;
	}
	populateChildren(t, n) {
		return new Promise((r) => {
			t ||= 0, n ||= t + this.dataGridInternal.defaultPopulateCount();
			let i = t;
			a.call(this, n);
			function a(e) {
				if (i >= e) return;
				let t = Math.min(i + this.dataGridInternal.defaultPopulateCount(), e);
				this.provider().serializeItemsRange(i, t).then((t) => c.call(this, t, e)), i = t;
			}
			function o(e, t) {
				if (this.savedChildren) {
					let n = this.childHashForEntity(e), r = this.savedChildren.get(n);
					if (r) {
						this.dataGridInternal.insertChild(this, r, t);
						return;
					}
				}
				this.dataGridInternal.insertChild(this, this.createChildNode(e), t);
			}
			function s(e, t, n) {
				let r = new Mt(this.populateChildren.bind(this), e, t, this.dataGridInternal.defaultPopulateCount());
				this.dataGridInternal.insertChild(this, r, n);
			}
			function c(t, n) {
				let c = 0, l = t.startPosition, u = t.items, d = 0;
				if (this.retrievedChildrenRanges.length) {
					let e = 0, n = !1, r = {
						from: 0,
						to: 0
					};
					for (; e < this.retrievedChildrenRanges.length;) {
						if (r = this.retrievedChildrenRanges[e], r.to >= l) {
							n = !0;
							break;
						}
						d += r.to - r.from, r.to < t.totalLength && (d += 1), ++e;
					}
					for (!n || t.startPosition < r.from ? (this.allChildren()[d - 1].setEndPosition(t.startPosition), s.call(this, t.startPosition, n ? r.from : t.totalLength, d), r = {
						from: t.startPosition,
						to: t.startPosition
					}, n || (e = this.retrievedChildrenRanges.length), this.retrievedChildrenRanges.splice(e, 0, r)) : d += l - r.from; r.to < t.endPosition;) {
						let n = r.to - l;
						d += n, c += n, l = r.to;
						let i = this.retrievedChildrenRanges[e + 1], a = i ? i.from : t.totalLength;
						for (a > t.endPosition && (a = t.endPosition); l < a;) o.call(this, u[c++], d++), ++l;
						a === i?.from ? (r.to = i.to, this.removeChildByIndex(d), this.retrievedChildrenRanges.splice(e + 1, 1)) : (r.to = a, a === t.totalLength ? this.removeChildByIndex(d) : this.allChildren()[d].setStartPosition(t.endPosition));
					}
				} else {
					t.startPosition > 0 && (this.retrievedChildrenRanges.push({
						from: 0,
						to: 0
					}), s.call(this, 0, t.startPosition, d++)), this.retrievedChildrenRanges.push({
						from: t.startPosition,
						to: t.endPosition
					});
					for (let e = 0, t = u.length; e < t; ++e) o.call(this, u[e], d++);
					t.endPosition < t.totalLength && s.call(this, t.endPosition, t.totalLength, d++);
				}
				if (this.instanceCount += u.length, i < n && i < t.totalLength) {
					a.call(this, n);
					return;
				}
				this.expanded && this.dataGridInternal.updateVisibleNodes(!0), r(), this.dispatchEventToListeners(e.Events.PopulateComplete);
			}
		});
	}
	saveChildren() {
		this.savedChildren.clear();
		let e = this.allChildren();
		for (let t = 0, n = e.length; t < n; ++t) {
			let n = e[t];
			n.expanded && this.savedChildren.set(n.getHash(), n);
		}
	}
	async sort() {
		this.dataGridInternal.recursiveSortingEnter(), await this.provider().sortAndRewind(this.comparator()), this.saveChildren(), this.dataGridInternal.removeAllChildren(this), this.retrievedChildrenRanges = [];
		let e = this.instanceCount;
		this.instanceCount = 0, await this.populateChildren(0, e);
		for (let e of this.allChildren()) e.expanded && e.sort();
		this.dataGridInternal.recursiveSortingLeave();
	}
};
(function(e) {
	e.Events = /* @__PURE__ */ function(e) {
		return e.PopulateComplete = "PopulateComplete", e;
	}({});
})(H ||= {});
var tr = class extends H {
	referenceName;
	nameInternal;
	type;
	distance;
	shallowSize;
	retainedSize;
	snapshotNodeId;
	snapshotNodeIndex;
	detachedDOMTreeNode;
	linkElement;
	constructor(e, t) {
		if (super(e, !1), !t) return;
		this.referenceName = null, this.nameInternal = t.name, this.type = t.type, this.distance = t.distance, this.shallowSize = t.selfSize, this.retainedSize = t.retainedSize, this.snapshotNodeId = t.id, this.snapshotNodeIndex = t.nodeIndex, this.type === "string" ? this.reachableFromWindow = !0 : this.type === "object" && this.nameInternal.startsWith("Window") ? (this.nameInternal = this.shortenWindowURL(this.nameInternal, !1), this.reachableFromWindow = !0) : t.canBeQueried && (this.reachableFromWindow = !0), t.detachedDOMTreeNode && (this.detachedDOMTreeNode = !0);
		let n = e.snapshot, r = this.shallowSize / n.totalSize * 100, i = this.retainedSize / n.totalSize * 100;
		this.data = {
			distance: this.toUIDistance(this.distance),
			shallowSize: f(this.shallowSize),
			retainedSize: f(this.retainedSize),
			"shallowSize-percent": this.toPercentString(r),
			"retainedSize-percent": this.toPercentString(i),
			"shallowSize-tooltip": a(this.shallowSize),
			"retainedSize-tooltip": a(this.retainedSize)
		};
	}
	get name() {
		return this.nameInternal;
	}
	retainersDataSource() {
		return this.snapshotNodeIndex === void 0 ? null : {
			snapshot: this.dataGridInternal.snapshot,
			snapshotNodeIndex: this.snapshotNodeIndex,
			snapshotNodeId: this.snapshotNodeId
		};
	}
	createCell(e) {
		return e === "object" ? this.createObjectCell() : this.createValueCell(e);
	}
	createObjectCell() {
		let e = this.nameInternal, t = "object";
		switch (this.type) {
			case "concatenated string":
			case "string":
				e = `"${e}"`, t = "string";
				break;
			case "regexp":
				e = `/${e}/`, t = "string";
				break;
			case "closure":
				e = `${e}()`, t = "function";
				break;
			case "bigint":
				t = "bigint";
				break;
			case "number":
				t = "number";
				break;
			case "hidden":
			case "object shape":
				t = "null";
				break;
			case "array": e = e ? `${e}[]` : V(B.internalArray);
		}
		return this.createObjectCellWithValue(t, e || "");
	}
	createObjectCellWithValue(e, t) {
		let n = ot("object-column").track({ click: !0 }), r = document.createElement("td");
		r.className = "object-column disclosure", r.setAttribute("jslog", n.toString());
		let i = {};
		de(ye`<div
        class="source-code event-properties"
        style="overflow: visible;"
        ${Oe((e) => {
			i.div = e;
		})}
      >
        <span class="value object-value-${e}">${t}</span>
        <span class="object-value-id">@${this.snapshotNodeId}</span>
      </div>`, r);
		let a = i.div;
		if (!a) throw Error("Expected div to exists");
		if (this.prefixObjectCell(a), this.reachableFromWindow) {
			let e = he("frame", "heap-object-tag");
			v.install(e, V(B.userObjectReachableFromWindow)), a.appendChild(e);
		}
		if (this.detachedDOMTreeNode) {
			let e = he("scissors", "heap-object-tag");
			v.install(e, V(B.detachedFromDomTree)), a.appendChild(e);
		}
		return this.appendSourceLocation(a), this.depth && r.style.setProperty("padding-left", this.depth * this.dataGrid.indentWidth + "px"), r;
	}
	prefixObjectCell(e) {}
	async appendSourceLocation(e) {
		let t = document.createElement("span");
		t.className = "heap-object-source-link", e.appendChild(t);
		let n = await this.dataGridInternal.dataDisplayDelegate().linkifyObject(this.snapshotNodeIndex);
		n ? (n.setAttribute("tabindex", "0"), t.appendChild(n), this.linkElement = n) : t.remove();
	}
	async queryObjectContent(e, t) {
		return await this.tryQueryObjectContent(e, t) || this.tryGetTooltipDescription() || e.runtimeModel().createRemoteObjectFromPrimitiveValue(V(B.previewIsNotAvailable));
	}
	async tryQueryObjectContent(e, t) {
		return this.type === "string" ? e.runtimeModel().createRemoteObjectFromPrimitiveValue(this.nameInternal) : await e.objectForSnapshotObjectId(String(this.snapshotNodeId), t);
	}
	tryGetTooltipDescription() {
		let e = "https://developer.chrome.com/docs/devtools/memory-problems/heap-snapshots#";
		switch (this.type) {
			case "code": return {
				description: V(B.compiledCodeSummary),
				link: e + "compiled-code"
			};
			case "concatenated string": return {
				description: V(B.concatenatedStringSummary),
				link: e + "concatenated-string"
			};
			case "sliced string": return {
				description: V(B.slicedStringSummary),
				link: e + "sliced-string"
			};
		}
		switch (this.type + ":" + this.nameInternal) {
			case "array:": return {
				description: V(B.internalArraySummary),
				link: e + "array"
			};
			case "array:(object elements)": return {
				description: V(B.objectElementsSummary),
				link: e + "array"
			};
			case "array:(object properties)":
			case "hidden:system / PropertyArray": return {
				description: V(B.objectPropertiesSummary),
				link: e + "array"
			};
			case "object:system / Context": return {
				description: V(B.contextSummary),
				link: e + "system-context"
			};
			case "object shape:system / DescriptorArray": return {
				description: V(B.descriptorArraySummary),
				link: e + "object-shape"
			};
			case "object shape:system / Map": return {
				description: V(B.mapSummary),
				link: e + "object-shape"
			};
			case "native:InternalNode": return {
				description: V(B.internalNodeSummary),
				link: e + "internal-node"
			};
		}
	}
	async updateHasChildren() {
		let e = await this.provider().isEmpty();
		this.setHasChildren(!e);
	}
	shortenWindowURL(e, t) {
		let n = e.indexOf("/"), r = t ? e.indexOf("@") : e.length;
		if (n === -1 || r === -1) return e;
		let i = e.substring(n + 1, r).trimLeft(), a = vt(i);
		return a.length > 40 && (a = _t(a, 40)), e.substr(0, n + 2) + a + e.substr(r);
	}
	populateContextMenu(e, t, n) {
		if (this.shallowSize !== 0 && e.revealSection().appendItem(V(B.revealInSummaryView), () => {
			t.showObject(String(this.snapshotNodeId), V(B.summary));
		}, { jslogContext: "reveal-in-summary" }), this.referenceName) for (let n of this.referenceName.matchAll(/\((?<objectName>[^@)]*) @(?<snapshotNodeId>\d+)\)/g)) {
			let { objectName: r, snapshotNodeId: i } = n.groups;
			e.revealSection().appendItem(V(B.revealObjectSWithIdSInSummary, {
				PH1: r,
				PH2: i
			}), () => {
				t.showObject(i, V(B.summary));
			}, { jslogContext: "reveal-in-summary" });
		}
		n && e.revealSection().appendItem(V(B.storeAsGlobalVariable), async () => {
			let e = await this.tryQueryObjectContent(n, "");
			e ? await n.target().model(ke)?.saveToTempVariable(x.instance().flavor(xe), e) : g.instance().error(V(B.previewIsNotAvailable));
		}, { jslogContext: "store-as-global-variable" });
	}
}, nr = class e extends tr {
	referenceName;
	referenceType;
	edgeIndex;
	snapshot;
	parentObjectNode;
	cycledWithAncestorGridNode;
	constructor(e, t, n, r) {
		super(e, n.node), this.referenceName = n.name, this.referenceType = n.type, this.edgeIndex = n.edgeIndex, this.snapshot = t, this.parentObjectNode = r, this.cycledWithAncestorGridNode = this.findAncestorWithSameSnapshotNodeId(), this.cycledWithAncestorGridNode || this.updateHasChildren();
		let i = this.data;
		i.count = "", i.addedCount = "", i.removedCount = "", i.countDelta = "", i.addedSize = "", i.removedSize = "", i.sizeDelta = "";
	}
	retainersDataSource() {
		return this.snapshotNodeIndex === void 0 ? null : {
			snapshot: this.snapshot,
			snapshotNodeIndex: this.snapshotNodeIndex,
			snapshotNodeId: this.snapshotNodeId
		};
	}
	createProvider() {
		if (this.snapshotNodeIndex === void 0) throw Error("Cannot create a provider on a root node");
		return this.snapshot.createEdgesProvider(this.snapshotNodeIndex);
	}
	findAncestorWithSameSnapshotNodeId() {
		let e = this.parentObjectNode;
		for (; e;) {
			if (e.snapshotNodeId === this.snapshotNodeId) return e;
			e = e.parentObjectNode;
		}
		return null;
	}
	createChildNode(t) {
		return new e(this.dataGridInternal, this.snapshot, t, this);
	}
	getHash() {
		return this.edgeIndex;
	}
	comparator() {
		let e = this.dataGridInternal.isSortOrderAscending();
		switch (this.dataGridInternal.sortColumnId()) {
			case "object": return new O("!edgeName", e, "retainedSize", !1);
			case "count": return new O("!edgeName", !0, "retainedSize", !1);
			case "shallowSize": return new O("selfSize", e, "!edgeName", !0);
			case "retainedSize": return new O("retainedSize", e, "!edgeName", !0);
			case "distance": return new O("distance", e, "name", !0);
			default: return new O("!edgeName", !0, "retainedSize", !1);
		}
	}
	prefixObjectCell(e) {
		let t = this.referenceName || "(empty)", n = "name";
		switch (this.referenceType) {
			case "context":
				n = "object-value-number";
				break;
			case "internal":
			case "hidden":
			case "weak":
				n = "object-value-null";
				break;
			case "element": t = `[${t}]`;
		}
		this.cycledWithAncestorGridNode && e.classList.add("cycled-ancestor-node");
		let r = document.createElement("span");
		r.classList.add("property-name", n), r.textContent = t;
		let i = document.createElement("span");
		i.classList.add("grayed"), i.textContent = this.edgeNodeSeparator(), e.prepend(r, i);
	}
	edgeNodeSeparator() {
		return "::";
	}
}, rr = class e extends nr {
	#e;
	constructor(e, t, n, r) {
		super(e, t, n, r), this.#e = n.node.ignored, this.#e && (this.data.distance = V(B.ignored));
	}
	createProvider() {
		if (this.snapshotNodeIndex === void 0) throw Error("Cannot create providers on root nodes");
		return this.snapshot.createRetainingEdgesProvider(this.snapshotNodeIndex);
	}
	createChildNode(t) {
		return new e(this.dataGridInternal, this.snapshot, t, this);
	}
	edgeNodeSeparator() {
		return V(B.inElement);
	}
	expand() {
		this.expandRetainersChain(20);
	}
	populateContextMenu(e, t, n) {
		super.populateContextMenu(e, t, n);
		let r = this.snapshotNodeIndex;
		r !== void 0 && (this.#e ? e.revealSection().appendItem(V(B.stopIgnoringThisRetainer), async () => {
			await this.snapshot.unignoreNodeInRetainersView(r), await this.dataGridInternal.dataSourceChanged();
		}, { jslogContext: "stop-ignoring-this-retainer" }) : e.revealSection().appendItem(V(B.ignoreThisRetainer), async () => {
			await this.snapshot.ignoreNodeInRetainersView(r), await this.dataGridInternal.dataSourceChanged();
		}, { jslogContext: "ignore-this-retainer" }));
	}
	isReachable() {
		return (this.distance ?? 0) < Yt;
	}
	prefixObjectCell(e) {
		super.prefixObjectCell(e), this.isReachable() || e.classList.add("unreachable-ancestor-node");
	}
	expandRetainersChain(e) {
		if (!this.populated) {
			this.once(H.Events.PopulateComplete).then(() => this.expandRetainersChain(e)), this.populate();
			return;
		}
		if (super.expand(), --e > 0 && this.children.length > 0) {
			let t = this.children[0];
			if ((t.distance || 0) > 1 && t.isReachable()) {
				t.expandRetainersChain(e);
				return;
			}
		}
		this.dataGridInternal.dispatchEventToListeners(mr.ExpandRetainersComplete);
	}
	comparator() {
		let e = super.comparator();
		return e.fieldName1 === "distance" && (e.fieldName1 = "!edgeDistance"), e.fieldName2 === "distance" && (e.fieldName2 = "!edgeDistance"), e;
	}
}, ir = class extends tr {
	baseSnapshotOrSnapshot;
	isDeletedNode;
	constructor(e, t, n, r) {
		super(e, n), this.baseSnapshotOrSnapshot = t, this.isDeletedNode = r, this.updateHasChildren();
		let i = this.data;
		i.count = "", i.countDelta = "", i.sizeDelta = "", this.isDeletedNode ? (i.addedCount = "", i.addedSize = "", i.removedCount = "•", i.removedSize = f(this.shallowSize || 0)) : (i.addedCount = "•", i.addedSize = f(this.shallowSize || 0), i.removedCount = "", i.removedSize = "");
	}
	retainersDataSource() {
		return this.snapshotNodeIndex === void 0 ? null : {
			snapshot: this.baseSnapshotOrSnapshot,
			snapshotNodeIndex: this.snapshotNodeIndex,
			snapshotNodeId: this.snapshotNodeId
		};
	}
	createProvider() {
		if (this.snapshotNodeIndex === void 0) throw Error("Cannot create providers on root nodes");
		return this.baseSnapshotOrSnapshot.createEdgesProvider(this.snapshotNodeIndex);
	}
	createChildNode(e) {
		return new nr(this.dataGridInternal, this.baseSnapshotOrSnapshot, e, null);
	}
	getHash() {
		if (this.snapshotNodeId === void 0) throw Error("Cannot hash root nodes");
		return this.snapshotNodeId;
	}
	comparator() {
		let e = this.dataGridInternal.isSortOrderAscending();
		switch (this.dataGridInternal.sortColumnId()) {
			case "object": return new O("!edgeName", e, "retainedSize", !1);
			case "distance": return new O("distance", e, "retainedSize", !1);
			case "count": return new O("!edgeName", !0, "retainedSize", !1);
			case "addedSize": return new O("selfSize", e, "!edgeName", !0);
			case "removedSize": return new O("selfSize", e, "!edgeName", !0);
			case "shallowSize": return new O("selfSize", e, "!edgeName", !0);
			case "retainedSize": return new O("retainedSize", e, "!edgeName", !0);
			default: return new O("!edgeName", !0, "retainedSize", !1);
		}
	}
}, ar = class extends H {
	nameInternal;
	nodeFilter;
	distance;
	count;
	shallowSize;
	retainedSize;
	classKey;
	#e = new Intl.NumberFormat(d.instance().locale);
	constructor(e, t, n, r) {
		super(e, n.count > 0), this.nameInternal = n.name, this.nodeFilter = r, this.distance = n.distance, this.count = n.count, this.shallowSize = n.self, this.retainedSize = n.maxRet, this.classKey = t;
		let i = e.snapshot, o = this.retainedSize / i.totalSize * 100, s = this.shallowSize / i.totalSize * 100;
		this.data = {
			object: this.nameInternal,
			count: this.#e.format(this.count),
			distance: this.toUIDistance(this.distance),
			shallowSize: f(this.shallowSize),
			retainedSize: f(this.retainedSize),
			"shallowSize-percent": this.toPercentString(s),
			"retainedSize-percent": this.toPercentString(o),
			"shallowSize-tooltip": a(this.shallowSize),
			"retainedSize-tooltip": a(this.retainedSize)
		};
	}
	get name() {
		return this.nameInternal;
	}
	createProvider() {
		return this.dataGridInternal.snapshot.createNodesProviderForClass(this.classKey, this.nodeFilter);
	}
	async populateNodeBySnapshotObjectId(e) {
		this.dataGridInternal.resetNameFilter(), await this.expandWithoutPopulate();
		let t = await this.provider().nodePosition(e);
		if (t === -1) return this.collapse(), [];
		await this.populateChildren(t, null);
		let n = this.childForPosition(t);
		return n ? [this, n] : [];
	}
	filteredOut(e) {
		return this.nameInternal.toLowerCase().indexOf(e) === -1;
	}
	createCell(e) {
		let t = e === "object" ? super.createCell(e) : this.createValueCell(e);
		if (e === "object" && this.count > 1) {
			let e = ye`<span class="objects-count">×${this.data.count}</span>`;
			de(e, t);
		}
		return t;
	}
	createChildNode(e) {
		return new ir(this.dataGridInternal, this.dataGridInternal.snapshot, e, !1);
	}
	comparator() {
		let e = this.dataGridInternal.isSortOrderAscending(), t = this.dataGridInternal.sortColumnId();
		switch (t) {
			case "object": return new O("name", e, "id", !0);
			case "distance": return new O("distance", e, "retainedSize", !1);
			case "shallowSize": return new O("selfSize", e, "id", !0);
			case "retainedSize": return new O("retainedSize", e, "id", !0);
			default: throw Error(`Invalid sort column id ${t}`);
		}
	}
}, or = class {
	addedNodesProvider;
	deletedNodesProvider;
	addedCount;
	removedCount;
	constructor(e, t, n, r) {
		this.addedNodesProvider = e, this.deletedNodesProvider = t, this.addedCount = n, this.removedCount = r;
	}
	dispose() {
		this.addedNodesProvider.dispose(), this.deletedNodesProvider.dispose();
	}
	nodePosition(e) {
		throw Error("Unreachable");
	}
	isEmpty() {
		return Promise.resolve(!1);
	}
	async serializeItemsRange(e, t) {
		let n, r;
		if (e < this.addedCount) {
			n = await this.addedNodesProvider.serializeItemsRange(e, t);
			for (let e of n.items) e.isAddedNotRemoved = !0;
			if (n.endPosition >= t) return n.totalLength = this.addedCount + this.removedCount, n;
			r = n, n = await this.deletedNodesProvider.serializeItemsRange(0, t - n.endPosition);
		} else r = new qt(0, 0, 0, []), n = await this.deletedNodesProvider.serializeItemsRange(e - this.addedCount, t - this.addedCount);
		r.items.length || (r.startPosition = this.addedCount + n.startPosition);
		for (let e of n.items) e.isAddedNotRemoved = !1;
		return r.items.push(...n.items), r.endPosition = this.addedCount + n.endPosition, r.totalLength = this.addedCount + this.removedCount, r;
	}
	async sortAndRewind(e) {
		await this.addedNodesProvider.sortAndRewind(e), await this.deletedNodesProvider.sortAndRewind(e);
	}
}, sr = class extends H {
	nameInternal;
	addedCount;
	removedCount;
	countDelta;
	addedSize;
	removedSize;
	sizeDelta;
	deletedIndexes;
	classKey;
	constructor(e, t, n) {
		super(e, !0), this.nameInternal = n.name, this.addedCount = n.addedCount, this.removedCount = n.removedCount, this.countDelta = n.countDelta, this.addedSize = n.addedSize, this.removedSize = n.removedSize, this.sizeDelta = n.sizeDelta, this.deletedIndexes = n.deletedIndexes, this.classKey = t, this.data = {
			object: this.nameInternal,
			addedCount: Ke(this.addedCount),
			removedCount: Ke(this.removedCount),
			countDelta: this.signForDelta(this.countDelta) + Ke(Math.abs(this.countDelta)),
			addedSize: a(this.addedSize),
			removedSize: a(this.removedSize),
			sizeDelta: this.signForDelta(this.sizeDelta) + a(Math.abs(this.sizeDelta))
		};
	}
	get name() {
		return this.nameInternal;
	}
	createProvider() {
		let e = this.dataGridInternal;
		if (e.snapshot === null || e.baseSnapshot?.uid === void 0) throw Error("Data sources have not been set correctly");
		let t = e.snapshot.createAddedNodesProvider(e.baseSnapshot.uid, this.classKey), n = e.baseSnapshot.createDeletedNodesProvider(this.deletedIndexes);
		if (!t || !n) throw Error("Failed to create node providers");
		return new or(t, n, this.addedCount, this.removedCount);
	}
	createCell(e) {
		let t = super.createCell(e);
		return e !== "object" && t.classList.add("numeric-column"), t;
	}
	createChildNode(e) {
		let t = this.dataGridInternal;
		if (e.isAddedNotRemoved) {
			if (t.snapshot === null) throw Error("Data sources have not been set correctly");
			return new ir(this.dataGridInternal, t.snapshot, e, !1);
		}
		if (t.baseSnapshot === void 0) throw Error("Data sources have not been set correctly");
		return new ir(this.dataGridInternal, t.baseSnapshot, e, !0);
	}
	comparator() {
		let e = this.dataGridInternal.isSortOrderAscending(), t = this.dataGridInternal.sortColumnId();
		switch (t) {
			case "object": return new O("name", e, "id", !0);
			case "addedCount": return new O("name", !0, "id", !0);
			case "removedCount": return new O("name", !0, "id", !0);
			case "countDelta": return new O("name", !0, "id", !0);
			case "addedSize": return new O("selfSize", e, "id", !0);
			case "removedSize": return new O("selfSize", e, "id", !0);
			case "sizeDelta": return new O("selfSize", e, "id", !0);
			default: throw Error(`Invalid sort column ${t}`);
		}
	}
	filteredOut(e) {
		return this.nameInternal.toLowerCase().indexOf(e) === -1;
	}
	signForDelta(e) {
		return e === 0 ? "" : e > 0 ? "+" : "−";
	}
}, cr = class e extends H {
	populated;
	allocationNode;
	constructor(e, t) {
		super(e, t.hasChildren), this.populated = !1, this.allocationNode = t, this.data = {
			liveCount: Ke(t.liveCount),
			count: Ke(t.count),
			liveSize: a(t.liveSize),
			size: a(t.size),
			name: t.name
		};
	}
	populate() {
		this.populated || this.doPopulate();
	}
	async doPopulate() {
		this.populated = !0;
		let t = await this.dataGridInternal.snapshot.allocationNodeCallers(this.allocationNode.id), n = t.nodesWithSingleCaller, r = this, i = this.dataGridInternal;
		for (let t of n) {
			let n = new e(i, t);
			i.appendNode(r, n), r = n, r.populated = !0, this.expanded && r.expand();
		}
		let a = t.branchingCallers;
		a.sort(this.dataGridInternal.createComparator());
		for (let t of a) i.appendNode(r, new e(i, t));
		i.updateVisibleNodes(!0);
	}
	expand() {
		super.expand(), this.children.length === 1 && this.children[0].expand();
	}
	createCell(e) {
		if (e !== "name") return this.createValueCell(e);
		let t = super.createCell(e), n = this.allocationNode, r = this.dataGridInternal.heapProfilerModel();
		if (n.scriptId) {
			let e = this.dataGridInternal.linkifier.linkifyScriptLocation(r ? r.target() : null, String(n.scriptId), n.scriptName, n.line - 1, {
				columnNumber: n.column - 1,
				inlineFrameIndex: 0,
				className: "profile-node-file"
			});
			e.style.maxWidth = "75%", t.insertBefore(e, t.firstChild);
		}
		return t;
	}
	allocationNodeId() {
		return this.allocationNode.id;
	}
}, lr = /* @__PURE__ */ e({
	AllocationDataGrid: () => xr,
	HeapSnapshotConstructorsDataGrid: () => yr,
	HeapSnapshotContainmentDataGrid: () => gr,
	HeapSnapshotDiffDataGrid: () => br,
	HeapSnapshotRetainmentDataGrid: () => _r,
	HeapSnapshotRetainmentDataGridEvents: () => vr,
	HeapSnapshotSortableDataGrid: () => pr,
	HeapSnapshotSortableDataGridEvents: () => mr,
	HeapSnapshotViewportDataGrid: () => hr
}), U = {
	distanceFromWindowObject: "Distance from window object",
	sizeOfTheObjectItselfInBytes: "Size of the object itself in bytes",
	sizeOfTheObjectPlusTheGraphIt: "Size of the object plus the graph it retains in bytes",
	object: "Object",
	distance: "Distance",
	shallowSize: "Shallow Size",
	retainedSize: "Retained Size",
	heapSnapshotRetainment: "Heap Snapshot Retainment",
	constructorString: "Constructor",
	heapSnapshotConstructors: "Heap Snapshot Constructors",
	New: "# New",
	Deleted: "# Deleted",
	Delta: "# Delta",
	allocSize: "Alloc. Size",
	freedSize: "Freed Size",
	sizeDelta: "Size Delta",
	heapSnapshotDiff: "Heap Snapshot Diff",
	liveCount: "Live Count",
	count: "Count",
	liveSize: "Live Size",
	size: "Size",
	function: "Function",
	allocation: "Allocation"
}, ur = o("panels/profiler/HeapSnapshotDataGrids.ts", U), W = r.bind(void 0, ur), dr = /* @__PURE__ */ new WeakMap(), fr = class extends At {}, pr = class extends t(fr) {
	snapshot = null;
	selectedNode = null;
	heapProfilerModelInternal;
	dataDisplayDelegateInternal;
	recursiveSortingDepth = 0;
	populatedAndSorted = !1;
	nameFilter = null;
	nodeFilterInternal;
	lastSortColumnId;
	lastSortAscending;
	constructor(e, t, n) {
		super(n), this.heapProfilerModelInternal = e, this.dataDisplayDelegateInternal = t;
		let r = [
			["distance", W(U.distanceFromWindowObject)],
			["shallowSize", W(U.sizeOfTheObjectItselfInBytes)],
			["retainedSize", W(U.sizeOfTheObjectPlusTheGraphIt)]
		];
		for (let e of r) {
			let t = this.headerTableHeader(e[0]);
			t && t.setAttribute("title", e[1]);
		}
		this.recursiveSortingDepth = 0, this.populatedAndSorted = !1, this.nameFilter = null, this.nodeFilterInternal = new k(), this.addEventListener("SortingComplete", this.sortingComplete, this), this.addEventListener(D.SORTING_CHANGED, this.sortingChanged, this), this.setRowContextMenuCallback(this.populateContextMenu.bind(this));
	}
	async setDataSource(e, t) {}
	isFilteredOut(e) {
		let t = this.nameFilter ? this.nameFilter.value().toLowerCase() : "";
		return !!(t && (e instanceof sr || e instanceof ar) && e.filteredOut(t));
	}
	heapProfilerModel() {
		return this.heapProfilerModelInternal;
	}
	dataDisplayDelegate() {
		return this.dataDisplayDelegateInternal;
	}
	nodeFilter() {
		return this.nodeFilterInternal;
	}
	setNameFilter(e) {
		this.nameFilter = e;
	}
	defaultPopulateCount() {
		return 100;
	}
	disposeAllNodes() {
		let e = this.topLevelNodes();
		for (let t = 0, n = e.length; t < n; ++t) e[t].dispose();
	}
	wasShown() {
		super.wasShown(), this.nameFilter && (this.nameFilter.addEventListener(Le.Event.TEXT_CHANGED, this.onNameFilterChanged, this), this.updateVisibleNodes(!0)), this.populatedAndSorted && this.dispatchEventToListeners("ContentShown", this);
	}
	sortingComplete() {
		this.removeEventListener("SortingComplete", this.sortingComplete, this), this.populatedAndSorted = !0, this.dispatchEventToListeners("ContentShown", this);
	}
	willHide() {
		super.willHide(), this.nameFilter && this.nameFilter.removeEventListener(Le.Event.TEXT_CHANGED, this.onNameFilterChanged, this);
	}
	populateContextMenu(e, t) {
		let n = t;
		n.populateContextMenu(e, this.dataDisplayDelegateInternal, this.heapProfilerModel()), n instanceof tr && n.linkElement && e.appendApplicableItems(n.linkElement);
	}
	resetSortingCache() {
		delete this.lastSortColumnId, delete this.lastSortAscending;
	}
	topLevelNodes() {
		return this.rootNode().children;
	}
	revealObjectByHeapSnapshotId(e) {
		return Promise.resolve(null);
	}
	resetNameFilter() {
		this.nameFilter && this.nameFilter.setValue("");
	}
	onNameFilterChanged() {
		this.updateVisibleNodes(!0), this.deselectFilteredNodes();
	}
	deselectFilteredNodes() {
		let e = this.selectedNode;
		for (; e;) {
			if (this.selectedNode && this.isFilteredOut(e)) {
				this.selectedNode.deselect(), this.selectedNode = null;
				return;
			}
			e = e.parent;
		}
	}
	sortFields(e, t) {
		throw Error("Not implemented");
	}
	sortingChanged() {
		let e = this.isSortOrderAscending(), t = this.sortColumnId();
		if (this.lastSortColumnId === t && this.lastSortAscending === e) return;
		this.lastSortColumnId = t, this.lastSortAscending = e;
		let n = this.sortFields(t || "", e);
		function r(e, t) {
			let r = e[n.fieldName1], i = t[n.fieldName1], a = r < i ? -1 : +(r > i);
			return n.ascending1 || (a = -a), a === 0 ? (r = e[n.fieldName2], i = t[n.fieldName2], a = r < i ? -1 : +(r > i), n.ascending2 || (a = -a), a) : a;
		}
		this.performSorting(r);
	}
	performSorting(e) {
		this.recursiveSortingEnter();
		let t = this.allChildren(this.rootNode());
		this.rootNode().removeChildren(), t.sort(e);
		for (let e = 0, n = t.length; e < n; ++e) {
			let n = t[e];
			this.appendChildAfterSorting(n), n.populated && n.sort();
		}
		this.recursiveSortingLeave();
	}
	appendChildAfterSorting(e) {
		let t = e.revealed;
		this.rootNode().appendChild(e), e.revealed = t;
	}
	recursiveSortingEnter() {
		++this.recursiveSortingDepth;
	}
	recursiveSortingLeave() {
		this.recursiveSortingDepth && (--this.recursiveSortingDepth || (this.updateVisibleNodes(!0), this.dispatchEventToListeners("SortingComplete")));
	}
	updateVisibleNodes(e) {}
	allChildren(e) {
		return e.children;
	}
	insertChild(e, t, n) {
		e.insertChild(t, n);
	}
	removeChildByIndex(e, t) {
		e.removeChild(e.children[t]);
	}
	removeAllChildren(e) {
		e.removeChildren();
	}
	async dataSourceChanged() {
		throw Error("Not implemented");
	}
}, mr = /* @__PURE__ */ function(e) {
	return e.ContentShown = "ContentShown", e.SortingComplete = "SortingComplete", e.ExpandRetainersComplete = "ExpandRetainersComplete", e;
}({}), hr = class extends pr {
	topPaddingHeight;
	bottomPaddingHeight;
	selectedNode;
	scrollToResolveCallback;
	constructor(e, t, n) {
		super(e, t, n), this.scrollContainer.addEventListener("scroll", this.onScroll.bind(this), !0), this.topPaddingHeight = 0, this.bottomPaddingHeight = 0, this.selectedNode = null;
	}
	topLevelNodes() {
		return this.allChildren(this.rootNode());
	}
	appendChildAfterSorting(e) {}
	updateVisibleNodes(e) {
		let t = this.scrollContainer.scrollHeight, n = this.scrollContainer.scrollTop, r = t - n - this.scrollContainer.offsetHeight;
		n = Math.max(0, n - 40), r = Math.max(0, r - 40);
		let i = t - n - r;
		if (!e && n >= this.topPaddingHeight && r >= this.bottomPaddingHeight) return;
		n -= 500, i += 1e3;
		let a = this.selectedNode;
		this.rootNode().removeChildren(), this.topPaddingHeight = 0, this.bottomPaddingHeight = 0, this.addVisibleNodes(this.rootNode(), n, n + i), this.setVerticalPadding(this.topPaddingHeight, this.bottomPaddingHeight), a && (a.parent ? a.select(!0) : this.selectedNode = a);
	}
	addVisibleNodes(e, t, n) {
		if (!e.expanded) return 0;
		let r = this.allChildren(e), i = 0, a = 0;
		for (; a < r.length; ++a) {
			let e = r[a];
			if (this.isFilteredOut(e)) continue;
			let n = i + this.nodeHeight(e);
			if (n > t) break;
			i = n;
		}
		let o = i;
		for (; a < r.length && o < n; ++a) {
			let i = r[a];
			if (this.isFilteredOut(i)) continue;
			let s = i.hasChildren();
			i.removeChildren(), i.setHasChildren(s), e.appendChild(i), o += i.nodeSelfHeight(), o += this.addVisibleNodes(i, t - o, n - o);
		}
		let s = 0;
		for (; a < r.length; ++a) {
			let e = r[a];
			this.isFilteredOut(e) || (s += this.nodeHeight(e));
		}
		return this.topPaddingHeight += i, this.bottomPaddingHeight += s, o + s;
	}
	nodeHeight(e) {
		let t = e.nodeSelfHeight();
		if (!e.expanded) return t;
		let n = this.allChildren(e);
		for (let e = 0; e < n.length; e++) t += this.nodeHeight(n[e]);
		return t;
	}
	revealTreeNode(e) {
		let t = this.calculateOffset(e), n = e[e.length - 1], r = this.scrollContainer.scrollTop, i = r + this.scrollContainer.offsetHeight;
		return t >= r && t < i ? Promise.resolve(n) : (this.scrollContainer.scrollTop = Math.max(0, t - 40), new Promise((e) => {
			console.assert(!this.scrollToResolveCallback), this.scrollToResolveCallback = e.bind(null, n), this.scrollContainer.window().requestAnimationFrame(() => {
				this.scrollToResolveCallback &&= (this.scrollToResolveCallback(), null);
			});
		}));
	}
	calculateOffset(e) {
		let t = this.rootNode(), n = 0;
		if (e.length === 0) return 0;
		for (let r = 0; r < e.length; ++r) {
			let i = e[r], a = this.allChildren(t);
			for (let e = 0; e < a.length; ++e) {
				let t = a[e];
				if (i === t) {
					n += i.nodeSelfHeight();
					break;
				}
				n += this.nodeHeight(t);
			}
			t = i;
		}
		return n - e[e.length - 1].nodeSelfHeight();
	}
	allChildren(e) {
		let t = dr.get(e) || [];
		return dr.has(e) || dr.set(e, t), t;
	}
	appendNode(e, t) {
		this.allChildren(e).push(t);
	}
	insertChild(e, t, n) {
		this.allChildren(e).splice(n, 0, t);
	}
	removeChildByIndex(e, t) {
		this.allChildren(e).splice(t, 1);
	}
	removeAllChildren(e) {
		dr.delete(e);
	}
	removeTopLevelNodes() {
		this.disposeAllNodes(), this.rootNode().removeChildren(), this.removeAllChildren(this.rootNode());
	}
	onResize() {
		super.onResize(), this.updateVisibleNodes(!1);
	}
	onScroll(e) {
		this.updateVisibleNodes(!1), this.scrollToResolveCallback &&= (this.scrollToResolveCallback(), null);
	}
}, gr = class extends pr {
	constructor(e, t, n, r) {
		let i = [
			{
				id: "object",
				title: W(U.object),
				disclosure: !0,
				sortable: !0
			},
			{
				id: "distance",
				title: W(U.distance),
				width: "70px",
				sortable: !0,
				fixedWidth: !0
			},
			{
				id: "shallowSize",
				title: W(U.shallowSize),
				width: "110px",
				sortable: !0,
				fixedWidth: !0
			},
			{
				id: "retainedSize",
				title: W(U.retainedSize),
				width: "110px",
				sortable: !0,
				fixedWidth: !0,
				sort: E.Descending
			}
		];
		r ||= i, super(e, t, {
			displayName: n,
			columns: r
		});
	}
	async setDataSource(e, t, n) {
		this.snapshot = e;
		let r = new Ut(n ?? -1, "root", 0, t || e.rootNodeIndex, 0, 0, "");
		this.setRootNode(this.createRootNode(e, r)), this.rootNode().sort();
	}
	createRootNode(e, t) {
		let n = new Ht("", t, "", -1);
		return new nr(this, e, n, null);
	}
	sortingChanged() {
		let e = this.rootNode();
		e.hasChildren() && e.sort();
	}
}, _r = class extends gr {
	resetRetainersButton;
	constructor(e, t) {
		let n = [
			{
				id: "object",
				title: W(U.object),
				disclosure: !0,
				sortable: !0
			},
			{
				id: "distance",
				title: W(U.distance),
				width: "70px",
				sortable: !0,
				fixedWidth: !0,
				sort: E.Ascending
			},
			{
				id: "shallowSize",
				title: W(U.shallowSize),
				width: "110px",
				sortable: !0,
				fixedWidth: !0
			},
			{
				id: "retainedSize",
				title: W(U.retainedSize),
				width: "110px",
				sortable: !0,
				fixedWidth: !0
			}
		];
		super(e, t, W(U.heapSnapshotRetainment), n);
	}
	createRootNode(e, t) {
		let n = new Ht("", t, "", -1);
		return new rr(this, e, n, null);
	}
	sortFields(e, t) {
		switch (e) {
			case "object": return new O("name", t, "count", !1);
			case "count": return new O("count", t, "name", !0);
			case "shallowSize": return new O("shallowSize", t, "name", !0);
			case "retainedSize": return new O("retainedSize", t, "name", !0);
			case "distance": return new O("distance", t, "name", !0);
			default: throw Error(`Unknown column ${e}`);
		}
	}
	reset() {
		this.rootNode().removeChildren(), this.resetSortingCache();
	}
	updateResetButtonVisibility() {
		this.snapshot?.areNodesIgnoredInRetainersView().then((e) => {
			this.resetRetainersButton?.setVisible(e);
		});
	}
	async setDataSource(e, t, n) {
		await super.setDataSource(e, t, n), this.rootNode().expand(), this.updateResetButtonVisibility();
	}
	async dataSourceChanged() {
		this.reset(), await this.rootNode().sort(), this.rootNode().expand(), this.updateResetButtonVisibility();
	}
}, vr = /* @__PURE__ */ function(e) {
	return e.ExpandRetainersComplete = "ExpandRetainersComplete", e;
}({}), yr = class extends hr {
	profileIndex = -1;
	objectIdToSelect = null;
	nextRequestedFilter = null;
	lastFilter;
	filterInProgress;
	constructor(e, t) {
		let n = [
			{
				id: "object",
				title: W(U.constructorString),
				disclosure: !0,
				sortable: !0
			},
			{
				id: "distance",
				title: W(U.distance),
				width: "70px",
				sortable: !0,
				fixedWidth: !0
			},
			{
				id: "shallowSize",
				title: W(U.shallowSize),
				width: "110px",
				sortable: !0,
				fixedWidth: !0
			},
			{
				id: "retainedSize",
				title: W(U.retainedSize),
				width: "110px",
				sort: E.Descending,
				sortable: !0,
				fixedWidth: !0
			}
		];
		super(e, t, {
			displayName: W(U.heapSnapshotConstructors).toString(),
			columns: n
		});
	}
	sortFields(e, t) {
		switch (e) {
			case "object": return new O("name", t, "retainedSize", !1);
			case "distance": return new O("distance", t, "retainedSize", !1);
			case "shallowSize": return new O("shallowSize", t, "name", !0);
			case "retainedSize": return new O("retainedSize", t, "name", !0);
			default: throw Error(`Unknown column ${e}`);
		}
	}
	async revealObjectByHeapSnapshotId(e) {
		if (!this.snapshot) return this.objectIdToSelect = e, null;
		let t = await this.snapshot.nodeClassKey(parseInt(e, 10));
		if (!t) return null;
		let n = this.topLevelNodes().find((e) => e.classKey === t);
		if (!n) return null;
		let r = await n.populateNodeBySnapshotObjectId(parseInt(e, 10));
		return r.length ? await this.revealTreeNode(r) : null;
	}
	clear() {
		this.nextRequestedFilter = null, this.lastFilter = null, this.removeTopLevelNodes();
	}
	async setDataSource(e, t) {
		this.snapshot = e, this.profileIndex === -1 && this.populateChildren(), this.objectIdToSelect &&= (this.revealObjectByHeapSnapshotId(this.objectIdToSelect), null);
	}
	setSelectionRange(e, t) {
		this.nodeFilterInternal = new k(e, t), this.populateChildren(this.nodeFilterInternal);
	}
	setAllocationNodeId(e) {
		this.nodeFilterInternal = new k(), this.nodeFilterInternal.allocationNodeId = e, this.populateChildren(this.nodeFilterInternal);
	}
	aggregatesReceived(e, t) {
		this.filterInProgress = null, this.nextRequestedFilter && this.snapshot && (this.snapshot.aggregatesWithFilter(this.nextRequestedFilter).then(this.aggregatesReceived.bind(this, this.nextRequestedFilter)), this.filterInProgress = this.nextRequestedFilter, this.nextRequestedFilter = null), this.removeTopLevelNodes(), this.resetSortingCache();
		for (let n in t) this.appendNode(this.rootNode(), new ar(this, n, t[n], e));
		this.sortingChanged(), this.lastFilter = e;
	}
	async populateChildren(e) {
		let t = e || new k();
		if (this.filterInProgress) {
			this.nextRequestedFilter = this.filterInProgress.equals(t) ? null : t;
			return;
		}
		if (!this.lastFilter?.equals(t) && (this.filterInProgress = t, this.snapshot)) {
			let e = await this.snapshot.aggregatesWithFilter(t);
			this.aggregatesReceived(t, e);
		}
	}
	filterSelectIndexChanged(e, t, n) {
		if (this.profileIndex = t, this.nodeFilterInternal = void 0, t !== -1) {
			let n = t > 0 ? e[t - 1].maxJSObjectId : 0, r = e[t].maxJSObjectId;
			this.nodeFilterInternal = new k(n, r);
		} else n !== void 0 && (this.nodeFilterInternal = new k(), this.nodeFilterInternal.filterName = n);
		this.populateChildren(this.nodeFilterInternal);
	}
}, br = class extends hr {
	baseSnapshot;
	constructor(e, t) {
		let n = [
			{
				id: "object",
				title: W(U.constructorString),
				disclosure: !0,
				sortable: !0
			},
			{
				id: "addedCount",
				title: W(U.New),
				width: "75px",
				sortable: !0,
				fixedWidth: !0
			},
			{
				id: "removedCount",
				title: W(U.Deleted),
				width: "75px",
				sortable: !0,
				fixedWidth: !0
			},
			{
				id: "countDelta",
				title: W(U.Delta),
				width: "65px",
				sortable: !0,
				fixedWidth: !0
			},
			{
				id: "addedSize",
				title: W(U.allocSize),
				width: "75px",
				sortable: !0,
				fixedWidth: !0,
				sort: E.Descending
			},
			{
				id: "removedSize",
				title: W(U.freedSize),
				width: "75px",
				sortable: !0,
				fixedWidth: !0
			},
			{
				id: "sizeDelta",
				title: W(U.sizeDelta),
				width: "75px",
				sortable: !0,
				fixedWidth: !0
			}
		];
		super(e, t, {
			displayName: W(U.heapSnapshotDiff).toString(),
			columns: n
		});
	}
	defaultPopulateCount() {
		return 50;
	}
	sortFields(e, t) {
		switch (e) {
			case "object": return new O("name", t, "count", !1);
			case "addedCount": return new O("addedCount", t, "name", !0);
			case "removedCount": return new O("removedCount", t, "name", !0);
			case "countDelta": return new O("countDelta", t, "name", !0);
			case "addedSize": return new O("addedSize", t, "name", !0);
			case "removedSize": return new O("removedSize", t, "name", !0);
			case "sizeDelta": return new O("sizeDelta", t, "name", !0);
			default: throw Error(`Unknown column ${e}`);
		}
	}
	async setDataSource(e, t) {
		this.snapshot = e;
	}
	setBaseDataSource(e) {
		if (this.baseSnapshot = e, this.removeTopLevelNodes(), this.resetSortingCache(), this.baseSnapshot === this.snapshot) {
			this.dispatchEventToListeners("SortingComplete");
			return;
		}
		this.populateChildren();
	}
	async populateChildren() {
		if (this.snapshot === null || this.baseSnapshot?.uid === void 0) throw Error("Data sources have not been set correctly");
		let e = await this.snapshot.interfaceDefinitions(), t = await this.baseSnapshot.aggregatesForDiff(e), n = await this.snapshot.calculateSnapshotDiff(this.baseSnapshot.uid, t);
		for (let e in n) {
			let t = n[e];
			this.appendNode(this.rootNode(), new sr(this, e, t));
		}
		this.sortingChanged();
	}
}, xr = class extends hr {
	linkifierInternal;
	topNodes;
	constructor(e, t) {
		let n = [
			{
				id: "liveCount",
				title: W(U.liveCount),
				width: "75px",
				sortable: !0,
				fixedWidth: !0
			},
			{
				id: "count",
				title: W(U.count),
				width: "65px",
				sortable: !0,
				fixedWidth: !0
			},
			{
				id: "liveSize",
				title: W(U.liveSize),
				width: "75px",
				sortable: !0,
				fixedWidth: !0
			},
			{
				id: "size",
				title: W(U.size),
				width: "75px",
				sortable: !0,
				fixedWidth: !0,
				sort: E.Descending
			},
			{
				id: "name",
				title: W(U.function),
				disclosure: !0,
				sortable: !0
			}
		];
		super(e, t, {
			displayName: W(U.allocation).toString(),
			columns: n
		}), this.linkifierInternal = new T();
	}
	get linkifier() {
		return this.linkifierInternal;
	}
	dispose() {
		this.linkifierInternal.reset();
	}
	async setDataSource(e, t) {
		this.snapshot = e, this.topNodes = await this.snapshot.allocationTracesTops(), this.populateChildren();
	}
	populateChildren() {
		this.removeTopLevelNodes();
		let e = this.rootNode(), t = this.topNodes || [];
		for (let n of t) this.appendNode(e, new cr(this, n));
		this.updateVisibleNodes(!0);
	}
	sortingChanged() {
		this.topNodes !== void 0 && (this.topNodes.sort(this.createComparator()), this.rootNode().removeChildren(), this.populateChildren());
	}
	createComparator() {
		let e = this.sortColumnId(), t = this.sortOrder() === E.Ascending ? 1 : -1;
		function n(n, r) {
			return n[e] > r[e] ? t : n[e] < r[e] ? -t : 0;
		}
		return n;
	}
}, Sr = {
	buildingEdgeIndexes: "Building edge indexes…",
	buildingRetainers: "Building retainers…",
	propagatingDomState: "Propagating DOM state…",
	calculatingNodeFlags: "Calculating node flags…",
	calculatingDistances: "Calculating distances…",
	calculatingShallowSizes: "Calculating shallow sizes…",
	calculatingRetainedSizes: "Calculating retained sizes…",
	buildingDominatedNodes: "Building dominated nodes…",
	calculatingObjectNames: "Calculating object names…",
	calculatingStatistics: "Calculating statistics…",
	calculatingSamples: "Calculating samples…",
	buildingLocations: "Building locations…",
	finishedProcessing: "Finished processing.",
	buildingAllocationStatistics: "Building allocation statistics…",
	done: "Done",
	processingSnapshot: "Processing snapshot…",
	parsingStrings: "Parsing strings…",
	loadingSnapshotInfo: "Loading snapshot info…",
	loadingNodesD: "Loading nodes… {PH1}%",
	loadingEdgesD: "Loading edges… {PH1}%",
	loadingAllocationTracesD: "Loading allocation traces… {PH1}%",
	loadingSamples: "Loading samples…",
	loadingLocations: "Loading locations…",
	loadingStrings: "Loading strings…"
}, Cr = /* @__PURE__ */ e({
	AllocationPerspective: () => jr,
	ComparisonPerspective: () => kr,
	ContainmentPerspective: () => Ar,
	HeapAllocationStackView: () => Rr,
	HeapProfileHeader: () => J,
	HeapSnapshotProfileType: () => Nr,
	HeapSnapshotProfileTypeEvents: () => Pr,
	HeapSnapshotStatisticsView: () => Lr,
	HeapSnapshotView: () => Dr,
	Perspective: () => q,
	StatisticsPerspective: () => Mr,
	SummaryPerspective: () => Or,
	TrackingHeapSnapshotProfileType: () => Fr,
	TrackingHeapSnapshotProfileTypeEvents: () => Ir
}), G = {
	find: "Find",
	containment: "Containment",
	retainers: "Retainers",
	allocationStack: "Allocation stack",
	perspective: "Perspective",
	baseSnapshot: "Base snapshot",
	filter: "Filter",
	filterByClass: "Filter by class",
	code: "Code",
	strings: "Strings",
	jsArrays: "JS arrays",
	typedArrays: "Typed arrays",
	systemObjects: "System objects",
	otherJSObjects: "Other JS objects",
	otherNonJSObjects: "Other non-JS objects (such as HTML and CSS)",
	selectedSizeS: "Selected size: {PH1}",
	allObjects: "All objects",
	objectsAllocatedBeforeS: "Objects allocated before {PH1}",
	objectsAllocatedBetweenSAndS: "Objects allocated between {PH1} and {PH2}",
	duplicatedStrings: "Duplicated strings",
	objectsRetainedByDetachedDomNodes: "Objects retained by detached DOM nodes",
	objectsRetainedByConsole: "Objects retained by DevTools Console",
	objectsRetainedByEventHandlers: "Objects retained by Event Handlers",
	summary: "Summary",
	comparison: "Comparison",
	allocation: "Allocation",
	liveObjects: "Live objects",
	statistics: "Statistics",
	heapSnapshot: "Heap snapshot",
	takeHeapSnapshot: "Take heap snapshot",
	heapSnapshots: "Heap snapshots",
	heapSnapshotProfilesShowMemory: "See the memory distribution of JavaScript objects and related DOM nodes",
	snapshotting: "Snapshotting…",
	snapshotD: "Snapshot {PH1}",
	percentagePlaceholder: "{PH1}%",
	allocationInstrumentationOn: "Allocations on timeline",
	stopRecordingHeapProfile: "Stop recording heap profile",
	startRecordingHeapProfile: "Start recording heap profile",
	recordAllocationStacksExtra: "Allocation stack traces (more overhead)",
	recording: "Recording…",
	allocationTimelines: "Allocation timelines",
	AllocationTimelinesShowInstrumented: "Record memory allocations over time and isolate memory leaks by selecting intervals with allocations that are still alive",
	loading: "Loading…",
	savingD: "Saving… {PH1}%",
	heapMemoryUsage: "Heap memory usage",
	stackWasNotRecordedForThisObject: "Stack wasn't recorded for this object because it had been allocated before this profile recording started.",
	restoreIgnoredRetainers: "Restore ignored retainers"
}, wr = o("panels/profiler/HeapSnapshotView.ts", G), K = r.bind(void 0, wr), Tr = o("panels/profiler/ModuleUIStrings.ts", Sr), Er = r.bind(void 0, Tr), Dr = class e extends Xe {
	searchResults = [];
	profile;
	linkifier;
	parentDataDisplayDelegate;
	searchableViewInternal;
	splitWidget;
	containmentDataGrid;
	containmentWidget;
	statisticsView;
	constructorsDataGrid;
	constructorsWidget;
	diffDataGrid;
	diffWidget;
	allocationDataGrid;
	allocationWidget;
	allocationStackView;
	tabbedPane;
	retainmentDataGrid;
	retainmentWidget;
	objectDetailsView;
	perspectives;
	comparisonPerspective;
	perspectiveSelect;
	baseSelect;
	filterSelect;
	classNameFilter;
	selectedSizeText;
	resetRetainersButton;
	popoverHelper;
	currentPerspectiveIndex;
	currentPerspective;
	dataGrid;
	searchThrottler;
	baseProfile;
	trackingOverviewGrid;
	currentSearchResultIndex = -1;
	currentSearch;
	#e;
	get currentQuery() {
		return this.currentSearch?.query;
	}
	set currentQuery(e) {
		this.currentSearch && (this.currentSearch.query = e);
	}
	constructor(e, t, n) {
		super({
			title: K(G.heapSnapshot),
			viewId: "heap-snapshot"
		}), this.#e = n, this.element.classList.add("heap-snapshot-view"), this.profile = t, this.linkifier = new T();
		let r = t.profileType();
		r.addEventListener("SnapshotReceived", this.onReceiveSnapshot, this), r.addEventListener(N.REMOVE_PROFILE_HEADER, this.onProfileHeaderRemoved, this);
		let i = r.id === Fr.TypeId;
		i && this.createOverview();
		let a = n.trackingHeapSnapshotProfileType.recordAllocationStacksSetting().get();
		this.parentDataDisplayDelegate = e, this.searchableViewInternal = new Ae(this, null), this.searchableViewInternal.setPlaceholder(K(G.find), K(G.find)), this.searchableViewInternal.show(this.element), this.splitWidget = new Ee(!1, !0, "heap-snapshot-split-view-state", 200, 200), this.splitWidget.show(this.searchableViewInternal.element);
		let o = t.heapProfilerModel();
		this.containmentDataGrid = new gr(o, this, K(G.containment)), this.containmentDataGrid.addEventListener(D.SELECTED_NODE, this.selectionChanged, this), this.containmentWidget = this.containmentDataGrid.asWidget(), this.containmentWidget.setMinimumSize(50, 25), this.statisticsView = new Lr(), this.constructorsDataGrid = new yr(o, this), this.constructorsDataGrid.addEventListener(D.SELECTED_NODE, this.selectionChanged, this), this.constructorsWidget = this.constructorsDataGrid.asWidget(), this.constructorsWidget.setMinimumSize(50, 25), this.constructorsWidget.element.setAttribute("jslog", `${it("heap-snapshot.constructors-view").track({ resize: !0 })}`), this.diffDataGrid = new br(o, this), this.diffDataGrid.addEventListener(D.SELECTED_NODE, this.selectionChanged, this), this.diffWidget = this.diffDataGrid.asWidget(), this.diffWidget.setMinimumSize(50, 25), this.allocationDataGrid = null, i && a && (this.allocationDataGrid = new xr(o, this), this.allocationDataGrid.addEventListener(D.SELECTED_NODE, this.onSelectAllocationNode, this), this.allocationWidget = this.allocationDataGrid.asWidget(), this.allocationWidget.setMinimumSize(50, 25), this.allocationStackView = new Rr(o), this.allocationStackView.setMinimumSize(50, 25), this.tabbedPane = new pe()), this.retainmentDataGrid = new _r(o, this), this.retainmentWidget = this.retainmentDataGrid.asWidget(), this.retainmentWidget.setMinimumSize(50, 21), this.retainmentWidget.element.classList.add("retaining-paths-view"), this.retainmentWidget.element.setAttribute("jslog", `${it("heap-snapshot.retaining-paths-view").track({ resize: !0 })}`);
		let s;
		if (this.allocationStackView) this.tabbedPane = new pe(), this.tabbedPane.appendTab("retainers", K(G.retainers), this.retainmentWidget), this.tabbedPane.appendTab("allocation-stack", K(G.allocationStack), this.allocationStackView), s = this.tabbedPane.headerElement(), this.objectDetailsView = this.tabbedPane;
		else {
			let e = document.createElement("div");
			e.classList.add("heap-snapshot-view-resizer");
			let t = e.createChild("div", "title");
			e.createChild("div", "verticalResizerIcon");
			let n = t.createChild("span");
			n.textContent = K(G.retainers), s = e, this.objectDetailsView = new b(), this.objectDetailsView.element.appendChild(e), this.retainmentWidget.show(this.objectDetailsView.element);
		}
		this.splitWidget.hideDefaultResizer(), this.splitWidget.installResizer(s), this.retainmentDataGrid.addEventListener(D.SELECTED_NODE, this.inspectedObjectChanged, this), this.retainmentDataGrid.reset(), this.perspectives = [], this.comparisonPerspective = new kr(), this.perspectives.push(new Or()), t.profileType() !== this.#e.trackingHeapSnapshotProfileType && this.perspectives.push(this.comparisonPerspective), this.perspectives.push(new Ar()), this.allocationWidget && this.perspectives.push(new jr()), this.perspectives.push(new Mr()), this.perspectiveSelect = new be(this.onSelectedPerspectiveChanged.bind(this), K(G.perspective), void 0, "profiler.heap-snapshot-perspective"), this.updatePerspectiveOptions(), this.baseSelect = new be(this.changeBase.bind(this), K(G.baseSnapshot), void 0, "profiler.heap-snapshot-base"), this.baseSelect.setVisible(!1), this.updateBaseOptions(), this.filterSelect = new be(this.changeFilter.bind(this), K(G.filter), void 0, "profiler.heap-snapshot-filter"), this.filterSelect.setVisible(!1), this.updateFilterOptions(), this.classNameFilter = new ie(K(G.filterByClass)), this.classNameFilter.setVisible(!1), this.constructorsDataGrid.setNameFilter(this.classNameFilter), this.diffDataGrid.setNameFilter(this.classNameFilter), this.selectedSizeText = new ut();
		let c = K(G.restoreIgnoredRetainers);
		this.resetRetainersButton = new y(c, "clear-list", c), this.resetRetainersButton.setVisible(!1), this.resetRetainersButton.addEventListener(y.Events.CLICK, async () => {
			await this.retainmentDataGrid.snapshot?.unignoreAllNodesInRetainersView(), await this.retainmentDataGrid.dataSourceChanged();
		}), this.retainmentDataGrid.resetRetainersButton = this.resetRetainersButton, this.popoverHelper = new pt(this.element, this.getPopoverRequest.bind(this), "profiler.heap-snapshot-object"), this.popoverHelper.setDisableOnClick(!0), this.element.addEventListener("scroll", this.popoverHelper.hidePopover.bind(this.popoverHelper), !0), this.currentPerspectiveIndex = 0, this.currentPerspective = this.perspectives[0], this.currentPerspective.activate(this), this.dataGrid = this.currentPerspective.masterGrid(this), this.populate(), this.searchThrottler = new Be(0);
		for (let e of this.profiles()) e.addEventListener(M.PROFILE_TITLE_CHANGED, this.updateControls, this);
	}
	createOverview() {
		let e = this.profile.profileType();
		this.trackingOverviewGrid = new Fn(), this.trackingOverviewGrid.addEventListener(In.IDS_RANGE_CHANGED, this.onIdsRangeChanged.bind(this)), !this.profile.fromFile() && e.profileBeingRecorded() === this.profile && (e.addEventListener("HeapStatsUpdate", this.onHeapStatsUpdate, this), e.addEventListener("TrackingStopped", this.onStopTracking, this), this.trackingOverviewGrid.start());
	}
	onStopTracking() {
		let e = this.profile.profileType();
		e.removeEventListener("HeapStatsUpdate", this.onHeapStatsUpdate, this), e.removeEventListener("TrackingStopped", this.onStopTracking, this), this.trackingOverviewGrid && this.trackingOverviewGrid.stop();
	}
	onHeapStatsUpdate({ data: e }) {
		this.trackingOverviewGrid && this.trackingOverviewGrid.setSamples(e);
	}
	searchableView() {
		return this.searchableViewInternal;
	}
	showProfile(e) {
		return this.parentDataDisplayDelegate.showProfile(e);
	}
	showObject(e, t) {
		Number(e) <= this.profile.maxJSObjectId ? this.selectLiveObject(t, e) : this.parentDataDisplayDelegate.showObject(e, t);
	}
	async linkifyObject(e) {
		let t = this.profile.heapProfilerModel();
		if (!t) return null;
		let n = await this.profile.getLocation(e);
		if (!n) return null;
		let r = t.runtimeModel().debuggerModel().createRawLocationByScriptId(String(n.scriptId), n.lineNumber, n.columnNumber);
		if (!r) return null;
		let i = r.script()?.sourceURL;
		return i && this.linkifier ? this.linkifier.linkifyRawLocation(r, i) : null;
	}
	async populate() {
		let e = await this.profile.loadPromise;
		if (this.retrieveStatistics(e), this.dataGrid && this.dataGrid.setDataSource(e, 0), this.profile.profileType().id === Fr.TypeId && this.profile.fromFile()) {
			let t = await e.getSamples();
			if (t) {
				console.assert(!!t.timestamps.length);
				let e = new Rn();
				e.sizes = t.sizes, e.ids = t.lastAssignedIds, e.timestamps = t.timestamps, e.max = t.sizes, e.totalTime = Math.max(t.timestamps[t.timestamps.length - 1] || 0, 1e4), this.trackingOverviewGrid && this.trackingOverviewGrid.setSamples(e);
			}
		}
		let t = this.profiles().indexOf(this.profile);
		this.baseSelect.setSelectedIndex(Math.max(0, t - 1)), this.trackingOverviewGrid && this.trackingOverviewGrid.updateGrid();
	}
	async retrieveStatistics(e) {
		let t = await e.getStatistics(), { v8heap: n, native: r } = t, i = n.total - n.code - n.strings - n.jsArrays - n.system, a = [
			{
				value: n.code,
				color: "var(--app-color-code)",
				title: K(G.code)
			},
			{
				value: n.strings,
				color: "var(--app-color-strings)",
				title: K(G.strings)
			},
			{
				value: n.jsArrays,
				color: "var(--app-color-js-arrays)",
				title: K(G.jsArrays)
			},
			{
				value: r.typedArrays,
				color: "var(--app-color-typed-arrays)",
				title: K(G.typedArrays)
			},
			{
				value: n.system,
				color: "var(--app-color-system)",
				title: K(G.systemObjects)
			},
			{
				value: i,
				color: "var(--app-color-other-js-objects)",
				title: K(G.otherJSObjects)
			},
			{
				value: r.total - r.typedArrays,
				color: "var(--app-color-other-non-js-objects)",
				title: K(G.otherNonJSObjects)
			}
		];
		return this.statisticsView.setTotalAndRecords(t.total, a), t;
	}
	onIdsRangeChanged(e) {
		let { minId: t, maxId: n } = e.data;
		this.selectedSizeText.setText(K(G.selectedSizeS, { PH1: a(e.data.size) })), this.constructorsDataGrid.snapshot && this.constructorsDataGrid.setSelectionRange(t, n);
	}
	async toolbarItems() {
		let e = [this.perspectiveSelect, this.classNameFilter];
		return this.profile.profileType() !== this.#e.trackingHeapSnapshotProfileType && e.push(this.baseSelect, this.filterSelect), e.push(this.selectedSizeText), e.push(this.resetRetainersButton), e;
	}
	willHide() {
		super.willHide(), this.currentSearchResultIndex = -1, this.popoverHelper.hidePopover();
	}
	supportsCaseSensitiveSearch() {
		return !0;
	}
	supportsWholeWordSearch() {
		return !1;
	}
	supportsRegexSearch() {
		return !1;
	}
	onSearchCanceled() {
		this.currentSearchResultIndex = -1, this.searchResults = [];
	}
	selectRevealedNode(e) {
		e && e.select();
	}
	performSearch(e, t, n) {
		let r = new Wt(e.query.trim(), e.caseSensitive, e.wholeWord, e.isRegex, t, n || !1);
		this.searchThrottler.schedule(this.performSearchInternal.bind(this, r));
	}
	async performSearchInternal(e) {
		if (this.onSearchCanceled(), !this.currentPerspective.supportsSearch()) return;
		this.currentSearch = e;
		let t = e.query.trim();
		if (!t) return;
		if (t.charAt(0) === "@") {
			let e = parseInt(t.substring(1), 10);
			if (isNaN(e) || !this.dataGrid) return;
			let n = await this.dataGrid.revealObjectByHeapSnapshotId(String(e));
			this.selectRevealedNode(n);
			return;
		}
		if (!this.profile.snapshotProxy || !this.dataGrid) return;
		let n = this.dataGrid.nodeFilter();
		this.searchResults = n ? await this.profile.snapshotProxy.search(this.currentSearch, n) : [], this.searchableViewInternal.updateSearchMatchesCount(this.searchResults.length), this.searchResults.length && (this.currentSearchResultIndex = e.jumpBackward ? this.searchResults.length - 1 : 0), await this.jumpToSearchResult(this.currentSearchResultIndex);
	}
	jumpToNextSearchResult() {
		this.searchResults.length && (this.currentSearchResultIndex = (this.currentSearchResultIndex + 1) % this.searchResults.length, this.searchThrottler.schedule(this.jumpToSearchResult.bind(this, this.currentSearchResultIndex)));
	}
	jumpToPreviousSearchResult() {
		this.searchResults.length && (this.currentSearchResultIndex = (this.currentSearchResultIndex + this.searchResults.length - 1) % this.searchResults.length, this.searchThrottler.schedule(this.jumpToSearchResult.bind(this, this.currentSearchResultIndex)));
	}
	async jumpToSearchResult(e) {
		if (this.searchableViewInternal.updateCurrentMatchIndex(e), e === -1 || !this.dataGrid) return;
		let t = await this.dataGrid.revealObjectByHeapSnapshotId(String(this.searchResults[e]));
		this.selectRevealedNode(t);
	}
	refreshVisibleData() {
		if (!this.dataGrid) return;
		let e = this.dataGrid.rootNode().children[0];
		for (; e;) e.refresh(), e = e.traverseNextNode(!1, null, !0);
	}
	changeBase() {
		if (this.baseProfile === this.profiles()[this.baseSelect.selectedIndex()]) return;
		this.baseProfile = this.profiles()[this.baseSelect.selectedIndex()];
		let e = this.dataGrid;
		e.snapshot && this.baseProfile.loadPromise.then(e.setBaseDataSource.bind(e)), this.currentSearch && this.searchResults && this.performSearch(this.currentSearch, !1);
	}
	static ALWAYS_AVAILABLE_FILTERS = [
		{
			uiName: K(G.duplicatedStrings),
			filterName: "duplicatedStrings"
		},
		{
			uiName: K(G.objectsRetainedByDetachedDomNodes),
			filterName: "objectsRetainedByDetachedDomNodes"
		},
		{
			uiName: K(G.objectsRetainedByConsole),
			filterName: "objectsRetainedByConsole"
		},
		{
			uiName: K(G.objectsRetainedByEventHandlers),
			filterName: "objectsRetainedByEventHandlers"
		}
	];
	changeFilter() {
		let t = this.filterSelect.selectedIndex(), n, r = this.filterSelect.size() - e.ALWAYS_AVAILABLE_FILTERS.length;
		t >= r && (n = e.ALWAYS_AVAILABLE_FILTERS[t - r].filterName, t = 0);
		let i = t - 1;
		this.dataGrid && (this.dataGrid.filterSelectIndexChanged(this.profiles(), i, n), this.currentSearch && this.searchResults && this.performSearch(this.currentSearch, !1));
	}
	profiles() {
		return this.profile.profileType().getProfiles();
	}
	selectionChanged(e) {
		let t = e.data;
		this.setSelectedNodeForDetailsView(t), this.inspectedObjectChanged(e);
	}
	onSelectAllocationNode(e) {
		let t = e.data;
		this.constructorsDataGrid.setAllocationNodeId(t.allocationNodeId()), this.setSelectedNodeForDetailsView(null);
	}
	inspectedObjectChanged(e) {
		let t = e.data, n = this.profile.heapProfilerModel();
		n && t instanceof tr && n.addInspectedHeapObject(String(t.snapshotNodeId));
	}
	setSelectedNodeForDetailsView(e) {
		let t = e?.retainersDataSource();
		t ? (this.retainmentDataGrid.setDataSource(t.snapshot, t.snapshotNodeIndex, t.snapshotNodeId), this.allocationStackView && this.allocationStackView.setAllocatedObject(t.snapshot, t.snapshotNodeIndex)) : (this.allocationStackView && this.allocationStackView.clear(), this.retainmentDataGrid.reset());
	}
	async changePerspectiveAndWait(e) {
		let t = this.perspectives.findIndex((t) => t.title() === e);
		if (t === -1 || this.currentPerspectiveIndex === t) return;
		let n = this.perspectives[t].masterGrid(this);
		if (!n) return;
		let r = n.once(mr.ContentShown), i = this.perspectiveSelect.options().find((e) => e.value === String(t));
		this.perspectiveSelect.select(i), this.changePerspective(t), await r;
	}
	async updateDataSourceAndView() {
		let e = this.dataGrid;
		if (!e || e.snapshot) return;
		let t = await this.profile.loadPromise;
		if (this.dataGrid !== e || (e.snapshot !== t && e.setDataSource(t, 0), e !== this.diffDataGrid)) return;
		this.baseProfile ||= this.profiles()[this.baseSelect.selectedIndex()];
		let n = await this.baseProfile.loadPromise;
		this.diffDataGrid.baseSnapshot !== n && this.diffDataGrid.setBaseDataSource(n);
	}
	onSelectedPerspectiveChanged(e) {
		this.changePerspective(Number(e.target.selectedOptions[0].value));
	}
	changePerspective(e) {
		if (e === this.currentPerspectiveIndex) return;
		this.currentPerspectiveIndex = e, this.currentPerspective.deactivate(this);
		let t = this.perspectives[e];
		this.currentPerspective = t, this.dataGrid = t.masterGrid(this), t.activate(this), this.refreshVisibleData(), this.dataGrid && this.dataGrid.updateWidths(), this.updateDataSourceAndView(), this.currentSearch && this.searchResults && this.performSearch(this.currentSearch, !1);
	}
	async selectLiveObject(e, t) {
		if (await this.changePerspectiveAndWait(e), !this.dataGrid) return;
		let n = await this.dataGrid.revealObjectByHeapSnapshotId(t);
		n ? n.select() : g.instance().error("Cannot find corresponding heap snapshot node");
	}
	getPopoverRequest(e) {
		let t = ft(e.target, "span"), n = ft(e.target, "tr");
		if (!n || !this.dataGrid) return null;
		let r = this.dataGrid.dataGridNodeFromNode(n) || this.containmentDataGrid.dataGridNodeFromNode(n) || this.constructorsDataGrid.dataGridNodeFromNode(n) || this.diffDataGrid.dataGridNodeFromNode(n) || this.allocationDataGrid?.dataGridNodeFromNode(n) || this.retainmentDataGrid.dataGridNodeFromNode(n), i = this.profile.heapProfilerModel();
		if (!r || !t || !i) return null;
		let a;
		return {
			box: t.boxInWindow(),
			show: async (e) => {
				if (!i) return !1;
				let t = await r.queryObjectContent(i, "popover");
				return a = t instanceof Te ? await Et.buildObjectPopover(t, e) : Et.buildDescriptionPopover(t.description, t.link, e), a ? !0 : (i.runtimeModel().releaseObjectGroup("popover"), !1);
			},
			hide: () => {
				i.runtimeModel().releaseObjectGroup("popover"), a && a.dispose();
			}
		};
	}
	updatePerspectiveOptions() {
		let e = this.profiles().length > 1;
		this.perspectiveSelect.removeOptions(), this.perspectives.forEach((t, n) => {
			if (e || t !== this.comparisonPerspective) {
				let e = this.perspectiveSelect.createOption(t.title(), String(n));
				t === this.currentPerspective && this.perspectiveSelect.select(e);
			}
		});
	}
	updateBaseOptions() {
		let e = this.profiles(), t = this.baseSelect.selectedIndex();
		this.baseSelect.removeOptions();
		for (let t of e) this.baseSelect.createOption(t.title);
		t > -1 && this.baseSelect.setSelectedIndex(t);
	}
	updateFilterOptions() {
		let t = this.profiles(), n = this.filterSelect.selectedIndex(), r = this.filterSelect.size();
		this.filterSelect.removeOptions(), this.filterSelect.createOption(K(G.allObjects));
		for (let e = 0; e < t.length; ++e) {
			let n;
			n = e ? K(G.objectsAllocatedBetweenSAndS, {
				PH1: t[e - 1].title,
				PH2: t[e].title
			}) : K(G.objectsAllocatedBeforeS, { PH1: t[e].title }), this.filterSelect.createOption(n);
		}
		let i = this.filterSelect.size(), a = this.filterSelect.createOption("—".repeat(18));
		a.disabled = !0;
		for (let t of e.ALWAYS_AVAILABLE_FILTERS) this.filterSelect.createOption(t.uiName);
		let o = this.filterSelect.size();
		if (n > -1) {
			let t = r - n;
			t <= e.ALWAYS_AVAILABLE_FILTERS.length ? this.filterSelect.setSelectedIndex(o - t) : n >= i ? this.filterSelect.setSelectedIndex(-1) : this.filterSelect.setSelectedIndex(n);
		}
	}
	updateControls() {
		this.updatePerspectiveOptions(), this.updateBaseOptions(), this.updateFilterOptions();
	}
	onReceiveSnapshot(e) {
		this.updateControls(), e.data.addEventListener(M.PROFILE_TITLE_CHANGED, this.updateControls, this);
	}
	onProfileHeaderRemoved(e) {
		let t = e.data;
		t.removeEventListener(M.PROFILE_TITLE_CHANGED, this.updateControls, this), this.profile === t ? (this.detach(), this.profile.profileType().removeEventListener("SnapshotReceived", this.onReceiveSnapshot, this), this.profile.profileType().removeEventListener(N.REMOVE_PROFILE_HEADER, this.onProfileHeaderRemoved, this), this.dispose()) : this.updateControls();
	}
	dispose() {
		this.linkifier.dispose(), this.popoverHelper.dispose(), this.allocationStackView && (this.allocationStackView.clear(), this.allocationDataGrid && this.allocationDataGrid.dispose()), this.onStopTracking(), this.trackingOverviewGrid && this.trackingOverviewGrid.removeEventListener(In.IDS_RANGE_CHANGED, this.onIdsRangeChanged.bind(this));
	}
}, q = class {
	titleInternal;
	constructor(e) {
		this.titleInternal = e;
	}
	activate(e) {}
	deactivate(e) {
		e.baseSelect.setVisible(!1), e.filterSelect.setVisible(!1), e.classNameFilter.setVisible(!1), e.trackingOverviewGrid && e.trackingOverviewGrid.detach(), e.allocationWidget && e.allocationWidget.detach(), e.statisticsView && e.statisticsView.detach(), e.splitWidget.detach(), e.splitWidget.detachChildWidgets();
	}
	masterGrid(e) {
		return null;
	}
	title() {
		return this.titleInternal;
	}
	supportsSearch() {
		return !1;
	}
}, Or = class extends q {
	constructor() {
		super(K(G.summary));
	}
	activate(e) {
		e.splitWidget.setMainWidget(e.constructorsWidget), e.splitWidget.setSidebarWidget(e.objectDetailsView), e.splitWidget.show(e.searchableViewInternal.element), e.filterSelect.setVisible(!0), e.classNameFilter.setVisible(!0), e.trackingOverviewGrid && (e.trackingOverviewGrid.show(e.searchableViewInternal.element, e.splitWidget.element), e.trackingOverviewGrid.update(), e.trackingOverviewGrid.updateGrid());
	}
	masterGrid(e) {
		return e.constructorsDataGrid;
	}
	supportsSearch() {
		return !0;
	}
}, kr = class extends q {
	constructor() {
		super(K(G.comparison));
	}
	activate(e) {
		e.splitWidget.setMainWidget(e.diffWidget), e.splitWidget.setSidebarWidget(e.objectDetailsView), e.splitWidget.show(e.searchableViewInternal.element), e.baseSelect.setVisible(!0), e.classNameFilter.setVisible(!0);
	}
	masterGrid(e) {
		return e.diffDataGrid;
	}
	supportsSearch() {
		return !0;
	}
}, Ar = class extends q {
	constructor() {
		super(K(G.containment));
	}
	activate(e) {
		e.splitWidget.setMainWidget(e.containmentWidget), e.splitWidget.setSidebarWidget(e.objectDetailsView), e.splitWidget.show(e.searchableViewInternal.element);
	}
	masterGrid(e) {
		return e.containmentDataGrid;
	}
}, jr = class extends q {
	allocationSplitWidget;
	constructor() {
		super(K(G.allocation)), this.allocationSplitWidget = new Ee(!1, !0, "heap-snapshot-allocation-split-view-state", 200, 200), this.allocationSplitWidget.setSidebarWidget(new b());
	}
	activate(e) {
		e.allocationWidget && this.allocationSplitWidget.setMainWidget(e.allocationWidget), e.splitWidget.setMainWidget(e.constructorsWidget), e.splitWidget.setSidebarWidget(e.objectDetailsView);
		let t = new b(), n = document.createElement("div");
		n.classList.add("heap-snapshot-view-resizer");
		let r = n.createChild("div", "title").createChild("span");
		if (n.createChild("div", "verticalResizerIcon"), r.textContent = K(G.liveObjects), this.allocationSplitWidget.hideDefaultResizer(), this.allocationSplitWidget.installResizer(n), t.element.appendChild(n), e.splitWidget.show(t.element), this.allocationSplitWidget.setSidebarWidget(t), this.allocationSplitWidget.show(e.searchableViewInternal.element), e.constructorsDataGrid.clear(), e.allocationDataGrid) {
			let t = e.allocationDataGrid.selectedNode;
			t && e.constructorsDataGrid.setAllocationNodeId(t.allocationNodeId());
		}
	}
	deactivate(e) {
		this.allocationSplitWidget.detach(), super.deactivate(e);
	}
	masterGrid(e) {
		return e.allocationDataGrid;
	}
}, Mr = class extends q {
	constructor() {
		super(K(G.statistics));
	}
	activate(e) {
		e.statisticsView.show(e.searchableViewInternal.element);
	}
	masterGrid(e) {
		return null;
	}
}, Nr = class e extends t(pn) {
	customContentInternal;
	constructor(t, n) {
		super(t || e.TypeId, n || K(G.heapSnapshot)), S.instance().observeModels(_, this), S.instance().addModelListener(_, C.RESET_PROFILES, this.resetProfiles, this), S.instance().addModelListener(_, C.ADD_HEAP_SNAPSHOT_CHUNK, this.addHeapSnapshotChunk, this), S.instance().addModelListener(_, C.REPORT_HEAP_SNAPSHOT_PROGRESS, this.reportHeapSnapshotProgress, this), this.customContentInternal = null;
	}
	modelAdded(e) {
		e.enable();
	}
	modelRemoved(e) {}
	getProfiles() {
		return super.getProfiles();
	}
	fileExtension() {
		return ".heapsnapshot";
	}
	get buttonTooltip() {
		return K(G.takeHeapSnapshot);
	}
	isInstantProfile() {
		return !0;
	}
	buttonClicked() {
		return this.takeHeapSnapshot(), Re.actionTaken(rt.ProfilesHeapProfileTaken), !1;
	}
	get treeItemTitle() {
		return K(G.heapSnapshots);
	}
	get description() {
		return K(G.heapSnapshotProfilesShowMemory);
	}
	createProfileLoadedFromFile(e) {
		return new J(null, this, e);
	}
	async takeHeapSnapshot() {
		if (this.profileBeingRecorded()) return;
		let e = x.instance().flavor(_);
		if (!e) return;
		let t = new J(e, this);
		this.setProfileBeingRecorded(t), this.addProfile(t), t.updateStatus(K(G.snapshotting)), await e.takeHeapSnapshot({
			reportProgress: !0,
			captureNumericValue: !0,
			exposeInternals: !0
		}), t = this.profileBeingRecorded(), t && (t.title = K(G.snapshotD, { PH1: t.uid }), t.finishLoad(), this.setProfileBeingRecorded(null), this.dispatchEventToListeners(N.PROFILE_COMPLETE, t));
	}
	addHeapSnapshotChunk(e) {
		let t = this.profileBeingRecorded();
		t && t.transferChunk(e.data);
	}
	reportHeapSnapshotProgress(e) {
		let t = this.profileBeingRecorded();
		if (!t) return;
		let { done: n, total: r, finished: i } = e.data;
		t.updateStatus(K(G.percentagePlaceholder, { PH1: (n / r * 100).toFixed(0) }), !0), i && t.prepareToLoad();
	}
	resetProfiles(e) {
		let t = e.data;
		for (let e of this.getProfiles()) e.heapProfilerModel() === t && this.removeProfile(e);
	}
	snapshotReceived(e) {
		this.profileBeingRecorded() === e && this.setProfileBeingRecorded(null), this.dispatchEventToListeners("SnapshotReceived", e);
	}
	static TypeId = "HEAP";
	static SnapshotReceived = "SnapshotReceived";
}, Pr = /* @__PURE__ */ function(e) {
	return e.SNAPSHOT_RECEIVED = "SnapshotReceived", e;
}({}), Fr = class e extends t(Nr) {
	recordAllocationStacksSettingInternal;
	customContentInternal;
	recording;
	profileSamples;
	constructor() {
		super(e.TypeId, K(G.allocationInstrumentationOn)), this.recordAllocationStacksSettingInternal = m.instance().createSetting("record-allocation-stacks", !1), this.customContentInternal = null, this.recording = !1;
	}
	modelAdded(e) {
		super.modelAdded(e), e.addEventListener(C.HEAP_STATS_UPDATED, this.heapStatsUpdate, this), e.addEventListener(C.LAST_SEEN_OBJECT_ID, this.lastSeenObjectId, this);
	}
	modelRemoved(e) {
		super.modelRemoved(e), e.removeEventListener(C.HEAP_STATS_UPDATED, this.heapStatsUpdate, this), e.removeEventListener(C.LAST_SEEN_OBJECT_ID, this.lastSeenObjectId, this);
	}
	heapStatsUpdate(e) {
		if (!this.profileSamples) return;
		let t = e.data, n;
		for (let e = 0; e < t.length; e += 3) {
			n = t[e];
			let r = t[e + 2];
			this.profileSamples.sizes[n] = r, this.profileSamples.max[n] || (this.profileSamples.max[n] = r);
		}
	}
	lastSeenObjectId(e) {
		let t = this.profileSamples;
		if (!t) return;
		let { lastSeenObjectId: n, timestamp: r } = e.data, i = Math.max(t.ids.length, t.max.length - 1);
		t.ids[i] = n, t.max[i] || (t.max[i] = 0, t.sizes[i] = 0), t.timestamps[i] = r, t.totalTime < r - t.timestamps[0] && (t.totalTime *= 2), this.profileSamples && this.dispatchEventToListeners("HeapStatsUpdate", this.profileSamples);
		let a = this.profileBeingRecorded();
		a && a.updateStatus(null, !0);
	}
	hasTemporaryView() {
		return !0;
	}
	get buttonTooltip() {
		return this.recording ? K(G.stopRecordingHeapProfile) : K(G.startRecordingHeapProfile);
	}
	isInstantProfile() {
		return !1;
	}
	buttonClicked() {
		return this.toggleRecording();
	}
	async startRecordingProfile() {
		if (this.profileBeingRecorded()) return;
		let e = this.addNewProfile();
		e && e.startTrackingHeapObjects(this.recordAllocationStacksSettingInternal.get());
	}
	customContent() {
		let e = Nt(K(G.recordAllocationStacksExtra), this.recordAllocationStacksSettingInternal);
		return this.customContentInternal = e, e;
	}
	setCustomContentEnabled(e) {
		this.customContentInternal && (this.customContentInternal.disabled = !e);
	}
	recordAllocationStacksSetting() {
		return this.recordAllocationStacksSettingInternal;
	}
	addNewProfile() {
		let e = x.instance().flavor(_);
		return e ? (this.setProfileBeingRecorded(new J(e, this, void 0)), this.profileSamples = new Rn(), this.recording = !0, this.addProfile(this.profileBeingRecorded()), this.profileBeingRecorded().updateStatus(K(G.recording)), this.dispatchEventToListeners("TrackingStarted"), e) : null;
	}
	async stopRecordingProfile() {
		let e = this.profileBeingRecorded();
		e.updateStatus(K(G.snapshotting));
		let t = e.heapProfilerModel().stopTrackingHeapObjects(!0);
		this.recording = !1, this.dispatchEventToListeners("TrackingStopped"), await t, e = this.profileBeingRecorded(), e && (e.finishLoad(), this.profileSamples = null, this.setProfileBeingRecorded(null), this.dispatchEventToListeners(N.PROFILE_COMPLETE, e));
	}
	toggleRecording() {
		return this.recording ? this.stopRecordingProfile() : this.startRecordingProfile(), this.recording;
	}
	fileExtension() {
		return ".heaptimeline";
	}
	get treeItemTitle() {
		return K(G.allocationTimelines);
	}
	get description() {
		return K(G.AllocationTimelinesShowInstrumented);
	}
	resetProfiles(e) {
		let t = this.recording;
		this.setProfileBeingRecorded(null), super.resetProfiles(e), this.profileSamples = null, t && this.addNewProfile();
	}
	profileBeingRecordedRemoved() {
		this.stopRecordingProfile(), this.profileSamples = null;
	}
	static TypeId = "HEAP-RECORD";
	static HeapStatsUpdate = "HeapStatsUpdate";
	static TrackingStarted = "TrackingStarted";
	static TrackingStopped = "TrackingStopped";
}, Ir = /* @__PURE__ */ function(e) {
	return e.HEAP_STATS_UPDATE = "HeapStatsUpdate", e.TRACKING_STARTED = "TrackingStarted", e.TRACKING_STOPPED = "TrackingStopped", e;
}({}), J = class extends j {
	heapProfilerModelInternal;
	maxJSObjectId = -1;
	workerProxy = null;
	receiver = null;
	snapshotProxy = null;
	loadPromise;
	fulfillLoad;
	totalNumberOfChunks = 0;
	bufferedWriter = null;
	onTempFileReady = null;
	failedToCreateTempFile;
	wasDisposed;
	fileName;
	constructor(e, t, n) {
		super(t, n || K(G.snapshotD, { PH1: t.nextProfileUid() })), this.heapProfilerModelInternal = e;
		let { promise: r, resolve: i } = Promise.withResolvers();
		this.loadPromise = r, this.fulfillLoad = i;
	}
	heapProfilerModel() {
		return this.heapProfilerModelInternal;
	}
	async getLocation(e) {
		return this.snapshotProxy ? await this.snapshotProxy.getLocation(e) : null;
	}
	prepareToLoad() {
		console.assert(!this.receiver, "Already loading"), this.setupWorker(), this.updateStatus(K(G.loading), !0);
	}
	finishLoad() {
		!this.wasDisposed && this.receiver && this.receiver.close(), this.bufferedWriter && this.didWriteToTempFile(this.bufferedWriter);
	}
	didWriteToTempFile(e) {
		if (this.wasDisposed) {
			e && e.remove();
			return;
		}
		this.tempFile = e, e || (this.failedToCreateTempFile = !0), this.onTempFileReady &&= (this.onTempFileReady(), null);
	}
	setupWorker() {
		console.assert(!this.workerProxy, "HeapSnapshotWorkerProxy already exists"), this.workerProxy = new Kt(this.handleWorkerEvent.bind(this)), this.workerProxy.addEventListener(Kt.Events.WAIT, (e) => {
			this.updateStatus(null, e.data);
		}, this), this.receiver = this.workerProxy.createLoader(this.uid, this.snapshotReceived.bind(this));
	}
	handleWorkerEvent(e, t) {
		if (Gt.BrokenSnapshot === e) {
			g.instance().error(t);
			return;
		}
		if (Gt.Update !== e) return;
		let n = s(t);
		this.updateStatus(Er(n.string, n.values));
	}
	dispose() {
		this.workerProxy && this.workerProxy.dispose(), this.removeTempFile(), this.wasDisposed = !0;
	}
	didCompleteSnapshotTransfer() {
		this.snapshotProxy && this.updateStatus(a(this.snapshotProxy.totalSize), !1);
	}
	transferChunk(e) {
		this.bufferedWriter ||= new wt(), this.bufferedWriter.write([e]), ++this.totalNumberOfChunks, this.receiver && this.receiver.write(e);
	}
	snapshotReceived(e) {
		this.wasDisposed || (this.receiver = null, this.snapshotProxy = e, this.maxJSObjectId = e.maxJSObjectId(), this.didCompleteSnapshotTransfer(), this.workerProxy && this.workerProxy.startCheckingForLongRunningCalls(), this.notifySnapshotReceived());
	}
	notifySnapshotReceived() {
		this.snapshotProxy && this.fulfillLoad(this.snapshotProxy), this.profileType().snapshotReceived(this);
	}
	canSaveToFile() {
		return !this.fromFile();
	}
	async saveToFile() {
		await this.loadPromise;
		let e = new St();
		this.fileName = this.fileName || "Heap-" + ge(/* @__PURE__ */ new Date()) + this.profileType().fileExtension();
		let t = async (n) => {
			if (n) {
				if (this.failedToCreateTempFile) {
					g.instance().error("Failed to open temp file with heap snapshot"), e.close();
					return;
				}
				if (this.tempFile) {
					let t = await this.tempFile.copyToOutputStream(e, this.onChunkTransferred.bind(this));
					t && g.instance().error("Failed to read heap snapshot from temp file: " + t.message), this.didCompleteSnapshotTransfer();
					return;
				}
				this.onTempFileReady = () => {
					t(n);
				}, this.updateSaveProgress(0, 1);
			}
		};
		await e.open(this.fileName).then(t.bind(this));
	}
	onChunkTransferred(e) {
		this.updateSaveProgress(e.loadedSize(), e.fileSize());
	}
	updateSaveProgress(e, t) {
		let n = ((t && e / t) * 100).toFixed(0);
		this.updateStatus(K(G.savingD, { PH1: n }));
	}
	async loadFromFile(e) {
		this.updateStatus(K(G.loading), !0), this.setupWorker();
		let t = new xt(e, 1e7), n = await t.read(this.receiver), r = t.error();
		return !n && r && this.updateStatus(r.message), n ? null : r;
	}
	profileType() {
		return super.profileType();
	}
}, Lr = class e extends b {
	pieChart;
	constructor() {
		super(), this.element.classList.add("heap-snapshot-statistics-view"), this.element.setAttribute("jslog", `${it("profiler.heap-snapshot-statistics-view").track({ resize: !0 })}`), this.pieChart = new zt(), this.setTotalAndRecords(0, []), this.pieChart.classList.add("heap-snapshot-stats-pie-chart"), this.element.appendChild(this.pieChart);
	}
	static valueFormatter(e) {
		return new Intl.NumberFormat(d.instance().locale, {
			style: "unit",
			unit: "kilobyte"
		}).format(Math.round(e / 1e3));
	}
	setTotalAndRecords(t, n) {
		this.pieChart.data = {
			chartName: K(G.heapMemoryUsage),
			size: 150,
			formatter: e.valueFormatter,
			showLegend: !0,
			total: t,
			slices: n
		};
	}
}, Rr = class extends $e {
	heapProfilerModel;
	linkifier;
	frameElements;
	constructor(e) {
		super(), this.heapProfilerModel = e, this.linkifier = new T(), this.frameElements = [];
	}
	onContextMenu(e, t) {
		let n = new Pe(t);
		n.appendApplicableItems(e), n.show(), t.consume(!0);
	}
	onStackViewKeydown(e) {
		let t = e.target;
		if (!t) return;
		if (e.key === "Enter") {
			let n = zr.get(t);
			if (!n) return;
			let r = T.linkInfo(n);
			if (!r) return;
			T.invokeFirstAction(r) && e.consume(!0);
			return;
		}
		let n, r = e;
		if (r.key === "ArrowUp") n = !1;
		else if (r.key === "ArrowDown") n = !0;
		else return;
		let i = this.frameElements.indexOf(t);
		if (i === -1) return;
		let a = n ? i + 1 : i - 1;
		if (a < 0 || a >= this.frameElements.length) return;
		let o = this.frameElements[a];
		o.tabIndex = 0, t.tabIndex = -1, o.focus(), e.consume(!0);
	}
	async setAllocatedObject(e, t) {
		this.clear();
		let n = await e.allocationStack(t);
		if (!n) {
			let e = this.element.createChild("div", "no-heap-allocation-stack");
			mt(e, K(G.stackWasNotRecordedForThisObject));
			return;
		}
		let r = this.element.createChild("div", "heap-allocation-stack");
		r.addEventListener("keydown", this.onStackViewKeydown.bind(this), !1);
		for (let e of n) {
			let t = r.createChild("div", "stack-frame");
			this.frameElements.push(t), t.tabIndex = -1;
			let n = t.createChild("div");
			if (n.textContent = at(e.functionName), !e.scriptId) continue;
			let i = this.heapProfilerModel ? this.heapProfilerModel.target() : null, a = {
				columnNumber: e.column - 1,
				inlineFrameIndex: 0
			}, o = this.linkifier.linkifyScriptLocation(i, String(e.scriptId), e.scriptName, e.line - 1, a);
			t.appendChild(o), zr.set(t, o), t.addEventListener("contextmenu", this.onContextMenu.bind(this, o));
		}
		this.frameElements[0].tabIndex = 0;
	}
	clear() {
		this.element.removeChildren(), this.frameElements = [], this.linkifier.reset();
	}
}, zr = /* @__PURE__ */ new WeakMap(), Br = /* @__PURE__ */ e({
	IsolateSelector: () => Hr,
	ListItem: () => Ur
}), Y = {
	javascriptVmInstances: "JavaScript VM instances",
	totalJsHeapSize: "Total JS heap size",
	totalPageJsHeapSizeChangeTrend: "Total page JS heap size change trend over the last {PH1} minutes.",
	totalPageJsHeapSizeAcrossAllVm: "Total page JS heap size across all VM instances.",
	changeRate: "{PH1}/s",
	increasingBySPerSecond: "increasing by {PH1} per second",
	decreasingBySPerSecond: "decreasing by {PH1} per second",
	heapSizeInUseByLiveJsObjects: "Heap size in use by live JS objects.",
	heapSizeChangeTrendOverTheLastS: "Heap size change trend over the last {PH1} minutes.",
	empty: "(empty)"
}, Vr = o("panels/profiler/IsolateSelector.ts", Y), X = r.bind(void 0, Vr), Hr = class e extends b {
	items;
	list;
	itemByIsolate;
	totalElement;
	totalValueDiv;
	totalTrendDiv;
	constructor() {
		super(), this.items = new gt(), this.list = new Ve(this.items, this, Me.NonViewport), this.list.element.classList.add("javascript-vm-instances-list"), ue(this.list.element, X(Y.javascriptVmInstances)), this.contentElement.appendChild(this.list.element), this.itemByIsolate = /* @__PURE__ */ new Map(), this.totalElement = document.createElement("div"), this.totalElement.classList.add("profile-memory-usage-item"), this.totalElement.classList.add("hbox"), this.totalValueDiv = this.totalElement.createChild("div", "profile-memory-usage-item-size"), this.totalTrendDiv = this.totalElement.createChild("div", "profile-memory-usage-item-trend"), this.totalElement.createChild("div").textContent = X(Y.totalJsHeapSize);
		let e = Math.round(se / 6e4);
		v.install(this.totalTrendDiv, X(Y.totalPageJsHeapSizeChangeTrend, { PH1: e })), v.install(this.totalValueDiv, X(Y.totalPageJsHeapSizeAcrossAllVm)), Se.instance().observeIsolates(this), S.instance().addEventListener(qe.NAME_CHANGED, this.targetChanged, this), S.instance().addEventListener(qe.INSPECTED_URL_CHANGED, this.targetChanged, this);
	}
	wasShown() {
		super.wasShown(), Se.instance().addEventListener(ht.MEMORY_CHANGED, this.heapStatsChanged, this);
	}
	willHide() {
		super.willHide(), Se.instance().removeEventListener(ht.MEMORY_CHANGED, this.heapStatsChanged, this);
	}
	isolateAdded(e) {
		this.list.element.tabIndex = 0;
		let t = new Ur(e), n = t.model().target() === S.instance().primaryPageTarget() ? 0 : this.items.length;
		this.items.insert(n, t), this.itemByIsolate.set(e, t), n === 0 && this.list.selectItem(t), this.update();
	}
	isolateChanged(e) {
		let t = this.itemByIsolate.get(e);
		t && t.updateTitle(), this.update();
	}
	isolateRemoved(e) {
		let t = this.itemByIsolate.get(e);
		t && this.items.remove(this.items.indexOf(t)), this.itemByIsolate.delete(e), this.items.length === 0 && (this.list.element.tabIndex = -1), this.update();
	}
	targetChanged(e) {
		let t = e.data.model(oe);
		if (!t) return;
		let n = Se.instance().isolateByModel(t), r = n && this.itemByIsolate.get(n);
		r && r.updateTitle();
	}
	heapStatsChanged(e) {
		let t = e.data, n = this.itemByIsolate.get(t);
		n && n.updateStats(), this.updateTotal();
	}
	updateTotal() {
		let t = 0, n = 0;
		for (let e of Se.instance().isolates()) t += e.usedHeapSize(), n += e.usedHeapSizeGrowRate();
		this.totalValueDiv.textContent = a(t), e.formatTrendElement(n, this.totalTrendDiv);
	}
	static formatTrendElement(e, t) {
		let n = e * 1e3;
		if (Math.abs(n) < 1e3) return;
		let r = a(Math.abs(n)), i, o;
		n > 0 ? (i = "⬆" + X(Y.changeRate, { PH1: r }), t.classList.toggle("increasing", !0), o = X(Y.increasingBySPerSecond, { PH1: r })) : (i = "⬇" + X(Y.changeRate, { PH1: r }), t.classList.toggle("increasing", !1), o = X(Y.decreasingBySPerSecond, { PH1: r })), t.textContent = i, ue(t, o);
	}
	totalMemoryElement() {
		return this.totalElement;
	}
	createElementForItem(e) {
		return e.element;
	}
	heightForItem(e) {
		return console.assert(!1, "should not be called"), 0;
	}
	updateSelectedItemARIA(e, t) {
		return !1;
	}
	isItemSelectable(e) {
		return !0;
	}
	selectedItemChanged(e, t, n, r) {
		n && n.classList.remove("selected"), r && r.classList.add("selected");
		let i = t?.model();
		x.instance().setFlavor(_, i?.heapProfilerModel() ?? null), x.instance().setFlavor(Qe, i?.target().model(Qe) ?? null);
	}
	update() {
		this.updateTotal(), this.list.invalidateRange(0, this.items.length);
	}
}, Ur = class {
	isolate;
	element;
	heapDiv;
	trendDiv;
	nameDiv;
	constructor(e) {
		this.isolate = e;
		let t = Math.round(se / 6e4);
		this.element = document.createElement("div"), this.element.classList.add("profile-memory-usage-item"), this.element.classList.add("hbox"), Fe(this.element), this.heapDiv = this.element.createChild("div", "profile-memory-usage-item-size"), v.install(this.heapDiv, X(Y.heapSizeInUseByLiveJsObjects)), this.trendDiv = this.element.createChild("div", "profile-memory-usage-item-trend"), v.install(this.trendDiv, X(Y.heapSizeChangeTrendOverTheLastS, { PH1: t })), this.nameDiv = this.element.createChild("div", "profile-memory-usage-item-name"), this.updateTitle();
	}
	model() {
		return this.isolate.runtimeModel();
	}
	updateStats() {
		this.heapDiv.textContent = a(this.isolate.usedHeapSize()), Hr.formatTrendElement(this.isolate.usedHeapSizeGrowRate(), this.trendDiv);
	}
	updateTitle() {
		let e = /* @__PURE__ */ new Map(), t = S.instance();
		for (let n of this.isolate.models()) {
			let r = n.target(), i = t.primaryPageTarget() === r, a = r.name(), o = new ne(r.inspectedURL()), s = o.isValid ? o.domain() : "", c = r.decorateLabel(s && !i ? `${s}: ${a}` : a || s || X(Y.empty));
			e.set(c, (e.get(c) || 0) + 1);
		}
		this.nameDiv.removeChildren();
		let n = [];
		for (let [t, r] of e) {
			let e = r > 1 ? `${t} (${r})` : t;
			n.push(e);
			let i = this.nameDiv.createChild("div");
			i.textContent = e, v.install(i, String(e));
		}
	}
}, Wr = "/*\n * Copyright 2018 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.profile-launcher-view {\n  overflow: auto;\n}\n\n.profile-launcher-view-content {\n  margin: 10px 16px;\n  flex: auto 1 0;\n\n  & h1 {\n    font: var(--sys-typescale-headline4);\n    margin: 6px 0 10px;\n  }\n\n  & label {\n    font: var(--sys-typescale-body3-regular);\n  }\n\n  & p {\n    color: var(--sys-color-token-subtle);\n    margin-top: var(--sys-size-1);\n    margin-left: var(--sys-size-10);\n\n    & > devtools-checkbox {\n      display: flex;\n    }\n  }\n\n  .profile-launcher-view-content button.text-button.running,\n  .profile-launcher-view-content button.text-button.running:focus {\n    color: var(--sys-color-error);\n  }\n\n  & > div {\n    flex: auto 0 0;\n  }\n\n  & > .profile-isolate-selector-block {\n    flex: auto 1 0;\n    overflow: hidden;\n  }\n}\n\n.profile-launcher-target-list {\n  margin-bottom: 6px;\n  border: 1px solid var(--sys-color-divider);\n  flex: 150px 1 0;\n}\n\n.profile-launcher-target-list-container {\n  overflow: auto;\n}\n\n.profile-memory-usage-item {\n  min-width: 100%;\n  width: max-content;\n  padding: 4px;\n  line-height: 16px;\n}\n\n.profile-isolate-selector-block > .profile-memory-usage-item {\n  margin-left: 1px;\n  margin-bottom: 4px;\n  font-weight: bolder;\n}\n\n.profile-memory-usage-item.selected {\n  background-color: var(--sys-color-neutral-container);\n}\n\n.profile-memory-usage-item:focus {\n  background-color: var(--sys-color-tonal-container);\n}\n\n.profile-launcher-target-list .profile-memory-usage-item:hover:not(.selected) {\n  background-color: var(--sys-color-state-hover-on-subtle);\n}\n\n.javascript-vm-instances-list {\n  width: max-content;\n  min-width: 100%;\n}\n\n.javascript-vm-instances-list:focus .profile-memory-usage-item.selected {\n  background-color: var(--sys-color-tonal-container);\n}\n\n.profile-memory-usage-item > div {\n  flex-shrink: 0;\n  margin-right: 12px;\n}\n\n.profile-memory-usage-item-size {\n  width: 60px;\n  text-align: right;\n}\n\n.profile-memory-usage-item-trend {\n  min-width: 5em;\n  color: var(--sys-color-tertiary);\n}\n\n.profile-memory-usage-item-trend.increasing {\n  color: var(--sys-color-error);\n}\n\n.profile-launcher-buttons {\n  flex-wrap: wrap;\n  column-gap: 8px;\n}\n\n@media (forced-colors: active) {\n  .profile-memory-usage-item {\n    forced-color-adjust: none;\n    border-left-color: transparent;\n  }\n\n  .profile-memory-usage-item-trend,\n  .profile-memory-usage-item-trend.increasing,\n  .profile-launcher-view-content button.running {\n    color: ButtonText;\n  }\n\n  .javascript-vm-instances-list .profile-memory-usage-item:hover:not(.selected) {\n    background-color: Highlight;\n    color: HighlightText;\n  }\n\n  .javascript-vm-instances-list .profile-memory-usage-item.selected .profile-memory-usage-item-trend,\n  .javascript-vm-instances-list .profile-memory-usage-item.selected .profile-memory-usage-item-trend.increasing {\n    color: ButtonFace;\n  }\n\n  .javascript-vm-instances-list .profile-memory-usage-item:hover:not(.selected) .profile-memory-usage-item-trend,\n  .javascript-vm-instances-list .profile-memory-usage-item:hover:not(.selected) .profile-memory-usage-item-trend.increasing {\n    background-color: Highlight;\n    color: HighlightText;\n  }\n\n  .javascript-vm-instances-list .profile-memory-usage-item.selected {\n    background-color: ButtonText;\n    border-color: Highlight;\n    color: ButtonFace;\n  }\n\n  .javascript-vm-instances-list:focus .profile-memory-usage-item.selected,\n  .javascript-vm-instances-list:focus-visible .profile-memory-usage-item.selected {\n    background-color: Highlight;\n    border-color: ButtonText;\n    color: HighlightText;\n  }\n}\n", Gr = /* @__PURE__ */ e({
	Events: () => Yr,
	ProfileLauncherView: () => Jr
}), Z = {
	selectJavascriptVmInstance: "Select JavaScript VM instance",
	load: "Load profile",
	takeSnapshot: "Take snapshot",
	stop: "Stop",
	start: "Start",
	selectProfilingType: "Select profiling type"
}, Kr = o("panels/profiler/ProfileLauncherView.ts", Z), qr = r.bind(void 0, Kr), Jr = class extends t(b) {
	panel;
	#e;
	selectedProfileTypeSetting;
	profileTypeHeaderElement;
	profileTypeSelectorForm;
	controlButton;
	loadButton;
	recordButtonEnabled;
	typeIdToOptionElementAndProfileType;
	isProfiling;
	isInstantProfile;
	isEnabled;
	constructor(e) {
		super(), this.registerRequiredCSS(Wr), this.panel = e, this.element.classList.add("profile-launcher-view"), this.#e = this.element.createChild("div", "profile-launcher-view-content vbox");
		let t = this.#e.createChild("div", "vbox");
		this.selectedProfileTypeSetting = m.instance().createSetting("selected-profile-type", "CPU"), this.profileTypeHeaderElement = t.createChild("h1"), this.profileTypeSelectorForm = t.createChild("form"), dt(this.profileTypeSelectorForm);
		let n = this.#e.createChild("div", "vbox profile-isolate-selector-block");
		n.createChild("h1").textContent = qr(Z.selectJavascriptVmInstance);
		let r = new Hr(), i = n.createChild("div", "vbox profile-launcher-target-list");
		i.classList.add("profile-launcher-target-list-container"), r.show(i), n.appendChild(r.totalMemoryElement());
		let a = this.#e.createChild("div", "hbox profile-launcher-buttons");
		this.controlButton = Ne("", this.controlButtonClicked.bind(this), {
			jslogContext: "profiler.heap-toggle-recording",
			variant: re.PRIMARY
		}), this.loadButton = new we(), this.loadButton.data = {
			iconName: "import",
			variant: re.OUTLINED,
			jslogContext: "profiler.load-from-file"
		}, this.loadButton.textContent = qr(Z.load), this.loadButton.addEventListener("click", this.loadButtonClicked.bind(this)), a.appendChild(this.loadButton), a.appendChild(this.controlButton), this.recordButtonEnabled = !0, this.typeIdToOptionElementAndProfileType = /* @__PURE__ */ new Map();
	}
	loadButtonClicked() {
		Ze.instance().getAction("profiler.load-from-file").execute();
	}
	updateControls() {
		this.isEnabled && this.recordButtonEnabled ? this.controlButton.removeAttribute("disabled") : this.controlButton.setAttribute("disabled", ""), v.install(this.controlButton, this.recordButtonEnabled ? "" : st()), this.isInstantProfile ? (this.controlButton.classList.remove("running"), this.controlButton.textContent = qr(Z.takeSnapshot)) : this.isProfiling ? (this.controlButton.classList.add("running"), this.controlButton.textContent = qr(Z.stop)) : (this.controlButton.classList.remove("running"), this.controlButton.textContent = qr(Z.start));
		for (let { optionElement: e } of this.typeIdToOptionElementAndProfileType.values()) e.disabled = !!this.isProfiling;
	}
	profileStarted() {
		this.isProfiling = !0, this.updateControls();
	}
	profileFinished() {
		this.isProfiling = !1, this.updateControls();
	}
	updateProfileType(e, t) {
		this.isInstantProfile = e.isInstantProfile(), this.recordButtonEnabled = t, this.isEnabled = e.isEnabled(), this.updateControls();
	}
	addProfileType(e) {
		let { radio: t, label: n } = He("profile-type", e.name, "profiler.profile-type");
		this.profileTypeSelectorForm.appendChild(n), this.typeIdToOptionElementAndProfileType.set(e.id, {
			optionElement: t,
			profileType: e
		}), t.addEventListener("change", this.profileTypeChanged.bind(this, e), !1);
		let r = this.profileTypeSelectorForm.createChild("p");
		r.textContent = e.description, Ce(t, e.description);
		let i = e.customContent();
		i && (i.setAttribute("role", "group"), i.setAttribute("aria-labelledby", `${t.id}`), this.profileTypeSelectorForm.createChild("p").appendChild(i), e.setCustomContentEnabled(!1));
		let a = this.typeIdToOptionElementAndProfileType.size > 1 ? qr(Z.selectProfilingType) : e.name;
		this.profileTypeHeaderElement.textContent = a, ue(this.profileTypeSelectorForm, a);
	}
	restoreSelectedProfileType() {
		let e = this.selectedProfileTypeSetting.get();
		this.typeIdToOptionElementAndProfileType.has(e) || (e = this.typeIdToOptionElementAndProfileType.keys().next().value, this.selectedProfileTypeSetting.set(e));
		let t = this.typeIdToOptionElementAndProfileType.get(e);
		t.optionElement.checked = !0;
		let n = t.profileType;
		for (let [t, { profileType: n }] of this.typeIdToOptionElementAndProfileType) {
			let r = t === e;
			n.setCustomContentEnabled(r);
		}
		this.dispatchEventToListeners("ProfileTypeSelected", n);
	}
	controlButtonClicked() {
		this.panel.toggleRecord();
	}
	profileTypeChanged(e) {
		let t = this.selectedProfileTypeSetting.get();
		this.typeIdToOptionElementAndProfileType.get(t).profileType.setCustomContentEnabled(!1), e.setCustomContentEnabled(!0), this.dispatchEventToListeners("ProfileTypeSelected", e), this.isInstantProfile = e.isInstantProfile(), this.isEnabled = e.isEnabled(), this.updateControls(), this.selectedProfileTypeSetting.set(e.id);
	}
}, Yr = /* @__PURE__ */ function(e) {
	return e.PROFILE_TYPE_SELECTED = "ProfileTypeSelected", e;
}({}), Xr = /* @__PURE__ */ e({ ProfileSidebarTreeElement: () => ei }), Zr = { profileOptions: "Profile options" }, Qr = o("panels/profiler/ProfileSidebarTreeElement.ts", Zr), $r = r.bind(void 0, Qr), ei = class extends Ue {
	iconElement;
	titlesElement;
	menuElement;
	titleContainer;
	titleElement;
	subtitleElement;
	className;
	small;
	dataDisplayDelegate;
	profile;
	editing;
	constructor(e, t, n) {
		super("", !1), this.iconElement = document.createElement("div"), this.iconElement.classList.add("icon"), this.titlesElement = document.createElement("div"), this.titlesElement.classList.add("titles"), this.titlesElement.classList.add("no-subtitle"), this.titlesElement.setAttribute("jslog", `${je("title").track({
			dblclick: !0,
			change: !0
		})}`), this.titleContainer = this.titlesElement.createChild("span", "title-container"), this.titleElement = this.titleContainer.createChild("span", "title"), this.subtitleElement = this.titlesElement.createChild("span", "subtitle"), this.menuElement = new we(), this.menuElement.data = {
			variant: re.ICON,
			iconName: "dots-vertical",
			title: $r(Zr.profileOptions)
		}, this.menuElement.tabIndex = -1, this.menuElement.addEventListener("click", this.handleContextMenuEvent.bind(this)), this.menuElement.setAttribute("jslog", `${We("profile-options").track({ click: !0 })}`), v.install(this.menuElement, $r(Zr.profileOptions)), this.titleElement.textContent = t.title, this.className = n, this.small = !1, this.dataDisplayDelegate = e, this.profile = t, t.addEventListener(M.UPDATE_STATUS, this.updateStatus, this), this.editing = null;
	}
	updateStatus(e) {
		let t = e.data;
		t.subtitle !== null && (this.subtitleElement.textContent = t.subtitle.length > 0 ? `(${t.subtitle})` : "", this.titlesElement.classList.toggle("no-subtitle", !t.subtitle), ue(this.listItemElement, `${this.profile.title}, ${t.subtitle}`)), typeof t.wait == "boolean" && this.listItemElement && (this.iconElement.classList.toggle("spinner", t.wait), this.listItemElement.classList.toggle("wait", t.wait));
	}
	ondblclick(e) {
		return this.editing || this.startEditing(e.target), !1;
	}
	startEditing(e) {
		let t = e.enclosingNodeOrSelfWithClass("title");
		if (!t) return;
		let n = new ce(this.editingCommitted.bind(this), this.editingCancelled.bind(this), void 0);
		this.editing = _e.startEditing(t, n);
	}
	editingCommitted(e, t) {
		t.trim().length === 0 ? this.editing && this.editing.cancel() : (this.editing = null, this.profile.setTitle(t));
	}
	editingCancelled() {
		this.editing = null;
	}
	dispose() {
		this.profile.removeEventListener(M.UPDATE_STATUS, this.updateStatus, this);
	}
	onselect() {
		return this.dataDisplayDelegate.showProfile(this.profile), !0;
	}
	ondelete() {
		return this.profile.profileType().removeProfile(this.profile), !0;
	}
	onattach() {
		this.className && this.listItemElement.classList.add(this.className), this.small && this.listItemElement.classList.add("small"), this.listItemElement.append(this.iconElement, this.titlesElement, this.menuElement), this.listItemElement.addEventListener("contextmenu", this.handleContextMenuEvent.bind(this), !0), Ce(this.listItemElement, this.profile.profileType().name);
	}
	handleContextMenuEvent(e) {
		let t = new Pe(e);
		t.appendItemsAtLocation("profilerMenu"), t.show();
	}
	setSmall(e) {
		this.small = e, this.listItemElement && this.listItemElement.classList.toggle("small", this.small);
	}
	setMainTitle(e) {
		this.titleElement.textContent = e;
	}
}, ti = "/*\n * Copyright (C) 2006, 2007, 2008 Apple Inc.  All rights reserved.\n * Copyright (C) 2009 Anthony Ricaud <rik@webkit.org>\n *\n * Redistribution and use in source and binary forms, with or without\n * modification, are permitted provided that the following conditions\n * are met:\n *\n * 1.  Redistributions of source code must retain the above copyright\n *     notice, this list of conditions and the following disclaimer.\n * 2.  Redistributions in binary form must reproduce the above copyright\n *     notice, this list of conditions and the following disclaimer in the\n *     documentation and/or other materials provided with the distribution.\n * 3.  Neither the name of Apple Computer, Inc. (\"Apple\") nor the names of\n *     its contributors may be used to endorse or promote products derived\n *     from this software without specific prior written permission.\n *\n * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS \"AS IS\" AND ANY\n * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED\n * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE\n * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY\n * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES\n * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;\n * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND\n * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT\n * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF\n * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n */\n/* Profiler Style */\n\n#profile-views {\n  flex: auto;\n  position: relative;\n}\n\n.profile-view .data-grid table.data {\n  background: var(--sys-color-cdt-base-container);\n}\n\n.profile-view .data-grid tr:not(.selected) .highlight {\n  background-color: var(--sys-color-tonal-container);\n}\n\n.profile-view .data-grid tr:hover td:not(.bottom-filler-td) {\n  background-color: var(--sys-color-state-hover-on-subtle);\n}\n\n.profile-view .data-grid td.numeric-column {\n  text-align: right;\n}\n\n.profile-view .data-grid div.profile-multiple-values {\n  float: right;\n}\n\n.profile-view .data-grid span.percent-column {\n  color: var(--sys-color-token-subtle);\n  width: 9ex;\n  display: inline-block;\n}\n\n.profile-view .data-grid tr.selected span {\n  color: inherit;\n}\n\n.profiles-toolbar {\n  background-color: var(--sys-color-cdt-base-container);\n  border-bottom: 1px solid var(--sys-color-divider);\n  flex-shrink: 0;\n}\n\n.profiles-tree-sidebar {\n  flex: auto;\n  overflow: hidden;\n}\n\n.profiles-sidebar-tree-box {\n  overflow-y: auto;\n}\n\n.profile-view {\n  display: flex;\n  overflow: hidden;\n}\n\n.profile-view .data-grid {\n  border: none;\n  flex: auto;\n}\n\n.profile-view .data-grid th.self-column,\n.profile-view .data-grid th.total-column {\n  text-align: center;\n}\n\n.profile-node-file {\n  float: right;\n  color: var(--sys-color-token-subtle);\n}\n\n.profile-warn-marker {\n  vertical-align: -1px;\n  margin-right: 2px;\n}\n\n.cpu-profile-flame-chart-overview-container {\n  overflow: hidden;\n  position: absolute;\n  top: 0;\n  width: 100%;\n  height: 80px;\n}\n\n#cpu-profile-flame-chart-overview-container {\n  border-bottom: 1px solid var(--sys-color-divider);\n  overflow: hidden;\n}\n\n.cpu-profile-flame-chart-overview-canvas {\n  position: absolute;\n  inset: 20px 0 0;\n}\n\n#cpu-profile-flame-chart-overview-grid .resources-dividers-label-bar {\n  pointer-events: auto;\n}\n\n.cpu-profile-flame-chart-overview-pane {\n  flex: 0 0 80px !important; /* stylelint-disable-line declaration-no-important */\n}\n\n.profile-text-view {\n  padding: 10px;\n  overflow: auto;\n  margin: 0;\n  user-select: text;\n  cursor: text;\n}\n\n.empty-landing-page {\n  position: absolute;\n  background-color: var(--sys-color-cdt-base-container);\n  justify-content: center;\n  align-items: center;\n  overflow: auto;\n  font-size: 16px;\n  color: var(--sys-color-token-subtle);\n  padding: 50px;\n}\n\n@media (forced-colors: active) {\n  .profile-view .data-grid tr:hover td:not(.bottom-filler-td) {\n    background: Highlight;\n  }\n\n  .profile-view .data-grid table.data {\n    background: transparent;\n  }\n}\n", ni = "/*\n * Copyright 2016 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n:host {\n  padding: var(--sys-size-3) 0;\n}\n\n.tree-outline-disclosure {\n  width: 100%;\n}\n\n/* Icon-related changes */\nli .icon {\n  width: 20px;\n  height: 20px;\n  margin-right: var(--sys-size-6);\n  flex: none;\n}\n\n/* Heap profiles and CPU profiles */\n.heap-snapshot-sidebar-tree-item .icon,\n.profile-sidebar-tree-item .icon {\n  mask-image: var(--image-file-heap-snapshot);\n  background: var(--icon-default);\n}\n\n.profile-group-sidebar-tree-item .icon {\n  mask-image: var(--image-file-heap-snapshots);\n  background: var(--icon-default);\n}\n\nli.small .icon {\n  width: 16px;\n  height: 16px;\n}\n\nli.wait .icon {\n  content: none;\n}\n\nli devtools-button {\n  min-width: var(--sys-size-12);\n  visibility: hidden;\n}\n\n/* Tree outline overrides */\n.heap-snapshot-sidebar-tree-item:not(:hover) devtools-button {\n  visibility: hidden;\n}\n\n.heap-snapshot-sidebar-tree-item.wait .icon {\n  mask-image: unset;\n  background-color: inherit;\n}\n\n.heap-snapshot-sidebar-tree-item.small .icon {\n  mask-image: var(--image-file-heap-snapshots);\n  background: var(--icon-default);\n}\n\n.profile-sidebar-tree-item.small .icon {\n  mask-image: var(--image-file-heap-snapshots);\n  background: var(--icon-default);\n}\n\n.tree-outline li:not(.parent)::before {\n  content: none;\n}\n\nol.tree-outline {\n  flex: auto;\n  padding: 0;\n}\n\n.tree-outline li {\n  height: var(--sys-size-12);\n  padding-left: var(--sys-size-7);\n  margin-right: var(--sys-size-5);\n  color: var(--sys-color-on-surface);\n\n  & .leading-icons {\n    margin-right: var(--sys-size-6);\n    flex: none;\n  }\n\n  & .selection {\n    border-radius: 0 100px 100px 0;\n  }\n}\n\n.tree-outline .profile-launcher-view-tree-item,\n.tree-outline li.profiles-tree-section + .children > li {\n  border-radius: 0 100px 100px 0;\n  position: relative;\n\n  &.selected {\n    background-color: var(--app-color-navigation-drawer-background-selected);\n    color: var(--app-color-navigation-drawer-label-selected);\n\n    & devtools-icon {\n      color: var(--app-color-navigation-drawer-label-selected);\n    }\n\n    & > .icon:not(.spinner) {\n      background-color: var(--app-color-navigation-drawer-label-selected);\n    }\n  }\n\n  &:active::before {\n    background-color: var(--sys-color-state-ripple-neutral-on-subtle);\n    mask-image: none;\n    content: \"\";\n    height: 100%;\n    width: 100%;\n    border-radius: inherit;\n    position: absolute;\n    top: 0;\n    left: 0;\n  }\n\n  &:focus-visible {\n    box-shadow: inset 0 0 0 2px var(--sys-color-state-focus-ring);\n  }\n}\n\n.tree-outline li.profiles-tree-section {\n  margin-top: var(--sys-size-6);\n  line-height: var(--sys-size-8);\n\n  &:hover:not(:has(devtools-checkbox)) .selection {\n    background-color: transparent;\n  }\n}\n\n.tree-outline li.profiles-tree-section::before {\n  display: none;\n}\n\n.tree-outline ol {\n  overflow: hidden;\n  padding: 0;\n}\n\n/* Generic items styling */\n\nli.wait .spinner::before {\n  --dimension: 20px;\n\n  margin: 0;\n}\n\nli.wait.small .spinner::before {\n  --dimension: 14px;\n  --clip-size: 9px;\n  --override-spinner-size: 2px;\n\n  margin: 1px;\n}\n\nli.wait.selected .spinner::before {\n  --override-spinner-color: var(--ref-palette-neutral100);\n}\n\n@keyframes spinner-animation {\n  from {\n    transform: rotate(0);\n  }\n\n  to {\n    transform: rotate(360deg);\n  }\n}\n\nli.small {\n  height: 20px;\n}\n\nli .titles {\n  display: inline-flex;\n  padding-right: var(--sys-size-5);\n}\n\nli .titles > .title-container {\n  z-index: 1;\n  overflow: hidden;\n}\n\nli .titles > .title-container:has(:not(.editing)) {\n  text-overflow: ellipsis;\n}\n\nli .titles > .title-container .title.editing {\n  display: flex;\n  overflow: hidden;\n  margin-inline: 0;\n  padding-inline: 0;\n}\n\nli.small .titles {\n  top: 2px;\n  line-height: normal;\n}\n\nli:not(.small) .title::after {\n  content: \"\\A\";\n  white-space: pre;\n}\n\nli .subtitle {\n  text-overflow: ellipsis;\n  overflow: hidden;\n  margin-left: var(--sys-size-3);\n}\n\nli.small .subtitle {\n  display: none;\n}\n\nli.selected:hover devtools-button {\n  visibility: visible;\n  margin-left: auto;\n}\n\n@media (forced-colors: active) {\n  .tree-outline li,\n  .tree-outline li.profiles-tree-section,\n  .tree-outline li:hover .tree-element-title {\n    forced-color-adjust: none;\n    color: ButtonText;\n    text-shadow: unset;\n  }\n\n  .tree-outline .profile-launcher-view-tree-item,\n  .tree-outline li.profiles-tree-section + .children > li {\n    &.selected {\n      background-color: Highlight;\n      color: HighlightText;\n\n      & devtools-icon {\n        color: HighlightText;\n      }\n\n      & > .icon:not(.spinner) {\n        background-color: HighlightText;\n      }\n    }\n  }\n}\n", ri = /* @__PURE__ */ e({
	ActionDelegate: () => di,
	ProfileGroupSidebarTreeElement: () => li,
	ProfileTypeSidebarSection: () => ci,
	ProfilesPanel: () => si,
	ProfilesSidebarTreeElement: () => ui
}), Q = {
	cantLoadFileSupportedFile: "Can’t load file. Supported file extensions: ''{PH1}''.",
	cantLoadProfileWhileAnother: "Can’t load profile while another profile is being recorded.",
	profileLoadingFailed: "Profile loading failed",
	failReason: "Reason: {PH1}.",
	runD: "Run {PH1}",
	profiles: "Profiles"
}, ii = o("panels/profiler/ProfilesPanel.ts", Q), $ = r.bind(void 0, ii);
function ai(e, t) {
	if (e instanceof J) return new ei(t, e, "heap-snapshot-sidebar-tree-item");
	if (e instanceof On) return new ei(t, e, "profile-sidebar-tree-item");
	throw Error("Not implemented.");
}
function oi(e, t, n) {
	if (e instanceof J) return new Dr(t, e, n);
	if (e instanceof qn) return new Un(e);
	if (e instanceof Mn) return new An(t, e);
	throw Error("Not implemented.");
}
var si = class e extends ae {
	profilesItemTreeElement;
	sidebarTree;
	profileViews;
	toolbarElement;
	toggleRecordAction;
	toggleRecordButton;
	#e;
	profileViewToolbar;
	profileGroups;
	launcherView;
	visibleView;
	profileToView;
	typeIdToSidebarSection;
	fileSelectorElement;
	selectedProfileType;
	static registry = {
		heapSnapshotProfileType: new Nr(),
		trackingHeapSnapshotProfileType: new Fr(),
		samplingHeapProfileType: new Kn(),
		detachedElementProfileType: new jn()
	};
	constructor(e, t) {
		super(e), this.registerRequiredCSS(kt, ti, Nn);
		let n = new b();
		this.splitWidget().setMainWidget(n), this.profilesItemTreeElement = new ui(this), this.sidebarTree = new nt(), this.sidebarTree.registerRequiredCSS(ni), this.sidebarTree.element.classList.add("profiles-sidebar-tree-box"), this.panelSidebarElement().appendChild(this.sidebarTree.element), this.sidebarTree.appendChild(this.profilesItemTreeElement), this.sidebarTree.element.addEventListener("keydown", this.onKeyDown.bind(this), !1), this.profileViews = document.createElement("div"), this.profileViews.id = "profile-views", this.profileViews.classList.add("vbox"), n.element.appendChild(this.profileViews), this.toolbarElement = document.createElement("div"), this.toolbarElement.classList.add("profiles-toolbar"), n.element.insertBefore(this.toolbarElement, n.element.firstChild), this.panelSidebarElement().classList.add("profiles-tree-sidebar");
		let r = document.createElement("div");
		r.classList.add("profiles-toolbar"), r.setAttribute("jslog", `${Ye("profiles-sidebar")}`), this.panelSidebarElement().insertBefore(r, this.panelSidebarElement().firstChild);
		let i = r.createChild("devtools-toolbar");
		i.wrappable = !0, this.toggleRecordAction = Ze.instance().getAction(t), this.toggleRecordButton = De.createActionButton(this.toggleRecordAction), i.appendToolbarItem(this.toggleRecordButton), i.appendToolbarItem(De.createActionButton("profiler.clear-all")), i.appendSeparator(), i.appendToolbarItem(De.createActionButton("profiler.load-from-file")), this.#e = Ze.instance().getAction("profiler.save-to-file"), this.#e.setEnabled(!1), i.appendToolbarItem(De.createActionButton(this.#e)), i.appendSeparator(), i.appendToolbarItem(De.createActionButton("components.collect-garbage")), this.profileViewToolbar = this.toolbarElement.createChild("devtools-toolbar"), this.profileViewToolbar.wrappable = !0, this.profileViewToolbar.setAttribute("jslog", `${Ye("profile-view")}`), this.profileGroups = {}, this.launcherView = new Jr(this), this.launcherView.addEventListener(Yr.PROFILE_TYPE_SELECTED, this.onProfileTypeSelected, this), this.profileToView = [], this.typeIdToSidebarSection = {};
		let a = this.profileTypes;
		for (let e = 0; e < a.length; e++) this.registerProfileType(a[e]);
		this.launcherView.restoreSelectedProfileType(), this.profilesItemTreeElement.select(), this.showLauncherView(), this.createFileSelectorElement(), S.instance().addEventListener(qe.SUSPEND_STATE_CHANGED, this.onSuspendStateChanged, this), x.instance().addFlavorChangeListener(Qe, this.updateProfileTypeSpecificUI, this), x.instance().addFlavorChangeListener(_, this.updateProfileTypeSpecificUI, this);
	}
	get profileTypes() {
		return Object.values(e.registry);
	}
	onKeyDown(e) {
		let t = !1;
		e.key === "ArrowDown" && !e.altKey ? t = this.sidebarTree.selectNext() : e.key === "ArrowUp" && !e.altKey && (t = this.sidebarTree.selectPrevious()), t && e.consume(!0);
	}
	searchableView() {
		let e = this.visibleView;
		return e?.searchableView ? e.searchableView() : null;
	}
	createFileSelectorElement() {
		this.fileSelectorElement && this.element.removeChild(this.fileSelectorElement), this.fileSelectorElement = lt(this.loadFromFile.bind(this)), this.element.appendChild(this.fileSelectorElement);
	}
	findProfileTypeByExtension(e) {
		return this.profileTypes.find((t) => !!t.fileExtension() && e.endsWith(t.fileExtension() || "")) || null;
	}
	async loadFromFile(e) {
		this.createFileSelectorElement();
		let t = this.findProfileTypeByExtension(e.name);
		if (!t) {
			let e = new Set(this.profileTypes.map((e) => e.fileExtension()).filter((e) => e));
			g.instance().error($(Q.cantLoadFileSupportedFile, { PH1: Array.from(e).join("', '") }));
			return;
		}
		if (t.profileBeingRecorded()) {
			g.instance().error($(Q.cantLoadProfileWhileAnother));
			return;
		}
		let n = await t.loadFromFile(e);
		n && "message" in n && me.show($(Q.profileLoadingFailed), $(Q.failReason, { PH1: n.message }), void 0, "profile-loading-failed");
	}
	toggleRecord() {
		if (!this.toggleRecordAction.enabled()) return !0;
		let e = ct(this.element.ownerDocument), t = this.selectedProfileType;
		if (!t) return !0;
		let n = t.buttonClicked();
		return this.updateToggleRecordAction(n), n ? (this.launcherView.profileStarted(), t.hasTemporaryView() && this.showProfile(t.profileBeingRecorded())) : this.launcherView.profileFinished(), e && e.focus(), !0;
	}
	onSuspendStateChanged() {
		this.updateToggleRecordAction(this.toggleRecordAction.toggled());
	}
	updateToggleRecordAction(e) {
		let t = !!(x.instance().flavor(Qe) || x.instance().flavor(_)), n = e || !S.instance().allTargetsSuspended() && t;
		this.toggleRecordAction.setEnabled(n), this.toggleRecordAction.setToggled(e), n ? this.toggleRecordButton.setTitle(this.selectedProfileType ? this.selectedProfileType.buttonTooltip : "") : this.toggleRecordButton.setTitle(st()), this.selectedProfileType && this.launcherView.updateProfileType(this.selectedProfileType, n);
	}
	profileBeingRecordedRemoved() {
		this.updateToggleRecordAction(!1), this.launcherView.profileFinished();
	}
	onProfileTypeSelected(e) {
		this.selectedProfileType = e.data, this.updateProfileTypeSpecificUI();
	}
	updateProfileTypeSpecificUI() {
		this.selectedProfileType?.isInstantProfile() && this.toggleRecordButton.toggleOnClick(!1), this.updateToggleRecordAction(this.toggleRecordAction.toggled());
	}
	reset() {
		this.profileTypes.forEach((e) => e.reset()), delete this.visibleView, this.profileGroups = {}, this.updateToggleRecordAction(!1), this.launcherView.profileFinished(), this.sidebarTree.element.classList.remove("some-expandable"), this.launcherView.detach(), this.profileViews.removeChildren(), this.profileViewToolbar.removeToolbarItems(), this.profilesItemTreeElement.select(), this.showLauncherView();
	}
	showLauncherView() {
		this.closeVisibleView(), this.profileViewToolbar.removeToolbarItems(), this.launcherView.show(this.profileViews), this.visibleView = this.launcherView, this.toolbarElement.classList.add("hidden"), this.#e.setEnabled(!1);
	}
	registerProfileType(e) {
		this.launcherView.addProfileType(e);
		let t = new ci(this, e);
		this.typeIdToSidebarSection[e.id] = t, this.sidebarTree.appendChild(t);
		function n(e) {
			this.addProfileHeader(e.data);
		}
		function r(e) {
			this.removeProfileHeader(e.data);
		}
		function i(e) {
			this.showProfile(e.data);
		}
		e.addEventListener(N.VIEW_UPDATED, this.updateProfileTypeSpecificUI, this), e.addEventListener(N.ADD_PROFILE_HEADER, n, this), e.addEventListener(N.REMOVE_PROFILE_HEADER, r, this), e.addEventListener(N.PROFILE_COMPLETE, i, this);
		let a = e.getProfiles();
		for (let e = 0; e < a.length; e++) this.addProfileHeader(a[e]);
	}
	showLoadFromFileDialog() {
		this.fileSelectorElement.click();
	}
	addProfileHeader(e) {
		let t = e.profileType().id;
		this.typeIdToSidebarSection[t].addProfileHeader(e), (!this.visibleView || this.visibleView === this.launcherView) && this.showProfile(e);
	}
	removeProfileHeader(e) {
		e.profileType().profileBeingRecorded() === e && this.profileBeingRecordedRemoved();
		let t = this.indexOfViewForProfile(e);
		t !== -1 && this.profileToView.splice(t, 1);
		let n = e.profileType().id;
		this.typeIdToSidebarSection[n].removeProfileHeader(e) && (this.profilesItemTreeElement.select(), this.showLauncherView());
	}
	showProfile(e) {
		if (!e || e.profileType().profileBeingRecorded() === e && !e.profileType().hasTemporaryView()) return null;
		let t = this.viewForProfile(e);
		if (t === this.visibleView) return t;
		this.closeVisibleView(), x.instance().setFlavor(j, e), this.#e.setEnabled(e.canSaveToFile()), t.show(this.profileViews), this.toolbarElement.classList.remove("hidden"), this.visibleView = t;
		let n = this.typeIdToSidebarSection[e.profileType().id].sidebarElementForProfile(e);
		return n && n.revealAndSelect(), this.profileViewToolbar.removeToolbarItems(), t.toolbarItems().then((e) => {
			Array.isArray(e) ? e.map((e) => this.profileViewToolbar.appendToolbarItem(e)) : de(e, this.profileViewToolbar);
		}), t;
	}
	showObject(e, t) {}
	async linkifyObject(e) {
		return null;
	}
	viewForProfile(t) {
		let n = this.indexOfViewForProfile(t);
		if (n !== -1) return this.profileToView[n].view;
		let r = oi(t, this, e.registry);
		return r.element.classList.add("profile-view"), this.profileToView.push({
			profile: t,
			view: r
		}), r;
	}
	indexOfViewForProfile(e) {
		return this.profileToView.findIndex((t) => t.profile === e);
	}
	closeVisibleView() {
		x.instance().setFlavor(j, null), this.#e.setEnabled(!1), this.visibleView && this.visibleView.detach(), delete this.visibleView;
	}
	focus() {
		this.sidebarTree.focus();
	}
	wasShown() {
		super.wasShown(), x.instance().setFlavor(e, this);
	}
	willHide() {
		x.instance().setFlavor(e, null), super.willHide();
	}
}, ci = class extends Ue {
	dataDisplayDelegate;
	profileTreeElements;
	profileGroups;
	constructor(e, t) {
		super(t.treeItemTitle, !0), this.selectable = !1, this.dataDisplayDelegate = e, this.profileTreeElements = [], this.profileGroups = {}, this.expand(), this.hidden = !0, this.setCollapsible(!1);
	}
	addProfileHeader(e) {
		this.hidden = !1;
		let t = e.profileType(), n = this, r = ai(e, this.dataDisplayDelegate);
		if (this.profileTreeElements.push(r), !e.fromFile() && t.profileBeingRecorded() !== e) {
			let t = e.title, i = this.profileGroups[t];
			i || (i = {
				profileSidebarTreeElements: [],
				sidebarTreeElement: null
			}, this.profileGroups[t] = i), i.profileSidebarTreeElements.push(r);
			let a = i.profileSidebarTreeElements.length;
			if (a === 2) {
				i.sidebarTreeElement = new li(this.dataDisplayDelegate, e.title);
				let t = i.profileSidebarTreeElements[0], n = this.children().indexOf(t);
				this.insertChild(i.sidebarTreeElement, n);
				let r = t.selected;
				this.removeChild(t), i.sidebarTreeElement.appendChild(t), r && t.revealAndSelect(), t.setSmall(!0), t.setMainTitle($(Q.runD, { PH1: 1 })), this.treeOutline && this.treeOutline.element.classList.add("some-expandable");
			}
			a >= 2 && (n = i.sidebarTreeElement, r.setSmall(!0), r.setMainTitle($(Q.runD, { PH1: a })));
		}
		n && n.appendChild(r);
	}
	removeProfileHeader(e) {
		let t = this.sidebarElementIndex(e);
		if (t === -1) return !1;
		let n = this.profileTreeElements[t];
		this.profileTreeElements.splice(t, 1);
		let r = this, i = this.profileGroups[e.title];
		if (i) {
			let t = i.profileSidebarTreeElements;
			if (t.splice(t.indexOf(n), 1), t.length === 1) {
				let n = r.children().indexOf(i.sidebarTreeElement);
				i.sidebarTreeElement && i.sidebarTreeElement.removeChild(t[0]), this.insertChild(t[0], n), t[0].setSmall(!1), t[0].setMainTitle(e.title), i.sidebarTreeElement && this.removeChild(i.sidebarTreeElement);
			}
			t.length !== 0 && (r = i.sidebarTreeElement);
		}
		return r && r.removeChild(n), n.dispose(), !this.childCount() && (this.hidden = !0, !0);
	}
	sidebarElementForProfile(e) {
		let t = this.sidebarElementIndex(e);
		return t === -1 ? null : this.profileTreeElements[t];
	}
	sidebarElementIndex(e) {
		let t = this.profileTreeElements;
		for (let n = 0; n < t.length; n++) if (t[n].profile === e) return n;
		return -1;
	}
	onattach() {
		this.listItemElement.classList.add("profiles-tree-section");
	}
}, li = class extends Ue {
	dataDisplayDelegate;
	profileTitle;
	constructor(e, t) {
		super("", !0), this.selectable = !1, this.dataDisplayDelegate = e, this.profileTitle = t, this.expand(), this.toggleOnClick = !0;
	}
	onselect() {
		let e = this.childCount() > 0;
		if (e) {
			let e = this.lastChild();
			e instanceof ei && this.dataDisplayDelegate.showProfile(e.profile);
		}
		return e;
	}
	onattach() {
		this.listItemElement.classList.add("profile-group-sidebar-tree-item"), this.listItemElement.createChild("div", "icon"), this.listItemElement.createChild("div", "titles no-subtitle").createChild("span", "title-container").createChild("span", "title").textContent = this.profileTitle;
	}
}, ui = class extends Ue {
	panel;
	constructor(e) {
		super("", !1), this.selectable = !0, this.panel = e;
	}
	onselect() {
		return this.panel.showLauncherView(), !0;
	}
	onattach() {
		this.listItemElement.classList.add("profile-launcher-view-tree-item"), this.listItemElement.createChild("div", "titles no-subtitle").createChild("span", "title-container").createChild("span", "title").textContent = $(Q.profiles), this.setLeadingIcons([he("tune")]);
	}
}, di = class {
	handleAction(e, t) {
		switch (t) {
			case "profiler.clear-all": {
				let t = e.flavor(si);
				return t !== null && (t.reset(), !0);
			}
			case "profiler.load-from-file": {
				let t = e.flavor(si);
				return t !== null && (t.showLoadFromFileDialog(), !0);
			}
			case "profiler.save-to-file": {
				let t = e.flavor(j);
				return t !== null && (t.saveToFile(), !0);
			}
			case "profiler.delete-profile": {
				let t = e.flavor(j);
				return t !== null && (t.profileType().removeProfile(t), !0);
			}
		}
		return !1;
	}
}, fi = /* @__PURE__ */ e({ HeapProfilerPanel: () => _i }), pi = { revealInSummaryView: "Reveal in Summary view" }, mi = o("panels/profiler/HeapProfilerPanel.ts", pi), hi = r.bind(void 0, mi), gi, _i = class e extends si {
	constructor() {
		super("heap-profiler", "profiler.heap-toggle-recording");
	}
	static instance() {
		return gi ||= new e(), gi;
	}
	appendApplicableItems(e, t, n) {
		if (!this.isShowing() || !n.objectId) return;
		let r = n.objectId;
		if (!si.registry.heapSnapshotProfileType.getProfiles().length) return;
		let i = n.runtimeModel().heapProfilerModel();
		if (!i) return;
		function a(e) {
			i.snapshotObjectIdForObjectId(r).then((t) => {
				this.isShowing() && t && this.showObject(t, e);
			});
		}
		t.revealSection().appendItem(hi(pi.revealInSummaryView), a.bind(this, "Summary"), { jslogContext: "reveal-in-summary" });
	}
	handleAction(t, n) {
		let r = x.instance().flavor(e);
		return console.assert(!!r && r instanceof e), r && r.toggleRecord(), !0;
	}
	wasShown() {
		super.wasShown(), x.instance().setFlavor(e, this), Je.instance().panelLoaded("heap-profiler", "DevTools.Launch.HeapProfiler");
	}
	willHide() {
		x.instance().setFlavor(e, null), super.willHide();
	}
	showObject(e, t) {
		let n = si.registry.heapSnapshotProfileType.getProfiles();
		for (let r = 0; r < n.length; r++) {
			let i = n[r];
			if (i.maxJSObjectId >= parseInt(e, 10)) {
				this.showProfile(i), this.viewForProfile(i).selectLiveObject(t, e);
				break;
			}
		}
	}
}, vi = /* @__PURE__ */ e({});
//#endregion
export { nn as BottomUpProfileDataGrid, Bn as HeapProfileView, fi as HeapProfilerPanel, lr as HeapSnapshotDataGrids, Qn as HeapSnapshotGridNodes, Cr as HeapSnapshotView, Pn as HeapTimelineOverview, Br as IsolateSelector, Xt as ProfileDataGrid, mn as ProfileFlameChart, dn as ProfileHeader, Gr as ProfileLauncherView, Xr as ProfileSidebarTreeElement, vi as ProfileTypeRegistry, wn as ProfileView, ri as ProfilesPanel, xn as TopDownProfileDataGrid };
