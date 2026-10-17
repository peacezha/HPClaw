import { wo as e } from "./legacy-dM_vujv7.js";
import "./theme_support-BJ6jI25-.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/ui/components/helpers/scheduled-render.ts
var t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
function r(r, i) {
	let a = t.get(r);
	if (a !== void 0) {
		if (a.callback !== i) throw TypeError(`Incompatible callback arguments for scheduling rendering of ${r.nodeName.toLowerCase()}`);
		return a.promise;
	}
	let o = e(async () => {
		try {
			n.add(r), t.delete(r), await i.call(r);
		} catch (e) {
			throw console.error(`ScheduledRender: rendering ${r.nodeName.toLowerCase()}:`), console.error(e), e;
		} finally {
			n.delete(r);
		}
	});
	return t.set(r, {
		callback: i,
		promise: o
	}), o;
}
function i(e) {
	return n.has(e);
}
//#endregion
export { r as n, i as t };
