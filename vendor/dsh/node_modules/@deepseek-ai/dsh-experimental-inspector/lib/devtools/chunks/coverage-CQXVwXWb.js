import { n as e } from "./rolldown-runtime-DF993M8W.js";
import { D as t, H as n, J as r, K as i, Q as a, X as o, b as s, en as c, i as l } from "./common-DMSVbaSb.js";
import { $i as u, Bc as d, Fo as f, Io as p, Ja as m, L as h, La as g, Md as ee, Ml as te, Mp as ne, Nl as re, Po as _, Qt as ie, Uc as v, Vc as ae, Wo as y, Zo as b, df as x, ei as S, fa as C, ff as w, fl as oe, ii as se, ja as ce, jd as T, jr as le, kl as ue, mo as de, na as E, nc as fe, pf as D, vl as pe } from "./legacy-dM_vujv7.js";
import "./platform-D4TUCh2P.js";
import { t as me } from "./MapUtilities-C6UNTa-e.js";
import { g as O } from "./text_utils-DWSliayn.js";
import { c as he } from "./StringUtilities-CMDxNrEc.js";
import { S as k, f as A, k as ge, o as _e, s as j, w as M } from "./bindings-DyamxTH2.js";
import { t as ve } from "./data_grid-C6uthMeA.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/coverage/CoverageModel.ts
var ye = /* @__PURE__ */ e({
	CoverageInfo: () => B,
	CoverageModel: () => F,
	CoverageType: () => N,
	Events: () => P,
	SourceURLCoverageInfo: () => R,
	SuspensionState: () => be,
	URLCoverageInfo: () => L,
	mergeSegments: () => z
}), N = /* @__PURE__ */ function(e) {
	return e[e.CSS = 1] = "CSS", e[e.JAVA_SCRIPT = 2] = "JAVA_SCRIPT", e[e.JAVA_SCRIPT_PER_FUNCTION = 4] = "JAVA_SCRIPT_PER_FUNCTION", e;
}({}), be = /* @__PURE__ */ function(e) {
	return e.ACTIVE = "Active", e.SUSPENDING = "Suspending", e.SUSPENDED = "Suspended", e;
}({}), P = /* @__PURE__ */ function(e) {
	return e.CoverageUpdated = "CoverageUpdated", e.CoverageReset = "CoverageReset", e.SourceMapResolved = "SourceMapResolved", e;
}({}), xe = 200, Se = 500, F = class e extends x {
	cpuProfilerModel;
	cssModel;
	debuggerModel;
	coverageByURL;
	coverageByContentProvider;
	coverageUpdateTimes;
	suspensionState;
	pollTimer;
	currentPollPromise;
	shouldResumePollingOnResume;
	jsBacklog;
	cssBacklog;
	performanceTraceRecording;
	sourceMapManager;
	willResolveSourceMaps;
	processSourceMapBacklog;
	constructor(e) {
		super(e), this.cpuProfilerModel = e.model(fe), this.cssModel = e.model(ue), this.debuggerModel = e.model(oe), this.sourceMapManager = this.debuggerModel?.sourceMapManager() || null, this.sourceMapManager?.addEventListener(re.SourceMapAttached, this.sourceMapAttached, this), this.coverageByURL = /* @__PURE__ */ new Map(), this.coverageByContentProvider = /* @__PURE__ */ new Map(), this.coverageUpdateTimes = /* @__PURE__ */ new Set(), this.suspensionState = "Active", this.pollTimer = null, this.currentPollPromise = null, this.shouldResumePollingOnResume = !1, this.jsBacklog = [], this.cssBacklog = [], this.performanceTraceRecording = !1, this.willResolveSourceMaps = !1, this.processSourceMapBacklog = [];
	}
	async start(e) {
		if (this.suspensionState !== "Active") throw Error("Cannot start CoverageModel while it is not active.");
		let t = [];
		return this.cssModel && (this.clearCSS(), this.cssModel.addEventListener(te.StyleSheetAdded, this.handleStyleSheetAdded, this), t.push(this.cssModel.startCoverage())), this.cpuProfilerModel && t.push(this.cpuProfilerModel.startPreciseCoverage(e, this.preciseCoverageDeltaUpdate.bind(this))), await Promise.all(t), !!(this.cssModel || this.cpuProfilerModel);
	}
	async sourceMapAttached(e) {
		let t = e.data.client, n = e.data.sourceMap;
		this.processSourceMapBacklog.push({
			script: t,
			sourceMap: n
		}), this.willResolveSourceMaps || (this.willResolveSourceMaps = !0, setTimeout(this.resolveSourceMapsAndUpdate.bind(this), Se));
	}
	async resolveSourceMapsAndUpdate() {
		this.willResolveSourceMaps = !1;
		let e = this.processSourceMapBacklog;
		this.processSourceMapBacklog = [], await Promise.all(e.map(({ script: e, sourceMap: t }) => this.resolveSourceMap(e, t))), this.dispatchEventToListeners("SourceMapResolved");
	}
	async resolveSourceMap(e, t) {
		let n = e.sourceURL, r = this.coverageByURL.get(n);
		if (r && r.sourcesURLCoverageInfo.size === 0) {
			let n = O.contentDataOrEmpty(await e.requestContentData()), [i, a] = this.calculateSizeForSources(t, n.textObj, e.contentLength);
			r.setSourceSegments(a);
			for (let e of t.sourceURLs()) this.addCoverageForSource(e, i.get(e) || 0, r.type(), r);
		}
	}
	async preciseCoverageDeltaUpdate(e, t) {
		this.coverageUpdateTimes.add(e);
		let n = await this.backlogOrProcessJSCoverage(t, e);
		n.length && this.dispatchEventToListeners("CoverageUpdated", n);
	}
	async stop() {
		await this.stopPolling();
		let e = [];
		this.cpuProfilerModel && e.push(this.cpuProfilerModel.stopPreciseCoverage()), this.cssModel && (e.push(this.cssModel.stopCoverage()), this.cssModel.removeEventListener(te.StyleSheetAdded, this.handleStyleSheetAdded, this)), await Promise.all(e);
	}
	reset() {
		this.coverageByURL = /* @__PURE__ */ new Map(), this.coverageByContentProvider = /* @__PURE__ */ new Map(), this.coverageUpdateTimes = /* @__PURE__ */ new Set(), this.dispatchEventToListeners("CoverageReset");
	}
	async startPolling() {
		this.currentPollPromise || this.suspensionState !== "Active" || await this.pollLoop();
	}
	async pollLoop() {
		this.clearTimer(), this.currentPollPromise = this.pollAndCallback(), await this.currentPollPromise, (this.suspensionState === "Active" || this.performanceTraceRecording) && (this.pollTimer = window.setTimeout(() => this.pollLoop(), xe));
	}
	async stopPolling() {
		this.clearTimer(), await this.currentPollPromise, this.currentPollPromise = null, await this.pollAndCallback();
	}
	async pollAndCallback() {
		if (this.suspensionState === "Suspended" && !this.performanceTraceRecording) return;
		let e = await this.takeAllCoverage();
		console.assert(this.suspensionState !== "Suspended" || !!this.performanceTraceRecording, "CoverageModel was suspended while polling."), e.length && this.dispatchEventToListeners("CoverageUpdated", e);
	}
	clearTimer() {
		this.pollTimer &&= (clearTimeout(this.pollTimer), null);
	}
	async preSuspendModel(e) {
		if (this.suspensionState === "Active") {
			if (this.suspensionState = "Suspending", e === "performance-timeline") {
				this.performanceTraceRecording = !0;
				return;
			}
			this.currentPollPromise && (await this.stopPolling(), this.shouldResumePollingOnResume = !0);
		}
	}
	async suspendModel(e) {
		this.suspensionState = "Suspended";
	}
	async resumeModel() {}
	async postResumeModel() {
		this.suspensionState = "Active", this.performanceTraceRecording = !1, this.shouldResumePollingOnResume && (this.shouldResumePollingOnResume = !1, await this.startPolling());
	}
	entries() {
		return Array.from(this.coverageByURL.values());
	}
	getCoverageForUrl(e) {
		return this.coverageByURL.get(e) || null;
	}
	usageForRange(e, t, n) {
		return this.coverageByContentProvider.get(e)?.usageForRange(t, n);
	}
	clearCSS() {
		for (let e of this.coverageByContentProvider.values()) {
			if (e.type() !== 1) continue;
			let t = e.getContentProvider();
			this.coverageByContentProvider.delete(t);
			let n = this.coverageByURL.get(e.url());
			if (!n) continue;
			let r = `${t.startLine}:${t.startColumn}`;
			n.removeCoverageEntry(r, e), n.numberOfEntries() === 0 && this.coverageByURL.delete(e.url());
		}
		if (this.cssModel) for (let e of this.cssModel.getAllStyleSheetHeaders()) this.addStyleSheetToCSSCoverage(e);
	}
	async takeAllCoverage() {
		let [e, t] = await Promise.all([this.takeCSSCoverage(), this.takeJSCoverage()]);
		return [...e, ...t];
	}
	async takeJSCoverage() {
		if (!this.cpuProfilerModel) return [];
		let { coverage: e, timestamp: t } = await this.cpuProfilerModel.takePreciseCoverage();
		return this.coverageUpdateTimes.add(t), await this.backlogOrProcessJSCoverage(e, t);
	}
	async backlogOrProcessJSCoverage(e, t) {
		if (e.length > 0 && this.jsBacklog.push({
			rawCoverageData: e,
			stamp: t
		}), this.suspensionState !== "Active") return [];
		let n = (e, t) => e.stamp - t.stamp, r = [];
		for (let { rawCoverageData: e, stamp: t } of this.jsBacklog.sort(n)) r.push(await this.processJSCoverage(e, t));
		return this.jsBacklog = [], r.flat();
	}
	async processJSBacklog() {
		this.backlogOrProcessJSCoverage([], 0);
	}
	async processJSCoverage(e, t) {
		if (!this.debuggerModel) return [];
		let n = [];
		for (let r of e) {
			let e = this.debuggerModel.scriptForId(r.scriptId);
			if (!e) continue;
			let i = [], a = 2;
			for (let e of r.functions) {
				e.isBlockCoverage === !1 && (e.ranges.length !== 1 || e.ranges[0].count) && (a |= 4);
				for (let t of e.ranges) i.push(t);
			}
			let o = await this.addCoverage(e, e.contentLength, e.lineOffset, e.columnOffset, i, a, t);
			o && n.push(...o);
		}
		return n;
	}
	handleStyleSheetAdded(e) {
		this.addStyleSheetToCSSCoverage(e.data);
	}
	async takeCSSCoverage() {
		if (!this.cssModel || this.suspensionState !== "Active") return [];
		let { coverage: e, timestamp: t } = await this.cssModel.takeCoverageDelta();
		return this.coverageUpdateTimes.add(t), await this.backlogOrProcessCSSCoverage(e, t);
	}
	async backlogOrProcessCSSCoverage(e, t) {
		if (e.length > 0 && this.cssBacklog.push({
			rawCoverageData: e,
			stamp: t
		}), this.suspensionState !== "Active") return [];
		let n = (e, t) => e.stamp - t.stamp, r = [];
		for (let { rawCoverageData: e, stamp: t } of this.cssBacklog.sort(n)) r.push(await this.processCSSCoverage(e, t));
		return this.cssBacklog = [], r.flat();
	}
	async processCSSCoverage(e, t) {
		if (!this.cssModel) return [];
		let n = [], r = /* @__PURE__ */ new Map();
		for (let t of e) {
			let e = this.cssModel.styleSheetHeaderForId(t.styleSheetId);
			if (!e) continue;
			let n = r.get(e);
			n || (n = [], r.set(e, n)), n.push({
				startOffset: t.startOffset,
				endOffset: t.endOffset,
				count: Number(t.used)
			});
		}
		for (let e of r) {
			let r = e[0], i = e[1], a = await this.addCoverage(r, r.contentLength, r.startLine, r.startColumn, i, 1, t);
			a && n.push(...a);
		}
		return n;
	}
	static convertToDisjointSegments(e, t) {
		e.sort((e, t) => e.startOffset - t.startOffset);
		let n = [], r = [];
		for (let t of e) {
			let e = r[r.length - 1];
			for (; e && e.endOffset <= t.startOffset;) i(e.endOffset, e.count), r.pop(), e = r[r.length - 1];
			i(t.startOffset, e ? e.count : 0), r.push(t);
		}
		for (let e = r.pop(); e; e = r.pop()) i(e.endOffset, e.count);
		function i(e, r) {
			let i = n[n.length - 1];
			if (i) {
				if (i.end === e) return;
				if (i.count === r) {
					i.end = e;
					return;
				}
			}
			n.push({
				end: e,
				count: r,
				stamp: t
			});
		}
		return n;
	}
	addStyleSheetToCSSCoverage(e) {
		this.addCoverage(e, e.contentLength, e.startLine, e.startColumn, [], 1, Date.now());
	}
	calculateSizeForSources(e, t, n) {
		let r = /* @__PURE__ */ new Map(), i = [], a = function(e, n, r, i) {
			if (e === r) return i - n;
			if (t) {
				let a = t.offsetFromPosition(e, n);
				return t.offsetFromPosition(r, i) - a;
			}
			return i;
		}, o = e.mappings();
		if (o.length === 0) return [r, i];
		let s = o[0], c = 0;
		c += t ? t.offsetFromPosition(s.lineNumber, s.columnNumber) : a(0, 0, s.lineNumber, s.columnNumber), i.push({
			end: c,
			sourceUrl: ""
		});
		for (let l = 0; l < o.length; l++) {
			let u = o[l], d = e.findEntryRanges(u.lineNumber, u.columnNumber);
			if (d) {
				let e = d.range, i = d.sourceURL, s = r.get(i) || 0, c = 0;
				c = l === o.length - 1 ? n - t.offsetFromPosition(e.startLine, e.startColumn) : a(e.startLine, e.startColumn, e.endLine, e.endColumn), r.set(i, s + c);
			}
			let f = a(s.lineNumber, s.columnNumber, u.lineNumber, u.columnNumber);
			if (c += f, u.sourceURL !== s.sourceURL) {
				if (t) {
					let e = t.offsetFromPosition(u.lineNumber, u.columnNumber);
					i.push({
						end: e,
						sourceUrl: s.sourceURL || ""
					});
				} else i.push({
					end: c,
					sourceUrl: s.sourceURL || ""
				});
			}
			s = u, l === o.length - 1 && i.push({
				end: n,
				sourceUrl: u.sourceURL || ""
			});
		}
		return [r, i];
	}
	async addCoverage(t, n, r, i, a, o, s) {
		let c = [], l = t.contentURL();
		if (!l) return null;
		let u = this.coverageByURL.get(l), d = !1;
		if (!u) {
			d = !0, u = new L(l), this.coverageByURL.set(l, u);
			let e = await this.sourceMapManager?.sourceMapForClientPromise(t);
			if (e) {
				let r = O.contentDataOrEmpty(await t.requestContentData()), [i, a] = this.calculateSizeForSources(e, r.textObj, n);
				u.setSourceSegments(a);
				for (let t of e.sourceURLs()) {
					let e = this.addCoverageForSource(t, i.get(t) || 0, o, u);
					e && c.push(e);
				}
			}
		}
		let f = u.ensureEntry(t, n, r, i, o);
		this.coverageByContentProvider.set(t, f);
		let p = e.convertToDisjointSegments(a, s), m = p[p.length - 1];
		m && m.end < n && p.push({
			end: n,
			stamp: s,
			count: 0
		});
		let h = f.mergeCoverage(p);
		if (!d && h === 0) return null;
		u.addToSizes(h, 0);
		for (let [e, t] of f.sourceDeltaMap) {
			let n = u.sourcesURLCoverageInfo.get(e);
			n && (n.addToSizes(t, 0), n.lastSourceUsedRange = f.sourceUsedRangeMap.get(e) || []);
		}
		return c.push(f), c;
	}
	addCoverageForSource(e, t, n, r) {
		let i = M.instance().uiSourceCodeForURL(e), a = new R(e, r), o = a.ensureEntry(i, t, 0, 0, n);
		return r.sourcesURLCoverageInfo.set(e, a), o;
	}
	async exportReport(e) {
		let t = [], n = Array.from(this.coverageByURL.keys()).sort();
		for (let e of n) {
			let n = this.coverageByURL.get(e);
			if (!n) continue;
			let r = n.url();
			r.startsWith("extensions::") || s(r, "chrome-extension:") || t.push(...await n.entriesForExport());
		}
		await e.write(JSON.stringify(t, void 0, 2)), e.close();
	}
};
x.register(F, {
	capabilities: ee.NONE,
	autostart: !1
});
function I(e, t) {
	let [n, r] = e.split(":"), [i, a] = t.split(":");
	return Number.parseInt(n, 10) - Number.parseInt(i, 10) || Number.parseInt(r, 10) - Number.parseInt(a, 10);
}
var L = class e extends a {
	#e;
	coverageInfoByLocation;
	#t;
	#n;
	#r;
	#i;
	sourcesURLCoverageInfo = /* @__PURE__ */ new Map();
	sourceSegments;
	constructor(e) {
		super(), this.#e = e, this.coverageInfoByLocation = /* @__PURE__ */ new Map(), this.#t = 0, this.#n = 0, this.#i = !1;
	}
	url() {
		return this.#e;
	}
	type() {
		return this.#r;
	}
	size() {
		return this.#t;
	}
	usedSize() {
		return this.#n;
	}
	unusedSize() {
		return this.#t - this.#n;
	}
	usedPercentage() {
		return this.#t === 0 || !this.unusedSize() || !this.size() ? 0 : this.usedSize() / this.size();
	}
	unusedPercentage() {
		return this.#t === 0 ? 1 : this.unusedSize() / this.size();
	}
	isContentScript() {
		return this.#i;
	}
	entries() {
		return this.coverageInfoByLocation.values();
	}
	numberOfEntries() {
		return this.coverageInfoByLocation.size;
	}
	removeCoverageEntry(e, t) {
		this.coverageInfoByLocation.delete(e) && this.addToSizes(-t.getUsedSize(), -t.getSize());
	}
	addToSizes(t, n) {
		this.#n += t, this.#t += n, (t !== 0 || n !== 0) && this.dispatchEventToListeners(e.Events.SizesChanged);
	}
	setSourceSegments(e) {
		this.sourceSegments = e;
	}
	ensureEntry(e, t, n, r, i) {
		let a = `${n}:${r}`, o = this.coverageInfoByLocation.get(a);
		return i & 2 && !this.coverageInfoByLocation.size && e instanceof pe && (this.#i = e.isContentScript()), this.#r |= i, o ? (o.addCoverageType(i), o) : (i & 2 && !this.coverageInfoByLocation.size && e instanceof pe && (this.#i = e.isContentScript()), o = new B(e, t, n, r, i, this), this.coverageInfoByLocation.set(a, o), this.addToSizes(0, t), o);
	}
	async getFullText() {
		let e = !1, t = this.url();
		for (let n of this.coverageInfoByLocation.values()) {
			let { lineOffset: r, columnOffset: i } = n.getOffsets();
			if (r || i) {
				e = !!t;
				break;
			}
		}
		if (!e) return null;
		let n = v.resourceForURL(t);
		return n ? O.contentDataOrEmpty(await n.requestContentData()).textObj : null;
	}
	entriesForExportBasedOnFullText(e) {
		let t = Array.from(this.coverageInfoByLocation.keys()).sort(I), n = {
			url: this.url(),
			ranges: [],
			text: e.value()
		};
		for (let r of t) {
			let t = this.coverageInfoByLocation.get(r);
			if (!t) continue;
			let { lineOffset: i, columnOffset: a } = t.getOffsets(), o = e ? e.offsetFromPosition(i, a) : 0;
			n.ranges.push(...t.rangesForExport(o));
		}
		return n;
	}
	async entriesForExportBasedOnContent() {
		let e = Array.from(this.coverageInfoByLocation.keys()).sort(I), t = [];
		for (let n of e) {
			let e = this.coverageInfoByLocation.get(n);
			if (!e) continue;
			let r = {
				url: this.url(),
				ranges: e.rangesForExport(),
				text: O.textOr(await e.getContentProvider().requestContentData(), null)
			};
			t.push(r);
		}
		return t;
	}
	async entriesForExport() {
		let e = await this.getFullText();
		return e ? [await this.entriesForExportBasedOnFullText(e)] : await this.entriesForExportBasedOnContent();
	}
}, R = class extends L {
	generatedURLCoverageInfo;
	lastSourceUsedRange = [];
	constructor(e, t) {
		super(e), this.generatedURLCoverageInfo = t;
	}
};
(function(e) {
	e.Events = /* @__PURE__ */ function(e) {
		return e.SizesChanged = "SizesChanged", e;
	}({});
})(L ||= {});
var z = (e, t) => {
	let n = [], r = 0, i = 0;
	for (; r < e.length && i < t.length;) {
		let a = e[r], o = t[i], s = (a.count || 0) + (o.count || 0), c = Math.min(a.end, o.end), l = n[n.length - 1], u = Math.min(a.stamp, o.stamp);
		l?.count !== s || l.stamp !== u ? n.push({
			end: c,
			count: s,
			stamp: u
		}) : l.end = c, a.end <= o.end && r++, a.end >= o.end && i++;
	}
	for (; r < e.length; r++) n.push(e[r]);
	for (; i < t.length; i++) n.push(t[i]);
	return n;
}, B = class {
	contentProvider;
	size;
	usedSize;
	statsByTimestamp;
	lineOffset;
	columnOffset;
	coverageType;
	segments;
	generatedUrlCoverageInfo;
	sourceUsedSizeMap = /* @__PURE__ */ new Map();
	sourceDeltaMap = /* @__PURE__ */ new Map();
	sourceUsedRangeMap = /* @__PURE__ */ new Map();
	constructor(e, t, n, r, i, a) {
		this.contentProvider = e, this.size = t, this.usedSize = 0, this.statsByTimestamp = /* @__PURE__ */ new Map(), this.lineOffset = n, this.columnOffset = r, this.coverageType = i, this.generatedUrlCoverageInfo = a, this.segments = [];
	}
	getContentProvider() {
		return this.contentProvider;
	}
	url() {
		return this.contentProvider.contentURL();
	}
	type() {
		return this.coverageType;
	}
	addCoverageType(e) {
		this.coverageType |= e;
	}
	getOffsets() {
		return {
			lineOffset: this.lineOffset,
			columnOffset: this.columnOffset
		};
	}
	mergeCoverage(e) {
		let t = this.usedSize;
		return this.segments = z(this.segments, e), this.updateStats(), this.generatedUrlCoverageInfo.sourceSegments && this.generatedUrlCoverageInfo.sourceSegments.length > 0 && this.updateSourceCoverage(), this.usedSize - t;
	}
	getSize() {
		return this.size;
	}
	getUsedSize() {
		return this.usedSize;
	}
	usageForRange(e, t) {
		let n = c(this.segments, e, (e, t) => e - t.end);
		for (; n < this.segments.length && this.segments[n].end < t; ++n) if (this.segments[n].count) return !0;
		return n < this.segments.length && !!this.segments[n].count;
	}
	updateStats() {
		this.statsByTimestamp = /* @__PURE__ */ new Map(), this.usedSize = 0;
		let e = 0;
		for (let t of this.segments) {
			let n = this.statsByTimestamp.get(t.stamp);
			if (n === void 0 && (n = 0), t.count) {
				let r = t.end - e;
				this.usedSize += r, this.statsByTimestamp.set(t.stamp, n + r);
			}
			e = t.end;
		}
	}
	updateSourceCoverage() {
		let e = /* @__PURE__ */ new Map();
		this.sourceDeltaMap = /* @__PURE__ */ new Map(), this.sourceUsedRangeMap = /* @__PURE__ */ new Map();
		let t = this.generatedUrlCoverageInfo.sourceSegments || [], n = 0, r = 0;
		for (let i of this.segments) {
			let a = i.end;
			if (i.count) for (let i = r; i < t.length; i++) {
				let o = i === 0 ? 0 : t[i - 1].end + 1, s = t[i].end, c = Math.max(n, o), l = Math.min(a, s);
				if (c <= l) {
					let n = l - c + 1, a = {
						start: c,
						end: l
					};
					e.has(t[i].sourceUrl) ? e.set(t[i].sourceUrl, e.get(t[i].sourceUrl) + n) : e.set(t[i].sourceUrl, n), this.sourceUsedRangeMap.has(t[i].sourceUrl) ? this.sourceUsedRangeMap.get(t[i].sourceUrl)?.push(a) : this.sourceUsedRangeMap.set(t[i].sourceUrl, [a]), r = i;
				}
				if (a < s) break;
			}
			n = a + 1;
		}
		for (let [t, n] of e) {
			let e = this.sourceUsedSizeMap.get(t) || 0;
			e !== n && (this.sourceUsedSizeMap.set(t, n), this.sourceDeltaMap.set(t, n - e));
		}
	}
	rangesForExport(e = 0) {
		let t = [], n = 0;
		for (let r of this.segments) {
			if (r.count) {
				let i = t.length > 0 ? t[t.length - 1] : null;
				i?.end === n + e ? i.end = r.end + e : t.push({
					start: n + e,
					end: r.end + e
				});
			}
			n = r.end;
		}
		return t;
	}
}, Ce = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n @scope to (devtools-widget > *) {\n  .data-grid {\n    border: none;\n  }\n\n  .data-grid td .url-outer {\n    width: 100%;\n    display: inline-flex;\n    justify-content: flex-start;\n  }\n\n  .data-grid td .url-outer .filter-highlight {\n    font-weight: bold;\n  }\n\n  .data-grid td .url-prefix {\n    overflow-x: hidden;\n    text-overflow: ellipsis;\n  }\n\n  .data-grid td .url-suffix {\n    flex: none;\n  }\n\n  .data-grid td .bar {\n    display: inline-block;\n    height: 8px;\n    border: 1px solid transparent;\n  }\n\n  .data-grid td .bar-unused-size {\n    background-color: var(--app-color-coverage-unused);\n  }\n\n  .data-grid td .bar-used-size {\n    background-color: var(--app-color-coverage-used);\n  }\n\n  .data-grid td .percent-value {\n    width: 7ex;\n    display: inline-block;\n    color: var(--sys-color-on-surface-subtle);\n  }\n\n  @media (forced-colors: active) {\n    .data-grid td .bar-container {\n      forced-color-adjust: none;\n    }\n\n    .data-grid td .bar-unused-size {\n      background-color: ButtonText;\n    }\n\n    .data-grid td .bar-used-size {\n      background-color: ButtonFace;\n    }\n\n    .data-grid td .bar {\n      border-color: ButtonText;\n    }\n\n    .data-grid .selected td .bar {\n      border-top-color: HighlightText;\n      border-bottom-color: HighlightText;\n    }\n\n    .data-grid .selected td .bar:last-child {\n      border-right-color: HighlightText;\n    }\n\n    .data-grid .selected td .bar:first-child {\n      border-left-color: HighlightText;\n    }\n\n    .data-grid:focus tr.selected span.percent-value {\n      color: HighlightText;\n    }\n  }\n}\n", we = /* @__PURE__ */ e({
	CoverageListView: () => je,
	DEFAULT_VIEW: () => Ae,
	coverageTypeToString: () => U
}), { ifExpanded: Te } = ve, V = {
	css: "CSS",
	jsPerFunction: "JS (per function)",
	jsPerBlock: "JS (per block)",
	url: "URL",
	type: "Type",
	totalBytes: "Total Bytes",
	unusedBytes: "Unused Bytes",
	usageVisualization: "Usage Visualization",
	codeCoverage: "Code Coverage",
	jsCoverageWithPerFunction: "JS coverage with per function granularity: Once a function was executed, the whole function is marked as covered.",
	jsCoverageWithPerBlock: "JS coverage with per block granularity: Once a block of JavaScript was executed, that block is marked as covered.",
	sBytes: "{n, plural, =1 {# byte} other {# bytes}}",
	sBytesS: "{n, plural, =1 {# byte, {percentage}} other {# bytes, {percentage}}}",
	sBytesSBelongToFunctionsThatHave: "{PH1} bytes ({PH2}) belong to functions that have not (yet) been executed.",
	sBytesSBelongToBlocksOf: "{PH1} bytes ({PH2}) belong to blocks of JavaScript that have not (yet) been executed.",
	sBytesSBelongToFunctionsThatHaveExecuted: "{PH1} bytes ({PH2}) belong to functions that have executed at least once.",
	sBytesSBelongToBlocksOfJavascript: "{PH1} bytes ({PH2}) belong to blocks of JavaScript that have executed at least once.",
	sOfFileUnusedSOfFileUsed: "{PH1} % of file unused, {PH2} % of file used"
}, Ee = i("panels/coverage/CoverageListView.ts", V), H = n.bind(void 0, Ee), { styleMap: De, repeat: Oe } = y;
function U(e) {
	let t = [];
	return e & N.CSS && t.push(H(V.css)), e & N.JAVA_SCRIPT_PER_FUNCTION ? t.push(H(V.jsPerFunction)) : e & N.JAVA_SCRIPT && t.push(H(V.jsPerBlock)), t.join("+");
}
var ke = (e) => Fe().format(e ?? 0), W = (e) => Ne().format(e ?? 0), Ae = (e, t, n) => {
	f(_`
    <style>${Ce}</style>
    <devtools-data-grid class="flex-auto" name=${H(V.codeCoverage)} striped autofocus resize="last"
      .template=${_`
        <table>
          <tr>
            <th id="url" width="250px" weight="3" sortable>${H(V.url)}</th>
            <th id="type" width="45px" weight="1" fixed sortable>${H(V.type)}</th>
            <th id="size" width="60px" align="right" weight="1" fixed sortable>${H(V.totalBytes)}</th>
            <th id="unused-size" width="100px" align="right" weight="1" fixed sortable sort="descending">${H(V.unusedBytes)}</th>
            <th id="bars" width="250px" weight="1" sortable>${H(V.usageVisualization)}</th>
          </tr>
          ${Oe(e.items, (e) => e.url, (t) => Ie(t, e))}
        </table>`}>
      </devtools-data-grid>`, n);
}, je = class extends S {
	#e;
	#t = [];
	#n = null;
	#r = 0;
	#i = /* @__PURE__ */ new Set();
	#a;
	constructor(e, t = Ae) {
		super(e, {
			useShadowDom: !0,
			delegatesFocus: !0
		}), this.#a = t, this.#e = null;
	}
	set highlightRegExp(e) {
		this.#e = e, this.requestUpdate();
	}
	get highlightRegExp() {
		return this.#e;
	}
	set coverageInfo(e) {
		this.#t = e, this.#r = e.reduce((e, t) => Math.max(e, t.size), 0), this.requestUpdate();
	}
	get coverageInfo() {
		return this.#t;
	}
	performUpdate() {
		let e = {
			items: this.#t,
			selectedUrl: this.#n,
			maxSize: this.#r,
			expandedUrls: this.#i,
			onOpen: (e) => {
				this.selectedUrl = e;
			},
			onExpand: () => {
				this.requestUpdate();
			},
			onCollapse: () => {
				this.requestUpdate();
			},
			highlightRegExp: this.#e
		};
		this.#a(e, {}, this.contentElement);
	}
	reset() {
		this.#t = [], this.#r = 0, this.requestUpdate();
	}
	set selectedUrl(e) {
		if (!this.#t.find((t) => t.url === e)) return;
		this.#n !== e && (this.#n = e, this.requestUpdate());
		let n = e ? M.instance().uiSourceCodeForURL(e) : null;
		n && t(n);
	}
	get selectedUrl() {
		return this.#n;
	}
}, Me = null;
function Ne() {
	return Me ||= new Intl.NumberFormat(o.instance().locale, {
		style: "percent",
		maximumFractionDigits: 1
	}), Me;
}
var Pe = null;
function Fe() {
	return Pe ||= new Intl.NumberFormat(o.instance().locale), Pe;
}
function Ie(e, t) {
	function n(e) {
		let n = t.highlightRegExp?.exec(e);
		return n?.length ? `${n.index},${n[0].length}` : "";
	}
	let r = /^(.*)(\/[^/]*)$/.exec(e.url);
	return _`
    <style>${Ce}</style>
    <tr data-url=${e.url} selected=${e.url === t.selectedUrl}
        @open=${() => t.onOpen(e.url)}
        @expand=${() => t.onExpand()}
        @collapse=${() => t.onCollapse()}>
      <td data-value=${e.url} title=${e.url} aria-label=${e.url}>
        <devtools-highlight ranges=${n(e.url)} class="url-outer" aria-hidden="true">
          <div class="url-prefix">${r ? r[1] : e.url}</div>
          <div class="url-suffix">${r ? r[2] : ""}</div>
        </devtools-highlight>
      </td>
      <td data-value=${U(e.type)}
          title=${e.type & N.JAVA_SCRIPT_PER_FUNCTION ? H(V.jsCoverageWithPerFunction) : e.type & N.JAVA_SCRIPT ? H(V.jsCoverageWithPerBlock) : ""}>
        ${U(e.type)}
      </td>
      <td data-value=${e.size} aria-label=${H(V.sBytes, { n: e.size || 0 })}>
        <span>${ke(e.size)}</span>
      </td>
      <td data-value=${e.unusedSize} aria-label=${H(V.sBytesS, {
		n: e.unusedSize,
		percentage: W(e.unusedPercentage)
	})}>
        <span>${ke(e.unusedSize)}</span>
        <span class="percent-value">
          ${W(e.unusedPercentage)}
        </span>
      </td>
      <td data-value=${e.unusedSize} aria-label=${H(V.sOfFileUnusedSOfFileUsed, {
		PH1: W(e.unusedPercentage),
		PH2: W(e.usedPercentage)
	})}>
        <div class="bar-container">
          ${e.unusedSize > 0 ? _`
            <div class="bar bar-unused-size"
                title=${e.type & N.JAVA_SCRIPT_PER_FUNCTION ? H(V.sBytesSBelongToFunctionsThatHave, {
		PH1: e.unusedSize,
		PH2: W(e.unusedPercentage)
	}) : e.type & N.JAVA_SCRIPT ? H(V.sBytesSBelongToBlocksOf, {
		PH1: e.unusedSize,
		PH2: W(e.unusedPercentage)
	}) : ""}
                  style=${De({ width: (e.unusedSize / t.maxSize * 100 || 0) + "%" })}>
            </div>` : b}
          ${e.usedSize > 0 ? _`
            <div class="bar bar-used-size"
                  title=${e.type & N.JAVA_SCRIPT_PER_FUNCTION ? H(V.sBytesSBelongToFunctionsThatHaveExecuted, {
		PH1: e.usedSize,
		PH2: W(e.usedPercentage)
	}) : e.type & N.JAVA_SCRIPT ? H(V.sBytesSBelongToBlocksOfJavascript, {
		PH1: e.usedSize,
		PH2: W(e.usedPercentage)
	}) : ""}
                style=${De({ width: (e.usedSize / t.maxSize * 100 || 0) + "%" })}>
            </div>` : b}
        </div>
      </td>
      ${e.sources.length > 0 ? _`
        <td><table>
          ${Te(_`${Oe(e.sources, (e) => e.url, (e) => Ie(e, t))}`)}
        </table></td>` : b}
    </tr>`;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/coverage/CoverageDecorationManager.ts
var Le = /* @__PURE__ */ e({
	CoverageDecorationManager: () => K,
	decoratorType: () => G
}), G = "coverage", K = class e {
	coverageModel;
	textByProvider;
	uiSourceCodeByContentProvider;
	#e;
	#t;
	#n;
	constructor(e, t, n, r) {
		this.coverageModel = e, this.#e = t, this.#t = n, this.#n = r, this.textByProvider = /* @__PURE__ */ new Map(), this.uiSourceCodeByContentProvider = new me();
		for (let e of this.#e.uiSourceCodes()) e.setDecorationData(G, this);
		this.#e.addEventListener(k.UISourceCodeAdded, this.onUISourceCodeAdded, this);
	}
	reset() {
		for (let e of this.#e.uiSourceCodes()) e.setDecorationData(G, void 0);
	}
	dispose() {
		this.reset(), this.#e.removeEventListener(k.UISourceCodeAdded, this.onUISourceCodeAdded, this);
	}
	update(e) {
		for (let t of e) for (let e of this.uiSourceCodeByContentProvider.get(t.getContentProvider())) e.setDecorationData(G, this);
	}
	async usageByLine(t, n) {
		let r = [];
		await this.updateTexts(t, n);
		for (let { startLine: i, startColumn: a, endLine: o, endColumn: s } of n) {
			let n = this.rawLocationsForSourceLocation(t, i, a), c = this.rawLocationsForSourceLocation(t, o, s), [l, u] = await Promise.all([n, c]), d;
			for (let t = 0, n = 0; t < l.length; ++t) {
				let r = l[t];
				for (; n < u.length && e.compareLocations(r, u[n]) >= 0;) ++n;
				if (n >= u.length || u[n].id !== r.id) continue;
				let i = u[n++], a = this.textByProvider.get(i.contentProvider);
				if (!a) continue;
				let o = a.value(), s = Math.min(a.offsetFromPosition(r.line, r.column), o.length - 1), c = Math.min(a.offsetFromPosition(i.line, i.column), o.length - 1);
				for (; s <= c && /\s/.test(o[s]);) ++s;
				for (; s <= c && /\s/.test(o[c]);) --c;
				if (s <= c && (d = this.coverageModel.usageForRange(i.contentProvider, s, c)), d) break;
			}
			r.push(d);
		}
		return r;
	}
	async updateTexts(e, t) {
		let n = [];
		for (let r of t) for (let t of await this.rawLocationsForSourceLocation(e, r.startLine, 0)) this.textByProvider.has(t.contentProvider) || (this.textByProvider.set(t.contentProvider, null), this.uiSourceCodeByContentProvider.set(t.contentProvider, e), n.push(this.updateTextForProvider(t.contentProvider)));
		await Promise.all(n);
	}
	async updateTextForProvider(e) {
		let t = O.contentDataOrEmpty(await e.requestContentData());
		this.textByProvider.set(e, t.textObj);
	}
	async rawLocationsForSourceLocation(t, n, r) {
		let i = [], a = t.contentType();
		if (a.hasScripts()) {
			let e = await this.#t.uiLocationToRawLocations(t, n, r);
			e = e.filter((e) => !!e.script());
			for (let t of e) {
				let e = t.script();
				e && (e.isInlineScript() && a.isDocument() && (t.lineNumber -= e.lineOffset, t.lineNumber || (t.columnNumber -= e.columnOffset)), i.push({
					id: `js:${t.scriptId}`,
					contentProvider: e,
					line: t.lineNumber,
					column: t.columnNumber
				}));
			}
		}
		if (a.isStyleSheet() || a.isDocument()) {
			let e = this.#n.uiLocationToRawLocations(new ge(t, n, r));
			for (let t of e) {
				let e = t.header();
				e && (e.isInline && a.isDocument() && (t.lineNumber -= e.startLine, t.lineNumber || (t.columnNumber -= e.startColumn)), i.push({
					id: `css:${t.styleSheetId}`,
					contentProvider: e,
					line: t.lineNumber,
					column: t.columnNumber
				}));
			}
		}
		return i.sort(e.compareLocations);
	}
	static compareLocations(e, t) {
		return e.id.localeCompare(t.id) || e.line - t.line || e.column - t.column;
	}
	onUISourceCodeAdded(e) {
		e.data.setDecorationData(G, this);
	}
}, Re = "/*\n * Copyright 2016 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  overflow: hidden;\n}\n\n.coverage-toolbar-container {\n  display: flex;\n  border-bottom: 1px solid var(--sys-color-divider);\n  flex: 0 0 auto;\n}\n\n.coverage-toolbar {\n  flex: auto;\n}\n\n.coverage-toolbar-summary {\n  background-color: var(--sys-color-cdt-base-container);\n  border-top: 1px solid var(--sys-color-divider);\n  padding-left: 5px;\n  flex: 0 0 19px;\n  display: flex;\n  padding-right: 5px;\n}\n\n.coverage-toolbar-summary .coverage-message {\n  padding-top: 2px;\n  padding-left: 1ex;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n}\n\n.coverage-results {\n  overflow-y: auto;\n  display: flex;\n  flex: auto;\n}\n\n.bfcache-page,\n.prerender-page {\n  justify-content: center;\n  align-items: center;\n  padding: 20px;\n}\n\n.bfcache-page .message,\n.prerender-page .message {\n  white-space: pre-line;\n  text-align: center;\n}\n\n.inline-button {\n  display: inline-flex;\n  border: 1px solid var(--sys-color-neutral-outline);\n  border-radius: 4px;\n  position: relative;\n  vertical-align: sub;\n  margin: 2px;\n  background-color: var(--sys-color-cdt-base-container);\n  justify-content: center;\n  width: 28px;\n}\n\n.inline-button:hover {\n  border-color: transparent;\n  background-color: var(--sys-color-state-hover-on-subtle);\n}\n", ze = /* @__PURE__ */ e({
	ActionDelegate: () => Ke,
	CoverageView: () => Ge,
	DEFAULT_VIEW: () => $
}), q = {
	chooseCoverageGranularityPer: "Choose coverage granularity: Per function has low overhead, per block has significant overhead.",
	perFunction: "Per function",
	perBlock: "Per block",
	filterByUrl: "Filter by URL",
	filterCoverageByType: "Filter coverage by type",
	all: "All",
	css: "CSS",
	javascript: "JavaScript",
	includeExtensionContentScripts: "Include extension content scripts",
	contentScripts: "Content scripts",
	noCoverageData: "No coverage data",
	reloadPage: "Reload page",
	startRecording: "Start recording",
	clickTheReloadButtonSToReloadAnd: "Click the \"{PH1}\" button to reload and start capturing coverage.",
	clickTheRecordButtonSToStart: "Click the \"{PH1}\" button to start capturing coverage.",
	bfcacheNoCapture: "Could not capture coverage info because the page was served from the back/forward cache.",
	activationNoCapture: "Could not capture coverage info because the page was prerendered in the background.",
	reloadPrompt: "Click the reload button {PH1} to reload and get coverage.",
	filteredSTotalS: "Filtered: {PH1}  Total: {PH2}",
	sOfSSUsedSoFarSUnused: "{PH1} of {PH2} ({PH3}%) used so far, {PH4} unused."
}, J = i("panels/coverage/CoverageView.ts", q), Y = n.bind(void 0, J), Be = p.bind(void 0, J), { ref: Ve } = y, { bindToAction: X, bindToSetting: He } = ie, { widget: Z } = se, Q, $ = (e, t, n) => {
	f(_`
      <style>${Re}</style>
      <div class="coverage-toolbar-container" jslog=${de()} role="toolbar">
        <devtools-toolbar class="coverage-toolbar" role="presentation" wrappable>
          <select title=${Y(q.chooseCoverageGranularityPer)}
              aria-label=${Y(q.chooseCoverageGranularityPer)}
              jslog=${ce("coverage-type").track({ change: !0 })}
              @change=${(t) => e.onCoverageTypeChanged(t.target.selectedIndex)}
              .selectedIndex=${e.coverageType}
              ?disabled=${e.recording}>
            <option value=${N.JAVA_SCRIPT | N.JAVA_SCRIPT_PER_FUNCTION}
                    jslog=${g(`${N.JAVA_SCRIPT | N.JAVA_SCRIPT_PER_FUNCTION}`).track({ click: !0 })}>
                 ${Y(q.perFunction)}
            </option>
            <option value=${N.JAVA_SCRIPT}
                    jslog=${g(`${N.JAVA_SCRIPT}`).track({ click: !0 })}>
              ${Y(q.perBlock)}
            </option>
          </select>
          <devtools-button ${X(e.supportsRecordOnReload && !e.recording ? "coverage.start-with-reload" : "coverage.toggle-recording")}>
          </devtools-button>
          <devtools-button ${X("coverage.clear")}></devtools-button>
          <div class="toolbar-divider"></div>
          <devtools-button ${X("coverage.export")}></devtools-button>
          <div class="toolbar-divider"></div>
          <devtools-toolbar-input type="filter" placeholder=${Y(q.filterByUrl)}
              ?disabled=${!e.coverageInfo}
               @change=${(t) => e.onFilterChanged(t.detail)}
               style="flex-grow:1; flex-shrink:1">
          </devtools-toolbar-input>
          <div class="toolbar-divider"></div>
          <select title=${Y(q.filterCoverageByType)}
              aria-label=${Y(q.filterCoverageByType)}
              jslog=${ce("coverage-by-type").track({ change: !0 })}
              ?disabled=${!e.coverageInfo}
              @change=${(t) => e.onTypeFilterChanged(Number(t.target.selectedOptions[0]?.value))}>
            <option value="" jslog=${g("").track({ click: !0 })}
                    .selected=${e.typeFilter === null}>${Y(q.all)}</option>
            <option value=${N.CSS}
                    jslog=${g(`${N.CSS}`).track({ click: !0 })}
                    .selected=${e.typeFilter === N.CSS}>
              ${Y(q.css)}
            </option>
            <option value=${N.JAVA_SCRIPT | N.JAVA_SCRIPT_PER_FUNCTION}
                   jslog=${g(`${N.JAVA_SCRIPT | N.JAVA_SCRIPT_PER_FUNCTION}`).track({ click: !0 })}
                   .selected=${e.typeFilter !== null && !!(e.typeFilter & (N.JAVA_SCRIPT | N.JAVA_SCRIPT_PER_FUNCTION))}>
              ${Y(q.javascript)}
            </option>
          </select>
          <div class="toolbar-divider"></div>
          <devtools-checkbox title=${Y(q.includeExtensionContentScripts)}
              ${He(e.showContentScriptsSetting)}
              ?disabled=${!e.coverageInfo}>
            ${Y(q.contentScripts)}
          </devtools-checkbox>
        </devtools-toolbar>
      </div>
      <div class="coverage-results">
        ${e.needsReload ? We(e.needsReload === "bfcache-page" ? Y(q.bfcacheNoCapture) : Y(q.activationNoCapture), e.needsReload) : e.coverageInfo ? _`
          <devtools-widget autofocus class="results" ${Z(je, {
		coverageInfo: e.coverageInfo,
		highlightRegExp: e.textFilter,
		selectedUrl: e.selectedUrl
	})}
            ${Ve((e) => {
		e instanceof HTMLElement && (t.focusResults = () => {
			e.focus();
		});
	})}>` : Ue(e.supportsRecordOnReload)}
      </div>
      <div class="coverage-toolbar-summary">
        <div class="coverage-message">
            ${e.statusMessage}
        </div>
    </div>`, n, { container: { attributes: { jslog: `${m("coverage").track({ resize: !0 })}` } } });
};
function Ue(e) {
	return e ? _`
      <devtools-widget ${Z(h, {
		header: Y(q.noCoverageData),
		link: "https://developer.chrome.com/docs/devtools/coverage",
		text: Y(q.clickTheReloadButtonSToReloadAnd, { PH1: Y(q.reloadPage) })
	})}>
        <devtools-button ${X("coverage.start-with-reload")}
                          .variant=${u.TONAL} .iconName=${void 0}>
          ${Y(q.reloadPage)}
        </devtools-button>
      </devtools-widget>` : _`
    <devtools-widget ${Z(h, {
		header: Y(q.noCoverageData),
		link: "https://developer.chrome.com/docs/devtools/coverage",
		text: Y(q.clickTheRecordButtonSToStart, { PH1: Y(q.startRecording) })
	})}>
      <devtools-button ${X("coverage.toggle-recording")}
                       .variant=${u.TONAL} .iconName=${void 0}>
        ${Y(q.startRecording)}
      </devtools-button>
    </devtools-widget>`;
}
function We(e, t) {
	return _`
    <div class="widget vbox ${t}">
      <div class="message">${e}</div>
      <span class="message">
        ${Be(q.reloadPrompt, { PH1: _`
          <devtools-button class="inline-button" ${X("inspector-main.reload")}></devtools-button>` })}
      </span>
    </div>`;
}
var Ge = class e extends S {
	#e;
	#t;
	#n;
	#r;
	#i;
	#a;
	#o;
	#s;
	#c;
	#l;
	#u;
	#d = null;
	#f = "";
	#p = { focusResults: () => {} };
	#m = null;
	#h = null;
	constructor(e = $) {
		super({
			useShadowDom: "pure",
			delegatesFocus: !0
		}), this.registerRequiredCSS(Re), this.#l = e, this.#e = null, this.#t = null, this.#n = l.instance().createSetting("coverage-view-coverage-type", 0), this.#r = E.instance().getAction("coverage.toggle-recording");
		let t = T.instance().primaryPageTarget();
		this.#u = !!t?.model(v), this.#i = E.instance().getAction("coverage.clear"), this.#i.setEnabled(!1), this.#a = E.instance().getAction("coverage.export"), this.#a.setEnabled(!1), this.#o = null, this.#s = null, this.#c = l.instance().createSetting("show-content-scripts", !1), this.#c.addChangeListener(this.#T, this), this.requestUpdate();
	}
	performUpdate() {
		let e = {
			coverageType: this.#n.get(),
			recording: this.#r.toggled(),
			supportsRecordOnReload: this.#u,
			typeFilter: this.#s,
			showContentScriptsSetting: this.#c,
			needsReload: this.#d,
			coverageInfo: this.#m,
			textFilter: this.#o,
			selectedUrl: this.#h,
			statusMessage: this.#f,
			onCoverageTypeChanged: this.#v.bind(this),
			onFilterChanged: (e) => {
				this.#o = e ? he(e, "i") : null, this.#T();
			},
			onTypeFilterChanged: this.#E.bind(this)
		};
		this.#l(e, this.#p, this.contentElement);
	}
	static instance() {
		return Q ||= new e(), Q;
	}
	static removeInstance() {
		Q = void 0;
	}
	clear() {
		this.#e && this.#e.reset(), this.#g();
	}
	#g() {
		this.#t &&= (this.#t.dispose(), null), this.#d = null, this.#m = null, this.#f = "", this.#a.setEnabled(!1), this.requestUpdate();
	}
	toggleRecording() {
		this.#r.toggled() ? this.stopRecording() : this.startRecording({
			reload: !1,
			jsCoveragePerBlock: this.isBlockCoverageSelected()
		});
	}
	isBlockCoverageSelected() {
		return this.#n.get() === N.JAVA_SCRIPT;
	}
	#_(e) {
		let t = +!!e;
		this.#n.set(t);
	}
	#v(e) {
		this.#n.set(e);
	}
	async startRecording(e) {
		this.#g();
		let t = T.instance().primaryPageTarget();
		if (!t) return;
		let { reload: n, jsCoveragePerBlock: r } = {
			reload: !1,
			jsCoveragePerBlock: !1,
			...e
		};
		if ((!this.#e || n) && (this.#e = t.model(F)), !this.#e || (w.actionTaken(D.CoverageStarted), r && w.actionTaken(D.CoverageStartedPerBlock), !await this.#e.start(!!r))) return;
		this.#_(!!r), this.#e.addEventListener(P.CoverageUpdated, this.#y, this), this.#e.addEventListener(P.SourceMapResolved, this.#b, this);
		let i = t.model(v);
		T.instance().addModelListener(v, d.PrimaryPageChanged, this.#S, this), this.#t = new K(this.#e, M.instance(), j.instance(), A.instance()), this.#r.setToggled(!0), this.#i.setEnabled(!1), this.#m = [], this.#d = null, this.requestUpdate(), await this.updateComplete, this.#p.focusResults(), n && i ? i.reloadPage() : this.#e.startPolling();
	}
	#y(e) {
		let t = e.data;
		this.#C(t);
	}
	#b() {
		let e = (this.#e?.entries() || []).map((e) => this.#x(e)).filter((e) => this.#D(e)).map((e) => ({
			...e,
			sources: e.sources.filter((e) => this.#D(e))
		}));
		this.#m = e;
	}
	#x(e) {
		return {
			url: e.url(),
			type: e.type(),
			size: e.size(),
			usedSize: e.usedSize(),
			unusedSize: e.unusedSize(),
			usedPercentage: e.usedPercentage(),
			unusedPercentage: e.unusedPercentage(),
			sources: [...e.sourcesURLCoverageInfo.values()].map(this.#x, this),
			isContentScript: e.isContentScript(),
			generatedUrl: e instanceof R ? e.generatedURLCoverageInfo.url() : void 0
		};
	}
	async stopRecording() {
		T.instance().removeModelListener(v, d.PrimaryPageChanged, this.#S, this), this.#e && (await this.#e.stop(), this.#e.removeEventListener(P.CoverageUpdated, this.#y, this)), this.#r.setToggled(!1), this.#i.setEnabled(!0), this.requestUpdate();
	}
	async #S(e) {
		let t = e.data.frame, n = t.resourceTreeModel().target().model(F);
		if (n) {
			if (this.#e !== n) {
				if (this.#e && (await this.#e.stop(), this.#e.removeEventListener(P.CoverageUpdated, this.#y, this)), this.#e = n, !await this.#e.start(this.isBlockCoverageSelected())) return;
				this.#e.addEventListener(P.CoverageUpdated, this.#y, this), this.#t = new K(this.#e, M.instance(), j.instance(), A.instance());
			}
			e.data.type === ae.ACTIVATION ? this.#d = "prerender-page" : t.backForwardCacheDetails.restoredFromCache ? this.#d = "bfcache-page" : (this.#d = null, this.#m = []), this.requestUpdate(), this.#e.reset(), this.#t?.reset(), this.#e.startPolling();
		}
	}
	#C(e) {
		this.#w(), this.#b(), this.#a.setEnabled(this.#e !== null && this.#e.entries().length > 0), this.#t?.update(e), this.requestUpdate();
	}
	#w() {
		let e = {
			total: 0,
			unused: 0
		}, t = {
			total: 0,
			unused: 0
		}, n = this.#o !== null;
		if (this.#e) for (let n of this.#e.entries()) {
			e.total += n.size(), e.unused += n.unusedSize();
			let r = this.#x(n);
			if (this.#D(r)) {
				if (this.#o?.test(n.url())) t.total += n.size(), t.unused += n.unusedSize();
				else for (let e of n.sourcesURLCoverageInfo.values()) this.#D(this.#x(e)) && (t.total += e.size(), t.unused += e.unusedSize());
			}
		}
		this.#f = n ? Y(q.filteredSTotalS, {
			PH1: i(t),
			PH2: i(e)
		}) : i(e);
		function i({ total: e, unused: t }) {
			let n = e - t, i = e ? Math.round(100 * n / e) : 0;
			return Y(q.sOfSSUsedSoFarSUnused, {
				PH1: r(n),
				PH2: r(e),
				PH3: i,
				PH4: r(t)
			});
		}
	}
	#T() {
		this.#b(), this.#w(), this.requestUpdate();
	}
	#E(e) {
		w.actionTaken(D.CoverageReportFiltered), this.#s = e, this.#b(), this.#w(), this.requestUpdate();
	}
	#D(t) {
		let n = t.url;
		if (n.startsWith(e.EXTENSION_BINDINGS_URL_PREFIX) || t.isContentScript && !this.#c.get() || this.#s && !(t.type & this.#s)) return !1;
		if (t.sources.length > 0) {
			for (let e of t.sources) if (this.#D(e)) return !0;
		}
		return !this.#o || this.#o.test(n);
	}
	async exportReport() {
		let e = new _e(), t = `Coverage-${ne(/* @__PURE__ */ new Date())}.json`;
		await e.open(t) && this.#e && await this.#e.exportReport(e);
	}
	selectCoverageItemByUrl(e) {
		this.#h = e, this.requestUpdate();
	}
	static EXTENSION_BINDINGS_URL_PREFIX = "extensions::";
	wasShown() {
		C.instance().setFlavor(e, this), super.wasShown();
	}
	willHide() {
		super.willHide(), C.instance().setFlavor(e, null);
	}
	get model() {
		return this.#e;
	}
}, Ke = class {
	handleAction(e, t) {
		let n = "coverage";
		return le.instance().showView(n, !1, !0).then(() => le.instance().view(n)?.widget()).then((e) => this.#e(e, t)), !0;
	}
	#e(e, t) {
		switch (t) {
			case "coverage.toggle-recording":
				e.toggleRecording();
				break;
			case "coverage.start-with-reload":
				e.startRecording({
					reload: !0,
					jsCoveragePerBlock: e.isBlockCoverageSelected()
				});
				break;
			case "coverage.clear":
				e.clear();
				break;
			case "coverage.export":
				e.exportReport();
				break;
			default: console.assert(!1, `Unknown action: ${t}`);
		}
	}
};
//#endregion
export { ye as a, F as i, Le as n, P as o, we as r, L as s, ze as t };
