import { n as e } from "./rolldown-runtime-DF993M8W.js";
import { a as t } from "./dom_extension-BLny9Waw.js";
import { B as n, Et as r, H as i, K as a, W as o, at as s, i as c } from "./common-DMSVbaSb.js";
import { $n as l, C as u, Df as d, Dt as f, Fo as p, Hr as m, L as h, La as g, Md as _, Po as v, Wo as y, Yr as ee, Zo as b, br as x, df as S, ei as C, er as te, g as ne, jd as w, qa as T, tr as re, vn as ie, xn as E, yr as ae } from "./legacy-dM_vujv7.js";
import "./platform-D4TUCh2P.js";
import { _ as oe } from "./StringUtilities-CMDxNrEc.js";
import { n as se, t as ce } from "./theme_support-BJ6jI25-.js";
import { c as le, d as ue, l as de } from "./data_grid-C6uthMeA.js";
import { n as fe, r as pe } from "./source_frame-B0odV5Nv.js";
import { A as me, M as he, O as ge } from "./perf_ui-B15al1e8.js";
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/media/eventDisplayTable.css.mjs
var _e = "/*\n * Copyright 2019 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.no-border-top-datagrid > .data-grid {\n  /* make sure there is no top border, it ruins the menu view */\n  border-top: 0;\n}\n\n.event-display-table-contents-table-container > .widget > .data-grid {\n  height: 100%;\n}\n\n.data-grid .event-display-table-basic-text-table-entry {\n  line-height: 26px;\n}\n\n.event-display-table-contents-json-wrapper > .json-view {\n  overflow: visible;\n}\n", ve = /* @__PURE__ */ e({
	EventNode: () => xe,
	MediaEventColumnKeys: () => be,
	PlayerEventsView: () => Se
}), D = {
	timestamp: "Timestamp",
	eventName: "Event name",
	value: "Value",
	eventDisplay: "Event display"
}, ye = a("panels/media/EventDisplayTable.ts", D), O = i.bind(void 0, ye), be = /* @__PURE__ */ function(e) {
	return e.TIMESTAMP = "displayTimestamp", e.EVENT = "event", e.VALUE = "value", e;
}({}), xe = class extends de {
	expandableElement;
	constructor(e) {
		super(e, !1), this.expandableElement = null;
	}
	createCell(e) {
		let t = this.createTD(e), n = this.data[e];
		if (e === "value") {
			let e = t.createChild("div", "event-display-table-contents-json-wrapper");
			this.expandableElement = new fe(new pe(n, "", ""), !0), this.expandableElement.markAsRoot(), this.expandableElement.show(e);
		} else t.classList.add("event-display-table-basic-text-table-entry"), E(t, n);
		return t;
	}
}, Se = class e extends C {
	dataGrid;
	firstEventTime;
	constructor() {
		super({ jslog: `${T("events")}` }), this.registerRequiredCSS(_e), this.contentElement.classList.add("event-display-table-contents-table-container"), this.dataGrid = this.createDataGrid([
			{
				id: "displayTimestamp",
				title: O(D.timestamp),
				weight: 1,
				sortable: !1
			},
			{
				id: "event",
				title: O(D.eventName),
				weight: 2,
				sortable: !1
			},
			{
				id: "value",
				title: O(D.value),
				weight: 7,
				sortable: !1
			}
		]), this.firstEventTime = 0, this.dataGrid.setStriped(!0), this.dataGrid.asWidget().show(this.contentElement);
	}
	createDataGrid(t) {
		let n = [];
		for (let r of t) n.push(e.convertToGridDescriptor(r));
		let r = new le({
			displayName: O(D.eventDisplay),
			columns: n
		});
		return r.asWidget().contentElement.classList.add("no-border-top-datagrid"), r;
	}
	onEvent(e) {
		this.firstEventTime === 0 && typeof e.timestamp == "number" && (this.firstEventTime = e.timestamp), e = this.subtractFirstEventTime(e);
		let t = e.value;
		try {
			let n = JSON.parse(t);
			e.event = n.event, delete n.event, e.value = n;
			let r = new xe(e), i = this.dataGrid.scrollContainer, a = i.scrollTop === i.scrollHeight - i.offsetHeight;
			this.dataGrid.rootNode().appendChild(r), a && (i.scrollTop = i.scrollHeight);
		} catch {}
	}
	subtractFirstEventTime(e) {
		return typeof e.timestamp == "number" && (e.displayTimestamp = (e.timestamp - this.firstEventTime).toFixed(3)), e;
	}
	static convertToGridDescriptor(e) {
		return {
			id: e.id,
			title: e.title,
			sortable: e.sortable,
			weight: e.weight || 0,
			sort: ue.Ascending
		};
	}
}, Ce = /* @__PURE__ */ e({
	Events: () => k,
	MediaModel: () => A
}), k = /* @__PURE__ */ function(e) {
	return e.PLAYER_PROPERTIES_CHANGED = "PlayerPropertiesChanged", e.PLAYER_EVENTS_ADDED = "PlayerEventsAdded", e.PLAYER_MESSAGES_LOGGED = "PlayerMessagesLogged", e.PLAYER_ERRORS_RAISED = "PlayerErrorsRaised", e.PLAYER_CREATED = "PlayerCreated", e;
}({}), A = class extends S {
	enabled;
	agent;
	constructor(e) {
		super(e), this.enabled = !1, this.agent = e.mediaAgent(), e.registerMediaDispatcher(this);
	}
	async resumeModel() {
		if (!this.enabled) return await Promise.resolve();
		await this.agent.invoke_enable();
	}
	ensureEnabled() {
		this.agent.invoke_enable(), this.enabled = !0;
	}
	playerPropertiesChanged(e) {
		this.dispatchEventToListeners("PlayerPropertiesChanged", e);
	}
	playerEventsAdded(e) {
		this.dispatchEventToListeners("PlayerEventsAdded", e);
	}
	playerMessagesLogged(e) {
		this.dispatchEventToListeners("PlayerMessagesLogged", e);
	}
	playerErrorsRaised(e) {
		this.dispatchEventToListeners("PlayerErrorsRaised", e);
	}
	playerCreated({ player: e }) {
		this.dispatchEventToListeners("PlayerCreated", e);
	}
};
S.register(A, {
	capabilities: _.MEDIA,
	autostart: !1
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/media/TickingFlameChartHelpers.ts
var we = /* @__PURE__ */ e({
	Bounds: () => M,
	formatMillisecondsToSeconds: () => j
});
function j(e, t) {
	let n = 10 ** (3 - t), r = 10 ** Math.max(0, t);
	return `${Math.round(e / n) / r} s`;
}
var M = class {
	#e;
	#t;
	#n;
	#r;
	maxRange;
	minRange;
	constructor(e, t, n, r) {
		this.#e = e, this.#t = t, this.#n = this.#e, this.#r = this.#t, this.maxRange = n, this.minRange = r;
	}
	get low() {
		return this.#n;
	}
	get high() {
		return this.#r;
	}
	get min() {
		return this.#e;
	}
	get max() {
		return this.#t;
	}
	get range() {
		return this.#r - this.#n;
	}
	reassertBounds() {
		let e = !0;
		for (; e;) {
			if (e = !1, this.range < this.minRange) {
				e = !0;
				let t = (this.minRange - this.range) / 2;
				this.#r += t, this.#n -= t;
			}
			this.#n < this.#e && (e = !0, this.#n = this.#e), this.#r > this.#t && (e = !0, this.#r = this.#t);
		}
	}
	zoomOut(e, t) {
		let n = this.#r - this.#n, r = n * 1.1 ** e - n, i = r * t, a = r - i;
		this.#n -= i, this.#r += a, this.reassertBounds();
	}
	zoomIn(e, t) {
		let n = this.#r - this.#n;
		if (this.range <= this.minRange) return;
		let r = n - n / 1.1 ** e, i = r * t, a = r - i;
		this.#n += i, this.#r -= a, this.reassertBounds();
	}
	addMax(e) {
		let t = this.#r - this.#n, n = this.#r === this.#t, r = this.#n === this.#e || t >= this.maxRange;
		this.#t += e, n && r && (this.#r = this.#t), this.reassertBounds();
	}
	pushMaxAtLeastTo(e) {
		return this.#t < e && (this.addMax(e - this.#t), !0);
	}
}, Te = /* @__PURE__ */ e({
	ColdColorScheme: () => F,
	Event: () => ke,
	HotColorScheme: () => P,
	TickingFlameChart: () => Ae
}), Ee = "11px " + d();
function N() {
	return se.instance().getComputedValue("--sys-color-on-surface");
}
var De = () => ({
	height: 20,
	padding: 2,
	collapsible: he.NEVER,
	font: Ee,
	color: N(),
	backgroundColor: "rgba(100 0 0 / 10%)",
	nestingLevel: 0,
	itemsHeight: 20,
	shareHeaderLine: !1,
	useFirstLineForOverview: !1,
	useDecoratorsForOverview: !1
}), P = [
	"#ffba08",
	"#faa307",
	"#f48c06",
	"#e85d04",
	"#dc2f02",
	"#d00000",
	"#9d0208"
], F = [
	"#7400b8",
	"#6930c3",
	"#5e60ce",
	"#5390d9",
	"#4ea8de",
	"#48bfe3",
	"#56cfe1",
	"#64dfdf"
];
function Oe(e) {
	let t = r(e)?.as(s.HSL);
	return t && t.l < .5 ? "#eee" : "#444";
}
var ke = class {
	timelineData;
	setLive;
	setComplete;
	updateMaxTime;
	selfIndex;
	#e;
	title;
	#t;
	#n;
	constructor(e, t, n = {
		color: void 0,
		duration: void 0,
		level: 0,
		name: "",
		startTime: 0
	}) {
		this.timelineData = e, this.setLive = t.setLive, this.setComplete = t.setComplete, this.updateMaxTime = t.updateMaxTime, this.selfIndex = this.timelineData.entryLevels.length, this.#e = !1;
		let r = n.duration === void 0 ? 0 : n.duration;
		this.timelineData.entryLevels.push(n.level || 0), this.timelineData.entryStartTimes.push(n.startTime || 0), this.timelineData.entryTotalTimes.push(r), r === -1 && (this.endTime = -1), this.title = n.name || "", this.#t = n.color || P[0], this.#n = Oe(this.#t);
	}
	decorate(e) {
		e.createChild("span").textContent = `Name: ${this.title}`, e.createChild("br");
		let t = j(this.startTime, 2);
		if (this.#e) e.createChild("span").textContent = `Duration: ${t} - LIVE!`;
		else if (isNaN(this.duration)) e.createChild("span").textContent = `Time: ${t}`;
		else {
			let n = j(this.duration + this.startTime, 2);
			e.createChild("span").textContent = `Duration: ${t} - ${n}`;
		}
	}
	set endTime(e) {
		if (e === -1) this.timelineData.entryTotalTimes[this.selfIndex] = this.setLive(this.selfIndex), this.#e = !0;
		else {
			this.#e = !1;
			let t = e - this.timelineData.entryStartTimes[this.selfIndex];
			this.timelineData.entryTotalTimes[this.selfIndex] = t, this.setComplete(this.selfIndex), this.updateMaxTime(e);
		}
	}
	get id() {
		return this.selfIndex;
	}
	set level(e) {
		this.timelineData.entryLevels[this.selfIndex] = e;
	}
	set color(e) {
		this.#t = e, this.#n = Oe(this.#t);
	}
	get color() {
		return this.#t;
	}
	get fontColor() {
		return this.#n;
	}
	get startTime() {
		return this.timelineData.entryStartTimes[this.selfIndex];
	}
	get duration() {
		return this.timelineData.entryTotalTimes[this.selfIndex];
	}
	get live() {
		return this.#e;
	}
}, Ae = class extends C {
	intervalTimer;
	lastTimestamp;
	#e;
	ticking;
	isShown;
	bounds;
	dataProvider;
	delegate;
	chartGroupExpansionSetting;
	chart;
	stoppedPermanently;
	constructor() {
		super(), this.intervalTimer = 0, this.lastTimestamp = 0, this.#e = !0, this.ticking = !1, this.isShown = !1, this.bounds = new M(0, 1e3, 3e4, 1e3), this.dataProvider = new Me(this.bounds, this.updateMaxTime.bind(this)), this.delegate = new je(), this.chartGroupExpansionSetting = c.instance().createSetting("media-flame-chart-group-expansion", {}), this.chart = new ge(this.dataProvider, this.delegate, this.chartGroupExpansionSetting), this.chart.disableRangeSelection(), this.chart.bindCanvasEvent("wheel", (e) => {
			this.onScroll(e);
		}), this.chart.show(this.contentElement);
	}
	addMarker(e) {
		e.duration = NaN, this.startEvent(e);
	}
	startEvent(e) {
		e.duration === void 0 && (e.duration = -1);
		let t = e.startTime || 0, n = this.dataProvider.startEvent(e);
		return this.updateMaxTime(t), n;
	}
	addGroup(e, t) {
		this.dataProvider.addGroup(e, t);
	}
	updateMaxTime(e) {
		this.bounds.pushMaxAtLeastTo(e) && this.updateRender();
	}
	onScroll(e) {
		let t = Math.round(e.deltaY / 50), n = e.offsetX / e.srcElement.clientWidth;
		t > 0 ? this.bounds.zoomOut(t, n) : this.bounds.zoomIn(-t, n), this.updateRender();
	}
	willHide() {
		super.willHide(), this.isShown = !1, this.ticking && this.stop();
	}
	wasShown() {
		super.wasShown(), this.isShown = !0, this.#e && !this.ticking && this.start();
	}
	set canTick(e) {
		this.#e = e, this.ticking && !e && this.stop(), !this.ticking && this.isShown && e && this.start();
	}
	start() {
		this.lastTimestamp === 0 && (this.lastTimestamp = Date.now()), !(this.intervalTimer !== 0 || this.stoppedPermanently) && (this.intervalTimer = window.setInterval(this.updateRender.bind(this), 16), this.ticking = !0);
	}
	stop(e = !1) {
		window.clearInterval(this.intervalTimer), this.intervalTimer = 0, e && (this.stoppedPermanently = !0), this.ticking = !1;
	}
	updateRender() {
		if (this.ticking) {
			let e = Date.now(), t = e - this.lastTimestamp;
			this.lastTimestamp = e, this.bounds.addMax(t);
		}
		this.dataProvider.updateMaxTime(this.bounds), this.chart.setWindowTimes(this.bounds.low, this.bounds.high, !0), this.chart.scheduleUpdate();
	}
}, je = class {
	windowChanged(e, t, n) {}
	updateRangeSelection(e, t) {}
	updateSelectedGroup(e, t) {}
}, Me = class {
	updateMaxTimeHandle;
	bounds;
	liveEvents;
	eventMap;
	#e;
	maxLevel;
	constructor(e, t) {
		this.updateMaxTimeHandle = t, this.bounds = e, this.liveEvents = /* @__PURE__ */ new Set(), this.eventMap = /* @__PURE__ */ new Map(), this.#e = me.createEmpty(), this.maxLevel = 0;
	}
	hasTrackConfigurationMode() {
		return !1;
	}
	addGroup(e, t) {
		if (this.#e.groups) {
			let t = {
				name: e,
				startLevel: this.maxLevel,
				expanded: !0,
				selectable: !1,
				style: De(),
				track: null
			};
			this.#e.groups.push(t), se.instance().addEventListener(ce.eventName, () => {
				t.style.color = N();
			});
		}
		this.maxLevel += t;
	}
	startEvent(e) {
		if (e.level = e.level || 0, e.level > this.maxLevel) throw Error(`level ${e.level} is above the maximum allowed of ${this.maxLevel}`);
		let t = new ke(this.#e, {
			setLive: this.setLive.bind(this),
			setComplete: this.setComplete.bind(this),
			updateMaxTime: this.updateMaxTimeHandle
		}, e);
		return this.eventMap.set(t.id, t), t;
	}
	setLive(e) {
		return this.liveEvents.add(e), this.bounds.max;
	}
	setComplete(e) {
		this.liveEvents.delete(e);
	}
	updateMaxTime(e) {
		this.bounds = e;
		for (let e of this.liveEvents.entries()) this.eventMap.get(e[0]).endTime = -1;
	}
	maxStackDepth() {
		return this.maxLevel + 1;
	}
	timelineData() {
		return this.#e;
	}
	minimumBoundary() {
		return this.bounds.low;
	}
	totalTime() {
		return this.bounds.high;
	}
	entryColor(e) {
		return this.eventMap.get(e).color;
	}
	textColor(e) {
		return this.eventMap.get(e).fontColor;
	}
	entryTitle(e) {
		return this.eventMap.get(e).title;
	}
	entryFont(e) {
		return Ee;
	}
	decorateEntry(e, t, n, r, i, a, o, s, c) {
		return !1;
	}
	forceDecoration(e) {
		return !1;
	}
	preparePopoverElement(e) {
		let t = document.createElement("div");
		return this.eventMap.get(e).decorate(t), t;
	}
	formatValue(e, t) {
		return e += Math.round(this.bounds.low), this.bounds.range < 2800 ? j(e, 2) : this.bounds.range < 3e4 ? j(e, 1) : j(e, 0);
	}
	canJumpToEntry(e) {
		return !1;
	}
}, Ne = -1.5, I = {
	playbackStatus: "Playback Status",
	bufferingStatus: "Buffering Status"
}, Pe = a("panels/media/EventTimelineView.ts", I), Fe = i.bind(void 0, Pe), Ie = class extends Ae {
	normalizedTimestamp;
	playbackStatusLastEvent;
	audioBufferingStateEvent;
	videoBufferingStateEvent;
	constructor() {
		super(), this.element.setAttribute("jslog", `${T("timeline")}`), this.normalizedTimestamp = Ne, this.addGroup(Fe(I.playbackStatus), 2), this.addGroup(Fe(I.bufferingStatus), 2), this.playbackStatusLastEvent = null, this.audioBufferingStateEvent = null, this.videoBufferingStateEvent = null;
	}
	ensureNoPreviousPlaybackEvent(e) {
		this.playbackStatusLastEvent !== null && (this.playbackStatusLastEvent.endTime = e, this.playbackStatusLastEvent = null);
	}
	onPlaybackEvent(e, t) {
		switch (e.event) {
			case "kPlay":
				this.canTick = !0, this.ensureNoPreviousPlaybackEvent(t), this.playbackStatusLastEvent = this.startEvent({
					level: 0,
					startTime: t,
					name: "Play"
				});
				break;
			case "kPause":
				this.ensureNoPreviousPlaybackEvent(t), this.playbackStatusLastEvent = this.startEvent({
					level: 0,
					startTime: t,
					name: "Pause",
					color: P[1]
				});
				break;
			case "kWebMediaPlayerDestroyed":
				this.canTick = !1, this.ensureNoPreviousPlaybackEvent(t), this.addMarker({
					level: 1,
					startTime: t,
					name: "Destroyed",
					color: P[4]
				});
				break;
			case "kSuspended":
				this.canTick = !1, this.ensureNoPreviousPlaybackEvent(t), this.playbackStatusLastEvent = this.startEvent({
					level: 1,
					startTime: t,
					name: "Suspended",
					color: P[3]
				});
				break;
			case "kEnded":
				this.ensureNoPreviousPlaybackEvent(t), this.playbackStatusLastEvent = this.startEvent({
					level: 1,
					startTime: t,
					name: "Ended",
					color: P[2]
				});
				break;
			default: throw Error(`_onPlaybackEvent cant handle ${e.event}`);
		}
	}
	bufferedEnough(e) {
		return e.state === "BUFFERING_HAVE_ENOUGH";
	}
	onBufferingStatus(e, t) {
		let n = null, r = null;
		switch (e.event) {
			case "kBufferingStateChanged":
				n = e.value.audio_buffering_state, r = e.value.video_buffering_state, n && (this.audioBufferingStateEvent !== null && (this.audioBufferingStateEvent.endTime = t, this.audioBufferingStateEvent = null), this.bufferedEnough(n) || (this.audioBufferingStateEvent = this.startEvent({
					level: 3,
					startTime: t,
					name: "Audio Buffering",
					color: F[1]
				}))), r && (this.videoBufferingStateEvent !== null && (this.videoBufferingStateEvent.endTime = t, this.videoBufferingStateEvent = null), this.bufferedEnough(r) || (this.videoBufferingStateEvent = this.startEvent({
					level: 2,
					startTime: t,
					name: "Video Buffering",
					color: F[0]
				})));
				break;
			default: throw Error(`_onPlaybackEvent cant handle ${e.event}`);
		}
	}
	onEvent(e) {
		this.normalizedTimestamp === Ne && (this.normalizedTimestamp = Number(e.timestamp));
		let t = (Number(e.timestamp) - this.normalizedTimestamp) * 1e3;
		switch (e.event) {
			case "kPlay":
			case "kPause":
			case "kWebMediaPlayerDestroyed":
			case "kSuspended":
			case "kEnded": return this.onPlaybackEvent(e, t);
			case "kBufferingStateChanged": return this.onBufferingStatus(e, t);
		}
	}
}, Le = "/*\n * Copyright 2020 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n.media-messages-header {\n  background-color: var(--sys-color-cdt-base-container);\n  border-bottom: 1px solid var(--sys-color-divider);\n  min-height: 26px;\n}\n\n.media-messages-body {\n  overflow-y: scroll;\n}\n\n.media-messages-level-dropdown-element {\n  height: 18px;\n  line-height: 18px;\n}\n\n.media-messages-level-dropdown-text {\n  float: left;\n}\n\n.media-messages-level-dropdown-checkbox {\n  float: left;\n  width: 18px;\n  height: 100%;\n  padding-left: 2px;\n}\n\n.media-messages-message-container {\n  margin: 4px;\n  font-size: 14px;\n  line-height: 18px;\n  padding: 4px;\n  user-select: text;\n}\n\n.media-messages-message-container + .media-messages-message-container {\n  border-top: 1px solid var(--sys-color-divider);\n\n  &.media-message-warning,\n  &.media-message-error {\n    border: none;\n  }\n}\n\n.media-message-warning {\n  border-radius: 5px;\n  background-color: var(--sys-color-surface-yellow);\n  color: var(--sys-color-on-surface-yellow);\n}\n\n.media-message-error {\n  border-radius: 5px;\n  background-color: var(--sys-color-surface-error);\n  color: var(--sys-color-on-surface-error);\n}\n\n.media-messages-message-filtered {\n  display: none;\n}\n\n.media-messages-message-unselected {\n  display: none;\n}\n\n.status-error-box {\n  font-family: var(--monospace-font-family);\n  border: 1px solid var(--sys-color-error-outline);\n  border-radius: 5px;\n  padding: 4px;\n}\n\n.status-error-field-label {\n  padding-right: 10px;\n  color: var(--sys-color-token-subtle);\n}\n\n.status-error-field-labeled {\n  display: flex;\n}\n", Re = /* @__PURE__ */ e({ PlayerMessagesView: () => Ve }), L = {
	default: "Default",
	custom: "Custom",
	all: "All",
	error: "Error",
	warning: "Warning",
	info: "Info",
	debug: "Debug",
	logLevel: "Log level:",
	filterByLogMessages: "Filter by log messages",
	errorGroupLabel: "Error Group:",
	errorCodeLabel: "Error Code:",
	errorDataLabel: "Data:",
	errorStackLabel: "Stacktrace:",
	errorCauseLabel: "Caused by:"
}, ze = a("panels/media/PlayerMessagesView.ts", L), R = i.bind(void 0, ze), Be = class {
	items;
	view;
	itemMap;
	hiddenLevels;
	bitFieldValue;
	#e;
	customTitle;
	allTitle;
	elementsForItems;
	constructor(e, t) {
		this.items = e, this.view = t, this.itemMap = /* @__PURE__ */ new Map(), this.hiddenLevels = [], this.bitFieldValue = 7, this.#e = R(L.default), this.customTitle = R(L.custom), this.allTitle = R(L.all), this.elementsForItems = /* @__PURE__ */ new WeakMap();
	}
	defaultTitle() {
		return this.#e;
	}
	setDefault(e) {
		e.selectItem(this.items.at(0));
	}
	populate() {
		this.items.insert(this.items.length, {
			title: this.#e,
			overwrite: !0,
			stringValue: "",
			value: 7
		}), this.items.insert(this.items.length, {
			title: this.allTitle,
			overwrite: !0,
			stringValue: "",
			value: 15
		}), this.items.insert(this.items.length, {
			title: R(L.error),
			overwrite: !1,
			stringValue: "error",
			value: 1
		}), this.items.insert(this.items.length, {
			title: R(L.warning),
			overwrite: !1,
			stringValue: "warning",
			value: 2
		}), this.items.insert(this.items.length, {
			title: R(L.info),
			overwrite: !1,
			stringValue: "info",
			value: 4
		}), this.items.insert(this.items.length, {
			title: R(L.debug),
			overwrite: !1,
			stringValue: "debug",
			value: 8
		});
	}
	updateCheckMarks() {
		this.hiddenLevels = [];
		for (let [e, t] of this.itemMap) if (!t.overwrite) {
			let n = this.elementsForItems.get(t);
			n?.firstChild && n.firstChild.remove(), n && e & this.bitFieldValue ? E(n.createChild("div"), "✓") : this.hiddenLevels.push(t.stringValue);
		}
	}
	titleFor(e) {
		if (e.overwrite ? this.bitFieldValue = e.value : this.bitFieldValue ^= e.value, this.bitFieldValue === 7) return this.#e;
		if (this.bitFieldValue === 15) return this.allTitle;
		let t = this.itemMap.get(this.bitFieldValue);
		return t ? t.title : this.customTitle;
	}
	createElementForItem(e) {
		let t = document.createElement("div"), n = ie(t, { cssFile: Le }).createChild("div", "media-messages-level-dropdown-element"), r = n.createChild("div", "media-messages-level-dropdown-checkbox"), i = n.createChild("span", "media-messages-level-dropdown-text");
		return E(i, e.title), this.elementsForItems.set(e, r), this.itemMap.set(e.value, e), this.updateCheckMarks(), this.view.regenerateMessageDisplayCss(this.hiddenLevels), t;
	}
	isItemSelectable(e) {
		return !0;
	}
	itemSelected(e) {
		this.updateCheckMarks(), this.view.regenerateMessageDisplayCss(this.hiddenLevels);
	}
	highlightedItemChanged(e, t, n, r) {}
}, Ve = class extends C {
	headerPanel;
	bodyPanel;
	messageLevelSelector;
	constructor() {
		super({ jslog: `${T("messages")}` }), this.registerRequiredCSS(Le), this.headerPanel = this.contentElement.createChild("div", "media-messages-header"), this.bodyPanel = this.contentElement.createChild("div", "media-messages-body"), this.buildToolbar();
	}
	buildToolbar() {
		let e = this.headerPanel.createChild("devtools-toolbar", "media-messages-toolbar");
		e.appendText(R(L.logLevel)), e.appendToolbarItem(this.createDropdown()), e.appendSeparator(), e.appendToolbarItem(this.createFilterInput());
	}
	createDropdown() {
		let e = new ae();
		this.messageLevelSelector = new Be(e, this);
		let t = new ne(e, this.messageLevelSelector, "log-level");
		t.setRowHeight(18), this.messageLevelSelector.populate(), this.messageLevelSelector.setDefault(t);
		let n = new re(t.element);
		return n.element.classList.add("toolbar-has-dropdown"), n.setEnabled(!0), n.setTitle(this.messageLevelSelector.defaultTitle()), f(n.element, `${R(L.logLevel)} ${this.messageLevelSelector.defaultTitle()}`), n;
	}
	createFilterInput() {
		let e = new l(R(L.filterByLogMessages), 1, 1);
		return e.addEventListener(te.Event.TEXT_CHANGED, (e) => {
			this.filterByString(e);
		}, this), e;
	}
	regenerateMessageDisplayCss(e) {
		let t = this.bodyPanel.getElementsByClassName("media-messages-message-container");
		for (let n of t) this.matchesHiddenLevels(n, e) ? n.classList.add("media-messages-message-unselected") : n.classList.remove("media-messages-message-unselected");
	}
	matchesHiddenLevels(e, t) {
		for (let n of t) if (e.classList.contains("media-message-" + n)) return !0;
		return !1;
	}
	filterByString(e) {
		let t = e.data, n = this.bodyPanel.getElementsByClassName("media-messages-message-container");
		for (let e of n) t === "" || e.textContent?.includes(t) ? e.classList.remove("media-messages-message-filtered") : e.classList.add("media-messages-message-filtered");
	}
	addMessage(e) {
		let t = this.bodyPanel.createChild("div", "media-messages-message-container media-message-" + e.level);
		E(t, e.message);
	}
	renderError(e) {
		return v`
      <div class="status-error-box">
        <div class="status-error-field-labeled">
          <span class="status-error-field-label"
            >${R(L.errorGroupLabel)}</span
          >
          <span>${e.errorType}</span>
        </div>
        <div class="status-error-field-labeled">
          <span class="status-error-field-label"
            >${R(L.errorCodeLabel)}</span
          >
          <span>${e.code}</span>
        </div>
        <div class="status-error-field-labeled">
        ${Object.keys(e.data).length === 0 ? b : v`<span class="status-error-field-label"
                  >${R(L.errorDataLabel)}</span
                >
                <div>
                  ${Object.entries(e.data).map(([e, t]) => v`<div>${e}: ${t}</div>`)}
                </div>`}
        </div>
        <div class="status-error-field-labeled">
          ${e.stack.length === 0 ? b : v`<span class="status-error-field-label"
                    >${R(L.errorStackLabel)}</span
                  >
                  <div>
                    ${e.stack.map((e) => v`<div>${e.file}:${e.line}</div>`)}
                  </div>`}
        </div>
        <div class="status-error-field-labeled">
          ${e.cause.length === 0 ? b : v`
                  <span class="status-error-field-label"
                    >${R(L.errorCauseLabel)}</span
                  >
                  ${this.renderError(e.cause[0])}
                `}
        </div>
      </div>
    `;
	}
	addError(e) {
		let t = this.bodyPanel.createChild("div", "media-messages-message-container media-message-error");
		p(this.renderError(e), t);
	}
}, He = "/*\n * Copyright 2019 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.media-attributes-view {\n  border-bottom: 1px solid var(--sys-color-divider);\n}\n\n.media-property-renderer {\n  line-height: 20px;\n  min-height: 28px;\n  padding: 4px 10px;\n  display: block;\n  overflow: hidden;\n\n  &:hover {\n    background: var(--sys-color-state-hover-on-subtle);\n  }\n}\n\n.media-property-renderer:nth-child(even):not(:hover) {\n  background: var(--sys-color-surface1);\n}\n\n.media-property-renderer:has(.json-view) {\n  padding-bottom: 0;\n}\n\n.media-property-renderer:has(.json-view > .expanded) {\n  padding-bottom: 4px;\n}\n\n.media-property-renderer-hidden {\n  display: none;\n}\n\n.media-property-renderer-title {\n  font-size: 12px;\n  float: left;\n  width: 150px;\n}\n\n.media-property-renderer-title::first-letter {\n  text-transform: uppercase;\n}\n\n.media-property-renderer-contents {\n  position: relative;\n\n  & > .json-view {\n    overflow: hidden;\n    padding: 0;\n  }\n}\n\n.media-properties-frame {\n  display: block;\n  overflow-x: hidden;\n}\n", Ue = /* @__PURE__ */ e({
	AttributesView: () => G,
	AudioTrackManager: () => Ye,
	DefaultPropertyRenderer: () => W,
	FormattedPropertyRenderer: () => U,
	NestedPropertyRenderer: () => Ke,
	PlayerPropertiesView: () => et,
	PlayerPropertyKeys: () => V,
	PropertyRenderer: () => H,
	TextTrackManager: () => Je,
	TrackManager: () => K,
	VideoTrackManager: () => qe
}), z = {
	video: "Video",
	audio: "Audio",
	track: "Track",
	decoder: "Decoder",
	properties: "Properties",
	textTrack: "Text track",
	noTextTracks: "No text tracks",
	resolution: "Resolution",
	fileSize: "File size",
	bitrate: "Bitrate",
	duration: "Duration",
	startTime: "Start time",
	streaming: "Streaming",
	playbackFrameUrl: "Playback frame URL",
	playbackFrameTitle: "Playback frame title",
	singleoriginPlayback: "Single-origin playback",
	rangeHeaderSupport: "`Range` header support",
	frameRate: "Frame rate",
	videoPlaybackRoughness: "Video playback roughness",
	videoFreezingScore: "Video freezing score",
	rendererName: "Renderer name",
	decoderName: "Decoder name",
	noDecoder: "No decoder",
	hardwareDecoder: "Hardware decoder",
	decryptingDemuxer: "Decrypting demuxer",
	encoderName: "Encoder name",
	noEncoder: "No encoder",
	hardwareEncoder: "Hardware encoder",
	hlsBufferedRanges: "Buffered media ranges"
}, We = a("panels/media/PlayerPropertiesView.ts", z), B = i.bind(void 0, We), Ge = n.bind(void 0, We), V = /* @__PURE__ */ function(e) {
	return e.RESOLUTION = "kResolution", e.TOTAL_BYTES = "kTotalBytes", e.BITRATE = "kBitrate", e.MAX_DURATION = "kMaxDuration", e.START_TIME = "kStartTime", e.IS_CDM_ATTACHED = "kIsCdmAttached", e.IS_STREAMING = "kIsStreaming", e.FRAME_URL = "kFrameUrl", e.FRAME_TITLE = "kFrameTitle", e.IS_SINGLE_ORIGIN = "kIsSingleOrigin", e.IS_RANGE_HEADER_SUPPORTED = "kIsRangeHeaderSupported", e.RENDERER_NAME = "kRendererName", e.VIDEO_DECODER_NAME = "kVideoDecoderName", e.AUDIO_DECODER_NAME = "kAudioDecoderName", e.IS_PLATFORM_VIDEO_DECODER = "kIsPlatformVideoDecoder", e.IS_PLATFORM_AUDIO_DECODER = "kIsPlatformAudioDecoder", e.VIDEO_ENCODER_NAME = "kVideoEncoderName", e.IS_PLATFORM_VIDEO_ENCODER = "kIsPlatformVideoEncoder", e.IS_VIDEO_DECRYPTION_DEMUXER_STREAM = "kIsVideoDecryptingDemuxerStream", e.IS_AUDIO_DECRYPTING_DEMUXER_STREAM = "kIsAudioDecryptingDemuxerStream", e.AUDIO_TRACKS = "kAudioTracks", e.TEXT_TRACKS = "kTextTracks", e.VIDEO_TRACKS = "kVideoTracks", e.FRAMERATE = "kFramerate", e.VIDEO_PLAYBACK_ROUGHNESS = "kVideoPlaybackRoughness", e.VIDEO_PLAYBACK_FREEZING = "kVideoPlaybackFreezing", e.HLS_BUFFERED_RANGES = "kHlsBufferedRanges", e;
}({}), H = class extends C {
	contents;
	value;
	pseudoColorProtectionElement;
	constructor(e) {
		super(), this.contentElement.classList.add("media-property-renderer");
		let t = this.contentElement.createChild("span", "media-property-renderer-title");
		this.contents = this.contentElement.createChild("div", "media-property-renderer-contents"), E(t, e), this.value = null, this.pseudoColorProtectionElement = null, this.contentElement.classList.add("media-property-renderer-hidden");
	}
	updateData(e) {
		if (e === "" || e === null) this.changeContents(null);
		else if (this.value === e) return;
		else this.value = e, this.updateDataInternal(e);
	}
	updateDataInternal(e) {
		try {
			let t = JSON.parse(e);
			this.changeContents(t);
		} catch {
			this.changeContents(e);
		}
	}
	unsetNestedContents() {
		this.contentElement.classList.add("media-property-renderer-hidden"), this.pseudoColorProtectionElement === null && (this.pseudoColorProtectionElement = document.createElement("div"), this.pseudoColorProtectionElement.classList.add("media-property-renderer"), this.pseudoColorProtectionElement.classList.add("media-property-renderer-hidden"), this.contentElement.parentNode.insertBefore(this.pseudoColorProtectionElement, this.contentElement));
	}
	changeNestedContents(e) {
		e === null || Object.keys(e).length === 0 ? this.unsetNestedContents() : (this.pseudoColorProtectionElement !== null && (this.pseudoColorProtectionElement.remove(), this.pseudoColorProtectionElement = null), this.contentElement.classList.remove("media-property-renderer-hidden"), this.contents.removeChildren(), new fe(new pe(e, "", ""), !0).show(this.contents));
	}
	changeContents(e) {
		if (e === null) this.unsetNestedContents();
		else {
			this.pseudoColorProtectionElement !== null && (this.pseudoColorProtectionElement.remove(), this.pseudoColorProtectionElement = null), this.contentElement.classList.remove("media-property-renderer-hidden"), this.contents.removeChildren();
			let t = document.createElement("span");
			t.textContent = e, this.contents.appendChild(t);
		}
	}
}, U = class extends H {
	formatfunction;
	constructor(e, t) {
		super(e), this.formatfunction = t;
	}
	updateDataInternal(e) {
		try {
			let t = JSON.parse(e);
			this.changeContents(this.formatfunction(t));
		} catch {
			let t = e;
			this.changeContents(this.formatfunction(t));
		}
	}
}, W = class extends H {
	constructor(e, t) {
		super(e), this.changeContents(t);
	}
}, Ke = class extends H {
	constructor(e, t) {
		super(e), this.changeNestedContents(t);
	}
}, G = class extends C {
	contentHash;
	constructor(e) {
		super(), this.contentHash = 0, this.contentElement.classList.add("media-attributes-view");
		for (let t of e) {
			t.show(this.contentElement);
			let e = this.contentElement.textContent;
			e !== null && (this.contentHash += oe(e));
		}
	}
	getContentHash() {
		return this.contentHash;
	}
}, K = class {
	type;
	view;
	constructor(e, t) {
		this.type = t, this.view = e;
	}
	updateData(e) {
		let t = this.view.getTabs(this.type), n = JSON.parse(e), r = 1;
		for (let e of n) this.addNewTab(t, e, r), r++;
	}
	addNewTab(e, t, n) {
		let r = [];
		for (let [e, n] of Object.entries(t)) typeof n == "object" ? r.push(new Ke(o(e), n)) : r.push(new W(o(e), n));
		let i = new G(r);
		e.addNewTab(n, i);
	}
}, qe = class extends K {
	constructor(e) {
		super(e, "video");
	}
}, Je = class extends K {
	constructor(e) {
		super(e, "text");
	}
}, Ye = class extends K {
	constructor(e) {
		super(e, "audio");
	}
}, Xe = {
	Video: Ge(z.video),
	Audio: Ge(z.audio)
}, Ze = class extends m {
	decoderName;
	trackName;
	constructor(e, t = B(z.track)) {
		super(), this.decoderName = e, this.trackName = t;
	}
	addNewTab(e, t) {
		let n = B(z.track), r = `track-${e}`;
		if (this.hasTab(r)) {
			let e = this.tabView(r);
			if (e === null || e.getContentHash() === t.getContentHash()) return;
			this.closeTab(r, !1);
		}
		this.appendTab(r, `${this.trackName} #${e}`, t, `${this.decoderName} ${n} #${e}`);
	}
}, Qe = class extends Ze {
	constructor(e, t) {
		super(e);
		let n = `${e} ${B(z.decoder)}`, r = `${n} ${B(z.properties)}`;
		this.appendTab("decoder-properties", n, t, r);
	}
}, $e = class extends C {
	isPlaceholder;
	wrapping;
	constructor(e, t) {
		super(), this.isPlaceholder = !0, this.wrapping = e, this.wrapping.appendTab("_placeholder", t, new C(), t), this.wrapping.show(this.contentElement);
	}
	addNewTab(e, t) {
		this.isPlaceholder &&= (this.wrapping.closeTab("_placeholder"), !1), this.wrapping.addNewTab(e, t);
	}
}, et = class extends C {
	mediaElements;
	videoDecoderElements;
	audioDecoderElements;
	attributeMap;
	videoProperties;
	videoDecoderProperties;
	audioDecoderProperties;
	videoDecoderTabs;
	audioDecoderTabs;
	textTracksTabs;
	constructor() {
		super({ jslog: `${T("properties")}` }), this.registerRequiredCSS(He), this.contentElement.classList.add("media-properties-frame"), this.mediaElements = [], this.videoDecoderElements = [], this.audioDecoderElements = [], this.attributeMap = /* @__PURE__ */ new Map(), this.populateAttributesAndElements(), this.videoProperties = new G(this.mediaElements), this.videoDecoderProperties = new G(this.videoDecoderElements), this.audioDecoderProperties = new G(this.audioDecoderElements), this.videoProperties.show(this.contentElement), this.videoDecoderTabs = new Qe(Xe.Video(), this.videoDecoderProperties), this.videoDecoderTabs.show(this.contentElement), this.audioDecoderTabs = new Qe(Xe.Audio(), this.audioDecoderProperties), this.audioDecoderTabs.show(this.contentElement), this.textTracksTabs = null;
	}
	lazyCreateTrackTabs() {
		let e = this.textTracksTabs;
		return e === null && (e = new $e(new Ze(B(z.textTrack)), B(z.noTextTracks)), e.show(this.contentElement), this.textTracksTabs = e), e;
	}
	getTabs(e) {
		if (e === "audio") return this.audioDecoderTabs;
		if (e === "video") return this.videoDecoderTabs;
		if (e === "text") return this.lazyCreateTrackTabs();
		throw Error("Unreachable");
	}
	onProperty(e) {
		let t = this.attributeMap.get(e.name);
		if (!t) throw Error(`Player property "${e.name}" not supported.`);
		t.updateData(e.value);
	}
	formatKbps(e) {
		return e === "" ? "0 kbps" : `${Math.floor(Number(e) / 1e3)} kbps`;
	}
	formatTime(e) {
		if (e === "") return "0:00";
		let t = /* @__PURE__ */ new Date();
		return t.setSeconds(Number(e)), t.toISOString().substr(11, 8);
	}
	formatFileSize(e) {
		if (e === "") return "0 bytes";
		let t = Number(e);
		if (t < 1e3) return `${e} bytes`;
		let n = Math.floor(Math.log10(t) / 3), r = [
			"bytes",
			"kB",
			"MB",
			"GB",
			"TB"
		][n];
		return `${(t / 1e3 ** n).toFixed(2)} ${r}`;
	}
	formatBufferedRanges(e) {
		return e.map((e) => "[" + e[0] + " → " + e[1] + "]").join(", ");
	}
	populateAttributesAndElements() {
		let e = new H(B(z.resolution));
		this.mediaElements.push(e), this.attributeMap.set("kResolution", e);
		let t = new U(B(z.fileSize), this.formatFileSize);
		this.mediaElements.push(t), this.attributeMap.set("kTotalBytes", t);
		let n = new U(B(z.bitrate), this.formatKbps);
		this.mediaElements.push(n), this.attributeMap.set("kBitrate", n);
		let r = new U(B(z.duration), this.formatTime);
		this.mediaElements.push(r), this.attributeMap.set("kMaxDuration", r);
		let i = new H(B(z.startTime));
		this.mediaElements.push(i), this.attributeMap.set("kStartTime", i);
		let a = new H(B(z.streaming));
		this.mediaElements.push(a), this.attributeMap.set("kIsStreaming", a);
		let o = new H(B(z.playbackFrameUrl));
		this.mediaElements.push(o), this.attributeMap.set("kFrameUrl", o);
		let s = new H(B(z.playbackFrameTitle));
		this.mediaElements.push(s), this.attributeMap.set("kFrameTitle", s);
		let c = new H(B(z.singleoriginPlayback));
		this.mediaElements.push(c), this.attributeMap.set("kIsSingleOrigin", c);
		let l = new H(B(z.rangeHeaderSupport));
		this.mediaElements.push(l), this.attributeMap.set("kIsRangeHeaderSupported", l);
		let u = new H(B(z.frameRate));
		this.mediaElements.push(u), this.attributeMap.set("kFramerate", u);
		let d = new H(B(z.videoPlaybackRoughness));
		this.mediaElements.push(d), this.attributeMap.set("kVideoPlaybackRoughness", d);
		let f = new H(B(z.videoFreezingScore));
		this.mediaElements.push(f), this.attributeMap.set("kVideoPlaybackFreezing", f);
		let p = new H(B(z.rendererName));
		this.mediaElements.push(p), this.attributeMap.set("kRendererName", p);
		let m = new U(B(z.hlsBufferedRanges), this.formatBufferedRanges);
		this.mediaElements.push(m), this.attributeMap.set("kHlsBufferedRanges", m);
		let h = new W(B(z.decoderName), B(z.noDecoder));
		this.videoDecoderElements.push(h), this.attributeMap.set("kVideoDecoderName", h);
		let g = new H(B(z.hardwareDecoder));
		this.videoDecoderElements.push(g), this.attributeMap.set("kIsPlatformVideoDecoder", g);
		let _ = new W(B(z.encoderName), B(z.noEncoder));
		this.videoDecoderElements.push(_), this.attributeMap.set("kVideoEncoderName", _);
		let v = new H(B(z.hardwareEncoder));
		this.videoDecoderElements.push(v), this.attributeMap.set("kIsPlatformVideoEncoder", v);
		let y = new H(B(z.decryptingDemuxer));
		this.videoDecoderElements.push(y), this.attributeMap.set("kIsVideoDecryptingDemuxerStream", y);
		let ee = new qe(this);
		this.attributeMap.set("kVideoTracks", ee);
		let b = new W(B(z.decoderName), B(z.noDecoder));
		this.audioDecoderElements.push(b), this.attributeMap.set("kAudioDecoderName", b);
		let x = new H(B(z.hardwareDecoder));
		this.audioDecoderElements.push(x), this.attributeMap.set("kIsPlatformAudioDecoder", x);
		let S = new H(B(z.decryptingDemuxer));
		this.audioDecoderElements.push(S), this.attributeMap.set("kIsAudioDecryptingDemuxerStream", S);
		let C = new Ye(this);
		this.attributeMap.set("kAudioTracks", C);
		let te = new Je(this);
		this.attributeMap.set("kTextTracks", te);
	}
}, tt = /* @__PURE__ */ e({
	PlayerDetailView: () => it,
	PlayerDetailViewTabs: () => rt
}), q = {
	properties: "Properties",
	playerProperties: "Player properties",
	events: "Events",
	playerEvents: "Player events",
	messages: "Messages",
	playerMessages: "Player messages",
	timeline: "Timeline",
	playerTimeline: "Player timeline"
}, nt = a("panels/media/PlayerDetailView.ts", q), J = i.bind(void 0, nt), rt = /* @__PURE__ */ function(e) {
	return e.EVENTS = "events", e.PROPERTIES = "properties", e.MESSAGES = "messages", e.TIMELINE = "timeline", e;
}({}), it = class extends m {
	eventView;
	propertyView;
	messageView;
	timelineView;
	constructor() {
		super(), this.eventView = new Se(), this.propertyView = new et(), this.messageView = new Ve(), this.timelineView = new Ie(), this.appendTab("properties", J(q.properties), this.propertyView, J(q.playerProperties)), this.appendTab("events", J(q.events), this.eventView, J(q.playerEvents)), this.appendTab("messages", J(q.messages), this.messageView, J(q.playerMessages)), this.appendTab("timeline", J(q.timeline), this.timelineView, J(q.playerTimeline));
	}
	onProperty(e) {
		this.propertyView.onProperty(e);
	}
	onError(e) {
		this.messageView.addError(e);
	}
	onMessage(e) {
		this.messageView.addMessage(e);
	}
	onEvent(e) {
		this.eventView.onEvent(e), this.timelineView.onEvent(e);
	}
}, at = "/*\n * Copyright 2019 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.tree-outline {\n  padding-left: 0;\n  color: var(--sys-color-token-subtle);\n}\n\nli.storage-group-list-item {\n  padding: 10px 8px 6px;\n}\n\nli.storage-group-list-item:not(:first-child) {\n  border-top: 1px solid var(--sys-color-divider);\n}\n\nli.storage-group-list-item::before {\n  display: none;\n}\n\n.player-entry-row {\n  height: 26px;\n  min-height: 26px;\n  line-height: 26px;\n\n  &:nth-child(odd) {\n    background: var(--sys-color-surface1);\n  }\n\n  &:hover {\n    background: var(--sys-color-state-hover-on-subtle);\n  }\n\n  &:focus-visible {\n    outline: var(--sys-size-2) solid var(--sys-color-state-focus-ring);\n    outline-offset: calc(var(--sys-size-2) * -1);\n  }\n\n  &.selected {\n    background: var(--sys-color-tonal-container);\n    color: var(--sys-color-on-tonal-container);\n  }\n}\n\n.player-entry-status-icon-centering {\n  margin: auto;\n  display: inherit;\n\n  & > devtools-icon {\n    height: 16px;\n    width: 16px;\n  }\n}\n\n.player-entry-status-icon {\n  width: 28px;\n  min-width: 28px;\n  height: 26px;\n  border-right: 1px solid var(--sys-color-divider);\n  overflow: hidden;\n}\n\n.player-entry-frame-title {\n  height: 26px;\n  width: 125px;\n  min-width: 125px;\n  text-overflow: ellipsis;\n  padding: 0 10px;\n  border-right: 1px solid var(--sys-color-divider);\n  overflow: hidden;\n}\n\n.player-entry-player-title {\n  height: 26px;\n  padding-left: 10px;\n  overflow: hidden;\n}\n\n.player-entry-header {\n  height: 27px;\n  line-height: 27px;\n  min-height: 27px;\n  padding-left: 10px;\n  border-bottom: 1px solid var(--sys-color-divider);\n}\n", ot = /* @__PURE__ */ e({ PlayerListView: () => ut }), { classMap: st } = y, Y = {
	hidePlayer: "Hide player",
	hideAllOthers: "Hide all others",
	savePlayerInfo: "Save player info",
	players: "Players"
}, ct = a("panels/media/PlayerListView.ts", Y), X = i.bind(void 0, ct), lt = (e, n, r) => {
	p(v`
      <style>${at}</style>
      <div class="player-entry-header" id="players-header">${X(Y.players)}</div>
      <div role="listbox" aria-labelledby="players-header">
      ${e.players.map((n) => {
		let r = n.playerID === e.selectedPlayerID;
		return v`
          <div class=${st({
			"player-entry-row": !0,
			hbox: !0,
			selected: r,
			"force-white-icons": r
		})}
               tabindex="0"
               @click=${() => e.onPlayerClick(n.playerID)}
               @keydown=${(r) => {
			t(r) && (r.preventDefault(), e.onPlayerClick(n.playerID));
		}}
               @contextmenu=${(t) => e.onPlayerContextMenu(n.playerID, t)}
               role="option"
               aria-selected=${r}
               jslog=${g("player").track({
			click: !0,
			resize: !0
		})}>
            <div class="player-entry-status-icon vbox">
              <div class="player-entry-status-icon-centering">
                <devtools-icon name=${n.iconName}></devtools-icon>
              </div>
            </div>
            <div class="player-entry-frame-title">${n.frameTitle}</div>
            <div class="player-entry-player-title">${n.playerTitle}</div>
          </div>
        `;
	})}
      </div>
    `, r);
}, ut = class extends C {
	#e;
	playerStatuses;
	playerEntriesWithHostnameFrameTitle;
	mainContainer;
	currentlySelectedPlayerID;
	constructor(e, t = lt) {
		super({ useShadowDom: !0 }), this.#e = t, this.playerStatuses = /* @__PURE__ */ new Map(), this.playerEntriesWithHostnameFrameTitle = /* @__PURE__ */ new Set(), this.mainContainer = e, this.currentlySelectedPlayerID = null, this.requestUpdate();
	}
	performUpdate() {
		let e = {
			players: Array.from(this.playerStatuses.values()),
			selectedPlayerID: this.currentlySelectedPlayerID,
			onPlayerClick: this.selectPlayer.bind(this),
			onPlayerContextMenu: this.rightClickPlayer.bind(this)
		};
		this.#e(e, {}, this.contentElement);
	}
	selectPlayerById(e) {
		this.playerStatuses.has(e) && this.selectPlayer(e);
	}
	selectPlayer(e) {
		this.mainContainer.renderMainPanel(e), this.currentlySelectedPlayerID = e, this.requestUpdate();
	}
	rightClickPlayer(e, t) {
		let n = new x(t);
		n.headerSection().appendItem(X(Y.hidePlayer), this.mainContainer.markPlayerForDeletion.bind(this.mainContainer, e), { jslogContext: "hide-player" }), n.headerSection().appendItem(X(Y.hideAllOthers), this.mainContainer.markOtherPlayersForDeletion.bind(this.mainContainer, e), { jslogContext: "hide-all-others" }), n.headerSection().appendItem(X(Y.savePlayerInfo), this.mainContainer.exportPlayerData.bind(this.mainContainer, e), { jslogContext: "save-player-info" }), n.show();
	}
	setMediaElementFrameTitle(e, t, n) {
		if (this.playerEntriesWithHostnameFrameTitle.has(e)) n || this.playerEntriesWithHostnameFrameTitle.delete(e);
		else if (n) return;
		if (!this.playerStatuses.has(e)) return;
		let r = this.playerStatuses.get(e);
		r && (r.frameTitle = t, this.requestUpdate());
	}
	setMediaElementPlayerTitle(e, t) {
		if (!this.playerStatuses.has(e)) return;
		let n = this.playerStatuses.get(e);
		n && (n.playerTitle = t, this.requestUpdate());
	}
	setMediaElementPlayerIcon(e, t) {
		if (!this.playerStatuses.has(e)) return;
		let n = this.playerStatuses.get(e);
		n && (n.iconName = t, this.requestUpdate());
	}
	formatAndEvaluate(e, t, n, r, i) {
		n.length <= r || (n.length >= i && (n = n.substring(0, i - 1) + "…"), t.bind(this)(e, n));
	}
	addMediaElementItem(e) {
		this.playerStatuses.set(e, {
			playerTitle: "PlayerTitle",
			frameTitle: "FrameTitle",
			playerID: e,
			exists: !0,
			playing: !1,
			titleEdited: !1,
			iconName: "pause"
		}), this.playerEntriesWithHostnameFrameTitle.add(e), this.requestUpdate();
	}
	deletePlayer(e) {
		this.playerStatuses.has(e) && (this.playerStatuses.delete(e), this.requestUpdate());
	}
	onEvent(e, t) {
		let n = JSON.parse(t.value), r = n.event;
		if (r === "kLoad") {
			let t = n.url, r = t.substring(t.lastIndexOf("/") + 1);
			this.formatAndEvaluate(e, this.setMediaElementPlayerTitle, r, 1, 20);
			return;
		}
		if (r === "kPlay") {
			this.setMediaElementPlayerIcon(e, "play");
			return;
		}
		if (r === "kPause" || r === "kEnded") {
			this.setMediaElementPlayerIcon(e, "pause");
			return;
		}
		if (r === "kWebMediaPlayerDestroyed") {
			this.setMediaElementPlayerIcon(e, "cross");
			return;
		}
	}
	onProperty(e, t) {
		if (t.name === V.FRAME_URL) {
			let n = new URL(t.value).hostname;
			this.formatAndEvaluate(e, this.setMediaElementFrameTitle, n, 1, 20);
			return;
		}
		if (t.name === V.FRAME_TITLE && t.value) {
			this.formatAndEvaluate(e, this.setMediaElementFrameTitle, t.value, 1, 20);
			return;
		}
	}
	onError(e, t) {}
	onMessage(e, t) {}
}, dt = /* @__PURE__ */ e({
	MainView: () => $,
	PlayerDataDownloadManager: () => ht
}), Z = {
	noPlayerDetailsSelected: "No media player selected",
	selectToViewDetails: "Select a media player to inspect its details.",
	noMediaPlayer: "No media player",
	mediaPlayerDescription: "On this page you can view and export media player details."
}, ft = a("panels/media/MainView.ts", Z), Q = i.bind(void 0, ft), pt = "https://developer.chrome.com/docs/devtools/media-panel#hide-show", mt = class {
	properties;
	messages;
	events;
	errors;
	constructor() {
		this.properties = /* @__PURE__ */ new Map(), this.messages = [], this.events = [], this.errors = [];
	}
	onProperty(e) {
		this.properties.set(e.name, e.value);
	}
	onError(e) {
		this.errors.push(e);
	}
	onMessage(e) {
		this.messages.push(e);
	}
	onEvent(e) {
		this.events.push(e);
	}
	export() {
		return {
			properties: this.properties,
			messages: this.messages,
			events: this.events,
			errors: this.errors
		};
	}
}, ht = class {
	playerDataCollection;
	constructor() {
		this.playerDataCollection = /* @__PURE__ */ new Map();
	}
	addPlayer(e) {
		this.playerDataCollection.set(e, new mt());
	}
	onProperty(e, t) {
		let n = this.playerDataCollection.get(e);
		n && n.onProperty(t);
	}
	onError(e, t) {
		let n = this.playerDataCollection.get(e);
		n && n.onError(t);
	}
	onMessage(e, t) {
		let n = this.playerDataCollection.get(e);
		n && n.onMessage(t);
	}
	onEvent(e, t) {
		let n = this.playerDataCollection.get(e);
		n && n.onEvent(t);
	}
	exportPlayerData(e) {
		let t = this.playerDataCollection.get(e);
		if (!t) throw Error("Unable to find player");
		return t.export();
	}
	deletePlayer(e) {
		this.playerDataCollection.delete(e);
	}
}, $ = class extends u {
	detailPanels;
	deletedPlayers;
	downloadStore;
	sidebar;
	#e;
	#t;
	#n;
	#r;
	#i = () => {};
	constructor(e = new ht()) {
		super("media"), this.detailPanels = /* @__PURE__ */ new Map(), this.#e = /* @__PURE__ */ new Map(), this.#t = /* @__PURE__ */ new Map(), this.#r = new Promise((e) => {
			this.#i = e;
		}), this.deletedPlayers = /* @__PURE__ */ new Set(), this.downloadStore = e, this.sidebar = new ut(this), this.sidebar.show(this.panelSidebarElement()), this.splitWidget().hideSidebar(), this.#n = new h(Q(Z.noMediaPlayer), Z.mediaPlayerDescription), this.#n.show(this.mainElement()), this.#n.link = pt, w.instance().observeModels(A, this, { scoped: !0 });
	}
	renderMainPanel(e) {
		if (!this.detailPanels.has(e)) return;
		let t = this.splitWidget().mainWidget();
		t && t.detachChildWidgets(), this.detailPanels.get(e)?.show(this.mainElement());
	}
	wasShown() {
		super.wasShown();
		for (let e of w.instance().models(A, { scoped: !0 })) this.addEventListeners(e);
	}
	willHide() {
		super.willHide();
		for (let e of w.instance().models(A, { scoped: !0 })) this.removeEventListeners(e);
	}
	modelAdded(e) {
		this.isShowing() && this.addEventListeners(e);
	}
	modelRemoved(e) {
		this.removeEventListeners(e);
	}
	addEventListeners(e) {
		e.ensureEnabled(), e.addEventListener(k.PLAYER_PROPERTIES_CHANGED, this.propertiesChanged, this), e.addEventListener(k.PLAYER_EVENTS_ADDED, this.eventsAdded, this), e.addEventListener(k.PLAYER_MESSAGES_LOGGED, this.messagesLogged, this), e.addEventListener(k.PLAYER_ERRORS_RAISED, this.errorsRaised, this), e.addEventListener(k.PLAYER_CREATED, this.playerCreated, this);
	}
	removeEventListeners(e) {
		e.removeEventListener(k.PLAYER_PROPERTIES_CHANGED, this.propertiesChanged, this), e.removeEventListener(k.PLAYER_EVENTS_ADDED, this.eventsAdded, this), e.removeEventListener(k.PLAYER_MESSAGES_LOGGED, this.messagesLogged, this), e.removeEventListener(k.PLAYER_ERRORS_RAISED, this.errorsRaised, this), e.removeEventListener(k.PLAYER_CREATED, this.playerCreated, this);
	}
	propertiesChanged(e) {
		for (let t of e.data.properties) this.onProperty(e.data.playerId, t);
	}
	eventsAdded(e) {
		for (let t of e.data.events) this.onEvent(e.data.playerId, t);
	}
	messagesLogged(e) {
		for (let t of e.data.messages) this.onMessage(e.data.playerId, t);
	}
	errorsRaised(e) {
		for (let t of e.data.errors) this.onError(e.data.playerId, t);
	}
	shouldPropagate(e) {
		return !this.deletedPlayers.has(e) && this.detailPanels.has(e);
	}
	onProperty(e, t) {
		this.shouldPropagate(e) && (this.sidebar.onProperty(e, t), this.downloadStore.onProperty(e, t), this.detailPanels.get(e)?.onProperty(t));
	}
	onError(e, t) {
		this.shouldPropagate(e) && (this.sidebar.onError(e, t), this.downloadStore.onError(e, t), this.detailPanels.get(e)?.onError(t));
	}
	onMessage(e, t) {
		this.shouldPropagate(e) && (this.sidebar.onMessage(e, t), this.downloadStore.onMessage(e, t), this.detailPanels.get(e)?.onMessage(t));
	}
	onEvent(e, t) {
		this.shouldPropagate(e) && (this.sidebar.onEvent(e, t), this.downloadStore.onEvent(e, t), this.detailPanels.get(e)?.onEvent(t));
	}
	selectPlayerByDOMNodeId(e) {
		let t = this.#t.get(e);
		if (!t) return;
		let n = this.#e.get(t);
		n && this.sidebar.selectPlayerById(n.playerId);
	}
	waitForInitialPlayers() {
		return this.#r;
	}
	playerCreated(e) {
		let t = e.data;
		this.#e.set(t.playerId, t), t.domNodeId && this.#t.set(t.domNodeId, t.playerId), this.splitWidget().showMode() !== ee.BOTH && this.splitWidget().showBoth(), this.sidebar.addMediaElementItem(t.playerId), this.detailPanels.set(t.playerId, new it()), this.downloadStore.addPlayer(t.playerId), this.detailPanels.size === 1 && (this.#n.header = Q(Z.noPlayerDetailsSelected), this.#n.text = Q(Z.selectToViewDetails)), this.#i();
	}
	markPlayerForDeletion(e) {
		this.deletedPlayers.add(e), this.detailPanels.delete(e);
		let t = this.#e.get(e);
		if (t?.domNodeId && this.#t.delete(t.domNodeId), this.#e.delete(e), this.sidebar.deletePlayer(e), this.downloadStore.deletePlayer(e), this.detailPanels.size === 0) {
			this.#n.header = Q(Z.noMediaPlayer), this.#n.text = Q(Z.mediaPlayerDescription), this.splitWidget().hideSidebar();
			let e = this.splitWidget().mainWidget();
			e && e.detachChildWidgets(), this.#n.show(this.mainElement());
		}
	}
	markOtherPlayersForDeletion(e) {
		for (let t of this.detailPanels.keys()) t !== e && this.markPlayerForDeletion(t);
	}
	exportPlayerData(e) {
		let t = this.downloadStore.exportPlayerData(e), n = "data:application/octet-stream," + encodeURIComponent(JSON.stringify(t, null, 2)), r = document.createElement("a");
		r.href = n, r.download = e + ".json", r.click();
	}
};
//#endregion
export { Ue as a, we as c, tt as i, Ce as l, dt as n, Re as o, ot as r, Te as s, $ as t, ve as u };
