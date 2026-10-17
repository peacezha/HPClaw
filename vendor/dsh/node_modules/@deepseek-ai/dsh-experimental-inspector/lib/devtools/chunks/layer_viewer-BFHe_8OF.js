import { $ as e, B as t, H as n, J as r, K as i, N as a, Q as o, i as s } from "./common-DMSVbaSb.js";
import { $r as c, Ai as l, Dp as u, Dt as d, Fo as f, Hi as p, In as m, L as h, Mn as g, No as _, Si as v, Ti as y, Xn as b, Zo as x, a as S, bi as ee, br as C, dr as te, ei as ne, fp as re, gs as w, ha as ie, i as T, ii as ae, ki as oe, li as se, ll as ce, ma as le, mo as ue, ni as de, o as fe, qa as pe, sr as me, xa as he, xn as ge, yi as _e } from "./legacy-dM_vujv7.js";
import "./platform-D4TUCh2P.js";
import { N as ve } from "./StringUtilities-CMDxNrEc.js";
import { t as ye } from "./i18n-CTSaUtZW.js";
import { c as be, p as xe, u as Se } from "./perf_ui-B15al1e8.js";
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/layer_viewer/layerDetailsView.css.mjs
var Ce = "/*\n * Copyright 2016 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.layer-details-container:has(.empty-view-scroller) {\n  display: flex;\n}\n\ntable {\n  border-spacing: 0;\n}\n\ntable td {\n  font: var(--sys-typescale-body4-regular);\n  line-height: 18px;\n  padding: var(--sys-size-3) var(--sys-size-5);\n  vertical-align: top;\n}\n\ntable td:first-child {\n  color: var(--sys-color-on-surface-subtle);\n  font: var(--sys-typescale-body5-medium);\n  line-height:  18px;\n  white-space: nowrap;\n}\n\n.scroll-rect.active {\n  background-color: var(--sys-color-neutral-container);\n}\n\nul {\n  list-style: none;\n  padding-inline-start: 0;\n  margin-block: 0;\n}\n\n.devtools-link.link-margin {\n  margin: 8px;\n  display: inline-block;\n}\n", E = { showInternalLayers: "Show internal layers" }, we = i("panels/layer_viewer/LayerViewHost.ts", E), Te = n.bind(void 0, we), D = class {
	typeInternal;
	#e;
	constructor(e, t) {
		this.typeInternal = e, this.#e = t;
	}
	static isEqual(e, t) {
		return e && t ? e.isEqual(t) : e === t;
	}
	type() {
		return this.typeInternal;
	}
	layer() {
		return this.#e;
	}
	isEqual(e) {
		return !1;
	}
}, O = /* @__PURE__ */ function(e) {
	return e.LAYER = "Layer", e.SCROLL_RECT = "ScrollRect", e.SNAPSHOT = "Snapshot", e;
}({}), k = class extends D {
	constructor(e) {
		console.assert(!!e, "LayerSelection with empty layer"), super("Layer", e);
	}
	isEqual(e) {
		return e.typeInternal === "Layer" && e.layer().id() === this.layer().id();
	}
}, A = class extends D {
	scrollRectIndex;
	constructor(e, t) {
		super("ScrollRect", e), this.scrollRectIndex = t;
	}
	isEqual(e) {
		return e.typeInternal === "ScrollRect" && this.layer().id() === e.layer().id() && this.scrollRectIndex === e.scrollRectIndex;
	}
}, Ee = class extends D {
	#e;
	constructor(e, t) {
		super("Snapshot", e), this.#e = t;
	}
	isEqual(e) {
		return e.typeInternal === "Snapshot" && this.layer().id() === e.layer().id() && this.#e === e.#e;
	}
	snapshot() {
		return this.#e;
	}
}, De = class {
	views;
	selectedObject;
	hoveredObject;
	#e;
	snapshotLayers;
	constructor() {
		this.views = [], this.selectedObject = null, this.hoveredObject = null, this.#e = s.instance().createSetting("layers-show-internal-layers", !1), this.snapshotLayers = /* @__PURE__ */ new Map();
	}
	registerView(e) {
		this.views.push(e);
	}
	setLayerSnapshotMap(e) {
		this.snapshotLayers = e;
	}
	getLayerSnapshotMap() {
		return this.snapshotLayers;
	}
	setLayerTree(e) {
		if (!e) return;
		let t = this.selectedObject?.layer();
		t && !e?.layerById(t.id()) && this.selectObject(null);
		let n = this.hoveredObject?.layer();
		n && !e?.layerById(n.id()) && this.hoverObject(null);
		for (let t of this.views) t.setLayerTree(e);
	}
	hoverObject(e) {
		if (D.isEqual(this.hoveredObject, e)) return;
		this.hoveredObject = e;
		let t = e?.layer();
		this.toggleNodeHighlight(t ? t.nodeForSelfOrAncestor() : null);
		for (let t of this.views) t.hoverObject(e);
	}
	selectObject(e) {
		if (!D.isEqual(this.selectedObject, e)) {
			this.selectedObject = e;
			for (let t of this.views) t.selectObject(e);
		}
	}
	selection() {
		return this.selectedObject;
	}
	showContextMenu(e, t) {
		e.defaultSection().appendCheckboxItem(Te(E.showInternalLayers), this.toggleShowInternalLayers.bind(this), {
			checked: this.#e.get(),
			jslogContext: this.#e.name
		});
		let n = t?.layer()?.nodeForSelfOrAncestor();
		n && e.appendApplicableItems(n), e.show();
	}
	showInternalLayersSetting() {
		return this.#e;
	}
	toggleShowInternalLayers() {
		this.#e.set(!this.#e.get());
	}
	toggleNodeHighlight(e) {
		if (e) {
			e.highlightForTwoSeconds();
			return;
		}
		ce.hideDOMNodeHighlight();
	}
}, { html: j, nothing: M } = _, { widget: Oe } = ae, N = {
	selectALayerToSeeItsDetails: "Select a layer to see its details",
	noLayerSelected: "No layer selected",
	scrollRectangleDimensions: "{PH1} {PH2} × {PH3} (at {PH4}, {PH5})",
	unnamed: "<unnamed>",
	stickyAncestorLayersS: "{PH1}: {PH2} ({PH3})",
	stickyBoxRectangleDimensions: "Sticky Box {PH1} × {PH2} (at {PH3}, {PH4})",
	containingBlocRectangleDimensions: "Containing Block {PH1} × {PH2} (at {PH3}, {PH4})",
	nearestLayerShiftingStickyBox: "Nearest Layer Shifting Sticky Box",
	nearestLayerShiftingContaining: "Nearest Layer Shifting Containing Block",
	updateRectangleDimensions: "{PH1} × {PH2} (at {PH3}, {PH4})",
	size: "Size",
	compositingReasons: "Compositing Reasons",
	memoryEstimate: "Memory estimate",
	paintCount: "Paint count",
	slowScrollRegions: "Slow scroll regions",
	stickyPositionConstraint: "Sticky position constraint",
	paintProfiler: "Paint Profiler",
	nonFastScrollable: "Non fast scrollable",
	touchEventHandler: "Touch event handler",
	wheelEventHandler: "Wheel event handler",
	repaintsOnScroll: "Repaints on scroll",
	mainThreadScrollingReason: "Main thread scrolling reason"
}, P = i("panels/layer_viewer/LayerDetailsView.ts", N), F = n.bind(void 0, P), I = t.bind(void 0, P), ke = (e, t, n) => {
	let { layer: i, snapshotSelection: a, compositingReasons: o, onScrollRectClick: s, onPaintProfilerRequested: c } = e;
	if (!i) {
		f(j`<div class="layer-details-container">
      <devtools-widget class="learn-more" ${Oe(h, {
			header: F(N.noLayerSelected),
			text: F(N.selectALayerToSeeItsDetails)
		})}>
      </devtools-widget>
    </div>`, n);
		return;
	}
	let l = i.scrollRects(), u = i.stickyPositionConstraint(), d = (e, t) => {
		if (!t) return "";
		let n = t.nodeForSelfOrAncestor(), r = n ? n.simpleSelector() : F(N.unnamed);
		return F(N.stickyAncestorLayersS, {
			PH1: e,
			PH2: r,
			PH3: t.id()
		});
	};
	f(j`
    <div class="layer-details-container">
      <table>
        <tbody>
          <tr>
            <td>${F(N.size)}</td>
            <td>${F(N.updateRectangleDimensions, {
		PH1: i.width(),
		PH2: i.height(),
		PH3: i.offsetX(),
		PH4: i.offsetY()
	})}</td>
          </tr>
          <tr>
            <td>${F(N.compositingReasons)}</td>
            <td>
              ${o.length ? j`<ul>${o.map((e) => j`<li>${e}</li>`)}</ul>` : "n/a"}
            </td>
          </tr>
          <tr>
            <td>${F(N.memoryEstimate)}</td>
            <td>${r(i.gpuMemoryUsage())}</td>
          </tr>
          <tr>
            <td>${F(N.paintCount)}</td>
            <td>${i.paintCount()}</td>
          </tr>
          <tr>
            <td>${F(N.slowScrollRegions)}</td>
            <td>
              ${l.map((e, t) => j`
                ${t > 0 ? ", " : ""}
                <span class="scroll-rect" @click=${(e) => s(t, e)}
                      jslog=${ie("layers.select-object").track({ click: !0 })}>
                  ${F(N.scrollRectangleDimensions, {
		PH1: String(Me.get(e.type)?.()),
		PH2: e.rect.width,
		PH3: e.rect.height,
		PH4: e.rect.x,
		PH5: e.rect.y
	})}
                </span>`)}
            </td>
          </tr>
          <tr>
            <td>${F(N.stickyPositionConstraint)}</td>
            <td>${((e) => {
		if (!e) return M;
		let t = e.stickyBoxRect(), n = e.containingBlockRect(), r = e.nearestLayerShiftingStickyBox(), i = e.nearestLayerShiftingContainingBlock();
		return j`
      <span>${F(N.stickyBoxRectangleDimensions, {
			PH1: t.width,
			PH2: t.height,
			PH3: t.x,
			PH4: t.y
		})}</span>
      <span>, </span>
      <span>${F(N.containingBlocRectangleDimensions, {
			PH1: n.width,
			PH2: n.height,
			PH3: n.x,
			PH4: n.y
		})}</span>
      ${r ? j`, <span>${d(F(N.nearestLayerShiftingStickyBox), r)}</span>` : M}
      ${i ? j`, <span>${d(F(N.nearestLayerShiftingContaining), i)}</span>` : M}
    `;
	})(u)}</td>
          </tr>
        </tbody>
      </table>
      ${a ? j`
      <button class="devtools-link link-margin text-button link-style"
              @click=${c}
              jslog=${ie("layers.paint-profiler").track({
		click: !0,
		keydown: "Enter"
	})}>
        ${F(N.paintProfiler)}
      </button>` : M}
    </div>`, n, { container: { attributes: { jslog: `${pe("layers-details")}` } } });
}, Ae = class extends e(de) {
	layerViewHost;
	layerSnapshotMap;
	selection;
	compositingReasons = [];
	view;
	constructor(e, t = ke) {
		super({ useShadowDom: "pure" }), this.view = t, this.registerRequiredCSS(Ce), this.layerViewHost = e, this.layerViewHost.registerView(this), this.layerSnapshotMap = this.layerViewHost.getLayerSnapshotMap(), this.selection = null;
	}
	hoverObject(e) {}
	selectObject(e) {
		this.selection = e, this.isShowing() && this.update();
	}
	setLayerTree(e) {}
	wasShown() {
		super.wasShown(), this.update();
	}
	onScrollRectClicked(e, t) {
		t.which === 1 && this.selection && this.layerViewHost.selectObject(new A(this.selection.layer(), e));
	}
	invokeProfilerLink() {
		if (!this.selection) return;
		let e = this.selection.type() === O.SNAPSHOT ? this.selection : this.layerSnapshotMap.get(this.selection.layer());
		e && this.dispatchEventToListeners("PaintProfilerRequested", e);
	}
	update() {
		let e = this.selection?.layer();
		e ? e.requestCompositingReasons().then(this.updateCompositingReasons.bind(this)) : this.compositingReasons = [], this.requestUpdate();
	}
	updateCompositingReasons(e) {
		this.compositingReasons = e, this.requestUpdate();
	}
	performUpdate() {
		let e = this.selection?.layer() || null, t = (this.selection && this.selection.type() === O.SNAPSHOT ? this.selection : e ? this.layerSnapshotMap.get(e) : null) || null;
		this.view({
			layer: e,
			snapshotSelection: t,
			compositingReasons: this.compositingReasons,
			onScrollRectClick: this.onScrollRectClicked.bind(this),
			onPaintProfilerRequested: this.invokeProfilerLink.bind(this)
		}, void 0, this.contentElement);
	}
}, je = /* @__PURE__ */ function(e) {
	return e.PAINT_PROFILER_REQUESTED = "PaintProfilerRequested", e;
}({}), Me = /* @__PURE__ */ new Map([
	[w.ScrollRectType.NON_FAST_SCROLLABLE, I(N.nonFastScrollable)],
	[w.ScrollRectType.TOUCH_EVENT_HANDLER, I(N.touchEventHandler)],
	[w.ScrollRectType.WHEEL_EVENT_HANDLER, I(N.wheelEventHandler)],
	[w.ScrollRectType.REPAINTS_ON_SCROLL, I(N.repaintsOnScroll)],
	[w.ScrollRectType.MAIN_THREAD_SCROLL_REASON, I(N.mainThreadScrollingReason)]
]), Ne = "/*\n * Copyright 2025 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.layer-summary {\n  border-top: 1px solid var(--sys-color-divider);\n  justify-content: space-between;\n  padding: 4px 10px;\n  flex-shrink: 0;\n}\n\n.layer-count {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.layer-tree-wrapper {\n  flex-grow: 1;\n}\n", L = {
	layerCount: "{PH1} layers",
	layersTreePane: "Layers Tree Pane",
	showPaintProfiler: "Show Paint Profiler",
	updateChildDimension: " ({PH1} × {PH2})"
}, Pe = i("panels/layer_viewer/LayerTreeOutline.ts", L), R = n.bind(void 0, Pe), Fe = class extends e(S) {
	layerViewHost;
	treeOutline;
	lastHoveredNode;
	layerCountElement;
	layerMemoryElement;
	element;
	layerTree;
	layerSnapshotMap;
	constructor(e) {
		super(), this.layerViewHost = e, this.layerViewHost.registerView(this), this.treeOutline = new fe(), this.treeOutline.element.classList.add("layer-tree", "overflow-auto"), this.treeOutline.element.addEventListener("mousemove", this.onMouseMove.bind(this), !1), this.treeOutline.element.addEventListener("mouseout", this.onMouseMove.bind(this), !1), this.treeOutline.element.addEventListener("contextmenu", this.onContextMenu.bind(this), !0), d(this.treeOutline.contentElement, R(L.layersTreePane)), this.lastHoveredNode = null;
		let t = document.createElement("div");
		t.classList.add("hbox", "layer-summary"), this.layerCountElement = document.createElement("span"), this.layerCountElement.classList.add("layer-count"), this.layerMemoryElement = document.createElement("span"), t.appendChild(this.layerCountElement), t.appendChild(this.layerMemoryElement);
		let n = document.createElement("div");
		n.classList.add("vbox", "layer-tree-wrapper"), n.appendChild(this.treeOutline.element), n.appendChild(t), this.element = n, se(this.element, Ne), this.layerViewHost.showInternalLayersSetting().addChangeListener(this.update, this);
	}
	focus() {
		this.treeOutline.focus();
	}
	selectObject(e) {
		this.hoverObject(null);
		let t = e?.layer(), n = t && z.get(t);
		n ? n.revealAndSelect(!0) : this.treeOutline.selectedTreeElement && this.treeOutline.selectedTreeElement.deselect();
	}
	hoverObject(e) {
		let t = e?.layer(), n = t && z.get(t);
		n !== this.lastHoveredNode && (this.lastHoveredNode && this.lastHoveredNode.setHovered(!1), n && n.setHovered(!0), this.lastHoveredNode = n);
	}
	setLayerTree(e) {
		this.layerTree = e, this.update();
	}
	update() {
		let e = this.layerViewHost.showInternalLayersSetting().get(), t = /* @__PURE__ */ new Map(), n = null;
		this.layerTree && (e || (n = this.layerTree.contentRoot()), n ||= this.layerTree.root());
		let i = 0, a = 0;
		function o(r) {
			if (!r.drawsContent() && !e) return;
			t.get(r) && console.assert(!1, "Duplicate layer: " + r.id()), t.set(r, !0), i++, a += r.gpuMemoryUsage();
			let o = z.get(r) || null, s = r.parent();
			for (; s && s !== n && !s.drawsContent() && !e;) s = s.parent();
			let c = r === n ? this.treeOutline.rootElement() : s && z.get(s);
			if (!c) {
				console.assert(!1, "Parent is not in the tree");
				return;
			}
			if (!o) o = new Le(this, r), c.appendChild(o), r.drawsContent() || o.expand();
			else {
				if (o.parent !== c) {
					let e = this.treeOutline.selectedTreeElement;
					o.parent && o.parent.removeChild(o), c.appendChild(o), e && e !== this.treeOutline.selectedTreeElement && e.select();
				}
				o.update();
			}
		}
		n && this.layerTree && this.layerTree.forEachLayer(o.bind(this), n);
		let s = this.treeOutline.rootElement();
		for (let e = s.firstChild(); e instanceof Le && !e.root;) if (t.get(e.layer)) e = e.traverseNextTreeElement(!1);
		else {
			let t = e.nextSibling || e.parent;
			e.parent && e.parent.removeChild(e), e === this.lastHoveredNode && (this.lastHoveredNode = null), e = t;
		}
		if (!this.treeOutline.selectedTreeElement && this.layerTree) {
			let e = this.layerTree.contentRoot() || this.layerTree.root();
			if (e) {
				let t = z.get(e);
				t && t.revealAndSelect(!0);
			}
		}
		this.layerCountElement.textContent = R(L.layerCount, { PH1: i }), this.layerMemoryElement.textContent = r(a);
	}
	onMouseMove(e) {
		let t = this.treeOutline.treeElementFromEvent(e);
		t !== this.lastHoveredNode && this.layerViewHost.hoverObject(this.selectionForNode(t));
	}
	selectedNodeChanged(e) {
		this.layerViewHost.selectObject(this.selectionForNode(e));
	}
	onContextMenu(e) {
		let t = this.selectionForNode(this.treeOutline.treeElementFromEvent(e)), n = new C(e), r = t?.layer();
		t && r && (this.layerSnapshotMap = this.layerViewHost.getLayerSnapshotMap(), this.layerSnapshotMap.has(r) && n.defaultSection().appendItem(R(L.showPaintProfiler), () => this.dispatchEventToListeners("PaintProfilerRequested", t), { jslogContext: "layers.paint-profiler" })), this.layerViewHost.showContextMenu(n, t);
	}
	selectionForNode(e) {
		return e?.layer ? new k(e.layer) : null;
	}
}, Ie = /* @__PURE__ */ function(e) {
	return e.PAINT_PROFILER_REQUESTED = "PaintProfilerRequested", e;
}({}), Le = class extends T {
	#e;
	layer;
	constructor(e, t) {
		super(), this.#e = e, this.layer = t, z.set(t, this), this.update();
	}
	update() {
		let e = this.layer.nodeForSelfOrAncestor(), t = document.createDocumentFragment();
		ge(t, e ? e.simpleSelector() : "#" + this.layer.id());
		let n = t.createChild("span", "dimmed");
		n.textContent = R(L.updateChildDimension, {
			PH1: this.layer.width(),
			PH2: this.layer.height()
		}), this.title = t;
	}
	onselect() {
		return this.#e.selectedNodeChanged(this), !1;
	}
	setHovered(e) {
		this.listItemElement.classList.toggle("hovered", e);
	}
}, z = /* @__PURE__ */ new WeakMap(), Re = "/*\n * Copyright 2016 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.layers-3d-view {\n  overflow: hidden;\n  user-select: none;\n\n  > .empty-view-scroller{\n    inset: 0;\n    position: absolute;\n    background-color: var(--sys-color-cdt-base-container);\n  }\n}\n\ndevtools-toolbar {\n  background-color: var(--sys-color-cdt-base-container);\n  border-bottom: 1px solid var(--sys-color-divider);\n}\n\ncanvas {\n  flex: 1 1;\n}\n\n.layers-3d-view > canvas:focus-visible {\n  outline: auto 5px -webkit-focus-ring-color;\n}\n", B = {
	panModeX: "Pan mode (X)",
	rotateModeV: "Rotate mode (V)",
	resetTransform: "Reset transform (0)"
}, ze = i("panels/layer_viewer/TransformController.ts", B), V = n.bind(void 0, ze), H = class extends o {
	mode;
	#e;
	#t;
	#n;
	#r;
	#i;
	oldRotateX;
	oldRotateY;
	originX;
	originY;
	element;
	minScale;
	maxScale;
	controlPanelToolbar;
	modeButtons;
	constructor(e, t, n = !0) {
		if (super(), this.#e = 1, this.#t = 0, this.#n = 0, this.#r = 0, this.#i = 0, this.oldRotateX = 0, this.oldRotateY = 0, this.originX = 0, this.originY = 0, this.element = e, this.registerShortcuts(), g(e, this.onDragStart.bind(this), this.onDrag.bind(this), this.onDragEnd.bind(this), "move", null, 0, n), e.addEventListener("wheel", this.onMouseWheel.bind(this), !1), this.minScale = 0, this.maxScale = Infinity, this.controlPanelToolbar = document.createElement("devtools-toolbar"), this.controlPanelToolbar.classList.add("transform-control-panel"), this.controlPanelToolbar.setAttribute("jslog", `${ue()}`), this.modeButtons = {}, !t) {
			let e = new te(V(B.panModeX), "3d-pan", void 0, "layers.3d-pan", !1);
			e.addEventListener(b.Events.CLICK, this.setMode.bind(this, "Pan")), this.modeButtons.Pan = e, this.controlPanelToolbar.appendToolbarItem(e);
			let t = new te(V(B.rotateModeV), "3d-rotate", void 0, "layers.3d-rotate", !1);
			t.addEventListener(b.Events.CLICK, this.setMode.bind(this, "Rotate")), this.modeButtons.Rotate = t, this.controlPanelToolbar.appendToolbarItem(t);
		}
		this.setMode("Pan");
		let r = new b(V(B.resetTransform), "3d-center", void 0, "layers.3d-center");
		r.addEventListener(b.Events.CLICK, this.resetAndNotify.bind(this, void 0)), this.controlPanelToolbar.appendToolbarItem(r), this.reset();
	}
	toolbar() {
		return this.controlPanelToolbar;
	}
	registerShortcuts() {
		let e = 1.1;
		p.instance().addShortcutListener(this.element, {
			"layers.reset-view": async () => (this.resetAndNotify(), !0),
			"layers.pan-mode": async () => (this.setMode("Pan"), !0),
			"layers.rotate-mode": async () => (this.setMode("Rotate"), !0),
			"layers.zoom-in": this.onKeyboardZoom.bind(this, e),
			"layers.zoom-out": this.onKeyboardZoom.bind(this, 1 / e),
			"layers.up": this.onKeyboardPanOrRotate.bind(this, 0, -1),
			"layers.down": this.onKeyboardPanOrRotate.bind(this, 0, 1),
			"layers.left": this.onKeyboardPanOrRotate.bind(this, -1, 0),
			"layers.right": this.onKeyboardPanOrRotate.bind(this, 1, 0)
		});
	}
	postChangeEvent() {
		this.dispatchEventToListeners("TransformChanged");
	}
	reset() {
		this.#e = 1, this.#t = 0, this.#n = 0, this.#r = 0, this.#i = 0;
	}
	setMode(e) {
		this.mode !== e && (this.mode = e, this.updateModeButtons());
	}
	updateModeButtons() {
		for (let e in this.modeButtons) this.modeButtons[e].setToggled(e === this.mode);
	}
	resetAndNotify(e) {
		this.reset(), this.postChangeEvent(), e && e.preventDefault(), this.element.focus();
	}
	setScaleConstraints(e, t) {
		this.minScale = e, this.maxScale = t, this.#e = u(this.#e, e, t);
	}
	clampOffsets(e, t, n, r) {
		this.#t = u(this.#t, e, t), this.#n = u(this.#n, n, r);
	}
	scale() {
		return this.#e;
	}
	offsetX() {
		return this.#t;
	}
	offsetY() {
		return this.#n;
	}
	rotateX() {
		return this.#r;
	}
	rotateY() {
		return this.#i;
	}
	onScale(e, t, n) {
		e = u(this.#e * e, this.minScale, this.maxScale) / this.#e, this.#e *= e, this.#t -= (t - this.#t) * (e - 1), this.#n -= (n - this.#n) * (e - 1), this.postChangeEvent();
	}
	onPan(e, t) {
		this.#t += e, this.#n += t, this.postChangeEvent();
	}
	onRotate(e, t) {
		this.#r = e, this.#i = t, this.postChangeEvent();
	}
	async onKeyboardZoom(e) {
		return this.onScale(e, this.element.clientWidth / 2, this.element.clientHeight / 2), !0;
	}
	async onKeyboardPanOrRotate(e, t) {
		return this.mode === "Rotate" ? this.onRotate(this.#r + t * 5, this.#i + e * 5) : this.onPan(e * 6, t * 6), !0;
	}
	onMouseWheel(e) {
		let t = e, n = 1.1 ** (-t.deltaY * .018867924528301886);
		this.onScale(n, t.clientX - this.element.getBoundingClientRect().left, t.clientY - this.element.getBoundingClientRect().top);
	}
	onDrag(e) {
		let { clientX: t, clientY: n } = e;
		this.mode === "Rotate" ? this.onRotate(this.oldRotateX + (this.originY - n) / this.element.clientHeight * 180, this.oldRotateY - (this.originX - t) / this.element.clientWidth * 180) : (this.onPan(t - this.originX, n - this.originY), this.originX = t, this.originY = n);
	}
	onDragStart(e) {
		return this.element.focus(), this.originX = e.clientX, this.originY = e.clientY, this.oldRotateX = this.#r, this.oldRotateY = this.#i, !0;
	}
	onDragEnd() {
		this.originX = 0, this.originY = 0, this.oldRotateX = 0, this.oldRotateY = 0;
	}
}, Be = /* @__PURE__ */ function(e) {
	return e.TRANSFORM_CHANGED = "TransformChanged", e;
}({}), { html: U, render: Ve, Directives: { ref: He } } = _, { widget: Ue } = ae, W = {
	noLayerInformation: "No layers detected yet",
	layerExplanation: "On this page you will be able to view and inspect document layers.",
	dLayersView: "3D Layers View",
	cantDisplayLayers: "Can't display layers",
	webglSupportIsDisabledInYour: "WebGL support is disabled in your browser.",
	checkSForPossibleReasons: "Check {PH1} for possible reasons.",
	slowScrollRects: "Slow scroll rects",
	paints: "Paints",
	resetView: "Reset View",
	showPaintProfiler: "Show Paint Profiler"
}, We = i("panels/layer_viewer/Layers3DView.ts", W), G = n.bind(void 0, We), Ge = /* @__PURE__ */ new Map(), Ke = /* @__PURE__ */ new Map(), qe = /* @__PURE__ */ new Map(), Je = /* @__PURE__ */ new Map(), Ye = /* @__PURE__ */ new Map(), K = /* @__PURE__ */ new Map(), Xe = (e, t, n) => {
	Ve(U`<style>
      ${Re}
    </style>
    ${e.panelToolbar}
    ${e.error === "missing-root" ? U`<div>${Ue(h, {
		header: G(W.noLayerInformation),
		text: G(W.layerExplanation)
	})}</div>` : x}
    ${e.error === "webgl-disabled" ? U`<div>${Ue(h, {
		header: G(W.cantDisplayLayers),
		text: G(W.webglSupportIsDisabledInYour),
		extraElements: [ye(We, W.checkSForPossibleReasons, { PH1: le.create("about:gpu", void 0, void 0, "about-gpu") })]
	})}</div>` : x}
    <canvas
      tabindex="0"
      jslog=${he("layers").track({
		click: !0,
		drag: !0
	})}
      aria-label=${G(W.dLayersView)}
      @dblclick=${e.onDoubleClick}
      @mousedown=${e.onMouseDown}
      @mouseup=${e.onMouseUp}
      @mouseleave=${e.onMouseMove}
      @mousemove=${e.onMouseMove}
      @contextmenu=${e.onContextMenu}
      ${He((e) => {
		e && (t.canvasElement = e);
	})}></canvas>`, n, { container: { attributes: { jslog: `${pe("layers-3d-view")}` } } });
}, Ze = class extends e(ne) {
	layerViewHost;
	transformController;
	lastSelection;
	layerTree;
	textureManager;
	chromeTextures;
	rects;
	snapshotLayers;
	shaderProgram;
	oldTextureScale;
	depthByLayerId;
	visibleLayers;
	maxDepth;
	scale;
	layerTexture;
	projectionMatrix;
	whiteTexture;
	gl;
	dimensionsForAutoscale;
	needsUpdate;
	updateScheduled;
	panelToolbar;
	showSlowScrollRectsSetting;
	showPaintsSetting;
	mouseDownX;
	mouseDownY;
	#e;
	#t;
	#n;
	constructor(e, t = Xe) {
		super(), this.#e = t, this.layerViewHost = e, this.layerViewHost.registerView(this), this.transformController = new H(this.contentElement, !1, !1), this.transformController.addEventListener(Be.TRANSFORM_CHANGED, this.updateData, this), this.panelToolbar = this.transformController.toolbar(), this.showPaintsSetting = this.createVisibilitySetting(G(W.paints), "frame-viewer-show-paints", !1, this.panelToolbar), this.showSlowScrollRectsSetting = this.createVisibilitySetting(G(W.slowScrollRects), "frame-viewer-show-slow-scroll-rects", !0, this.panelToolbar), this.showPaintsSetting.addChangeListener(this.updatePaints, this), s.instance().moduleSetting("frame-viewer-chrome-window").addChangeListener(this.updateData, this), this.performUpdate(), this.lastSelection = {}, this.layerTree = null, this.updateScheduled = !1, this.textureManager = new q(this.updateData.bind(this)), this.chromeTextures = [], this.rects = [], this.snapshotLayers = /* @__PURE__ */ new Map(), this.layerViewHost.setLayerSnapshotMap(this.snapshotLayers), this.layerViewHost.showInternalLayersSetting().addChangeListener(this.updateData, this);
	}
	performUpdate() {
		let e = {};
		this.#e({
			panelToolbar: this.panelToolbar,
			onDoubleClick: this.onDoubleClick.bind(this),
			onMouseDown: this.onMouseDown.bind(this),
			onMouseUp: this.onMouseUp.bind(this),
			onMouseMove: this.onMouseMove.bind(this),
			onContextMenu: this.onContextMenu.bind(this),
			error: this.#t
		}, e, this.contentElement), e.canvasElement && (this.#n = e.canvasElement);
	}
	setLayerTree(e) {
		this.layerTree = e, this.layerTexture = null, delete this.oldTextureScale, this.showPaints() && this.textureManager.setLayerTree(e), this.updateData();
	}
	showImageForLayer(e, t) {
		if (!t) {
			this.layerTexture = null, this.updateData();
			return;
		}
		m(t).then((t) => {
			let n = t && q.createTextureForImage(this.gl || null, t);
			this.layerTexture = n ? {
				layer: e,
				texture: n
			} : null, this.updateData();
		});
	}
	onResize() {
		this.performUpdate(), this.resizeCanvas(), this.updateData();
	}
	willHide() {
		super.willHide(), this.textureManager.suspend();
	}
	wasShown() {
		super.wasShown(), this.textureManager.resume(), this.needsUpdate && (this.performUpdate(), this.resizeCanvas(), this.updateData());
	}
	updateLayerSnapshot(e) {
		this.textureManager.layerNeedsUpdate(e);
	}
	setOutline(e, t) {
		this.lastSelection[e] = t, this.updateData();
	}
	hoverObject(e) {
		this.setOutline("hovered", e);
	}
	selectObject(e) {
		this.setOutline("hovered", null), this.setOutline("selected", e);
	}
	snapshotForSelection(e) {
		if (e.type() === O.SNAPSHOT) {
			let t = e.snapshot();
			return t.snapshot.addReference(), Promise.resolve(t);
		}
		if (e.layer()) {
			let t = e.layer().snapshots()[0];
			if (t !== void 0) return t;
		}
		return Promise.resolve(null);
	}
	initGL(e) {
		let t = e.getContext("webgl");
		return t ? (t.blendFunc(t.SRC_ALPHA, t.ONE_MINUS_SRC_ALPHA), t.enable(t.BLEND), t.clearColor(0, 0, 0, 0), t.enable(t.DEPTH_TEST), t) : null;
	}
	createShader(e, t) {
		if (!this.gl) return;
		let n = this.gl.createShader(e);
		n && this.shaderProgram && (this.gl.shaderSource(n, t), this.gl.compileShader(n), this.gl.attachShader(this.shaderProgram, n));
	}
	initShaders() {
		if (!this.gl || (this.shaderProgram = this.gl.createProgram(), !this.shaderProgram)) return;
		this.createShader(this.gl.FRAGMENT_SHADER, $e), this.createShader(this.gl.VERTEX_SHADER, et), this.gl.linkProgram(this.shaderProgram), this.gl.useProgram(this.shaderProgram);
		let e = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
		this.gl.enableVertexAttribArray(e), Ge.set(this.shaderProgram, e);
		let t = this.gl.getAttribLocation(this.shaderProgram, "aVertexColor");
		this.gl.enableVertexAttribArray(t), Ke.set(this.shaderProgram, t);
		let n = this.gl.getAttribLocation(this.shaderProgram, "aTextureCoord");
		this.gl.enableVertexAttribArray(n), qe.set(this.shaderProgram, n);
		let r = this.gl.getUniformLocation(this.shaderProgram, "uPMatrix");
		Je.set(this.shaderProgram, r);
		let i = this.gl.getUniformLocation(this.shaderProgram, "uSampler");
		Ye.set(this.shaderProgram, i);
	}
	resizeCanvas() {
		this.#n.width = this.#n.offsetWidth * window.devicePixelRatio, this.#n.height = this.#n.offsetHeight * window.devicePixelRatio;
	}
	updateTransformAndConstraints() {
		let e = .1, t = this.dimensionsForAutoscale || {
			width: 0,
			height: 0
		}, n = this.layerTree ? this.layerTree.viewportSize() : null, r = n ? n.width : t.width, i = n ? n.height : t.height, a = this.#n.width, o = this.#n.height, s = a * e, c = o * e, l = (a - 2 * s) / r, d = (o - 2 * c) / i, f = Math.min(l, d), p = Math.min(r / t.width, i / t.width) / 2;
		this.transformController.setScaleConstraints(p, 10 / f);
		let m = this.transformController.scale(), h = this.transformController.rotateX(), g = this.transformController.rotateY();
		this.scale = m * f;
		let _ = u(this.scale, .1, 1);
		_ !== this.oldTextureScale && (this.oldTextureScale = _, this.textureManager.setScale(_), this.dispatchEventToListeners("ScaleChanged", _));
		let v = new WebKitCSSMatrix().scale(m, m, m).translate(a / 2, o / 2, 0).rotate(h, g, 0).scale(f, f, f).translate(-r / 2, -i / 2, 0), y;
		for (let e = 0; e < this.rects.length; ++e) y = ee(v, this.rects[e].vertices, y);
		y && this.transformController.clampOffsets((s - y.maxX) / window.devicePixelRatio, (a - s - y.minX) / window.devicePixelRatio, (c - y.maxY) / window.devicePixelRatio, (o - c - y.minY) / window.devicePixelRatio);
		let b = this.transformController.offsetX() * window.devicePixelRatio, x = this.transformController.offsetY() * window.devicePixelRatio;
		this.projectionMatrix = new WebKitCSSMatrix().translate(b, x, 0).multiply(v);
		let S = new WebKitCSSMatrix().scale(1, -1, -1).translate(-1, -1, 0).scale(2 / this.#n.width, 2 / this.#n.height, 1 / 1e6).multiply(this.projectionMatrix);
		if (this.shaderProgram) {
			let e = Je.get(this.shaderProgram);
			this.gl && e && this.gl.uniformMatrix4fv(e, !1, this.arrayFromMatrix(S));
		}
	}
	arrayFromMatrix(e) {
		return new Float32Array([
			e.m11,
			e.m12,
			e.m13,
			e.m14,
			e.m21,
			e.m22,
			e.m23,
			e.m24,
			e.m31,
			e.m32,
			e.m33,
			e.m34,
			e.m41,
			e.m42,
			e.m43,
			e.m44
		]);
	}
	initWhiteTexture() {
		if (!this.gl) return;
		this.whiteTexture = this.gl.createTexture(), this.gl.bindTexture(this.gl.TEXTURE_2D, this.whiteTexture);
		let e = new Uint8Array([
			255,
			255,
			255,
			255
		]);
		this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, e);
	}
	initChromeTextures() {
		function e(e, t) {
			m(t).then((t) => {
				this.chromeTextures[e] = t && q.createTextureForImage(this.gl || null, t) || void 0;
			});
		}
		e.call(this, 0, "Images/chromeLeft.avif"), e.call(this, 1, "Images/chromeMiddle.avif"), e.call(this, 2, "Images/chromeRight.avif");
	}
	initGLIfNecessary() {
		return this.gl && this.gl.canvas === this.#n ? this.gl : (this.gl = this.initGL(this.#n), this.gl ? (this.initShaders(), this.initWhiteTexture(), this.initChromeTextures(), this.textureManager.setContext(this.gl), this.gl) : null);
	}
	calculateDepthsAndVisibility() {
		this.depthByLayerId = /* @__PURE__ */ new Map();
		let e = 0, t = this.layerViewHost.showInternalLayersSetting().get();
		if (!this.layerTree) return;
		let n = t ? this.layerTree.root() : this.layerTree.contentRoot() || this.layerTree.root();
		if (!n) return;
		let r = [n];
		for (this.depthByLayerId.set(n.id(), 0), this.visibleLayers = /* @__PURE__ */ new Set(); r.length > 0;) {
			let n = r.shift();
			if (!n) break;
			(t || n.drawsContent()) && this.visibleLayers.add(n);
			let i = n.children();
			for (let t = 0; t < i.length; ++t) this.depthByLayerId.set(i[t].id(), ++e), r.push(i[t]);
		}
		this.maxDepth = e;
	}
	depthForLayer(e) {
		return (this.depthByLayerId.get(e.id()) || 0) * 20;
	}
	calculateScrollRectDepth(e, t) {
		return this.depthForLayer(e) + t * 4 + 1;
	}
	updateDimensionsForAutoscale(e) {
		this.dimensionsForAutoscale ||= {
			width: 0,
			height: 0
		}, this.dimensionsForAutoscale.width = Math.max(e.width(), this.dimensionsForAutoscale.width), this.dimensionsForAutoscale.height = Math.max(e.height(), this.dimensionsForAutoscale.height);
	}
	calculateLayerRect(e) {
		if (!this.visibleLayers.has(e)) return;
		let t = new J(new k(e));
		t.setVertices(e.quad(), this.depthForLayer(e)), this.appendRect(t), this.updateDimensionsForAutoscale(e);
	}
	appendRect(e) {
		let t = e.relatedObject, n = D.isEqual(this.lastSelection.selected, t), r = D.isEqual(this.lastSelection.hovered, t);
		if (n) e.borderColor = nt;
		else if (r) {
			e.borderColor = tt;
			let t = e.fillColor || [
				255,
				255,
				255,
				1
			], n = ot;
			e.fillColor = [
				t[0] * n[0] / 255,
				t[1] * n[1] / 255,
				t[2] * n[2] / 255,
				t[3] * n[3]
			];
		} else e.borderColor = rt;
		e.lineWidth = n ? 2 : 1, this.rects.push(e);
	}
	calculateLayerScrollRects(e) {
		let t = e.scrollRects();
		for (let n = 0; n < t.length; ++n) {
			let r = new J(new A(e, n));
			r.calculateVerticesFromRect(e, t[n].rect, this.calculateScrollRectDepth(e, n)), r.fillColor = at, this.appendRect(r);
		}
	}
	calculateLayerTileRects(e) {
		let t = this.textureManager.tilesForLayer(e);
		for (let n = 0; n < t.length; ++n) {
			let r = t[n];
			if (!r.texture) continue;
			let i = new Ee(e, {
				rect: r.rect,
				snapshot: r.snapshot
			}), a = new J(i);
			this.snapshotLayers.has(e) || this.snapshotLayers.set(e, i), a.calculateVerticesFromRect(e, r.rect, this.depthForLayer(e) + 1), a.texture = r.texture, this.appendRect(a);
		}
	}
	calculateRects() {
		if (this.rects = [], this.snapshotLayers.clear(), this.dimensionsForAutoscale = {
			width: 0,
			height: 0
		}, this.layerTree && this.layerTree.forEachLayer(this.calculateLayerRect.bind(this)), this.showSlowScrollRectsSetting && this.showSlowScrollRectsSetting.get() && this.layerTree && this.layerTree.forEachLayer(this.calculateLayerScrollRects.bind(this)), this.layerTexture && this.visibleLayers.has(this.layerTexture.layer)) {
			let e = this.layerTexture.layer, t = new J(new k(e));
			t.setVertices(e.quad(), this.depthForLayer(e)), t.texture = this.layerTexture.texture, this.appendRect(t);
		} else this.showPaints() && this.layerTree && this.layerTree.forEachLayer(this.calculateLayerTileRects.bind(this));
	}
	makeColorsArray(e) {
		let t = [], n = [
			e[0] / 255,
			e[1] / 255,
			e[2] / 255,
			e[3]
		];
		for (let e = 0; e < 4; e++) t = t.concat(n);
		return t;
	}
	setVertexAttribute(e, t, n) {
		let r = this.gl;
		if (!r) return;
		let i = r.createBuffer();
		r.bindBuffer(r.ARRAY_BUFFER, i), r.bufferData(r.ARRAY_BUFFER, new Float32Array(t), r.STATIC_DRAW), r.vertexAttribPointer(e, n, r.FLOAT, !1, 0, 0);
	}
	drawRectangle(e, t, n, r) {
		let i = this.gl;
		if (n ||= [
			255,
			255,
			255,
			1
		], !this.shaderProgram) return;
		let a = Ge.get(this.shaderProgram), o = qe.get(this.shaderProgram), s = Ke.get(this.shaderProgram);
		if (a !== void 0 && this.setVertexAttribute(a, e, 3), o !== void 0 && this.setVertexAttribute(o, [
			0,
			1,
			1,
			1,
			1,
			0,
			0,
			0
		], 2), s !== void 0 && this.setVertexAttribute(s, this.makeColorsArray(n), n.length), !i) return;
		let c = Ye.get(this.shaderProgram);
		r ? c && (i.activeTexture(i.TEXTURE0), i.bindTexture(i.TEXTURE_2D, r), i.uniform1i(c, 0)) : this.whiteTexture && i.bindTexture(i.TEXTURE_2D, this.whiteTexture);
		let l = e.length / 3;
		i.drawArrays(t, 0, l);
	}
	drawTexture(e, t, n) {
		this.gl && this.drawRectangle(e, this.gl.TRIANGLE_FAN, n, t);
	}
	drawViewportAndChrome() {
		if (!this.layerTree) return;
		let e = this.layerTree.viewportSize();
		if (!e) return;
		let t = s.instance().moduleSetting("frame-viewer-chrome-window").get() && this.chromeTextures.length >= 3 && this.chromeTextures.indexOf(void 0) < 0, n = (this.maxDepth + 1) * 20, r = Math.ceil(3 * this.scale), i = [
			e.width,
			0,
			n,
			e.width,
			e.height,
			n,
			0,
			e.height,
			n,
			0,
			0,
			n
		];
		if (!this.gl || (this.gl.lineWidth(r), this.drawRectangle(i, t ? this.gl.LINE_STRIP : this.gl.LINE_LOOP, it), !t)) return;
		let a = this.layerTree.viewportSize();
		if (!a) return;
		let o = a.width + 3;
		if (this.chromeTextures[0] && this.chromeTextures[2]) {
			let e = K.get(this.chromeTextures[0]) || {
				naturalHeight: 0,
				naturalWidth: 0
			}, t = e.naturalHeight, r = K.get(this.chromeTextures[2]) || {
				naturalHeight: 0,
				naturalWidth: 0
			}, a = o - e.naturalWidth - r.naturalWidth, s = -1.5, c = -t;
			for (let e = 0; e < this.chromeTextures.length; ++e) {
				let r = this.chromeTextures[e];
				if (!r) continue;
				let l = K.get(r);
				if (!l) continue;
				let u = e === 1 ? a : l.naturalWidth;
				if (u < 0 || s + u > o) break;
				i = [
					s,
					c,
					n,
					s + u,
					c,
					n,
					s + u,
					c + t,
					n,
					s,
					c + t,
					n
				], this.drawTexture(i, this.chromeTextures[e]), s += u;
			}
		}
	}
	drawViewRect(e) {
		if (!this.gl) return;
		let t = e.vertices;
		e.texture ? this.drawTexture(t, e.texture, e.fillColor || void 0) : e.fillColor && this.drawRectangle(t, this.gl.TRIANGLE_FAN, e.fillColor), this.gl.lineWidth(e.lineWidth), e.borderColor && this.drawRectangle(t, this.gl.LINE_LOOP, e.borderColor);
	}
	updateData() {
		if (!this.isShowing()) {
			this.needsUpdate = !0;
			return;
		}
		this.updateScheduled || (this.updateScheduled = !0, requestAnimationFrame(() => requestAnimationFrame(() => {
			this.updateScheduled = !1, this.#r();
		})));
	}
	#r() {
		if (this.performUpdate(), !this.layerTree?.root()) {
			this.#t = "missing-root", this.performUpdate();
			return;
		}
		let e = this.initGLIfNecessary();
		if (!e) {
			this.#t = "webgl-disabled", this.performUpdate();
			return;
		}
		this.#t = void 0;
		let t = this.#n.width, n = this.#n.height;
		this.calculateDepthsAndVisibility(), this.calculateRects(), this.updateTransformAndConstraints(), e.viewport(0, 0, t, n), e.clear(e.COLOR_BUFFER_BIT | e.DEPTH_BUFFER_BIT), this.rects.forEach(this.drawViewRect.bind(this)), this.drawViewportAndChrome();
	}
	selectionFromEventPoint(e) {
		let t = e;
		if (!this.layerTree) return null;
		let n = Infinity, r = null, i = new WebKitCSSMatrix().scale(1, -1, -1).translate(-1, -1, 0).multiply(this.projectionMatrix), a = (t.clientX - this.#n.getBoundingClientRect().left) * window.devicePixelRatio, o = -(t.clientY - this.#n.getBoundingClientRect().top) * window.devicePixelRatio;
		function s(e) {
			if (!e.relatedObject) return;
			let t = e.intersectWithLine(i, a, o);
			t && t < n && (n = t, r = e.relatedObject);
		}
		return this.rects.forEach(s), r;
	}
	createVisibilitySetting(e, t, n, r) {
		let i = s.instance().createSetting(t, n);
		return i.setTitle(e), i.addChangeListener(this.updateData, this), r.appendToolbarItem(new me(i)), i;
	}
	onContextMenu(e) {
		let t = new C(e);
		t.defaultSection().appendItem(G(W.resetView), () => this.transformController.resetAndNotify(), { jslogContext: "layers.3d-center" });
		let n = this.selectionFromEventPoint(e);
		n && n.type() === O.SNAPSHOT && t.defaultSection().appendItem(G(W.showPaintProfiler), () => this.dispatchEventToListeners("PaintProfilerRequested", n), { jslogContext: "layers.paint-profiler" }), this.layerViewHost.showContextMenu(t, n);
	}
	onMouseMove(e) {
		e.which || this.layerViewHost.hoverObject(this.selectionFromEventPoint(e));
	}
	onMouseDown(e) {
		let t = e;
		this.mouseDownX = t.clientX, this.mouseDownY = t.clientY;
	}
	onMouseUp(e) {
		let t = e;
		this.mouseDownX && Math.abs(t.clientX - this.mouseDownX) < 6 && Math.abs(t.clientY - (this.mouseDownY || 0)) < 6 && (this.#n.focus(), this.layerViewHost.selectObject(this.selectionFromEventPoint(e))), delete this.mouseDownX, delete this.mouseDownY;
	}
	onDoubleClick(e) {
		let t = this.selectionFromEventPoint(e);
		t && (t.type() === O.SNAPSHOT || t.layer()) && this.dispatchEventToListeners("PaintProfilerRequested", t), e.stopPropagation();
	}
	updatePaints() {
		this.showPaints() ? (this.textureManager.setLayerTree(this.layerTree), this.textureManager.forceUpdate()) : this.textureManager.reset(), this.updateData();
	}
	showPaints() {
		return this.showPaintsSetting ? this.showPaintsSetting.get() : !1;
	}
}, Qe = /* @__PURE__ */ function(e) {
	return e.PAINT_PROFILER_REQUESTED = "PaintProfilerRequested", e.SCALE_CHANGED = "ScaleChanged", e;
}({}), $e = "precision mediump float;\nvarying vec4 vColor;\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nvoid main(void)\n{\n    gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t)) * vColor;\n}", et = "attribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aVertexColor;\nuniform mat4 uPMatrix;\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nvoid main(void)\n{\ngl_Position = uPMatrix * vec4(aVertexPosition, 1.0);\nvColor = aVertexColor;\nvTextureCoord = aTextureCoord;\n}", tt = [
	0,
	0,
	255,
	1
], nt = [
	0,
	255,
	0,
	1
], rt = [
	0,
	0,
	0,
	1
], it = [
	160,
	160,
	160,
	1
], at = [
	178,
	100,
	100,
	.6
], ot = [
	200,
	200,
	255,
	1
], q = class {
	textureUpdatedCallback;
	throttler;
	scale;
	active;
	queue;
	tilesByLayer;
	gl;
	constructor(e) {
		this.textureUpdatedCallback = e, this.throttler = new re(0), this.scale = 0, this.active = !1, this.reset();
	}
	static createTextureForImage(e, t) {
		if (!e) throw Error("WebGLRenderingContext not provided");
		let n = e.createTexture();
		if (!n) throw Error("Unable to create texture");
		return K.set(n, t), e.bindTexture(e.TEXTURE_2D, n), e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, 1), e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, e.RGBA, e.UNSIGNED_BYTE, t), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE), e.bindTexture(e.TEXTURE_2D, null), n;
	}
	reset() {
		this.tilesByLayer && this.setLayerTree(null), this.tilesByLayer = /* @__PURE__ */ new Map(), this.queue = [];
	}
	setContext(e) {
		this.gl = e, this.scale && this.updateTextures();
	}
	suspend() {
		this.active = !1;
	}
	resume() {
		this.active = !0, this.queue.length && this.update();
	}
	setLayerTree(e) {
		let t = /* @__PURE__ */ new Set(), n = Array.from(this.tilesByLayer.keys());
		e && e.forEachLayer((e) => {
			e.drawsContent() && (t.add(e), this.tilesByLayer.has(e) || (this.tilesByLayer.set(e, []), this.layerNeedsUpdate(e)));
		}), n.length || this.forceUpdate();
		for (let e of n) {
			if (t.has(e)) continue;
			let n = this.tilesByLayer.get(e);
			n && n.forEach((e) => e.dispose()), this.tilesByLayer.delete(e);
		}
	}
	setSnapshotsForLayer(e, t) {
		let n = new Map((this.tilesByLayer.get(e) || []).map((e) => [e.snapshot, e])), r = [], i = [];
		for (let e of t) {
			let t = n.get(e.snapshot);
			t ? (i.push(t), n.delete(e.snapshot)) : r.push(new st(e));
		}
		this.tilesByLayer.set(e, i.concat(r));
		for (let e of n.values()) e.dispose();
		let a = this.gl;
		return !a || !this.scale ? Promise.resolve() : Promise.all(r.map((e) => e.update(a, this.scale))).then(this.textureUpdatedCallback);
	}
	setScale(e) {
		this.scale && this.scale >= e || (this.scale = e, this.updateTextures());
	}
	tilesForLayer(e) {
		return this.tilesByLayer.get(e) || [];
	}
	layerNeedsUpdate(e) {
		this.queue.indexOf(e) < 0 && this.queue.push(e), this.active && this.throttler.schedule(this.update.bind(this));
	}
	forceUpdate() {
		this.queue.forEach((e) => this.updateLayer(e)), this.queue = [], this.update();
	}
	update() {
		let e = this.queue.shift();
		return e ? (this.queue.length && this.throttler.schedule(this.update.bind(this)), this.updateLayer(e)) : Promise.resolve();
	}
	updateLayer(e) {
		return Promise.all(e.snapshots()).then((t) => this.setSnapshotsForLayer(e, t.filter((e) => e !== null)));
	}
	updateTextures() {
		if (this.gl && this.scale) for (let e of this.tilesByLayer.values()) for (let t of e) {
			let e = t.updateScale(this.gl, this.scale);
			e && e.then(this.textureUpdatedCallback);
		}
	}
}, J = class {
	relatedObject;
	lineWidth;
	borderColor;
	fillColor;
	texture;
	vertices;
	constructor(e) {
		this.relatedObject = e, this.lineWidth = 1, this.borderColor = null, this.fillColor = null, this.texture = null;
	}
	setVertices(e, t) {
		this.vertices = [
			e[0],
			e[1],
			t,
			e[2],
			e[3],
			t,
			e[4],
			e[5],
			t,
			e[6],
			e[7],
			t
		];
	}
	calculatePointOnQuad(e, t, n) {
		let r = e[0], i = e[1], a = e[2], o = e[3], s = e[4], c = e[5], l = e[6], u = e[7], d = r + t * (a - r), f = i + t * (o - i), p = l + t * (s - l), m = u + t * (c - u);
		return [d + n * (p - d), f + n * (m - f)];
	}
	calculateVerticesFromRect(e, t, n) {
		let r = e.quad(), i = t.x / e.width(), a = (t.x + t.width) / e.width(), o = t.y / e.height(), s = (t.y + t.height) / e.height(), c = this.calculatePointOnQuad(r, i, o).concat(this.calculatePointOnQuad(r, a, o)).concat(this.calculatePointOnQuad(r, a, s)).concat(this.calculatePointOnQuad(r, i, s));
		this.setVertices(c, n);
	}
	intersectWithLine(e, t, n) {
		let r, i = [];
		for (r = 0; r < 4; ++r) i[r] = y(new _e(this.vertices[r * 3], this.vertices[r * 3 + 1], this.vertices[r * 3 + 2]), e);
		let a = v(l(i[1], i[0]), l(i[2], i[1])), o = a.x, s = a.y, c = a.z, u = -(-(o * i[0].x + s * i[0].y + c * i[0].z) + o * t + s * n) / c, d = new _e(t, n, u), f = i.map(l.bind(null, d));
		for (r = 0; r < f.length; ++r) if (oe(a, v(f[r], f[(r + 1) % f.length])) < 0) return;
		return u;
	}
}, st = class {
	snapshot;
	rect;
	scale;
	texture;
	gl;
	constructor(e) {
		this.snapshot = e.snapshot, this.rect = e.rect, this.scale = 0, this.texture = null;
	}
	dispose() {
		this.snapshot.release(), this.texture &&= (this.gl.deleteTexture(this.texture), null);
	}
	updateScale(e, t) {
		return this.texture && this.scale >= t ? null : this.update(e, t);
	}
	async update(e, t) {
		this.gl = e, this.scale = t;
		let n = await this.snapshot.replay(t), r = n ? await m(n) : null;
		this.texture = r ? q.createTextureForImage(e, r) : null;
	}
}, ct = "/*\n * Copyright 2016 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.paint-profiler-overview {\n  background-color: var(--sys-color-cdt-base-container);\n}\n\n.paint-profiler-canvas-container {\n  flex: auto;\n  position: relative;\n}\n\n.paint-profiler-pie-chart {\n  width: 60px !important; /* stylelint-disable-line declaration-no-important */\n  height: 60px !important; /* stylelint-disable-line declaration-no-important */\n  padding: 2px;\n  overflow: hidden;\n  font-size: 10px;\n}\n\n.paint-profiler-canvas-container canvas {\n  z-index: 200;\n  background-color: var(--sys-color-cdt-base-container);\n  opacity: 95%;\n  height: 100%;\n  width: 100%;\n}\n\n.paint-profiler-canvas-container .overview-grid-window-resizer {\n  z-index: 2000;\n}\n", Y = {
	profiling: "Profiling…",
	shapes: "Shapes",
	bitmap: "Bitmap",
	text: "Text",
	misc: "Misc",
	profilingResults: "Profiling results",
	commandLog: "Command Log"
}, lt = i("panels/layer_viewer/PaintProfilerView.ts", Y), X = n.bind(void 0, lt), Z = null, Q = null, ut = class t extends e(c) {
	canvasContainer;
	progressBanner;
	pieChart;
	showImageCallback;
	canvas;
	context;
	#e;
	innerBarWidth;
	minBarHeight;
	barPaddingWidth;
	outerBarWidth;
	pendingScale;
	scale;
	samplesPerBar;
	log;
	snapshot;
	logCategories;
	profiles;
	updateImageTimer;
	constructor(e) {
		super({ useShadowDom: !0 }), this.registerRequiredCSS(ct), this.contentElement.classList.add("paint-profiler-overview"), this.canvasContainer = this.contentElement.createChild("div", "paint-profiler-canvas-container"), this.progressBanner = this.contentElement.createChild("div", "empty-state hidden"), this.progressBanner.textContent = X(Y.profiling), this.pieChart = new be(), this.populatePieChart(0, []), this.pieChart.classList.add("paint-profiler-pie-chart"), this.contentElement.appendChild(this.pieChart), this.showImageCallback = e, this.canvas = this.canvasContainer.createChild("canvas", "fill"), this.context = this.canvas.getContext("2d"), this.#e = new xe(this.canvasContainer), this.#e.addEventListener(Se.WINDOW_CHANGED, this.onWindowChanged, this), this.innerBarWidth = 4 * window.devicePixelRatio, this.minBarHeight = window.devicePixelRatio, this.barPaddingWidth = 2 * window.devicePixelRatio, this.outerBarWidth = this.innerBarWidth + this.barPaddingWidth, this.pendingScale = 1, this.scale = this.pendingScale, this.samplesPerBar = 0, this.log = [], this.reset();
	}
	static categories() {
		return Z ||= {
			shapes: new $("shapes", X(Y.shapes), "rgb(255, 161, 129)"),
			bitmap: new $("bitmap", X(Y.bitmap), "rgb(136, 196, 255)"),
			text: new $("text", X(Y.text), "rgb(180, 255, 137)"),
			misc: new $("misc", X(Y.misc), "rgb(206, 160, 255)")
		}, Z;
	}
	static initLogItemCategories() {
		if (!Q) {
			let e = t.categories(), n = {};
			n.Clear = e.misc, n.DrawPaint = e.misc, n.DrawData = e.misc, n.SetMatrix = e.misc, n.PushCull = e.misc, n.PopCull = e.misc, n.Translate = e.misc, n.Scale = e.misc, n.Concat = e.misc, n.Restore = e.misc, n.SaveLayer = e.misc, n.Save = e.misc, n.BeginCommentGroup = e.misc, n.AddComment = e.misc, n.EndCommentGroup = e.misc, n.ClipRect = e.misc, n.ClipRRect = e.misc, n.ClipPath = e.misc, n.ClipRegion = e.misc, n.DrawPoints = e.shapes, n.DrawRect = e.shapes, n.DrawOval = e.shapes, n.DrawRRect = e.shapes, n.DrawPath = e.shapes, n.DrawVertices = e.shapes, n.DrawDRRect = e.shapes, n.DrawBitmap = e.bitmap, n.DrawBitmapRectToRect = e.bitmap, n.DrawBitmapMatrix = e.bitmap, n.DrawBitmapNine = e.bitmap, n.DrawSprite = e.bitmap, n.DrawPicture = e.bitmap, n.DrawText = e.text, n.DrawPosText = e.text, n.DrawPosTextH = e.text, n.DrawTextOnPath = e.text, Q = n;
		}
		return Q;
	}
	static categoryForLogItem(e) {
		let n = ve(e.method), r = t.initLogItemCategories(), i = r[n];
		return i || (i = t.categories().misc, r[n] = i), i;
	}
	onResize() {
		this.update();
	}
	async setSnapshotAndLog(e, n, r) {
		if (this.reset(), this.snapshot = e, this.snapshot && this.snapshot.addReference(), this.log = n, this.logCategories = this.log.map(t.categoryForLogItem), !e) {
			this.update(), this.populatePieChart(0, []), this.#e.setResizeEnabled(!1);
			return;
		}
		this.#e.setResizeEnabled(!0), this.progressBanner.classList.remove("hidden"), this.updateImage();
		let i = await e.profile(r);
		this.progressBanner.classList.add("hidden"), this.profiles = i, this.update(), this.updatePieChart();
	}
	setScale(e) {
		let t = e > this.scale;
		this.pendingScale = Math.min(1, e * 2), t && this.snapshot && this.updateImage();
	}
	update() {
		if (this.canvas.width = this.canvasContainer.clientWidth * window.devicePixelRatio, this.canvas.height = this.canvasContainer.clientHeight * window.devicePixelRatio, this.samplesPerBar = 0, !this.profiles?.length || !this.logCategories) return;
		let e = Math.floor((this.canvas.width - 2 * this.barPaddingWidth) / this.outerBarWidth), t = this.log.length;
		this.samplesPerBar = Math.ceil(t / e);
		let n = 0, r = [], i = [], a = {};
		for (let e = 0, o = 0, s = 0; e < t;) {
			let c = this.logCategories[e]?.name || "misc", l = this.log[e].commandIndex;
			for (let e = 0; e < this.profiles.length; e++) {
				let t = this.profiles[e][l];
				s += t, a[c] = (a[c] || 0) + t;
			}
			if (++e, e - o === this.samplesPerBar || e === t) {
				let t = this.profiles.length * (e - o);
				for (c in s /= t, a) a[c] /= t;
				r.push(s), i.push(a), s > n && (n = s), s = 0, a = {}, o = e;
			}
		}
		let o = 4 * window.devicePixelRatio, s = (this.canvas.height - o - this.minBarHeight) / n;
		for (let e = 0; e < r.length; ++e) {
			for (let t in i[e]) i[e][t] *= (r[e] * s + this.minBarHeight) / r[e];
			this.renderBar(e, i[e]);
		}
	}
	renderBar(e, n) {
		let r = t.categories(), i = 0, a = this.barPaddingWidth + e * this.outerBarWidth;
		for (let e in r) {
			if (!n[e]) continue;
			i += n[e];
			let t = this.canvas.height - i;
			this.context.fillStyle = r[e].color, this.context.fillRect(a, t, this.innerBarWidth, n[e]);
		}
	}
	onWindowChanged() {
		this.dispatchEventToListeners("WindowChanged"), this.updatePieChart(), !this.updateImageTimer && (this.updateImageTimer = window.setTimeout(this.updateImage.bind(this), 100));
	}
	updatePieChart() {
		let { total: e, slices: t } = this.calculatePieChart();
		this.populatePieChart(e, t);
	}
	calculatePieChart() {
		let e = this.selectionWindow();
		if (!this.profiles?.length || !e) return {
			total: 0,
			slices: []
		};
		let n = 0, r = {};
		for (let i = e.left; i < e.right; ++i) {
			let e = this.log[i], a = t.categoryForLogItem(e);
			r[a.color] = r[a.color] || 0;
			for (let t = 0; t < this.profiles.length; ++t) {
				let i = this.profiles[t][e.commandIndex];
				n += i, r[a.color] += i;
			}
		}
		let i = [];
		for (let e in r) i.push({
			value: r[e] / this.profiles.length,
			color: e,
			title: ""
		});
		return {
			total: n / this.profiles.length,
			slices: i
		};
	}
	populatePieChart(e, t) {
		this.pieChart.data = {
			chartName: X(Y.profilingResults),
			size: 55,
			formatter: this.formatPieChartTime.bind(this),
			showLegend: !1,
			total: e,
			slices: t
		};
	}
	formatPieChartTime(e) {
		return a(e * 1e3, !0);
	}
	selectionWindow() {
		if (!this.log) return null;
		let e = (this.#e.windowLeftRatio || 0) * this.canvas.width, t = (this.#e.windowRightRatio || 0) * this.canvas.width, n = Math.floor(e / this.outerBarWidth), r = Math.floor((t + this.innerBarWidth - this.barPaddingWidth / 2) / this.outerBarWidth);
		return {
			left: u(n * this.samplesPerBar, 0, this.log.length - 1),
			right: u(r * this.samplesPerBar, 0, this.log.length)
		};
	}
	updateImage() {
		delete this.updateImageTimer;
		let e, t, n = this.selectionWindow();
		this.profiles?.length && n && (e = this.log[n.left].commandIndex, t = this.log[n.right - 1].commandIndex);
		let r = this.pendingScale;
		this.snapshot && this.snapshot.replay(r, e, t).then((e) => {
			e && (this.scale = r, this.showImageCallback(e));
		});
	}
	reset() {
		this.snapshot && this.snapshot.release(), this.snapshot = null, this.profiles = null, this.#e.reset(), this.#e.setResizeEnabled(!1);
	}
}, dt = /* @__PURE__ */ function(e) {
	return e.WINDOW_CHANGED = "WindowChanged", e;
}({}), ft = class extends ne {
	treeOutline;
	log;
	treeItemCache;
	selectionWindow;
	constructor() {
		super(), this.setMinimumSize(100, 25), this.element.classList.add("overflow-auto"), this.treeOutline = new fe(), d(this.treeOutline.contentElement, X(Y.commandLog)), this.element.appendChild(this.treeOutline.element), this.setDefaultFocusedElement(this.treeOutline.contentElement), this.log = [], this.treeItemCache = /* @__PURE__ */ new Map();
	}
	setCommandLog(e) {
		this.log = e, this.updateWindow({
			left: 0,
			right: this.log.length
		});
	}
	appendLogItem(e) {
		let t = this.treeItemCache.get(e);
		if (!t) t = new pt(e), this.treeItemCache.set(e, t);
		else if (t.parent) return;
		this.treeOutline.appendChild(t);
	}
	updateWindow(e) {
		this.selectionWindow = e, this.requestUpdate();
	}
	performUpdate() {
		if (!this.selectionWindow || !this.log.length) return this.treeOutline.removeChildren(), Promise.resolve();
		let e = this.treeOutline.rootElement();
		for (;;) {
			let t = e.firstChild();
			if (!t || t.logItem.commandIndex >= this.selectionWindow.left) break;
			e.removeChildAtIndex(0);
		}
		for (;;) {
			let t = e.lastChild();
			if (!t || t.logItem.commandIndex < this.selectionWindow.right) break;
			e.removeChildAtIndex(e.children().length - 1);
		}
		for (let e = this.selectionWindow.left, t = this.selectionWindow.right; e < t; ++e) this.appendLogItem(this.log[e]);
		return Promise.resolve();
	}
}, pt = class extends T {
	logItem;
	constructor(e) {
		super("", !!e.params), this.logItem = e;
	}
	onattach() {
		this.update();
	}
	async onpopulate() {
		for (let e in this.logItem.params) mt.appendLogPropertyItem(this, e, this.logItem.params[e]);
	}
	paramToString(e, t) {
		if (typeof e != "object") return typeof e == "string" && e.length > 100 ? t : JSON.stringify(e);
		let n = "", r = 0;
		for (let i in e) {
			let a = e[i];
			if (++r > 4 || a === "object" || a === "string" && a.length > 100) return t;
			n && (n += ", "), n += a;
		}
		return n;
	}
	paramsToString(e) {
		let t = "";
		for (let n in e) t && (t += ", "), t += this.paramToString(e[n], n);
		return t;
	}
	update() {
		let e = document.createDocumentFragment();
		ge(e, this.logItem.method + "(" + this.paramsToString(this.logItem.params) + ")"), this.title = e;
	}
}, mt = class e extends T {
	property;
	constructor(e) {
		super(), this.property = e;
	}
	static appendLogPropertyItem(t, n, r) {
		let i = new e({
			name: n,
			value: r
		});
		if (t.appendChild(i), r && typeof r == "object") for (let t in r) e.appendLogPropertyItem(i, t, r[t]);
	}
	onattach() {
		let e = document.createDocumentFragment(), t = e.createChild("span", "name");
		t.textContent = this.property.name;
		let n = e.createChild("span", "separator");
		if (n.textContent = ": ", this.property.value === null || typeof this.property.value != "object") {
			let t = e.createChild("span", "value");
			t.textContent = JSON.stringify(this.property.value), t.classList.add("cm-js-" + (this.property.value === null ? "null" : typeof this.property.value));
		}
		this.title = e;
	}
}, $ = class {
	name;
	title;
	color;
	constructor(e, t, n) {
		this.name = e, this.title = t, this.color = n;
	}
};
//#endregion
export { Ze as a, Ie as c, Ae as d, De as f, Qe as i, Fe as l, ft as n, Be as o, ut as r, H as s, dt as t, je as u };
