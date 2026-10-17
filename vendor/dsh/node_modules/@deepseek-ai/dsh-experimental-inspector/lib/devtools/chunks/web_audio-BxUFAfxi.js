import { n as e } from "./rolldown-runtime-DF993M8W.js";
import { H as t, K as n, W as r } from "./common-DMSVbaSb.js";
import { Bc as i, Fo as a, Ja as o, L as s, Md as c, Po as l, Qt as u, Uc as d, df as f, ei as p, fp as m, ii as h, jd as g, mo as _, vr as v, yr as y } from "./legacy-dM_vujv7.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/web_audio/WebAudioModel.ts
var b = /* @__PURE__ */ e({
	Events: () => S,
	WebAudioModel: () => x
}), x = class extends f {
	enabled;
	agent;
	constructor(e) {
		super(e), this.enabled = !1, this.agent = e.webAudioAgent(), e.registerWebAudioDispatcher(this), g.instance().addModelListener(d, i.FrameNavigated, this.flushContexts, this);
	}
	flushContexts() {
		this.dispatchEventToListeners("ModelReset");
	}
	async suspendModel() {
		this.dispatchEventToListeners("ModelSuspend"), await this.agent.invoke_disable();
	}
	async resumeModel() {
		if (!this.enabled) return await Promise.resolve();
		await this.agent.invoke_enable();
	}
	ensureEnabled() {
		this.enabled ||= (this.agent.invoke_enable(), !0);
	}
	contextCreated({ context: e }) {
		this.dispatchEventToListeners("ContextCreated", e);
	}
	contextWillBeDestroyed({ contextId: e }) {
		this.dispatchEventToListeners("ContextDestroyed", e);
	}
	contextChanged({ context: e }) {
		this.dispatchEventToListeners("ContextChanged", e);
	}
	audioListenerCreated({ listener: e }) {
		this.dispatchEventToListeners("AudioListenerCreated", e);
	}
	audioListenerWillBeDestroyed({ listenerId: e, contextId: t }) {
		this.dispatchEventToListeners("AudioListenerWillBeDestroyed", {
			listenerId: e,
			contextId: t
		});
	}
	audioNodeCreated({ node: e }) {
		this.dispatchEventToListeners("AudioNodeCreated", e);
	}
	audioNodeWillBeDestroyed({ contextId: e, nodeId: t }) {
		this.dispatchEventToListeners("AudioNodeWillBeDestroyed", {
			contextId: e,
			nodeId: t
		});
	}
	audioParamCreated({ param: e }) {
		this.dispatchEventToListeners("AudioParamCreated", e);
	}
	audioParamWillBeDestroyed({ contextId: e, nodeId: t, paramId: n }) {
		this.dispatchEventToListeners("AudioParamWillBeDestroyed", {
			contextId: e,
			nodeId: t,
			paramId: n
		});
	}
	nodesConnected({ contextId: e, sourceId: t, destinationId: n, sourceOutputIndex: r, destinationInputIndex: i }) {
		this.dispatchEventToListeners("NodesConnected", {
			contextId: e,
			sourceId: t,
			destinationId: n,
			sourceOutputIndex: r,
			destinationInputIndex: i
		});
	}
	nodesDisconnected({ contextId: e, sourceId: t, destinationId: n, sourceOutputIndex: r, destinationInputIndex: i }) {
		this.dispatchEventToListeners("NodesDisconnected", {
			contextId: e,
			sourceId: t,
			destinationId: n,
			sourceOutputIndex: r,
			destinationInputIndex: i
		});
	}
	nodeParamConnected({ contextId: e, sourceId: t, destinationId: n, sourceOutputIndex: r }) {
		this.dispatchEventToListeners("NodeParamConnected", {
			contextId: e,
			sourceId: t,
			destinationId: n,
			sourceOutputIndex: r
		});
	}
	nodeParamDisconnected({ contextId: e, sourceId: t, destinationId: n, sourceOutputIndex: r }) {
		this.dispatchEventToListeners("NodeParamDisconnected", {
			contextId: e,
			sourceId: t,
			destinationId: n,
			sourceOutputIndex: r
		});
	}
	async requestRealtimeData(e) {
		return (await this.agent.invoke_getRealtimeData({ contextId: e })).realtimeData;
	}
};
f.register(x, {
	capabilities: c.DOM,
	autostart: !1
});
var S = /* @__PURE__ */ function(e) {
	return e.CONTEXT_CREATED = "ContextCreated", e.CONTEXT_DESTROYED = "ContextDestroyed", e.CONTEXT_CHANGED = "ContextChanged", e.MODEL_RESET = "ModelReset", e.MODEL_SUSPEND = "ModelSuspend", e.AUDIO_LISTENER_CREATED = "AudioListenerCreated", e.AUDIO_LISTENER_WILL_BE_DESTROYED = "AudioListenerWillBeDestroyed", e.AUDIO_NODE_CREATED = "AudioNodeCreated", e.AUDIO_NODE_WILL_BE_DESTROYED = "AudioNodeWillBeDestroyed", e.AUDIO_PARAM_CREATED = "AudioParamCreated", e.AUDIO_PARAM_WILL_BE_DESTROYED = "AudioParamWillBeDestroyed", e.NODES_CONNECTED = "NodesConnected", e.NODES_DISCONNECTED = "NodesDisconnected", e.NODE_PARAM_CONNECTED = "NodeParamConnected", e.NODE_PARAM_DISCONNECTED = "NodeParamDisconnected", e;
}({}), C = "/*\n * Copyright 2019 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  overflow: hidden;\n}\n\n.web-audio-toolbar-container {\n  background-color: var(--sys-color-cdt-base-container);\n  border-bottom: 1px solid var(--sys-color-divider);\n  min-height: fit-content;\n}\n\n.web-audio-landing-page {\n  position: absolute;\n  background-color: var(--sys-color-cdt-base-container);\n  justify-content: center;\n  align-items: center;\n  overflow: auto;\n  font-size: 13px;\n  color: var(--sys-color-on-surface);\n}\n\n.web-audio-landing-page > div {\n  max-width: 500px;\n  margin: 10px;\n}\n\n.web-audio-landing-page > div > p {\n  flex: none;\n  white-space: pre-line;\n}\n\n.web-audio-content-container {\n  overflow-y: auto;\n}\n\n.web-audio-details-container {\n  min-height: fit-content;\n}\n\n.web-audio-summary-container {\n  flex-shrink: 0;\n}\n\n.context-detail-container {\n  flex: none;\n  display: flex;\n  background-color: var(--sys-color-cdt-base-container);\n  flex-direction: column;\n}\n\n.context-detail-header {\n  border-bottom: 1px solid var(--sys-color-divider);\n  padding: var(--sys-size-7) var(--sys-size-9);\n  margin-bottom: var(--sys-size-5);\n}\n\n.context-detail-title {\n  font: var(--sys-typescale-headline4);\n}\n\n.context-detail-subtitle {\n  font: var(--sys-typescale-body4-regular);\n  user-select: text;\n}\n\n.context-detail-row {\n  grid-template-columns: min-content 1fr;\n  display: grid;\n  line-height: 18px;\n  margin: var(--sys-size-3) var(--sys-size-9) var(--sys-size-3) var(--sys-size-9);\n  gap:  var(--sys-size-6);\n}\n\n.context-detail-row-entry:not(:empty) {\n  color: var(--sys-color-on-surface-subtle);\n  overflow: hidden;\n  min-width: 130px;\n  font: var(--sys-typescale-body5-medium);\n}\n\n.context-detail-row-value {\n  user-select: text;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  font: var(--sys-typescale-body4-regular);\n}\n\n.context-summary-container {\n  flex: 0 0 27px;\n  line-height: 27px;\n  padding-left: 5px;\n  background-color: var(--sys-color-cdt-base-container);\n  border-top: 1px solid var(--sys-color-divider);\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  overflow: hidden;\n}\n\n.context-summary-container span {\n  margin-right: 6px;\n}\n", w = /* @__PURE__ */ e({
	DEFAULT_VIEW: () => j,
	WebAudioView: () => M
}), { widget: T } = h, { bindToAction: E } = u, D = {
	noWebAudio: "No Web Audio API usage detected",
	openAPageThatUsesWebAudioApiTo: "Open a page that uses Web Audio API to start monitoring.",
	noRecordings: "(no recordings)",
	audioContextS: "Audio context: {PH1}",
	state: "State",
	sampleRate: "Sample Rate",
	callbackBufferSize: "Callback Buffer Size",
	maxOutputChannels: "Max Output Channels",
	currentTime: "Current Time",
	callbackInterval: "Callback Interval",
	renderCapacity: "Render Capacity"
}, O = n("panels/web_audio/WebAudioView.ts", D), k = t.bind(void 0, O), A = "https://developer.chrome.com/docs/devtools/webaudio", j = (e, t, n) => {
	let { contexts: i, selectedContextIndex: c, onContextSelectorSelectionChanged: u, contextRealtimeData: d } = e, f = c > -1 ? i[c] : null, p = (e) => e.contextType + " (" + e.contextId.substr(-6) + ")", m = k(D.audioContextS, { PH1: f ? p(f) : k(D.noRecordings) });
	a(l`
    <style>${C}</style>
    <div class="web-audio-toolbar-container vbox" role="toolbar">
      <devtools-toolbar class="web-audio-toolbar" role="presentation"
          jslog=${_()}>
        <devtools-button ${E("components.collect-garbage")}></devtools-button>
        <div class="toolbar-divider"></div>
        <select
          title=${m}
          aria-label=${m}
          ?disabled=${i.length === 0}
          @change=${(e) => u(e.target.value)}
          .value=${f ? f.contextId : ""}>
          ${i.length === 0 ? l`<option value="" hidden>${k(D.noRecordings)}</option>` : i.map((e) => l`
            <option value=${e.contextId}>${p(e)}</option>
          `)}
        </select>
      </devtools-toolbar>
    </div>
    <div class="web-audio-content-container vbox flex-auto">
      ${f ? l`<div class="web-audio-details-container vbox flex-auto">
          <div class="context-detail-container">
            <div class="context-detail-header">
              <div class="context-detail-title">
                ${f.contextType === "realtime" ? r("AudioContext") : r("OfflineAudioContext")}
              </div>
              <div class="context-detail-subtitle">${f.contextId}</div>
            </div>
            <div class="context-detail-row">
              <div class="context-detail-row-entry">${k(D.state)}</div>
              <div class="context-detail-row-value">${f.contextState}</div>
            </div>
            <div class="context-detail-row">
              <div class="context-detail-row-entry">${k(D.sampleRate)}</div>
              <div class="context-detail-row-value">${f.sampleRate} Hz</div>
            </div>
            ${f.contextType === "realtime" ? l`
              <div class="context-detail-row">
                <div class="context-detail-row-entry">${k(D.callbackBufferSize)}</div>
                <div class="context-detail-row-value">${f.callbackBufferSize} frames</div>
              </div>` : ""}
            <div class="context-detail-row">
              <div class="context-detail-row-entry">${k(D.maxOutputChannels)}</div>
              <div class="context-detail-row-value">${f.maxOutputChannelCount} ch</div>
            </div>
          </div>
        </div>` : l`
        <div class="web-audio-details-container vbox flex-auto">
          ${T(s, {
		header: k(D.noWebAudio),
		text: k(D.openAPageThatUsesWebAudioApiTo),
		link: A
	})}
        </div>`}
      <div class="web-audio-summary-container">
        ${d ? l`<div class="context-summary-container">
            <span>${k(D.currentTime)}: ${d.currentTime.toFixed(3)} s</span>
            <span>\u2758</span>
            <span>${k(D.callbackInterval)}: μ = ${(d.callbackIntervalMean * 1e3).toFixed(3)} ms, σ = ${(Math.sqrt(d.callbackIntervalVariance) * 1e3).toFixed(3)} ms</span>
            <span>\u2758</span>
            <span>${k(D.renderCapacity)}: ${(d.renderCapacity * 100).toFixed(3)} %</span>
          </div>` : ""}
      </div>
    </div>`, n, { container: { attributes: { jslog: `${o("web-audio").track({ resize: !0 })}` } } });
}, M = class extends p {
	knownContexts = /* @__PURE__ */ new Set();
	contextSelectorItems;
	contextRealtimeData = null;
	view;
	selectedContextIndex = -1;
	pollRealtimeDataThrottler;
	constructor(e, t = j) {
		super({ useShadowDom: "pure" }), this.view = t, this.contextSelectorItems = new y(), this.contextSelectorItems.addEventListener(v.ITEMS_REPLACED, this.requestUpdate, this), g.instance().observeModels(x, this), this.pollRealtimeDataThrottler = new m(1e3), this.performUpdate();
	}
	wasShown() {
		super.wasShown();
		for (let e of g.instance().models(x)) this.addEventListeners(e);
	}
	willHide() {
		super.willHide();
		for (let e of g.instance().models(x)) this.removeEventListeners(e);
	}
	modelAdded(e) {
		this.isShowing() && this.addEventListeners(e);
	}
	modelRemoved(e) {
		this.removeEventListeners(e);
	}
	performUpdate() {
		let e = {
			contexts: [...this.contextSelectorItems],
			selectedContextIndex: this.selectedContextIndex,
			onContextSelectorSelectionChanged: this.onContextSelectorSelectionChanged.bind(this),
			contextRealtimeData: this.contextRealtimeData
		};
		this.view(e, {}, this.contentElement);
	}
	addEventListeners(e) {
		e.ensureEnabled(), e.addEventListener(S.CONTEXT_CREATED, this.contextCreated, this), e.addEventListener(S.CONTEXT_DESTROYED, this.contextDestroyed, this), e.addEventListener(S.CONTEXT_CHANGED, this.contextChanged, this), e.addEventListener(S.MODEL_RESET, this.reset, this);
	}
	removeEventListeners(e) {
		e.removeEventListener(S.CONTEXT_CREATED, this.contextCreated, this), e.removeEventListener(S.CONTEXT_DESTROYED, this.contextDestroyed, this), e.removeEventListener(S.CONTEXT_CHANGED, this.contextChanged, this), e.removeEventListener(S.MODEL_RESET, this.reset, this);
	}
	onContextSelectorSelectionChanged(e) {
		this.selectedContextIndex = this.contextSelectorItems.findIndex((t) => t.contextId === e), this.pollRealtimeDataThrottler.schedule(this.pollRealtimeData.bind(this)), this.requestUpdate();
	}
	contextCreated(e) {
		let t = e.data;
		this.knownContexts.add(t.contextId), this.contextSelectorItems.insert(this.contextSelectorItems.length, t), this.selectedContextIndex === -1 && (this.selectedContextIndex = this.contextSelectorItems.length - 1, this.pollRealtimeDataThrottler.schedule(this.pollRealtimeData.bind(this))), this.requestUpdate();
	}
	contextDestroyed(e) {
		let t = e.data;
		this.knownContexts.delete(t);
		let n = this.contextSelectorItems.findIndex((e) => e.contextId === t);
		if (n > -1) {
			let e = this.selectedContextIndex > -1 ? this.contextSelectorItems.at(this.selectedContextIndex) : null;
			this.contextSelectorItems.remove(n);
			let t = e ? this.contextSelectorItems.indexOf(e) : -1;
			this.selectedContextIndex = t > -1 ? t : Math.min(n, this.contextSelectorItems.length - 1);
		}
		this.requestUpdate();
	}
	contextChanged(e) {
		let t = e.data;
		if (!this.knownContexts.has(t.contextId)) return;
		let n = e.data, r = this.contextSelectorItems.findIndex((e) => e.contextId === n.contextId);
		r > -1 && this.contextSelectorItems.replace(r, n), this.requestUpdate();
	}
	reset() {
		this.contextSelectorItems.replaceAll([]), this.selectedContextIndex = -1, this.knownContexts.clear(), this.requestUpdate();
	}
	setContextRealtimeData(e) {
		this.contextRealtimeData = e, this.requestUpdate();
	}
	async pollRealtimeData() {
		if (this.selectedContextIndex < 0) {
			this.setContextRealtimeData(null);
			return;
		}
		let e = this.contextSelectorItems.at(this.selectedContextIndex);
		if (!e) {
			this.setContextRealtimeData(null);
			return;
		}
		for (let t of g.instance().models(x)) if (e.contextType === "realtime") {
			if (!this.knownContexts.has(e.contextId)) continue;
			let n = await t.requestRealtimeData(e.contextId);
			n && this.setContextRealtimeData(n), this.pollRealtimeDataThrottler.schedule(this.pollRealtimeData.bind(this));
		} else this.setContextRealtimeData(null);
	}
};
//#endregion
export { b as WebAudioModel, w as WebAudioView };
