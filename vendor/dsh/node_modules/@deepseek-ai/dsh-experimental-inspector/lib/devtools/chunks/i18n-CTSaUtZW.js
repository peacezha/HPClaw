import { X as e } from "./common-DMSVbaSb.js";
import { Po as t, Wo as n, Zo as r } from "./legacy-dM_vujv7.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/i18n/i18n.ts
var { repeat: i } = n;
function a(t, n, r) {
	let i = t.getLocalizedStringSetFor(e.instance().locale).getMessageFormatterFor(n), a = document.createElement("span");
	for (let e of i.getAst()) if (e.type === 1) {
		let t = r[e.value];
		t && a.append(t);
	} else "value" in e && a.append(String(e.value));
	return a;
}
function o(n, a, o) {
	let s = n.getLocalizedStringSetFor(e.instance().locale).getMessageFormatterFor(a);
	return t`<span>${i(s.getAst(), (e) => e.type === 1 ? o[e.value] ?? r : "value" in e ? String(e.value) : r)}</span>`;
}
//#endregion
export { o as n, a as t };
