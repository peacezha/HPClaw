import { Q as e } from "./common-DMSVbaSb.js";
import { Dl as t, al as n, el as r, gc as i, hc as a, jd as o, ll as s } from "./legacy-dM_vujv7.js";
import "./platform-D4TUCh2P.js";
import { d as c } from "./StringUtilities-CMDxNrEc.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/models/autofill_manager/AutofillManager.ts
var l, u = class u extends e {
	#e = "";
	#t = [];
	#n = [];
	#r = null;
	constructor() {
		super(), o.instance().addModelListener(a, i.ADDRESS_FORM_FILLED, this.#i, this, { scoped: !0 });
	}
	static instance(e = { forceNew: null }) {
		let { forceNew: t } = e;
		return (!l || t) && (l = new u()), l;
	}
	async #i({ data: e }) {
		this.#r = e.autofillModel, this.#a(e.event), this.#e && this.dispatchEventToListeners("AddressFormFilled", {
			address: this.#e,
			filledFields: this.#t,
			matches: this.#n
		});
	}
	getLastFilledAddressForm() {
		return !this.#e || !this.#r ? null : {
			address: this.#e,
			filledFields: this.#t,
			matches: this.#n
		};
	}
	highlightFilledField(e) {
		let i = e.fieldId, a = t.instance().getFrame(e.frameId)?.resourceTreeModel().target();
		if (a) {
			let e = new n(a, i), t = a.model(r);
			e && t && t.overlayModel().highlightInOverlay({ deferredNode: e }, "all");
		}
	}
	clearHighlightedFilledFields() {
		s.hideDOMNodeHighlight();
	}
	#a({ addressUi: e, filledFields: t }) {
		let n = (e) => e.fields.filter((e) => e.value.length).map((e) => e.value).join(" ");
		this.#e = e.addressFields.map((e) => n(e)).filter((e) => e.length).join("\n"), this.#t = t, this.#n = [];
		for (let e = 0; e < this.#t.length; e++) {
			if (this.#t[e].value === "") continue;
			let t = c(this.#t[e].value.replaceAll(/\s/g, " ")).replaceAll(/([.,]+)\s/g, "$1? "), n = this.#e.replaceAll(/\s/g, " ").matchAll(new RegExp(t, "g"));
			for (let t of n) t.index !== void 0 && this.#n.push({
				startIndex: t.index,
				endIndex: t.index + t[0].length,
				filledFieldIndex: e
			});
		}
	}
}, d = /* @__PURE__ */ function(e) {
	return e.ADDRESS_FORM_FILLED = "AddressFormFilled", e;
}({});
//#endregion
export { d as n, u as t };
