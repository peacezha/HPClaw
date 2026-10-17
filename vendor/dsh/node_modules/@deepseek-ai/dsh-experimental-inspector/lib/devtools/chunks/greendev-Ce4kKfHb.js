import { n as e } from "./rolldown-runtime-DF993M8W.js";
import { Hr as t, S as n, Vr as r, Yf as i, el as a, jd as o, ll as s, ni as c } from "./legacy-dM_vujv7.js";
import { n as l } from "./marked-CGxJO_CC.js";
import { n as u } from "./markdown_view-D8BG91nk.js";
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/greendev/GreenDevPanel.css.mjs
var d = "/* eslint-disable color-named, no-duplicate-selectors */\n/* stylelint-disable plugin/use_theme_colors */\n/*\n * Copyright 2026 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:root {\n  --gemini-logo: url(\"data:image/svg+xml,%0A%3Csvg%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2065%2065%22%3E%3Cmask%20id%3D%22maskme%22%20style%3D%22mask-type%3Aalpha%22%20maskUnits%3D%22userSpaceOnUse%22%20x%3D%220%22%20y%3D%220%22%20width%3D%2265%22%20height%3D%2265%22%3E%3Cpath%20d%3D%22M32.447%200c.68%200%201.273.465%201.439%201.125a38.904%2038.904%200%20001.999%205.905c2.152%205%205.105%209.376%208.854%2013.125%203.751%203.75%208.126%206.703%2013.125%208.855a38.98%2038.98%200%20005.906%201.999c.66.166%201.124.758%201.124%201.438%200%20.68-.464%201.273-1.125%201.439a38.902%2038.902%200%2000-5.905%201.999c-5%202.152-9.375%205.105-13.125%208.854-3.749%203.751-6.702%208.126-8.854%2013.125a38.973%2038.973%200%2000-2%205.906%201.485%201.485%200%2001-1.438%201.124c-.68%200-1.272-.464-1.438-1.125a38.913%2038.913%200%2000-2-5.905c-2.151-5-5.103-9.375-8.854-13.125-3.75-3.749-8.125-6.702-13.125-8.854a38.973%2038.973%200%2000-5.905-2A1.485%201.485%200%20010%2032.448c0-.68.465-1.272%201.125-1.438a38.903%2038.903%200%20005.905-2c5-2.151%209.376-5.104%2013.125-8.854%203.75-3.749%206.703-8.125%208.855-13.125a38.972%2038.972%200%20001.999-5.905A1.485%201.485%200%200132.447%200z%22%20fill%3D%22%23000%22/%3E%3Cpath%20d%3D%22M32.447%200c.68%200%201.273.465%201.439%201.125a38.904%2038.904%200%20001.999%205.905c2.152%205%205.105%209.376%208.854%2013.125%203.751%203.75%208.126%206.703%2013.125%208.855a38.98%2038.98%200%20005.906%201.999c.66.166%201.124.758%201.124%201.438%200%20.68-.464%201.273-1.125%201.439a38.902%2038.902%200%2000-5.905%201.999c-5%202.152-9.375%205.105-13.125%208.854-3.749%203.751-6.702%208.126-8.854%2013.125a38.973%2038.973%200%2000-2%205.906%201.485%201.485%200%2001-1.438%201.124c-.68%200-1.272-.464-1.438-1.125a38.913%2038.913%200%2000-2-5.905c-2.151-5-5.103-9.375-8.854-13.125-3.75-3.749-8.125-6.702-13.125-8.854a38.973%2038.973%200%2000-5.905-2A1.485%201.485%200%20010%2032.448c0-.68.465-1.272%201.125-1.438a38.903%2038.903%200%20005.905-2c5-2.151%209.376-5.104%2013.125-8.854%203.75-3.749%206.703-8.125%208.855-13.125a38.972%2038.972%200%20001.999-5.905A1.485%201.485%200%200132.447%200z%22%20fill%3D%22%23000%22/%3E%3Cpath%20d%3D%22M32.447%200c.68%200%201.273.465%201.439%201.125a38.904%2038.904%200%20001.999%205.905c2.152%205%205.105%209.376%208.854%2013.125%203.751%203.75%208.126%206.703%2013.125%208.855a38.98%2038.98%200%20005.906%201.999c.66.166%201.124.758%201.124%201.438%200%20.68-.464%201.273-1.125%201.439a38.902%2038.902%200%2000-5.905%201.999c-5%202.152-9.375%205.105-13.125%208.854-3.749%203.751-6.702%208.126-8.854%2013.125a38.973%2038.973%200%2000-2%205.906%201.485%201.485%200%2001-1.438%201.124c-.68%200-1.272-.464-1.438-1.125a38.913%2038.913%200%2000-2-5.905c-2.151-5-5.103-9.375-8.854-13.125-3.75-3.749-8.125-6.702-13.125-8.854a38.973%2038.973%200%2000-5.905-2A1.485%201.485%200%20010%2032.448c0-.68.465-1.272%201.125-1.438a38.903%2038.903%200%20005.905-2c5-2.151%209.376-5.104%2013.125-8.854%203.75-3.749%206.703-8.125%208.855-13.125a38.972%2038.972%200%20001.999-5.905A1.485%201.485%200%200132.447%200z%22%20fill%3D%22%23000%22/%3E%3Cpath%20d%3D%22M32.447%200c.68%200%201.273.465%201.439%201.125a38.904%2038.904%200%20001.999%205.905c2.152%205%205.105%209.376%208.854%2013.125%203.751%203.75%208.126%206.703%2013.125%208.855a38.98%2038.98%200%20005.906%201.999c.66.166%201.124.758%201.124%201.438%200%20.68-.464%201.273-1.125%201.439a38.902%2038.902%200%2000-5.905%201.999c-5%202.152-9.375%205.105-13.125%208.854-3.749%203.751-6.702%208.126-8.854%2013.125a38.973%2038.973%200%2000-2%205.906%201.485%201.485%200%2001-1.438%201.124c-.68%200-1.272-.464-1.438-1.125a38.913%2038.913%200%2000-2-5.905c-2.151-5-5.103-9.375-8.854-13.125-3.75-3.749-8.125-6.702-13.125-8.854a38.973%2038.973%200%2000-5.905-2A1.485%201.485%200%20010%2032.448c0-.68.465-1.272%201.125-1.438a38.903%2038.903%200%20005.905-2c5-2.151%209.376-5.104%2013.125-8.854%203.75-3.749%206.703-8.125%208.855-13.125a38.972%2038.972%200%20001.999-5.905A1.485%201.485%200%200132.447%200z%22%20fill%3D%22%23000%22/%3E%3C/mask%3E%3Cg%20mask%3D%22url%28%23maskme%29%22%3E%3Cpath%20d%3D%22M32.447%200c25.437%200%2046.062%2020.625%2046.062%2046.062%200%2025.438-20.625%2046.063-46.062%2046.063-25.438%200-46.062-20.625-46.062-46.063C-13.615%2020.625%207.01%200%2032.447%200z%22%20fill%3D%22%231967D2%22/%3E%3Cpath%20d%3D%22M65%200v65H0V0h65z%22%20fill%3D%22%231967D2%22/%3E%3Cpath%20d%3D%22M63.79%2033.567L33.567%2063.79%201.21%2031.433%2031.433%201.21%2063.79%2033.567z%22%20fill%3D%22%23fff%22%20style%3D%22mix-blend-mode%3Asoft-light%22/%3E%3C/g%3E%3C/svg%3E\");\n}\n\n.green-dev-floaty-dialog {\n  width: 100%;\n  height: 100%;\n  background-color: #fff;\n  display: flex;\n  flex-direction: column;\n  font-family: sans-serif;\n  color: #333;\n  font-size: 16px;\n  box-sizing: border-box;\n}\n\n/* Header extending upwards */\n.green-dev-floaty-dialog-header {\n  position: relative;\n  height: 70px;\n  margin-top: -20px;\n  background-color: #d3e3fd;\n  border-top-left-radius: 12px;\n  border-top-right-radius: 12px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 34px 10px 11px;\n  box-sizing: border-box;\n}\n\n.green-dev-floaty-dialog-header-text {\n  font-weight: bold;\n  font-size: 18px;\n}\n\n.green-dev-floaty-dialog-close-button {\n  width: 20px;\n  height: 20px;\n  background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23333' d='M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z'/%3E%3C/svg%3E\");\n  background-size: cover;\n  cursor: pointer;\n  border: none;\n  background-color: transparent;\n  padding: 0;\n}\n\n/* Main content area of the white card */\n.green-dev-floaty-dialog-content {\n  flex-grow: 1;\n  padding: 20px;\n  display: flex;\n  flex-direction: column;\n  min-height: 0; /* Important for flex-grow with overflow */\n}\n\n.green-dev-floaty-dialog-chat-container {\n  flex-grow: 1;\n  margin-bottom: 10px;\n  overflow-y: auto;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  padding: 10px;\n  border: 1px solid #e0e0e0;\n  border-radius: 8px;\n  background-color: #f9f9f9;\n}\n\n.message {\n  padding: 8px 12px;\n  border-radius: 12px;\n  max-width: 85%;\n  overflow-wrap: break-word;\n  line-height: 1.4;\n  white-space: pre-wrap; /* Preserve newlines */\n}\n\n.user-message {\n  align-self: flex-end;\n  background-color: #d3e3fd;\n  color: #0b57d0;\n  border-bottom-right-radius: 2px;\n}\n\n.ai-message {\n  align-self: flex-start;\n  background-color: #fff;\n  color: #333;\n  border: 1px solid #e0e0e0;\n  border-bottom-left-radius: 2px;\n}\n\n.message-details-toggle {\n  font-size: 11px;\n  color: #0b57d0;\n  cursor: pointer;\n  margin-top: 4px;\n  text-decoration: underline;\n}\n\n.message-details-toggle:hover {\n  color: #0842a0;\n}\n\n.message-details {\n  font-size: 11px;\n  color: #666;\n  margin-top: 8px;\n  padding-top: 8px;\n  border-top: 1px solid #eee;\n  font-family: var(--monospace-font-family);\n}\n\n.thought, .action {\n  margin-bottom: 6px;\n  white-space: pre-wrap;\n}\n\n.thought {\n  font-style: italic;\n}\n\n.green-dev-floaty-dialog-top-row {\n  display: flex;\n  align-items: center;\n  margin-bottom: 15px; /* Space between top row and blue card */\n}\n\n.green-dev-floaty-dialog-gemini-icon {\n  width: 24px;\n  height: 24px;\n  background-image: var(--gemini-logo);\n  background-size: cover;\n  margin-right: 10px;\n}\n\n.green-dev-floaty-dialog-checkmark-icon {\n  width: 20px;\n  height: 20px;\n  background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%234CAF50' d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'/%3E%3C/svg%3E\");\n  background-size: cover;\n  margin-right: 5px;\n}\n\n.green-dev-floaty-dialog-context-text {\n  font-weight: bold;\n}\n\n/* Blue card at the bottom */\n.green-dev-floaty-dialog-blue-card {\n  position: relative;\n  background-color: #edf2fa; /* Light blue */\n  border-radius: 12px;\n  padding: 12px;\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  border: 1px solid #d3e3fd;\n}\n\n.green-dev-floaty-dialog-node-description {\n  font-size: 11px;\n  font-family: var(--monospace-font-family);\n  color: #0b57d0;\n  background-color: #d3e3fd;\n  padding: 2px 8px;\n  margin-bottom: 10px;\n  border-radius: 4px;\n  align-self: flex-start;\n  max-width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.input-row {\n  display: flex;\n  align-items: center;\n  width: 100%;\n}\n\n.green-dev-floaty-dialog-text-field {\n  flex-grow: 1;\n  background-color: #fff;\n  border: 1px solid #a7d9f0;\n  border-radius: 20px; /* Pill shape */\n  padding: 8px 16px;\n  font-size: 14px;\n  color: #333;\n  margin-right: 8px;\n  outline: none;\n  transition: border-color 0.2s;\n}\n\n.green-dev-floaty-dialog-text-field:focus {\n  border-color: #0b57d0;\n}\n\n.green-dev-floaty-dialog-play-button {\n  width: 30px;\n  height: 30px;\n  background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%231976D2' d='M8 5v14l11-7z'/%3E%3C/svg%3E\");\n  background-size: cover;\n  cursor: pointer;\n  border: none;\n  background-color: transparent;\n  padding: 0;\n}\n\n.green-dev-floaty-minimal {\n  position: absolute;\n  width: 40px;\n  height: 40px;\n  background-color: #fff;\n  background-image: var(--gemini-logo);\n  background-repeat: no-repeat;\n  background-position: center;\n  background-size: 32px;\n  cursor: pointer;\n  pointer-events: all;\n  z-index: 1001;\n  border-radius: 12px;\n  box-shadow: 0 4px 8px rgb(0 0 0 / 20%);\n  padding: 5px;\n}\n\n.green-dev-floaty-disclaimer {\n  font-size: 15px;\n  color: #666;\n  text-align: center;\n  margin-top: 8px;\n  position: relative; /* For tooltip positioning */\n}\n\n.disclaimer-link {\n  color: #666; /* Match text color */\n  text-decoration: underline;\n  cursor: pointer;\n}\n\n.disclaimer-tooltip {\n  display: none;\n  position: absolute;\n  bottom: 100%; /* Position above */\n  left: 50%;\n  transform: translateX(-50%);\n  width: 300px;\n  padding: 12px;\n  background-color: #fff;\n  border: 1px solid #ccc;\n  border-radius: 8px;\n  box-shadow: 0 2px 10px rgb(0 0 0 / 20%);\n  z-index: 1000;\n  text-align: left;\n  font-size: 16px;\n  line-height: 1.4;\n  color: #333;\n  white-space: normal; /* Ensure text wraps */\n}\n\n.disclaimer-link:hover + .disclaimer-tooltip,\n.disclaimer-tooltip:hover {\n  display: block;\n}\n\n.learn-more-link {\n  color: #0b57d0;\n  text-decoration: none;\n}\n\n.learn-more-link:hover {\n  text-decoration: underline;\n}\n", f = /* @__PURE__ */ e({ GreenDevPanel: () => m }), p, m = class e extends n {
	#e;
	#t = /* @__PURE__ */ new Map();
	#n;
	constructor() {
		super("greendev"), this.contentElement.style.display = "flex", this.contentElement.style.flexDirection = "column", this.contentElement.style.height = "100%", this.contentElement.style.overflow = "hidden", this.#e = new t(), this.#e.element.style.flex = "1", this.#e.show(this.contentElement), this.#a(), this.#e.addEventListener(r.TabClosed, this.#i, this), this.#n = new BroadcastChannel("green-dev-sync"), this.#n.onmessage = (e) => {
			this.#o(e.data);
		}, this.#n.postMessage({ type: "request-session-state" });
	}
	wasShown() {
		super.wasShown(), this.registerRequiredCSS(d), s.setInspectNodeHandler(this.#r.bind(this));
	}
	willHide() {
		super.willHide(), s.setInspectNodeHandler(async () => {});
	}
	async #r(e) {}
	#i(e) {
		let t = e.data.tabId;
		t !== "welcome" && (this.#t.delete(t), this.#t.size === 0 && (this.#e.hasTab("welcome") || this.#a()));
	}
	#a() {
		let e = new c();
		e.element.style.display = "flex", e.element.style.alignItems = "center", e.element.style.justifyContent = "center", e.element.style.height = "100%";
		let t = document.createElement("div");
		t.textContent = "Interact with GreenDev Floaty dialogs to see conversations here.", t.style.padding = "20px", t.style.fontSize = "14px", t.style.color = "var(--sys-color-on-surface-subtle)", e.contentElement.appendChild(t), this.#e.appendTab("welcome", "Welcome", e), this.#e.selectTab("welcome");
	}
	closeSession(e) {
		this.#e.closeTab(e);
	}
	async #o(e) {
		let t = String(e.sessionId);
		if (!t || t === "0" || t === "undefined") return;
		let n = this.#t.get(t);
		if (!n) {
			this.#e.hasTab("welcome") && this.#e.closeTab("welcome");
			let r = new c();
			r.contentElement.className = "green-dev-floaty-dialog", r.contentElement.style.display = "flex", r.contentElement.style.flexDirection = "column", r.contentElement.style.height = "100%", r.contentElement.style.padding = "0";
			let a = document.createElement("div");
			a.className = "green-dev-floaty-dialog-content", a.style.flexGrow = "1", a.style.display = "flex", a.style.flexDirection = "column", a.style.overflow = "hidden";
			let o = document.createElement("div");
			o.className = "green-dev-floaty-dialog-top-row", o.style.flexShrink = "0";
			let s = document.createElement("div");
			s.className = "green-dev-floaty-dialog-gemini-icon";
			let l = document.createElement("div");
			l.className = "green-dev-floaty-dialog-checkmark-icon";
			let u = document.createElement("span");
			u.className = "green-dev-floaty-dialog-context-text", u.textContent = "Context added", o.appendChild(s), o.appendChild(l), o.appendChild(u), a.appendChild(o);
			let d = document.createElement("div");
			d.className = "green-dev-floaty-dialog-chat-container", d.style.flexGrow = "1", d.style.overflowY = "auto", a.appendChild(d);
			let f = document.createElement("div");
			f.className = "green-dev-floaty-dialog-blue-card", f.style.flexShrink = "0";
			let p = document.createElement("div");
			p.className = "green-dev-floaty-dialog-node-description", p.style.whiteSpace = "normal", p.style.overflow = "auto", f.appendChild(p);
			let m = document.createElement("div");
			m.className = "input-row";
			let h = document.createElement("input");
			h.type = "text", h.className = "green-dev-floaty-dialog-text-field", h.placeholder = "Ask a question...";
			let g = document.createElement("button");
			g.className = "green-dev-floaty-dialog-play-button";
			let _ = () => {
				let e = h.value;
				e && (h.value = "", this.#n.postMessage({
					type: "user-input",
					sessionId: parseInt(t, 10),
					text: e
				}));
			};
			g.addEventListener("click", _), h.addEventListener("keydown", (e) => {
				e.key === "Enter" && _();
			}), m.appendChild(h), m.appendChild(g), f.appendChild(m);
			let v = document.createElement("div");
			v.className = "green-dev-floaty-disclaimer";
			let y = document.createElement("span");
			y.className = "disclaimer-link", y.textContent = "Relevant data", v.appendChild(y), v.appendChild(document.createTextNode(" is sent to Google"));
			let b = document.createElement("div");
			b.className = "disclaimer-tooltip", b.appendChild(document.createTextNode("Chat messages and any data the inspected page can access via Web APIs are sent to Google and may be seen by human reviewers to improve this feature. This is an experimental AI feature and won't always get it right.")), b.appendChild(document.createElement("br")), b.appendChild(document.createElement("br"));
			let x = document.createElement("a"), S = "https://developer.chrome.com/docs/devtools/ai-assistance";
			x.href = S, x.className = "learn-more-link", x.textContent = "Learn about AI in DevTools", x.addEventListener("click", (e) => {
				e.preventDefault(), i.openInNewTab(S);
			}), b.appendChild(x), v.appendChild(b), f.appendChild(v), a.appendChild(f), r.contentElement.appendChild(a), this.#t.set(t, {
				view: r,
				container: d,
				description: p
			}), n = {
				view: r,
				container: d,
				description: p
			};
			let C = e.nodeDescription || `Node ${t}`;
			this.#e.appendTab(t, C, r, void 0, void 0, !0), this.#e.selectTab(t);
		}
		if (!n.node && (e.type === "full-state" || e.type === "node-changed" || !n)) {
			let e = parseInt(t, 10), r = o.instance(), i = r.primaryPageTarget(), s = async (t) => {
				let r = t.model(a);
				if (r) {
					let t = (await r.pushNodesByBackendIdsToFrontend(/* @__PURE__ */ new Set([e])))?.get(e) || null;
					t && n && (n.node = t, this.#s(n.description, t));
				}
			};
			i ? await s(i) : r.observeTargets({
				targetAdded: async (e) => {
					e === r.primaryPageTarget() && (i = e, await s(i));
				},
				targetRemoved: (e) => {}
			});
		}
		if (e.type === "new-message" && e.text) this.#c(n.container, e.text, e.isUser ?? !1);
		else if (e.type === "update-last-message") {
			let t = n.container.lastElementChild?.querySelector(".message-content devtools-markdown-view");
			t && (t.data = { tokens: l(e.text ?? "") });
		} else if (e.type === "full-state") {
			if (n.container.innerHTML = "", e.messages) for (let t of e.messages) this.#c(n.container, t.text, t.isUser);
		} else e.type === "select-tab" && this.#e.selectTab(t);
		e.nodeDescription && (n.description.textContent = e.nodeDescription, e.type === "node-changed" && this.#e.changeTabTitle(t, e.nodeDescription));
	}
	#s(e, t) {
		e.addEventListener("mousemove", () => {
			t.highlight();
		}), e.addEventListener("mouseleave", () => {
			t.domModel().overlayModel().clearHighlight();
		});
	}
	#c(e, t, n) {
		let r = document.createElement("div");
		r.className = `message ${n ? "user-message" : "ai-message"}`, r.style.display = "flex", r.style.flexDirection = "column", r.style.flexShrink = "0";
		let i = document.createElement("div");
		if (i.className = "message-content", n) i.textContent = t;
		else {
			let e = new u();
			e.data = { tokens: l(t) }, i.append(e);
			let n = document.createElement("style");
			n.textContent = "\n        .message { font-size: 1.0rem; }\n        .message code { font-size: 1.0rem; font-family: 'Roboto Mono', monospace; color: green; }\n        devtools-code-block {\n          white-space: pre-wrap;\n        }\n      ", e.shadowRoot?.appendChild(n);
			let r = e.shadowRoot?.querySelectorAll("devtools-code-block");
			for (let e of r ?? []) e.connectedCallback();
		}
		i.style.flexGrow = "1", r.appendChild(i), e.appendChild(r), e.scrollTop = e.scrollHeight;
	}
	static instance(t = { forceNew: null }) {
		let { forceNew: n } = t;
		return (!p || n) && (p = new e()), p;
	}
};
window.GreenDevPanel = { closeSession: (e) => {
	p && p.closeSession(String(e));
} };
//#endregion
export { f as GreenDevPanel };
