import { n as e } from "./rolldown-runtime-DF993M8W.js";
import { H as t, K as n } from "./common-DMSVbaSb.js";
import { Bc as r, C as i, Hr as a, Md as o, Ti as s, Uc as c, Vr as l, Xr as u, _s as d, df as f, fp as p, hs as m, jd as h, qa as g, vs as _, yi as v } from "./legacy-dM_vujv7.js";
import { a as y, c as b, d as x, f as S, i as C, l as w, n as T, r as E, t as D, u as O } from "./layer_viewer-BFHe_8OF.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/layers/LayerPaintProfilerView.ts
var k = /* @__PURE__ */ e({ LayerPaintProfilerView: () => A }), A = class extends u {
	logTreeView;
	paintProfilerView;
	constructor(e) {
		super(!0, !1), this.element.setAttribute("jslog", `${g("layers.paint-profiler").track({ resize: !0 })}`), this.logTreeView = new T(), this.setSidebarWidget(this.logTreeView), this.paintProfilerView = new E(e), this.setMainWidget(this.paintProfilerView), this.paintProfilerView.addEventListener(D.WINDOW_CHANGED, this.onWindowChanged, this), this.logTreeView.focus();
	}
	reset() {
		this.paintProfilerView.setSnapshotAndLog(null, [], null);
	}
	profile(e) {
		e.commandLog().then((n) => t.call(this, e, n));
		function t(e, t) {
			this.logTreeView.setCommandLog(t || []), this.paintProfilerView.setSnapshotAndLog(e, t || [], null), e && e.release();
		}
	}
	setScale(e) {
		this.paintProfilerView.setScale(e);
	}
	onWindowChanged() {
		this.logTreeView.updateWindow(this.paintProfilerView.selectionWindow());
	}
}, j = /* @__PURE__ */ e({
	AgentLayer: () => F,
	AgentLayerTree: () => P,
	Events: () => N,
	LayerTreeModel: () => M
}), M = class extends f {
	layerTreeAgent;
	paintProfilerModel;
	#e;
	throttler;
	enabled;
	lastPaintRectByLayerId;
	constructor(e) {
		super(e), this.layerTreeAgent = e.layerTreeAgent(), e.registerLayerTreeDispatcher(new I(this)), this.paintProfilerModel = e.model(m);
		let t = e.model(c);
		t && t.addEventListener(r.PrimaryPageChanged, this.onPrimaryPageChanged, this), this.#e = null, this.throttler = new p(20);
	}
	async disable() {
		this.enabled && (this.enabled = !1, await this.layerTreeAgent.invoke_disable());
	}
	enable() {
		this.enabled || (this.enabled = !0, this.forceEnable());
	}
	async forceEnable() {
		this.lastPaintRectByLayerId = /* @__PURE__ */ new Map(), this.#e ||= new P(this), await this.layerTreeAgent.invoke_enable();
	}
	layerTree() {
		return this.#e;
	}
	async layerTreeChanged(e) {
		this.enabled && this.throttler.schedule(this.innerSetLayers.bind(this, e));
	}
	async innerSetLayers(e) {
		let t = this.#e;
		await t.setLayers(e), this.lastPaintRectByLayerId ||= /* @__PURE__ */ new Map();
		for (let e of this.lastPaintRectByLayerId.keys()) {
			let n = this.lastPaintRectByLayerId.get(e), r = t.layerById(e);
			r && r.setLastPaintRect(n);
		}
		this.lastPaintRectByLayerId = /* @__PURE__ */ new Map(), this.dispatchEventToListeners("LayerTreeChanged");
	}
	layerPainted(e, t) {
		if (!this.enabled) return;
		let n = this.#e.layerById(e);
		if (!n) {
			this.lastPaintRectByLayerId ||= /* @__PURE__ */ new Map(), this.lastPaintRectByLayerId.set(e, t);
			return;
		}
		n.didPaint(t), this.dispatchEventToListeners("LayerPainted", n);
	}
	onPrimaryPageChanged() {
		this.#e = null, this.enabled && this.forceEnable();
	}
};
f.register(M, {
	capabilities: o.DOM,
	autostart: !1
});
var N = /* @__PURE__ */ function(e) {
	return e.LayerTreeChanged = "LayerTreeChanged", e.LayerPainted = "LayerPainted", e;
}({}), P = class extends d {
	layerTreeModel;
	constructor(e) {
		super(e.target()), this.layerTreeModel = e;
	}
	async setLayers(e) {
		if (!e) {
			this.#e(e);
			return;
		}
		let t = /* @__PURE__ */ new Set();
		for (let n = 0; n < e.length; ++n) {
			let r = e[n].backendNodeId;
			r && !this.backendNodeIdToNode().has(r) && t.add(r);
		}
		await this.resolveBackendNodeIds(t), this.#e(e);
	}
	#e(e) {
		if (this.setRoot(null), this.setContentRoot(null), !e) return;
		let t, n = this.layersById;
		this.layersById = /* @__PURE__ */ new Map();
		for (let r = 0; r < e.length; ++r) {
			let i = e[r].layerId, a = n.get(i);
			a ? a.reset(e[r]) : a = new F(this.layerTreeModel, e[r]), this.layersById.set(i, a);
			let o = e[r].backendNodeId;
			o && a.setNode(this.backendNodeIdToNode().get(o) || null), !this.contentRoot() && a.drawsContent() && this.setContentRoot(a);
			let s = a.parentId();
			if (s) {
				let e = this.layersById.get(s);
				if (!e) throw Error(`Missing parent ${s} for layer ${i}`);
				e.addChild(a);
			} else t && console.assert(!1, "Multiple root layers"), t = a;
		}
		t && (this.setRoot(t), t.calculateQuad(new WebKitCSSMatrix()));
	}
}, F = class {
	scrollRectsInternal;
	#e;
	#t;
	#n;
	layerPayload;
	layerTreeModel;
	#r;
	#i;
	#a;
	#o;
	constructor(e, t) {
		this.layerTreeModel = e, this.reset(t);
	}
	id() {
		return this.layerPayload.layerId;
	}
	parentId() {
		return this.layerPayload.parentLayerId || null;
	}
	parent() {
		return this.#n;
	}
	isRoot() {
		return !this.parentId();
	}
	children() {
		return this.#t;
	}
	addChild(e) {
		let t = e;
		t.#n && console.assert(!1, "Child already has a parent"), this.#t.push(t), t.#n = this;
	}
	setNode(e) {
		this.#r = e;
	}
	node() {
		return this.#r || null;
	}
	nodeForSelfOrAncestor() {
		let e = this;
		for (; e; e = e.#n) if (e.#r) return e.#r;
		return null;
	}
	offsetX() {
		return this.layerPayload.offsetX;
	}
	offsetY() {
		return this.layerPayload.offsetY;
	}
	width() {
		return this.layerPayload.width;
	}
	height() {
		return this.layerPayload.height;
	}
	transform() {
		return this.layerPayload.transform || null;
	}
	quad() {
		return this.#e;
	}
	anchorPoint() {
		return [
			this.layerPayload.anchorX || 0,
			this.layerPayload.anchorY || 0,
			this.layerPayload.anchorZ || 0
		];
	}
	invisible() {
		return this.layerPayload.invisible || !1;
	}
	paintCount() {
		return this.#a || this.layerPayload.paintCount;
	}
	lastPaintRect() {
		return this.#i || null;
	}
	setLastPaintRect(e) {
		this.#i = e;
	}
	scrollRects() {
		return this.scrollRectsInternal;
	}
	stickyPositionConstraint() {
		return this.#o || null;
	}
	async requestCompositingReasons() {
		return (await this.layerTreeModel.layerTreeAgent.invoke_compositingReasons({ layerId: this.id() })).compositingReasons || [];
	}
	async requestCompositingReasonIds() {
		return (await this.layerTreeModel.layerTreeAgent.invoke_compositingReasons({ layerId: this.id() })).compositingReasonIds || [];
	}
	drawsContent() {
		return this.layerPayload.drawsContent;
	}
	gpuMemoryUsage() {
		return this.drawsContent() ? this.width() * this.height() * 4 : 0;
	}
	snapshots() {
		return [this.layerTreeModel.paintProfilerModel.makeSnapshot(this.id()).then((e) => e ? {
			rect: {
				x: 0,
				y: 0,
				width: this.width(),
				height: this.height()
			},
			snapshot: e
		} : null)];
	}
	didPaint(e) {
		this.#i = e, this.#a = this.paintCount() + 1;
	}
	reset(e) {
		this.#r = null, this.#t = [], this.#n = null, this.#a = 0, this.layerPayload = e, this.scrollRectsInternal = this.layerPayload.scrollRects || [], this.#o = this.layerPayload.stickyPositionConstraint ? new _(this.layerTreeModel.layerTree(), this.layerPayload.stickyPositionConstraint) : null;
	}
	matrixFromArray(e) {
		function t(e) {
			return e.toFixed(9);
		}
		return new WebKitCSSMatrix("matrix3d(" + e.map(t).join(",") + ")");
	}
	calculateTransformToViewport(e) {
		let t = new WebKitCSSMatrix().translate(this.layerPayload.offsetX, this.layerPayload.offsetY);
		if (this.layerPayload.transform) {
			let e = this.matrixFromArray(this.layerPayload.transform), n = new v(this.layerPayload.width * this.anchorPoint()[0], this.layerPayload.height * this.anchorPoint()[1], this.anchorPoint()[2]), r = s(n, t), i = new WebKitCSSMatrix().translate(-r.x, -r.y, -r.z);
			t = i.inverse().multiply(e.multiply(i.multiply(t)));
		}
		return t = e.multiply(t), t;
	}
	createVertexArrayForRect(e, t) {
		return [
			0,
			0,
			0,
			e,
			0,
			0,
			e,
			t,
			0,
			0,
			t,
			0
		];
	}
	calculateQuad(e) {
		let t = this.calculateTransformToViewport(e);
		this.#e = [];
		let n = this.createVertexArrayForRect(this.layerPayload.width, this.layerPayload.height);
		for (let e = 0; e < 4; ++e) {
			let r = s(new v(n[e * 3], n[e * 3 + 1], n[e * 3 + 2]), t);
			this.#e.push(r.x, r.y);
		}
		function r(e) {
			e.calculateQuad(t);
		}
		this.#t.forEach(r);
	}
}, I = class {
	layerTreeModel;
	constructor(e) {
		this.layerTreeModel = e;
	}
	layerTreeDidChange({ layers: e }) {
		this.layerTreeModel.layerTreeChanged(e || null);
	}
	layerPainted({ layerId: e, clip: t }) {
		this.layerTreeModel.layerPainted(e, t);
	}
}, L = /* @__PURE__ */ e({
	DetailsViewTabs: () => U,
	LayersPanel: () => H
}), R = {
	details: "Details",
	profiler: "Profiler"
}, z = n("panels/layers/LayersPanel.ts", R), B = t.bind(void 0, z), V, H = class e extends i {
	model;
	layerViewHost;
	layerTreeOutline;
	rightSplitWidget;
	layers3DView;
	tabbedPane;
	layerDetailsView;
	paintProfilerView;
	updateThrottler;
	layerBeingProfiled;
	constructor() {
		super("layers", 225), this.model = null, h.instance().observeTargets(this, { scoped: !0 }), this.layerViewHost = new S(), this.layerTreeOutline = new w(this.layerViewHost), this.layerTreeOutline.addEventListener(b.PAINT_PROFILER_REQUESTED, this.onPaintProfileRequested, this), this.panelSidebarElement().appendChild(this.layerTreeOutline.element), this.setDefaultFocusedElement(this.layerTreeOutline.element), this.rightSplitWidget = new u(!1, !0, "layer-details-split-view-state"), this.splitWidget().setMainWidget(this.rightSplitWidget), this.splitWidget().hideSidebar(), this.layers3DView = new y(this.layerViewHost), this.rightSplitWidget.setMainWidget(this.layers3DView), this.rightSplitWidget.hideSidebar(), this.layers3DView.addEventListener(C.PAINT_PROFILER_REQUESTED, this.onPaintProfileRequested, this), this.layers3DView.addEventListener(C.SCALE_CHANGED, this.onScaleChanged, this), this.tabbedPane = new a(), this.rightSplitWidget.setSidebarWidget(this.tabbedPane), this.layerDetailsView = new x(this.layerViewHost), this.layerDetailsView.addEventListener(O.PAINT_PROFILER_REQUESTED, this.onPaintProfileRequested, this), this.tabbedPane.appendTab(U.Details, B(R.details), this.layerDetailsView), this.paintProfilerView = new A(this.showImage.bind(this)), this.tabbedPane.addEventListener(l.TabClosed, this.onTabClosed, this), this.updateThrottler = new p(100);
	}
	static instance(t) {
		return (!V || t?.forceNew) && (V = new e()), V;
	}
	focus() {
		this.layerTreeOutline.focus();
	}
	wasShown() {
		super.wasShown(), this.model && this.model.enable();
	}
	willHide() {
		this.model && this.model.disable(), super.willHide();
	}
	targetAdded(e) {
		e === e.outermostTarget() && (this.model = e.model(M), this.model && (this.model.addEventListener(N.LayerTreeChanged, this.onLayerTreeUpdated, this), this.model.addEventListener(N.LayerPainted, this.onLayerPainted, this), this.isShowing() && (this.model.enable(), this.update())));
	}
	targetRemoved(e) {
		this.model && this.model.target() === e && (this.model.removeEventListener(N.LayerTreeChanged, this.onLayerTreeUpdated, this), this.model.removeEventListener(N.LayerPainted, this.onLayerPainted, this), this.model.disable(), this.model = null);
	}
	onLayerTreeUpdated() {
		this.updateThrottler.schedule(this.update.bind(this));
	}
	update() {
		if (this.model) {
			this.splitWidget().showBoth(), this.rightSplitWidget.showBoth(), this.layerViewHost.setLayerTree(this.model.layerTree());
			let e = this.model.target().model(c);
			if (e) {
				let t = e.mainFrame;
				if (t) {
					let e = t.url;
					this.element.setAttribute("test-current-url", e);
				}
			}
		}
	}
	onLayerPainted({ data: e }) {
		if (!this.model) return;
		let t = this.layerViewHost.selection();
		t && t.layer() === e && this.layerDetailsView.update(), this.layers3DView.updateLayerSnapshot(e);
	}
	onPaintProfileRequested({ data: e }) {
		this.layers3DView.snapshotForSelection(e).then((t) => {
			t && (this.layerBeingProfiled = e.layer(), this.tabbedPane.hasTab(U.Profiler) || this.tabbedPane.appendTab(U.Profiler, B(R.profiler), this.paintProfilerView, void 0, !0, !0), this.tabbedPane.selectTab(U.Profiler), this.paintProfilerView.profile(t.snapshot));
		});
	}
	onTabClosed(e) {
		e.data.tabId === U.Profiler && this.layerBeingProfiled && (this.paintProfilerView.reset(), this.layers3DView.showImageForLayer(this.layerBeingProfiled, void 0), this.layerBeingProfiled = null);
	}
	showImage(e) {
		this.layerBeingProfiled && this.layers3DView.showImageForLayer(this.layerBeingProfiled, e);
	}
	onScaleChanged(e) {
		this.paintProfilerView.setScale(e.data);
	}
}, U = {
	Details: "details",
	Profiler: "profiler"
};
//#endregion
export { k as LayerPaintProfilerView, j as LayerTreeModel, L as LayersPanel };
