import { n as e } from "./rolldown-runtime-DF993M8W.js";
import { H as t, J as n, Jt as r, K as i, N as a, W as o, Wt as s, Xt as c, Yt as l, en as u, qt as d, v as f } from "./common-DMSVbaSb.js";
import { $i as p, Dp as m, Fo as h, No as g, Op as _, Or as v, Vo as y, Zo as b, ef as x, ha as ee } from "./legacy-dM_vujv7.js";
import "./platform-D4TUCh2P.js";
import { n as S } from "./MapUtilities-C6UNTa-e.js";
import { o as te } from "./FormatterActions-D6HaA-6R.js";
import { t as ne } from "./third-party-web-Dm5IRT3g.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/types/Configuration.ts
var re = () => ({
	showAllEvents: !1,
	debugMode: !1,
	maxInvalidationEventsPerEvent: 20,
	enableAnimationsFrameHandler: !1
});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/types/Extensions.ts
function ie(e) {
	return e.dataType === "marker";
}
function ae(e) {
	let t = "track" in e && !!e.track;
	return (e.dataType === "track-entry" || e.dataType === void 0) && t;
}
function oe(e) {
	return e.url !== void 0 && e.description !== void 0;
}
function se(e) {
	return ie(e) || ae(e) || oe(e);
}
function ce(e) {
	return e.cat === "devtools.extension";
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/types/File.ts
var le = /* @__PURE__ */ function(e) {
	return e.CPU_PROFILE = "CPUProfile", e.TRACE_EVENTS = "TraceEvents", e;
}({}), ue = /* @__PURE__ */ function(e) {
	return e.CREATION_NOT_STARTED = "creation_not_started", e.PENDING_TO_EVENT = "pending_to_event", e.CONNECTED = "connected", e;
}({}), de = /* @__PURE__ */ function(e) {
	return e.RAW_EVENT = "r", e.SYNTHETIC_EVENT = "s", e.PROFILE_CALL = "p", e.LEGACY_TIMELINE_FRAME = "l", e;
}({});
function fe(e) {
	return e.type === "TIME_RANGE";
}
function pe(e) {
	return e.type === "ENTRY_LABEL";
}
function me(e) {
	return e.type === "ENTRIES_LINK";
}
function he(e) {
	let t = e.split("-"), n = t[0];
	switch (n) {
		case "p":
			if (t.length !== 5 || !t.every((e, t) => t === 0 || typeof e == "number" || !isNaN(parseInt(e, 10)))) throw Error(`Invalid ProfileCallKey: ${e}`);
			return {
				type: t[0],
				processID: parseInt(t[1], 10),
				threadID: parseInt(t[2], 10),
				sampleIndex: parseInt(t[3], 10),
				protocol: parseInt(t[4], 10)
			};
		case "r":
			if (t.length !== 2 || typeof t[1] != "number" && isNaN(parseInt(t[1], 10))) throw Error(`Invalid RawEvent Key: ${e}`);
			return {
				type: t[0],
				rawIndex: parseInt(t[1], 10)
			};
		case "s":
			if (t.length !== 2 || typeof t[1] != "number" && isNaN(parseInt(t[1], 10))) throw Error(`Invalid SyntheticEvent Key: ${e}`);
			return {
				type: t[0],
				rawIndex: parseInt(t[1], 10)
			};
		case "l":
			if (t.length !== 2 || Number.isNaN(parseInt(t[1], 10))) throw Error(`Invalid LegacyTimelineFrame Key: ${e}`);
			return {
				type: n,
				rawIndex: parseInt(t[1], 10)
			};
		default: throw Error(`Unknown trace event key: ${e}`);
	}
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/types/Timing.ts
function C(e) {
	return e;
}
function w(e) {
	return e;
}
function ge(e) {
	return e;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/types/TraceEvents.ts
var _e = /* @__PURE__ */ e({
	AuctionWorkletType: () => Te,
	CallFrameID: () => kt,
	Categories: () => br,
	InvalidationEventType: () => xt,
	LayoutInvalidationReason: () => ze,
	MarkerName: () => Ne,
	NO_NAVIGATION: () => Re,
	Name: () => A,
	Phase: () => T,
	ProcessID: () => jt,
	ProfileID: () => Ot,
	SampleIndex: () => At,
	Scope: () => E,
	SelectorTimingsKey: () => D,
	StyleRecalcInvalidationReason: () => Ve,
	ThreadID: () => Mt,
	VALID_PROFILE_SOURCES: () => Ce,
	WorkerId: () => Nt,
	eventIsPageLoadEvent: () => Ie,
	isAbortPostTaskCallback: () => hr,
	isActivateLayerTree: () => gt,
	isAnimation: () => Xt,
	isAnimationFrameAsyncEnd: () => tt,
	isAnimationFrameAsyncStart: () => et,
	isAnimationFramePresentation: () => nt,
	isAnyLargestContentfulPaintCandidate: () => O,
	isAnyScriptSourceEvent: () => Er,
	isAuctionWorkletDoneWithProcess: () => De,
	isAuctionWorkletRunningInProcess: () => Ee,
	isBegin: () => Ft,
	isBeginCommitCompositorFrame: () => We,
	isBeginFrame: () => ct,
	isBeginMainThreadFrame: () => dt,
	isBeginRemoteFontLoad: () => Fn,
	isCommit: () => pt,
	isCommitLoad: () => Yt,
	isComplete: () => Pt,
	isCompositeLayers: () => ht,
	isConsoleRunTask: () => _r,
	isConsoleTime: () => Bn,
	isConsoleTimeStamp: () => Vn,
	isDOMStats: () => Wt,
	isDebuggerAsyncTaskRun: () => Dt,
	isDebuggerAsyncTaskScheduled: () => Et,
	isDecodeImage: () => bt,
	isDecodeLazyPixelRef: () => yt,
	isDidCommitSameDocumentNavigation: () => kn,
	isDispatch: () => Lt,
	isDisplayListItemListSnapshot: () => Zn,
	isDomLoading: () => Pn,
	isDrawFrame: () => st,
	isDrawLazyPixelRef: () => vt,
	isDroppedFrame: () => lt,
	isEnd: () => It,
	isEventTiming: () => ln,
	isEventTimingEnd: () => un,
	isEventTimingStart: () => dn,
	isFireAnimationFrame: () => $n,
	isFireIdleCallback: () => Bt,
	isFirstContentfulPaint: () => en,
	isFirstPaint: () => on,
	isFlowPhase: () => be,
	isFlowPhaseEvent: () => vr,
	isFrameCommittedInBrowser: () => Jt,
	isFunctionCall: () => fr,
	isGPUTask: () => fn,
	isHandlePostMessage: () => Ht,
	isInstant: () => Rt,
	isInteractiveTime: () => cn,
	isInvalidateLayout: () => Tt,
	isInvalidationTracking: () => _t,
	isJSInvocationEvent: () => gr,
	isJSSample: () => at,
	isLargestImagePaintCandidate: () => nn,
	isLargestTextPaintCandidate: () => rn,
	isLayerTreeHostImplSnapshot: () => Qn,
	isLayout: () => wt,
	isLayoutImageUnsized: () => Xe,
	isLayoutInvalidationTracking: () => $t,
	isLayoutShift: () => Qt,
	isLegacyScreenshot: () => Oe,
	isLegacySyntheticScreenshot: () => ke,
	isLegacyTimelineFrame: () => xr,
	isLinkPreconnect: () => qe,
	isMainFrameViewport: () => An,
	isMarkDOMContent: () => sn,
	isMarkLoad: () => an,
	isMarkerEvent: () => Pe,
	isMetaCharsetCheck: () => Ke,
	isNavigationStart: () => On,
	isNeedsBeginFrameChanged: () => ft,
	isNestableAsyncPhase: () => ve,
	isNetworkTrackEntry: () => En,
	isPaint: () => Kn,
	isPaintImage: () => qn,
	isPairableAsyncBegin: () => Ze,
	isPairableAsyncEnd: () => Qe,
	isPairableAsyncInstant: () => $e,
	isParseAuthorStyleSheetEvent: () => yr,
	isParseHTML: () => Un,
	isParseMetaViewport: () => Ge,
	isPerformanceMark: () => zn,
	isPerformanceMeasure: () => Ln,
	isPerformanceMeasureBegin: () => Rn,
	isPhaseAsync: () => ye,
	isPipelineReporter: () => rt,
	isPrePaint: () => Dn,
	isPreloadRenderBlockingStatusChangeEvent: () => Dr,
	isProcessName: () => Kt,
	isProfile: () => pn,
	isProfileCall: () => k,
	isProfileChunk: () => hn,
	isRasterTask: () => mt,
	isRecalcStyle: () => Ct,
	isReceivedDataEvent: () => Cn,
	isRemoteFontLoaded: () => In,
	isRenderFrameImplCreateChildFrame: () => Ye,
	isRendererEvent: () => zt,
	isRequestIdleCallback: () => nr,
	isRequestMainThreadFrame: () => ut,
	isResourceChangePriority: () => gn,
	isResourceFinish: () => bn,
	isResourceMarkAsCached: () => yn,
	isResourceReceiveResponse: () => vn,
	isResourceReceivedData: () => Sn,
	isResourceSendRequest: () => _n,
	isResourceWillSendRequest: () => xn,
	isRunPostTaskCallback: () => mr,
	isRunTask: () => we,
	isRundownScript: () => Cr,
	isRundownScriptCompiled: () => Sr,
	isRundownScriptSource: () => wr,
	isRundownScriptSourceLarge: () => Tr,
	isSchedulePostMessage: () => Vt,
	isSchedulePostTaskCallback: () => pr,
	isScheduleStyleInvalidationTracking: () => Be,
	isScheduleStyleRecalculation: () => Je,
	isScreenshot: () => Ae,
	isScrollLayer: () => Jn,
	isSelectorStats: () => St,
	isSetLayerId: () => Yn,
	isSoftLargestContentfulPaintCandidate: () => tn,
	isSoftNavigationStart: () => je,
	isStyleInvalidatorInvalidationTracking: () => Ue,
	isStyleRecalcInvalidationTracking: () => He,
	isSyntheticAnimation: () => Zt,
	isSyntheticBased: () => it,
	isSyntheticConsoleTiming: () => Mn,
	isSyntheticCpuProfile: () => mn,
	isSyntheticInteraction: () => ot,
	isSyntheticLayoutShift: () => Wn,
	isSyntheticLayoutShiftCluster: () => Gn,
	isSyntheticNetworkRequest: () => wn,
	isSyntheticUserTiming: () => jn,
	isSyntheticWebSocketConnection: () => Tn,
	isThreadName: () => Gt,
	isTimerFire: () => tr,
	isTimerInstall: () => er,
	isTracingSessionIdForWorker: () => Le,
	isTracingStartedInBrowser: () => qt,
	isUpdateCounters: () => Ut,
	isUpdateLayer: () => Xn,
	isUserTiming: () => Nn,
	isUserTimingMeasure: () => Hn,
	isV8Compile: () => dr,
	isWebSocketCreate: () => rr,
	isWebSocketDestroy: () => cr,
	isWebSocketEvent: () => ur,
	isWebSocketInfo: () => ir,
	isWebSocketReceiveHandshakeResponse: () => sr,
	isWebSocketSendHandshakeRequest: () => or,
	isWebSocketTraceEvent: () => lr,
	isWebSocketTransfer: () => ar,
	objectIsCallFrame: () => Se,
	objectIsEvent: () => xe
}), T = /* @__PURE__ */ function(e) {
	return e.BEGIN = "B", e.END = "E", e.COMPLETE = "X", e.INSTANT = "I", e.COUNTER = "C", e.ASYNC_NESTABLE_START = "b", e.ASYNC_NESTABLE_INSTANT = "n", e.ASYNC_NESTABLE_END = "e", e.ASYNC_STEP_INTO = "T", e.ASYNC_BEGIN = "S", e.ASYNC_END = "F", e.ASYNC_STEP_PAST = "p", e.FLOW_START = "s", e.FLOW_STEP = "t", e.FLOW_END = "f", e.SAMPLE = "P", e.OBJECT_CREATED = "N", e.OBJECT_SNAPSHOT = "O", e.OBJECT_DESTROYED = "D", e.METADATA = "M", e.MEMORY_DUMP_GLOBAL = "V", e.MEMORY_DUMP_PROCESS = "v", e.MARK = "R", e.CLOCK_SYNC = "c", e;
}({});
function ve(e) {
	return e === "b" || e === "e" || e === "n";
}
function ye(e) {
	return ve(e) || e === "S" || e === "T" || e === "F" || e === "p";
}
function be(e) {
	return e === "s" || e === "t" || e === "f";
}
var E = /* @__PURE__ */ function(e) {
	return e.THREAD = "t", e.PROCESS = "p", e.GLOBAL = "g", e;
}({});
function xe(e) {
	return "cat" in e && "name" in e && "ts" in e;
}
function Se(e) {
	return "functionName" in e && typeof e.functionName == "string" && "scriptId" in e && (typeof e.scriptId == "string" || typeof e.scriptId == "number") && "columnNumber" in e && typeof e.columnNumber == "number" && "lineNumber" in e && typeof e.lineNumber == "number" && "url" in e && typeof e.url == "string";
}
var Ce = [
	"Inspector",
	"SelfProfiling",
	"Internal"
];
function we(e) {
	return e.name === "RunTask" && e.ph === "X";
}
var Te = /* @__PURE__ */ function(e) {
	return e.BIDDER = "bidder", e.SELLER = "seller", e.UNKNOWN = "unknown", e;
}({});
function Ee(e) {
	return e.name === "AuctionWorkletRunningInProcess";
}
function De(e) {
	return e.name === "AuctionWorkletDoneWithProcess";
}
function Oe(e) {
	return e.name === "Screenshot" && "id" in e;
}
function ke(e) {
	return e.name === "Screenshot" && "dataUri" in (e.args ?? {});
}
function Ae(e) {
	return e.name === "Screenshot" && "source_id" in (e.args ?? {});
}
function je(e) {
	return e.name === "SoftNavigationStart";
}
var Me = [
	sn,
	an,
	on,
	en,
	O,
	On,
	je
], Ne = [
	"MarkDOMContent",
	"MarkLoad",
	"firstPaint",
	"firstContentfulPaint",
	"largestContentfulPaint::Candidate",
	"largestContentfulPaint::CandidateForSoftNavigation",
	"navigationStart",
	"SoftNavigationStart"
];
function Pe(e) {
	return e.ph, Me.some((t) => t(e));
}
var Fe = [...Me, cn];
function Ie(e) {
	return e.ph, Fe.some((t) => t(e));
}
function Le(e) {
	return e.name === "TracingSessionIdForWorker";
}
var Re = "NO_NAVIGATION", ze = /* @__PURE__ */ function(e) {
	return e.SIZE_CHANGED = "Size changed", e.ATTRIBUTE = "Attribute", e.ADDED_TO_LAYOUT = "Added to layout", e.SCROLLBAR_CHANGED = "Scrollbar changed", e.REMOVED_FROM_LAYOUT = "Removed from layout", e.STYLE_CHANGED = "Style changed", e.FONTS_CHANGED = "Fonts changed", e.UNKNOWN = "Unknown", e;
}({});
function Be(e) {
	return e.name === "ScheduleStyleInvalidationTracking";
}
var Ve = /* @__PURE__ */ function(e) {
	return e.ANIMATION = "Animation", e.RELATED_STYLE_RULE = "Related style rule", e;
}({});
function He(e) {
	return e.name === "StyleRecalcInvalidationTracking";
}
function Ue(e) {
	return e.name === "StyleInvalidatorInvalidationTracking";
}
function We(e) {
	return e.name === "BeginCommitCompositorFrame";
}
function Ge(e) {
	return e.name === "ParseMetaViewport";
}
function Ke(e) {
	return e.name === "MetaCharsetCheck";
}
function qe(e) {
	return e.name === "LinkPreconnect";
}
function Je(e) {
	return e.name === "ScheduleStyleRecalculation";
}
function Ye(e) {
	return e.name === "RenderFrameImpl::createChildFrame";
}
function Xe(e) {
	return e.name === "LayoutImageUnsized";
}
function Ze(e) {
	return e.ph === "b";
}
function Qe(e) {
	return e.ph === "e";
}
function $e(e) {
	return e.ph === "n";
}
function et(e) {
	return e.name === "AnimationFrame" && e.ph === "b";
}
function tt(e) {
	return e.name === "AnimationFrame" && e.ph === "e";
}
function nt(e) {
	return e.name === "AnimationFrame::Presentation";
}
function rt(e) {
	return e.name === "PipelineReporter";
}
function it(e) {
	return "rawSourceEvent" in e;
}
function at(e) {
	return e.name === "JSSample";
}
function ot(e) {
	return !!("interactionId" in e && e.args?.data && "beginEvent" in e.args.data && "endEvent" in e.args.data);
}
function st(e) {
	return e.name === "DrawFrame" && e.ph === "I";
}
function ct(e) {
	return !!(e.name === "BeginFrame" && e.args && "frameSeqId" in e.args);
}
function lt(e) {
	return !!(e.name === "DroppedFrame" && e.args && "frameSeqId" in e.args);
}
function ut(e) {
	return e.name === "RequestMainThreadFrame";
}
function dt(e) {
	return e.name === "BeginMainThreadFrame";
}
function ft(e) {
	return e.name === "NeedsBeginFrameChanged";
}
function pt(e) {
	return !!(e.name === "Commit" && e.args && "frameSeqId" in e.args);
}
function mt(e) {
	return e.name === "RasterTask";
}
function ht(e) {
	return e.name === "CompositeLayers";
}
function gt(e) {
	return e.name === "ActivateLayerTree";
}
function _t(e) {
	return Be(e) || He(e) || Ue(e) || $t(e);
}
function vt(e) {
	return e.name === "Draw LazyPixelRef";
}
function yt(e) {
	return e.name === "Decode LazyPixelRef";
}
function bt(e) {
	return e.name === "Decode Image";
}
var xt = /* @__PURE__ */ function(e) {
	return e.StyleInvalidatorInvalidationTracking = "StyleInvalidatorInvalidationTracking", e.StyleRecalcInvalidationTracking = "StyleRecalcInvalidationTracking", e;
}({}), D = /* @__PURE__ */ function(e) {
	return e.Elapsed = "elapsed (us)", e.RejectPercentage = "reject_percentage", e.FastRejectCount = "fast_reject_count", e.MatchAttempts = "match_attempts", e.MatchCount = "match_count", e.Selector = "selector", e.StyleSheetId = "style_sheet_id", e.InvalidationCount = "invalidation_count", e;
}({});
function St(e) {
	return e.name === "SelectorStats";
}
function Ct(e) {
	return e.name === "UpdateLayoutTree";
}
function wt(e) {
	return e.name === "Layout" && !!(e.args && "beginData" in e.args);
}
function Tt(e) {
	return e.name === "InvalidateLayout";
}
function Et(e) {
	return e.name === "v8::Debugger::AsyncTaskScheduled";
}
function Dt(e) {
	return e.name === "v8::Debugger::AsyncTaskRun";
}
function Ot(e) {
	return e;
}
function kt(e) {
	return e;
}
function At(e) {
	return e;
}
function jt(e) {
	return e;
}
function Mt(e) {
	return e;
}
function Nt(e) {
	return e;
}
function Pt(e) {
	return e.ph === "X";
}
function Ft(e) {
	return e.ph === "B";
}
function It(e) {
	return e.ph === "E";
}
function Lt(e) {
	return e.name === "EventDispatch" && e.ph === "X";
}
function Rt(e) {
	return e.ph === "I";
}
function zt(e) {
	return Rt(e) || Pt(e);
}
function Bt(e) {
	return e.name === "FireIdleCallback" && e.ph === "X";
}
function Vt(e) {
	return e.name === "SchedulePostMessage";
}
function Ht(e) {
	return e.name === "HandlePostMessage" && e.ph === "X";
}
function Ut(e) {
	return e.name === "UpdateCounters";
}
function Wt(e) {
	return e.name === "DOMStats";
}
function Gt(e) {
	return e.name === "thread_name";
}
function Kt(e) {
	return e.name === "process_name";
}
function qt(e) {
	return e.name === "TracingStartedInBrowser";
}
function Jt(e) {
	return e.name === "FrameCommittedInBrowser";
}
function Yt(e) {
	return e.name === "CommitLoad";
}
function Xt(e) {
	return e.name === "Animation" && e.cat.includes("devtools.timeline");
}
function Zt(e) {
	if (e.name !== "Animation" || !e.cat.includes("devtools.timeline")) return !1;
	let t = e.args?.data;
	return t ? "beginEvent" in t && "endEvent" in t : !1;
}
function Qt(e) {
	return e.name === "LayoutShift";
}
function $t(e) {
	return e.name === "LayoutInvalidationTracking";
}
function en(e) {
	return e.name === "firstContentfulPaint";
}
function O(e) {
	return e.name === "largestContentfulPaint::Candidate" || e.name === "largestContentfulPaint::CandidateForSoftNavigation";
}
function tn(e) {
	return e.name === "largestContentfulPaint::CandidateForSoftNavigation";
}
function nn(e) {
	return e.name === "LargestImagePaint::Candidate";
}
function rn(e) {
	return e.name === "LargestTextPaint::Candidate";
}
function an(e) {
	return e.name === "MarkLoad";
}
function on(e) {
	return e.name === "firstPaint";
}
function sn(e) {
	return e.name === "MarkDOMContent";
}
function cn(e) {
	return e.name === "InteractiveTime";
}
function ln(e) {
	return e.name === "EventTiming";
}
function un(e) {
	return ln(e) && e.ph === "e";
}
function dn(e) {
	return ln(e) && e.ph === "b";
}
function fn(e) {
	return e.name === "GPUTask";
}
function pn(e) {
	return e.name === "Profile";
}
function mn(e) {
	return e.name === "CpuProfile" && e.ph === "X";
}
function hn(e) {
	return e.name === "ProfileChunk";
}
function gn(e) {
	return e.name === "ResourceChangePriority";
}
function _n(e) {
	return e.name === "ResourceSendRequest";
}
function vn(e) {
	return e.name === "ResourceReceiveResponse";
}
function yn(e) {
	return e.name === "ResourceMarkAsCached";
}
function bn(e) {
	return e.name === "ResourceFinish";
}
function xn(e) {
	return e.name === "ResourceWillSendRequest";
}
function Sn(e) {
	return e.name === "ResourceReceivedData";
}
function Cn(e) {
	return e.name === "ResourceReceivedData" || e.name === "ResourceFinish" || e.name === "ResourceReceiveResponse";
}
function wn(e) {
	return e.name === "SyntheticNetworkRequest";
}
function Tn(e) {
	return e.name === "SyntheticWebSocketConnection";
}
function En(e) {
	return wn(e) || Tn(e) || lr(e);
}
function Dn(e) {
	return e.name === "PrePaint";
}
function On(e) {
	return e.name === "navigationStart" && e.args?.data?.documentLoaderURL !== "";
}
function kn(e) {
	return e.name === "RenderFrameHostImpl::DidCommitSameDocumentNavigation" && e.ph === "X";
}
function An(e) {
	return e.name === "PaintTimingVisualizer::Viewport";
}
function jn(e) {
	if (e.cat !== "blink.user_timing") return !1;
	let t = e.args?.data;
	return t ? "beginEvent" in t && "endEvent" in t : !1;
}
function Mn(e) {
	if (e.cat !== "blink.console") return !1;
	let t = e.args?.data;
	return t ? "beginEvent" in t && "endEvent" in t : !1;
}
function Nn(e) {
	return e.cat === "blink.user_timing";
}
function Pn(e) {
	return e.name === "domLoading";
}
function Fn(e) {
	return e.name === "BeginRemoteFontLoad";
}
function In(e) {
	return e.name === "RemoteFontLoaded";
}
function Ln(e) {
	return Nn(e) && ye(e.ph);
}
function Rn(e) {
	return Ln(e) && e.ph === "b";
}
function zn(e) {
	return Nn(e) && (e.ph === "R" || e.ph === "I");
}
function Bn(e) {
	return e.cat === "blink.console" && ye(e.ph);
}
function Vn(e) {
	return e.ph === "I" && e.name === "TimeStamp";
}
function Hn(e) {
	return e.name === "UserTiming::Measure";
}
function Un(e) {
	return e.name === "ParseHTML";
}
function Wn(e) {
	return e.name === "SyntheticLayoutShift";
}
function Gn(e) {
	return e.name === "SyntheticLayoutShiftCluster";
}
function k(e) {
	return "callFrame" in e;
}
function Kn(e) {
	return e.name === "Paint";
}
function qn(e) {
	return e.name === "PaintImage" && e.ph === "X";
}
function Jn(e) {
	return e.name === "ScrollLayer" && e.ph === "X";
}
function Yn(e) {
	return e.name === "SetLayerTreeId";
}
function Xn(e) {
	return e.name === "UpdateLayer";
}
function Zn(e) {
	return e.name === "cc::DisplayItemList";
}
function Qn(e) {
	return e.name === "cc::LayerTreeHostImpl";
}
function $n(e) {
	return e.name === "FireAnimationFrame" && e.ph === "X";
}
function er(e) {
	return e.name === "TimerInstall";
}
function tr(e) {
	return e.name === "TimerFire" && e.ph === "X";
}
function nr(e) {
	return e.name === "RequestIdleCallback";
}
function rr(e) {
	return e.name === "WebSocketCreate";
}
function ir(e) {
	return e.name === "WebSocketSendHandshakeRequest" || e.name === "WebSocketReceiveHandshakeResponse" || e.name === "WebSocketDestroy";
}
function ar(e) {
	return e.name === "WebSocketSend" || e.name === "WebSocketReceive";
}
function or(e) {
	return e.name === "WebSocketSendHandshakeRequest";
}
function sr(e) {
	return e.name === "WebSocketReceiveHandshakeResponse";
}
function cr(e) {
	return e.name === "WebSocketDestroy";
}
function lr(e) {
	return rr(e) || ir(e) || ar(e);
}
function ur(e) {
	return lr(e) || Tn(e);
}
function dr(e) {
	return e.name === "v8.compile" && e.ph === "X";
}
function fr(e) {
	return e.name === "FunctionCall" && e.ph === "X";
}
function pr(e) {
	return e.name === "SchedulePostTaskCallback";
}
function mr(e) {
	return e.name === "RunPostTaskCallback" && e.ph === "X";
}
function hr(e) {
	return e.name === "AbortPostTaskCallback" && e.ph === "X";
}
function gr(e) {
	switch (e.name) {
		case "RunMicrotasks":
		case "FunctionCall":
		case "EvaluateScript":
		case "v8.evaluateModule":
		case "EventDispatch":
		case "V8.Execute":
		case "V8Console::runTask": return !0;
	}
	return !!(e.name.startsWith("v8") || e.name.startsWith("V8") || _r(e));
}
function _r(e) {
	return e.name === "V8Console::runTask";
}
function vr(e) {
	return e.ph === "s" || e.ph === "t" || e.ph === "f";
}
function yr(e) {
	return e.name === "ParseAuthorStyleSheet" && e.ph === "X";
}
var A = /* @__PURE__ */ function(e) {
	return e.THREAD_NAME = "thread_name", e.PROGRAM = "Program", e.RUN_TASK = "RunTask", e.ASYNC_TASK = "AsyncTask", e.RUN_MICROTASKS = "RunMicrotasks", e.XHR_LOAD = "XHRLoad", e.XHR_READY_STATE_CHANGED = "XHRReadyStateChange", e.PARSE_HTML = "ParseHTML", e.PARSE_CSS = "ParseAuthorStyleSheet", e.COMPILE_CODE = "V8.CompileCode", e.COMPILE_MODULE = "V8.CompileModule", e.COMPILE = "v8.compile", e.COMPILE_SCRIPT = "V8.CompileScript", e.OPTIMIZE = "V8.OptimizeCode", e.WASM_STREAM_FROM_RESPONSE_CALLBACK = "v8.wasm.streamFromResponseCallback", e.WASM_COMPILED_MODULE = "v8.wasm.compiledModule", e.WASM_CACHED_MODULE = "v8.wasm.cachedModule", e.WASM_MODULE_CACHE_HIT = "v8.wasm.moduleCacheHit", e.WASM_MODULE_CACHE_INVALID = "v8.wasm.moduleCacheInvalid", e.PROFILE_CALL = "ProfileCall", e.EVALUATE_SCRIPT = "EvaluateScript", e.FUNCTION_CALL = "FunctionCall", e.EVENT_DISPATCH = "EventDispatch", e.EVALUATE_MODULE = "v8.evaluateModule", e.REQUEST_MAIN_THREAD_FRAME = "RequestMainThreadFrame", e.REQUEST_ANIMATION_FRAME = "RequestAnimationFrame", e.CANCEL_ANIMATION_FRAME = "CancelAnimationFrame", e.FIRE_ANIMATION_FRAME = "FireAnimationFrame", e.REQUEST_IDLE_CALLBACK = "RequestIdleCallback", e.CANCEL_IDLE_CALLBACK = "CancelIdleCallback", e.FIRE_IDLE_CALLBACK = "FireIdleCallback", e.TIMER_INSTALL = "TimerInstall", e.TIMER_REMOVE = "TimerRemove", e.TIMER_FIRE = "TimerFire", e.WEB_SOCKET_CREATE = "WebSocketCreate", e.WEB_SOCKET_SEND_HANDSHAKE = "WebSocketSendHandshakeRequest", e.WEB_SOCKET_RECEIVE_HANDSHAKE = "WebSocketReceiveHandshakeResponse", e.WEB_SOCKET_DESTROY = "WebSocketDestroy", e.WEB_SOCKET_SEND = "WebSocketSend", e.WEB_SOCKET_RECEIVE = "WebSocketReceive", e.CRYPTO_DO_ENCRYPT = "DoEncrypt", e.CRYPTO_DO_ENCRYPT_REPLY = "DoEncryptReply", e.CRYPTO_DO_DECRYPT = "DoDecrypt", e.CRYPTO_DO_DECRYPT_REPLY = "DoDecryptReply", e.CRYPTO_DO_DIGEST = "DoDigest", e.CRYPTO_DO_DIGEST_REPLY = "DoDigestReply", e.CRYPTO_DO_SIGN = "DoSign", e.CRYPTO_DO_SIGN_REPLY = "DoSignReply", e.CRYPTO_DO_VERIFY = "DoVerify", e.CRYPTO_DO_VERIFY_REPLY = "DoVerifyReply", e.V8_EXECUTE = "V8.Execute", e.V8_CONSOLE_RUN_TASK = "V8Console::runTask", e.SCHEDULE_POST_TASK_CALLBACK = "SchedulePostTaskCallback", e.RUN_POST_TASK_CALLBACK = "RunPostTaskCallback", e.ABORT_POST_TASK_CALLBACK = "AbortPostTaskCallback", e.DEBUGGER_ASYNC_TASK_RUN = "v8::Debugger::AsyncTaskRun", e.DEBUGGER_ASYNC_TASK_SCHEDULED = "v8::Debugger::AsyncTaskScheduled", e.GC = "GCEvent", e.DOMGC = "BlinkGC.AtomicPhase", e.MAJOR_GC = "MajorGC", e.MINOR_GC = "MinorGC", e.GC_COLLECT_GARBARGE = "BlinkGC.AtomicPhase", e.CPPGC_SWEEP = "CppGC.IncrementalSweep", e.SCHEDULE_STYLE_RECALCULATION = "ScheduleStyleRecalculation", e.LAYOUT = "Layout", e.RECALC_STYLE = "UpdateLayoutTree", e.INVALIDATE_LAYOUT = "InvalidateLayout", e.LAYOUT_INVALIDATION_TRACKING = "LayoutInvalidationTracking", e.COMPUTE_INTERSECTION = "ComputeIntersections", e.HIT_TEST = "HitTest", e.PRE_PAINT = "PrePaint", e.LAYERIZE = "Layerize", e.LAYOUT_SHIFT = "LayoutShift", e.SYNTHETIC_LAYOUT_SHIFT = "SyntheticLayoutShift", e.SYNTHETIC_LAYOUT_SHIFT_CLUSTER = "SyntheticLayoutShiftCluster", e.UPDATE_LAYER_TREE = "UpdateLayerTree", e.SCHEDULE_STYLE_INVALIDATION_TRACKING = "ScheduleStyleInvalidationTracking", e.STYLE_RECALC_INVALIDATION_TRACKING = "StyleRecalcInvalidationTracking", e.STYLE_INVALIDATOR_INVALIDATION_TRACKING = "StyleInvalidatorInvalidationTracking", e.SELECTOR_STATS = "SelectorStats", e.BEGIN_COMMIT_COMPOSITOR_FRAME = "BeginCommitCompositorFrame", e.PARSE_META_VIEWPORT = "ParseMetaViewport", e.META_CHARSET_CHECK = "MetaCharsetCheck", e.SCROLL_LAYER = "ScrollLayer", e.UPDATE_LAYER = "UpdateLayer", e.PAINT_SETUP = "PaintSetup", e.PAINT = "Paint", e.PAINT_IMAGE = "PaintImage", e.COMMIT = "Commit", e.COMPOSITE_LAYERS = "CompositeLayers", e.RASTER_TASK = "RasterTask", e.IMAGE_DECODE_TASK = "ImageDecodeTask", e.IMAGE_UPLOAD_TASK = "ImageUploadTask", e.DECODE_IMAGE = "Decode Image", e.DRAW_LAZY_PIXEL_REF = "Draw LazyPixelRef", e.DECODE_LAZY_PIXEL_REF = "Decode LazyPixelRef", e.GPU_TASK = "GPUTask", e.RASTERIZE = "Rasterize", e.EVENT_TIMING = "EventTiming", e.OPTIMIZE_CODE = "V8.OptimizeCode", e.CACHE_SCRIPT = "v8.produceCache", e.CACHE_MODULE = "v8.produceModuleCache", e.V8_SAMPLE = "V8Sample", e.JIT_CODE_ADDED = "JitCodeAdded", e.JIT_CODE_MOVED = "JitCodeMoved", e.STREAMING_COMPILE_SCRIPT = "v8.parseOnBackground", e.STREAMING_COMPILE_SCRIPT_WAITING = "v8.parseOnBackgroundWaiting", e.STREAMING_COMPILE_SCRIPT_PARSING = "v8.parseOnBackgroundParsing", e.BACKGROUND_DESERIALIZE = "v8.deserializeOnBackground", e.FINALIZE_DESERIALIZATION = "V8.FinalizeDeserialization", e.COMMIT_LOAD = "CommitLoad", e.MARK_LOAD = "MarkLoad", e.MARK_DOM_CONTENT = "MarkDOMContent", e.MARK_FIRST_PAINT = "firstPaint", e.MARK_FCP = "firstContentfulPaint", e.MARK_LCP_CANDIDATE = "largestContentfulPaint::Candidate", e.MARK_LCP_CANDIDATE_FOR_SOFT_NAVIGATION = "largestContentfulPaint::CandidateForSoftNavigation", e.MARK_LCP_INVALIDATE = "largestContentfulPaint::Invalidate", e.NAVIGATION_START = "navigationStart", e.SOFT_NAVIGATION_START = "SoftNavigationStart", e.CONSOLE_TIME = "ConsoleTime", e.USER_TIMING = "UserTiming", e.INTERACTIVE_TIME = "InteractiveTime", e.TIME_STAMP = "TimeStamp", e.BEGIN_FRAME = "BeginFrame", e.NEEDS_BEGIN_FRAME_CHANGED = "NeedsBeginFrameChanged", e.BEGIN_MAIN_THREAD_FRAME = "BeginMainThreadFrame", e.ACTIVATE_LAYER_TREE = "ActivateLayerTree", e.DRAW_FRAME = "DrawFrame", e.DROPPED_FRAME = "DroppedFrame", e.FRAME_STARTED_LOADING = "FrameStartedLoading", e.PIPELINE_REPORTER = "PipelineReporter", e.SCREENSHOT = "Screenshot", e.RESOURCE_WILL_SEND_REQUEST = "ResourceWillSendRequest", e.RESOURCE_SEND_REQUEST = "ResourceSendRequest", e.RESOURCE_RECEIVE_RESPONSE = "ResourceReceiveResponse", e.RESOURCE_RECEIVE_DATA = "ResourceReceivedData", e.RESOURCE_FINISH = "ResourceFinish", e.RESOURCE_MARK_AS_CACHED = "ResourceMarkAsCached", e.WEB_SOCKET_SEND_HANDSHAKE_REQUEST = "WebSocketSendHandshakeRequest", e.WEB_SOCKET_RECEIVE_HANDSHAKE_REQUEST = "WebSocketReceiveHandshakeResponse", e.CPU_PROFILE = "CpuProfile", e.PROFILE = "Profile", e.START_PROFILING = "CpuProfiler::StartProfiling", e.PROFILE_CHUNK = "ProfileChunk", e.UPDATE_COUNTERS = "UpdateCounters", e.JS_SAMPLE = "JSSample", e.ANIMATION = "Animation", e.PARSE_AUTHOR_STYLE_SHEET = "ParseAuthorStyleSheet", e.EMBEDDER_CALLBACK = "EmbedderCallback", e.SET_LAYER_TREE_ID = "SetLayerTreeId", e.TRACING_STARTED_IN_PAGE = "TracingStartedInPage", e.TRACING_STARTED_IN_BROWSER = "TracingStartedInBrowser", e.TRACING_SESSION_ID_FOR_WORKER = "TracingSessionIdForWorker", e.LAZY_PIXEL_REF = "LazyPixelRef", e.LAYER_TREE_HOST_IMPL_SNAPSHOT = "cc::LayerTreeHostImpl", e.PICTURE_SNAPSHOT = "cc::Picture", e.DISPLAY_ITEM_LIST_SNAPSHOT = "cc::DisplayItemList", e.INPUT_LATENCY_MOUSE_MOVE = "InputLatency::MouseMove", e.INPUT_LATENCY_MOUSE_WHEEL = "InputLatency::MouseWheel", e.IMPL_SIDE_FLING = "InputHandlerProxy::HandleGestureFling::started", e.SCHEDULE_POST_MESSAGE = "SchedulePostMessage", e.HANDLE_POST_MESSAGE = "HandlePostMessage", e.RENDER_FRAME_IMPL_CREATE_CHILD_FRAME = "RenderFrameImpl::createChildFrame", e.LAYOUT_IMAGE_UNSIZED = "LayoutImageUnsized", e.DOM_LOADING = "domLoading", e.BEGIN_REMOTE_FONT_LOAD = "BeginRemoteFontLoad", e.REMOTE_FONT_LOADED = "RemoteFontLoaded", e.ANIMATION_FRAME = "AnimationFrame", e.ANIMATION_FRAME_PRESENTATION = "AnimationFrame::Presentation", e.SYNTHETIC_NETWORK_REQUEST = "SyntheticNetworkRequest", e.USER_TIMING_MEASURE = "UserTiming::Measure", e.LINK_PRECONNECT = "LinkPreconnect", e.PRELOAD_RENDER_BLOCKING_STATUS_CHANGE = "PreloadRenderBlockingStatusChange", e;
}({}), br = {
	Console: "blink.console",
	UserTiming: "blink.user_timing",
	Loading: "loading"
};
function xr(e) {
	return "idle" in e && typeof e.idle == "boolean";
}
function Sr(e) {
	return e.cat === "disabled-by-default-devtools.target-rundown";
}
function Cr(e) {
	return e.cat === "disabled-by-default-devtools.v8-source-rundown" && e.name === "ScriptCatchup";
}
function wr(e) {
	return e.cat === "disabled-by-default-devtools.v8-source-rundown-sources" && e.name === "ScriptCatchup";
}
function Tr(e) {
	return e.cat === "disabled-by-default-devtools.v8-source-rundown-sources" && e.name === "LargeScriptCatchup";
}
function Er(e) {
	return e.cat === "disabled-by-default-devtools.v8-source-rundown-sources";
}
function Dr(e) {
	return e.name === "PreloadRenderBlockingStatusChange";
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/handlers/helpers.ts
function Or(e, t) {
	let n = Ar(e);
	if (n) return kr(n, t);
}
function kr(e, t) {
	let n = t.entityByUrlCache.get(e);
	if (n) return n;
	let r = ne.getEntity(e) ?? jr(t.createdEntityCache, e);
	return r && t.entityByUrlCache.set(e, r), r;
}
function Ar(e, t) {
	if (k(e)) return e.callFrame.url;
	if (wn(e)) return e.args.data.url;
	if (yr(e) && e.args) return e.args.data.stylesheetUrl;
	if (e.args?.data?.stackTrace && e.args.data.stackTrace.length > 0) return e.args.data.stackTrace[0].url;
	if (Un(e)) return e.args.beginData.url;
	if (t) {
		if (bt(e)) {
			let n = t.ImagePainting.paintImageForEvent.get(e);
			return n ? Ar(n, t) : null;
		}
		if (vt(e) && e.args?.LazyPixelRef) {
			let n = t.ImagePainting.paintImageByDrawLazyPixelRef.get(e.args.LazyPixelRef);
			return n ? Ar(n, t) : null;
		}
	}
	if (e.args?.data?.url) return e.args.data.url;
	let n = e.args?.data?.requestId;
	if (t && n) {
		let e = t.NetworkRequests.byId.get(n)?.args.data.url;
		if (e) return e;
	}
	return null;
}
function jr(e, t) {
	if (t.startsWith("chrome-extension:")) return Nr(e, t);
	if (!t.startsWith("http")) return;
	let n = ne.getRootDomain(t);
	if (!n) return;
	if (e.has(n)) return e.get(n);
	let r = {
		name: n,
		company: n,
		category: "",
		categories: [],
		domains: [n],
		averageExecutionTime: 0,
		totalExecutionTime: 0,
		totalOccurrences: 0,
		isUnrecognized: !0
	};
	return e.set(n, r), r;
}
function Mr(e) {
	return e.protocol + "//" + e.host;
}
function Nr(e, t, n) {
	let r = Mr(new URL(t)), i = new URL(r).host, a = n || i, o = e.get(r);
	if (o) return o;
	let s = {
		name: a,
		company: a,
		category: "Chrome Extension",
		homepage: "https://chromewebstore.google.com/detail/" + i,
		categories: [],
		domains: [r],
		averageExecutionTime: 0,
		totalExecutionTime: 0,
		totalOccurrences: 0
	};
	return e.set(r, s), s;
}
function Pr(e, t) {
	if (t.entityByEvent.has(e)) return;
	let n = Or(e, t);
	if (!n) return;
	let r = t.eventsByEntity.get(n);
	r ? r.push(e) : t.eventsByEntity.set(n, [e]), t.entityByEvent.set(e, n);
}
function Fr(e, t, n) {
	let r = Or(e, t);
	if (!r) return;
	let i = [e, ...Object.values(n).flat()], a = t.eventsByEntity.get(r);
	a ? a.push(...i) : t.eventsByEntity.set(r, i);
	for (let e of i) t.entityByEvent.set(e, r);
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/helpers/SyntheticEvents.ts
var Ir = null, j = class e {
	#e = [];
	#t = [];
	static activate(e) {
		Ir = e;
	}
	static createAndActivate(t) {
		let n = new e(t);
		return e.activate(n), n;
	}
	static getActiveManager() {
		if (!Ir) throw Error("Attempted to get a SyntheticEventsManager without initializing");
		return Ir;
	}
	static reset() {
		Ir = null;
	}
	static registerSyntheticEvent(t) {
		try {
			return e.getActiveManager().#n(t);
		} catch {
			return t;
		}
	}
	constructor(e) {
		this.#t = e;
	}
	#n(e) {
		let t = this.#t.indexOf(e.rawSourceEvent);
		if (t < 0) throw Error("Attempted to register a synthetic event paired to an unknown raw event.");
		let n = e;
		return this.#e[t] = n, n;
	}
	syntheticEventForRawEventIndex(e) {
		let t = this.#e.at(e);
		if (!t) throw Error(`Attempted to get a synthetic event from an unknown raw event index: ${e}`);
		return t;
	}
	getSyntheticTraces() {
		return this.#e;
	}
	getRawTraceEvents() {
		return this.#t;
	}
}, M = (e) => C(e * 1e3), Lr = (e) => w(e * 1e3), Rr = (e) => M(Lr(e)), N = (e) => w(e / 1e3), zr = (e) => ge(e / 1e3 / 1e3);
function Br(e, t, n, r, i) {
	let a = e.ts - t.min;
	if (e.name === A.MARK_LCP_CANDIDATE_FOR_SOFT_NAVIGATION && e.args?.data?.performanceTimelineNavigationId) {
		let t = r.get(e.args.data.performanceTimelineNavigationId);
		t && (a = e.ts - t.ts);
	} else if (e.args?.data?.navigationId) {
		let t = n.get(e.args.data.navigationId);
		t && (a = e.ts - t.ts);
	} else if (e.args?.data?.frame) {
		let t = oi(e, e.args.data.frame, i);
		t && (a = e.ts - t.ts);
	}
	return C(a);
}
function Vr(e, t, n) {
	let r = e.min - e.range * (n / 100) / 2, i = e.max + e.range * (n / 100) / 2;
	if (i - r < 1e3) {
		let t = (e.min + e.max) / 2;
		r = t - 500, i = t + 500;
	}
	return r = Math.max(r, t.min), i = Math.min(i, t.max), {
		min: C(r),
		max: C(i),
		range: C(i - r)
	};
}
function P(e) {
	return {
		startTime: e.ts,
		endTime: e.ts + (e.dur ?? 0),
		duration: e.dur || 0
	};
}
function Hr(e) {
	return {
		startTime: e.ts / 1e3,
		endTime: (e.ts + (e.dur ?? 0)) / 1e3,
		duration: (e.dur || 0) / 1e3
	};
}
function Ur(e) {
	return {
		min: N(e.min),
		max: N(e.max),
		range: N(e.range)
	};
}
function Wr(e) {
	return {
		min: N(e.min),
		max: N(e.max),
		range: N(e.range)
	};
}
function Gr(e, t) {
	return {
		min: M(e),
		max: M(t),
		range: C(M(t) - M(e))
	};
}
function F(e, t) {
	return {
		min: e,
		max: t,
		range: t - e
	};
}
function Kr(e) {
	return {
		min: e.ts,
		max: e.ts + (e.dur ?? 0),
		range: e.dur ?? 0
	};
}
function qr(e) {
	switch (e.type) {
		case "ENTRY_LABEL":
		case "ENTRY_OUTLINE":
		case "ENTRY_SELECTED": return Kr(e.entry);
		case "TIMESPAN_BREAKDOWN": {
			let t = e.sections.map((e) => e.bounds);
			return e.entry && t.push(Kr(e.entry)), Jr(t);
		}
		case "CANDY_STRIPED_TIME_RANGE":
		case "TIME_RANGE": return structuredClone(e.bounds);
		case "ENTRIES_LINK": {
			let t = Kr(e.entryFrom);
			return e.entryTo ? Jr([t, Kr(e.entryTo)]) : t;
		}
		case "TIMESTAMP_MARKER": return F(e.timestamp, e.timestamp);
		case "TIMINGS_MARKER": return F(e.adjustedTimestamp, e.adjustedTimestamp);
		case "BOTTOM_INFO_BAR": return null;
		default: te(e, `Unexpected overlay ${e}`);
	}
}
function Jr(e) {
	if (!e.length) return null;
	let t = structuredClone(e[0]);
	for (let n of e.slice(1)) t.min = Math.min(t.min, n.min), t.max = Math.max(t.max, n.max);
	return t.range = t.max - t.min, t;
}
function Yr(e) {
	let { min: t, max: n } = e.bounds, { min: r, max: i } = e.timeRange;
	return t <= i && n >= r;
}
function I(e, t) {
	let n = e.ts;
	return n <= t.max && t.min < n + (e.dur ?? 0);
}
function Xr(e, t) {
	return t >= e.min && t <= e.max;
}
function Zr(e) {
	return e.window.min >= e.bounds.min && e.window.max <= e.bounds.max;
}
function Qr(e, t) {
	return e.min === t.min && e.max === t.max;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/helpers/Trace.ts
function $r(e) {
	if (e.args?.data?.stackTrace) return e.args.data.stackTrace;
	if (e.args?.stackTrace) return e.args.stackTrace;
	if (Ct(e)) return e.args.beginData?.stackTrace || null;
	if (wt(e)) return e.args.beginData.stackTrace ?? null;
	if (fr(e)) {
		let t = e.args.data;
		if (!t) return null;
		let { columnNumber: n, lineNumber: r, url: i, scriptId: a, functionName: o } = t;
		return r === void 0 || o === void 0 || n === void 0 || a === void 0 || i === void 0 ? null : [{
			columnNumber: n,
			lineNumber: r,
			url: i,
			scriptId: a,
			functionName: o
		}];
	}
	if (k(e)) {
		let t = e.callFrame;
		if (!t) return null;
		let { columnNumber: n, lineNumber: r, url: i, scriptId: a, functionName: o } = t;
		return r === void 0 || o === void 0 || n === void 0 || a === void 0 || i === void 0 ? null : [{
			columnNumber: n,
			lineNumber: r,
			url: i,
			scriptId: a,
			functionName: o
		}];
	}
	return null;
}
function ei(e) {
	let t = f.fromString(e);
	return t ? t.host.startsWith("www.") ? t.host.slice(4) : t.host : null;
}
function ti(e, t) {
	let { tid: n, pid: r } = e, i = t.get(r);
	i ||= /* @__PURE__ */ new Map();
	let a = i.get(n);
	a ||= [], a.push(e), i.set(e.tid, a), t.set(e.pid, i);
}
function ni(e, t, n, r) {
	return e < t ? -1 : e > t ? 1 : n > r ? -1 : +(n < r);
}
function ri(e, t) {
	let n = e.ts, r = t.ts, i = e.dur ?? 0, a = t.dur ?? 0;
	return ni(n, r, n + i, r + a) || (k(e) && !k(t) ? -1 : k(t) && !k(e) ? 1 : 0);
}
function L(e) {
	e.sort(ri);
}
function ii(e, t) {
	let n = [], r = 0, i = 0;
	for (; r < e.length && i < t.length;) {
		let a = e[r], o = t[i], s = ri(a, o);
		s <= 0 && (n.push(a), r++), s === 1 && (n.push(o), i++);
	}
	for (; r < e.length;) n.push(e[r++]);
	for (; i < t.length;) n.push(t[i++]);
	return n;
}
function ai(e, t) {
	try {
		let n = JSON.parse(e);
		return !(t in n) || !se(n[t]) ? null : n[t];
	} catch {
		return null;
	}
}
function oi(e, t, n) {
	let r = n.get(t);
	if (!r || t === "") return null;
	let i = c(r, (t) => t.ts <= e.ts);
	return i === null ? null : r[i];
}
function si(e) {
	return e.id ?? e.id2?.global ?? e.id2?.local;
}
function ci(e, t, n) {
	let r = n.get(e);
	if (!r) return null;
	for (let e of r.values()) for (let n of e) if (!(n.window.min > t || n.window.max < t)) return n.frame.url;
	return null;
}
function li(e, t, n, r, i, a) {
	return {
		cat: "",
		name: "ProfileCall",
		nodeId: e.id,
		args: {},
		ph: T.COMPLETE,
		pid: i,
		tid: a,
		ts: r,
		dur: C(0),
		callFrame: e.callFrame,
		sampleIndex: n,
		profileId: t
	};
}
function ui(e) {
	L(e);
	let t = [], n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
	for (let i of e) {
		let e = di(i);
		if (e !== void 0) {
			if (Ze(i)) {
				let t = n.get(e) ?? [];
				t.push(i), n.set(e, t);
			} else if ($e(i)) {
				let t = r.get(e) ?? [];
				t.push(i), r.set(e, t);
			} else if (Qe(i)) {
				let a = (n.get(e) ?? []).pop();
				if (!a) continue;
				let o = r.get(e) ?? [], s = [];
				for (; o.length > 0 && o[0].ts >= a.ts;) {
					let e = o.pop();
					e && s.push(e);
				}
				let c = {
					begin: a,
					end: i,
					instant: s,
					syntheticId: e
				};
				t.push(c);
			}
		}
	}
	for (let [e, i] of n) {
		let n = i.pop();
		if (!n) continue;
		let a = r.get(e);
		a?.length && t.push({
			syntheticId: e,
			begin: n,
			end: null,
			instant: a
		});
	}
	return t;
}
function di(e) {
	let t = si(e);
	return t && `${e.cat}:${t}:${e.name}`;
}
function fi(e) {
	let t = [];
	for (let n of e) {
		let e = n.syntheticId, r = n.begin, i = n.end, a = n.instant;
		if (!r || !(i || a)) continue;
		let o = {
			beginEvent: r,
			endEvent: i,
			instantEvents: a
		};
		function s(t) {
			let n = t.instantEvents ? t.instantEvents.some((t) => e === di(t)) : !1, r = t.endEvent ? e === di(t.endEvent) : !1;
			return !!e && (n || r);
		}
		if (!s(o)) continue;
		let c = i || r, l = j.registerSyntheticEvent({
			rawSourceEvent: o.beginEvent,
			cat: c.cat,
			ph: c.ph,
			pid: c.pid,
			tid: c.tid,
			id: e,
			name: r.name,
			dur: C(c.ts - r.ts),
			ts: r.ts,
			args: { data: o }
		});
		l.dur < 0 || t.push(l);
	}
	return L(t), t;
}
function pi(e) {
	return fi(ui(e));
}
function mi(e) {
	let t = yi(e), { lineNumber: n, columnNumber: r } = t;
	switch (e.name) {
		case A.FUNCTION_CALL:
		case A.EVALUATE_SCRIPT:
		case A.COMPILE:
		case A.CACHE_SCRIPT: return {
			lineNumber: typeof n == "number" ? n - 1 : void 0,
			columnNumber: typeof r == "number" ? r - 1 : void 0
		};
		case A.PROFILE_CALL: {
			let t = e.callFrame;
			return {
				lineNumber: typeof n == "number" ? t.lineNumber - 1 : void 0,
				columnNumber: typeof r == "number" ? t.columnNumber - 1 : void 0
			};
		}
		default: return t;
	}
}
function hi(e) {
	let t = $r(e);
	if (!t) return null;
	switch (e.name) {
		case A.SCHEDULE_STYLE_RECALCULATION:
		case A.INVALIDATE_LAYOUT:
		case A.FUNCTION_CALL:
		case A.LAYOUT:
		case A.RECALC_STYLE: return t.map(vi);
		default: return Nn(e) || ce(e) ? t.map(vi) : t;
	}
}
function gi(e) {
	let t = $r(e);
	if (!t || t.length === 0) return null;
	switch (e.name) {
		case A.SCHEDULE_STYLE_RECALCULATION:
		case A.INVALIDATE_LAYOUT:
		case A.FUNCTION_CALL:
		case A.LAYOUT:
		case A.RECALC_STYLE: return vi(t[0]);
		default: return Nn(e) || ce(e) ? vi(t[0]) : t[0];
	}
}
function _i(e) {
	return k(e) ? e.callFrame : gi(e) || null;
}
function vi(e) {
	let t = { ...e };
	return t.lineNumber = e.lineNumber && e.lineNumber - 1, t.columnNumber = e.columnNumber && e.columnNumber - 1, t;
}
function yi(e) {
	if (!e.args?.data) return {};
	let t, n;
	return "lineNumber" in e.args.data && typeof e.args.data.lineNumber == "number" && (t = e.args.data.lineNumber), "columnNumber" in e.args.data && typeof e.args.data.columnNumber == "number" && (n = e.args.data.columnNumber), {
		lineNumber: t,
		columnNumber: n
	};
}
function bi(e) {
	return e.args && "beginData" in e.args && typeof e.args.beginData == "object" && e.args.beginData !== null && "frame" in e.args.beginData && typeof e.args.beginData.frame == "string" ? e.args.beginData.frame : e.args?.data?.frame ? e.args.data.frame : null;
}
var xi = "disabled-by-default-devtools.timeline";
function Si(e) {
	return e.cat.includes(xi) && e.name === A.RUN_TASK;
}
function Ci(e) {
	return e.startsWith("extensions:") || e.startsWith("chrome-extension:");
}
function wi(e, t) {
	let n = u(e, t, (e, t) => e - t.ts) - 1;
	for (; n > 0 && !Si(e[n]);) n--;
	return Math.max(n, 0);
}
function Ti(e, t, n) {
	let r = [], i = wi(e, t);
	for (let t = i; t < e.length; t++) {
		let i = e[t];
		Ct(i) && (i.ts >= (n || Infinity) || r.push(i));
	}
	return r;
}
function Ei(e, t) {
	let n = c(e, (e) => e.ts < t);
	return n === null ? null : e[n];
}
function Di(e, t) {
	let n = t.startTime ?? C(0), r = t.endTime || C(Infinity), i = t.ignoreAsyncEvents !== !1, a = [], o = wi(e, n);
	for (let s = o; s < e.length; s++) {
		let o = e[s], c = P(o);
		if (c.endTime < n) continue;
		if (c.startTime > r) break;
		if (i && ye(o.ph) || be(o.ph)) continue;
		let l = a.at(-1), u = l ? P(l).endTime : null;
		for (; l && u && u <= c.startTime;) a.pop(), t.onEndEvent(l), l = a.at(-1), u = l ? P(l).endTime : null;
		(!t.eventFilter || t.eventFilter(o)) && (c.duration ? (t.onStartEvent(o), a.push(o)) : t.onInstantEvent && t.onInstantEvent(o));
	}
	for (; a.length;) {
		let e = a.pop();
		e && t.onEndEvent(e);
	}
}
var Oi = /* @__PURE__ */ new Map();
function ki(e, t) {
	let n = Oi.get(e.cat);
	return n ||= new Set(e.cat.split(",") || []), n.has(t);
}
function Ai(e, t) {
	return e.columnNumber === t.columnNumber && e.lineNumber === t.lineNumber && String(e.scriptId) === t.scriptId && e.url === t.url && e.functionName === t.functionName;
}
function ji(e) {
	return e.args ? "beginData" in e.args ? e.args.beginData.sampleTraceId ?? null : e.args?.sampleTraceId ?? e.args?.data?.sampleTraceId ?? null : null;
}
var Mi = /* @__PURE__ */ new Set([
	A.ABORT_POST_TASK_CALLBACK,
	A.ANIMATION,
	A.ASYNC_TASK,
	A.BACKGROUND_DESERIALIZE,
	A.CACHE_MODULE,
	A.CACHE_SCRIPT,
	A.CANCEL_ANIMATION_FRAME,
	A.CANCEL_IDLE_CALLBACK,
	A.COMMIT,
	A.COMPILE_CODE,
	A.COMPILE_MODULE,
	A.COMPILE,
	A.COMPOSITE_LAYERS,
	A.COMPUTE_INTERSECTION,
	A.CONSOLE_TIME,
	A.CPPGC_SWEEP,
	A.CRYPTO_DO_DECRYPT_REPLY,
	A.CRYPTO_DO_DECRYPT,
	A.CRYPTO_DO_DIGEST_REPLY,
	A.CRYPTO_DO_DIGEST,
	A.CRYPTO_DO_ENCRYPT_REPLY,
	A.CRYPTO_DO_ENCRYPT,
	A.CRYPTO_DO_SIGN_REPLY,
	A.CRYPTO_DO_SIGN,
	A.CRYPTO_DO_VERIFY_REPLY,
	A.CRYPTO_DO_VERIFY,
	A.DECODE_IMAGE,
	A.EMBEDDER_CALLBACK,
	A.EVALUATE_MODULE,
	A.EVALUATE_SCRIPT,
	A.EVENT_DISPATCH,
	A.EVENT_TIMING,
	A.FINALIZE_DESERIALIZATION,
	A.FIRE_ANIMATION_FRAME,
	A.FIRE_IDLE_CALLBACK,
	A.FUNCTION_CALL,
	A.GC_COLLECT_GARBARGE,
	A.GC,
	A.GPU_TASK,
	A.HANDLE_POST_MESSAGE,
	A.HIT_TEST,
	A.JS_SAMPLE,
	A.LAYERIZE,
	A.LAYOUT,
	A.MAJOR_GC,
	A.MINOR_GC,
	A.OPTIMIZE_CODE,
	A.PAINT_SETUP,
	A.PAINT,
	A.PARSE_AUTHOR_STYLE_SHEET,
	A.PARSE_HTML,
	A.PRE_PAINT,
	A.PROFILE_CALL,
	A.PROGRAM,
	A.RASTER_TASK,
	A.REQUEST_ANIMATION_FRAME,
	A.REQUEST_IDLE_CALLBACK,
	A.RESOURCE_FINISH,
	A.RESOURCE_RECEIVE_DATA,
	A.RESOURCE_RECEIVE_RESPONSE,
	A.RESOURCE_SEND_REQUEST,
	A.RESOURCE_WILL_SEND_REQUEST,
	A.RUN_MICROTASKS,
	A.RUN_POST_TASK_CALLBACK,
	A.RUN_TASK,
	A.SCHEDULE_POST_MESSAGE,
	A.SCHEDULE_POST_TASK_CALLBACK,
	A.SCHEDULE_STYLE_RECALCULATION,
	A.SCROLL_LAYER,
	A.START_PROFILING,
	A.STREAMING_COMPILE_SCRIPT_PARSING,
	A.STREAMING_COMPILE_SCRIPT_WAITING,
	A.STREAMING_COMPILE_SCRIPT,
	A.SYNTHETIC_LAYOUT_SHIFT_CLUSTER,
	A.SYNTHETIC_LAYOUT_SHIFT,
	A.TIME_STAMP,
	A.TIMER_FIRE,
	A.TIMER_INSTALL,
	A.TIMER_REMOVE,
	A.UPDATE_LAYER_TREE,
	A.RECALC_STYLE,
	A.USER_TIMING,
	A.V8_CONSOLE_RUN_TASK,
	A.WASM_CACHED_MODULE,
	A.WASM_COMPILED_MODULE,
	A.WASM_MODULE_CACHE_HIT,
	A.WASM_MODULE_CACHE_INVALID,
	A.WASM_STREAM_FROM_RESPONSE_CALLBACK,
	A.WEB_SOCKET_CREATE,
	A.WEB_SOCKET_DESTROY,
	A.WEB_SOCKET_RECEIVE_HANDSHAKE_REQUEST,
	A.WEB_SOCKET_RECEIVE,
	A.WEB_SOCKET_SEND_HANDSHAKE_REQUEST,
	A.WEB_SOCKET_SEND,
	A.XHR_LOAD,
	A.XHR_READY_STATE_CHANGED
]), Ni = 0, Pi = () => ++Ni, Fi = () => ({
	roots: /* @__PURE__ */ new Set(),
	maxDepth: 0
}), Ii = (e, t) => ({
	entry: e,
	id: t,
	parent: null,
	children: [],
	depth: 0
});
function Li(e, t) {
	let n = /* @__PURE__ */ new Map(), r = [];
	Ni = -1;
	let i = Fi();
	for (let a = 0; a < e.length; a++) {
		let o = e[a];
		if (t && !t.filter.has(o.name)) continue;
		let s = o.dur || 0, c = Ii(o, Pi());
		if (r.length === 0) {
			i.roots.add(c), c.selfTime = C(s), r.push(c), i.maxDepth = Math.max(i.maxDepth, r.length), n.set(o, c);
			continue;
		}
		let l = r.at(-1);
		if (l === void 0) throw Error("Impossible: no parent node found in the stack");
		let u = l.entry, d = o.ts, f = u.ts, p = u.dur || 0, m = d + s, h = f + p;
		if (d < f) throw Error("Impossible: current event starts before the parent event");
		if (d >= h) {
			r.pop(), a--, Ni--;
			continue;
		}
		m > h || (c.depth = r.length, c.parent = l, l.children.push(c), c.selfTime = C(s), l.selfTime !== void 0 && (l.selfTime = C(l.selfTime - (o.dur || 0))), r.push(c), i.maxDepth = Math.max(i.maxDepth, r.length), n.set(o, c));
	}
	return {
		tree: i,
		entryToNode: n
	};
}
function Ri(e, t, n, r, i, a) {
	for (let o of t.roots) zi(e, o, n, r, i, a);
}
function zi(e, t, n, r, i, a) {
	if ((!i || Bi(t, i)) && !(a !== void 0 && C(t.entry.ts + C(t.entry.dur ?? 0)) < a)) {
		n(t.entry);
		for (let o of t.children) zi(e, o, n, r, i, a);
		r(t.entry);
	}
}
function Bi(e, t) {
	return I(e.entry, t);
}
function Vi(e) {
	let t = [];
	for (let n of e) {
		let e = n.ts, r = n.ts + (n.dur ?? 0), i = t.at(-1);
		if (i === void 0) {
			t.push(n);
			continue;
		}
		let a = i.ts + (i.dur ?? 0);
		for (; t.length && e >= a && (t.pop(), i = t.at(-1), i !== void 0);) a = i.ts + (i.dur ?? 0);
		if (t.length && r > a) return !1;
		t.push(n);
	}
	return !0;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/helpers/Extensions.ts
function Hi(e, t, n) {
	let r = /* @__PURE__ */ new Map();
	for (let t of e) {
		let e = t.devtoolsObj.trackGroup || `track-name-${t.devtoolsObj.track}`, n = S(r, e, () => ({
			name: t.devtoolsObj.trackGroup || t.devtoolsObj.track,
			isTrackGroup: !!t.devtoolsObj.trackGroup,
			entriesByTrack: { [t.devtoolsObj.track]: [] }
		}));
		n.entriesByTrack[t.devtoolsObj.track] || (n.entriesByTrack[t.devtoolsObj.track] = []), n.entriesByTrack[t.devtoolsObj.track].push(t);
	}
	for (let e of r.values()) {
		for (let t of Object.values(e.entriesByTrack)) if (L(t), Vi(t)) for (let [e, r] of Li(t).entryToNode) n.set(e, r);
		t.push(e);
	}
	return {
		extensionTrackData: t,
		entryToNode: n
	};
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/helpers/Network.ts
var Ui = /* @__PURE__ */ new Set([
	"non_blocking",
	"dynamically_injected_non_blocking",
	"potentially_blocking"
]);
function Wi(e) {
	return !Ui.has(e.args.data.renderBlocking);
}
var Gi = /* @__PURE__ */ new Set([
	x.ResourcePriority.VeryHigh,
	x.ResourcePriority.High,
	x.ResourcePriority.Medium
]);
function Ki(e) {
	return Gi.has(e.args.data.priority);
}
var qi = /* @__PURE__ */ new Set([
	200,
	203,
	206
]), Ji = /* @__PURE__ */ new Set([
	x.ResourceType.Font,
	x.ResourceType.Image,
	x.ResourceType.Media,
	x.ResourceType.Script,
	x.ResourceType.Stylesheet
]), Yi = [
	"blob",
	"data",
	"intent",
	"file",
	"filesystem",
	"chrome-extension"
];
function Xi(e) {
	if (!e) return null;
	let t = e.split(",").map((e) => e.trim()), n = {};
	for (let e of t) {
		let [t, r] = e.split("=").map((e) => e.trim());
		switch (t) {
			case "max-age": {
				let e = parseInt(r, 10);
				isNaN(e) || (n["max-age"] = e);
				break;
			}
			case "no-cache":
				n["no-cache"] = !0;
				break;
			case "no-store":
				n["no-store"] = !0;
				break;
			case "must-revalidate":
				n["must-revalidate"] = !0;
				break;
			case "private": n.private = !0;
		}
	}
	return n;
}
var Zi = ["localhost", "127.0.0.1"];
function Qi(e) {
	try {
		let t = new URL(e.args.data.url).hostname;
		return Zi.includes(t) || t.endsWith(".localhost");
	} catch {
		return !1;
	}
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/helpers/SamplesIntegrator.ts
var $i = /* @__PURE__ */ e({ SamplesIntegrator: () => ea }), ea = class e {
	#e = [];
	#t = [];
	#n;
	#r;
	#i = [];
	#a = !1;
	#o;
	#s = /* @__PURE__ */ new Map();
	#c;
	#l;
	jsSampleEvents = [];
	constructor(e, t, n, r, i) {
		this.#o = e, this.#r = r, this.#n = n, this.#c = i || re(), this.#l = t;
	}
	buildProfileCalls(e) {
		let t = ii(e, this.callsFromProfileSamples()), n = [];
		for (let e = 0; e < t.length; e++) {
			let r = t[e];
			if (r.ph === T.INSTANT && !ji(r)) continue;
			if (n.length === 0) {
				if (k(r)) {
					this.#d(r);
					continue;
				}
				n.push(r), this.#u(r);
				continue;
			}
			let i = n.at(-1);
			if (i !== void 0) {
				if (r.ts >= i.ts + (i.dur || 0)) {
					this.#f(i), n.pop(), e--;
					continue;
				}
				if (k(r)) {
					this.#d(r, i);
					continue;
				}
				this.#u(r), n.push(r);
			}
		}
		for (; n.length;) {
			let e = n.pop();
			e && this.#f(e);
		}
		return L(this.jsSampleEvents), this.#e;
	}
	#u(e) {
		(e.name === A.RUN_MICROTASKS || e.name === A.RUN_TASK) && (this.#i = [], this.#g(0, e.ts), this.#a = !1), this.#a &&= (this.#g(this.#i.pop() || 0, e.ts), !1), this.#h(e), this.#i.push(this.#t.length);
	}
	#d(e, t) {
		if (t && gr(t) || this.#a) this.#h(e);
		else if (k(e) && this.#t.length === 0) {
			this.#a = !0;
			let t = this.#t.length;
			this.#h(e), this.#i.push(t);
		}
	}
	#f(e) {
		let t = C(e.ts + (e.dur ?? 0));
		this.#g(this.#i.pop() || 0, t);
	}
	callsFromProfileSamples() {
		let e = this.#o.samples, t = this.#o.timestamps;
		if (!e) return [];
		let n = [], r;
		for (let i = 0; i < e.length; i++) {
			let e = this.#o.nodeByIndex(i), a = M(w(t[i]));
			if (!e) continue;
			let o = li(e, this.#l, i, a, this.#n, this.#r);
			if (n.push(o), this.#c.debugMode) {
				let e = this.#o.traceIds?.[i];
				this.jsSampleEvents.push(this.#_(o, a, e));
			}
			if (e.id === this.#o.gcNode?.id && r) {
				this.#s.set(o, r);
				continue;
			}
			r = e;
		}
		return n;
	}
	#p(e, t) {
		let n = this.#o.nodeById(e.nodeId), r = n?.id === this.#o.gcNode?.id;
		if (r && (n = this.#s.get(e) || null), !n) return [];
		let i = Array(n.depth + 1 + Number(r)), a = i.length - 1;
		for (r && (i[a--] = e); n;) i[a--] = li(n, e.profileId, e.sampleIndex, t ?? e.ts, this.#n, this.#r), n = n.parent;
		return i;
	}
	#m(e, t) {
		let n = this.#o.traceIds?.[e], r = n && this.#o.nodeById(n), i = r && li(r, this.#l, -1, t, this.#n, this.#r);
		return i ? (this.#c.debugMode && this.jsSampleEvents.push(this.#_(i, t, e)), this.#p(i)) : null;
	}
	#h(t) {
		let n = this.#t;
		k(t) && (n = this.#p(t));
		let r = ji(t), i = r && this.#m(r, t.ts);
		i && (n = i), e.filterStackFrames(n, this.#c);
		let a = t.ts + (t.dur || 0), o = Math.min(n.length, this.#t.length), s;
		for (s = this.#i.at(-1) || 0; s < o; ++s) {
			let t = n[s].callFrame, r = this.#t[s].callFrame;
			if (!e.framesAreEqual(t, r)) break;
			this.#t[s].dur = C(Math.max(this.#t[s].dur || 0, a - this.#t[s].ts));
		}
		for (this.#g(s, t.ts); s < n.length; ++s) {
			let e = n[s];
			e.nodeId !== this.#o.programNode?.id && e.nodeId !== this.#o.root?.id && e.nodeId !== this.#o.idleNode?.id && e.nodeId !== this.#o.gcNode?.id && (this.#t.push(e), this.#e.push(e));
		}
	}
	#g(e, t) {
		if (this.#i.length) {
			let n = this.#i.at(-1);
			n && e < n && (console.error(`Child stack is shallower (${e}) than the parent stack (${n}) at ${t}`), e = n);
		}
		this.#t.length < e && (console.error(`Trying to truncate higher than the current stack size at ${t}`), e = this.#t.length);
		for (let e = 0; e < this.#t.length; ++e) this.#t[e].dur = C(Math.max(t - this.#t[e].ts, 0));
		this.#t.length = e;
	}
	#_(e, t, n) {
		return {
			name: A.JS_SAMPLE,
			cat: "devtools.timeline",
			args: { data: {
				traceId: n,
				stackTrace: this.#p(e).map((e) => e.callFrame)
			} },
			ph: T.INSTANT,
			ts: t,
			dur: C(0),
			pid: this.#n,
			tid: this.#r
		};
	}
	static framesAreEqual(e, t) {
		return e.scriptId === t.scriptId && e.functionName === t.functionName && e.lineNumber === t.lineNumber;
	}
	static showNativeName(t, n) {
		return n && !!e.nativeGroup(t);
	}
	static nativeGroup(t) {
		return t.startsWith("Parse") ? e.NativeGroups.PARSE : t.startsWith("Compile") || t.startsWith("Recompile") ? e.NativeGroups.COMPILE : null;
	}
	static isNativeRuntimeFrame(e) {
		return e.url === "native V8Runtime";
	}
	static filterStackFrames(t, n) {
		if (n.showAllEvents) return;
		let r = 0;
		for (let n = 0; n < t.length; ++n) {
			let i = t[n].callFrame;
			e.isNativeRuntimeFrame(i) || (t[r++] = t[n]);
		}
		t.length = r;
	}
	static createFakeTraceFromCpuProfile(e, t) {
		return e ? {
			traceEvents: [{
				cat: "disabled-by-default-devtools.timeline",
				name: A.CPU_PROFILE,
				ph: T.COMPLETE,
				pid: jt(1),
				tid: t,
				ts: C(e.startTime),
				dur: C(e.endTime - e.startTime),
				args: { data: { cpuProfile: e } },
				id: "0x1"
			}],
			metadata: { dataOrigin: le.CPU_PROFILE }
		} : {
			traceEvents: [],
			metadata: {}
		};
	}
	static extractCpuProfileFromFakeTrace(e) {
		let t = e.find((e) => mn(e))?.args.data.cpuProfile;
		if (!t) throw Error("Missing cpuProfile data");
		return t;
	}
};
(function(e) {
	e.NativeGroups = /* @__PURE__ */ function(e) {
		return e.COMPILE = "Compile", e.PARSE = "Parse", e;
	}({});
})(ea ||= {});
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/handlers/AnimationFramesHandler.ts
var ta = /* @__PURE__ */ e({
	data: () => pa,
	deps: () => ma,
	finalize: () => fa,
	handleEvent: () => da,
	handleUserConfig: () => ua,
	reset: () => ca
});
function na(e) {
	return `${e.pid}-${e.tid}`;
}
var ra = /* @__PURE__ */ new Map(), ia = /* @__PURE__ */ new Map(), aa = /* @__PURE__ */ new Map(), oa = [], sa = /* @__PURE__ */ new Map();
function ca() {
	ra = /* @__PURE__ */ new Map(), ia = /* @__PURE__ */ new Map(), oa = [], sa = /* @__PURE__ */ new Map(), aa = /* @__PURE__ */ new Map(), la = !1;
}
var la = !1;
function ua(e) {
	la = e.enableAnimationsFrameHandler;
}
function da(e) {
	if (la) {
		if (et(e)) {
			let t = na(e), n = ra.get(t) ?? [];
			n.push(e), ra.set(t, n);
		} else if (tt(e)) {
			let t = na(e), n = ia.get(t) ?? [];
			n.push(e), ia.set(t, n);
		} else nt(e) && e.args?.id && aa.set(e.args.id, e);
	}
}
async function fa() {
	for (let [e, t] of ra.entries()) {
		let n = ia.get(e);
		if (n) {
			L(t), L(n);
			for (let e = 0; e < t.length; e++) {
				let r = n.at(e);
				if (!r) break;
				let i = t[e], a = j.registerSyntheticEvent({
					rawSourceEvent: i,
					...i,
					dur: C(r.ts - i.ts),
					args: { data: {
						beginEvent: i,
						endEvent: r
					} }
				});
				oa.push(a);
				let o = i.args?.id;
				if (o) {
					let e = aa.get(o);
					e && sa.set(a, e);
				}
			}
		}
	}
}
function pa() {
	return {
		animationFrames: oa,
		presentationForFrame: sa
	};
}
function ma() {
	return ["Meta"];
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/handlers/AnimationHandler.ts
var ha = /* @__PURE__ */ e({
	data: () => xa,
	finalize: () => ba,
	handleEvent: () => ya,
	reset: () => va
}), ga = [], _a = [];
function va() {
	ga = [], _a = [];
}
function ya(e) {
	if (Xt(e)) {
		ga.push(e);
		return;
	}
}
async function ba() {
	let e = pi(ga);
	_a.push(...e);
}
function xa() {
	return { animations: _a };
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/handlers/FlowsHandler.ts
var Sa = /* @__PURE__ */ e({
	data: () => La,
	finalize: () => Ia,
	handleEvent: () => ja,
	reset: () => Aa
}), Ca = /* @__PURE__ */ new Map(), wa = /* @__PURE__ */ new Map(), Ta = /* @__PURE__ */ new Map(), Ea = [], Da = [], Oa = [], ka = "-$-";
function Aa() {
	Oa = [], Ea = [], Da = [], Ca = /* @__PURE__ */ new Map(), wa = /* @__PURE__ */ new Map(), Ta = /* @__PURE__ */ new Map();
}
function ja(e) {
	if (vr(e)) {
		Ea.push(e);
		return;
	}
	Da.push(e);
}
function Ma(e) {
	let t = wa.get(e.ts)?.get(e.pid)?.get(e.tid)?.get(e.cat);
	if (!t) return;
	let { flows: n, bindingParsed: r } = t;
	if (!r) {
		for (let t of n) S(Ta, t, () => /* @__PURE__ */ new Map()).set(e.ts, e);
		t.bindingParsed = !0;
	}
}
function Na(e) {
	let t = Fa(e);
	switch (e.ph) {
		case T.FLOW_START: {
			let n = {
				flowId: e.id,
				times: /* @__PURE__ */ new Map([[e.ts, void 0]])
			};
			Ca.set(t, e.id), Pa(e, n.flowId);
			return;
		}
		case T.FLOW_STEP: {
			let n = Ca.get(t);
			if (n === void 0) return;
			Pa(e, n);
			return;
		}
		case T.FLOW_END: {
			let n = Ca.get(t);
			if (n === void 0) return;
			Pa(e, n), Ca.delete(t);
		}
	}
}
function Pa(e, t) {
	let n = S(wa, e.ts, () => /* @__PURE__ */ new Map()), r = S(n, e.pid, () => /* @__PURE__ */ new Map()), i = S(r, e.tid, () => /* @__PURE__ */ new Map());
	S(i, e.cat, () => ({
		flows: /* @__PURE__ */ new Set(),
		bindingParsed: !1
	})).flows.add(t);
}
function Fa(e) {
	return `${e.cat}${ka}${e.name}${ka}${e.id}`;
}
async function Ia() {
	Ea.forEach(Na), Da.forEach(Ma), Oa = [...Ta.values()].map((e) => [...e.values()]).map((e) => e.filter((e) => e !== void 0)).filter((e) => e.length > 1);
}
function La() {
	return { flows: Oa };
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/handlers/AuctionWorkletsHandler.ts
var Ra = /* @__PURE__ */ e({
	data: () => Ya,
	finalize: () => Ja,
	handleEvent: () => Ga,
	reset: () => Wa
}), za = /* @__PURE__ */ new Map(), Ba = /* @__PURE__ */ new Map(), Va = /* @__PURE__ */ new Map(), Ha = /* @__PURE__ */ new Map(), Ua = /* @__PURE__ */ new Map();
function Wa() {
	za = /* @__PURE__ */ new Map(), Ba = /* @__PURE__ */ new Map(), Va = /* @__PURE__ */ new Map(), Ha = /* @__PURE__ */ new Map(), Ua = /* @__PURE__ */ new Map();
}
function Ga(e) {
	if (Ee(e)) {
		za.set(e.args.data.pid, e);
		return;
	}
	if (De(e)) {
		Ba.set(e.args.data.pid, e);
		return;
	}
	if (Gt(e)) {
		if (e.args.name === "auction_worklet.CrUtilityMain") {
			Ha.set(e.pid, e);
			return;
		}
		e.args.name === "AuctionV8HelperThread" && Ua.set(e.pid, e);
	}
}
function Ka(e) {
	switch (e) {
		case "seller": return Te.SELLER;
		case "bidder": return Te.BIDDER;
		default: return Te.UNKNOWN;
	}
}
function qa(e) {
	return j.registerSyntheticEvent({
		rawSourceEvent: e,
		name: "SyntheticAuctionWorklet",
		s: E.THREAD,
		cat: e.cat,
		tid: e.tid,
		ts: e.ts,
		ph: T.INSTANT,
		pid: e.args.data.pid,
		host: e.args.data.host,
		target: e.args.data.target,
		type: Ka(e.args.data.type)
	});
}
async function Ja() {
	for (let [e, t] of Ha) {
		let n = Ua.get(e);
		if (!n) continue;
		let r = za.get(e), i = Ba.get(e), a = null;
		r ? (a = {
			...qa(r),
			args: { data: {
				runningInProcessEvent: r,
				utilityThread: t,
				v8HelperThread: n
			} }
		}, i && (a.args.data.doneWithProcessEvent = i)) : i && (a = {
			...qa(i),
			args: { data: {
				doneWithProcessEvent: i,
				utilityThread: t,
				v8HelperThread: n
			} }
		}, r && (a.args.data.runningInProcessEvent = r)), a !== null && Va.set(e, a);
	}
}
function Ya() {
	return { worklets: Va };
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/handlers/MetaHandler.ts
var Xa = /* @__PURE__ */ e({
	data: () => z,
	finalize: () => To,
	handleEvent: () => wo,
	reset: () => So
}), Za, Qa = /* @__PURE__ */ new Map(), $a = "", eo = "", to = /* @__PURE__ */ new Map(), no = jt(-1), ro = Mt(-1), io = jt(-1), ao = Mt(-1), oo = null, so = null, co = /* @__PURE__ */ new Map(), lo = /* @__PURE__ */ new Set();
function uo() {
	return {
		min: C(Infinity),
		max: C(-Infinity),
		range: C(Infinity)
	};
}
var R = uo(), fo = /* @__PURE__ */ new Map(), po = /* @__PURE__ */ new Map(), mo = /* @__PURE__ */ new Map(), ho = /* @__PURE__ */ new Map(), go = [], _o = /* @__PURE__ */ new Map(), vo = C(-1), yo = /* @__PURE__ */ new Set([
	T.BEGIN,
	T.END,
	T.COMPLETE,
	T.INSTANT
]), bo = !0, xo = /* @__PURE__ */ new Set([
	A.TRACING_STARTED_IN_PAGE,
	A.TRACING_SESSION_ID_FOR_WORKER,
	A.TRACING_STARTED_IN_BROWSER,
	A.CPU_PROFILE
]);
function So() {
	fo = /* @__PURE__ */ new Map(), po = /* @__PURE__ */ new Map(), mo = /* @__PURE__ */ new Map(), ho = /* @__PURE__ */ new Map(), co = /* @__PURE__ */ new Map(), go = [], no = jt(-1), ro = Mt(-1), io = jt(-1), ao = Mt(-1), oo = null, lo = /* @__PURE__ */ new Set(), _o = /* @__PURE__ */ new Map(), Qa = /* @__PURE__ */ new Map(), to = /* @__PURE__ */ new Map(), R = uo(), vo = C(-1), bo = !0;
}
function Co(e, t) {
	S(to, t.processId, () => /* @__PURE__ */ new Map()).set(t.frame, t);
	let n = S(Qa, t.frame, () => /* @__PURE__ */ new Map()), r = S(n, t.processId, () => []), i = r.at(-1);
	i && i.frame.url === t.url || r.push({
		frame: t,
		window: {
			min: e.ts,
			max: C(0),
			range: C(0)
		}
	});
}
function wo(e) {
	if (bo && xo.has(e.name) && (bo = !1), Kt(e) && co.set(e.pid, e), e.ts !== 0 && !e.name.endsWith("::UMA") && yo.has(e.ph)) {
		R.min = C(Math.min(e.ts, R.min));
		let t = e.dur ?? C(0);
		R.max = C(Math.max(e.ts + t, R.max));
	}
	if (Kt(e) && (e.args.name === "Browser" || e.args.name === "HeadlessBrowser")) {
		no = e.pid;
		return;
	}
	if (Kt(e) && (e.args.name === "Gpu" || e.args.name === "GPU Process")) {
		io = e.pid;
		return;
	}
	if (Gt(e) && e.args.name === "CrGpuMain") {
		ao = e.tid;
		return;
	}
	if (Gt(e) && e.args.name === "CrBrowserMain" && (ro = e.tid), An(e) && oo === null) {
		let t = e.args.data.viewport_rect;
		oo = {
			x: t[0],
			y: t[1],
			width: t[2],
			height: t[5]
		}, so = e.args.data.dpr;
	}
	if (qt(e)) {
		if (vo = e.ts, !e.args.data) throw Error("No frames found in trace data");
		for (let t of e.args.data.frames ?? []) {
			Co(e, t), t.parent || lo.add(t.processId);
			let n = "isInPrimaryMainFrame" in t, r = "isOutermostMainFrame" in t;
			n && r ? t.isInPrimaryMainFrame && t.isOutermostMainFrame && ($a = t.frame, eo = t.url) : r ? t.isOutermostMainFrame && ($a = t.frame, eo = t.url) : !t.parent && t.url && ($a = t.frame, eo = t.url);
		}
		return;
	}
	if (Jt(e)) {
		let t = e.args.data;
		if (!t || (Co(e, t), t.parent)) return;
		lo.add(t.processId);
		return;
	}
	if (Yt(e)) {
		let t = e.args.data;
		if (!t) return;
		let { frame: n, name: r, url: i } = t;
		Co(e, {
			processId: e.pid,
			frame: n,
			name: r,
			url: i
		});
		return;
	}
	if (Gt(e)) {
		S(_o, e.pid, () => /* @__PURE__ */ new Map()).set(e.tid, e);
		return;
	}
	if (On(e) && e.args.data) {
		let t = e.args.data.navigationId;
		if (po.has(t)) return;
		po.set(t, e), ho.set(t, e.args.data.documentLoaderURL);
		let n = e.args.frame, r = fo.get(n) || [];
		r.push(e), fo.set(n, r), n === $a && go.push(e);
		return;
	}
	if (je(e) && mo.set(e.args.context.performanceTimelineNavigationId, e), _n(e)) {
		if (e.args.data.resourceType !== "Document") return;
		let t = e.args.data.requestId;
		if (!po.get(t)) return;
		ho.set(t, e.args.data.url);
		return;
	}
	if (kn(e)) {
		if (e.args.render_frame_host.frame_type !== "PRIMARY_MAIN_FRAME") return;
		let t = go.at(-1)?.args.data?.navigationId ?? "";
		ho.set(t, e.args.url);
		return;
	}
}
async function To(e) {
	Za = { showAllEvents: !!e?.showAllEvents }, vo >= 0 && (R.min = vo), R.range = C(R.max - R.min);
	for (let [, e] of Qa) {
		let t = [...e.values()].flat().sort((e, t) => e.window.min - t.window.min);
		for (let e = 0; e < t.length; e++) {
			let n = t[e], r = t[e + 1];
			r ? (n.window.max = C(r.window.min - 1), n.window.range = C(n.window.max - n.window.min)) : (n.window.max = C(R.max), n.window.range = C(R.max - n.window.min));
		}
	}
	for (let [e, t] of fo) if (!Qa.has(e)) {
		fo.delete(e);
		for (let e of t) e.args.data && po.delete(e.args.data.navigationId);
	}
	let t = go.at(0), n = Rr(ge(.5));
	if (t) {
		let e = t.ts - R.min < n;
		t.args.data?.isOutermostMainFrame && t.args.data?.documentLoaderURL && e && (eo = t.args.data.documentLoaderURL);
	}
}
function z() {
	return {
		config: Za,
		traceBounds: R,
		browserProcessId: no,
		browserThreadId: ro,
		processNames: co,
		gpuProcessId: io,
		gpuThreadId: ao === Mt(-1) ? void 0 : ao,
		viewportRect: oo || void 0,
		devicePixelRatio: so ?? void 0,
		mainFrameId: $a,
		mainFrameURL: eo,
		navigationsByFrameId: fo,
		navigationsByNavigationId: po,
		softNavigationsById: mo,
		finalDisplayUrlByNavigationId: ho,
		threadsInProcess: _o,
		rendererProcessesByFrame: Qa,
		topLevelRendererIds: lo,
		frameByProcessId: to,
		mainFrameNavigations: go,
		traceIsGeneric: bo
	};
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/handlers/NetworkRequestsHandler.ts
var Eo = /* @__PURE__ */ e({
	data: () => Ho,
	deps: () => Uo,
	finalize: () => Vo,
	handleEvent: () => Bo,
	reset: () => zo
}), B = 1e3, Do = 1e6, Oo = /* @__PURE__ */ new Map(), ko = [], Ao = /* @__PURE__ */ new Map(), jo = /* @__PURE__ */ new Map(), Mo = [], No = /* @__PURE__ */ new Map(), Po = /* @__PURE__ */ new Map(), Fo = /* @__PURE__ */ new Map(), Io = {
	eventsByEntity: /* @__PURE__ */ new Map(),
	entityByEvent: /* @__PURE__ */ new Map(),
	createdEntityCache: /* @__PURE__ */ new Map(),
	entityByUrlCache: /* @__PURE__ */ new Map()
};
function Lo(e, t, n) {
	Ao.has(e) || Ao.set(e, {});
	let r = Ao.get(e);
	if (!r) throw Error(`Unable to locate trace events for request ID ${e}`);
	if (Array.isArray(r[t])) {
		let e = r[t], i = n;
		e.push(...i);
	} else r[t] = n;
}
function Ro(e) {
	for (let t of e) if (t && t > 0) return t;
	return 0;
}
function zo() {
	jo = /* @__PURE__ */ new Map(), Ao = /* @__PURE__ */ new Map(), Mo = [], Po = /* @__PURE__ */ new Map(), Fo = /* @__PURE__ */ new Map(), Oo = /* @__PURE__ */ new Map(), No = /* @__PURE__ */ new Map(), Io = {
		eventsByEntity: /* @__PURE__ */ new Map(),
		entityByEvent: /* @__PURE__ */ new Map(),
		createdEntityCache: /* @__PURE__ */ new Map(),
		entityByUrlCache: /* @__PURE__ */ new Map()
	}, ko = [];
}
function Bo(e) {
	if (gn(e)) {
		Lo(e.args.data.requestId, "changePriority", e);
		return;
	}
	if (xn(e)) {
		Lo(e.args.data.requestId, "willSendRequests", [e]);
		return;
	}
	if (_n(e)) {
		Lo(e.args.data.requestId, "sendRequests", [e]);
		return;
	}
	if (vn(e)) {
		Lo(e.args.data.requestId, "receiveResponse", e);
		return;
	}
	if (Sn(e)) {
		Lo(e.args.data.requestId, "receivedData", [e]);
		return;
	}
	if (bn(e)) {
		Lo(e.args.data.requestId, "resourceFinish", e);
		return;
	}
	if (yn(e)) {
		Lo(e.args.data.requestId, "resourceMarkAsCached", e);
		return;
	}
	if (Dr(e) && Lo(e.args.data.requestId, "preloadRenderBlockingStatusChange", [e]), rr(e) || ir(e) || ar(e)) {
		let t = e.args.data.identifier;
		Oo.has(t) || (e.args.data.frame ? Oo.set(t, {
			frame: e.args.data.frame,
			webSocketIdentifier: t,
			events: [],
			syntheticConnection: null
		}) : e.args.data.workerId && Oo.set(t, {
			workerId: e.args.data.workerId,
			webSocketIdentifier: t,
			events: [],
			syntheticConnection: null
		})), Oo.get(t)?.events.push(e);
	}
	if (qe(e)) {
		ko.push(e);
		return;
	}
}
async function Vo() {
	let { rendererProcessesByFrame: e } = z();
	for (let [t, n] of Ao.entries()) {
		if (!n.sendRequests) continue;
		let r = [];
		for (let e = 0; e < n.sendRequests.length - 1; e++) {
			let t = n.sendRequests[e], i = n.sendRequests[e + 1], a = t.ts, o = C(i.ts - t.ts);
			if (n.willSendRequests?.[e] && n.willSendRequests[e + 1]) {
				let t = n.willSendRequests[e], r = n.willSendRequests[e + 1];
				a = t.ts, o = C(r.ts - t.ts);
			}
			r.push({
				url: t.args.data.url,
				priority: t.args.data.priority,
				requestMethod: t.args.data.requestMethod,
				ts: a,
				dur: o
			});
		}
		let i = n.sendRequests[0], a = n.sendRequests[n.sendRequests.length - 1];
		if (a.args.data.url.startsWith("data:")) continue;
		let o = globalThis.isLightrider;
		if (o && n.resourceFinish && n.receiveResponse?.args.data.headers) {
			let e = n.receiveResponse.args.data.headers.find((e) => e.name === "X-TotalFetchedSize");
			if (e) {
				let t = parseFloat(e.value);
				isNaN(t) || (n.resourceFinish.args.data.encodedDataLength = t);
			}
		}
		let s = n.resourceFinish?.args.data.encodedDataLength !== 0, c = !!n.receiveResponse && n.receiveResponse.args.data.fromCache && !n.receiveResponse.args.data.fromServiceWorker && !s, l = n.resourceMarkAsCached !== void 0, u = l ? void 0 : n.receiveResponse?.args.data.timing, d;
		if (o && n.receiveResponse?.args.data.headers) {
			u = {
				requestTime: zr(n.sendRequests.at(0)?.ts ?? 0),
				connectEnd: 0,
				connectStart: 0,
				dnsEnd: 0,
				dnsStart: 0,
				proxyEnd: 0,
				proxyStart: 0,
				pushEnd: 0,
				pushStart: 0,
				receiveHeadersEnd: 0,
				receiveHeadersStart: 0,
				sendEnd: 0,
				sendStart: 0,
				sslEnd: 0,
				sslStart: 0,
				workerReady: 0,
				workerStart: 0,
				...u
			};
			let e = n.receiveResponse.args.data.headers.find((e) => e.name === "X-TCPMs"), t = e ? Math.max(0, parseInt(e.value, 10)) : 0;
			n.receiveResponse.args.data.protocol.startsWith("h3") ? (u.connectStart = 0, u.connectEnd = t) : (u.connectStart = 0, u.sslStart = t / 2, u.connectEnd = t, u.sslEnd = t);
			let r = n.receiveResponse.args.data.headers.find((e) => e.name === "X-ResponseMs");
			r && (d = Math.max(0, parseInt(r.value, 10)));
		}
		if (![
			"blob:",
			"file:",
			"filesystem:",
			"http:",
			"https:"
		].some((e) => i.args.data.url.startsWith(e))) continue;
		let f = a.args.data.priority, p = f;
		n.changePriority && (p = n.changePriority.args.data.priority);
		let h = n.willSendRequests?.length ? C(n.willSendRequests[0].ts) : C(i.ts), g = n.willSendRequests?.length ? C(n.willSendRequests[n.willSendRequests.length - 1].ts) : C(a.ts), _ = n.resourceFinish ? n.resourceFinish.ts : g, v = n.resourceFinish?.args.data.finishTime ? C(n.resourceFinish.args.data.finishTime * Do) : C(_), y = C(u ? (v || g) - g : 0), b = C(_ - (v || _)), ee = C(g - h), S = u ? u.requestTime * Do - g : 0, te = C(m(S, 0, Number.MAX_VALUE)), ne = u ? C(Ro([
			u.dnsStart * B,
			u.connectStart * B,
			u.sendStart * B,
			n.receiveResponse ? n.receiveResponse.ts - g : null
		])) : n.receiveResponse ? C(n.receiveResponse.ts - h) : C(0), re = u ? C(u.requestTime * Do + u.sendStart * B) : h, ie = C(u ? (u.receiveHeadersEnd - u.sendEnd) * B : 0), ae = C(u ? ((u.receiveHeadersStart ?? u.receiveHeadersEnd) - u.sendEnd) * B : 0), oe = u ? C(u.requestTime * Do + u.receiveHeadersEnd * B) : h, se = u ? C((v || oe) - oe) : n.receiveResponse ? C(_ - n.receiveResponse.ts) : C(0), ce = C(y + b), le = C(u ? (u.dnsEnd - u.dnsStart) * B : 0), ue = C(u ? (u.sslEnd - u.sslStart) * B : 0), de = C(u ? (u.proxyEnd - u.proxyStart) * B : 0), fe = C(u ? (u.sendEnd - u.sendStart) * B : 0), pe = C(u ? (u.connectEnd - u.connectStart) * B : 0), { frame: me, url: he, renderBlocking: w } = a.args.data, { encodedDataLength: ge, decodedBodyLength: _e } = n.resourceFinish ? n.resourceFinish.args.data : {
			encodedDataLength: 0,
			decodedBodyLength: 0
		}, ve = new URL(he).protocol === "https:", ye = ci(me, a.ts, e) || "", be = n.preloadRenderBlockingStatusChange?.at(-1)?.args.data.renderBlocking ?? w ?? "non_blocking", E = j.registerSyntheticEvent({
			rawSourceEvent: a,
			args: { data: {
				syntheticData: {
					dnsLookup: le,
					download: se,
					downloadStart: oe,
					finishTime: v,
					initialConnection: pe,
					isDiskCached: c,
					isHttps: ve,
					isMemoryCached: l,
					isPushedResource: s,
					networkDuration: y,
					processingDuration: b,
					proxyNegotiation: de,
					queueing: te,
					redirectionDuration: ee,
					requestSent: fe,
					sendStartTime: re,
					ssl: ue,
					stalled: ne,
					totalTime: ce,
					waiting: ie,
					serverResponseTime: ae
				},
				decodedBodyLength: _e,
				encodedDataLength: ge,
				frame: me,
				fromServiceWorker: n.receiveResponse?.args.data.fromServiceWorker,
				isLinkPreload: a.args.data.isLinkPreload || !1,
				mimeType: n.receiveResponse?.args.data.mimeType ?? "",
				priority: p,
				initialPriority: f,
				protocol: n.receiveResponse?.args.data.protocol ?? "unknown",
				redirects: r,
				renderBlocking: be,
				requestId: t,
				requestingFrameUrl: ye,
				requestMethod: a.args.data.requestMethod,
				resourceType: a.args.data.resourceType ?? x.ResourceType.Other,
				statusCode: n.receiveResponse?.args.data.statusCode ?? 0,
				responseHeaders: n.receiveResponse?.args.data.headers ?? null,
				fetchPriorityHint: a.args.data.fetchPriorityHint ?? "auto",
				initiator: a.args.data.initiator,
				stackTrace: a.args.data.stackTrace,
				timing: u,
				lrServerResponseTime: d,
				url: he,
				failed: n.resourceFinish?.args.data.didFail ?? !1,
				finished: !!n.resourceFinish,
				hasResponse: !!n.receiveResponse,
				connectionId: n.receiveResponse?.args.data.connectionId,
				connectionReused: n.receiveResponse?.args.data.connectionReused
			} },
			cat: "loading",
			name: A.SYNTHETIC_NETWORK_REQUEST,
			ph: T.COMPLETE,
			dur: C(_ - h),
			tdur: C(_ - h),
			ts: C(h),
			tts: C(h),
			pid: a.pid,
			tid: a.tid
		});
		Mo.push(E), jo.set(E.args.data.requestId, E);
		let xe = No.get(E.args.data.url) ?? [];
		xe.push(E.args.data.requestId), No.set(E.args.data.url, xe), Fr(E, Io, n);
		let Se = E.args.data.initiator?.url || gi(E)?.url;
		if (Se) {
			let e = Po.get(Se) ?? [];
			e.push(E), Po.set(Se, e);
		}
	}
	for (let e of Mo) {
		let t = Po.get(e.args.data.url);
		if (t) for (let n of t) Fo.set(n, e);
	}
	Wo();
}
function Ho() {
	return {
		byId: jo,
		byTime: Mo,
		requestIdsByURL: No,
		incompleteInitiator: Fo,
		webSocket: [...Oo.values()],
		entityMappings: {
			entityByEvent: Io.entityByEvent,
			eventsByEntity: Io.eventsByEntity,
			createdEntityCache: Io.createdEntityCache,
			entityByUrlCache: Io.entityByUrlCache
		},
		linkPreconnectEvents: ko
	};
}
function Uo() {
	return ["Meta"];
}
function Wo() {
	Oo.forEach((e) => {
		let t = null, n = null;
		for (let r of e.events) rr(r) && (t = r), cr(r) && (n = r);
		e.syntheticConnection = Go(t, n, e.events[0]);
	});
}
function Go(e, t, n) {
	let { traceBounds: r } = z(), i = e ? e.ts : r.min, a = (t ? t.ts : r.max) - i, o = e || t || n;
	return {
		name: "SyntheticWebSocketConnection",
		cat: o.cat,
		ph: T.COMPLETE,
		ts: i,
		dur: a,
		pid: o.pid,
		tid: o.tid,
		s: o.s,
		rawSourceEvent: o,
		_tag: "SyntheticEntryTag",
		args: { data: {
			identifier: o.args.data.identifier,
			priority: x.ResourcePriority.Low,
			url: o.args.data.url || ""
		} }
	};
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/cpu_profile/ProfileTreeModel.ts
var Ko = class {
	callFrame;
	callUID;
	self;
	total;
	id;
	parent;
	children;
	originalFunctionName = null;
	depth;
	deoptReason;
	constructor(e) {
		this.callFrame = e, this.callUID = `${e.functionName}@${e.scriptId}:${e.lineNumber}:${e.columnNumber}`, this.self = 0, this.total = 0, this.id = 0, this.parent = null, this.children = [];
	}
	get scriptId() {
		return String(this.callFrame.scriptId);
	}
	get url() {
		return this.callFrame.url;
	}
	get lineNumber() {
		return this.callFrame.lineNumber;
	}
	get columnNumber() {
		return this.callFrame.columnNumber;
	}
	get functionName() {
		return this.originalFunctionName ?? this.callFrame.functionName;
	}
	setOriginalFunctionName(e) {
		this.originalFunctionName = e;
	}
}, qo = class {
	root;
	total;
	maxDepth;
	initialize(e) {
		this.root = e, this.assignDepthsAndParents(), this.total = this.calculateTotals(this.root);
	}
	assignDepthsAndParents() {
		let e = this.root;
		e.depth = -1, e.parent = null, this.maxDepth = 0;
		let t = [e];
		for (; t.length;) {
			let e = t.pop(), n = e.depth + 1;
			n > this.maxDepth && (this.maxDepth = n);
			let r = e.children;
			for (let i of r) i.depth = n, i.parent = e, t.push(i);
		}
	}
	calculateTotals(e) {
		let t = [e], n = [];
		for (; t.length;) {
			let e = t.pop();
			e.total = e.self, n.push(e), t.push(...e.children);
		}
		for (; n.length > 1;) {
			let e = n.pop();
			e.parent && (e.parent.total += e.total);
		}
		return e.total;
	}
}, Jo = class extends Ko {
	id;
	self;
	positionTicks;
	deoptReason;
	constructor(e, t) {
		let n = e.callFrame || {
			functionName: e.functionName,
			scriptId: e.scriptId,
			url: e.url,
			lineNumber: e.lineNumber - 1,
			columnNumber: e.columnNumber - 1
		};
		super(n), this.id = e.id, this.self = (e.hitCount || 0) * t, this.positionTicks = e.positionTicks, this.deoptReason = e.deoptReason && e.deoptReason !== "no reason" ? e.deoptReason : null;
	}
}, Yo = class extends qo {
	profileStartTime;
	profileEndTime;
	timestamps;
	samples;
	traceIds;
	lines;
	columns;
	totalHitCount;
	profileHead;
	#e;
	gcNode;
	programNode;
	idleNode;
	#t;
	#n;
	constructor(e) {
		super(), e.head ? (this.profileStartTime = e.startTime * 1e3, this.profileEndTime = e.endTime * 1e3, this.timestamps = e.timestamps, this.compatibilityConversionHeadToNodes(e)) : (this.profileStartTime = e.startTime / 1e3, this.profileEndTime = e.endTime / 1e3, this.timestamps = this.convertTimeDeltas(e)), this.traceIds = e.traceIds, this.samples = e.samples, this.lines = e.lines, this.columns = e.columns, this.totalHitCount = 0, this.profileHead = this.translateProfileTree(e.nodes), this.initialize(this.profileHead), this.extractMetaNodes(), this.samples?.length && (this.sortSamples(), this.normalizeTimestamps(), this.fixMissingSamples());
	}
	compatibilityConversionHeadToNodes(e) {
		if (!e.head || e.nodes) return;
		let t = [];
		n(e.head), e.nodes = t, delete e.head;
		function n(e) {
			return t.push(e), e.children = e.children.map(n), e.id;
		}
	}
	convertTimeDeltas(e) {
		if (!e.timeDeltas) return [];
		let t = e.startTime, n = Array(e.timeDeltas.length);
		for (let r = 0; r < e.timeDeltas.length; ++r) t += e.timeDeltas[r], n[r] = t;
		return n;
	}
	translateProfileTree(e) {
		function t(e) {
			if (!e[0].children) {
				e[0].children = [];
				for (let t = 1; t < e.length; ++t) {
					let n = e[t], i = r.get(n.parent);
					i && (i.children ? i.children.push(n.id) : i.children = [n.id]);
				}
			}
		}
		function n(e, t) {
			if (typeof e[0].hitCount != "number") {
				if (!t) throw Error("Error: Neither hitCount nor samples are present in profile.");
				for (let t = 0; t < e.length; ++t) e[t].hitCount = 0;
				for (let e = 0; e < t.length; ++e) {
					let n = r.get(t[e]);
					n?.hitCount !== void 0 && n.hitCount++;
				}
			}
		}
		let r = /* @__PURE__ */ new Map();
		for (let t = 0; t < e.length; ++t) {
			let n = e[t];
			r.set(n.id, n);
		}
		n(e, this.samples), t(e), this.totalHitCount = e.reduce((e, t) => e + (t.hitCount || 0), 0);
		let i = (this.profileEndTime - this.profileStartTime) / this.totalHitCount, a = e[0], o = /* @__PURE__ */ new Map([[a.id, a.id]]);
		this.#e = /* @__PURE__ */ new Map();
		let s = new Jo(a, i);
		if (this.#e.set(a.id, s), !a.children) throw Error("Missing children for root");
		let c = a.children.map(() => s), l = a.children.map((e) => r.get(e));
		for (; l.length;) {
			let e = c.pop(), t = l.pop();
			if (!t || !e) continue;
			t.children ||= [];
			let n = new Jo(t, i);
			e.children.push(n), e = n, o.set(t.id, e.id), c.push.apply(c, t.children.map(() => e)), l.push.apply(l, t.children.map((e) => r.get(e))), this.#e.set(t.id, n);
		}
		return this.samples &&= this.samples.map((e) => o.get(e)), s;
	}
	sortSamples() {
		if (!this.timestamps || !this.samples) return;
		let e = this.timestamps, t = this.samples, n = e.map((e, t) => t);
		n.sort((t, n) => e[t] - e[n]), this.timestamps = [], this.samples = [];
		for (let r = 0; r < n.length; r++) {
			let i = n[r];
			this.timestamps.push(e[i]), this.samples.push(t[i]);
		}
	}
	normalizeTimestamps() {
		if (!this.samples) return;
		let e = this.timestamps;
		if (!e) {
			let t = this.profileStartTime, n = (this.profileEndTime - t) / this.samples.length;
			e = Array(this.samples.length + 1);
			for (let r = 0; r < e.length; ++r) e[r] = t + r * n;
			this.timestamps = e;
			return;
		}
		for (let t = 0; t < e.length; ++t) e[t] /= 1e3;
		if (this.samples.length === e.length) {
			let t = e.at(-1) || 0, n = (t - e[0]) / (e.length - 1);
			this.timestamps.push(t + n);
		}
		this.profileStartTime = e.at(0) || this.profileStartTime, this.profileEndTime = e.at(-1) || this.profileEndTime;
	}
	extractMetaNodes() {
		let e = this.profileHead.children;
		for (let t = 0; t < e.length && !(this.gcNode && this.programNode && this.idleNode); t++) {
			let n = e[t];
			n.functionName === "(garbage collector)" ? this.gcNode = n : n.functionName === "(program)" ? this.programNode = n : n.functionName === "(idle)" && (this.idleNode = n);
		}
	}
	fixMissingSamples() {
		let e = this.samples;
		if (!e) return;
		let t = e.length;
		if (!this.programNode || t < 3) return;
		let n = this.#e, r = this.programNode.id, i = this.gcNode ? this.gcNode.id : -1, a = this.idleNode ? this.idleNode.id : -1, o = e[0], s = e[1];
		for (let i = 1; i < t - 1; i++) {
			let t = e[i + 1], a = n.get(o), u = n.get(t);
			if (o === void 0 || t === void 0 || !a || !u) {
				console.error(`Unexpectedly found undefined nodes: ${o} ${t}`);
				continue;
			}
			s === r && !l(o) && !l(t) && c(a) === c(u) && (e[i] = o), o = s, s = t;
		}
		function c(e) {
			for (; e.parent?.parent;) e = e.parent;
			return e;
		}
		function l(e) {
			return e === r || e === i || e === a;
		}
	}
	forEachFrame(e, t, n, r) {
		if (!this.profileHead || !this.samples) return;
		n ||= 0, r ||= Infinity;
		let i = this.samples, a = this.timestamps, o = this.#e, c = this.gcNode, l = i.length, u = d(a, n, s), f = 0, p = [], m = this.profileHead.id, h, g = null, _ = this.maxDepth + 3;
		this.#t ||= Array(_);
		let v = this.#t;
		this.#n ||= Array(_);
		let y = this.#n, b, x;
		for (x = u; x < l && (h = a[x], !(h >= r)); x++) {
			let n = i[x];
			if (n === m) continue;
			b = o.get(n);
			let r = o.get(m) || null;
			if (r) {
				if (c && b === c) {
					g = r, e(g.depth + 1, c, x, h), v[++f] = h, y[f] = 0, m = n;
					continue;
				}
				if (c && r === c && g) {
					let e = v[f], n = h - e;
					y[f - 1] += n, t(g.depth + 1, c, x, e, n, n - y[f]), --f, r = g, m = r.id, g = null;
				}
				for (; b && b.depth > r.depth;) p.push(b), b = b.parent;
				for (; r && r !== b;) {
					let e = v[f], n = h - e;
					y[f - 1] += n, t(r.depth, r, x, e, n, n - y[f]), --f, b && b.depth === r.depth && (p.push(b), b = b.parent), r = r.parent;
				}
				for (; p.length;) {
					let t = p.pop();
					if (!t) break;
					b = t, e(t.depth, t, x, h), v[++f] = h, y[f] = 0;
				}
				m = n;
			}
		}
		if (h = a[x] || this.profileEndTime, b && g && o.get(m) === c) {
			let e = v[f], n = h - e;
			y[f - 1] += n, t(g.depth + 1, b, x, e, n, n - y[f]), --f, m = g.id;
		}
		for (let e = o.get(m); e?.parent; e = e.parent) {
			let n = v[f], r = h - n;
			y[f - 1] += r, t(e.depth, e, x, n, r, r - y[f]), --f;
		}
	}
	nodeByIndex(e) {
		return this.samples && this.#e.get(this.samples[e]) || null;
	}
	nodeById(e) {
		return this.#e.get(e) || null;
	}
	nodes() {
		return this.#e ? [...this.#e.values()] : null;
	}
}, Xo = /* @__PURE__ */ e({
	data: () => os,
	finalize: () => is,
	getProfileCallFunctionName: () => cs,
	handleEvent: () => rs,
	reset: () => ns
}), Zo = /* @__PURE__ */ new Map(), Qo = /* @__PURE__ */ new Map(), $o = /* @__PURE__ */ new Map(), es = {
	cpuProfile: ["Inspector"],
	performanceTrace: ["Internal", "Inspector"]
};
function ts(e) {
	let t = e.isCPUProfile ? es.cpuProfile : es.performanceTrace;
	for (let [n, r] of $o) {
		let i = /* @__PURE__ */ new Map();
		for (let [e, t] of r) {
			let n = t.threadId;
			n !== void 0 && S(i, n, () => []).push({
				id: e,
				data: t
			});
		}
		for (let [r, a] of i) {
			if (!a.length) continue;
			let i = a[0];
			for (let e of t) {
				let t = a.find((t) => t.data.source === e);
				if (t) {
					i = t;
					break;
				}
			}
			let o = i.data;
			if (!o.rawProfile.nodes.length) continue;
			let s = [], c = new Yo(o.rawProfile), l = Fi();
			l.maxDepth = c.maxDepth;
			let u = i.id, d = {
				rawProfile: o.rawProfile,
				parsedProfile: c,
				profileCalls: [],
				profileTree: l,
				profileId: u
			};
			S(Zo, n, () => /* @__PURE__ */ new Map()).set(r, d), e.isCPUProfile && f();
			function f() {
				c.forEachFrame(e, t);
				function e(e, t, i, a) {
					if (r === void 0) return;
					let o = M(w(a)), c = t.id, l = li(t, u, i, o, n, r);
					d.profileCalls.push(l), s.push(d.profileCalls.length - 1);
					let f = Ii(l, c);
					Qo.set(l, f), f.depth = e, s.length === 1 && d.profileTree?.roots.add(f);
				}
				function t(e, t, n, r, i, a) {
					let o = s.pop(), c = o !== void 0 && d.profileCalls[o];
					if (!c) return;
					let { callFrame: l, ts: f, pid: p, tid: m } = c, h = Qo.get(c);
					if (l === void 0 || f === void 0 || p === void 0 || u === void 0 || m === void 0 || h === void 0) return;
					let g = M(w(i)), _ = M(w(a));
					c.dur = g, h.selfTime = _;
					let v = s.at(-1), y = v !== void 0 && d.profileCalls.at(v), b = y && Qo.get(y);
					b && (h.parent = b, b.children.push(h));
				}
			}
		}
	}
}
function ns() {
	$o = /* @__PURE__ */ new Map(), Zo = /* @__PURE__ */ new Map(), Qo = /* @__PURE__ */ new Map();
}
function rs(e) {
	if (mn(e)) {
		let t = ss(e.pid, e.id);
		t.rawProfile = e.args.data.cpuProfile, t.threadId = e.tid;
		return;
	}
	if (pn(e)) {
		let t = ss(e.pid, e.id);
		t.rawProfile.startTime = e.ts, t.threadId = e.tid, as(t, e.args?.data?.source);
		return;
	}
	if (hn(e)) {
		let t = ss(e.pid, e.id), n = t.rawProfile, r = e.args?.data?.cpuProfile || { samples: [] }, i = r?.samples || [], a = e.args?.data?.cpuProfile?.trace_ids;
		for (let e of r?.nodes || []) {
			let t = e.callFrame.lineNumber === void 0 ? -1 : e.callFrame.lineNumber, r = e.callFrame.columnNumber === void 0 ? -1 : e.callFrame.columnNumber, i = String(e.callFrame.scriptId), a = e.callFrame.url || "", o = {
				...e,
				callFrame: {
					...e.callFrame,
					url: a,
					lineNumber: t,
					columnNumber: r,
					scriptId: i
				}
			};
			n.nodes.push(o);
		}
		let o = e.args.data?.timeDeltas || [], s = e.args.data?.lines || Array(i.length).fill(0), c = e.args.data?.columns || Array(i.length).fill(0);
		if (n.samples?.push(...i), n.timeDeltas?.push(...o), n.lines?.push(...s), n.columns?.push(...c), a) {
			n.traceIds ??= {};
			for (let e in a) n.traceIds[e] = a[e];
		}
		if (n.samples && n.timeDeltas && n.samples.length !== n.timeDeltas.length) {
			console.error("Failed to parse CPU profile.");
			return;
		}
		!n.endTime && n.timeDeltas && (n.endTime = n.timeDeltas.reduce((e, t) => e + t, n.startTime)), as(t, e.args?.data?.source);
		return;
	}
}
async function is(e = {}) {
	ts(e);
}
function as(e, t) {
	Ce.includes(t) && (e.source = t);
}
function os() {
	return {
		profilesInProcess: Zo,
		entryToNode: Qo
	};
}
function ss(e, t) {
	let n = S($o, e, () => /* @__PURE__ */ new Map());
	return S(n, t, () => ({
		rawProfile: {
			startTime: 0,
			endTime: 0,
			nodes: [],
			samples: [],
			timeDeltas: [],
			lines: [],
			columns: []
		},
		profileId: t
	}));
}
function cs(e, t) {
	let n = (e.profilesInProcess.get(t.pid)?.get(t.tid))?.parsedProfile.nodeById(t.nodeId);
	return n?.functionName ? n.functionName : t.callFrame.functionName;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/handlers/RendererHandler.ts
var ls = /* @__PURE__ */ e({
	assignIsMainFrame: () => Os,
	assignMeta: () => Es,
	assignOrigin: () => Ds,
	assignThreadName: () => ks,
	buildHierarchy: () => Ms,
	data: () => ws,
	deps: () => Ps,
	finalize: () => Cs,
	handleEvent: () => Ss,
	handleUserConfig: () => bs,
	makeCompleteEvent: () => Ns,
	reset: () => xs,
	sanitizeProcesses: () => As,
	sanitizeThreads: () => js
}), us = /* @__PURE__ */ new Map(), ds = {
	eventsByEntity: /* @__PURE__ */ new Map(),
	entityByEvent: /* @__PURE__ */ new Map(),
	createdEntityCache: /* @__PURE__ */ new Map(),
	entityByUrlCache: /* @__PURE__ */ new Map()
}, fs = [], ps = /* @__PURE__ */ new Map(), ms = [], hs = re(), gs = () => ({
	url: null,
	isOnMainFrame: !1,
	threads: /* @__PURE__ */ new Map()
}), _s = () => ({
	name: null,
	entries: [],
	profileCalls: [],
	layoutEvents: [],
	recalcStyleEvents: []
}), vs = (e, t) => S(e, t, gs), ys = (e, t) => S(e.threads, t, _s);
function bs(e) {
	hs = e;
}
function xs() {
	us = /* @__PURE__ */ new Map(), ps = /* @__PURE__ */ new Map(), ds = {
		eventsByEntity: /* @__PURE__ */ new Map(),
		entityByEvent: /* @__PURE__ */ new Map(),
		createdEntityCache: /* @__PURE__ */ new Map(),
		entityByUrlCache: /* @__PURE__ */ new Map()
	}, ms = [], fs = [];
}
function Ss(e) {
	if (Gt(e) && e.args.name?.startsWith("CompositorTileWorker") && fs.push({
		pid: e.pid,
		tid: e.tid
	}), Ft(e) || It(e)) {
		let t = ys(vs(us, e.pid), e.tid), n = Ns(e);
		if (!n) return;
		t.entries.push(n);
		return;
	}
	(Rt(e) || Pt(e)) && ys(vs(us, e.pid), e.tid).entries.push(e), wt(e) && ys(vs(us, e.pid), e.tid).layoutEvents.push(e), Ct(e) && ys(vs(us, e.pid), e.tid).recalcStyleEvents.push(e);
}
async function Cs() {
	let { mainFrameId: e, rendererProcessesByFrame: t, threadsInProcess: n } = z();
	ds = Ho().entityMappings, Es(us, e, t, n), As(us), Ms(us), js(us);
}
function ws() {
	return {
		processes: us,
		compositorTileWorkers: Ts(),
		entryToNode: ps,
		entityMappings: {
			entityByEvent: ds.entityByEvent,
			eventsByEntity: ds.eventsByEntity,
			createdEntityCache: ds.createdEntityCache,
			entityByUrlCache: ds.entityByUrlCache
		}
	};
}
function Ts() {
	let e = /* @__PURE__ */ new Map();
	for (let t of fs) {
		let n = e.get(t.pid) || [];
		n.push(t.tid), e.set(t.pid, n);
	}
	return e;
}
function Es(e, t, n, r) {
	Ds(e, n), Os(e, t, n), ks(e, r);
}
function Ds(e, t) {
	for (let n of t.values()) for (let [t, r] of n) for (let n of r.flat()) {
		let r = vs(e, t);
		if (r.url === null || r.url === "about:blank") try {
			new URL(n.frame.url), r.url = n.frame.url;
		} catch {
			r.url = null;
		}
	}
}
function Os(e, t, n) {
	for (let [r, i] of n) for (let [n] of i) {
		let i = vs(e, n);
		r === t && (i.isOnMainFrame = !0);
	}
}
function ks(e, t) {
	for (let [n, r] of e) for (let [e, i] of t.get(n) ?? []) {
		let t = ys(r, e);
		t.name = i?.args.name ?? `${e}`;
	}
}
function As(e) {
	let t = Ya().worklets;
	if (!z().traceIsGeneric) {
		for (let [n, r] of e) if (r.url === null) {
			let i = t.get(n);
			i ? r.url = i.host : e.delete(n);
			continue;
		}
	}
}
function js(e) {
	for (let [, t] of e) for (let [e, n] of t.threads) n.tree?.roots.size || t.threads.delete(e);
}
function Ms(e, t) {
	let n = os();
	for (let [r, i] of e) for (let [e, a] of i.threads) {
		if (!a.entries.length) {
			a.tree = Fi();
			continue;
		}
		L(a.entries);
		let i = n.profilesInProcess.get(r)?.get(e);
		if (i) {
			let t = i.parsedProfile, n = t && new ea(t, i.profileId, r, e, hs), o = n?.buildProfileCalls(a.entries);
			if (n && o) {
				a.entries = ii(a.entries, o), a.profileCalls = o;
				let e = n.jsSampleEvents;
				e.length && (a.entries = ii(a.entries, e));
			}
		}
		let o = Li(a.entries, t);
		a.tree = o.tree;
		for (let [e, t] of o.entryToNode) ps.set(e, t), Pr(e, ds);
	}
}
function Ns(e) {
	if (It(e)) {
		let t = ms.pop();
		return t ? t.name !== e.name || t.cat !== e.cat ? (console.error("Begin/End events mismatch at " + t.ts + " (" + t.name + ") vs. " + e.ts + " (" + e.name + ")"), null) : (t.dur = C(e.ts - t.ts), null) : null;
	}
	let t = {
		...e,
		ph: T.COMPLETE,
		dur: C(0)
	};
	return ms.push(t), t;
}
function Ps() {
	return [
		"Meta",
		"Samples",
		"AuctionWorklets",
		"NetworkRequests"
	];
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/handlers/AsyncJSCallsHandler.ts
var Fs = /* @__PURE__ */ e({
	data: () => Js,
	deps: () => Ys,
	finalize: () => Hs,
	handleEvent: () => Vs,
	reset: () => Bs
}), Is = /* @__PURE__ */ new Map(), Ls = /* @__PURE__ */ new Map(), Rs = /* @__PURE__ */ new Map(), zs = /* @__PURE__ */ new Map();
function Bs() {
	Is = /* @__PURE__ */ new Map(), Rs = /* @__PURE__ */ new Map(), Ls = /* @__PURE__ */ new Map(), zs = /* @__PURE__ */ new Map();
}
function Vs(e) {}
async function Hs() {
	let { flows: e } = La(), { entryToNode: t } = ws();
	for (let n of e) {
		let e = n.at(0);
		if (!e || (Dt(e) && (e = Ls.get(e)), !e || !Et(e))) continue;
		let r = e.args.taskName, i = n.at(1);
		if (!i || !Dt(i)) continue;
		Ls.set(i, e);
		let a = Us(e, t), o = Gs(i, t);
		if (zs.set(o || i, {
			taskName: r,
			scheduler: a || e
		}), !a || !o) continue;
		S(Is, a, () => []).push(o);
		let s = Ks(i, t);
		for (let e of s) Rs.set(e, {
			taskName: r,
			scheduler: a
		});
	}
}
function Us(e, t) {
	let n = t.get(e)?.parent;
	for (; n;) {
		if (k(n.entry) || Ws(n.entry)) return n.entry;
		n = n.parent;
	}
	return null;
}
function Ws(e) {
	let t = _r(e), n = e.name.startsWith("v8") || e.name.startsWith("V8");
	return gr(e) && (t || !n);
}
function Gs(e, t) {
	return qs(e, t, Ws, Dt).at(0);
}
function Ks(e, t) {
	return qs(e, t, k, Dt);
}
function qs(e, t, n, r) {
	let i = t.get(e);
	if (!i) return [];
	let a = [[...i.children]], o = [];
	for (let e = 0; e < a.length; e++) {
		let t = a[e];
		for (let e = 0; e < t.length; e++) {
			let i = t[e];
			n(i.entry) ? o.push(i.entry) : r(i.entry) || a.push([...i.children]);
		}
	}
	return o;
}
function Js() {
	return {
		schedulerToRunEntryPoints: Is,
		asyncCallToScheduler: Rs,
		runEntryPointToScheduler: zs
	};
}
function Ys() {
	return ["Renderer", "Flows"];
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/handlers/DOMStatsHandler.ts
var Xs = /* @__PURE__ */ e({
	data: () => tc,
	finalize: () => ec,
	handleEvent: () => $s,
	reset: () => Qs
}), Zs = /* @__PURE__ */ new Map();
function Qs() {
	Zs = /* @__PURE__ */ new Map();
}
function $s(e) {
	Wt(e) && S(Zs, e.args.data.frame, () => []).push(e);
}
async function ec() {}
function tc() {
	return { domStatsByFrameId: Zs };
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/handlers/UserTimingsHandler.ts
var nc = /* @__PURE__ */ e({
	data: () => vc,
	finalize: () => _c,
	handleEvent: () => gc,
	reset: () => lc,
	userTimingComparator: () => hc
}), rc = [], ic = /* @__PURE__ */ new Map(), ac = [], oc = [], sc = [], cc = [];
function lc() {
	rc = [], ac = [], oc = [], sc = [], cc = [], ic = /* @__PURE__ */ new Map();
}
var uc = [
	"workerStart",
	"redirectStart",
	"redirectEnd",
	"fetchStart",
	"domainLookupStart",
	"domainLookupEnd",
	"connectStart",
	"connectEnd",
	"secureConnectionStart",
	"requestStart",
	"responseStart",
	"responseEnd"
], dc = [
	"navigationStart",
	"unloadEventStart",
	"unloadEventEnd",
	"redirectStart",
	"redirectEnd",
	"fetchStart",
	"commitNavigationEnd",
	"domainLookupStart",
	"domainLookupEnd",
	"connectStart",
	"connectEnd",
	"secureConnectionStart",
	"requestStart",
	"responseStart",
	"responseEnd",
	"domLoading",
	"domInteractive",
	"domContentLoadedEventStart",
	"domContentLoadedEventEnd",
	"domComplete",
	"loadEventStart",
	"loadEventEnd"
], fc = [...uc, ...dc];
function pc(e) {
	if ("dur" in e) return {
		start: e.ts,
		end: C(e.ts + (e.dur ?? 0))
	};
	if (Vn(e)) {
		let { start: t, end: n } = e.args.data || {};
		if (typeof t == "number" && typeof n == "number") return {
			start: C(t),
			end: C(n)
		};
	}
	return {
		start: e.ts,
		end: e.ts
	};
}
function mc(e) {
	if (e.cat === "blink.user_timing") {
		let t = e.args.data.beginEvent.args?.detail;
		if (t) {
			let e = ai(t, "devtools");
			if (e && "track" in e) return e.track;
		}
	} else if (Vn(e)) {
		let t = e.args.data?.track;
		return typeof t == "string" ? t : void 0;
	}
}
function hc(e, t, n) {
	let { start: r, end: i } = pc(e), { start: a, end: o } = pc(t), s = ni(r, a, i, o);
	if (s) return s;
	if (mc(e) !== mc(t)) return 0;
	let c = n.indexOf(e);
	return n.indexOf(t) - c;
}
function gc(e) {
	if (!fc.includes(e.name)) {
		if (Hn(e) && ic.set(e.args.traceId, e), Ln(e)) {
			ac.push(e);
			return;
		}
		zn(e) && oc.push(e), Bn(e) && sc.push(e), Vn(e) && cc.push(e);
	}
}
async function _c() {
	rc = pi([...ac, ...sc]), rc = rc.sort((e, t) => hc(e, t, [...rc])), cc = cc.sort((e, t) => hc(e, t, [...cc]));
}
function vc() {
	return {
		consoleTimings: rc.filter((e) => e.cat === "blink.console"),
		performanceMeasures: rc.filter((e) => e.cat === "blink.user_timing"),
		performanceMarks: oc,
		timestampEvents: cc,
		measureTraceByTraceId: ic
	};
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/handlers/ExtensionTraceDataHandler.ts
var yc = /* @__PURE__ */ e({
	data: () => Pc,
	deps: () => Fc,
	extensionDataInConsoleTimeStamp: () => Nc,
	extensionDataInPerformanceTiming: () => Mc,
	extractConsoleAPIExtensionEntries: () => Ac,
	extractPerformanceAPIExtensionEntries: () => jc,
	finalize: () => Oc,
	handleEvent: () => Ec,
	reset: () => Dc
}), bc = [], xc = [], Sc = [], Cc = /* @__PURE__ */ new Map(), wc = /* @__PURE__ */ new Map(), Tc = [];
function Ec(e) {}
function Dc() {
	bc = [], Tc = [], xc = [], Sc = [], Cc = /* @__PURE__ */ new Map(), wc = /* @__PURE__ */ new Map();
}
async function Oc() {
	kc();
}
function kc() {
	let e = vc().performanceMeasures, t = vc().performanceMarks;
	jc(ii(e, t)), Ac(), L(bc), Hi(bc, xc, Cc);
}
function Ac() {
	let e = vc().timestampEvents;
	for (let t of e) {
		if (!t.args.data) continue;
		let e = String(t.args.data.name ?? t.args.data.message);
		wc.set(e, t);
		let { devtoolsObj: n, userDetail: r } = Nc(t), i = t.args.data.start, a = t.args.data.end;
		if (!n && !i && !a) continue;
		let o = typeof i == "number" ? C(i) : wc.get(String(i))?.ts, s = typeof a == "number" ? C(a) : wc.get(String(a))?.ts;
		if (s !== void 0 && o === void 0) continue;
		let c = o ?? t.ts, l = s ?? t.ts;
		if (n) {
			let i = {
				...t,
				name: e,
				cat: "devtools.extension",
				devtoolsObj: n,
				userDetail: r,
				rawSourceEvent: t,
				dur: C(l - c),
				ts: c,
				ph: T.COMPLETE
			}, a = j.registerSyntheticEvent(i);
			bc.push(a);
			continue;
		}
		let u = {
			...t,
			name: e,
			cat: "disabled-by-default-v8.inspector",
			ph: T.COMPLETE,
			ts: c,
			dur: C(l - c),
			rawSourceEvent: t
		}, d = j.registerSyntheticEvent(u);
		Tc.push(d);
	}
}
function jc(e) {
	for (let t of e) {
		let { devtoolsObj: e, userDetail: n } = Mc(t);
		if (!e) continue;
		let r = {
			name: t.name,
			ph: ie(e) ? T.INSTANT : T.COMPLETE,
			pid: t.pid,
			tid: t.tid,
			ts: t.ts,
			dur: t.dur,
			cat: "devtools.extension",
			devtoolsObj: e,
			userDetail: n,
			rawSourceEvent: jn(t) ? t.rawSourceEvent : t
		};
		if (ie(e)) {
			let e = j.registerSyntheticEvent(r);
			Sc.push(e);
			continue;
		}
		if (ae(r.devtoolsObj)) {
			let e = j.registerSyntheticEvent(r);
			bc.push(e);
			continue;
		}
	}
}
function Mc(e) {
	let t = zn(e) ? e.args.data?.detail : e.args.data.beginEvent.args.detail;
	if (!t) return {
		devtoolsObj: null,
		userDetail: null
	};
	let n = ai(t, "devtools"), r = null;
	try {
		r = JSON.parse(t), delete r.devtools;
	} catch {}
	return {
		devtoolsObj: n,
		userDetail: r
	};
}
function Nc(e) {
	if (!e.args.data || !e.args.data.track) return {
		devtoolsObj: null,
		userDetail: null
	};
	let t = null;
	try {
		t = JSON.parse(e.args.data?.devtools || "\"\"");
	} catch {}
	return {
		devtoolsObj: {
			color: String(e.args.data.color),
			track: String(e.args.data.track),
			dataType: "track-entry",
			trackGroup: e.args.data.trackGroup === void 0 ? void 0 : String(e.args.data.trackGroup)
		},
		userDetail: t
	};
}
function Pc() {
	return {
		entryToNode: Cc,
		extensionTrackData: xc,
		extensionMarkers: Sc,
		syntheticConsoleEntriesForTimingsTrack: Tc
	};
}
function Fc() {
	return ["UserTimings"];
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/handlers/LayerTreeHandler.ts
var Ic = /* @__PURE__ */ e({
	data: () => qc,
	deps: () => Jc,
	finalize: () => Kc,
	handleEvent: () => Gc,
	reset: () => Wc
}), Lc = [], Rc = [], zc = /* @__PURE__ */ new Map(), Bc = {}, Vc = null, Hc = [], Uc = [];
function Wc() {
	Lc = [], Rc = [], zc = /* @__PURE__ */ new Map(), Bc = {}, Vc = null, Hc = [], Uc = [];
}
function Gc(e) {
	(Kn(e) || Zn(e) || Xn(e) || Yn(e)) && Uc.push(e);
}
async function Kc() {
	let e = z();
	L(Uc);
	for (let t of Uc) if (Yn(t)) {
		if (e.mainFrameId !== t.args.data.frame) continue;
		Vc = t.args.data.layerTreeId;
	} else if (Xn(t)) Hc.push(t);
	else if (Kn(t)) {
		if (!t.args.data.layerId) continue;
		Lc.push(t), Bc[t.args.data.layerId] = t;
		continue;
	} else if (Zn(t)) {
		let e = null;
		for (let n = Hc.length - 1; n > -1; n--) {
			let r = Hc[n];
			if (r.pid === t.pid && r.tid === t.tid) {
				e = r;
				break;
			}
		}
		if (!e || e.args.layerTreeId !== Vc) continue;
		let n = Bc[e.args.layerId];
		if (!n) continue;
		Rc.push(t), zc.set(n, t);
	}
}
function qc() {
	return {
		paints: Lc,
		snapshots: Rc,
		paintsToSnapshots: zc
	};
}
function Jc() {
	return ["Meta"];
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/handlers/Threads.ts
var Yc = /* @__PURE__ */ function(e) {
	return e.MAIN_THREAD = "MAIN_THREAD", e.WORKER = "WORKER", e.RASTERIZER = "RASTERIZER", e.AUCTION_WORKLET = "AUCTION_WORKLET", e.OTHER = "OTHER", e.CPU_PROFILE = "CPU_PROFILE", e.THREAD_POOL = "THREAD_POOL", e;
}({});
function Xc(e, t, n) {
	let r = "OTHER";
	return t.name === "CrRendererMain" ? r = "MAIN_THREAD" : t.name === "DedicatedWorker thread" ? r = "WORKER" : t.name?.startsWith("CompositorTileWorker") ? r = "RASTERIZER" : n.worklets.has(e) ? r = "AUCTION_WORKLET" : t.name?.startsWith("ThreadPool") && (r = "THREAD_POOL"), r;
}
function Zc(e, t) {
	let n = [];
	if (e.processes.size) for (let [r, i] of e.processes) for (let [a, o] of i.threads) {
		if (!o.tree) continue;
		let s = Xc(r, o, t);
		n.push({
			name: o.name,
			pid: r,
			tid: a,
			processIsOnMainFrame: i.isOnMainFrame,
			entries: o.entries,
			tree: o.tree,
			type: s,
			entryToNode: e.entryToNode
		});
	}
	return n;
}
var Qc = /* @__PURE__ */ new WeakMap();
function $c(e) {
	let t = Qc.get(e);
	if (t) return t;
	let n = Zc(e.Renderer, e.AuctionWorklets);
	if (n.length) return Qc.set(e, n), n;
	let r = [];
	if (e.Samples.profilesInProcess.size) for (let [t, n] of e.Samples.profilesInProcess) for (let [i, a] of n) a.profileTree && r.push({
		pid: t,
		tid: i,
		name: null,
		entries: a.profileCalls,
		processIsOnMainFrame: !1,
		tree: a.profileTree,
		type: "CPU_PROFILE",
		entryToNode: e.Samples.entryToNode
	});
	return Qc.set(e, r), r;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/handlers/FramesHandler.ts
var el = /* @__PURE__ */ e({
	LayerPaintEvent: () => pl,
	PendingFrame: () => ml,
	TimelineFrameBeginFrameQueue: () => gl,
	TimelineFrameModel: () => dl,
	data: () => ll,
	deps: () => ul,
	finalize: () => cl,
	framesWithinWindow: () => _l,
	handleEvent: () => sl,
	reset: () => ol
}), tl = null, nl = [];
function rl(e) {
	return Yn(e) || ct(e) || lt(e) || ut(e) || dt(e) || ft(e) || pt(e) || ht(e) || gt(e) || st(e);
}
function il(e) {
	return e.name === A.RUN_TASK && e.cat.includes("disabled-by-default-devtools.timeline");
}
var al = /* @__PURE__ */ new Set([
	A.SCHEDULE_STYLE_RECALCULATION,
	A.INVALIDATE_LAYOUT,
	A.BEGIN_MAIN_THREAD_FRAME,
	A.SCROLL_LAYER
]);
function ol() {
	tl = null, nl = [];
}
function sl(e) {
	(rl(e) || Qn(e) || il(e) || al.has(e.name) || Kn(e)) && nl.push(e);
}
async function cl() {
	L(nl), tl = new dl(nl, ws(), Ya(), z(), qc());
}
function ll() {
	return {
		frames: tl?.frames() ?? [],
		framesById: tl?.framesById() ?? {}
	};
}
function ul() {
	return [
		"Meta",
		"Renderer",
		"AuctionWorklets",
		"LayerTree"
	];
}
var dl = class {
	#e = [];
	#t = {};
	#n = new gl();
	#r = null;
	#i = !1;
	#a = !1;
	#o = null;
	#s = null;
	#c = null;
	#l = null;
	#u = null;
	#d = null;
	#f = null;
	#p = null;
	#m = null;
	#h;
	constructor(e, t, n, r, i) {
		let a = Zc(t, n).filter((e) => e.type === Yc.MAIN_THREAD && e.processIsOnMainFrame).map((e) => ({
			tid: e.tid,
			pid: e.pid,
			startTime: e.entries[0].ts
		}));
		this.#h = i, this.#D(e, a, r.mainFrameId);
	}
	framesById() {
		return this.#t;
	}
	frames() {
		return this.#e;
	}
	#g(e, t) {
		this.#r || this.#w(e, t), this.#l = e, this.#n.addFrameIfNotExists(t, e, !1, !1);
	}
	#_(e, t, n) {
		this.#r || this.#w(e, t), this.#n.addFrameIfNotExists(t, e, !0, n), this.#n.setDropped(t, !0), this.#n.setPartial(t, n);
	}
	#v(e, t) {
		if (!this.#r) {
			this.#w(e, t);
			return;
		}
		if (this.#i || !this.#a) {
			this.#u &&= ((this.#s ? this.#s.triggerTime : this.#l || this.#u) > this.#r.startTime && (this.#r.idle = !0, this.#l = null), null);
			let e = this.#n.processPendingBeginFramesOnDrawFrame(t);
			for (let n of e) {
				let e = this.#r.idle;
				this.#w(n.startTime, t), e && this.#s && this.#E(), n.isDropped && (this.#r.dropped = !0), n.isPartial && (this.#r.isPartial = !0);
			}
		}
		this.#i = !1;
	}
	#y() {
		this.#r && this.#s && !this.#u && this.#E();
	}
	#b() {
		this.#r && (this.#a = !0);
	}
	#x() {
		this.#c && (this.#s = this.#c, this.#c = null, this.#a = !1, this.#i = !0);
	}
	#S(e) {
		this.#o = e;
	}
	#C(e, t) {
		t && (this.#u = e);
	}
	#w(e, t) {
		this.#r && this.#T(this.#r, e), this.#r = new fl(t, e, C(e - z().traceBounds.min));
	}
	#T(e, t) {
		e.setLayerTree(this.#o), e.setEndTime(t), this.#o && (this.#o.paints = e.paints);
		let n = this.#e[this.#e.length - 1];
		this.#e.length && n && (e.startTime !== n.endTime || e.startTime > e.endTime) && console.assert(!1, `Inconsistent frame time for frame ${this.#e.length} (${e.startTime} - ${e.endTime})`);
		let r = this.#e.push(e);
		e.setIndex(r - 1), typeof e.mainFrameId == "number" && (this.#t[e.mainFrameId] = e);
	}
	#E() {
		this.#s && this.#r && (this.#r.paints = this.#s.paints, this.#r.mainFrameId = this.#s.mainFrameId, this.#s = null);
	}
	#D(e, t, n) {
		let r = 0;
		this.#m = t.length && t[0].tid || null, this.#p = t.length && t[0].pid || null;
		for (let i = 0; i < e.length; ++i) {
			for (; r + 1 < t.length && t[r + 1].startTime <= e[i].ts;) this.#m = t[++r].tid, this.#p = t[r].pid;
			this.#O(e[i], n);
		}
		this.#m = null, this.#p = null;
	}
	#O(e, t) {
		Yn(e) && e.args.data.frame === t ? this.#f = e.args.data.layerTreeId : Qn(e) && Number(e.id) === this.#f ? this.#S({
			entry: e,
			paints: []
		}) : (rl(e) && this.#k(e), e.tid === this.#m && e.pid === this.#p && this.#A(e));
	}
	#k(e) {
		e.args.layerTreeId === this.#f && (ct(e) ? this.#g(e.ts, e.args.frameSeqId) : st(e) ? this.#v(e.ts, e.args.frameSeqId) : gt(e) ? this.#y() : ut(e) ? this.#b() : ft(e) ? this.#C(e.ts, e.args.data && !!e.args.data.needsBeginFrame) : lt(e) && this.#_(e.ts, e.args.frameSeqId, !!e.args.hasPartialUpdate));
	}
	#A(e) {
		if (il(e) && (this.#d = e.ts), !this.#c && al.has(e.name) && (this.#c = new ml(this.#d || e.ts)), this.#c) {
			if (dt(e) && e.args.data.frameId && (this.#c.mainFrameId = e.args.data.frameId), Kn(e)) {
				let t = this.#h.paintsToSnapshots.get(e);
				t && this.#c.paints.push(new pl(e, t));
			}
			(ht(e) || pt(e)) && e.args.layerTreeId === this.#f && this.#x();
		}
	}
}, fl = class {
	cat = "devtools.legacy_frame";
	name = "frame";
	ph = T.COMPLETE;
	ts;
	pid = jt(-1);
	tid = Mt(-1);
	index = -1;
	startTime;
	startTimeOffset;
	endTime;
	duration;
	idle;
	dropped;
	isPartial;
	layerTree;
	paints;
	mainFrameId;
	seqId;
	constructor(e, t, n) {
		this.seqId = e, this.startTime = t, this.ts = t, this.startTimeOffset = n, this.endTime = this.startTime, this.duration = C(0), this.idle = !1, this.dropped = !1, this.isPartial = !1, this.layerTree = null, this.paints = [], this.mainFrameId = void 0;
	}
	setIndex(e) {
		this.index = e;
	}
	setEndTime(e) {
		this.endTime = e, this.duration = C(this.endTime - this.startTime);
	}
	setLayerTree(e) {
		this.layerTree = e;
	}
	get dur() {
		return this.duration;
	}
}, pl = class {
	#e;
	#t;
	constructor(e, t) {
		this.#e = e, this.#t = t;
	}
	layerId() {
		return this.#e.args.data.layerId;
	}
	event() {
		return this.#e;
	}
	picture() {
		let e = this.#t.args.snapshot.params?.layer_rect, t = this.#t.args.snapshot.skp64;
		return e && t ? {
			rect: e,
			serializedPicture: t
		} : null;
	}
}, ml = class {
	paints;
	mainFrameId;
	triggerTime;
	constructor(e) {
		this.paints = [], this.mainFrameId = void 0, this.triggerTime = e;
	}
}, hl = class {
	seqId;
	startTime;
	isDropped;
	isPartial;
	constructor(e, t, n, r) {
		this.seqId = e, this.startTime = t, this.isDropped = n, this.isPartial = r;
	}
}, gl = class {
	queueFrames = [];
	mapFrames = /* @__PURE__ */ new Map();
	addFrameIfNotExists(e, t, n, r) {
		this.mapFrames.has(e) || (this.mapFrames.set(e, new hl(e, t, n, r)), this.queueFrames.push(e));
	}
	setDropped(e, t) {
		let n = this.mapFrames.get(e);
		n && (n.isDropped = t);
	}
	setPartial(e, t) {
		let n = this.mapFrames.get(e);
		n && (n.isPartial = t);
	}
	processPendingBeginFramesOnDrawFrame(e) {
		let t = [];
		if (this.mapFrames.has(e)) {
			for (; this.queueFrames[0] !== e;) {
				let e = this.queueFrames[0], n = this.mapFrames.get(e);
				n && n.isDropped && t.push(n), this.mapFrames.delete(e), this.queueFrames.shift();
			}
			let n = this.mapFrames.get(e);
			n && t.push(n), this.mapFrames.delete(e), this.queueFrames.shift();
		}
		return t;
	}
};
function _l(e, t, n) {
	let r = d(e, t || 0, (e, t) => e - t.endTime), i = d(e, n || Infinity, (e, t) => e - t.startTime);
	return e.slice(r, i);
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/handlers/GPUHandler.ts
var vl = /* @__PURE__ */ e({
	data: () => wl,
	deps: () => Tl,
	finalize: () => Cl,
	handleEvent: () => Sl,
	reset: () => xl
}), yl = /* @__PURE__ */ new Map(), bl = [];
function xl() {
	yl = /* @__PURE__ */ new Map(), bl = [];
}
function Sl(e) {
	fn(e) && ti(e, yl);
}
async function Cl() {
	let { gpuProcessId: e, gpuThreadId: t } = z(), n = yl.get(e);
	n && t && (bl = n.get(t) || []);
}
function wl() {
	return { mainGPUThreadTasks: bl };
}
function Tl() {
	return ["Meta"];
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/handlers/ImagePaintingHandler.ts
var El = /* @__PURE__ */ e({
	data: () => Ll,
	finalize: () => Il,
	handleEvent: () => Fl,
	reset: () => Pl
}), Dl = /* @__PURE__ */ new Map(), Ol = /* @__PURE__ */ new Map(), kl = /* @__PURE__ */ new Map(), Al = /* @__PURE__ */ new Map(), jl = /* @__PURE__ */ new Map(), Ml = /* @__PURE__ */ new Map(), Nl = !1;
function Pl() {
	Dl = /* @__PURE__ */ new Map(), Ol = /* @__PURE__ */ new Map(), kl = /* @__PURE__ */ new Map(), Al = /* @__PURE__ */ new Map(), jl = /* @__PURE__ */ new Map(), Ml = /* @__PURE__ */ new Map(), Nl = !1;
}
function Fl(e) {
	if (qn(e)) {
		let t = Dl.get(e.pid) || /* @__PURE__ */ new Map(), n = t.get(e.tid) || [];
		n.push(e), t.set(e.tid, n), Dl.set(e.pid, t), e.args.data.url && S(jl, e.args.data.url, () => []).push(e);
		return;
	}
	if (yt(e) && e.args?.LazyPixelRef !== void 0) {
		let t = Ol.get(e.pid) || /* @__PURE__ */ new Map(), n = t.get(e.tid) || [];
		n.push(e), t.set(e.tid, n), Ol.set(e.pid, t);
	}
	if (vt(e) && e.args?.LazyPixelRef !== void 0) {
		let t = Dl.get(e.pid)?.get(e.tid)?.at(-1);
		if (!t) return;
		kl.set(e.args.LazyPixelRef, t);
		return;
	}
	if (bt(e)) {
		let t = Dl.get(e.pid)?.get(e.tid)?.at(-1);
		if (t) {
			Al.set(e, t);
			return;
		}
		let n = Ol.get(e.pid)?.get(e.tid)?.at(-1);
		if (n?.args?.LazyPixelRef === void 0) return;
		let r = kl.get(n.args.LazyPixelRef);
		if (!r) return;
		Al.set(e, r);
	}
}
async function Il(e) {
	if (!e.metadata?.hostDPR) return;
	let { devicePixelRatio: t } = z();
	if (t) {
		for (let n of Dl.values()) for (let r of n.values()) for (let n of r) {
			let r = n.args.data.width / e.metadata.hostDPR, i = n.args.data.height / e.metadata.hostDPR, a = r * t, o = i * t;
			Ml.set(n, {
				width: a,
				height: o
			});
		}
		Nl = !0;
	}
}
function Ll() {
	return {
		paintImageByDrawLazyPixelRef: kl,
		paintImageForEvent: Al,
		paintImageEventForUrl: jl,
		paintEventToCorrectedDisplaySize: Ml,
		didCorrectForHostDpr: Nl
	};
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/handlers/InitiatorsHandler.ts
var Rl = /* @__PURE__ */ e({
	data: () => eu,
	deps: () => tu,
	finalize: () => $l,
	handleEvent: () => Xl,
	reset: () => Jl
}), zl = /* @__PURE__ */ new Map(), Bl = /* @__PURE__ */ new Map(), Vl = /* @__PURE__ */ new Map(), Hl = /* @__PURE__ */ new Map(), Ul = /* @__PURE__ */ new Map(), Wl = /* @__PURE__ */ new Map(), Gl = /* @__PURE__ */ new Map(), Kl = /* @__PURE__ */ new Map(), ql = /* @__PURE__ */ new Map();
function Jl() {
	zl = /* @__PURE__ */ new Map(), Bl = /* @__PURE__ */ new Map(), Vl = /* @__PURE__ */ new Map(), Wl = /* @__PURE__ */ new Map(), Hl = /* @__PURE__ */ new Map(), Ul = /* @__PURE__ */ new Map(), Gl = /* @__PURE__ */ new Map(), Kl = /* @__PURE__ */ new Map(), ql = /* @__PURE__ */ new Map();
}
function Yl(e) {
	Hl.set(e.event, e.initiator);
	let t = Ul.get(e.initiator) || [];
	t.push(e.event), Ul.set(e.initiator, t);
}
function Xl(e) {
	if (Je(e)) zl.set(e.args.data.frame, e);
	else if (Ct(e)) {
		if (e.args.beginData) {
			Vl.set(e.args.beginData.frame, e);
			let t = zl.get(e.args.beginData.frame);
			t && Yl({
				event: e,
				initiator: t
			});
		}
	} else if (Tt(e)) {
		let t = e;
		if (!Bl.has(e.args.data.frame)) {
			let n = Vl.get(e.args.data.frame);
			if (n) {
				let { endTime: r } = P(n), i = Hl.get(n);
				i && r && r > e.ts && (t = i);
			}
		}
		Bl.set(e.args.data.frame, t);
	} else if (wt(e)) {
		let t = Bl.get(e.args.beginData.frame);
		t && Yl({
			event: e,
			initiator: t
		}), Bl.delete(e.args.beginData.frame);
	} else if (er(e)) Wl.set(e.args.data.timerId, e);
	else if (tr(e)) {
		let t = Wl.get(e.args.data.timerId);
		t && Yl({
			event: e,
			initiator: t
		});
	} else if (nr(e)) Gl.set(e.args.data.id, e);
	else if (Bt(e)) {
		let t = Gl.get(e.args.data.id);
		t && Yl({
			event: e,
			initiator: t
		});
	} else if (rr(e)) Kl.set(e.args.data.identifier, e);
	else if (ir(e) || ar(e)) {
		let t = Kl.get(e.args.data.identifier);
		t && Yl({
			event: e,
			initiator: t
		});
	} else if (pr(e)) ql.set(e.args.data.taskId, e);
	else if (mr(e) || hr(e)) {
		let t = ql.get(e.args.data.taskId);
		t && Yl({
			event: e,
			initiator: t
		});
	}
}
function Zl() {
	let e = La().flows;
	for (let t = 0; t < e.length; t++) {
		let n = e[t];
		for (let e = 0; e < n.length - 1; e++) Yl({
			event: n[e + 1],
			initiator: n[e]
		});
	}
}
function Ql() {
	let e = Js().schedulerToRunEntryPoints.entries();
	for (let [t, n] of e) for (let e of n) Yl({
		event: e,
		initiator: t
	});
}
async function $l() {
	Zl(), Ql();
}
function eu() {
	return {
		eventToInitiator: Hl,
		initiatorToEvents: Ul
	};
}
function tu() {
	return ["Flows", "AsyncJSCalls"];
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/handlers/InvalidationsHandler.ts
var nu = /* @__PURE__ */ e({
	data: () => fu,
	finalize: () => du,
	handleEvent: () => uu,
	handleUserConfig: () => ou,
	reset: () => au
}), ru = /* @__PURE__ */ new Map(), iu = null;
function au() {
	ru.clear(), iu = null;
}
function ou(e) {
	iu = e.maxInvalidationEventsPerEvent;
}
function su(e) {
	let t = ru.get(e);
	return t || (t = {
		invalidationsForEvent: /* @__PURE__ */ new Map(),
		invalidationCountForEvent: /* @__PURE__ */ new Map(),
		lastRecalcStyleEvent: null,
		pendingInvalidations: [],
		hasPainted: !1
	}, ru.set(e, t)), t;
}
function cu(e) {
	return Ct(e) || wt(e) ? e.args.beginData?.frame ?? null : e.args?.data?.frame ?? null;
}
function lu(e, t, n) {
	let r = e.invalidationsForEvent.get(t) || [];
	r.push(n), iu !== null && r.length > iu && r.shift(), e.invalidationsForEvent.set(t, r);
	let i = e.invalidationCountForEvent.get(t) ?? 0;
	e.invalidationCountForEvent.set(t, i + 1);
}
function uu(e) {
	if (iu === 0) return;
	let t = cu(e);
	if (!t) return;
	let n = su(t);
	if (Ct(e)) {
		n.lastRecalcStyleEvent = e;
		for (let t of n.pendingInvalidations) $t(t) || lu(n, e, t);
		return;
	}
	if (_t(e)) {
		if (n.hasPainted &&= (n.pendingInvalidations.length = 0, n.lastRecalcStyleEvent = null, !1), n.lastRecalcStyleEvent && (Be(e) || He(e) || Ue(e))) {
			let t = n.lastRecalcStyleEvent, r = t.ts + (t.dur || 0);
			e.ts >= t.ts && e.ts <= r && lu(n, t, e);
		}
		n.pendingInvalidations.push(e);
		return;
	}
	if (Kn(e)) {
		n.hasPainted = !0;
		return;
	}
	if (wt(e)) for (let t of n.pendingInvalidations) $t(t) && lu(n, e, t);
}
async function du() {}
function fu() {
	let e = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Map();
	for (let n of ru.values()) {
		for (let [t, r] of n.invalidationsForEvent.entries()) e.set(t, r);
		for (let [e, r] of n.invalidationCountForEvent.entries()) t.set(e, r);
	}
	return {
		invalidationsForEvent: e,
		invalidationCountForEvent: t
	};
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/handlers/PageLoadMetricsHandler.ts
var pu = /* @__PURE__ */ e({
	MetricName: () => V,
	ScoreClassification: () => Fu,
	data: () => Nu,
	deps: () => Pu,
	finalize: () => Mu,
	getFrameIdForPageLoadEvent: () => wu,
	handleEvent: () => xu,
	metricIsLCP: () => Iu,
	reset: () => vu,
	scoreClassificationForDOMContentLoaded: () => ku,
	scoreClassificationForFirstContentfulPaint: () => Eu,
	scoreClassificationForLargestContentfulPaint: () => Ou,
	scoreClassificationForTimeToInteractive: () => Du,
	scoreClassificationForTotalBlockingTime: () => Au
}), mu = /* @__PURE__ */ new Map(), hu = [], gu = /* @__PURE__ */ new Map(), _u = [];
function vu() {
	mu = /* @__PURE__ */ new Map(), yu = [], hu = [], bu = /* @__PURE__ */ new Set(), gu = /* @__PURE__ */ new Map(), _u = [];
}
var yu = [], bu = /* @__PURE__ */ new Set();
function xu(e) {
	if (Ke(e)) {
		_u.push(e);
		return;
	}
	Ie(e) && yu.push(e);
}
function Su(e, t) {
	let n = wu(t), { rendererProcessesByFrame: r } = z(), i = r.get(n);
	if (i && i.get(t.pid) && !On(t)) {
		if (en(t)) {
			let r = C(t.ts - e.ts);
			Cu(n, e, {
				event: t,
				metricName: "FCP",
				classification: Eu(r),
				navigation: e,
				timing: r
			});
			return;
		}
		if (on(t)) {
			Cu(n, e, {
				event: t,
				metricName: "FP",
				classification: "unclassified",
				navigation: e,
				timing: C(t.ts - e.ts)
			});
			return;
		}
		if (sn(t)) {
			let r = C(t.ts - e.ts);
			Cu(n, e, {
				event: t,
				metricName: "DCL",
				classification: ku(r),
				navigation: e,
				timing: r
			});
			return;
		}
		if (cn(t)) {
			let r = C(t.ts - e.ts);
			Cu(n, e, {
				event: t,
				metricName: "TTI",
				classification: Du(r),
				navigation: e,
				timing: r
			});
			let i = M(w(t.args.args.total_blocking_time_ms));
			Cu(n, e, {
				event: t,
				metricName: "TBT",
				classification: Au(i),
				navigation: e,
				timing: i
			});
			return;
		}
		if (an(t)) {
			Cu(n, e, {
				event: t,
				metricName: "L",
				classification: "unclassified",
				navigation: e,
				timing: C(t.ts - e.ts)
			});
			return;
		}
		if (O(t)) {
			let r = t.args.data?.candidateIndex;
			if (!r) throw Error("Largest Contentful Paint unexpectedly had no candidateIndex.");
			let i = C(t.ts - e.ts), a = {
				event: t,
				metricName: "LCP",
				classification: Ou(i),
				navigation: e,
				timing: i
			}, o = S(mu, n, () => /* @__PURE__ */ new Map()), s = S(o, e, () => /* @__PURE__ */ new Map()).get("LCP");
			if (s === void 0) {
				bu.add(a.event), Cu(n, e, a);
				return;
			}
			let c = s.event;
			if (!O(c)) return;
			let l = c.args.data?.candidateIndex;
			if (!l) return;
			l < r && (bu.delete(c), bu.add(a.event), Cu(n, e, a));
			return;
		}
		if (!Qt(t) && !je(t)) return te(t, `Unexpected event type: ${t}`);
	}
}
function Cu(e, t, n) {
	let r = S(mu, e, () => /* @__PURE__ */ new Map()), i = S(r, t, () => /* @__PURE__ */ new Map());
	i.delete(n.metricName), i.set(n.metricName, n);
}
function wu(e) {
	if (en(e) || cn(e) || O(e) || On(e) || je(e) || Qt(e) || on(e)) return e.args.frame;
	if (sn(e) || an(e)) {
		let t = e.args.data?.frame;
		if (!t) throw Error("MarkDOMContent unexpectedly had no frame ID.");
		return t;
	}
	te(e, `Unexpected event type: ${e}`);
}
function Tu(e) {
	if (en(e) || O(e) || on(e)) {
		let { navigationsByNavigationId: t, softNavigationsById: n } = z(), r;
		if (e.name === A.MARK_LCP_CANDIDATE_FOR_SOFT_NAVIGATION && e.args.data?.performanceTimelineNavigationId) {
			if (r = n.get(e.args.data.performanceTimelineNavigationId), !r) return null;
		} else {
			let n = e.args.data?.navigationId;
			if (!n) throw Error(`Trace event unexpectedly had no navigation ID: ${JSON.stringify(e, null, 2)}`);
			r = t.get(n);
		}
		return r || null;
	}
	if (je(e)) {
		let { softNavigationsById: t } = z();
		return t.get(e.args.context.performanceTimelineNavigationId) ?? null;
	}
	if (sn(e) || cn(e) || Qt(e) || an(e)) {
		let t = wu(e), { navigationsByFrameId: n } = z();
		return oi(e, t, n);
	}
	return On(e) ? null : te(e, `Unexpected event type: ${e}`);
}
function Eu(e) {
	let t = Rr(ge(1.8)), n = Rr(ge(3)), r = "bad";
	return e <= n && (r = "ok"), e <= t && (r = "good"), r;
}
function Du(e) {
	let t = Rr(ge(3.8)), n = Rr(ge(7.3)), r = "bad";
	return e <= n && (r = "ok"), e <= t && (r = "good"), r;
}
function Ou(e) {
	let t = Rr(ge(2.5)), n = Rr(ge(4)), r = "bad";
	return e <= n && (r = "ok"), e <= t && (r = "good"), r;
}
function ku(e) {
	return "unclassified";
}
function Au(e) {
	let t = M(w(200)), n = M(w(600)), r = "bad";
	return e <= n && (r = "ok"), e <= t && (r = "good"), r;
}
function ju() {
	let e = [], t = [...mu.values()].flatMap((e) => [...e.values()]);
	for (let n = 0; n < t.length; n++) {
		let r = t[n].get("LCP");
		r?.event && e.push(r.event);
	}
	return e;
}
async function Mu() {
	yu.sort((e, t) => e.ts - t.ts);
	for (let e of yu) {
		let t = Tu(e);
		t && Su(t, e);
	}
	let { navigationsByFrameId: e } = z();
	_u.sort((e, t) => e.ts - t.ts);
	for (let t of _u) {
		let n = t.args.data?.frame;
		if (!n) continue;
		let r = oi(t, n, e);
		r && S(gu, r, () => []).push(t);
	}
	let t = ju(), n = z().mainFrameId, r = yu.filter((e) => !O(e));
	hu = [...t, ...r].filter(Pe).filter((e) => wu(e) === n).sort((e, t) => e.ts - t.ts);
}
function Nu() {
	return {
		metricScoresByFrameId: mu,
		allMarkerEvents: hu,
		metaCharsetCheckEventsByNavigation: gu
	};
}
function Pu() {
	return ["Meta"];
}
var Fu = /* @__PURE__ */ function(e) {
	return e.GOOD = "good", e.OK = "ok", e.BAD = "bad", e.UNCLASSIFIED = "unclassified", e;
}({}), V = /* @__PURE__ */ function(e) {
	return e.FCP = "FCP", e.FP = "FP", e.L = "L", e.LCP = "LCP", e.DCL = "DCL", e.TTI = "TTI", e.TBT = "TBT", e.CLS = "CLS", e.NAV = "Nav", e.SOFT_NAV = "Nav*", e.SOFT_LCP = "LCP*", e;
}({});
function Iu(e) {
	return e.metricName === "LCP";
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/handlers/LargestImagePaintHandler.ts
var Lu = /* @__PURE__ */ e({
	data: () => Uu,
	deps: () => Wu,
	finalize: () => Hu,
	handleEvent: () => Vu,
	reset: () => Bu
}), Ru = /* @__PURE__ */ new Map(), zu = /* @__PURE__ */ new Map();
function Bu() {
	Ru = /* @__PURE__ */ new Map(), zu = /* @__PURE__ */ new Map();
}
function Vu(e) {
	nn(e) && e.args.data && S(Ru, e.pid, () => /* @__PURE__ */ new Map()).set(e.args.data.DOMNodeId, e);
}
async function Hu() {
	let e = Ho().byTime, { traceBounds: t, navigationsByNavigationId: n } = z(), r = Nu().metricScoresByFrameId;
	for (let [i, a] of n) {
		let n = r.get(a.args.frame)?.get(a)?.get(V.LCP)?.event;
		if (!n || !O(n)) continue;
		let o = n.args.data?.nodeId;
		if (!o) continue;
		let s = Ru.get(n.pid)?.get(o), c = s?.args.data?.imageUrl;
		if (!c) continue;
		let l = a?.ts ?? t.min, u = s.ts, d;
		for (let t of e) if (!(t.ts < l)) {
			if (t.ts >= u) break;
			if (t.args.data.url === c || t.args.data.redirects.some((e) => e.url === c)) {
				d = t;
				break;
			}
		}
		d && zu.set(i, d);
	}
}
function Uu() {
	return { lcpRequestByNavigationId: zu };
}
function Wu() {
	return [
		"Meta",
		"NetworkRequests",
		"PageLoadMetrics"
	];
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/handlers/LargestTextPaintHandler.ts
var Gu = /* @__PURE__ */ e({
	data: () => Xu,
	finalize: () => Yu,
	handleEvent: () => Ju,
	reset: () => qu
}), Ku = /* @__PURE__ */ new Map();
function qu() {
	Ku = /* @__PURE__ */ new Map();
}
function Ju(e) {
	rn(e) && e.args.data && Ku.set(e.args.data.DOMNodeId, e);
}
async function Yu() {}
function Xu() {
	return Ku;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/handlers/ScreenshotsHandler.ts
var Zu = /* @__PURE__ */ e({
	data: () => od,
	deps: () => sd,
	finalize: () => id,
	handleEvent: () => rd,
	reset: () => nd,
	screenshotImageDataUri: () => ad
}), Qu = [], $u = [], ed = [], td = [];
function nd() {
	Qu = [], $u = [], td = [], ed = [];
}
function rd(e) {
	Oe(e) ? $u.push(e) : Ae(e) ? ed.push(e) : rt(e) && Qu.push(e);
}
async function id() {
	let e = pi(Qu);
	Object.fromEntries(e.map((e) => {
		let t = e.args.data.beginEvent.args;
		return [("frame_reporter" in t ? t.frame_reporter : t.chrome_frame_reporter).frame_sequence, C(e.ts + e.dur)];
	}));
	for (let e of $u) {
		let { cat: t, name: n, ph: r, pid: i, tid: a } = e, o = j.registerSyntheticEvent({
			rawSourceEvent: e,
			cat: t,
			name: n,
			ph: r,
			pid: i,
			tid: a,
			ts: e.ts,
			args: { dataUri: `data:image/jpg;base64,${e.args.snapshot}` }
		});
		td.push(o);
	}
}
function ad(e) {
	return ke(e) ? e.args.dataUri : `data:image/jpg;base64,${e.args.snapshot}`;
}
function od() {
	return {
		legacySyntheticScreenshots: td.length ? td : null,
		screenshots: ed.length ? ed : null
	};
}
function sd() {
	return ["Meta"];
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/handlers/LayoutShiftsHandler.ts
var cd = /* @__PURE__ */ e({
	LayoutShiftsThreshold: () => Ld,
	MAX_CLUSTER_DURATION: () => ld,
	MAX_SHIFT_TIME_DELTA: () => ud,
	data: () => Pd,
	deps: () => Fd,
	finalize: () => Md,
	handleEvent: () => Dd,
	reset: () => Ed,
	scoreClassificationForLayoutShift: () => Id
}), ld = M(w(5e3)), ud = M(w(1e3)), dd = [], fd = [], pd = [], md = [], hd = [], gd = [], _d = [], vd = [], yd = /* @__PURE__ */ new Set(), bd = [], xd = [], Sd = 0, Cd = -1, H = [], wd = /* @__PURE__ */ new Map(), Td = [];
function Ed() {
	dd = [], fd = [], pd = [], md = [], bd = [], xd = [], hd = [], _d = [], gd = [], vd = [], yd = /* @__PURE__ */ new Set(), H = [], Sd = 0, Td = [], Cd = -1, wd = /* @__PURE__ */ new Map();
}
function Dd(e) {
	if (Qt(e) && !e.args.data?.had_recent_input) {
		dd.push(e);
		return;
	}
	if ($t(e)) {
		fd.push(e);
		return;
	}
	if (Be(e) && pd.push(e), He(e) && md.push(e), Dn(e)) {
		bd.push(e);
		return;
	}
	if (Ye(e) && hd.push(e), Pn(e) && gd.push(e), Xe(e) && _d.push(e), Fn(e) && vd.push({
		display: e.args.display,
		url: e.args.url,
		beginRemoteFontLoadEvent: e
	}), In(e)) for (let t of vd) t.url === e.args.url && (t.name = e.args.name);
	qn(e) && xd.push(e);
}
function Od(e) {
	return {
		min: e,
		max: e,
		range: C(0)
	};
}
function U(e, t) {
	e.max = t, e.range = C(e.max - e.min);
}
function kd(e) {
	let t = od();
	if (t.screenshots) {
		let n = Ei(t.screenshots, e);
		return {
			before: n,
			after: n ? t.screenshots[t.screenshots.indexOf(n) + 1] : null
		};
	}
	if (t.legacySyntheticScreenshots) {
		let n = Ei(t.legacySyntheticScreenshots, e);
		return {
			before: n,
			after: n ? t.legacySyntheticScreenshots[t.legacySyntheticScreenshots.indexOf(n) + 1] : null
		};
	}
	return {
		before: null,
		after: null
	};
}
function Ad() {
	let { traceBounds: e } = z();
	Td.push({
		ts: e.min,
		score: 0
	});
	for (let e of H) {
		let t = 0;
		e.events[0].args.data && Td.push({
			ts: e.clusterWindow.min,
			score: e.events[0].args.data.weighted_score_delta
		});
		for (let n = 0; n < e.events.length; n++) {
			let r = e.events[n];
			r.args.data && (t += r.args.data.weighted_score_delta, Td.push({
				ts: r.ts,
				score: t
			}));
		}
		Td.push({
			ts: e.clusterWindow.max,
			score: 0
		});
	}
}
function jd() {
	yd.clear();
	for (let e of dd) if (e.args.data?.impacted_nodes) for (let t of e.args.data.impacted_nodes) yd.add(t.node_id);
	for (let e of fd) e.args.data?.nodeId && yd.add(e.args.data.nodeId);
	for (let e of pd) e.args.data?.nodeId && yd.add(e.args.data.nodeId);
}
async function Md() {
	dd.sort((e, t) => e.ts - t.ts), bd.sort((e, t) => e.ts - t.ts), fd.sort((e, t) => e.ts - t.ts), hd.sort((e, t) => e.ts - t.ts), gd.sort((e, t) => e.ts - t.ts), _d.sort((e, t) => e.ts - t.ts), vd.sort((e, t) => e.beginRemoteFontLoadEvent.ts - t.beginRemoteFontLoadEvent.ts), xd.sort((e, t) => e.ts - t.ts), await Nd(), Ad(), jd();
}
async function Nd() {
	let { navigationsByFrameId: e, mainFrameId: t, traceBounds: n } = z(), r = e.get(t) || [];
	if (dd.length === 0) return;
	let i = dd[0].ts, a = dd[0].ts, o = null;
	for (let e of dd) {
		let t = e.ts - i > ld, n = e.ts - a > ud, s = c(r, (t) => t.ts < e.ts), l = o !== s && s !== null;
		if (t || n || l || !H.length) {
			let o = e.ts, c = t ? i + ld : Infinity, u = n ? a + ud : Infinity, d = l ? r[s].ts : Infinity, f = Math.min(c, u, d);
			if (H.length > 0) {
				let e = H[H.length - 1];
				U(e.clusterWindow, C(f));
			}
			let p = s === null ? Re : r[s].args.data?.navigationId;
			H.push(j.registerSyntheticEvent({
				name: "SyntheticLayoutShiftCluster",
				rawSourceEvent: e,
				events: [],
				clusterWindow: Od(o),
				clusterCumulativeScore: 0,
				scoreWindows: { good: Od(o) },
				navigationId: p,
				ts: e.ts,
				pid: e.pid,
				tid: e.tid,
				ph: T.COMPLETE,
				cat: "",
				dur: C(-1)
			})), i = o;
		}
		let u = H[H.length - 1], d = s === null ? void 0 : C(e.ts - r[s].ts);
		if (u.clusterCumulativeScore += e.args.data ? e.args.data.weighted_score_delta : 0, !e.args.data) continue;
		let f = j.registerSyntheticEvent({
			rawSourceEvent: e,
			...e,
			name: A.SYNTHETIC_LAYOUT_SHIFT,
			args: {
				frame: e.args.frame,
				data: {
					...e.args.data,
					rawEvent: e,
					navigationId: u.navigationId ?? void 0
				}
			},
			parsedData: {
				timeFromNavigation: d,
				screenshots: kd(e.ts),
				cumulativeWeightedScoreInWindow: u.clusterCumulativeScore,
				sessionWindowData: {
					cumulativeWindowScore: 0,
					id: H.length
				}
			}
		});
		u.events.push(f), U(u.clusterWindow, e.ts), a = e.ts, o = s;
	}
	for (let e of H) {
		let t = 0, i = -1;
		if (e === H[H.length - 1]) {
			let t = ld + e.clusterWindow.min, i = e.clusterWindow.max + ud, a = l(r, (t) => t.ts > e.clusterWindow.max), o = a ? r[a].ts : Infinity, s = Math.min(t, i, n.max, o);
			U(e.clusterWindow, C(s));
		}
		let a = 0, o = null;
		for (let n of e.events) {
			t += n.args.data ? n.args.data.weighted_score_delta : 0, i = n.parsedData.sessionWindowData.id;
			let r = n.ts;
			n.parsedData.sessionWindowData.cumulativeWindowScore = e.clusterCumulativeScore, t < .1 ? U(e.scoreWindows.good, r) : t >= .1 && t < .25 ? (e.scoreWindows.needsImprovement || (U(e.scoreWindows.good, C(r - 1)), e.scoreWindows.needsImprovement = Od(r)), U(e.scoreWindows.needsImprovement, r)) : t >= .25 && (e.scoreWindows.bad || (e.scoreWindows.needsImprovement ? U(e.scoreWindows.needsImprovement, C(r - 1)) : U(e.scoreWindows.good, C(r - 1)), e.scoreWindows.bad = Od(n.ts)), U(e.scoreWindows.bad, r)), e.scoreWindows.bad ? U(e.scoreWindows.bad, e.clusterWindow.max) : e.scoreWindows.needsImprovement ? U(e.scoreWindows.needsImprovement, e.clusterWindow.max) : U(e.scoreWindows.good, e.clusterWindow.max);
			let s = n.args.data?.weighted_score_delta;
			s !== void 0 && s > a && (a = s, o = n);
		}
		o && (e.worstShiftEvent = o, e.rawSourceEvent = o.rawSourceEvent), e.ts = e.events[0].ts, e.dur = C(P(e.events[e.events.length - 1]).endTime - e.events[0].ts + ud), t > Sd && (Cd = i, Sd = t), e.navigationId && S(wd, e.navigationId, () => []).push(e);
	}
}
function Pd() {
	return {
		clusters: H,
		sessionMaxScore: Sd,
		clsWindowID: Cd,
		prePaintEvents: bd,
		layoutInvalidationEvents: fd,
		scheduleStyleInvalidationEvents: pd,
		styleRecalcInvalidationEvents: md,
		renderFrameImplCreateChildFrameEvents: hd,
		domLoadingEvents: gd,
		layoutImageUnsizedEvents: _d,
		remoteFonts: vd,
		scoreRecords: Td,
		backendNodeIds: yd,
		clustersByNavigationId: wd,
		paintImageEvents: xd
	};
}
function Fd() {
	return ["Screenshots", "Meta"];
}
function Id(e) {
	let t = Fu.GOOD;
	return e >= .1 && (t = Fu.OK), e >= .25 && (t = Fu.BAD), t;
}
var Ld = /* @__PURE__ */ function(e) {
	return e[e.GOOD = 0] = "GOOD", e[e.NEEDS_IMPROVEMENT = .1] = "NEEDS_IMPROVEMENT", e[e.BAD = .25] = "BAD", e;
}({}), Rd = /* @__PURE__ */ e({
	data: () => Ud,
	finalize: () => Hd,
	handleEvent: () => Vd,
	reset: () => Bd
}), zd = /* @__PURE__ */ new Map();
function Bd() {
	zd = /* @__PURE__ */ new Map();
}
function Vd(e) {
	if (Ut(e)) {
		let t = S(zd, e.pid, () => []);
		t.push(e), zd.set(e.pid, t);
	}
}
async function Hd() {}
function Ud() {
	return { updateCountersByProcess: zd };
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/handlers/PageFramesHandler.ts
var Wd = /* @__PURE__ */ e({
	data: () => Yd,
	finalize: () => Jd,
	handleEvent: () => qd,
	reset: () => Kd
}), Gd = /* @__PURE__ */ new Map();
function Kd() {
	Gd = /* @__PURE__ */ new Map();
}
function qd(e) {
	if (qt(e)) {
		for (let t of e.args.data?.frames ?? []) Gd.set(t.frame, t);
		return;
	}
	if (Yt(e)) {
		let t = e.args.data;
		if (!t) return;
		let n = Gd.get(t.frame);
		if (!n) return;
		Gd.set(t.frame, {
			...n,
			url: t.url || n.url,
			name: t.name || t.name
		});
	}
}
async function Jd() {}
function Yd() {
	return { frames: Gd };
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/handlers/ScriptsHandler.ts
var Xd = /* @__PURE__ */ e({
	data: () => uf,
	deps: () => $d,
	finalize: () => lf,
	getScriptGeneratedSizes: () => sf,
	handleEvent: () => tf,
	reset: () => ef
}), Zd = /* @__PURE__ */ new Map(), Qd = /* @__PURE__ */ new Map();
function $d() {
	return ["Meta", "NetworkRequests"];
}
function ef() {
	Zd = /* @__PURE__ */ new Map(), Qd = /* @__PURE__ */ new Map();
}
function tf(e) {
	let t = (t, n) => {
		let r = String(n), i = `${t}.${r}`;
		return S(Zd, i, () => ({
			isolate: t,
			scriptId: r,
			frame: "",
			ts: e.ts
		}));
	};
	if (Sr(e) && e.args.data) {
		let { isolate: n, scriptId: r, frame: i } = e.args.data, a = t(n, r);
		a.frame = i, a.ts = e.ts;
		return;
	}
	if (Cr(e)) {
		let { isolate: n, scriptId: r, url: i, sourceUrl: a, sourceMapUrl: o, sourceMapUrlElided: s } = e.args.data, c = t(n, r);
		c.frame ||= Qd.get(String(n)) ?? "", c.url = i, c.ts = e.ts, a && (c.sourceUrl = a), s ? c.sourceMapUrlElided = !0 : o && (c.sourceMapUrl = o);
		return;
	}
	if (wr(e)) {
		let { isolate: n, scriptId: r, sourceText: i } = e.args.data, a = t(n, r);
		a.content = i;
		return;
	}
	if (Tr(e)) {
		let { isolate: n, scriptId: r, sourceText: i } = e.args.data, a = t(n, r);
		a.content = (a.content ?? "") + i;
		return;
	}
	if (fr(e) && e.args.data?.isolate && e.args.data.frame) {
		let { isolate: t, frame: n } = e.args.data;
		if (Qd.get(t) !== n) {
			Qd.set(t, n);
			for (let e of Zd.values()) !e.frame && e.isolate === t && (e.frame = n);
		}
	}
}
function nf(e, t) {
	for (let n of e.frameByProcessId?.values()) {
		let e = n.get(t);
		if (e) return e;
	}
	return null;
}
function rf(e, t) {
	return t.url ? e.find((e) => e.args.data.url === t.url) ?? null : null;
}
function af(e) {
	let t = /* @__PURE__ */ new Map(), n = e.mappings();
	for (let e = 0; e < n.length - 1; e++) {
		let r = n[e], i = n[e + 1];
		r.lineNumber === i.lineNumber && t.set(r, i.columnNumber);
	}
	return t;
}
function of(e) {
	if (!e.sourceMap) throw Error("expected source map");
	let t = e.sourceMap, n = e.content ?? "", r = n.length, i = n.split("\n"), a = {}, o = r, s = o, c = af(e.sourceMap);
	for (let e of t.mappings()) {
		let n = e.sourceURL, r = e.lineNumber, o = e.columnNumber, l = c.get(e);
		if (!n) continue;
		let u = i[r];
		if (u == null) return { errorMessage: `${t.url()} mapping for line out of bounds: ${r + 1}` };
		if (o > u.length) return { errorMessage: `${t.url()} mapping for column out of bounds: ${r + 1}:${o}` };
		let d = 0;
		if (l !== void 0) {
			if (l > u.length) return { errorMessage: `${t.url()} mapping for last column out of bounds: ${r + 1}:${l}` };
			d = l - o;
		} else d = u.length - o + 1;
		a[n] = (a[n] || 0) + d, s -= d;
	}
	return {
		files: a,
		unmappedBytes: s,
		totalBytes: o
	};
}
function sf(e) {
	return e.sourceMap && !e.sizes && (e.sizes = of(e)), e.sizes ?? null;
}
function cf(e, t) {
	if (!t.isFreshRecording && t.metadata?.sourceMaps) {
		if (e.sourceMapUrlElided) {
			if (!e.url) return;
			let n = t.metadata.sourceMaps.find((t) => t.url === e.url);
			return n ? n.sourceMap : void 0;
		}
		if (e.sourceMapUrl && !e.sourceMapUrl.startsWith("data:")) {
			let n = t.metadata.sourceMaps.find((t) => t.sourceMapUrl === e.sourceMapUrl);
			if (n) return n.sourceMap;
		}
	}
}
async function lf(e) {
	let t = z(), n = [...Ho().byId.values()], r = /* @__PURE__ */ new Set();
	for (let e of t.frameByProcessId.values()) for (let t of e.values()) r.add(t.url);
	for (let e of Zd.values()) e.request = rf(n, e) ?? void 0, e.inline = !!e.url && r.has(e.url);
	if (!e.resolveSourceMap) return;
	let i = [];
	for (let n of Zd.values()) {
		if (!n.frame || !n.url || !n.sourceMapUrl && !n.sourceMapUrlElided) continue;
		let r = nf(t, n.frame)?.url;
		if (!r) continue;
		let a = n.url;
		n.sourceUrl && (a = f.completeURL(r, n.sourceUrl) ?? n.sourceUrl);
		let o;
		if (n.sourceMapUrl) {
			if (o = f.completeURL(a, n.sourceMapUrl), !o) continue;
			n.sourceMapUrl = o;
		}
		let s = {
			scriptId: n.scriptId,
			scriptUrl: n.url,
			sourceUrl: a,
			sourceMapUrl: o ?? "",
			frame: n.frame,
			cachedRawSourceMap: cf(n, e)
		}, c = e.resolveSourceMap(s).then((e) => {
			e && (n.sourceMap = e);
		});
		i.push(c.catch((e) => {
			console.error("Uncaught error when resolving source map", s, e);
		}));
	}
	await Promise.all(i);
}
function uf() {
	return { scripts: [...Zd.values()] };
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/handlers/SelectorStatsHandler.ts
var df = /* @__PURE__ */ e({
	data: () => yf,
	finalize: () => vf,
	handleEvent: () => _f,
	reset: () => gf
}), ff = null, pf = null, mf = /* @__PURE__ */ new Map(), hf = [];
function gf() {
	ff = null, pf = null, mf = /* @__PURE__ */ new Map(), hf = [];
}
function _f(e) {
	if (He(e) && e.args.data.subtree && e.args.data.reason === Ve.RELATED_STYLE_RULE && pf && e.args.data.nodeId === pf.backendNodeId) {
		pf.subtree = !0;
		return;
	}
	if (St(e) && ff && e.args.selector_stats) {
		mf.set(ff, { timings: e.args.selector_stats.selector_timings });
		return;
	}
	if (Ue(e)) {
		let t = [];
		e.args.data.selectors?.forEach((e) => {
			t.push({
				selector: e.selector,
				styleSheetId: e.style_sheet_id
			});
		}), t.length > 0 && (pf = {
			frame: e.args.data.frame,
			backendNodeId: e.args.data.nodeId,
			type: xt.StyleInvalidatorInvalidationTracking,
			selectorList: t,
			ts: e.ts,
			tts: e.tts,
			subtree: !1,
			lastRecalcStyleEventTs: ff ? ff.ts : C(0)
		}, hf.push(pf));
	}
	if (Ct(e)) {
		ff = e;
		return;
	}
}
async function vf() {}
function yf() {
	return {
		dataForRecalcStyleEvent: mf,
		invalidatedNodeList: hf
	};
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/handlers/UserInteractionsHandler.ts
var bf = /* @__PURE__ */ e({
	LONG_INTERACTION_THRESHOLD: () => Cf,
	categoryOfInteraction: () => Ff,
	data: () => zf,
	deps: () => Bf,
	finalize: () => Rf,
	handleEvent: () => Mf,
	removeNestedInteractionsAndSetProcessingTime: () => If,
	reset: () => jf,
	scoreClassificationForInteractionToNextPaint: () => Vf
}), xf = [], Sf = [], Cf = M(w(200)), wf = Cf, Tf = M(w(500)), Ef = null, Df = [], Of = [], kf = [], Af = [];
function jf() {
	xf = [], Sf = [], Df = [], kf = [], Af = [], Of = [], Ef = null;
}
function Mf(e) {
	if (We(e)) {
		xf.push(e);
		return;
	}
	if (Ge(e)) {
		Sf.push(e);
		return;
	}
	if (!ln(e) || (un(e) && Af.push(e), !e.args.data || !dn(e))) return;
	let { duration: t, interactionId: n } = e.args.data;
	t < 1 || n === void 0 || n === 0 || kf.push(e);
}
var Nf = /* @__PURE__ */ new Set([
	"pointerdown",
	"touchstart",
	"pointerup",
	"touchend",
	"mousedown",
	"mouseup",
	"click"
]), Pf = /* @__PURE__ */ new Set([
	"keydown",
	"keypress",
	"keyup"
]);
function Ff(e) {
	return Nf.has(e.type) ? "POINTER" : Pf.has(e.type) ? "KEYBOARD" : "OTHER";
}
function If(e) {
	let t = {
		POINTER: /* @__PURE__ */ new Map(),
		KEYBOARD: /* @__PURE__ */ new Map(),
		OTHER: /* @__PURE__ */ new Map()
	};
	function n(e) {
		let n = Ff(e), r = t[n], i = C(e.ts + e.dur), a = r.get(i);
		if (!a) {
			r.set(i, e);
			return;
		}
		if (e.ts < a.ts) r.set(i, e);
		else if (e.ts === a.ts && e.interactionId === a.interactionId) {
			let t = a.processingEnd - a.processingStart;
			e.processingEnd - e.processingStart > t && r.set(i, e);
		}
		e.processingStart < a.processingStart && (a.processingStart = e.processingStart, Lf(a)), e.processingEnd > a.processingEnd && (a.processingEnd = e.processingEnd, Lf(a));
	}
	for (let t of e) n(t);
	let r = Object.values(t).flatMap((e) => Array.from(e.values()));
	return r.sort((e, t) => e.ts - t.ts), r;
}
function Lf(e) {
	let t = e.args.data.beginEvent, n = e.args.data.endEvent;
	e.inputDelay = C(e.processingStart - t.ts), e.mainThreadHandling = C(e.processingEnd - e.processingStart), e.presentationDelay = C(n.ts - e.processingEnd);
}
async function Rf() {
	let { navigationsByFrameId: e } = z(), t = r(kf, Af, ri), n = /* @__PURE__ */ new Map();
	for (let r of t) if (dn(r)) {
		let e = n.get(r.id) ?? [];
		e.push(r), n.set(r.id, e);
	} else if (un(r)) {
		let t = (n.get(r.id) ?? []).pop();
		if (!t) continue;
		let { type: i, interactionId: a, timeStamp: o, processingStart: s, processingEnd: c } = t.args.data;
		if (!i || !a || !o || !s || !c) continue;
		let l = C(M(s) - M(o) + t.ts), u = C(M(c) - M(o) + t.ts), d = t.args.frame ?? t.args.data.frame ?? "", f = oi(t, d, e)?.args.data?.navigationId, p = j.registerSyntheticEvent({
			rawSourceEvent: t,
			cat: t.cat,
			name: t.name,
			pid: t.pid,
			tid: t.tid,
			ph: t.ph,
			processingStart: l,
			processingEnd: u,
			inputDelay: C(-1),
			mainThreadHandling: C(-1),
			presentationDelay: C(-1),
			args: { data: {
				beginEvent: t,
				endEvent: r,
				frame: d,
				navigationId: f
			} },
			ts: t.ts,
			dur: C(r.ts - t.ts),
			type: t.args.data.type,
			interactionId: t.args.data.interactionId
		});
		Lf(p), Df.push(p);
	}
	L(Df), Of.push(...If(Df));
	for (let e of Of) (!Ef || Ef.dur < e.dur) && (Ef = e);
}
function zf() {
	return {
		beginCommitCompositorFrameEvents: xf,
		parseMetaViewportEvents: Sf,
		interactionEvents: Df,
		interactionEventsWithNoNesting: Of,
		longestInteractionEvent: Ef,
		interactionsOverThreshold: new Set(Df.filter((e) => e.dur > Cf))
	};
}
function Bf() {
	return ["Meta"];
}
function Vf(e) {
	return e <= wf ? Fu.GOOD : e <= Tf ? Fu.OK : Fu.BAD;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/handlers/WorkersHandler.ts
var Hf = /* @__PURE__ */ e({
	data: () => Yf,
	finalize: () => Jf,
	handleEvent: () => qf,
	reset: () => Kf
}), Uf = [], Wf = /* @__PURE__ */ new Map(), Gf = /* @__PURE__ */ new Map();
function Kf() {
	Uf = [], Wf = /* @__PURE__ */ new Map(), Gf = /* @__PURE__ */ new Map();
}
function qf(e) {
	Le(e) && Uf.push(e);
}
async function Jf() {
	for (let e of Uf) e.args.data && (Wf.set(e.args.data.workerThreadId, e.args.data.workerId), Gf.set(e.args.data.workerId, e.args.data.url));
}
function Yf() {
	return {
		workerSessionIdEvents: Uf,
		workerIdByThread: Wf,
		workerURLById: Gf
	};
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/handlers/WarningsHandler.ts
var Xf = /* @__PURE__ */ e({
	FORCED_REFLOW_THRESHOLD: () => rp,
	LONG_MAIN_THREAD_TASK_THRESHOLD: () => ip,
	data: () => fp,
	deps: () => up,
	finalize: () => dp,
	handleEvent: () => sp,
	reset: () => ap
}), Zf = /* @__PURE__ */ new Map(), Qf = /* @__PURE__ */ new Map(), $f = [], ep = [], tp = [], np = [], rp = M(w(30)), ip = M(w(50));
function ap() {
	Zf = /* @__PURE__ */ new Map(), Qf = /* @__PURE__ */ new Map(), $f = [], ep = [], tp = [], np = [];
}
function op(e, t) {
	let n = S(Zf, e, () => []);
	n.push(t), Zf.set(e, n);
	let r = S(Qf, t, () => []);
	r.push(e), Qf.set(t, r);
}
function sp(e) {
	if (cp(e), e.name === A.RUN_TASK) {
		let { duration: t } = P(e);
		t > ip && np.push(e);
		return;
	}
	if (Bt(e)) {
		let { duration: t } = Hr(e);
		t > e.args.data.allottedMilliseconds && op(e, "IDLE_CALLBACK_OVER_TIME");
		return;
	}
}
function cp(e) {
	if (lp(e, $f), lp(e, ep, gr(e)), ep.length && (e.name === A.LAYOUT || e.name === A.RECALC_STYLE)) {
		tp.push(e);
		return;
	}
	$f.length === 1 && (tp.reduce((e, t) => e + (t.dur || 0), 0) >= rp && tp.forEach((e) => op(e, "FORCED_REFLOW")), tp.length = 0);
}
function lp(e, t, n = !0) {
	let r = t.at(-1);
	for (; r && e.ts > r.ts + (r.dur || 0);) t.pop(), r = t.at(-1);
	n && t.push(e);
}
function up() {
	return ["UserInteractions", "Workers"];
}
async function dp() {
	let e = zf().interactionsOverThreshold;
	for (let t of e) op(t, "LONG_INTERACTION");
	for (let e of np) e.tid, !Yf().workerIdByThread.has(e.tid) && op(e, "LONG_TASK");
	np.length = 0;
}
function fp() {
	return {
		perEvent: Zf,
		perWarning: Qf
	};
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/handlers/ModelHandlers.ts
var pp = /* @__PURE__ */ e({
	AnimationFrames: () => ta,
	Animations: () => ha,
	AsyncJSCalls: () => Fs,
	AuctionWorklets: () => Ra,
	DOMStats: () => Xs,
	ExtensionTraceData: () => yc,
	Flows: () => Sa,
	Frames: () => el,
	GPU: () => vl,
	ImagePainting: () => El,
	Initiators: () => Rl,
	Invalidations: () => nu,
	LargestImagePaint: () => Lu,
	LargestTextPaint: () => Gu,
	LayerTree: () => Ic,
	LayoutShifts: () => cd,
	Memory: () => Rd,
	Meta: () => Xa,
	NetworkRequests: () => Eo,
	PageFrames: () => Wd,
	PageLoadMetrics: () => pu,
	Renderer: () => ls,
	Samples: () => Xo,
	Screenshots: () => Zu,
	Scripts: () => Xd,
	SelectorStats: () => df,
	UserInteractions: () => bf,
	UserTimings: () => nc,
	Warnings: () => Xf,
	Workers: () => Hf
}), mp = /* @__PURE__ */ new WeakMap(), hp = class e {
	#e;
	#t;
	#n;
	#r = [];
	#i = /* @__PURE__ */ new Set();
	constructor(e) {
		this.#e = e, this.#t = this.#e.data.Renderer.entityMappings, this.#n = this.#a(), this.#r = this.#o();
	}
	static getOrCreate(t) {
		let n = mp.get(t);
		if (n) return n;
		let r = new e(t);
		return mp.set(t, r), r;
	}
	#a() {
		let e = Array.from(this.#e.data.Meta.navigationsByNavigationId.values()).sort((e, t) => e.ts - t.ts)[0]?.args.data?.documentLoaderURL ?? this.#e.data.Meta.mainFrameURL;
		return e ? kr(e, this.#t) ?? null : null;
	}
	#o() {
		return Array.from(this.#t.eventsByEntity.entries()).flatMap(([e, t]) => e === this.#n ? [] : t);
	}
	entityForEvent(e) {
		return this.#t.entityByEvent.get(e) ?? null;
	}
	eventsForEntity(e) {
		return this.#t.eventsByEntity.get(e) ?? [];
	}
	firstPartyEntity() {
		return this.#n;
	}
	thirdPartyEvents() {
		return this.#r;
	}
	mappings() {
		return this.#t;
	}
	updateSourceMapEntities(e, t) {
		if (this.#i.has(e)) return;
		let n = e.url, r = kr(n, this.#t), i = kr(t, this.#t);
		if (i === r || !r || !i) return;
		let a = (r && this.#t.eventsByEntity.get(r)) ?? [], o = [], s = [];
		a?.forEach((t) => {
			let n = gi(t);
			n && Ai(n, e) ? o.push(t) : s.push(t);
		}), this.#t.eventsByEntity.set(r, s), this.#t.eventsByEntity.set(i, o), o.forEach((e) => {
			this.#t.entityByEvent.set(e, i);
		}), this.#i.add(e);
	}
	updateExtensionEntitiesWithName(e) {
		let t = Array.from(this.#t.eventsByEntity.keys());
		for (let [n, r] of e) {
			let e = t.find((e) => e.domains[0] === n);
			e && (e.name = e.company = r);
		}
	}
}, gp = class e {
	#e = /* @__PURE__ */ new Map();
	keyForEvent(e) {
		if (k(e)) return `${de.PROFILE_CALL}-${e.pid}-${e.tid}-${At(e.sampleIndex)}-${e.nodeId}`;
		if (xr(e)) return `${de.LEGACY_TIMELINE_FRAME}-${e.index}`;
		if (at(e)) return null;
		let t = j.getActiveManager().getRawTraceEvents(), n = it(e), r = t.indexOf(n ? e.rawSourceEvent : e);
		if (r === -1) return null;
		let i = it(e) ? `${de.SYNTHETIC_EVENT}-${r}` : `${de.RAW_EVENT}-${r}`;
		return i.length < 3 ? null : i;
	}
	eventForKey(t, n) {
		let r = he(t);
		if (e.isProfileCallKey(r)) return this.#t(r, n);
		if (e.isLegacyTimelineFrameKey(r)) {
			let e = n.data.Frames.frames.at(r.rawIndex);
			if (!e) throw Error(`Unknown trace event. Could not find frame with index ${r.rawIndex}`);
			return e;
		}
		if (e.isSyntheticEventKey(r)) {
			let e = j.getActiveManager().getSyntheticTraces().at(r.rawIndex);
			if (!e) throw Error(`Unknown trace event. Attempted to get a synthetic event from an unknown raw event index: ${r.rawIndex}`);
			return e;
		}
		if (e.isRawEventKey(r)) return j.getActiveManager().getRawTraceEvents()[r.rawIndex];
		throw Error(`Unknown trace event. Serializable key values: ${r.join("-")}`);
	}
	static isProfileCallKey(e) {
		return e.type === de.PROFILE_CALL;
	}
	static isLegacyTimelineFrameKey(e) {
		return e.type === de.LEGACY_TIMELINE_FRAME;
	}
	static isRawEventKey(e) {
		return e.type === de.RAW_EVENT;
	}
	static isSyntheticEventKey(e) {
		return e.type === de.SYNTHETIC_EVENT;
	}
	#t(e, t) {
		let n = this.#e.get(e);
		if (n) return n;
		let r = t.data.Renderer.processes.get(e.processID)?.threads.get(e.threadID)?.profileCalls;
		if (!r) throw Error(`Unknown profile call serializable key: ${e}`);
		let i = r?.find((t) => t.sampleIndex === e.sampleIndex && t.nodeId === e.protocol);
		if (!i) throw Error(`Unknown profile call serializable key: ${JSON.stringify(e)}`);
		return this.#e.set(e, i), i;
	}
}, _p = /* @__PURE__ */ new WeakMap();
function vp(e, t) {
	let n = [], r = t === void 0 ? e.Meta.traceBounds.min : t, i = e.Meta.traceBounds.range, a = _p.get(e)?.get(r);
	if (a) return a;
	let o = e.Screenshots.screenshots ?? e.Screenshots.legacySyntheticScreenshots ?? [];
	for (let e of o) {
		if (e.ts < r) continue;
		let t = {
			index: n.length,
			screenshotEvent: e
		};
		n.push(t);
	}
	let s = {
		zeroTime: r,
		spanTime: i,
		frames: Array.from(n)
	};
	return S(_p, e, () => /* @__PURE__ */ new Map()).set(r, s), s;
}
function yp(e, t) {
	let n = c(e.frames, (e) => e.screenshotEvent.ts < t);
	return n === null ? null : e.frames[n];
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/extras/StackTraceForEvent.ts
var bp = /* @__PURE__ */ new Map();
function xp(e, t) {
	let n = bp.get(t);
	n || (n = /* @__PURE__ */ new Map(), bp.set(t, n));
	let r = n.get(e);
	if (r) return r;
	let i = null;
	if (ce(e)) i = wp(e, t);
	else if (Rn(e)) i = Tp(e, t);
	else {
		i = Sp(e, t);
		let n = Dp(e).filter((e) => !Ep(e));
		if (!i.callFrames.length) i.callFrames = n;
		else for (let e = 0; e < n.length && e < i.callFrames.length; e++) i.callFrames[e] = n[e];
	}
	return i && n.set(e, i), i;
}
function Sp(e, t) {
	let n = t.Renderer.entryToNode.size > 0 ? t.Renderer.entryToNode : t.Samples.entryToNode, r = { callFrames: [] }, i = r, a, o = n.get(e), s = bp.get(t) || /* @__PURE__ */ new Map();
	for (bp.set(t, s); o;) {
		if (!k(o.entry)) {
			let e = t.AsyncJSCalls.runEntryPointToScheduler.get(o.entry);
			if (!e) {
				o = o.parent;
				continue;
			}
			let r = e && n.get(e.scheduler);
			r && (i = Cp(i, e.taskName), o = r);
			continue;
		}
		a = o.entry;
		let e = s.get(o.entry);
		if (e) {
			i.callFrames.push(...e.callFrames.filter((e) => !Ep(e))), i.parent = e.parent, i.description = i.description || e.description;
			break;
		}
		Ep(a.callFrame) || i.callFrames.push(a.callFrame);
		let r = t.AsyncJSCalls.asyncCallToScheduler.get(a), c = r && n.get(r.scheduler);
		if (c) {
			i = Cp(i, r.taskName), o = c;
			continue;
		}
		o = o.parent;
	}
	return r;
}
function Cp(e, t) {
	let n = { callFrames: [] };
	return e.parent = n, n.description = t, n;
}
function wp(e, t) {
	let n = e.rawSourceEvent;
	return Rn(n) ? Tp(n, t) : n ? xp(n, t) : null;
}
function Tp(e, t) {
	let n = e;
	return e.args.traceId === void 0 || (n = t.UserTimings.measureTraceByTraceId.get(e.args.traceId), !n) ? null : xp(n, t);
}
function Ep({ columnNumber: e, lineNumber: t, url: n, scriptId: r }) {
	return t === -1 && e === -1 && n === "" && r === "0";
}
function Dp(e) {
	let t = hi(e) || [], n = [];
	for (let e of t) n.push({
		...e,
		scriptId: String(e.scriptId)
	});
	return n;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/extras/Initiators.ts
function Op(e, t) {
	let n = e.NetworkRequests.incompleteInitiator.get(t);
	if (n?.args.data.mimeType === "text/css") return n;
	let r = xp(t.rawSourceEvent, e)?.parent?.callFrames.at(0);
	return r ? (e.NetworkRequests.requestIdsByURL.get(r.url) ?? []).map((t) => e.NetworkRequests.byId.get(t)).filter((e) => e !== void 0).filter((e) => e.ts < t.ts).at(-1) : n;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/extras/MainThreadActivity.ts
var kp = /* @__PURE__ */ new Set([
	"(program)",
	"(idle)",
	"(root)"
]);
function Ap(e, t) {
	if (!t.length) return e;
	let n = t.filter((e) => !(k(e) && (kp.has(e.callFrame.functionName) || !e.callFrame.functionName)));
	if (n.length === 0) return e;
	function r(e, t) {
		let r = e, i = n[r], a = P(i), o = (a.startTime + a.endTime) / 2, s = 0, c = Math.sign(t - e);
		for (let i = e; i !== t; i += c) {
			let e = n[i], t = P(e), a = (t.startTime + t.endTime) / 2, c = Math.abs(o - a);
			s < .1 * c && (r = i, o = a, s = 0), s += t.duration;
		}
		return r;
	}
	let i = r(n.length - 1, 0), a = P(n[r(0, i)]), o = P(n[i]), s = a.startTime, c = o.endTime, l = c - s;
	return l < e.range * .1 ? e : (s = C(Math.max(s - .05 * l, e.min)), c = C(Math.min(c + .05 * l, e.max)), {
		min: s,
		max: c,
		range: C(c - s)
	});
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/extras/ScriptDuplication.ts
var jp = 512, Mp = .1;
function Np(e) {
	e = e.replace(/\?$/, "");
	let t = e.lastIndexOf("node_modules");
	return t !== -1 && (e = e.substring(t)), e;
}
function Pp(e) {
	return !!(e.includes("webpack/bootstrap") || e.includes("(webpack)/buildin") || e.includes("external "));
}
function Fp(e) {
	for (let [t, n] of e) {
		if (n.duplicates.sort((e, t) => t.attributedSize - e.attributedSize), n.duplicates.length > 1) {
			let e = n.duplicates[0].attributedSize;
			n.duplicates = n.duplicates.filter((t) => t.attributedSize / e >= Mp);
		}
		if (n.duplicates = n.duplicates.filter((e) => e.attributedSize >= jp), n.duplicates.length <= 1) {
			e.delete(t);
			continue;
		}
		n.estimatedDuplicateBytes = n.duplicates.slice(1).reduce((e, t) => e + t.attributedSize, 0);
	}
}
function Ip(e, t, n = 0) {
	let r = e.indexOf(t, n);
	return r === -1 ? e.length : r;
}
function Lp(e) {
	let t = e.split("node_modules/");
	e = t[t.length - 1];
	let n = Ip(e, "/");
	return e[0] === "@" ? e.slice(0, Ip(e, "/", n + 1)) : e.slice(0, n);
}
function Rp(e) {
	let t = /* @__PURE__ */ new Map();
	for (let [n, r] of e) {
		if (!n.includes("node_modules")) {
			t.set(n, r);
			continue;
		}
		let e = "node_modules/" + Lp(n), i = t.get(e) ?? {
			duplicates: [],
			estimatedDuplicateBytes: 0
		};
		t.set(e, i);
		for (let { script: e, attributedSize: t } of r.duplicates) {
			let n = i.duplicates.find((t) => t.script === e);
			n || (n = {
				script: e,
				attributedSize: 0
			}, i.duplicates.push(n)), n.attributedSize += t;
		}
	}
	return t;
}
function zp(e) {
	return new Map([...e].sort((e, t) => t[1].estimatedDuplicateBytes - e[1].estimatedDuplicateBytes));
}
function Bp(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let t of e.scripts) {
		if (!t.content || !t.sourceMap) continue;
		let e = sf(t);
		if (!e) continue;
		if ("errorMessage" in e) {
			console.error(e.errorMessage);
			continue;
		}
		let r = [];
		n.set(t, r);
		let i = t.sourceMap.sourceURLs();
		for (let t = 0; t < i.length; t++) {
			if (Pp(i[t])) continue;
			let n = e.files[i[t]];
			r.push({
				source: Np(i[t]),
				resourceSize: n
			});
		}
	}
	let r = /* @__PURE__ */ new Map();
	for (let [e, i] of n) for (let n of i) {
		let i = r.get(n.source);
		i || (i = {
			estimatedDuplicateBytes: 0,
			duplicates: []
		}, r.set(n.source, i));
		let a = e.request ? t.get(e.request?.args.data.requestId) ?? 1 : 1, o = Math.round(n.resourceSize * a);
		i.duplicates.push({
			script: e,
			attributedSize: o
		});
	}
	let i = Rp(r);
	return Fp(r), Fp(i), {
		duplication: zp(r),
		duplicationGroupedByNodeModules: zp(i)
	};
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/extras/TraceFilter.ts
var Vp = class {}, Hp = class e extends Vp {
	visibleTypes;
	constructor(e) {
		super(), this.visibleTypes = new Set(e);
	}
	accept(t) {
		return ce(t) ? !0 : this.visibleTypes.has(e.eventType(t));
	}
	static eventType(e) {
		return e.cat.includes("blink.console") ? A.CONSOLE_TIME : e.cat.includes("blink.user_timing") ? A.USER_TIMING : e.name;
	}
}, Up = class extends Vp {
	#e;
	constructor(e) {
		super(), this.#e = new Set(e);
	}
	accept(e) {
		return !this.#e.has(e.name);
	}
}, Wp = class {
	totalTime;
	selfTime;
	transferSize;
	id;
	event;
	events;
	parent;
	groupId;
	isGroupNodeInternal;
	depth;
	constructor(e, t) {
		this.totalTime = 0, this.selfTime = 0, this.transferSize = 0, this.id = e, this.event = t, this.events = [t], this.groupId = "", this.isGroupNodeInternal = !1, this.depth = 0;
	}
	isGroupNode() {
		return this.isGroupNodeInternal;
	}
	hasChildren() {
		throw Error("Not implemented");
	}
	setHasChildren(e) {
		throw Error("Not implemented");
	}
	children() {
		throw Error("Not implemented");
	}
	searchTree(e, t) {
		t ||= [], this.event && e(this.event) && t.push(this);
		for (let n of this.children().values()) n.searchTree(e, t);
		return t;
	}
}, Gp = class e extends Wp {
	root;
	hasChildrenInternal;
	childrenInternal;
	parent;
	constructor(e, t, n) {
		super(e, t), this.root = n?.root ?? null, this.hasChildrenInternal = !1, this.childrenInternal = null, this.parent = n;
	}
	hasChildren() {
		return this.hasChildrenInternal;
	}
	setHasChildren(e) {
		this.hasChildrenInternal = e;
	}
	children() {
		return this.childrenInternal || this.buildChildren();
	}
	buildChildren() {
		let t = [];
		for (let e = this; e.parent && !e.isGroupNode(); e = e.parent) t.push(e);
		t.reverse();
		let n = /* @__PURE__ */ new Map(), r = this, i = this.root;
		if (!i) return this.childrenInternal = n, this.childrenInternal;
		let a = i.startTime, o = i.endTime, s = i.doNotAggregate || i.includeInstantEvents ? m : void 0, c = i.doNotAggregate ? void 0 : Xp, l = i.getEventGroupIdCallback(), u = 0, d = 0, f = null;
		Di(i.events, {
			onStartEvent: p,
			onEndEvent: _,
			onInstantEvent: s,
			startTime: M(a),
			endTime: M(o),
			eventFilter: i.filter,
			ignoreAsyncEvents: !1
		});
		function p(e) {
			let { startTime: n, endTime: r } = Hr(e);
			if (++u, u > t.length + 2 || !g(e)) return;
			let i = (r === void 0 ? o : Math.min(r, o)) - Math.max(a, n);
			i < 0 && console.error("Negative event duration"), h(e, i);
		}
		function m(e) {
			++u, d === t.length && u <= t.length + 2 && h(e, 0), --u;
		}
		function h(i, a) {
			if (u === t.length + 2) {
				if (!f) return;
				f.setHasChildren(!0), f.selfTime -= a;
				return;
			}
			let o, s = "";
			c ? (o = c(i), s = l ? l(i) : "", s && (o += "/" + s)) : o = Symbol("uniqueId");
			let d = n.get(o);
			d ? d.events.push(i) : (d = new e(o, i, r), d.groupId = s, n.set(o, d)), d.selfTime += a, d.totalTime += a, Cn(i) && (d.transferSize += i.args.data.encodedDataLength), f = d;
		}
		function g(e) {
			let { endTime: n } = Hr(e);
			if (d === t.length) return !0;
			if (d !== u - 1 || !n) return !1;
			if (!c) return e === t[d].event && ++d, !1;
			let r = c(e), i = l ? l(e) : "";
			return i && (r += "/" + i), r === t[d].id && ++d, !1;
		}
		function _() {
			--u, d > u && (d = u);
		}
		return this.childrenInternal = n, n;
	}
}, Kp = class extends Gp {
	filter;
	startTime;
	endTime;
	eventGroupIdCallback;
	doNotAggregate;
	includeInstantEvents;
	totalTime;
	selfTime;
	constructor(e, { filters: t, startTime: n, endTime: r, doNotAggregate: i, eventGroupIdCallback: a, includeInstantEvents: o }) {
		super("", e[0], null), this.event = e[0], this.root = this, this.events = e, this.filter = (e) => t.every((t) => t.accept(e)), this.startTime = n, this.endTime = r, this.eventGroupIdCallback = a, this.doNotAggregate = i, this.includeInstantEvents = o, this.totalTime = r - n, this.selfTime = this.totalTime;
	}
	children() {
		return this.childrenInternal || this.grouppedTopNodes();
	}
	grouppedTopNodes() {
		let e = super.children();
		for (let t of e.values()) this.selfTime -= t.totalTime;
		if (!this.eventGroupIdCallback) return e;
		let t = /* @__PURE__ */ new Map();
		for (let n of e.values()) {
			let e = this.eventGroupIdCallback(n.event), r = t.get(e);
			r ? r.events.push(...n.events) : (r = new Jp(e, this, n.events), t.set(e, r)), r.addChild(n, n.selfTime, n.totalTime, n.transferSize);
		}
		return this.childrenInternal = t, t;
	}
	getEventGroupIdCallback() {
		return this.eventGroupIdCallback;
	}
}, qp = class extends Wp {
	childrenInternal;
	textFilter;
	filter;
	startTime;
	endTime;
	totalTime;
	eventGroupIdCallback;
	calculateTransferSize;
	forceGroupIdCallback;
	constructor(e, { textFilter: t, filters: n, startTime: r, endTime: i, eventGroupIdCallback: a, calculateTransferSize: o, forceGroupIdCallback: s }) {
		super("", e[0]), this.childrenInternal = null, this.events = e, this.textFilter = t, this.filter = (e) => n.every((t) => t.accept(e)), this.startTime = r, this.endTime = i, this.eventGroupIdCallback = a, this.totalTime = i - r, this.calculateTransferSize = o, this.forceGroupIdCallback = s;
	}
	hasChildren() {
		return !0;
	}
	filterChildren(e) {
		for (let [t, n] of e) n.event && n.depth <= 1 && !this.textFilter.accept(n.event) && e.delete(t);
		return e;
	}
	children() {
		return this.childrenInternal ||= this.filterChildren(this.grouppedTopNodes()), this.childrenInternal;
	}
	ungroupedTopNodes() {
		let e = this, t = this.startTime, n = this.endTime, r = [], i = /* @__PURE__ */ new Map(), a = [n - t], o = [], s = /* @__PURE__ */ new Map(), c = this.eventGroupIdCallback, l = this.forceGroupIdCallback;
		Di(this.events, {
			onStartEvent: u,
			onEndEvent: d,
			onInstantEvent: this.calculateTransferSize ? (t) => {
				if (Cn(t)) {
					let n = Xp(t);
					this.forceGroupIdCallback && this.eventGroupIdCallback && (n = `${n}-${this.eventGroupIdCallback(t)}`);
					let r = i.get(n);
					r ? r.events.push(t) : (r = new Yp(e, n, t, !1, e), i.set(n, r)), t.name === "ResourceReceivedData" ? r.transferSize += t.args.data.encodedDataLength : t.args.data.encodedDataLength > 0 && (r.transferSize = t.args.data.encodedDataLength);
				}
			} : void 0,
			startTime: M(this.startTime),
			endTime: M(this.endTime),
			eventFilter: this.filter,
			ignoreAsyncEvents: !1
		});
		function u(e) {
			let { startTime: i, endTime: u } = Hr(e), d = (u === void 0 ? n : Math.min(u, n)) - Math.max(i, t);
			a[a.length - 1] -= d, a.push(d);
			let f = Xp(e);
			l && c && (f = `${f}-${c(e)}`), r.push(f);
			let p = !s.has(f);
			p && s.set(f, d), o.push(p);
		}
		function d(t) {
			let n = r.pop();
			if (!n) return;
			let c = i.get(n);
			c ? c.events.push(t) : (c = new Yp(e, n, t, !1, e), i.set(n, c)), c.selfTime += a.pop() || 0, o.pop() && (c.totalTime += s.get(n) || 0, s.delete(n)), r.length > 0 && c.setHasChildren(!0);
		}
		this.selfTime = a.pop() || 0;
		for (let e of i) e[1].selfTime <= 0 && (!this.calculateTransferSize || e[1].transferSize <= 0) && i.delete(e[0]);
		return i;
	}
	grouppedTopNodes() {
		let e = this.ungroupedTopNodes();
		if (!this.eventGroupIdCallback) return e;
		let t = /* @__PURE__ */ new Map();
		for (let n of e.values()) {
			let e = this.eventGroupIdCallback(n.event), r = t.get(e);
			if (!r) r = new Jp(e, this, n.events), t.set(e, r);
			else for (let e of n.events) r.events.push(e);
			r.addChild(n, n.selfTime, n.selfTime, n.transferSize);
		}
		return t;
	}
}, Jp = class extends Wp {
	childrenInternal;
	isGroupNodeInternal;
	events;
	constructor(e, t, n) {
		super(e, n[0]), this.events = n, this.childrenInternal = /* @__PURE__ */ new Map(), this.parent = t, this.isGroupNodeInternal = !0;
	}
	addChild(e, t, n, r) {
		this.childrenInternal.set(e.id, e), this.selfTime += t, this.totalTime += n, this.transferSize += r, e.parent = this;
	}
	hasChildren() {
		return !0;
	}
	children() {
		return this.childrenInternal;
	}
}, Yp = class e extends Wp {
	parent;
	root;
	depth;
	cachedChildren;
	hasChildrenInternal;
	constructor(e, t, n, r, i) {
		super(t, n), this.parent = i, this.root = e, this.depth = (i.depth || 0) + 1, this.cachedChildren = null, this.hasChildrenInternal = r;
	}
	hasChildren() {
		return this.hasChildrenInternal;
	}
	setHasChildren(e) {
		this.hasChildrenInternal = e;
	}
	children() {
		if (this.cachedChildren) return this.cachedChildren;
		let t = [0], n = [], r = [], i = /* @__PURE__ */ new Map(), a = this.root.startTime, o = this.root.endTime, s = a, c = this;
		Di(this.root.events, {
			onStartEvent: l,
			onEndEvent: u,
			startTime: M(a),
			endTime: M(o),
			eventFilter: this.root.filter,
			ignoreAsyncEvents: !1
		});
		function l(e) {
			let { startTime: i, endTime: s } = Hr(e), c = (s === void 0 ? o : Math.min(s, o)) - Math.max(i, a);
			c < 0 && console.assert(!1, "Negative duration of an event"), t[t.length - 1] -= c, t.push(c);
			let l = Xp(e);
			n.push(l), r.push(e);
		}
		function u(a) {
			let { startTime: l, endTime: u } = Hr(a), d = t.pop(), f = n.pop();
			r.pop();
			let p;
			for (p = c; p.depth > 1; p = p.parent) if (p.id !== n[n.length + 1 - p.depth]) return;
			if (p.id !== f || n.length < c.depth) return;
			let m = n[n.length - c.depth];
			if (p = i.get(m), p) p.events.push(a);
			else {
				let t = r[r.length - c.depth], n = r.length > c.depth;
				p = new e(c.root, m, t, n, c), i.set(m, p);
			}
			let h = u === void 0 ? o : Math.min(u, o), g = h - Math.max(l, s);
			p.selfTime += d || 0, p.totalTime += g, s = h;
		}
		return this.cachedChildren = this.root.filterChildren(i), this.cachedChildren;
	}
	searchTree(e, t) {
		return t ||= [], this.event && e(this.event) && t.push(this), t;
	}
};
function Xp(e) {
	return k(e) ? `f:${ea.isNativeRuntimeFrame(e.callFrame) ? ea.nativeGroup(e.callFrame.functionName) : e.callFrame.functionName}@${e.callFrame.scriptId || e.callFrame.url || ""}:${e.callFrame.lineNumber}:${e.callFrame.columnNumber}` : Vn(e) && e.args.data ? `${e.name}:${e.args.data.name}` : wn(e) || Cn(e) ? `req:${e.args.data.requestId}` : e.name;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/extras/ThirdParties.ts
function Zp(e) {
	let t = e.Renderer.processes.values().find((e) => {
		let t = e.url ?? "";
		return e.isOnMainFrame && !t.startsWith("about:") && !t.startsWith("chrome:");
	})?.threads.values().find((e) => e.name === "CrRendererMain");
	return t ? t.entries : [];
}
function Qp(e, t) {
	return $p(em(Zp(e).sort(ri), t, (t) => e.Renderer.entityMappings.entityByEvent.get(t)?.name ?? ""), e);
}
function $p(e, t) {
	let n = [], r = [...e.children().values()].flat();
	for (let e of r) {
		if (e.id === "") continue;
		let r = t.Renderer.entityMappings.entityByEvent.get(e.event);
		if (!r) continue;
		let i = {
			transferSize: e.transferSize,
			mainThreadTime: w(e.selfTime),
			entity: r,
			relatedEvents: t.Renderer.entityMappings.eventsByEntity.get(r) ?? []
		};
		n.push(i);
	}
	return n;
}
function em(e, t, n) {
	let r = new Hp(Mi.values().toArray().concat([A.SYNTHETIC_NETWORK_REQUEST])), i = N(t.min), a = N(t.max);
	return new qp(e, {
		textFilter: new Up([]),
		filters: [r],
		startTime: i,
		endTime: a,
		eventGroupIdCallback: n,
		calculateTransferSize: !0,
		forceGroupIdCallback: !0
	});
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/insights/Statistics.ts
var tm = .9, nm = .8999999999999999, rm = .5, im = .49999999999999994;
function am(e) {
	let t = Math.sign(e);
	e = Math.abs(e);
	let n = 1 / (1 + .3275911 * e);
	return t * (1 - n * (.254829592 + n * (-.284496736 + n * (1.421413741 + n * (-1.453152027 + n * 1.061405429)))) * Math.exp(-e * e));
}
function om({ median: e, p10: t }, n) {
	if (e <= 0) throw Error("median must be greater than zero");
	if (t <= 0) throw Error("p10 must be greater than zero");
	if (t >= e) throw Error("p10 must be less than the median");
	if (n <= 0) return 1;
	let r = Math.max(Number.MIN_VALUE, n / e), i = Math.log(r), a = Math.max(Number.MIN_VALUE, t / e), o = -Math.log(a), s = (1 - am(i * .9061938024368232 / o)) / 2, c;
	return c = n <= t ? Math.max(tm, Math.min(1, s)) : n <= e ? Math.max(rm, Math.min(nm, s)) : Math.max(0, Math.min(im, s)), c;
}
function sm(e, t, n, r, i) {
	let a = (r - t) / (n - e);
	return t + (i - e) * a;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/insights/types.ts
var cm = /* @__PURE__ */ function(e) {
	return e.NO_FP = "NO_FP", e.NO_LCP = "NO_LCP", e.NO_DOCUMENT_REQUEST = "NO_DOCUMENT_REQUEST", e.NO_LAYOUT = "NO_LAYOUT", e;
}({}), W = /* @__PURE__ */ function(e) {
	return e.ALL = "All", e.INP = "INP", e.LCP = "LCP", e.CLS = "CLS", e;
}({}), G = /* @__PURE__ */ function(e) {
	return e.LCP_BREAKDOWN = "LCPBreakdown", e.INP_BREAKDOWN = "INPBreakdown", e.CLS_CULPRITS = "CLSCulprits", e.THIRD_PARTIES = "ThirdParties", e.DOCUMENT_LATENCY = "DocumentLatency", e.DOM_SIZE = "DOMSize", e.DUPLICATE_JAVASCRIPT = "DuplicatedJavaScript", e.FONT_DISPLAY = "FontDisplay", e.FORCED_REFLOW = "ForcedReflow", e.IMAGE_DELIVERY = "ImageDelivery", e.LCP_DISCOVERY = "LCPDiscovery", e.LEGACY_JAVASCRIPT = "LegacyJavaScript", e.NETWORK_DEPENDENCY_TREE = "NetworkDependencyTree", e.RENDER_BLOCKING = "RenderBlocking", e.SLOW_CSS_SELECTOR = "SlowCSSSelector", e.VIEWPORT = "Viewport", e.MODERN_HTTP = "ModernHTTP", e.CACHE = "Cache", e.CHARACTER_SET = "CharacterSet", e;
}({}), lm = 50;
function um(e, t) {
	return t.model[e];
}
function dm(e) {
	return Object.values(G).includes(e);
}
function fm(e) {
	let t = um(G.LCP_BREAKDOWN, e);
	return !t || !t.lcpMs || !t.lcpEvent ? null : {
		value: M(t.lcpMs),
		event: t.lcpEvent
	};
}
function pm(e) {
	let t = um(G.INP_BREAKDOWN, e);
	return t?.longestInteractionEvent?.dur ? {
		value: t.longestInteractionEvent.dur,
		event: t.longestInteractionEvent
	} : null;
}
function mm(e) {
	let t = um(G.CLS_CULPRITS, e);
	if (!t) return {
		value: 0,
		worstClusterEvent: null
	};
	let n = 0, r;
	for (let e of t.clusters) e.clusterCumulativeScore > n && (n = e.clusterCumulativeScore, r = e);
	return {
		value: n,
		worstClusterEvent: r ?? null
	};
}
function hm(e) {
	return om({
		p10: 2500,
		median: 4e3
	}, e);
}
function gm(e) {
	return om({
		p10: 200,
		median: 500
	}, e);
}
function _m(e) {
	return om({
		p10: .1,
		median: .25
	}, e);
}
function vm(e, t, n, r = null) {
	return e.find((e) => {
		let i = r ? e[`${r.pageScope}-${r.deviceScope}`]?.record.key : (e["url-ALL"] || e["origin-ALL"])?.record.key;
		return i?.url && i.url === t || i?.origin && i.origin === n;
	});
}
function ym(e, t, n = null) {
	let r = [];
	n ? r.push(n) : (r.push({
		pageScope: "url",
		deviceScope: "ALL"
	}), r.push({
		pageScope: "origin",
		deviceScope: "ALL"
	}));
	for (let n of r) {
		let r = e[`${n.pageScope}-${n.deviceScope}`]?.record.metrics[t]?.percentiles?.p75;
		if (typeof r == "string" && (r = Number(r)), typeof r == "number" && Number.isFinite(r)) return {
			value: r,
			pageScope: n.pageScope
		};
	}
	return null;
}
function bm(e, t, n = null) {
	let r = ym(e, t, n);
	if (r) {
		let e = r.value;
		return {
			value: M(e),
			pageScope: r.pageScope
		};
	}
	return null;
}
function xm(e, t, n = null) {
	let r = t?.cruxFieldData;
	if (!r) return null;
	let i = vm(r, e.url.href, e.url.origin, n);
	return i ? {
		fcp: bm(i, "first_contentful_paint", n),
		lcp: bm(i, "largest_contentful_paint", n),
		inp: bm(i, "interaction_to_next_paint", n),
		cls: ym(i, "cumulative_layout_shift", n),
		lcpBreakdown: {
			ttfb: bm(i, "largest_contentful_paint_image_time_to_first_byte", n),
			loadDelay: bm(i, "largest_contentful_paint_image_resource_load_delay", n),
			loadDuration: bm(i, "largest_contentful_paint_image_resource_load_duration", n),
			renderDelay: bm(i, "largest_contentful_paint_image_element_render_delay", n)
		}
	} : null;
}
function Sm(e, t) {
	let n = {
		lcp: 1 / 3,
		inp: 1 / 3,
		cls: 1 / 3
	};
	if (!t?.cruxFieldData) return n;
	let r = xm(e, t);
	if (!r) return n;
	let i = r.lcp?.value ?? null, a = r.inp?.value ?? null, o = r.cls?.value ?? null, s = i === null ? 0 : hm(N(i)), c = a === null ? 0 : gm(N(a)), l = o === null ? 0 : _m(o), u = 1 - s, d = 1 - c, f = 1 - l, p = u + d + f;
	return p ? (n.lcp = u / p, n.inp = d / p, n.cls = f / p, n) : n;
}
function Cm(e, t, n) {
	let r = t.simulate(n), i = /* @__PURE__ */ new Map();
	n.traverse((t) => {
		if (t.type !== "network") return;
		let n = e.get(t.request.requestId);
		if (!n) return;
		let r = t.request.transferSize;
		i.set(t.request.requestId, r), t.request.transferSize = Math.max(r - n, 0);
	});
	let a = t.simulate(n);
	n.traverse((e) => {
		if (e.type !== "network") return;
		let t = i.get(e.request.requestId);
		t !== void 0 && (e.request.transferSize = t);
	});
	let o = r.timeInMs - a.timeInMs;
	return o = Math.round(o / lm) * lm, w(o);
}
function wm(e, t) {
	if (!t.navigation || !t.lantern) return;
	if (!e.size) return {
		FCP: w(0),
		LCP: w(0)
	};
	let n = t.lantern.simulator, r = t.lantern.metrics.firstContentfulPaint.optimisticGraph, i = t.lantern.metrics.largestContentfulPaint.optimisticGraph;
	return {
		FCP: Cm(e, n, r),
		LCP: Cm(e, n, i)
	};
}
function Tm(e) {
	if (!e.args.data.responseHeaders) return !1;
	let t = [
		/^content-encoding$/i,
		/^x-content-encoding-over-network$/i,
		/^x-original-content-encoding$/i
	], n = [
		"gzip",
		"br",
		"deflate",
		"zstd"
	];
	return e.args.data.responseHeaders.some((e) => t.some((t) => e.name.match(t)) && n.includes(e.value));
}
function Em(e) {
	if (!e.args.data.responseHeaders || e.args.data.failed) return !1;
	if (e.args.data.statusCode === 304) return !0;
	let { transferSize: t, resourceSize: n } = Dm(e);
	return (n ? t / n : 0) < .01;
}
function Dm(e) {
	return {
		resourceSize: e.args.data.decodedBodyLength,
		transferSize: e.args.data.encodedDataLength
	};
}
function Om(e, t, n) {
	if (!e || Em(e)) switch (n) {
		case "Stylesheet": return Math.round(t * .2);
		case "Script":
		case "Document": return Math.round(t * .33);
		default: return Math.round(t * .5);
	}
	let { transferSize: r, resourceSize: i } = Dm(e), a = r;
	if (Tm(e) || (a = i), e.args.data.resourceType === n) return a;
	let o = Number.isFinite(i) && i > 0 ? a / i : 1;
	return Math.round(t * o);
}
function km(e) {
	if (!e.request) return 1;
	let t = e.request, n = t.args.data.decodedBodyLength ?? e.content?.length ?? 0, r = Om(t, n, x.ResourceType.Script);
	return n === 0 || r === 0 ? 1 : r / n;
}
function Am(e) {
	if (e.args.data.protocol === "file") return e.ts;
	let t = e.args.data.timing;
	return t ? C(Rr(t.requestTime) + M(t.receiveHeadersStart ?? t.receiveHeadersEnd)) : null;
}
function jm(e, t) {
	return Jr((e.createOverlays?.() ?? []).map(qr).filter((e) => !!e)) || t;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/insights/Cache.ts
var Mm = /* @__PURE__ */ e({
	UIStrings: () => Nm,
	cachingDisabled: () => Hm,
	computeCacheLifetimeInSeconds: () => zm,
	createOverlayForRequest: () => Gm,
	createOverlays: () => Km,
	generateInsight: () => Wm,
	getCombinedHeaders: () => Vm,
	i18nString: () => Fm,
	isCacheInsight: () => Um,
	isCacheable: () => Rm
}), Nm = {
	title: "Use efficient cache lifetimes",
	description: "A long cache lifetime can speed up repeat visits to your page. [Learn more about caching](https://developer.chrome.com/docs/performance/insights/cache).",
	requestColumn: "Request",
	cacheTTL: "Cache TTL",
	noRequestsToCache: "No requests with inefficient cache policies",
	others: "{PH1} others"
}, Pm = i("models/trace/insights/Cache.ts", Nm), Fm = t.bind(void 0, Pm), Im = .925;
function Lm(e) {
	return {
		insightKey: G.CACHE,
		strings: Nm,
		title: Fm(Nm.title),
		description: Fm(Nm.description),
		docs: "https://developer.chrome.com/docs/performance/insights/cache",
		category: W.ALL,
		state: e.requests.length > 0 ? "fail" : "pass",
		...e
	};
}
function Rm(e) {
	return !Yi.includes(e.args.data.protocol) && !!(qi.has(e.args.data.statusCode) && Ji.has(e.args.data.resourceType || x.ResourceType.Other));
}
function zm(e, t) {
	if (t?.["max-age"] !== void 0) return t["max-age"];
	let n = e.find((e) => e.name === "expires")?.value ?? null;
	if (n) {
		let e = new Date(n).getTime();
		return e ? Math.ceil((e - Date.now()) / 1e3) : 0;
	}
	return null;
}
function Bm(e) {
	let t = [
		0,
		.2,
		1,
		3,
		8,
		12,
		24,
		48,
		72,
		168,
		8760,
		Infinity
	], n = e / 3600, r = t.findIndex((e) => e >= n);
	if (r === t.length - 1) return 1;
	if (r === 0) return 0;
	let i = t[r], a = t[r - 1], o = r / 10;
	return sm(a, (r - 1) / 10, i, o, n);
}
function Vm(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = n.name.toLowerCase();
		t.get(e) ? t.set(e, `${t.get(e)}, ${n.value}`) : t.set(e, n.value);
	}
	return t;
}
function Hm(e, t) {
	let n = e?.get("cache-control") ?? null, r = e?.get("pragma") ?? null;
	return !!(!n && r?.includes("no-cache") || t && (t["must-revalidate"] || t["no-cache"] || t["no-store"] || t.private));
}
function Um(e) {
	return e.insightKey === G.CACHE;
}
function Wm(e, t) {
	let n = e.NetworkRequests.byTime.filter((e) => I(e, t.bounds)), r = [], i = 0, a = /* @__PURE__ */ new Map();
	for (let e of n) {
		if (!e.args.data.responseHeaders || !Rm(e)) continue;
		let t = Vm(e.args.data.responseHeaders), n = Xi(t.get("cache-control") ?? null);
		if (Hm(t, n)) continue;
		let o = zm(e.args.data.responseHeaders, n);
		if (o !== null && (!Number.isFinite(o) || o <= 0) || (o ||= 0, o / 86400 >= 30)) continue;
		let s = Bm(o);
		if (s > Im) continue;
		let c = e.args.data.encodedDataLength || 0, l = (1 - s) * c;
		a.set(e.args.data.requestId, l), i += l, r.push({
			request: e,
			ttl: o,
			wastedBytes: l
		});
	}
	return r.sort((e, t) => t.request.args.data.decodedBodyLength - e.request.args.data.decodedBodyLength || e.ttl - t.ttl), Lm({
		relatedEvents: r.map((e) => e.request),
		requests: r,
		metricSavings: wm(a, t),
		wastedBytes: i
	});
}
function Gm(e) {
	return {
		type: "ENTRY_OUTLINE",
		entry: e,
		outlineReason: "ERROR"
	};
}
function Km(e) {
	return e.requests.map((e) => Gm(e.request));
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/insights/CharacterSet.ts
var qm = /* @__PURE__ */ e({
	UIStrings: () => Jm,
	createOverlays: () => ih,
	generateInsight: () => rh,
	i18nString: () => Xm,
	isCharacterSetInsight: () => Qm
}), Jm = {
	title: "Declare a character encoding",
	description: "A character encoding declaration is required. It can be done with a meta charset tag in the first 1024 bytes of the HTML or in the Content-Type HTTP response header. [Learn more about declaring the character encoding](https://developer.chrome.com/docs/insights/charset/).",
	passingHttpHeader: "Declares charset in HTTP header",
	failedHttpHeader: "Does not declare charset in HTTP header",
	passingMetaCharsetEarly: "Declares charset using a meta tag in the first 1024 bytes",
	failedMetaCharsetLate: "Declares charset using a meta tag after the first 1024 bytes",
	failedMetaCharsetMissing: "Does not declare charset using a meta tag",
	failedMetaCharsetUnknown: "Could not determine meta charset declaration from trace"
}, Ym = i("models/trace/insights/CharacterSet.ts", Jm), Xm = t.bind(void 0, Ym), Zm = /charset\s*=\s*[a-zA-Z0-9\-_:.()]{2,}/i;
function Qm(e) {
	return e.insightKey === G.CHARACTER_SET;
}
function $m(e) {
	let t = !1;
	return e.data && (t = !e.data.checklist.httpCharset.value && !e.data.checklist.metaCharset.value), {
		insightKey: G.CHARACTER_SET,
		strings: Jm,
		title: Xm(Jm.title),
		description: Xm(Jm.description),
		docs: "https://developer.chrome.com/docs/insights/charset/",
		category: W.ALL,
		state: t ? "fail" : "pass",
		...e
	};
}
function eh(e) {
	if (!e.args.data.responseHeaders) return !1;
	for (let t of e.args.data.responseHeaders) if (t.name.toLowerCase() === "content-type") return Zm.test(t.value);
	return !1;
}
function th(e, t) {
	if (t.navigation) return e.PageLoadMetrics.metaCharsetCheckEventsByNavigation.get(t.navigation)?.at(-1)?.args.data?.disposition;
}
function nh(e) {
	switch (e) {
		case "found-in-first-1024-bytes": return Xm(Jm.passingMetaCharsetEarly);
		case "found-after-first-1024-bytes": return Xm(Jm.failedMetaCharsetLate);
		case "not-found": return Xm(Jm.failedMetaCharsetMissing);
		default: return Xm(Jm.failedMetaCharsetUnknown);
	}
}
function rh(e, t) {
	if (!t.navigation) return $m({});
	let n = e.NetworkRequests.byId.get(t.navigationId);
	if (!n) return $m({ warnings: [cm.NO_DOCUMENT_REQUEST] });
	let r = eh(n), i = th(e, t), a = i === "found-in-first-1024-bytes";
	return $m({
		relatedEvents: [n],
		data: {
			hasHttpCharset: r,
			metaCharsetDisposition: i,
			documentRequest: n,
			checklist: {
				httpCharset: {
					label: Xm(r ? Jm.passingHttpHeader : Jm.failedHttpHeader),
					value: r
				},
				metaCharset: {
					label: nh(i),
					value: a
				}
			}
		}
	});
}
function ih(e) {
	return e.data?.documentRequest ? [{
		type: "ENTRY_SELECTED",
		entry: e.data.documentRequest
	}] : [];
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/insights/CLSCulprits.ts
var ah = /* @__PURE__ */ e({
	AnimationFailureReasons: () => lh,
	LayoutShiftType: () => uh,
	UIStrings: () => oh,
	createOverlays: () => Th,
	generateInsight: () => wh,
	getNonCompositedFailure: () => mh,
	i18nString: () => ch,
	isCLSCulpritsInsight: () => bh
}), oh = {
	title: "Layout shift culprits",
	description: "Layout shifts occur when elements move absent any user interaction. [Investigate the causes of layout shifts](https://developer.chrome.com/docs/performance/insights/cls-culprit), such as elements being added, removed, or their fonts changing as the page loads.",
	worstLayoutShiftCluster: "Worst layout shift cluster",
	worstCluster: "Worst cluster",
	layoutShiftCluster: "Layout shift cluster @ {PH1}",
	topCulprits: "Top layout shift culprits",
	injectedIframe: "Injected iframe",
	webFont: "Web font",
	animation: "Animation",
	unsizedImage: "Unsized image element",
	noLayoutShifts: "No layout shifts",
	noCulprits: "Could not detect any layout shift culprits"
}, sh = i("models/trace/insights/CLSCulprits.ts", oh), ch = t.bind(void 0, sh), lh = /* @__PURE__ */ function(e) {
	return e.ACCELERATED_ANIMATIONS_DISABLED = "ACCELERATED_ANIMATIONS_DISABLED", e.EFFECT_SUPPRESSED_BY_DEVTOOLS = "EFFECT_SUPPRESSED_BY_DEVTOOLS", e.INVALID_ANIMATION_OR_EFFECT = "INVALID_ANIMATION_OR_EFFECT", e.EFFECT_HAS_UNSUPPORTED_TIMING_PARAMS = "EFFECT_HAS_UNSUPPORTED_TIMING_PARAMS", e.EFFECT_HAS_NON_REPLACE_COMPOSITE_MODE = "EFFECT_HAS_NON_REPLACE_COMPOSITE_MODE", e.TARGET_HAS_INVALID_COMPOSITING_STATE = "TARGET_HAS_INVALID_COMPOSITING_STATE", e.TARGET_HAS_INCOMPATIBLE_ANIMATIONS = "TARGET_HAS_INCOMPATIBLE_ANIMATIONS", e.TARGET_HAS_CSS_OFFSET = "TARGET_HAS_CSS_OFFSET", e.ANIMATION_AFFECTS_NON_CSS_PROPERTIES = "ANIMATION_AFFECTS_NON_CSS_PROPERTIES", e.TRANSFORM_RELATED_PROPERTY_CANNOT_BE_ACCELERATED_ON_TARGET = "TRANSFORM_RELATED_PROPERTY_CANNOT_BE_ACCELERATED_ON_TARGET", e.TRANSFROM_BOX_SIZE_DEPENDENT = "TRANSFROM_BOX_SIZE_DEPENDENT", e.FILTER_RELATED_PROPERTY_MAY_MOVE_PIXELS = "FILTER_RELATED_PROPERTY_MAY_MOVE_PIXELS", e.UNSUPPORTED_CSS_PROPERTY = "UNSUPPORTED_CSS_PROPERTY", e.MIXED_KEYFRAME_VALUE_TYPES = "MIXED_KEYFRAME_VALUE_TYPES", e.TIMELINE_SOURCE_HAS_INVALID_COMPOSITING_STATE = "TIMELINE_SOURCE_HAS_INVALID_COMPOSITING_STATE", e.ANIMATION_HAS_NO_VISIBLE_CHANGE = "ANIMATION_HAS_NO_VISIBLE_CHANGE", e.AFFECTS_IMPORTANT_PROPERTY = "AFFECTS_IMPORTANT_PROPERTY", e.SVG_TARGET_HAS_INDEPENDENT_TRANSFORM_PROPERTY = "SVG_TARGET_HAS_INDEPENDENT_TRANSFORM_PROPERTY", e;
}({}), uh = /* @__PURE__ */ function(e) {
	return e[e.WEB_FONT = 0] = "WEB_FONT", e[e.IFRAMES = 1] = "IFRAMES", e[e.ANIMATIONS = 2] = "ANIMATIONS", e[e.UNSIZED_IMAGE = 3] = "UNSIZED_IMAGE", e;
}({}), dh = [
	{
		flag: 1,
		failure: "ACCELERATED_ANIMATIONS_DISABLED"
	},
	{
		flag: 2,
		failure: "EFFECT_SUPPRESSED_BY_DEVTOOLS"
	},
	{
		flag: 4,
		failure: "INVALID_ANIMATION_OR_EFFECT"
	},
	{
		flag: 8,
		failure: "EFFECT_HAS_UNSUPPORTED_TIMING_PARAMS"
	},
	{
		flag: 16,
		failure: "EFFECT_HAS_NON_REPLACE_COMPOSITE_MODE"
	},
	{
		flag: 32,
		failure: "TARGET_HAS_INVALID_COMPOSITING_STATE"
	},
	{
		flag: 64,
		failure: "TARGET_HAS_INCOMPATIBLE_ANIMATIONS"
	},
	{
		flag: 128,
		failure: "TARGET_HAS_CSS_OFFSET"
	},
	{
		flag: 512,
		failure: "ANIMATION_AFFECTS_NON_CSS_PROPERTIES"
	},
	{
		flag: 1024,
		failure: "TRANSFORM_RELATED_PROPERTY_CANNOT_BE_ACCELERATED_ON_TARGET"
	},
	{
		flag: 2048,
		failure: "TRANSFROM_BOX_SIZE_DEPENDENT"
	},
	{
		flag: 4096,
		failure: "FILTER_RELATED_PROPERTY_MAY_MOVE_PIXELS"
	},
	{
		flag: 8192,
		failure: "UNSUPPORTED_CSS_PROPERTY"
	},
	{
		flag: 32768,
		failure: "MIXED_KEYFRAME_VALUE_TYPES"
	},
	{
		flag: 65536,
		failure: "TIMELINE_SOURCE_HAS_INVALID_COMPOSITING_STATE"
	},
	{
		flag: 1 << 17,
		failure: "ANIMATION_HAS_NO_VISIBLE_CHANGE"
	},
	{
		flag: 1 << 18,
		failure: "AFFECTS_IMPORTANT_PROPERTY"
	},
	{
		flag: 1 << 19,
		failure: "SVG_TARGET_HAS_INDEPENDENT_TRANSFORM_PROPERTY"
	}
], fh = Rr(ge(.5));
function ph(e, t) {
	let n = e.dur ? e.ts + e.dur : e.ts;
	return n < t.ts && n >= t.ts - fh;
}
function mh(e) {
	let t = [], n = e.args.data.beginEvent, r = e.args.data.instantEvents || [];
	for (let i of r) {
		let r = i.args.data.compositeFailed, a = i.args.data.unsupportedProperties;
		if (!r) continue;
		let o = dh.filter((e) => r & e.flag).map((e) => e.failure), s = {
			name: n.args.data.displayName,
			failureReasons: o,
			unsupportedProperties: a,
			animation: e
		};
		t.push(s);
	}
	return t;
}
function hh(e, t, n, r) {
	let i = [];
	for (let a of e) {
		let e = mh(a);
		if (!e) continue;
		i.push(...e);
		let o = _h(t, a);
		if (!o || !ph(a, o)) continue;
		let s = n.get(o);
		if (s) for (let t of s) {
			let n = r.get(t);
			if (!n) throw Error("Unaccounted shift");
			n.nonCompositedAnimations.push(...e);
		}
	}
	return i;
}
function gh(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let r of t) {
		let t = l(e, (e) => e.ts >= r.ts);
		if (t !== null) for (let i = t; i < e.length; i++) {
			let t = e[i];
			if (t.ts >= r.ts && t.ts <= r.ts + r.dur && S(n, r, () => []).push(t), t.ts > r.ts + r.dur) break;
		}
	}
	return n;
}
function _h(e, t) {
	let n = l(e, (e) => e.ts > t.ts + (t.dur || 0));
	if (n !== null) return e[n];
}
function vh(e, t, n, r, i, a) {
	for (let o of t) {
		let t = _h(n, o);
		if (!t) continue;
		let s = r.get(t);
		if (s) for (let t of s) {
			let n = i.get(t);
			if (!n) throw Error("Unaccounted shift");
			let r = a.find((e) => {
				let t = C(o.ts + (o.dur ?? 0));
				return e.ts >= o.ts && e.ts <= t;
			});
			if (r?.args.frame) {
				let t = r.args.frame, i, a = e.Meta.rendererProcessesByFrame.get(t);
				a && a.size > 0 && (i = [...a.values()][0]?.[0].frame.url), n.iframes.push({
					frame: t,
					url: i
				});
			}
		}
	}
	return i;
}
function yh(e, t, n, r) {
	return n.forEach((n, i) => {
		let a = _h(t, i);
		if (!a) return;
		let o = e.find((e) => e.args.data.nodeId === a.args.data.nodeId);
		if (o) for (let e of n) {
			let t = r.get(e);
			if (!t) throw Error("Unaccounted shift");
			t.unsizedImages.push({
				backendNodeId: o.args.data.nodeId,
				paintImageEvent: a
			});
		}
	}), r;
}
function bh(e) {
	return e.insightKey === G.CLS_CULPRITS;
}
function xh(e, t, n, r) {
	let i = e.filter((e) => e.args.data.resourceType === "Font" && e.args.data.mimeType.startsWith("font"));
	for (let e of i) {
		let i = _h(t, e);
		if (!i || !ph(e, i)) continue;
		let a = n.get(i);
		if (a) for (let t of a) {
			let n = r.get(t);
			if (!n) throw Error("Unaccounted shift");
			n.webFonts.push(e);
		}
	}
	return r;
}
function Sh(e, t) {
	let n = [], r = e.events;
	for (let e of r) {
		let r = t.get(e);
		if (!r) continue;
		let i = r.webFonts, a = r.iframes, o = r.nonCompositedAnimations, s = r.unsizedImages;
		for (let e = 0; e < i.length && n.length < 3; e++) n.push({
			type: 0,
			description: ch(oh.webFont)
		});
		for (let e = 0; e < a.length && n.length < 3; e++) n.push({
			type: 1,
			description: ch(oh.injectedIframe)
		});
		for (let e = 0; e < o.length && n.length < 3; e++) n.push({
			type: 2,
			description: ch(oh.animation)
		});
		for (let e = 0; e < s.length && n.length < 3; e++) n.push({
			type: 3,
			description: ch(oh.unsizedImage),
			url: s[e].paintImageEvent.args.data.url || "",
			backendNodeId: s[e].backendNodeId,
			frame: s[e].paintImageEvent.args.data.frame || ""
		});
		if (n.length >= 3) break;
	}
	return n.slice(0, 3);
}
function Ch(e) {
	let t = "pass";
	return e.worstCluster && (t = Id(e.worstCluster.clusterCumulativeScore) === Fu.GOOD ? "informative" : "fail"), {
		insightKey: G.CLS_CULPRITS,
		strings: oh,
		title: ch(oh.title),
		description: ch(oh.description),
		docs: "https://developer.chrome.com/docs/performance/insights/cls-culprit",
		category: W.CLS,
		state: t,
		...e
	};
}
function wh(e, t) {
	let n = (e) => I(e, t.bounds), r = e.Animations.animations.filter(n), i = e.LayoutShifts.renderFrameImplCreateChildFrameEvents.filter(n), a = e.NetworkRequests.byTime.filter(n), o = e.LayoutShifts.domLoadingEvents.filter(n), s = e.LayoutShifts.layoutImageUnsizedEvents.filter(n), c = t.navigation ? t.navigationId : Re, l = e.LayoutShifts.clustersByNavigationId.get(c) ?? [], u = l.toSorted((e, t) => t.clusterCumulativeScore - e.clusterCumulativeScore).at(0), d = l.flatMap((e) => e.events), f = e.LayoutShifts.prePaintEvents.filter(n), p = e.LayoutShifts.paintImageEvents.filter(n), m = /* @__PURE__ */ new Map(), h = gh(d, f);
	for (let e of d) m.set(e, {
		iframes: [],
		webFonts: [],
		nonCompositedAnimations: [],
		unsizedImages: []
	});
	vh(e, i, f, h, m, o), xh(a, f, h, m), yh(s, p, h, m);
	let g = hh(r, f, h, m), _ = [...d];
	u && _.push(u);
	let v = /* @__PURE__ */ new Map();
	for (let e of l) v.set(e, Sh(e, m));
	return Ch({
		relatedEvents: _,
		animationFailures: g,
		shifts: m,
		clusters: l,
		worstCluster: u,
		topCulpritsByCluster: v
	});
}
function Th(e) {
	let t = (e.clusters.toSorted((e, t) => t.clusterCumulativeScore - e.clusterCumulativeScore) ?? [])[0];
	if (!t) return [];
	let n = C(t.dur ?? 0), r = C(t.ts + n);
	return [{
		type: "TIMESPAN_BREAKDOWN",
		sections: [{
			bounds: {
				min: t.ts,
				range: n,
				max: r
			},
			label: ch(oh.worstLayoutShiftCluster),
			showDuration: !1
		}],
		entry: t.events[0],
		renderLocation: "ABOVE_EVENT"
	}];
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/insights/DocumentLatency.ts
var Eh = /* @__PURE__ */ e({
	UIStrings: () => K,
	createOverlays: () => Lh,
	generateInsight: () => Ih,
	i18nString: () => Oh,
	isDocumentLatencyInsight: () => Mh
}), K = {
	title: "Document request latency",
	description: "Your first network request is the most important. [Reduce its latency](https://developer.chrome.com/docs/performance/insights/document-latency) by avoiding redirects, ensuring a fast server response, and enabling text compression.",
	passingRedirects: "Avoids redirects",
	failedRedirects: "Had redirects ({PH1} redirects, +{PH2})",
	passingServerResponseTime: "Server responds quickly (observed {PH1})",
	failedServerResponseTime: "Server responded slowly (observed {PH1})",
	passingTextCompression: "Applies text compression",
	failedTextCompression: "No compression applied",
	redirectsLabel: "Redirects",
	serverResponseTimeLabel: "Server response time",
	uncompressedDownload: "Uncompressed download"
}, Dh = i("models/trace/insights/DocumentLatency.ts", K), Oh = t.bind(void 0, Dh), kh = 600, Ah = 100, jh = 1400;
function Mh(e) {
	return e.insightKey === "DocumentLatency";
}
function Nh(e) {
	if (globalThis.isLightrider) return e.args.data.lrServerResponseTime ?? null;
	if (!e.args.data.timing) return null;
	let t = N(e.args.data.syntheticData.serverResponseTime);
	return Math.round(t);
}
function Ph(e) {
	if (Tm(e)) return 0;
	let t = e.args.data.decodedBodyLength, n = 0;
	switch (e.args.data.mimeType) {
		case "text/css":
			n = Math.round(t * .8);
			break;
		case "text/html":
		case "text/javascript":
			n = Math.round(t * .67);
			break;
		case "text/plain":
		case "text/xml":
		case "text/x-component":
		case "application/javascript":
		case "application/json":
		case "application/manifest+json":
		case "application/vnd.api+json":
		case "application/xml":
		case "application/xhtml+xml":
		case "application/rss+xml":
		case "application/atom+xml":
		case "application/vnd.ms-fontobject":
		case "application/x-font-ttf":
		case "application/x-font-opentype":
		case "application/x-font-truetype":
		case "image/svg+xml":
		case "image/x-icon":
		case "image/vnd.microsoft.icon":
		case "font/ttf":
		case "font/eot":
		case "font/otf":
		case "font/opentype": n = Math.round(t * .5);
	}
	return n < jh ? 0 : n;
}
function Fh(e) {
	let t = !1;
	return e.data && (t = !e.data.checklist.usesCompression.value || !e.data.checklist.serverResponseIsFast.value || !e.data.checklist.noRedirects.value), {
		insightKey: G.DOCUMENT_LATENCY,
		strings: K,
		title: Oh(K.title),
		description: Oh(K.description),
		docs: "https://developer.chrome.com/docs/performance/insights/document-latency",
		category: W.ALL,
		state: t ? "fail" : "pass",
		...e
	};
}
function Ih(e, t) {
	if (!t.navigation) return Fh({});
	let n = t.options.insightTimeFormatters?.milli ?? a, r = e.NetworkRequests.byId.get(t.navigationId);
	if (!r) return Fh({ warnings: [cm.NO_DOCUMENT_REQUEST] });
	let i = Nh(r);
	if (i === null) throw Error("missing document request timing");
	let o = i > kh, s = 0;
	i > kh && (s = Math.max(i - Ah, 0));
	let c = Math.round(r.args.data.syntheticData.redirectionDuration / 1e3);
	s += c;
	let l = {
		FCP: s,
		LCP: s
	}, u = Ph(r), d = c === 0, f = !o, p = u === 0;
	return Fh({
		relatedEvents: [r],
		data: {
			serverResponseTime: i,
			redirectDuration: w(c),
			uncompressedResponseBytes: u,
			documentRequest: r,
			checklist: {
				noRedirects: {
					label: d ? Oh(K.passingRedirects) : Oh(K.failedRedirects, {
						PH1: r.args.data.redirects.length,
						PH2: n(c)
					}),
					value: d
				},
				serverResponseIsFast: {
					label: Oh(f ? K.passingServerResponseTime : K.failedServerResponseTime, { PH1: n(i) }),
					value: f
				},
				usesCompression: {
					label: Oh(p ? K.passingTextCompression : K.failedTextCompression),
					value: p
				}
			}
		},
		metricSavings: l,
		wastedBytes: u
	});
}
function Lh(e) {
	if (!e.data?.documentRequest) return [];
	let t = [], n = e.data.documentRequest, r = M(e.data.redirectDuration), i = [];
	if (e.data.redirectDuration) {
		let e = F(n.ts, n.ts + r);
		i.push({
			bounds: e,
			label: Oh(K.redirectsLabel),
			showDuration: !0
		}), t.push({
			type: "CANDY_STRIPED_TIME_RANGE",
			bounds: e,
			entry: n
		});
	}
	if (!e.data.checklist.serverResponseIsFast.value) {
		let t = M(e.data.serverResponseTime), r = M(n.args.data.timing?.sendEnd ?? w(0)), a = F(r, r + t);
		i.push({
			bounds: a,
			label: Oh(K.serverResponseTimeLabel),
			showDuration: !0
		});
	}
	if (e.data.uncompressedResponseBytes) {
		let e = F(n.args.data.syntheticData.downloadStart, n.args.data.syntheticData.downloadStart + n.args.data.syntheticData.download);
		i.push({
			bounds: e,
			label: Oh(K.uncompressedDownload),
			showDuration: !0
		}), t.push({
			type: "CANDY_STRIPED_TIME_RANGE",
			bounds: e,
			entry: n
		});
	}
	return i.length && t.push({
		type: "TIMESPAN_BREAKDOWN",
		sections: i,
		entry: e.data.documentRequest,
		renderLocation: "BELOW_EVENT"
	}), t.push({
		type: "ENTRY_SELECTED",
		entry: e.data.documentRequest
	}), t;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/insights/DOMSize.ts
var Rh = /* @__PURE__ */ e({
	UIStrings: () => zh,
	createOverlays: () => Jh,
	generateInsight: () => qh,
	i18nString: () => Vh,
	isDomSizeInsight: () => Kh
}), zh = {
	title: "Optimize DOM size",
	description: "A large DOM can increase the duration of style calculations and layout reflows, impacting page responsiveness. A large DOM will also increase memory usage. [Learn how to avoid an excessive DOM size](https://developer.chrome.com/docs/performance/insights/dom-size).",
	statistic: "Statistic",
	value: "Value",
	element: "Element",
	totalElements: "Total elements",
	maxDOMDepth: "DOM depth",
	maxChildren: "Most children",
	topUpdatesDescription: "These are the largest layout and style recalculation events. Their performance impact may be reduced by making the DOM simpler.",
	duration: "Duration",
	largeLayout: "Layout ({PH1} objects)",
	largeStyleRecalc: "Style recalculation ({PH1} elements)"
}, Bh = i("models/trace/insights/DOMSize.ts", zh), Vh = t.bind(void 0, Bh), Hh = M(w(40)), Uh = 100, Wh = 300;
function Gh(e) {
	let t = [...e.largeLayoutUpdates, ...e.largeStyleRecalcs];
	return {
		insightKey: G.DOM_SIZE,
		strings: zh,
		title: Vh(zh.title),
		description: Vh(zh.description),
		docs: "https://developer.chrome.com/docs/performance/insights/dom-size",
		category: W.INP,
		state: t.length > 0 ? "informative" : "pass",
		...e,
		relatedEvents: t
	};
}
function Kh(e) {
	return e.insightKey === G.DOM_SIZE;
}
function qh(e, t) {
	let n = (e) => I(e, t.bounds), r = t.navigation?.tid, i = [], a = [], o = Zc(e.Renderer, e.AuctionWorklets);
	for (let s of o) {
		if (s.type !== Yc.MAIN_THREAD) continue;
		if (r === void 0) {
			if (!s.processIsOnMainFrame) continue;
		} else if (s.tid !== r) continue;
		let o = e.Renderer.processes.get(s.pid)?.threads.get(s.tid);
		if (!o) continue;
		let { entries: c, layoutEvents: l, recalcStyleEvents: u } = o;
		if (!c.length) continue;
		let d = c[0], f = c[c.length - 1];
		if (Yr({
			timeRange: F(d.ts, C(f.ts + (f.dur ?? 0))),
			bounds: t.bounds
		})) {
			for (let e of l) {
				if (e.dur < Hh || !n(e)) continue;
				let { dirtyObjects: t } = e.args.beginData;
				t > Uh && i.push(e);
			}
			for (let e of u) {
				if (e.dur < Hh || !n(e)) continue;
				let { elementCount: t } = e.args;
				t > Wh && a.push(e);
			}
		}
	}
	let s = [...i.map((e) => {
		let t = e.dur / 1e3, n = e.args.beginData.dirtyObjects;
		return {
			label: Vh(zh.largeLayout, { PH1: n }),
			duration: t,
			size: n,
			event: e
		};
	}), ...a.map((e) => {
		let t = e.dur / 1e3, n = e.args.elementCount;
		return {
			label: Vh(zh.largeStyleRecalc, { PH1: n }),
			duration: t,
			size: n,
			event: e
		};
	})].sort((e, t) => t.duration - e.duration).slice(0, 5), c = e.DOMStats.domStatsByFrameId.get(t.frameId)?.filter(n) ?? [], l;
	for (let e of c) {
		let n = t.navigation?.pid;
		n && e.pid !== n || (!l || e.args.data.totalElements > l.args.data.totalElements) && (l = e);
	}
	return Gh({
		largeLayoutUpdates: i,
		largeStyleRecalcs: a,
		largeUpdates: s,
		maxDOMStats: l
	});
}
function Jh(e) {
	return [...e.largeStyleRecalcs, ...e.largeLayoutUpdates].map((e) => ({
		type: "ENTRY_OUTLINE",
		entry: e,
		outlineReason: "ERROR"
	}));
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/insights/DuplicatedJavaScript.ts
var Yh = /* @__PURE__ */ e({
	UIStrings: () => Xh,
	createOverlays: () => ng,
	generateInsight: () => tg,
	i18nString: () => Qh,
	isDuplicatedJavaScriptInsight: () => eg
}), Xh = {
	title: "Duplicated JavaScript",
	description: "Remove large, [duplicate JavaScript modules](https://developer.chrome.com/docs/performance/insights/duplicated-javascript) from bundles to reduce unnecessary bytes consumed by network activity.",
	columnSource: "Source",
	columnDuplicatedBytes: "Duplicated bytes",
	noDuplicatedJavaScript: "No duplicated JavaScript found"
}, Zh = i("models/trace/insights/DuplicatedJavaScript.ts", Xh), Qh = t.bind(void 0, Zh);
function $h(e) {
	let t = e.scriptsWithDuplication.map((e) => e.request).filter((e) => !!e);
	return {
		insightKey: G.DUPLICATE_JAVASCRIPT,
		strings: Xh,
		title: Qh(Xh.title),
		description: Qh(Xh.description),
		docs: "https://developer.chrome.com/docs/performance/insights/duplicated-javascript",
		category: W.LCP,
		state: e.duplication.values().next().value ? "fail" : "pass",
		relatedEvents: [...new Set(t)],
		...e
	};
}
function eg(e) {
	return e.insightKey === G.DUPLICATE_JAVASCRIPT;
}
function tg(e, t) {
	let n = e.Scripts.scripts.filter((e) => e.frame !== t.frameId || e.url?.startsWith("chrome-extension://") ? !1 : Xr(t.bounds, e.ts)), r = /* @__PURE__ */ new Map();
	for (let e of n) e.request && r.set(e.request.args.data.requestId, km(e));
	let { duplication: i, duplicationGroupedByNodeModules: a } = Bp({ scripts: n }, r), o = [...i.values().flatMap((e) => e.duplicates.map((e) => e.script))], s = /* @__PURE__ */ new Map();
	for (let { duplicates: e } of i.values()) for (let t = 1; t < e.length; t++) {
		let n = e[t];
		if (!n.script.request) continue;
		let r = n.attributedSize, i = n.script.request.args.data.requestId;
		s.set(i, (s.get(i) || 0) + r);
	}
	return $h({
		duplication: i,
		duplicationGroupedByNodeModules: a,
		scriptsWithDuplication: [...new Set(o)],
		scripts: n,
		mainDocumentUrl: t.navigation?.args.data?.url ?? e.Meta.mainFrameURL,
		metricSavings: wm(s, t),
		wastedBytes: s.values().reduce((e, t) => e + t, 0)
	});
}
function ng(e) {
	return e.scriptsWithDuplication.map((e) => e.request).filter((e) => !!e).map((e) => ({
		type: "ENTRY_OUTLINE",
		entry: e,
		outlineReason: "ERROR"
	}));
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/insights/FontDisplay.ts
var rg = /* @__PURE__ */ e({
	UIStrings: () => ig,
	createOverlays: () => ug,
	generateInsight: () => lg,
	i18nString: () => og,
	isFontDisplayInsight: () => cg
}), ig = {
	title: "Font display",
	description: "Consider setting [`font-display`](https://developer.chrome.com/docs/performance/insights/font-display) to `swap` or `optional` to ensure text is consistently visible. `swap` can be further optimized to mitigate layout shifts with [font metric overrides](https://developer.chrome.com/blog/font-fallbacks).",
	fontColumn: "Font",
	wastedTimeColumn: "Wasted time",
	noFonts: "No fonts with suboptimal font-display found"
}, ag = i("models/trace/insights/FontDisplay.ts", ig), og = t.bind(void 0, ag);
function sg(e) {
	return {
		insightKey: G.FONT_DISPLAY,
		strings: ig,
		title: og(ig.title),
		description: og(ig.description),
		docs: "https://developer.chrome.com/docs/performance/insights/font-display",
		category: W.INP,
		state: e.fonts.find((e) => e.wastedTime > 0) ? "fail" : "pass",
		...e
	};
}
function cg(e) {
	return e.insightKey === G.FONT_DISPLAY;
}
function lg(e, t) {
	let n = [];
	for (let r of e.LayoutShifts.remoteFonts) {
		let i = r.beginRemoteFontLoadEvent;
		if (!I(i, t.bounds)) continue;
		let a = `${i.pid}.${i.args.id}`, o = e.NetworkRequests.byId.get(a);
		if (!o || !/^(block|fallback|auto)$/.test(r.display)) continue;
		let s = C(o.args.data.syntheticData.finishTime - o.args.data.syntheticData.sendStartTime), c = _(N(s), 1 / 5);
		c !== 0 && (c = Math.min(c, 3e3), n.push({
			name: r.name,
			request: o,
			display: r.display,
			wastedTime: c
		}));
	}
	n.sort((e, t) => t.wastedTime - e.wastedTime);
	let r = Math.max(...n.map((e) => e.wastedTime));
	return sg({
		relatedEvents: n.map((e) => e.request),
		fonts: n,
		metricSavings: { FCP: r }
	});
}
function ug(e) {
	return e.fonts.map((e) => ({
		type: "ENTRY_OUTLINE",
		entry: e.request,
		outlineReason: e.wastedTime ? "ERROR" : "INFO"
	}));
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/insights/ForcedReflow.ts
var dg = /* @__PURE__ */ e({
	UIStrings: () => fg,
	createOverlayForEvents: () => Sg,
	createOverlays: () => xg,
	generateInsight: () => bg,
	i18nString: () => mg,
	isForcedReflowInsight: () => yg
}), fg = {
	title: "Forced reflow",
	description: "A forced reflow occurs when JavaScript queries geometric properties (such as `offsetWidth`) after styles have been invalidated by a change to the DOM state. This can result in poor performance. Learn more about [forced reflows](https://developer.chrome.com/docs/performance/insights/forced-reflow) and possible mitigations.",
	reflowCallFrames: "Call frames that trigger reflow",
	topTimeConsumingFunctionCall: "Top function call",
	totalReflowTime: "Total reflow time",
	unattributed: "[unattributed]",
	anonymous: "(anonymous)"
}, pg = i("models/trace/insights/ForcedReflow.ts", fg), mg = t.bind(void 0, pg);
function hg(e) {
	return e.scriptId + ":" + e.lineNumber + ":" + e.columnNumber;
}
function gg(e, t) {
	let n = t.Renderer.entryToNode, r = /* @__PURE__ */ new Map();
	if (e.length === 0) return;
	for (let t of e) {
		let e = n.get(t);
		if (!e) continue;
		let i = e.parent, a, o;
		for (; i;) {
			let e = i.entry;
			if (k(e)) a = e.callFrame, o = e;
			else {
				fr(e) && e.args.data && Se(e.args.data) && (a = e.args.data, o = e);
				break;
			}
			i = i.parent;
		}
		if (!a || !o) continue;
		let s = hg(a), c = S(r, s, () => ({
			topLevelFunctionCall: a,
			totalReflowTime: 0,
			topLevelFunctionCallEvents: []
		}));
		c.totalReflowTime += t.dur ?? 0, c.topLevelFunctionCallEvents.push(o);
	}
	let i;
	return r.forEach((e) => {
		(!i || e.totalReflowTime > i.totalReflowTime) && (i = e);
	}), i;
}
function _g(e) {
	return {
		insightKey: G.FORCED_REFLOW,
		strings: fg,
		title: mg(fg.title),
		description: mg(fg.description),
		docs: "https://developer.chrome.com/docs/performance/insights/forced-reflow",
		category: W.ALL,
		state: e.aggregatedBottomUpData.length === 0 ? "pass" : "fail",
		...e
	};
}
function vg(e, t) {
	let n = xp(e, t), r = gi(e);
	return n?.callFrames[0] ?? r ?? null;
}
function yg(e) {
	return e.insightKey === G.FORCED_REFLOW;
}
function bg(e, t) {
	let n = (e) => bi(e) === t.frameId && I(e, t.bounds), r = /* @__PURE__ */ new Map(), i = e.Warnings.perWarning.get("FORCED_REFLOW")?.filter(n) ?? [];
	for (let t of i) {
		let n = vg(t, e), i = n ? hg(n) : "UNATTRIBUTED", a = S(r, i, () => ({
			bottomUpData: n,
			totalTime: 0,
			relatedEvents: []
		}));
		a.totalTime += t.dur ?? 0, a.relatedEvents.push(t);
	}
	return _g({
		relatedEvents: i,
		topLevelFunctionCallData: gg(i, e),
		aggregatedBottomUpData: [...r.values()]
	});
}
function xg(e) {
	if (!e.topLevelFunctionCallData) return [];
	let t = [...e.aggregatedBottomUpData.values().flatMap((e) => e.relatedEvents)];
	return [...Sg(e.topLevelFunctionCallData.topLevelFunctionCallEvents, "INFO"), ...Sg(t)];
}
function Sg(e, t = "ERROR") {
	return e.map((e) => ({
		type: "ENTRY_OUTLINE",
		entry: e,
		outlineReason: t
	}));
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/insights/ImageDelivery.ts
var Cg = /* @__PURE__ */ e({
	ImageOptimizationType: () => jg,
	UIStrings: () => wg,
	createOverlayForRequest: () => Bg,
	createOverlays: () => Vg,
	generateInsight: () => zg,
	getOptimizationMessage: () => Ng,
	getOptimizationMessageWithBytes: () => Pg,
	i18nString: () => Eg,
	isImageDeliveryInsight: () => Mg
}), wg = {
	title: "Improve image delivery",
	description: "Reducing the download time of images can improve the perceived load time of the page and LCP. [Learn more about optimizing image size](https://developer.chrome.com/docs/performance/insights/image-delivery)",
	useCompression: "Increasing the image compression factor could improve this image's download size.",
	useModernFormat: "Using a modern image format (WebP, AVIF) or increasing the image compression could improve this image's download size.",
	useVideoFormat: "Using video formats instead of GIFs can improve the download size of animated content.",
	useResponsiveSize: "This image file is larger than it needs to be ({PH1}) for its displayed dimensions ({PH2}). Use responsive images to reduce the image download size.",
	optimizeFile: "Optimize file size",
	others: "{PH1} others",
	noOptimizableImages: "No optimizable images",
	estimatedSavings: "{PH1} (Est {PH2})"
}, Tg = i("models/trace/insights/ImageDelivery.ts", wg), Eg = t.bind(void 0, Tg), Dg = 2 / 12, Og = 102400, kg = 4096, Ag = 12288, jg = /* @__PURE__ */ function(e) {
	return e.ADJUST_COMPRESSION = "ADJUST_COMPRESSION", e.MODERN_FORMAT_OR_COMPRESSION = "MODERN_FORMAT_OR_COMPRESSION", e.VIDEO_FORMAT = "VIDEO_FORMAT", e.RESPONSIVE_SIZE = "RESPONSIVE_SIZE", e;
}({});
function Mg(e) {
	return e.insightKey === "ImageDelivery";
}
function Ng(e) {
	switch (e.type) {
		case "ADJUST_COMPRESSION": return Eg(wg.useCompression);
		case "MODERN_FORMAT_OR_COMPRESSION": return Eg(wg.useModernFormat);
		case "VIDEO_FORMAT": return Eg(wg.useVideoFormat);
		case "RESPONSIVE_SIZE": return Eg(wg.useResponsiveSize, {
			PH1: `${e.fileDimensions.width}x${e.fileDimensions.height}`,
			PH2: `${e.displayDimensions.width}x${e.displayDimensions.height}`
		});
	}
}
function Pg(e) {
	let t = n(e.byteSavings), r = Ng(e);
	return Eg(wg.estimatedSavings, {
		PH1: r,
		PH2: t
	});
}
function Fg(e) {
	return {
		insightKey: G.IMAGE_DELIVERY,
		strings: wg,
		title: Eg(wg.title),
		description: Eg(wg.description),
		docs: "https://developer.chrome.com/docs/performance/insights/image-delivery",
		category: W.LCP,
		state: e.optimizableImages.length > 0 ? "fail" : "pass",
		...e,
		relatedEvents: new Map(e.optimizableImages.map((e) => [e.request, e.optimizations.map(Pg)]))
	};
}
function Ig(e) {
	return Math.round(29.1 * Math.log10(e.args.data.decodedBodyLength) - 100.7) / 100;
}
function Lg(e, t) {
	return e.ImagePainting.paintEventToCorrectedDisplaySize.get(t) ?? {
		width: t.args.data.width,
		height: t.args.data.height
	};
}
function Rg(e, t) {
	let { width: n, height: r } = Lg(e, t);
	return {
		filePixels: t.args.data.srcWidth * t.args.data.srcHeight,
		displayedPixels: n * r
	};
}
function zg(e, t) {
	let n = (e) => I(e, t.bounds), r = e.NetworkRequests.byTime.filter(n), i = [];
	for (let t of r) {
		if (t.args.data.resourceType !== "Image" || t.args.data.mimeType === "image/svg+xml") continue;
		let r = t.args.data.redirects[0]?.url ?? t.args.data.url, a = e.ImagePainting.paintImageEventForUrl.get(r)?.filter(n);
		if (!a?.length) continue;
		let o = a.reduce((t, n) => Rg(e, t).displayedPixels > Rg(e, n).displayedPixels ? t : n), { filePixels: s, displayedPixels: c } = Rg(e, o), l = Math.min(t.args.data.decodedBodyLength, t.args.data.encodedDataLength), u = l / s, d = [];
		if (t.args.data.mimeType === "image/gif") {
			if (l > Og) {
				let e = Ig(t), n = Math.round(l * e);
				d.push({
					type: "VIDEO_FORMAT",
					byteSavings: n
				});
			}
		} else if (u > Dg) {
			let e = l - Math.round(Dg * s);
			t.args.data.mimeType !== "image/webp" && t.args.data.mimeType !== "image/avif" ? d.push({
				type: "MODERN_FORMAT_OR_COMPRESSION",
				byteSavings: e
			}) : d.push({
				type: "ADJUST_COMPRESSION",
				byteSavings: e
			});
		}
		let f = Math.max(0, ...d.map((e) => e.byteSavings)), p = f, m = 1 - c / s;
		if (m > 0 && !o.args.data.isCSS) {
			let t = Math.round(m * l);
			if (!(o.args.data.isPicture || o.args.data.srcsetAttribute) || t > Ag) {
				p += Math.round(m * (l - f));
				let { width: n, height: r } = Lg(e, o);
				d.push({
					type: "RESPONSIVE_SIZE",
					byteSavings: t,
					fileDimensions: {
						width: Math.round(o.args.data.srcWidth),
						height: Math.round(o.args.data.srcHeight)
					},
					displayDimensions: {
						width: Math.round(n),
						height: Math.round(r)
					}
				});
			}
		}
		d = d.filter((e) => e.byteSavings > kg), d.length > 0 && i.push({
			request: t,
			largestImagePaint: o,
			optimizations: d,
			byteSavings: p
		});
	}
	let a = /* @__PURE__ */ new Map();
	for (let e of i) a.set(e.request.args.data.requestId, e.byteSavings);
	return i.sort((e, t) => t.byteSavings === e.byteSavings ? t.request.args.data.decodedBodyLength - e.request.args.data.decodedBodyLength : t.byteSavings - e.byteSavings), Fg({
		optimizableImages: i,
		metricSavings: wm(a, t),
		wastedBytes: i.reduce((e, t) => e + t.byteSavings, 0)
	});
}
function Bg(e) {
	return {
		type: "ENTRY_OUTLINE",
		entry: e,
		outlineReason: "ERROR"
	};
}
function Vg(e) {
	return e.optimizableImages.map((e) => Bg(e.request));
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/insights/INPBreakdown.ts
var Hg = /* @__PURE__ */ e({
	UIStrings: () => Ug,
	createOverlays: () => Xg,
	createOverlaysForSubpart: () => Yg,
	generateInsight: () => Jg,
	i18nString: () => Gg,
	isINPBreakdownInsight: () => Kg
}), Ug = {
	description: "Start investigating [how to improve INP](https://developer.chrome.com/docs/performance/insights/inp-breakdown) by looking at the longest subpart.",
	title: "INP breakdown",
	subpart: "Subpart",
	duration: "Duration",
	inputDelay: "Input delay",
	processingDuration: "Processing duration",
	presentationDelay: "Presentation delay",
	noInteractions: "No interactions detected"
}, Wg = i("models/trace/insights/INPBreakdown.ts", Ug), Gg = t.bind(void 0, Wg);
function Kg(e) {
	return e.insightKey === G.INP_BREAKDOWN;
}
function qg(e) {
	let t = "pass";
	return e.longestInteractionEvent && (t = Vf(e.longestInteractionEvent.dur) === Fu.GOOD ? "informative" : "fail"), {
		insightKey: G.INP_BREAKDOWN,
		strings: Ug,
		title: Gg(Ug.title),
		description: Gg(Ug.description),
		docs: "https://developer.chrome.com/docs/performance/insights/inp-breakdown",
		category: W.INP,
		state: t,
		...e
	};
}
function Jg(e, t) {
	let n = e.UserInteractions.interactionEventsWithNoNesting.filter((e) => I(e, t.bounds));
	if (!n.length) return qg({});
	let r = /* @__PURE__ */ new Map();
	for (let e of n) {
		let t = e.interactionId, n = r.get(t);
		(!n || e.dur > n.dur) && r.set(t, e);
	}
	let i = [...r.values()];
	i.sort((e, t) => t.dur - e.dur);
	let a = Math.min(9, Math.floor(i.length / 50));
	return qg({
		relatedEvents: [i[0]],
		longestInteractionEvent: i[0],
		highPercentileInteractionEvent: i[a]
	});
}
function Yg(e, t = -1) {
	let n = F(e.ts, e.ts + e.inputDelay), r = F(n.max, n.max + e.mainThreadHandling), i = F(r.max, r.max + e.presentationDelay), a = [
		{
			bounds: n,
			label: Gg(Ug.inputDelay),
			showDuration: !0
		},
		{
			bounds: r,
			label: Gg(Ug.processingDuration),
			showDuration: !0
		},
		{
			bounds: i,
			label: Gg(Ug.presentationDelay),
			showDuration: !0
		}
	];
	return t !== -1 && (a = [a[t]]), [{
		type: "TIMESPAN_BREAKDOWN",
		sections: a,
		renderLocation: "BELOW_EVENT",
		entry: e
	}];
}
function Xg(e) {
	let t = e.longestInteractionEvent;
	return t ? Yg(t) : [];
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/insights/LCPBreakdown.ts
var Zg = /* @__PURE__ */ e({
	UIStrings: () => Qg,
	createOverlays: () => o_,
	generateInsight: () => a_,
	i18nString: () => e_,
	isLCPBreakdownInsight: () => t_
}), Qg = {
	title: "LCP breakdown",
	description: "Each [subpart has specific improvement strategies](https://developer.chrome.com/docs/performance/insights/lcp-breakdown). Ideally, most of the LCP time should be spent on loading the resources, not within delays.",
	timeToFirstByte: "Time to first byte",
	resourceLoadDelay: "Resource load delay",
	resourceLoadDuration: "Resource load duration",
	elementRenderDelay: "Element render delay",
	subpart: "Subpart",
	duration: "Duration",
	fieldDuration: "Field p75",
	noLcp: "No LCP detected"
}, $g = i("models/trace/insights/LCPBreakdown.ts", Qg), e_ = t.bind(void 0, $g);
function t_(e) {
	return e.insightKey === "LCPBreakdown";
}
function n_(...e) {
	return e.some((e) => Number.isNaN(e));
}
function r_(e, t, n, r) {
	let i = Am(t);
	if (i === null) return null;
	let a = F(e.ts, i);
	a.label = e_(Qg.timeToFirstByte);
	let o = F(a.max, n.ts);
	if (o.label = e_(Qg.elementRenderDelay), !r) return n_(a.range, o.range) ? null : {
		ttfb: a,
		renderDelay: o
	};
	let s = r.ts, c = r.args.data.syntheticData.finishTime, l = F(a.max, s), u = F(s, c);
	return o = F(c, n.ts), l.label = e_(Qg.resourceLoadDelay), u.label = e_(Qg.resourceLoadDuration), o.label = e_(Qg.elementRenderDelay), n_(a.range, l.range, u.range, o.range) ? null : {
		ttfb: a,
		loadDelay: l,
		loadDuration: u,
		renderDelay: o
	};
}
function i_(e) {
	let t = [];
	e.lcpEvent && t.push(e.lcpEvent), e.lcpRequest && t.push(e.lcpRequest);
	let n = "pass";
	return e.lcpMs !== void 0 && (n = Ou(M(e.lcpMs)) === Fu.GOOD ? "informative" : "fail"), {
		insightKey: G.LCP_BREAKDOWN,
		strings: Qg,
		title: e_(Qg.title),
		description: e_(Qg.description),
		docs: "https://developer.chrome.com/docs/performance/insights/lcp-breakdown",
		category: W.LCP,
		state: n,
		...e,
		relatedEvents: t
	};
}
function a_(e, t) {
	if (!t.navigation) return i_({});
	let n = e.NetworkRequests, r = e.PageLoadMetrics.metricScoresByFrameId.get(t.frameId);
	if (!r) throw Error("no frame metrics");
	let i = r.get(t.navigation);
	if (!i) throw Error("no navigation metrics");
	let a = i.get(V.LCP), o = a?.event;
	if (!o || !O(o)) return i_({ warnings: [cm.NO_LCP] });
	let s = N(a.timing), c = a.event?.ts ? N(a.event?.ts) : void 0, l = e.LargestImagePaint.lcpRequestByNavigationId.get(t.navigationId), u = n.byId.get(t.navigationId);
	return i_(u ? {
		lcpMs: s,
		lcpTs: c,
		lcpEvent: o,
		lcpRequest: l,
		subparts: r_(t.navigation, u, o, l) ?? void 0
	} : {
		lcpMs: s,
		lcpTs: c,
		lcpEvent: o,
		lcpRequest: l,
		warnings: [cm.NO_DOCUMENT_REQUEST]
	});
}
function o_(e) {
	if (!e.subparts || !e.lcpTs) return [];
	let t = [{
		type: "TIMESPAN_BREAKDOWN",
		sections: Object.values(e.subparts).map((e) => ({
			bounds: e,
			label: e.label,
			showDuration: !0
		}))
	}];
	return e.lcpRequest && t.push({
		type: "ENTRY_OUTLINE",
		entry: e.lcpRequest,
		outlineReason: "INFO"
	}), t;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/insights/LCPDiscovery.ts
var s_ = /* @__PURE__ */ e({
	UIStrings: () => c_,
	createOverlays: () => h_,
	generateInsight: () => p_,
	getImageData: () => m_,
	i18nString: () => u_,
	isLCPDiscoveryInsight: () => d_
}), c_ = {
	title: "LCP request discovery",
	description: "[Optimize LCP](https://developer.chrome.com/docs/performance/insights/lcp-discovery) by making the LCP image discoverable from the HTML immediately, and avoiding lazy-loading",
	lcpLoadDelay: "LCP image loaded {PH1} after earliest start point.",
	fetchPriorityApplied: "fetchpriority=high applied",
	fetchPriorityShouldBeApplied: "fetchpriority=high should be applied",
	fetchPriorityShouldBeAppliedToImagePreload: "fetchpriority=high should be applied to the image preload request",
	requestDiscoverable: "Request is discoverable in initial document",
	lazyLoadNotApplied: "LCP resources should not use loading=lazy",
	noLcp: "No LCP detected",
	noLcpResource: "No LCP resource detected because the LCP is not an image"
}, l_ = i("models/trace/insights/LCPDiscovery.ts", c_), u_ = t.bind(void 0, l_);
function d_(e) {
	return e.insightKey === "LCPDiscovery";
}
function f_(e) {
	let t = e.lcpEvent && e.lcpRequest ? [e.lcpEvent, e.lcpRequest] : [];
	return {
		insightKey: G.LCP_DISCOVERY,
		strings: c_,
		title: u_(c_.title),
		description: u_(c_.description),
		docs: "https://developer.chrome.com/docs/performance/insights/lcp-discovery",
		category: W.LCP,
		state: e.lcpRequest && e.checklist && (!e.checklist.eagerlyLoaded.value || !e.checklist.requestDiscoverable.value || !e.checklist.priorityHinted.value) ? "fail" : "pass",
		...e,
		relatedEvents: t
	};
}
function p_(e, t) {
	if (!t.navigation) return f_({});
	let n = e.NetworkRequests, r = e.PageLoadMetrics.metricScoresByFrameId.get(t.frameId);
	if (!r) throw Error("no frame metrics");
	let i = r.get(t.navigation);
	if (!i) throw Error("no navigation metrics");
	let a = i.get(V.LCP)?.event;
	if (!a || !O(a)) return f_({ warnings: [cm.NO_LCP] });
	let o = n.byId.get(t.navigationId);
	if (!o) return f_({ warnings: [cm.NO_DOCUMENT_REQUEST] });
	let s = e.LargestImagePaint.lcpRequestByNavigationId.get(t.navigationId);
	if (!s) return f_({ lcpEvent: a });
	let c = s.args.data.initiator?.url, l = s?.args.data.initiator?.type === "parser" && o.args.data.url === c, u = s?.args.data.isLinkPreload || l, d = s?.args.data.fetchPriorityHint, f = Am(o), p = d === "high", m = s.args.data.isLinkPreload ? u_(c_.fetchPriorityShouldBeAppliedToImagePreload) : u_(c_.fetchPriorityShouldBeApplied), h = a.args.data?.loadingAttr !== "lazy" || s.args.data.isLinkPreload;
	return f_({
		lcpEvent: a,
		lcpRequest: s,
		earliestDiscoveryTimeTs: f ? C(f) : void 0,
		checklist: {
			priorityHinted: {
				label: p ? u_(c_.fetchPriorityApplied) : m,
				value: p
			},
			requestDiscoverable: {
				label: u_(c_.requestDiscoverable),
				value: u
			},
			eagerlyLoaded: {
				label: u_(c_.lazyLoadNotApplied),
				value: h
			}
		}
	});
}
function m_(e) {
	if (!e.lcpRequest || !e.checklist) return null;
	let t = !e.checklist.priorityHinted.value, n = !e.checklist.requestDiscoverable.value, r = !e.checklist.eagerlyLoaded.value;
	if (t === void 0 || n === void 0 || r === void 0) return null;
	let i = {
		checklist: e.checklist,
		request: e.lcpRequest,
		discoveryDelay: null,
		estimatedSavings: e.metricSavings?.LCP ?? null
	};
	return e.earliestDiscoveryTimeTs && e.lcpRequest && (i.discoveryDelay = C(e.lcpRequest.ts - e.earliestDiscoveryTimeTs)), i;
}
function h_(e) {
	let t = m_(e);
	if (!t?.discoveryDelay) return [];
	let n = F(C(t.request.ts - t.discoveryDelay), t.request.ts);
	return [
		{
			type: "ENTRY_OUTLINE",
			entry: t.request,
			outlineReason: "ERROR"
		},
		{
			type: "CANDY_STRIPED_TIME_RANGE",
			bounds: n,
			entry: t.request
		},
		{
			type: "TIMESPAN_BREAKDOWN",
			sections: [{
				bounds: n,
				label: `${t.discoveryDelay} microseconds`,
				showDuration: !1
			}],
			entry: t.request,
			renderLocation: "ABOVE_EVENT"
		}
	];
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/third_party/legacy-javascript/lib/legacy-javascript.js
var g_ = /* @__PURE__ */ e({
	detectLegacyJavaScript: () => O_,
	getCoreJsPolyfillData: () => C_,
	getTransformPatterns: () => T_
}), __ = [
	{
		name: "focus-visible",
		modules: ["focus-visible"]
	},
	{
		name: "Error.prototype.cause",
		modules: ["es.error.cause"]
	},
	{
		name: "Array.prototype.at",
		modules: ["es.array.at", "esnext.array.at"],
		corejs: !0
	},
	{
		name: "Array.prototype.concat",
		modules: ["es.array.concat"],
		corejs: !0
	},
	{
		name: "Array.prototype.copyWithin",
		modules: ["es.array.copy-within"],
		corejs: !0
	},
	{
		name: "Array.prototype.every",
		modules: ["es.array.every"],
		corejs: !0
	},
	{
		name: "Array.prototype.fill",
		modules: ["es.array.fill"],
		corejs: !0
	},
	{
		name: "Array.prototype.filter",
		modules: ["es.array.filter"],
		corejs: !0
	},
	{
		name: "Array.prototype.find",
		modules: ["es.array.find"],
		corejs: !0
	},
	{
		name: "Array.prototype.findIndex",
		modules: ["es.array.find-index"],
		corejs: !0
	},
	{
		name: "Array.prototype.findLast",
		modules: ["es.array.find-last", "esnext.array.find-last"],
		corejs: !0
	},
	{
		name: "Array.prototype.findLastIndex",
		modules: ["es.array.find-last-index", "esnext.array.find-last-index"],
		corejs: !0
	},
	{
		name: "Array.prototype.flat",
		modules: ["es.array.flat"],
		corejs: !0
	},
	{
		name: "Array.prototype.flatMap",
		modules: ["es.array.flat-map"],
		corejs: !0
	},
	{
		name: "Array.prototype.forEach",
		modules: ["es.array.for-each"],
		corejs: !0
	},
	{
		name: "Array.from",
		modules: ["es.array.from"],
		corejs: !0
	},
	{
		name: "Array.prototype.includes",
		modules: ["es.array.includes"],
		corejs: !0
	},
	{
		name: "Array.prototype.indexOf",
		modules: ["es.array.index-of"],
		corejs: !0
	},
	{
		name: "Array.isArray",
		modules: ["es.array.is-array"],
		corejs: !0
	},
	{
		name: "Array.prototype.join",
		modules: ["es.array.join"],
		corejs: !0
	},
	{
		name: "Array.prototype.map",
		modules: ["es.array.map"],
		corejs: !0
	},
	{
		name: "Array.of",
		modules: ["es.array.of"],
		corejs: !0
	},
	{
		name: "Array.prototype.slice",
		modules: ["es.array.slice"],
		corejs: !0
	},
	{
		name: "Array.prototype.some",
		modules: ["es.array.some"],
		corejs: !0
	},
	{
		name: "Array.prototype.sort",
		modules: ["es.array.sort"],
		corejs: !0
	},
	{
		name: "Array.prototype.unshift",
		modules: ["es.array.unshift"],
		corejs: !0
	},
	{
		name: "Math.acosh",
		modules: ["es.math.acosh"],
		corejs: !0
	},
	{
		name: "Math.asinh",
		modules: ["es.math.asinh"],
		corejs: !0
	},
	{
		name: "Math.atanh",
		modules: ["es.math.atanh"],
		corejs: !0
	},
	{
		name: "Math.cbrt",
		modules: ["es.math.cbrt"],
		corejs: !0
	},
	{
		name: "Math.clz32",
		modules: ["es.math.clz32"],
		corejs: !0
	},
	{
		name: "Math.cosh",
		modules: ["es.math.cosh"],
		corejs: !0
	},
	{
		name: "Math.expm1",
		modules: ["es.math.expm1"],
		corejs: !0
	},
	{
		name: "Math.fround",
		modules: ["es.math.fround"],
		corejs: !0
	},
	{
		name: "Math.hypot",
		modules: ["es.math.hypot"],
		corejs: !0
	},
	{
		name: "Math.imul",
		modules: ["es.math.imul"],
		corejs: !0
	},
	{
		name: "Math.log10",
		modules: ["es.math.log10"],
		corejs: !0
	},
	{
		name: "Math.log1p",
		modules: ["es.math.log1p"],
		corejs: !0
	},
	{
		name: "Math.log2",
		modules: ["es.math.log2"],
		corejs: !0
	},
	{
		name: "Math.sign",
		modules: ["es.math.sign"],
		corejs: !0
	},
	{
		name: "Math.sinh",
		modules: ["es.math.sinh"],
		corejs: !0
	},
	{
		name: "Math.tanh",
		modules: ["es.math.tanh"],
		corejs: !0
	},
	{
		name: "Math.trunc",
		modules: ["es.math.trunc"],
		corejs: !0
	},
	{
		name: "Object.assign",
		modules: ["es.object.assign"],
		corejs: !0
	},
	{
		name: "Object.create",
		modules: ["es.object.create"],
		corejs: !0
	},
	{
		name: "Object.entries",
		modules: ["es.object.entries"],
		corejs: !0
	},
	{
		name: "Object.freeze",
		modules: ["es.object.freeze"],
		corejs: !0
	},
	{
		name: "Object.fromEntries",
		modules: ["es.object.from-entries"],
		corejs: !0
	},
	{
		name: "Object.getOwnPropertyDescriptor",
		modules: ["es.object.get-own-property-descriptor"],
		corejs: !0
	},
	{
		name: "Object.getOwnPropertyDescriptors",
		modules: ["es.object.get-own-property-descriptors"],
		corejs: !0
	},
	{
		name: "Object.getPrototypeOf",
		modules: ["es.object.get-prototype-of"],
		corejs: !0
	},
	{
		name: "Object.hasOwn",
		modules: ["es.object.has-own", "esnext.object.has-own"],
		corejs: !0
	},
	{
		name: "Object.is",
		modules: ["es.object.is"],
		corejs: !0
	},
	{
		name: "Object.isExtensible",
		modules: ["es.object.is-extensible"],
		corejs: !0
	},
	{
		name: "Object.isFrozen",
		modules: ["es.object.is-frozen"],
		corejs: !0
	},
	{
		name: "Object.isSealed",
		modules: ["es.object.is-sealed"],
		corejs: !0
	},
	{
		name: "Object.keys",
		modules: ["es.object.keys"],
		corejs: !0
	},
	{
		name: "Object.preventExtensions",
		modules: ["es.object.prevent-extensions"],
		corejs: !0
	},
	{
		name: "Object.seal",
		modules: ["es.object.seal"],
		corejs: !0
	},
	{
		name: "Object.setPrototypeOf",
		modules: ["es.object.set-prototype-of"],
		corejs: !0
	},
	{
		name: "Object.values",
		modules: ["es.object.values"],
		corejs: !0
	},
	{
		name: "Promise.any",
		modules: ["es.promise.any", "esnext.promise.any"],
		corejs: !0
	},
	{
		name: "Reflect.apply",
		modules: ["es.reflect.apply"],
		corejs: !0
	},
	{
		name: "Reflect.construct",
		modules: ["es.reflect.construct"],
		corejs: !0
	},
	{
		name: "Reflect.deleteProperty",
		modules: ["es.reflect.delete-property"],
		corejs: !0
	},
	{
		name: "Reflect.get",
		modules: ["es.reflect.get"],
		corejs: !0
	},
	{
		name: "Reflect.getOwnPropertyDescriptor",
		modules: ["es.reflect.get-own-property-descriptor"],
		corejs: !0
	},
	{
		name: "Reflect.getPrototypeOf",
		modules: ["es.reflect.get-prototype-of"],
		corejs: !0
	},
	{
		name: "Reflect.has",
		modules: ["es.reflect.has"],
		corejs: !0
	},
	{
		name: "Reflect.isExtensible",
		modules: ["es.reflect.is-extensible"],
		corejs: !0
	},
	{
		name: "Reflect.ownKeys",
		modules: ["es.reflect.own-keys"],
		corejs: !0
	},
	{
		name: "Reflect.preventExtensions",
		modules: ["es.reflect.prevent-extensions"],
		corejs: !0
	},
	{
		name: "Reflect.setPrototypeOf",
		modules: ["es.reflect.set-prototype-of"],
		corejs: !0
	},
	{
		name: "String.prototype.codePointAt",
		modules: ["es.string.code-point-at"],
		corejs: !0
	},
	{
		name: "String.prototype.endsWith",
		modules: ["es.string.ends-with"],
		corejs: !0
	},
	{
		name: "String.fromCodePoint",
		modules: ["es.string.from-code-point"],
		corejs: !0
	},
	{
		name: "String.prototype.includes",
		modules: ["es.string.includes"],
		corejs: !0
	},
	{
		name: "String.prototype.matchAll",
		modules: ["es.string.match-all", "esnext.string.match-all"],
		corejs: !0
	},
	{
		name: "String.raw",
		modules: ["es.string.raw"],
		corejs: !0
	},
	{
		name: "String.prototype.repeat",
		modules: ["es.string.repeat"],
		corejs: !0
	},
	{
		name: "String.prototype.replaceAll",
		modules: ["es.string.replace-all", "esnext.string.replace-all"],
		corejs: !0
	},
	{
		name: "String.prototype.startsWith",
		modules: ["es.string.starts-with"],
		corejs: !0
	},
	{
		name: "String.prototype.substr",
		modules: ["es.string.substr"],
		corejs: !0
	},
	{
		name: "String.prototype.trim",
		modules: ["es.string.trim"],
		corejs: !0
	},
	{
		name: "String.prototype.trimEnd",
		modules: ["es.string.trim-end"],
		corejs: !0
	},
	{
		name: "String.prototype.trimStart",
		modules: ["es.string.trim-start"],
		corejs: !0
	},
	{
		name: "String.prototype.link",
		modules: ["es.string.link"],
		corejs: !0
	},
	{
		name: "Promise.allSettled",
		modules: ["esnext.promise.all-settled"],
		corejs: !0
	}
], v_ = {
	moduleSizes: [
		26070,
		498,
		282,
		294,
		281,
		467,
		161,
		236,
		229,
		765,
		546,
		339,
		1608,
		723,
		729,
		1545,
		438,
		214,
		657,
		111,
		759,
		537,
		209,
		281,
		685,
		217,
		757,
		631,
		293,
		182,
		475,
		79,
		407,
		140,
		366,
		792,
		269,
		222,
		158,
		280,
		188,
		137,
		158,
		105,
		189,
		543,
		160,
		742,
		1436,
		88,
		904,
		146,
		314,
		375,
		183,
		1083,
		195,
		503,
		269,
		208,
		334,
		350,
		460,
		568,
		229,
		1155,
		334,
		266,
		30,
		120,
		309,
		370,
		358,
		1952,
		1638,
		304,
		153,
		274,
		1288,
		192,
		543,
		74,
		144,
		137,
		33,
		336,
		457,
		2122,
		535,
		711,
		1323,
		117,
		1961,
		244,
		557,
		318,
		119,
		124,
		108,
		144,
		96,
		133,
		441,
		210,
		1627,
		1956,
		693,
		1426,
		863,
		637,
		301,
		51,
		708,
		583,
		119,
		600,
		221,
		370,
		728,
		1085,
		552,
		629,
		125,
		1746,
		97,
		441,
		543,
		2756,
		371,
		447,
		548,
		243,
		266,
		217,
		99,
		440,
		183,
		546,
		137,
		464,
		207,
		983,
		503,
		237,
		382,
		249,
		675,
		402,
		254,
		223,
		164,
		214,
		191,
		831,
		218,
		202,
		232,
		124,
		249,
		160,
		251,
		217,
		717,
		78,
		561,
		1627,
		256,
		386,
		225,
		432,
		499,
		394,
		364,
		445,
		634,
		667,
		177,
		346,
		470,
		663,
		142,
		588,
		414,
		617,
		1559,
		380,
		2520,
		1040,
		417,
		289,
		238,
		220,
		214,
		303,
		163,
		141,
		510,
		397,
		137,
		137,
		133,
		133,
		390,
		266,
		137,
		183,
		215,
		191,
		485,
		328,
		575,
		799,
		533,
		148,
		215,
		589,
		589,
		130,
		362,
		562,
		471,
		179,
		186,
		1266,
		1456,
		521,
		1536,
		427,
		444,
		406,
		912,
		150,
		283,
		144,
		485,
		470,
		205,
		1268,
		796,
		658,
		306,
		3751,
		814,
		146,
		2328,
		1226,
		922,
		237,
		206,
		198,
		250,
		283,
		60,
		3e3
	],
	dependencies: {
		"Array.prototype.at": [
			0,
			5,
			69,
			105,
			106,
			116,
			164
		],
		"Array.prototype.concat": [
			0,
			16,
			21,
			22,
			26,
			34,
			40,
			76,
			78,
			155,
			165
		],
		"Array.prototype.copyWithin": [
			0,
			5,
			9,
			37,
			69,
			105,
			106,
			116,
			166
		],
		"Array.prototype.every": [
			0,
			15,
			17,
			21,
			22,
			26,
			53,
			59,
			76,
			78,
			155,
			167
		],
		"Array.prototype.fill": [
			0,
			5,
			10,
			69,
			105,
			106,
			116,
			168
		],
		"Array.prototype.filter": [
			0,
			15,
			16,
			21,
			22,
			26,
			53,
			59,
			76,
			78,
			155,
			169
		],
		"Array.prototype.find": [
			0,
			5,
			15,
			21,
			22,
			26,
			53,
			59,
			69,
			76,
			78,
			105,
			106,
			116,
			155,
			173
		],
		"Array.prototype.findIndex": [
			0,
			5,
			15,
			21,
			22,
			26,
			53,
			59,
			69,
			76,
			78,
			105,
			106,
			116,
			155,
			170
		],
		"Array.prototype.findLast": [
			0,
			5,
			14,
			53,
			59,
			69,
			105,
			106,
			116,
			172
		],
		"Array.prototype.findLastIndex": [
			0,
			5,
			14,
			53,
			59,
			69,
			105,
			106,
			116,
			171
		],
		"Array.prototype.flat": [
			0,
			21,
			22,
			26,
			40,
			50,
			53,
			59,
			76,
			78,
			155,
			175
		],
		"Array.prototype.flatMap": [
			0,
			21,
			22,
			26,
			40,
			50,
			53,
			59,
			76,
			78,
			155,
			174
		],
		"Array.prototype.forEach": [
			0,
			11,
			15,
			17,
			21,
			22,
			26,
			53,
			59,
			76,
			78,
			155,
			176
		],
		"Array.from": [
			0,
			12,
			23,
			24,
			26,
			34,
			53,
			59,
			62,
			63,
			75,
			78,
			88,
			155,
			177
		],
		"Array.prototype.includes": [
			0,
			5,
			69,
			105,
			106,
			116,
			178
		],
		"Array.prototype.indexOf": [
			0,
			17,
			59,
			179
		],
		"Array.isArray": [
			0,
			76,
			180
		],
		"Array.prototype.join": [
			0,
			17,
			181
		],
		"Array.prototype.map": [
			0,
			15,
			16,
			21,
			22,
			26,
			53,
			59,
			76,
			78,
			155,
			182
		],
		"Array.of": [
			0,
			26,
			34,
			78,
			155,
			183
		],
		"Array.prototype.slice": [
			0,
			16,
			19,
			26,
			34,
			76,
			78,
			155,
			184
		],
		"Array.prototype.some": [
			0,
			15,
			17,
			21,
			22,
			26,
			53,
			59,
			76,
			78,
			155,
			185
		],
		"Array.prototype.sort": [
			0,
			17,
			19,
			20,
			26,
			37,
			42,
			43,
			46,
			155,
			156,
			186
		],
		"Array.prototype.unshift": [
			0,
			18,
			37,
			40,
			76,
			187
		],
		"Math.acosh": [
			0,
			97,
			188
		],
		"Math.asinh": [0, 189],
		"Math.atanh": [0, 190],
		"Math.cbrt": [
			0,
			100,
			191
		],
		"Math.clz32": [0, 192],
		"Math.cosh": [
			0,
			93,
			193
		],
		"Math.expm1": [
			0,
			93,
			194
		],
		"Math.fround": [
			0,
			94,
			95,
			99,
			100,
			195
		],
		"Math.hypot": [0, 196],
		"Math.imul": [0, 197],
		"Math.log10": [
			0,
			96,
			198
		],
		"Math.log1p": [
			0,
			97,
			199
		],
		"Math.log2": [
			0,
			98,
			200
		],
		"Math.sign": [
			0,
			100,
			201
		],
		"Math.sinh": [
			0,
			93,
			202
		],
		"Math.tanh": [
			0,
			93,
			203
		],
		"Math.trunc": [0, 204],
		"Object.assign": [
			0,
			104,
			116,
			205
		],
		"Object.create": [
			0,
			69,
			105,
			106,
			116,
			206
		],
		"Object.entries": [
			0,
			29,
			112,
			116,
			119,
			207
		],
		"Object.freeze": [
			0,
			8,
			19,
			51,
			73,
			109,
			113,
			208
		],
		"Object.fromEntries": [
			0,
			26,
			34,
			53,
			59,
			62,
			63,
			75,
			87,
			88,
			155,
			209
		],
		"Object.getOwnPropertyDescriptor": [0, 210],
		"Object.getOwnPropertyDescriptors": [
			0,
			34,
			211
		],
		"Object.getPrototypeOf": [
			0,
			29,
			112,
			212
		],
		"Object.hasOwn": [0, 213],
		"Object.is": [
			0,
			134,
			217
		],
		"Object.isExtensible": [
			0,
			8,
			113,
			214
		],
		"Object.isFrozen": [
			0,
			8,
			215
		],
		"Object.isSealed": [
			0,
			8,
			216
		],
		"Object.keys": [
			0,
			116,
			218
		],
		"Object.preventExtensions": [
			0,
			8,
			19,
			51,
			73,
			109,
			113,
			219
		],
		"Object.seal": [
			0,
			8,
			19,
			51,
			73,
			109,
			113,
			220
		],
		"Object.setPrototypeOf": [
			0,
			4,
			58,
			83,
			118,
			221
		],
		"Object.values": [
			0,
			29,
			112,
			116,
			119,
			222
		],
		"Promise.any": [
			0,
			24,
			26,
			47,
			53,
			59,
			62,
			63,
			75,
			87,
			88,
			102,
			122,
			123,
			124,
			125,
			155,
			224
		],
		"Reflect.apply": [
			0,
			52,
			225
		],
		"Reflect.construct": [
			0,
			3,
			19,
			26,
			52,
			55,
			69,
			78,
			105,
			106,
			116,
			155,
			226
		],
		"Reflect.deleteProperty": [0, 227],
		"Reflect.get": [
			0,
			29,
			79,
			112,
			230
		],
		"Reflect.getOwnPropertyDescriptor": [0, 228],
		"Reflect.getPrototypeOf": [
			0,
			29,
			112,
			229
		],
		"Reflect.has": [0, 231],
		"Reflect.isExtensible": [
			0,
			8,
			113,
			232
		],
		"Reflect.ownKeys": [0, 233],
		"Reflect.preventExtensions": [
			0,
			51,
			234
		],
		"Reflect.setPrototypeOf": [
			0,
			4,
			58,
			83,
			118,
			235
		],
		"String.prototype.codePointAt": [
			0,
			26,
			141,
			155,
			156,
			236
		],
		"String.prototype.endsWith": [
			0,
			26,
			28,
			59,
			85,
			103,
			155,
			156,
			237
		],
		"String.fromCodePoint": [0, 238],
		"String.prototype.includes": [
			0,
			26,
			28,
			85,
			103,
			155,
			156,
			239
		],
		"String.prototype.matchAll": [
			0,
			3,
			6,
			26,
			29,
			31,
			59,
			69,
			78,
			85,
			89,
			90,
			105,
			106,
			112,
			116,
			126,
			127,
			128,
			129,
			130,
			131,
			132,
			135,
			139,
			141,
			155,
			156,
			241
		],
		"String.raw": [
			0,
			26,
			155,
			156,
			242
		],
		"String.prototype.repeat": [
			0,
			26,
			142,
			155,
			156,
			243
		],
		"String.prototype.replaceAll": [
			0,
			26,
			65,
			85,
			128,
			129,
			155,
			156,
			244
		],
		"String.prototype.startsWith": [
			0,
			26,
			28,
			59,
			85,
			103,
			155,
			156,
			245
		],
		"String.prototype.substr": [
			0,
			26,
			155,
			156,
			246
		],
		"String.prototype.trim": [
			0,
			26,
			144,
			146,
			155,
			156,
			163,
			251
		],
		"String.prototype.trimEnd": [
			0,
			26,
			143,
			144,
			146,
			155,
			156,
			163,
			247,
			249
		],
		"String.prototype.trimStart": [
			0,
			26,
			144,
			145,
			146,
			155,
			156,
			163,
			248,
			250
		],
		"String.prototype.link": [
			0,
			26,
			30,
			140,
			155,
			156,
			240
		],
		"Promise.allSettled": [
			0,
			24,
			26,
			47,
			53,
			59,
			62,
			63,
			75,
			87,
			88,
			102,
			122,
			123,
			124,
			125,
			155,
			223,
			252
		],
		"focus-visible": [253]
	},
	maxSize: 155835
}, y_ = __, b_ = v_, x_ = class {
	constructor(e) {
		this.patterns = e;
	}
	match(e) {
		if (!this.re) {
			let e = this.patterns.map((e) => `(${e.expression})`).join("|");
			this.re = RegExp(`(^\r
|\r|
)|${e}`, "g");
		}
		this.re.lastIndex = 0;
		let t = /* @__PURE__ */ new Set(), n = [], r, i = 0, a = 0;
		for (; (r = this.re.exec(e)) !== null;) {
			let [e, ...o] = r.slice(1);
			if (e) {
				i++, a = r.index + 1;
				continue;
			}
			let s = this.patterns[o.findIndex(Boolean)];
			t.has(s) || (t.add(s), n.push({
				name: s.name,
				line: i,
				column: r.index - a
			}));
		}
		return n;
	}
};
function S_(e, t, n) {
	let r = (e) => `['"]${e}['"]`, i = "";
	if (i += e ? `${e}\\.${t}\\s?=[^=]` : `(?:window\\.|[\\s;]+)${t}\\s?=[^=]`, e && (i += `|${e}\\[${r(t)}\\]\\s?=[^=]`), i += `|defineProperty\\(${e || "window"},\\s?${r(t)}`, e && (i += `|\\(${e},\\s*{${t}:.*},\\s*{${t}`), e) {
		let n = e.replace(".prototype", "");
		i += `|{target:${r(n)}[^;]*},{${t}:`;
	}
	return i += `|${n.replaceAll(".", "\\.")}(?:\\.js)?"`, i;
}
function C_() {
	return y_.filter((e) => e.corejs).map((e) => ({
		name: e.name,
		coreJs3Module: e.modules[0]
	}));
}
function w_() {
	let e = [];
	for (let { name: t, coreJs3Module: n } of C_()) {
		let r = t.split("."), i = r.length > 1 ? r.slice(0, r.length - 1).join(".") : null, a = r[r.length - 1];
		e.push({
			name: t,
			expression: S_(i, a, n)
		});
	}
	return e;
}
function T_() {
	let e = (e, t) => typeof t == "string" ? e.split(t).length - 1 : (e.match(t) ?? []).length;
	return [
		{
			name: "@babel/plugin-transform-classes",
			expression: "Cannot call a class as a function",
			estimateBytes: (t) => 1e3 + (e(t, "_classCallCheck") - 1) * 17
		},
		{
			name: "@babel/plugin-transform-regenerator",
			expression: "Generator is already running|regeneratorRuntime",
			estimateBytes: (t) => e(t, /regeneratorRuntime\(?\)?\.a?wrap/g) * 80
		},
		{
			name: "@babel/plugin-transform-spread",
			expression: "Invalid attempt to spread non-iterable instance",
			estimateBytes: (t) => 1169 + e(t, /\.apply\(void 0,\s?_toConsumableArray/g) * 20
		}
	];
}
function E_(e, t) {
	let n = t.filter((e) => !e.name.startsWith("@")), r = t.filter((e) => e.name.startsWith("@")), i = 0, a = /* @__PURE__ */ new Set();
	for (let e of n) {
		let t = b_.dependencies[e.name];
		if (t) for (let e of t) a.add(e);
	}
	i += [...a].reduce((e, t) => e + b_.moduleSizes[t], 0), i = Math.min(i, b_.maxSize);
	let o = 0;
	for (let t of r) {
		let n = T_().find((e) => e.name === t.name);
		n && n.estimateBytes && e && (o += n.estimateBytes(e));
	}
	return i + o;
}
var D_ = new x_([...w_(), ...T_()]);
function O_(e, t) {
	if (!e) return {
		matches: [],
		estimatedByteSavings: 0
	};
	let n = D_.match(e);
	if (t) for (let { name: e, modules: r } of y_) {
		if (n.some((t) => t.name === e)) continue;
		let i = t.sourceURLs().find((e) => r.some((t) => e.endsWith(`/${t}.js`) || e.includes(`node_modules/${t}/`)));
		if (!i) continue;
		let a = t.mappings().find((e) => e.sourceURL === i);
		a ? n.push({
			name: e,
			line: a.lineNumber,
			column: a.columnNumber
		}) : n.push({
			name: e,
			line: 0,
			column: 0
		});
	}
	return n = n.sort((e, t) => e.name > t.name ? 1 : e.name === t.name ? 0 : -1), {
		matches: n,
		estimatedByteSavings: E_(e, n)
	};
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/insights/LegacyJavaScript.ts
var k_ = /* @__PURE__ */ e({
	UIStrings: () => j_,
	createOverlays: () => R_,
	generateInsight: () => L_,
	i18nString: () => N_,
	isLegacyJavaScript: () => I_
}), { detectLegacyJavaScript: A_ } = g_, j_ = {
	title: "Legacy JavaScript",
	description: "Polyfills and transforms enable older browsers to use new JavaScript features. However, many aren't necessary for modern browsers. Consider modifying your JavaScript build process to not transpile [Baseline](https://web.dev/articles/baseline-and-polyfills) features, unless you know you must support older browsers. [Learn why most sites can deploy ES6+ code without transpiling](https://developer.chrome.com/docs/performance/insights/legacy-javascript)",
	columnScript: "Script",
	columnWastedBytes: "Wasted bytes",
	noLegacyJavaScript: "No legacy JavaScript found"
}, M_ = i("models/trace/insights/LegacyJavaScript.ts", j_), N_ = t.bind(void 0, M_), P_ = 5e3;
function F_(e) {
	let t = [...e.legacyJavaScriptResults.keys()].map((e) => e.request).filter((e) => !!e);
	return {
		insightKey: G.LEGACY_JAVASCRIPT,
		strings: j_,
		title: N_(j_.title),
		description: N_(j_.description),
		docs: "https://developer.chrome.com/docs/performance/insights/legacy-javascript",
		category: W.ALL,
		state: t.length ? "fail" : "pass",
		relatedEvents: [...new Set(t)],
		...e
	};
}
function I_(e) {
	return e.insightKey === G.LEGACY_JAVASCRIPT;
}
function L_(e, t) {
	let n = e.Scripts.scripts.filter((e) => e.frame !== t.frameId || e.url?.startsWith("chrome-extension://") ? !1 : Xr(t.bounds, e.ts) || e.request && I(e.request, t.bounds)), r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
	for (let e of n) {
		if (!e.content || e.content.length < P_) continue;
		let t = A_(e.content, e.sourceMap);
		if (t.estimatedByteSavings < P_) continue;
		let n = km(e), a = Math.round(t.estimatedByteSavings * n);
		if (t.estimatedByteSavings = a, r.set(e, t), e.request) {
			let t = e.request.args.data.requestId;
			i.set(t, a);
		}
	}
	return F_({
		legacyJavaScriptResults: new Map([...r].sort((e, t) => t[1].estimatedByteSavings - e[1].estimatedByteSavings)),
		metricSavings: wm(i, t),
		wastedBytes: i.values().reduce((e, t) => e + t, 0)
	});
}
function R_(e) {
	return [...e.legacyJavaScriptResults.keys()].map((e) => e.request).filter((e) => !!e).map((e) => ({
		type: "ENTRY_OUTLINE",
		entry: e,
		outlineReason: "ERROR"
	}));
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/insights/ModernHTTP.ts
var z_ = /* @__PURE__ */ e({
	UIStrings: () => B_,
	createOverlayForRequest: () => X_,
	createOverlays: () => Z_,
	determineHttp1Requests: () => G_,
	generateInsight: () => Y_,
	i18nString: () => H_,
	isModernHTTPInsight: () => U_
}), B_ = {
	title: "Modern HTTP",
	description: "HTTP/2 and HTTP/3 offer many benefits over HTTP/1.1, such as multiplexing. [Learn more about using modern HTTP](https://developer.chrome.com/docs/performance/insights/modern-http).",
	request: "Request",
	protocol: "Protocol",
	noOldProtocolRequests: "No requests used HTTP/1.1, or its current use of HTTP/1.1 does not present a significant optimization opportunity. HTTP/1.1 requests are only flagged if six or more static assets originate from the same origin, and they are not served from a local development environment or a third-party source."
}, V_ = i("models/trace/insights/ModernHTTP.ts", B_), H_ = t.bind(void 0, V_);
function U_(e) {
	return e.insightKey === G.MODERN_HTTP;
}
function W_(e, t, n) {
	if (!Ji.has(e.args.data.resourceType)) return !1;
	if (e.args.data.decodedBodyLength < 100) {
		let r = t.entityByEvent.get(e);
		if (r) {
			if (n?.name === r.name) return !0;
			if (!r.isUnrecognized) return !1;
		}
	}
	return !0;
}
function G_(e, t, n) {
	let r = [], i = /* @__PURE__ */ new Map();
	for (let r of e) {
		let e = new URL(r.args.data.url);
		W_(r, t, n) && (Qi(r) || S(i, e.origin, () => []).push(r));
	}
	let a = /* @__PURE__ */ new Set();
	for (let t of e) {
		if (a.has(t.args.data.url) || t.args.data.fromServiceWorker || !/HTTP\/[01][.\d]?/i.test(t.args.data.protocol)) continue;
		let e = new URL(t.args.data.url);
		(i.get(e.origin) || []).length < 6 || (a.add(t.args.data.url), r.push(t));
	}
	return r;
}
function K_(e, t, n) {
	let r = n.simulate(t), i = /* @__PURE__ */ new Map();
	t.traverse((t) => {
		t.type === "network" && e.has(t.request.url) && (i.set(t.request.requestId, t.request.protocol), t.request.protocol = "h2");
	});
	let a = n.simulate(t);
	t.traverse((e) => {
		if (e.type !== "network") return;
		let t = i.get(e.request.requestId);
		t !== void 0 && (e.request.protocol = t);
	});
	let o = r.timeInMs - a.timeInMs;
	return _(o, 1 / 10);
}
function q_(e, t) {
	if (!t.navigation || !t.lantern) return;
	let n = new Set(e.map((e) => e.args.data.url)), r = t.lantern.metrics.firstContentfulPaint.optimisticGraph, i = t.lantern.metrics.largestContentfulPaint.optimisticGraph;
	return {
		FCP: K_(n, r, t.lantern.simulator),
		LCP: K_(n, i, t.lantern.simulator)
	};
}
function J_(e) {
	return {
		insightKey: G.MODERN_HTTP,
		strings: B_,
		title: H_(B_.title),
		description: H_(B_.description),
		docs: "https://developer.chrome.com/docs/performance/insights/modern-http",
		category: W.LCP,
		state: e.http1Requests.length > 0 ? "fail" : "pass",
		...e,
		relatedEvents: e.http1Requests
	};
}
function Y_(e, t) {
	let n = e.NetworkRequests.byTime.filter((e) => I(e, t.bounds)), r = e.NetworkRequests.entityMappings, i = G_(n, r, kr(t.navigation?.args.data?.documentLoaderURL ?? e.Meta.mainFrameURL, r) ?? null);
	return J_({
		http1Requests: i,
		metricSavings: q_(i, t)
	});
}
function X_(e) {
	return {
		type: "ENTRY_OUTLINE",
		entry: e,
		outlineReason: "ERROR"
	};
}
function Z_(e) {
	return e.http1Requests.map((e) => X_(e)) ?? [];
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/insights/NetworkDependencyTree.ts
var Q_ = /* @__PURE__ */ e({
	TOO_MANY_PRECONNECTS_THRESHOLD: () => 4,
	UIStrings: () => $_,
	createOverlays: () => xv,
	generateInsight: () => bv,
	generatePreconnectCandidates: () => vv,
	generatePreconnectedOrigins: () => pv,
	handleLinkResponseHeader: () => fv,
	i18nString: () => tv,
	isNetworkDependencyTreeInsight: () => yv
}), $_ = {
	title: "Network dependency tree",
	description: "[Avoid chaining critical requests](https://developer.chrome.com/docs/performance/insights/network-dependency-tree) by reducing the length of chains, reducing the download size of resources, or deferring the download of unnecessary resources to improve page load.",
	warningDescription: "Avoid chaining critical requests by reducing the length of chains, reducing the download size of resources, or deferring the download of unnecessary resources to improve page load.",
	noNetworkDependencyTree: "No rendering tasks impacted by network dependencies",
	maxCriticalPathLatency: "Max critical path latency:",
	columnRequest: "Request",
	columnTime: "Time",
	preconnectOriginsTableTitle: "Preconnected origins",
	preconnectOriginsTableDescription: "[preconnect](https://developer.chrome.com/docs/lighthouse/performance/uses-rel-preconnect/) hints help the browser establish a connection earlier in the page load, saving time when the first request for that origin is made. The following are the origins that the page preconnected to.",
	noPreconnectOrigins: "no origins were preconnected",
	tooManyPreconnectLinksWarning: "More than 4 `preconnect` connections were found. These should be used sparingly and only to the most important origins.",
	unusedWarning: "Unused preconnect. Only use `preconnect` for origins that the page is likely to request.",
	crossoriginWarning: "Unused preconnect. Check that the `crossorigin` attribute is used properly.",
	columnSource: "Source",
	noPreconnectCandidates: "No additional origins are good candidates for preconnecting",
	estSavingTableTitle: "Preconnect candidates",
	estSavingTableDescription: "Add [preconnect](https://developer.chrome.com/docs/lighthouse/performance/uses-rel-preconnect/) hints to your most important origins, but try to use no more than 4.",
	columnOrigin: "Origin",
	columnWastedMs: "Est LCP savings"
}, ev = i("models/trace/insights/NetworkDependencyTree.ts", $_), tv = t.bind(void 0, ev), nv = /* @__PURE__ */ new Set([
	x.ResourceType.Image,
	x.ResourceType.XHR,
	x.ResourceType.Fetch,
	x.ResourceType.EventSource
]), rv = w(15e3), iv = w(50);
function av(e) {
	return {
		insightKey: G.NETWORK_DEPENDENCY_TREE,
		strings: $_,
		title: tv($_.title),
		description: tv($_.description),
		docs: "https://developer.chrome.com/docs/performance/insights/network-dependency-tree",
		category: W.LCP,
		state: e.fail ? "fail" : "pass",
		...e
	};
}
function ov(e, t) {
	if (e.args.data.requestId === t.navigationId) return !0;
	if (e.args.data.isLinkPreload) return !1;
	let n = e.args.data.resourceType === x.ResourceType.Document && e.args.data.frame !== t.frameId;
	if (nv.has(e.args.data.resourceType) || n || e.args.data.mimeType.startsWith("image/") || !(e.args.data.initiator?.url || gi(e)?.url)) return !1;
	let r = Wi(e);
	return Ki(e) || r;
}
function sv(e) {
	if (e.children.length === 0) return e;
	let t = e.children[0];
	for (let n of e.children) {
		let e = sv(n);
		e.timeFromInitialRequest > t.timeFromInitialRequest && (t = e);
	}
	return t;
}
function cv(e) {
	for (let t of e) t.children.length > 0 && (t.children.sort((e, t) => {
		let n = sv(e);
		return sv(t).timeFromInitialRequest - n.timeFromInitialRequest;
	}), cv(t.children));
}
function lv(e) {
	let t = [], n = /* @__PURE__ */ new Map(), r = C(0), i = !1, a = [];
	function o(e) {
		if (e.length === 0) return;
		e.length >= 2 && (i = !0);
		let o = e[0], s = e[e.length - 1], c = C(s.ts + s.dur - o.ts);
		c > r && (r = c, a = e);
		let l = t;
		for (let t = 0; t < e.length; ++t) {
			let r = e[t], i = l.find((e) => e.request === r);
			i || (i = {
				request: r,
				timeFromInitialRequest: C(r.ts + r.dur - o.ts),
				children: [],
				relatedRequests: /* @__PURE__ */ new Set()
			}, l.push(i)), e.forEach((e) => i?.relatedRequests.add(e)), n.set(r, t < 2 ? [] : [tv($_.warningDescription)]), l = i.children;
		}
	}
	let s = /* @__PURE__ */ new Set();
	function c(e) {
		return e.getDependents().filter((e) => e.getDependencies().every((e) => s.has(e)));
	}
	if (e.lantern?.graph.traverse((t, n) => {
		if (s.add(t), t.type !== "network" || !ov(t.rawRequest, e)) return;
		let r = n.filter((e) => e.type === "network").reverse().map((e) => e.rawRequest);
		r.some((t) => !ov(t, e)) || t.isNonNetworkProtocol || o(r);
	}, c), a.length > 0) {
		let e = t;
		for (let t of a) {
			let n = e.find((e) => e.request === t);
			n ? (n.isLongest = !0, e = n.children) : console.error("Some request in the longest chain is not found");
		}
	}
	return cv(t), {
		rootNodes: t,
		maxTime: r,
		fail: i,
		relatedEvents: n
	};
}
function uv(e) {
	return new f(e).securityOrigin();
}
function dv(e) {
	if (!e) return null;
	let t = e.indexOf("<"), n = e.indexOf(">");
	if (t !== 0 || n === -1 || n <= t) return null;
	let r = e.substring(t + 1, n).trim();
	if (!r) return null;
	let i = e.substring(n + 1).trim();
	if (i) {
		let t = i.split(";");
		for (let n of t) {
			let t = n.trim();
			if (!t) continue;
			let i = t.indexOf("=");
			if (i === -1) continue;
			let a = t.substring(0, i).trim().toLowerCase(), o = t.substring(i + 1).trim();
			if (o.startsWith("\"") && o.endsWith("\"") && (o = o.substring(1, o.length - 1)), a === "rel" && o === "preconnect") return {
				url: r,
				headerText: e
			};
		}
	}
	return null;
}
function fv(e) {
	if (!e) return [];
	let t = [];
	for (let n = 0; n < e.length;) {
		let r = e.indexOf(">", n);
		if (r === -1) break;
		let i = e.indexOf(",", r), a = i === -1 ? e.length : i, o = e.substring(n, a);
		if (a + 1 <= n) {
			console.warn("unexpected infinite loop, bailing");
			break;
		}
		n = a + 1;
		let s = dv(o.trim());
		s && t.push(s);
	}
	return t;
}
function pv(e, t, n, r) {
	let i = [];
	for (let t of e.NetworkRequests.linkPreconnectEvents) i.push({
		node_id: t.args.data.node_id,
		frame: t.args.data.frame,
		url: t.args.data.url,
		unused: !n.some((e) => uv(t.args.data.url) === uv(e.args.data.url)),
		crossorigin: r.some((e) => e.origin === uv(t.args.data.url)),
		source: "DOM"
	});
	let a = e.NetworkRequests.byId.get(t.navigationId);
	return a?.args.data.responseHeaders?.forEach((e) => {
		e.name.toLowerCase() === "link" && fv(e.value)?.forEach((e) => i.push({
			url: e.url,
			headerText: e.headerText,
			request: a,
			unused: !n.some((t) => uv(e.url) === uv(t.args.data.url)),
			crossorigin: r.some((t) => t.origin === uv(e.url)),
			source: "ResponseHeader"
		}));
	}), i;
}
function mv(e) {
	return !!e.args.data.timing && e.args.data.timing.connectEnd >= 0 && e.args.data.timing.connectStart >= 0;
}
function hv(e) {
	let { timing: t } = e.args.data;
	return t ? t.dnsStart === -1 && t.dnsEnd === -1 && t.connectStart === -1 && t.connectEnd === -1 || t.dnsEnd - t.dnsStart === 0 && t.connectEnd - t.connectStart === 0 : !1;
}
function gv(e, t) {
	return N(Math.max(0, e.args.data.syntheticData.sendStartTime - t.args.data.syntheticData.finishTime)) < rv;
}
function _v(e, t, n, r) {
	let i = /* @__PURE__ */ new Map();
	return n.forEach((n) => {
		if (!mv(n) || Op(e, n) === t) return;
		let a = new URL(n.args.data.url);
		if (a.origin === "null") return;
		let o = new URL(t.args.data.url).origin;
		a.origin !== o && r.has(n.args.data.url) && (hv(n) || gv(n, t) && S(i, a.origin, () => []).push(n));
	}), i;
}
function vv(e, t, n) {
	if (!t.lantern) return [];
	let r = e.NetworkRequests.byId.get(t.navigationId);
	if (!r) return [];
	let { rtt: i, additionalRttByOrigin: a } = t.lantern.simulator.getOptions(), o = t.lantern.metrics.largestContentfulPaint.pessimisticGraph, s = t.lantern.metrics.firstContentfulPaint.pessimisticGraph, c = /* @__PURE__ */ new Set();
	o.traverse((e) => {
		e.type === "network" && c.add(e.request.url);
	});
	let l = /* @__PURE__ */ new Set();
	s.traverse((e) => {
		e.type === "network" && l.add(e.request.url);
	});
	let u = _v(e, r, n, c), d = w(0), p = w(0), m = [];
	return u.forEach((e) => {
		let t = e[0];
		if (!t.args.data.timing) return;
		let n = new f(t.args.data.url), o = n.securityOrigin(), s = a.get(o) ?? 0, c = w(i + s);
		n.scheme === "https" && (c = w(c * 2));
		let u = C(t.args.data.syntheticData.sendStartTime - r.args.data.syntheticData.finishTime + M(t.args.data.timing.dnsStart)), h = Math.min(c, N(u));
		h < iv || (d = Math.max(h, d), l.has(t.args.data.url) && (p = Math.max(h, p)), m.push({
			origin: o,
			wastedMs: h
		}));
	}), m = m.sort((e, t) => t.wastedMs - e.wastedMs), m.slice(0, 4);
}
function yv(e) {
	return e.insightKey === G.NETWORK_DEPENDENCY_TREE;
}
function bv(e, t) {
	if (!t.navigation) return av({
		rootNodes: [],
		maxTime: 0,
		fail: !1,
		preconnectedOrigins: [],
		preconnectCandidates: []
	});
	let { rootNodes: n, maxTime: r, fail: i, relatedEvents: a } = lv(t), o = e.NetworkRequests.byTime.filter((e) => I(e, t.bounds)), s = vv(e, t, o);
	return av({
		rootNodes: n,
		maxTime: r,
		fail: i,
		relatedEvents: a,
		preconnectedOrigins: pv(e, t, o, s),
		preconnectCandidates: s
	});
}
function xv(e) {
	function t(e, n) {
		e.forEach((e) => {
			n.push({
				type: "ENTRY_OUTLINE",
				entry: e.request,
				outlineReason: "ERROR"
			}), t(e.children, n);
		});
	}
	let n = [];
	return t(e.rootNodes, n), n;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/insights/RenderBlocking.ts
var Sv = /* @__PURE__ */ e({
	UIStrings: () => Cv,
	createOverlayForRequest: () => Pv,
	createOverlays: () => Fv,
	generateInsight: () => Nv,
	i18nString: () => Tv,
	isRenderBlockingInsight: () => Ev
}), Cv = {
	title: "Render-blocking requests",
	description: "Requests are blocking the page's initial render, which may delay LCP. [Deferring or inlining](https://developer.chrome.com/docs/performance/insights/render-blocking) can move these network requests out of the critical path.",
	renderBlockingRequest: "Request",
	duration: "Duration",
	noRenderBlocking: "No render-blocking requests for this navigation"
}, wv = i("models/trace/insights/RenderBlocking.ts", Cv), Tv = t.bind(void 0, wv);
function Ev(e) {
	return e.insightKey === "RenderBlocking";
}
var Dv = 50;
function Ov(e) {
	let t = /* @__PURE__ */ new Map();
	for (let [n, r] of e) n.type === "network" && t.set(n.request.requestId, {
		node: n,
		nodeTiming: r
	});
	return t;
}
function kv(e, t) {
	let n = t.simulator, r = t.metrics.firstContentfulPaint.optimisticGraph, { nodeTimings: i } = t.simulator.simulate(r), a = new Map(i), o = r.cloneWithRelationships((t) => !e.has(t.id));
	if (o.type !== "network") throw Error("minimalFCPGraph not a NetworkNode");
	let s = Math.max(...Array.from(Array.from(a).map((e) => e[1].endTime))), c = o.request.transferSize, l = c || 0;
	o.request.transferSize = l + 0;
	let u = n.simulate(o).timeInMs;
	return o.request.transferSize = c, Math.round(Math.max(s - u, 0));
}
function Av(e, t) {
	return e.LargestImagePaint.lcpRequestByNavigationId.has(t.navigationId);
}
function jv(e, t, n) {
	if (!t.lantern) return;
	let r = Ov(t.lantern.metrics.firstContentfulPaint.optimisticEstimate.nodeTimings), i = {
		FCP: 0,
		LCP: 0
	}, a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set();
	for (let e of n) {
		let t = r.get(e.args.data.requestId);
		if (!t) continue;
		let { node: n, nodeTiming: i } = t;
		n.traverse((e) => o.add(e.id));
		let s = Math.round(i.duration);
		s < Dv || a.set(n.id, s);
	}
	return a.size && (i.FCP = kv(o, t.lantern), Av(e, t) || (i.LCP = i.FCP)), {
		metricSavings: i,
		requestIdToWastedMs: a
	};
}
function Mv(e) {
	return {
		insightKey: G.RENDER_BLOCKING,
		strings: Cv,
		title: Tv(Cv.title),
		description: Tv(Cv.description),
		docs: "https://developer.chrome.com/docs/performance/insights/render-blocking",
		category: W.LCP,
		state: e.renderBlockingRequests.length > 0 ? "fail" : "pass",
		...e
	};
}
function Nv(e, t) {
	if (!t.navigation) return Mv({ renderBlockingRequests: [] });
	let n = e.PageLoadMetrics.metricScoresByFrameId.get(t.frameId)?.get(t.navigation)?.get(V.FP)?.event?.ts;
	if (!n) return Mv({
		renderBlockingRequests: [],
		warnings: [cm.NO_FP]
	});
	let r = [];
	for (let i of e.NetworkRequests.byTime) if (i.args.data.frame === t.frameId && Wi(i) && !(i.args.data.syntheticData.finishTime > n)) {
		if (i.args.data.renderBlocking === "in_body_parser_blocking") {
			let e = i.args.data.priority, t = i.args.data.resourceType === x.ResourceType.Script && e === x.ResourcePriority.High;
			if (e !== x.ResourcePriority.VeryHigh && !t) continue;
		}
		oi(i, t.frameId, e.Meta.navigationsByFrameId) === t.navigation && r.push(i);
	}
	let i = jv(e, t, r);
	return r = r.sort((e, t) => t.dur - e.dur), Mv({
		relatedEvents: r,
		renderBlockingRequests: r,
		...i
	});
}
function Pv(e) {
	return {
		type: "ENTRY_OUTLINE",
		entry: e,
		outlineReason: "ERROR"
	};
}
function Fv(e) {
	return e.renderBlockingRequests.map((e) => Pv(e));
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/insights/SlowCSSSelector.ts
var Iv = /* @__PURE__ */ e({
	UIStrings: () => Lv,
	createOverlays: () => Gv,
	generateInsight: () => Wv,
	i18nString: () => zv,
	isSlowCSSSelectorInsight: () => Uv
}), Lv = {
	title: "CSS Selector costs",
	description: "If Recalculate Style costs remain high, selector optimization can reduce them. [Optimize the selectors](https://developer.chrome.com/docs/performance/insights/slow-css-selector) with both high elapsed time and high slow-path %. Simpler selectors, fewer selectors, a smaller DOM, and a shallower DOM will all reduce matching costs.",
	matchAttempts: "Match attempts",
	matchCount: "Match count",
	elapsed: "Elapsed time",
	topSelectors: "Top selectors",
	total: "Total",
	enableSelectorData: "No CSS selector data was found. CSS selector stats need to be enabled in the performance panel settings.",
	topSelectorElapsedTime: "Top selector elapsed time",
	topSelectorMatchAttempt: "Top selector match attempt"
}, Rv = i("models/trace/insights/SlowCSSSelector.ts", Lv), zv = t.bind(void 0, Rv), Bv = 500;
function Vv(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let [r, i] of e.dataForRecalcStyleEvent) if (r.args.beginData?.frame === t.frameId && I(r, t.bounds)) for (let e of i.timings) {
		let t = e[D.Selector] + "_" + e[D.StyleSheetId], r = n.get(t);
		r === void 0 ? n.set(t, { ...e }) : (r[D.Elapsed] += e[D.Elapsed], r[D.FastRejectCount] += e[D.FastRejectCount], r[D.MatchAttempts] += e[D.MatchAttempts], r[D.MatchCount] += e[D.MatchCount]);
	}
	return [...n.values()];
}
function Hv(e) {
	return {
		insightKey: G.SLOW_CSS_SELECTOR,
		strings: Lv,
		title: zv(Lv.title),
		description: zv(Lv.description),
		docs: "https://developer.chrome.com/docs/performance/insights/slow-css-selector",
		category: W.ALL,
		state: e.topSelectorElapsedMs && e.topSelectorMatchAttempts ? "informative" : "pass",
		...e
	};
}
function Uv(e) {
	return e.insightKey === G.SLOW_CSS_SELECTOR;
}
function Wv(e, t) {
	let n = e.SelectorStats;
	if (!n) throw Error("no selector stats data");
	let r = Vv(n, t), i = 0, a = 0, o = 0;
	r.map((e) => {
		i += e[D.Elapsed], a += e[D.MatchAttempts], o += e[D.MatchCount];
	});
	let s = null, c = null;
	return r.length > 0 && (s = r.reduce((e, t) => e[D.Elapsed] > t[D.Elapsed] ? e : t), s && s[D.Elapsed] < Bv && (s = null), c = r.reduce((e, t) => e[D.MatchAttempts] > t[D.MatchAttempts] ? e : t)), Hv({
		relatedEvents: [],
		totalElapsedMs: w(i / 1e3),
		totalMatchAttempts: a,
		totalMatchCount: o,
		topSelectorElapsedMs: s,
		topSelectorMatchAttempts: c
	});
}
function Gv(e) {
	return [];
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/insights/ThirdParties.ts
var Kv = /* @__PURE__ */ e({
	UIStrings: () => qv,
	createOverlays: () => ty,
	createOverlaysForSummary: () => ey,
	generateInsight: () => $v,
	i18nString: () => Yv,
	isThirdPartyInsight: () => Qv
}), qv = {
	title: "3rd parties",
	description: "3rd party code can significantly impact load performance. [Reduce and defer loading of 3rd party code](https://developer.chrome.com/docs/performance/insights/third-parties) to prioritize your page's content.",
	columnThirdParty: "3rd party",
	columnTransferSize: "Transfer size",
	columnMainThreadTime: "Main thread time",
	noThirdParties: "No third parties found"
}, Jv = i("models/trace/insights/ThirdParties.ts", qv), Yv = t.bind(void 0, Jv);
function Xv(e, t) {
	let n = [];
	for (let r of e) r.entity !== t && n.push(...r.relatedEvents);
	return n;
}
function Zv(e) {
	return {
		insightKey: G.THIRD_PARTIES,
		strings: qv,
		title: Yv(qv.title),
		description: Yv(qv.description),
		docs: "https://developer.chrome.com/docs/performance/insights/third-parties",
		category: W.ALL,
		state: e.entitySummaries.find((t) => t.entity !== e.firstPartyEntity) ? "informative" : "pass",
		...e
	};
}
function Qv(e) {
	return e.insightKey === G.THIRD_PARTIES;
}
function $v(e, t) {
	let n = Qp(e, t.bounds), r = t.navigation?.args.data?.documentLoaderURL ?? e.Meta.mainFrameURL, i = ne.getEntity(r) || jr(e.Renderer.entityMappings.createdEntityCache, r);
	return Zv({
		relatedEvents: Xv(n, i),
		firstPartyEntity: i,
		entitySummaries: n
	});
}
function ey(e) {
	let t = [];
	for (let n of e.relatedEvents) {
		if (n.dur === void 0 || n.dur < 1e3) continue;
		let e = {
			type: "ENTRY_OUTLINE",
			entry: n,
			outlineReason: "INFO"
		};
		t.push(e);
	}
	return t;
}
function ty(e) {
	let t = [], n = e.entitySummaries ?? [];
	for (let r of n) {
		if (r.entity === e.firstPartyEntity) continue;
		let n = ey(r);
		t.push(...n);
	}
	return t;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/insights/Viewport.ts
var ny = /* @__PURE__ */ e({
	UIStrings: () => ry,
	createOverlays: () => ly,
	generateInsight: () => cy,
	i18nString: () => ay,
	isViewportInsight: () => sy
}), ry = {
	title: "Optimize viewport for mobile",
	description: "Tap interactions may be [delayed by up to 300\xA0ms](https://developer.chrome.com/docs/performance/insights/viewport) if the viewport is not optimized for mobile.",
	mobileTapDelayLabel: "Mobile tap delay"
}, iy = i("models/trace/insights/Viewport.ts", ry), ay = t.bind(void 0, iy);
function oy(e) {
	return {
		insightKey: G.VIEWPORT,
		strings: ry,
		title: ay(ry.title),
		description: ay(ry.description),
		docs: "https://developer.chrome.com/docs/performance/insights/viewport",
		category: W.INP,
		state: e.mobileOptimized === !1 ? "fail" : "pass",
		...e
	};
}
function sy(e) {
	return e.insightKey === G.VIEWPORT;
}
function cy(e, t) {
	let n = e.UserInteractions.parseMetaViewportEvents.find((e) => e.args.data.frame === t.frameId && I(e, t.bounds)), r = e.UserInteractions.beginCommitCompositorFrameEvents.filter((e) => e.args.frame !== t.frameId || n && e.ts < n.ts ? !1 : I(e, t.bounds));
	if (!r.length) return oy({
		mobileOptimized: null,
		warnings: [cm.NO_LAYOUT]
	});
	for (let t of r) if (!t.args.is_mobile_optimized) {
		let t = [...e.UserInteractions.interactionsOverThreshold.values()].filter((e) => Ff(e) === "POINTER" && e.inputDelay >= 5e4), r = Math.max(0, ...t.map((e) => e.inputDelay)) / 1e3;
		return oy({
			mobileOptimized: !1,
			viewportEvent: n,
			longPointerInteractions: t,
			metricSavings: { INP: m(r, 0, 300) }
		});
	}
	return oy({
		mobileOptimized: !0,
		viewportEvent: n
	});
}
function ly(e) {
	return e.longPointerInteractions ? e.longPointerInteractions.map((e) => {
		let t = Math.min(e.inputDelay, 3e5);
		return {
			type: "TIMESPAN_BREAKDOWN",
			entry: e,
			sections: [{
				bounds: F(C(e.ts), C(e.ts + t)),
				label: ay(ry.mobileTapDelayLabel),
				showDuration: !0
			}],
			renderLocation: "ABOVE_EVENT"
		};
	}) : [];
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/insights/Models.ts
var uy = /* @__PURE__ */ e({
	CLSCulprits: () => ah,
	Cache: () => Mm,
	CharacterSet: () => qm,
	DOMSize: () => Rh,
	DocumentLatency: () => Eh,
	DuplicatedJavaScript: () => Yh,
	FontDisplay: () => rg,
	ForcedReflow: () => dg,
	INPBreakdown: () => Hg,
	ImageDelivery: () => Cg,
	LCPBreakdown: () => Zg,
	LCPDiscovery: () => s_,
	LegacyJavaScript: () => k_,
	ModernHTTP: () => z_,
	NetworkDependencyTree: () => Q_,
	RenderBlocking: () => Sv,
	SlowCSSSelector: () => Iv,
	ThirdParties: () => Kv,
	Viewport: () => ny
}), q = class extends Error {}, dy = class {
	static rewriteChromeInternalUrl(e) {
		return e?.startsWith("chrome://") ? (e.endsWith("/") && (e = e.replace(/\/$/, "")), e.replace(/^chrome:\/\/chrome\//, "chrome://")) : e;
	}
	static equalWithExcludedFragments(e, t) {
		[e, t] = [e, t].map(this.rewriteChromeInternalUrl);
		try {
			let n = new URL(e);
			n.hash = "";
			let r = new URL(t);
			return r.hash = "", n.href === r.href;
		} catch {
			return !1;
		}
	}
}, fy = 14336, py = .4, my = {
	Document: .9,
	XHR: .9,
	Fetch: .9
}, hy = class e {
	static get summary() {
		return "__SUMMARY__";
	}
	static groupByOrigin(e) {
		let t = /* @__PURE__ */ new Map();
		return e.forEach((e) => {
			let n = e.parsedURL.securityOrigin;
			if (n.startsWith("chrome-extension:")) return;
			let r = t.get(n) || [];
			r.push(e), t.set(n, r);
		}), t;
	}
	static getSummary(e) {
		e.sort((e, t) => e - t);
		let t;
		return t = e.length === 0 ? e[0] : e.length % 2 == 0 ? (e[Math.floor((e.length - 1) / 2)] + e[Math.floor((e.length - 1) / 2) + 1]) / 2 : e[Math.floor((e.length - 1) / 2)], {
			min: e[0],
			max: e[e.length - 1],
			avg: e.reduce((e, t) => e + t, 0) / e.length,
			median: t
		};
	}
	static summarize(t) {
		let n = /* @__PURE__ */ new Map(), r = [];
		for (let [i, a] of t) n.set(i, e.getSummary(a)), r.push(...a);
		return n.set(e.summary, e.getSummary(r)), n;
	}
	static estimateValueByOrigin(t, n) {
		let r = e.estimateIfConnectionWasReused(t), i = e.groupByOrigin(t), a = /* @__PURE__ */ new Map();
		for (let [e, t] of i.entries()) {
			let i = [];
			for (let e of t) {
				let t = e.timing;
				if (!t) continue;
				let a = n({
					request: e,
					timing: t,
					connectionReused: r.get(e.requestId)
				});
				a !== void 0 && (i = i.concat(a));
			}
			i.length && a.set(e, i);
		}
		return a;
	}
	static estimateRTTViaConnectionTiming(e) {
		let { timing: t, connectionReused: n, request: r } = e;
		if (n) return;
		let { connectStart: i, sslStart: a, sslEnd: o, connectEnd: s } = t;
		if (s >= 0 && i >= 0 && r.protocol.startsWith("h3")) return s - i;
		if (a >= 0 && o >= 0 && a !== i) return [s - a, a - i];
		if (i >= 0 && s >= 0) return s - i;
	}
	static estimateRTTViaDownloadTiming(e) {
		let { timing: t, connectionReused: n, request: r } = e;
		if (n || r.transferSize <= fy || !Number.isFinite(t.receiveHeadersEnd) || t.receiveHeadersEnd < 0) return;
		let i = r.networkEndTime - r.networkRequestTime - t.receiveHeadersEnd, a = Math.log2(r.transferSize / fy);
		if (!(a > 5)) return i / a;
	}
	static estimateRTTViaSendStartTiming(e) {
		let { timing: t, connectionReused: n, request: r } = e;
		if (n || !Number.isFinite(t.sendStart) || t.sendStart < 0) return;
		let i = 1;
		return r.protocol.startsWith("h3") || (i += 1), r.parsedURL.scheme === "https" && (i += 1), t.sendStart / i;
	}
	static estimateRTTViaHeadersEndTiming(e) {
		let { timing: t, connectionReused: n, request: r } = e;
		if (!Number.isFinite(t.receiveHeadersEnd) || t.receiveHeadersEnd < 0 || !r.resourceType) return;
		let i = my[r.resourceType] || py, a = t.receiveHeadersEnd * i, o = 1;
		return n || (o += 1, r.protocol.startsWith("h3") || (o += 1), r.parsedURL.scheme === "https" && (o += 1)), Math.max((t.receiveHeadersEnd - a) / o, 3);
	}
	static estimateResponseTimeByOrigin(t, n) {
		return e.estimateValueByOrigin(t, ({ request: t, timing: r }) => {
			if (t.serverResponseTime !== void 0) return t.serverResponseTime;
			if (!Number.isFinite(r.receiveHeadersEnd) || r.receiveHeadersEnd < 0 || !Number.isFinite(r.sendEnd) || r.sendEnd < 0) return;
			let i = r.receiveHeadersEnd - r.sendEnd, a = t.parsedURL.securityOrigin, o = n.get(a) || n.get(e.summary) || 0;
			return Math.max(i - o, 0);
		});
	}
	static canTrustConnectionInformation(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of e) {
			let e = t.get(n.connectionId) || !n.connectionReused;
			t.set(n.connectionId, e);
		}
		return t.size <= 1 ? !1 : Array.from(t.values()).every((e) => e);
	}
	static estimateIfConnectionWasReused(t, n) {
		let { forceCoarseEstimates: r = !1 } = n || {};
		if (!r && e.canTrustConnectionInformation(t)) return new Map(t.map((e) => [e.requestId, !!e.connectionReused]));
		let i = /* @__PURE__ */ new Map(), a = e.groupByOrigin(t);
		for (let e of a.values()) {
			let t = e.map((e) => e.networkEndTime).reduce((e, t) => Math.min(e, t), Infinity);
			for (let n of e) i.set(n.requestId, n.networkRequestTime >= t || n.protocol === "h2");
			let n = e.reduce((e, t) => e.networkRequestTime > t.networkRequestTime ? t : e);
			i.set(n.requestId, !1);
		}
		return i;
	}
	static estimateRTTByOrigin(t, n) {
		let { forceCoarseEstimates: r = !1, coarseEstimateMultiplier: i = .3, useDownloadEstimates: a = !0, useSendStartEstimates: o = !0, useHeadersEndEstimates: s = !0 } = n || {}, c = e.estimateIfConnectionWasReused(t), l = e.groupByOrigin(t), u = /* @__PURE__ */ new Map();
		for (let [e, t] of l.entries()) {
			let n = [];
			function l(e, r = 1) {
				for (let i of t) {
					let t = i.timing;
					if (!t || !i.transferSize) continue;
					let a = e({
						request: i,
						timing: t,
						connectionReused: c.get(i.requestId)
					});
					a !== void 0 && (Array.isArray(a) ? n.push(...a.map((e) => e * r)) : n.push(a * r));
				}
			}
			r || l(this.estimateRTTViaConnectionTiming), n.length || (a && l(this.estimateRTTViaDownloadTiming, i), o && l(this.estimateRTTViaSendStartTiming, i), s && l(this.estimateRTTViaHeadersEndTiming, i)), n.length && u.set(e, n);
		}
		return e.summarize(u);
	}
	static estimateMinimumRTTByOrigin(t, n) {
		let r = /* @__PURE__ */ new Map();
		for (let [i, a] of e.estimateRTTByOrigin(t, n).entries()) r.set(i, a.min);
		return r;
	}
	static estimateServerResponseTimeByOrigin(t, n) {
		let r = e.estimateResponseTimeByOrigin(t, n.rttByOrigin);
		return e.summarize(r);
	}
	static estimateThroughput(e) {
		let t = 0, n = e.reduce((e, n) => n.parsedURL?.scheme === "data" || n.failed || !n.finished || n.statusCode > 300 || !n.transferSize ? e : (t += n.transferSize, e.push({
			time: n.responseHeadersEndTime / 1e3,
			isStart: !0
		}), e.push({
			time: n.networkEndTime / 1e3,
			isStart: !1
		}), e), []).sort((e, t) => e.time - t.time);
		if (!n.length) return null;
		let r = 0, i = 0, a = 0;
		return n.forEach((e) => {
			e.isStart ? (r === 0 && (i = e.time), r++) : (r--, r === 0 && (a += e.time - i));
		}), t * 8 / a;
	}
	static computeRTTAndServerResponseTime(t) {
		let n = e.estimateMinimumRTTByOrigin(t), r = n.size ? Math.min(...Array.from(n.values())) : 0, i = e.estimateServerResponseTimeByOrigin(t, { rttByOrigin: n }), a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
		for (let [e, t] of i.entries()) {
			let i = n.get(e) || r;
			a.set(e, i - r), o.set(e, t.median);
		}
		return {
			rtt: r,
			additionalRttByOrigin: a,
			serverResponseTimeByOrigin: o
		};
	}
	static analyze(t) {
		let n = e.estimateThroughput(t);
		return n === null ? null : {
			throughput: n,
			...e.computeRTTAndServerResponseTime(t)
		};
	}
	static findResourceForUrl(e, t) {
		return e.find((e) => t.startsWith(e.url) && dy.equalWithExcludedFragments(e.url, t));
	}
	static findLastDocumentForUrl(e, t) {
		let n = e.filter((e) => e.resourceType === "Document" && !e.failed && t.startsWith(e.url) && dy.equalWithExcludedFragments(e.url, t));
		return n[n.length - 1];
	}
	static resolveRedirects(e) {
		for (; e.redirectDestination;) e = e.redirectDestination;
		return e;
	}
}, J = class e {
	static types = {
		NETWORK: "network",
		CPU: "cpu"
	};
	_id;
	_isMainDocument;
	dependents;
	dependencies;
	constructor(e) {
		this._id = e, this._isMainDocument = !1, this.dependents = [], this.dependencies = [];
	}
	get id() {
		return this._id;
	}
	get type() {
		throw new q("Unimplemented");
	}
	get startTime() {
		throw new q("Unimplemented");
	}
	get endTime() {
		throw new q("Unimplemented");
	}
	setIsMainDocument(e) {
		this._isMainDocument = e;
	}
	isMainDocument() {
		return this._isMainDocument;
	}
	getDependents() {
		return this.dependents.slice();
	}
	getNumberOfDependents() {
		return this.dependents.length;
	}
	getDependencies() {
		return this.dependencies.slice();
	}
	getNumberOfDependencies() {
		return this.dependencies.length;
	}
	getRootNode() {
		let e = this;
		for (; e.dependencies.length;) e = e.dependencies[0];
		return e;
	}
	addDependent(e) {
		e.addDependency(this);
	}
	addDependency(e) {
		if (e === this) throw new q("Cannot add dependency on itself");
		this.dependencies.includes(e) || (e.dependents.push(this), this.dependencies.push(e));
	}
	removeDependent(e) {
		e.removeDependency(this);
	}
	removeDependency(e) {
		if (!this.dependencies.includes(e)) return;
		let t = e.dependents.indexOf(this);
		e.dependents.splice(t, 1), this.dependencies.splice(this.dependencies.indexOf(e), 1);
	}
	removeAllDependencies() {
		for (let e of this.dependencies.slice()) this.removeDependency(e);
	}
	isDependentOn(e) {
		let t = !1;
		return this.traverse((n) => {
			t ||= n === e;
		}, (e) => t ? [] : e.getDependencies()), t;
	}
	cloneWithoutRelationships() {
		let t = new e(this.id);
		return t.setIsMainDocument(this._isMainDocument), t;
	}
	cloneWithRelationships(e) {
		let t = this.getRootNode(), n = /* @__PURE__ */ new Map();
		t.traverse((t) => {
			if (!n.has(t.id)) {
				if (e === void 0) {
					n.set(t.id, t.cloneWithoutRelationships());
					return;
				}
				e(t) && t.traverse((e) => n.set(e.id, e.cloneWithoutRelationships()), (e) => e.dependencies.filter((e) => !n.has(e.id)));
			}
		}), t.traverse((e) => {
			let t = n.get(e.id);
			if (t) for (let r of e.dependencies) {
				let e = n.get(r.id);
				if (!e) throw new q("Dependency somehow not cloned");
				t.addDependency(e);
			}
		});
		let r = n.get(this.id);
		if (!r) throw new q("Cloned graph missing node");
		return r;
	}
	traverse(e, t) {
		for (let { node: n, traversalPath: r } of this.traverseGenerator(t)) e(n, r);
	}
	*traverseGenerator(e) {
		e ||= (e) => e.getDependents();
		let t = [[this]], n = /* @__PURE__ */ new Set([this.id]);
		for (; t.length;) {
			let r = t.shift(), i = r[0];
			yield {
				node: i,
				traversalPath: r
			};
			for (let a of e(i)) n.has(a.id) || (n.add(a.id), t.push([a, ...r]));
		}
	}
	static findCycle(t, n = "both") {
		if (n === "both") return e.findCycle(t, "dependents") || e.findCycle(t, "dependencies");
		let r = /* @__PURE__ */ new Set(), i = [], a = [t], o = /* @__PURE__ */ new Map([[t, 0]]);
		for (; a.length;) {
			let e = a.pop();
			if (i.includes(e)) return i;
			if (r.has(e)) continue;
			for (; i.length > o.get(e);) i.pop();
			r.add(e), i.push(e);
			let t = n === "dependents" ? e.dependents : e.dependencies;
			for (let e of t) a.includes(e) || (a.push(e), o.set(e, i.length));
		}
		return null;
	}
	canDependOn(e) {
		return e.startTime <= this.startTime;
	}
}, gy = class e extends J {
	_event;
	_childEvents;
	correctedEndTs;
	constructor(e, t = [], n) {
		let r = `${e.tid}.${e.ts}`;
		super(r), this._event = e, this._childEvents = t, this.correctedEndTs = n;
	}
	get type() {
		return J.types.CPU;
	}
	get startTime() {
		return this._event.ts;
	}
	get endTime() {
		return this.correctedEndTs ? this.correctedEndTs : this._event.ts + this._event.dur;
	}
	get duration() {
		return this.endTime - this.startTime;
	}
	get event() {
		return this._event;
	}
	get childEvents() {
		return this._childEvents;
	}
	didPerformLayout() {
		return this._childEvents.some((e) => e.name === "Layout");
	}
	getEvaluateScriptURLs() {
		let e = /* @__PURE__ */ new Set();
		for (let t of this._childEvents) t.name === "EvaluateScript" && t.args.data?.url && e.add(t.args.data.url);
		return e;
	}
	cloneWithoutRelationships() {
		return new e(this._event, this._childEvents, this.correctedEndTs);
	}
}, _y = [
	"blob",
	"data",
	"intent",
	"file",
	"filesystem",
	"chrome-extension"
];
function vy(e) {
	let t = e.includes(":") ? e.slice(0, e.indexOf(":")) : e;
	return _y.includes(t);
}
var yy = class e extends J {
	_request;
	constructor(e) {
		super(e.requestId), this._request = e;
	}
	get type() {
		return J.types.NETWORK;
	}
	get startTime() {
		return this._request.rendererStartTime * 1e3;
	}
	get endTime() {
		return this._request.networkEndTime * 1e3;
	}
	get rawRequest() {
		return this._request.rawRequest;
	}
	get request() {
		return this._request;
	}
	get initiatorType() {
		return this._request.initiator.type;
	}
	get fromDiskCache() {
		return !!this._request.fromDiskCache;
	}
	get isNonNetworkProtocol() {
		return vy(this.request.protocol) || vy(this.request.parsedURL.scheme);
	}
	get isConnectionless() {
		return this.fromDiskCache || this.isNonNetworkProtocol;
	}
	hasRenderBlockingPriority() {
		let e = this._request.priority, t = this._request.resourceType === "Script", n = this._request.resourceType === "Document";
		return e === "VeryHigh" || e === "High" && t || e === "High" && n;
	}
	cloneWithoutRelationships() {
		let t = new e(this._request);
		return t.setIsMainDocument(this._isMainDocument), t;
	}
}, by = "RunTask", xy = "ThreadControllerImpl::RunTask", Sy = "ThreadControllerImpl::DoWork", Cy = "TaskQueueManager::ProcessTaskFromWorkQueue", wy = 10, Ty = /^video/, Ey = class e {
	static getNetworkInitiators(e) {
		if (!e.initiator) return [];
		if (e.initiator.url) return [e.initiator.url];
		if (e.initiator.type === "script") {
			let t = /* @__PURE__ */ new Set(), n = e.initiator.stack;
			for (; n;) {
				let e = n.callFrames || [];
				for (let n of e) n.url && t.add(n.url);
				n = n.parent;
			}
			return Array.from(t);
		}
		return [];
	}
	static getNetworkNodeOutput(e) {
		let t = [], n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
		return e.forEach((e) => {
			if (Ty.test(e.mimeType) || e.fromWorker) return;
			for (; n.has(e.requestId);) e.requestId += ":duplicate";
			let a = new yy(e);
			t.push(a);
			let o = r.get(e.url) || [];
			if (o.push(a), n.set(e.requestId, a), r.set(e.url, o), e.frameId && e.resourceType === "Document" && e.documentURL === e.url) {
				let t = i.has(e.frameId) ? null : a;
				i.set(e.frameId, t);
			}
		}), {
			nodes: t,
			idToNodeMap: n,
			urlToNodeMap: r,
			frameIdToNodeMap: i
		};
	}
	static isScheduleableTask(e) {
		return e.name === by || e.name === xy || e.name === Sy || e.name === Cy;
	}
	static assertHasToplevelEvents(e) {
		if (!e.some(this.isScheduleableTask)) throw new q("Could not find any top level events");
	}
	static getCPUNodes(t) {
		let n = [], r = 0;
		for (e.assertHasToplevelEvents(t); r < t.length;) {
			let i = t[r];
			if (r++, !e.isScheduleableTask(i) || !i.dur) continue;
			let a, o = [];
			for (let n = i.ts + i.dur; r < t.length && t[r].ts < n; r++) {
				let n = t[r];
				if (e.isScheduleableTask(n) && n.dur) {
					a = n.ts - 1;
					break;
				}
				o.push(n);
			}
			n.push(new gy(i, o, a));
		}
		return n;
	}
	static linkNetworkNodes(t, n) {
		n.nodes.forEach((r) => {
			let i = r.request.initiatorRequest || t.request, a = n.idToNodeMap.get(i.requestId) || t, o = !a.isDependentOn(r) && r.canDependOn(a), s = e.getNetworkInitiators(r.request);
			if (s.length ? s.forEach((e) => {
				let t = n.urlToNodeMap.get(e) || [];
				t.length === 1 && t[0].startTime <= r.startTime && !t[0].isDependentOn(r) ? r.addDependency(t[0]) : o && a.addDependent(r);
			}) : o && a.addDependent(r), r !== t && r.getDependencies().length === 0 && r.canDependOn(t) && r.addDependency(t), !r.request.redirects) return;
			let c = [...r.request.redirects, r.request];
			for (let e = 1; e < c.length; e++) {
				let t = n.idToNodeMap.get(c[e - 1].requestId), r = n.idToNodeMap.get(c[e].requestId);
				r && t && r.addDependency(t);
			}
		});
	}
	static linkCPUNodes(t, n, r) {
		let i = /* @__PURE__ */ new Set([
			"XHR",
			"Fetch",
			"Script"
		]);
		function a(e, t) {
			let r = n.idToNodeMap.get(t);
			if (!r || r.startTime <= e.startTime) return;
			let { request: a } = r, o = a.resourceType || a.redirectDestination?.resourceType;
			i.has(o) && e.addDependent(r);
		}
		function o(e, t) {
			if (!t) return;
			let r = n.frameIdToNodeMap.get(t);
			r && (r.startTime >= e.startTime || e.addDependency(r));
		}
		function s(e, t) {
			if (!t) return;
			let r = n.urlToNodeMap.get(t) || [], i = null, a = Infinity;
			for (let t of r) {
				if (e.startTime <= t.startTime) return;
				let n = e.startTime - t.endTime;
				n >= -1e5 && n < a && (i = t, a = n);
			}
			i && e.addDependency(i);
		}
		let c = /* @__PURE__ */ new Map();
		for (let e of r) {
			for (let t of e.childEvents) {
				if (!t.args.data) continue;
				let n = t.args.data.url, r = (t.args.data.stackTrace || []).map((e) => e.url).filter(Boolean);
				switch (t.name) {
					case "TimerInstall":
						c.set(t.args.data.timerId, e), r.forEach((t) => s(e, t));
						break;
					case "TimerFire": {
						let n = c.get(t.args.data.timerId);
						if (!n || n.endTime > e.startTime) break;
						n.addDependent(e);
						break;
					}
					case "InvalidateLayout":
					case "ScheduleStyleRecalculation":
						o(e, t.args.data.frame), r.forEach((t) => s(e, t));
						break;
					case "EvaluateScript":
						o(e, t.args.data.frame), s(e, n), r.forEach((t) => s(e, t));
						break;
					case "XHRReadyStateChange":
						if (t.args.data.readyState !== 4) break;
						s(e, n), r.forEach((t) => s(e, t));
						break;
					case "FunctionCall":
					case "v8.compile":
						o(e, t.args.data.frame), s(e, n);
						break;
					case "ParseAuthorStyleSheet":
						o(e, t.args.data.frame), s(e, t.args.data.styleSheetUrl);
						break;
					case "ResourceSendRequest": o(e, t.args.data.frame), a(e, t.args.data.requestId), r.forEach((t) => s(e, t));
				}
			}
			e.getNumberOfDependencies() === 0 && e.canDependOn(t) && e.addDependency(t);
		}
		let l = wy * 1e3, u = !1, d = !1, f = !1;
		for (let t of r) {
			let n = !1;
			!u && t.childEvents.some((e) => e.name === "Layout") && (n = u = !0), !d && t.childEvents.some((e) => e.name === "Paint") && (n = d = !0), !f && t.childEvents.some((e) => e.name === "ParseHTML") && (n = f = !0), !(n || t.duration >= l) && (t.getNumberOfDependencies() === 1 || t.getNumberOfDependents() <= 1) && e.pruneNode(t);
		}
	}
	static pruneNode(e) {
		let t = e.getDependencies(), n = e.getDependents();
		for (let r of t) {
			e.removeDependency(r);
			for (let e of n) r.addDependent(e);
		}
		for (let t of n) e.removeDependent(t);
	}
	static debugNormalizeRequests(e) {
		for (let t of e) t.rendererStartTime = Math.round(t.rendererStartTime * 1e3) / 1e3, t.networkRequestTime = Math.round(t.networkRequestTime * 1e3) / 1e3, t.responseHeadersEndTime = Math.round(t.responseHeadersEndTime * 1e3) / 1e3, t.networkEndTime = Math.round(t.networkEndTime * 1e3) / 1e3;
		for (let t of e) delete t.rawRequest, t.initiatorRequest &&= { id: t.initiatorRequest.requestId }, t.redirectDestination &&= { id: t.redirectDestination.requestId }, t.redirectSource &&= { id: t.redirectSource.requestId }, t.redirects &&= t.redirects.map((e) => e.requestId);
		let t = e.map((e) => ({
			requestId: e.requestId,
			connectionId: e.connectionId,
			connectionReused: e.connectionReused,
			url: e.url,
			protocol: e.protocol,
			parsedURL: e.parsedURL,
			documentURL: e.documentURL,
			rendererStartTime: e.rendererStartTime,
			networkRequestTime: e.networkRequestTime,
			responseHeadersEndTime: e.responseHeadersEndTime,
			networkEndTime: e.networkEndTime,
			transferSize: e.transferSize,
			resourceSize: e.resourceSize,
			fromDiskCache: e.fromDiskCache,
			fromMemoryCache: e.fromMemoryCache,
			finished: e.finished,
			statusCode: e.statusCode,
			redirectSource: e.redirectSource,
			redirectDestination: e.redirectDestination,
			redirects: e.redirects,
			failed: e.failed,
			initiator: e.initiator,
			timing: e.timing ? {
				requestTime: e.timing.requestTime,
				proxyStart: e.timing.proxyStart,
				proxyEnd: e.timing.proxyEnd,
				dnsStart: e.timing.dnsStart,
				dnsEnd: e.timing.dnsEnd,
				connectStart: e.timing.connectStart,
				connectEnd: e.timing.connectEnd,
				sslStart: e.timing.sslStart,
				sslEnd: e.timing.sslEnd,
				workerStart: e.timing.workerStart,
				workerReady: e.timing.workerReady,
				workerFetchStart: e.timing.workerFetchStart,
				workerRespondWithSettled: e.timing.workerRespondWithSettled,
				sendStart: e.timing.sendStart,
				sendEnd: e.timing.sendEnd,
				pushStart: e.timing.pushStart,
				pushEnd: e.timing.pushEnd,
				receiveHeadersStart: e.timing.receiveHeadersStart,
				receiveHeadersEnd: e.timing.receiveHeadersEnd
			} : e.timing,
			resourceType: e.resourceType,
			mimeType: e.mimeType,
			priority: e.priority,
			initiatorRequest: e.initiatorRequest,
			frameId: e.frameId,
			fromWorker: e.fromWorker,
			isLinkPreload: e.isLinkPreload,
			serverResponseTime: e.serverResponseTime
		})).filter((e) => !e.fromWorker);
		console.log(t);
	}
	static createGraph(t, n, r) {
		let i = e.getNetworkNodeOutput(n), a = e.getCPUNodes(t), { requestedUrl: o, mainDocumentUrl: s } = r;
		if (!o) throw new q("requestedUrl is required to get the root request");
		if (!s) throw new q("mainDocumentUrl is required to get the main resource");
		let c = hy.findResourceForUrl(n, o);
		if (!c) throw new q("rootRequest not found");
		let l = i.idToNodeMap.get(c.requestId);
		if (!l) throw new q("rootNode not found");
		let u = hy.findLastDocumentForUrl(n, s);
		if (!u) throw new q("mainDocumentRequest not found");
		let d = i.idToNodeMap.get(u.requestId);
		if (!d) throw new q("mainDocumentNode not found");
		if (e.linkNetworkNodes(l, i), e.linkCPUNodes(l, i, a), d.setIsMainDocument(!0), yy.findCycle(l)) throw new q("Invalid dependency graph created, cycle detected");
		return l;
	}
	static printGraph(e, t = 80) {
		function n(e, t, n = " ") {
			return e + n.repeat(Math.max(t - e.length, 0));
		}
		let r = [];
		e.traverse((e) => r.push(e)), r.sort((e, t) => e.startTime - t.startTime);
		let i = /* @__PURE__ */ new Map();
		e.traverse((e) => {
			let t = 65 + i.size, n;
			n = t > 90 ? `Z${t - 90}` : String.fromCharCode(t), i.set(e, n);
		});
		let a = r[0].startTime, o = (r.reduce((e, t) => Math.max(e, t.endTime), 0) - a) / t;
		r.forEach((e) => {
			let r = Math.round((e.startTime - a) / o), i = Math.ceil((e.endTime - e.startTime) / o), s = n("", r) + n("", i, "="), c = e.request ? e.request.url : e.type;
			console.log(n(s, t), `| ${c.slice(0, 50)}`);
		}), console.log(), r.forEach((e) => {
			let n = e.request ? e.request.url : e.type;
			console.log(i.get(e), n.slice(0, t - 5));
			for (let n of e.dependents) {
				let e = n.request ? n.request.url : n.type;
				console.log("  ->", i.get(n), e.slice(0, t - 10));
			}
			console.log();
		});
		let s = yy.findCycle(e);
		if (console.log("Cycle?", s ? "yes" : "no"), s) {
			let e = [...s];
			e.push(e[0]), console.log(e.map((e) => i.get(e)).join(" -> "));
		}
	}
}, Dy = class {
	static getScriptUrls(e, t) {
		let n = /* @__PURE__ */ new Set();
		return e.traverse((e) => {
			e.type === J.types.NETWORK && e.request.resourceType === "Script" && t?.(e) && n.add(e.request.url);
		}), n;
	}
	static get coefficients() {
		throw new q("coefficients unimplemented!");
	}
	static getScaledCoefficients(e) {
		return this.coefficients;
	}
	static getOptimisticGraph(e, t) {
		throw new q("Optimistic graph unimplemented!");
	}
	static getPessimisticGraph(e, t) {
		throw new q("Pessmistic graph unimplemented!");
	}
	static getEstimateFromSimulation(e, t) {
		return e;
	}
	static compute(e, t) {
		let { simulator: n, graph: r, processedNavigation: i } = e, a = this.name.replace("Lantern", ""), o = this.getOptimisticGraph(r, i), s = this.getPessimisticGraph(r, i), c = { label: `optimistic${a}` }, l = n.simulate(o, c);
		c = { label: `pessimistic${a}` };
		let u = n.simulate(s, c), d = this.getEstimateFromSimulation(l, {
			...t,
			optimistic: !0
		}), f = this.getEstimateFromSimulation(u, {
			...t,
			optimistic: !1
		}), p = this.getScaledCoefficients(n.rtt), m = p.intercept > 0 ? Math.min(1, d.timeInMs / 1e3) : 1;
		return {
			timing: p.intercept * m + p.optimistic * d.timeInMs + p.pessimistic * f.timeInMs,
			optimisticEstimate: d,
			pessimisticEstimate: f,
			optimisticGraph: o,
			pessimisticGraph: s
		};
	}
}, Oy = class extends Dy {
	static get coefficients() {
		return {
			intercept: 0,
			optimistic: .5,
			pessimistic: .5
		};
	}
	static getRenderBlockingNodeData(e, { cutoffTimestamp: t, treatNodeAsRenderBlocking: n, additionalCpuNodesToTreatAsRenderBlocking: r }) {
		let i = /* @__PURE__ */ new Map(), a = [];
		e.traverse((e) => {
			if (e.type === J.types.CPU) {
				e.startTime <= t && a.push(e);
				let n = e.getEvaluateScriptURLs();
				for (let t of n) {
					let n = i.get(t) || e;
					i.set(t, e.startTime < n.startTime ? e : n);
				}
			}
		}), a.sort((e, t) => e.startTime - t.startTime);
		let o = Dy.getScriptUrls(e, (e) => e.endTime <= t && n(e)), s = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Set();
		for (let e of o) {
			let t = i.get(e);
			if (t) {
				if (a.includes(t)) {
					c.add(t.id);
					continue;
				}
				s.add(e);
			}
		}
		let l = a.find((e) => e.didPerformLayout());
		l && c.add(l.id);
		let u = a.find((e) => e.childEvents.some((e) => e.name === "Paint"));
		u && c.add(u.id);
		let d = a.find((e) => e.childEvents.some((e) => e.name === "ParseHTML"));
		return d && c.add(d.id), r && a.filter(r).forEach((e) => c.add(e.id)), {
			definitelyNotRenderBlockingScriptUrls: s,
			renderBlockingCpuNodeIds: c
		};
	}
	static getFirstPaintBasedGraph(e, { cutoffTimestamp: t, treatNodeAsRenderBlocking: n, additionalCpuNodesToTreatAsRenderBlocking: r }) {
		let { definitelyNotRenderBlockingScriptUrls: i, renderBlockingCpuNodeIds: a } = this.getRenderBlockingNodeData(e, {
			cutoffTimestamp: t,
			treatNodeAsRenderBlocking: n,
			additionalCpuNodesToTreatAsRenderBlocking: r
		});
		return e.cloneWithRelationships((e) => {
			if (e.type === J.types.NETWORK) {
				if ((e.endTime > t || e.startTime > t) && !e.isMainDocument()) return !1;
				let r = e.request.url;
				return !i.has(r) && n(e);
			}
			return a.has(e.id);
		});
	}
	static getOptimisticGraph(e, t) {
		return this.getFirstPaintBasedGraph(e, {
			cutoffTimestamp: t.timestamps.firstContentfulPaint,
			treatNodeAsRenderBlocking: (e) => e.hasRenderBlockingPriority() && e.initiatorType !== "script"
		});
	}
	static getPessimisticGraph(e, t) {
		return this.getFirstPaintBasedGraph(e, {
			cutoffTimestamp: t.timestamps.firstContentfulPaint,
			treatNodeAsRenderBlocking: (e) => e.hasRenderBlockingPriority()
		});
	}
}, ky = 20, Ay = class e extends Dy {
	static get coefficients() {
		return {
			intercept: 0,
			optimistic: .45,
			pessimistic: .55
		};
	}
	static getOptimisticGraph(e) {
		let t = ky * 1e3;
		return e.cloneWithRelationships((e) => {
			if (e.type === J.types.CPU) return e.duration > t;
			let n = e.request.resourceType === "Image", r = e.request.resourceType === "Script";
			return !n && (r || e.request.priority === "High" || e.request.priority === "VeryHigh");
		});
	}
	static getPessimisticGraph(e) {
		return e;
	}
	static getEstimateFromSimulation(t, n) {
		if (!n.lcpResult) throw new q("missing lcpResult");
		let r = e.getLastLongTaskEndTime(t.nodeTimings), i = n.optimistic ? n.lcpResult.optimisticEstimate.timeInMs : n.lcpResult.pessimisticEstimate.timeInMs;
		return {
			timeInMs: Math.max(i, r),
			nodeTimings: t.nodeTimings
		};
	}
	static compute(e, t) {
		let n = t?.lcpResult;
		if (!n) throw new q("LCP is required to calculate the Interactive metric");
		let r = super.compute(e, t);
		return r.timing = Math.max(r.timing, n.timing), r;
	}
	static getLastLongTaskEndTime(e, t = 50) {
		return Array.from(e.entries()).filter(([e, n]) => e.type === J.types.CPU && n.duration > t).map(([e, t]) => t.endTime).reduce((e, t) => Math.max(e || 0, t || 0), 0);
	}
}, jy = class e extends Dy {
	static get coefficients() {
		return {
			intercept: 0,
			optimistic: .5,
			pessimistic: .5
		};
	}
	static isNotLowPriorityImageNode(e) {
		if (e.type !== "network") return !0;
		let t = e.request.resourceType === "Image", n = e.request.priority === "Low" || e.request.priority === "VeryLow";
		return !t || !n;
	}
	static getOptimisticGraph(t, n) {
		let r = n.timestamps.largestContentfulPaint;
		if (!r) throw new q("NO_LCP");
		return Oy.getFirstPaintBasedGraph(t, {
			cutoffTimestamp: r,
			treatNodeAsRenderBlocking: e.isNotLowPriorityImageNode
		});
	}
	static getPessimisticGraph(e, t) {
		let n = t.timestamps.largestContentfulPaint;
		if (!n) throw new q("NO_LCP");
		return Oy.getFirstPaintBasedGraph(e, {
			cutoffTimestamp: n,
			treatNodeAsRenderBlocking: (e) => !0,
			additionalCpuNodesToTreatAsRenderBlocking: (e) => e.didPerformLayout()
		});
	}
	static getEstimateFromSimulation(t) {
		let n = Array.from(t.nodeTimings.entries()).filter((t) => e.isNotLowPriorityImageNode(t[0])).map((e) => e[1].endTime);
		return {
			timeInMs: Math.max(...n),
			nodeTimings: t.nodeTimings
		};
	}
	static compute(e, t) {
		let n = t?.fcpResult;
		if (!n) throw new q("FCP is required to calculate the LCP metric");
		let r = super.compute(e, t);
		return r.timing = Math.max(r.timing, n.timing), r;
	}
};
function My(e, t, n, r) {
	let i = 50;
	if (r && (i *= e.duration / r.duration), e.duration < i || e.end < t || e.start > n) return 0;
	let a = Math.max(e.start, t), o = Math.min(e.end, n) - a;
	return o < i ? 0 : o - i;
}
function Ny(e, t, n) {
	if (n <= t) return 0;
	let r = 0;
	for (let i of e) r += My(i, t, n);
	return r;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/lantern/metrics/TotalBlockingTime.ts
var Py = class e extends Dy {
	static get coefficients() {
		return {
			intercept: 0,
			optimistic: .5,
			pessimistic: .5
		};
	}
	static getOptimisticGraph(e) {
		return e;
	}
	static getPessimisticGraph(e) {
		return e;
	}
	static getEstimateFromSimulation(t, n) {
		if (!n.fcpResult) throw new q("missing fcpResult");
		if (!n.interactiveResult) throw new q("missing interactiveResult");
		let r = n.optimistic ? n.fcpResult.pessimisticEstimate.timeInMs : n.fcpResult.optimisticEstimate.timeInMs, i = n.optimistic ? n.interactiveResult.optimisticEstimate.timeInMs : n.interactiveResult.pessimisticEstimate.timeInMs;
		return {
			timeInMs: Ny(e.getTopLevelEvents(t.nodeTimings, 50), r, i),
			nodeTimings: t.nodeTimings
		};
	}
	static compute(e, t) {
		if (!t?.fcpResult) throw new q("FCP is required to calculate the TBT metric");
		if (!t?.fcpResult) throw new q("Interactive is required to calculate the TBT metric");
		return super.compute(e, t);
	}
	static getTopLevelEvents(e, t) {
		let n = [];
		for (let [r, i] of e.entries()) r.type === J.types.CPU && (i.duration < t || n.push({
			start: i.startTime,
			end: i.endTime,
			duration: i.duration
		}));
		return n;
	}
}, Fy = 10, Iy = 1460, Ly = class e {
	warmed;
	ssl;
	h2;
	rtt;
	throughput;
	serverLatency;
	_congestionWindow;
	h2OverflowBytesDownloaded;
	constructor(e, t, n = 0, r = !0, i = !1) {
		this.warmed = !1, this.ssl = r, this.h2 = i, this.rtt = e, this.throughput = t, this.serverLatency = n, this._congestionWindow = Fy, this.h2OverflowBytesDownloaded = 0;
	}
	static maximumSaturatedConnections(e, t) {
		let n = 1e3 / e * Iy * 8;
		return Math.floor(t / n);
	}
	computeMaximumCongestionWindowInSegments() {
		let e = this.throughput / 8 * (this.rtt / 1e3);
		return Math.floor(e / Iy);
	}
	setThroughput(e) {
		this.throughput = e;
	}
	setCongestionWindow(e) {
		this._congestionWindow = e;
	}
	setWarmed(e) {
		this.warmed = e;
	}
	isH2() {
		return this.h2;
	}
	get congestionWindow() {
		return this._congestionWindow;
	}
	setH2OverflowBytesDownloaded(e) {
		this.h2 && (this.h2OverflowBytesDownloaded = e);
	}
	clone() {
		return Object.assign(new e(this.rtt, this.throughput), this);
	}
	simulateDownloadUntil(e, t) {
		let { timeAlreadyElapsed: n = 0, maximumTimeToElapse: r = Infinity, dnsResolutionTime: i = 0 } = t || {};
		this.warmed && this.h2 && (e -= this.h2OverflowBytesDownloaded);
		let a = this.rtt, o = a / 2, s = this.computeMaximumCongestionWindowInSegments(), c = o;
		this.warmed || (c = i + o + o + o + (this.ssl ? a : 0));
		let l = Math.ceil(c / a), u = c + this.serverLatency + o;
		this.warmed && this.h2 && (u = 0);
		let d = Math.max(u - n, 0), f = r - d, p = Math.min(this._congestionWindow, s), m = 0;
		d > 0 ? m = p * Iy : l = 0;
		let h = 0, g = e - m;
		for (; g > 0 && h <= f;) {
			l++, h += a, p = Math.max(Math.min(s, p * 2), 1);
			let e = p * Iy;
			m += e, g -= e;
		}
		let _ = d + h, v = this.h2 ? Math.max(m - e, 0) : 0, y = Math.max(Math.min(m, e), 0), b;
		return b = this.warmed ? this.h2 ? { timeToFirstByte: u } : {
			connectionTime: c,
			timeToFirstByte: u
		} : {
			dnsResolutionTime: i,
			connectionTime: c - i,
			sslTime: this.ssl ? a : void 0,
			timeToFirstByte: u
		}, {
			roundTrips: l,
			timeElapsed: _,
			bytesDownloaded: y,
			extraBytesDownloaded: v,
			congestionWindow: p,
			connectionTiming: b
		};
	}
}, Ry = 30, zy = ["https", "wss"], By = 6, Vy = class {
	options;
	records;
	connectionsByOrigin;
	connectionsByRequest;
	_connectionsInUse;
	connectionReusedByRequestId;
	constructor(e, t) {
		this.options = t, this.records = e, this.connectionsByOrigin = /* @__PURE__ */ new Map(), this.connectionsByRequest = /* @__PURE__ */ new Map(), this._connectionsInUse = /* @__PURE__ */ new Set(), this.connectionReusedByRequestId = hy.estimateIfConnectionWasReused(e, { forceCoarseEstimates: !0 }), this.initializeConnections();
	}
	connectionsInUse() {
		return Array.from(this._connectionsInUse);
	}
	initializeConnections() {
		let e = this.connectionReusedByRequestId, t = this.options.additionalRttByOrigin, n = this.options.serverResponseTimeByOrigin, r = hy.groupByOrigin(this.records);
		for (let [i, a] of r.entries()) {
			let r = [], o = t.get(i) || 0, s = n.get(i) || Ry;
			for (let t of a) {
				if (e.get(t.requestId)) continue;
				let n = zy.includes(t.parsedURL.scheme), i = t.protocol === "h2", a = new Ly(this.options.rtt + o, this.options.throughput, s, n, i);
				r.push(a);
			}
			if (!r.length) throw new q(`Could not find a connection for origin: ${i}`);
			let c = r[0].isH2() ? 1 : By;
			for (; r.length < c;) r.push(r[0].clone());
			this.connectionsByOrigin.set(i, r);
		}
	}
	findAvailableConnectionWithLargestCongestionWindow(e) {
		let t = null;
		for (let n = 0; n < e.length; n++) {
			let r = e[n];
			if (this._connectionsInUse.has(r)) continue;
			let i = t?.congestionWindow || -Infinity;
			r.congestionWindow > i && (t = r);
		}
		return t;
	}
	acquire(e) {
		if (this.connectionsByRequest.has(e)) throw new q("Record already has a connection");
		let t = e.parsedURL.securityOrigin, n = this.connectionsByOrigin.get(t) || [], r = this.findAvailableConnectionWithLargestCongestionWindow(n);
		return r ? (this._connectionsInUse.add(r), this.connectionsByRequest.set(e, r), r) : null;
	}
	acquireActiveConnectionFromRequest(e) {
		let t = this.connectionsByRequest.get(e);
		if (!t) throw new q("Could not find an active connection for request");
		return t;
	}
	release(e) {
		let t = this.connectionsByRequest.get(e);
		this.connectionsByRequest.delete(e), t && this._connectionsInUse.delete(t);
	}
}, Hy = 3.75, Uy = .9, Wy = { throttling: {
	DEVTOOLS_RTT_ADJUSTMENT_FACTOR: Hy,
	DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR: Uy,
	mobileSlow4G: {
		rttMs: 150,
		throughputKbps: 1638.4,
		requestLatencyMs: 150 * Hy,
		downloadThroughputKbps: 1638.4 * Uy,
		uploadThroughputKbps: 750 * Uy,
		cpuSlowdownMultiplier: 4
	},
	mobileRegular3G: {
		rttMs: 300,
		throughputKbps: 700,
		requestLatencyMs: 300 * Hy,
		downloadThroughputKbps: 700 * Uy,
		uploadThroughputKbps: 700 * Uy,
		cpuSlowdownMultiplier: 4
	},
	desktopDense4G: {
		rttMs: 40,
		throughputKbps: 10240,
		cpuSlowdownMultiplier: 1,
		requestLatencyMs: 0,
		downloadThroughputKbps: 0,
		uploadThroughputKbps: 0
	}
} }, Gy = 2, Ky = class e {
	static rttMultiplier = Gy;
	rtt;
	resolvedDomainNames;
	constructor({ rtt: e }) {
		this.rtt = e, this.resolvedDomainNames = /* @__PURE__ */ new Map();
	}
	getTimeUntilResolution(t, n) {
		let { requestedAt: r = 0, shouldUpdateCache: i = !1 } = n || {}, a = t.parsedURL.host, o = this.resolvedDomainNames.get(a), s = this.rtt * e.rttMultiplier;
		if (o) {
			let e = Math.max(o.resolvedAt - r, 0);
			s = Math.min(e, s);
		}
		let c = r + s;
		return i && this.updateCacheResolvedAtIfNeeded(t, c), s;
	}
	updateCacheResolvedAtIfNeeded(e, t) {
		let n = e.parsedURL.host, r = this.resolvedDomainNames.get(n) || { resolvedAt: t };
		r.resolvedAt = Math.min(r.resolvedAt, t), this.resolvedDomainNames.set(n, r);
	}
	setResolvedAt(e, t) {
		this.resolvedDomainNames.set(e, { resolvedAt: t });
	}
}, qy = class {
	nodeTimings;
	constructor() {
		this.nodeTimings = /* @__PURE__ */ new Map();
	}
	getNodes() {
		return Array.from(this.nodeTimings.keys());
	}
	setReadyToStart(e, t) {
		this.nodeTimings.set(e, t);
	}
	setInProgress(e, t) {
		let n = {
			...this.getQueued(e),
			startTime: t.startTime,
			timeElapsed: 0
		};
		this.nodeTimings.set(e, e.type === J.types.NETWORK ? {
			...n,
			timeElapsedOvershoot: 0,
			bytesDownloaded: 0
		} : n);
	}
	setCompleted(e, t) {
		let n = {
			...this.getInProgress(e),
			endTime: t.endTime,
			connectionTiming: t.connectionTiming
		};
		this.nodeTimings.set(e, n);
	}
	setCpu(e, t) {
		let n = {
			...this.getCpuStarted(e),
			timeElapsed: t.timeElapsed
		};
		this.nodeTimings.set(e, n);
	}
	setCpuEstimated(e, t) {
		let n = {
			...this.getCpuStarted(e),
			estimatedTimeElapsed: t.estimatedTimeElapsed
		};
		this.nodeTimings.set(e, n);
	}
	setNetwork(e, t) {
		let n = {
			...this.getNetworkStarted(e),
			timeElapsed: t.timeElapsed,
			timeElapsedOvershoot: t.timeElapsedOvershoot,
			bytesDownloaded: t.bytesDownloaded
		};
		this.nodeTimings.set(e, n);
	}
	setNetworkEstimated(e, t) {
		let n = {
			...this.getNetworkStarted(e),
			estimatedTimeElapsed: t.estimatedTimeElapsed
		};
		this.nodeTimings.set(e, n);
	}
	getQueued(e) {
		let t = this.nodeTimings.get(e);
		if (!t) throw new q(`Node ${e.id} not yet queued`);
		return t;
	}
	getCpuStarted(e) {
		let t = this.nodeTimings.get(e);
		if (!t) throw new q(`Node ${e.id} not yet queued`);
		if (!("startTime" in t)) throw new q(`Node ${e.id} not yet started`);
		if ("bytesDownloaded" in t) throw new q(`Node ${e.id} timing not valid`);
		return t;
	}
	getNetworkStarted(e) {
		let t = this.nodeTimings.get(e);
		if (!t) throw new q(`Node ${e.id} not yet queued`);
		if (!("startTime" in t)) throw new q(`Node ${e.id} not yet started`);
		if (!("bytesDownloaded" in t)) throw new q(`Node ${e.id} timing not valid`);
		return t;
	}
	getInProgress(e) {
		let t = this.nodeTimings.get(e);
		if (!t) throw new q(`Node ${e.id} not yet queued`);
		if (!("startTime" in t)) throw new q(`Node ${e.id} not yet started`);
		if (!("estimatedTimeElapsed" in t)) throw new q(`Node ${e.id} not yet in progress`);
		return t;
	}
	getCompleted(e) {
		let t = this.nodeTimings.get(e);
		if (!t) throw new q(`Node ${e.id} not yet queued`);
		if (!("startTime" in t)) throw new q(`Node ${e.id} not yet started`);
		if (!("estimatedTimeElapsed" in t)) throw new q(`Node ${e.id} not yet in progress`);
		if (!("endTime" in t)) throw new q(`Node ${e.id} not yet completed`);
		return t;
	}
}, Jy = Wy.throttling.mobileSlow4G, Yy = 10, Xy = .5, Zy = 1e4, Y = {
	NotReadyToStart: 0,
	ReadyToStart: 1,
	InProgress: 2,
	Complete: 3
}, Qy = {
	VeryHigh: 0,
	High: .25,
	Medium: .5,
	Low: 1,
	VeryLow: 2
}, $y = /* @__PURE__ */ new Map(), eb = class e {
	static createSimulator(t) {
		let { throttlingMethod: n, throttling: r, precomputedLanternData: i, networkAnalysis: a } = t, o = {
			additionalRttByOrigin: a.additionalRttByOrigin,
			serverResponseTimeByOrigin: a.serverResponseTimeByOrigin,
			observedThroughput: a.throughput
		};
		switch (i && (o.additionalRttByOrigin = new Map(Object.entries(i.additionalRttByOrigin)), o.serverResponseTimeByOrigin = new Map(Object.entries(i.serverResponseTimeByOrigin))), n) {
			case "provided":
				o.rtt = a.rtt, o.throughput = a.throughput, o.cpuSlowdownMultiplier = 1, o.layoutTaskMultiplier = 1;
				break;
			case "devtools":
				r && (o.rtt = r.requestLatencyMs / Wy.throttling.DEVTOOLS_RTT_ADJUSTMENT_FACTOR, o.throughput = r.downloadThroughputKbps * 1024 / Wy.throttling.DEVTOOLS_THROUGHPUT_ADJUSTMENT_FACTOR), o.cpuSlowdownMultiplier = 1, o.layoutTaskMultiplier = 1;
				break;
			case "simulate": r && (o.rtt = r.rttMs, o.throughput = r.throughputKbps * 1024, o.cpuSlowdownMultiplier = r.cpuSlowdownMultiplier);
		}
		return new e(o);
	}
	options;
	_rtt;
	throughput;
	maximumConcurrentRequests;
	cpuSlowdownMultiplier;
	layoutTaskMultiplier;
	cachedNodeListByStartPosition;
	nodeTimings;
	numberInProgressByType;
	nodes;
	dns;
	connectionPool;
	constructor(e) {
		if (this.options = Object.assign({
			rtt: Jy.rttMs,
			throughput: Jy.throughputKbps * 1024,
			maximumConcurrentRequests: Yy,
			cpuSlowdownMultiplier: Jy.cpuSlowdownMultiplier,
			layoutTaskMultiplier: Xy,
			additionalRttByOrigin: /* @__PURE__ */ new Map(),
			serverResponseTimeByOrigin: /* @__PURE__ */ new Map()
		}, e), this._rtt = this.options.rtt, this.throughput = this.options.throughput, this.maximumConcurrentRequests = Math.max(Math.min(Ly.maximumSaturatedConnections(this._rtt, this.throughput), this.options.maximumConcurrentRequests), 1), this.cpuSlowdownMultiplier = this.options.cpuSlowdownMultiplier, this.layoutTaskMultiplier = this.cpuSlowdownMultiplier * this.options.layoutTaskMultiplier, this.cachedNodeListByStartPosition = [], this.nodeTimings = new qy(), this.numberInProgressByType = /* @__PURE__ */ new Map(), this.nodes = {}, this.dns = new Ky({ rtt: this._rtt }), this.connectionPool = null, !Number.isFinite(this._rtt)) throw new q(`Invalid rtt ${this._rtt}`);
		if (!Number.isFinite(this.throughput)) throw new q(`Invalid throughput ${this.throughput}`);
	}
	get rtt() {
		return this._rtt;
	}
	initializeConnectionPool(e) {
		let t = [];
		e.getRootNode().traverse((e) => {
			e.type === J.types.NETWORK && t.push(e.request);
		}), this.connectionPool = new Vy(t, this.options);
	}
	initializeAuxiliaryData() {
		this.nodeTimings = new qy(), this.numberInProgressByType = /* @__PURE__ */ new Map(), this.nodes = {}, this.cachedNodeListByStartPosition = [];
		for (let e of Object.values(Y)) this.nodes[e] = /* @__PURE__ */ new Set();
	}
	numberInProgress(e) {
		return this.numberInProgressByType.get(e) || 0;
	}
	markNodeAsReadyToStart(t, n) {
		let r = e.computeNodeStartPosition(t), i = this.cachedNodeListByStartPosition.findIndex((t) => e.computeNodeStartPosition(t) > r), a = i === -1 ? this.cachedNodeListByStartPosition.length : i;
		this.cachedNodeListByStartPosition.splice(a, 0, t), this.nodes[Y.ReadyToStart].add(t), this.nodes[Y.NotReadyToStart].delete(t), this.nodeTimings.setReadyToStart(t, { queuedTime: n });
	}
	markNodeAsInProgress(e, t) {
		let n = this.cachedNodeListByStartPosition.indexOf(e);
		this.cachedNodeListByStartPosition.splice(n, 1), this.nodes[Y.InProgress].add(e), this.nodes[Y.ReadyToStart].delete(e), this.numberInProgressByType.set(e.type, this.numberInProgress(e.type) + 1), this.nodeTimings.setInProgress(e, { startTime: t });
	}
	markNodeAsComplete(e, t, n) {
		this.nodes[Y.Complete].add(e), this.nodes[Y.InProgress].delete(e), this.numberInProgressByType.set(e.type, this.numberInProgress(e.type) - 1), this.nodeTimings.setCompleted(e, {
			endTime: t,
			connectionTiming: n
		});
		for (let n of e.getDependents()) n.getDependencies().some((e) => !this.nodes[Y.Complete].has(e)) || this.markNodeAsReadyToStart(n, t);
	}
	acquireConnection(e) {
		return this.connectionPool.acquire(e);
	}
	getNodesSortedByStartPosition() {
		return Array.from(this.cachedNodeListByStartPosition);
	}
	startNodeIfPossible(e, t) {
		if (e.type === J.types.CPU) {
			this.numberInProgress(e.type) === 0 && this.markNodeAsInProgress(e, t);
			return;
		}
		if (e.type !== J.types.NETWORK) throw new q("Unsupported");
		!e.isConnectionless && (this.numberInProgress(e.type) >= this.maximumConcurrentRequests || !this.acquireConnection(e.request)) || this.markNodeAsInProgress(e, t);
	}
	updateNetworkCapacity() {
		let e = this.numberInProgress(J.types.NETWORK);
		if (e !== 0) for (let t of this.connectionPool.connectionsInUse()) t.setThroughput(this.throughput / e);
	}
	estimateTimeRemaining(e) {
		if (e.type === J.types.CPU) return this.estimateCPUTimeRemaining(e);
		if (e.type === J.types.NETWORK) return this.estimateNetworkTimeRemaining(e);
		throw new q("Unsupported");
	}
	estimateCPUTimeRemaining(e) {
		let t = this.nodeTimings.getCpuStarted(e), n = e.didPerformLayout() ? this.layoutTaskMultiplier : this.cpuSlowdownMultiplier, r = Math.min(Math.round(e.duration / 1e3 * n), Zy) - t.timeElapsed;
		return this.nodeTimings.setCpuEstimated(e, { estimatedTimeElapsed: r }), r;
	}
	estimateNetworkTimeRemaining(e) {
		let t = e.request, n = this.nodeTimings.getNetworkStarted(e), r = 0;
		if (e.fromDiskCache) r = 8 + 20 * ((t.resourceSize || 0) / 1024 / 1024) - n.timeElapsed;
		else if (e.isNonNetworkProtocol) r = 2 + 10 * ((t.resourceSize || 0) / 1024 / 1024) - n.timeElapsed;
		else {
			let e = this.connectionPool.acquireActiveConnectionFromRequest(t), i = this.dns.getTimeUntilResolution(t, {
				requestedAt: n.startTime,
				shouldUpdateCache: !0
			}), a = n.timeElapsed;
			r = e.simulateDownloadUntil(t.transferSize - n.bytesDownloaded, {
				timeAlreadyElapsed: a,
				dnsResolutionTime: i,
				maximumTimeToElapse: Infinity
			}).timeElapsed;
		}
		let i = r + n.timeElapsedOvershoot;
		return this.nodeTimings.setNetworkEstimated(e, { estimatedTimeElapsed: i }), i;
	}
	findNextNodeCompletionTime() {
		let e = Infinity;
		for (let t of this.nodes[Y.InProgress]) e = Math.min(e, this.estimateTimeRemaining(t));
		return e;
	}
	updateProgressMadeInTimePeriod(e, t, n) {
		let r = this.nodeTimings.getInProgress(e), i = r.estimatedTimeElapsed === t;
		if (e.type === J.types.CPU || e.isConnectionless) {
			i ? this.markNodeAsComplete(e, n) : r.timeElapsed += t;
			return;
		}
		if (e.type !== J.types.NETWORK) throw new q("Unsupported");
		if (!("bytesDownloaded" in r)) throw new q("Invalid timing data");
		let a = e.request, o = this.connectionPool.acquireActiveConnectionFromRequest(a), s = this.dns.getTimeUntilResolution(a, {
			requestedAt: r.startTime,
			shouldUpdateCache: !0
		}), c = o.simulateDownloadUntil(a.transferSize - r.bytesDownloaded, {
			dnsResolutionTime: s,
			timeAlreadyElapsed: r.timeElapsed,
			maximumTimeToElapse: t - r.timeElapsedOvershoot
		});
		o.setCongestionWindow(c.congestionWindow), o.setH2OverflowBytesDownloaded(c.extraBytesDownloaded), i ? (o.setWarmed(!0), this.connectionPool.release(a), this.markNodeAsComplete(e, n, c.connectionTiming)) : (r.timeElapsed += c.timeElapsed, r.timeElapsedOvershoot += c.timeElapsed - t, r.bytesDownloaded += c.bytesDownloaded);
	}
	computeFinalNodeTimings() {
		let e = this.nodeTimings.getNodes().map((e) => [e, this.nodeTimings.getCompleted(e)]);
		e.sort((e, t) => e[1].startTime - t[1].startTime);
		let t = e.map(([e, t]) => [e, {
			startTime: t.startTime,
			endTime: t.endTime,
			duration: t.endTime - t.startTime
		}]);
		return {
			nodeTimings: new Map(t),
			completeNodeTimings: new Map(e)
		};
	}
	getOptions() {
		return this.options;
	}
	simulate(e, t) {
		if (J.findCycle(e)) throw new q("Cannot simulate graph with cycle");
		t = Object.assign({ label: void 0 }, t), this.dns = new Ky({ rtt: this._rtt }), this.initializeConnectionPool(e), this.initializeAuxiliaryData();
		let n = this.nodes[Y.NotReadyToStart], r = this.nodes[Y.ReadyToStart], i = this.nodes[Y.InProgress], a = e.getRootNode();
		a.traverse((e) => n.add(e));
		let o = 0, s = 0;
		for (this.markNodeAsReadyToStart(a, o); r.size || i.size;) {
			for (let e of this.getNodesSortedByStartPosition()) this.startNodeIfPossible(e, o);
			if (!i.size) throw new q("Failed to start a node");
			this.updateNetworkCapacity();
			let e = this.findNextNodeCompletionTime();
			if (o += e, !Number.isFinite(e) || s > 1e5) throw new q("Simulation failed, depth exceeded");
			s++;
			for (let t of i) this.updateProgressMadeInTimePeriod(t, e, o);
		}
		let { nodeTimings: c, completeNodeTimings: l } = this.computeFinalNodeTimings();
		return $y.set(t.label || "unlabeled", l), {
			timeInMs: o,
			nodeTimings: c
		};
	}
	computeWastedMsFromWastedBytes(e) {
		let { throughput: t, observedThroughput: n } = this.options, r = t === 0 ? n : t;
		if (r === 0) return 0;
		let i = e * 8 / r * 1e3;
		return Math.round(i / 10) * 10;
	}
	static get allNodeTimings() {
		return $y;
	}
	static computeNodeStartPosition(e) {
		return e.type === "cpu" ? e.startTime : e.startTime + (Qy[e.request.priority] * 1e3 * 1e3 || 0);
	}
}, tb = {
	XHR: "XHR",
	Fetch: "Fetch",
	EventSource: "EventSource",
	Script: "Script",
	Stylesheet: "Stylesheet",
	Image: "Image",
	Media: "Media",
	Font: "Font",
	Document: "Document",
	TextTrack: "TextTrack",
	WebSocket: "WebSocket",
	Other: "Other",
	Manifest: "Manifest",
	SignedExchange: "SignedExchange",
	Ping: "Ping",
	Preflight: "Preflight",
	CSPViolationReport: "CSPViolationReport",
	Prefetch: "Prefetch",
	FedCM: "FedCM"
};
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/LanternComputationData.ts
function nb(e, t, n) {
	let r = e.PageLoadMetrics.metricScoresByFrameId.get(t);
	if (!r) throw new q("missing metric scores for frame");
	let i = r.get(n);
	if (!i) throw new q("missing metric scores for specified navigation");
	return { timestamps: {
		firstContentfulPaint: ((e) => {
			let t = i.get(e);
			if (!t?.event) throw new q(`missing metric: ${e}`);
			return t.event.ts;
		})(V.FCP),
		largestContentfulPaint: ((e) => {
			let t = i.get(e);
			if (t?.event) return t.event.ts;
		})(V.LCP)
	} };
}
function rb(e) {
	return typeof e == "string" && (e = new URL(e)), {
		scheme: e.protocol.split(":")[0],
		host: e.hostname,
		securityOrigin: e.origin
	};
}
function ib(e) {
	let t = /* @__PURE__ */ new Map(), n = ["ServiceWorker thread", "DedicatedWorker thread"];
	for (let r of e.traceEvents) {
		if (r.name !== "thread_name" || !r.args.name || !n.includes(r.args.name)) continue;
		let e = t.get(r.pid);
		e ? e.push(r.tid) : t.set(r.pid, [r.tid]);
	}
	return t;
}
function ab(e, t, n) {
	if (n.args.data.hasResponse && n.args.data.connectionId === void 0) throw new q("Trace is too old");
	let r;
	try {
		r = new URL(n.args.data.url);
	} catch {
		return;
	}
	let i = n.args.data.timing ? {
		workerFetchStart: -1,
		workerRespondWithSettled: -1,
		receiveHeadersStart: -1,
		...n.args.data.timing
	} : void 0, a = i ? i.requestTime * 1e3 : n.args.data.syntheticData.downloadStart / 1e3, o = !1;
	t.get(n.pid)?.includes(n.tid) && (o = !0), e.Workers.workerIdByThread.has(n.tid) && (o = !0);
	let s = n.args.data.initiator ?? { type: x.InitiatorType.Other };
	n.args.data.stackTrace && (s.stack = { callFrames: n.args.data.stackTrace.map((e) => ({
		scriptId: String(e.scriptId),
		url: e.url,
		lineNumber: e.lineNumber - 1,
		columnNumber: e.columnNumber - 1,
		functionName: e.functionName
	})) });
	let c = n.args.data.resourceType;
	n.args.data.initiator?.fetchType === "xmlhttprequest" ? c = "XHR" : n.args.data.initiator?.fetchType === "fetch" && (c = "Fetch");
	let l = n.args.data.decodedBodyLength ?? 0;
	if (r.protocol === "data:" && l === 0) {
		let e = r.pathname.indexOf(",");
		l = r.pathname.substring(0, e).includes(";base64") ? atob(r.pathname.substring(e + 1)).length : r.pathname.length - e - 1;
	}
	return {
		rawRequest: n,
		requestId: n.args.data.requestId,
		connectionId: n.args.data.connectionId ?? 0,
		connectionReused: n.args.data.connectionReused ?? !1,
		url: n.args.data.url,
		protocol: n.args.data.protocol,
		parsedURL: rb(r),
		documentURL: n.args.data.requestingFrameUrl,
		rendererStartTime: n.ts / 1e3,
		networkRequestTime: a,
		responseHeadersEndTime: n.args.data.syntheticData.downloadStart / 1e3,
		networkEndTime: n.args.data.syntheticData.finishTime / 1e3,
		transferSize: n.args.data.encodedDataLength,
		resourceSize: l,
		fromDiskCache: n.args.data.syntheticData.isDiskCached,
		fromMemoryCache: n.args.data.syntheticData.isMemoryCached,
		isLinkPreload: n.args.data.isLinkPreload,
		finished: n.args.data.finished,
		failed: n.args.data.failed,
		statusCode: n.args.data.statusCode,
		initiator: s,
		timing: i,
		resourceType: c,
		mimeType: n.args.data.mimeType,
		priority: n.args.data.priority,
		frameId: n.args.data.frame,
		fromWorker: o,
		serverResponseTime: n.args.data.lrServerResponseTime
	};
}
function ob(e, t) {
	if (e.redirectSource) return e.redirectSource;
	let n = Ey.getNetworkInitiators(e)[0], r = t.get(n) || [];
	if (r = r.filter((t) => t.responseHeadersEndTime <= e.rendererStartTime && t.finished && !t.failed), r.length > 1) {
		let e = r.filter((e) => e.resourceType !== tb.Other);
		e.length && (r = e);
	}
	if (r.length > 1) {
		let t = r.filter((t) => t.frameId === e.frameId);
		t.length && (r = t);
	}
	if (r.length > 1 && e.initiator.type === "parser") {
		let e = r.filter((e) => e.resourceType === tb.Document);
		e.length && (r = e);
	}
	if (r.length > 1) {
		let e = r.filter((e) => e.isLinkPreload);
		if (e.length) {
			let t = r.filter((e) => !e.isLinkPreload), n = t.every((e) => e.fromDiskCache || e.fromMemoryCache);
			t.length && n && (r = e);
		}
	}
	return r.length === 1 ? r[0] : null;
}
function sb(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = t.get(n.url) || [];
		e.push(n), t.set(n.url, e);
	}
	for (let n of e) {
		let e = ob(n, t);
		e && (n.initiatorRequest = e);
	}
}
function cb(e, t, n = 0, r = Infinity) {
	let i = ib(e), a = [];
	for (let e of t.NetworkRequests.byTime) if (e.ts >= n && e.ts < r) {
		let n = ab(t, i, e);
		n && a.push(n);
	}
	let o = [];
	for (let e of [...a]) {
		if (!e.rawRequest) continue;
		let t = e.rawRequest.args.data.redirects;
		if (!t.length) {
			o.push(e);
			continue;
		}
		let n = [];
		for (let r of t) {
			let t = structuredClone(e);
			t.networkRequestTime = r.ts / 1e3, t.rendererStartTime = t.networkRequestTime, t.networkEndTime = (r.ts + r.dur) / 1e3, t.responseHeadersEndTime = t.networkEndTime, t.timing = {
				requestTime: t.networkRequestTime / 1e3,
				receiveHeadersStart: t.responseHeadersEndTime,
				receiveHeadersEnd: t.responseHeadersEndTime,
				proxyStart: -1,
				proxyEnd: -1,
				dnsStart: -1,
				dnsEnd: -1,
				connectStart: -1,
				connectEnd: -1,
				sslStart: -1,
				sslEnd: -1,
				sendStart: -1,
				sendEnd: -1,
				workerStart: -1,
				workerReady: -1,
				workerFetchStart: -1,
				workerRespondWithSettled: -1,
				pushStart: -1,
				pushEnd: -1
			}, t.url = r.url, t.parsedURL = rb(r.url), t.statusCode = 302, t.resourceType = void 0, t.transferSize = 400, n.push(t), o.push(t);
		}
		n.push(e), o.push(e);
		for (let e = 0; e < n.length; e++) {
			let t = n[e];
			e > 0 && (t.redirectSource = n[e - 1], t.redirects = n.slice(0, e)), e !== n.length - 1 && (t.redirectDestination = n[e + 1]);
		}
		for (let e = 1; e < n.length; e++) n[e].requestId = `${n[e - 1].requestId}:redirect`;
	}
	return sb(o), o;
}
function lb(e, t) {
	let n = t.Meta, r = n.mainFrameNavigations.length ? new Set(n.mainFrameNavigations.map((e) => e.pid)) : n.topLevelRendererIds, i = /* @__PURE__ */ new Map();
	for (let e of r) {
		let t = n.threadsInProcess.get(e) ?? [], r = !1;
		for (let [n, a] of t) if (a.args.name === "CrRendererMain") {
			i.set(e, n), r = !0;
			break;
		}
		if (!r) {
			for (let [n, a] of t) if (a.args.name === "CrBrowserMain") {
				i.set(e, n), r = !0;
				break;
			}
		}
	}
	return e.traceEvents.filter((e) => i.get(e.pid) === e.tid);
}
function ub(e, t, n, r) {
	let i = lb(t, n);
	if (!r) {
		r = {
			requestedUrl: e[0].url,
			mainDocumentUrl: ""
		};
		let t = e[0];
		for (; t.redirectDestination;) t = t.redirectDestination;
		r.mainDocumentUrl = t.url;
	}
	return Ey.createGraph(i, e, r);
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/Processor.ts
var db = class e extends Event {
	data;
	static eventName = "traceparseprogress";
	constructor(t, n = { bubbles: !0 }) {
		super(e.eventName, n), this.data = t;
	}
};
function fb(e, t) {
	return t === .8 ? e * (.8 - .2) + .2 : e * t;
}
var pb = class e extends EventTarget {
	#e;
	#t = "IDLE";
	#n = re();
	#r = null;
	#i = null;
	static createWithAllHandlers() {
		return new e(pp, re());
	}
	static getInsightRunners() {
		return { ...uy };
	}
	constructor(e, t) {
		super(), this.#o(e), this.#e = {
			Meta: Xa,
			...e
		}, t && (this.#n = t), this.#a();
	}
	#a() {
		for (let e of Object.values(this.#e)) "handleUserConfig" in e && e.handleUserConfig && e.handleUserConfig(this.#n);
	}
	#o(e) {
		if (Object.keys(e).length === Object.keys(pp).length) return;
		let t = /* @__PURE__ */ new Set();
		for (let [n, r] of Object.entries(e)) {
			t.add(n);
			let e = "deps" in r ? r.deps() : [];
			for (let n of e) t.add(n);
		}
		let n = new Set(Object.keys(e));
		t.delete("Meta");
		for (let e of t) if (!n.has(e)) throw Error(`Required handler ${e} not provided.`);
	}
	reset() {
		if (this.#t === "PARSING") throw Error("Trace processor can't reset while parsing.");
		let e = Object.values(this.#e);
		for (let t of e) t.reset();
		this.#r = null, this.#i = null, this.#t = "IDLE";
	}
	async parse(e, t) {
		if (this.#t !== "IDLE") throw Error(`Trace processor can't start parsing when not idle. Current state: ${this.#t}`);
		t.isCPUProfile === void 0 && t.metadata && (t.isCPUProfile = t.metadata.dataOrigin === le.CPU_PROFILE), t.logger?.start("total");
		try {
			this.#t = "PARSING", t.logger?.start("parse"), await this.#s(e, t), t.logger?.end("parse"), this.#r && !t.isCPUProfile && (t.logger?.start("insights"), this.#u(this.#r, e, t), t.logger?.end("insights")), this.#t = "FINISHED_PARSING";
		} catch (e) {
			throw this.#t = "ERRORED_WHILE_PARSING", e;
		} finally {
			t.logger?.end("total");
		}
	}
	async #s(e, t) {
		let n = [...mb(this.#e).entries()];
		for (let [, e] of n) e.reset();
		t.logger?.start("parse:handleEvent");
		for (let t = 0; t < e.length; ++t) {
			if (t % 5e4 == 0 && t) {
				let n = fb(t / e.length, .2);
				this.dispatchEvent(new db({ percent: n })), await new Promise((e) => setTimeout(e, 0));
			}
			let r = e[t];
			for (let e = 0; e < n.length; ++e) {
				let [, t] = n[e];
				t.handleEvent(r);
			}
		}
		t.logger?.end("parse:handleEvent");
		let r = {
			...t,
			allTraceEvents: e
		};
		for (let e = 0; e < n.length; e++) {
			let [i, a] = n[e];
			a.finalize && (t.logger?.start(`parse:${i}:finalize`), await new Promise((e) => setTimeout(e, 0)), await a.finalize(r), t.logger?.end(`parse:${i}:finalize`));
			let o = fb(e / n.length, .8);
			this.dispatchEvent(new db({ percent: o }));
		}
		t.logger?.start("parse:handler.data()");
		let i = {};
		for (let [e, t] of Object.entries(this.#e)) Object.assign(i, { [e]: t.data() });
		t.logger?.end("parse:handler.data()"), this.dispatchEvent(new db({ percent: 1 })), this.#r = i;
	}
	get data() {
		return this.#t === "FINISHED_PARSING" ? this.#r : null;
	}
	get insights() {
		return this.#t === "FINISHED_PARSING" ? this.#i : null;
	}
	#c(e, t, n, r, i) {
		if (!e.NetworkRequests || !e.Workers || !e.PageLoadMetrics) return;
		if (!e.NetworkRequests.byTime.length) throw new q("No network requests found in trace");
		let a = e.Meta.navigationsByFrameId.get(n), o = a?.findIndex((e) => e === r);
		if (!a || o === void 0 || o === -1) throw new q("Could not find navigation start");
		let s = a[o].ts, c = o + 1 < a.length ? a[o + 1].ts : Infinity, l = { traceEvents: t.filter((e) => e.ts >= s && e.ts < c) }, u = cb(l, e, s, c), d = ub(u, l, e), f = nb(e, n, r), p = hy.analyze(u);
		if (!p) return;
		let m = {
			networkAnalysis: p,
			throttlingMethod: "provided",
			...i.lanternSettings
		}, h = eb.createSimulator(m), g = {
			graph: d,
			simulator: h,
			processedNavigation: f
		}, _ = Oy.compute(g), v = jy.compute(g, { fcpResult: _ }), y = Ay.compute(g, { lcpResult: v });
		return {
			requests: u,
			graph: d,
			simulator: h,
			metrics: {
				firstContentfulPaint: _,
				interactive: y,
				largestContentfulPaint: v,
				totalBlockingTime: Py.compute(g, {
					fcpResult: _,
					interactiveResult: y
				})
			}
		};
	}
	sortInsightSet(e, t) {
		let n = {
			INPBreakdown: null,
			LCPBreakdown: null,
			LCPDiscovery: null,
			CLSCulprits: null,
			RenderBlocking: null,
			NetworkDependencyTree: null,
			ImageDelivery: null,
			DocumentLatency: null,
			FontDisplay: null,
			Viewport: null,
			DOMSize: null,
			ThirdParties: null,
			DuplicatedJavaScript: null,
			SlowCSSSelector: null,
			ForcedReflow: null,
			Cache: null,
			CharacterSet: null,
			ModernHTTP: null,
			LegacyJavaScript: null
		}, r = Sm(e, t), i = fm(e)?.value, a = i ? N(i) : w(0), o = mm(e).value, s = pm(e)?.value, c = s ? N(s) : w(200), l = a === void 0 ? void 0 : hm(a), u = gm(c), d = _m(o), f = /* @__PURE__ */ new Map();
		for (let [t, n] of Object.entries(e.model)) {
			let e = n.metricSavings?.LCP ?? 0, i = n.metricSavings?.INP ?? 0, s = n.metricSavings?.CLS ?? 0, p = a === void 0 ? void 0 : Math.max(0, a - e), m = Math.max(0, c - i), h = Math.max(0, o - s), g = 0;
			r.lcp && e && l !== void 0 && p !== void 0 && (g += r.lcp * (hm(p) - l)), r.inp && i && u !== void 0 && (g += r.inp * (gm(m) - u)), r.cls && s && d !== void 0 && (g += r.cls * (_m(h) - d)), f.set(t, g);
		}
		let p = Object.keys(n), m = Object.keys(e.model);
		m.sort((e, t) => {
			let n = p.indexOf(e), r = p.indexOf(t);
			return n >= 0 && r >= 0 ? n - r : n >= 0 ? -1 : +(r >= 0);
		}), m.sort((e, t) => (f.get(t) ?? 0) - (f.get(e) ?? 0));
		let h = {};
		for (let t of m) h[t] = e.model[t];
		e.model = h;
	}
	#l(t, n) {
		let r = n.options.logger;
		this.#i ||= /* @__PURE__ */ new Map();
		let i, a, o;
		n.navigation ? (i = `NAVIGATION_${this.#i.size}`, a = t.Meta.finalDisplayUrlByNavigationId.get(n.navigationId) ?? t.Meta.mainFrameURL, o = n.navigation) : (i = Re, a = t.Meta.finalDisplayUrlByNavigationId.get("") ?? t.Meta.mainFrameURL);
		let s = {}, c = {};
		for (let [i, a] of Object.entries(e.getInsightRunners())) try {
			r?.start(`insights:${i}`);
			let e = a.generateInsight(t, n);
			e.frameId = n.frameId, n.navigation?.args.data?.navigationId && (e.navigation = n.navigation), e.createOverlays = () => a.createOverlays(e), Object.assign(s, { [i]: e });
		} catch (e) {
			Object.assign(c, { [i]: e });
		} finally {
			r?.end(`insights:${i}`);
		}
		let l = i === Re, u = M(w(5e3)), d = Object.values(s).every((e) => e && e.state === "pass"), f = !s.LCPBreakdown?.lcpEvent, p = !s.INPBreakdown?.longestInteractionEvent, m = s.CLSCulprits?.shifts?.size === 0;
		if (l && n.bounds.range < u && d && f && p && m) return;
		let h;
		try {
			h = new URL(a);
		} catch {
			return;
		}
		let g = {
			id: i,
			url: h,
			navigation: o,
			frameId: n.frameId,
			bounds: n.bounds,
			model: s,
			modelErrors: c
		};
		this.#i.set(g.id, g), this.sortInsightSet(g, n.options.metadata ?? null);
	}
	#u(e, t, n) {
		this.#i = /* @__PURE__ */ new Map();
		let r = e.Meta.mainFrameNavigations.filter((e) => e.args.frame && e.args.data?.navigationId);
		this.#d(e, r, n);
		for (let [i, a] of r.entries()) {
			let o = a.ts, s = F(o, i + 1 < r.length ? r[i + 1].ts : e.Meta.traceBounds.max);
			this.#f(a, s, e, t, n);
		}
	}
	#d(e, t, n) {
		let r = {
			options: n,
			bounds: t.length > 0 ? F(e.Meta.traceBounds.min, t[0].ts) : e.Meta.traceBounds,
			frameId: e.Meta.mainFrameId
		};
		this.#l(e, r);
	}
	#f(e, t, n, r, i) {
		let a = e.args.frame, o = e.args.data?.navigationId, s;
		try {
			i.logger?.start("insights:createLanternContext"), s = this.#c(n, r, a, e, i);
		} catch (e) {
			e instanceof q && [
				"mainDocumentRequest not found",
				"missing metric scores for main frame",
				"missing metric: FCP",
				"missing metric: LCP",
				"No network requests found in trace",
				"Trace is too old"
			].some((t) => e.message === t) || console.error(e);
		} finally {
			i.logger?.end("insights:createLanternContext");
		}
		let c = {
			options: i,
			bounds: t,
			frameId: a,
			navigation: e,
			navigationId: o,
			lantern: s
		};
		this.#l(n, c);
	}
};
function mb(e) {
	let t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set(), r = (i) => {
		if (t.has(i)) return;
		if (n.has(i)) {
			let e = "";
			for (let t of n) (e || t === i) && (e += `${t}->`);
			throw e += i, Error(`Found dependency cycle in trace event handlers: ${e}`);
		}
		n.add(i);
		let a = e[i];
		if (!a) return;
		let o = a.deps?.();
		o && o.forEach(r), t.set(i, a);
	};
	for (let t of Object.keys(e)) r(t);
	return t;
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/ModelImpl.ts
var hb = class e extends EventTarget {
	#e = [];
	#t = /* @__PURE__ */ new Map();
	#n = [];
	#r = 0;
	#i;
	#a = re();
	static createWithAllHandlers(t) {
		return new e(pp, t);
	}
	static createWithSubsetOfHandlers(t, n) {
		return new e(t, n);
	}
	constructor(e, t) {
		super(), t && (this.#a = t), this.#i = new pb(e, this.#a);
	}
	async parse(e, t = {}) {
		t.showAllEvents === void 0 && (t.showAllEvents = this.#a.showAllEvents);
		let n = t.metadata || {}, r = (e) => {
			let { data: t } = e;
			this.dispatchEvent(new _b({
				type: "PROGRESS_UPDATE",
				data: t
			}));
		};
		this.#i.addEventListener(db.eventName, r);
		let i = j.createAndActivate(e);
		try {
			if (await this.#i.parse(e, t), !this.#i.data) throw Error("processor did not parse trace");
			let r = this.#o(i, e, n, this.#i.data, this.#i.insights);
			this.#e.push(r);
		} catch (e) {
			throw e;
		} finally {
			this.#i.removeEventListener(db.eventName, r), this.dispatchEvent(new _b({
				type: "COMPLETE",
				data: "done"
			}));
		}
	}
	#o(e, t, n, r, i) {
		this.#r++;
		let a = `Trace ${this.#r}`, o = ei(r.Meta.mainFrameURL);
		if (o) {
			let e = S(this.#t, o, () => 1);
			a = `${o} (${e})`, this.#t.set(o, e + 1);
		}
		return this.#n.push(a), {
			traceEvents: t,
			metadata: n,
			data: r,
			insights: i,
			syntheticEventsManager: e
		};
	}
	lastTraceIndex() {
		return this.size() - 1;
	}
	parsedTrace(e = this.#e.length - 1) {
		return this.#e.at(e) ?? null;
	}
	overrideModifications(e, t) {
		this.#e[e] && (this.#e[e].metadata.modifications = t);
	}
	syntheticTraceEventsManager(e = this.#e.length - 1) {
		return this.#e.at(e)?.syntheticEventsManager ?? null;
	}
	size() {
		return this.#e.length;
	}
	deleteTraceByIndex(e) {
		this.#e.splice(e, 1), this.#n.splice(e, 1);
	}
	indexForTrace(e) {
		return this.#e.indexOf(e);
	}
	getRecordingsAvailable() {
		return this.#n;
	}
	resetProcessor() {
		this.#i.reset();
	}
}, gb = /* @__PURE__ */ function(e) {
	return e.COMPLETE = "COMPLETE", e.PROGRESS_UPDATE = "PROGRESS_UPDATE", e;
}({}), _b = class e extends Event {
	data;
	static eventName = "modelupdate";
	constructor(t) {
		super(e.eventName), this.data = t;
	}
}, vb = /* @__PURE__ */ e({
	EventCategory: () => yb,
	TimelineCategory: () => $,
	TimelineRecordStyle: () => Q,
	getCategoryStyles: () => Eb,
	getEventStyle: () => wb,
	getTimelineMainEventCategories: () => jb,
	markerDetailsForEvent: () => Nb,
	maybeInitSylesMap: () => Db,
	setCategories: () => kb,
	setEventStylesMap: () => Ob,
	setTimelineMainEventCategories: () => Mb,
	stringIsEventCategory: () => Tb,
	visibleTypes: () => Ab
}), X = {
	loading: "Loading",
	experience: "Experience",
	scripting: "Scripting",
	rendering: "Rendering",
	painting: "Painting",
	gpu: "GPU",
	async: "Async",
	system: "System",
	idle: "Idle",
	task: "Task",
	consoleTaskRun: "Run console task",
	other: "Other",
	animation: "Animation",
	event: "Event",
	requestMainThreadFrame: "Request main thread frame",
	frameStart: "Frame start",
	onMessage: "On message",
	schedulePostMessage: "Schedule postMessage",
	messaging: "Messaging",
	frameStartMainThread: "Frame start (main thread)",
	drawFrame: "Draw frame",
	profilingOverhead: "Profiling overhead",
	hitTest: "Hit test",
	scheduleStyleRecalculation: "Schedule style recalculation",
	recalculateStyle: "Recalculate style",
	invalidateLayout: "Invalidate Layout",
	layerize: "Layerize",
	layout: "Layout",
	paintSetup: "Paint setup",
	paintImage: "Paint image",
	prePaint: "Pre-paint",
	updateLayer: "Update layer",
	updateLayerTree: "Update layer tree",
	paint: "Paint",
	rasterizePaint: "Rasterize paint",
	scroll: "Scroll",
	commit: "Commit",
	compositeLayers: "Composite layers",
	computeIntersections: "Compute intersections",
	parseHtml: "Parse HTML",
	parseStylesheet: "Parse stylesheet",
	installTimer: "Install timer",
	removeTimer: "Remove timer",
	timerFired: "Timer fired",
	xhrReadyStateChange: "`XHR` `readyState` change",
	xhrLoad: "`XHR` load",
	compileScript: "Compile script",
	cacheScript: "Cache script code",
	compileCode: "Compile code",
	optimizeCode: "Optimize code",
	evaluateScript: "Evaluate script",
	compileModule: "Compile module",
	cacheModule: "Cache module code",
	evaluateModule: "Evaluate module",
	streamingCompileTask: "Streaming compile task",
	waitingForNetwork: "Waiting for network",
	parseAndCompile: "Parse and compile",
	deserializeCodeCache: "Deserialize code cache",
	streamingWasmResponse: "Streaming Wasm response",
	compiledWasmModule: "Compiled Wasm module",
	cachedWasmModule: "Cached Wasm module",
	wasmModuleCacheHit: "Wasm module cache hit",
	wasmModuleCacheInvalid: "Wasm module cache invalid",
	frameStartedLoading: "Frame started loading",
	onloadEvent: "Onload event",
	domcontentloadedEvent: "DOMContentLoaded event",
	firstPaint: "First Paint",
	firstContentfulPaint: "First Contentful Paint",
	largestContentfulPaint: "Largest Contentful Paint",
	softLargestContentfulPaint: "Soft Largest Contentful Paint",
	timestamp: "Timestamp",
	consoleTime: "Console time",
	userTiming: "User timing",
	willSendRequest: "Will send request",
	sendRequest: "Send request",
	receiveResponse: "Receive response",
	finishLoading: "Finish loading",
	receiveData: "Receive data",
	runMicrotasks: "Run microtasks",
	functionCall: "Function call",
	gcEvent: "GC event",
	majorGc: "Major GC",
	minorGc: "Minor GC",
	requestAnimationFrame: "Request animation frame",
	cancelAnimationFrame: "Cancel animation frame",
	animationFrameFired: "Animation frame fired",
	requestIdleCallback: "Request idle callback",
	cancelIdleCallback: "Cancel idle callback",
	fireIdleCallback: "Fire idle callback",
	createWebsocket: "Create WebSocket",
	sendWebsocketHandshake: "Send WebSocket handshake",
	receiveWebsocketHandshake: "Receive WebSocket handshake",
	wsMessageReceived: "Receive WebSocket message",
	wsMessageSent: "Send WebSocket message",
	destroyWebsocket: "Destroy WebSocket",
	embedderCallback: "Embedder callback",
	imageDecode: "Image decode",
	domGc: "DOM GC",
	cppGc: "C++ GC",
	encrypt: "Encrypt",
	encryptReply: "Encrypt reply",
	decrypt: "Decrypt",
	decryptReply: "Decrypt reply",
	digest: "Digest",
	digestReply: "Digest reply",
	sign: "Sign",
	signReply: "Sign reply",
	verify: "Verify",
	verifyReply: "Verify reply",
	asyncTask: "Async task",
	layoutShift: "Layout shift",
	layoutShiftCluster: "Layout shift cluster",
	eventTiming: "Event timing",
	jsFrame: "JS frame",
	rasterizing: "Rasterizing",
	drawing: "Drawing",
	schedulePostTaskCallback: "Schedule postTask",
	runPostTaskCallback: "Fire postTask",
	abortPostTaskCallback: "Cancel postTask"
}, yb = /* @__PURE__ */ function(e) {
	return e.DRAWING = "drawing", e.RASTERIZING = "rasterizing", e.LAYOUT = "layout", e.LOADING = "loading", e.EXPERIENCE = "experience", e.SCRIPTING = "scripting", e.MESSAGING = "messaging", e.RENDERING = "rendering", e.PAINTING = "painting", e.GPU = "gpu", e.ASYNC = "async", e.OTHER = "other", e.IDLE = "idle", e;
}({}), bb, xb = i("models/trace/Styles.ts", X), Z = t.bind(void 0, xb), Q = class {
	title;
	category;
	hidden;
	constructor(e, t, n = !1) {
		this.title = e, this.category = t, this.hidden = n;
	}
}, $ = class {
	name;
	title;
	visible;
	#e;
	#t;
	constructor(e, t, n, r) {
		this.name = e, this.title = t, this.visible = n, this.#t = r, this.hidden = !1;
	}
	get hidden() {
		return !!this.#e;
	}
	get cssVariable() {
		return this.#t;
	}
	getCSSValue() {
		return `var(${this.#t})`;
	}
	set hidden(e) {
		this.#e = e;
	}
}, Sb, Cb;
function wb(e) {
	return Db()[e];
}
function Tb(e) {
	return Object.values(yb).includes(e);
}
function Eb() {
	return Sb || (Sb = {
		loading: new $("loading", Z(X.loading), !0, "--app-color-loading"),
		experience: new $("experience", Z(X.experience), !1, "--app-color-rendering"),
		messaging: new $("messaging", Z(X.messaging), !0, "--app-color-messaging"),
		scripting: new $("scripting", Z(X.scripting), !0, "--app-color-scripting"),
		rendering: new $("rendering", Z(X.rendering), !0, "--app-color-rendering"),
		painting: new $("painting", Z(X.painting), !0, "--app-color-painting"),
		gpu: new $("gpu", Z(X.gpu), !1, "--app-color-painting"),
		async: new $("async", Z(X.async), !1, "--app-color-async"),
		other: new $("other", Z(X.system), !1, "--app-color-system"),
		idle: new $("idle", Z(X.idle), !1, "--app-color-idle"),
		layout: new $("layout", Z(X.layout), !1, "--app-color-loading"),
		rasterizing: new $("rasterizing", Z(X.rasterizing), !1, "--app-color-scripting"),
		drawing: new $("drawing", Z(X.drawing), !1, "--app-color-rendering")
	}, Sb);
}
function Db() {
	if (Cb) return Cb;
	let e = Eb();
	Cb = {
		[A.RUN_TASK]: new Q(Z(X.task), e.other),
		[A.PROFILE_CALL]: new Q(Z(X.jsFrame), e.scripting),
		[A.JS_SAMPLE]: new Q(A.JS_SAMPLE, e.scripting),
		[A.PROGRAM]: new Q(Z(X.other), e.other),
		[A.START_PROFILING]: new Q(Z(X.profilingOverhead), e.other),
		[A.ANIMATION]: new Q(Z(X.animation), e.rendering),
		[A.EVENT_DISPATCH]: new Q(Z(X.event), e.scripting),
		[A.REQUEST_MAIN_THREAD_FRAME]: new Q(Z(X.requestMainThreadFrame), e.rendering, !0),
		[A.BEGIN_FRAME]: new Q(Z(X.frameStart), e.rendering, !0),
		[A.BEGIN_MAIN_THREAD_FRAME]: new Q(Z(X.frameStartMainThread), e.rendering, !0),
		[A.DRAW_FRAME]: new Q(Z(X.drawFrame), e.rendering, !0),
		[A.HIT_TEST]: new Q(Z(X.hitTest), e.rendering),
		[A.SCHEDULE_STYLE_RECALCULATION]: new Q(Z(X.scheduleStyleRecalculation), e.rendering),
		[A.RECALC_STYLE]: new Q(Z(X.recalculateStyle), e.rendering),
		[A.INVALIDATE_LAYOUT]: new Q(Z(X.invalidateLayout), e.rendering, !0),
		[A.LAYERIZE]: new Q(Z(X.layerize), e.rendering),
		[A.LAYOUT]: new Q(Z(X.layout), e.rendering),
		[A.PAINT_SETUP]: new Q(Z(X.paintSetup), e.painting),
		[A.PAINT_IMAGE]: new Q(Z(X.paintImage), e.painting, !0),
		[A.UPDATE_LAYER]: new Q(Z(X.updateLayer), e.painting, !0),
		[A.UPDATE_LAYER_TREE]: new Q(Z(X.updateLayerTree), e.rendering),
		[A.PAINT]: new Q(Z(X.paint), e.painting),
		[A.PRE_PAINT]: new Q(Z(X.prePaint), e.rendering),
		[A.RASTER_TASK]: new Q(Z(X.rasterizePaint), e.painting),
		[A.SCROLL_LAYER]: new Q(Z(X.scroll), e.rendering),
		[A.COMMIT]: new Q(Z(X.commit), e.painting),
		[A.COMPOSITE_LAYERS]: new Q(Z(X.compositeLayers), e.painting),
		[A.COMPUTE_INTERSECTION]: new Q(Z(X.computeIntersections), e.rendering),
		[A.PARSE_HTML]: new Q(Z(X.parseHtml), e.loading),
		[A.PARSE_AUTHOR_STYLE_SHEET]: new Q(Z(X.parseStylesheet), e.loading),
		[A.TIMER_INSTALL]: new Q(Z(X.installTimer), e.scripting),
		[A.TIMER_REMOVE]: new Q(Z(X.removeTimer), e.scripting),
		[A.TIMER_FIRE]: new Q(Z(X.timerFired), e.scripting),
		[A.XHR_READY_STATE_CHANGED]: new Q(Z(X.xhrReadyStateChange), e.scripting),
		[A.XHR_LOAD]: new Q(Z(X.xhrLoad), e.scripting),
		[A.COMPILE]: new Q(Z(X.compileScript), e.scripting),
		[A.CACHE_SCRIPT]: new Q(Z(X.cacheScript), e.scripting),
		[A.COMPILE_CODE]: new Q(Z(X.compileCode), e.scripting),
		[A.OPTIMIZE_CODE]: new Q(Z(X.optimizeCode), e.scripting),
		[A.EVALUATE_SCRIPT]: new Q(Z(X.evaluateScript), e.scripting),
		[A.COMPILE_MODULE]: new Q(Z(X.compileModule), e.scripting),
		[A.CACHE_MODULE]: new Q(Z(X.cacheModule), e.scripting),
		[A.EVALUATE_MODULE]: new Q(Z(X.evaluateModule), e.scripting),
		[A.STREAMING_COMPILE_SCRIPT]: new Q(Z(X.streamingCompileTask), e.other),
		[A.STREAMING_COMPILE_SCRIPT_WAITING]: new Q(Z(X.waitingForNetwork), e.idle),
		[A.STREAMING_COMPILE_SCRIPT_PARSING]: new Q(Z(X.parseAndCompile), e.scripting),
		[A.BACKGROUND_DESERIALIZE]: new Q(Z(X.deserializeCodeCache), e.scripting),
		[A.FINALIZE_DESERIALIZATION]: new Q(Z(X.profilingOverhead), e.other),
		[A.WASM_STREAM_FROM_RESPONSE_CALLBACK]: new Q(Z(X.streamingWasmResponse), e.scripting),
		[A.WASM_COMPILED_MODULE]: new Q(Z(X.compiledWasmModule), e.scripting),
		[A.WASM_CACHED_MODULE]: new Q(Z(X.cachedWasmModule), e.scripting),
		[A.WASM_MODULE_CACHE_HIT]: new Q(Z(X.wasmModuleCacheHit), e.scripting),
		[A.WASM_MODULE_CACHE_INVALID]: new Q(Z(X.wasmModuleCacheInvalid), e.scripting),
		[A.FRAME_STARTED_LOADING]: new Q(Z(X.frameStartedLoading), e.loading, !0),
		[A.MARK_LOAD]: new Q(Z(X.onloadEvent), e.scripting, !0),
		[A.MARK_DOM_CONTENT]: new Q(Z(X.domcontentloadedEvent), e.scripting, !0),
		[A.MARK_FIRST_PAINT]: new Q(Z(X.firstPaint), e.painting, !0),
		[A.MARK_FCP]: new Q(Z(X.firstContentfulPaint), e.rendering, !0),
		[A.MARK_LCP_CANDIDATE]: new Q(Z(X.largestContentfulPaint), e.rendering, !0),
		[A.MARK_LCP_CANDIDATE_FOR_SOFT_NAVIGATION]: new Q(Z(X.softLargestContentfulPaint), e.rendering, !0),
		[A.TIME_STAMP]: new Q(Z(X.timestamp), e.scripting),
		[A.CONSOLE_TIME]: new Q(Z(X.consoleTime), e.scripting),
		[A.USER_TIMING]: new Q(Z(X.userTiming), e.scripting),
		[A.RESOURCE_WILL_SEND_REQUEST]: new Q(Z(X.willSendRequest), e.loading),
		[A.RESOURCE_SEND_REQUEST]: new Q(Z(X.sendRequest), e.loading),
		[A.RESOURCE_RECEIVE_RESPONSE]: new Q(Z(X.receiveResponse), e.loading),
		[A.RESOURCE_FINISH]: new Q(Z(X.finishLoading), e.loading),
		[A.RESOURCE_RECEIVE_DATA]: new Q(Z(X.receiveData), e.loading),
		[A.RUN_MICROTASKS]: new Q(Z(X.runMicrotasks), e.scripting),
		[A.FUNCTION_CALL]: new Q(Z(X.functionCall), e.scripting),
		[A.GC]: new Q(Z(X.gcEvent), e.scripting),
		[A.MAJOR_GC]: new Q(Z(X.majorGc), e.scripting),
		[A.MINOR_GC]: new Q(Z(X.minorGc), e.scripting),
		[A.CPPGC_SWEEP]: new Q(Z(X.cppGc), e.scripting),
		[A.REQUEST_ANIMATION_FRAME]: new Q(Z(X.requestAnimationFrame), e.scripting),
		[A.CANCEL_ANIMATION_FRAME]: new Q(Z(X.cancelAnimationFrame), e.scripting),
		[A.FIRE_ANIMATION_FRAME]: new Q(Z(X.animationFrameFired), e.scripting),
		[A.REQUEST_IDLE_CALLBACK]: new Q(Z(X.requestIdleCallback), e.scripting),
		[A.CANCEL_IDLE_CALLBACK]: new Q(Z(X.cancelIdleCallback), e.scripting),
		[A.FIRE_IDLE_CALLBACK]: new Q(Z(X.fireIdleCallback), e.scripting),
		[A.WEB_SOCKET_CREATE]: new Q(Z(X.createWebsocket), e.scripting),
		[A.WEB_SOCKET_SEND_HANDSHAKE_REQUEST]: new Q(Z(X.sendWebsocketHandshake), e.scripting),
		[A.WEB_SOCKET_RECEIVE_HANDSHAKE_REQUEST]: new Q(Z(X.receiveWebsocketHandshake), e.scripting),
		[A.WEB_SOCKET_DESTROY]: new Q(Z(X.destroyWebsocket), e.scripting),
		[A.WEB_SOCKET_SEND]: new Q(Z(X.wsMessageSent), e.scripting),
		[A.WEB_SOCKET_RECEIVE]: new Q(Z(X.wsMessageReceived), e.scripting),
		[A.EMBEDDER_CALLBACK]: new Q(Z(X.embedderCallback), e.scripting),
		[A.DECODE_IMAGE]: new Q(Z(X.imageDecode), e.painting),
		[A.GPU_TASK]: new Q(Z(X.gpu), e.gpu),
		[A.GC_COLLECT_GARBARGE]: new Q(Z(X.domGc), e.scripting),
		[A.CRYPTO_DO_ENCRYPT]: new Q(Z(X.encrypt), e.scripting),
		[A.CRYPTO_DO_ENCRYPT_REPLY]: new Q(Z(X.encryptReply), e.scripting),
		[A.CRYPTO_DO_DECRYPT]: new Q(Z(X.decrypt), e.scripting),
		[A.CRYPTO_DO_DECRYPT_REPLY]: new Q(Z(X.decryptReply), e.scripting),
		[A.CRYPTO_DO_DIGEST]: new Q(Z(X.digest), e.scripting),
		[A.CRYPTO_DO_DIGEST_REPLY]: new Q(Z(X.digestReply), e.scripting),
		[A.CRYPTO_DO_SIGN]: new Q(Z(X.sign), e.scripting),
		[A.CRYPTO_DO_SIGN_REPLY]: new Q(Z(X.signReply), e.scripting),
		[A.CRYPTO_DO_VERIFY]: new Q(Z(X.verify), e.scripting),
		[A.CRYPTO_DO_VERIFY_REPLY]: new Q(Z(X.verifyReply), e.scripting),
		[A.ASYNC_TASK]: new Q(Z(X.asyncTask), e.async),
		[A.LAYOUT_SHIFT]: new Q(Z(X.layoutShift), e.experience, !0),
		[A.SYNTHETIC_LAYOUT_SHIFT]: new Q(Z(X.layoutShift), e.experience),
		[A.SYNTHETIC_LAYOUT_SHIFT_CLUSTER]: new Q(Z(X.layoutShiftCluster), e.experience),
		[A.EVENT_TIMING]: new Q(Z(X.eventTiming), e.experience),
		[A.HANDLE_POST_MESSAGE]: new Q(Z(X.onMessage), e.messaging),
		[A.SCHEDULE_POST_MESSAGE]: new Q(Z(X.schedulePostMessage), e.messaging),
		[A.SCHEDULE_POST_TASK_CALLBACK]: new Q(Z(X.schedulePostTaskCallback), e.scripting),
		[A.RUN_POST_TASK_CALLBACK]: new Q(Z(X.runPostTaskCallback), e.scripting),
		[A.ABORT_POST_TASK_CALLBACK]: new Q(Z(X.abortPostTaskCallback), e.scripting),
		[A.V8_CONSOLE_RUN_TASK]: new Q(Z(X.consoleTaskRun), e.scripting)
	};
	let t = Object.entries(Cb).filter(([, e]) => e.hidden === !1).map(([e]) => e).every((e) => Mi.has(e)), n = Object.keys(Cb), r = Array.from(Mi).every((e) => n.includes(e));
	if (!t || !r) throw Error("eventStylesMap and VISIBLE_TRACE_EVENT_TYPES are out of sync!");
	return Cb;
}
function Ob(e) {
	Cb = e;
}
function kb(e) {
	Sb = e;
}
function Ab() {
	let e = Db(), t = [];
	for (let n in e) e[n]?.hidden || t.push(n);
	return t;
}
function jb() {
	return bb || (bb = [
		"idle",
		"loading",
		"painting",
		"rendering",
		"scripting",
		"other"
	], bb);
}
function Mb(e) {
	bb = e;
}
function Nb(e) {
	let t = "", n = "var(--color-text-primary)";
	return en(e) && (n = "var(--sys-color-green-bright)", t = V.FCP), O(e) && (n = "var(--sys-color-green)", t = tn(e) ? V.SOFT_LCP : V.LCP), (On(e) || je(e)) && (n = "var(--color-text-primary)", t = je(e) ? V.SOFT_NAV : V.NAV), sn(e) && (n = "var(--color-text-disabled)", t = V.DCL), an(e) && (n = "var(--color-text-disabled)", t = V.L), {
		color: n,
		title: t
	};
}
//#endregion
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/trace/Name.ts
var Pb = {
	anonymous: "(anonymous)",
	eventDispatchS: "Event: {PH1}",
	frame: "Frame",
	wsConnectionOpened: "WebSocket opened",
	wsConnectionOpenedWithUrl: "WebSocket opened: {PH1}",
	wsConnectionClosed: "WebSocket closed",
	layoutShift: "Layout shift"
}, Fb = i("models/trace/Name.ts", Pb), Ib = t.bind(void 0, Fb);
function Lb(e, t) {
	if (k(e)) {
		if (t) {
			let n = cs(t.data.Samples, e);
			if (n) return n;
		}
		return e.callFrame.functionName || Ib(Pb.anonymous);
	}
	if (xr(e)) return o(Pb.frame);
	if (Lt(e)) return Ib(Pb.eventDispatchS, { PH1: e.args.data.type });
	if (wn(e)) {
		let t = new f(e.args.data.url);
		return t.isValid ? `${t.displayName} (${t.host})` : e.args.data.url || "Network request";
	}
	return rr(e) ? e.args.data.url ? Ib(Pb.wsConnectionOpenedWithUrl, { PH1: e.args.data.url }) : Ib(Pb.wsConnectionOpened) : cr(e) ? Ib(Pb.wsConnectionClosed) : ot(e) ? Rb(e) : Wn(e) ? Ib(Pb.layoutShift) : Zt(e) && e.args.data.beginEvent.args.data.displayName ? e.args.data.beginEvent.args.data.displayName : wb(e.name)?.title || e.name;
}
function Rb(e) {
	let t = Ff(e);
	return t === "OTHER" ? "Other" : t === "KEYBOARD" ? "Keyboard" : t === "POINTER" ? "Pointer" : e.type;
}
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/components/snackbars/snackbar.css.mjs
var zb = "/*\n * Copyright 2025 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n    position: fixed;\n    bottom: var(--sys-size-5);\n    left: var(--sys-size-5);\n    z-index: 9999;\n    /* subtract var(--sys-size-5) * 2 so that there is equal space on the left and on the right in small screens */\n    max-width: calc(100% - 2 * var(--sys-size-5));\n\n    .container {\n        display: flex;\n        align-items: center;\n        overflow: hidden;\n        width: var(--sys-size-31);\n        padding: var(--sys-size-6);\n        background: var(--sys-color-inverse-surface);\n        box-shadow: var(--sys-elevation-level3);\n        border-radius: var(--sys-shape-corner-small);\n        font: var(--sys-typescale-body4-medium);\n        animation: slideIn 100ms cubic-bezier(0, 0, 0.3, 1);\n        box-sizing: border-box;\n        max-width: 100%;\n\n        &.closable {\n            padding: var(--sys-size-5) var(--sys-size-5) var(--sys-size-5) var(--sys-size-6);\n\n            &.long-action {\n                padding: var(--sys-size-5) var(--sys-size-6) var(--sys-size-6) var(--sys-size-6);\n            }\n        }\n\n        &.long-action {\n            flex-direction: column;\n            align-items: flex-start;\n\n            .long-action-container {\n                margin-left: auto;\n            }\n        }\n\n        .label-container {\n            display: flex;\n            width: 100%;\n            align-items: center;\n            gap: var(--sys-size-5);\n\n            .message {\n                width: 100%;\n                color: var(--sys-color-inverse-on-surface);\n                flex: 1 0 0;\n                text-wrap: pretty;\n                user-select: text;\n            }\n        }\n\n        devtools-button.dismiss {\n            padding: 3px;\n        }\n    }\n}\n\n @keyframes slideIn {\n    from {\n        transform: translateY(var(--sys-size-5));\n        opacity: 0%;\n    }\n\n    to {\n        opacity: 100%;\n    }\n}\n", { html: Bb } = g, Vb = { dismiss: "Dismiss" }, Hb = i("ui/components/snackbars/Snackbar.ts", Vb), Ub = t.bind(void 0, Hb), Wb = 5e3, Gb = 15, Kb = class e extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t;
	#n = null;
	#r = !1;
	#i;
	static snackbarQueue = [];
	get dismissTimeout() {
		return this.hasAttribute("dismiss-timeout") ? Number(this.getAttribute("dismiss-timeout")) : Wb;
	}
	set dismissTimeout(e) {
		this.setAttribute("dismiss-timeout", e.toString());
	}
	get message() {
		return this.getAttribute("message");
	}
	set message(e) {
		this.setAttribute("message", e);
	}
	get closable() {
		return this.hasAttribute("closable");
	}
	set closable(e) {
		this.toggleAttribute("closable", e);
	}
	get actionButtonLabel() {
		return this.getAttribute("action-button-label");
	}
	set actionButtonLabel(e) {
		this.setAttribute("action-button-label", e);
	}
	get actionButtonTitle() {
		return this.getAttribute("action-button-title");
	}
	set actionButtonTitle(e) {
		this.setAttribute("action-button-title", e);
	}
	set actionButtonClickHandler(e) {
		this.#i = e;
	}
	constructor(e, t) {
		super(), this.message = e.message, this.#t = t || v.instance().element, e.closable && (this.closable = e.closable), e.actionProperties && (this.actionButtonLabel = e.actionProperties.label, this.#i = e.actionProperties.onClick, e.actionProperties.title && (this.actionButtonTitle = e.actionProperties.title));
	}
	static show(t, n) {
		let r = new e(t, n);
		return e.snackbarQueue.push(r), e.snackbarQueue.length === 1 && r.#a(), r;
	}
	#a() {
		this.#t.appendChild(this), this.#n && window.clearTimeout(this.#n), this.closable || (this.#n = window.setTimeout(() => {
			this.#o();
		}, this.dismissTimeout));
	}
	#o() {
		if (this.#n && window.clearTimeout(this.#n), this.remove(), e.snackbarQueue.shift(), e.snackbarQueue.length > 0) {
			let t = e.snackbarQueue[0];
			t && t.#a();
		}
	}
	#s(e) {
		this.#i && (e.preventDefault(), this.#i(), this.#o());
	}
	connectedCallback() {
		this.actionButtonLabel && (this.#r = this.actionButtonLabel.length > Gb), this.role = "alert";
		let e = y({
			container: !0,
			"long-action": !!this.#r,
			closable: !!this.closable
		}), t = this.actionButtonLabel ? Bb`<devtools-button
        class="snackbar-button"
        @click=${this.#s}
        jslog=${ee("snackbar.action").track({ click: !0 })}
        .variant=${p.TEXT}
        .title=${this.actionButtonTitle ?? ""}
        .inverseColorTheme=${!0}
    >${this.actionButtonLabel}</devtools-button>` : b, n = this.closable ? Bb`<devtools-button
        class="dismiss snackbar-button"
        @click=${this.#o}
        jslog=${ee("snackbar.dismiss").track({ click: !0 })}
        aria-label=${Ub(Vb.dismiss)}
        .iconName=${"cross"}
        .variant=${p.ICON}
        .title=${Ub(Vb.dismiss)}
        .inverseColorTheme=${!0}
    ></devtools-button>` : b;
		h(Bb`
        <style>${zb}</style>
        <div class=${e}>
            <div class="label-container">
                <div class="message">${this.message}</div>
                ${this.#r ? b : t}
                ${n}
            </div>
            ${this.#r ? Bb`<div class="long-action-container">${t}</div>` : b}
        </div>
    `, this.#e, { host: this });
	}
};
customElements.define("devtools-snackbar", Kb);
//#endregion
export { Rh as $, Bn as $n, ge as $r, Ko as $t, $_ as A, Br as An, we as Ar, vp as At, Hg as B, j as Bn, Gn as Br, Zu as Bt, Qv as C, P as Cn, Ln as Cr, Vp as Ct, Sv as D, zr as Dn, Ct as Dr, Op as Dt, Uv as E, N as En, mt as Er, Ap as Et, I_ as F, qr as Fn, je as Fr, Cf as Ft, dg as G, A as Gn, Nn as Gr, Iu as Gt, Cg as H, Te as Hn, jn as Hr, V as Ht, s_ as I, Wr as In, He as Ir, Vf as It, rg as J, _e as Jn, ur as Jr, Yc as Jt, fg as K, D as Kn, dr as Kr, Ou as Kt, d_ as L, Ur as Ln, Zt as Lr, uf as Lt, z_ as M, Kr as Mn, Be as Mr, hp as Mt, U_ as N, F as Nn, Jn as Nr, pp as Nt, Ev as O, M as On, nr as Or, xp as Ot, k_ as P, Gr as Pn, tn as Pr, ip as Pt, eg as Q, Er as Qn, w as Qr, cs as Qt, Zg as R, Zr as Rn, ot as Rr, sf as Rt, qv as S, I as Sn, zn as Sr, Up as St, Lv as T, Vr as Tn, k as Tr, Np as Tt, Ng as U, br as Un, Tn as Ur, pu as Ut, Kg as V, Ar as Vn, wn as Vr, ad as Vt, Mg as W, Re as Wn, Ut as Wr, Fu as Wt, cg as X, Xt as Xn, ar as Xr, Nc as Xt, ig as Y, Ie as Yn, lr as Yr, $c as Yt, Yh as Z, O as Zn, C as Zr, Mc as Zt, _b as _, Si as _n, En as _r, W as _t, $ as a, ie as ai, Vi as an, en as ar, mh as at, sy as b, Yr as bn, Un as br, qp as bt, wb as c, ki as cn, fn as cr, Mm as ct, kb as d, bi as dn, Oe as dr, mm as dt, le as ei, qo as en, Vn as er, zh as et, Ob as f, oi as fn, xr as fr, xm as ft, hb as g, Ci as gn, On as gr, dm as gt, Ab as h, hi as hn, Pe as hr, jm as ht, vb as i, fe as ii, Ki as in, Bt as ir, uh as it, yv as j, Xr as jn, Vt as jr, gp as jt, Q_ as k, Rr as kn, vn as kr, yp as kt, jb as l, Ti as ln, Ht as lr, Nm as lt, Tb as m, mi as mn, an as mr, fm as mt, Lb as n, me as ni, $i as nn, Lt as nr, Mh as nt, Q as o, ce as oi, Ri as on, on as or, bh as ot, Mb as p, gi as pn, sn as pr, pm as pt, yg as q, Mt as qn, rr as qr, _l as qt, yb as r, pe as ri, Wi as rn, vt as rr, ah as rt, Eb as s, re as si, Mi as sn, fr as sr, Qm as st, Kb as t, ue as ti, ea as tn, bt as tr, Kh as tt, Nb as u, Di as un, wt as ur, Um as ut, gb as v, _i as vn, Kn as vr, G as vt, Iv as w, Hr as wn, ye as wr, Hp as wt, Kv as x, Jr as xn, Ge as xr, Kp as xt, ry as y, $r as yn, qn as yr, Qp as yt, t_ as z, Qr as zn, Wn as zr, Id as zt };
