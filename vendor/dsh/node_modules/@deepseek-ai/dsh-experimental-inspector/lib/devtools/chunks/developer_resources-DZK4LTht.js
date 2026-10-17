import { n as e } from "./rolldown-runtime-DF993M8W.js";
import { H as t, K as n, N as r } from "./common-DMSVbaSb.js";
import { Dl as i, Fo as a, Hl as o, Ja as s, Po as c, Qt as l, Tp as u, U as d, Vl as f, Yf as p, Zo as m, ei as h, ii as g, jr as _, ll as v, mo as y } from "./legacy-dM_vujv7.js";
import "./platform-D4TUCh2P.js";
import { c as b } from "./StringUtilities-CMDxNrEc.js";
import "./data_grid-C6uthMeA.js";
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/developer_resources/developerResourcesListView.css.mjs
var x = "/*\n * Copyright 2020 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n@scope to (devtools-widget > *) {\n  .data-grid {\n    border: none;\n  }\n\n  ::part(url-outer) {\n    width: 100%;\n    display: inline-flex;\n    justify-content: flex-start;\n  }\n\n  ::part(filter-highlight) {\n    font-weight: bold;\n  }\n\n  ::part(url-prefix) {\n    overflow-x: hidden;\n    text-overflow: ellipsis;\n  }\n\n  ::part(url-suffix) {\n    flex: none;\n  }\n}\n", S = {
	status: "Status",
	url: "URL",
	initiator: "Initiator",
	totalBytes: "Total Bytes",
	duration: "Duration",
	error: "Error",
	developerResources: "Developer resources",
	copyUrl: "Copy URL",
	copyInitiatorUrl: "Copy initiator URL",
	pending: "pending",
	success: "success",
	failure: "failure",
	sBytes: "{n, plural, =1 {# byte} other {# bytes}}",
	numberOfResourceMatch: "{n, plural, =1 {# resource matches} other {# resources match}}",
	noResourceMatches: "No resource matches"
}, C = n("panels/developer_resources/DeveloperResourcesListView.ts", S), w = t.bind(void 0, C), { withThousandsSeparator: T } = u, E = (e, t, n) => {
	function i(t, n) {
		if (!t) return "";
		let r = e.filters.find((e) => e.key?.split(",")?.includes(n));
		if (!r?.regex) return "";
		let i = r.regex.exec(t);
		return i?.length ? `${i.index},${i[0].length}` : "";
	}
	a(c`
      <style>${x}</style>
      <devtools-data-grid name=${w(S.developerResources)} striped class="flex-auto"
         .filters=${e.filters} @contextmenu=${e.onContextMenu} @selected=${e.onSelect}>
        <table>
          <tr>
            <th id="status" sortable fixed width="60px">
              ${w(S.status)}
            </th>
            <th id="url" sortable width="250px">
              ${w(S.url)}
            </th>
            <th id="initiator" sortable width="80px">
              ${w(S.initiator)}
            </th>
            <th id="size" sortable fixed width="80px" align="right">
              ${w(S.totalBytes)}
            </th>
            <th id="duration" sortable fixed width="80px" align="right">
              ${w(S.duration)}
            </th>
            <th id="error-message" sortable width="200px">
              ${w(S.error)}
            </th>
          </tr>
          ${e.items.map((t, n) => {
		let a = /^(.*)(\/[^/]*)$/.exec(t.url);
		return c`
            <tr selected=${t === e.selectedItem || m}
                data-url=${t.url ?? m}
                data-initiator-url=${t.initiator.initiatorUrl ?? m}
                data-index=${n}>
              <td>${t.success === !0 ? w(S.success) : t.success === !1 ? w(S.failure) : w(S.pending)}</td>
              <td title=${t.url} aria-label=${t.url}>
                <devtools-highlight aria-hidden="true" part="url-outer"
                                    ranges=${i(t.url, "url")}>
                  <div part="url-prefix">${a ? a[1] : t.url}</div>
                  <div part="url-suffix">${a ? a[2] : ""}</div>
                </devtools-highlight>
              </td>
              <td title=${t.initiator.initiatorUrl || ""}
                  aria-label=${t.initiator.initiatorUrl || ""}
                  @mouseenter=${() => e.onInitiatorMouseEnter(t.initiator.frameId)}
                  @mouseleave=${e.onInitiatorMouseLeave}
              >${t.initiator.initiatorUrl || ""}</td>
              <td aria-label=${t.size === null ? m : w(S.sBytes, { n: t.size })}
                  data-value=${t.size ?? m}>${t.size === null ? "" : c`<span>${T(t.size)}</span>`}</td>
              <td aria-label=${t.duration === null ? m : r(t.duration)}
                  data-value=${t.duration ?? m}>${t.duration === null ? "" : c`<span>${r(t.duration)}</span>`}</td>
              <td class="error-message">
                ${t.errorMessage ? c`
                <devtools-highlight ranges=${i(t.errorMessage, "error-message")}>
                  ${t.errorMessage}
                </devtools-highlight>` : m}
              </td>
            </tr>`;
	})}
          </table>
        </devtools-data-grid>`, n);
}, D = class extends h {
	#e = [];
	#t = null;
	#n = null;
	#r;
	#i = [];
	constructor(e, t = E) {
		super(e, { useShadowDom: !0 }), this.#r = t;
	}
	set selectedItem(e) {
		this.#t = e, this.requestUpdate();
	}
	set onSelect(e) {
		this.#n = e;
	}
	#a(e, t) {
		let n = t.dataset.url;
		n && e.clipboardSection().appendItem(w(S.copyUrl), () => {
			p.copyText(n);
		}, { jslogContext: "copy-url" });
		let r = t.dataset.initiatorUrl;
		r && e.clipboardSection().appendItem(w(S.copyInitiatorUrl), () => {
			p.copyText(r);
		}, { jslogContext: "copy-initiator-url" });
	}
	set items(e) {
		this.#e = [...e], this.requestUpdate();
	}
	reset() {
		this.items = [], this.requestUpdate();
	}
	set filters(e) {
		this.#i = e, this.requestUpdate(), this.updateComplete.then(() => {
			let e = Number(this.contentElement.querySelector("devtools-data-grid")?.getAttribute("aria-rowcount")) ?? 0, t = "";
			t = e === 0 ? w(S.noResourceMatches) : w(S.numberOfResourceMatch, { n: e }), d.alert(t);
		});
	}
	performUpdate() {
		let e = {
			items: this.#e,
			selectedItem: this.#t,
			filters: this.#i,
			onContextMenu: (e) => {
				e.detail?.element && this.#a(e.detail.menu, e.detail.element);
			},
			onSelect: (e) => {
				this.#t = e.detail ? this.#e[Number(e.detail.dataset.index)] : null, this.#n?.(this.#t);
			},
			onInitiatorMouseEnter: (e) => {
				let t = e ? i.instance().getFrame(e) : null;
				t && t.highlight();
			},
			onInitiatorMouseLeave: () => {
				v.hideDOMNodeHighlight();
			}
		};
		this.#r(e, {}, this.contentElement);
	}
}, O = "/*\n * Copyright 2020 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n@scope to (devtools-widget > *) {\n  :scope {\n    overflow: hidden;\n  }\n\n  .developer-resource-view-toolbar-container {\n    display: flex;\n    border-bottom: 1px solid var(--sys-color-divider);\n    flex: 0 0 auto;\n  }\n\n  .developer-resource-view-toolbar {\n    width: 100%;\n  }\n\n  .developer-resource-view-toolbar-summary {\n    background-color: var(--sys-color-cdt-base-container);\n    border-top: 1px solid var(--sys-color-divider);\n    padding-left: 5px;\n    flex: 0 0 19px;\n    display: flex;\n    padding-right: 5px;\n  }\n\n  .developer-resource-view-toolbar-summary .developer-resource-view-message {\n    padding-top: 2px;\n    padding-left: 1ex;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n    overflow: hidden;\n  }\n\n  .developer-resource-view-results {\n    overflow-y: auto;\n    display: flex;\n    flex: auto;\n  }\n}\n", k = /* @__PURE__ */ e({
	DEFAULT_VIEW: () => I,
	DeveloperResourcesRevealer: () => F,
	DeveloperResourcesView: () => L
}), { widget: A } = g, { bindToSetting: j } = l, M = {
	filterByText: "Filter by URL and error",
	loadHttpsDeveloperResources: "Load `HTTP(S)` developer resources through the website you inspect, not through DevTools",
	enableLoadingThroughTarget: "Load through website",
	resourcesCurrentlyLoading: "{PH1} resources, {PH2} currently loading",
	resources: "{n, plural, =1 {# resource} other {# resources}}"
}, N = n("panels/developer_resources/DeveloperResourcesView.ts", M), P = t.bind(void 0, N), F = class {
	async reveal(e) {
		let t = o.instance().getResourcesLoaded().get(e.key);
		if (t) return await _.instance().showView("developer-resources"), await (await _.instance().view("developer-resources").widget()).select(t);
	}
}, I = (e, t, n) => {
	a(c`
    <style>
      ${O}
    </style>
    <div class="vbox flex-auto" jslog=${s("developer-resources").track({ resize: !0 })}>
      <div class="developer-resource-view-toolbar-container" jslog=${y()}
          role="toolbar">
        <devtools-toolbar class="developer-resource-view-toolbar" role="presentation">
          <devtools-toolbar-input type="filter" placeholder=${P(M.filterByText)}
              @change=${e.onFilterChanged} style="flex-grow:1">
          </devtools-toolbar-input>
          <devtools-checkbox
              title=${P(M.loadHttpsDeveloperResources)}
              ${j(e.loadThroughTargetSetting)}>
            ${P(M.enableLoadingThroughTarget)}
          </devtools-checkbox>
        </devtools-toolbar>
      </div>
      <div class="developer-resource-view-results">
        ${A(D, {
		items: e.items,
		selectedItem: e.selectedItem,
		onSelect: e.onSelect,
		filters: e.filters
	})}
      </div>
      <div class="developer-resource-view-toolbar-summary">
        <div class="developer-resource-view-message">
          ${e.numLoading > 0 ? P(M.resourcesCurrentlyLoading, {
		PH1: e.numResources,
		PH2: e.numLoading
	}) : P(M.resources, { n: e.numResources })}
         </div>
      </div>
    </div>`, n);
}, L = class extends h {
	#e;
	#t;
	#n = null;
	#r = [];
	constructor(e = I) {
		super({ useShadowDom: !0 }), this.#t = e, this.#e = o.instance(), this.#e.addEventListener(f.UPDATE, this.requestUpdate, this), this.requestUpdate();
	}
	async performUpdate() {
		let { loading: e, resources: t } = this.#e.getScopedNumberOfResources(), n = {
			onFilterChanged: (e) => {
				this.onFilterChanged(e.detail);
			},
			items: this.#e.getResourcesLoaded().values(),
			selectedItem: this.#n,
			onSelect: (e) => {
				this.#n = e;
			},
			filters: this.#r,
			numResources: t,
			numLoading: e,
			loadThroughTargetSetting: this.#e.getLoadThroughTargetSetting()
		};
		this.#t(n, {}, this.contentElement);
	}
	async select(e) {
		await this.updateComplete, this.#n = e, this.requestUpdate();
	}
	async selectedItem() {
		return await this.updateComplete, this.#n;
	}
	onFilterChanged(e) {
		let t = e ? b(e, "i") : null;
		this.#r = t ? [{
			key: "url,error-message",
			regex: t,
			negative: !1
		}] : [], this.requestUpdate();
	}
};
//#endregion
export { k as DeveloperResourcesView };
