import { n as e } from "./rolldown-runtime-DF993M8W.js";
import { D as t, Et as n, H as r, K as i, N as a, Zt as o, at as s } from "./common-DMSVbaSb.js";
import { $i as c, Dt as l, Gd as u, Ja as ee, K as d, L as f, La as p, Mn as m, No as h, Qi as te, Xn as g, _a as _, _n as v, br as y, do as ne, ei as re, el as ie, fa as b, ff as x, fo as ae, fp as S, ha as C, jd as w, jr as T, mi as oe, mo as se, ni as ce, nl as E, no as D, ol as le, pf as O, so as k, tt as ue, vc as A, wa as de, xn as fe, yc as j } from "./legacy-dM_vujv7.js";
import "./platform-D4TUCh2P.js";
import { _ as pe } from "./StringUtilities-CMDxNrEc.js";
import { c as me } from "./common-Bs7hSOUj.js";
import { v as he } from "./inline_editor-R0UzNzHT.js";
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/animation/animationTimeline.css.mjs
var ge = "/*\n * Copyright 2015 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  overflow: hidden;\n\n  --timeline-controls-width: 150px;\n}\n\n.toolbar-view-container {\n  min-height: fit-content;\n}\n\n.animation-node-row {\n  width: 100%;\n  display: flex;\n  border-bottom: 1px dashed var(--sys-color-divider);\n}\n\n.animation-node-description {\n  padding-left: 8px;\n  overflow: hidden;\n  position: relative;\n  background-color: var(--sys-color-cdt-base-container);\n  display: flex;\n  flex-direction: column;\n  justify-content: space-around;\n  align-items: flex-start;\n  white-space: nowrap;\n  flex: 0 0 var(--timeline-controls-width);\n  z-index: 1;\n}\n\n.animation-node-description > * {\n  flex: 0 0 auto;\n}\n\n.animation-timeline-row {\n  height: 32px;\n  position: relative;\n}\n\npath.animation-keyframe {\n  /* stylelint-disable-next-line declaration-property-value-no-unknown */\n  fill-opacity: 20%;\n}\n\n.animation-node-selected path.animation-keyframe,\nsvg.animation-ui g:first-child:hover path.animation-keyframe {\n  /* stylelint-disable-next-line declaration-property-value-no-unknown */\n  fill-opacity: 40%;\n}\n\nline.animation-line {\n  stroke-width: 2px;\n  stroke-linecap: round;\n  fill: none;\n}\n\nline.animation-delay-line {\n  stroke-width: 2px;\n  stroke-dasharray: 6, 4;\n}\n\nline.animation-delay-line.animation-fill {\n  stroke-dasharray: none;\n}\n\ncircle.animation-keyframe-point {\n  fill: var(--sys-color-cdt-base-container);\n}\n\ncircle.animation-endpoint,\ncircle.animation-keyframe-point {\n  stroke-width: 2px;\n  transition: transform 100ms cubic-bezier(0, 0, 0.2, 1);\n  transform: scale(1);\n  transform-box: fill-box;\n  transform-origin: 50% 50%;\n}\n\ncircle.animation-endpoint:active,\ncircle.animation-keyframe-point:active {\n  transform: scale(1);\n}\n\n.animation-ui circle.animation-endpoint:hover,\n.animation-ui circle.animation-keyframe-point:hover {\n  transform: scale(1.2);\n}\n\n.animation-name {\n  position: absolute;\n  top: 8px;\n  color: var(--sys-color-on-surface);\n  text-align: center;\n  margin-left: -8px;\n  white-space: nowrap;\n}\n\n.animation-timeline-toolbar-container {\n  display: flex;\n  background-color: var(--sys-color-cdt-base-container);\n  border-bottom: 1px solid var(--sys-color-divider);\n  flex: 0 0 auto;\n}\n\n.animation-timeline-header {\n  height: 28px;\n  border-bottom: 1px solid var(--sys-color-divider);\n  flex-shrink: 0;\n  display: flex;\n}\n\n.animation-timeline-header::after {\n  content: '';\n  height: calc(100% - 48px - 28px);\n  position: absolute;\n  width: var(--timeline-controls-width);\n  left: 0;\n  margin-top: 28px;\n  background-color: var(--sys-color-cdt-base-container);\n  z-index: 0;\n  border-right: 1px solid var(--sys-color-divider);\n}\n\n.animation-controls {\n  flex: 0 0 var(--timeline-controls-width);\n  position: relative;\n  display: flex;\n  justify-content: flex-end;\n  padding-right: 8px;\n}\n\n.animation-timeline-current-time {\n  flex: 0 0 auto;\n  line-height: 28px;\n  margin-right: 5px;\n}\n\n.animation-grid-header {\n  flex: 1 0 auto;\n  z-index: 2;\n}\n\n.animation-grid-header.scrubber-enabled {\n  cursor: pointer;\n}\n\n.animation-timeline-buffer {\n  height: 48px;\n  flex: 0 0 auto;\n  border-bottom: 1px solid var(--sys-color-divider);\n  display: flex;\n  padding: 0 2px;\n}\n\n.animation-timeline-buffer-hint {\n  display: none;\n}\n\n.animation-time-overlay {\n  background-color: var(--sys-color-on-surface);\n  opacity: 5%;\n  position: absolute;\n  height: 100%;\n  width: 100%;\n  z-index: -1;\n}\n\n.animation-timeline-end > .animation-time-overlay {\n  visibility: hidden;\n}\n\n.animation-scrubber {\n  opacity: 100%;\n  position: absolute;\n  left: 10px;\n  height: 100%;\n  width: 100%;\n  top: 28px;\n  border-left: 1px solid var(--sys-color-error);\n  z-index: 2;\n}\n\n.animation-scrubber-line {\n  width: 11px;\n  background: linear-gradient(\n    to right,\n    transparent 5px,\n    var(--sys-color-error) 5px,\n    var(--sys-color-error) 6px,\n    transparent 6px\n  );\n  position: absolute;\n  top: -28px;\n  height: 28px;\n  left: -6px;\n  padding: 0 5px;\n  z-index: 3;\n}\n\n.animation-scrubber-head {\n  width: 7px;\n  height: 7px;\n  transform: rotate(45deg);\n  background: var(--sys-color-error);\n  position: absolute;\n  left: 2px;\n  top: 1px;\n  z-index: 4;\n}\n\n.grid-overflow-wrapper {\n  position: absolute;\n  left: calc(var(--timeline-controls-width) - 10px);\n  top: 76px;\n  z-index: 1;\n  overflow: hidden;\n  width: 100%;\n  height: 100%;\n}\n\nsvg.animation-timeline-grid {\n  position: absolute;\n  inset: 0;\n  width: 100%;\n  height: 100%;\n}\n\nrect.animation-timeline-grid-line {\n  fill: var(--sys-color-divider);\n}\n\n.animation-timeline-row > svg.animation-ui {\n  position: absolute;\n}\n\n.animation-node-timeline {\n  flex-grow: 1;\n}\n\n.animation-node-description > div {\n  position: absolute;\n  top: 50%;\n  transform: translateY(-50%);\n  max-height: 100%;\n}\n\n.animation-node-removed {\n  filter: saturate(0);\n  cursor: not-allowed;\n}\n\n.animation-node-removed-overlay {\n  width: 100%;\n  height: 100%;\n  z-index: 100;\n  cursor: not-allowed;\n}\n\nsvg.animation-ui g:first-child {\n  opacity: 100%;\n}\n\nsvg.animation-ui circle:focus-visible,\nsvg.animation-ui path:focus-visible {\n  outline: 2px solid -webkit-focus-ring-color;\n}\n\n.animation-tail-iterations {\n  opacity: 50%;\n}\n\n.animation-keyframe-step line {\n  stroke-width: 2;\n  stroke-opacity: 30%;\n}\n\ntext.animation-timeline-grid-label {\n  font-size: 10px;\n  fill: var(--sys-color-token-subtle);\n  text-anchor: middle;\n}\n\n.animation-timeline-rows,\n.animation-timeline-rows-hint,\n.animation-timeline-buffer-hint {\n  flex-grow: 1;\n  overflow: hidden auto;\n  z-index: 1;\n}\n\n.animation-timeline-rows-hint {\n  display: none;\n}\n\n.animation-timeline-buffer:not(:empty) ~ .animation-timeline-rows:empty {\n  flex-grow: 0;\n}\n\n.animation-timeline-rows:empty {\n  display: none;\n}\n\n.animation-timeline-buffer:not(:empty)\n  ~ .animation-timeline-rows:empty\n  ~ .animation-timeline-buffer-hint:not(:empty)\n  ~ .animation-timeline-rows-hint,\n.animation-timeline-buffer:empty ~ .animation-timeline-buffer-hint {\n  font-size: 14px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin-left: var(--timeline-controls-width);\n  padding: 10px;\n}\n\n.animation-controls-toolbar {\n  flex: 0 0 auto;\n}\n\n.animation-node-row.animation-node-selected {\n  background-color: var(--sys-color-state-ripple-primary);\n}\n\n.animation-node-selected > .animation-node-description {\n  background-color: var(--sys-color-tonal-container);\n}\n\n.animation-buffer-preview {\n  height: 40px;\n  margin: 4px 2px;\n  background-color: var(--sys-color-neutral-container);\n  border: 1px solid transparent;\n  border-radius: 2px;\n  flex: 1 1;\n  padding: 4px;\n  max-width: 100px;\n  animation: newGroupAnim 200ms;\n  position: relative;\n}\n\n.animation-buffer-preview.no-animation {\n  animation: none;\n}\n\n.animation-buffer-preview .preview-icon {\n  position: absolute;\n  width: 14px;\n  height: 14px;\n  right: 1px;\n  bottom: 2px;\n  opacity: 60%;\n}\n\n.animation-buffer-preview-animation {\n  width: 100%;\n  height: 100%;\n  border-radius: 2px 0 0 2px;\n  position: absolute;\n  top: 0;\n  left: 0;\n  background: var(--sys-color-tonal-container);\n  opacity: 0%;\n  border-right: 1px solid var(--sys-color-divider);\n}\n\n.animation-buffer-preview:focus-visible {\n  outline: -webkit-focus-ring-color auto 5px;\n}\n\n.animation-buffer-preview.selected .preview-icon {\n  opacity: 100%;\n}\n\n.animation-buffer-preview:not(.selected):focus-visible,\n.animation-buffer-preview:not(.selected):hover {\n  background-color: var(--sys-color-surface-variant);\n\n  & .preview-icon {\n    opacity: 80%;\n  }\n}\n\n.animation-buffer-preview.selected {\n  background-color: var(--sys-color-tonal-container);\n}\n\n.animation-paused {\n  align-items: center;\n  justify-content: center;\n  display: none;\n}\n\n.animation-paused::before,\n.animation-paused::after {\n  content: '';\n  background: var(--sys-color-cdt-base-container);\n  width: 7px;\n  height: 20px;\n  border-radius: 2px;\n  margin: 2px;\n  border: 1px solid var(--sys-color-divider);\n}\n\n.animation-buffer-preview.paused .animation-paused {\n  display: flex;\n}\n\n.animation-buffer-preview > svg > line {\n  stroke-width: 1px;\n}\n\n.animation-buffer-preview.selected > svg > line {\n  stroke: var(\n    --sys-color-on-tonal-container\n  ) !important; /* stylelint-disable-line declaration-no-important */\n}\n\n@keyframes newGroupAnim {\n  from {\n    clip-path: polygon(0% 0%, 0% 100%, 50% 100%, 50% 0%);\n  }\n\n  to {\n    clip-path: polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%);\n  }\n}\n\n.animation-playback-rate-control {\n  margin: 4px 0 4px 2px;\n  display: flex;\n  width: 120px;\n}\n\n.animation-playback-rate-button {\n  border-width: 1px;\n  border-style: solid;\n  border-color: var(--sys-color-tonal-outline);\n  border-right-width: 0;\n  color: var(--sys-color-on-surface);\n  display: inline-block;\n  margin-right: -1px;\n  padding: 1px 4px;\n  background-color: transparent;\n  flex: 1 0 auto;\n  text-align: center;\n}\n\n.animation-playback-rate-button:first-child {\n  border-radius: 4px 0 0 4px;\n}\n\n.animation-playback-rate-button:last-child {\n  border-radius: 0 4px 4px 0;\n  border-right-width: 1px;\n}\n\n.animation-playback-rate-button.selected {\n  color: var(--sys-color-on-tonal-container);\n  background-color: var(--sys-color-tonal-container);\n  border-color: var(--sys-color-tonal-container);\n  z-index: 1;\n}\n\n.animation-playback-rate-button.selected:focus-visible {\n  color: var(--sys-color-on-surface);\n}\n\n.animation-playback-rate-button:focus-visible {\n  outline: 2px solid var(--sys-color-primary);\n  outline-offset: 2px;\n  z-index: 9999;\n}\n\n.animation-playback-rate-button:not(.selected, [disabled]):hover {\n  background: var(--sys-color-state-hover-on-subtle);\n}\n\n.animation-playback-rate-button[disabled] {\n  background: unset;\n  border-color: var(--sys-color-state-disabled);\n  color: var(--sys-color-state-disabled);\n}\n\n.animation-remove-button {\n  position: absolute;\n  top: -3px;\n  right: -3px;\n  background: var(--sys-color-token-subtle);\n  border-radius: 12px;\n  border: 0;\n  height: 16px;\n  width: 16px;\n  z-index: 100;\n  display: none;\n  padding: 0;\n\n  & > devtools-icon {\n    height: 16px;\n    width: 16px;\n    color: var(--sys-color-cdt-base-container);\n  }\n\n  &:hover {\n    background-color: var(--sys-color-on-surface);\n  }\n}\n\n.animation-group-preview-ui {\n  position: relative;\n}\n\n.animation-group-preview-ui:hover .animation-remove-button {\n  display: flex;\n}\n\n.timeline-controls-resizer {\n  position: absolute;\n  width: 6px;\n  height: 100%;\n  left: var(--timeline-controls-width);\n  top: 104px;\n  z-index: 3;\n  /* We put this a bit to the left of the line to allow dragging\n  the delay point of the keyframes */\n  margin-left: -4px;\n}\n\n@media (forced-colors: active) {\n  .animation-playback-rate-button.selected,\n  .animation-playback-rate-button.selected:first-child,\n  .animation-playback-rate-button.selected:first-child:focus-visible,\n  .animation-playback-rate-button:focus-visible {\n    forced-color-adjust: none;\n    color: HighlightText;\n    background-color: Highlight;\n  }\n\n  .animation-node-description:focus-visible {\n    background-color: var(--sys-color-cdt-base-container);\n    forced-color-adjust: none;\n  }\n\n  .monospace {\n    forced-color-adjust: auto;\n  }\n}\n", _e = /* @__PURE__ */ e({
	AnimationGroupRevealer: () => we,
	AnimationTimeline: () => B,
	GlobalPlaybackRates: () => V,
	NodeUI: () => H,
	StepTimingFunction: () => U
}), M = {
	noEffectSelected: "No animation effect selected",
	selectAnEffectAboveToInspectAnd: "Select an effect above to inspect and modify",
	clearAll: "Clear all",
	pauseAll: "Pause all",
	playbackRates: "Playback rates",
	playbackRatePlaceholder: "{PH1}%",
	pause: "Pause",
	setSpeedToS: "Set speed to {PH1}",
	animationPreviews: "Animation previews",
	waitingForAnimations: "Currently waiting for animations",
	animationDescription: "On this page you can inspect and modify animations.",
	replayTimeline: "Replay timeline",
	resumeAll: "Resume all",
	playTimeline: "Play timeline",
	pauseTimeline: "Pause timeline",
	animationPreviewS: "Animation Preview {PH1}"
}, N = i("panels/animation/AnimationTimeline.ts", M), P = r.bind(void 0, N), { render: F, html: I, Directives: { classMap: ve } } = h, L = /* @__PURE__ */ new WeakMap(), ye = 120, be = 150, xe = 720, Se = "https://developer.chrome.com/docs/devtools/css/animations", Ce = (e, t, n) => {
	F(I`
    <div class="animation-timeline-toolbar-container" role="toolbar" jslog=${se()}>
      <devtools-toolbar class="animation-timeline-toolbar" role="presentation">
        <devtools-button
          title=${P(M.clearAll)}
          aria-label=${P(M.clearAll)}
          .iconName=${"clear"}
          .jslogContext=${"animations.clear"}
          .variant=${c.TOOLBAR}
          @click=${e.onClearClick}>
        </devtools-button>
        <div class="toolbar-divider"></div>
        <devtools-button
          title=${P(M.pauseAll)}
          aria-label=${P(M.pauseAll)}
          jslog=${ae().track({ click: !0 }).context("animations.pause-resume-all")}
          .iconName=${"pause"}
          .toggledIconName=${"resume"}
          .variant=${c.ICON_TOGGLE}
          .toggleType=${te.PRIMARY}
          .toggled=${e.allPaused}
          @click=${e.onTogglePauseAllClick}>
        </devtools-button>
      </devtools-toolbar>
      ${(() => {
		let t = (e, t) => {
			let r = e, i = Number(r.dataset.playbackRate);
			if (Number.isNaN(i)) return;
			let a = V.indexOf(i), o = t ? a - 1 : a + 1;
			if (o < 0 || o >= V.length) return;
			let s = V[o], c = n.querySelector(`[data-playback-rate="${s}"]`);
			c && (r.tabIndex = -1, c.tabIndex = 0, c.focus());
		};
		return I`
      <div class="animation-playback-rate-control" role="listbox" aria-label=${P(M.playbackRates)} @keydown=${(e) => {
			switch (e.key) {
				case "ArrowLeft":
				case "ArrowUp":
					t(e.target, !0);
					break;
				case "ArrowRight":
				case "ArrowDown": t(e.target);
			}
		}}>
        ${V.map((t) => {
			let n = e.selectedPlaybackRate === t, r = t ? P(M.playbackRatePlaceholder, { PH1: t * 100 }) : P(M.pause);
			return I`
            <button jslog=${C().context(`animations.playback-rate-${t * 100}`).track({
				click: !0,
				keydown: "ArrowUp|ArrowDown|ArrowLeft|ArrowRight"
			})}
            data-playback-rate=${t}
            .disabled=${e.playbackRateButtonsDisabled}
            class=${ve({
				"animation-playback-rate-button": !0,
				selected: n
			})}
            tabindex=${n ? 0 : -1}
            role="option"
            title=${P(M.setSpeedToS, { PH1: r })}
            @click=${() => e.onSetPlaybackRateClick(t)}>
            ${r}
          </button>
          `;
		})}
      </div>
    `;
	})()}
    </div>
  `, n, { host: n });
}, R = 100, z, B = class e extends re {
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
	#d;
	#f;
	#p;
	#m;
	#h;
	#g;
	#_;
	#v;
	#y;
	#b;
	#x;
	#S;
	#C;
	#w;
	#T;
	#E;
	#D;
	#O;
	#k;
	#A;
	#j;
	#M;
	#N = new S(10);
	#P = new S(10);
	#F;
	#I;
	#L = !1;
	constructor(e = Ce) {
		super({
			jslog: `${ee("animations").track({ resize: !0 })}`,
			useShadowDom: !0
		}), this.registerRequiredCSS(ge), this.#I = e, this.element.classList.add("animations-timeline"), this.#k = this.contentElement.createChild("div", "timeline-controls-resizer"), this.#e = this.contentElement.createChild("div", "grid-overflow-wrapper"), this.#t = v(this.#e, "svg", "animation-timeline-grid"), this.#n = 1, this.#r = !1, this.#D = !1, this.#F = this.contentElement.createChild("div", "toolbar-view-container"), this.createHeader(), this.#i = this.contentElement.createChild("div", "animation-timeline-rows"), this.#i.setAttribute("jslog", `${D("animations")}`);
		let t = this.contentElement.createChild("div", "animation-timeline-buffer-hint"), n = new f(P(M.waitingForAnimations), P(M.animationDescription));
		n.link = Se, n.show(t);
		let r = this.contentElement.createChild("div", "animation-timeline-rows-hint");
		new f(P(M.noEffectSelected), P(M.selectAnEffectAboveToInspectAnd)).show(r), this.#d = R, this.#p = /* @__PURE__ */ new Map(), this.#m = [], this.#h = [], this.#M = [], this.#g = /* @__PURE__ */ new Map(), this.#_ = /* @__PURE__ */ new Map(), this.#f = be, this.element.style.setProperty("--timeline-controls-width", `${this.#f}px`), w.instance().addModelListener(ie, le.NodeRemoved, (e) => this.markNodeAsRemoved(e.data.node), this, { scoped: !0 }), w.instance().observeModels(A, this, { scoped: !0 }), b.instance().addFlavorChangeListener(E, this.nodeChanged, this), this.#R(), this.performToolbarViewUpdate();
	}
	static instance(t) {
		return (!z || t?.forceNew) && (z = new e()), z;
	}
	#R() {
		let e;
		m(this.#k, (t) => (e = t.clientX, !0), (t) => {
			if (e === void 0) return;
			let n = this.#f + t.clientX - e;
			this.#f = Math.min(Math.max(n, ye), xe), e = t.clientX, this.element.style.setProperty("--timeline-controls-width", this.#f + "px"), this.onResize();
		}, () => {
			e = void 0;
		}, "ew-resize");
	}
	get previewMap() {
		return this.#g;
	}
	get uiAnimations() {
		return this.#m;
	}
	get groupBuffer() {
		return this.#h;
	}
	wasShown() {
		super.wasShown();
		for (let e of w.instance().models(A, { scoped: !0 })) this.#z(e), this.addEventListeners(e);
	}
	willHide() {
		super.willHide();
		for (let e of w.instance().models(A, { scoped: !0 })) this.removeEventListeners(e);
	}
	#z(e) {
		for (let t of e.animationGroups.values()) this.#g.has(t) || this.addAnimationGroup(t);
	}
	#B() {
		T.instance().moveView("animations", "drawer-view", {
			shouldSelectTab: !0,
			overrideSaving: !0
		});
	}
	async revealAnimationGroup(e) {
		return this.#g.has(e) || await this.addAnimationGroup(e), this.#B(), await this.selectAnimationGroup(e);
	}
	modelAdded(e) {
		this.isShowing() && this.addEventListeners(e);
	}
	modelRemoved(e) {
		this.removeEventListeners(e);
	}
	addEventListeners(e) {
		e.addEventListener(j.AnimationGroupStarted, this.animationGroupStarted, this), e.addEventListener(j.AnimationGroupUpdated, this.animationGroupUpdated, this), e.addEventListener(j.ModelReset, this.reset, this);
	}
	removeEventListeners(e) {
		e.removeEventListener(j.AnimationGroupStarted, this.animationGroupStarted, this), e.removeEventListener(j.AnimationGroupUpdated, this.animationGroupUpdated, this), e.removeEventListener(j.ModelReset, this.reset, this);
	}
	nodeChanged() {
		for (let e of this.#p.values()) e.nodeChanged();
	}
	createScrubber() {
		return this.#o = document.createElement("div"), this.#o.classList.add("animation-scrubber"), this.#o.classList.add("hidden"), this.#v = this.#o.createChild("div", "animation-scrubber-line"), this.#v.createChild("div", "animation-scrubber-head"), this.#o.createChild("div", "animation-time-overlay"), this.#o;
	}
	performToolbarViewUpdate() {
		this.#I({
			selectedPlaybackRate: this.#n,
			playbackRateButtonsDisabled: this.#L,
			allPaused: this.#r,
			onClearClick: () => {
				x.actionTaken(O.AnimationGroupsCleared), this.reset();
			},
			onTogglePauseAllClick: () => {
				this.#r = !this.#r, x.actionTaken(this.#r ? O.AnimationsPaused : O.AnimationsResumed), this.setPlaybackRate(this.#n), this.#y && this.#y.setTitle(this.#r ? P(M.resumeAll) : P(M.pauseAll));
			},
			onSetPlaybackRateClick: (e) => {
				this.setPlaybackRate(e);
			}
		}, void 0, this.#F);
	}
	createHeader() {
		this.#a = this.contentElement.createChild("div", "animation-timeline-buffer"), this.#a.setAttribute("jslog", `${D("film-strip")}`), ue(this.#a), l(this.#a, P(M.animationPreviews));
		let e = this.contentElement.createChild("div", "animation-timeline-header"), t = e.createChild("div", "animation-controls");
		this.#s = t.createChild("div", "animation-timeline-current-time monospace");
		let n = t.createChild("devtools-toolbar", "animation-controls-toolbar");
		return this.#b = new g(P(M.replayTimeline), "replay", void 0, "animations.play-replay-pause-animation-group"), this.#b.element.classList.add("toolbar-state-on"), this.#x = "replay-outline", this.#b.addEventListener(g.Events.CLICK, this.controlButtonToggle.bind(this)), n.appendToolbarItem(this.#b), this.#A = e.createChild("div", "animation-grid-header"), this.#A.setAttribute("jslog", `${ne("animations.grid-header").track({
			drag: !0,
			click: !0
		})}`), m(this.#A, this.scrubberDragStart.bind(this), this.scrubberDragMove.bind(this), this.scrubberDragEnd.bind(this), null), this.#e.appendChild(this.createScrubber()), this.clearCurrentTimeText(), e;
	}
	setPlaybackRate(e) {
		this.#n = e;
		for (let e of w.instance().models(A, { scoped: !0 })) e.setPlaybackRate(this.#r ? 0 : this.#n);
		x.actionTaken(O.AnimationsPlaybackRateChanged), this.#w && (this.#w.playbackRate = this.effectivePlaybackRate()), this.performToolbarViewUpdate();
	}
	controlButtonToggle() {
		this.#x === "play-outline" ? this.togglePause(!1) : this.#x === "replay-outline" ? (x.actionTaken(O.AnimationGroupReplayed), this.replay()) : this.togglePause(!0);
	}
	updateControlButton() {
		this.#b && (this.#b.setEnabled(!!this.#l && this.hasAnimationGroupActiveNodes() && !this.#l?.isScrollDriven()), this.#l && this.#l.paused() ? (this.#x = "play-outline", this.#b.element.classList.toggle("toolbar-state-on", !0), this.#b.setTitle(P(M.playTimeline)), this.#b.setGlyph("play")) : !this.#w || !this.#w.currentTime || typeof this.#w.currentTime != "number" || this.#w.currentTime >= this.duration() ? (this.#x = "replay-outline", this.#b.element.classList.toggle("toolbar-state-on", !0), this.#b.setTitle(P(M.replayTimeline)), this.#b.setGlyph("replay")) : (this.#x = "pause-outline", this.#b.element.classList.toggle("toolbar-state-on", !1), this.#b.setTitle(P(M.pauseTimeline)), this.#b.setGlyph("pause")));
	}
	effectivePlaybackRate() {
		return this.#r || this.#l && this.#l.paused() ? 0 : this.#n;
	}
	togglePause(e) {
		if (this.#l) {
			this.#l.togglePause(e);
			let t = this.#g.get(this.#l);
			t && t.setPaused(e);
		}
		this.#w && (this.#w.playbackRate = this.effectivePlaybackRate()), this.updateControlButton();
	}
	replay() {
		this.#l && this.hasAnimationGroupActiveNodes() && !this.#l.isScrollDriven() && (this.#l.seekTo(0), this.animateTime(0), this.updateControlButton());
	}
	duration() {
		return this.#d;
	}
	setDuration(e) {
		this.#d = e, this.scheduleRedraw();
	}
	clearTimeline() {
		this.#l && this.#j && this.#l.scrollNode().then((e) => {
			e?.removeScrollEventListener(this.#j), this.#j = void 0;
		}), this.#m = [], this.#p.clear(), this.#_.clear(), this.#i.removeChildren(), this.#d = R, this.#o.classList.add("hidden"), this.#A.classList.remove("scrubber-enabled"), this.#l = null, this.#w && this.#w.cancel(), this.#w = void 0, this.clearCurrentTimeText(), this.updateControlButton();
	}
	reset() {
		this.clearTimeline(), this.setPlaybackRate(this.#n);
		for (let e of this.#h) e.release();
		this.#h = [], this.clearPreviews(), this.renderGrid();
	}
	animationGroupStarted({ data: e }) {
		this.addAnimationGroup(e);
	}
	scheduledRedrawAfterAnimationGroupUpdatedForTest() {}
	animationGroupUpdated({ data: e }) {
		this.#P.schedule(async () => {
			let t = this.#g.get(e);
			if (t && t.replay(), this.#l === e) {
				if (e.isScrollDriven()) {
					let t = await e.scrollNode();
					if (t) {
						let n = e.scrollOrientation() === u.ScrollOrientation.Vertical ? await t.verticalScrollRange() : await t.horizontalScrollRange(), r = e.scrollOrientation() === u.ScrollOrientation.Vertical ? await t.scrollTop() : await t.scrollLeft();
						n !== null && this.setDuration(n), r !== null && (this.setCurrentTimeText(r), this.setTimelineScrubberPosition(r));
					}
				} else this.setDuration(e.finiteDuration());
				this.updateControlButton(), this.scheduleRedraw(), this.scheduledRedrawAfterAnimationGroupUpdatedForTest();
			}
		});
	}
	clearPreviews() {
		this.#g.clear(), this.#a.removeChildren();
	}
	createPreview(e) {
		let t = new $({
			animationGroup: e,
			label: P(M.animationPreviewS, { PH1: this.#h.length + 1 }),
			onRemoveAnimationGroup: () => {
				this.removeAnimationGroup(e);
			},
			onSelectAnimationGroup: () => {
				this.selectAnimationGroup(e);
			},
			onFocusNextGroup: () => {
				this.focusNextGroup(e);
			},
			onFocusPreviousGroup: () => {
				this.focusNextGroup(e, !0);
			}
		}), n = document.createElement("div");
		if (n.classList.add("preview-ui-container"), t.markAsRoot(), t.show(n), this.#h.push(e), this.#g.set(e, t), this.#a.appendChild(n), this.#g.size === 1) {
			let e = this.#g.get(this.#h[0]);
			e && e.setFocusable(!0);
		}
	}
	previewsCreatedForTest() {}
	scrubberOnFinishForTest() {}
	createPreviewForCollectedGroups() {
		this.#M.sort((e, t) => e.isScrollDriven() && !t.isScrollDriven() ? -1 : !e.isScrollDriven() && t.isScrollDriven() ? 1 : e.startTime() === t.startTime() ? e.animations.length - t.animations.length : e.startTime() - t.startTime());
		for (let e of this.#M) this.createPreview(e);
		this.#M = [], this.previewsCreatedForTest();
	}
	addAnimationGroup(e) {
		let t = this.#g.get(e);
		if (t) return this.#l === e ? this.syncScrubber() : t.replay(), Promise.resolve();
		this.#h.sort((e, t) => e.startTime() - t.startTime());
		let n = [], r = this.width() / 50;
		for (; this.#h.length > r;) {
			let e = this.#h.splice(+(this.#h[0] === this.#l), 1);
			n.push(e[0]);
		}
		for (let e of n) {
			let t = this.#g.get(e);
			t && (t.detach(), this.#g.delete(e), e.release());
		}
		return this.#M.push(e), this.#N.schedule(() => Promise.resolve(this.createPreviewForCollectedGroups()));
	}
	focusNextGroup(e, t) {
		let n = this.#h.indexOf(e), r = t ? n - 1 : n + 1;
		if (r < 0 || r >= this.#h.length) return;
		let i = this.#g.get(this.#h[r]);
		i && (i.setFocusable(!0), i.focus());
		let a = this.#g.get(e);
		a && a.setFocusable(!1);
	}
	removeAnimationGroup(e) {
		let t = this.#h.indexOf(e);
		o(this.#h, e);
		let n = this.#g.get(e);
		if (n && n.detach(), this.#g.delete(e), e.release(), this.#l === e && (this.clearTimeline(), this.renderGrid()), this.#h.length === 0) {
			this.#c.element.focus();
			return;
		}
		let r = t >= this.#h.length ? this.#g.get(this.#h[this.#h.length - 1]) : this.#g.get(this.#h[t]);
		r && (r.setFocusable(!0), r.focus());
	}
	clearCurrentTimeText() {
		this.#s.textContent = "";
	}
	setCurrentTimeText(e) {
		this.#l && (this.#s.textContent = this.#l?.isScrollDriven() ? `${e.toFixed(0)}px` : a(e));
	}
	async selectAnimationGroup(e) {
		if (this.#l === e) {
			this.togglePause(!1), this.replay();
			return;
		}
		if (this.clearTimeline(), this.#l = e, this.#g.forEach((e, t) => {
			e.setSelected(this.#l === t);
		}), e.isScrollDriven()) {
			let t = await e.scrollNode();
			if (!t) throw Error("Scroll container is not found for the scroll driven animation");
			let n = e.scrollOrientation() === u.ScrollOrientation.Vertical ? await t.verticalScrollRange() : await t.horizontalScrollRange(), r = e.scrollOrientation() === u.ScrollOrientation.Vertical ? await t.scrollTop() : await t.scrollLeft();
			if (typeof n != "number" || typeof r != "number") throw Error("Scroll range or scroll offset is not resolved for the scroll driven animation");
			this.#j = await t.addScrollEventListener(({ scrollTop: t, scrollLeft: n }) => {
				let r = e.scrollOrientation() === u.ScrollOrientation.Vertical ? t : n;
				this.setCurrentTimeText(r), this.setTimelineScrubberPosition(r);
			}), this.setDuration(n), this.setCurrentTimeText(r), this.setTimelineScrubberPosition(r), this.#y && this.#y.setEnabled(!1), this.#L = !0, this.performToolbarViewUpdate();
		} else this.setDuration(e.finiteDuration()), this.#y && this.#y.setEnabled(!0), this.#L = !1, this.performToolbarViewUpdate();
		await Promise.all(e.animations().map((e) => this.addAnimation(e))), this.scheduleRedraw(), this.togglePause(!1), this.replay(), this.hasAnimationGroupActiveNodes() && (this.#o.classList.remove("hidden"), this.#A.classList.add("scrubber-enabled")), x.actionTaken(O.AnimationGroupSelected), this.#l.isScrollDriven() && x.actionTaken(O.ScrollDrivenAnimationGroupSelected), this.animationGroupSelectedForTest();
	}
	animationGroupSelectedForTest() {}
	async addAnimation(e) {
		let t = this.#p.get(e.source().backendNodeId());
		t || (t = new H(e.source()), this.#i.appendChild(t.element), this.#p.set(e.source().backendNodeId(), t));
		let n = t.createNewRow(), r = new K(e, this, n), i = await e.source().deferredNode().resolvePromise();
		r.setNode(i), i && t && (t.nodeResolved(i), L.set(i, t)), this.#m.push(r), this.#_.set(e.id(), e);
	}
	markNodeAsRemoved(e) {
		L.get(e)?.nodeRemoved();
		for (let t of e.pseudoElements().values()) t.forEach((e) => this.markNodeAsRemoved(e));
		e.children()?.forEach((e) => {
			this.markNodeAsRemoved(e);
		}), this.hasAnimationGroupActiveNodes() || (this.#A.classList.remove("scrubber-enabled"), this.#o.classList.add("hidden"), this.#w?.cancel(), this.#w = void 0, this.clearCurrentTimeText(), this.updateControlButton());
	}
	hasAnimationGroupActiveNodes() {
		for (let e of this.#p.values()) if (e.hasActiveNode()) return !0;
		return !1;
	}
	renderGrid() {
		let e = this.#l?.isScrollDriven(), t = e ? this.duration() / 10 : 250;
		this.#t.removeChildren();
		let n;
		for (let e = 0; e < this.duration(); e += t) {
			let t = v(this.#t, "rect", "animation-timeline-grid-line");
			t.setAttribute("x", (e * this.pixelTimeRatio() + 10).toString()), t.setAttribute("y", "23"), t.setAttribute("height", "100%"), t.setAttribute("width", "1");
		}
		for (let r = 0; r < this.duration(); r += t) {
			let t = r * this.pixelTimeRatio();
			if (n === void 0 || t - n > 50) {
				n = t;
				let i = v(this.#t, "text", "animation-timeline-grid-label");
				i.textContent = e ? `${r.toFixed(0)}px` : a(r), i.setAttribute("x", (t + 12).toString()), i.setAttribute("y", "16");
			}
		}
	}
	scheduleRedraw() {
		this.renderGrid(), this.#u = [];
		for (let e of this.#m) this.#u.push(e);
		this.#S || (this.#S = !0, this.#i.window().requestAnimationFrame(this.render.bind(this)));
	}
	render(e) {
		for (; this.#u.length && (!e || window.performance.now() - e < 50);) {
			let e = this.#u.shift();
			e && e.redraw();
		}
		this.#u.length ? this.#i.window().requestAnimationFrame(this.render.bind(this)) : this.#S = void 0;
	}
	onResize() {
		this.#C = Math.max(0, this.contentElement.offsetWidth - this.#f) || 0, this.scheduleRedraw(), this.#w && this.syncScrubber(), this.#T = void 0;
	}
	width() {
		return this.#C || 0;
	}
	syncScrubber() {
		this.#l && this.hasAnimationGroupActiveNodes() && this.#l.currentTimePromise().then(this.animateTime.bind(this)).then(this.updateControlButton.bind(this));
	}
	animateTime(e) {
		this.#l?.isScrollDriven() || (this.#w && this.#w.cancel(), this.#w = this.#o.animate([{ transform: "translateX(0px)" }, { transform: "translateX(" + this.width() + "px)" }], {
			duration: this.duration(),
			fill: "forwards"
		}), this.#w.playbackRate = this.effectivePlaybackRate(), this.#w.onfinish = () => {
			this.updateControlButton(), this.scrubberOnFinishForTest();
		}, this.#w.currentTime = e, this.element.window().requestAnimationFrame(this.updateScrubber.bind(this)));
	}
	pixelTimeRatio() {
		return this.width() / this.duration() || 0;
	}
	updateScrubber(e) {
		this.#w && (this.setCurrentTimeText(this.#V()), (this.#w.playState.toString() === "pending" || this.#w.playState === "running") && this.element.window().requestAnimationFrame(this.updateScrubber.bind(this)));
	}
	scrubberDragStart(e) {
		if (!this.#l || !this.hasAnimationGroupActiveNodes()) return !1;
		this.#T ||= this.#t.getBoundingClientRect().left + 10;
		let { x: t } = e, n = Math.max(0, t - this.#T) / this.pixelTimeRatio();
		if (this.#E = n, this.#O = t, this.setCurrentTimeText(n), this.#l.isScrollDriven()) this.setTimelineScrubberPosition(n), this.updateScrollOffsetOnPage(n);
		else {
			let e = this.#w?.currentTime;
			this.#D = this.#l.paused() || typeof e == "number" && e >= this.duration(), this.#l.seekTo(n), this.togglePause(!0), this.animateTime(n);
		}
		return !0;
	}
	async updateScrollOffsetOnPage(e) {
		let t = await this.#l?.scrollNode();
		if (t) return this.#l?.scrollOrientation() === u.ScrollOrientation.Vertical ? await t.setScrollTop(e) : await t.setScrollLeft(e);
	}
	setTimelineScrubberPosition(e) {
		this.#o.style.transform = `translateX(${e * this.pixelTimeRatio()}px)`;
	}
	scrubberDragMove(e) {
		let { x: t } = e, n = t - (this.#O || 0), r = Math.max(0, Math.min((this.#E || 0) + n / this.pixelTimeRatio(), this.duration()));
		this.#w ? this.#w.currentTime = r : (this.setTimelineScrubberPosition(r), this.updateScrollOffsetOnPage(r)), this.setCurrentTimeText(r), this.#l && !this.#l.isScrollDriven() && this.#l.seekTo(r);
	}
	#V() {
		return typeof this.#w?.currentTime == "number" ? this.#w.currentTime : 0;
	}
	scrubberDragEnd(e) {
		if (this.#w) {
			let e = Math.max(0, this.#V());
			this.#w.play(), this.#w.currentTime = e;
		}
		x.actionTaken(O.AnimationGroupScrubbed), this.#l?.isScrollDriven() && x.actionTaken(O.ScrollDrivenAnimationGroupScrubbed), this.#s.window().requestAnimationFrame(this.updateScrubber.bind(this)), this.#D || this.togglePause(!1);
	}
}, V = [
	1,
	.25,
	.1
], H = class {
	element;
	#e;
	#t;
	#n;
	#r;
	constructor(e) {
		this.element = document.createElement("div"), this.element.classList.add("animation-node-row"), this.#e = this.element.createChild("div", "animation-node-description"), this.#e.setAttribute("jslog", `${k("description").track({ resize: !0 })}`), this.#t = this.element.createChild("div", "animation-node-timeline"), this.#t.setAttribute("jslog", `${k("timeline").track({ resize: !0 })}`), d(this.#t);
	}
	nodeResolved(e) {
		if (!e) {
			fe(this.#e, "<node>");
			return;
		}
		this.#r = e, this.nodeChanged(), F(me.instance().linkify(e, { onClick: () => {
			x.actionTaken(O.AnimatedNodeDescriptionClicked);
		} }), this.#e, { host: this }), e.ownerDocument || this.nodeRemoved();
	}
	createNewRow() {
		return this.#t.createChild("div", "animation-timeline-row");
	}
	nodeRemoved() {
		this.element.classList.add("animation-node-removed"), this.#n || (this.#n = document.createElement("div"), this.#n.classList.add("animation-node-removed-overlay"), this.#e.appendChild(this.#n)), this.#r = null;
	}
	hasActiveNode() {
		return !!this.#r;
	}
	nodeChanged() {
		let e = !1;
		this.#r && (e = this.#r === b.instance().flavor(E)), this.element.classList.toggle("animation-node-selected", e);
	}
}, U = class e {
	steps;
	stepAtPosition;
	constructor(e, t) {
		this.steps = e, this.stepAtPosition = t;
	}
	static parse(t) {
		let n = t.match(/^steps\((\d+), (start|middle)\)$/);
		return n ? new e(parseInt(n[1], 10), n[2]) : (n = t.match(/^steps\((\d+)\)$/), n ? new e(parseInt(n[1], 10), "end") : null);
	}
}, we = class {
	async reveal(e) {
		await B.instance().revealAnimationGroup(e);
	}
}, Te = /* @__PURE__ */ e({
	AnimationUI: () => K,
	Colors: () => J,
	Events: () => De,
	Options: () => q
}), W = {
	animationEndpointSlider: "Animation Endpoint slider",
	animationKeyframeSlider: "Animation Keyframe slider",
	sSlider: "{PH1} slider"
}, Ee = i("panels/animation/AnimationUI.ts", W), G = r.bind(void 0, Ee), K = class e {
	#e;
	#t;
	#n;
	#r;
	#i;
	#a;
	#o = [];
	#s = 0;
	#c = 50;
	#l;
	#u;
	#d;
	#f;
	#p;
	#m;
	#h;
	#g;
	constructor(t, n, r) {
		this.#e = t, this.#t = n;
		let i = this.#e.source().keyframesRule();
		i && (this.#n = i.keyframes(), t.viewOrScrollTimeline() && t.playbackRate() < 0 && this.#n.reverse()), this.#r = r.createChild("div", "animation-name"), this.#r.textContent = this.#e.name(), this.#i = v(r, "svg", "animation-ui"), this.#i.setAttribute("height", q.AnimationSVGHeight.toString()), this.#i.style.marginLeft = "-" + q.AnimationMargin + "px", this.#i.addEventListener("contextmenu", this.onContextMenu.bind(this)), this.#a = v(this.#i, "g"), this.#a.setAttribute("jslog", `${_().track({ drag: !0 })}`), this.#e.viewOrScrollTimeline() || (m(this.#a, this.mouseDown.bind(this, "AnimationDrag", null), this.mouseMove.bind(this), this.mouseUp.bind(this), "-webkit-grabbing", "-webkit-grab"), e.installDragHandleKeyboard(this.#a, this.keydownMove.bind(this, "AnimationDrag", null))), this.#l = e.colorForAnimation(this.#e);
	}
	static colorForAnimation(e) {
		let t = Array.from(J.keys()), n = t[pe(e.name() || e.id()) % t.length], r = J.get(n);
		if (!r) throw Error("Unable to locate color");
		return r.asString(s.RGB) || "";
	}
	static installDragHandleKeyboard(e, t) {
		e.addEventListener("keydown", t, !1);
	}
	animation() {
		return this.#e;
	}
	get nameElement() {
		return this.#r;
	}
	get svg() {
		return this.#i;
	}
	setNode(e) {
		this.#u = e;
	}
	createLine(e, t) {
		let n = v(e, "line", t);
		return n.setAttribute("x1", q.AnimationMargin.toString()), n.setAttribute("y1", q.AnimationHeight.toString()), n.setAttribute("y2", q.AnimationHeight.toString()), n.style.stroke = this.#l, n;
	}
	drawAnimationLine(e, t) {
		let n = this.#o[e];
		n.animationLine ||= this.createLine(t, "animation-line"), n.animationLine && n.animationLine.setAttribute("x2", (this.duration() * this.#t.pixelTimeRatio() + q.AnimationMargin).toFixed(2));
	}
	drawDelayLine(e) {
		(!this.#d || !this.#f) && (this.#d = this.createLine(e, "animation-delay-line"), this.#f = this.createLine(e, "animation-delay-line"));
		let t = this.#e.source().fill();
		this.#d.classList.toggle("animation-fill", t === "backwards" || t === "both");
		let n = q.AnimationMargin;
		this.#d.setAttribute("x1", n.toString()), this.#d.setAttribute("x2", (this.delayOrStartTime() * this.#t.pixelTimeRatio() + n).toFixed(2));
		let r = t === "forwards" || t === "both";
		this.#f.classList.toggle("animation-fill", r);
		let i = Math.min(this.#t.width(), (this.delayOrStartTime() + this.duration() * this.#e.source().iterations()) * this.#t.pixelTimeRatio());
		this.#f.style.transform = "translateX(" + i.toFixed(2) + "px)", this.#f.setAttribute("x1", n.toString()), this.#f.setAttribute("x2", r ? (this.#t.width() - i + n).toFixed(2) : (this.#e.source().endDelay() * this.#t.pixelTimeRatio() + n).toFixed(2));
	}
	drawPoint(t, n, r, i, a) {
		if (this.#o[t].keyframePoints[i]) {
			this.#o[t].keyframePoints[i].setAttribute("cx", r.toFixed(2));
			return;
		}
		let o = v(n, "circle", i <= 0 ? "animation-endpoint" : "animation-keyframe-point");
		if (o.setAttribute("cx", r.toFixed(2)), o.setAttribute("cy", q.AnimationHeight.toString()), o.style.stroke = this.#l, o.setAttribute("r", (q.AnimationMargin / 2).toString()), o.setAttribute("jslog", `${de("animations.keyframe").track({ drag: !0 })}`), o.tabIndex = 0, l(o, G(i <= 0 ? W.animationEndpointSlider : W.animationKeyframeSlider)), i <= 0 && (o.style.fill = this.#l), this.#o[t].keyframePoints[i] = o, !a) return;
		let s;
		s = i === 0 ? "StartEndpointMove" : i === -1 ? "FinishEndpointMove" : "KeyframeMove", this.animation().viewOrScrollTimeline() || (m(o, this.mouseDown.bind(this, s, i), this.mouseMove.bind(this), this.mouseUp.bind(this), "ew-resize"), e.installDragHandleKeyboard(o, this.keydownMove.bind(this, s, i)));
	}
	renderKeyframe(e, t, n, r, i, a) {
		function o(e, t, n) {
			let r = v(e, "line");
			r.setAttribute("x1", t.toString()), r.setAttribute("x2", t.toString()), r.setAttribute("y1", q.AnimationMargin.toString()), r.setAttribute("y2", q.AnimationHeight.toString()), r.style.stroke = n;
		}
		let s = oe.parse(a), c = this.#o[e].keyframeRender;
		c[t] || (c[t] = s ? v(n, "path", "animation-keyframe") : v(n, "g", "animation-keyframe-step"));
		let u = c[t];
		if (u.tabIndex = 0, l(u, G(W.sSlider, { PH1: this.#e.name() })), u.style.transform = "translateX(" + r.toFixed(2) + "px)", a === "linear") u.style.fill = this.#l, u.setAttribute("d", [
			"M",
			0,
			26,
			"L",
			0,
			5,
			"L",
			i.toFixed(2),
			5,
			"L",
			i.toFixed(2),
			26,
			"Z"
		].join(" "));
		else if (s) u.style.fill = this.#l, he.drawVelocityChart(s, u, i);
		else {
			let e = U.parse(a);
			u.removeChildren();
			let t = {
				start: 0,
				middle: .5,
				end: 1
			};
			if (e) {
				let n = t[e.stepAtPosition];
				for (let t = 0; t < e.steps; t++) o(u, (t + n) * i / e.steps, this.#l);
			}
		}
	}
	redraw() {
		let e = this.#t.width() - q.AnimationMargin;
		if (this.#i.setAttribute("width", (e + 2 * q.AnimationMargin).toFixed(2)), this.#a.style.transform = "translateX(" + (this.delayOrStartTime() * this.#t.pixelTimeRatio()).toFixed(2) + "px)", this.#r.style.transform = "translateX(" + (Math.max(this.delayOrStartTime(), 0) * this.#t.pixelTimeRatio() + q.AnimationMargin).toFixed(2) + "px)", this.#r.style.width = (this.duration() * this.#t.pixelTimeRatio()).toFixed(2) + "px", this.drawDelayLine(this.#i), this.#e.type() === "CSSTransition") {
			this.renderTransition();
			return;
		}
		this.renderIteration(this.#a, 0), this.#p ||= v(this.#a, "g", "animation-tail-iterations");
		let t = this.duration() * this.#t.pixelTimeRatio(), n, r = this.delayOrStartTime() < 0 ? -this.delayOrStartTime() * this.#t.pixelTimeRatio() : 0;
		for (n = 1; n < this.#e.source().iterations() && t * (n - 1) < r + this.#t.width() && (t > 0 || this.#e.source().iterations() !== Infinity); n++) this.renderIteration(this.#p, n);
		for (; n < this.#o.length;) {
			let e = this.#o.pop();
			e?.group && e.group.remove();
		}
	}
	renderTransition() {
		let e = this.#a;
		this.#o[0] || (this.#o[0] = {
			animationLine: null,
			keyframePoints: {},
			keyframeRender: {},
			group: null
		}), this.drawAnimationLine(0, e), this.renderKeyframe(0, 0, e, q.AnimationMargin, this.duration() * this.#t.pixelTimeRatio(), this.#e.source().easing()), this.drawPoint(0, e, q.AnimationMargin, 0, !0), this.drawPoint(0, e, this.duration() * this.#t.pixelTimeRatio() + q.AnimationMargin, -1, !0);
	}
	renderIteration(e, t) {
		this.#o[t] || (this.#o[t] = {
			animationLine: null,
			keyframePoints: {},
			keyframeRender: {},
			group: v(e, "g")
		});
		let n = this.#o[t].group;
		if (n) {
			if (n.style.transform = "translateX(" + (t * this.duration() * this.#t.pixelTimeRatio()).toFixed(2) + "px)", this.drawAnimationLine(t, n), this.#n && this.#n.length > 1) for (let e = 0; e < this.#n.length - 1; e++) {
				let r = this.offset(e) * this.duration() * this.#t.pixelTimeRatio() + q.AnimationMargin, i = this.duration() * (this.offset(e + 1) - this.offset(e)) * this.#t.pixelTimeRatio();
				this.renderKeyframe(t, e, n, r, i, this.#n[e].easing()), (e || !e && t === 0) && this.drawPoint(t, n, r, e, t === 0);
			}
			this.drawPoint(t, n, this.duration() * this.#t.pixelTimeRatio() + q.AnimationMargin, -1, t === 0);
		}
	}
	delayOrStartTime() {
		let e = this.#e.delayOrStartTime();
		return (this.#m === "AnimationDrag" || this.#m === "StartEndpointMove") && (e += this.#s), e;
	}
	duration() {
		let e = this.#e.iterationDuration();
		return this.#m === "FinishEndpointMove" ? e += this.#s : this.#m === "StartEndpointMove" && (e -= this.#s), Math.max(0, e);
	}
	offset(e) {
		if (!this.#n) throw Error("Unable to calculate offset; keyframes do not exist");
		let t = this.#n[e].offsetAsNumber();
		return this.#m === "KeyframeMove" && e === this.#h && (console.assert(e > 0 && e < this.#n.length - 1, "First and last keyframe cannot be moved"), t += this.#s / this.#e.iterationDuration(), t = Math.max(t, this.#n[e - 1].offsetAsNumber()), t = Math.min(t, this.#n[e + 1].offsetAsNumber())), t;
	}
	mouseDown(e, n, r) {
		let i = r;
		if (i.buttons === 2 || this.#i.enclosingNodeOrSelfWithClass("animation-node-removed")) return !1;
		this.#m = e, this.#h = n, this.#g = i.clientX, r.consume(!0);
		let a = T.instance(), o = a.locationNameForViewId("animations"), s = a.locationNameForViewId("elements");
		return this.#u && o !== s && t(this.#u), !0;
	}
	mouseMove(e) {
		let t = e;
		this.setMovementAndRedraw((t.clientX - (this.#g || 0)) / this.#t.pixelTimeRatio());
	}
	setMovementAndRedraw(e) {
		this.#s = e, this.delayOrStartTime() + this.duration() > this.#t.duration() * .8 && this.#t.setDuration(this.#t.duration() * 1.2), this.redraw();
	}
	mouseUp(e) {
		let t = e;
		this.#s = (t.clientX - (this.#g || 0)) / this.#t.pixelTimeRatio(), this.#m === "KeyframeMove" ? this.#n && this.#h !== null && this.#h !== void 0 && this.#n[this.#h].setOffset(this.offset(this.#h)) : this.#e.setTiming(this.duration(), this.delayOrStartTime()), this.#s = 0, this.redraw(), this.#m = void 0, this.#g = void 0, this.#h = void 0;
	}
	keydownMove(e, t, n) {
		let r = n;
		switch (this.#m = e, this.#h = t, r.key) {
			case "ArrowLeft":
			case "ArrowUp":
				this.#s = -this.#c;
				break;
			case "ArrowRight":
			case "ArrowDown":
				this.#s = this.#c;
				break;
			default: return;
		}
		this.#m === "KeyframeMove" ? this.#n && this.#h !== null && this.#n[this.#h].setOffset(this.offset(this.#h)) : this.#e.setTiming(this.duration(), this.delayOrStartTime()), this.setMovementAndRedraw(0), this.#m = void 0, this.#h = void 0, n.consume(!0);
	}
	onContextMenu(e) {
		function t(t) {
			if (!t) return;
			let n = new y(e);
			n.appendApplicableItems(t), n.show();
		}
		this.#e.remoteObjectPromise().then(t), e.consume(!0);
	}
}, De = /* @__PURE__ */ function(e) {
	return e.ANIMATION_DRAG = "AnimationDrag", e.KEYFRAME_MOVE = "KeyframeMove", e.START_ENDPOINT_MOVE = "StartEndpointMove", e.FINISH_ENDPOINT_MOVE = "FinishEndpointMove", e;
}({}), q = {
	AnimationHeight: 26,
	AnimationSVGHeight: 50,
	AnimationMargin: 7,
	EndpointsClickRegionSize: 10,
	GridCanvasHeight: 40
}, J = /* @__PURE__ */ new Map([
	["Purple", n("#9C27B0")],
	["Light Blue", n("#03A9F4")],
	["Deep Orange", n("#FF5722")],
	["Blue", n("#5677FC")],
	["Lime", n("#CDDC39")],
	["Blue Grey", n("#607D8B")],
	["Pink", n("#E91E63")],
	["Green", n("#0F9D58")],
	["Brown", n("#795548")],
	["Cyan", n("#00BCD4")]
]), Oe = /* @__PURE__ */ e({ AnimationGroupPreviewUI: () => $ }), { render: ke, html: Y, svg: Ae, Directives: { classMap: X, ref: Z } } = h, Q = 32, je = 10, Me = 750, Ne = (e, t, n) => {
	let r = X({
		"animation-buffer-preview": !0,
		selected: e.isSelected,
		paused: e.isPaused,
		"no-animation": e.isPreviewAnimationDisabled
	});
	ke(Y`
    <div class="animation-group-preview-ui">
      <button
        jslog=${p(`animations.buffer-preview${e.isScrollDrivenAnimationGroup ? "-sda" : ""}`).track({
		click: !0,
		resize: !0
	})}
        class=${r}
        role="option"
        aria-label=${e.label}
        tabindex=${e.isFocusable ? 0 : -1}
        @keydown=${(t) => {
		switch (t.key) {
			case "Backspace":
			case "Delete":
				e.onRemoveAnimationGroup();
				break;
			case "ArrowLeft":
			case "ArrowUp":
				e.onFocusPreviousGroup();
				break;
			case "ArrowRight":
			case "ArrowDown": e.onFocusNextGroup();
		}
	}}
        @click=${e.onSelectAnimationGroup}
        @animationend=${e.onPreviewAnimationEnd}
        ${Z((e) => {
		e instanceof HTMLElement && (t.focus = () => {
			e.focus();
		});
	})}>
          <div class="animation-paused fill"></div>
          <devtools-icon name=${e.isScrollDrivenAnimationGroup ? "mouse" : "watch"} class="preview-icon"></devtools-icon>
          <div class="animation-buffer-preview-animation" ${Z((e) => {
		e instanceof HTMLElement && (t.replay = () => {
			e.animate([
				{
					offset: 0,
					width: "0%",
					opacity: 1
				},
				{
					offset: .9,
					width: "100%",
					opacity: 1
				},
				{
					offset: 1,
					width: "100%",
					opacity: 0
				}
			], {
				duration: 200,
				easing: "cubic-bezier(0, 0, 0.2, 1)"
			});
		});
	})}></div>
          ${(() => {
		let t = 100 / Math.max(e.animationGroupDuration, Me);
		return Y`
      <svg
        width="100%"
        height="100%"
        viewBox=${`0 0 100 ${Q}`}
        preserveAspectRatio="none"
        shape-rendering="crispEdges">
        ${e.animations.map((n, r) => {
			let i = n.delayOrStartTime(), a = i + n.iterationDuration(), o = Math.floor(Q / Math.max(6, e.animations.length) * r + 1), s = K.colorForAnimation(n);
			return Ae`<line
        x1="${i * t}"
        x2="${a * t}"
        y1="${o}"
        y2="${o}"
        style="stroke: ${s}"></line>`;
		})}
      </svg>
    `;
	})()}
        </button>
        <button
          class="animation-remove-button"
          jslog=${C("animations.remove-preview").track({ click: !0 })}
          @click=${e.onRemoveAnimationGroup}>
            <devtools-icon name="cross"></devtools-icon>
        </button>
    </div>
  `, n);
}, $ = class extends ce {
	#e;
	#t = {};
	#n;
	#r = !1;
	#i = !1;
	#a = !1;
	#o = !1;
	constructor(e, t = Ne) {
		super(), this.#e = t, this.#n = e, this.requestUpdate();
	}
	setSelected(e) {
		this.#i !== e && (this.#i = e, this.requestUpdate());
	}
	setPaused(e) {
		this.#a !== e && (this.#a = e, this.requestUpdate());
	}
	setFocusable(e) {
		this.#o !== e && (this.#o = e, this.requestUpdate());
	}
	performUpdate() {
		this.#e({
			isScrollDrivenAnimationGroup: this.#n.animationGroup.isScrollDriven(),
			isPreviewAnimationDisabled: this.#r,
			isSelected: this.#i,
			isPaused: this.#a,
			isFocusable: this.#o,
			label: this.#n.label,
			animationGroupDuration: this.#n.animationGroup.groupDuration(),
			animations: this.#n.animationGroup.animations().slice(0, je),
			onPreviewAnimationEnd: () => {
				this.#r = !0, this.requestUpdate();
			},
			onRemoveAnimationGroup: () => {
				this.#n.onRemoveAnimationGroup();
			},
			onSelectAnimationGroup: () => {
				this.#n.onSelectAnimationGroup();
			},
			onFocusNextGroup: () => {
				this.#n.onFocusNextGroup();
			},
			onFocusPreviousGroup: () => {
				this.#n.onFocusPreviousGroup();
			}
		}, this.#t, this.contentElement);
	}
	focus() {
		this.#t.focus?.();
	}
	replay() {
		this.#t.replay?.();
	}
};
//#endregion
export { Oe as AnimationGroupPreviewUI, _e as AnimationTimeline, Te as AnimationUI };
