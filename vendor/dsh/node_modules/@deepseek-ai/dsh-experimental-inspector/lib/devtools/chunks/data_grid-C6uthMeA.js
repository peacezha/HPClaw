import { n as e } from "./rolldown-runtime-DF993M8W.js";
import { $ as t, H as n, K as r, Q as i, Zt as a, en as o, i as s } from "./common-DMSVbaSb.js";
import { Af as c, Bo as l, D as u, Dp as d, Dt as f, K as p, Kt as m, Mn as ee, O as te, Pn as ne, Ro as re, Tt as h, U as g, Ur as _, Ut as ie, Va as ae, Zo as oe, bn as v, br as se, co as y, ei as b, lo as x, mt as ce, so as le, ui as S, vn as ue, wn as C, wo as de, zo as fe } from "./legacy-dM_vujv7.js";
import "./platform-D4TUCh2P.js";
import { P as w, k as T } from "./StringUtilities-CMDxNrEc.js";
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/legacy/components/data_grid/dataGrid.css.mjs
var E = "/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.data-grid {\n  position: relative;\n  border: 1px solid var(--sys-color-divider) !important; /* stylelint-disable-line declaration-no-important */\n  /* See: crbug.com/1152736 for color variable migration. */\n  line-height: 120%;\n\n  :focus-visible {\n    outline: 2px solid var(--sys-color-state-focus-ring);\n    outline-offset: -2px;\n  }\n}\n\n.data-grid table {\n  table-layout: fixed;\n  border-spacing: 0;\n  border-collapse: separate;\n  height: 100%;\n  width: 100%;\n}\n\n.data-grid .data-container {\n  position: absolute;\n  inset: 0;\n  overflow: hidden auto;\n  transform: translateZ(0);\n  background-color: var(--sys-color-cdt-base-container);\n}\n\n.data-grid thead {\n  position: sticky;\n  top: 0;\n  height: 21px;\n  z-index: 1;\n}\n\n.data-grid .aria-live-label {\n  width: 1px;\n  height: 1px;\n  overflow: hidden;\n}\n\n.data-grid.inline .data-container {\n  position: static;\n}\n\n.data-grid .corner {\n  width: 14px;\n  padding-right: 0;\n  padding-left: 0;\n  border-left: 0 none transparent !important; /* stylelint-disable-line declaration-no-important */\n}\n\n.data-grid.inline .corner {\n  display: none;\n}\n\n.data-grid.data-grid-fits-viewport .corner {\n  display: none;\n}\n\n.data-grid .top-filler-td,\n.data-grid .bottom-filler-td {\n  height: auto !important; /* stylelint-disable-line declaration-no-important */\n  padding: 0 !important; /* stylelint-disable-line declaration-no-important */\n}\n\n.data-grid table.data {\n  position: absolute;\n  inset: 0;\n  border-top: 0 none transparent;\n  table-layout: fixed;\n}\n\n.data-grid.inline table.data {\n  position: static;\n}\n\n.data-grid tbody tr {\n  display: none;\n  height: 20px;\n\n  &:has(td.show-more) {\n    height: var(--sys-size-13);\n  }\n}\n\n.data-grid tbody tr.revealed {\n  display: table-row;\n}\n\n.striped-data-grid .revealed.data-grid-data-grid-node:nth-child(odd):not(.dirty, .selected),\n.striped-data-grid-starts-with-odd .revealed.data-grid-data-grid-node:nth-child(even):not(.dirty, .selected) {\n  background-color: var(--sys-color-surface1);\n}\n\n.data-grid td,\n.data-grid th {\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  line-height: 18px;\n  height: 18px;\n  border-left: 1px solid var(--sys-color-divider);\n  padding: 1px 4px;\n}\n\n.data-grid td {\n  vertical-align: top;\n  user-select: text;\n}\n\n.data-grid tr {\n  background-color: var(--sys-color-surface);\n\n  &:has(th) {\n    background-color: var(--sys-color-surface1);\n  }\n}\n\n.data-grid th {\n  border-bottom: 1px solid var(--sys-color-divider);\n  text-align: left;\n  font-weight: normal;\n  vertical-align: middle;\n}\n\n.data-grid th:first-child,\n.data-grid td:first-child {\n  border-left-width: 0;\n}\n\n.data-grid:focus-within tr.selected td,\n.data-grid:focus-within tr.selected th {\n  border-left-color: var(--sys-color-divider-on-tonal-container);\n}\n\n.data-grid td > div,\n.data-grid th > div {\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  min-width: 8px;\n}\n\n.data-grid td.editing > div {\n  text-overflow: clip;\n}\n\n.data-grid .center {\n  text-align: center;\n}\n\n.data-grid .right {\n  text-align: right;\n}\n\n.data-grid th.sortable {\n  position: relative;\n}\n\n.data-grid th .sort-order-icon-container {\n  min-width: 0;\n  position: absolute;\n  top: 1px;\n  right: 0;\n  bottom: 1px;\n  display: flex;\n  align-items: center;\n}\n\n.data-grid th .sort-order-icon {\n  margin-right: 4px;\n  margin-bottom: -2px;\n  width: 14px;\n  height: 14px;\n  display: none;\n  background-color: var(--icon-default);\n}\n\n.data-grid th.sort-ascending .sort-order-icon {\n  display: inline-block;\n  mask-image: var(--image-file-triangle-up);\n}\n\n.data-grid th.sort-descending .sort-order-icon {\n  display: inline-block;\n  mask-image: var(--image-file-triangle-down);\n}\n\n.data-grid th.sort-ascending,\n.data-grid th.sort-descending {\n  padding-right: 14px;\n}\n\n.data-grid th.sortable:hover,\n.data-grid th.sortable:focus-within {\n  background-color: var(--sys-color-state-hover-on-subtle);\n}\n\n.data-grid .top-filler-td {\n  border-bottom: 0 none transparent;\n  line-height: 0;\n}\n\n.data-grid button {\n  line-height: 18px;\n  color: inherit;\n}\n\n.data-grid td.disclosure::before {\n  user-select: none;\n  mask-image: var(--image-file-triangle-right);\n  float: left;\n  width: 14px;\n  height: 14px;\n  margin-right: 2px;\n  content: \"\";\n  position: relative;\n  top: 3px;\n  background-color: var(--icon-default);\n  transition: transform 200ms;\n}\n\n.data-grid tr:not(.parent) td.disclosure::before {\n  background-color: transparent;\n}\n\n.data-grid tr.expanded td.disclosure::before {\n  transform: rotate(90deg);\n}\n\n.data-grid tbody tr.revealed.selected {\n  background-color: var(--sys-color-neutral-container);\n  color: inherit;\n\n  & ::selection {\n    background-color: var(--sys-color-state-focus-select);\n    color: currentcolor;\n  }\n}\n\n.data-grid:focus-within tbody tr.revealed.selected {\n  background-color: var(--sys-color-tonal-container);\n}\n\n.data-grid tbody tr.revealed:not(.data-grid-filler-row, .selected):hover {\n  background-color: var(--sys-color-state-hover-on-subtle);\n}\n\n.data-grid tbody tr.revealed.selected.dirty {\n  color: var(--sys-color-on-tonal-container);\n}\n\n.data-grid.no-selection:focus-visible {\n  outline: 2px solid var(--sys-color-state-focus-ring);\n  outline-offset: -2px;\n}\n\n.data-grid:focus tbody tr.selected {\n  background-color: var(--sys-color-tonal-container);\n  color: var(--sys-color-on-tonal-container);\n}\n\n.data-grid tbody tr.selected.dirty {\n  --override-data-grid-dirty-background-color: var(--sys-color-error);\n\n  background-color: var(--override-data-grid-dirty-background-color);\n}\n\n.data-grid:focus tr.selected.dirty {\n  --override-data-grid-dirty-background-color: var(--sys-color-error-container);\n}\n\n.data-grid:focus tr.selected .devtools-link {\n  color: var(--sys-color-on-tonal-container);\n}\n\n.data-grid:focus tr.parent.selected td.disclosure::before {\n  background-color: var(--sys-color-on-tonal-container);\n}\n\n.data-grid tr.inactive {\n  color: var(--sys-color-state-disabled);\n  font-style: italic;\n}\n\n.data-grid tr.dirty {\n  --override-data-grid-dirty-background-color: var(--sys-color-surface-error);\n\n  background-color: var(--override-data-grid-dirty-background-color);\n  color: var(--sys-color-error);\n  font-style: normal;\n}\n\n.data-grid tr.highlighted:not(.selected) {\n  background-color: var(--sys-color-surface-yellow);\n}\n\n.striped-data-grid .revealed.data-grid-data-grid-node.highlighted:nth-child(odd):not(.dirty, .selected),\n.striped-data-grid-starts-with-odd .revealed.data-grid-data-grid-node.highlighted:nth-child(even):not(.dirty, .selected) {\n  background-color: var(--sys-color-surface-yellow-high);\n}\n\n.data-grid td.show-more {\n  white-space: normal;\n  gap: var(--sys-size-3);\n\n  devtools-button {\n    margin-right: var(--sys-size-6);\n    position: relative;\n    margin-top: 3px;\n    margin-bottom: 3px;\n  }\n}\n\n.data-grid td.show-more::before {\n  display: none;\n}\n\n.data-grid-resizer {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  width: 5px;\n  z-index: 500;\n}\n\n@media (forced-colors: active) {\n  .sort-order-icon-container .sort-order-icon {\n    forced-color-adjust: none;\n    background-color: ButtonText;\n  }\n\n  .data-grid td.disclosure::before {\n    forced-color-adjust: none;\n    color: ButtonText;\n  }\n\n  .data-grid.no-selection:focus-visible * {\n    color: ButtonText;\n  }\n\n  .data-grid tbody tr.revealed:not(.data-grid-filler-row, .selected):hover,\n  .data-grid:focus-within tbody tr.revealed.selected {\n    background-color: Highlight;\n  }\n\n  .data-grid th.sortable:hover *,\n  .data-grid tr.parent.selected td.disclosure::before,\n  .data-grid:focus tr.parent.selected td.disclosure::before,\n  .data-grid tbody tr.parent.revealed:hover td.disclosure::before {\n    color: HighlightText;\n  }\n\n  .data-grid th.sortable:hover .sort-order-icon-container .sort-order-icon {\n    background-color: HighlightText;\n  }\n\n  .striped-data-grid .revealed.data-grid-data-grid-node:nth-child(odd):not(.dirty, .selected),\n  .striped-data-grid-starts-with-odd .revealed.data-grid-data-grid-node:nth-child(even):not(.dirty, .selected),\n  .request-cookies-view tr.revealed.data-grid-data-grid-node.flagged-cookie-attribute-row:not(.selected):nth-child(2n),\n  .cookies-table tr.revealed.data-grid-data-grid-node.flagged-cookie-attribute-row:not(.selected):nth-child(odd) {\n    background-color: canvas;\n  }\n\n  .data-grid.no-selection:focus-visible {\n    forced-color-adjust: none;\n    border-color: Highlight;\n  }\n\n  .data-grid th.sortable:hover,\n  .data-grid tbody tr.revealed:hover,\n  .data-grid tbody tr.revealed.selected,\n  .striped-data-grid .revealed:hover.data-grid-data-grid-node:nth-child(odd):not(.dirty, .selected),\n  .striped-data-grid-starts-with-odd .revealed:hover.data-grid-data-grid-node:nth-child(even):not(.dirty, .selected),\n  .request-cookies-view tr.revealed:hover.data-grid-data-grid-node.flagged-cookie-attribute-row:not(.selected):nth-child(2n),\n  .cookies-table tr.revealed:hover.data-grid-data-grid-node.flagged-cookie-attribute-row:not(.selected):nth-child(odd) {\n    forced-color-adjust: none;\n    background-color: Highlight;\n  }\n\n  .data-grid tbody tr.revealed:hover *,\n  .data-grid tbody tr.revealed.selected *,\n  .data-grid tbody tr.revealed:focus *,\n  .data-grid tbody tr.revealed:hover .heap-object-tag {\n    color: HighlightText;\n  }\n\n  .data-grid th {\n    background-color: canvas;\n    border-color: Highlight;\n  }\n}\n", pe = /* @__PURE__ */ e({
	Align: () => R,
	CenterResizerOverBorderAdjustment: () => 3,
	ColumnResizePadding: () => 30,
	CornerWidth: () => 14,
	CreationDataGridNode: () => H,
	DataGridImpl: () => F,
	DataGridNode: () => V,
	DataGridWidget: () => U,
	DataType: () => z,
	Events: () => I,
	Order: () => L,
	ResizeMethod: () => B
}), D = {
	expanded: "expanded",
	collapsed: "collapsed",
	sRowS: "{PH1} Row {PH2}",
	rowsS: "Rows: {PH1}",
	sSUseTheUpAndDownArrowKeysTo: "{PH1} {PH2}, use the up and down arrow keys to navigate and interact with the rows of the table; Use browse mode to read cell by cell.",
	sortByString: "Sort by",
	resetColumns: "Reset columns",
	headerOptions: "Header options",
	refresh: "Refresh",
	addNew: "Add new",
	editS: "Edit \"{PH1}\"",
	delete: "Delete",
	levelS: "level {PH1}",
	checked: "checked",
	emptyRowCreated: "An empty table row has been created. You may double click or use context menu to edit.",
	enterToSort: "Column sort state: {PH1}. Press enter to apply sorting filter",
	sortableColumn: "Sortable column. Press enter to apply sorting filter"
}, O = r("ui/legacy/components/data_grid/DataGrid.ts", D), k = n.bind(void 0, O), A = /* @__PURE__ */ new WeakMap(), j = /* @__PURE__ */ new WeakMap(), M = /* @__PURE__ */ new WeakMap(), N = /* @__PURE__ */ new WeakMap(), P = /* @__PURE__ */ new WeakMap(), F = class e extends i {
	element;
	displayName;
	editCallback;
	deleteCallback;
	refreshCallback;
	dataTableHeaders;
	scrollContainerInternal;
	#e;
	dataTable;
	inline;
	columnsArray;
	columns;
	visibleColumnsArray;
	cellClass;
	#t;
	headerRow;
	dataTableColumnGroup;
	dataTableBody;
	topFillerRow;
	bottomFillerRow;
	editing;
	selectedNode;
	expandNodesWhenArrowing;
	indentWidth;
	resizers;
	columnWidthsInitialized;
	cornerWidth;
	resizeMethod;
	headerContextMenuCallback;
	rowContextMenuCallback;
	elementToDataGridNode;
	disclosureColumnId;
	sortColumnCell;
	#n;
	editingNode;
	columnWeightsSetting;
	creationNode;
	currentResizer;
	dataGridWidget;
	constructor(e) {
		super();
		let { displayName: t, columns: n, deleteCallback: r, refreshCallback: i } = e;
		this.element = document.createElement("div"), this.element.classList.add("data-grid"), this.element.tabIndex = 0, this.element.addEventListener("keydown", this.keyDown.bind(this), !1), this.element.addEventListener("contextmenu", this.contextMenu.bind(this), !0), this.element.addEventListener("focusin", (e) => {
			this.updateGridAccessibleNameOnFocus(), e.consume(!0);
		}), this.element.addEventListener("focusout", (e) => {
			e.consume(!0);
		}), p(this.element), this.displayName = t, this.deleteCallback = r, this.refreshCallback = i, this.dataTableHeaders = {}, this.#e = this.element.createChild("div", "data-container"), this.dataTable = this.#e.createChild("table", "data"), this.scrollContainerInternal = this.#e, this.dataTable.addEventListener("dblclick", this.ondblclick.bind(this), !1), this.dataTable.addEventListener("mousedown", this.mouseDownInDataTable.bind(this)), this.dataTable.addEventListener("click", this.clickInDataTable.bind(this), !0), this.inline = !1, this.columnsArray = [], this.columns = {}, this.visibleColumnsArray = n, n.forEach((e) => this.#r(e)), this.cellClass = null, this.dataTableColumnGroup = this.dataTable.createChild("colgroup"), this.#t = this.dataTable.createChild("thead"), this.headerRow = this.#t.createChild("tr"), this.dataTableBody = this.dataTable.createChild("tbody"), this.topFillerRow = this.dataTableBody.createChild("tr", "data-grid-filler-row revealed"), h(this.topFillerRow, !0), this.bottomFillerRow = this.dataTableBody.createChild("tr", "data-grid-filler-row revealed"), h(this.bottomFillerRow, !0), this.setVerticalPadding(0, 0, !0), this.refreshHeader(), this.editing = !1, this.selectedNode = null, this.expandNodesWhenArrowing = !0, this.setRootNode(new V()), this.setHasSelection(!1), this.indentWidth = 15, this.resizers = [], this.columnWidthsInitialized = !1, this.cornerWidth = 14, this.resizeMethod = "nearest", this.headerContextMenuCallback = null, this.rowContextMenuCallback = null, this.elementToDataGridNode = /* @__PURE__ */ new WeakMap();
	}
	setEditCallback(e, t) {
		this.editCallback = e;
	}
	firstSelectableNode() {
		let e = this.#n;
		for (; e && !e.selectable;) e = e.traverseNextNode(!0) || void 0;
		return e;
	}
	lastSelectableNode() {
		let e = this.#n, t = this.#n;
		for (; t;) t.selectable && (e = t), t = t.traverseNextNode(!0) || void 0;
		return e;
	}
	setElementContent(t, n) {
		let r = this.columnIdFromNode(t);
		if (!r) return;
		let i = this.columns[r], a = t.parentElement, o;
		a && (o = this.elementToDataGridNode.get(a)), i.dataType === "Boolean" ? e.setElementBoolean(t, !!n, o) : n !== null && e.setElementText(t, n, !!i.longText, o);
	}
	static setElementText(t, n, r, i) {
		r && n.length > 1e3 ? (t.textContent = w(n, 1e3), _.install(t, n), A.set(t, n)) : (t.textContent = n, _.install(t, ""), A.delete(t)), i && e.updateNodeAccessibleText(i);
	}
	static setElementBoolean(t, n, r) {
		t.textContent = n ? "✓" : "", _.install(t, ""), r && e.updateNodeAccessibleText(r);
	}
	static updateNodeAccessibleText(e) {
		let t = "", n = e.elementInternal?.children[0] || null;
		if (n) {
			for (; n && !n.classList.contains("corner");) {
				let r = null;
				for (let e of n.classList) if (e.includes("-column")) {
					r = e.substring(0, e.indexOf("-column"));
					break;
				}
				if (r && e.dataGrid) {
					let i = e.dataGrid.columns[r];
					i && (t += `${i.title}: ${n.textContent}, `);
				}
				n = n.nextElementSibling;
			}
			t.length > 0 && (t = t.substring(0, t.length - 2)), e.nodeAccessibleText = t;
		}
	}
	setStriped(e) {
		this.element.classList.toggle("striped-data-grid", e);
	}
	setFocusable(e) {
		this.element.tabIndex = e ? 0 : -1, e === !1 && ce(this.element);
	}
	setHasSelection(e) {
		this.element.classList.toggle("no-selection", !e);
	}
	announceSelectedGridNode() {
		if (this.element === S(this.element.ownerDocument) && this.selectedNode?.existingElement()) {
			let e;
			this.selectedNode.hasChildren() && (e = this.selectedNode.expanded ? k(D.expanded) : k(D.collapsed));
			let t = e ? `${this.selectedNode.nodeAccessibleText}, ${e}` : this.selectedNode.nodeAccessibleText;
			g.alert(t);
		}
	}
	getNumberOfRows() {
		return this.#n ? this.enumerateChildren(this.#n, [], 1).length : 0;
	}
	updateGridAccessibleNameOnFocus() {
		let e;
		if (this.selectedNode?.existingElement()) {
			let t = "";
			this.selectedNode.hasChildren() && (t = this.selectedNode.expanded ? k(D.expanded) : k(D.collapsed)), e = `${k(D.sRowS, {
				PH1: this.displayName,
				PH2: t
			})} ${this.selectedNode.nodeAccessibleText}`;
		} else {
			if (!this.#n) return;
			let t = this.getNumberOfRows(), n = k(D.rowsS, { PH1: t });
			e = k(D.sSUseTheUpAndDownArrowKeysTo, {
				PH1: this.displayName,
				PH2: n
			});
		}
		g.alert(e);
	}
	#r(e, t) {
		e.defaultWeight = e.weight;
		let n = e.id;
		n in this.columns && this.#i(n), t === void 0 && (t = this.columnsArray.length), this.columnsArray.splice(t, 0, e), this.columns[n] = e, e.disclosure && (this.disclosureColumnId = n);
		let r = document.createElement("th");
		r.setAttribute("jslog", `${y().track({
			click: e.sortable,
			resize: !0
		}).context(T(n))}`), r.className = n + "-column", r.setAttribute("tabindex", "0"), r.setAttribute("role", "columnheader"), j.set(r, n), this.dataTableHeaders[n] = r;
		let i = document.createElement("div");
		if (e.titleDOMFragment ? i.appendChild(e.titleDOMFragment) : i.textContent = e.title || null, r.appendChild(i), e.sort && (r.classList.add(e.sort), this.sortColumnCell = r), e.sortable) {
			r.addEventListener("click", this.clickInHeaderCell.bind(this), !1), r.addEventListener("keydown", this.keydownHeaderCell.bind(this), !1), r.classList.add("sortable");
			let t = document.createElement("span");
			if (t.className = "sort-order-icon", r.createChild("div", "sort-order-icon-container").appendChild(t), e.title) {
				let t = `${e.title} - ${k(D.sortableColumn)}`;
				f(r, t);
			}
		}
	}
	addColumn(e, t) {
		this.#r(e, t);
	}
	#i(e) {
		if (!this.columns[e]) return;
		delete this.columns[e];
		let t = this.columnsArray.findIndex((t) => t.id === e);
		this.columnsArray.splice(t, 1);
		let n = this.dataTableHeaders[e];
		n.parentElement && n.parentElement.removeChild(n), delete this.dataTableHeaders[e];
	}
	removeColumn(e) {
		this.#i(e);
	}
	setCellClass(e) {
		this.cellClass = e;
	}
	refreshHeader() {
		this.dataTableColumnGroup.removeChildren(), this.headerRow.removeChildren(), this.topFillerRow.removeChildren(), this.bottomFillerRow.removeChildren();
		for (let e = 0; e < this.visibleColumnsArray.length; ++e) {
			let t = this.visibleColumnsArray[e], n = t.id, r = this.dataTableColumnGroup.createChild("col");
			t.width && (r.style.width = t.width), this.headerRow.appendChild(this.dataTableHeaders[n]);
			let i = this.topFillerRow.createChild("th", "top-filler-td");
			i.textContent = t.title || null, i.scope = "col";
			let a = this.bottomFillerRow.createChild("td", "bottom-filler-td");
			j.set(a, n);
		}
		let e = this.headerRow.createChild("th", "corner");
		h(e, !0);
		let t = this.topFillerRow.createChild("th", "corner");
		t.classList.add("top-filler-td"), t.scope = "col", this.bottomFillerRow.createChild("td", "corner").classList.add("bottom-filler-td"), this.dataTableColumnGroup.createChild("col", "corner");
	}
	setVerticalPadding(e, t, n = !1) {
		let r = e + "px", i = e || t ? t + "px" : "auto";
		(this.topFillerRow.style.height !== r || this.bottomFillerRow.style.height !== i) && (this.topFillerRow.style.height = r, this.bottomFillerRow.style.height = i, n || this.dispatchEventToListeners("PaddingChanged"));
	}
	setRootNode(e) {
		this.#n && (this.#n.removeChildren(), this.#n.dataGrid = null, this.#n.isRoot = !1), this.#n = e, e.isRoot = !0, e.setHasChildren(!1), e.expandedInternal = !0, e.revealedInternal = !0, e.selectable = !1, e.dataGrid = this;
	}
	rootNode() {
		let e = this.#n;
		return e || (e = new V(), this.setRootNode(e)), e;
	}
	isColumnEditable(e) {
		let t = this.columns[e];
		return !!(t && t.editable && this.editCallback);
	}
	ondblclick(e) {
		if (!this.editCallback || this.editing || this.editingNode) return;
		let t = this.columnIdFromNode(e.target);
		t && this.isColumnEditable(t) && this.startEditing(e.target);
	}
	startEditingColumnOfDataGridNode(e, t) {
		this.editing = !0, this.editingNode = e, this.editingNode.select();
		let n = this.editingNode.element();
		if (!n) return;
		let r = n.children[t], i = A.get(r);
		i && (r.textContent = i);
		let a = this.visibleColumnsArray[t];
		if (a.dataType === "Boolean") {
			let t = ie.create(void 0, e.data[a.id]);
			f(t, a.title || "");
			let n = !1;
			t.style.height = "100%", t.classList.add("inside-datagrid");
			let i = t.checked;
			t.addEventListener("change", () => {
				n = !0, this.editingCommitted(r, t.checked, i, void 0, "forward");
			}, !1), t.addEventListener("keydown", (e) => {
				if (e.key === "Tab") return e.consume(!0), n = !0, this.editingCommitted(r, t.checked, i, void 0, e.shiftKey ? "backward" : "forward");
				e.key === " " ? (e.consume(!0), t.checked = !t.checked) : e.key === "Enter" && (e.consume(!0), n = !0, this.editingCommitted(r, t.checked, i, void 0, "forward"));
			}, !1), t.addEventListener("blur", () => {
				n || this.editingCommitted(r, t.checked, t.checked, void 0, "next");
			}, !1), r.innerHTML = "", r.appendChild(t), t.focus();
		} else {
			te.startEditing(r, this.startEditingConfig(r));
			let e = r.getComponentSelection();
			e && e.selectAllChildren(r);
		}
	}
	startEditingNextEditableColumnOfDataGridNode(e, t, n) {
		let r = this.columns[t], i = this.visibleColumnsArray.indexOf(r), a = this.nextEditableColumn(i, !1, n);
		a !== -1 && this.startEditingColumnOfDataGridNode(e, a);
	}
	startEditing(e) {
		if (!C(e, "td")) return;
		if (this.editingNode = this.dataGridNodeFromNode(e), !this.editingNode) {
			if (!this.creationNode) return;
			this.editingNode = this.creationNode;
		}
		if (this.editingNode instanceof H && this.editingNode.isCreationNode) {
			this.startEditingColumnOfDataGridNode(this.editingNode, this.nextEditableColumn(-1));
			return;
		}
		let t = this.columnIdFromNode(e);
		if (!t) return;
		let n = this.columns[t], r = this.visibleColumnsArray.indexOf(n);
		this.editingNode && this.startEditingColumnOfDataGridNode(this.editingNode, r);
	}
	renderInline() {
		this.element.classList.add("inline"), this.cornerWidth = 0, this.inline = !0, this.updateWidths();
	}
	startEditingConfig(e) {
		return new u(this.editingCommitted.bind(this), this.editingCancelled.bind(this), void 0);
	}
	editingCommitted(e, t, n, r, i) {
		let a = this.columnIdFromNode(e);
		if (!a) {
			this.editingCancelled(e);
			return;
		}
		let o = this.columns[a], s = this.visibleColumnsArray.indexOf(o);
		if (!this.editingNode) return;
		let c = this.editingNode.data[a], l = this.editingNode;
		function u(e) {
			if (i) {
				if (i === "forward") {
					let t = this.nextEditableColumn(-1), n = l instanceof H && l.isCreationNode;
					if (n && s === t && !e) return;
					let r = this.nextEditableColumn(s);
					if (r !== -1) {
						this.startEditingColumnOfDataGridNode(l, r);
						return;
					}
					let i = l.traverseNextNode(!0, null, !0);
					if (i) {
						this.startEditingColumnOfDataGridNode(i, t);
						return;
					}
					if (n && e && this.creationNode) {
						this.addCreationNode(!1), this.startEditingColumnOfDataGridNode(this.creationNode, t);
						return;
					}
					return;
				}
				if (i === "backward") {
					let e = this.nextEditableColumn(s, !0);
					if (e !== -1) {
						this.startEditingColumnOfDataGridNode(l, e);
						return;
					}
					let t = this.nextEditableColumn(this.visibleColumnsArray.length, !0), n = l.traversePreviousNode(!0, !0);
					n && this.startEditingColumnOfDataGridNode(n, t);
					return;
				}
			}
		}
		if (this.setElementContent(e, t), c === t) {
			this.editingCancelled(e), u.call(this, !1);
			return;
		}
		this.editingNode.data[a] = t, this.editCallback && (this.editCallback(this.editingNode, a, c, t, i), this.editingNode instanceof H && this.editingNode.isCreationNode && this.addCreationNode(!1), this.editingCancelled(e), u.call(this, !0));
	}
	editingCancelled(e) {
		this.editing = !1, this.editingNode = null;
	}
	nextEditableColumn(e, t, n) {
		let r = t ? -1 : 1, i = n ? e : e + r, a = this.visibleColumnsArray;
		for (let e = i; e >= 0 && e < a.length; e += r) if (this.isColumnEditable(a[e].id)) return e;
		return -1;
	}
	sortColumnId() {
		return this.sortColumnCell && j.get(this.sortColumnCell) || null;
	}
	sortOrder() {
		return !this.sortColumnCell || this.sortColumnCell.classList.contains("sort-ascending") ? "sort-ascending" : this.sortColumnCell.classList.contains("sort-descending") ? "sort-descending" : null;
	}
	isSortOrderAscending() {
		return !this.sortColumnCell || this.sortColumnCell.classList.contains("sort-ascending");
	}
	autoSizeWidths(e, t, n) {
		t &&= Math.min(t, Math.floor(100 / e.length));
		let r = 0;
		for (let t = 0; t < e.length; ++t) r += e[t];
		let i = 0;
		for (let a = 0; a < e.length; ++a) {
			let o = Math.round(100 * e[a] / r);
			t && o < t ? o = t : n && o > n && (o = n), i += o, e[a] = o;
		}
		let a = i - 100;
		for (; t && a > 0;) for (let n = 0; n < e.length && !(e[n] > t && (--e[n], --a, !a)); ++n);
		for (; n && a < 0;) for (let t = 0; t < e.length && !(e[t] < n && (++e[t], ++a, !a)); ++t);
		return e;
	}
	autoSizeColumns(e, t, n) {
		let r = [];
		for (let e = 0; e < this.columnsArray.length; ++e) r.push((this.columnsArray[e].title || "").length);
		if (n ||= 0, !this.#n) return;
		let i = this.enumerateChildren(this.#n, [], n + 1);
		for (let e = 0; e < i.length; ++e) {
			let t = i[e];
			for (let e = 0; e < this.columnsArray.length; ++e) {
				let n = String(t.data[this.columnsArray[e].id]);
				n.length > r[e] && (r[e] = n.length);
			}
		}
		r = this.autoSizeWidths(r, e, t);
		for (let e = 0; e < this.columnsArray.length; ++e) this.columnsArray[e].weight = r[e];
		this.columnWidthsInitialized = !1, this.updateWidths();
	}
	enumerateChildren(e, t, n) {
		if (e.isRoot || t.push(e), !n) return [];
		for (let r = 0; r < e.children.length; ++r) this.enumerateChildren(e.children[r], t, n - 1);
		return t;
	}
	onResize() {
		this.updateWidths();
	}
	updateWidths() {
		if (!this.columnWidthsInitialized && this.element.offsetWidth) {
			let e = this.element.offsetWidth - this.cornerWidth, t = this.#t.rows[0].cells.length - 1;
			for (let n = 0; n < t; n++) {
				let t = this.visibleColumnsArray[n];
				t.weight ||= 100 * this.getPreferredWidth(n) / e || 10;
			}
			this.columnWidthsInitialized = !0;
		}
		this.applyColumnWeights();
	}
	indexOfVisibleColumn(e) {
		return this.visibleColumnsArray.findIndex((t) => t.id === e);
	}
	setName(e) {
		this.columnWeightsSetting = s.instance().createSetting("data-grid-" + e + "-column-weights", {}), this.loadColumnWeights();
	}
	resetColumnWeights() {
		for (let e of this.columnsArray) e.defaultWeight && (e.weight = e.defaultWeight);
		this.applyColumnWeights(), this.saveColumnWeights();
	}
	loadColumnWeights() {
		if (!this.columnWeightsSetting) return;
		let e = this.columnWeightsSetting.get();
		for (let t = 0; t < this.columnsArray.length; ++t) {
			let n = this.columnsArray[t], r = e[n.id];
			r && (n.weight = r);
		}
		this.applyColumnWeights();
	}
	saveColumnWeights() {
		if (!this.columnWeightsSetting) return;
		let e = {};
		for (let t = 0; t < this.columnsArray.length; ++t) {
			let n = this.columnsArray[t];
			e[n.id] = n.weight;
		}
		this.columnWeightsSetting.set(e);
	}
	wasShown() {
		this.loadColumnWeights();
	}
	willHide() {}
	getPreferredWidth(e) {
		return M.get(this.dataTableColumnGroup.children[e]) || this.#t.rows[0].cells[e].offsetWidth;
	}
	applyColumnWeights() {
		let e = this.element.offsetWidth - this.cornerWidth - 1;
		if (e <= 0) return;
		let t = 0, n = [];
		for (let r = 0; r < this.visibleColumnsArray.length; ++r) if (this.visibleColumnsArray[r].fixedWidth) {
			let t = this.getPreferredWidth(r);
			n[r] = t, e -= t;
		} else t += this.visibleColumnsArray[r].weight || 0;
		let r = 0, i = 0;
		for (let a = 0; a < this.visibleColumnsArray.length; ++a) {
			let o = this.visibleColumnsArray[a], s;
			if (o.fixedWidth) s = n[a];
			else {
				r += o.weight || 0;
				let n = r * e / t | 0;
				s = Math.max(n - i, 30), i = n;
			}
			this.setPreferredWidth(a, s);
		}
		this.positionResizers();
	}
	setColumnsVisibility(e) {
		this.visibleColumnsArray = [];
		for (let t of this.columnsArray) e.has(t.id) && this.visibleColumnsArray.push(t);
		this.refreshHeader(), this.applyColumnWeights();
		let t = this.enumerateChildren(this.rootNode(), [], -1);
		for (let e of t) e.refresh();
	}
	get scrollContainer() {
		return this.scrollContainerInternal;
	}
	positionResizers() {
		let e = this.dataTableColumnGroup.children.length - 1, t = [], n = this.resizers;
		for (; n.length > e - 1;) {
			let e = n.pop();
			e && e.remove();
		}
		for (let n = 0; n < e - 1; n++) t[n] = (t[n - 1] || 0) + this.#t.rows[0].cells[n].offsetWidth;
		for (let r = 0; r < e - 1; r++) {
			let e = n[r];
			e || (e = document.createElement("div"), P.set(e, r), e.classList.add("data-grid-resizer"), ee(e, this.startResizerDragging.bind(this), this.resizerDragging.bind(this), this.endResizerDragging.bind(this), "col-resize"), this.element.appendChild(e), n.push(e)), N.get(e) !== t[r] && (N.set(e, t[r]), e.style.left = t[r] + "px");
		}
	}
	addCreationNode(e) {
		this.creationNode && (this.creationNode.isCreationNode = !1);
		let t = {};
		for (let e in this.columns) t[e] = null;
		this.creationNode = new H(t, e), g.alert(k(D.emptyRowCreated)), this.rootNode().appendChild(this.creationNode);
	}
	keyDown(e) {
		if (!(e instanceof KeyboardEvent) || (this.selectedNode && this.selectedNode.element().tabIndex < 0 && ae(this.selectedNode.element(), e), e.shiftKey || e.metaKey || e.ctrlKey || this.editing || ne())) return;
		let t = !1, n;
		if (!this.selectedNode) e.key === "ArrowUp" && !e.altKey ? n = this.lastSelectableNode() : e.key === "ArrowDown" && !e.altKey && (n = this.firstSelectableNode()), t = !!n;
		else if (e.key === "ArrowUp" && !e.altKey) {
			for (n = this.selectedNode.traversePreviousNode(!0); n && !n.selectable;) n = n.traversePreviousNode(!0);
			t = !!n;
		} else if (e.key === "ArrowDown" && !e.altKey) {
			for (n = this.selectedNode.traverseNextNode(!0); n && !n.selectable;) n = n.traverseNextNode(!0);
			t = !!n;
		} else if (e.key === "ArrowLeft") this.selectedNode.expanded ? (e.altKey ? this.selectedNode.collapseRecursively() : this.selectedNode.collapse(), t = !0) : this.selectedNode.parent && !this.selectedNode.parent.isRoot && (t = !0, this.selectedNode.parent.selectable ? (n = this.selectedNode.parent, t = !!n) : this.selectedNode.parent && this.selectedNode.parent.collapse());
		else if (e.key === "ArrowRight") {
			if (!this.expandNodesWhenArrowing) return;
			this.selectedNode.revealed ? this.selectedNode.hasChildren() && (t = !0, this.selectedNode.expanded ? (n = this.selectedNode.children[0], t = !!n) : e.altKey ? this.selectedNode.expandRecursively() : this.selectedNode.expand()) : (this.selectedNode.reveal(), t = !0);
		} else if (e.keyCode === 8 || e.keyCode === 46) this.deleteCallback && (t = !0, this.deleteCallback(this.selectedNode));
		else if (e.key === "Enter") {
			if (this.editCallback) {
				t = !0;
				let e = this.selectedNode.element();
				if (!e) return;
				this.startEditing(e.children[this.nextEditableColumn(-1)]);
			} else this.dispatchEventToListeners("OpenedNode", this.selectedNode);
		}
		n && (n.reveal(), n.select());
		let r = S(this.element.ownerDocument);
		t && this.element !== r && !this.element.contains(r) && this.element.focus(), t && e.consume(!0);
	}
	updateSelectionBeforeRemoval(e, t) {
		let n = this.selectedNode;
		for (; n && n !== e;) n = n.parent;
		if (!n) return;
		let r;
		for (n = e; n && !n.nextSibling;) n = n.parent;
		for (n && (r = n.nextSibling); r && !r.selectable;) r = r.traverseNextNode(!0);
		if (!r || r.isCreationNode) {
			if (!e) return;
			for (r = e.traversePreviousNode(!0); r && !r.selectable;) r = r.traversePreviousNode(!0);
		}
		r ? (r.reveal(), r.select()) : this.selectedNode && this.selectedNode.deselect();
	}
	dataGridNodeFromNode(e) {
		let t = C(e, "tr");
		return t && this.elementToDataGridNode.get(t) || null;
	}
	columnIdFromNode(e) {
		let t = C(e, "td");
		return t && j.get(t) || null;
	}
	setInert(e) {
		e ? this.element.setAttribute("inert", "inert") : this.element.removeAttribute("inert");
	}
	clickInHeaderCell(e) {
		let t = C(e.target, "th");
		t && this.sortByColumnHeaderCell(t);
	}
	keydownHeaderCell(e) {
		(e.key === "Enter" || e.key === " ") && this.clickInHeaderCell(e);
	}
	sortByColumnHeaderCell(e) {
		if (!j.has(e) || !e.classList.contains("sortable")) return;
		let t = "sort-ascending";
		e === this.sortColumnCell && this.isSortOrderAscending() && (t = "sort-descending"), this.sortColumnCell && (this.sortColumnCell.classList.remove("sort-ascending", "sort-descending"), this.sortColumnCell.removeAttribute("aria-sort")), this.sortColumnCell = e, e.classList.add(t);
		let n = this.isSortOrderAscending() ? "ascending" : "descending";
		e.setAttribute("aria-sort", n), g.alert(k(D.enterToSort, { PH1: n || "" })), this.dispatchEventToListeners("SortingChanged");
	}
	markColumnAsSortedBy(e, t) {
		this.sortColumnCell && this.sortColumnCell.classList.remove("sort-ascending", "sort-descending"), this.sortColumnCell = this.dataTableHeaders[e], this.sortColumnCell.classList.add(t);
	}
	headerTableHeader(e) {
		return this.dataTableHeaders[e];
	}
	mouseDownInDataTable(e) {
		let t = e.target, n = this.dataGridNodeFromNode(t);
		if (!n || !n.selectable || n.isEventWithinDisclosureTriangle(e)) return;
		let r = this.columnIdFromNode(t);
		if (r && this.columns[r].nonSelectable) return;
		let i = e;
		(c() === "mac" ? i.metaKey : i.ctrlKey) ? n.selected ? n.deselect() : n.select() : (n.select(), this.dispatchEventToListeners("OpenedNode", n));
	}
	setHeaderContextMenuCallback(e) {
		this.headerContextMenuCallback = e;
	}
	setRowContextMenuCallback(e) {
		this.rowContextMenuCallback = e;
	}
	contextMenu(e) {
		if (!(e instanceof MouseEvent)) return;
		let t = new se(e), n = e.target, r = this.visibleColumnsArray.filter((e) => e.sortable && e.title), i = this.columnsArray.filter((e) => r.indexOf(e) === -1 && e.allowInSortByEvenWhenHidden), a = [...r, ...i];
		if (a.length > 0) {
			let e = t.defaultSection().appendSubMenuItem(k(D.sortByString), !1, "sort-by");
			for (let t of a) {
				let n = this.dataTableHeaders[t.id];
				e.defaultSection().appendItem(t.title, this.sortByColumnHeaderCell.bind(this, n), { jslogContext: T(t.id) });
			}
		}
		if (n.isSelfOrDescendant(this.#t)) {
			this.headerContextMenuCallback && this.headerContextMenuCallback(t), t.defaultSection().appendItem(k(D.resetColumns), this.resetColumnWeights.bind(this), { jslogContext: "reset-columns" }), t.show();
			return;
		}
		let o = t.defaultSection().appendSubMenuItem(k(D.headerOptions), !1, "header-options");
		this.headerContextMenuCallback && this.headerContextMenuCallback(o), o.defaultSection().appendItem(k(D.resetColumns), this.resetColumnWeights.bind(this), { jslogContext: "reset-columns" });
		let s = e.button === 0, c = s ? this.selectedNode : this.dataGridNodeFromNode(n), l = this.selectedNode?.existingElement();
		if (s && l) {
			let e = l.getBoundingClientRect();
			if (e) {
				let n = (e.right + e.left) / 2, r = (e.bottom + e.top) / 2;
				t.setX(n), t.setY(r);
			}
		}
		if (this.refreshCallback && (!c || c !== this.creationNode) && t.defaultSection().appendItem(k(D.refresh), this.refreshCallback.bind(this), { jslogContext: "refresh" }), c && c.selectable && !c.isEventWithinDisclosureTriangle(e)) {
			if (this.editCallback) {
				if (c === this.creationNode) {
					let e = this.nextEditableColumn(-1), n = c.element().children[e];
					t.defaultSection().appendItem(k(D.addNew), this.startEditing.bind(this, n), { jslogContext: "add-new" });
				} else if (s) {
					let e = this.nextEditableColumn(-1);
					if (e > -1) {
						let n = this.visibleColumnsArray[e];
						n && this.isColumnEditable(n.id) && t.defaultSection().appendItem(k(D.editS, { PH1: String(n.title) }), this.startEditingColumnOfDataGridNode.bind(this, c, e), { jslogContext: "edit" });
					}
				} else {
					let e = this.columnIdFromNode(n);
					e && this.isColumnEditable(e) && t.defaultSection().appendItem(k(D.editS, { PH1: String(this.columns[e].title) }), this.startEditing.bind(this, n), { jslogContext: "edit" });
				}
			}
			this.deleteCallback && c !== this.creationNode && t.defaultSection().appendItem(k(D.delete), this.deleteCallback.bind(this, c), { jslogContext: "delete" }), this.rowContextMenuCallback && this.rowContextMenuCallback(t, c);
		}
		t.show();
	}
	clickInDataTable(e) {
		let t = this.dataGridNodeFromNode(e.target);
		t && t.hasChildren() && t.isEventWithinDisclosureTriangle(e) && (t.expanded ? e.altKey ? t.collapseRecursively() : t.collapse() : e.altKey ? t.expandRecursively() : t.expand());
	}
	setResizeMethod(e) {
		this.resizeMethod = e;
	}
	startResizerDragging(e) {
		return this.currentResizer = e.target, !0;
	}
	endResizerDragging() {
		this.currentResizer = null, this.saveColumnWeights();
	}
	resizerDragging(e) {
		let t = this.currentResizer;
		if (!t) return;
		let n = e.clientX - this.element.getBoundingClientRect().left, r = 0, i = P.get(t);
		if (i === void 0) return;
		let a = i + 1;
		for (let e = 0; e < i; e++) r += this.getPreferredWidth(e);
		this.resizeMethod === "last" ? a = this.resizers.length : this.resizeMethod === "first" && (r += this.getPreferredWidth(i) - this.getPreferredWidth(0), i = 0);
		let o = r + this.getPreferredWidth(i) + this.getPreferredWidth(a), s = r + 30, c = o - 30;
		if (s > c) return;
		n = d(n, s, c);
		let l = n - 3;
		N.set(t, l), t.style.left = l + "px", this.setPreferredWidth(i, n - r), this.setPreferredWidth(a, o - n);
		let u = this.visibleColumnsArray[i], f = this.visibleColumnsArray[a];
		if (u.weight && f.weight) {
			let e = u.weight + f.weight, t = o - r;
			u.weight = (n - r) * e / t, f.weight = (o - n) * e / t;
		}
		this.positionResizers(), this.updateWidths(), e.preventDefault();
	}
	setPreferredWidth(e, t) {
		let n = this.dataTableColumnGroup.children[e];
		M.set(n, t), n.style.width = t + "px";
	}
	columnOffset(e) {
		if (!this.element.offsetWidth) return 0;
		for (let t = 1; t < this.visibleColumnsArray.length; ++t) if (e === this.visibleColumnsArray[t].id && this.resizers[t - 1]) return N.get(this.resizers[t - 1]) || 0;
		return 0;
	}
	asWidget(e) {
		return this.dataGridWidget ||= new U(this, e), this.dataGridWidget;
	}
	topFillerRowElement() {
		return this.topFillerRow;
	}
	headerHeightInScroller() {
		return this.scrollContainer === this.#e ? this.headerHeight() : 0;
	}
	headerHeight() {
		return this.#t.offsetHeight;
	}
	revealNode(e) {
		e.scrollIntoViewIfNeeded(!1), e.offsetTop - this.scrollContainer.scrollTop < this.headerHeight() && (this.scrollContainer.scrollTop = e.offsetTop - this.headerHeight());
	}
}, I = /* @__PURE__ */ function(e) {
	return e.SELECTED_NODE = "SelectedNode", e.DESELECTED_NODE = "DeselectedNode", e.OPENED_NODE = "OpenedNode", e.SORTING_CHANGED = "SortingChanged", e.PADDING_CHANGED = "PaddingChanged", e.EXPANDED_NODE = "ExpandedNode", e.COLLAPSED_NODE = "CollapsedNode", e;
}({}), L = /* @__PURE__ */ function(e) {
	return e.Ascending = "sort-ascending", e.Descending = "sort-descending", e;
}({}), R = /* @__PURE__ */ function(e) {
	return e.CENTER = "center", e.RIGHT = "right", e;
}({}), z = /* @__PURE__ */ function(e) {
	return e.STRING = "String", e.BOOLEAN = "Boolean", e;
}({}), B = /* @__PURE__ */ function(e) {
	return e.NEAREST = "nearest", e.FIRST = "first", e.LAST = "last", e;
}({}), V = class {
	elementInternal = null;
	expandedInternal = !1;
	#e = !1;
	dirty = !1;
	inactive = !1;
	highlighted = !1;
	#t;
	revealedInternal;
	attachedInternal = !1;
	savedPosition = null;
	#n = !0;
	children = [];
	dataGrid = null;
	parent = null;
	previousSibling = null;
	nextSibling = null;
	#r = 20;
	selectable = !0;
	isRoot = !1;
	nodeAccessibleText = "";
	cellAccessibleTextMap = /* @__PURE__ */ new Map();
	isCreationNode = !1;
	#i;
	#a;
	constructor(e, t) {
		this.#i = e || {}, this.#a = t || !1;
	}
	element() {
		if (!this.elementInternal) {
			let e = this.createElement();
			this.createCells(e);
		}
		return this.elementInternal;
	}
	createElement() {
		return this.elementInternal = document.createElement("tr"), this.elementInternal.setAttribute("jslog", `${x().track({
			resize: !0,
			keydown: "ArrowUp|ArrowDown|ArrowLeft|ArrowRight|Enter|Space"
		})}`), this.elementInternal.classList.add("data-grid-data-grid-node"), this.dataGrid && this.dataGrid.elementToDataGridNode.set(this.elementInternal, this), this.#a && this.elementInternal.classList.add("parent"), this.expanded && this.elementInternal.classList.add("expanded"), this.selected && this.elementInternal.classList.add("selected"), this.revealed && this.elementInternal.classList.add("revealed"), this.dirty && this.elementInternal.classList.add("dirty"), this.inactive && this.elementInternal.classList.add("inactive"), this.highlighted && this.elementInternal.classList.add("highlighted"), this.isCreationNode && this.elementInternal.classList.add("creation-node"), this.elementInternal;
	}
	existingElement() {
		return this.elementInternal || null;
	}
	resetElement() {
		this.elementInternal = null;
	}
	createCells(e) {
		if (e.removeChildren(), !this.dataGrid || !this.parent) return;
		let t = this.dataGrid.visibleColumnsArray, n = [];
		(this.#a || !this.parent.isRoot) && n.push(k(D.levelS, { PH1: this.depth + 1 }));
		for (let r = 0; r < t.length; ++r) {
			let i = t[r], a = e.appendChild(this.createCell(i.id));
			i.dataType === "Boolean" && this.data[i.id] === !0 && this.setCellAccessibleName(k(D.checked), a, i.id), n.push(`${i.title}: ${this.cellAccessibleTextMap.get(i.id) || a.textContent}`);
		}
		this.nodeAccessibleText = n.join(", ");
		let r = this.createTDWithClass("corner");
		h(r, !0), e.appendChild(r);
	}
	get data() {
		return this.#i;
	}
	set data(e) {
		this.#i = e || {}, this.refresh();
	}
	get revealed() {
		if (this.revealedInternal !== void 0) return this.revealedInternal;
		let e = this.parent;
		for (; e && !e.isRoot;) {
			if (!e.expanded) return this.revealedInternal = !1, !1;
			e = e.parent;
		}
		return this.revealed = !0, !0;
	}
	set revealed(e) {
		if (this.revealedInternal !== e) {
			this.revealedInternal = e, this.elementInternal && this.elementInternal.classList.toggle("revealed", this.revealedInternal);
			for (let t = 0; t < this.children.length; ++t) this.children[t].revealed = e && this.expanded;
		}
	}
	isDirty() {
		return this.dirty;
	}
	setDirty(e) {
		this.dirty !== e && (this.dirty = e, this.elementInternal && (e ? this.elementInternal.classList.add("dirty") : this.elementInternal.classList.remove("dirty")));
	}
	setInactive(e) {
		this.inactive !== e && (this.inactive = e, this.elementInternal && (e ? this.elementInternal.classList.add("inactive") : this.elementInternal.classList.remove("inactive")));
	}
	setHighlighted(e) {
		this.highlighted !== e && (this.highlighted = e, this.elementInternal && (e ? this.elementInternal.classList.add("highlighted") : this.elementInternal.classList.remove("highlighted")));
	}
	hasChildren() {
		return this.#a;
	}
	setHasChildren(e) {
		this.#a !== e && (this.#a = e, this.elementInternal && (this.elementInternal.classList.toggle("parent", this.#a), this.elementInternal.classList.toggle("expanded", this.#a && this.expanded)));
	}
	get depth() {
		return this.#t === void 0 && (this.#t = this.parent && !this.parent.isRoot ? this.parent.depth + 1 : 0), this.#t;
	}
	get leftPadding() {
		return this.depth * (this.dataGrid ? this.dataGrid.indentWidth : 1);
	}
	get shouldRefreshChildren() {
		return this.#n;
	}
	set shouldRefreshChildren(e) {
		this.#n = e, e && this.expanded && this.expand();
	}
	get selected() {
		return this.#e;
	}
	set selected(e) {
		e ? this.select() : this.deselect();
	}
	get expanded() {
		return this.expandedInternal;
	}
	set expanded(e) {
		e ? this.expand() : this.collapse();
	}
	refresh() {
		this.dataGrid || (this.elementInternal = null), this.elementInternal && this.createCells(this.elementInternal);
	}
	createTDWithClass(e) {
		let t = document.createElement("td");
		e && (t.className = e);
		let n = this.dataGrid ? this.dataGrid.cellClass : null;
		return n && t.classList.add(n), t;
	}
	createTD(e) {
		let t = this.createTDWithClass(e + "-column");
		if (j.set(t, e), this.dataGrid) {
			let n = this.dataGrid.isColumnEditable(e);
			t.setAttribute("jslog", `${le().track({
				click: !0,
				keydown: n ? "Enter|Space|Escape" : !1,
				dblclick: n,
				change: n
			}).context(T(e))}`);
			let r = this.dataGrid.columns[e].align;
			r && t.classList.add(r), e === this.dataGrid.disclosureColumnId && (t.classList.add("disclosure"), this.leftPadding && t.style.setProperty("padding-left", this.leftPadding + "px")), n && (t.tabIndex = 0, t.ariaHasPopup = "true");
		}
		return t;
	}
	createCell(e) {
		let t = this.createTD(e), n = this.data[e];
		return n instanceof Node ? t.appendChild(n) : n !== null && this.dataGrid && this.dataGrid.setElementContent(t, n), t;
	}
	setCellAccessibleName(e, t, n) {
		this.cellAccessibleTextMap.set(n, e);
		for (let e = 0; e < t.children.length; e++) h(t.children[e], !0);
		f(t, e);
	}
	nodeSelfHeight() {
		return 20;
	}
	appendChild(e) {
		this.insertChild(e, this.children.length);
	}
	resetNode(e) {
		this.#t = void 0, delete this.revealedInternal, !e && (this.previousSibling && (this.previousSibling.nextSibling = this.nextSibling), this.nextSibling && (this.nextSibling.previousSibling = this.previousSibling), this.dataGrid = null, this.parent = null, this.nextSibling = null, this.previousSibling = null, this.attachedInternal = !1);
	}
	insertChild(e, t) {
		if (!e) throw Error("insertChild: Node can't be undefined or null.");
		if (e.parent === this) {
			let n = this.children.indexOf(e);
			if (n < 0 && console.assert(!1, "Inconsistent DataGrid state"), n === t) return;
			n < t && --t;
		}
		e.remove(), this.children.splice(t, 0, e), this.setHasChildren(!0), e.parent = this, e.dataGrid = this.dataGrid, e.recalculateSiblings(t), e.#n = !0;
		let n = e.children[0];
		for (; n;) n.resetNode(!0), n.dataGrid = this.dataGrid, n.attachedInternal = !1, n.#n = !0, n = n.traverseNextNode(!1, e, !0);
		this.expanded && e.attach(), this.revealed || (e.revealed = !1);
	}
	remove() {
		this.parent && this.parent.removeChild(this);
	}
	removeChild(e) {
		if (!e) throw Error("removeChild: Node can't be undefined or null.");
		if (e.parent !== this) throw Error("removeChild: Node is not a child of this node.");
		this.dataGrid && this.dataGrid.updateSelectionBeforeRemoval(e, !1), e.detach(), e.resetNode(), a(this.children, e, !0), this.children.length <= 0 && this.setHasChildren(!1);
	}
	removeChildren() {
		this.dataGrid && this.dataGrid.updateSelectionBeforeRemoval(this, !0);
		for (let e = 0; e < this.children.length; ++e) {
			let t = this.children[e];
			t.detach(), t.resetNode();
		}
		this.children = [], this.setHasChildren(!1);
	}
	recalculateSiblings(e) {
		if (!this.parent) return;
		let t = this.parent.children[e - 1] || null;
		t && (t.nextSibling = this), this.previousSibling = t;
		let n = this.parent.children[e + 1] || null;
		n && (n.previousSibling = this), this.nextSibling = n;
	}
	collapse() {
		if (!this.isRoot) {
			this.elementInternal && this.elementInternal.classList.remove("expanded"), this.expandedInternal = !1, this.selected && this.dataGrid && this.dataGrid.announceSelectedGridNode();
			for (let e = 0; e < this.children.length; ++e) this.children[e].revealed = !1;
			this.dataGrid?.dispatchEventToListeners("CollapsedNode", this);
		}
	}
	collapseRecursively() {
		let e = this;
		for (; e;) e.expanded && e.collapse(), e = e.traverseNextNode(!1, this, !0);
	}
	populate() {}
	expand() {
		if (this.#a && !this.expandedInternal && !this.isRoot) {
			if (this.revealed && !this.#n) for (let e = 0; e < this.children.length; ++e) this.children[e].revealed = !0;
			if (this.#n) {
				for (let e = 0; e < this.children.length; ++e) this.children[e].detach();
				if (this.populate(), this.attachedInternal) for (let e = 0; e < this.children.length; ++e) {
					let t = this.children[e];
					this.revealed && (t.revealed = !0), t.attach();
				}
				this.#n = !1;
			}
			this.elementInternal && this.elementInternal.classList.add("expanded"), this.selected && this.dataGrid && this.dataGrid.announceSelectedGridNode(), this.expandedInternal = !0, this.dataGrid?.dispatchEventToListeners("ExpandedNode", this);
		}
	}
	expandRecursively() {
		let e = this;
		for (; e;) e.expand(), e = e.traverseNextNode(!1, this);
	}
	reveal() {
		if (this.isRoot || !this.dataGrid) return;
		let e = this.parent;
		for (; e && !e.isRoot;) e.expanded || e.expand(), e = e.parent;
		this.dataGrid.revealNode(this.element());
	}
	select(e) {
		this.dataGrid && this.selectable && !this.selected && (this.dataGrid.selectedNode && this.dataGrid.selectedNode.deselect(), this.#e = !0, this.dataGrid.selectedNode = this, this.elementInternal && (this.elementInternal.classList.add("selected"), this.elementInternal.focus(), this.dataGrid.setHasSelection(!0), this.dataGrid.announceSelectedGridNode()), e || this.dataGrid.dispatchEventToListeners("SelectedNode", this));
	}
	revealAndSelect() {
		this.isRoot || (this.reveal(), this.select());
	}
	deselect(e) {
		this.dataGrid?.selectedNode === this && this.selected && (this.#e = !1, this.dataGrid.selectedNode = null, this.elementInternal && (this.elementInternal.classList.remove("selected"), this.dataGrid.setHasSelection(!1)), e || this.dataGrid.dispatchEventToListeners("DeselectedNode"));
	}
	traverseNextNode(e, t, n, r) {
		!n && this.#a && this.populate(), r && (r.depthChange = 0);
		let i = !e || this.revealed ? this.children[0] : null;
		if (i && (!e || this.expanded)) return r && (r.depthChange = 1), i;
		if (this === t) return null;
		if (i = !e || this.revealed ? this.nextSibling : null, i) return i;
		for (i = this; i && !i.isRoot && (e && !i.revealed || !i.nextSibling) && i.parent !== t;) r && --r.depthChange, i = i.parent;
		return i && (!e || i.revealed) ? i.nextSibling : null;
	}
	traversePreviousNode(e, t) {
		let n = !e || this.revealed ? this.previousSibling : null;
		for (!t && n && n.#a && n.populate(); n && (!e || n.revealed && n.expanded) && n.children[n.children.length - 1];) !t && n && n.#a && n.populate(), n = !e || n.revealed && n.expanded ? n.children[n.children.length - 1] : null;
		return n || (!this.parent || this.parent.isRoot ? null : this.parent);
	}
	isEventWithinDisclosureTriangle(e) {
		if (!this.#a) return !1;
		let t = C(e.target, "td");
		if (!t || !(t instanceof HTMLElement) || !t.classList.contains("disclosure")) return !1;
		let n = t.getBoundingClientRect().left + this.leftPadding;
		return e.pageX >= n && e.pageX <= n + this.#r;
	}
	attach() {
		if (!this.dataGrid || this.attachedInternal) return;
		this.attachedInternal = !0;
		let e = this.traversePreviousNode(!0, !0), t = e ? e.element() : this.dataGrid.topFillerRow;
		if (this.dataGrid.dataTableBody.insertBefore(this.element(), t.nextSibling), this.expandedInternal) for (let e = 0; e < this.children.length; ++e) this.children[e].attach();
	}
	detach() {
		if (this.attachedInternal) {
			this.attachedInternal = !1, this.elementInternal && this.elementInternal.remove();
			for (let e = 0; e < this.children.length; ++e) this.children[e].detach();
		}
	}
	savePosition() {
		if (!this.savedPosition) {
			if (!this.parent) throw Error("savePosition: Node must have a parent.");
			this.savedPosition = {
				parent: this.parent,
				index: this.parent.children.indexOf(this)
			};
		}
	}
	restorePosition() {
		this.savedPosition &&= (this.parent !== this.savedPosition.parent && this.savedPosition.parent.insertChild(this, this.savedPosition.index), null);
	}
}, H = class extends V {
	isCreationNode;
	constructor(e, t) {
		super(e, t), this.isCreationNode = !0;
	}
}, U = class extends b {
	dataGrid;
	constructor(e, t) {
		super(t), this.dataGrid = e, this.element.appendChild(e.element), this.setDefaultFocusedElement(e.element), this.registerRequiredCSS(E);
	}
	wasShown() {
		super.wasShown(), this.dataGrid.wasShown();
	}
	willHide() {
		this.dataGrid.willHide(), super.willHide();
	}
	onResize() {
		super.onResize(), this.dataGrid.onResize();
	}
	elementsToRestoreScrollPositionsFor() {
		return [this.dataGrid.scrollContainer];
	}
}, me = /* @__PURE__ */ e({
	Events: () => G,
	ViewportDataGrid: () => W,
	ViewportDataGridNode: () => K
}), he = 0, W = class extends t(F) {
	onScrollBound;
	visibleNodes;
	enableAutoScrollToBottom = !1;
	keepScrollingToBottom = !1;
	updateIsFromUser;
	lastScrollTop;
	firstVisibleIsStriped;
	isStriped;
	filters = [];
	id = he++;
	constructor(e) {
		super(e), this.onScrollBound = this.onScroll.bind(this), this.scrollContainer.addEventListener("scroll", this.onScrollBound, !0), this.visibleNodes = [], this.inline = !1, this.updateIsFromUser = !1, this.lastScrollTop = 0, this.firstVisibleIsStriped = !1, this.isStriped = !1, this.setRootNode(new K());
	}
	setStriped(e) {
		this.isStriped = e;
		let t = !0;
		this.visibleNodes.length && (t = !!this.filteredNodes().indexOf(this.visibleNodes[0])), this.updateStripesClass(t);
	}
	setFilters(e) {
		this.filters !== e && (this.filters = e, this.scheduleUpdate());
	}
	updateStripesClass(e) {
		this.element.classList.toggle("striped-data-grid", !e && this.isStriped), this.element.classList.toggle("striped-data-grid-starts-with-odd", e && this.isStriped);
	}
	setScrollContainer(e) {
		this.scrollContainer.removeEventListener("scroll", this.onScrollBound, !0), this.scrollContainerInternal = e, this.scrollContainer.addEventListener("scroll", this.onScrollBound, !0);
	}
	onResize() {
		this.keepScrollingToBottom && (this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight - this.scrollContainer.clientHeight), this.scheduleUpdate(), super.onResize();
	}
	setEnableAutoScrollToBottom(e) {
		this.keepScrollingToBottom = this.enableAutoScrollToBottom = e;
	}
	onScroll(e) {
		this.lastScrollTop !== this.scrollContainer.scrollTop && this.scheduleUpdate(!0);
	}
	scheduleUpdateStructure() {
		this.scheduleUpdate();
	}
	scheduleUpdate(e) {
		this.updateIsFromUser = this.updateIsFromUser || !!e, de(`ViewportDataGrid.render ${this.id}`, this.update.bind(this));
	}
	updateInstantly() {
		this.update();
	}
	renderInline() {
		this.inline = !0, super.renderInline(), this.update();
	}
	getStringifiedCellValues(e, t) {
		return JSON.stringify(Object.entries(e).filter(([e]) => t.has(e)).map(([, e]) => e instanceof Node ? e.textContent : String(e))).toLowerCase();
	}
	testNodeWithFilter(e, t) {
		let n = !1, { key: r, text: i, negative: a, regex: o } = t, s = this.getStringifiedCellValues(e.data, r ? new Set(r.split(",")) : new Set(this.visibleColumnsArray.map((e) => e.id)));
		return o ? n = o.test(s) : i && (n = s.includes(i.toLowerCase())), a ? !n : n;
	}
	testNodeWithFilters(e) {
		for (let t of this.filters) if (!this.testNodeWithFilter(e, t)) return !1;
		return !0;
	}
	calculateVisibleNodes(e, t) {
		let n = this.filteredNodes();
		if (this.inline) return {
			topPadding: 0,
			bottomPadding: 0,
			contentHeight: 0,
			visibleNodes: n,
			offset: 0
		};
		let r = n.length, i = 0, a = 0;
		for (; i < r && a + n[i].nodeSelfHeight() < t; ++i) a += n[i].nodeSelfHeight();
		let o = i, s = a;
		for (; i < r && a < t + e; ++i) a += n[i].nodeSelfHeight();
		let c = i, l = 0;
		for (; i < r; ++i) l += n[i].nodeSelfHeight();
		return this.enableAutoScrollToBottom && (this.keepScrollingToBottom = c === n.length), {
			topPadding: s,
			bottomPadding: l,
			contentHeight: a - s,
			visibleNodes: n.slice(o, c),
			offset: o
		};
	}
	getNumberOfRows() {
		return this.filteredNodes().length;
	}
	contentHeight() {
		let e = this.filteredNodes(), t = 0;
		for (let n = 0, r = e.length; n < r; ++n) t += e[n].nodeSelfHeight();
		return t;
	}
	update() {
		let e = this.scrollContainer.clientHeight - this.headerHeightInScroller(), t = this.contentHeight(), n = this.scrollContainer.scrollTop, r = Math.max(0, t - e), i = n;
		!this.updateIsFromUser && this.keepScrollingToBottom && (i = r), this.updateIsFromUser = !1, i = Math.min(r, i);
		let a = this.calculateVisibleNodes(e, i), o = a.visibleNodes, s = new Set(o);
		for (let e = 0; e < this.visibleNodes.length; ++e) {
			let t = this.visibleNodes[e];
			if (!s.has(t) && t.attached()) {
				let e = t.existingElement();
				e && e.remove();
			}
		}
		let c = this.topFillerRowElement(), l = this.dataTableBody, u = a.offset;
		if (o.length) {
			let e = this.filteredNodes().indexOf(o[0]);
			this.updateStripesClass(!!(e % 2)), this.keepScrollingToBottom && e !== -1 && !!(e % 2) !== this.firstVisibleIsStriped && (u += 1);
		}
		this.firstVisibleIsStriped = !!(u % 2);
		for (let e = 0; e < o.length; ++e) {
			let t = o[e], n = t.element();
			t.setStriped((u + e) % 2 == 0), n !== c.nextSibling && l.insertBefore(n, c.nextSibling), t.revealed = !0, c = n;
		}
		this.setVerticalPadding(a.topPadding, a.bottomPadding), this.lastScrollTop = i, i !== n && (this.scrollContainer.scrollTop = i);
		let d = a.contentHeight <= e && a.topPadding + a.bottomPadding === 0;
		d !== this.element.classList.contains("data-grid-fits-viewport") && (this.element.classList.toggle("data-grid-fits-viewport", d), this.updateWidths()), this.visibleNodes = o, this.dispatchEventToListeners("ViewportCalculated");
	}
	revealViewportNode(e) {
		let t = this.filteredNodes(), n = t.indexOf(e);
		if (n === -1) return;
		let r = 0;
		for (let e = 0; e < n; ++e) r += t[e].nodeSelfHeight();
		let i = r + e.nodeSelfHeight(), a = this.scrollContainer.scrollTop, o = this.scrollContainer.offsetHeight - this.headerHeightInScroller();
		a > r ? (a = r, this.keepScrollingToBottom = !1) : a + o < i && (a = i - o), this.scrollContainer.scrollTop = a;
	}
	filteredNodes() {
		return this.rootNode().flatChildren().filter(this.testNodeWithFilters.bind(this));
	}
}, G = /* @__PURE__ */ function(e) {
	return e.VIEWPORT_CALCULATED = "ViewportCalculated", e;
}({}), K = class extends V {
	stale;
	flatNodes;
	isStripedInternal;
	constructor(e, t) {
		super(e, t), this.stale = !1, this.flatNodes = null, this.isStripedInternal = !1;
	}
	element() {
		let e = this.existingElement(), t = e || this.createElement();
		return (!e || this.stale) && (this.createCells(t), this.stale = !1), t;
	}
	nodeSelfHeight() {
		let e = this.dataGrid?.topFillerRow?.nextElementSibling;
		return e?.classList.contains("data-grid-data-grid-node") && e.clientHeight || super.nodeSelfHeight();
	}
	setStriped(e) {
		this.isStripedInternal = e, this.element().classList.toggle("odd", e);
	}
	isStriped() {
		return this.isStripedInternal;
	}
	clearFlatNodes() {
		this.flatNodes = null;
		let e = this.parent;
		e && e.clearFlatNodes();
	}
	flatChildren() {
		if (this.flatNodes) return this.flatNodes;
		let e = [], t = [this.children], n = [0], r = 0;
		for (; r >= 0;) {
			if (t[r].length <= n[r]) {
				r--;
				continue;
			}
			let i = t[r][n[r]++];
			e.push(i), i.expanded && i.children.length && (r++, t[r] = i.children, n[r] = 0);
		}
		return this.flatNodes = e, e;
	}
	insertChild(e, t) {
		if (this.clearFlatNodes(), e.parent === this) {
			let n = this.children.indexOf(e);
			if (n < 0 && console.assert(!1, "Inconsistent DataGrid state"), n === t) return;
			n < t && --t;
		}
		e.remove(), e.parent = this, e.dataGrid = this.dataGrid, this.children.length || this.setHasChildren(!0), this.children.splice(t, 0, e), e.recalculateSiblings(t), this.expanded && this.dataGrid && this.dataGrid.scheduleUpdateStructure();
	}
	removeChild(e) {
		if (this.dataGrid && this.dataGrid.updateSelectionBeforeRemoval(e, !1), this.clearFlatNodes(), e.previousSibling && (e.previousSibling.nextSibling = e.nextSibling), e.nextSibling && (e.nextSibling.previousSibling = e.previousSibling), e.parent !== this) throw Error("removeChild: Node is not a child of this node.");
		a(this.children, e, !0), e.unlink(), this.children.length || this.setHasChildren(!1), this.expanded && this.dataGrid && this.dataGrid.scheduleUpdateStructure();
	}
	removeChildren() {
		this.dataGrid && this.dataGrid.updateSelectionBeforeRemoval(this, !0), this.clearFlatNodes();
		for (let e = 0; e < this.children.length; ++e) this.children[e].unlink();
		this.children = [], this.expanded && this.dataGrid && this.dataGrid.scheduleUpdateStructure();
	}
	unlink() {
		let e = this.existingElement();
		this.attached() && e && e.remove(), this.resetNode();
	}
	collapse() {
		if (!this.expanded) return;
		this.clearFlatNodes(), this.expandedInternal = !1;
		let e = this.existingElement();
		e && e.classList.remove("expanded"), this.selected && this.dataGrid.announceSelectedGridNode(), this.dataGrid.scheduleUpdateStructure(), this.dataGrid?.dispatchEventToListeners(I.COLLAPSED_NODE, this);
	}
	expand() {
		this.expanded || (this.dataGrid.keepScrollingToBottom = !1, this.clearFlatNodes(), super.expand(), this.dataGrid.scheduleUpdateStructure());
	}
	traverseNextNode(e, t, n, r) {
		let i = super.traverseNextNode(e, t, n, r);
		return i && e && !this.dataGrid.testNodeWithFilters(i) ? i.traverseNextNode(e, t, n, r) : i;
	}
	traversePreviousNode(e, t) {
		let n = super.traversePreviousNode(e, t);
		return n && e && !this.dataGrid.testNodeWithFilters(n) ? n.traversePreviousNode(e, t) : n;
	}
	attached() {
		let e = this.existingElement();
		return !!(this.dataGrid && e?.parentElement);
	}
	refresh() {
		this.attached() ? (this.stale = !0, this.dataGrid.scheduleUpdate()) : this.resetElement();
	}
	reveal() {
		this.dataGrid.revealViewportNode(this);
	}
	recalculateSiblings(e) {
		this.clearFlatNodes(), super.recalculateSiblings(e);
	}
}, ge = /* @__PURE__ */ e({
	SortableDataGrid: () => q,
	SortableDataGridNode: () => J
}), q = class e extends W {
	sortingFunction;
	constructor(t) {
		super(t), this.sortingFunction = e.TrivialComparator, this.setRootNode(new J());
	}
	static TrivialComparator(e, t) {
		return 0;
	}
	static NumericComparator(e, t, n) {
		let r = t.getNumericValue(e), i = n.getNumericValue(e);
		return r < i ? -1 : +(r > i);
	}
	static StringComparator(e, t, n) {
		let r = t.data[e], i = n.data[e], a = r instanceof Node ? r.textContent : String(r), o = i instanceof Node ? i.textContent : String(i);
		return !a || !o ? 0 : a < o ? -1 : +(a > o);
	}
	static Comparator(e, t, n, r) {
		return n.isCreationNode && !r.isCreationNode ? 1 : !n.isCreationNode && r.isCreationNode ? -1 : t ? e(r, n) : e(n, r);
	}
	static create(t, n, r) {
		let i = t.length;
		if (!i) return null;
		let a = [];
		for (let e = 0; e < t.length; ++e) {
			let n = String(e);
			a.push({
				id: n,
				title: t[e],
				sortable: !0
			});
		}
		let o = [];
		for (let e = 0; e < n.length / i; ++e) {
			let r = {};
			for (let a = 0; a < t.length; ++a) r[a] = n[i * e + a];
			let a = new J(r);
			a.selectable = !1, o.push(a);
		}
		let s = new e({
			displayName: r,
			columns: a
		}), c = o.length, l = s.rootNode();
		for (let e = 0; e < c; ++e) l.appendChild(o[e]);
		s.addEventListener(I.SORTING_CHANGED, u);
		function u() {
			let t = s.rootNode().children, n = s.sortColumnId();
			if (!n) return;
			let r = !0;
			for (let e = 0; e < t.length; e++) {
				if (t[e].isCreationNode) continue;
				let i = t[e].data[n];
				if (isNaN(i instanceof Node ? i.textContent : i)) {
					r = !1;
					break;
				}
			}
			let i = r ? e.NumericComparator : e.StringComparator;
			s.sortNodes(i.bind(null, n), !s.isSortOrderAscending());
		}
		return s;
	}
	insertChild(e) {
		this.rootNode().insertChildOrdered(e);
	}
	sortNodes(t, n) {
		this.sortingFunction = e.Comparator.bind(null, t, n), this.rootNode().recalculateSiblings(0), this.rootNode().sortChildren(), this.scheduleUpdateStructure();
	}
}, J = class extends K {
	#e = /* @__PURE__ */ new Map();
	#t = !0;
	#n = null;
	get data() {
		return super.data;
	}
	set data(e) {
		this.#e.clear(), super.data = e;
	}
	getNumericValue(e) {
		let t = this.#e.get(e);
		if (t === void 0) {
			let n = this.data[e];
			t = Number(n instanceof Node ? n.textContent : n), this.#e.set(e, t);
		}
		return t;
	}
	insertChild(e, t) {
		super.insertChild(e, t), this.#t = !0;
	}
	removeChild(e) {
		super.removeChild(e), this.#t = !0;
	}
	refresh() {
		this.#e.clear(), super.refresh(), this.parent?.markChildrenDirty();
	}
	expand() {
		super.expand(), this.sortChildren();
	}
	markChildrenDirty() {
		this.#t = !0;
	}
	insertChildOrdered(e) {
		let t = this.dataGrid;
		t && this.insertChild(e, o(this.children, e, t.sortingFunction));
	}
	sortChildren() {
		let e = this.dataGrid;
		if (e && this.expanded) {
			if (this.#t || this.#n !== e.sortingFunction) {
				this.children.sort(e.sortingFunction), this.#t = !1, this.#n = e.sortingFunction;
				for (let e = 0; e < this.children.length; ++e) this.children[e].recalculateSiblings(e);
			}
			for (let e = 0; e < this.children.length; ++e) this.children[e].sortChildren();
		}
	}
}, _e = /* @__PURE__ */ e({ ShowMoreDataGridNode: () => Z }), Y = {
	showDBefore: "Show {PH1} before",
	showDAfter: "Show {PH1} after",
	showAllD: "Show all {PH1}"
}, ve = r("ui/legacy/components/data_grid/ShowMoreDataGridNode.ts", Y), X = n.bind(void 0, ve), Z = class extends V {
	callback;
	startPosition;
	endPosition;
	chunkSize;
	showNext;
	showAll;
	showLast;
	selectable;
	hasCells;
	constructor(e, t, n, r) {
		super({ summaryRow: !0 }, !1), this.callback = e, this.startPosition = t, this.endPosition = n, this.chunkSize = r, this.showNext = v(X(Y.showDBefore, { PH1: this.chunkSize })), this.showNext.addEventListener("click", this.showNextChunk.bind(this), !1), this.showAll = v(""), this.showAll.addEventListener("click", this.#e.bind(this), !1), this.showLast = v(X(Y.showDAfter, { PH1: this.chunkSize })), this.showLast.addEventListener("click", this.showLastChunk.bind(this), !1), this.updateLabels(), this.selectable = !1;
	}
	showNextChunk() {
		this.callback(this.startPosition, this.startPosition + this.chunkSize);
	}
	#e() {
		this.callback(this.startPosition, this.endPosition);
	}
	showLastChunk() {
		this.callback(this.endPosition - this.chunkSize, this.endPosition);
	}
	updateLabels() {
		let e = this.endPosition - this.startPosition;
		e > this.chunkSize ? (this.showNext.classList.remove("hidden"), this.showLast.classList.remove("hidden")) : (this.showNext.classList.add("hidden"), this.showLast.classList.add("hidden")), this.showAll.textContent = X(Y.showAllD, { PH1: e });
	}
	createCells(e) {
		this.hasCells = !1, super.createCells(e);
	}
	createCell(e) {
		let t = this.createTD(e);
		return t.classList.add("show-more"), this.hasCells || (this.hasCells = !0, this.depth && this.dataGrid && t.style.setProperty("padding-left", this.depth * this.dataGrid.indentWidth + "px"), t.appendChild(this.showNext), t.appendChild(this.showAll), t.appendChild(this.showLast)), t;
	}
	setStartPosition(e) {
		this.startPosition = e, this.updateLabels();
	}
	setEndPosition(e) {
		this.endPosition = e, this.updateLabels();
	}
	nodeSelfHeight() {
		return 40;
	}
	dispose() {}
}, ye = "dummy", be = class extends m {
	static observedAttributes = [
		"striped",
		"name",
		"inline",
		"resize"
	];
	#e = q.create([ye], [], "");
	#t = new ResizeObserver(() => {
		this.inline || this.#e.onResize();
	});
	#n;
	#r = [];
	#i = /* @__PURE__ */ new Set();
	#a = /* @__PURE__ */ new Set();
	#o = null;
	constructor() {
		super(), this.style.display = "flex", this.#e.element.style.flex = "auto", this.#n = ue(this, {
			delegatesFocus: !0,
			cssFile: E
		}), this.#n.appendChild(this.#e.element), this.#e.addEventListener(I.SELECTED_NODE, (e) => e.data.configElement.dispatchEvent(new CustomEvent("select"))), this.#e.addEventListener(I.DESELECTED_NODE, () => this.dispatchEvent(new CustomEvent("deselect"))), this.#e.addEventListener(I.OPENED_NODE, (e) => e.data.configElement.dispatchEvent(new CustomEvent("open"))), this.#e.addEventListener(I.EXPANDED_NODE, (e) => e.data.configElement.dispatchEvent(new CustomEvent("expand"))), this.#e.addEventListener(I.COLLAPSED_NODE, (e) => e.data.configElement.dispatchEvent(new CustomEvent("collapse"))), this.#e.addEventListener(I.SORTING_CHANGED, () => this.dispatchEvent(new CustomEvent("sort", { detail: {
			columnId: this.#e.sortColumnId(),
			ascending: this.#e.isSortOrderAscending()
		} }))), this.#e.setRowContextMenuCallback((e, t) => {
			t.configElement.dispatchEvent(new CustomEvent("contextmenu", { detail: e }));
		}), this.#e.setHeaderContextMenuCallback((e) => {
			for (let t of this.#r) this.#i.has(t.id) && e.defaultSection().appendCheckboxItem(this.#e.columns[t.id].title, () => {
				this.#a.has(t.id) ? this.#a.delete(t.id) : this.#a.add(t.id), this.#e.setColumnsVisibility(new Set(this.#r.map(({ id: e }) => e).filter((e) => !this.#a.has(e))));
			}, { checked: !this.#a.has(t.id) });
		}), this.#t.observe(this), this.#c(), this.addNodes(this.templateRoot.querySelectorAll("tr"));
	}
	attributeChangedCallback(e, t, n) {
		if (t !== n) switch (e) {
			case "striped":
				this.#e.setStriped(n !== "true");
				break;
			case "name":
				this.#e.displayName = n ?? "";
				break;
			case "inline":
				this.#e.renderInline();
				break;
			case "resize": this.#e.setResizeMethod(n);
		}
	}
	set striped(e) {
		this.toggleAttribute("striped", e);
	}
	get striped() {
		return $(this, "striped");
	}
	set inline(e) {
		this.toggleAttribute("inline", e);
	}
	get inline() {
		return $(this, "inline");
	}
	set displayName(e) {
		this.setAttribute("name", e);
	}
	get displayName() {
		return this.getAttribute("name");
	}
	set resizeMethod(e) {
		this.setAttribute("resize", e);
	}
	get resizeMethod() {
		return this.getAttribute("resize");
	}
	set filters(e) {
		this.#e.setFilters(e), this.#e.element.setAttribute("aria-rowcount", String(this.#e.getNumberOfRows()));
	}
	get columns() {
		return this.#r;
	}
	#s(e, t) {
		let n = e.children.length > 0;
		n ||= !!t.querySelector("td table"), e.setHasChildren(n);
	}
	#c() {
		for (let e of Object.keys(this.#e.columns)) this.#e.removeColumn(e);
		this.#i.clear(), this.#r = [];
		let e = !1;
		for (let t of this.templateRoot.querySelectorAll("th[id]") || []) {
			let n = t.id, r = t.textContent?.trim() || "", i = t.firstElementChild ? document.createDocumentFragment() : void 0;
			if (i) {
				r = "";
				for (let e of t.children) i.appendChild(e.cloneNode(!0)), r += e.shadowRoot ? e.shadowRoot.textContent : e.textContent;
			}
			let a = $(t, "sortable"), o = t.getAttribute("width") ?? void 0, s = t.hasAttribute("fixed"), c = t.getAttribute("align") ?? void 0;
			c !== R.CENTER && c !== R.RIGHT && (c = void 0);
			let l = t.getAttribute("type") === "boolean" ? z.BOOLEAN : z.STRING, u = parseFloat(t.getAttribute("weight") || "") ?? void 0, d = t.hasAttribute("editable");
			d && (e = !0);
			let f = t.getAttribute("sort") === "descending" ? L.Descending : t.getAttribute("sort") === "ascending" ? L.Ascending : void 0, p = {
				id: n,
				title: r,
				titleDOMFragment: i,
				sortable: a,
				sort: f,
				fixedWidth: s,
				width: o,
				align: c,
				weight: u,
				editable: d,
				dataType: l
			};
			this.#e.addColumn(p), this.#r.push(p), $(t, "hideable") && this.#i.add(n);
		}
		let t = new Set(this.#r.map(({ id: e }) => e).filter((e) => !this.#a.has(e)));
		t.size && this.#e.setColumnsVisibility(t), this.#e.setEditCallback(e ? this.#m.bind(this) : void 0, xe), this.#e.deleteCallback = e ? this.#h.bind(this) : void 0;
	}
	#l(e) {
		for (let t of e) {
			for (let e of [...t.removedNodes, ...t.addedNodes]) if (e instanceof HTMLElement && (e.nodeName === "TH" || e.querySelector("th"))) return !0;
			if (t.target instanceof HTMLElement && t.target.closest("th")) return !0;
		}
		return !1;
	}
	#u(e) {
		return [...e].flatMap((e) => e instanceof HTMLTableRowElement ? [e, ...e.querySelectorAll("table tr")] : e instanceof HTMLElement ? [...e.querySelectorAll("tr")] : []).filter((e) => e.querySelector("td") && !$(e, "placeholder"));
	}
	#d(e) {
		return [...e].flatMap((e) => e instanceof HTMLStyleElement ? [e] : e instanceof HTMLElement ? [...e.querySelectorAll("style")] : []);
	}
	#f(e) {
		for (let t = e.nextElementSibling; t; t = t.nextElementSibling) {
			let e = Q.get(t);
			if (e) return e;
		}
		return null;
	}
	addNodes(e) {
		for (let t of this.#u(e)) {
			let e = t.parentElement?.closest("td")?.closest("tr"), n = (e ? Q.get(e) : void 0) || this.#e.rootNode(), r = this.#f(t), i = r ? n.children.indexOf(r) : n.children.length, a = new Q(t, this);
			this.#s(a, t), (e || a.hasChildren()) && !this.#e.disclosureColumnId && (this.#e.disclosureColumnId = this.#r[0].id), n.insertChild(a, i), $(t, "selected") && a.select(), $(t, "dirty") && a.setDirty(!0), $(t, "inactive") && a.setInactive(!0), $(t, "highlighted") && a.setHighlighted(!0);
		}
		for (let t of this.#d(e)) this.#n.appendChild(t.cloneNode(!0));
		this.#e.dispatchEventToListeners(I.SORTING_CHANGED);
	}
	removeNodes(e) {
		for (let t of this.#u(e)) {
			let e = Q.get(t);
			e && Q.remove(e);
		}
	}
	updateNode(e, t) {
		for (; e?.parentNode && !(e instanceof HTMLElement);) e = e.parentNode;
		let n = e instanceof HTMLElement ? e.closest("tr") : null, r = n ? Q.get(n) : null;
		r && n && (t === "selected" ? $(n, "selected") ? r.select() : r.deselect() : t === "dirty" ? r.setDirty($(n, "dirty")) : t === "inactive" ? r.setInactive($(n, "inactive")) : t === "highlighted" ? r.setHighlighted($(n, "highlighted")) : (this.#s(r, n), r.refresh()));
	}
	deselectRow() {
		this.#e.selectedNode?.deselect();
	}
	#p() {
		this.#o && (Q.remove(this.#o), this.#o = null, this.#e.creationNode = void 0);
		let e = this.templateRoot.querySelector("tr[placeholder]");
		if (!e) this.#e.creationNode?.remove(), this.#e.creationNode = void 0;
		else if (!Q.get(e)) {
			this.#e.creationNode?.remove();
			let t = new Q(e, this);
			this.#e.creationNode = t, this.#e.rootNode().appendChild(t);
		}
	}
	onChange(e) {
		this.#l(e) && this.#c(), this.#p();
		let t = e.some((e) => e.addedNodes.length > 0);
		this.#e.sortColumnId() !== null && !t && this.#e.dispatchEventToListeners(I.SORTING_CHANGED);
	}
	#m(e, t, n, r, i) {
		if (e.isCreationNode) {
			this.#o = e;
			let n = !1;
			if (i) {
				let e = this.#r.findIndex(({ id: e }) => e === t);
				n = (i === "forward" ? this.#r.slice(e + 1) : this.#r.slice(0, e)).some(({ editable: e }) => e);
			}
			n || e.deselect();
			return;
		}
		e.configElement.dispatchEvent(new CustomEvent("edit", { detail: {
			columnId: t,
			valueBeforeEditing: n,
			newText: r
		} }));
	}
	#h(e) {
		e.configElement.dispatchEvent(new CustomEvent("delete"));
	}
	addEventListener(...e) {
		super.addEventListener(...e), e[0] === "refresh" && (this.#e.refreshCallback = this.#g.bind(this));
	}
	#g() {
		this.dispatchEvent(new CustomEvent("refresh"));
	}
}, Q = class e extends J {
	static #e = /* @__PURE__ */ new WeakMap();
	#t;
	#n;
	#r = /* @__PURE__ */ new Set();
	constructor(t, n) {
		super(), this.#t = t, e.#e.set(t, this), this.#n = n, this.#i(), this.isCreationNode = $(this.#t, "placeholder");
	}
	static get(t) {
		return t && e.#e.get(t);
	}
	get configElement() {
		return this.#t;
	}
	#i() {
		let e = [...this.#t.children].filter((e) => e.tagName === "TD");
		for (let t = 0; t < this.#n.columns.length; ++t) {
			let n = e[t];
			if (!n) continue;
			let r = this.#n.columns[t];
			r.dataType === z.BOOLEAN ? this.data[r.id] = $(n, "data-value") || n.textContent === "true" : this.data[r.id] = n.dataset.value ?? n.textContent ?? "";
		}
	}
	createElement() {
		let e = super.createElement();
		e.addEventListener("click", this.#a.bind(this)), e.addEventListener("mouseenter", this.#a.bind(this)), e.addEventListener("mouseleave", this.#a.bind(this)), this.#t.hasAttribute("style") && e.setAttribute("style", this.#t.getAttribute("style") || "");
		for (let t of this.#t.classList) e.classList.add(t);
		return e;
	}
	refresh() {
		this.#i(), super.refresh();
		let e = this.existingElement();
		if (e) {
			this.#t.hasAttribute("style") && e.setAttribute("style", this.#t.getAttribute("style") || "");
			for (let t of this.#r) e.classList.remove(t);
			for (let t of this.#t.classList) e.classList.add(t);
		}
	}
	#a(e) {
		let t = m.findCorrespondingElement(e.target, e.currentTarget, this.#t);
		if (!t) throw Error("Cell click event target not found in the data grid");
		t instanceof HTMLElement && t?.dispatchEvent(new MouseEvent(e.type, {
			bubbles: !0,
			composed: !0
		}));
	}
	createCells(e) {
		let t = [...this.#t.querySelectorAll("td")];
		if (!t.some((e) => e.hasAttribute("colspan"))) super.createCells(e);
		else for (let n of t) e.appendChild(n.cloneNode(!0));
	}
	createCell(e) {
		let t = this.#n.columns.findIndex(({ id: t }) => t === e);
		if (this.#n.columns[t].dataType === z.BOOLEAN) {
			let t = super.createCell(e);
			return t.setAttribute("part", `${e}-column`), t;
		}
		let n = this.createTD(e);
		n.setAttribute("part", `${e}-column`);
		let r = [...this.#t.children].filter((e) => e.tagName === "TD")[t];
		if (this.isCreationNode && !r) return n;
		if (!r) throw Error(`Column ${e} not found in the data grid`);
		for (let e of r.childNodes) n.appendChild(e.cloneNode(!0));
		for (let e of r.classList) n.classList.add(e);
		n.title = r.title, r.hasAttribute("aria-label") && this.setCellAccessibleName(r.getAttribute("aria-label") || "", n, e);
		let i = r.getAttribute("style");
		return i !== null && n.setAttribute("style", i), n;
	}
	static remove(t) {
		e.#e.delete(t.#t), t.remove();
	}
	deselect() {
		super.deselect(), this.isCreationNode && this.#n.dispatchEvent(new CustomEvent("create", { detail: this.data }));
	}
};
customElements.define("devtools-data-grid", be);
function $(e, t) {
	return e.hasAttribute(t) && e.getAttribute(t) !== "false";
}
var xe = { token: "DataGridInternalToken" }, Se = re(class extends fe {
	#e;
	constructor(e) {
		if (e.type !== l.CHILD) throw Error("ifExpanded directive must be used in a child node");
		super(e), this.#e = e;
	}
	render(e) {
		return this.#t(this.#e.startNode) ? e : oe;
	}
	#t(e) {
		if (!e || (e instanceof HTMLElement || (e = e.parentNode), !(e instanceof HTMLElement))) return !1;
		let t = Q.get(e.closest("tr") ?? void 0);
		return t ? t.expanded : !1;
	}
}), Ce = /* @__PURE__ */ e({
	DataGrid: () => pe,
	ShowMoreDataGridNode: () => _e,
	SortableDataGrid: () => ge,
	ViewportDataGrid: () => me,
	ifExpanded: () => Se
});
//#endregion
export { G as a, F as c, L as d, B as f, J as i, V as l, Z as n, W as o, q as r, R as s, Ce as t, I as u };
