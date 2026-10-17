import { H as e, K as t, Q as n } from "./common-DMSVbaSb.js";
import { Cl as r, Pd as i, Uc as a, Xf as o, el as s, jd as c, kd as l, ol as u, xl as d } from "./legacy-dM_vujv7.js";
import "./platform-D4TUCh2P.js";
import { n as f } from "./MapUtilities-C6UNTa-e.js";
import { V as p } from "./bindings-DyamxTH2.js";
import { n as m, t as h } from "./emulation-CiDWWSyp.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/live-metrics/web-vitals-injected/spec/spec.ts
var g = "__chromium_devtools_metrics_reporter", _ = "__chromium_devtools_kill_live_metrics", v = {
	lcpEmulationWarning: "Simulating a new device after the page loads can affect LCP. Reload the page after simulating a new device for accurate LCP data.",
	lcpVisibilityWarning: "LCP value may be inflated because the page started loading in the background."
}, y = t("models/live-metrics/LiveMetrics.ts", v), b = e.bind(void 0, y), x = "DevTools Performance Metrics", S, C = class {
	static #e;
	static async get() {
		if (!this.#e) {
			let e = new URL("./web-vitals-injected/web-vitals-injected.generated.js", new URL("models/live-metrics/LiveMetrics.js", typeof document < "u" ? document.baseURI : new URL("../../", self.location.href).href).href), t = await fetch(e);
			this.#e = await t.text();
		}
		return this.#e;
	}
}, w = class e extends n {
	#e = !1;
	#t;
	#n;
	#r;
	#i;
	#a;
	#o;
	#s = /* @__PURE__ */ new Map();
	#c = /* @__PURE__ */ new Map();
	#l = [];
	#u;
	#d = new p();
	#f = h.tryInstance();
	constructor() {
		super();
		let e = c.instance();
		e.observeTargets(this, { scoped: !0 }), e.addEventListener(l.AVAILABLE_TARGETS_CHANGED, this.#p, this);
	}
	#p() {
		let e = c.instance().primaryPageTarget();
		e && e !== this.#t && this.#m(e);
	}
	async #m(e) {
		this.#t && await this.disable(), this.#t = e, await this.enable();
	}
	static instance(t = { forceNew: !1 }) {
		let { forceNew: n } = t;
		return (!S || n) && (S = new e()), S;
	}
	get lcpValue() {
		return this.#i;
	}
	get clsValue() {
		return this.#a;
	}
	get inpValue() {
		return this.#o;
	}
	get interactions() {
		return this.#s;
	}
	get layoutShifts() {
		return this.#l;
	}
	async logInteractionScripts(e) {
		if (!this.#t) return !1;
		let t = this.#r;
		if (!t) return !1;
		let n = [];
		for (let t of e.longAnimationFrameTimings) for (let r of t.scripts) {
			let t = r.startTime + r.duration;
			if (t < e.startTime) continue;
			let i = Math.round(t - Math.max(e.startTime, r.startTime));
			n.push({
				"Blocking duration": i,
				"Invoker type": r.invokerType || null,
				Invoker: r.invoker || null,
				Function: r.sourceFunctionName || null,
				Source: r.sourceURL || null,
				"Char position": r.sourceCharPosition || null
			});
		}
		try {
			let r = n.length === 50 ? " (limited to 50)" : "", i = e.longAnimationFrameTimings.length === 5 ? " (limited to last 5)" : "";
			await this.#t.runtimeAgent().invoke_evaluate({
				expression: `
          console.group('[DevTools] Long animation frames for ${e.duration}ms ${e.interactionType} interaction');
          console.log('Scripts${r}:');
          console.table(${JSON.stringify(n)});
          console.log('Intersecting long animation frame events${i}:', ${JSON.stringify(e.longAnimationFrameTimings)});
          console.groupEnd();
        `,
				contextId: t
			});
		} catch {
			return !1;
		}
		return !0;
	}
	#h() {
		this.#u = Date.now();
	}
	async #g(e, t) {
		if (!this.#t) return null;
		let n = this.#t.model(r);
		if (!n) return null;
		let i = this.#t.model(s);
		if (!i) return null;
		let { result: a } = await this.#t.runtimeAgent().invoke_evaluate({
			expression: `window.getNodeForIndex(${e})`,
			contextId: t
		});
		if (!a) return null;
		let o;
		try {
			return o = n.createRemoteObject(a), await i.pushObjectAsNodeToFrontend(o) || null;
		} catch {
			return null;
		} finally {
			o?.release();
		}
	}
	#_() {
		this.dispatchEventToListeners("status", {
			lcp: this.#i,
			cls: this.#a,
			inp: this.#o,
			interactions: this.#s,
			layoutShifts: this.#l
		});
	}
	setStatusForTesting(e) {
		this.#i = e.lcp, this.#a = e.cls, this.#o = e.inp, this.#s = e.interactions, this.#l = e.layoutShifts, this.#_();
	}
	async #v(e) {
		let t = e.data, n = [
			this.#i?.nodeRef,
			...this.#s.values().map((e) => e.nodeRef),
			...this.#l.flatMap((e) => e.affectedNodeRefs)
		].filter((e) => !!e), r = new Set(n.map((e) => e.backendNodeId())), i = await t.pushNodesByBackendIdsToFrontend(r);
		if (i) {
			for (let e = 0; e < n.length; e++) {
				let t = i.get(n[e].backendNodeId());
				t && (n[e] = t);
			}
			this.#_();
		}
	}
	async #y(e, t) {
		switch (e.name) {
			case "LCP": {
				let n = [], r = {
					value: e.value,
					phases: e.phases,
					warnings: n
				};
				if (e.nodeIndex !== void 0) {
					let n = await this.#g(e.nodeIndex, t);
					n && (r.nodeRef = n);
				}
				this.#u && Date.now() - this.#u < 500 && n.push(b(v.lcpEmulationWarning)), e.startedHidden && n.push(b(v.lcpVisibilityWarning)), this.#i = r;
				break;
			}
			case "CLS": {
				let t = {
					value: e.value,
					clusterShiftIds: e.clusterShiftIds
				};
				this.#a = t;
				break;
			}
			case "INP": {
				let t = {
					value: e.value,
					phases: e.phases,
					interactionId: `interaction-${e.entryGroupId}-${e.startTime}`
				};
				this.#o = t;
				break;
			}
			case "InteractionEntry": {
				let n = f(this.#c, e.entryGroupId, () => []), r = n.find((t) => Math.abs(t.nextPaintTime - e.nextPaintTime) < 8);
				if (r || (r = {
					interactionId: `interaction-${e.entryGroupId}-${e.startTime}`,
					interactionType: e.interactionType,
					duration: e.duration,
					eventNames: [],
					phases: e.phases,
					startTime: e.startTime,
					nextPaintTime: e.nextPaintTime,
					longAnimationFrameTimings: e.longAnimationFrameEntries
				}, n.push(r), this.#s.set(r.interactionId, r)), r.eventNames.includes(e.eventName) || r.eventNames.push(e.eventName), e.nodeIndex !== void 0) {
					let n = await this.#g(e.nodeIndex, t);
					n && (r.nodeRef = n);
				}
				break;
			}
			case "LayoutShift": {
				let n = e.affectedNodeIndices.map((e) => this.#g(e, t)), r = (await Promise.all(n)).filter((e) => !!e), i = {
					score: e.score,
					uniqueLayoutShiftId: e.uniqueLayoutShiftId,
					affectedNodeRefs: r
				};
				this.#l.push(i);
				break;
			}
			case "reset": this.#i = void 0, this.#a = void 0, this.#o = void 0, this.#s.clear(), this.#l = [];
		}
		this.#_();
	}
	#b(e) {
		if (!this.#t) return !1;
		let t = this.#t.model(r)?.executionContext(e);
		if (!t?.frameId) return !1;
		let n = this.#t.model(a)?.mainFrame?.id;
		return !!(n && t.frameId === n);
	}
	async #x(e) {
		let { data: t } = e;
		t.name === "__chromium_devtools_metrics_reporter" && await this.#d.run(async () => {
			let e = JSON.parse(t.payload);
			if (e.name === "reset") {
				if (!this.#b(t.executionContextId)) return;
				this.#r = t.executionContextId;
			}
			this.#r === t.executionContextId && await this.#y(e, t.executionContextId);
		});
	}
	async #S() {
		let e = this.#t;
		if (!e) return;
		let t = e.model(r);
		if (!t) return;
		let n = t.executionContexts().filter((e) => e.name === x && !e.isDefault).map((t) => e.runtimeAgent().invoke_evaluate({
			expression: `window?.${_}?.()`,
			contextId: t.id
		}));
		await Promise.all(n);
	}
	clearInteractions() {
		this.#s.clear(), this.#_();
	}
	clearLayoutShifts() {
		this.#l = [], this.#_();
	}
	async targetAdded(e) {
		e === c.instance().primaryPageTarget() && (this.#t = e, await this.enable());
	}
	async targetRemoved(e) {
		e === this.#t && (await this.disable(), this.#t = void 0);
	}
	async enable() {
		if (o() || !this.#t || this.#e || this.#t.type() !== i.FRAME) return;
		let e = this.#t.model(s);
		if (!e) return;
		e.addEventListener(u.DocumentUpdated, this.#v, this);
		let t = this.#t.model(r);
		if (!t) return;
		t.addEventListener(d.BindingCalled, this.#x, this), await t.addBinding({
			name: g,
			executionContextName: x
		}), await this.#S();
		let n = await C.get();
		if (!this.#t) return;
		let { identifier: a } = await this.#t?.pageAgent().invoke_addScriptToEvaluateOnNewDocument({
			source: n,
			worldName: x,
			runImmediately: !0
		});
		this.#n = a, this.#f?.addEventListener(m.UPDATED, this.#h, this), this.#e = !0;
	}
	async disable() {
		if (!this.#t || !this.#e) return;
		this.#r = void 0, await this.#S();
		let e = this.#t.model(r);
		e && (await e.removeBinding({ name: g }), e.removeEventListener(d.BindingCalled, this.#x, this));
		let t = this.#t.model(s);
		t && t.removeEventListener(u.DocumentUpdated, this.#v, this), this.#n && await this.#t.pageAgent().invoke_removeScriptToEvaluateOnNewDocument({ identifier: this.#n }), this.#n = void 0, this.#f?.removeEventListener(m.UPDATED, this.#h, this), this.#e = !1;
	}
}, T = /* @__PURE__ */ function(e) {
	return e.STATUS = "status", e;
}({});
//#endregion
export { w as n, T as t };
