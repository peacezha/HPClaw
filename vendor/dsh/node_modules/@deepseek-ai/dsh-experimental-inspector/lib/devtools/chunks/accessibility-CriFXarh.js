import { n as e } from "./rolldown-runtime-DF993M8W.js";
import { B as t, D as n, H as r, K as i, U as a } from "./common-DMSVbaSb.js";
import { Bd as o, Fo as s, L as c, No as l, Po as u, Ur as d, Zc as ee, Zo as f, aa as te, al as p, bc as ne, dn as re, ei as ie, el as m, fa as h, fo as ae, i as oe, ii as se, jd as g, jr as ce, n as le, na as ue, nl as _, no as v, o as de, ol as y, xc as fe, xn as b } from "./legacy-dM_vujv7.js";
import "./platform-D4TUCh2P.js";
import { F as pe } from "./StringUtilities-CMDxNrEc.js";
import { c as me } from "./common-Bs7hSOUj.js";
import { t as x } from "./i18n-CTSaUtZW.js";
import { t as he } from "./objectValue.css-JafYDKlR.js";
//#region \0dsh-devtools:css:/home/runner/work/deepseek-harness/deepseek-harness/node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/accessibility/accessibilityNode.css.mjs
var S = "/*\n * Copyright 2017 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.widget.ax-subpane {\n  overflow-x: hidden;\n  user-select: text;\n}\n\n.ax-ignored-info {\n  padding: 6px;\n}\n\n.ax-ignored-node-pane {\n  flex: none;\n}\n\n.invalid {\n  text-decoration: line-through;\n}\n\nspan.ax-value-undefined {\n  font-style: italic;\n}\n\n.ax-value-source-unused {\n  opacity: 70%;\n}\n\n.ax-value-source-superseded,\n.ax-value-source-invalid {\n  text-decoration: line-through;\n}\n\n.tree-outline dt-icon-label {\n  position: relative;\n  left: -11px;\n}\n\n.tree-outline li {\n  display: block;\n  overflow-x: hidden;\n  align-items: baseline;\n}\n\n.tree-outline li::before {\n  content: \"\";\n  width: 14px;\n  display: inline-block;\n  margin-bottom: -2px;\n  margin-right: 3px;\n}\n\n.tree-outline li.property {\n  color: var(--sys-color-on-surface);\n}\n\n.tree-outline li.invalid {\n  position: relative;\n  left: -2px;\n}\n\n.tree-outline dt-icon-label + .ax-name {\n  margin-left: -11px;\n}\n\n.tree-outline li span {\n  flex-shrink: 0;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n@media (forced-colors: active) {\n  .ax-value-source-unused {\n    opacity: 100%;\n  }\n\n  .tree-outline-disclosure:hover li.parent::before {\n    background-color: ButtonText;\n  }\n}\n", ge = /* @__PURE__ */ e({
	AXAttributes: () => T,
	AXNativeSourceTypes: () => D,
	AXSourceTypes: () => E
}), C = {
	disabled: "Disabled",
	ifTrueThisElementCurrentlyCannot: "If true, this element currently cannot be interacted with.",
	invalidUserEntry: "Invalid user entry",
	ifTrueThisElementsUserentered: "If true, this element's user-entered value does not conform to validation requirement.",
	editable: "Editable",
	ifAndHowThisElementCanBeEdited: "If and how this element can be edited.",
	focusable: "Focusable",
	ifTrueThisElementCanReceiveFocus: "If true, this element can receive focus.",
	focused: "Focused",
	ifTrueThisElementCurrentlyHas: "If `true`, this element currently has focus.",
	canSetValue: "Can set value",
	whetherTheValueOfThisElementCan: "Whether the value of this element can be set.",
	liveRegion: "Live region",
	whetherAndWhatPriorityOfLive: "Whether and what priority of live updates may be expected for this element.",
	atomicLiveRegions: "Atomic (live regions)",
	ifThisElementMayReceiveLive: "If this element may receive live updates, whether the entire live region should be presented to the user on changes, or only changed nodes.",
	relevantLiveRegions: "Relevant (live regions)",
	ifThisElementMayReceiveLiveUpdates: "If this element may receive live updates, what type of updates should trigger a notification.",
	busyLiveRegions: "`Busy` (live regions)",
	whetherThisElementOrItsSubtree: "Whether this element or its subtree are currently being updated (and thus may be in an inconsistent state).",
	liveRegionRoot: "Live region root",
	ifThisElementMayReceiveLiveUpdatesThe: "If this element may receive live updates, the root element of the containing live region.",
	hasAutocomplete: "Has autocomplete",
	whetherAndWhatTypeOfAutocomplete: "Whether and what type of autocomplete suggestions are currently provided by this element.",
	hasPopup: "Has popup",
	whetherThisElementHasCausedSome: "Whether this element has caused some kind of pop-up (such as a menu) to appear.",
	level: "Level",
	theHierarchicalLevelOfThis: "The hierarchical level of this element.",
	multiselectable: "Multi-selectable",
	whetherAUserMaySelectMoreThanOne: "Whether a user may select more than one option from this widget.",
	orientation: "Orientation",
	whetherThisLinearElements: "Whether this linear element's orientation is horizontal or vertical.",
	multiline: "Multi-line",
	whetherThisTextBoxMayHaveMore: "Whether this text box may have more than one line.",
	readonlyString: "Read-only",
	ifTrueThisElementMayBeInteracted: "If true, this element may be interacted with, but its value cannot be changed.",
	requiredString: "Required",
	whetherThisElementIsARequired: "Whether this element is a required field in a form.",
	minimumValue: "Minimum value",
	forARangeWidgetTheMinimumAllowed: "For a range widget, the minimum allowed value.",
	maximumValue: "Maximum value",
	forARangeWidgetTheMaximumAllowed: "For a range widget, the maximum allowed value.",
	valueDescription: "Value description",
	aHumanreadableVersionOfTheValue: "A human-readable version of the value of a range widget (where necessary).",
	checked: "Checked",
	whetherThisCheckboxRadioButtonOr: "Whether this checkbox, radio button or tree item is checked, unchecked, or mixed (e.g. has both checked and un-checked children).",
	expanded: "Expanded",
	whetherThisElementOrAnother: "Whether this element, or another grouping element it controls, is expanded.",
	pressed: "Pressed",
	whetherThisToggleButtonIs: "Whether this toggle button is currently in a pressed state.",
	selectedString: "Selected",
	whetherTheOptionRepresentedBy: "Whether the option represented by this element is currently selected.",
	activeDescendant: "Active descendant",
	theDescendantOfThisElementWhich: "The descendant of this element which is active; i.e. the element to which focus should be delegated.",
	elementToWhichTheUserMayChooseTo: "Element to which the user may choose to navigate after this one, instead of the next element in the DOM order.",
	controls: "Controls",
	elementOrElementsWhoseContentOr: "Element or elements whose content or presence is/are controlled by this widget.",
	describedBy: "Described by",
	elementOrElementsWhichFormThe: "Element or elements which form the description of this element.",
	labeledBy: "Labeled by",
	elementOrElementsWhichMayFormThe: "Element or elements which may form the name of this element.",
	elementOrElementsWhichShouldBe: "Element or elements which should be considered descendants of this element, despite not being descendants in the DOM.",
	theComputedNameOfThisElement: "The computed name of this element.",
	role: "Role",
	indicatesThePurposeOfThisElement: "Indicates the purpose of this element, such as a user interface idiom for a widget, or structural role within a document.",
	value: "Value",
	theValueOfThisElementThisMayBe: "The value of this element; this may be user-provided or developer-provided, depending on the element.",
	help: "Help",
	theComputedHelpTextForThis: "The computed help text for this element.",
	description: "Description",
	theAccessibleDescriptionForThis: "The accessible description for this element.",
	fromAttribute: "From attribute",
	valueFromAttribute: "Value from attribute.",
	implicit: "Implicit",
	implicitValue: "Implicit value.",
	fromStyle: "From style",
	valueFromStyle: "Value from style.",
	contents: "Contents",
	valueFromElementContents: "Value from element contents.",
	fromPlaceholderAttribute: "From placeholder attribute",
	valueFromPlaceholderAttribute: "Value from placeholder attribute.",
	relatedElement: "Related element",
	valueFromRelatedElement: "Value from related element.",
	fromCaption: "From `caption`",
	valueFromFigcaptionElement: "Value from `figcaption` element.",
	fromDescription: "From `description`",
	valueFromDescriptionElement: "Value from `description` element.",
	fromLabel: "From `label`",
	valueFromLabelElement: "Value from `label` element.",
	fromLabelFor: "From `label` (`for=` attribute)",
	valueFromLabelElementWithFor: "Value from `label` element with `for=` attribute.",
	fromLabelWrapped: "From `label` (wrapped)",
	valueFromLabelElementWrapped: "Value from a wrapping `label` element.",
	fromLegend: "From `legend`",
	valueFromLegendElement: "Value from `legend` element.",
	fromRubyAnnotation: "From ruby annotation",
	valueFromNativeHtmlRuby: "Value from plain HTML ruby annotation.",
	valueFromTableCaption: "Value from `table` `caption`.",
	fromTitle: "From title",
	valueFromTitleAttribute: "Value from title attribute.",
	fromNativeHtml: "From native HTML",
	valueFromNativeHtmlUnknownSource: "Value from native HTML (unknown source)."
}, _e = i("panels/accessibility/AccessibilityStrings.ts", C), w = t.bind(void 0, _e), T = {
	disabled: {
		name: w(C.disabled),
		description: w(C.ifTrueThisElementCurrentlyCannot),
		group: "AXGlobalStates"
	},
	invalid: {
		name: w(C.invalidUserEntry),
		description: w(C.ifTrueThisElementsUserentered),
		group: "AXGlobalStates"
	},
	editable: {
		name: w(C.editable),
		description: w(C.ifAndHowThisElementCanBeEdited)
	},
	focusable: {
		name: w(C.focusable),
		description: w(C.ifTrueThisElementCanReceiveFocus)
	},
	focused: {
		name: w(C.focused),
		description: w(C.ifTrueThisElementCurrentlyHas)
	},
	settable: {
		name: w(C.canSetValue),
		description: w(C.whetherTheValueOfThisElementCan)
	},
	live: {
		name: w(C.liveRegion),
		description: w(C.whetherAndWhatPriorityOfLive),
		group: "AXLiveRegionAttributes"
	},
	atomic: {
		name: w(C.atomicLiveRegions),
		description: w(C.ifThisElementMayReceiveLive),
		group: "AXLiveRegionAttributes"
	},
	relevant: {
		name: w(C.relevantLiveRegions),
		description: w(C.ifThisElementMayReceiveLiveUpdates),
		group: "AXLiveRegionAttributes"
	},
	busy: {
		name: w(C.busyLiveRegions),
		description: w(C.whetherThisElementOrItsSubtree),
		group: "AXLiveRegionAttributes"
	},
	root: {
		name: w(C.liveRegionRoot),
		description: w(C.ifThisElementMayReceiveLiveUpdatesThe),
		group: "AXLiveRegionAttributes"
	},
	autocomplete: {
		name: w(C.hasAutocomplete),
		description: w(C.whetherAndWhatTypeOfAutocomplete),
		group: "AXWidgetAttributes"
	},
	haspopup: {
		name: w(C.hasPopup),
		description: w(C.whetherThisElementHasCausedSome),
		group: "AXWidgetAttributes"
	},
	level: {
		name: w(C.level),
		description: w(C.theHierarchicalLevelOfThis),
		group: "AXWidgetAttributes"
	},
	multiselectable: {
		name: w(C.multiselectable),
		description: w(C.whetherAUserMaySelectMoreThanOne),
		group: "AXWidgetAttributes"
	},
	orientation: {
		name: w(C.orientation),
		description: w(C.whetherThisLinearElements),
		group: "AXWidgetAttributes"
	},
	multiline: {
		name: w(C.multiline),
		description: w(C.whetherThisTextBoxMayHaveMore),
		group: "AXWidgetAttributes"
	},
	readonly: {
		name: w(C.readonlyString),
		description: w(C.ifTrueThisElementMayBeInteracted),
		group: "AXWidgetAttributes"
	},
	required: {
		name: w(C.requiredString),
		description: w(C.whetherThisElementIsARequired),
		group: "AXWidgetAttributes"
	},
	valuemin: {
		name: w(C.minimumValue),
		description: w(C.forARangeWidgetTheMinimumAllowed),
		group: "AXWidgetAttributes"
	},
	valuemax: {
		name: w(C.maximumValue),
		description: w(C.forARangeWidgetTheMaximumAllowed),
		group: "AXWidgetAttributes"
	},
	valuetext: {
		name: w(C.valueDescription),
		description: w(C.aHumanreadableVersionOfTheValue),
		group: "AXWidgetAttributes"
	},
	checked: {
		name: w(C.checked),
		description: w(C.whetherThisCheckboxRadioButtonOr),
		group: "AXWidgetStates"
	},
	expanded: {
		name: w(C.expanded),
		description: w(C.whetherThisElementOrAnother),
		group: "AXWidgetStates"
	},
	pressed: {
		name: w(C.pressed),
		description: w(C.whetherThisToggleButtonIs),
		group: "AXWidgetStates"
	},
	selected: {
		name: w(C.selectedString),
		description: w(C.whetherTheOptionRepresentedBy),
		group: "AXWidgetStates"
	},
	activedescendant: {
		name: w(C.activeDescendant),
		description: w(C.theDescendantOfThisElementWhich),
		group: "AXRelationshipAttributes"
	},
	flowto: {
		name: a("Flows to"),
		description: w(C.elementToWhichTheUserMayChooseTo),
		group: "AXRelationshipAttributes"
	},
	controls: {
		name: w(C.controls),
		description: w(C.elementOrElementsWhoseContentOr),
		group: "AXRelationshipAttributes"
	},
	describedby: {
		name: w(C.describedBy),
		description: w(C.elementOrElementsWhichFormThe),
		group: "AXRelationshipAttributes"
	},
	labelledby: {
		name: w(C.labeledBy),
		description: w(C.elementOrElementsWhichMayFormThe),
		group: "AXRelationshipAttributes"
	},
	owns: {
		name: a("Owns"),
		description: w(C.elementOrElementsWhichShouldBe),
		group: "AXRelationshipAttributes"
	},
	name: {
		name: a("Name"),
		description: w(C.theComputedNameOfThisElement),
		group: "Default"
	},
	role: {
		name: w(C.role),
		description: w(C.indicatesThePurposeOfThisElement),
		group: "Default"
	},
	value: {
		name: w(C.value),
		description: w(C.theValueOfThisElementThisMayBe),
		group: "Default"
	},
	help: {
		name: w(C.help),
		description: w(C.theComputedHelpTextForThis),
		group: "Default"
	},
	description: {
		name: w(C.description),
		description: w(C.theAccessibleDescriptionForThis),
		group: "Default"
	}
}, E = {
	attribute: {
		name: w(C.fromAttribute),
		description: w(C.valueFromAttribute)
	},
	implicit: {
		name: w(C.implicit),
		description: w(C.implicitValue)
	},
	style: {
		name: w(C.fromStyle),
		description: w(C.valueFromStyle)
	},
	contents: {
		name: w(C.contents),
		description: w(C.valueFromElementContents)
	},
	placeholder: {
		name: w(C.fromPlaceholderAttribute),
		description: w(C.valueFromPlaceholderAttribute)
	},
	relatedElement: {
		name: w(C.relatedElement),
		description: w(C.valueFromRelatedElement)
	}
}, D = {
	description: {
		name: w(C.fromDescription),
		description: w(C.valueFromDescriptionElement)
	},
	figcaption: {
		name: w(C.fromCaption),
		description: w(C.valueFromFigcaptionElement)
	},
	label: {
		name: w(C.fromLabel),
		description: w(C.valueFromLabelElement)
	},
	labelfor: {
		name: w(C.fromLabelFor),
		description: w(C.valueFromLabelElementWithFor)
	},
	labelwrapped: {
		name: w(C.fromLabelWrapped),
		description: w(C.valueFromLabelElementWrapped)
	},
	legend: {
		name: w(C.fromLegend),
		description: w(C.valueFromLegendElement)
	},
	rubyannotation: {
		name: w(C.fromRubyAnnotation),
		description: w(C.valueFromNativeHtmlRuby)
	},
	tablecaption: {
		name: w(C.fromCaption),
		description: w(C.valueFromTableCaption)
	},
	title: {
		name: w(C.fromTitle),
		description: w(C.valueFromTitleAttribute)
	},
	other: {
		name: w(C.fromNativeHtml),
		description: w(C.valueFromNativeHtmlUnknownSource)
	}
}, O = "/*\n * Copyright 2015 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n@scope to (devtools-widget > *) {\n.ax-name {\n  color: var(--sys-color-token-attribute);\n  flex-shrink: 0;\n}\n\n.ax-readable-name {\n  flex-shrink: 0;\n}\n\n.ax-readable-string {\n  font-style: italic;\n}\n\n.ax-value-string {\n  color: var(--sys-color-token-property-special);\n}\n\nspan.ax-internal-role {\n  font-style: italic;\n}\n\n#source-order-warning {\n  padding-bottom: 0;\n  text-align: left;\n}\n\n.source-order-checkbox {\n  margin: 2px 2px 2px 5px;\n}\n\n.info-message-overflow {\n  overflow-x: hidden;\n  white-space: normal;\n}\n}\n", ve = /* @__PURE__ */ e({ AccessibilitySubPane: () => k }), k = class extends le {
	axNode;
	nodeInternal;
	constructor(e) {
		super(e), this.registerRequiredCSS(O), this.axNode = null;
	}
	setAXNode(e) {}
	node() {
		return this.nodeInternal || null;
	}
	setNode(e) {
		this.nodeInternal = e;
	}
	createInfo(e, ...t) {
		let n = new c(e);
		return t.length === 0 && t.push("gray-info-message"), n.element.classList.add(...t, "info-message-overflow"), n;
	}
	createTreeOutline() {
		let e = new de();
		return e.registerRequiredCSS(S, O, he), e.element.classList.add("hidden"), e.setHideOverflow(!0), this.element.appendChild(e.element), e;
	}
}, ye = /* @__PURE__ */ e({
	AXNodeIgnoredReasonTreeElement: () => z,
	AXNodePropertyTreeElement: () => P,
	AXNodePropertyTreePropertyElement: () => be,
	AXNodeSubPane: () => N,
	AXRelatedNodeElement: () => R,
	AXRelatedNodeSourceTreeElement: () => L,
	AXValueSourceTreeElement: () => xe,
	StringProperties: () => I,
	TypeStyles: () => F
}), A = {
	computedProperties: "Computed Properties",
	noAccessibilityNode: "No accessibility node",
	accessibilityNodeNotExposed: "Accessibility node not exposed",
	invalidSource: "Invalid source.",
	notSpecified: "Not specified",
	noNodeWithThisId: "No node with this ID.",
	elementIsHiddenBy: "Element is hidden by active modal dialog:\xA0",
	elementIsHiddenByChildTree: "Element is hidden by child tree:\xA0",
	ancestorChildrenAreAll: "Ancestor's children are all presentational:\xA0",
	elementIsPlaceholder: "Element is {PH1}.",
	placeholderIsPlaceholderOnAncestor: "{PH1} is {PH2} on ancestor:\xA0",
	elementHasEmptyAltText: "Element has empty alt text.",
	noTextContent: "No text content.",
	elementIsInert: "Element is `inert`.",
	elementIsInAnInertSubTree: "Element is in an `inert` subtree from\xA0",
	elementsInheritsPresentational: "Element inherits presentational role from\xA0",
	partOfLabelElement: "Part of label element:\xA0",
	labelFor: "Label for\xA0",
	elementIsNotRendered: "Element is not rendered.",
	elementIsNotVisible: "Element is not visible.",
	elementHasPlaceholder: "Element has {PH1}.",
	elementIsPresentational: "Element is presentational.",
	elementNotInteresting: "Element not interesting for accessibility."
}, j = i("panels/accessibility/AccessibilityNodeView.ts", A), M = r.bind(void 0, j), N = class extends k {
	axNode;
	noNodeInfo;
	ignoredInfo;
	treeOutline;
	ignoredReasonsTree;
	constructor() {
		super({
			title: M(A.computedProperties),
			viewId: "computed-properties",
			jslog: `${v("computed-properties")}`
		}), this.registerRequiredCSS(S), this.axNode = null, this.contentElement.classList.add("ax-subpane"), this.noNodeInfo = this.createInfo(M(A.noAccessibilityNode)), this.ignoredInfo = this.createInfo(M(A.accessibilityNodeNotExposed), "ax-ignored-info", "hidden"), this.treeOutline = this.createTreeOutline(), this.ignoredReasonsTree = this.createTreeOutline(), this.element.classList.add("accessibility-computed"), this.treeOutline.setFocusable(!0);
	}
	setAXNode(e) {
		if (this.axNode === e) return;
		this.axNode = e;
		let t = this.treeOutline;
		t.removeChildren();
		let n = this.ignoredReasonsTree;
		if (n.removeChildren(), !e) {
			t.element.classList.add("hidden"), this.ignoredInfo.element.classList.add("hidden"), n.element.classList.add("hidden"), this.noNodeInfo.element.classList.remove("hidden"), this.element.classList.add("ax-ignored-node-pane");
			return;
		}
		if (e.ignored()) {
			this.noNodeInfo.element.classList.add("hidden"), t.element.classList.add("hidden"), this.element.classList.add("ax-ignored-node-pane"), this.ignoredInfo.element.classList.remove("hidden"), n.element.classList.remove("hidden");
			function r(t) {
				n.appendChild(new z(t, e));
			}
			let i = e.ignoredReasons();
			for (let e of i) r(e);
			n.firstChild() || n.element.classList.add("hidden");
			return;
		}
		this.element.classList.remove("ax-ignored-node-pane"), this.ignoredInfo.element.classList.add("hidden"), n.element.classList.add("hidden"), this.noNodeInfo.element.classList.add("hidden"), t.element.classList.remove("hidden");
		function r(n) {
			t.appendChild(new be(n, e));
		}
		for (let t of e.coreProperties()) r(t);
		let i = e.role();
		i && r({
			name: fe.ROLE,
			value: i
		});
		for (let t of e.properties()) r(t);
		let a = t.firstChild();
		a && a.select(!0, !1);
	}
	setNode(e) {
		super.setNode(e), this.axNode = null;
	}
}, P = class e extends oe {
	axNode;
	constructor(e) {
		super(""), this.axNode = e;
	}
	static createSimpleValueElement(e, t) {
		let n;
		!e || e === o.AXValueType.ValueUndefined || e === o.AXValueType.ComputedString ? n = document.createElement("span") : (n = document.createElement("span"), n.classList.add("monospace"));
		let r;
		return r = e && I.has(e) ? "\"" + t.replace(/\n/g, "↵") + "\"" : String(t), e && e in F && n.classList.add(F[e]), n.setTextContentTruncatedIfNeeded(r || ""), d.install(n, String(t) || ""), n;
	}
	static createExclamationMark(e) {
		let t = re({
			iconName: "warning-filled",
			color: "var(--icon-warning)"
		});
		return d.install(t, e), t;
	}
	appendNameElement(e) {
		let t = document.createElement("span");
		if (e in T) {
			let n = T[e];
			t.textContent = n.name(), d.install(t, n.description()), t.classList.add("ax-readable-name");
		} else t.textContent = e, t.classList.add("ax-name"), t.classList.add("monospace");
		this.listItemElement.appendChild(t);
	}
	appendValueElement(t) {
		if (t.type === o.AXValueType.Idref || t.type === o.AXValueType.Node || t.type === o.AXValueType.IdrefList || t.type === o.AXValueType.NodeList) {
			this.appendRelatedNodeListValueElement(t);
			return;
		}
		if (t.sources) {
			let e = t.sources;
			for (let t = 0; t < e.length; t++) {
				let n = e[t], r = new xe(n, this.axNode);
				this.appendChild(r);
			}
			this.expand();
		}
		let n = e.createSimpleValueElement(t.type, String(t.value));
		this.listItemElement.appendChild(n);
	}
	appendRelatedNode(e, t) {
		let n = new L({ deferredNode: new p(this.axNode.accessibilityModel().target(), e.backendDOMNodeId) }, e);
		this.appendChild(n);
	}
	appendRelatedNodeInline(e) {
		let t = new R({ deferredNode: new p(this.axNode.accessibilityModel().target(), e.backendDOMNodeId) });
		this.listItemElement.appendChild(t.render());
	}
	appendRelatedNodeListValueElement(e) {
		if (e.relatedNodes?.length === 1 && !e.value) {
			this.appendRelatedNodeInline(e.relatedNodes[0]);
			return;
		}
		e.relatedNodes && e.relatedNodes.forEach(this.appendRelatedNode, this), e.relatedNodes && e.relatedNodes.length <= 3 ? this.expand() : this.collapse();
	}
}, F = {
	attribute: "ax-value-string",
	boolean: "object-value-boolean",
	booleanOrUndefined: "object-value-boolean",
	computedString: "ax-readable-string",
	idref: "ax-value-string",
	idrefList: "ax-value-string",
	integer: "object-value-number",
	internalRole: "ax-internal-role",
	number: "ax-value-number",
	role: "ax-role",
	string: "ax-value-string",
	tristate: "object-value-boolean",
	valueUndefined: "ax-value-undefined"
}, I = /* @__PURE__ */ new Set([
	o.AXValueType.String,
	o.AXValueType.ComputedString,
	o.AXValueType.IdrefList,
	o.AXValueType.Idref
]), be = class extends P {
	property;
	toggleOnClick;
	constructor(e, t) {
		super(t), this.property = e, this.toggleOnClick = !0, this.listItemElement.classList.add("property");
	}
	onattach() {
		this.update();
	}
	update() {
		this.listItemElement.removeChildren(), this.appendNameElement(this.property.name), this.listItemElement.createChild("span", "separator").textContent = ":\xA0", this.appendValueElement(this.property.value);
	}
}, xe = class extends P {
	source;
	constructor(e, t) {
		super(t), this.source = e;
	}
	onattach() {
		this.update();
	}
	appendRelatedNodeWithIdref(e, t) {
		let n = new L({
			deferredNode: new p(this.axNode.accessibilityModel().target(), e.backendDOMNodeId),
			idref: t
		}, e);
		this.appendChild(n);
	}
	appendIDRefValueElement(e) {
		if (e.value === null) return;
		let t = e.relatedNodes || [];
		if (e.value === "") {
			for (let e of t) {
				let t = e.idref || "";
				this.appendRelatedNodeWithIdref(e, t);
			}
			return;
		}
		let n = e.value.trim().split(/\s+/);
		for (let e of n) {
			let r = t.find((t) => t.idref === e);
			r ? this.appendRelatedNodeWithIdref(r, e) : n.length === 1 ? this.listItemElement.appendChild(new R({ idref: e }).render()) : this.appendChild(new L({ idref: e }));
		}
	}
	appendRelatedNodeListValueElement(e) {
		let t = e.relatedNodes, n = t ? t.length : 0;
		e.type === o.AXValueType.IdrefList || e.type === o.AXValueType.Idref ? this.appendIDRefValueElement(e) : super.appendRelatedNodeListValueElement(e), n <= 3 ? this.expand() : this.collapse();
	}
	appendSourceNameElement(e) {
		let t = document.createElement("span"), n = e.type;
		switch (n) {
			case o.AXValueSourceType.Attribute:
			case o.AXValueSourceType.Placeholder:
			case o.AXValueSourceType.RelatedElement:
				if (e.nativeSource) {
					let n = e.nativeSource;
					t.textContent = D[n].name(), d.install(t, D[n].description()), t.classList.add("ax-readable-name");
					break;
				}
				t.textContent = e.attribute || null, t.classList.add("ax-name"), t.classList.add("monospace");
				break;
			default: n in E ? (t.textContent = E[n].name(), d.install(t, E[n].description()), t.classList.add("ax-readable-name")) : (console.warn(n, "not in AXSourceTypes"), t.textContent = n);
		}
		this.listItemElement.appendChild(t);
	}
	update() {
		if (this.listItemElement.removeChildren(), this.source.invalid) {
			let e = P.createExclamationMark(M(A.invalidSource));
			this.listItemElement.appendChild(e), this.listItemElement.classList.add("ax-value-source-invalid");
		} else this.source.superseded && this.listItemElement.classList.add("ax-value-source-unused");
		if (this.appendSourceNameElement(this.source), this.listItemElement.createChild("span", "separator").textContent = ":\xA0", this.source.attributeValue) this.appendValueElement(this.source.attributeValue), b(this.listItemElement, "\xA0");
		else if (this.source.nativeSourceValue) this.appendValueElement(this.source.nativeSourceValue), b(this.listItemElement, "\xA0"), this.source.value && this.appendValueElement(this.source.value);
		else if (this.source.value) this.appendValueElement(this.source.value);
		else {
			let e = P.createSimpleValueElement(o.AXValueType.ValueUndefined, M(A.notSpecified));
			this.listItemElement.appendChild(e), this.listItemElement.classList.add("ax-value-source-unused");
		}
		this.source.value && this.source.superseded && this.listItemElement.classList.add("ax-value-source-superseded");
	}
}, L = class extends oe {
	value;
	axRelatedNodeElement;
	constructor(e, t) {
		super(""), this.value = t, this.axRelatedNodeElement = new R(e), this.selectable = !0;
	}
	onattach() {
		this.listItemElement.appendChild(this.axRelatedNodeElement.render()), this.value && this.value.text && this.listItemElement.appendChild(P.createSimpleValueElement(o.AXValueType.ComputedString, this.value.text));
	}
	onenter() {
		return this.axRelatedNodeElement.revealNode(), !0;
	}
}, R = class {
	deferredNode;
	idref;
	constructor(e) {
		this.deferredNode = e.deferredNode, this.idref = e.idref;
	}
	render() {
		let e = document.createElement("span");
		if (this.deferredNode) {
			let t = document.createElement("span");
			e.appendChild(t), this.deferredNode.resolvePromise().then((e) => {
				e && s(me.instance().linkify(e, { preventKeyboardFocus: !0 }), t);
			});
		} else if (this.idref) {
			e.classList.add("invalid");
			let t = P.createExclamationMark(M(A.noNodeWithThisId));
			b(t, this.idref), e.appendChild(t);
		}
		return e;
	}
	revealNode() {
		this.deferredNode && this.deferredNode.resolvePromise().then((e) => n(e));
	}
}, z = class e extends P {
	property;
	toggleOnClick;
	reasonElement;
	constructor(e, t) {
		super(t), this.property = e, this.axNode = t, this.toggleOnClick = !0, this.selectable = !1;
	}
	static createReasonElement(e, t) {
		let n = null;
		switch (e) {
			case "activeModalDialog":
				n = x(j, A.elementIsHiddenBy, {});
				break;
			case "hiddenByChildTree":
				n = x(j, A.elementIsHiddenByChildTree, {});
				break;
			case "ancestorIsLeafNode":
				n = x(j, A.ancestorChildrenAreAll, {});
				break;
			case "ariaHiddenElement": {
				let e = document.createElement("span", { is: "source-code" }).textContent = "aria-hidden";
				n = x(j, A.elementIsPlaceholder, { PH1: e });
				break;
			}
			case "ariaHiddenSubtree": {
				let e = document.createElement("span", { is: "source-code" }).textContent = "aria-hidden", t = document.createElement("span", { is: "source-code" }).textContent = "true";
				n = x(j, A.placeholderIsPlaceholderOnAncestor, {
					PH1: e,
					PH2: t
				});
				break;
			}
			case "emptyAlt":
				n = x(j, A.elementHasEmptyAltText, {});
				break;
			case "emptyText":
				n = x(j, A.noTextContent, {});
				break;
			case "inertElement":
				n = x(j, A.elementIsInert, {});
				break;
			case "inertSubtree":
				n = x(j, A.elementIsInAnInertSubTree, {});
				break;
			case "inheritsPresentation":
				n = x(j, A.elementsInheritsPresentational, {});
				break;
			case "labelContainer":
				n = x(j, A.partOfLabelElement, {});
				break;
			case "labelFor":
				n = x(j, A.labelFor, {});
				break;
			case "notRendered":
				n = x(j, A.elementIsNotRendered, {});
				break;
			case "notVisible":
				n = x(j, A.elementIsNotVisible, {});
				break;
			case "presentationalRole": {
				let e = t?.role()?.value || "", r = document.createElement("span", { is: "source-code" }).textContent = "role=" + e;
				n = x(j, A.elementHasPlaceholder, { PH1: r });
				break;
			}
			case "probablyPresentational":
				n = x(j, A.elementIsPresentational, {});
				break;
			case "uninteresting": n = x(j, A.elementNotInteresting, {});
		}
		return n && n.classList.add("ax-reason"), n;
	}
	onattach() {
		this.listItemElement.removeChildren(), this.reasonElement = e.createReasonElement(this.property.name, this.axNode), this.reasonElement && this.listItemElement.appendChild(this.reasonElement);
		let t = this.property.value;
		t.type === o.AXValueType.Idref && this.appendRelatedNodeListValueElement(t);
	}
}, Se = "/*\n * Copyright 2026 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n.accessibility-toggle-container {\n  padding: 12px 18px;\n  border-bottom: 1px solid var(--sys-color-divider);\n}\n", Ce = {
	attributes: [
		{
			isGlobal: !0,
			name: "aria-actions",
			preventedOnRoles: [
				"caption",
				"code",
				"definition",
				"deletion",
				"emphasis",
				"generic",
				"insertion",
				"mark",
				"paragraph",
				"strong",
				"subscript",
				"suggestion",
				"superscript",
				"term",
				"time"
			],
			type: "IDREF_list"
		},
		{
			name: "aria-activedescendant",
			supportedOnRoles: [
				"application",
				"combobox",
				"composite",
				"grid",
				"group",
				"listbox",
				"menu",
				"menubar",
				"radiogroup",
				"row",
				"searchbox",
				"select",
				"spinbutton",
				"tablist",
				"textbox",
				"toolbar",
				"tree",
				"treegrid"
			],
			type: "IDREF"
		},
		{
			default: "false",
			isGlobal: !0,
			name: "aria-atomic",
			type: "boolean"
		},
		{
			default: "none",
			enum: [
				"inline",
				"list",
				"both",
				"none"
			],
			name: "aria-autocomplete",
			supportedOnRoles: [
				"combobox",
				"searchbox",
				"textbox"
			],
			type: "token"
		},
		{
			isGlobal: !0,
			name: "aria-braillelabel",
			preventedOnRoles: [
				"caption",
				"code",
				"definition",
				"deletion",
				"emphasis",
				"generic",
				"insertion",
				"mark",
				"none",
				"paragraph",
				"strong",
				"subscript",
				"suggestion",
				"superscript",
				"term",
				"time"
			],
			type: "string"
		},
		{
			isGlobal: !0,
			name: "aria-brailleroledescription",
			preventedOnRoles: ["generic"],
			type: "string"
		},
		{
			default: "false",
			isGlobal: !0,
			name: "aria-busy",
			type: "boolean"
		},
		{
			default: "undefined",
			enum: [
				"true",
				"false",
				"mixed",
				"undefined"
			],
			name: "aria-checked",
			supportedOnRoles: [
				"checkbox",
				"menuitemcheckbox",
				"menuitemradio",
				"option",
				"radio",
				"switch",
				"treeitem"
			],
			type: "token"
		},
		{
			name: "aria-colcount",
			supportedOnRoles: [
				"grid",
				"table",
				"treegrid"
			],
			type: "integer"
		},
		{
			name: "aria-colindex",
			supportedOnRoles: [
				"cell",
				"columnheader",
				"gridcell",
				"row",
				"rowheader"
			],
			type: "integer"
		},
		{
			name: "aria-colindextext",
			supportedOnRoles: [
				"cell",
				"columnheader",
				"gridcell",
				"rowheader"
			],
			type: "string"
		},
		{
			name: "aria-colspan",
			supportedOnRoles: [
				"cell",
				"columnheader",
				"rowheader"
			],
			type: "integer"
		},
		{
			isGlobal: !0,
			name: "aria-controls",
			type: "IDREF_list"
		},
		{
			default: "false",
			enum: [
				"page",
				"step",
				"location",
				"date",
				"time",
				"true",
				"false"
			],
			isGlobal: !0,
			name: "aria-current",
			type: "token"
		},
		{
			isGlobal: !0,
			name: "aria-describedby",
			type: "IDREF_list"
		},
		{
			isGlobal: !0,
			name: "aria-description",
			type: "string"
		},
		{
			isGlobal: !0,
			name: "aria-details",
			type: "IDREF"
		},
		{
			default: "false",
			name: "aria-disabled",
			supportedOnRoles: /* @__PURE__ */ "application.button.checkbox.columnheader.combobox.composite.grid.gridcell.group.input.link.listbox.menu.menubar.menuitem.menuitemcheckbox.menuitemradio.option.radio.radiogroup.row.rowheader.scrollbar.searchbox.select.separator.slider.spinbutton.switch.tab.tablist.textbox.toolbar.tree.treegrid.treeitem".split("."),
			type: "boolean"
		},
		{
			name: "aria-errormessage",
			supportedOnRoles: [
				"application",
				"checkbox",
				"columnheader",
				"combobox",
				"gridcell",
				"listbox",
				"radiogroup",
				"rowheader",
				"searchbox",
				"slider",
				"spinbutton",
				"switch",
				"textbox",
				"tree",
				"treegrid"
			],
			type: "IDREF"
		},
		{
			default: "undefined",
			enum: [
				"true",
				"false",
				"undefined"
			],
			name: "aria-expanded",
			supportedOnRoles: [
				"application",
				"button",
				"checkbox",
				"columnheader",
				"combobox",
				"gridcell",
				"link",
				"menuitem",
				"menuitemcheckbox",
				"menuitemradio",
				"row",
				"rowheader",
				"switch",
				"tab",
				"treeitem"
			],
			type: "token"
		},
		{
			isGlobal: !0,
			name: "aria-flowto",
			type: "IDREF_list"
		},
		{
			default: "false",
			enum: [
				"false",
				"true",
				"menu",
				"listbox",
				"tree",
				"grid",
				"dialog"
			],
			name: "aria-haspopup",
			supportedOnRoles: [
				"application",
				"button",
				"columnheader",
				"combobox",
				"gridcell",
				"link",
				"menuitem",
				"menuitemcheckbox",
				"menuitemradio",
				"rowheader",
				"searchbox",
				"slider",
				"tab",
				"textbox",
				"treeitem"
			],
			type: "token"
		},
		{
			default: "undefined",
			enum: [
				"true",
				"false",
				"undefined"
			],
			isGlobal: !0,
			name: "aria-hidden",
			type: "token"
		},
		{
			default: "false",
			enum: [
				"grammar",
				"false",
				"spelling",
				"true"
			],
			name: "aria-invalid",
			supportedOnRoles: [
				"application",
				"checkbox",
				"columnheader",
				"combobox",
				"gridcell",
				"listbox",
				"radiogroup",
				"rowheader",
				"searchbox",
				"slider",
				"spinbutton",
				"switch",
				"textbox",
				"tree",
				"treegrid"
			],
			type: "token"
		},
		{
			isGlobal: !0,
			name: "aria-keyshortcuts",
			type: "string"
		},
		{
			isGlobal: !0,
			name: "aria-label",
			preventedOnRoles: [
				"caption",
				"code",
				"definition",
				"deletion",
				"emphasis",
				"generic",
				"insertion",
				"mark",
				"none",
				"paragraph",
				"strong",
				"subscript",
				"suggestion",
				"superscript",
				"term",
				"time"
			],
			type: "string"
		},
		{
			isGlobal: !0,
			name: "aria-labelledby",
			preventedOnRoles: [
				"caption",
				"code",
				"definition",
				"deletion",
				"emphasis",
				"generic",
				"insertion",
				"mark",
				"none",
				"paragraph",
				"strong",
				"subscript",
				"suggestion",
				"superscript",
				"term",
				"time"
			],
			type: "IDREF_list"
		},
		{
			isGlobal: !0,
			name: "aria-labeledby",
			preventedOnRoles: [
				"caption",
				"code",
				"definition",
				"deletion",
				"emphasis",
				"generic",
				"insertion",
				"mark",
				"none",
				"paragraph",
				"strong",
				"subscript",
				"suggestion",
				"superscript",
				"term",
				"time"
			],
			type: "IDREF_list"
		},
		{
			name: "aria-level",
			supportedOnRoles: [
				"comment",
				"heading",
				"row",
				"treeitem"
			],
			type: "integer"
		},
		{
			default: "undefined",
			enum: [
				"off",
				"polite",
				"assertive",
				"undefined"
			],
			isGlobal: !0,
			name: "aria-live",
			type: "token"
		},
		{
			default: "false",
			name: "aria-modal",
			supportedOnRoles: ["alertdialog", "dialog"],
			type: "boolean"
		},
		{
			default: "false",
			name: "aria-multiline",
			supportedOnRoles: ["searchbox", "textbox"],
			type: "boolean"
		},
		{
			default: "false",
			name: "aria-multiselectable",
			supportedOnRoles: [
				"grid",
				"listbox",
				"tablist",
				"tree",
				"treegrid"
			],
			type: "boolean"
		},
		{
			default: "undefined",
			enum: [
				"horizontal",
				"undefined",
				"vertical"
			],
			name: "aria-orientation",
			supportedOnRoles: [
				"listbox",
				"menu",
				"menubar",
				"radiogroup",
				"scrollbar",
				"select",
				"separator",
				"slider",
				"tablist",
				"toolbar",
				"tree",
				"treegrid"
			],
			type: "token"
		},
		{
			isGlobal: !0,
			name: "aria-owns",
			type: "IDREF_list"
		},
		{
			name: "aria-placeholder",
			supportedOnRoles: ["searchbox", "textbox"],
			type: "string"
		},
		{
			name: "aria-posinset",
			supportedOnRoles: [
				"article",
				"comment",
				"listitem",
				"menuitem",
				"menuitemcheckbox",
				"menuitemradio",
				"option",
				"radio",
				"row",
				"tab",
				"treeitem"
			],
			type: "integer"
		},
		{
			default: "undefined",
			enum: [
				"true",
				"false",
				"mixed",
				"undefined"
			],
			name: "aria-pressed",
			supportedOnRoles: ["button"],
			type: "token"
		},
		{
			default: "false",
			name: "aria-readonly",
			supportedOnRoles: [
				"checkbox",
				"columnheader",
				"combobox",
				"grid",
				"gridcell",
				"listbox",
				"radiogroup",
				"rowheader",
				"searchbox",
				"slider",
				"spinbutton",
				"switch",
				"textbox",
				"treegrid"
			],
			type: "boolean"
		},
		{
			default: "additions text",
			enum: [
				"additions",
				"removals",
				"text",
				"all"
			],
			isGlobal: !0,
			name: "aria-relevant",
			type: "token_list"
		},
		{
			default: "false",
			name: "aria-required",
			supportedOnRoles: [
				"checkbox",
				"columnheader",
				"combobox",
				"gridcell",
				"listbox",
				"radiogroup",
				"rowheader",
				"searchbox",
				"spinbutton",
				"switch",
				"textbox",
				"tree",
				"treegrid"
			],
			type: "boolean"
		},
		{
			isGlobal: !0,
			name: "aria-roledescription",
			preventedOnRoles: ["generic"],
			type: "string"
		},
		{
			name: "aria-rowcount",
			supportedOnRoles: [
				"grid",
				"table",
				"treegrid"
			],
			type: "integer"
		},
		{
			name: "aria-rowindex",
			supportedOnRoles: [
				"cell",
				"columnheader",
				"gridcell",
				"row",
				"rowheader"
			],
			type: "integer"
		},
		{
			name: "aria-rowindextext",
			supportedOnRoles: [
				"cell",
				"columnheader",
				"gridcell",
				"row",
				"rowheader"
			],
			type: "string"
		},
		{
			name: "aria-rowspan",
			supportedOnRoles: [
				"cell",
				"columnheader",
				"rowheader"
			],
			type: "integer"
		},
		{
			default: "undefined",
			enum: [
				"true",
				"false",
				"undefined"
			],
			name: "aria-selected",
			supportedOnRoles: [
				"columnheader",
				"gridcell",
				"option",
				"row",
				"rowheader",
				"tab",
				"treeitem"
			],
			type: "token"
		},
		{
			name: "aria-setsize",
			supportedOnRoles: [
				"article",
				"comment",
				"listitem",
				"menuitem",
				"menuitemcheckbox",
				"menuitemradio",
				"option",
				"radio",
				"row",
				"tab",
				"treeitem"
			],
			type: "integer"
		},
		{
			default: "none",
			enum: [
				"ascending",
				"descending",
				"none",
				"other"
			],
			name: "aria-sort",
			supportedOnRoles: ["columnheader", "rowheader"],
			type: "token"
		},
		{
			name: "aria-valuemax",
			supportedOnRoles: [
				"meter",
				"progressbar",
				"scrollbar",
				"separator",
				"slider",
				"spinbutton"
			],
			type: "decimal"
		},
		{
			name: "aria-valuemin",
			supportedOnRoles: [
				"meter",
				"progressbar",
				"scrollbar",
				"separator",
				"slider",
				"spinbutton"
			],
			type: "decimal"
		},
		{
			name: "aria-valuenow",
			supportedOnRoles: [
				"meter",
				"progressbar",
				"scrollbar",
				"separator",
				"slider",
				"spinbutton"
			],
			type: "decimal"
		},
		{
			name: "aria-valuetext",
			supportedOnRoles: [
				"meter",
				"progressbar",
				"scrollbar",
				"separator",
				"slider",
				"spinbutton"
			],
			type: "string"
		},
		{
			name: "aria-virtualcontent",
			type: "string"
		}
	],
	metadata: {
		attrsNullNamespace: !0,
		export: "CORE_EXPORT",
		namespace: "HTML",
		namespacePrefix: "xhtml",
		namespaceURI: "http://www.w3.org/1999/xhtml"
	},
	roles: [
		{
			implicitValues: {
				"aria-atomic": "true",
				"aria-live": "assertive"
			},
			name: "alert",
			nameFrom: ["author"],
			superclasses: ["section"]
		},
		{
			internalRoles: ["kAlertDialog"],
			name: "alertdialog",
			nameFrom: ["author"],
			nameRequired: !0,
			superclasses: ["alert", "dialog"]
		},
		{
			name: "application",
			nameFrom: ["author"],
			nameRequired: !0,
			superclasses: ["structure"]
		},
		{
			name: "article",
			nameFrom: ["author"],
			superclasses: ["document"]
		},
		{
			internalRoles: ["kBanner", "kHeader"],
			name: "banner",
			nameFrom: ["author"],
			superclasses: ["landmark"]
		},
		{
			name: "blockquote",
			nameFrom: ["author"],
			superclasses: ["section"]
		},
		{
			childrenPresentational: !0,
			internalRoles: [
				"kButton",
				"kToggleButton",
				"kPopUpButton"
			],
			name: "button",
			nameFrom: ["contents", "author"],
			nameRequired: !0,
			superclasses: ["command"]
		},
		{
			name: "caption",
			nameFrom: ["prohibited"],
			superclasses: ["structure"]
		},
		{
			name: "cell",
			nameFrom: ["contents", "author"],
			scope: "row",
			superclasses: ["section"]
		},
		{
			implicitValues: { "aria-checked": !1 },
			internalRoles: ["kCheckBox"],
			name: "checkbox",
			nameFrom: ["contents", "author"],
			nameRequired: !0,
			requiredAttributes: ["aria-checked"],
			superclasses: ["input"]
		},
		{
			name: "code",
			nameFrom: ["prohibited"],
			superclasses: ["structure"]
		},
		{
			internalRoles: ["kColumnHeader"],
			name: "columnheader",
			nameFrom: ["contents", "author"],
			nameRequired: !0,
			scope: ["row"],
			superclasses: [
				"gridcell",
				"sectionhead",
				"widget"
			]
		},
		{
			implicitValues: {
				"aria-expanded": "false",
				"aria-haspopup": "listbox"
			},
			internalRoles: [
				"kComboBoxGrouping",
				"kComboBoxMenuButton",
				"kComboBoxSelect",
				"kTextFieldWithComboBox"
			],
			mustContain: ["textbox"],
			name: "combobox",
			nameFrom: ["author"],
			nameRequired: !0,
			requiredAttributes: ["aria-controls", "aria-expanded"],
			superclasses: ["select"]
		},
		{
			name: "comment",
			nameFrom: ["author"],
			superclasses: ["structure"]
		},
		{
			abstract: !0,
			name: "command",
			nameFrom: ["author"],
			superclasses: ["widget"]
		},
		{
			name: "complementary",
			nameFrom: ["author"],
			superclasses: ["landmark"]
		},
		{
			abstract: !0,
			name: "composite",
			nameFrom: ["author"],
			superclasses: ["widget"]
		},
		{
			internalRoles: ["kContentInfo", "kFooter"],
			name: "contentinfo",
			nameFrom: ["author"],
			superclasses: ["landmark"]
		},
		{
			name: "definition",
			nameFrom: ["prohibited"],
			superclasses: ["section"]
		},
		{
			internalRoles: ["kContentDeletion"],
			name: "deletion",
			nameFrom: ["prohibited"],
			superclasses: ["structure"]
		},
		{
			name: "dialog",
			nameFrom: ["author"],
			nameRequired: !0,
			superclasses: ["window"]
		},
		{
			deprecated: !0,
			internalRoles: ["kList"],
			name: "directory",
			nameFrom: ["author"],
			superclasses: ["list"]
		},
		{
			name: "document",
			nameFrom: ["author"],
			nameRequired: !1,
			superclasses: ["structure"]
		},
		{
			name: "emphasis",
			nameFrom: ["prohibited"],
			superclasses: ["structure"]
		},
		{
			mustContain: ["article"],
			name: "feed",
			nameFrom: ["author"],
			nameRequired: !1,
			superclasses: ["list"]
		},
		{
			name: "figure",
			nameFrom: ["author"],
			nameRequired: !1,
			superclasses: ["section"]
		},
		{
			name: "form",
			nameFrom: ["author"],
			nameRequired: !0,
			superclasses: ["landmark"]
		},
		{
			internalRoles: ["kGenericContainer", "kSectionWithoutName"],
			name: "generic",
			nameFrom: ["prohibited"],
			superclasses: ["structure"]
		},
		{
			mustContain: ["row"],
			name: "grid",
			nameFrom: ["author"],
			nameRequired: !0,
			superclasses: ["composite", "table"]
		},
		{
			internalRoles: ["kGridCell"],
			name: "gridcell",
			nameFrom: ["contents", "author"],
			nameRequired: !0,
			scope: ["row"],
			superclasses: ["cell", "widget"]
		},
		{
			internalRoles: ["kGroup", "kDetails"],
			name: "group",
			nameFrom: ["author"],
			superclasses: ["section"]
		},
		{
			implicitValues: { "aria-level": "2" },
			name: "heading",
			nameFrom: ["contents", "author"],
			nameRequired: !0,
			superclasses: ["sectionhead"]
		},
		{
			internalRoles: ["kImage"],
			name: "image",
			nameFrom: ["author"],
			superclasses: ["structure"]
		},
		{
			childrenPresentational: !0,
			deprecated: !0,
			internalRoles: ["kImage"],
			name: "img",
			nameFrom: ["author"],
			nameRequired: !0,
			superclasses: ["section"]
		},
		{
			internalRoles: ["kContentInsertion"],
			name: "insertion",
			nameFrom: ["prohibited"],
			superclasses: ["structure"]
		},
		{
			abstract: !0,
			name: "input",
			nameFrom: ["author"],
			superclasses: ["widget"]
		},
		{
			abstract: !0,
			name: "landmark",
			nameFrom: ["author"],
			nameRequired: !1,
			superclasses: ["section"]
		},
		{
			name: "link",
			nameFrom: ["contents", "author"],
			nameRequired: !0,
			superclasses: ["command"]
		},
		{
			implicitValues: { "aria-orientation": "vertical" },
			internalRoles: ["kList"],
			mustContain: ["listitem"],
			name: "list",
			nameFrom: ["author"],
			superclasses: ["section"]
		},
		{
			implicitValues: { "aria-orientation": "vertical" },
			internalRoles: ["kListBox"],
			mustContain: ["option"],
			name: "listbox",
			nameFrom: ["author"],
			nameRequired: !0,
			superclasses: ["select"]
		},
		{
			internalRoles: ["kListItem"],
			name: "listitem",
			nameFrom: ["author"],
			scope: ["group", "list"],
			superclasses: ["section"]
		},
		{
			implicitValues: { "aria-live": "polite" },
			name: "log",
			nameFrom: ["author"],
			nameRequired: !0,
			superclasses: ["section"]
		},
		{
			name: "main",
			nameFrom: ["author"],
			superclasses: ["landmark"]
		},
		{
			name: "mark",
			nameFrom: ["prohibited"],
			superclasses: ["structure"]
		},
		{
			name: "marquee",
			nameFrom: ["author"],
			nameRequired: !0,
			superclasses: ["section"]
		},
		{
			childrenPresentational: !0,
			name: "math",
			nameFrom: ["author"],
			nameRequired: !0,
			superclasses: ["section"]
		},
		{
			implicitValues: { "aria-orientation": "vertical" },
			mustContain: [
				"group",
				"menuitemradio",
				"menuitem",
				"menuitemcheckbox",
				"menuitemradio"
			],
			name: "menu",
			nameFrom: ["author"],
			superclasses: ["select"]
		},
		{
			implicitValues: { "aria-orientation": "horizontal" },
			internalRoles: ["kMenuBar"],
			mustContain: [
				"menuitem",
				"menuitemradio",
				"menuitemcheckbox"
			],
			name: "menubar",
			nameFrom: ["author"],
			superclasses: ["menu"]
		},
		{
			internalRoles: ["kMenuItem"],
			name: "menuitem",
			nameFrom: ["contents", "author"],
			nameRequired: !0,
			scope: [
				"group",
				"menu",
				"menubar"
			],
			superclasses: ["command"]
		},
		{
			childrenPresentational: !0,
			implicitValues: { "aria-checked": !1 },
			internalRoles: ["kMenuItemCheckBox"],
			name: "menuitemcheckbox",
			nameFrom: ["contents", "author"],
			nameRequired: !0,
			scope: ["menu", "menubar"],
			superclasses: ["checkbox", "menuitem"]
		},
		{
			childrenPresentational: !0,
			implicitValues: { "aria-checked": !1 },
			internalRoles: ["kMenuItemRadio"],
			name: "menuitemradio",
			nameFrom: ["contents", "author"],
			nameRequired: !0,
			scope: [
				"menu",
				"menubar",
				"group"
			],
			superclasses: ["menuitemcheckbox", "radio"]
		},
		{
			implicitValues: {
				"aria-valuemax": "100",
				"aria-valuemin": "0"
			},
			name: "meter",
			nameFrom: ["author"],
			nameRequired: !0,
			superclasses: ["structure"]
		},
		{
			name: "navigation",
			nameFrom: ["author"],
			superclasses: ["landmark"]
		},
		{
			internalRoles: ["kNone"],
			name: "none",
			nameFrom: ["prohibited"],
			superclasses: ["structure"]
		},
		{
			name: "note",
			nameFrom: ["author"],
			superclasses: ["section"]
		},
		{
			childrenPresentational: !0,
			implicitValues: { "aria-selected": "false" },
			internalRoles: ["kListBoxOption", "kMenuListOption"],
			name: "option",
			nameFrom: ["contents", "author"],
			nameRequired: !0,
			requiredAttributes: ["aria-selected"],
			scope: ["listbox"],
			superclasses: ["input"]
		},
		{
			name: "paragraph",
			nameFrom: ["prohibited"],
			superclasses: ["structure"]
		},
		{
			deprecated: !0,
			internalRoles: ["kNone"],
			name: "presentation",
			superclasses: ["structure"]
		},
		{
			childrenPresentational: !0,
			implicitValues: {
				"aria-valuemax": "100",
				"aria-valuemin": "0"
			},
			internalRoles: ["kProgressIndicator"],
			name: "progressbar",
			nameFrom: ["author"],
			nameRequired: !0,
			superclasses: ["range"]
		},
		{
			childrenPresentational: !0,
			implicitValues: { "aria-checked": "false" },
			internalRoles: ["kRadioButton"],
			name: "radio",
			nameFrom: ["contents", "author"],
			nameRequired: !0,
			requiredAttributes: ["aria-checked"],
			superclasses: ["input"]
		},
		{
			internalRoles: ["kRadioGroup"],
			mustContain: ["radio"],
			name: "radiogroup",
			nameFrom: ["author"],
			nameRequired: !0,
			superclasses: ["select"]
		},
		{
			abstract: !0,
			name: "range",
			nameFrom: ["author"],
			superclasses: ["widget"]
		},
		{
			name: "region",
			nameFrom: ["author"],
			nameRequired: !0,
			superclasses: ["landmark"]
		},
		{
			abstract: !0,
			name: "roletype"
		},
		{
			mustContain: [
				"cell",
				"columnheader",
				"gridcell",
				"rowheader"
			],
			name: "row",
			nameFrom: ["contents", "author"],
			scope: [
				"grid",
				"rowgroup",
				"table",
				"treegrid"
			],
			superclasses: ["group", "widget"]
		},
		{
			internalRoles: ["kRowGroup"],
			mustContain: ["row"],
			name: "rowgroup",
			nameFrom: ["author"],
			scope: [
				"grid",
				"table",
				"treegrid"
			],
			superclasses: ["structure"]
		},
		{
			internalRoles: ["kRowHeader"],
			name: "rowheader",
			nameFrom: ["contents", "author"],
			nameRequired: !0,
			scope: ["row"],
			superclasses: [
				"cell",
				"gridcell",
				"sectionhead"
			]
		},
		{
			childrenPresentational: !0,
			implicitValues: {
				"aria-orientation": "vertical",
				"aria-valuemax": "100",
				"aria-valuemin": "0"
			},
			internalRoles: ["kScrollBar"],
			name: "scrollbar",
			nameFrom: ["author"],
			nameRequired: !1,
			requiredAttributes: [
				"aria-controls",
				"aria-orientation",
				"aria-valuemax",
				"aria-valuemin",
				"aria-valuenow"
			],
			superclasses: ["range"]
		},
		{
			name: "search",
			nameFrom: ["author"],
			superclasses: ["landmark"]
		},
		{
			internalRoles: ["kSearchBox"],
			name: "searchbox",
			nameFrom: ["author"],
			nameRequired: !0,
			superclasses: ["textbox"]
		},
		{
			abstract: !0,
			name: "section",
			superclasses: ["structure"]
		},
		{
			abstract: !0,
			name: "sectionhead",
			nameFrom: ["contents", "author"],
			superclasses: ["structure"]
		},
		{
			abstract: !0,
			name: "select",
			nameFrom: ["author"],
			superclasses: ["composite", "group"]
		},
		{
			implicitValues: {
				"aria-orientation": "horizontal",
				"aria-valuemax": "100",
				"aria-valuemin": "0"
			},
			internalRoles: ["kSplitter"],
			name: "separator",
			nameFrom: ["author"],
			superclasses: ["structure"]
		},
		{
			childrenPresentational: !0,
			implicitValues: {
				"aria-orientation": "horizontal",
				"aria-valuemax": "100",
				"aria-valuemin": "0"
			},
			name: "slider",
			nameFrom: ["author"],
			nameRequired: !0,
			requiredAttributes: [
				"aria-valuemax",
				"aria-valuemin",
				"aria-valuenow"
			],
			superclasses: ["input", "range"]
		},
		{
			internalRoles: ["kSpinButton"],
			name: "spinbutton",
			nameFrom: ["author"],
			nameRequired: !0,
			requiredAttributes: [
				"aria-valuemax",
				"aria-valuemin",
				"aria-valuenow"
			],
			superclasses: [
				"composite",
				"input",
				"range"
			]
		},
		{
			implicitValues: {
				"aria-atomic": "true",
				"aria-live": "polite"
			},
			name: "status",
			nameFrom: ["author"],
			superclasses: ["section"]
		},
		{
			name: "strong",
			nameFrom: ["prohibited"],
			superclasses: ["structure"]
		},
		{
			abstract: !0,
			name: "structure",
			superclasses: ["roletype"]
		},
		{
			name: "subscript",
			nameFrom: ["prohibited"],
			superclasses: ["structure"]
		},
		{
			name: "suggestion",
			nameFrom: ["prohibited"],
			superclasses: ["structure"]
		},
		{
			name: "superscript",
			nameFrom: ["prohibited"],
			superclasses: ["structure"]
		},
		{
			childrenPresentational: !0,
			implicitValues: { "aria-checked": "false" },
			name: "switch",
			nameFrom: ["contents", "author"],
			nameRequired: !0,
			requiredAttributes: ["aria-checked"],
			superclasses: ["checkbox"]
		},
		{
			childrenPresentational: !0,
			implicitValues: { "aria-selected": "false" },
			name: "tab",
			nameFrom: ["contents", "author"],
			scope: ["tablist"],
			superclasses: ["sectionhead", "widget"]
		},
		{
			mustContain: ["row"],
			name: "table",
			nameFrom: ["author"],
			nameRequired: !0,
			superclasses: ["section"]
		},
		{
			implicitValues: { "aria-orientation": "horizontal" },
			internalRoles: ["kTabList"],
			mustContain: ["tab"],
			name: "tablist",
			nameFrom: ["author"],
			superclasses: ["composite"]
		},
		{
			internalRoles: ["kTabPanel"],
			name: "tabpanel",
			nameFrom: ["author"],
			nameRequired: !0,
			superclasses: ["section"]
		},
		{
			name: "term",
			nameFrom: ["prohibited"],
			superclasses: ["section"]
		},
		{
			name: "time",
			nameFrom: ["prohibited"],
			superclasses: ["structure"]
		},
		{
			internalRoles: ["kTextField"],
			name: "textbox",
			nameFrom: ["author"],
			nameRequired: !0,
			superclasses: ["input"]
		},
		{
			name: "timer",
			nameFrom: ["author"],
			superclasses: ["status"]
		},
		{
			implicitValues: { "aria-orientation": "horizontal" },
			name: "toolbar",
			nameFrom: ["author"],
			superclasses: ["group"]
		},
		{
			name: "tooltip",
			nameFrom: ["contents", "author"],
			nameRequired: !0,
			superclasses: ["section"]
		},
		{
			implicitValues: { "aria-orientation": "vertical" },
			mustContain: ["group", "treeitem"],
			name: "tree",
			nameFrom: ["author"],
			nameRequired: !0,
			superclasses: ["select"]
		},
		{
			internalRoles: ["kTreeGrid"],
			mustContain: ["row"],
			name: "treegrid",
			nameFrom: ["author"],
			nameRequired: !0,
			superclasses: ["grid", "tree"]
		},
		{
			internalRoles: ["kTreeItem"],
			name: "treeitem",
			nameFrom: ["contents", "author"],
			nameRequired: !0,
			scope: ["group", "tree"],
			superclasses: ["listitem", "option"]
		},
		{
			abstract: !0,
			name: "widget",
			superclasses: ["roletype"]
		},
		{
			abstract: !0,
			name: "window",
			nameFrom: ["author"],
			superclasses: ["roletype"]
		},
		{
			internalRoles: ["kSectionFooter"],
			name: "sectionfooter",
			nameFrom: ["author"],
			superclasses: ["contentinfo"]
		},
		{
			internalRoles: ["kSectionHeader"],
			name: "sectionheader",
			nameFrom: ["author"],
			superclasses: ["banner"]
		},
		{
			internalRoles: ["kDocAbstract"],
			name: "doc-abstract",
			nameFrom: ["author"],
			superclasses: ["section"]
		},
		{
			internalRoles: ["kDocAcknowledgments"],
			name: "doc-acknowledgments",
			nameFrom: ["author"],
			superclasses: ["landmark"]
		},
		{
			internalRoles: ["kDocAfterword"],
			name: "doc-afterword",
			nameFrom: ["author"],
			superclasses: ["landmark"]
		},
		{
			internalRoles: ["kDocAppendix"],
			name: "doc-appendix",
			nameFrom: ["author"],
			superclasses: ["landmark"]
		},
		{
			internalRoles: ["kDocBackLink"],
			name: "doc-backlink",
			nameFrom: ["contents", "author"],
			superclasses: ["link"]
		},
		{
			internalRoles: ["kDocBiblioEntry"],
			name: "doc-biblioentry",
			nameFrom: ["author"],
			superclasses: ["listitem"]
		},
		{
			internalRoles: ["kDocBibliography"],
			name: "doc-bibliography",
			nameFrom: ["author"],
			superclasses: ["landmark"]
		},
		{
			internalRoles: ["kDocBiblioRef"],
			name: "doc-biblioref",
			nameFrom: ["contents", "author"],
			superclasses: ["link"]
		},
		{
			internalRoles: ["kDocChapter"],
			name: "doc-chapter",
			nameFrom: ["author"],
			superclasses: ["landmark"]
		},
		{
			internalRoles: ["kDocColophon"],
			name: "doc-colophon",
			nameFrom: ["author"],
			superclasses: ["section"]
		},
		{
			internalRoles: ["kDocConclusion"],
			name: "doc-conclusion",
			nameFrom: ["author"],
			superclasses: ["landmark"]
		},
		{
			internalRoles: ["kDocCover"],
			name: "doc-cover",
			nameFrom: ["author"],
			superclasses: ["img"]
		},
		{
			internalRoles: ["kDocCredit"],
			name: "doc-credit",
			nameFrom: ["author"],
			superclasses: ["section"]
		},
		{
			internalRoles: ["kDocCredits"],
			name: "doc-credits",
			nameFrom: ["author"],
			superclasses: ["landmark"]
		},
		{
			internalRoles: ["kDocDedication"],
			name: "doc-dedication",
			nameFrom: ["author"],
			superclasses: ["section"]
		},
		{
			internalRoles: ["kDocEndnote"],
			name: "doc-endnote",
			nameFrom: ["author"],
			superclasses: ["listitem"]
		},
		{
			internalRoles: ["kDocEndnotes"],
			name: "doc-endnotes",
			nameFrom: ["author"],
			superclasses: ["landmark"]
		},
		{
			internalRoles: ["kDocEpigraph"],
			name: "doc-epigraph",
			nameFrom: ["author"],
			superclasses: ["section"]
		},
		{
			internalRoles: ["kDocEpilogue"],
			name: "doc-epilogue",
			nameFrom: ["author"],
			superclasses: ["landmark"]
		},
		{
			internalRoles: ["kDocErrata"],
			name: "doc-errata",
			nameFrom: ["author"],
			superclasses: ["landmark"]
		},
		{
			internalRoles: ["kDocExample"],
			name: "doc-example",
			nameFrom: ["author"],
			superclasses: ["section"]
		},
		{
			internalRoles: ["kDocFootnote"],
			name: "doc-footnote",
			nameFrom: ["author"],
			superclasses: ["section"]
		},
		{
			internalRoles: ["kDocForeword"],
			name: "doc-foreword",
			nameFrom: ["author"],
			superclasses: ["landmark"]
		},
		{
			internalRoles: ["kDocGlossary"],
			name: "doc-glossary",
			nameFrom: ["author"],
			superclasses: ["landmark"]
		},
		{
			internalRoles: ["kDocGlossRef"],
			name: "doc-glossref",
			nameFrom: ["contents", "author"],
			superclasses: ["link"]
		},
		{
			internalRoles: ["kDocIndex"],
			name: "doc-index",
			nameFrom: ["author"],
			superclasses: ["navigation"]
		},
		{
			internalRoles: ["kDocIntroduction"],
			name: "doc-introduction",
			nameFrom: ["author"],
			superclasses: ["landmark"]
		},
		{
			internalRoles: ["kDocNoteRef"],
			name: "doc-noteref",
			nameFrom: ["contents", "author"],
			superclasses: ["link"]
		},
		{
			internalRoles: ["kDocNotice"],
			name: "doc-notice",
			nameFrom: ["author"],
			superclasses: ["note"]
		},
		{
			internalRoles: ["kDocPageBreak"],
			name: "doc-pagebreak",
			nameFrom: ["author"],
			superclasses: ["separator"]
		},
		{
			internalRoles: ["kDocPageFooter"],
			name: "doc-pagefooter",
			nameFrom: ["author"],
			superclasses: ["contentinfo"]
		},
		{
			internalRoles: ["kDocPageHeader"],
			name: "doc-pageheader",
			nameFrom: ["author"],
			superclasses: ["banner"]
		},
		{
			internalRoles: ["kDocPageList"],
			name: "doc-pagelist",
			nameFrom: ["author"],
			superclasses: ["navigation"]
		},
		{
			internalRoles: ["kDocPart"],
			name: "doc-part",
			nameFrom: ["author"],
			superclasses: ["landmark"]
		},
		{
			internalRoles: ["kDocPreface"],
			name: "doc-preface",
			nameFrom: ["author"],
			superclasses: ["landmark"]
		},
		{
			internalRoles: ["kDocPrologue"],
			name: "doc-prologue",
			nameFrom: ["author"],
			superclasses: ["landmark"]
		},
		{
			internalRoles: ["kDocPullquote"],
			name: "doc-pullquote",
			nameFrom: ["author"],
			superclasses: ["section"]
		},
		{
			internalRoles: ["kDocQna"],
			name: "doc-qna",
			nameFrom: ["author"],
			superclasses: ["section"]
		},
		{
			internalRoles: ["kDocSubtitle"],
			name: "doc-subtitle",
			nameFrom: ["contents", "author"],
			superclasses: ["sectionhead"]
		},
		{
			internalRoles: ["kDocTip"],
			name: "doc-tip",
			nameFrom: ["author"],
			superclasses: ["note"]
		},
		{
			internalRoles: ["kDocToc"],
			name: "doc-toc",
			nameFrom: ["author"],
			superclasses: ["navigation"]
		},
		{
			internalRoles: ["kGraphicsDocument"],
			name: "graphics-document",
			nameFrom: ["author"],
			superclasses: ["document"]
		},
		{
			internalRoles: ["kGraphicsObject"],
			name: "graphics-object",
			nameFrom: ["contents", "author"],
			superclasses: ["group"]
		},
		{
			internalRoles: ["kGraphicsSymbol"],
			name: "graphics-symbol",
			nameFrom: ["author"],
			superclasses: ["img"]
		}
	]
}, we = /* @__PURE__ */ e({
	ARIAMetadata: () => B,
	Attribute: () => U,
	ariaMetadata: () => H
}), B = class {
	attributes;
	roleNames;
	constructor(e) {
		this.attributes = /* @__PURE__ */ new Map(), this.roleNames = [], e && this.initialize(e);
	}
	initialize(e) {
		let t = e.attributes, n = ["true", "false"];
		for (let e of t) e.type === "boolean" && (e.enum = n), this.attributes.set(e.name, new U(e));
		this.roleNames = e.roles.map((e) => e.name);
	}
	valuesForProperty(e) {
		let t = this.attributes.get(e);
		return t ? t.getEnum() : e === "role" ? this.roleNames : [];
	}
}, V;
function H() {
	return V ||= new B(Ce || null), V;
}
var U = class {
	enum;
	constructor(e) {
		this.enum = [], e.enum && (this.enum = e.enum);
	}
	getEnum() {
		return this.enum;
	}
}, Te = /* @__PURE__ */ e({
	ARIAAttributesPane: () => J,
	DEFAULT_VIEW: () => q
}), W = {
	ariaAttributes: "ARIA Attributes",
	noAriaAttributes: "No ARIA attributes"
}, Ee = i("panels/accessibility/ARIAAttributesView.ts", W), G = r.bind(void 0, Ee), { render: De, html: K } = l, { widget: Oe } = se, q = (e, t, n) => {
	let r = (t, n) => {
		n.consume(!0), e.onStartEditing(t);
	}, i = (t) => {
		let n = e.propertyCompletions.get(t);
		return n?.length ? K`<datalist id=completions>
      ${n.map((e) => K`<option>${e}</option>`)}
    </datalist>` : f;
	};
	De(e.attributes.length === 0 ? K`
          <style>${O}</style>
          <devtools-widget
            ${Oe(c, { text: G(W.noAriaAttributes) })}
            class="gray-info-message info-message-overflow"></devtools-widget>` : K`<devtools-tree
           hide-overflow
           .template=${K`
             <ul role="tree">
              ${e.attributes?.map((t) => K`
                <li role="treeitem">
                  <style>${O}</style>
                  <span class="ax-name monospace" @mousedown=${r.bind(null, t)}>
                    ${t.name}
                  </span>
                  <span class="separator" @mousedown=${r.bind(null, t)}>${":\xA0"}</span>
                  <devtools-prompt
                    completions=completions
                    class="monospace"
                    @mousedown=${r.bind(null, t)}
                    .completionTimeout=${0}
                    ?editing=${e.attributeBeingEdited === t}
                    @commit=${(n) => e.onCommitEditing(t, n.detail)}
                    @cancel=${() => e.onCancelEditing(t)}>
                      ${pe(t.value, 1e4)}
                      ${i(t)}
                  </devtools-prompt>
                </li>`)}
             </ul>
           `}></devtools-tree>`, n, { container: { attributes: { jslog: `${v("aria-attributes")}` } } });
}, J = class extends k {
	#e;
	#t = null;
	constructor(e = q) {
		super({
			title: G(W.ariaAttributes),
			viewId: "aria-attributes",
			useShadowDom: "pure"
		}), this.#e = e;
	}
	setNode(e) {
		super.setNode(e), this.requestUpdate();
	}
	performUpdate() {
		let e = (e) => {
			this.#t = e, this.requestUpdate();
		}, t = (e) => {
			e === this.#t && (this.#t = null), this.requestUpdate();
		}, n = (e, t) => {
			let n = this.node();
			n && e.value !== t && n.setAttributeValue(e.name, t), e === this.#t && (this.#t = null), this.requestUpdate();
		}, r = this.node()?.attributes()?.filter((e) => this.isARIAAttribute(e)) ?? [], i = new Map(r.map((e) => [e, H().valuesForProperty(e.name)])), a = {
			attributeBeingEdited: this.#t,
			attributes: r,
			onStartEditing: e,
			onCommitEditing: n,
			onCancelEditing: t,
			propertyCompletions: i
		};
		this.#e(a, {}, this.contentElement);
	}
	isARIAAttribute(e) {
		return ee.has(e.name);
	}
}, Y = {
	sourceOrderViewer: "Source Order Viewer",
	noSourceOrderInformation: "No source order information available",
	thereMayBeADelayInDisplaying: "There may be a delay in displaying source order for elements with many children",
	showSourceOrder: "Show source order"
}, ke = i("panels/accessibility/SourceOrderView.ts", Y), X = r.bind(void 0, ke), Ae = 300, je = (e, t, n) => {
	function r(t) {
		let n = t.currentTarget;
		e.onShowSourceOrderChanged(n.checked), t.consume();
	}
	s(u`
    ${e.showSourceOrder === void 0 ? u`
        <div class="gray-info-message info-message-overflow">
          ${X(Y.noSourceOrderInformation)}
        </div>
      ` : u`
      ${e.childCount >= Ae ? u`
          <div class="gray-info-message info-message-overflow"
                id="source-order-warning">
            ${X(Y.thereMayBeADelayInDisplaying)}
          </div>
        ` : f}
      <devtools-checkbox class="source-order-checkbox"
                          jslog=${ae().track({ click: !0 })}
                          ?checked=${e.showSourceOrder}
                          @change=${r}>
        ${X(Y.showSourceOrder)}
      </devtools-checkbox>
      `}
  `, n, { container: { attributes: { jslog: `${v("source-order-viewer")}` } } });
}, Me = class extends k {
	#e = 0;
	#t = void 0;
	#n;
	constructor(e = je) {
		super({
			title: X(Y.sourceOrderViewer),
			viewId: "source-order-viewer",
			useShadowDom: "pure"
		}), this.#n = e;
	}
	async setNodeAsync(e) {
		this.nodeInternal && this.#t && this.nodeInternal.domModel().overlayModel().hideSourceOrderInOverlay(), super.setNode(e), this.#e = this.nodeInternal?.childNodeCount() ?? 0, !this.nodeInternal || !this.#e ? this.#t = void 0 : (this.nodeInternal.children() || await this.nodeInternal.getSubtree(1, !1), this.nodeInternal.children().some((e) => e.nodeType() === Node.ELEMENT_NODE) ? this.#t === void 0 && (this.#t = !1) : this.#t = void 0, this.#t && this.nodeInternal.domModel().overlayModel().highlightSourceOrderInOverlay(this.nodeInternal)), this.requestUpdate();
	}
	async performUpdate() {
		let e = {
			childCount: this.#e,
			showSourceOrder: this.#t,
			onShowSourceOrderChanged: (e) => {
				if (!this.nodeInternal) {
					this.#t = void 0;
					return;
				}
				e ? this.nodeInternal.domModel().overlayModel().highlightSourceOrderInOverlay(this.nodeInternal) : this.nodeInternal.domModel().overlayModel().hideSourceOrderInOverlay(), this.#t = e;
			}
		};
		this.#n(e, void 0, this.contentElement);
	}
}, Ne = /* @__PURE__ */ e({ AccessibilitySidebarView: () => Le }), { html: Pe, render: Fe } = l, Z = { showAccessibilityTree: "Show accessibility tree" }, Ie = i("panels/accessibility/AccessibilitySidebarView.ts", Z), Q = r.bind(void 0, Ie), $, Le = class e extends ie {
	#e;
	#t;
	skipNextPullNode;
	sidebarPaneStack;
	ariaSubPane;
	axNodeSubPane;
	sourceOrderSubPane;
	toggleContainer;
	toggleAction;
	constructor() {
		super(), this.registerRequiredCSS(Se), this.element.classList.add("accessibility-sidebar-view"), this.#e = null, this.#t = null, this.skipNextPullNode = !1, this.sidebarPaneStack = ce.instance().createStackLocation(), this.toggleContainer = document.createElement("div"), this.toggleContainer.classList.add("accessibility-toggle-container"), this.element.appendChild(this.toggleContainer), this.toggleAction = ue.instance().getAction("elements.toggle-a11y-tree"), this.toggleAction.addEventListener(te.TOGGLED, this.updateToggle, this), this.updateToggle(), this.ariaSubPane = new J(), this.sidebarPaneStack.showView(this.ariaSubPane), this.axNodeSubPane = new N(), this.sidebarPaneStack.showView(this.axNodeSubPane), this.sourceOrderSubPane = new Me(), this.sidebarPaneStack.showView(this.sourceOrderSubPane), this.sidebarPaneStack.widget().show(this.element), h.instance().addFlavorChangeListener(_, this.pullNode, this), this.pullNode();
	}
	static instance(t) {
		return (!$ || t?.forceNew) && ($ = new e()), $;
	}
	node() {
		return this.#e;
	}
	axNode() {
		return this.#t;
	}
	setNode(e, t) {
		this.skipNextPullNode = !!t, this.#e = e, this.requestUpdate();
	}
	accessibilityNodeCallback(e) {
		e && (this.#t = e, e.isDOMNode() ? this.sidebarPaneStack.showView(this.ariaSubPane, this.axNodeSubPane) : this.sidebarPaneStack.removeView(this.ariaSubPane), this.axNodeSubPane.setAXNode(e));
	}
	async performUpdate() {
		let e = this.node();
		if (this.axNodeSubPane.setNode(e), this.ariaSubPane.setNode(e), this.sourceOrderSubPane.setNodeAsync(e), !e) return;
		let t = e.domModel().target().model(ne);
		t && (await t.requestPartialAXTree(e), this.accessibilityNodeCallback(t.axNodeForDOMNode(e)));
	}
	wasShown() {
		super.wasShown(), this.performUpdate(), g.instance().addModelListener(m, y.AttrModified, this.onNodeChange, this, { scoped: !0 }), g.instance().addModelListener(m, y.AttrRemoved, this.onNodeChange, this, { scoped: !0 }), g.instance().addModelListener(m, y.CharacterDataModified, this.onNodeChange, this, { scoped: !0 }), g.instance().addModelListener(m, y.ChildNodeCountUpdated, this.onNodeChange, this, { scoped: !0 });
	}
	willHide() {
		super.willHide(), g.instance().removeModelListener(m, y.AttrModified, this.onNodeChange, this), g.instance().removeModelListener(m, y.AttrRemoved, this.onNodeChange, this), g.instance().removeModelListener(m, y.CharacterDataModified, this.onNodeChange, this), g.instance().removeModelListener(m, y.ChildNodeCountUpdated, this.onNodeChange, this);
	}
	pullNode() {
		if (this.skipNextPullNode) {
			this.skipNextPullNode = !1;
			return;
		}
		this.setNode(h.instance().flavor(_));
	}
	updateToggle() {
		let e = this.toggleAction.toggled();
		Fe(Pe`
      <div style="display: flex; align-items: center; gap: 8px;">
        <devtools-switch
          role="switch"
          aria-label=${Q(Z.showAccessibilityTree)}
          .checked=${e}
          .label=${Q(Z.showAccessibilityTree)}
          .jslogContext=${"elements.toggle-a11y-tree"}
          @switchchange=${this.onToggleChange}
        ></devtools-switch>
        <span style="color: var(--sys-color-on-surface);">${Q(Z.showAccessibilityTree)}</span>
      </div>
    `, this.toggleContainer, { host: this });
	}
	onToggleChange(e) {
		this.toggleAction.execute();
	}
	onNodeChange(e) {
		if (!this.node()) return;
		let t = e.data, n = t instanceof _ ? t : t.node;
		this.node() === n && this.requestUpdate();
	}
};
//#endregion
export { Te as ARIAAttributesView, we as ARIAMetadata, ye as AccessibilityNodeView, Ne as AccessibilitySidebarView, ge as AccessibilityStrings, ve as AccessibilitySubPane };
