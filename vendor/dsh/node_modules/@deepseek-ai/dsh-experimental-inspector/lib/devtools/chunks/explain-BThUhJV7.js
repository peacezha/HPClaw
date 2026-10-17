import { H as e, K as t, i as n, o as r, r as i } from "./common-DMSVbaSb.js";
import { $f as a, $i as o, Io as s, Na as c, No as l, Qi as u, Sa as d, Uf as f, Vf as p, Wf as m, Yf as h, Zi as g, Zo as _, ap as v, ff as y, ha as b, ii as ee, jr as x, ni as te, no as S, pf as C, qa as ne, tp as w } from "./legacy-dM_vujv7.js";
import { p as T, r as re } from "./root-DdvV-xPu.js";
import "./common-Bs7hSOUj.js";
import { d as E, f as ie, l as D } from "./console-DyEFGxFI.js";
import { t as O } from "./marked-CGxJO_CC.js";
import { t as k } from "./checkbox.css-CtBDUlMG.js";
import { t as A } from "./markdown_view-D8BG91nk.js";
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/explain/components/consoleInsight.css.mjs
var j = "/*\n * Copyright 2023 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n@scope to (devtools-widget > *) {\n  * {\n    padding: 0;\n    margin: 0;\n    box-sizing: border-box;\n  }\n\n  :scope {\n    font-family: var(--default-font-family);\n    font-size: inherit;\n    display: block;\n  }\n\n  .wrapper {\n    background-color: var(--sys-color-cdt-base-container);\n    border-radius: 16px;\n    container-type: inline-size;\n    display: grid;\n    animation: expand var(--sys-motion-duration-medium2) var(--sys-motion-easing-emphasized) forwards;\n  }\n\n  .wrapper.closing {\n    animation: collapse var(--sys-motion-duration-medium2) var(--sys-motion-easing-emphasized) forwards;\n  }\n\n  @keyframes expand {\n    from {\n      grid-template-rows: 0fr;\n    }\n\n    to {\n      grid-template-rows: 1fr;\n    }\n  }\n\n  @keyframes collapse {\n    from {\n      grid-template-rows: 1fr;\n    }\n\n    to {\n      grid-template-rows: 0fr;\n      padding-top: 0;\n      padding-bottom: 0;\n    }\n  }\n\n  .animation-wrapper {\n    overflow: hidden;\n    padding: var(--sys-size-6) var(--sys-size-8);\n  }\n\n  .wrapper.top {\n    border-radius: 16px 16px 4px 4px;\n  }\n\n  .wrapper.bottom {\n    margin-top: 5px;\n    border-radius: 4px 4px 16px 16px;\n  }\n\n  header {\n    display: flex;\n    flex-direction: row;\n    gap: 6px;\n    color: var(--sys-color-on-surface);\n    font-size: 13px;\n    font-style: normal;\n    font-weight: 500;\n    margin-bottom: var(--sys-size-6);\n    align-items: center;\n  }\n\n  header:focus-visible {\n    outline: none;\n  }\n\n  header > .filler {\n    display: flex;\n    flex-direction: row;\n    gap: var(--sys-size-5);\n    align-items: center;\n    flex: 1;\n  }\n\n  .reminder-container {\n    border-radius: var(--sys-size-5);\n    background-color: var(--sys-color-surface4);\n    padding: var(--sys-size-8);\n    font-weight: var(--ref-typeface-weight-medium);\n\n    h3 {\n      font: inherit;\n    }\n  }\n\n  .reminder-items {\n    display: grid;\n    grid-template-columns: var(--sys-size-8) auto;\n    gap: var(--sys-size-5) var(--sys-size-6);\n    margin-top: var(--sys-size-6);\n    line-height: var(--sys-size-8);\n    font-weight: var(--ref-typeface-weight-regular);\n  }\n\n  main {\n    --override-markdown-view-message-color: var(--sys-color-on-surface);\n\n    color: var(--sys-color-on-surface);\n    font-size: 12px;\n    font-style: normal;\n    font-weight: 400;\n    line-height: 20px;\n\n    p {\n      margin-block: 1em;\n    }\n\n    ul {\n      list-style-type: none;\n      list-style-position: inside;\n      padding-inline-start: 0.2em;\n\n      li {\n        display: list-item;\n        list-style-type: disc;\n        list-style-position: outside;\n        margin-inline-start: 1em;\n      }\n\n      li::marker {\n        font-size: 11px;\n        line-height: 1;\n      }\n    }\n\n    label {\n      display: inline-flex;\n      flex-direction: row;\n      gap: 0.5em;\n\n      input,\n      span {\n        vertical-align: middle;\n      }\n\n      input[type=\"checkbox\"] {\n        margin-top: 0.3em;\n      }\n    }\n  }\n\n  .opt-in-teaser {\n    display: flex;\n    gap: var(--sys-size-5);\n  }\n\n  devtools-markdown-view {\n    margin-bottom: 12px;\n  }\n\n  footer {\n    display: flex;\n    flex-direction: row;\n    align-items: center;\n    color: var(--sys-color-on-surface);\n    font-style: normal;\n    font-weight: 400;\n    line-height: normal;\n    margin-top: 14px;\n    gap: 32px;\n  }\n\n  @container (max-width: 600px) {\n    footer {\n      gap: 8px;\n    }\n  }\n\n  footer > .filler {\n    flex: 1;\n  }\n\n  footer .rating {\n    display: flex;\n    flex-direction: row;\n    gap: 8px;\n  }\n\n  textarea {\n    height: 84px;\n    padding: 10px;\n    border-radius: 8px;\n    border: 1px solid var(--sys-color-neutral-outline);\n    width: 100%;\n    font-family: var(--default-font-family);\n    font-size: inherit;\n  }\n\n  .buttons {\n    display: flex;\n    gap: 5px;\n  }\n\n  @media (width <= 500px) {\n    .buttons {\n      flex-wrap: wrap;\n    }\n  }\n\n  main .buttons {\n    margin-top: 12px;\n  }\n\n  .disclaimer {\n    display: flex;\n    gap: 2px;\n    color: var(--sys-color-on-surface-subtle);\n    font-size: 11px;\n    align-items: flex-start;\n    flex-direction: column;\n  }\n\n  .link {\n    color: var(--sys-color-primary);\n    text-decoration-line: underline;\n\n    devtools-icon {\n      color: var(--sys-color-primary);\n      width: 14px;\n      height: 14px;\n    }\n  }\n\n  button.link {\n    border: none;\n    background: none;\n    cursor: pointer;\n    font: inherit;\n  }\n\n  .loader {\n    background:\n      linear-gradient(\n        130deg,\n        transparent 0%,\n        var(--sys-color-gradient-tertiary) 20%,\n        var(--sys-color-gradient-primary) 40%,\n        transparent 60%,\n        var(--sys-color-gradient-tertiary) 80%,\n        var(--sys-color-gradient-primary) 100%\n      );\n    background-position: 0% 0%;\n    background-size: 250% 250%;\n    animation: gradient 5s infinite linear;\n  }\n\n  @keyframes gradient {\n    0% { background-position: 0 0; }\n    100% { background-position: 100% 100%; }\n  }\n\n  summary {\n    font-size: 12px;\n    font-style: normal;\n    font-weight: 400;\n    line-height: 20px;\n  }\n\n  details {\n    overflow: hidden;\n    margin-top: 10px;\n  }\n\n  ::details-content {\n    height: 0;\n    transition:\n      height var(--sys-motion-duration-short4) var(--sys-motion-easing-emphasized),\n      content-visibility var(--sys-motion-duration-short4) var(--sys-motion-easing-emphasized) allow-discrete;\n  }\n\n  [open]::details-content {\n    height: auto;\n  }\n\n  details.references {\n    /* This transition is only added because there is no `transitionend` event in\n      JS for the `::details-content` transition. */\n    transition: margin-bottom var(--sys-motion-duration-short4) var(--sys-motion-easing-emphasized);\n  }\n\n  details.references[open] {\n    /* This transition does not affect the actual UI because of collapsing margins. */\n    margin-bottom: var(--sys-size-1);\n  }\n\n  h2 {\n    display: block;\n    font-size: var(--sys-size-7);\n    margin: 0;\n    font-weight: var(--ref-typeface-weight-medium);\n    line-height: var(--sys-size-9);\n  }\n\n  h2:focus-visible {\n    outline: none;\n  }\n\n  .info {\n    width: 20px;\n    height: 20px;\n  }\n\n  .badge {\n    background: linear-gradient(135deg, var(--sys-color-gradient-primary), var(--sys-color-gradient-tertiary));\n    border-radius: var(--sys-size-3);\n    height: var(--sys-size-9);\n\n    devtools-icon {\n      margin: var(--sys-size-2);\n    }\n  }\n\n  .header-icon-container {\n    background: linear-gradient(135deg, var(--sys-color-gradient-primary), var(--sys-color-gradient-tertiary));\n    border-radius: var(--sys-size-4);\n    height: 36px;\n    width: 36px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n  }\n\n  .close-button {\n    align-self: flex-start;\n  }\n\n  .sources-list {\n    padding-left: var(--sys-size-6);\n    margin-bottom: var(--sys-size-6);\n    list-style: none;\n    counter-reset: sources;\n    display: grid;\n    grid-template-columns: var(--sys-size-9) auto;\n    list-style-position: inside;\n  }\n\n  .sources-list li {\n    display: contents;\n  }\n\n  .sources-list li::before {\n    counter-increment: sources;\n    content: \"[\" counter(sources) \"]\";\n    display: table-cell;\n  }\n\n  .sources-list devtools-link.highlighted {\n    animation: highlight-fadeout 2s;\n  }\n\n  @keyframes highlight-fadeout {\n    from {\n      background-color: var(--sys-color-yellow-container);\n    }\n\n    to {\n      background-color: transparent;\n    }\n  }\n\n  .references-list {\n    padding-left: var(--sys-size-8);\n  }\n\n  .references-list li {\n    padding-left: var(--sys-size-3);\n  }\n\n  details h3 {\n    font-size: 10px;\n    font-weight: var(--ref-typeface-weight-medium);\n    text-transform: uppercase;\n    color: var(--sys-color-on-surface-subtle);\n    padding-left: var(--sys-size-6);\n  }\n\n  .error-message {\n    font: var(--sys-typescale-body4-bold);\n  }\n\n  @scope (.insight-sources) {\n    :root {\n      padding: 0;\n      margin: 0;\n      box-sizing: border-box;\n      display: block;\n    }\n\n    ul {\n      color: var(--sys-color-primary);\n      font-size: 12px;\n      font-style: normal;\n      font-weight: 400;\n      line-height: 18px;\n      margin-top: 8px;\n      padding-left: var(--sys-size-6);\n    }\n\n    li {\n      list-style-type: none;\n    }\n\n    ul .link {\n      color: var(--sys-color-primary);\n      display: inline-flex !important; /* stylelint-disable-line declaration-no-important */\n      align-items: center;\n      gap: 4px;\n      text-decoration-line: underline;\n    }\n\n    devtools-icon {\n      height: 16px;\n      width: 16px;\n      margin-right: var(--sys-size-1);\n    }\n\n    devtools-icon[name=\"open-externally\"] {\n      color: var(--icon-link);\n    }\n\n    .source-disclaimer {\n      color: var(--sys-color-on-surface-subtle);\n    }\n  }\n}\n", M = {
	consoleMessage: "Console message",
	stackTrace: "Stacktrace",
	networkRequest: "Network request",
	relatedCode: "Related code",
	generating: "Generating explanation…",
	insight: "Explanation",
	closeInsight: "Close explanation",
	inputData: "Data used to understand this message",
	goodResponse: "Good response",
	badResponse: "Bad response",
	report: "Report legal issue",
	error: "DevTools has encountered an error",
	errorBody: "Something went wrong. Try again.",
	opensInNewTab: "(opens in a new tab)",
	learnMore: "Learn more",
	notLoggedIn: "This feature is only available when you sign into Chrome with your Google account.",
	signIn: "Sign in",
	offlineHeader: "DevTools can’t reach the internet",
	offline: "Check your internet connection and try again.",
	signInToUse: "Sign in to use this feature",
	search: "Use search instead",
	reloadRecommendation: "Reload the page to capture related network request data for this message in order to create a better insight.",
	turnOnInSettings: "Turn on {PH1} to receive AI assistance for understanding and addressing console warnings and errors.",
	settingsLink: "`Console insights` in Settings",
	references: "Sources and related content",
	relatedContent: "Related content",
	timedOut: "Generating a response took too long. Please try again.",
	notAvailableInIncognitoMode: "AI assistance is not available in Incognito mode or Guest mode"
}, N = t("panels/explain/components/ConsoleInsight.ts", M), P = e.bind(void 0, N), ae = s.bind(void 0, N), { render: oe, html: F, Directives: I } = l, { widget: L } = ee, R = class e extends Event {
	static eventName = "closeinsight";
	constructor() {
		super(e.eventName, {
			composed: !0,
			bubbles: !0
		});
	}
};
function z(e) {
	switch (e) {
		case E.MESSAGE: return P(M.consoleMessage);
		case E.STACKTRACE: return P(M.stackTrace);
		case E.NETWORK_REQUEST: return P(M.networkRequest);
		case E.RELATED_CODE: return P(M.relatedCode);
	}
}
var B = "https://policies.google.com/terms", V = "https://policies.google.com/privacy", H = "https://support.google.com/legal/answer/13505487", U = "https://goo.gle/devtools-console-messages-ai", W = "https://support.google.com/legal/troubleshooter/1114905?hl=en#ts=1115658%2C13380504", G = "https://accounts.google.com", K = {
	name: "citation",
	level: "inline",
	start(e) {
		return e.match(/\[\^/)?.index;
	},
	tokenizer(e) {
		let t = e.match(/^\[\^(\d+)\]/);
		return t ? {
			type: "citation",
			raw: t[0],
			linkText: Number(t[1])
		} : !1;
	},
	renderer: () => ""
};
function q(e) {
	return !!e.factualityMetadata?.facts.length;
}
var J = (e) => e.stopPropagation();
function se(e) {
	return F`<devtools-button
    @click=${e}
    class="search-button"
    .variant=${o.OUTLINED}
    .jslogContext=${"search"}
  >
    ${P(M.search)}
  </devtools-button>`;
}
function ce() {
	return F`<devtools-link href=${U} class="link" jslogcontext="learn-more">
    ${P(M.learnMore)}
  </devtools-link>`;
}
function le(e, t, n, r) {
	return e.length ? F`
    <ol class="sources-list">
      ${e.map((e, i) => F`
        <li>
          <devtools-link
            href=${e}
            class=${I.classMap({
		link: !0,
		highlighted: i === t
	})}
            jslogcontext="references.console-insights"
            ${I.ref((e) => {
		r.citationLinks[i] = e;
	})}
            @animationend=${n}
          >
            ${e}
          </devtools-link>
        </li>
      `)}
    </ol>
  ` : _;
}
function ue(e, t) {
	return e.length === 0 ? _ : F`
    ${t.length ? F`<h3>${P(M.relatedContent)}</h3>` : _}
    <ul class="references-list">
      ${e.map((e) => F`
        <li>
          <devtools-link
            href=${e}
            class="link"
            jslogcontext="references.console-insights"
          >
            ${e}
          </devtools-link>
        </li>
      `)}
    </ul>
  `;
}
function de() {
	return F`
    <div role="presentation" aria-label="Loading" class="loader" style="clip-path: url('#clipPath');">
      <svg width="100%" height="64">
        <clipPath id="clipPath">
          <rect x="0" y="0" width="100%" height="16" rx="8"></rect>
          <rect x="0" y="24" width="100%" height="16" rx="8"></rect>
          <rect x="0" y="48" width="100%" height="16" rx="8"></rect>
        </clipPath>
      </svg>
    </div>`;
}
function fe(e, t) {
	return F`
    <div class="insight-sources">
      <ul>
        ${I.repeat(e, (e) => e.value, (e) => F`<li><devtools-link class="link" title="${z(e.type)} ${P(M.opensInNewTab)}" href="data:text/plain;charset=utf-8,${encodeURIComponent(e.value)}" .jslogContext=${"source-" + e.type}>
            <devtools-icon name="open-externally"></devtools-icon>
            ${z(e.type)}
          </devtools-link></li>`)}
        ${t ? F`<li class="source-disclaimer">
          <devtools-icon name="warning"></devtools-icon>
          ${P(M.reloadRecommendation)}</li>` : _}
      </ul>
    </div>`;
}
function pe(e, { renderer: t, disableAnimations: n, areReferenceDetailsOpen: r, highlightedCitationIndex: i, callbacks: a }, o) {
	return F`
        ${e.validMarkdown ? F`<devtools-markdown-view
            .data=${{
		tokens: e.tokens,
		renderer: t,
		animationEnabled: !n
	}}>
          </devtools-markdown-view>` : e.explanation}
        ${e.timedOut ? F`<p class="error-message">${P(M.timedOut)}</p>` : _}
        ${q(e.metadata) ? F`
          <details
            class="references"
            ?open=${r}
            jslog=${c("references").track({ click: !0 })}
            @toggle=${a.onToggleReferenceDetails}
            @transitionend=${a.onReferencesOpen}
          >
            <summary>${P(M.references)}</summary>
            ${le(e.directCitationUrls, i, a.onCitationAnimationEnd, o)}
            ${ue(e.relatedUrls, e.directCitationUrls)}
          </details>
        ` : _}
        <details jslog=${c("sources").track({ click: !0 })}>
          <summary>${P(M.inputData)}</summary>
          ${fe(e.sources, e.isPageReloadRecommended)}
        </details>
        <div class="buttons">
          ${se(a.onSearch)}
        </div>`;
}
function Y(e) {
	return F`<div class="error">${e}</div>`;
}
function me(e) {
	return F`
    <h3>Things to consider</h3>
    <div class="reminder-items">
      <div>
        <devtools-icon name="google" class="medium">
        </devtools-icon>
      </div>
      <div>The console message, associated stack trace, related source code, and the associated network headers are sent to Google to generate explanations. ${e ? "The content you submit and that is generated by this feature will not be used to improve Google’s AI models." : "This data may be seen by human reviewers to improve this feature. Avoid sharing sensitive or personal information."}
      </div>
      <div>
        <devtools-icon name="policy" class="medium">
        </devtools-icon>
      </div>
      <div>Use of this feature is subject to the <devtools-link
          href=${B}
          class="link"
          jslogcontext="terms-of-service.console-insights">
        Google Terms of Service
        </devtools-link> and <devtools-link
          href=${V}
          class="link"
          jslogcontext="privacy-policy.console-insights">
        Google Privacy Policy
        </devtools-link>
      </div>
      <div>
        <devtools-icon name="warning" class="medium">
        </devtools-icon>
      </div>
      <div>
        <devtools-link
          href=${H}
          class="link"
          jslogcontext="code-snippets-explainer.console-insights"
        >Use generated code snippets with caution</devtools-link>
      </div>
    </div>`;
}
function X(e) {
	let t = F`
    <button
      class="link" role="link"
      jslog=${b("open-ai-settings").track({ click: !0 })}
      @click=${e}
    >${P(M.settingsLink)}</button>`;
	return F`
    <div class="badge">
      <devtools-icon name="lightbulb-spark" class="medium">
      </devtools-icon>
    </div>
    <div>
      ${ae(M.turnOnInSettings, { PH1: t })} ${ce()}
    </div>`;
}
function he() {
	return Y(T.isOffTheRecord ? P(M.notAvailableInIncognitoMode) : P(M.notLoggedIn));
}
function Z(e, t) {
	return F`<span>
    AI tools may generate inaccurate info that doesn't represent Google's views. ${e ? "The content you submit and that is generated by this feature will not be used to improve Google’s AI models." : "Data sent to Google may be seen by human reviewers to improve this feature."} <button class="link" role="link" @click=${t}
              jslog=${b("open-ai-settings").track({ click: !0 })}>
      Open settings
    </button> or <devtools-link href=${U}
        class="link" jslogcontext="learn-more">
      learn more
    </devtools-link>
  </span>`;
}
function Q(e, t) {
	return F`
    <div class="disclaimer">
      ${Z(e, t)}
    </div>`;
}
function ge(e) {
	return T.isOffTheRecord ? _ : F`
    <div class="filler"></div>
    <div>
      <devtools-button
        @click=${e}
        .variant=${o.PRIMARY}
        .jslogContext=${"update-settings"}
      >
        ${P(M.signIn)}
      </devtools-button>
    </div>`;
}
function _e(e, t) {
	return F`
    <div class="filler"></div>
    <div class="buttons">
      <devtools-button
        @click=${e}
        .variant=${o.TONAL}
        .jslogContext=${"settings"}
        .title=${"Settings"}
      >
        Settings
      </devtools-button>
      <devtools-button
        class='continue-button'
        @click=${t}
        .variant=${o.PRIMARY}
        .jslogContext=${"continue"}
        .title=${"continue"}
      >
        Continue
      </devtools-button>
    </div>`;
}
function ve(e, t, n) {
	return F`
  <div class="disclaimer">
    ${Z(e, n.onDisclaimerSettingsLink)}
  </div>
  <div class="filler"></div>
  <div class="rating">
    <devtools-button
      data-rating="true"
      .iconName=${"thumb-up"}
      .toggledIconName=${"thumb-up"}
      .variant=${o.ICON_TOGGLE}
      .size=${g.SMALL}
      .toggleOnClick=${!1}
      .toggleType=${u.PRIMARY}
      .disabled=${t !== void 0}
      .toggled=${t === !0}
      .title=${P(M.goodResponse)}
      .jslogContext=${"thumbs-up"}
      @click=${() => n.onRating(!0)}
    ></devtools-button>
    <devtools-button
      data-rating="false"
      .iconName=${"thumb-down"}
      .toggledIconName=${"thumb-down"}
      .variant=${o.ICON_TOGGLE}
      .size=${g.SMALL}
      .toggleOnClick=${!1}
      .toggleType=${u.PRIMARY}
      .disabled=${t !== void 0}
      .toggled=${t === !1}
      .title=${P(M.badResponse)}
      .jslogContext=${"thumbs-down"}
      @click=${() => n.onRating(!1)}
    ></devtools-button>
    <devtools-button
      .iconName=${"report"}
      .variant=${o.ICON}
      .size=${g.SMALL}
      .title=${P(M.report)}
      .jslogContext=${"report"}
      @click=${n.onReport}
    ></devtools-button>
  </div>`;
}
function ye() {
	return F`
    <div class="header-icon-container">
      <devtools-icon name="lightbulb-spark" class="large">
      </devtools-icon>
    </div>`;
}
function $({ headerText: e, showIcon: t = !1, showSpinner: n = !1, onClose: r }, i) {
	return F`
    <header>
      ${t ? ye() : _}
      <div class="filler">
        <h2 tabindex="-1" ${I.ref(i)}>
          ${e}
        </h2>
        ${n ? F`<devtools-spinner></devtools-spinner>` : _}
      </div>
      <div class="close-button">
        <devtools-button
          .iconName=${"cross"}
          .variant=${o.ICON}
          .size=${g.SMALL}
          .title=${P(M.closeInsight)}
          jslog=${d().track({ click: !0 })}
          @click=${r}
        ></devtools-button>
      </div>
    </header>
  `;
}
var be = (e, t, n) => {
	let { state: r, noLogging: i, callbacks: a } = e, { onClose: o, onDisclaimerSettingsLink: s } = a, c = `${S(r.type).track({ resize: !0 })}`, l = _, u = _, d = {}, f;
	switch (r.type) {
		case "loading":
			l = $({
				headerText: P(M.generating),
				onClose: o
			}, t.headerRef), u = de();
			break;
		case "insight":
			l = $({
				headerText: P(M.insight),
				onClose: o,
				showSpinner: !r.completed
			}, t.headerRef), u = pe(r, e, t), f = ve(i, e.selectedRating, a);
			break;
		case "error":
			l = $({
				headerText: P(M.error),
				onClose: o
			}, t.headerRef), u = Y(P(M.errorBody)), f = Q(i, s);
			break;
		case "consent-reminder":
			l = $({
				headerText: "Understand console messages with AI",
				onClose: o,
				showIcon: !0
			}, t.headerRef), d["reminder-container"] = !0, u = me(i), f = _e(a.onReminderSettingsLink, a.onConsentReminderConfirmed);
			break;
		case "setting-is-not-true":
			d["opt-in-teaser"] = !0, u = X(a.onEnableInsightsInSettingsLink);
			break;
		case "not-logged-in":
		case "sync-is-paused":
			l = $({
				headerText: P(M.signInToUse),
				onClose: o
			}, t.headerRef), u = he(), f = ge(a.onGoToSignIn);
			break;
		case "offline": l = $({
			headerText: P(M.offlineHeader),
			onClose: o
		}, t.headerRef), u = Y(P(M.offline)), f = Q(i, s);
	}
	oe(F`
    <style>${j}</style>
    <style>${k}</style>
    <div
      class=${I.classMap({
		wrapper: !0,
		closing: e.closing
	})}
      jslog=${ne("console-insights").track({ resize: !0 })}
      @animationend=${a.onAnimationEnd}
      @keydown=${J}
      @keyup=${J}
      @keypress=${J}
      @click=${J}
    >
      <div class="animation-wrapper">
        ${l}
        <main jslog=${c} class=${I.classMap(d)}>
          ${u}
        </main>
        ${f ? F`<footer jslog=${S("footer")}>
          ${f}
        </footer>` : _}
      </div>
    </div>
  `, n);
}, xe = class e extends te {
	static async create(t, n) {
		let r = await p.checkAccessPreconditions();
		return F`<devtools-widget class="devtools-console-insight" ${L((i) => new e(t, n, r, i))}>
    </devtools-widget>`;
	}
	disableAnimations = !1;
	#e;
	#t;
	#n;
	#r;
	#i;
	#a = I.createRef();
	#o = [];
	#s = -1;
	#c = !1;
	#l = !1;
	#u = !1;
	#d;
	#f;
	#p;
	#m;
	#h;
	constructor(e, t, n, r, i = be) {
		super(r), this.#e = i, this.#t = e, this.#n = t, this.#p = n, this.#f = this.#y(), this.#r = new A(this.#g.bind(this)), this.#h = new O({ extensions: [K] }), this.#i = this.#v(), this.#m = this.#x.bind(this), this.requestUpdate();
	}
	#g(e) {
		if (this.#i.type !== "insight") return;
		let t = this.#c;
		this.#c = !0, this.#s = e - 1, this.requestUpdate(), t && this.#_();
	}
	#_() {
		let e = this.#o[this.#s];
		e && (e.scrollIntoView({ behavior: "auto" }), e.focus());
	}
	#v() {
		switch (this.#p) {
			case a.AVAILABLE: {
				let e = n.instance().createSetting("console-insights-skip-reminder", !1, i.SESSION).get();
				return {
					type: "loading",
					consentOnboardingCompleted: this.#b().get() || e
				};
			}
			case a.NO_ACCOUNT_EMAIL: return { type: "not-logged-in" };
			case a.SYNC_IS_PAUSED: return { type: "sync-is-paused" };
			case a.NO_INTERNET: return { type: "offline" };
		}
	}
	#y() {
		try {
			return r("console-insights-enabled");
		} catch {
			return;
		}
	}
	#b() {
		return n.instance().createLocalSetting("console-insights-onboarding-finished", !1);
	}
	wasShown() {
		super.wasShown(), this.focus(), this.#f?.addChangeListener(this.#S, this);
		let e = T.aidaAvailability?.blockedByAge === !0;
		this.#i.type === "loading" && this.#f?.getIfNotDisabled() === !0 && !e && this.#i.consentOnboardingCompleted && y.actionTaken(C.GeneratingInsightWithoutDisclaimer), m.instance().addEventListener(f.AIDA_AVAILABILITY_CHANGED, this.#m), this.#x(), this.#i.type !== "insight" && this.#i.type !== "error" && (this.#i = this.#v()), this.#w();
	}
	willHide() {
		super.willHide(), this.#f?.removeChangeListener(this.#S, this), m.instance().removeEventListener(f.AIDA_AVAILABILITY_CHANGED, this.#m);
	}
	async #x() {
		let e = await p.checkAccessPreconditions();
		e !== this.#p && (this.#p = e, this.#i = this.#v(), this.#w());
	}
	#S() {
		this.#f?.getIfNotDisabled() === !0 && this.#b().set(!0), this.#i.type === "setting-is-not-true" && this.#f?.getIfNotDisabled() === !0 && (this.#C({
			type: "loading",
			consentOnboardingCompleted: !0
		}), y.actionTaken(C.InsightsOptInTeaserConfirmedInSettings), this.#w()), this.#i.type === "consent-reminder" && this.#f?.getIfNotDisabled() === !1 && (this.#C({
			type: "loading",
			consentOnboardingCompleted: !1
		}), y.actionTaken(C.InsightsReminderTeaserAbortedInSettings), this.#w());
	}
	#C(e) {
		this.#l = this.#i.type !== e.type, this.#i = e, this.requestUpdate();
	}
	async #w() {
		if (this.#i.type !== "loading") return;
		let e = T.aidaAvailability?.blockedByAge === !0;
		if (this.#f?.getIfNotDisabled() !== !0 || e) {
			this.#C({ type: "setting-is-not-true" }), y.actionTaken(C.InsightsOptInTeaserShown);
			return;
		}
		if (!this.#i.consentOnboardingCompleted) {
			let { sources: e, isPageReloadRecommended: t } = await this.#t.buildPrompt();
			this.#C({
				type: "consent-reminder",
				sources: e,
				isPageReloadRecommended: t
			}), y.actionTaken(C.InsightsReminderTeaserShown);
			return;
		}
		await this.#F();
	}
	#T() {
		this.#i.type === "consent-reminder" && y.actionTaken(C.InsightsReminderTeaserCanceled), this.#u = !0, this.requestUpdate();
	}
	#E() {
		if (this.#u) {
			this.contentElement.dispatchEvent(new R());
			return;
		}
		this.#l && this.#a.value?.focus();
	}
	#D() {
		this.#s !== -1 && (this.#s = -1, this.requestUpdate());
	}
	#O(e) {
		if (this.#i.type !== "insight") throw Error("Unexpected state");
		if (this.#i.metadata?.rpcGlobalId === void 0) throw Error("RPC Id not in metadata");
		if (this.#d !== void 0) return;
		this.#d = e, this.requestUpdate(), this.#d ? y.actionTaken(C.InsightRatedPositive) : y.actionTaken(C.InsightRatedNegative);
		let t = T.aidaAvailability?.disallowLogging ?? !0;
		return this.#n.registerClientEvent({
			corresponding_aida_rpc_global_id: this.#i.metadata.rpcGlobalId,
			disable_user_content_logging: t,
			do_conversation_client_event: { user_feedback: { sentiment: this.#d ? v.POSITIVE : v.NEGATIVE } }
		});
	}
	#k() {
		h.openInNewTab(W);
	}
	#A() {
		let e = this.#t.getSearchQuery();
		h.openSearchResultsInNewTab(e);
	}
	async #j() {
		this.#b().set(!0), this.#C({
			type: "loading",
			consentOnboardingCompleted: !0
		}), y.actionTaken(C.InsightsReminderTeaserConfirmed), await this.#F();
	}
	#M(e, t) {
		let n = [];
		if (!q(t) || !t.attributionMetadata) return {
			explanationWithCitations: e,
			directCitationUrls: n
		};
		let { attributionMetadata: r } = t, i = r.citations.filter((e) => e.sourceType === w.WORLD_FACTS).sort((e, t) => (t.endIndex || 0) - (e.endIndex || 0)), a = e;
		for (let [e, t] of i.entries()) {
			let r = /[.,:;!?]*\s/g;
			r.lastIndex = t.endIndex || 0;
			let o = r.exec(a);
			o && t.uri && (a = a.slice(0, o.index) + `[^${i.length - e}]` + a.slice(o.index), n.push(t.uri));
		}
		return n.reverse(), {
			explanationWithCitations: a,
			directCitationUrls: n
		};
	}
	#N(e) {
		for (let t of e) if (t.type === "code") {
			let e = t.text.match(/\[\^\d+\]/g);
			t.text = t.text.replace(/\[\^\d+\]/g, ""), e?.length && (t.citations = e.map((e) => {
				let t = parseInt(e.slice(2, -1), 10);
				return {
					index: t,
					clickHandler: this.#g.bind(this, t)
				};
			}));
		}
	}
	#P(e, t) {
		if (!t.factualityMetadata?.facts.length) return [];
		let n = t.factualityMetadata.facts.filter((t) => t.sourceUri && !e.includes(t.sourceUri)).map((e) => e.sourceUri) || [], r = t.attributionMetadata?.citations.filter((e) => e.sourceType === w.TRAINING_DATA && (e.uri || e.repository)).map((e) => e.uri || `https://www.github.com/${e.repository}`) || [], i = [...new Set(r.filter((t) => !n.includes(t) && !e.includes(t)))];
		return n.push(...i), n;
	}
	async #F() {
		try {
			for await (let { sources: e, isPageReloadRecommended: t, explanation: n, metadata: r, completed: i } of this.#L()) {
				let { explanationWithCitations: a, directCitationUrls: o } = this.#M(n, r), s = this.#P(o, r), c = this.#I(a), l = c !== !1;
				l && this.#N(c), this.#C({
					type: "insight",
					tokens: l ? c : [],
					validMarkdown: l,
					explanation: n,
					sources: e,
					metadata: r,
					isPageReloadRecommended: t,
					completed: i,
					directCitationUrls: o,
					relatedUrls: s
				});
			}
			y.actionTaken(C.InsightGenerated);
		} catch (e) {
			console.error("[ConsoleInsight] Error in #generateInsight:", e), y.actionTaken(C.InsightErrored), e.message === "doAidaConversation timed out" && this.#i.type === "insight" ? (this.#i.timedOut = !0, this.#C({
				...this.#i,
				completed: !0,
				timedOut: !0
			})) : this.#C({
				type: "error",
				error: e.message
			});
		}
	}
	#I(e) {
		try {
			let t = this.#h.lexer(e);
			for (let e of t) this.#r.renderToken(e);
			return t;
		} catch {
			return y.actionTaken(C.InsightErroredMarkdown), !1;
		}
	}
	async *#L() {
		let { prompt: e, sources: t, isPageReloadRecommended: n } = await this.#t.buildPrompt();
		try {
			for await (let r of this.#n.doConversation(p.buildConsoleInsightsRequest(e))) yield {
				sources: t,
				isPageReloadRecommended: n,
				...r
			};
		} catch (e) {
			throw e.message === "Server responded: permission denied" ? y.actionTaken(C.InsightErroredPermissionDenied) : e.message.startsWith("Cannot send request:") ? y.actionTaken(C.InsightErroredCannotSend) : e.message.startsWith("Request failed:") ? y.actionTaken(C.InsightErroredRequestFailed) : e.message.startsWith("Cannot parse chunk:") ? y.actionTaken(C.InsightErroredCannotParseChunk) : e.message === "Unknown chunk result" ? y.actionTaken(C.InsightErroredUnknownChunk) : e.message.startsWith("Server responded:") ? y.actionTaken(C.InsightErroredApi) : y.actionTaken(C.InsightErroredOther), e;
		}
	}
	#R() {
		h.openInNewTab(G);
	}
	#z(e) {
		let t = e.target;
		t && (this.#c = t.open, t.open || (this.#s = -1), this.requestUpdate());
	}
	#B() {
		x.instance().showView("chrome-ai");
	}
	#V() {
		y.actionTaken(C.InsightsReminderTeaserSettingsLinkClicked), x.instance().showView("chrome-ai");
	}
	#H() {
		y.actionTaken(C.InsightsOptInTeaserSettingsLinkClicked), x.instance().showView("chrome-ai");
	}
	performUpdate() {
		let e = {
			state: this.#i,
			closing: this.#u,
			disableAnimations: this.disableAnimations,
			renderer: this.#r,
			citationClickHandler: this.#g.bind(this),
			selectedRating: this.#d,
			noLogging: T.aidaAvailability?.enterprisePolicyValue === re.ALLOW_WITHOUT_LOGGING,
			areReferenceDetailsOpen: this.#c,
			highlightedCitationIndex: this.#s,
			callbacks: {
				onClose: this.#T.bind(this),
				onAnimationEnd: this.#E.bind(this),
				onCitationAnimationEnd: this.#D.bind(this),
				onSearch: this.#A.bind(this),
				onRating: this.#O.bind(this),
				onReport: this.#k.bind(this),
				onGoToSignIn: this.#R.bind(this),
				onConsentReminderConfirmed: this.#j.bind(this),
				onToggleReferenceDetails: this.#z.bind(this),
				onDisclaimerSettingsLink: this.#B.bind(this),
				onReminderSettingsLink: this.#V.bind(this),
				onEnableInsightsInSettingsLink: this.#H.bind(this),
				onReferencesOpen: this.#_.bind(this)
			}
		}, t = {
			headerRef: this.#a,
			citationLinks: []
		};
		this.#e(e, t, this.contentElement), this.#o = t.citationLinks;
	}
}, Se = class {
	handleAction(e, t) {
		switch (t) {
			case "explain.console-message.context":
			case "explain.console-message.context.error":
			case "explain.console-message.context.warning":
			case "explain.console-message.context.other":
			case "explain.console-message.teaser":
			case "explain.console-message.hover": {
				let n = e.flavor(ie);
				if (n) {
					t.startsWith("explain.console-message.context") ? y.actionTaken(C.InsightRequestedViaContextMenu) : t === "explain.console-message.teaser" ? y.actionTaken(C.InsightRequestedViaTeaser) : t === "explain.console-message.hover" && y.actionTaken(C.InsightRequestedViaHoverButton);
					let e = new D(n), r = new p();
					return xe.create(e, r).then((e) => {
						n.setInsight(e);
					}), !0;
				}
				return !1;
			}
		}
		return !1;
	}
};
//#endregion
export { Se as ActionDelegate };
