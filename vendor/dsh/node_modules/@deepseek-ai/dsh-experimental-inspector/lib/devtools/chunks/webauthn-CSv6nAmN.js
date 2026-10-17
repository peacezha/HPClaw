import { n as e } from "./rolldown-runtime-DF993M8W.js";
import { H as t, K as n, i as r } from "./common-DMSVbaSb.js";
import { $i as i, $o as a, Io as o, L as s, La as c, No as l, S as u, es as d, ff as f, fo as p, ha as m, ii as h, ja as g, jd as _, lf as v, mo as y, no as b, pf as x, uo as S } from "./legacy-dM_vujv7.js";
import "./data_grid-C6uthMeA.js";
import { t as C } from "./checkbox.css-CtBDUlMG.js";
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/webauthn/webauthnPane.css.mjs
var w = "/*\n * Copyright 2020 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n@scope to (devtools-widget > *) {\n  .webauthn-pane {\n    overflow: auto;\n    min-width: 500px;\n  }\n\n  .webauthn-toolbar-container {\n    display: flex;\n    background-color: var(--sys-color-cdt-base-container);\n    border-bottom: 1px solid var(--sys-color-divider);\n    flex: 0 0 auto;\n  }\n\n  .webauthn-toolbar {\n    display: inline-block;\n  }\n\n  .authenticators-view {\n    padding: 0 var(--sys-size-9);\n    min-height: auto;\n    display: none;\n  }\n\n  .webauthn-pane.enabled .authenticators-view {\n    display: block;\n  }\n\n  /* New Authenticator Section */\n  .new-authenticator-title {\n    display: block;\n    padding: var(--sys-size-7) 0 var(--sys-size-5) 0;\n    font: var(--sys-typescale-headline5);\n\n    &:has(devtools-button) {\n      padding-top: var(--sys-size-4);\n    }\n  }\n\n  .new-authenticator-container {\n    display: none;\n    padding-left:  var(--sys-size-9);\n  }\n\n  .authenticator-option {\n    > select {\n      margin: 0 var(--sys-size-9) var(--sys-size-3) var(--sys-size-9);\n    }\n\n    > devtools-button {\n      margin: var(--sys-size-3) var(--sys-size-9);\n    }\n\n    > input[type=\"checkbox\"] {\n      margin: var(--sys-size-5) var(--sys-size-9);\n    }\n  }\n\n  .webauthn-pane.enabled .new-authenticator-container {\n    display: block;\n  }\n\n  .new-authenticator-form {\n    border: none;\n    flex: 0 0 auto;\n    margin: 0;\n    padding-bottom: var(--sys-size-5);\n  }\n\n  .webauthn-pane select {\n    width: 120px;\n  }\n  /* Active Authenticator Section */\n  .authenticator-section {\n    display: block;\n  }\n\n  .divider {\n    border-bottom: var(--sys-size-1) solid var(--sys-color-divider);\n    margin: 10px calc(var(--sys-size-9) * -1) 0;\n  }\n\n  .authenticator-fields {\n    border: none;\n    flex: 0 0 auto;\n    margin-bottom: 10px;\n  }\n\n  .authenticator-section-header {\n    margin: var(--sys-size-4) 0 var(--sys-size-5) calc(var(--sys-size-5) * -1);\n    display: flex;\n    justify-content: space-between;\n    align-items: flex-end;\n  }\n\n  .authenticator-section-title {\n    line-height: 24px;\n    display: inline-flex;\n  }\n\n  .authenticator-section-title .authenticator-name-field {\n    display: inline-block;\n    border: none;\n    animation: save-flash 0.2s;\n    text-overflow: ellipsis;\n    font: var(--sys-typescale-headline5);\n  }\n\n  .authenticator-section-title.editing-name .authenticator-name-field {\n    border-bottom: 1px solid var(--sys-color-neutral-outline);\n    font-weight: normal;\n    animation: none;\n  }\n\n  .authenticator-field-value {\n    font: var(--sys-typescale-monospace-regular);\n    line-height: 18px;\n  }\n\n  .authenticator-field {\n    margin: var(--sys-size-3) 0;\n  }\n\n  .authenticator-field,\n  .authenticator-option {\n    display: flex;\n    align-items: center;\n  }\n\n  .authenticator-option-label {\n    color: var(--sys-color-on-surface-subtle);\n    font: var(--sys-typescale-body5-medium);\n    padding-right: var(--sys-size-6);\n    text-align: left;\n    min-width: 152px;\n    line-height: 18px;\n  }\n\n  ::part(action-button) {\n    min-width: 20px;\n    margin: 4px;\n  }\n\n  .active-button-container {\n    display: inline-block;\n    min-width: 28px;\n  }\n\n  .edit-name-toolbar {\n    display: inline-block;\n    vertical-align: middle;\n  }\n\n  @keyframes save-flash {\n    from { opacity: 0%; }\n    to { opacity: 100%; }\n  }\n  /* Credentials Table */\n\n  ::part(credentialId-column),\n  ::part(isResidentCredential-column),\n  ::part(rpId-column),\n  ::part(userHandle-column),\n  ::part(signCount-column),\n  ::part(actions-column) {\n    vertical-align: middle;\n  }\n\n  .credentials-title {\n    display: block;\n    font: var(--sys-typescale-headline5);\n    padding: var(--sys-size-7) 0 var(--sys-size-5) 0;\n    border-top: var(--sys-size-1) solid var(--sys-color-divider);\n    margin-right: calc(var(--sys-size-9) * -1);\n  }\n\n  .code {\n    font-family: var(--monospace-font-family);\n  }\n\n  .learn-more {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    height: 100%;\n    text-align: center;\n    overflow: hidden;\n  }\n\n  .webauthn-pane.enabled .learn-more {\n    display: none;\n  }\n}\n", T = /* @__PURE__ */ e({
	DEFAULT_VIEW: () => q,
	WebauthnPaneImpl: () => J
}), { render: E, html: D, Directives: { ref: O, repeat: k, classMap: A } } = l, { widget: j } = h, M = {
	export: "Export",
	remove: "Remove",
	noCredentialsTryCallingSFromYour: "No credentials. Try calling {PH1} from your website.",
	enableVirtualAuthenticator: "Enable virtual authenticator environment",
	id: "ID",
	isResident: "Is Resident",
	rpId: "RP ID",
	userHandle: "User Handle",
	signCount: "Signature Count",
	actions: "Actions",
	credentials: "Credentials",
	noAuthenticator: "No authenticator set up",
	useWebauthnForPhishingresistant: "Use WebAuthn for phishing-resistant authentication.",
	newAuthenticator: "New authenticator",
	protocol: "Protocol",
	transport: "Transport",
	supportsResidentKeys: "Supports resident keys",
	supportsLargeBlob: "Supports large blob",
	supportsHmacSecret: "Supports hmac-secret",
	supportsHmacSecretMc: "Supports hmac-secret-mc",
	add: "Add",
	active: "Active",
	editName: "Edit name",
	enterNewName: "Enter new name",
	saveName: "Save name",
	authenticatorS: "Authenticator {PH1}",
	privateKeypem: "Private key.pem",
	uuid: "UUID",
	supportsUserVerification: "Supports user verification",
	yes: "Yes",
	no: "No",
	setSAsTheActiveAuthenticator: "Set {PH1} as the active authenticator"
}, N = n("panels/webauthn/WebauthnPane.ts", M), P = t.bind(void 0, N), F = o.bind(void 0, N), I = "https://developer.chrome.com/docs/devtools/webauthn";
function L(e, t, n, r) {
	return D`
    <devtools-data-grid name=${P(M.credentials)} inline striped>
      <table>
        <thead>
          <tr>
            <th id="credentialId" weight="24" text-overflow="ellipsis">${P(M.id)}</th>
            <th id="isResidentCredential" type="boolean" weight="10">${P(M.isResident)}</th>
            <th id="rpId" weight="16.5">${P(M.rpId)}</th>
            <th id="userHandle" weight="16.5">${P(M.userHandle)}</th>
            <th id="signCount" weight="16.5">${P(M.signCount)}</th>
            <th id="actions" weight="16.5">${P(M.actions)}</th>
          </tr>
        </thead>
        <tbody>
        ${t.length ? k(t, (e) => e.credentialId, (e) => D`
          <tr>
            <td>${e.credentialId}</td>
            <td>${e.isResidentCredential}</td>
            <td>${e.rpId}</td>
            <td>${e.userHandle}</td>
            <td>${e.signCount}</td>
            <td>
              <devtools-button .variant=${i.OUTLINED}
                  part="action-button"
                  @click=${() => n(e)}
                  .jslogContext=${"webauthn.export-credential"}>
                ${P(M.export)}
              </devtools-button>
              <devtools-button .variant=${i.OUTLINED}
                  part="action-button"
                  @click=${() => r(e.credentialId)}
                  .jslogContext=${"webauthn.remove-credential"}>
                ${P(M.remove)}
              </devtools-button>
            </td>
          </tr>`) : D`
          <tr>
            <td class="center" colspan=6>
              ${F(M.noCredentialsTryCallingSFromYour, { PH1: D`<span class="code">navigator.credentials.create()</span>` })}
            </td>
          </tr>`}
        </tbody>
      </table>
    </devtools-data-grid>`;
}
var R = "PRIVATE", z = `-----BEGIN ${R} KEY-----
`, B = `-----END ${R} KEY-----`, V = {
	Ctap2: v.AuthenticatorProtocol.Ctap2,
	U2f: v.AuthenticatorProtocol.U2f
};
function H(e, t) {
	let n = P(M.enableVirtualAuthenticator);
	return D`
    <div class="webauthn-toolbar-container" jslog=${y()} role="toolbar">
      <devtools-toolbar class="webauthn-toolbar" role="presentation">
        <devtools-checkbox title=${n}
            @click=${t}
            .jslogContext=${"virtual-authenticators"}
            .checked=${e}>
          ${n}
        </devtools-checkbox>
      </devtools-toolbar>
    </div>`;
}
function U() {
	return D`
    <devtools-widget class="learn-more" ${j(s, {
		header: P(M.noAuthenticator),
		text: P(M.useWebauthnForPhishingresistant),
		link: I
	})}>
    </devtools-widget>`;
}
function W(e, t, n, r) {
	let a = e.protocol === v.AuthenticatorProtocol.Ctap2;
	return D`
    <div class="new-authenticator-container">
      <label class="new-authenticator-title">
        ${P(M.newAuthenticator)}
      </label>
      <div class="new-authenticator-form" jslog=${b("new-authenticator")}>
        <div class="authenticator-option">
          <label class="authenticator-option-label" for="protocol">
            ${P(M.protocol)}
          </label>
          <select id="protocol" jslog=${g("protocol").track({ change: !0 })}
              value=${e.protocol}
              @change=${(e) => n({ protocol: e.target.value })}>
            ${Object.values(V).sort().map((e) => D`
              <option value=${e} jslog=${c(e).track({ click: !0 })}>
                ${e}
              </option>`)}
          </select>
        </div>
        <div class="authenticator-option">
          <label for="transport" class="authenticator-option-label">
            ${P(M.transport)}
          </label>
          <select id="transport"
              value=${e.transport}
              jslog=${g("transport").track({ change: !0 })}
              @change=${(e) => n({ transport: e.target.value })}>
            ${[
		v.AuthenticatorTransport.Usb,
		v.AuthenticatorTransport.Ble,
		v.AuthenticatorTransport.Nfc,
		...a ? [v.AuthenticatorTransport.Internal] : []
	].map((n) => D`
                <option value=${n} jslog=${c(n).track({ click: !0 })}
                        .selected=${e.transport === n}
                        .disabled=${!t && n === v.AuthenticatorTransport.Internal}>
                  ${n}
                </option>`)}
          </select>
        </div>
        <div class="authenticator-option">
          <label for="resident-key" class="authenticator-option-label">
            ${P(M.supportsResidentKeys)}
          </label>
          <input id="resident-key" class="authenticator-option-checkbox" type="checkbox"
              jslog=${p("resident-key").track({ change: !0 })}
              @change=${(e) => n({ hasResidentKey: e.target.checked })}
              .checked=${!!(e.hasResidentKey && a)} .disabled=${!a}>
        </div>
        <div class="authenticator-option">
          <label for="user-verification" class="authenticator-option-label">
            ${P(M.supportsUserVerification)}
          </label>
          <input id="user-verification" class="authenticator-option-checkbox" type="checkbox"
              jslog=${p("user-verification").track({ change: !0 })}
              @change=${(e) => n({ hasUserVerification: e.target.checked })}
              .checked=${!!(e.hasUserVerification && a)}
              .disabled=${!a}>
        </div>
        <div class="authenticator-option">
          <label for="large-blob" class="authenticator-option-label">
            ${P(M.supportsLargeBlob)}
          </label>
          <input id="large-blob" class="authenticator-option-checkbox" type="checkbox"
              jslog=${p("large-blob").track({ change: !0 })}
              @change=${(e) => n({ hasLargeBlob: e.target.checked })}
              .checked=${!!(e.hasLargeBlob && a && e.hasResidentKey)}
              .disabled=${!e.hasResidentKey || !a}>
        </div>
        <div class="authenticator-option">
          <label for="hmac-secret" class="authenticator-option-label">
            ${P(M.supportsHmacSecret)}
          </label>
          <input id="hmac-secret" class="authenticator-option-checkbox" type="checkbox"
              jslog=${p("hmac-secret").track({ change: !0 })}
              @change=${(e) => n({ hasHmacSecret: e.target.checked })}
              .checked=${!!((e.hasHmacSecret || e.hasHmacSecretMc) && a)}
              .disabled=${!a || !!e.hasHmacSecretMc}>
        </div>
        <div class="authenticator-option">
          <label for="hmac-secret-mc" class="authenticator-option-label">
            ${P(M.supportsHmacSecretMc)}
          </label>
          <input id="hmac-secret-mc" class="authenticator-option-checkbox" type="checkbox"
              jslog=${p("hmac-secret-mc").track({ change: !0 })}
              @change=${(e) => {
		n(e.target.checked ? {
			hasHmacSecretMc: !0,
			hasHmacSecret: !0
		} : { hasHmacSecretMc: !1 });
	}}
              .checked=${!!(e.hasHmacSecretMc && a)}
              .disabled=${!a}>
        </div>
        <div class="authenticator-option">
          <div class="authenticator-option-label"></div>
          <devtools-button @click=${r}
              id="add-authenticator"
              .jslogContext=${"webauthn.add-authenticator"}
              .variant=${i.OUTLINED}>
            ${P(M.add)}
          </devtools-button>
        </div>
      </div>
    </div>`;
}
function G(e, t, n, r, a, o, s, c, l, u, d) {
	function f(e) {
		if (!e) return;
		let t = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		e.scrollIntoView({
			block: "nearest",
			behavior: t ? "auto" : "smooth"
		});
	}
	return D`
    <div class="authenticator-section" data-authenticator-id=${e}
         jslog=${b("authenticator")}
          ${O((t) => {
		d.revealSection.set(e, f.bind(null, t));
	})}>
      <div class="authenticator-section-header">
        <div class="authenticator-section-title" role="heading" aria-level="2">
          <devtools-toolbar class="edit-name-toolbar">
            <devtools-button title=${P(M.editName)}
                class=${A({ hidden: r })}
                @click=${o}
                .iconName=${"edit"} .variant=${i.TOOLBAR}
                .jslogContext=${"edit-name"}></devtools-button>
            <devtools-button title=${P(M.saveName)}
                @click=${(e) => s((e.target.parentElement?.nextSibling).value)}
                .iconName=${"checkmark"} .variant=${i.TOOLBAR}
                class=${A({ hidden: !r })}
                .jslogContext=${"save-name"}></devtools-button>
          </devtools-toolbar>
          <input class="authenticator-name-field"
              placeholder=${P(M.enterNewName)}
              jslog=${S("name").track({
		keydown: "Enter",
		change: !0
	})}
              value=${P(M.authenticatorS, { PH1: t.name })} .disabled=${!r}
              ${O((e) => {
		e instanceof HTMLInputElement && r && e.focus();
	})}
              @focusout=${(e) => s(e.target.value)}
              @keydown=${(e) => {
		e.key === "Enter" && s(e.target.value);
	}}>
        </div>
        <div class="active-button-container">
          <label title=${P(M.setSAsTheActiveAuthenticator, { PH1: t.name })}>
            <input type="radio" .checked=${n} @change=${(e) => {
		e.target.checked && a();
	}}
                  jslog=${p("webauthn.active-authenticator").track({ change: !0 })}>
            ${P(M.active)}
          </label>
        </div>
        <button class="text-button" @click=${c}
            jslog=${m("webauthn.remove-authenticator").track({ click: !0 })}>
          ${P(M.remove)}
        </button>
      </div>
      ${K(e, t.options)}
      <div class="credentials-title">${P(M.credentials)}</div>
      ${L(e, t.credentials, l, u)}
      <div class="divider"></div>
    </div>`;
}
function K(e, t) {
	return D`
    <div class="authenticator-fields">
      <div class="authenticator-field">
        <label class="authenticator-option-label">${P(M.uuid)}</label>
        <div class="authenticator-field-value">${e}</div>
      </div>
      <div class="authenticator-field">
        <label class="authenticator-option-label">${P(M.protocol)}</label>
        <div class="authenticator-field-value">${t.protocol}</div>
      </div>
      <div class="authenticator-field">
        <label class="authenticator-option-label">${P(M.transport)}</label>
        <div class="authenticator-field-value">${t.transport}</div>
      </div>
      <div class="authenticator-field">
        <label class="authenticator-option-label">
          ${P(M.supportsResidentKeys)}
        </label>
        <div class="authenticator-field-value">
          ${t.hasResidentKey ? P(M.yes) : P(M.no)}
        </div>
      </div>
      <div class="authenticator-field">
        <label class="authenticator-option-label">
          ${P(M.supportsLargeBlob)}
        </label>
        <div class="authenticator-field-value">
          ${t.hasLargeBlob ? P(M.yes) : P(M.no)}
        </div>
      </div>
      <div class="authenticator-field">
        <label class="authenticator-option-label">
          ${P(M.supportsUserVerification)}
        </label>
        <div class="authenticator-field-value">
          ${t.hasUserVerification ? P(M.yes) : P(M.no)}
        </div>
      </div>
      <div class="authenticator-field">
        <label class="authenticator-option-label">
          ${P(M.supportsHmacSecret)}
        </label>
        <div class="authenticator-field-value">
          ${t.hasHmacSecret ? P(M.yes) : P(M.no)}
        </div>
      </div>
      <div class="authenticator-field">
        <label class="authenticator-option-label">
          ${P(M.supportsHmacSecretMc)}
        </label>
        <div class="authenticator-field-value">
          ${t.hasHmacSecretMc ? P(M.yes) : P(M.no)}
        </div>
      </div>
    </div>`;
}
var q = (e, t, n) => {
	E(D`
    <style>${C}</style>
    <style>${w}</style>
    <div class="webauthn-pane flex-auto ${A({ enabled: e.enabled })}">
      ${H(e.enabled, e.onToggleEnabled)}
      <div class="authenticators-view">
         ${k([...e.authenticators.entries()], ([e]) => e, ([n, r]) => G(n, r, e.activeAuthenticatorId === n, e.editingAuthenticatorId === n, e.onActivateAuthenticator.bind(e, n), e.onEditName.bind(e, n), e.onSaveName.bind(e, n), e.onRemoveAuthenticator.bind(e, n), e.onExportCredential, e.onRemoveCredential.bind(e, n), t))}
      </div>
      ${U()}
      ${W(e.newAuthenticatorOptions, e.internalTransportAvailable, e.updateNewAuthenticatorOptions, e.addAuthenticator)}
    </div>`, n);
}, J = class extends u {
	async #e(e) {
		if (!this.#s) throw Error("WebAuthn model is not available.");
		let t = await this.#s.addAuthenticator(e), n = t.slice(-5);
		return this.#i.set(t, {
			name: n,
			options: e,
			credentials: []
		}), this.requestUpdate(), this.#s.addEventListener(a.CREDENTIAL_ADDED, this.#m.bind(this, t)), this.#s.addEventListener(a.CREDENTIAL_ASSERTED, this.#h.bind(this, t)), this.#s.addEventListener(a.CREDENTIAL_UPDATED, this.#h.bind(this, t)), this.#s.addEventListener(a.CREDENTIAL_DELETED, this.#g.bind(this, t)), t;
	}
	#t = null;
	#n = null;
	#r = !1;
	#i = /* @__PURE__ */ new Map();
	#a = !1;
	#o;
	#s;
	#c = {
		protocol: v.AuthenticatorProtocol.Ctap2,
		ctap2Version: v.Ctap2Version.Ctap2_1,
		transport: v.AuthenticatorTransport.Usb,
		hasResidentKey: !1,
		hasUserVerification: !1,
		hasLargeBlob: !1,
		automaticPresenceSimulation: !0,
		isUserVerified: !0
	};
	#l = !1;
	#u;
	#d;
	#f = { revealSection: /* @__PURE__ */ new Map() };
	constructor(e = q) {
		super("webauthn"), this.#d = e, _.instance().observeModels(d, this, { scoped: !0 }), this.#o = r.instance().createSetting("webauthn-authenticators", []), this.#x(), this.performUpdate();
	}
	performUpdate() {
		let e = {
			enabled: this.#a,
			onToggleEnabled: this.#y.bind(this),
			authenticators: this.#i,
			activeAuthenticatorId: this.#t,
			editingAuthenticatorId: this.#n,
			newAuthenticatorOptions: this.#c,
			internalTransportAvailable: !this.#l,
			updateNewAuthenticatorOptions: this.#b.bind(this),
			addAuthenticator: this.#S.bind(this),
			onActivateAuthenticator: this.#D.bind(this),
			onEditName: this.#T.bind(this),
			onSaveName: this.#E.bind(this),
			onRemoveAuthenticator: this.removeAuthenticator.bind(this),
			onExportCredential: this.#C.bind(this),
			onRemoveCredential: this.#w.bind(this)
		};
		this.#d(e, this.#f, this.contentElement);
	}
	modelAdded(e) {
		e.target() === e.target().outermostTarget() && (this.#s = e);
	}
	modelRemoved(e) {
		e.target() === e.target().outermostTarget() && (this.#s = void 0);
	}
	async #p() {
		let e = null, t = this.#o.get();
		for (let n of t) {
			if (!this.#s) continue;
			let t = await this.#e(n);
			n.authenticatorId = t, n.active && (e = t);
		}
		this.#o.set(t), e && this.#D(e);
	}
	async ownerViewDisposed() {
		this.#a = !1, await this.#_(!1);
	}
	#m(e, { data: t }) {
		let n = this.#i.get(e);
		n && (n.credentials.push(t.credential), this.requestUpdate());
	}
	#h(e, { data: t }) {
		let n = this.#i.get(e);
		if (!n) return;
		let r = n.credentials.find((e) => e.credentialId === t.credential.credentialId);
		r && (Object.assign(r, t.credential), this.requestUpdate());
	}
	#g(e, { data: t }) {
		let n = this.#i.get(e);
		if (!n) return;
		let r = n.credentials.findIndex((e) => e.credentialId === t.credentialId);
		r < 0 || (n.credentials.splice(r, 1), this.requestUpdate());
	}
	async #_(e) {
		await this.#u, this.#u = new Promise(async (t) => {
			e && !this.#r && (f.actionTaken(x.VirtualAuthenticatorEnvironmentEnabled), this.#r = !0), this.#s && await this.#s.setVirtualAuthEnvEnabled(e), e ? await this.#p() : this.#v(), this.#u = void 0, this.#a = e, this.requestUpdate(), t();
		});
	}
	#v() {
		this.#i.clear();
	}
	#y() {
		this.#_(!this.#a);
	}
	#b(e) {
		Object.assign(this.#c, e), this.requestUpdate();
	}
	#x() {
		this.#l = !!this.#o.get().find((e) => e.transport === v.AuthenticatorTransport.Internal), this.#l && this.#c.transport === v.AuthenticatorTransport.Internal && (this.#c.transport = v.AuthenticatorTransport.Nfc), this.requestUpdate();
	}
	async #S() {
		let e = { ...this.#c };
		if (this.#s) {
			let t = await this.#e(e);
			this.#t = t;
			let n = this.#o.get();
			n.push({
				authenticatorId: t,
				active: !0,
				...e
			}), this.#o.set(n.map((e) => ({
				...e,
				active: e.authenticatorId === t
			}))), this.#x(), await this.updateComplete, this.#f.revealSection.get(t)?.();
		}
	}
	#C(e) {
		let t = z;
		for (let n = 0; n < e.privateKey.length; n += 64) t += e.privateKey.substring(n, n + 64) + "\n";
		t += B;
		let n = document.createElement("a");
		n.download = P(M.privateKeypem), n.href = "data:application/x-pem-file," + encodeURIComponent(t), n.click();
	}
	#w(e, t) {
		let n = this.#i.get(e);
		if (!n) return;
		let r = n.credentials.findIndex((e) => e.credentialId === t);
		r < 0 || (n.credentials.splice(r, 1), this.requestUpdate(), this.#s && this.#s.removeCredential(e, t));
	}
	#T(e) {
		this.#n = e, this.requestUpdate();
	}
	#E(e, t) {
		let n = this.#i.get(e);
		n && (n.name = t, this.#n = null, this.requestUpdate());
	}
	removeAuthenticator(e) {
		this.#i.delete(e), this.requestUpdate(), this.#s && this.#s.removeAuthenticator(e);
		let t = this.#o.get().filter((t) => t.authenticatorId !== e);
		if (this.#o.set(t), this.#t === e) {
			let e = Array.from(this.#i.keys());
			e.length ? this.#D(e[0]) : this.#t = null;
		}
		this.#x();
	}
	async #D(e) {
		await this.#O(), this.#s && await this.#s.setAutomaticPresenceSimulation(e, !0), this.#t = e;
		let t = this.#o.get().map((t) => ({
			...t,
			active: t.authenticatorId === e
		}));
		this.#o.set(t), this.requestUpdate();
	}
	async #O() {
		this.#t && this.#s && await this.#s.setAutomaticPresenceSimulation(this.#t, !1), this.#t = null, this.requestUpdate();
	}
};
//#endregion
export { T as WebauthnPane };
