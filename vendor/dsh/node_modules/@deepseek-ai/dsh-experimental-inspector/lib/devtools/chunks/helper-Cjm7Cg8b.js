import { Uc as e, hd as t, rf as n } from "./legacy-dM_vujv7.js";
import { Wt as r } from "./common-Bs7hSOUj.js";
//#region node_modules/.pnpm/chrome-devtools-frontend@1.0.1638082/node_modules/chrome-devtools-frontend/front_end/panels/application/preloading/helper/PreloadingForward.ts
var i = class {
	ruleSetId;
	constructor(e) {
		this.ruleSetId = e;
	}
}, a = class {
	ruleSetId;
	constructor(e) {
		this.ruleSetId = e;
	}
};
function o(e) {
	switch (e.action) {
		case n.SpeculationAction.Prefetch: return s(e.requestId);
		case n.SpeculationAction.Prerender:
		case n.SpeculationAction.PrerenderUntilScript: return c(e.key.loaderId);
	}
}
function s(e) {
	let t = r.instance().requestsForId(e);
	if (t.length > 0) return t[t.length - 1].statusCode;
}
function c(n) {
	let r = e.frames().find((e) => e.loaderId === n);
	if (!r) return;
	let i = r.resourceTreeModel().target().model(t)?.requestForLoaderId(n);
	return i?.statusCode === 0 ? void 0 : i?.statusCode;
}
//#endregion
export { i as n, o as r, a as t };
