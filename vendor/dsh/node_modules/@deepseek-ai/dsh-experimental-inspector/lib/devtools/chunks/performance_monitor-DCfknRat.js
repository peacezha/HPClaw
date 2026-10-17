import { n as e } from "./rolldown-runtime-DF993M8W.js";
import { Et as t, H as n, J as r, K as i, i as a } from "./common-DMSVbaSb.js";
import { $r as o, Df as s, Dp as c, Fo as l, Po as u, Wo as d, ei as f, fo as p, ii as m, jd as h, kd as g, ms as _, qa as v } from "./legacy-dM_vujv7.js";
import "./platform-D4TUCh2P.js";
import { k as y } from "./StringUtilities-CMDxNrEc.js";
import { n as b, t as x } from "./theme_support-BJ6jI25-.js";
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/performance_monitor/performanceMonitor.css.mjs
var S = "/*\n * Copyright 2017 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  overflow: hidden;\n\n  --override-color-perf-monitor-cpu: var(--ref-palette-yellow40);\n  --override-color-perf-monitor-cpu-task-duration: var(--sys-color-neutral-bright);\n  --override-color-perf-monitor-cpu-script-duration: var(--sys-color-yellow-bright);\n  --override-color-perf-monitor-cpu-layout-duration: var(--sys-color-purple);\n  --override-color-perf-monitor-cpu-recalc-style-duration: var(--sys-color-purple-bright);\n  --override-color-perf-monitor-jsheap: var(--sys-color-purple-bright);\n  --override-color-perf-monitor-jsheap-total-size: var(--ref-palette-purple70);\n  --override-color-perf-monitor-jsheap-used-size: var(--sys-color-purple-bright);\n  --override-color-perf-monitor-dom-nodes: var(--sys-color-green);\n  --override-color-perf-monitor-js-event-listeners: var(--ref-palette-green50);\n  --override-color-perf-monitor-documents: var(--sys-color-blue);\n  --override-color-perf-monitor-document-frames: var(--sys-color-cyan-bright);\n  --override-color-perf-monitor-layout-count: var(--ref-palette-pink50);\n  --override-color-perf-monitor-recalc-style-count: var(--sys-color-pink);\n}\n\n:host-context(.theme-with-dark-background) {\n  --override-color-perf-monitor-cpu: var(--sys-color-yellow-bright);\n  --override-color-perf-monitor-js-event-listeners: var(--ref-palette-green70);\n  --override-color-perf-monitor-jsheap-total-size: var(--ref-palette-purple50);\n  --override-color-perf-monitor-layout-count: var(--sys-color-pink-bright);\n}\n\n.suspended {\n  opacity: 40%;\n  pointer-events: none;\n}\n\n.perfmon-chart-suspend-overlay {\n  display: flex;\n  font-size: 26px;\n  align-items: center;\n  justify-content: center;\n}\n\n.perfmon-control-pane {\n  display: flex;\n  flex: initial;\n  flex-direction: column;\n  padding: 6px 0;\n  overflow: hidden auto;\n}\n\n.perfmon-chart-container {\n  display: flex;\n  flex: 1 1;\n  border-left: 1px solid var(--sys-color-divider);\n  overflow-y: auto;\n}\n\n.perfmon-chart-container canvas {\n  width: 100%;\n}\n\n.perfmon-indicator {\n  padding: 3px 9px;\n  margin: -1px 0;\n  display: flex;\n  flex-shrink: 0;\n  width: 210px;\n}\n\n.perfmon-indicator span {\n  flex: 0 0 135px;\n}\n\n.perfmon-indicator-value {\n  flex: 0 0 55px;\n  text-align: right;\n  overflow: visible;\n  align-self: center;\n  margin-left: auto;\n}\n\n.perfmon-indicator:not(.active) .perfmon-indicator-value {\n  opacity: 0%;\n}\n", C = /* @__PURE__ */ e({
	ControlPane: () => P,
	Format: () => M,
	PerformanceMonitorImpl: () => j,
	format: () => z,
	formatNumber: () => L
}), w = {
	graphsDisplayingARealtimeViewOf: "Graphs displaying a real-time view of performance metrics",
	paused: "Paused",
	cpuUsage: "CPU usage",
	jsHeapSize: "JS heap size",
	domNodes: "DOM Nodes",
	jsEventListeners: "JS event listeners",
	documents: "Documents",
	documentFrames: "Document Frames",
	layoutsSec: "Layouts / sec",
	styleRecalcsSec: "Style recalcs / sec"
}, T = i("panels/performance_monitor/PerformanceMonitor.ts", w), E = n.bind(void 0, T), { widget: D } = m, { classMap: O, ref: k } = d, A = (e, t, n) => {
	l(u`
    <devtools-widget ${D(P, {
		onMetricChanged: e.onMetricChanged,
		chartsInfo: e.chartsInfo,
		metrics: e.metrics
	})} class=${O({ suspended: e.suspended })}></devtools-widget>
    <div class="perfmon-chart-container ${O({ suspended: e.suspended })}">
      <canvas tabindex="-1" aria-label=${E(w.graphsDisplayingARealtimeViewOf)}
          .width=${Math.round(e.width * window.devicePixelRatio)} .height=${e.height}
          style="height:${e.height / window.devicePixelRatio}px" ${k((e) => {
		if (e) {
			let n = e;
			t.graphRenderingContext = n.getContext("2d"), t.width = n.offsetWidth;
		}
	})}>
      </canvas>
    </div>
    ${e.suspended ? u`
      <div class="perfmon-chart-suspend-overlay fill">
        <div>${E(w.paused)}</div>
      </div>` : ""}`, n, { container: { attributes: { jslog: `${v("performance.monitor").track({ resize: !0 })}` } } });
}, j = class extends o {
	view;
	chartInfos = [];
	activeCharts = /* @__PURE__ */ new Set();
	metricsBuffer;
	pixelsPerMs;
	pollIntervalMs;
	scaleHeight;
	graphHeight;
	gridColor;
	animationId;
	width;
	height;
	model;
	pollTimer;
	metrics;
	suspended = !1;
	graphRenderingContext = null;
	constructor(e = 500, t = A) {
		super({ useShadowDom: "pure" }), this.view = t, this.registerRequiredCSS(S), this.metricsBuffer = [], this.pixelsPerMs = 10 / 1e3, this.pollIntervalMs = e, this.scaleHeight = 16, this.graphHeight = 90, this.gridColor = b.instance().getComputedValue("--divider-line"), h.instance().observeModels(_, this);
	}
	onMetricStateChanged(e, t) {
		t ? this.activeCharts.add(e) : this.activeCharts.delete(e), this.recalcChartHeight();
	}
	wasShown() {
		super.wasShown(), this.model && (this.chartInfos = this.createChartInfos(), b.instance().addEventListener(x.eventName, () => {
			this.chartInfos = this.createChartInfos(), this.requestUpdate();
		}), h.instance().addEventListener(g.SUSPEND_STATE_CHANGED, this.suspendStateChanged, this), this.model.enable(), this.suspendStateChanged(), this.requestUpdate());
	}
	willHide() {
		super.willHide(), this.model && (h.instance().removeEventListener(g.SUSPEND_STATE_CHANGED, this.suspendStateChanged, this), this.stopPolling(), this.model.disable());
	}
	performUpdate() {
		let e = {
			onMetricChanged: this.onMetricStateChanged.bind(this),
			chartsInfo: this.chartInfos,
			metrics: this.metrics,
			width: this.width,
			height: this.height,
			suspended: this.suspended
		}, t = {
			graphRenderingContext: null,
			width: 0
		};
		this.view(e, t, this.contentElement), this.graphRenderingContext = t.graphRenderingContext, this.width = t.width, this.draw();
	}
	modelAdded(e) {
		e.target() === h.instance().primaryPageTarget() && (this.model = e, this.isShowing() && this.wasShown());
	}
	modelRemoved(e) {
		this.model === e && (this.isShowing() && this.willHide(), this.model = null);
	}
	suspendStateChanged() {
		let e = h.instance().allTargetsSuspended();
		e ? this.stopPolling() : this.startPolling(), this.suspended = e, this.requestUpdate();
	}
	startPolling() {
		this.pollTimer = window.setInterval(() => this.poll(), this.pollIntervalMs), this.onResize();
		let e = () => {
			this.draw(), this.animationId = this.contentElement.window().requestAnimationFrame(() => {
				e();
			});
		};
		e();
	}
	stopPolling() {
		window.clearInterval(this.pollTimer), this.contentElement.window().cancelAnimationFrame(this.animationId), this.metricsBuffer = [];
	}
	async poll() {
		if (!this.model) return;
		let e = await this.model.requestMetrics(), t = e.timestamp, n = e.metrics;
		this.metricsBuffer.push({
			timestamp: t,
			metrics: n
		});
		let r = this.width / this.pixelsPerMs, i = Math.ceil(r / this.pollIntervalMs * 2);
		this.metricsBuffer.length > i * 2 && this.metricsBuffer.splice(0, this.metricsBuffer.length - i), this.metrics = n, this.requestUpdate();
	}
	draw() {
		if (!this.graphRenderingContext) return;
		let e = this.graphRenderingContext;
		e.save(), e.scale(window.devicePixelRatio, window.devicePixelRatio), e.clearRect(0, 0, this.width, this.height), e.save(), e.translate(0, this.scaleHeight);
		for (let t of this.chartInfos) this.activeCharts.has(t.metrics[0].name) && (this.drawChart(e, t, this.graphHeight), e.translate(0, this.graphHeight));
		e.restore(), this.drawHorizontalGrid(e), e.restore();
	}
	drawHorizontalGrid(e) {
		let t = b.instance().getComputedValue("--color-background-inverted-opacity-2");
		e.font = "10px " + s(), e.fillStyle = b.instance().getComputedValue("--color-background-inverted-opacity-50");
		let n = Date.now() / 1e3;
		for (let r = Math.ceil(n);; --r) {
			let i = this.width - ((n - r) * 1e3 - this.pollIntervalMs) * this.pixelsPerMs;
			if (i < -50) break;
			e.beginPath(), e.moveTo(i, 0), e.lineTo(i, this.height), r >= 0 && r % 10 == 0 && e.fillText((/* @__PURE__ */ new Date(r * 1e3)).toLocaleTimeString(), i + 4, 12), e.strokeStyle = r % 10 ? t : this.gridColor, e.stroke();
		}
	}
	drawChart(e, n, r) {
		e.save(), e.rect(0, 0, this.width, r), e.clip();
		let i = this.calcMax(n) * 1.05, a = n.stacked ? /* @__PURE__ */ new Map() : null, o = [];
		for (let e = n.metrics.length - 1; e >= 0; --e) {
			let t = n.metrics[e];
			o.push({
				path: this.buildMetricPath(n, t, r - 8, i, e ? a : null),
				color: t.color
			});
		}
		let c = t(b.instance().getComputedValue("--sys-color-cdt-base-container"))?.asLegacyColor();
		if (c) for (let n of o.reverse()) {
			let r = n.color;
			e.save();
			let i = t(r);
			i && (e.fillStyle = c.blendWith(i.setAlpha(.2).asLegacyColor()).asString() || "", e.fill(n.path), e.strokeStyle = r, e.lineWidth = .5, e.stroke(n.path), e.restore());
		}
		e.fillStyle = b.instance().getComputedValue("--color-background-inverted-opacity-50"), e.font = `10px  ${s()}`, e.fillText(n.title, 8, 10), this.drawVerticalGrid(e, r - 8, i, n), e.restore();
	}
	calcMax(e) {
		if (e.max) return e.max;
		let t = this.width, n = performance.now() - this.pollIntervalMs - t / this.pixelsPerMs, r = -Infinity;
		for (let t of e.metrics) for (let e = this.metricsBuffer.length - 1; e >= 0; --e) {
			let i = this.metricsBuffer[e], a = i.metrics.get(t.name);
			if (a !== void 0 && (r = Math.max(r, a)), i.timestamp < n) break;
		}
		if (!this.metricsBuffer.length) return 10;
		let i = 10 ** Math.floor(Math.log10(r));
		return r = Math.ceil(r / i / 2) * i * 2, e.currentMax = r * .2 + (e.currentMax || r) * .8, e.currentMax;
	}
	drawVerticalGrid(e, t, n, r) {
		let i = 10 ** Math.floor(Math.log10(n)), a = Math.floor(n / i);
		a !== 1 && a % 2 == 1 && (i *= 2);
		let o = Math.floor(n / i) * i, s = n, c = t - 18;
		e.fillStyle = b.instance().getComputedValue("--color-background-inverted-opacity-50"), e.strokeStyle = this.gridColor, e.beginPath();
		for (let t = 0; t < 2; ++t) {
			let t = l(o), n = L(o, r);
			e.moveTo(0, t), e.lineTo(4, t), e.moveTo(e.measureText(n).width + 12, t), e.lineTo(this.width, t), e.fillText(n, 8, l(o) + 3), o /= 2;
		}
		e.stroke(), e.beginPath(), e.moveTo(0, t + .5), e.lineTo(this.width, t + .5), e.strokeStyle = b.instance().getComputedValue("--color-background-inverted-opacity-2"), e.stroke();
		function l(e) {
			return Math.round(t - c * e / s) + .5;
		}
	}
	buildMetricPath(e, t, n, r, i) {
		let a = new Path2D(), o = n - 18;
		if (o < 1) return a;
		let s = r, l = t.name, u = this.pixelsPerMs, d = performance.now() - this.pollIntervalMs - this.width / u, f = e.smooth, p = 0, m = 0, h = 0;
		this.metricsBuffer.length && (p = (this.metricsBuffer[0].timestamp - d) * u, a.moveTo(p, g(0)), a.lineTo(this.width + 5, g(0)), m = g(this.metricsBuffer[this.metricsBuffer.length - 1].metrics.get(l) || 0), h = this.width + 5, a.lineTo(h, m));
		for (let e = this.metricsBuffer.length - 1; e >= 0; --e) {
			let t = this.metricsBuffer[e], n = t.timestamp, r = t.metrics.get(l) || 0;
			i && (r += i.get(n) || 0, r = c(r, 0, 1), i.set(n, r));
			let o = g(r);
			if (p = (n - d) * u, f) {
				let e = (h + p) / 2;
				a.bezierCurveTo(e, m, e, o, p, o);
			} else a.lineTo(p, m), a.lineTo(p, o);
			if (h = p, m = o, n < d) break;
		}
		return a;
		function g(e) {
			return Math.round(n - o * e / s) + .5;
		}
	}
	onResize() {
		super.onResize(), this.recalcChartHeight();
	}
	recalcChartHeight() {
		let e = this.scaleHeight;
		for (let t of this.chartInfos) this.activeCharts.has(t.metrics[0].name) && (e += this.graphHeight);
		this.height = Math.ceil(e * window.devicePixelRatio), this.requestUpdate();
	}
	createChartInfos() {
		let e = b.instance(), t = this.contentElement.firstElementChild, n = {};
		return [
			{
				...n,
				title: E(w.cpuUsage),
				metrics: [
					{
						name: "TaskDuration",
						color: e.getComputedValue("--override-color-perf-monitor-cpu-task-duration", t)
					},
					{
						name: "ScriptDuration",
						color: e.getComputedValue("--override-color-perf-monitor-cpu-script-duration", t)
					},
					{
						name: "LayoutDuration",
						color: e.getComputedValue("--override-color-perf-monitor-cpu-layout-duration", t)
					},
					{
						name: "RecalcStyleDuration",
						color: e.getComputedValue("--override-color-perf-monitor-cpu-recalc-style-duration", t)
					}
				],
				format: "Percent",
				smooth: !0,
				stacked: !0,
				color: e.getComputedValue("--override-color-perf-monitor-cpu", t),
				max: 1
			},
			{
				...n,
				title: E(w.jsHeapSize),
				metrics: [{
					name: "JSHeapTotalSize",
					color: e.getComputedValue("--override-color-perf-monitor-jsheap-total-size", t)
				}, {
					name: "JSHeapUsedSize",
					color: e.getComputedValue("--override-color-perf-monitor-jsheap-used-size", t)
				}],
				format: "Bytes",
				color: e.getComputedValue("--override-color-perf-monitor-jsheap", t)
			},
			{
				...n,
				title: E(w.domNodes),
				metrics: [{
					name: "Nodes",
					color: e.getComputedValue("--override-color-perf-monitor-dom-nodes", t)
				}]
			},
			{
				...n,
				title: E(w.jsEventListeners),
				metrics: [{
					name: "JSEventListeners",
					color: e.getComputedValue("--override-color-perf-monitor-js-event-listeners", t)
				}]
			},
			{
				...n,
				title: E(w.documents),
				metrics: [{
					name: "Documents",
					color: e.getComputedValue("--override-color-perf-monitor-documents", t)
				}]
			},
			{
				...n,
				title: E(w.documentFrames),
				metrics: [{
					name: "Frames",
					color: e.getComputedValue("--override-color-perf-monitor-document-frames", t)
				}]
			},
			{
				...n,
				title: E(w.layoutsSec),
				metrics: [{
					name: "LayoutCount",
					color: e.getComputedValue("--override-color-perf-monitor-layout-count", t)
				}]
			},
			{
				...n,
				title: E(w.styleRecalcsSec),
				metrics: [{
					name: "RecalcStyleCount",
					color: e.getComputedValue("--override-color-perf-monitor-recalc-style-count", t)
				}]
			}
		];
	}
}, M = /* @__PURE__ */ function(e) {
	return e.PERCENT = "Percent", e.BYTES = "Bytes", e;
}({}), N = (e, t, n) => {
	l(u`
    ${e.chartsInfo.map((t) => {
		let n = t.metrics[0].name;
		return R(t, e.enabledCharts.has(n), e.metricValues.get(n) || 0, (t) => e.onCheckboxChange(n, t));
	})}
    `, n, { container: { classes: ["perfmon-control-pane"] } });
}, P = class extends f {
	#e;
	#t;
	#n = null;
	#r = [];
	#i = /* @__PURE__ */ new Map();
	#a;
	constructor(e, t = N) {
		super(e, { useShadowDom: !1 }), this.#a = t, this.#e = a.instance().createSetting("perfmon-active-indicators2", [
			"TaskDuration",
			"JSHeapTotalSize",
			"Nodes"
		]), this.#t = new Set(this.#e.get());
	}
	set chartsInfo(e) {
		this.#r = e, this.requestUpdate();
	}
	set onMetricChanged(e) {
		this.#n = e;
		for (let t of this.#t) e(t, !0);
	}
	performUpdate() {
		let e = {
			chartsInfo: this.#r,
			enabledCharts: this.#t,
			metricValues: this.#i,
			onCheckboxChange: this.#o.bind(this)
		};
		this.#a(e, {}, this.element);
	}
	#o(e, t) {
		this.#s(e, t.target.checked), this.requestUpdate();
	}
	#s(e, t) {
		t ? this.#t.add(e) : this.#t.delete(e), this.#e.set(Array.from(this.#t)), this.#n && this.#n(e, t);
	}
	set metrics(e) {
		if (e) {
			for (let [t, n] of e.entries()) this.#i.set(t, n);
			this.requestUpdate();
		}
	}
}, F, I;
function L(e, t) {
	switch (F || (F = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }), I = new Intl.NumberFormat("en-US", {
		maximumFractionDigits: 1,
		style: "percent"
	})), t.format) {
		case "Percent": return I.format(e);
		case "Bytes": return r(e);
		default: return F.format(e);
	}
}
function R(e, t, n, r) {
	let i = e.color || e.metrics[0].color, a = e.metrics[0].name;
	return u`
      <div class="perfmon-indicator ${t ? "active" : ""}" jslog=${p().track({
		click: !0,
		keydown: "Enter"
	}).context(y(a))}>
        <devtools-checkbox .checked=${t}
            @change=${r} .jslogContext=${a}>${e.title}</devtools-checkbox>
        <div class="perfmon-indicator-value" style="color:${i}">${L(n, e)}</div>
      </div>
    `;
}
var z = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });
//#endregion
export { C as PerformanceMonitor };
