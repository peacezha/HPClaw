import { n as e } from "./rolldown-runtime-DF993M8W.js";
import { $ as t, H as n, K as r } from "./common-DMSVbaSb.js";
import { $i as i, Ao as a, Fo as o, Jn as s, L as c, La as l, Mp as u, No as d, Of as f, Po as p, Qi as m, S as h, Wo as g, Yf as _, Zi as v, ei as y, ii as ee, ja as b, jd as x, kd as S, mo as C, qa as te, x as ne } from "./legacy-dM_vujv7.js";
import "./platform-D4TUCh2P.js";
import { c as re } from "./text_utils-DWSliayn.js";
import { o as ie } from "./bindings-DyamxTH2.js";
import { i as w, r as T } from "./protocol_client-L4-X1Qrb.js";
import "./data_grid-C6uthMeA.js";
import { d as ae } from "./components-ChzSxrwT.js";
import { i as E } from "./source_frame-B0odV5Nv.js";
import "./menus-CbHfE0QY.js";
import { t as D } from "./suggestion_input-CbJ3xGeU.js";
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/protocol_monitor/JSONEditor.css.mjs
var oe = "/*\n * Copyright 2023 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n* {\n  box-sizing: border-box;\n  padding: 0;\n  margin: 0;\n  font-size: inherit;\n}\n\n:host {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n}\n\n.target-selector {\n  max-width: var(--sys-size-21);\n}\n\n.warning-icon {\n  margin-left: -18px;\n  margin-right: 4px;\n}\n\n.row {\n  flex-wrap: wrap;\n}\n\n.row,\n.row-icons {\n  display: flex;\n  flex-direction: row;\n  color: var(--sys-color-token-property-special);\n  font-family: var(--monospace-font-family);\n  font-size: var(--monospace-font-size);\n  align-items: center;\n  line-height: 18px;\n  margin-top: 3px;\n}\n\n.separator {\n  margin-right: 0.5em;\n  color: var(--sys-color-on-surface);\n}\n\nul {\n  padding-left: 2em;\n}\n\n.optional-parameter {\n  color: var(--sys-color-token-attribute-value);\n\n  --override-color-recorder-input: var(--sys-color-on-surface);\n}\n\n.undefined-parameter {\n  color: var(--sys-color-state-disabled);\n}\n\n.wrapper {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  min-height: 0;\n}\n\n.editor-wrapper {\n  padding-left: 1em;\n  overflow-x: hidden;\n  flex-grow: 1;\n  padding-top: 0.5em;\n  min-height: 1lh;\n}\n\n.editor-wrapper::after {\n  content: \"\";\n  display: block;\n  height: 50px;\n}\n\n.clear-button,\n.add-button,\n.delete-button {\n  opacity: 0%;\n  transition: opacity 0.3s ease-in-out;\n}\n\n.clear-button,\n.delete-button {\n  margin-left: 5px;\n}\n\n.row:focus-within .delete-button,\n.row:focus-within .add-button,\n.row:focus-within .clear-button,\n.row:hover .delete-button,\n.row:hover .add-button,\n.row:hover .clear-button {\n  opacity: 100%;\n}\n\n.protocol-monitor-sidebar-toolbar {\n  border-top: 1px solid var(--sys-color-divider);\n}\n", se = /* @__PURE__ */ e({
	DEFAULT_VIEW: () => U,
	Events: () => pe,
	JSONEditor: () => z,
	ParameterType: () => P,
	suggestionFilter: () => R
}), { html: O, render: ce, Directives: le, nothing: k } = d, { live: A, classMap: j, repeat: ue } = le, M = {
	deleteParameter: "Delete parameter",
	addParameter: "Add a parameter",
	resetDefaultValue: "Reset to default value",
	addCustomProperty: "Add custom property",
	sendCommandCtrlEnter: "Send command - Ctrl+Enter",
	sendCommandCmdEnter: "Send command - ⌘+Enter",
	copyCommand: "Copy command",
	selectTarget: "Select a target"
}, de = r("panels/protocol_monitor/JSONEditor.ts", M), N = n.bind(void 0, de), P = /* @__PURE__ */ function(e) {
	return e.STRING = "string", e.NUMBER = "number", e.BOOLEAN = "boolean", e.ARRAY = "array", e.OBJECT = "object", e.UNKNOWN = "unknown", e;
}({}), fe = (e) => {
	if (e.length > 150) {
		let [t, n] = e.split(".");
		return t + "", [t, n];
	}
	return [e, ""];
}, F = /* @__PURE__ */ new Map([
	["string", ""],
	["number", 0],
	["boolean", !1],
	["unknown", ""]
]), I = "dummy", L = "<empty_string>";
function R(e, t) {
	return e.toLowerCase().includes(t.toLowerCase());
}
var pe = /* @__PURE__ */ function(e) {
	return e.SUBMIT_EDITOR = "submiteditor", e;
}({}), z = class extends t(y) {
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ new Map();
	#n = /* @__PURE__ */ new Map();
	#r = [];
	#i = [];
	#a = "";
	#o;
	#s;
	#c;
	displayTargetSelector = !0;
	displayCommandInput = !0;
	displayToolbar = !0;
	constructor(e, t = U) {
		super(e, { useShadowDom: !0 }), this.#c = t, this.registerRequiredCSS(oe);
	}
	get metadataByCommand() {
		return this.#e;
	}
	set metadataByCommand(e) {
		this.#e = e, this.requestUpdate();
	}
	get typesByName() {
		return this.#t;
	}
	set typesByName(e) {
		this.#t = e, this.requestUpdate();
	}
	get enumsByName() {
		return this.#n;
	}
	set enumsByName(e) {
		this.#n = e, this.requestUpdate();
	}
	get parameters() {
		return this.#r;
	}
	set parameters(e) {
		this.#r = e, this.requestUpdate();
	}
	get targets() {
		return this.#i;
	}
	set targets(e) {
		this.#i = e, this.requestUpdate();
	}
	get command() {
		return this.#a;
	}
	set command(e) {
		this.#a !== e && (this.#a = e, this.requestUpdate());
	}
	set commandToDisplay(e) {
		this.displayCommand(e.command, e.parameters ?? {});
	}
	get targetId() {
		return this.#o;
	}
	set targetId(e) {
		this.#o !== e && (this.#o = e, this.requestUpdate());
	}
	wasShown() {
		super.wasShown(), this.#s = new ne(this.contentElement, (e) => this.#m(e), "protocol-monitor.hint"), this.#s.setDisableOnClick(!0), this.#s.setTimeout(300), x.instance().addEventListener(S.AVAILABLE_TARGETS_CHANGED, this.#l, this), this.#l(), this.requestUpdate();
	}
	willHide() {
		super.willHide(), this.#s?.hidePopover(), this.#s?.dispose(), x.instance().removeEventListener(S.AVAILABLE_TARGETS_CHANGED, this.#l, this);
	}
	#l() {
		this.targets = x.instance().targets(), this.targets.length && this.targetId === void 0 && (this.targetId = this.targets[0].id());
	}
	getParameters() {
		let e = (t) => {
			if (t.value !== void 0) switch (t.type) {
				case "number": return Number(t.value);
				case "boolean": return !!t.value;
				case "object": {
					let n = {};
					for (let r of t.value) e(r) !== void 0 && (n[r.name] = e(r));
					return Object.keys(n).length === 0 ? void 0 : n;
				}
				case "array": {
					let n = [];
					for (let r of t.value) n.push(e(r));
					return n.length === 0 ? [] : n;
				}
				case "unknown": try {
					return JSON.parse(t.value);
				} catch {
					return t.value;
				}
				default: return t.value;
			}
		}, t = {};
		for (let n of this.parameters) t[n.name] = e(n);
		return e({
			type: "object",
			name: I,
			optional: !0,
			value: this.parameters,
			description: ""
		});
	}
	displayCommand(e, t, n) {
		this.targetId = n, this.command = e;
		let r = this.metadataByCommand.get(this.command);
		if (!r?.parameters) return;
		this.populateParametersForCommandWithDefaultValues();
		let i = this.#u("", t, {
			typeRef: I,
			type: "object",
			name: "",
			description: "",
			optional: !0,
			value: []
		}, r.parameters).value, a = new Map(this.parameters.map((e) => [e.name, e]));
		for (let e of i) {
			let t = a.get(e.name);
			t && (t.value = e.value);
		}
		this.requestUpdate();
	}
	#u(e, t, n, r) {
		let i = n?.type || typeof t, a = n?.description ?? "", o = n?.optional ?? !0;
		switch (i) {
			case "string":
			case "boolean":
			case "number": return this.#d(e, t, n);
			case "object": return this.#f(e, t, n, r);
			case "array": return this.#p(e, t, n);
		}
		return {
			type: i,
			name: e,
			optional: o,
			typeRef: n?.typeRef,
			value: t,
			description: a
		};
	}
	#d(e, t, n) {
		let r = n?.type || typeof t, i = n?.description ?? "";
		return {
			type: r,
			name: e,
			optional: n?.optional ?? !0,
			typeRef: n?.typeRef,
			value: t,
			description: i,
			isCorrectType: !n || this.#b(n, String(t))
		};
	}
	#f(e, t, n, r) {
		let i = n?.description ?? "";
		if (typeof t != "object" || !t) throw Error("The value is not an object");
		let a = n?.typeRef;
		if (!a) throw Error("Every object parameters should have a type ref");
		let o = a === I ? r : this.typesByName.get(a);
		if (!o) throw Error("No nested type for keys were found");
		let s = [];
		for (let e of Object.keys(t)) {
			let n = o.find((t) => t.name === e);
			s.push(this.#u(e, t[e], n));
		}
		return {
			type: "object",
			name: e,
			optional: n.optional,
			typeRef: n.typeRef,
			value: s,
			description: i,
			isCorrectType: !0
		};
	}
	#p(e, t, n) {
		let r = n?.description ?? "", i = n?.optional ?? !0, a = n?.typeRef;
		if (!a) throw Error("Every array parameters should have a type ref");
		if (!Array.isArray(t)) throw Error("The value is not an array");
		let o = B(a) ? void 0 : {
			optional: !0,
			type: "object",
			value: [],
			typeRef: a,
			description: "",
			name: ""
		}, s = [];
		for (let e = 0; e < t.length; e++) {
			let n = this.#u(`${e}`, t[e], o);
			s.push(n);
		}
		return {
			type: "array",
			name: e,
			optional: i,
			typeRef: n?.typeRef,
			value: s,
			description: r,
			isCorrectType: !0
		};
	}
	#m(e) {
		let t = e.composedPath()[0], n = this.#h(t);
		if (!n?.description) return null;
		let [r, i] = fe(n.description), a = n.type, o = n.replyArgs, s;
		return s = o && o.length > 0 ? O`${i}Returns: ${o}<br>` : a ? O`${i}<br>Type: ${a}<br>` : i, {
			box: t.boxInWindow(),
			show: async (e) => {
				let t = new ae({
					getMessage: () => O`<span>${r}</span>`,
					getPossibleFixMessage: () => s,
					getLearnMoreLink: () => `https://chromedevtools.github.io/devtools-protocol/tot/${this.command.split(".")[0]}/`
				});
				return e.contentElement.appendChild(t), !0;
			}
		};
	}
	#h(e) {
		if (e.matches(".command")) {
			let e = this.metadataByCommand.get(this.command);
			if (e) return {
				description: e.description,
				replyArgs: e.replyArgs
			};
		}
		if (e.matches(".parameter")) {
			let t = e.dataset.paramid;
			if (!t) return;
			let n = t.split("."), { parameter: r } = this.#y(n);
			return r.description ? {
				description: r.description,
				type: r.type
			} : void 0;
		}
	}
	getCommandJson() {
		return this.command === "" ? "" : JSON.stringify({
			command: this.command,
			parameters: this.getParameters()
		});
	}
	#g() {
		let e = this.getCommandJson();
		_.copyText(e);
	}
	#_() {
		this.dispatchEventToListeners("submiteditor", {
			command: this.command,
			parameters: this.getParameters(),
			targetId: this.targetId
		});
	}
	populateParametersForCommandWithDefaultValues() {
		let e = this.metadataByCommand.get(this.command)?.parameters;
		e && (this.parameters = e.map((e) => this.#v(e)));
	}
	#v(e) {
		if (e.type === "object") {
			let t = e.typeRef;
			t ||= I;
			let n = (this.typesByName.get(t) ?? []).map((e) => this.#v(e));
			return {
				...e,
				value: e.optional ? void 0 : n,
				isCorrectType: !0
			};
		}
		return e.type === "array" ? {
			...e,
			value: e?.optional ? void 0 : e.value?.map((e) => this.#v(e)) || [],
			isCorrectType: !0
		} : {
			...e,
			value: e.optional ? void 0 : F.get(e.type),
			isCorrectType: !0
		};
	}
	#y(e) {
		let t = this.parameters, n;
		for (let r = 0; r < e.length; r++) {
			let i = e[r], a = t.find((e) => e.name === i);
			if (r === e.length - 1) return {
				parameter: a,
				parentParameter: n
			};
			if (a?.type === "array" || a?.type === "object") a.value && (t = a.value);
			else throw Error("Parameter on the path in not an object or an array");
			n = a;
		}
		throw Error("Not found");
	}
	#b(e, t) {
		if (e.type === "number" && isNaN(Number(t))) return !1;
		let n = this.#M(e);
		return !(n.length !== 0 && !n.includes(t));
	}
	#x = (e) => {
		if (!(e.target instanceof D)) return;
		let t;
		if (e instanceof KeyboardEvent) {
			let n = e.target.renderRoot.querySelector("devtools-editable-content");
			if (!n) return;
			t = n.innerText;
		} else t = e.target.value;
		let n = e.target.getAttribute("data-paramid");
		if (!n) return;
		let r = n.split("."), i = this.#y(r).parameter;
		t === "" ? i.value = F.get(i.type) : (i.value = t, i.isCorrectType = this.#b(i, t)), this.requestUpdate();
	};
	#S = (e) => {
		if (!(e.target instanceof D)) return;
		let t = e.target.value, n = e.target.getAttribute("data-paramid");
		if (!n) return;
		let r = n.split("."), { parameter: i } = this.#y(r);
		i.name = t, this.requestUpdate();
	};
	#C = (e) => {
		e.target instanceof D && e.key === "Enter" && (e.ctrlKey || e.metaKey) && this.#x(e);
	};
	#w(e) {
		if (!(e.target instanceof D)) return;
		let t = e.target.getAttribute("data-paramid");
		if (!t) return;
		let n = t.split("."), r = this.#y(n).parameter;
		r.isCorrectType = !0, this.requestUpdate();
	}
	#T = async (e) => {
		e.target instanceof D && (this.command = e.target.value), this.populateParametersForCommandWithDefaultValues();
		let t = e.target;
		await this.updateComplete, this.#E(t);
	};
	#E(e) {
		let t = this.contentElement.querySelectorAll("devtools-suggestion-input,.add-button"), n = [...t].findIndex((t) => t === e.shadowRoot?.host);
		n >= 0 && n + 1 < t.length ? t[n + 1].focus() : this.contentElement.querySelector("devtools-button[jslogcontext=\"protocol-monitor.send-command\"]")?.focus();
	}
	#D(e, t) {
		if (e.type === "object") {
			let n = e.typeRef;
			n ||= I;
			let r = (this.typesByName.get(n) ?? []).map((e) => this.#D(e, e.name));
			return {
				type: "object",
				name: t,
				optional: e.optional,
				typeRef: n,
				value: r,
				isCorrectType: !0,
				description: e.description
			};
		}
		return {
			type: e.type,
			name: t,
			optional: e.optional,
			isCorrectType: !0,
			typeRef: e.typeRef,
			value: e.optional ? void 0 : F.get(e.type),
			description: e.description
		};
	}
	#O(e) {
		let t = e.split("."), { parameter: n, parentParameter: r } = this.#y(t);
		if (n) {
			switch (n.type) {
				case "array": {
					let e = n.typeRef;
					if (!e) throw Error("Every array parameter must have a typeRef");
					let t = this.typesByName.get(e) ?? [], r = t.map((e) => this.#D(e, e.name)), i = B(e) ? e : "object";
					t.length === 0 && this.enumsByName.get(e) && (i = "string"), n.value ||= [], n.value.push({
						type: i,
						name: String(n.value.length),
						optional: !0,
						typeRef: e,
						value: r.length === 0 ? "" : r,
						description: "",
						isCorrectType: !0
					});
					break;
				}
				case "object": {
					let e = n.typeRef;
					if (e ||= I, n.value ||= [], !this.typesByName.get(e)) {
						n.value.push({
							type: "string",
							name: "",
							optional: !0,
							value: "",
							isCorrectType: !0,
							description: "",
							isKeyEditable: !0
						});
						break;
					}
					let t = this.typesByName.get(e) ?? [], i = t.map((e) => this.#D(e, e.name)), a = t.map((e) => this.#v(e));
					r ? n.value.push({
						type: "object",
						name: "",
						optional: !0,
						typeRef: e,
						value: i,
						isCorrectType: !0,
						description: ""
					}) : n.value = a;
					break;
				}
				default: n.value = F.get(n.type);
			}
			this.requestUpdate();
		}
	}
	#k(e, t) {
		if (e?.value !== void 0) {
			switch (e.type) {
				case "object":
					if (e.optional && !t) {
						e.value = void 0;
						break;
					}
					!e.typeRef || !this.typesByName.get(e.typeRef) ? e.value = [] : e.value.forEach((e) => this.#k(e, t));
					break;
				case "array":
					e.value = e.optional ? void 0 : [];
					break;
				default: e.value = e.optional ? void 0 : F.get(e.type), e.isCorrectType = !0;
			}
			this.requestUpdate();
		}
	}
	#A(e, t) {
		if (e && Array.isArray(t.value)) {
			if (t.value.splice(t.value.findIndex((t) => t === e), 1), t.type === "array") for (let e = 0; e < t.value.length; e++) t.value[e].name = String(e);
			this.requestUpdate();
		}
	}
	#j(e) {
		e.target instanceof HTMLSelectElement && (this.targetId = e.target.value), this.requestUpdate();
	}
	#M(e) {
		if (e.type === "string") {
			let t = this.enumsByName.get(`${e.typeRef}`) ?? {};
			return Object.values(t);
		}
		return e.type === "boolean" ? ["true", "false"] : [];
	}
	performUpdate() {
		let e = {
			onParameterValueBlur: (e) => {
				this.#x(e);
			},
			onParameterKeydown: (e) => {
				this.#C(e);
			},
			onParameterFocus: (e) => {
				this.#w(e);
			},
			onParameterKeyBlur: (e) => {
				this.#S(e);
			},
			onKeydown: (e) => {
				e.key === "Enter" && (e.ctrlKey || e.metaKey) && (this.#C(e), this.#_());
			},
			parameters: this.parameters,
			metadataByCommand: this.metadataByCommand,
			command: this.command,
			typesByName: this.typesByName,
			onCommandInputBlur: (e) => this.#T(e),
			onCommandSend: () => this.#_(),
			onCopyToClipboard: () => this.#g(),
			targets: this.targets,
			targetId: this.targetId,
			onAddParameter: (e) => {
				this.#O(e);
			},
			onClearParameter: (e, t) => {
				this.#k(e, t);
			},
			onDeleteParameter: (e, t) => {
				this.#A(e, t);
			},
			onTargetSelected: (e) => {
				this.#j(e);
			},
			computeDropdownValues: (e) => this.#M(e),
			displayTargetSelector: this.displayTargetSelector,
			displayCommandInput: this.displayCommandInput,
			displayToolbar: this.displayToolbar
		};
		this.#c(e, {}, this.contentElement);
	}
};
function B(e) {
	return e === "string" || e === "boolean" || e === "number";
}
function me(e) {
	return O`
  <div class="row attribute padded">
    <div>target<span class="separator">:</span></div>
    <select class="target-selector"
            title=${N(M.selectTarget)}
            jslog=${b("target-selector").track({ change: !0 })}
            @change=${e.onTargetSelected}>
      ${e.targets.map((t) => O`
        <option jslog=${l("target").track({
		click: !0,
		resize: !0
	})}
                value=${t.id()} ?selected=${t.id() === e.targetId}>
          ${t.name()} (${t.inspectedURL()})
        </option>`)}
    </select>
  </div>
`;
}
function V(e) {
	return O`
          <devtools-button
            title=${e.title}
            .size=${v.SMALL}
            .iconName=${e.iconName}
            .variant=${i.ICON}
            class=${j(e.classMap)}
            @click=${e.onClick}
            .jslogContext=${e.jslogContext}
          ></devtools-button>
      `;
}
function he() {
	return O`<devtools-icon name='warning-filled' class='warning-icon small'>
  </devtools-icon>`;
}
function H(e, t, n, r, i) {
	return t.sort((e, t) => Number(e.optional) - Number(t.optional)), O`
    <ul>
      ${ue(t, (t) => {
		let a = r ? `${i}.${t.name}` : t.name, o = t.type === "array" || t.type === "object" ? t.value ?? [] : [], s = B(t.type), c = t.type === "array", l = r && r.type === "array", u = r && r.type === "object", d = t.type === "object", f = t.value === void 0, p = t.optional, m = d && t.typeRef && e.typesByName.get(t.typeRef) !== void 0, h = t.isKeyEditable, g = d && !m, _ = t.type === "string" || t.type === "boolean", v = c && !f && t.value?.length !== 0 || d && !f, y = {
			"optional-parameter": t.optional,
			parameter: !0,
			"undefined-parameter": t.value === void 0 && t.optional
		};
		return O`
              <li class="row">
                <div class="row-icons">
                    ${t.isCorrectType ? k : O`${he()}`}

                    <!-- If an object parameter has no predefined keys, show an input to enter the key, otherwise show the name of the parameter -->
                    <div class=${j(y)} data-paramId=${a}>
                        ${h ? O`<devtools-suggestion-input
                            data-paramId=${a}
                            .isKey=${!0}
                            .isCorrectInput=${A(t.isCorrectType)}
                            .options=${_ ? e.computeDropdownValues(t) : []}
                            .autocomplete=${!1}
                            .value=${A(t.name ?? "")}
                            .placeholder=${t.value === "" ? L : `<${F.get(t.type)}>`}
                            @blur=${e.onParameterKeyBlur}
                            @focus=${e.onParameterFocus}
                            @keydown=${e.onParameterKeydown}
                          ></devtools-suggestion-input>` : O`${t.name}`} <span class="separator">:</span>
                    </div>

                    <!-- Render button to add values inside an array parameter -->
                    ${c ? O`
                      ${V({
			title: N(M.addParameter),
			iconName: "plus",
			onClick: () => e.onAddParameter(a),
			classMap: { "add-button": !0 },
			jslogContext: "protocol-monitor.add-parameter"
		})}
                    ` : k}

                    <!-- Render button to complete reset an array parameter or an object parameter-->
                    ${v ? V({
			title: N(M.resetDefaultValue),
			iconName: "clear",
			onClick: () => e.onClearParameter(t, l),
			classMap: { "clear-button": !0 },
			jslogContext: "protocol-monitor.reset-to-default-value"
		}) : k}

                    <!-- Render the buttons to change the value from undefined to empty string for optional primitive parameters -->
                    ${s && !l && p && f ? O`  ${V({
			title: N(M.addParameter),
			iconName: "plus",
			onClick: () => e.onAddParameter(a),
			classMap: { "add-button": !0 },
			jslogContext: "protocol-monitor.add-parameter"
		})}` : k}

                    <!-- Render the buttons to change the value from undefined to populate the values inside object with their default values -->
                    ${d && p && f && m ? O`  ${V({
			title: N(M.addParameter),
			iconName: "plus",
			onClick: () => e.onAddParameter(a),
			classMap: { "add-button": !0 },
			jslogContext: "protocol-monitor.add-parameter"
		})}` : k}
                </div>

                <div class="row-icons">
                    <!-- If an object has no predefined keys, show an input to enter the value, and a delete icon to delete the whole key/value pair -->
                    ${h && u ? O`
                    <!-- @ts-ignore -->
                    <devtools-suggestion-input
                        data-paramId=${a}
                        .isCorrectInput=${A(t.isCorrectType)}
                        .options=${_ ? e.computeDropdownValues(t) : []}
                        .autocomplete=${!1}
                        .value=${A(t.value ?? "")}
                        .placeholder=${t.value === "" ? L : `<${F.get(t.type)}>`}
                        .jslogContext=${"parameter-value"}
                        @blur=${e.onParameterValueBlur}
                        @focus=${e.onParameterFocus}
                        @keydown=${e.onParameterKeydown}
                      ></devtools-suggestion-input>

                      ${V({
			title: N(M.deleteParameter),
			iconName: "bin",
			onClick: () => e.onDeleteParameter(t, r),
			classMap: {
				deleteButton: !0,
				deleteIcon: !0
			},
			jslogContext: "protocol-monitor.delete-parameter"
		})}` : k}

                  <!-- In case  the parameter is not optional or its value is not undefined render the input -->
                  ${s && !h && (!f || !p) && !l ? O`
                      <!-- @ts-ignore -->
                      <devtools-suggestion-input
                        data-paramId=${a}
                        .strikethrough=${A(t.isCorrectType)}
                        .options=${_ ? e.computeDropdownValues(t) : []}
                        .autocomplete=${!1}
                        .value=${A(t.value ?? "")}
                        .placeholder=${t.value === "" ? L : `<${F.get(t.type)}>`}
                        .jslogContext=${"parameter-value"}
                        @blur=${e.onParameterValueBlur}
                        @focus=${e.onParameterFocus}
                        @keydown=${e.onParameterKeydown}
                      ></devtools-suggestion-input>` : k}

                  <!-- Render the buttons to change the value from empty string to undefined for optional primitive parameters -->
                  ${s && !h && !l && p && !f ? O`  ${V({
			title: N(M.resetDefaultValue),
			iconName: "clear",
			onClick: () => e.onClearParameter(t),
			classMap: { "clear-button": !0 },
			jslogContext: "protocol-monitor.reset-to-default-value"
		})}` : k}

                  <!-- If the parameter is an object with no predefined keys, renders a button to add key/value pairs to it's value -->
                  ${g ? O`
                    ${V({
			title: N(M.addCustomProperty),
			iconName: "plus",
			onClick: () => e.onAddParameter(a),
			classMap: { "add-button": !0 },
			jslogContext: "protocol-monitor.add-custom-property"
		})}
                  ` : k}

                  <!-- In case the parameter is nested inside an array we render the input field as well as a delete button -->
                  ${l ? O`
                  <!-- If the parameter is an object we don't want to display the input field we just want the delete button-->
                  ${d ? k : O`
                  <!-- @ts-ignore -->
                  <devtools-suggestion-input
                    data-paramId=${a}
                    .options=${_ ? e.computeDropdownValues(t) : []}
                    .autocomplete=${!1}
                    .value=${A(t.value ?? "")}
                    .placeholder=${t.value === "" ? L : `<${F.get(t.type)}>`}
                    .jslogContext=${"parameter"}
                    @blur=${e.onParameterValueBlur}
                    @keydown=${e.onParameterKeydown}
                    class=${j({ "json-input": !0 })}
                  ></devtools-suggestion-input>`}

                  ${V({
			title: N(M.deleteParameter),
			iconName: "bin",
			onClick: () => e.onDeleteParameter(t, r),
			classMap: { "delete-button": !0 },
			jslogContext: "protocol-monitor.delete-parameter"
		})}` : k}
                </div>
              </li>
              ${H(e, o, n, t, a)}
            `;
	})}
    </ul>
  `;
}
var U = (e, t, n) => {
	ce(O`
    <div class="wrapper" @keydown=${e.onKeydown} jslog=${te("command-editor").track({ resize: !0 })}>
      <div class="editor-wrapper">
        ${e.displayTargetSelector === !1 ? k : me(e)}
        ${e.displayCommandInput === !1 ? k : O`
        <div class="row attribute padded">
          <div class="command">command<span class="separator">:</span></div>
          <devtools-suggestion-input
            .options=${[...e.metadataByCommand.keys()]}
            .value=${e.command}
            .placeholder=${"Enter your command…"}
            .suggestionFilter=${R}
            .jslogContext=${"command"}
            @blur=${e.onCommandInputBlur}
            class=${j({ "json-input": !0 })}
          ></devtools-suggestion-input>
        </div>`}
        ${e.parameters.length ? O`
        <div class="row attribute padded">
          <div>parameters<span class="separator">:</span></div>
        </div>
          ${H(e, e.parameters)}
        ` : k}
      </div>
      ${e.displayToolbar === !1 ? k : O`
      <devtools-toolbar class="protocol-monitor-sidebar-toolbar">
        <devtools-button title=${N(M.copyCommand)}
                        .iconName=${"copy"}
                        .jslogContext=${"protocol-monitor.copy-command"}
                        .variant=${i.TOOLBAR}
                        @click=${e.onCopyToClipboard}></devtools-button>
          <div class=toolbar-spacer></div>
        <devtools-button title=${f() ? N(M.sendCommandCmdEnter) : N(M.sendCommandCtrlEnter)}
                        .iconName=${"send"}
                        jslogContext="protocol-monitor.send-command"
                        .variant=${i.PRIMARY_TOOLBAR}
                        @click=${e.onCommandSend}></devtools-button>
      </devtools-toolbar>
      `}
    </div>`, n);
}, ge = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n@scope to (devtools-widget > *) {\n  .protocol-monitor-toolbar {\n    border-bottom: 1px solid var(--sys-color-divider);\n  }\n\n  .protocol-monitor-bottom-toolbar {\n    border-top: 1px solid var(--sys-color-divider);\n  }\n\n  .target-selector {\n    max-width: 120px;\n  }\n\n  .protocol-monitor-main {\n    /* allows the main area to grow automatically */\n    flex-grow: 1;\n  }\n}\n", _e = /* @__PURE__ */ e({
	CommandAutocompleteSuggestionProvider: () => Z,
	DEFAULT_VIEW: () => X,
	InfoWidget: () => Q,
	ProtocolMonitorImpl: () => Se,
	buildProtocolMetadata: () => J,
	parseCommandInput: () => $
}), { styleMap: W } = g, { widget: G, widgetRef: ve } = ee, K = {
	method: "Method",
	type: "Type",
	request: "Request",
	response: "Response",
	timestamp: "Timestamp",
	elapsedTime: "Elapsed time",
	target: "Target",
	record: "Record",
	clearAll: "Clear all",
	filter: "Filter",
	documentation: "Documentation",
	editAndResend: "Edit and resend",
	sMs: "{PH1} ms",
	noMessageSelected: "No message selected",
	selectAMessageToView: "Select a message to see its details",
	save: "Save",
	session: "Session",
	sendRawCDPCommand: "Send a raw `CDP` command",
	sendRawCDPCommandExplanation: "Format: `'Domain.commandName'` for a command without parameters, or `'{\"command\":\"Domain.commandName\", \"parameters\": {...}}'` as a JSON object for a command with parameters. `'cmd'`/`'method'` and `'args'`/`'params'`/`'arguments'` are also supported as alternative keys for the `JSON` object.",
	selectTarget: "Select a target",
	showCDPCommandEditor: "Show CDP command editor",
	hideCDPCommandEditor: "Hide  CDP command editor"
}, ye = r("panels/protocol_monitor/ProtocolMonitor.ts", K), q = n.bind(void 0, ye), J = (e) => {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) for (let e of Object.keys(n.metadata)) t.set(e, n.metadata[e]);
	return t;
}, Y = J(T.agentPrototypes.values()), be = T.typeMap, xe = T.enumMap, X = (e, t, n) => {
	o(p`
        <style>${s}</style>
        <style>${ge}</style>
        <devtools-split-view name="protocol-monitor-split-container"
                             direction="column"
                             sidebar-initial-size="400"
                             sidebar-visibility=${e.sidebarVisible ? "visible" : "hidden"}
                             @change=${(t) => e.onSplitChange(t.detail === "OnlyMain")}>
          <div slot="main" class="vbox protocol-monitor-main">
            <devtools-toolbar class="protocol-monitor-toolbar"
                               jslog=${C("top")}>
               <devtools-button title=${q(K.record)}
                                .iconName=${"record-start"}
                                .toggledIconName=${"record-stop"}
                                .jslogContext=${"protocol-monitor.toggle-recording"}
                                .variant=${i.ICON_TOGGLE}
                                .toggleType=${m.RED}
                                .toggled=${!0}
                                @click=${(t) => e.onRecord(t.target.toggled)}>
               </devtools-button>
              <devtools-button title=${q(K.clearAll)}
                               .iconName=${"clear"}
                               .variant=${i.TOOLBAR}
                               .jslogContext=${"protocol-monitor.clear-all"}
                               @click=${() => e.onClear()}></devtools-button>
              <devtools-button title=${q(K.save)}
                               .iconName=${"download"}
                               .variant=${i.TOOLBAR}
                               .jslogContext=${"protocol-monitor.save"}
                               @click=${() => e.onSave()}></devtools-button>
              <devtools-toolbar-input type="filter"
                                      list="filter-suggestions"
                                      style="flex-grow: 1"
                                      value=${e.filter}
                                      @change=${(t) => e.onFilterChanged(t.detail)}>
                <datalist id="filter-suggestions">
                  ${e.filterKeys.map((e) => p`
                        <option value=${e + ":"}></option>
                        <option value=${"-" + e + ":"}></option>`)}
                </datalist>
              </devtools-toolbar-input>
            </devtools-toolbar>
            <devtools-split-view direction="column" sidebar-position="second"
                                 name="protocol-monitor-panel-split" sidebar-initial-size="250">
              <devtools-data-grid
                  striped
                  slot="main"
                  .filters=${e.parseFilter(e.filter)}>
                <table>
                    <tr>
                      <th id="type" sortable style="text-align: center" hideable weight="1">
                        ${q(K.type)}
                      </th>
                      <th id="method" weight="5">
                        ${q(K.method)}
                      </th>
                      <th id="request" hideable weight="5">
                        ${q(K.request)}
                      </th>
                      <th id="response" hideable weight="5">
                        ${q(K.response)}
                      </th>
                      <th id="elapsed-time" sortable hideable weight="2">
                        ${q(K.elapsedTime)}
                      </th>
                      <th id="timestamp" sortable hideable weight="5">
                        ${q(K.timestamp)}
                      </th>
                      <th id="target" sortable hideable weight="5">
                        ${q(K.target)}
                      </th>
                      <th id="session" sortable hideable weight="5">
                        ${q(K.session)}
                      </th>
                    </tr>
                    ${e.messages.map((t) => p`
                      <tr @select=${() => e.onSelect(t)}
                          @contextmenu=${(n) => e.onContextMenu(t, n.detail)}
                          style="--override-data-grid-row-background-color: var(--sys-color-surface3)">
                        ${"id" in t ? p`
                          <td title="sent">
                            <devtools-icon name="arrow-up-down" class="medium" style="color: var(--icon-request-response);">
                            </devtools-icon>
                          </td>` : p`
                          <td title="received">
                            <devtools-icon name="arrow-down" class="medium" style="color: var(--icon-request);">
                            </devtools-icon>
                          </td>`}
                        <td>${t.method}</td>
                        <td>${t.params ? p`<code>${JSON.stringify(t.params)}</code>` : ""}</td>
                        <td>
                          ${t.result ? p`<code>${JSON.stringify(t.result)}</code>` : t.error ? p`<code>${JSON.stringify(t.error)}</code>` : "id" in t ? "(pending)" : ""}
                        </td>
                        <td data-value=${t.elapsedTime || 0}>
                          ${"id" in t ? t.elapsedTime ? q(K.sMs, { PH1: String(t.elapsedTime) }) : "(pending)" : ""}
                        </td>
                        <td data-value=${t.requestTime}>${q(K.sMs, { PH1: String(t.requestTime) })}</td>
                        <td>${we(t.target)}</td>
                        <td>${t.sessionId || ""}</td>
                      </tr>`)}
                  </table>
              </devtools-data-grid>
              <devtools-widget ${G(Q, {
		request: e.selectedMessage?.params,
		response: e.selectedMessage?.result || e.selectedMessage?.error,
		type: e.selectedMessage ? "id" in e?.selectedMessage ? "sent" : "received" : void 0
	})}
                  class="protocol-monitor-info"
                  slot="sidebar"></devtools-widget>
            </devtools-split-view>
            <devtools-toolbar class="protocol-monitor-bottom-toolbar"
               jslog=${C("bottom")}>
              <devtools-button .title=${e.sidebarVisible ? q(K.hideCDPCommandEditor) : q(K.showCDPCommandEditor)}
                               .iconName=${e.sidebarVisible ? "left-panel-close" : "left-panel-open"}
                               .variant=${i.TOOLBAR}
                               .jslogContext=${"protocol-monitor.toggle-command-editor"}
                               @click=${() => e.onToggleSidebar()}></devtools-button>
              </devtools-button>
              <devtools-toolbar-input id="command-input"
                                      style=${W({
		"flex-grow": 1,
		display: e.sidebarVisible ? "none" : "flex"
	})}
                                      value=${e.command}
                                      list="command-input-suggestions"
                                      placeholder=${q(K.sendRawCDPCommand)}
                                      title=${q(K.sendRawCDPCommandExplanation)}
                                      @change=${(t) => e.onCommandChange(t.detail)}
                                      @submit=${(t) => e.onCommandSubmitted(t.detail)}>
                <datalist id="command-input-suggestions">
                  ${e.commandSuggestions.map((e) => p`<option value=${e}></option>`)}
                </datalist>
              </devtools-toolbar-input>
              <select class="target-selector"
                      title=${q(K.selectTarget)}
                      style=${W({ display: e.sidebarVisible ? "none" : "flex" })}
                      jslog=${b("target-selector").track({ change: !0 })}
                      @change=${(t) => e.onTargetChange(t.target.value)}>
                ${e.targets.map((t) => p`
                  <option jslog=${l("target").track({ click: !0 })}
                          value=${t.id()} ?selected=${t.id() === e.selectedTargetId}>
                    ${t.name()} (${t.inspectedURL()})
                  </option>`)}
              </select>
            </devtools-toolbar>
          </div>
          <devtools-widget slot="sidebar"
              ${G(z, {
		metadataByCommand: Y,
		typesByName: be,
		enumsByName: xe
	})}
              @submiteditor=${(t) => e.onEditorSubmit(t.detail.command, t.detail.parameters, t.detail.targetId)}
              ${ve(z, (e) => {
		t.editorWidget = e;
	})}>
          </devtools-widget>
        </devtools-split-view>`, n);
}, Se = class extends h {
	started;
	startTime;
	messageForId = /* @__PURE__ */ new Map();
	filterParser;
	#e = [
		"method",
		"request",
		"response",
		"target",
		"session"
	];
	#t = new Z();
	#n;
	#r = "";
	#i = !1;
	#a;
	#o = [];
	#s;
	#c = "";
	#l;
	#u = /* @__PURE__ */ new Map();
	constructor(e = X) {
		super("protocol-monitor", !0), this.#a = e, this.started = !1, this.startTime = 0, this.#e = [
			"method",
			"request",
			"response",
			"type",
			"target",
			"session"
		], this.filterParser = new re(this.#e), this.#n = "main", this.performUpdate(), x.instance().addEventListener(S.AVAILABLE_TARGETS_CHANGED, () => {
			this.requestUpdate();
		}), x.instance().observeTargets(this);
	}
	targetAdded(e) {
		this.#u.set(e.sessionId, e);
	}
	targetRemoved(e) {
		this.#u.delete(e.sessionId);
	}
	#d() {
		let e = this.#l.getCommandJson(), t = this.#l.targetId;
		t && (this.#n = t), e && (this.#r = e, this.requestUpdate());
	}
	performUpdate() {
		let e = {
			messages: this.#o,
			selectedMessage: this.#s,
			sidebarVisible: this.#i,
			command: this.#r,
			commandSuggestions: this.#t.allSuggestions(),
			filterKeys: this.#e,
			filter: this.#c,
			parseFilter: this.filterParser.parse.bind(this.filterParser),
			onSplitChange: (e) => {
				if (e) this.#d(), this.#i = !1;
				else {
					let { command: e, parameters: t } = $(this.#r);
					this.#l.displayCommand(e, t, this.#n), this.#i = !0;
				}
				this.requestUpdate();
			},
			onRecord: (e) => {
				this.setRecording(e);
			},
			onClear: () => {
				this.#o = [], this.messageForId.clear(), this.requestUpdate();
			},
			onSave: () => {
				this.saveAsFile();
			},
			onSelect: (e) => {
				this.#s = e, this.requestUpdate();
			},
			onContextMenu: this.#f.bind(this),
			onCommandChange: (e) => {
				this.#r = e;
			},
			onCommandSubmitted: (e) => {
				this.#t.addEntry(e);
				let { command: t, parameters: n } = $(e);
				this.onCommandSend(t, n, this.#n);
			},
			onFilterChanged: (e) => {
				this.#c = e, this.requestUpdate();
			},
			onTargetChange: (e) => {
				this.#n = e;
			},
			onToggleSidebar: () => {
				this.#i = !this.#i, this.requestUpdate();
			},
			onEditorSubmit: (e, t, n) => {
				this.onCommandSend(e, t, n);
			},
			targets: x.instance().targets(),
			selectedTargetId: this.#n
		}, t = this;
		this.#a(e, { set editorWidget(e) {
			t.#l = e;
		} }, this.contentElement);
	}
	#f(e, t) {
		t.editSection().appendItem(q(K.editAndResend), () => {
			if (!this.#s) return;
			let t = this.#s.params, n = this.#s.target?.id() || "", r = e.method;
			this.#r = JSON.stringify({
				command: r,
				parameters: t
			}), this.#i ? this.#l.displayCommand(r, t, n) : (this.#i = !0, this.requestUpdate());
		}, {
			jslogContext: "edit-and-resend",
			disabled: !("id" in e)
		}), t.editSection().appendItem(q(K.filter), () => {
			this.#c = `method:${e.method}`, this.requestUpdate();
		}, { jslogContext: "filter" }), t.footerSection().appendItem(q(K.documentation), () => {
			let [t, n] = e.method.split("."), r = "id" in e ? "method" : "event";
			a(`https://chromedevtools.github.io/devtools-protocol/tot/${t}#${r}-${n}`);
		}, { jslogContext: "documentation" });
	}
	onCommandSend(e, t, n) {
		let r = w, i = x.instance(), a = n ? i.targetById(n) : null, o = a ? a.sessionId : "";
		r.sendRawMessage(e, t, () => {}, o);
	}
	wasShown() {
		super.wasShown(), !this.started && (this.started = !0, this.startTime = Date.now(), this.setRecording(!0));
	}
	setRecording(e) {
		let t = w;
		e ? (t.onMessageSent = this.messageSent.bind(this), t.onMessageReceived = this.messageReceived.bind(this)) : (t.onMessageSent = null, t.onMessageReceived = null);
	}
	messageReceived(e) {
		if ("id" in e && e.id) {
			let t = this.messageForId.get(e.id);
			if (!t) return;
			t.result = e.result, t.error = e.error, t.elapsedTime = Date.now() - this.startTime - t.requestTime, this.messageForId.delete(e.id), this.requestUpdate();
			return;
		}
		let t = e.sessionId === void 0 ? void 0 : this.#u.get(e.sessionId);
		this.#o.push({
			method: e.method,
			sessionId: e.sessionId,
			target: t,
			requestTime: Date.now() - this.startTime,
			result: e.params
		}), this.requestUpdate();
	}
	messageSent(e) {
		let t = e.sessionId === void 0 ? void 0 : this.#u.get(e.sessionId), n = {
			method: e.method,
			params: e.params,
			id: e.id,
			sessionId: e.sessionId,
			target: t,
			requestTime: Date.now() - this.startTime
		};
		this.#o.push(n), this.requestUpdate(), this.messageForId.set(e.id, n);
	}
	async saveAsFile() {
		let e = "ProtocolMonitor-" + u(/* @__PURE__ */ new Date()) + ".json", t = new ie();
		if (!await t.open(e)) return;
		let n = this.#o.map((e) => ({
			...e,
			target: e.target?.id()
		}));
		t.write(JSON.stringify(n, null, "  ")), t.close();
	}
}, Z = class {
	#e = 200;
	#t = /* @__PURE__ */ new Set();
	constructor(e) {
		e !== void 0 && (this.#e = e);
	}
	allSuggestions() {
		let e = [...this.#t].reverse();
		return e.push(...Y.keys()), e;
	}
	buildTextPromptCompletions = async (e, t, n) => !t && !n && e ? [] : this.allSuggestions().filter((e) => e.startsWith(t)).map((e) => ({ text: e }));
	addEntry(e) {
		if (this.#t.has(e) && this.#t.delete(e), this.#t.add(e), this.#t.size > this.#e) {
			let e = this.#t.values().next().value;
			this.#t.delete(e);
		}
	}
}, Ce = (e, t, n) => {
	o(p`
    <devtools-tabbed-pane>${e.type === void 0 ? p`
      <devtools-widget
          id="request" title=${q(K.request)}
          ?selected=${e.selectedTab === "request"} disabled
          ${G(c, {
		header: q(K.noMessageSelected),
		text: q(K.selectAMessageToView)
	})}>
      </devtools-widget>
      <devtools-widget
          id="response" title=${q(K.response)}
          ?selected=${e.selectedTab === "response"}
          ${G(c, {
		header: q(K.noMessageSelected),
		text: q(K.selectAMessageToView)
	})}>
      </devtools-widget>` : p`
      <devtools-widget
          id="request" title=${q(K.request)}
          ?selected=${e.selectedTab === "request"} ?disabled=${e.type !== "sent"}
          ${G(E, { jsonObject: e.request })}>
      </devtools-widget>
      <devtools-widget
          id="response" title=${q(K.response)}
          ?selected=${e.selectedTab === "response"}
          ${G(E, { jsonObject: e.response })}>
      </devtools-widget>`}
    </devtools-tabbed-pane>`, n);
}, Q = class extends y {
	#e;
	request;
	response;
	type;
	constructor(e, t = Ce) {
		super(e), this.#e = t, this.requestUpdate();
	}
	performUpdate() {
		this.#e({
			request: this.request,
			response: this.response,
			type: this.type,
			selectedTab: this.type === "sent" ? void 0 : "response"
		}, void 0, this.contentElement);
	}
};
function $(e) {
	let t = null;
	try {
		t = JSON.parse(e);
	} catch {}
	return {
		command: t ? t.command || t.method || t.cmd || "" : e,
		parameters: t?.parameters || t?.params || t?.args || t?.arguments || {}
	};
}
function we(e) {
	return e ? e.decorateLabel(`${e.name()} ${e === x.instance().rootTarget() ? "" : e.id()}`) : "";
}
//#endregion
export { P as i, z as n, se as r, _e as t };
