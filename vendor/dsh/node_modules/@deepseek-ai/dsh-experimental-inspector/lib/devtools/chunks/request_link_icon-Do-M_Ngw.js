import { D as e, H as t, K as n } from "./common-DMSVbaSb.js";
import { Fo as r, No as i, Vo as a, Zo as o, wo as s, za as c } from "./legacy-dM_vujv7.js";
import { n as l, r as u } from "./UIRequestLocation-CtGcVN3I.js";
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/components/request_link_icon/requestLinkIcon.css.mjs
var d = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  display: inline-block;\n  white-space: nowrap;\n  color: inherit;\n  font-size: inherit;\n  font-family: inherit;\n}\n\n:host([hidden]) {\n  display: none;\n}\n\nbutton {\n  border: none;\n  background: transparent;\n  margin: 0;\n  padding: 0;\n  font-family: inherit;\n  font-size: inherit;\n  color: inherit;\n\n  &.link {\n    cursor: pointer;\n\n    & > span {\n      color: var(--sys-color-primary);\n    }\n  }\n}\n\ndevtools-icon {\n  width: 16px;\n  height: 16px;\n  vertical-align: middle;\n  color: var(--icon-no-request);\n\n  .link > & {\n    color: var(--icon-link);\n  }\n}\n\n@media (forced-colors: active) {\n  devtools-icon {\n    color: ButtonText;\n  }\n}\n", { html: f } = i, p = {
	clickToShowRequestInTheNetwork: "Click to open the network panel and show request for URL: {url}",
	requestUnavailableInTheNetwork: "Request unavailable in the network panel, try reloading the inspected page",
	shortenedURL: "Shortened URL"
}, m = n("ui/components/request_link_icon/RequestLinkIcon.ts", p), h = t.bind(void 0, m), g = (e) => (/[^/]+$/.exec(e) || /[^/]+\/$/.exec(e) || [""])[0], _ = class extends HTMLElement {
	#e = this.attachShadow({ mode: "open" });
	#t;
	#n;
	#r;
	#i;
	#a = !1;
	#o;
	#s;
	#c;
	#l;
	#u = e;
	set data(e) {
		if (this.#t = e.linkToPreflight, this.#n = e.request, e.affectedRequest && (this.#c = { ...e.affectedRequest }), this.#r = e.highlightHeader, this.#s = e.networkTab, this.#i = e.requestResolver, this.#a = e.displayURL ?? !1, this.#o = e.urlToDisplay, this.#l = e.additionalOnClickAction, e.revealOverride && (this.#u = e.revealOverride), !this.#n && e.affectedRequest?.requestId !== void 0) {
			if (!this.#i) throw Error("A `RequestResolver` must be provided if an `affectedRequest` is provided.");
			this.#i.waitFor(e.affectedRequest.requestId).then((e) => (this.#n = e, this.#m())).catch(() => {
				this.#n = null;
			});
		}
		this.#m();
	}
	get data() {
		return {
			linkToPreflight: this.#t,
			request: this.#n,
			affectedRequest: this.#c,
			highlightHeader: this.#r,
			networkTab: this.#s,
			requestResolver: this.#i,
			displayURL: this.#a,
			urlToDisplay: this.#o,
			additionalOnClickAction: this.#l,
			revealOverride: this.#u === e ? void 0 : this.#u
		};
	}
	handleClick(e) {
		if (e.button !== 0) return;
		let t = this.#t ? this.#n?.preflightRequest() : this.#n;
		if (t) {
			if (this.#r) {
				let e = l.header(t, this.#r.section, this.#r.name);
				this.#u(e);
			} else {
				let e = l.tab(t, this.#s ?? u.HEADERS_COMPONENT);
				this.#u(e);
			}
			this.#l?.(), e.consume();
		}
	}
	#d() {
		return this.#n ? h(p.clickToShowRequestInTheNetwork, { url: this.#n.url() }) : h(p.requestUnavailableInTheNetwork);
	}
	#f() {
		if (this.#a) return this.#n ? this.#n.url() : this.#c?.url;
	}
	#p() {
		let e = this.#f();
		if (!e) return o;
		if (this.#o) return f`<span title=${e}>${this.#o}</span>`;
		let t = g(e);
		return f`<span aria-label=${h(p.shortenedURL)} title=${e}>${t}</span>`;
	}
	async #m() {
		return await s(() => {
			let e = this.#p();
			(this.#n || this.#c?.requestId !== void 0) && (e = f`
          <button class=${a({ link: !!this.#n })}
                  title=${this.#d()}
                  jslog=${c("request").track({ click: !0 })}
                  @click=${this.handleClick}>
            <devtools-icon name="arrow-up-down-circle"></devtools-icon>
            ${e}
          </button>`), r(f`<style>${d}</style>${e}`, this.#e, { host: this });
		});
	}
};
customElements.define("devtools-request-link-icon", _);
//#endregion
export { _ as t };
