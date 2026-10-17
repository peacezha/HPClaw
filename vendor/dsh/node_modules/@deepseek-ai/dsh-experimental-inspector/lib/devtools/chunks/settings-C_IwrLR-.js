import { n as e } from "./rolldown-runtime-DF993M8W.js";
import { o as t } from "./dom_extension-BLny9Waw.js";
import { H as n, K as r, W as i, i as a, l as o, n as s, o as c, r as ee, s as l } from "./common-DMSVbaSb.js";
import { $f as te, $i as u, Ao as d, Bt as ne, Dt as f, Et as p, Ff as m, Fo as h, Ft as g, G as re, Gi as ie, Hi as _, If as ae, Io as oe, La as se, Lf as ce, Ln as le, Lt as ue, Mf as de, Mo as v, Nf as fe, No as pe, Of as me, Or as he, Ot as ge, Pf as _e, Po as y, Pr as ve, Q as ye, Qt as be, T as xe, U as b, Uf as Se, Ui as Ce, Ur as we, Ut as Te, Vf as Ee, Vi as De, Vr as Oe, Vt as ke, Wf as Ae, Wi as x, Wo as je, Xi as Me, Yf as S, Z as Ne, Zi as C, Zo as w, _r as Pe, an as Fe, bn as T, bp as Ie, ei as E, et as Le, fa as D, ff as O, gr as Re, ha as ze, ii as Be, jr as Ve, kr as He, la as Ue, ma as We, na as Ge, ni as Ke, no as qe, nt as Je, pf as Ye, qa as k, qi as A, qr as Xe, ra as Ze, ui as Qe, uo as $e, vn as et, w as tt, yr as nt, zi as rt } from "./legacy-dM_vujv7.js";
import { a as j, h as it, l as at, p as M, r as ot, s as st, t as ct } from "./root-DdvV-xPu.js";
import "./platform-D4TUCh2P.js";
import { $t as lt, J as ut, K as dt, Qt as ft, S as pt, W as mt, Y as ht, Zt as gt, _ as _t, _n as vt, gn as N, hn as yt, in as bt, lt as xt, q as St } from "./common-Bs7hSOUj.js";
import { n as Ct } from "./i18n-CTSaUtZW.js";
import "./data_grid-C6uthMeA.js";
import { n as P, t as wt } from "./settings_ui-B3VIsMZM.js";
import { t as Tt } from "./checkbox.css-CtBDUlMG.js";
import { t as Et } from "./utils-3dsE24eK.js";
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/settings/components/syncSection.css.mjs
var Dt = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n@scope to (devtools-widget > *) {\n  :scope {\n    break-inside: avoid;\n    display: block;\n    width: 100%;\n    position: relative;\n  }\n\n  fieldset {\n    border: 0;\n    padding: 0;\n    padding: 4px 0 0;\n  }\n\n  .link {\n    color: var(--sys-color-primary);\n    text-decoration: underline;\n    cursor: pointer;\n    outline-offset: 2px;\n  }\n\n  .account-avatar {\n    border: 0;\n    border-radius: var(--sys-shape-corner-full);\n    display: block;\n    height: var(--sys-size-9);\n    width: var(--sys-size-9);\n  }\n\n  .account-info {\n    display: flex;\n    align-items: center;\n  }\n\n  .account-email {\n    display: flex;\n    flex-direction: column;\n    margin-left: 8px;\n  }\n\n  .not-signed-in {\n    padding-bottom: 4px;\n  }\n\n  .setting-checkbox-container {\n    display: flex;\n    align-items: center;\n    gap: var(--sys-size-2);\n  }\n\n  .setting-checkbox {\n    display: inline-block;\n  }\n\n  .gdp-profile-container {\n    padding-bottom: var(--sys-size-4);\n  }\n\n  .gdp-profile-container .divider {\n    left: 0;\n    position: absolute;\n    width: 100%;\n    height: var(--sys-size-1);\n    background: var(--sys-color-divider);\n  }\n\n  .gdp-profile-container .gdp-profile-header {\n    display: flex;\n    align-items: center;\n    gap: var(--sys-size-5);\n    font-family: \"Google Sans\", system-ui;\n    font-size: var(--sys-typescale-body3-size);\n    height: var(--sys-size-11);\n  }\n\n  .gdp-profile-container .gdp-profile-header .gdp-logo {\n    background-image: var(--image-file-gdp-logo-light);\n    background-size: contain;\n    width: 203px;\n    height: 18px;\n    background-repeat: no-repeat;\n  }\n\n  :host-context(.theme-with-dark-background) & .gdp-profile-container .gdp-profile-header .gdp-logo {\n    background-image: var(--image-file-gdp-logo-dark);\n  }\n\n  .gdp-profile-container .gdp-profile-sign-up-content {\n    padding-top: var(--sys-size-7);\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n  }\n\n  .gdp-profile-container .gdp-profile-details-content {\n    padding-top: var(--sys-size-7);\n    font: var(--sys-typescale-body4-regular);\n  }\n\n  .gdp-profile-container .gdp-profile-details-content .plan-details {\n    margin-top: var(--sys-size-3);\n    height: 18px;\n    display: flex;\n    align-items: center;\n  }\n\n  .gdp-profile-container .gdp-profile-details-content .setting-container {\n    margin: calc(var(--sys-size-3) - 6px) 0 -6px;\n    display: flex;\n    align-items: center;\n    gap: var(--sys-size-2);\n  }\n\n  .gdp-profile-container .gdp-profile-details-content .tooltip-content {\n    max-width: 278px;\n    padding: var(--sys-size-2) var(--sys-size-3);\n    font: var(--sys-typescale-body5-regular);\n  }\n}\n", F = {
	syncDisabled: "To turn this setting on, you must enable Chrome sync.",
	preferencesSyncDisabled: "You need to first enable saving `Chrome` settings in your `Google` account.",
	signedIn: "Signed into Chrome as:",
	notSignedIn: "You're not signed into Chrome.",
	gdpStandardPlan: "Standard plan",
	gdpPremiumSubscription: "Premium",
	gdpProSubscription: "Pro",
	gdpUnknownSubscription: "Unknown plan",
	signUp: "Sign up",
	viewProfile: "View profile",
	tooltipDisclaimerText: "When you qualify for a badge, the badge’s identifier and the type of activity you did to earn it are sent to Google",
	relevantData: "Relevant data",
	dataDisclaimer: "({PH1} is sent to Google)"
}, Ot = r("panels/settings/components/SyncSection.ts", F), I = n.bind(void 0, Ot), kt = oe.bind(void 0, Ot), { html: L, render: At, Directives: { ref: jt } } = pe;
function Mt(e) {
	if (!e.activeSubscription || e.activeSubscription.subscriptionStatus !== _e.ENABLED) return I(F.gdpStandardPlan);
	switch (e.activeSubscription.subscriptionTier) {
		case m.PREMIUM_ANNUAL:
		case m.PREMIUM_MONTHLY: return I(F.gdpPremiumSubscription);
		case m.PRO_ANNUAL:
		case m.PRO_MONTHLY: return I(F.gdpProSubscription);
		default: return I(F.gdpUnknownSubscription);
	}
}
var Nt = (e, t, n) => {
	At(L`
    <style>${Dt}</style>
    <fieldset>
      ${e.syncInfo.accountEmail ? L`
      <div class="account-info">
        <img class="account-avatar" src="data:image/png;base64, ${e.syncInfo.accountImage}"
          alt="Account avatar" />
        <div class="account-email">
          <span>${I(F.signedIn)}</span>
          <span>${e.syncInfo.accountEmail}</span>
        </div>
      </div>` : L`
        <div class="not-signed-in">${I(F.notSignedIn)}</div>
      `}
      ${(() => {
		if (!e.syncInfo.accountEmail) return w;
		let t = e.warningType === "SYNC_DISABLED" ? I(F.syncDisabled) : I(F.preferencesSyncDisabled);
		return L`
      <div class="setting-checkbox-container">
        <setting-checkbox class="setting-checkbox"
          .data=${{ setting: e.syncSetting }}>
        </setting-checkbox>
        ${e.warningType ? L`
          <devtools-button
            aria-details="settings-sync-info"
            .iconName=${"info"}
            .variant=${u.ICON}
            .size=${C.SMALL}
            @click=${e.onWarningClick}>
          </devtools-button>
          <devtools-tooltip
              id="settings-sync-info"
              variant="rich">
            ${t}
          </devtools-tooltip>` : w}
      </div>
    `;
	})()}
      ${(() => {
		if (!e.isEligibleToCreateGdpProfile && !e.gdpProfile) return w;
		let n = ae() && e.receiveBadgesSetting, r = () => L`
        <div class="gdp-profile-header">
          <div class="gdp-logo" role="img" aria-label="Google Developer Program"></div>
        </div>
      `;
		return L`
      <div class="gdp-profile-container" .jslog=${qe().context("gdp-profile")}>
        <div class="divider"></div>
        ${e.gdpProfile ? L`
          <div class="gdp-profile-details-content">
            ${r()}
            <div class="plan-details">
              ${Mt(e.gdpProfile)}
              &nbsp;·&nbsp;
              <devtools-link
                jslogcontext="view-profile"
                class="link"
                href=${de}>
                ${I(F.viewProfile)}
              </devtools-link></div>
              ${n ? L`
                <div class="setting-container" ${jt((e) => {
			t.highlightReceiveBadgesSetting = () => {
				e && Et.highlightElement(e);
			};
		})}>
                  <setting-checkbox class="setting-checkbox"
                    .data=${{ setting: e.receiveBadgesSetting }}
                    @change=${(t) => e.onReceiveBadgesSettingClick(t)}>
                  </setting-checkbox>
                  <span>${kt(F.dataDisclaimer, { PH1: L`
                    <span class="link" tabindex="0" aria-details="gdp-profile-tooltip">
                      ${I(F.relevantData)}</span>
                    <devtools-tooltip id="gdp-profile-tooltip" variant="rich">
                      <div class="tooltip-content" tabindex="0">
                      ${I(F.tooltipDisclaimerText)}</div>
                    </devtools-tooltip>` })}
                  </span>
                </div>
              ` : w}
          </div>
        ` : L`
          <div class="gdp-profile-sign-up-content">
            ${r()}
            <devtools-button
              @click=${e.onSignUpClick}
              .jslogContext=${"open-sign-up-dialog"}
              .variant=${u.OUTLINED}>
                ${I(F.signUp)}
            </devtools-button>
          </div>
        `}
      </div>
    `;
	})()}
    </fieldset>
  `, n);
}, Pt = class extends Ke {
	#e = { isSyncActive: !1 };
	#t;
	#n;
	#r = !1;
	#i;
	#a;
	#o = {};
	constructor(e, t = Nt) {
		super(e), this.#a = t, this.#n = a.instance().moduleSetting("receive-gdp-badges"), this.#t = c("sync-preferences");
	}
	wasShown() {
		super.wasShown(), this.requestUpdate();
	}
	set syncInfo(e) {
		this.#e = e, this.requestUpdate(), e.accountEmail && this.#u();
	}
	async highlightReceiveBadgesSetting() {
		this.requestUpdate(), await this.updateComplete, this.#o.highlightReceiveBadgesSetting?.();
	}
	performUpdate() {
		let e = !this.#e.isSyncActive || !this.#e.arePreferencesSynced;
		this.#t?.setDisabled(e);
		let t;
		this.#e.isSyncActive ? this.#e.arePreferencesSynced || (t = "PREFERENCES_SYNC_DISABLED") : t = "SYNC_DISABLED";
		let n = {
			syncInfo: this.#e,
			syncSetting: this.#t,
			receiveBadgesSetting: this.#n,
			gdpProfile: this.#i,
			isEligibleToCreateGdpProfile: ce() && this.#r,
			onSignUpClick: this.#s.bind(this),
			onReceiveBadgesSettingClick: this.#c.bind(this),
			onWarningClick: this.#l.bind(this),
			warningType: t
		};
		this.#a(n, this.#o, this.contentElement);
	}
	#s() {
		mt.show({ onSuccess: this.#u.bind(this) });
	}
	#c(e) {
		let t = e.target;
		dt.instance().initialize().then(() => {
			t.checked && dt.instance().recordAction(St.RECEIVE_BADGES_SETTING_ENABLED);
		});
	}
	#l(e) {
		let t = this.#e.isSyncActive ? "chrome://settings/syncSetup/advanced" : "chrome://settings/syncSetup";
		d(t), e.consume();
	}
	async #u() {
		if (!ce()) return;
		let e = await fe.instance().getProfile();
		e && (this.#i = e.profile ?? void 0, this.#r = e.isEligible, this.requestUpdate());
	}
}, R = "/*\n * Copyright 2015 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.settings-window-main {\n  color: var(--sys-color-on-surface);\n  background-color: var(--sys-color-cdt-base-container);\n}\n\n.settings-content {\n  overflow: hidden auto;\n  margin: 8px 8px 8px 0;\n  padding: 0 4px;\n  flex: auto;\n}\n\n.settings-experiments-block {\n  padding: 0 var(--sys-size-6) var(--sys-size-5) var(--sys-size-4);\n}\n\nfieldset {\n  margin: 0;\n  padding: 0;\n  border: none;\n}\n\nlabel {\n  padding-right: 8px;\n}\n\n.experiments-filter {\n  width: 100%;\n  padding: 0 var(--sys-size-9) 0 var(--sys-size-8);\n  max-width: var(--sys-size-35);\n\n  > devtools-toolbar {\n    min-width: var(--sys-size-31);\n  }\n}\n\n.settings-select {\n  align-items: center;\n  display: grid;\n  row-gap: var(--sys-size-3);\n  margin: var(--sys-size-4) 0;\n}\n\ndiv:has(.settings-select) + div:has(.settings-select) {\n  padding-top: var(--sys-size-5);\n}\n\n.settings-window-label-element {\n  flex: none;\n}\n\n.settings-window-title {\n  display: flex;\n  align-items: center;\n  font-size: var(--sys-size-9);\n  color: var(--sys-color-on-surface);\n  margin: var(--sys-size-8) var(--sys-size-7);\n\n  &::before {\n    content: \"\";\n    width: var(--sys-size-9);\n    height: var(--sys-size-9);\n    margin-right: var(--sys-size-6);\n    background-image: var(--image-file-devtools);\n  }\n}\n\n.settings-card-container-wrapper {\n  scrollbar-gutter: stable;\n  padding: var(--sys-size-8) 0;\n  overflow: auto;\n  position: absolute;\n  inset: var(--sys-size-8) 0 0;\n  container-type: inline-size;\n  container-name: settings-content;\n}\n\n.settings-card-container,\n.settings-multicolumn-card-container {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: var(--sys-size-9);\n\n  > devtools-button {\n    max-width: var(--sys-size-35);\n    width: calc(100% - var(--sys-size-5));\n    margin-left: var(--sys-size-5);\n  }\n}\n\n/* In multi-column mode, we adopt single-column styles unless\n   enough space is available to actually show two columns (at 850px) */\n@container settings-content (min-width: 850px) {\n  .settings-multicolumn-card-container {\n    display: block;\n    column-width: var(--sys-size-32);\n    column-gap: var(--sys-size-11);\n    margin: 0 var(--sys-size-9);\n\n    > * + * {\n      margin-top: var(--sys-size-8);\n    }\n\n    > devtools-button {\n      align-self: start;\n    }\n  }\n}\n\n.settings-card-container-wrapper select {\n  margin-left: 10px;\n  width: var(--sys-size-28);\n}\n\n.settings-card-container-wrapper setting-checkbox { /* stylelint-disable-line selector-type-no-unknown */\n  min-height: var(--sys-size-13);\n  position: relative;\n  left: calc(var(--sys-size-4) * -1);\n}\n\n.settings-experiment {\n  margin: 0;\n  min-height: var(--sys-size-13);\n  display: grid;\n  grid-template-columns: auto min-content auto 1fr;\n\n  & .devtools-link {\n    display: flex !important; /* stylelint-disable-line declaration-no-important */\n    align-items: center;\n  }\n}\n\ndevtools-button.link-icon {\n  cursor: pointer;\n}\n\n.experiment-label {\n  margin: var(--sys-size-3) var(--sys-size-2) var(--sys-size-3) 0;\n  white-space: normal;\n}\n\n.settings-experiment .feedback-link {\n  color: var(--sys-color-primary);\n  text-decoration-line: underline;\n  margin-left: 4px;\n}\n\n.tabbed-pane-content slot::slotted(.widget) {\n  /* '!important' in order to overwrite the slotted widget's 'overflow-auto' class.\n  This prevents the focus-ring of selectable elements from being cut off. */\n  overflow: visible !important; /* stylelint-disable-line declaration-no-important */\n}\n\n.experiments-warning-subsection {\n  display: flex;\n  align-items: center;\n\n  > devtools-icon {\n    color: var(--sys-color-orange-bright);\n    margin-right: var(--sys-size-4);\n  }\n}\n\n@media (forced-colors: active) {\n  .settings-window-title {\n    color: canvastext;\n  }\n\n  .tabbed-pane-header-tab {\n    background: ButtonFace;\n  }\n\n  .tabbed-pane-header-tab-title {\n    color: canvastext;\n  }\n}\n\n@media (forced-colors: active) and (prefers-color-scheme: dark) {\n  .tabbed-pane-header-tab.selected {\n    background: ButtonFace;\n  }\n\n  .tabbed-pane-header-tab.selected .tabbed-pane-header-tab-title {\n    color: HighlightText;\n  }\n}\n\n.greendev-widgets input[type=\"radio\"] {\n  margin: 6px;\n}\n", Ft = /* @__PURE__ */ e({
	ActionDelegate: () => Bt,
	ExperimentsSettingsTab: () => zt,
	GenericSettingsTab: () => Rt,
	GreenDevSettingsTab: () => Ht,
	Revealer: () => Vt,
	SettingsScreen: () => H
}), z = {
	settings: "Settings",
	shortcuts: "Shortcuts",
	restoreDefaultsAndReload: "Restore defaults and reload",
	experiments: "Experiments",
	experimentsFound: "{n, plural, =1 {# experiment found} other {# experiments found}}",
	theseExperimentsCouldBeUnstable: "Warning: These experiments could be unstable or unreliable.",
	greenDevUnstable: "Warning: All these features are prototype and very unstable. They exist for user testing and are not designed to be relied on.",
	settingsChangedReloadDevTools: "Settings changed. To apply, reload DevTools.",
	settingsChangedRestartChrome: "Settings changed. To apply, restart Chrome.",
	noResults: "No experiments match the filter",
	learnMore: "Learn more",
	sendFeedback: "Send feedback",
	searchExperiments: "Search experiments"
}, It = r("panels/settings/SettingsScreen.ts", z), B = n.bind(void 0, It), Lt;
function V(e, ...t) {
	let n = document.createElement("devtools-card");
	return n.heading = e, n.append(...t), n;
}
var H = class e extends E {
	tabbedLocation;
	keybindsTab;
	reportTabOnReveal;
	constructor() {
		super({ useShadowDom: !0 }), this.registerRequiredCSS(R), this.contentElement.classList.add("settings-window-main"), this.contentElement.classList.add("vbox");
		let t = document.createElement("div");
		t.classList.add("settings-window-label-element");
		let n = et(t, { cssFile: R }).createChild("div", "settings-window-title");
		ye(n, 1), n.textContent = B(z.settings), this.tabbedLocation = Ve.instance().createTabbedLocation(() => e.revealSettingsScreen(), "settings-view");
		let r = this.tabbedLocation.tabbedPane();
		r.registerRequiredCSS(R), r.headerElement().prepend(t), r.setShrinkableTabs(!1), r.makeVerticalTabLayout();
		let i = Ve.instance().view("keybinds");
		i && i.widget().then((e) => {
			this.keybindsTab = e;
		}), r.show(this.contentElement), r.selectTab("preferences"), r.addEventListener(Oe.TabInvoked, this.tabInvoked, this), this.reportTabOnReveal = !1;
	}
	static instance(t = { forceNew: null }) {
		let { forceNew: n } = t;
		return (!Lt || n) && (Lt = new e()), Lt;
	}
	static revealSettingsScreen() {
		let t = e.instance();
		if (t.isShowing()) return t;
		t.reportTabOnReveal = !0;
		let n = new g("settings");
		return n.contentElement.removeAttribute("aria-modal"), n.contentElement.tabIndex = -1, n.addCloseButton(), n.setOutsideClickCallback(() => {}), n.setPointerEventsBehavior(ke.PIERCE_GLASS_PANE), n.setOutsideTabIndexBehavior(ue.PRESERVE_MAIN_VIEW_TAB_INDEX), t.show(n.contentElement), n.setEscapeKeyCallback(t.onEscapeKeyPressed.bind(t)), n.setMarginBehavior(ne.NO_MARGIN), n.show(), n.contentElement.focus(), t;
	}
	static async showSettingsScreen(t = {}) {
		let { name: n, focusTabHeader: r } = t, i = e.revealSettingsScreen();
		i.selectTab(n || "preferences");
		let a = i.tabbedLocation.tabbedPane();
		await a.waitForTabElementUpdate(), r ? a.focusSelectedTabHeader() : a.focus();
	}
	resolveLocation(e) {
		return this.tabbedLocation;
	}
	selectTab(e) {
		this.tabbedLocation.tabbedPane().selectTab(e, !0);
	}
	tabInvoked(e) {
		let t = e.data;
		if (!t.isUserGesture) return;
		let n = t.prevTabId, r = t.tabId;
		(this.reportTabOnReveal || !n || n !== r) && (this.reportTabOnReveal = !1, this.reportSettingsPanelShown(r));
	}
	reportSettingsPanelShown(e) {
		if (e === B(z.shortcuts)) {
			He.instance().settingsPanelShown("shortcuts");
			return;
		}
		He.instance().settingsPanelShown(e);
	}
	onEscapeKeyPressed(e) {
		this.tabbedLocation.tabbedPane().selectedTabId === "keybinds" && this.keybindsTab && this.keybindsTab.onEscapeKeyPressed(e);
	}
}, Rt = class e extends E {
	syncSection = new Pt();
	settingToControl = /* @__PURE__ */ new Map();
	containerElement;
	#e = -1;
	#t = null;
	constructor() {
		super({ jslog: `${k("preferences")}` }), this.element.classList.add("settings-tab-container"), this.element.id = "preferences-tab-content", this.containerElement = this.contentElement.createChild("div", "settings-card-container-wrapper").createChild("div"), this.containerElement.classList.add("settings-multicolumn-card-container"), this.syncSection.markAsRoot();
		let t = [
			l.NONE,
			l.APPEARANCE,
			l.SOURCES,
			l.ELEMENTS,
			l.NETWORK,
			l.PERFORMANCE,
			l.MEMORY,
			l.CONSOLE,
			l.EXTENSIONS,
			l.PERSISTENCE,
			l.DEBUGGER,
			l.GLOBAL,
			l.ACCOUNT
		], n = a.instance().getRegisteredSettings().sort((e, t) => e.order && t.order ? e.order - t.order : e.order ? -1 : +!!t.order);
		for (let r of t) {
			let t = n.filter((t) => t.category === r && e.isSettingVisible(t));
			this.createSectionElement(r, t);
		}
		let r = T(B(z.restoreDefaultsAndReload), i, { jslogContext: "settings.restore-defaults-and-reload" });
		this.containerElement.appendChild(r);
		function i() {
			a.instance().clearAll(), _t();
		}
	}
	static isSettingVisible(e) {
		return !!e.title?.() && !!e.category;
	}
	wasShown() {
		D.instance().setFlavor(e, this), super.wasShown(), this.updateSyncSection();
	}
	willHide() {
		this.#e > 0 && (window.clearTimeout(this.#e), this.#e = -1), super.willHide(), D.instance().setFlavor(e, null);
	}
	updateSyncSection() {
		this.#e > 0 && (window.clearTimeout(this.#e), this.#e = -1), this.#t = new Promise((e) => S.getSyncInformation(e)).then((e) => {
			this.syncSection.syncInfo = e, (!e.isSyncActive || !e.arePreferencesSynced) && (this.#e = window.setTimeout(this.updateSyncSection.bind(this), 500));
		});
	}
	createExtensionSection(e) {
		let t = l.EXTENSIONS, n = pt.instance().settingElement();
		this.createStandardSectionElement(t, e, n);
	}
	createSectionElement(e, t) {
		if (e === l.EXTENSIONS) this.createExtensionSection(t);
		else if (e === l.ACCOUNT && t.length > 0) {
			let e = V(o(l.ACCOUNT), this.syncSection.element);
			this.containerElement.appendChild(e);
		} else t.length > 0 && this.createStandardSectionElement(e, t);
	}
	createStandardSectionElement(e, t, n) {
		let r = o(e), i = document.createElement("div");
		for (let e of t) {
			let t = a.instance().moduleSetting(e.settingName), n = wt(t);
			n && (this.settingToControl.set(t, n), i.appendChild(n));
		}
		n && i.appendChild(n);
		let s = V(r, i);
		this.containerElement.appendChild(s);
	}
	highlightObject(e) {
		if (e instanceof s) {
			let t = this.settingToControl.get(e);
			t ? Et.highlightElement(t) : e.name === "receive-gdp-badges" && this.#t?.then(() => {
				this.syncSection.highlightReceiveBadgesSetting();
			});
		}
	}
}, zt = class e extends E {
	#e;
	experimentToControl = /* @__PURE__ */ new Map();
	containerElement;
	constructor() {
		super({ jslog: `${k("experiments")}` }), this.element.classList.add("settings-tab-container"), this.element.id = "experiments-tab-content", this.containerElement = this.contentElement.createChild("div", "settings-card-container-wrapper").createChild("div"), this.containerElement.classList.add("settings-card-container");
		let e = this.containerElement.createChild("div");
		e.classList.add("experiments-filter"), h(y`
        <devtools-toolbar>
          <devtools-toolbar-input autofocus type="filter" placeholder=${B(z.searchExperiments)} style="flex-grow:1" @change=${this.#t.bind(this)}></devtools-toolbar-input>
        </devtools-toolbar>
    `, e), this.renderExperiments("");
	}
	#t(e) {
		this.renderExperiments(e.detail.toLowerCase());
	}
	renderExperiments(e) {
		this.experimentToControl.clear(), this.#e && this.#e.remove();
		let t = at.allConfigurableExperiments().sort((e, t) => e.title.localeCompare(t.title)).filter((t) => t.title.toLowerCase().includes(e));
		if (t.length) {
			let e = document.createElement("div");
			e.classList.add("settings-experiments-block");
			let n = B(z.theseExperimentsCouldBeUnstable), r = this.createExperimentsWarningSubsection(n);
			for (let n of t) e.appendChild(this.createExperimentCheckbox(n));
			this.#e = V(B(z.experiments), r, e), this.containerElement.appendChild(this.#e), b.alert(B(z.experimentsFound, { n: t.length }));
		} else {
			let e = document.createElement("span");
			e.textContent = B(z.noResults), b.alert(e.textContent), this.#e = V(B(z.experiments), e), this.containerElement.appendChild(this.#e);
		}
	}
	createExperimentsWarningSubsection(e) {
		let t = document.createElement("div");
		t.classList.add("experiments-warning-subsection");
		let n = v("warning");
		t.appendChild(n);
		let r = t.createChild("span");
		return r.textContent = e, t;
	}
	createExperimentCheckbox(e) {
		let t = Te.createWithStringLiteral(e.title, e.isEnabled(), e.name);
		t.classList.add("experiment-label"), t.name = e.name;
		function n() {
			e instanceof j && S.setChromeFlag(e.aboutFlag, t.checked), e.setEnabled(t.checked), O.experimentChanged(e.name, e.isEnabled()), e instanceof j && e.requiresChromeRestart ? he.instance().displayChromeRestartRequiredWarning(B(z.settingsChangedRestartChrome)) : he.instance().displayReloadRequiredWarning(B(z.settingsChangedReloadDevTools));
		}
		t.addEventListener("click", n, !1);
		let r = document.createElement("p");
		this.experimentToControl.set(e, r), r.classList.add("settings-experiment"), r.appendChild(t);
		let i = e.docLink;
		if (i) {
			let t = new Me();
			t.data = {
				iconName: "help",
				variant: u.ICON,
				size: C.SMALL,
				jslogContext: `${e.name}-documentation`,
				title: B(z.learnMore)
			}, t.addEventListener("click", () => d(i)), t.classList.add("link-icon"), r.appendChild(t);
		}
		if (e.feedbackLink) {
			let t = We.create(e.feedbackLink, void 0, void 0, `${e.name}-feedback`);
			t.textContent = B(z.sendFeedback), t.classList.add("feedback-link"), r.appendChild(t);
		}
		return r;
	}
	highlightObject(e) {
		if (e instanceof ct || e instanceof j) {
			let t = this.experimentToControl.get(e);
			t && Et.highlightElement(t);
		}
	}
	wasShown() {
		D.instance().setFlavor(e, this), super.wasShown();
	}
	willHide() {
		super.willHide(), D.instance().setFlavor(e, null);
	}
}, Bt = class {
	handleAction(e, t) {
		switch (t) {
			case "settings.show": return H.showSettingsScreen({ focusTabHeader: !0 }), !0;
			case "settings.documentation": return d("https://developer.chrome.com/docs/devtools/"), !0;
			case "settings.shortcuts": return H.showSettingsScreen({
				name: "keybinds",
				focusTabHeader: !0
			}), !0;
		}
		return !1;
	}
}, Vt = class {
	async reveal(e) {
		let t = D.instance();
		if (e instanceof ct || e instanceof j) {
			S.bringToFront(), await H.showSettingsScreen({ name: "experiments" });
			let n = t.flavor(zt);
			n !== null && n.highlightObject(e);
			return;
		}
		for (let n of a.instance().getRegisteredSettings()) if (Rt.isSettingVisible(n) && n.settingName === e.name) {
			S.bringToFront(), await H.showSettingsScreen();
			let n = t.flavor(Rt);
			n !== null && n.highlightObject(e);
			return;
		}
		for (let t of Ve.instance().getRegisteredViewExtensions()) {
			let n = t.viewId();
			if (t.location() !== ve.SETTINGS_VIEW) continue;
			let r = t.settings();
			if (r && r.indexOf(e.name) !== -1) {
				S.bringToFront(), await H.showSettingsScreen({ name: n });
				let r = await t.widget();
				"highlightObject" in r && typeof r.highlightObject == "function" && r.highlightObject(e);
				return;
			}
		}
	}
}, Ht = class extends E {
	#e;
	constructor(e = Ut) {
		super({ jslog: `${k("greendev-prototypes")}` }), this.element.id = "greendev-prototypes-tab-content", this.#e = e, this.requestUpdate();
	}
	highlightObject(e) {}
	performUpdate() {
		let e = Xe.instance().settings();
		this.#e({ settings: e }, {}, this.element);
	}
}, Ut = (e, t, n) => {
	h(y`
         <div class="settings-card-container">
           <devtools-card .heading=${"GreenDev prototypes"}>
             <div class="experiments-warning-subsection">
              <devtools-icon .name=${"warning"}></devtools-icon>
              <span>${B(z.greenDevUnstable)}</span>
             </div>
             <div class="settings-experiments-block">
               ${Gt(e.settings, [
		"aiAnnotations",
		"beyondStylingGemini",
		"beyondStylingAntigravity",
		"emulationCapabilities"
	])}
             </div>
           </devtools-card>
         </div>
       `, n);
}, Wt = {
	aiAnnotations: "AI auto-annotations",
	beyondStylingGemini: "Beyond Styling (Gemini CLI)",
	beyondStylingAntigravity: "Beyond Styling (Antigravity CLI)",
	emulationCapabilities: "Emulation Capabilities"
};
function Gt(e, t) {
	let { bindToSetting: n } = be;
	function r() {
		he.instance().displayReloadRequiredWarning(B(z.settingsChangedReloadDevTools));
	}
	let i = Object.keys(e).map((i) => {
		let a = i;
		if (!t.includes(a)) return w;
		let o = e[a], s = Wt[a];
		return y`<p class="settings-experiment">
      <devtools-checkbox @change=${r} title=${s} ${n(o)}>${s}</devtools-checkbox>
    </p>`;
	});
	return y`${i}`;
}
//#endregion
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/settings/aiSettingsTab.css.mjs
var Kt = "/*\n * Copyright 2024 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n@scope to (devtools-widget > *){\n  .ai-settings-container {\n    container-type: inline-size;\n    container-name: ai-settings;\n\n    @container ai-settings (min-width: 480px) {\n      .settings-container-wrapper {\n        align-items: center;\n      }\n    }\n  }\n\n  * {\n    box-sizing: border-box;\n    min-height: auto;\n  }\n\n  .shared-disclaimer {\n    background: linear-gradient(135deg, var(--sys-color-gradient-primary), var(--sys-color-gradient-tertiary));\n    border-radius: var(--sys-size-5);\n    padding: var(--sys-size-9) var(--sys-size-11);\n    max-width: var(--sys-size-35);\n    min-width: var(--sys-size-28);\n\n    h2 {\n      font: var(--sys-typescale-headline5);\n      margin: 0 0 var(--sys-size-6);\n    }\n  }\n\n  .disclaimer-list-header {\n    font: var(--sys-typescale-body5-medium);\n    margin: 0;\n  }\n\n  .disclaimer-list {\n    padding: var(--sys-size-6) 0 0;\n    display: grid;\n    grid-template-columns: var(--sys-size-12) auto;\n    gap: var(--sys-size-6) 0;\n    line-height: var(--sys-typescale-body5-line-height);\n  }\n\n  .settings-container {\n    display: grid;\n    grid-template-columns: 1fr auto auto;\n    border-radius: var(--sys-size-5);\n    box-shadow: var(--sys-elevation-level2);\n    margin: var(--sys-size-11) 0 var(--sys-size-4);\n    line-height: var(--sys-typescale-body5-line-height);\n    min-width: var(--sys-size-28);\n    max-width: var(--sys-size-35);\n    background-color: var(--app-color-card-background);\n  }\n\n  .accordion-header {\n    display: grid;\n    grid-template-columns: auto 1fr auto;\n\n    &:hover {\n      background-color: var(--sys-color-state-hover-on-subtle);\n    }\n  }\n\n  .icon-container,\n  .dropdown {\n    padding: 0 var(--sys-size-8);\n  }\n\n  .toggle-container {\n    padding: 0 var(--sys-size-8) 0 var(--sys-size-9);\n\n    &:hover {\n      background-color: var(--sys-color-state-hover-on-subtle);\n    }\n  }\n\n  .expansion-grid {\n    padding: var(--sys-size-4) var(--sys-size-8) var(--sys-size-6);\n    display: grid;\n    grid-template-columns: var(--sys-size-9) auto;\n    gap: var(--sys-size-6) var(--sys-size-8);\n    line-height: var(--sys-typescale-body5-line-height);\n    color: var(--sys-color-on-surface-subtle);\n  }\n\n  .expansion-grid-whole-row {\n    grid-column: span 2;\n    font-weight: var(--ref-typeface-weight-medium);\n    color: var(--sys-color-on-surface);\n    padding-top: var(--sys-size-4);\n    margin: 0;\n    font-size: inherit;\n  }\n\n  .setting-description {\n    color: var(--sys-color-on-surface-subtle);\n  }\n\n  .centered {\n    display: grid;\n    place-content: center;\n  }\n\n  .setting-card {\n    padding: var(--sys-size-6) 0;\n\n    h2 {\n      margin: 0;\n      font: inherit;\n    }\n  }\n\n  .divider {\n    margin: var(--sys-size-5) 0;\n    border-left: var(--sys-size-1) solid var(--sys-color-divider);\n  }\n\n  .accordion-header ~ .accordion-header,\n  .divider ~ .divider,\n  .toggle-container ~ .toggle-container {\n    border-top: var(--sys-size-1) solid var(--sys-color-divider);\n  }\n\n  .whole-row {\n    grid-column: span 5;\n    overflow: hidden;\n    display: grid;\n    grid-template-rows: 0fr;\n    transition: grid-template-rows var(--sys-motion-duration-short4) ease-in;\n  }\n\n  .whole-row.open {\n    grid-template-rows: 1fr;\n  }\n\n  .overflow-hidden {\n    overflow: hidden;\n  }\n\n  .link,\n  .devtools-link {\n    color: var(--sys-color-primary);\n    text-decoration: underline;\n    cursor: pointer;\n    outline-offset: var(--sys-size-2);\n    padding: 0;\n    font-weight: var(--ref-typeface-weight-regular);\n  }\n\n  .padded {\n    padding: var(--sys-size-2) 0;\n  }\n\n  .settings-container-wrapper {\n    position: absolute;\n    inset: var(--sys-size-8) 0 0;\n    overflow: auto;\n    padding: var(--sys-size-3) var(--sys-size-6) var(--sys-size-6);\n    display: flex;\n    flex-direction: column;\n  }\n\n  header {\n    font-size: var(--sys-typescale-headline3-size);\n    font-weight: var(--ref-typeface-weight-regular);\n  }\n\n  .disabled-explainer {\n    background-color: var(--sys-color-surface-yellow);\n    border-radius: var(--sys-shape-corner-medium-small);\n    margin-top: var(--sys-size-11);\n    padding: var(--sys-size-6) var(--sys-size-11) var(--sys-size-8);\n    width: 100%;\n    max-width: var(--sys-size-35);\n    min-width: var(--sys-size-28);\n    color: var(--sys-color-yellow);\n  }\n\n  .disabled-explainer-row {\n    display: flex;\n    gap: var(--sys-size-6);\n    margin-top: var(--sys-size-4);\n  }\n}\n", qt = /* @__PURE__ */ e({
	AISettingsTab: () => en,
	AI_SETTINGS_TAB_DEFAULT_VIEW: () => $t
}), { html: U, nothing: Jt, render: Yt, Directives: { ifDefined: Xt, classMap: Zt } } = pe, W = {
	boostYourProductivity: "Boost your productivity with AI",
	thingsToConsider: "Things to consider",
	experimentalFeatures: "These features use generative AI and may provide inaccurate or offensive information that doesn’t represent Google’s views",
	sendsDataToGoogle: "These features send relevant data to Google. Google collects this data and feedback to improve its products and services with the help of human reviewers. Avoid sharing sensitive or personal information.",
	sendsDataToGoogleNoLogging: "Your content will not be used by human reviewers to improve AI. Your organization may change these settings at any time.",
	dataCollection: "Depending on your region, Google may refrain from data collection",
	dataCollectionNoLogging: "Depending on your Google account management and/or region, Google may refrain from data collection",
	helpUnderstandConsole: "Helps you understand and fix console warnings and errors",
	aIAnnotationsFeatureDescription: "Automatically generate titles for performance trace annotations",
	helpAnnotatePerformance: "Helps you annotate your performance trace with auto-generated labels",
	showMore: "Show more",
	showLess: "Show less",
	whenOn: "When on",
	explainConsole: "Get explanations for console warnings and errors",
	receiveSuggestions: "Receive suggestions and code samples to address these issues",
	consoleInsightsSendsData: "To generate explanations, the console message, associated stack trace, related source code, and the associated network headers are sent to Google. This data may be seen by human reviewers to improve this feature.",
	consoleInsightsSendsDataNoLogging: "To generate explanations, the console message, associated stack trace, related source code, and the associated network headers are sent to Google. This data will not be used to improve Google’s AI models. Your organization may change these settings at any time.",
	termsOfServicePrivacyNotice: "Use of these features is subject to the {PH1} and {PH2}",
	helpUnderstandStyling: "Get help with understanding CSS styles",
	helpUnderstandStylingAndNetworkRequest: "Get help with understanding CSS styles, and network requests",
	helpUnderstandStylingNetworkAndFile: "Get help with understanding CSS styles, network requests, and files",
	helpUnderstandStylingNetworkPerformanceAndFile: "Get help with understanding CSS styles, network requests, performance, and files",
	aiAssistanceDescriptionV2: "Get context-aware help on the inspected page",
	aiAssistanceWhenOnItem1V2: "Debug styling, network, performance, source code, accessibility and storage issues with DevTools AI assistance",
	aiAssistanceWhenOnItem2V2: "Follow the agent's reasoning step-by-step and quickly jump to the relevant source data",
	aiAssistanceThingsToConsiderV2: "To generate explanations, chat messages, data accessible for this site via DevTools panels and Web APIs, and items you select such as network requests, files, and performance traces are sent to Google and may be seen by human reviewers to improve this feature. This is an experimental AI feature and won’t always get it right.",
	aiAssistanceThingsToConsiderNoLoggingV2: "To generate explanations, chat messages, data accessible for this site via DevTools panels and Web APIs, and items you select such as network requests, files, and performance traces are sent to Google. The content you submit and that is generated by this feature will not be used to improve Google’s AI models. This is an experimental AI feature and won’t always get it right.",
	helpUnderstandCodeSuggestions: "Write code faster with AI-powered suggestions",
	learnMore: "Learn more",
	explainStyling: "Understand CSS styles with AI-powered insights",
	explainStylingAndNetworkRequest: "Understand CSS styles, and network activity with AI-powered insights",
	explainStylingNetworkAndFile: "Understand CSS styles, network activity, and file origins with AI-powered insights",
	explainStylingNetworkPerformanceAndFile: "Understand CSS styles, network activity, performance bottlenecks, and file origins with AI-powered insights",
	receiveStylingSuggestions: "Improve your development workflow with contextual explanations and suggestions",
	freestylerSendsData: "To generate explanations, your chat messages, any data the inspected page can see using Web APIs, and the items you select such as files, network requests, and performance traces are sent to Google. This data may be seen by human reviewers to improve this feature. Don’t use on pages with personal or sensitive information.",
	freestylerSendsDataNoLogging: "To generate explanations, your chat messages, any data the inspected page can see using Web APIs, and the items you select such as files, network requests, and performance traces are sent to Google. This data will not be used to improve Google’s AI models. Your organization may change these settings at any time.",
	generatedAiAnnotationsSendData: "To generate annotation suggestions, your performance trace is sent to Google. This data may be seen by human reviewers to improve this feature.",
	generatedAiAnnotationsSendDataNoLogging: "To generate annotation suggestions, your performance trace is sent to Google. This data will not be used to improve Google’s AI models. Your organization may change these settings at any time.",
	asYouTypeCodeSuggestions: "As you type in the Console or Sources panel, you’ll get code suggestions. Press Tab to accept one.",
	asYouTypeRelevantDataIsBeingSentToGoogle: "As you type, relevant data is being sent to Google to generate code suggestions. Press Tab to accept.",
	describeCodeInComment: "In Console or Sources, describe the code you need in a comment, then press Ctrl+I to generate it.",
	describeCodeInCommentForMacOs: "In Console or Sources, describe the code you need in a comment, then press Cmd+I to generate it.",
	codeSuggestionsSendData: "To generate code suggestions, your console input, the history of your current console session, the currently inspected CSS, and the contents of the currently open file are shared with Google. This data may be seen by human reviewers to improve this feature.",
	codeSuggestionsSendDataNoLogging: "To generate code suggestions, your console input, the history of your current console session, the currently inspected CSS, and the contents of the currently open file are shared with Google. This data will not be used to improve Google’s AI models. Your organization may change these settings at any time.",
	termsOfService: "Google Terms of Service",
	privacyNotice: "Google Privacy Policy",
	enableConsoleInsights: "Enable `Console insights`",
	enableAiAssistance: "Enable AI assistance",
	enableAiSuggestedAnnotations: "Enable AI suggestions for performance panel annotations",
	enableAiCodeSuggestions: "Enable AI code suggestions"
}, Qt = r("panels/settings/AISettingsTab.ts", W), G = n.bind(void 0, Qt), $t = (e, t, n) => {
	let r = e.disabledReasons.length ? U`
    <div class="disabled-explainer">
      ${e.disabledReasons.map((e) => U`
        <div class="disabled-explainer-row">
          <devtools-icon name="warning" class="medium" style="color: var(--icon-warning);">
          </devtools-icon>
          ${e}
        </div>
      `)}
    </div>
  ` : Jt, i = U`
    <div class="shared-disclaimer">
      <h2>${G(W.boostYourProductivity)}</h2>
      <h3 class="disclaimer-list-header">${G(W.thingsToConsider)}</h3>
      <div class="disclaimer-list">
        ${e.sharedDisclaimerBulletPoints.map((e) => U`<div><devtools-icon .name=${e.icon} class="medium"></devtools-icon>
              </div><div>${e.text}</div>`)}
      </div>
    </div>
  `, a = (e) => U`
      <div>
        <devtools-icon class="extra-large" .name=${e.iconName}>
        </devtools-icon>
      </div>
      <div class="padded">${e.text}</div>
    `, o = e.disabledReasons.length > 0, s = e.disabledReasons.join("\n") || void 0, c = Array.from(e.settingToParams.keys()).map((t) => {
		let n = e.settingToParams.get(t);
		if (!n) return Jt;
		let r = {
			"whole-row": !0,
			open: n.settingExpandState.isSettingExpanded
		}, i = n.settingExpandState.isSettingExpanded ? "0" : "-1";
		return U`
      <div class="accordion-header" @click=${e.expandSetting.bind(void 0, t)}>
        <div class="icon-container centered">
          <devtools-icon name=${n.iconName}></devtools-icon>
        </div>
        <div class="setting-card">
          <h2>${n.settingName}</h2>
          <div class="setting-description">${n.settingDescription}</div>
        </div>
        <div class="dropdown centered">
          <devtools-button
            .data=${{
			title: n.settingExpandState.isSettingExpanded ? G(W.showLess) : G(W.showMore),
			size: C.SMALL,
			iconName: n.settingExpandState.isSettingExpanded ? "chevron-up" : "chevron-down",
			variant: u.ICON,
			jslogContext: n.settingExpandState.expandSettingJSLogContext
		}}
          ></devtools-button>
        </div>
      </div>
      <div class="divider"></div>
      <div class="toggle-container centered"
        title=${Xt(s)}
        @click=${e.toggleSetting.bind(void 0, t)}
      >
        <devtools-switch
          .checked=${!!t.get() && !o}
          .jslogContext=${t.name || ""}
          .disabled=${o}
          .label=${s || n.enableSettingText}
          data-testid=${n.enableSettingText}
          @switchchange=${e.toggleSetting.bind(void 0, t)}
        ></devtools-switch>
      </div>
      <div class=${Zt(r)}>
        <div class="overflow-hidden">
          <div class="expansion-grid">
            <h3 class="expansion-grid-whole-row">${G(W.whenOn)}</h3>
            ${n.settingItems.map((e) => a(e))}
            <h3 class="expansion-grid-whole-row">${G(W.thingsToConsider)}</h3>
            ${n.toConsiderSettingItems.map((e) => a(e))}
            <div class="expansion-grid-whole-row">
              <devtools-link
                href=${n.learnMoreLink.url}
                class="link"
                tabindex=${i}
                .jslogContext=${n.learnMoreLink.linkJSLogContext}
              >${G(W.learnMore)}</devtools-link>
            </div>
          </div>
        </div>
      </div>
    `;
	});
	Yt(U`
    <style>${Tt}</style>
    <style>${Kt}</style>
    <div class="ai-settings-container">
    <div class="settings-container-wrapper" jslog=${k("chrome-ai")}>
      ${i}
      ${e.settingToParams.size ? U`
        ${r}
        <div class="settings-container">
          ${c}
        </div>
      ` : Jt}
    </div></div>
  `, n);
}, en = class extends E {
	#e;
	#t;
	#n;
	#r;
	#i;
	#a = te.NO_ACCOUNT_EMAIL;
	#o;
	#s = /* @__PURE__ */ new Map();
	constructor(e) {
		super();
		try {
			this.#t = a.instance().moduleSetting("console-insights-enabled");
		} catch {
			this.#t = void 0;
		}
		try {
			this.#r = a.instance().moduleSetting("ai-assistance-enabled");
		} catch {
			this.#r = void 0;
		}
		M.devToolsAiGeneratedTimelineLabels?.enabled && (this.#n = a.instance().createSetting("ai-annotations-enabled", !1)), M.devToolsAiCodeCompletion?.enabled && (this.#i = a.instance().createSetting("ai-code-completion-enabled", !1)), this.#o = this.#l.bind(this), this.#c(), this.#e = e ?? $t;
	}
	performUpdate() {
		let e = {
			disabledReasons: gt(this.#a),
			sharedDisclaimerBulletPoints: this.#m(),
			settingToParams: this.#s,
			expandSetting: this.#f.bind(this),
			toggleSetting: this.#p.bind(this)
		};
		this.#e(e, void 0, this.contentElement);
	}
	wasShown() {
		super.wasShown(), Ae.instance().addEventListener(Se.AIDA_AVAILABILITY_CHANGED, this.#o), this.#l(), this.requestUpdate();
	}
	willHide() {
		super.willHide(), Ae.instance().removeEventListener(Se.AIDA_AVAILABILITY_CHANGED, this.#o);
	}
	#c() {
		let e = M.aidaAvailability?.enterprisePolicyValue === ot.ALLOW_WITHOUT_LOGGING;
		if (this.#t) {
			let t = {
				settingName: i("Console Insights"),
				iconName: "lightbulb-spark",
				settingDescription: G(W.helpUnderstandConsole),
				enableSettingText: G(W.enableConsoleInsights),
				settingItems: [{
					iconName: "lightbulb",
					text: G(W.explainConsole)
				}, {
					iconName: "code",
					text: G(W.receiveSuggestions)
				}],
				toConsiderSettingItems: [{
					iconName: "google",
					text: G(e ? W.consoleInsightsSendsDataNoLogging : W.consoleInsightsSendsData)
				}],
				learnMoreLink: {
					url: "https://developer.chrome.com/docs/devtools/console/understand-messages",
					linkJSLogContext: "learn-more.console-insights"
				},
				settingExpandState: {
					isSettingExpanded: !1,
					expandSettingJSLogContext: "console-insights.accordion"
				}
			};
			this.#s.set(this.#t, t);
		}
		if (this.#r) {
			let t = M.devToolsAiAssistanceV2?.enabled, n = {
				settingName: i(lt() ? "Gemini in Chrome DevTools" : "AI assistance"),
				iconName: ft(),
				settingDescription: this.#u(),
				enableSettingText: G(W.enableAiAssistance),
				settingItems: [{
					iconName: "info",
					text: this.#d()
				}, {
					iconName: "pen-spark",
					text: G(t ? W.aiAssistanceWhenOnItem2V2 : W.receiveStylingSuggestions)
				}],
				toConsiderSettingItems: [{
					iconName: "google",
					text: G(t ? e ? W.aiAssistanceThingsToConsiderNoLoggingV2 : W.aiAssistanceThingsToConsiderV2 : e ? W.freestylerSendsDataNoLogging : W.freestylerSendsData)
				}],
				learnMoreLink: {
					url: "https://developer.chrome.com/docs/devtools/ai-assistance",
					linkJSLogContext: "learn-more.ai-assistance"
				},
				settingExpandState: {
					isSettingExpanded: !1,
					expandSettingJSLogContext: "freestyler.accordion"
				}
			};
			this.#s.set(this.#r, n);
		}
		if (this.#n) {
			let t = {
				settingName: i("Auto annotations"),
				iconName: "pen-spark",
				settingDescription: G(W.aIAnnotationsFeatureDescription),
				enableSettingText: G(W.enableAiSuggestedAnnotations),
				settingItems: [{
					iconName: "label-auto",
					text: G(W.helpAnnotatePerformance)
				}],
				toConsiderSettingItems: [{
					iconName: "google",
					text: G(e ? W.generatedAiAnnotationsSendDataNoLogging : W.generatedAiAnnotationsSendData)
				}],
				learnMoreLink: {
					url: "https://developer.chrome.com/docs/devtools/performance/annotations#auto-annotations",
					linkJSLogContext: "learn-more.auto-annotations"
				},
				settingExpandState: {
					isSettingExpanded: !1,
					expandSettingJSLogContext: "auto-annotations.accordion"
				}
			};
			this.#s.set(this.#n, t);
		}
		if (this.#i) {
			let t = M.devToolsAiCodeGeneration?.enabled ? [{
				iconName: "code",
				text: G(W.asYouTypeRelevantDataIsBeingSentToGoogle)
			}, {
				iconName: "text-analysis",
				text: me() ? G(W.describeCodeInCommentForMacOs) : G(W.describeCodeInComment)
			}] : [{
				iconName: "code",
				text: G(W.asYouTypeCodeSuggestions)
			}], n = {
				settingName: i("Code suggestions"),
				iconName: "text-analysis",
				settingDescription: G(W.helpUnderstandCodeSuggestions),
				enableSettingText: G(W.enableAiCodeSuggestions),
				settingItems: t,
				toConsiderSettingItems: [{
					iconName: "google",
					text: G(e ? W.codeSuggestionsSendDataNoLogging : W.codeSuggestionsSendData)
				}],
				learnMoreLink: {
					url: " https://developers.chrome.com/docs/devtools/ai-assistance/code-completion",
					linkJSLogContext: "learn-more.code-completion"
				},
				settingExpandState: {
					isSettingExpanded: !1,
					expandSettingJSLogContext: "code-completion.accordion"
				}
			};
			this.#s.set(this.#i, n);
		}
	}
	async #l() {
		let e = await Ee.checkAccessPreconditions();
		e !== this.#a && (this.#a = e, this.requestUpdate());
	}
	#u() {
		let { hostConfig: e } = st;
		return e.devToolsAiAssistanceV2?.enabled ? G(W.aiAssistanceDescriptionV2) : e.devToolsAiAssistancePerformanceAgent?.enabled ? G(W.helpUnderstandStylingNetworkPerformanceAndFile) : e.devToolsAiAssistanceFileAgent?.enabled ? G(W.helpUnderstandStylingNetworkAndFile) : e.devToolsAiAssistanceNetworkAgent?.enabled ? G(W.helpUnderstandStylingAndNetworkRequest) : G(W.helpUnderstandStyling);
	}
	#d() {
		let { hostConfig: e } = st;
		return e.devToolsAiAssistanceV2?.enabled ? G(W.aiAssistanceWhenOnItem1V2) : e.devToolsAiAssistancePerformanceAgent?.enabled ? G(W.explainStylingNetworkPerformanceAndFile) : e.devToolsAiAssistanceFileAgent?.enabled ? G(W.explainStylingNetworkAndFile) : e.devToolsAiAssistanceNetworkAgent?.enabled ? G(W.explainStylingAndNetworkRequest) : G(W.explainStyling);
	}
	#f(e) {
		let t = this.#s.get(e);
		t && (t.settingExpandState.isSettingExpanded = !t.settingExpandState.isSettingExpanded, this.requestUpdate());
	}
	#p(e, t) {
		if (t.target instanceof ut && t.type !== ht.eventName) return;
		let n = this.#s.get(e);
		if (!n) return;
		let r = e.get();
		e.set(!r), !r && !n.settingExpandState.isSettingExpanded && (n.settingExpandState.isSettingExpanded = !0), e.name === "console-insights-enabled" ? r ? a.instance().createLocalSetting("console-insights-onboarding-finished", !1).set(!1) : a.instance().createSetting("console-insights-skip-reminder", !0, ee.SESSION).set(!0) : e.name === "ai-assistance-enabled" && (e.get() || xt.instance().deleteAll(), M.devToolsAiAssistanceV2?.enabled && e.get() && a.instance().moduleSetting("ai-assistance-v2-opt-in-change-dialog-seen").set(!0)), this.requestUpdate();
	}
	#m() {
		let e = U`<devtools-link href="https://policies.google.com/terms" .jslogContext=${"terms-of-service"}>${G(W.termsOfService)}</devtools-link>`, t = U`<devtools-link href="https://policies.google.com/privacy" .jslogContext=${"privacy-notice"}>${G(W.privacyNotice)}</devtools-link>`, n = M.aidaAvailability?.enterprisePolicyValue === ot.ALLOW_WITHOUT_LOGGING;
		return [
			{
				icon: "psychiatry",
				text: G(W.experimentalFeatures)
			},
			{
				icon: "google",
				text: G(n ? W.sendsDataToGoogleNoLogging : W.sendsDataToGoogle)
			},
			{
				icon: "corporate-fare",
				text: G(n ? W.dataCollectionNoLogging : W.dataCollection)
			},
			{
				icon: "policy",
				text: Ct(Qt, W.termsOfServicePrivacyNotice, {
					PH1: e,
					PH2: t
				})
			}
		];
	}
}, tn = "/*\n * Copyright 2015 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n@scope to (devtools-widget > *) {\n  .excluded-folder-header {\n    display: flex;\n    flex-direction: column;\n    min-height: var(--sys-size-16);\n    padding: var(--sys-size-4) var(--sys-size-6);\n    gap: var(--sys-size-4);\n\n    & > .excluded-folder-url {\n      color: var(--sys-color-on-surface-subtle);\n      overflow-wrap: break-word;\n    }\n  }\n\n  .exclude-subfolders-table {\n    padding: var(--sys-size-4) 0;\n  }\n\n  .excluded-folder-error {\n    color: var(--sys-color-error);\n  }\n}\n", nn = /* @__PURE__ */ e({
	DEFAULT_VIEW: () => cn,
	EditFileSystemView: () => ln,
	ExcludedFolderStatus: () => on
}), { styleMap: rn } = je, K = {
	url: "URL",
	excludedFolders: "Excluded sub-folders",
	enterAPath: "Enter a path",
	enterAUniquePath: "Enter a unique path"
}, an = r("panels/settings/EditFileSystemView.ts", K), q = n.bind(void 0, an), on = /* @__PURE__ */ function(e) {
	return e[e.VALID = 1] = "VALID", e[e.ERROR_NOT_A_PATH = 2] = "ERROR_NOT_A_PATH", e[e.ERROR_NOT_UNIQUE = 3] = "ERROR_NOT_UNIQUE", e;
}({});
function sn(e) {
	switch (e) {
		case 2: return q(K.enterAPath);
		case 3: return q(K.enterAUniquePath);
		case 1: throw Error("unreachable");
	}
}
var cn = (e, t, n) => {
	h(y`
      <style>${tn}</style>
      <div class="excluded-folder-header">
        <span>${q(K.url)}</span>
        <span class="excluded-folder-url">${e.fileSystemPath}</span>
        <devtools-data-grid
          @create=${e.onCreate}
          class="exclude-subfolders-table"
          parts="excluded-folder-row-with-error"
          inline striped>
          <table>
            <thead>
              <tr>
                <th id="url" editable>${q(K.excludedFolders)}</th>
              </tr>
            </thead>
            <tbody>
            ${e.excludedFolderPaths.map((t, n) => y`
              <tr data-url=${t.path} data-index=${n}
                  @edit=${e.onEdit}
                  @delete=${e.onDelete}>
                <td style=${rn({ backgroundColor: t.status === 1 ? void 0 : "var(--sys-color-error-container)" })}>${t.path}</td>
              </tr>
            `)}
            <tr placeholder></tr>
            </tbody>
          </table>
        </devtools-data-grid>
        ${e.excludedFolderPaths.filter(({ status: e }) => e !== 1).map(({ status: e }) => y`<span class="excluded-folder-error">${sn(e)}</span>`)}
    </div>`, n);
}, ln = class e extends E {
	#e;
	#t = [];
	#n;
	constructor(e, t = cn) {
		super(e), this.#n = t;
	}
	set fileSystem(e) {
		this.#e = e, this.#r(), this.requestUpdate();
	}
	wasShown() {
		super.wasShown(), this.#r(), this.requestUpdate();
	}
	#r() {
		this.#t = this.#e?.excludedFolders().values().map((e) => ({
			path: e,
			status: 1
		})).toArray() ?? [];
	}
	performUpdate() {
		let e = {
			fileSystemPath: this.#e?.path() ?? it``,
			excludedFolderPaths: this.#t,
			onCreate: (e) => this.#i(e.detail.url),
			onEdit: (e) => this.#a(e.currentTarget.dataset.index ?? "-1", e.detail.valueBeforeEditing, e.detail.newText),
			onDelete: (e) => this.#o(e.currentTarget.dataset.index ?? "-1")
		};
		this.#n(e, {}, this.contentElement);
	}
	#i(e) {
		if (e === void 0) return;
		let t = this.#s(e);
		this.#t.push(t), t.status === 1 && this.#e?.addExcludedFolder(t.path), this.requestUpdate();
	}
	#a(e, t, n) {
		let r = Number.parseInt(e, 10);
		if (r < 0 || r >= this.#t.length) return;
		let i = this.#s(n), a = this.#t[r];
		this.#t[r] = i, a.status === 1 && this.#e?.removeExcludedFolder(t), i.status === 1 && this.#e?.addExcludedFolder(i.path), this.requestUpdate();
	}
	#o(e) {
		let t = Number.parseInt(e, 10);
		t < 0 || t >= this.#t.length || (this.#e?.removeExcludedFolder(this.#t[t].path), this.#t.splice(t, 1), this.requestUpdate());
	}
	#s(t) {
		let n = e.#c(t.trim());
		return n ? this.#t.findIndex(({ path: e }) => e === n) === -1 ? {
			path: n,
			status: 1
		} : {
			path: n,
			status: 3
		} : {
			path: n,
			status: 2
		};
	}
	static #c(e) {
		return e ? e + (e[e.length - 1] === "/" ? "" : "/") : "";
	}
}, un = "/*\n * Copyright 2015 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.ignore-list-option {\n  flex: none;\n  display: flex;\n  align-items: center;\n  height: var(--sys-size-13);\n}\n\n.ignore-list-option devtools-button {\n  cursor: pointer;\n  position: relative;\n  top: var(--sys-size-2);\n  margin-left: var(--sys-size-2);\n}\n\n.add-button {\n  padding: var(--sys-size-5) var(--sys-size-6);\n  align-self: flex-start;\n  flex: none;\n}\n\n.ignore-list {\n  flex: 0 1 auto;\n}\n\n.enable-ignore-listing,\n.ignore-list-item,\n.general-exclusion-group {\n  padding-left: var(--sys-size-4);\n}\n\n.custom-exclusion-group {\n  padding-left: 0;\n  padding-right: 0;\n}\n\n.ignore-list-item {\n  height: var(--sys-size-13);\n  display: flex;\n  align-items: center;\n  position: relative;\n  flex: auto 1 1;\n}\n\n.ignore-list-pattern {\n  flex: auto;\n}\n\n.ignore-list-item > devtools-checkbox {\n  width: 100%;\n}\n\n.ignore-list-item .ignore-list-pattern {\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  user-select: none;\n  color: var(--sys-color-on-surface);\n  overflow: hidden;\n}\n\n.ignore-list-edit-row {\n  flex: none;\n  display: flex;\n  flex-direction: row;\n  margin: 6px 5px;\n  align-items: center;\n}\n\n.ignore-list-edit-row input,\n.ignore-list-edit-row select {\n  width: 100%;\n  text-align: inherit;\n}\n\n.list:has(.ignore-list-empty),\n.list:has(.ignore-list-edit-row),\n.list:has(.ignore-list-item) {\n  border: none;\n}\n\n.editor-container:has(.ignore-list-edit-row) {\n  background: var(--sys-color-surface1);\n  border-radius: 10px;\n}\n\n.ignore-list.list-editing ~ .add-button {\n  display: none;\n}\n\n.devtools-link:has(devtools-icon) {\n  margin-left: 6px;\n}\n", dn = /* @__PURE__ */ e({ FrameworkIgnoreListSettingsTab: () => pn }), J = {
	frameworkIgnoreList: "Ignore listing",
	ignoreListingDescription: "When enabled, the debugger will skip over ignore-listed scripts and will ignore exceptions that only affect them and the Performance panel will collapse matching flamechart items.",
	ignoreListContentScripts: "Content scripts injected by extensions",
	ignoreListAnonymousScripts: "Anonymous scripts from eval or console",
	automaticallyIgnoreListKnownThirdPartyScripts: "Known third-party scripts from source maps",
	ignoreListing: "Ignore listing",
	enableIgnoreListingTooltip: "Uncheck to disable all ignore listing",
	generalExclusionRules: "General exclusion rules",
	customExclusionRules: "Custom exclusion rules",
	addPattern: "Add regex rule",
	addFilenamePattern: "Add a regular expression rule for the script's URL",
	ignoreScriptsWhoseNamesMatchS: "Ignore scripts whose names match ''{PH1}''",
	pattern: "Add a regular expression rule for the script's URL",
	patternCannotBeEmpty: "Rule can't be empty",
	patternAlreadyExists: "Rule already exists",
	patternMustBeAValidRegular: "Rule must be a valid regular expression",
	learnMore: "Learn more"
}, fn = r("panels/settings/FrameworkIgnoreListSettingsTab.ts", J), Y = n.bind(void 0, fn), pn = class extends E {
	list;
	setting;
	editor;
	constructor() {
		super({
			jslog: `${k("blackbox")}`,
			useShadowDom: !0
		}), this.registerRequiredCSS(un, R);
		let e = this.contentElement.createChild("div", "settings-card-container-wrapper").createChild("div");
		e.classList.add("settings-card-container", "ignore-list-settings");
		let t = document.createElement("span");
		t.textContent = Y(J.ignoreListingDescription);
		let n = a.instance().moduleSetting("enable-ignore-listing"), r = this.contentElement.createChild("div", "enable-ignore-listing");
		r.appendChild(P(Y(J.ignoreListing), n)), we.install(r, Y(J.enableIgnoreListingTooltip));
		let i = e.createChild("devtools-card");
		i.heading = Y(J.frameworkIgnoreList), i.append(t, r);
		let o = this.createSettingGroup();
		o.classList.add("general-exclusion-group");
		let s = o.createChild("div", "ignore-list-option").appendChild(P(Y(J.ignoreListContentScripts), a.instance().moduleSetting("skip-content-scripts"))), c = o.createChild("div", "ignore-list-option"), ee = c.appendChild(P(Y(J.automaticallyIgnoreListKnownThirdPartyScripts), a.instance().moduleSetting("automatically-ignore-list-known-third-party-scripts"))), l = new Me();
		l.data = {
			iconName: "help",
			variant: u.ICON,
			size: C.SMALL,
			jslogContext: "learn-more",
			title: Y(J.learnMore)
		}, l.addEventListener("click", () => d("https://developer.chrome.com/docs/devtools/settings/ignore-list/#skip-third-party")), c.appendChild(l);
		let te = o.createChild("div", "ignore-list-option").appendChild(P(Y(J.ignoreListAnonymousScripts), a.instance().moduleSetting("skip-anonymous-scripts"))), ne = e.createChild("devtools-card", "ignore-list-options");
		ne.heading = Y(J.generalExclusionRules), ne.append(o);
		let p = this.createSettingGroup();
		p.classList.add("custom-exclusion-group");
		let m = e.createChild("devtools-card", "ignore-list-options");
		m.heading = Y(J.customExclusionRules), m.append(p), this.list = new xe(this), this.list.element.classList.add("ignore-list"), this.list.registerRequiredCSS(un);
		let h = document.createElement("div");
		h.classList.add("ignore-list-empty"), this.list.setEmptyPlaceholder(h), this.list.show(p);
		let g = T(Y(J.addPattern), this.addButtonClicked.bind(this), {
			className: "add-button",
			jslogContext: "settings.add-ignore-list-pattern"
		});
		f(g, Y(J.addFilenamePattern)), p.appendChild(g), this.setting = a.instance().moduleSetting("skip-stack-frames-pattern"), this.setting.addChangeListener(this.settingUpdated, this);
		let re = () => {
			let e = n.get();
			s.disabled = !e, ee.disabled = !e, l.disabled = !e, te.disabled = !e, g.disabled = !e, this.settingUpdated();
		};
		n.addChangeListener(re), re();
	}
	wasShown() {
		super.wasShown(), this.settingUpdated();
	}
	settingUpdated() {
		let e = a.instance().moduleSetting("enable-ignore-listing").get();
		this.list.clear();
		let t = this.setting.getAsArray();
		for (let n = 0; n < t.length; ++n) this.list.appendItem(t[n], e);
	}
	addButtonClicked() {
		this.list.addNewItem(this.setting.getAsArray().length, {
			pattern: "",
			disabled: !1
		});
	}
	createSettingGroup() {
		let e = document.createElement("div");
		return e.classList.add("ignore-list-option-group"), Ne(e), e;
	}
	renderItem(e, t) {
		let n = document.createElement("div"), r = this.setting, i = Te.createWithStringLiteral(e.pattern, !e.disabled, "settings.ignore-list-pattern"), a = Y(J.ignoreScriptsWhoseNamesMatchS, { PH1: e.pattern });
		return we.install(i, a), i.ariaLabel = a, i.addEventListener("change", o, !1), i.disabled = !t, n.appendChild(i), n.classList.add("ignore-list-item"), n;
		function o() {
			let t = !i.checked;
			e.disabled !== t && (e.disabled = t, e.disabledForUrl = void 0, r.setAsArray(r.getAsArray()));
		}
	}
	removeItemRequested(e, t) {
		let n = this.setting.getAsArray();
		n.splice(t, 1), this.setting.setAsArray(n);
	}
	commitEdit(e, t, n) {
		e.pattern = t.control("pattern").value.trim();
		let r = this.setting.getAsArray();
		n && r.push(e), this.setting.setAsArray(r);
	}
	beginEdit(e) {
		let t = this.createEditor();
		return t.control("pattern").value = e.pattern, t;
	}
	createEditor() {
		if (this.editor) return this.editor;
		let e = new tt();
		this.editor = e;
		let t = e.contentElement(), n = t.createChild("div", "ignore-list-edit-row");
		n.createChild("div", "ignore-list-pattern").textContent = Y(J.pattern);
		let r = t.createChild("div", "ignore-list-edit-row"), i = e.createInput("pattern", "text", "/framework\\.js$", a.bind(this));
		return f(i, Y(J.pattern)), r.createChild("div", "ignore-list-pattern").appendChild(i), e;
		function a(e, t, n) {
			let r = n.value.trim(), i = this.setting.getAsArray();
			if (!r.length) return {
				valid: !1,
				errorMessage: Y(J.patternCannotBeEmpty)
			};
			for (let e = 0; e < i.length; ++e) if (e !== t && i[e].pattern === r) return {
				valid: !1,
				errorMessage: Y(J.patternAlreadyExists)
			};
			let a;
			try {
				a = new RegExp(r);
			} catch {}
			return a ? { valid: !0 } : {
				valid: !1,
				errorMessage: Y(J.patternMustBeAValidRegular)
			};
		}
	}
}, mn = "/*\n * Copyright 2020 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.shortcut-list {\n  padding-left: 0;\n  padding-right: 0;\n}\n\n.keybinds-key {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: var(--sys-size-11);\n  min-width: var(--sys-size-11);\n  font: var(--sys-typescale-body5-medium);\n  white-space: nowrap;\n  border-radius: var(--sys-shape-corner-small);\n  background: var(--sys-color-tonal-container);\n  padding: 0 var(--sys-size-4);\n}\n\n.keybinds-list-item {\n  margin: 0 var(--sys-size-6);\n  padding: var(--sys-size-4) 0;\n  display: grid;\n  grid-template-rows: 1fr;\n  grid-template-columns: 1fr 30px 2fr 30px 30px;\n  border-top: var(--sys-size-1) solid var(--app-color-card-divider);\n}\n\n.keybinds-list-item:focus-visible {\n  background-color: var(--sys-color-tonal-container);\n}\n\n.keybinds-list-item-wrapper:has(.keybinds-list-item.keybinds-editing) {\n  background-color: var(--sys-color-neutral-container);\n}\n\n.keybinds-list-text.keybinds-action-name {\n  grid-row: 1 / 1;\n}\n\n.keybinds-shortcut,\n.keybinds-info {\n  grid-row: auto;\n  grid-column: 3 / span 1;\n}\n\n.keybinds-error {\n  color: var(--sys-color-error);\n}\n\n.keybinds-shortcut {\n  gap: var(--sys-size-4);\n}\n\n.keybinds-list-item.keybinds-editing .keybinds-shortcut {\n  display: flex;\n}\n\n.keybinds-modified {\n  grid-column: 2 / span 1;\n  margin-top: var(--sys-size-3);\n}\n\n.keybinds-list-item button[disabled] {\n  opacity: 40%;\n}\n\n.keybinds-cancel-button {\n  grid-column: -1 / span 1;\n}\n\n.keybinds-edit-button {\n  display: none;\n  grid-row: 1 / span 1;\n  grid-column: 5 / span 1;\n}\n\n.keybinds-list-item:not(.keybinds-editing):hover .keybinds-edit-button,\n.keybinds-list-item:not(.keybinds-editing):focus-within .keybinds-edit-button {\n  display: inline-block;\n}\n\n.keybinds-list-text {\n  min-height: var(--sys-size-12);\n  display: flex;\n  align-items: center;\n  user-select: none;\n  color: var(--sys-color-on-surface);\n  text-align: start;\n  position: relative;\n  margin-right: 0;\n}\n\n.keybinds-category-header {\n  display: flex;\n  align-items: center;\n  font: var(--sys-typescale-body4-bold);\n  height: var(--sys-size-13);\n  padding: var(--sys-size-4) var(--sys-size-7);\n  white-space: nowrap;\n\n  + .keybinds-list-item-wrapper > .keybinds-list-item {\n    border-top: unset;\n  }\n}\n\n.keybinds-list-item-wrapper:has(.keybinds-list-item:hover),\n.keybinds-list-item-wrapper:has(\n  .keybinds-list-item:not(.keybinds-editing)):focus-within {\n  background: var(--sys-color-state-hover-on-subtle);\n}\n\n.keybinds-set-select label p {\n  display: inline;\n  color: var(--sys-color-on-surface);\n}\n\nbutton.text-button {\n  width: fit-content;\n  align-self: flex-end;\n}\n\n.keybinds-list-text input {\n  margin: 0 2px;\n}\n\n.keybinds-set-select {\n  margin: 0;\n  padding: var(--sys-size-5) var(--sys-size-7);\n\n  & .settings-select {\n    display: flex;\n    justify-content: space-between;\n\n    & label {\n      padding: 0;\n    }\n  }\n}\n\n.keybinds-list-text:has(.keybinds-delete-button) {\n  grid-column: 3 / -1;\n}\n\n.keybinds-delete-button {\n  flex-shrink: 0;\n}\n\n.docs-link.devtools-link {\n  align-self: flex-start;\n  min-height: 2em;\n  line-height: 2em;\n  margin-bottom: 4px;\n}\n\n.keybinds-footer {\n  padding: var(--sys-size-5) var(--sys-size-7);\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: space-between;\n  min-height: fit-content;\n  margin-top: 10px;\n}\n\n@media (forced-colors: active) {\n  .keybinds-list-item.keybinds-editing .keybinds-shortcut {\n    & devtools-button {\n      --sys-color-primary: buttonFace;\n    }\n  }\n\n  .keybinds-list-text input {\n    color: buttonText;\n  }\n\n  /* Keyboard focus / hover on wrapper element (shortcut items) */\n  .keybinds-list-item-wrapper {\n    &:has(.keybinds-list-item:hover),\n    &:has(.keybinds-list-item:not(.keybinds-editing)):focus-within,\n    &:focus,\n    &:focus-visible {\n      background-color: Highlight;\n      forced-color-adjust: none;\n\n      --icon-default: HighlightText;\n\n      & .keybinds-list-text,\n      & .keybinds-action-name {\n        color: HighlightText;\n      }\n\n      & .keybinds-key {\n        background: HighlightText;\n        color: Highlight;\n      }\n    }\n  }\n\n  /* Editing state */\n  .keybinds-list-item-wrapper:has(.keybinds-list-item.keybinds-editing) {\n    background-color: Highlight;\n    forced-color-adjust: none;\n\n    --icon-default: HighlightText;\n\n    & .keybinds-list-text {\n      color: HighlightText;\n    }\n\n    & .keybinds-error {\n    color: highlightText;\n    }\n  }\n}\n", hn = /* @__PURE__ */ e({
	KeybindsSettingsTab: () => _n,
	ShortcutListItem: () => vn
}), X = {
	shortcuts: "Shortcuts",
	matchShortcutsFromPreset: "Shortcut preset",
	keyboardShortcutsList: "Keyboard shortcuts list",
	shortcutModified: "Shortcut modified",
	noShortcutForAction: "No shortcut for action",
	addAShortcut: "Add a shortcut",
	recordingKeys: "Recoding keys",
	confirmChanges: "Confirm changes",
	discardChanges: "Discard changes",
	removeShortcut: "Remove shortcut",
	editShortcut: "Edit shortcut",
	shortcutsCannotContainOnly: "Shortcuts cannot contain only modifier keys.",
	thisShortcutIsInUseByS: "This shortcut is in use by {PH1}: {PH2}.",
	RestoreDefaultShortcuts: "Restore default shortcuts",
	FullListOfDevtoolsKeyboard: "Full list of DevTools keyboard shortcuts and gestures",
	ResetShortcutsForAction: "Reset shortcuts for action",
	shortcutRemoved: "{PH1} Shortcut removed",
	shortcutChangesRestored: "Changes to shortcut restored to default",
	shortcutChangesApplied: "Changes to shortcut applied",
	shortcutChangesDiscarded: "Changes to shortcut discarded"
}, gn = r("panels/settings/KeybindsSettingsTab.ts", X), Z = n.bind(void 0, gn), _n = class extends E {
	items;
	list;
	editingItem;
	editingRow;
	constructor() {
		super({
			jslog: `${k("keybinds")}`,
			useShadowDom: !0
		}), this.registerRequiredCSS(mn, R);
		let e = this.contentElement.createChild("div", "settings-card-container-wrapper").createChild("div");
		e.classList.add("settings-card-container");
		let t = a.instance().moduleSetting("active-keybind-set"), n = a.instance().moduleSetting("user-shortcuts");
		t.addChangeListener(this.update, this);
		let r = wt(t, Z(X.matchShortcutsFromPreset)), i = e.createChild("devtools-card");
		i.heading = Z(X.shortcuts), r && r.classList.add("keybinds-set-select"), this.items = new nt(), this.list = new Re(this.items, this, Pe.NonViewport), this.list.element.classList.add("shortcut-list"), this.items.replaceAll(this.createListItems()), Le(this.list.element), f(this.list.element, Z(X.keyboardShortcutsList));
		let o = document.createElement("div");
		o.classList.add("keybinds-footer");
		let s = We.create("https://developer.chrome.com/docs/devtools/shortcuts/", Z(X.FullListOfDevtoolsKeyboard), void 0, "learn-more");
		s.classList.add("docs-link"), o.appendChild(s);
		let c = T(Z(X.RestoreDefaultShortcuts), () => {
			n.set([]), t.set(rt);
		}, { jslogContext: "restore-default-shortcuts" });
		o.appendChild(c), this.editingItem = null, this.editingRow = null, r && i.append(r), i.append(this.list.element, o), this.update();
	}
	createElementForItem(e) {
		let t = document.createElement("div"), n;
		if (typeof e == "string") n = t, n.classList.add("keybinds-category-header"), n.textContent = Ue(e), ge(n, 1);
		else {
			let r = new vn(e, this, e === this.editingItem);
			n = r.element, ge(n, 2), e === this.editingItem && (this.editingRow = r), n.classList.add("keybinds-list-item"), t.classList.add("keybinds-list-item-wrapper"), t.appendChild(n);
		}
		return Je(n), n.tabIndex = e === this.list.selectedItem() && e !== this.editingItem ? 0 : -1, t;
	}
	commitChanges(e, t) {
		for (let [e, n] of t) e.type !== A.UNSET_SHORTCUT && (_.instance().removeShortcut(e), n || O.actionTaken(Ye.ShortcutRemoved)), n && (_.instance().registerUserShortcut(e.changeKeys(n).changeType(A.USER_SHORTCUT)), e.type === A.UNSET_SHORTCUT ? O.actionTaken(Ye.UserShortcutAdded) : O.actionTaken(Ye.ShortcutModified));
		this.stopEditing(e);
	}
	heightForItem(e) {
		return 0;
	}
	isItemSelectable(e) {
		return e instanceof Ze;
	}
	selectedItemChanged(e, t, n, r) {
		n && (n.tabIndex = -1), r && (t === this.editingItem && this.editingRow ? this.editingRow.focus() : (r.tabIndex = 0, this.list.element.hasFocus() && r.focus()), this.setDefaultFocusedElement(r));
	}
	updateSelectedItemARIA(e, t) {
		return !0;
	}
	startEditing(e) {
		this.list.selectItem(e), this.editingItem && this.stopEditing(this.editingItem), le(this.list.element, !0), this.editingItem = e, this.list.refreshItem(e);
	}
	stopEditing(e) {
		le(this.list.element, !1), this.editingItem = null, this.editingRow = null, this.list.refreshItem(e), this.focus();
	}
	createListItems() {
		let e = Ge.instance().actions().filter((e) => e.configurableBindings()).sort((e, t) => e.category() < t.category() ? -1 : e.category() > t.category() ? 1 : e.id() < t.id() ? -1 : +(e.id() > t.id())), t = [], n;
		return e.forEach((e) => {
			n !== e.category() && t.push(e.category()), t.push(e), n = e.category();
		}), t;
	}
	onEscapeKeyPressed(e) {
		let t = Qe(document);
		this.editingRow && t?.nodeName === "INPUT" && this.editingRow.onEscapeKeyPressed(e);
	}
	update() {
		this.editingItem && this.stopEditing(this.editingItem), this.list.refreshAllItems(), this.list.selectedItem() || this.list.selectFirstItem();
	}
	willHide() {
		super.willHide(), this.editingItem && this.stopEditing(this.editingItem);
	}
}, vn = class {
	isEditing;
	settingsTab;
	item;
	element;
	editedShortcuts;
	shortcutInputs;
	shortcuts;
	elementToFocus;
	confirmButton;
	addShortcutLinkContainer;
	errorMessageElement;
	secondKeyTimeout;
	constructor(e, t, n) {
		this.isEditing = !!n, this.settingsTab = t, this.item = e, this.element = document.createElement("div"), this.element.setAttribute("jslog", `${se().context(e.id()).track({
			keydown: "Escape",
			resize: !0
		})}`), this.editedShortcuts = /* @__PURE__ */ new Map(), this.shortcutInputs = /* @__PURE__ */ new Map(), this.shortcuts = _.instance().shortcutsForAction(e.id()), this.elementToFocus = null, this.confirmButton = null, this.addShortcutLinkContainer = null, this.errorMessageElement = null, this.secondKeyTimeout = null, this.update();
	}
	focus() {
		this.elementToFocus && this.elementToFocus.focus();
	}
	update() {
		this.element.removeChildren(), this.elementToFocus = null, this.shortcutInputs.clear(), this.element.classList.toggle("keybinds-editing", this.isEditing), this.element.createChild("div", "keybinds-action-name keybinds-list-text").textContent = this.item.title(), this.shortcuts.forEach(this.createShortcutRow, this), this.shortcuts.length === 0 && this.createEmptyInfo(), this.isEditing && this.setupEditor();
	}
	createEmptyInfo() {
		if (_.instance().actionHasDefaultShortcut(this.item.id())) {
			let e = v("keyboard-pen", "keybinds-modified");
			f(e, Z(X.shortcutModified)), this.element.appendChild(e);
		}
		if (!this.isEditing) {
			let e = this.element.createChild("div", "keybinds-shortcut keybinds-list-text");
			f(e, Z(X.noShortcutForAction)), this.element.appendChild(this.createEditButton());
		}
	}
	setupEditor() {
		this.addShortcutLinkContainer = this.element.createChild("div", "keybinds-shortcut");
		let e = T(Z(X.addAShortcut), this.addShortcut.bind(this), { jslogContext: "add-shortcut" });
		this.addShortcutLinkContainer.appendChild(e), this.elementToFocus ||= e, this.errorMessageElement = this.element.createChild("div", "keybinds-info keybinds-error hidden"), re(this.errorMessageElement), this.element.appendChild(this.createIconButton(Z(X.ResetShortcutsForAction), "undo", "", "undo", this.resetShortcutsToDefaults.bind(this))), this.confirmButton = this.createIconButton(Z(X.confirmChanges), "checkmark", "keybinds-confirm-button", "confirm", () => {
			this.settingsTab.commitChanges(this.item, this.editedShortcuts), b.alert(Z(X.shortcutChangesApplied, { PH1: this.item.title() }));
		}), this.element.appendChild(this.confirmButton), this.element.appendChild(this.createIconButton(Z(X.discardChanges), "cross", "keybinds-cancel-button", "cancel", () => {
			this.settingsTab.stopEditing(this.item), b.alert(Z(X.shortcutChangesDiscarded));
		})), this.element.addEventListener("keydown", (e) => {
			t(e) && (this.settingsTab.stopEditing(this.item), e.consume(!0));
		});
	}
	addShortcut() {
		let e = new x([], this.item.id(), A.UNSET_SHORTCUT);
		this.shortcuts.push(e), this.update();
		let t = this.shortcutInputs.get(e);
		t && t.focus();
	}
	createShortcutRow(e, t) {
		if (this.editedShortcuts.has(e) && !this.editedShortcuts.get(e)) return;
		let n;
		e.type !== A.UNSET_SHORTCUT && !e.isDefault() && (n = v("keyboard-pen", "keybinds-modified"), f(n, Z(X.shortcutModified)), this.element.appendChild(n));
		let r = this.element.createChild("div", "keybinds-shortcut keybinds-list-text");
		if (this.isEditing) {
			let t = r.createChild("input", "harmony-input");
			t.setAttribute("jslog", `${$e().track({ change: !0 })}`), t.setAttribute("placeholder", Z(X.recordingKeys)), t.spellcheck = !1, t.maxLength = 0, this.shortcutInputs.set(e, t), this.elementToFocus ||= t, t.value = e.title();
			let n = this.editedShortcuts.get(e);
			n && (t.value = this.shortcutInputTextForDescriptors(n)), t.addEventListener("keydown", this.onShortcutInputKeyDown.bind(this, e, t)), t.addEventListener("blur", () => {
				this.secondKeyTimeout !== null && (clearTimeout(this.secondKeyTimeout), this.secondKeyTimeout = null);
			}), r.appendChild(this.createIconButton(Z(X.removeShortcut), "bin", "keybinds-delete-button", "delete", () => {
				let t = this.shortcuts.indexOf(e);
				e.isDefault() || this.shortcuts.splice(t, 1), this.editedShortcuts.set(e, null), this.update(), this.focus(), this.validateInputs(), b.alert(Z(X.shortcutRemoved, { PH1: this.item.title() }));
			}));
		} else {
			let n = me() ? " " : " + ";
			e.descriptors.flatMap((e) => e.name.split(n)).forEach((e) => {
				r.createChild("div", "keybinds-key").createChild("span").textContent = e;
			}), t === 0 && this.element.appendChild(this.createEditButton());
		}
	}
	createEditButton() {
		return this.createIconButton(Z(X.editShortcut), "edit", "keybinds-edit-button", "edit", () => this.settingsTab.startEditing(this.item));
	}
	createIconButton(e, t, n, r, i) {
		let a = new Me();
		return a.data = {
			variant: u.ICON,
			iconName: t,
			jslogContext: r,
			title: e
		}, a.addEventListener("click", i), f(a, e), n && a.classList.add(n), a;
	}
	onShortcutInputKeyDown(e, t, n) {
		if (n.key !== "Tab") {
			let r = this.descriptorForEvent(n), i = this.editedShortcuts.get(e) || [];
			this.editedShortcuts.set(e, i);
			let a = i.length === 2 && x.isModifier(i[1].key);
			i.length === 2 && !a && i.splice(0, 2), this.secondKeyTimeout ? (clearTimeout(this.secondKeyTimeout), this.secondKeyTimeout = null, i.push(r)) : a ? i[1] = r : x.isModifier(r.key) ? i[0] = r : (i[0] = r, this.secondKeyTimeout = window.setTimeout(() => {
				this.secondKeyTimeout = null;
			}, De)), t.value = this.shortcutInputTextForDescriptors(i), this.validateInputs(), n.consume(!0);
		}
	}
	descriptorForEvent(e) {
		let t = x.makeKeyFromEvent(e), n = x.keyCodeAndModifiersFromKey(t), r = ie[e.key] || Ce[e.key];
		if (!r && !/^[a-z]$/i.test(e.key)) {
			let t = e.code;
			r = ie[t] || Ce[t], t.startsWith("Digit") ? r = t.slice(5) : t.startsWith("Key") && (r = t.slice(3));
		}
		return x.makeDescriptor(r || e.key, n.modifiers);
	}
	shortcutInputTextForDescriptors(e) {
		return e.map((e) => e.name).join(" ");
	}
	resetShortcutsToDefaults() {
		this.editedShortcuts.clear();
		for (let e of this.shortcuts) if (e.type === A.UNSET_SHORTCUT) {
			let t = this.shortcuts.indexOf(e);
			this.shortcuts.splice(t, 1);
		} else e.type === A.USER_SHORTCUT && this.editedShortcuts.set(e, null);
		_.instance().disabledDefaultsForAction(this.item.id()).forEach((e) => {
			this.shortcuts.includes(e) || (this.shortcuts.push(e), this.editedShortcuts.set(e, e.descriptors));
		}), this.update(), this.focus(), b.alert(Z(X.shortcutChangesRestored, { PH1: this.item.title() }));
	}
	onEscapeKeyPressed(e) {
		let t = Qe(document);
		for (let [n, r] of this.shortcutInputs.entries()) t === r && this.onShortcutInputKeyDown(n, r, e);
	}
	validateInputs() {
		let e = this.confirmButton, t = this.errorMessageElement;
		e && t && (e.disabled = !1, t.classList.add("hidden"), this.shortcutInputs.forEach((n, r) => {
			let i = this.editedShortcuts.get(r);
			if (!i) return;
			if (i.some((e) => x.isModifier(e.key))) {
				e.disabled = !0, n.classList.add("error-input"), p(n, !0), t.classList.remove("hidden"), t.textContent = Z(X.shortcutsCannotContainOnly);
				return;
			}
			let a = _.instance().actionsForDescriptors(i).filter((e) => e !== this.item.id());
			if (a.length) {
				if (e.disabled = !0, n.classList.add("error-input"), p(n, !0), t.classList.remove("hidden"), !Ge.instance().hasAction(a[0])) return;
				let r = Ge.instance().getAction(a[0]), i = r.title(), o = r.category();
				t.textContent = Z(X.thisShortcutIsInUseByS, {
					PH1: o,
					PH2: i
				});
				return;
			}
			n.classList.remove("error-input"), p(n, !1);
		}));
	}
}, yn = "/*\n * Copyright 2017 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n@scope to (devtools-widget > *) {\n  .mappings-info,\n  .folder-exclude-pattern {\n    height: var(--settings-single-item-height);\n  }\n\n  .mapping-view-container {\n    padding-left: 0;\n    padding-right: 0;\n  }\n\n  .folder-exclude-pattern {\n    display: flex;\n    align-items: center;\n\n    & > input {\n      flex: 1;\n    }\n  }\n\n  label {\n    padding-bottom: 0;\n  }\n\n  .mappings-info {\n    border: none;\n  }\n\n  .add-button-container {\n    max-width: var(--sys-size-35);\n    margin-left: var(--sys-size-8);\n    width: 100%;\n\n    & .add-folder {\n      min-width: var(--sys-size-31);\n      max-width: var(--sys-size-35);\n    }\n  }\n}\n", bn = /* @__PURE__ */ e({
	DEFAULT_VIEW: () => Cn,
	WorkspaceSettingsTab: () => wn
}), Q = {
	workspace: "Workspace",
	mappingsAreInferredAutomatically: "Mappings are inferred automatically.",
	addFolder: "Add folder",
	folderExcludePattern: "Exclude from workspace",
	remove: "Remove"
}, xn = r("panels/settings/WorkspaceSettingsTab.ts", Q), $ = n.bind(void 0, xn), { widget: Sn } = Be, Cn = (e, t, n) => {
	h(y`
    <style>${yn}</style>
    <div class="settings-card-container-wrapper" jslog=${k("workspace")}>
      <div class="settings-card-container">
        <devtools-card heading=${$(Q.workspace)}>
          <div class="folder-exclude-pattern">
            <label for="workspace-setting-folder-exclude-pattern">${$(Q.folderExcludePattern)}</label>
            <input
              class="harmony-input"
              jslog=${$e().track({
		keydown: "Enter",
		change: !0
	}).context(e.excludePatternSetting.name)}
              ${Fe(e.excludePatternSetting, { jslog: !1 })}
              id="workspace-setting-folder-exclude-pattern">
          </div>
          <div class="mappings-info">${$(Q.mappingsAreInferredAutomatically)}</div>
        </devtools-card>
        ${e.fileSystems.map((t) => y`
          <devtools-card heading=${t.displayName}>
            <devtools-icon name="folder" slot="heading-prefix"></devtools-icon>
            <div class="mapping-view-container">
              ${Sn(ln, { fileSystem: t.fileSystem })}
            </div>
            <devtools-button
              slot="heading-suffix"
              .variant=${u.OUTLINED}
              jslog=${ze().track({ click: !0 }).context("settings.remove-file-system")}
              @click=${e.onRemoveClicked.bind(null, t.fileSystem)}>${$(Q.remove)}</devtools-button>
          </devtools-card>
        `)}
        <div class="add-button-container">
          <devtools-button
            class="add-folder"
            .variant=${u.OUTLINED}
            jslog=${ze().track({ click: !0 }).context("sources.add-folder-to-workspace")}
            @click=${e.onAddClicked}>${$(Q.addFolder)}</devtools-button>
        </div>
      </div>
    </div>`, n);
}, wn = class e extends E {
	#e;
	#t = [];
	constructor(e = Cn) {
		super(), this.#e = e;
	}
	wasShown() {
		super.wasShown(), this.#t = [N.instance().addEventListener(yt.FileSystemAdded, this.requestUpdate.bind(this)), N.instance().addEventListener(yt.FileSystemRemoved, this.requestUpdate.bind(this))], this.requestUpdate();
	}
	willHide() {
		super.willHide(), Ie(this.#t), this.#t = [];
	}
	performUpdate() {
		let t = {
			excludePatternSetting: N.instance().workspaceFolderExcludePatternSetting(),
			onAddClicked: () => N.instance().addFileSystem(),
			onRemoveClicked: (e) => N.instance().removeFileSystem(e),
			fileSystems: N.instance().fileSystems().filter((e) => {
				let t = bt.instance().project();
				return e instanceof vt && (!t || N.instance().fileSystem(t.fileSystemPath()) !== e);
			}).map((t) => ({
				displayName: e.#n(t),
				fileSystem: t
			})).sort((e, t) => e.displayName.localeCompare(t.displayName))
		};
		this.#e(t, {}, this.contentElement);
	}
	static #n(e) {
		let t = e.path(), n = t.lastIndexOf("/"), r = t.substring(n + 1);
		return decodeURIComponent(r);
	}
};
//#endregion
export { qt as AISettingsTab, nn as EditFileSystemView, dn as FrameworkIgnoreListSettingsTab, hn as KeybindsSettingsTab, Ft as SettingsScreen, bn as WorkspaceSettingsTab };
